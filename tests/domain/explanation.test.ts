import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createGuidance, createGuidanceWithExplanation } from "../../src/application/guidance.ts";
import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { demoScenario } from "../../src/demo/scenarios.ts";
import { evaluateEligibility, evaluateEligibilityWithExplanation, RULE_EXECUTORS, RULE_IDS } from "../../src/domain/rules.ts";
import { EMPTY_JOURNEY, evaluateJourneyGuidance, journeyGuidanceResult } from "../../src/m2/journey.ts";
import { renderStudentGuidancePage } from "../../src/ui/student-guidance.ts";
import { studentProfile } from "./fixtures.ts";

const request = demoScenario("eligible").eligibility_request;
const profile = demoScenario("eligible").profile;
const load = (name: string) => readFileSync(new URL(`../../data/${name}`, import.meta.url), "utf8");
const runtime = createPilotRuntime({ sources_csv: load("sources.csv"), colleges_csv: load("colleges.csv"), programmes_csv: load("programmes.csv") });

test("check-owned blockers are captured from each evaluation, separately from aggregate additions", () => {
  const evaluated = evaluateEligibilityWithExplanation(studentProfile(), { ...request, govt_school_7_5_entitlement_requested: true });
  assert.deepEqual(evaluated.explanation.check_blockers.map(({ rule_id }) => rule_id), evaluated.result.checks.map(({ rule_id }) => rule_id));
  const qualifying = evaluated.explanation.check_blockers.find(({ rule_id }) => rule_id === "ELG001");
  assert.deepEqual(qualifying?.blocking_fields, ["qualifying_stream"]);
  for (const entry of evaluated.explanation.check_blockers) {
    assert.equal(evaluated.result.checks[entry.check_index].rule_id, entry.rule_id);
    assert.ok(!entry.blocking_fields.includes("govt_school_7_5_entitlement"));
  }
  assert.deepEqual(evaluated.explanation.aggregate_blockers, [{ field: "govt_school_7_5_entitlement", origin: "AGGREGATION" }]);
});

test("global blockers preserve first-seen order, with community and entitlement kept global", () => {
  const input = { ...profile, physics_mark: null, community: null };
  const evaluated = evaluateEligibilityWithExplanation(input, { ...request, govt_school_7_5_entitlement_requested: true });
  assert.deepEqual(evaluated.explanation.aggregate_blockers, [
    { field: "community", origin: "AGGREGATION" },
    { field: "govt_school_7_5_entitlement", origin: "AGGREGATION" },
  ]);
  assert.deepEqual(evaluated.explanation.check_blockers.find(({ rule_id }) => rule_id === "ELG007")?.blocking_fields, ["effective_physics_mark"]);
  assert.deepEqual(evaluated.explanation.check_blockers.find(({ rule_id }) => rule_id === "ELG009")?.blocking_fields, ["effective_physics_mark"]);
  const combined = [...new Set([
    ...evaluated.explanation.check_blockers.flatMap(({ blocking_fields }) => blocking_fields),
    ...evaluated.explanation.aggregate_blockers.map(({ field }) => field),
  ])];
  assert.deepEqual(evaluated.result.blocking_missing_fields, combined);
  assert.deepEqual(evaluated.result.blocking_missing_fields, evaluateEligibility(input, { ...request, govt_school_7_5_entitlement_requested: true }).blocking_missing_fields);
});

test("normal academic cutoff trace copies selected values, origins and produced score", () => {
  const evaluated = evaluateEligibilityWithExplanation(profile, request);
  assert.equal(evaluated.result.cutoff, 165);
  assert.equal(evaluated.result.outcome, "ELIGIBLE");
  assert.deepEqual(evaluated.explanation.cutoff_trace, {
    status: "AVAILABLE", calculation_id: "TNEA_ACADEMIC_CUTOFF",
    operands: [
      { subject: "maths", value: 90, input_field: "maths_mark" },
      { subject: "physics", value: 80, input_field: "physics_mark" },
      { subject: "chemistry", value: 70, input_field: "chemistry_mark" },
    ], result: 165,
  });
});

test("legacy direct rule consumers without origin metadata remain compatible", () => {
  const evaluated = RULE_EXECUTORS.ELG009(profile, request, { academic: [90, 80, 70], vocational: [null, null, null] });
  assert.equal(evaluated?.cutoff, 165);
  assert.equal(evaluated?.check.outcome, "ELIGIBLE");
  assert.deepEqual(evaluated?.cutoffTrace?.operands.map(({ input_field }) => input_field), [null, null, null]);
});

test("improvement trace uses original marks from the existing selection, not proposed improved marks", () => {
  const evaluated = evaluateEligibilityWithExplanation({
    ...profile, improvement_marks_used: true, improvement_marks_year: 2006,
    maths_mark: 100, physics_mark: 100, chemistry_mark: 100,
    original_maths_mark: 86, original_physics_mark: 78, original_chemistry_mark: 81,
  }, request);
  const trace = evaluated.explanation.cutoff_trace;
  assert.equal(evaluated.result.cutoff, 165.5);
  assert.equal(trace.status, "AVAILABLE");
  assert.deepEqual(trace.operands.map(({ value }) => value), [86, 78, 81]);
  assert.deepEqual(trace.operands.map(({ input_field }) => input_field), ["original_maths_mark", "original_physics_mark", "original_chemistry_mark"]);
  assert.equal(trace.result, evaluated.result.cutoff);
  const beforeProhibition = evaluateEligibilityWithExplanation({ ...profile, improvement_marks_used: true, improvement_marks_year: 2005 }, request);
  assert.equal(beforeProhibition.explanation.cutoff_trace.operands[0].input_field, "maths_mark");
});

test("missing marks, unknown selection and unsupported stream never fabricate a completed trace", () => {
  for (const input of [
    { ...profile, physics_mark: null },
    { ...profile, improvement_marks_used: null },
    { ...profile, improvement_marks_used: true, improvement_marks_year: null },
    { ...profile, improvement_marks_used: true, improvement_marks_year: 2006, original_maths_mark: 86 },
  ]) {
    const evaluated = evaluateEligibilityWithExplanation(input, request);
    assert.equal(evaluated.result.cutoff, null);
    assert.equal(evaluated.explanation.cutoff_trace.status, "UNAVAILABLE");
    assert.equal(evaluated.explanation.cutoff_trace.result, null);
    assert.ok(evaluated.explanation.cutoff_trace.operands.some(({ value }) => value === null));
  }
  const unknownSelection = evaluateEligibilityWithExplanation({ ...profile, improvement_marks_used: null }, request);
  assert.deepEqual(unknownSelection.explanation.cutoff_trace.operands.map(({ input_field }) => input_field), [null, null, null]);
  const unsupported = evaluateEligibilityWithExplanation(studentProfile(), request);
  assert.deepEqual(unsupported.explanation.cutoff_trace.operands, []);
  const notRequested = evaluateEligibilityWithExplanation(profile, { ...request, academic_merit_cutoff_requested: false });
  assert.deepEqual(notRequested.explanation.cutoff_trace, { status: "NOT_REQUESTED", calculation_id: null, operands: [], result: null });
  const zero = evaluateEligibilityWithExplanation({ ...profile, maths_mark: 0 }, request);
  assert.equal(zero.explanation.cutoff_trace.operands[0].value, 0);
  assert.equal(zero.explanation.cutoff_trace.result, zero.result.cutoff);
});

test("opt-in guidance sidecar executes each existing rule once, including negative early return", (t) => {
  const spies = RULE_IDS.map((ruleId) => t.mock.method(RULE_EXECUTORS, ruleId));
  for (const scenario of ["eligible", "ineligible"] as const) {
    const before = spies.map((spy) => spy.mock.callCount());
    const evaluated = createGuidanceWithExplanation(demoScenario(scenario), runtime);
    assert.equal(evaluated.explanation.version, 1);
    spies.forEach((spy, index) => assert.equal(spy.mock.callCount() - before[index], 1, RULE_IDS[index]));
    assert.deepEqual(evaluated.explanation.check_blockers.map(({ rule_id }) => rule_id), evaluated.result.eligibility.matched_rule_ids);
  }
});

test("legacy consumers retain exact field shapes/results for all existing demo cases", () => {
  for (const scenario of ["eligible", "ineligible", "needs-review", "unknown-vacancy"] as const) {
    const input = demoScenario(scenario);
    const legacy = createGuidance(input, runtime);
    assert.deepEqual(createGuidanceWithExplanation(input, runtime).result, legacy);
    assert.deepEqual(Object.keys(legacy), ["eligibility", "selected_snapshot_id", "selected_snapshot_stage", "ordered_choices", "provenance"]);
    assert.deepEqual(Object.keys(legacy.eligibility), ["outcome", "cutoff", "checks", "blocking_missing_fields", "matched_rule_ids"]);
    assert.ok(!JSON.stringify(legacy).includes("cutoff_trace"));
  }
});

test("journey transports one associated sidecar internally and preserves 165.5 plus uncertainty", () => {
  const state = { ...EMPTY_JOURNEY, year: 2026 as const, stream: "academic" as const, improvement: false, maths: 86, physics: 78, chemistry: 81 };
  const evaluation = evaluateJourneyGuidance(state, runtime);
  assert.deepEqual(evaluation.result, journeyGuidanceResult(state, runtime));
  assert.equal(evaluation.result?.eligibility.cutoff, 165.5);
  assert.equal(evaluation.result?.eligibility.outcome, "NEEDS_REVIEW");
  assert.equal(evaluation.explanation?.cutoff_trace.result, 165.5);
  assert.equal(evaluateJourneyGuidance({ ...state, physics: "unknown" }, runtime).explanation?.cutoff_trace.status, "UNAVAILABLE");
  assert.equal(evaluateJourneyGuidance({ ...state, year: "other" }, runtime).explanation, null);
});

test("current student rendering receives no new raw sidecar fields", () => {
  const input = demoScenario("eligible");
  const evaluation = createGuidanceWithExplanation(input, runtime);
  const page = renderStudentGuidancePage({ form: input, response: { ok: true, result: evaluation.result } });
  assert.doesNotMatch(page, /cutoff_trace|check_blockers|aggregate_blockers|academic_origins|TNEA_ACADEMIC_CUTOFF|input_field/);
});

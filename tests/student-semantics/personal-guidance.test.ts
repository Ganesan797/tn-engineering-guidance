import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { createGuidance } from "../../src/application/guidance.ts";
import { demoScenario } from "../../src/demo/scenarios.ts";
import { answerJourneyQuestion, EMPTY_JOURNEY, evaluateJourneyGuidance, journeyGuidanceResult, nextJourneyQuestion, retryUnknown, type JourneyState } from "../../src/m2/journey.ts";
import { PERSONAL_GUIDANCE_MESSAGES, resolvePersonalGuidanceMessage, toPersonalGuidanceFoundation } from "../../src/student-semantics/personal-guidance.ts";

const load = (path: string) => readFileSync(new URL(`../../data/${path}`, import.meta.url), "utf8");
const runtime = createPilotRuntime({ sources_csv: load("sources.csv"), colleges_csv: load("colleges.csv"), programmes_csv: load("programmes.csv") });
const complete = ["2026", "academic", "no", "86", "78", "81"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
const view = (state: JourneyState) => toPersonalGuidanceFoundation(evaluateJourneyGuidance(state, runtime));

test("context distinguishes unanswered, unknown and supplied false without inventing missing answers", () => {
  const blank = evaluateJourneyGuidance(EMPTY_JOURNEY, runtime);
  assert.equal(blank.context.inputs.year, "UNANSWERED");
  assert.equal(view(EMPTY_JOURNEY).primary.category, "MISSING_INFORMATION");
  assert.equal(view({ ...EMPTY_JOURNEY, year: "unknown" }).primary.category, "UNKNOWN_INFORMATION");
  const known = evaluateJourneyGuidance(complete, runtime);
  assert.equal(known.context.answers.improvement, false);
  assert.equal(known.context.inputs.improvement, "SUPPLIED");
  assert.equal(known.context.answers.improvement_year, null);
  assert.equal(known.context.inputs.improvement_year, "UNANSWERED");
  assert.equal(known.context.next_question, null);
});

test("unsupported year and stream are scope limits, not missing information or inferred diploma", () => {
  for (const state of [{ ...EMPTY_JOURNEY, year: "other" as const }, { ...EMPTY_JOURNEY, year: 2026 as const, stream: "other" as const }]) {
    const mapped = view(state);
    assert.equal(mapped.evaluation.result, null);
    assert.equal(mapped.primary.category, "UNSUPPORTED_SCOPE");
    assert.equal(mapped.primary_action.kind, "CHECK_OFFICIAL_SCOPE");
    assert.doesNotMatch(resolvePersonalGuidanceMessage(mapped.primary.message, "en"), /diploma/i);
  }
});

test("unknown/null marks preserve unavailable cutoff and have distinct actions", () => {
  const unanswered = view({ ...complete, physics: null });
  const unknown = view({ ...complete, physics: "unknown" });
  assert.equal(unanswered.cutoff, null);
  assert.equal(unknown.cutoff, null);
  assert.equal(unanswered.primary.category, "MISSING_INFORMATION");
  assert.equal(unanswered.primary_action.kind, "PROVIDE_EXISTING_INPUT");
  assert.equal(unknown.primary.category, "UNKNOWN_INFORMATION");
  assert.equal(unknown.primary_action.kind, "RETRY_WHEN_KNOWN");
  assert.equal(unknown.evaluation.result?.eligibility.outcome, "NEEDS_REVIEW");
});

test("same NEEDS_REVIEW is explained differently by context without changing trusted results", () => {
  const mapped = view(complete);
  assert.equal(mapped.cutoff, 165.5);
  assert.equal(mapped.evaluation.result?.eligibility.outcome, "NEEDS_REVIEW");
  assert.equal(mapped.primary.category, "UNRESOLVED_CHECK");
  assert.equal(mapped.primary_action.kind, "VERIFY_CONDITION");
  assert.equal(mapped.cutoff_eligibility_limit, "cutoff_unresolved");
  assert.equal(mapped.human_review, "PENDING");
});

test("validated context is a snapshot associated with the existing result", () => {
  const mutable = { ...complete };
  const evaluated = evaluateJourneyGuidance(mutable, runtime);
  mutable.maths = 0;
  assert.equal(evaluated.context.answers.maths, 86);
  assert.equal(evaluated.result?.eligibility.cutoff, 165.5);
  assert.ok(Object.isFrozen(evaluated.context.answers));
  assert.throws(() => evaluateJourneyGuidance({ ...complete, maths: 999 }, runtime));
});

test("reason-sensitive mapping uses explicit codes and neutral fallback, never backend prose", () => {
  const evaluated = evaluateJourneyGuidance(complete, runtime);
  assert.ok(evaluated.result);
  const source = evaluated.result.eligibility.checks[0];
  const checks = [
    { ...source, outcome: "NEEDS_REVIEW" as const, rule_id: "ELG032", reason_code: "ELG032_REQUIRED_ORIGINAL_MARKS_UNAVAILABLE" },
    { ...source, outcome: "NEEDS_REVIEW" as const, rule_id: "ELG010", reason_code: "ELG010_NORMALIZATION_FORMULA_NOT_DEFINED" },
    { ...source, outcome: "NEEDS_REVIEW" as const, reason_code: "UNMAPPED", explanation: "ELG999 SRC999 backend_predicate" },
  ];
  const mapped = toPersonalGuidanceFoundation({ ...evaluated, result: { ...evaluated.result, eligibility: { ...evaluated.result.eligibility, checks } } });
  assert.deepEqual(mapped.checks.map(({ category }) => category), ["MISSING_INFORMATION", "UNRESOLVED_CHECK", "UNRESOLVED_CHECK"]);
  assert.deepEqual(mapped.checks.map(({ message }) => message), ["original_marks", "normalization", "unresolved"]);
  assert.equal(mapped.primary_action.kind, "VERIFY_CONDITION");
});

test("a real failed-check fixture keeps negative status and uses neutral bilingual action wording", () => {
  const evaluated = evaluateJourneyGuidance({ ...complete, maths: 10, physics: 10, chemistry: 10 }, runtime);
  // Existing demo supplies the broader profile facts required for a real negative check.
  const result = createGuidance(demoScenario("ineligible"), runtime);
  assert.equal(result.eligibility.outcome, "INELIGIBLE");
  const failedCheck = result.eligibility.checks.find((check) => check.outcome === "INELIGIBLE");
  assert.ok(failedCheck);
  const mapped = toPersonalGuidanceFoundation({ ...evaluated, result });
  assert.equal(mapped.primary.category, "KNOWN_NEGATIVE_RESULT");
  assert.equal(mapped.primary_action.kind, "VERIFY_CONDITION");
  assert.equal(mapped.checks.find((check) => check.trace.rule_id === failedCheck.rule_id)?.category, "KNOWN_NEGATIVE_RESULT");
  assert.equal(mapped.cutoff, result.eligibility.cutoff);
  assert.equal(resolvePersonalGuidanceMessage(mapped.primary_action.message, "en"), "Check this condition against the official guidance.");
  assert.equal(resolvePersonalGuidanceMessage(mapped.primary_action.message, "ta"), "இந்த நிபந்தனையை அதிகாரப்பூர்வ வழிகாட்டலுடன் சரிபாருங்கள்.");
});

test("earlier unanswered improvement takes priority over later unknown Physics using existing navigation", () => {
  const state: JourneyState = { ...EMPTY_JOURNEY, year: 2026, stream: "academic", physics: "unknown" };
  const evaluation = evaluateJourneyGuidance(state, runtime);
  const mapped = toPersonalGuidanceFoundation(evaluation);
  assert.equal(nextJourneyQuestion(state), "improvement");
  assert.equal(evaluation.context.next_question, "improvement");
  assert.equal(evaluation.context.retry_question, null);
  assert.equal(evaluation.context.inputs.physics, "UNKNOWN");
  assert.equal(mapped.primary.category, "MISSING_INFORMATION");
  assert.deepEqual(mapped.primary_action, { kind: "PROVIDE_EXISTING_INPUT", message: "provide", field: "improvement" });
  assert.deepEqual(evaluation.result, journeyGuidanceResult(state, runtime));
  assert.equal(nextJourneyQuestion(retryUnknown(state)), "improvement");
});

test("Tamil/English resolve identical semantic keys, categories and actions without technical leakage", () => {
  for (const [key, pair] of Object.entries(PERSONAL_GUIDANCE_MESSAGES)) {
    assert.ok(pair.ta.length > 0 && pair.en.length > 0, key);
    assert.doesNotMatch(pair.ta + pair.en, /ELG\d|SRC\d|NEEDS_REVIEW|UNKNOWN_OR_UNPUBLISHED|predicate|blocking_missing|maths_mark/);
  }
  for (const state of [complete, EMPTY_JOURNEY, { ...complete, physics: "unknown" as const }, { ...EMPTY_JOURNEY, year: "other" as const }]) {
    const mapped = view(state);
    const before = JSON.stringify(mapped);
    for (const lang of ["ta", "en"] as const) {
      assert.ok(resolvePersonalGuidanceMessage(mapped.primary.message, lang));
      assert.ok(resolvePersonalGuidanceMessage(mapped.primary_action.message, lang));
    }
    assert.equal(JSON.stringify(mapped), before);
  }
});

test("existing outputs remain identical for supported, incomplete and improvement cases", () => {
  for (const state of [complete, { ...complete, physics: "unknown" as const }, { ...complete, physics: null }, { ...complete, improvement: true, improvement_year: 2006 }, { ...EMPTY_JOURNEY, year: "other" as const }]) {
    const original = journeyGuidanceResult(state, runtime);
    const evaluated = evaluateJourneyGuidance(state, runtime);
    assert.deepEqual(evaluated.result, original);
    const before = JSON.stringify(evaluated.result);
    toPersonalGuidanceFoundation(evaluated);
    assert.equal(JSON.stringify(evaluated.result), before);
  }
});

test("retry retains known marks and resumes the existing question", () => {
  const state = { ...complete, physics: "unknown" as const, chemistry: null };
  const retried = retryUnknown(state);
  assert.equal(retried.maths, 86);
  assert.equal(retried.physics, null);
  assert.equal(nextJourneyQuestion(retried), "physics");
  assert.equal(evaluateJourneyGuidance(retried, runtime).context.next_question, "physics");
  assert.equal(evaluateJourneyGuidance(state, runtime).context.retry_question, "physics");
  assert.equal(evaluateJourneyGuidance(retried, runtime).context.retry_question, null);
});

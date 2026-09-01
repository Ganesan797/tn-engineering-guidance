import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { handleGuidanceJson, type GuidanceApiResponse } from "../../src/api/index.ts";
import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { demoScenario } from "../../src/demo/scenarios.ts";
import { renderStudentGuidancePage, submitStudentGuidanceForm } from "../../src/ui/index.ts";

function runtime() {
  return createPilotRuntime({
    sources_csv: readFileSync(new URL("../../data/sources.csv", import.meta.url), "utf8"),
    colleges_csv: readFileSync(new URL("../../data/colleges.csv", import.meta.url), "utf8"),
    programmes_csv: readFileSync(new URL("../../data/programmes.csv", import.meta.url), "utf8"),
  });
}

test("persisted pilot data loads through the production ingestion path", () => {
  const loaded = runtime();
  const programmes = loaded.registry.programmes();
  assert.equal(loaded.registry.colleges().length, 5);
  assert.equal(programmes.length, 79);
  assert.equal(programmes.filter(({ branch_id }) => branch_id !== null).length, 18);
  assert.equal(programmes.filter(({ branch_id }) => branch_id === null).length, 61);
  assert.deepEqual(loaded.snapshots.snapshots()[0].facts, []);
});

test("ELIGIBLE scenario traverses API and UI with branch order and provenance", () => {
  const state = submitStudentGuidanceForm(demoScenario("eligible"), runtime());
  assert.equal(state.response?.ok, true);
  if (!state.response?.ok) return;
  assert.equal(state.response.result.eligibility.outcome, "ELIGIBLE");
  assert.equal(state.response.result.ordered_choices[0].candidate.branch_id, "ECE");
  assert.ok(state.response.result.provenance.some(({ source_id }) => source_id === "SRC005"));
  const html = renderStudentGuidancePage(state);
  assert.match(html, /Eligibility: ELIGIBLE/);
  assert.match(html, /Source SRC005/);
});

test("INELIGIBLE scenario renders reasons and no normal choices", () => {
  const state = submitStudentGuidanceForm(demoScenario("ineligible"), runtime());
  assert.equal(state.response?.ok && state.response.result.eligibility.outcome, "INELIGIBLE");
  const html = renderStudentGuidancePage(state);
  assert.match(html, /Eligibility: INELIGIBLE/);
  assert.doesNotMatch(html, /Ordered programme choices/);
});

test("NEEDS_REVIEW scenario retains actionable missing information", () => {
  const state = submitStudentGuidanceForm(demoScenario("needs-review"), runtime());
  assert.equal(state.response?.ok && state.response.result.eligibility.outcome, "NEEDS_REVIEW");
  assert.match(renderStudentGuidancePage(state), /Information still needed/);
});

test("unpublished vacancy remains unknown throughout the rendered path", () => {
  const state = submitStudentGuidanceForm(demoScenario("unknown-vacancy"), runtime());
  assert.ok(state.response?.ok && state.response.result.ordered_choices.every(
    ({ candidate }) => candidate.vacancy_evidence_state === "UNKNOWN_OR_UNPUBLISHED" && candidate.applicable_seat_facts.length === 0,
  ));
  const html = renderStudentGuidancePage(state);
  assert.match(html, /Vacancy information not published \/ not available in the current source/);
  assert.doesNotMatch(html, />0 seat\(s\)</);
});

test("invalid requests use the safe structured API error and UI wording", () => {
  const raw = handleGuidanceJson("{}", runtime());
  const response = JSON.parse(raw) as GuidanceApiResponse;
  assert.equal(response.ok, false);
  if (response.ok) return;
  assert.equal(response.error.code, "INVALID_REQUEST");
  const html = renderStudentGuidancePage({ form: demoScenario("needs-review"), response });
  assert.match(html, /Please check your information/);
  assert.doesNotMatch(html, /stack|filesystem|node_modules/i);
});

test("same pilot scenario and stored snapshot produce identical API and UI output", () => {
  const request = demoScenario("eligible");
  const firstApi = handleGuidanceJson(JSON.stringify(request), runtime());
  const secondApi = handleGuidanceJson(JSON.stringify(request), runtime());
  assert.equal(firstApi, secondApi);
  const firstState = submitStudentGuidanceForm(request, runtime());
  const secondState = submitStudentGuidanceForm(request, runtime());
  assert.equal(renderStudentGuidancePage(firstState), renderStudentGuidancePage(secondState));
});

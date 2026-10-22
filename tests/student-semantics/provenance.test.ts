import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createGuidanceWithExplanation } from "../../src/application/guidance.ts";
import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { demoScenario } from "../../src/demo/scenarios.ts";
import { evaluateJourneyGuidance, EMPTY_JOURNEY } from "../../src/m2/journey.ts";
import { toPersonalGuidanceFoundation } from "../../src/student-semantics/personal-guidance.ts";
import { approvedContentClaimEvidence, checkClaimEvidence, documentClaimEvidence, IMPROVEMENT_SOURCE_LOCATION, parsePresentationSources, personalClaimEvidence, studentEvidenceReference } from "../../src/student-semantics/provenance.ts";
import { loadQuestionCollection } from "../../src/ui/explore-questions.ts";

const load = (name: string) => readFileSync(new URL(`../../${name}`, import.meta.url), "utf8");
const sources = parsePresentationSources(load("data/sources.csv"));
const runtime = createPilotRuntime({ sources_csv: load("data/sources.csv"), colleges_csv: load("data/colleges.csv"), programmes_csv: load("data/programmes.csv") });
const collection = loadQuestionCollection(
  load("docs/content/awareness/student_pov_awareness_batch_a01_a07_v2.md"),
  load("docs/content/admission/student_pov_admission_batch_int05_int08_v1.md"),
  load("docs/content/admission/student_pov_admission_coverage_int05_int08_v1.md"),
  load("docs/content/awareness/student_pov_awareness_evidence_v2.md"),
  load("docs/content/admission/student_pov_admission_evidence_int05_int08_v1.md"),
  load("data/m2_question_answers_v1.json"),
);
const evaluation = createGuidanceWithExplanation(demoScenario("eligible"), runtime);

test("check-level claim resolves only its own source/year/page and labels recorded precision", () => {
  const check = evaluation.result.eligibility.checks.find(({ rule_id }) => rule_id === "ELG009")!;
  const claim = checkClaimEvidence(check, sources);
  assert.equal(claim.precision, "CHECK_LEVEL");
  assert.equal(claim.trace.rule_id, check.rule_id);
  assert.equal(claim.references.length, 1);
  assert.equal(claim.references[0].source_link, sources.get(check.source_id)?.url);
  assert.equal(claim.references[0].source_year, 2026);
  assert.equal(claim.references[0].printed_page, 9);
  assert.equal(claim.references[0].pdf_position, null);
  assert.equal(claim.references[0].location_status, "RECORDED");
  assert.match(claim.references[0].evidence_limit, /not each sentence/);
  const missing = checkClaimEvidence({ ...check, source_id: "MISSING" }, sources);
  assert.deepEqual(missing.references, []);
  assert.equal(checkClaimEvidence({ ...check, source_page: null }, sources).references[0].location_status, "UNRESOLVED");
});

test("approved content maps only its own reviewed references and keeps review/year limits", () => {
  const review = { content_ids: ["Q002"], version: "a67fc4c", review_reference: "docs/planning/roadmap_validation_gate_amendment_2026-10-11.md", source_years: { [IMPROVEMENT_SOURCE_LOCATION.source_link]: 2026 } };
  const claim = approvedContentClaimEvidence("Q002", collection, review, sources);
  assert.equal(claim.precision, "APPROVED_CONTENT_LEVEL");
  assert.deepEqual(claim.references.map(({ source_link }) => source_link), collection.answers.get("Q002")?.evidence.map(({ url }) => url));
  assert.ok(claim.references.every(({ evidence_limit }) => evidence_limit.includes(collection.answers.get("Q002")!.en.limit)));
  assert.equal(claim.references[0].source_year, 2026);
  assert.equal(claim.references[0].location, collection.answers.get("Q002")?.evidence[0].location);
  assert.equal(claim.references[0].location_status, "RECORDED");
  assert.throws(() => approvedContentClaimEvidence("Q080", collection, review, sources));
  const unknownYear = approvedContentClaimEvidence("Q002", collection, { ...review, source_years: {} }, sources);
  assert.equal(unknownYear.references[0].source_year, null);
});

test("document-level references do not promote access date to source year or precise location", () => {
  const claim = documentClaimEvidence("general.direction", "SRC002", sources);
  assert.equal(claim.precision, "DOCUMENT_LEVEL");
  assert.equal(claim.references[0].source_year, null);
  assert.equal(claim.references[0].printed_page, null);
  assert.equal(claim.references[0].location_status, "UNRESOLVED");
  assert.match(claim.references[0].evidence_limit, /no exact statement or page/);
  assert.equal(sources.get("SRC002")?.published_date, null);
});

test("improvement reference matches inspected 2026 official brochure and corrected CSV metadata", () => {
  const check = evaluation.result.eligibility.checks.find(({ rule_id }) => rule_id === "ELG032")!;
  assert.equal(check.source_page, 3);
  const reference = checkClaimEvidence(check, sources).references[0];
  assert.equal(reference.location_status, "VERIFIED");
  assert.equal(reference.printed_page, 3);
  assert.equal(reference.pdf_position, 4);
  assert.equal(reference.location, "Improvement marks");
  assert.equal(reference.source_year, 2026);
  assert.equal(reference.source_link, IMPROVEMENT_SOURCE_LOCATION.source_link);
  assert.match(IMPROVEMENT_SOURCE_LOCATION.sha256, /^[a-f0-9]{64}$/);
  const row = load("data/reference/tnea_2026_eligibility.csv").split(/\r?\n/).find((line) => line.startsWith("ELG032,"));
  assert.match(row!, /SRC002,3,2026,2026-10-22/);
});

test("stale or conflicting improvement reference never inherits verified location", () => {
  const check = evaluation.result.eligibility.checks.find(({ rule_id }) => rule_id === "ELG032")!;
  for (const page of [2, null]) {
    const reference = checkClaimEvidence({ ...check, source_page: page }, sources).references[0];
    assert.equal(reference.location_status, "UNRESOLVED");
    assert.equal(reference.printed_page, null);
    assert.equal(reference.pdf_position, null);
    assert.match(reference.evidence_limit, /conflicts/);
  }
  const changedRegistry = new Map(sources);
  changedRegistry.set("SRC002", { ...sources.get("SRC002")!, url: "https://example.invalid/other.pdf" });
  assert.equal(checkClaimEvidence(check, changedRegistry).references[0].location_status, "UNRESOLVED");
  assert.notEqual(checkClaimEvidence({ ...check, source_year: 2027 as 2026 }, sources).references[0].location_status, "VERIFIED");
});

test("student reference projection excludes internal IDs/status and fails closed on raw-ID wording", () => {
  for (const claim of personalClaimEvidence(evaluation.result, sources)) {
    for (const reference of claim.references) {
      const visible = studentEvidenceReference(reference);
      assert.ok(!("source_id" in visible));
      assert.ok(!("location_status" in visible));
      assert.doesNotMatch(JSON.stringify(visible), /SRC\d|ELG\d|CHECK_LEVEL|DOCUMENT_LEVEL/);
    }
  }
  const reference = checkClaimEvidence(evaluation.result.eligibility.checks[0], sources).references[0];
  assert.throws(() => studentEvidenceReference({ ...reference, location: "SRC999 ELG999" }));
});

test("semantic evidence attachment cannot change deterministic results, sidecar or Q021 status", () => {
  const state = { ...EMPTY_JOURNEY, year: 2026 as const, stream: "academic" as const, improvement: false, maths: 86, physics: 78, chemistry: 81 };
  const evaluated = evaluateJourneyGuidance(state, runtime);
  const before = JSON.stringify(evaluated);
  const mapped = toPersonalGuidanceFoundation(evaluated, sources);
  assert.equal(JSON.stringify(evaluated), before);
  assert.equal(mapped.cutoff, 165.5);
  assert.equal(evaluated.result?.eligibility.outcome, "NEEDS_REVIEW");
  const cutoff = mapped.evidence.find(({ claim_id }) => claim_id === "personal.cutoff");
  assert.equal(cutoff?.references[0].printed_page, 9);
  assert.ok(mapped.evidence.some(({ precision }) => precision === "DOCUMENT_LEVEL"));
  assert.equal(mapped.evidence.find(({ precision }) => precision === "DOCUMENT_LEVEL")?.references[0].source_year, 2026);
  assert.equal(collection.answers.get("Q021")?.en.status, "PARTIAL");
});

test("registry resolution handles quoted notes without inventing dates", () => {
  assert.ok(sources.size > 5);
  assert.throws(() => parsePresentationSources("source_id,source_name\nSRC001,Name"));
  assert.throws(() => parsePresentationSources("source_id,source_name,source_url,published_date\nS,Title,file:///secret,"));
});

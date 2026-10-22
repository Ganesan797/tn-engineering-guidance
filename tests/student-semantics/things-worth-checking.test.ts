import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { EMPTY_JOURNEY, evaluateJourneyGuidance } from "../../src/m2/journey.ts";
import { toPersonalGuidanceFoundation } from "../../src/student-semantics/personal-guidance.ts";
import { parsePresentationSources } from "../../src/student-semantics/provenance.ts";
import { buildThingsWorthChecking, studentThingsWorthChecking, GENERAL_GUIDANCE_MESSAGES, type GeneralGuidanceOptions, type GeneralGuidanceSelection } from "../../src/student-semantics/things-worth-checking.ts";
import { loadQuestionCollection, type QuestionAnswer } from "../../src/ui/explore-questions.ts";

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
const official = sources.get("SRC002")!;
// Test governance scope cites existing bounded M2 owner acceptance; not new content approval.
const selection: GeneralGuidanceSelection = {
  content_id: "Q002", scope: "GENERAL_EXPLANATION", admission_year: 2026, official_source_id: "SRC002",
  review: {
    content_ids: ["Q002"], version: "a67fc4c9ed24f7061631782cd63c839cf098cfe8",
    review_reference: "docs/planning/roadmap_validation_gate_amendment_2026-10-11.md",
    source_years: { [official.url]: 2026 }, status: "PASS_OWNER_REPORTED",
    languages: { en: "PASS_OWNER_REPORTED", ta: "PASS_OWNER_REPORTED" }, official_direction_approved: true,
  },
};
const options: GeneralGuidanceOptions = { collection, sources, content_version: selection.review.version, admission_year: 2026, selections: [selection] };
const withSelection = (value: GeneralGuidanceSelection): GeneralGuidanceOptions => ({ ...options, selections: [value] });
const withAnswer = (value: QuestionAnswer): GeneralGuidanceOptions => ({ ...options, collection: { ...collection, answers: new Map(collection.answers).set(value.id, value) } });

test("approved general guidance references existing bilingual content and its own evidence", () => {
  const section = buildThingsWorthChecking(options);
  assert.equal(section.output_class, "INFORMATION");
  assert.equal(section.items.length, 1);
  assert.equal(section.empty_state, null);
  const item = section.items[0];
  assert.equal(item.id, "general-guidance.Q002");
  assert.equal(item.wording.ta.content_id, "Q002");
  assert.equal(item.wording.ta.body, "answer");
  assert.equal(item.wording.en.next_direction, "next");
  assert.equal(item.evidence.precision, "APPROVED_CONTENT_LEVEL");
  assert.equal(item.official_next_direction.url, official.url);
  assert.equal(item.content_review, "PASS_OWNER_REPORTED");
  assert.equal(item.new_wording_review, "HUMAN_REVIEW_PENDING");
  assert.ok(!("eligibility" in item) && !("entitlement" in item));
});

test("pending, failed, unversioned and out-of-review-scope content is excluded", () => {
  const variants: GeneralGuidanceSelection[] = [
    { ...selection, review: { ...selection.review, status: "PENDING" } },
    { ...selection, review: { ...selection.review, status: "FIX_REQUIRED" } },
    { ...selection, review: { ...selection.review, languages: { en: "PASS_OWNER_REPORTED", ta: "PENDING" } } },
    { ...selection, review: { ...selection.review, languages: { en: "FIX_REQUIRED", ta: "PASS_OWNER_REPORTED" } } },
    { ...selection, review: { ...selection.review, version: "different-copy" } },
    { ...selection, review: { ...selection.review, review_reference: "" } },
    { ...selection, review: { ...selection.review, content_ids: [] } },
    { ...selection, content_id: "MISSING" },
  ];
  for (const candidate of variants) assert.equal(buildThingsWorthChecking(withSelection(candidate)).items.length, 0);
  assert.equal(buildThingsWorthChecking({ ...options, content_version: "" }).items.length, 0);
});

test("scope, year and official-direction approval cannot be inferred from personal results", () => {
  for (const scope of ["SCHEME_OR_SUPPORT", "PERSONAL_RESULT"] as const) {
    assert.equal(buildThingsWorthChecking(withSelection({ ...selection, scope })).items.length, 0);
  }
  assert.equal(buildThingsWorthChecking({ ...options, admission_year: null }).items.length, 0);
  assert.equal(buildThingsWorthChecking({ ...options, admission_year: 2027 }).items.length, 0);
  assert.equal(buildThingsWorthChecking(withSelection({ ...selection, review: { ...selection.review, official_direction_approved: false } })).items.length, 0);
  assert.equal(buildThingsWorthChecking(withSelection({ ...selection, official_source_id: "SRC004" })).items.length, 0);
  assert.equal(buildThingsWorthChecking(withSelection({ ...selection, official_source_id: "MISSING" })).items.length, 0);
  assert.equal(buildThingsWorthChecking(withSelection({ ...selection, review: { ...selection.review, source_years: {} } })).items.length, 0);
});

test("partial content, absent Tamil and missing or unsafe evidence cannot become guidance", () => {
  const answer = collection.answers.get("Q002")!;
  for (const variant of [
    { ...answer, en: { ...answer.en, status: "PARTIAL" as const } },
    { ...answer, ta: undefined },
    { ...answer, evidence: [] },
    { ...answer, evidence: answer.evidence.map((reference) => ({ ...reference, location: "" })) },
    { ...answer, en: { ...answer.en, next: "" } },
    { ...answer, evidence: [...answer.evidence, { ...answer.evidence[0], url: "file:///private" }] },
  ]) assert.equal(buildThingsWorthChecking(withAnswer(variant)).items.length, 0);
  assert.equal(collection.answers.get("Q021")?.en.status, "PARTIAL");
});

test("empty state is honest, bilingual and explicitly remains candidate wording", () => {
  const section = buildThingsWorthChecking();
  assert.deepEqual(section.items, []);
  assert.equal(section.empty_state, "empty");
  assert.equal(section.new_wording_review, "HUMAN_REVIEW_PENDING");
  assert.match(studentThingsWorthChecking(undefined, "en").empty_state!, /does not mean that no options exist/);
  assert.equal(studentThingsWorthChecking(undefined).empty_state, GENERAL_GUIDANCE_MESSAGES.empty.ta);
  assert.match(studentThingsWorthChecking(options, "en").scope, /do not confirm your eligibility, entitlement or admission/);
});

test("bilingual projections share identities/actions and reuse exact reviewed canonical wording", () => {
  const section = buildThingsWorthChecking(options);
  const answer = collection.answers.get("Q002")!;
  for (const lang of ["ta", "en"] as const) {
    const view = studentThingsWorthChecking(options, lang);
    assert.equal(view.items.length, section.items.length);
    assert.equal(view.items[0].title, answer[lang]!.question);
    assert.equal(view.items[0].body, answer[lang]!.answer);
    assert.equal(view.items[0].next_direction, answer[lang]!.next);
    assert.equal(view.items[0].official_url, official.url);
    assert.equal(view.items[0].limit, answer[lang]!.limit);
  }
  assert.equal(studentThingsWorthChecking(options).items[0].body, answer.ta!.answer);
  assert.equal(buildThingsWorthChecking({ ...options, selections: [selection, selection] }).items.length, 1);
});

test("plain candidate projection has no internal IDs, backend terms or raw review enums", () => {
  for (const lang of ["en", "ta"] as const) {
    const text = JSON.stringify(studentThingsWorthChecking(options, lang));
    assert.doesNotMatch(text, /Q002|SRC\d|ELG\d|APPROVED_CONTENT_LEVEL|PASS_OWNER_REPORTED|HUMAN_REVIEW_PENDING|NEEDS_REVIEW|blocking_missing_fields/);
  }
  const answer = collection.answers.get("Q002")!;
  const unsafe = withAnswer({ ...answer, en: { ...answer.en, answer: "ELG032 backend predicate" } });
  assert.deepEqual(studentThingsWorthChecking(unsafe, "en").items, []);
});

test("resolution reapplies review status instead of trusting a previously built item", () => {
  assert.equal(buildThingsWorthChecking(options).items.length, 1);
  const revoked = withSelection({ ...selection, review: { ...selection.review, status: "FIX_REQUIRED" } });
  assert.deepEqual(studentThingsWorthChecking(revoked, "ta").items, []);
});

test("general guidance stays separate and cannot mutate cutoff, eligibility or sidecar", () => {
  const state = { ...EMPTY_JOURNEY, year: 2026 as const, stream: "academic" as const, improvement: false, maths: 86, physics: 78, chemistry: 81 };
  const evaluated = evaluateJourneyGuidance(state, runtime);
  const before = JSON.stringify(evaluated);
  const mapped = toPersonalGuidanceFoundation(evaluated, sources, options);
  assert.equal(JSON.stringify(evaluated), before);
  assert.equal(mapped.cutoff, 165.5);
  assert.equal(mapped.evaluation.result?.eligibility.outcome, "NEEDS_REVIEW");
  assert.equal(mapped.things_worth_checking.items[0].output_class, "INFORMATION");
  assert.ok(!("things_worth_checking" in evaluated.result!));
  const differentMarks = evaluateJourneyGuidance({ ...state, maths: 10, physics: 10, chemistry: 10 }, runtime);
  assert.deepEqual(toPersonalGuidanceFoundation(differentMarks, sources, options).things_worth_checking, mapped.things_worth_checking);
  const outside = evaluateJourneyGuidance({ ...state, year: "other" }, runtime);
  assert.equal(toPersonalGuidanceFoundation(outside, sources, options).things_worth_checking.items.length, 0);
  assert.equal(toPersonalGuidanceFoundation(evaluated).things_worth_checking.empty_state, "empty");
});

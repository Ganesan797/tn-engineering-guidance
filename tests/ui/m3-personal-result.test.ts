import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { createGuidanceWithExplanation } from "../../src/application/guidance.ts";
import { demoScenario } from "../../src/demo/scenarios.ts";
import { EMPTY_JOURNEY, evaluateJourneyGuidance, journeyGuidanceResult, nextJourneyQuestion, retryUnknown } from "../../src/m2/journey.ts";
import { parsePresentationSources } from "../../src/student-semantics/provenance.ts";
import { GENERAL_GUIDANCE_MESSAGES, type GeneralGuidanceOptions } from "../../src/student-semantics/things-worth-checking.ts";
import { loadQuestionCollection } from "../../src/ui/explore-questions.ts";
import { M3_COPY, renderM3PersonalResult } from "../../src/ui/m3-personal-result.ts";

const load = (name: string) => readFileSync(new URL(`../../${name}`, import.meta.url), "utf8");
const sources = parsePresentationSources(load("data/sources.csv"));
const runtime = createPilotRuntime({ sources_csv: load("data/sources.csv"), colleges_csv: load("data/colleges.csv"), programmes_csv: load("data/programmes.csv") });
const state = { ...EMPTY_JOURNEY, year: 2026 as const, stream: "academic" as const, improvement: false, maths: 86, physics: 78, chemistry: 81 };
const evaluated = evaluateJourneyGuidance(state, runtime);
const render = (value = evaluated) => renderM3PersonalResult(value, { sources });
const visible = (html: string) => html.replace(/<[^>]*>/g, " ");
const collection = loadQuestionCollection(
  load("docs/content/awareness/student_pov_awareness_batch_a01_a07_v2.md"),
  load("docs/content/admission/student_pov_admission_batch_int05_int08_v1.md"),
  load("docs/content/admission/student_pov_admission_coverage_int05_int08_v1.md"),
  load("docs/content/awareness/student_pov_awareness_evidence_v2.md"),
  load("docs/content/admission/student_pov_admission_evidence_int05_int08_v1.md"), load("data/m2_question_answers_v1.json"));
// Test-only reviewed selection; production defaults to no selection.
const generalGuidance: GeneralGuidanceOptions = {
  collection, sources, content_version: "accepted-test-scope", admission_year: 2026,
  selections: [{ content_id: "Q002", scope: "GENERAL_EXPLANATION", admission_year: 2026, official_source_id: "SRC002", review: {
    content_ids: ["Q002"], version: "accepted-test-scope", review_reference: "owner-review-fixture", status: "PASS_OWNER_REPORTED",
    languages: { ta: "PASS_OWNER_REPORTED", en: "PASS_OWNER_REPORTED" }, official_direction_approved: true,
    source_years: { [sources.get("SRC002")!.url]: 2026 },
  } }],
};

test("165.5 plus uncertainty has separate cutoff, eligibility, explanations and evidence", () => {
  const html = render();
  assert.match(html, /165.5 \/ 200/);
  assert.match(html, /முழுத் தகுதியை உறுதிப்படுத்த இன்னும் சில விவரங்களைச் சரிபார்க்க வேண்டும்/);
  for (const key of ["personal", "eligibility", "why", "evidence", "limit"] as const) assert.ok(html.includes(M3_COPY[key][0]));
  assert.ok(html.indexOf(M3_COPY.personal[0]) < html.indexOf(GENERAL_GUIDANCE_MESSAGES.heading.ta));
  assert.match(html, /data-language-review="pending"/);
  assert.match(html, /English — wording for review/);
  assert.match(html, /Based on your answers, this condition is met/);
  assert.equal(evaluated.result?.eligibility.outcome, "NEEDS_REVIEW");
  assert.match(html, /<details><summary>எந்த விவரங்கள் என்று பார்க்க<\/summary>/);
  assert.ok(html.indexOf("மீதமுள்ள சேர்க்கைத் தகுதி நிபந்தனைகளை") < html.indexOf("ஏன் இந்த முடிவு?"));
  assert.match(html, /Check the remaining eligibility conditions in the official guidance/);
});

test("selected-language result keeps the same score, official action and evidence scope", () => {
  const main = (language: "ta" | "en") => renderM3PersonalResult(evaluated, { sources }, language)
    .split('<details class="card"><summary lang=')[0];
  const ta = main("ta");
  const en = main("en");
  assert.match(ta, /165.5 \/ 200/);
  assert.match(en, /165.5 \/ 200/);
  assert.match(en, /What still needs checking/);
  assert.match(en, /Check the remaining eligibility conditions in the official guidance/);
  assert.match(ta, /மீதமுள்ள சேர்க்கைத் தகுதி நிபந்தனைகளை/);
  assert.match(en, /Source year: 2026/);
  assert.match(ta, /மூலத்தின் ஆண்டு: 2026/);
  const officialAction = /class="action primary" href="([^"]+)"/;
  assert.equal(ta.match(officialAction)?.[1], en.match(officialAction)?.[1]);
  const sourceUrls = (html: string) => [...new Set([...html.matchAll(/href="(https:[^"]+)"/g)].map(match => match[1]))].sort();
  assert.deepEqual(sourceUrls(ta), sourceUrls(en));
});

test("unknown, unanswered and unsupported contexts have supported distinct actions", () => {
  const unknown = render(evaluateJourneyGuidance({ ...state, physics: "unknown" }, runtime));
  assert.match(unknown, /name="retry" value="1"/);
  assert.match(unknown, /இந்தப் பதில் தெரியாது என்று குறிப்பிட்டுள்ளீர்கள்/);
  assert.match(unknown, /சில விவரங்களை இந்தக் கேள்விகளில் கேட்கவில்லை/);
  assert.match(unknown, /விவரம் தெரிந்தால் இப்போது பதிவு செய்ய/);
  assert.match(unknown, /Provide this detail now/);
  assert.equal(nextJourneyQuestion(retryUnknown({ ...state, physics: "unknown" })), "physics");
  const unanswered = render(evaluateJourneyGuidance({ ...state, improvement: null, physics: "unknown" }, runtime));
  assert.match(unanswered, /name="navigate" value="check"/);
  assert.doesNotMatch(unanswered, /name="retry"/);
  assert.equal(nextJourneyQuestion({ ...state, improvement: null, physics: "unknown" }), "improvement");
  const unsupported = render(evaluateJourneyGuidance({ ...state, year: "other" }, runtime));
  assert.match(unsupported, /நீங்கள் தேர்ந்தெடுத்த ஆண்டு அல்லது படிப்பு வழிக்கான தகுதியை/);
  assert.match(unsupported, /href="https:\/\/www.tneaonline.org"/);
  assert.doesNotMatch(unsupported, /165.5|டிப்ளமோ/);
  assert.match(unsupported, /கட்-ஆஃப் இப்போது கிடைக்கவில்லை/);
  assert.doesNotMatch(unsupported, /தெரியாத மதிப்பெண்/);
});

test("unavailable cutoffs use a neutral heading and never show a calculated score", () => {
  for (const value of [
    evaluateJourneyGuidance({ ...state, physics: "unknown" }, runtime),
    evaluateJourneyGuidance({ ...state, year: "other" }, runtime),
  ]) {
    assert.equal(value.result?.eligibility.cutoff ?? null, null);
    const html = render(value);
    assert.match(html, /<h3>உங்கள் கட்-ஆஃப் நிலை<\/h3>/);
    assert.match(html, /<h3>Your cutoff status<\/h3>/);
    assert.doesNotMatch(html, /கணக்கிட்ட கட்-ஆஃப்|Calculated cutoff|165\.5 \/ 200/);
  }
});

test("positive wording is bounded to an emitted eligible result", () => {
  const positive = createGuidanceWithExplanation(demoScenario("eligible"), runtime);
  assert.equal(positive.result.eligibility.outcome, "ELIGIBLE");
  const eligible = render({ ...evaluated, ...positive });
  assert.match(eligible, /இங்கு பார்த்த தகுதி நிபந்தனைகள் பொருந்துகின்றன/);
  assert.match(eligible, /மற்ற தகுதி விவரங்களும் சான்றுகளும் இன்னும் சரிபார்க்கப்பட வேண்டும்/);
  assert.match(eligible, /Other eligibility details and documents still need to be checked/);
  for (const value of [evaluated, evaluateJourneyGuidance({ ...state, year: "other" }, runtime),
    { ...evaluated, ...createGuidanceWithExplanation(demoScenario("ineligible"), runtime) }]) {
    assert.notEqual(value.result?.eligibility.outcome, "ELIGIBLE");
    assert.doesNotMatch(render(value), /இங்கு பார்த்த தகுதி நிபந்தனைகள் பொருந்துகின்றன/);
  }
});

test("real failed checks remain negative with neutral official-check action", () => {
  const actual = createGuidanceWithExplanation(demoScenario("ineligible"), runtime);
  const html = render({ ...evaluated, ...actual });
  assert.equal(actual.result.eligibility.outcome, "INELIGIBLE");
  assert.match(html, /one of the checked conditions is not met/);
  assert.match(html, /Check this condition against the official guidance/);
  assert.match(html, /இந்த நிபந்தனையை அதிகாரப்பூர்வ வழிகாட்டலுடன்/);
});

test("improvement operands and original origins come from the trusted sidecar", () => {
  const evaluation = evaluateJourneyGuidance({ ...state, improvement: true, improvement_year: 2006 }, runtime);
  const html = render(evaluation);
  assert.match(html, /165.5 \/ 200/);
  assert.match(html, /The original mark you entered from before the improvement exam/);
  assert.match(html, /Mathematics: <strong>86/);
  assert.match(html, /Physics: <strong>78/);
  assert.match(html, /Printed page: 3 · PDF page position: 4/);
});

test("incomplete and originless traces stay explicit without fabricated numbers", () => {
  const html = render(evaluateJourneyGuidance({ ...state, physics: "unknown" }, runtime));
  assert.match(html, /The calculation is incomplete/);
  assert.match(html, /Physics: <strong>Unknown/);
  assert.doesNotMatch(html, /165.5/);
  const trace = evaluated.explanation!.cutoff_trace;
  assert.equal(trace.status, "AVAILABLE");
  if (trace.status !== "AVAILABLE") return;
  const unknownOrigin = render({ ...evaluated, explanation: { ...evaluated.explanation!, cutoff_trace: { ...trace, operands: [ { ...trace.operands[0], input_field: null }, trace.operands[1], trace.operands[2] ] } } });
  assert.match(unknownOrigin, /Which mark entry this came from is unknown/);
  // Display copies the already-produced result, rather than recalculating operands.
  const sentinel = render({ ...evaluated, explanation: { ...evaluated.explanation!, cutoff_trace: { ...trace, result: 123.25 } } });
  assert.match(sentinel, /123.25 \/ 200/);
});

test("missing and scoped provenance never becomes exact verified evidence", () => {
  const missing = renderM3PersonalResult(evaluated);
  assert.match(missing, /A direct source link is not available here/);
  assert.match(missing, /இதற்கான நேரடி ஆதார இணைப்பு இங்கே இல்லை/);
  const html = render();
  assert.match(html, /It is not separate evidence for every explanation/);
  assert.match(html, /One part alone does not confirm your full eligibility/);
  assert.match(html, /This page reference is shown from previously recorded information/);
  assert.match(html, /இந்தப் பக்க விவரம் முன்பு பதிவு செய்யப்பட்ட தகவலின் அடிப்படையில் காட்டப்படுகிறது/);
  assert.match(html, /இந்த மூலம் இந்த நிபந்தனையுடன் தொடர்புடையது/);
  assert.match(html, /Source year: 2026|மூலத்தின் ஆண்டு: 2026/);
  assert.match(render(evaluateJourneyGuidance({ ...state, improvement: true, improvement_year: 2006 }, runtime)), /Other rules and your certificates were not verified/);
  const result = structuredClone(evaluated.result!);
  result.eligibility.checks = result.eligibility.checks.map(check => check.rule_id === "ELG032" ? { ...check, source_page: 2 } : check);
  const stale = render({ ...evaluated, result });
  assert.match(stale, /The exact page is unconfirmed/);
  assert.doesNotMatch(stale, /PDF page position: 4/);
});

test("general selection and projection share journey scope, never caller-supplied year", () => {
  const good = renderM3PersonalResult(evaluated, { sources, generalGuidance });
  assert.ok(good.includes(collection.answers.get("Q002")!.en.question));
  const outside = evaluateJourneyGuidance({ ...state, year: "other" }, runtime);
  const html = renderM3PersonalResult(outside, { sources, generalGuidance });
  assert.ok(!html.includes(collection.answers.get("Q002")!.en.question));
  assert.ok(html.includes(GENERAL_GUIDANCE_MESSAGES.empty.en));
  const unknown = evaluateJourneyGuidance({ ...state, year: "unknown" }, runtime);
  assert.ok(renderM3PersonalResult(unknown, { sources, generalGuidance }).includes(GENERAL_GUIDANCE_MESSAGES.empty.en));
});

test("empty section retains preparation action and rejects pending content", () => {
  const html = render();
  const general = html.slice(html.indexOf('class="card general-guidance"'));
  assert.ok(general.includes(GENERAL_GUIDANCE_MESSAGES.empty.ta));
  assert.doesNotMatch(general.split("</section>")[0], /மதிப்பாய்வு செய்யப்பட்ட|reviewed additional guidance|PASS_OWNER_REPORTED/);
  assert.match(general, /name="navigate" value="prepare"/);
  const pending = { ...generalGuidance, selections: generalGuidance.selections.map(selection => ({ ...selection, review: { ...selection.review, status: "PENDING" as const } })) };
  assert.ok(renderM3PersonalResult(evaluated, { sources, generalGuidance: pending }).includes(GENERAL_GUIDANCE_MESSAGES.empty.ta));
});

test("all expanded visible content is escaped and excludes raw technical identifiers", () => {
  for (const value of [evaluated, evaluateJourneyGuidance({ ...state, physics: "unknown" }, runtime)]) {
    const html = renderM3PersonalResult(value, { sources, generalGuidance });
    assert.doesNotMatch(visible(html), /ELG\d+|SRC\d+|Q\d{3}|NEEDS_REVIEW|UNKNOWN_OR_UNPUBLISHED|blocking_missing_fields|maths_mark|cutoff_trace|PASS_OWNER_REPORTED/);
  }
  const malicious = new Map(sources);
  malicious.set("SRC002", { ...sources.get("SRC002")!, title: '<script>alert("x")</script>' });
  assert.doesNotMatch(renderM3PersonalResult(evaluated, { sources: malicious }), /<script>/);
});

test("rendering preserves existing results, sidecar and navigation context", () => {
  for (const current of [state, { ...state, physics: "unknown" as const }, { ...state, improvement: true, improvement_year: 2006 }, { ...state, year: "other" as const }]) {
    const evaluation = evaluateJourneyGuidance(current, runtime);
    const before = JSON.stringify(evaluation);
    render(evaluation);
    assert.equal(JSON.stringify(evaluation), before);
    assert.deepEqual(evaluation.result, journeyGuidanceResult(current, runtime));
  }
});

test("unasked blockers and unknown answers are named before the explanation disclosure", () => {
  const html = render();
  const primary = html.slice(0, html.indexOf(`<summary>${M3_COPY.why[0]}</summary>`));
  for (const label of ["பூர்வீகம் தொடர்பான சேர்க்கை வழி", "இடஒதுக்கீட்டுக்கான சமூகப் பிரிவு", "மதிப்பெண்கள் கிரேடாகக் கொடுக்கப்பட்டுள்ளனவா"]) assert.ok(primary.includes(label));
  assert.match(primary, /சில விவரங்களை இந்தக் கேள்விகளில் கேட்கவில்லை/);
  assert.match(primary, /id=Q077/);
  assert.match(primary, /name="edit" value="maths"/);
  const unknown = render(evaluateJourneyGuidance({ ...EMPTY_JOURNEY, year: "unknown" }, runtime));
  assert.match(unknown, /சேர்க்கை ஆண்டு<\/strong>/);
  assert.match(unknown, /விவரம் தெரிந்ததும் இங்கே சேர்க்கலாம்/);
  assert.doesNotMatch(unknown, /id=Q077/);
});

test("calculation is trace-backed and minimum-mark mechanics are not presented as threshold approval", () => {
  const html = render();
  assert.match(html, /86 \+ \(78 ÷ 2\) \+ \(81 ÷ 2\) = 165.5 \/ 200/);
  assert.match(html, /கணிதம் \+ \(இயற்பியல் ÷ 2\) \+ \(வேதியியல் ÷ 2\)/);
  assert.match(html, /Mathematics \+ \(Physics ÷ 2\) \+ \(Chemistry ÷ 2\)/);
  assert.match(html, /This alone does not confirm the minimum-mark requirement/);
  assert.match(html, /மதிப்பெண்களை முழு எண்ணாக மாற்றாமல் பயன்படுத்துதல்/);
  assert.doesNotMatch(visible(html), /வட்டமிடாமல்|Cross-board mark normalization|Recorded source locator/);
  assert.match(render(evaluateJourneyGuidance({ ...state, improvement: true, improvement_year: 2006 }, runtime)), /\.pdf#page=4/);
  assert.doesNotMatch(html, /\.pdf#page=9/); // Printed page is not silently treated as PDF position.
});

test("candidate result copy leads with the score, then uncertainty, its importance and an action", () => {
  const html = render();
  for (const [lang, index] of [["ta", 0], ["en", 1]] as const) {
    const part = html.split(`<div lang="${lang}">`)[1];
    const positions = ["165.5 / 200", M3_COPY.eligibility[index], M3_COPY.notCollected[index], M3_COPY.limit[index], M3_COPY.next[index]].map(text => part.indexOf(text));
    assert.ok(positions.every(position => position >= 0));
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
    assert.match(part, /class="action primary"/);
    assert.ok(part.includes(`<details><summary>${M3_COPY.why[index]}</summary>`));
    assert.ok(part.includes(`<details><summary>${M3_COPY.evidence[index]}</summary>`));
  }
  assert.doesNotMatch(visible(html), /short check did not ask|சிறிய சரிபார்ப்பு கேட்கவில்லை/);
});

test("friendly empty-state copy is preserved verbatim in both languages", () => {
  assert.equal(GENERAL_GUIDANCE_MESSAGES.empty.ta, "இங்கே கூடுதல் வழிகாட்டல் இப்போது காட்டப்படவில்லை. அதனால் வாய்ப்புகள் இல்லை என்று நினைக்க வேண்டாம். கீழே உள்ள தயாரிப்பு வழிகாட்டலைத் தொடர்ந்து பார்க்கலாம்.");
  assert.equal(GENERAL_GUIDANCE_MESSAGES.empty.en, "There is no additional guidance to show here right now. This does not mean there are no options. You can continue with the preparation guidance below.");
  const html = render();
  assert.ok(html.includes(GENERAL_GUIDANCE_MESSAGES.empty.ta));
  assert.ok(html.includes(GENERAL_GUIDANCE_MESSAGES.empty.en));
});

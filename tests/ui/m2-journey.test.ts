import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { answerJourneyQuestion, editJourneyAnswer, EMPTY_JOURNEY, journeyGuidanceResult, nextJourneyQuestion, parseJourneyState, retryUnknown } from "../../src/m2/journey.ts";
import { applyApprovedTamilStudentCopy, parseAwarenessPack } from "../../src/student-semantics/awareness.ts";
import { renderStudentEntryPage } from "../../src/ui/student-entry.ts";
import { renderM2Journey, reviewedAwarenessTamilQuestion, reviewedTamilUnit } from "../../src/ui/m2-journey.ts";
import { loadQuestionCollection, renderQuestionCollection } from "../../src/ui/explore-questions.ts";
import { contentMarkup } from "../../src/ui/student-entry.ts";
import { CHECK_COPY, CHECK_COPY_REVIEW, CHECK_QUESTIONS_EN, PREPARATION_COPY } from "../../src/ui/journey-copy.ts";

const load = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const pack = applyApprovedTamilStudentCopy(parseAwarenessPack(
  load("data/m1_awareness_content_pack_v1.json"),
  load("docs/content/m1/m1_awareness_content_pack_v1.md"),
  load("data/sources.csv"),
), load("docs/content/m1/m1_tamil_student_copy_v1.md"));
const reviewed = load("docs/content/admission/student_pov_admission_batch_int05_int08_v1.md");
const awarenessReviewed = load("docs/content/awareness/student_pov_awareness_batch_a01_a07_v2.md");
const admissionCoverage = load("docs/content/admission/student_pov_admission_coverage_int05_int08_v1.md");
const collection = loadQuestionCollection(awarenessReviewed, reviewed, admissionCoverage,
  load("docs/content/awareness/student_pov_awareness_evidence_v2.md"),
  load("docs/content/admission/student_pov_admission_evidence_int05_int08_v1.md"), load("data/m2_question_answers_v1.json"));
const runtime = () => createPilotRuntime({
  sources_csv: load("data/sources.csv"), colleges_csv: load("data/colleges.csv"),
  programmes_csv: load("data/programmes.csv"),
});

test("all displayed question copy matches the October 10 owner-approved bilingual source", () => {
  const review = load("docs/planning/t03_bilingual_conversational_copy_refined_2026-10-10.md");
  const sections = [...review.replaceAll("\r\n", "\n").matchAll(/^### (Q\d{3}) — (A\d{2}|B\d{2})\n([\s\S]*?)(?=^### Q\d{3} —|^## Completion summary)/gm)];
  assert.equal(sections.length, 70);
  const fieldValue = (section: string, key: string) => {
    const lines = section.split("\n");
    const start = lines.indexOf(`${key} =`);
    assert.notEqual(start, -1, key);
    let end = start + 1;
    while (end < lines.length && !/^[A-Z][A-Z0-9_]+ =$/.test(lines[end])) end++;
    const value = lines.slice(start + 1, end).join("\n").trim();
    return value === "(No additional detail displayed.)" ? "" : value;
  };
  for (const [, id, unit, section] of sections) {
    const answer = collection.answers.get(id);
    assert.ok(answer, id);
    assert.equal(answer.unit, unit, id);
    for (const lang of ["en", "ta"] as const) {
      const copy = answer[lang]!;
      for (const field of ["question", "answer", "detail", "next", "limit"] as const) {
        assert.equal(copy[field], fieldValue(section, `${field.toUpperCase()}_${lang.toUpperCase()}`), `${id} ${lang}.${field}`);
      }
    }
  }
  assert.equal(collection.answers.get("Q021")?.en.status, "PARTIAL");
  assert.equal(collection.answers.get("Q021")?.ta?.status, "PARTIAL");
});

test("all 70 question-specific answers have separate localized copy, limits and next directions", () => {
  const expected = [1, 2, 7, 10, 11, 12, 21, ...Array.from({ length: 63 }, (_, i) => i + 25)].map((n) => `Q${String(n).padStart(3, "0")}`).sort();
  assert.deepEqual([...collection.answers.keys()].sort(), expected);
  for (const lang of ["ta", "en"] as const) {
    let direct = 0;
    for (const q of collection.questions) {
      const a = collection.answers.get(q.id)!;
      assert.equal(a.unit, q.unit);
      const copy = a[lang]!;
      assert.ok(copy.answer.length < 650, `${q.id}: short first paragraph`);
      const page = renderQuestionCollection(collection, q.id, null, lang);
      assert.equal(page.status, 200);
      assert.match(page.html, new RegExp(`<html lang="${lang}"`));
      assert.ok(page.html.includes(contentMarkup(copy.answer)));
      assert.ok(page.html.includes(contentMarkup(copy.next)));
      // B03 keeps the canonical limit internally and removes only its technical route sentence on screen.
      if (a.unit === "B03") assert.match(page.html, /2026–27/);
      else assert.ok(page.html.includes(contentMarkup(copy.limit)));
      assert.ok(page.html.includes(`id=${a.nextId}`));
      if (lang === "ta") {
        assert.match(copy.question, /[\u0B80-\u0BFF]/);
        assert.match(copy.next, /[\u0B80-\u0BFF]/);
        assert.equal(copy.review, "PENDING_VOLUNTEER_EQUIVALENCE");
        assert.ok(!page.html.includes(contentMarkup(a.en.answer)));
        assert.doesNotMatch(page.html, /English — reviewed answer|Next action|What remains conditional/);
      } else assert.doesNotMatch(copy.question + copy.answer + copy.detail + copy.next + copy.limit, /[\u0B80-\u0BFF]/);
      direct += Number(copy.status === "DIRECT");
    }
    assert.equal(direct, 69);
    assert.equal(collection.answers.get("Q021")![lang]!.status, "PARTIAL");
  }
  assert.equal(renderQuestionCollection(collection, "Q168").status, 404);
  assert.equal(renderQuestionCollection(collection, null, null, "ta", "unknown").status, 404);
});

test("shared units preserve question-specific intent and all exact comparison subjects", () => {
  for (const lang of ["ta", "en"] as const) {
    for (const unit of collection.units.keys()) {
      const answers = collection.questions.filter((q) => q.unit === unit).map((q) => collection.answers.get(q.id)![lang]!.answer);
      assert.equal(new Set(answers).size, answers.length, unit);
    }
    const ten = collection.answers.get("Q010")![lang]!;
    const eleven = collection.answers.get("Q011")![lang]!;
    const four = collection.answers.get("Q049")![lang]!;
    for (const term of ["CSE", "AI & Data Science"]) assert.ok(ten.answer.includes(term));
    for (const term of ["CSE", "IT"]) assert.ok(eleven.answer.includes(term));
    for (const term of ["CSE", "IT", "AI & Data Science", "AI & ML"]) assert.ok(four.answer.includes(term));
    assert.doesNotMatch(renderQuestionCollection(collection, "Q010", null, lang).html, /<strong>Q011|<strong>Q049/);
  }
  assert.match(collection.answers.get("Q011")!.en.detail, /cutoffs.*not|cutoffs.*\*\*not\*\*/i);
  assert.match(collection.answers.get("Q021")!.en.limit, /college.*year.*stream.*round.*category/);
});

test("language switch retains question or topic and missing Tamil never falls back to English", () => {
  for (const lang of ["ta", "en"] as const) {
    const other = lang === "ta" ? "en" : "ta";
    const question = renderQuestionCollection(collection, "Q049", null, lang, "A05").html;
    assert.ok(question.includes(`lang=${other}&amp;id=Q049&amp;topic=A05`));
    const topic = renderQuestionCollection(collection, null, null, lang, "A05").html;
    assert.ok(topic.includes(`lang=${other}&amp;topic=A05`));
    for (const id of ["Q010", "Q011", "Q049", "Q050"]) assert.ok(topic.includes(`id=${id}`));
  }
  const answers = new Map(collection.answers);
  answers.set("Q049", { ...answers.get("Q049")!, ta: undefined });
  const missing = renderQuestionCollection({ ...collection, answers }, "Q049");
  assert.equal(missing.status, 503);
  assert.match(missing.html, /data-missing-translation/);
  assert.ok(!missing.html.includes(collection.answers.get("Q049")!.en.answer));
  assert.equal(renderQuestionCollection({ ...collection, answers }, "Q049", null, "en").status, 200);
  const entries = JSON.parse(load("data/m2_question_answers_v1.json"));
  delete entries.find((a: { id: string }) => a.id === "Q049").ta;
  const loaded = loadQuestionCollection(awarenessReviewed, reviewed, admissionCoverage, "", "", JSON.stringify(entries));
  assert.equal(renderQuestionCollection(loaded, "Q049").status, 503);
  entries.find((a: { id: string }) => a.id === "Q010").unit = "A04";
  assert.throws(() => loadQuestionCollection(awarenessReviewed, reviewed, admissionCoverage, "", "", JSON.stringify(entries)), /mapping mismatch/);
});

test("lateral entry is informational and cutoff explanation preserves the result tab", () => {
  const lateral = renderQuestionCollection(collection, "Q060").html;
  assert.match(lateral, /data-guidance-unit="B03"/);
  assert.match(lateral, /இந்தச் சரிபார்ப்பு முதல் ஆண்டு பொறியியல் சேர்க்கைக்கானது/);
  assert.match(lateral, /டிப்ளமோ முடித்து நேரடியாக இரண்டாம் ஆண்டில் சேர விரும்பினால்/);
  assert.doesNotMatch(lateral, /தகுதியை மதிப்பிடாது/);
  const lateralEnglish = renderQuestionCollection(collection, "Q060", null, "en").html;
  assert.match(lateralEnglish, /This check is for first-year engineering admission/);
  assert.match(lateralEnglish, /separate lateral-entry admission guidance/);
  assert.doesNotMatch(lateralEnglish, /does not assess/);
  assert.doesNotMatch(lateral, /href="\/journey\?step=check"/);
  assert.match(lateral, /href="https:\/\/www.tnlea.com\//);
  assert.match(lateralEnglish, /href="https:\/\/www.tnlea.com\//);
  const state = ["2026", "academic", "no", "86", "78", "81"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  const result = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state);
  assert.match(result, /id=Q002" target="_blank"/);
  assert.match(result, /165.5 \/ 200/);
  assert.match(result, /முழுத் தகுதியை உறுதிப்படுத்த இன்னும் சில விவரங்களைச் சரிபார்க்க வேண்டும்/);
  assert.doesNotMatch(result, /NEEDS_REVIEW/);
  assert.match(renderM2Journey("route", pack, reviewed, awarenessReviewed, runtime()), /id=Q060/);
  for (const page of ["awareness", "study", "compare", "route", "prepare"] as const) {
    const withInputs = renderM2Journey(page, pack, reviewed, awarenessReviewed, runtime(), state);
    assert.match(withInputs, /href="\/journey\/questions" target="_blank"/);
    if (page === "route") assert.match(withInputs, /id=Q060" target="_blank"/);
  }
});

test("diploma route and preparation copy keep first-year scope and conditional documents", () => {
  for (const [language, index] of [["ta", 0], ["en", 1]] as const) {
    const route = renderM2Journey("route", pack, reviewed, awarenessReviewed, runtime(), EMPTY_JOURNEY, undefined, {}, language);
    const prepare = renderM2Journey("prepare", pack, reviewed, awarenessReviewed, runtime(), EMPTY_JOURNEY, undefined, {}, language);
    assert.ok(route.includes(PREPARATION_COPY.diploma[index]));
    assert.match(route, /id=Q060/);
    for (const key of ["first", "second", "conditional"] as const) assert.ok(prepare.includes(PREPARATION_COPY[key][index]));
    assert.match(prepare, /2026/);
    assert.match(prepare, /<details><summary>/);
    assert.doesNotMatch(prepare, /கோரும் எல்லா சான்றிதழ்களும் இப்போதே தேவை|every certificate is needed now/);
  }
});

test("prepared question titles hide internal IDs while preserving canonical links", () => {
  const answer = collection.answers.get("Q071")!;
  assert.equal(answer.id, "Q071");
  for (const language of ["ta", "en"] as const) {
    const page = renderQuestionCollection(collection, "Q071", null, language).html;
    assert.ok(page.includes(`<h1>${answer[language]!.question}</h1>`));
    assert.doesNotMatch(page.replace(/<[^>]*>/g, " "), /\bQ071\b/);
    assert.match(page, /id=Q083/);
    const topic = renderQuestionCollection(collection, null, null, language, "B05").html;
    assert.match(topic, /id=Q071/);
    assert.doesNotMatch(topic.replace(/<[^>]*>/g, " "), /\bQ071\b/);
  }
});

test("zero-knowledge Tamil path offers engineering and branch awareness before TNEA or marks", () => {
  const start = renderM2Journey("awareness", pack, reviewed, awarenessReviewed, runtime());
  assert.match(start, /<html lang="ta"/);
  assert.match(start, /data-content-id="AW-01"/);
  assert.match(start, /மதிப்பெண்களோ கல்லூரித் தேர்வோ இப்போது தேவையில்லை/);
  assert.match(start, /data-content-id="A01"/);
  assert.match(start, /data-content-id="A04"/);
  // Let students choose a route after the introduction, before optional expanded examples.
  const introAt = start.indexOf('data-content-id="AW-01"');
  const choicesAt = start.indexOf('<nav class="actions">');
  const expandedAt = start.indexOf('data-content-id="A01"');
  assert.ok(introAt < choicesAt && choicesAt < expandedAt);
  const awarenessParagraphs = pack.items.find((item) => item.id === "AW-01")!.presentations.ta.body.split(/\n\n+/);
  assert.ok(start.indexOf(contentMarkup(awarenessParagraphs[0])) < choicesAt);
  assert.ok(choicesAt < start.indexOf(contentMarkup(awarenessParagraphs[1])));
  for (const paragraph of awarenessParagraphs) assert.ok(start.includes(contentMarkup(paragraph)));
  const choices = start.slice(choicesAt, start.indexOf('</nav>', choicesAt));
  for (const step of ['study', 'compare', 'route', 'check']) {
    assert.ok(choices.includes('/journey?step=' + step));
  }
  assert.equal((start.match(/<nav class="actions">/g) ?? []).length, 1);

  assert.match(start, /\/journey\?step=study/);
  assert.match(start, /\/journey\?step=compare/);
  assert.match(start, /\/journey\?step=route/);
  assert.doesNotMatch(start, /name="answer"|type="number"/);
  const study = renderM2Journey("study", pack, reviewed, awarenessReviewed, runtime());
  assert.ok(study.indexOf("தேர்ந்தெடுக்க வேண்டியதில்லை") < study.indexOf('<nav class="actions">'));
  assert.ok(study.indexOf('<nav class="actions">') < study.indexOf('data-content-id="A04"'));
  assert.match(study, /Q037|CSE/);
  assert.match(study, /ECE/);
  assert.match(study, /Mechanical/);
  assert.match(study, /Civil/);
  assert.doesNotMatch(study, /name="answer"|type="number"/);
  const compare = renderM2Journey("compare", pack, reviewed, awarenessReviewed, runtime());
  assert.ok(compare.indexOf("திறன் தீர்ப்பு அல்ல") < compare.indexOf('<nav class="actions">'));
  assert.ok(compare.indexOf('<nav class="actions">') < compare.indexOf('data-content-id="A06"'));
  assert.match(compare, /data-content-id="A06"/);
  assert.match(compare, /data-content-id="A05"/);
  assert.match(compare, /திறன் தீர்ப்பு அல்ல/);
  assert.doesNotMatch(compare, /name="answer"|type="number"/);
  assert.match(reviewedAwarenessTamilQuestion(awarenessReviewed, "A04", "Q041"), /Mechanical/);
  const route = renderM2Journey("route", pack, reviewed, awarenessReviewed, runtime());
  const routeParagraphs = pack.items.find((item) => item.id === "AW-03")!.presentations.ta.body.split(/\n\n+/);
  const routeChoicesAt = route.indexOf('<nav class="actions">');
  assert.ok(route.indexOf(contentMarkup(routeParagraphs[2])) < routeChoicesAt);
  assert.ok(routeChoicesAt < route.indexOf('data-content-id="AW-05"'));
  for (const paragraph of routeParagraphs) assert.ok(route.includes(contentMarkup(paragraph)));
  assert.match(route, /data-content-id="AW-03"/);
  assert.match(route, /data-content-id="AW-05"/);
  assert.match(route, /விண்ணப்பம் மற்றும் கலந்தாய்வு — மேலும் விளக்கம்/);
  assert.doesNotMatch(route.replace(/<[^>]*>/g, ""), /B01|B04|B01–B08/);
  assert.match(route, /\/journey\?step=prepare/);
  assert.match(renderM2Journey("prepare", pack, reviewed, awarenessReviewed, runtime()), /data-content-id="B05"/);
  assert.match(reviewedTamilUnit(reviewed, "B01"), /TNEA/);
});

test("informed student can enter the optional check directly", () => {
  assert.match(renderStudentEntryPage({ route: "personal", language: "ta" }, pack), /\/journey\?step=check/);
  const check = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime());
  assert.match(check, /எந்த ஆண்டு/);
  assert.doesNotMatch(check, /data-content-id="AW-01"/);
});

test("personal-check copy explains the benefit before scope and provides matching English review text", () => {
  const html = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime());
  assert.ok(html.indexOf(CHECK_COPY.benefit[0]) < html.indexOf(CHECK_COPY.scope[0]));
  assert.ok(html.includes(CHECK_COPY.scope[1]));
  assert.equal(CHECK_COPY_REVIEW, "CANDIDATE_PENDING_OWNER_REVIEW");
  let state = EMPTY_JOURNEY;
  for (const answer of ["2026", "academic", "yes", "2006", "86", "78", "81"]) {
    const field = nextJourneyQuestion(state)!;
    const page = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state);
    assert.ok(page.includes(CHECK_QUESTIONS_EN[field]));
    assert.match(page, /name="unknown" value="1"/);
    assert.match(page, /action="\/journey" method="post"/);
    state = answerJourneyQuestion(state, answer);
  }
  assert.equal(nextJourneyQuestion(state), null);
  assert.equal(journeyGuidanceResult(state, runtime())?.eligibility.cutoff, 165.5);
});

test("one journey evaluation renders equivalent Tamil and English personal results", () => {
  const state = ["2026", "academic", "no", "86", "78", "81"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  const engine = runtime();
  const before = JSON.stringify(journeyGuidanceResult(state, engine));
  const ta = renderM2Journey("check", pack, reviewed, awarenessReviewed, engine, state);
  const en = renderM2Journey("check", pack, reviewed, awarenessReviewed, engine, state, undefined, {}, "en");
  assert.match(ta, /<html lang="ta"/);
  assert.match(en, /<html lang="en"/);
  assert.match(ta, /165.5 \/ 200/);
  assert.match(en, /165.5 \/ 200/);
  assert.match(en, /Your cutoff is available/);
  assert.match(en, /What still needs checking/);
  assert.match(en, /Things worth checking/);
  assert.match(en, /Where does this information come from\?/);
  assert.match(en, /name="navigate" value="check" lang="ta"/);
  assert.equal(JSON.stringify(journeyGuidanceResult(state, engine)), before);
});

test("English next directions reuse canonical route and preparation content", () => {
  for (const page of ["awareness", "study", "compare", "route", "prepare"] as const) {
    const html = renderM2Journey(page, pack, reviewed, awarenessReviewed, runtime(), EMPTY_JOURNEY, undefined, {}, "en");
    assert.match(html, /<html lang="en"/);
    assert.match(html, new RegExp(`name="navigate" value="${page}" lang="ta"`));
    assert.doesNotMatch(html.replace(/<[^>]+>/g, " "), /ELG\d+|SRC\d+|NEEDS_REVIEW/);
  }
  const prepare = renderM2Journey("prepare", pack, reviewed, awarenessReviewed, runtime(), EMPTY_JOURNEY, undefined, {}, "en");
  assert.match(prepare, /2026 application preparation/);
  assert.match(prepare, /Do not upload documents here/);
  assert.match(prepare, /name="navigate" value="check"|href="\/journey\?step=check&amp;lang=en"/);
});

test("later questions show the answer first and keep extra explanation optional", () => {
  const state = answerJourneyQuestion(EMPTY_JOURNEY, "2026");
  const html = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state);
  assert.doesNotMatch(html, new RegExp(CHECK_COPY.benefit[0]));
  assert.ok(html.indexOf("<fieldset") < html.indexOf('id="answer-help"'));
  assert.match(html, /<details><summary>மேலும் விளக்கம்<\/summary>/);
  assert.match(html, /மதிப்பெண் சான்றிதழைப் பாருங்கள்/);
  assert.match(html, /More explanation|English — wording for review/);
});

test("candidate question help explains stream, improvement and 100/50/50 cutoff weighting", () => {
  for (const [answers, help] of [
    [["2026"], CHECK_COPY.streamWhy],
    [["2026", "academic"], CHECK_COPY.improvementWhy],
    [["2026", "academic", "no"], CHECK_COPY.mathsWhy],
    [["2026", "academic", "no", "86"], CHECK_COPY.physicsWhy],
    [["2026", "academic", "no", "86", "78"], CHECK_COPY.chemistryWhy],
  ] as const) {
    const state = answers.reduce(answerJourneyQuestion, EMPTY_JOURNEY);
    const html = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state);
    assert.ok(html.includes(help[0]));
    assert.ok(html.includes(help[1]));
  }
  assert.match(CHECK_COPY.mathsWhy[1], /full mathematics mark/);
  assert.match(CHECK_COPY.physicsWhy[1], /Half the physics mark/);
  assert.match(CHECK_COPY.chemistryWhy[1], /Half the chemistry mark/);
});

test("progressive answers survive the form round trip and the engine supplies the cutoff", () => {
  let state = EMPTY_JOURNEY;
  for (const answer of ["2026", "academic", "no", "86", "78", "81"]) {
    assert.ok(nextJourneyQuestion(state));
    state = parseJourneyState(JSON.stringify(answerJourneyQuestion(state, answer)));
  }
  assert.equal(nextJourneyQuestion(state), null);
  assert.deepEqual([state.maths, state.physics, state.chemistry], [86, 78, 81]);
  const result = journeyGuidanceResult(state, runtime());
  assert.equal(result?.eligibility.cutoff, 165.5);
  assert.ok(result?.eligibility.checks.some((check) => check.rule_id === "ELG009" && check.source_id === "SRC002"));
  assert.equal(result?.eligibility.outcome, "NEEDS_REVIEW");
  const html = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state);
  assert.match(html, /165.5 \/ 200/);
  assert.match(html, /முழுத் தகுதியை உறுதிப்படுத்த இன்னும் சில விவரங்களைச் சரிபார்க்க வேண்டும்/);
  assert.doesNotMatch(html, /NEEDS_REVIEW/);
  assert.doesNotMatch(html, /இடம் உறுதி/);
});

test("unknown is null for the engine, never false or zero, and known answers remain on retry", () => {
  let state = EMPTY_JOURNEY;
  for (const answer of ["2026", "academic", "unknown"]) state = answerJourneyQuestion(state, answer);
  assert.equal(state.improvement, "unknown");
  assert.equal(nextJourneyQuestion(state), null);
  const result = journeyGuidanceResult(state, runtime());
  assert.equal(result?.eligibility.cutoff, null);
  assert.equal(result?.eligibility.outcome, "NEEDS_REVIEW");
  assert.ok(result?.eligibility.blocking_missing_fields.includes("improvement_marks_used"));
  assert.match(renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state), /இந்தப் பதில் தெரியாது என்று குறிப்பிட்டுள்ளீர்கள்/);
  const resumed = retryUnknown(parseJourneyState(JSON.stringify(state)));
  assert.equal(resumed.year, 2026);
  assert.equal(resumed.stream, "academic");
  assert.equal(nextJourneyQuestion(resumed), "improvement");
  const missingMark = ["2026", "academic", "no", "86", "unknown"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  assert.equal(missingMark.physics, "unknown");
  assert.equal(journeyGuidanceResult(missingMark, runtime())?.eligibility.cutoff, null);
  assert.deepEqual([retryUnknown(missingMark).maths, retryUnknown(missingMark).physics], [86, null]);
});

test("year and route guards reject unsupported personal calculations", () => {
  const otherYear = answerJourneyQuestion(EMPTY_JOURNEY, "other");
  assert.equal(journeyGuidanceResult(otherYear, runtime()), null);
  assert.match(renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), otherYear), /நீங்கள் தேர்ந்தெடுத்த ஆண்டு அல்லது படிப்பு வழிக்கான தகுதியை/);
  const otherStream = answerJourneyQuestion(answerJourneyQuestion(EMPTY_JOURNEY, "2026"), "other");
  assert.equal(journeyGuidanceResult(otherStream, runtime()), null);
  assert.throws(() => answerJourneyQuestion(EMPTY_JOURNEY, "2027"));
  assert.throws(() => parseJourneyState('{"maths":999}'));
});

test("post-2005 improvement uses original marks and never silently uses improved marks", () => {
  const awaitingOriginal = ["2026", "academic", "yes", "2026"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  assert.match(renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), awaitingOriginal), /அசல் கணித மதிப்பெண்/);
  const missing = ["2026", "academic", "yes", "2026", "unknown"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  assert.equal(journeyGuidanceResult(missing, runtime())?.eligibility.cutoff, null);
  const complete = ["2026", "academic", "yes", "2026", "86", "78", "81"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  assert.equal(journeyGuidanceResult(complete, runtime())?.eligibility.cutoff, 165.5);
  assert.ok(journeyGuidanceResult(complete, runtime())?.eligibility.checks.some((check) => check.rule_id === "ELG032"));
});

test("local server serves the Tamil journey and advances a posted answer", async () => {
  const root = new URL("../../", import.meta.url);
  const server = spawn(process.execPath, ["--experimental-strip-types", "scripts/mvp-server.mjs"], {
    cwd: root, env: { ...process.env, PORT: "0" }, stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    const base = await new Promise<string>((resolve, reject) => {
      let output = "";
      const timeout = setTimeout(() => reject(new Error("MVP server did not start")), 8000);
      server.stdout.on("data", (data: Buffer) => {
        output += data.toString();
        const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (url) { clearTimeout(timeout); resolve(url); }
      });
      server.on("error", (error) => { clearTimeout(timeout); reject(error); });
      server.on("exit", (code) => { clearTimeout(timeout); reject(new Error(`MVP server exited: ${code}`)); });
    });
    const awareness = await fetch(`${base}/journey`);
    assert.equal(awareness.status, 200);
    const awarenessHtml = await awareness.text();
    assert.match(awarenessHtml, /data-content-id="AW-01"/);
    assert.match(awarenessHtml, /\/journey\?step=study/);
    assert.match(awarenessHtml, /\/journey\/questions/);
    const catalogue = await fetch(`${base}/journey/questions`);
    assert.equal(catalogue.status, 200);
    for (const q of collection.questions) for (const lang of ["ta", "en"]) {
      const response = await fetch(`${base}/journey/questions?id=${q.id}&lang=${lang}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(`data-guidance-unit="${q.unit}"`));
      assert.ok(html.includes(`<html lang="${lang}"`));
    }
    for (const unit of collection.units.keys()) for (const lang of ["ta", "en"]) {
      const response = await fetch(`${base}/journey/questions?topic=${unit}&lang=${lang}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      for (const q of collection.questions.filter((q) => q.unit === unit)) assert.ok(html.includes(`id=${q.id}`));
    }
    assert.equal((await fetch(`${base}/journey/questions?id=Q168`)).status, 404);
    assert.equal((await fetch(`${base}/journey/questions?evidence=admission`)).status, 404);
    for (const step of ["study", "compare"]) {
      const exploration = await fetch(`${base}/journey?step=${step}`);
      assert.equal(exploration.status, 200);
      assert.doesNotMatch(await exploration.text(), /name="answer"|type="number"/);
    }
    const direct = await fetch(`${base}/journey?step=check`);
    assert.match(await direct.text(), /எந்த ஆண்டு/);
    let saved = JSON.stringify(EMPTY_JOURNEY);
    for (const answer of ["2026", "academic", "no", "86", "78", "81"]) {
      const posted = await fetch(`${base}/journey`, {
        method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ state: saved, answer }),
      });
      assert.equal(posted.status, 200);
      const html = await posted.text();
      if (answer === "2026") assert.match(html, /HSC academic/);
      if (answer === "81") assert.match(html, /165.5 \/ 200/);
      else {
        const encoded = html.match(/name="state" value="([^"]+)"/)?.[1];
        assert.ok(encoded);
        saved = encoded.replaceAll("&quot;", '"').replaceAll("&amp;", "&");
        parseJourneyState(saved);
        if (answer === "86") {
          const route = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: saved, navigate: "route" }) });
          assert.equal(route.status, 200);
          const routeHtml = await route.text();
          assert.match(routeHtml, /name="navigate" value="prepare"/);
          const routeState = routeHtml.match(/name="state" value="([^"]+)"/)?.[1];
          assert.ok(routeState);
          const prepare = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: routeState.replaceAll("&quot;", '"'), navigate: "prepare" }) });
          assert.equal(prepare.status, 200);
          const prepareHtml = await prepare.text();
          assert.match(prepareHtml, /name="navigate" value="check"/);
          const prepareState = prepareHtml.match(/name="state" value="([^"]+)"/)?.[1];
          assert.ok(prepareState);
          const resumed = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: prepareState.replaceAll("&quot;", '"'), navigate: "check" }) });
          const resumedHtml = await resumed.text();
          assert.match(resumedHtml, /இயற்பியல் மதிப்பெண்/);
          assert.match(resumedHtml, /கணிதம்:<\/strong> 86 \/ 100/);
          const awarenessReturn = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: saved, navigate: "awareness" }) });
          const awarenessReturnHtml = await awarenessReturn.text();
          assert.match(awarenessReturnHtml, /data-content-id="A01"/);
          assert.match(awarenessReturnHtml, /name="navigate" value="check"/);
        }
      }
    }
    const invalid = await fetch(`${base}/journey`, { method: "POST", body: "state=%7B%7D&answer=2026" });
    assert.equal(invalid.status, 400);
    const partial = ["2026", "academic", "no", "80"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
    for (const answer of ["", "101", "-1", "abc"]) {
      const response = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: JSON.stringify(partial), answer }) });
      assert.equal(response.status, 400);
      const html = await response.text();
      assert.match(html, /role="alert"/);
      assert.match(html, /முன்பு கொடுத்த பதில்கள் அப்படியே உள்ளன/);
      const saved = html.match(/name="state" value="([^"]+)"/)![1].replaceAll("&quot;", '"');
      assert.deepEqual(parseJourneyState(saved), partial);
      assert.match(html, /இயற்பியல் மதிப்பெண் எவ்வளவு/);
    }
    const changed = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: JSON.stringify(partial), edit: "maths" }) });
    assert.equal(changed.status, 200);
    const changedHtml = await changed.text();
    assert.match(changedHtml, /கணித மதிப்பெண் எவ்வளவு/);
    const changedState = parseJourneyState(changedHtml.match(/name="state" value="([^"]+)"/)![1].replaceAll("&quot;", '"'));
    assert.equal(changedState.maths, null);
    assert.equal(changedState.year, 2026);
    const complete = ["2026", "academic", "no", "86", "78", "81"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
    const switchPage = async (state: typeof EMPTY_JOURNEY, lang: "ta" | "en") => {
      const response = await fetch(`${base}/journey${lang === "en" ? "?lang=en" : ""}`, {
        method: "POST", body: new URLSearchParams({ state: JSON.stringify(state), navigate: "check" }),
      });
      assert.equal(response.status, 200);
      const html = await response.text();
      const encoded = html.match(/name="state" value="([^"]+)"/)?.[1];
      assert.ok(encoded);
      assert.deepEqual(parseJourneyState(encoded.replaceAll("&quot;", '"')), state);
      return html;
    };
    const english = await switchPage(complete, "en");
    assert.match(english, /<html lang="en"/);
    assert.match(english, /165.5 \/ 200/);
    assert.match(english, /Things worth checking/);
    assert.match(english, /action="\/journey\?lang=en"/);
    assert.match(await switchPage(complete, "ta"), /165.5 \/ 200/);
    const halfway = ["2026", "academic", "no", "86"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
    assert.match(await switchPage(halfway, "en"), /What was your Physics mark/);
    const unknown = answerJourneyQuestion(halfway, "unknown");
    const unknownEnglish = await switchPage(unknown, "en");
    assert.match(unknownEnglish, /Provide this detail now/);
    const retry = await fetch(`${base}/journey?lang=en`, { method: "POST", body: new URLSearchParams({ state: JSON.stringify(unknown), retry: "1" }) });
    assert.match(await retry.text(), /What was your Physics mark/);
    const invalidEnglish = await fetch(`${base}/journey?lang=en`, { method: "POST", body: new URLSearchParams({ state: JSON.stringify(halfway), answer: "101" }) });
    assert.equal(invalidEnglish.status, 400);
    assert.match(await invalidEnglish.text(), /You can enter a whole-number mark/);
    const unsupported = await switchPage(answerJourneyQuestion(EMPTY_JOURNEY, "other"), "en");
    assert.match(unsupported, /cannot be assessed here/);
    assert.doesNotMatch(unsupported, /165.5 \/ 200/);
  } finally {
    server.kill();
  }
});

test("editing preserves earlier answers and invalidates all dependent answers", () => {
  const complete = ["2026", "academic", "yes", "2026", "80", "70", "60"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  const edited = editJourneyAnswer(complete, "improvement");
  assert.equal(nextJourneyQuestion(edited), "improvement");
  assert.equal(edited.year, 2026);
  assert.equal(edited.stream, "academic");
  for (const field of ["improvement", "improvement_year", "maths", "physics", "chemistry"] as const) assert.equal(edited[field], null);
  const changed = ["no", "90", "70", "60"].reduce(answerJourneyQuestion, edited);
  assert.equal(journeyGuidanceResult(changed, runtime())?.eligibility.cutoff, 155);
  assert.deepEqual(editJourneyAnswer(complete, "year"), EMPTY_JOURNEY);
  assert.throws(() => editJourneyAnswer(complete, "community"));
  assert.throws(() => editJourneyAnswer(EMPTY_JOURNEY, "maths"));
  const unknown = ["2026", "academic", "no", "80", "unknown"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  assert.equal(editJourneyAnswer(unknown, "physics").maths, 80);
});

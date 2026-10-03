import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { answerJourneyQuestion, EMPTY_JOURNEY, journeyGuidanceResult, nextJourneyQuestion, parseJourneyState, retryUnknown } from "../../src/m2/journey.ts";
import { applyApprovedTamilStudentCopy, parseAwarenessPack } from "../../src/student-semantics/awareness.ts";
import { renderStudentEntryPage } from "../../src/ui/student-entry.ts";
import { renderM2Journey, reviewedAwarenessTamilQuestion, reviewedTamilUnit } from "../../src/ui/m2-journey.ts";
import { loadQuestionCollection, renderQuestionCollection } from "../../src/ui/explore-questions.ts";
import { contentMarkup } from "../../src/ui/student-entry.ts";

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
  load("docs/content/admission/student_pov_admission_evidence_int05_int08_v1.md"));
const runtime = () => createPilotRuntime({
  sources_csv: load("data/sources.csv"), colleges_csv: load("data/colleges.csv"),
  programmes_csv: load("data/programmes.csv"),
});

test("optional collection exposes exactly the 70 prepared IDs with saved answers and next directions", () => {
  const expected = [1, 2, 7, 10, 11, 12, 21, ...Array.from({ length: 63 }, (_, i) => i + 25)].map((n) => `Q${String(n).padStart(3, "0")}`);
  assert.deepEqual(collection.questions.map((q) => q.id).sort(), expected.sort());
  const assignments: Record<string, number[]> = {
    A01: [25, 26, 27, 28, 34, 35], A02: [30, 31, 32], A03: [29, 33],
    A04: [36, 37, 38, 39, 40, 41, 42, 43, 44], A05: [10, 11, 49, 50],
    A06: [12, 21, 47, 48], A07: [45, 46, 51], B01: [52, 53, 54, 55, 56, 57, 58],
    B02: [59], B03: [60, 61, 62, 63], B04: [1, 64, 65, 66, 67, 68, 69, 70],
    B05: [7, 71, 82], B06: [72, 73, 74, 75], B07: [76, 77, 78, 79, 80, 81, 83], B08: [2, 84, 85, 86, 87],
  };
  for (const [unit, ids] of Object.entries(assignments)) {
    assert.deepEqual(collection.questions.filter((q) => q.unit === unit).map((q) => q.id).sort(), ids.map((n) => `Q${String(n).padStart(3, "0")}`).sort());
  }
  const index = renderQuestionCollection(collection).html;
  assert.equal((index.match(/class="question"/g) ?? []).length, 70);
  for (const q of collection.questions) {
    const response = renderQuestionCollection(collection, q.id);
    assert.equal(response.status, 200);
    assert.ok(response.html.includes(contentMarkup(collection.units.get(q.unit)!.tamil)));
    const nextText = collection.units.get(q.unit)!.next.replace(/\[([^\]]+)\]\(https:\/\/[^)]+\)/g, "$1");
    assert.ok(response.html.replace(/<[^>]+>/g, "").includes(contentMarkup(nextText).replace(/<[^>]+>/g, "")));
    assert.match(response.html, /\/journey\?step=/);
    assert.match(response.html, /\/journey\/questions\?evidence=/);
  }
  assert.equal(collection.questions.find((q) => q.id === "Q049")?.wording, "How different are CSE, IT, AI & Data Science and AI & ML?");
  assert.equal(collection.questions.find((q) => q.id === "Q037")?.wording, "What is Computer Science and Engineering (CSE)?");
  const comparison = renderQuestionCollection(collection, "Q049").html;
  for (const term of ["CSE", "IT", "AI &amp; DS", "AI &amp; ML"]) assert.ok(comparison.includes(term));
  assert.equal(renderQuestionCollection(collection, "Q003").status, 404);
  assert.equal(renderQuestionCollection(collection, "Q168").status, 404);
  assert.match(renderQuestionCollection(collection, "Q070").html, /href="\/journey\/questions\?id=Q086"/);
  for (const id of ["Q060", "Q002"]) assert.ok(renderQuestionCollection(collection, "Q081").html.includes(`href="/journey/questions?id=${id}"`));
  assert.throws(() => loadQuestionCollection(awarenessReviewed.replace("Q037 “", "Q999 “"), reviewed, admissionCoverage, "", ""));
});

test("lateral entry is informational and cutoff explanation preserves the result tab", () => {
  const lateral = renderQuestionCollection(collection, "Q060").html;
  assert.match(lateral, /data-guidance-unit="B03"/);
  assert.match(lateral, /தகுதியைக் கணக்கிடாது/);
  assert.doesNotMatch(lateral, /href="\/journey\?step=check"/);
  assert.match(lateral, /href="https:\/\/www.tnlea.com\/"/);
  const state = ["2026", "academic", "no", "86", "78", "81"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  const result = renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state);
  assert.match(result, /id=Q002" target="_blank"/);
  assert.match(result, /165.5 \/ 200/);
  assert.match(result, /NEEDS_REVIEW/);
  assert.match(renderM2Journey("route", pack, reviewed, awarenessReviewed, runtime()), /id=Q060/);
  for (const page of ["awareness", "study", "compare", "route", "prepare"] as const) {
    const withInputs = renderM2Journey(page, pack, reviewed, awarenessReviewed, runtime(), state);
    assert.match(withInputs, /href="\/journey\/questions" target="_blank"/);
    if (page === "route") assert.match(withInputs, /id=Q060" target="_blank"/);
  }
});

test("zero-knowledge Tamil path offers engineering and branch awareness before TNEA or marks", () => {
  const start = renderM2Journey("awareness", pack, reviewed, awarenessReviewed, runtime());
  assert.match(start, /<html lang="ta"/);
  assert.match(start, /data-content-id="AW-01"/);
  assert.match(start, /மதிப்பெண்களோ கல்லூரித் தேர்வோ இப்போது தேவையில்லை/);
  assert.match(start, /data-content-id="A01"/);
  assert.match(start, /data-content-id="A04"/);
  assert.match(start, /\/journey\?step=study/);
  assert.match(start, /\/journey\?step=compare/);
  assert.match(start, /\/journey\?step=route/);
  assert.doesNotMatch(start, /name="answer"|type="number"/);
  const study = renderM2Journey("study", pack, reviewed, awarenessReviewed, runtime());
  assert.match(study, /Q037|CSE/);
  assert.match(study, /ECE/);
  assert.match(study, /Mechanical/);
  assert.match(study, /Civil/);
  assert.doesNotMatch(study, /name="answer"|type="number"/);
  const compare = renderM2Journey("compare", pack, reviewed, awarenessReviewed, runtime());
  assert.match(compare, /data-content-id="A06"/);
  assert.match(compare, /data-content-id="A05"/);
  assert.match(compare, /திறன் தீர்ப்பு அல்ல/);
  assert.doesNotMatch(compare, /name="answer"|type="number"/);
  assert.match(reviewedAwarenessTamilQuestion(awarenessReviewed, "A04", "Q041"), /Mechanical/);
  const route = renderM2Journey("route", pack, reviewed, awarenessReviewed, runtime());
  assert.match(route, /data-content-id="AW-03"/);
  assert.match(route, /data-content-id="AW-05"/);
  assert.match(route, /B01, B04/);
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
  assert.match(html, /NEEDS_REVIEW/);
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
  assert.match(renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), state), /தகவல் இன்னும் தெரியவில்லை/);
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
  assert.match(renderM2Journey("check", pack, reviewed, awarenessReviewed, runtime(), otherYear), /2026 விதியை அடுத்த ஆண்டுக்கு/);
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
    for (const q of collection.questions) {
      const response = await fetch(`${base}/journey/questions?id=${q.id}`);
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(`data-guidance-unit="${q.unit}"`));
    }
    assert.equal((await fetch(`${base}/journey/questions?id=Q168`)).status, 404);
    for (const source of ["awareness", "admission"]) assert.equal((await fetch(`${base}/journey/questions?evidence=${source}`)).status, 200);
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
          assert.match(resumedHtml, /கணித மதிப்பெண் சேர்க்கப்பட்டது/);
          const awarenessReturn = await fetch(`${base}/journey`, { method: "POST", body: new URLSearchParams({ state: saved, navigate: "awareness" }) });
          const awarenessReturnHtml = await awarenessReturn.text();
          assert.match(awarenessReturnHtml, /data-content-id="A01"/);
          assert.match(awarenessReturnHtml, /name="navigate" value="check"/);
        }
      }
    }
    const invalid = await fetch(`${base}/journey`, { method: "POST", body: "state=%7B%7D&answer=2026" });
    assert.equal(invalid.status, 400);
  } finally {
    server.kill();
  }
});

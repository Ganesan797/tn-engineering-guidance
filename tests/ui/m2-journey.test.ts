import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createPilotRuntime } from "../../src/application/pilot-runtime.ts";
import { answerJourneyQuestion, EMPTY_JOURNEY, journeyGuidanceResult, nextJourneyQuestion, parseJourneyState, retryUnknown } from "../../src/m2/journey.ts";
import { applyApprovedTamilStudentCopy, parseAwarenessPack } from "../../src/student-semantics/awareness.ts";
import { renderStudentEntryPage } from "../../src/ui/student-entry.ts";
import { renderM2Journey, reviewedTamilUnit } from "../../src/ui/m2-journey.ts";

const load = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
const pack = applyApprovedTamilStudentCopy(parseAwarenessPack(
  load("data/m1_awareness_content_pack_v1.json"),
  load("docs/content/m1/m1_awareness_content_pack_v1.md"),
  load("data/sources.csv"),
), load("docs/content/m1/m1_tamil_student_copy_v1.md"));
const reviewed = load("docs/content/admission/student_pov_admission_batch_int05_int08_v1.md");
const runtime = () => createPilotRuntime({
  sources_csv: load("data/sources.csv"), colleges_csv: load("data/colleges.csv"),
  programmes_csv: load("data/programmes.csv"),
});

test("zero-knowledge Tamil path provides awareness and TNEA orientation before marks", () => {
  const start = renderM2Journey("awareness", pack, reviewed, runtime());
  assert.match(start, /<html lang="ta"/);
  assert.match(start, /data-content-id="AW-01"/);
  assert.match(start, /மதிப்பெண்கள் இப்போது தேவையில்லை/);
  assert.doesNotMatch(start, /name="answer"|type="number"/);
  const route = renderM2Journey("route", pack, reviewed, runtime());
  assert.match(route, /data-content-id="AW-03"/);
  assert.match(route, /data-content-id="AW-05"/);
  assert.match(route, /B01, B04/);
  assert.match(route, /\/journey\?step=prepare/);
  assert.match(renderM2Journey("prepare", pack, reviewed, runtime()), /data-content-id="B05"/);
  assert.match(reviewedTamilUnit(reviewed, "B01"), /TNEA/);
});

test("informed student can enter the optional check directly", () => {
  assert.match(renderStudentEntryPage({ route: "personal", language: "ta" }, pack), /\/journey\?step=check/);
  const check = renderM2Journey("check", pack, reviewed, runtime());
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
  const html = renderM2Journey("check", pack, reviewed, runtime(), state);
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
  assert.match(renderM2Journey("check", pack, reviewed, runtime(), state), /தகவல் இன்னும் தெரியவில்லை/);
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
  assert.match(renderM2Journey("check", pack, reviewed, runtime(), otherYear), /2026 விதியை அடுத்த ஆண்டுக்கு/);
  const otherStream = answerJourneyQuestion(answerJourneyQuestion(EMPTY_JOURNEY, "2026"), "other");
  assert.equal(journeyGuidanceResult(otherStream, runtime()), null);
  assert.throws(() => answerJourneyQuestion(EMPTY_JOURNEY, "2027"));
  assert.throws(() => parseJourneyState('{"maths":999}'));
});

test("post-2005 improvement uses original marks and never silently uses improved marks", () => {
  const awaitingOriginal = ["2026", "academic", "yes", "2026"].reduce(answerJourneyQuestion, EMPTY_JOURNEY);
  assert.match(renderM2Journey("check", pack, reviewed, runtime(), awaitingOriginal), /அசல் கணித மதிப்பெண்/);
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
    assert.match(await awareness.text(), /data-content-id="AW-01"/);
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
      }
    }
    const invalid = await fetch(`${base}/journey`, { method: "POST", body: "state=%7B%7D&answer=2026" });
    assert.equal(invalid.status, 400);
  } finally {
    server.kill();
  }
});

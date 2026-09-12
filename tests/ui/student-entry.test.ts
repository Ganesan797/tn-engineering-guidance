import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { once } from "node:events";
import { entryHref, entryStateFromUrl, routeForIntent, switchEntryLanguage } from "../../src/student-entry/routing.ts";
import { ENTRY_ROUTES } from "../../src/student-entry/models.ts";
import { renderStudentEntryPage, renderReferenceGuidancePage } from "../../src/ui/student-entry.ts";
import { blankReferenceRequest } from "../../src/ui/reference-request.ts";
import { resolveStudentMessage, MissingStudentPresentationError, M1_ENTRY_COPY_REVIEW } from "../../src/student-semantics/index.ts";
import { parseAwarenessPack, applyApprovedTamilStudentCopy, AWARENESS_GROUPS } from "../../src/student-semantics/awareness.ts";

const packDocument = readFileSync(new URL("../../docs/m1_awareness_content_pack_v1.md", import.meta.url), "utf8");
const frozenPack = parseAwarenessPack(
  readFileSync(new URL("../../data/m1_awareness_content_pack_v1.json", import.meta.url), "utf8"),
  packDocument,
  readFileSync(new URL("../../data/sources.csv", import.meta.url), "utf8"),
);
const tamilCopyDocument = readFileSync(new URL("../../docs/m1_tamil_student_copy_v1.md", import.meta.url), "utf8");
const pack = applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument);

const context = { snapshot_id: "CONFIGURED_EVIDENCE", snapshot_stage: null };

test("home offers awareness and three intents without a profile form or backend codes", () => {
  for (const language of ["en", "ta"] as const) {
    const html = renderStudentEntryPage({ route: "home", language }, pack);
    for (const route of ["beginner", "personal", "counselling"] as const) {
      assert.ok(html.includes(entryHref(route, language)));
    }
    assert.doesNotMatch(html, /<form|<input|profile\.|ELG\d|PREDICATE_|NEEDS_REVIEW|UNKNOWN_OR_UNPUBLISHED|snapshot_id/);
    for (const paragraph of pack.items[0].presentations[language].body.split("\n\n")) {
      assert.ok(html.includes(paragraph));
    }
    assert.ok(html.includes(pack.version));
    assert.ok(html.includes(pack.items[0].sources[0].name));
  }
});

test("beginner and unknown routing have no academic input or domain dependencies", () => {
  assert.equal(routeForIntent(null), "beginner");
  const html = renderStudentEntryPage({ route: routeForIntent(null), language: "en" }, pack);
  assert.match(html, /without marks or personal details/);
  assert.doesNotMatch(html, /<form|<input|<script|\/guidance\b/);
  assert.match(html, /href="\/personal\?lang=en"/);
  const routing = readFileSync(new URL("../../src/student-entry/routing.ts", import.meta.url), "utf8");
  assert.doesNotMatch(routing, /StudentProfile|GuidanceRequest|evaluateEligibility|submitStudentGuidanceForm|demoScenario/);
});

test("direct routes expose available actions and the reference language limitation", () => {
  const personal = renderStudentEntryPage({ route: "personal", language: "en" }, pack);
  assert.match(personal, /form and its results are currently in English/);
  assert.match(personal, /href="\/personal\/reference\?lang=en"/);
  const counselling = renderStudentEntryPage({ route: "counselling", language: "en" }, pack);
  assert.match(counselling, /choice-preparation experience is not ready yet/);
  assert.match(counselling, /href="\/personal\?lang=en"/);
  assert.match(counselling, /href="\/beginner\?lang=en"/);
  assert.doesNotMatch(counselling, /disabled|<form/);
});

test("reference initializer has only unknown student data, neutral preferences and explicit dataset context", () => {
  const request = blankReferenceRequest(context);
  for (const [field, value] of Object.entries(request.profile)) {
    if (field === "tn_study_years_or_classes") {
      assert.ok(Object.values(value!).every((item) => item === null));
    } else assert.equal(value, null, field);
  }
  assert.equal(request.preferences.branch_preference_order, null);
  assert.deepEqual(request.counselling, { ...context, round: null, reservation_category: null, quota: null });
  const html = renderReferenceGuidancePage({ form: request, response: null }, "ta");
  assert.match(html, /<html lang="en"/);
  assert.match(html, /href="\/\?lang=ta"/);
  assert.doesNotMatch(html, /value="90"|value="80"|value="70"|value="ECE" selected/);
  assert.match(html, /action="\/guidance\?lang=ta"/);
});

test("language switching preserves semantic routes and does not mutate domain state", () => {
  const domain = blankReferenceRequest(context);
  const original = structuredClone(domain);
  for (const route of ENTRY_ROUTES) {
    const entry = Object.freeze({ route, language: "en" as const });
    const switched = switchEntryLanguage(entry, "ta");
    assert.equal(switched.route, route);
    assert.deepEqual(switchEntryLanguage(switched, "en"), entry);
    assert.deepEqual(entryStateFromUrl(new URL(entryHref(route, "ta"), "http://localhost")), switched);
    assert.doesNotThrow(() => renderStudentEntryPage(switched, pack));
  }
  assert.deepEqual(domain, original);
  assert.equal(M1_ENTRY_COPY_REVIEW.ta, "PENDING_HUMAN_LANGUAGE_REVIEW");
});

test("missing translation produces an explicit safe page with an intentional English link", () => {
  const html = renderStudentEntryPage({ route: "beginner", language: "ta" }, pack, (message, language) => {
    if (message.key === "entry.beginner.prompt") throw new MissingStudentPresentationError(language, message.key);
    return resolveStudentMessage(message, language);
  });
  assert.match(html, /<html lang="ta"/);
  assert.match(html, /role="status"/);
  assert.match(html, /href="\/beginner\?lang=en"/);
  assert.doesNotMatch(html, /MissingStudentPresentationError|stack|student presentation is unavailable/);
});

test("all ten frozen bilingual identities retain exact content and source metadata", () => {
  assert.deepEqual(frozenPack.items.map((item) => item.id), Array.from({ length: 10 }, (_, i) => `AW-${String(i + 1).padStart(2, "0")}`));
  for (const item of frozenPack.items) {
    assert.equal(item.output_class, "INFORMATION");
    for (const language of ["en", "ta"] as const) {
      assert.ok(packDocument.includes(item.presentations[language].body));
      assert.ok(packDocument.includes(item.presentations[language].title));
    }
    assert.ok(item.sources.length > 0);
    assert.ok(item.sources.every((source) => source.name && source.url.startsWith("https://")));
    assert.ok(item.source_locations);
  }
});

test("approved Tamil overlay changes only presentation and retains every takeaway", () => {
  const before = structuredClone(frozenPack);
  const updated = applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument);
  assert.deepEqual(frozenPack, before);
  for (const [index, item] of updated.items.entries()) {
    const original = frozenPack.items[index];
    assert.deepEqual({ ...item, presentations: original.presentations }, original);
    assert.deepEqual(item.presentations.en, original.presentations.en);
    assert.ok(tamilCopyDocument.includes(item.presentations.ta.title));
    const [content, takeaway] = item.presentations.ta.body.split(/\n\n(?=[^\n]+$)/);
    assert.ok(tamilCopyDocument.includes(content));
    assert.ok(tamilCopyDocument.includes(takeaway));
  }
  assert.throws(() => applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument.replace("### AW-10", "### AW-09")));
  assert.throws(() => applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument.replace("APPROVED_V1", "DRAFT")));
});

test("Tamil copy preserves eligible-seat wording and conditional support with numeric source verification", () => {
  const choice = pack.items.find((item) => item.id === "AW-06")!;
  assert.match(choice.presentations.ta.body, /உங்களுக்குப் பொருந்தும் இடங்கள் \(Eligible Seats\)/);
  assert.doesNotMatch(choice.presentations.ta.body, /Available Seats|காலியாக உள்ள இடங்கள்/);
  const support = pack.items.find((item) => item.id === "AW-08")!;
  assert.match(support.presentations.ta.body, /7\.5% Reservation/);
  assert.match(support.presentations.ta.body, /இவை எல்லா மாணவர்களுக்கும் தானாகக் கிடைக்காது/);
  assert.ok(support.sources.some((source) => source.source_id === "SRC002"));
  assert.match(tamilCopyDocument, /printed page 4, section 4\.1/);
  const html = renderStudentEntryPage({ route: "beginner", language: "ta" }, pack, undefined, { section: "support" });
  assert.match(html, /7\.5% Reservation/);
  assert.match(html, /class="learn-more"/);
  assert.doesNotMatch(html, /<form|PREDICATE_|NEEDS_REVIEW/);
});

test("five sections progressively disclose frozen content and preserve caveats and evidence", () => {
  for (const language of ["ta", "en"] as const) {
    for (const group of AWARENESS_GROUPS) {
      const html = renderStudentEntryPage({ route: "beginner", language }, pack, undefined, { section: group.key });
      assert.equal([...html.matchAll(/data-content-id=/g)].length, group.ids.length);
      for (const id of group.ids) {
        const item = pack.items.find((value) => value.id === id)!;
        assert.ok(html.includes(`data-content-id="${id}"`));
        for (const source of item.sources) assert.ok(html.includes(`data-source-id="${source.source_id}"`));
      }
      const visibleText = html.replace(/<[^>]*>/g, "");
      assert.doesNotMatch(visibleText, /AW-\d{2}|SRC\d{3}|PREDICATE_|NEEDS_REVIEW/);
      assert.doesNotMatch(html, /<details[^>]*\bopen\b|<form|<input/);
      assert.match(html, /class="evidence"/);
      assert.ok(html.includes(`lang=en&section=${group.key}`));
      assert.ok(html.includes(`lang=ta&section=${group.key}`));
    }
  }
  const academic = renderStudentEntryPage({ route: "beginner", language: "en" }, pack, undefined, { section: "admission" });
  const primary = academic.replace(/<details[\s\S]*?<\/details>/g, "");
  assert.match(primary, /general academic TNEA 2026/);
  assert.match(primary, /not a guaranteed college or branch/);
  assert.match(primary, /online application/);
});

test("interactive cards are complete anchors and governance notices require review mode", () => {
  const home = renderStudentEntryPage({ route: "home", language: "en" }, pack);
  assert.equal([...home.matchAll(/<a class="choice-card"/g)].length, 3);
  assert.match(home, /:focus-visible/);
  assert.doesNotMatch(home, /Development review only|human review preview|Tamil wording is pending/);
  const review = renderStudentEntryPage({ route: "home", language: "en" }, pack, undefined, { review: true });
  assert.match(review, /<aside class="review-only">Development review only/);
});

test("live server keeps entry, blank personal form and synthetic demo paths separate", async () => {
  const child = spawn(process.execPath, ["--experimental-strip-types", "scripts/mvp-server.mjs"], {
    cwd: new URL("../../", import.meta.url), env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  try {
    const base = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Server did not start: ${stderr}`)), 10000);
      child.once("error", (error) => { clearTimeout(timer); reject(error); });
      child.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${stderr}`)); });
      child.stdout.on("data", (chunk) => {
        const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (url) { clearTimeout(timer); resolve(url); }
      });
    });
    for (const path of ["/?lang=en", "/beginner?lang=en", "/personal?lang=en", "/counselling?lang=en"]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.doesNotMatch(html, /guidance-form|Your TNEA cutoff|value="90"/);
      // Every displayed internal destination is served, including return and language links.
      for (const href of new Set([...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]))) {
        if (href.startsWith("/")) assert.equal((await fetch(base + href)).status, 200, href);
      }
    }
    const personal = await (await fetch(base + "/personal/reference?lang=en&scenario=eligible")).text();
    assert.match(personal, /name="profile.maths_mark"[^>]*value=""/);
    assert.doesNotMatch(personal, /value="90"|value="ECE" selected/);
    const demo = await (await fetch(base + "/demo?scenario=eligible")).text();
    assert.match(demo, /DEVELOPMENT DEMO — synthetic student profiles/);
    assert.match(demo, /value="90"/);
    assert.match(demo, /action="\/demo\/guidance"/);

    const fields = new URLSearchParams({
      "counselling.snapshot_id": "PILOT_PROGRAMME_EVIDENCE_ONLY",
      "counselling.snapshot_stage": "PROGRAMME_EVIDENCE_ONLY",
      "eligibility_request.academic_merit_cutoff_requested": "true",
    });
    const post = async () => (await fetch(base + "/guidance?lang=en", { method: "POST", body: fields })).text();
    const partial = await post();
    assert.match(partial, /need a little more information to confirm your eligibility/);
    assert.match(partial, /Information still needed/);
    assert.doesNotMatch(partial, /Your TNEA cutoff:/);
    // Explicit student input, never a server-provided profile preset.
    for (const [key, value] of Object.entries({
      maths_mark: "90", physics_mark: "80", chemistry_mark: "70",
      qualifying_stream: "HSC_ACADEMIC", community: "GENERAL", govt_school_7_5: "false",
      tamil_nadu_native: "true", nativity_exception_type: "NONE",
      grade_certificate_used: "false", improvement_marks_used: "false",
    })) fields.set(`profile.${key}`, value);
    for (const year of [8, 9, 10, 11, 12]) fields.set(`profile.tn_study_years_or_classes.class_${year}_in_tn`, "true");
    const eligible = await post();
    assert.match(eligible, /meet the checked TNEA eligibility conditions/);
    assert.match(eligible, /Your TNEA cutoff: 165 \/ 200/);
    assert.match(eligible, /Source SRC002/);
    assert.equal(await post(), eligible);
  } finally {
    if (child.exitCode === null) { const exited = once(child, "exit"); child.kill(); await exited; }
  }
});

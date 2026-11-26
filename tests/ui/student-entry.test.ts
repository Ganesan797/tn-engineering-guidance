import assert from "node:assert/strict";
import test from "node:test";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { once } from "node:events";
import { entryHref, entryStateFromUrl, routeForIntent, switchEntryLanguage } from "../../src/student-entry/routing.ts";
import { ENTRY_ROUTES } from "../../src/student-entry/models.ts";
import { renderStudentEntryPage, renderReferenceGuidancePage } from "../../src/ui/student-entry.ts";
import { calculateAcademicCutoffFromRule } from "../../src/domain/rules.ts";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import { blankReferenceRequest } from "../../src/ui/reference-request.ts";
import { resolveStudentMessage, MissingStudentPresentationError, M1_ENTRY_COPY_REVIEW } from "../../src/student-semantics/index.ts";
import { parseAwarenessPack, applyApprovedTamilStudentCopy, AWARENESS_GROUPS } from "../../src/student-semantics/awareness.ts";

const packDocument = readFileSync(new URL("../../docs/content/m1/m1_awareness_content_pack_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const frozenPack = parseAwarenessPack(
  readFileSync(new URL("../../data/m1_awareness_content_pack_v1.json", import.meta.url), "utf8"),
  packDocument,
  readFileSync(new URL("../../data/sources.csv", import.meta.url), "utf8"),
);
const tamilCopyDocument = readFileSync(new URL("../../docs/content/m1/m1_tamil_student_copy_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const pack = applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument);

const context = { snapshot_id: "CONFIGURED_EVIDENCE", snapshot_stage: null };

test("home offers a distinct starting choice and three intents without duplicating awareness", () => {
  for (const language of ["en", "ta"] as const) {
    const html = renderStudentEntryPage({ route: "home", language }, pack);
    assert.ok(html.includes("fonts.googleapis.com"), "Home must include Google Fonts preconnect");
    assert.ok(html.includes("Plus+Jakarta+Sans"), "Home must include Plus Jakarta Sans");
    assert.ok(html.includes("Noto+Sans+Tamil"), "Home must include Noto Sans Tamil");
    for (const route of ["personal", "counselling"] as const) {
      assert.ok(html.includes(entryHref(route, language))); assert.ok(html.includes(`/colleges?lang=${language}`));
    }
    assert.doesNotMatch(html, /<form|<input|profile\.|ELG\d|PREDICATE_|NEEDS_REVIEW|UNKNOWN_OR_UNPUBLISHED|snapshot_id/);
    assert.doesNotMatch(html, /data-content-id="AW-01"|class="home-more"|href="\/beginner/);
    const introduction = renderStudentEntryPage({ route: "beginner", language }, pack);
    for (const paragraph of pack.items[0].presentations[language].body.split("\n\n")) {
      assert.ok(introduction.includes(paragraph));
    }
    assert.ok(introduction.includes(pack.version));
    assert.ok(introduction.includes(pack.items[0].sources[0].name));
    assert.doesNotMatch(html, /choice-list builder is not yet available|தேர்வுப் பட்டியல் உருவாக்கும் வசதி இன்னும் இல்லை/);
  }
});

test("first-time entry opens the same guided journey in each language", () => {
  const tamil = renderStudentEntryPage({ route: "home", language: "ta" }, pack);
  const english = renderStudentEntryPage({ route: "home", language: "en" }, pack);
  assert.match(tamil, /class="choice-card recommended" href="\/journey"/);
  assert.match(english, /class="choice-card recommended" href="\/journey\?lang=en"/);
  assert.doesNotMatch(english, /class="choice-card recommended" href="\/beginner/);
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
  assert.match(personal, /href="\/journey\?step=check&amp;lang=en"/);
  assert.doesNotMatch(personal, /href="\/personal\/reference\?lang=en"/);
  const counselling = renderStudentEntryPage({ route: "counselling", language: "en" }, pack);
  assert.doesNotMatch(counselling, /choice-preparation experience is not ready yet/);
  assert.match(counselling, /Choice Order Planner|\/m5-guidance/);
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

test("one recommended starting card remains a complete anchor and shortcuts stay secondary", () => {
  const home = renderStudentEntryPage({ route: "home", language: "en" }, pack);
  assert.equal([...home.matchAll(/<a class="choice-card recommended"/g)].length, 1);
  const tamil = renderStudentEntryPage({ route: "home", language: "ta" }, pack);
  assert.match(tamil, /class="choice-card recommended" href="\/journey"/);
  assert.ok(tamil.indexOf('href="/journey"') < tamil.indexOf('href="/personal?lang=ta"'));
  assert.doesNotMatch(tamil, /தேர்வுப் பட்டியல் உருவாக்கும் வசதி இன்னும் இல்லை/);
  assert.match(home, /:focus-visible/);
  assert.doesNotMatch(home, /Development review only|human review preview|Tamil wording is pending/);
  const review = renderStudentEntryPage({ route: "home", language: "en" }, pack, undefined, { review: true });
  assert.match(review, /<aside class="review-only">Development review only/);
});

test("only explicit owner-preview configuration adds the real M4 bridge", () => {
  for (const language of ["ta", "en"] as const) {
    const state = { route: "home" as const, language };
    const normal = renderStudentEntryPage(state, pack);
    const queryReview = renderStudentEntryPage(state, pack, undefined, { review: true });
    assert.doesNotMatch(normal + queryReview, /\/internal\/m4-pilot/);
    const owner = renderStudentEntryPage(state, pack, undefined, { ownerPreview: true });
    assert.equal((owner.match(/href="\/internal\/m4-pilot\?lang=/g) ?? []).length, 1);
    assert.match(owner, language === "ta" ? /படிப்புகள் மற்றும் கல்லூரிகளைப் பார்க்கலாம்/ : /Explore courses and colleges/);
    const learning = renderStudentEntryPage({ route: "beginner", language }, pack, undefined, { section: "engineering", ownerPreview: true });
    assert.match(learning, new RegExp(`/internal/m4-pilot\\?lang=${language}&amp;view=branches`));
    assert.doesNotMatch(renderStudentEntryPage({ route: "beginner", language }, pack, undefined, { section: "engineering" }), /\/internal\/m4-pilot/);
  }
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
      const timer = setTimeout(() => reject(new Error(`Server did not start: ${stderr}`)), 20000);
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
    // Authoritative browser calculation test: form POST to /personal executes ELG009 without client arithmetic
    const calcPost = await fetch(base + "/personal?lang=en", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ maths: "95", physics: "90", chemistry: "91" }).toString(),
    });
    assert.equal(calcPost.status, 200);
    const postHtml = await calcPost.text();
    assert.match(postHtml, /185\.5 \/ 200/);
    assert.match(postHtml, /95 \+ \(90 \+ 91\) \/ 2 = 185\.5/);
    assert.match(postHtml, /Calculated Academic Cutoff Score/);
    assert.doesNotMatch(postHtml, /score\s*=\s*m\s*\+\s*\(p\s*\+\s*c\)/);
    assert.doesNotMatch(postHtml, /e\.preventDefault/);

    // Negative privacy test: GET with marks in query string is completely ignored
    const calcGet = await fetch(base + "/personal?lang=en&maths=95&physics=90&chemistry=91");
    assert.equal(calcGet.status, 200);
    const getHtml = await calcGet.text();
    assert.doesNotMatch(getHtml, /185\.5 \/ 200/);
    assert.match(getHtml, /name="maths" min="0" max="100"[^>]*value=""/);

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

test("Fix 2 & P1-A: Reuse accepted ELG009 calculation authority with input validation", () => {
  // Authoritative ELG009 rule evaluation
  const valid = calculateAcademicCutoffFromRule(95, 90, 91);
  assert.equal(valid.cutoff, 185.5);
  assert.equal(valid.cutoffTrace.status, "AVAILABLE");
  assert.equal(valid.cutoffTrace.calculation_id, "TNEA_ACADEMIC_CUTOFF");
  assert.deepEqual(valid.cutoffTrace.operands.map((o) => o.value), [95, 90, 91]);

  // P1-B: Invalid and blank inputs fail-closed with null cutoff and UNAVAILABLE trace
  assert.equal(calculateAcademicCutoffFromRule(null, 90, 91).cutoff, null);
  assert.equal(calculateAcademicCutoffFromRule(-5, 90, 91).cutoff, null);
  assert.equal(calculateAcademicCutoffFromRule(105, 90, 91).cutoff, null);
  assert.equal(calculateAcademicCutoffFromRule(NaN, 90, 91).cutoff, null);
});

test("Fix 2 & P0-A/P1-B/P1-C: Cutoff calculator provides marks privacy, stale clearing, and merit rank distinction", () => {
  // 1. Initial empty state (Tamil): form uses nonpersistent POST, no marks in action URL
  const emptyTa = renderStudentEntryPage({ route: "personal", language: "ta" }, pack);
  assert.match(emptyTa, /id="cutoff-calc-form"/);
  assert.ok(emptyTa.includes('method="POST" action="/personal?lang=ta"'));
  assert.match(emptyTa, /name="maths"/);
  assert.match(emptyTa, /name="physics"/);
  assert.match(emptyTa, /name="chemistry"/);
  assert.match(emptyTa, /value=""/);
  assert.match(emptyTa, /style="display:none"/);
  assert.ok(emptyTa.includes("Overall Merit Rank"));
  assert.ok(emptyTa.includes("Community Rank"));
  assert.ok(emptyTa.includes("Govt School Rank"));
  assert.ok(emptyTa.includes('href="/colleges?view=colleges&amp;lang=ta"'));
  assert.ok(emptyTa.includes('href="/counselling?lang=ta"'));
  assert.ok(emptyTa.includes('href="/journey?step=check"'));
  assert.doesNotMatch(emptyTa, /href="\/personal\/reference\?lang=ta"|ஆங்கிலத்தில் விரிவான படிவத்தைத் திறக்கலாம்/);

  // Authority & Privacy Invariant: Zero independent arithmetic in client script; no browser storage writes
  assert.doesNotMatch(emptyTa, /score\s*=\s*m\s*\+\s*\(p\s*\+\s*c\)/);
  assert.doesNotMatch(emptyTa, /e\.preventDefault/);
  assert.match(emptyTa, /function clearStale/);
  assert.doesNotMatch(emptyTa, /localStorage|sessionStorage|document.cookie/);

  // 2. Negative Test: GET with marks query parameters must NOT compute or prefill marks (P0-A)
  const getIgnored = renderStudentEntryPage({ route: "personal", language: "ta" }, pack);
  assert.ok(!getIgnored.includes("185.5 / 200"));

  // 3. Computed cutoff in Tamil (P1-A & P1-C)
  const calcTa = renderStudentEntryPage({ route: "personal", language: "ta" }, pack, undefined, {
    maths: "95", physics: "90", chemistry: "91",
  });
  assert.ok(calcTa.includes("185.5 / 200"));
  assert.ok(calcTa.includes("95 + (90 + 91) / 2 = 185.5"));
  assert.ok(calcTa.includes("உங்கள் TNEA Cutoff மதிப்பெண்"));
  assert.ok(calcTa.includes("கணக்கீட்டு முறை: இது கணிதம் (100) + இயற்பியல் (50) + வேதியியல் (50) ஆகியவற்றின் அடிப்படையில் 200-க்குக் கணக்கிடப்பட்ட Cutoff மதிப்பெண் மட்டுமே."));
  assert.match(calcTa, /www\.tneaonline\.org/);
  assert.ok(calcTa.includes('<form method="POST" action="/m5-guidance?lang=ta" style="margin:0;display:inline">'));
  assert.ok(calcTa.includes('<input type="hidden" name="cutoff" value="185.5">'));
  assert.ok(calcTa.includes("கட்-ஆஃப் ஒப்பீடு &amp; முன்னுரிமைத் திட்டம் (விருப்பத் தேர்வு நிரப்புதல்) →"));
  assert.ok(calcTa.includes('href="/colleges?view=colleges&amp;lang=ta"'));
  assert.ok(calcTa.includes('href="/counselling?lang=ta"'));

  // 4. Computed cutoff in English (P1-A & P1-C)
  const calcEn = renderStudentEntryPage({ route: "personal", language: "en" }, pack, undefined, {
    maths: "100", physics: "90", chemistry: "90",
  });
  assert.ok(calcEn.includes("190 / 200"));
  assert.ok(calcEn.includes("Calculated Academic Cutoff Score"));
  assert.ok(calcEn.includes("This is the composite academic cutoff score calculated out of 200 from your subject marks (Maths 100, Physics 50, Chemistry 50)."));
  assert.ok(calcEn.includes("A cutoff score is not an admission guarantee or an official rank."));
  assert.match(calcEn, /www\.tneaonline\.org/);
  assert.ok(calcEn.includes('<form method="POST" action="/m5-guidance?lang=en" style="margin:0;display:inline">'));
  assert.ok(calcEn.includes('<input type="hidden" name="cutoff" value="190">'));
  assert.ok(calcEn.includes("Cutoff Comparison &amp; Plan Choices →"));
  assert.ok(calcEn.includes('href="/colleges?view=colleges&amp;lang=en"'));
  assert.ok(calcEn.includes('href="/counselling?lang=en"'));
  assert.ok(!calcEn.includes('href="/personal/reference?lang=en"'));

  // 5. P1-B: Stale results negative test: Invalid or blank inputs render null cutoff and hidden result block
  for (const invalid of [
    { maths: "", physics: "90", chemistry: "90" },
    { maths: "-5", physics: "90", chemistry: "90" },
    { maths: "105", physics: "90", chemistry: "90" },
    { maths: "abc", physics: "90", chemistry: "90" },
  ]) {
    const invalidResult = renderStudentEntryPage({ route: "personal", language: "en" }, pack, undefined, invalid);
    assert.match(invalidResult, /style="display:none"/);
    assert.ok(!invalidResult.includes("185.5 / 200") && !invalidResult.includes("190 / 200"));
  }
});

test("Fix 2: Beginner admissions page includes static cutoff walkthrough without interactive form controls", () => {
  for (const language of ["ta", "en"] as const) {
    const html = renderStudentEntryPage({ route: "beginner", language }, pack, undefined, { section: "admission" });
    assert.doesNotMatch(html, /<form|<input|<script/);
    assert.match(html, new RegExp(`/personal\\?lang=${language}`));
    if (language === "ta") {
      assert.match(html, /கட்-ஆஃப் = கணிதம் \+ \(இயற்பியல் \+ வேதியியல்\) \/ 2/);
      assert.match(html, /170 \/ 200/);
      assert.match(html, /Merit Ranking/);
    } else {
      assert.match(html, /Cutoff = Mathematics \+ \(Physics \+ Chemistry\) \/ 2/);
      assert.match(html, /170 \/ 200/);
      assert.match(html, /merit ranking/);
    }
  }
});

test("Fix 4 & P0-B/P0-C/P1-C: Counselling page provides factual procedural guidance with official sources", () => {
  for (const language of ["ta", "en"] as const) {
    const html = renderStudentEntryPage({ route: "counselling", language }, pack);
    assert.doesNotMatch(html, /disabled|<form/);
    assert.match(html, new RegExp(`/colleges\\?view=colleges&amp;lang=${language}`));
    assert.match(html, new RegExp(`/personal\\?lang=${language}`));
    assert.match(html, new RegExp(`/beginner\\?lang=${language}`));
    assert.match(html, /www\.tneaonline\.org/);
    assert.match(html, /2_Information_Brochure_2026\.pdf/);
    assert.match(html, /8_TNEA_2024_Counselling_procedure_2026\.pdf/);

    if (language === "ta") {
      // Choice Ordering
      assert.match(html, /வரிசை 1-லிருந்து கீழ்நோக்கி வரிசையாக/);
      assert.match(html, /தானாக எந்த முடிவையும் (?:பூட்டவோ|உறுதி) செய்யாது/);
      // Upward Movement with TFC reporting/fee conditions and verified exceptions
      assert.match(html, /Accept &amp; Upward/);
      assert.match(html, /நேரில் சென்று அறிக்கை சமர்ப்பிக்க வேண்டும்/);
      assert.match(html, /அசல் சான்றிதழ்களைச் சமர்ப்பித்து சரிபார்க்க வேண்டும்/);
      assert.match(html, /உரிய கட்டணத்தைச் செலுத்த வேண்டும்/);
      assert.match(html, /அருகிலுள்ள TNEA உதவி மையத்திற்கு \(Nearest TFC\)/);
      assert.match(html, /போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகைத் திட்டம் \(PMSS\)/);
      assert.match(html, /தனிப்பட்ட தகுதி மற்றும் வருமான வரம்புகளைச் சரிபார்க்க வேண்டும்/);
      assert.match(html, /பிரிவின் அடிப்படையில் மட்டுமே கட்டண விலக்கு தானாகக் கிடைக்காது/);
      assert.match(html, /Decline &amp; Upward/);
      assert.match(html, /அடுத்த சுற்றுகளில் \(Subsequent Rounds\) அல்லது துணை கலந்தாய்வில் பங்கேற்கும் தகுதி தக்கவைக்கப்படும்/);
      // 7.5% Quota: Eligibility vs Document Verification vs Entitlement
      assert.match(html, /7\.5% அரசுப் பள்ளி முன்னுரிமை இடஒதுக்கீடு/);
      assert.match(html, /6-ஆம் வகுப்பு முதல் 12-ஆம் வகுப்பு வரை/);
      assert.match(html, /TNEA(?: 2026)? தகவல் கையேட்டில் குறிப்பிடப்பட்டுள்ள அதிகாரப்பூர்வ நடைமுறைகளின்படி/);
      assert.match(html, /TNEA உதவி மையங்களில் \(TFC\) சரிபார்க்கப்படும்/);
      assert.match(html, /தானாக கல்லூரி இடத்தை உறுதி செய்யாது/);
    } else {
      // Choice Ordering
      assert.match(html, /strictly in sequence starting from Choice 1 downward/);
      assert.match(html, /does not lock arbitrary predictions/);
      // Upward Movement
      assert.match(html, /Accept &amp; Upward/);
      assert.match(html, /report in person/);
      assert.match(html, /submit original certificates for verification/);
      assert.match(html, /pay the prescribed fee/);
      assert.match(html, /nearest TFC \(TNEA Facilitation Centre\)/);
      assert.match(html, /Post Matric Scholarship Scheme \(PMSS\)/);
      assert.match(html, /verify their specific eligibility and income conditions/);
      assert.match(html, /fee exemptions are not automatic based on category alone/);
      assert.match(html, /Decline &amp; Upward/);
      assert.match(html, /subsequent rounds or supplementary counselling is retained/);
      // 7.5% Quota
      assert.match(html, /7\.5% Government School Preferential Quota/);
      assert.match(html, /Standard 6 to Standard 12/);
      assert.match(html, /official procedures specified in the TNEA 2026 Information Brochure/);
      assert.match(html, /verified at TNEA Facilitation Centres \(TFC\)/);
      assert.match(html, /does not constitute an automatic seat guarantee/);
    }
  }
});

test("P2 Cleanup: Colleges navigation highlight is active on /colleges route", () => {
  const htmlTa = renderGovernedPilot(new URLSearchParams(), undefined, undefined, undefined, "/colleges");
  assert.ok(htmlTa.includes('<a href="/colleges?lang=ta" aria-current="page">கல்லூரிகள்</a>'));
  const htmlEn = renderGovernedPilot(new URLSearchParams({ lang: "en" }), undefined, undefined, undefined, "/colleges");
  assert.ok(htmlEn.includes('<a href="/colleges?lang=en" aria-current="page">Colleges</a>'));
});

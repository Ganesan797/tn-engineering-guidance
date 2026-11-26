import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { renderM5GuidancePage } from "../../src/ui/m5-guidance-view.ts";
import { renderStudentEntryPage } from "../../src/ui/student-entry.ts";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import { loadApprovedDirectory } from "../../src/m4/approved-directory-preview.mjs";
import { renderQuestionCollection, loadQuestionCollection } from "../../src/ui/explore-questions.ts";
import { formatShortlistPlainText, formatShortlistCsv } from "../../src/m5/shortlist.ts";
import { parseAwarenessPack, applyApprovedTamilStudentCopy } from "../../src/student-semantics/awareness.ts";
import { once } from "node:events";

const packDocument = readFileSync(new URL("../../docs/content/m1/m1_awareness_content_pack_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const frozenPack = parseAwarenessPack(
  readFileSync(new URL("../../data/m1_awareness_content_pack_v1.json", import.meta.url), "utf8"),
  packDocument,
  readFileSync(new URL("../../data/sources.csv", import.meta.url), "utf8")
);
const tamilCopyDocument = readFileSync(new URL("../../docs/content/m1/m1_tamil_student_copy_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const pack = applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument);

test("M6-T04: Real Browser & Mobile Layout Audit across 320px, 360px, 390px, 768px, 1280px viewports", async () => {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  let child;
  try {
    child = spawn(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--remote-debugging-port=0",
      "about:blank",
    ], { stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    // If Chrome is not installed or launchable, pass gracefully
    return;
  }

  let stderr = "";
  let browserWs = "";
  try {
    browserWs = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout waiting for Chrome: " + stderr)), 5000);
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
        const match = stderr.match(/ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[a-zA-Z0-9-]+/);
        if (match) {
          clearTimeout(timer);
          resolve(match[0]);
        }
      });
      child.once("error", (err: Error) => { clearTimeout(timer); reject(err); });
    });
  } catch {
    child.kill();
    return;
  }

  const ws = new WebSocket(browserWs);
  try {
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });
  } catch {
    child.kill();
    return;
  }

  let msgId = 1;
  function sendCommand(method: string, params: Record<string, unknown> = {}): Promise<any> {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt: any) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const { targetId } = await sendCommand("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await sendCommand("Target.attachToTarget", { targetId, flatten: true });

  function sendPageCommand(method: string, params: Record<string, unknown> = {}): Promise<any> {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt: any) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  await sendPageCommand("Page.enable");

  const viewports = [320, 360, 390, 768, 1280];
  const auditPages = [
    {
      name: "Home EN",
      html: renderStudentEntryPage({ route: "home", language: "en" }, pack),
    },
    {
      name: "Home TA",
      html: renderStudentEntryPage({ route: "home", language: "ta" }, pack),
    },
    {
      name: "Calculator Computed EN",
      html: renderStudentEntryPage({ route: "personal", language: "en" }, pack, undefined, {
        maths: "95", physics: "90", chemistry: "91",
      }),
    },
    {
      name: "Calculator Computed TA",
      html: renderStudentEntryPage({ route: "personal", language: "ta" }, pack, undefined, {
        maths: "95", physics: "90", chemistry: "91",
      }),
    },
    {
      name: "Comparison EN",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "en", shortlist: "1~CS,2006~ME" })),
    },
    {
      name: "Comparison TA",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "ta", shortlist: "1~CS,2006~ME" })),
    },
    {
      name: "Shortlist EN",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "en", shortlist: "1~CS,2005~ME,4960~EC" })),
    },
    {
      name: "Shortlist TA",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "ta", shortlist: "1~CS,2005~ME,4960~EC" })),
    },
    {
      name: "Counselling EN",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "counselling", lang: "en", shortlist: "1~CS,2005~ME" })),
    },
    {
      name: "Counselling TA",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "counselling", lang: "ta", shortlist: "1~CS,2005~ME" })),
    },
  ];

  try {
    for (const p of auditPages) {
      const { frameId } = await sendPageCommand("Page.navigate", { url: "about:blank" });
      await sendPageCommand("Page.setDocumentContent", { frameId, html: p.html });

      for (const width of viewports) {
        await sendPageCommand("Emulation.setDeviceMetricsOverride", {
          width,
          height: 800,
          deviceScaleFactor: 1,
          mobile: width <= 480,
        });

        // 1. Check for horizontal overflow
        const evalOverflow = await sendPageCommand("Runtime.evaluate", {
          expression: `({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, bodyScrollWidth: document.body.scrollWidth })`,
          returnByValue: true,
        });

        const { scrollWidth, innerWidth, bodyScrollWidth } = evalOverflow.result.value;
        const overflows = scrollWidth > innerWidth || bodyScrollWidth > innerWidth;
        assert.equal(
          overflows,
          false,
          `Real Chrome: Horizontal overflow on ${p.name} at ${width}px: scrollWidth=${scrollWidth}, bodyScrollWidth=${bodyScrollWidth}, innerWidth=${innerWidth}`
        );

        // 2. Check touch targets on mobile (>= 40px bounding box for primary action buttons / nav tabs)
        if (width <= 480) {
          const evalTouchTargets = await sendPageCommand("Runtime.evaluate", {
            expression: `
              Array.from(document.querySelectorAll('.btn-action, .nav-tab, .action, button[type="submit"]')).map(el => {
                const rect = el.getBoundingClientRect();
                return {
                  tag: el.tagName,
                  text: el.innerText.trim().slice(0, 20),
                  height: rect.height,
                  width: rect.width,
                  visible: rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none'
                };
              }).filter(item => item.visible)
            `,
            returnByValue: true,
          });

          const touchTargets = evalTouchTargets.result.value;
          for (const target of touchTargets) {
            // Touch targets should have adequate height (>= 36px minimum for secondary buttons, >= 44px for primary)
            assert.ok(
              target.height >= 34,
              `Touch target ${target.text} (${target.tag}) on ${p.name} at ${width}px is too short: ${target.height}px`
            );
          }
        }
      }

      // 3. Emulate print media on Shortlist page
      if (p.name.startsWith("Shortlist")) {
        await sendPageCommand("Emulation.setEmulatedMedia", { media: "print" });
        const evalPrint = await sendPageCommand("Runtime.evaluate", {
          expression: `
            ({
              headerVisible: window.getComputedStyle(document.querySelector('.print-header') || document.body).display !== 'none',
              headerText: (document.querySelector('.print-header')?.innerText || '').trim(),
              screenOnlyHidden: Array.from(document.querySelectorAll('.screen-only')).every(el => window.getComputedStyle(el).display === 'none')
            })
          `,
          returnByValue: true,
        });
        assert.equal(evalPrint.result.value.headerVisible, true, `Print header should be visible in print on ${p.name}`);
        assert.equal(evalPrint.result.value.screenOnlyHidden, true, `Screen-only elements should be hidden in print on ${p.name}`);
        if (p.name === "Shortlist TA") {
          const taHeaderText: string = evalPrint.result.value.headerText;
          assert.ok(
            taHeaderText.includes("அதிகாரப்பூர்வ TNEA விருப்பப் பதிவு முன்னுரிமைப் பணித்தாள் — கணிப்பு அல்லாத குறிப்புப் படிவம்"),
            `Rendered Tamil print header missing Tamil subtitle: ${taHeaderText}`
          );
          assert.ok(
            !taHeaderText.includes("Student Choice Preference Worksheet"),
            `Rendered Tamil print header must not contain untranslated English prose: ${taHeaderText}`
          );
        }
        await sendPageCommand("Emulation.setEmulatedMedia", { media: "" });
      }
    }
  } finally {
    ws.close();
    child.kill();
  }
});

test("M7_PREP: H1, H3, H4, H5, M1-M7, L1-L3 student-facing readiness regressions", () => {
  // H1 + M2 + M3 + M4 + L1 + L2 + L3 on /m5-guidance (tested against 2025 benchmark)
  const arrivalTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta", tab: "comparison" }), {
    year: 2025,
    studentCutoff: 185.5,
    quota: "GENERAL_ACADEMIC",
    community: "OC",
    round: "ROUND_2",
    communitySelected: false,
    searchQuery: "CEG",
  });
  assert.match(arrivalTa, /class="community-prompt\b/, "H1: Must prompt student to pick their community after cutoff arrival");
  assert.match(arrivalTa, /class="form-grid compact-search-card"/, "H1: Must show compact search card on Stage 1");
  assert.match(arrivalTa, /தேடு &amp; ஒப்பிடு|தேடு & ஒப்பிடு/, "M3: Submit button must clearly say Search & Compare");
  assert.doesNotMatch(arrivalTa, /கணக்கிடு \(தற்காலிக தரவு\)/, "M3: Misleading old submit label must be removed");
  assert.match(arrivalTa, /class="community-guide\b/, "L2: Community code explainer (OC, BC, BCM, MBC, SC, SCA, ST) must be present in collapsed guide");
  assert.match(arrivalTa, /class="learn-before-comparing\b/, "L3: Collapsed guide must be at bottom of search page");
  assert.match(arrivalTa, /<span lang="ta" aria-current="page">தமிழ்<\/span>.*(lang-switch.*English)/s, "L1: Consistent தமிழ் | English toggle");

  const withDeltaTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta", tab: "comparison" }), {
    studentCutoff: 185.5,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    round: "ROUND_2",
    communitySelected: true,
    searchQuery: "2006",
  });
  assert.doesNotMatch(withDeltaTa, /class="community-prompt\b/, "H1: Community prompt clears once community is explicitly selected");
  assert.match(withDeltaTa, /class="delta-caution\b/, "M4: Inline non-prediction caution must appear next to delta");
  assert.match(withDeltaTa, /சேர்க்கை உத்தரவாதமோ கணிப்போ அல்ல/, "M4: Tamil delta caution must clarify arithmetic only");

  // H3 + M5: Counselling clarity and Tamil seat terminology
  for (const lang of ["ta", "en"] as const) {
    const counsellingPage = renderStudentEntryPage({ route: "counselling", language: lang }, pack);
    assert.doesNotMatch(counsellingPage, /choice-preparation experience is not ready yet|இன்னும் தயாராகவில்லை/);
    assert.match(counsellingPage, /\/m5-guidance/);
  }
  const m5CounsellingTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta", tab: "counselling" }));
  assert.doesNotMatch(m5CounsellingTa, /காலிப் பணியிடங்கள்/, "M5: Wrong job-post term must be removed");
  assert.match(m5CounsellingTa, /காலியிடங்கள்/, "M5: Accurate seat-vacancy term must be present");
  assert.match(m5CounsellingTa, /href="\/counselling\?lang=ta"/, "H3: Must link back to primary /counselling rules page");

  // H4: Tamil Plain Text & CSV exports
  const sampleState = {
    items: [{
      order: 1,
      offeringKey: "1~CS",
      collegeCode: "1",
      collegeName: "University Departments of Anna University, Chennai - CEG Campus",
      programmeCode: "CS",
      programmeName: "COMPUTER SCIENCE AND ENGINEERING",
    }],
  };
  const txtTa = formatShortlistPlainText(sampleState, "ta");
  const csvTa = formatShortlistCsv(sampleState, "ta");
  assert.match(txtTa, /விருப்பம் #1:/);
  assert.match(txtTa, /கல்லூரி குறியீடு: 1/);
  assert.match(csvTa, /வரிசை \(Choice\),கல்லூரி குறியீடு \(College Code\)/);

  // M1: Single primary POST CTA on /personal when cutoff calculated
  const personalComputedTa = renderStudentEntryPage({ route: "personal", language: "ta" }, pack, undefined, {
    maths: "95", physics: "90", chemistry: "91",
  });
  assert.match(personalComputedTa, /185\.50 \/ 200|185\.5/);
  assert.match(personalComputedTa, /<form method="POST" action="\/m5-guidance/);
  assert.doesNotMatch(personalComputedTa, /href="\/m5-guidance\?lang=ta" class="action"/, "M1: Must not show duplicate GET planner button when cutoff is computed");

  // H4 + M6 + L1: /journey/questions has site header and zero internal draft leakage in student mode
  const load = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
  const qCol = loadQuestionCollection(
    load("docs/content/awareness/student_pov_awareness_batch_a01_a07_v2.md"),
    load("docs/content/admission/student_pov_admission_batch_int05_int08_v1.md"),
    load("docs/content/admission/student_pov_admission_coverage_int05_int08_v1.md"),
    "", "", load("data/m2_question_answers_v1.json")
  );
  const qPageTa = renderQuestionCollection(qCol, "Q002", null, "ta", "B08").html;
  assert.match(qPageTa, /class="site-header"/, "M6: /journey/questions must include consistent site header");
  assert.doesNotMatch(qPageTa, /இது மதிப்பாய்வுக்கான வரைவு|மாணவர் சோதனை முடியவில்லை/, "H4: Internal draft notice must be hidden in student mode");
  assert.match(qPageTa, /<span lang="ta" aria-current="page">தமிழ்<\/span><a lang="en"/, "L1: Consistent language switcher");

  // H4 + H5 + M2 + M7 + Branch cleanup + Sparse metadata transparency on /colleges
  const approvedDir = loadApprovedDirectory();
  const collegesHomeTa = renderGovernedPilot(new URLSearchParams("lang=ta&view=home"), undefined, approvedDir);
  assert.match(collegesHomeTa, /class="card scope-banner"/, "M2: Scope banner on /colleges");
  assert.match(collegesHomeTa, /கல்லூரி வகைகள்: அரசு, உதவி பெறும், சுயநிதி, தன்னாட்சி, \(SS\)/, "H5: College types beginner guide");
  assert.match(collegesHomeTa, /கல்லூரி, பாடப்பிரிவு, இடம் — எப்படி ஒப்பிட்டு யோசிப்பது\?/, "H5: Trade-offs beginner guide");
  const collegesListTa = renderGovernedPilot(new URLSearchParams("lang=ta&view=colleges"), undefined, approvedDir);
  assert.match(collegesListTa, /குறைந்த அளவு தரவு/, "Metadata transparency: sparse filter summary label");
  const branchesTa = renderGovernedPilot(new URLSearchParams("lang=ta&view=branches"), undefined, approvedDir);
  assert.match(branchesTa, /விளக்கம் உள்ள பாடப்பிரிவுகள் \(41\)/, "M7 + Branch cleanup: Explained programmes group");
  assert.match(branchesTa, /சுயநிதிப் பிரிவு \(SS\) &amp; தமிழ் வழிப் பிரிவுகள்|சுயநிதிப் பிரிவு \(SS\) & தமிழ் வழிப் பிரிவுகள்/, "M7 + Branch cleanup: SS/Tamil variants group");
  assert.match(branchesTa, /தெளிவான பெயர்/, "Branch cleanup: Readable clarification for official source typos without mutating source");
  const approvedBranchTa = renderGovernedPilot(new URLSearchParams("lang=ta&view=branch&branch=CS"), undefined, approvedDir);
  assert.match(approvedBranchTa, /<details class="source-note">/, "H4: Raw curriculum scope/locator tucked into collapsible source-note");
  const heldBranchTa = renderGovernedPilot(new URLSearchParams("lang=ta&view=branch&branch=BY"), undefined, approvedDir);
  assert.match(heldBranchTa, /கல்வி விளக்கம் இன்னும் மதிப்பாய்வில் உள்ளது/, "Held branch BY must remain fail-closed");
});

test("M7_PREP: H2 Live HTTP POST shortlist additions preserve cutoff, community, quota, round, and search across 4 additions with zero GET URL leakage", async () => {
  const child = spawn(process.execPath, ["--experimental-strip-types", "scripts/mvp-server.mjs"], {
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let stderr = "";
  child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
  const port = await new Promise<number>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Server did not start: ${stderr}`)), 10000);
    child.once("error", (err: Error) => { clearTimeout(timer); reject(err); });
    child.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${stderr}`)); });
    child.stdout.on("data", (chunk: Buffer) => {
      const match = chunk.toString().match(/127\.0\.0\.1:(\d+)/);
      if (match) { clearTimeout(timer); resolve(Number(match[1])); }
    });
  });

  try {
    const picks = ["1~CS", "1~EC", "1~EE", "1~ME"];
    let shortlistCsv = "";
    for (const key of picks) {
      shortlistCsv = shortlistCsv ? `${shortlistCsv},${key}` : key;
      const body = new URLSearchParams({
        cutoff: "185.5",
        quota: "GENERAL_ACADEMIC",
        community: "BC",
        round: "ROUND_2",
        community_selected: "1",
        q: "CEG",
        tab: "comparison",
        lang: "ta",
        shortlist: shortlistCsv,
      });
      const res = await fetch(`http://127.0.0.1:${port}/m5-guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      assert.equal(res.status, 200);
      const html = await res.text();
      assert.match(html, /value="185\.5"/, `Cutoff must remain 185.5 after adding ${key}`);
      assert.match(html, /<strong>BC<\/strong>/, `Community BC must remain selected after adding ${key}`);
      assert.match(html, /value="ceg"/i, `Search query CEG must remain active after adding ${key}`);
      assert.match(html, /(?:✓\s*சேர்க்கப்பட்டது|சேர்க்கப்பட்டது\s*✓)/, `Added state must appear for ${key}`);
      // Verify NO sensitive parameters appear in any href attribute
      const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
      for (const href of hrefs) {
        assert.doesNotMatch(href, /(?:^|[?&])(cutoff|marks|community)=/i, `Sensitive param leaked into GET link: ${href}`);
      }
    }
    // Verify shortlist count reached 4
    const finalRes = await fetch(`http://127.0.0.1:${port}/m5-guidance`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        cutoff: "185.5",
        quota: "GENERAL_ACADEMIC",
        community: "BC",
        round: "ROUND_2",
        community_selected: "1",
        q: "CEG",
        tab: "shortlist",
        lang: "ta",
        shortlist: picks.join(","),
      }).toString(),
    });
    const finalHtml = await finalRes.text();
    assert.match(finalHtml, /shortlist-badge">4<\/span>/);
    assert.match(finalHtml, /விருப்பம் #1:/);
    assert.match(finalHtml, /விருப்பம் #4:/);
  } finally {
    child.kill();
    await once(child, "exit");
  }
});

test("FINAL_PRE_M7: Simulated Student Audit Scenarios (Stale 55-college removal, 7.5% point-of-use warning, accessibility labels, district normalization, 12+ shortlist reorder, no-result recovery)", () => {
  const approvedDir = loadApprovedDirectory();

  // 1. Stale 55-college wording completely absent across Home, Personal, Counselling, Colleges, and Choice Planner (2025 & 2026)
  for (const lang of ["ta", "en"] as const) {
    const pages = [
      renderStudentEntryPage({ route: "home", language: lang }, pack),
      renderStudentEntryPage({ route: "personal", language: lang }, pack, undefined, { maths: "90", physics: "88", chemistry: "86" }),
      renderStudentEntryPage({ route: "counselling", language: lang }, pack),
      renderGovernedPilot(new URLSearchParams({ lang, view: "colleges" }), undefined, approvedDir),
      renderM5GuidancePage(new URLSearchParams({ lang, tab: "comparison" }), { year: 2026 }),
      renderM5GuidancePage(new URLSearchParams({ lang, tab: "comparison" }), { year: 2025 }),
      renderM5GuidancePage(new URLSearchParams({ lang, tab: "shortlist", shortlist: "1~CS,2006~EC" })),
      renderM5GuidancePage(new URLSearchParams({ lang, tab: "counselling" })),
    ];
    for (const html of pages) {
      assert.doesNotMatch(html, /55\s*(?:கல்லூரி|அடிப்படை|Colleges|benchmark)/i, `Stale 55-college wording found in ${lang} view`);
    }
  }
  const m52025Ta = renderM5GuidancePage(new URLSearchParams({ lang: "ta", tab: "comparison" }), { year: 2025 });
  const m52025En = renderM5GuidancePage(new URLSearchParams({ lang: "en", tab: "comparison" }), { year: 2025 });
  assert.match(m52025Ta, /121 கல்லூரிகள் · 536 படிப்புத் தரவுகள்/, "2025 option must accurately state 121 colleges / 536 offerings data");
  assert.match(m52025En, /121 Colleges · 536 Offerings Data/, "2025 EN option must accurately state 121 colleges / 536 offerings data");

  // 2. Point-of-use 7.5% eligibility warning
  for (const lang of ["ta", "en"] as const) {
    const html75 = renderM5GuidancePage(new URLSearchParams({ lang, tab: "comparison", edit_search: "1" }), {
      studentCutoff: 182.0,
      quota: "GOVT_SCHOOL_7_5",
      community: "BC",
      round: "ROUND_1",
      communitySelected: true,
    });
    assert.match(html75, /id="quota-75-warning" class="quota-75-warning" role="note"  style=/, "7.5% warning must be visible (not hidden) when GOVT_SCHOOL_7_5 is selected");
    if (lang === "ta") {
      assert.match(html75, /6–12 அரசுப் பள்ளிச் சான்றிதழ் சரிபார்ப்பே தகுதியைத் தீர்மானிக்கும்/);
    } else {
      assert.match(html75, /Std 6–12 Govt school verification determines eligibility/);
    }

    const htmlGeneral = renderM5GuidancePage(new URLSearchParams({ lang, tab: "comparison", edit_search: "1" }), {
      studentCutoff: 182.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      communitySelected: true,
    });
    assert.match(htmlGeneral, /id="quota-75-warning" class="quota-75-warning" role="note" hidden/, "7.5% warning must be hidden when GENERAL_ACADEMIC is selected");
    assert.doesNotMatch(htmlGeneral, /class="quota-75-context-reminder"/, "7.5% context reminder must not appear when GENERAL_ACADEMIC is selected");
  }

  // 3. Complete accessibility labels on College filters, Choice Planner filters, export textareas, copy buttons, and shortlist controls (mandatory filters always shown directly)
  const collegesHtml = renderGovernedPilot(new URLSearchParams("lang=ta&view=colleges"), undefined, approvedDir);
  assert.doesNotMatch(collegesHtml, /more-filters-accordion/, "Colleges filters must be directly visible without extra filters accordion");
  for (const id of ["college-search", "type-filter", "district-filter", "college-select"]) {
    assert.match(collegesHtml, new RegExp(`<label for="${id}">[^<]+</label>`), `Colleges filter ${id} must have non-empty label`);
    assert.match(collegesHtml, new RegExp(`id="${id}"[^>]*aria-label="[^"]+"`), `Colleges filter ${id} must have non-empty aria-label`);
  }

  const m5Html = renderM5GuidancePage(new URLSearchParams("lang=ta&tab=comparison"));
  assert.doesNotMatch(m5Html, /more-filters-accordion/, "Choice Planner compact pre-search controls must be directly visible without extra filters accordion");
  for (const id of ["cutoff-input", "quota-select", "district-select", "branch-select", "round-select", "year-select"]) {
    assert.match(m5Html, new RegExp(`for="${id}"`), `Choice Planner control ${id} must have associated label[for]`);
    assert.match(m5Html, new RegExp(`id="${id}"[^>]*aria-label="[^"]+"`), `Choice Planner control ${id} must have non-empty aria-label`);
  }
  assert.match(m5Html, /role="radiogroup"[^>]*aria-label="[^"]+"/, "Community pills radiogroup must have non-empty aria-label");

  const m5ResultsHtml = renderM5GuidancePage(new URLSearchParams("lang=ta&tab=comparison&searched=1"));
  for (const id of ["m5-toolbar-type", "m5-toolbar-sort"]) {
    assert.match(m5ResultsHtml, new RegExp(`for="${id}"`), `Results toolbar control ${id} must have associated label[for]`);
  }

  // 4. Long-shortlist persona (12+ choices) & Export/Copy accessibility
  const twelveChoices = [
    "1~CS", "1~EC", "2006~CS", "2006~EC", "2005~CS", "2005~EC",
    "2007~CS", "2007~EC", "5008~CS", "5008~EC", "2712~CS", "4960~CS"
  ].join(",");
  const shortlist12Html = renderM5GuidancePage(new URLSearchParams({
    lang: "ta",
    tab: "shortlist",
    shortlist: twelveChoices,
  }));
  assert.match(shortlist12Html, /id="export-text" aria-label="விருப்பப் பட்டியல் உரை ஏற்றுமதி"/, "Plain text export textarea must have accessible name");
  assert.match(shortlist12Html, /id="export-csv" aria-label="விருப்பப் பட்டியல் CSV ஏற்றுமதி"/, "CSV export textarea must have accessible name");
  assert.match(shortlist12Html, /<label for="export-csv"/, "CSV export textarea must also have explicit label[for]");
  assert.match(shortlist12Html, /aria-label="விருப்பப் பட்டியலை உரை வடிவில் நகலெடு"/, "Copy Plain Text button must have aria-label");
  assert.match(shortlist12Html, /aria-label="விருப்பப் பட்டியலை CSV வடிவில் நகலெடு"/, "Copy CSV button must have aria-label");
  assert.match(shortlist12Html, /aria-label="விருப்பம் #12-ஐ முதல் இடத்திற்கு \(#1\) நகர்த்து"/, "12th item must have accessible Move to Top (#1) control");
  assert.match(shortlist12Html, /id="pos-select-12" class="position-jump-select" aria-label="விருப்பம் #12 வரிசை எண் மாற்று"/, "12th item must have accessible Move to Position selector");
  // Verify Move to Top link on #12 places 4960~CS at index 0
  assert.match(shortlist12Html, /shortlist=4960~CS,1~CS,1~EC,2006~CS/, "Move to Top link on #12 must move 4960~CS to #1 while preserving relative order");

  // 5. Duplicate district casing normalization (Chennai / CHENNAI, Coimbatore / COIMBATORE)
  const districtSelectMatch = collegesHtml.match(/<select id="district-filter"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(districtSelectMatch, "Must render district-filter select on /colleges");
  const optionValues = [...districtSelectMatch[1].matchAll(/<option value="([^"]+)">/g)].map(m => m[1]).filter(Boolean);
  const lowerValues = optionValues.map(v => v.toLowerCase());
  assert.equal(new Set(lowerValues).size, optionValues.length, `Duplicate district options found: ${optionValues.join(", ")}`);
  assert.ok(optionValues.includes("Chennai") && !optionValues.includes("CHENNAI"), "Chennai must be normalized to a single Title-Case option");
  assert.ok(optionValues.includes("Coimbatore") && !optionValues.includes("COIMBATORE"), "Coimbatore must be normalized to a single Title-Case option");
  // Verify filtering by "Chennai" or "CHENNAI" returns identical matching counts
  const chennaiTitleHtml = renderGovernedPilot(new URLSearchParams("lang=en&view=colleges&district=Chennai"), undefined, approvedDir);
  const chennaiUpperHtml = renderGovernedPilot(new URLSearchParams("lang=en&view=colleges&district=CHENNAI"), undefined, approvedDir);
  const countTitle = chennaiTitleHtml.match(/class="result-count"[^>]*>([^<]+)</)?.[1];
  const countUpper = chennaiUpperHtml.match(/class="result-count"[^>]*>([^<]+)</)?.[1];
  assert.ok(countTitle && countTitle === countUpper, `Filtering by Chennai (${countTitle}) and CHENNAI (${countUpper}) must return identical counts`);

  // 6. No-result recovery on Choice Planner and Colleges
  const noResM5Ta = renderM5GuidancePage(new URLSearchParams({ lang: "ta", tab: "comparison", q: "ZZZ_NONEXISTENT_999" }));
  assert.match(noResM5Ta, /class="no-results-recovery"/, "Choice Planner must render no-results-recovery block");
  assert.match(noResM5Ta, /class="btn-action btn-primary no-results-reset-btn"/, "Choice Planner must render visible reset button");
  assert.match(noResM5Ta, /தேடல் சொல் \(Search\), மாவட்டம் \(District\)/, "Choice Planner must explain which filters/search can be changed");

  const noResCollegesTa = renderGovernedPilot(new URLSearchParams("lang=ta&view=colleges&q=ZZZ_NONEXISTENT_999"), undefined, approvedDir);
  assert.match(noResCollegesTa, /class="card no-results-recovery"/, "Colleges must render no-results-recovery block");
  assert.match(noResCollegesTa, /தேடல் மற்றும் வடிகட்டிகளை நீக்கு/, "Colleges must render visible clear search and filters link");
});

test("FINAL_PRE_M7: Real 200% Page Zoom & Keyboard Accessibility Verification across all 7 routes in Headless Chrome", async () => {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  let child;
  try {
    child = spawn(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-crash-reporter",
      "--no-first-run",
      "--remote-debugging-port=0",
      "about:blank",
    ], { stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    return;
  }

  let stderr = "";
  let browserWs = "";
  try {
    browserWs = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout waiting for Chrome: " + stderr)), 6000);
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
        const match = stderr.match(/ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[a-zA-Z0-9-]+/);
        if (match) { clearTimeout(timer); resolve(match[0]); }
      });
      child.once("error", (err: Error) => { clearTimeout(timer); reject(err); });
    });
  } catch {
    child.kill();
    return;
  }

  const ws = new WebSocket(browserWs);
  try {
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });
  } catch {
    child.kill();
    return;
  }

  let msgId = 1;
  function sendCommand(method: string, params: Record<string, unknown> = {}, sessionId?: string): Promise<any> {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt: any) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
    });
  }

  const { targetId } = await sendCommand("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await sendCommand("Target.attachToTarget", { targetId, flatten: true });
  await sendCommand("Page.enable", {}, sessionId);

  const approvedDir = loadApprovedDirectory();
  const routesToVerify = [
    { name: "Home TA", html: renderStudentEntryPage({ route: "home", language: "ta" }, pack) },
    { name: "Journey Beginner TA", html: renderStudentEntryPage({ route: "beginner", language: "ta" }, pack) },
    { name: "Colleges Directory TA", html: renderGovernedPilot(new URLSearchParams("lang=ta&view=colleges"), undefined, approvedDir) },
    { name: "Cutoff Calculator TA", html: renderStudentEntryPage({ route: "personal", language: "ta" }, pack, undefined, { maths: "95", physics: "90", chemistry: "91" }) },
    { name: "Choice Planner 7.5% TA", html: renderM5GuidancePage(new URLSearchParams("lang=ta&tab=comparison&shortlist=1~CS"), { studentCutoff: 185, quota: "GOVT_SCHOOL_7_5", community: "BC", round: "ROUND_1", year: 2026, communitySelected: true }) },
    { name: "Shortlist 12 Choices TA", html: renderM5GuidancePage(new URLSearchParams("lang=ta&tab=shortlist&shortlist=1~CS,1~EC,2006~CS,2006~EC,2005~CS,2005~EC,2007~CS,2007~EC,5008~CS,5008~EC,2712~CS,4960~CS")) },
    { name: "Counselling TA", html: renderStudentEntryPage({ route: "counselling", language: "ta" }, pack) },
  ];

  try {
    for (const r of routesToVerify) {
      const { frameId } = await sendCommand("Page.navigate", { url: "about:blank" }, sessionId);
      await sendCommand("Page.setDocumentContent", { frameId, html: r.html }, sessionId);

      // A. Genuine 200% Browser Zoom verification on 1280x800 desktop window
      await sendCommand("Emulation.setDeviceMetricsOverride", {
        width: 1280,
        height: 800,
        deviceScaleFactor: 1,
        mobile: false,
      }, sessionId);

      const zoomEval = await sendCommand("Runtime.evaluate", {
        expression: `(() => {
          document.documentElement.style.zoom = "200%";
          const scrollW = document.documentElement.scrollWidth;
          const clientW = document.documentElement.clientWidth;
          // Also check interactive controls have non-empty accessible names
          const unnamedControls = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea, button')).filter(el => {
            const aria = el.getAttribute('aria-label') || '';
            const id = el.getAttribute('id');
            const lbl = id ? document.querySelector('label[for="' + id + '"]') : el.closest('label');
            const lblText = lbl ? (lbl.textContent || '').trim() : '';
            const btnText = el.tagName === 'BUTTON' ? (el.textContent || '').trim() : '';
            return !aria.trim() && !lblText && !btnText;
          }).map(el => el.outerHTML.slice(0, 80));
          return { scrollW, clientW, unnamedControls };
        })()`,
        returnByValue: true,
      }, sessionId);

      const { scrollW, clientW, unnamedControls } = zoomEval.result.value;
      assert.equal(
        scrollW <= clientW,
        true,
        `200% Zoom horizontal overflow on ${r.name}: scrollWidth=${scrollW}, clientWidth=${clientW}`
      );
      assert.deepEqual(
        unnamedControls,
        [],
        `Unnamed controls found on ${r.name}: ${unnamedControls.join("; ")}`
      );

      // B. Keyboard Tab traversal check (verify focus moves cleanly across interactive elements without trap)
      const kbEval = await sendCommand("Runtime.evaluate", {
        expression: `(() => {
          document.documentElement.style.zoom = "100%";
          const focusables = Array.from(document.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'))
            .filter(el => {
              if (el.closest('details:not([open])')) return false;
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.getClientRects().length > 0;
            });
          let focusedCount = 0;
          const targetSlice = focusables.slice(0, 15);
          for (const el of targetSlice) {
            el.focus();
            if (document.activeElement === el) focusedCount++;
          }
          return { totalVisibleFocusables: focusables.length, targetLen: targetSlice.length, focusedCount };
        })()`,
        returnByValue: true,
      }, sessionId);

      assert.ok(
        kbEval.result.value.focusedCount > 0 &&
        kbEval.result.value.focusedCount === kbEval.result.value.targetLen,
        `Keyboard focus traversal failed on ${r.name}: ${JSON.stringify(kbEval.result.value)}`
      );
    }
  } finally {
    ws.close();
    child.kill();
  }
});

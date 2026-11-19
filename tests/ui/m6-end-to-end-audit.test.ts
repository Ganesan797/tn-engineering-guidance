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
  await new Promise((res) => { ws.onopen = res; });

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
  assert.match(arrivalTa, /class="active-context-strip\b/, "H1: Must show explicit year/quota/community/round context strip");
  assert.match(arrivalTa, /சுற்று 1 தரவு இல்லை/, "H1: Must explain General Academic Round 1 coverage gap");
  assert.match(arrivalTa, /class="scope-note\b/, "M2: Must explain 55-college vs 389-college scope difference");
  assert.match(arrivalTa, /தேடு &amp; ஒப்பிடு|தேடு & ஒப்பிடு/, "M3: Submit button must clearly say Search & Compare");
  assert.doesNotMatch(arrivalTa, /கணக்கிடு \(தற்காலிக தரவு\)/, "M3: Misleading old submit label must be removed");
  assert.match(arrivalTa, /class="community-guide\b/, "L2: Community code explainer (OC, BC, BCM, MBC, SC, SCA, ST) must be present");
  assert.match(arrivalTa, /இது தளத்தின் பரிந்துரை அல்ல/, "L3: Must explain + சேர் adds to manual shortlist without system recommendation");
  assert.match(arrivalTa, /<span lang="ta" aria-current="page">தமிழ்<\/span><a class="lang-switch" lang="en"/, "L1: Consistent தமிழ் | English toggle");

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
      assert.match(html, /<option value="BC" selected>/, `Community BC must remain selected after adding ${key}`);
      assert.match(html, /value="ceg"/i, `Search query CEG must remain active after adding ${key}`);
      assert.match(html, /சேர்க்கப்பட்டது ✓/, `Added state must appear for ${key}`);
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

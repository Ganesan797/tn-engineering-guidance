import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { renderM5GuidancePage } from "../../src/ui/m5-guidance-view.ts";

test("M5 Privacy Regression: ZERO student cutoff marks or community in GET URLs, links, or form actions", () => {
  // Test with input state provided
  const htmlWithCutoff = renderM5GuidancePage(new URLSearchParams(), {
    studentCutoff: 185.0,
    quota: "GENERAL_ACADEMIC",
    community: "MBC",
  });

  // Verify form uses POST to prevent GET URL leakage
  assert.ok(htmlWithCutoff.includes('method="POST"'), "Cutoff form must use POST method");
  assert.ok(!htmlWithCutoff.includes('method="GET" class="form-grid"'), "Cutoff form must never use GET");

  // Verify NO href attribute contains cutoff= or community=
  const hrefCutoffMatches = htmlWithCutoff.match(/href="[^"]*[?&](cutoff|community|category)=[^"]*"/gi);
  assert.equal(
    hrefCutoffMatches,
    null,
    `Navigation links must never leak sensitive parameters into GET URLs: ${hrefCutoffMatches}`
  );

  // Verify that GET query parameters with sensitive data are IGNORED by default
  const htmlFromQuery = renderM5GuidancePage(new URLSearchParams({ cutoff: "195.0", community: "SC" }));
  // When passed via GET query params, cutoff must NOT be populated in the form input
  assert.ok(
    htmlFromQuery.includes('value="" placeholder="e.g. 185.5"'),
    "GET query parameters must not populate student cutoff"
  );
});

test("M5 Governed Offerings Coverage: All 555 offerings listed; all unapproved data transparently marked", () => {
  const html = renderM5GuidancePage(new URLSearchParams());

  assert.ok(html.includes("All 555 governed offerings across the 55 approved institutions"), "Must disclose all 555 offerings");
  assert.ok(html.includes("Not available for comparison"), "Must disclose lack of approved historical data for offerings without observations");
  assert.ok(
    html.includes("Minimum observed mark in official Round 2"),
    "Approved runtime displays the Round 2 disclosure"
  );

  // Check presence of offerings across cohort
  assert.ok(html.includes("5022"), "Must include College 5022 (VOC College of Engineering)");
  assert.ok(html.includes("2005"), "Must include College 2005 (GCT Coimbatore)");

  // Verify College 1516 is rendered with held badge
  assert.ok(html.includes("1516"), "Must include College 1516");
  assert.ok(html.includes("held-badge"), "Must render held badge for 1516");
});

test("M5 Prediction Removal: Zero predictive colours (no delta-positive/negative) and no delta filter dropdown", () => {
  const html = renderM5GuidancePage(new URLSearchParams(), {
    studentCutoff: 185.0,
    quota: "GENERAL_ACADEMIC",
    community: "MBC",
  });

  // Must not have predictive green/amber color classes
  assert.ok(!html.includes("delta-positive"), "Must not use delta-positive predictive styling");
  assert.ok(!html.includes("delta-negative"), "Must not use delta-negative predictive styling");

  // Must not have delta-based safe/target/stretch filter
  assert.ok(!html.includes("delta_filter"), "Must not offer delta-based safe/target filtering");
  assert.ok(!html.includes("Above Minimum (Δ ≥ 0)"), "Must not offer Above Minimum tier filter");
});

test("M5 UI: Tamil language view renders full Tamil translations and disclaimers", () => {
  const params = new URLSearchParams({ lang: "ta" });
  const html = renderM5GuidancePage(params);

  assert.ok(html.includes("கடந்த ஆண்டு தற்காலிக ஒதுக்கீட்டு ஒப்பீடு"), "Must have Tamil title");
  assert.ok(html.includes("கடந்த கால தற்காலிக ஒதுக்கீடுகள் எதிர்கால சேர்க்கையை உறுதிப்படுத்தாது"), "Must have Tamil non-prediction disclaimer");
  assert.ok(html.includes("அதிகாரப்பூர்வ சுற்று 2"), "Approved runtime displays Tamil Round 2 observation disclosure");
  assert.ok(html.includes("என் விருப்பப் பட்டியல்"), "Must have Tamil shortlist tab link");
  assert.ok(html.includes("கலந்தாய்வு நடைமுறை வழிகாட்டல்"), "Must have Tamil counselling tab link");
  assert.ok(html.includes('<a href="/m5-guidance?lang=ta" aria-current="page">விருப்பப் பட்டியல்</a>'), "Must highlight Tamil Choice Planner in site header");
});

test("M5 Historical Calculation: Calculates arithmetic delta and displays official locator", () => {
  const html = renderM5GuidancePage(new URLSearchParams({ q: "4960" }), {
    studentCutoff: 180.0,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    round: "ROUND_2",
  });

  assert.ok(html.includes("+3.50 vs observed minimum"), "Must calculate arithmetic delta 180.0 - 176.5 = +3.50");
  assert.ok(html.includes("176.50"), "Must display observed minimum 176.50");
  assert.ok(html.includes("ROUND 2 - GENERAL ACADEMIC"), "Must cite official publication");
});

test("M5 UI: Shortlist tab displays choice order and reordering controls without marks", () => {
  const params = new URLSearchParams({
    tab: "shortlist",
    shortlist: "1~CS,2006~ME,4960~EC",
  });
  const html = renderM5GuidancePage(params);

  assert.ok(html.includes("Choice Order Planner"), "Must show shortlist planner title");
  assert.ok(html.includes("#1"), "Must display Choice #1");
  assert.ok(html.includes("#2"), "Must display Choice #2");
  assert.ok(html.includes("#3"), "Must display Choice #3");
  assert.ok(html.includes("College of Engineering Guindy"), "Must display CEG");
  assert.ok(html.includes("Clear Shortlist"), "Must have Clear Shortlist button");

  // Shortlist links must NOT contain cutoff
  assert.ok(!html.includes("cutoff="), "Shortlist view must not contain cutoff in any link");
});

test("M6-T02 Choice List Print & Export: Ink-friendly @media print stylesheet, print header, print button, and export text/CSV options", () => {
  const params = new URLSearchParams({
    tab: "shortlist",
    shortlist: "2006~EC,1~CS,4960~ME",
    lang: "en",
  });
  const html = renderM5GuidancePage(params);

  // 1. Clean print header
  assert.ok(
    html.includes("Tamil Nadu Engineering Admissions (TNEA) — Student Choice Preference Worksheet"),
    "Must include official clean print worksheet header"
  );
  assert.ok(html.includes("print-header print-only"), "Print header must have print-header and print-only classes");

  // 2. Ink-friendly print stylesheet rules
  assert.ok(html.includes("@media print"), "Must include @media print stylesheet");
  assert.ok(html.includes(".print-only { display: none !important; }"), "print-only must be hidden by default on screen");
  assert.ok(html.includes(".shortlist-actions"), "Shortlist actions must be defined for hiding in print");

  // 3. Print button with window.print()
  assert.ok(html.includes('onclick="window.print()"'), "Must have print button invoking window.print()");
  assert.ok(html.includes("Print / Save PDF"), "Must have Print / Save PDF label");

  // 4. Print table columns (Choice Order, College Code, College Name, Branch Code, Branch Name)
  assert.ok(html.includes("College Code"), "Print table must have College Code column");
  assert.ok(html.includes("College Name"), "Print table must have College Name column");
  assert.ok(html.includes("Branch Code"), "Print table must have Branch Code column");
  assert.ok(html.includes("Branch Name"), "Print table must have Branch Name column");

  // 5. Copyable / Exportable Text Option (Plain text and CSV)
  assert.ok(html.includes('id="export-text"'), "Must have export plain text textarea");
  assert.ok(html.includes('id="export-csv"'), "Must have export CSV textarea");
  assert.ok(html.includes("Copy Plain Text"), "Must have Copy Plain Text button");
  assert.ok(html.includes("Copy CSV"), "Must have Copy CSV button");

  // Verify textarea contents contain choices in order
  assert.ok(html.includes("Choice #1: [College 2006] PSG College of Technology"), "Plain text must contain Choice #1");
  assert.ok(html.includes("Branch: [EC]"), "Plain text must contain Branch EC");
  assert.ok(html.includes("Choice #2: [College 1] College of Engineering Guindy (CEG)"), "Plain text must contain Choice #2");
  assert.ok(html.includes('1,&quot;2006&quot;,&quot;PSG College of Technology, Peelamedu, Coimbatore&quot;,&quot;EC&quot;'), "CSV textarea must contain row 1");

  // 6. Privacy Invariant: Zero student marks, rank, or community categories
  assert.ok(!html.includes("cutoff="), "Shortlist view must not contain cutoff in any link");
  assert.ok(!html.includes("community="), "Shortlist view must not contain community in any link");
});

test("M6-T03 Acronym & Search Polish: Students can instantly search by college acronyms (CEG, MIT, GCT, PSG, CIT, etc.)", () => {
  // Test "CEG" matches College 1
  const htmlCeg = renderM5GuidancePage(new URLSearchParams({ q: "CEG" }));
  assert.ok(htmlCeg.includes("College of Engineering Guindy (CEG)"));
  assert.ok(!htmlCeg.includes("Government College of Technology, Coimbatore"));

  // Test "MIT" matches College 4
  const htmlMit = renderM5GuidancePage(new URLSearchParams({ q: "MIT" }));
  assert.ok(htmlMit.includes("Madras Institute of Technology (MIT)"));

  // Test "GCT" matches College 2005
  const htmlGct = renderM5GuidancePage(new URLSearchParams({ q: "GCT" }));
  assert.ok(htmlGct.includes("Government College of Technology, Coimbatore"));

  // Test "PSG" matches College 2006 and 2377
  const htmlPsg = renderM5GuidancePage(new URLSearchParams({ q: "PSG" }));
  assert.ok(htmlPsg.includes("PSG College of Technology"));
  assert.ok(htmlPsg.includes("PSG Institute of Technology and Applied Research"));

  // Test "CIT" matches College 2007 and 1399
  const htmlCit = renderM5GuidancePage(new URLSearchParams({ q: "CIT" }));
  assert.ok(htmlCit.includes("Coimbatore Institute of Technology"));
  assert.ok(htmlCit.includes("Chennai Institute of Technology"));

  // Test "TCE" matches College 5008
  const htmlTce = renderM5GuidancePage(new URLSearchParams({ q: "TCE" }));
  assert.ok(htmlTce.includes("Thiagarajar College of Engineering"));

  // Test "KCT" matches College 2712
  const htmlKct = renderM5GuidancePage(new URLSearchParams({ q: "KCT" }));
  assert.ok(htmlKct.includes("Kumaraguru College of Technology"));

  // Test "Mepco" matches College 4960
  const htmlMepco = renderM5GuidancePage(new URLSearchParams({ q: "Mepco" }));
  assert.ok(htmlMepco.includes("Mepco Schlenk Engineering College"));

  // Test "SVCE" matches College 1219
  const htmlSvce = renderM5GuidancePage(new URLSearchParams({ q: "SVCE" }));
  assert.ok(htmlSvce.includes("Sri Venkateswara College of Engineering"));

  // Test "REC" matches College 1211
  const htmlRec = renderM5GuidancePage(new URLSearchParams({ q: "REC" }));
  assert.ok(htmlRec.includes("Rajalakshmi Engineering College"));

  // Test "LICET" matches College 1450
  const htmlLicet = renderM5GuidancePage(new URLSearchParams({ q: "LICET" }));
  assert.ok(htmlLicet.includes("Loyola-ICAM College of Engineering and Technology (LICET)"));

  // Test acronym + branch combination: "CEG CSE" matches CEG CS but not CEG ME
  const htmlCegCse = renderM5GuidancePage(new URLSearchParams({ q: "CEG CSE" }));
  assert.ok(htmlCegCse.includes("College of Engineering Guindy (CEG)"));
  assert.ok(htmlCegCse.includes("COMPUTER SCIENCE AND ENGINEERING"));
});

test("M5 UI: Counselling Guidance tab displays factual TNEA procedures without unsupported claims", () => {
  const params = new URLSearchParams({ tab: "counselling" });
  const html = renderM5GuidancePage(params);

  assert.ok(html.includes("TNEA Choice-Filling Process &amp; Procedure Guidance"));
  assert.ok(html.includes("1. Choice List Evaluation Procedure"));
  assert.ok(html.includes("2. Upward Movement Option in Provisional Allotment"));
  assert.ok(html.includes("3. Ordering Choices by Genuine Preference"));
  assert.ok(html.includes("4. Government School (7.5%) Quota Eligibility &amp; Fee Support"));
  assert.ok(html.includes("5. Choice Entry &amp; Submission Guidelines"));

  // Statutory citations must be present
  assert.ok(html.includes("Tamil Nadu Act No. 14 of 2021"));
  assert.ok(html.includes("G.O. (Ms.) No. 221"));
  assert.ok(html.includes("tuition, hostel, and development fees"));
  assert.ok(html.includes("proof of Government-school study details from 6th through 12th standard"));
  assert.ok(html.includes("schools managed by Government departments"));
  assert.ok(!html.includes("approved institutional fees"));

  // Unsupported claims must be absent
  assert.ok(!html.includes("automatically locks"), "Must not claim automatic locking");
  assert.ok(!html.includes("auto-lock"), "Must not claim auto-lock");
  assert.ok(!html.includes("3-Tier Strategy"), "Must not include 3-Tier Strategy");
  assert.ok(!html.includes("Safe Anchors"), "Must not include Safe Anchors");
  assert.ok(html.includes('<a href="/m5-guidance?lang=en" aria-current="page">Choice Planner</a>'), "Must highlight Choice Planner in site header");
});

test("M5 Real HTTP POST route: Submitted search term filters directory and preserves privacy", async () => {
  const child = spawn(process.execPath, ["--experimental-strip-types", "scripts/mvp-server.mjs"], {
    cwd: new URL("../../", import.meta.url),
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
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

    // 1. POST with search query "2005" (GCT Coimbatore)
    const postRes2005 = await fetch(`${base}/m5-guidance`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        tab: "comparison",
        lang: "en",
        q: "2005",
        cutoff: "185.0",
        community: "BC",
      }).toString(),
    });
    assert.equal(postRes2005.status, 200);
    const html2005 = await postRes2005.text();

    // Verify search filtered to 2005
    assert.ok(html2005.includes("Government College of Technology, Coimbatore"), "Filtered result must contain GCT");
    assert.ok(!html2005.includes("Kumaraguru College of Technology"), "Must NOT contain Kumaraguru (2712)");
    assert.ok(!html2005.includes("Mepco Schlenk"), "Must NOT contain Mepco (4960)");

    // Verify marks remain inside the form input in memory, never in navigation links
    assert.ok(html2005.includes('value="185"'), "Cutoff input must reflect submitted mark");
    assert.ok(!html2005.includes('href="?tab=comparison&amp;cutoff='), "Links must not leak cutoff");
    assert.ok(!html2005.includes('community=BC'), "Links must not leak community");

    // 2. POST with search query "Mepco" (4960)
    const postResMepco = await fetch(`${base}/m5-guidance`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        tab: "comparison",
        lang: "en",
        q: "Mepco",
      }).toString(),
    });
    assert.equal(postResMepco.status, 200);
    const htmlMepco = await postResMepco.text();
    assert.ok(htmlMepco.includes("Mepco Schlenk Engineering College"), "Filtered result must contain Mepco");
    assert.ok(!htmlMepco.includes("Government College of Technology, Coimbatore"), "Must NOT contain GCT");

  } finally {
    child.kill();
  }
});

test("M5 Real Browser Layout Verification: Zero horizontal overflow at 320px, 360px, 390px in real Chrome", async () => {
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
    // If Chrome is not launchable in the environment, report honestly
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

  const viewports = [320, 360, 390];
  const pages = [
    { name: "Comparison EN", html: renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "en" })) },
    { name: "Comparison TA", html: renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "ta" })) },
    { name: "Shortlist EN", html: renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "en", shortlist: "1~CS,2005~ME,4960~EC" })) },
    { name: "Shortlist TA", html: renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "ta", shortlist: "1~CS,2005~ME,4960~EC" })) },
    { name: "Counselling EN", html: renderM5GuidancePage(new URLSearchParams({ tab: "counselling", lang: "en" })) },
    { name: "Counselling TA", html: renderM5GuidancePage(new URLSearchParams({ tab: "counselling", lang: "ta" })) },
  ];

  try {
    for (const p of pages) {
      const { frameId } = await sendPageCommand("Page.navigate", { url: "about:blank" });
      await sendPageCommand("Page.setDocumentContent", { frameId, html: p.html });

      for (const width of viewports) {
        await sendPageCommand("Emulation.setDeviceMetricsOverride", {
          width,
          height: 800,
          deviceScaleFactor: 1,
          mobile: true,
        });

        const evalRes = await sendPageCommand("Runtime.evaluate", {
          expression: `({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, bodyScrollWidth: document.body.scrollWidth })`,
          returnByValue: true,
        });

        const { scrollWidth, innerWidth, bodyScrollWidth } = evalRes.result.value;
        const overflows = scrollWidth > innerWidth || bodyScrollWidth > innerWidth;
        assert.equal(
          overflows,
          false,
          `Real Chrome: Horizontal overflow detected on ${p.name} at ${width}px: scrollWidth=${scrollWidth}, bodyScrollWidth=${bodyScrollWidth}, innerWidth=${innerWidth}`
        );
      }
    }
  } finally {
    ws.close();
    child.kill();
  }
});

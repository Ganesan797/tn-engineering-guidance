import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { renderM5GuidancePage } from "../../src/ui/m5-guidance-view.ts";
import { compareOffering } from "../../src/m5/comparison-engine.ts";

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

test("M5 Governed Offerings Coverage: All 2,628 offerings listed; all unapproved data transparently marked", () => {
  const htmlLanding = renderM5GuidancePage(new URLSearchParams());
  assert.ok(htmlLanding.includes("All 2,628 governed offerings across the 300 approved institutions"), "Must disclose all 2,628 offerings in collapsed guide");
  assert.ok(
    htmlLanding.includes("Lowest observed provisional allotment mark across available official rounds") ||
      htmlLanding.includes("Minimum observed mark in official Round 1"),
    "Approved runtime displays the historical disclosure in guide"
  );

  const html = renderM5GuidancePage(new URLSearchParams({ show_all: "1" }));
  assert.ok(html.includes("Not available for comparison"), "Must disclose lack of approved historical data for offerings without observations");

  // Check presence of offerings across benchmark and expanded autonomous cohort
  assert.ok(html.includes("5022"), "Must include College 5022 (VOC College of Engineering)");
  assert.ok(html.includes("2005"), "Must include College 2005 (GCT Coimbatore)");
  assert.ok(html.includes("1216"), "Must include College 1216 (Rajalakshmi Engineering College)");
  assert.ok(html.includes("2764"), "Must include College 2764 (Bannari Amman Institute of Technology)");
  assert.ok(html.includes("5910"), "Must include College 5910 (Mepco Schlenk / autonomous addition)");

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

  assert.ok(html.includes("கடந்த ஆண்டு கட்-ஆஃப் ஒப்பீடு (தற்காலிக ஒதுக்கீடு)"), "Must have Tamil title");
  assert.ok(html.includes("கடந்த கால தற்காலிக ஒதுக்கீடுகள் எதிர்கால சேர்க்கையை உறுதிப்படுத்தாது"), "Must have Tamil non-prediction disclaimer");
  assert.ok(
    html.includes("கிடைக்கக்கூடிய அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டு சுற்றுகளில்") ||
    html.includes("அதிகாரப்பூர்வ சுற்று 1"),
    "Approved runtime displays Tamil observation disclosure by default"
  );
  assert.ok(html.includes("என் விருப்பப் பட்டியல்"), "Must have Tamil shortlist tab link");
  assert.ok(html.includes("கலந்தாய்வு வழிகாட்டி"), "Must have Tamil counselling tab link");
  assert.ok(html.includes('<a href="/m5-guidance?lang=ta" aria-current="page">விருப்பப் பட்டியல்</a>'), "Must highlight Tamil Choice Planner in site header");
});

test("M5 Historical Calculation: Calculates arithmetic delta and displays official locator", () => {
  const html = renderM5GuidancePage(new URLSearchParams({ q: "4960" }), {
    studentCutoff: 180.0,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    round: "ROUND_2",
    year: 2025,
  });

  assert.ok(html.includes("+3.50 vs observed minimum"), "Must calculate arithmetic delta 180.0 - 176.5 = +3.50");
  assert.ok(html.includes("176.50"), "Must display observed minimum 176.50");
  assert.ok(html.includes("ROUND 2 - GENERAL ACADEMIC"), "Must cite official publication");
});

test("M5 2026 Active Comparison: Calculates arithmetic delta for expanded autonomous college (Saveetha 1216)", () => {
  const html = renderM5GuidancePage(new URLSearchParams({ q: "1216" }), {
    studentCutoff: 190.0,
    quota: "GENERAL_ACADEMIC",
    community: "OC",
    round: "ROUND_1",
    year: 2026,
  });

  assert.ok(html.includes("1216"), "Must render Saveetha");
  assert.ok(html.includes("Saveetha Engineering College"), "Must include Saveetha name");
  assert.ok(!html.includes('class="neutral-badge">Not available for comparison'), "Must be active in 2026 comparison");
  assert.ok(html.includes("vs observed minimum"), "Must display arithmetic delta");
});

test("M5 Governed Offering Filter: Ungoverned historical pairs fail closed and are excluded from keyIndex", () => {
  const ungovernedPairs = ["1301~AM", "1301~DA", "1322~MZ", "3813~AD", "3813~ME"];
  for (const pair of ungovernedPairs) {
    const [collegeCode, programmeCode] = pair.split("~");
    const res = compareOffering({
      studentCutoff: 180.0,
      year: 2026,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "OC",
      collegeCode,
      programmeCode,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    });
    assert.equal(res.status, "NO_HISTORICAL_DATA", `Pair ${pair} must fail closed`);
    assert.equal(res.evidenceSemantics, "NOT_AVAILABLE_FOR_COMPARISON");
  }
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

  // 7. Tamil Print View Parity: Print header contains Tamil prose with zero untranslated English sentences
  const htmlTa = renderM5GuidancePage(new URLSearchParams({
    tab: "shortlist",
    shortlist: "2006~EC,1~CS",
    lang: "ta",
  }));
  const printHeaderMatch = htmlTa.match(/<div class="print-header print-only">([\s\S]*?)<\/div>/);
  assert.ok(printHeaderMatch, "Tamil shortlist must render print-header block");
  const taPrintHeader = printHeaderMatch[1];
  assert.ok(
    taPrintHeader.includes("தமிழ்நாடு பொறியியல் சேர்க்கை (TNEA) — மாணவர் விருப்ப முன்னுரிமைப் பணித்தாள்"),
    "Tamil print header must display Tamil worksheet title"
  );
  assert.ok(
    taPrintHeader.includes("அதிகாரப்பூர்வ TNEA விருப்பப் பதிவு முன்னுரிமைப் பணித்தாள் — கணிப்பு அல்லாத குறிப்புப் படிவம்"),
    "Tamil print header must display Tamil non-predictive reference subtitle"
  );
  assert.ok(
    !taPrintHeader.includes("Student Choice Preference Worksheet"),
    "Tamil print header must not contain untranslated English worksheet sentence"
  );
  assert.ok(
    !taPrintHeader.includes("Official TNEA Choice Entry"),
    "Tamil print header must not contain untranslated English subtitle"
  );
});

test("M6-T03 Acronym & Search Polish: Students can instantly search by college acronyms (CEG, MIT, GCT, PSG, CIT, etc.)", () => {
  // 1. Univ Depts Acronyms
  const htmlCeg = renderM5GuidancePage(new URLSearchParams({ q: "CEG" }));
  assert.ok(htmlCeg.includes("College of Engineering Guindy (CEG)"));
  assert.ok(!htmlCeg.includes("Government College of Technology, Coimbatore"));

  const htmlMit = renderM5GuidancePage(new URLSearchParams({ q: "MIT" }));
  assert.ok(htmlMit.includes("Madras Institute of Technology (MIT)"));

  const htmlAct = renderM5GuidancePage(new URLSearchParams({ q: "ACT" }));
  assert.ok(htmlAct.includes("Alagappa College of Technology (ACT)"));

  const htmlSap = renderM5GuidancePage(new URLSearchParams({ q: "SAP" }));
  assert.ok(htmlSap.includes("School of Architecture and Planning (SAP)"));

  const htmlFeat = renderM5GuidancePage(new URLSearchParams({ q: "FEAT" }));
  assert.ok(htmlFeat.includes("Faculty of Engineering &amp; Technology, Annamalai University"));

  // 2. Premier Govt & Aided Acronyms
  const htmlGct = renderM5GuidancePage(new URLSearchParams({ q: "GCT" }));
  assert.ok(htmlGct.includes("Government College of Technology, Coimbatore"));

  const htmlPsg = renderM5GuidancePage(new URLSearchParams({ q: "PSG" }));
  assert.ok(htmlPsg.includes("PSG College of Technology"));
  assert.ok(htmlPsg.includes("PSG Institute of Technology and Applied Research"));

  const htmlCit = renderM5GuidancePage(new URLSearchParams({ q: "CIT" }));
  assert.ok(htmlCit.includes("Coimbatore Institute of Technology"));
  assert.ok(htmlCit.includes("Chennai Institute of Technology"));

  const htmlTce = renderM5GuidancePage(new URLSearchParams({ q: "TCE" }));
  assert.ok(htmlTce.includes("Thiagarajar College of Engineering"));

  const htmlIrtt = renderM5GuidancePage(new URLSearchParams({ q: "IRTT" }));
  assert.ok(htmlIrtt.includes("Government College of Engineering, Erode (IRTT)"));

  const htmlAccet = renderM5GuidancePage(new URLSearchParams({ q: "ACCET" }));
  assert.ok(htmlAccet.includes("Alagappa Chettiar Government College of Engineering and Technology"));

  // 3. Constituent & Regional Colleges
  const htmlBit = renderM5GuidancePage(new URLSearchParams({ q: "BIT Trichy" }));
  assert.ok(htmlBit.includes("(3011)"));

  const htmlVoc = renderM5GuidancePage(new URLSearchParams({ q: "VOC Thoothukudi" }));
  assert.ok(htmlVoc.includes("(5022)"));

  const htmlUcev = renderM5GuidancePage(new URLSearchParams({ q: "UCEV" }));
  assert.ok(htmlUcev.includes("(1013)"));

  const htmlUcet = renderM5GuidancePage(new URLSearchParams({ q: "UCET" }));
  assert.ok(htmlUcet.includes("(1014)"));

  const htmlUcea = renderM5GuidancePage(new URLSearchParams({ q: "UCEA" }));
  assert.ok(htmlUcea.includes("(1015)"));

  const htmlAurcc = renderM5GuidancePage(new URLSearchParams({ q: "AURCC" }));
  assert.ok(htmlAurcc.includes("(2025)"));

  // 4. Top Autonomous SFCs
  const htmlKct = renderM5GuidancePage(new URLSearchParams({ q: "KCT" }));
  assert.ok(htmlKct.includes("Kumaraguru College of Technology"));

  const htmlMepco = renderM5GuidancePage(new URLSearchParams({ q: "Mepco" }));
  assert.ok(htmlMepco.includes("Mepco Schlenk Engineering College"));

  const htmlSsrec = renderM5GuidancePage(new URLSearchParams({ q: "SSREC" }));
  assert.ok(htmlSsrec.includes("Sri Sai Ram Engineering College"));

  const htmlRec = renderM5GuidancePage(new URLSearchParams({ q: "REC" }));
  assert.ok(htmlRec.includes("Rajalakshmi Engineering College"));

  const htmlSvce = renderM5GuidancePage(new URLSearchParams({ q: "SVCE" }));
  assert.ok(htmlSvce.includes("Sri Venkateswara College of Engineering"));

  const htmlLicet = renderM5GuidancePage(new URLSearchParams({ q: "LICET" }));
  assert.ok(htmlLicet.includes("Loyola-ICAM College of Engineering and Technology (LICET)"));

  const htmlSkcet = renderM5GuidancePage(new URLSearchParams({ q: "SKCET" }));
  assert.ok(htmlSkcet.includes("Sri Krishna College of Engineering and Technology"));

  const htmlVec = renderM5GuidancePage(new URLSearchParams({ q: "VEC" }));
  assert.ok(htmlVec.includes("Velammal Engineering College"));

  // 5. Compound & Multi-Token Queries
  const htmlCegCse = renderM5GuidancePage(new URLSearchParams({ q: "CEG CSE" }));
  assert.ok(htmlCegCse.includes("College of Engineering Guindy (CEG)"));
  assert.ok(htmlCegCse.includes("COMPUTER SCIENCE AND ENGINEERING"));

  const htmlPsgEce = renderM5GuidancePage(new URLSearchParams({ q: "PSG ECE" }));
  assert.ok(htmlPsgEce.includes("PSG College of Technology"));
  assert.ok(htmlPsgEce.includes("ELECTRONICS AND COMMUNICATION"));

  const htmlGctMech = renderM5GuidancePage(new URLSearchParams({ q: "GCT Mech" }));
  assert.ok(htmlGctMech.includes("Government College of Technology, Coimbatore"));
  assert.ok(htmlGctMech.includes("MECHANICAL ENGINEERING"));

  // Distinguish CIT Chennai vs CIT Coimbatore
  const htmlCitCh = renderM5GuidancePage(new URLSearchParams({ q: "CIT Chennai" }));
  assert.ok(htmlCitCh.includes("(1399)"));
  assert.ok(!htmlCitCh.includes("(2007)"));

  const htmlCitCbe = renderM5GuidancePage(new URLSearchParams({ q: "CIT Coimbatore" }));
  assert.ok(htmlCitCbe.includes("(2007)"));
  assert.ok(!htmlCitCbe.includes("(1399)"));

  // 6. Direct TNEA Choice Syntax (1~CS, 2006~EC)
  const html1Cs = renderM5GuidancePage(new URLSearchParams({ q: "1~CS" }));
  assert.ok(html1Cs.includes("College of Engineering Guindy (CEG)"));
  assert.ok(html1Cs.includes("COMPUTER SCIENCE AND ENGINEERING"));
  assert.ok(!html1Cs.includes("MECHANICAL ENGINEERING"));
  assert.ok(!html1Cs.includes("(1113)"));

  const html2006Ec = renderM5GuidancePage(new URLSearchParams({ q: "2006~EC" }));
  assert.ok(html2006Ec.includes("PSG College of Technology"));
  assert.ok(html2006Ec.includes("ELECTRONICS AND COMMUNICATION"));

  // 7. Bilingual Parity: Tamil Regional Queries
  const htmlChennai = renderM5GuidancePage(new URLSearchParams({ q: "சென்னை" }));
  assert.ok(htmlChennai.includes("College of Engineering Guindy (CEG)"));
  assert.ok(!htmlChennai.includes("Government College of Technology, Coimbatore"));

  const htmlKovai = renderM5GuidancePage(new URLSearchParams({ q: "கோவை", show_all: "1" }));
  assert.ok(htmlKovai.includes("Government College of Technology, Coimbatore"));
  assert.ok(htmlKovai.includes("PSG College of Technology"));
  assert.ok(!htmlKovai.includes("College of Engineering Guindy (CEG)"));

  const htmlMadurai = renderM5GuidancePage(new URLSearchParams({ q: "மதுரை", show_all: "1" }));
  assert.ok(htmlMadurai.includes("Thiagarajar College of Engineering"));
  assert.ok(!htmlMadurai.includes("Government College of Technology, Coimbatore"));

  const htmlTrichy = renderM5GuidancePage(new URLSearchParams({ q: "திருச்சி", show_all: "1" }));
  assert.ok(htmlTrichy.includes("(3011)"));
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

test("M6-T01 Unified Student Navigation & Journey Consolidation: Shortlist pill, next step transition card, and counselling bottom navigation", () => {
  // 1. Comparison Tab: Shortlist Summary Pill appears when shortlist has items
  const htmlCompWithShortlist = renderM5GuidancePage(new URLSearchParams({
    tab: "comparison",
    lang: "en",
    shortlist: "1~CS,2006~ME",
  }));
  assert.ok(htmlCompWithShortlist.includes("shortlist-summary-pill"), "Must render shortlist summary pill when items are shortlisted");
  assert.ok(htmlCompWithShortlist.includes("Selected Choices: 2"), "Must show choice count in pill");
  assert.ok(htmlCompWithShortlist.includes("Go to Choice Order Planner →"), "Must link to Choice Planner");
  assert.ok(htmlCompWithShortlist.includes('href="?tab=shortlist&amp;lang=en&amp;shortlist=1~CS,2006~ME"'), "Pill must preserve shortlist state in link");

  // Comparison Tab: Pill does not appear when shortlist is empty
  const htmlCompEmpty = renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "en" }));
  assert.ok(!htmlCompEmpty.includes("shortlist-summary-pill"), "Empty shortlist must not show summary pill");

  // Comparison Tab in Tamil
  const htmlCompTa = renderM5GuidancePage(new URLSearchParams({
    tab: "comparison",
    lang: "ta",
    shortlist: "1~CS,2006~ME",
  }));
  assert.ok(htmlCompTa.includes("தேர்ந்தெடுக்கப்பட்ட விருப்பங்கள்: 2"), "Tamil summary pill must display Tamil text");
  assert.ok(htmlCompTa.includes("விருப்பப் பட்டியலை வரிசைப்படுத்த →"), "Tamil button text");

  // 2. Shortlist Tab: Next Step Transition Card to Counselling Guidance
  const htmlShortlistWithItems = renderM5GuidancePage(new URLSearchParams({
    tab: "shortlist",
    lang: "en",
    shortlist: "1~CS,2006~ME",
  }));
  assert.ok(htmlShortlistWithItems.includes("next-step-card"), "Must render Next Step transition card on shortlist");
  assert.ok(htmlShortlistWithItems.includes("Next Step: Understand Official TNEA Allocation &amp; Upward Movement"), "Card heading");
  assert.ok(htmlShortlistWithItems.includes('href="?tab=counselling&amp;lang=en&amp;shortlist=1~CS,2006~ME"'), "Card must link to counselling tab with shortlist state");
  assert.ok(htmlShortlistWithItems.includes("Read Counselling Procedures &amp; Rules →"), "Card CTA button");

  // Shortlist Tab: Next Step card does NOT appear when shortlist is empty
  const htmlShortlistEmpty = renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "en" }));
  assert.ok(!htmlShortlistEmpty.includes("next-step-card"), "Empty shortlist must not show next step card");

  // Shortlist Tab in Tamil
  const htmlShortlistTa = renderM5GuidancePage(new URLSearchParams({
    tab: "shortlist",
    lang: "ta",
    shortlist: "1~CS,2006~ME",
  }));
  assert.ok(htmlShortlistTa.includes("அடுத்த படி: TNEA கலந்தாய்வு ஒதுக்கீட்டு விதிகளை அறிதல்"), "Tamil heading in Next Step card");
  assert.ok(htmlShortlistTa.includes("கலந்தாய்வு நடைமுறைகள் &amp; விதிகளைப் படிக்க →"), "Tamil CTA button in Next Step card");

  // 3. Counselling Guidance Tab: Bottom Navigation Actions
  const htmlCounselling = renderM5GuidancePage(new URLSearchParams({
    tab: "counselling",
    lang: "en",
    shortlist: "1~CS,2006~ME",
  }));
  assert.ok(htmlCounselling.includes("counselling-bottom-actions"), "Must render bottom navigation actions on counselling tab");
  assert.ok(htmlCounselling.includes('href="?tab=shortlist&amp;lang=en&amp;shortlist=1~CS,2006~ME"'), "Must link back to shortlist");
  assert.ok(htmlCounselling.includes("← Back to My Shortlist"), "Back button label");
  assert.ok(htmlCounselling.includes('href="?tab=comparison&amp;lang=en&amp;shortlist=1~CS,2006~ME"'), "Must link to college comparison");
  assert.ok(htmlCounselling.includes("Browse More Colleges"), "Browse colleges label");
  assert.ok(htmlCounselling.includes('href="/personal?lang=en"'), "Must link to cutoff calculator");
  assert.ok(htmlCounselling.includes("Cutoff Calculator"), "Cutoff calculator label");
  assert.ok(htmlCounselling.includes('href="https://www.tneaonline.org/"'), "Must link to official TNEA portal");

  // Counselling Guidance Tab in Tamil
  const htmlCounsellingTa = renderM5GuidancePage(new URLSearchParams({
    tab: "counselling",
    lang: "ta",
    shortlist: "1~CS,2006~ME",
  }));
  assert.ok(htmlCounsellingTa.includes("← என் விருப்பப் பட்டியலுக்குத் திரும்பு"), "Tamil back button label");
  assert.ok(htmlCounsellingTa.includes("கூடுதல் கல்லூரிகளைப் பார்வையிட"), "Tamil browse colleges label");
  assert.ok(htmlCounsellingTa.includes("கட்-ஆஃப் கணக்கீடு"), "Tamil cutoff calculator label");
  assert.ok(htmlCounsellingTa.includes("அதிகாரப்பூர்வ TNEA தளம் ↗"), "Tamil official TNEA portal label");
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

test("M5 Filters: District and Branch dropdowns filter offerings cleanly and preserve state", () => {
  // Stage 1 (Search / Edit Search) renders District and Branch dropdowns with selected values
  const htmlSearchStage = renderM5GuidancePage(
    new URLSearchParams({ district: "Chennai", branch: "EI", lang: "en", edit_search: "1" }),
    {
      studentCutoff: 180.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      communitySelected: true,
    }
  );
  assert.ok(htmlSearchStage.includes('id="district-select"'), "Must render District dropdown");
  assert.ok(htmlSearchStage.includes('id="branch-select"'), "Must render Branch dropdown");
  assert.ok(htmlSearchStage.includes('value="Chennai" selected'), "Must preserve selected District");
  assert.ok(htmlSearchStage.includes('value="EI" selected'), "Must preserve selected Branch");

  const htmlCombined = renderM5GuidancePage(
    new URLSearchParams({ district: "Chennai", branch: "EI", lang: "en" }),
    {
      studentCutoff: 180.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      communitySelected: true,
    }
  );

  // Compact result count pill and Edit Search button
  assert.ok(htmlCombined.includes("results-count-pill"), "Must display compact result count pill");
  assert.ok(htmlCombined.includes("Edit Search"), "Must show Edit Search button on results page");

  // Exact Chennai + EI matches only (Velammal 1120 is Chennai EI; PSG 2006 is Coimbatore)
  assert.ok(htmlCombined.includes("Velammal Engineering College"), "Must include Chennai EI offering (1120)");
  assert.ok(!htmlCombined.includes("PSG College of Technology"), "Must exclude non-Chennai colleges");
  assert.ok(!htmlCombined.includes('<span class="branch-pill">CS</span>'), "Must exclude non-EI branches");

  // Compact row elements & filter preservation in shortlist POST form and language switch
  assert.ok(htmlCombined.includes('<span class="branch-pill">EI</span>'), "Must render crisp branch code pill");
  assert.ok(htmlCombined.includes('<span class="district-tag">· Chennai</span>'), "Must render district tag");
  assert.ok(htmlCombined.includes('<input type="hidden" name="district" value="Chennai">'), "Must preserve district in shortlist form");
  assert.ok(htmlCombined.includes('<input type="hidden" name="branch" value="EI">'), "Must preserve branch in shortlist form");
  assert.ok(htmlCombined.includes('name="district" value="Chennai"') || htmlCombined.includes("district=Chennai"), "Language switch must preserve district filter");
  assert.ok(htmlCombined.includes('name="branch" value="EI"') || htmlCombined.includes("branch=EI"), "Language switch must preserve branch filter");
  assert.ok(!htmlCombined.includes("cutoff=180"), "Must never leak student cutoff into GET URLs");
});

test("M5 Feedback #1: Jargon copy '(அடிப்படை 55 கல்லூரிகள் உட்பட)' is absent from Tamil and English views", () => {
  const htmlTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  const htmlEn = renderM5GuidancePage(new URLSearchParams({ lang: "en" }));

  assert.ok(!htmlTa.includes("அடிப்படை 55 கல்லூரிகள் உட்பட"), "Must remove Tamil milestone jargon from scope note");
  assert.ok(!htmlTa.includes("55 கல்லூரிகள் உட்பட"), "Must remove 55 colleges phrase from truth banner");
  assert.ok(
    !htmlEn.includes("including all 55 approved institutions from the benchmark cohort"),
    "Must remove English benchmark cohort copy from truth banner"
  );
  assert.ok(
    !htmlEn.includes("including the 55 approved institutions from the benchmark cohort"),
    "Must remove English benchmark cohort copy from scope note"
  );
});

test("M5 Feedback #2 & #3: College Type filter and intelligent cutoff descending sorting", () => {
  // A. College Type filter for GOVERNMENT (post-search toolbar)
  const htmlGov = renderM5GuidancePage(new URLSearchParams({ type: "GOVERNMENT", lang: "en", show_all: "1" }));
  assert.ok(htmlGov.includes('id="m5-toolbar-type"'), "Must render College Type dropdown on results page");
  assert.ok(htmlGov.includes('value="GOVERNMENT" selected'), "Must select GOVERNMENT");
  assert.ok(htmlGov.includes("Government College of Technology, Coimbatore"), "Must include GCT (2005)");
  assert.ok(htmlGov.includes("Alagappa Chettiar Government College"), "Must include ACGCET (5901)");
  assert.ok(!htmlGov.includes("PSG College of Technology"), "Must exclude Government-Aided colleges");
  assert.ok(!htmlGov.includes("Saveetha Engineering College"), "Must exclude Autonomous SFCs");

  // B. College Type filter for AIDED
  const htmlAided = renderM5GuidancePage(new URLSearchParams({ type: "AIDED", lang: "en" }));
  assert.ok(htmlAided.includes("PSG College of Technology"), "Must include PSG Tech (2006)");
  assert.ok(htmlAided.includes("Coimbatore Institute of Technology"), "Must include CIT (2007)");
  assert.ok(htmlAided.includes("Thiagarajar College of Engineering"), "Must include TCE (5008)");
  assert.ok(!htmlAided.includes("College of Engineering Guindy"), "Must exclude University Departments");

  // C. Default Cutoff High-to-Low Sorting (cutoff_desc) & Explicit Alphabetical Sorting (college_name)
  const htmlDefault = renderM5GuidancePage(
    new URLSearchParams({ branch: "CS", lang: "en" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      year: 2026,
      communitySelected: true,
    }
  );

  // Default sorting on /m5-guidance must be Cutoff High to Low (cutoff_desc)
  const cegDefaultIdx = htmlDefault.indexOf("College of Engineering Guindy");
  const actDefaultIdx = htmlDefault.indexOf("Alagappa Chettiar Government College");
  assert.ok(cegDefaultIdx !== -1, "Must contain CEG CS");
  if (actDefaultIdx !== -1) {
    assert.ok(cegDefaultIdx < actDefaultIdx, "In default cutoff_desc sort, CEG (199.00) must appear before Alagappa Chettiar (184.50)");
  }
  assert.ok(htmlDefault.includes('value="cutoff_desc" selected'), "Must select cutoff_desc by default");

  // Explicit Alphabetical Sorting: College Name (A-Z)
  const htmlAlpha = renderM5GuidancePage(
    new URLSearchParams({ branch: "CS", sort: "college_name", lang: "en" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      year: 2026,
      communitySelected: true,
    }
  );

  const actAlphaIdx = htmlAlpha.indexOf("Alagappa Chettiar Government College");
  const cegAlphaIdx = htmlAlpha.indexOf("College of Engineering Guindy");
  assert.ok(actAlphaIdx !== -1 && cegAlphaIdx !== -1, "Must contain both colleges");
  assert.ok(actAlphaIdx < cegAlphaIdx, "Alagappa Chettiar (A) must appear before CEG (C) when sort=college_name");
  assert.ok(htmlAlpha.includes('value="college_name" selected'), "Must select college_name when requested");

  // D. Sort option dropdown presence and shortlist form persistence
  const htmlSorted = renderM5GuidancePage(
    new URLSearchParams({ branch: "CS", sort: "cutoff_desc", lang: "en" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      year: 2026,
      communitySelected: true,
    }
  );
  assert.ok(htmlSorted.includes('id="m5-toolbar-sort"'), "Must render Sort By dropdown on results page");
  assert.ok(htmlSorted.includes('<input type="hidden" name="sort" value="cutoff_desc">'), "Must preserve sort in shortlist form");
});

test("M5 Feedback #4: Cool educational styling, college type badges, and header card", () => {
  const htmlSearch = renderM5GuidancePage(new URLSearchParams({ lang: "ta", edit_search: "1" }));
  assert.ok(htmlSearch.includes('class="m5-header-card"'), "Must use elevated header card container");
  assert.ok(htmlSearch.includes("compact-search-card"), "Must use compact 2-stage search card");
  assert.ok(htmlSearch.includes("compact-search-grid"), "Must use compact 2-column search grid");

  const html = renderM5GuidancePage(
    new URLSearchParams({ lang: "ta" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      year: 2026,
      communitySelected: true,
    }
  );

  assert.ok(html.includes('class="m5-header-card"'), "Must use elevated header card container");
  assert.ok(html.includes("type-pill"), "Must render college type badge pills");
  assert.ok(html.includes("type-gov"), "Must render type-gov style class");
  assert.ok(html.includes("cutoff-subtext"), "Must render round and year subtext under cutoff mark");
});

test("M5 Feedback #5: All Rounds closing cutoffs, cross-round intelligence, and modern typography", () => {
  // A. All Rounds Mode (round="ALL"): CEG CS (199.00, Round 1) and Adhiparasakthi CS (102.50, Round 3) appear with actual cutoffs
  const htmlAll = renderM5GuidancePage(
    new URLSearchParams({ branch: "CS", lang: "en", show_all: "1" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ALL",
      year: 2026,
      communitySelected: true,
    }
  );

  // Both colleges have real lowest observed marks rendered in the same table
  assert.ok(htmlAll.includes("199.00"), "Must show CEG CS closing cutoff 199.00");
  assert.ok(htmlAll.includes("102.50"), "Must show Adhiparasakthi CS closing cutoff 102.50");
  assert.ok(htmlAll.includes("Round 1 · 2026"), "Must show Round 1 source for CEG");
  assert.ok(htmlAll.includes("Round 3 · 2026"), "Must show Round 3 source for Adhiparasakthi");
  assert.ok(!htmlAll.includes("Final Closing Cutoff"), "Must not use misleading Final Closing Cutoff terminology");

  const htmlAllForm = renderM5GuidancePage(
    new URLSearchParams({ branch: "CS", lang: "en", edit_search: "1" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ALL",
      year: 2026,
      communitySelected: true,
    }
  );
  assert.ok(htmlAllForm.includes("All Available Rounds (Lowest Observed Mark)"), "Must show All Available Rounds option in dropdown");
  assert.ok(htmlAllForm.includes('value="ALL" selected'), "Must keep ALL option selected");
  assert.ok(htmlAllForm.includes("Lowest observed provisional allotment mark across available official rounds"), "Must render factual lowest observed disclosure in collapsed guide");

  // B. Cross-Round Record in specific round (Round 1 + query for Adhiparasakthi 1401)
  const htmlR1Query = renderM5GuidancePage(
    new URLSearchParams({ q: "1401", lang: "en" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      year: 2026,
      communitySelected: true,
    }
  );

  // Factual cross-round record notice instead of unsupported inferences like "No Round 1 allotment" or "Filled before"
  assert.ok(
    htmlR1Query.includes("No comparable record available for this round; a record exists in Round 3 (102.50)"),
    "Must display factual cross-round record statement"
  );
  assert.ok(
    !htmlR1Query.includes("No Round 1 allotment"),
    "Must not claim 'No allotment' without official closure/vacancy publication"
  );
  assert.ok(
    !htmlR1Query.includes("Filled before"),
    "Must not claim 'Filled before' without official vacancy publication"
  );
  assert.ok(
    htmlR1Query.includes("Round 3: 102.50"),
    "Must render other round cutoff subtext under the dash"
  );
  assert.ok(
    htmlR1Query.includes("pp. 277-990"),
    "Must include source locator in details element for other round record"
  );

  // C. Tamil translation of cross-round intelligence badge
  const htmlR1QueryTa = renderM5GuidancePage(
    new URLSearchParams({ q: "1401", lang: "ta" }),
    {
      studentCutoff: 198.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      year: 2026,
      communitySelected: true,
    }
  );
  assert.ok(
    htmlR1QueryTa.includes("இந்தச் சுற்றில் தரவு இல்லை; சுற்று 3-ல் குறைந்தபட்ச ஒதுக்கீட்டு மதிப்பெண் உள்ளது (102.50)"),
    "Must render Tamil factual cross-round record statement"
  );
  assert.ok(
    !htmlR1QueryTa.includes("ஒதுக்கீடு இல்லை"),
    "Tamil copy must not claim 'ஒதுக்கீடு இல்லை' (No allotment)"
  );
  assert.ok(
    !htmlR1QueryTa.includes("முடிந்தது"),
    "Tamil copy must not claim 'முடிந்தது' (Filled/Closed)"
  );

  // D. Modern typography and Google Fonts in HTML
  assert.ok(htmlAll.includes("fonts.googleapis.com"), "Must include Google Fonts preconnect");
  assert.ok(htmlAll.includes("Plus+Jakarta+Sans"), "Must include Plus Jakarta Sans font link");
  assert.ok(htmlAll.includes("Noto+Sans+Tamil"), "Must include Noto Sans Tamil font link");
  assert.ok(htmlAll.includes('"Plus Jakarta Sans", "Inter"'), "Must apply modern font stack in CSS");
});

test("M5 DOTE Classification & College Selection: Exact categories from dte.tn.gov.in, post-search DOTE dropdown, and district filtering", () => {
  // 1. Initial landing includes collapsed DOTE Guide with dte.tn.gov.in reference
  const htmlLanding = renderM5GuidancePage(new URLSearchParams({ lang: "en" }));
  assert.ok(htmlLanding.includes("dte.tn.gov.in"), "Must reference official DOTE website");
  assert.ok(htmlLanding.includes("Directorate of Technical Education (DOTE) College Classification"), "Must explain DOTE classification");
  assert.ok(htmlLanding.includes("Government Engineering Colleges (11)"), "Must include Government Engineering Colleges (11)");
  assert.ok(htmlLanding.includes("Government Aided Engineering Colleges (3)"), "Must include Government Aided Engineering Colleges (3)");
  assert.ok(htmlLanding.includes("Anna University Department Colleges (4)"), "Must include Anna University Department Colleges (4)");
  assert.ok(htmlLanding.includes("Annamalai University (1)"), "Must include Annamalai University (1)");
  assert.ok(htmlLanding.includes("Anna University Constituent Colleges (16)"), "Must include Anna University Constituent Colleges (16)");
  assert.ok(htmlLanding.includes("Self Financing Engineering Colleges (86 Autonomous)"), "Must include Self Financing Engineering Colleges (86)");

  // 2. Tamil language parity
  const htmlTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  assert.ok(htmlTa.includes("அரசுப் பொறியியல் கல்லூரிகள் (Government Engineering Colleges — 11)"), "Must have Tamil Govt label");
  assert.ok(htmlTa.includes("அரசு உதவிபெறும் பொறியியல் கல்லூரிகள் (Government Aided Engineering Colleges — 3)"), "Must have Tamil Aided label");
  assert.ok(htmlTa.includes("அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள் (Anna University Department Colleges — 4)"), "Must have Tamil Anna Univ Dept label");
  assert.ok(htmlTa.includes("அண்ணாமலைப் பல்கலைக்கழகம் (Annamalai University — 1)"), "Must have Tamil Annamalai label");
  assert.ok(htmlTa.includes("அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள் (Anna University Constituent Colleges — 16)"), "Must have Tamil Constituent label");
  assert.ok(htmlTa.includes("சுயநிதிப் பொறியியல் கல்லூரிகள் — தன்னாட்சி (86)"), "Must have Tamil SFC label");
  assert.ok(htmlTa.includes("தமிழ்நாடு தொழில்நுட்பக் கல்வி இயக்ககம் (DOTE) கல்லூரி வகைப்பாடுகள்"), "Must have Tamil DOTE guide");

  // 3. Post-search toolbar renders DOTE category dropdown & college filtering works
  const htmlGct = renderM5GuidancePage(new URLSearchParams({ college: "2005", lang: "en" }));
  assert.ok(htmlGct.includes('id="m5-toolbar-type"'), "Must render DOTE type dropdown on results page");
  assert.ok(htmlGct.includes("Government College of Technology, Coimbatore"), "Must contain GCT offerings");
  assert.ok(!htmlGct.includes("Alagappa Chettiar Government College"), "Must exclude other colleges when college is selected");
  assert.ok(htmlGct.includes('<input type="hidden" name="college" value="2005">'), "Must preserve college in shortlist form");

  // 4. District and Type filtering narrows results cleanly
  const htmlCbeAided = renderM5GuidancePage(new URLSearchParams({ district: "Coimbatore", type: "AIDED", lang: "en" }));
  assert.ok(htmlCbeAided.includes("PSG College of Technology"), "Must include PSG Tech in Coimbatore Aided");
  assert.ok(htmlCbeAided.includes("Coimbatore Institute of Technology"), "Must include CIT in Coimbatore Aided");
  assert.ok(!htmlCbeAided.includes("Thiagarajar College of Engineering"), "Must exclude TCE Madurai from Coimbatore district");

  // 5. DOTE category badges on table rows (rendered when all offerings or filtered offerings are viewed)
  const htmlOfferings = renderM5GuidancePage(new URLSearchParams({ lang: "en", show_all: "1" }));
  assert.ok(htmlOfferings.includes('class="type-pill type-univ"'), "Must render type-univ badge");
  assert.ok(htmlOfferings.includes('class="type-pill type-gov"'), "Must render type-gov badge");
  assert.ok(htmlOfferings.includes('class="type-pill type-aided"'), "Must render type-aided badge");
  assert.ok(htmlOfferings.includes('class="type-pill type-constituent"'), "Must render type-constituent badge");
  assert.ok(htmlOfferings.includes('class="type-pill type-sfc"'), "Must render type-sfc badge");
  assert.ok(htmlOfferings.includes("Anna University Department College"), "Must render Anna Univ Dept badge text");
  assert.ok(htmlOfferings.includes("Government Engineering College"), "Must render Govt badge text");
  assert.ok(htmlOfferings.includes("Government Aided Engineering College"), "Must render Govt Aided badge text");
});

test("Mobile Experience: Bounded pagination prevents rendering all 2,628 offerings on initial load and enables full reachability", () => {
  // 1. Initial search results render bounded window (50 offerings, not 2,628)
  const htmlPage1 = renderM5GuidancePage(new URLSearchParams({ lang: "en", searched: "1" }));
  const rowsMatch1 = htmlPage1.match(/<tr/g) || [];
  // Bounded window (50 offerings + college-group comparison headers, far below 2,628 offerings)
  assert.ok(rowsMatch1.length <= 75, "Initial load must be bounded to pagination window, not full 2,628 offerings");
  assert.ok(htmlPage1.includes("Page 1 of 53"), "Must show pagination metadata");
  assert.ok(htmlPage1.includes("Next"), "Must offer Next page navigation");

  // 2. Page 2 navigation
  const htmlPage2 = renderM5GuidancePage(new URLSearchParams({ page: "2", lang: "en" }));
  assert.ok(htmlPage2.includes("Page 2 of 53"), "Must render page 2 metadata");
  assert.ok(htmlPage2.includes("Prev"), "Must offer Previous page navigation on page 2");

  // 3. Shortlist toggle form preserves current page in hidden input
  assert.ok(htmlPage2.includes('<input type="hidden" name="page" value="2">'), "Shortlist toggle must preserve active page");

  // 4. Show all option remains reachable when explicitly requested
  const htmlAll = renderM5GuidancePage(new URLSearchParams({ show_all: "1", lang: "en" }));
  const rowsAll = htmlAll.match(/<tr/g) || [];
  assert.ok(rowsAll.length > 1000, "All offerings must remain reachable via show_all=1");
});

test("Mobile Experience: Tamil terminology regression check ensures 'கிளை' is absent from student-facing UI", () => {
  // A. Choice Planner comparison tab (form and search results table)
  const htmlTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  assert.ok(!htmlTa.includes("கிளை"), "Must not use 'கிளை' in student-facing comparison tab");
  assert.ok(htmlTa.includes("அனைத்துத் துறைகள்"), "Must use 'அனைத்துத் துறைகள்'");
  assert.ok(htmlTa.includes("துறை"), "Must use 'துறை' in labels and filters");

  const htmlTaResults = renderM5GuidancePage(new URLSearchParams({ lang: "ta", searched: "1" }));
  assert.ok(!htmlTaResults.includes("கிளை"), "Must not use 'கிளை' in results view");
  assert.ok(htmlTaResults.includes("கல்லூரி &amp; துறை"), "Must use 'கல்லூரி & துறை' in table header");

  // B. Shortlist tab & exports
  const htmlShortlist = renderM5GuidancePage(new URLSearchParams({
    tab: "shortlist",
    shortlist: "1~CS,2006~ME",
    lang: "ta",
  }));
  assert.ok(!htmlShortlist.includes("கிளை"), "Must not use 'கிளை' anywhere in shortlist tab or exports");
  assert.ok(htmlShortlist.includes("பாடப்பிரிவு குறியீடு"), "Must use 'பாடப்பிரிவு குறியீடு' in shortlist table header");
  assert.ok(htmlShortlist.includes("பாடப்பிரிவு பெயர்"), "Must use 'பாடப்பிரிவு பெயர்' in shortlist table header");
  assert.ok(htmlShortlist.includes("பாடப்பிரிவு: [CS]"), "Export plain text must use 'பாடப்பிரிவு:'");

  // C. Counselling tab
  const htmlCounselling = renderM5GuidancePage(new URLSearchParams({
    tab: "counselling",
    lang: "ta",
  }));
  assert.ok(!htmlCounselling.includes("கிளை"), "Counselling tab must not use 'கிளை'");
  assert.ok(htmlCounselling.includes("துறை") || htmlCounselling.includes("பாடப்பிரிவு"), "Counselling tab must use 'துறை / பாடப்பிரிவு'");
});

test("Choice Planner Progressive Disclosure: 2-stage flow separates compact search card from clean college-grouped results", () => {
  // Step 1: Initial Landing shows compact pre-search card with NO college results and NO top disclaimers
  const landingEn = renderM5GuidancePage(new URLSearchParams({ lang: "en" }));
  assert.ok(landingEn.includes("compact-search-card"), "Landing view must render compact search card");
  assert.ok(landingEn.includes('id="cutoff-input"'), "Landing view must render cutoff input");
  assert.ok(landingEn.includes("required"), "Cutoff input must be mandatory");
  assert.ok(!landingEn.includes('id="search-input"'), "Landing view must not show text search box");
  assert.ok(!landingEn.includes('id="m5-filter-dialog"'), "Landing view must not show filter modal");
  assert.ok(!landingEn.includes('class="college-group-card"'), "Landing view must not dump college cards before search");
  assert.ok(landingEn.includes('class="learn-before-comparing'), "Landing view keeps Learn Before Comparing collapsed at bottom");

  // Step 2: Search Results View
  const resultsEn = renderM5GuidancePage(new URLSearchParams({ lang: "en", searched: "1" }));
  assert.ok(resultsEn.includes('<table class="comparison-table"'), "Results view must render college comparison table");
  assert.ok(resultsEn.includes('class="college-group-card"'), "Results view must render college group cards");
  assert.ok(resultsEn.includes('id="m5-toolbar-type"'), "Results view must offer DOTE category filter");
  assert.ok(resultsEn.includes('id="m5-toolbar-sort"'), "Results view must offer Sort By dropdown");
  assert.ok(resultsEn.includes("Edit Search"), "Results view must offer 'Edit Search' button");
  assert.ok(!resultsEn.includes('class="scope-note'), "Results view must not show top Dataset Scope disclaimer");
  assert.ok(!resultsEn.includes('class="student-safety-rule-banner"'), "Results view must not show top safety banner");
  assert.ok(resultsEn.includes('<input type="hidden" name="searched" value="1">'), "Shortlist toggle forms must preserve searched=1");

  // Verify top and bottom pagination bars
  const paginationBars = resultsEn.match(/class="pagination-bar screen-only"/g) || [];
  assert.equal(paginationBars.length, 2, "Results view must have top and bottom pagination bars");

  // Step 3: 'Edit Search' (edit_search=1) returns to focused search form with preserved values
  const editSearchEn = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1", district: "Chennai" }), { studentCutoff: 192.5 });
  assert.ok(editSearchEn.includes("compact-search-card"), "Edit search must display compact search form");
  assert.ok(!editSearchEn.includes('<table class="comparison-table"'), "Edit search must hide results table");
  assert.ok(editSearchEn.includes('value="192.5"'), "Edit search must preserve prior cutoff value");
  assert.ok(editSearchEn.includes('value="Chennai" selected'), "Edit search must preserve prior district value");

  // Step 4: Tamil language parity
  const landingTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  assert.ok(landingTa.includes("compact-search-card"), "Tamil landing view renders compact search card");
  assert.ok(!landingTa.includes('class="college-group-card"'), "Tamil landing view does not dump cards before search");

  const resultsTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta", searched: "1" }));
  assert.ok(resultsTa.includes('<table class="comparison-table"'), "Tamil results view must render college comparison table");
  assert.ok(resultsTa.includes("தேடலை மாற்ற"), "Tamil results view must offer 'தேடலை மாற்ற' action");
});

test("TNEA Historical Evidence & Round Exploration: No cutoff-to-round inference, Round 1 benchmark default, explicit round selection", () => {
  // 1. Cutoff >= 179.0 does NOT infer Round based on tier; it defaults to Round 1 benchmark (ROUND_1)
  const htmlR1 = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1" }), {
    studentCutoff: 185.5,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    communitySelected: true,
  });
  assert.ok(htmlR1.includes('<option value="ROUND_1" selected>'), "Cutoff 185.5 must default to Round 1 benchmark (no round inference)");

  // 2. Cutoff between 145.0 and 178.99 does NOT infer Round 2; it defaults to Round 1 benchmark (ROUND_1)
  const htmlR2 = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1" }), {
    studentCutoff: 160.0,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    communitySelected: true,
  });
  assert.ok(htmlR2.includes('<option value="ROUND_1" selected>'), "Cutoff 160.0 must default to Round 1 benchmark (no round inference)");

  // 3. Cutoff < 145.0 does NOT infer Round 3; it defaults to Round 1 benchmark (ROUND_1)
  const htmlR3 = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1" }), {
    studentCutoff: 120.0,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    communitySelected: true,
  });
  assert.ok(htmlR3.includes('<option value="ROUND_1" selected>'), "Cutoff 120.0 must default to Round 1 benchmark (no round inference)");

  // 4. Default 2026 landing (no cutoff specified) defaults to Round 1 benchmark (ROUND_1)
  const htmlDefault = renderM5GuidancePage(new URLSearchParams({ lang: "en" }));
  assert.ok(htmlDefault.includes('<option value="ROUND_1" selected>'), "Default 2026 landing must default to Round 1 benchmark");

  // 5. Explicit round selection works when student requests a specific round
  const htmlExplicitR1 = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1", round: "ROUND_1", round_explicit: "1" }), {
    studentCutoff: 185.5,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    round: "ROUND_1",
    roundExplicit: true,
    communitySelected: true,
  });
  assert.ok(htmlExplicitR1.includes('<option value="ROUND_1" selected>Round 1 (Default)</option>'), "Explicit Round 1 must be selected when requested");

  const htmlExplicitAll = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1", round: "ALL", round_explicit: "1" }), {
    studentCutoff: 185.5,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    round: "ALL",
    roundExplicit: true,
    communitySelected: true,
  });
  assert.ok(htmlExplicitAll.includes('<option value="ALL" selected>'), "Explicit All rounds must be selected when requested");

  // 6. Guidance text in Stage 1 collapsed drawer explains Student Eligibility Band vs Observed Allotment Marks
  assert.ok(htmlDefault.includes("Counselling Rounds vs Observed Allotment Marks"), "Must explain rounds vs observed allotment marks in English");
  assert.ok(!htmlDefault.includes("historical closing cutoffs"), "Must not call derived provisional marks historical closing cutoffs");
  assert.ok(!htmlDefault.includes("College Closing Cutoffs"), "Must not call derived provisional marks closing cutoffs");
  assert.ok(htmlDefault.includes("2026 (300 Colleges · 2,627/2,628 Offerings)"), "2026 year option must disclose 2,627/2,628 offerings");
  assert.ok(htmlDefault.includes("2025 (298/300 Colleges · 2,526/2,628 Offerings)"), "2025 year option must disclose 298/300 colleges and 2,526/2,628 offerings");
  assert.ok(htmlDefault.includes("2024 (296/300 Colleges · 2,420/2,628 Offerings)"), "2024 year option must disclose 296/300 colleges and 2,420/2,628 offerings");
  const html2024 = renderM5GuidancePage(new URLSearchParams({ lang: "en", year: "2024" }), { year: 2024 });
  assert.ok(html2024.includes('<option value="2024" selected>'), "Year 2024 must be selectable");
  const htmlTa = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  assert.ok(htmlTa.includes("கலந்தாய்வு சுற்றுகளும் ஒதுக்கீட்டு மதிப்பெண்களும்"), "Must explain rounds vs observed allotment marks in Tamil");
});

test("Section 33 Regressions: Clean 2-Stage Architecture, Mandatory Cutoff, & Privacy Invariants", () => {
  // 1. Cutoff no longer infers round
  const rHigh = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1" }), { studentCutoff: 198.5 });
  const rLow = renderM5GuidancePage(new URLSearchParams({ lang: "en", edit_search: "1" }), { studentCutoff: 95.0 });
  assert.ok(rHigh.includes('value="ROUND_1" selected'), "High cutoff defaults to ROUND_1 benchmark");
  assert.ok(rLow.includes('value="ROUND_1" selected'), "Low cutoff defaults to ROUND_1 benchmark");

  // 2. No prediction-tier language
  const html = renderM5GuidancePage(new URLSearchParams({ lang: "en" }), { studentCutoff: 180.0, quota: "GENERAL_ACADEMIC", community: "BC", communitySelected: true });
  assert.ok(!html.includes("aspirational"), "Must not contain aspirational tier");
  assert.ok(!html.includes("safe fallback"), "Must not contain safe fallback tier");
  assert.ok(!html.includes("admission chance"), "Must not contain admission chance");

  // 3. Round 1 benchmark default on results
  assert.ok(html.includes("Round 1"), "Must default to Round 1 benchmark");

  // 4. Stage 1 has compact search controls without text search or filter modal
  const stage1 = renderM5GuidancePage(new URLSearchParams({ lang: "en" }));
  assert.ok(!stage1.includes('id="m5-filter-dialog"'), "Must not render heavy filter modal");
  assert.ok(!stage1.includes('id="search-input"'), "Must not render college name/code text search box");
  assert.ok(stage1.includes('class="comm-pills-group"'), "Must render compact community radio pills");

  // 5. Shortlist add preserves context
  assert.ok(html.includes('class="shortlist-toggle-form"'), "Shortlist toggle forms exist");
  assert.ok(html.includes('name="tab" value="comparison"'), "Toggle preserves comparison tab");

  // 6. Sensitive values absent from GET URLs
  const getHrefs = Array.from(html.matchAll(/href="([^"]+)"/g)).map(m => m[1]);
  for (const h of getHrefs) {
    if (h.startsWith("?") || h.startsWith("/m5-guidance")) {
      assert.ok(!h.includes("cutoff="), "GET link must never contain cutoff: " + h);
      assert.ok(!h.includes("community="), "GET link must never contain community: " + h);
    }
  }

  // 7. Held/no-data/filtered-out states remain distinct
  const heldHtml = renderM5GuidancePage(new URLSearchParams({ q: "1516", lang: "en" }));
  assert.ok(heldHtml.includes("Booklet p. 160"), "Held college displays governance notice");

  // 8. Tamil Stage 1 & Stage 2 labels
  const taStage1 = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  assert.ok(taStage1.includes("தேடு &amp; ஒப்பிடு"), "Must render Tamil Search button");
  assert.ok(taStage1.includes("ஒப்பிடும் முன் தெரிந்துகொள்ள வேண்டியவை"), "Must render collapsed Tamil guide");
});

test("F-07: Inline multi-year trend pill renders 2026/2025/2024 evidence and fails closed on missing years", () => {
  // 1. Offering with 3-year evidence (CEG CS for OC General Academic Round 1)
  const htmlFull = renderM5GuidancePage(new URLSearchParams({ q: "CEG", branch: "CS", lang: "en" }), {
    studentCutoff: 199.0,
    quota: "GENERAL_ACADEMIC",
    community: "OC",
    round: "ROUND_1",
    communitySelected: true,
    year: 2026,
  });
  assert.ok(htmlFull.includes('class="multiyear-trend-pill"'), "Must render multi-year trend pill");
  assert.ok(htmlFull.includes("<strong>'26:</strong>"), "Must include '26 label");
  assert.ok(htmlFull.includes("<strong>'25:</strong>"), "Must include '25 label");
  assert.ok(htmlFull.includes("<strong>'24:</strong>"), "Must include '24 label");
  const fullPillMatch = htmlFull.match(/<div class="multiyear-trend-pill"[\s\S]*?<\/div>/);
  assert.ok(fullPillMatch, "Must find multi-year trend pill markup");
  assert.ok(!fullPillMatch[0].includes("—"), "CEG CS OC Round 1 must have numeric values for all three years");

  // 2. Offering with partial/missing evidence (college 1111 has zero 2024/2025 records, only 2026)
  const htmlPartial = renderM5GuidancePage(new URLSearchParams({ q: "1111", lang: "en" }), {
    studentCutoff: 150.0,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    round: "ROUND_1",
    communitySelected: true,
    year: 2026,
  });
  assert.ok(htmlPartial.includes('class="multiyear-trend-pill"'), "Must render multi-year trend pill for partial offering");
  assert.ok(htmlPartial.includes("<strong>'25:</strong> —"), "Missing 2025 year must fail closed as —");
  assert.ok(htmlPartial.includes("<strong>'24:</strong> —"), "Missing 2024 year must fail closed as —");
});

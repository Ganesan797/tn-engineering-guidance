import test from "node:test";
import assert from "node:assert/strict";
import { compareCutoff } from "../../src/m5/comparison-engine.ts";
import { formatTruthInGuidanceDisclosure, formatDeltaExplanation, M5_BILINGUAL_COPY } from "../../src/m5/bilingual-copy.ts";
import { getHistoricalObservations } from "../../src/m5/historical-data.ts";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import { loadApprovedDirectory } from "../../src/m4/approved-directory-preview.mjs";

const approvedView = loadApprovedDirectory();
const render = (query: string) => renderGovernedPilot(new URLSearchParams(query), undefined, approvedView);

// ============================================================================
// TASK 4.1: Responsive & Accessibility Walk (Mobile 360x800, 390x844, Desktop)
// ============================================================================

test("T11 / Task 4.1: Responsive layout, CSS media queries, and touch targets", () => {
  const htmlEn = render("view=colleges&lang=en");
  const htmlTa = render("view=colleges&lang=ta");

  // 1. Viewport meta tag present for mobile scaling
  assert.match(htmlEn, /<meta name="viewport" content="width=device-width,initial-scale=1">/);
  assert.match(htmlTa, /<meta name="viewport" content="width=device-width,initial-scale=1">/);

  // 2. Responsive CSS breakpoints (covers 360x800, 390x844, tablet 768px, desktop 1080px+)
  assert.match(htmlEn, /@media\(max-width:480px\)/);
  assert.match(htmlEn, /@media\(min-width:768px\)/);
  assert.match(htmlEn, /@media\(min-width:1080px\)/);

  // 3. Overflow protection for long names and Tamil text
  assert.match(htmlEn, /overflow-wrap:anywhere|overflow-wrap:break-word/);
  assert.match(htmlTa, /overflow-wrap:anywhere|overflow-wrap:break-word/);

  // 4. Touch target compliance: min-height 44px on interactive controls
  assert.match(htmlEn, /min-height:44px/);
  assert.match(htmlTa, /min-height:44px/);

  // 5. Accessible keyboard focus outline
  assert.match(htmlEn, /:focus-visible/);
  assert.match(htmlEn, /outline:3px solid #174ea6/);
});

// ============================================================================
// TASK 4.3: 10 Owner Acceptance Scenarios Walk
// ============================================================================

test("T12 / Scenario 1: Comparable Record (Delta > 0, = 0, < 0 with truth-in-guidance)", () => {
  // Test with College 1, EM (Mechanical Tamil Medium) min mark = 199.00
  const obs = getHistoricalObservations("1", "EM", 2025, "GA", "OC");
  assert.ok(obs.length > 0);
  const minMark = obs[0]!.minMark;

  // A. Delta > 0 (+0.50)
  const posRes = compareCutoff("1", "EM", { studentCutoff: minMark + 0.5, category: "OC", route: "GA", year: 2025 });
  assert.equal(posRes.status, "AVAILABLE");
  assert.equal(posRes.delta, 0.5);
  assert.equal(posRes.deltaSign, "POSITIVE");
  assert.match(posRes.explanation.en, /\+0\.50 marks above/);
  assert.match(posRes.explanation.ta, /\+0\.50 மதிப்பெண்கள் அதிகமாக/);

  // B. Delta = 0 (0.00)
  const zeroRes = compareCutoff("1", "EM", { studentCutoff: minMark, category: "OC", route: "GA", year: 2025 });
  assert.equal(zeroRes.status, "AVAILABLE");
  assert.equal(zeroRes.delta, 0.0);
  assert.equal(zeroRes.deltaSign, "ZERO");
  assert.match(zeroRes.explanation.en, /Equality reflects numerical identity only and does not imply admission entitlement/);
  assert.match(zeroRes.explanation.ta, /இது மதிப்பெண் சமநிலை மட்டுமே; சேர்க்கை உரிமையைக் குறிக்காது/);

  // C. Delta < 0 (-4.00)
  const negRes = compareCutoff("1", "EM", { studentCutoff: minMark - 4.0, category: "OC", route: "GA", year: 2025 });
  assert.equal(negRes.status, "AVAILABLE");
  assert.equal(negRes.delta, -4.0);
  assert.equal(negRes.deltaSign, "NEGATIVE");
  assert.match(negRes.explanation.en, /-4\.00 marks below/);
  assert.match(negRes.explanation.ta, /-4\.00 மதிப்பெண்கள் குறைவாக/);
});

test("T12 / Scenario 2: Missing Cutoff (Strict null delta, explicit status)", () => {
  const res = compareCutoff("1", "CS", { category: "OC", route: "GA", year: 2025 });
  assert.equal(res.status, "NO_CUTOFF_PROVIDED");
  assert.equal(res.delta, null);
  assert.equal(res.studentCutoff, null);
  assert.equal(res.historicalMinMark, 200.0);
  assert.match(res.explanation.en, /Provide your cutoff mark above to see the numerical difference/);
  assert.match(res.explanation.ta, /எண்சார் வேறுபாட்டை \(Delta\) காண, மேலே உங்கள் கட்-ஆப் மதிப்பெண்ணை உள்ளிடவும்/);
});

test("T12 / Scenario 3: 7.5% Govt School Quota Isolation (Zero cross-mixing)", () => {
  const gaObs = getHistoricalObservations("1", "CS", 2025, "GA", "BC");
  const govtObs = getHistoricalObservations("1", "CS", 2025, "7.5", "BC");

  assert.ok(gaObs.length > 0);
  assert.ok(govtObs.length > 0);
  assert.notEqual(gaObs[0]!.source.url, govtObs[0]!.source.url);
  assert.match(gaObs[0]!.source.title, /GENERAL ACADEMIC/);
  assert.match(govtObs[0]!.source.title, /7\.5%/);

  const gaRes = compareCutoff("1", "CS", { studentCutoff: 196.0, category: "BC", route: "GA" });
  const govtRes = compareCutoff("1", "CS", { studentCutoff: 196.0, category: "BC", route: "7.5" });
  assert.equal(gaRes.route, "GA");
  assert.equal(govtRes.route, "7.5");
  assert.notEqual(gaRes.sourceUrl, govtRes.sourceUrl);
});

test("T12 / Scenario 4: Empty Shortlist (Friendly bilingual guidance)", () => {
  const enHtml = render("view=shortlist&lang=en");
  assert.match(enHtml, /Your shortlist is empty/);
  assert.match(enHtml, /Browse colleges/);
  assert.match(enHtml, /Browse all programmes/);

  const taHtml = render("view=shortlist&lang=ta");
  assert.match(taHtml, /உங்கள் விருப்பப்பட்டியல் காலியாக உள்ளது/);
  assert.match(taHtml, /கல்லூரிகளைப் பார்/);
  assert.match(taHtml, /எல்லாப் படிப்புகளையும் பார்/);
});

test("T12 / Scenario 5: Shortlist Preference Reordering (Strict user control Choice 1..N)", () => {
  // Render shortlist with two items: 1~CS and 1~CE
  const html = render("view=shortlist&shortlist=1%7ECS&shortlist=1%7ECE&lang=en");
  assert.match(html, /Choice 1/);
  assert.match(html, /Choice 2/);
  assert.match(html, /Move choice 1 down/);
  assert.match(html, /Move choice 2 up/);
  assert.match(html, /Remove choice 1/);
  assert.match(html, /Remove choice 2/);
});

test("T12 / Scenario 6: Shared-Device Warning & 30-Day Storage Notice", () => {
  const htmlEn = render("view=shortlist&lang=en");
  assert.match(htmlEn, /Shared-device warning/);
  assert.match(htmlEn, /browsing centre, school, or college/);
  assert.match(htmlEn, /Clear entire shortlist/);
  assert.match(htmlEn, /Save on this device for up to 30 days/);
  assert.match(htmlEn, /Strictly zero marks, ranks, community quotas, or personal details are stored/);

  const htmlTa = render("view=shortlist&lang=ta");
  assert.match(htmlTa, /பகிரப்பட்ட கணினி எச்சரிக்கை/);
  assert.match(htmlTa, /பிரவுசிங் மையக் கணினியைப் பயன்படுத்தினால்/);
  assert.match(htmlTa, /விருப்பப்பட்டியலை முழுமையாக அழி/);
});

test("T12 / Scenario 7: Counselling Process Guidance (Single-window priority, 5 confirmation choices, next steps)", () => {
  const htmlEn = render("view=shortlist&lang=en");
  // Single-window logic
  assert.match(htmlEn, /How Does TNEA Single-Window Allotment Work\?/);
  assert.match(htmlEn, /evaluates your choice list strictly top-to-bottom/);
  // 5 confirmation options
  assert.match(htmlEn, /Accept and Join/);
  assert.match(htmlEn, /Accept and Upward Movement/);
  assert.match(htmlEn, /Decline and Upward Movement/);
  assert.match(htmlEn, /Decline and Next Round/);
  assert.match(htmlEn, /Quit \/ Decline and Quit/);
  // Next steps
  assert.match(htmlEn, /Certificate Verification/);
  assert.match(htmlEn, /7\.5% government school quota students are fully exempt/);
  assert.match(htmlEn, /Provisional Allotment Order/);
  assert.match(htmlEn, /College Reporting/);

  const htmlTa = render("view=shortlist&lang=ta");
  assert.match(htmlTa, /TNEA ஒற்றைச் சாளர முறை எவ்வாறு செயல்படுகிறது\?/);
  assert.match(htmlTa, /மேலிருந்து கீழாக \(விருப்பம் 1, விருப்பம் 2, விருப்பம் 3\.\.\.\) ஒவ்வொன்றாக மட்டுமே பரிசீலிக்கும்/);
  assert.match(htmlTa, /ஏற்றுக்கொண்டு சேர்கிறேன்/);
  assert.match(htmlTa, /ஏற்றுக்கொண்டு மேல்நோக்கி நகர்வு/);
  assert.match(htmlTa, /நிராகரித்து மேல்நோக்கி நகர்வு/);
  assert.match(htmlTa, /நிராகரித்து அடுத்த சுற்றுக்குச் செல்கிறேன்/);
  assert.match(htmlTa, /விலகுகிறேன்/);
});

test("T12 / Scenario 8: College 1516 Governance Hold (HELD_NEEDS_REVIEW fail-closed)", () => {
  const compRes = compareCutoff("1516", "CS", { studentCutoff: 192.0, category: "OC", route: "GA" });
  assert.equal(compRes.status, "HELD_NEEDS_REVIEW");
  assert.equal(compRes.delta, null);
  assert.equal(compRes.historicalMinMark, null);
  assert.match(compRes.explanation.en, /College 1516 is currently held under review \(booklet intake verification required\)/);
  assert.match(compRes.explanation.ta, /கல்லூரி 1516-ன் வரலாற்றுத் தரவு தற்காலிகமாக நிறுத்தி வைக்கப்பட்டுள்ளது/);

  // In UI detail view
  const detailHtml = render("view=detail&college=1516&programme=CS&lang=en&cat=OC");
  assert.match(detailHtml, /HELD_NEEDS_REVIEW/);
  assert.match(detailHtml, /College 1516 is currently held under review/);
});

test("T12 / Scenario 9: Failure Recovery & Unknown Bucket (Safe classification, no crash)", () => {
  // A. Non-existent programme
  const unknownProg = compareCutoff("1", "NON_EXISTENT_XYZ", { studentCutoff: 190.0, category: "OC", route: "GA" });
  assert.equal(unknownProg.status, "UNKNOWN");
  assert.equal(unknownProg.delta, null);
  assert.match(unknownProg.explanation.en, /No provisional allotment was reported for this exact college, programme/);

  // B. Invalid cutoff (< 0)
  const invalidCutoff = compareCutoff("1", "CS", { studentCutoff: -10.0, category: "OC", route: "GA" });
  assert.equal(invalidCutoff.status, "INVALID_INPUT");
  assert.equal(invalidCutoff.delta, null);

  // C. Missing category
  const missingCat = compareCutoff("1", "CS", { studentCutoff: 190.0 });
  assert.equal(missingCat.status, "INVALID_INPUT");
  assert.equal(missingCat.delta, null);
});

test("T12 / Scenario 10: Print / Save as PDF Stylesheet (@media print)", () => {
  const html = render("view=shortlist&shortlist=1%7ECS&lang=en");
  assert.match(html, /@media print/);
  assert.match(html, /\.site-header,\.pilot-top-bar,\.notice,\.breadcrumbs,\.back-nav,\.storage-notice,\.choice-controls,\.shortlist-actions-bar,\.counselling-guidance,\.journey-return,\.action,button\{display:none!important\}/);
  assert.match(html, /\.choice-badge\{background:#000!important;color:#fff!important\}/);
  assert.match(html, /window\.print\(\)/);
});

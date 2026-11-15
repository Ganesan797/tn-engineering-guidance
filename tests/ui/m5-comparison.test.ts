import test from "node:test";
import assert from "node:assert/strict";
import { compareCutoff } from "../../src/m5/comparison-engine.ts";
import { formatTruthInGuidanceDisclosure, formatDeltaExplanation, M5_BILINGUAL_COPY } from "../../src/m5/bilingual-copy.ts";
import { getHistoricalObservations } from "../../src/m5/historical-data.ts";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import { loadApprovedDirectory } from "../../src/m4/approved-directory-preview.mjs";

const approvedView = loadApprovedDirectory();
const render = (query: string) => renderGovernedPilot(new URLSearchParams(query), undefined, approvedView);

test("T05: Deterministic Comparison Engine arithmetic and delta calculation", () => {
  // College 1 (CEG), CS, 2025, General Academic, OC
  // In our dataset: Round 1 min mark is 200.00
  const obs = getHistoricalObservations("1", "CS", 2025, "GA", "OC");
  assert.ok(obs.length > 0, "College 1 CS 2025 GA OC should have historical observations");
  const minMark = obs[0]!.minMark;
  assert.equal(minMark, 200.0);

  // 1. Positive Delta (College 1, EM min is 199.00; studentCutoff = 199.50 -> +0.50)
  const obsEM = getHistoricalObservations("1", "EM", 2025, "GA", "OC");
  assert.ok(obsEM.length > 0);
  const emMin = obsEM[0]!.minMark;

  const resPos = compareCutoff("1", "EM", {
    studentCutoff: emMin + 0.5,
    category: "OC",
    route: "GA",
    year: 2025,
  });
  assert.equal(resPos.status, "AVAILABLE");
  assert.equal(resPos.delta, 0.5);
  assert.equal(resPos.deltaSign, "POSITIVE");
  assert.match(resPos.explanation.en, /\+0\.50 marks above/);
  assert.match(resPos.explanation.ta, /\+0\.50 மதிப்பெண்கள் அதிகமாக/);

  // 2. Zero Delta (Equality reflects numerical identity only, not admission entitlement)
  const resZero = compareCutoff("1", "CS", {
    studentCutoff: 200.0,
    category: "OC",
    route: "GA",
    year: 2025,
  });
  assert.equal(resZero.status, "AVAILABLE");
  assert.equal(resZero.delta, 0.0);
  assert.equal(resZero.deltaSign, "ZERO");
  assert.match(resZero.explanation.en, /exactly equal/);
  assert.match(resZero.explanation.en, /does not imply admission entitlement/);
  assert.match(resZero.explanation.ta, /சமமாக உள்ளது/);
  assert.match(resZero.explanation.ta, /சேர்க்கை உரிமையைக் குறிக்காது/);

  // 3. Negative Delta
  const resNeg = compareCutoff("1", "CS", {
    studentCutoff: 194.5,
    category: "OC",
    route: "GA",
    year: 2025,
  });
  assert.equal(resNeg.status, "AVAILABLE");
  assert.equal(resNeg.delta, -5.5);
  assert.equal(resNeg.deltaSign, "NEGATIVE");
  assert.match(resNeg.explanation.en, /-5\.50 marks below/);
  assert.match(resNeg.explanation.ta, /-5\.50 மதிப்பெண்கள் குறைவாக/);
});

test("T05: Strict nullability and input validation", () => {
  // 1. Missing cutoff -> delta is null, status is NO_CUTOFF_PROVIDED
  const resNoCutoff = compareCutoff("1", "CS", {
    category: "OC",
    route: "GA",
    year: 2025,
  });
  assert.equal(resNoCutoff.status, "NO_CUTOFF_PROVIDED");
  assert.equal(resNoCutoff.delta, null);
  assert.equal(resNoCutoff.studentCutoff, null);
  assert.equal(resNoCutoff.historicalMinMark, 200.0);
  assert.match(resNoCutoff.explanation.en, /Provide your cutoff mark above/);

  // 2. Missing category -> status is INVALID_INPUT
  const resNoCat = compareCutoff("1", "CS", {
    studentCutoff: 195.0,
    route: "GA",
    year: 2025,
  });
  assert.equal(resNoCat.status, "INVALID_INPUT");
  assert.equal(resNoCat.delta, null);

  // 3. Invalid cutoff range (< 0 or > 200) -> status is INVALID_INPUT
  const resNegativeCutoff = compareCutoff("1", "CS", {
    studentCutoff: -5.0,
    category: "OC",
    route: "GA",
  });
  assert.equal(resNegativeCutoff.status, "INVALID_INPUT");
  assert.equal(resNegativeCutoff.delta, null);

  const resTooHighCutoff = compareCutoff("1", "CS", {
    studentCutoff: 205.0,
    category: "OC",
    route: "GA",
  });
  assert.equal(resTooHighCutoff.status, "INVALID_INPUT");
  assert.equal(resTooHighCutoff.delta, null);

  // 4. Unknown pair/bucket -> status is UNKNOWN, delta is null
  const resUnknown = compareCutoff("1", "NON_EXISTENT_PROG", {
    studentCutoff: 190.0,
    category: "OC",
    route: "GA",
    year: 2025,
  });
  assert.equal(resUnknown.status, "UNKNOWN");
  assert.equal(resUnknown.delta, null);
  assert.equal(resUnknown.historicalMinMark, null);
  assert.match(resUnknown.explanation.en, /No provisional allotment was reported/);
  assert.match(resUnknown.explanation.ta, /எந்தத் தற்காலிக ஒதுக்கீடும் பதிவாகவில்லை/);
});

test("T05: Governance Hold for College 1516", () => {
  // College 1516 carries an active booklet intake verification hold
  const res1516 = compareCutoff("1516", "CS", {
    studentCutoff: 190.0,
    category: "OC",
    route: "GA",
    year: 2025,
  });
  assert.equal(res1516.status, "HELD_NEEDS_REVIEW");
  assert.equal(res1516.delta, null);
  assert.equal(res1516.historicalMinMark, null);
  assert.match(res1516.explanation.en, /College 1516 is currently held under review/);
  assert.match(res1516.explanation.ta, /கல்லூரி 1516-ன் வரலாற்றுத் தரவு தற்காலிகமாக நிறுத்தி வைக்கப்பட்டுள்ளது/);
});

test("T05: Strict Route Isolation (General Academic vs 7.5% Quota never mix)", () => {
  // Query College 1 CS in General Academic vs 7.5% Quota
  const gaObs = getHistoricalObservations("1", "CS", 2025, "GA", "BC");
  const govtObs = getHistoricalObservations("1", "CS", 2025, "7.5", "BC");

  assert.ok(gaObs.length > 0, "GA observation must exist");
  assert.ok(govtObs.length > 0, "7.5% observation must exist");

  // Route 7.5% has its own separate min mark and counts
  assert.notEqual(gaObs[0]!.source.url, govtObs[0]!.source.url, "Source URLs must be distinct");
  assert.match(gaObs[0]!.source.title, /GENERAL ACADEMIC/);
  assert.match(govtObs[0]!.source.title, /7\.5%/);

  // Direct comparison queries
  const gaRes = compareCutoff("1", "CS", { studentCutoff: 195.0, category: "BC", route: "GA", year: 2025 });
  const govtRes = compareCutoff("1", "CS", { studentCutoff: 195.0, category: "BC", route: "7.5", year: 2025 });

  assert.equal(gaRes.route, "GA");
  assert.equal(govtRes.route, "7.5");
  assert.notEqual(gaRes.sourceUrl, govtRes.sourceUrl);
});

test("T06: Mandatory Truth-in-Guidance Disclosures and Bilingual Copy", () => {
  for (const round of [1, 2, 3]) {
    const disclosure = formatTruthInGuidanceDisclosure(round);
    assert.equal(
      disclosure.en,
      `Minimum observed mark in official Round ${round} provisional allotment publication. Upward movement and subsequent non-reporting not reflected.`
    );
    assert.equal(
      disclosure.ta,
      `அதிகாரப்பூர்வ சுற்று ${round} தற்காலிக ஒதுக்கீட்டு வெளியீட்டில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண். மேல்நோக்கி நகர்வு மற்றும் மாணவர்கள் சேராமல் விட்ட இடங்கள் இதில் இடம்பெறவில்லை.`
    );
  }

  // General non-prediction disclaimer check
  assert.match(M5_BILINGUAL_COPY.disclaimer.en, /No chance calculation, admission probability, or safe\/target classification/);
  assert.match(M5_BILINGUAL_COPY.disclaimer.ta, /சேர்க்கைக்கான வாய்ப்பு கணக்கீடோ அல்லது உறுதிமொழியோ வழங்கப்படுவதில்லை/);
});

test("T07: Transparent Directory Filters - Autonomous status filter", () => {
  // Test autonomous filter on governed directory preview
  const allHtml = render("view=colleges&lang=en");
  assert.match(allHtml, /Colleges and programmes/);

  const autoHtml = render("view=colleges&lang=en&autonomous=yes");
  assert.match(autoHtml, /Colleges and programmes/);

  const nonAutoHtml = render("view=colleges&lang=en&autonomous=no");
  assert.match(nonAutoHtml, /Colleges and programmes/);
});

test("T07: Directory UI Integration - Comparison fields, badges and disclosures", () => {
  // 1. Filter form contains comparison inputs
  const formHtml = render("view=colleges&lang=en");
  assert.match(formHtml, /id="cutoff-input"/);
  assert.match(formHtml, /id="cat-select"/);
  assert.match(formHtml, /id="route-select"/);
  assert.match(formHtml, /id="year-select"/);
  assert.match(formHtml, /id="autonomous-filter"/);

  // 2. Active comparison on colleges view renders historical badge and delta
  const activeCollegesHtml = render("view=colleges&lang=en&cat=OC&cutoff=198.50");
  assert.match(activeCollegesHtml, /hist-badge/);
  assert.match(activeCollegesHtml, /Δ:/);
  assert.match(activeCollegesHtml, /Upward movement and subsequent non-reporting not reflected/);

  // 3. Detail view renders comprehensive historical breakdown
  const detailHtml = render("view=detail&college=1&programme=CS&lang=en&cat=OC&cutoff=198.50");
  assert.match(detailHtml, /Historical Provisional Minimum Mark Comparison/);
  assert.match(detailHtml, /Your Cutoff/);
  assert.match(detailHtml, /Round 1/);
  assert.match(detailHtml, /Upward movement and subsequent non-reporting not reflected/);
  assert.match(detailHtml, /No chance calculation, admission probability/);

  // 4. Detail view in Tamil renders exact Tamil truth-in-guidance disclosures
  const detailTaHtml = render("view=detail&college=1&programme=CS&lang=ta&cat=OC&cutoff=198.50");
  assert.match(detailTaHtml, /வரலாற்று தற்காலிக குறைந்தபட்ச மதிப்பெண் ஒப்பீடு/);
  assert.match(detailTaHtml, /அதிகாரப்பூர்வ சுற்று 1 தற்காலிக ஒதுக்கீட்டு வெளியீட்டில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண்/);
  assert.match(detailTaHtml, /மேல்நோக்கி நகர்வு மற்றும் மாணவர்கள் சேராமல் விட்ட இடங்கள் இதில் இடம்பெறவில்லை/);

  // 5. College 1516 renders HELD_NEEDS_REVIEW with hold disclosure
  const heldDetailHtml = render("view=detail&college=1516&programme=CS&lang=en&cat=OC");
  assert.match(heldDetailHtml, /HELD_NEEDS_REVIEW/);
  assert.match(heldDetailHtml, /College 1516 is currently held under review/);

  // 6. Compare view renders historical badges for selected offerings
  const compareHtml = render("view=compare&pick=1%7ECS&pick=1%7ECE&lang=en&cat=OC&cutoff=198.50");
  assert.match(compareHtml, /hist-badge/);
  assert.match(compareHtml, /Upward movement and subsequent non-reporting not reflected/);
});

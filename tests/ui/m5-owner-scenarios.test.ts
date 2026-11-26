import test from "node:test";
import assert from "node:assert/strict";
import {
  compareOffering,
  createSyntheticRepository,
  getCounsellingGuidance,
  HISTORICAL_OBSERVATIONS,
  type DerivedHistoricalObservation,
} from "../../src/m5/index.ts";
import { renderM5GuidancePage } from "../../src/ui/m5-guidance-view.ts";

test("Owner Scenario 1: High Scorer (198.50) — General Academic SC at KCT", () => {
  // Test comparison engine mechanics using synthetic test fixture
  const syntheticRepo = createSyntheticRepository([
    {
      candidateId: "SYNTH-KCT-01",
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      sourceTitle: "ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      collegeCode: "2712",
      programmeCode: "CS",
      allottedCategory: "SC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      derivedMinimumMark: 185.5,
      allotmentCount: 4,
      locator: "Synthetic Fixture Doc, p. 12",
      isHeld: false,
      holdNotice: null,
    },
  ]);

  const resultKCT = compareOffering(
    {
      studentCutoff: 198.5,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "SC",
      collegeCode: "2712",
      programmeCode: "CS",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(resultKCT.status, "AVAILABLE");
  assert.equal(resultKCT.delta, 13.0); // 198.5 - 185.5 = +13.0
  assert.equal(resultKCT.historicalMin, 185.5);
  assert.equal(resultKCT.metricType, "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK");
  assert.equal(resultKCT.officialClosingValue, null);

  // Runtime UI rendering check: KCT is present in directory, shortlistable, with no predictive classes
  const html = renderM5GuidancePage(new URLSearchParams({ q: "2712" }));
  assert.ok(html.includes("Kumaraguru College of Technology"));
  assert.ok(html.includes("2712~CS"));
  assert.ok(!html.includes("delta-positive"));
});

test("Owner Scenario 2: Government School 7.5% Quota (182.00) — Quota Isolation & Applicable Fee Support", () => {
  const syntheticRepo = createSyntheticRepository([
    {
      candidateId: "SYNTH-MEPCO-75",
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      sourceTitle: "ROUND 1 - 7.5% PROVISIONAL ALLOTMENT LIST",
      round: "ROUND_1",
      quota: "GOVT_SCHOOL_7_5",
      collegeCode: "4960",
      programmeCode: "CS",
      allottedCategory: "BC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      derivedMinimumMark: 181.5,
      allotmentCount: 2,
      locator: "Synthetic 7.5% Doc, p. 3",
      isHeld: false,
      holdNotice: null,
    },
  ]);

  const result = compareOffering(
    {
      studentCutoff: 182.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_1",
      quota: "GOVT_SCHOOL_7_5",
      community: "BC",
      collegeCode: "4960",
      programmeCode: "CS",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(result.quota, "GOVT_SCHOOL_7_5");
  assert.equal(result.historicalMin, 181.5);
  assert.equal(result.delta, 0.5); // 182.0 - 181.5 = +0.5

  const html = renderM5GuidancePage(
    new URLSearchParams({
      tab: "counselling",
      lang: "ta",
    })
  );
  // Verify 7.5% statutory fee funding notice is present in Tamil counselling guidance
  assert.ok(html.includes("தமிழ்நாடு சட்டம் 14/2021-ன் படி"));
  assert.ok(html.includes("G.O. (Ms.) No. 221"));
  assert.ok(html.includes("கல்விக் கட்டணம், விடுதிக் கட்டணம் மற்றும் மேம்பாட்டுக் கட்டணம்"));
  assert.ok(html.includes("அரசுப் பள்ளிப் பயில் விவரங்களுக்கான சான்றை"));
});

test("Owner Scenario 3: Reserved Category Student (165.00) — SC Category at GCT Coimbatore", () => {
  const syntheticRepo = createSyntheticRepository([
    {
      candidateId: "SYNTH-GCT-SC",
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      sourceTitle: "Official Round 2 Allotment",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      collegeCode: "2005",
      programmeCode: "ME",
      allottedCategory: "SC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      derivedMinimumMark: 160.0,
      allotmentCount: 8,
      locator: "Doc p. 45",
      isHeld: false,
      holdNotice: null,
    },
  ]);

  const resultGCT = compareOffering(
    {
      studentCutoff: 165.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "SC",
      collegeCode: "2005",
      programmeCode: "ME",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(resultGCT.status, "AVAILABLE");
  assert.equal(resultGCT.community, "SC");
  assert.equal(resultGCT.historicalMin, 160.0);
  assert.equal(resultGCT.delta, 5.0);
});

test("Owner Scenario 4: Moderate Cutoff Student (155.00) — MBC Category at Constituent Colleges", () => {
  const syntheticRepo = createSyntheticRepository([
    {
      candidateId: "SYNTH-UCE-MBC",
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      sourceTitle: "Official Round 2 Allotment",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      collegeCode: "1014",
      programmeCode: "CE",
      allottedCategory: "MBC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      derivedMinimumMark: 147.5,
      allotmentCount: 2,
      locator: "Doc p. 80",
      isHeld: false,
      holdNotice: null,
    },
  ]);

  const resultUCE = compareOffering(
    {
      studentCutoff: 155.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "MBC",
      collegeCode: "1014",
      programmeCode: "CE",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(resultUCE.status, "AVAILABLE");
  assert.equal(resultUCE.collegeCode, "1014");
  assert.equal(resultUCE.community, "MBC");
  assert.equal(resultUCE.delta, 7.5); // 155.0 - 147.5 = +7.5
});

test("Owner Scenario 5: Low Cutoff Student (120.00) — BC Category & Sequential Preference Ordering", () => {
  const syntheticRepo = createSyntheticRepository([
    {
      candidateId: "SYNTH-LOW-BC",
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      sourceTitle: "Synthetic Round 3 General Academic Publication",
      round: "ROUND_3",
      quota: "GENERAL_ACADEMIC",
      collegeCode: "3019",
      programmeCode: "CE",
      allottedCategory: "BC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      derivedMinimumMark: 130.0,
      allotmentCount: 3,
      locator: "Synthetic fixture, p. 1",
      isHeld: false,
      holdNotice: null,
    },
  ]);
  const result = compareOffering(
    {
      studentCutoff: 120.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_3",
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      collegeCode: "3019",
      programmeCode: "CE",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(result.status, "AVAILABLE");
  assert.equal(result.studentCutoff, 120.0);
  assert.equal(result.delta, -10.0);
  assert.equal(result.officialClosingValue, null);
  assert.equal("admissionProbability" in result, false);
  assert.equal("preferenceTier" in result, false);

  // Guidance remains neutral and does not turn the factual negative delta into a prediction.
  const guidance = getCounsellingGuidance("en");
  assert.ok(guidance.sections[2].title.includes("Ordering Choices by Genuine Preference"));
  assert.ok(!JSON.stringify(guidance).includes("Safe Anchors"));
  assert.ok(!JSON.stringify(guidance).includes("3-Tier Strategy"));
  assert.ok(!JSON.stringify(guidance).includes("automatically locks"));
});

test("Owner Scenario 6: Governance Hold Case — College 1516 (Thanthai Periyar GIT, Vellore)", () => {
  const result = compareOffering({
    studentCutoff: 190.0,
    quota: "GENERAL_ACADEMIC",
    community: "OC",
    collegeCode: "1516",
    programmeCode: "ME",
  });

  assert.equal(result.status, "HELD_NEEDS_REVIEW");
  assert.equal(result.evidenceSemantics, "HELD_PREVIOUS_YEAR_HEADER");
  assert.equal(result.delta, null);
  assert.equal(result.historicalMin, null);
  assert.equal(result.isHeld, true);
  assert.ok(result.holdNotice?.includes("Previous year data"));

  const html = renderM5GuidancePage(
    new URLSearchParams({ q: "1516" }),
    { studentCutoff: 190.0, communitySelected: true }
  );
  assert.ok(html.includes("held-badge"));
  assert.ok(html.includes("Booklet carries &#39;(Previous year data)&#39; header"));
});

test("Owner Scenario 7: Marks-Free Browsing — Student views directory without entering cutoff", () => {
  // Marks-free browsing: renders college without error, all offerings discoverable
  const html1014 = renderM5GuidancePage(new URLSearchParams({ q: "1014" }));
  assert.ok(html1014.includes("University College of Engineering, Tindivanam"));
  assert.ok(!html1014.includes("NaN"));

  const html2005 = renderM5GuidancePage(new URLSearchParams({ q: "2005" }));
  assert.ok(html2005.includes("Government College of Technology, Coimbatore"));
  assert.ok(!html2005.includes("NaN"));
});

test("Owner Scenario 8: Zero Approved Runtime History — Offering Retained and Shortlistable", () => {
  const counts = HISTORICAL_OBSERVATIONS.getOfferingsCount();
  assert.equal(HISTORICAL_OBSERVATIONS.getAll().length, 17676);
  assert.deepEqual(counts, { total: 1249, withHistory: 1249, missingHistory: 0 });

  // Synthetic repository verifies zero-history behavior
  const emptyRepo = createSyntheticRepository([]);
  assert.equal(emptyRepo.getAll().length, 0);
  assert.deepEqual(emptyRepo.getOfferingsCount(), { total: 1249, withHistory: 0, missingHistory: 1249 });

  const result = compareOffering({
    studentCutoff: 175.0,
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    collegeCode: "5022",
    programmeCode: "IT",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
  });

  assert.equal(result.status, "NO_HISTORICAL_DATA");
  assert.equal(result.evidenceSemantics, "NOT_AVAILABLE_FOR_COMPARISON");
  assert.equal(result.historicalMin, null);
  assert.equal(result.delta, null);

  // In UI, 5022 IT must still be listed and shortlistable under 2025
  const html = renderM5GuidancePage(new URLSearchParams({ q: "5022", year: "2025" }));
  assert.ok(html.includes("5022"));
  assert.ok(html.includes("IT"));
  assert.ok(html.includes("Not available for comparison"));
  assert.ok(html.includes("5022~IT")); // Shortlist action exists
});

test("Owner Scenario 9: Out-of-Range or Malformed Input (205.00 / Negative)", () => {
  const syntheticRepo = createSyntheticRepository([
    {
      candidateId: "SYNTH-INVALID-INPUT",
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      sourceTitle: "Synthetic Round 2 General Academic Publication",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      collegeCode: "4960",
      programmeCode: "CS",
      allottedCategory: "MBC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      derivedMinimumMark: 150.0,
      allotmentCount: 4,
      locator: "Synthetic fixture, p. 2",
      isHeld: false,
      holdNotice: null,
    },
  ]);
  const exactRequest = {
    year: 2025 as const,
    stage: "PROVISIONAL_ALLOTMENT" as const,
    round: "ROUND_2" as const,
    quota: "GENERAL_ACADEMIC" as const,
    community: "MBC" as const,
    collegeCode: "4960",
    programmeCode: "CS",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK" as const,
  };

  for (const invalidCutoff of [205.0, -10.0, Number.NaN, "malformed" as unknown as number]) {
    const result = compareOffering(
      { ...exactRequest, studentCutoff: invalidCutoff },
      syntheticRepo
    );
    assert.equal(result.status, "STUDENT_CUTOFF_MISSING");
    assert.equal(result.historicalMin, 150.0, "Exact fixture evidence must be matched before input validation");
    assert.equal(result.studentCutoff, null);
    assert.equal(result.delta, null);
  }
});

test("Owner Scenario 10: Complete Tamil Journey — Bilingual Parity & Localized Disclosures", () => {
  const htmlStage1 = renderM5GuidancePage(new URLSearchParams({ lang: "ta" }));
  assert.ok(htmlStage1.includes("கடந்த ஆண்டு கட்-ஆஃப் ஒப்பீடு (தற்காலிக ஒதுக்கீடு)"));
  assert.ok(htmlStage1.includes("அதிகாரப்பூர்வ வெளிப்படைத்தன்மை அறிவிப்பு:"));
  assert.ok(htmlStage1.includes("சுற்று 1"));

  const html = renderM5GuidancePage(
    new URLSearchParams({ lang: "ta", q: "4960" })
  );

  // Must render Tamil title and compact results summary
  assert.ok(html.includes("கடந்த ஆண்டு கட்-ஆஃப் ஒப்பீடு (தற்காலிக ஒதுக்கீடு)"));
  assert.ok(html.includes("சுற்று 1"));
  assert.ok(html.includes("கல்லூரிகள்"));
});

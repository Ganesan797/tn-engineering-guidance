import test from "node:test";
import assert from "node:assert/strict";
import {
  HISTORICAL_OBSERVATIONS,
  compareOffering,
  createSyntheticRepository,
  getComparisonCopy,
  type DerivedHistoricalObservation,
} from "../../src/m5/index.ts";

test("M5 Runtime Historical Data: Verified 4,332 D5 candidates loaded at runtime (Gate A Cleared)", () => {
  // Verify that the runtime repository contains exactly 4,332 verified observations
  const allObs = HISTORICAL_OBSERVATIONS.getAll();
  assert.equal(allObs.length, 4332, "Must contain exactly 4,332 verified Gate A observations");

  // All 555 governed options must remain discoverable
  const offerings = HISTORICAL_OBSERVATIONS.getAllGovernedOfferings();
  assert.equal(offerings.length, 555, "Must contain exactly 555 governed offerings across 55 colleges");

  // Counts accounting: 536 with observed allotments in evaluated rounds, 19 without allotments
  const counts = HISTORICAL_OBSERVATIONS.getOfferingsCount();
  assert.equal(counts.total, 555);
  assert.equal(counts.withHistory, 536, "Approved historical data available must be 536 offerings");
  assert.equal(counts.missingHistory, 19);

  // In runtime application, calling without explicit round fails closed (no implicit round selection)
  const runtimeResNoRound = compareOffering({
    studentCutoff: 185.0,
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    collegeCode: "4960",
    programmeCode: "CS",
  });
  assert.equal(runtimeResNoRound.status, "NO_HISTORICAL_DATA");
  assert.equal(runtimeResNoRound.evidenceSemantics, "NOT_AVAILABLE_FOR_COMPARISON");
  assert.equal(runtimeResNoRound.historicalMin, null);
  assert.equal(runtimeResNoRound.delta, null);
  assert.equal(runtimeResNoRound.officialClosingValue, null);
  assert.equal(runtimeResNoRound.officialClosingValueStatus, "NOT_ESTABLISHED_BY_D5");

  // In runtime application, calling with explicit round, year, stage, and metricType returns verified observation
  const runtimeResWithRound = compareOffering({
    studentCutoff: 185.0,
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    community: "BC",
    collegeCode: "4960",
    programmeCode: "EC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
  });
  assert.equal(runtimeResWithRound.status, "AVAILABLE");
  assert.equal(runtimeResWithRound.evidenceSemantics, "DERIVED_PROVISIONAL_OBSERVATION");
  assert.equal(runtimeResWithRound.historicalMin, 176.5);
  assert.equal(runtimeResWithRound.delta, 8.5); // 185.0 - 176.5 = +8.5
  assert.equal(runtimeResWithRound.allotmentCount, 16);
  assert.ok(runtimeResWithRound.locator?.includes("Document 'ROUND 2 - GENERAL ACADEMIC"));
});

test("M5 Synthetic Comparison Engine: Exact Evidence Matching & Arithmetic Delta", () => {
  const syntheticFixture: DerivedHistoricalObservation = {
    candidateId: "SYNTH-001",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "4960",
    programmeCode: "EC",
    allottedCategory: "MBC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 174.0,
    allotmentCount: 12,
    locator: "Synthetic Fixture Doc, p. 10",
    isHeld: false,
    holdNotice: null,
  };

  const syntheticRepo = createSyntheticRepository([syntheticFixture]);

  // Exact match request with all required evidence identifiers
  const resultAbove = compareOffering(
    {
      studentCutoff: 180.5,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "MBC",
      collegeCode: "4960",
      programmeCode: "EC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(resultAbove.status, "AVAILABLE");
  assert.equal(resultAbove.evidenceSemantics, "DERIVED_PROVISIONAL_OBSERVATION");
  assert.equal(resultAbove.historicalMin, 174.0);
  assert.equal(resultAbove.delta, 6.5); // 180.5 - 174.0 = +6.5
  assert.equal(resultAbove.metricType, "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK");
  assert.equal(resultAbove.officialClosingValue, null);
  assert.equal(resultAbove.officialClosingValueStatus, "NOT_ESTABLISHED_BY_D5");

  // Arithmetic Delta below
  const resultBelow = compareOffering(
    {
      studentCutoff: 170.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "MBC",
      collegeCode: "4960",
      programmeCode: "EC",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(resultBelow.status, "AVAILABLE");
  assert.equal(resultBelow.historicalMin, 174.0);
  assert.equal(resultBelow.delta, -4.0); // 170.0 - 174.0 = -4.0
});

test("M5 Removal of Implicit Round Selection: Missing round or evidence identifiers fails closed", () => {
  const syntheticFixture: DerivedHistoricalObservation = {
    candidateId: "SYNTH-002",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "2006",
    programmeCode: "CS",
    allottedCategory: "OC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 195.0,
    allotmentCount: 5,
    locator: "Synthetic Fixture Doc, p. 2",
    isHeld: false,
    holdNotice: null,
  };

  const syntheticRepo = createSyntheticRepository([syntheticFixture]);

  // Request without explicit round: must fail closed (never implicitly select Round 2)
  const resultNoRound = compareOffering(
    {
      studentCutoff: 196.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      quota: "GENERAL_ACADEMIC",
      community: "OC",
      collegeCode: "2006",
      programmeCode: "CS",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );
  assert.equal(resultNoRound.status, "NO_HISTORICAL_DATA", "Must fail closed when round is omitted");
  assert.equal(resultNoRound.historicalMin, null);
  assert.equal(resultNoRound.delta, null);

  // Request without year: must fail closed
  const resultNoYear = compareOffering(
    {
      studentCutoff: 196.0,
      round: "ROUND_2",
      stage: "PROVISIONAL_ALLOTMENT",
      quota: "GENERAL_ACADEMIC",
      community: "OC",
      collegeCode: "2006",
      programmeCode: "CS",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );
  assert.equal(resultNoYear.status, "NO_HISTORICAL_DATA", "Must fail closed when year is omitted");
});

test("M5 Duplicate Handling: Conflicting duplicate records are rejected rather than overwritten", () => {
  const syntheticRepo = createSyntheticRepository();

  const obsA: DerivedHistoricalObservation = {
    candidateId: "DUP-001",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "Official Provisional Publication A",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "2712",
    programmeCode: "CS",
    allottedCategory: "BC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 185.0,
    allotmentCount: 10,
    locator: "Page 10",
    isHeld: false,
    holdNotice: null,
  };

  const regA = syntheticRepo.registerObservation(obsA);
  assert.equal(regA.success, true);
  assert.equal(regA.rejected, false);

  // Incoming conflicting duplicate with different mark
  const obsB: DerivedHistoricalObservation = {
    candidateId: "DUP-002",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "Official Provisional Publication B",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "2712",
    programmeCode: "CS",
    allottedCategory: "BC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 178.5, // CONFLICT!
    allotmentCount: 8,
    locator: "Page 15",
    isHeld: false,
    holdNotice: null,
  };

  const regB = syntheticRepo.registerObservation(obsB);
  assert.equal(regB.success, false, "Conflicting duplicate must be rejected");
  assert.equal(regB.rejected, true);
  assert.equal(regB.reason, "CONFLICTING_DUPLICATE_REJECTED");

  // Verify that the original mark was NOT overwritten
  const match = syntheticRepo.getExactObservation({
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "2712",
    programmeCode: "CS",
    allottedCategory: "BC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
  });
  assert.equal(match?.derivedMinimumMark, 185.0, "Original mark must be preserved unchanged");
});

test("M5 Strict Quota Isolation: GENERAL_ACADEMIC and GOVT_SCHOOL_7_5 do not leak across", () => {
  const obsGA: DerivedHistoricalObservation = {
    candidateId: "Q-001",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "GA Publication",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "4960",
    programmeCode: "CS",
    allottedCategory: "BC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 188.0,
    allotmentCount: 15,
    locator: "Doc 1",
    isHeld: false,
    holdNotice: null,
  };

  const obs75: DerivedHistoricalObservation = {
    candidateId: "Q-002",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "7.5% Publication",
    round: "ROUND_1",
    quota: "GOVT_SCHOOL_7_5",
    collegeCode: "4960",
    programmeCode: "CS",
    allottedCategory: "BC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 181.5,
    allotmentCount: 2,
    locator: "Doc 2",
    isHeld: false,
    holdNotice: null,
  };

  const syntheticRepo = createSyntheticRepository([obsGA, obs75]);

  // Request under 7.5% must not receive GA observation
  const result75 = compareOffering(
    {
      studentCutoff: 185.0,
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
  assert.equal(result75.quota, "GOVT_SCHOOL_7_5");
  assert.equal(result75.historicalMin, 181.5);
  assert.equal(result75.delta, 3.5);

  // Request under GA must not receive 7.5% observation
  const resultGA = compareOffering(
    {
      studentCutoff: 190.0,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      collegeCode: "4960",
      programmeCode: "CS",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );
  assert.equal(resultGA.quota, "GENERAL_ACADEMIC");
  assert.equal(resultGA.historicalMin, 188.0);
  assert.equal(resultGA.delta, 2.0);
});

test("M5 Strict Nullability: Missing student cutoff returns null delta", () => {
  const obs: DerivedHistoricalObservation = {
    candidateId: "NULL-001",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "Doc",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "2006",
    programmeCode: "ME",
    allottedCategory: "BC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 184.0,
    allotmentCount: 7,
    locator: "Doc p. 5",
    isHeld: false,
    holdNotice: null,
  };
  const syntheticRepo = createSyntheticRepository([obs]);

  const resultNull = compareOffering(
    {
      studentCutoff: null,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      collegeCode: "2006",
      programmeCode: "ME",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  assert.equal(resultNull.status, "STUDENT_CUTOFF_MISSING");
  assert.equal(resultNull.studentCutoff, null);
  assert.equal(resultNull.historicalMin, 184.0);
  assert.equal(resultNull.delta, null, "Delta must be null when student cutoff is null");
});

test("M5 College 1516 Governance Hold: Always returns HELD_NEEDS_REVIEW with null delta", () => {
  const resultHeld = compareOffering({
    studentCutoff: 190.0,
    quota: "GENERAL_ACADEMIC",
    community: "OC",
    collegeCode: "1516",
    programmeCode: "ME",
  });

  assert.equal(resultHeld.status, "HELD_NEEDS_REVIEW");
  assert.equal(resultHeld.evidenceSemantics, "HELD_PREVIOUS_YEAR_HEADER");
  assert.equal(resultHeld.isHeld, true);
  assert.equal(resultHeld.historicalMin, null);
  assert.equal(resultHeld.delta, null);
  assert.ok(resultHeld.holdNotice?.includes("Previous year data"));
});

test("M5 Zero-Prediction Invariant: No probability, safe/target/dream tags in outputs", () => {
  const obs: DerivedHistoricalObservation = {
    candidateId: "PRED-001",
    year: 2025,
    stage: "PROVISIONAL_ALLOTMENT",
    sourceTitle: "Doc",
    round: "ROUND_2",
    quota: "GENERAL_ACADEMIC",
    collegeCode: "1",
    programmeCode: "CS",
    allottedCategory: "OC",
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    derivedMinimumMark: 199.0,
    allotmentCount: 2,
    locator: "Doc p. 1",
    isHeld: false,
    holdNotice: null,
  };
  const syntheticRepo = createSyntheticRepository([obs]);

  const result = compareOffering(
    {
      studentCutoff: 199.5,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round: "ROUND_2",
      quota: "GENERAL_ACADEMIC",
      community: "OC",
      collegeCode: "1",
      programmeCode: "CS",
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    },
    syntheticRepo
  );

  const serialized = JSON.stringify(result).toLowerCase();
  assert.ok(!serialized.includes("probability"));
  assert.ok(!serialized.includes("chance"));
  assert.ok(!serialized.includes("safe"));
  assert.ok(!serialized.includes("target"));
  assert.ok(!serialized.includes("dream"));
  assert.ok(!serialized.includes("stretch"));
});

test("M5 Bilingual Copy & Truth-in-Guidance Disclosures: English and Tamil verbatim alignment", () => {
  const en = getComparisonCopy("en");
  const ta = getComparisonCopy("ta");

  assert.ok(en.nonPredictionDisclaimer.includes("do not guarantee future admission"));
  assert.ok(ta.nonPredictionDisclaimer.includes("எதிர்கால சேர்க்கையை உறுதிப்படுத்தாது"));

  assert.equal(en.formatDelta(5.25), "+5.25 vs observed minimum");
  assert.equal(en.formatDelta(-3.5), "-3.50 vs observed minimum");
  assert.equal(en.formatDelta(0.0), "0.00 (exact match with observed minimum)");

  assert.equal(ta.formatDelta(5.25), "+5.25 (கண்டறியப்பட்ட குறைந்தபட்சத்துடன் ஒப்பீடு)");
  assert.equal(ta.formatDelta(-3.5), "-3.50 (கண்டறியப்பட்ட குறைந்தபட்சத்துடன் ஒப்பீடு)");

  assert.ok(en.noDataNotice.includes("Not available for comparison"));
  assert.ok(ta.noDataNotice.includes("ஒப்பீட்டிற்கு கிடைக்கவில்லை"));
});

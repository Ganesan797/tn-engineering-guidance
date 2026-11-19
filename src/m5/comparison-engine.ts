import { HISTORICAL_OBSERVATIONS, HistoricalRepository } from "./historical-data.ts";
import type {
  ComparisonRequest,
  ComparisonResult,
} from "./types.ts";

/**
 * Pure, deterministic comparison engine for Milestone M5.
 *
 * Invariants enforced:
 * 1. Delta formula: Delta = studentCutoff - historicalMin (strictly arithmetic).
 * 2. Exact match only: Evaluates against exact 8-dimensional evidence key
 *    (year, stage, round, quota, collegeCode, programmeCode, allottedCategory, metricType).
 * 3. Quota isolation: GENERAL_ACADEMIC and GOVT_SCHOOL_7_5 are completely segregated.
 * 4. Zero prediction: Zero probabilities, zero safe/target/dream buckets, zero admission guarantees.
 * 5. Strict nullability: Missing student cutoff or missing historical observation returns null delta.
 * 6. Implicit round selection removed: Fails closed if explicit round or evidence identifiers are absent.
 * 7. College 1516: Always returns HELD_NEEDS_REVIEW with null delta.
 * 8. 555 Offering Coverage: Offerings without approved historical observations return NO_HISTORICAL_DATA / NOT_AVAILABLE_FOR_COMPARISON.
 */
export function compareOffering(
  request: ComparisonRequest,
  repository: HistoricalRepository = HISTORICAL_OBSERVATIONS
): ComparisonResult {
  const { studentCutoff, quota, community, collegeCode, programmeCode, year, stage, round, metricType } = request;

  // 1. Check if institution is held
  if (repository.isCollegeHeld(collegeCode)) {
    return {
      status: "HELD_NEEDS_REVIEW",
      evidenceSemantics: "HELD_PREVIOUS_YEAR_HEADER",
      studentCutoff: studentCutoff ?? null,
      historicalMin: null,
      delta: null,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      officialClosingValue: null,
      officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5",
      year: year ?? null,
      stage: stage ?? null,
      round: round ?? null,
      quota,
      community,
      collegeCode,
      programmeCode,
      allotmentCount: null,
      sourceTitle: null,
      locator: null,
      isHeld: true,
      holdNotice: repository.getCollegeHoldNotice(collegeCode),
    };
  }

  // 2. Strict Governed Offering Membership:
  // If offering does not belong to the approved governed catalogue, fail closed.
  if (!repository.getGovernedOffering(collegeCode, programmeCode)) {
    return {
      status: "NO_HISTORICAL_DATA",
      evidenceSemantics: "NOT_AVAILABLE_FOR_COMPARISON",
      studentCutoff: studentCutoff ?? null,
      historicalMin: null,
      delta: null,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      officialClosingValue: null,
      officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5",
      year: year ?? null,
      stage: stage ?? null,
      round: round ?? null,
      quota,
      community,
      collegeCode,
      programmeCode,
      allotmentCount: null,
      sourceTitle: null,
      locator: null,
      isHeld: false,
      holdNotice: null,
    };
  }

  // 2. Strict evidence identifier requirements & fail closed:
  // If year, stage, round, or metricType are absent, fail closed without implicit round selection.
  if (!year || !stage || !round || !metricType) {
    return {
      status: "NO_HISTORICAL_DATA",
      evidenceSemantics: "NOT_AVAILABLE_FOR_COMPARISON",
      studentCutoff: studentCutoff ?? null,
      historicalMin: null,
      delta: null,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      officialClosingValue: null,
      officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5",
      year: year ?? null,
      stage: stage ?? null,
      round: round ?? null,
      quota,
      community,
      collegeCode,
      programmeCode,
      allotmentCount: null,
      sourceTitle: null,
      locator: null,
      isHeld: false,
      holdNotice: null,
    };
  }

  // 3. Exact matching in repository (quota isolated, category exact)
  const observation = repository.getExactObservation({
    year,
    stage,
    round,
    quota,
    collegeCode,
    programmeCode,
    allottedCategory: community,
    metricType,
  });

  if (!observation) {
    return {
      status: "NO_HISTORICAL_DATA",
      evidenceSemantics: "NOT_AVAILABLE_FOR_COMPARISON",
      studentCutoff: studentCutoff ?? null,
      historicalMin: null,
      delta: null,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      officialClosingValue: null,
      officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5",
      year,
      stage,
      round,
      quota,
      community,
      collegeCode,
      programmeCode,
      allotmentCount: null,
      sourceTitle: null,
      locator: null,
      isHeld: false,
      holdNotice: null,
    };
  }

  // 4. Validate student cutoff
  if (
    studentCutoff === null ||
    studentCutoff === undefined ||
    typeof studentCutoff !== "number" ||
    isNaN(studentCutoff) ||
    studentCutoff < 0 ||
    studentCutoff > 200
  ) {
    return {
      status: "STUDENT_CUTOFF_MISSING",
      evidenceSemantics: "DERIVED_PROVISIONAL_OBSERVATION",
      studentCutoff: null,
      historicalMin: observation.derivedMinimumMark,
      delta: null,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      officialClosingValue: null,
      officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5",
      year: observation.year,
      stage: observation.stage,
      round: observation.round,
      quota,
      community,
      collegeCode,
      programmeCode,
      allotmentCount: observation.allotmentCount,
      sourceTitle: observation.sourceTitle,
      locator: observation.locator,
      isHeld: false,
      holdNotice: null,
    };
  }

  // 5. Calculate arithmetic delta: studentCutoff - historicalMin
  const rawDelta = studentCutoff - observation.derivedMinimumMark;
  const delta = Math.round(rawDelta * 1000) / 1000;

  return {
    status: "AVAILABLE",
    evidenceSemantics: "DERIVED_PROVISIONAL_OBSERVATION",
    studentCutoff,
    historicalMin: observation.derivedMinimumMark,
    delta,
    metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    officialClosingValue: null,
    officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5",
    year: observation.year,
    stage: observation.stage,
    round: observation.round,
    quota,
    community,
    collegeCode,
    programmeCode,
    allotmentCount: observation.allotmentCount,
    sourceTitle: observation.sourceTitle,
    locator: observation.locator,
    isHeld: false,
    holdNotice: null,
  };
}

/**
 * Bulk comparison across multiple offerings.
 */
export function compareOfferings(
  offerings: readonly { collegeCode: string; programmeCode: string }[],
  studentCutoff: number | null | undefined,
  quota: ComparisonRequest["quota"],
  community: ComparisonRequest["community"],
  exactEvidence?: {
    year?: number;
    stage?: ComparisonRequest["stage"];
    round?: ComparisonRequest["round"];
    metricType?: ComparisonRequest["metricType"];
  },
  repository: HistoricalRepository = HISTORICAL_OBSERVATIONS
): ComparisonResult[] {
  return offerings.map((off) =>
    compareOffering(
      {
        studentCutoff,
        quota,
        community,
        collegeCode: off.collegeCode,
        programmeCode: off.programmeCode,
        year: exactEvidence?.year,
        stage: exactEvidence?.stage,
        round: exactEvidence?.round,
        metricType: exactEvidence?.metricType,
      },
      repository
    )
  );
}

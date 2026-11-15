/**
 * Deterministic Historical Comparison Engine for Milestone M5 (T05).
 * Computes Δ = student_cutoff - historical_min_mark only for exact college–programme pairs.
 * Enforces strict nullability, route isolation, and governance holds.
 */

import {
  getHistoricalObservations,
  type HistoricalObservation,
} from "./historical-data.ts";
import {
  formatTruthInGuidanceDisclosure,
  formatDeltaExplanation,
  M5_BILINGUAL_COPY,
  type BilingualText,
} from "./bilingual-copy.ts";

export type CounsellingRoute = "GA" | "7.5";
export type AllottedCommunityCategory = "OC" | "BC" | "BCM" | "MBC" | "SC" | "SCA" | "ST";

export interface ComparisonQuery {
  readonly studentCutoff?: number | null;
  readonly category?: AllottedCommunityCategory | string | null;
  readonly route?: CounsellingRoute;
  readonly year?: number;
  readonly round?: number;
}

export type ComparisonStatus =
  | "AVAILABLE"
  | "NO_CUTOFF_PROVIDED"
  | "UNKNOWN"
  | "HELD_NEEDS_REVIEW"
  | "INVALID_INPUT";

export interface RoundComparison {
  readonly round: number;
  readonly minMark: number;
  readonly count: number;
  readonly delta: number | null;
  readonly deltaSign: "POSITIVE" | "ZERO" | "NEGATIVE" | null;
  readonly locator: string;
  readonly sourceUrl: string;
  readonly sourceTitle: string;
  readonly disclosure: BilingualText;
  readonly explanation?: BilingualText;
}

export interface ComparisonResult {
  readonly status: ComparisonStatus;
  readonly collegeCode: string;
  readonly programmeCode: string;
  readonly year: number;
  readonly route: CounsellingRoute;
  readonly category: string | null;
  readonly studentCutoff: number | null;
  readonly historicalMinMark: number | null;
  readonly delta: number | null;
  readonly deltaSign: "POSITIVE" | "ZERO" | "NEGATIVE" | null;
  readonly primaryRound: number | null;
  readonly allotmentCount: number | null;
  readonly locator: string | null;
  readonly sourceUrl: string | null;
  readonly sourceTitle: string | null;
  readonly allRounds: readonly RoundComparison[];
  readonly explanation: BilingualText;
  readonly disclosure: BilingualText | null;
}

const HELD_COLLEGE_CODES = new Set(["1516"]);

export function compareCutoff(
  collegeCode: string,
  programmeCode: string,
  query: ComparisonQuery
): ComparisonResult {
  const year = query.year ?? 2025;
  const route: CounsellingRoute = query.route === "7.5" ? "7.5" : "GA";
  const category = query.category?.trim() || null;
  const rawCutoff = query.studentCutoff;

  // 1. Check Governance Holds (College 1516)
  if (HELD_COLLEGE_CODES.has(collegeCode)) {
    return {
      status: "HELD_NEEDS_REVIEW",
      collegeCode,
      programmeCode,
      year,
      route,
      category,
      studentCutoff: rawCutoff ?? null,
      historicalMinMark: null,
      delta: null,
      deltaSign: null,
      primaryRound: null,
      allotmentCount: null,
      locator: null,
      sourceUrl: null,
      sourceTitle: null,
      allRounds: [],
      explanation: M5_BILINGUAL_COPY.heldReview,
      disclosure: null,
    };
  }

  // 2. Validate Cutoff if provided
  let studentCutoff: number | null = null;
  if (rawCutoff !== undefined && rawCutoff !== null && rawCutoff !== ("" as unknown as number)) {
    const num = Number(rawCutoff);
    if (!Number.isFinite(num) || num < 0 || num > 200) {
      return {
        status: "INVALID_INPUT",
        collegeCode,
        programmeCode,
        year,
        route,
        category,
        studentCutoff: null,
        historicalMinMark: null,
        delta: null,
        deltaSign: null,
        primaryRound: null,
        allotmentCount: null,
        locator: null,
        sourceUrl: null,
        sourceTitle: null,
        allRounds: [],
        explanation: {
          en: "Invalid cutoff mark provided. Cutoff marks must be between 0 and 200.",
          ta: "செல்லாத கட்-ஆப் மதிப்பெண். கட்-ஆப் மதிப்பெண் 0 முதல் 200 வரை இருக்க வேண்டும்.",
        },
        disclosure: null,
      };
    }
    studentCutoff = Math.round(num * 100) / 100;
  }

  // 3. Category must be specified for bucket lookup
  if (!category) {
    return {
      status: "INVALID_INPUT",
      collegeCode,
      programmeCode,
      year,
      route,
      category: null,
      studentCutoff,
      historicalMinMark: null,
      delta: null,
      deltaSign: null,
      primaryRound: null,
      allotmentCount: null,
      locator: null,
      sourceUrl: null,
      sourceTitle: null,
      allRounds: [],
      explanation: {
        en: "Please select an allotted community quota (OC, BC, BCM, MBC, SC, SCA, ST) to view historical minimum marks.",
        ta: "வரலாற்று குறைந்தபட்ச மதிப்பெண்களைக் காண உங்கள் தகுதிப் பிரிவை (OC, BC, BCM, MBC, SC, SCA, ST) தேர்ந்தெடுக்கவும்.",
      },
      disclosure: null,
    };
  }

  // 4. Retrieve exact observations for this bucket
  const observations = getHistoricalObservations(collegeCode, programmeCode, year, route, category);

  if (!observations || observations.length === 0) {
    return {
      status: "UNKNOWN",
      collegeCode,
      programmeCode,
      year,
      route,
      category,
      studentCutoff,
      historicalMinMark: null,
      delta: null,
      deltaSign: null,
      primaryRound: null,
      allotmentCount: null,
      locator: null,
      sourceUrl: null,
      sourceTitle: null,
      allRounds: [],
      explanation: M5_BILINGUAL_COPY.unknownRecord,
      disclosure: null,
    };
  }

  // 5. Build round comparisons
  const allRounds: RoundComparison[] = observations.map((obs) => {
    let rDelta: number | null = null;
    let rDeltaSign: "POSITIVE" | "ZERO" | "NEGATIVE" | null = null;
    let rExplanation: BilingualText | undefined = undefined;

    if (studentCutoff !== null) {
      rDelta = Math.round((studentCutoff - obs.minMark) * 100) / 100;
      rDeltaSign = rDelta > 0 ? "POSITIVE" : rDelta === 0 ? "ZERO" : "NEGATIVE";
      rExplanation = formatDeltaExplanation(rDelta, year, obs.round, obs.minMark);
    }

    return {
      round: obs.round,
      minMark: obs.minMark,
      count: obs.count,
      delta: rDelta,
      deltaSign: rDeltaSign,
      locator: obs.locator,
      sourceUrl: obs.source.url,
      sourceTitle: obs.source.title,
      disclosure: formatTruthInGuidanceDisclosure(obs.round),
      explanation: rExplanation,
    };
  });

  // 6. Select primary observation (user-requested round, or lowest round, or lowest mark)
  let primary: HistoricalObservation;
  if (query.round) {
    const matched = observations.find((o) => o.round === query.round);
    primary = matched ?? observations[0]!;
  } else {
    // If not specified, choose Round 1 if available, otherwise earliest round
    primary = observations.find((o) => o.round === 1) ?? observations[0]!;
  }

  let delta: number | null = null;
  let deltaSign: "POSITIVE" | "ZERO" | "NEGATIVE" | null = null;
  let explanation: BilingualText;

  if (studentCutoff !== null) {
    delta = Math.round((studentCutoff - primary.minMark) * 100) / 100;
    deltaSign = delta > 0 ? "POSITIVE" : delta === 0 ? "ZERO" : "NEGATIVE";
    explanation = formatDeltaExplanation(delta, year, primary.round, primary.minMark);
  } else {
    explanation = M5_BILINGUAL_COPY.noCutoffProvided;
  }

  const status: ComparisonStatus = studentCutoff !== null ? "AVAILABLE" : "NO_CUTOFF_PROVIDED";

  return {
    status,
    collegeCode,
    programmeCode,
    year,
    route,
    category,
    studentCutoff,
    historicalMinMark: primary.minMark,
    delta,
    deltaSign,
    primaryRound: primary.round,
    allotmentCount: primary.count,
    locator: primary.locator,
    sourceUrl: primary.source.url,
    sourceTitle: primary.source.title,
    allRounds,
    explanation,
    disclosure: formatTruthInGuidanceDisclosure(primary.round),
  };
}

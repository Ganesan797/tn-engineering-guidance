// The project intentionally has no ambient Node typings; these runtime imports
// match the existing M4 governed-artifact loaders.
// @ts-expect-error Node built-in types are not installed in this offline project.
import { readFileSync } from "node:fs";
// @ts-expect-error Node built-in types are not installed in this offline project.
import { fileURLToPath } from "node:url";
// @ts-expect-error Node built-in types are not installed in this offline project.
import { createHash } from "node:crypto";
import type {
  AllotmentRound,
  AllotmentStage,
  CommunityCategory,
  DerivedHistoricalObservation,
  ExactEvidenceKey,
  GovernedOffering,
  MetricType,
  QuotaStream,
} from "./types.ts";

/**
 * Deterministic helper to construct lookup keys for exact evidence matching.
 */
export function buildEvidenceKey(
  year: number,
  stage: AllotmentStage,
  round: AllotmentRound,
  quota: QuotaStream,
  collegeCode: string,
  programmeCode: string,
  allottedCategory: CommunityCategory,
  metricType: MetricType
): string {
  return `${year}~${stage}~${round}~${quota}~${collegeCode}~${programmeCode}~${allottedCategory}~${metricType}`;
}

export function buildOfferingKey(collegeCode: string, programmeCode: string): string {
  return `${collegeCode}~${programmeCode}`;
}

export const COLLEGE_1516_HOLD_NOTICE =
  "Booklet carries '(Previous year data)' header; requires current-year official intake confirmation.";

export {
  COHORT_55_CODES,
  COHORT_66_ADDITIONS_CODES,
  COHORT_65_ADDITIONS_CODES,
  COHORT_121_CODES,
  COHORT_120_CODES,
} from "./cohort-metadata.ts";
import {
  COHORT_55_CODES,
  COHORT_121_CODES,
} from "./cohort-metadata.ts";

const COHORT_55_SET = new Set(COHORT_55_CODES);
const COHORT_121_SET = new Set(COHORT_121_CODES);

export interface HistoricalRepositoryOptions {
  cohortCodes?: readonly string[];
}

export class HistoricalRepository {
  private readonly observations: DerivedHistoricalObservation[] = [];
  private readonly keyIndex = new Map<string, DerivedHistoricalObservation>();
  private readonly offeringIndex = new Map<string, DerivedHistoricalObservation[]>();
  private readonly governedOfferings: GovernedOffering[];
  private readonly governedOfferingIndex = new Map<string, GovernedOffering>();
  private readonly rejectedConflicts: Array<{
    key: string;
    existing: DerivedHistoricalObservation;
    incoming: DerivedHistoricalObservation;
    reason: string;
  }> = [];

  constructor(
    initialObservations: DerivedHistoricalObservation[] = [],
    options?: HistoricalRepositoryOptions
  ) {
    const allowedCodes = options?.cohortCodes
      ? new Set(options.cohortCodes)
      : COHORT_121_SET;

    // Load complete governed offerings for the cohort from offering-candidates.csv FIRST
    // so governed offering membership is established before observations are registered.
    const offeringsMap = new Map<string, GovernedOffering>();
    try {
      const csvUrl = new URL(
        "../../experiments/m4-governance-census/directory-candidates-2026/offering-candidates.csv",
        import.meta.url
      );
      const csvPath = fileURLToPath(csvUrl);
      const csvContent = readFileSync(csvPath, "utf-8");
      const lines = csvContent.split(/\r?\n/).filter(Boolean);

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",");
        const collegeCode = parts[0]?.trim();
        const programmeCode = parts[1]?.trim();
        const programmeName = parts[2]?.trim() ?? "";

        if (collegeCode && programmeCode && allowedCodes.has(collegeCode)) {
          const offKey = buildOfferingKey(collegeCode, programmeCode);
          if (!offeringsMap.has(offKey)) {
            const hasData = this.offeringIndex.has(offKey);
            const govOff: GovernedOffering = {
              collegeCode,
              programmeCode,
              programmeName,
              hasHistoricalData: hasData,
            };
            offeringsMap.set(offKey, govOff);
          }
        }
      }
    } catch (err) {
      console.error("Warning: Failed to load offering-candidates.csv:", err);
    }

    this.governedOfferings = Array.from(offeringsMap.values()).sort((a, b) => {
      const c = a.collegeCode.localeCompare(b.collegeCode, undefined, { numeric: true });
      return c !== 0 ? c : a.programmeCode.localeCompare(b.programmeCode);
    });

    for (const off of this.governedOfferings) {
      this.governedOfferingIndex.set(buildOfferingKey(off.collegeCode, off.programmeCode), off);
    }

    // Register initial observations against established governed offering catalogue
    for (const obs of initialObservations) {
      this.registerObservation(obs);
    }

    // Update hasHistoricalData flag on governed offerings immutably
    this.governedOfferings = this.governedOfferings.map((off) => ({
      ...off,
      hasHistoricalData: this.offeringIndex.has(buildOfferingKey(off.collegeCode, off.programmeCode)),
    }));
    this.governedOfferingIndex.clear();
    for (const off of this.governedOfferings) {
      this.governedOfferingIndex.set(buildOfferingKey(off.collegeCode, off.programmeCode), off);
    }
  }

  public registerObservation(obs: DerivedHistoricalObservation): {
    success: boolean;
    rejected: boolean;
    reason?: string;
  } {
    // Fail closed if any required evidence identifier is missing
    if (
      !obs.year ||
      !obs.stage ||
      !obs.round ||
      !obs.quota ||
      !obs.collegeCode ||
      !obs.programmeCode ||
      !obs.allottedCategory ||
      !obs.metricType ||
      !obs.sourceTitle
    ) {
      return {
        success: false,
        rejected: true,
        reason: "MISSING_REQUIRED_EVIDENCE_IDENTIFIERS",
      };
    }

    const key = buildEvidenceKey(
      obs.year,
      obs.stage,
      obs.round,
      obs.quota,
      obs.collegeCode,
      obs.programmeCode,
      obs.allottedCategory,
      obs.metricType
    );

    // Strict Governed Offering Membership:
    // If the observation's collegeCode and programmeCode are not in the governed offering catalogue,
    // reject/fail-closed so ungoverned historical pairs never enter keyIndex or comparison.
    const offKey = buildOfferingKey(obs.collegeCode, obs.programmeCode);
    if (this.governedOfferings.length > 0 && !this.governedOfferingIndex.has(offKey)) {
      this.rejectedConflicts.push({
        key,
        existing: obs,
        incoming: obs,
        reason: "UNGOVERNED_OFFERING_REJECTED",
      });
      return {
        success: false,
        rejected: true,
        reason: "UNGOVERNED_OFFERING_REJECTED",
      };
    }

    const existing = this.keyIndex.get(key);
    if (existing) {
      // Reject conflicting duplicates rather than silently overwriting them
      if (
        existing.derivedMinimumMark !== obs.derivedMinimumMark ||
        existing.allotmentCount !== obs.allotmentCount ||
        existing.sourceTitle !== obs.sourceTitle ||
        existing.locator !== obs.locator
      ) {
        this.rejectedConflicts.push({
          key,
          existing,
          incoming: obs,
          reason: `CONFLICTING_DUPLICATE_REJECTED: Mark mismatch ${existing.derivedMinimumMark} vs ${obs.derivedMinimumMark}`,
        });
        return {
          success: false,
          rejected: true,
          reason: "CONFLICTING_DUPLICATE_REJECTED",
        };
      }
      return {
        success: true,
        rejected: false,
        reason: "IDENTICAL_DUPLICATE_PRESERVED",
      };
    }

    this.keyIndex.set(key, obs);
    this.observations.push(obs);

    const existingOff = this.offeringIndex.get(offKey);
    if (existingOff) {
      existingOff.push(obs);
    } else {
      this.offeringIndex.set(offKey, [obs]);
    }

    return { success: true, rejected: false };
  }

  public getExactObservation(key: ExactEvidenceKey): DerivedHistoricalObservation | undefined {
    return this.keyIndex.get(
      buildEvidenceKey(
        key.year,
        key.stage,
        key.round,
        key.quota,
        key.collegeCode,
        key.programmeCode,
        key.allottedCategory,
        key.metricType
      )
    );
  }

  public getClosingObservation(params: {
    year: number;
    quota: QuotaStream;
    community: CommunityCategory;
    collegeCode: string;
    programmeCode: string;
  }): DerivedHistoricalObservation | undefined {
    const list = this.offeringIndex.get(buildOfferingKey(params.collegeCode, params.programmeCode));
    if (!list || list.length === 0) return undefined;
    const matches = list.filter(
      (obs) =>
        obs.year === params.year &&
        obs.quota === params.quota &&
        obs.allottedCategory === params.community &&
        obs.stage === "PROVISIONAL_ALLOTMENT"
    );
    if (matches.length === 0) return undefined;
    return matches.reduce((prev, curr) =>
      curr.derivedMinimumMark < prev.derivedMinimumMark ? curr : prev
    );
  }

  public getOtherRoundObservation(params: {
    year: number;
    quota: QuotaStream;
    community: CommunityCategory;
    collegeCode: string;
    programmeCode: string;
    excludedRound: AllotmentRound;
  }): DerivedHistoricalObservation | undefined {
    const list = this.offeringIndex.get(buildOfferingKey(params.collegeCode, params.programmeCode));
    if (!list || list.length === 0) return undefined;
    const matches = list.filter(
      (obs) =>
        obs.year === params.year &&
        obs.quota === params.quota &&
        obs.allottedCategory === params.community &&
        obs.stage === "PROVISIONAL_ALLOTMENT" &&
        obs.round !== params.excludedRound
    );
    if (matches.length === 0) return undefined;
    return matches.reduce((prev, curr) =>
      curr.derivedMinimumMark < prev.derivedMinimumMark ? curr : prev
    );
  }

  public getRejectedConflicts(): readonly { key: string; reason: string }[] {
    return this.rejectedConflicts.map((c) => ({ key: c.key, reason: c.reason }));
  }

  public getAll(cohort?: "55" | "120" | "ALL"): readonly DerivedHistoricalObservation[] {
    if (cohort === "55") {
      return this.observations.filter((obs) => COHORT_55_SET.has(obs.collegeCode));
    }
    return this.observations;
  }

  public getAllGovernedOfferings(cohort?: "55" | "120" | "ALL"): readonly GovernedOffering[] {
    if (cohort === "55") {
      return this.governedOfferings.filter((off) => COHORT_55_SET.has(off.collegeCode));
    }
    return this.governedOfferings;
  }

  public getGovernedOffering(collegeCode: string, programmeCode: string): GovernedOffering | undefined {
    return this.governedOfferingIndex.get(buildOfferingKey(collegeCode, programmeCode));
  }

  public hasHistoricalObservations(collegeCode: string, programmeCode: string, year?: number): boolean {
    const list = this.offeringIndex.get(buildOfferingKey(collegeCode, programmeCode));
    if (!list || list.length === 0) return false;
    if (year === undefined) return true;
    return list.some((obs) => obs.year === year);
  }

  public getOfferingsCount(
    cohortOrOptions?: "55" | "120" | "ALL" | { cohort?: "55" | "120" | "ALL"; year?: number }
  ): { total: number; withHistory: number; missingHistory: number } {
    const opts = typeof cohortOrOptions === "object" ? cohortOrOptions : { cohort: cohortOrOptions };
    const list = opts.cohort === "55"
      ? this.governedOfferings.filter((off) => COHORT_55_SET.has(off.collegeCode))
      : this.governedOfferings;
    const total = list.length;
    let withHistory = 0;
    for (const off of list) {
      if (this.hasHistoricalObservations(off.collegeCode, off.programmeCode, opts.year)) withHistory++;
    }
    return {
      total,
      withHistory,
      missingHistory: total - withHistory,
    };
  }

  public isCollegeHeld(collegeCode: string): boolean {
    return collegeCode === "1516";
  }

  public getCollegeHoldNotice(collegeCode: string): string | null {
    return collegeCode === "1516" ? COLLEGE_1516_HOLD_NOTICE : null;
  }
}

function mapRouteLiteral(routeLiteral: string): QuotaStream {
  if (routeLiteral === "GENERAL ACADEMIC") {
    return "GENERAL_ACADEMIC";
  }
  if (routeLiteral.includes("7.5%")) {
    return "GOVT_SCHOOL_7_5";
  }
  throw new Error(`Unknown route literal: ${routeLiteral}`);
}

function mapRoundLiteral(roundLiteral: string): AllotmentRound {
  if (roundLiteral === "ROUND 1") return "ROUND_1";
  if (roundLiteral === "ROUND 2") return "ROUND_2";
  if (roundLiteral === "ROUND 3") return "ROUND_3";
  throw new Error(`Unknown round literal: ${roundLiteral}`);
}

interface RawCandidateRecord {
  research_candidate_id: string;
  source_college_code_literal: string;
  source_programme_code_literal: string;
  source_route_literal: string;
  source_round_literal: string;
  source_allotted_category_literal: string;
  source_year_literal: string;
  source_title_literal: string;
  derived_minimum_mark: number;
  allotment_count_in_bucket: number;
  nonpersonal_source_locator: string;
  extraction_status: string;
}

export interface GateAApprovedDatasetSpec {
  relPath: string;
  sha256: string;
  recordCount: number;
  year: number;
  cohort: "55" | "66";
}

export const GATE_A_121_APPROVED_DATASETS: readonly GateAApprovedDatasetSpec[] = Object.freeze([
  {
    relPath: "../../experiments/m5-derived-minimum-candidates/run-2025-cohort-55/candidates.json",
    sha256: "1c6659838e848eaaf636a7c4ca70d895243ac9f32d6fe16eff94a092a2bb74c7",
    recordCount: 4332,
    year: 2025,
    cohort: "55",
  },
  {
    relPath: "../../experiments/m5-derived-minimum-candidates/run-2026-cohort-55/candidates.json",
    sha256: "7e328a4644085c48372ff93739248d3c729189f49ed14e48812df72033467e84",
    recordCount: 6308,
    year: 2026,
    cohort: "55",
  },
  {
    relPath: "../../experiments/m5-derived-minimum-candidates/run-2026-cohort-65-additions/candidates.json",
    sha256: "a1bc06bcf0cdf50e3b68ee827fa7d668763704419007d8562eed03761b61cced",
    recordCount: 7057,
    year: 2026,
    cohort: "66",
  },
]);

export function loadVerifiedHistoricalObservations(): DerivedHistoricalObservation[] {
  // Gate A Approved Observations: SHA-256 validated across 121 colleges (2025 baseline + 2026 runs)
  const result: DerivedHistoricalObservation[] = [];

  for (const spec of GATE_A_121_APPROVED_DATASETS) {
    try {
      const candidateUrl = new URL(spec.relPath, import.meta.url);
      const filePath = fileURLToPath(candidateUrl);
      const fileBuffer = readFileSync(filePath);

      // Verify cryptographic SHA-256 digest against approved Gate A ledger
      const computedHash = createHash("sha256").update(fileBuffer).digest("hex");
      if (computedHash !== spec.sha256) {
        throw new Error(
          `Security Exception: SHA-256 mismatch for ${spec.relPath}. Expected ${spec.sha256}, got ${computedHash}. Loading aborted.`
        );
      }

      const raw = fileBuffer.toString("utf-8");
      const records = JSON.parse(raw) as RawCandidateRecord[];
      if (records.length !== spec.recordCount) {
        throw new Error(
          `Security Exception: Record count mismatch for ${spec.relPath}. Expected ${spec.recordCount}, got ${records.length}.`
        );
      }

      for (const r of records) {
        const quota = mapRouteLiteral(r.source_route_literal);
        const round = mapRoundLiteral(r.source_round_literal);
        const category = r.source_allotted_category_literal as CommunityCategory;
        const isHeld = r.source_college_code_literal === "1516" || r.extraction_status === "HELD_NEEDS_REVIEW";
        result.push({
          candidateId: r.research_candidate_id,
          year: parseInt(r.source_year_literal, 10),
          stage: "PROVISIONAL_ALLOTMENT" as const,
          sourceTitle: r.source_title_literal,
          round,
          quota,
          collegeCode: r.source_college_code_literal,
          programmeCode: r.source_programme_code_literal,
          allottedCategory: category,
          metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK" as const,
          derivedMinimumMark: r.derived_minimum_mark,
          allotmentCount: r.allotment_count_in_bucket,
          locator: r.nonpersonal_source_locator,
          isHeld,
          holdNotice: isHeld ? COLLEGE_1516_HOLD_NOTICE : null,
        });
      }
    } catch (err) {
      console.error(`Warning: Failed to load Gate A verified candidates from ${spec.relPath}:`, err);
      throw err;
    }
  }

  return result;
}

/**
 * Research Candidate Loader (Gate A Approval Pending):
 * Explicitly separated from the production runtime singleton.
 * Loads 2026 provisional allotment research candidates for evaluation and future Gate A audits.
 */
export function loadResearchCandidateObservations(
  scope: "2026-COHORT-55" | "2026-COHORT-66" | "ALL-2026" = "ALL-2026"
): DerivedHistoricalObservation[] {
  const result: DerivedHistoricalObservation[] = [];
  const candidatePaths =
    scope === "2026-COHORT-55"
      ? ["../../experiments/m5-derived-minimum-candidates/run-2026-cohort-55/candidates.json"]
      : scope === "2026-COHORT-66"
      ? ["../../experiments/m5-derived-minimum-candidates/run-2026-cohort-65-additions/candidates.json"]
      : [
          "../../experiments/m5-derived-minimum-candidates/run-2026-cohort-55/candidates.json",
          "../../experiments/m5-derived-minimum-candidates/run-2026-cohort-65-additions/candidates.json",
        ];

  for (const relPath of candidatePaths) {
    try {
      const candidatesUrl = new URL(relPath, import.meta.url);
      const filePath = fileURLToPath(candidatesUrl);
      const raw = readFileSync(filePath, "utf-8");
      const records = JSON.parse(raw) as RawCandidateRecord[];
      for (const r of records) {
        const quota = mapRouteLiteral(r.source_route_literal);
        const round = mapRoundLiteral(r.source_round_literal);
        const category = r.source_allotted_category_literal as CommunityCategory;
        const isHeld = r.source_college_code_literal === "1516" || r.extraction_status === "HELD_NEEDS_REVIEW";
        result.push({
          candidateId: r.research_candidate_id,
          year: parseInt(r.source_year_literal, 10),
          stage: "PROVISIONAL_ALLOTMENT" as const,
          sourceTitle: r.source_title_literal,
          round,
          quota,
          collegeCode: r.source_college_code_literal,
          programmeCode: r.source_programme_code_literal,
          allottedCategory: category,
          metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK" as const,
          derivedMinimumMark: r.derived_minimum_mark,
          allotmentCount: r.allotment_count_in_bucket,
          locator: r.nonpersonal_source_locator,
          isHeld,
          holdNotice: isHeld ? COLLEGE_1516_HOLD_NOTICE : null,
        });
      }
    } catch (err) {
      console.error(`Warning: Failed to load research candidates from ${relPath}:`, err);
    }
  }

  return result;
}

export function createResearchCandidateRepository(
  cohort: "55" | "121" = "121"
): HistoricalRepository {
  const candidateObs = [
    ...loadVerifiedHistoricalObservations(),
    ...loadResearchCandidateObservations("ALL-2026"),
  ];
  return new HistoricalRepository(candidateObs, {
    cohortCodes: cohort === "55" ? COHORT_55_CODES : COHORT_121_CODES,
  });
}

// Runtime singleton: Gate A verified historical observations loaded (121 institutions, 2025 benchmark and 2026 expansion datasets).
export const HISTORICAL_OBSERVATIONS = new HistoricalRepository(loadVerifiedHistoricalObservations());

// Factory helper for tests using synthetic fixtures only
export function createSyntheticRepository(
  fixtures: DerivedHistoricalObservation[] = [],
  options?: HistoricalRepositoryOptions
): HistoricalRepository {
  return new HistoricalRepository(fixtures, options);
}

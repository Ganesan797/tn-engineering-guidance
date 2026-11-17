// The project intentionally has no ambient Node typings; these runtime imports
// match the existing M4 governed-artifact loaders.
// @ts-expect-error Node built-in types are not installed in this offline project.
import { readFileSync } from "node:fs";
// @ts-expect-error Node built-in types are not installed in this offline project.
import { fileURLToPath } from "node:url";
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

export const COHORT_55_CODES: readonly string[] = Object.freeze([
  // 11 Govt
  "1516", "2005", "2369", "2603", "2615", "2709", "3464", "3465", "4974", "5009", "5901",
  // 5 Univ Depts
  "1", "2", "3", "4", "5",
  // 3 Govt Aided
  "2006", "2007", "5008",
  // 16 Constituent
  "1013", "1014", "1015", "1026", "2025", "3011", "3016", "3018", "3019", "3021",
  "4020", "4023", "4024", "5010", "5017", "5022",
  // 20 SFC
  "1113", "1120", "1211", "1219", "1304", "1317", "1399", "1419", "1422", "1450",
  "2377", "2607", "2618", "2702", "2711", "2712", "2718", "2719", "4960", "5986",
]);

const COHORT_55_SET = new Set(COHORT_55_CODES);

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

  constructor(initialObservations: DerivedHistoricalObservation[] = []) {
    // Zero unverified research candidates are loaded at runtime.
    // Historical comparison remains unavailable until data receives explicit Gate A and production-use approval.
    for (const obs of initialObservations) {
      this.registerObservation(obs);
    }

    // Load complete governed offerings for the 55 colleges from offering-candidates.csv
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

        if (collegeCode && programmeCode && COHORT_55_SET.has(collegeCode)) {
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

    const offKey = buildOfferingKey(obs.collegeCode, obs.programmeCode);
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

  public getRejectedConflicts(): readonly { key: string; reason: string }[] {
    return this.rejectedConflicts.map((c) => ({ key: c.key, reason: c.reason }));
  }

  public getAll(): readonly DerivedHistoricalObservation[] {
    return this.observations;
  }

  public getAllGovernedOfferings(): readonly GovernedOffering[] {
    return this.governedOfferings;
  }

  public getGovernedOffering(collegeCode: string, programmeCode: string): GovernedOffering | undefined {
    return this.governedOfferingIndex.get(buildOfferingKey(collegeCode, programmeCode));
  }

  public hasHistoricalObservations(collegeCode: string, programmeCode: string): boolean {
    return this.offeringIndex.has(buildOfferingKey(collegeCode, programmeCode));
  }

  public getOfferingsCount(): { total: number; withHistory: number; missingHistory: number } {
    const total = this.governedOfferings.length;
    let withHistory = 0;
    for (const off of this.governedOfferings) {
      if (this.hasHistoricalObservations(off.collegeCode, off.programmeCode)) withHistory++;
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

// Runtime singleton: Zero unverified research candidates loaded.
export const HISTORICAL_OBSERVATIONS = new HistoricalRepository();

// Factory helper for tests using synthetic fixtures only
export function createSyntheticRepository(
  fixtures: DerivedHistoricalObservation[] = []
): HistoricalRepository {
  return new HistoricalRepository(fixtures);
}

/**
 * Milestone M5 Domain Types
 * Governed Historical Observations, Deterministic Comparison Engine, and Shortlist
 */

export type QuotaStream = "GENERAL_ACADEMIC" | "GOVT_SCHOOL_7_5";

export type AllotmentRound = "ROUND_1" | "ROUND_2" | "ROUND_3";

export type CommunityCategory = "OC" | "BC" | "BCM" | "MBC" | "SC" | "SCA" | "ST";

export type AllotmentStage = "PROVISIONAL_ALLOTMENT";

export type MetricType = "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK";

export interface ExactEvidenceKey {
  readonly year: number;
  readonly stage: AllotmentStage;
  readonly round: AllotmentRound;
  readonly quota: QuotaStream;
  readonly collegeCode: string;
  readonly programmeCode: string;
  readonly allottedCategory: CommunityCategory;
  readonly metricType: MetricType;
}

export interface DerivedHistoricalObservation {
  readonly candidateId: string;
  readonly year: number;
  readonly stage: AllotmentStage;
  readonly sourceTitle: string;
  readonly round: AllotmentRound;
  readonly quota: QuotaStream;
  readonly collegeCode: string;
  readonly programmeCode: string;
  readonly allottedCategory: CommunityCategory;
  readonly metricType: MetricType;
  readonly derivedMinimumMark: number;
  readonly allotmentCount: number;
  readonly locator: string;
  readonly isHeld: boolean;
  readonly holdNotice: string | null;
}

export type ComparisonStatus =
  | "AVAILABLE"
  | "HELD_NEEDS_REVIEW"
  | "NO_HISTORICAL_DATA"
  | "STUDENT_CUTOFF_MISSING";

export type EvidenceSemantics =
  | "DERIVED_PROVISIONAL_OBSERVATION"
  | "HELD_PREVIOUS_YEAR_HEADER"
  | "NOT_AVAILABLE_FOR_COMPARISON";

export interface GovernedOffering {
  readonly collegeCode: string;
  readonly programmeCode: string;
  readonly programmeName: string;
  readonly hasHistoricalData: boolean;
}

export interface ComparisonRequest {
  readonly studentCutoff?: number | null;
  readonly year?: number;
  readonly stage?: AllotmentStage;
  readonly round?: AllotmentRound;
  readonly quota: QuotaStream;
  readonly community: CommunityCategory;
  readonly collegeCode: string;
  readonly programmeCode: string;
  readonly metricType?: MetricType;
  readonly sourceTitle?: string;
}

export interface ComparisonResult {
  readonly status: ComparisonStatus;
  readonly evidenceSemantics: EvidenceSemantics;
  readonly studentCutoff: number | null;
  readonly historicalMin: number | null;
  readonly delta: number | null; // studentCutoff - historicalMin (strictly arithmetic)
  readonly metricType: MetricType;
  readonly officialClosingValue: null;
  readonly officialClosingValueStatus: "NOT_ESTABLISHED_BY_D5";
  readonly year: number | null;
  readonly stage: AllotmentStage | null;
  readonly round: AllotmentRound | null;
  readonly quota: QuotaStream;
  readonly community: CommunityCategory;
  readonly collegeCode: string;
  readonly programmeCode: string;
  readonly allotmentCount: number | null;
  readonly sourceTitle: string | null;
  readonly locator: string | null;
  readonly isHeld: boolean;
  readonly holdNotice: string | null;
}

export interface ShortlistItem {
  readonly id: string; // `${collegeCode}~${programmeCode}`
  readonly collegeCode: string;
  readonly collegeName: string;
  readonly programmeCode: string;
  readonly programmeName: string;
  readonly order: number;
  readonly addedAt: string;
}

export interface ShortlistState {
  readonly items: readonly ShortlistItem[];
}

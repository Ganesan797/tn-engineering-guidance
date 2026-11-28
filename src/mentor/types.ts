import type { AllotmentRoundOrAll, CommunityCategory, QuotaStream } from "../m5/types.ts";
import type { SupportedLanguage } from "../m5/bilingual-copy.ts";

export type MentorRouteType =
  | "CANONICAL_REVIEWED"
  | "DETERMINISTIC"
  | "AI_EXPLANATION_MOCK"
  | "INSUFFICIENT_EVIDENCE"
  | "BLOCKED_REQUEST";

export type MentorIntent =
  | "EXPLAIN_SELECTED_RESULT"
  | "EXPLAIN_CUTOFF_RECORD"
  | "COMPARE_SELECTED_OPTIONS"
  | "EXPLAIN_SHORTLIST"
  | "SIMPLIFY_FOR_PARENT"
  | "GENERAL_GUIDANCE";

export type MentorProviderName = "mock";

export type ContextResolutionOutcome =
  | "VALID_CONTEXT"
  | "FILTERED_OUT"
  | "NO_HISTORICAL_DATA"
  | "HELD_NEEDS_REVIEW"
  | "OUTSIDE_GOVERNED_SCOPE"
  | "INVALID_CONTEXT_ID"
  | "NO_CONTEXT";

export type ContextValidationErrorCode =
  | "TOO_MANY_CONTEXT_IDS"
  | "DUPLICATE_CONTEXT_IDS"
  | "INVALID_CONTEXT_ID"
  | "OUTSIDE_GOVERNED_SCOPE";

export interface ActiveFilterContext {
  readonly district?: string;
  readonly branch?: string;
  readonly type?: string;
}

export interface SelectedEvidenceSummary {
  readonly contextId: string;
  readonly collegeCode: string;
  readonly collegeName: string;
  readonly district: string;
  readonly institutionType: string;
  readonly programmeCode: string;
  readonly programmeName: string;
  readonly year: number;
  readonly round: AllotmentRoundOrAll;
  readonly quota: QuotaStream;
  readonly community: CommunityCategory;
  readonly evidenceType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK";
  readonly observedMinimumMark: number | null;
  readonly evidenceState: "AVAILABLE" | "NO_HISTORICAL_DATA" | "HELD_NEEDS_REVIEW";
  readonly holdNotice: string | null;
  readonly sourceLocator: string | null;
}

export interface BoundedExplanationContext {
  readonly language: SupportedLanguage;
  readonly knowledge_stage: "BEGINNER" | "EXPLORING" | "SHORTLISTING";
  readonly selected_college: string | null;
  readonly selected_branch: string | null;
  readonly selected_evidence: readonly SelectedEvidenceSummary[];
  readonly historical_year: number;
  readonly historical_round: AllotmentRoundOrAll;
  readonly quota_context: QuotaStream;
  readonly neutral_arithmetic_delta: number | null;
  readonly evidence_state: "AVAILABLE" | "NO_HISTORICAL_DATA" | "HELD_NEEDS_REVIEW" | "NONE_SELECTED";
  readonly context_outcome: ContextResolutionOutcome;
  readonly context_error_code: ContextValidationErrorCode | null;
  readonly shortlist_items_selected_by_student: readonly string[];
  readonly relevant_reviewed_guidance: readonly string[];
  readonly source_provenance: readonly string[];
}

export interface MentorRequest {
  readonly intent?: MentorIntent;
  readonly language?: SupportedLanguage;
  readonly question?: string;
  readonly contextIds?: readonly string[];
  readonly activeFilters?: ActiveFilterContext;
  readonly year?: number;
  readonly round?: AllotmentRoundOrAll;
  readonly quota?: QuotaStream;
  readonly community?: CommunityCategory;
  readonly knowledgeStage?: "BEGINNER" | "EXPLORING" | "SHORTLISTING";
}

export interface MentorResponse {
  readonly status: "ok" | "disabled" | "blocked" | "error";
  readonly mentorMode: "MOCK_ONLY";
  readonly provider: MentorProviderName | "none";
  readonly route: MentorRouteType;
  readonly contextOutcome: ContextResolutionOutcome;
  readonly language: SupportedLanguage;
  readonly disclosure: string;
  readonly provenance: string;
  readonly reply: string;
  readonly contextCount: number;
}

export interface MentorProvider {
  readonly name: MentorProviderName;
  explain(context: BoundedExplanationContext, question: string): string;
}

export interface MentorConfig {
  readonly enabled: boolean;
  readonly provider: MentorProviderName;
  readonly configError: string | null;
}

export const MAX_QUESTION_LENGTH = 280;
export const MAX_CONTEXT_IDS = 6;
export const MAX_RESPONSE_LENGTH = 900;
export const MAX_MENTOR_BODY_BYTES = 8192;

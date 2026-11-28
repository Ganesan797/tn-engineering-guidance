import { COHORT_300_METADATA } from "../m5/cohort-metadata.ts";
import { compareOffering } from "../m5/comparison-engine.ts";
import { HISTORICAL_OBSERVATIONS } from "../m5/historical-data.ts";
import type { AllotmentRoundOrAll, CommunityCategory, QuotaStream } from "../m5/types.ts";
import type { SupportedLanguage } from "../m5/bilingual-copy.ts";
import {
  MAX_CONTEXT_IDS,
  type ActiveFilterContext,
  type BoundedExplanationContext,
  type ContextResolutionOutcome,
  type ContextValidationErrorCode,
  type MentorRequest,
  type SelectedEvidenceSummary,
} from "./types.ts";

const VALID_QUOTAS = new Set<QuotaStream>(["GENERAL_ACADEMIC", "GOVT_SCHOOL_7_5"]);
const VALID_COMMUNITIES = new Set<CommunityCategory>(["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"]);
const VALID_ROUNDS = new Set<AllotmentRoundOrAll>(["ROUND_1", "ROUND_2", "ROUND_3", "ALL"]);
const CONTEXT_ID_PATTERN = /^[0-9]+~[A-Z0-9]+$/;

function normalizeYear(raw?: number): number {
  if (raw === 2024 || raw === 2025 || raw === 2026) return raw;
  return 2026;
}

function isFilteredOut(
  collegeDistrict: string,
  institutionType: string,
  programmeCode: string,
  filters?: ActiveFilterContext
): boolean {
  if (!filters) return false;
  if (filters.district && filters.district.trim()) {
    if (collegeDistrict.trim().toLowerCase() !== filters.district.trim().toLowerCase()) {
      return true;
    }
  }
  if (filters.branch && filters.branch.trim()) {
    if (programmeCode.toUpperCase() !== filters.branch.trim().toUpperCase()) {
      return true;
    }
  }
  if (filters.type && filters.type.trim() && filters.type !== "all") {
    if (institutionType.toUpperCase() !== filters.type.trim().toUpperCase()) {
      return true;
    }
  }
  return false;
}

/**
 * Resolves authoritative context strictly on the server from offering/shortlist IDs.
 * Note: Performs bounded governed lookup on server-known IDs; does not prove prior UI visibility
 * unless activeFilters are supplied to verify filter alignment.
 * Never trusts client-supplied cutoff marks or eligibility claims, and never silently truncates IDs.
 */
export function resolveBoundedContext(request: MentorRequest): BoundedExplanationContext {
  const language: SupportedLanguage = request.language === "en" ? "en" : "ta";
  const year = normalizeYear(request.year);
  const round: AllotmentRoundOrAll = request.round && VALID_ROUNDS.has(request.round) ? request.round : "ROUND_1";
  const quota: QuotaStream = request.quota && VALID_QUOTAS.has(request.quota) ? request.quota : "GENERAL_ACADEMIC";
  const community: CommunityCategory =
    request.community && VALID_COMMUNITIES.has(request.community) ? request.community : "OC";
  const knowledgeStage = request.knowledgeStage ?? "EXPLORING";

  const rawIds = (request.contextIds ?? []).map((id) => String(id).trim()).filter(Boolean);

  const makeEmpty = (
    outcome: ContextResolutionOutcome,
    errorCode: ContextValidationErrorCode | null
  ): BoundedExplanationContext => ({
    language,
    knowledge_stage: knowledgeStage,
    selected_college: null,
    selected_branch: null,
    selected_evidence: [],
    historical_year: year,
    historical_round: round,
    quota_context: quota,
    neutral_arithmetic_delta: null,
    evidence_state: "NONE_SELECTED",
    context_outcome: outcome,
    context_error_code: errorCode,
    shortlist_items_selected_by_student: [],
    relevant_reviewed_guidance: [],
    source_provenance: [],
  });

  if (rawIds.length === 0) {
    return makeEmpty("NO_CONTEXT", null);
  }

  // Reject excessive IDs rather than silently truncating
  if (rawIds.length > MAX_CONTEXT_IDS) {
    return makeEmpty("INVALID_CONTEXT_ID", "TOO_MANY_CONTEXT_IDS");
  }

  // Reject duplicates explicitly
  const normalizedIds = rawIds.map((id) => {
    const parts = id.split("~");
    return parts.length === 2 ? `${parts[0].trim()}~${parts[1].trim().toUpperCase()}` : id;
  });
  if (new Set(normalizedIds).size !== normalizedIds.length) {
    return makeEmpty("INVALID_CONTEXT_ID", "DUPLICATE_CONTEXT_IDS");
  }

  const selectedEvidence: SelectedEvidenceSummary[] = [];
  const provenanceSet = new Set<string>();
  const shortlistIds: string[] = [];
  let hasFilteredOut = false;

  for (const id of normalizedIds) {
    if (!CONTEXT_ID_PATTERN.test(id)) {
      return makeEmpty("INVALID_CONTEXT_ID", "INVALID_CONTEXT_ID");
    }
    const [collegeCode, programmeCode] = id.split("~");
    const meta = COHORT_300_METADATA[collegeCode];
    const offering = HISTORICAL_OBSERVATIONS.getGovernedOffering(collegeCode, programmeCode);
    if (!meta || !offering) {
      return makeEmpty("OUTSIDE_GOVERNED_SCOPE", "OUTSIDE_GOVERNED_SCOPE");
    }

    if (isFilteredOut(meta.district, meta.type, offering.programmeCode, request.activeFilters)) {
      hasFilteredOut = true;
    }

    shortlistIds.push(`${offering.collegeCode}~${offering.programmeCode}`);
    const cmp = compareOffering({
      studentCutoff: null,
      year,
      stage: "PROVISIONAL_ALLOTMENT",
      round,
      quota,
      community,
      collegeCode: offering.collegeCode,
      programmeCode: offering.programmeCode,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    });

    const evidenceState: SelectedEvidenceSummary["evidenceState"] = cmp.isHeld
      ? "HELD_NEEDS_REVIEW"
      : cmp.status === "NO_HISTORICAL_DATA"
      ? "NO_HISTORICAL_DATA"
      : "AVAILABLE";

    if (cmp.locator) provenanceSet.add(cmp.locator);

    selectedEvidence.push({
      contextId: `${offering.collegeCode}~${offering.programmeCode}`,
      collegeCode: offering.collegeCode,
      collegeName: meta.name,
      district: meta.district,
      institutionType: meta.type,
      programmeCode: offering.programmeCode,
      programmeName: offering.programmeName,
      year,
      round: cmp.round ?? round,
      quota,
      community,
      evidenceType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
      observedMinimumMark: cmp.historicalMin,
      evidenceState,
      holdNotice: cmp.holdNotice ?? null,
      sourceLocator: cmp.locator ?? null,
    });
  }

  const first = selectedEvidence[0] ?? null;
  const overallState: BoundedExplanationContext["evidence_state"] =
    selectedEvidence.some((e) => e.evidenceState === "HELD_NEEDS_REVIEW")
      ? "HELD_NEEDS_REVIEW"
      : selectedEvidence.every((e) => e.evidenceState === "NO_HISTORICAL_DATA")
      ? "NO_HISTORICAL_DATA"
      : "AVAILABLE";

  const contextOutcome: ContextResolutionOutcome = hasFilteredOut
    ? "FILTERED_OUT"
    : overallState === "HELD_NEEDS_REVIEW"
    ? "HELD_NEEDS_REVIEW"
    : overallState === "NO_HISTORICAL_DATA"
    ? "NO_HISTORICAL_DATA"
    : "VALID_CONTEXT";

  return {
    language,
    knowledge_stage: knowledgeStage,
    selected_college: first ? `${first.collegeName} (${first.collegeCode})` : null,
    selected_branch: first ? `${first.programmeName} (${first.programmeCode})` : null,
    selected_evidence: selectedEvidence,
    historical_year: year,
    historical_round: round,
    quota_context: quota,
    neutral_arithmetic_delta: null,
    evidence_state: overallState,
    context_outcome: contextOutcome,
    context_error_code: null,
    shortlist_items_selected_by_student: shortlistIds,
    relevant_reviewed_guidance: [],
    source_provenance: [...provenanceSet],
  };
}

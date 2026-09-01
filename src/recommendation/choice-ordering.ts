import { requireNonEmptyString } from "../domain/validation.ts";
import type { RecommendationCandidate } from "./foundation.ts";

export interface ChoiceOrderingPreferences {
  readonly branch_preference_order: readonly string[] | null;
}

export interface OrderedChoice {
  readonly position: number;
  readonly candidate: RecommendationCandidate;
  readonly branch_preference_rank: number | null;
  readonly ordering_reason_codes: readonly string[];
  readonly ordering_explanations: readonly string[];
}

function canonicalTieKey(candidate: RecommendationCandidate): string {
  return [
    candidate.tnea_college_code.padStart(10, "0"),
    candidate.branch_id,
    candidate.source_branch_code,
    candidate.programme_name,
  ].join("|");
}

function preferenceRanks(
  preferences: ChoiceOrderingPreferences,
): ReadonlyMap<string, number> {
  const ranks = new Map<string, number>();
  for (const [index, branchId] of (
    preferences.branch_preference_order ?? []
  ).entries()) {
    requireNonEmptyString(
      branchId,
      `branch_preference_order[${index}]`,
    );
    if (ranks.has(branchId)) {
      throw new Error(`duplicate branch preference: ${branchId}`);
    }
    ranks.set(branchId, index + 1);
  }
  return ranks;
}

export function orderCandidateChoices(
  candidates: readonly RecommendationCandidate[],
  preferences: ChoiceOrderingPreferences,
): OrderedChoice[] {
  const ranks = preferenceRanks(preferences);
  const ordered = [...candidates].sort((left, right) => {
    const leftRank = ranks.get(left.branch_id) ?? Number.POSITIVE_INFINITY;
    const rightRank = ranks.get(right.branch_id) ?? Number.POSITIVE_INFINITY;
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    const leftKey = canonicalTieKey(left);
    const rightKey = canonicalTieKey(right);
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });

  return ordered.map((candidate, index) => {
    const branchRank = ranks.get(candidate.branch_id) ?? null;
    const noPreference = ranks.size === 0;
    return {
      position: index + 1,
      candidate,
      branch_preference_rank: branchRank,
      ordering_reason_codes: [
        noPreference
          ? "BRANCH_PREFERENCE_NEUTRAL_MISSING"
          : branchRank === null
            ? "BRANCH_PREFERENCE_UNLISTED_NEUTRAL"
            : `BRANCH_PREFERENCE_MATCHED_RANK_${branchRank}`,
        "STABLE_CANONICAL_TIE_BREAKER",
      ],
      ordering_explanations: [
        noPreference
          ? "No branch preference was supplied; branch preference is neutral."
          : branchRank === null
            ? "This branch is not listed in the explicit preference order and remains neutral."
            : `This branch is explicit preference ${branchRank}.`,
        "Equal preference positions use canonical college and programme identifiers as a stable tie-breaker.",
      ],
    };
  });
}

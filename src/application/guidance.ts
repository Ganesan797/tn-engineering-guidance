import type { EligibilityResult, StudentProfile } from "../domain/index.ts";
import type { EligibilityEvaluationRequest } from "../domain/rules.ts";
import type {
  AdmissionSeatFactSnapshotStore,
  PilotDataRegistry,
} from "../ingestion/index.ts";
import {
  buildDeterministicCandidates,
  orderCandidateChoices,
  type ChoiceOrderingPreferences,
  type EvidenceReference,
  type OrderedChoice,
  type RecommendationRequest,
} from "../recommendation/index.ts";

export type GuidanceCounsellingContext = Pick<
  RecommendationRequest,
  | "snapshot_id"
  | "snapshot_stage"
  | "round"
  | "reservation_category"
  | "quota"
>;

export interface GuidanceRequest {
  readonly profile: StudentProfile;
  readonly eligibility_request: EligibilityEvaluationRequest;
  readonly preferences: ChoiceOrderingPreferences;
  readonly counselling: GuidanceCounsellingContext;
}

export interface GuidanceDependencies {
  readonly registry: PilotDataRegistry;
  readonly snapshots: AdmissionSeatFactSnapshotStore;
}

export interface GuidanceResult {
  readonly eligibility: EligibilityResult;
  readonly selected_snapshot_id: string;
  readonly selected_snapshot_stage: string | null;
  readonly ordered_choices: readonly OrderedChoice[];
  readonly provenance: readonly EvidenceReference[];
}

function collectProvenance(
  eligibility: EligibilityResult,
  choices: readonly OrderedChoice[],
): EvidenceReference[] {
  const references = [
    ...eligibility.checks.map(({ source_id, source_page }) => ({
      source_id,
      source_page,
    })),
    ...choices.flatMap(({ candidate }) => candidate.evidence),
  ];
  const unique = new Map(
    references.map((reference) => [
      `${reference.source_id}|${reference.source_page ?? ""}`,
      reference,
    ]),
  );
  return [...unique.values()].sort((left, right) => {
    const leftKey = `${left.source_id}|${left.source_page ?? ""}`;
    const rightKey = `${right.source_id}|${right.source_page ?? ""}`;
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });
}

export function createGuidance(
  request: GuidanceRequest,
  dependencies: GuidanceDependencies,
): GuidanceResult {
  const recommendation = buildDeterministicCandidates(
    {
      profile: request.profile,
      eligibility_request: request.eligibility_request,
      ...request.counselling,
    },
    dependencies.registry,
    dependencies.snapshots,
  );
  const orderedChoices = orderCandidateChoices(
    recommendation.candidates,
    request.preferences,
  );

  return {
    eligibility: recommendation.eligibility,
    selected_snapshot_id: recommendation.selected_snapshot_id,
    selected_snapshot_stage: recommendation.selected_snapshot_stage,
    ordered_choices: orderedChoices,
    provenance: collectProvenance(
      recommendation.eligibility,
      orderedChoices,
    ),
  };
}

import type {
  AdmissionSeatFact,
  EligibilityOutcome,
  Quota,
  ReservationCategory,
  StudentProfile,
} from "../domain/index.ts";
import {
  evaluateEligibility,
  type EligibilityEvaluationRequest,
} from "../domain/rules.ts";
import type {
  AdmissionSeatFactSnapshot,
  AdmissionSeatFactSnapshotStore,
  PilotDataRegistry,
  ProgrammeRecord,
} from "../ingestion/index.ts";
import { IngestionValidationError } from "../ingestion/errors.ts";

export type VacancyEvidenceState = "PUBLISHED" | "UNKNOWN_OR_UNPUBLISHED";

export interface EvidenceReference {
  readonly source_id: string;
  readonly source_page: number | null;
}

export interface RecommendationRequest {
  readonly profile: StudentProfile;
  readonly eligibility_request: EligibilityEvaluationRequest;
  readonly snapshot_id: string;
  readonly snapshot_stage: string | null;
  readonly round: number | null;
  readonly reservation_category: ReservationCategory | null;
  readonly quota: Quota | null;
}

export interface RecommendationCandidate {
  readonly tnea_college_code: string;
  readonly college_name: string;
  readonly branch_id: string;
  readonly source_branch_code: string;
  readonly programme_name: string;
  readonly eligibility_outcome: EligibilityOutcome;
  readonly eligibility_basis: readonly string[];
  readonly vacancy_evidence_state: VacancyEvidenceState;
  readonly applicable_seat_facts: readonly AdmissionSeatFact[];
  readonly evidence: readonly EvidenceReference[];
  readonly explanation_reason_codes: readonly string[];
}

export interface RecommendationResult {
  readonly eligibility: ReturnType<typeof evaluateEligibility>;
  readonly selected_snapshot_id: string;
  readonly selected_snapshot_stage: string | null;
  readonly candidates: readonly RecommendationCandidate[];
}

function selectedSnapshot(
  store: AdmissionSeatFactSnapshotStore,
  snapshotId: string,
  snapshotStage: string | null,
): AdmissionSeatFactSnapshot {
  const snapshot = store
    .snapshots()
    .find(({ snapshot_id }) => snapshot_id === snapshotId);
  if (snapshot === undefined) {
    throw new IngestionValidationError(`unknown snapshot_id: ${snapshotId}`);
  }
  if (snapshot.stage !== snapshotStage) {
    throw new IngestionValidationError(
      `snapshot stage mismatch for ${snapshotId}`,
    );
  }
  return snapshot;
}

function applicableFacts(
  snapshot: AdmissionSeatFactSnapshot,
  programme: ProgrammeRecord & { readonly branch_id: string },
  request: RecommendationRequest,
): AdmissionSeatFact[] {
  return snapshot.facts.filter((fact) => {
    if (
      fact.tnea_college_code !== programme.tnea_college_code ||
      fact.branch_id !== programme.branch_id
    ) {
      return false;
    }
    if (fact.fact_type === "SANCTIONED_INTAKE") {
      return true;
    }
    if (request.round !== null && fact.round !== request.round) {
      return false;
    }
    if (
      fact.reservation_category !== null &&
      fact.reservation_category !== request.reservation_category
    ) {
      return false;
    }
    if (fact.fact_type === "QUOTA_VACANCY") {
      return request.quota !== null && fact.quota === request.quota;
    }
    return request.quota === null;
  });
}

function evidenceReferences(
  eligibility: ReturnType<typeof evaluateEligibility>,
  programme: ProgrammeRecord,
  college: { readonly source_id: string; readonly source_page: number | null },
  facts: readonly AdmissionSeatFact[],
): EvidenceReference[] {
  const references = [
    ...eligibility.checks.map(({ source_id, source_page }) => ({
      source_id,
      source_page,
    })),
    { source_id: college.source_id, source_page: college.source_page },
    { source_id: programme.source_id, source_page: programme.source_page },
    ...facts.map(({ source_id, source_page }) => ({ source_id, source_page })),
  ];
  const unique = new Map(
    references.map((reference) => [
      `${reference.source_id}|${reference.source_page ?? ""}`,
      reference,
    ]),
  );
  return [...unique.values()].sort((left, right) =>
    `${left.source_id}|${left.source_page ?? ""}`.localeCompare(
      `${right.source_id}|${right.source_page ?? ""}`,
    ),
  );
}

export function buildDeterministicCandidates(
  request: RecommendationRequest,
  registry: PilotDataRegistry,
  snapshotStore: AdmissionSeatFactSnapshotStore,
): RecommendationResult {
  const eligibility = evaluateEligibility(
    request.profile,
    request.eligibility_request,
  );
  const snapshot = selectedSnapshot(
    snapshotStore,
    request.snapshot_id,
    request.snapshot_stage,
  );

  if (eligibility.outcome === "INELIGIBLE") {
    return {
      eligibility,
      selected_snapshot_id: snapshot.snapshot_id,
      selected_snapshot_stage: snapshot.stage,
      candidates: [],
    };
  }

  const colleges = new Map(
    registry.colleges().map((college) => [college.tnea_college_code, college]),
  );
  const programmes = registry
    .programmes()
    .filter(
      (programme): programme is ProgrammeRecord & { readonly branch_id: string } =>
        programme.branch_id !== null,
    )
    .sort((left, right) =>
      `${left.tnea_college_code}|${left.branch_id}`.localeCompare(
        `${right.tnea_college_code}|${right.branch_id}`,
        "en",
        { numeric: true },
      ),
    );

  const candidates = programmes.map((programme): RecommendationCandidate => {
    const college = colleges.get(programme.tnea_college_code);
    if (college === undefined) {
      throw new IngestionValidationError(
        `unknown tnea_college_code: ${programme.tnea_college_code}`,
      );
    }
    const facts = applicableFacts(snapshot, programme, request);
    const vacancyFacts = facts.filter(
      ({ fact_type }) => fact_type !== "SANCTIONED_INTAKE",
    );
    const vacancyState: VacancyEvidenceState =
      vacancyFacts.length === 0 ? "UNKNOWN_OR_UNPUBLISHED" : "PUBLISHED";
    return {
      tnea_college_code: programme.tnea_college_code,
      college_name: college.college_name,
      branch_id: programme.branch_id,
      source_branch_code: programme.source_branch_code,
      programme_name: programme.programme_name,
      eligibility_outcome: eligibility.outcome,
      eligibility_basis: eligibility.matched_rule_ids,
      vacancy_evidence_state: vacancyState,
      applicable_seat_facts: facts.map((fact) => ({ ...fact })),
      evidence: evidenceReferences(eligibility, programme, college, facts),
      explanation_reason_codes: [
        ...eligibility.checks.map(({ reason_code }) => reason_code),
        "CANONICAL_PROGRAMME_SUPPORTED",
        vacancyState === "PUBLISHED"
          ? "VACANCY_EVIDENCE_PUBLISHED"
          : "VACANCY_UNKNOWN_OR_UNPUBLISHED",
      ],
    };
  });

  return {
    eligibility,
    selected_snapshot_id: snapshot.snapshot_id,
    selected_snapshot_stage: snapshot.stage,
    candidates,
  };
}

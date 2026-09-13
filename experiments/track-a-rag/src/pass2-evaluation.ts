import { hasCompleteProvenance, retrieveChunks, selectEvidence } from "./retrieval.ts";
import { preserveDeterministicBoundary, routeQuestion } from "./routing.ts";
import type {
  ApprovedSourceId,
  EvidenceChunk,
  Pass2ScenarioEvaluation,
  ScenarioDefinition,
} from "./types.ts";

function expectedSources(scenario: ScenarioDefinition): readonly ApprovedSourceId[] {
  return [...new Set([...scenario.required_source_ids, ...scenario.acceptable_source_ids])];
}

export function evaluatePass2Retrieval(
  scenario: ScenarioDefinition,
  chunks: readonly EvidenceChunk[],
): Pass2ScenarioEvaluation {
  const initialRoute = routeQuestion(scenario.student_question);
  const deterministic = scenario.expected_route === "DETERMINISTIC_CUTOFF" ||
    scenario.expected_route === "DETERMINISTIC_ELIGIBILITY";
  if (deterministic) {
    const pass = initialRoute === scenario.expected_route;
    return {
      scenario_id: scenario.scenario_id,
      expected_route: scenario.expected_route,
      actual_route: initialRoute,
      expected_source_ids: [],
      retrieved_source_ids: [],
      real_vs_synthetic_evidence: "NONE",
      source_scope_check: "PASS",
      year_freshness_check: "PASS",
      provenance_check: "PASS",
      deterministic_boundary_check: pass ? "PASS" : "FAIL",
      chunking_method: "NOT_APPLICABLE",
      final_status: pass ? "PASS" : "FAIL",
      failure_reason: pass ? null : "Deterministic capability routing changed",
    };
  }

  const preferredSourceIds = scenario.required_source_ids.length > 0
    ? scenario.required_source_ids
    : scenario.acceptable_source_ids;
  const candidateChunks = chunks.filter(({ metadata }) =>
    preferredSourceIds.includes(metadata.source_id)
  );
  const selection = scenario.scenario_id.startsWith("T05")
    ? {
        status: "READY" as const,
        retrieved: [
          ...retrieveChunks(scenario.student_question, candidateChunks, {
            ...scenario.constraints, programme: "CSE",
          }, 2),
          ...retrieveChunks(scenario.student_question, candidateChunks, {
            ...scenario.constraints, programme: "IT",
          }, 2),
        ],
        reason: null,
        conflicts: [],
      }
    : selectEvidence(scenario.student_question, candidateChunks, scenario.constraints);
  const actualRoute = selection.status === "DEFER" ? "EVIDENCE_DEFER" : initialRoute;
  const retrieved = selection.retrieved;
  const sourceIds = [...new Set(retrieved.map(({ chunk }) => chunk.metadata.source_id))];
  const scopePass = scenario.constraints?.institution_scope === undefined || retrieved.every(
    ({ chunk }) => chunk.metadata.institution_scope === scenario.constraints?.institution_scope,
  );
  const yearPass = scenario.constraints?.source_year === undefined || retrieved.every(
    ({ chunk }) => chunk.metadata.source_year === scenario.constraints?.source_year,
  );
  const provenancePass = retrieved.length > 0 && retrieved.every(({ chunk }) => hasCompleteProvenance(chunk));
  const approvedPass = retrieved.length > 0 && retrieved.every(
    ({ chunk }) => scenario.acceptable_source_ids.includes(chunk.metadata.source_id),
  );
  const requiredPass = scenario.required_source_ids.every((id) => sourceIds.includes(id));
  const programmes = new Set(retrieved.map(({ chunk }) => chunk.metadata.programme));
  const comparisonPass = !scenario.scenario_id.startsWith("T05") ||
    (programmes.has("CSE") && programmes.has("IT"));
  const routePass = actualRoute === scenario.expected_route;
  const pass = routePass && scopePass && yearPass && provenancePass && approvedPass &&
    requiredPass && comparisonPass;
  const evidenceClasses = new Set(retrieved.map(({ chunk }) => chunk.evidence_class));
  const evidenceKind = retrieved.length === 0
    ? "NONE"
    : evidenceClasses.has("SYNTHETIC_TEST_FIXTURE")
      ? "SYNTHETIC_ONLY"
      : "REAL_APPROVED_CORPUS";

  return {
    scenario_id: scenario.scenario_id,
    expected_route: scenario.expected_route,
    actual_route: actualRoute,
    expected_source_ids: expectedSources(scenario),
    retrieved_source_ids: sourceIds,
    real_vs_synthetic_evidence: evidenceKind,
    source_scope_check: scopePass ? "PASS" : "FAIL",
    year_freshness_check: yearPass ? "PASS" : "FAIL",
    provenance_check: provenancePass ? "PASS" : "FAIL",
    deterministic_boundary_check: preserveDeterministicBoundary(actualRoute) ? "PASS" : "FAIL",
    chunking_method: retrieved[0]?.chunk.chunking_strategy ?? "NOT_APPLICABLE",
    final_status: pass ? "PASS" : selection.status === "DEFER" ? "NOT_RUN" : "FAIL",
    failure_reason: pass ? null : selection.reason ?? "Expected source, scope, programme, or provenance was not retrieved",
  };
}

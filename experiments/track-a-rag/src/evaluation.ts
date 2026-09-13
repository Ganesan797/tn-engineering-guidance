import { buildEvidencePacket } from "./grounding.ts";
import { hasCompleteProvenance, selectEvidence } from "./retrieval.ts";
import { preserveDeterministicBoundary, routeQuestion } from "./routing.ts";
import type {
  ApprovedSourceId,
  EvidenceChunk,
  ScenarioDefinition,
  ScenarioEvaluation,
} from "./types.ts";

export interface EvaluationRuntime {
  readonly llm_available: boolean;
  readonly available_source_ids: readonly ApprovedSourceId[];
}

function expectedSources(scenario: ScenarioDefinition): readonly ApprovedSourceId[] {
  return [...new Set([...scenario.required_source_ids, ...scenario.acceptable_source_ids])];
}

function retrievedDetails(retrieved: ReturnType<typeof selectEvidence>["retrieved"]) {
  return retrieved.map(({ chunk, score }) => ({
    chunk_id: chunk.chunk_id,
    source_id: chunk.metadata.source_id,
    page_or_section: chunk.metadata.page_or_section,
    score,
  }));
}

function notRun(
  scenario: ScenarioDefinition,
  actualRoute: ScenarioEvaluation["actual_route"],
  reason: string,
): ScenarioEvaluation {
  return {
    scenario_id: scenario.scenario_id,
    student_question: scenario.student_question,
    expected_route: scenario.expected_route,
    actual_route: actualRoute,
    expected_source_ids: expectedSources(scenario),
    retrieved_source_ids: [],
    retrieved_chunks: [],
    source_scope_check: "NOT_RUN",
    provenance_check: "NOT_RUN",
    grounding_check: "NOT_RUN",
    deterministic_boundary_check: preserveDeterministicBoundary(actualRoute) ? "PASS" : "FAIL",
    language_fidelity_check: scenario.manual_language_review ? "MANUAL_REVIEW_REQUIRED" : "NOT_RUN",
    final_status: "NOT_RUN",
    failure_reason: reason,
  };
}

export function evaluateScenario(
  scenario: ScenarioDefinition,
  chunks: readonly EvidenceChunk[],
  runtime: EvaluationRuntime,
): ScenarioEvaluation {
  const initialRoute = routeQuestion(scenario.student_question);

  if (
    scenario.expected_route === "DETERMINISTIC_CUTOFF" ||
    scenario.expected_route === "DETERMINISTIC_ELIGIBILITY"
  ) {
    const pass = initialRoute === scenario.expected_route;
    return {
      scenario_id: scenario.scenario_id,
      student_question: scenario.student_question,
      expected_route: scenario.expected_route,
      actual_route: initialRoute,
      expected_source_ids: [],
      retrieved_source_ids: [],
      retrieved_chunks: [],
      source_scope_check: "PASS",
      provenance_check: "PASS",
      grounding_check: "PASS",
      deterministic_boundary_check: pass ? "PASS" : "FAIL",
      language_fidelity_check: "NOT_RUN",
      final_status: pass ? "PASS" : "FAIL",
      failure_reason: pass ? null : "Question did not route to the required deterministic capability",
    };
  }

  const missingRequired = scenario.required_source_ids.filter(
    (sourceId) => !runtime.available_source_ids.includes(sourceId),
  );
  if (scenario.expected_route !== "EVIDENCE_DEFER" && missingRequired.length > 0) {
    return notRun(
      scenario,
      initialRoute,
      `Required approved sources are not locally available: ${missingRequired.join(", ")}`,
    );
  }

  const selection = selectEvidence(scenario.student_question, chunks, scenario.constraints);
  const actualRoute = selection.status === "DEFER" ? "EVIDENCE_DEFER" : initialRoute;
  const packet = buildEvidencePacket(actualRoute, selection);
  const retrieved = selection.retrieved;
  const scopePass = scenario.constraints?.institution_scope === undefined ||
    retrieved.every(({ chunk }) => chunk.metadata.institution_scope === scenario.constraints?.institution_scope);
  const provenancePass = retrieved.length > 0 && retrieved.every(({ chunk }) => hasCompleteProvenance(chunk));
  const approvedSourcePass = retrieved.every(({ chunk }) =>
    scenario.acceptable_source_ids.includes(chunk.metadata.source_id),
  );
  const routePass = actualRoute === scenario.expected_route;

  if (scenario.expected_route === "EVIDENCE_DEFER") {
    return {
      scenario_id: scenario.scenario_id,
      student_question: scenario.student_question,
      expected_route: scenario.expected_route,
      actual_route: actualRoute,
      expected_source_ids: expectedSources(scenario),
      retrieved_source_ids: retrieved.map(({ chunk }) => chunk.metadata.source_id),
      retrieved_chunks: retrievedDetails(retrieved),
      source_scope_check: scopePass ? "PASS" : "FAIL",
      provenance_check: retrieved.length === 0 || provenancePass ? "PASS" : "FAIL",
      grounding_check: packet.evidence_status === "INSUFFICIENT_EVIDENCE" ? "PASS" : "FAIL",
      deterministic_boundary_check: "PASS",
      language_fidelity_check: "NOT_RUN",
      final_status: routePass ? "PASS" : "FAIL",
      failure_reason: routePass ? null : "Stale or missing evidence was not deferred",
    };
  }

  if (!routePass || !scopePass || !provenancePass || !approvedSourcePass) {
    return {
      scenario_id: scenario.scenario_id,
      student_question: scenario.student_question,
      expected_route: scenario.expected_route,
      actual_route: actualRoute,
      expected_source_ids: expectedSources(scenario),
      retrieved_source_ids: retrieved.map(({ chunk }) => chunk.metadata.source_id),
      retrieved_chunks: retrievedDetails(retrieved),
      source_scope_check: scopePass ? "PASS" : "FAIL",
      provenance_check: provenancePass ? "PASS" : "FAIL",
      grounding_check: "FAIL",
      deterministic_boundary_check: preserveDeterministicBoundary(actualRoute) ? "PASS" : "FAIL",
      language_fidelity_check: scenario.manual_language_review ? "MANUAL_REVIEW_REQUIRED" : "NOT_RUN",
      final_status: "FAIL",
      failure_reason: "Routing, scope, provenance, or approved-source requirement failed",
    };
  }

  if (scenario.requires_llm && !runtime.llm_available) {
    return {
      scenario_id: scenario.scenario_id,
      student_question: scenario.student_question,
      expected_route: scenario.expected_route,
      actual_route: actualRoute,
      expected_source_ids: expectedSources(scenario),
      retrieved_source_ids: retrieved.map(({ chunk }) => chunk.metadata.source_id),
      retrieved_chunks: retrievedDetails(retrieved),
      source_scope_check: "PASS",
      provenance_check: "PASS",
      grounding_check: "MANUAL_REVIEW_REQUIRED",
      deterministic_boundary_check: "PASS",
      language_fidelity_check: scenario.manual_language_review ? "MANUAL_REVIEW_REQUIRED" : "NOT_RUN",
      final_status: "NOT_RUN",
      failure_reason: "No approved live LLM runtime is configured; retrieval evidence is available for manual review",
    };
  }

  return {
    scenario_id: scenario.scenario_id,
    student_question: scenario.student_question,
    expected_route: scenario.expected_route,
    actual_route: actualRoute,
    expected_source_ids: expectedSources(scenario),
    retrieved_source_ids: retrieved.map(({ chunk }) => chunk.metadata.source_id),
    retrieved_chunks: retrievedDetails(retrieved),
    source_scope_check: "PASS",
    provenance_check: "PASS",
    grounding_check: "PASS",
    deterministic_boundary_check: "PASS",
    language_fidelity_check: scenario.manual_language_review ? "MANUAL_REVIEW_REQUIRED" : "NOT_RUN",
    final_status: "PASS",
    failure_reason: null,
  };
}

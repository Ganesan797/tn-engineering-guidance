import { validateLiveModelOutput } from "./output-validation.ts";
import type { GateEvaluation, LiveModelInput, LiveModelOutput } from "./types.ts";

export function evaluateMechanically(
  input: LiveModelInput,
  output: LiveModelOutput,
): GateEvaluation {
  const issues = validateLiveModelOutput(output, input);
  const used = new Set(output.used_source_ids);
  const available = new Set(input.retrieved_evidence.map(({ source_id }) => source_id));
  const groundingPass = output.claims_supported &&
    output.unsupported_claims_detected.length === 0 &&
    [...used].every((id) => available.has(id));
  const deterministicPass = input.deterministic_result === null ||
    (output.deterministic_result_preserved &&
      output.deterministic_result_echo === JSON.stringify(input.deterministic_result));
  return {
    grounding: groundingPass && issues.length === 0 ? "PASS" : "FAIL",
    routing: deterministicPass ? "PASS" : "FAIL",
    guidance: "MANUAL_REVIEW_REQUIRED",
    language: "MANUAL_REVIEW_REQUIRED",
    security: input.retrieved_evidence.some(({ text }) => /ignore all previous instructions/iu.test(text))
      ? "MANUAL_REVIEW_REQUIRED"
      : "NOT_RUN",
    uncertainty: input.route === "EVIDENCE_DEFER"
      ? output.uncertainty_flag && output.next_action_type === "DEFER_FOR_EVIDENCE" ? "PASS" : "FAIL"
      : "NOT_RUN",
    reasons: issues,
  };
}

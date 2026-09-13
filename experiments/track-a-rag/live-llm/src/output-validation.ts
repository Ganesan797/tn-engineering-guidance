import { isApprovedSourceId } from "../../src/manifest.ts";
import { GUIDANCE_STAGES, NEXT_ACTION_TYPES, type LiveModelInput, type LiveModelOutput } from "./types.ts";

export const LIVE_OUTPUT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "response_text", "language", "guidance_stage", "used_source_ids", "claims_supported",
    "unsupported_claims_detected", "deterministic_result_preserved", "deterministic_result_echo",
    "next_action_type", "next_question", "uncertainty_flag", "recommendation_strength",
  ],
  properties: {
    response_text: { type: "string" },
    language: { type: "string", enum: ["ENGLISH", "TAMIL"] },
    guidance_stage: { type: "string", enum: GUIDANCE_STAGES },
    used_source_ids: { type: "array", items: { type: "string", enum: [
      "RAG-A01", "RAG-A02", "RAG-A03", "RAG-A04", "RAG-A05", "RAG-A06", "RAG-A07", "RAG-A08", "RAG-A09",
    ] } },
    claims_supported: { type: "boolean" },
    unsupported_claims_detected: { type: "array", items: { type: "string" } },
    deterministic_result_preserved: { type: "boolean" },
    deterministic_result_echo: { anyOf: [{ type: "string" }, { type: "null" }] },
    next_action_type: { type: "string", enum: NEXT_ACTION_TYPES },
    next_question: { anyOf: [{ type: "string" }, { type: "null" }] },
    uncertainty_flag: { type: "boolean" },
    recommendation_strength: { type: "string", enum: ["NONE", "EXPLORATORY", "DETERMINISTIC_RESULT_ONLY"] },
  },
} as const;

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateLiveModelOutput(value: unknown, input: LiveModelInput): readonly string[] {
  if (!object(value)) return ["output must be an object"];
  const issues: string[] = [];
  if (typeof value.response_text !== "string" || value.response_text.trim() === "") issues.push("response_text must be non-empty");
  if (value.language !== "ENGLISH" && value.language !== "TAMIL") issues.push("language is invalid");
  if (!GUIDANCE_STAGES.includes(value.guidance_stage as never)) issues.push("guidance_stage is invalid");
  if (!Array.isArray(value.used_source_ids) || !value.used_source_ids.every(
    (id) => typeof id === "string" && isApprovedSourceId(id),
  )) issues.push("used_source_ids must contain only approved sources");
  if (typeof value.claims_supported !== "boolean") issues.push("claims_supported must be boolean");
  if (!Array.isArray(value.unsupported_claims_detected) || !value.unsupported_claims_detected.every(
    (claim) => typeof claim === "string",
  )) issues.push("unsupported_claims_detected must be strings");
  if (typeof value.deterministic_result_preserved !== "boolean") issues.push("deterministic_result_preserved must be boolean");
  if (!NEXT_ACTION_TYPES.includes(value.next_action_type as never)) issues.push("next_action_type is invalid");
  if (value.next_question !== null && typeof value.next_question !== "string") issues.push("next_question must be string or null");
  if (typeof value.uncertainty_flag !== "boolean") issues.push("uncertainty_flag must be boolean");
  if (!["NONE", "EXPLORATORY", "DETERMINISTIC_RESULT_ONLY"].includes(String(value.recommendation_strength))) {
    issues.push("recommendation_strength is invalid");
  }

  const availableSources = new Set(input.retrieved_evidence.map(({ source_id }) => source_id));
  if (Array.isArray(value.used_source_ids) && value.used_source_ids.some((id) => !availableSources.has(id))) {
    issues.push("output cites a source not present in retrieved evidence");
  }
  if (input.deterministic_result !== null) {
    if (value.deterministic_result_preserved !== true) issues.push("deterministic result was not declared preserved");
    if (value.deterministic_result_echo !== JSON.stringify(input.deterministic_result)) issues.push("deterministic result echo changed");
  } else if (value.deterministic_result_echo !== null) {
    issues.push("deterministic result echo must be null when no result exists");
  }
  if (input.student_state.knowledge_stage === "ZERO_KNOWLEDGE" && value.recommendation_strength !== "NONE") {
    issues.push("zero-knowledge guidance must not recommend prematurely");
  }
  if (input.route === "EVIDENCE_DEFER" && value.next_action_type !== "DEFER_FOR_EVIDENCE") {
    issues.push("insufficient evidence must defer");
  }
  return issues;
}

export function parseLiveModelOutput(text: string, input: LiveModelInput): LiveModelOutput {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("LLM output was not valid JSON");
  }
  const issues = validateLiveModelOutput(value, input);
  if (issues.length > 0) throw new Error(`LLM output contract failed: ${issues.join("; ")}`);
  return value as unknown as LiveModelOutput;
}

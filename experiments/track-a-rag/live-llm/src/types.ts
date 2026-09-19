import type {
  ApprovedSourceId,
  Capability,
  InstitutionScope,
  Language,
  RetrievedChunk,
} from "../../src/types.ts";

export const GUIDANCE_STAGES = [
  "ZERO_KNOWLEDGE",
  "ORIENTATION",
  "EXPLORATION",
  "INPUT_COLLECTION",
  "DETERMINISTIC_EVALUATION",
  "RESULT_EXPLANATION",
  "NEXT_ACTION",
] as const;
export type GuidanceStage = (typeof GUIDANCE_STAGES)[number];

export const NEXT_ACTION_TYPES = [
  "EXPLAIN",
  "ASK_INPUT",
  "CALL_DETERMINISTIC_TOOL",
  "DEFER_FOR_EVIDENCE",
  "PRESENT_RESULT",
  "SUGGEST_EXPLORATION",
] as const;
export type NextActionType = (typeof NEXT_ACTION_TYPES)[number];

export type KnowledgeStage = "ZERO_KNOWLEDGE" | "BEGINNER" | "INFORMED";

export interface StudentState {
  readonly language: Language;
  readonly knowledge_stage: KnowledgeStage;
  readonly known_inputs: Readonly<Record<string, string | number | boolean | null>>;
  readonly unknown_inputs: readonly string[];
  readonly current_goal: string;
  readonly conversation_summary: string;
}

export interface ModelEvidence {
  readonly source_id: ApprovedSourceId;
  readonly title: string;
  readonly page_or_section: string;
  readonly text: string;
  readonly reference: string;
  readonly source_year: number | null;
  readonly institution_scope: InstitutionScope | null;
  readonly programme: string | null;
  readonly chunk_id: string;
  readonly evidence_class: "APPROVED_CORPUS" | "SYNTHETIC_TEST_FIXTURE";
  readonly trust: "UNTRUSTED_DOCUMENT_DATA";
}

export interface LiveModelInput {
  readonly student_state: StudentState;
  readonly route: Capability;
  readonly retrieved_evidence: readonly ModelEvidence[];
  readonly deterministic_result: unknown | null;
  readonly guidance_constraints: readonly string[];
}

export interface LiveModelOutput {
  readonly response_text: string;
  readonly language: Language;
  readonly guidance_stage: GuidanceStage;
  readonly used_source_ids: readonly ApprovedSourceId[];
  readonly claims_supported: boolean;
  readonly unsupported_claims_detected: readonly string[];
  readonly deterministic_result_preserved: boolean;
  readonly deterministic_result_echo: string | null;
  readonly next_action_type: NextActionType;
  readonly next_question: string | null;
  readonly uncertainty_flag: boolean;
  readonly recommendation_strength: "NONE" | "EXPLORATORY" | "DETERMINISTIC_RESULT_ONLY";
}

export interface PreparedTurn {
  readonly input: LiveModelInput;
  readonly retrieved: readonly RetrievedChunk[];
  readonly evidence_reason: string | null;
}

export const LIVE_LLM_PROVIDERS = ["OPENAI", "GEMINI"] as const;
export type LiveLlmProvider = (typeof LIVE_LLM_PROVIDERS)[number];

export interface LiveModelUsage {
  readonly input_tokens: number | null;
  readonly output_tokens: number | null;
  readonly thinking_tokens: number | null;
  readonly total_tokens: number | null;
}

export interface LiveModelRunMetadata {
  readonly provider: LiveLlmProvider;
  readonly model: string;
  readonly prompt_version: string;
  readonly latency_ms: number;
  readonly usage: LiveModelUsage;
  readonly estimated_cost_usd: number | null;
  readonly cost_basis: string;
}

export interface LiveModelRun {
  readonly output: LiveModelOutput;
  readonly metadata: LiveModelRunMetadata;
}

export const LIVE_LLM_FAILURE_CLASSIFICATIONS = [
  "TIMEOUT",
  "NETWORK_ERROR",
  "HTTP_ERROR",
  "MALFORMED_RESPONSE",
  "PROVIDER_ERROR",
  "OUTPUT_VALIDATION_ERROR",
  "DETERMINISTIC_BOUNDARY_VIOLATION",
  "EXECUTION_ERROR",
] as const;
export type LiveLlmFailureClassification = (typeof LIVE_LLM_FAILURE_CLASSIFICATIONS)[number];

export interface LiveScenarioFailure {
  readonly provider_error?: import("./http-diagnostics.ts").ProviderErrorDiagnostics;
  readonly status: "FAILED";
  readonly scenario_id: string;
  readonly provider: LiveLlmProvider;
  readonly model: string;
  readonly latency_ms: number;
  readonly failure_classification: LiveLlmFailureClassification;
  readonly message: string;
}

export interface LiveScenarioSuccess {
  readonly status: "COMPLETED";
  readonly scenario_id: string;
  readonly run: LiveModelRun;
}

export type LiveScenarioResult = LiveScenarioSuccess | LiveScenarioFailure;

export interface AggregateLiveTelemetry {
  readonly complete: boolean;
  readonly input_tokens: number | null;
  readonly output_tokens: number | null;
  readonly thinking_tokens: number | null;
  readonly total_tokens: number | null;
  readonly estimated_cost_usd: number | null;
  readonly total_latency_ms: number;
}

export interface LiveLlmClient {
  readonly provider: LiveLlmProvider;
  readonly model: string;
  readonly temperature: number;
  generate(input: LiveModelInput): Promise<LiveModelRun>;
}

export type GateCheck = "PASS" | "FAIL" | "MANUAL_REVIEW_REQUIRED" | "NOT_RUN";

export interface GateEvaluation {
  readonly grounding: GateCheck;
  readonly routing: GateCheck;
  readonly guidance: GateCheck;
  readonly language: GateCheck;
  readonly security: GateCheck;
  readonly uncertainty: GateCheck;
  readonly reasons: readonly string[];
}

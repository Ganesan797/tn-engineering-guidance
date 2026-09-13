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

export interface LiveLlmClient {
  readonly provider: string;
  readonly model: string;
  readonly temperature: number;
  generate(input: LiveModelInput): Promise<LiveModelOutput>;
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

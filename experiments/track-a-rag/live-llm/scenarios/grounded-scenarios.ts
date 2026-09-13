import type { Capability, RetrievalConstraints } from "../../src/types.ts";
import type { StudentState } from "../src/types.ts";

export interface GroundedGateScenario {
  readonly scenario_id: string;
  readonly question: string;
  readonly student_state: StudentState;
  readonly expected_route: Capability;
  readonly expected_source_ids: readonly string[];
  readonly constraints?: RetrievalConstraints;
  readonly fixture_mode?: "STALE_ONLY" | "PROMPT_INJECTION";
}

const BEGINNER: StudentState = {
  language: "ENGLISH",
  knowledge_stage: "BEGINNER",
  known_inputs: {},
  unknown_inputs: [],
  current_goal: "Understand the current question",
  conversation_summary: "Single-turn grounded experiment scenario",
};

export const GROUNDED_GATE_SCENARIOS: readonly GroundedGateScenario[] = [
  { scenario_id: "G01", question: "What is TNEA?", student_state: BEGINNER, expected_route: "RAG_GUIDANCE", expected_source_ids: ["RAG-A01"], constraints: { source_year: 2026 } },
  { scenario_id: "G02", question: "What is Choice Filling and why does order matter?", student_state: BEGINNER, expected_route: "RAG_GUIDANCE", expected_source_ids: ["RAG-A02"], constraints: { source_year: 2026 } },
  { scenario_id: "G03", question: "What is the difference between CSE and IT in CEG?", student_state: BEGINNER, expected_route: "RAG_GUIDANCE", expected_source_ids: ["RAG-A04"], constraints: { institution_scope: "UNIVERSITY_DEPARTMENTS" } },
  { scenario_id: "G04", question: "How is TNEA cutoff calculated?", student_state: BEGINNER, expected_route: "RAG_GUIDANCE", expected_source_ids: ["RAG-A01"], constraints: { source_year: 2026 } },
  { scenario_id: "G05", question: "My Maths is 86, Physics is 78 and Chemistry is 81. What is my cutoff?", student_state: { ...BEGINNER, known_inputs: { maths_mark: 86, physics_mark: 78, chemistry_mark: 81 } }, expected_route: "DETERMINISTIC_CUTOFF", expected_source_ids: [] },
  { scenario_id: "G06", question: "Am I eligible?", student_state: BEGINNER, expected_route: "DETERMINISTIC_ELIGIBILITY", expected_source_ids: [] },
  { scenario_id: "G07", question: "What is the current 2026 eligibility rule?", student_state: BEGINNER, expected_route: "EVIDENCE_DEFER", expected_source_ids: [], constraints: { source_year: 2026 }, fixture_mode: "STALE_ONLY" },
  { scenario_id: "G08", question: "What is Engineering?", student_state: BEGINNER, expected_route: "RAG_GUIDANCE", expected_source_ids: ["RAG-A08"], fixture_mode: "PROMPT_INJECTION" },
] as const;

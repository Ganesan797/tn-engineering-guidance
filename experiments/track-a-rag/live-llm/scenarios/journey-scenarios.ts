import type { Capability, Language } from "../../src/types.ts";
import type { GuidanceStage, KnowledgeStage, NextActionType } from "../src/types.ts";

export interface JourneyTurnDefinition {
  readonly student_text: string;
  readonly knowledge_stage: KnowledgeStage;
  readonly guidance_stage: GuidanceStage;
  readonly known_inputs: Readonly<Record<string, string | number | boolean | null>>;
  readonly unknown_inputs: readonly string[];
  readonly expected_route: Capability;
  readonly expected_next_action: NextActionType;
}

export interface JourneyDefinition {
  readonly journey_id: string;
  readonly language: Language;
  readonly purpose: string;
  readonly turns: readonly JourneyTurnDefinition[];
}

export const JOURNEY_SCENARIOS: readonly JourneyDefinition[] = [
  {
    journey_id: "J01", language: "TAMIL", purpose: "Zero-knowledge entry without premature form or recommendation",
    turns: [{
      student_text: "எனக்கு பொறியியல் பற்றி ஒன்றும் தெரியாது. பொறியியல் படிக்கலாம் என்று சொல்கிறார்கள்.",
      knowledge_stage: "ZERO_KNOWLEDGE", guidance_stage: "ZERO_KNOWLEDGE", known_inputs: {}, unknown_inputs: [],
      expected_route: "RAG_GUIDANCE", expected_next_action: "ASK_INPUT",
    }],
  },
  {
    journey_id: "J02", language: "ENGLISH", purpose: "Interest exploration without declaring a branch choice",
    turns: [{
      student_text: "I like computers and maths, but I don't really know what coding is.",
      knowledge_stage: "BEGINNER", guidance_stage: "EXPLORATION", known_inputs: { likes_computers: true, likes_maths: true }, unknown_inputs: ["coding_exposure"],
      expected_route: "RAG_GUIDANCE", expected_next_action: "ASK_INPUT",
    }],
  },
  {
    journey_id: "J03", language: "ENGLISH", purpose: "Transition to the existing deterministic cutoff capability",
    turns: [{
      student_text: "My Maths mark is 86, Physics is 78, and Chemistry is 81. What is my cutoff?",
      knowledge_stage: "INFORMED", guidance_stage: "INPUT_COLLECTION", known_inputs: { maths_mark: 86, physics_mark: 78, chemistry_mark: 81 }, unknown_inputs: [],
      expected_route: "DETERMINISTIC_CUTOFF", expected_next_action: "CALL_DETERMINISTIC_TOOL",
    }],
  },
  {
    journey_id: "J04", language: "ENGLISH", purpose: "Preserve an unknown required input and still offer a useful next step",
    turns: [{
      student_text: "I know my Maths and Chemistry marks, but I do not know my Physics mark yet.",
      knowledge_stage: "BEGINNER", guidance_stage: "INPUT_COLLECTION", known_inputs: { maths_mark: 86, physics_mark: null, chemistry_mark: 81 }, unknown_inputs: ["physics_mark"],
      expected_route: "RAG_GUIDANCE", expected_next_action: "ASK_INPUT",
    }],
  },
  {
    journey_id: "J05-EN", language: "ENGLISH", purpose: "English side of bilingual factual-fidelity review",
    turns: [{
      student_text: "I know nothing about engineering. What is it?",
      knowledge_stage: "ZERO_KNOWLEDGE", guidance_stage: "ZERO_KNOWLEDGE", known_inputs: {}, unknown_inputs: [],
      expected_route: "RAG_GUIDANCE", expected_next_action: "ASK_INPUT",
    }],
  },
  {
    journey_id: "J05-TA", language: "TAMIL", purpose: "Tamil side of bilingual factual-fidelity review",
    turns: [{
      student_text: "எனக்கு பொறியியல் பற்றி எதுவும் தெரியாது. பொறியியல் என்றால் என்ன?",
      knowledge_stage: "ZERO_KNOWLEDGE", guidance_stage: "ZERO_KNOWLEDGE", known_inputs: {}, unknown_inputs: [],
      expected_route: "RAG_GUIDANCE", expected_next_action: "ASK_INPUT",
    }],
  },
] as const;

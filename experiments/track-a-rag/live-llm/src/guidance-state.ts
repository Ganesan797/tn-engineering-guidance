import type { GuidanceStage } from "./types.ts";

const TRANSITIONS: Readonly<Record<GuidanceStage, readonly GuidanceStage[]>> = {
  ZERO_KNOWLEDGE: ["ORIENTATION"],
  ORIENTATION: ["EXPLORATION", "INPUT_COLLECTION", "NEXT_ACTION"],
  EXPLORATION: ["INPUT_COLLECTION", "NEXT_ACTION"],
  INPUT_COLLECTION: ["DETERMINISTIC_EVALUATION", "NEXT_ACTION"],
  DETERMINISTIC_EVALUATION: ["RESULT_EXPLANATION"],
  RESULT_EXPLANATION: ["INPUT_COLLECTION", "EXPLORATION", "NEXT_ACTION"],
  NEXT_ACTION: ["ORIENTATION", "EXPLORATION", "INPUT_COLLECTION", "DETERMINISTIC_EVALUATION"],
};

export function canTransition(from: GuidanceStage, to: GuidanceStage): boolean {
  return from === to || TRANSITIONS[from].includes(to);
}

export function requireGuidanceTransition(from: GuidanceStage, to: GuidanceStage): void {
  if (!canTransition(from, to)) throw new Error(`Invalid experiment guidance transition: ${from} -> ${to}`);
}

import { createGuidance, type GuidanceDependencies, type GuidanceResult } from "../application/guidance.ts";
import { blankReferenceRequest } from "../ui/reference-request.ts";

export const JOURNEY_FIELDS = [
  "year", "stream", "improvement", "improvement_year",
  "maths", "physics", "chemistry",
] as const;
export type JourneyField = (typeof JOURNEY_FIELDS)[number];
type Unknown = "unknown";
type Answer = number | boolean | "academic" | "other" | Unknown | null;

export interface JourneyState {
  readonly year: 2026 | "other" | Unknown | null;
  readonly stream: "academic" | "other" | Unknown | null;
  readonly improvement: boolean | Unknown | null;
  readonly improvement_year: number | Unknown | null;
  readonly maths: number | Unknown | null;
  readonly physics: number | Unknown | null;
  readonly chemistry: number | Unknown | null;
}

export const EMPTY_JOURNEY: JourneyState = {
  year: null, stream: null, improvement: null, improvement_year: null,
  maths: null, physics: null, chemistry: null,
};

const marks = ["maths", "physics", "chemistry"] as const;

export function nextJourneyQuestion(state: JourneyState): JourneyField | null {
  if (state.year === null) return "year";
  if (state.year !== 2026) return null;
  if (state.stream === null) return "stream";
  if (state.stream !== "academic") return null;
  if (state.improvement === null) return "improvement";
  if (state.improvement === "unknown") return null;
  if (state.improvement === true && state.improvement_year === null) return "improvement_year";
  if (state.improvement_year === "unknown") return null;
  for (const field of marks) {
    if (state[field] === null) return field;
    if (state[field] === "unknown") return null;
  }
  return null;
}

function valid(field: JourneyField, value: unknown): value is Answer {
  if (value === null || value === "unknown") return true;
  if (field === "year") return value === 2026 || value === "other";
  if (field === "stream") return value === "academic" || value === "other";
  if (field === "improvement") return typeof value === "boolean";
  if (field === "improvement_year") return typeof value === "number" && Number.isInteger(value) && value >= 1900 && value <= 2026;
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

// The browser holds only this small, untrusted answer set; validate it on every POST.
export function parseJourneyState(raw: string): JourneyState {
  if (raw.length > 1000) throw new Error("Journey state is too large");
  const parsed: unknown = JSON.parse(raw);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Journey state is invalid");
  const record = parsed as Record<string, unknown>;
  if (Object.keys(record).length !== JOURNEY_FIELDS.length ||
      !JOURNEY_FIELDS.every((field) => field in record && valid(field, record[field]))) {
    throw new Error("Journey state is invalid");
  }
  return record as unknown as JourneyState;
}

export function answerJourneyQuestion(state: JourneyState, raw: string): JourneyState {
  const field = nextJourneyQuestion(state);
  if (field === null) throw new Error("No question is waiting for an answer");
  let value: unknown = raw;
  if (field === "year") value = raw === "2026" ? 2026 : raw;
  else if (field === "improvement") value = raw === "yes" ? true : raw === "no" ? false : raw;
  else if (field === "improvement_year" || marks.includes(field as (typeof marks)[number])) {
    value = raw === "unknown" ? raw : /^\d{1,4}$/.test(raw) ? Number(raw) : raw;
  }
  if (value === null || !valid(field, value)) throw new Error("Please choose a valid answer");
  return { ...state, [field]: value };
}

export function retryUnknown(state: JourneyState): JourneyState {
  const field = JOURNEY_FIELDS.find((candidate) => state[candidate] === "unknown");
  return field ? { ...state, [field]: null } : state;
}

export function journeyGuidanceResult(
  state: JourneyState,
  dependencies: GuidanceDependencies,
): GuidanceResult | null {
  if (state.year !== 2026 || state.stream !== "academic") return null;
  const snapshot = dependencies.snapshots.snapshots()[0];
  const blank = blankReferenceRequest({ snapshot_id: snapshot.snapshot_id, snapshot_stage: snapshot.stage });
  const improvedAfter2005 = state.improvement === true && typeof state.improvement_year === "number" && state.improvement_year >= 2006;
  const entered = marks.map((field) => typeof state[field] === "number" ? state[field] : null);
  const profile = {
    ...blank.profile,
    qualifying_stream: "HSC_ACADEMIC" as const,
    improvement_marks_used: typeof state.improvement === "boolean" ? state.improvement : null,
    improvement_marks_year: typeof state.improvement_year === "number" ? state.improvement_year : null,
    ...(improvedAfter2005
      ? { original_maths_mark: entered[0], original_physics_mark: entered[1], original_chemistry_mark: entered[2] }
      : { maths_mark: entered[0], physics_mark: entered[1], chemistry_mark: entered[2] }),
  };
  return createGuidance({ ...blank, profile }, dependencies);
}

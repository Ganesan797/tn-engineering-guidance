import type { Capability } from "./types.ts";

const ELIGIBILITY_PATTERN =
  /\b(am i eligible|my eligibility|check (?:my )?eligibility)\b|எனக்கு.*தகுதி/iu;
const CUTOFF_PATTERN = /cut[ -]?off|கட்.?ஆஃப்/iu;
const PERSONAL_MARKS_PATTERN =
  /\b(my|marks?|maths|mathematics|physics|chemistry)\b|என்|மதிப்பெண்|கணிதம்|இயற்பியல்|வேதியியல்/iu;

export function routeQuestion(question: string): Capability {
  if (ELIGIBILITY_PATTERN.test(question)) return "DETERMINISTIC_ELIGIBILITY";
  if (CUTOFF_PATTERN.test(question) && PERSONAL_MARKS_PATTERN.test(question)) {
    return "DETERMINISTIC_CUTOFF";
  }
  return "RAG_GUIDANCE";
}

export function preserveDeterministicBoundary(
  route: Capability,
): boolean {
  const explicitCapabilities: readonly Capability[] = [
    "RAG_GUIDANCE",
    "DETERMINISTIC_CUTOFF",
    "DETERMINISTIC_ELIGIBILITY",
    "EVIDENCE_DEFER",
  ];
  return explicitCapabilities.includes(route);
}

import type { GuidanceResult } from "../application/guidance.ts";
import type { JourneyField, JourneyState } from "../m2/journey.ts";
import type { StudentLanguage } from "./models.ts";
import type { ExplanationSidecarV1 } from "../domain/explanation.ts";

export type JourneyAssessmentScope =
  | { readonly kind: "SUPPORTED" }
  | { readonly kind: "UNANSWERED" | "UNKNOWN" | "UNSUPPORTED"; readonly field: "year" | "stream" };
export type PersonalGuidanceCategory = "KNOWN_RESULT" | "MISSING_INFORMATION" |
  "UNKNOWN_INFORMATION" | "UNSUPPORTED_SCOPE" | "UNRESOLVED_CHECK" | "KNOWN_NEGATIVE_RESULT";
export type PersonalGuidanceAction = "PROVIDE_EXISTING_INPUT" | "RETRY_WHEN_KNOWN" |
  "CHECK_OFFICIAL_SCOPE" | "VERIFY_CONDITION" | "CONTINUE_PREPARATION";
export type JourneyInputState = "UNANSWERED" | "UNKNOWN" | "SUPPLIED";

// Created by the existing journey evaluation path, never reconstructed from result alone.
export interface JourneyGuidanceEvaluation {
  readonly context: {
    readonly answers: JourneyState;
    readonly inputs: Readonly<Record<JourneyField, JourneyInputState>>;
    readonly scope: JourneyAssessmentScope;
    readonly next_question: JourneyField | null;
    readonly retry_question: JourneyField | null;
  };
  readonly result: GuidanceResult | null;
  // Internal transport for later explanation mapping; never rendered directly.
  readonly explanation: ExplanationSidecarV1 | null;
}

// Candidate copy only. Every bilingual pair requires owner/human review before UI release.
export const PERSONAL_GUIDANCE_MESSAGES = {
  basis: { en: "Based on the information you entered.", ta: "நீங்கள் அளித்த தகவல்களின் அடிப்படையில்." },
  known: { en: "A checked result is available.", ta: "சரிபார்ப்பின் முடிவு கிடைத்துள்ளது." },
  missing: { en: "A required answer has not been supplied yet.", ta: "தேவையான ஒரு பதில் இன்னும் அளிக்கப்படவில்லை." },
  unknown: { en: "This answer is not known yet. It has not been guessed.", ta: "இந்தப் பதில் இன்னும் தெரியவில்லை. அதை ஊகிக்கவில்லை." },
  unsupported: { en: "This check does not assess the year or study path you selected.", ta: "நீங்கள் தேர்ந்தெடுத்த ஆண்டு அல்லது படிப்பு வழியை இந்தச் சரிபார்ப்பு மதிப்பிடாது." },
  unresolved: { en: "A checked condition cannot yet be confirmed here.", ta: "சரிபார்க்கப்பட்ட ஒரு நிபந்தனையை இங்கு இன்னும் உறுதிப்படுத்த முடியவில்லை." },
  negative: { en: "Based on your answers, a checked condition is not met.", ta: "உங்கள் பதில்களின் அடிப்படையில், சரிபார்க்கப்பட்ட ஒரு நிபந்தனை நிறைவேறவில்லை." },
  eligible: { en: "Based on your answers, the checked eligibility conditions are met. This does not guarantee admission.", ta: "உங்கள் பதில்களின் அடிப்படையில், சரிபார்க்கப்பட்ட தகுதி நிபந்தனைகள் நிறைவேறுகின்றன. இது சேர்க்கைக்கு உத்தரவாதம் அல்ல." },
  cutoff_unresolved: { en: "Your cutoff is available, but full eligibility is not confirmed. The cutoff alone does not confirm admission.", ta: "உங்கள் கட்-ஆஃப் கிடைத்துள்ளது; முழுத் தகுதி இன்னும் உறுதிப்படுத்தப்படவில்லை. கட்-ஆஃப் மட்டும் சேர்க்கையை உறுதிப்படுத்தாது." },
  original_marks: { en: "The check reports that the required original marks are unavailable.", ta: "தேவையான அசல் மதிப்பெண்கள் கிடைக்கவில்லை என்று சரிபார்ப்பு தெரிவிக்கிறது." },
  // HUMAN_REVIEW_PENDING: owner-supplied Tamil candidate; not language-release approval.
  normalization: { en: "This check cannot normalize marks across school boards using the available evidence.", ta: "கிடைத்துள்ள ஆதாரங்களைக் கொண்டு, வெவ்வேறு பள்ளி வாரியங்களின் மதிப்பெண்களை ஒரே அளவில் மாற்றிக் கணக்கிட இந்தச் சரிபார்ப்பால் முடியாது." },
  provide: { en: "Answer the existing question when you can.", ta: "முடியும்போது தற்போதுள்ள கேள்விக்குப் பதில் அளிக்கலாம்." },
  retry: { en: "Retry when you know the answer, or continue learning without guessing.", ta: "பதில் தெரிந்ததும் மீண்டும் முயலலாம்; அல்லது ஊகிக்காமல் தகவல்களைத் தொடர்ந்து அறியலாம்." },
  official: { en: "Check the official information for your year and study path.", ta: "உங்கள் ஆண்டு மற்றும் படிப்பு வழிக்கான அதிகாரப்பூர்வ தகவலைச் சரிபாருங்கள்." },
  verify: { en: "Check this condition against the official guidance.", ta: "இந்த நிபந்தனையை அதிகாரப்பூர்வ வழிகாட்டலுடன் சரிபாருங்கள்." },
  prepare: { en: "Continue with the existing preparation guidance.", ta: "தற்போதுள்ள தயாரிப்பு வழிகாட்டலைத் தொடரலாம்." },
} as const satisfies Record<string, Record<StudentLanguage, string>>;
export type PersonalGuidanceMessageKey = keyof typeof PERSONAL_GUIDANCE_MESSAGES;

export interface PersonalGuidanceIssue {
  readonly category: PersonalGuidanceCategory;
  readonly message: PersonalGuidanceMessageKey;
  // Internal trace only; no backend identifiers are interpolated into candidate messages.
  readonly trace: { readonly field?: JourneyField; readonly rule_id?: string; readonly reason_code?: string };
}
export interface PersonalGuidanceFoundation {
  readonly evaluation: JourneyGuidanceEvaluation;
  readonly basis: "basis";
  readonly primary: PersonalGuidanceIssue;
  readonly cutoff: number | null;
  readonly cutoff_eligibility_limit: "cutoff_unresolved" | null;
  readonly issues: readonly PersonalGuidanceIssue[];
  readonly checks: readonly PersonalGuidanceIssue[];
  readonly primary_action: { readonly kind: PersonalGuidanceAction; readonly message: PersonalGuidanceMessageKey; readonly field?: JourneyField };
  readonly human_review: "PENDING";
}

export function toPersonalGuidanceFoundation(evaluation: JourneyGuidanceEvaluation): PersonalGuidanceFoundation {
  const { context, result } = evaluation;
  const issues: PersonalGuidanceIssue[] = [];
  if (context.scope.kind !== "SUPPORTED") {
    const category = context.scope.kind === "UNSUPPORTED" ? "UNSUPPORTED_SCOPE"
      : context.scope.kind === "UNKNOWN" ? "UNKNOWN_INFORMATION" : "MISSING_INFORMATION";
    issues.push({ category, message: category === "UNSUPPORTED_SCOPE" ? "unsupported" : category === "UNKNOWN_INFORMATION" ? "unknown" : "missing", trace: { field: context.scope.field } });
  } else {
    if (context.next_question !== null) issues.push({ category: "MISSING_INFORMATION", message: "missing", trace: { field: context.next_question } });
    else if (context.retry_question !== null) issues.push({ category: "UNKNOWN_INFORMATION", message: "unknown", trace: { field: context.retry_question } });
  }
  const checks: PersonalGuidanceIssue[] = (result?.eligibility.checks ?? []).map((check) => {
    const trace = { rule_id: check.rule_id, reason_code: check.reason_code };
    if (check.outcome === "INELIGIBLE") return { category: "KNOWN_NEGATIVE_RESULT", message: "negative", trace };
    if (check.outcome === "ELIGIBLE") return { category: "KNOWN_RESULT", message: "known", trace };
    if (check.rule_id === "ELG032" && check.reason_code === "ELG032_REQUIRED_ORIGINAL_MARKS_UNAVAILABLE") {
      return { category: "MISSING_INFORMATION", message: "original_marks", trace };
    }
    if (check.rule_id === "ELG010" && check.reason_code === "ELG010_NORMALIZATION_FORMULA_NOT_DEFINED") {
      return { category: "UNRESOLVED_CHECK", message: "normalization", trace };
    }
    return { category: "UNRESOLVED_CHECK", message: "unresolved", trace };
  });
  issues.push(...checks.filter((check) => check.category !== "KNOWN_RESULT"));
  const negative = result?.eligibility.outcome === "INELIGIBLE";
  const primary: PersonalGuidanceIssue = negative
    ? { category: "KNOWN_NEGATIVE_RESULT", message: "negative", trace: {} }
    : issues.find((issue) => issue.trace.field !== undefined)
      ?? (result?.eligibility.outcome === "ELIGIBLE"
        ? { category: "KNOWN_RESULT", message: "eligible", trace: {} }
        : { category: "UNRESOLVED_CHECK", message: "unresolved", trace: {} });
  const fieldIssue = issues.find((issue) => issue.trace.field !== undefined);
  const primary_action: PersonalGuidanceFoundation["primary_action"] = negative
    ? { kind: "VERIFY_CONDITION", message: "verify" }
    : fieldIssue?.category === "UNSUPPORTED_SCOPE" ? { kind: "CHECK_OFFICIAL_SCOPE", message: "official" }
    : fieldIssue?.category === "UNKNOWN_INFORMATION" ? { kind: "RETRY_WHEN_KNOWN", message: "retry", field: fieldIssue.trace.field }
    : fieldIssue?.category === "MISSING_INFORMATION" ? { kind: "PROVIDE_EXISTING_INPUT", message: "provide", field: fieldIssue.trace.field }
    : result?.eligibility.outcome === "ELIGIBLE" ? { kind: "CONTINUE_PREPARATION", message: "prepare" }
    : { kind: "VERIFY_CONDITION", message: "verify" };
  return {
    evaluation, basis: "basis", primary, cutoff: result?.eligibility.cutoff ?? null,
    cutoff_eligibility_limit: result?.eligibility.cutoff !== null && result?.eligibility.cutoff !== undefined && result.eligibility.outcome === "NEEDS_REVIEW" ? "cutoff_unresolved" : null,
    issues, checks, primary_action, human_review: "PENDING",
  };
}

// Language changes only wording; semantic categories, actions and values are shared.
export function resolvePersonalGuidanceMessage(key: PersonalGuidanceMessageKey, language: StudentLanguage): string {
  return PERSONAL_GUIDANCE_MESSAGES[key][language];
}

import type { GuidanceResult } from "../application/guidance.ts";
import type { JourneyField, JourneyState } from "../m2/journey.ts";
import type { StudentLanguage } from "./models.ts";
import type { ExplanationSidecarV1 } from "../domain/explanation.ts";
import { personalClaimEvidence, type ClaimEvidence, type PresentationSourceRegistry } from "./provenance.ts";
import { buildThingsWorthChecking, type GeneralGuidanceOptions, type ThingsWorthChecking } from "./things-worth-checking.ts";

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

// CANDIDATE_PENDING_OWNER_REVIEW: candidate copy only. Every bilingual pair requires owner/human review before UI release.
export const PERSONAL_GUIDANCE_MESSAGES = {
  basis: { en: "Let us look at the details you entered.", ta: "நீங்கள் கொடுத்த விவரங்களை வைத்து பார்க்கலாம்." },
  known: { en: "A checked result is available.", ta: "சரிபார்ப்பின் முடிவு கிடைத்துள்ளது." },
  missing: { en: "You have not answered this question yet.", ta: "இந்தக் கேள்விக்கு இன்னும் பதில் கொடுக்கவில்லை." },
  unknown: { en: "You marked this answer as unknown. You can add it when you find out.", ta: "இந்தப் பதில் தெரியாது என்று குறிப்பிட்டுள்ளீர்கள். விவரம் தெரிந்ததும் சேர்க்கலாம்." },
  unsupported: { en: "Eligibility for the year or study path you selected cannot be assessed here.", ta: "நீங்கள் தேர்ந்தெடுத்த ஆண்டு அல்லது படிப்பு வழிக்கான தகுதியை இங்கு மதிப்பிட முடியாது." },
  unresolved: { en: "We cannot yet confirm whether this condition is met.", ta: "இந்த நிபந்தனை பொருந்துகிறதா என்று இன்னும் உறுதியாகச் சொல்ல முடியவில்லை." },
  negative: { en: "Based on your answers, one of the checked conditions is not met.", ta: "உங்கள் பதில்களின்படி, சரிபார்த்த நிபந்தனைகளில் ஒன்று நிறைவேறவில்லை." },
  eligible: { en: "Based on your answers, the eligibility conditions checked here are met. Other eligibility details and documents still need to be checked.", ta: "நீங்கள் கொடுத்த பதில்களின்படி, இங்கு பார்த்த தகுதி நிபந்தனைகள் பொருந்துகின்றன. மற்ற தகுதி விவரங்களும் சான்றுகளும் இன்னும் சரிபார்க்கப்பட வேண்டும்." },
  cutoff_unresolved: { en: "Your cutoff is available. Some details still need checking before full eligibility can be confirmed. The cutoff alone does not confirm admission.", ta: "உங்கள் கட்-ஆஃப் கிடைத்துள்ளது. முழுத் தகுதியை உறுதிப்படுத்த இன்னும் சில விவரங்களைச் சரிபார்க்க வேண்டும். கட்-ஆஃப் மட்டும் சேர்க்கையை உறுதிப்படுத்தாது." },
  original_marks: { en: "The original marks needed for the calculation are unavailable.", ta: "கணக்கிற்குத் தேவையான அசல் மதிப்பெண்கள் கிடைக்கவில்லை." },
  // HUMAN_REVIEW_PENDING: owner-supplied Tamil candidate; not language-release approval.
  normalization: { en: "This check cannot normalize marks across school boards using the available evidence.", ta: "கிடைத்துள்ள ஆதாரங்களைக் கொண்டு, வெவ்வேறு பள்ளி வாரியங்களின் மதிப்பெண்களை ஒரே அளவில் மாற்றிக் கணக்கிட இந்தச் சரிபார்ப்பால் முடியாது." },
  provide: { en: "If you know the answer, you can answer this question.", ta: "பதில் தெரிந்தால் இந்தக் கேள்விக்குப் பதில் கொடுக்கலாம்." },
  retry: { en: "You can add this detail when you know it. Until then, you can explore other guidance.", ta: "இந்த விவரம் தெரிந்ததும் சேர்க்கலாம். அதுவரை மற்ற வழிகாட்டலைப் பார்க்கலாம்." },
  official: { en: "Check the official information for your year and study path.", ta: "உங்கள் ஆண்டு மற்றும் படிப்பு வழிக்கான அதிகாரப்பூர்வ தகவலைச் சரிபாருங்கள்." },
  verify: { en: "Check this condition against the official guidance.", ta: "இந்த நிபந்தனையை அதிகாரப்பூர்வ வழிகாட்டலுடன் சரிபாருங்கள்." },
  verify_remaining: { en: "Check the remaining eligibility conditions in the official guidance.", ta: "மீதமுள்ள சேர்க்கைத் தகுதி நிபந்தனைகளை அதிகாரப்பூர்வ வழிகாட்டலில் சரிபார்க்கலாம்." },
  prepare: { en: "Next, you can see how to prepare for applying.", ta: "விண்ணப்பத்திற்கு எப்படித் தயாராகலாம் என்று அடுத்து பார்க்கலாம்." },
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
  readonly evidence: readonly ClaimEvidence[];
  readonly things_worth_checking: ThingsWorthChecking;
  readonly primary_action: { readonly kind: PersonalGuidanceAction; readonly message: PersonalGuidanceMessageKey; readonly field?: JourneyField };
  readonly human_review: "PENDING";
}

// Selection and visible projection must use this same validated journey scope.
export function journeyGeneralGuidanceOptions(evaluation: JourneyGuidanceEvaluation, options?: GeneralGuidanceOptions): GeneralGuidanceOptions | undefined {
  return options ? { ...options, admission_year: typeof evaluation.context.answers.year === "number" ? evaluation.context.answers.year : null } : undefined;
}

export function toPersonalGuidanceFoundation(evaluation: JourneyGuidanceEvaluation, sources?: PresentationSourceRegistry, generalGuidance?: GeneralGuidanceOptions): PersonalGuidanceFoundation {
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
    : { kind: "VERIFY_CONDITION", message: "verify_remaining" };
  return {
    evaluation, basis: "basis", primary, cutoff: result?.eligibility.cutoff ?? null,
    cutoff_eligibility_limit: result?.eligibility.cutoff !== null && result?.eligibility.cutoff !== undefined && result.eligibility.outcome === "NEEDS_REVIEW" ? "cutoff_unresolved" : null,
    issues, checks, evidence: result && sources ? personalClaimEvidence(result, sources) : [],
    things_worth_checking: buildThingsWorthChecking(journeyGeneralGuidanceOptions(evaluation, generalGuidance)), primary_action, human_review: "PENDING",
  };
}

// Language changes only wording; semantic categories, actions and values are shared.
export function resolvePersonalGuidanceMessage(key: PersonalGuidanceMessageKey, language: StudentLanguage): string {
  return PERSONAL_GUIDANCE_MESSAGES[key][language];
}

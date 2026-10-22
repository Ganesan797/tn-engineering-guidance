import type { QuestionCollection, QuestionLanguage } from "../ui/explore-questions.ts";
import {
  approvedContentClaimEvidence, studentEvidenceReference,
  type ApprovedContentReviewScope, type ClaimEvidence, type PresentationSourceRegistry,
} from "./provenance.ts";

// Wrapper copy only; canonical question/answer/next/limit text is referenced, not copied.
export const GENERAL_GUIDANCE_MESSAGES = {
  heading: { en: "Things worth checking", ta: "மேலும் அறிந்து சரிபார்க்க வேண்டியவை" },
  scope: { en: "General guidance only. These items do not confirm your eligibility, entitlement or admission.", ta: "இவை பொதுவான வழிகாட்டல்கள் மட்டுமே. உங்கள் தகுதி, சலுகை பெறும் உரிமை அல்லது சேர்க்கையை இவை உறுதிப்படுத்தாது." },
  usefulness: { en: "This general explanation may help you understand what to check next.", ta: "அடுத்து எதைச் சரிபார்க்கலாம் என்பதைப் புரிந்துகொள்ள இந்தப் பொதுவான விளக்கம் உதவலாம்." },
  empty: { en: "We do not have any reviewed additional guidance to show you here yet. This does not mean that no options exist. You can continue with the preparation guidance below.", ta: "இங்கே காட்டுவதற்கு மதிப்பாய்வு செய்யப்பட்ட கூடுதல் வழிகாட்டல் இப்போது இல்லை. அதனால் வாய்ப்புகள் இல்லை என்று நினைக்க வேண்டாம். கீழே உள்ள தயாரிப்பு வழிகாட்டலைத் தொடர்ந்து பார்க்கலாம்." },
} as const;
export type GeneralGuidanceMessageKey = keyof typeof GENERAL_GUIDANCE_MESSAGES;
export type ContentReviewStatus = "PASS_OWNER_REPORTED" | "PENDING" | "FIX_REQUIRED";

/** Trusted governance input, never a student request or a new content catalogue. */
export interface GeneralGuidanceSelection {
  readonly content_id: string;
  readonly scope: "GENERAL_EXPLANATION" | "SCHEME_OR_SUPPORT" | "PERSONAL_RESULT";
  readonly admission_year: number | null;
  readonly official_source_id: string;
  readonly review: ApprovedContentReviewScope & {
    readonly status: ContentReviewStatus;
    readonly languages: Readonly<Record<QuestionLanguage, ContentReviewStatus>>;
    // Explicitly reviewed as an official direction; registry membership alone is insufficient.
    readonly official_direction_approved: boolean;
  };
}
export interface GeneralGuidanceOptions {
  readonly collection: QuestionCollection;
  readonly sources: PresentationSourceRegistry;
  readonly content_version: string;
  readonly admission_year: number | null;
  readonly selections: readonly GeneralGuidanceSelection[];
}
interface CanonicalWordingReference {
  readonly content_id: string;
  readonly language: QuestionLanguage;
  readonly title: "question";
  readonly body: "answer";
  readonly next_direction: "next";
  readonly limit: "limit";
}
export interface GeneralGuidanceItem {
  readonly id: string;
  readonly output_class: "INFORMATION";
  readonly content_id: string;
  readonly wording: Readonly<Record<QuestionLanguage, CanonicalWordingReference>>;
  readonly why_it_may_be_useful: "usefulness";
  readonly official_next_direction: { readonly source_id: string; readonly url: string };
  readonly evidence: ClaimEvidence;
  readonly content_version: string;
  readonly content_review: "PASS_OWNER_REPORTED";
  readonly language_review: Readonly<Record<QuestionLanguage, "PASS_OWNER_REPORTED">>;
  readonly new_wording_review: "HUMAN_REVIEW_PENDING";
}
export interface ThingsWorthChecking {
  readonly output_class: "INFORMATION";
  readonly heading: "heading";
  readonly scope: "scope";
  readonly items: readonly GeneralGuidanceItem[];
  readonly empty_state: "empty" | null;
  readonly new_wording_review: "HUMAN_REVIEW_PENDING";
}

function safeText(text: string): boolean {
  return !/\b(?:SRC\d+|ELG\d+|NEEDS_REVIEW|UNKNOWN_OR_UNPUBLISHED|VERIFIED_PERSONAL_RESULT)\b|blocking_missing_fields|predicate/i.test(text);
}

export function buildThingsWorthChecking(options?: GeneralGuidanceOptions): ThingsWorthChecking {
  const items: GeneralGuidanceItem[] = [];
  const added = new Set<string>();
  if (options?.content_version) for (const selection of options.selections) {
    const { review, content_id } = selection;
    if (added.has(content_id) || selection.scope !== "GENERAL_EXPLANATION"
      || (selection.admission_year !== null && selection.admission_year !== options.admission_year)
      || review.status !== "PASS_OWNER_REPORTED" || review.languages.en !== "PASS_OWNER_REPORTED"
      || review.languages.ta !== "PASS_OWNER_REPORTED" || !review.official_direction_approved
      || review.version !== options.content_version || !review.review_reference || !review.content_ids.includes(content_id)) continue;
    const answer = options.collection.answers.get(content_id);
    if (!answer?.ta || answer.en.status !== "DIRECT" || answer.ta.status !== "DIRECT") continue;
    const texts = [answer.en, answer.ta];
    if (texts.some((text) => !text.question.trim() || !text.answer.trim() || !text.next.trim() || !text.limit.trim()
      || ![text.question, text.answer, text.next, text.limit].every(safeText))) continue;
    const official = options.sources.get(selection.official_source_id);
    if (!official || !answer.evidence.some(({ url }) => url === official.url)) continue;
    // A year-scoped item needs explicit evidence for that year, not an access/review date.
    if (selection.admission_year !== null && review.source_years[official.url] !== selection.admission_year) continue;
    let evidence: ClaimEvidence;
    // Unavailable or unsafe evidence excludes the item, never a raw fallback.
    try {
      evidence = approvedContentClaimEvidence(content_id, options.collection, review, options.sources);
      if (evidence.references.length === 0 || evidence.references.some((reference) => !reference.location || !reference.evidence_limit)) continue;
      evidence.references.forEach(studentEvidenceReference);
    } catch { continue; }
    const wording = (language: QuestionLanguage): CanonicalWordingReference => ({ content_id, language, title: "question", body: "answer", next_direction: "next", limit: "limit" });
    items.push({
      id: `general-guidance.${content_id}`, output_class: "INFORMATION", content_id,
      wording: { en: wording("en"), ta: wording("ta") }, why_it_may_be_useful: "usefulness",
      official_next_direction: { source_id: official.source_id, url: official.url }, evidence,
      content_version: review.version, content_review: "PASS_OWNER_REPORTED",
      language_review: { en: "PASS_OWNER_REPORTED", ta: "PASS_OWNER_REPORTED" }, new_wording_review: "HUMAN_REVIEW_PENDING",
    });
    added.add(content_id);
  }
  return { output_class: "INFORMATION", heading: "heading", scope: "scope", items, empty_state: items.length ? null : "empty", new_wording_review: "HUMAN_REVIEW_PENDING" };
}

/** Plain data projection for a later reviewed UI; no HTML or personal-result inference. */
export function studentThingsWorthChecking(options: GeneralGuidanceOptions | undefined, language: QuestionLanguage = "ta") {
  // Reapply governance at resolution time; do not trust a previously constructed item's status.
  const section = buildThingsWorthChecking(options);
  const message = (key: GeneralGuidanceMessageKey) => GENERAL_GUIDANCE_MESSAGES[key][language];
  return {
    heading: message(section.heading), scope: message(section.scope),
    empty_state: section.empty_state ? message(section.empty_state) : null,
    items: section.items.map((item) => {
      const wording = options!.collection.answers.get(item.content_id)![language]!;
      return {
        title: wording.question, body: wording.answer, why_it_may_be_useful: message(item.why_it_may_be_useful),
        next_direction: wording.next, limit: wording.limit, official_url: item.official_next_direction.url,
        evidence: item.evidence.references.map(studentEvidenceReference),
      };
    }),
  };
}

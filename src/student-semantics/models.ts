import type { GuidanceResult } from "../application/guidance.ts";
import type { EligibilityOutcome } from "../domain/enums.ts";
import type { EligibilityCheck } from "../domain/models.ts";
import type { EvidenceReference } from "../recommendation/foundation.ts";
import type { EntrySemanticKey } from "./entry-catalogue.ts";

export const STUDENT_LANGUAGES = ["en", "ta"] as const;
export type StudentLanguage = (typeof STUDENT_LANGUAGES)[number];

export type StudentSemanticKey =
  | EntrySemanticKey
  | "guidance.eligibility.eligible"
  | "guidance.eligibility.ineligible"
  | "guidance.eligibility.needs_review"
  | "guidance.cutoff.value"
  | "content.awareness.engineering_choices.title"
  | "content.awareness.engineering_choices.body";

export interface StudentSemanticMessage {
  readonly key: StudentSemanticKey;
  readonly parameters?: Readonly<Record<string, string | number>>;
}

export interface VerifiedPersonalResultView {
  readonly output_class: "VERIFIED_PERSONAL_RESULT";
  readonly origin: "DETERMINISTIC_GUIDANCE_RESULT";
  readonly internal_outcome: EligibilityOutcome;
  readonly primary_message: StudentSemanticMessage;
  readonly cutoff_value: number | null;
  readonly cutoff_message: StudentSemanticMessage | null;
  readonly blocking_missing_fields: readonly string[];
  readonly explanations: readonly EligibilityCheck[];
  readonly student_checks: readonly StudentEligibilityCheckView[];
  readonly evidence: readonly EvidenceReference[];
}

export interface StudentEligibilityCheckView {
  readonly title: string;
  readonly result_text: "Satisfied" | "Not satisfied" | "More information needed";
  readonly explanation: string;
  readonly rule_reference: string;
  readonly source_id: string;
  readonly source_page: number | null;
}

export interface StudentGuidanceSemanticView {
  readonly verified_result: VerifiedPersonalResultView;
  readonly trusted_result: GuidanceResult;
}

export interface InformationalContentItem {
  readonly output_class: "INFORMATION";
  readonly content_id: string;
  readonly version: string;
  readonly title: StudentSemanticMessage;
  readonly body: StudentSemanticMessage;
  readonly provenance: {
    readonly document_id: string;
    readonly section: string;
  };
  readonly governance_status: "M0_REVIEW_PROOF_NOT_PILOT_READY";
}

export function isVerifiedPersonalResult(
  value: VerifiedPersonalResultView | InformationalContentItem,
): value is VerifiedPersonalResultView {
  return value.output_class === "VERIFIED_PERSONAL_RESULT";
}

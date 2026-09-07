import type { GuidanceResult } from "../application/guidance.ts";
import type {
  StudentGuidanceSemanticView,
  StudentSemanticKey,
} from "./models.ts";

const OUTCOME_MESSAGE: Readonly<
  Record<GuidanceResult["eligibility"]["outcome"], StudentSemanticKey>
> = {
  ELIGIBLE: "guidance.eligibility.eligible",
  INELIGIBLE: "guidance.eligibility.ineligible",
  NEEDS_REVIEW: "guidance.eligibility.needs_review",
};

const CHECK_TITLES: Readonly<Record<string, string>> = {
  ELG001: "Qualifying study type",
  ELG002: "Tamil Nadu study history",
  ELG003: "Tamil Nadu nativity and study history",
  ELG004: "Parent's Tamil Nadu service evidence",
  ELG005: "Parent's employment and supporting evidence",
  ELG006: "Classes VIII to XII study history",
  ELG007: "Academic-stream marks",
  ELG008: "Vocational-stream subjects and marks",
  ELG009: "TNEA cutoff calculation",
  ELG010: "Cross-board mark normalization",
  ELG011: "Parent declaration evidence",
  ELG012: "Tamil Nadu study-duration evidence",
  ELG013: "OCI/PIO and Tamil Nadu nativity evidence",
  ELG014: "Open Competition classification",
  ELG015: "Nativity-pathway documents",
  ELG016: "Minimum academic marks requirement",
  ELG017: "Minimum academic marks requirement",
  ELG018: "Minimum academic marks requirement",
  ELG019: "Minimum academic marks requirement",
  ELG020: "Minimum vocational marks requirement",
  ELG021: "Minimum vocational marks requirement",
  ELG022: "Minimum vocational marks requirement",
  ELG023: "Minimum vocational marks requirement",
  ELG024: "Eligible vocational subject group",
  ELG025: "Eligible vocational subject group",
  ELG026: "Eligible vocational subject group",
  ELG027: "Eligible vocational subject group",
  ELG028: "Eligible vocational subject group",
  ELG029: "Eligible vocational subject group",
  ELG030: "Marks shown as grades",
  ELG031: "Minimum-mark comparison method",
  ELG032: "Improvement-mark treatment",
};

const CHECK_RESULT_TEXT = {
  ELIGIBLE: "Satisfied",
  INELIGIBLE: "Not satisfied",
  NEEDS_REVIEW: "More information needed",
} as const;

export function toStudentGuidanceSemanticView(
  result: GuidanceResult,
): StudentGuidanceSemanticView {
  const cutoff = result.eligibility.cutoff;
  return {
    verified_result: {
      output_class: "VERIFIED_PERSONAL_RESULT",
      origin: "DETERMINISTIC_GUIDANCE_RESULT",
      internal_outcome: result.eligibility.outcome,
      primary_message: { key: OUTCOME_MESSAGE[result.eligibility.outcome] },
      cutoff_value: cutoff,
      cutoff_message:
        cutoff === null
          ? null
          : { key: "guidance.cutoff.value", parameters: { cutoff } },
      blocking_missing_fields: [...result.eligibility.blocking_missing_fields],
      explanations: result.eligibility.checks.map((check) => ({ ...check })),
      student_checks: result.eligibility.checks.map((check) => ({
        title: CHECK_TITLES[check.rule_id] ?? "Eligibility check",
        result_text: CHECK_RESULT_TEXT[check.outcome],
        explanation: check.explanation,
        rule_reference: check.rule_id,
        source_id: check.source_id,
        source_page: check.source_page,
      })),
      evidence: result.provenance.map((reference) => ({ ...reference })),
    },
    trusted_result: result,
  };
}

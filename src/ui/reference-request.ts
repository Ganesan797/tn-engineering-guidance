import type { GuidanceRequest } from "../application/guidance.ts";

export function blankReferenceRequest(
  evidence: Pick<GuidanceRequest["counselling"], "snapshot_id" | "snapshot_stage">,
): GuidanceRequest {
  return {
    profile: {
      maths_mark: null, physics_mark: null, chemistry_mark: null,
      original_maths_mark: null, original_physics_mark: null, original_chemistry_mark: null,
      qualifying_stream: null, community: null, govt_school_7_5: null,
      tamil_nadu_native: null, nativity_certificate_available: null,
      nativity_exception_type: null, studied_in_tamil_nadu: null,
      study_history_evidence_available: null, parent_evidence_available: null,
      required_documents_available: null, parent_tn_service_years: null,
      parent_employer_certificate_available: null, parent_self_declaration_available: null,
      refugee_identification_available: null, oci_pio_card_available: null,
      vocational_subject_group_code: null, vocational_related_subject_mark: null,
      vocational_theory_mark: null, vocational_practical_mark: null,
      original_vocational_related_subject_mark: null, original_vocational_theory_mark: null,
      original_vocational_practical_mark: null, grade_certificate_used: null,
      actual_marks_available: null, improvement_marks_used: null,
      improvement_marks_year: null,
      tn_study_years_or_classes: {
        class_8_in_tn: null, class_9_in_tn: null, class_10_in_tn: null,
        class_11_in_tn: null, class_12_in_tn: null,
      },
    },
    // Explicit capability request, not inferred personal facts.
    eligibility_request: {
      academic_merit_cutoff_requested: true,
      normalized_cross_board_merit_ranking_requested: false,
      govt_school_7_5_entitlement_requested: false,
    },
    preferences: { branch_preference_order: null },
    // Dataset selection comes from the runtime; student counselling context stays unknown.
    counselling: {
      snapshot_id: evidence.snapshot_id, snapshot_stage: evidence.snapshot_stage,
      round: null, reservation_category: null, quota: null,
    },
  };
}

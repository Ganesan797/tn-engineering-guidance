import type { StudentProfile } from "../../../../src/domain/models.ts";
import { invokeDeterministicEligibility } from "../../src/deterministic-adapter.ts";

// Experiment-only bridge. It supplies unknown/null for every field the student did
// not provide and delegates all calculation to the existing deterministic engine.
export function evaluateAcademicMarksForLiveGate(
  mathsMark: number,
  physicsMark: number,
  chemistryMark: number,
) {
  const unknownClasses = {
    class_8_in_tn: null,
    class_9_in_tn: null,
    class_10_in_tn: null,
    class_11_in_tn: null,
    class_12_in_tn: null,
  } as const;
  const profile: StudentProfile = {
    maths_mark: mathsMark,
    physics_mark: physicsMark,
    chemistry_mark: chemistryMark,
    original_maths_mark: null,
    original_physics_mark: null,
    original_chemistry_mark: null,
    qualifying_stream: "HSC_ACADEMIC",
    community: null,
    govt_school_7_5: null,
    tamil_nadu_native: null,
    nativity_certificate_available: null,
    nativity_exception_type: null,
    studied_in_tamil_nadu: null,
    study_history_evidence_available: null,
    parent_evidence_available: null,
    required_documents_available: null,
    parent_tn_service_years: null,
    parent_employer_certificate_available: null,
    parent_self_declaration_available: null,
    refugee_identification_available: null,
    oci_pio_card_available: null,
    vocational_subject_group_code: null,
    vocational_related_subject_mark: null,
    vocational_theory_mark: null,
    vocational_practical_mark: null,
    original_vocational_related_subject_mark: null,
    original_vocational_theory_mark: null,
    original_vocational_practical_mark: null,
    grade_certificate_used: null,
    actual_marks_available: null,
    improvement_marks_used: null,
    improvement_marks_year: null,
    tn_study_years_or_classes: unknownClasses,
  };
  return invokeDeterministicEligibility(profile, {
    academic_merit_cutoff_requested: true,
    normalized_cross_board_merit_ranking_requested: false,
    govt_school_7_5_entitlement_requested: false,
  });
}

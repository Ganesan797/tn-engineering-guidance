import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import type {
  AdmissionSeatFact,
  StudentProfile,
} from "../../src/domain/models.ts";

export function studentProfile(
  overrides: Partial<StudentProfile> = {},
): StudentProfile {
  return {
    maths_mark: null,
    physics_mark: null,
    chemistry_mark: null,
    original_maths_mark: null,
    original_physics_mark: null,
    original_chemistry_mark: null,
    qualifying_stream: null,
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
    tn_study_years_or_classes: {
      class_8_in_tn: null,
      class_9_in_tn: null,
      class_10_in_tn: null,
      class_11_in_tn: null,
      class_12_in_tn: null,
    },
    ...overrides,
  };
}

export function seatFact(
  overrides: Partial<AdmissionSeatFact> = {},
): AdmissionSeatFact {
  return {
    admission_year: ADMISSION_YEAR,
    tnea_college_code: "0001",
    branch_id: "CSE",
    fact_type: "SANCTIONED_INTAKE",
    seat_count: 60,
    round: null,
    reservation_category: null,
    quota: null,
    source_id: "SRC002",
    source_page: 1,
    ...overrides,
  };
}

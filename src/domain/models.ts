import type { AdmissionYear } from "./constants.ts";
import type {
  Community,
  EligibilityOutcome,
  NativityExceptionType,
  QualifyingStream,
  Quota,
  ReservationCategory,
  SeatFactType,
  VocationalSubjectGroupCode,
} from "./enums.ts";

export interface TnStudyYearsOrClasses {
  readonly class_8_in_tn: boolean | null;
  readonly class_9_in_tn: boolean | null;
  readonly class_10_in_tn: boolean | null;
  readonly class_11_in_tn: boolean | null;
  readonly class_12_in_tn: boolean | null;
}

export interface StudentProfile {
  readonly maths_mark: number | null;
  readonly physics_mark: number | null;
  readonly chemistry_mark: number | null;
  readonly original_maths_mark: number | null;
  readonly original_physics_mark: number | null;
  readonly original_chemistry_mark: number | null;
  readonly qualifying_stream: QualifyingStream | null;
  readonly community: Community | null;
  readonly govt_school_7_5: boolean | null;
  readonly tamil_nadu_native: boolean | null;
  readonly nativity_certificate_available: boolean | null;
  readonly nativity_exception_type: NativityExceptionType | null;
  readonly studied_in_tamil_nadu: boolean | null;
  readonly study_history_evidence_available: boolean | null;
  readonly parent_evidence_available: boolean | null;
  readonly required_documents_available: boolean | null;
  readonly parent_tn_service_years: number | null;
  readonly parent_employer_certificate_available: boolean | null;
  readonly parent_self_declaration_available: boolean | null;
  readonly refugee_identification_available: boolean | null;
  readonly oci_pio_card_available: boolean | null;
  readonly vocational_subject_group_code: VocationalSubjectGroupCode | null;
  readonly vocational_related_subject_mark: number | null;
  readonly vocational_theory_mark: number | null;
  readonly vocational_practical_mark: number | null;
  readonly original_vocational_related_subject_mark: number | null;
  readonly original_vocational_theory_mark: number | null;
  readonly original_vocational_practical_mark: number | null;
  readonly grade_certificate_used: boolean | null;
  readonly actual_marks_available: boolean | null;
  readonly improvement_marks_used: boolean | null;
  readonly improvement_marks_year: number | null;
  readonly tn_study_years_or_classes: TnStudyYearsOrClasses;
}

export interface EligibilityCheck {
  readonly rule_id: string;
  readonly outcome: EligibilityOutcome;
  readonly reason_code: string;
  readonly explanation: string;
  readonly source_id: string;
  readonly source_page: number | null;
  readonly source_year: AdmissionYear;
}

export interface EligibilityResult {
  readonly outcome: EligibilityOutcome;
  readonly cutoff: number | null;
  readonly checks: readonly EligibilityCheck[];
  readonly blocking_missing_fields: readonly string[];
  readonly matched_rule_ids: readonly string[];
}

export interface AdmissionSeatFact {
  readonly admission_year: AdmissionYear;
  readonly tnea_college_code: string;
  readonly branch_id: string;
  readonly fact_type: SeatFactType;
  readonly seat_count: number;
  readonly round: number | null;
  readonly reservation_category: ReservationCategory | null;
  readonly quota: Quota | null;
  readonly source_id: string;
  readonly source_page: number | null;
}

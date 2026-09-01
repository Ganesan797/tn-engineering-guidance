import type { GuidanceRequest } from "../application/guidance.ts";
import { PILOT_DEMO_SNAPSHOT_ID, PILOT_DEMO_SNAPSHOT_STAGE } from "../application/pilot-runtime.ts";
import type { StudentProfile } from "../domain/models.ts";

export const DEMO_SCENARIO_NAMES = [
  "eligible",
  "ineligible",
  "needs-review",
  "unknown-vacancy",
] as const;
export type DemoScenarioName = (typeof DEMO_SCENARIO_NAMES)[number];

function emptyProfile(): StudentProfile {
  return {
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
  };
}

function eligibleProfile(): StudentProfile {
  return {
    ...emptyProfile(),
    maths_mark: 90,
    physics_mark: 80,
    chemistry_mark: 70,
    qualifying_stream: "HSC_ACADEMIC",
    community: "GENERAL",
    govt_school_7_5: false,
    tamil_nadu_native: true,
    nativity_exception_type: "NONE",
    grade_certificate_used: false,
    improvement_marks_used: false,
    tn_study_years_or_classes: {
      class_8_in_tn: true, class_9_in_tn: true, class_10_in_tn: true,
      class_11_in_tn: true, class_12_in_tn: true,
    },
  };
}

function baseRequest(profile: StudentProfile): GuidanceRequest {
  return {
    profile,
    eligibility_request: {
      academic_merit_cutoff_requested: true,
      normalized_cross_board_merit_ranking_requested: false,
      govt_school_7_5_entitlement_requested: false,
    },
    preferences: { branch_preference_order: ["ECE", "CSE", "MECH"] },
    counselling: {
      snapshot_id: PILOT_DEMO_SNAPSHOT_ID,
      snapshot_stage: PILOT_DEMO_SNAPSHOT_STAGE,
      round: null,
      reservation_category: null,
      quota: null,
    },
  };
}

export function demoScenario(name: DemoScenarioName): GuidanceRequest {
  if (name === "needs-review") return baseRequest(emptyProfile());
  const profile = eligibleProfile();
  if (name === "ineligible") {
    return baseRequest({ ...profile, maths_mark: 10, physics_mark: 10, chemistry_mark: 10 });
  }
  return baseRequest(profile);
}

export const QUALIFYING_STREAMS = [
  "HSC_ACADEMIC",
  "HSC_VOCATIONAL",
  "EQUIVALENT_ACADEMIC",
  "EQUIVALENT_VOCATIONAL",
] as const;
export type QualifyingStream = (typeof QUALIFYING_STREAMS)[number];

export const NATIVITY_EXCEPTION_TYPES = [
  "NONE",
  "TN_NATIVE_STUDIED_OUTSIDE_TN",
  "CENTRAL_GOVT_EMPLOYEE_CHILD",
  "PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD",
  "ALL_INDIA_SERVICE_TN_CADRE_CHILD",
  "OTHER_STATE_STUDIED_IN_TN",
  "SRI_LANKAN_TAMIL_REFUGEE",
  "OCI_PIO_TN_NATIVE",
] as const;
export type NativityExceptionType = (typeof NATIVITY_EXCEPTION_TYPES)[number];

export const ELIGIBILITY_OUTCOMES = [
  "ELIGIBLE",
  "INELIGIBLE",
  "NEEDS_REVIEW",
] as const;
export type EligibilityOutcome = (typeof ELIGIBILITY_OUTCOMES)[number];

export const COMMUNITIES = [
  "GENERAL",
  "BC",
  "BCM",
  "MBC",
  "DNC",
  "SC",
  "SCA",
  "ST",
] as const;
export type Community = (typeof COMMUNITIES)[number];

export const VOCATIONAL_SUBJECT_GROUP_CODES = [
  "2921",
  "2971",
  "2922",
  "2972",
  "2923",
  "2973",
  "2924",
  "2974",
  "2925",
  "2975",
  "2926",
  "2976",
] as const;
export type VocationalSubjectGroupCode =
  (typeof VOCATIONAL_SUBJECT_GROUP_CODES)[number];

export const SEAT_FACT_TYPES = [
  "SANCTIONED_INTAKE",
  "CURRENT_VACANCY",
  "QUOTA_VACANCY",
] as const;
export type SeatFactType = (typeof SEAT_FACT_TYPES)[number];

export const QUOTAS = ["GENERAL", "GOVT_SCHOOL_7_5"] as const;
export type Quota = (typeof QUOTAS)[number];

export const RESERVATION_CATEGORIES = [
  "OC",
  "BC",
  "BCM",
  "MBC",
  "SC",
  "SCA",
  "ST",
] as const;
export type ReservationCategory = (typeof RESERVATION_CATEGORIES)[number];

export function isFrozenEnumValue<const T extends readonly string[]>(
  values: T,
  candidate: unknown,
): candidate is T[number] {
  return (
    typeof candidate === "string" &&
    (values as readonly string[]).includes(candidate)
  );
}

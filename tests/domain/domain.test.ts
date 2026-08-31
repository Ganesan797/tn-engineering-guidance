import assert from "node:assert/strict";
import test from "node:test";

import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import {
  COMMUNITIES,
  ELIGIBILITY_OUTCOMES,
  NATIVITY_EXCEPTION_TYPES,
  QUALIFYING_STREAMS,
  QUOTAS,
  RESERVATION_CATEGORIES,
  SEAT_FACT_TYPES,
  VOCATIONAL_SUBJECT_GROUP_CODES,
} from "../../src/domain/enums.ts";
import { studentProfile } from "./fixtures.ts";

test("ADMISSION_YEAR is frozen at 2026", () => {
  assert.equal(ADMISSION_YEAR, 2026);
});

test("eligibility outcome vocabulary is exact and excludes UNKNOWN", () => {
  assert.deepEqual(ELIGIBILITY_OUTCOMES, [
    "ELIGIBLE",
    "INELIGIBLE",
    "NEEDS_REVIEW",
  ]);
  assert.equal(ELIGIBILITY_OUTCOMES.includes("UNKNOWN" as never), false);
});

test("all runtime enum values match the frozen contract", () => {
  assert.deepEqual(QUALIFYING_STREAMS, [
    "HSC_ACADEMIC",
    "HSC_VOCATIONAL",
    "EQUIVALENT_ACADEMIC",
    "EQUIVALENT_VOCATIONAL",
  ]);
  assert.deepEqual(NATIVITY_EXCEPTION_TYPES, [
    "NONE",
    "TN_NATIVE_STUDIED_OUTSIDE_TN",
    "CENTRAL_GOVT_EMPLOYEE_CHILD",
    "PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD",
    "ALL_INDIA_SERVICE_TN_CADRE_CHILD",
    "OTHER_STATE_STUDIED_IN_TN",
    "SRI_LANKAN_TAMIL_REFUGEE",
    "OCI_PIO_TN_NATIVE",
  ]);
  assert.deepEqual(COMMUNITIES, [
    "GENERAL",
    "BC",
    "BCM",
    "MBC",
    "DNC",
    "SC",
    "SCA",
    "ST",
  ]);
  assert.deepEqual(VOCATIONAL_SUBJECT_GROUP_CODES, [
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
  ]);
  assert.deepEqual(SEAT_FACT_TYPES, [
    "SANCTIONED_INTAKE",
    "CURRENT_VACANCY",
    "QUOTA_VACANCY",
  ]);
  assert.deepEqual(QUOTAS, ["GENERAL", "GOVT_SCHOOL_7_5"]);
  assert.deepEqual(RESERVATION_CATEGORIES, [
    "OC",
    "BC",
    "BCM",
    "MBC",
    "SC",
    "SCA",
    "ST",
  ]);
});

test("StudentProfile preserves null and false as distinct values", () => {
  const unknown = studentProfile({ tamil_nadu_native: null });
  const explicitlyFalse = studentProfile({ tamil_nadu_native: false });

  assert.equal(unknown.tamil_nadu_native, null);
  assert.equal(explicitlyFalse.tamil_nadu_native, false);
  assert.notEqual(unknown.tamil_nadu_native, explicitlyFalse.tamil_nadu_native);
});

test("StudentProfile has no admission_year field", () => {
  assert.equal("admission_year" in studentProfile(), false);
});

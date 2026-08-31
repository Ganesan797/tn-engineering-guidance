import assert from "node:assert/strict";
import test from "node:test";

import { assertAdmissionSeatFact } from "../../src/domain/admission-seat-fact.ts";
import { DomainValidationError } from "../../src/domain/validation.ts";
import { seatFact } from "./fixtures.ts";

test("canonical identifiers are required", () => {
  assert.throws(
    () => assertAdmissionSeatFact(seatFact({ tnea_college_code: "" })),
    DomainValidationError,
  );
  assert.throws(
    () => assertAdmissionSeatFact(seatFact({ branch_id: "" })),
    DomainValidationError,
  );
});

test("admission year must be exactly 2026", () => {
  assert.throws(
    () => assertAdmissionSeatFact(seatFact({ admission_year: 2025 as never })),
    DomainValidationError,
  );
});

test("seat fact provenance is required", () => {
  assert.throws(
    () => assertAdmissionSeatFact(seatFact({ source_id: "" })),
    DomainValidationError,
  );
});

test("SANCTIONED_INTAKE cannot carry vacancy semantics", () => {
  assert.doesNotThrow(() => assertAdmissionSeatFact(seatFact()));
  assert.throws(
    () => assertAdmissionSeatFact(seatFact({ round: 1 })),
    /round to be null/,
  );
  assert.throws(
    () => assertAdmissionSeatFact(seatFact({ quota: "GENERAL" })),
    /quota to be null/,
  );
});

test("CURRENT_VACANCY cannot carry quota-vacancy semantics", () => {
  assert.doesNotThrow(() =>
    assertAdmissionSeatFact(
      seatFact({ fact_type: "CURRENT_VACANCY", round: 1 }),
    ),
  );
  assert.throws(
    () =>
      assertAdmissionSeatFact(
        seatFact({ fact_type: "CURRENT_VACANCY", quota: "GENERAL" }),
      ),
    /cannot carry quota-specific vacancy semantics/,
  );
});

test("QUOTA_VACANCY requires an explicit quota", () => {
  assert.throws(
    () =>
      assertAdmissionSeatFact(
        seatFact({ fact_type: "QUOTA_VACANCY", quota: null }),
      ),
    /requires quota/,
  );
  assert.doesNotThrow(() =>
    assertAdmissionSeatFact(
      seatFact({ fact_type: "QUOTA_VACANCY", quota: "GOVT_SCHOOL_7_5" }),
    ),
  );
});

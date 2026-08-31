import assert from "node:assert/strict";
import test from "node:test";

import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import {
  aggregateEligibilityOutcome,
  assertEligibilityResult,
} from "../../src/domain/eligibility.ts";
import type { EligibilityCheck } from "../../src/domain/models.ts";
import { DomainValidationError } from "../../src/domain/validation.ts";

function check(
  rule_id: string,
  outcome: EligibilityCheck["outcome"],
): EligibilityCheck {
  return {
    rule_id,
    outcome,
    reason_code: `${rule_id}_${outcome}`,
    explanation: `${rule_id} produced ${outcome}`,
    source_id: "SRC002",
    source_page: 2,
    source_year: ADMISSION_YEAR,
  };
}

test("aggregation gives INELIGIBLE highest priority", () => {
  assert.equal(
    aggregateEligibilityOutcome([
      check("ELG002", "NEEDS_REVIEW"),
      check("ELG016", "INELIGIBLE"),
    ]),
    "INELIGIBLE",
  );
});

test("aggregation conservatively falls back to NEEDS_REVIEW", () => {
  assert.equal(
    aggregateEligibilityOutcome([check("ELG002", "NEEDS_REVIEW")]),
    "NEEDS_REVIEW",
  );
  assert.equal(
    aggregateEligibilityOutcome(
      [check("ELG016", "ELIGIBLE")],
      ["tn_study_years_or_classes.class_8_in_tn"],
    ),
    "NEEDS_REVIEW",
  );
});

test("aggregation returns ELIGIBLE only when no blocker remains", () => {
  assert.equal(
    aggregateEligibilityOutcome([
      check("ELG002", "ELIGIBLE"),
      check("ELG016", "ELIGIBLE"),
    ]),
    "ELIGIBLE",
  );
});

test("EligibilityResult requires check provenance", () => {
  assert.throws(
    () =>
      assertEligibilityResult({
        outcome: "ELIGIBLE",
        cutoff: null,
        checks: [{ ...check("ELG016", "ELIGIBLE"), source_id: "" }],
        blocking_missing_fields: [],
        matched_rule_ids: ["ELG016"],
      }),
    DomainValidationError,
  );
});

test("EligibilityResult check source year is fixed to 2026", () => {
  assert.throws(
    () =>
      assertEligibilityResult({
        outcome: "ELIGIBLE",
        cutoff: null,
        checks: [
          { ...check("ELG016", "ELIGIBLE"), source_year: 2025 as never },
        ],
        blocking_missing_fields: [],
        matched_rule_ids: ["ELG016"],
      }),
    DomainValidationError,
  );
});

test("EligibilityResult must match conservative aggregation", () => {
  assert.throws(
    () =>
      assertEligibilityResult({
        outcome: "ELIGIBLE",
        cutoff: null,
        checks: [check("ELG002", "NEEDS_REVIEW")],
        blocking_missing_fields: [],
        matched_rule_ids: ["ELG002"],
      }),
    /conservative aggregate NEEDS_REVIEW/,
  );
});

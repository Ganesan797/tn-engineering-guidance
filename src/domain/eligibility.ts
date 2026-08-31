import { ADMISSION_YEAR } from "./constants.ts";
import { ELIGIBILITY_OUTCOMES, isFrozenEnumValue } from "./enums.ts";
import type {
  EligibilityCheck,
  EligibilityOutcome,
  EligibilityResult,
} from "./models.ts";
import {
  DomainValidationError,
  requireNonEmptyString,
  requireNullableInteger,
} from "./validation.ts";

export function aggregateEligibilityOutcome(
  requiredApplicableChecks: readonly Pick<EligibilityCheck, "outcome">[],
  blockingMissingFields: readonly string[] = [],
): EligibilityOutcome {
  if (requiredApplicableChecks.some(({ outcome }) => outcome === "INELIGIBLE")) {
    return "INELIGIBLE";
  }

  if (
    requiredApplicableChecks.some(({ outcome }) => outcome === "NEEDS_REVIEW") ||
    blockingMissingFields.length > 0
  ) {
    return "NEEDS_REVIEW";
  }

  return "ELIGIBLE";
}

export function assertEligibilityResult(result: EligibilityResult): void {
  if (!isFrozenEnumValue(ELIGIBILITY_OUTCOMES, result.outcome)) {
    throw new DomainValidationError("outcome must be a frozen eligibility outcome");
  }

  if (result.cutoff !== null && typeof result.cutoff !== "number") {
    throw new DomainValidationError("cutoff must be a number or null");
  }

  for (const [index, check] of result.checks.entries()) {
    const prefix = `checks[${index}]`;
    requireNonEmptyString(check.rule_id, `${prefix}.rule_id`);
    if (!isFrozenEnumValue(ELIGIBILITY_OUTCOMES, check.outcome)) {
      throw new DomainValidationError(
        `${prefix}.outcome must be a frozen eligibility outcome`,
      );
    }
    requireNonEmptyString(check.reason_code, `${prefix}.reason_code`);
    requireNonEmptyString(check.explanation, `${prefix}.explanation`);
    requireNonEmptyString(check.source_id, `${prefix}.source_id`);
    requireNullableInteger(check.source_page, `${prefix}.source_page`);
    if (check.source_year !== ADMISSION_YEAR) {
      throw new DomainValidationError(
        `${prefix}.source_year must equal ADMISSION_YEAR`,
      );
    }
  }

  for (const [index, field] of result.blocking_missing_fields.entries()) {
    requireNonEmptyString(field, `blocking_missing_fields[${index}]`);
  }

  for (const [index, ruleId] of result.matched_rule_ids.entries()) {
    requireNonEmptyString(ruleId, `matched_rule_ids[${index}]`);
  }

  const aggregate = aggregateEligibilityOutcome(
    result.checks,
    result.blocking_missing_fields,
  );
  if (result.outcome !== aggregate) {
    throw new DomainValidationError(
      `outcome must match conservative aggregate ${aggregate}`,
    );
  }
}

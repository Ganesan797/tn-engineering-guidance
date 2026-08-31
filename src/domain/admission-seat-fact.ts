import { ADMISSION_YEAR } from "./constants.ts";
import {
  isFrozenEnumValue,
  QUOTAS,
  RESERVATION_CATEGORIES,
  SEAT_FACT_TYPES,
} from "./enums.ts";
import type { AdmissionSeatFact } from "./models.ts";
import {
  DomainValidationError,
  requireInteger,
  requireNonEmptyString,
  requireNullableInteger,
} from "./validation.ts";

export function assertAdmissionSeatFact(fact: AdmissionSeatFact): void {
  if (fact.admission_year !== ADMISSION_YEAR) {
    throw new DomainValidationError("admission_year must equal ADMISSION_YEAR");
  }

  requireNonEmptyString(fact.tnea_college_code, "tnea_college_code");
  requireNonEmptyString(fact.branch_id, "branch_id");
  requireNonEmptyString(fact.source_id, "source_id");
  requireInteger(fact.seat_count, "seat_count");
  requireNullableInteger(fact.round, "round");
  requireNullableInteger(fact.source_page, "source_page");

  if (!isFrozenEnumValue(SEAT_FACT_TYPES, fact.fact_type)) {
    throw new DomainValidationError("fact_type must be a frozen seat fact type");
  }
  if (
    fact.reservation_category !== null &&
    !isFrozenEnumValue(RESERVATION_CATEGORIES, fact.reservation_category)
  ) {
    throw new DomainValidationError(
      "reservation_category must be a frozen reservation category or null",
    );
  }
  if (fact.quota !== null && !isFrozenEnumValue(QUOTAS, fact.quota)) {
    throw new DomainValidationError("quota must be a frozen quota or null");
  }

  switch (fact.fact_type) {
    case "SANCTIONED_INTAKE":
      if (fact.round !== null) {
        throw new DomainValidationError(
          "SANCTIONED_INTAKE requires round to be null",
        );
      }
      if (fact.quota !== null) {
        throw new DomainValidationError(
          "SANCTIONED_INTAKE requires quota to be null",
        );
      }
      break;

    case "CURRENT_VACANCY":
      if (fact.quota !== null) {
        throw new DomainValidationError(
          "CURRENT_VACANCY cannot carry quota-specific vacancy semantics",
        );
      }
      break;

    case "QUOTA_VACANCY":
      if (fact.quota === null) {
        throw new DomainValidationError("QUOTA_VACANCY requires quota");
      }
      break;
  }
}

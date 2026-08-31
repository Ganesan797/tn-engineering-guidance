export class DomainValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainValidationError";
  }
}

export function requireNonEmptyString(value: unknown, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new DomainValidationError(`${field} must be a non-empty string`);
  }
}

export function requireInteger(value: unknown, field: string): void {
  if (!Number.isInteger(value)) {
    throw new DomainValidationError(`${field} must be an integer`);
  }
}

export function requireNullableInteger(value: unknown, field: string): void {
  if (value !== null) {
    requireInteger(value, field);
  }
}

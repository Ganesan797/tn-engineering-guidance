export class IngestionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IngestionValidationError";
  }
}

export class DuplicateFactError extends IngestionValidationError {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateFactError";
  }
}

export class ConflictingFactError extends IngestionValidationError {
  constructor(message: string) {
    super(message);
    this.name = "ConflictingFactError";
  }
}

export class DuplicateSnapshotError extends IngestionValidationError {
  constructor(snapshotId: string) {
    super(`snapshot_id already exists: ${snapshotId}`);
    this.name = "DuplicateSnapshotError";
  }
}

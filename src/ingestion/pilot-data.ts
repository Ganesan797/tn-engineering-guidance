import { ADMISSION_YEAR, type AdmissionYear } from "../domain/constants.ts";
import {
  requireNonEmptyString,
  requireNullableInteger,
} from "../domain/validation.ts";
import { ConflictingFactError, DuplicateFactError, IngestionValidationError } from "./errors.ts";

export const PILOT_COLLEGES = ["CEG", "MIT", "GCT", "PSG Tech", "CIT"] as const;
export type PilotCollegeName = (typeof PILOT_COLLEGES)[number];

export interface SourceReference {
  readonly source_id: string;
  readonly source_page: number | null;
}

export interface PilotCollegeRecord extends SourceReference {
  readonly tnea_college_code: string;
  readonly college_name: PilotCollegeName;
}

export interface ProgrammeRecord extends SourceReference {
  readonly admission_year: AdmissionYear;
  readonly tnea_college_code: string;
  readonly branch_id: string;
  readonly degree: string;
}

function stableRecord(record: object): string {
  return JSON.stringify(record, Object.keys(record).sort());
}

export class PilotDataRegistry {
  readonly #knownSourceIds: ReadonlySet<string>;
  readonly #allowedBranchIds: ReadonlySet<string>;
  readonly #colleges = new Map<string, PilotCollegeRecord>();
  readonly #programmes = new Map<string, ProgrammeRecord>();

  constructor(
    knownSourceIds: Iterable<string>,
    allowedBranchIds: Iterable<string>,
  ) {
    this.#knownSourceIds = new Set(knownSourceIds);
    this.#allowedBranchIds = new Set(allowedBranchIds);
  }

  validateProvenance(reference: SourceReference): void {
    requireNonEmptyString(reference.source_id, "source_id");
    requireNullableInteger(reference.source_page, "source_page");
    if (!this.#knownSourceIds.has(reference.source_id)) {
      throw new IngestionValidationError(
        `source_id is not registered: ${reference.source_id}`,
      );
    }
  }

  ingestColleges(records: readonly PilotCollegeRecord[]): void {
    for (const record of records) {
      requireNonEmptyString(record.tnea_college_code, "tnea_college_code");
      if (!PILOT_COLLEGES.includes(record.college_name)) {
        throw new IngestionValidationError(
          `college is outside the frozen pilot: ${record.college_name}`,
        );
      }
      this.validateProvenance(record);

      const existing = this.#colleges.get(record.tnea_college_code);
      if (existing !== undefined) {
        if (stableRecord(existing) === stableRecord(record)) {
          throw new DuplicateFactError(
            `duplicate college record: ${record.tnea_college_code}`,
          );
        }
        throw new ConflictingFactError(
          `conflicting college record: ${record.tnea_college_code}`,
        );
      }

      const nameConflict = [...this.#colleges.values()].find(
        ({ college_name }) => college_name === record.college_name,
      );
      if (nameConflict !== undefined) {
        throw new ConflictingFactError(
          `pilot college already has a different tnea_college_code: ${record.college_name}`,
        );
      }

      this.#colleges.set(record.tnea_college_code, { ...record });
    }
  }

  ingestProgrammes(records: readonly ProgrammeRecord[]): void {
    for (const record of records) {
      if (record.admission_year !== ADMISSION_YEAR) {
        throw new IngestionValidationError(
          `admission_year must equal ${ADMISSION_YEAR}`,
        );
      }
      requireNonEmptyString(record.tnea_college_code, "tnea_college_code");
      requireNonEmptyString(record.branch_id, "branch_id");
      requireNonEmptyString(record.degree, "degree");
      this.validateProvenance(record);

      if (!this.#colleges.has(record.tnea_college_code)) {
        throw new IngestionValidationError(
          `unknown tnea_college_code: ${record.tnea_college_code}`,
        );
      }
      if (!this.#allowedBranchIds.has(record.branch_id)) {
        throw new IngestionValidationError(
          `unknown branch_id: ${record.branch_id}`,
        );
      }

      const key = this.programmeKey(
        record.tnea_college_code,
        record.branch_id,
      );
      const existing = this.#programmes.get(key);
      if (existing !== undefined) {
        if (stableRecord(existing) === stableRecord(record)) {
          throw new DuplicateFactError(`duplicate programme record: ${key}`);
        }
        throw new ConflictingFactError(`conflicting programme record: ${key}`);
      }
      this.#programmes.set(key, { ...record });
    }
  }

  hasCollege(tneaCollegeCode: string): boolean {
    return this.#colleges.has(tneaCollegeCode);
  }

  hasProgramme(tneaCollegeCode: string, branchId: string): boolean {
    return this.#programmes.has(this.programmeKey(tneaCollegeCode, branchId));
  }

  colleges(): readonly PilotCollegeRecord[] {
    return [...this.#colleges.values()].map((record) => ({ ...record }));
  }

  programmes(): readonly ProgrammeRecord[] {
    return [...this.#programmes.values()].map((record) => ({ ...record }));
  }

  private programmeKey(tneaCollegeCode: string, branchId: string): string {
    return `${ADMISSION_YEAR}|${tneaCollegeCode}|${branchId}`;
  }
}

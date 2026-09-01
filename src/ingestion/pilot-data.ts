import { ADMISSION_YEAR, type AdmissionYear } from "../domain/constants.ts";
import {
  requireNonEmptyString,
  requireNullableInteger,
} from "../domain/validation.ts";
import { ConflictingFactError, DuplicateFactError, IngestionValidationError } from "./errors.ts";

export const PILOT_COLLEGES = ["CEG", "MIT", "GCT", "PSG Tech", "CIT"] as const;
export type PilotCollegeName = (typeof PILOT_COLLEGES)[number];

const EXACT_CANONICAL_PROGRAMME_NAMES: Readonly<Record<string, string>> = {
  "COMPUTER SCIENCE AND ENGINEERING": "CSE",
  "INFORMATION TECHNOLOGY": "IT",
  "ELECTRONICS AND COMMUNICATION ENGINEERING": "ECE",
  "ELECTRICAL AND ELECTRONICS ENGINEERING": "EEE",
  "MECHANICAL ENGINEERING": "MECH",
};

export interface SourceReference {
  readonly source_id: string;
  readonly source_page: number | null;
}

export interface PilotCollegeRecord extends SourceReference {
  readonly admission_year: AdmissionYear;
  readonly tnea_college_code: string;
  readonly college_name: PilotCollegeName;
}

export interface ProgrammeRecord extends SourceReference {
  readonly admission_year: AdmissionYear;
  readonly tnea_college_code: string;
  readonly source_branch_code: string;
  readonly programme_name: string;
  readonly branch_id: string | null;
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
      if (record.admission_year !== ADMISSION_YEAR) {
        throw new IngestionValidationError(
          `admission_year must equal ${ADMISSION_YEAR}`,
        );
      }
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
      requireNonEmptyString(record.source_branch_code, "source_branch_code");
      requireNonEmptyString(record.programme_name, "programme_name");
      this.validateProvenance(record);

      const exactBranchId =
        EXACT_CANONICAL_PROGRAMME_NAMES[record.programme_name] ?? null;
      if (record.branch_id !== exactBranchId) {
        throw new IngestionValidationError(
          `branch_id must match the exact frozen programme mapping for ${record.programme_name}`,
        );
      }

      if (!this.#colleges.has(record.tnea_college_code)) {
        throw new IngestionValidationError(
          `unknown tnea_college_code: ${record.tnea_college_code}`,
        );
      }
      if (
        record.branch_id !== null &&
        !this.#allowedBranchIds.has(record.branch_id)
      ) {
        throw new IngestionValidationError(
          `unknown branch_id: ${record.branch_id}`,
        );
      }

      const key = this.sourceProgrammeKey(
        record.tnea_college_code,
        record.source_branch_code,
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
    return [...this.#programmes.values()].some(
      (programme) =>
        programme.tnea_college_code === tneaCollegeCode &&
        programme.branch_id === branchId,
    );
  }

  colleges(): readonly PilotCollegeRecord[] {
    return [...this.#colleges.values()].map((record) => ({ ...record }));
  }

  programmes(): readonly ProgrammeRecord[] {
    return [...this.#programmes.values()].map((record) => ({ ...record }));
  }

  private sourceProgrammeKey(
    tneaCollegeCode: string,
    sourceBranchCode: string,
  ): string {
    return `${ADMISSION_YEAR}|${tneaCollegeCode}|${sourceBranchCode}`;
  }
}

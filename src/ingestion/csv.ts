import { ADMISSION_YEAR } from "../domain/constants.ts";
import { IngestionValidationError } from "./errors.ts";
import type {
  PilotCollegeName,
  PilotCollegeRecord,
  ProgrammeRecord,
} from "./pilot-data.ts";

const COLLEGE_HEADERS = [
  "admission_year",
  "tnea_college_code",
  "college_name",
  "source_id",
  "source_page",
] as const;

const PROGRAMME_HEADERS = [
  "admission_year",
  "tnea_college_code",
  "source_branch_code",
  "programme_name",
  "branch_id",
  "source_id",
  "source_page",
] as const;

const SOURCE_ID_HEADER = "source_id";

function rows(csv: string, expectedHeaders: readonly string[]): string[][] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new IngestionValidationError("CSV must contain a header and data");
  }
  const headers = lines[0].split(",");
  if (headers.join(",") !== expectedHeaders.join(",")) {
    throw new IngestionValidationError("CSV headers do not match the frozen ingestion schema");
  }
  return lines.slice(1).map((line, index) => {
    const values = line.split(",");
    if (values.length !== expectedHeaders.length) {
      throw new IngestionValidationError(`invalid CSV row ${index + 2}`);
    }
    return values;
  });
}

function admissionYear(value: string): typeof ADMISSION_YEAR {
  if (Number(value) !== ADMISSION_YEAR) {
    throw new IngestionValidationError(
      `admission_year must equal ${ADMISSION_YEAR}`,
    );
  }
  return ADMISSION_YEAR;
}

function sourcePage(value: string): number {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) {
    throw new IngestionValidationError("source_page must be a positive integer");
  }
  return page;
}

export function parsePilotCollegeCsv(csv: string): PilotCollegeRecord[] {
  return rows(csv, COLLEGE_HEADERS).map(
    ([year, code, name, sourceId, page]) => ({
      admission_year: admissionYear(year),
      tnea_college_code: code,
      college_name: name as PilotCollegeName,
      source_id: sourceId,
      source_page: sourcePage(page),
    }),
  );
}

export function parseProgrammeCsv(csv: string): ProgrammeRecord[] {
  return rows(csv, PROGRAMME_HEADERS).map(
    ([year, code, sourceBranchCode, name, branchId, sourceId, page]) => ({
      admission_year: admissionYear(year),
      tnea_college_code: code,
      source_branch_code: sourceBranchCode,
      programme_name: name,
      branch_id: branchId === "" ? null : branchId,
      source_id: sourceId,
      source_page: sourcePage(page),
    }),
  );
}

export function parseRegisteredSourceIds(csv: string): readonly string[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length < 2 || lines[0].split(",")[0] !== SOURCE_ID_HEADER) {
    throw new IngestionValidationError("source registry must contain source_id records");
  }
  return lines.slice(1).map((line, index) => {
    const sourceId = line.split(",", 1)[0]?.trim() ?? "";
    if (sourceId.length === 0) {
      throw new IngestionValidationError(`missing source_id at row ${index + 2}`);
    }
    return sourceId;
  });
}

import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import type { AdmissionSeatFact } from "../../src/domain/models.ts";
import {
  AdmissionSeatFactSnapshotStore,
  PilotDataRegistry,
  type PilotCollegeRecord,
  type ProgrammeRecord,
} from "../../src/ingestion/index.ts";

// These TEST_* identifiers are synthetic fixtures. They are not TNEA facts.
export const TEST_SOURCE_ID = "TEST_SRC_2026";

export const TEST_COLLEGES: readonly PilotCollegeRecord[] = [
  { admission_year: ADMISSION_YEAR, tnea_college_code: "TEST_CEG", college_name: "CEG", source_id: TEST_SOURCE_ID, source_page: 1 },
  { admission_year: ADMISSION_YEAR, tnea_college_code: "TEST_MIT", college_name: "MIT", source_id: TEST_SOURCE_ID, source_page: 1 },
  { admission_year: ADMISSION_YEAR, tnea_college_code: "TEST_GCT", college_name: "GCT", source_id: TEST_SOURCE_ID, source_page: 1 },
  { admission_year: ADMISSION_YEAR, tnea_college_code: "TEST_PSG", college_name: "PSG Tech", source_id: TEST_SOURCE_ID, source_page: 1 },
  { admission_year: ADMISSION_YEAR, tnea_college_code: "TEST_CIT", college_name: "CIT", source_id: TEST_SOURCE_ID, source_page: 1 },
];

export const TEST_PROGRAMMES: readonly ProgrammeRecord[] = TEST_COLLEGES.map(
  ({ tnea_college_code }) => ({
    admission_year: ADMISSION_YEAR,
    tnea_college_code,
    source_branch_code: "CS",
    programme_name: "COMPUTER SCIENCE AND ENGINEERING",
    branch_id: "CSE",
    source_id: TEST_SOURCE_ID,
    source_page: 2,
  }),
);

export function testPipeline() {
  const registry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE", "ECE"]);
  registry.ingestColleges(TEST_COLLEGES);
  registry.ingestProgrammes(TEST_PROGRAMMES);
  return {
    registry,
    snapshots: new AdmissionSeatFactSnapshotStore(registry),
  };
}

export function testSeatFact(
  overrides: Partial<AdmissionSeatFact> = {},
): AdmissionSeatFact {
  return {
    admission_year: ADMISSION_YEAR,
    tnea_college_code: "TEST_CEG",
    branch_id: "CSE",
    fact_type: "SANCTIONED_INTAKE",
    seat_count: 60,
    round: null,
    reservation_category: null,
    quota: null,
    source_id: TEST_SOURCE_ID,
    source_page: 3,
    ...overrides,
  };
}

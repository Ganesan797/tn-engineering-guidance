import assert from "node:assert/strict";
import test from "node:test";

import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import {
  ConflictingFactError,
  DuplicateFactError,
  IngestionValidationError,
  PILOT_COLLEGES,
  PilotDataRegistry,
} from "../../src/ingestion/index.ts";
import {
  TEST_COLLEGES,
  TEST_PROGRAMMES,
  TEST_SOURCE_ID,
} from "./fixtures.ts";

test("frozen pilot contains exactly the five authorized colleges", () => {
  assert.deepEqual(PILOT_COLLEGES, ["CEG", "MIT", "GCT", "PSG Tech", "CIT"]);
});

test("programmes ingest through canonical tnea_college_code and branch_id", () => {
  const registry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE"]);
  registry.ingestColleges(TEST_COLLEGES);
  registry.ingestProgrammes(TEST_PROGRAMMES);

  assert.equal(registry.colleges().length, 5);
  assert.equal(registry.programmes().length, 5);
  assert.equal(registry.hasProgramme("TEST_CEG", "CSE"), true);
});

test("programme ingestion rejects non-2026 records", () => {
  const registry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE"]);
  registry.ingestColleges(TEST_COLLEGES);
  assert.throws(
    () =>
      registry.ingestProgrammes([
        { ...TEST_PROGRAMMES[0], admission_year: 2025 as never },
      ]),
    IngestionValidationError,
  );
  assert.equal(ADMISSION_YEAR, 2026);
});

test("programme ingestion rejects invalid college and branch identifiers", () => {
  const registry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE"]);
  registry.ingestColleges(TEST_COLLEGES);
  assert.throws(
    () =>
      registry.ingestProgrammes([
        { ...TEST_PROGRAMMES[0], tnea_college_code: "UNKNOWN" },
      ]),
    /unknown tnea_college_code/,
  );
  assert.throws(
    () =>
      registry.ingestProgrammes([
        { ...TEST_PROGRAMMES[0], branch_id: "UNKNOWN" },
      ]),
    /branch_id must match the exact frozen programme mapping/,
  );
});

test("college and programme ingestion require registered provenance", () => {
  const registry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE"]);
  assert.throws(
    () =>
      registry.ingestColleges([
        { ...TEST_COLLEGES[0], source_id: "" },
      ]),
    /source_id must be a non-empty string/,
  );
  assert.throws(
    () =>
      registry.ingestColleges([
        { ...TEST_COLLEGES[0], source_id: "UNREGISTERED" },
      ]),
    /source_id is not registered/,
  );

  registry.ingestColleges(TEST_COLLEGES);
  assert.throws(
    () =>
      registry.ingestProgrammes([
        { ...TEST_PROGRAMMES[0], source_id: "UNREGISTERED" },
      ]),
    /source_id is not registered/,
  );
});

test("duplicate and conflicting programme facts are detected", () => {
  const duplicateRegistry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE"]);
  duplicateRegistry.ingestColleges(TEST_COLLEGES);
  duplicateRegistry.ingestProgrammes([TEST_PROGRAMMES[0]]);
  assert.throws(
    () => duplicateRegistry.ingestProgrammes([TEST_PROGRAMMES[0]]),
    DuplicateFactError,
  );

  const conflictRegistry = new PilotDataRegistry([TEST_SOURCE_ID], ["CSE"]);
  conflictRegistry.ingestColleges(TEST_COLLEGES);
  conflictRegistry.ingestProgrammes([TEST_PROGRAMMES[0]]);
  assert.throws(
    () =>
      conflictRegistry.ingestProgrammes([
        { ...TEST_PROGRAMMES[0], source_page: 99 },
      ]),
    ConflictingFactError,
  );
});

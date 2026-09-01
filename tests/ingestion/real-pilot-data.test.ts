import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  IngestionValidationError,
  PilotDataRegistry,
  parsePilotCollegeCsv,
  parseProgrammeCsv,
} from "../../src/ingestion/index.ts";

const SOURCE_ID = "SRC005";
const collegeCsv = readFileSync(
  new URL("../../data/colleges.csv", import.meta.url),
  "utf8",
);
const programmeCsv = readFileSync(
  new URL("../../data/programmes.csv", import.meta.url),
  "utf8",
);
const sourceCsv = readFileSync(
  new URL("../../data/sources.csv", import.meta.url),
  "utf8",
);

function realRegistry(): PilotDataRegistry {
  const registry = new PilotDataRegistry(
    sourceCsv.trim().split(/\r?\n/).slice(1).map((line) => line.split(",")[0]),
    ["CSE", "IT", "ECE", "EEE", "MECH"],
  );
  registry.ingestColleges(parsePilotCollegeCsv(collegeCsv));
  registry.ingestProgrammes(parseProgrammeCsv(programmeCsv));
  return registry;
}

test("the authoritative matrix source is registered exactly once", () => {
  const matchingSources = sourceCsv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .filter((line) =>
      line.startsWith(
        `${SOURCE_ID},GENERAL ACADEMIC SEAT MATRIX BEFORE SPECIAL RESERVATION COUNSELLING_2026,`,
      ),
    );
  assert.equal(matchingSources.length, 1);
});

test("all five authoritative pilot colleges ingest with canonical codes", () => {
  const colleges = realRegistry().colleges();
  assert.deepEqual(
    colleges.map(({ tnea_college_code, college_name }) => ({
      tnea_college_code,
      college_name,
    })),
    [
      { tnea_college_code: "1", college_name: "CEG" },
      { tnea_college_code: "4", college_name: "MIT" },
      { tnea_college_code: "2005", college_name: "GCT" },
      { tnea_college_code: "2006", college_name: "PSG Tech" },
      { tnea_college_code: "2007", college_name: "CIT" },
    ],
  );
});

test("all real programme rows ingest and exact canonical mappings resolve", () => {
  const registry = realRegistry();
  assert.equal(registry.programmes().length, 79);
  assert.equal(registry.programmes().filter(({ branch_id }) => branch_id !== null).length, 18);
  assert.equal(registry.hasProgramme("1", "CSE"), true);
  assert.equal(registry.hasProgramme("2005", "IT"), true);
  assert.equal(registry.hasProgramme("2006", "MECH"), true);
  assert.equal(registry.hasProgramme("2007", "EEE"), true);
});

test("specialised and SS source programmes remain present and unmapped", () => {
  const programmes = realRegistry().programmes();
  const unmapped = programmes.filter(({ branch_id }) => branch_id === null);
  assert.equal(unmapped.length, 61);
  assert.ok(
    unmapped.some(
      ({ tnea_college_code, source_branch_code, programme_name }) =>
        tnea_college_code === "1" &&
        source_branch_code === "CM" &&
        programme_name === "COMPUTER SCIENCE AND ENGINEERING (SS)",
    ),
  );
});

test("real college and programme provenance is retained", () => {
  const registry = realRegistry();
  assert.ok(
    registry.colleges().every(
      ({ source_id, source_page }) =>
        source_id === SOURCE_ID && source_page !== null,
    ),
  );
  assert.ok(
    registry.programmes().every(
      ({ source_id, source_page }) =>
        source_id === SOURCE_ID && source_page !== null,
    ),
  );
});

test("invalid source rows and inferred mappings are rejected", () => {
  assert.throws(
    () => parsePilotCollegeCsv(collegeCsv.replace("2026,1,CEG", "2025,1,CEG")),
    /admission_year must equal 2026/,
  );

  const registry = new PilotDataRegistry([SOURCE_ID], ["CSE", "IT", "ECE", "EEE", "MECH"]);
  registry.ingestColleges(parsePilotCollegeCsv(collegeCsv));
  const programmes = parseProgrammeCsv(programmeCsv);
  assert.throws(
    () =>
      registry.ingestProgrammes([
        { ...programmes[0], branch_id: "CSE" },
      ]),
    IngestionValidationError,
  );
  assert.throws(
    () =>
      registry.ingestProgrammes([
        { ...programmes[0], source_id: "UNREGISTERED" },
      ]),
    /source_id is not registered/,
  );
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  ConflictingFactError,
  DuplicateFactError,
  DuplicateSnapshotError,
  IngestionValidationError,
} from "../../src/ingestion/index.ts";
import { testPipeline, testSeatFact } from "./fixtures.ts";

test("all three AdmissionSeatFact types enter the pipeline without derivation", () => {
  const { snapshots } = testPipeline();
  snapshots.append({
    snapshot_id: "TEST_ALL_FACT_TYPES",
    stage: "TEST_STAGE",
    facts: [
      testSeatFact(),
      testSeatFact({
        fact_type: "CURRENT_VACANCY",
        seat_count: 12,
        round: 1,
      }),
      testSeatFact({
        fact_type: "QUOTA_VACANCY",
        seat_count: 3,
        round: 1,
        quota: "GOVT_SCHOOL_7_5",
        reservation_category: "BC",
      }),
    ],
  });

  assert.deepEqual(
    snapshots.factsFor("TEST_CEG", "CSE").map(({ fact_type }) => fact_type),
    ["SANCTIONED_INTAKE", "CURRENT_VACANCY", "QUOTA_VACANCY"],
  );
});

test("multiple round and stage snapshots coexist and preserve metadata", () => {
  const { snapshots } = testPipeline();
  snapshots.append({
    snapshot_id: "TEST_ROUND_1",
    stage: "ROUND_1_TEST_STAGE",
    facts: [
      testSeatFact({ fact_type: "CURRENT_VACANCY", seat_count: 12, round: 1 }),
    ],
  });
  snapshots.append({
    snapshot_id: "TEST_ROUND_2",
    stage: "ROUND_2_TEST_STAGE",
    facts: [
      testSeatFact({ fact_type: "CURRENT_VACANCY", seat_count: 7, round: 2 }),
    ],
  });

  const stored = snapshots.snapshots();
  assert.equal(stored.length, 2);
  assert.deepEqual(stored.map(({ stage }) => stage), [
    "ROUND_1_TEST_STAGE",
    "ROUND_2_TEST_STAGE",
  ]);
  assert.deepEqual(
    snapshots.factsFor("TEST_CEG", "CSE").map(({ round, seat_count }) => ({
      round,
      seat_count,
    })),
    [
      { round: 1, seat_count: 12 },
      { round: 2, seat_count: 7 },
    ],
  );
});

test("later snapshots never overwrite an earlier fact", () => {
  const { snapshots } = testPipeline();
  snapshots.append({
    snapshot_id: "TEST_EARLIER",
    stage: "TEST_STAGE_A",
    facts: [
      testSeatFact({ fact_type: "CURRENT_VACANCY", seat_count: 12, round: 1 }),
    ],
  });
  snapshots.append({
    snapshot_id: "TEST_LATER",
    stage: "TEST_STAGE_B",
    facts: [
      testSeatFact({ fact_type: "CURRENT_VACANCY", seat_count: 9, round: 1 }),
    ],
  });

  assert.deepEqual(
    snapshots.factsFor("TEST_CEG", "CSE").map(({ seat_count }) => seat_count),
    [12, 9],
  );
});

test("missing or unpublished vacancy facts remain absent", () => {
  const { snapshots } = testPipeline();
  snapshots.append({
    snapshot_id: "TEST_INTAKE_ONLY",
    stage: null,
    facts: [testSeatFact()],
  });

  const facts = snapshots.factsFor("TEST_CEG", "CSE");
  assert.equal(facts.length, 1);
  assert.equal(facts.some(({ fact_type }) => fact_type !== "SANCTIONED_INTAKE"), false);
  assert.equal(facts.some(({ seat_count }) => seat_count === 0), false);
});

test("invalid identifiers and provenance are rejected for seat facts", () => {
  const { snapshots } = testPipeline();
  assert.throws(
    () =>
      snapshots.append({
        snapshot_id: "TEST_BAD_COLLEGE",
        stage: null,
        facts: [testSeatFact({ tnea_college_code: "UNKNOWN" })],
      }),
    /unknown tnea_college_code/,
  );
  assert.throws(
    () =>
      snapshots.append({
        snapshot_id: "TEST_BAD_BRANCH",
        stage: null,
        facts: [testSeatFact({ branch_id: "ECE" })],
      }),
    /unknown canonical programme/,
  );
  assert.throws(
    () =>
      snapshots.append({
        snapshot_id: "TEST_BAD_SOURCE",
        stage: null,
        facts: [testSeatFact({ source_id: "UNREGISTERED" })],
      }),
    /source_id is not registered/,
  );
  assert.throws(
    () =>
      snapshots.append({
        snapshot_id: "TEST_MISSING_SOURCE",
        stage: null,
        facts: [testSeatFact({ source_id: "" })],
      }),
    /source_id must be a non-empty string/,
  );
});

test("invalid AdmissionSeatFact semantics are rejected", () => {
  const { snapshots } = testPipeline();
  assert.throws(
    () =>
      snapshots.append({
        snapshot_id: "TEST_BAD_SEMANTICS",
        stage: null,
        facts: [testSeatFact({ fact_type: "SANCTIONED_INTAKE", round: 1 })],
      }),
    /round to be null/,
  );
  assert.throws(
    () =>
      snapshots.append({
        snapshot_id: "TEST_MISSING_QUOTA",
        stage: null,
        facts: [testSeatFact({ fact_type: "QUOTA_VACANCY", quota: null })],
      }),
    /requires quota/,
  );
});

test("duplicate and conflicting facts within a snapshot are detected", () => {
  const duplicatePipeline = testPipeline();
  const fact = testSeatFact({ fact_type: "CURRENT_VACANCY", round: 1 });
  assert.throws(
    () =>
      duplicatePipeline.snapshots.append({
        snapshot_id: "TEST_DUPLICATE_FACT",
        stage: "TEST_STAGE",
        facts: [fact, { ...fact }],
      }),
    DuplicateFactError,
  );

  const conflictPipeline = testPipeline();
  assert.throws(
    () =>
      conflictPipeline.snapshots.append({
        snapshot_id: "TEST_CONFLICTING_FACT",
        stage: "TEST_STAGE",
        facts: [fact, { ...fact, seat_count: fact.seat_count + 1 }],
      }),
    ConflictingFactError,
  );
});

test("snapshot identity is append-only", () => {
  const { snapshots } = testPipeline();
  const snapshot = {
    snapshot_id: "TEST_IMMUTABLE_ID",
    stage: "TEST_STAGE",
    facts: [testSeatFact()],
  } as const;
  snapshots.append(snapshot);
  assert.throws(() => snapshots.append(snapshot), DuplicateSnapshotError);
});

test("future authoritative snapshot stages require no schema or code change", () => {
  const { snapshots } = testPipeline();
  snapshots.append({
    snapshot_id: "TEST_FUTURE_AUTHORITY_SNAPSHOT",
    stage: "FUTURE_AUTHORITY_STAGE_LABEL",
    facts: [
      testSeatFact({
        fact_type: "QUOTA_VACANCY",
        seat_count: 4,
        round: 4,
        quota: "GENERAL",
        reservation_category: "OC",
        source_page: null,
      }),
    ],
  });

  const [stored] = snapshots.snapshots();
  assert.equal(stored.stage, "FUTURE_AUTHORITY_STAGE_LABEL");
  assert.equal(stored.facts[0].round, 4);
  assert.equal(stored.facts[0].source_page, null);
});

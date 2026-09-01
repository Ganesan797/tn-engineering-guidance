import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createGuidance,
  type GuidanceRequest,
} from "../../src/application/index.ts";
import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import type { StudentProfile } from "../../src/domain/models.ts";
import {
  AdmissionSeatFactSnapshotStore,
  PilotDataRegistry,
  parsePilotCollegeCsv,
  parseProgrammeCsv,
} from "../../src/ingestion/index.ts";
import { studentProfile } from "../domain/fixtures.ts";

const ALL_IN_TN = {
  class_8_in_tn: true,
  class_9_in_tn: true,
  class_10_in_tn: true,
  class_11_in_tn: true,
  class_12_in_tn: true,
} as const;

function eligibleProfile(overrides: Partial<StudentProfile> = {}): StudentProfile {
  return studentProfile({
    maths_mark: 90,
    physics_mark: 80,
    chemistry_mark: 70,
    qualifying_stream: "HSC_ACADEMIC",
    community: "GENERAL",
    govt_school_7_5: false,
    tamil_nadu_native: true,
    nativity_exception_type: "NONE",
    tn_study_years_or_classes: ALL_IN_TN,
    grade_certificate_used: false,
    improvement_marks_used: false,
    ...overrides,
  });
}

function dependencies() {
  const registry = new PilotDataRegistry(
    ["SRC005", "TEST_GUIDANCE_SEATS"],
    ["CSE", "IT", "ECE", "EEE", "MECH"],
  );
  registry.ingestColleges(
    parsePilotCollegeCsv(
      readFileSync(new URL("../../data/colleges.csv", import.meta.url), "utf8"),
    ),
  );
  registry.ingestProgrammes(
    parseProgrammeCsv(
      readFileSync(new URL("../../data/programmes.csv", import.meta.url), "utf8"),
    ),
  );
  const snapshots = new AdmissionSeatFactSnapshotStore(registry);
  snapshots.append({
    snapshot_id: "TEST_GUIDANCE_ROUND_1",
    stage: "ROUND_1",
    facts: [
      {
        admission_year: ADMISSION_YEAR,
        tnea_college_code: "1",
        branch_id: "CSE",
        fact_type: "SANCTIONED_INTAKE",
        seat_count: 60,
        round: null,
        reservation_category: null,
        quota: null,
        source_id: "TEST_GUIDANCE_SEATS",
        source_page: 1,
      },
      {
        admission_year: ADMISSION_YEAR,
        tnea_college_code: "1",
        branch_id: "CSE",
        fact_type: "CURRENT_VACANCY",
        seat_count: 3,
        round: 1,
        reservation_category: "BC",
        quota: null,
        source_id: "TEST_GUIDANCE_SEATS",
        source_page: 2,
      },
    ],
  });
  return { registry, snapshots };
}

function guidanceRequest(
  overrides: Partial<GuidanceRequest> = {},
): GuidanceRequest {
  return {
    profile: eligibleProfile(),
    eligibility_request: {
      academic_merit_cutoff_requested: true,
      normalized_cross_board_merit_ranking_requested: false,
      govt_school_7_5_entitlement_requested: false,
    },
    preferences: {
      branch_preference_order: ["ECE", "CSE", "MECH"],
    },
    counselling: {
      snapshot_id: "TEST_GUIDANCE_ROUND_1",
      snapshot_stage: "ROUND_1",
      round: 1,
      reservation_category: "BC",
      quota: null,
    },
    ...overrides,
  };
}

test("A. ELIGIBLE flows through to ordered canonical choices", () => {
  const result = createGuidance(guidanceRequest(), dependencies());
  assert.equal(result.eligibility.outcome, "ELIGIBLE");
  assert.equal(result.eligibility.cutoff, 165);
  assert.equal(result.ordered_choices.length, 18);
  assert.equal(result.ordered_choices[0].candidate.branch_id, "ECE");
});

test("B. INELIGIBLE is preserved with no normal choices", () => {
  const result = createGuidance(
    guidanceRequest({
      profile: eligibleProfile({ maths_mark: 10, physics_mark: 10, chemistry_mark: 10 }),
    }),
    dependencies(),
  );
  assert.equal(result.eligibility.outcome, "INELIGIBLE");
  assert.deepEqual(result.ordered_choices, []);
});

test("C. NEEDS_REVIEW and blocking evidence are never promoted", () => {
  const result = createGuidance(
    guidanceRequest({ profile: studentProfile() }),
    dependencies(),
  );
  assert.equal(result.eligibility.outcome, "NEEDS_REVIEW");
  assert.ok(result.eligibility.blocking_missing_fields.length > 0);
  assert.ok(result.eligibility.checks.some(({ outcome }) => outcome === "NEEDS_REVIEW"));
  assert.ok(
    result.ordered_choices.every(
      ({ candidate }) => candidate.eligibility_outcome === "NEEDS_REVIEW",
    ),
  );
});

test("D. explicit branch ordering survives unchanged", () => {
  const result = createGuidance(
    guidanceRequest({
      preferences: { branch_preference_order: ["MECH", "EEE"] },
    }),
    dependencies(),
  );
  assert.equal(result.ordered_choices[0].candidate.branch_id, "MECH");
  assert.equal(result.ordered_choices[0].branch_preference_rank, 1);
  assert.ok(
    result.ordered_choices[0].ordering_reason_codes.includes(
      "BRANCH_PREFERENCE_MATCHED_RANK_1",
    ),
  );
});

test("E. missing vacancy remains UNKNOWN_OR_UNPUBLISHED", () => {
  const result = createGuidance(guidanceRequest(), dependencies());
  const mitCse = result.ordered_choices.find(
    ({ candidate }) =>
      candidate.tnea_college_code === "4" && candidate.branch_id === "CSE",
  );
  assert.equal(
    mitCse?.candidate.vacancy_evidence_state,
    "UNKNOWN_OR_UNPUBLISHED",
  );
  assert.deepEqual(mitCse?.candidate.applicable_seat_facts, []);
});

test("F. positive seat evidence passes through without semantic conversion", () => {
  const result = createGuidance(guidanceRequest(), dependencies());
  const cegCse = result.ordered_choices.find(
    ({ candidate }) =>
      candidate.tnea_college_code === "1" && candidate.branch_id === "CSE",
  );
  assert.equal(cegCse?.candidate.vacancy_evidence_state, "PUBLISHED");
  assert.deepEqual(
    cegCse?.candidate.applicable_seat_facts.map(
      ({ fact_type, seat_count }) => ({ fact_type, seat_count }),
    ),
    [
      { fact_type: "SANCTIONED_INTAKE", seat_count: 60 },
      { fact_type: "CURRENT_VACANCY", seat_count: 3 },
    ],
  );
});

test("G. eligibility, programme, college, and seat provenance reaches GuidanceResult", () => {
  const result = createGuidance(guidanceRequest(), dependencies());
  assert.ok(result.provenance.some(({ source_id }) => source_id === "SRC002"));
  assert.ok(result.provenance.some(({ source_id }) => source_id === "SRC005"));
  assert.ok(
    result.provenance.some(
      ({ source_id }) => source_id === "TEST_GUIDANCE_SEATS",
    ),
  );
});

test("H. identical guidance request and snapshot are structurally deterministic", () => {
  const deps = dependencies();
  const request = guidanceRequest();
  const first = createGuidance(request, deps);
  const second = createGuidance(request, deps);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(first, second);
});

test("I. all 61 unmapped programmes remain excluded from final choices", () => {
  const result = createGuidance(guidanceRequest(), dependencies());
  assert.equal(result.ordered_choices.length, 18);
  assert.ok(
    result.ordered_choices.every(
      ({ candidate }) => !candidate.programme_name.includes("(SS)"),
    ),
  );
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import type { StudentProfile } from "../../src/domain/models.ts";
import type { EligibilityEvaluationRequest } from "../../src/domain/rules.ts";
import {
  AdmissionSeatFactSnapshotStore,
  PilotDataRegistry,
  parsePilotCollegeCsv,
  parseProgrammeCsv,
} from "../../src/ingestion/index.ts";
import {
  buildDeterministicCandidates,
  orderCandidateChoices,
  type RecommendationRequest,
} from "../../src/recommendation/index.ts";
import { studentProfile } from "../domain/fixtures.ts";

const ELIGIBILITY_REQUEST: EligibilityEvaluationRequest = {
  academic_merit_cutoff_requested: true,
  normalized_cross_board_merit_ranking_requested: false,
  govt_school_7_5_entitlement_requested: false,
};

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

function pipeline() {
  const colleges = parsePilotCollegeCsv(
    readFileSync(new URL("../../data/colleges.csv", import.meta.url), "utf8"),
  );
  const programmes = parseProgrammeCsv(
    readFileSync(new URL("../../data/programmes.csv", import.meta.url), "utf8"),
  );
  const registry = new PilotDataRegistry(
    ["SRC005", "TEST_SEAT_SOURCE"],
    ["CSE", "IT", "ECE", "EEE", "MECH"],
  );
  registry.ingestColleges(colleges);
  registry.ingestProgrammes(programmes);

  const snapshots = new AdmissionSeatFactSnapshotStore(registry);
  snapshots.append({
    snapshot_id: "TEST_ROUND_1",
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
        source_id: "TEST_SEAT_SOURCE",
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
        source_id: "TEST_SEAT_SOURCE",
        source_page: 2,
      },
      {
        admission_year: ADMISSION_YEAR,
        tnea_college_code: "2005",
        branch_id: "IT",
        fact_type: "QUOTA_VACANCY",
        seat_count: 2,
        round: 1,
        reservation_category: "BC",
        quota: "GOVT_SCHOOL_7_5",
        source_id: "TEST_SEAT_SOURCE",
        source_page: 3,
      },
    ],
  });
  snapshots.append({
    snapshot_id: "TEST_ROUND_2",
    stage: "ROUND_2",
    facts: [
      {
        admission_year: ADMISSION_YEAR,
        tnea_college_code: "1",
        branch_id: "CSE",
        fact_type: "CURRENT_VACANCY",
        seat_count: 1,
        round: 2,
        reservation_category: "BC",
        quota: null,
        source_id: "TEST_SEAT_SOURCE",
        source_page: 4,
      },
    ],
  });
  return { registry, snapshots };
}

function request(
  overrides: Partial<RecommendationRequest> = {},
): RecommendationRequest {
  return {
    profile: eligibleProfile(),
    eligibility_request: ELIGIBILITY_REQUEST,
    snapshot_id: "TEST_ROUND_1",
    snapshot_stage: "ROUND_1",
    round: 1,
    reservation_category: "BC",
    quota: null,
    ...overrides,
  };
}

function candidate(
  result: ReturnType<typeof buildDeterministicCandidates>,
  collegeCode: string,
  branchId: string,
) {
  const match = result.candidates.find(
    ({ tnea_college_code, branch_id }) =>
      tnea_college_code === collegeCode && branch_id === branchId,
  );
  assert.ok(match);
  return match;
}

test("eligible profiles receive only supported canonical programme candidates", () => {
  const { registry, snapshots } = pipeline();
  const result = buildDeterministicCandidates(request(), registry, snapshots);
  assert.equal(result.eligibility.outcome, "ELIGIBLE");
  assert.equal(result.candidates.length, 18);
  assert.ok(result.candidates.every(({ branch_id }) => branch_id !== ""));
  assert.ok(result.candidates.every(({ programme_name }) => !programme_name.includes("(SS)")));
});

test("ineligible profiles receive no normal candidates", () => {
  const { registry, snapshots } = pipeline();
  const result = buildDeterministicCandidates(
    request({ profile: eligibleProfile({ maths_mark: 10, physics_mark: 10, chemistry_mark: 10 }) }),
    registry,
    snapshots,
  );
  assert.equal(result.eligibility.outcome, "INELIGIBLE");
  assert.deepEqual(result.candidates, []);
});

test("NEEDS_REVIEW remains visible on every provisional candidate", () => {
  const { registry, snapshots } = pipeline();
  const result = buildDeterministicCandidates(
    request({ profile: studentProfile() }),
    registry,
    snapshots,
  );
  assert.equal(result.eligibility.outcome, "NEEDS_REVIEW");
  assert.equal(result.candidates.length, 18);
  assert.ok(
    result.candidates.every(
      ({ eligibility_outcome }) => eligibility_outcome === "NEEDS_REVIEW",
    ),
  );
});

test("positive vacancy and sanctioned intake retain distinct source facts", () => {
  const { registry, snapshots } = pipeline();
  const match = candidate(
    buildDeterministicCandidates(request(), registry, snapshots),
    "1",
    "CSE",
  );
  assert.equal(match.vacancy_evidence_state, "PUBLISHED");
  assert.deepEqual(
    match.applicable_seat_facts.map(({ fact_type, seat_count }) => ({
      fact_type,
      seat_count,
    })),
    [
      { fact_type: "SANCTIONED_INTAKE", seat_count: 60 },
      { fact_type: "CURRENT_VACANCY", seat_count: 3 },
    ],
  );
});

test("missing vacancy remains UNKNOWN_OR_UNPUBLISHED and never becomes zero", () => {
  const { registry, snapshots } = pipeline();
  const match = candidate(
    buildDeterministicCandidates(request(), registry, snapshots),
    "4",
    "CSE",
  );
  assert.equal(match.vacancy_evidence_state, "UNKNOWN_OR_UNPUBLISHED");
  assert.deepEqual(match.applicable_seat_facts, []);
  assert.equal(match.applicable_seat_facts.some(({ seat_count }) => seat_count === 0), false);
});

test("category and quota vacancy evidence requires the matching context", () => {
  const { registry, snapshots } = pipeline();
  const quotaMatch = candidate(
    buildDeterministicCandidates(
      request({ quota: "GOVT_SCHOOL_7_5" }),
      registry,
      snapshots,
    ),
    "2005",
    "IT",
  );
  assert.equal(quotaMatch.vacancy_evidence_state, "PUBLISHED");
  assert.deepEqual(
    quotaMatch.applicable_seat_facts.map(({ fact_type, quota }) => ({ fact_type, quota })),
    [{ fact_type: "QUOTA_VACANCY", quota: "GOVT_SCHOOL_7_5" }],
  );

  const generalMatch = candidate(
    buildDeterministicCandidates(request(), registry, snapshots),
    "2005",
    "IT",
  );
  assert.equal(generalMatch.vacancy_evidence_state, "UNKNOWN_OR_UNPUBLISHED");
});

test("snapshot id and stage select only the requested round evidence", () => {
  const { registry, snapshots } = pipeline();
  const match = candidate(
    buildDeterministicCandidates(
      request({
        snapshot_id: "TEST_ROUND_2",
        snapshot_stage: "ROUND_2",
        round: 2,
      }),
      registry,
      snapshots,
    ),
    "1",
    "CSE",
  );
  assert.deepEqual(match.applicable_seat_facts.map(({ seat_count }) => seat_count), [1]);
  assert.throws(
    () =>
      buildDeterministicCandidates(
        request({ snapshot_id: "TEST_ROUND_2", snapshot_stage: "ROUND_1" }),
        registry,
        snapshots,
      ),
    /snapshot stage mismatch/,
  );
});

test("candidate evidence includes eligibility, programme, college, and seat provenance", () => {
  const { registry, snapshots } = pipeline();
  const match = candidate(
    buildDeterministicCandidates(request(), registry, snapshots),
    "1",
    "CSE",
  );
  assert.ok(match.evidence.some(({ source_id }) => source_id === "SRC002"));
  assert.ok(match.evidence.some(({ source_id }) => source_id === "SRC005"));
  assert.ok(match.evidence.some(({ source_id }) => source_id === "TEST_SEAT_SOURCE"));
  assert.ok(match.explanation_reason_codes.includes("CANONICAL_PROGRAMME_SUPPORTED"));
});

test("same input and snapshot produce byte-for-byte equivalent output", () => {
  const { registry, snapshots } = pipeline();
  const input = request();
  const first = buildDeterministicCandidates(input, registry, snapshots);
  const second = buildDeterministicCandidates(input, registry, snapshots);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(first, second);
});

test("explicit branch preference order is the only preference ordering factor", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(
    request(),
    registry,
    snapshots,
  ).candidates;
  const ordered = orderCandidateChoices(candidates, {
    branch_preference_order: ["ECE", "CSE"],
  });
  const firstCse = ordered.findIndex(({ candidate: { branch_id } }) => branch_id === "CSE");
  const lastEce = ordered.findLastIndex(({ candidate: { branch_id } }) => branch_id === "ECE");
  assert.ok(firstCse > lastEce);
  assert.ok(
    ordered
      .filter(({ candidate: { branch_id } }) => branch_id === "ECE")
      .every(({ branch_preference_rank, ordering_reason_codes }) =>
        branch_preference_rank === 1 &&
        ordering_reason_codes.includes("BRANCH_PREFERENCE_MATCHED_RANK_1"),
      ),
  );
});

test("missing branch preferences are neutral and explicitly explained", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(request(), registry, snapshots).candidates;
  const ordered = orderCandidateChoices(candidates, {
    branch_preference_order: null,
  });
  assert.ok(ordered.every(({ branch_preference_rank }) => branch_preference_rank === null));
  assert.ok(
    ordered.every(({ ordering_reason_codes }) =>
      ordering_reason_codes.includes("BRANCH_PREFERENCE_NEUTRAL_MISSING"),
    ),
  );
});

test("equal branch preferences use only the disclosed canonical tie-breaker", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(request(), registry, snapshots).candidates;
  const cseChoices = orderCandidateChoices(candidates, {
    branch_preference_order: ["CSE"],
  }).filter(({ candidate: { branch_id } }) => branch_id === "CSE");
  assert.deepEqual(
    cseChoices.map(({ candidate: { tnea_college_code } }) => tnea_college_code),
    ["1", "4", "2005", "2007"],
  );
  assert.ok(
    cseChoices.every(({ ordering_reason_codes }) =>
      ordering_reason_codes.includes("STABLE_CANONICAL_TIE_BREAKER"),
    ),
  );
});

test("ordering preserves UNKNOWN_OR_UNPUBLISHED vacancy evidence", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(request(), registry, snapshots).candidates;
  const ordered = orderCandidateChoices(candidates, {
    branch_preference_order: ["CSE"],
  });
  const mitCse = ordered.find(
    ({ candidate }) =>
      candidate.tnea_college_code === "4" && candidate.branch_id === "CSE",
  );
  assert.equal(mitCse?.candidate.vacancy_evidence_state, "UNKNOWN_OR_UNPUBLISHED");
  assert.deepEqual(mitCse?.candidate.applicable_seat_facts, []);
});

test("ordering preserves NEEDS_REVIEW visibility", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(
    request({ profile: studentProfile() }),
    registry,
    snapshots,
  ).candidates;
  const ordered = orderCandidateChoices(candidates, {
    branch_preference_order: ["MECH", "CSE"],
  });
  assert.ok(
    ordered.every(
      ({ candidate: { eligibility_outcome } }) =>
        eligibility_outcome === "NEEDS_REVIEW",
    ),
  );
});

test("ordering cannot introduce any of the 61 unmapped programmes", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(request(), registry, snapshots).candidates;
  const ordered = orderCandidateChoices(candidates, {
    branch_preference_order: ["CSE", "IT", "ECE", "EEE", "MECH"],
  });
  assert.equal(ordered.length, 18);
  assert.ok(ordered.every(({ candidate }) => !candidate.programme_name.includes("(SS)")));
});

test("same candidates and preferences produce identical choice order", () => {
  const { registry, snapshots } = pipeline();
  const candidates = buildDeterministicCandidates(request(), registry, snapshots).candidates;
  const preferences = { branch_preference_order: ["EEE", "MECH", "CSE"] } as const;
  const first = orderCandidateChoices(candidates, preferences);
  const second = orderCandidateChoices(candidates, preferences);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(first, second);
});

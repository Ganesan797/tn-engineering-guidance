import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { handleGuidanceJson } from "../../src/api/index.ts";
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
    ["SRC005", "TEST_API_SEATS"],
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
    snapshot_id: "TEST_API_ROUND_1",
    stage: "ROUND_1",
    facts: [
      {
        admission_year: ADMISSION_YEAR,
        tnea_college_code: "1",
        branch_id: "CSE",
        fact_type: "CURRENT_VACANCY",
        seat_count: 3,
        round: 1,
        reservation_category: "BC",
        quota: null,
        source_id: "TEST_API_SEATS",
        source_page: 1,
      },
    ],
  });
  return { registry, snapshots };
}

function validRequest(overrides: Partial<GuidanceRequest> = {}): GuidanceRequest {
  return {
    profile: eligibleProfile(),
    eligibility_request: {
      academic_merit_cutoff_requested: true,
      normalized_cross_board_merit_ranking_requested: false,
      govt_school_7_5_entitlement_requested: false,
    },
    preferences: { branch_preference_order: ["CSE", "ECE"] },
    counselling: {
      snapshot_id: "TEST_API_ROUND_1",
      snapshot_stage: "ROUND_1",
      round: 1,
      reservation_category: "BC",
      quota: null,
    },
    ...overrides,
  };
}

function response(request: unknown, deps = dependencies()): any {
  return JSON.parse(handleGuidanceJson(JSON.stringify(request), deps));
}

test("A. valid ELIGIBLE JSON request returns GuidanceResult", () => {
  const body = response(validRequest());
  assert.equal(body.ok, true);
  assert.equal(body.result.eligibility.outcome, "ELIGIBLE");
  assert.equal(body.result.ordered_choices.length, 18);
});

test("B. INELIGIBLE is a successful domain response with no choices", () => {
  const body = response(
    validRequest({
      profile: eligibleProfile({ maths_mark: 10, physics_mark: 10, chemistry_mark: 10 }),
    }),
  );
  assert.equal(body.ok, true);
  assert.equal(body.result.eligibility.outcome, "INELIGIBLE");
  assert.deepEqual(body.result.ordered_choices, []);
});

test("C. NEEDS_REVIEW is successful and preserves blocking reasons", () => {
  const body = response(validRequest({ profile: studentProfile() }));
  assert.equal(body.ok, true);
  assert.equal(body.result.eligibility.outcome, "NEEDS_REVIEW");
  assert.ok(body.result.eligibility.blocking_missing_fields.length > 0);
  assert.ok(
    body.result.eligibility.checks.some(
      ({ outcome }: { outcome: string }) => outcome === "NEEDS_REVIEW",
    ),
  );
});

test("D. null and false remain behaviorally distinct across JSON", () => {
  const falseBody = response(
    validRequest({ profile: eligibleProfile({ grade_certificate_used: false }) }),
  );
  const nullBody = response(
    validRequest({ profile: eligibleProfile({ grade_certificate_used: null }) }),
  );
  assert.equal(falseBody.result.eligibility.outcome, "ELIGIBLE");
  assert.equal(nullBody.result.eligibility.outcome, "NEEDS_REVIEW");
  assert.ok(
    nullBody.result.eligibility.blocking_missing_fields.includes(
      "grade_certificate_used",
    ),
  );
});

test("E. malformed JSON and missing fields use structured errors", () => {
  const malformed = JSON.parse(handleGuidanceJson("{", dependencies()));
  assert.deepEqual(malformed, {
    ok: false,
    error: {
      code: "INVALID_JSON",
      message: "Request body is not valid JSON",
      issues: [],
    },
  });
  const missing = response({});
  assert.equal(missing.ok, false);
  assert.equal(missing.error.code, "INVALID_REQUEST");
  assert.ok(
    missing.error.issues.some(
      ({ code }: { code: string }) => code === "MISSING_FIELD",
    ),
  );
});

test("invalid primitive profile values use structured validation issues", () => {
  const request = validRequest() as unknown as Record<string, any>;
  request.profile.maths_mark = "90";
  const body = response(request);
  assert.equal(body.ok, false);
  assert.equal(body.error.code, "INVALID_REQUEST");
  assert.ok(
    body.error.issues.some(
      ({ path, code }: { path: string; code: string }) =>
        path === "profile.maths_mark" && code === "INVALID_TYPE",
    ),
  );
});

test("unsupported external input dimensions are rejected", () => {
  const request = validRequest() as unknown as Record<string, any>;
  request.location_preference = "Chennai";
  const body = response(request);
  assert.equal(body.ok, false);
  assert.ok(
    body.error.issues.some(
      ({ path, code }: { path: string; code: string }) =>
        path === "location_preference" && code === "UNSUPPORTED_FIELD",
    ),
  );
});

test("F. unsupported frozen enum values fail validation", () => {
  const request = validRequest() as unknown as Record<string, any>;
  request.profile.community = "UNSUPPORTED";
  const body = response(request);
  assert.equal(body.ok, false);
  assert.ok(
    body.error.issues.some(
      ({ path, code }: { path: string; code: string }) =>
        path === "profile.community" && code === "UNSUPPORTED_VALUE",
    ),
  );
});

test("G. invalid snapshot id and stage fail before guidance execution", () => {
  const unknown = response(
    validRequest({
      counselling: {
        ...validRequest().counselling,
        snapshot_id: "UNKNOWN",
      },
    }),
  );
  assert.equal(unknown.ok, false);
  assert.ok(
    unknown.error.issues.some(
      ({ path }: { path: string }) => path === "counselling.snapshot_id",
    ),
  );

  const mismatch = response(
    validRequest({
      counselling: {
        ...validRequest().counselling,
        snapshot_stage: "ROUND_2",
      },
    }),
  );
  assert.equal(mismatch.ok, false);
  assert.ok(
    mismatch.error.issues.some(
      ({ path }: { path: string }) => path === "counselling.snapshot_stage",
    ),
  );
});

test("H. provenance survives the external JSON boundary", () => {
  const body = response(validRequest());
  assert.ok(body.result.provenance.some(({ source_id }: any) => source_id === "SRC002"));
  assert.ok(body.result.provenance.some(({ source_id }: any) => source_id === "SRC005"));
  assert.ok(
    body.result.provenance.some(
      ({ source_id }: any) => source_id === "TEST_API_SEATS",
    ),
  );
});

test("I. identical validated request and data produce identical JSON", () => {
  const deps = dependencies();
  const requestJson = JSON.stringify(validRequest());
  const first = handleGuidanceJson(requestJson, deps);
  const second = handleGuidanceJson(requestJson, deps);
  assert.equal(first, second);
  assert.deepEqual(JSON.parse(first), JSON.parse(second));
});

test("J. adapter success payload is the existing guidance service result", () => {
  const deps = dependencies();
  const request = validRequest();
  const apiBody = JSON.parse(handleGuidanceJson(JSON.stringify(request), deps));
  const directResult = createGuidance(request, deps);
  assert.equal(apiBody.ok, true);
  assert.deepEqual(apiBody.result, directResult);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import type { GuidanceRequest } from "../../src/application/index.ts";
import { handleGuidanceJson } from "../../src/api/index.ts";
import { ADMISSION_YEAR } from "../../src/domain/constants.ts";
import type { StudentProfile } from "../../src/domain/models.ts";
import {
  AdmissionSeatFactSnapshotStore,
  PilotDataRegistry,
  parsePilotCollegeCsv,
  parseProgrammeCsv,
} from "../../src/ingestion/index.ts";
import {
  guidanceRequestFromFormValues,
  renderStudentGuidancePage,
  submitStudentGuidanceForm,
  type GuidanceJsonBoundary,
} from "../../src/ui/index.ts";
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
    ["SRC005", "TEST_UI_SEATS"],
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
    snapshot_id: "TEST_UI_ROUND_1",
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
        source_id: "TEST_UI_SEATS",
        source_page: 1,
      },
    ],
  });
  return { registry, snapshots };
}

function form(overrides: Partial<GuidanceRequest> = {}): GuidanceRequest {
  return {
    profile: eligibleProfile(),
    eligibility_request: {
      academic_merit_cutoff_requested: true,
      normalized_cross_board_merit_ranking_requested: false,
      govt_school_7_5_entitlement_requested: false,
    },
    preferences: { branch_preference_order: ["ECE", "CSE"] },
    counselling: {
      snapshot_id: "TEST_UI_ROUND_1",
      snapshot_stage: "ROUND_1",
      round: 1,
      reservation_category: "BC",
      quota: null,
    },
    ...overrides,
  };
}

function submitted(request = form()) {
  return submitStudentGuidanceForm(request, dependencies());
}

test("A. ELIGIBLE submission reaches Slice 7 and renders ordered choices", () => {
  const state = submitted();
  const html = renderStudentGuidancePage(state);
  assert.equal(state.response?.ok, true);
  assert.match(html, /Eligibility: ELIGIBLE/);
  assert.match(html, /Ordered programme choices/);
  assert.match(html, /PSG Tech/);
});

test("B. INELIGIBLE renders status and reasons without normal choices", () => {
  const state = submitted(
    form({
      profile: eligibleProfile({ maths_mark: 10, physics_mark: 10, chemistry_mark: 10 }),
    }),
  );
  const html = renderStudentGuidancePage(state);
  assert.match(html, /Eligibility: INELIGIBLE/);
  assert.match(html, /ELG0/);
  assert.doesNotMatch(html, /Ordered programme choices/);
});

test("C. NEEDS_REVIEW and missing information remain explicit", () => {
  const state = submitted(form({ profile: studentProfile() }));
  const html = renderStudentGuidancePage(state);
  assert.match(html, /Eligibility: NEEDS_REVIEW/);
  assert.match(html, /Information still needed/);
  assert.match(html, /Qualifying Stream/);
});

test("D. partial form values preserve unknown null separately from false", () => {
  const values = {
    "profile.govt_school_7_5": "false",
    "profile.tamil_nadu_native": "",
    "eligibility_request.academic_merit_cutoff_requested": "true",
    "eligibility_request.normalized_cross_board_merit_ranking_requested": "false",
    "eligibility_request.govt_school_7_5_entitlement_requested": "false",
    "counselling.snapshot_id": "TEST_UI_ROUND_1",
    "counselling.snapshot_stage": "ROUND_1",
    "counselling.round": "1",
    "counselling.reservation_category": "BC",
    "counselling.quota": "",
  };
  const request = guidanceRequestFromFormValues(values, form());
  assert.equal(request.profile.govt_school_7_5, false);
  assert.equal(request.profile.tamil_nadu_native, null);
  const state = submitStudentGuidanceForm(request, dependencies());
  assert.match(renderStudentGuidancePage(state), /Eligibility: NEEDS_REVIEW/);
});

test("E. explicit branch preference and API-returned order are unchanged", () => {
  const state = submitted(
    form({ preferences: { branch_preference_order: ["MECH", "EEE"] } }),
  );
  assert.equal(state.response?.ok, true);
  if (state.response?.ok !== true) return;
  assert.equal(state.response.result.ordered_choices[0].candidate.branch_id, "MECH");
  const html = renderStudentGuidancePage(state);
  assert.ok(html.indexOf("Branch MECH") < html.indexOf("Branch EEE"));
});

test("F. unknown vacancy is explicit and never rendered as zero", () => {
  const html = renderStudentGuidancePage(submitted());
  assert.match(
    html,
    /Vacancy information not published \/ not available in the current source\./,
  );
  assert.doesNotMatch(html, />0 seat\(s\)</);
});

test("G. INVALID_REQUEST issues are rendered safely", () => {
  const boundary: GuidanceJsonBoundary = () =>
    JSON.stringify({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Request validation failed",
        issues: [
          {
            path: "profile.maths_mark",
            code: "INVALID_TYPE",
            message: "profile.maths_mark must be a finite number or null",
          },
        ],
      },
    });
  const state = submitStudentGuidanceForm(form(), dependencies(), boundary);
  const html = renderStudentGuidancePage(state);
  assert.match(html, /Please check your information/);
  assert.match(html, /profile\.maths_mark must be a finite number or null/);
});

test("H. EXECUTION_FAILED renders a generic message without internal details", () => {
  const boundary: GuidanceJsonBoundary = () =>
    JSON.stringify({
      ok: false,
      error: {
        code: "EXECUTION_FAILED",
        message: "C:\\secret\\engine.ts stack trace",
        issues: [],
      },
    });
  const html = renderStudentGuidancePage(
    submitStudentGuidanceForm(form(), dependencies(), boundary),
  );
  assert.match(html, /Please try again later/);
  assert.doesNotMatch(html, /secret|stack trace|engine\.ts/);
});

test("I. submission delegates exactly once through the Slice 7 JSON boundary", () => {
  let calls = 0;
  let capturedRequest = "";
  const boundary: GuidanceJsonBoundary = (requestJson, deps) => {
    calls += 1;
    capturedRequest = requestJson;
    return handleGuidanceJson(requestJson, deps);
  };
  const request = form();
  submitStudentGuidanceForm(request, dependencies(), boundary);
  assert.equal(calls, 1);
  assert.deepEqual(JSON.parse(capturedRequest), request);
});

test("J. identical API state renders identical meaningful HTML", () => {
  const state = submitted();
  const first = renderStudentGuidancePage(state);
  const second = renderStudentGuidancePage(state);
  assert.equal(first, second);
});

test("responsive page uses semantic labelled controls and text status", () => {
  const html = renderStudentGuidancePage({ form: form(), response: null });
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<form id="guidance-form"[^>]*>/);
  assert.match(html, /<label for="profile-maths_mark">/);
  assert.match(html, /<button type="submit">Get guidance<\/button>/);
  assert.match(html, /@media\(max-width:35rem\)/);
  assert.match(html, /Unknown \/ unanswered/);
});

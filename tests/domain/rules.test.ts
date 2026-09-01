import assert from "node:assert/strict";
import test from "node:test";

import type {
  Community,
  NativityExceptionType,
  VocationalSubjectGroupCode,
} from "../../src/domain/enums.ts";
import type { StudentProfile } from "../../src/domain/models.ts";
import {
  evaluateEligibility,
  RULE_EXECUTORS,
  RULE_IDS,
  type EligibilityEvaluationRequest,
} from "../../src/domain/rules.ts";
import { studentProfile } from "./fixtures.ts";

const BASIC_REQUEST: EligibilityEvaluationRequest = {
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

function academicProfile(
  overrides: Partial<StudentProfile> = {},
): StudentProfile {
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

function vocationalProfile(
  community: Community,
  code: VocationalSubjectGroupCode,
): StudentProfile {
  return academicProfile({
    maths_mark: null,
    physics_mark: null,
    chemistry_mark: null,
    qualifying_stream: "HSC_VOCATIONAL",
    community,
    vocational_subject_group_code: code,
    vocational_related_subject_mark: 60,
    vocational_theory_mark: 60,
    vocational_practical_mark: 60,
  });
}

function outcomeFor(result: ReturnType<typeof evaluateEligibility>, ruleId: string) {
  return result.checks.find(({ rule_id }) => rule_id === ruleId)?.outcome;
}

test("all ELG001-ELG032 rule IDs have exactly one registered executor", () => {
  const expected = Array.from(
    { length: 32 },
    (_, index) => `ELG${String(index + 1).padStart(3, "0")}`,
  );
  assert.deepEqual(RULE_IDS, expected);
  assert.deepEqual(Object.keys(RULE_EXECUTORS), expected);
  assert.equal(new Set(RULE_IDS).size, 32);
});

test("representative academic case produces explainable eligible checks and cutoff", () => {
  const result = evaluateEligibility(academicProfile(), BASIC_REQUEST);

  assert.equal(result.outcome, "ELIGIBLE");
  assert.equal(result.cutoff, 165);
  assert.equal(outcomeFor(result, "ELG002"), "ELIGIBLE");
  assert.equal(outcomeFor(result, "ELG016"), "ELIGIBLE");
  assert.equal(result.checks.every((check) => check.source_id === "SRC002"), true);
  assert.equal(result.checks.every((check) => check.source_year === 2026), true);
  assert.deepEqual(result.matched_rule_ids, result.checks.map(({ rule_id }) => rule_id));
});

test("representative academic threshold failure is INELIGIBLE", () => {
  const result = evaluateEligibility(
    academicProfile({ maths_mark: 30, physics_mark: 30, chemistry_mark: 30 }),
    BASIC_REQUEST,
  );
  assert.equal(outcomeFor(result, "ELG016"), "INELIGIBLE");
  assert.equal(result.outcome, "INELIGIBLE");
});

test("null class history stays unknown and produces NEEDS_REVIEW", () => {
  const result = evaluateEligibility(
    academicProfile({
      tn_study_years_or_classes: {
        ...ALL_IN_TN,
        class_8_in_tn: null,
      },
    }),
    BASIC_REQUEST,
  );
  assert.equal(outcomeFor(result, "ELG002"), "NEEDS_REVIEW");
  assert.equal(result.outcome, "NEEDS_REVIEW");
  assert.equal(
    result.blocking_missing_fields.includes(
      "tn_study_years_or_classes.class_8_in_tn",
    ),
    true,
  );
});

test("ELG010 normalization request always produces explicit NEEDS_REVIEW", () => {
  const result = evaluateEligibility(academicProfile(), {
    ...BASIC_REQUEST,
    normalized_cross_board_merit_ranking_requested: true,
  });
  const check = result.checks.find(({ rule_id }) => rule_id === "ELG010");
  assert.equal(check?.outcome, "NEEDS_REVIEW");
  assert.equal(check?.reason_code, "ELG010_NORMALIZATION_FORMULA_NOT_DEFINED");
});

test("ELG012 refugee pathway stays NEEDS_REVIEW even with evidence flags", () => {
  const result = evaluateEligibility(
    academicProfile({
      nativity_exception_type: "SRI_LANKAN_TAMIL_REFUGEE",
      refugee_identification_available: true,
      required_documents_available: true,
    }),
    BASIC_REQUEST,
  );
  assert.equal(outcomeFor(result, "ELG012"), "NEEDS_REVIEW");
});

test("ELG030 does not invent grade-to-mark conversion", () => {
  const result = evaluateEligibility(
    academicProfile({
      grade_certificate_used: true,
      actual_marks_available: false,
    }),
    BASIC_REQUEST,
  );
  const check = result.checks.find(({ rule_id }) => rule_id === "ELG030");
  assert.equal(check?.outcome, "NEEDS_REVIEW");
  assert.equal(
    check?.reason_code,
    "ELG030_GRADE_TO_MARK_CONVERSION_NOT_DEFINED",
  );
});

test("ELG032 requires original marks for post-2005 improvement marks", () => {
  const result = evaluateEligibility(
    academicProfile({
      improvement_marks_used: true,
      improvement_marks_year: 2006,
      original_maths_mark: null,
      original_physics_mark: null,
      original_chemistry_mark: null,
    }),
    BASIC_REQUEST,
  );
  const check = result.checks.find(({ rule_id }) => rule_id === "ELG032");
  assert.equal(check?.outcome, "NEEDS_REVIEW");
  assert.equal(check?.reason_code, "ELG032_REQUIRED_ORIGINAL_MARKS_UNAVAILABLE");
});

test("government-school assertion alone never proves 7.5 percent entitlement", () => {
  const notRequested = evaluateEligibility(
    academicProfile({ govt_school_7_5: true }),
    BASIC_REQUEST,
  );
  assert.equal(notRequested.outcome, "ELIGIBLE");

  const requested = evaluateEligibility(
    academicProfile({ govt_school_7_5: true }),
    { ...BASIC_REQUEST, govt_school_7_5_entitlement_requested: true },
  );
  assert.equal(requested.outcome, "NEEDS_REVIEW");
  assert.equal(
    requested.blocking_missing_fields.includes("govt_school_7_5_entitlement"),
    true,
  );
});

test("academic and vocational community rules use frozen thresholds", () => {
  const academicCases: readonly [Community, string][] = [
    ["GENERAL", "ELG016"],
    ["BC", "ELG017"],
    ["MBC", "ELG018"],
    ["SC", "ELG019"],
  ];
  for (const [community, ruleId] of academicCases) {
    assert.equal(
      outcomeFor(evaluateEligibility(academicProfile({ community }), BASIC_REQUEST), ruleId),
      "ELIGIBLE",
    );
  }

  const vocationalCases: readonly [Community, string][] = [
    ["GENERAL", "ELG020"],
    ["BCM", "ELG021"],
    ["DNC", "ELG022"],
    ["ST", "ELG023"],
  ];
  for (const [community, ruleId] of vocationalCases) {
    assert.equal(
      outcomeFor(
        evaluateEligibility(vocationalProfile(community, "2921"), {
          ...BASIC_REQUEST,
          academic_merit_cutoff_requested: false,
        }),
        ruleId,
      ),
      "ELIGIBLE",
    );
  }
});

test("each prescribed vocational group maps to ELG024-ELG029", () => {
  const cases: readonly [VocationalSubjectGroupCode, string][] = [
    ["2921", "ELG024"],
    ["2922", "ELG025"],
    ["2923", "ELG026"],
    ["2924", "ELG027"],
    ["2925", "ELG028"],
    ["2926", "ELG029"],
  ];
  for (const [code, ruleId] of cases) {
    const result = evaluateEligibility(vocationalProfile("GENERAL", code), {
      ...BASIC_REQUEST,
      academic_merit_cutoff_requested: false,
    });
    assert.equal(outcomeFor(result, ruleId), "ELIGIBLE");
  }
});

test("all frozen nativity pathways dispatch only mapped rules", () => {
  const cases: readonly [
    NativityExceptionType,
    Partial<StudentProfile>,
    string,
    "ELIGIBLE" | "NEEDS_REVIEW",
  ][] = [
    ["NONE", {}, "ELG002", "ELIGIBLE"],
    [
      "TN_NATIVE_STUDIED_OUTSIDE_TN",
      {
        tamil_nadu_native: true,
        nativity_certificate_available: true,
        tn_study_years_or_classes: { ...ALL_IN_TN, class_8_in_tn: false },
      },
      "ELG003",
      "ELIGIBLE",
    ],
    [
      "CENTRAL_GOVT_EMPLOYEE_CHILD",
      {
        parent_tn_service_years: 5,
        parent_employer_certificate_available: true,
      },
      "ELG004",
      "ELIGIBLE",
    ],
    [
      "PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD",
      {
        parent_tn_service_years: 5,
        parent_employer_certificate_available: true,
        required_documents_available: true,
      },
      "ELG005",
      "ELIGIBLE",
    ],
    ["OTHER_STATE_STUDIED_IN_TN", {}, "ELG006", "ELIGIBLE"],
    [
      "ALL_INDIA_SERVICE_TN_CADRE_CHILD",
      { parent_self_declaration_available: true },
      "ELG011",
      "ELIGIBLE",
    ],
    [
      "SRI_LANKAN_TAMIL_REFUGEE",
      {
        refugee_identification_available: true,
        required_documents_available: true,
      },
      "ELG012",
      "NEEDS_REVIEW",
    ],
    [
      "OCI_PIO_TN_NATIVE",
      { tamil_nadu_native: true, oci_pio_card_available: true },
      "ELG013",
      "ELIGIBLE",
    ],
  ];

  for (const [pathway, overrides, ruleId, expected] of cases) {
    const result = evaluateEligibility(
      academicProfile({ nativity_exception_type: pathway, ...overrides }),
      BASIC_REQUEST,
    );
    assert.equal(outcomeFor(result, ruleId), expected);
  }
});

test("scenario coverage accounts for every frozen rule ID", () => {
  const results = [
    evaluateEligibility(academicProfile(), {
      ...BASIC_REQUEST,
      normalized_cross_board_merit_ranking_requested: true,
    }),
    evaluateEligibility(
      academicProfile({
        nativity_exception_type: "TN_NATIVE_STUDIED_OUTSIDE_TN",
        tamil_nadu_native: true,
        nativity_certificate_available: true,
        tn_study_years_or_classes: { ...ALL_IN_TN, class_8_in_tn: false },
      }),
      BASIC_REQUEST,
    ),
    evaluateEligibility(
      academicProfile({
        nativity_exception_type: "CENTRAL_GOVT_EMPLOYEE_CHILD",
        parent_tn_service_years: 5,
        parent_employer_certificate_available: true,
      }),
      BASIC_REQUEST,
    ),
    evaluateEligibility(
      academicProfile({
        nativity_exception_type:
          "PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD",
        parent_tn_service_years: 5,
        parent_employer_certificate_available: true,
        required_documents_available: true,
      }),
      BASIC_REQUEST,
    ),
    evaluateEligibility(
      academicProfile({ nativity_exception_type: "OTHER_STATE_STUDIED_IN_TN" }),
      BASIC_REQUEST,
    ),
    evaluateEligibility(
      academicProfile({
        nativity_exception_type: "ALL_INDIA_SERVICE_TN_CADRE_CHILD",
        parent_self_declaration_available: true,
      }),
      BASIC_REQUEST,
    ),
    evaluateEligibility(
      academicProfile({ nativity_exception_type: "SRI_LANKAN_TAMIL_REFUGEE" }),
      BASIC_REQUEST,
    ),
    evaluateEligibility(
      academicProfile({
        nativity_exception_type: "OCI_PIO_TN_NATIVE",
        tamil_nadu_native: true,
        oci_pio_card_available: true,
      }),
      BASIC_REQUEST,
    ),
    ...(["BC", "MBC", "SC"] as const).map((community) =>
      evaluateEligibility(academicProfile({ community }), BASIC_REQUEST),
    ),
    ...(
      [
        ["GENERAL", "2921"],
        ["BC", "2922"],
        ["MBC", "2923"],
        ["SC", "2924"],
        ["GENERAL", "2925"],
        ["GENERAL", "2926"],
      ] as const
    ).map(([community, code]) =>
      evaluateEligibility(vocationalProfile(community, code), {
        ...BASIC_REQUEST,
        academic_merit_cutoff_requested: false,
      }),
    ),
  ];

  const covered = new Set(results.flatMap(({ matched_rule_ids }) => matched_rule_ids));
  assert.deepEqual([...covered].sort(), [...RULE_IDS]);
});

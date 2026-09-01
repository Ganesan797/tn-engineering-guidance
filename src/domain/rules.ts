import { ADMISSION_YEAR } from "./constants.ts";
import { aggregateEligibilityOutcome, assertEligibilityResult } from "./eligibility.ts";
import { VOCATIONAL_SUBJECT_GROUP_CODES } from "./enums.ts";
import type { EligibilityOutcome } from "./enums.ts";
import type {
  EligibilityCheck,
  EligibilityResult,
  StudentProfile,
} from "./models.ts";

export const RULE_IDS = Array.from(
  { length: 32 },
  (_, index) => `ELG${String(index + 1).padStart(3, "0")}`,
) as readonly RuleId[];

export type RuleId = `ELG${string}`;

export interface EligibilityEvaluationRequest {
  readonly academic_merit_cutoff_requested: boolean;
  readonly normalized_cross_board_merit_ranking_requested: boolean;
  readonly govt_school_7_5_entitlement_requested: boolean;
}

interface EffectiveMarks {
  readonly academic: readonly [number | null, number | null, number | null];
  readonly vocational: readonly [number | null, number | null, number | null];
}

interface RuleEvaluation {
  readonly check: EligibilityCheck;
  readonly blockingMissingFields: readonly string[];
  readonly cutoff?: number;
}

type RuleExecutor = (
  profile: StudentProfile,
  request: EligibilityEvaluationRequest,
  marks: EffectiveMarks,
) => RuleEvaluation | null;

const ACADEMIC_STREAMS = new Set([
  "HSC_ACADEMIC",
  "EQUIVALENT_ACADEMIC",
]);
const VOCATIONAL_STREAMS = new Set([
  "HSC_VOCATIONAL",
  "EQUIVALENT_VOCATIONAL",
]);
const OPEN_COMPETITION_NATIVITY_TYPES = new Set([
  "CENTRAL_GOVT_EMPLOYEE_CHILD",
  "PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD",
  "ALL_INDIA_SERVICE_TN_CADRE_CHILD",
  "OTHER_STATE_STUDIED_IN_TN",
]);
const ELG015_NATIVITY_TYPES = new Set([
  "TN_NATIVE_STUDIED_OUTSIDE_TN",
  ...OPEN_COMPETITION_NATIVITY_TYPES,
]);

const RULE_PAGES: Readonly<Record<RuleId, number>> = Object.fromEntries(
  RULE_IDS.map((ruleId) => {
    const number = Number(ruleId.slice(3));
    if (number <= 6) return [ruleId, 1];
    if (number === 9 || number === 10) return [ruleId, 9];
    return [ruleId, 2];
  }),
) as Readonly<Record<RuleId, number>>;

function isAcademic(profile: StudentProfile): boolean {
  return profile.qualifying_stream !== null &&
    ACADEMIC_STREAMS.has(profile.qualifying_stream);
}

function isVocational(profile: StudentProfile): boolean {
  return profile.qualifying_stream !== null &&
    VOCATIONAL_STREAMS.has(profile.qualifying_stream);
}

function hasNull(values: readonly unknown[]): boolean {
  return values.some((value) => value === null);
}

function result(
  rule_id: RuleId,
  outcome: EligibilityOutcome,
  reason_code: string,
  explanation: string,
  blockingMissingFields: readonly string[] = [],
  cutoff?: number,
): RuleEvaluation {
  return {
    check: {
      rule_id,
      outcome,
      reason_code,
      explanation,
      source_id: "SRC002",
      source_page: RULE_PAGES[rule_id],
      source_year: ADMISSION_YEAR,
    },
    blockingMissingFields,
    ...(cutoff === undefined ? {} : { cutoff }),
  };
}

function eligible(ruleId: RuleId, explanation: string, cutoff?: number) {
  return result(
    ruleId,
    "ELIGIBLE",
    `${ruleId}_PREDICATE_SATISFIED`,
    explanation,
    [],
    cutoff,
  );
}

function ineligible(ruleId: RuleId, explanation: string) {
  return result(
    ruleId,
    "INELIGIBLE",
    `${ruleId}_PREDICATE_FAILED`,
    explanation,
  );
}

function needsReview(
  ruleId: RuleId,
  explanation: string,
  fields: readonly string[] = [],
  reason = `${ruleId}_MISSING_OR_UNSUPPORTED_REQUIRED_DATA`,
) {
  return result(ruleId, "NEEDS_REVIEW", reason, explanation, fields);
}

function effectiveMarks(profile: StudentProfile): EffectiveMarks {
  if (profile.improvement_marks_used === null) {
    return {
      academic: [null, null, null],
      vocational: [null, null, null],
    };
  }

  if (
    profile.improvement_marks_used === true &&
    profile.improvement_marks_year === null
  ) {
    return {
      academic: [null, null, null],
      vocational: [null, null, null],
    };
  }

  const useOriginal =
    profile.improvement_marks_used === true &&
    profile.improvement_marks_year !== null &&
    profile.improvement_marks_year >= 2006;

  return useOriginal
    ? {
        academic: [
          profile.original_maths_mark,
          profile.original_physics_mark,
          profile.original_chemistry_mark,
        ],
        vocational: [
          profile.original_vocational_related_subject_mark,
          profile.original_vocational_theory_mark,
          profile.original_vocational_practical_mark,
        ],
      }
    : {
        academic: [
          profile.maths_mark,
          profile.physics_mark,
          profile.chemistry_mark,
        ],
        vocational: [
          profile.vocational_related_subject_mark,
          profile.vocational_theory_mark,
          profile.vocational_practical_mark,
        ],
      };
}

function studyFields(profile: StudentProfile) {
  const history = profile.tn_study_years_or_classes;
  return [
    history.class_8_in_tn,
    history.class_9_in_tn,
    history.class_10_in_tn,
    history.class_11_in_tn,
    history.class_12_in_tn,
  ] as const;
}

const STUDY_FIELD_NAMES = [
  "tn_study_years_or_classes.class_8_in_tn",
  "tn_study_years_or_classes.class_9_in_tn",
  "tn_study_years_or_classes.class_10_in_tn",
  "tn_study_years_or_classes.class_11_in_tn",
  "tn_study_years_or_classes.class_12_in_tn",
] as const;

function missingNames(
  names: readonly string[],
  values: readonly unknown[],
): string[] {
  return names.filter((_, index) => values[index] === null);
}

function thresholdRule(
  ruleId: RuleId,
  applies: (profile: StudentProfile) => boolean,
  markKind: "academic" | "vocational",
  threshold: number,
): RuleExecutor {
  return (profile, _request, marks) => {
    if (!applies(profile)) return null;
    const values = marks[markKind];
    const fieldNames =
      markKind === "academic"
        ? [
            "effective_maths_mark",
            "effective_physics_mark",
            "effective_chemistry_mark",
          ]
        : [
            "effective_vocational_related_subject_mark",
            "effective_vocational_theory_mark",
            "effective_vocational_practical_mark",
          ];
    if (hasNull(values)) {
      const missing = missingNames(fieldNames, values);
      return needsReview(ruleId, "Required effective marks are unavailable.", missing);
    }
    const average =
      (values[0] as number) + (values[1] as number) + (values[2] as number);
    const unroundedAverage = average / 3;
    return unroundedAverage >= threshold
      ? eligible(
          ruleId,
          `Unrounded ${markKind} average meets the ${threshold.toFixed(2)} threshold.`,
        )
      : ineligible(
          ruleId,
          `Unrounded ${markKind} average is below the ${threshold.toFixed(2)} threshold.`,
        );
  };
}

function vocationalGroupRule(
  ruleId: RuleId,
  acceptedCodes: readonly string[],
  handlesGroupFailure = false,
): RuleExecutor {
  return (profile) => {
    if (!isVocational(profile)) return null;
    const code = profile.vocational_subject_group_code;
    if (code === null) {
      return needsReview(
        ruleId,
        "Vocational subject group code is required.",
        ["vocational_subject_group_code"],
      );
    }
    if (acceptedCodes.includes(code)) {
      return eligible(ruleId, "Prescribed vocational subject group matches this rule.");
    }
    if (!VOCATIONAL_SUBJECT_GROUP_CODES.includes(code) && handlesGroupFailure) {
      return ineligible(
        ruleId,
        "Vocational subject group code is outside all prescribed ELG024-ELG029 groups.",
      );
    }
    return null;
  };
}

export const RULE_EXECUTORS: Readonly<Record<RuleId, RuleExecutor>> = {
  ELG001: (profile) =>
    profile.qualifying_stream === null
      ? needsReview(
          "ELG001",
          "Qualifying stream is required.",
          ["qualifying_stream"],
        )
      : eligible("ELG001", "Qualifying stream is a frozen V1 value."),

  ELG002: (profile) => {
    if (profile.nativity_exception_type === null) {
      return needsReview(
        "ELG002",
        "Nativity pathway is required.",
        ["nativity_exception_type"],
      );
    }
    if (profile.nativity_exception_type !== "NONE") return null;
    const classes = studyFields(profile);
    if (hasNull(classes)) {
      return needsReview(
        "ELG002",
        "Complete VIII-XII Tamil Nadu study history is required.",
        missingNames(STUDY_FIELD_NAMES, classes),
      );
    }
    return classes.every((value) => value === true)
      ? eligible(
          "ELG002",
          "Classes VIII-XII were studied in Tamil Nadu; no Nativity Certificate is required by this pathway.",
        )
      : ineligible(
          "ELG002",
          "At least one of classes VIII-XII was not studied in Tamil Nadu.",
        );
  },

  ELG003: (profile) => {
    if (profile.nativity_exception_type !== "TN_NATIVE_STUDIED_OUTSIDE_TN") {
      return null;
    }
    const classes = studyFields(profile);
    const values = [
      profile.tamil_nadu_native,
      ...classes,
      profile.nativity_certificate_available,
    ];
    const names = [
      "tamil_nadu_native",
      ...STUDY_FIELD_NAMES,
      "nativity_certificate_available",
    ];
    if (hasNull(values)) {
      return needsReview(
        "ELG003",
        "Required nativity evidence is incomplete.",
        missingNames(names, values),
      );
    }
    const anyOutside = classes.some((value) => value === false);
    return profile.tamil_nadu_native === true &&
      anyOutside &&
      profile.nativity_certificate_available === true
      ? eligible("ELG003", "Tamil Nadu nativity, outside study, and certificate predicates pass.")
      : ineligible("ELG003", "A required ELG003 nativity predicate failed.");
  },

  ELG004: (profile) => {
    if (profile.nativity_exception_type !== "CENTRAL_GOVT_EMPLOYEE_CHILD") {
      return null;
    }
    const values = [
      profile.parent_tn_service_years,
      profile.parent_employer_certificate_available,
    ];
    const names = [
      "parent_tn_service_years",
      "parent_employer_certificate_available",
    ];
    if (hasNull(values)) {
      return needsReview("ELG004", "Required parent evidence is incomplete.", missingNames(names, values));
    }
    return (profile.parent_tn_service_years as number) >= 5 &&
      profile.parent_employer_certificate_available === true
      ? eligible("ELG004", "Five-year service and employer certificate predicates pass.")
      : ineligible("ELG004", "Five-year service or employer certificate predicate failed.");
  },

  ELG005: (profile) => {
    if (
      profile.nativity_exception_type !==
      "PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD"
    ) {
      return null;
    }
    const values = [
      profile.parent_tn_service_years,
      profile.parent_employer_certificate_available,
      profile.required_documents_available,
    ];
    const names = [
      "parent_tn_service_years",
      "parent_employer_certificate_available",
      "required_documents_available",
    ];
    if (hasNull(values)) {
      return needsReview("ELG005", "Required parent evidence is incomplete.", missingNames(names, values));
    }
    return (profile.parent_tn_service_years as number) >= 5 &&
      profile.parent_employer_certificate_available === true &&
      profile.required_documents_available === true
      ? eligible("ELG005", "Service, employer certificate, and supporting-document predicates pass.")
      : ineligible("ELG005", "A required ELG005 parent-evidence predicate failed.");
  },

  ELG006: (profile) => {
    if (profile.nativity_exception_type !== "OTHER_STATE_STUDIED_IN_TN") {
      return null;
    }
    const classes = studyFields(profile);
    if (hasNull(classes)) {
      return needsReview(
        "ELG006",
        "Complete VIII-XII Tamil Nadu study history is required.",
        missingNames(STUDY_FIELD_NAMES, classes),
      );
    }
    return classes.every((value) => value === true)
      ? eligible("ELG006", "Classes VIII-XII were studied in Tamil Nadu.")
      : ineligible("ELG006", "At least one required class was not studied in Tamil Nadu.");
  },

  ELG007: (profile, _request, marks) => {
    if (!isAcademic(profile)) return null;
    const names = [
      "effective_maths_mark",
      "effective_physics_mark",
      "effective_chemistry_mark",
    ];
    if (hasNull(marks.academic)) {
      return needsReview(
        "ELG007",
        "All effective academic marks are required.",
        missingNames(names, marks.academic),
      );
    }
    return eligible("ELG007", "Academic stream and effective mark predicates pass.");
  },

  ELG008: (profile, _request, marks) => {
    if (!isVocational(profile)) return null;
    const values = [profile.vocational_subject_group_code, ...marks.vocational];
    const names = [
      "vocational_subject_group_code",
      "effective_vocational_related_subject_mark",
      "effective_vocational_theory_mark",
      "effective_vocational_practical_mark",
    ];
    if (hasNull(values)) {
      return needsReview(
        "ELG008",
        "Vocational group and effective marks are required.",
        missingNames(names, values),
      );
    }
    return VOCATIONAL_SUBJECT_GROUP_CODES.includes(
      profile.vocational_subject_group_code as never,
    )
      ? eligible("ELG008", "Prescribed vocational group and effective marks are present.")
      : ineligible("ELG008", "Vocational subject group is outside the prescribed set.");
  },

  ELG009: (profile, request, marks) => {
    if (!request.academic_merit_cutoff_requested) return null;
    const names = [
      "effective_maths_mark",
      "effective_physics_mark",
      "effective_chemistry_mark",
    ];
    if (!isAcademic(profile) || hasNull(marks.academic)) {
      const missing = hasNull(marks.academic)
        ? missingNames(names, marks.academic)
        : ["qualifying_stream"];
      return needsReview(
        "ELG009",
        "Academic merit cutoff cannot be calculated from the required effective marks.",
        missing,
      );
    }
    const cutoff =
      (marks.academic[0] as number) +
      (marks.academic[1] as number) / 2 +
      (marks.academic[2] as number) / 2;
    return eligible("ELG009", "Academic merit cutoff was calculated from effective marks.", cutoff);
  },

  ELG010: (_profile, request) =>
    request.normalized_cross_board_merit_ranking_requested
      ? needsReview(
          "ELG010",
          "The frozen V1 evidence defines no cross-board normalization formula.",
          [],
          "ELG010_NORMALIZATION_FORMULA_NOT_DEFINED",
        )
      : null,

  ELG011: (profile) => {
    if (
      profile.nativity_exception_type !==
      "ALL_INDIA_SERVICE_TN_CADRE_CHILD"
    ) {
      return null;
    }
    if (profile.parent_self_declaration_available === null) {
      return needsReview(
        "ELG011",
        "Parent self-declaration availability is required.",
        ["parent_self_declaration_available"],
      );
    }
    return profile.parent_self_declaration_available
      ? eligible("ELG011", "Required parent self-declaration is available.")
      : ineligible("ELG011", "Required parent self-declaration is unavailable.");
  },

  ELG012: (profile) =>
    profile.nativity_exception_type === "SRI_LANKAN_TAMIL_REFUGEE"
      ? needsReview(
          "ELG012",
          "Exact Tamil Nadu study duration is not defined by frozen V1 evidence.",
          [],
          "ELG012_EXACT_TN_STUDY_DURATION_NOT_DEFINED",
        )
      : null,

  ELG013: (profile) => {
    if (profile.nativity_exception_type !== "OCI_PIO_TN_NATIVE") return null;
    const values = [profile.tamil_nadu_native, profile.oci_pio_card_available];
    const names = ["tamil_nadu_native", "oci_pio_card_available"];
    if (hasNull(values)) {
      return needsReview("ELG013", "Required OCI/PIO evidence is incomplete.", missingNames(names, values));
    }
    return profile.tamil_nadu_native === true &&
      profile.oci_pio_card_available === true
      ? eligible("ELG013", "Tamil Nadu nativity and OCI/PIO card predicates pass.")
      : ineligible("ELG013", "Tamil Nadu nativity or OCI/PIO card predicate failed.");
  },

  ELG014: (profile) => {
    if (profile.nativity_exception_type === null) return null;
    return OPEN_COMPETITION_NATIVITY_TYPES.has(profile.nativity_exception_type)
      ? eligible("ELG014", "Selected nativity pathway is classified under Open Competition.")
      : null;
  },

  ELG015: (profile) => {
    const pathway = profile.nativity_exception_type;
    if (pathway === null || !ELG015_NATIVITY_TYPES.has(pathway)) return null;
    const requirements: Partial<Record<typeof pathway, readonly [string, boolean | null][]>> = {
      TN_NATIVE_STUDIED_OUTSIDE_TN: [
        ["nativity_certificate_available", profile.nativity_certificate_available],
      ],
      CENTRAL_GOVT_EMPLOYEE_CHILD: [
        [
          "parent_employer_certificate_available",
          profile.parent_employer_certificate_available,
        ],
      ],
      PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD: [
        [
          "parent_employer_certificate_available",
          profile.parent_employer_certificate_available,
        ],
        ["required_documents_available", profile.required_documents_available],
      ],
      ALL_INDIA_SERVICE_TN_CADRE_CHILD: [
        [
          "parent_self_declaration_available",
          profile.parent_self_declaration_available,
        ],
      ],
      OTHER_STATE_STUDIED_IN_TN: [],
    };
    const selected = requirements[pathway] ?? [];
    const missing = selected
      .filter(([, value]) => value === null)
      .map(([field]) => field);
    if (missing.length > 0) {
      return needsReview("ELG015", "Required pathway documents are unknown.", missing);
    }
    return selected.some(([, value]) => value === false)
      ? ineligible("ELG015", "A required pathway document is unavailable.")
      : eligible("ELG015", "All frozen ELG015 pathway document predicates pass.");
  },

  ELG016: thresholdRule(
    "ELG016",
    (profile) => isAcademic(profile) && profile.community === "GENERAL",
    "academic",
    45,
  ),
  ELG017: thresholdRule(
    "ELG017",
    (profile) =>
      isAcademic(profile) &&
      (profile.community === "BC" || profile.community === "BCM"),
    "academic",
    40,
  ),
  ELG018: thresholdRule(
    "ELG018",
    (profile) =>
      isAcademic(profile) &&
      (profile.community === "MBC" || profile.community === "DNC"),
    "academic",
    40,
  ),
  ELG019: thresholdRule(
    "ELG019",
    (profile) =>
      isAcademic(profile) &&
      (profile.community === "SC" ||
        profile.community === "SCA" ||
        profile.community === "ST"),
    "academic",
    40,
  ),
  ELG020: thresholdRule(
    "ELG020",
    (profile) => isVocational(profile) && profile.community === "GENERAL",
    "vocational",
    45,
  ),
  ELG021: thresholdRule(
    "ELG021",
    (profile) =>
      isVocational(profile) &&
      (profile.community === "BC" || profile.community === "BCM"),
    "vocational",
    40,
  ),
  ELG022: thresholdRule(
    "ELG022",
    (profile) =>
      isVocational(profile) &&
      (profile.community === "MBC" || profile.community === "DNC"),
    "vocational",
    40,
  ),
  ELG023: thresholdRule(
    "ELG023",
    (profile) =>
      isVocational(profile) &&
      (profile.community === "SC" ||
        profile.community === "SCA" ||
        profile.community === "ST"),
    "vocational",
    40,
  ),

  ELG024: vocationalGroupRule("ELG024", ["2921", "2971"]),
  ELG025: vocationalGroupRule("ELG025", ["2922", "2972"]),
  ELG026: vocationalGroupRule("ELG026", ["2923", "2973"]),
  ELG027: vocationalGroupRule("ELG027", ["2924", "2974"]),
  ELG028: vocationalGroupRule("ELG028", ["2925", "2975"]),
  ELG029: vocationalGroupRule("ELG029", ["2926", "2976"], true),

  ELG030: (profile) => {
    if (profile.grade_certificate_used === null) {
      return needsReview(
        "ELG030",
        "Whether a grade certificate is used is unknown.",
        ["grade_certificate_used"],
      );
    }
    if (profile.grade_certificate_used === false) {
      return eligible("ELG030", "Direct supplied marks may be used.");
    }
    if (profile.actual_marks_available === null) {
      return needsReview(
        "ELG030",
        "Actual mark availability is unknown for grade evidence.",
        ["actual_marks_available"],
      );
    }
    return profile.actual_marks_available
      ? eligible("ELG030", "Actual supplied marks corresponding to grade evidence may be used.")
      : needsReview(
          "ELG030",
          "No grade-to-mark conversion is defined by frozen V1 evidence.",
          [],
          "ELG030_GRADE_TO_MARK_CONVERSION_NOT_DEFINED",
        );
  },

  ELG031: (profile, _request, marks) => {
    const values = isAcademic(profile)
      ? marks.academic
      : isVocational(profile)
        ? marks.vocational
        : null;
    if (values === null) return null;
    if (hasNull(values)) {
      return needsReview(
        "ELG031",
        "Required effective marks for unrounded minimum eligibility are unavailable.",
        ["applicable_effective_marks"],
      );
    }
    return eligible(
      "ELG031",
      "Minimum eligibility uses the unrounded raw average and no normalized marks.",
    );
  },

  ELG032: (profile) => {
    if (profile.improvement_marks_used === null) {
      return needsReview(
        "ELG032",
        "Improvement-mark usage is unknown.",
        ["improvement_marks_used"],
      );
    }
    if (profile.improvement_marks_used === false) {
      return eligible("ELG032", "Normal mark fields are effective.");
    }
    if (profile.improvement_marks_year === null) {
      return needsReview(
        "ELG032",
        "Improvement-mark year is required.",
        ["improvement_marks_year"],
      );
    }
    if (profile.improvement_marks_year < 2006) {
      return eligible("ELG032", "Frozen post-2005 improvement-mark prohibition does not apply.");
    }
    const originalMarks = isAcademic(profile)
      ? [
          profile.original_maths_mark,
          profile.original_physics_mark,
          profile.original_chemistry_mark,
        ]
      : isVocational(profile)
        ? [
            profile.original_vocational_related_subject_mark,
            profile.original_vocational_theory_mark,
            profile.original_vocational_practical_mark,
          ]
        : null;
    if (originalMarks === null || hasNull(originalMarks)) {
      return needsReview(
        "ELG032",
        "Complete original marks are unavailable for post-2005 improvement-mark exclusion.",
        originalMarks === null
          ? ["qualifying_stream"]
          : ["required_complete_original_mark_set"],
        "ELG032_REQUIRED_ORIGINAL_MARKS_UNAVAILABLE",
      );
    }
    return eligible("ELG032", "Complete original marks replace disallowed post-2005 improvement marks.");
  },
};

export function evaluateEligibility(
  profile: StudentProfile,
  request: EligibilityEvaluationRequest,
): EligibilityResult {
  const marks = effectiveMarks(profile);
  const evaluations = RULE_IDS.map((ruleId) =>
    RULE_EXECUTORS[ruleId](profile, request, marks),
  ).filter((evaluation): evaluation is RuleEvaluation => evaluation !== null);

  const checks = evaluations.map(({ check }) => check);
  const blockingMissingFieldSet = new Set(
    evaluations.flatMap(({ blockingMissingFields }) => blockingMissingFields),
  );

  if ((isAcademic(profile) || isVocational(profile)) && profile.community === null) {
    blockingMissingFieldSet.add("community");
  }

  if (request.govt_school_7_5_entitlement_requested) {
    blockingMissingFieldSet.add("govt_school_7_5_entitlement");
  }

  const blockingMissingFields = Array.from(blockingMissingFieldSet);

  const cutoffEvaluation = evaluations.find(
    ({ check, cutoff }) => check.rule_id === "ELG009" && cutoff !== undefined,
  );
  const resultValue: EligibilityResult = {
    outcome: aggregateEligibilityOutcome(checks, blockingMissingFields),
    cutoff: cutoffEvaluation?.cutoff ?? null,
    checks,
    blocking_missing_fields: blockingMissingFields,
    matched_rule_ids: checks.map(({ rule_id }) => rule_id),
  };

  assertEligibilityResult(resultValue);
  return resultValue;
}

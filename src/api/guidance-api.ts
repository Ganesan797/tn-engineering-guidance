import {
  createGuidance,
  type GuidanceDependencies,
  type GuidanceRequest,
  type GuidanceResult,
} from "../application/index.ts";
import {
  COMMUNITIES,
  NATIVITY_EXCEPTION_TYPES,
  QUALIFYING_STREAMS,
  QUOTAS,
  RESERVATION_CATEGORIES,
  VOCATIONAL_SUBJECT_GROUP_CODES,
  isFrozenEnumValue,
} from "../domain/enums.ts";

export interface ApiValidationIssue {
  readonly path: string;
  readonly code:
    | "MISSING_FIELD"
    | "INVALID_TYPE"
    | "INVALID_VALUE"
    | "UNSUPPORTED_VALUE"
    | "UNSUPPORTED_FIELD";
  readonly message: string;
}

export interface ApiErrorBody {
  readonly code: "INVALID_JSON" | "INVALID_REQUEST" | "EXECUTION_FAILED";
  readonly message: string;
  readonly issues: readonly ApiValidationIssue[];
}

export type GuidanceApiResponse =
  | { readonly ok: true; readonly result: GuidanceResult }
  | { readonly ok: false; readonly error: ApiErrorBody };

type MutableIssues = ApiValidationIssue[];
type UnknownRecord = Record<string, unknown>;

const PROFILE_NUMBER_FIELDS = [
  "maths_mark",
  "physics_mark",
  "chemistry_mark",
  "original_maths_mark",
  "original_physics_mark",
  "original_chemistry_mark",
  "parent_tn_service_years",
  "vocational_related_subject_mark",
  "vocational_theory_mark",
  "vocational_practical_mark",
  "original_vocational_related_subject_mark",
  "original_vocational_theory_mark",
  "original_vocational_practical_mark",
] as const;

const PROFILE_BOOLEAN_FIELDS = [
  "govt_school_7_5",
  "tamil_nadu_native",
  "nativity_certificate_available",
  "studied_in_tamil_nadu",
  "study_history_evidence_available",
  "parent_evidence_available",
  "required_documents_available",
  "parent_employer_certificate_available",
  "parent_self_declaration_available",
  "refugee_identification_available",
  "oci_pio_card_available",
  "grade_certificate_used",
  "actual_marks_available",
  "improvement_marks_used",
] as const;

const STUDY_HISTORY_FIELDS = [
  "class_8_in_tn",
  "class_9_in_tn",
  "class_10_in_tn",
  "class_11_in_tn",
  "class_12_in_tn",
] as const;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function issue(
  issues: MutableIssues,
  path: string,
  code: ApiValidationIssue["code"],
  message: string,
): void {
  issues.push({ path, code, message });
}

function requiredRecord(
  parent: UnknownRecord,
  field: string,
  issues: MutableIssues,
): UnknownRecord | null {
  if (!(field in parent)) {
    issue(issues, field, "MISSING_FIELD", `${field} is required`);
    return null;
  }
  const value = parent[field];
  if (!isRecord(value)) {
    issue(issues, field, "INVALID_TYPE", `${field} must be an object`);
    return null;
  }
  return value;
}

function requiredField(
  object: UnknownRecord,
  field: string,
  path: string,
  issues: MutableIssues,
): unknown {
  if (!(field in object)) {
    issue(issues, path, "MISSING_FIELD", `${path} is required`);
    return undefined;
  }
  return object[field];
}

function rejectUnexpectedFields(
  object: UnknownRecord,
  allowed: ReadonlySet<string>,
  path: string,
  issues: MutableIssues,
): void {
  for (const field of Object.keys(object)) {
    if (!allowed.has(field)) {
      const fieldPath = path === "$" ? field : `${path}.${field}`;
      issue(
        issues,
        fieldPath,
        "UNSUPPORTED_FIELD",
        `${fieldPath} is not supported`,
      );
    }
  }
}

function nullableBoolean(
  value: unknown,
  path: string,
  issues: MutableIssues,
): void {
  if (value !== null && typeof value !== "boolean") {
    issue(issues, path, "INVALID_TYPE", `${path} must be boolean or null`);
  }
}

function nullableFiniteNumber(
  value: unknown,
  path: string,
  issues: MutableIssues,
): void {
  if (
    value !== null &&
    (typeof value !== "number" || !Number.isFinite(value))
  ) {
    issue(issues, path, "INVALID_TYPE", `${path} must be a finite number or null`);
  }
}

function nullableInteger(
  value: unknown,
  path: string,
  issues: MutableIssues,
): void {
  if (value !== null && !Number.isInteger(value)) {
    issue(issues, path, "INVALID_TYPE", `${path} must be an integer or null`);
  }
}

function nullableEnum<const T extends readonly string[]>(
  value: unknown,
  values: T,
  path: string,
  issues: MutableIssues,
): void {
  if (value !== null && !isFrozenEnumValue(values, value)) {
    issue(issues, path, "UNSUPPORTED_VALUE", `${path} is not a supported value`);
  }
}

function validateProfile(profile: UnknownRecord, issues: MutableIssues): void {
  rejectUnexpectedFields(
    profile,
    new Set([
      ...PROFILE_NUMBER_FIELDS,
      ...PROFILE_BOOLEAN_FIELDS,
      "improvement_marks_year",
      "qualifying_stream",
      "community",
      "nativity_exception_type",
      "vocational_subject_group_code",
      "tn_study_years_or_classes",
    ]),
    "profile",
    issues,
  );
  for (const field of PROFILE_NUMBER_FIELDS) {
    nullableFiniteNumber(
      requiredField(profile, field, `profile.${field}`, issues),
      `profile.${field}`,
      issues,
    );
  }
  for (const field of PROFILE_BOOLEAN_FIELDS) {
    nullableBoolean(
      requiredField(profile, field, `profile.${field}`, issues),
      `profile.${field}`,
      issues,
    );
  }
  nullableInteger(
    requiredField(
      profile,
      "improvement_marks_year",
      "profile.improvement_marks_year",
      issues,
    ),
    "profile.improvement_marks_year",
    issues,
  );
  nullableEnum(
    requiredField(profile, "qualifying_stream", "profile.qualifying_stream", issues),
    QUALIFYING_STREAMS,
    "profile.qualifying_stream",
    issues,
  );
  nullableEnum(
    requiredField(profile, "community", "profile.community", issues),
    COMMUNITIES,
    "profile.community",
    issues,
  );
  nullableEnum(
    requiredField(
      profile,
      "nativity_exception_type",
      "profile.nativity_exception_type",
      issues,
    ),
    NATIVITY_EXCEPTION_TYPES,
    "profile.nativity_exception_type",
    issues,
  );
  nullableEnum(
    requiredField(
      profile,
      "vocational_subject_group_code",
      "profile.vocational_subject_group_code",
      issues,
    ),
    VOCATIONAL_SUBJECT_GROUP_CODES,
    "profile.vocational_subject_group_code",
    issues,
  );

  const history = requiredRecord(profile, "tn_study_years_or_classes", issues);
  if (history !== null) {
    rejectUnexpectedFields(
      history,
      new Set(STUDY_HISTORY_FIELDS),
      "profile.tn_study_years_or_classes",
      issues,
    );
    for (const field of STUDY_HISTORY_FIELDS) {
      nullableBoolean(
        requiredField(
          history,
          field,
          `profile.tn_study_years_or_classes.${field}`,
          issues,
        ),
        `profile.tn_study_years_or_classes.${field}`,
        issues,
      );
    }
  }
}

function validateEligibilityRequest(
  request: UnknownRecord,
  issues: MutableIssues,
): void {
  const fields = [
    "academic_merit_cutoff_requested",
    "normalized_cross_board_merit_ranking_requested",
    "govt_school_7_5_entitlement_requested",
  ] as const;
  rejectUnexpectedFields(
    request,
    new Set(fields),
    "eligibility_request",
    issues,
  );
  for (const field of fields) {
    const path = `eligibility_request.${field}`;
    const value = requiredField(request, field, path, issues);
    if (typeof value !== "boolean") {
      issue(issues, path, "INVALID_TYPE", `${path} must be boolean`);
    }
  }
}

function validatePreferences(
  preferences: UnknownRecord,
  issues: MutableIssues,
): void {
  rejectUnexpectedFields(
    preferences,
    new Set(["branch_preference_order"]),
    "preferences",
    issues,
  );
  const path = "preferences.branch_preference_order";
  const value = requiredField(
    preferences,
    "branch_preference_order",
    path,
    issues,
  );
  if (value === null) return;
  if (!Array.isArray(value)) {
    issue(issues, path, "INVALID_TYPE", `${path} must be an array or null`);
    return;
  }
  const seen = new Set<string>();
  for (const [index, branchId] of value.entries()) {
    if (typeof branchId !== "string" || branchId.trim().length === 0) {
      issue(
        issues,
        `${path}[${index}]`,
        "INVALID_TYPE",
        `${path}[${index}] must be a non-empty string`,
      );
    } else if (seen.has(branchId)) {
      issue(
        issues,
        `${path}[${index}]`,
        "INVALID_VALUE",
        `${path} must not contain duplicates`,
      );
    } else {
      seen.add(branchId);
    }
  }
}

function validateCounselling(
  counselling: UnknownRecord,
  dependencies: GuidanceDependencies,
  issues: MutableIssues,
): void {
  rejectUnexpectedFields(
    counselling,
    new Set([
      "snapshot_id",
      "snapshot_stage",
      "round",
      "reservation_category",
      "quota",
    ]),
    "counselling",
    issues,
  );
  const snapshotId = requiredField(
    counselling,
    "snapshot_id",
    "counselling.snapshot_id",
    issues,
  );
  const snapshotStage = requiredField(
    counselling,
    "snapshot_stage",
    "counselling.snapshot_stage",
    issues,
  );
  const round = requiredField(
    counselling,
    "round",
    "counselling.round",
    issues,
  );
  const reservationCategory = requiredField(
    counselling,
    "reservation_category",
    "counselling.reservation_category",
    issues,
  );
  const quota = requiredField(
    counselling,
    "quota",
    "counselling.quota",
    issues,
  );

  if (typeof snapshotId !== "string" || snapshotId.trim().length === 0) {
    issue(
      issues,
      "counselling.snapshot_id",
      "INVALID_TYPE",
      "counselling.snapshot_id must be a non-empty string",
    );
  }
  if (
    snapshotStage !== null &&
    (typeof snapshotStage !== "string" || snapshotStage.trim().length === 0)
  ) {
    issue(
      issues,
      "counselling.snapshot_stage",
      "INVALID_TYPE",
      "counselling.snapshot_stage must be a non-empty string or null",
    );
  }
  nullableInteger(round, "counselling.round", issues);
  nullableEnum(
    reservationCategory,
    RESERVATION_CATEGORIES,
    "counselling.reservation_category",
    issues,
  );
  nullableEnum(quota, QUOTAS, "counselling.quota", issues);

  if (typeof snapshotId === "string" && snapshotId.trim().length > 0) {
    const snapshot = dependencies.snapshots
      .snapshots()
      .find(({ snapshot_id }) => snapshot_id === snapshotId);
    if (snapshot === undefined) {
      issue(
        issues,
        "counselling.snapshot_id",
        "UNSUPPORTED_VALUE",
        "counselling snapshot is not available",
      );
    } else if (snapshot.stage !== snapshotStage) {
      issue(
        issues,
        "counselling.snapshot_stage",
        "INVALID_VALUE",
        "counselling snapshot stage does not match",
      );
    }
  }
}

function validateRequest(
  value: unknown,
  dependencies: GuidanceDependencies,
): { readonly request: GuidanceRequest | null; readonly issues: ApiValidationIssue[] } {
  const issues: ApiValidationIssue[] = [];
  if (!isRecord(value)) {
    issue(issues, "$", "INVALID_TYPE", "request body must be an object");
    return { request: null, issues };
  }
  rejectUnexpectedFields(
    value,
    new Set(["profile", "eligibility_request", "preferences", "counselling"]),
    "$",
    issues,
  );
  const profile = requiredRecord(value, "profile", issues);
  const eligibilityRequest = requiredRecord(
    value,
    "eligibility_request",
    issues,
  );
  const preferences = requiredRecord(value, "preferences", issues);
  const counselling = requiredRecord(value, "counselling", issues);
  if (profile !== null) validateProfile(profile, issues);
  if (eligibilityRequest !== null) {
    validateEligibilityRequest(eligibilityRequest, issues);
  }
  if (preferences !== null) validatePreferences(preferences, issues);
  if (counselling !== null) {
    validateCounselling(counselling, dependencies, issues);
  }
  return {
    request: issues.length === 0 ? (value as unknown as GuidanceRequest) : null,
    issues,
  };
}

function errorResponse(
  code: ApiErrorBody["code"],
  message: string,
  issues: readonly ApiValidationIssue[] = [],
): string {
  return JSON.stringify({ ok: false, error: { code, message, issues } });
}

export function handleGuidanceJson(
  requestJson: string,
  dependencies: GuidanceDependencies,
): string {
  let body: unknown;
  try {
    body = JSON.parse(requestJson);
  } catch {
    return errorResponse("INVALID_JSON", "Request body is not valid JSON");
  }

  const validation = validateRequest(body, dependencies);
  if (validation.request === null) {
    return errorResponse(
      "INVALID_REQUEST",
      "Request validation failed",
      validation.issues,
    );
  }

  try {
    const result = createGuidance(validation.request, dependencies);
    const response: GuidanceApiResponse = { ok: true, result };
    return JSON.stringify(response);
  } catch {
    return errorResponse(
      "EXECUTION_FAILED",
      "Guidance execution could not be completed",
    );
  }
}

import type { GuidanceDependencies, GuidanceRequest } from "../application/index.ts";
import {
  handleGuidanceJson,
  type GuidanceApiResponse,
} from "../api/index.ts";
import {
  COMMUNITIES,
  NATIVITY_EXCEPTION_TYPES,
  QUALIFYING_STREAMS,
  QUOTAS,
  RESERVATION_CATEGORIES,
  VOCATIONAL_SUBJECT_GROUP_CODES,
} from "../domain/enums.ts";
import type { StudentProfile } from "../domain/models.ts";

export type GuidanceJsonBoundary = (
  requestJson: string,
  dependencies: GuidanceDependencies,
) => string;

export interface StudentGuidancePageState {
  readonly form: GuidanceRequest;
  readonly response: GuidanceApiResponse | null;
}

export type StudentGuidanceFormValues = Readonly<Record<string, string>>;

const NUMBER_FIELDS: readonly (keyof StudentProfile)[] = [
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
  "improvement_marks_year",
];

const BOOLEAN_FIELDS: readonly (keyof StudentProfile)[] = [
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
];

const STUDY_FIELDS = [
  "class_8_in_tn",
  "class_9_in_tn",
  "class_10_in_tn",
  "class_11_in_tn",
  "class_12_in_tn",
] as const;

const BRANCH_IDS = ["CSE", "IT", "ECE", "EEE", "MECH"] as const;

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function label(field: string): string {
  return field
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function option(
  value: string,
  text: string,
  selectedValue: unknown,
): string {
  const selected = selectedValue === value ? " selected" : "";
  return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(text)}</option>`;
}

function nullableBooleanControl(
  name: string,
  current: boolean | null,
): string {
  const id = name.replaceAll(".", "-");
  return `<label for="${id}">${escapeHtml(label(name.split(".").at(-1) ?? name))}</label>
<select id="${id}" name="${escapeHtml(name)}">
  ${option("", "Unknown / unanswered", current === null ? "" : String(current))}
  ${option("true", "Yes", String(current))}
  ${option("false", "No", String(current))}
</select>`;
}

function nullableEnumControl(
  name: string,
  current: string | null,
  values: readonly string[],
): string {
  const id = name.replaceAll(".", "-");
  return `<label for="${id}">${escapeHtml(label(name.split(".").at(-1) ?? name))}</label>
<select id="${id}" name="${escapeHtml(name)}">
  ${option("", "Unknown / unanswered", current ?? "")}
  ${values.map((value) => option(value, value, current)).join("\n  ")}
</select>`;
}

function profileForm(profile: StudentProfile): string {
  const numeric = NUMBER_FIELDS.map((field) => {
    const value = profile[field] as number | null;
    const id = `profile-${String(field)}`;
    return `<div class="field"><label for="${id}">${escapeHtml(label(String(field)))}</label><input id="${id}" name="profile.${String(field)}" type="number" step="any" value="${value === null ? "" : escapeHtml(value)}" placeholder="Unknown" /></div>`;
  }).join("\n");
  const booleans = BOOLEAN_FIELDS.map(
    (field) =>
      `<div class="field">${nullableBooleanControl(`profile.${String(field)}`, profile[field] as boolean | null)}</div>`,
  ).join("\n");
  const study = STUDY_FIELDS.map(
    (field) =>
      `<div class="field">${nullableBooleanControl(`profile.tn_study_years_or_classes.${field}`, profile.tn_study_years_or_classes[field])}</div>`,
  ).join("\n");
  return `<fieldset><legend>Academic and evidence details</legend><div class="grid">${numeric}${booleans}
<div class="field">${nullableEnumControl("profile.qualifying_stream", profile.qualifying_stream, QUALIFYING_STREAMS)}</div>
<div class="field">${nullableEnumControl("profile.community", profile.community, COMMUNITIES)}</div>
<div class="field">${nullableEnumControl("profile.nativity_exception_type", profile.nativity_exception_type, NATIVITY_EXCEPTION_TYPES)}</div>
<div class="field">${nullableEnumControl("profile.vocational_subject_group_code", profile.vocational_subject_group_code, VOCATIONAL_SUBJECT_GROUP_CODES)}</div>
${study}</div></fieldset>`;
}

function preferencesForm(request: GuidanceRequest): string {
  const preferences = request.preferences.branch_preference_order ?? [];
  return `<fieldset><legend>Branch preference order</legend><p>Choose branches in order. Unselected branches remain neutral.</p><div class="grid">${BRANCH_IDS.map(
    (_, index) => `<div class="field"><label for="branch-preference-${index}">Preference ${index + 1}</label><select id="branch-preference-${index}" name="preferences.branch_preference_order.${index}">${option("", "No preference", preferences[index] ?? "")}${BRANCH_IDS.map((branch) => option(branch, branch, preferences[index] ?? "")).join("")}</select></div>`,
  ).join("\n")}</div></fieldset>`;
}

function counsellingForm(request: GuidanceRequest): string {
  const context = request.counselling;
  return `<fieldset><legend>Counselling context</legend><div class="grid">
<div class="field"><label for="snapshot-id">Snapshot</label><input id="snapshot-id" name="counselling.snapshot_id" value="${escapeHtml(context.snapshot_id)}" required /></div>
<div class="field"><label for="snapshot-stage">Stage</label><input id="snapshot-stage" name="counselling.snapshot_stage" value="${context.snapshot_stage === null ? "" : escapeHtml(context.snapshot_stage)}" placeholder="Not specified" /></div>
<div class="field"><label for="round">Round</label><input id="round" name="counselling.round" type="number" step="1" value="${context.round === null ? "" : escapeHtml(context.round)}" placeholder="Not specified" /></div>
<div class="field">${nullableEnumControl("counselling.reservation_category", context.reservation_category, RESERVATION_CATEGORIES)}</div>
<div class="field">${nullableEnumControl("counselling.quota", context.quota, QUOTAS)}</div>
</div></fieldset>`;
}

function eligibilityDetails(result: GuidanceApiResponse & { ok: true }): string {
  const eligibility = result.result.eligibility;
  const blocking = eligibility.blocking_missing_fields.length === 0
    ? ""
    : `<section aria-labelledby="missing-heading"><h3 id="missing-heading">Information still needed</h3><ul>${eligibility.blocking_missing_fields.map((field) => `<li>${escapeHtml(label(field))}</li>`).join("")}</ul></section>`;
  return `<section class="status" aria-live="polite"><h2>Eligibility: ${escapeHtml(eligibility.outcome)}</h2>${eligibility.cutoff === null ? "" : `<p>Deterministic cutoff: <strong>${escapeHtml(eligibility.cutoff)}</strong></p>`}${blocking}
<details><summary>Eligibility explanations</summary><ul>${eligibility.checks.map((check) => `<li><strong>${escapeHtml(check.rule_id)} — ${escapeHtml(check.reason_code)}</strong><br />${escapeHtml(check.explanation)}<br /><small>Source ${escapeHtml(check.source_id)}${check.source_page === null ? "" : `, page ${escapeHtml(check.source_page)}`}</small></li>`).join("")}</ul></details></section>`;
}

function choices(result: GuidanceApiResponse & { ok: true }): string {
  if (result.result.eligibility.outcome === "INELIGIBLE") return "";
  const cards = result.result.ordered_choices.map(({ position, candidate, ordering_reason_codes, ordering_explanations }) => {
    const vacancy = candidate.vacancy_evidence_state === "UNKNOWN_OR_UNPUBLISHED"
      ? "Vacancy information not published / not available in the current source."
      : "Published seat evidence is available below.";
    const facts = candidate.applicable_seat_facts.length === 0
      ? ""
      : `<ul>${candidate.applicable_seat_facts.map((fact) => `<li>${escapeHtml(fact.fact_type)}: ${escapeHtml(fact.seat_count)} seat(s)${fact.round === null ? "" : `, round ${escapeHtml(fact.round)}`}${fact.reservation_category === null ? "" : `, category ${escapeHtml(fact.reservation_category)}`}${fact.quota === null ? "" : `, quota ${escapeHtml(fact.quota)}`} — source ${escapeHtml(fact.source_id)}${fact.source_page === null ? "" : `, page ${escapeHtml(fact.source_page)}`}</li>`).join("")}</ul>`;
    return `<article class="choice"><h3>${position}. ${escapeHtml(candidate.college_name)} — ${escapeHtml(candidate.programme_name)}</h3><p>College code ${escapeHtml(candidate.tnea_college_code)} · Branch ${escapeHtml(candidate.branch_id)}</p><p><strong>Vacancy:</strong> ${escapeHtml(vacancy)}</p>${facts}<details><summary>Why this order and evidence</summary><p>${ordering_explanations.map(escapeHtml).join(" ")}</p><p>Reason codes: ${[...ordering_reason_codes, ...candidate.explanation_reason_codes].map(escapeHtml).join(", ")}</p><ul>${candidate.evidence.map((source) => `<li>Source ${escapeHtml(source.source_id)}${source.source_page === null ? "" : `, page ${escapeHtml(source.source_page)}`}</li>`).join("")}</ul></details></article>`;
  }).join("\n");
  return `<section aria-labelledby="choices-heading"><h2 id="choices-heading">Ordered programme choices</h2>${cards}</section>`;
}

function responseSection(response: GuidanceApiResponse | null): string {
  if (response === null) return "";
  if (!response.ok) {
    if (response.error.code === "EXECUTION_FAILED") {
      return `<section class="error" role="alert"><h2>We could not complete your guidance</h2><p>Please try again later.</p></section>`;
    }
    return `<section class="error" role="alert"><h2>Please check your information</h2><ul>${response.error.issues.map((item) => `<li data-field-path="${escapeHtml(item.path)}">${escapeHtml(item.message)}</li>`).join("")}</ul></section>`;
  }
  return `${eligibilityDetails(response)}${choices(response)}<details><summary>All sources</summary><ul>${response.result.provenance.map((source) => `<li>Source ${escapeHtml(source.source_id)}${source.source_page === null ? "" : `, page ${escapeHtml(source.source_page)}`}</li>`).join("")}</ul></details>`;
}

function nullableBooleanValue(value: string): boolean | null {
  if (value === "") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("Invalid boolean form value");
}

function nullableNumberValue(value: string): number | null {
  return value === "" ? null : Number(value);
}

export function guidanceRequestFromFormValues(
  values: StudentGuidanceFormValues,
  template: GuidanceRequest,
): GuidanceRequest {
  const studyHistory: Record<
    (typeof STUDY_FIELDS)[number],
    boolean | null
  > = {
    ...template.profile.tn_study_years_or_classes,
  };
  const profile = {
    ...template.profile,
    tn_study_years_or_classes: studyHistory,
  } as StudentProfile;
  for (const field of NUMBER_FIELDS) {
    (profile as unknown as Record<string, unknown>)[field] = nullableNumberValue(
      values[`profile.${String(field)}`] ?? "",
    );
  }
  for (const field of BOOLEAN_FIELDS) {
    (profile as unknown as Record<string, unknown>)[field] = nullableBooleanValue(
      values[`profile.${String(field)}`] ?? "",
    );
  }
  for (const field of STUDY_FIELDS) {
    studyHistory[field] = nullableBooleanValue(
      values[`profile.tn_study_years_or_classes.${field}`] ?? "",
    );
  }
  const nullableText = (name: string): string | null =>
    (values[name] ?? "") === "" ? null : values[name];
  (profile as unknown as Record<string, unknown>).qualifying_stream =
    nullableText("profile.qualifying_stream");
  (profile as unknown as Record<string, unknown>).community =
    nullableText("profile.community");
  (profile as unknown as Record<string, unknown>).nativity_exception_type =
    nullableText("profile.nativity_exception_type");
  (profile as unknown as Record<string, unknown>).vocational_subject_group_code =
    nullableText("profile.vocational_subject_group_code");

  const branchOrder = BRANCH_IDS.map(
    (_, index) => values[`preferences.branch_preference_order.${index}`] ?? "",
  ).filter((value) => value !== "");

  return {
    profile,
    eligibility_request: {
      academic_merit_cutoff_requested:
        values["eligibility_request.academic_merit_cutoff_requested"] === "true",
      normalized_cross_board_merit_ranking_requested:
        values[
          "eligibility_request.normalized_cross_board_merit_ranking_requested"
        ] === "true",
      govt_school_7_5_entitlement_requested:
        values["eligibility_request.govt_school_7_5_entitlement_requested"] ===
        "true",
    },
    preferences: {
      branch_preference_order: branchOrder.length === 0 ? null : branchOrder,
    },
    counselling: {
      snapshot_id: values["counselling.snapshot_id"] ?? "",
      snapshot_stage: nullableText("counselling.snapshot_stage"),
      round: nullableNumberValue(values["counselling.round"] ?? ""),
      reservation_category: nullableText("counselling.reservation_category") as GuidanceRequest["counselling"]["reservation_category"],
      quota: nullableText("counselling.quota") as GuidanceRequest["counselling"]["quota"],
    },
  } as GuidanceRequest;
}

export function submitStudentGuidanceForm(
  form: GuidanceRequest,
  dependencies: GuidanceDependencies,
  boundary: GuidanceJsonBoundary = handleGuidanceJson,
): StudentGuidancePageState {
  const response = JSON.parse(
    boundary(JSON.stringify(form), dependencies),
  ) as GuidanceApiResponse;
  return { form, response };
}

export function bindStudentGuidanceForm(
  document: Document,
  template: GuidanceRequest,
  dependencies: GuidanceDependencies,
  boundary: GuidanceJsonBoundary = handleGuidanceJson,
): void {
  const form = document.querySelector<HTMLFormElement>("#guidance-form");
  const result = document.querySelector<HTMLElement>("#guidance-result");
  if (form === null || result === null) {
    throw new Error("Student guidance form container is unavailable");
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values: Record<string, string> = {};
    new FormData(form).forEach((value, name) => {
      values[name] = String(value);
    });
    const request = guidanceRequestFromFormValues(values, template);
    const state = submitStudentGuidanceForm(
      request,
      dependencies,
      boundary,
    );
    result.innerHTML = responseSection(state.response);
  });
}

export function renderStudentGuidancePage(
  state: StudentGuidancePageState,
): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>TN Engineering Guidance</title><style>
:root{font-family:system-ui,sans-serif;color:#172033;background:#f7f8fa}body{margin:0}.page{max-width:70rem;margin:auto;padding:1rem}form,section,.choice,details{background:white;border:1px solid #d8dde6;border-radius:.5rem;padding:1rem;margin-block:1rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:.8rem}.field{display:flex;flex-direction:column;gap:.3rem}label,legend{font-weight:650}input,select,button{font:inherit;padding:.65rem;min-height:2.75rem}button{cursor:pointer;background:#174ea6;color:white;border:0;border-radius:.35rem}.status h2,.error h2{margin-top:0}.error{border-color:#a61b1b}.choice h3{margin-top:0}small{color:#46536a}@media(max-width:35rem){.page{padding:.65rem}form,section,.choice,details{padding:.75rem}.grid{grid-template-columns:1fr}}
</style></head><body><main class="page"><h1>TN Engineering Guidance</h1><p>Enter what you know. Leave unknown answers as “Unknown / unanswered”.</p><form id="guidance-form">${profileForm(state.form.profile)}${preferencesForm(state.form)}${counsellingForm(state.form)}
<input type="hidden" name="eligibility_request.academic_merit_cutoff_requested" value="${escapeHtml(state.form.eligibility_request.academic_merit_cutoff_requested)}" />
<input type="hidden" name="eligibility_request.normalized_cross_board_merit_ranking_requested" value="${escapeHtml(state.form.eligibility_request.normalized_cross_board_merit_ranking_requested)}" />
<input type="hidden" name="eligibility_request.govt_school_7_5_entitlement_requested" value="${escapeHtml(state.form.eligibility_request.govt_school_7_5_entitlement_requested)}" />
<button type="submit">Get guidance</button></form><div id="guidance-result">${responseSection(state.response)}</div></main></body></html>`;
}

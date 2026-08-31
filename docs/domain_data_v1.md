# Domain & Data V1 Contract

Status: **FROZEN**

This document is the implementation contract for TN Engineering Guidance Domain/Data V1.

Codex and all implementations MUST follow this contract literally. No implementation may infer additional domain rules, eligibility pathways, reservation categories, nativity categories, document requirements, or admission semantics.

---

# 1. Global invariants

```text
ADMISSION_YEAR = 2026
```

The admission year is a global V1 constant. It is NOT a `StudentProfile` field.

Canonical programme identity is:

```text
(tnea_college_code, branch_id)
```

`tnea_college_code` and `branch_id` MUST be used for joins and canonical identification.

`college_id`, college names, branch names, or alternative aliases MUST NOT replace these canonical identifiers.

## 1.1 Null semantics

```text
null != false
```

For nullable booleans:

```text
true  = explicitly known true
false = explicitly known false
null  = unknown / unanswered / unavailable
```

A required value of `null` MUST NOT be interpreted as `false`.

When an applicable rule requires information that is `null`, unsupported, insufficient, contradictory, or otherwise cannot be deterministically evaluated:

```text
NEEDS_REVIEW
```

MUST be returned for that rule.

## 1.2 Eligibility outcome vocabulary

Only these external eligibility outcomes exist:

```text
ELIGIBLE
INELIGIBLE
NEEDS_REVIEW
```

There is no separate `UNKNOWN` state.

## 1.3 Aggregate eligibility semantics

For all required applicable eligibility rules:

```text
if any applicable rule is definitively INELIGIBLE:
    overall outcome = INELIGIBLE

else if any required applicable rule is NEEDS_REVIEW:
    overall outcome = NEEDS_REVIEW

else:
    overall outcome = ELIGIBLE
```

A selection-only rule MUST NOT independently make an otherwise eligible candidate `INELIGIBLE`.

## 1.4 Government-school 7.5% invariant

```text
govt_school_7_5 = true
```

means only that the profile claims the 7.5% government-school condition.

It MUST NOT by itself be interpreted as proof that the candidate is legally entitled to the 7.5% quota.

ELG001–ELG032 do not contain the complete substantive 7.5% entitlement predicate.

If V1 is asked to establish 7.5% entitlement from these rules alone:

```text
NEEDS_REVIEW
```

MUST be returned.

## 1.5 Merit versus minimum eligibility

ELG009 and ELG010 relate to selection/merit.

ELG016–ELG023 and ELG031 relate to minimum eligibility.

Normalised marks MUST NOT be used for minimum eligibility.

Rounding MUST NOT be used for minimum eligibility.

## 1.6 Effective marks and improvement marks

When:

```text
improvement_marks_used = false
```

the normal mark fields are the effective marks.

When:

```text
improvement_marks_used = true
AND improvement_marks_year >= 2006
```

ELG032 requires improvement marks to be ignored.

In that case, eligibility and merit calculations MUST use the corresponding `original_*` mark fields.

If the required original marks are unavailable:

```text
NEEDS_REVIEW
```

When:

```text
improvement_marks_used = null
```

and marks are required for the requested eligibility decision:

```text
NEEDS_REVIEW
```

---

# 2. Frozen enums

## 2.1 qualifying_stream

```text
HSC_ACADEMIC
HSC_VOCATIONAL
EQUIVALENT_ACADEMIC
EQUIVALENT_VOCATIONAL
```

No other V1 values are permitted.

## 2.2 nativity_exception_type

```text
NONE
TN_NATIVE_STUDIED_OUTSIDE_TN
CENTRAL_GOVT_EMPLOYEE_CHILD
PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD
ALL_INDIA_SERVICE_TN_CADRE_CHILD
OTHER_STATE_STUDIED_IN_TN
SRI_LANKAN_TAMIL_REFUGEE
OCI_PIO_TN_NATIVE
```

`NONE` means the ordinary VIII–XII Tamil Nadu school-study pathway represented by ELG002.

ELG014 is not a separate nativity pathway and therefore has no enum value.

## 2.3 eligibility outcome

```text
ELIGIBLE
INELIGIBLE
NEEDS_REVIEW
```

## 2.4 community

```text
GENERAL
BC
BCM
MBC
DNC
SC
SCA
ST
```

Rule grouping:

```text
GENERAL       -> ELG016 / ELG020
BC, BCM       -> ELG017 / ELG021
MBC, DNC      -> ELG018 / ELG022
SC, SCA, ST   -> ELG019 / ELG023
```

## 2.5 prescribed vocational subject group codes

```text
2921
2971
2922
2972
2923
2973
2924
2974
2925
2975
2926
2976
```

Mappings:

```text
2921 / 2971 -> Basic Mechanical Engineering
2922 / 2972 -> Basic Electrical Engineering
2923 / 2973 -> Basic Electronics Engineering
2924 / 2974 -> Basic Civil Engineering
2925 / 2975 -> Basic Automobile Engineering
2926 / 2976 -> Textile Technology
```

---

# 3. StudentProfile

`StudentProfile` does NOT contain `admission_year`.

V1 always uses:

```text
ADMISSION_YEAR = 2026
```

## 3.1 Academic fields

### maths_mark

```text
type: number
nullable: true
```

Meaning: Mathematics mark proposed for eligibility/merit evaluation before ELG032 improvement-mark substitution.

### physics_mark

```text
type: number
nullable: true
```

Meaning: Physics mark proposed for eligibility/merit evaluation before ELG032 substitution.

### chemistry_mark

```text
type: number
nullable: true
```

Meaning: Chemistry mark proposed for eligibility/merit evaluation before ELG032 substitution.

### original_maths_mark

```text
type: number
nullable: true
```

Meaning: valid Mathematics mark excluding disallowed improvement marks. Used when ELG032 requires improvement marks obtained from 2006 onward to be ignored.

### original_physics_mark

```text
type: number
nullable: true
```

Meaning: valid Physics mark excluding disallowed improvement marks.

### original_chemistry_mark

```text
type: number
nullable: true
```

Meaning: valid Chemistry mark excluding disallowed improvement marks.

### qualifying_stream

```text
type: enum
nullable: true
allowed:
  HSC_ACADEMIC
  HSC_VOCATIONAL
  EQUIVALENT_ACADEMIC
  EQUIVALENT_VOCATIONAL
```

Meaning: qualifying examination stream used by ELG001, ELG007 and ELG008.

---

# 4. Community and quota fields

### community

```text
type: enum
nullable: true
allowed:
  GENERAL
  BC
  BCM
  MBC
  DNC
  SC
  SCA
  ST
```

Meaning: candidate community classification used for minimum eligibility threshold selection.

### govt_school_7_5

```text
type: boolean
nullable: true
```

Meaning: candidate/profile assertion related to the government-school 7.5% quota.

`true` alone MUST NOT establish 7.5% entitlement.

---

# 5. Nativity fields

### tamil_nadu_native

```text
type: boolean
nullable: true
```

Meaning: whether the candidate is established as a Tamil Nadu native for rules that explicitly require Tamil Nadu nativity.

### nativity_certificate_available

```text
type: boolean
nullable: true
```

Meaning: whether the required digitally signed/electronic Nativity Certificate is available.

### nativity_exception_type

```text
type: enum
nullable: true
allowed:
  NONE
  TN_NATIVE_STUDIED_OUTSIDE_TN
  CENTRAL_GOVT_EMPLOYEE_CHILD
  PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD
  ALL_INDIA_SERVICE_TN_CADRE_CHILD
  OTHER_STATE_STUDIED_IN_TN
  SRI_LANKAN_TAMIL_REFUGEE
  OCI_PIO_TN_NATIVE
```

Meaning: selects the V1 nativity pathway.

If nativity eligibility must be evaluated and this field is `null`, nativity outcome is `NEEDS_REVIEW`.

### studied_in_tamil_nadu

```text
type: boolean
nullable: true
```

Meaning: legacy summary field retained by the frozen profile.

It MUST NOT override or replace `tn_study_years_or_classes`.

No ELG001–ELG032 predicate may use this field when class-specific study history is required.

### study_history_evidence_available

```text
type: boolean
nullable: true
```

Meaning: summary metadata stating whether supporting study-history evidence is available.

Class-specific rule predicates are determined from `tn_study_years_or_classes`.

This field MUST NOT replace those class-specific values.

### parent_evidence_available

```text
type: boolean
nullable: true
```

Meaning: retained summary metadata concerning parent-based evidence.

Specific rule predicates MUST use the rule-specific certificate/declaration fields below.

This field MUST NOT substitute for them.

### required_documents_available

```text
type: boolean
nullable: true
```

Meaning: whether all additional rule-specific supporting documents not represented by another dedicated document field are available.

For ELG005 it represents the additional supporting employment/income evidence stated by that rule.

For ELG012 it represents the additional documents stated by that rule, but ELG012 still remains `NEEDS_REVIEW` because its study-duration predicate is not defined.

---

# 6. tn_study_years_or_classes

Exact representation:

```text
tn_study_years_or_classes:
  class_8_in_tn: boolean | null
  class_9_in_tn: boolean | null
  class_10_in_tn: boolean | null
  class_11_in_tn: boolean | null
  class_12_in_tn: boolean | null
```

The object itself is required in a valid `StudentProfile`.

Each contained value is nullable.

## 6.1 Full Tamil Nadu study condition

```text
ALL_VIII_TO_XII_IN_TN =
    class_8_in_tn  == true
AND class_9_in_tn  == true
AND class_10_in_tn == true
AND class_11_in_tn == true
AND class_12_in_tn == true
```

## 6.2 Any VIII–XII study outside Tamil Nadu

```text
ANY_VIII_TO_XII_OUTSIDE_TN =
    class_8_in_tn  == false
OR  class_9_in_tn  == false
OR  class_10_in_tn == false
OR  class_11_in_tn == false
OR  class_12_in_tn == false
```

## 6.3 Unknown study history

If a rule requires the complete VIII–XII history and any required class value is `null`:

```text
NEEDS_REVIEW
```

A `null` class value MUST NOT be interpreted as either studied in Tamil Nadu or studied outside Tamil Nadu.

---

# 7. Parent/special nativity fields

### parent_tn_service_years

```text
type: number
nullable: true
```

Meaning: continuous years the qualifying parent/guardian has served or been employed in Tamil Nadu at application time.

### parent_employer_certificate_available

```text
type: boolean
nullable: true
```

Meaning: whether the employer certificate required by ELG004 or ELG005 is available.

### parent_self_declaration_available

```text
type: boolean
nullable: true
```

Meaning: whether the parent self-declaration required by ELG011 is available.

### refugee_identification_available

```text
type: boolean
nullable: true
```

Meaning: whether the identification certificate required by ELG012 is available.

### oci_pio_card_available

```text
type: boolean
nullable: true
```

Meaning: whether OCI/PIO card evidence required by ELG013 is available.

---

# 8. Vocational fields

### vocational_subject_group_code

```text
type: string enum
nullable: true
allowed:
  "2921"
  "2971"
  "2922"
  "2972"
  "2923"
  "2973"
  "2924"
  "2974"
  "2925"
  "2975"
  "2926"
  "2976"
```

Meaning: prescribed vocational subject-group code used by ELG024–ELG029.

### vocational_related_subject_mark

```text
type: number
nullable: true
```

Meaning: related-subject mark used in vocational minimum eligibility.

### vocational_theory_mark

```text
type: number
nullable: true
```

Meaning: vocational theory mark used in vocational minimum eligibility.

### vocational_practical_mark

```text
type: number
nullable: true
```

Meaning: vocational practical mark used in vocational minimum eligibility.

### original_vocational_related_subject_mark

```text
type: number
nullable: true
```

Meaning: valid related-subject mark excluding disallowed post-2005 improvement marks.

### original_vocational_theory_mark

```text
type: number
nullable: true
```

Meaning: valid vocational theory mark excluding disallowed post-2005 improvement marks.

### original_vocational_practical_mark

```text
type: number
nullable: true
```

Meaning: valid vocational practical mark excluding disallowed post-2005 improvement marks.

---

# 9. Grade/improvement fields

### grade_certificate_used

```text
type: boolean
nullable: true
```

Meaning: whether eligibility evidence is supplied as grades instead of direct marks.

### actual_marks_available

```text
type: boolean
nullable: true
```

Meaning: whether actual marks corresponding to the grade certificate are available.

### improvement_marks_used

```text
type: boolean
nullable: true
```

Meaning: whether marks currently supplied for evaluation include improvement marks.

### improvement_marks_year

```text
type: integer
nullable: true
```

Meaning: year in which the improvement marks were obtained.

---

# 10. EligibilityResult

Exact external schema:

```text
EligibilityResult:
  outcome:
    type: enum
    values:
      ELIGIBLE
      INELIGIBLE
      NEEDS_REVIEW

  cutoff:
    type: number | null

  checks:
    type: array
    items:
      rule_id:
        type: string

      outcome:
        type: enum
        values:
          ELIGIBLE
          INELIGIBLE
          NEEDS_REVIEW

      reason_code:
        type: string

      explanation:
        type: string

      source_id:
        type: string

      source_page:
        type: integer | null

      source_year:
        type: integer
        fixed: 2026

  blocking_missing_fields:
    type: array<string>

  matched_rule_ids:
    type: array<string>
```

`cutoff` is populated only when the ELG009 merit calculation can be executed.

AI MUST NOT modify `outcome`, `cutoff`, rule checks, or rule provenance.

---

# 11. AdmissionSeatFact

Exact schema:

```text
AdmissionSeatFact:
  admission_year:
    type: integer
    nullable: false
    fixed: 2026

  tnea_college_code:
    type: string
    nullable: false

  branch_id:
    type: string
    nullable: false

  fact_type:
    type: enum
    nullable: false
    values:
      SANCTIONED_INTAKE
      CURRENT_VACANCY
      QUOTA_VACANCY

  seat_count:
    type: integer
    nullable: false

  round:
    type: integer
    nullable: true

  reservation_category:
    type: enum
    nullable: true
    values:
      OC
      BC
      BCM
      MBC
      SC
      SCA
      ST

  quota:
    type: enum
    nullable: true
    values:
      GENERAL
      GOVT_SCHOOL_7_5

  source_id:
    type: string
    nullable: false

  source_page:
    type: integer
    nullable: true
```

Canonical identity always includes:

```text
tnea_college_code
branch_id
```

## 11.1 Fact semantics

### SANCTIONED_INTAKE

Required:

```text
fact_type = SANCTIONED_INTAKE
round = null
quota = null
```

`seat_count` means sanctioned intake.

### CURRENT_VACANCY

Required:

```text
fact_type = CURRENT_VACANCY
```

If the source is round-specific:

```text
round != null
```

If the source is not quota-specific:

```text
quota = null
```

If the source explicitly separates reservation categories, `reservation_category` contains that category.

### QUOTA_VACANCY

Required:

```text
fact_type = QUOTA_VACANCY
quota != null
```

If the source is round-specific:

```text
round != null
```

`reservation_category` is populated only when the source itself separates that category.

## 11.2 Non-interchangeability invariant

These meanings MUST NEVER be treated as interchangeable:

```text
SANCTIONED_INTAKE
CURRENT_VACANCY
QUOTA_VACANCY
```

A sanctioned intake count MUST NOT be interpreted as current availability.

A current vacancy MUST NOT be interpreted as sanctioned intake.

A quota vacancy MUST NOT be interpreted as either unrestricted vacancy or sanctioned intake.

---

# 12. Rule execution conventions

For rule descriptions below:

```text
academic_stream =
  qualifying_stream IN {
    HSC_ACADEMIC,
    EQUIVALENT_ACADEMIC
  }

vocational_stream =
  qualifying_stream IN {
    HSC_VOCATIONAL,
    EQUIVALENT_VOCATIONAL
  }
```

Academic effective marks are:

```text
if improvement_marks_used == true
AND improvement_marks_year >= 2006:
    effective_maths_mark     = original_maths_mark
    effective_physics_mark   = original_physics_mark
    effective_chemistry_mark = original_chemistry_mark

else:
    effective_maths_mark     = maths_mark
    effective_physics_mark   = physics_mark
    effective_chemistry_mark = chemistry_mark
```

Vocational effective marks use the equivalent `original_vocational_*` fields under the same ELG032 condition.

Academic minimum average:

```text
ACADEMIC_AVERAGE =
(
    effective_maths_mark
  + effective_physics_mark
  + effective_chemistry_mark
) / 3
```

Vocational minimum average:

```text
VOCATIONAL_AVERAGE =
(
    effective_vocational_related_subject_mark
  + effective_vocational_theory_mark
  + effective_vocational_practical_mark
) / 3
```

No rounding is applied before minimum-eligibility comparison.

Merit cutoff under ELG009:

```text
CUTOFF =
    effective_maths_mark
  + (effective_physics_mark / 2)
  + (effective_chemistry_mark / 2)
```

---

# 13. ELG001–ELG032 executable mapping

## ELG001 — Admission programme

Source:

```text
source_id: SRC002
source_page: 1
valid_year: 2026
```

Required fields:

```text
qualifying_stream
```

Applies when:

```text
always
```

Predicate:

```text
qualifying_stream IN {
  HSC_ACADEMIC,
  HSC_VOCATIONAL,
  EQUIVALENT_ACADEMIC,
  EQUIVALENT_VOCATIONAL
}
```

PASS:

```text
rule outcome = ELIGIBLE
```

FAIL:

No schema-valid enum value produces a definitive failure for this rule.

Missing:

```text
qualifying_stream == null
-> NEEDS_REVIEW
```

---

## ELG002 — Tamil Nadu school study

Source:

```text
SRC002 page 1 year 2026
```

Required fields:

```text
nativity_exception_type
tn_study_years_or_classes.class_8_in_tn
tn_study_years_or_classes.class_9_in_tn
tn_study_years_or_classes.class_10_in_tn
tn_study_years_or_classes.class_11_in_tn
tn_study_years_or_classes.class_12_in_tn
```

Applies when:

```text
nativity_exception_type == NONE
```

Predicate:

```text
ALL_VIII_TO_XII_IN_TN == true
```

PASS:

```text
ELIGIBLE
Nativity Certificate is not required by this pathway.
```

FAIL:

```text
any class_8_in_tn ... class_12_in_tn == false
-> INELIGIBLE for ELG002 pathway
```

Missing:

```text
nativity_exception_type == null
OR any required class flag == null
-> NEEDS_REVIEW
```

---

## ELG003 — Tamil Nadu native studied outside Tamil Nadu

Source:

```text
SRC002 page 1 year 2026
```

Required fields:

```text
nativity_exception_type
tamil_nadu_native
tn_study_years_or_classes.class_8_in_tn
tn_study_years_or_classes.class_9_in_tn
tn_study_years_or_classes.class_10_in_tn
tn_study_years_or_classes.class_11_in_tn
tn_study_years_or_classes.class_12_in_tn
nativity_certificate_available
```

Applies when:

```text
nativity_exception_type == TN_NATIVE_STUDIED_OUTSIDE_TN
```

Predicate:

```text
tamil_nadu_native == true
AND ANY_VIII_TO_XII_OUTSIDE_TN == true
AND nativity_certificate_available == true
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
tamil_nadu_native == false
OR nativity_certificate_available == false
OR all five class flags == true
-> INELIGIBLE for ELG003 pathway
```

Missing:

Any required field `null`:

```text
NEEDS_REVIEW
```

---

## ELG004 — Central Government employee child

Source:

```text
SRC002 page 1 year 2026
```

Required fields:

```text
nativity_exception_type
parent_tn_service_years
parent_employer_certificate_available
```

Applies when:

```text
nativity_exception_type == CENTRAL_GOVT_EMPLOYEE_CHILD
```

Predicate:

```text
parent_tn_service_years >= 5
AND parent_employer_certificate_available == true
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
parent_tn_service_years < 5
OR parent_employer_certificate_available == false
-> INELIGIBLE
```

Missing:

Any required field `null`:

```text
NEEDS_REVIEW
```

---

## ELG005 — Public sector or recognised institution employee child

Source:

```text
SRC002 page 1 year 2026
```

Required fields:

```text
nativity_exception_type
parent_tn_service_years
parent_employer_certificate_available
required_documents_available
```

Applies when:

```text
nativity_exception_type ==
PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD
```

Predicate:

```text
parent_tn_service_years >= 5
AND parent_employer_certificate_available == true
AND required_documents_available == true
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
parent_tn_service_years < 5
OR parent_employer_certificate_available == false
OR required_documents_available == false
-> INELIGIBLE
```

Missing:

Any required field `null`:

```text
NEEDS_REVIEW
```

---

## ELG006 — Other State candidate studied in Tamil Nadu

Source:

```text
SRC002 page 1 year 2026
```

Required fields:

```text
nativity_exception_type
all five tn_study_years_or_classes fields
```

Applies when:

```text
nativity_exception_type == OTHER_STATE_STUDIED_IN_TN
```

Predicate:

```text
ALL_VIII_TO_XII_IN_TN == true
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
any VIII–XII class flag == false
-> INELIGIBLE
```

Missing:

Any required class flag `null`:

```text
NEEDS_REVIEW
```

---

## ELG007 — Qualifying examination: Academic

Source:

```text
SRC002 page 2 year 2026
```

Required fields:

```text
qualifying_stream
effective_maths_mark
effective_physics_mark
effective_chemistry_mark
```

Applies when:

```text
academic_stream == true
```

Predicate:

```text
all three effective academic subject marks are non-null
```

PASS:

```text
ELIGIBLE for ELG007
```

FAIL:

No additional executable subject predicate beyond possession of Mathematics, Physics and Chemistry exists in the frozen rule text.

Missing:

Any required mark `null`:

```text
NEEDS_REVIEW
```

---

## ELG008 — Vocational stream

Source:

```text
SRC002 page 2 year 2026
```

Required fields:

```text
qualifying_stream
vocational_subject_group_code
effective_vocational_related_subject_mark
effective_vocational_theory_mark
effective_vocational_practical_mark
```

Applies when:

```text
vocational_stream == true
```

Predicate:

```text
vocational_subject_group_code IN {
  "2921","2971",
  "2922","2972",
  "2923","2973",
  "2924","2974",
  "2925","2975",
  "2926","2976"
}
AND all three effective vocational marks are non-null
```

PASS:

```text
ELIGIBLE for ELG008
```

FAIL:

```text
vocational_subject_group_code is a known non-null value
but not in the prescribed set
-> INELIGIBLE
```

Missing:

Any required value `null`:

```text
NEEDS_REVIEW
```

---

## ELG009 — General category merit calculation

Source:

```text
SRC002 page 9 year 2026
```

Required fields:

```text
effective_maths_mark
effective_physics_mark
effective_chemistry_mark
```

Applies when:

```text
academic merit cutoff is requested
```

Predicate/calculation:

```text
cutoff =
    effective_maths_mark
  + effective_physics_mark / 2
  + effective_chemistry_mark / 2
```

PASS:

```text
store calculated value in EligibilityResult.cutoff
rule outcome = ELIGIBLE
```

FAIL:

This rule does not create an eligibility failure.

Missing:

Any required effective mark `null`:

```text
cutoff = null
rule outcome = NEEDS_REVIEW
```

---

## ELG010 — Normalisation

Source:

```text
SRC002 page 9 year 2026
```

Required StudentProfile fields:

```text
none
```

Applies when:

```text
normalised cross-board merit ranking is requested
```

Executable predicate:

```text
NOT DEFINED BY FROZEN V1 EVIDENCE
```

Behavior:

```text
NEEDS_REVIEW
```

This rule MUST NOT be used for minimum eligibility.

No normalization formula may be invented.

---

## ELG011 — All India Service Tamil Nadu cadre child

Source:

```text
SRC002 page 2 year 2026
```

Required fields:

```text
nativity_exception_type
parent_self_declaration_available
```

Applies when:

```text
nativity_exception_type == ALL_INDIA_SERVICE_TN_CADRE_CHILD
```

Predicate:

```text
parent_self_declaration_available == true
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
parent_self_declaration_available == false
-> INELIGIBLE
```

Missing:

```text
parent_self_declaration_available == null
-> NEEDS_REVIEW
```

---

## ELG012 — Sri Lankan Tamil Refugee

Source:

```text
SRC002 page 2 year 2026
```

Required fields:

```text
nativity_exception_type
refugee_identification_available
required_documents_available
tn_study_years_or_classes
```

Applies when:

```text
nativity_exception_type == SRI_LANKAN_TAMIL_REFUGEE
```

Executable predicate:

```text
NOT FULLY DEFINED
```

Reason:

The frozen source says the candidate must have “studied in Tamil Nadu” but does not define the exact class range or minimum study duration.

Behavior:

```text
NEEDS_REVIEW
```

Even when identification and supporting documents are available, V1 MUST NOT invent a study-duration threshold.

---

## ELG013 — OCI/PIO Tamil Nadu native

Source:

```text
SRC002 page 2 year 2026
```

Required fields:

```text
nativity_exception_type
tamil_nadu_native
oci_pio_card_available
```

Applies when:

```text
nativity_exception_type == OCI_PIO_TN_NATIVE
```

Predicate:

```text
tamil_nadu_native == true
AND oci_pio_card_available == true
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
tamil_nadu_native == false
OR oci_pio_card_available == false
-> INELIGIBLE
```

Missing:

Any required field `null`:

```text
NEEDS_REVIEW
```

---

## ELG014 — Open Competition classification

Source:

```text
SRC002 page 2 year 2026
```

Required fields:

```text
nativity_exception_type
```

Applies when:

```text
nativity_exception_type IN {
  CENTRAL_GOVT_EMPLOYEE_CHILD,
  PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD,
  ALL_INDIA_SERVICE_TN_CADRE_CHILD,
  OTHER_STATE_STUDIED_IN_TN
}
```

Predicate:

```text
membership in the above set
```

PASS behavior:

```text
classification = Open Competition
rule outcome = ELIGIBLE
```

This classification MUST NOT create a new community value.

FAIL behavior:

For other non-null nativity types:

```text
rule is NOT_APPLICABLE
```

`NOT_APPLICABLE` is internal rule-dispatch behavior and is not an external EligibilityResult outcome.

Missing:

```text
nativity_exception_type == null
-> NEEDS_REVIEW when nativity classification is required
```

---

## ELG015 — Application document requirement

Source:

```text
SRC002 page 2 year 2026
```

Required fields depend only on the selected frozen pathway.

### TN_NATIVE_STUDIED_OUTSIDE_TN

Required:

```text
nativity_certificate_available
```

Predicate:

```text
nativity_certificate_available == true
```

### CENTRAL_GOVT_EMPLOYEE_CHILD

Required:

```text
parent_employer_certificate_available
```

Predicate:

```text
parent_employer_certificate_available == true
```

### PUBLIC_SECTOR_OR_RECOGNISED_INSTITUTION_EMPLOYEE_CHILD

Required:

```text
parent_employer_certificate_available
required_documents_available
```

Predicate:

```text
parent_employer_certificate_available == true
AND required_documents_available == true
```

### ALL_INDIA_SERVICE_TN_CADRE_CHILD

Required:

```text
parent_self_declaration_available
```

Predicate:

```text
parent_self_declaration_available == true
```

### OTHER_STATE_STUDIED_IN_TN

Required document predicate:

```text
none under ELG015
```

For each document-bearing pathway:

```text
all required fields true -> ELIGIBLE
any required field false -> INELIGIBLE
any required field null -> NEEDS_REVIEW
```

ELG015 MUST NOT invent document requirements for ELG012 or ELG013.

---

## ELG016 — Academic minimum eligibility: General

Source:

```text
SRC002 page 2 year 2026
```

Required:

```text
qualifying_stream
community
effective_maths_mark
effective_physics_mark
effective_chemistry_mark
```

Applies when:

```text
academic_stream
AND community == GENERAL
```

Predicate:

```text
ACADEMIC_AVERAGE >= 45.00
```

PASS:

```text
ELIGIBLE
```

FAIL:

```text
ACADEMIC_AVERAGE < 45.00
-> INELIGIBLE
```

Missing required input:

```text
NEEDS_REVIEW
```

---

## ELG017 — Academic minimum eligibility: BC/BCM

Source:

```text
SRC002 page 2 year 2026
```

Applies when:

```text
academic_stream
AND community IN {BC, BCM}
```

Required academic fields: same as ELG016.

Predicate:

```text
ACADEMIC_AVERAGE >= 40.00
```

PASS -> `ELIGIBLE`

FAIL below 40.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG018 — Academic minimum eligibility: MBC/DNC

Source:

```text
SRC002 page 2 year 2026
```

Applies when:

```text
academic_stream
AND community IN {MBC, DNC}
```

Predicate:

```text
ACADEMIC_AVERAGE >= 40.00
```

PASS -> `ELIGIBLE`

FAIL below 40.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG019 — Academic minimum eligibility: SC/SCA/ST

Source:

```text
SRC002 page 2 year 2026
```

Applies when:

```text
academic_stream
AND community IN {SC, SCA, ST}
```

Predicate:

```text
ACADEMIC_AVERAGE >= 40.00
```

PASS -> `ELIGIBLE`

FAIL below 40.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG020 — Vocational minimum eligibility: General

Source:

```text
SRC002 page 2 year 2026
```

Required:

```text
qualifying_stream
community
effective_vocational_related_subject_mark
effective_vocational_theory_mark
effective_vocational_practical_mark
```

Applies when:

```text
vocational_stream
AND community == GENERAL
```

Predicate:

```text
VOCATIONAL_AVERAGE >= 45.00
```

PASS -> `ELIGIBLE`

FAIL below 45.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG021 — Vocational minimum eligibility: BC/BCM

Source:

```text
SRC002 page 2 year 2026
```

Applies when:

```text
vocational_stream
AND community IN {BC, BCM}
```

Predicate:

```text
VOCATIONAL_AVERAGE >= 40.00
```

PASS -> `ELIGIBLE`

FAIL below 40.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG022 — Vocational minimum eligibility: MBC/DNC

Source:

```text
SRC002 page 2 year 2026
```

Applies when:

```text
vocational_stream
AND community IN {MBC, DNC}
```

Predicate:

```text
VOCATIONAL_AVERAGE >= 40.00
```

PASS -> `ELIGIBLE`

FAIL below 40.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG023 — Vocational minimum eligibility: SC/SCA/ST

Source:

```text
SRC002 page 2 year 2026
```

Applies when:

```text
vocational_stream
AND community IN {SC, SCA, ST}
```

Predicate:

```text
VOCATIONAL_AVERAGE >= 40.00
```

PASS -> `ELIGIBLE`

FAIL below 40.00 -> `INELIGIBLE`

Missing -> `NEEDS_REVIEW`

---

## ELG024 — Basic Mechanical Engineering group

Source:

```text
SRC002 page 2 year 2026
```

Required:

```text
qualifying_stream
vocational_subject_group_code
```

Applies when:

```text
vocational_stream
AND vocational_subject_group_code IN {"2921","2971"}
```

Predicate:

```text
vocational_subject_group_code IN {"2921","2971"}
```

PASS:

```text
ELIGIBLE prescribed vocational group
```

Other prescribed group:

```text
NOT_APPLICABLE to ELG024
```

Missing code:

```text
NEEDS_REVIEW
```

---

## ELG025 — Basic Electrical Engineering group

Source: `SRC002`, page 2, year 2026.

Applies/passes when:

```text
vocational_subject_group_code IN {"2922","2972"}
```

Other prescribed group -> internal `NOT_APPLICABLE`.

Missing -> `NEEDS_REVIEW`.

---

## ELG026 — Basic Electronics Engineering group

Source: `SRC002`, page 2, year 2026.

Applies/passes when:

```text
vocational_subject_group_code IN {"2923","2973"}
```

Other prescribed group -> internal `NOT_APPLICABLE`.

Missing -> `NEEDS_REVIEW`.

---

## ELG027 — Basic Civil Engineering group

Source: `SRC002`, page 2, year 2026.

Applies/passes when:

```text
vocational_subject_group_code IN {"2924","2974"}
```

Other prescribed group -> internal `NOT_APPLICABLE`.

Missing -> `NEEDS_REVIEW`.

---

## ELG028 — Basic Automobile Engineering group

Source: `SRC002`, page 2, year 2026.

Applies/passes when:

```text
vocational_subject_group_code IN {"2925","2975"}
```

Other prescribed group -> internal `NOT_APPLICABLE`.

Missing -> `NEEDS_REVIEW`.

---

## ELG029 — Textile Technology group

Source: `SRC002`, page 2, year 2026.

Applies/passes when:

```text
vocational_subject_group_code IN {"2926","2976"}
```

Other prescribed group -> internal `NOT_APPLICABLE`.

Missing -> `NEEDS_REVIEW`.

For vocational eligibility as a whole, a non-null code outside all ELG024–ELG029 prescribed sets is `INELIGIBLE`.

---

## ELG030 — Grade certificate handling

Source:

```text
SRC002 page 2 year 2026
```

Required:

```text
grade_certificate_used
actual_marks_available
```

Applies when:

```text
always
```

Behavior:

```text
grade_certificate_used == false
-> ELIGIBLE for ELG030; continue using supplied marks
```

```text
grade_certificate_used == true
AND actual_marks_available == true
-> ELIGIBLE for ELG030; use actual supplied marks
```

```text
grade_certificate_used == true
AND actual_marks_available == false
-> NEEDS_REVIEW
```

Reason: the rule says minimum marks corresponding to grades must otherwise be considered, but the frozen evidence contains no executable grade-to-mark conversion table.

```text
grade_certificate_used == null
OR (
  grade_certificate_used == true
  AND actual_marks_available == null
)
-> NEEDS_REVIEW
```

No grade-to-mark conversion may be invented.

---

## ELG031 — Minimum eligibility calculation

Source:

```text
SRC002 page 2 year 2026
```

Required:

```text
effective marks used by the applicable academic/vocational rule
```

Applies when:

```text
minimum eligibility is calculated
```

Predicate:

```text
compare the unrounded raw average directly with the threshold
AND do not use normalized marks
```

PASS:

```text
calculation obeys both constraints
-> ELIGIBLE for ELG031
```

Any implementation attempting rounded or normalized marks for minimum eligibility violates the contract and MUST NOT be used.

Missing effective marks:

```text
NEEDS_REVIEW
```

---

## ELG032 — Improvement marks

Source:

```text
SRC002 page 2 year 2026
```

Required:

```text
improvement_marks_used
improvement_marks_year
```

Applies when:

```text
marks are evaluated
```

Behavior:

```text
improvement_marks_used == false
-> ELIGIBLE for ELG032
-> use normal mark fields
```

```text
improvement_marks_used == true
AND improvement_marks_year < 2006
-> ELIGIBLE for ELG032
-> frozen ELG032 prohibition does not apply
```

```text
improvement_marks_used == true
AND improvement_marks_year >= 2006
AND qualifying_stream is academic
AND original_maths_mark != null
AND original_physics_mark != null
AND original_chemistry_mark != null
-> ELIGIBLE for ELG032
-> use all three original academic marks
```

```text
improvement_marks_used == true
AND improvement_marks_year >= 2006
AND qualifying_stream is vocational
AND original_vocational_related_subject_mark != null
AND original_vocational_theory_mark != null
AND original_vocational_practical_mark != null
-> ELIGIBLE for ELG032
-> use all three original vocational marks
```

If post-2005 improvement marks must be excluded and the complete required original mark set is unavailable:

```text
NEEDS_REVIEW
```

If:

```text
improvement_marks_used == null
```

or:

```text
improvement_marks_used == true
AND improvement_marks_year == null
```

then:

```text
NEEDS_REVIEW
```

No alternative reconstruction of original marks may be invented.

---

# 14. Explicit V1 NEEDS_REVIEW boundaries

The following are intentionally unresolved by V1:

```text
ELG010
```

when cross-board normalisation is required.

```text
ELG012
```

for the Sri Lankan Tamil Refugee pathway because the exact Tamil Nadu study-duration predicate is not defined.

```text
ELG030
```

when a grade certificate is used and actual marks are unavailable.

```text
ELG032
```

when post-2005 improvement marks must be excluded but the complete corresponding original mark set is unavailable.

Government-school 7.5% legal entitlement also remains `NEEDS_REVIEW` when entitlement must be established from ELG001–ELG032 alone.

---

# 15. Freeze

No additional Domain/Data V1 interpretation is permitted during implementation.

Any condition not representable by this contract MUST become:

```text
NEEDS_REVIEW
```

and MUST NOT be solved through AI inference, web research, guessed defaults, or newly invented rule logic.

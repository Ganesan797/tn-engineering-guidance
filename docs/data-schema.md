# Data dictionary

## `data/branches.csv`

| Field | Definition |
| --- | --- |
| `branch_id` | Stable normalized branch identifier, such as `CSE` or `ECE`. |
| `branch_name` | Official full branch name. |
| `normalized_name` | Consistent machine-friendly name used for matching variations. |
| `core_subjects` | Comma-separated core subject areas. |
| `career_domains` | Comma-separated related career domains. |
| `related_branches` | Comma-separated `branch_id` values for related branches. |
| `source_url` | Evidence supporting the branch description. |
| `last_verified_date` | Verification date in `YYYY-MM-DD` format. |
| `notes` | Brief factual clarification. |

## `data/colleges.csv`

| Field | Definition |
| --- | --- |
| `admission_year` | Frozen V1 admission year; must be `2026`. |
| `tnea_college_code` | Unique college counselling code used in TNEA records. |
| `college_name` | Official institution name. |
| `source_id` | Existing identifier from `sources.csv`. |
| `source_page` | Page containing the college record in the source document. |

## `data/programmes.csv`

| Field | Definition |
| --- | --- |
| `admission_year` | Frozen V1 admission year; must be `2026`. |
| `tnea_college_code` | Canonical join to `colleges.csv`. |
| `source_branch_code` | Branch code exactly as printed by the source. |
| `programme_name` | Programme name exactly as represented in the source extraction. |
| `branch_id` | Frozen canonical branch ID only for an exact non-SS match; otherwise empty. |
| `source_id` | Existing identifier from `sources.csv`. |
| `source_page` | Page containing the programme record in the source document. |

The General Academic Seat Matrix category values are not stored in this file and are not interpreted as `SANCTIONED_INTAKE`, `CURRENT_VACANCY`, or `QUOTA_VACANCY`.

## `data/cutoffs.csv`

| Field | Definition |
| --- | --- |
| `cutoff_id` | Stable unique cutoff-record identifier. |
| `programme_id` | Existing identifier from `programmes.csv`. |
| `counselling_year` | Counselling year. |
| `category` | Applicable counselling/community category. |
| `closing_cutoff` | Final known cutoff mark. |
| `source_url` | Evidence for the historical value. |
| `last_verified_date` | Verification date in `YYYY-MM-DD` format. |
| `notes` | Round, quota, or other factual context. |

## `data/sources.csv`

| Field | Definition |
| --- | --- |
| `source_id` | Stable source identifier used by rule datasets. |
| `source_name` | Page or document title. |
| `source_type` | Source classification, such as official portal or counselling document. |
| `publisher` | Publishing organisation. |
| `source_url` | Direct source URL. |
| `published_date`, `accessed_date` | Known publication date and date accessed. |
| `reliability_level` | `Primary`, `Secondary`, or `Reference`. |
| `notes` | Brief factual scope or context. |

## `data/student_profiles.csv`

| Field | Definition |
| --- | --- |
| `student_id` | Anonymous student identifier; never store a name or contact details. |
| `maths_mark`, `physics_mark`, `chemistry_mark` | Class 12 marks used for guidance. |
| `cutoff_mark` | Calculated TNEA cutoff: Maths + (Physics + Chemistry) / 2. |
| `community_category` | Relevant counselling/community category. |
| `nativity_status` | Relevant Tamil Nadu nativity or study-status category. |
| `preferred_branches`, `preferred_districts` | Comma-separated guidance preferences. |
| `budget_preference` | Student's stated affordability preference. |
| `notes` | Guidance-relevant context only. |

## `data/eligibility_rules.csv`

| Field | Definition |
| --- | --- |
| `rule_id` | Stable unique rule identifier. |
| `rule_name` | Short student-facing rule title. |
| `applicable_year` | Counselling year to which the rule applies. |
| `student_category` | `All` or the applicable student category. |
| `requirement_type` | Academic, Nativity, Age, Document, or Reservation. |
| `requirement_description` | Plain-language eligibility requirement. |
| `status` | `Active`, `Superseded`, or `Unknown`. |
| `source_id` | Existing identifier from `sources.csv`. |
| `last_verified_date` | Verification date in `YYYY-MM-DD` format. |
| `notes` | Brief factual clarification. |

## `data/reference/tnea_2026_eligibility.csv`

This is the detailed 2026 extraction of the official TNEA brochure. Every record has a rule category, source ID, source page, valid year, verification date, and notes. It is the evidence layer for future canonical entries in `eligibility_rules.csv`.

# TN Engineering Guidance Pilot — Data Model

## Files and relationships

- `data/colleges.csv`
  - One record per college.
  - Primary key: `admission_year` + `tnea_college_code`.
  - `tnea_college_code` is the canonical counselling identifier.

- `data/programmes.csv`
  - One source programme per college and source branch code.
  - Primary key: `admission_year` + `tnea_college_code` + `source_branch_code`.
  - Links to college through `tnea_college_code`.
  - Links to the branch master only when `branch_id` is an exact frozen match; unmapped source programmes remain present with an empty `branch_id`.

- `data/branches.csv`
  - One record per normalized engineering branch.
  - Primary key: `branch_id`

- `data/cutoffs.csv`
  - One historical cutoff record per programme, counselling year, and category.
  - Primary key: `cutoff_id`
  - Links to programme through `programme_id`

- `data/sources.csv`
  - One record per evidence source.
  - Primary key: `source_id`
  - Canonical source registry for all datasets.

- `data/reference/tnea_2026_eligibility.csv`
  - Detailed, year-specific extraction of official TNEA eligibility rules.
  - Links to the canonical source registry through `source_id`.

- `data/student_profiles.csv`
  - Anonymous student guidance inputs.
  - Primary key: `student_id`

- `data/eligibility_rules.csv`
  - Student-facing eligibility rules.
  - Primary key: `rule_id`
  - Links to source through `source_id`

## Required validation rules

1. Every `tnea_college_code` in `programmes.csv` must exist in `colleges.csv` for admission year 2026.

2. Every non-empty `tnea_college_code` in `colleges.csv` must be unique.

3. Every non-empty `branch_id` in `programmes.csv` must exist in `branches.csv`; empty values preserve unsupported or specialised source programmes without inference.

4. Every `programme_id` in `cutoffs.csv` must exist in `programmes.csv`.

5. Every `source_id` in `eligibility_rules.csv` must exist in `sources.csv`.

6. Every `source_id` in `reference/tnea_2026_eligibility.csv` must exist in `sources.csv`.

7. All ID fields must be unique within their own file.

8. Dates must use `YYYY-MM-DD`.

9. `cutoff_mark` in `student_profiles.csv` must equal:

   `maths_mark + (physics_mark + chemistry_mark) / 2`

10. `last_verified_date` must be completed whenever a factual record is added.

11. Do not add personal contact information or a student's name to `student_profiles.csv`.

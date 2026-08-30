# TN Engineering Guidance Pilot — Data Model

## Files and relationships

- `data/colleges.csv`
  - One record per college.
  - Primary key: `college_id`
  - `tnea_college_code` is the unique counselling code used to reconcile historical TNEA records.

- `data/programmes.csv`
  - One record per college programme/branch.
  - Primary key: `programme_id`
  - Links to college through `college_id`
  - Links to the branch master through `branch_id`.

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

1. Every `college_id` in `programmes.csv` must exist in `colleges.csv`.

2. Every non-empty `tnea_college_code` in `colleges.csv` must be unique.

3. Every `branch_id` in `programmes.csv` must exist in `branches.csv`.

4. Every `programme_id` in `cutoffs.csv` must exist in `programmes.csv`.

5. Every `source_id` in `eligibility_rules.csv` must exist in `sources.csv`.

6. Every `source_id` in `reference/tnea_2026_eligibility.csv` must exist in `sources.csv`.

7. All ID fields must be unique within their own file.

8. Dates must use `YYYY-MM-DD`.

9. `cutoff_mark` in `student_profiles.csv` must equal:

   `maths_mark + (physics_mark + chemistry_mark) / 2`

10. `last_verified_date` must be completed whenever a factual record is added.

11. Do not add personal contact information or a student's name to `student_profiles.csv`.

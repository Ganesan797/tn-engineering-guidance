# TN Engineering Guidance — Project Status

**Current milestone:** Milestone 1 — Data contracts and validation foundation

**Current task:** Pre-Slice 3 repository and 2026 source-data readiness audit

**Last reviewed:** 2026-09-01

## Completed — verified repository evidence only

- Repository skeleton exists for data, documentation, source modules, and tests.
- CSV data dictionary and relationship/validation rules are documented.
- Source registry contains four official/primary references.
- Detailed TNEA 2026 eligibility reference contains 32 sourced rules.
- Branch master contains five normalized core engineering branches.
- Empty schemas exist for colleges, programmes, cutoffs, canonical eligibility rules, and anonymous student profiles.
- Project source document and feature-specification template exist.
- Six-month V1 roadmap and this live status file are now populated for review.
- Frozen Domain/Data V1 contract artifacts have landed in `docs/domain_data_v1.md` and `docs/domain_data_v1.yaml`.
- Slice 1 implements the frozen domain models and enums, `ADMISSION_YEAR = 2026`, conservative eligibility aggregation, `AdmissionSeatFact` validation, and focused invariant tests.
- Slice 2 implements deterministic ELG001–ELG032 dispatch and execution, explainable sourced checks, missing-field reporting, cutoff calculation, explicit `NEEDS_REVIEW` boundaries, and complete rule-ID test coverage.
- Slice 2 verification passes with 30 tests and a strict TypeScript compiler check; the Slice 2 changes are complete in the working tree but are not yet committed to repository HEAD.
- Executable TypeScript domain and test infrastructure exists under `src/domain/` and `tests/domain/`, with the test command defined in `package.json`.

No recommendation logic, college or cutoff ranking, vacancy matching, AI eligibility behavior, data ingestion, or application UI have been implemented.

## Immediate next task

Commit the verified Slice 2 working tree, then acquire and register the authoritative 2026 pilot college, programme, sanctioned-intake, and vacancy sources before starting Slice 3 data work.

## Blockers

- `colleges.csv`, `programmes.csv`, `cutoffs.csv`, and canonical `eligibility_rules.csv` contain no data rows, so real recommendations cannot yet be produced.
- Slice 2 is verified but not committed; repository HEAD currently contains Slice 1 only.
- No authoritative 2026 records are present for the three pilot colleges, their programme offerings, sanctioned intake, current vacancies, or quota/category vacancies.
- Source provenance for future college, programme, intake, and vacancy facts has not yet been registered at document/page granularity.
- There is no data ingestion pipeline; current executable infrastructure covers domain validation, eligibility aggregation, and deterministic ELG001–ELG032 execution.

## Key agreed decisions

- Architecture flow: source evidence → structured data → rules → student guidance.
- Accuracy, traceability, student value, and explainability take priority over feature breadth.
- Versioned CSV files are the initial source of truth; Supabase/PostgreSQL is the planned serving layer.
- V1 guidance is deterministic and uses cutoff, community/category, and preferred branch.
- AI assists only after MVP and must never invent admission facts.
- No student name or contact information is stored in the anonymous profile dataset.
- Planned product stack: Next.js, TypeScript, Tailwind CSS, Supabase/PostgreSQL, and Vercel; implementation is not yet present.

## Next review point

After Slice 2 is committed and authoritative 2026 pilot data sources are identified, before any Slice 3 data population begins.

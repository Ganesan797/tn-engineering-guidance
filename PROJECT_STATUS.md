# TN Engineering Guidance — Project Status

**Current milestone:** Milestone 1 — Data contracts and validation foundation

**Current task:** Domain/Data Slice 1 foundation complete; awaiting review

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

No ELG rule predicates, recommendation logic, AI eligibility behavior, data ingestion, or application UI have been implemented.

## Immediate next task

Review and commit Slice 1 before authorizing implementation of the frozen ELG001–ELG032 rule-execution mapping.

## Blockers

- `colleges.csv`, `programmes.csv`, `cutoffs.csv`, and canonical `eligibility_rules.csv` contain no data rows, so real recommendations cannot yet be produced.
- There is no data ingestion pipeline or application UI; the executable implementation is limited to the Slice 1 domain foundation.
- Historical cutoff-band definitions for dream/target/safe guidance are not yet agreed or evidenced.
- `project_base.docx` is plain text with a `.docx` extension and is not a valid Word document.

## Key agreed decisions

- Architecture flow: source evidence → structured data → rules → student guidance.
- Accuracy, traceability, student value, and explainability take priority over feature breadth.
- Versioned CSV files are the initial source of truth; Supabase/PostgreSQL is the planned serving layer.
- V1 guidance is deterministic and uses cutoff, community/category, and preferred branch.
- AI assists only after MVP and must never invent admission facts.
- No student name or contact information is stored in the anonymous profile dataset.
- Planned product stack: Next.js, TypeScript, Tailwind CSS, Supabase/PostgreSQL, and Vercel; implementation is not yet present.

## Next review point

After Slice 1 review, before any eligibility rule-execution implementation begins.

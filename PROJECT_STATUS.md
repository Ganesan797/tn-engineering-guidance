# TN Engineering Guidance — Project Status

**Current milestone:** Milestone 0 — Repository and project-control baseline  
**Current task:** Repository restructuring / project-control setup  
**Last reviewed:** 2026-08-31

## Completed — verified repository evidence only

- Repository skeleton exists for data, documentation, source modules, and tests.
- CSV data dictionary and relationship/validation rules are documented.
- Source registry contains four official/primary references.
- Detailed TNEA 2026 eligibility reference contains 32 sourced rules.
- Branch master contains five normalized core engineering branches.
- Empty schemas exist for colleges, programmes, cutoffs, canonical eligibility rules, and anonymous student profiles.
- Project source document and feature-specification template exist.
- Six-month V1 roadmap and this live status file are now populated for review.

No executable implementation or automated tests are complete. Files under `src/` and `tests/` are placeholders only.

## Immediate next task

Approve the repository restructuring target and write the first implementation specification for the data-contract/validation foundation, including fixtures and acceptance tests, before changing source code.

## Blockers

- `colleges.csv`, `programmes.csv`, `cutoffs.csv`, and canonical `eligibility_rules.csv` contain no data rows, so real recommendations cannot yet be produced.
- There is no application/toolchain configuration, executable source, validation pipeline, or test suite.
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

After the repository restructuring proposal and validation feature specification are ready, and before implementation begins.

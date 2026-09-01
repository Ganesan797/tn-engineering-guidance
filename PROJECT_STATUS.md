# TN Engineering Guidance — Project Status

**Current milestone:** Milestone 1 — Data contracts and validation foundation

**Current task:** Slice 8 minimal student-facing responsive guidance UI implemented and verified

**Last reviewed:** 2026-09-01

**Slice 3 commit:** `fade04d`

**Slice 4 commit:** `3601481`

**Slice 5 commit:** `a806ec3`

**Slice 6 commit:** `2cecdfa`

**Slice 7 commit:** `da4b29e` (pushed to `origin/main`)

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
- Slice 2 verification passes with 30 tests and a strict TypeScript compiler check and is committed to repository HEAD.
- Executable TypeScript domain and test infrastructure exists under `src/domain/` and `tests/domain/`, with the test command defined in `package.json`.
- Slice 3 adds validated 2026 pilot college/programme ingestion and append-only, round/stage-aware `AdmissionSeatFact` snapshot storage with provenance and duplicate/conflict detection.
- Synthetic Slice 3 fixtures prove all three seat fact types and future vacancy snapshot ingestion without representing test records as real TNEA facts.
- Authoritative 2026 programme evidence is persisted for CEG, MIT, GCT, PSG Tech, and CIT: 79 source programme rows, including 18 exact canonical mappings and 61 preserved unmapped rows.
- General Academic Seat Matrix category values are not represented as `AdmissionSeatFact` and are not treated as intake or vacancy facts.
- The combined domain and ingestion suite passes 51 tests; strict TypeScript checking passes for the executable `src/` tree.
- Slice 4 composes eligibility-first evaluation, the 18 supported canonical pilot programmes, explicit snapshot selection, non-inferred vacancy evidence, and per-candidate provenance/reason trails.
- `INELIGIBLE` returns no normal candidates; `NEEDS_REVIEW` remains visible on provisional candidates; all 61 unmapped programmes remain excluded.
- The combined domain, ingestion, and recommendation suite passes 60 tests; strict TypeScript checking passes for the executable `src/` tree.
- Slice 5 adds explicit branch-preference ordering with neutral missing/unlisted preferences and a disclosed canonical identifier tie-breaker.
- Location/region and institution-type ordering remain unsupported because those fields are not present as authoritative sourced college data.
- The full suite passes 67 tests; strict TypeScript checking passes for the executable `src/` tree.
- Slice 6 adds one application-level `GuidanceRequest` → `GuidanceResult` interface that delegates to the existing eligibility, canonical candidate, snapshot evidence, and branch-ordering modules.
- Final guidance preserves eligibility checks, cutoff, blocking fields, ordered canonical choices, vacancy state, seat facts, reason codes, and aggregate provenance without duplicating domain logic.
- The full suite passes 76 tests; strict TypeScript checking passes for the executable `src/` tree.
- Slice 7 adds a framework-free JSON request/response adapter with frozen profile/enum validation, explicit counselling snapshot validation, structured safe errors, and direct delegation to the Slice 6 guidance service.
- `ELIGIBLE`, `INELIGIBLE`, and `NEEDS_REVIEW` remain successful responses; null and false remain distinct across the external boundary.
- The full suite passes 88 tests; strict TypeScript checking passes for the executable `src/` tree.
- Slice 8 adds a framework-free responsive, accessible student form, explicit nullable controls, Slice 7 submission binding, and explainable result/error rendering.
- The UI preserves API choice order, eligibility states, blocking fields, vacancy evidence semantics, seat facts, reason codes, and provenance without frontend domain logic.
- The full suite passes 99 tests; strict TypeScript checking passes for the executable `src/` tree.

No prestige/quality score, cutoff probability, historical prediction, hidden weighting, location/institution ordering, AI recommendation, broad TNEA coverage, or application UI have been implemented.

## Immediate next task

Commit Slice 8, then choose a minimal build/hosting adapter or ingest the first authoritative seat snapshot without changing the UI/API/domain contracts.

## Blockers

- `cutoffs.csv` and canonical `eligibility_rules.csv` contain no data rows, so real recommendations cannot yet be produced.
- No authoritative 2026 `SANCTIONED_INTAKE`, `CURRENT_VACANCY`, or `QUOTA_VACANCY` records are persisted for the five pilot colleges.
- Source provenance for future intake and vacancy facts has not yet been registered at document/page granularity.

## Key agreed decisions

- Architecture flow: source evidence → structured data → rules → student guidance.
- Accuracy, traceability, student value, and explainability take priority over feature breadth.
- Versioned CSV files are the initial source of truth; Supabase/PostgreSQL is the planned serving layer.
- V1 guidance is deterministic and uses cutoff, community/category, and preferred branch.
- AI assists only after MVP and must never invent admission facts.
- No student name or contact information is stored in the anonymous profile dataset.
- Planned product stack: Next.js, TypeScript, Tailwind CSS, Supabase/PostgreSQL, and Vercel; implementation is not yet present.

## Next review point

Before the next product-facing slice or the first real `AdmissionSeatFact` snapshot is persisted.

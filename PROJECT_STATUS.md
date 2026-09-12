# TN Engineering Guidance — Project Status

**Current milestone:** M1 — Awareness-First Entry + Direct Entry (accepted)

**Current task:** M1 acceptance closeout; M2 remains unauthorized

**Last reviewed:** 2026-09-12

## Product Review Gate

`PRODUCT_REVIEW_GATE = ACTIVE`

`ENGINEERING_REFERENCE_MVP_V0 = COMPLETE`

**Current state:** The deterministic MVP engine, API, pilot data flow, and minimal UI are working. The first student-facing run exposed a product-experience gap: the current UI reflects backend/domain contracts more than the student's mental model and original guidance mission.

**Decision:** M0 and M1 are accepted. M2 and later milestones remain unauthorized.

**Next priority:** Review and explicitly authorize M2 before any M2 implementation begins.

`CODEX_FEATURE_WORK = PAUSED_PENDING_M2_REVIEW_AND_AUTHORIZATION`

**Mission review:** Golden Product Mission V1 is frozen. Mission clarity, Booklet-First alignment, zero-knowledge alignment, native-language and reach direction, personalization, Think-Further direction, trusted-engine boundaries, and the mission review gate passed review. Major student-facing milestones now require `TECHNICAL_DOD = PASS`, `MISSION_ALIGNMENT = PASS`, and `STUDENT_SCENARIO_REVIEW = PASS`.

`STUDENT_JOURNEY_V1 = FROZEN_V1`

`STUDENT_INPUT_OUTPUT_V1 = LOCKED_V1`

`IMPLEMENTATION_AUTHORIZED = M1_ONLY_COMPLETE`

### Accepted M0 baseline

`M0_IMPLEMENTATION_AUTHORIZED = YES`

`M0_IMPLEMENTATION = COMPLETE`

`CODEX_TECHNICAL_DOD = PASS`

`OWNER_ENGINEERING_REVIEW = PASS`

`OWNER_STUDENT_REVIEW = PASS`

`MISSION_ALIGNMENT_DOD = PASS`

`RELEVANT_SCENARIO_REVIEW = PASS`

`DOMAIN_ASSUMPTIONS_MADE = NONE`

`M0_ACCEPTED = YES`

`M1_IMPLEMENTATION_AUTHORIZED = YES`

`M2_IMPLEMENTATION_AUTHORIZED = NO`

`PAPER_SCENARIO_REVIEW = PASS`

`SCENARIO_A_ZERO_KNOWLEDGE = PASS`

`SCENARIO_B_CUTOFF_DIRECT_ENTRY = PASS`

`SCENARIO_C_COUNSELLING_DIRECT_ENTRY = PASS`

`STUDENT_INPUT_OUTPUT_REVIEW = PASS`

`TECHNICAL_GAP_MAPPING = APPROVED_V1`

`TECHNICAL_GAP_MAPPING_REVIEW = PASS`

`MISSION_OVER_REUSE_PRINCIPLE = ACTIVE`

`IMPLEMENTATION_PLAN_V1 = FROZEN_V1`

`IMPLEMENTATION_PLAN_V1_REVIEW = PASS`

`PRIMARY_STUDENT_LANGUAGE = TAMIL`

`SECONDARY_STUDENT_LANGUAGE = ENGLISH`

`BILINGUAL_SUPPORT = YES`

**Implementation Plan V1 remains frozen. M1 has passed final owner acceptance; M2 remains unauthorized.**

**Slice 3 commit:** `fade04d`

**Slice 4 commit:** `3601481`

**Slice 5 commit:** `a806ec3`

**Slice 6 commit:** `2cecdfa`

**Slice 7 commit:** `da4b29e` (pushed to `origin/main`)

**Slice 8 commit:** `7106a90`

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
- Slice 9 adds a minimal local server, persisted pilot-data runtime loader, four reproducible student scenarios, and end-to-end smoke coverage through ingestion, API, guidance, and UI.
- The local runtime verifies 5 colleges, 79 source programmes, 18 canonical mappings, and 61 preserved unmapped programmes; its empty programme-evidence snapshot leaves all unpublished vacancy facts unknown.
- The complete suite passes 106 tests; the documented strict TypeScript check passes, and the local MVP command serves the student page successfully.
- M0 implementation adds a language-neutral student-semantic model, a separate English presentation catalogue, structured informational content, and a minimal student-facing proof without changing the trusted domain or API contracts.
- M0 verification passes 115 tests and strict TypeScript checking. Technical DoD, owner engineering review, owner student review, relevant scenario review, and mission-alignment DoD all pass; M0 is accepted.

No prestige/quality score, admission probability, historical prediction, hidden weighting, location/institution ordering, AI recommendation, or broad TNEA coverage has been implemented.

## Immediate next task

Review and explicitly authorize M2 before implementation. Do not begin M2.

## M1 implementation review

`M1_IMPLEMENTATION_STATUS = COMPLETE`

`M1_CODEX_TECHNICAL_DOD = PASS`

`M1_OWNER_ENGINEERING_REVIEW = PASS`

`M1_OWNER_STUDENT_REVIEW = PASS`

`M1_MISSION_ALIGNMENT_DOD = PASS`

`M1_RELEVANT_SCENARIO_REVIEW = PASS`

`TAMIL_M1_ENTRY_REVIEW = PASS`

`M1_DOMAIN_ASSUMPTIONS_MADE = NONE`

`M1_ACCEPTED = YES`

`M1_SOURCE_POLICY = MINIMUM_REVIEWED_CONTENT_ONLY`

- Default entry offers awareness and three intent routes; no student profile or eligibility evaluation is required for orientation.
- Personal guidance opens the existing English reference form intentionally, with null personal values and neutral branch preferences. Demo student presets remain only under `/demo`.
- Counselling entry states the current limitation and provides working introduction/personal-guidance directions.
- Tamil and English entry use identical route/content semantics. Approved Tamil Student Copy V1 refines Tamil presentation only; frozen English and provenance are unchanged. The integrated M1 experience has passed final owner acceptance. No complete bilingual personal-guidance claim is made.
- M1-C uses only the frozen M1-B awareness pack for entry awareness, with manifest identities and source provenance preserved. No new unsourced TNEA facts were introduced; full D0/D1 completion is not claimed.
- Full suite after the Tamil copy update: 127 tests passed. Reproducible strict checking passed via `npm run typecheck` using the locally installed pinned TypeScript dependency. No dependency or toolchain configuration was changed.
- Local server and browser proof verified entry navigation, intentional blank-form access, language switching, and mobile-width presentation. Automated HTTP smoke coverage proves blank/explicit-input submissions through the existing API and deterministic result/provenance preservation.

### M1-C integration checkpoint

`M1_TAMIL_STUDENT_LANGUAGE_REVIEW = PASS`

`TAMIL_STUDENT_COPY = APPROVED_V1`

- All ten approved Tamil presentation updates are integrated, including takeaways. AW-08's 7.5% reference is verified in existing source SRC002, printed page 4, section 4.1; source relationships are unchanged. The original frozen pack remains the factual authority. M1 has passed final owner acceptance.

`M1_A_HUMAN_ROUTING_REVIEW = PASS`

`M1_B_AWARENESS_CONTENT_PACK = FROZEN_V1`

`M1_B_COMMIT = 8ab1f3e`

`AWARENESS_CONTENT_REVIEW = PASS`

`M1_C_IMPLEMENTATION_AUTHORIZED = YES`

`M1_C_IMPLEMENTATION_STATUS = COMPLETE`

- All ten awareness modules load directly from the frozen document/manifest and source registry; no frozen pack or source data edits were made.
- Five presentation sections provide optional deeper explanations and evidence. Important scope and uncertainty caveats remain visible; internal AW/SRC identifiers are not student-facing labels.
- Tamil-capable system font stack, 17–18px body text, 1.7 line height, a 752px desktop column, and full-card accessible entry links are implemented.
- Governance notices are isolated behind explicit review mode. Normal student entry does not display internal project review messages.
- Desktop (1100px) and mobile (390px) browser checks cover bilingual awareness, disclosure, named source evidence, and unchanged route transitions. Integrated Tamil/student review passed.
- M1-A/M1-C application work is accepted and ready for closeout. M2 remains unauthorized.

## Accepted M0 observations — non-blocking

- The existing MVP-v0 form remains backend-shaped and overwhelming. Target: M1/M2.
- The Level-2/Level-3 explanation hierarchy can be improved further during Personal Guidance Presentation. Target: M3.
- Exact reviewed Tamil presentation is not part of M0. Representative Tamil validation remains required by M3.

## Blockers

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

M2 scope review and explicit implementation authorization.

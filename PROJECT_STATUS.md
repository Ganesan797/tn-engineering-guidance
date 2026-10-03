# TN Engineering Guidance — Project Status

**Current milestone:** M2 — Progressive Student Input (one bounded journey implemented; acceptance pending)

**Current task:** Review the implemented single Tamil journey against the [bounded M2 authorization](docs/planning/m2_one_journey_authorization_decision_2026-10-03.md); M2 milestone acceptance and student validation remain pending

**Last reviewed:** 2026-10-03

**Documentation navigation (2026-10-02):** Documents are grouped by product, planning, architecture, content, experiments and templates. Start with the [documentation guide](docs/README.md); awareness and admission folders keep answers, evidence and reviews together. Original conversation records remain preserved. Relocation and reference checks passed, and the existing automated suite passed 199 tests after updating document-loading paths. This organization change does not change content approval or implementation authorization.

## Product Review Gate

`PRODUCT_REVIEW_GATE = ACTIVE`

`ENGINEERING_REFERENCE_MVP_V0 = COMPLETE`

**Current state:** The deterministic MVP engine, API, pilot data flow, and minimal UI are working. The first student-facing run exposed a product-experience gap: the current UI reflects backend/domain contracts more than the student's mental model and original guidance mission.

**Decision:** M0 and M1 are accepted. Ganesan authorized **one bounded M2 student journey** on 2026-10-03. M2 is not implemented or accepted; later milestones remain unauthorized.

**Next priority:** Review the [question-to-domain map](docs/planning/m2_one_journey_question_domain_map_v1.md) and the implemented one-journey flow, then obtain the remaining factual release, volunteer Tamil, actual student and frozen M2 completion reviews. Gemini execution, production RAG, Track B and later milestones remain unauthorized.

**A01–A07 research revision (2026-10-02):** The updated [question-level review and paper walkthrough](docs/content/awareness/student_pov_awareness_coverage_review_v1.md) records **31 ANSWERED, 0 PARTIAL, 0 DEFERRED**, improved from **7/15/9**. `ANSWERED` measures direct response completeness only. The [evidence note](docs/content/awareness/student_pov_awareness_evidence_v2.md) scopes curriculum, post-Class-12, historical-cutoff and occupation claims. Final factual approval, volunteer Tamil approval and actual student validation remain pending. The revised paper walkthrough passes the awareness portion of the 5–10-minute progression goal; it does not validate the full seven-stage journey.

**Owner decision (2026-10-02):** Ganesan found A01–A07 V2 answers satisfactory and accepted the revised content direction. The [dated decision](docs/content/awareness/student_pov_awareness_review_decision_v1.md) records this separately from pending volunteer Tamil-equivalence review, actual student validation and final factual release approval. Recorded source limitations remain unchanged.

**INT-05–INT-08 content preparation (2026-10-02):** Four saved intents, **39 unique assigned questions**, eight consolidated units: admission routes, management quota, diploma entry, TNEA process, documents, minimum eligibility/boards, special histories, and cutoff/rank. [Question-level coverage and paper review](docs/content/admission/student_pov_admission_coverage_int05_int08_v1.md) records **39 ANSWERED, 0 PARTIAL, 0 DEFERRED** for response completeness only. Exact corpus wording and cross-intent connections are retained. The [evidence note](docs/content/admission/student_pov_admission_evidence_int05_int08_v1.md) dates admission rules to 2026; 2027 rules are not verified. It flags conflicting grievance windows, institution-specific management terms and individual-case uncertainty. Ganesan [accepted the B01–B08 answers](docs/content/admission/student_pov_admission_owner_review_decision_v1.md) on 2026-10-03. Final factual release approval, Tamil review and actual student validation remain pending. This is content research/documentation, not implementation or live validation.

**M2 readiness proposal (2026-10-03):** The [one-journey proposal](docs/planning/m2_one_journey_readiness_proposal_v1.md) maps zero-knowledge TNEA orientation to optional, progressive personal input and a deterministic result or explicit unknown. Its earlier `NOT_AUTHORIZED` state was superseded for this bounded scope by the [later owner decision](docs/planning/m2_one_journey_authorization_decision_2026-10-03.md). The proposal remains a paper design; no implementation or live request occurred in this documentation task.

**Bounded M2 implementation (2026-10-03):** A local mobile-first Tamil path at `/journey` starts with approved M1 awareness without marks, explains the 2026 first-year TNEA route, offers a preparation page using reviewed B05 with its draft-language notice, and provides an optional direct-entry personal cutoff check. The [question-to-domain map](docs/planning/m2_one_journey_question_domain_map_v1.md) ties each question to the reviewed content, source and existing `StudentProfile`/ELG009/ELG032 fields. The flow asks one question at a time, retains submitted answers in a bounded form state, preserves “I don't know” as null for the engine, and uses the existing guidance service. A supported cutoff is shown separately from broader eligibility, which may remain `NEEDS_REVIEW`. Other/unknown admission years and unsupported streams produce no personal calculation. No student data is persisted by this path. Focused offline tests **7/7**, full offline suite **206/206**, and strict TypeScript typecheck passed. This is implementation evidence only: M2 completion, factual release approval, volunteer Tamil equivalence, actual student validation and the Live LLM Gate remain pending. No Gemini request was made.

**Research outcome:** V2 preserves supplied entities, completes Q049's four-way comparison, separates curriculum from historical cutoff evidence, adds scoped branch/career explanations, and connects awareness to “How do I enter engineering?”. Q021 correctly remains non-numeric without the required college/year/route/round/category/quota/programme context. The original A01–A07 batch, intent map and raw corpus remain unchanged. No application tests or live requests were run.

`CODEX_FEATURE_WORK = M2_ONE_JOURNEY_IMPLEMENTED_PENDING_REVIEW`

**Mission review:** Golden Product Mission V1 is frozen. Mission clarity, Booklet-First alignment, zero-knowledge alignment, native-language and reach direction, personalization, Think-Further direction, trusted-engine boundaries, and the mission review gate passed review. Major student-facing milestones now require `TECHNICAL_DOD = PASS`, `MISSION_ALIGNMENT = PASS`, and `STUDENT_SCENARIO_REVIEW = PASS`.

`STUDENT_JOURNEY_V1 = FROZEN_V1`

`STUDENT_INPUT_OUTPUT_V1 = LOCKED_V1`

`IMPLEMENTATION_AUTHORIZED = M2_ONE_JOURNEY_ONLY`

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

`M2_IMPLEMENTATION_AUTHORIZED = YES_BOUNDED_ONE_JOURNEY`

### M0 AI/RAG architecture checkpoint

`M0_STATUS = ACCEPTED`

`M1_STATUS = ACCEPTED`

`M0_AI_RAG_ARCHITECTURE_REVIEW = COMPLETE`

`M0_AI_RAG_ARCHITECTURE_ADDENDUM = FROZEN_V1`

`M0_IMPLEMENTATION_REOPENED = NO`

`M1_IMPLEMENTATION_REOPENED = NO`

`PROJECT_RESTART = NO`

`DOMAIN_REWRITE = NO`

`API_REWRITE = NO`

`MILESTONE_SEQUENCE_CHANGED = NO`

`TARGET_ARCHITECTURE = CONVERSATIONAL_LLM + CONTROLLED_RAG + DETERMINISTIC_ENGINE + STRUCTURED_DATA`

`DETERMINISTIC_ADMISSION_AUTHORITY = PRESERVED`

`NEXT_ACTIVITY = BOUNDED_M2_JOURNEY_REVIEW_AND_STUDENT_VALIDATION`

`M2_STATUS = BOUNDED_ONE_JOURNEY_IMPLEMENTED_PENDING_ACCEPTANCE`

`PRODUCTION_RAG_IMPLEMENTATION_AUTHORIZED = NO`

`TRACK_A_PASS_1 = ACCEPTED_AS_PARTIAL`

`TRACK_A_PASS_2 = ACCEPTED`

`REAL_CORPUS_VALIDATION = COMPLETE`

`LLM_INTEGRATION_GATE = PARTIAL`

`LLM_INTEGRATION_AUTHORIZED = NO`

`PRE_LLM_PRODUCT_DIFFERENTIATION_REVIEW = COMPLETE`

`PRE_LLM_PRODUCT_DIFFERENTIATION_REVIEW_STATUS = OWNER_APPROVED_V1`

`PRODUCT_DIFFERENTIATION = VALID`

`LIVE_LLM_GATE = PARTIAL`

`LIVE_LLM_GATE_REQUIRED_DIMENSIONS = [GROUNDED_INTELLIGENCE, GUIDANCE_INTELLIGENCE]`

`M2_IMPACT = MINOR_FORWARD_CLARIFICATION_ONLY`

`REACH_PRODUCT_CONCERN = RECORDED`

`REACH_IMPLEMENTATION = LATER`

`ARCHITECTURE_ADDENDUM = FROZEN_V1`

`TRACK_B = NOT_STARTED_NOT_AUTHORIZED`

`LIVE_LLM_EXPERIMENT_IMPLEMENTATION = HARNESS_COMPLETE_G01_TO_G05_PARTIALLY_EXECUTED`

`LIVE_LLM_GATE_IMPLEMENTATION = PARTIAL`

`LIVE_LLM_SMOKE_RUNNER = MERGED_READY_FOR_SEPARATE_OWNER_AUTHORIZATION`

`LIVE_LLM_SMOKE_RUNNER_APPROVED_COMMIT = fdd36e34f63c85c9d94af9bd932f40881a18a7a5`

`LIVE_LLM_SMOKE_SCENARIOS = [G01, G05, J01-T1]`

`LIVE_LLM_SMOKE_MAX_REQUESTS = 3`

`LIVE_LLM_SMOKE_COST_CEILING = ADVISORY_USD_0_02`

`LIVE_LLM_SMOKE_STRICT_BUDGET = FAIL_CLOSED_ZERO_REQUESTS`

`GEMINI_HTTP_DIAGNOSTICS = MERGED`

`G01_DIAGNOSTIC_MODE = IMPLEMENTED_REVIEWED_MERGED`

`G01_DIAGNOSTIC_MODE_MAIN_COMMIT = 094f9e509d3a630deac30e7a847b75b9e1871c2a`

`GEMINI_ADAPTER_TECHNICAL_REVIEW = PASS`

`GEMINI_ADAPTER_APPROVED_SOURCE_COMMIT = 01b8ee1021ec41ccdff66d956a5e18b5813c5a1e`

`GEMINI_ADAPTER_MERGED_TO_MAIN = YES`

`GEMINI_ADAPTER_MAIN_MERGE_RESULT = 01b8ee1021ec41ccdff66d956a5e18b5813c5a1e`

`GEMINI_ADAPTER_REVIEW_TESTS = 173_PASSED`

`LIVE_LLM_GATE_OWNER_REVIEW = G01_PRIOR_STATUS_G02_TO_G05_REVIEWED_REMAINING_SCENARIOS_PENDING`

`LIVE_MODEL_EVALUATION = PARTIAL_G01_TO_G05`

`MODEL_MIGRATION = COMPLETE`

`STRUCTURED_JSON_COMPATIBILITY = G02_TO_G04_CONTRACT_VALID_G05_OUTPUT_VALIDATION_FAILURE`

`FULL_G01_EXECUTION = COMPLETE`

`FULL_G01_EVALUATION = PENDING_OWNER_DECISION`

`TAMIL_ENGLISH_EXPLANATION_QUALITY = MANUAL_REVIEW_REQUIRED`

`LIVE_OUTPUT_PROVENANCE_COMPLIANCE = EXPLICIT_EVIDENCE_PENDING`

`REMAINING_APPROVED_LIVE_LLM_SCENARIOS = G06_G07_G08_J01_T1_J02_T1_J03_T1_J04_T1_J05_EN_T1_J05_TA_T1_UNEXECUTED`

`GROUNDED_INTELLIGENCE = PARTIAL_MECHANICAL_PASS_DOES_NOT_ESTABLISH_GUIDANCE_QUALITY`

`GUIDANCE_INTELLIGENCE = PARTIAL_G03_GUIDANCE_QUALITY_FAIL`

`LIVE_LLM_RUNTIME = GEMINI_3_6_FLASH_G01_TO_G05_PARTIAL_EXECUTION`

`FURTHER_GEMINI_EXECUTION = PAUSED`

`RETRY_RESUME_SHARED_EVIDENCE_INFRASTRUCTURE = SUFFICIENT_CLOSED_FOR_CURRENT_STAGE`

`GUIDANCE_DELIVERY_RESPONSIBILITY_MODEL = ACCEPTED`

`LLM_IN_ADMISSION_DECISION_PATH = NO`

`OTHER_COURSE_IMPLEMENTATION = DEFERRED`

### Checkpoint 1 — Live LLM status synchronization

**Repository evidence:** M0 and M1 are accepted; MVP Slices 1–9 are complete; Track A retrieval Pass 2 is accepted. The sanitized Gemini HTTP diagnostic implementation and bounded `DIAGNOSTIC` mode are merged. Repository commit `094f9e509d3a630deac30e7a847b75b9e1871c2a` enforces G01 only, one request, Gemini 2.5 Flash, a 30-second timeout, and the existing USD 0.02 advisory ceiling.

**Owner-reported provider evidence:** The original HTTP 404 was diagnosed as `gemini-2.5-flash` being unavailable to new users for the current API project. The owner verified `gemini-3.6-flash` through the Gemini model-listing API, which reported `generateContent` support, and received `OK` from a minimal generation request through the existing `v1beta` endpoint. This establishes basic endpoint/model availability only; it is not a successful full G01 scenario evaluation.

**Checkpoint 1 outcome:** The bounded migration to `gemini-3.6-flash` was subsequently implemented, validated offline, reviewed, and merged at repository commit `a77652d97e049a1626df95d01385415221872413`. The existing `v1beta` `generateContent` endpoint and runner contracts were preserved. Offline validation did not establish live structured JSON compatibility.

### Checkpoint 3 — Controlled G01 execution status

**Evidence basis:** The following live-run results are recorded from the supplied execution handoff. Repository evidence confirms that the approved Gemini model migration is present at the current main commit. This status update does not include a raw provider response, live artifact, or credential and does not independently upgrade evidence marked for manual review or explicit confirmation.

| Result | Recorded value |
| --- | --- |
| Provider / model | `GEMINI` / `gemini-3.6-flash` |
| Scenario | `G01` — What is TNEA? |
| Attempted requests | `1` |
| Automatic retries | `false` |
| Run failure | `null` |
| Grounding | `PASS` |
| Routing | `PASS` |
| Guidance | `MANUAL_REVIEW_REQUIRED` |
| Language | `MANUAL_REVIEW_REQUIRED` |
| Security | `NOT_RUN` |
| Uncertainty | `NOT_RUN` |
| Unsupported claims detected | `NONE` |
| Telemetry | `COMPLETE` |
| Latency | `8.56 seconds` |
| Estimated cost | `USD 0.00516225` |
| Schema validation | `EXPLICIT_EVIDENCE_PENDING` |
| Final G01 acceptance | `PENDING_OWNER_DECISION` |

**Quality finding:** The response should explicitly clarify that TNEA does not cover every engineering admission route. This finding remains part of the owner review; G01 is not fully accepted.

### Owner-reviewed G02–G05 experiment record

The owner-reviewed outcomes below are recorded in the append-only [Live LLM Integration Gate Results V2](docs/experiments/live_llm_integration_gate_results_v2.md). They supplement, and do not rewrite, the historical V1 record.

| Scenario | Owner-reviewed outcome | Evidence and limitation |
| --- | --- | --- |
| G02 | `PASS` with a minor quality finding | A live response completed and passed mechanical grounding/routing checks. This scenario result does not complete the overall gate. |
| G03 | `GUIDANCE_QUALITY_FAIL` | The student asked for CSE versus IT in CEG, but the response discussed CSE versus ECE despite mechanical grounding/routing `PASS`. Attempt 1 received HTTP 503 `UNAVAILABLE`; the bounded permitted retry succeeded on attempt 2. |
| G04 | `PASS` | A live response completed and passed the reviewed scenario outcome. This scenario result does not complete the overall gate. |
| G05 | `FAIL — OUTPUT_VALIDATION_ERROR` | The provider returned a response, but it failed the required structured-output contract. No conclusion about the deterministic cutoff formula follows from this failure. |

G03 demonstrates that grounded content and a nominally correct route do not establish that an answer satisfies the student's actual question. The existing manual guidance-quality review must explicitly check **question/entity fidelity**. This is a bounded rubric refinement, not authorization for a semantic-matching subsystem.

G05 remains primarily a deterministic-responsibility scenario. A later domain review should determine whether a simple cutoff-calculation request is unnecessarily coupled to broader eligibility inputs. That question is recorded but unresolved.

G01 retains its previously recorded evidence and findings. G06–G08 and J01-T1–J05-TA-T1 remain unexecuted. The Live LLM Gate remains `PARTIAL`; further Gemini execution is `PAUSED`. The later 2026-10-03 decision authorizes only a deterministic/canonical M2 journey and does not change these experiment outcomes.

### Guidance Delivery Responsibility Model

The accepted [Guidance Delivery Responsibility Model](docs/product/guidance_delivery_responsibility_model_v1.md) distinguishes three primary product responsibilities:

1. **Structured/authoritative guidance:** governed facts plus deterministic calculations, validation, filtering, and selection. Verified facts derive authority from governed sources; they are not all described as deterministic.
2. **Canonical reviewed guidance:** frequent student questions maintained as reviewed, student-friendly Tamil/English guidance with source, review, and version governance, normally deliverable without an LLM call.
3. **AI-assisted guidance:** novel, ambiguous, comparative, personalized, or conversational questions where controlled retrieval, synthesis, or explanation adds genuine value. The LLM cannot override structured or authoritative results.

This responsibility model is an evidence-driven delivery refinement. It does not replace the frozen Three-Layer Factual Model, deterministic authority, Golden Product Mission, Student Journey, or scenario definitions. Scenario responsibility labels are analytical metadata only.

The planned approximately 100-question dataset is a progressive product-discovery and evaluation activity, not an MVP prerequisite. Student discussions may provide authentic questions and misconceptions, but never admission authority. Personally identifying information must be removed, and admission-critical answers must be verified independently against governed authoritative sources.

For future AI turns, prefer a compact relevant context containing the student-profile summary, applicable structured/deterministic result, relevant retrieved evidence, and recent relevant exchanges. This is a future guideline, not a current implementation requirement; it must preserve necessary continuity and data minimization.

### Frozen-plan milestone reconciliation

**Checks already passed:** The bounded model migration and its offline validation are merged. For the supplied G01 execution, routing and grounding passed, no unsupported admission-critical claims were detected, the run completed without a reported failure or retry, and telemetry is complete. These results satisfy the recorded portions of G1 but do not complete the milestone gate.

**Checks requiring manual review:** G01 retains its recorded review status. G03 failed guidance quality because it did not preserve the requested comparison entities. Tamil/English language quality and the remaining applicable owner engineering, owner student, and relevant-scenario reviews remain pending.

**Checks not executed:** G06–G08 and J01-T1–J05-TA-T1 remain unexecuted. Security, uncertainty, unknown-input preservation in the applicable live scenario, and broader bilingual-equivalence review remain pending.

**Checks requiring additional evidence:** The remaining live scenarios and their required manual reviews still need evidence before a final gate decision. Mechanical grounding/routing results do not independently establish student-intent satisfaction. G05 requires a future valid structured response before its remaining live criteria can be evaluated.

**Remaining sequence:**

1. Documentation alignment for the accepted experiment learning and responsibility model is committed at `33a264a19daa866aa30fa49e733be089af59025d` and pushed.
2. Ganesan authorized the bounded deterministic/canonical M2 path on 2026-10-03. The [question-to-domain map](docs/planning/m2_one_journey_question_domain_map_v1.md) and one local mobile-first Tamil journey are implemented for review. B01–B08 answers and A01–A07 V2 direction are owner-accepted; source limitations, final factual approval, volunteer Tamil review and actual student validation remain separate pending work.
3. Keep further Gemini execution paused unless separately authorized.
4. If resumed later, evaluate the remaining frozen scenarios without changing their contracts.
5. Complete the Live LLM Gate and make a separate evidence-based decision before any production LLM or AI-assisted guidance; the bounded M2 authorization does not close that gate.

**Live LLM acceptance criteria:**

- **G1:** Zero unsupported admission-critical claims.
- **G2:** Useful progression for a zero-knowledge student.
- **G3:** Unknown deterministic inputs remain unknown.

### Pre-M2 Track A specification checkpoint

`PRE_M2_TRACK_A_SPEC = FROZEN_V1`

`TRACK_A_SOURCE_MANIFEST = FROZEN_V1`

`TRACK_A_TEST_MATRIX = FROZEN_V1`

`TRACK_A_EXPERIMENT_IMPLEMENTATION = COMPLETE`

`TRACK_A_EXPERIMENT_AUTHORIZED = YES`

`TRACK_A_EXPERIMENT_OWNER_REVIEW = PASS`

`TRACK_B = NOT_STARTED_NOT_AUTHORIZED`

`M2_AUTHORIZED = YES_BOUNDED_ONE_JOURNEY`

`PRODUCTION_RAG = NOT_AUTHORIZED`

`NEXT_GATE = BOUNDED_M2_TECHNICAL_MISSION_OWNER_AND_STUDENT_REVIEW`

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

**Implementation Plan V1 remains frozen. M1 has passed final owner acceptance; the one-journey M2 scope is implemented locally but has not passed milestone acceptance.**

**Slice 3 commit:** `fade04d`

**Slice 4 commit:** `3601481`

**Slice 5 commit:** `a806ec3`

**Slice 6 commit:** `2cecdfa`

**Slice 7 commit:** `da4b29e` (pushed to `origin/main`)

**Slice 8 commit:** `7106a90`

## Completed — verified repository evidence only

- Repository skeleton exists for data, documentation, source modules, and tests.
- CSV data dictionary and relationship/validation rules are documented.
- Source registry currently contains eight references (`SRC001`–`SRC008`); their allowed uses and limitations remain source-specific.
- Detailed TNEA 2026 eligibility reference contains 32 sourced rules.
- Branch master contains five normalized core engineering branches.
- Empty schemas exist for colleges, programmes, cutoffs, canonical eligibility rules, and anonymous student profiles.
- Project source document and feature-specification template exist.
- Six-month V1 roadmap and this live status file are now populated for review.
- Frozen Domain/Data V1 contract artifacts have landed in `docs/architecture/domain_data_v1.md` and `docs/architecture/domain_data_v1.yaml`.
- Slice 1 implements the frozen domain models and enums, `ADMISSION_YEAR = 2026`, conservative eligibility aggregation, `AdmissionSeatFact` validation, and focused invariant tests.
- Slice 2 implements deterministic ELG001–ELG032 dispatch and execution, explainable sourced checks, missing-field reporting, cutoff calculation, explicit `NEEDS_REVIEW` boundaries, and complete rule-ID test coverage.
- Historical Slice 2 verification recorded 30 passing tests and a strict TypeScript compiler check. This is milestone evidence, not a current-HEAD test run.
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

Review the implemented journey against the [mapping](docs/planning/m2_one_journey_question_domain_map_v1.md) and dated authorization. The local flow starts without marks, explains the 2026 first-year TNEA route, offers preparation and a voluntary check, asks one field at a time, retains entered answers and unknowns, and shows the existing engine cutoff only when supported. Eligibility may remain `NEEDS_REVIEW`. Volunteer Tamil equivalence, final factual release approval, actual student validation of the 5–10-minute goal, and the frozen technical/mission/owner/scenario completion reviews remain pending. No broader taxonomy or later milestone is authorized.

Historical test counts below and above refer to their named milestones. The bounded M2 implementation was checked with focused local tests, the existing offline suite and strict typecheck; its test outcome is recorded in the implementation note above. No live model request was made.

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
- M1-A/M1-C application work is accepted. A later 2026-10-03 decision authorizes only one bounded M2 journey; its implementation and acceptance remain pending.

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
- Bounded pre-M2 AI experiments have been conducted separately from production authorization. Further Gemini execution is paused; AI must never invent admission facts or replace deterministic authority.
- No student name or contact information is stored in the anonymous profile dataset.
- Planned product stack: Next.js, TypeScript, Tailwind CSS, Supabase/PostgreSQL, and Vercel; implementation is not yet present.

## Next review point

Focused owner and student review of the implemented single M2 journey, including the mapping, deterministic/unknown boundaries, Tamil equivalence and actual 5–10-minute usefulness. Final factual release approval and Live LLM Gate completion remain separate future decisions.

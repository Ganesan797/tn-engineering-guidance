# Current execution plan

**Updated:** 2026-10-04. **Owner:** Ganesan. **Current task map:** T01–T06 below. [Project Status](../../PROJECT_STATUS.md) summarizes state; [documentation guide](../README.md) provides navigation. Keep task status and next actions here rather than maintaining competing task lists. This map records direction and authorization boundaries; it does not authorize every listed task.

## Authority and verified baseline

The frozen [Product Mission](../product/product_mission.md), [Student Journey V1](../product/student_journey_v1.md) and [Input/Output V1](../product/student_input_output_v1.md) govern product decisions. The [implementation plan](implementation_plan_v1.md), [architecture addendum](../architecture/m0_ai_rag_architecture_addendum_v1.md) and [delivery responsibility model](../product/guidance_delivery_responsibility_model_v1.md) retain their responsibilities and milestone boundaries. Later explicit, dated authorizations determine permitted execution scope; an older status snapshot does not override them.

Historical baseline fetched and verified before T01 editing (superseded by T02 below):

| Ref | Full commit | Interpretation |
| --- | --- | --- |
| Local `main` and `origin/main` | `84e3e84f7da1033b3014da06c9054382b34f7398` | Bounded journey and local-validation preparation integrated |
| Local and remote `codex/m2-owner-finding-01-stage1` | `ed03a420b86b1a0970d79741c175b48b4d77c07e` | Four commits beyond main; Stage 1 and optional bilingual question revisions remain unmerged |

The working tree was clean. T01 adds documentation on this review branch; the SHA above remains the implementation review baseline, not a claim that the later documentation commit has the same SHA. No existing changes were discarded and no merge was performed.

### Current state and evidence classification

- **M0/M1:** accepted in the repository acceptance records summarized in Project Status.
- **M2:** authorized within the [2026-10-03 bounded decision](m2_one_journey_authorization_decision_2026-10-03.md), implemented, acceptance pending. The [optional 70-question decision](m2_optional_question_collection_decision_2026-10-03.md) extends only the stated scope. The original journey and later optional question revisions are approved for fast-forward integration under T02; the accompanying integration report verifies final main/remote heads.
- **Owner Finding 01:** owner-reported Stage 1 screen-review PASS; this does not approve factual release, Tamil equivalence or student usefulness.
- **Owner Finding 02:** **PASS_OWNER_REPORTED** for language presentation and question-specific answer relevance at `ed03a420b86b1a0970d79741c175b48b4d77c07e`; remaining FIX items: none. The [2026-10-04 decision](m2_owner_finding_02_decision_2026-10-04.md) authorizes merge after checks, not factual release, human Tamil equivalence, student validation or M2 acceptance.
- **Question coverage:** recorded implementation completeness is 69 DIRECT and Q021 PARTIAL in each language. All 70 Tamil question/answer pairs need volunteer equivalence review; the other 98 corpus questions are not represented as answered. Reachability and answer completeness do not establish factual release approval.
- **Human gates:** factual release, Tamil equivalence and actual student validation remain pending. Prepared procedures and local/paper walkthroughs are not human approvals.
- **Live LLM:** Gate PARTIAL; Gemini execution PAUSED. Preserve the [accepted experiment learning](../experiments/live_llm_integration_gate_results_v2.md): G02 PASS with minor finding; G03 guidance-quality failure despite grounding/routing PASS and bounded HTTP 503 recovery; G04 PASS; G05 OUTPUT_VALIDATION_ERROR. G01 retains its recorded evidence/acceptance limits; remaining frozen scenarios are unexecuted. These results do not authorize production use.
- **Not authorized:** conversational implementation, production RAG, new live calls, deployment or later milestone implementation. **Production model and visible question limit are undecided.** The current 70 prepared answers are the bounded implemented collection, not a permanent product question limit; the experimental Gemini model is not a production-model decision.

## Agreed product direction

Preserve awareness → understanding → optional personalization → useful next action for a student starting with little admissions knowledge. Students must gain value without marks, a branch choice or a college list. The guided journey is the primary current experience; canonical Q&A is governed reusable knowledge and optional exploration, not a compulsory FAQ sequence or a replacement journey.

Future guidance may become progressively conversational. Route by the student's intent and the authority required: reviewed canonical explanations for established questions; governed structured facts and deterministic services for personal admission-critical results; selective LLM assistance where approved explanation, clarification or orchestration adds value. An LLM must not invent or override eligibility, cutoff, rank, vacancy, admission results or unknown states. Source year, provenance, review status and uncertainty remain visible. This direction does not authorize implementation.

Future model economics should measure **cost per successfully guided student journey**, not token price or a single successful response alone. A future approved evaluation must define journey success and account for retries, failed/incomplete journeys and applicable delivery costs, alongside factual safety, intent fidelity and Tamil usefulness. No target cost, model choice or production budget is approved here.

## Current task map

### T01 — Documentation reconciliation

- **Purpose / deliverable:** One current task map, reconciled Project Status and documentation entry link; preserve frozen authority, original content and experiment history.
- **Owner:** Codex prepares and validates; Ganesan owns project direction.
- **Dependencies:** Verified main/review heads; governing documents and latest owner report.
- **Authorization:** Documentation-only changes, commit and push to the review branch authorized by the 2026-10-04 T01 instruction. No application edits or merge.
- **Completion evidence:** Branch verification; task/status consistency; valid local links; whitespace check; exact documentation-only diff; successful commit/push and clean working tree reported with the final SHA.
- **Status:** Documentation reconciliation and integrity validation complete; persistence is evidenced by the commit/push report accompanying this revision.
- **Next:** T01 complete; follow the T02 integration record and T03 human reviews.

### T02 — Persist Owner Finding 02 result, resolve FIX items, decide merge separately

- **Purpose / deliverable:** Dated owner outcome tied to the reviewed commit/screens/questions; a bounded FIX list if applicable, re-review evidence and a separate reviewed-branch merge decision.
- **Owner:** Ganesan supplies PASS/FIX and decides merge; Codex records the outcome and implements only explicitly authorized corrections.
- **Dependencies:** T01; explicit outcome for the `ed03a42` implementation baseline (or the exact revision actually reviewed).
- **Authorization:** Ganesan explicitly supplied PASS, no FIX items and conditional merge/push authorization on 2026-10-04. No implementation change or human release approval is granted by that decision.
- **Completion evidence:** Explicit PASS/FIX with affected IDs/URLs and observations; for FIX, authorized changes, appropriate offline checks and owner re-review; explicit merge/defer decision and, only if authorized, verified resulting branch heads. Passing tests is not owner PASS.
- **Status:** Owner decision and pre-merge checks COMPLETE; no FIX work required. Fast-forward integration/push completion is evidenced by the accompanying verified main/remote commit report.
- **Next:** T03 factual release and human Tamil-equivalence reviews; merge does not accept M2.

### T03 — Factual release and human Tamil-equivalence reviews

- **Purpose / deliverable:** Separate, attributable reviews of factual scope/source applicability and Tamil/English semantic equivalence for the bounded journey and prepared question copy.
- **Owner:** Ganesan for factual-scope disposition; designated human Tamil volunteers for equivalence (reviewers not yet recorded); Codex supports evidence preparation, not human approval.
- **Dependencies:** Stable T02 review target; [validation checklist](m2_one_journey_validation_plan_2026-10-03.md), [answer map](m2_question_specific_answer_mapping_2026-10-04.md), saved content/evidence. Evidence preparation can proceed alongside T02; final sign-off must identify the actual reviewed revision.
- **Authorization:** Required human review gate within bounded M2; preparation exists. T01 grants no factual release or volunteer approval and authorizes no content fixes.
- **Completion evidence:** Named reviewer/date/commit, screens and question IDs reviewed, claim/source/year limits, PASS/FIX and disposition of corrections; separate Tamil record covering meaning, numbers, conditions, language switching and next actions. Resolve or explicitly constrain Q021 and other source gaps rather than fabricating facts.
- **Status:** PENDING — factual release and all 70 Tamil pairs remain unapproved.
- **Next:** Ganesan assigns factual and Tamil reviewers to integrated main using the prepared checklist and all 70 question pairs; record separate outcomes and preserve Q021’s evidence gap.

### T04 — Bounded M2 real-student validation

- **Purpose / deliverable:** Observed use of the authorized journey by students with little admissions knowledge, reaching and explaining one useful next action within the intended 5–10 minutes.
- **Owner:** Ganesan arranges participants/facilitator; students provide observations; Codex may help record anonymized evidence without claiming to be a participant.
- **Dependencies:** Stable T02 revision; T03 assessment of factual/language safety for the tested material; [prepared procedure and privacy-conscious observation template](m2_one_journey_validation_plan_2026-10-03.md).
- **Authorization:** Bounded validation preparation is authorized and complete. Human sessions still need owner arrangement and appropriate consent/privacy handling; T01 does not execute a session or authorize broader deployment.
- **Completion evidence:** Actual dated, anonymous observations tied to revision: hesitations, misunderstandings, elapsed time, explained next action, zero-knowledge/direct-entry/unknown/retained-input behavior where applicable, and disposition of findings. No personal certificates or identifiable profiles committed.
- **Status:** NOT_RUN_WITH_REAL_STUDENTS. Local and paper checks do not satisfy this task.
- **Next:** Arrange the bounded session on reviewed material and record what happened; do not infer comprehension from technical tests. This is M2 validation, not completion or authorization of M7's later pilot.

### T05 — Explicit M2 acceptance decision

- **Purpose / deliverable:** Dated accept/defer decision for the bounded milestone with evidence and residual limitations.
- **Owner:** Ganesan, exercising owner engineering and student/mission review roles.
- **Dependencies:** T02 outcome and separate merge disposition; T03 and T04 evidence; required technical, mission, owner and relevant-scenario completion reviews under the frozen plan.
- **Authorization:** Acceptance is reserved to an explicit owner decision. Neither this plan, a merge nor test success accepts M2.
- **Completion evidence:** Recorded gate outcomes, reviewed commit/scope, disposition of blockers and explicit M2 acceptance or deferral. The separate Live LLM Gate remains distinct.
- **Status:** PENDING; M2 NOT_ACCEPTED.
- **Next:** After review evidence is available, Ganesan evaluates and records the acceptance decision. Do not promote M3 implementation automatically.

### T06 — Assess gaps and propose separately authorized M3 work

- **Purpose / deliverable:** After M2 acceptance, a bounded gap assessment and proposal for Personal Guidance Presentation, with reused capabilities, missing evidence, scope and validation criteria.
- **Owner:** Codex prepares only when tasked; Ganesan reviews and separately authorizes any implementation.
- **Dependencies:** T05 explicit acceptance and the frozen M3 dependencies, including applicable rule/support evidence.
- **Authorization:** Future planning item; M3 implementation NOT_AUTHORIZED. T01 records the sequence only.
- **Completion evidence:** Proposal traceable to M3's simple guidance / explain why / evidence hierarchy, Verified Personal Results versus Things Worth Checking, uncertainty and next-action requirements; explicit owner disposition before implementation.
- **Status:** NOT_STARTED; waits for M2 acceptance.
- **Next:** Once T05 passes, request the bounded assessment/proposal; do not replace M3 with conversational development.

## Frozen M3–M7 roadmap remains intact

| Milestone | Frozen responsibility | Dependency / boundary |
| --- | --- | --- |
| M3 — Personal Guidance Presentation | Understandable results, uncertainty, three information levels and next action | M0–M2; applicable D1/D2; representative Tamil review by acceptance |
| M4 — Explore / Think-Further | Evidence-backed exploration and related options | Frozen M0/M1/M3 dependencies, M2 when personalized; reviewed interest-input contract, taxonomy and matching semantics before implementation |
| M5 — Decision Support Adaptation | Student-controlled counselling choices and evidence explanations | Frozen M0–M3 and relevant M4 links; no predictions, invented vacancy or ranking |
| M6 — End-to-End Product V1 (integration) | Integrate accepted capabilities into coherent journeys | Accepted M0–M5; not a catch-all for new features |
| M7 — Pilot Readiness | Pilot preparation and human/mobile/language/privacy readiness | M6 acceptance and required evidence/reviews; not production deployment |

These are preserved responsibilities, not new authorizations. Optional Q&A in bounded M2 does not complete M4. Conversational work must not replace, renumber or automatically authorize any milestone.

## Separate future workstreams

These names are distinct from the existing repository experiment names. Their listing grants no execution authority.

| Workstream ID / purpose | Owner | Dependencies and required evidence | Authorization / current status | Next decision |
| --- | --- | --- | --- | --- |
| LLL — Live LLM learning | Ganesan; Codex only within an approved experiment | Existing frozen scenarios, sanitized run evidence, mechanical and human reviews; preserve G1/G2/G3 and question/entity fidelity | Gate PARTIAL; Gemini PAUSED; no new calls authorized | Decide separately whether/when to resume bounded learning and with what budget; never equate it with production approval |
| CON — Future conversational contract | Ganesan product authority; future drafter to be assigned | Frozen journey, delivery responsibilities, M2 learning; proposed intent routing, progressive input, context retention, refusal/unknown and source boundaries reviewed before implementation | Direction agreed; implementation NOT_AUTHORIZED; no new contract approved by T01 | Separately authorize contract preparation when appropriate; retain guided journey structure |
| ECO — Model and journey-economics evaluation | Ganesan; evaluator to be assigned | Approved contract/evaluation scope, representative successful-journey definition, source/safety and Tamil criteria, measured cost including failed attempts/retries | Production model UNDECIDED; new evaluation calls and implementation NOT_AUTHORIZED | Approve evaluation design, budget and success/cost measure separately; experimental model choice is not a production decision |
| PIL — Future conversational pilot | Ganesan; human reviewers/participants to be assigned | Approved contract, model/economics evidence, required Live LLM/production decisions, factual/Tamil/privacy reviews and explicit pilot authorization | NOT_AUTHORIZED; NOT_STARTED | Revisit only through a separate bounded proposal; no bypass of M3–M7 or production-RAG approval |

## Dated supersession and preserved history

| Historical statement | Current interpretation / supersession |
| --- | --- |
| Frozen implementation plan's `IMPLEMENTATION_AUTHORIZED = NO`; architecture addendum's “M2 has not started” | Records the state when those documents were adopted. The **2026-10-03 bounded authorization** linked above authorizes only the specified deterministic/canonical journey. Frozen responsibilities remain authoritative and unchanged. |
| **2026-09-30** delivery responsibility model and experiment-results V2: M2 NOT_AUTHORIZED | Superseded only for bounded M2 by the **2026-10-03 decision**. The experiment findings, model responsibilities and production restrictions remain active. |
| Earlier **2026-10-03** readiness proposal: M2 not authorized | The later same-day authorization explicitly resolves this transition; no Live LLM Gate closure was required for this non-LLM scope. |
| **2026-10-03 authorization**: execution NOT_STARTED | Decision-time snapshot, followed by implementation and validation preparation in main `84e3e84…`, summarized in Project Status. It is not a claim that implementation is still absent. |
| **2026-10-03 optional collection** and **2026-10-04 answer map**: awaiting owner review | Historical implementation-time snapshots. The later **2026-10-04 explicit decision** passes language presentation and question-specific relevance at `ed03a420…`, states no FIX items and authorizes merge after checks. This supersedes T01’s missing-outcome state without approving factual release, Tamil equivalence, student validation or M2 acceptance. |

Do not rewrite frozen documents, original content or experiment history to erase these snapshots. Follow the dated authorization links and the current task statuses above. No other chats are automatically synchronized by updating this repository.

## Verification record for T01

**Executed in T01:** fetch and branch/head/history comparison; clean-tree verification; documentation/source review; relative-link validation; required task/status and roadmap consistency checks; `git diff --check`; documentation-only changed-file check. Commit/push and final working-tree status are reported with this revision's full commit SHA.

**Prior reported evidence, not rerun here:** main's bounded journey reported 7/7 focused and 206/206 full offline tests plus typecheck; review commit `ed03a42…` reported 11/11 focused and 210/210 full offline tests plus typecheck. T01 runs no application tests, typecheck, browser walkthrough, model request or human session. Documentation integrity checks do not imply new implementation or product acceptance.

## Verification record for T02

**Executed on 2026-10-04:** fetched origin; verified clean tree, matching main/review remote heads and fast-forward ancestry; verified T01 is the direct child of `ed03a420…` and changes only `PROJECT_STATUS.md`, `docs/README.md` and this plan. Full offline suite **210/210 PASS** and strict `npm run typecheck` **PASS** were freshly executed. Existing secret-guard tests passed; integration file secret-pattern, documentation-link, status-consistency and whitespace checks accompany the decision commit. No live model call, implementation change or human session occurred.

**NEXT_SINGLE_ACTION:** T03 — Ganesan assigns factual-scope and human Tamil-equivalence reviewers to integrated main and records separate, attributable outcomes using the prepared checklist and question map.

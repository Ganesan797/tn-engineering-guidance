# Current execution plan

**Updated:** 2026-10-29. **Owner:** Ganesan. The [bounded implementation authorization](m4_bounded_implementation_authorization_2026-10-29.md) permits the existing internal owner-review candidate. His [directory source-record decision](../../experiments/m4-governance-census/directory-candidates-2026/owner-batch-decision-2026-10-29.md) approves exactly 8,622 literal dated observations while retaining all 191 exceptions and existing holds. It does not resolve conflicts, approve cross-source identity joins or student-facing use, or authorize expanded implementation. The [candidate package](../../experiments/m4-governance-census/directory-candidates-2026/README.md) accounts for 414 matrix colleges, 3,354 offerings and four additional booklet-only codes. Production ingestion, deployment, student access, M5 and CON remain separately unauthorized. [Project Status](../../PROJECT_STATUS.md) summarizes state; [documentation guide](../README.md) provides navigation. Older statements below are historical where they conflict with this paragraph.

**Current decision:** Ganesan accepts M4-A1 for synthetic-only internal scope at `8e4538d9e8e1f34245638188e190d5e14647fb10`; subsequent bounded owner-only work is recorded in the authorization above. His [Tamil review](../../review-evidence/m4-expansion-candidates-2026-10-29/tamil-owner-review.md) is PASS_OWNER_REPORTED for the six exact candidate sections only. His later batch decision approves literal source-stage offering records only; educational factual approval, English equivalence, student display and student validation are not implied. Expanded implementation and production ingestion remain NOT_AUTHORIZED. Ganesan's bounded M3 acceptance at `f545e01c0091f4722a427d0bfb1772a60615bbfe` remains in force. T04_STATUS = NOT_RUN; STUDENT_VALIDATED = NO; PILOT_READINESS = NOT_APPROVED; Gemini stays PAUSED and the Live LLM Gate remains PARTIAL.

**M3 closure:** M3-T01 contract complete; M3-T02A–D technically implemented; M3-T03/T03E/T03F implemented and integrated. `M3_BOUNDED_ACCEPTANCE = PASS`; `M3_ACCEPTED_BASELINE = f545e01c0091f4722a427d0bfb1772a60615bbfe`. Owner review passes Tamil/English alignment, uncertainty, evidence limits, next actions and edge cases. Deterministic admission authority and existing source/UNKNOWN/NEEDS_REVIEW boundaries remain intact. Acceptance does not claim independent factual verification, real-student validation, pilot readiness or LLM readiness.

**M4 readiness:** Frozen outcome: students can explore branches and options they may not know to ask about. M2/M3 supply bilingual orientation and personal/general guidance; optional Q&A does not complete M4. The preserved census and owner worksheet support the separately authorized bounded owner-only implementation and the current review-only assessment. Governed production data, profile release and student validation remain separate gates. CON-01 remains unauthorized.

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
- **M2:** authorized within the [2026-10-03 bounded decision](m2_one_journey_authorization_decision_2026-10-03.md), implemented and accepted for bounded scope as PASS_OWNER_REPORTED at a67fc4c by the later October 11 decision. The [optional 70-question decision](m2_optional_question_collection_decision_2026-10-03.md) extends only the stated scope. The original journey and later optional question revisions are approved for fast-forward integration under T02; the accompanying integration report verifies final main/remote heads.
- **Owner Finding 01:** owner-reported Stage 1 screen-review PASS; this does not approve factual release, Tamil equivalence or student usefulness.
- **Owner Finding 02:** **PASS_OWNER_REPORTED** for language presentation and question-specific answer relevance at `ed03a420b86b1a0970d79741c175b48b4d77c07e`; remaining FIX items: none. The [2026-10-04 decision](m2_owner_finding_02_decision_2026-10-04.md) authorizes merge after checks, not factual release, human Tamil equivalence, student validation or M2 acceptance.
- **Question coverage:** recorded implementation completeness is 69 DIRECT and Q021 PARTIAL in each language. All 70 Tamil question/answer pairs have Ganesan’s owner-reported human equivalence PASS (not independent volunteer approval); the other 98 corpus questions are not represented as answered. Reachability and answer completeness do not establish factual release approval.
- **Human gates:** Ganesan’s factual-scope and human Tamil-equivalence reviews are PASS_OWNER_REPORTED on 2026-10-04 for J01–J20 and all 70 items at `e052f1d6453af03e5c389dbcb739ce41836d5c92`; the Tamil outcome is not independent volunteer approval. That wording attribution is historical; later revisions retain separate dated decisions. Ganesan separately reports placement/wording PASS with no FIX items on 2026-10-09 for the [October 5 revised question-page copy](t04_wording_reconciliation_2026-10-05.md) at `4d77c34a41ae16a5b9a21ebc5e89dc81075bec40`; this does not rewrite the historical T03 decisions or supply fresh external-source verification. Existing source limits and Q021 PARTIAL remain. T03 COMPLETE for its recorded baseline; T04 actual student validation NOT RUN; bounded M2 acceptance PASS_OWNER_REPORTED at a67fc4c on October 11.
- **Live LLM:** Gate PARTIAL; Gemini execution PAUSED. Preserve the [accepted experiment learning](../experiments/live_llm_integration_gate_results_v2.md): G02 PASS with minor finding; G03 guidance-quality failure despite grounding/routing PASS and bounded HTTP 503 recovery; G04 PASS; G05 OUTPUT_VALIDATION_ERROR. G01 retains its recorded evidence/acceptance limits; remaining frozen scenarios are unexecuted. These results do not authorize production use.
- **Not authorized:** M4/CON implementation, production RAG, new live calls or deployment. **Production model and visible question limit are undecided.** The current 70 prepared answers are the bounded implemented collection, not a permanent product question limit; the experimental Gemini model is not a production-model decision.

## Agreed product direction

Preserve awareness → understanding → optional personalization → useful next action for a student starting with little admissions knowledge. Students must gain value without marks, a branch choice or a college list. The guided journey is the primary current experience; canonical Q&A is governed reusable knowledge and optional exploration, not a compulsory FAQ sequence or a replacement journey.

Future guidance may become progressively conversational. Route by the student's intent and the authority required: reviewed canonical explanations for established questions; governed structured facts and deterministic services for personal admission-critical results; selective LLM assistance where approved explanation, clarification or orchestration adds value. An LLM must not invent or override eligibility, cutoff, rank, vacancy, admission results or unknown states. Source year, provenance, review status and uncertainty remain visible. This direction does not authorize implementation.

Future model economics should measure **cost per successfully guided student journey**, not token price or a single successful response alone. A future approved evaluation must define journey success and account for retries, failed/incomplete journeys and applicable delivery costs, alongside factual safety, intent fidelity and Tamil usefulness. No target cost, model choice or production budget is approved here.

## Current task map

### Current owner direction — college discovery and decision support (2026-10-27)

**Owner decision:** Ganesan approved the [college discovery contract](m4_college_discovery_contract_v1.md) for planning only on 2026-10-27, reviewed revision `7603cfea6b09412d10114f771e5592106f55e5c1`. The booklet field model retains its explicit limitations; statewide completeness is NOT_ESTABLISHED. Coverage thresholds and draft profile content remain NOT_APPROVED, existing identity/evidence/scope holds remain, and ingestion and M4/M5 implementation are NOT_AUTHORIZED. Gemini remains PAUSED.

This documentation-only clarification governs current planning; it supersedes older next-M4-task wording, not frozen mission/journey history or implementation gates. M3 bounded acceptance remains PASS at `f545e01c0091f4722a427d0bfb1772a60615bbfe`. M4 and M5 implementation are NOT_AUTHORIZED; CON remains separate, Gemini PAUSED and Live LLM Gate PARTIAL. T04 NOT_RUN, STUDENT_VALIDATED NO and PILOT_READINESS NOT_APPROVED are unchanged.

**Internal product direction (not approved marketing copy):** “Understand colleges and branches, see how they compare with past TNEA admissions, and build your own informed choice list—with clear evidence and no admission prediction.”

**M4 — marks-free Explore / Think Further:** Help a student with no marks and little admissions knowledge discover a branch, find colleges offering it in the evidenced source year, understand institution types and know what to check next. Include branch learning, branch-to-college discovery, verified district/location and institution type, source-backed programme offerings, small neutral comparisons and practical Things Worth Checking. Separate a listed college, a source-year programme offering, sanctioned intake, published vacancy and current admission availability. None proves another. No cutoff matching, chances, predictions, Safe/Target/Dream, college-quality rankings or automatic choice ordering. Statewide ingestion and LLM capability are not prerequisites.

**M5 — future personalized decision support:** Use explicit cutoff/category context and separately approved historical college–programme evidence to explain selected comparisons, exact closing cutoff/rank, why an option is shown, student-controlled filters/sorts, shortlist/manual choice ordering and counselling-order education. This direction does not approve historical data, methodology or implementation. The frozen plan's D5 methodology/provenance gate still blocks historical features until separately reviewed and authorized; D3/D4 evidence is needed only for claims using their fields. No allotment prediction, probability, guarantee, Safe/Target/Dream, suitability/quality score, choice optimizer or counselling-portal submission.

**Historical comparison policy:** Keep deterministic calculated cutoff, past admission comparison and current allotment distinct. Preferred wording: “These college–programme options meet your selected historical comparison. This is past admission evidence, not a guarantee for the current year.” Show source year, category, exact comparison and source, with round where applicable. Illustrative example only, not sourced admission data: student cutoff 176.5; 2025 BC closing cutoff 174.0; difference +2.5. Compare like-for-like measures; do not treat rank as cutoff or average multiple years into a prediction. Missing evidence remains UNKNOWN / NOT REPORTED under existing conventions, never an invented value.

**Student control:** Neutral filters/sorts may use branch, verified district/type, historical cutoff or name where supported and explicitly selected. Explain the displayed comparison and ordering; no hidden “best” score, curated top ordering or inferred preference. Future M5 can support a shortlist and manual reordering with official college/programme codes preserved. Guidance: “Order choices by your genuine preference. Historical data can help you understand past outcomes, but it should not determine your preference order automatically.” Export is a separately authorized later option, not a first-slice requirement.

**Staged college dataset and delivery:**

| Stage | Bounded purpose | Gate |
| --- | --- | --- |
| M4-A | Validate useful marks-free discovery with the existing governed five-college pilot | Approve a bounded feature contract before implementation |
| M4-B | Consider roughly 15–30 representative colleges | Accept the useful pilot flow and separately authorize governed expansion; no fixed 25–30 minimum |
| M5-A | Historical comparison on the governed pilot | Approve methodology, evidence dimensions and bounded implementation separately |
| M5-B | Shortlist and manual choice-building | Establish that students understand comparisons; separately authorize the workflow |

Statewide college ingestion is DEFERRED, not a prerequisite or an obligation to ingest roughly 440 colleges. This staging does not reduce the separate comprehensive in-scope educational branch-coverage obligation. The [M4-T03 branch-content package](../content/m4/m4_t03_comprehensive_branch_content_review_v1.md) remains a research/review candidate, not approved student content or canonical admissions mappings.

**First-slice data boundary:** Reuse governed college code/name, evidenced programme offerings, branch identity/profile and provenance; use location/type only where verified. Current pilot college rows do not supply district/type fields. Do not silently resolve unmapped programmes or expand canonical identities. Fees, hostel, distance from home, current accreditation and scholarship facts are not required structured fields without maintainable governed evidence; initially frame them as Things Worth Checking, without implying availability or entitlement. Preserve source year/applicability and the distinction between reviewed educational content and exact admission programme identity.

**Product emphasis and owner-reviewed competitor context:** TNEAhelp and TNEA Colleges are acknowledged here as useful directory/filter, historical-data and choice-tooling references, based on the owner's review, not a fresh feature audit. Differentiate through zero-knowledge Tamil-first understanding, branch learning before cutoff filtering, marks-free discovery, institution-type explanation, transparent evidence and “why shown”, uncertainty, practical checks, college-versus-branch reflection and student control. Do not compete through unsupported quality claims, feature/filter counts, dataset size, predictors or rankings.

**Contract and acceptance boundary:** The approved-for-planning contract specifies interest inputs (including no input/not sure/show all), taxonomy, explicit editorial relationships, shared evidence-aware outputs and supported next actions. It retains review gates for these semantics and requires a marks-free branch → evidenced college offering → college details → what-to-verify path, Tamil/English human review, source-year/unknown handling, neutral comparisons and no inference of admission availability. Reuse M2/M3 guidance and deterministic authority; no new rules or personal fields. Owner approval is required before implementation or data expansion. M6 remains integration; M7 remains pilot readiness/human validation under the existing private-hosting, owner-mobile and remote-observation sequence below. No hosting or student-session authorization is added.

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
- **Status:** COMPLETE. Owner PASS, no FIX items; fast-forward integration and push verified at `e052f1d6453af03e5c389dbcb739ce41836d5c92` (local main and origin/main). No M2 acceptance implied.
- **Next:** T03 factual release and human Tamil-equivalence reviews; merge does not accept M2.

### T03 — Factual release and human Tamil-equivalence reviews

- **Purpose / deliverable:** Separate, attributable reviews of factual scope/source applicability and Tamil/English semantic equivalence for the bounded journey and prepared question copy, recorded in the [single T03 worksheet](t03_factual_tamil_review_worksheet_2026-10-04.md).
- **Owner:** Ganesan performed and reported both factual-scope and human Tamil-equivalence reviews. No independent volunteer approval is claimed. Codex records the supplied outcomes, not human approval of its own.
- **Dependencies:** Stable T02 review target; [validation checklist](m2_one_journey_validation_plan_2026-10-03.md), [answer map](m2_question_specific_answer_mapping_2026-10-04.md), saved content/evidence. Evidence preparation can proceed alongside T02; final sign-off must identify the actual reviewed revision.
- **Authorization:** The 2026-10-04 T03 instruction authorizes worksheet preparation, documentation integrity checks, commit and push only. Human review is required; no content/rule fixes, factual release or volunteer approval is granted by preparation.
- **Completion evidence:** Named reviewer/date/commit, screens and question IDs reviewed, claim/source/year limits, PASS/FIX and disposition of corrections; separate Tamil record covering meaning, numbers, conditions, language switching and next actions. Resolve or explicitly constrain Q021 and other source gaps rather than fabricating facts.
- **Status:** COMPLETE at the recorded `e052f1d6453af03e5c389dbcb739ce41836d5c92` baseline. Both T03 reviews PASS_OWNER_REPORTED by Ganesan, 2026-10-04, for J01–J20 and all 70 prepared items. All 90 factual and 90 Tamil outcomes attribute their respective batch decision, without item-specific observations or fresh source verification. The October 5 owner-reviewed bilingual question copy differs in 203 fields; the historical outcomes are preserved and not silently transferred. Tamil review is Ganesan’s human review, not independent volunteer approval. Q021 PARTIAL and every source/year/scope limitation remain; T04 NOT RUN and bounded M2 acceptance PASS_OWNER_REPORTED at a67fc4c on October 11.
- **Later copy decision:** Ganesan [approved A01–A05 and passed A06–B08 conversational wording](t03_conversational_copy_sync_decision_2026-10-10.md) on 2026-10-10. It is now integrated at a67fc4c; this does not change historical T03 attribution or complete T04.
- **Next:** Preserve applicable reviews in M2-C2; M2-C3/T05 is now complete by explicit owner decision. T04 remains mandatory on the amended later path.

### T04 — Bounded M2 real-student validation

- **Purpose / deliverable:** Observed use of the authorized journey by students with little admissions knowledge, reaching and explaining one useful next action within the intended 5–10 minutes.
- **Owner:** Ganesan arranges participants/facilitator; students provide observations; Codex may help record anonymized evidence without claiming to be a participant.
- **Dependencies:** Exact later integrated UI revision; applicable factual/Tamil reviews; separately authorized and accepted conversational capability and bounded LLM candidate with explicit gate disposition; hosting readiness and owner mobile verification; [existing procedure and privacy-conscious template](m2_one_journey_validation_plan_2026-10-03.md). T04 is no longer a prerequisite for bounded M2 acceptance.
- **Authorization:** Bounded validation preparation is authorized and complete. Human sessions still need owner arrangement and appropriate consent/privacy handling; T01 does not execute a session or authorize broader deployment.
- **Completion evidence:** Actual dated, anonymous observations tied to revision: hesitations, misunderstandings, elapsed time, explained next action, zero-knowledge/direct-entry/unknown/retained-input behavior where applicable, and disposition of findings. No personal certificates or identifiable profiles committed.
- **Status:** NOT_RUN_WITH_REAL_STUDENTS. Ganesan reports placement/wording **PASS_OWNER_REPORTED**, no FIX items, dated 2026-10-09 for `4d77c34a41ae16a5b9a21ebc5e89dc81075bec40`; the reviewed implementation was fast-forwarded into main. This was the then-stable technical baseline; a67fc4c is the current M2 implementation baseline. Record the exact later student-test revision separately. The [UI-readiness record](t04_ui_readiness_2026-10-04.md) and [wording disposition](t04_wording_reconciliation_2026-10-05.md) preserve the scope and checks. T03 attribution remains at its original baseline; Q021 remains PARTIAL. Technical/paper checks do not satisfy T04.
- **Next:** T04 remains NOT_RUN until later M7-S1 observations, mandatory before M7-S2 pilot readiness. Ganesan sets a target window/checkpoint with dependency authorization; escalate delays rather than indefinitely defer. No hosting/session permission is granted here.

**Historical pre-T04 sequence (2026-10-10; placement superseded October 11):** Local smoke **PASS** at `61a0ba52972dedbcbfde0d8612eff1d5cdda1696` (reviewed implementation ancestor `4d77c34a41ae16a5b9a21ebc5e89dc81075bec40`): Tamil-first marks-free start, optional study/compare and Q049 bilingual switching, retained Mathematics after a route detour, unknown/retry without a guessed cutoff, and synthetic 165.5/200 shown separately from NEEDS_REVIEW. No specific failure was reproduced. Next: **separately authorized hosting/access preparation → Ganesan's mobile verification of that exact access revision → T04 with 2–3 remote students** using the [existing anonymous observation template](m2_one_journey_validation_plan_2026-10-03.md). `OWNER_READY = PASS_OWNER_REPORTED_FOR_PLACEMENT_WORDING_ONLY`; `OWNER_MOBILE_VERIFICATION = PENDING`; `STUDENT_VALIDATED = NO`. Neither local smoke nor owner readiness completes T04.

**Historical bounded access change list (proposal only; later M7 authorization required):** The [existing access note](m2_one_journey_validation_plan_2026-10-03.md) uses the current loopback listener `127.0.0.1:3000` and an authenticated temporary SSH forward for a phone on a trusted private network. It needs no public deployment or application change, but does **not** reach students outside that network. For 2–3 genuinely remote students, Ganesan must first approve a specific private access/hosting method, provider or host, region, HTTPS and participant authentication, and whether any server/network configuration change is permitted. Restrict access to the owner and invited participants; keep Gemini disabled, do not collect real marks/certificates, disable public indexing, and keep no unnecessary request logs. Proposed access expiry is the earlier of the last scheduled session or seven days after activation; revoke participant access and stop/remove the temporary endpoint immediately afterward, then verify it is unreachable. Verify the exact deployed commit, Tamil `/journey`, bilingual question links, synthetic/UNKNOWN paths and phone layout before owner mobile sign-off. **Spending limit until separate authorization: USD 0.** Provider charges and an explicit cost ceiling remain undetermined; obtain a quoted total and owner approval before purchase or deployment. Do not use a public tunnel or treat the current LAN-only note as a remote hosting solution.

### T05 — Explicit M2 acceptance decision

- **Purpose / deliverable:** Dated accept/defer decision for the bounded milestone with evidence and residual limitations.
- **Owner:** Ganesan, exercising owner engineering and student/mission review roles.
- **Dependencies:** Stable integrated bounded M2 implementation, technical evidence and applicable owner review (M2-C1/C2); required technical, mission, owner and relevant-scenario reviews remain. Historical dependency T02 + T03 + T04 is explicitly superseded by the October 11 amendment: actual T04 execution is no longer a hard prerequisite.
- **Authorization:** Acceptance is reserved to an explicit owner decision. Neither this plan, a merge nor test success accepts M2.
- **Completion evidence:** Recorded gate outcomes, reviewed commit/scope, disposition of blockers and explicit M2 acceptance or deferral. The separate Live LLM Gate remains distinct.
- **Status:** COMPLETE; M2_ACCEPTANCE = PASS_OWNER_REPORTED by Ganesan, 2026-10-11, at a67fc4c9ed24f7061631782cd63c839cf098cfe8. T05 is the same acceptance decision as M2-C3. Scope is bounded implementation only; T04 NOT_RUN and STUDENT_VALIDATED NO.
- **Historical next (2026-10-11):** T06 bounded M3 gap assessment/proposal, planning only. This was superseded by the M3 acceptance recorded above; mandatory later T04 remains.

### T06 — Historical M3 gap-assessment task

- **Purpose / deliverable:** After M2 acceptance, a bounded gap assessment and proposal for Personal Guidance Presentation, with reused capabilities, missing evidence, scope and validation criteria.
- **Owner:** Codex prepares only when tasked; Ganesan reviews and separately authorizes any implementation.
- **Dependencies:** T05 explicit acceptance and the frozen M3 dependencies, including applicable rule/support evidence.
- **Authorization at the time:** Planning only; M3 implementation then required a separate owner decision.
- **Completion evidence:** Proposal traceable to M3's simple guidance / explain why / evidence hierarchy, Verified Personal Results versus Things Worth Checking, uncertainty and next-action requirements; explicit owner disposition before implementation.
- **Status:** Historical October 11 snapshot, superseded by accepted M3 at `f545e01c0091f4722a427d0bfb1772a60615bbfe`.
- **Next:** See current M4 readiness and the separately tasked data-governance feasibility census above.

## Amended closure and later execution sequence — 2026-10-11

The [dated amendment](roadmap_validation_gate_amendment_2026-10-11.md) supplies authority, exact baseline and measurable READY_FOR_HOSTING criteria. This is the current task map, not execution permission. Preserve M3–M5 and their frozen dependencies; CON/LLM work cannot replace them.

| Task ID | Purpose / deliverable | Owner | Dependencies | Authorization / status | Completion evidence | Next action / decision |
| --- | --- | --- | --- | --- | --- | --- |
| M2-C1 | Select stable integrated baseline | Codex; Ganesan scope owner | Three authorized revisions | COMPLETE; integration authorized | Full SHA, ancestry, matching main/remote and clean tree | Retain implementation SHA separately from documentation descendants |
| M2-C2 | Assemble technical and owner evidence | Codex | M2-C1 and applicable reviews | COMPLETE; documentation authorized | 12/12, 211/211, typecheck, 55 links/whitespace, mobile; original owner attribution and limits | Present evidence to Ganesan |
| M2-C3 / T05 | Explicit bounded M2 acceptance | Ganesan | M2-C1/C2; applicable frozen completion reviews | COMPLETE; PASS_OWNER_REPORTED, 2026-10-11 | Dated decision at a67fc4c full SHA; limitations and later T04 acknowledged | Historical successor T06; M3 now accepted |
| M3 | Personal Guidance Presentation | Ganesan; authorized implementer | Accepted M0–M2; frozen evidence | BOUNDED_ACCEPTANCE = PASS at `f545e01c0091f4722a427d0bfb1772a60615bbfe` | T01 contract; T02A–D and T03/T03E/T03F integrated; technical and owner bilingual review PASS | Preserve source/domain boundaries; student validation remains later |
| M4 | Explore / Think-Further | Ganesan; authorized implementer | Accepted M0/M1/M3; M2 if personal; D0 and relevant D2/D3 | IMPLEMENTATION_NOT_AUTHORIZED | Discovery contract approved for planning; reviewed interest-input contract, taxonomy, matching semantics and source evidence required before implementation | Prepare separately tasked data-governance feasibility census |
| M5 | Decision Support Adaptation | Ganesan; authorized implementer | Frozen M0–M3 and relevant M4 | NOT_AUTOMATICALLY_AUTHORIZED | Student-controlled choices and evidence; no prediction | Separately propose/authorize scope |
| CON-01 | Conversational Guidance V1 contract | Drafter to be tasked; Ganesan reviews | Frozen journey, authority and M2 learning | NOT_STARTED; preparation separately tasked; implementation not authorized | Intent/authority routing, canonical reuse, deterministic authority, unknown/refusal/escalation, provenance, compact context, entity fidelity, Tamil and scoped Tanglish/English | Separately authorize contract preparation |
| CON-02 | Explicit prototype implementation decision | Ganesan | Reviewed CON-01 | NOT_GRANTED | Dated scope, limits and required checks | Accept/defer bounded implementation |
| CON-03 | Bounded prototype | Authorized implementer | CON-02 | NOT_STARTED / NOT_AUTHORIZED | Exact candidate, tests and preserved authority | Execute only after authorization |
| CON-04 | Technical/owner capability review | Codex checks; Ganesan reviews | CON-03 | NOT_STARTED | Technical and human outcomes tied to revision | Accept/defer inclusion in integration |
| LLM-01 | Bounded integration/evaluation design | Drafter to be tasked; Ganesan reviews | Contract, authority and experiment findings | NOT_STARTED; no calls authorized | Safety/quality, candidate plan, economics, request/cost limits and gate needs | Separately authorize design/evaluation |
| LLM-02 | Candidate evaluation and explicit gate disposition | Authorized evaluator; Ganesan | Explicit design, named model and request/cost authorization | NOT_STARTED; Gemini PAUSED; gate PARTIAL | Mechanical/technical and owner quality evidence; explicit model/gate decision | Decide inclusion separately; production model undecided |
| M6-I1 | Integrate accepted capabilities | Authorized implementer | Accepted M0–M5; accepted CON/LLM if included | NOT_STARTED / NOT_AUTHORIZED | Exact coherent candidate; no catch-all features | Separately authorize integration |
| M6-I2 | READY_FOR_HOSTING assessment | Codex evidence; Ganesan decision | M6-I1; amendment checklist | NOT_STARTED / NOT_AUTHORIZED | Exact SHA, accepted journey/capabilities, gates, safety, Tamil/mobile/tests, privacy, HTTPS/access, expiry/shutdown and cost approvals | Assess evidence; no automatic deployment |
| M7-H1 | Temporary private hosting | Ganesan authorizes; operator assigned later | M6 acceptance/readiness; explicit access/cost decision | NOT_STARTED / NOT_AUTHORIZED | HTTPS, participant controls, exact revision, expiry, shutdown and cost | Explicit purchase/deployment permission required |
| M7-H2 | Owner mobile verification | Ganesan | Authorized M7-H1 endpoint | NOT_RUN | Reviewer/date/revision/device; OWNER_READY separate from student validation | Verify before participants |
| M7-S1 / T04 | First 2–3 remote exploratory observations | Ganesan/facilitator; participants | Clean integrated UI, authorized CON/LLM readiness, hosting, M7-H2 and existing T04 procedure | NOT_RUN; mandatory later | Anonymous observations, elapsed time, misunderstanding and next action at exact baseline | Set window/checkpoint; conduct with readiness and consent |
| M7-S2 | Pilot-readiness review | Ganesan | T04 findings/disposition and frozen M7 reviews | PENDING; execution not authorized | Review cohort; decide additional participants against preserved 3–5 preparation intent | Explicit readiness decision; no broad validation claim |

M2_IMPLEMENTATION_BASELINE = a67fc4c9ed24f7061631782cd63c839cf098cfe8; M2_IMPLEMENTATION = COMPLETE_FOR_BOUNDED_SCOPE; M2_ACCEPTANCE = PASS_OWNER_REPORTED; T04 = NOT_RUN; STUDENT_VALIDATED = NO; T04_PLACEMENT = MANDATORY_LATER_VALIDATION_BEFORE_PILOT_READINESS; INITIAL_T04_COHORT = 2_TO_3_REMOTE_STUDENTS_EXPLORATORY.

M3_BOUNDED_ACCEPTANCE = PASS; M3_ACCEPTED_BASELINE = f545e01c0091f4722a427d0bfb1772a60615bbfe; M4_IMPLEMENTATION_AUTHORIZED = NO; CON_IMPLEMENTATION_AUTHORIZED = NO; PILOT_READINESS = NOT_APPROVED. CONVERSATIONAL_GUIDANCE = CONTRACT_NOT_YET_AUTHORIZED_FOR_IMPLEMENTATION; GEMINI = PAUSED; LIVE_LLM_GATE = PARTIAL; PRODUCTION_MODEL = UNDECIDED; M4_TO_M7 = NOT_AUTOMATICALLY_AUTHORIZED; Q021 = PARTIAL. Ganesan must set the T04 target window/checkpoint with dependency authorization; delays require an owner decision rather than indefinite deferral.

## Frozen M3–M7 roadmap remains intact

| Milestone | Frozen responsibility | Dependency / boundary |
| --- | --- | --- |
| M3 — Personal Guidance Presentation | Understandable results, uncertainty, three information levels and next action | M0–M2; applicable D1/D2; representative Tamil review by acceptance |
| M4 — Explore / Think-Further | Evidence-backed exploration and related options | Frozen M0/M1/M3 dependencies, M2 when personalized; reviewed interest-input contract, taxonomy and matching semantics before implementation |
| M5 — Decision Support Adaptation | Student-controlled counselling choices and evidence explanations | Frozen M0–M3 and relevant M4 links; no predictions, invented vacancy or ranking |
| M6 — End-to-End Product V1 (integration) | Integrate accepted capabilities into coherent journeys | Accepted M0–M5; not a catch-all for new features |
| M7 — Pilot Readiness | Preserve 3–5-student preparation; later authorized private hosting, owner mobile and first 2–3 exploratory observations | M6 acceptance and required evidence/reviews; no automatic deployment |

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

**Later 2026-10-11 owner acceptance:** Ganesan explicitly accepts bounded M2 at a67fc4c as PASS_OWNER_REPORTED, completing M2-C3/T05. The acceptance section in the linked amendment record supersedes its earlier PENDING_OWNER_DECISION snapshot only. T04 remains NOT_RUN and mandatory later; no student, pilot, conversational, model or M3–M7 implementation approval is implied.

**2026-10-11:** The [owner amendment](roadmap_validation_gate_amendment_2026-10-11.md) supersedes T04-before-T05 and immediate hosting/session placement only. Earlier 4d77c34/27d9c0d baselines and unmerged copy/layout descriptions are historical; a67fc4c integrates those revisions. Original review scopes, frozen requirements and experiment history remain. T04 stays mandatory before later pilot readiness.

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

**Executed in the October 11 documentation task:** Fresh origin/main verification at a67fc4c; three-file documentation-only scope check; 71 local links checked; status/task/gate consistency and whitespace checks. No application tests, typecheck, browser walkthrough, live call or human session rerun. Prior integration results remain attributed to the implementation baseline.

**Historical next action, 2026-10-27:** Prepare the M4 data-governance feasibility census. This snapshot is superseded by the 2026-10-28 M4-B decisions and bounded M4-A1 authorization above; M5 remains unauthorized.
## M4 implementation update — 2026-10-28

Owner authorizes synthetic-only M4-A2/A3, implemented at `/journey?step=explore` on the task branch; owner acceptance/merge pending. The real adapter, genuine content approvals and real-data ingestion remain separate decisions. After seven-college validation, proposed scope expands to all other prepared official 2026 records in governed batches; seven is not a permanent cap. See the current implementation and expansion gates in [Project Status](../../PROJECT_STATUS.md#synthetic-m4-a2a3-implementation--2026-10-28). Earlier authorization statements here are historical where superseded by this bounded fixture scope.

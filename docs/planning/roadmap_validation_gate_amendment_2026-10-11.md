# Roadmap validation-gate amendment — 2026-10-11

**Owner:** Ganesan. **Decision:** APPROVED_IN_PRINCIPLE; persistence authorized. This amends gate placement, not M2 acceptance or later implementation authorization.

## Authority and exact supersession

The frozen [Product Mission](../product/product_mission.md), [Student Journey V1](../product/student_journey_v1.md), [Input/Output V1](../product/student_input_output_v1.md), [implementation plan](implementation_plan_v1.md), [architecture addendum](../architecture/m0_ai_rag_architecture_addendum_v1.md) and [October 3 bounded M2 authorization](m2_one_journey_authorization_decision_2026-10-03.md) remain unchanged. This later owner decision supersedes the current execution plan's T04-before-T05 dependency and immediate student-session placement only. Frozen technical, mission, owner and relevant-scenario reviews remain required. Owner student-perspective review is not actual student validation.

**OLD:** T04 student validation → T05 M2 acceptance.

**NEW:** stable bounded M2 implementation + technical evidence + applicable owner review → explicit bounded M2 acceptance decision.

T04 real-student validation remains mandatory later before the pilot-readiness decision. It is not cancelled or indefinitely deferred. [Current execution plan](current_execution_plan.md) remains the single task map; [Project Status](../../PROJECT_STATUS.md) summarizes it. Historical documents and review attributions remain auditable rather than retroactively rewritten.

## Stable implementation and assembled evidence

`M2_IMPLEMENTATION_BASELINE = a67fc4c9ed24f7061631782cd63c839cf098cfe8`

The baseline integrates copy-sync `9aa80fe1dc965fdd84b63bd833922c78ae3e69ea`, compare-copy `d8ad9a76a6a1b13ceb6c5fa5756aa9601f26db4d` and layout `d0031862f233569661719877c9f56bcdbde80211`. Main fast-forwarded to compare-copy, then merged layout with parents d8ad9a7 and d003186. The only conflict resolution retained the approved compare wording and placed unchanged actions after opening context. Push, main/origin/main equality and a clean tree were verified.

**Prior integration checks, executed on this baseline and not rerun in this documentation task:** focused 12/12 PASS; full offline 211/211 PASS; strict typecheck PASS; 55 documentation links and whitespace checks PASS. Awareness, study, compare, route and Q049 were rendered at 360×800 and 390×800: readable Tamil, no horizontal overflow and intended action placement. At 360px route actions start just below the first viewport after three explanatory paragraphs. Applicable browser/offline checks verified bilingual question switching, retained inputs, direct entry, unknown/retry and synthetic cutoff separately from eligibility. Q049's full four-way comparison and CSE (AI & ML)/R2025 limitations remain. Compare remains Tamil-only; broader English journey coverage is not claimed.

Applicable owner evidence is assembled with its original scope: [October 4 factual/Tamil reviews](t03_factual_tamil_review_worksheet_2026-10-04.md) at e052f1d; [October 9 placement/wording review](t04_wording_reconciliation_2026-10-05.md) at 4d77c34; [October 10 conversational-copy approval](t03_conversational_copy_sync_decision_2026-10-10.md); and explicit owner integration authorization for the three exact revisions. This does not invent fresh item-specific verification, independent volunteer approval or student observations at the merged SHA.

| Current field | Value |
| --- | --- |
| M2_IMPLEMENTATION | COMPLETE_FOR_BOUNDED_SCOPE |
| M2_ACCEPTANCE | PENDING_OWNER_DECISION |
| T04 | NOT_RUN |
| STUDENT_VALIDATED | NO |
| T04_PLACEMENT | LATER_MANDATORY_VALIDATION_BEFORE_PILOT_READINESS |
| INITIAL_T04_COHORT | 2_TO_3_REMOTE_STUDENTS_EXPLORATORY |
| CONVERSATIONAL_GUIDANCE | CONTRACT_NOT_YET_AUTHORIZED_FOR_IMPLEMENTATION |
| GEMINI | PAUSED |
| LIVE_LLM_GATE | PARTIAL |
| PRODUCTION_MODEL | UNDECIDED |
| M3_TO_M7 | NOT_AUTOMATICALLY_AUTHORIZED |
| Q021 | PARTIAL |

M2-C1 COMPLETE: integrated baseline selected and verified. M2-C2 COMPLETE: technical and applicable owner-review evidence assembled with limitations. M2-C3 PENDING: explicit Ganesan accept/defer decision. M2-C3 is the existing T05 acceptance task, not a second acceptance gate.

## Later capabilities and mandatory observation

Preserve M3 Personal Guidance Presentation, M4 Explore and M5 Decision Support with their frozen dependencies and separate authorization. Conversational work must not bypass or replace them. The guided journey remains primary; canonical Q&A remains governed knowledge and optional exploration. Deterministic authority, source/year/scope and uncertainty remain unchanged.

Conversational Guidance V1 is a separate contract-first workstream: CON-01 contract → CON-02 explicit implementation authorization → CON-03 bounded prototype → CON-04 technical/owner review. Its contract must preserve intent/authority routing, canonical reviewed guidance, deterministic authority for personal admission-critical results, UNKNOWN/refusal/escalation, provenance/source year/scope, compact bounded state/context, question/entity fidelity and Tamil-first delivery. Tanglish/English support needs explicit scope. Listing this workstream does not authorize its preparation or implementation.

LLM work is separately controlled: bounded integration/evaluation design → explicit authorization with named candidate and request/cost limits → mechanical/technical checks → owner quality review and explicit gate disposition. [Existing Live LLM findings](../experiments/live_llm_integration_gate_results_v2.md), including G03 intent/entity failure and G05 OUTPUT_VALIDATION_ERROR, remain. Gemini stays PAUSED, the gate PARTIAL and production model UNDECIDED. This amendment grants no student-facing AI, production RAG or live-call permission.

The target T04 observation follows clean integrated UI, separately authorized Conversational Guidance V1 capability, a separately authorized bounded LLM candidate, hosting readiness and owner mobile verification. Capabilities must be accepted and any applicable LLM/model gate decision explicit before inclusion. Ganesan must set a target observation window and review checkpoint when authorizing those dependencies. If readiness slips, report the delay and request a bounded alternative decision rather than silently deferring indefinitely or bypassing the chosen sequence. No date is invented here.

M6 integrates accepted M0–M5 capabilities and accepted CON/LLM capabilities if included, then assesses hosting readiness. It is not a catch-all feature milestone or automatic deployment. M7 is the later location for separately authorized temporary private hosting, owner mobile verification, initial 2–3 remote student observations and pilot-readiness evidence. Preserve frozen M7's 3–5-student pilot-preparation intent: the initial 2–3 form an exploratory cohort, not broad product validation. After reviewing findings, Ganesan decides whether more participants are required.

Reuse the [existing T04 procedure and privacy-conscious observation template](m2_one_journey_validation_plan_2026-10-03.md), tied to the exact later tested/deployed revision. OWNER_READY remains separate from STUDENT_VALIDATED. No hosting or participant execution is authorized by this record.

## Measurable READY_FOR_HOSTING criteria

Each criterion requires evidence at the exact candidate; listing criteria does not mark them passed:

- Exact integrated commit recorded and guided journey accepted for its scope.
- Conversational capability accepted if included; explicit LLM/model gate decision if LLM is included.
- Deterministic authority and uncertainty preserved; no critical misleading defect or weakened source/year/scope limitations.
- Applicable Tamil/mobile checks, offline tests and strict typecheck pass.
- Privacy/data-retention behavior documented and reviewed.
- HTTPS/private access method and participant access control approved.
- Access expiry, shutdown procedure and shutdown verification approved.
- Quoted cost and explicit cost ceiling approved.

READY_FOR_HOSTING is readiness evidence, not purchase/deployment permission. M7-H1 still requires explicit owner authorization. M3–M7 implementation remains separately authorized.

**NEXT_SINGLE_ACTION:** Ganesan explicitly accepts or defers bounded M2 at a67fc4c9ed24f7061631782cd63c839cf098cfe8, acknowledging mandatory later T04 and preserved evidence limitations.

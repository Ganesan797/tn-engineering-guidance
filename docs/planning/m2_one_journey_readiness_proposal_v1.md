# M2 One-Journey Readiness Proposal V1

**Prepared:** 2026-10-03. **Status at preparation:** REVIEW_PROPOSAL; `M2_STATUS = NOT_AUTHORIZED` then. **Subsequent decision:** Ganesan [authorized the bounded one-journey scope](m2_one_journey_authorization_decision_2026-10-03.md) on 2026-10-03. `LIVE_LLM_GATE = PARTIAL`. `FURTHER_GEMINI_EXECUTION = PAUSED`.

## Student outcome and boundary

Propose one bounded journey for a zero-knowledge student considering **first-year TNEA academic entry**. The student should understand how engineering admission works, receive a useful next action without entering marks, and, if they ask for personal cutoff/eligibility help, be asked only for information needed by the existing verified rule path. The journey can stop with a clear unknown or `NEEDS_REVIEW` outcome. It must not promise a seat, rank, admission probability, current counselling date, or personally applicable concession.

This proposal applies the frozen [Product Mission](../product/product_mission.md), [Student Journey](../product/student_journey_v1.md), [Student Input/Output](../product/student_input_output_v1.md), and [Implementation Plan M2](implementation_plan_v1.md). It selects one product path for review; it does not change those contracts or define a new milestone.

## Exact proposed student flow

| Step | Student sees or does | Information requested | Next state and authority |
| --- | --- | --- | --- |
| 1. Begin | Plain-language engineering orientation from reviewed A01–A07 V2; offer “How do I enter engineering?” | None | Awareness before a profile or college list. Existing M1 entry offers a beginner route. |
| 2. Understand route | B01 explains first-year TNEA alongside other routes; B04 explains registration, rank, choices, allotment and joining; B08 distinguishes cutoff from rank. | Ask only whether the student wants first-year TNEA academic help if the route is unclear. Retain a supplied Class 12 or diploma fact; diploma goes to B03/TNLEA rather than this path. | Canonical reviewed content with its 2026 year label and evidence. Do not treat every Tamil Nadu seat as TNEA. |
| 3. Choose next help | Offer either “What should I prepare?” (B05) or “Check my situation.” The student may leave with an official-source/document action. | No marks for the preparation route. For a personal check, ask the intended admission year and qualifying stream only when needed to select applicable rules. | When the intended year has no verified rules, give dated orientation and an official-source action, not a current-year personal decision. |
| 4. Progressively collect for a first-year academic personal check | Explain why the next detail matters; retain already supplied marks, board and history. | Ask only missing rule-relevant fields from the approved question-to-domain mapping. For a cutoff request, this includes the applicable Mathematics, Physics and Chemistry marks and whether improvement marks were used; if yes, the original marks/year may be needed. Eligibility can require further stream, nativity, community and document evidence. Unknown remains null, never false. | Map answers into the existing `StudentProfile` and request contracts. Do not present a teaching example as the student's result. Do not infer missing eligibility facts. |
| 5. Show the result or a bounded uncertainty | Present a trusted result only when the existing deterministic service establishes it. Otherwise explain the specific missing information or `NEEDS_REVIEW` state and one next action. Offer optional “why” and source detail. | Ask the next blocking question only if the student wants to continue. | Existing deterministic result, source checks and provenance are authoritative. No AI-written result can override them. |

This is one route through Stages 1–4 and 7. Stages 5–6 remain available in Product V1 but are not a required part of this bounded M2 proposal. The flow is a **paper design**, not a student-tested or implemented experience. The frozen 5–10-minute goal still needs actual student validation.

## Reuse and proposed M2 work

| Existing capability | Role in this journey | Readiness limit |
| --- | --- | --- |
| M1 entry and approved awareness pack; A01–A07 V2 and owner-accepted B01–B08 answers | Give useful orientation before asking for personal data. Serve reviewed guidance without a model call. | A01–A07 V2 and B01–B08 are content-direction/answer accepted, with source limitations and Tamil-equivalence/student validation pending. The new batches are documents, not wired into the product. |
| `StudentProfile`, eligibility rule executors and `GuidanceResult` | Keep unknown/null semantics, deterministic eligibility/cutoff behavior, missing fields and provenance. | The current backend contract is broad; it is not itself a student question order. G05's recorded cutoff/eligibility coupling remains unresolved. |
| API, guidance service, existing reference form and local pilot runtime | Provide an established call boundary and reference behavior for a future progressive input adapter. | The current form asks many fields upfront. Current seat/vacancy evidence is not sufficient for broad college recommendations. |
| Guidance Delivery Responsibility Model | Send familiar orientation to canonical content and personal calculations to the trusted engine; reserve AI for cases that need it after gate review. | The model is analytical guidance, not an implemented router or a change to the frozen Live LLM scenarios. |

If M2 is later authorized, the **bounded build** would be a progressive question flow, relevance/skip rules, unknown-preserving mapping to existing contracts, and clear explanation of why a question is needed. Existing validation and domain logic remain the authority. Do not expand this first slice into production RAG, a new admission rule engine, historical prediction, or a complete seven-stage product.

## Evidence still needed before an M2 authorization decision

1. **Approved question-to-domain mapping.** For this route, identify each proposed student question, the exact `StudentProfile`/request field and applicable D1 rule it serves, when it may be skipped, and the resulting unknown state. Resolve whether the current full eligibility evaluation makes a simple cutoff request ask for unrelated fields; the G05 failure alone does not answer that domain question.
2. **D0/D1 factual governance.** Confirm source owner, version, revalidation and applicability for the content selected for release. The 2026 TNEA brochure supports dated examples; 2027 rules are not verified. Resolve the two conflicting 2026 grievance windows before giving a fixed deadline. Current operational facts must come from the applicable notice. The missing D2/D4 facts can be omitted from this route rather than guessed.
3. **Student and language review.** Volunteer review of Tamil equivalence and a short test with actual zero-knowledge students must check understanding, retained context, unnecessary questions and the 5–10-minute value goal. Current paper walkthroughs do not supply that evidence.
4. **Milestone review.** The owner must review a bounded M2 authorization record using the frozen plan's mission, dependencies, data dependencies and risks. M0/M1 acceptance and this proposal do not authorize M2 automatically.

## Specific Live LLM Gate decision requested

The owner must explicitly decide **whether the partial Live LLM Gate blocks even a deterministic/canonical-only M2 progressive-input slice, or whether that bounded slice may be reviewed for separate M2 authorization while production LLM/AI-assisted guidance remains excluded and the gate stays PARTIAL**. The frozen implementation plan says core Product V1 correctness does not require an AI agent and M2 need not implement an LLM; this supports considering the limited slice, but does not itself grant permission.

If the owner instead requires a completed Live LLM Gate before any M2 work, the decision remains **HOLD**. Evidence still missing for gate completion includes correction and re-evaluation of G03 question/entity fidelity, a contract-valid G05 result followed by applicable evaluation, the nine unexecuted frozen scenarios, manual zero-knowledge guidance and Tamil/English review, uncertainty/security review, and a final owner decision against **G1** zero unsupported admission-critical claims, **G2** useful zero-knowledge progression, and **G3** unknown deterministic inputs staying unknown. G02/G04 passes and mechanical grounding/routing do not close these gaps. Any future live request requires separate authorization; this proposal schedules none.

**Recommendation at proposal time:** Consider only the bounded deterministic/canonical M2 slice after its question-to-domain and D0/D1 evidence is ready. Keep `LIVE_LLM_GATE = PARTIAL`, `FURTHER_GEMINI_EXECUTION = PAUSED`, and `M2_STATUS = NOT_AUTHORIZED` until an explicit decision is recorded. The later dated decision records that limited authorization; this proposal remains the paper design, not implementation evidence.

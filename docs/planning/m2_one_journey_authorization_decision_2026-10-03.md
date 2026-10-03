# M2 One-Journey Authorization Decision — 2026-10-03

**Decision owner:** Ganesan. **Decision status:** APPROVED_BOUNDED_SCOPE. **Execution status:** NOT_STARTED.

`M2_IMPLEMENTATION_AUTHORIZED = YES_BOUNDED_ONE_JOURNEY`

`M2_STATUS = AUTHORIZED_BOUNDED_ONE_JOURNEY_NOT_STARTED`

`MISSION_ALIGNMENT_PRECHECK = PASS_FOR_BOUNDED_SCOPE`

`M2_MILESTONE_ACCEPTED = NO`

`LIVE_LLM_GATE = PARTIAL`

`FURTHER_GEMINI_EXECUTION = PAUSED`

`PRODUCTION_RAG_IMPLEMENTATION_AUTHORIZED = NO`

## Authority and conflict check

This decision authorizes one bounded M2 journey under the frozen [Product Mission](../product/product_mission.md), [Student Journey V1](../product/student_journey_v1.md), [Student Input/Output V1](../product/student_input_output_v1.md), and [Implementation Plan V1](implementation_plan_v1.md). The [architecture addendum](../architecture/m0_ai_rag_architecture_addendum_v1.md) preserves deterministic admission authority. The [Guidance Delivery Responsibility Model](../product/guidance_delivery_responsibility_model_v1.md) distinguishes canonical guidance from AI-assisted guidance.

**Mission precheck:** This scope gives awareness before marks, uses Tamil for the intended student, asks progressively, preserves uncertainty and leads to a next action. M0 and M1 are accepted dependencies. The current broad form and the missing question-to-domain mapping are the specific M2 problems. Reuse of the existing engine preserves source and admission authority; the 5–10-minute goal still requires real student validation. These facts support the bounded precheck, not milestone completion.

The frozen implementation plan's M2 section defines **Progressive Student Input**, requires M0/M1 and an approved question-to-domain mapping, and says M2 does not require an LLM. No reviewed frozen document makes M2 authorization conditional on a completed Live LLM Gate. The [September 30 live experiment decision](../experiments/live_llm_integration_gate_results_v2.md) and the [October 3 readiness proposal](m2_one_journey_readiness_proposal_v1.md) recorded M2 as **not authorized at those times**. Their gate findings and evidence gaps remain valid; their earlier authorization state is superseded by this later, explicit owner decision for this scope only. No frozen contract or scenario is rewritten.

**Gate boundary chosen by the owner:** The `PARTIAL` Live LLM Gate does **not** block this one journey implemented with reviewed/canonical content and existing deterministic capabilities. It **does** continue to block production LLM or AI-assisted guidance. G1 (no unsupported admission-critical claims), G2 (useful zero-knowledge progression) and G3 (unknown deterministic inputs stay unknown) remain the live gate's acceptance criteria. No further Gemini execution is authorized by this decision.

## Authorized student journey

1. Begin with understandable engineering awareness in Tamil for a zero-knowledge student. Marks are not required for this value. Preserve a direct-entry route for a student who already knows the help they need.
2. Explain the first-year TNEA pathway using applicable reviewed guidance, including its scope among engineering routes. The student can leave with a useful official-source or preparation action without a personal check.
3. Offer an **optional** personal check. Ask only the next rule-relevant question, explain why it matters where helpful, reuse answers already supplied, skip irrelevant questions, and preserve “I don't know” as unknown/null rather than false.
4. When existing deterministic, sourced services support a result, present that result clearly. Otherwise explain `UNKNOWN` or `NEEDS_REVIEW`, identify the missing fact or evidence, and give one useful next action. Separate verified personal results from things worth checking.
5. Aim for useful guidance within **5–10 minutes**. This is a product goal to test with students, not a performance result already observed.

The [one-journey proposal](m2_one_journey_readiness_proposal_v1.md) supplies the paper flow. The M2 build is limited to a progressive question flow, relevance/skip behavior, unknown-preserving mapping to the existing domain contracts, and student-friendly next-step presentation. It may reuse the accepted M1 awareness pack, [A01–A07 V2](../content/awareness/student_pov_awareness_batch_a01_a07_v2.md) and [B01–B08](../content/admission/student_pov_admission_batch_int05_int08_v1.md) where applicable. Their content-direction/answer acceptance is **not** final Tamil-equivalence or factual release approval; only sufficiently governed wording may be presented as verified current-year fact.

## Boundaries and remaining gates

- Deterministic services and governed sources alone decide eligibility, cutoff, missing fields, seat facts and other admission-critical outputs. No frontend flow may duplicate or override those rules, infer a missing answer, turn a historical observation into a prediction, or call an LLM to decide an admission result.
- No production RAG, model calls, new admission rules, unsupported 2027 claims, broad college expansion, or 20–50-turn chat requirement enters this authorization. Gemini remains paused; the Live LLM Gate remains partial. M3 and later milestones are not authorized.
- Before implementing rule-dependent questions, prepare and review the **question-to-domain mapping** required by the frozen M2 plan: precise student wording, domain field, reason/rule, skip condition, retained prior answers and unknown behavior. The unresolved G05 cutoff/eligibility coupling must be assessed against the existing contract; a failed structured model response is not proof of a domain defect.
- D0 source governance and D1 applicable rule evidence govern factual content. The 2026 admission evidence cannot be silently reused as 2027 advice. Current deadlines, contested grievance windows, institution-specific terms and personal exceptions remain conditional until the applicable authority is verified.
- Volunteer Tamil-equivalence and final factual release review remain pending for A01–A07 V2 and B01–B08. Actual student validation of the 5–10-minute goal and the frozen milestone completion reviews remain pending. Implementation authorization is **not** milestone acceptance or release approval.

## Next implementation task

**Task 2, separately executed:** Begin the bounded M2 journey by preparing the exact question-to-domain/rule mapping and implementing only the corresponding progressive first-year TNEA path over existing content, entry and deterministic services. Retain direct entry, supplied answers and explicit unknowns. Verify the path with focused zero-knowledge, direct-entry, null/unknown and deterministic-authority tests, the existing suite and strict typecheck. No live LLM call or expansion beyond this authorization.

This decision records authorization only. Task 2 has not begun in this documentation change.

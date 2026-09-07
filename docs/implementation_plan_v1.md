# Implementation Plan V1

`STATUS = FROZEN_V1`

`IMPLEMENTATION_AUTHORIZED = NO`

This document translates the frozen product direction and approved Technical Gap Mapping into ordered implementation milestones. It does not itself authorize implementation.

## Product Authority

Authority order:

1. `docs/product_mission.md`
2. `docs/student_journey_v1.md`
3. `docs/student_input_output_v1.md`
4. `docs/technical_gap_mapping_v1.md`
5. this implementation plan

`MISSION_OVER_REUSE = ACTIVE`

Existing Engineering Reference MVP v0 code is reused only when it helps Product V1. It may be adapted, replaced, or dropped when mission alignment requires it. Proven deterministic domain logic remains protected unless a concrete product or technical reason and equivalent verification justify replacement.

## Roles and Governance

`PROJECT_OWNER = Ganesan`

`OWNER_ROLES = [Product Owner, Engineer Reviewer, Student Advocate]`

### Owner Engineering Review

The owner asks:

- is reuse justified?
- is the architecture simple?
- is domain logic isolated?
- are unknown states preserved?
- are facts sourced?
- are tests sufficient?
- was unnecessary complexity introduced?
- does implementation match the approved scope?

`OWNER_ENGINEERING_REVIEW = PASS / FAIL`

### Owner Student Review

The owner asks:

- can a zero-knowledge student understand it?
- are unnecessary questions avoided?
- does the student understand the result?
- are Verified Personal Results distinct from Things Worth Checking?
- is uncertainty understandable?
- does the experience help the student think further?
- is the next action clear?

`OWNER_STUDENT_REVIEW = PASS / FAIL`

A student-facing milestone is not accepted merely because code compiles or tests pass. If `OWNER_STUDENT_REVIEW = FAIL`, the milestone remains incomplete.

### ChatGPT Role

`CHATGPT_ROLE = PRODUCT_AND_TECHNICAL_REVIEW_PARTNER`

Responsibilities:

- review Codex scope proposals
- explain technical changes in plain language
- challenge scope drift
- protect the Golden Product Mission
- check unsupported assumptions
- support Engineer and Student reviews
- recommend next authorization only after review gates pass

### Codex Role

`CODEX_ROLE = IMPLEMENTER`

Codex may inspect, implement only authorized milestone scope, run tests, and report results.

Codex may not redefine product direction, add unsupported domain assumptions, authorize future milestones, or treat its own `COMPLETE` status as product acceptance.

## AI / Agent Integration Boundary

Core Product V1 correctness does not require an AI agent.

Allowed future roles may include conversation/routing, explanation, translation, content retrieval, and tool orchestration.

AI, LLMs, and agents must not decide or invent:

- eligibility
- cutoff
- vacancy
- rank
- admission outcome
- unsupported scheme applicability
- admission probability

Trusted deterministic domain logic remains authoritative.

AI, LLM, or agent output must not convert informational, generated, translated, or retrieved content into a Verified Personal Result. Verified Personal Results must originate from an authorized deterministic and evidence-backed path.

`AI_AGENT_CORE_DEPENDENCY = NO`

`LLM_IN_CORE_DECISION_PATH = NO`

`WHATSAPP_AGENT = DEFER`

Detailed agent architecture is not part of this plan.

## Product V1 Language Policy

`PRIMARY_LANGUAGE = TAMIL`

`SECONDARY_LANGUAGE = ENGLISH`

`BILINGUAL_SUPPORT = YES`

`USER_LANGUAGE_SWITCH = YES`

Product V1 uses one trusted guidance/domain model with separate student-facing language presentations. Tamil is the primary language for the target student experience, and English is also supported.

Eligibility, domain, and admission logic must not be duplicated by language. The semantic/content boundary must allow the same trusted meaning to be rendered in Tamil or English.

Tamil mode should prioritize simple, natural, student-understandable Tamil. Necessary established terms and acronyms such as TNEA, CSE, and ECE may remain where useful, with simple explanations. Tamil and English need not be displayed simultaneously on every screen.

Exact Tamil wording remains a reviewed content task and is not invented or frozen by this planning update.

## Parallel Workstreams

### A. Product / Software Workstream

Build the frozen student experience over the trusted core. This workstream owns student semantics, structured content delivery, journey routing, progressive input, presentation, exploration, decision-support adaptation, and product-flow verification.

### B. Data / Evidence Workstream

Acquire and maintain authoritative current-year content and data, including official TNEA rules, current counselling process, scheme/support facts, current-year seat facts, document requirements, dates, college/programme metadata, and guidance-content provenance.

Every factual asset requires appropriate authoritative provenance. Invented facts are prohibited. Missing dynamic data must not unnecessarily block awareness-first student value.

## Ordered Product / Software Milestones

The sequence is ordered by dependency and student value, not a rigid calendar. Every milestone remains unauthorized until its individual authorization record is approved.

### M0 — Student Semantic + Content Foundation

**Student problem:** The reference MVP exposes hard-coded English and backend semantics and lacks a reusable guidance-content boundary.

**Student outcome:** Future guidance can present simple student meaning without changing trusted domain logic and can later support Tamil safely.

**REUSE:** Domain outputs, eligibility engine, internal `GuidanceResult`, provenance, and API/service boundaries where useful.

**ADAPT:** Internal outcome/result consumption at the student-facing boundary.

**BUILD:** Student semantic/view-model boundary; centralized student message/content catalogue; versioned structured awareness and TNEA guidance-content foundation; content version/provenance metadata; mappings from internal outcomes to student-safe meanings.

**REPLACE/DROP:** No student-facing dependency on mechanically generated backend labels.

**DEFER:** Exact Tamil copy, full UI redesign, WhatsApp, AI agents, and recommendation probability.

**Dependencies:** Approved Product V1 documents. M0 technical and semantic scaffolding may proceed before D0 is fully complete. Factual student guidance content must not be accepted as production-ready or pilot-ready until the applicable D0 source-governance requirements pass.

**Data dependencies:** Enough reviewed source metadata and initial non-time-sensitive awareness content to validate the model. Dynamic seat data is not required.

**Risks:** Semantic drift from trusted results, hard-coded English moving into a new layer, stale content, or premature architecture complexity.

### M1 — Awareness-First Entry + Direct Entry

**Student problem:** The current page begins with a backend-shaped form and assumes one linear flow.

**Student outcome:** A zero-knowledge student can start from the beginning, while informed students can enter directly at relevant needs.

**REUSE:** Mobile-web/server infrastructure and trusted service entry points where useful.

**ADAPT:** Product navigation and existing shell.

**BUILD:** Entry routing; awareness-first path; direct entry for cutoff/eligibility and counselling help; simple next-direction model.

**REPLACE/DROP:** Linear form → engine → result assumption.

**DEFER:** Detailed visual polish and additional channels.

**Dependencies:** M0 semantic/content foundation.

**Data dependencies:** D0; reviewed awareness content. Full current-year operational data is not required for entry.

**Risks:** Forcing every student through every stage or offering direct paths that bypass necessary understanding.

### M2 — Progressive Student Input

**Student problem:** The current form exposes nearly the full backend profile upfront.

**Student outcome:** Students are asked only what is needed for the next useful guidance step.

**REUSE:** `StudentProfile` as a trusted backend contract, null-versus-false semantics, validation, and domain services.

**ADAPT:** Request construction and validation feedback.

**BUILD:** Progressive question flow; relevance/skip handling; unknown/unanswered handling; question explanation; mapping progressively collected input into trusted contracts.

**REPLACE/DROP:** Large backend-shaped student form.

**DEFER:** Unfrozen interest taxonomy or unrelated preference fields.

**Dependencies:** M0 and M1; approved question-to-domain mapping before implementation.

**Data dependencies:** Applicable versioned rules from D1 for deciding which information is genuinely required.

**Risks:** Duplicating eligibility rules in UI, asking unnecessary questions, or coercing unknown to false.

### M3 — Personal Guidance Presentation

**Student problem:** Results expose internal enums, rule identifiers, and technical evidence too directly.

**Student outcome:** Eligibility, cutoff, uncertainty, and next steps are understandable without internal terminology.

**REUSE:** Deterministic results, checks, blockers, seat semantics, and provenance.

**ADAPT:** Internal `GuidanceResult`, current rendering, and error presentation.

**BUILD:** Level 1 Simple Guidance; Level 2 Explain Why; Level 3 Evidence; structurally distinct Verified Personal Results and Things Worth Checking; uncertainty-friendly wording; next action.

**REPLACE/DROP:** Raw technical result presentation where substantial adaptation is less simple.

**DEFER:** Unsupported scheme personalization, predictions, and final Tamil copy.

**Dependencies:** M0–M2. By M3 acceptance, representative Level 1 student guidance must be manually reviewed in simple Tamil to verify that the semantic/content architecture genuinely supports the target student experience. This does not require complete Tamil copy at M3.

**Data dependencies:** D1 for applicable rules; D2 for any Things Worth Checking content included. Missing seat facts remain unknown.

**Risks:** Turning an awareness prompt into entitlement, hiding uncertainty, or changing domain meaning in presentation.

### M4 — Explore / Think-Further

**Student problem:** The reference MVP answers the immediate admission question but does not safely broaden student understanding.

**Student outcome:** Students can explore branches and options they may not know to ask about.

**REUSE:** Reviewed pilot identities and suitable evidence/content foundations.

**ADAPT:** Existing branch taxonomy only after content and sourcing review.

**BUILD:** Student-interest/exploration capability; branch-awareness content; related-option discovery; safe Think-Further prompts.

**REPLACE/DROP:** Any unsourced internal taxonomy presentation that cannot meet student-content standards.

**DEFER:** Exact interest questions, taxonomy, matching semantics, and final interaction design until separately specified within the milestone; rankings and predictions remain prohibited.

**Dependencies:** M0, M1, and M3; M2 only where personalization is used. Before M4 implementation authorization, require:

`INTEREST_INPUT_CONTRACT = REVIEWED`

`EXPLORATION_TAXONOMY = REVIEWED`

`MATCHING_SEMANTICS = REVIEWED`

These items are not designed by this plan. Codex must not invent these semantics during M4 implementation.

**Data dependencies:** D0 and relevant parts of D2/D3. General exploration can proceed before dynamic seat evidence.

**Risks:** Branch-superiority claims, inferred preferences, rankings, or unsourced recommendations.

### M5 — Decision Support Adaptation

**Student problem:** Proven candidate/ordering behavior is presented through the reference MVP's technical and linear interaction.

**Student outcome:** Counselling-stage students can structure and understand choices safely.

**REUSE:** Deterministic candidate generation, explicit branch ordering, seat semantics, snapshot handling, and provenance.

**ADAPT:** Direct counselling entry; student-friendly evidence; choice explanation; preference-led ordering presentation; current evidence visibility.

**BUILD:** Only the product-facing workflow and next actions needed to use those capabilities coherently.

**REPLACE/DROP:** Current interaction assumptions that organize the whole journey around branch ordering or immediate candidate output.

**DEFER:** Dream/Target/Safe, admission probability, guaranteed backup, and subjective college ranking.

**Dependencies:** M0–M3; relevant M4 exploration links.

**Data dependencies:** D3 for richer metadata and D4 for current operational facts when displayed. The capability must still express unknown evidence honestly.

**Risks:** Implied admission chance, fabricated vacancy, historical evidence becoming prediction, or system preference overriding student preference.

### M6 — End-to-End Product V1

M6 is an integration milestone, not a catch-all feature milestone. Major new product capabilities discovered during M6 require separate review and authorization and must not be silently absorbed into M6.

**Student problem:** Individually improved capabilities do not yet form one coherent Product V1 journey.

**Student outcome:** Scenarios A, B, and C work through a coherent mobile-web experience.

**REUSE:** Trusted domain/application assets and accepted M0–M5 capabilities.

**ADAPT:** Cross-stage transitions and shared presentation/state behavior.

**BUILD:** End-to-end integration; product-flow tests; scenario A/B/C automation or support where practical.

**REPLACE/DROP:** Remaining MVP v0 interaction assumptions that conflict with the frozen journey.

**DEFER:** Public production deployment and non-core channels.

**Dependencies:** Accepted M0–M5 milestones.

**Data dependencies:** Minimum approved content/evidence required by each included flow; absent dynamic facts remain explicit.

**Risks:** Late integration drift, duplicated state/domain behavior, or passing technical tests without student comprehension.

### M7 — Pilot Readiness

**Student problem:** A technically coherent flow is not automatically ready for real students.

**Student outcome:** Product V1 is ready for small real-student usability validation.

**REUSE:** Accepted M0–M6 product and test assets.

**ADAPT:** Findings from manual mobile, language, privacy, and owner reviews.

**BUILD:** Pilot runbook and 3–5 real-student pilot preparation.

**REPLACE/DROP:** Any flow or wording that fails student/mission review.

**DEFER:** Full public production deployment unless separately authorized.

**Dependencies:** M6 acceptance; full relevant Tamil content review; native-language readiness completion; manual mobile review; owner reviews; privacy/safe-sharing review where relevant.

**Data dependencies:** Current-year critical facts used by the pilot must be checked through D1–D4.

**Risks:** Testing with stale facts, insufficient Tamil comprehension, privacy issues, or treating pilot readiness as production readiness.

## Shareable Summary

`SHAREABLE_GUIDANCE_SUMMARY = BUILD`

`PRIORITY = AFTER_CORE_STUDENT_FLOW`

It must not delay M0–M3. WhatsApp sharing and reach may use a reviewed summary later.

## Parallel Data / Evidence Milestones

No data is ingested by this plan. Every milestone prohibits invented facts and requires authoritative provenance.

### D0 — Guidance Content Source Governance

- Define review, version, provenance, expiry/revalidation, and ownership rules for guidance content.
- **Blocks:** Acceptance of factual student guidance content as production-ready or pilot-ready, but not M0 technical/semantic scaffolding.
- **Can proceed without completion:** Internal semantic contracts, content infrastructure, and non-factual prototypes.

### D1 — Current TNEA Rules / Process Evidence

- Validate current rules, process explanations, and source references used by awareness and personal guidance.
- **Blocks:** Release of current factual TNEA explanations and any new rule-dependent question/result.
- **Can proceed without completion:** Generic engineering awareness and reuse of already frozen, sourced domain behavior.

### D2 — Scheme / Support Evidence

- Acquire current evidence for schemes, support, certificates, concessions, and applicability boundaries.
- **Blocks:** Inclusion of a scheme as a Verified Personal Result or Things Worth Checking item.
- **Can proceed without completion:** Eligibility/cutoff presentation and exploration that does not mention unsupported opportunities.

### D3 — College / Programme Metadata Enrichment

- Acquire authoritative metadata needed for student exploration or comparison.
- **Blocks:** Claims or preference factors depending on missing metadata.
- **Can proceed without completion:** Existing five-college identity/programme pilot and branch-only deterministic capability.

### D4 — Current Seat / Counselling Operational Facts

- Acquire current seat facts, dates, document requirements, counselling actions, and operational source details.
- **Blocks:** Presentation of those facts as current and authoritative.
- **Can proceed without completion:** Awareness, eligibility, cutoff, branch exploration, and unknown-preserving decision support.

### D5 — Historical Evidence Methodology

- Define interpretation and provenance only if separately authorized.
- **Blocks:** Any historical comparison or context feature.
- **Can proceed without completion:** All initial Product V1 milestones that omit historical claims.
- **Status:** DEFER unless separately authorized; no prediction semantics are implied.

## Milestone Authorization Template

```text
MILESTONE_ID =
STUDENT_PROBLEM =
STUDENT_OUTCOME =
REUSE =
ADAPT =
BUILD =
REPLACE_DROP =
DEFER =
DEPENDENCIES =
DATA_DEPENDENCIES =
RISKS =

MISSION_ALIGNMENT_PRECHECK = PASS / FAIL
IMPLEMENTATION_AUTHORIZED = YES / NO
```

Only one milestone should be authorized at a time unless explicitly approved.

## Milestone Completion Gate

Every student-facing milestone requires:

```text
CODEX_TECHNICAL_DOD = PASS
MISSION_ALIGNMENT_DOD = PASS
OWNER_ENGINEERING_REVIEW = PASS
OWNER_STUDENT_REVIEW = PASS
RELEVANT_SCENARIO_REVIEW = PASS
DOMAIN_ASSUMPTIONS_MADE = NONE
```

Only then:

```text
MILESTONE_ACCEPTED = YES
NEXT_MILESTONE_AUTHORIZATION = ALLOWED_FOR_REVIEW
```

The next milestone is not automatically authorized.

## Technical Definition of Done Template

- implementation matches authorized scope
- relevant tests added
- existing regression tests remain green
- strict TypeScript check passes
- no unintended domain or API changes
- null/unknown semantics preserved
- provenance preserved where relevant
- no unsupported assumptions
- no unnecessary architecture rewrite
- deterministic behavior remains deterministic

## Mission Alignment Definition of Done Template

- student outcome defined before implementation
- zero-knowledge path preserved where relevant
- no backend terminology leakage into Level 1 student guidance
- progressive input principles preserved
- Verified Personal Results versus Things Worth Checking preserved
- uncertainty understandable
- Think-Further Principle preserved where relevant
- next direction clear
- native-language-ready boundary preserved
- no unsupported ranking or probability
- Booklet-First Mission preserved

## Scenario Review Mapping

| Scenario | Primary milestone relevance |
|---|---|
| A — Zero-Knowledge Student | M1, M2, M3, M4, M6, M7 |
| B — Cutoff/Eligibility Direct Entry | M1, M2, M3, M6, M7 |
| C — Counselling Choice Help | M1, M3, M5, M6, M7 |

Not every milestone requires all scenarios. Authorization and completion records must identify the relevant scenario review.

## Replace / Drop Discipline

Existing MVP v0 behavior may be replaced or dropped when Product V1 becomes simpler or more mission-aligned as a result. Any replacement must explain why it is needed, preserve proven tests where still semantically relevant, add equivalent verification for replaced behavior, and avoid rewriting deterministic domain logic unless justified.

## Scope Control — Explicitly Deferred

- WhatsApp conversational bot
- LLM/RAG guidance delivery
- admission probability
- Dream/Target/Safe semantics
- subjective college ranking or tiering
- unsupported historical cutoff prediction
- broad TNEA coverage
- final visual polish
- production-scale infrastructure
- elaborate authentication or user accounts
- recommendation AI
- agent-based admission decisions

## Plan Review Status

`IMPLEMENTATION_PLAN_V1_STATUS = FROZEN_V1`

`IMPLEMENTATION_PLAN_V1_REVIEW = PASS`

`IMPLEMENTATION_AUTHORIZED = NO`

`M0_IMPLEMENTATION_AUTHORIZED = NO`

Freezing this reviewed plan does not authorize implementation. M0 requires separate explicit authorization.

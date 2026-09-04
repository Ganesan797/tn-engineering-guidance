# Technical Gap Mapping V1

`TECHNICAL_GAP_MAPPING_STATUS = APPROVED_V1`

`IMPLEMENTATION_PLAN_V1 = NOT_CREATED`

`IMPLEMENTATION_AUTHORIZED = NO`

Completion of this gap mapping does not authorize implementation. This document compares the actual Engineering Reference MVP v0 repository with the frozen Golden Product Mission, Student Journey V1, and Student Input & Output V1.

## Mission-Over-Reuse Principle

Engineering Reference MVP v0 is an engineering asset and source of validated knowledge, but it is not a constraint on Product V1.

Priority order:

1. Golden Product Mission
2. Frozen Student Journey V1
3. Student Input & Output V1
4. Simplicity, trustworthiness, and maintainability of Product V1
5. Reuse of existing implementation

Existing implementation should be reused only when it remains aligned with these priorities. Existing components may be **ADAPTED**, **REPLACED**, or **DROPPED** when retaining them would distort the frozen student journey, expose unnecessary backend complexity, create unnecessary implementation complexity, or otherwise reduce mission alignment.

Previous engineering effort, test count, or implementation completeness alone is not justification for reuse.

Conversely, proven deterministic admission and domain logic must not be rewritten casually. Replacing such logic requires a concrete product or technical reason and equivalent verification coverage.

## Classification

- **REUSE:** Existing capability is technically suitable and aligned enough to preserve.
- **ADAPT:** Existing capability is useful but needs modification at a defined boundary.
- **BUILD:** Required capability does not meaningfully exist.
- **REPLACE/DROP:** An existing MVP v0 capability or interaction exists, but retaining it would constrain or conflict with Product V1 and it should therefore not be treated as a required foundation.
- **DEFER:** Not required for the initial redesigned experience or explicitly unauthorized.

## Current MVP Architecture

| Layer | Responsibility | Important files | Input | Output/dependencies | Isolation finding |
|---|---|---|---|---|---|
| Persisted pilot evidence | Stores source registry, five colleges, programmes, branch taxonomy, and frozen eligibility references | `data/sources.csv`, `data/colleges.csv`, `data/programmes.csv`, `data/branches.csv`, `data/reference/tnea_2026_eligibility.csv` | Versioned source-backed rows | CSV evidence for ingestion/rules | Data is separate from UI; cutoff and canonical eligibility CSV schemas currently have no rows. |
| Pilot ingestion | Parses and validates 2026 colleges/programmes, exact mappings, provenance, duplicates, and conflicts | `src/ingestion/csv.ts`, `src/ingestion/pilot-data.ts` | Persisted CSV strings and registered source IDs | `PilotDataRegistry` | Appropriately isolated and reusable. |
| Seat snapshot store | Validates and appends stage-specific seat facts without overwriting snapshots | `src/ingestion/snapshot-store.ts`, `src/domain/admission-seat-fact.ts` | `AdmissionSeatFactSnapshot` | Immutable snapshot access | Appropriately isolated; no authoritative real seat facts are currently loaded. |
| Domain contracts | Defines 2026 types, enums, null semantics, and validation | `src/domain/constants.ts`, `enums.ts`, `models.ts`, `validation.ts` | Structured values | Validated domain objects | Independent of presentation. |
| Eligibility and cutoff | Executes ELG001–ELG032, produces sourced checks, cutoff, missing fields, and conservative aggregation | `src/domain/rules.ts`, `src/domain/eligibility.ts` | `StudentProfile`, `EligibilityEvaluationRequest` | `EligibilityResult` | Deterministic logic is isolated from UI and should be preserved. |
| Candidate generation | Runs eligibility, selects a snapshot, filters canonical programmes, applies seat evidence, preserves unknowns and provenance | `src/recommendation/foundation.ts` | Profile, context, registry, snapshots | `RecommendationResult` | Deterministic and presentation-independent. |
| Choice ordering | Orders by explicit branch preference with a disclosed stable canonical tie-breaker | `src/recommendation/choice-ordering.ts` | Candidates and explicit preferences | `OrderedChoice[]` | No subjective ranking or prediction. |
| Guidance orchestration | Composes eligibility, candidates, evidence, ordering, and aggregate provenance | `src/application/guidance.ts` | `GuidanceRequest`, dependencies | `GuidanceResult` | Thin application boundary; domain logic is delegated. |
| External adapter | Validates JSON shape/enums/context and returns safe success/error JSON | `src/api/guidance-api.ts` | JSON request | `GuidanceApiResponse` | Reusable channel-independent boundary, though request shape mirrors backend contracts. |
| Student UI | Renders one large HTML form and raw-ish result details; delegates submission to API | `src/ui/student-guidance.ts` | `GuidanceRequest`, API response | Responsive HTML | Domain logic is not duplicated, but student experience is backend-shaped. |
| Demo runtime | Loads persisted CSVs, creates an empty evidence snapshot, serves the UI, and supplies fixed test/demo profiles | `src/application/pilot-runtime.ts`, `src/demo/scenarios.ts`, `scripts/mvp-server.mjs` | Repository data and HTTP form values | Runnable local MVP | Suitable as engineering/demo infrastructure, not the target product journey. |

Actual flow:

`HTML form → form-to-GuidanceRequest mapping → JSON API validation → Guidance service → eligibility/rules → canonical candidate generation + snapshot evidence → branch ordering → GuidanceResult + provenance → HTML rendering`

## Gap Matrix

| Capability | Current state | Target need | Classification | Existing assets | Gap | Priority |
|---|---|---|---|---|---|---|
| Deterministic eligibility | All 32 frozen rules execute with sourced checks | Trusted factual result | REUSE | `src/domain/rules.ts` | None at engine level | Protect |
| Cutoff calculation | Deterministic when supported inputs exist | Simple student cutoff result | REUSE | `rules.ts`, `EligibilityResult` | Presentation needs adaptation separately | Protect |
| Conservative uncertainty | Explicit `NEEDS_REVIEW`, blocking fields, null distinct from false | Preserve internally; explain simply | REUSE | domain, API, tests | Student wording is technical | Protect |
| Canonical identifiers | `tnea_college_code + branch_id` joins | Stable evidence-backed programme identity | REUSE | ingestion/recommendation | Internal identifiers should usually be hidden in Level 1 | Protect |
| Unmapped programmes | 61 retained and excluded from candidates | No inferred mappings | REUSE | `PilotDataRegistry`, tests | None | Protect |
| Seat fact semantics | Intake/current/quota vacancy separated and validated | Trustworthy current evidence | REUSE | seat model/store | Real 2026 facts absent | Protect |
| Vacancy uncertainty | Missing evidence becomes `UNKNOWN_OR_UNPUBLISHED`, never zero | Plain-language uncertainty | REUSE | recommendation foundation | UI terminology needs ADAPT | High |
| Provenance | Rule, college, programme, and fact references survive result | Optional Level 3 evidence | REUSE | domain/recommendation/guidance | Source labels lack student-oriented document metadata in output | Medium |
| Candidate generation | Eligibility-first, canonical-only and deterministic | Evidence-supported decision aid invoked when Product V1 requires it | REUSE | `foundation.ts` | Product V1, not this capability, decides when it runs | High |
| Branch ordering | Explicit preferences only; deterministic | Decision-support utility | REUSE | `choice-ordering.ts` | Must not organize the overall student journey | High |
| GuidanceResult | Composes factual result, choices, evidence, provenance | Internal trusted result feeding student semantics | REUSE/ADAPT | `application/guidance.ts` | Not automatically the permanent Product V1 presentation contract | High |
| JSON API | Shape validation, safe errors, domain delegation | Channel-independent trusted service | REUSE/ADAPT | `api/guidance-api.ts` | Purpose-specific interfaces may be added if progressive guidance requires them | Medium |
| Pilot ingestion | Loads 5 colleges/79 programmes/18 mappings | Initial pilot evidence | REUSE | ingestion/runtime/data | Coverage remains intentionally narrow | Protect |
| Responsive/mobile web infrastructure | Framework-free responsive HTML, server, and API delegation | Useful mobile-web foundation where aligned | REUSE/ADAPT | `student-guidance.ts`, MVP server | Preserve only useful infrastructure, not current interaction assumptions | High |
| Backend-shaped large form | Nearly the full domain profile is exposed upfront | Progressive minimum-trustworthy input | REPLACE | `student-guidance.ts` | Must not constrain Product V1 | Highest |
| Raw technical result presentation | Raw outcomes, codes, identifiers, and source references are displayed | Simple semantic output with optional explanation/evidence | ADAPT substantially or REPLACE | Current renderer | Choose the simpler mission-aligned boundary during planning | Highest |
| Linear form → engine → result assumption | Single interaction path | Guided and direct-entry journeys with exploration and next actions | DROP | Current UI/demo flow | Product V1 must not inherit this assumption | Highest |
| Progressive input | All profile fields appear upfront | Ask minimum trustworthy information when relevant | BUILD | Existing request mapper can be reused behind it | No journey state/question routing exists | Highest |
| Direct-entry paths | Demo scenario links, not product journeys | Guided start plus cutoff, exploration, and counselling entry | BUILD | API/service callable independently | No product navigation or entry routing | Highest |
| Guidance before data | None; page starts with form | Awareness value before marks/profile | BUILD | None in runtime UI | No content delivery model | Highest |
| Level 1 student guidance | Status and cutoff rendered, but raw enum labels remain | Immediate simple meaning and next action | ADAPT | `GuidanceResult`, renderer | Needs semantic copy/view mapping | Highest |
| Level 2 explanation | Checks and reasons exposed in details | Optional plain-language “why” | ADAPT | sourced checks and ordering explanations | Raw rule IDs/reason codes leak | High |
| Level 3 evidence | Source IDs/pages shown | Optional understandable authoritative evidence | ADAPT | provenance arrays | Map IDs to source names/documents/dates/links where available | Medium |
| Verified vs worth checking | Verified engine output exists; second class absent | Clearly separated output classes | BUILD | Eligibility/fact outputs support verified class | No safe opportunity-content model | High |
| Engineering/TNEA awareness | No application content | Stages 1–2 orientation | BUILD | Product docs; source registry | Add versioned structured guidance content, not AI/RAG initially | Highest |
| Branch exploration | Branch CSV has five internal taxonomy rows | Student-oriented branch discovery | ADAPT | `data/branches.csv` | Content breadth, sourcing, and student language need review | High |
| College exploration | Programme identities shown only as candidates | Exploration independent of recommendation | BUILD | pilot colleges/programmes | No exploration model or student-oriented metadata | Medium |
| Think-Further prompts | No safe prompt/opportunity system | Relevant questions and possibilities | BUILD | Product contract only | Requires structured sourced/qualified content and applicability boundaries | High |
| Next actions | Missing fields appear; no consistent action contract | Every interaction gives direction | BUILD | blocking fields can inform actions | No student-facing next-action model | Highest |
| Native-language foundation | English strings embedded in renderer | Centralized translatable semantic messages | BUILD | Domain outputs are structured | No message catalogue/content separation/localization interface | High |
| Exact Tamil copy | Not present and explicitly unfrozen | Downstream reviewed copy | DEFER | None | Requires language/content review | Deferred |
| Mobile web redesign | Existing page is responsive but backend-shaped | Frozen mobile-first journey | ADAPT | framework-free server/UI/API | Interaction and information architecture must change | Highest |
| WhatsApp link/share | No share output | Initial reach/share channel | BUILD | Channel-independent service helps later | No safe shareable summary/link capability | Medium after core flow |
| Shareable guidance summary | No dedicated representation | Student-safe portable summary | BUILD | Internal guidance output | `PRIORITY = AFTER_CORE_STUDENT_FLOW`; needs semantic summary and privacy review | Later |
| WhatsApp conversational guidance | None | Future channel reusing trusted layers | DEFER | API/service separation is favorable | Explicitly future; no separate admission logic allowed | Deferred |
| Current-year seat facts | No real facts persisted; empty demo snapshot | Current sourced facts when published | BUILD in parallel DATA/EVIDENCE WORKSTREAM | Schema/store/validation = REUSE | Software changes only where consumption/presentation requires them | Data-dependent |
| Historical cutoff interpretation | Empty `cutoffs.csv`; no prediction | Separately reviewed context if later authorized | DEFER | Schema header only | Methodology and evidence not frozen | Deferred |
| Location/institution type | Not authoritative in current model | Only if later sourced and authorized | DEFER | None | Data and semantics absent | Deferred |
| Scheme/support content | No structured content or verified applicability layer | Things Worth Checking and later verified facts | BUILD | Eligibility rules cover only their frozen scope | Needs sourced content taxonomy and safe wording | High |
| Counselling orientation/current actions | Snapshot context exists technically | Simple process content and current official next steps | BUILD | snapshot IDs/stages | No student content; dates/process data absent | High/data-dependent |
| Deterministic tests | 106 tests across domain through smoke/UI | Preserve regression confidence | REUSE | `tests/domain`, ingestion, recommendation, application, API | None for existing behavior | Protect |
| Product-flow tests | Current smoke cases test engineering flow | Frozen scenarios A/B/C and progressive journey | BUILD | smoke/API/UI fixtures | No product-level journey harness | Highest with redesign |

## Engineering Reference MVP v0 — Reuse Boundary

The following proven assets should not be casually rewritten because the student experience is changing. This boundary protects verified logic, not every higher-level contract or interaction:

- `ADMISSION_YEAR = 2026`, frozen enums, and validation semantics
- ELG001–ELG032 execution, cutoff calculation, sourced checks, and conservative aggregation
- explicit `ELIGIBLE`, `INELIGIBLE`, and `NEEDS_REVIEW` internal outcomes
- null-versus-false preservation
- canonical `tnea_college_code + branch_id` matching
- preservation and exclusion of unmapped source programmes
- distinct `AdmissionSeatFact` types and append-only snapshot handling
- missing-vacancy behavior and snapshot selection
- provenance propagation
- deterministic candidate generation as a capability, invoked only when Product V1 calls for it
- explicit branch-preference ordering as a decision-support utility, not a journey organizer
- UI-independent guidance service composition and safe API validation/error behavior
- pilot ingestion and existing deterministic regression tests

Adaptations should wrap or translate these assets at product-facing boundaries. A backend rewrite requires separate technical evidence, not merely a new UI direction.

`StudentProfile` is **REUSE for now** as a trusted backend/domain contract, but it must not dictate the student question journey. `GuidanceResult` is **REUSE/ADAPT** as an internal trusted result, but it is not automatically the permanent Product V1 presentation contract. The JSON API is **REUSE/ADAPT**; purpose-specific interfaces may be introduced if progressive guidance genuinely requires them.

## Student Experience — Replacement / Adaptation Boundary

The following current behavior is an engineering reference, not a constraint on the redesigned experience:

- one large form exposing nearly the full `StudentProfile` at once — **REPLACE**
- labels mechanically derived from internal field names
- required snapshot IDs/stages and counselling enums shown directly to students
- five branch-order inputs presented before the student's need is established
- raw outcomes such as `NEEDS_REVIEW` — **ADAPT substantially or REPLACE**
- internal rule IDs, reason codes, fact-type enums, source IDs, and canonical codes in primary presentation — **ADAPT substantially or REPLACE**
- a linear form-to-engine-to-result student interaction assumption — **DROP**
- immediate college-choice output without awareness, exploration, or a consistent next action

Existing responsive/mobile infrastructure is **REUSE/ADAPT** where useful. The large form is not protected, and the current renderer may be substantially adapted or replaced if that is simpler. Internal trusted state must remain intact while a student-facing semantic layer controls what is asked, when it is asked, and how results are explained.

## Frozen Journey Stage Mapping

| Stage | Existing support | Missing capability/product gap | Classification | Relevant assets |
|---|---|---|---|---|
| 1. Engineering Awareness | None in application | Versioned orientation content and zero-knowledge entry | BUILD | Product docs; branch taxonomy is only partial input |
| 2. TNEA Explained | Eligibility/cutoff mechanics exist internally | Simple sourced explanation of TNEA, cutoff, routes, and counselling | BUILD, while REUSE engine facts | `rules.ts`, sources registry |
| 3. Know the Student | Full nullable profile and API validation | Progressive question selection, relevance, why-this-matters copy, direct paths | ADAPT backend contract; BUILD interaction layer | `StudentProfile`, API validator, UI mapper |
| 4. Personal Guidance | Eligibility, cutoff, blockers, checks, provenance | Student meaning, verified/worth-checking separation, clear next step | ADAPT factual output; BUILD semantic view model | `GuidanceResult`, renderer |
| 5. Explore / Think Further | Five branch taxonomy rows; candidate list | Independent exploration and safe structured prompts/options | ADAPT branch data; BUILD exploration layer | `branches.csv`, pilot data |
| 6. Decision Support | Canonical candidates, seat semantics, branch ordering | Progressive entry, student-friendly evidence/context, richer comparisons only when sourced | REUSE engine; ADAPT presentation | recommendation/application modules |
| 7. Next Action | Blocking fields and source references | Explicit student-facing action model across all interactions | BUILD | Eligibility blockers/provenance are useful inputs |

## Student Input Gap Review

| Requirement | Finding | Classification |
|---|---|---|
| Preserve nullable input and backend profile | Correctly supported end to end | REUSE |
| Avoid backend contract driving experience | Current form enumerates domain fields directly | ADAPT |
| Progressive questions / minimum data | No question graph or journey state | BUILD |
| Explain unfamiliar questions | No question-level content model | BUILD |
| Skip irrelevant questions | Domain rules branch internally, UI does not | BUILD |
| Zero-knowledge entry | No awareness-first product entry | BUILD |
| Direct entry | Service is callable, but product routes do not exist | BUILD on REUSE service |
| Student interest/exploration capability | Required by frozen Stage 5 but not implemented | BUILD; exact interest questions, taxonomy, matching semantics, and final interaction design remain `NOT_YET_FROZEN` |

`StudentProfile` remains a reusable backend contract for now. It is not sacred architecture and must not dictate the student question journey. The gap is the collection layer that progressively and transparently produces trustworthy domain input.

## Student Output Gap Review

- **Level 1:** Cutoff, status, missing fields, and choices exist, but enum labels and domain language require **ADAPT**.
- **Level 2:** Sourced rule checks and ordering explanations exist and are optional `<details>`, but rule/reason codes require a student-language mapping: **ADAPT**.
- **Level 3:** Provenance reaches the UI, but raw source IDs/pages need source-registry enrichment and clearer document references: **ADAPT**.
- **Verified Personal Results:** Strong factual base exists: **REUSE** internally and **ADAPT** for presentation.
- **Things Worth Checking:** No separate content/data/result contract exists: **BUILD** with explicit uncertainty and source rules. It may surface sourced awareness, possible schemes or support worth investigating, potentially relevant certificates, related options, useful questions, and official resources. It must not infer scheme eligibility, imply entitlement, claim admission eligibility, or convert an unsupported possibility into a verified personal result.

Verified Personal Results and Things Worth Checking must remain structurally distinguishable in internal output and student presentation.

## Progressive Guidance Capability

The application can execute personal guidance and decision-support requests independently through its service/API, which is a useful base for direct entry. It cannot currently deliver awareness, maintain journey/progress state, select the next relevant question, offer independent exploration, or emit a consistent next action. These are new product-layer capabilities; they should orchestrate existing services rather than move domain decisions into the client.

## Booklet-First Capability

There is no runtime mechanism for structured awareness, TNEA explanation, counselling orientation, or booklet-to-journey content. The smallest suitable initial mechanism is **BUILD**: versioned, structured, reviewed guidance content with provenance/version metadata and deterministic presentation. RAG and LLM delivery are unnecessary for the initial mechanism and remain deferred.

## Think-Further Capability

The branch CSV contains related-branch and career-domain taxonomy, but its notes identify it as high-level internal guidance taxonomy rather than an admission rule. It may be **ADAPT**ed only after content and sourcing review. A safe “Things Worth Checking”/exploration model, qualification vocabulary, source links, and applicability boundaries must be **BUILD**. The system must not infer preferences, scheme eligibility, rankings, or admission chances.

## Native-Language Readiness

`NATIVE_LANGUAGE_CAPABILITY = REQUIRED`

`STUDENT_SEMANTIC_CONTENT_BOUNDARY = BUILD_EARLY`

`HARD_CODED_ENGLISH_DEPENDENCY = AVOID_IN_REDESIGN`

`EXACT_TAMIL_COPY = DEFER_FROM_TECHNICAL_GAP_DESIGN`

`TAMIL_STUDENT_VALIDATION = REQUIRED_BEFORE_RELEVANT_PILOT_OR_RELEASE`

`TRANSLATION_MECHANISM = IMPLEMENTATION_DESIGN_CONCERN`

Domain outputs are structured, making mapping feasible, but nearly all UI copy is hard-coded English in `src/ui/student-guidance.ts`; some labels are generated from field names. There is no centralized student-message catalogue or content/localization boundary.

- Domain/API structured outputs: **REUSE**.
- Student semantic message keys/view model and centralized content: **BUILD EARLY**.
- Current renderer: **ADAPT** to consume that layer.
- Exact Tamil wording and translations: **DEFER** from technical gap design, but they are required before the relevant real-student pilot. Tamil-student validation is also required before that pilot or release.

## Channel Readiness

- Guidance service and JSON adapter separation: **REUSE** for channel independence.
- Mobile web: **ADAPT** the current responsive shell around the frozen journey.
- WhatsApp link/share entry: **BUILD** after the core mobile-web flow.
- Shareable student-safe summary: **BUILD** after the student output contract is implemented; include privacy review.
- WhatsApp conversational integration: **DEFER**. It must later reuse the same trusted service/domain layer.

## Decision Support Safety Review

Repository search and recommendation code inspection found no Dream/Target/Safe classification, admission probability, guaranteed-backup behavior, subjective college quality ranking, subjective branch ranking, historical cutoff prediction, fabricated vacancy, or automatic scheme eligibility. The only ordering factor is explicit branch order; ties use canonical identifiers. Missing vacancy remains unknown, and no real seat facts are manufactured by the demo.

The deterministic candidate and branch-ordering modules are safe to **REUSE** within the frozen guardrails. Their raw technical explanations require **ADAPT** at the student-facing boundary.

## Data Gap Review

Current dynamic evidence belongs primarily to a parallel **DATA/EVIDENCE WORKSTREAM**. Existing seat-fact schema, storage, and validation are **REUSE**. Acquiring authoritative current-year seat facts, counselling dates/process, scheme/support facts, operational requirements, and other dynamic TNEA evidence is evidence work first. Software should be built or adapted only where required to consume or present that evidence.

Missing dynamic data must not unnecessarily block early awareness and guidance value.

### Available and Reusable

- 5 sourced 2026 pilot colleges
- 79 sourced programme rows: 18 exact canonical mappings and 61 preserved unmapped rows
- 5 branch taxonomy rows, subject to student-content review
- 5 registered sources
- 32-rule detailed eligibility reference and executable rule implementation
- college/programme/rule provenance and source pages
- schemas and validators for three distinct seat-fact types and multiple snapshots

### Missing but Required for Initial Product

- reviewed, versioned Engineering Awareness and TNEA orientation content
- student-facing semantic messages for verified results, uncertainty, explanations, and next actions
- a safe structured “Things Worth Checking” content model with sourcing/qualification rules
- enough reviewed branch-awareness content to support the initial exploration promise

### Missing but Can Be Deferred

- broader college/programme coverage
- authoritative location and institution-type metadata for preference use
- historical cutoff interpretation methodology/data
- college comparison/ranking methodology
- admission probability methodology
- final Tamil copy
- WhatsApp integration

### Current-Year Dynamic Data

- no authoritative 2026 `SANCTIONED_INTAKE`, `CURRENT_VACANCY`, or `QUOTA_VACANCY` facts are persisted
- counselling dates, schedule/process updates, fees, facilitation/contact details, and current document requirements are absent
- current scheme/support facts and authoritative applicability evidence are absent

These are data/evidence gaps. They must not be filled by inference, and absence must not block awareness-first value that does not depend on them.

## Test Asset Review

### Tests Reusable

- domain constants/enums/null semantics and eligibility aggregation
- all-rule execution and representative academic/nativity cases
- seat-fact validation and snapshot immutability
- pilot-data/provenance/mapping validation
- recommendation safety, unknown vacancy, ordering, and determinism
- guidance orchestration and API validation/error behavior

### Tests Needing Adaptation

- UI tests that assert the current single-form/raw-result markup
- smoke tests tied to the current engineering-demo page and raw state labels
- demo scenarios as product scenarios; current fixtures are engine demonstrations rather than frozen journeys A/B/C

### New Test Capabilities Needed

- scenario A/B/C product-flow and manual acceptance evidence
- awareness-before-data and direct-entry flow tests
- progressive/relevant question and null-preservation tests
- Level 1/2/3 presentation tests
- verified-versus-worth-checking separation tests
- student-facing uncertainty and next-action semantic tests
- internal-term leakage checks
- message-catalogue/localization-readiness tests, including semantic equivalence
- mobile-flow accessibility tests and share-summary privacy/safety tests when those capabilities are built

## Proposed Implementation Themes

These are planning inputs, not implementation slices or authorization.

### Theme A — Versioned Student Guidance Content Foundation

- **Student outcome:** Value before marks; basic engineering/TNEA understanding.
- **REUSE:** Product documents and source registry.
- **ADAPT:** Carefully reviewed branch taxonomy where suitable.
- **BUILD:** Structured content model, provenance/versioning, deterministic content delivery.
- **Dependencies:** Booklet content mapping and authoritative review of factual claims.
- **Risks:** Stale facts, over-detailed policy content, and booklet material being treated as permanently current.

### Theme B — Progressive and Direct-Entry Interaction

- **Student outcome:** Minimum relevant questions from either guided or direct entry.
- **REUSE:** `StudentProfile`, null semantics, API/service boundary.
- **ADAPT:** Form-to-request mapping and validation presentation.
- **BUILD:** Journey state, entry routing, question relevance/progression, why-this-matters content.
- **Dependencies:** Approved question/field mapping and UX plan.
- **Risks:** Reimplementing rules in UI or silently converting unknowns.

### Theme C — Student-Facing Guidance Presentation

- **Student outcome:** Understandable result, optional explanation/evidence, and next direction.
- **REUSE:** `GuidanceResult`, checks, blockers, evidence, provenance.
- **ADAPT:** Renderer and error presentation.
- **BUILD:** Semantic view model/message catalogue, verified/worth-checking separation, next-action contract.
- **Dependencies:** Student terminology and content review.
- **Risks:** Meaning drift between internal and student-facing states.

### Theme D — Explore and Think Further

- **Student outcome:** Discover useful branches, pathways, questions, and support to investigate.
- **REUSE:** Pilot identities and any reviewed branch taxonomy.
- **ADAPT:** Branch content after sourcing/content validation.
- **BUILD:** Exploration and qualified opportunity content models.
- **Dependencies:** Evidence/content scope decisions.
- **Risks:** Implied rankings, inferred relevance, or unsupported benefit claims.

### Theme E — Safe Decision-Support Adaptation

- **Student outcome:** Student-led, evidence-supported counselling help.
- **REUSE:** Candidates, snapshot semantics, branch ordering, provenance.
- **ADAPT:** Entry context, comparisons, and student explanations.
- **BUILD:** Choice-workflow and official next-action presentation where supported.
- **Dependencies:** Current-year evidence availability.
- **Risks:** Turning historical or missing evidence into prediction.

### Theme F — Native-Language and Channel-Independent Foundation

- **Student outcome:** Mobile-readable guidance ready for reviewed Tamil and later sharing.
- **REUSE:** UI-independent service/API.
- **ADAPT:** Mobile web shell.
- **BUILD:** Centralized messages/content, locale boundary, later safe share summary.
- **Dependencies:** Tamil review and privacy review for sharing.
- **Risks:** Translation altering factual semantics or channel logic diverging.

## Explicitly Deferred

- WhatsApp conversational bot/integration
- admission probability, predicted allotment, or implied chance
- Dream/Target/Safe semantics and guaranteed-backup language
- subjective college ranking, tiering, or “best college” logic
- subjective branch superiority or hidden preference weighting
- unsupported historical-cutoff prediction or interpretation
- exact Tamil copy before language review
- final visual polish, animation, and design-system work
- location/institution preferences without authoritative metadata
- broad TNEA coverage and production infrastructure
- RAG/LLM content delivery or any AI admission decision
- broad architecture rewrites not justified by an approved gap and plan

## Review Decision Required

This gap map preserves the trusted engineering core and identifies a student-product layer that must be planned separately. Human review must confirm the classifications, priorities, content/data boundaries, and implementation themes before an Implementation Plan V1 is created.

`TECHNICAL_GAP_MAPPING_STATUS = APPROVED_V1`

`IMPLEMENTATION_PLAN_V1 = NOT_CREATED`

`IMPLEMENTATION_AUTHORIZED = NO`

# M5 decision support — final execution proposal for owner review

**Status (2026-11-06): PLANNING_PROPOSAL_PREPARED; M5-T01 = ACCEPTED; M5-T02 = ACCEPTED; M5-D5_SPEC = AUTHORIZED; IMPLEMENTATION_AUTHORIZED = NO.** This is the single current M5 planning package. It reconciles the earlier bounded proposal with the supplied M5-T01–T12 execution draft; no second task plan is authoritative. “Final” describes a reviewable proposal, not implementation approval. The accepted M0–M4 baseline, M4 acceptance tag, exact profile/offering decisions, held mappings, deterministic admission authority and historical records remain unchanged. No M5 extraction experiment, production ingestion, application work, publication, merge, deployment, model restart or access change is authorized. `REAL_STUDENT_VALIDATION = NOT_RUN` and pilot readiness is unapproved. The owner accepted the [T01 contract](m5_contract_spec_v1.md) at reviewed commit `b332c61216ecf8329ec9f7336f6de6f4bfc9d7e4`; the owner accepted the [bounded T02 source assessment](m5_source_census_v1.md) and authorized resolving the aggregate-cutoff blocker via the M5-D5 methodology specification.

## Delivery boundary and evidence state

The proposed first historical delivery has **at most 10 governed 2026 college identities and 20 exact college–programme pairs**. These are ceilings, never minimums. Select the actual cohort only after bounded official-source discovery and historical identity feasibility. Examine 2024 and 2025 as candidate years; neither year is assumed for any pair. The 389 governed colleges and 3,128 dated offerings describe the accepted **2026 directory**, not a historical denominator or parity requirement. All-389-college historical coverage is an optional expansion goal requiring its own owner approval after measured feasibility and M5 acceptance. Expansion is not required to pass M5.

The repository's `data/cutoffs.csv` is header-only and contains no approved historical rows; no historical PDFs are tracked. A preliminary spot check found official [2024 General Academic Round 1 provisional allotments](https://static.tneaonline.org/docs/GENERAL_ACADEMIC_ROUND1_2024.pdf), [2025 General Academic Round 2 provisional allotments](https://static.tneaonline.org/docs/GEN_ALLOTMENT_ROUND_2_2025.pdf) and [2025 government-school 7.5% Round 2 provisional allotments](https://static.tneaonline.org/docs/GOVT_ALLOTMENT_ROUND_2_2025.pdf). The [official cutoff portal](https://cutoff.tneaonline.org/) returned HTTP 503 during that spot check. These are source leads, not a completeness or reliability finding. The allotment PDFs include applicant-level rows; their availability does not permit applicant-level ingestion or persistence.

**Independent evidence streams.** General Academic and government-school 7.5% have separate source, meaning, eligibility and approval gates. Applicant community/category, allotted community, counselling route, quota, stage and round are separate concepts. Ask for or use only inputs needed for the comparison a student requests; neither community nor 7.5% status is automatically mandatory for marks-free discovery or shortlist. A self-reported government-school status does not establish entitlement. A missing or incompatible history record stays `UNKNOWN`, `NOT_REPORTED` or `NEEDS_REVIEW`, never a zero, a negative admission conclusion or a substituted General Academic value. A 2026 directory option approved for display may be shortlisted without historical data.

**Distinct facts.** A listed programme, seat matrix value, vacancy, historical cutoff, published aggregate closing rank and current allotment are different evidence types. Preserve source year, stream, stage, round, provisional/final status, category semantics and locator. An applicant's rank in an allotment row is personal source data; a separately published aggregate historical closing-rank measure is a possible future evidence type. The schema's ability to distinguish ranks and cutoffs does **not** authorize rank comparison. No applicant-level identifiers or records enter M5 research derivatives, approved product data or browser storage.

**Product limits.** No admission chance, prediction, guarantee, Safe/Target/Dream, college-quality ranking, hidden score, automatic choice ordering, inferred 7.5% entitlement or portal submission. Deterministic, evidence-backed comparison and reviewed static Tamil/English copy are the proposed approach. RAG, live LLM and gateway work are separate and are not M5 prerequisites.

## A. Historical contract and bounded validation

### M5-T01 — Bounded contract, provenance and privacy

- **Scope:** Draft D5 comparison semantics, exact identity/source fields, optional input rules, separate General Academic and 7.5% routes, missing/conflict states, applicant-data exclusion and source-copy retention proposal. Define what a published closing measure means before comparison.
- **Student outcome / deliverable:** The [accepted T01 contract](m5_contract_spec_v1.md) sets the input, schema, metric, provenance and privacy boundaries without forcing a marks or quota input.
- **Dependencies:** Accepted M0–M4 authority, D5 methodology requirement, M4 governed directory and official source leads.
- **Validation:** Check each proposed field against a named claim; verify that cutoff, aggregate closing rank, seat matrix, vacancy and allotment cannot be interchanged and that no applicant-level field is retained.
- **Human gate:** Owner accepted the exact contract at `b332c61216ecf8329ec9f7336f6de6f4bfc9d7e4`; reviewer assignments and legal/source-use decisions remain open where applicable.
- **Authorization status:** **T01 ACCEPTED** for the reviewed specification; extraction and implementation remain unauthorized.

### M5-T02 — Bounded official-source discovery

- **Scope:** Reuse existing official source leads to inspect a limited set of 2024/2025 source types and access paths. Check availability, historical metric definitions, category/route/round meanings, finality, page shape and access limitations. This is a **bounded source-availability assessment**, not a statewide record census or an extraction commitment. Do not extract applicant data.
- **Student outcome / deliverable:** The completed [source-availability assessment](m5_source_census_v1.md) records accessible, unavailable and unresolved cells, including General Academic and 7.5% separately; it found no currently usable aggregate historical closing-cutoff source.
- **Dependencies:** Accepted T01 questions and the owner's bounded source-assessment authorization, both now recorded.
- **Validation:** Reopen recorded official URLs, record access date/result and original source wording, and distinguish source discovery from evidence approval or historical coverage.
- **Human gate:** Owner reviews findings and decides which source types merit method review; findings alone approve no data.
- **Authorization status:** **T02 ACCEPTED BY OWNER (2026-11-06)**. The aggregate-cutoff blocker is resolved by authorizing preparation of the M5-D5 Derived Metric Methodology & Ephemeral Privacy Specification. T03–T04 remain unauthorized pending D5 review.

### M5-T03 — Historical identity audit and candidate cohort

- **Scope:** After T02, assess up to 10 governed 2026 college identities and 20 exact programme pairs against candidate historical years. Record code/name changes, code reuse, new/discontinued programmes, medium/shift/other variants, and unresolved joins. Select for source and identity feasibility, not a preset institutional quota.
- **Student outcome / deliverable:** Candidate cohort and exact-identity ledger with supported, held and unknown year-specific relationships; ceilings need not be filled.
- **Dependencies:** T02 evidence, the accepted M4 directory and preserved M4 holds.
- **Validation:** Manually verify exact college/programme codes and source-year variants; reject name-similarity joins and any silent conversion of a held mapping.
- **Human gate:** Owner approves the actual bounded cohort and each proposed cross-year identity disposition before product use.
- **Authorization status:** **NOT_AUTHORIZED** for execution; cohort selection and mapping approval remain pending.

### M5-T04 — Bounded extraction experiment and error/effort audit

- **Scope:** Only after its own applicable authorization, test extraction on the approved research sample within the 10-college/20-pair ceilings. Keep temporary research artifacts isolated from governed production data and application implementation. Do not ingest applicant-level records or identifiers. If a source contains only applicant rows, document the limitation; any aggregate derivation requires a separately reviewed D5 method.
- **Student outcome / deliverable:** Measured field-check numerator/denominator, error/conflict ledger, missingness by year/stream/round and timed source-finding, extraction, reconciliation and second-review effort.
- **Dependencies:** T02 availability, T03 candidate identities, T01 privacy contract and explicit T04 research authorization.
- **Validation:** Compare candidate fields with official pages, classify errors and provenance gaps, repeat difficult layouts, and avoid extrapolating sample accuracy to statewide coverage.
- **Human gate:** Owner reviews the measured report and D5 methodology before any historical data is approved for product use.
- **Authorization status:** **NOT_AUTHORIZED**; research permission, production data approval and application implementation are three separate decisions.

**Gate A:** T01–T04 findings can support an owner decision on bounded historical method, sources and exact cohort. Gate A does not approve bilingual copy, browser storage, B/C implementation, student publication or expansion. A failed source or identity gate leaves that comparison unknown while marks-free discovery and separately authorized shortlisting can still proceed.

## B. Factual comparison and bilingual guidance

### M5-T05 — Governed deterministic factual comparison

- **Scope:** Propose a like-for-like cutoff comparison only for owner-approved year, stream, category meaning, stage/round, exact pair and finality. Show arithmetic difference only where D5 permits. Preserve published aggregate closing-rank evidence as a distinct type; **rank comparison is out of scope unless separately approved later**.
- **Student outcome / deliverable:** A traceable factual comparison or an explicit unknown/incompatible state, with source and “why shown” explanation.
- **Dependencies:** Approved Gate A source/method/cohort, existing deterministic cutoff authority and separate B implementation authorization.
- **Validation:** Check exact provenance, units, category versus route/quota isolation, missing/conflicting/provisional records and absence of prediction or cross-year averaging.
- **Human gate:** Owner approves comparison semantics and each data release scope; no automatic promotion from research artifacts.
- **Authorization status:** **NOT_AUTHORIZED** for implementation or display.

### M5-T06 — Reviewed Tamil and English explanation

- **Scope:** Draft static Tamil-first and English wording for comparable evidence, no year, one year, unresolved identity, changed programme, incompatible stream/category, provisional-only evidence and conflict. Explain that past values can differ from a later year without attributing a specific difference to unverified causes.
- **Student outcome / deliverable:** Exact bilingual explanation and limitation copy tied to approved claims and useful next actions.
- **Dependencies:** T05 semantics, applicable official evidence and factual scope; copy review is independent of Gate A data approval.
- **Validation:** Check Tamil/English factual equivalence, source/year/round labels, unknown wording, readability and no predictive implication.
- **Human gate:** Separate owner factual review and human bilingual equivalence approval of the exact copy before student display.
- **Authorization status:** **NOT_AUTHORIZED** for release; draft and copy approval remain pending.

### M5-T07 — Student-controlled filters and neutral sorts

- **Scope:** Specify optional filters for governed branch/college and verified district/type, plus approved historical fields only when available. State the active filter/sort rule; default order is neutral and disclosed. An explicit history filter may exclude unknowns only with an exclusion notice and reset.
- **Student outcome / deliverable:** The student can narrow options knowingly without interpreting absent history as failure or receiving a hidden recommendation.
- **Dependencies:** Existing M4 directory contract; T05 only for history-specific controls; separate UI authorization.
- **Validation:** Check unknown visibility, filter reset, unsupported metadata, language retention, neutral order and no automatic preference changes.
- **Human gate:** Owner reviews controls and bilingual labels; history-specific controls need approved historical data.
- **Authorization status:** **NOT_AUTHORIZED** for implementation.

**Gate B:** Approved data/methodology and approved bilingual copy are distinct gates. Neither makes a historical claim student-visible without bounded implementation, validation and an explicit publication decision. General Academic approval does not approve 7.5% use.

## C. Shortlist and manual preference ordering

### M5-T08 — Marks-free, zero-login shortlist and proposed retention

- **Scope:** Allow governed 2026 directory options approved for display to be added from either discovery path, regardless of history. Propose session-memory by default. Propose, but do not presume approval for, opt-in `localStorage` retention for 30 days. Persist only exact option IDs and their student order; no marks, cutoff, community, route/quota status, comparison result or applicant data. Keep expiry metadata solely to enforce retention.
- **Student outcome / deliverable:** A private draft that works for history-free options and can be cleared on a shared device.
- **Dependencies:** Governed M4 directory option identity and **separate C implementation authorization**; T08 does not depend on Gate A historical coverage. Persistent storage also requires a separate policy approval.
- **Validation:** On every read, discard expired entries before display; after expiry show an empty draft and a clear explanation. Provide clear-all that removes saved and in-memory choices, a shared-device notice before opt-in, and safe behavior if storage is unavailable, blocked or corrupt. Verify that only IDs/order and expiry metadata are stored.
- **Human gate:** Owner approves or rejects the exact persistence period, notice, expiry/clear behavior and historical-source retention policy; approved shortlist workflow alone does not approve storage.
- **Authorization status:** **NOT_AUTHORIZED**; opt-in 30-day retention is **PROPOSED / PENDING**.

### M5-T09 — Manual preference ordering

- **Scope:** Let the student add/remove options and move them explicitly by accessible up/down controls or equivalent, preserving exact directory option identity and variant. Initial order is disclosed add order; history never moves entries.
- **Student outcome / deliverable:** A student-owned choice draft whose order reflects explicit preference, including options with unknown history.
- **Dependencies:** T08 shortlist contract and separate C implementation authorization; no Gate A dependency for history-free operation.
- **Validation:** Test reorder, removal, duplicate IDs, changed/held identities, keyboard and touch use, language switch and persistence only if policy approved.
- **Human gate:** Owner reviews the order semantics and exact bilingual controls; students retain final control.
- **Authorization status:** **NOT_AUTHORIZED** for implementation.

### M5-T10 — Governed counselling-process education

- **Scope:** Explain that students should review their genuine preferences and verify current counselling instructions. Any statement about choice sequence, allotment mechanics, confirmation or later movement needs applicable year/stage official evidence and reviewed wording. Do not reduce TNEA allotment to an unsupported universal “first match locks” algorithm.
- **Student outcome / deliverable:** Bilingual guidance for using a personal choice draft and finding the official next action; the draft is not a counselling-portal submission.
- **Dependencies:** Current applicable official counselling rules (D1/D4 as relevant), T09 choice context and separate content authorization; historical comparison is optional.
- **Validation:** Check each process claim against the cited rule/year/stage, Tamil/English equivalence, and distinction between draft and official action.
- **Human gate:** Owner factual and human bilingual wording approval before display; update when governing instructions change.
- **Authorization status:** **NOT_AUTHORIZED** for implementation or copy release.

**Gate C:** Shortlisting is functionally independent of historical coverage, but its implementation and publication remain separately authorized. Gate A does not approve C. Opt-in browser persistence, bilingual wording and counselling-process claims each retain their own review gate.

## D. Responsive verification and acceptance

### M5-T11 — Responsive, accessible and resilient presentation

- **Scope:** Plan Tamil and English mobile and desktop behavior without a fixed 1160px container requirement. Propose browser checks at 360px, 390px, intermediate and representative wider desktop widths; verify content, source/unknown labels, navigation, manual order and recovery with real browser rendering.
- **Student outcome / deliverable:** Usable comparison and choice drafting across phone and desktop, including low-bandwidth or temporarily unavailable-source states.
- **Dependencies:** Authorized B/C slices, approved copy and the accepted M0–M4 responsive baseline.
- **Validation:** Proposed checks include no horizontal overflow, readable labels, visible focus, keyboard order controls, adequate touch targets (proposed 44px minimum), language/state preservation, loading/error recovery and measured performance before setting a numeric budget. Run real browser verification, not static width-labelled assertions alone.
- **Human gate:** Owner reviews Tamil/English rendered journeys and accessibility findings; engineering checks are not student validation.
- **Authorization status:** **NOT_AUTHORIZED** for implementation or browser-based M5 acceptance claims.

### M5-T12 — Technical, mission and owner-scenario acceptance

- **Scope:** Verify the bounded M5 candidate only after applicable data, copy, storage, implementation and presentation gates. Run focused checks, the then-current full offline suite, strict typecheck, source/approval integrity and real browser walks; 326/326 is a historical M0–M4 baseline, not a frozen M5 test count.
- **Student outcome / deliverable:** Owner worksheet with PASS/FIX/HOLD for each scenario, exact revision and a separate bounded M5 acceptance decision.
- **Dependencies:** Applicable T01–T11 approvals and implementation; unresolved history may remain unknown if it does not undermine the agreed bounded outcome.
- **Validation:** Check the ten scenarios below and absence of prediction, ranking, automatic order, applicant-data retention or cross-stream leakage. Distinguish technical, factual, bilingual, mission and owner outcomes.
- **Human gate:** Owner explicitly accepts or rejects bounded M5. Scenario PASS and owner acceptance do not establish real-student validation or pilot readiness. Future expansion has a later separate decision and is not needed for M5 acceptance.
- **Authorization status:** **NOT_AUTHORIZED / NOT_RUN**; M5 acceptance is pending.

**Ten proposed owner scenarios**

1. Comparable approved General Academic record with exact year/category/round/source and honest difference.
2. Separately validated 7.5% record, or an explicit unavailable state without General Academic substitution.
3. Governed 2026 directory option with neither 2024 nor 2025 history, still discoverable and shortlistable.
4. One-year-only history with the other year unknown and no invented trend.
5. Changed college/programme code, name or variant across years with a held or reviewed exact join.
6. Conflicting or provisional-only source withheld or labelled within approved semantics.
7. Missing cutoff alongside published aggregate closing-rank evidence, with no unauthorized rank comparison.
8. History-free shortlist curation and explicit manual reorder, with no automatic order.
9. Shared-device notice, optional storage choice, clear-all, expiry enforcement and after-expiry empty state.
10. Tamil/English phone and desktop real-browser flow, keyboard/touch use and failure recovery.

## Expansion criteria

After bounded M5 acceptance, a separate owner review may consider batches using a source-availability matrix by year/stream/round, exact identity and hold ledger, measured extraction accuracy and rework, provenance and applicant-data minimization audit, per-pair reviewer effort and annual maintenance capacity, bilingual understanding findings, and the share of 2026 directory options with no usable history. Any batch needs an approved size, source/stream/round scope, publication boundary and stop rules. All-389-college historical coverage remains a proposed goal; 3,128 is never a mandatory historical matching target.

## Five consolidated owner decision groups — all PENDING

| Decision | Precise decision required | Status |
| --- | --- | --- |
| **1. Bounded contract and initial assessment** | Accept T01's reviewed contract and authorize T02's limited official-source assessment; accept T02 findings and decide blocker resolution strategy. | **RESOLVED: T01 ACCEPTED; T02 ACCEPTED; BLOCKER RESOLUTION AUTHORIZED VIA D5 SPECIFICATION** |
| **2. Research experiment** | After T02/T03, approve/revise the exact T04 sample and extraction-experiment authority, including privacy and research-artifact limits. No production ingestion follows automatically. | **PENDING** |
| **3. Historical method and comparison** | Review Gate A's source, identity, error/effort and D5 evidence; decide actual cohort, General Academic and 7.5% scopes independently, and any B implementation/data use. | **PENDING** |
| **4. Wording, shortlist and retention** | Separately decide factual/Tamil-English copy, C implementation, opt-in 30-day ID-only storage and historical-source retention/rights policy. None is conferred by Gate A. | **PENDING** |
| **5. Bounded acceptance and later expansion** | Decide bounded M5 acceptance from D evidence. If expansion is later proposed, make an additional explicit expansion decision; M5 may pass without it. Student publication, deployment and real-student validation remain separate later gates. | **PENDING** |

**Next single action:** Draft the authorized M5-D5 Derived Metric Methodology & Ephemeral Privacy Specification for owner review. T03–T04, extraction, production ingestion and application implementation remain unauthorized; `IMPLEMENTATION_AUTHORIZED = NO`.


## T01 detailed specification

See the [accepted M5-T01 contract](m5_contract_spec_v1.md), reviewed at `b332c61216ecf8329ec9f7336f6de6f4bfc9d7e4`, and the [accepted T02 source assessment](m5_source_census_v1.md). D5 specification preparation is authorized.

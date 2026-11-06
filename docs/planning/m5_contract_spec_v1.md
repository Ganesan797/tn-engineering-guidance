# M5-T01 — Bounded contract, provenance and privacy specification

Status: DRAFT_FOR_OWNER_REVIEW. Prepared 2026-11-06.
Base: b4dfd5483437dcdc6127cba8d9d87376234241c9.
Authority: [M5 proposal](m5_decision_support_proposal_v1.md), [mission](../product/product_mission.md), [implementation plan](implementation_plan_v1.md).
This task authorizes specification preparation only. The contract is not frozen or owner-approved. No extraction, ingestion, application implementation, source access, deployment or model execution is authorized here. Accepted M0–M4 content, tags, UI decisions and holds remain unchanged.

## 1. Student outcome and scope

A student may request a transparent comparison with a dated historical observation and understand what it establishes and what it does not. Browsing and approved shortlisting do not depend on marks or history.
The proposed first historical validation ceiling remains ten governed college identities and twenty exact college–programme pairs; it is not a permanent directory limit or a minimum. Candidate years are 2024/2025, not assumed coverage. Statewide historical expansion is a separate decision.
No chance, prediction, quality score, Safe/Target/Dream, automatic ordering or portal submission. No live LLM/RAG dependency.

## 2. Optional input contract

| Input | Meaning and rule |
| --- | --- |
| comparison_intent | Explicit student action to enter M5 historical comparison; no silent personal-context transfer |
| student_cutoff | Supported deterministic M3 value, with calculation/input version and applicable admission route/year context; nullable, finite, validated using existing domain rules; no recalculation in presentation |
| reservation_community | Nullable explicit student answer using supported source/domain vocabulary; unknown remains unknown |
| requested_historical_category | Historical record category selected under reviewed source semantics; distinct from student community |
| govt_school_quota_7_5 | true / false / unknown / unanswered; self-report is not verified eligibility or entitlement |
| requested_route_quota | Explicit historical evidence scope; General Academic and 7.5% are independent |
| selected_history_scope | Year, stream, stage, round and exact option; all must be explicit or disclosed |

OC/open competition is not automatically a student community. T02 must establish actual category vocabulary and access/comparison semantics before a production category resolver is approved.
Missing cutoff prevents numeric delta only. Missing community/quota prevents comparisons requiring that context; it does not establish ineligibility, false, zero or an alternative route.
The accepted M3→M4 bridge remains marks-free and transfers no marks, cutoff, rank, community or quota. M5 reuse requires a distinct, explicitly authorized implementation path.
Student context is transient; no sensitive values in URLs, browser persistence, logs or analytics.

## 3. Observation contract

This is a proposed record schema, not a new canonical admission model.

| Fields | Requirement |
| --- | --- |
| observation_id, schema_version | Stable identity and explicit schema version |
| college_code, programme_code | Exact source strings; no numeric coercion, name-similarity join or variant collapse |
| source_college_name, source_programme_name | Literal institutional/programme labels only; no applicant text |
| year, stream, admission_route, quota | Explicit source scope; separate route/quota and category |
| stage, round, publication_status | Preserve provisional/final/unknown; missing round is not inferred |
| community_category, category_semantics_reference | Source meaning, including allotted versus applicant category distinction |
| metric_type, metric_unit, rank_population | CUTOFF_SCORE / AGGREGATE_CLOSING_RANK; rank population required for any rank evidence |
| closing_cutoff, closing_rank | Nullable independent values; at least one evidenced metric; neither substituted for the other |
| cutoff_status, rank_status | REPORTED / UNKNOWN / NOT_REPORTED / NEEDS_REVIEW, independently |
| observation_basis | OFFICIAL_PUBLISHED / DERIVED |
| derivation_method_version | Required for derived observations; otherwise null |
| source_url, source_locator | URL plus PDF page/table or portal query/result reference without personal values |
| source_sha256, retrieved_at | Hash of source artifact and retrieval timestamp; hash is integrity evidence, not factual approval |
| source_scope, source_version | Publication applicability and version |
| identity_review_status, review_status, review_reference | Independent identity and factual review gates |
| reviewed_by, reviewed_at | Review attribution and date; never fabricate owner approval |
| supersedes_observation_id, conflict_group_id | Version/conflict lineage where applicable |

Observation keys include exact pair, year, stream, route/quota, stage/round, category, metric and source version. Conflicting duplicates are retained and blocked rather than overwritten.
UNKNOWN means not established. NOT_REPORTED means the applicable inspected source does not report that field, supported by a locator. NEEDS_REVIEW means conflict, ambiguity or unresolved methodology. None means zero or admission rejection.

## 4. Historical metric and comparison semantics

An official published closing value is only the measure explicitly defined by the publisher for its exact scope.
A minimum seen among provisional applicant allotments is not automatically an official closing threshold. No applicant-level derivation is authorized by this document. Any proposed derivation requires a separately reviewed D5 methodology, completeness assessment, privacy controls and source-use decision.
General Academic and 7.5% never substitute for each other. Cutoff scores never compare with ranks. Rank comparison is excluded from the first slice even if aggregate rank evidence can be represented.
Numeric comparison requires accepted identity, source, metric, scale, category interpretation and stage/finality semantics. Provisional observations remain labelled and blocked from closing-threshold claims unless the approved method expressly permits a qualified comparison.
Where permitted, delta = student cutoff minus historical closing cutoff. Equality means equal numerical value only. Neither sign nor equality determines admission, eligibility, suitability or preference order.
No year averaging, future extrapolation or hidden recommendation sorting. Missing history does not remove governed directory options unless an explicit disclosed history filter is applied.

## 5. Provenance and display gates

Research lead → scoped observation candidate → identity/source/method review → exact data approval → authorized implementation → display.
Approval of one step is not approval of the next. Copy, storage, General Academic, 7.5%, association and release approvals remain separate.
Historical identity mappings do not resolve M4 educational-profile or variant holds.
Display concise year/category/route/round, exact metric and evidence limit; detailed source locator may expand. Explain why shown using the actual disclosed comparison/filter.
Suggested semantic pattern (not language-approved copy): “Your cutoff is 176.5; the cited historical cutoff is 174.0; difference +2.5. This is past evidence, not a guarantee.” All numbers below are synthetic examples, not TNEA facts.

## 6. Operational privacy and retention

No applicant-level names, application/registration numbers, dates of birth, individual ranks or row-level records in repository files, manifests, extracted datasets, logs, screenshots or product derivatives. A separately published aggregate closing rank is distinct evidence.
No raw applicant PDF download or parsing is authorized at T01. T02 records source shape and access constraints; if subsequent authorized work requires transient source access, first approve a local isolated location, access controls, minimum retention/deletion schedule and accidental-capture handling.
Do not commit raw applicant PDFs or full extracted text. Persist only approved aggregate observations, nonpersonal source metadata and review evidence. Do not send raw applicant sources to external AI/model services.
If applicant data is captured accidentally, stop processing, prevent further copying, remove/redact task-controlled derivatives and report affected artifact classes without repeating identifiers.
M5 shortlist retention remains independently proposed: session memory by default; optional 30-day device storage of option IDs/order and expiry metadata only if approved. Expiry enforced before display; clear-all removes stored and session choices; storage failures remain recoverable.
These are operational controls, not a legal-compliance certification. Source-use permission and any applicable legal obligations remain to be assessed; public availability is not blanket reuse permission.

## 7. Worked acceptance cases

| Synthetic case | Required result |
| --- | --- |
| Comparable approved cutoff: 176.5 versus 174.0 | +2.5 with exact historical scope; no chance label |
| Equal cutoff values | delta 0; no admission guarantee |
| Student cutoff unknown | no delta; browsing/shortlist unaffected |
| Community or quota unknown | no personal category/route inference |
| General Academic available, 7.5% requested | no substitution; unavailable state |
| Historical rank only | no cutoff delta and no first-slice rank comparison |
| Exact identity or variant held | no historical join; preserve hold |
| Two conflicting published values | NEEDS_REVIEW; no convenient selection |
| Minimum observed provisional allotment | not promoted to official closing cutoff |
| One year or no historical year available | disclose coverage; no invented second year |
| Source hash changes | new source version and review; old approval not inherited |
| Sensitive input persistence attempted | reject; no URL/log/device storage |
| M3→M4 navigation | no personal data transferred |

## 8. T01 completion and remaining decisions

Specification preparation complete; owner acceptance PENDING. T01 freezes only after the owner accepts an exact revision.
Owner decision: approve/fix this input/schema/metric/privacy contract and name reviewers. Source-specific definitions remain explicit T02 questions, not invented facts.
T02 must establish official measure meaning, category vocabulary, route/quota/round semantics, publication finality, available years, portal/source locators, source-use restrictions and access stability.
No extraction accuracy threshold, derived method, historical cohort, source retention duration, persistence policy, bilingual copy or implementation is approved here.
Next single action: owner decides this T01 candidate and separately authorizes the precise T02 source assessment.

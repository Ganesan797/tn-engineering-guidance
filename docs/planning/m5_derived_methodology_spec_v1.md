# M5-D5 — derived provisional-allotment minimum methodology

**Status:** `D5_EXACT_REVISION = PROPOSED_FOR_OWNER_ACCEPTANCE`; `D5_ACCEPTANCE = PENDING`; `T03_T04 = NOT_AUTHORIZED`. Prepared 2026-11-06 from base `78abf60c38c6ffb5976bd72687fbe1bb1bdbcbbf`.

**Authority:** [Accepted M5-T01 contract](m5_contract_spec_v1.md), [accepted M5-T02 assessment](m5_source_census_v1.md) and [current M5 execution proposal](m5_decision_support_proposal_v1.md).

The bounded T02 assessment did not locate an accessible official aggregate college–programme closing-cutoff publication and observed HTTP 503 from the official cutoff portal during its access window. It did not establish that no such publication exists. Competitor descriptions are not evidence of a derivation pipeline and provide no project authority.

Owner acceptance of this exact D5 revision would approve only the proposed meaning, research-candidate schema, completeness tests and privacy controls for a later separately authorized T04 experiment. It would not authorize source access or applicant-row processing, T03 or T04 execution, a route/year/round source set, research-output retention, production ingestion, bilingual copy, application implementation, publication, merge or deployment.

## 1. Metric identity and prohibited equivalence

The only metric proposed by this method is:

> **Derived minimum observed aggregate mark in one identified provisional allotment publication, for one exact source-literal bucket.**

Its stable research identifier is `DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`. It is not any of the following:

- an `OFFICIAL_PUBLISHED_CLOSING_VALUE`;
- an official cutoff or official closing threshold;
- final admission, sanctioned intake, vacancy or seat-fill evidence;
- an admission probability, entitlement, recommendation or preference signal.

The accepted T01 production observation schema is not silently changed. D5 outputs are isolated research candidates and therefore do not populate `closing_cutoff`, `cutoff_status` or `data/cutoffs.csv`. A later methodology/data decision would be required to map any reviewed candidate into an approved product observation.

## 2. Research-candidate schema

Every persisted D5 research candidate must use the following fields and meanings. Exact strings from the source are retained where named `*_literal`; normalization never overwrites them.

| Field | Required meaning |
| --- | --- |
| `research_candidate_id`, `method_version` | Stable research identity; method version `D5-PROVISIONAL-ALLOTMENT-MIN-V2`. |
| `source_url`, `source_sha256`, `retrieved_at` | Exact approved URL, streamed-byte hash and access timestamp. |
| `source_title_literal` | Exact publication heading as observed. |
| `source_year_literal`, `source_route_literal`, `source_stage_literal`, `source_round_literal` | Exact source labels; normalized helper values may be added separately but may not replace these literals. |
| `source_college_code_literal`, `source_programme_code_literal`, `source_allotted_category_literal` | Exact strings from the applicable source columns. No numeric coercion, name-similarity join or category reinterpretation. |
| `source_mark_heading_literal` | Exact heading of the published aggregate-mark column used by the method. |
| `derived_metric_type` | Always `DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`. |
| `derived_minimum_mark` | Numeric minimum of valid published aggregate-mark values in the exact bucket; null whenever completeness or semantics are unresolved. |
| `official_closing_value` | Always null in a D5 research candidate. |
| `official_closing_value_status` | Always `NOT_ESTABLISHED_BY_D5`. |
| `observation_basis`, `publication_status` | `DERIVED`; `PROVISIONAL`. |
| `source_scope_status`, `extraction_status`, `category_semantics_status` | Independently record verified or unresolved source scope, extraction completeness and category meaning. |
| `nonpersonal_source_locator` | Document-level or page-span locator only; never an applicant row number, applicant value or screenshot. |
| `research_status` | `CANDIDATE`, `WITHHELD_NEEDS_REVIEW` or `REJECTED`. Never `REPORTED` or `APPROVED_FOR_PRODUCT`. |

Rank fields are absent. Rank comparison remains outside the first slice.

### Synthetic schema example

The following is synthetic and is not a TNEA fact:

```json
{
  "research_candidate_id": "SYNTHETIC-D5-001",
  "method_version": "D5-PROVISIONAL-ALLOTMENT-MIN-V2",
  "source_title_literal": "SYNTHETIC PROVISIONAL ALLOTMENT LIST",
  "source_year_literal": "20XX",
  "source_route_literal": "SYNTHETIC GENERAL ACADEMIC",
  "source_stage_literal": "PROVISIONAL ALLOTMENT",
  "source_round_literal": "ROUND X",
  "source_college_code_literal": "9999",
  "source_programme_code_literal": "ZZ",
  "source_allotted_category_literal": "OC",
  "source_mark_heading_literal": "AGGREGATE MARK",
  "derived_metric_type": "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
  "derived_minimum_mark": 174.5,
  "official_closing_value": null,
  "official_closing_value_status": "NOT_ESTABLISHED_BY_D5",
  "observation_basis": "DERIVED",
  "publication_status": "PROVISIONAL",
  "research_status": "CANDIDATE"
}
```

## 3. Source eligibility and independent route gates

D5 does not assume that 2024 or 2025 evidence exists for every pair or that all three rounds are published. A source is eligible for a later T04 experiment only when its exact URL and literal title/year/route/stage/round have been recorded and the owner has authorized that exact source set for research access.

General Academic and government-school 7.5% are independent evidence streams. Any T04 authorization must name exactly one or both streams and approve each independently. Evidence, category semantics, success or failure in one stream does not transfer to the other.

Before T04 source access, the following remain separate required decisions:

1. exact official URL list and access method;
2. applicable source-use and privacy review;
3. route, year, stage and round scope;
4. transient-source retention/deletion procedure and research-output retention;
5. category semantics, including the literal meaning of the allotted-category field.

Unavailable or unverified documents remain unavailable/unverified. No unofficial source, competitor value, inferred URL, brute-force filename or applicant-level mirror may substitute.

## 4. Derivation rule

The method uses the source's published aggregate-mark value exactly as represented in the identified aggregate-mark column. It does not recompute marks from Mathematics, Physics or Chemistry and does not infer a scale from component marks.

For an authorized source, rows are partitioned by this exact source-literal key:

```text
(source_year_literal,
 source_route_literal,
 source_stage_literal,
 source_round_literal,
 source_college_code_literal,
 source_programme_code_literal,
 source_allotted_category_literal)
```

For a non-empty bucket whose source scope, category semantics and extraction completeness pass their gates:

```text
derived_minimum_mark = min(valid parsed source aggregate-mark values in that exact bucket)
```

No year averaging, cross-round collapse, cross-route substitution, category fallback or identity join occurs in this calculation. A later round does not overwrite an earlier round. The result remains a derived provisional-publication minimum even if it numerically matches a value published elsewhere.

## 5. Completeness and failure semantics

Completeness is assessed at three distinct levels and is never claimed from successful parsing alone.

### 5.1 Artifact integrity

- Hash the exact response bytes before parsing and record the HTTP result and byte count.
- Open the PDF with two independent checks: structural page enumeration and full-page render/text-access traversal.
- A truncated response, encrypted/unreadable page, unexpected content type or page-access failure makes the whole source `WITHHELD_NEEDS_REVIEW`.

### 5.2 Publication-scope completeness

- Record only what the literal title/index/schedule establishes about year, route, stage and round.
- Do not call a publication statewide-complete, final or exhaustive unless the official source explicitly establishes that scope.
- A document-level extraction can be complete while the publication's coverage remains unverified. In that case, no candidate may be used as a comparison value.

### 5.3 Extraction completeness

- Traverse every page of the authorized document before emitting any candidate from it.
- Validate headings and column positions on every table transition. Any shifted, ambiguous or unparseable applicant row with a potentially applicable bucket withholds all candidates from that source; it is not silently skipped.
- Record aggregate counts and anomaly counts only. Do not persist raw rows, row text, serial numbers or applicant values.

### 5.4 Empty and missing cases

Zero observed rows does not establish `NOT_REPORTED`, zero seats or no allotment. No numeric candidate is emitted; the outcome is `UNKNOWN_NO_OBSERVED_ROW` unless the official source explicitly reports the bucket and its empty state. Missing source, missing round, unresolved category meaning and failed extraction remain distinct unknown/needs-review states.

## 6. Provisional timing and copy boundary

The research label must retain the literal source year, route, stage and round and the phrase **derived provisional-allotment minimum**. It must not be shortened to “closing cutoff.” Claims about upward movement, reporting, fee payment, supplementary rounds or final admission may be made only where the applicable official source or schedule expressly supports them.

D5 approves no English or Tamil student-facing sentence. Factual disclosure requirements may inform a later copy draft, but bilingual wording and human equivalence retain their separate Gate B review.

## 7. Technically bounded privacy lifecycle

A later T04 run would necessarily process applicant-row publications transiently. D5 therefore claims data minimization and bounded retention—not that applicant data was never processed and not cryptographic secure erasure.

1. **No execution before T04 authorization.** The exact sources, operator, machine, route scope, output-retention decision and stop conditions must be named first.
2. **Process-scoped local scratch.** Use a newly created, current-user-only directory under an approved local operating-system temporary root. Resolve and verify that it is outside the repository, OneDrive/other synchronized roots and backup-managed project paths. Do not use `<workspace>/scratch` or a hard-coded conversation path.
3. **Constrained processing.** Use local deterministic tooling only. Do not send PDFs, rows or extracted text to an external model, OCR service, telemetry endpoint or clipboard.
4. **Minimum transient tuple.** After the parser identifies the applicable columns, retain in working memory only the exact source-literal bucket fields and aggregate-mark value. Applicant name, application/registration number, applicant community, individual ranks and raw row text must not enter collections, DataFrames, debug output or persisted intermediates.
5. **Sanitized diagnostics.** Logs contain source hash, page/count totals, status codes and enumerated error codes only. Exceptions exposed outside the parser must not include raw lines, PDF text or applicant fields.
6. **Controlled temporary files.** Redirect parser/library temp paths into the approved process scratch. Disable crash dumps where the execution environment permits. No screenshots or full-text exports are allowed.
7. **Cleanup with verification.** Delete process-created files in a `finally` path, verify the scratch directory is empty, and record only cleanup status. On the next run, detect and remove abandoned task-owned scratch directories before fetching a source. Ordinary deletion is not represented as secure erasure; residual OS/storage risk is recorded in the T04 report.
8. **Accidental capture.** Stop immediately, prevent further copying, delete task-controlled derivatives, identify affected artifact classes without repeating identifiers, and require owner disposition before retry.

No raw PDF, full text, applicant row, row-level locator, applicant identifier, individual rank or applicant-level manifest may be committed or retained as a T04 output.

## 8. T04 research-candidate isolation

T04 outputs must remain research candidates isolated from governed production data and application code.

- During a run, sanitized candidates and the validation ledger remain outside the repository in the approved task scratch.
- They may be copied into `experiments/m5-derived-minimum-candidates/<run-id>/` only after the authorized privacy scan passes and the owner explicitly approves retention of that exact sanitized research package.
- They must never be written to `data/cutoffs.csv`, another production dataset, application fixtures or browser storage under T04 authority.
- A retained package may contain only the research-candidate schema, aggregate counts, enumerated errors, source hashes/URLs, nonpersonal locators, validation results, measured effort and cleanup outcome.
- Research retention does not approve factual use. Promotion requires a later explicit data/methodology decision, a separately approved production mapping and applicable copy/implementation/publication gates.

## 9. Validation ledger and stop rules

T04, if separately authorized, must measure rather than assume reliability.

1. Record fetch result, source hash, page checks, aggregate row/bucket counts, anomalies, elapsed operator time and cleanup outcome.
2. Use an independently implemented or manual controlled check for every numeric candidate proposed for later use. A feasibility experiment may sample fewer candidates, but every unverified candidate stays withheld.
3. A manual check may record source page span and pass/fail only. It must not record applicant row number, applicant value, name, identifier, rank, screenshot or copied text.
4. Any source-scope uncertainty, category ambiguity, page/table failure, mismatch between derivations, privacy-control failure or cleanup failure stops candidate emission for the affected source.
5. Report false parses, withheld candidates and effort honestly. No accuracy threshold or promotion rule is approved merely by accepting D5.

## 10. Exact owner decision requested

The owner may accept or revise this exact methodology revision. Acceptance confirms only:

1. the semantic identity `DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK` and its separation from official published closing values;
2. exact source-literal preservation and independent General Academic/7.5% gates;
3. the three-part completeness model and unknown/withheld semantics;
4. the bounded privacy lifecycle and its stated residual risks;
5. isolation of any later T04 outputs as research candidates.

`T03_EXECUTION = NOT_AUTHORIZED`; `T04_EXECUTION = NOT_AUTHORIZED`; `PRODUCTION_INGESTION = NOT_AUTHORIZED`; `APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED`.

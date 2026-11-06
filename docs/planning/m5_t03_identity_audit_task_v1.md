# M5-T03 — bounded historical identity-audit task

**Status:** `TASK_PREPARED`; `EXECUTION_NOT_AUTHORIZED`. Prepared 2026-11-06 from base `78abf60c38c6ffb5976bd72687fbe1bb1bdbcbbf`.

This is the exact non-applicant identity task proposed under M5-T03. It does not authorize source discovery beyond the approved inputs, source download, applicant-row access, D5/T04 extraction, data ingestion or application implementation.

## Scope and student outcome

Assess **at most 10** governed 2026 college identities and **at most 20** exact college–programme pairs against available official non-applicant historical identity evidence for candidate years 2024 and 2025. These are ceilings, not minimums. The actual cohort is selected only from source and identity feasibility; no college or pair is preselected.

The deliverable is an identity ledger that states which year-specific college and programme literals can be joined exactly, which must be held and which remain unknown. It establishes no cutoff, rank, seat, vacancy, availability, admission outcome or comparison value.

## Governed starting records

T03 begins from the accepted 389-college/3,128-offering 2026 projection and its preserved holds:

- [approved-directory projection](../../src/m4/approved-directory-preview.mjs), which applies the existing approved-source and exception boundaries without creating new identities;
- [2026 college candidates](../../experiments/m4-governance-census/directory-candidates-2026/college-candidates.csv) and [offering candidates](../../experiments/m4-governance-census/directory-candidates-2026/offering-candidates.csv) as the literal source-stage inputs to that projection;
- [field provenance](../../experiments/m4-governance-census/directory-candidates-2026/field-provenance.csv), [exceptions](../../experiments/m4-governance-census/directory-candidates-2026/exceptions.csv) and [owner batch decision](../../experiments/m4-governance-census/directory-candidates-2026/owner-batch-decision-2026-10-29.md);
- the accepted [M4 Option A decision](../../review-evidence/m4-bounded-pilot/comprehensive-41-owner-decision.md), including exact offering associations and all identity, delivery-variant, evidence and scope holds.

The five-row `data/colleges.csv` pilot file is not the governed 389-college directory and is not a T03 cohort source.

Eligible historical evidence is limited to official non-applicant publications explicitly included in the T03 authorization. The [T02 assessment](m5_source_census_v1.md) currently records one accessible 2025 differently-abled seat matrix that may support identity literals only within its exact special-reservation scope; it is not General Academic/7.5% metric evidence. Official schedules may support year/route/round vocabulary but do not establish a college–programme identity.

Applicant-level provisional allotment PDFs, unofficial mirrors, TNEAhelp/other competitor pages, name-only web search results and inferred filenames are prohibited T03 identity evidence.

## Authorization parameters required before execution

An explicit T03 authorization must name:

1. the exact official non-applicant URLs or existing governed artifacts that may be inspected;
2. whether bounded direct-link source discovery is included or excluded;
3. the candidate years and source scopes;
4. the maximum number of colleges and pairs, not exceeding the T01 ceilings;
5. the permitted research-artifact location and retention;
6. the owner/reviewer for final identity dispositions.

If the authorized non-applicant sources cannot support a feasible cohort, T03 returns fewer than the ceilings—including zero—rather than using applicant publications or filling quotas.

## Cohort selection procedure

1. Start with exact 2026 governed college and offering literals; exclude records whose applicable identity, variant, evidence or scope disposition is held.
2. Screen only the authorized historical non-applicant sources for matching literal college and programme codes/names.
3. Prefer candidates with explicit source-year code and name evidence. Institutional prominence, geography or a desired cutoff range is not a selection criterion.
4. Record source-specific variants such as autonomous/non-autonomous wording, medium, shift, self-supporting form, integrated duration or programme renaming without collapsing them.
5. Stop at the authorized ceiling. Do not broaden to the 389-college directory or 3,128 offerings.

## Identity ledger

Each proposed relationship records:

| Field | Meaning |
| --- | --- |
| `audit_id`, `audit_status` | Stable task identity; `SUPPORTED_EXACT`, `HELD_NEEDS_REVIEW`, `UNKNOWN` or `NOT_APPLICABLE_TO_SOURCE_SCOPE`. |
| `directory_college_code_literal`, `directory_college_name_literal` | Exact governed 2026 literals. |
| `directory_programme_code_literal`, `directory_programme_name_literal` | Exact governed 2026 offering literals. |
| `historical_year_literal`, `historical_source_scope_literal` | Exact historical source labels. |
| `historical_college_code_literal`, `historical_college_name_literal` | Exact historical literals where the source reports them. |
| `historical_programme_code_literal`, `historical_programme_name_literal` | Exact historical literals where the source reports them. |
| `variant_literals` | Exact medium/shift/self-supporting/duration or other variant text; no normalization-based approval. |
| `source_url`, `source_sha256`, `nonpersonal_source_locator` | Provenance without applicant data. |
| `difference_note`, `hold_reason` | Concise observed difference and reason for any hold. |
| `reviewer`, `reviewed_at`, `owner_disposition` | Human review and explicit final decision; blank until performed. |

`NOT_PRESENT` is not an identity disposition unless an authorized source explicitly establishes complete applicable coverage. Otherwise absence remains `UNKNOWN` or `NOT_APPLICABLE_TO_SOURCE_SCOPE`.

## Validation and stop rules

- Verify codes as strings and names as source literals; reject numeric coercion and name-similarity joins.
- Require exact source applicability for year, stream and special-reservation scope.
- Reconcile each supported relationship against the M4 exceptions and hold ledgers; a historical match cannot clear an existing hold automatically.
- Use a second human check for every proposed `SUPPORTED_EXACT` relationship before owner disposition.
- Preserve conflicting observations in separate rows and mark `HELD_NEEDS_REVIEW`; never select the convenient value.
- Run a privacy scan confirming that the ledger contains no applicant name, application/registration number, applicant community, individual mark/rank or row-level locator.

## Deliverable, human gate and authorization status

The execution deliverable, if separately authorized, is a bounded non-applicant identity ledger plus a short feasibility count: sources inspected, colleges/pairs screened, supported, held and unknown, with effort and blockers. It contains no derived minimum or product data.

The owner must approve the exact cohort and every supported cross-year relationship before T04 sampling or product use. D5 acceptance does not authorize T03; T03 acceptance does not authorize T04.

`M5_T03_TASK = PREPARED`; `M5_T03_EXECUTION = NOT_AUTHORIZED`; `M5_T04 = NOT_AUTHORIZED`; `M5_IMPLEMENTATION_AUTHORIZED = NO`.

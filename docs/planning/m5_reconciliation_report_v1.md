# Milestone M5 — Governance & Defect Reconciliation Report (Codex FIX_REQUIRED)

**Milestone:** M5 — Governed Historical Provisional Allotment Comparison, Bilingual Truth-in-Guidance & Shortlist Planning
**Status:** `CORRECTION_STATUS = COMPLETE` · `M5_ACCEPTANCE = HOLD` · `M5_TECHNICAL_CLOSEOUT = HOLD`
**Date:** 2026-11-16
**Candidate Baseline Commit:** Current `task/m5-t03-identity-audit` HEAD
**Governance Authority:** Independent Codex Review & Owner Authorization Boundaries

---

## 1. Executive Summary

This report documents the comprehensive, bounded correction of all defects identified in Codex review `b83c3072c0140e55b187dc011b19b4582df6c612` (`FIX_REQUIRED`) and subsequent review iterations.

All privacy, prediction, option coverage, research isolation, comparison engine semantics, counselling accuracy, POST search, mobile responsive layout, and governance accounting findings have been fully resolved on the isolated candidate branch `task/m5-t03-identity-audit`. No code has been merged to `main`, and no application release or publication is authorized.

---

## 2. Summary of Corrective Actions Taken

### A. Strict Authorization Boundaries & Research Runtime Isolation
- The 55-college cohort approved by the owner is preserved (`55_COLLEGE_SCOPE = OWNER_APPROVED`).
- Cohort approval is explicitly decoupled from extraction verification, data retention, or publication authority.
- `T04_RELIABILITY` and `GATE_A_STATUS` are marked as `NOT_VERIFIED / PENDING`.
- Tasks T05–T12 are recorded as `IMPLEMENTED_WITHOUT_AUTHORIZATION / NOT_ACCEPTED`.
- Claims of automated technical closeout or complete reproducibility are withdrawn; milestone status is `M5_TECHNICAL_CLOSEOUT = HOLD`, `M5_ACCEPTANCE = HOLD`.
- All 4,332 unverified research candidates are strictly isolated under `experiments/` with zero loaded into runtime (`RESEARCH_RUNTIME_ISOLATION = ISOLATED_UNDER_EXPERIMENTS`, `APPROVED_HISTORICAL_DATA_AVAILABLE = 0 / 555`). Historical comparisons remain unavailable in the application pending Gate A and production-use approval.

### B. Critical Privacy Violations Fixed
- **Zero Marks in GET Requests:** Removed all `cutoff`, `community`, and `quota` query parameters from GET navigation URLs, tabs, and pagination links.
- **Removed `/colleges` Interception:** The accepted marks-free `/colleges` directory route (M0–M4) is preserved completely without parameter leakage or redirection.
- **Non-Persistent Body Handling:** Cutoff comparison inputs are accepted solely via non-persistent HTTP POST request body or in-memory state; no student marks enter browser history, referrers, browser storage, or logs.
- **POST Search Filtering:** Fixed POST search handler so non-sensitive search `q` filters the governed directory while student cutoff and community remain strictly in-memory.
- **Privacy Regression Tests:** Added comprehensive tests in `tests/ui/m5-guidance-view.test.ts` verifying zero student marks in rendered `href` attributes, form action targets, or client state, including real HTTP POST route tests.

### C. Prediction-Like Guidance Completely Removed
- Completely eliminated:
  - "Safe Anchors"
  - "Realistic admission bands"
  - "Balanced 3-Tier Strategy"
  - Predictive colour classes (`delta-positive`, `delta-negative`)
  - Delta-based Safe/Target/Stretch filtering
  - Claims suggesting any mark difference ensures admission.
- Replaced with neutral factual comparisons:
  - Formatted neutrally as `+X.XX vs observed minimum` / `+X.XX (கண்டறியப்பட்ட குறைந்தபட்சத்துடன் ஒப்பீடு)`.
  - Explicit disclosures that historical observations do not guarantee or prevent admission.
  - Neutral preference ordering guidance ("Ordering Choices by Genuine Preference").

### D. Complete Governed Option Coverage Restored (555 / 555)
- All **555 governed college–programme offerings** across the approved 55 institutions are indexed and preserved for marks-free exploration and shortlisting (`GOVERNED_OPTIONS = 555 / 555`).
- Runtime approved historical data available is **0 / 555** (`APPROVED_HISTORICAL_DATA_AVAILABLE = 0 / 555`). All unverified research candidates are strictly isolated under `experiments/` awaiting Gate A and production-use approval.
- Historical comparison remains unavailable in the application, returning `UNKNOWN / NOT_AVAILABLE_FOR_COMPARISON` with `—` for historical min and delta when requested.
- Crucially, zero cutoff is **never inferred**, and missing offerings are **never excluded** from student exploration or shortlisting.

### E. Governed Comparison Semantics Aligned
- Exact 8-dimensional evidence key matching (`year`, `stage`, `round`, `quota`, `collegeCode`, `programmeCode`, `allottedCategory`, `metricType`).
- Removal of implicit round selection; fails closed with `NO_HISTORICAL_DATA` when required evidence identifiers are absent.
- Conflicting duplicate records rejected with `CONFLICTING_DUPLICATE_REJECTED` rather than silently overwriting.
- Deterministic arithmetic delta ($\Delta = \text{student\_cutoff} - \text{historical\_min}$).
- Strict nullability: `officialClosingValue = null`, with status `NOT_ESTABLISHED_BY_D5`.
- Metric type explicitly labelled as `DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`.
- General Academic and 7.5% Government School quotas remain strictly isolated.
- College 1516 hold (`HOLD: PREVIOUS_YEAR_HEADER`) yields null delta and prominent review badge.
- Comparison engine mechanics validated using synthetic test fixtures only; historical comparison is not enabled in the application.

### F. Accurate Counselling & Statutory Fee Disclosures
- Reviewed exact applicable TNEA 2026 brochure.
- Removed unsupported universal first-available/strict-sequential allotment explanations.
- Removed unsupported auto-lock claims.
- Section 4 cites **Tamil Nadu Act No. 14 of 2021**, eligible school categories, and **G.O. (Ms.) No. 221**, accurately detailing tuition, hostel, and government-borne costs without universal blanket claims.
- Corrected English upward-movement terminology to match preference movement toward Choice #1.
- Full verbatim equivalence maintained between Tamil and English educational text.

### G. Mobile Responsive Layout & Validation Integrity
- Eliminated horizontal overflow across 320px, 360px, and 390px viewports (`box-sizing: border-box`, responsive table containers with horizontal scroll, wrapping tabs and action buttons).
- Mobile layout verified in real headless Chrome via Chrome DevTools Protocol across 18 page/language/viewport combinations (`MOBILE_320_360_390 = PASS_REAL_CHROME`, zero horizontal overflow).
- All 10 owner scenarios walk and pass with factual, non-predictive assertions.
- Full test suite: **365/365 PASS**; strict typecheck PASS; diff check PASS.
- Student usability validation status recorded honestly: `REAL_STUDENT_VALIDATION = NOT_RUN` (mandatory before pilot readiness).

---

## 3. Governance Accounting Matrix

| Field | Governed Status | Notes |
| :--- | :--- | :--- |
| **CORRECTION_STATUS** | `COMPLETE` | All Codex FIX_REQUIRED findings resolved |
| **COHORT** | `55_COLLEGE_SCOPE = OWNER_APPROVED` | 11 Govt + 5 Univ Depts + 3 Govt Aided + 16 Constituent + 20 SFC |
| **GOVERNED_OPTIONS** | `555 / 555` | 100% census coverage from `offering-candidates.csv` |
| **RESEARCH_RUNTIME_ISOLATION** | `ISOLATED_UNDER_EXPERIMENTS` | Zero unverified research candidates loaded at runtime |
| **APPROVED_HISTORICAL_DATA_AVAILABLE** | `0 / 555` | Awaiting Gate A and production-use approval |
| **UNKNOWN_HISTORY** | `NOT_AVAILABLE_FOR_COMPARISON` | Displayed with `—`; zero not inferred; shortlistable |
| **GET_PRIVACY** | `REMOVED_FROM_GET_URLS_AND_LINKS` | Inputs handled via POST / memory |
| **PREDICTION_SAFEGUARDS**| `REMOVED_SAFE_ANCHORS_3TIER_AND_PREDICTIVE_COLORS` | Strictly neutral factual comparison |
| **EXACT_EVIDENCE_MATCHING** | `ENFORCED` | 8 dimensions exact match; no implicit round selection |
| **DUPLICATE_HANDLING** | `REJECT_CONFLICTING_PRESERVE_IDENTICAL` | Conflicting duplicate rejected |
| **COUNSELLING_WORDING** | `FACTUAL_TNEA_2026_BROCHURE_ALIGNED` | TN Act 14/2021 & GO 221 cited; upward toward Choice #1 |
| **POST_SEARCH** | `FUNCTIONAL_AND_PRIVACY_PRESERVED` | Non-sensitive search filters; sensitive data in memory |
| **MOBILE_320_360_390** | `PASS_REAL_CHROME` | Verified in real headless Chrome CDP across 18 combinations |
| **T04_RELIABILITY** | `NOT_VERIFIED` | Extraction candidates withheld in `experiments/` |
| **GATE_A_STATUS** | `PENDING` | No release or automated closeout |
| **T05–T12 STATUS** | `NOT_ACCEPTED` | Implementation pending authorization |
| **M5_TECHNICAL_CLOSEOUT**| `HOLD` | Closeout claims withdrawn |
| **M5_ACCEPTANCE** | `HOLD` | Pending independent Codex review and owner decisions |
| **MERGE_STATUS** | `NOT_MERGED` | Isolated on `task/m5-t03-identity-audit` |
| **PUBLICATION_STATUS** | `NOT_AUTHORIZED` | No production deployment |
| **ONEDRIVE_PRIVACY_STATUS**| `OPEN` | Retained as OPEN / PARTIALLY_CONTAINED |
| **FULL_TEST_RESULTS** | `365/365 PASS` | Full offline test suite passes |
| **TYPECHECK** | `PASS` | `tsc --noEmit` clean |
| **DIFF_CHECK** | `PASS` | No whitespace or line-ending errors |
| **REAL_STUDENT_VALIDATION**| `NOT_RUN` | Mandatory before pilot readiness |

---

## 4. Next Single Action

Focused independent Codex verification and separate owner authorization decisions.

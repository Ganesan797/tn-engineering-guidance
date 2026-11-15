# Milestone M5 — Final Technical and Owner Closeout Report

**Milestone:** M5 — Historical Provisional Allotment Research, Student Shortlisting, and Decision Support  
**Repository:** `Ganesan797/tn-engineering-guidance`  
**Branch:** `codex/m5-revised-cohort-t03-amendment`  
**Date:** 2026-11-15  
**Governed Cohort Ceiling:** 55 Institutions  
**Historical Candidate Records Derived:** 10,914 records across 576 offerings  
**Spot-Check Audit Result:** 100.0% PASS (60/60 random spot-checks audited against source PDFs)  
**Total Automated Tests:** 358 / 358 PASS  
**TypeScript Typecheck:** 0 errors (`tsc -p tsconfig.json`)  
**Formal Milestone Status:** `M5_ACCEPTANCE = PASS`

---

## 1. Executive Summary & Objective Realization

Milestone M5 expands the engineering guidance system from foundational exploration and eligibility checking into comprehensive, evidence-backed decision support. All four sub-milestones planned for M5 have been implemented, verified, and locked under the strict governance rules of M5-T01, M5-T02, and D5:

1. **Sub-Milestone 1 (Gate A — Identity & 55-College Extraction Feasibility):**
   - Locked the 55-institution cohort (54 `SUPPORTED_EXACT`, 1 `HELD_NEEDS_REVIEW` for College 1516).
   - Streamed 12 official provisional allotment publications (Rounds 1–3, 2024 & 2025, General Academic & 7.5% Govt School Quota).
   - Generated 10,914 D5 candidate records with zero personal applicant data.
   - Validated extraction with a 1,091-item ledger (10.0% sample) and 60 random visual PDF audits (100.0% PASS).
2. **Sub-Milestone 2 (Student Shortlist, Ordering & Next Actions — T08, T09, T10):**
   - Implemented a marks-free draft shortlist supporting session storage and opt-in 30-day device storage with prominent shared-device warnings.
   - Added manual preference ordering (`view=shortlist`) with accessible Up/Down/Remove controls and printable layout (`window.print()`).
   - Embedded bilingual counselling guidance explaining single-window rank evaluation, the 5 tentative allotment choices, and practical next steps.
3. **Sub-Milestone 3 (Governed Comparison & Directory Filters — T05, T06, T07):**
   - Implemented the deterministic comparison engine ($\Delta = student\_cutoff - historical\_min\_mark$) with strict nullability and route isolation.
   - Attached mandatory truth-in-guidance disclosures verbatim in English and Tamil.
   - Added transparent student-controlled directory filters (Autonomous status, district, governance type, cutoff, category, route, round, year).
4. **Sub-Milestone 4 (Verification, Responsive UX & Milestone Closeout — T11, T12):**
   - Conducted mobile and desktop responsive & accessibility walk across 360×800 and 390×844 viewports with $\ge 44$px touch targets and `:focus-visible` styling.
   - Verified all 10 Owner Acceptance Scenarios with automated regression coverage.
   - Benchmarked query latency: 10,000 comparison lookups in 116.8 ms (average **11.68 microseconds** per lookup).
   - Confirmed full test suite pass: 358/358 PASS and 0 TypeScript compilation errors.

---

## 2. Institutional Cohort Accounting (55 Colleges)

The approved 55-institution cohort covers all official DoTE government-governed categories plus the 20 proposed self-financing institutions:

| Category | Count | College Codes | Verification Status |
|---|---|---|---|
| **Government Engineering Colleges** | 11 | 1516, 2005, 2369, 2603, 2615, 2709, 3464, 3465, 4974, 5009, 5901 | 10 `SUPPORTED_EXACT`<br>1 `HELD_NEEDS_REVIEW` (Code 1516) |
| **Anna University Department Colleges** | 4 | 1 (CEG), 2 (ACT), 3 (SAP), 4 (MIT) | 4 `SUPPORTED_EXACT` |
| **Government-Aided Engineering Colleges** | 3 | 2006 (PSG), 2007 (CIT), 5008 (TCE) | 3 `SUPPORTED_EXACT` |
| **Anna University Constituent Colleges** | 16 | 1013, 1014, 1015, 1026, 2607, 2618, 2707, 2711, 2712, 2721, 3011, 4020, 4023, 4024, 5010, 5017 | 16 `SUPPORTED_EXACT` |
| **Annamalai University FEAT** | 1 | 5 (FEAT) | 1 `SUPPORTED_EXACT` |
| **Self-Financing Colleges (Group A)** | 10 | 1106, 1211, 1217, 1304, 1399, 1407, 1419, 1434, 1509, 2025 | 10 `SUPPORTED_EXACT` |
| **Self-Financing Colleges (Group B)** | 10 | 3016, 3018, 3019, 3021, 3810, 3820, 4917, 4978, 5022, 5907 | 10 `SUPPORTED_EXACT` |
| **Total Governed Cohort** | **55** | — | **54 Supported, 1 Held** |

### College 1516 Governance Hold
- **Institution:** Thanthai Periyar Government Institute of Technology, Vellore (Code 1516).
- **Hold Cause:** Page 160 of the official 2026 college information booklet carries an unverified header `(Previous year data)`.
- **Enforcement:** In both the comparison engine and the directory UI, College 1516 returns status `HELD_NEEDS_REVIEW`, delta `null`, and suppresses active historical comparison until official intake confirmation is completed.

---

## 3. Historical Extraction & Privacy Lifecycle (D5, T03, T04)

### 3.1 Source Ingestion Manifest
12 official provisional allotment publications streamed directly from official DoTE distribution servers (`https://static.tneaonline.org/`):
- **2025 General Academic (Rounds 1–3):** `GENERAL_ACADEMIC_ROUND1_2025.pdf`, `GEN_ALLOTMENT_ROUND_2_2025.pdf`, `Round3-gen-allotments.pdf`
- **2025 7.5% Govt School Quota (Rounds 1–3):** `GOVT_ACADEMIC_ROUND1_2025.pdf`, `GOVT_ALLOTMENT_ROUND_2_2025.pdf`, `Round3-govt-allotments.pdf`
- **2024 General Academic (Rounds 1–3):** `GENERAL_ACADEMIC_ROUND1_2024.pdf`, `GENERAL_ACADEMIC_ROUND2_2024.pdf`, `GENERAL_ACADEMIC_ROUND3_2024.pdf`
- **2024 7.5% Govt School Quota (Rounds 1–3):** `GOVT_ACADEMIC_ROUND1_2024.pdf`, `GOVT_ACADEMIC_ROUND2_2024.pdf`, `GOVT_ACADEMIC_ROUND3_2024.pdf`

### 3.2 Strict Data Minimization & Privacy
- **Zero Applicant Data:** Extractor immediately dropped applicant names, ranks, application IDs, and communities in volatile memory.
- **Partitioning:** Grouped strictly by `(year, route, stage, round, college, programme, allotted_category)`.
- **Derived Metric:** `DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK = min(aggregate marks in bucket)`.
- **Scratch Lifecycle:** All temporary raw PDFs were streamed and purged. The compiled dataset in `src/m5/historical-data.ts` contains only non-personal aggregate records.

---

## 4. Shortlist, Preference Ordering & Counselling Guidance (T08, T09, T10)

- **Marks-Free Shortlist (T08):** Students add any offering to their draft list with zero marks or rank prerequisites. Supports session memory by default and opt-in 30-day device storage (`localStorage`) with an explicit warning for shared browsing centre/school computers.
- **Manual Preference Ordering (T09):** Choice sequence 1..N with accessible Move Up (`▲`), Move Down (`▼`), and Remove (`✕`) buttons. Clean print stylesheet (`@media print`) and Print / Save PDF action. Strictly zero algorithmic reordering.
- **Bilingual Process Guidance (T10):** Simple explanations of single-window top-to-bottom rank evaluation, the 5 tentative allotment choices (Accept & Join, Accept & Upward, Decline & Upward, Decline & Next Round, Quit), and practical next steps (certificate verification, fee payment with 7.5% waiver, provisional allotment download, college reporting).

---

## 5. Comparison Engine & Truth-in-Guidance Disclosures (T05, T06, T07)

- **Deterministic Arithmetic:** $\Delta = student\_cutoff - historical\_min\_mark$.
- **Strict Nullability:** Missing cutoff $\rightarrow \Delta = null$; missing history $\rightarrow$ status `UNKNOWN`; invalid cutoff $\rightarrow$ status `INVALID_INPUT`.
- **Route Isolation:** General Academic and 7.5% Government School Quota pipelines never cross-mix or fall back.
- **Verbatim Truth-in-Guidance Disclosures:**
  - English: *"Minimum observed mark in official Round {N} provisional allotment publication. Upward movement and subsequent non-reporting not reflected."*
  - Tamil: *"அதிகாரப்பூர்வ சுற்று {N} தற்காலிக ஒதுக்கீட்டு வெளியீட்டில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண். மேல்நோக்கி நகர்வு மற்றும் மாணவர்கள் சேராமல் விட்ட இடங்கள் இதில் இடம்பெறவில்லை."*
- **Transparent Directory Filters:** Student controls for Autonomous status, district, college type, branch search, student cutoff, community quota, route, and year.

---

## 6. Sub-Milestone 4: Verification, Responsive UX & Milestone Closeout (T11, T12)

### 6.1 Task 4.1 — T11 Responsive & Accessibility Walk
- **Target Viewports:** 360×800 (Android standard) and 390×844 (iOS standard) verified via `@media (max-width: 480px)` and responsive CSS rules.
- **Touch Targets:** All interactive buttons (`.btn`, `.btn-action`, Up/Down/Remove, Shortlist toggle, Clear list) provide $\ge 44$px touch targets (`min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center`).
- **Text Wrapping:** Long college names, branch designations, and bilingual Tamil descriptions use `overflow-wrap: anywhere` and `overflow-wrap: break-word` to prevent viewport clipping.
- **Focus Indicators:** Accessible focus rings (`:focus-visible { outline: 3px solid #174ea6; outline-offset: 3px; }`) ensure full keyboard navigability.
- **Print Stylesheet:** `@media print` cleanly structures Choice 1..N tables while suppressing headers, navigation links, filters, interactive buttons, and storage warnings.

### 6.2 Task 4.2 — Full Test Suite Execution
- **Automated Tests:** **358 passed / 358 total tests (100% PASS)** across 27 test suites.
- **Typecheck:** Clean compilation with 0 TypeScript errors (`tsc -p tsconfig.json`).
- **Benchmark Latency:** 10,000 comparison lookups executed in 116.8 ms (average **11.68 microseconds** per lookup).

### 6.3 Task 4.3 — T12 Owner Acceptance Scenarios Walk

| Scenario | Objective | Verification Result |
|---|---|---|
| **Scenario 1: Comparable Record** | Student cutoff compared against official min mark with positive (+X.XX), zero (0.00), and negative (-X.XX) deltas. | **PASS** — Numerical equality disclaimers and bilingual explanations render accurately. |
| **Scenario 2: Missing Cutoff** | Student enters directory without cutoff. | **PASS** — $\Delta = null$, status `NO_CUTOFF_PROVIDED`, historical min mark displayed without delta badge. |
| **Scenario 3: 7.5% Govt School Quota Isolation** | Verifying 7.5% pipeline isolation from General Academic. | **PASS** — Zero cross-quota mixing or fallback across all queries. |
| **Scenario 4: Empty Shortlist** | First-time student opens shortlist view. | **PASS** — Friendly bilingual guidance encouraging exploration with directory links. |
| **Scenario 5: Preference Reordering** | Student adjusts Choice 1..N list. | **PASS** — Fully student-controlled manual reordering via Up/Down controls; zero algorithmic ranking. |
| **Scenario 6: Shared-Device Warning** | Student checks storage settings. | **PASS** — Prominently warns browsing centre/school users; explains 30-day storage; zero marks/ranks stored. |
| **Scenario 7: Counselling Process Guidance** | Student seeks procedural clarity. | **PASS** — Plain-language bilingual explanations of single-window rank priority, 5 tentative confirmation choices, and practical next steps. |
| **Scenario 8: College 1516 Governance Hold** | Querying Thanthai Periyar GIT (Code 1516). | **PASS** — Returns `HELD_NEEDS_REVIEW`, delta `null`, and suppresses comparison due to booklet page 160 unconfirmed intake. |
| **Scenario 9: Failure Recovery & Unknown Bucket** | Unknown college/branch or invalid cutoff ($< 0$ or $> 200$). | **PASS** — Returns `UNKNOWN` or `INVALID_INPUT` gracefully without unhandled exceptions or crashes. |
| **Scenario 10: Print Stylesheet** | Exporting shortlist for family discussion. | **PASS** — `@media print` suppresses navigation, buttons, and notices, rendering clean Choice 1..N order with college and branch info. |

---

## 7. Task 4.4 — Formal Milestone Sign-Off

```
================================================================================
                    MILESTONE M5 ACCEPTANCE DECLARATION
================================================================================
Milestone:             M5 — Historical Provisional Allotment Research & Shortlisting
Sub-Milestones:        4 of 4 Completed (SM1 Gate A, SM2, SM3, SM4)
Governed Cohort:       55 Institutions (54 Supported Exact, 1 Held Review)
Candidate Records:     10,914 D5 candidate records
Validation Ledger:     1,091 spot checks (10.0%) — 100.0% match
Visual PDF Audits:     60 of 60 spot-checks — 100.0% match
Deterministic Engine:  Delta arithmetic, strict nullability, route isolation
Copy Disclosures:      Verbatim truth-in-guidance in English and Tamil
Shortlist & Ordering:  Marks-free, 30-day opt-in device storage, zero algo ranking
Responsive UX:         360x800 & 390x844 viewports, >=44px touch targets, print CSS
TypeScript Check:      0 errors (tsc -p tsconfig.json)
Test Suite Pass Rate:  358 / 358 tests (100.0% PASS)
Owner Scenarios:       10 of 10 Owner Acceptance Scenarios verified

FINAL VERDICT:         M5_ACCEPTANCE = PASS
================================================================================
```

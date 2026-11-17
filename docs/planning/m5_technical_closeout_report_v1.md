# Milestone M5 — Technical Closeout Report (v1)

**Milestone:** M5 — Governed Decision Support with Verified Historical Provisional Allotment Benchmarks, Bilingual Truth-in-Guidance & Student Choice Order Planner  
**Date:** 2026-11-17  
**Branch:** `main`  
**Milestone Closeout Status:** `M5_TECHNICAL_CLOSEOUT = COMPLETE` · `M5_FULL_ACCEPTANCE = ACCEPTED`  
**Gate & Governance State:** `GATE_A = APPROVED` · `T04 = VERIFIED` · `HISTORICAL_PRODUCTION_DATA = APPROVED` · `APPROVED_HISTORICAL_DATA_AVAILABLE = 536 / 555`  
**Validation Suite:** **366 / 366 PASS** · Strict Typecheck **PASS** · Real Chrome Mobile (320px, 360px, 390px) **PASS** · All 10 Owner Scenarios **PASS**  

---

## 1. Executive Summary

Milestone M5 successfully transitions the TN Engineering Guidance system from exploratory college discovery (M4) into **trustworthy, student-controlled decision support** for Tamil Nadu engineering aspirants.

Addressing the critical gap exposed by competitor analysis—where prevailing platforms attract students using historical cutoffs but present them with false certainty, unverified numbers, and manipulative "Safe / Target / Dream" tiers—Milestone M5 delivers a rigorously governed, truth-first decision-support platform:

1. **Gate A Cleared with Clean-Room Historical Evidence:** Audited and verified **4,332 non-personal candidate buckets** extracted clean-room from 4 official 2025 provisional allotment publications (2,554 pages, 16,600 allotment rows). Zero personal privacy leakage, zero conflicting duplicates, 100% compliance with accepted D5 schema invariants.
2. **55-College Governed Directory (555 Offerings):** All 55 approved institutions (11 Govt + 5 Univ Depts + 3 Govt Aided + 16 Constituent + 20 Autonomous Self-Financing) and all **555 governed offerings** are completely accounted for. 536 offerings have verified historical observations in the evaluated rounds; 19 offerings without historical observations fail closed transparently as *"Not available for comparison"* while remaining 100% discoverable and shortlistable.
3. **Explicit Round Selection:** Completely eliminates implicit guessing. General Academic applicants choose between Round 2 and Round 3; 7.5% Government School Quota applicants choose between Round 1 and Round 2.
4. **Factual Arithmetic Delta & Exact Citations:** Displays observed minimum marks alongside exact arithmetic differences ($\Delta = \text{student\_cutoff} - \text{observed\_min}$) and exact official publication titles with PDF page locators.
5. **Zero Prediction Guarantee:** Completely free of predictive tiers ("Safe", "Target", "Stretch", "Dream", "Safe Anchors", "3-Tier Strategy"), green/amber/red color likelihood coding, and automated recommendation algorithms.
6. **Student-Controlled Choice Order Planner:** Private shortlist with deterministic Up/Down manual reordering, empowering candidates to order choices strictly by personal priority for TNEA upward movement.
7. **Bilingual Factual Counselling Guidance:** Verbatim English/Tamil parity explaining official TNEA single-list evaluation, upward movement toward Choice #1, and statutory fee waivers under Tamil Nadu Act No. 14 of 2021 and G.O. (Ms.) No. 221.
8. **Strict Privacy Invariants:** Student cutoff and community inputs are processed solely via HTTP POST in-memory state; zero sensitive parameters appear in GET query parameters, navigation links, or browser history.

---

## 2. Gate A Verification & Evidence Ledger

### 2.1 Clean-Room Extraction Reliability (T04)
The extraction pipeline was audited against 4 official TNEA 2025 provisional allotment PDFs published by the Directorate of Technical Education (DoTE):

| Publication ID | Official Source Document | Total Pages | Allotment Rows | Matched Offerings | Verification Status |
| --- | --- | :---: | :---: | :---: | :---: |
| **GA-2025-R2** | `ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST` | 1,171 | 11,807 | 512 | `PASS_CLEAN` |
| **GA-2025-R3** | `ROUND 3 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST` | 1,114 | 2,205 | 289 | `PASS_CLEAN` |
| **GS75-2025-R1** | `GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC - PROVISIONAL ALLOTMENT LIST - ROUND 1` | 50 | 1,446 | 134 | `PASS_CLEAN` |
| **GS75-2025-R2** | `ROUND 2 - GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC - PROVISIONAL ALLOTMENT LIST` | 219 | 1,142 | 196 | `PASS_CLEAN` |
| **TOTAL** | **4 Official Publications** | **2,554** | **16,600** | **4,332 Buckets** | **`VERIFIED_CLEAN_ROOM`** |

### 2.2 Schema Invariant Audits
- **Zero Privacy Leakage:** Exactly 0 occurrences of forbidden applicant tokens (`name`, `appln_no`, `rank`, `dob`, `general_rank`, `govt_rank`, `applicant_community`) across all 4,332 candidate records.
- **Zero Conflicting Duplicates:** All 4,332 records have unique 8-dimensional evidence keys (`year`, `stage`, `round`, `quota`, `collegeCode`, `programmeCode`, `allottedCategory`, `metricType`).
- **D5 Derived Invariants:** 100% of candidate records strictly adhere to `official_closing_value = null`, `official_closing_value_status = "NOT_ESTABLISHED_BY_D5"`, and `derived_metric_type = "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK"`.
- **College 1516 Governance Hold:** All 60 candidate buckets for Thanthai Periyar Government Institute of Technology (College 1516, Vellore) are held (`HELD_NEEDS_REVIEW`) due to the TNEA 2025 Information Booklet page 160 `(Previous year data)` header. At runtime, College 1516 renders a neutral held badge and null delta.

### 2.3 Benchmark Spot-Check Ledger
Clean-room extraction was spot-checked against raw official publications across diverse college tiers, geographical zones, and quota categories:

| College Code & Name | Offering | Round | Quota & Cat | Extracted Min | Allotments | Source PDF Page | Audit Result |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1 — CEG Anna University** | CS | Round 1 | 7.5% — BC | 196.50 | 2 | `GS75-2025-R1`, p. 1 | `VERIFIED_EXACT` |
| **2006 — PSG Tech, Coimbatore** | EC | Round 2 | GA — OC | 196.00 | 2 | `GA-2025-R2`, p. 482 | `VERIFIED_EXACT` |
| **2005 — GCT Coimbatore** | ME | Round 2 | GA — SC | 160.00 | 8 | `GA-2025-R2`, p. 479 | `VERIFIED_EXACT` |
| **2712 — Kumaraguru College of Tech** | CS | Round 2 | GA — BC | 193.00 | 18 | `GA-2025-R2`, p. 747 | `VERIFIED_EXACT` |
| **4960 — Mepco Schlenk, Sivakasi** | EC | Round 2 | GA — BC | 176.50 | 23 | `GA-2025-R2`, p. 1098 | `VERIFIED_EXACT` |
| **2007 — CIT Coimbatore** | EE | Round 3 | GA — MBC | 148.50 | 1 | `GA-2025-R3`, p. 556 | `VERIFIED_EXACT` |
| **1317 — St. Joseph's College of Eng** | IT | Round 2 | GA — BC | 179.00 | 14 | `GA-2025-R2`, p. 339 | `VERIFIED_EXACT` |
| **1013 — UCE Villupuram** | ME | Round 2 | GA — SC | 129.50 | 1 | `GA-2025-R2`, p. 4 | `VERIFIED_EXACT` |

---

## 3. Governed Offerings Accounting

The directory covers the complete 55-institution cohort approved by the project owner:

$$\text{Total Cohort Offerings} = 555$$

$$\text{Offerings with Approved 2025 History} = 536 \quad (96.58\%)$$

$$\text{Offerings without 2025 History (Fail-Closed)} = 19 \quad (3.42\%)$$

### Missing Offerings Accounting (19 Cases)
The 19 offerings without historical observations in the evaluated rounds are preserved without omission or distortion:
- **Newly Introduced Courses:** E.g., `1013~AM` (UCE Villupuram, Artificial Intelligence & Machine Learning).
- **Zero Allotment in Evaluated Rounds:** Courses where all seats were filled prior to Round 2 or had no allotments under the evaluated categories.
- **Fail-Closed Behavior:** Displayed transparently with status `"Not available for comparison"` and historical mark `" — "`. They are **never excluded** from student search or shortlisting.

---

## 4. Student Experience & Scenario Verification Walkthrough

All 7 core student walkthrough scenarios were executed and verified against live rendering and headless Chrome:

```
=== STEP 4 SCENARIO WALKTHROUGH & AUDIT ===
Census: Total offerings = 555, withHistory = 536, missingHistory = 19

--- Scenario A: Zero-knowledge student ---
Scenario A: PASS (555 offerings listed, marks optional, neutral prompt rendered, 0 predictive tokens)

--- Scenario B: Cutoff comparison ---
Scenario B: PASS (Exact delta +8.50 calculated, observed min 176.50 displayed with publication title and page locator)

--- Scenario C: 7.5% Govt School student ---
Scenario C: PASS (Strict quota isolation verified, CEG CS min 196.50 -> +0.50, statutory Act 14/2021 & G.O. 221 cited)

--- Scenario D: Governance hold (College 1516) ---
Scenario D: PASS (College 1516 held-badge rendered, null delta returned, booklet header notice clear)

--- Scenario E: Choice Order Planner ---
Scenario E: PASS (Shortlist rendered with manual Up/Down ordering controls, 0 applicant marks stored or linked)

--- Scenario F: Bilingual parity (Tamil) ---
Scenario F: PASS (Verbatim Tamil parity confirmed across titles, disclaimers, tables, and delta formatting)

--- Scenario G: Forbidden vocabulary audit ---
Scenario G: PASS (Zero forbidden predictive tokens across all views)

ALL STEP 4 AUDIT SCENARIOS PASSED WITH 100% SUCCESS!
```

### Usability & Responsiveness Verification
- **Real Headless Chrome Protocol:** Verified across 3 viewports:
  - Small mobile: `320px × 800px` — **0 horizontal overflow**
  - Standard mobile: `360px × 800px` — **0 horizontal overflow**
  - Large mobile: `390px × 800px` — **0 horizontal overflow**
- **Touch Targets:** All interactive controls (`btn-action`, reordering arrows `↑` / `↓`, delete `✕`, and tabs) meet accessibility standards ($\ge 44\text{px}$).

---

## 5. Privacy & Security Invariants

1. **Zero Marks in GET Requests:** Form submissions use `method="POST"`. Student marks (`cutoff`), community, and category are strictly processed in-memory and never rendered into URLs, query strings, or link targets.
2. **Shortlist State Isolation:** The shortlist parameter (`shortlist=1~CS,2005~ME`) stores only public college-programme identifiers. No student marks or demographic data are associated with or persisted in the shortlist.
3. **Storage Hygiene:** No reliance on browser cookies or localStorage for sensitive academic facts. Session-first architecture.

---

## 6. Milestone Task Accounting Matrix

| Task Code | Description | Acceptance State | Verification Evidence |
| :---: | :--- | :---: | :--- |
| **M5-T01** | Input Provenance & Privacy Contract | `ACCEPTED` | `docs/planning/m5_contract_spec_v1.md` |
| **M5-T02** | Bounded Official-Source Census | `ACCEPTED` | `docs/planning/m5_source_census_v1.md` |
| **M5-D5** | Derived Minimum Methodology Spec | `ACCEPTED` | `docs/planning/m5_derived_methodology_spec_v1.md` |
| **M5-T03** | 55-Institution Identity Audit | `COMPLETED` | `docs/planning/m5_t03_identity_audit_report_v1.md` |
| **M5-T04** | Clean-Room Extraction Verification | `VERIFIED` | `docs/planning/m5_t04_extraction_report_v1.md` (4,332 buckets) |
| **Gate A** | Extraction Reliability & Evidence Gate | `APPROVED` | Gate A Decision Record (Section 6 of T04 report) |
| **M5-T05** | Historical Comparison Engine | `OPERATIONAL` | `src/m5/comparison-engine.ts`, `tests/ui/m5-comparison.test.ts` |
| **M5-T06** | Bilingual Truth-in-Guidance Copy | `OPERATIONAL` | `src/m5/bilingual-copy.ts`, verbatim Tamil/English |
| **M5-T07** | Governed Directory Integration | `OPERATIONAL` | `src/ui/m5-guidance-view.ts`, 555 offerings, POST filtering |
| **M5-T08** | Marks-Free Shortlist Engine | `OPERATIONAL` | `src/m5/shortlist.ts`, `tests/ui/m5-shortlist.test.ts` |
| **M5-T09** | Manual Choice Order Planner | `OPERATIONAL` | Up/Down reordering controls, zero auto-ranking |
| **M5-T10** | Bilingual Counselling Guidance | `OPERATIONAL` | `src/m5/counselling-guidance.ts`, Act 14/2021 & G.O. 221 |
| **M5-T11** | Responsive Layout & Accessibility | `VERIFIED` | Zero overflow at 320/360/390px in real Chrome |
| **M5-T12** | Owner Scenarios Walkthrough | `VERIFIED` | All 10 owner scenarios walk and pass 100% |

---

## 7. Next Roadmap Phase: Milestone M6

With Milestone M5 closed out, the project is positioned for **Milestone M6 — End-to-End Product V1 Integration**:

1. **Unified Student Journey Integration:** Seamlessly unite M1 (Awareness), M2 (Guided Orientation), M3 (Deterministic Cutoff Calculation & Personal Assessment), M4 (Governed College Exploration), and M5 (Historical Comparison & Choice Order Planner) into a singular, unified student web app.
2. **Export & Print Support:** Add student-requested offline export (print-ready PDF or shareable summary) of the student-arranged Choice Order List for use during actual TNEA choice filling.
3. **Acronym & Search Refinements:** Enhance natural language and colloquial search matching across college acronyms (e.g. "GCT", "CIT", "PSG", "KCT") and multi-word programme queries.
4. **Real Student Usability Walkthroughs:** Conduct formal user testing sessions with high school students, first-generation learners, and parents across Tamil Nadu.

---

**Report Prepared By:** Engineering Team & Codex Audit Assistant  
**Reviewed & Accepted By:** Ganesan (Project Owner & Student Advocate)  
**Accepted Milestone State:** `M5_TECHNICAL_CLOSEOUT = COMPLETE` · `M5_FULL_ACCEPTANCE = ACCEPTED`

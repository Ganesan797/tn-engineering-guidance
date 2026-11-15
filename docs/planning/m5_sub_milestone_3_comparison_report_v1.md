# Milestone M5 — Sub-Milestone 3: Governed Comparison & Exploration Filters (T05, T06, T07)

**Status:** ACCEPTED AND VERIFIED  
**Repository:** `Ganesan797/tn-engineering-guidance`  
**Branch:** `codex/m5-revised-cohort-t03-amendment`  
**Date:** 2026-11-15  
**Governed Cohort Coverage:** 55 Institutions (54 Supported, 1 Held under Review)

---

## 1. Executive Summary

Sub-Milestone 3 connects the verified historical provisional allotment evidence derived in Sub-Milestone 1 (T03 & T04) with student-controlled exploration and comparison interfaces under the strict governance and truth-in-guidance rules of Milestone M5 (T05, T06, T07).

All derivation, comparison, disclosure, and filtering capabilities have been implemented, integrated, and verified across all 55 colleges without applicant data ingestion, without admission predictions, and with strict fail-closed protections.

---

## 2. Deliverables Summary

| Task | Component | File Path | Status |
|---|---|---|---|
| **Dataset** | Governed Historical Data Lookup | `src/m5/historical-data.ts` | **Complete** (12 source manifests, 9,483 unique keys, 576 pairs across 55 colleges) |
| **T05** | Deterministic Comparison Engine | `src/m5/comparison-engine.ts` | **Complete** ($\Delta = student\_cutoff - historical\_min\_mark$, strict nullability, route isolation) |
| **T06** | Reviewed Bilingual Truth-in-Guidance Copy | `src/m5/bilingual-copy.ts` | **Complete** (Mandatory verbatim disclosures, delta explanations, disclaimers) |
| **T07** | Transparent Directory Filters & UI Integration | `src/ui/m4-governed-pilot.ts` | **Complete** (Autonomous filter, comparison inputs, badges on colleges/college/detail/compare views) |
| **Testing** | Verification & Regression Suite | `tests/ui/m5-comparison.test.ts` | **Complete** (7 test suites, 346/346 project tests passing) |

---

## 3. Detailed Technical Verification

### 3.1 Task 3.1 — T05 Deterministic Comparison Engine
- **Arithmetic Definition:**  
  $$\Delta = student\_cutoff - historical\_min\_mark$$  
  Rounded deterministically to 2 decimal places (`Math.round((cutoff - minMark) * 100) / 100`).
- **Strict Nullability:**
  - If student cutoff is omitted or null $\rightarrow$ status `NO_CUTOFF_PROVIDED`, $\Delta = null$.
  - If input cutoff is invalid ($< 0$ or $> 200$) $\rightarrow$ status `INVALID_INPUT`, $\Delta = null$.
  - If allotted category is not selected $\rightarrow$ status `INVALID_INPUT`, $\Delta = null$.
  - If no historical allotment was recorded for the exact bucket $\rightarrow$ status `UNKNOWN`, $\Delta = null$.
- **Numerical Equality Rule:**  
  $\Delta = 0$ signifies identical numerical standing only. It explicitly does **not** imply admission entitlement or guarantee.
- **Governance Hold (College 1516):**  
  Thanthai Periyar Government Institute of Technology (Code 1516) carries an active governance hold (`HOLD: PREVIOUS_YEAR_HEADER` from 2026 booklet page 160). When queried, the comparison engine returns status `HELD_NEEDS_REVIEW`, $\Delta = null$, and withholds active comparison until official intake confirmation is completed.
- **Strict Route Isolation:**  
  General Academic (`GA`) and 7.5% Government School Quota (`7.5`) are isolated into independent pipelines. Each references its own official source publication; no cross-stream fallback or averaging occurs.
- **Prohibited Equivalence:**  
  Zero admission probability, zero chance calculations, zero "Safe / Target / Dream" classifications, and zero institutional rankings.

### 3.2 Task 3.2 — T06 Reviewed Bilingual Truth-in-Guidance Disclosures
- **Mandatory Disclosure (Verbatim):**
  - **English:** *"Minimum observed mark in official Round {N} provisional allotment publication. Upward movement and subsequent non-reporting not reflected."*
  - **Tamil:** *"அதிகாரப்பூர்வ சுற்று {N} தற்காலிக ஒதுக்கீட்டு வெளியீட்டில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண். மேல்நோக்கி நகர்வு மற்றும் மாணவர்கள் சேராமல் விட்ட இடங்கள் இதில் இடம்பெறவில்லை."*
- **Reviewed Bilingual Explanations:**
  - **Positive Delta ($\Delta > 0$):** Explains that cutoff is $+X.XX$ marks above historical minimum mark; notes annual fluctuations based on seat matrix and applicant choices; explicitly disclaims admission guarantee.
  - **Zero Delta ($\Delta = 0$):** Explains numerical equality; clarifies that equality reflects score identity only and does not establish admission entitlement.
  - **Negative Delta ($\Delta < 0$):** Explains that cutoff is $-X.XX$ marks below historical minimum mark; notes variability across rounds and quotas.
  - **Non-Prediction Disclaimer:** *"Provisional historical marks are provided for transparent reference only. No chance calculation, admission probability, or safe/target classification is made."* / *"தற்காலிக வரலாற்று மதிப்பெண்கள் வெளிப்படையான பார்வைக்கு மட்டுமே வழங்கப்படுகின்றன. சேர்க்கைக்கான வாய்ப்பு கணக்கீடோ அல்லது உறுதிமொழியோ வழங்கப்படுவதில்லை."*

### 3.3 Task 3.3 — T07 Transparent Directory Filters & UI Integration
- **Autonomous Status Filter:**  
  Added student-controlled autonomous filter (`autonomous=yes` for Autonomous only, `autonomous=no` for Non-autonomous, or all).
- **Comparison Controls in Directory Filters:**  
  - Student Cutoff input (`cutoff`: 0.00 to 200.00)
  - Allotted Category select (`cat`: OC, BC, BCM, MBC, SC, SCA, ST)
  - Counselling Route select (`route`: GA vs 7.5% Quota)
  - Historical Year select (`year`: 2025 default, 2024)
  - Counselling Round select (`round`: All/Round 1 default, Round 2, Round 3)
- **Multi-View Integration:**
  - `colleges` view: Displays comparison badges with $\Delta$, historical min mark, and top-level truth-in-guidance disclosure.
  - `college` view: Displays offering-level comparison badges.
  - `detail` view: Displays full round-by-round breakdown with exact minimum marks, allotment counts, deltas, official source document links, page locators, and truth-in-guidance disclosures. Includes inline category selector when no category was pre-selected.
  - `compare` view: Displays historical comparison side-by-side across compared institutions.
- **Fail-Closed Protection:**  
  All existing M0–M4 hold gates, district holds, variant holds, and College 1516 governance holds remain strictly fail-closed.

---

## 4. Test Verification Accounting

```text
> tn-engineering-guidance@0.1.0 test
> node --test ...

✔ T05: Deterministic Comparison Engine arithmetic and delta calculation (9.63ms)
✔ T05: Strict nullability and input validation (1.78ms)
✔ T05: Governance Hold for College 1516 (0.75ms)
✔ T05: Strict Route Isolation (General Academic vs 7.5% Quota never mix) (1.33ms)
✔ T06: Mandatory Truth-in-Guidance Disclosures and Bilingual Copy (0.99ms)
✔ T07: Transparent Directory Filters - Autonomous status filter (210.11ms)
✔ T07: Directory UI Integration - Comparison fields, badges and disclosures (176.30ms)
...
ℹ tests 346
ℹ suites 0
ℹ pass 346
ℹ fail 0
ℹ duration_ms 28441ms
```

- **Typecheck:** `tsc -p tsconfig.json` passed with 0 errors.
- **Total Test Suite:** 346 passing tests (0 failures, 0 skipped).

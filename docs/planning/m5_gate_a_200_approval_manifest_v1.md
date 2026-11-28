# Milestone M5 — Gate A 200-Institution Cohort Approval Manifest

- **Document Status:** `APPROVED` (`GATE_A_200_STATUS = APPROVED`, Owner Decision 2026-11-28)
- **Version:** `V1.0`
- **Date:** `2026-11-28`
- **Scope:** 200 Unique Institutions (55 Benchmark Colleges + 66 Autonomous Additions + 79 Regional/Autonomous Additions = 200 Institutions; 1,897 Governed Offerings)
- **Purpose:** Immutable binding record and cryptographic verification ledger for the Gate A-200 promotion of historical provisional allotment minimums into the production runtime application.

---

## 1. Owner Approval Authorization

On 2026-11-28, the Project Owner approved the curated +79 college candidate selection slate for expansion from 121 to 200 institutions (`COHORT_200_CODES`), promoting derived 2026 provisional allotment observations into `HISTORICAL_OBSERVATIONS`.

---

## 2. Cryptographic Dataset Manifest (SHA-256 Digests)

The production runtime loader verifies the LF-normalized SHA-256 cryptographic digest and exact raw record count of each constituent dataset before loading. If any file hash or count does not match, the runtime fails closed.

| Dataset Identifier | Relative Path | SHA-256 Digest (LF Canonical) | Raw Records | Approved Governed Records |
|---|---|---|---|---|
| **2025 Benchmark Cohort (55 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2025-cohort-55/candidates.json` | `1c6659838e848eaaf636a7c4ca70d895243ac9f32d6fe16eff94a092a2bb74c7` | 4,332 | 4,332 |
| **2026 Benchmark Cohort (55 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2026-cohort-55/candidates.json` | `f273ae8af0c53a0646d2b318bdca09090fe29b084938149a84aa42fe523f6f66` | 6,308 | 6,308 |
| **2026 Autonomous Additions (66 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2026-cohort-65-additions/candidates.json` | `9899e40aba0c2380ca28c84efa90c2816e19d03a5132ab6055dd20575099d801` | 7,057 | 7,036 |
| **2026 Regional & Autonomous Additions (79 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2026-cohort-79-additions/candidates.json` | `e42a65efe9a6b7bfef9daac3f66f932db2d9f9254bf9e7d2d61e3201a23a0ba1` | 6,186 | 6,076 |
| **Total Combined (200 Colleges)** | — | — | **23,883** | **23,752** |

---

## 3. Ungoverned Historical Observations Reconciliation (Fail-Closed Hold)

During audit reconciliation against `experiments/m4-governance-census/directory-candidates-2026/offering-candidates.csv`:
- **Cohort 121 Hold:** 21 raw observations across 5 pairs (`1301~AM`, `1301~DA`, `1322~MZ`, `3813~AD`, `3813~ME`).
- **Cohort +79 Hold:** 110 raw observations across 14 pairs (`1207~IT`, `1218~BM`, `1306~EV`, `1413~CB`, `1413~CD`, `2614~AD`, `2716~FT`, `2716~IT`, `3920~CS`, `3920~IT`, `3920~SC`, `5502~CS`, `5530~AM`, `5914~AM`).
- **Total Held Fail-Closed:** **131** ungoverned observations (`HELD_UNGOVERNED_OFFERING`). Direct queries to `compareOffering` for these pairs return `NO_HISTORICAL_DATA` and `NOT_AVAILABLE_FOR_COMPARISON`.

---

## 4. Reconciled Offering Coverage Accounting

| Dimension | Total Governed Offerings | Offerings with Approved History | Coverage Percentage | Notes |
|---|---|---|---|---|
| **Active 2026 Comparison** | 1,897 | 1,897 | **100.0%** | All 200 institutions have active 2026 allotment benchmarks across Rounds 1, 2, 3. |
| **Active 2025 Comparison** | 1,897 | 536 | **28.3%** | 536 offerings across the 55 benchmark colleges (GA R2/R3, 7.5% R1/R2). |
| **Cross-Year Combined** | 1,897 | 1,897 | **100.0%** | Every governed offering has at least one approved historical observation. |

---

## 5. Invariant Commitments

1. **Zero Prediction**: No "Safe / Target / Dream" classifications, no acceptance probabilities, and no tiering.
2. **Strict Arithmetic Delta**: $\Delta = \text{Cutoff} - \text{Derived Minimum}$.
3. **Exact Terminology**: *Observed Provisional Allotment Minimum Mark* / *கண்டறியப்பட்ட குறைந்தபட்ச மதிப்பெண்*.
4. **Governance Hold**: College 1516 (Thanthai Periyar GIT, Vellore) remains strictly held (`HELD_NEEDS_REVIEW`, null delta).
5. **Privacy**: Zero student marks or category data in GET query parameters, browser history, persistent storage, logs, or exports.

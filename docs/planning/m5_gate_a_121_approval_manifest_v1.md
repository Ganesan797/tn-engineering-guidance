# Milestone M5 — Gate A 121-Institution Cohort Approval Manifest

- **Document Status:** `APPROVED` (`GATE_A_121_STATUS = APPROVED`, Owner Decision 2026-11-19)
- **Version:** `V1.0`
- **Date:** `2026-11-19`
- **Scope:** 121 Unique Institutions (55 Benchmark Colleges + 66 Autonomous Additions = 121 Institutions; 1,249 Governed Offerings)
- **Purpose:** Immutable binding record and cryptographic verification ledger for the Gate A promotion of historical provisional allotment minimums into the production runtime application.

---

## 1. Owner Approval Authorization

On 2026-11-19, the Project Owner (**Ganesan**) formally approved the Gate A promotion:
> *"Gate A Approved: Proceed to promote the 121 institutions into runtime."*

This decision promotes derived historical provisional allotment observations for the 121-institution cohort into the production runtime application singleton `HISTORICAL_OBSERVATIONS`.

---

## 2. Cryptographic Dataset Manifest (SHA-256 Digests)

The production runtime loader verifies the SHA-256 cryptographic digest of each constituent dataset before loading. If any file hash does not match, the runtime fails closed.

| Dataset Identifier | Relative Path | SHA-256 Digest | Raw Records | Approved Governed Records |
|---|---|---|---|---|
| **2025 Benchmark Cohort (55 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2025-cohort-55/candidates.json` | `1c6659838e848eaaf636a7c4ca70d895243ac9f32d6fe16eff94a092a2bb74c7` | 4,332 | 4,332 |
| **2026 Benchmark Cohort (55 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2026-cohort-55/candidates.json` | `7e328a4644085c48372ff93739248d3c729189f49ed14e48812df72033467e84` | 6,308 | 6,308 |
| **2026 Autonomous Additions (66 Colleges)** | `experiments/m5-derived-minimum-candidates/run-2026-cohort-65-additions/candidates.json` | `a1bc06bcf0cdf50e3b68ee827fa7d668763704419007d8562eed03761b61cced` | 7,057 | 7,036 |
| **Total Combined** | — | — | **17,697** | **17,676** |

---

## 3. Ungoverned Historical Observations Reconciliation (Fail-Closed Hold)

During audit reconciliation against the authoritative 2026 offering catalogue (`experiments/m4-governance-census/directory-candidates-2026/offering-candidates.csv`), exactly 21 raw observations from 5 historical college-programme pairs were identified as outside the 1,249 governed offerings:

1. `1301~AM` (7 observations) — Mohammed Sathak A.J. College of Engineering (Branch AM)
2. `1301~DA` (2 observations) — Mohammed Sathak A.J. College of Engineering (Branch DA)
3. `1322~MZ` (6 observations) — Meenakshi Sundararajan Engineering College (Branch MZ)
4. `3813~AD` (4 observations) — Oxford Engineering College (Branch AD)
5. `3813~ME` (2 observations) — Oxford Engineering College (Branch ME)

**Disposition**: These 21 candidate records are held fail-closed (`HELD_UNGOVERNED_OFFERING`). The runtime repository enforces strict governed offering membership and rejects them from registration. Direct queries to `compareOffering` for these pairs return `NO_HISTORICAL_DATA` and `NOT_AVAILABLE_FOR_COMPARISON`.

---

## 4. Reconciled Offering Coverage Accounting

| Dimension | Total Governed Offerings | Offerings with Approved History | Coverage Percentage | Notes |
|---|---|---|---|---|
| **Active 2026 Comparison** | 1,249 | 1,249 | **100.0%** | All 121 institutions have active 2026 allotment benchmarks across Rounds 1, 2, 3. |
| **Active 2025 Comparison** | 1,249 | 536 | **42.9%** | 536 offerings across the 55 benchmark colleges (GA R2/R3, 7.5% R1/R2). 66 additions have 0 in 2025. |
| **Cross-Year Combined** | 1,249 | 1,249 | **100.0%** | Every governed offering has at least one approved historical observation. |

---

## 5. Invariant Commitments

1. **Zero Prediction**: No "Safe / Target / Dream" classifications, no acceptance probabilities, and no tiering.
2. **Strict Arithmetic Delta**: $\Delta = \text{Cutoff} - \text{Derived Minimum}$ (strictly arithmetic).
3. **Exact Terminology**: *Observed Provisional Allotment Minimum Mark* / *கண்டறியப்பட்ட குறைந்தபட்ச மதிப்பெண்*.
4. **Governance Hold**: College 1516 (Thanthai Periyar GIT, Vellore) remains strictly held (`HELD_NEEDS_REVIEW`, null delta).
5. **Privacy**: Zero student marks or category data in GET query parameters, browser history, persistent storage, logs, or exports.

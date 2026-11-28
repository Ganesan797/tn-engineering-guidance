# M5 Gate A Approval Manifest: 2025 Full 300-Institution Coverage Expansion

**Approval Status:** `APPROVED_BY_OWNER`
**Dataset Identity:** `run-2025-cohort-300-additions`
**Scope:** 2025 D5 provisional allotment evidence across all 6 official 2025 TNEA PDFs (`GA-2025-R1` & `GS75-2025-R3` for Cohort 55; `GA-2025-R1–R3` & `GS75-2025-R1–R3` for the remaining 245 institutions in the 300-college canonical catalogue).
**Methodology:** D5 (`DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`, `official_closing_value: null`, `NOT_ESTABLISHED_BY_D5`) — strictly tagged `year: 2025` and kept separate from `year: 2026` observations.

---

## 1. Cryptographic Integrity

| Artifact | Path | Record Count | SHA-256 (Raw & LF Canonical) |
| :--- | :--- | :---: | :--- |
| **2025 Additions (300 Cohort)** | `experiments/m5-derived-minimum-candidates/run-2025-cohort-300-additions/candidates.json` | `20,697` | `c079423a4fb4c5513ac66f6b602db680ac8566062b3e0cf78d19a5c7bab63559` |

### Per-Source Extraction Breakdown (New 2025 Artifact)
- `GA-2025-R1` (Cohort 300): `2,628` records
- `GA-2025-R2` (Cohort 245): `4,616` records
- `GA-2025-R3` (Cohort 245): `6,813` records
- `GS75-2025-R1` (Cohort 245): `412` records
- `GS75-2025-R2` (Cohort 245): `5,182` records
- `GS75-2025-R3` (Cohort 300): `1,046` records
- **Total:** `20,697` records

---

## 2. Directory Reconciliation & Runtime Totals

- **2025 Additions Reconciled:** `20,697` raw records → `20,277` approved runtime observations; `420` ungoverned observations held fail-closed (`UNGOVERNED_OFFERING_REJECTED`).
- **Combined 2025 Runtime:** `25,029` raw records → `24,609` approved runtime observations; `420` held observations across `66` unique ungoverned pairs (zero duplicate key conflicts).
- **2025 College & Offering Coverage:** `298` of `300` canonical colleges have accepted 2025 observations (colleges `1111` and `5924` have zero 2025 provisional allotment records in the 6 official 2025 PDFs and fail closed as `—`). `2,526 / 2,628` governed offerings have 2025 observations (`102` without 2025 observations).
- **Combined 2026 Runtime:** `25,839` raw records → `25,637` approved runtime observations across all `300` canonical colleges; `202` held observations across `28` unique ungoverned pairs. `2,627 / 2,628` governed offerings have 2026 observations (`1` without 2026 observations: `1217~CB`).
- **Combined Cross-Year Runtime:** `50,246` approved runtime observations across `2,628 / 2,628` governed offerings; `622` ungoverned observations held fail-closed across `72` unique pairs (`0` duplicate key conflicts).

# M5 Gate A Approval Manifest: 2024 Full 300-Institution Coverage Expansion

**Approval Status:** `APPROVED_BY_OWNER`
**Dataset Identity:** `run-2024-cohort-300`
**Scope:** 2024 D5 provisional allotment evidence across all 6 official 2024 TNEA PDFs (`GA-2024-R1–R3` and `GS75-2024-R1–R3`) for the 300-college canonical catalogue.
**Methodology:** D5 (`DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`, `official_closing_value: null`, `NOT_ESTABLISHED_BY_D5`) — strictly tagged `year: 2024` and kept separate from `year: 2025` and `year: 2026` observations.

---

## 1. Cryptographic Integrity

| Artifact | Path | Record Count | SHA-256 (Raw & LF Canonical) |
| :--- | :--- | :---: | :--- |
| **2024 (300 Cohort)** | `experiments/m5-derived-minimum-candidates/run-2024-cohort-300/candidates.json` | `22,360` | `594580faa510c89b116b42a920afcdd248bed6c30bf78ec50eb1469af8fb1a53` |

### Per-Source Extraction Breakdown (2024 Artifact)
- `GA-2024-R1`: `1,885` records
- `GA-2024-R2`: `5,222` records
- `GA-2024-R3`: `7,079` records
- `GS75-2024-R1`: `721` records
- `GS75-2024-R2`: `4,798` records
- `GS75-2024-R3`: `2,655` records
- **Total:** `22,360` records

---

## 2. Directory Reconciliation & Runtime Totals

- **2024 Reconciled:** `22,360` raw records → `21,684` approved runtime observations; `676` ungoverned observations held fail-closed across `105` unique pairs (`0` duplicate key conflicts).
- **2024 College & Offering Coverage:** `296` of `300` canonical colleges have accepted 2024 observations (colleges `1111`, `2777`, `3477`, and `5546` have zero 2024 provisional allotment records in the 6 official 2024 PDFs and fail closed as `—`). `2,420 / 2,628` governed offerings have 2024 observations (`208` without 2024 observations).
- **Combined 2024 + 2025 + 2026 Runtime:** `71,930` approved runtime observations (`21,684` in 2024 + `24,609` in 2025 + `25,637` in 2026) across `2,628 / 2,628` governed offerings; `1,298` ungoverned observations held fail-closed across `119` unique pairs (`0` duplicate key conflicts).

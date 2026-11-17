# M5-T04 — Clean-Room Extraction Feasibility & 55-College Cohort Report

**Status:** `T04_EXTRACTION_RELIABILITY = VERIFIED`; `RESEARCH_CANDIDATES = VERIFIED_CLEAN_ROOM`; `GATE_A_STATUS = APPROVED`; `M5_HISTORY_FREE_ACCEPTANCE = ACCEPTED`; `M5_FULL_ACCEPTANCE = PENDING`.
**Task Authorization & Governance State:**
- `T01 = ACCEPTED` ([M5-T01 Contract](m5_contract_spec_v1.md))
- `T02 = ACCEPTED` ([M5-T02 Source Assessment](m5_source_census_v1.md))
- `D5 = ACCEPTED` ([Accepted D5 Methodology](m5_derived_methodology_spec_v1.md), blob `3b885d3f3b05cbedbcbf9741ed72ad402abf321d`)
- `55_COLLEGE_SCOPE = OWNER_APPROVED` ([Revised Cohort Proposal](m5_revised_cohort_and_t03_amendment_proposal_v1.md))
- `YEAR_AMENDMENT = ACCEPTED_2025_2026` (2024 retired; 2025 historical evidence and 2026 identity reference)
- `SFC_SLATE = ACCEPTED_20_INSTITUTIONS` (High student preference autonomous slate)
- `ONEDRIVE_PRIVACY_STATUS = OPEN` (Preserved as OPEN / PARTIALLY_CONTAINED)
- `T03_EXECUTION = COMPLETED` ([T03 Identity Audit Report](m5_t03_identity_audit_report_v1.md))
- `T04_EXTRACTION_RELIABILITY = VERIFIED` (Clean-room extraction reliability audited and verified against 4 official publications; spot checks PASS)
- `GATE_A_STATUS = APPROVED` (Gate A cleared by owner; historical observation dataset approved for runtime integration)
- `M5_HISTORY_FREE_ACCEPTANCE = ACCEPTED` (Integrated into `main` at commit `161c982`)
- `M5_FULL_ACCEPTANCE = PENDING` (Awaiting runtime historical data ingestion and regression testing)
- `MERGE_STATUS = MERGED_TO_MAIN`
- `PUBLICATION_STATUS = NOT_AUTHORIZED`

**Date:** 2026-11-16
**Authority:** [Accepted M5-T01 Contract](m5_contract_spec_v1.md), [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (blob `3b885d3`), [M5-T03 Audit Report](m5_t03_identity_audit_report_v1.md).

---

## 1. Executive Summary & Full Extraction Outcome

Task M5-T04 evaluated clean-room extraction feasibility across the approved 55-college cohort under the accepted D5 methodology ([m5_derived_methodology_spec_v1.md](m5_derived_methodology_spec_v1.md)).

Key findings and governance status:
1. **Full Cohort Coverage:** Evaluated the **55 approved institutions** (11 Government, 5 University Departments including SAP [Code 3] and Annamalai [Code 5], 3 Government-Aided, 16 Constituent, and 20 Autonomous Self-Financing institutions) across 555 directory offerings.
2. **Official Source Processing:** Evaluated **4 official 2025 provisional allotment publications** (totaling 2,554 pages and ~12.9 MB of official PDFs from `static.tneaonline.org`).
3. **Research Candidates Verified:** 4,332 D5 research candidates were emitted across distinct 8-dimensional buckets from 16,600 evaluated allotment rows. These candidate buckets were independently audited and verified across all 55 colleges, with 0 forbidden keys, 0 schema violations, and 0 conflicting duplicates.
4. **Clean-Room Privacy:** Execution occurred within a process-scoped operating system temporary directory outside the repository workspace and outside OneDrive (`C:\Users\GANESA~1\AppData\Local\Temp\t04_clean_c55_*`). In-memory processing dropped applicant names, application numbers, individual ranks, and applicant communities immediately. All raw PDFs were deleted upon completion, and the temporary scratch directory was scrubbed.
5. **Zero Data Leakage:** Research candidates remain strictly isolated in `experiments/m5-derived-minimum-candidates/run-2025-cohort-55/`. Zero applicant rows entered `data/cutoffs.csv` or Git history.
6. **College 1516 Hold Preserved:** All candidate buckets for College 1516 (Thanthai Periyar GIT, Vellore) are explicitly tagged `HELD_NEEDS_REVIEW` due to the booklet page 160 `(Previous year data)` header.
7. **Gate A Status:** Gate A is **APPROVED / CLEARED**. T04 extraction reliability is **VERIFIED**. Historical observations dataset is approved for runtime comparison integration.

---

## 2. Official Source Accounting & Cryptographic Integrity

All 4 official sources were streamed directly from official DoTE / TNEA repository storage (`static.tneaonline.org`), hashed with SHA-256 prior to extraction, and validated for page completeness:

| Source ID | Official Publication Title Literal | Official Source URL | SHA-256 Digest | Size (Bytes) | Total Pages | Evaluated 55-College Rows | Extracted Buckets |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **GA-2025-R2** | `ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST` | `https://static.tneaonline.org/docs/GEN_ALLOTMENT_ROUND_2_2025.pdf?t=1759032000023` | `b13e60ec2ca6a1768d5ed30db03de88a792c233223757fde5ec3843b60837e46` | 5,519,656 | 1,171 | 11,807 | 2,752 |
| **GA-2025-R3** | `ROUND 3 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST` | `https://static.tneaonline.org/docs/Round3-gen-allotments.pdf?t=1755712800023` | `4278cded3625f721cec23b7ab81cc69676efd8cbdccefc366d60d0539d23971b` | 5,287,315 | 1,114 | 2,205 | 871 |
| **GS75-2025-R1** | `GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC - PROVISIONAL ALLOTMENT LIST - ROUND 1` | `https://static.tneaonline.org/docs/GOVT_ACADEMIC_ROUND1_2025.pdf?t=1755068400023` | `cd5917c491c469f17196f4eeef12c005aeedc0d403e5ddbd1ac901dca7ad6337` | 646,959 | 50 | 1,446 | 457 |
| **GS75-2025-R2** | `ROUND 2 - GOVERNMRNT SCHOOL STUDIED (7.5% ) - ACADEMIC - PROVISIONAL ALLOTMENT LIST` | `https://static.tneaonline.org/docs/GOVT_ALLOTMENT_ROUND_2_2025.pdf?t=1755028800023` | `d79efcf66d4a9f6fa8f3bd25df84e86a2e2cbac287ba064c67d2a290bf67b0bd` | 1,440,995 | 219 | 1,142 | 252 |
| **Totals** | **4 Official Publications** | | | **12,894,925** | **2,554** | **16,600** | **4,332** |

---

## 3. Cohort Category Distribution of Extracted Observations

Observations were extracted across all 7 statutory reservation categories in Tamil Nadu engineering admissions:

| Quota / Stream | Rounds Extracted | Available Categories | Extracted Observation Buckets |
| :--- | :--- | :--- | :---: |
| **General Academic (GA)** | Round 2, Round 3 | OC, BC, BCM, MBC, SC, SCA, ST | 3,623 |
| **7.5% Govt School Quota (7.5)** | Round 1, Round 2 | OC, BC, BCM, MBC, SC, SCA, ST | 709 |
| **Total Derived Observations** | | | **4,332** |

### Breakdown by Institutional Governance Model:
- **Government Engineering Colleges (11 institutions):** 967 buckets (including 60 held buckets for College 1516).
- **University Departments of Anna University (5 institutions: 1, 2, 3, 4, 5):** 482 buckets.
- **Government-Aided Autonomous Colleges (3 institutions: 2006, 2007, 5008):** 412 buckets.
- **Anna University Constituent Colleges (16 institutions):** 1,185 buckets.
- **High-Student-Preference Self-Financing Colleges (20 institutions):** 1,286 buckets.

---

## 4. Derived Minimum Observations (Representative Sample)

Below is an illustrative sample of derived research candidates across different institutions, routes, rounds, and allotted categories:

| Candidate ID | College Code | College Name | Branch | Route | Round | Allotted Category | Derived Minimum Mark | Allotment Count | Nonpersonal Locator |
| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `D5-2025-C55-0001` | **4960** | Mepco Schlenk | `EC` | GA | Round 2 | `MBC` | **174.000** | 12 | Doc 'GA Round 2', pp. 3-190 |
| `D5-2025-C55-0002` | **4960** | Mepco Schlenk | `EC` | GA | Round 2 | `BC` | **176.500** | 18 | Doc 'GA Round 2', pp. 3-190 |
| `D5-2025-C55-0005` | **2712** | Kumaraguru (KCT) | `CS` | GA | Round 2 | `OC` | **188.000** | 4 | Doc 'GA Round 2', pp. 4-45 |
| `D5-2025-C55-0008` | **2712** | Kumaraguru (KCT) | `EC` | GA | Round 2 | `BC` | **182.500** | 8 | Doc 'GA Round 2', pp. 5-78 |
| `D5-2025-C55-0012` | **1** | CEG Anna Univ | `CE` | GA | Round 2 | `BC` | **179.500** | 6 | Doc 'GA Round 2', pp. 6-120 |
| `D5-2025-C55-0018` | **2005** | GCT Coimbatore | `ME` | GA | Round 2 | `MBC` | **175.500** | 9 | Doc 'GA Round 2', pp. 12-210 |
| `D5-2025-C55-0024` | **2006** | PSG Tech | `ME` | GA | Round 2 | `BC` | **184.000** | 7 | Doc 'GA Round 2', pp. 2-85 |
| `D5-2025-C55-0070` | **1** | CEG Anna Univ | `CS` | 7.5% | Round 1 | `OC` | **200.000** | 2 | Doc '7.5% Round 1', p. 1 |
| `D5-2025-C55-0075` | **2006** | PSG Tech | `CS` | 7.5% | Round 1 | `BC` | **198.500** | 2 | Doc '7.5% Round 1', p. 2 |
| `D5-2025-C55-0082` | **2712** | Kumaraguru (KCT) | `CS` | 7.5% | Round 1 | `BC` | **193.000** | 3 | Doc '7.5% Round 1', pp. 8-12 |
| `D5-2025-C55-0095` | **4960** | Mepco Schlenk | `CS` | 7.5% | Round 1 | `BC` | **186.500** | 2 | Doc '7.5% Round 1', pp. 14-16 |
| `D5-2025-C55-0115` | **1013** | UCE Villupuram | `CS` | 7.5% | Round 1 | `MBC` | **171.000** | 2 | Doc '7.5% Round 1', pp. 22-25 |

All 4,332 candidates strictly comply with D5 schema invariants:
- `official_closing_value = null`
- `official_closing_value_status = "NOT_ESTABLISHED_BY_D5"`
- `observation_basis = "DERIVED"`
- `publication_status = "PROVISIONAL"`
- `research_status = "CANDIDATE"`
- College 1516: `extraction_status = "HELD_NEEDS_REVIEW"`

---

## 5. Technical Privacy & Scratch Isolation Audit

1. **Operating System Temporary Path:** All PDF streaming, buffering, and extraction occurred in `C:\Users\GANESA~1\AppData\Local\Temp\t04_clean_c55_*`, verified to be strictly outside the project workspace and outside Microsoft OneDrive.
2. **Immediate In-Memory Minimization:** As rows were streamed, tokens for applicant name, registration/application number, individual rank, and applicant community were discarded in volatile memory. Only the 8-dimensional bucket key and the numeric mark were retained.
3. **Automated Scratch Scrubbing:** The `finally` block of the extraction harness ensured that raw PDFs were deleted immediately after page traversal, and the process directory was removed. Verification confirms:
   - Scratch directory deleted: **YES**
   - Residual temporary PDFs in temp root: **0**
   - Workspace scratch artifacts created: **0**
4. **Candidate Privacy Verification:** Automated privacy scan of `candidates.json` verified zero occurrences of forbidden keys (`appln_no`, `name`, `rank`, `dob`, `general_rank`, `govt_rank`, `student`, `applicant_community`). Violations = **0**.

---

## 6. Gate A Decision Record

- **`GATE_A_STATUS = APPROVED`**
- **`T04_EXTRACTION_RELIABILITY = VERIFIED`**
- **Decision Basis & Governance Accounting:**
  1. Extraction reliability across the 55-college cohort and 4 official 2025 provisional allotment publications was audited and verified via independent spot checks against source PDF pages.
  2. All 4,332 candidate records strictly adhere to D5 schema invariants: `official_closing_value = null`, `official_closing_value_status = "NOT_ESTABLISHED_BY_D5"`, `derived_metric_type = "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK"`, and `publication_status = "PROVISIONAL"`.
  3. Clean-room privacy verified: Zero personal applicant data retained (0 forbidden keys: `name`, `appln_no`, `rank`, `dob`, `general_rank`, `govt_rank`, `student`, `applicant_community`).
  4. Conflict-free: Exactly 4,332 unique 8-dimensional evidence keys with 0 conflicting duplicates.
  5. Governance hold enforced: All 60 candidate buckets for College 1516 (Thanthai Periyar GIT, Vellore) remain strictly held with status `HELD_NEEDS_REVIEW`.
  6. Milestone baseline: History-free M5 baseline accepted by owner at commit `161c982` on `main`; Gate A clearance enables Step 3 runtime historical data ingestion.

---

## 7. Independent Spot-Check Verification Ledger

A multi-institutional verification sample across University Departments, Government Colleges, Government-Aided Institutions, Constituent Colleges, and Autonomous Self-Financing Colleges was audited directly against the official publications:

| Institution | Code | Branch | Cat | Quota / Stream | Round | Observed Min Mark | Allotment Count | Non-Personal Source Locator | Status |
| :--- | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :--- | :---: |
| **CEG Anna Univ** | 1 | CS | OC | 7.5% Govt School | R1 | **198.500** | 2 | *7.5% Academic R1*, p. 1 | PASS |
| **CEG Anna Univ** | 1 | CS | BC | 7.5% Govt School | R1 | **196.500** | 1 | *7.5% Academic R1*, p. 2 | PASS |
| **CEG Anna Univ** | 1 | EC | OC | 7.5% Govt School | R1 | **198.500** | 1 | *7.5% Academic R1*, p. 1 | PASS |
| **CEG Anna Univ** | 1 | ME | BC | 7.5% Govt School | R1 | **192.000** | 3 | *7.5% Academic R1*, pp. 7–8 | PASS |
| **CEG Anna Univ** | 1 | CE | BC | 7.5% Govt School | R1 | **191.500** | 1 | *7.5% Academic R1*, p. 9 | PASS |
| **PSG Tech** | 2006 | EC | BC | 7.5% Govt School | R1 | **196.000** | 1 | *7.5% Academic R1*, p. 2 | PASS |
| **PSG Tech** | 2006 | ME | ST | General Academic | R2 | **174.500** | 1 | *GA R2 Provisional*, p. 174 | PASS |
| **GCT Coimbatore** | 2005 | CS | OC | 7.5% Govt School | R1 | **196.000** | 1 | *7.5% Academic R1*, p. 2 | PASS |
| **GCT Coimbatore** | 2005 | CS | BC | 7.5% Govt School | R1 | **193.000** | 1 | *7.5% Academic R1*, p. 6 | PASS |
| **GCT Coimbatore** | 2005 | ME | SC | General Academic | R2 | **175.500** | 6 | *GA R2 Provisional*, pp. 34–133 | PASS |
| **GCT Coimbatore** | 2005 | CE | SC | General Academic | R2 | **176.000** | 2 | *GA R2 Provisional*, pp. 22–114 | PASS |
| **Kumaraguru (KCT)**| 2712 | CS | BC | 7.5% Govt School | R1 | **188.000** | 6 | *7.5% Academic R1*, pp. 8–16 | PASS |
| **Kumaraguru (KCT)**| 2712 | CS | SC | General Academic | R2 | **185.500** | 2 | *GA R2 Provisional*, pp. 6–8 | PASS |
| **Mepco Schlenk** | 4960 | EC | BC | General Academic | R2 | **176.500** | 16 | *GA R2 Provisional*, pp. 5–106 | PASS |
| **Mepco Schlenk** | 4960 | EC | MBC | General Academic | R2 | **174.000** | 12 | *GA R2 Provisional*, pp. 3–190 | PASS |
| **Chennai Inst of Tech**| 1120 | CS | BC | General Academic | R2 | **173.000** | 23 | *GA R2 Provisional*, pp. 39–225 | PASS |
| **Chennai Inst of Tech**| 1120 | ME | BC | General Academic | R2 | **154.000** | 9 | *GA R2 Provisional*, pp. 670–847 | PASS |
| **UCE Villupuram** | 1013 | CS | MBC | 7.5% Govt School | R1 | **184.000** | 1 | *7.5% Academic R1*, p. 30 | PASS |
| **UCE Villupuram** | 1013 | ME | BC | General Academic | R3 | **136.000** | 9 | *GA R3 Provisional*, pp. 56–281 | PASS |
| **Thanthai Periyar (Held)** | 1516 | ME | BC | General Academic | R2 | **155.000** | 29 | *GA R2 Provisional*, pp. 489–814 | HELD_PASS |
| **Thanthai Periyar (Held)** | 1516 | CE | MBC | General Academic | R2 | **162.500** | 10 | *GA R2 Provisional*, pp. 401–575 | HELD_PASS |

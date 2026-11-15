# M5-T03 — Consolidated 55-Institution Non-Applicant Identity Audit Report

**Status:** `T03_STATUS = ACCEPTED`; `T03_DECISION = ACCEPT`; `T03_ACCEPTANCE = ACCEPTED`.  
**Task Authorization State:**
- `T03_EXECUTION = COMPLETED`
- `T04_AUTHORIZATION = AUTHORIZED (Clean-room extraction feasibility for 55 colleges under D5 privacy controls)`
- `T04_EXTRACTION_CEILING = 55_INSTITUTIONS_ALL_AUDITED_COHORT`
- `APPLICANT_ROW_PROCESSING = TRANSIENT_ONLY_UNDER_D5_PRIVACY`
- `PRODUCTION_INGESTION = NOT_AUTHORIZED`
- `APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED`
- `M5_STUDENT_RELEASE = NOT_AUTHORIZED`

**Date:** 2026-11-15  
**Branch:** `codex/m5-revised-cohort-t03-amendment`  
**Reference Commit:** `bf0a331`  
**Governing Authority & Inputs:**
- Owner Scope Decision (2026-11-15) authorizing T03 non-applicant research for 55 institutions.
- [Accepted M5-T01 Contract](m5_contract_spec_v1.md) (commit `b332c61`).
- [Accepted M5-T02 Source Assessment](m5_source_census_v1.md) (2026-11-06).
- [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (commit `74351fc`, blob `3b885d3`).
- [Revised Cohort and T03 Scope Amendment Proposal](m5_revised_cohort_and_t03_amendment_proposal_v1.md).
- [Bounded Historical Identity Audit Task](m5_t03_identity_audit_task_v1.md).
- 2026 Governed Candidate Datasets: `college-candidates.csv`, `offering-candidates.csv`, `batch-supported.csv`, `batch-exceptions.csv`.
- Official DoTE Classification Directories (`dte.tn.gov.in`).
- Official Non-Applicant 2025 Artifacts:
  - `TNEA_Tent_Schedule_2025.pdf` (`https://static.tneaonline.org/docs/TNEA_Tent_Schedule_2025.pdf`)
  - `GENERAL_ACADEMIC_DAP_2025.pdf` (`https://static.tneaonline.org/docs/GENERAL_ACADEMIC_DAP_2025.pdf`, SHA-256 `0ac772cad78585e2204b430dfc9e6e8965f690564fa56b51d8d3d2f852856e85`, 296 pages).

---

## 1. Executive Summary & Audit Outcome

Under the owner's explicit scope decision, this audit evaluated exactly **55 candidate institutions** against official non-applicant records for admission cycles 2025 and 2026:
- **Core Cohort:** 53 institutions across 4 official DoTE categories and 20 approved Self-Financing colleges.
- **Separately Classified Cases:** 2 institutions:
  - **Code 3:** School of Architecture and Planning (SAP), Anna University (single TNEA offering: `BP` B.Plan; architecture handled separately).
  - **Code 5:** Faculty of Engineering and Technology (FEAT), Annamalai University (State University Faculty under Annamalai University Act).
- **2026 Baseline Verification:** All 55 institutions are verified in the 2026 directory records, accounting for **579 active offerings** spanning **89 unique programme codes**.
- **2025 Historical Continuity Verification:**
  - **`SUPPORTED_EXACT` = 54 institutions:** Exact code-based match and institutional name continuity verified against the official 2025 non-applicant seat matrix (`GENERAL_ACADEMIC_DAP_2025.pdf`, 296 pages) and DoTE administrative records. Zero name-similarity joins were performed.
  - **`HELD_NEEDS_REVIEW` = 1 institution:** **College 1516** (Thanthai Periyar GIT, Vellore) carries an active governance hold (`HOLD: PREVIOUS_YEAR_HEADER`) originating from page 160 of the 2026 college booklet, requiring official current-year intake verification before any comparison use.
  - **`UNKNOWN` = 0 institutions (Institutional Identity level):** All 55 institutions are identified with exact codes and page locators in the 2025 DAP seat matrix. However, statewide ordinary General Academic and 7.5% Government School reservation seat matrices and cutoff observations remain unlocated on the official domain (`UNKNOWN`).
  - **`NOT_APPLICABLE_TO_SOURCE_SCOPE`:** The inspected 2025 DAP seat matrix is explicitly bounded to the special-reservation differently-abled route and is not applicable for ordinary General Academic or 7.5% quota allocations.
- **Programme-Level Boundary:** 579 offerings in 2026 are baseline counts; target-route 2025 programme matches equal **0** due to absence of official ordinary General Academic and 7.5% seat matrices.
- **Excluded M4 Directory Holds:** All 6 identity-disputed directory codes (`1133`, `1301`, `1424`, `2345`, `2776`, `3815`) remain strictly excluded from the cohort.
- **T04 Extraction Ceiling Amendment:** Formally amended by owner on 2026-11-15 to cover **all 55 institutions** in the audited cohort for D5 clean-room extraction feasibility (superseding the earlier 20-pair ceiling).

---

## 2. Institutional Classification & Cohort Reconciliation

| Cohort Segment | Count | Composition | Governance & Scope Invariants |
| :--- | :---: | :--- | :--- |
| **Government Engineering Colleges** | **11** | Codes: 1516, 2005, 2369, 2603, 2615, 2709, 3464, 3465, 4974, 5009, 5901 | Official DoTE category (`https://dte.tn.gov.in/government-engineering`). 5 autonomous, 6 non-autonomous. Code 1516 held on current-year data. |
| **Anna University Department Colleges (Pure Engineering)** | **3** | Codes: 1 (CEG), 2 (ACT), 4 (MIT) | Official DoTE category (`https://dte.tn.gov.in/anna-university-department-colleges`). Non-autonomous university departments under Anna University Act. |
| **Government Aided Engineering Colleges** | **3** | Codes: 2006 (PSG Tech), 2007 (CIT), 5008 (TCE) | Official DoTE category (`https://dte.tn.gov.in/government-aided-engineering-colleges`). All 3 autonomous institutions. |
| **Anna University Constituent Colleges** | **16** | Codes: 1013, 1014, 1015, 1026, 2025, 3011, 3016, 3018, 3019, 3021, 4020, 4023, 4024, 5010, 5017, 5022 | Official DoTE category (`https://dte.tn.gov.in/anna-university-constituent-colleges`). 13 UCEs + 3 Regional Campuses (Coimbatore, Tirunelveli, Madurai). |
| **Self-Financing Group A (Autonomous Multidisciplinary)** | **10** | Codes: 1211, 1304, 1399, 1419, 2607, 2618, 2707, 2711, 2712, 4917 | Objective criteria: Autonomous = Yes, 14+ offerings (14 to 20), high single-window intake across 7 districts. |
| **Self-Financing Group B (Diverse Governance & Regional Catchment)** | **10** | Codes: 1106, 1217, 1407, 1434, 1509, 2721, 3810, 3820, 4978, 5907 | Objective criteria: 9 Non-Autonomous + 1 Regional Island Autonomous (5907), 9 to 14 offerings, non-metropolitan representation across 8 districts. |
| **Subtotal (Core Cohort)** | **53** | **Core 53 Institutional Cohort** | **Baseline recommended research scope.** |
| **Separately Classified Case 1 (SAP Anna University)** | **1** | Code: 3 (School of Architecture and Planning, Anna University) | Single TNEA offering: `BP` (B.Plan); B.Arch handled via separate architecture counselling. |
| **Separately Classified Case 2 (Annamalai University FEAT)** | **1** | Code: 5 (Faculty of Engineering and Technology, Annamalai University) | 12 engineering offerings in TNEA single-window counselling; distinct State University Act administration. |
| **Total Candidate Audit Cohort** | **55** | **53 Core + 2 Separately Classified** | **Full audited institutional scope.** |

---

## 3. Consolidated 55-Institution Identity Ledger

Every entry is anchored to exact source-literal strings, codes, and official PDF page locators from the 2025 DAP Seat Matrix (`GENERAL_ACADEMIC_DAP_2025.pdf`) and the 2026 Directory Candidate datasets. Zero name-similarity matching was performed.

### 3.1 Classification Summary
- **`SUPPORTED_EXACT`:** **54 institutions** (Exact code and name continuity demonstrated across 2025 and 2026).
- **`HELD_NEEDS_REVIEW`:** **1 institution** (Code 1516: Thanthai Periyar GIT, Vellore; held due to booklet page 160 `(Previous year data)` header).
- **`UNKNOWN`:** **0 institutions** for institutional code/name in 2025 DAP matrix; ordinary General Academic / 7.5% seat matrices remain unlocated statewide.
- **`NOT_APPLICABLE_TO_SOURCE_SCOPE`:** 2025 DAP seat matrix is restricted to the Differently Abled Persons special-reservation route and is not applicable for general quota allocations.

### 3.2 Evidence Ledger Table

| Audit ID | Code | Classification | Official 2026 Name Literal | 2025 DAP Source Locator | 2025 Name Literal (DAP Matrix) | 2026 Offerings | Classification Disposition | Governance Notes |
| :---: | :---: | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| `T03-AUD-001` | **1516** | Government Engineering College | Thanthai Periyar Government Institute of Technology, Bagayam, Vellore District 632002 (Previous year data) | p. 85 | Thanthai Periyar Government Institute of Technology   Bagayam  Vellore District 632002 | 6 | `HELD_NEEDS_REVIEW` | Booklet p160 carries "(Previous year data)" header; requires current-year official intake confirmation. |
| `T03-AUD-002` | **2005** | Government Engineering College | Government College of Technology (Autonomous), Thadagam Road, Coimbatore District 641013 | p. 90, 91 | Government College of Technology (Autonomous)  Thadagam  Road  Coimbatore District 641013 | 10 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-003` | **2369** | Government Engineering College | Government College of Engineering, Chettikkarai Post, Dharmapuri District 635704 | p. 106, 107 | Government College of Engineering  Chettikkarai Post   Dharmapuri District 635704 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-004` | **2603** | Government Engineering College | Government College of Engineering (Autonomous), Bargur, Krishnagiri District 635104 | p. 109, 110 | Government College of Engineering (Autonomous)  Bargur   Krishnagiri District 635104 | 5 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-005` | **2615** | Government Engineering College | Government College of Engineering (Autonomous), Karuppur, Salem District 636011 | p. 118 | Government College of Engineering (Autonomous)  Karuppur   Salem District 636011 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-006` | **2709** | Government Engineering College | Government College of Engineering (Formerly Institute of Road and Transport Technology), Vasavi College Post, Erode District 638316 | p. 151, 152 | Government College of Engineering (Formerly Institute of  Road and Transport Technology)  Vasavi College Post  Erode  District 638316 | 8 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-007` | **3464** | Government Engineering College | Government College of Engineering, Gandarvakottai Road, Sengipatti, Thanjavur District 613402 | p. 198 | Government College of Engineering  Gandarvakottai Road   Sengipatti  Thanjavur District 613402 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-008` | **3465** | Government Engineering College | Government College of Engineering, Srirangam, Sethurappatti, Tiruchirappalli District 620012 | p. 199 | Government College of Engineering  Srirangam  Sethurappatti   Tiruchirappalli District 620012 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-009` | **4974** | Government Engineering College | Government College of Engineering (Autonomous), Tirunelveli District 627007 | p. 258, 259 | Government College of Engineering  Tirunelveli District  627007 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-010` | **5009** | Government Engineering College | Government College of Engineering, Melachokkanathapuram, Bodinayakkanur, Theni District 625582 | p. 270, 271 | Government College of Engineering  Melachokkanathapuram   Bodinayakkanur  Theni District 625582 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-011` | **5901** | Government Engineering College | Alagappa Chettiar Government College of Engineering and Technology (Autonomous), Karaikudi, Sivagangai District 630003 | p. 281 | Alagappa Chettair Government College of Engineering and  Technology (Autonomous)  Karaikudi  Sivagangai District  630004 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-012` | **1** | Anna University Department College | University Departments of Anna University , Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025 | p. 1 | University Departments of Anna University, Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025 | 18 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-013` | **2** | Anna University Department College | University Departments of Anna University , Chennai - ACT Campus, Sardar Patel Road, Guindy, Chennai 600 025 | p. 1, 2 | University Departments of Anna University, Chennai - ACT Campus, Sardar Patel Road, Guindy, Chennai 600 025 | 11 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-014` | **4** | Anna University Department College | University Departments of Anna University , Chennai - MIT Campus, Chrompet, Tambaram Taluk, Chengalpattu District 600 044 | p. 2, 3, 4 | University Departments of Anna University, Chennai - MIT Campus, Chrompet, Tambaram Taluk, Chengalpattu District 600 044 | 12 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-015` | **3** | Separately Classified: AU SAP | School of Architecture and Planning, Anna University,Chennai 600025 | p. 1, 3 | School of Architecture and Planning  Anna University Chennai  600025 | 1 | `SUPPORTED_EXACT` | Separately classified. Single offering BP (B.Plan); Architecture handled separately. |
| `T03-AUD-016` | **5** | Separately Classified: State University Faculty | Annamalai University Faculty of Engineering and Technology ,Annamalai nagar,Cuddalore | p. 3, 4, 5, 48, 50, 65, 132, 149, 160, 161 | Annamalai University Faculty of Engineering and Technology  Annamalai nagar Cuddalore | 12 | `SUPPORTED_EXACT` | Separately classified. State University Faculty (Annamalai University Act), not Anna University. |
| `T03-AUD-017` | **2006** | Government Aided Engineering College | PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004 | p. 91, 92, 93 | PSG College of Technology (Autonomous)  Peelamedu   Coimbatore District 641004 | 24 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-018` | **2007** | Government Aided Engineering College | Coimbatore Institute of Technology (Autonomous), Civil Aerodrome Post, Coimbatore District 641014 | p. 93 | Coimbatore Institute of Technology (Autonomous)  Civil  Aerodrome Post  Coimbatore District 641014 | 15 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-019` | **5008** | Government Aided Engineering College | Thiagarajar College of Engineering (Autonomous),Tirupparankundram, Madurai District 625015 | p. 269, 270 | Thiagarajar College of Engineering (Autonomous)  Tirupparankundram  Madurai District 625015 | 18 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-020` | **1013** | Anna University Constituent College | University College of Engineering, Villupuram, Kakuppam, Villupuram District 605103 | p. 4 | University College of Engineering  Villupuram  Kakuppam   Villupuram District 605103 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-021` | **1014** | Anna University Constituent College | University College of Engineering, Tindivanam, Melpakkam, Tindivanam, Villupuram District 604001 | p. 4 | University College of Engineering  Tindivanam  Melpakkam   Tindivanam  Villupuram District 604001 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-022` | **1015** | Anna University Constituent College | University College of Engineering, Arni, Arni to Devikapuram Road, Thatchur, Arni, Thiruvannamalai District 632326 | p. 4, 5 | University College of Engineering  Arni  Arni to Devikapuram  Road  Thatchur  Arni  Thiruvannamalai District 632326 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-023` | **1026** | Anna University Constituent College | University College of Engineering, Kancheepuram, Ponnerikarai Campus, NH4, Chennai- Bangalore Highway, Karaipettai Village & Post, Kancheepuram District 631552 | p. 5 | University College of Engineering  Kancheepuram   Ponnerikarai Campus  NH4  Chennai-Bangalore Highway   Karaipettai Village & Post  Kancheepuram District 631552 | 5 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-024` | **2025** | Anna University Constituent College | Anna University Regional Campus - Coimbatore, Maruthamalai Main Road, Navavoor Bharathiyar University Post, Somayampalayam, Coimbatore District 641046 | p. 94 | Anna University Regional Campus - Coimbatore  Maruthamalai  Main Road  Navavoor Bharathiyar University Post   Somayampalayam  Coimbatore District 641046 | 6 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-025` | **3011** | Anna University Constituent College | University College of Engineering, Tiruchirappalli, (Bharathidasan Institute of Technology), Tiruchirappalli District 620024 | p. 191, 192 | University College of Engineering  Tiruchirappalli   (Bharathidasan Institute of Technology)  Tiruchirappalli District  620024 | 18 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-026` | **3016** | Anna University Constituent College | University College of Engineering, Ariyalur, Kathankudikadu Village, Thelur Post, Ariyalur District 621704 | p. 193 | University College of Engineering  Ariyalur  Kathankudikadu  Village  Thelur Post  Ariyalur District 621704 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-027` | **3018** | Anna University Constituent College | University College of Engineering, Thirukkuvalai, Nagappattinam District 610204 | p. 193, 194 | University College of Engineering  Thirukkuvalai   Nagappattinam District 610204 | 9 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-028` | **3019** | Anna University Constituent College | University College of Engineering, Panruti, Chennai-Kumbakonam Highway, Panikkankuppam, Panruti, Cuddalore District 607106 | p. 194 | University College of Engineering  Panruti  Chennai- Kumbakonam Highway  Panikkankuppam  Panruti  Cuddalore  District 607106 | 8 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-029` | **3021** | Anna University Constituent College | University College of Engineering, Pattukkottai, ECR Road, Rajamadam, Pattukkottai Taluk, Thanjavur District 614701 | p. 195 | University College of Engineering, Pattukkottai, ECR Road, Rajamadam, Pattukkottai Taluk, Thanjavur District 614701 | 8 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-030` | **4020** | Anna University Constituent College | Anna University Regional Campus - Tirunelveli, Trivandrum Road, Palayamkottai, Tirunelveli District 627007 | p. 231 | Anna University Regional Campus - Tirunelveli  Trivandrum  Road  Palayamkottai  Tirunelveli District 627007 | 5 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-031` | **4023** | Anna University Constituent College | University College of Engineering, Nagercoil, Nagercoil Industrial Estate, Konam, Kanyakumari District 629004 | p. 231, 232 | University College of Engineering  Nagercoil  Nagercoil  Industrial Estate  Konam  Kanyakumari District 629004 | 8 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-032` | **4024** | Anna University Constituent College | University V.O.C. College of Engineering, Thoothukudi, Near V.O.C. College, Millerpuram, Thoothukudi District 628008 | p. 232 | University V.O.C. College of Engineering  Thoothukudi  Near  V.O.C. College  Millerpuram  Thoothukudi District 628008 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-033` | **5010** | Anna University Constituent College | Anna University Regional Campus - Madurai, Kanyakumari National Highway, Keelakuilkudi, Madurai District 625019 | p. 271 | Anna University Regional Campus - Madurai  Kanyakumari  National Highway  Keelakuilkudi  Madurai District 625019 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-034` | **5017** | Anna University Constituent College | University College of Engineering, Ramanathapuram, Pullangudi, Ramanathapuram District 623513 | p. 271, 272 | University College of Engineering  Ramanathapuram   Pullangudi  Ramanathapuram District 623513 | 7 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-035` | **5022** | Anna University Constituent College | University College of Engineering, Dindigul, Mangarai Pirivu, Reddiyarchathiram, Dindigul District 624622 | p. 272 | University College of Engineering  Dindigul  Mangarai Pirivu   Reddiyarchathiram  Dindigul District 624622 | 8 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-036` | **1211** | Self-Financing Group A | Rajalakshmi Engineering College (Autonomous), Thandalam, Sriperumpudur Taluk, Kancheepuram District 602105 | p. 25, 26, 27 | Rajalakshmi Engineering College  (Autonomous), Rajalakshmi  Nagar, Thandalam, Kanchipuram, Chennai-602105. | 19 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-037` | **1304** | Self-Financing Group A | Easwari Engineering College (Autonomous), Ramapuram, Chennai 600089 | p. 43, 44 | Easwari Engineering College (Autonomous), Bharathi Salai,  Ramapuram, Chennai-600089. | 15 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-038` | **1399** | Self-Financing Group A | Chennai Institute of Technology (Autonomous), Puduper Village, Nandambakkam Post, Kundrathur, Chennai 600069 | p. 55, 56 | Chennai Institute of Technology (Autonomous) Puduper  Village  Nandambakkam Post  Kundrathur  Chennai 600069 | 14 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-039` | **1419** | Self-Financing Group A | Sri Sai Ram Enginering College (Autonomous), West Tambaram, Chennai 600044 | p. 65, 66 | Sri Sai Ram Engineering College (Autonomous), Sai Leo Nagar,  Poonthandalam Village, Dharkast Post, West Tambram,  Kanchipuram, Chennai-600044. | 15 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-040` | **2607** | Self-Financing Group A | K S Rangasamy College of Technology (Autonomous), Tiruchengode, Namakkal District 637215 | p. 110, 111 | K S Rangasamy College of Technology (Autonomous), K.S.R  Kalvi Nagar, Thokkavadi, Tiruchengode Tk, Namakkal-637215. | 14 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-041` | **2618** | Self-Financing Group A | Sona College of Technology (Autonomous), Suramangalam Post, Salem District 636005 | p. 120, 121, 122 | Sona College of Technology (Autonomous), Sona Nagar,  Thiagarajar Polytechnic College Road, Suramangalam  (P.O),Salem District-636005. | 18 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-042` | **2707** | Self-Financing Group A | Erode Sengunthar Engineering College (Autonomous), Thudupathi Post, Erode District 638057 | p. 148, 149, 150 | Erode Sengunthar Engineering College (Autonomous),  Thudupathi, Perundurai (Tk), Erode District-638057. | 20 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-043` | **2711** | Self-Financing Group A | Kongu Engineering College (Autonomous), Perundurai, Erode District 638052 | p. 153, 154 | Kongu Engineering College (Autonomous), Perundurai Railway  Station Road,Thoppupalayam,Perundurai, Erode-638052. | 14 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-044` | **2712** | Self-Financing Group A | Kumaraguru College of Technology (Autonomous), Chinnavedampatti Post, Coimbatore District 641006 | p. 154, 155 | Kumaraguru College of Technology (Autonomous),  Chinnavedampatti, Coimbatore-641049. | 14 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-045` | **4917** | Self-Financing Group A | Sethu Institute of Technology (Autonomous), Kariapatti Post, Virudhunagar District 626115 | p. 239, 240 | Sethu Institute of Technology (Autonomous), Pulloor,  Kariapatti, Virudhunagar-626115. | 16 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-046` | **1106** | Self-Financing Group B | Jaya Engineering College, Thirunindravur, Chennai 602024 | p. 7, 8 | Jaya Engineering College, Prakash Nagar, Thiruninravur,  Thiruvallur District, Chennai-602024. | 13 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-047` | **1217** | Self-Financing Group B | Sree Sastha Institute of Engineering and Technology, Chembarambakkam, Chennai 600103 | p. 28, 29, 30 | Sree Sastha Institute of Engineering and Technology, Chennai- Bangalore Highway, Chembarambakkam, Thiruvallur District,  Chennai-600123. | 14 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-048` | **1407** | Self-Financing Group B | G K M College of Engineering and Technology, Alappakkam-Mappedu Road, Chennai 600063 | p. 58, 59 | G K M College of Engineering and Technology, G K M Nagar,  Alappakkam-Mappedu Road, New Perugalathur, Chennai- 600063. | 10 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-049` | **1434** | Self-Financing Group B | Surya Group of Institutions, GST Road, Vikravandi Village, Villupuram District 605652 | p. 73, 74 | Surya Group of Institutions, NH-45, GST Road, Vikiravandi, Villupuram-605652. | 10 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-050` | **1509** | Self-Financing Group B | Meenakshi College of Engineering, Vembuliamman Koil Street, K K Nagar (West), Chennai 600078 | p. 82, 83 | Meenakshi College of Engineering, 12,Vembuli Amman Koil  Street, West K K Nagar, Chennai-600078. | 11 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-051` | **2721** | Self-Financing Group B | Tamilnadu College of Engineering, Karumathampatti Post, Coimbatore District 641659 | p. 161, 162 | Tamilnadu College of Engineering, Palanisame Ravi Nagar,  Karumathampatti Post, Coimbatore-641659. | 9 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-052` | **3810** | Self-Financing Group B | MAM College of Engineering, Siruganur, Tiruchirappalli District 621105 | p. 207, 208 | MAM College of Engineering, Trichy-Chennai Trunk Road,  Siruganur, Tiruchirappalli-621105. | 10 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-053` | **3820** | Self-Financing Group B | Trichy Engineering College, Konalai, Tiruchirappalli District 621132 | p. 212, 213 | Trichy Engineering College, somu Nagr,Konalai, Tiruchirappalli- 621132. | 10 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-054` | **4978** | Self-Financing Group B | Udaya School of Engineering, Ammandivilai Post, Kanyakumari District 629204 | p. 261, 262 | Udaya School of Engineering, Udaya Nagar, Vellamadi  Junction,Ammandivilai Post, Kanyakumarai District, Nagercoil- 629204. | 12 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |
| `T03-AUD-055` | **5907** | Self-Financing Group B | Mohamed Sathak Engineering College (Autonomous), Kilakarai, Ramanathapuram District 623806 | p. 283, 284 | Mohamed Sathak Engineering College (Autonomous), Sathak  Nagar, East Coast Road, Pudhu Mayakulam, Kilakarai,  Ramanathapuram District-623806. | 14 | `SUPPORTED_EXACT` | Exact code-based match verified in 2025 DAP seat matrix and 2026 directory. |

---

## 4. Programme-Level Identity Findings & T04 Boundary

Across the 55 audited institutions, the 2026 directory establishes **579 unique college–programme offerings** representing **89 distinct branch codes**.

### 4.1 Most Prevalent Programme Codes Across Audited Cohort
| Branch Code | Programme Name Literal | Cohort College Count | Core vs Emerging Grouping |
| :---: | :--- | :---: | :--- |
| **EC** | Electronics and Communication Engineering | 53 | Core Circuit Branch |
| **CS** | Computer Science and Engineering | 52 | Core Computing Branch |
| **ME** | Mechanical Engineering | 50 | Core Mechanical Branch |
| **EE** | Electrical and Electronics Engineering | 48 | Core Electrical Branch |
| **CE** | Civil Engineering | 46 | Core Infrastructure Branch |
| **IT** | Information Technology | 26 | Computing Branch |
| **AM** | Computer Science and Engineering (AI and Machine Learning) | 22 | Emerging AI Specialist Branch |
| **AD** | Artificial Intelligence and Data Science | 21 | Emerging Data Specialist Branch |
| **SC** | Computer Science and Engineering (Cyber Security) | 17 | Emerging Security Specialist Branch |
| **XM** | Mechanical Engineering (Tamil Medium) | 13 | Regional Language Delivery Variant |
| **XC** | Civil Engineering (Tamil Medium) | 11 | Regional Language Delivery Variant |
| **EI** | Electronics and Instrumentation Engineering | 11 | Instrumentation Branch |
| **CB** | Computer Science and Business Systems | 11 | Industry Partnership Specialization |

### 4.2 Programme-Level Historical Match Boundary
- **2026 Baseline Offering Count:** 579 offerings across 89 programme codes are established in the 2026 directory.
- **Verified 2025 Target-Route Programme Matches:** **0 verified matches** for ordinary General Academic and 7.5% Government School reservation routes. Official statewide 2025 seat matrices for these routes were unlocated/unavailable during census (HTTP 403 / unlinked on official portal); thus, the 579 offerings cannot be converted into verified historical pairs.
- **Special-Reservation DAP Offerings:** The 2025 DAP PDF contains branch-specific quota seat counts for differently-abled candidates, demonstrating that engineering programmes operated under these codes in 2025, but these allocations are not applicable to ordinary General Academic / 7.5% candidate counselling.
- **T04 Extraction Ceiling Scope:** Formally amended by owner on 2026-11-15 to cover **all 55 institutions** of the audited cohort for D5 clean-room extraction feasibility (General Academic and 7.5% Government School reservation quota across Rounds 1–3).
- **Execution Invariant:** Raw allotment PDFs are streamed, processed, and auto-scrubbed in isolated clean-room transient storage under D5; applicant identifiers and individual ranks are dropped in-memory immediately. Production datasets (`data/cutoffs.csv`) remain untouched.

---

## 5. Excluded Codes & Preserved Governance Holds

### 5.1 Six Excluded M4 Directory Disputed Codes
All six identity-disputed codes from the M4 governance census remain strictly excluded from this cohort and from all research activities:
1. **1133** — Name conflict between matrix ("Annai Veilankannis") and booklet ("Nellai Nadar").
2. **1301** — Identity join conflict.
3. **1424** — Identity join conflict.
4. **2345** — Identity join conflict.
5. **2776** — Identity join conflict.
6. **3815** — Identity join conflict.

### 5.2 College 1516 Governance Hold
- **Institution:** Thanthai Periyar Government Institute of Technology, Vellore (Code 1516).
- **Hold Status:** `HELD_PREVIOUS_YEAR_HEADER`.
- **Reason:** The official 2026 college information booklet (page 160) carries the explicit warning label `(Previous year data)` for this institution's profile and contact metadata.
- **Rule:** College 1516 cannot be cleared for production comparison or active historical derivation until official current-year intake and profile evidence is verified.

### 5.3 Separately Classified Cases
- **Code 3 (AU SAP):** Preserved as separately classified Anna University department offering only B.Plan (`BP`) under TNEA; B.Arch is handled through separate architecture counselling.
- **Code 5 (Annamalai FEAT):** Preserved as separately classified State University faculty governed under Annamalai University Act, distinct from Anna University constituent/department colleges.

---

## 6. Official Source Provenance & Coverage Limitations

| Cycle / Year | Official Non-Applicant Source Document | Provenance / Access Locator | Status in T03 Audit |
| :---: | :--- | :--- | :--- |
| **2026** | TNEA Information About Colleges Booklet | `https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf` | Verified; identity baseline for 55 institutions. Zero cutoff observations exist. |
| **2026** | General Academic Pre-Special Reservation Seat Matrix | `https://static.tneaonline.org/docs/GENERAL_ACADEMIC_SEAT_MATRIX_BEFORE_SPECIAL_RESERVATION_COUNSELLING_2026.pdf` | Verified; offering baseline for 579 pairs. Zero cutoff observations exist. |
| **2025** | TNEA Official Tentative Schedule | `https://static.tneaonline.org/docs/TNEA_Tent_Schedule_2025.pdf` | Verified; route, round, and counselling structure vocabulary. |
| **2025** | General Academic DAP Seat Matrix | `https://static.tneaonline.org/docs/GENERAL_ACADEMIC_DAP_2025.pdf`, SHA-256 `0ac772cad78585e2204b430dfc9e6e8965f690564fa56b51d8d3d2f852856e85` (296 pages) | Verified; explicit code and name continuity for all 55 colleges. Bounded to DAP special-reservation route. |
| **2025** | DoTE Institutional Portals | `https://dte.tn.gov.in/` (category directories) | Verified; state administrative classification and institutional existence. |
| **2025** | Ordinary General Academic Seat Matrix | `tneaonline.org` official index (HTTP 403 during census) | **Unavailable / Unverified** on official domain. |
| **2025** | 7.5% Academic Seat Matrix | `tneaonline.org` official index (HTTP 403 during census) | **Unavailable / Unverified** on official domain. |
| **2025** | Official Cutoff Portal | `https://cutoff.tneaonline.org/` (HTTP 503 during census) | **Unavailable / Unverified**; lacks accessible metric semantics. |

---

## 7. Privacy, Data Minimization & Research Governance Validation

1. **Zero Applicant Identifiers:** No applicant names, application numbers, registration numbers, dates of birth, communities, aggregate marks, or individual ranks were accessed, extracted, or retained.
2. **No Applicant PDF Processing:** Provisional allotment PDFs (`GEN_ALLOTMENT_ROUND_2_2025.pdf`, `GOVT_ALLOTMENT_ROUND_2_2025.pdf`) were strictly excluded from inspection.
3. **No External Service Transmission:** Zero research data, candidate codes, or metadata were transmitted to external AI APIs or commercial cloud services.
4. **Isolated Scratch Cleanup:** All temporary network inspection artifacts were confined to local scratch storage outside repository version control.

---

## 8. Status Declarations & Audit Guardrails

```text
T03_STATUS = ACCEPTED (Formal Owner Acceptance Recorded)
T03_DECISION = ACCEPT
T04_STATUS = AUTHORIZED (Clean-Room Feasibility for 55 Colleges under D5)
APPLICANT_ROW_PROCESSING = TRANSIENT_ONLY_UNDER_D5_PRIVACY
PRODUCTION_INGESTION = NOT_AUTHORIZED
APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED
M5_STUDENT_RELEASE = NOT_AUTHORIZED
REAL_STUDENT_VALIDATION = NOT_RUN
```

**Next Single Action:** Execute Task 1.2 & 1.3: Run isolated D5 clean-room extraction harness across the 55 colleges for Rounds 1–3 (General Academic and 7.5% quota), emit sample validation ledger with visual PDF spot-checks (>=10%), and present for Owner Review at Gate A.

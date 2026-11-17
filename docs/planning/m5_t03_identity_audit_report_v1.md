# M5-T03 — Consolidated 55-Institution Non-Applicant Identity Audit Report

**Status:** `T03_AUDIT_COMPLETED` (Non-applicant historical identity research only).
**Task Authorization & Governance State:**
- `T01 = ACCEPTED` ([M5-T01 Contract](m5_contract_spec_v1.md), commit `b332c61`)
- `T02 = ACCEPTED` ([M5-T02 Source Assessment](m5_source_census_v1.md); authorized at `9a6fd5c`, accepted at `51bb945`)
- `D5 = ACCEPTED` ([Accepted D5 Methodology](m5_derived_methodology_spec_v1.md), exact blob `3b885d3f3b05cbedbcbf9741ed72ad402abf321d`)
- `REVISED_COHORT = ACCEPTED_55_INSTITUTIONS` (Option 3 formally approved by owner on 2026-11-15)
- `YEAR_AMENDMENT = ACCEPTED_2025_2026` (Candidate year 2024 retired; 2025 historical and 2026 identity reference approved by owner)
- `SFC_SLATE = ACCEPTED_20_INSTITUTIONS` (High student preference autonomous slate approved by owner)
- `CEILING_AMENDMENT = ACCEPTED` (Level A ceiling raised to 55 institutions for T03 identity; Level B ceiling strictly capped at at most 20 exact pairs for initial T04 extraction)
- `PRIVACY_INCIDENT = CLOSED` (OneDrive cloud verification completed clean by owner; zero residual sync copies)
- `T03_AUTHORIZATION = AUTHORIZED_BY_OWNER` (Scope: 55 institutions, official non-applicant artifacts only)
- `T03_EXECUTION = COMPLETED`
- `T04_EXECUTION = NOT_AUTHORIZED` (Awaiting explicit owner Gate A review and authorization)
- `GATE_A_STATUS = PENDING_OWNER_DECISION`
- `T05_T12_APPLICATION = NOT_AUTHORIZED` (All application implementation remains frozen and unauthorized)
- `M5_RELEASE = NOT_AUTHORIZED`

**Date:** 2026-11-15
**Authority:** [Accepted M5-T01 Contract](m5_contract_spec_v1.md), [Accepted M5-T02 Assessment](m5_source_census_v1.md), [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (blob `3b885d3`), [Revised Cohort Proposal](m5_revised_cohort_and_t03_amendment_proposal_v1.md), [T03 Identity Audit Task](m5_t03_identity_audit_task_v1.md), and Owner Scope & Authorization Decision (2026-11-15).

---

## 1. Executive Summary & Audit Outcome

Under the owner's explicit scope decision (Option 3 — 55 institutions) and high-preference Self-Financing College (SFC) criteria, this audit evaluated exactly **55 candidate institutions** against official non-applicant records for admission cycles 2025 and 2026:
- **Core Cohort:** 53 institutions across 4 official Directorate of Technical Education (DoTE) categories and 20 approved high-preference autonomous Self-Financing colleges.
- **Separately Classified Boundary Cases:** 2 institutions:
  - **Code 3:** School of Architecture and Planning (SAP), Anna University (single TNEA offering: `BP` B.Plan; architecture handled separately).
  - **Code 5:** Faculty of Engineering and Technology (FEAT), Annamalai University (State University Faculty under Annamalai University Act).
- **2026 Baseline Verification:** All 55 institutions are verified in the 2026 directory records (`college-candidates.csv` and `offering-candidates.csv`), accounting for **555 active offerings** spanning **95 unique programme codes**.
- **2025 Historical Continuity Verification:**
  - **`SUPPORTED_EXACT` = 54 institutions:** Exact code-based match and institutional name continuity verified against the official 2025 non-applicant seat matrix (`GENERAL_ACADEMIC_DAP_2025.pdf`, 296 pages, SHA-256 `0ac772cad78585e2204b430dfc9e6e8965f690564fa56b51d8d3d2f852856e85`) and DoTE administrative records. Zero name-similarity joins were performed.
  - **`HELD_NEEDS_REVIEW` = 1 institution:** **College 1516** (Thanthai Periyar GIT, Vellore) carries an active governance hold (`HOLD: PREVIOUS_YEAR_HEADER`) originating from page 160 of the 2026 college booklet, requiring official current-year intake confirmation before any comparison use.
  - **`UNKNOWN` = 0 institutions (Institutional Identity level):** All 55 institutions are identified with exact codes and page locators in the 2025 DAP seat matrix. However, statewide ordinary General Academic and 7.5% Government School reservation seat matrices and cutoff observations remain unlocated on the official domain (`UNKNOWN`).
  - **`NOT_APPLICABLE_TO_SOURCE_SCOPE`:** The inspected 2025 DAP seat matrix is explicitly bounded to the special-reservation differently-abled route and is not applicable for ordinary General Academic or 7.5% quota allocations.
- **Programme-Level Boundary:** 555 offerings in 2026 are baseline counts; target-route 2025 programme matches equal **0** due to absence of official ordinary General Academic and 7.5% seat matrices.
- **Excluded M4 Directory Holds:** All 6 identity-disputed directory codes (`1133`, `1301`, `1424`, `2345`, `2776`, `3815`) remain strictly excluded from the cohort.
- **Future T04 Ceiling Preservation:** The extraction-feasibility ceiling remains strictly capped at **at most 20 exact college–programme pairs**; the 555 offerings identified across the 55 colleges are an identity denominator, not an extraction target.

---

## 2. Institutional Classification & Cohort Breakdown

| Cohort Segment | Count | Composition | Governance & Scope Invariants |
| :--- | :---: | :--- | :--- |
| **Government Engineering Colleges** | **11** | Codes: 1516, 2005, 2369, 2603, 2615, 2709, 3464, 3465, 4974, 5009, 5901 | Official DoTE category (`https://dte.tn.gov.in/government-engineering`). 5 autonomous, 6 non-autonomous. Code 1516 held on current-year data. |
| **Anna University Department Colleges (Pure Engineering)** | **3** | Codes: 1 (CEG), 2 (ACT), 4 (MIT) | Official DoTE category (`https://dte.tn.gov.in/anna-university-department-colleges`). Non-autonomous university departments under Anna University Act. |
| **Government Aided Engineering Colleges** | **3** | Codes: 2006 (PSG Tech), 2007 (CIT), 5008 (TCE) | Official DoTE category (`https://dte.tn.gov.in/government-aided-engineering-colleges`). All 3 autonomous institutions. |
| **Anna University Constituent Colleges & Regional Campuses** | **16** | Codes: 1013, 1014, 1015, 1026, 2025, 3011, 3016, 3018, 3019, 3021, 4020, 4023, 4024, 5010, 5017, 5022 | Official DoTE category (`https://dte.tn.gov.in/anna-university-constituent-colleges`). 13 UCEs + 3 Regional Campuses (Coimbatore, Tirunelveli, Madurai). |
| **Self-Financing Engineering Colleges (High Student Preference Slate)** | **20** | Codes: 1113, 1120, 1211, 1219, 1304, 1317, 1399, 1419, 1422, 1450, 2377, 2607, 2618, 2702, 2711, 2712, 2718, 2719, 4960, 5986 | Selected based on owner's explicit high-preference / reputed college criteria across Coimbatore (KCT, PSG iTech, SKCET, SREC), Chennai / Kanchipuram / Tiruvallur / Chengalpattu (REC, CIT, SVCE, Easwari, St. Joseph's, LICET, RMK, Velammal, Sai Ram, SRM Valliammai), Erode/Salem/Namakkal (BIT Sathy, Kongu, Sona, KSR), and Madurai/Virudhunagar (Mepco Schlenk, Velammal Madurai). All 20 are autonomous institutions. |
| **Subtotal (Core Cohort)** | **53** | **Core 53 Institutional Cohort** | **Baseline recommended research scope.** |
| **Separately Classified Boundary Case 1 (SAP Anna University)** | **1** | Code: 3 (School of Architecture and Planning, Anna University) | Single TNEA offering: `BP` (B.Plan); B.Arch handled via separate architecture counselling. |
| **Separately Classified Boundary Case 2 (Annamalai University FEAT)** | **1** | Code: 5 (Faculty of Engineering and Technology, Annamalai University) | 12 engineering offerings in TNEA single-window counselling; distinct State University Act administration. |
| **Total Candidate Audit Cohort** | **55** | **53 Core + 2 Boundary Cases** | **Full audited institutional scope (Option 3).** |

---

## 3. Consolidated 55-Institution Identity Ledger

Every entry is anchored to exact source-literal strings, codes, and official PDF page locators from the 2025 DAP Seat Matrix (`GENERAL_ACADEMIC_DAP_2025.pdf`, SHA-256 `0ac772cad78585e2204b430dfc9e6e8965f690564fa56b51d8d3d2f852856e85`) and the 2026 Directory Candidate datasets (`college-candidates.csv`, `offering-candidates.csv`). Zero name-similarity matching was performed.

### 3.1 Classification Summary
- **`SUPPORTED_EXACT`:** **54 institutions** (Exact code and name continuity demonstrated across 2025 and 2026).
- **`HELD_NEEDS_REVIEW`:** **1 institution** (Code 1516: Thanthai Periyar GIT, Vellore; held due to booklet page 160 `(Previous year data)` header).
- **`UNKNOWN`:** **0 institutions** for institutional code/name in 2025 DAP matrix; ordinary General Academic / 7.5% seat matrices remain unlocated statewide.
- **`NOT_APPLICABLE_TO_SOURCE_SCOPE`:** 2025 DAP seat matrix is restricted to the Differently Abled Persons special-reservation route and is not applicable for general quota allocations.

### 3.2 Evidence Ledger Table

| Audit ID | Code | Classification | Official 2026 Name Literal | 2025 DAP Source Locator | 2025 Name Literal (DAP Matrix) | 2026 Offerings | Classification Disposition | Governance Notes |
| :---: | :---: | :--- | :--- | :---: | :--- | :---: | :---: | :--- |
| `T03-AUD-001` | **1516** | Government Engineering College | Thanthai Periyar Government Institute of Technology, Bagayam, Vellore District 632002 (Previous year data) | p. 86 | Thanthai Periyar Government Institute of Technology  Bagayam  Vellore District 632002 | 6 | `HELD_NEEDS_REVIEW` | Booklet p. 160 carries '(Previous year data)' header; requires current-year official intake confirmation. 6 offerings: CE, CS, EC, EE, ME, SC. |
| `T03-AUD-002` | **2005** | Government Engineering College | Government College of Technology (Autonomous), Thadagam Road, Coimbatore District 641013 | p. 91, p. 92 | Government College of Technology (Autonomous)  Thadagam Road  Coimbatore District 641013 | 10 | `SUPPORTED_EXACT` | Autonomous state government institution. Exact code and name match. 10 offerings. |
| `T03-AUD-003` | **2369** | Government Engineering College | Government College of Engineering, Chettikkarai Post, Dharmapuri District 635704 | p. 107, p. 108 | Government College of Engineering  Chettikkarai Post  Dharmapuri District 635704 | 6 | `SUPPORTED_EXACT` | Non-autonomous government institution. Exact code and name match. 6 offerings. |
| `T03-AUD-004` | **2603** | Government Engineering College | Government College of Engineering (Autonomous), Bargur, Krishnagiri District 635104 | p. 110, p. 111 | Government College of Engineering (Autonomous)  Bargur  Krishnagiri District 635104 | 5 | `SUPPORTED_EXACT` | Autonomous government institution. Exact code and name match. 5 offerings. |
| `T03-AUD-005` | **2615** | Government Engineering College | Government College of Engineering (Autonomous), Karuppur, Salem District 636011 | p. 119 | Government College of Engineering (Autonomous)  Karuppur  Salem District 636011 | 7 | `SUPPORTED_EXACT` | Autonomous government institution. Exact code and name match. 7 offerings. |
| `T03-AUD-006` | **2709** | Government Engineering College | Government College of Engineering (Formerly Institute of Road and Transport Technology), Vasavi College Post, Erode District 638316 | p. 152, p. 153 | Government College of Engineering (Formerly Institute of Road and Transport Technology)  Vasavi College Post  Erode District 638316 | 8 | `SUPPORTED_EXACT` | Formerly IRTT; transferred to DoTE. Exact code and name match. 8 offerings. |
| `T03-AUD-007` | **3464** | Government Engineering College | Government College of Engineering, Gandarvakottai Road, Sengipatti, Thanjavur District 613402 | p. 199 | Government College of Engineering  Gandarvakottai Road  Sengipatti  Thanjavur District 613402 | 6 | `SUPPORTED_EXACT` | Non-autonomous government institution. Exact code and name match. 6 offerings. |
| `T03-AUD-008` | **3465** | Government Engineering College | Government College of Engineering, Srirangam, Sethurappatti, Tiruchirappalli District 620012 | p. 200 | Government College of Engineering  Srirangam  Sethurappatti  Tiruchirappalli District 620012 | 6 | `SUPPORTED_EXACT` | Non-autonomous government institution. Exact code and name match. 6 offerings. |
| `T03-AUD-009` | **4974** | Government Engineering College | Government College of Engineering (Autonomous), Tirunelveli District 627007 | p. 259, p. 260 | Government College of Engineering  Tirunelveli District 627007 | 7 | `SUPPORTED_EXACT` | Autonomous government institution. Exact code and name match. 7 offerings. |
| `T03-AUD-010` | **5009** | Government Engineering College | Government College of Engineering, Melachokkanathapuram, Bodinayakkanur, Theni District 625582 | p. 271, p. 272 | Government College of Engineering  Melachokkanathapuram  Bodinayakkanur  Theni District 625582 | 6 | `SUPPORTED_EXACT` | Non-autonomous government institution. Exact code and name match. 6 offerings. |
| `T03-AUD-011` | **5901** | Government Engineering College | Alagappa Chettiar Government College of Engineering and Technology (Autonomous), Karaikudi, Sivagangai District 630003 | p. 282 | Alagappa Chettair Government College of Engineering and Technology (Autonomous)  Karaikudi  Sivagangai District 630004 | 6 | `SUPPORTED_EXACT` | Autonomous government institution. Exact code and name match. 6 offerings. |
| `T03-AUD-012` | **1** | University Department | University Departments of Anna University , Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025 | p. 1, p. 2 | University Departments of Anna University Chennai - CEG Campus Sardar Patel Road Guindy Chennai 600 025 | 18 | `SUPPORTED_EXACT` | Flagship Anna University Department; non-autonomous under AU Act. 18 offerings. |
| `T03-AUD-013` | **2** | University Department | University Departments of Anna University , Chennai - ACT Campus, Sardar Patel Road, Guindy, Chennai 600 025 | p. 2 | University Departments of Anna University Chennai - ACT Campus Sardar Patel Road Guindy Chennai 600 025 | 11 | `SUPPORTED_EXACT` | Anna University chemical & technology campus. 11 offerings. |
| `T03-AUD-014` | **3** | University Department | School of Architecture and Planning, Anna University,Chennai 600025 | p. 2 | School of Architecture and Planning Anna University Chennai 600025 | 1 | `SUPPORTED_EXACT` | Single TNEA offering: BP (B.Plan). B.Arch handled via separate counselling. 1 offering. |
| `T03-AUD-015` | **4** | University Department | University Departments of Anna University , Chennai - MIT Campus, Chrompet, Tambaram Taluk, Chengalpattu District 600 044 | p. 3, p. 4 | University Departments of Anna University  Chennai - MIT Campus  Chrompet  Tambaram Taluk  Chengalpattu District 600 044 | 12 | `SUPPORTED_EXACT` | Anna University engineering & aerospace campus. 12 offerings. |
| `T03-AUD-016` | **5** | State University Department | Annamalai University Faculty of Engineering and Technology ,Annamalai nagar,Cuddalore | p. 4, p. 5 | Annamalai University Faculty of Engineering and Technology Annamalai nagar Cuddalore | 12 | `SUPPORTED_EXACT` | State University Faculty under Annamalai University Act participating in TNEA. 12 offerings. |
| `T03-AUD-017` | **2006** | Government Aided Engineering College | PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004 | p. 92, p. 93, p. 94 | PSG College of Technology (Autonomous) Peelamedu Coimbatore District 641004 | 24 | `SUPPORTED_EXACT` | Autonomous government-aided institution. Exact code and name match. 24 offerings. |
| `T03-AUD-018` | **2007** | Government Aided Engineering College | Coimbatore Institute of Technology (Autonomous), Civil Aerodrome Post, Coimbatore District 641014 | p. 94 | Coimbatore Institute of Technology (Autonomous) Civil Aerodrome Post Coimbatore District 641014 | 15 | `SUPPORTED_EXACT` | Autonomous government-aided institution. Exact code and name match. 15 offerings. |
| `T03-AUD-019` | **5008** | Government Aided Engineering College | Thiagarajar College of Engineering (Autonomous),Tirupparankundram, Madurai District 625015 | p. 270, p. 271 | Thiagarajar College of Engineering (Autonomous) Tirupparankundram Madurai District 625015 | 18 | `SUPPORTED_EXACT` | Autonomous government-aided institution. Exact code and name match. 18 offerings. |
| `T03-AUD-020` | **1013** | Anna University Constituent College | University College of Engineering, Villupuram, Kakuppam, Villupuram District 605103 | p. 5 | University College of Engineering Villupuram Kakuppam Villupuram District 605103 | 7 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 7 offerings. |
| `T03-AUD-021` | **1014** | Anna University Constituent College | University College of Engineering, Tindivanam, Melpakkam, Tindivanam, Villupuram District 604001 | p. 5 | University College of Engineering Tindivanam Melpakkam Tindivanam Villupuram District 604001 | 7 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 7 offerings. |
| `T03-AUD-022` | **1015** | Anna University Constituent College | University College of Engineering, Arni, Arni to Devikapuram Road, Thatchur, Arni, Thiruvannamalai District 632326 | p. 5, p. 6 | University College of Engineering Arni Arni to Devikapuram Road Thatchur Arni Thiruvannamalai District 632326 | 6 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 6 offerings. |
| `T03-AUD-023` | **1026** | Anna University Constituent College | University College of Engineering, Kancheepuram, Ponnerikarai Campus, NH4, Chennai- Bangalore Highway, Karaipettai Village & Post, Kancheepuram District 631552 | p. 6 | University College of Engineering Kancheepuram Ponnerikarai Campus NH4 Chennai-Bangalore Highway Karaipettai Village & Post Kancheepuram District 631552 | 5 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 5 offerings. |
| `T03-AUD-024` | **2025** | Anna University Regional Campus | Anna University Regional Campus - Coimbatore, Maruthamalai Main Road, Navavoor Bharathiyar University Post, Somayampalayam, Coimbatore District 641046 | p. 95 | Anna University Regional Campus - Coimbatore Maruthamalai Main Road Navavoor Bharathiyar University Post Somayampalayam Coimbatore District 641046 | 6 | `SUPPORTED_EXACT` | Regional campus. Exact code and name match. 6 offerings. |
| `T03-AUD-025` | **3011** | Anna University Constituent College | University College of Engineering, Tiruchirappalli, (Bharathidasan Institute of Technology), Tiruchirappalli District 620024 | p. 192, p. 193 | University College of Engineering Tiruchirappalli (Bharathidasan Institute of Technology) Tiruchirappalli District 620024 | 18 | `SUPPORTED_EXACT` | BIT Campus. Exact code and name match. 18 offerings. |
| `T03-AUD-026` | **3016** | Anna University Constituent College | University College of Engineering, Ariyalur, Kathankudikadu Village, Thelur Post, Ariyalur District 621704 | p. 194 | University College of Engineering Ariyalur Kathankudikadu Village Thelur Post Ariyalur District 621704 | 7 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 7 offerings. |
| `T03-AUD-027` | **3018** | Anna University Constituent College | University College of Engineering, Thirukkuvalai, Nagappattinam District 610204 | p. 194, p. 195 | University College of Engineering Thirukkuvalai Nagappattinam District 610204 | 9 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 9 offerings. |
| `T03-AUD-028` | **3019** | Anna University Constituent College | University College of Engineering, Panruti, Chennai-Kumbakonam Highway, Panikkankuppam, Panruti, Cuddalore District 607106 | p. 195 | University College of Engineering Panruti Chennai-Kumbakonam Highway Panikkankuppam Panruti Cuddalore District 607106 | 8 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 8 offerings. |
| `T03-AUD-029` | **3021** | Anna University Constituent College | University College of Engineering, Pattukkottai, ECR Road, Rajamadam, Pattukkottai Taluk, Thanjavur District 614701 | p. 196 | University College of Engineering Pattukkottai ECR Road Rajamadam Pattukkottai Taluk Thanjavur District 614701 | 8 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 8 offerings. |
| `T03-AUD-030` | **4020** | Anna University Regional Campus | Anna University Regional Campus - Tirunelveli, Trivandrum Road, Palayamkottai, Tirunelveli District 627007 | p. 232 | Anna University Regional Campus - Tirunelveli Trivandrum Road Palayamkottai Tirunelveli District 627007 | 5 | `SUPPORTED_EXACT` | Regional campus. Exact code and name match. 5 offerings. |
| `T03-AUD-031` | **4023** | Anna University Constituent College | University College of Engineering, Nagercoil, Nagercoil Industrial Estate, Konam, Kanyakumari District 629004 | p. 232, p. 233 | University College of Engineering Nagercoil Nagercoil Industrial Estate Konam Kanyakumari District 629004 | 8 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 8 offerings. |
| `T03-AUD-032` | **4024** | Anna University Constituent College | University V.O.C. College of Engineering, Thoothukudi, Near V.O.C. College, Millerpuram, Thoothukudi District 628008 | p. 233 | University V.O.C. College of Engineering Thoothukudi Near V.O.C. College Millerpuram Thoothukudi District 628008 | 7 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 7 offerings. |
| `T03-AUD-033` | **5010** | Anna University Regional Campus | Anna University Regional Campus - Madurai, Kanyakumari National Highway, Keelakuilkudi, Madurai District 625019 | p. 272 | Anna University Regional Campus - Madurai Kanyakumari National Highway Keelakuilkudi Madurai District 625019 | 7 | `SUPPORTED_EXACT` | Regional campus. Exact code and name match. 7 offerings. |
| `T03-AUD-034` | **5017** | Anna University Constituent College | University College of Engineering, Ramanathapuram, Pullangudi, Ramanathapuram District 623513 | p. 272, p. 273 | University College of Engineering Ramanathapuram Pullangudi Ramanathapuram District 623513 | 7 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 7 offerings. |
| `T03-AUD-035` | **5022** | Anna University Constituent College | University College of Engineering, Dindigul, Mangarai Pirivu, Reddiyarchathiram, Dindigul District 624622 | p. 273 | University College of Engineering Dindigul Mangarai Pirivu Reddiyarchathiram Dindigul District 624622 | 8 | `SUPPORTED_EXACT` | Constituent college. Exact code and name match. 8 offerings. |
| `T03-AUD-036` | **1113** | Self-Financing College (Autonomous) | R M K Engineering College (Autonomous), Kavaraipettai, Gummidipoondi, Thiruvallur District 601206 | p. 10, p. 11 | R.M.K. Engineering College (Autonomous), R.S.M. Nagar, Kavaraipettai, Gummidipoondi Taluk, Thiruvallur-601206. | 11 | `SUPPORTED_EXACT` | High student preference autonomous institution in Tiruvallur/Chennai zone. 11 offerings. |
| `T03-AUD-037` | **1120** | Self-Financing College (Autonomous) | Velammal Engineering College (Autonomous), Ambattur-Redhills Road, Chennai 600066 | p. 14, p. 15 | Velammal Engineering College (Autonomous), Velammal Nagar, Ambattur-Redhills Road, Surapet, Thiruvallur, Chennai-600066. | 10 | `SUPPORTED_EXACT` | High student preference autonomous institution in Chennai metropolitan zone. 10 offerings. |
| `T03-AUD-038` | **1211** | Self-Financing College (Autonomous) | Rajalakshmi Engineering College (Autonomous), Thandalam, Sriperumpudur Taluk, Kancheepuram District 602105 | p. 26, p. 27, p. 28 | Rajalakshmi Engineering College (Autonomous), Rajalakshmi Nagar, Thandalam, Kanchipuram, Chennai-602105. | 19 | `SUPPORTED_EXACT` | High student preference autonomous institution in Sriperumbudur/Chennai corridor. 19 offerings. |
| `T03-AUD-039` | **1219** | Self-Financing College (Autonomous) | Sri Venkateswara College of Engineering (Autonomous), Post Bag No.1, Chennai-Bengaluru High Road, Pennalur, Irungattukottai S.O., Sriperumbudur Taluk, Kancheepuram District 602105 | p. 32, p. 33 | Sri Venkateswara College of Engineering (Autonomous), Post Bag No.3, Pennalur, Sriperumbudur, Kanchipuram-602105. | 11 | `SUPPORTED_EXACT` | High student preference autonomous institution in Sriperumbudur corridor (SVCE). 11 offerings. |
| `T03-AUD-040` | **1304** | Self-Financing College (Autonomous) | Easwari Engineering College (Autonomous), Ramapuram, Chennai 600089 | p. 44, p. 45 | Easwari Engineering College (Autonomous), Bharathi Salai, Ramapuram, Chennai-600089. | 15 | `SUPPORTED_EXACT` | High student preference autonomous institution in Ramapuram/Chennai. 15 offerings. |
| `T03-AUD-041` | **1317** | Self-Financing College (Autonomous) | St. Josephs College of Engineering (Autonomous), Old Mahabalipuram Road (OMR), Chennai 600 119 | p. 51, p. 52 | St. Joseph's College of Engineering (Autonomous), Jeppiaar Nagar, Old Mamallapuram Road, Kanchipuram, Chennai-600119. | 14 | `SUPPORTED_EXACT` | High student preference autonomous institution on OMR IT corridor. 14 offerings. |
| `T03-AUD-042` | **1399** | Self-Financing College (Autonomous) | Chennai Institute of Technology (Autonomous), Puduper Village, Nandambakkam Post, Kundrathur, Chennai 600069 | p. 56, p. 57 | Chennai Institute of Technology (Autonomous) Puduper Village Nandambakkam Post Kundrathur Chennai 600069 | 14 | `SUPPORTED_EXACT` | High student preference autonomous engineering campus (CIT Chennai). 14 offerings. |
| `T03-AUD-043` | **1419** | Self-Financing College (Autonomous) | Sri Sai Ram Enginering College (Autonomous), West Tambaram, Chennai 600044 | p. 66, p. 67 | Sri Sai Ram Engineering College (Autonomous), Sai Leo Nagar, Poonthandalam Village, Dharkast Post, West Tambram, Kanchipuram, Chennai-600044. | 15 | `SUPPORTED_EXACT` | High student preference autonomous institution in West Tambaram corridor. 15 offerings. |
| `T03-AUD-044` | **1422** | Self-Financing College (Autonomous) | SRM Valliammai Engineering College (Autonomous), Kattankulathur, Chennai 603203 | p. 68, p. 69 | SRM Valliammai Engineering College (Autonomous), S.R.M. Nagar, Kattankulathur, Chengalpattu, Kancheepuram, Chennai-603203. | 11 | `SUPPORTED_EXACT` | High student preference autonomous institution in Kattankulathur corridor. 11 offerings. |
| `T03-AUD-045` | **1450** | Self-Financing College (Autonomous) | Loyola ICAM College of Engineering and Technology (Autonomous), Loyola College Campus, Nungambakkam, Chennai 600034 | p. 78, p. 79 | Loyola-ICAM College of Engineering and Technology (Autonomous), Loyola College Campus, Chennai-600034. | 6 | `SUPPORTED_EXACT` | High student preference autonomous institution in central Chennai (LICET). 6 offerings. |
| `T03-AUD-046` | **2377** | Self-Financing College (Autonomous) | PSG Institute of Technology and Applied Research(Autonomous), Avinashi Road, Neelambur, Coimbatore 641062 | p. 108 | PSG Institute of Technology and Applied Research, Avinashi Road,Neelambur, Sulur,Coimbatore -641062. | 10 | `SUPPORTED_EXACT` | High student preference autonomous institution in Coimbatore (PSG iTech). 10 offerings. |
| `T03-AUD-047` | **2607** | Self-Financing College (Autonomous) | K S Rangasamy College of Technology (Autonomous), Tiruchengode, Namakkal District 637215 | p. 111, p. 112 | K S Rangasamy College of Technology (Autonomous), K.S.R Kalvi Nagar, Thokkavadi, Tiruchengode Tk, Namakkal-637215. | 14 | `SUPPORTED_EXACT` | High student preference autonomous institution in Namakkal educational cluster. 14 offerings. |
| `T03-AUD-048` | **2618** | Self-Financing College (Autonomous) | Sona College of Technology (Autonomous), Suramangalam Post, Salem District 636005 | p. 121, p. 122, p. 123 | Sona College of Technology (Autonomous), Sona Nagar, Thiagarajar Polytechnic College Road, Suramangalam (P.O),Salem District-636005. | 18 | `SUPPORTED_EXACT` | High student preference autonomous institution in Salem industrial corridor. 18 offerings. |
| `T03-AUD-049` | **2702** | Self-Financing College (Autonomous) | Bannari Amman Institute of Technology (Autonomous), Sathyamanagalam, Erode District 638401 | p. 146, p. 147 | Bannari Amman Institute of Technology (Autonomous), Sathy-Bhavani Road, (State Highway), Alathukombai Post, Sathyamangalam (Taluk), Erode District-638401. | 10 | `SUPPORTED_EXACT` | High student preference autonomous institution in Western Zone (BIT Sathy). 10 offerings. |
| `T03-AUD-050` | **2711** | Self-Financing College (Autonomous) | Kongu Engineering College (Autonomous), Perundurai, Erode District 638052 | p. 154, p. 155 | Kongu Engineering College (Autonomous), Perundurai Railway Station Road,Thoppupalayam,Perundurai, Erode-638052. | 14 | `SUPPORTED_EXACT` | High student preference autonomous institution in Erode/Perundurai. 14 offerings. |
| `T03-AUD-051` | **2712** | Self-Financing College (Autonomous) | Kumaraguru College of Technology (Autonomous), Chinnavedampatti Post, Coimbatore District 641006 | p. 155, p. 156 | Kumaraguru College of Technology (Autonomous), Chinnavedampatti, Coimbatore-641049. | 14 | `SUPPORTED_EXACT` | High student preference autonomous institution in Coimbatore (KCT). 14 offerings. |
| `T03-AUD-052` | **2718** | Self-Financing College (Autonomous) | Sri Krishna College of Enginering and Technology (Autonomous) , Kuniamuthur, Coimbatore District 641008 | p. 160, p. 161 | Sri Krishna College of Engineering and Technology (Autonomous), Sugunapuram, Kuniamuthur Post, Coimbatore-641008. | 12 | `SUPPORTED_EXACT` | High student preference autonomous institution in Coimbatore (SKCET). 12 offerings. |
| `T03-AUD-053` | **2719** | Self-Financing College (Autonomous) | Sri Ramakrishna Engineering College (Autonomous), Vattamalaipalayam, Coimbatore District 641022 | p. 161, p. 162 | Sri Ramakrishna Engineering College (Autonomous), Vattamalaipalayam, NGGO Colony Post, Coimbatore-641022. | 12 | `SUPPORTED_EXACT` | High student preference autonomous institution in Coimbatore (SREC). 12 offerings. |
| `T03-AUD-054` | **4960** | Self-Financing College (Autonomous) | Mepco Schlenk Engineering College (Autonomous), Sivakasi, Virudhunagar District 626005 | p. 253, p. 254 | Mepco Schlenk Engineering College (Autonomous), Sivakasi,Mepco Engineering College Post,Virudhunagar District-626005. | 9 | `SUPPORTED_EXACT` | High student preference autonomous institution in Sivakasi/Virudhunagar (Mepco). 9 offerings. |
| `T03-AUD-055` | **5986** | Self-Financing College (Autonomous) | Velammal College of Engineering and Technology (Autonomous), Madurai District 625009 | p. 294, p. 295 | Velammal College of Engineering and Technology (Autonomous), Velammal Nagar, Viraganoor, Madurai -625009. | 9 | `SUPPORTED_EXACT` | High student preference autonomous institution in Madurai. 9 offerings. |

---

## 4. Programme-Level Identity Findings & T04 Boundary

Across the 55 audited institutions, the 2026 directory establishes **555 unique college–programme offerings** representing **95 distinct branch codes**.

### 4.1 Most Prevalent Programme Codes Across Audited Cohort
| Branch Code | Programme Name Literal | Cohort College Count | Core vs Emerging Grouping |
| :---: | :--- | :---: | :--- |
| **EC** | Electronics and Communication Engineering | 53 | Core Circuit Branch |
| **CS** | Computer Science and Engineering | 52 | Core Computing Branch |
| **ME** | Mechanical Engineering | 48 | Core Mechanical Branch |
| **EE** | Electrical and Electronics Engineering | 48 | Core Electrical Branch |
| **CE** | Civil Engineering | 44 | Core Infrastructure Branch |
| **IT** | Information Technology | 31 | Computing Branch |
| **AD** | Artificial Intelligence and Data Science | 29 | Emerging Data Specialist Branch |
| **AM** | Computer Science and Engineering (AI and Machine Learning) | 22 | Emerging AI Specialist Branch |
| **CB** | Computer Science and Business Systems | 15 | Industry Partnership Specialization |
| **SC** | Computer Science and Engineering (Cyber Security) | 14 | Emerging Security Specialist Branch |
| **XM** | Mechanical Engineering (Tamil Medium) | 13 | Regional Language Delivery Variant |
| **XC** | Civil Engineering (Tamil Medium) | 11 | Regional Language Delivery Variant |
| **EV** | Electronics Engineering (VLSI Design and Technology) | 8 | Semiconductor Specialist Branch |

### 4.2 Target-Route Seat Matrix Gap & T04 Boundary
- **2026 Baseline Offering Count:** 555 offerings across 95 programme codes are established in the 2026 directory.
- **2025 Target-Route Program Match:** **0** offerings can be linked to official ordinary General Academic or 7.5% seat matrices because no such documents were published as standalone matrix PDFs on `tneaonline.org` during census access.
- **Strict Invariant on Future T04 Sampling:** The initial extraction feasibility ceiling remains **strictly capped at at most 20 exact college–programme pairs**. Auditing 55 colleges and 555 offerings establishes identity feasibility only; it does not authorize statewide or cohort-wide extraction.

---

## 5. Verification & Privacy Controls

1. **Zero Personal Data:** The audit inspected non-applicant publications only (`GENERAL_ACADEMIC_DAP_2025.pdf`, DoTE directories, and 2026 candidate datasets). Zero applicant names, registration numbers, ranks, community, or individual marks were accessed or retained.
2. **Process-Scoped Isolation:** Inspection of the 2025 DAP PDF was conducted from a process-scoped temporary directory strictly outside the repository workspace and outside OneDrive.
3. **M4 Directory Holds Preserved:** All 6 identity-disputed directory codes (`1133`, `1301`, `1424`, `2345`, `2776`, `3815`) remain excluded.
4. **College 1516 Hold Preserved:** `HELD_NEEDS_REVIEW` is recorded and preserved for College 1516 due to the `(Previous year data)` header in the 2026 college booklet.

---

## 6. Audit Sign-Off & Next Action

- **`T03_AUDIT_COMPLETED = PASS`**
- **Supported Institutions:** 54
- **Held Institutions:** 1 (College 1516)
- **Unknown Institutions:** 0 (at institutional code/name level in DAP matrix)
- **Next Single Action:** Owner formal review and acceptance of this T03 Identity Audit Report, and decision on **Gate A** (authorizing or withholding T04 clean-room extraction feasibility testing).

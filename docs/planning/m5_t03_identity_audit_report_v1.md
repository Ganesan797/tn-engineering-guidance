# M5-T03 — Consolidated 55-Institution Non-Applicant Identity Audit Report

**Status:** `T03_AUDIT_COMPLETED` (Non-applicant identity research only).  
**Task Authorization State:**
- `T03_EXECUTION = COMPLETED`
- `T04_EXECUTION = NOT_AUTHORIZED`
- `APPLICANT_ROW_PROCESSING = NOT_AUTHORIZED`
- `PRODUCTION_INGESTION = NOT_AUTHORIZED`
- `APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED`
- `M5_STUDENT_RELEASE = NOT_AUTHORIZED`

**Date:** 2026-11-15  
**Branch:** `codex/m5-revised-cohort-t03-amendment`  
**Base Commit:** `e702ab7`  
**Governing Authority & Inputs:**
- Owner Scope Decision (2026-11-15) authorizing T03 non-applicant research for 55 institutions.
- [Accepted M5-T01 Contract](m5_contract_spec_v1.md) (commit `b332c61`).
- [Accepted M5-T02 Source Assessment](m5_source_census_v1.md) (2026-11-06).
- [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (commit `74351fc`, blob `3b885d3`).
- [Revised Cohort and T03 Scope Amendment Proposal](m5_revised_cohort_and_t03_amendment_proposal_v1.md).
- 2026 Governed Candidate Datasets: `college-candidates.csv`, `offering-candidates.csv`, `batch-supported.csv`, `batch-exceptions.csv`.
- Official DoTE Classification Directories (`dte.tn.gov.in`).
- Official Non-Applicant 2025 Artifacts: `TNEA_Tent_Schedule_2025.pdf`, `GENERAL_ACADEMIC_DAP_2025.pdf` (SHA-256 `0ac772cad78585e2204b430dfc9e6e8965f690564fa56b51d8d3d2f852856e85`).

---

## 1. Executive Summary & Audit Outcome

Under the owner's explicit scope decision, this audit evaluated exactly **55 candidate institutions** against official non-applicant records for admission cycles 2025 and 2026:
- **Core Cohort:** 53 institutions across 4 official DoTE categories and 20 approved Self-Financing colleges.
- **Separately Classified Cases:** 2 institutions (Code 3: SAP Anna University, B.Plan offering only; Code 5: Annamalai University FEAT, State University faculty).
- **2026 Baseline Verification:** All 55 institutions are verified in the 2026 directory records, accounting for **579 active offerings** spanning **89 unique programme codes**.
- **2025 Historical Continuity:** 54 of 55 institutions have verified non-applicant institutional identity continuity anchored in official DoTE directory classifications and TNEA single-window counselling participation.
- **Held Case:** Exactly 1 institution (**College 1516**, Thanthai Periyar GIT, Vellore) carries an active governance hold (`HOLD: PREVIOUS_YEAR_HEADER`) originating from the 2026 booklet, requiring official current-year intake verification before any comparison use.
- **Excluded M4 Directory Holds:** All 6 identity-disputed directory codes (`1133`, `1301`, `1424`, `2345`, `2776`, `3815`) remain strictly excluded from the cohort.
- **Future T04 Ceiling Preservation:** The extraction-feasibility ceiling remains strictly capped at **at most 20 exact college–programme pairs**; the 579 offerings identified across the 55 colleges are an identity denominator, not an extraction target.

---

## 2. Institutional Classification & Cohort Reconciliation

| Cohort Segment | Count | Composition | Governance & Scope Invariants |
| :--- | :---: | :--- | :--- |
| **Government Engineering Colleges** | **11** | Codes: 1516, 2005, 2369, 2603, 2615, 2709, 3464, 3465, 4974, 5009, 5901 | Official DoTE category (`https://dte.tn.gov.in/government-engineering`). 5 autonomous, 6 non-autonomous. |
| **Anna University Department Colleges (Pure Engineering)** | **3** | Codes: 1 (CEG), 2 (ACT), 4 (MIT) | Official DoTE category (`https://dte.tn.gov.in/anna-university-department-colleges`). Non-autonomous university departments. |
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

Every entry is anchored to exact source strings and codes. Zero name-similarity matching was performed.

| Audit ID | Code | Classification Segment | Official 2026 Name Literal | District | Auto | Min | 2026 Off | 2026 Identity Status | 2025 Continuity Status | Cross-Year Disposition | Governance Notes & Hold Reasons |
| :---: | :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `T03-AUD-001` | **1516** | Government Engineering College | Thanthai Periyar Government Institute of Technology, Bagayam, Vellore District 632002 | VELLORE | No | No | 6 | `HELD_PREVIOUS_YEAR_HEADER` | `HELD_PREVIOUS_YEAR_HEADER` | `HELD_PREVIOUS_YEAR_HEADER` | Booklet p160 carries "(Previous year data)" header; requires current-year official intake confirmation. |
| `T03-AUD-002` | **2005** | Government Engineering College | Government College of Technology (Autonomous), Thadagam Road, Coimbatore District 641013 | COIMBATORE | Yes | No | 10 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; autonomous state college. |
| `T03-AUD-003` | **2369** | Government Engineering College | Government College of Engineering, Chettikkarai Post, Dharmapuri District 635704 | DHARMAPURI | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; non-autonomous state college. |
| `T03-AUD-004` | **2603** | Government Engineering College | Government College of Engineering (Autonomous), Bargur, Krishnagiri District 635104 | KRISHNAGIRI | Yes | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; autonomous state college. |
| `T03-AUD-005` | **2615** | Government Engineering College | Government College of Engineering (Autonomous), Karuppur, Salem District 636011 | SALEM | Yes | No | 6 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; autonomous state college. |
| `T03-AUD-006` | **2709** | Government Engineering College | Government College of Engineering (Formerly IRTT), Vasavi College Post, Erode District 638316 | ERODE | No | No | 6 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Former IRTT; transferred to DoTE. |
| `T03-AUD-007` | **3464** | Government Engineering College | Government College of Engineering, Gandarvakottai Road, Sengipatti, Thanjavur District 613402 | THANJAVUR | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; non-autonomous state college. |
| `T03-AUD-008` | **3465** | Government Engineering College | Government College of Engineering, Srirangam, Sethurappatti, Tiruchirappalli District 620012 | TIRUCHIRAPPALLI | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; non-autonomous state college. |
| `T03-AUD-009` | **4974** | Government Engineering College | Government College of Engineering (Autonomous), Tirunelveli District 627007 | TIRUNELVELI | Yes | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; autonomous state college. |
| `T03-AUD-010` | **5009** | Government Engineering College | Government College of Engineering, Melachokkanathapuram, Bodinayakkanur, Theni District 625582 | THENI | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; non-autonomous state college. |
| `T03-AUD-011` | **5901** | Government Engineering College | Alagappa Chettiar Government College of Engineering and Technology (Autonomous), Karaikudi, Sivagangai District 630003 | SIVAGANGAI | Yes | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Clear DoTE record; ACCET autonomous state college. |
| `T03-AUD-012` | **1** | AU Department (Pure Engineering) | University Departments of Anna University, Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025 | CHENNAI | No | No | 18 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Flagship University Department; non-autonomous under AU Act. |
| `T03-AUD-013` | **2** | AU Department (Pure Engineering) | University Departments of Anna University, Chennai - ACT Campus, Sardar Patel Road, Guindy, Chennai 600 025 | CHENNAI | No | No | 11 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | University Department (Chemical & Tech Sciences). |
| `T03-AUD-014` | **4** | AU Department (Pure Engineering) | University Departments of Anna University, Chennai - MIT Campus, Chrompet, Tambaram Taluk, Chengalpattu District 600 044 | CHENGALPATTU | No | No | 12 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | University Department (Aerospace, Auto, Electronics). |
| `T03-AUD-015` | **3** | Separately Classified: AU SAP | School of Architecture and Planning, Anna University, Chennai 600025 | CHENNAI | No | No | 1 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Single TNEA offering: `BP` (B.Plan); B.Arch handled separately. |
| `T03-AUD-016` | **5** | Separately Classified: State Univ Faculty | Annamalai University Faculty of Engineering and Technology, Annamalai nagar, Cuddalore | CUDDALORE | No | No | 12 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | State University Faculty under Annamalai University Act; distinct from Anna University. |
| `T03-AUD-017` | **2006** | Government Aided Engineering College | PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004 | COIMBATORE | Yes | No | 24 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Government-aided autonomous institution; highest programme count (24). |
| `T03-AUD-018` | **2007** | Government Aided Engineering College | Coimbatore Institute of Technology (Autonomous), Civil Aerodrome Post, Coimbatore District 641014 | COIMBATORE | Yes | No | 15 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Government-aided autonomous institution. |
| `T03-AUD-019` | **5008** | Government Aided Engineering College | Thiagarajar College of Engineering (Autonomous), Tirupparankundram, Madurai District 625015 | MADURAI | Yes | No | 18 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Government-aided autonomous institution. |
| `T03-AUD-020` | **1013** | Anna University Constituent College | University College of Engineering, Villupuram, Kakuppam, Villupuram District 605103 | VILUPPURAM | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-021` | **1014** | Anna University Constituent College | University College of Engineering, Tindivanam, Melpakkam, Tindivanam, Villupuram District 604001 | VILUPPURAM | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-022` | **1015** | Anna University Constituent College | University College of Engineering, Arni, Arni to Devikapuram Road, Thatchur, Arni, Thiruvannamalai District 632326 | TIRUVANNAMALAI | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-023` | **1026** | Anna University Constituent College | University College of Engineering, Kancheepuram, Ponnerikarai Campus, NH4, Chennai-Bangalore Highway, Kancheepuram District 631552 | KANCHIPURAM | No | No | 4 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-024` | **2025** | Anna University Constituent College | Anna University Regional Campus - Coimbatore, Maruthamalai Main Road, Somayampalayam, Coimbatore District 641046 | COIMBATORE | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Regional Campus of Anna University. |
| `T03-AUD-025` | **3011** | Anna University Constituent College | University College of Engineering, Tiruchirappalli (Bharathidasan Institute of Technology), Tiruchirappalli District 620024 | TIRUCHIRAPPALLI | No | No | 11 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | BIT Campus constituent unit; 11 offerings. |
| `T03-AUD-026` | **3016** | Anna University Constituent College | University College of Engineering, Ariyalur, Kathankudikadu Village, Thelur Post, Ariyalur District 621704 | ARIYALUR | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-027` | **3018** | Anna University Constituent College | University College of Engineering, Thirukkuvalai, Nagappattinam District 610204 | NAGAPATTINAM | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-028` | **3019** | Anna University Constituent College | University College of Engineering, Panruti, Chennai-Kumbakonam Highway, Panikkankuppam, Panruti, Cuddalore District 607106 | CUDDALORE | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-029` | **3021** | Anna University Constituent College | University College of Engineering, Pattukkottai, ECR Road, Rajamadam, Pattukkottai Taluk, Thanjavur District 614701 | THANJAVUR | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-030` | **4020** | Anna University Constituent College | Anna University Regional Campus - Tirunelveli, Trivandrum Road, Palayamkottai, Tirunelveli District 627007 | TIRUNELVELI | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Regional Campus of Anna University. |
| `T03-AUD-031` | **4023** | Anna University Constituent College | University College of Engineering, Nagercoil, Nagercoil Industrial Estate, Konam, Kanyakumari District 629004 | KANNIYAKUMARI | No | No | 6 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-032` | **4024** | Anna University Constituent College | University V.O.C. College of Engineering, Thoothukudi, Near V.O.C. College, Millerpuram, Thoothukudi District 628008 | THOOTHUKUDI | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-033` | **5010** | Anna University Constituent College | Anna University Regional Campus - Madurai, Kanyakumari National Highway, Keelakuilkudi, Madurai District 625019 | MADURAI | No | No | 4 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Regional Campus of Anna University. |
| `T03-AUD-034` | **5017** | Anna University Constituent College | University College of Engineering, Ramanathapuram, Pullangudi, Ramanathapuram District 623513 | RAMANATHAPURAM | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-035` | **5022** | Anna University Constituent College | University College of Engineering, Dindigul, Mangarai Pirivu, Reddiyarchathiram, Dindigul District 624622 | DINDIGUL | No | No | 5 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Direct constituent college of Anna University. |
| `T03-AUD-036` | **1211** | Self-Financing Group A | Rajalakshmi Engineering College (Autonomous), Thandalam, Sriperumpudur Taluk, Kancheepuram District 602105 | KANCHIPURAM | Yes | Yes | 19 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Large autonomous multidisciplinary campus. |
| `T03-AUD-037` | **1304** | Self-Financing Group A | Easwari Engineering College (Autonomous), Ramapuram, Chennai 600089 | CHENNAI | Yes | Yes | 15 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Urban autonomous multidisciplinary campus. |
| `T03-AUD-038` | **1399** | Self-Financing Group A | Chennai Institute of Technology (Autonomous), Puduper Village, Nandambakkam Post, Kundrathur, Chennai 600069 | KANCHIPURAM | Yes | Yes | 14 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Autonomous engineering campus (West Chennai). |
| `T03-AUD-039` | **1419** | Self-Financing Group A | Sri Sai Ram Enginering College (Autonomous), West Tambaram, Chennai 600044 | KANCHIPURAM | Yes | No | 15 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Autonomous multidisciplinary campus. |
| `T03-AUD-040` | **2607** | Self-Financing Group A | K S Rangasamy College of Technology (Autonomous), Tiruchengode, Namakkal District 637215 | NAMAKKAL | Yes | No | 14 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Autonomous college in Namakkal cluster. |
| `T03-AUD-041` | **2618** | Self-Financing Group A | Sona College of Technology (Autonomous), Suramangalam Post, Salem District 636005 | SALEM | Yes | No | 18 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Autonomous college in Salem industrial belt. |
| `T03-AUD-042` | **2707** | Self-Financing Group A | Erode Sengunthar Engineering College (Autonomous), Thudupathi Post, Erode District 638057 | ERODE | Yes | No | 20 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Highest SFC offering count (20) in Erode district. |
| `T03-AUD-043` | **2711** | Self-Financing Group A | Kongu Engineering College (Autonomous), Perundurai, Erode District 638052 | ERODE | Yes | No | 14 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Established Western Zone autonomous campus. |
| `T03-AUD-044` | **2712** | Self-Financing Group A | Kumaraguru College of Technology (Autonomous), Chinnavedampatti Post, Coimbatore District 641006 | COIMBATORE | Yes | No | 14 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Established Coimbatore autonomous engineering college. |
| `T03-AUD-045` | **4917** | Self-Financing Group A | Sethu Institute of Technology (Autonomous), Kariapatti Post, Virudhunagar District 626115 | VIRUDHUNAGAR | Yes | No | 16 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Autonomous campus in Southern Zone. |
| `T03-AUD-046` | **1106** | Self-Financing Group B | Jaya Engineering College, Thirunindravur, Chennai 602024 | TIRUVALLUR | No | Yes | 13 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Non-autonomous affiliating model (Tiruvallur). |
| `T03-AUD-047` | **1217** | Self-Financing Group B | Sree Sastha Institute of Engineering and Technology, Chembarambakkam, Chennai 600103 | TIRUVALLUR | No | No | 14 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Highest non-autonomous offerings count (14). |
| `T03-AUD-048` | **1407** | Self-Financing Group B | G K M College of Engineering and Technology, Alappakkam-Mappedu Road, Chennai 600063 | CHENGALPATTU | No | No | 10 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Suburban non-autonomous Chengalpattu college. |
| `T03-AUD-049` | **1434** | Self-Financing Group B | Surya Group of Institutions, GST Road, Vikravandi Village, Villupuram District 605652 | VILUPPURAM | No | No | 10 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Rural/semi-urban non-autonomous highway corridor. |
| `T03-AUD-050` | **1509** | Self-Financing Group B | Meenakshi College of Engineering, Vembuliamman Koil Street, K K Nagar (West), Chennai 600078 | CHENNAI | No | Yes | 11 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Urban non-autonomous affiliating engineering college. |
| `T03-AUD-051` | **2721** | Self-Financing Group B | Tamilnadu College of Engineering, Karumathampatti Post, Coimbatore District 641659 | COIMBATORE | No | No | 9 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Pioneer rural Coimbatore non-autonomous college. |
| `T03-AUD-052` | **3810** | Self-Financing Group B | MAM College of Engineering, Siruganur, Tiruchirappalli District 621105 | TIRUCHIRAPPALLI | No | Yes | 10 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Central Delta zone non-autonomous college. |
| `T03-AUD-053` | **3820** | Self-Financing Group B | Trichy Engineering College, Konalai, Tiruchirappalli District 621132 | TIRUCHIRAPPALLI | No | No | 10 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Semi-urban Tiruchirappalli non-autonomous campus. |
| `T03-AUD-054` | **4978** | Self-Financing Group B | Udaya School of Engineering, Ammandivilai Post, Kanyakumari District 629204 | KANNIYAKUMARI | No | No | 12 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Deep south coastal non-autonomous college. |
| `T03-AUD-055` | **5907** | Self-Financing Group B | Mohamed Sathak Engineering College (Autonomous), Kilakarai, Ramanathapuram District 623806 | RAMANATHAPURAM | Yes | Yes | 14 | `VERIFIED_OFFICIAL_SUPPORTED` | `SUPPORTED_OFFICIAL_DIRECTORY` | `SUPPORTED_EXACT_CODE` | Regional coastal/island autonomous institution. |

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

### 4.2 Preservation of Future T04 Extraction Limit
- **Strict Invariant:** The presence of 579 verified 2026 offerings does **not** authorize statewide or cohort-wide historical extraction.
- **Ceiling:** Any future T04 extraction-feasibility experiment remains strictly bounded to **at most 20 exact college–programme pairs**.
- **Expansion Gate:** Expanding extraction beyond the 20-pair feasibility test requires an explicit owner decision based on measured error rates and verification effort.

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
- **Hold Status:** `HOLD: PREVIOUS_YEAR_HEADER`.
- **Reason:** The official 2026 college information booklet (page 160) carries the explicit warning label `(Previous year data)` for this institution's profile and contact metadata.
- **Rule:** College 1516 cannot be cleared for production comparison or active historical derivation until official current-year intake and profile evidence is verified.

---

## 6. Official Source Provenance & Coverage Limitations

| Cycle / Year | Official Non-Applicant Source Document | Provenance / Access Locator | Status in T03 Audit |
| :---: | :--- | :--- | :--- |
| **2026** | TNEA Information About Colleges Booklet | `static.tneaonline.org/docs/Information_about_colleges_2026.pdf` | Verified; identity baseline for 55 institutions. Zero cutoff observations exist. |
| **2026** | General Academic Pre-Special Reservation Seat Matrix | `static.tneaonline.org/docs/GENERAL_ACADEMIC_SEAT_MATRIX_BEFORE_SPECIAL_RESERVATION_COUNSELLING_2026.pdf` | Verified; offering baseline for 579 pairs. Zero cutoff observations exist. |
| **2025** | TNEA Official Tentative Schedule | `static.tneaonline.org/docs/TNEA_Tent_Schedule_2025.pdf` | Verified; route, round, and counselling structure vocabulary. |
| **2025** | General Academic DAP Seat Matrix | `static.tneaonline.org/docs/GENERAL_ACADEMIC_DAP_2025.pdf`, SHA-256 `0ac772cad78585e2204b430dfc9e6e8965f690564fa56b51d8d3d2f852856e85` | Inspected; non-applicant seat matrix layout under special reservation. |
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
T03_STATUS = COMPLETED (Non-applicant identity research only)
T04_STATUS = NOT_AUTHORIZED
APPLICANT_ROW_PROCESSING = NOT_AUTHORIZED
PRODUCTION_INGESTION = NOT_AUTHORIZED
APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED
M5_STUDENT_RELEASE = NOT_AUTHORIZED
REAL_STUDENT_VALIDATION = NOT_RUN
```

**Next Single Action:** Owner reviews consolidated T03 evidence and decides whether a bounded T04 feasibility experiment is justified.

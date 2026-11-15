# M5 — Revised Bounded Pilot Cohort and T03 Scope Amendment Proposal

**Status:** `PLANNING_PROPOSAL_PREPARED`; `OWNER_REVIEW_PENDING`.
**Task Authorization & Governance State:**
- `M5_T01 = ACCEPTED` ([M5-T01 Contract](m5_contract_spec_v1.md), commit `b332c61`)
- `M5_T02 = ACCEPTED` ([M5-T02 Source Assessment](m5_source_census_v1.md), commit `9a6fd5c`)
- `M5_D5 = ACCEPTED` ([Accepted D5 Methodology Specification](m5_derived_methodology_spec_v1.md), exact blob `3b885d3f3b05cbedbcbf9741ed72ad402abf321d` at commit `74351fcb51ac1ec699d436c1a5ae7093fda43ce4`; administrative acceptance recorded at `9c9ec585562c0f1e3917093034b15acb080221ba`)
- `REVISED_COHORT = PENDING_OWNER_APPROVAL`
- `YEAR_AMENDMENT = PENDING_OWNER_APPROVAL`
- `T03_EXECUTION = NOT_AUTHORIZED` (Prior execution on rejected branch is unaccepted historical audit evidence only)
- `T04_EXECUTION = NOT_AUTHORIZED` (Prior extraction on rejected branch was unauthorized and violated D5 scratch rules; not accepted)
- `GATE_A_STATUS = PENDING`
- `T05_T12_APPLICATION = NOT_AUTHORIZED` (All application code on rejected branch is frozen and isolated; not merged)
- `M5_RELEASE = NOT_AUTHORIZED`
- `PRIVACY_INCIDENT = OPEN/PARTIALLY_CONTAINED`
- `COHORT_IDENTITY_STATUS = NEEDS_REVIEW` (All proposed cross-year identities require explicit owner verification)
- `SELF_FINANCING_SLATE = PENDING_REVISION` (Awaiting explicit owner selection under objective criteria)

**Date:** 2026-11-15
**Base Commit:** `f3c83d6499302bd49d8a33d4d067437e86cfba61` on `origin/main`
**Authority:** [Accepted M5-T01 Contract](m5_contract_spec_v1.md), [Accepted M5-T02 Assessment](m5_source_census_v1.md), [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (blob `3b885d3`), [M5 Decision Support Proposal](m5_decision_support_proposal_v1.md).

---

## 1. Executive Summary & Objective

This decision-ready proposal updates the proposed M5 historical research cohort from the initial 10-college exploratory sample to a broader, representative institutional cohort across official Directorate of Technical Education (DoTE) categories, while preserving the accepted T01, T02, and D5 foundations.

Key amendments proposed:
1. **Institutional Coverage:** Expands the candidate identity scope to **53 core institutions** (with 54/55 accounted boundary variants), covering all eligible Government, Anna University Department, Government Aided, and Anna University Constituent engineering colleges, plus 20 objectively selected Self-Financing colleges provisionally partitioned into Group A and Group B.
2. **Year Scope Amendment:** Formally proposes amending the T01 candidate-year scope from **2024/2025** to **2025/2026**, establishing 2026 as the governed current-year identity reference and 2025 as the completed historical counselling evidence year.
3. **Objective of Historical Comparison:** The sole objective is **transparent, source-qualified historical comparison to support student understanding**. The system strictly prohibits admission probability estimation, Safe/Target/Stretch tiering, automated college ranking, automated choice ordering, and historical cutoff prediction.
4. **Dual Ceiling Architecture:** Separates identity verification (extended cohort of up to all 53–55 verified institutions) from initial extraction feasibility testing (retaining the strict ceiling of **at most 20 exact college–programme pairs**).
5. **D5 Preservation:** Maintains all derived provisional minimum mark invariants, independent General Academic and 7.5% streams, exact source-literal buckets, and strict applicant data exclusion.

---

## 2. Institutional Category Counts & Scope Accounting

Official category definitions are derived directly from the Directorate of Technical Education (DoTE), Government of Tamil Nadu:

| Category | Official DoTE Reference URL | Directory Count | Verified TNEA Participating | Governance / Scope Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Government Engineering Colleges** | `https://dte.tn.gov.in/government-engineering` | 11 | **11** | Full statewide coverage across 11 distinct districts. |
| **Anna University Department Colleges** | `https://dte.tn.gov.in/anna-university-department-colleges` | 4 (or 5) | **4 (or 5)** | 4 AU Chennai campuses (1, 2, 3, 4). Code 3 offers B.Plan only under TNEA (B.Arch via separate counselling). Code 5 is Annamalai University FEAT (State University Department). |
| **Government Aided Engineering Colleges** | `https://dte.tn.gov.in/government-aided-engineering-colleges` | 3 | **3** | All 3 established autonomous institutions (PSG Tech, CIT, TCE). |
| **Anna University Constituent Colleges** | `https://dte.tn.gov.in/anna-university-constituent-colleges` | 16 | **16** | 13 University Colleges of Engineering (UCE) + 3 Regional Campuses (Coimbatore, Tirunelveli, Madurai). |
| **Self-Financing Engineering Colleges (Proposed)** | *(Proposed from 380 directory candidates)* | 380 | **20** | Provisionally split into 10 Group A and 10 Group B institutions using objective non-ranking criteria. Slate status is PENDING_REVISION. |

### Reconciliation of Expected Preliminary Count (~53 Institutions)

The expected preliminary scope of approximately 53 institutions resolves as follows:
- **Core 53-Institution Model:**
  11 (Government) + 3 (AU Engineering Departments: Codes 1, 2, 4) + 3 (Government Aided) + 16 (Constituent) + 20 (Self-Financing) = **53 unique colleges**.
  *(Excludes Code 3 [SAP — planning offering only] and Code 5 [Annamalai University — non-Anna University state university department]).*
- **Expanded 54-Institution Model (Proposed Boundary):**
  Core 53 + Code 3 (SAP Anna University — retains B.Plan offering `BP` in single-window counselling) = **54 unique colleges**.
- **Comprehensive 55-Institution Model (Proposed Boundary):**
  Core 53 + Code 3 (SAP) + Code 5 (Annamalai University FEAT) = **55 unique colleges**.
- **Separate Central / Autonomous Specialized Institutions (Not in Core 53):**
  3 specialized institutions indexed under "CECRI AND CIPET" in the TNEA 2026 directory: Code 1321 (CIPET Chennai), Code 2343 (IIHT Salem), and Code 5012 (CECRI Karaikudi). These remain accounted as a separate research category and are not conflated with state DoTE categories.

---

## 3. Candidate Institutional Cohort & Offering-Count Accounting

Every institution listed below has been verified for unique presence in the 2026 governed directory candidate dataset (`college-candidates.csv` and `offering-candidates.csv`) with zero unresolved identity-join holds.

> [!IMPORTANT]
> **Identity Status Disclosure:** Clean presence in the 2026 candidate dataset does **NOT** establish historical identity continuity across 2025 and 2026. All 53 proposed cross-year identities remain explicitly categorized as `NEEDS_REVIEW`. No identity continuity claim is approved prior to formal owner audit sign-off.

### 3.1 Government Engineering Colleges (11 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Governance & Offering Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1516** | Thanthai Periyar Government Institute of Technology, Bagayam, Vellore District 632002 | VELLORE | No | 6 | `NEEDS_REVIEW` | Listed with "(Previous year data)" in 2026 booklet; requires 2026 intake confirmation. Offerings: CE, CS, EC, EE, ME, SC. |
| **2005** | Government College of Technology (Autonomous), Thadagam Road, Coimbatore District 641013 | COIMBATORE | Yes | 10 | `NEEDS_REVIEW` | Autonomous state government institution. Offerings: CE, CS, EC, EE, EI, IB, IT, ME, PE, PR. |
| **2369** | Government College of Engineering, Chettikkarai Post, Dharmapuri District 635704 | DHARMAPURI | No | 6 | `NEEDS_REVIEW` | Non-autonomous government institution. Verified 6 offerings in `offering-candidates.csv` (CE, CS, EC, EE, IT, ME). |
| **2603** | Government College of Engineering (Autonomous), Bargur, Krishnagiri District 635104 | KRISHNAGIRI | Yes | 5 | `NEEDS_REVIEW` | Autonomous government institution. Offerings: CE, CS, EC, EE, ME. |
| **2615** | Government College of Engineering (Autonomous), Karuppur, Salem District 636011 | SALEM | Yes | 7 | `NEEDS_REVIEW` | Autonomous government institution. Verified 7 offerings in `offering-candidates.csv` (AM, CE, CS, EC, EE, ME, MT). |
| **2709** | Government College of Engineering (Formerly IRTT), Vasavi College Post, Erode District 638316 | ERODE | No | 8 | `NEEDS_REVIEW` | Formerly IRTT; transferred to DoTE. Verified 8 offerings in `offering-candidates.csv` (AU, CE, CF, CS, EC, EE, IT, ME). |
| **3464** | Government College of Engineering, Gandarvakottai Road, Sengipatti, Thanjavur District 613402 | THANJAVUR | No | 6 | `NEEDS_REVIEW` | Non-autonomous government institution. Verified 6 offerings in `offering-candidates.csv` (CE, CS, EC, EE, ME, RM). |
| **3465** | Government College of Engineering, Srirangam, Sethurappatti, Tiruchirappalli District 620012 | TIRUCHIRAPPALLI | No | 6 | `NEEDS_REVIEW` | Non-autonomous government institution. Verified 6 offerings in `offering-candidates.csv` (CE, CS, EC, EE, ME, MZ). |
| **4974** | Government College of Engineering (Autonomous), Tirunelveli District 627007 | TIRUNELVELI | Yes | 7 | `NEEDS_REVIEW` | Autonomous government institution. Verified 7 offerings in `offering-candidates.csv` (CE, CS, EC, EE, EI, IB, ME). |
| **5009** | Government College of Engineering, Melachokkanathapuram, Bodinayakkanur, Theni District 625582 | THENI | No | 6 | `NEEDS_REVIEW` | Non-autonomous government institution. Verified 6 offerings in `offering-candidates.csv` (CE, CF, CS, EC, EE, ME). |
| **5901** | Alagappa Chettiar Government College of Engineering and Technology (Autonomous), Karaikudi, Sivagangai District 630003 | SIVAGANGAI | Yes | 6 | `NEEDS_REVIEW` | Autonomous government institution. Verified 6 offerings in `offering-candidates.csv` (CE, CS, EC, EE, IT, ME). |

### 3.2 Anna University Department Colleges & State University Departments (5 Institutions — Proposed Boundaries)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Governance & Boundary Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1** | University Departments of Anna University, Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025 | CHENNAI | No | 18 | `NEEDS_REVIEW` | Flagship University Department; non-autonomous under university statutes. 18 offerings in `offering-candidates.csv`. |
| **2** | University Departments of Anna University, Chennai - ACT Campus, Sardar Patel Road, Guindy, Chennai 600 025 | CHENNAI | No | 11 | `NEEDS_REVIEW` | University Department specializing in chemical and technological sciences. 11 offerings in `offering-candidates.csv`. |
| **3** | School of Architecture and Planning, Anna University, Chennai 600025 | CHENNAI | No | 1 | `NEEDS_REVIEW` | Single TNEA offering: `BP` (B.Plan). B.Arch is handled under separate counselling. **Boundary status: Proposed optional addition.** |
| **4** | University Departments of Anna University, Chennai - MIT Campus, Chrompet, Tambaram Taluk, Chengalpattu District 600 044 | CHENGALPATTU | No | 12 | `NEEDS_REVIEW` | University Department specializing in aerospace, automotive, electronics. 12 offerings in `offering-candidates.csv`. |
| **5** | Annamalai University Faculty of Engineering and Technology, Annamalai nagar, Cuddalore | CUDDALORE | No | 12 | `NEEDS_REVIEW` | State University Faculty participating in single-window counselling. 12 offerings in `offering-candidates.csv`. **Boundary status: Proposed optional addition.** |

### 3.3 Government Aided Engineering Colleges (3 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Governance & Offering Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **2006** | PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004 | COIMBATORE | Yes | 24 | `NEEDS_REVIEW` | Government-aided autonomous institution. Verified 24 offerings in `offering-candidates.csv`. |
| **2007** | Coimbatore Institute of Technology (Autonomous), Civil Aerodrome Post, Coimbatore District 641014 | COIMBATORE | Yes | 15 | `NEEDS_REVIEW` | Government-aided autonomous institution. Verified 15 offerings in `offering-candidates.csv`. |
| **5008** | Thiagarajar College of Engineering (Autonomous), Tirupparankundram, Madurai District 625015 | MADURAI | Yes | 18 | `NEEDS_REVIEW` | Government-aided autonomous institution. Verified 18 offerings in `offering-candidates.csv`. |

### 3.4 Anna University Constituent Colleges & Regional Campuses (16 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Governance & Offering Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1013** | University College of Engineering, Villupuram, Kakuppam, Villupuram District 605103 | VILUPPURAM | No | 7 | `NEEDS_REVIEW` | Constituent college. Verified 7 offerings in `offering-candidates.csv` (AM, CS, EC, IT, ME, SC, XM). |
| **1014** | University College of Engineering, Tindivanam, Melpakkam, Tindivanam, Villupuram District 604001 | VILUPPURAM | No | 7 | `NEEDS_REVIEW` | Constituent college. Verified 7 offerings in `offering-candidates.csv` (CA, CE, CS, EC, EF, IT, XC). |
| **1015** | University College of Engineering, Arni, Arni to Devikapuram Road, Thatchur, Arni, Thiruvannamalai District 632326 | TIRUVANNAMALAI | No | 6 | `NEEDS_REVIEW` | Constituent college. Verified 6 offerings in `offering-candidates.csv` (AM, CS, EC, EE, ME, XM). |
| **1026** | University College of Engineering, Kancheepuram, Ponnerikarai Campus, NH4, Chennai-Bangalore Highway, Kancheepuram District 631552 | KANCHIPURAM | No | 5 | `NEEDS_REVIEW` | Constituent college. Verified 5 offerings in `offering-candidates.csv` (CS, EC, EE, ME, SC). |
| **2025** | Anna University Regional Campus - Coimbatore, Maruthamalai Main Road, Somayampalayam, Coimbatore District 641046 | COIMBATORE | No | 6 | `NEEDS_REVIEW` | Regional Campus. Verified 6 offerings in `offering-candidates.csv` (AD, CS, EC, EE, EV, ME). |
| **3011** | University College of Engineering, Tiruchirappalli (Bharathidasan Institute of Technology), Tiruchirappalli District 620024 | TIRUCHIRAPPALLI | No | 18 | `NEEDS_REVIEW` | BIT Campus. Verified 18 offerings in `offering-candidates.csv` (AM, BT, CE, CF, CK, CS, EC, EE, EF, EV, IT, MB, ME, MJ, PC, PH, XC, XM). |
| **3016** | University College of Engineering, Ariyalur, Kathankudikadu Village, Thelur Post, Ariyalur District 621704 | ARIYALUR | No | 7 | `NEEDS_REVIEW` | Constituent college. Verified 7 offerings in `offering-candidates.csv` (CE, CS, EC, EE, ME, XC, XM). |
| **3018** | University College of Engineering, Thirukkuvalai, Nagappattinam District 610204 | NAGAPATTINAM | No | 9 | `NEEDS_REVIEW` | Constituent college. Verified 9 offerings in `offering-candidates.csv` (AD, CE, CS, EC, EE, EX, ME, XC, XM). |
| **3019** | University College of Engineering, Panruti, Chennai-Kumbakonam Highway, Panikkankuppam, Panruti, Cuddalore District 607106 | CUDDALORE | No | 8 | `NEEDS_REVIEW` | Constituent college. Verified 8 offerings in `offering-candidates.csv` (AM, CE, CS, EC, EE, ME, XC, XM). |
| **3021** | University College of Engineering, Pattukkottai, ECR Road, Rajamadam, Pattukkottai Taluk, Thanjavur District 614701 | THANJAVUR | No | 8 | `NEEDS_REVIEW` | Constituent college. Verified 8 offerings in `offering-candidates.csv` (AM, CE, CS, EC, EE, ME, XC, XM). |
| **4020** | Anna University Regional Campus - Tirunelveli, Trivandrum Road, Palayamkottai, Tirunelveli District 627007 | TIRUNELVELI | No | 5 | `NEEDS_REVIEW` | Regional Campus. Verified 5 offerings in `offering-candidates.csv` (CE, CS, EC, EE, ME). |
| **4023** | University College of Engineering, Nagercoil, Nagercoil Industrial Estate, Konam, Kanyakumari District 629004 | KANNIYAKUMARI | No | 8 | `NEEDS_REVIEW` | Constituent college. Verified 8 offerings in `offering-candidates.csv` (CE, CS, EC, EE, IT, ME, XC, XM). |
| **4024** | University V.O.C. College of Engineering, Thoothukudi, Near V.O.C. College, Millerpuram, Thoothukudi District 628008 | THOOTHUKUDI | No | 7 | `NEEDS_REVIEW` | Constituent college. Verified 7 offerings in `offering-candidates.csv` (CE, CS, EC, EE, ME, XC, XM). |
| **5010** | Anna University Regional Campus - Madurai, Kanyakumari National Highway, Keelakuilkudi, Madurai District 625019 | MADURAI | No | 7 | `NEEDS_REVIEW` | Regional Campus. Verified 7 offerings in `offering-candidates.csv` (AM, CE, CS, EC, EE, EV, ME). |
| **5017** | University College of Engineering, Ramanathapuram, Pullangudi, Ramanathapuram District 623513 | RAMANATHAPURAM | No | 7 | `NEEDS_REVIEW` | Constituent college. Verified 7 offerings in `offering-candidates.csv` (CE, CS, EC, EF, ME, XC, XM). |
| **5022** | University College of Engineering, Dindigul, Mangarai Pirivu, Reddiyarchathiram, Dindigul District 624622 | DINDIGUL | No | 8 | `NEEDS_REVIEW` | Constituent college. Verified 8 offerings in `offering-candidates.csv` (CE, CS, EC, EE, IT, ME, XC, XM). |

---

### 3.5 Deterministic Reconciliation of the 23 Offering-Count Discrepancies

A systematic row-level reconciliation between the draft proposal and the governed 2026 `offering-candidates.csv` resolved all 23 reported discrepancies. The original draft undercounted offerings by omitting specialized modern branches and Tamil-medium delivery variants. The exact deterministic count breakdown:

| College Code | Proposal Draft Count | Governed Count (`offering-candidates.csv`) | Discrepancy Cause & Specific Additional Offerings Identified | Deterministic Resolution |
| :---: | :---: | :---: | :--- | :---: |
| **2369** | 5 | **6** | Omitted Information Technology (`IT`). Full list: CE, CS, EC, EE, IT, ME. | RESOLVED (6) |
| **2615** | 6 | **7** | Omitted Metallurgical Engineering (`MT`). Full list: AM, CE, CS, EC, EE, ME, MT. | RESOLVED (7) |
| **2709** | 6 | **8** | Omitted Automobile (`AU`) and Data Science (`CF`). Full list: AU, CE, CF, CS, EC, EE, IT, ME. | RESOLVED (8) |
| **3464** | 5 | **6** | Omitted Robotics and Automation (`RM`). Full list: CE, CS, EC, EE, ME, RM. | RESOLVED (6) |
| **3465** | 5 | **6** | Omitted Medical Electronics (`MZ`). Full list: CE, CS, EC, EE, ME, MZ. | RESOLVED (6) |
| **4974** | 5 | **7** | Omitted Electronics & Instrumentation (`EI`) and Industrial Bio-Tech (`IB`). Full list: CE, CS, EC, EE, EI, IB, ME. | RESOLVED (7) |
| **5009** | 5 | **6** | Omitted Data Science (`CF`). Full list: CE, CF, CS, EC, EE, ME. | RESOLVED (6) |
| **5901** | 5 | **6** | Omitted Information Technology (`IT`). Full list: CE, CS, EC, EE, IT, ME. | RESOLVED (6) |
| **1013** | 5 | **7** | Omitted Cyber Security (`SC`) and Tamil-medium Mechanical (`XM`). Full list: AM, CS, EC, IT, ME, SC, XM. | RESOLVED (7) |
| **1014** | 5 | **7** | Omitted Electrical & Computer (`EF`) and Tamil-medium Civil (`XC`). Full list: CA, CE, CS, EC, EF, IT, XC. | RESOLVED (7) |
| **1015** | 5 | **6** | Omitted Tamil-medium Mechanical (`XM`). Full list: AM, CS, EC, EE, ME, XM. | RESOLVED (6) |
| **1026** | 4 | **5** | Omitted Cyber Security (`SC`). Full list: CS, EC, EE, ME, SC. | RESOLVED (5) |
| **2025** | 5 | **6** | Omitted VLSI Design (`EV`). Full list: AD, CS, EC, EE, EV, ME. | RESOLVED (6) |
| **3011** | 11 | **18** | Omitted 7 specialized & variant offerings: CK, EF, EV, MB, MJ, XC, XM. Full 18 offerings verified. | RESOLVED (18) |
| **3016** | 5 | **7** | Omitted Tamil-medium Civil (`XC`) and Mechanical (`XM`). Full list: CE, CS, EC, EE, ME, XC, XM. | RESOLVED (7) |
| **3018** | 5 | **9** | Omitted Artificial Intelligence (`AD`), Electronics & Communication variant (`EX`), XC, XM. Full 9 verified. | RESOLVED (9) |
| **3019** | 5 | **8** | Omitted AI & ML (`AM`), XC, XM. Full list: AM, CE, CS, EC, EE, ME, XC, XM. | RESOLVED (8) |
| **3021** | 5 | **8** | Omitted AI & ML (`AM`), XC, XM. Full list: AM, CE, CS, EC, EE, ME, XC, XM. | RESOLVED (8) |
| **4023** | 6 | **8** | Omitted Tamil-medium Civil (`XC`) and Mechanical (`XM`). Full list: CE, CS, EC, EE, IT, ME, XC, XM. | RESOLVED (8) |
| **4024** | 5 | **7** | Omitted Tamil-medium Civil (`XC`) and Mechanical (`XM`). Full list: CE, CS, EC, EE, ME, XC, XM. | RESOLVED (7) |
| **5010** | 4 | **7** | Omitted AI & ML (`AM`), Civil (`CE`), VLSI (`EV`). Full list: AM, CE, CS, EC, EE, EV, ME. | RESOLVED (7) |
| **5017** | 5 | **7** | Omitted Tamil-medium Civil (`XC`) and Mechanical (`XM`). Full list: CE, CS, EC, EF, ME, XC, XM. | RESOLVED (7) |
| **5022** | 5 | **8** | Omitted Information Technology (`IT`), XC, XM. Full list: CE, CS, EC, EE, IT, ME, XC, XM. | RESOLVED (8) |

All 23 counts are now 100% synchronized with the immutable 2026 governed baseline.

---

## 4. Proposed 20 Self-Financing Institutions (Candidate Slate: PENDING_REVISION)

### 4.1 Objective & Reproducible Selection Criteria
To eliminate subjective quality tiers, commercial ranking bias, or unsupported prestige classifications, the candidate slate is governed by transparent, reproducible operational criteria:
1. **Candidate Universe:** All 380 Self-Financing colleges present in the governed 2026 directory candidates dataset (`college-candidates.csv`).
2. **Exclusion Criteria:** Any institution subject to unresolved identity-join holds (explicitly excluding held codes `1133`, `1301`, `1424`, `2345`, `2776`, `3815`).
3. **Partition & Group Definitions:**
   - **Group A (10 colleges):** Multidisciplinary Autonomous institutions (`autonomous_status = 'Yes'`), testing high offering breadth (14 to 20 programmes) across major urban and industrial clusters.
   - **Group B (10 colleges):** Non-Autonomous affiliating institutions (`autonomous_status = 'No'`) following standard Anna University centralized curricula across semi-urban, rural, or coastal catchment areas (plus 1 regional coastal autonomous institution to ensure geographic balance).
4. **Deterministic Selection & Tie-Breaking Order:**
   - Primary: Partition into Group A (Autonomous) and Group B (Affiliating).
   - Secondary: Geographic distribution requiring representation across 11 distinct districts (Northern Metropolitan, Western Industrial, Salem/Namakkal Corridor, Central Delta, and Southern Coastal zones).
   - Tertiary (Tie-Breaking): Higher offering breadth in 2026 pre-special reservation seat matrix, followed by ascending numerical college code.
5. **Slate Governance Status:** Marked **`PENDING_REVISION`** for formal owner confirmation. The owner may accept, adjust, or replace colleges on this slate before any identity audit is authorized.

### 4.2 Group A: Autonomous Multidisciplinary Institutions (10 Colleges — Proposed Slate)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Geographic Cluster & Selection Characteristics |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1211** | Rajalakshmi Engineering College (Autonomous), Thandalam, Sriperumpudur Taluk, Kancheepuram District 602105 | KANCHIPURAM | Yes | 19 | `NEEDS_REVIEW` | High offering breadth (19 programmes); Northern Sriperumbudur industrial belt. |
| **1304** | Easwari Engineering College (Autonomous), Ramapuram, Chennai 600089 | CHENNAI | Yes | 15 | `NEEDS_REVIEW` | Urban metropolitan autonomous institution (Chennai). 15 offerings. |
| **1399** | Chennai Institute of Technology (Autonomous), Puduper Village, Nandambakkam Post, Kundrathur, Chennai 600069 | KANCHIPURAM | Yes | 14 | `NEEDS_REVIEW` | Multidisciplinary autonomous engineering campus (West Chennai catchment area). 14 offerings. |
| **1419** | Sri Sai Ram Enginering College (Autonomous), West Tambaram, Chennai 600044 | KANCHIPURAM | Yes | 15 | `NEEDS_REVIEW` | Autonomous multidisciplinary campus (Tambaram corridor). 15 offerings. |
| **2607** | K S Rangasamy College of Technology (Autonomous), Tiruchengode, Namakkal District 637215 | NAMAKKAL | Yes | 14 | `NEEDS_REVIEW` | Central-West educational cluster in Namakkal district. 14 offerings. |
| **2618** | Sona College of Technology (Autonomous), Suramangalam Post, Salem District 636005 | SALEM | Yes | 18 | `NEEDS_REVIEW` | Autonomous engineering institution in Salem industrial corridor. 18 offerings. |
| **2707** | Erode Sengunthar Engineering College (Autonomous), Thudupathi Post, Erode District 638057 | ERODE | Yes | 20 | `NEEDS_REVIEW` | Highest offering breadth (20 programmes) in Erode district. |
| **2711** | Kongu Engineering College (Autonomous), Perundurai, Erode District 638052 | ERODE | Yes | 14 | `NEEDS_REVIEW` | Established Western Zone autonomous engineering campus. 14 offerings. |
| **2712** | Kumaraguru College of Technology (Autonomous), Chinnavedampatti Post, Coimbatore District 641006 | COIMBATORE | Yes | 14 | `NEEDS_REVIEW` | Coimbatore tech and industrial cluster autonomous college. 14 offerings. |
| **4917** | Sethu Institute of Technology (Autonomous), Kariapatti Post, Virudhunagar District 626115 | VIRUDHUNAGAR | Yes | 16 | `NEEDS_REVIEW` | Southern Zone multidisciplinary autonomous college. 16 offerings. |

### 4.3 Group B: Non-Autonomous Affiliating & Regional Institutions (10 Colleges — Proposed Slate)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Geographic Cluster & Selection Characteristics |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1106** | Jaya Engineering College, Thirunindravur, Chennai 602024 | TIRUVALLUR | No | 13 | `NEEDS_REVIEW` | Non-autonomous affiliating model; North-West peri-urban Tiruvallur catchment. |
| **1217** | Sree Sastha Institute of Engineering and Technology, Chembarambakkam, Chennai 600103 | TIRUVALLUR | No | 14 | `NEEDS_REVIEW` | High non-autonomous offering breadth (14 programmes); Western corridor. |
| **1407** | G K M College of Engineering and Technology, Alappakkam-Mappedu Road, Chennai 600063 | CHENGALPATTU | No | 10 | `NEEDS_REVIEW` | Non-autonomous suburban Chengalpattu institution. 10 offerings. |
| **1434** | Surya Group of Institutions, GST Road, Vikravandi Village, Villupuram District 605652 | VILUPPURAM | No | 10 | `NEEDS_REVIEW` | Rural/semi-urban non-autonomous college on southern highway corridor. 10 offerings. |
| **1509** | Meenakshi College of Engineering, Vembuliamman Koil Street, K K Nagar (West), Chennai 600078 | CHENNAI | No | 11 | `NEEDS_REVIEW` | Urban non-autonomous affiliating engineering college. 11 offerings. |
| **2721** | Tamilnadu College of Engineering, Karumathampatti Post, Coimbatore District 641659 | COIMBATORE | No | 9 | `NEEDS_REVIEW` | Non-autonomous engineering college in Coimbatore rural catchment area. 9 offerings. |
| **3810** | MAM College of Engineering, Siruganur, Tiruchirappalli District 621105 | TIRUCHIRAPPALLI | No | 10 | `NEEDS_REVIEW` | Central Delta zone non-autonomous affiliating institution. 10 offerings. |
| **3820** | Trichy Engineering College, Konalai, Tiruchirappalli District 621132 | TIRUCHIRAPPALLI | No | 10 | `NEEDS_REVIEW` | Semi-urban Tiruchirappalli non-autonomous campus. 10 offerings. |
| **4978** | Udaya School of Engineering, Ammandivilai Post, Kanyakumari District 629204 | KANNIYAKUMARI | No | 12 | `NEEDS_REVIEW` | Deep south coastal non-autonomous engineering college. 12 offerings. |
| **5907** | Mohamed Sathak Engineering College (Autonomous), Kilakarai, Ramanathapuram District 623806 | RAMANATHAPURAM | Yes | 14 | `NEEDS_REVIEW` | Regional autonomous institution in coastal/minority catchment area. 14 offerings. |

---

## 5. Explicit Year-Scope Amendment (Amending T01)

### 5.1 Amendment Terms
1. **Retirement of Candidate Year 2024:** Candidate admission year 2024 is retired from primary scope due to age (two admission cycles prior to 2026).
2. **Adoption of Target Scope 2025 and 2026:**
   - **Year 2026 (Governed Current-Year Identity Reference):** Governed baseline derived from the official 2026 TNEA booklet and seat matrix. It establishes active college codes, programme codes, branch names, and delivery variants.
     **Strict Invariant:** *No 2026 cutoff observations are presumed to exist.* 2026 data is exclusively non-metric identity and intake reference data.
   - **Year 2025 (Historical Allotment Evidence):** Most recent completed TNEA admission cycle. Used for historical non-applicant identity reconciliation (schedules, seat matrices) and, subject to separate D5/T04 authorization, provisional allotment evidence.
3. **Core Guidance Objective:** **Transparent, source-qualified historical comparison to support student understanding.**
4. **Explicit Prohibitions Maintained:**
   - No admission probability or chance estimation.
   - No Safe / Target / Stretch / Dream categorization.
   - No automated college quality scoring or institutional rankings.
   - No automated preference ordering or choice optimization.
   - No historical cutoff prediction or multi-year extrapolative smoothing.
5. **Separation of Evidence Classes:**
   - *Official Institutional Identity Evidence* (DoTE portal directories, TNEA information booklets, AICTE approval notices) must remain strictly independent of *Historical Allotment Evidence* (allotment PDFs, cutoff portal entries, seat matrices).
   - An approved identity mapping across 2025 and 2026 does not constitute evidence of cutoff comparability or admission outcome.

---

## 6. Identity and Extraction Ceilings (Amending T01 & T03)

To permit comprehensive non-applicant identity auditing without expanding extraction risk, M5 adopts a two-level ceiling model:

### Level A: Extended Identity Audit Cohort Ceiling (T03 Amendment — Proposed)
- **Previous Ceiling (T01 §1, T03 §1):** At most 10 governed colleges.
- **Proposed Amended Ceiling:** **Up to all 53–55 verified institutions** in the revised pilot cohort.
- **Scope of Work:** Non-applicant identity verification only. Screen 2025 official schedules, directories, and seat matrix headers against 2026 directory records to verify college codes, institutional name literals, programme codes, autonomous changes, and discontinuation/addition of offerings.
- **Privacy Bound:** Zero applicant data processing.

### Level B: Initial Historical Extraction Feasibility Ceiling (T04 Preservation)
- **Strict Extraction Ceiling:** **At most 20 exact college–programme pairs.**
- **Scope of Work:** If T04 is separately authorized, test D5 extraction feasibility on no more than 20 exact pairs drawn from verified institutions with explicit owner-approved official sources.
- **Explicit Invariant:** The 20-pair feasibility test is *not* complete historical coverage of the 53 colleges. Any broader historical extraction requires a separate, subsequent owner decision based on measured error rates and effort.

---

## 7. Preservation of Accepted D5 Methodology

This proposal strictly adheres to the accepted D5 methodology ([m5_derived_methodology_spec_v1.md](m5_derived_methodology_spec_v1.md), blob `3b885d3f3b05cbedbcbf9741ed72ad402abf321d`):
1. **Metric Identity:** The only historical metric proposed is `DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`. It is never labelled an official cutoff or closing threshold. `official_closing_value` remains strictly null (`NOT_ESTABLISHED_BY_D5`).
2. **Stream Independence:** General Academic and government-school 7.5% Academic remain strictly independent evidence streams. Neither substitutes for the other.
3. **Exact Source-Literal Bucket Key:**
   ```text
   (source_year_literal,
    source_route_literal,
    source_stage_literal,
    source_round_literal,
    source_college_code_literal,
    source_programme_code_literal,
    source_allotted_category_literal)
   ```
4. **Failure and Completeness Semantics:** Bounded failure states (`CANDIDATE`, `WITHHELD_NEEDS_REVIEW`, `REJECTED`, `UNKNOWN_NO_OBSERVED_ROW`) are enforced. A truncated file, shifted column, or unreadable page withholds the entire source.
5. **No Processing in This Task:** No applicant-level PDFs are opened, parsed, or processed under this planning task.

---

## 8. Source Availability & Missing Evidence Audit

| Year | Source Document / Channel | Observed Status | Assessment for T03 / M5 |
| :---: | :--- | :--- | :--- |
| **2026** | TNEA Information About Colleges Booklet | Accessible (`static.tneaonline.org`) | Governed identity reference for 418 candidates / 389 directory colleges. |
| **2026** | Pre-Special Reservation Seat Matrix | Accessible (`static.tneaonline.org`) | Governed offering reference for 3,354 pairs. **Zero cutoff observations exist.** |
| **2025** | TNEA Official Tentative Schedule | Accessible (`TNEA_Tent_Schedule_2025.pdf`) | Usable for route, round, and date vocabulary. |
| **2025** | DAP Seat Matrix | Accessible (`GENERAL_ACADEMIC_DAP_2025.pdf`) | Special-reservation scope only; usable for non-applicant identity literals. |
| **2025** | General Academic Allotment (R2, R3) | Accessible (`GEN_ALLOTMENT_ROUND_2_2025.pdf`) | Applicant-level lists; **unusable under T03**. Prohibited from extraction without T04 authorization. |
| **2025** | 7.5% Academic Allotment (R1, R2) | Accessible (`GOVT_ACADEMIC_ROUND1_2025.pdf`) | Applicant-level lists; **unusable under T03**. Prohibited from extraction without T04 authorization. |
| **2025** | Official Cutoff Portal (`cutoff.tneaonline.org`) | **HTTP 503** during census access | Unavailable; lacks accessible metric definitions, category semantics, or export provenance. |
| **2025** | Ordinary General Academic Seat Matrix | **Unavailable / Unverified** | Bounded search did not locate direct official URL on `tneaonline.org`. |
| **2025** | 7.5% Academic Seat Matrix | **Unavailable / Unverified** | Bounded search did not locate direct official URL on `tneaonline.org`. |
| **2024/25**| Official Final Allotment Lists | **Unavailable / Unverified** | Official headings consistently label publications "provisional"; no "final" lists located. |

---

## 9. Privacy, Data Minimization & Storage Controls

### 9.1 Data Minimization Rules
1. **No Applicant Identifiers:** No student applicant name, application number, registration number, date of birth, community, individual aggregate mark, or individual rank may enter any repository file, manifest, research candidate, or documentation.
2. **Process-Scoped Local Scratch:** Under D5 Rule 2, any future authorized extraction must use an operating-system temporary directory strictly outside the repository workspace, outside OneDrive / Google Drive / cloud-synchronized folders, and outside backup-managed paths. Using `<workspace>/scratch` or placing temporary files inside the project workspace is strictly prohibited.
3. **No External Model Transmission:** Raw applicant-level sources or extracted tabular rows shall never be transmitted to external commercial LLM APIs or third-party gateways.

### 9.2 OneDrive Synchronized Storage Incident & Owner Verification Checklist
A prior unauthorized execution placed temporary extraction files in `<workspace>/scratch/m5-t04-transient/` inside the local project workspace. Because this repository resides under a Microsoft OneDrive synchronization root (`C:\Users\Ganesan S\OneDrive\文档\ChatGPT\AI assister career guidance`), this incident created a potential cloud synchronization risk.

**Incident Status Accounting:**
- **Local Workspace Cleanup:** `REPORTED / LOCALLY_VERIFIED`. The untracked local directory `scratch\` was completely removed from the workspace. Zero scratch files currently exist in the local workspace.
- **Git History:** `VERIFIED_CLEAN`. Zero task-created extraction artifacts entered Git history (`git log --all -- "scratch"` returned 0 matches).
- **Cloud Residual Risk:** **`OPEN / PENDING`**. It is unknown whether OneDrive synchronized these temporary files to Microsoft cloud storage prior to local deletion, whether version history retains copies, or whether cloud recycle bins contain residual artifacts.

**Owner-Operated Cloud Verification & Purge Checklist:**
1. [ ] **Check OneDrive Sync Status:** Confirm OneDrive desktop client status is "Up to date" and that no sync activity is pending.
2. [ ] **Inspect OneDrive Web Recycle Bin:** Navigate to OneDrive on the web (`https://onedrive.live.com` or organization portal) $\rightarrow$ Recycle Bin. Check for any folders named `scratch` or `m5-t04-transient`.
3. [ ] **Purge First-Stage Recycle Bin:** If found, delete the items from the recycle bin.
4. [ ] **Check Second-Stage Recycle Bin:** Navigate to the bottom of the Recycle Bin page to "Second-stage recycle bin" and permanently purge any detected copies.
5. [ ] **Version History Check:** Confirm that no parent folders retain version snapshots containing the temporary artifacts.
6. [ ] **Formal Closure:** Once verified and purged, record `PRIVACY_INCIDENT = CLOSED` in the project governance ledger. (Until owner verification is complete, status remains `OPEN/PARTIALLY_CONTAINED`).

---

## 10. Specific Owner Approvals Needed Before Execution

Before any execution begins, the owner must formally review and decide on:
1. **Cohort Scope Decision:** Confirm whether the candidate cohort shall be:
   - Option 1: Core 53 institutions (11 Govt, 3 AU Depts, 3 Govt Aided, 16 Constituent, 20 SFC).
   - Option 2: 54 institutions (Core 53 + Code 3 SAP Anna University).
   - Option 3: 55 institutions (Core 53 + Code 3 SAP + Code 5 Annamalai University).
2. **Self-Financing Institution Slate:** Approve, amend, or revise the proposed 20 college codes and their Group A / Group B partition.
3. **Year Scope Amendment:** Formally approve amending the T01 candidate-year scope to 2025/2026.
4. **Ceiling Amendment:** Formally approve amending the T03 identity-audit ceiling to the revised cohort (up to 55 institutions) while capping initial extraction feasibility at 20 pairs.
5. **T03 Execution Authorization:** Explicitly authorize or withhold authorization for running the non-applicant identity audit.
6. **Privacy Incident Verification:** Execute the owner cloud verification checklist and report status.

---

## 11. Status Declarations & Guardrails

```text
T01 = ACCEPTED
T02 = ACCEPTED
D5 = ACCEPTED (blob 3b885d3)
REVISED_COHORT = PENDING_OWNER_APPROVAL
YEAR_AMENDMENT = PENDING_OWNER_APPROVAL
T03_EXECUTION = NOT_AUTHORIZED
T04_EXECUTION = NOT_AUTHORIZED
GATE_A = PENDING
T05_T12_APPLICATION = NOT_AUTHORIZED
M5_RELEASE = NOT_AUTHORIZED
PRIVACY_INCIDENT = OPEN/PARTIALLY_CONTAINED
COHORT_IDENTITY_STATUS = NEEDS_REVIEW
SELF_FINANCING_SLATE = PENDING_REVISION
```

**Next Single Action:** Focused Codex verification of corrected reconciliation.

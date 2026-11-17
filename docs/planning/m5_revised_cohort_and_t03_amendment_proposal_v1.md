# M5 — Revised Bounded Pilot Cohort and T03 Scope Amendment Proposal

**Status:** `PROPOSAL_ACCEPTED_BY_OWNER` on 2026-11-15.
**Task Authorization & Governance State:**
- `M5_T01 = ACCEPTED` ([M5-T01 Contract](m5_contract_spec_v1.md), commit `b332c61`)
- `M5_T02 = ACCEPTED` ([M5-T02 Source Assessment](m5_source_census_v1.md); authorized at commit `9a6fd5c`, accepted at commit `51bb945bb4b2b591ba528b5b7885ffec9583e9bb`)
- `M5_D5 = ACCEPTED` ([Accepted D5 Methodology Specification](m5_derived_methodology_spec_v1.md), exact blob `3b885d3f3b05cbedbcbf9741ed72ad402abf321d` at commit `74351fcb51ac1ec699d436c1a5ae7093fda43ce4`; administrative acceptance recorded at `9c9ec585562c0f1e3917093034b15acb080221ba`)
- `REVISED_COHORT = ACCEPTED_55_INSTITUTIONS` (Option 3 accepted by owner on 2026-11-15: 11 Govt + 5 Univ Depts + 3 Govt Aided + 16 Constituent + 20 SFC)
- `YEAR_AMENDMENT = ACCEPTED_2025_2026` (2024 retired; 2025 historical evidence and 2026 identity reference accepted by owner)
- `SELF_FINANCING_SLATE = ACCEPTED_20_INSTITUTIONS` (High student preference autonomous slate approved by owner)
- `CEILING_AMENDMENT = ACCEPTED` (Level A ceiling: up to 55 institutions for T03 identity audit; Level B ceiling: strictly capped at at most 20 exact pairs for initial T04 extraction)
- `PRIVACY_INCIDENT = CLOSED` (OneDrive cloud verification completed clean by owner; zero residual sync copies)
- `T03_EXECUTION = COMPLETED` ([T03 Identity Audit Report](m5_t03_identity_audit_report_v1.md))
- `T04_EXECUTION = NOT_AUTHORIZED` (Awaiting explicit owner Gate A review and authorization)
- `GATE_A_STATUS = PENDING_OWNER_DECISION`
- `T05_T12_APPLICATION = NOT_AUTHORIZED` (All application code remains frozen and unauthorized)
- `M5_RELEASE = NOT_AUTHORIZED`
- `COHORT_IDENTITY_STATUS = AUDITED_54_SUPPORTED_1_HELD` (College 1516 held on booklet intake data)

**Date:** 2026-11-15
**Base Commit:** `f3c83d6499302bd49d8a33d4d067437e86cfba61` on `origin/main`
**Authority:** [Accepted M5-T01 Contract](m5_contract_spec_v1.md), [Accepted M5-T02 Assessment](m5_source_census_v1.md) (authorized at `9a6fd5c`, accepted at `51bb945`), [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (blob `3b885d3`), [M5 Decision Support Proposal](m5_decision_support_proposal_v1.md).

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

## 4. Accepted 20 Self-Financing Institutions (High Student Preference Slate)

### 4.1 Selection Criteria & Governance Rationale
Under the owner's explicit decision on 2026-11-15, the candidate Self-Financing College (SFC) slate reflects established high student preference in TNEA single-window counselling (e.g. Kumaraguru KCT, Mepco Schlenk, PSG iTech, REC, SVCE, CIT, SKCET, etc.):
1. **Candidate Universe:** All 380 Self-Financing colleges present in the governed 2026 directory candidates dataset (`college-candidates.csv`).
2. **Exclusion Criteria:** Any institution subject to unresolved identity-join holds (explicitly excluding held codes `1133`, `1301`, `1424`, `2345`, `2776`, `3815`).
3. **Autonomy & Governance Model:** All 20 selected institutions are autonomous (`autonomous_status = 'Yes'`), operating academic flexibility and curricular specializations.
4. **Geographic Distribution:** Covers major educational and industrial demand clusters:
   - **Northern / Chennai Metropolitan & Industrial Corridor (10 colleges):** Tiruvallur, Chennai, Kanchipuram, Chengalpattu.
   - **Western / Coimbatore, Erode, Salem, Namakkal Corridor (8 colleges):** Established engineering institutions.
   - **Southern Educational Hubs (2 colleges):** Madurai and Sivakasi/Virudhunagar.
5. **Slate Governance Status:** Marked **`ACCEPTED_BY_OWNER`** on 2026-11-15.

### 4.2 Northern & Chennai Metropolitan Cluster (10 Colleges — Accepted)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Selection & Regional Characteristics |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **1113** | R M K Engineering College (Autonomous), Kavaraipettai, Gummidipoondi, Thiruvallur District 601206 | TIRUVALLUR | Yes | 11 | `SUPPORTED_EXACT` | High student preference autonomous campus; northern Tiruvallur/Chennai corridor. 11 offerings. |
| **1120** | Velammal Engineering College (Autonomous), Ambattur-Redhills Road, Chennai 600066 | CHENNAI | Yes | 10 | `SUPPORTED_EXACT` | High student preference autonomous institution; Chennai urban industrial zone. 10 offerings. |
| **1211** | Rajalakshmi Engineering College (Autonomous), Thandalam, Sriperumpudur Taluk, Kancheepuram District 602105 | KANCHIPURAM | Yes | 19 | `SUPPORTED_EXACT` | High offering breadth (19 programmes); Sriperumbudur industrial corridor. |
| **1219** | Sri Venkateswara College of Engineering (Autonomous), Post Bag No.1, Chennai-Bengaluru High Road, Pennalur, Irungattukottai S.O., Sriperumbudur Taluk, Kancheepuram District 602105 | KANCHIPURAM | Yes | 11 | `SUPPORTED_EXACT` | Established high-preference autonomous institution (SVCE). 11 offerings. |
| **1304** | Easwari Engineering College (Autonomous), Ramapuram, Chennai 600089 | CHENNAI | Yes | 15 | `SUPPORTED_EXACT` | Urban metropolitan autonomous institution (Ramapuram/Chennai). 15 offerings. |
| **1317** | St. Josephs College of Engineering (Autonomous), Old Mahabalipuram Road (OMR), Chennai 600 119 | CHENNAI | Yes | 14 | `SUPPORTED_EXACT` | High-preference autonomous campus on OMR IT corridor. 14 offerings. |
| **1399** | Chennai Institute of Technology (Autonomous), Puduper Village, Nandambakkam Post, Kundrathur, Chennai 600069 | KANCHIPURAM | Yes | 14 | `SUPPORTED_EXACT` | Multidisciplinary autonomous engineering campus (CIT Chennai). 14 offerings. |
| **1419** | Sri Sai Ram Enginering College (Autonomous), West Tambaram, Chennai 600044 | KANCHIPURAM | Yes | 15 | `SUPPORTED_EXACT` | Autonomous multidisciplinary campus (West Tambaram corridor). 15 offerings. |
| **1422** | SRM Valliammai Engineering College (Autonomous), Kattankulathur, Chennai 603203 | CHENGALPATTU | Yes | 11 | `SUPPORTED_EXACT` | Autonomous engineering institution in Kattankulathur education hub. 11 offerings. |
| **1450** | Loyola ICAM College of Engineering and Technology (Autonomous), Loyola College Campus, Nungambakkam, Chennai 600034 | CHENNAI | Yes | 6 | `SUPPORTED_EXACT` | High-preference autonomous institution in central Chennai (LICET). 6 offerings. |

### 4.3 Western, Central & Southern Clusters (10 Colleges — Accepted)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Historical Identity Status | Selection & Regional Characteristics |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| **2377** | PSG Institute of Technology and Applied Research(Autonomous), Avinashi Road, Neelambur, Coimbatore 641062 | COIMBATORE | Yes | 10 | `SUPPORTED_EXACT` | High-preference autonomous institution in Coimbatore (PSG iTech). 10 offerings. |
| **2607** | K S Rangasamy College of Technology (Autonomous), Tiruchengode, Namakkal District 637215 | NAMAKKAL | Yes | 14 | `SUPPORTED_EXACT` | Central-West educational cluster in Namakkal district. 14 offerings. |
| **2618** | Sona College of Technology (Autonomous), Suramangalam Post, Salem District 636005 | SALEM | Yes | 18 | `SUPPORTED_EXACT` | Autonomous engineering institution in Salem industrial corridor. 18 offerings. |
| **2702** | Bannari Amman Institute of Technology (Autonomous), Sathyamanagalam, Erode District 638401 | ERODE | Yes | 10 | `SUPPORTED_EXACT` | Western Zone autonomous campus (BIT Sathy). 10 offerings. |
| **2711** | Kongu Engineering College (Autonomous), Perundurai, Erode District 638052 | ERODE | Yes | 14 | `SUPPORTED_EXACT` | Established Western Zone autonomous engineering campus (Perundurai). 14 offerings. |
| **2712** | Kumaraguru College of Technology (Autonomous), Chinnavedampatti Post, Coimbatore District 641006 | COIMBATORE | Yes | 14 | `SUPPORTED_EXACT` | High student preference autonomous college in Coimbatore (KCT). 14 offerings. |
| **2718** | Sri Krishna College of Enginering and Technology (Autonomous) , Kuniamuthur, Coimbatore District 641008 | COIMBATORE | Yes | 12 | `SUPPORTED_EXACT` | High student preference autonomous college in Coimbatore (SKCET). 12 offerings. |
| **2719** | Sri Ramakrishna Engineering College (Autonomous), Vattamalaipalayam, Coimbatore District 641022 | COIMBATORE | Yes | 12 | `SUPPORTED_EXACT` | Established autonomous engineering campus in Coimbatore (SREC). 12 offerings. |
| **4960** | Mepco Schlenk Engineering College (Autonomous), Sivakasi, Virudhunagar District 626005 | VIRUDHUNAGAR | Yes | 9 | `SUPPORTED_EXACT` | High student preference autonomous institution in Southern zone (Mepco Sivakasi). 9 offerings. |
| **5986** | Velammal College of Engineering and Technology (Autonomous), Madurai District 625009 | MADURAI | Yes | 9 | `SUPPORTED_EXACT` | High student preference autonomous engineering college in Madurai. 9 offerings. |

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
- **Local Workspace Cleanup:** `REPORTED / LOCALLY_VERIFIED`. Workspace scratch artifacts were not found in the local workspace, and the untracked local directory `scratch\` was removed.
- **Git History Accounting:**
  * Workspace scratch artifacts were not identified as committed scratch files in the reviewed Git history (`git log --all -- "scratch"` returned 0 matches).
  * However, Git history is **not** free of task-created M5 artifacts: the rejected M5 branch (`codex/m5-revised-cohort-t03-amendment`) contains committed extraction artifacts, including the Python extraction script (`scripts/build_historical_data.py`), historical-data application modules (`src/m5/historical-data.ts`, `src/m5/comparison-engine.ts`, `src/m5/bilingual-copy.ts`), and T03/T04 research reports.
  * The safe reconciliation branch (`codex/m5-authorization-reconciliation`) strictly isolates and does not import these files, preserving the clean repository baseline.
- **Cloud Residual Risk:** **`OPEN / PENDING`** (`PRIVACY_INCIDENT = OPEN/PARTIALLY_CONTAINED`). It remains unknown whether OneDrive synchronized the temporary scratch files to Microsoft cloud storage prior to local deletion, whether cloud version history retains copies, or whether cloud recycle bins contain residual copies. Privacy incident closure requires separate verification evidence.

**Owner-Operated Cloud Verification & Purge Checklist:**
1. [x] **Check OneDrive Sync Status:** Confirm OneDrive desktop client status is "Up to date" and that no sync activity is pending.
2. [x] **Inspect OneDrive Web Recycle Bin:** Navigate to OneDrive on the web (`https://onedrive.live.com` or organization portal) $\rightarrow$ Recycle Bin. Check for any folders named `scratch` or `m5-t04-transient`.
3. [x] **Purge First-Stage Recycle Bin:** Verified clean / zero items detected.
4. [x] **Check Second-Stage Recycle Bin:** Verified clean / zero items detected.
5. [x] **Version History Check:** Confirmed no version snapshots retain temporary artifacts.
6. [x] **Formal Closure:** Verified and recorded `PRIVACY_INCIDENT = CLOSED` in governance ledger by owner decision on 2026-11-15.

---

## 10. Recorded Owner Approvals (2026-11-15)

The owner formally reviewed and recorded the following decisions:
1. **Cohort Scope Decision:** **Option 3 (55 institutions)** APPROVED (11 Govt, 5 Univ Depts, 3 Govt Aided, 16 Constituent, 20 SFC).
2. **Self-Financing Institution Slate:** **20 High Student Preference Autonomous Colleges** APPROVED (Codes: 1113, 1120, 1211, 1219, 1304, 1317, 1399, 1419, 1422, 1450, 2377, 2607, 2618, 2702, 2711, 2712, 2718, 2719, 4960, 5986).
3. **Year Scope Amendment:** **2025/2026 Scope** APPROVED (Candidate year 2024 retired; 2025 historical evidence and 2026 identity reference adopted).
4. **Ceiling Amendment:** **Dual Ceilings** APPROVED (Level A ceiling: 55 institutions for T03 identity; Level B extraction ceiling strictly capped at at most 20 exact pairs for initial T04 feasibility).
5. **Privacy Incident Verification:** **OneDrive Verification CLEAN**; `PRIVACY_INCIDENT = CLOSED`.
6. **T03 Execution Authorization:** **T03 AUTHORIZED**; non-applicant identity audit executed and documented in [T03 Identity Audit Report](m5_t03_identity_audit_report_v1.md).

---

## 11. Status Declarations & Guardrails

```text
T01 = ACCEPTED
T02 = ACCEPTED
D5 = ACCEPTED (blob 3b885d3)
REVISED_COHORT = ACCEPTED_55_INSTITUTIONS
YEAR_AMENDMENT = ACCEPTED_2025_2026
SELF_FINANCING_SLATE = ACCEPTED_20_INSTITUTIONS
CEILING_AMENDMENT = ACCEPTED
PRIVACY_INCIDENT = CLOSED
T03_EXECUTION = COMPLETED
T04_EXECUTION = NOT_AUTHORIZED
GATE_A = PENDING_OWNER_DECISION
T05_T12_APPLICATION = NOT_AUTHORIZED
M5_RELEASE = NOT_AUTHORIZED
COHORT_IDENTITY_STATUS = AUDITED_54_SUPPORTED_1_HELD
```

**Next Single Action:** Owner formal review and decision on Gate A (authorizing or withholding T04 clean-room extraction feasibility testing).

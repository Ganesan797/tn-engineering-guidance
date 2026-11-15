# M5 — Revised Bounded Pilot Cohort and T03 Scope Amendment Proposal

**Status:** `PLANNING_PROPOSAL_PREPARED`; `OWNER_REVIEW_PENDING`.
**Task Authorization State:**
- `T03_EXECUTION = NOT_AUTHORIZED`
- `T04_EXECUTION = NOT_AUTHORIZED`
- `APPLICANT_ROW_PROCESSING = NOT_AUTHORIZED`
- `PRODUCTION_INGESTION = NOT_AUTHORIZED`
- `APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED`
- `M5_STUDENT_RELEASE = NOT_AUTHORIZED`

**Date:** 2026-11-15  
**Base Commit:** `9c9ec58` (`codex/m5-d5-acceptance`)  
**Authority:** [Accepted M5-T01 Contract](m5_contract_spec_v1.md) (commit `b332c61`), [Accepted M5-T02 Assessment](m5_source_census_v1.md) (2026-11-06), [Accepted M5-D5 Methodology](m5_derived_methodology_spec_v1.md) (commit `74351fc`, blob `3b885d3`), [M5 Decision Support Proposal](m5_decision_support_proposal_v1.md).

---

## 1. Executive Summary & Objective

This decision-ready proposal updates the proposed M5 historical research cohort from the initial 10-college exploratory sample to a broader, representative institutional cohort across official Directorate of Technical Education (DoTE) categories, while preserving the accepted T01, T02, and D5 foundations.

Key amendments proposed:
1. **Institutional Coverage:** Expands the candidate identity scope to **53 core institutions** (with 54/55 accounted variants), covering all eligible Government, Anna University Department, Government Aided, and Anna University Constituent engineering colleges, plus 20 objectively selected Self-Financing colleges provisionally partitioned into Group A and Group B.
2. **Year Scope Amendment:** Formally amends the T01 candidate-year scope from **2024/2025** to **2025/2026**, establishing 2026 as the governed current-year identity reference and 2025 as the completed historical counselling evidence year.
3. **Dual Ceiling Architecture:** Separates identity verification (extended cohort of up to all 53–55 verified institutions) from initial extraction feasibility testing (retaining the strict ceiling of **at most 20 exact college–programme pairs**).
4. **D5 Preservation:** Maintains all derived provisional minimum mark invariants, independent General Academic and 7.5% streams, exact source-literal buckets, and strict applicant data exclusion.

---

## 2. Institutional Category Counts & Scope Accounting

Official category definitions are derived directly from the Directorate of Technical Education (DoTE), Government of Tamil Nadu:

| Category | Official DoTE Reference URL | Directory Count | Verified TNEA Participating | Governance / Scope Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Government Engineering Colleges** | `https://dte.tn.gov.in/government-engineering` | 11 | **11** | Full statewide coverage across 11 distinct districts. |
| **Anna University Department Colleges** | `https://dte.tn.gov.in/anna-university-department-colleges` | 4 (or 5) | **4 (or 5)** | 4 AU Chennai campuses (1, 2, 3, 4). Code 3 offers B.Plan only under TNEA (B.Arch via separate counselling). Code 5 is Annamalai University FEAT (State University Department). |
| **Government Aided Engineering Colleges** | `https://dte.tn.gov.in/government-aided-engineering-colleges` | 3 | **3** | All 3 long-established autonomous institutions (PSG Tech, CIT, TCE). |
| **Anna University Constituent Colleges** | `https://dte.tn.gov.in/anna-university-constituent-colleges` | 16 | **16** | 13 University Colleges of Engineering (UCE) + 3 Regional Campuses (Coimbatore, Tirunelveli, Madurai). |
| **Self-Financing Engineering Colleges (Proposed)** | *(Proposed from 380 directory candidates)* | 380 | **20** | Provisionally split into 10 Group A and 10 Group B institutions using objective non-ranking criteria. |

### Reconciliation of Expected Preliminary Count (~53 Institutions)

The expected preliminary scope of approximately 53 institutions resolves as follows:
- **Core 53-Institution Model:**  
  11 (Government) + 3 (AU Engineering Departments: Codes 1, 2, 4) + 3 (Government Aided) + 16 (Constituent) + 20 (Self-Financing) = **53 unique colleges**.  
  *(Excludes Code 3 [SAP — planning offering only] and Code 5 [Annamalai University — non-Anna University state university department]).*
- **Expanded 54-Institution Model:**  
  Core 53 + Code 3 (SAP Anna University — retains B.Plan offering `BP` in single-window counselling) = **54 unique colleges**.
- **Comprehensive 55-Institution Model:**  
  Core 53 + Code 3 (SAP) + Code 5 (Annamalai University FEAT) = **55 unique colleges**.
- **Separate Central / Autonomous Specialized Institutions (Not in Core 53):**  
  3 specialized institutions indexed under "CECRI AND CIPET" in the TNEA 2026 directory: Code 1321 (CIPET Chennai), Code 2343 (IIHT Salem), and Code 5012 (CECRI Karaikudi). These remain accounted as a separate research category and are not conflated with state DoTE categories.

---

## 3. Deduplicated Candidate Institutional Cohort (55 Institutions)

Every institution listed below has been verified against the 2026 governed directory candidates (`college-candidates.csv` and `offering-candidates.csv`) with zero unresolved identity-join holds:

### 3.1 Government Engineering Colleges (11 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Verification & Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1516** | Thanthai Periyar Government Institute of Technology, Bagayam, Vellore District 632002 | VELLORE | No | 6 | Listed with "(Previous year data)" in 2026 booklet; requires 2026 intake confirmation. |
| **2005** | Government College of Technology (Autonomous), Thadagam Road, Coimbatore District 641013 | COIMBATORE | Yes | 10 | Autonomous state government institution. |
| **2369** | Government College of Engineering, Chettikkarai Post, Dharmapuri District 635704 | DHARMAPURI | No | 5 | Non-autonomous government institution. |
| **2603** | Government College of Engineering (Autonomous), Bargur, Krishnagiri District 635104 | KRISHNAGIRI | Yes | 5 | Autonomous government institution. |
| **2615** | Government College of Engineering (Autonomous), Karuppur, Salem District 636011 | SALEM | Yes | 6 | Autonomous government institution. |
| **2709** | Government College of Engineering (Formerly IRTT), Vasavi College Post, Erode District 638316 | ERODE | No | 6 | Formerly Institute of Road and Transport Technology; transferred to DoTE. |
| **3464** | Government College of Engineering, Gandarvakottai Road, Sengipatti, Thanjavur District 613402 | THANJAVUR | No | 5 | Non-autonomous government institution. |
| **3465** | Government College of Engineering, Srirangam, Sethurappatti, Tiruchirappalli District 620012 | TIRUCHIRAPPALLI | No | 5 | Non-autonomous government institution. |
| **4974** | Government College of Engineering (Autonomous), Tirunelveli District 627007 | TIRUNELVELI | Yes | 5 | Autonomous government institution. |
| **5009** | Government College of Engineering, Melachokkanathapuram, Bodinayakkanur, Theni District 625582 | THENI | No | 5 | Non-autonomous government institution. |
| **5901** | Alagappa Chettiar Government College of Engineering and Technology (Autonomous), Karaikudi, Sivagangai District 630003 | SIVAGANGAI | Yes | 5 | Autonomous government institution. |

### 3.2 Anna University Department Colleges & State University Departments (5 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Verification & Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1** | University Departments of Anna University, Chennai - CEG Campus, Sardar Patel Road, Guindy, Chennai 600 025 | CHENNAI | No | 18 | Flagship University Department; non-autonomous under university statutes. |
| **2** | University Departments of Anna University, Chennai - ACT Campus, Sardar Patel Road, Guindy, Chennai 600 025 | CHENNAI | No | 11 | University Department specializing in chemical and technological sciences. |
| **3** | School of Architecture and Planning, Anna University, Chennai 600025 | CHENNAI | No | 1 | Single TNEA offering: `BP` (B.Plan). B.Arch is handled under separate counselling. |
| **4** | University Departments of Anna University, Chennai - MIT Campus, Chrompet, Tambaram Taluk, Chengalpattu District 600 044 | CHENGALPATTU | No | 12 | University Department specializing in aerospace, automotive, electronics. |
| **5** | Annamalai University Faculty of Engineering and Technology, Annamalai nagar, Cuddalore | CUDDALORE | No | 12 | State University Faculty; participating in TNEA single-window counselling. |

### 3.3 Government Aided Engineering Colleges (3 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Verification & Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **2006** | PSG College of Technology (Autonomous), Peelamedu, Coimbatore District 641004 | COIMBATORE | Yes | 24 | Long-standing government-aided autonomous institution. |
| **2007** | Coimbatore Institute of Technology (Autonomous), Civil Aerodrome Post, Coimbatore District 641014 | COIMBATORE | Yes | 15 | Long-standing government-aided autonomous institution. |
| **5008** | Thiagarajar College of Engineering (Autonomous), Tirupparankundram, Madurai District 625015 | MADURAI | Yes | 18 | Long-standing government-aided autonomous institution. |

### 3.4 Anna University Constituent Colleges (16 Institutions)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Verification & Scope Notes |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1013** | University College of Engineering, Villupuram, Kakuppam, Villupuram District 605103 | VILUPPURAM | No | 5 | Direct constituent college of Anna University. |
| **1014** | University College of Engineering, Tindivanam, Melpakkam, Tindivanam, Villupuram District 604001 | VILUPPURAM | No | 5 | Direct constituent college of Anna University. |
| **1015** | University College of Engineering, Arni, Arni to Devikapuram Road, Thatchur, Arni, Thiruvannamalai District 632326 | TIRUVANNAMALAI | No | 5 | Direct constituent college of Anna University. |
| **1026** | University College of Engineering, Kancheepuram, Ponnerikarai Campus, NH4, Chennai-Bangalore Highway, Kancheepuram District 631552 | KANCHIPURAM | No | 4 | Direct constituent college of Anna University. |
| **2025** | Anna University Regional Campus - Coimbatore, Maruthamalai Main Road, Somayampalayam, Coimbatore District 641046 | COIMBATORE | No | 5 | Regional Campus unit of Anna University. |
| **3011** | University College of Engineering, Tiruchirappalli (Bharathidasan Institute of Technology), Tiruchirappalli District 620024 | TIRUCHIRAPPALLI | No | 11 | BIT Campus; large constituent engineering campus. |
| **3016** | University College of Engineering, Ariyalur, Kathankudikadu Village, Thelur Post, Ariyalur District 621704 | ARIYALUR | No | 5 | Direct constituent college of Anna University. |
| **3018** | University College of Engineering, Thirukkuvalai, Nagappattinam District 610204 | NAGAPATTINAM | No | 5 | Direct constituent college of Anna University. |
| **3019** | University College of Engineering, Panruti, Chennai-Kumbakonam Highway, Panikkankuppam, Panruti, Cuddalore District 607106 | CUDDALORE | No | 5 | Direct constituent college of Anna University. |
| **3021** | University College of Engineering, Pattukkottai, ECR Road, Rajamadam, Pattukkottai Taluk, Thanjavur District 614701 | THANJAVUR | No | 5 | Direct constituent college of Anna University. |
| **4020** | Anna University Regional Campus - Tirunelveli, Trivandrum Road, Palayamkottai, Tirunelveli District 627007 | TIRUNELVELI | No | 5 | Regional Campus unit of Anna University. |
| **4023** | University College of Engineering, Nagercoil, Nagercoil Industrial Estate, Konam, Kanyakumari District 629004 | KANNIYAKUMARI | No | 6 | Direct constituent college of Anna University. |
| **4024** | University V.O.C. College of Engineering, Thoothukudi, Near V.O.C. College, Millerpuram, Thoothukudi District 628008 | THOOTHUKUDI | No | 5 | Direct constituent college of Anna University. |
| **5010** | Anna University Regional Campus - Madurai, Kanyakumari National Highway, Keelakuilkudi, Madurai District 625019 | MADURAI | No | 4 | Regional Campus unit of Anna University. |
| **5017** | University College of Engineering, Ramanathapuram, Pullangudi, Ramanathapuram District 623513 | RAMANATHAPURAM | No | 5 | Direct constituent college of Anna University. |
| **5022** | University College of Engineering, Dindigul, Mangarai Pirivu, Reddiyarchathiram, Dindigul District 624622 | DINDIGUL | No | 5 | Direct constituent college of Anna University. |

---

## 4. Proposed 20 Self-Financing Institutions & Objective Selection Criteria

### 4.1 Objective Selection Criteria (No Quality Tiers or Invented Rankings)
To avoid subjective "Tier-1/Tier-2" classifications or commercial ranking biases, the 20 proposed institutions were selected using transparent, reproducible, and verifiable operational criteria:
1. **Verified Governance Baseline:** Clean presence in the 2026 governed directory candidate dataset with zero unresolved identity-join holds (explicitly excluding held codes `1133`, `1301`, `1424`, `2345`, `2776`, `3815`).
2. **Geographic Diversity (Catchment Area Spread):** Representation across 11 distinct districts spanning Northern Metropolitan (Chennai, Kanchipuram, Chengalpattu, Tiruvallur), Western Industrial (Coimbatore, Erode), Salem/Namakkal Belt (Salem, Namakkal), Central Delta (Tiruchirappalli, Viluppuram), and Southern (Virudhunagar, Ramanathapuram, Kanniyakumari).
3. **Offering Scale & Programme Stability:** Substantial offering volume (9 to 20 engineering programmes) to test historical cross-year programme code matching across Core, Computing, Electrical, and Mechanical disciplines.
4. **Governance Structure Split (Group A vs Group B):**
   - **Group A (10 colleges):** High-Capacity Autonomous Multidisciplinary Institutions (`autonomous_status = Yes`, 14+ offerings, high single-window intake across major industrial hubs).
   - **Group B (10 colleges):** Diverse Governance & Regional Affiliating Institutions (9 Non-Autonomous colleges following Anna University centralized curriculum + 1 Regional Island/Coastal Autonomous college, ensuring non-metropolitan representation).

### 4.2 Group A: High-Capacity Autonomous Multidisciplinary Institutions (10 Colleges)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Objective Role & Cluster |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1211** | Rajalakshmi Engineering College (Autonomous), Thandalam, Sriperumpudur Taluk, Kancheepuram District 602105 | KANCHIPURAM | Yes | 19 | Large multidisciplinary autonomous cluster (North / Sriperumbudur). |
| **1304** | Easwari Engineering College (Autonomous), Ramapuram, Chennai 600089 | CHENNAI | Yes | 15 | Urban metropolitan autonomous cluster (Chennai). |
| **1399** | Chennai Institute of Technology (Autonomous), Puduper Village, Nandambakkam Post, Kundrathur, Chennai 600069 | KANCHIPURAM | Yes | 14 | Rapidly growing autonomous engineering campus (West Chennai). |
| **1419** | Sri Sai Ram Enginering College (Autonomous), West Tambaram, Chennai 600044 | KANCHIPURAM | Yes | 15 | Established autonomous multidisciplinary campus (Tambaram). |
| **2607** | K S Rangasamy College of Technology (Autonomous), Tiruchengode, Namakkal District 637215 | NAMAKKAL | Yes | 14 | Major educational hub in Namakkal / Central-West. |
| **2618** | Sona College of Technology (Autonomous), Suramangalam Post, Salem District 636005 | SALEM | Yes | 18 | Prominent Salem industrial belt autonomous institution. |
| **2707** | Erode Sengunthar Engineering College (Autonomous), Thudupathi Post, Erode District 638057 | ERODE | Yes | 20 | Highest offering breadth (20 programmes) in Erode district. |
| **2711** | Kongu Engineering College (Autonomous), Perundurai, Erode District 638052 | ERODE | Yes | 14 | Major established Western Zone engineering campus. |
| **2712** | Kumaraguru College of Technology (Autonomous), Chinnavedampatti Post, Coimbatore District 641006 | COIMBATORE | Yes | 14 | Established Coimbatore tech and engineering cluster. |
| **4917** | Sethu Institute of Technology (Autonomous), Kariapatti Post, Virudhunagar District 626115 | VIRUDHUNAGAR | Yes | 16 | Major Southern Zone multidisciplinary autonomous college. |

### 4.3 Group B: Diverse Governance & Regional Affiliating Institutions (10 Colleges)
| Code | Official Name Literal | District | Autonomy | 2026 Offerings | Objective Role & Cluster |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1106** | Jaya Engineering College, Thirunindravur, Chennai 602024 | TIRUVALLUR | No | 13 | Non-autonomous affiliating model; North-West peri-urban catchment. |
| **1217** | Sree Sastha Institute of Engineering and Technology, Chembarambakkam, Chennai 600103 | TIRUVALLUR | No | 14 | Highest non-autonomous offering breadth (14 programmes); Tiruvallur. |
| **1407** | G K M College of Engineering and Technology, Alappakkam-Mappedu Road, Chennai 600063 | CHENGALPATTU | No | 10 | Non-autonomous suburban Chengalpattu institution. |
| **1434** | Surya Group of Institutions, GST Road, Vikravandi Village, Villupuram District 605652 | VILUPPURAM | No | 10 | Rural/semi-urban non-autonomous college on southern highway corridor. |
| **1509** | Meenakshi College of Engineering, Vembuliamman Koil Street, K K Nagar (West), Chennai 600078 | CHENNAI | No | 11 | Urban non-autonomous affiliating engineering college. |
| **2721** | Tamilnadu College of Engineering, Karumathampatti Post, Coimbatore District 641659 | COIMBATORE | No | 9 | Pioneer non-autonomous engineering college in Coimbatore rural. |
| **3810** | MAM College of Engineering, Siruganur, Tiruchirappalli District 621105 | TIRUCHIRAPPALLI | No | 10 | Central Delta zone non-autonomous institution. |
| **3820** | Trichy Engineering College, Konalai, Tiruchirappalli District 621132 | TIRUCHIRAPPALLI | No | 10 | Semi-urban Tiruchirappalli non-autonomous campus. |
| **4978** | Udaya School of Engineering, Ammandivilai Post, Kanyakumari District 629204 | KANNIYAKUMARI | No | 12 | Deep south coastal non-autonomous engineering college. |
| **5907** | Mohamed Sathak Engineering College (Autonomous), Kilakarai, Ramanathapuram District 623806 | RAMANATHAPURAM | Yes | 14 | Regional autonomous institution in coastal/minority catchment area. |

---

## 5. Explicit Year-Scope Amendment (Amending T01)

### 5.1 Amendment Terms
1. **Retirement of Candidate Year 2024:** Candidate admission year 2024 is retired from primary scope due to age (two admission cycles prior to 2026) and limited predictive or comparative utility for 2026 aspirants.
2. **Adoption of Target Scope 2025 and 2026:**
   - **Year 2026 (Governed Current-Year Identity Reference):** Governed baseline derived from the official 2026 TNEA booklet and seat matrix. It establishes active college codes, programme codes, branch names, and delivery variants.  
     **Strict Invariant:** *No 2026 cutoff observations are presumed to exist.* 2026 data is exclusively non-metric identity and intake reference data.
   - **Year 2025 (Historical Allotment Evidence):** Most recent completed TNEA admission cycle. Used for historical non-applicant identity reconciliation (schedules, seat matrices) and, subject to separate D5/T04 authorization, provisional allotment evidence.
3. **Separation of Evidence Classes:**
   - *Official Institutional Identity Evidence* (DoTE portal directories, TNEA information booklets, AICTE approval notices) must remain strictly independent of *Historical Allotment Evidence* (allotment PDFs, cutoff portal entries, seat matrices).
   - An approved identity mapping across 2025 and 2026 does not constitute evidence of cutoff comparability or admission outcome.

---

## 6. Identity and Extraction Ceilings (Amending T01 & T03)

To permit comprehensive non-applicant identity auditing without expanding extraction risk, M5 adopts a two-level ceiling model:

### Level A: Extended Identity Audit Cohort Ceiling (T03 Amendment)
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

This proposal strictly adheres to the accepted D5 methodology (`docs/planning/m5_derived_methodology_spec_v1.md`, commit `74351fc`, blob `3b885d3`):
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

## 9. Privacy, Data Minimization & Retention Controls

1. **No Applicant Identifiers:** No student applicant name, application number, registration number, date of birth, community, individual aggregate mark, or individual rank may enter any repository file, manifest, research candidate, or documentation.
2. **Isolated Research Artifacts:** Any temporary artifacts from future authorized T03/T04 tasks must reside exclusively in isolated scratch directories outside repository tracking and must be purged according to the approved retention lifecycle.
3. **No External Model Transmission:** Raw applicant-level sources or extracted tabular rows shall never be transmitted to external commercial LLM APIs or third-party gateways.

---

## 10. Specific Owner Approvals Needed Before Execution

Before any execution begins, the owner must formally review and decide on:
1. **Cohort Scope Decision:** Confirm whether the candidate cohort shall be:
   - Option 1: Core 53 institutions (11 Govt, 3 AU Depts, 3 Govt Aided, 16 Constituent, 20 SFC).
   - Option 2: 54 institutions (Core 53 + Code 3 SAP Anna University).
   - Option 3: 55 institutions (Core 53 + Code 3 SAP + Code 5 Annamalai University).
2. **Self-Financing Institution Slate:** Approve the 20 proposed college codes and their Group A / Group B partition.
3. **Year Scope Amendment:** Formally approve amending the T01 candidate-year scope to 2025/2026.
4. **Ceiling Amendment:** Formally approve amending the T03 identity-audit ceiling to the revised cohort (up to 55 institutions) while capping initial extraction feasibility at 20 pairs.
5. **T03 Execution Authorization:** Explicitly authorize or withhold authorization for running the non-applicant identity audit.

---

## 11. Status Declarations & Guardrails

```text
T03_EXECUTION = NOT_AUTHORIZED
T04_EXECUTION = NOT_AUTHORIZED
APPLICANT_ROW_PROCESSING = NOT_AUTHORIZED
PRODUCTION_INGESTION = NOT_AUTHORIZED
APPLICATION_IMPLEMENTATION = NOT_AUTHORIZED
M5_STUDENT_RELEASE = NOT_AUTHORIZED
```

**Next Single Action:** Owner reviews revised T03 scope and decisions required.

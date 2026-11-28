# Milestone M7 — Wave 1 Feedback, Audit Reconciliation & 300-College Baseline Report

- **Document Version:** `1.0`
- **Date:** `2026-11-28`
- **Milestone:** `Milestone M7 — Student Validation Pilot`
- **Governance Status:** `M7_WAVE_1_FEEDBACK_AUDIT = COMPLETE`; `REAL_STUDENT_VALIDATION = IN_PROGRESS`
- **Authoritative Baseline Commit:** `19432d9ae93e1ddcc7aed2d0314291d2e283ae5a` on `main`
- **Staging Endpoint:** `https://tn-guidance-pilot.onrender.com/` (Render Free Web Service, Singapore, $0 cost, `X-Robots-Tag: noindex, nofollow`)
- **Privacy & Storage Boundaries:** `ONEDRIVE_PRIVACY_STATUS = OPEN`; all raw audio/recordings strictly excluded from Git and OneDrive; anonymized observation notes stored locally outside cloud sync (`C:\LocalPrivateStudy\M7-Notes\`).

---

## 1. Executive Summary

Milestone M7 evaluates the live Tamil Nadu Engineering Admissions (TNEA) student guidance application with real students, parents, and educators under the governing operational principle:
> **`NO NEW FEATURE UNTIL OBSERVATION FINDS A NEED`**

Between 2026-11-21 and 2026-11-28, Wave 1 formative validation was conducted across five diverse participant profiles:
1. **`M7-P01`**: First-time mobile student (Class 12 engineering aspirant).
2. **`M7-P02`**: Tech-savvy student (skeptical of standalone apps vs. YouTube & official TNEA).
3. **`M7-P03`**: Experienced TNEA user (participated in TNEA counselling last year; compared with MathonGo).
4. **`M7-P04`**: Pre-correction UI tester (evaluated journey wayfinding and choice planning ergonomics).
5. **`M7-T01`**: School Career Guidance Teacher (high-stakes admission counselor perspective).

In parallel, the project achieved a foundational data milestone: expanding the governed historical baseline from 121 institutions to **300 canonical institutions** (**2,628 governed offerings**, **50,246 approved observations** across 2025 and 2026), giving students statewide district-level representation.

This report formally records:
- The four qualitative student observations and the teacher review.
- The 14-item UX feedback audit (**F-01 through F-14**) with direct Git commit traceability for every implementation fix.
- The cryptographic and offering reconciliation for the 300-college cohort.
- The strategic pivot from an isolated direct-to-student app toward a **Volunteer & Counselor Co-Pilot**.

---

## 2. Qualitative Observations Record

### 2.1. Participant `M7-P01` — First-Time Mobile Student
- **Profile:** Class 12 student with basic smartphone proficiency, entering engineering admission research with zero prior TNEA knowledge.
- **Overall Impression:** Characterized the site as an *"engineering application guidance app"* they would recommend to peers.
- **Observed Difficulties:**
  - *Navigation Confusion:* Experienced cognitive overload from dense text screens; struggled to ascertain current position within the multi-step guidance journey.
  - *Reading Fatigue:* Compared text-heavy pages unfavorably to colorful visual portals like **Naan Mudhalvan** and YouTube; noted that continuous prose felt like schoolwork.
- **Participant Recommendation:** Show admission steps as a colorful, sequential flowchart; provide short explainer video summaries rather than multi-paragraph instructions.

### 2.2. Participant `M7-P02` — Tech-Savvy Skeptic
- **Profile:** Tech-savvy Class 12 aspirant with high digital literacy and familiarity with online portals.
- **Core Critiques:**
  - *Overlap with Official Portal:* Questioned the necessity of a standalone web app given that `tneaonline.org` already publishes college lists and official guidelines; viewed it as fine for a personal coding project but hard to justify as a mass-consumer utility.
  - *The YouTube Trust Monopoly:* Highlighted that from January through July, YouTube creators dominate parent and student mindshare with video walkthroughs, college tours, and cutoff talks. Anxious families naturally trust a speaking human face far more than navigating dropdown forms on a website alone.
  - *Fee Transparency Gap:* Pointed out that college fee structures fluctuate and are not transparently published upfront, suggesting that displaying previous-year (e.g. 2025) fee benchmarks would provide genuine utility.
- **Strategic Impact:** Prompted the project's strategic realization that the tool should serve as a **Counselor/Volunteer Co-Pilot** (the tool in the hands of a trusted advisor) rather than attempting to displace YouTube as a self-serve consumer portal.

### 2.3. Participant `M7-P03` — Experienced TNEA User (Repeater / Previous Year Applicant)
- **Profile:** Student who navigated the TNEA counselling portal during the 2024/2025 cycle; familiar with cutoff mechanics and commercial portals.
- **What Worked:** Praised the clean, structured, non-commercial UI; stated it was visually and structurally far superior to cluttered TNEA third-party websites used last year; found college codes and general guidance accurate.
- **Key Requests:**
  - *Cutoff-Based Sorting:* Frustrated that entering a high cutoff (e.g., `195+`) did not immediately surface premier institutions (CEG, MIT, PSG, Anna University departments) at the top; requested automated ranking similar to **MathonGo's** JEE college predictor.
  - *Year-Wise Cutoff Trends:* Requested direct, per-college historical trend visualization across consecutive years.
  - *Branch Summaries:* Wanted concise, inline overviews for core disciplines (CSE, ECE, Mech) directly on search results rather than external links.

### 2.4. Participant `M7-P04` — Pre-Correction UI Tester
- **Profile:** Evaluator testing earlier iterations of the Choice Order Planner and Journey flow on mobile viewports.
- **What Worked:** Valued the foundational orientation covering branch differences, syllabus expectations, and core eligibility.
- **Identified Pain Points:**
  - *Guidance Loop:* Felt navigation inside `/journey` could loop indefinitely without a definitive termination or bridge to action.
  - *Repetitive College Rows in Choice Planner:* Displaying the same institution as a separate card for every branch (e.g., CEG CSE, CEG ECE, CEG Mech) created exhausting vertical scrolling and made college-level comparison difficult.
- **Participant Recommendation:** Adopt a **College-First $\rightarrow$ Course-Second** hierarchy: show the institution header once, with individual branch offerings nested neatly inside.

### 2.5. Participant `M7-T01` — School Career Guidance Teacher
- **Profile:** Government & higher secondary school career guidance counselor with multi-year experience assisting rural and first-generation aspirants through TNEA single-window counselling.
- **Overall Assessment:** Validated the application as *"really wonderful and useful,"* particularly highlighting its unbiased nature and absence of paid advertisements.
- **Counselor Insights & Practical Warnings:**
  - *Look-Alike College Code Trap:* Strongly urged prominent warnings about confusingly named institutions with vastly different cutoffs and management:
    * *Loyola-ICAM College of Engineering & Technology (LICET, Code 1149)* vs. *Loyola Institute of Technology, Palanchur (Code 1138)*.
    * *Sri Venkateswara College of Engineering, Sriperumbudur (SVCE, Code 1219)* vs. *Sri Venkateswara College of Engineering & Technology, Thirupachur (Code 1122)*.
    * *Meenakshi Sundararajan Engineering College, Kodambakkam (Code 1110)* vs. *Meenakshi College of Engineering, Vembuliamman Koil (Code 1310)*.
    * *College of Engineering Guindy (CEG, Code 0001)* vs. *University College of Engineering (UCE) regional campuses*.
  - *0.5-Mark Sensitivity:* Highlighted that even a 0.5-mark difference in cutoff (e.g. 199.0 vs 199.5) shifts merit ranks by dozens of positions, triggering the statutory 6-tier TNEA tie-breaker rules.
  - *B.E. vs. B.Tech Clarification:* Emphasized that students constantly ask whether B.Tech is inferior to B.E., requesting official clarification that both carry equal AICTE/Anna University standing.
  - *Category-Wise Cutoffs:* Recommended 1-tap filtering for community quotas (`OC, BC, BCM, MBC, SC, SCA, ST`).
  - *Holistic College Ecosystem:* Advised reminding students to look beyond placement brochures at hackathon culture, startup/incubation cells, and NPTEL/SWAYAM support.

---

## 3. Feedback Action Matrix (F-01 through F-14) & Commit Traceability

Every qualitative finding was cataloged into actionable requirements (**F-01 to F-14**), triaged, implemented, and linked to exact Git commit SHAs on `main`:

| ID | Feedback Requirement | Status | Primary Commit(s) | Implementation Summary |
|---|---|:---:|---|---|
| **F-01** | **Mobile Wayfinding ("Where am I?")** | ✅ **Done** | [`d9cab69`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`1a67ac9`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added top `wayfinding-bar`, 4-tab sticky mobile bottom navigation (`site-bottom-nav`), and 5-step `renderJourneyStepper` with active state indicators across `src/ui/site-shell.ts` and `src/ui/m2-journey.ts`. |
| **F-02** | **Linear Anti-Loop Guidance Flow** | ✅ **Done** | [`419552d`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`f25a956`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Enforced forward linear progression; Step 5 (`prepare`) now concludes with the Official TNEA Eligibility Checklist and single-click handoffs to `/personal`, `/m5-guidance`, and `/colleges`; eliminated circular dead-ends. |
| **F-03** | **Cut Wall-of-Text & Add Visuals** | ✅ **Done** | [`cfd6b0d`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`74cb2a9`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`026685a`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`75b758c`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Implemented Two-Door Split Home UI with authentic Tamil student artwork, 5-step admission flowchart (`renderFlowchart`), inline SVG branch badges, progressive `<details>` expanders, and Warm Editorial styling. |
| **F-04** | **Short Process Video Explainer Slot** | ❌ **Parked** | [`e0035ab`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Intentionally kept off the landing page to preserve a calm, fast UI ($0$ external tracker scripts). A lightweight, opt-in link slot inside `/journey?step=basics` is reserved pending approved Tamil walkthrough video assets. |
| **F-05** | **Cutoff-Relevance Auto-Sorting** | ✅ **Done** | [`f4e41cd`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`1887660`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Post-search toolbar (`m5-toolbar-sort`) in `src/ui/m5-guidance-view.ts` provides **High to Low**, **Low to High**, **College Name (A–Z)**, and **College Code** sorting while preserving neutral mark-free browsing defaults and strict non-prediction disclaimers. |
| **F-06** | **Category-Wise Previous-Year Cutoffs** | ✅ **Done** | [`3a79556`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`a440aa5`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added 1-tap community selector pills (`OC, BC, BCM, MBC, SC, SCA, ST`) in `/m5-guidance`; missing category/round observations honestly render `—` fail-closed without inventing averages. |
| **F-07** | **Clickable Multi-Year Cutoff Trends** | ⚠️ **Partial** | [`19432d9`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Runtime holds verified 2025 and 2026 provisional allotment minimums across 300 colleges. The global year switcher works, but per-offering side-by-side comparison pills (`2026 vs 2025 (Δ)`) are queued for immediate implementation. |
| **F-08** | **Previous-Year Fee Benchmarks** | ❌ **Policy** | [`f25a956`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Official statutory fee slabs (Govt, Govt-Aided, Self-Financing ceilings) and the 100% 7.5% Govt School waiver (Tamil Nadu Act No. 14 of 2021) are cited; non-statutory private college fees remain held fail-closed to prevent unverified claims. |
| **F-09** | **College-First $\rightarrow$ Course-Second Picker** | ✅ **Done** | [`2939a49`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`6b6af87`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`1887660`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Restructured `/m5-guidance` results into `.college-group-card` blocks: institution name, 4-digit code, and district appear once at the top, with individual branch offerings nested in compact 2-line rows inside. |
| **F-10** | **Look-Alike Name & 4-Digit Code Safeguard** | ✅ **Done** | [`0f4c3a7`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added prominent `college-code-warning-card` highlighting high-risk traps (Loyola-ICAM vs Loyola IT, SVCE vs SVCE&T, Meenakshi Sundararajan vs Meenakshi Engg, CEG vs UCE); prominent 4-digit codes stamped on cards and print worksheets. |
| **F-11** | **0.5-Mark Cutoff Sensitivity Warning** | ✅ **Done** | [`0f4c3a7`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added `cutoff-sensitivity-card` in `src/ui/m2-journey.ts` and `/personal`, documenting cutoff precision and detailing the statutory 6-step TNEA tie-breaker sequence (Maths $\rightarrow$ Physics $\rightarrow$ Optional $\rightarrow$ DOB $\rightarrow$ Random Number). |
| **F-12** | **B.E. vs. B.Tech Comparison** | ✅ **Done** | [`419552d`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`0f4c3a7`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added bilingual `be-btech-guide` in `src/ui/m2-journey.ts` clarifying historical nomenclature (Anna University CEG vs. ACT) and confirming 100% statutory equivalence under AICTE. |
| **F-13** | **Brief Built-In Branch Overviews** | ✅ **Done** | [`0f77dba`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) <br> [`419552d`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added inline `branch-mini-grid` cards and concise educational summaries for major disciplines in `src/ui/m2-journey.ts` and `src/m4/branch-copy.ts`. |
| **F-14** | **Online Courses, Hackathons & Startups** | ✅ **Done** | [`f8a43a6`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance) | Added `college-inquiry-guide` checklist advising students to evaluate coding culture, incubation cells, NPTEL/SWAYAM credit transfers, and senior feedback. |

**Audit Score:** **11 / 14 Complete (78.6%)**, **1 Partial (F-07)**, **2 Policy/Deferred (F-04, F-08)**.

---

## 4. 300-College Baseline Reconciliation (Gate A-300)

During this milestone, the governed historical evidence was expanded to **300 institutions** across two approved manifests:
1. `docs/planning/m5_gate_a_300_approval_manifest_v1.md` (Commit [`1a7a9bc`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance))
2. `docs/planning/m5_gate_a_2025_300_approval_manifest_v1.md` (Commit [`19432d9`](file:///c:/Users/Ganesan%20S/OneDrive/文档/ChatGPT/AI%20assister%20career%20guidance))

### 4.1. Cohort Composition Breakdown
The 300 canonical institutions comprise:
- **55 Benchmark Institutions:** 11 Govt + 5 Univ Depts + 3 Govt Aided + 16 Constituent + 20 Autonomous SFCs.
- **66 Autonomous Additions:** High-demand accredited private institutions across Chennai, Kongu, Central, and Southern clusters.
- **79 Regional Additions:** Established NBA/NAAC-accredited regional institutions ensuring interior district representation.
- **100 Cutoff-Ranked Additions:** High-preference institutions completing state-wide single-window counselling coverage.
- **Total Canonical Cohort:** **300 Institutions** | **2,628 Governed Offerings**.

### 4.2. Statistical & Offering Coverage Accounting

| Dimension | 2024 Allotment Scope | 2025 Allotment Scope | 2026 Allotment Scope | Cross-Year Combined |
| :--- | :---: | :---: | :---: | :---: |
| **Institutions with Observed Evidence** | `296 / 300` *(Colleges 1111, 2777, 3477, 5546 have zero 2024 allotments)* | `298 / 300` *(Colleges 1111 & 5924 have zero 2025 allotments)* | `300 / 300` | **`300 / 300` ($100\%$)** |
| **Governed Offerings Covered** | `2,420 / 2,628` ($92.1\%$) | `2,526 / 2,628` ($96.1\%$) | `2,627 / 2,628` ($99.96\%$) | **`2,628 / 2,628` ($100\%$)** |
| **Approved Runtime Observations** | `21,684` | `24,609` | `25,637` | **`71,930`** |
| **Held Ungoverned Observations** | `676` *(across 105 unmapped pairs)* | `420` *(across 66 unmapped pairs)* | `202` *(across 28 unmapped pairs)* | **`1,298`** *(held fail-closed)* |
| **Duplicate Key Conflicts** | `0` | `0` | `0` | **`0`** |

### 4.3. Cryptographic Verification Ledgers (SHA-256)
Every candidate artifact is validated at server startup via SHA-256 digest checks with cross-platform CRLF $\rightarrow$ LF normalization:
- `run-2024-cohort-300-additions/candidates.json`: verified via manifest in `docs/planning/m5_gate_a_2024_300_approval_manifest_v1.md`
- `run-2025-cohort-55/candidates.json`: `1c6659838e848eaaf636a7c4ca70d895243ac9f32d6fe16eff94a092a2bb74c7`
- `run-2025-cohort-300-additions/candidates.json`: `c079423a4fb4c5513ac66f6b602db680ac8566062b3e0cf78d19a5c7bab63559`
- `run-2026-cohort-55/candidates.json`: `7e328a4644085c48372ff93739248d3c729189f49ed14e48812df72033467e84`
- `run-2026-cohort-65-additions/candidates.json`: `a1bc06bcf0cdf50e3b68ee827fa7d668763704419007d8562eed03761b61cced`
- `run-2026-cohort-79-additions/candidates.json`: `7ec6e477f164da2eb8a9ca250e26ca4e16d44ea8a09fbe76cf0a8662ce257fc6`
- `run-2026-cohort-100-additions/candidates.json`: `a1e7565265c2da8bd7facc436ad62a9a536b4903deb4295c5de019f61a685dac`

---

## 5. Invariant & Governance Compliance

1. **Student Privacy Invariant (`PASS`):**
   - Cutoff inputs on `/personal` and `/m5-guidance` operate strictly via memory POST.
   - Zero student marks, community categories, or quota parameters leak into GET URLs, browser history, or server access logs.
   - Zero tracking cookies, third-party analytics, or auto-loading external iframe embeds.
2. **Deterministic Data Honesty (`PASS`):**
   - Reported values are strictly identified as **lowest observed provisional allotment marks** (`DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK`) rather than official closing cutoffs.
   - Missing observations honestly display `—` rather than interpolated or guessed numbers.
   - Held institution (College `1516`) and held unmapped variants remain excluded fail-closed.
3. **Non-Predictive Statutory Compliance (`PASS`):**
   - Zero "Safe / Target / Dream" classifications; zero percentage chances of admission.
   - Delta is purely arithmetic: $\Delta = \text{Cutoff} - \text{Derived Minimum}$.
   - Full statutory citations preserved: Tamil Nadu Act No. 14 of 2021 (7.5% Govt School Quota) and G.O. (Ms.) No. 221.
4. **Mock Mentor Safety Foundation (`PASS`):**
   - Local/mock-only explanation foundation integrated under `src/mentor/` and `POST /api/mentor/explain` at commit `ab65092`.
   - Gated off by default (`MENTOR_QA_ENABLED=0`, `MENTOR_QA_PROVIDER=mock`). Zero outbound AI network requests (`GEMINI = PAUSED`, `CON_IMPLEMENTATION_AUTHORIZED = NO`).
   - Deterministic policy engine intercepts and rejects all admission prediction, rank guessing, and college suitability scores in both English and colloquial Tamil/Tanglish before reaching any provider.

---

## 6. Strategic Takeaways & Next Steps

### 6.1. Strategic Product Framing Shift
Wave 1 feedback established that attempting to market a direct-to-student web application to compete with YouTube influencers for teenage attention is structurally mismatched with rural admissions behavior. Instead, the product's highest-leverage role is as a **"Volunteer & Counselor Co-Pilot"**:
- The human teacher, elder sibling, or NGO volunteer provides the voice, empathy, and reassurance.
- The web app provides the unmanipulated, instant mathematical truth, look-alike code protection, and printable choice worksheet.

### 6.2. Immediate Action Pipeline
1. **Ship F-07 (Inline 2-Year Cutoff Comparison):** Expose `2026 vs 2025 (Δ)` side-by-side pills on `/m5-guidance` branch cards to elevate audit score to 12/14.
2. **Re-orient Milestone M8:** Redefine M8 from an open-ended conversational chatbot into a **"Smart Choice Order Auditor"** that inspects a student's finalized 30-choice list for sequential cutoff inversions, look-alike code traps, and tier-safety balance prior to official TNEA submission.

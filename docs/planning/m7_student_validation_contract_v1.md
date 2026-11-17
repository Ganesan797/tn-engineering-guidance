# Milestone M7 — Student Validation Contract (V1)

- **Document Status:** `READY_FOR_OWNER_ACCEPTANCE`
- **Version:** `V1.1` (Post-Independent-Review Corrections Applied)
- **Date:** `2026-11-18`
- **Authoritative Product Baseline:** `MAIN_SHA = 44d7ee78e47cc2887127dd2cfd55c4b63fa153ab` (synchronized `main` and `origin/main`)
- **Current Control State (Preserved Unchanged):**
  - `M6_OWNER_ACCEPTANCE = ACCEPTED`
  - `M7_AUTHORIZATION = NOT_AUTHORIZED`
  - `REAL_STUDENT_VALIDATION = NOT_RUN`
  - `PUBLICATION = NOT_AUTHORIZED`
  - `ONEDRIVE_PRIVACY_STATUS = OPEN`
  - `LIVE_LLM_GATE = PARTIAL` (`GEMINI = PAUSED`)

> **Governance Notice:** This contract is `READY_FOR_OWNER_ACCEPTANCE` as a planning/validation specification only. Approving or accepting this contract is a separate decision from authorizing Milestone M7 execution (`M7_AUTHORIZATION = NOT_AUTHORIZED`). Participant execution requires a later explicit owner authorization. Neither this contract nor its acceptance authorizes implementation changes, hosting expenditure, or public launch, and `REAL_STUDENT_VALIDATION = NOT_RUN` must remain unchanged until real student observations actually occur.

---

## 1. M7 Purpose

Milestone M7 exists to answer the single most important remaining product question from the frozen [Golden Product Mission](../product/product_mission.md):

> **“Can a real student, especially one starting with little or no engineering-admission knowledge, understand and use the current guidance correctly and confidently?”**

### Governing Operational Principle

`NO NEW FEATURE UNTIL OBSERVATION FINDS A NEED`

M7 observes the accepted M6 Product V1 baseline (`44d7ee78e47cc2887127dd2cfd55c4b63fa153ab`) as it exists today. Do not assume additional engineering, UI redesigns, or new capabilities are needed until real-student observation exposes a concrete comprehension, language, trust, or usability gap.

### Mission Anchors Under Validation

M7 validates whether the live experience upholds the product's core identity in practice:
- **Tamil-first and booklet-first:** Guidance must feel clear and native in Tamil, prioritizing awareness and understanding over forms or college lists.
- **Zero-knowledge entry:** A student starting with no knowledge of TNEA, cutoffs, branches, or college categories must still gain immediate value.
- **Priority order preserved:** Awareness → Understanding → Appropriate Personalization → Helping the Student Think Further → Decision Support.
- **Trusted engine & student agency:** Deterministic/governed admission facts remain authoritative; unknown remains unknown; the student remains explicitly in control of final preferences and choices.
- **Anti-goals enforced:** The product must never be experienced as an admission predictor, college ranking engine, choice optimizer, automatic selector, or admission-guarantee system.

### Evidence Discipline

This contract enforces a strict boundary between two forms of evidence:
- **`ENGINEERING_VERIFIED`:** Automated unit/integration tests (372/372 PASS), strict TypeScript checks, headless Chrome responsive/print audits, and code reviews. These confirm technical stability only.
- **`STUDENT_OBSERVED`:** Direct, documented observation of real students and parents attempting realistic tasks and explaining outcomes in their own words.

Automated tests, headless Chrome checks, and internal owner walkthroughs never count as `STUDENT_OBSERVED` evidence. Conversely, participant confusion never overrides deterministic admission truth or statutory rules.

---

## 2. Scope

M7 evaluates the accepted Product V1 baseline across **10 mandatory validation dimensions**, covering both Tamil (`lang=ta`, default) and English (`lang=en`) experiences, including the deferred mandatory T04 real-student observation obligation integrated across the complete M1–M6 product flow:

1. **Zero-Knowledge Accessibility:** Can a student who only knows *"I want to study engineering"* find a clear, non-intimidating starting point and discover what engineering is, what TNEA is, and what to learn next without being forced into marks or college selection prematurely?
2. **Tamil-First Usability:** Evaluated independently as a primary language experience—assessing natural readability, genuine comprehension, unfamiliar terminology, accidental English dependence, and whether Tamil guidance genuinely explains concepts rather than mechanically translating English.
3. **TNEA Understanding:** Can the student explain in their own words what TNEA is, whether it requires an entrance exam, roughly how the admission pathway works, the role of cutoff, and the role of counselling and choice filling (without requiring rote memorization of rules)?
4. **Branch Understanding:** Can the student understand major engineering disciplines (e.g., CSE, IT, ECE, EEE, Mechanical, Civil, and newer computing branches such as AI / Data Science) at a beginner level—what is studied, broad career directions, key differences, and how to look beyond popularity or placement assumptions?
5. **College Understanding:** Does the current guidance help students make practical sense of institutional types (Government, Government-Aided, Private/Self-Financing, Autonomous, Affiliated) without turning the experience into a factual quiz?
6. **College vs. Branch vs. Location Reasoning:** Does the product help students think through real-world trade-offs—preferred branch vs. preferred college, nearby vs. farther college, fees, hostel/distance, family constraints, placement expectations, and personal interests—while leaving the judgment to the student?
7. **Cutoff and Historical Evidence Understanding:** Do students clearly grasp that cutoff is not an admission guarantee, historical 2025 cutoff is past evidence rather than a prediction, outcomes vary year to year, and missing evidence remains unavailable? Specifically observe for false confidence or overconfidence induced by UI layout or arithmetic deltas ($\Delta$).
8. **Personalized Guidance:** When a student enters marks/cutoff or preferences, does the transition from general guidance to personalized comparison make sense? Do they understand what the system knows vs. does not know, recognize that results are non-guaranteed, and feel their agency remains intact?
9. **Counselling & Choice-Building Understanding:** Beyond whether buttons technically work, do students understand why preference order matters in single-window counselling, that they control the order manually, how shortlist reordering and print/export support official TNEA choice entry, and what to do next (including upward movement)?
10. **Trust and Uncertainty:** Can the student distinguish between official/governed facts, historical allotment observations, general educational explanations, personalized calculations, and unknown/unavailable information? Identify any phrasing that creates false certainty.

---

## 3. Exclusions

The following are strictly **out of scope** for Milestone M7:
- **No implementation changes during contract or observation:** No new features, journey redesigns, UI refactors, or deterministic rule modifications unless a separate, owner-authorized defect fix is triggered after observation.
- **No public release or open hosting:** Public deployment, public search indexing, and open URL distribution remain prohibited (`PUBLICATION = NOT_AUTHORIZED`).
- **No AI / LLM / RAG execution:** Live LLM experiments and Gemini remain `PAUSED`; M7 validates the deterministic/governed V1 product.
- **No statistically powered study:** M7 is a focused qualitative usability and comprehension pilot (5–8 participants), not a survey or quantitative experiment.
- **No personal data retention in Git:** Real student names, phone numbers, real HSC mark sheets, community certificates, identifiable quotes, or raw audio/video recordings must never be committed to the repository.
- **No Student Question Corpus authoring:** Corpus development proceeds separately and is not created or modified under this contract.
- **No compromise of admission truth:** Participant preferences or confusion cannot introduce rankings, predictions, "Safe/Target/Dream" labels, or auto-ordering.

---

## 4. Participant Profile Strategy

M7 uses a small, focused qualitative pilot of **5–8 participants** (or equivalent profile sessions). Recruitment should aim for practical diversity across Tamil Nadu engineering-admission contexts without blocking the pilot if every sub-category is not simultaneously available.

### Target Representative Profiles

| Profile Code | Target Background | Primary Validation Focus | Recruitment Priority |
| --- | --- | --- | --- |
| **P1** | Tamil-first / Tamil-dominant, first-generation aspirant with little or no admissions knowledge | Zero-knowledge entry, Tamil readability, TNEA basics, branch awareness | **Required** |
| **P2** | Tamil-first student with little admissions knowledge, exploring branches/colleges on a mobile phone | Mobile Tamil ergonomics, branch differences (CSE/IT/AI/ECE/Core), college types | **Required** |
| **P3** | Government-school background student (Tamil-first), if feasible | Tamil clarity, 7.5% quota counselling guidance understanding, fees/hostel trade-off reasoning | **Strongly Preferred (if feasible)** |
| **P4** | Informed student who already knows cutoff/TNEA basics | Direct cutoff entry, POST transition to historical comparison, evidence vs. prediction, manual choice ordering | **Required** |
| **P5** | English-comfortable student navigating college vs. branch trade-offs | English journey parity, college-vs-branch reasoning, district search, print/export worksheet | **Required** |
| **P6** | Parent + student pair (or parent/guardian helper) | Real-world family decision context (distance, fees, hostel), printed worksheet comprehension, trust in disclaimers | **Strongly Preferred** |
| **P7–P8** *(Optional)* | Additional Tamil-first regional-district student or partial-knowledge student | District exploration without knowing college names, missing-history/held-college uncertainty handling | **Optional Buffer** |

### Recruitment & Representation Rules
- **Descriptive counts only:** Participant counts are descriptive only and are not statistically representative.
- **Staged execution permitted:** Sessions may run in two small waves (e.g., Wave 1: 2–3 exploratory Tamil-first sessions fulfilling the initial T04 obligation; Wave 2: remaining 3–5 sessions across broader profiles) so severe blockers can be caught early.
- **No synthetic/internal substitution:** Do not invent participant personas or count the Project Owner, engineer, or reviewer as a zero-knowledge student.
- **Real mobile devices preferred:** Multiple sessions should be observed on participants' own or representative mobile screens (360px–390px class) rather than desktop monitors alone.

---

## 5. Scenarios

M7 defines **8 realistic task scenarios (Scenarios A–H)** framed as natural student intentions rather than scripted software test cases. Facilitators must **never script exact clicks or routes**; participants choose where to start and how to navigate.

| ID | Natural Student Intention Prompt | Primary Language | Dimensions Covered | What Facilitator Observes |
| --- | --- | --- | --- | --- |
| **A — Zero Knowledge** | *“I finished / am finishing 12th. I am thinking about engineering, but I don't know where to start.”* | **Tamil-first** (`ta`) | 1, 2, 10 | Does the student find an approachable starting point? Do they realize marks/college lists are not required immediately? Can they state one useful next step? |
| **B — TNEA Basics** | *“What is TNEA? Do I need to write an entrance exam? How do engineering admissions work in Tamil Nadu?”* | **Tamil-first** (`ta`) | 2, 3, 10 | Can the student explain TNEA in their own words (single-window, no entrance exam for standard academic route, role of cutoff and counselling)? |
| **C — Branch Choice** | *“Everyone talks about CSE, ECE, IT, and AI/Data Science. I don't understand the difference—or what branches like Mechanical, EEE, or Civil involve.”* | **Tamil-first** (`ta`) & English | 2, 4 | Can the student describe at least one meaningful difference between branches beyond hype/placement rumors and explore further? |
| **D — College Types & Trade-Offs** | *“I can choose a branch I like in one college or a more popular college with another branch, and I keep hearing Government, Aided, Private, Autonomous, and Affiliated. How should I think about fees, distance, and hostel?”* | **Tamil-first** (`ta`) | 5, 6, 10 | Does the student make sense of institution types and recognize practical trade-offs as things worth checking rather than expecting the site to pick a "best" option? |
| **E — Cutoff & Historical Evidence** | *“I have my 12th Maths, Physics, and Chemistry marks (using a synthetic example or private marks). What is my cutoff, and what do the past 2025 numbers mean for me?”* | **Tamil-first** (`ta`) & English | 7, 8, 10 | Does the transition from calculator to historical comparison make sense? Does the student clearly distinguish cutoff from rank and past evidence from an admission guarantee? |
| **F — District / College Exploration** | *“I want to find engineering colleges near my district/region (e.g., Coimbatore, Madurai, Chennai, Trichy), but I don't know college names or TNEA codes.”* | **Tamil-first** (`ta`) | 2, 5, 6 | Can the student discover relevant colleges by district/location or familiar acronyms without needing prior TNEA code knowledge? |
| **G — Choice Filling & Preference Order** | *“I have shortlisted 3–5 college and branch combinations. How should I order them, and how do I prepare my list for official TNEA counselling?”* | **Tamil-first** (`ta`) & English | 2, 8, 9 | Does the student understand manual Up/Down control, why Choice #1 matters (upward movement), and how to print/export their worksheet for `tneaonline.org`? |
| **H — Uncertainty & Missing Evidence** | *“One college or branch I'm interested in shows missing historical data or a review hold (e.g., an offering without 2025 data or College 1516). What does that mean?”* | **Tamil-first** (`ta`) & English | 7, 10 | Does the student recognize that missing/held data means *"not verified/unavailable"* rather than *"seat impossible"* or *"guaranteed"*? |

- **Scenario Allocation per Participant:** Each 20–35 minute session typically runs **3–5 scenarios** matched to the participant's natural profile (e.g., zero-knowledge participants start with A → B → C → D; informed participants focus on E → F → G → H) to avoid fatigue while ensuring every scenario A–H is observed across multiple participants.
- **Tamil-First Requirement:** Scenarios A, B, D, and F must be observed primarily in Tamil (`lang=ta`); Scenarios C, E, G, and H must include Tamil-first observations alongside English observations.

---

## 6. Observation Protocol

### Pre-Session Setup & Participant Protection
1. **Authorized Private Access Only:** Run sessions only against the exact authorized commit (`MAIN_SHA`) via an owner-approved private local/tethered setup or separately authorized time-boxed private staging endpoint (zero public indexing, zero unnecessary request logging).
2. **Voluntary Informed Consent & Minor Protection (Under-18 Rule):**
   - Explain in plain Tamil (or English) that the session tests the *website*, not the student, that there are no right or wrong answers, and that participation is strictly voluntary.
   - **If a participant is under 18:**
     - **Guardian/parent consent is required** prior to participation.
     - **Student assent** must also be obtained directly from the student in plain language they understand.
     - **Participation is strictly voluntary**, with no academic, counselling, or social obligation.
     - **Right to stop:** The participant (or guardian) may pause or stop at any time without giving a reason.
   - Do not collect unnecessary personal information.
3. **Marks Privacy Rule:** Never ask participants to share real certificates, names, or contact details. For Scenario E, provide clearly labeled synthetic example marks (e.g., Maths 95, Physics 90, Chemistry 91) unless the participant prefers entering their own marks privately without the facilitator recording them.

### Observation-Data Handling & Retention Policy
- **Zero Git / Repository / OneDrive Workspace Storage:** Raw observation notes, recordings, screenshots, or any identifiable participant information must **never** be committed to Git and must **not** be stored anywhere inside the project repository or OneDrive-synced workspace.
- **Mandatory Handling Controls:**
  1. **Minimal collection:** Collect only the minimum task-level observations needed to evaluate comprehension, language, navigation, and trust.
  2. **Anonymized participant IDs:** Identify sessions solely by random anonymized IDs (e.g., `M7-P01`); never attach names, phone numbers, schools, addresses, or real mark sheets.
  3. **Restricted access:** Restrict raw working notes and any permitted recordings to authorized facilitator/owner private storage outside the repository and OneDrive workspace.
  4. **Short retention:** Keep raw session materials only for the short period required to synthesize findings and complete owner review.
  5. **Deletion after review:** Delete raw notes, recordings, and screenshots promptly after owner review unless a fully anonymized finding is deliberately retained for product decisions.
  6. **Explicit consent for recordings:** Recordings (audio, video, or screen capture) are optional and strictly prohibited without separate explicit prior consent (plus guardian consent and student assent for participants under 18).
- **Repository Artifact Rule:** Repository artifacts may contain **only** anonymized findings needed for product decisions.

### Facilitating Observation (Behavior Over Opinion)
- **Avoid leading praise questions:** Do not rely on *"Do you like this page?"* or *"Was this helpful?"*. Prioritize observable behavior and own-words teach-back.
- **Think-Aloud Prompt:**
  - *Tamil:* “நீங்கள் என்ன நினைக்கிறீர்கள், எதைத் தேடுகிறீர்கள் என்பதை சத்தமாகச் சொல்லிக்கொண்டே பயன்படுத்துங்கள். இதில் சரி, தவறு என்று எதுவும் இல்லை—இணையதளத்தில் எது புரிகிறது, எது குழப்புகிறது என்பதைப் பார்ப்பதே நோக்கம்.”
  - *English:* “Please think aloud as you explore—tell me what you expect to find and what seems clear or confusing. We are testing the website, not you.”
- **Strict Non-Coaching Rule:** Do not explain TNEA terminology, do not suggest which tab to open, and do not rescue the participant on minor hesitation. Intervene **only** if a participant is completely blocked or visibly frustrated; mark the exact point of intervention so all subsequent behavior on that scenario is classified as `ASSISTED`.

### Mandatory Per-Scenario Capture Points
For every attempted scenario, the observer must record:
1. Where the participant started and which language they used.
2. Sequence of screens visited, links clicked, and sections read or skipped.
3. Exact points of hesitation (screen, UI phrase, approximate pause duration).
4. Any misunderstandings or unexpected navigation detours.
5. Exact questions the participant asked aloud.
6. **Teach-back check:** Participant's own-words explanation of what they learned or what the result means.
7. **Next-action check:** What the participant says they would do next, and why.
8. **False-confidence check:** Any indication that the participant interprets historical data, cutoffs, or lists as a guarantee, prediction, or system recommendation.
9. Whether facilitator intervention was required, or whether the participant abandoned the task.

### Post-Scenario Teach-Back Prompts (Tamil & English)
- *“இப்போது உங்களுக்குப் புரிந்ததை உங்கள் சொந்த வார்த்தைகளில் சொல்ல முடியுமா?”* / “Can you explain what you understood in your own words?”
- *“இந்த 2025 கட்-ஆஃப் எண்ணைப் பார்த்த பிறகு, இந்தக் கல்லூரியில் இடம் கிடைக்கும் என்று உறுதி சொல்லலாமா? ஏன்?”* / “Seeing this 2025 cutoff number, does it guarantee a seat? Why or why not?”
- *“அடுத்து நீங்கள் என்ன செய்வீர்கள்? எந்த சொல் அல்லது பகுதி தெளிவாக இல்லை?”* / “What would you do next? Which word or section felt unclear?”

---

## 7. Evidence-Capture Format

Record working session notes only in restricted private storage **outside Git and outside the project repository / OneDrive workspace**. Raw observation notes, recordings, screenshots, or identifiable participant information must **never** be committed to Git. Repository artifacts may contain **only** anonymized findings needed for product decisions. Empty fields mean `NOT_EVALUATED`—never `PASS`.

```markdown
### Anonymous Session Record — [M7-P0X]

- **Session Code (Random, Non-Identifying):** M7-P0X
- **Date & Duration:** YYYY-MM-DD / XX mins
- **Exact Baseline SHA Observed:** <40-char SHA>
- **Access Method & Device Class:** e.g., Android mobile ~360px / Desktop 1280px (private access)
- **Participant Profile Code:** e.g., P1 (Tamil-first, zero-knowledge, first-generation)
- **Language Used:** Tamil (`ta`) / English (`en`) / Switched

#### Scenario [A–H] Observation
- **Starting Route / Entry Point:**
- **Navigation Path (Screens Visited):**
- **Hesitations (Screen + Exact UI Phrase + Pause):**
- **Questions Asked Aloud (Paraphrased, Anonymous):**
- **Teach-Back Explanation (Own Words, Paraphrased):**
- **Stated Next Action:**
- **False-Confidence / Prediction Signal Observed?:** YES / NO (details if YES)
- **Facilitator Intervention Required?:** NO (Unassisted) / YES (at step: ___)
- **Task Abandoned?:** YES / NO
- **Outcome Category:** UNDERSTOOD | UNDERSTOOD_WITH_MINOR_CONFUSION | SIGNIFICANT_CONFUSION | MISUNDERSTOOD | COULD_NOT_COMPLETE
- **Primary Cause(s):** CONTENT | LANGUAGE | NAVIGATION | INFORMATION_ARCHITECTURE | TRUST / UNCERTAINTY | MISSING_CAPABILITY | DATA_GAP | TECHNICAL_DEFECT
- **Severity (if finding):** Critical | High | Medium | Low | None
- **Evidence Notes / Exact Phrase Causing Friction:**
```

---

## 8. Comprehension & Trust Criteria

### Outcome Categories

| Outcome | Operational Definition |
| --- | --- |
| `UNDERSTOOD` | Participant completed the scenario unassisted, accurately explained the core concept/result in their own words, and stated a sensible next action without false confidence. |
| `UNDERSTOOD_WITH_MINOR_CONFUSION` | Participant reached accurate final understanding unassisted, but hesitated on wording, layout, or navigation before resolving it themselves. |
| `SIGNIFICANT_CONFUSION` | Participant struggled substantially, required facilitator assistance, or left with partial/unclear understanding of key concepts or next steps. |
| `MISUNDERSTOOD` | Participant left with a materially incorrect mental model (e.g., believing TNEA requires an entrance exam, believing cutoff = rank, or believing 2025 cutoff guarantees 2026 allotment). |
| `COULD_NOT_COMPLETE` | Participant abandoned the task or could not reach the relevant guidance even after reasonable effort. |

### Root-Cause Classification

Every non-`UNDERSTOOD` observation must be tagged with one or more root causes rather than immediately proposing a new feature:
- `CONTENT` — Explanation missing, too dense, or unclear.
- `LANGUAGE` — Unnatural Tamil, confusing jargon, or unintended English dependence.
- `NAVIGATION` — Link, tab, button, or return path hard to discover or follow.
- `INFORMATION_ARCHITECTURE` — Right information exists, but hierarchy, grouping, or sequencing misleads the student.
- `TRUST / UNCERTAINTY` — Disclaimer missed or wording creates false certainty/prediction impression.
- `MISSING_CAPABILITY` — Genuine student need not supported by the current product.
- `DATA_GAP` — Missing, held, or out-of-cohort college/branch/metadata facts affecting the task.
- `TECHNICAL_DEFECT` — Broken layout, rendering glitch, or server/form failure.

### Dimension-Level Comprehension & Trust Signals

| Dimension | Positive Comprehension Signal | Red-Flag Signal (Trust / Understanding Failure) |
| --- | --- | --- |
| 1. Zero-Knowledge | Enters awareness/journey comfortably without feeling pressured for marks | Abandons or assumes they cannot use the site without knowing cutoff/codes |
| 2. Tamil-First | Reads Tamil naturally; grasps meaning without switching to English | Switches to English to decode awkward Tamil or stumbles on untranslated prose |
| 3. TNEA Basics | Explains TNEA as marks-based Tamil Nadu counselling (not an entrance exam) | Thinks TNEA is an entrance test or confuses site with `tneaonline.org` |
| 4. Branches | Identifies real study/work differences across at least 2–3 branches | Treats CSE/AI as automatically "best" with no awareness of differences |
| 5. College Types | Explains practical distinction (e.g., govt vs. private/autonomous) | Confused by acronyms/labels with no clue what they imply |
| 6. Trade-Offs | Mentions balancing branch, college, fees, hostel, or distance | Expects the website to pick the "number one" option for them |
| 7. Cutoff & History | States cutoff $\ne$ rank and 2025 numbers are past reference, not guarantees | Says *"my score is +2 above 2025, so I will definitely get this seat"* |
| 8. Personalization | Understands how calculator feeds comparison and what stays unknown | Thinks marks are saved on a server or assumes eligibility is officially verified |
| 9. Choice Building | Reorders choices by personal priority and explains upward movement | Orders strictly by 2025 cutoff out of fear, or thinks site submits choices to DoTE |
| 10. Trust & Uncertainty | Recognizes unavailable/held rows as *"data not verified/available"* | Misreads missing data as *"college closed"* or *"zero cutoff"* |

---

## 9. Severity Model

| Severity | Definition | Representative Examples |
| --- | --- | --- |
| **Critical** | Could lead a student to a materially wrong admission decision, false confidence, or privacy/truth violation. | Student believes 2025 historical cutoff guarantees 2026 admission; student misunderstands eligibility or confuses cutoff with official rank; system appears to choose/rank choices automatically; `UNKNOWN` or held data appears as verified/known; sensitive marks leak into URL/logs/exports. |
| **High** | Blocks a core student journey or induces major misunderstanding of essential guidance. | Zero-knowledge student cannot locate a viable starting path; Tamil-first student cannot comprehend core guidance due to language issues; student cannot figure out how to build or reorder a shortlist; district/college lookup fails completely for common user terms. |
| **Medium** | Student succeeds and ends with accurate core understanding, but experiences material friction or temporary confusion. | Student hesitates over a button label or tab switch before recovering; student misses the Next Step card initially; print/export controls take multiple tries to spot. |
| **Low** | Minor wording, spacing, or usability polish that does not impair understanding, trust, or completion. | Slight phrasing awkwardness in Tamil or English that the student still understands accurately; minor visual density feedback. |

---

## 10. PASS / HOLD Criteria

M7 is a small qualitative formative pilot, not a statistical survey. **Participant counts are descriptive only and are not statistically representative.** PASS/HOLD decisions are based on qualitative comprehension, language, agency, and trust observations rather than numerical pass rates or percentages.

### Mandatory HOLD Criteria (M7 Cannot Pass If Any Apply)
M7 must result in **`M7_VALIDATION_OUTCOME = HOLD`** if any of the following occur:
1. **Critical truth-in-guidance failure:** Any unresolved **Critical** misunderstanding (e.g., interpreting historical cutoff as an admission guarantee, confusing cutoff with official eligibility or merit rank, or reading unknown/held data as known) is observed as a repeated pattern or traced directly to misleading UI wording or presentation.
2. **Tamil-first comprehension failure:** Tamil-first participants fail to understand core intended guidance due to unnatural Tamil readability, missing explanations, or accidental English dependence.
3. **Zero-knowledge entry failure:** Zero-knowledge participants cannot locate a viable, marks-free starting path without material observer assistance.
4. **Repeated false-confidence pattern:** Participants repeatedly interpret 2025 historical allotment numbers or arithmetic deltas ($\Delta$) as predictions or guarantees of future admission.
5. **Loss of student agency:** Participants perceive college comparisons or choice ordering as system-decided rankings rather than student-controlled tools.
6. **Unresolved blocking High failure:** A **High** severity defect blocks core task completion or induces major misunderstanding without a verified fix or explicit owner disposition.
7. **Privacy or observation-data breach:** Any exposure of real student marks, PII, raw notes, screenshots, or recordings in URLs, exports, server logs, Git, or the repository/OneDrive workspace.

### PASS Criteria (`M7_VALIDATION_OUTCOME = PASS`)
M7 may be recommended for owner **PASS** when all of the following qualitative formative-pilot criteria hold:
1. Representative pilot sessions (including Tamil-first and zero-knowledge journeys) have been observed against a single recorded baseline SHA, with anonymized findings synthesized for owner review (`Participant counts are descriptive only and are not statistically representative.`).
2. **Zero-knowledge journeys are understandable without material observer assistance.**
3. **Tamil-first participants understand the intended guidance** natively without English fallback.
4. **No unresolved Critical truth-in-guidance failures.**
5. **No unresolved blocking High failures** across the 10 validation dimensions.
6. **No repeated false-confidence pattern** (participants recognize cutoff as distinct from official rank/guarantee and recognize unknown/unavailable data as unavailable).
7. **Student agency remains clear** (participants understand that preference ordering and trade-off decisions remain under their own control).
8. **Medium** and **Low** findings are triaged into a transparent follow-up backlog without requiring perfection before sign-off.

### Explicit Boundary on What M7 PASS Means
Passing M7 validates that the bounded V1 product is understandable and safe for real students in pilot conditions. It does **not** automatically authorize public production launch (`PUBLICATION`), hosting spend, or conversational AI/LLM features (`CON`), each of which remains a separate owner decision.

---

## 11. Issue-to-Follow-Up Workflow

Every finding from M7 sessions follows a disciplined triage path enforcing **`NO NEW FEATURE UNTIL OBSERVATION FINDS A NEED`**:

1. **Log & Anonymize:** Record the observation in the anonymous session template tied to the exact baseline SHA and screen.
2. **Classify:** Assign Outcome (`UNDERSTOOD`..`COULD_NOT_COMPLETE`), Root Cause (`CONTENT`..`TECHNICAL_DEFECT`), and Severity (`Critical`..`Low`).
3. **Authority Check:**
   - Never alter deterministic admission rules, cutoff formulas, or statutory constraints to accommodate a misconception.
   - If a student misunderstands an official rule, treat the fix as a `CONTENT`, `LANGUAGE`, or `INFORMATION_ARCHITECTURE` clarity improvement.
4. **Assign Disposition:**
   - **`FIX_BEFORE_M7_PASS`:** Critical defects and High journey blockers (requires bounded owner-authorized correction + targeted re-observation).
   - **`BACKLOG_POLISH`:** Medium/Low wording, Tamil nuance, or navigation refinements accepted for post-M7 follow-up.
   - **`CORPUS_OR_DATA_FEEDBACK`:** Genuine recurring student questions routed to the Student Question Corpus or future governed data batches (e.g., requested regional colleges).
   - **`DECLINED_MISSION_BOUNDARY`:** Requests for seat predictions, rankings, "Safe/Dream" tags, or automatic choice optimization—explicitly declined to protect the Golden Product Mission.
5. **Owner Authorization Gate:** No code, content, or hosting change is implemented until the Project Owner reviews the aggregated M7 findings report and explicitly authorizes the bounded follow-up scope.

---

## 12. Relationship to Student Question Corpus

- **Dependency Status:** `STUDENT_QUESTION_CORPUS_DEPENDENCY = NON_BLOCKING`
- **No Blocking Wait:** Approving this M7 contract and running the M7 pilot do **not** wait for a 100-question corpus to be completed.
- **Conceptual Alignment Only:**
  - *Informing M7 scenarios:* Existing corpus themes—zero-knowledge entry doubts, branch/career confusion (CSE/IT/AI/ECE/core), TNEA/cutoff/counselling questions, and college-vs-course-vs-location trade-offs—are already represented conceptually across Scenarios A–H.
  - *Feeding back after M7:* Genuine questions asked aloud by real students during M7 sessions will be anonymized and passed as authentic input to the separate Student Question Corpus workstream.
- **Strict Separation:** No Student Question Corpus files are created, edited, or depended upon by this contract.

---

## 13. Governance Boundaries

| Boundary | Binding Rule During M7 |
| --- | --- |
| **Control State Preservation** | `M6_OWNER_ACCEPTANCE = ACCEPTED`; `M7_AUTHORIZATION = NOT_AUTHORIZED`; `REAL_STUDENT_VALIDATION = NOT_RUN`; `PUBLICATION = NOT_AUTHORIZED`. |
| **Two-Step Authorization Separation** | Accepting this contract (`READY_FOR_OWNER_ACCEPTANCE`) approves the validation design only. Participant execution remains `M7_AUTHORIZATION = NOT_AUTHORIZED` and requires a separate, later explicit owner authorization. |
| **Engineering vs. Student Evidence** | `ENGINEERING_VERIFIED` (372/372 tests, Chrome audits, typecheck) is never conflated with `STUDENT_OBSERVED`. `REAL_STUDENT_VALIDATION = NOT_RUN` persists until real observations actually occur. |
| **Deterministic Authority** | Eligibility, cutoff formula, historical observations, and statutory 7.5% rules remain rule-based and evidence-backed; student observations cannot invent or override facts. |
| **Participant Protection (Minors)** | Under-18 participants require prior guardian/parent consent plus student assent; participation is strictly voluntary and stoppable at any time; no unnecessary personal data collected. |
| **Observation-Data & OneDrive Hygiene** | `ONEDRIVE_PRIVACY_STATUS = OPEN` remains tracked. Raw notes, recordings, screenshots, and identifiable participant material must never enter Git or the project repository/OneDrive workspace; apply minimal collection, anonymized IDs, restricted access, short retention, deletion after review, and explicit recording consent. Repository artifacts may hold only anonymized findings needed for product decisions. |
| **Private Access Only** | Pilot access must remain restricted to invited participants via owner-approved private method; public URLs, public indexing, and unapproved cloud spend (current cap: USD 0) are prohibited. |
| **Deferred Workstreams** | Conversational AI (`CON`), Live LLM (`GEMINI = PAUSED`), WhatsApp bot, shareable summaries, and public launch remain separately unauthorized. |

---

## 14. Owner Decision Gate

This contract is **`READY_FOR_OWNER_ACCEPTANCE`**. Milestone M7 execution remains **`NOT_AUTHORIZED`** (`M7_AUTHORIZATION = NOT_AUTHORIZED`) until Project Owner (**Ganesan**) completes **two separate explicit decisions**:

### Gate 1 — Separate Contract Acceptance Decision
```text
M7_CONTRACT_ACCEPTANCE      = PENDING_OWNER_DECISION (APPROVED / REVISE_REQUESTED)
M7_AUTHORIZATION            = NOT_AUTHORIZED (contract acceptance alone does NOT authorize execution)
```

### Gate 2 — Separate Later M7 Execution Authorization Decision
```text
PILOT_ACCESS_METHOD         = <local private device / authenticated tunnel / separately approved private staging>
PILOT_COST_CAP              = USD 0 (or explicit owner-approved cap)
PILOT_COHORT_PLAN           = <e.g., 5–8 participants, staged Wave 1 (2–3) + Wave 2 (3–5); descriptive only>
BASELINE_SHA_AUTHORIZED     = 44d7ee78e47cc2887127dd2cfd55c4b63fa153ab
M7_AUTHORIZATION            = NOT_AUTHORIZED (change to AUTHORIZED only by separate explicit owner decision)
REAL_STUDENT_VALIDATION     = NOT_RUN (unchanged until real observations actually happen)
PUBLICATION                 = NOT_AUTHORIZED
```

**Next Action:** Owner reviews [m7_student_validation_contract_v1.md](m7_student_validation_contract_v1.md) for Gate 1 contract acceptance. Participant sessions must not start until a separate explicit Gate 2 `M7_AUTHORIZATION` decision is recorded.

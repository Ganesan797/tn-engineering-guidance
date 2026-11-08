# Release 3: S1–S3 Real-Student Usability & Comprehension Observation Worksheet

**Document Reference:** `OBS-2026-001-V1`
**Associated Proposal:** [`PROP-2026-001`](../planning/PRODUCT_IMPROVEMENT_PROPOSAL_V1.md)
**Target Cohort:** 3–5 Tamil-Medium Higher Secondary (+2) Students or Recent School Leavers
**Device Context:** Physical Mobile Handsets (Android / iOS touchscreens, mobile viewports 360×800 to 390×844)
**Language Context:** Tamil (`lang=ta`) Primary; English (`lang=en`) Optional Toggle
**Current Execution Status:** `NOT_RUN` (Documentation protocol and observation templates prepared; pending physical student walkthrough)

---

## 1. Privacy, Confidentiality & Ethical Safeguards

To ensure complete student privacy and regulatory compliance:
1. **Strict Anonymization:** Students are assigned neutral identifiers (`P01`, `P02`, `P03`, `P04`, `P05`).
2. **Zero PII Collection:** Observers must **never** record student names, school names, phone numbers, email addresses, TNEA registration numbers, or community certificate details.
3. **No Real Sensitive Academic Data:** Students must not be pressured to disclose actual confidential board examination scores. They may use self-chosen hypothetical numbers, sample mark sheets, or approximate ranges.
4. **No Usability Claims Before Testing:** All scenario evaluation fields remain `PENDING_OBSERVATION`. Engineering test suite completion ($331/331$ tests passing) is an infrastructure baseline, not proof of real student comprehension.

---

## 2. Observation Protocol & Observer Instructions

* **Observer Posture:** Silent, non-interfering observer. Do not lead, prompt, or instruct the student on which button to click.
* **Think-Aloud Encouragement:** Prompt gently in Tamil: *"நீங்கள் என்ன நினைக்கிறீர்கள், எதைப் பார்க்கிறீர்கள் என்பதை வாய்திறந்து சொல்லுங்கள்"* (*"Please speak aloud what you are looking for and what you understand from this screen"*).
* **Intervention Rule:** If a student is completely stuck for $> 90\text{ seconds}$ on a navigation step, note it as an **Assisted Task / Friction Point** before giving a single minimal hint.
* **Recording Invariants:**
  * Record exact student words where confusion occurs.
  * Record whether the student distinguishes between *Cutoff* (merit rank) and *Eligibility* (minimum qualifications).
  * Record whether the student understands that an offering listed in `/colleges` does not guarantee a current seat.

---

## 3. The Three Test Scenarios

### Scenario S1: Zero-Knowledge Student (Engineering & Branch Orientation)
* **Goal:** A student who knows very little about engineering explores disciplines without entering marks or feeling overwhelmed.
* **Starting URL:** `http://<local-ip>:3000/?lang=ta`
* **Task Instruction:** *"பொறியியல் படிப்பு என்றால் என்ன, அதில் என்னென்ன பிரிவுகள் உள்ளன என்பதை முகப்புப் பக்கத்திலிருந்து பார்த்துத் தெரிந்துகொள்ளுங்கள்."*
* **Core Checkpoints:**
  1. Does the student find the primary starting card without hesitation?
  2. Do they browse branches without being forced to input marks?
  3. Can they articulate the difference between two disciplines in their own words?
  4. Do they find a clear next step?

### Scenario S2: Branch Explorer (Branch-to-College Handoff)
* **Goal:** Student understands a branch (e.g., Mechanical Engineering or CSE) and wants to discover offering colleges.
* **Starting URL:** `http://<local-ip>:3000/journey?step=explore&branch=Mechanical%20Engineering&lang=ta`
* **Task Instruction:** *"இந்த மெக்கானிக்கல் இன்ஜினியரிங் படிப்பு எந்தெந்த கல்லூரிகளில் உள்ளது என்பதைக் கண்டுபிடியுங்கள். அதில் கோயம்புத்தூர் அல்லது சென்னை கல்லூரிகளை மட்டும் வடிகட்டிப் பாருங்கள்."*
* **Core Checkpoints:**
  1. Do they notice and click `"இந்தப் பாடப்பிரிவு உள்ள கல்லூரிகளைப் பார்க்க"`?
  2. On `/colleges`, do they understand that missing vacancies (`UNKNOWN_OR_UNPUBLISHED`) mean seats will be published during counselling, rather than zero seats?
  3. Can they use district or acronym search (`psg`, `cit`, `gct`)?
  4. Can they compare 2–3 colleges without misinterpreting the comparison as an admission ranking?

### Scenario S3: Knows Marks (Cutoff Calculator vs Counselling Procedures)
* **Goal:** Student knows their subject marks and wants to evaluate their score and understand counselling options.
* **Starting URL:** `http://<local-ip>:3000/personal?lang=ta`
* **Task Instruction:** *"உங்கள் கணிதம், இயற்பியல், வேதியியல் மதிப்பெண்களை உள்ளிட்டு கட்-ஆஃப் கணக்கிடுங்கள். பின்னர் திரையில் உள்ள குறிப்பைப் படித்து, கட்-ஆஃப் என்றால் என்ன என்று விளக்குங்கள். தொடர்ந்து கலந்தாய்வு வழிகாட்டுதலுக்குச் சென்று 'Accept & Upward' என்றால் என்னவென்று பாருங்கள்."*
* **Core Checkpoints:**
  1. Can they operate the 3-box calculator ($M + \frac{P+C}{2}$) on their mobile phone?
  2. Do they understand that composite cutoff ($M + \frac{P+C}{2}$) is reduced to 200 and differs from official TNEA merit rank (which incorporates tie-break rules and community reservation)?
  3. Do they understand the mandatory conditions for *Accept & Upward* (in-person reporting to TFC, certificate verification, and fee payment within schedule, noting fee-exempt categories like 7.5% Govt quota, SC/ST, and First Graduate)?
  4. Do they understand that *Decline & Upward* relinquishes the tentatively allotted seat for that round without TFC reporting or fee payment while retaining eligibility for subsequent rounds?
  5. Do they understand that 7.5% Government School Quota requires continuous Std 6–12 TN Govt school study verified via Headmaster study certificate or EMIS records at TFC, establishing quota consideration rather than an automatic admission guarantee?

---

## 4. Participant Observation Sheets

```markdown
<!-- Participant Record Template: Replicate for P01 through P05 -->
```

### Participant Observation Sheet: P01
* **Participant Anonymized ID:** `P01`
* **Handset Model & Screen Width:** Android / Mobile Browser (360px viewport)
* **Primary Language Used:** Tamil (`lang=ta`)
* **Session Date & Time:** `PENDING_OBSERVATION`
* **Observer:** `PENDING_OBSERVATION`

| Scenario | Start Route | Time Taken | Completion Mode | Student Verbal Explanation (Tamil & English translation) | Points of Hesitation / Misunderstandings | Rating (`PASS` / `FIX` / `NEEDS HUMAN VALIDATION`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1: Zero-Knowledge** | `/?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on confusion or navigation friction..._ | `PENDING_OBSERVATION` |
| **S2: Branch-to-College** | `/journey?step=explore...` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on vacancy understanding or filters..._ | `PENDING_OBSERVATION` |
| **S3: Marks & Counselling** | `/personal?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on cutoff vs admission guarantee..._ | `PENDING_OBSERVATION` |

* **Next-Action Understanding:** Did student clearly identify what to do next?
* **Observer Synthesis & Friction Notes:**

---

### Participant Observation Sheet: P02
* **Participant Anonymized ID:** `P02`
* **Handset Model & Screen Width:** Android / Mobile Browser (390px viewport)
* **Primary Language Used:** Tamil (`lang=ta`)
* **Session Date & Time:** `PENDING_OBSERVATION`
* **Observer:** `PENDING_OBSERVATION`

| Scenario | Start Route | Time Taken | Completion Mode | Student Verbal Explanation (Tamil & English translation) | Points of Hesitation / Misunderstandings | Rating (`PASS` / `FIX` / `NEEDS HUMAN VALIDATION`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1: Zero-Knowledge** | `/?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on confusion or navigation friction..._ | `PENDING_OBSERVATION` |
| **S2: Branch-to-College** | `/journey?step=explore...` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on vacancy understanding or filters..._ | `PENDING_OBSERVATION` |
| **S3: Marks & Counselling** | `/personal?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on cutoff vs admission guarantee..._ | `PENDING_OBSERVATION` |

* **Next-Action Understanding:** Did student clearly identify what to do next?
* **Observer Synthesis & Friction Notes:**

---

### Participant Observation Sheet: P03
* **Participant Anonymized ID:** `P03`
* **Handset Model & Screen Width:** iOS / Safari Mobile (390px viewport)
* **Primary Language Used:** Tamil (`lang=ta`)
* **Session Date & Time:** `PENDING_OBSERVATION`
* **Observer:** `PENDING_OBSERVATION`

| Scenario | Start Route | Time Taken | Completion Mode | Student Verbal Explanation (Tamil & English translation) | Points of Hesitation / Misunderstandings | Rating (`PASS` / `FIX` / `NEEDS HUMAN VALIDATION`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1: Zero-Knowledge** | `/?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on confusion or navigation friction..._ | `PENDING_OBSERVATION` |
| **S2: Branch-to-College** | `/journey?step=explore...` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on vacancy understanding or filters..._ | `PENDING_OBSERVATION` |
| **S3: Marks & Counselling** | `/personal?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on cutoff vs admission guarantee..._ | `PENDING_OBSERVATION` |

* **Next-Action Understanding:** Did student clearly identify what to do next?
* **Observer Synthesis & Friction Notes:**

---

### Participant Observation Sheet: P04 (Optional Secondary Cohort)
* **Participant Anonymized ID:** `P04`
* **Handset Model & Screen Width:** Android / Mobile Browser (360px viewport)
* **Primary Language Used:** Tamil (`lang=ta`)
* **Session Date & Time:** `PENDING_OBSERVATION`
* **Observer:** `PENDING_OBSERVATION`

| Scenario | Start Route | Time Taken | Completion Mode | Student Verbal Explanation (Tamil & English translation) | Points of Hesitation / Misunderstandings | Rating (`PASS` / `FIX` / `NEEDS HUMAN VALIDATION`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1: Zero-Knowledge** | `/?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on confusion or navigation friction..._ | `PENDING_OBSERVATION` |
| **S2: Branch-to-College** | `/journey?step=explore...` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on vacancy understanding or filters..._ | `PENDING_OBSERVATION` |
| **S3: Marks & Counselling** | `/personal?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on cutoff vs admission guarantee..._ | `PENDING_OBSERVATION` |

---

### Participant Observation Sheet: P05 (Optional Secondary Cohort)
* **Participant Anonymized ID:** `P05`
* **Handset Model & Screen Width:** Android / Mobile Browser (360px viewport)
* **Primary Language Used:** Tamil (`lang=ta`)
* **Session Date & Time:** `PENDING_OBSERVATION`
* **Observer:** `PENDING_OBSERVATION`

| Scenario | Start Route | Time Taken | Completion Mode | Student Verbal Explanation (Tamil & English translation) | Points of Hesitation / Misunderstandings | Rating (`PASS` / `FIX` / `NEEDS HUMAN VALIDATION`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1: Zero-Knowledge** | `/?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on confusion or navigation friction..._ | `PENDING_OBSERVATION` |
| **S2: Branch-to-College** | `/journey?step=explore...` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on vacancy understanding or filters..._ | `PENDING_OBSERVATION` |
| **S3: Marks & Counselling** | `/personal?lang=ta` | _min _sec | [ ] Unassisted<br>[ ] Assisted<br>[ ] Failed | _"Student verbatim explanation..."_ | _Observations on cutoff vs admission guarantee..._ | `PENDING_OBSERVATION` |

---

## 5. Consolidated Observation Metrics & Go / No-Go Criteria

Following the completion of live sessions with P01–P05, observers will tally the following metrics:

1. **Unassisted Completion Rate:**
   $\text{Completion Rate} = \frac{\text{Number of Unassisted Completions}}{\text{Total Sessions}} \times 100\%$
   * Threshold [PROPOSED / PENDING OWNER APPROVAL]: $\ge 80\%$ unassisted across S1, S2, S3 required to declare student discovery proven.
2. **Cutoff vs Admission Guarantee Confusion Rate:**
   * Threshold [PROPOSED / PENDING OWNER APPROVAL]: $0\%$ tolerance for students believing that calculating a cutoff guarantees college admission.
3. **Branch-to-College Navigation Failure Rate:**
   * Threshold [PROPOSED / PENDING OWNER APPROVAL]: $0\%$ navigation drop-offs when transitioning from `/journey?step=explore` to `/colleges`.
4. **Vocabulary Friction Log:**
   * Specific English/Tamil terms that caused hesitation or required translation (e.g. *Cutoff, Allotment, Upward Movement, Quota*).

**Next Action:** Awaiting owner scheduling and execution of in-person observations using physical handsets.



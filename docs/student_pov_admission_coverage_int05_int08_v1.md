# INT-05–INT-08 Question Coverage and Paper Review V1

**Date:** 2026-10-02. **Batch:** [B01–B08](student_pov_admission_batch_int05_int08_v1.md). **Evidence:** [official-source note](student_pov_admission_evidence_int05_int08_v1.md).

## Scope and classification

The saved intent map supplies four intents and **39 unique questions**. Exact wording below is transcribed from the named working corpus, with only wrapped whitespace joined. No ID or wording mismatch was found. The source corpus and saved intent map remain unchanged.

`ANSWERED` means the question receives a direct, useful response at its stated scope. It does not establish personal eligibility, final factual approval, Tamil approval or student-tested usefulness. `PARTIAL` would mean a requested element lacks an answer; `DEFERRED` would mean no substantive answer in this batch. Conditional answers to conditional eligibility questions are not personal determinations.

| Intent | Exact saved name | Questions | ANSWERED | PARTIAL | DEFERRED |
|---|---|---|---|---|---|
| INT-05 | Engineering admission routes and TNEA scope | 12 | 12 | 0 | 0 |
| INT-06 | TNEA Process Explainer | 9 | 9 | 0 | 0 |
| INT-07 | Eligibility, special cases and required documents | 13 | 13 | 0 | 0 |
| INT-08 | Cutoff calculation and rank fundamentals | 5 | 5 | 0 | 0 |
| **Total** | **4 intents / 8 guidance units** | **39** | **39** | **0** | **0** |

Q001/Q002/Q007 retain DISCOVERED_STUDENT_QUESTION as recorded in the corpus; their external authenticity was not newly verified. Q052–Q087 are 36 PRODUCT_COVERAGE_QUESTION entries. Editorial needs are PARAPHRASED_STUDENT_NEED. The conversation below is SYNTHETIC_LANGUAGE_EXAMPLE. These classes are not interchangeable.

## Question-level review

| ID | Primary intent | Exact question | Unit / cross-link | Coverage | Reason |
|---|---|---|---|---|---|
| Q052 | INT-05 | How can I join an engineering college after 12th? | B01 | ANSWERED | Starts with route, year and eligibility before application; no premature college list. |
| Q053 | INT-05 | What are the different routes to engineering admission in Tamil Nadu? | B01 | ANSWERED | Distinguishes TNEA, examination and institution-managed routes; diploma route is separate. |
| Q054 | INT-05 | What is JEE? | B01 | ANSWERED | Defines JEE and distinguishes Main from Advanced. |
| Q055 | INT-05 | What is the difference between JEE and TNEA? | B01 | ANSWERED | Compares examination-based entry with school-mark counselling without substituting entities. |
| Q056 | INT-05 | Do I need JEE to study engineering in Tamil Nadu? | B01 | ANSWERED | Says JEE is unnecessary for ordinary TNEA entry, with other routes kept distinct. |
| Q057 | INT-05 | Can I apply through both JEE and TNEA? | B01 | ANSWERED | Answers conditional pursuit of both, separate registration and final acceptance rules. |
| Q058 | INT-05 | Are all engineering colleges in Tamil Nadu available through TNEA? | B01 | ANSWERED | Explicitly rejects all-colleges/all-seats coverage. |
| Q059 | INT-05 | What is management quota? | B02 | ANSWERED | Defines management quota directly; no invented fee, seat percentage or guarantee. |
| Q060 | INT-05 | What is lateral entry in engineering? | B03 | ANSWERED | Defines direct second-year entry. |
| Q061 | INT-05 | I completed a diploma. Can I join engineering? | B03 | ANSWERED | Retains completed diploma; explains conditional TNLEA route rather than restarting Class 12. |
| Q062 | INT-05 | Can a diploma student join directly in second year? | B03 | ANSWERED | Answers possible second-year entry without automatic admission. |
| Q063 | INT-05 | Is lateral-entry admission part of regular TNEA counselling? | B03 | ANSWERED | Explicitly distinguishes TNLEA from first-year TNEA. |
| Q001 | INT-06 | How does TNEA counselling actually work? I'm the first engineer in my family. | B04 | ANSWERED | First-generation sequence explains choices, allotment, response and joining; TFC help is named. |
| Q064 | INT-06 | What is TNEA? | B04 | ANSWERED | Expands TNEA and defines its function. |
| Q065 | INT-06 | Is TNEA an entrance exam? | B04 | ANSWERED | Directly states TNEA is not itself an entrance exam. |
| Q066 | INT-06 | Who conducts TNEA? | B04 | ANSWERED | Names the Directorate of Technical Education, Government of Tamil Nadu. |
| Q067 | INT-06 | What happens from TNEA application to joining a college? | B04 | ANSWERED | Covers application through joining, including actions after tentative allotment. |
| Q068 | INT-06 | What is counselling in TNEA? | B04 | ANSWERED | Explains counselling in plain language, not as a guaranteed interview. |
| Q069 | INT-06 | Why do I need to register for TNEA? | B04 | ANSWERED | Distinguishes registration from seat allotment. |
| Q070 | INT-06 | What is a TNEA rank list? | B04 / B08 | ANSWERED | Defines ordered merit list and overall/community distinction; cross-link B08. |
| Q071 | INT-06 | What information should I know before I start my TNEA application? | B05 | ANSWERED | Lists route/year/qualification/study/claim preparation; cross-intent INT-07/B05. |
| Q007 | INT-07 | What certificates should I keep ready for TNEA counselling? | B05 | ANSWERED | Core and claim-dependent documents are separated; missing documents have an official-help action. |
| Q072 | INT-07 | Who is eligible to apply for TNEA? | B06 | ANSWERED | Gives conditional eligibility dimensions, not a personal result from incomplete facts. |
| Q073 | INT-07 | Which 12th-standard subjects are required for engineering admission? | B06 | ANSWERED | Names academic PCM and pass requirements; vocational/special routes remain separate. |
| Q074 | INT-07 | What minimum marks are required to apply for engineering? | B06 | ANSWERED | Gives dated category thresholds and distinguishes average from cutoff and overall percentage. |
| Q075 | INT-07 | I am a CBSE student. Can I apply for TNEA? | B06 | ANSWERED | Answers CBSE conditional eligibility and official cross-board normalisation. |
| Q076 | INT-07 | I studied outside Tamil Nadu. Can I apply for TNEA? | B07 | ANSWERED | Explains outside-state study routes with evidence conditions, not blanket exclusion. |
| Q077 | INT-07 | What does nativity mean for TNEA? | B07 | ANSWERED | Defines nativity as a rule/evidence question, not birthplace alone. |
| Q078 | INT-07 | I was born in Tamil Nadu but studied outside the state. What should I check? | B07 | ANSWERED | Retains Tamil Nadu birth and outside study; identifies native-route evidence and unknowns. |
| Q079 | INT-07 | I studied in Tamil Nadu but was born outside the state. What should I check? | B07 | ANSWERED | Retains outside birth and Tamil Nadu study; specifies all VIII–XII and reservation distinction. |
| Q080 | INT-07 | What happens if I wrote an improvement exam? | B07 | ANSWERED | States dated improvement-mark rule; unusual exam interpretation goes to authority. |
| Q081 | INT-07 | I have a vocational or different school-study background. How do I know whether I am eligible? | B07 / B03 / B08 | ANSWERED | Distinguishes vocational groups/weighting and diploma route; unlisted equivalence remains unknown. |
| Q082 | INT-07 | What documents should I obtain before the application starts? | B05 | ANSWERED | Gives early core/conditional certificate checklist without claiming applications are open. |
| Q083 | INT-07 | What should I do if I am unsure whether my eligibility case is covered? | B07 | ANSWERED | Names TFC/official help and exact unresolved fact rather than guessing eligibility. |
| Q002 | INT-08 | What exactly is the TNEA cutoff mark and how is it calculated? | B08 | ANSWERED | Weighted formula and worked example are separated from normalisation and official rank. |
| Q084 | INT-08 | Is TNEA cutoff the same as my 12th-standard percentage? | B08 | ANSWERED | Directly distinguishes overall percentage from weighted cutoff and minimum average. |
| Q085 | INT-08 | Why is TNEA cutoff calculated out of 200? | B08 | ANSWERED | Explains 100+50+50 weights, not an additional exam. |
| Q086 | INT-08 | What is the difference between cutoff and rank? | B08 | ANSWERED | Distinguishes marks from ordered position, including ties. |
| Q087 | INT-08 | Does the same cutoff give the same rank every year? | B08 | ANSWERED | Explains cohort dependence without an invented historical comparison or prediction. |

## Paper walkthrough — not actual student validation

This is a synthetic conversation and qualitative 5–10-minute progression check, not a timed user study. Show only the relevant concise unit; optional explanations and evidence are not a compulsory reading sequence.

1. **Student:** “How do I enter engineering after Class 12?” **B01:** Explain TNEA versus entrance-exam routes first. Do not request marks or a college list merely to orient the student. Next useful choice: first-year route or already-completed diploma; retain Class 12 when already supplied.
2. **Student:** “I mean TNEA. I'm the first engineer in my family. Is there an exam?” **B04:** No TNEA entrance exam for the ordinary academic route; explain registration, verification, rank, choices, allotment response and joining. The TFC is an identified help route. Do not repeat the route question.
3. **Student:** “I am a CBSE student and studied outside Tamil Nadu.” **B06/B07:** CBSE is not a blanket bar, and outside study is not a blanket bar. Retain both facts. Explain nativity/study routes and ask only the missing class-year/native-route detail if a personal check is requested. Do not announce eligibility from board or birthplace alone.
4. **Student:** “What does cutoff mean? Is it my total percentage?” **B08:** Explain the stated 100-scale example, weighting and separate official normalisation, then rank as position. Do not request every eligibility document to explain the number, or imply an admission prediction.
5. **Student:** “What should I do next?” **B05:** Identify the intended admission year and applicable official guide, make a private available/missing/unsure document checklist, and take one precise unresolved case to TFC. If the year is 2027, explicitly preserve the absence of verified 2027 rules; do not treat 2026 registration as open.
6. **Alternative supplied context:** If the student says “I already completed a diploma,” use B03 and the applicable TNLEA guide immediately. Do not send them through the regular first-year questionnaire or reuse academic cutoff weights.

**Paper result:** The sequence gives a usable route, process and next action without requiring prior admission vocabulary or repeating supplied context. It does not complete the seven-stage journey or prove a real student can finish within 5–10 minutes. Actual student validation remains PENDING.

## Focused review gaps and boundaries

- **Owner answer review:** This new batch is ready for Ganesan's review; it is not covered by the separate A01–A07 V2 acceptance.
- **Tamil:** All units have equivalent-intent Tamil drafts; volunteer review must check naturalness, technical terms and preservation of each condition. No Tamil approval is inferred from English completeness.
- **Grievance timing:** Two official 2026 sources conflict (five days versus one week). A controlling rank-list notice/authority clarification is still needed before stating a fixed deadline. The answer directs prompt official checking and does not choose a deadline.
- **Future year:** 2027 eligibility, documents, dates and availability are NOT VERIFIED. The batch expressly labels the available 2026 rules.
- **Management and individual cases:** No target institution or verified student file is supplied. Institution-specific terms and personal equivalence/nativity decisions remain conditional; the introductory questions are answered without inventing them.
- **Source consistency:** The direct brochure's +2 minimum-average table is distinguished from its +1/+2 pass requirement. Existing CSV phrasing is noted in the evidence document; this task neither changes nor revalidates executable rules.
- **Scope:** Advanced choice-filling strategy, financial entitlement and historical cutoff comparisons belong to later intents. Cross-links preserve these connections without claiming their completion. The unresolved G05 coupling follow-up is unchanged.

## Documentation validation

Passed exact 39 assigned-ID/intent/wording comparison against the working corpus and saved map, eight bilingual-unit membership checks, 26 local-link checks, arithmetic verification, five-file scope, credential-pattern scan and Git-blob preservation checks for frozen documents and A01–A07 baselines. Official source locations were reviewed during research; the grievance conflict remains disclosed. Whitespace integrity passed. These are documentation checks, not application tests, typecheck or live scenario validation. The original A01–A07 V1/V2, evidence, frozen documents and corpus are preserved. Gemini remains PAUSED; Live LLM Gate PARTIAL; M2 NOT_AUTHORIZED.

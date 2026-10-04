# T03 — Factual-scope and human Tamil-equivalence worksheet

**Prepared:** 2026-10-04. **State:** PREPARATION COMPLETE; HUMAN REVIEWS NOT REVIEWED.

**Exact content baseline:** `e052f1d6453af03e5c389dbcb739ce41836d5c92`, verified clean local main and origin/main after fetch. All source links below identify that content version; this documentation update does not change it. Before reviewing a later checkout, compare the linked files with this revision and record the actual commit. Do not transfer PASS to changed wording automatically.

**Entry point:** start with the practical order below, then Part 1 J01. This single worksheet reuses the [existing screen checklist and privacy template](m2_one_journey_validation_plan_2026-10-03.md), [question-to-domain map](m2_one_journey_question_domain_map_v1.md) and [answer mapping](m2_question_specific_answer_mapping_2026-10-04.md). It supplies two independent outcome fields for every review item.

[Current execution plan](current_execution_plan.md) · [Project Status](../../PROJECT_STATUS.md) · [Owner Finding 02 decision](m2_owner_finding_02_decision_2026-10-04.md) · [bounded authorization](m2_one_journey_authorization_decision_2026-10-03.md). Owner Finding 02 PASS covers presentation/relevance only; it grants neither factual release nor human Tamil approval. Historical OPEN/not-authorized snapshots in earlier records are superseded only as stated by those dated decisions.

## Practical review order

1. Ganesan starts at `/journey`, reviews J01–J05 and J20 without using the bank or entering marks. Record factual/mission findings; do not run a student test on behalf of a student.
2. Review J06–J16 using synthetic inputs only, including known cutoff, unknown year/stream/mark, improvement-year boundary and direct entry. Open “why/evidence” and next actions. Results are POST states, not bookmarkable GET URLs. Source-only conditional/error labels are labelled below rather than claimed as browser-tested.
3. Review J17–J19, then the 70 question cards in A01–A07, B01–B08 order. Prioritize B05–B08 conditions, Q021 and exact Q010/Q011/Q049 comparisons. Shared sources can be checked together; record each ID separately.
4. A named human Tamil reviewer independently checks primary screens, results/uncertainty, next actions, then all 70 question pairs using Part 2. Owner presentation PASS is not a substitute.
5. Record separate outcomes and evidence requests. Resolve or constrain findings before any factual/Tamil release decision. Student sessions and M2 acceptance remain separate T04/T05 work.

Optional local viewing from repository root: `npm run start:mvp`; default `http://127.0.0.1:3000/journey` (use the printed port if PORT is set). This worksheet does not claim a server was started or a live walkthrough performed in T03 preparation. The local app does not require a model call.

## Recording rules and common checks

Allowed outcome for **each** factual and Tamil row: **NOT REVIEWED / PASS / FIX / NEEDS EVIDENCE**. Blank reviewer/date/finding cells are intentionally empty. PASS must name reviewer, date and exact baseline, with scope/conditions; FIX must quote the offending phrase and smallest requested correction; NEEDS EVIDENCE must name the claim and missing source/year/page. Do not put real marks, certificates, contact details or identifiable student stories here. No automatic aggregate approval.

**Factual checklist F (apply to every item):** direct answer and exact entities; source/page and applicable year; qualifications/exceptions; no invented admission/college/career outcome; cutoff versus minimum eligibility versus normalised merit/rank; reservation/concession proof versus guaranteed entitlement; unknowns preserved; useful next action; no mandatory marks/branch/bank for awareness. Direct answer completeness is not factual release approval.

**Tamil checklist T (apply to every item):** complete English meaning including detail/limits; natural low-anxiety Tamil; explain unfamiliar terminology while retaining useful TNEA/CSE abbreviations; preserve numbers, units, dates, negation, inclusive boundaries, conditions and all comparison subjects; equivalent next action and destination; language-consistent navigation. Record omissions/additions, not only fluency. Primary journey is Tamil-only: compare it with the linked English content and domain meaning, not an invented English journey UI.

## Part 1 — Ganesan factual-scope review

### Primary screens, results and shared controls

All J rows include F. Exact render version: [journey renderer](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/src/ui/m2-journey.ts) plus [route/POST/error handling](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/scripts/mvp-server.mjs), [progressive input and deterministic bridge](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/src/m2/journey.ts), [question renderer/navigation](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/src/ui/explore-questions.ts). Loaded wording: [M1 pack](../content/m1/m1_awareness_content_pack_v1.md), [approved M1 Tamil](../content/m1/m1_tamil_student_copy_v1.md), [A01–A07 V2](../content/awareness/student_pov_awareness_batch_a01_a07_v2.md), [B01–B08](../content/admission/student_pov_admission_batch_int05_int08_v1.md). Every selector below is at the exact baseline above.

| Item / screen or path | Exact content selector | Source/year and conditions | What Ganesan checks beyond F | Factual outcome | Reviewer | Date | Finding / evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| J01 — `/journey` | awareness branch; AW-01 + A01 Q026/Q028 + A04 Q036 | AW-01/SRC006/SRC008; E01–E03, E15–E16. Orientation, not admissions rules; booklet March 2025; curricula 2026; occupations 2015. | Explain study/work and several fields without marks, ranking or a compulsory choice. Useful next step must be visible without question-bank use. | NOT REVIEWED | | | |
| J02 — `/journey?step=study` | study branch; A01 Q035; A04 Q037–Q044 | E03–E11. R2025 Revised 1 (2026), non-autonomous affiliated scope only. | Open all five disclosures; check example subjects, labs and projects, institution caveat, no universal syllabus claim. | NOT REVIEWED | | | |
| J03 — `/journey?step=compare` | compare branch; A06 Q047; A04 Q036; A05 Q049 | E03–E11. Same reviewed curriculum scope; no aptitude or employment verdict. | Check CSE/IT/AI & DS/AI & ML remain four distinct subjects; optional comparison, no branch requirement. | NOT REVIEWED | | | |
| J04 — `/journey?step=route` | route branch; AW-03/AW-05; B01/B04 disclosures and B03 link | S1/SRC002 pp.1,9,11–14; S2 pp.1–4; S3–S5. 2026; separate routes; contested grievance window not a fixed deadline. | TNEA is not all engineering admission. Explain application, verification/rank, choices/allotment, response; no open-window or seat guarantee. | NOT REVIEWED | | | |
| J05 — `/journey?step=prepare` | prepare branch; complete B05 Tamil draft | S1 §§3–5,7–9, printed pp.1–5,10–12. 2026 list; certificates conditional; current upload rules unverified. | Check reservation/concession/First Graduate/government-school and special-claim proof; possession is not automatic entitlement. No private upload requested. | NOT REVIEWED | | | |
| J06 — `/journey?step=check` | QUESTIONS.year and stream; separate prompts | S1 §3; ADMISSION_YEAR; question-to-domain map. 2026 HSC academic only. | Year other/unknown and route other/unknown must not become supported personal calculations. | NOT REVIEWED | | | |
| J07 — `POST /journey after year/stream` | QUESTIONS.improvement and improvement_year; originalMarks wording | S1 improvement paragraph printed p.3; ELG032 CSV page field 2. 2026 rule refers to improvement marks from 2006 onward; page citation discrepancy needs review. | Check 2006 inclusive meaning, original-mark instruction and unknown case; Tamil after-2006 wording versus code >=2006 needs explicit equivalence review. | NOT REVIEWED | | | |
| J08 — `POST /journey after improvement answer` | QUESTIONS.maths, physics, chemistry; context and why text | S1 §6(a), printed p.9; ELG009/ELG032. Three separate 100-mark inputs; no unsupported scale/normalisation claim. | Check progressive prompts, minimum needed inputs, retained answers and original versus improved marks. | NOT REVIEWED | | | |
| J09 — `POST /journey result: 2026, academic, no improvement, 86/78/81` | score, status, next and evidence disclosure | S1 pp.3,9; existing engine ELG009/ELG032. Synthetic example only: 165.5/200; broader NEEDS_REVIEW; not rank or admission. | Review “verified cutoff” wording against raw weighting versus official normalisation; no eligibility/seat promise. Check B08 result link. | NOT REVIEWED | | | |
| J10 — `POST /journey result: unknown year or other year` | UNKNOWN status and year-specific next action | S1 year scope; frozen Input/Output uncertainty contract. No personal calculation for unsupported/unknown year. | Clearly distinguish unavailable evidence from rejection; direct to applicable official-year notice. | NOT REVIEWED | | | |
| J11 — `POST /journey result: 2026, unknown/other stream` | UNKNOWN status and stream-specific next action | S1 §3; S5; frozen uncertainty contract. Academic check does not assess diploma/vocational/equivalent cases. | Give official route action; B03 second-year option must not imply personal assessment. | NOT REVIEWED | | | |
| J12 — `POST /journey: unknown improvement/year or any one subject` | null cutoff; unknown label; retry; retained state | ELG009/ELG032; frozen unknown contract. Use synthetic answers only; unknown stays null, never zero/false. | Check distinct missing input/review wording, no guessed score; retry retains other known inputs. | NOT REVIEWED | | | |
| J13 — `POST /journey: result status variants` | status conditional: NEEDS_REVIEW / ELIGIBLE / INELIGIBLE | Existing GuidanceResult; S1 applicable rules; Input/Output V1. Ordinary bounded blank-profile path is not evidence that every engine outcome is reachable. | Read all three exact conditional labels in source; do not fabricate real profiles to force a verdict. Separate rule status from college seat/rank. | NOT REVIEWED | | | |
| J14 — `POST /journey: invalid input/error` | server catch message; reset to empty state | scripts/mvp-server.mjs POST handler; no admission-source claim. Malformed state/invalid value; reset not durable recovery. | Review safe restart message and loss-of-state expectation; unknown is not invalid. | NOT REVIEWED | | | |
| J15 — `/journey?step=check direct entry; /personal entry` | check link; /personal entry is separate M1/reference handoff | Bounded authorization and Input/Output V1; existing student-entry renderer. Do not imply /personal and /journey?step=check are the same screen. | Check informed student bypasses awareness; if following reference handoff, its language/scope limitation remains explicit. | NOT REVIEWED | | | |
| J16 — `All /journey screens` | journeyNav; source/review footer; home; optional-bank link | Frozen mission; M1 pack; A/B review limits. Primary journey Tamil; optional Q&A separately bilingual. | Check every next action/source notice; no forced 70-question sequence. Partial-input route detour uses POST; collection opens separate tab when state exists. | NOT REVIEWED | | | |
| J17 — `/journey/questions?lang=ta and ?lang=en; 15 topics` | COPY, TOPICS and EN_TOPICS; language switch | Question-specific JSON; mission and scope decision. 70 prepared questions only; other 98 not answered; draft-review notice persists. | Review all 15 topic labels, navigation and notices; language switches preserve topic/question; English return explicitly says Tamil journey. | NOT REVIEWED | | | |
| J18 — `/journey/questions?lang=ta&id=Q060 and Q002` | B03 lateral notice; B08 next/limit; return links | S5 pp.1–5; S1 p.9; B03/B08. 2026–27 lateral route separate; academic score not rank. | Check route-to-B03 and result-to-B08 transitions; personal result tab retained. | NOT REVIEWED | | | |
| J19 — `/journey/questions invalid ID/topic; missing-translation conditional` | notFound / missing / partial COPY branches | Explore-questions renderer; no admission claim. Missing Tamil is source-only fallback at this baseline; all 70 pairs currently present. | Review safe language-unavailable notice without substituting English as Tamil; Q021 partial notice remains. | NOT REVIEWED | | | |
| J20 — `/journey → study/compare (optional) → route → prepare` | Whole marks-free primary path and all its next actions | Frozen mission/journey; October 3 authorization. Paper/human expert review only; actual 5–10-minute student success remains untested. | Can a beginner understand engineering, identify one route and one useful action without bank, marks, branch selection or college list? Record any gap; do not count this as T04. | NOT REVIEWED | | | |

### Evidence register and known gaps

References below are **existing recorded evidence, not newly fetched or reverified sources**. See [awareness claim map](../content/awareness/student_pov_awareness_evidence_v2.md), [admission claim map](../content/admission/student_pov_admission_evidence_int05_int08_v1.md) and [source registry](../../data/sources.csv). Research access date recorded there: 2026-10-02; registry dates differ. S1 = SRC002. E01 = SRC006; E02 = SRC008. Undated sources remain undated.

| Key | Recorded title / applicable year | Existing source URL | Supporting location | Limits |
| --- | --- | --- | --- | --- |
| E01 | **Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006` | https://www.naanmudhalvantest.com/career-streams/engineering | Engineering skills and specialisations | Introductory definition, field families and useful skills. Salary text remains excluded because visible provenance is insufficient. |
| E02 | **India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008` | https://www.scribd.com/document/843383086/India-Sudar-Career-Guidance-Book-MAR-2025 | Printed pp.44–45 (viewer pp.50–51) | Booklet-first engineering/branch orientation and questions to check. Time-sensitive claims excluded. |
| E03 | **Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026 | https://cac.annauniv.edu/aidetails/revision_ai_ug_cands_2025ft.html | Programme index by faculty | Establishes that cited programme documents belong to the same regulation, revision, batch and non-autonomous affiliated-institution scope. It does not apply to autonomous colleges. |
| E04 | **B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/BE%20CSE.pdf | PDF pp.1–5, semesters I–VI; repository extract `A03-CSE` | CSE example subjects and practical structure. |
| E05 | **B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/B.Tech.%20IT%20.pdf | PDF pp.1–6, semesters I–VI; repository extract `A03-IT` | IT example subjects; like-for-like CSE/IT comparison. |
| E06 | **B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/ECE/B.E%20ECE.pdf | PDF pp.1–6, semesters I–VI; repository extract `A03-ECE` | ECE subjects and computing/electronics overlap. |
| E07 | **B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/EEE/B.E.%20EEE.pdf | PDF pp.1–8, semesters I–VIII | EEE circuits, machines, power, control, lab, project and internship claims. |
| E08 | **B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/Mech/B.E.%20Mechanical%20Engineering.pdf | PDF pp.1–8, semesters I–VIII | Mechanical subjects, laboratories, project/internship and elective families. |
| E09 | **B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/Civil/B.E.%20Civil%20Engineering%20.pdf | PDF pp.1–8, semesters I–VIII | Civil subjects, surveying/materials/soil/environment/drawing practicals and project/internship. |
| E10 | **B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/B.Tech.%20AI%20and%20DS.pdf | PDF pp.1–7, semesters I–VIII | AI & DS foundation, data/statistics/AI emphasis, labs and project/internship. |
| E11 | **B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026) | https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/B.E.%20CSE%20%28AI%20%26%20ML%29.pdf | PDF pp.1–7, semesters I–VIII | CSE (AI & ML) foundation, AI/ML concentration, labs and project/internship. |
| E12 | **B.Sc. Physics**, Bharathiar University, affiliated colleges, 2023–24 onwards, 2023 | https://syllabus.b-u.ac.in/syl_college/2023_24/bsc_physics_2023_24.pdf | Programme structure and theory/practical papers | Illustrative science-degree comparison only. It cannot define all B.Sc. programmes or universities. |
| E13 | **Career Options After +2**, Tamil Nadu Department of Employment and Training, 2025/26 publication | https://www.employmentexchange.tn.gov.in/pdf/career_booklet/Career-Options-After-12th-Std.pdf | Course-family map: entrance exams; medical/allied health; arts/science; commerce/management; design; law; teacher education; diploma/certificate options | Establishes broad post-Class-12 option families, not personal eligibility or current admission terms. Those require the relevant authority. |
| E14 | **TNEA Cutoff Portal**, Government of Tamil Nadu / Directorate of Technical Education, records 2021–2025 | https://cutoff.tneaonline.org/ | Search by year, college, programme and applicable admission dimensions | Historical observations only. Past cutoff is not current availability or admission probability. A comparison is invalid if college, year, route/round, category/quota or programme type is mixed. |
| E15 | **National Classification of Occupations 2015, Volume II-A**, Ministry of Labour and Employment / National Career Service, 2015 | https://www.ncs.gov.in/Documents/National%20Classification%20of%20Occupations%20_Vol%20II-A-%202015.pdf | pp.224 onward, occupation family 2512; software developer, engineer trainee and engineering-analysis roles | Supports the existence and task descriptions of software/engineering-analysis occupation families. It does not say every branch qualifies for every employer or that jobs are available. |
| E16 | **National Classification of Occupations 2015, Volume I**, Ministry of Labour and Employment / National Career Service, 2015 | https://www.ncs.gov.in/Documents/National%20Classification%20of%20Occupations%20_Vol%20I-%202015.pdf | Occupation families 2142–2153 and 2512 | Supports examples of civil, mechanical, electrical/electronics and software occupation families. It is a classification, not hiring or salary evidence. |
| S1 | Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure** | https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf | Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling | Main rule authority for first-year TNEA 2026. PDF page index is printed page +1 because of the cover (printed p.2 = third PDF page). Never promote 2026 instructions to 2027. |
| S2 | Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure** | https://static.tneaonline.org/docs/8_TNEA_2024_Counselling_procedure_2026.pdf | PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options | The visible title is 2026 despite older years embedded in filename/metadata. Shared process explanation is usable; conflicting grievance timing is flagged below. |
| S3 | National Testing Agency, **JEE (Main) 2026 Information Bulletin** | https://cdnbbsr.s3waas.gov.in/s3f8e59f4b2fe7c5705bf878bbd494ccdf/uploads/2025/11/202511021649722475.pdf | §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation | Retrieved from the current official [NTA JEE Main site](https://jeemain.nta.nic.in/) Information Bulletin link. Supports entrance-route orientation, not personal eligibility or a full JEE guide. Published in 2025 for admission/examination year 2026. |
| S4 | JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria** | https://jeeadv.ac.in/admission_criteria.html ; https://jeeadv.ac.in/eligibility.html | Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria | Supports separate IIT/Advanced and JoSAA requirements. Do not infer that appearing in Main alone makes a student eligible for an IIT. |
| S5 | Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates** | https://www.tnlea.com/QuickLinks/LEA-2026/General%20Information%20to%20Candidates%20%28English%29-%20LEA%202026.pdf | Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average | Confirms separate direct-second-year process and conditional diploma route. Official entry point: https://www.tnlea.com/ . No automatic diploma-to-branch equivalence or current vacancy claim. |
| S6 | AICTE, **Approval Process Handbook 2024–25 to 2026–27**, hosted by Anna University | https://www.annauniv.edu/cai/APH2024-25.pdf | §§18.11–18.14, Mandatory Disclosures: admission procedure/calendar, criteria/weightages, applicants and management-seat results; printed pp.176–177 | Supports management-quota disclosure concepts. It is not a current Tamil Nadu institution-specific management-admission notice. No uniform percentage, price or admission guarantee is drawn from it. |

- **Q021 stays PARTIAL in English and Tamil.** Specific ECE-versus-CSE difficulty/number needs matching college, year, academic/vocational route, round, community/allotted category, quota/special reservation, programme and seat type. E14 is historical 2021–2025; the 2026-10-02 source note records portal HTTP 503. No new availability test or numeric comparison is made here.
- **S1/S2 grievance timing:** five days versus one week in existing records. Require the controlling notice for the particular rank list; do not select a deadline by guess.
- **2026 applicability:** no verified 2027 TNEA rules; R2025 curriculum for a 2026–27 batch is not a 2027 admission rule. S6 handbook period is not an institution-specific management notice.
- **Personal/entitlement conditions:** certificate possession alone does not prove reservation, first-graduate concession or special-category entitlement. Q007/Q071/Q074/Q076–Q082 and J05 need claim-specific scrutiny. Community/nativity, school years and vocational weighting must not be collapsed.
- **Improvement citation/translation check:** ELG032 in the [eligibility reference](../../data/reference/tnea_2026_eligibility.csv) stores source page 2; the admission evidence and result disclosure cite printed p.3. Verify the actual supporting paragraph/page convention. Code uses year >=2006 while one Tamil instruction says “2006-க்குப் பிறகு”; review whether the inclusive boundary is conveyed correctly. This is a review flag, not a code or rule correction in this task.
- **Cutoff and domain boundary:** raw 100-scale weighting is not official board normalisation/rank, and cutoff may coexist with NEEDS_REVIEW. Inspect J09's “verified” wording. G05 cutoff/eligibility coupling remains a future domain follow-up, not a resolved finding.
- **Curriculum/career/college limits:** affiliated non-autonomous R2025 Rev.1 comparisons cannot be generalized to every institution. E12 is one B.Sc. example; E15/E16 (2015) identify occupations, not current hiring/placement or branch-neutral job eligibility. Management terms, fees, seats and current employer conditions need their own applicable evidence.
- **Approval and notices:** source presence is not release approval. The implementation still contains review-time notices; record any stale notice precisely for a separately authorized correction rather than editing it here. No factual, Tamil, student or M2 acceptance is inferred.

## Part 2 — Separate human Tamil-equivalence review

Priority: primary journey → results/uncertainty → every next action → all 70 pairs. Apply T to the exact J selectors and evidence conditions in Part 1. Existing M1 approval remains historical; these rows assess the current integrated presentation and do not revoke or automatically extend that approval.

| Item | Priority / comparison basis | Tamil outcome | Human reviewer | Date | Finding / evidence |
| --- | --- | --- | --- | --- | --- |
| J01 — `/journey` | 1 — Primary journey; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J02 — `/journey?step=study` | 1 — Primary journey; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J03 — `/journey?step=compare` | 1 — Primary journey; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J04 — `/journey?step=route` | 1 — Primary journey; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J05 — `/journey?step=prepare` | 1 — Primary journey; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J06 — `/journey?step=check` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J07 — `POST /journey after year/stream` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J08 — `POST /journey after improvement answer` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J09 — `POST /journey result: 2026, academic, no improvement, 86/78/81` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J10 — `POST /journey result: unknown year or other year` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J11 — `POST /journey result: 2026, unknown/other stream` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J12 — `POST /journey: unknown improvement/year or any one subject` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J13 — `POST /journey: result status variants` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J14 — `POST /journey: invalid input/error` | 2 — Inputs/results/uncertainty; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J15 — `/journey?step=check direct entry; /personal entry` | 3 — Next actions and navigation; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J16 — `All /journey screens` | 3 — Next actions and navigation; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J17 — `/journey/questions?lang=ta and ?lang=en; 15 topics` | 3 — Next actions and navigation; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J18 — `/journey/questions?lang=ta&id=Q060 and Q002` | 3 — Next actions and navigation; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J19 — `/journey/questions invalid ID/topic; missing-translation conditional` | 3 — Next actions and navigation; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |
| J20 — `/journey → study/compare (optional) → route → prepare` | 3 — Next actions and navigation; apply T to the Part 1 selector, including all disclosures and conditions | NOT REVIEWED | | | |

## All 70 question pairs — item records for Parts 1 and 2

Jump to: [A01](#q025--a01) · [A02](#q030--a02) · [A03](#q029--a03) · [A04](#q036--a04) · [A05](#q010--a05) · [A06](#q012--a06) · [A07](#q045--a07) · [B01](#q052--b01) · [B02](#q059--b02) · [B03](#q060--b03) · [B04](#q001--b04) · [B05](#q071--b05) · [B06](#q072--b06) · [B07](#q076--b07) · [B08](#q002--b08). Q082 belongs to B05 and retains its saved later position; it is also covered in its own card.

Each card includes an immutable link to the **actual implemented** JSON entry and a verbatim snapshot of its English/Tamil question, answer, detail, next action and limit. These are review copies, not new approved answers. The source key register above supplies year/title/URL; per-entry locations below preserve the implementation citations. Check each mapped claim against the detailed evidence note; multiple citations do not automatically prove every sentence. Apply F and T independently. Current completeness: **69 DIRECT + Q021 PARTIAL per language**; all 70 Tamil pairs remain pending human equivalence. The other 98 corpus questions are outside this review.

### Q025 — A01

**Exact entry:** [Q025 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3-L46). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q025` and `/journey/questions?lang=ta&id=Q025`.

**Ganesan checks:** F plus Check engineering study/work examples and marks-free next direction; no universal outcome.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E02 (**India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008`) — Printed pp.44–45 (viewer pp.50–51); E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q025</summary>

**English**

**question:** I know I want to do engineering, but I don't know how to start.

**answer:** Start with three questions: What problems interest me? What subjects and practical work are in the related branch? How do I enter that programme? You do not need marks or a college choice to begin.

**detail:** (No additional detail displayed.)

**next:** Explore one field, then learn how to enter engineering.

**limit:** Personal fit and exact programmes remain conditional.

**Tamil draft — not human-approved**

**question:** பொறியியல் படிக்க வேண்டும் என்று தெரியும்; எப்படித் தொடங்குவது என்று தெரியவில்லை.

**answer:** முதலில் மூன்று கேள்விகளிலிருந்து தொடங்குங்கள்: எந்தப் பிரச்சினைகள் எனக்கு ஆர்வம் தருகின்றன? அதனுடன் தொடர்புள்ள பிரிவில் என்ன பாடங்களும் செய்முறைப் பணிகளும் உள்ளன? அந்தப் படிப்பில் எப்படி சேருவது? தொடங்குவதற்கு இப்போது மதிப்பெண் அல்லது கல்லூரித் தேர்வு தேவையில்லை.

**detail:** (No additional detail displayed.)

**next:** ஒரு துறையில் என்ன படிப்பீர்கள் என்று பாருங்கள்; அடுத்து அதில் சேரும் வழியை அறியுங்கள்.

**limit:** உங்களுக்கான பொருத்தமும் குறிப்பிட்ட படிப்பின் விவரங்களும் இன்னும் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q036; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q026 — A01

**Exact entry:** [Q026 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L49-L92). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q026` and `/journey/questions?lang=ta&id=Q026`.

**Ganesan checks:** F plus Check engineering study/work examples and marks-free next direction; no universal outcome.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E02 (**India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008`) — Printed pp.44–45 (viewer pp.50–51); E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q026</summary>

**English**

**question:** What is engineering?

**answer:** Engineering applies mathematics, science, design and testing to create or improve things and systems: for example, software, circuits, machines, buildings, transport or water systems.

**detail:** (No additional detail displayed.)

**next:** Explore one field, then learn how to enter engineering.

**limit:** Personal fit and exact programmes remain conditional.

**Tamil draft — not human-approved**

**question:** பொறியியல் என்றால் என்ன?

**answer:** கணிதம், அறிவியல், வடிவமைப்பு, சோதனை ஆகியவற்றைப் பயன்படுத்தி மென்பொருள், மின்சுற்று, இயந்திரம், கட்டிடம், போக்குவரத்து அல்லது நீர் அமைப்பு போன்றவற்றை உருவாக்குவதும் மேம்படுத்துவதும் பொறியியல்.

**detail:** (No additional detail displayed.)

**next:** ஒரு துறையில் என்ன படிப்பீர்கள் என்று பாருங்கள்; அடுத்து அதில் சேரும் வழியை அறியுங்கள்.

**limit:** உங்களுக்கான பொருத்தமும் குறிப்பிட்ட படிப்பின் விவரங்களும் இன்னும் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q036; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q027 — A01

**Exact entry:** [Q027 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L95-L208). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q027` and `/journey/questions?lang=ta&id=Q027`.

**Ganesan checks:** F plus Check engineering study/work examples and marks-free next direction; no universal outcome.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E02 (**India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008`) — Printed pp.44–45 (viewer pp.50–51); E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E15 (**National Classification of Occupations 2015, Volume II-A**, Ministry of Labour and Employment / National Career Service, 2015) — pp.224 onward, occupation family 2512; software developer, engineer trainee and engineering-analysis roles; E16 (**National Classification of Occupations 2015, Volume I**, Ministry of Labour and Employment / National Career Service, 2015) — Occupation families 2142–2153 and 2512. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q027</summary>

**English**

**question:** Why do people study engineering?

**answer:** People may choose it because they want to understand how things work and learn to design, build, test or improve practical solutions.

**detail:** It is a good reason to explore engineering, but it does not guarantee that the course will suit every student or lead to a particular job.

**next:** Explore one field, then learn how to enter engineering.

**limit:** Personal fit and exact programmes remain conditional.

**Tamil draft — not human-approved**

**question:** ஏன் பொறியியல் படிக்கிறார்கள்?

**answer:** பொருட்கள் அல்லது அமைப்புகள் எப்படி செயல்படுகின்றன என்பதைப் புரிந்துகொண்டு, நடைமுறைத் தீர்வுகளை வடிவமைக்க, உருவாக்க, சோதிக்க அல்லது மேம்படுத்த விரும்புவதால் சிலர் பொறியியல் படிக்கிறார்கள்.

**detail:** இது ஆராய நல்ல காரணம்; ஆனால் இந்தப் படிப்பு எல்லோருக்கும் பொருந்தும் என்றோ குறிப்பிட்ட வேலை கிடைக்கும் என்றோ உறுதி அல்ல.

**next:** ஒரு துறையில் என்ன படிப்பீர்கள் என்று பாருங்கள்; அடுத்து அதில் சேரும் வழியை அறியுங்கள்.

**limit:** உங்களுக்கான பொருத்தமும் குறிப்பிட்ட படிப்பின் விவரங்களும் இன்னும் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q036; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q028 — A01

**Exact entry:** [Q028 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L211-L324). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q028` and `/journey/questions?lang=ta&id=Q028`.

**Ganesan checks:** F plus Check engineering study/work examples and marks-free next direction; no universal outcome.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E02 (**India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008`) — Printed pp.44–45 (viewer pp.50–51); E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E15 (**National Classification of Occupations 2015, Volume II-A**, Ministry of Labour and Employment / National Career Service, 2015) — pp.224 onward, occupation family 2512; software developer, engineer trainee and engineering-analysis roles; E16 (**National Classification of Occupations 2015, Volume I**, Ministry of Labour and Employment / National Career Service, 2015) — Occupation families 2142–2153 and 2512. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q028</summary>

**English**

**question:** What does an engineer actually do?

**answer:** Depending on the field, an engineer understands a need, designs or models a solution, builds or programs it, tests it and works with others to improve it.

**detail:** An engineer may understand a need, calculate or model a solution, make a design, build or program a prototype, test it, find faults, document results and work with others. A civil engineer might test materials or plan infrastructure; a software engineer might design, code and test a system.

**next:** Explore one field, then learn how to enter engineering.

**limit:** Personal fit and exact programmes remain conditional.

**Tamil draft — not human-approved**

**question:** ஒரு பொறியாளர் உண்மையில் என்ன வேலை செய்வார்?

**answer:** துறையைப் பொறுத்து ஒரு பொறியாளர் தேவையைப் புரிந்துகொண்டு, தீர்வை வடிவமைத்து அல்லது மாதிரி உருவாக்கி, கட்டி அல்லது நிரலாக்கி, சோதித்து, மற்றவர்களுடன் சேர்ந்து மேம்படுத்துவார்.

**detail:** தேவையைப் புரிந்துகொள்வது, கணக்கிடுவது அல்லது மாதிரி உருவாக்குவது, வடிவமைப்பது, கட்டுவது அல்லது நிரலாக்குவது, சோதிப்பது, பிழையைக் கண்டுபிடிப்பது, முடிவுகளைப் பதிவு செய்வது, குழுவுடன் பணிபுரிவது போன்றவை இருக்கலாம். உதாரணமாக, சிவில் பொறியாளர் கட்டுமானப் பொருட்களைச் சோதிக்கலாம்; மென்பொருள் பொறியாளர் ஒரு அமைப்பை வடிவமைத்து நிரலாக்கிச் சோதிக்கலாம்.

**next:** ஒரு துறையில் என்ன படிப்பீர்கள் என்று பாருங்கள்; அடுத்து அதில் சேரும் வழியை அறியுங்கள்.

**limit:** உங்களுக்கான பொருத்தமும் குறிப்பிட்ட படிப்பின் விவரங்களும் இன்னும் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q036; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q034 — A01

**Exact entry:** [Q034 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L327-L370). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q034` and `/journey/questions?lang=ta&id=Q034`.

**Ganesan checks:** F plus Check engineering study/work examples and marks-free next direction; no universal outcome.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E02 (**India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008`) — Printed pp.44–45 (viewer pp.50–51); E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q034</summary>

**English**

**question:** I want to study engineering, but where should I start?

**answer:** Begin by understanding the study and work in a field that interests you; you do not need to choose a college now.

**detail:** (No additional detail displayed.)

**next:** Explore one field, then learn how to enter engineering.

**limit:** Personal fit and exact programmes remain conditional.

**Tamil draft — not human-approved**

**question:** பொறியியல் படிக்க விரும்புகிறேன்; எங்கிருந்து தொடங்கலாம்?

**answer:** உங்களுக்கு ஆர்வமுள்ள துறையில் என்ன படிப்பும் வேலையும் இருக்கும் என்பதைப் புரிந்துகொள்வதில் தொடங்குங்கள்; இப்போதே கல்லூரியைத் தேர்வு செய்ய வேண்டியதில்லை.

**detail:** (No additional detail displayed.)

**next:** ஒரு துறையில் என்ன படிப்பீர்கள் என்று பாருங்கள்; அடுத்து அதில் சேரும் வழியை அறியுங்கள்.

**limit:** உங்களுக்கான பொருத்தமும் குறிப்பிட்ட படிப்பின் விவரங்களும் இன்னும் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q036; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q035 — A01

**Exact entry:** [Q035 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L373-L472). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q035` and `/journey/questions?lang=ta&id=Q035`.

**Ganesan checks:** F plus Check engineering study/work examples and marks-free next direction; no universal outcome.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E02 (**India Sudar Career Guidance Book — MAR/2025**, India Sudar Educational and Charitable Trust, 2025; repository `SRC008`) — Printed pp.44–45 (viewer pp.50–51); E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q035</summary>

**English**

**question:** What should I understand before choosing engineering?

**answer:** Understand that branches study different subjects; all require sustained learning and some mathematics; practical work may include labs, drawing, programming, workshops, projects or fieldwork; curricula differ across institutions; and a degree does not guarantee a job.

**detail:** First understand the field, then the admission route, and only later compare colleges.

**next:** Explore one field, then learn how to enter engineering.

**limit:** Personal fit and exact programmes remain conditional.

**Tamil draft — not human-approved**

**question:** பொறியியல் தேர்வு செய்யும் முன் எவற்றைப் புரிந்துகொள்ள வேண்டும்?

**answer:** பிரிவுகளின் பாடங்கள் வேறுபடும்; தொடர்ந்து கற்கவும் கணிதத்தைப் பயன்படுத்தவும் வேண்டும்; ஆய்வகம், வரைதல், நிரலாக்கம், பட்டறை, திட்டப்பணி அல்லது களப்பணி இருக்கலாம்; கல்லூரி மற்றும் பாடத்திட்டப் பதிப்பின்படி உள்ளடக்கம் மாறலாம்; பட்டம் மட்டும் வேலைக்கு உத்தரவாதம் அல்ல.

**detail:** முதலில் துறையைப் புரிந்துகொள்ளுங்கள்; அடுத்து சேர்க்கை வழியை அறியுங்கள்; பின்னர் கல்லூரிகளை ஒப்பிடுங்கள்.

**next:** ஒரு துறையில் என்ன படிப்பீர்கள் என்று பாருங்கள்; அடுத்து அதில் சேரும் வழியை அறியுங்கள்.

**limit:** உங்களுக்கான பொருத்தமும் குறிப்பிட்ட படிப்பின் விவரங்களும் இன்னும் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q036; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q030 — A02

**Exact entry:** [Q030 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L475-L567). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q030` and `/journey/questions?lang=ta&id=Q030`.

**Ganesan checks:** F plus Check maths/learning demands without aptitude verdict; no guaranteed suitability.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q030</summary>

**English**

**question:** Is engineering suitable for me?

**answer:** A reliable answer cannot come from one mark or interest.

**detail:** Try a small exploration: read the first-year and branch subjects, watch or try one related practical activity, and notice whether you are willing to keep learning when a problem is difficult. Also consider cost, study support and other courses. This helps you judge fit; it is not an aptitude test.

**next:** Look at one branch’s subjects and identify the learning support you can use.

**limit:** This is exploration, not an aptitude or eligibility decision.

**Tamil draft — not human-approved**

**question:** பொறியியல் எனக்கு ஏற்ற படிப்பா?

**answer:** ஒரு மதிப்பெண் அல்லது ஒரு ஆர்வத்தை மட்டும் வைத்து பொறியியல் உங்களுக்கு ஏற்றதா என்று முடிவு செய்ய முடியாது.

**detail:** முதல் ஆண்டு மற்றும் பிரிவு பாடங்களைப் பாருங்கள்; தொடர்புடைய ஒரு சிறிய செய்முறையை முயற்சி செய்யுங்கள்; கடினமான பிரச்சினை வந்தாலும் தொடர்ந்து கற்கத் தயாரா என்று கவனியுங்கள். செலவு, கற்றல் உதவி, மற்ற படிப்புகள் ஆகியவற்றையும் பாருங்கள். இது உங்களுக்கு பொருத்தமா என்று சிந்திக்க உதவும்; திறனறித் தீர்ப்பு அல்ல.

**next:** ஒரு பிரிவின் பாடங்களைப் பார்த்து, கற்க யாருடைய உதவி கிடைக்கும் என்று சிந்தியுங்கள்.

**limit:** இது சிந்திக்க உதவும் விளக்கம்; திறன் அல்லது சேர்க்கைத் தகுதித் தீர்ப்பு அல்ல.

</details>

**Navigation:** next question Q047; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q031 — A02

**Exact entry:** [Q031 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L570-L662). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q031` and `/journey/questions?lang=ta&id=Q031`.

**Ganesan checks:** F plus Check maths/learning demands without aptitude verdict; no guaranteed suitability.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q031</summary>

**English**

**question:** Do I need to be very strong in Maths to study engineering?

**answer:** You do not need to arrive knowing all engineering mathematics, but mathematics is a continuing part of the course.

**detail:** The reviewed curricula include calculus and later branch-specific topics such as linear algebra, probability, statistics or differential equations. If maths worries you, identify the weak topic, revise Class 11–12 foundations, practise regularly and use teacher/peer support. Difficulty now is not a verdict that you cannot study engineering.

**next:** Look at one branch’s subjects and identify the learning support you can use.

**limit:** This is exploration, not an aptitude or eligibility decision.

**Tamil draft — not human-approved**

**question:** பொறியியல் படிக்க கணிதத்தில் மிகவும் வலுவாக இருக்க வேண்டுமா?

**answer:** பொறியியலில் சேரும் முன்பே எல்லா உயர்நிலை கணிதமும் தெரிந்திருக்க வேண்டியதில்லை.

**detail:** படிப்பு முழுவதும் கணிதம் இருக்கும். ஆய்வு செய்த பாடத்திட்டங்களில் நுண்கணிதம், நேரியல் இயற்கணிதம், நிகழ்தகவு, புள்ளியியல், வகைக்கெழுச் சமன்பாடுகள் போன்ற பகுதிகள் உள்ளன. சிரமமான பகுதியைக் கண்டறிந்து 11–12 ஆம் வகுப்பு அடிப்படைகளை மீண்டும் படித்து, தொடர்ந்து பயிற்சி செய்து ஆசிரியர் அல்லது நண்பரின் உதவியைப் பெறுங்கள். இப்போது சிரமம் இருப்பது “பொறியியல் முடியாது” என்ற தீர்ப்பு அல்ல.

**next:** ஒரு பிரிவின் பாடங்களைப் பார்த்து, கற்க யாருடைய உதவி கிடைக்கும் என்று சிந்தியுங்கள்.

**limit:** இது சிந்திக்க உதவும் விளக்கம்; திறன் அல்லது சேர்க்கைத் தகுதித் தீர்ப்பு அல்ல.

</details>

**Navigation:** next question Q047; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q032 — A02

**Exact entry:** [Q032 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L665-L757). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q032` and `/journey/questions?lang=ta&id=Q032`.

**Ganesan checks:** F plus Check maths/learning demands without aptitude verdict; no guaranteed suitability.

**Source references / applicable year:** E01 (**Engineering and Technology career stream**, Tamil Nadu School Education career-guidance portal / Naan Mudhalvan, current page; repository `SRC006`) — Engineering skills and specialisations; E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q032</summary>

**English**

**question:** What skills or interests are useful for engineering?

**answer:** Useful starting qualities include curiosity about how things work, willingness to break a problem into steps, careful observation, basic numerical reasoning, patience in testing and correcting mistakes, communication and teamwork.

**detail:** Programming, drawing or workshop experience can help in some branches, but students can learn them during the course.

**next:** Look at one branch’s subjects and identify the learning support you can use.

**limit:** This is exploration, not an aptitude or eligibility decision.

**Tamil draft — not human-approved**

**question:** பொறியியல் படிக்க எந்தத் திறன்களும் ஆர்வங்களும் உதவும்?

**answer:** பொருட்கள் எப்படி இயங்குகின்றன என்ற ஆர்வம், பிரச்சினையைச் சிறு படிகளாகப் பிரித்தல், கவனமாகப் பார்ப்பது, அடிப்படை எண் சிந்தனை, தவறைத் திருத்தும் பொறுமை, தொடர்பு மற்றும் குழுப்பணி உதவும்.

**detail:** சில பிரிவுகளில் நிரலாக்கம், வரைதல் அல்லது பட்டறை அனுபவம் உதவும்; அவற்றை படிப்பின்போதும் கற்கலாம்.

**next:** ஒரு பிரிவின் பாடங்களைப் பார்த்து, கற்க யாருடைய உதவி கிடைக்கும் என்று சிந்தியுங்கள்.

**limit:** இது சிந்திக்க உதவும் விளக்கம்; திறன் அல்லது சேர்க்கைத் தகுதித் தீர்ப்பு அல்ல.

</details>

**Navigation:** next question Q047; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q029 — A03

**Exact entry:** [Q029 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L760-L859). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q029` and `/journey/questions?lang=ta&id=Q029`.

**Ganesan checks:** F plus Keep the B.Sc. example and other-course options scoped; no personal eligibility.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E12 (**B.Sc. Physics**, Bharathiar University, affiliated colleges, 2023–24 onwards, 2023) — Programme structure and theory/practical papers; E13 (**Career Options After +2**, Tamil Nadu Department of Employment and Training, 2025/26 publication) — Course-family map: entrance exams; medical/allied health; arts/science; commerce/management; design; law; teacher education; diploma/certificate options; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q029</summary>

**English**

**question:** How is engineering different from a science degree?

**answer:** Engineering programmes generally use science and mathematics to design and test practical systems and include engineering labs, design/project work and an internship or project.

**detail:** A science degree studies a scientific subject in greater disciplinary depth and can also include theory and laboratory work. For example, Anna University engineering curricula combine mathematics/science with programme design, labs and projects, while Bharathiar University’s B.Sc. Physics is organised around physics and its practical papers. This is an illustrative comparison, not a rule for every university: compare the exact two curricula before choosing.

**next:** Compare one engineering course and one alternative: subjects, practical work, entry route, time and cost.

**limit:** Course eligibility and current admission terms need the relevant official source.

**Tamil draft — not human-approved**

**question:** பொறியியல் படிப்பும் அறிவியல் பட்டப்படிப்பும் எப்படி வேறுபடுகின்றன?

**answer:** பொதுவாக பொறியியல் படிப்புகள் அறிவியல் மற்றும் கணிதத்தைப் பயன்படுத்தி நடைமுறை அமைப்புகளை வடிவமைத்து சோதிக்க கற்பிக்கின்றன; ஆய்வகம், வடிவமைப்பு, திட்டப்பணி, பணிப்பயிற்சி ஆகியவை இருக்கும்.

**detail:** அறிவியல் பட்டப்படிப்பு ஒரு அறிவியல் துறையை ஆழமாகப் படிக்கும்; அதிலும் கருத்தியலும் செய்முறையும் இருக்கலாம். உதாரணமாக அண்ணா பல்கலைக்கழகப் பொறியியல் பாடத்திட்டங்களில் கணிதம்/அறிவியலுடன் வடிவமைப்பு, ஆய்வகம், திட்டப்பணி உள்ளன; பாரதியார் பல்கலைக்கழக இயற்பியல் பட்டப்படிப்பு இயற்பியல் பாடங்களையும் செய்முறைகளையும் மையமாகக் கொண்டுள்ளது. இது எல்லாப் பல்கலைக்கழகங்களுக்கும் ஒரே விதி அல்ல; நீங்கள் பார்க்கும் இரண்டு பாடத்திட்டங்களையே ஒப்பிடுங்கள்.

**next:** ஒரு பொறியியல் படிப்பையும் வேறு ஒரு படிப்பையும் பாடங்கள், செய்முறை, சேர்க்கைவழி, காலம், செலவு வைத்து ஒப்பிடுங்கள்.

**limit:** ஒவ்வொரு படிப்பின் தகுதியையும் அன்றைய சேர்க்கை விதிகளையும் அதன் அதிகாரப்பூர்வ ஆதாரத்தில் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q033 — A03

**Exact entry:** [Q033 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L862-L905). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q033` and `/journey/questions?lang=ta&id=Q033`.

**Ganesan checks:** F plus Keep the B.Sc. example and other-course options scoped; no personal eligibility.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E12 (**B.Sc. Physics**, Bharathiar University, affiliated colleges, 2023–24 onwards, 2023) — Programme structure and theory/practical papers; E13 (**Career Options After +2**, Tamil Nadu Department of Employment and Training, 2025/26 publication) — Course-family map: entrance exams; medical/allied health; arts/science; commerce/management; design; law; teacher education; diploma/certificate options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q033</summary>

**English**

**question:** What are my options after 12th if I do not choose engineering?

**answer:** Options can include arts and science, commerce, management, law, design, architecture, health, agriculture, teacher education, hospitality, diploma or skill programmes, depending on your subjects and the applicable eligibility rules.

**detail:** Depending on your Class 12 subjects, interests and current eligibility rules, options can include arts and science degrees, commerce/management, law, design, architecture, medicine and allied health, agriculture, teacher education, hotel/tourism programmes, diploma/polytechnic, ITI or other skill programmes. The Tamil Nadu Department of Employment and Training’s official “Career Options After +2” guide maps these families. First shortlist a field, then verify its current eligibility, entrance route, duration, fees and recognised institutions from the relevant official authority.

**next:** Compare one engineering course and one alternative: subjects, practical work, entry route, time and cost.

**limit:** Course eligibility and current admission terms need the relevant official source.

**Tamil draft — not human-approved**

**question:** பொறியியல் தேர்வு செய்யாவிட்டால் 12 ஆம் வகுப்புக்குப் பிறகு வேறு என்ன படிக்கலாம்?

**answer:** உங்கள் பாடங்களையும் பொருந்தும் தகுதியையும் பொறுத்து கலை/அறிவியல், வணிகம், மேலாண்மை, சட்டம், வடிவமைப்பு, கட்டடக்கலை, உடல்நலம், வேளாண்மை, ஆசிரியர் கல்வி, உணவு/விடுதி மேலாண்மை, டிப்ளமோ அல்லது திறன் படிப்புகள் இருக்கலாம்.

**detail:** தமிழ்நாடு வேலைவாய்ப்பு மற்றும் பயிற்சித் துறையின் 12 ஆம் வகுப்புக்குப் பிந்தைய படிப்பு வழிகாட்டி இந்தப் பெரிய வழிகளைச் சுட்டுகிறது. மருத்துவம்/துணை மருத்துவம், சுற்றுலா, தொழிற்பயிற்சி போன்ற வழிகளுக்கும் தனித் தேவைகள் உள்ளன. முதலில் ஆர்வமுள்ள துறையைப் பார்த்து, அதன் தற்போதைய தகுதி, நுழைவுவழி, காலம், கட்டணம், அங்கீகரிக்கப்பட்ட நிறுவனங்களை அதிகாரப்பூர்வ ஆதாரத்தில் சரிபாருங்கள்.

**next:** ஒரு பொறியியல் படிப்பையும் வேறு ஒரு படிப்பையும் பாடங்கள், செய்முறை, சேர்க்கைவழி, காலம், செலவு வைத்து ஒப்பிடுங்கள்.

**limit:** ஒவ்வொரு படிப்பின் தகுதியையும் அன்றைய சேர்க்கை விதிகளையும் அதன் அதிகாரப்பூர்வ ஆதாரத்தில் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q036 — A04

**Exact entry:** [Q036 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L908-L937). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q036` and `/journey/questions?lang=ta&id=Q036`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q036</summary>

**English**

**question:** What are the main engineering departments or branches?

**answer:** A useful first map is: computing (CSE, IT, AI/data); electronics and communication (ECE); electrical power and machines (EEE); machines, design and manufacturing (Mechanical); buildings and infrastructure (Civil); plus chemical, biotechnology, food, agriculture, textile, aeronautical and other specialist branches.

**detail:** This is a map, not a ranking.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** பொறியியலின் முக்கியப் பாடப்பிரிவுகள் எவை?

**answer:** முக்கியத் துறைகளின் அறிமுகம்: கணினி சார்ந்த CSE/IT/AI; மின்னணு மற்றும் தகவல் தொடர்பு ECE; மின்சக்தி மற்றும் மின் இயந்திரங்கள் EEE; இயந்திரம்/வடிவமைப்பு/உற்பத்தி; கட்டடங்கள்/அடிப்படை வசதிகள். வேதியியல், உயிரித் தொழில்நுட்பம், உணவு, வேளாண்மை, துணிநுட்பம், வானூர்தி போன்ற சிறப்புத் துறைகளும் உள்ளன.

**detail:** இது அறிமுக வரைபடம்; தரவரிசை அல்ல.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q037 — A04

**Exact entry:** [Q037 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L940-L976). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q037` and `/journey/questions?lang=ta&id=Q037`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q037</summary>

**English**

**question:** What is Computer Science and Engineering (CSE)?

**answer:** CSE studies how computing systems and software work.

**detail:** In the reviewed curriculum, examples include C programming, computer organisation, data structures, object-oriented programming, operating systems, algorithms, databases, networks, AI/ML and full-stack development. Practical work includes programming, lab-integrated courses and a final project/internship.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** கணினி அறிவியல் மற்றும் பொறியியல் (CSE) என்றால் என்ன?

**answer:** CSE கணினி அமைப்புகளும் மென்பொருளும் எப்படி இயங்குகின்றன என்பதைப் படிக்கும்.

**detail:** உதாரணப் பாடங்கள்: C மொழி நிரலாக்கம், கணினி அமைப்பு, தரவுக் கட்டமைப்புகள், பொருள்நோக்கு நிரலாக்கம், இயக்க முறைமைகள், படிமுறைகள், தரவுத்தளங்கள், வலையமைப்புகள், செயற்கை நுண்ணறிவு/இயந்திரக் கற்றல், முழுமையான இணையச் செயலி உருவாக்கம். நிரலாக்க ஆய்வகம், பாடத்துடன் இணைந்த செய்முறை, இறுதித் திட்டம்/பணிப்பயிற்சி போன்றவை உள்ளன.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q038 — A04

**Exact entry:** [Q038 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L979-L1015). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q038` and `/journey/questions?lang=ta&id=Q038`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q038</summary>

**English**

**question:** What is Information Technology (IT)?

**answer:** IT focuses on building, using and managing software and information systems.

**detail:** Its reviewed curriculum overlaps strongly with CSE—programming, data structures, databases, operating systems, networks, machine learning and web/full-stack work—and also names IT essentials and web technologies. The exact difference is curriculum-specific, not decided by the label alone.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** தகவல் தொழில்நுட்பம் (IT) என்றால் என்ன?

**answer:** IT மென்பொருள் மற்றும் தகவல் அமைப்புகளை உருவாக்குவது, பயன்படுத்துவது, நிர்வகிப்பது ஆகியவற்றில் கவனம் செலுத்தும்.

**detail:** நிரலாக்கம், தரவுக் கட்டமைப்புகள், தரவுத்தளங்கள், இயக்க முறைமைகள், வலையமைப்புகள், இயந்திரக் கற்றல், இணையச் செயலிப் பணிகள் CSE-யுடன் அதிகம் ஒத்துள்ளன. தகவல் தொழில்நுட்ப அடிப்படைகள், இணையத் தொழில்நுட்பங்கள் போன்ற பெயரிட்ட கவனங்களும் உள்ளன. துல்லிய வேறுபாடு பாடத்திட்டத்தைப் பொறுத்தது.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q039 — A04

**Exact entry:** [Q039 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1018-L1054). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q039` and `/journey/questions?lang=ta&id=Q039`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q039</summary>

**English**

**question:** What is Electronics and Communication Engineering (ECE)?

**answer:** ECE combines electronics, signals and communication systems.

**detail:** Example subjects include electronic devices, circuits, signals, digital design, analog/digital communication, microcontrollers, signal processing, VLSI and embedded/IoT systems. It also includes programming and data structures. Practical work includes circuits, communication, microcontroller and electronics labs.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** மின்னணு மற்றும் தகவல் தொடர்புப் பொறியியல் (ECE) என்றால் என்ன?

**answer:** ECE மின்னணு, சமிக்ஞைகள், தகவல் தொடர்பு அமைப்புகளை இணைத்துப் படிக்கும் பிரிவு.

**detail:** மின்னணுச் சாதனங்கள், மின்சுற்றுகள், சமிக்ஞைகள், எண்ம வடிவமைப்பு, தகவல் தொடர்பு, நுண்கட்டுப்படுத்திகள், சமிக்ஞைச் செயலாக்கம், ஒருங்கிணைந்த மின்சுற்று வடிவமைப்பு, சாதனத்துக்குள் செயல்படும் கணினி அமைப்புகள் போன்ற பாடங்கள் உள்ளன. மின்சுற்று/தகவல் தொடர்பு/நுண்கட்டுப்படுத்தி ஆய்வகங்களுடன் நிரலாக்கமும் தரவுக் கட்டமைப்புகளும் உள்ளன.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q040 — A04

**Exact entry:** [Q040 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1057-L1093). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q040` and `/journey/questions?lang=ta&id=Q040`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q040</summary>

**English**

**question:** What is Electrical and Electronics Engineering (EEE)?

**answer:** EEE focuses on electrical circuits, machines, power systems, control and power electronics, while also covering electronics and computing.

**detail:** Example subjects include circuit analysis, electrical machines, transmission/distribution, control, measurements, protection, microcontrollers and high-voltage engineering. Practical work includes machines, circuits, control/instrumentation, power-electronics and power-system labs.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** மின் மற்றும் மின்னணுப் பொறியியல் (EEE) என்றால் என்ன?

**answer:** EEE மின்சுற்றுகள், மின் இயந்திரங்கள், மின்சக்தி அமைப்புகள், கட்டுப்பாடு, மின்சக்தி மின்னணுவியலை மையமாகக் கொண்டது; மின்னணுவும் கணினிப் பகுதிகளும் இருக்கும்.

**detail:** மின்சுற்றுப் பகுப்பாய்வு, மின் இயந்திரங்கள், மின்சாரக் கடத்தல்/விநியோகம், கட்டுப்பாடு, அளவீடு, பாதுகாப்பு, நுண்கட்டுப்படுத்திகள், உயர் மின்னழுத்தம் போன்ற பாடங்களும் தொடர்புடைய ஆய்வகங்களும் உள்ளன.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q041 — A04

**Exact entry:** [Q041 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1096-L1132). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q041` and `/journey/questions?lang=ta&id=Q041`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q041</summary>

**English**

**question:** What is Mechanical Engineering?

**answer:** Mechanical studies machines, motion, forces, heat, materials, design and manufacturing.

**detail:** Examples include mechanics, thermodynamics, strength of materials, machine dynamics, fluid mechanics, manufacturing, machine design, heat transfer and computer-aided modelling. Practical work includes makerspace, manufacturing, measurement, modelling and project/internship work.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** இயந்திரப் பொறியியல் என்றால் என்ன?

**answer:** இயந்திரப் பொறியியல் இயந்திரங்கள், இயக்கம், விசை, வெப்பம், பொருட்கள், வடிவமைப்பு, உற்பத்தி ஆகியவற்றைப் படிக்கும்.

**detail:** பொருட்களின் இயக்கம், வெப்ப இயக்கவியல், பொருட்களின் வலிமை, இயந்திர இயக்கம், திரவங்கள், உற்பத்தி, இயந்திர வடிவமைப்பு, வெப்பப் பரிமாற்றம், கணினி உதவியுடன் மாதிரி உருவாக்கம் போன்ற பாடங்கள் உள்ளன. உருவாக்கப் பட்டறை, உற்பத்தி, அளவீடு, மாதிரி/திட்டப்பணி, பணிப்பயிற்சி போன்ற செய்முறைகளும் உள்ளன.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q042 — A04

**Exact entry:** [Q042 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1135-L1171). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q042` and `/journey/questions?lang=ta&id=Q042`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q042</summary>

**English**

**question:** What is Civil Engineering?

**answer:** Civil studies the built environment and infrastructure.

**detail:** Examples include surveying, fluid mechanics, geology, structural analysis, soil mechanics, concrete, water supply, highways, foundations, wastewater, and concrete/steel design. Practical work includes surveying, materials, fluids, soil, environmental and drawing labs, plus field/project work.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** கட்டடவியல் பொறியியல் என்றால் என்ன?

**answer:** கட்டடவியல் பொறியியல் கட்டடங்களையும் அடிப்படை வசதி அமைப்புகளையும் படிக்கும் பிரிவு.

**detail:** நில அளவை, திரவ இயக்கவியல், நிலவியல், கட்டமைப்புப் பகுப்பாய்வு, மண், கான்கிரீட், குடிநீர், சாலை, அடித்தளம், கழிவுநீர், கான்கிரீட்/எஃகு வடிவமைப்பு போன்ற பாடங்கள் உள்ளன. நில அளவை, பொருட்கள், மண், சுற்றுச்சூழல், வரைதல் ஆய்வகங்களும் கள/திட்டப்பணிகளும் உள்ளன.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q043 — A04

**Exact entry:** [Q043 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1174-L1217). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q043` and `/journey/questions?lang=ta&id=Q043`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q043</summary>

**English**

**question:** What are AI & Data Science and AI & Machine Learning branches?

**answer:** Both are computing programmes with programming, data structures, algorithms, databases and maths.

**detail:** In the same reviewed regulation, AI & Data Science places named emphasis on Python for data science, exploratory data analysis, probability/statistics, data privacy, machine learning, NLP and data-oriented systems. CSE (AI & ML) keeps a CSE base—software engineering, operating systems, compiler design, databases and networks—then adds Python for data science, AI, big-data analytics, machine learning, deep learning and an AI engineering lab. They overlap; neither title alone proves a better course or career.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** செயற்கை நுண்ணறிவு மற்றும் தரவு அறிவியல், செயற்கை நுண்ணறிவு மற்றும் இயந்திரக் கற்றல் பிரிவுகள் என்றால் என்ன?

**answer:** AI & Data Science, AI & ML இரண்டும் நிரலாக்கம், தரவுக் கட்டமைப்புகள், படிமுறைகள், தரவுத்தளங்கள், கணிதம் உள்ள கணினிப் படிப்புகள். AI என்பது செயற்கை நுண்ணறிவு; ML என்பது இயந்திரக் கற்றல்.

**detail:** ஒரே பாடத்திட்ட விதிமுறையில் AI & DS தரவுப் பகுப்பாய்வு, நிகழ்தகவு/புள்ளியியல், தரவு தனியுரிமை, இயந்திரக் கற்றல், மனித மொழியை கணினி கையாளுதல், தரவு அமைப்புகளை மையப்படுத்துகிறது. CSE (AI & ML) மென்பொருள் பொறியியல், இயக்க முறைமைகள், நிரல் மொழிமாற்றி வடிவமைப்பு, தரவுத்தளங்கள், வலையமைப்புகள் போன்ற அடிப்படையுடன் செயற்கை நுண்ணறிவு, பெருந்தரவுப் பகுப்பாய்வு, இயந்திர/ஆழக் கற்றல், ஆய்வகத்தைச் சேர்க்கிறது. பெயர் மட்டும் எது சிறந்தது என்று நிரூபிக்காது.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q044 — A04

**Exact entry:** [Q044 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1220-L1305). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q044` and `/journey/questions?lang=ta&id=Q044`.

**Ganesan checks:** F plus Match named programme, regulation and practical examples; no universal institution claim.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q044</summary>

**English**

**question:** What will I study in each engineering branch?

**answer:** The subjects depend on the branch: computing includes programming and systems; ECE includes circuits and communication; EEE includes power and machines; Mechanical includes design and manufacturing; Civil includes structures, soil and water.

**detail:** Check semesters, core subjects, laboratory-integrated courses, electives, project/internship, and whether the college is autonomous. Do not assume a syllabus from a similar branch name.

**next:** Explore a related field, then check the exact college’s curriculum and admission route.

**limit:** Examples use Anna University affiliated non-autonomous R2025 Revised 1 (2026) curricula; other institutions may differ.

**Tamil draft — not human-approved**

**question:** ஒவ்வொரு பொறியியல் பிரிவிலும் என்ன படிப்பேன்?

**answer:** பிரிவைப் பொறுத்து பாடங்கள் மாறும்: கணினிப் பிரிவுகளில் நிரலாக்கமும் கணினி அமைப்புகளும்; ECE-இல் மின்சுற்றும் தகவல் தொடர்பும்; EEE-இல் மின்சக்தியும் மின் இயந்திரங்களும்; இயந்திரப் பொறியியலில் வடிவமைப்பும் உற்பத்தியும்; கட்டடவியலில் கட்டமைப்பு, மண், நீர் சார்ந்த பாடங்களும் உள்ளன.

**detail:** குறிப்பிட்ட கல்லூரியின் சரியான பாடத்திட்டப் பதிப்பைப் பாருங்கள்: பருவங்கள், முதன்மைப் பாடங்கள், ஆய்வகங்கள், விருப்பப் பாடங்கள், திட்டப்பணி/பணிப்பயிற்சி, கல்லூரி தன்னாட்சி பெற்றதா என்பவற்றைச் சரிபாருங்கள். ஒத்த பெயரை வைத்து பாடத்திட்டத்தை ஊகிக்காதீர்கள்.

**next:** தொடர்புள்ள இன்னொரு துறையைப் பாருங்கள்; பின்னர் குறிப்பிட்ட கல்லூரியின் பாடத்திட்டத்தையும் சேர்க்கைவழியையும் சரிபாருங்கள்.

**limit:** உதாரணங்கள் அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத கல்லூரிகளின் R2025 திருத்தம் 1 (2026) பாடத்திட்டத்திலிருந்து. மற்ற நிறுவனங்களில் மாறலாம்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q010 — A05

**Exact entry:** [Q010 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1308-L1351). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q010` and `/journey/questions?lang=ta&id=Q010`.

**Ganesan checks:** F plus Preserve exact comparison subjects and scoped curriculum differences; similar cutoffs do not prove curriculum identity.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q010</summary>

**English**

**question:** CSE vs AI & Data Science --- which should I choose in TNEA?

**answer:** Consider CSE for broad computing exploration, or AI & Data Science if you want sustained data/AI study; compare the actual curricula before choosing through TNEA.

**detail:** In the reviewed pair, CSE gives the broader named computing base across systems, software, algorithms, databases and networks, with AI/ML included. AI & DS shares that base but makes data analysis, statistics, privacy, machine learning, NLP and data systems more central. Prefer CSE if you want broader computing exploration; consider AI & DS if you already want sustained data/AI study. Before choosing, compare the target colleges’ actual syllabus, labs, faculty/support and cost. This is guidance, not a personal verdict.

**next:** Compare the named programmes’ subjects and practical work at the colleges you are considering, then check admission requirements.

**limit:** Comparison is limited to the reviewed Anna University affiliated non-autonomous R2025 Revised 1 curricula; it is not a ranking or employment promise.

**Tamil draft — not human-approved**

**question:** TNEA-வில் CSE அல்லது AI & Data Science — எதைத் தேர்வு செய்யலாம்?

**answer:** பரந்த கணினித் துறையை ஆராய விரும்பினால் CSE-யையும், தரவு மற்றும் செயற்கை நுண்ணறிவில் தொடர்ந்து படிக்க விரும்பினால் AI & Data Science-ஐயும் கவனியுங்கள். TNEA-வில் தேர்வு செய்வதற்கு முன் உண்மையான பாடத்திட்டங்களை ஒப்பிடுங்கள்.

**detail:** ஆய்வு செய்த CSE பாடத்திட்டம் கணினி அமைப்புகள், மென்பொருள், படிமுறைகள், தரவுத்தளங்கள், வலையமைப்புகள், செயற்கை நுண்ணறிவு/இயந்திரக் கற்றலை உள்ளடக்குகிறது. AI & DS பல பொதுப் பாடங்களுடன் தரவுப் பகுப்பாய்வு, புள்ளியியல், தனியுரிமை, இயந்திரக் கற்றல், மனித மொழிச் செயலாக்கம், தரவு அமைப்புகளை மையப்படுத்துகிறது. கல்லூரியின் பாடத்திட்டம், ஆய்வகங்கள், ஆசிரியர்/கற்றல் உதவி, செலவை ஒப்பிடுங்கள்; இது உங்களுக்கான இறுதித் தீர்ப்பு அல்ல.

**next:** நீங்கள் பார்க்கும் கல்லூரிகளில் இந்தப் பிரிவுகளின் பாடங்களையும் செய்முறைகளையும் ஒப்பிடுங்கள்; பின்னர் சேர்க்கைத் தேவைகளை அறியுங்கள்.

**limit:** ஒப்பீடு ஆய்வு செய்த அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத R2025 திருத்தம் 1 பாடத்திட்டங்களுக்கு மட்டுமே. இது தரவரிசையோ வேலை உறுதியோ அல்ல.

</details>

**Navigation:** next question Q050; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q011 — A05

**Exact entry:** [Q011 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1354-L1404). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q011` and `/journey/questions?lang=ta&id=Q011`.

**Ganesan checks:** F plus Preserve exact comparison subjects and scoped curriculum differences; similar cutoffs do not prove curriculum identity.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E14 (**TNEA Cutoff Portal**, Government of Tamil Nadu / Directorate of Technical Education, records 2021–2025) — Search by year, college, programme and applicable admission dimensions. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q011</summary>

**English**

**question:** Is IT very different from CSE? The cutoffs look similar.

**answer:** In the equivalent reviewed curricula, IT and CSE overlap substantially in programming, databases, systems and networks, but they are not identical. Similar cutoffs do not establish similar curricula.

**detail:** CSE names more computer organisation, algorithms and core computing theory; IT names IT essentials, web technologies and information-system application. Similar historical cutoffs do **not** make curricula identical; admission demand and curriculum content are separate facts.

**next:** Compare the named programmes’ subjects and practical work at the colleges you are considering, then check admission requirements.

**limit:** Comparison is limited to the reviewed Anna University affiliated non-autonomous R2025 Revised 1 curricula; it is not a ranking or employment promise.

**Tamil draft — not human-approved**

**question:** IT-க்கும் CSE-க்கும் நிறைய வேறுபாடு உள்ளதா? கட்-ஆஃப் மதிப்பெண்கள் ஒரே மாதிரி தெரிகின்றன.

**answer:** ஆய்வு செய்த ஒரே விதிமுறைப் பாடத்திட்டங்களில் IT-க்கும் CSE-க்கும் பல பொதுப் பாடங்கள் உள்ளன; ஆனால் ஒரே படிப்பு அல்ல. கட்-ஆஃப் ஒத்திருப்பதால் பாடத்திட்டமும் ஒன்றே என்று சொல்ல முடியாது.

**detail:** CSE கணினி அமைப்பு, படிமுறைகள், அடிப்படைக் கணினிக் கருத்தியலை அதிகம் பெயரிடுகிறது; IT தகவல் தொழில்நுட்ப அடிப்படை, இணையத் தொழில்நுட்பம், தகவல் அமைப்புப் பயன்பாடுகளைப் பெயரிடுகிறது. சேர்க்கை மதிப்பெண் பதிவும் பாடத்திட்ட உள்ளடக்கமும் தனித்தனி தகவல்கள்.

**next:** நீங்கள் பார்க்கும் கல்லூரிகளில் இந்தப் பிரிவுகளின் பாடங்களையும் செய்முறைகளையும் ஒப்பிடுங்கள்; பின்னர் சேர்க்கைத் தேவைகளை அறியுங்கள்.

**limit:** ஒப்பீடு ஆய்வு செய்த அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத R2025 திருத்தம் 1 பாடத்திட்டங்களுக்கு மட்டுமே. இது தரவரிசையோ வேலை உறுதியோ அல்ல.

</details>

**Navigation:** next question Q050; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q049 — A05

**Exact entry:** [Q049 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1407-L1464). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q049` and `/journey/questions?lang=ta&id=Q049`.

**Ganesan checks:** F plus Preserve exact comparison subjects and scoped curriculum differences; similar cutoffs do not prove curriculum identity.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q049</summary>

**English**

**question:** How different are CSE, IT, AI & Data Science and AI & ML?

**answer:** In the reviewed curricula, CSE provides a broad computing foundation; IT emphasises web/information systems; AI & Data Science emphasises data analysis and statistics with AI; CSE (AI & ML) combines a CSE base with more AI/ML study.

**detail:** All four share programming and substantial computing material. The reviewed AI & ML example is specifically CSE (AI & ML), not proof about every programme with a similar name. Compare the exact institution and regulation; these are study differences, not separate job guarantees.

**next:** Compare the named programmes’ subjects and practical work at the colleges you are considering, then check admission requirements.

**limit:** Comparison is limited to the reviewed Anna University affiliated non-autonomous R2025 Revised 1 curricula; it is not a ranking or employment promise.

**Tamil draft — not human-approved**

**question:** CSE, IT, AI & Data Science, AI & ML — இந்த நான்கும் எப்படி வேறுபடுகின்றன?

**answer:** ஆய்வு செய்த பாடத்திட்டங்களில் CSE பரந்த கணினி அடிப்படையைக் கொண்டது; IT இணையம் மற்றும் தகவல் அமைப்புகளை வலியுறுத்துகிறது; AI & Data Science தரவுப் பகுப்பாய்வு, புள்ளியியல், செயற்கை நுண்ணறிவை மையப்படுத்துகிறது; CSE (AI & ML) கணினி அடிப்படையுடன் செயற்கை நுண்ணறிவு மற்றும் இயந்திரக் கற்றலில் கூடுதல் கவனம் செலுத்துகிறது.

**detail:** நான்கிலும் நிரலாக்கமும் பல பொதுப் பாடங்களும் உள்ளன. இங்கு AI & ML-க்கான உதாரணம் குறிப்பாக CSE (AI & ML) பாடத்திட்டம்; ஒத்த பெயருள்ள எல்லாப் படிப்புகளுக்கும் இதையே பொருத்த முடியாது. கல்லூரி மற்றும் பாடத்திட்டப் பதிப்பைச் சரிபாருங்கள். இவை படிப்பு வேறுபாடுகள்; தனித்தனி வேலை உத்தரவாதங்கள் அல்ல.

**next:** நீங்கள் பார்க்கும் கல்லூரிகளில் இந்தப் பிரிவுகளின் பாடங்களையும் செய்முறைகளையும் ஒப்பிடுங்கள்; பின்னர் சேர்க்கைத் தேவைகளை அறியுங்கள்.

**limit:** ஒப்பீடு ஆய்வு செய்த அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத R2025 திருத்தம் 1 பாடத்திட்டங்களுக்கு மட்டுமே. இது தரவரிசையோ வேலை உறுதியோ அல்ல.

</details>

**Navigation:** next question Q050; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q050 — A05

**Exact entry:** [Q050 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1467-L1496). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q050` and `/journey/questions?lang=ta&id=Q050`.

**Ganesan checks:** F plus Preserve exact comparison subjects and scoped curriculum differences; similar cutoffs do not prove curriculum identity.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q050</summary>

**English**

**question:** What should I check in a branch curriculum before choosing it?

**answer:** Check: applicable regulation/year; core subjects by semester; lab or lab-integrated hours; maths/statistics load; programming/drawing/workshop/fieldwork; electives; internship/project; prerequisites; and whether the curriculum belongs to that exact institution.

**detail:** Write down what attracts or concerns you.

**next:** Compare the named programmes’ subjects and practical work at the colleges you are considering, then check admission requirements.

**limit:** Comparison is limited to the reviewed Anna University affiliated non-autonomous R2025 Revised 1 curricula; it is not a ranking or employment promise.

**Tamil draft — not human-approved**

**question:** ஒரு பிரிவைத் தேர்வு செய்யும் முன் அதன் பாடத்திட்டத்தில் என்ன பார்க்க வேண்டும்?

**answer:** பாடத்திட்ட ஆண்டு/பதிப்பு, ஒவ்வொரு பருவத்தின் முதன்மைப் பாடங்கள், ஆய்வக நேரம், கணிதம்/புள்ளியியல், நிரலாக்கம்/வரைதல்/பட்டறை/களப்பணி, விருப்பப் பாடங்கள், திட்டம்/பணிப்பயிற்சி, முன்தேவைகள், அந்தக் கல்லூரிக்குப் பொருந்துகிறதா என்பவற்றைப் பாருங்கள்.

**detail:** பிடித்ததும் கவலையளிப்பதும் தனியாக எழுதுங்கள்.

**next:** நீங்கள் பார்க்கும் கல்லூரிகளில் இந்தப் பிரிவுகளின் பாடங்களையும் செய்முறைகளையும் ஒப்பிடுங்கள்; பின்னர் சேர்க்கைத் தேவைகளை அறியுங்கள்.

**limit:** ஒப்பீடு ஆய்வு செய்த அண்ணா பல்கலைக்கழக இணைப்பு பெற்ற, தன்னாட்சி இல்லாத R2025 திருத்தம் 1 பாடத்திட்டங்களுக்கு மட்டுமே. இது தரவரிசையோ வேலை உறுதியோ அல்ல.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q012 — A06

**Exact entry:** [Q012 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1499-L1542). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q012` and `/journey/questions?lang=ta&id=Q012`.

**Ganesan checks:** F plus No branch ranking, job promise or inferred admission difficulty; Q021 requires matched historical evidence.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q012</summary>

**English**

**question:** Everyone's running to CSE. Is Mechanical or Civil still worth taking?

**answer:** Mechanical or Civil can be worth exploring if their study and practical work interest you and the college supports that learning; CSE’s popularity alone is not a reason to reject them.

**detail:** They are worth exploring if that study and practical work interest you and the target college supports it. Do not choose them merely as a fallback, and do not reject them merely because CSE is popular. No branch or degree guarantees employment.

**next:** Compare the study activities you prefer; keep admission feasibility separate from interest.

**limit:** No aptitude, placement or admission outcome can be inferred.

**Tamil draft — not human-approved**

**question:** எல்லோரும் CSE-ஐ நோக்கிச் செல்கிறார்கள். இயந்திரப் பொறியியல் அல்லது கட்டடவியல் இன்னும் தேர்வு செய்யத் தகுந்ததா?

**answer:** அந்தப் பாடங்களும் செய்முறைகளும் உங்களுக்கு ஆர்வமளித்து, கல்லூரியில் உரிய கற்றல் உதவி இருந்தால் இயந்திரப் பொறியியல் அல்லது கட்டடவியலை ஆராயலாம். CSE பிரபலமாக இருப்பதால் மட்டும் இவற்றை நிராகரிக்க வேண்டியதில்லை.

**detail:** இயந்திரப் பொறியியலில் வடிவமைப்பு, இயந்திரங்கள், வெப்ப அமைப்புகள், உற்பத்தி; கட்டடவியலில் கட்டமைப்பு, மண், நீர், போக்குவரத்து, கட்டுமானம் ஆகியவை உள்ளன. “CSE கிடைக்கவில்லை” என்பதற்காக மட்டும் தேர்வு செய்யாதீர்கள்; CSE பிரபலமென்பதற்காக மட்டும் நிராகரிக்காதீர்கள். எந்தப் பட்டமும் வேலைக்கு உத்தரவாதம் அல்ல.

**next:** எந்த வகை படிப்புப் பணிகள் உங்களுக்கு ஆர்வம் தருகின்றன என்று ஒப்பிடுங்கள்; இடம் கிடைப்பதையும் ஆர்வத்தையும் தனித்தனியாகப் பாருங்கள்.

**limit:** திறன், வேலைவாய்ப்பு அல்லது சேர்க்கை முடிவை இதிலிருந்து ஊகிக்க முடியாது.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q021 — A06

**Exact entry:** [Q021 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1545-L1581). **Completeness:** EN PARTIAL; TA PARTIAL. **Pages:** `/journey/questions?lang=en&id=Q021` and `/journey/questions?lang=ta&id=Q021`.

**Ganesan checks:** F plus No branch ranking, job promise or inferred admission difficulty; Q021 requires matched historical evidence.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E14 (**TNEA Cutoff Portal**, Government of Tamil Nadu / Directorate of Technical Education, records 2021–2025) — Search by year, college, programme and applicable admission dimensions. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q021</summary>

**English**

**question:** Is ECE easier to get than CSE? What cutoff does ECE need?

**answer:** There is no single ECE cutoff, and ECE is not always easier.

**detail:** A valid historical comparison must hold constant the **college, admission year, academic/vocational stream, counselling type/round, community/allotted category, quota/special reservation and programme/seat type**. The official TNEA Cutoff Portal provides 2021–2025 records. Use the target college and your matching category/route; treat the result as a past closing observation, not a prediction for the next allotment. Without those details, the precise cutoff remains unknown.

**next:** Use matching college, year, stream, round, category/quota and seat-type records in the official historical cutoff portal; do not use them as a prediction.

**limit:** PARTIAL: no matching college, admission year, stream, round, category/quota or programme/seat type was supplied, so neither a numeric ECE cutoff nor an ECE-versus-CSE admission comparison is established. Official portal availability was unresolved in the saved evidence.

**Tamil draft — not human-approved**

**question:** CSE-ஐ விட ECE-இல் இடம் கிடைப்பது எளிதா? ECE-க்கு என்ன கட்-ஆஃப் வேண்டும்?

**answer:** ECE-க்கு ஒரே கட்-ஆஃப் இல்லை; எல்லா இடங்களிலும் CSE-ஐ விட எளிதாகக் கிடைக்கும் என்றும் சொல்ல முடியாது. குறிப்பிட்ட மதிப்பெண்ணைச் சொல்ல தேவையான ஒப்பீட்டு விவரங்கள் இங்கு இல்லை.

**detail:** கடந்தகால ஒப்பீட்டில் கல்லூரி, சேர்க்கை ஆண்டு, பள்ளிக் கல்வி/தொழிற்கல்வி வழி, கலந்தாய்வு வகை/சுற்று, சமூக/ஒதுக்கீட்டுப் பிரிவு, சிறப்பு ஒதுக்கீடு, படிப்பு/இடவகை பொருந்த வேண்டும். சேமிக்கப்பட்ட ஆதாரம் அதிகாரப்பூர்வ TNEA தளத்தின் 2021–2025 பதிவுகளைச் சுட்டுகிறது. அவை கடந்த சேர்க்கைப் பதிவுகள்; அடுத்த ஒதுக்கீட்டிற்கான கணிப்பு அல்ல.

**next:** அதிகாரப்பூர்வ பழைய கட்-ஆஃப் பதிவுகளில் கல்லூரி, ஆண்டு, படிப்புவழி, சுற்று, பிரிவு/ஒதுக்கீடு, இடவகையை ஒரேபோல் வைத்து ஒப்பிடுங்கள்; எதிர்காலச் சேர்க்கையை ஊகிக்காதீர்கள்.

**limit:** பகுதி விளக்கம் மட்டுமே: கல்லூரி, ஆண்டு, படிப்புவழி, சுற்று, சமூகப் பிரிவு/ஒதுக்கீடு, படிப்பு/இடவகை தெரியவில்லை. ஆகவே ECE-க்கான எண்ணையோ CSE-யுடன் இடம் கிடைக்கும் ஒப்பீட்டையோ உறுதிசெய்ய முடியாது. சேமிக்கப்பட்ட ஆதாரத்தில் அதிகாரப்பூர்வ தளத்தின் கிடைப்பும் உறுதியாகவில்லை.

</details>

**Navigation:** next question Q086; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q047 — A06

**Exact entry:** [Q047 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1584-L1669). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q047` and `/journey/questions?lang=ta&id=Q047`.

**Ganesan checks:** F plus No branch ranking, job promise or inferred admission difficulty; Q021 requires matched historical evidence.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q047</summary>

**English**

**question:** How do I know which engineering branch matches my interests?

**answer:** Compare what you would repeatedly do: code and reason about systems; work with circuits/signals; study electricity and machines; design/manufacture mechanisms; or work with structures, land, water and transport.

**detail:** Read subjects, try one small activity, and note what you want to learn even when it becomes difficult. This supports your choice; it does not calculate aptitude.

**next:** Compare the study activities you prefer; keep admission feasibility separate from interest.

**limit:** No aptitude, placement or admission outcome can be inferred.

**Tamil draft — not human-approved**

**question:** என் ஆர்வத்திற்கு எந்தப் பொறியியல் பிரிவு பொருந்தும் என்று எப்படித் தெரிந்துகொள்வது?

**answer:** எதைத் தொடர்ந்து செய்ய விரும்புகிறீர்கள் என்று ஒப்பிடுங்கள்: நிரலாக்கம்/கணினி அமைப்புகள்; மின்சுற்று/சமிக்ஞை; மின்சாரம்/இயந்திரங்கள்; இயந்திர வடிவமைப்பு/உற்பத்தி; கட்டமைப்பு/நிலம்/நீர்/போக்குவரத்து.

**detail:** பாடங்களைப் படித்து ஒரு சிறிய செயலை முயற்சி செய்யுங்கள். கடினமானபோதும் எதைத் தொடர்ந்து கற்க விரும்புகிறீர்கள் என்று பாருங்கள். இது உங்கள் தேர்வுக்கு உதவும்; திறனைக் கணக்கிட்டுத் தீர்ப்பு வழங்காது.

**next:** எந்த வகை படிப்புப் பணிகள் உங்களுக்கு ஆர்வம் தருகின்றன என்று ஒப்பிடுங்கள்; இடம் கிடைப்பதையும் ஆர்வத்தையும் தனித்தனியாகப் பாருங்கள்.

**limit:** திறன், வேலைவாய்ப்பு அல்லது சேர்க்கை முடிவை இதிலிருந்து ஊகிக்க முடியாது.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q048 — A06

**Exact entry:** [Q048 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1672-L1757). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q048` and `/journey/questions?lang=ta&id=Q048`.

**Ganesan checks:** F plus No branch ranking, job promise or inferred admission difficulty; Q021 requires matched historical evidence.

**Source references / applicable year:** E03 (**Curriculum and Syllabi — R2025 Revision 1 (2026), 2026–27 batch**, Anna University Centre for Academic Courses, 2026) — Programme index by faculty; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q048</summary>

**English**

**question:** Should I choose a branch only based on placement opportunities?

**answer:** No.

**detail:** Placement data can be one verified input, but also compare curriculum, practical work, learning support, cost, location and your willingness to study the subject. Check whether placement figures are branch-specific, which batch they cover and what the denominator is. A promotional total does not establish your outcome.

**next:** Compare the study activities you prefer; keep admission feasibility separate from interest.

**limit:** No aptitude, placement or admission outcome can be inferred.

**Tamil draft — not human-approved**

**question:** வேலைவாய்ப்பை மட்டும் வைத்து ஒரு பிரிவைத் தேர்வு செய்யலாமா?

**answer:** வேண்டாம்.

**detail:** சரிபார்க்கப்பட்ட வேலைவாய்ப்புத் தகவல் ஒரு பகுதி மட்டுமே. பாடத்திட்டம், செய்முறை, கற்றல் உதவி, செலவு, இடம், அந்தப் பாடத்தைத் தொடர்ந்து கற்கும் விருப்பத்தையும் பாருங்கள். வேலைவாய்ப்பு எண்ணிக்கை எந்தப் பிரிவுக்கும் எந்த ஆண்டுக் குழுவுக்கும் உரியது, எத்தனை மாணவர்களில் எத்தனை பேர் என்ற அடிப்படை என்ன என்று சரிபாருங்கள். விளம்பர எண் உங்கள் முடிவை உறுதி செய்யாது.

**next:** எந்த வகை படிப்புப் பணிகள் உங்களுக்கு ஆர்வம் தருகின்றன என்று ஒப்பிடுங்கள்; இடம் கிடைப்பதையும் ஆர்வத்தையும் தனித்தனியாகப் பாருங்கள்.

**limit:** திறன், வேலைவாய்ப்பு அல்லது சேர்க்கை முடிவை இதிலிருந்து ஊகிக்க முடியாது.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q045 — A07

**Exact entry:** [Q045 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1760-L1852). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q045` and `/journey/questions?lang=ta&id=Q045`.

**Ganesan checks:** F plus Distinguish possible occupations from current employer eligibility or guaranteed work.

**Source references / applicable year:** E15 (**National Classification of Occupations 2015, Volume II-A**, Ministry of Labour and Employment / National Career Service, 2015) — pp.224 onward, occupation family 2512; software developer, engineer trainee and engineering-analysis roles; E16 (**National Classification of Occupations 2015, Volume I**, Ministry of Labour and Employment / National Career Service, 2015) — Occupation families 2142–2153 and 2512; E04 (**B.E. Computer Science and Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–5, semesters I–VI; repository extract `A03-CSE`; E05 (**B.Tech. Information Technology Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-IT`; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E09 (**B.E. Civil Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E10 (**B.Tech. Artificial Intelligence and Data Science Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII; E11 (**B.E. CSE (Artificial Intelligence and Machine Learning) Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–7, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q045</summary>

**English**

**question:** What career options are available after each branch?

**answer:** Possible work families include software/data for computing branches, electronics/communication for ECE, electrical power/control for EEE, design/manufacturing for Mechanical, and structures/construction/water for Civil. These are examples, not guaranteed jobs.

**detail:** Examples: CSE/IT/AI-data can connect to software, testing, data, systems, networks and AI-related work; ECE to electronics, embedded systems, communication, signal processing, VLSI and some software; EEE to power systems, electrical machines, control, power electronics, energy and some embedded/software work; Mechanical to design, manufacturing, thermal/energy, maintenance, automotive and automation; Civil to structures, construction, geotechnical, transport, water/environment and surveying. Actual eligibility depends on the employer, role, further qualifications and evidence of skills.

**next:** Choose a possible role and check its published qualifications and skills before planning your preparation.

**limit:** Occupation examples are not current vacancies or universal employer eligibility.

**Tamil draft — not human-approved**

**question:** ஒவ்வொரு பிரிவுக்குப் பிறகும் என்ன வேலைப் பாதைகள் உள்ளன?

**answer:** உதாரணமாக கணினிப் பிரிவுகளிலிருந்து மென்பொருள்/தரவு; ECE-இலிருந்து மின்னணு/தகவல் தொடர்பு; EEE-இலிருந்து மின்சக்தி/கட்டுப்பாடு; இயந்திரப் பொறியியலிலிருந்து வடிவமைப்பு/உற்பத்தி; கட்டடவியலிலிருந்து கட்டமைப்பு/கட்டுமானம்/நீர் சார்ந்த வேலைப் பாதைகள் இருக்கலாம். இவை உதாரணங்கள்; வேலை உறுதி அல்ல.

**detail:** கணினிப் பிரிவுகளில் சோதனை, வலையமைப்பு, செயற்கை நுண்ணறிவு; ECE-இல் சாதனத்துக்குள் இயங்கும் கணினி, சமிக்ஞை, மின்சுற்று வடிவமைப்பு; EEE-இல் மின் இயந்திரங்கள், மின்சக்தி மின்னணுவியல்; இயந்திரப் பொறியியலில் வெப்ப/ஆற்றல், பராமரிப்பு, வாகனம், தானியக்கம்; கட்டடவியலில் மண், போக்குவரத்து, சுற்றுச்சூழல், நில அளவை ஆகிய உதாரணங்களும் உள்ளன. சில பிற பிரிவுகளிலிருந்தும் மென்பொருள் வழிகள் இருக்கலாம். நிறுவனமும் வேலைவகையும் கோரும் கல்வி, கூடுதல் தகுதி, திறன் ஆதாரத்தைப் பொறுத்தே உண்மையான தகுதி அமையும்.

**next:** ஒரு வேலைவகையைப் பார்த்து, அதற்குத் தெரிவிக்கப்பட்டுள்ள கல்வித் தகுதியையும் திறன்களையும் சரிபார்த்து தயாரிப்பைத் திட்டமிடுங்கள்.

**limit:** வேலைவகை உதாரணங்கள் தற்போதைய காலியிடங்களோ எல்லா நிறுவனங்களுக்கும் பொருந்தும் தகுதிகளோ அல்ல.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q046 — A07

**Exact entry:** [Q046 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1855-L1912). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q046` and `/journey/questions?lang=ta&id=Q046`.

**Ganesan checks:** F plus Distinguish possible occupations from current employer eligibility or guaranteed work.

**Source references / applicable year:** E15 (**National Classification of Occupations 2015, Volume II-A**, Ministry of Labour and Employment / National Career Service, 2015) — pp.224 onward, occupation family 2512; software developer, engineer trainee and engineering-analysis roles; E16 (**National Classification of Occupations 2015, Volume I**, Ministry of Labour and Employment / National Career Service, 2015) — Occupation families 2142–2153 and 2512; E06 (**B.E. Electronics and Communication Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–6, semesters I–VI; repository extract `A03-ECE`; E07 (**B.E. Electrical and Electronics Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII; E08 (**B.E. Mechanical Engineering Curriculum**, Anna University, R2025 Revised 1 (2026)) — PDF pp.1–8, semesters I–VIII. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q046</summary>

**English**

**question:** Can I work in software if I study ECE, EEE, Mechanical or another non-CSE branch?

**answer:** It is possible, but not automatic.

**detail:** The reviewed ECE, EEE and Mechanical curricula contain some programming/computing; the National Classification of Occupations also recognises software and engineering-analysis roles. For a particular software role, check the employer’s accepted degrees, learn the required programming/data-structure/tools, build evidence through projects or internships, and pass its selection process. Some employers or higher-study programmes restrict eligible branches.

**next:** Choose a possible role and check its published qualifications and skills before planning your preparation.

**limit:** Occupation examples are not current vacancies or universal employer eligibility.

**Tamil draft — not human-approved**

**question:** ECE, EEE, இயந்திரப் பொறியியல் அல்லது வேறு CSE அல்லாத பிரிவு படித்தாலும் மென்பொருள் துறையில் வேலை செய்ய முடியுமா?

**answer:** முடியும்; ஆனால் தானாக கிடைக்காது.

**detail:** ஆய்வு செய்த ECE, EEE, இயந்திரப் பொறியியல் பாடத்திட்டங்களிலும் சில நிரலாக்க/கணினிப் பகுதிகள் உள்ளன. தேசிய வேலைவகைப் பட்டியலிலும் மென்பொருள் மற்றும் பொறியியல் பகுப்பாய்வு வேலைகள் உள்ளன. குறிப்பிட்ட நிறுவனத்தின் ஏற்கப்படும் பட்டம்/பிரிவைப் பார்த்து, நிரலாக்கம், தரவுக் கட்டமைப்புகள், கருவிகளைக் கற்று, திட்டப்பணி அல்லது பணிப்பயிற்சியில் திறனை நிரூபித்து அதன் தேர்வுமுறையை நிறைவு செய்ய வேண்டும். சில நிறுவனங்கள் அல்லது மேற்படிப்புகளில் பிரிவுக் கட்டுப்பாடு இருக்கும்.

**next:** ஒரு வேலைவகையைப் பார்த்து, அதற்குத் தெரிவிக்கப்பட்டுள்ள கல்வித் தகுதியையும் திறன்களையும் சரிபார்த்து தயாரிப்பைத் திட்டமிடுங்கள்.

**limit:** வேலைவகை உதாரணங்கள் தற்போதைய காலியிடங்களோ எல்லா நிறுவனங்களுக்கும் பொருந்தும் தகுதிகளோ அல்ல.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q051 — A07

**Exact entry:** [Q051 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1915-L1951). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q051` and `/journey/questions?lang=ta&id=Q051`.

**Ganesan checks:** F plus Distinguish possible occupations from current employer eligibility or guaranteed work.

**Source references / applicable year:** E15 (**National Classification of Occupations 2015, Volume II-A**, Ministry of Labour and Employment / National Career Service, 2015) — pp.224 onward, occupation family 2512; software developer, engineer trainee and engineering-analysis roles; E16 (**National Classification of Occupations 2015, Volume I**, Ministry of Labour and Employment / National Career Service, 2015) — Occupation families 2142–2153 and 2512. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q051</summary>

**English**

**question:** Can I change my career field after completing an engineering branch?

**answer:** Yes, some people move into adjacent or different fields, but the route depends on the target.

**detail:** Compare the target role’s published qualifications and skills with what you have; fill gaps through courses, projects, internship/work evidence, certification or further study where required. Regulated or specialist roles may require a specific degree or licence. A career change is possible, not guaranteed.

**next:** Choose a possible role and check its published qualifications and skills before planning your preparation.

**limit:** Occupation examples are not current vacancies or universal employer eligibility.

**Tamil draft — not human-approved**

**question:** ஒரு பொறியியல் பிரிவை முடித்தபின் வேறு வேலைத் துறைக்கு மாற முடியுமா?

**answer:** சிலர் தொடர்புள்ள அல்லது வேறு வேலைத் துறைக்கு மாறுகிறார்கள்; ஆனால் அது விரும்பும் வேலைவகையின் தகுதிகளையும் தேவையான புதிய கற்றலையும் பொறுத்தது.

**detail:** விரும்பும் வேலைவகையின் வெளியிடப்பட்ட கல்வி/திறன் தேவைகளை உங்களுடையவற்றுடன் ஒப்பிடுங்கள். தேவைப்பட்டால் படிப்பு, திட்டம், பணிப்பயிற்சி/வேலை ஆதாரம், சான்றிதழ் அல்லது மேற்படிப்பு மூலம் இடைவெளியை நிரப்புங்கள். சில ஒழுங்குபடுத்தப்பட்ட அல்லது சிறப்பு வேலைகளுக்குக் குறிப்பிட்ட பட்டம் அல்லது உரிமம் தேவை. மாறுவது சாத்தியம்; உறுதி அல்ல.

**next:** ஒரு வேலைவகையைப் பார்த்து, அதற்குத் தெரிவிக்கப்பட்டுள்ள கல்வித் தகுதியையும் திறன்களையும் சரிபார்த்து தயாரிப்பைத் திட்டமிடுங்கள்.

**limit:** வேலைவகை உதாரணங்கள் தற்போதைய காலியிடங்களோ எல்லா நிறுவனங்களுக்கும் பொருந்தும் தகுதிகளோ அல்ல.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q052 — B01

**Exact entry:** [Q052 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L1954-L1997). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q052` and `/journey/questions?lang=ta&id=Q052`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q052</summary>

**English**

**question:** How can I join an engineering college after 12th?

**answer:** First identify the admission route for the programme, check its year and eligibility, then apply through its official portal. You can understand the options before choosing a college.

**detail:** (No additional detail displayed.)

**next:** Learn the relevant application process before choosing colleges.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** 12 ஆம் வகுப்புக்குப் பிறகு பொறியியல் கல்லூரியில் எப்படிச் சேரலாம்?

**answer:** முதலில் படிப்பின் சேர்க்கைவழியை அறிந்து, அந்த ஆண்டின் தகுதியைச் சரிபார்த்து, அதன் அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்க வேண்டும். இப்போதே கல்லூரியைத் தேர்வு செய்யாமல் வழிகளைப் புரிந்துகொள்ளலாம்.

**detail:** (No additional detail displayed.)

**next:** கல்லூரிகளைத் தேர்வு செய்யும் முன் உங்களுக்குப் பொருந்தும் விண்ணப்ப முறையை அறியுங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q053; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q053 — B01

**Exact entry:** [Q053 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2000-L2061). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q053` and `/journey/questions?lang=ta&id=Q053`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria; S5 (Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates**) — Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average; S6 (AICTE, **Approval Process Handbook 2024–25 to 2026–27**, hosted by Anna University) — §§18.11–18.14, Mandatory Disclosures: admission procedure/calendar, criteria/weightages, applicants and management-seat results; printed pp.176–177. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q053</summary>

**English**

**question:** What are the different routes to engineering admission in Tamil Nadu?

**answer:** Routes include first-year TNEA for its listed seats, entrance-examination routes such as JEE, and institution-managed admissions under their rules. Diploma holders can check the separate direct-second-year TNLEA route.

**detail:** (No additional detail displayed.)

**next:** Learn the relevant application process before choosing colleges.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** தமிழ்நாட்டில் பொறியியல் சேர்க்கைக்கு என்னென்ன வழிகள் உள்ளன?

**answer:** பட்டியலிடப்பட்ட முதல் ஆண்டு இடங்களுக்கு TNEA, JEE போன்ற நுழைவுத்தேர்வு வழிகள், விதிகளுக்கு உட்பட்ட நிறுவனச் சேர்க்கை வழிகள் உள்ளன. டிப்ளமோ முடித்தவர்கள் தனியான நேரடி இரண்டாம் ஆண்டு TNLEA வழியைப் பார்க்கலாம்.

**detail:** (No additional detail displayed.)

**next:** கல்லூரிகளைத் தேர்வு செய்யும் முன் உங்களுக்குப் பொருந்தும் விண்ணப்ப முறையை அறியுங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q055; related IDs Q059, Q060. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q054 — B01

**Exact entry:** [Q054 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2064-L2107). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q054` and `/journey/questions?lang=ta&id=Q054`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q054</summary>

**English**

**question:** What is JEE?

**answer:** JEE means Joint Entrance Examination. JEE Main is an entrance-examination route for participating institutes such as NITs and IIITs; IIT admission uses JEE Advanced with its separate requirements and seat-allocation process.

**detail:** JEE Main is conducted by the National Testing Agency and includes a B.E./B.Tech paper. NIT means National Institute of Technology, IIIT means Indian Institute of Information Technology, and IIT means Indian Institute of Technology. Taking the examination alone does not secure a seat.

**next:** Compare JEE and TNEA, then check the official requirements of the route you intend to use.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** JEE என்றால் என்ன?

**answer:** JEE என்பது கூட்டு நுழைவுத்தேர்வு. JEE Main வழியில் NIT, IIIT போன்ற பங்கேற்கும் நிறுவனங்களுக்குச் சேர்க்கை நடைபெறுகிறது. IIT சேர்க்கைக்கு JEE Advanced-ன் தனி நிபந்தனைகளும் இடஒதுக்கீட்டுச் செயல்முறையும் உள்ளன.

**detail:** தேசிய தேர்வு முகமை JEE Main-ஐ நடத்துகிறது; அதில் B.E./B.Tech தேர்வுத்தாள் உள்ளது. NIT என்பது தேசிய தொழில்நுட்ப நிறுவனம்; IIIT என்பது இந்திய தகவல் தொழில்நுட்ப நிறுவனம்; IIT என்பது இந்திய தொழில்நுட்ப நிறுவனம். தேர்வு எழுதுவது மட்டும் இடத்தை உறுதி செய்யாது.

**next:** JEE மற்றும் TNEA வழிகளை ஒப்பிட்டு, நீங்கள் பயன்படுத்த விரும்பும் வழியின் அதிகாரப்பூர்வத் தேவைகளைச் சரிபாருங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q055; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q055 — B01

**Exact entry:** [Q055 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2110-L2153). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q055` and `/journey/questions?lang=ta&id=Q055`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q055</summary>

**English**

**question:** What is the difference between JEE and TNEA?

**answer:** JEE uses entrance-examination performance. The ordinary TNEA academic route uses prescribed school marks and counselling rules. An exam application and a TNEA application are separate processes.

**detail:** (No additional detail displayed.)

**next:** Learn the relevant application process before choosing colleges.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** JEE-க்கும் TNEA-க்கும் என்ன வேறுபாடு?

**answer:** JEE நுழைவுத்தேர்வு மதிப்பெண்ணைப் பயன்படுத்துகிறது. வழக்கமான TNEA பள்ளிக் கல்வி வழியில் குறிப்பிட்ட பள்ளி மதிப்பெண்களும் கலந்தாய்வு விதிகளும் பயன்படுகின்றன. தேர்வு விண்ணப்பமும் TNEA விண்ணப்பமும் தனித்தனி.

**detail:** (No additional detail displayed.)

**next:** கல்லூரிகளைத் தேர்வு செய்யும் முன் உங்களுக்குப் பொருந்தும் விண்ணப்ப முறையை அறியுங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q056; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q056 — B01

**Exact entry:** [Q056 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2156-L2199). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q056` and `/journey/questions?lang=ta&id=Q056`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q056</summary>

**English**

**question:** Do I need JEE to study engineering in Tamil Nadu?

**answer:** No, JEE is not needed for the ordinary TNEA academic route. A college or programme using JEE or another entrance route has its own requirements; TNEA does not cover every seat.

**detail:** (No additional detail displayed.)

**next:** Learn the relevant application process before choosing colleges.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** தமிழ்நாட்டில் பொறியியல் படிக்க JEE அவசியமா?

**answer:** இல்லை; வழக்கமான TNEA பள்ளிக் கல்வி வழிக்கு JEE தேவையில்லை. JEE அல்லது வேறு நுழைவுத்தேர்வு வழியில் சேர்க்கும் நிறுவனம் அல்லது படிப்புக்குத் தனித் தேவைகள் இருக்கும். எல்லா இடங்களும் TNEA-வில் இல்லை.

**detail:** (No additional detail displayed.)

**next:** கல்லூரிகளைத் தேர்வு செய்யும் முன் உங்களுக்குப் பொருந்தும் விண்ணப்ப முறையை அறியுங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q052; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q057 — B01

**Exact entry:** [Q057 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2202-L2245). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q057` and `/journey/questions?lang=ta&id=Q057`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q057</summary>

**English**

**question:** Can I apply through both JEE and TNEA?

**answer:** You can pursue both if you meet each route’s requirements and deadlines. Register separately; before accepting or joining, check each authority’s acceptance, withdrawal and fee rules.

**detail:** This guidance combines separate application processes; it is not a quoted joint-permission rule and does not permit indefinite retention of two admissions.

**next:** Learn the relevant application process before choosing colleges.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** JEE மற்றும் TNEA இரண்டிலும் விண்ணப்பிக்கலாமா?

**answer:** ஒவ்வொரு வழியின் தகுதியையும் காலக்கெடுவையும் பூர்த்தி செய்தால் இரண்டையும் முயற்சி செய்யலாம். தனித்தனியாகப் பதிவு செய்ய வேண்டும். இடத்தை ஏற்று சேரும் முன் ஏற்பு, விலகல், கட்டண விதிகளை அந்தந்த அதிகாரியிடம் சரிபாருங்கள்.

**detail:** தனித்தனி விண்ணப்ப முறைகளை இணைத்து விளக்கும் வழிகாட்டல் இது; இரண்டிற்குமான ஒரே அனுமதி விதியின் மேற்கோள் அல்ல. இரண்டு இடங்களையும் காலவரையின்றி வைத்திருக்கலாம் என்ற அனுமதியும் அல்ல.

**next:** கல்லூரிகளைத் தேர்வு செய்யும் முன் உங்களுக்குப் பொருந்தும் விண்ணப்ப முறையை அறியுங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q055; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q058 — B01

**Exact entry:** [Q058 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2248-L2291). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q058` and `/journey/questions?lang=ta&id=Q058`.

**Ganesan checks:** F plus Keep first-year TNEA, JEE Main/Advanced and TNLEA distinct; conditional dual applications are not indefinite seat retention.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S3 (National Testing Agency, **JEE (Main) 2026 Information Bulletin**) — §1.3 About JEE (Main), PDF p.13; §§5.8.1–5.8.3, printed pp.36–38, admission and seat allocation; S4 (JEE Advanced 2026, **Admission Criteria** and **Eligibility Criteria**) — Admission Criteria: “Joint Seat Allocation”; Eligibility: “Performance in JEE (Main) 2026” and simultaneous criteria. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q058</summary>

**English**

**question:** Are all engineering colleges in Tamil Nadu available through TNEA?

**answer:** No. TNEA covers the colleges and seats specified in its brochure, not every engineering college or every seat in Tamil Nadu.

**detail:** The 2026 scope includes government/government-aided engineering colleges, specified university departments and constituent colleges, Annamalai University and seats surrendered by participating institutions. Check the listed seats rather than assuming a whole institution is covered.

**next:** Learn the relevant application process before choosing colleges.

**limit:** 2026 route orientation only; special programmes and each authority’s requirements must be checked.

**Tamil draft — not human-approved**

**question:** தமிழ்நாட்டின் எல்லாப் பொறியியல் கல்லூரிகளும் TNEA-வில் உள்ளனவா?

**answer:** இல்லை. TNEA கையேட்டில் குறிப்பிடப்பட்ட கல்லூரிகளும் இடங்களுமே அதில் உள்ளன; தமிழ்நாட்டின் எல்லாப் பொறியியல் கல்லூரிகளும் எல்லா இடங்களும் அல்ல.

**detail:** 2026 வரம்பில் அரசு/அரசு உதவிப் பொறியியல் கல்லூரிகள், குறிப்பிட்ட பல்கலைக்கழகத் துறைகள் மற்றும் உறுப்புக் கல்லூரிகள், அண்ணாமலைப் பல்கலைக்கழகம், பங்கேற்கும் நிறுவனங்கள் ஒப்படைக்கும் இடங்கள் உள்ளன. முழு நிறுவனமும் அதில் உள்ளது என்று ஊகிக்காமல் பட்டியலிடப்பட்ட இடங்களைப் பாருங்கள்.

**next:** கல்லூரிகளைத் தேர்வு செய்யும் முன் உங்களுக்குப் பொருந்தும் விண்ணப்ப முறையை அறியுங்கள்.

**limit:** இது 2026 வழிகளின் அறிமுகம் மட்டுமே; சிறப்புப் படிப்புகளையும் ஒவ்வொரு அதிகாரியின் விதிகளையும் சரிபார்க்க வேண்டும்.

</details>

**Navigation:** next question Q053; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q059 — B02

**Exact entry:** [Q059 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2294-L2330). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q059` and `/journey/questions?lang=ta&id=Q059`.

**Ganesan checks:** F plus Definition is not verified target-college share, price, fee, selection or refund terms.

**Source references / applicable year:** S6 (AICTE, **Approval Process Handbook 2024–25 to 2026–27**, hosted by Anna University) — §§18.11–18.14, Mandatory Disclosures: admission procedure/calendar, criteria/weightages, applicants and management-seat results; printed pp.176–177; S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q059</summary>

**English**

**question:** What is management quota?

**answer:** Management quota generally refers to seats whose admission is managed by a self-financing institution under applicable rules, rather than allotted through state counselling. It does not remove eligibility requirements or guarantee admission for payment.

**detail:** (No additional detail displayed.)

**next:** Ask the institution for its official selection, fee and refund notice before applying.

**limit:** Institution-specific fees, seat share and selection terms are not verified.

**Tamil draft — not human-approved**

**question:** நிர்வாக ஒதுக்கீடு என்றால் என்ன?

**answer:** நிர்வாக ஒதுக்கீடு என்பது பொதுவாக மாநிலக் கலந்தாய்வுக்கு வெளியே, பொருந்தும் விதிகளின்படி சுயநிதி நிறுவனம் சேர்க்கை நடத்தும் இடங்களைக் குறிக்கும். தகுதி விதிகளைத் தவிர்க்கலாம் என்றோ பணம் கொடுத்தால் இடம் உறுதி என்றோ அர்த்தமல்ல.

**detail:** (No additional detail displayed.)

**next:** விண்ணப்பிக்கும் முன் நிறுவனத்திடம் அதிகாரப்பூர்வத் தேர்வுமுறை, கட்டணம், பணத்தைத் திரும்பப் பெறும் விதிகளைக் கேளுங்கள்.

**limit:** குறிப்பிட்ட நிறுவனத்தின் கட்டணம், இடப்பங்கு, தேர்வுவிதிகள் உறுதிசெய்யப்படவில்லை.

</details>

**Navigation:** next question Q053; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q060 — B03

**Exact entry:** [Q060 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2333-L2362). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q060` and `/journey/questions?lang=ta&id=Q060`.

**Ganesan checks:** F plus Direct second-year TNLEA remains outside this first-year personal check; no automatic admission.

**Source references / applicable year:** S5 (Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates**) — Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q060</summary>

**English**

**question:** What is lateral entry in engineering?

**answer:** Lateral entry means entering an eligible engineering programme directly in second year. Tamil Nadu’s 2026 TNLEA process is separate from first-year TNEA and has its own eligibility, documents and counselling.

**detail:** (No additional detail displayed.)

**next:** Check the intended year’s TNLEA guide using your diploma details; do not restart a Class-12 check.

**limit:** 2026–27 guide only. Exact diploma eligibility, branch equivalence and seats still need confirmation. The first-year personal check does not assess lateral entry.

**Tamil draft — not human-approved**

**question:** பொறியியலில் நேரடி இரண்டாம் ஆண்டு சேர்க்கை என்றால் என்ன?

**answer:** நேரடி இரண்டாம் ஆண்டு சேர்க்கை என்பது பொருந்தும் பொறியியல் படிப்பில் முதல் ஆண்டுக்குப் பதிலாக இரண்டாம் ஆண்டில் சேர்வது. தமிழ்நாட்டின் 2026 TNLEA முறை முதல் ஆண்டு TNEA-விலிருந்து தனியானது; தனித் தகுதி, ஆவணங்கள், கலந்தாய்வு உள்ளன.

**detail:** (No additional detail displayed.)

**next:** உங்கள் டிப்ளமோ விவரங்களுடன் சேர விரும்பும் ஆண்டின் TNLEA கையேட்டைப் பாருங்கள்; 12 ஆம் வகுப்பு சரிபார்ப்பை மீண்டும் தொடங்க வேண்டாம்.

**limit:** ஆதாரம் 2026–27 கையேடு மட்டுமே. டிப்ளமோ தகுதி, பிரிவு இணைவு, இடங்கள் இன்னும் சரிபார்க்கப்பட வேண்டும். முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு நேரடி இரண்டாம் ஆண்டு தகுதியை மதிப்பிடாது.

</details>

**Navigation:** next question Q063; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q061 — B03

**Exact entry:** [Q061 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2365-L2394). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q061` and `/journey/questions?lang=ta&id=Q061`.

**Ganesan checks:** F plus Direct second-year TNLEA remains outside this first-year personal check; no automatic admission.

**Source references / applicable year:** S5 (Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates**) — Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q061</summary>

**English**

**question:** I completed a diploma. Can I join engineering?

**answer:** A completed diploma makes the direct-second-year TNLEA route worth checking. Admission is conditional on the exact diploma, results, programme and applicable rules; completing a diploma does not automatically secure a seat.

**detail:** The 2026 TNLEA guide requires a qualifying pass and the prescribed semester-mark average, with applicable nativity/category rules and document verification. The Class-12 TNEA formula is not the diploma admission calculation.

**next:** Check the intended year’s TNLEA guide using your diploma details; do not restart a Class-12 check.

**limit:** 2026–27 guide only. Exact diploma eligibility, branch equivalence and seats still need confirmation. The first-year personal check does not assess lateral entry.

**Tamil draft — not human-approved**

**question:** நான் டிப்ளமோ முடித்துவிட்டேன். பொறியியலில் சேர முடியுமா?

**answer:** டிப்ளமோ முடித்திருப்பதால் நேரடி இரண்டாம் ஆண்டு TNLEA வழியைப் பார்க்கலாம். உங்கள் டிப்ளமோ, முடிவுகள், விரும்பும் படிப்பு மற்றும் பொருந்தும் விதிகளைச் சரிபார்க்க வேண்டும்; டிப்ளமோ முடித்தாலே இடம் உறுதி அல்ல.

**detail:** 2026 TNLEA கையேடு தகுதித் தேர்ச்சி, குறிப்பிட்ட பருவ மதிப்பெண் சராசரி, பொருந்தும் பூர்வீகம்/பிரிவு விதிகள் மற்றும் ஆவணச் சரிபார்ப்பைக் கோருகிறது. 12 ஆம் வகுப்பு TNEA சூத்திரம் டிப்ளமோ சேர்க்கைக்கான கணக்கீடு அல்ல.

**next:** உங்கள் டிப்ளமோ விவரங்களுடன் சேர விரும்பும் ஆண்டின் TNLEA கையேட்டைப் பாருங்கள்; 12 ஆம் வகுப்பு சரிபார்ப்பை மீண்டும் தொடங்க வேண்டாம்.

**limit:** ஆதாரம் 2026–27 கையேடு மட்டுமே. டிப்ளமோ தகுதி, பிரிவு இணைவு, இடங்கள் இன்னும் சரிபார்க்கப்பட வேண்டும். முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு நேரடி இரண்டாம் ஆண்டு தகுதியை மதிப்பிடாது.

</details>

**Navigation:** next question Q063; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q062 — B03

**Exact entry:** [Q062 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2397-L2426). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q062` and `/journey/questions?lang=ta&id=Q062`.

**Ganesan checks:** F plus Direct second-year TNLEA remains outside this first-year personal check; no automatic admission.

**Source references / applicable year:** S5 (Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates**) — Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q062</summary>

**English**

**question:** Can a diploma student join directly in second year?

**answer:** Yes, the TNLEA route allows eligible diploma holders to seek direct second-year entry. The prescribed qualifying marks, nativity/category rules and document verification still apply.

**detail:** (No additional detail displayed.)

**next:** Check the intended year’s TNLEA guide using your diploma details; do not restart a Class-12 check.

**limit:** 2026–27 guide only. Exact diploma eligibility, branch equivalence and seats still need confirmation. The first-year personal check does not assess lateral entry.

**Tamil draft — not human-approved**

**question:** டிப்ளமோ மாணவர் நேரடியாக இரண்டாம் ஆண்டில் சேர முடியுமா?

**answer:** ஆம்; தகுதியுள்ள டிப்ளமோ மாணவர் TNLEA வழியில் நேரடி இரண்டாம் ஆண்டு சேர்க்கையை நாடலாம். குறிப்பிட்ட தகுதி மதிப்பெண், பூர்வீகம்/பிரிவு விதிகள், ஆவணச் சரிபார்ப்பு ஆகியவை பொருந்தும்.

**detail:** (No additional detail displayed.)

**next:** உங்கள் டிப்ளமோ விவரங்களுடன் சேர விரும்பும் ஆண்டின் TNLEA கையேட்டைப் பாருங்கள்; 12 ஆம் வகுப்பு சரிபார்ப்பை மீண்டும் தொடங்க வேண்டாம்.

**limit:** ஆதாரம் 2026–27 கையேடு மட்டுமே. டிப்ளமோ தகுதி, பிரிவு இணைவு, இடங்கள் இன்னும் சரிபார்க்கப்பட வேண்டும். முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு நேரடி இரண்டாம் ஆண்டு தகுதியை மதிப்பிடாது.

</details>

**Navigation:** next question Q063; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q063 — B03

**Exact entry:** [Q063 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2429-L2458). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q063` and `/journey/questions?lang=ta&id=Q063`.

**Ganesan checks:** F plus Direct second-year TNLEA remains outside this first-year personal check; no automatic admission.

**Source references / applicable year:** S5 (Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates**) — Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q063</summary>

**English**

**question:** Is lateral-entry admission part of regular TNEA counselling?

**answer:** No. Tamil Nadu’s 2026 direct-second-year TNLEA process has a separate application and counselling process from regular first-year TNEA. Do not apply the Class-12 TNEA cutoff formula to diploma admission.

**detail:** (No additional detail displayed.)

**next:** Check the intended year’s TNLEA guide using your diploma details; do not restart a Class-12 check.

**limit:** 2026–27 guide only. Exact diploma eligibility, branch equivalence and seats still need confirmation. The first-year personal check does not assess lateral entry.

**Tamil draft — not human-approved**

**question:** நேரடி இரண்டாம் ஆண்டு சேர்க்கையும் வழக்கமான TNEA கலந்தாய்வின் பகுதியா?

**answer:** இல்லை. 2026 நேரடி இரண்டாம் ஆண்டு TNLEA விண்ணப்பமும் கலந்தாய்வும் வழக்கமான முதல் ஆண்டு TNEA-விலிருந்து தனியானவை. டிப்ளமோ சேர்க்கைக்கு 12 ஆம் வகுப்பு TNEA கட்-ஆஃப் சூத்திரத்தைப் பயன்படுத்தாதீர்கள்.

**detail:** (No additional detail displayed.)

**next:** உங்கள் டிப்ளமோ விவரங்களுடன் சேர விரும்பும் ஆண்டின் TNLEA கையேட்டைப் பாருங்கள்; 12 ஆம் வகுப்பு சரிபார்ப்பை மீண்டும் தொடங்க வேண்டாம்.

**limit:** ஆதாரம் 2026–27 கையேடு மட்டுமே. டிப்ளமோ தகுதி, பிரிவு இணைவு, இடங்கள் இன்னும் சரிபார்க்கப்பட வேண்டும். முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு நேரடி இரண்டாம் ஆண்டு தகுதியை மதிப்பிடாது.

</details>

**Navigation:** next question Q061; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q001 — B04

**Exact entry:** [Q001 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2461-L2497). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q001` and `/journey/questions?lang=ta&id=Q001`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q001</summary>

**English**

**question:** How does TNEA counselling actually work? I'm the first engineer in my family.

**answer:** You register, submit the required records, check verification and rank, enter your preferred college-and-branch choices, respond to the allotment, and complete the required joining steps. An official TNEA Facilitation Centre (TFC) can help you through the process.

**detail:** After certificate verification, check your rank/details and raise errors promptly. In your notified round confirm choices in your preferred order. Read the tentative allotment options and respond/report by the notified deadline; do not stop after seeing a seat on screen.

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** 2026 process only, not a claim that a round is open. Saved sources disagree on the grievance window; check the controlling notice rather than assuming a deadline.

**Tamil draft — not human-approved**

**question:** என் குடும்பத்தில் முதலில் பொறியியல் படிக்கப் போகிறேன். TNEA கலந்தாய்வு உண்மையில் எப்படி நடக்கும்?

**answer:** பதிவு செய்து தேவையான ஆவணங்களை அளிக்க வேண்டும். சரிபார்ப்பையும் தரவரிசையையும் பார்த்து, விருப்பமான கல்லூரி–பிரிவுகளை வரிசைப்படுத்த வேண்டும். ஒதுக்கப்பட்ட இடத்திற்குப் பதில் அளித்து, சேர்க்கைப் பணிகளை முடிக்க வேண்டும். அதிகாரப்பூர்வ TNEA உதவி மையம் (TFC) இதில் உதவும்.

**detail:** சான்றிதழ் சரிபார்ப்புக்குப் பிறகு தரவரிசை/விவரங்களைப் பார்த்துப் பிழையை உடனே தெரிவியுங்கள். உங்களுக்கு அறிவிக்கப்பட்ட சுற்றில் உண்மையான விருப்ப வரிசையில் தேர்வுகளை உறுதிசெய்யுங்கள். தற்காலிக ஒதுக்கீட்டில் உள்ள பதில் விருப்பங்களைப் படித்து, அறிவிக்கப்பட்ட காலத்திற்குள் பதிலளித்து சேர்க்கைப் பணிகளைச் செய்யுங்கள்; திரையில் இடம் தெரிந்தவுடன் நிறுத்தாதீர்கள்.

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** இது 2026 செயல்முறை மட்டுமே; இப்போது சுற்று திறந்துள்ளது என்ற தகவல் அல்ல. குறை தெரிவிக்கும் காலத்தில் சேமிக்கப்பட்ட ஆதாரங்கள் முரண்படுகின்றன; காலத்தை ஊகிக்காமல் உரிய அறிவிப்பைப் பாருங்கள்.

</details>

**Navigation:** next question Q007; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q064 — B04

**Exact entry:** [Q064 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2500-L2536). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q064` and `/journey/questions?lang=ta&id=Q064`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q064</summary>

**English**

**question:** What is TNEA?

**answer:** TNEA means Tamil Nadu Engineering Admissions: the application and counselling process for the engineering seats covered by its brochure. It is an admission process, not itself an entrance examination.

**detail:** (No additional detail displayed.)

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** Based on the 2026 TNEA process. This definition does not establish your eligibility, an open application window or a seat.

**Tamil draft — not human-approved**

**question:** TNEA என்றால் என்ன?

**answer:** TNEA என்பது தமிழ்நாடு பொறியியல் சேர்க்கை. அதன் கையேட்டில் உள்ள பொறியியல் இடங்களுக்கான விண்ணப்பம் மற்றும் கலந்தாய்வு முறை. இது சேர்க்கைச் செயல்முறை; தனி நுழைவுத்தேர்வு அல்ல.

**detail:** (No additional detail displayed.)

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** 2026 TNEA செயல்முறையின் விளக்கம். இது உங்கள் தகுதி, இப்போது விண்ணப்பம் திறந்துள்ளதா, அல்லது இடம் கிடைக்குமா என்பதை உறுதிசெய்யாது.

</details>

**Navigation:** next question Q007; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q065 — B04

**Exact entry:** [Q065 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2539-L2575). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q065` and `/journey/questions?lang=ta&id=Q065`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q065</summary>

**English**

**question:** Is TNEA an entrance exam?

**answer:** No. TNEA is an admission and counselling process. The ordinary academic route uses relevant school marks under its merit rules; special programmes can have additional requirements.

**detail:** (No additional detail displayed.)

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** Based on the 2026 TNEA process. This definition does not establish your eligibility, an open application window or a seat.

**Tamil draft — not human-approved**

**question:** TNEA ஒரு நுழைவுத்தேர்வா?

**answer:** இல்லை. TNEA என்பது சேர்க்கை மற்றும் கலந்தாய்வு முறை. வழக்கமான பள்ளிக் கல்வி வழியில் உரிய பள்ளி மதிப்பெண்கள் தரவரிசை விதிகளின்படி பயன்படும்; சிறப்புப் படிப்புகளுக்குக் கூடுதல் தேவைகள் இருக்கலாம்.

**detail:** (No additional detail displayed.)

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** 2026 TNEA செயல்முறையின் விளக்கம். இது உங்கள் தகுதி, இப்போது விண்ணப்பம் திறந்துள்ளதா, அல்லது இடம் கிடைக்குமா என்பதை உறுதிசெய்யாது.

</details>

**Navigation:** next question Q007; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q066 — B04

**Exact entry:** [Q066 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2578-L2614). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q066` and `/journey/questions?lang=ta&id=Q066`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q066</summary>

**English**

**question:** Who conducts TNEA?

**answer:** The Directorate of Technical Education, Government of Tamil Nadu, conducts TNEA. Use its official TNEA notices for the applicable admission year.

**detail:** (No additional detail displayed.)

**next:** Read the official TNEA explanation of the application and counselling steps.

**limit:** Based on the 2026 TNEA process. This definition does not establish your eligibility, an open application window or a seat.

**Tamil draft — not human-approved**

**question:** TNEA-வை யார் நடத்துகிறார்கள்?

**answer:** தமிழ்நாடு அரசின் தொழில்நுட்பக் கல்வி இயக்ககம் TNEA-வை நடத்துகிறது. நீங்கள் சேர விரும்பும் ஆண்டுக்கான அதன் அதிகாரப்பூர்வ TNEA அறிவிப்புகளைப் பாருங்கள்.

**detail:** (No additional detail displayed.)

**next:** விண்ணப்பம் மற்றும் கலந்தாய்வுப் படிகளுக்கான அதிகாரப்பூர்வ TNEA விளக்கத்தைப் பாருங்கள்.

**limit:** 2026 TNEA செயல்முறையின் விளக்கம். இது உங்கள் தகுதி, இப்போது விண்ணப்பம் திறந்துள்ளதா, அல்லது இடம் கிடைக்குமா என்பதை உறுதிசெய்யாது.

</details>

**Navigation:** next question Q067; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q067 — B04

**Exact entry:** [Q067 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2617-L2653). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q067` and `/journey/questions?lang=ta&id=Q067`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q067</summary>

**English**

**question:** What happens from TNEA application to joining a college?

**answer:** The sequence is application, certificate verification, rank publication, choice entry, tentative allotment, your response and the required reporting/joining steps. Submitting a form or seeing an allotted seat is not the final step.

**detail:** In the notified round confirm the college-and-branch choices in your preferred order. Allotment depends on rank, applicable reservation, choices and available eligible seats. Respond to the tentative allotment by the stated deadline and complete the specified college/TFC reporting, fees and documents.

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** 2026 process only, not a claim that a round is open. Saved sources disagree on the grievance window; check the controlling notice rather than assuming a deadline.

**Tamil draft — not human-approved**

**question:** TNEA விண்ணப்பத்திலிருந்து கல்லூரியில் சேர்வது வரை என்ன நடக்கும்?

**answer:** விண்ணப்பம், சான்றிதழ் சரிபார்ப்பு, தரவரிசை வெளியீடு, விருப்பத் தேர்வுகள், தற்காலிக இடஒதுக்கீடு, உங்கள் பதில், தேவையான சேர்க்கைப் பணிகள் என்று தொடரும். படிவம் அளித்ததோ திரையில் இடம் தெரிந்ததோ கடைசிப் படி அல்ல.

**detail:** அறிவிக்கப்பட்ட சுற்றில் கல்லூரி–பிரிவுகளை விருப்ப வரிசையில் உறுதிசெய்யுங்கள். தரவரிசை, பொருந்தும் இடஒதுக்கீடு, விருப்பங்கள், கிடைக்கும் உரிய இடங்களைப் பொறுத்து ஒதுக்கீடு அமையும். தற்காலிக ஒதுக்கீட்டிற்குக் குறிப்பிட்ட காலத்தில் பதிலளித்து, தெரிவிக்கப்பட்ட கல்லூரி/TFC வருகை, கட்டணம், ஆவணப் பணிகளை முடிக்க வேண்டும்.

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** இது 2026 செயல்முறை மட்டுமே; இப்போது சுற்று திறந்துள்ளது என்ற தகவல் அல்ல. குறை தெரிவிக்கும் காலத்தில் சேமிக்கப்பட்ட ஆதாரங்கள் முரண்படுகின்றன; காலத்தை ஊகிக்காமல் உரிய அறிவிப்பைப் பாருங்கள்.

</details>

**Navigation:** next question Q007; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q068 — B04

**Exact entry:** [Q068 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2656-L2692). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q068` and `/journey/questions?lang=ta&id=Q068`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q068</summary>

**English**

**question:** What is counselling in TNEA?

**answer:** Counselling is the organised process of giving your college-and-branch preferences, receiving an allotment under the rules, responding to it and completing joining requirements. It is not an interview that guarantees a college.

**detail:** (No additional detail displayed.)

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** Based on the 2026 TNEA process. This definition does not establish your eligibility, an open application window or a seat.

**Tamil draft — not human-approved**

**question:** TNEA-வில் கலந்தாய்வு என்றால் என்ன?

**answer:** கலந்தாய்வு என்பது விருப்பமான கல்லூரி–பிரிவுகளைத் தெரிவித்து, விதிகளின்படி ஒதுக்கீட்டைப் பெற்று, அதற்குப் பதிலளித்து, சேர்க்கைத் தேவைகளை முடிக்கும் முறை. இது கல்லூரி இடத்தை உறுதி செய்யும் நேர்முகத் தேர்வு அல்ல.

**detail:** (No additional detail displayed.)

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** 2026 TNEA செயல்முறையின் விளக்கம். இது உங்கள் தகுதி, இப்போது விண்ணப்பம் திறந்துள்ளதா, அல்லது இடம் கிடைக்குமா என்பதை உறுதிசெய்யாது.

</details>

**Navigation:** next question Q007; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q069 — B04

**Exact entry:** [Q069 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2695-L2731). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q069` and `/journey/questions?lang=ta&id=Q069`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q069</summary>

**English**

**question:** Why do I need to register for TNEA?

**answer:** Registration enters you into the TNEA admission process so your application and records can be considered. Registration alone is not a seat allotment; later verification, choices and responses still matter.

**detail:** (No additional detail displayed.)

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** Based on the 2026 TNEA process. This definition does not establish your eligibility, an open application window or a seat.

**Tamil draft — not human-approved**

**question:** TNEA-வில் ஏன் பதிவு செய்ய வேண்டும்?

**answer:** உங்கள் விண்ணப்பமும் ஆவணங்களும் பரிசீலிக்கப்பட TNEA சேர்க்கை முறையில் பதிவு செய்ய வேண்டும். பதிவு மட்டும் இடஒதுக்கீடு அல்ல; பின்னர் சரிபார்ப்பு, விருப்பத் தேர்வுகள், பதிலளித்தல் ஆகியவை முக்கியம்.

**detail:** (No additional detail displayed.)

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** 2026 TNEA செயல்முறையின் விளக்கம். இது உங்கள் தகுதி, இப்போது விண்ணப்பம் திறந்துள்ளதா, அல்லது இடம் கிடைக்குமா என்பதை உறுதிசெய்யாது.

</details>

**Navigation:** next question Q007; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q070 — B04

**Exact entry:** [Q070 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2734-L2770). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q070` and `/journey/questions?lang=ta&id=Q070`.

**Ganesan checks:** F plus Check 2026 sequence, official authority and rank; registration is not allotment; no fixed contested grievance window.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S2 (Directorate of Technical Education, **TNEA 2026 — Online Counselling Procedure**) — PDF p.1: registration, verification, rank list, grievance and counselling; pp.2–4: choices, allotment and confirmation options. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q070</summary>

**English**

**question:** What is a TNEA rank list?

**answer:** A rank list orders eligible applicants under the year’s merit and tie-breaking rules. Overall rank and community rank are different lists; rank is your place in a list, not your cutoff mark.

**detail:** Equal cutoff marks can be separated by tie-breaking rules. Check the authority’s published list rather than deriving an official rank from one score.

**next:** Check the official notice for your next stage and deadline; ask a TNEA Facilitation Centre if unsure.

**limit:** 2026 ranking rules; the official list establishes your rank. A cutoff alone cannot establish rank or admission.

**Tamil draft — not human-approved**

**question:** TNEA தரவரிசைப் பட்டியல் என்றால் என்ன?

**answer:** அந்த ஆண்டின் மதிப்பெண் மற்றும் சமமதிப்பெண் விதிகளின்படி தகுதியுள்ள விண்ணப்பதாரர்களை வரிசைப்படுத்துவது தரவரிசைப் பட்டியல். பொதுத் தரவரிசையும் சமூகப் பிரிவு தரவரிசையும் வேறு பட்டியல்கள். தரவரிசை என்பது வரிசை இடம்; கட்-ஆஃப் மதிப்பெண் அல்ல.

**detail:** ஒரே கட்-ஆஃப் இருந்தாலும் சமமதிப்பெண் விதிகளால் வரிசை வேறுபடலாம். ஒரு மதிப்பெண்ணிலிருந்து அதிகாரப்பூர்வ தரவரிசையை ஊகிக்காமல் வெளியிடப்பட்ட பட்டியலைப் பாருங்கள்.

**next:** உங்கள் அடுத்த படிக்கும் காலக்கெடுவுக்கும் அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்; சந்தேகமிருந்தால் TNEA உதவி மையத்தில் கேளுங்கள்.

**limit:** 2026 தரவரிசை விதிகள்; அதிகாரப்பூர்வப் பட்டியலே உங்கள் தரவரிசையை உறுதிசெய்யும். கட்-ஆஃப் மட்டும் தரவரிசையையோ சேர்க்கையையோ உறுதிசெய்யாது.

</details>

**Navigation:** next question Q086; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q071 — B05

**Exact entry:** [Q071 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2773-L2802). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q071` and `/journey/questions?lang=ta&id=Q071`.

**Ganesan checks:** F plus Core versus conditional documents, reservation/concession proof and privacy; no guaranteed entitlement.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q071</summary>

**English**

**question:** What information should I know before I start my TNEA application?

**answer:** Know the admission year, first-year or diploma route, school board/qualifying course, results, school-study history and any reservation or concession you plan to claim. A claim needs the required proof, not just a form selection.

**detail:** The 2026 preparation list also asks for working mobile/email, Aadhaar and parent-income details, and registration-payment arrangements. Prepare these privately; this question page does not collect them.

**next:** Prepare the documents that apply to you privately; ask official TNEA help about a missing certificate or format.

**limit:** Based on the 2026 list. The applicable upload format and deadline need the official notice; do not upload private records here.

**Tamil draft — not human-approved**

**question:** TNEA விண்ணப்பத்தைத் தொடங்கும் முன் என்ன விவரங்கள் தெரிந்திருக்க வேண்டும்?

**answer:** சேர்க்கை ஆண்டு, முதல் ஆண்டா டிப்ளமோ வழியா, பள்ளி வாரியம்/தகுதிப் படிப்பு, முடிவுகள், பள்ளிப் படிப்பு வரலாறு, கோரும் இடஒதுக்கீடு அல்லது சலுகை ஆகியவற்றைத் தெரிந்துகொள்ளுங்கள். படிவத்தில் தேர்ந்தெடுப்பது மட்டும் போதாது; கோரிக்கைக்கு உரிய ஆதாரம் வேண்டும்.

**detail:** 2026 தயாரிப்புப் பட்டியலில் பயன்பாட்டில் உள்ள கைபேசி/மின்னஞ்சல், ஆதார், பெற்றோர் வருமான விவரங்கள், பதிவுக் கட்டண ஏற்பாடுகளும் கேட்கப்படுகின்றன. தனிப்பட்ட முறையில் தயாரியுங்கள்; இந்தக் கேள்விப் பக்கம் அவற்றைச் சேகரிக்காது.

**next:** உங்களுக்குப் பொருந்தும் ஆவணங்களைத் தனிப்பட்ட முறையில் தயாரியுங்கள்; இல்லாத சான்று அல்லது வடிவம் பற்றி அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 பட்டியலை அடிப்படையாகக் கொண்டது. பொருந்தும் பதிவேற்ற வடிவமும் காலக்கெடுவும் அதிகாரப்பூர்வ அறிவிப்பில் பார்க்கப்பட வேண்டும்; தனிப்பட்ட ஆவணங்களை இங்கு பதிவேற்றாதீர்கள்.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q007 — B05

**Exact entry:** [Q007 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2805-L2834). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q007` and `/journey/questions?lang=ta&id=Q007`.

**Ganesan checks:** F plus Core versus conditional documents, reservation/concession proof and privacy; no guaranteed entitlement.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q007</summary>

**English**

**question:** What certificates should I keep ready for TNEA counselling?

**answer:** For 2026 first-year TNEA, prepare Class 10, +1 and +2/equivalent marksheets, transfer certificate and school details. Community, nativity, income and special-claim certificates depend on the applicable claim and rules.

**detail:** Depending on the claim, the 2026 list includes government-school study proof for Classes 6–12; First Graduate certificate and joint declaration; refugee evidence; and prescribed sports, disability or ex-servicemen documents. Relevant parent/employer declarations may apply to a special nativity route. Keep originals and readable copies private; use official upload channels only.

**next:** Prepare the documents that apply to you privately; ask official TNEA help about a missing certificate or format.

**limit:** Based on the 2026 list. The applicable upload format and deadline need the official notice; do not upload private records here.

**Tamil draft — not human-approved**

**question:** TNEA கலந்தாய்வுக்கு என்ன சான்றிதழ்களைத் தயாராக வைத்திருக்க வேண்டும்?

**answer:** 2026 முதல் ஆண்டு TNEA-விற்கு 10, 11, 12 ஆம் வகுப்பு அல்லது இணையான மதிப்பெண் சான்றுகள், மாற்றுச் சான்றிதழ், பள்ளி விவரங்களைத் தயாராக வைத்திருங்கள். சமூகப் பிரிவு, பூர்வீகம், வருமானம், சிறப்புக் கோரிக்கைச் சான்றுகள் பொருந்தும் விதிகளையும் உங்கள் கோரிக்கையையும் பொறுத்தவை.

**detail:** கோரிக்கையைப் பொறுத்து 2026 பட்டியலில் 6–12 வகுப்பு அரசுப் பள்ளிப் படிப்புச் சான்று; முதல் பட்டதாரிச் சான்றும் கூட்டுறுதிமொழியும்; அகதி ஆதாரம்; விளையாட்டு, மாற்றுத்திறன், முன்னாள் படைவீரர் ஆவணங்கள் உள்ளன. சிறப்புப் பூர்வீக வழிக்கு பெற்றோர்/பணியாளர் உறுதிமொழிகள் பொருந்தலாம். அசல் ஆவணங்களையும் தெளிவான நகல்களையும் தனிப்பட்ட முறையில் வைத்திருங்கள்; அதிகாரப்பூர்வ பதிவேற்ற வழியை மட்டுமே பயன்படுத்துங்கள்.

**next:** உங்களுக்குப் பொருந்தும் ஆவணங்களைத் தனிப்பட்ட முறையில் தயாரியுங்கள்; இல்லாத சான்று அல்லது வடிவம் பற்றி அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 பட்டியலை அடிப்படையாகக் கொண்டது. பொருந்தும் பதிவேற்ற வடிவமும் காலக்கெடுவும் அதிகாரப்பூர்வ அறிவிப்பில் பார்க்கப்பட வேண்டும்; தனிப்பட்ட ஆவணங்களை இங்கு பதிவேற்றாதீர்கள்.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q072 — B06

**Exact entry:** [Q072 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2837-L2866). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q072` and `/journey/questions?lang=ta&id=Q072`.

**Ganesan checks:** F plus Check +1/+2 pass versus +2 minimum-average table; 45%/40% category conditions, not overall percentage/cutoff or a personal verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q072</summary>

**English**

**question:** Who is eligible to apply for TNEA?

**answer:** Eligibility depends on qualifying-examination pass, required subjects and minimum marks, the applicable school-study/nativity route and evidence. Meeting these conditions means you can be considered; it does not assure a seat.

**detail:** (No additional detail displayed.)

**next:** Check the applicable subjects, marks and study/nativity conditions; seek official help for any unresolved personal case.

**limit:** 2026 ordinary academic conditions, not a personal eligibility decision. Vocational and specially governed programmes differ; current-year authority is required.

**Tamil draft — not human-approved**

**question:** TNEA-வில் விண்ணப்பிக்க யாருக்குத் தகுதி உண்டு?

**answer:** தகுதித் தேர்வில் தேர்ச்சி, தேவையான பாடங்கள் மற்றும் குறைந்தபட்ச மதிப்பெண்கள், பொருந்தும் பள்ளிப் படிப்பு/பூர்வீக வழி, ஆதாரம் ஆகியவற்றைப் பொறுத்தே தகுதி அமையும். இவற்றை நிறைவு செய்தால் பரிசீலிக்கப்படலாம்; இடம் உறுதி அல்ல.

**detail:** (No additional detail displayed.)

**next:** பொருந்தும் பாடங்கள், மதிப்பெண்கள், படிப்பு/பூர்வீக நிபந்தனைகளைப் பாருங்கள்; தனிப்பட்ட சந்தேகத்துக்கு அதிகாரப்பூர்வ உதவியை நாடுங்கள்.

**limit:** 2026 வழக்கமான பள்ளிக் கல்வி நிபந்தனைகள்; தனிப்பட்ட தகுதித் தீர்ப்பு அல்ல. தொழிற்கல்வி மற்றும் சிறப்புப் படிப்புகள் வேறுபடும்; உரிய ஆண்டின் அதிகாரப்பூர்வ விதி தேவை.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q073 — B06

**Exact entry:** [Q073 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2869-L2898). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q073` and `/journey/questions?lang=ta&id=Q073`.

**Ganesan checks:** F plus Check +1/+2 pass versus +2 minimum-average table; 45%/40% category conditions, not overall percentage/cutoff or a personal verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q073</summary>

**English**

**question:** Which 12th-standard subjects are required for engineering admission?

**answer:** For ordinary 2026 TNEA academic entry, Mathematics, Physics and Chemistry are required. The brochure requires a pass in +1 and +2 or equivalent; its minimum-average table uses +2 Mathematics, Physics and Chemistry.

**detail:** (No additional detail displayed.)

**next:** Check the applicable subjects, marks and study/nativity conditions; seek official help for any unresolved personal case.

**limit:** 2026 ordinary academic conditions, not a personal eligibility decision. Vocational and specially governed programmes differ; current-year authority is required.

**Tamil draft — not human-approved**

**question:** பொறியியல் சேர்க்கைக்கு 12 ஆம் வகுப்பில் என்ன பாடங்கள் தேவை?

**answer:** வழக்கமான 2026 TNEA பள்ளிக் கல்வி வழிக்கு கணிதம், இயற்பியல், வேதியியல் தேவை. கையேடு 11 மற்றும் 12 ஆம் வகுப்பு அல்லது இணையான தேர்வில் தேர்ச்சியைக் கோருகிறது; குறைந்தபட்ச சராசரி அட்டவணை 12 ஆம் வகுப்பு கணிதம், இயற்பியல், வேதியியலைப் பயன்படுத்துகிறது.

**detail:** (No additional detail displayed.)

**next:** பொருந்தும் பாடங்கள், மதிப்பெண்கள், படிப்பு/பூர்வீக நிபந்தனைகளைப் பாருங்கள்; தனிப்பட்ட சந்தேகத்துக்கு அதிகாரப்பூர்வ உதவியை நாடுங்கள்.

**limit:** 2026 வழக்கமான பள்ளிக் கல்வி நிபந்தனைகள்; தனிப்பட்ட தகுதித் தீர்ப்பு அல்ல. தொழிற்கல்வி மற்றும் சிறப்புப் படிப்புகள் வேறுபடும்; உரிய ஆண்டின் அதிகாரப்பூர்வ விதி தேவை.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q074 — B06

**Exact entry:** [Q074 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2901-L2930). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q074` and `/journey/questions?lang=ta&id=Q074`.

**Ganesan checks:** F plus Check +1/+2 pass versus +2 minimum-average table; 45%/40% category conditions, not overall percentage/cutoff or a personal verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q074</summary>

**English**

**question:** What minimum marks are required to apply for engineering?

**answer:** For the ordinary 2026 TNEA academic table, the +2 Mathematics/Physics/Chemistry average minimum is 45% for General Category and 40% for the listed reserved categories. This is not overall percentage or the 200-mark cutoff, and marks alone do not establish eligibility.

**detail:** The listed 40% categories are BC (including BCM), MBC/DNC and SC/SCA/ST. These mean Backward Classes (including Backward Class Muslims), Most Backward Classes/Denotified Communities, Scheduled Castes/Scheduled Caste Arunthathiyars/Scheduled Tribes. Required category evidence applies; do not self-assign. Minimum eligibility does not use rounding or normalised marks; specially governed programmes need additional checks.

**next:** Check the applicable subjects, marks and study/nativity conditions; seek official help for any unresolved personal case.

**limit:** 2026 ordinary academic conditions, not a personal eligibility decision. Vocational and specially governed programmes differ; current-year authority is required.

**Tamil draft — not human-approved**

**question:** பொறியியல் விண்ணப்பிக்க குறைந்தபட்சம் என்ன மதிப்பெண் வேண்டும்?

**answer:** வழக்கமான 2026 TNEA பள்ளிக் கல்வி அட்டவணையில் 12 ஆம் வகுப்பு கணிதம்/இயற்பியல்/வேதியியல் சராசரி பொதுப் பிரிவுக்கு குறைந்தபட்சம் 45%; பட்டியலிடப்பட்ட இடஒதுக்கீட்டுப் பிரிவுகளுக்கு 40%. இது மொத்த சதவீதமோ 200-க்கு கட்-ஆஃபோ அல்ல. மதிப்பெண் மட்டும் தகுதியை உறுதிசெய்யாது.

**detail:** 40% பிரிவுகள்: BC/BCM — பிற்படுத்தப்பட்ட வகுப்பினர்/முஸ்லிம்கள்; MBC/DNC — மிகவும் பிற்படுத்தப்பட்ட வகுப்பினர்/சீர்மரபினர்; SC/SCA/ST — பட்டியல் சாதியினர்/அருந்ததியர்/பழங்குடியினர். உரிய ஆதாரம் வேண்டும்; தானாகப் பிரிவை எடுத்துக்கொள்ளாதீர்கள். குறைந்தபட்சத் தகுதிக்கு மதிப்பெண்ணை முழு எண்ணாக மாற்றுவதோ வாரிய ஒப்பீட்டு மாற்றமோ பயன்படாது; சிறப்புப் படிப்புகளுக்குக் கூடுதல் சரிபார்ப்பு தேவை.

**next:** பொருந்தும் பாடங்கள், மதிப்பெண்கள், படிப்பு/பூர்வீக நிபந்தனைகளைப் பாருங்கள்; தனிப்பட்ட சந்தேகத்துக்கு அதிகாரப்பூர்வ உதவியை நாடுங்கள்.

**limit:** 2026 வழக்கமான பள்ளிக் கல்வி நிபந்தனைகள்; தனிப்பட்ட தகுதித் தீர்ப்பு அல்ல. தொழிற்கல்வி மற்றும் சிறப்புப் படிப்புகள் வேறுபடும்; உரிய ஆண்டின் அதிகாரப்பூர்வ விதி தேவை.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q075 — B06

**Exact entry:** [Q075 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2933-L2962). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q075` and `/journey/questions?lang=ta&id=Q075`.

**Ganesan checks:** F plus Check +1/+2 pass versus +2 minimum-average table; 45%/40% category conditions, not overall percentage/cutoff or a personal verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q075</summary>

**English**

**question:** I am a CBSE student. Can I apply for TNEA?

**answer:** Yes, a CBSE student can apply if all applicable conditions are met. CBSE alone neither confirms nor rules out eligibility; subjects, marks and the school-study/nativity route must also be checked.

**detail:** For ranking across school boards, the authority uses its published normalisation method to compare marks. A simple raw-mark illustration is not the final official normalised score.

**next:** Check the applicable subjects, marks and study/nativity conditions; seek official help for any unresolved personal case.

**limit:** 2026 ordinary academic conditions, not a personal eligibility decision. Vocational and specially governed programmes differ; current-year authority is required.

**Tamil draft — not human-approved**

**question:** நான் CBSE மாணவர். TNEA-வில் விண்ணப்பிக்கலாமா?

**answer:** ஆம்; பொருந்தும் எல்லா நிபந்தனைகளையும் பூர்த்தி செய்தால் CBSE மாணவரும் விண்ணப்பிக்கலாம். CBSE என்பதால் மட்டும் தகுதி உறுதியாகவோ மறுக்கப்படவோ முடியாது. பாடங்கள், மதிப்பெண்கள், பள்ளிப் படிப்பு/பூர்வீக வழியையும் பார்க்க வேண்டும்.

**detail:** வாரியங்களுக்கு இடையே மதிப்பெண்களை ஒப்பிட்டு தரவரிசை அமைக்க அதிகாரிகள் வெளியிடப்பட்ட மாற்றுமுறையைப் பயன்படுத்துவார்கள். அசல் மதிப்பெண்களைக் கொண்ட எளிய விளக்கக் கணக்கு இறுதி அதிகாரப்பூர்வ மாற்றப்பட்ட மதிப்பெண் அல்ல.

**next:** பொருந்தும் பாடங்கள், மதிப்பெண்கள், படிப்பு/பூர்வீக நிபந்தனைகளைப் பாருங்கள்; தனிப்பட்ட சந்தேகத்துக்கு அதிகாரப்பூர்வ உதவியை நாடுங்கள்.

**limit:** 2026 வழக்கமான பள்ளிக் கல்வி நிபந்தனைகள்; தனிப்பட்ட தகுதித் தீர்ப்பு அல்ல. தொழிற்கல்வி மற்றும் சிறப்புப் படிப்புகள் வேறுபடும்; உரிய ஆண்டின் அதிகாரப்பூர்வ விதி தேவை.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q076 — B07

**Exact entry:** [Q076 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2965-L2994). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q076` and `/journey/questions?lang=ta&id=Q076`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q076</summary>

**English**

**question:** I studied outside Tamil Nadu. Can I apply for TNEA?

**answer:** Studying outside Tamil Nadu does not automatically exclude you. Under the 2026 rules, Tamil Nadu natives with any Classes VIII–XII study outside the state can apply with the required nativity evidence, subject to the other conditions; specified other routes also exist.

**detail:** Specified routes also cover certain government/institution employees’ children and All India Service Tamil Nadu cadre officers’ children, with prescribed evidence. Birthplace alone does not establish the native route.

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** தமிழ்நாட்டிற்கு வெளியே படித்தேன். TNEA-வில் விண்ணப்பிக்கலாமா?

**answer:** தமிழ்நாட்டிற்கு வெளியே படித்ததால் மட்டும் விண்ணப்பிக்க முடியாது என்று ஆகாது. 2026 விதிகளில், தமிழ்நாட்டைப் பூர்வீகமாகக் கொண்டு 8–12 வகுப்புகளில் ஏதேனும் ஒன்றை வெளியில் படித்தவர், தேவையான பூர்வீகச் சான்றுடன் மற்ற நிபந்தனைகளையும் பூர்த்தி செய்து விண்ணப்பிக்கலாம். குறிப்பிட்ட வேறு வழிகளும் உள்ளன.

**detail:** குறிப்பிட்ட அரசு/நிறுவன ஊழியர்களின் பிள்ளைகள் மற்றும் தமிழ்நாடு பணிப்பிரிவு அகில இந்தியப் பணி அதிகாரிகளின் பிள்ளைகளுக்கும் உரிய ஆதார நிபந்தனைகளுடன் வழிகள் உள்ளன. பிறந்த இடம் மட்டும் பூர்வீக வழியை உறுதிசெய்யாது.

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q077 — B07

**Exact entry:** [Q077 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L2997-L3026). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q077` and `/journey/questions?lang=ta&id=Q077`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q077</summary>

**English**

**question:** What does nativity mean for TNEA?

**answer:** Nativity is the native-status category recognised by the admission rules. Birthplace alone cannot establish it; your school-study history and the required evidence matter.

**detail:** (No additional detail displayed.)

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** TNEA-வில் பூர்வீகம் என்றால் என்ன?

**answer:** பூர்வீகம் என்பது சேர்க்கை விதிகளின்படி ஏற்கப்படும் சொந்த மாநில நிலை. பிறந்த இடம் மட்டும் அதை உறுதிசெய்யாது; பள்ளிப் படிப்பு வரலாறும் தேவையான ஆதாரமும் முக்கியம்.

**detail:** (No additional detail displayed.)

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q078 — B07

**Exact entry:** [Q078 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3029-L3058). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q078` and `/journey/questions?lang=ta&id=Q078`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q078</summary>

**English**

**question:** I was born in Tamil Nadu but studied outside the state. What should I check?

**answer:** Keep both facts in view: Tamil Nadu birth and outside-state study. Check whether you meet the Tamil Nadu native route and have its prescribed nativity certificate; birthplace alone is not enough to confirm eligibility.

**detail:** Under the 2026 rule, Tamil Nadu natives who studied any of Classes VIII–XII outside the state need the required electronic/digitally signed nativity certificate, subject to other conditions. Preserve the exact class-year history when asking for help.

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** தமிழ்நாட்டில் பிறந்தேன்; வெளிமாநிலத்தில் படித்தேன். என்ன சரிபார்க்க வேண்டும்?

**answer:** தமிழ்நாட்டில் பிறந்ததும் வெளிமாநிலத்தில் படித்ததும் இரண்டையும் வைத்துப் பாருங்கள். தமிழ்நாடு பூர்வீக வழி உங்களுக்குப் பொருந்துமா, அதற்கான பூர்வீகச் சான்று உள்ளதா என்று சரிபாருங்கள். பிறந்த இடம் மட்டும் தகுதியை உறுதிசெய்யாது.

**detail:** 2026 விதியில், தமிழ்நாட்டைப் பூர்வீகமாகக் கொண்டு 8–12 வகுப்புகளில் ஏதேனும் ஒன்றை வெளியில் படித்தவருக்கு, மற்ற நிபந்தனைகளுடன் தேவையான மின்னணு/டிஜிட்டல் கையொப்பப் பூர்வீகச் சான்று வேண்டும். உதவி கேட்கும்போது எந்த வகுப்பில் எங்கு படித்தீர்கள் என்ற விவரத்தை வைத்திருங்கள்.

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q079 — B07

**Exact entry:** [Q079 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3061-L3090). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q079` and `/journey/questions?lang=ta&id=Q079`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q079</summary>

**English**

**question:** I studied in Tamil Nadu but was born outside the state. What should I check?

**answer:** Check whether all Classes VIII–XII were studied in Tamil Nadu. Under the 2026 route, other-state candidates with all five years here can apply without a nativity certificate, subject to academic conditions, under Open Competition rather than a reserved community allocation.

**detail:** If only some of these five years were in Tamil Nadu, do not assume this route applies. Community reservation needs its separate check.

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** தமிழ்நாட்டில் படித்தேன்; வேறு மாநிலத்தில் பிறந்தேன். என்ன சரிபார்க்க வேண்டும்?

**answer:** 8, 9, 10, 11, 12 ஆகிய ஐந்து வகுப்புகளையும் தமிழ்நாட்டில் படித்தீர்களா என்று பாருங்கள். 2026 விதியில், இவ்வாறு படித்த மற்ற மாநில மாணவர் கல்வித் தகுதிக்கு உட்பட்டு பூர்வீகச் சான்றின்றி பொதுப் போட்டிப் பிரிவில் விண்ணப்பிக்கலாம்; அது தனிச் சமூக இடஒதுக்கீடு அல்ல.

**detail:** இந்த ஐந்து ஆண்டுகளில் சில மட்டும் தமிழ்நாட்டில் இருந்தால் இதே வழி பொருந்தும் என்று ஊகிக்காதீர்கள். சமூக இடஒதுக்கீட்டைத் தனியாகச் சரிபார்க்க வேண்டும்.

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q080 — B07

**Exact entry:** [Q080 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3093-L3122). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q080` and `/journey/questions?lang=ta&id=Q080`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q080</summary>

**English**

**question:** What happens if I wrote an improvement exam?

**answer:** The 2026 brochure says improvement marks obtained from 2006 onwards are not considered, including for other-state candidates. Do not simply replace original marks with improved marks in a calculation.

**detail:** If you do not know whether a later exam counts as improvement or another qualifying situation, take both records privately to official TFC help for clarification.

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** மதிப்பெண் மேம்பாட்டுத் தேர்வு எழுதியிருந்தால் என்ன ஆகும்?

**answer:** 2006 முதல் பெற்ற மேம்பாட்டுத் தேர்வு மதிப்பெண்கள் கணக்கில் எடுத்துக்கொள்ளப்படாது என்று 2026 கையேடு கூறுகிறது; மற்ற மாநில மாணவர்களுக்கும் இது பொருந்தும். கணக்கீட்டில் அசல் மதிப்பெண்ணை மேம்படுத்திய மதிப்பெண்ணால் தானாக மாற்றாதீர்கள்.

**detail:** பின்னர் எழுதிய தேர்வு மேம்பாட்டுத் தேர்வா அல்லது வேறு தகுதி நிலையா என்று தெரியாவிட்டால், இரு பதிவுகளையும் தனிப்பட்ட முறையில் அதிகாரப்பூர்வ TFC உதவிக்கு எடுத்துச் சென்று விளக்கம் கேளுங்கள்.

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q081 — B07

**Exact entry:** [Q081 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3125-L3165). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q081` and `/journey/questions?lang=ta&id=Q081`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling; S5 (Government of Tamil Nadu / DoTE, **Tamil Nadu Lateral Entry — Direct Second Year B.E./B.Tech Admissions 2026–27: General Information to Candidates**) — Printed/PDF p.1 title and official portal; p.2 document list; p.3 scope/duration; p.4 nativity; p.5 qualifying examinations and minimum average. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q081</summary>

**English**

**question:** I have a vocational or different school-study background. How do I know whether I am eligible?

**answer:** First identify your exact qualifying course. The 2026 HSC vocational route has its own subject/marks and ranking tables; diploma entry uses TNLEA instead. An unlisted or equivalent background needs official recognition and subject-rule confirmation.

**detail:** The 2026 vocational table lists Basic Mechanical, Electrical, Electronics, Civil, Automobile Engineering and Textile Technology groups with a prescribed related Mathematics, Physics or Chemistry subject. The related subject plus vocational theory/practical average is 45% for General and 40% for the listed reserved categories. Do not replace its separate merit weighting with the academic formula.

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** தொழிற்கல்வி அல்லது வேறுவகைப் பள்ளிப் படிப்பு படித்தேன். என் தகுதியை எப்படித் தெரிந்துகொள்வது?

**answer:** முதலில் உங்கள் தகுதிப் படிப்பின் சரியான பெயரைப் பாருங்கள். 2026 மேல்நிலைத் தொழிற்கல்வி வழிக்குத் தனிப் பாடம்/மதிப்பெண் மற்றும் தரவரிசை அட்டவணைகள் உள்ளன; டிப்ளமோ வழி TNLEA-விற்கு உரியது. பட்டியலில் இல்லாத அல்லது இணையான படிப்புக்கு அங்கீகாரத்தையும் பாட விதியையும் அதிகாரப்பூர்வமாக உறுதிசெய்ய வேண்டும்.

**detail:** 2026 தொழிற்கல்வி அட்டவணையில் அடிப்படை இயந்திரம், மின்சாரம், மின்னணு, கட்டடவியல், வாகனப் பொறியியல், துணிநுட்பக் குழுக்களுடன் குறிப்பிட்ட கணிதம்/இயற்பியல்/வேதியியல் தொடர்புப் பாடம் உள்ளது. தொடர்புப் பாடம் மற்றும் தொழிற்கல்விக் கருத்தியல்/செய்முறை சராசரி பொதுப் பிரிவுக்கு 45%; பட்டியலிடப்பட்ட இடஒதுக்கீட்டுப் பிரிவுகளுக்கு 40%. அதன் தனி தரவரிசை பங்கீட்டுக்குப் பதிலாகப் பொதுப் பள்ளிக் கல்வி சூத்திரத்தைப் பயன்படுத்தாதீர்கள்.

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q083; related IDs Q060, Q002. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q082 — B05

**Exact entry:** [Q082 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3168-L3197). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q082` and `/journey/questions?lang=ta&id=Q082`.

**Ganesan checks:** F plus Core versus conditional documents, reservation/concession proof and privacy; no guaranteed entitlement.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q082</summary>

**English**

**question:** What documents should I obtain before the application starts?

**answer:** Collect available Class 10, +1 and +2/equivalent marksheets, transfer certificate and school records early; then obtain the community, nativity, income or special-claim evidence that applies to your route.

**detail:** Depending on the claim, the 2026 list includes government-school study proof for Classes 6–12; First Graduate certificate and joint declaration; refugee evidence; and prescribed sports, disability or ex-servicemen documents. Relevant parent/employer declarations may apply to a special nativity route. Keep originals and readable copies private; use official upload channels only.

**next:** Prepare the documents that apply to you privately; ask official TNEA help about a missing certificate or format.

**limit:** Based on the 2026 list. The applicable upload format and deadline need the official notice; do not upload private records here.

**Tamil draft — not human-approved**

**question:** விண்ணப்பம் தொடங்கும் முன் என்ன ஆவணங்களைப் பெற வேண்டும்?

**answer:** கிடைக்கும் 10, 11, 12 ஆம் வகுப்பு அல்லது இணையான மதிப்பெண் சான்றுகள், மாற்றுச் சான்றிதழ், பள்ளிப் பதிவுகளை முன்கூட்டியே சேகரியுங்கள். உங்கள் வழிக்குப் பொருந்தும் சமூகப் பிரிவு, பூர்வீகம், வருமானம் அல்லது சிறப்புக் கோரிக்கை ஆதாரங்களைப் பெறுங்கள்.

**detail:** கோரிக்கையைப் பொறுத்து 2026 பட்டியலில் 6–12 வகுப்பு அரசுப் பள்ளிப் படிப்புச் சான்று; முதல் பட்டதாரிச் சான்றும் கூட்டுறுதிமொழியும்; அகதி ஆதாரம்; விளையாட்டு, மாற்றுத்திறன், முன்னாள் படைவீரர் ஆவணங்கள் உள்ளன. சிறப்புப் பூர்வீக வழிக்கு பெற்றோர்/பணியாளர் உறுதிமொழிகள் பொருந்தலாம். அசல் ஆவணங்களையும் தெளிவான நகல்களையும் தனிப்பட்ட முறையில் வைத்திருங்கள்; அதிகாரப்பூர்வ பதிவேற்ற வழியை மட்டுமே பயன்படுத்துங்கள்.

**next:** உங்களுக்குப் பொருந்தும் ஆவணங்களைத் தனிப்பட்ட முறையில் தயாரியுங்கள்; இல்லாத சான்று அல்லது வடிவம் பற்றி அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 பட்டியலை அடிப்படையாகக் கொண்டது. பொருந்தும் பதிவேற்ற வடிவமும் காலக்கெடுவும் அதிகாரப்பூர்வ அறிவிப்பில் பார்க்கப்பட வேண்டும்; தனிப்பட்ட ஆவணங்களை இங்கு பதிவேற்றாதீர்கள்.

</details>

**Navigation:** next question Q083; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q083 — B07

**Exact entry:** [Q083 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3200-L3229). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q083` and `/journey/questions?lang=ta&id=Q083`.

**Ganesan checks:** F plus Retain exact VIII–XII history, nativity/community distinction, improvement-year boundary and separate vocational weighting; unknown is not rejection.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q083</summary>

**English**

**question:** What should I do if I am unsure whether my eligibility case is covered?

**answer:** Keep the result unconfirmed. Note the admission year, qualifying course, school-study history and the precise uncertainty, then ask official TNEA/TFC help which rule and evidence apply. Unknown does not mean rejected.

**detail:** (No additional detail displayed.)

**next:** Write down the one unresolved course or study-history detail and ask official TNEA help which evidence is required.

**limit:** 2026 rules only; this explanation does not decide your nativity, category or eligibility from incomplete facts.

**Tamil draft — not human-approved**

**question:** என் தகுதி நிலைக்கு விதி பொருந்துகிறதா என்று தெரியாவிட்டால் என்ன செய்ய வேண்டும்?

**answer:** முடிவை இன்னும் உறுதிசெய்யப்படாததாக வைத்துக்கொள்ளுங்கள். ஆண்டு, தகுதிப் படிப்பு, பள்ளிப் படிப்பு வரலாறு, சரியான சந்தேகத்தை எழுதி அதிகாரப்பூர்வ TNEA/TFC உதவியில் எந்த விதியும் ஆதாரமும் பொருந்தும் என்று கேளுங்கள். தெரியவில்லை என்பது மறுக்கப்பட்டது என்று அர்த்தமல்ல.

**detail:** (No additional detail displayed.)

**next:** தெளிவில்லாத ஒரு படிப்பு அல்லது பள்ளி வரலாற்று விவரத்தை எழுதிக்கொண்டு, எந்த ஆதாரம் தேவை என்று அதிகாரப்பூர்வ TNEA உதவியில் கேளுங்கள்.

**limit:** 2026 விதிகள் மட்டுமே; முழுமையற்ற தகவலிலிருந்து உங்கள் பூர்வீகம், சமூகப் பிரிவு அல்லது தகுதியை இந்த விளக்கம் முடிவு செய்யாது.

</details>

**Navigation:** next question Q071; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q002 — B08

**Exact entry:** [Q002 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3232-L3261). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q002` and `/journey/questions?lang=ta&id=Q002`.

**Ganesan checks:** F plus Check M100/P50/C50 raw example, official normalisation and rank distinction; no prediction or broader eligibility verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q002</summary>

**English**

**question:** What exactly is the TNEA cutoff mark and how is it calculated?

**answer:** For ordinary 2026 academic merit, cutoff is a weighted score out of 200: Mathematics up to 100, Physics 50 and Chemistry 50. When all three marks are out of 100, the illustration is M + P/2 + C/2.

**detail:** Teaching example only: marks of 90, 80 and 70 out of 100 give 90 + 80/2 + 70/2 = 165/200. This is not your result or official normalised score. A college’s past closing score is another use of “cutoff”, not a guaranteed entry threshold.

**next:** Understand the score before using it; check official rank in the published list. A personal calculation is optional.

**limit:** 2026 academic weighting; official board normalisation may apply. Vocational weighting differs. A score is not eligibility, rank or an admission prediction.

**Tamil draft — not human-approved**

**question:** TNEA கட்-ஆஃப் மதிப்பெண் என்றால் என்ன? எப்படி கணக்கிடப்படுகிறது?

**answer:** வழக்கமான 2026 பள்ளிக் கல்வி வழியில் கட்-ஆஃப் என்பது 200-க்கு கணக்கிடப்படும் மதிப்பெண்: கணிதம் அதிகபட்சம் 100, இயற்பியல் 50, வேதியியல் 50. மூன்றும் 100-க்கு இருந்தால் விளக்கச் சூத்திரம்: கணிதம் + இயற்பியல்/2 + வேதியியல்/2.

**detail:** விளக்கத்திற்கான கற்பனை உதாரணம் மட்டும்: 100-க்கு 90, 80, 70 என்ற மதிப்பெண்கள் இருந்தால் 90 + 80/2 + 70/2 = 165/200. இது உங்கள் முடிவோ அதிகாரப்பூர்வ மாற்றப்பட்ட மதிப்பெண்ணோ அல்ல. கல்லூரியில் முன்பு கடைசியாக இடம் பெற்றவரின் மதிப்பெண்ணையும் “கட்-ஆஃப்” என்பார்கள்; அது இடத்தை உறுதி செய்யும் வரம்பு அல்ல.

**next:** மதிப்பெண்ணைப் பயன்படுத்தும் முன் அதன் பொருளைப் புரிந்துகொள்ளுங்கள்; அதிகாரப்பூர்வப் பட்டியலில் தரவரிசையைப் பாருங்கள். தனிப்பட்ட கணக்கீடு விருப்பம் மட்டுமே.

**limit:** 2026 பள்ளிக் கல்வி மதிப்பெண் பங்கீடு; வாரிய மதிப்பெண்களை ஒப்பிடத்தக்க அளவுக்கு மாற்றும் அதிகாரப்பூர்வ முறை பொருந்தலாம். தொழிற்கல்வியின் பங்கீடு வேறு. மதிப்பெண் தகுதி, தரவரிசை அல்லது சேர்க்கை கணிப்பு அல்ல.

</details>

**Navigation:** next question Q086; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q084 — B08

**Exact entry:** [Q084 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3264-L3293). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q084` and `/journey/questions?lang=ta&id=Q084`.

**Ganesan checks:** F plus Check M100/P50/C50 raw example, official normalisation and rank distinction; no prediction or broader eligibility verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q084</summary>

**English**

**question:** Is TNEA cutoff the same as my 12th-standard percentage?

**answer:** No. Overall percentage can use different subjects and weights. TNEA academic cutoff weights Mathematics, Physics and Chemistry out of 200; the minimum-eligibility subject average is also a separate measure.

**detail:** (No additional detail displayed.)

**next:** Understand the score before using it; check official rank in the published list. A personal calculation is optional.

**limit:** 2026 academic weighting; official board normalisation may apply. Vocational weighting differs. A score is not eligibility, rank or an admission prediction.

**Tamil draft — not human-approved**

**question:** TNEA கட்-ஆஃபும் 12 ஆம் வகுப்பு மொத்த சதவீதமும் ஒன்றா?

**answer:** இல்லை. மொத்த சதவீதத்தில் வேறு பாடங்களும் பங்கீடும் இருக்கலாம். TNEA பள்ளிக் கல்வி கட்-ஆஃப் கணிதம், இயற்பியல், வேதியியலை 200-க்கு கணக்கிடுகிறது. குறைந்தபட்சத் தகுதிக்கான பாடச் சராசரியும் வேறு அளவு.

**detail:** (No additional detail displayed.)

**next:** மதிப்பெண்ணைப் பயன்படுத்தும் முன் அதன் பொருளைப் புரிந்துகொள்ளுங்கள்; அதிகாரப்பூர்வப் பட்டியலில் தரவரிசையைப் பாருங்கள். தனிப்பட்ட கணக்கீடு விருப்பம் மட்டுமே.

**limit:** 2026 பள்ளிக் கல்வி மதிப்பெண் பங்கீடு; வாரிய மதிப்பெண்களை ஒப்பிடத்தக்க அளவுக்கு மாற்றும் அதிகாரப்பூர்வ முறை பொருந்தலாம். தொழிற்கல்வியின் பங்கீடு வேறு. மதிப்பெண் தகுதி, தரவரிசை அல்லது சேர்க்கை கணிப்பு அல்ல.

</details>

**Navigation:** next question Q086; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q085 — B08

**Exact entry:** [Q085 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3296-L3325). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q085` and `/journey/questions?lang=ta&id=Q085`.

**Ganesan checks:** F plus Check M100/P50/C50 raw example, official normalisation and rank distinction; no prediction or broader eligibility verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q085</summary>

**English**

**question:** Why is TNEA cutoff calculated out of 200?

**answer:** The prescribed academic weights add to 200: Mathematics 100 + Physics 50 + Chemistry 50. It is a weighting of school marks, not another 200-mark examination.

**detail:** (No additional detail displayed.)

**next:** Understand the score before using it; check official rank in the published list. A personal calculation is optional.

**limit:** 2026 academic weighting; official board normalisation may apply. Vocational weighting differs. A score is not eligibility, rank or an admission prediction.

**Tamil draft — not human-approved**

**question:** TNEA கட்-ஆஃப் ஏன் 200-க்கு கணக்கிடப்படுகிறது?

**answer:** பள்ளிக் கல்வி வழிக்குக் குறிப்பிட்ட பங்கீடு கணிதம் 100 + இயற்பியல் 50 + வேதியியல் 50; மொத்தம் 200. இது பள்ளி மதிப்பெண்களின் பங்கீடு; இன்னொரு 200 மதிப்பெண் தேர்வு அல்ல.

**detail:** (No additional detail displayed.)

**next:** மதிப்பெண்ணைப் பயன்படுத்தும் முன் அதன் பொருளைப் புரிந்துகொள்ளுங்கள்; அதிகாரப்பூர்வப் பட்டியலில் தரவரிசையைப் பாருங்கள். தனிப்பட்ட கணக்கீடு விருப்பம் மட்டுமே.

**limit:** 2026 பள்ளிக் கல்வி மதிப்பெண் பங்கீடு; வாரிய மதிப்பெண்களை ஒப்பிடத்தக்க அளவுக்கு மாற்றும் அதிகாரப்பூர்வ முறை பொருந்தலாம். தொழிற்கல்வியின் பங்கீடு வேறு. மதிப்பெண் தகுதி, தரவரிசை அல்லது சேர்க்கை கணிப்பு அல்ல.

</details>

**Navigation:** next question Q086; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q086 — B08

**Exact entry:** [Q086 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3328-L3357). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q086` and `/journey/questions?lang=ta&id=Q086`.

**Ganesan checks:** F plus Check M100/P50/C50 raw example, official normalisation and rank distinction; no prediction or broader eligibility verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q086</summary>

**English**

**question:** What is the difference between cutoff and rank?

**answer:** Cutoff is a mark; rank is your position in the authority’s ordered applicant list. The year’s merit and tie-breaking rules can give different ranks even to applicants with equal cutoff marks.

**detail:** (No additional detail displayed.)

**next:** Understand the score before using it; check official rank in the published list. A personal calculation is optional.

**limit:** 2026 academic weighting; official board normalisation may apply. Vocational weighting differs. A score is not eligibility, rank or an admission prediction.

**Tamil draft — not human-approved**

**question:** கட்-ஆஃபுக்கும் தரவரிசைக்கும் என்ன வேறுபாடு?

**answer:** கட்-ஆஃப் ஒரு மதிப்பெண்; தரவரிசை என்பது அதிகாரிகள் வரிசைப்படுத்திய விண்ணப்பதாரர் பட்டியலில் உங்கள் இடம். ஒரே கட்-ஆஃப் இருந்தாலும் அந்த ஆண்டின் சமமதிப்பெண் விதிகளால் தரவரிசை மாறலாம்.

**detail:** (No additional detail displayed.)

**next:** மதிப்பெண்ணைப் பயன்படுத்தும் முன் அதன் பொருளைப் புரிந்துகொள்ளுங்கள்; அதிகாரப்பூர்வப் பட்டியலில் தரவரிசையைப் பாருங்கள். தனிப்பட்ட கணக்கீடு விருப்பம் மட்டுமே.

**limit:** 2026 பள்ளிக் கல்வி மதிப்பெண் பங்கீடு; வாரிய மதிப்பெண்களை ஒப்பிடத்தக்க அளவுக்கு மாற்றும் அதிகாரப்பூர்வ முறை பொருந்தலாம். தொழிற்கல்வியின் பங்கீடு வேறு. மதிப்பெண் தகுதி, தரவரிசை அல்லது சேர்க்கை கணிப்பு அல்ல.

</details>

**Navigation:** next question Q087; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

### Q087 — B08

**Exact entry:** [Q087 implemented EN/TA fields](https://github.com/Ganesan797/tn-engineering-guidance/blob/e052f1d6453af03e5c389dbcb739ce41836d5c92/data/m2_question_answers_v1.json#L3360-L3391). **Completeness:** EN DIRECT; TA DIRECT. **Pages:** `/journey/questions?lang=en&id=Q087` and `/journey/questions?lang=ta&id=Q087`.

**Ganesan checks:** F plus Check M100/P50/C50 raw example, official normalisation and rank distinction; no prediction or broader eligibility verdict.

**Source references / applicable year:** S1 (Directorate of Technical Education, **Tamil Nadu Engineering Admissions 2026 — Information Brochure**) — Printed p.1, admission scope/§1; pp.1–3 §3 eligibility/nativity; p.4 §4.2 community evidence; p.5 §5 special reservation; p.9 §6(a) merit/normalisation/tie-break; p.10 §6(b) vocational and §7 concessions; pp.11–12 §§8–9 registration/documents; pp.12–14 §10 counselling. See register and linked evidence notes for URL/conditions.

<details>
<summary>Exact English and Tamil content to review — Q087</summary>

**English**

**question:** Does the same cutoff give the same rank every year?

**answer:** No. The applicant group and its marks change each year, so the same cutoff need not produce the same rank. Last year’s rank cannot establish this year’s rank or admission outcome.

**detail:** (No additional detail displayed.)

**next:** Understand the score before using it; check official rank in the published list. A personal calculation is optional.

**limit:** 2026 academic weighting; official board normalisation may apply. Vocational weighting differs. A score is not eligibility, rank or an admission prediction.

**Tamil draft — not human-approved**

**question:** ஒரே கட்-ஆஃப் இருந்தால் ஒவ்வொரு ஆண்டும் அதே தரவரிசை கிடைக்குமா?

**answer:** இல்லை. ஒவ்வொரு ஆண்டும் விண்ணப்பதாரர்களும் அவர்களுடைய மதிப்பெண்களும் மாறுவதால் ஒரே கட்-ஆஃபிற்கு அதே தரவரிசை கிடைக்க வேண்டியதில்லை. கடந்த ஆண்டின் தரவரிசை இந்த ஆண்டின் தரவரிசையையோ சேர்க்கையையோ உறுதிசெய்யாது.

**detail:** (No additional detail displayed.)

**next:** மதிப்பெண்ணைப் பயன்படுத்தும் முன் அதன் பொருளைப் புரிந்துகொள்ளுங்கள்; அதிகாரப்பூர்வப் பட்டியலில் தரவரிசையைப் பாருங்கள். தனிப்பட்ட கணக்கீடு விருப்பம் மட்டுமே.

**limit:** 2026 பள்ளிக் கல்வி மதிப்பெண் பங்கீடு; வாரிய மதிப்பெண்களை ஒப்பிடத்தக்க அளவுக்கு மாற்றும் அதிகாரப்பூர்வ முறை பொருந்தலாம். தொழிற்கல்வியின் பங்கீடு வேறு. மதிப்பெண் தகுதி, தரவரிசை அல்லது சேர்க்கை கணிப்பு அல்ல.

</details>

**Navigation:** next question Q086; related IDs none. Review localized next-action text and destination, not just answer prose.

| Review | Outcome | Reviewer | Date | Finding / evidence / conditions |
| --- | --- | --- | --- | --- |
| Factual — Ganesan | NOT REVIEWED | | | |
| Human Tamil — apply T to all fields above and rendered navigation | NOT REVIEWED | | | |

## Review completion record — leave unapproved until humans review

| Gate | Outcome | Reviewer / date / actual commit | Findings and residual limits |
| --- | --- | --- | --- |
| Factual scope: J01–J20 and all 70 IDs | NOT REVIEWED | | |
| Human Tamil: J01–J20 and all 70 pairs | NOT REVIEWED | | |
| Actual student validation (T04, separate procedure) | NOT REVIEWED | | |
| M2 acceptance (T05, explicit owner decision) | NOT REVIEWED | | |

**Preparation integrity checks executed:** 70 unique question cards matched the implemented IDs/units; every copied English/Tamil question, answer, detail, next action and limit matched the baseline; 20 screen/state/control items have separate factual/Tamil rows; all 184 item/summary outcome rows are NOT REVIEWED; 89 local links resolve; whitespace, four-file documentation-only scope and credential-pattern checks passed. Student-facing content, rules, tests and frozen documents are unchanged. These checks validate preparation only. Prior 210/210 offline tests and typecheck belong to the integration record; they were not rerun for this documentation-only preparation and are not human review evidence. Gemini PAUSED; Live LLM Gate PARTIAL. No application/content/rule changes, model calls or conversational implementation authorized here.

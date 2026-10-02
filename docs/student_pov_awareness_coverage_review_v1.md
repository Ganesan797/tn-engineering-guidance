# A01–A07 Coverage and Student POV Review V1

Review date: 2026-10-02. Reviewed base: `c3c7c61923fde714e566a7de9b607d08095807ea`.

`REVIEW_TYPE = OFFLINE_CONTENT_AND_PAPER_JOURNEY_REVIEW`

`CONTENT_DEVELOPMENT = OWNER_ACCEPTED_WITH_FOCUSED_FOLLOW_UPS`

`FINAL_FACTUAL_APPROVAL = PENDING`

`FINAL_TAMIL_APPROVAL = PENDING`

`ACTUAL_STUDENT_VALIDATION = PENDING`

## Basis and boundaries

Reviewed the preserved [batch](student_pov_awareness_batch_a01_a07_v1.md), [intent map](student_question_intent_review_v1.md), [owner decision](student_pov_awareness_review_decision_v1.md), frozen [Product Mission](product_mission.md), [Student Journey](student_journey_v1.md) and [Input/Output contract](student_input_output_v1.md). The raw corpus was read directly from `C:/Users/Ganesan S/Dropbox/My PC (DESKTOP-0AC6TMJ)/Downloads/student_question_corpus_v1_draft.md`; all 168 question headings were available. No missing original question or answer was reconstructed. The table below uses short reviewer descriptions, not claimed verbatim quotations.

The original batch, intent map, decision, corpus and frozen documents remain unchanged. This review does not rescind content-development acceptance or grant factual/Tamil approval. No web research, live model request or application implementation was performed.

## Coverage method and counts

- ANSWERED: supplies the requested awareness explanation or a usable decision method. Does not mean factual verification or personalized suitability has passed.
- PARTIAL: supplies relevant substance but omits a material part of the question.
- DEFERRED: explicitly postpones the requested factual answer or supplies no substantive answer to it. A safe next question alone does not make the original question answered.

All 31 IDs in INT-01 through INT-04 appear exactly once in the batch assignments: **7 ANSWERED, 15 PARTIAL, 9 DEFERRED**. The other 137 corpus questions are outside this review, not missing batch assignments.

| Question | Unit | Coverage | Reason / unresolved need |
| --- | --- | --- | --- |
| Q025 | A01 | ANSWERED | Gives a starting point: explore fields before marks or college selection. Synthetic wording remains synthetic. |
| Q026 | A01 | ANSWERED | Defines engineering at introductory depth. |
| Q027 | A01 | PARTIAL | Explains engineering's problem-solving purpose, but not why a student might choose to study it. |
| Q028 | A01 | PARTIAL | Broad activity description; no concrete example of an engineer's work. |
| Q034 | A01 | ANSWERED | Supplies an actionable first exploration step. |
| Q035 | A01 | PARTIAL | Introduces fields but leaves study demands and pathway awareness unexplained. |
| Q030 | A02 | PARTIAL | Avoids an unsupported suitability verdict and starts reflection, but offers little structure for assessing fit. |
| Q031 | A02 | PARTIAL | Acknowledges mathematics and difficulty; does not explain expected learning demands or support. |
| Q032 | A02 | PARTIAL | Invites interests but gives no concrete skills/interests examples. |
| Q029 | A03 | DEFERRED | Explicitly withholds engineering-versus-science differences. |
| Q033 | A03 | DEFERRED | No alternative courses are described; asking the novice to name one does not provide options. |
| Q036 | A04 | ANSWERED | Provides a useful, explicitly non-exhaustive map of broad field families. |
| Q037 | A04 | PARTIAL | Computing family is relevant, but CSE itself is not explained. |
| Q038 | A04 | PARTIAL | Computing family is relevant, but IT itself is not explained. |
| Q039 | A04 | PARTIAL | Electronics/communication themes appear without an ECE explanation. |
| Q040 | A04 | PARTIAL | Electrical/electronics themes appear without an EEE explanation. |
| Q041 | A04 | PARTIAL | Machines/design/manufacturing give orientation, but no explicit Mechanical profile. |
| Q042 | A04 | PARTIAL | Buildings/transport/infrastructure give orientation, but no explicit Civil profile. |
| Q043 | A04 | DEFERRED | Does not explain AI & Data Science or AI & ML; generic computing/data labels are insufficient. |
| Q044 | A04 | PARTIAL | Broad topics are offered, while branch-level subjects and practical learning remain missing. |
| Q010 | A05 | PARTIAL | Offers a curriculum-comparison method but neither compares the named pair nor supports a choice. |
| Q011 | A05 | DEFERRED | Explicitly withholds IT/CSE differences; the similar-cutoff misconception is not addressed. |
| Q049 | A05 | DEFERRED | No four-way differences; prompting for only two branches narrows the requested comparison. |
| Q050 | A05 | ANSWERED | Identifies subjects, practical work and projects as things to inspect in official syllabuses. |
| Q012 | A06 | PARTIAL | Challenges popularity-led selection but does not discuss the requested Mechanical/Civil alternatives. |
| Q021 | A06 | DEFERRED | Explicitly sets aside ECE/CSE admission difficulty and cutoff; appropriate scope boundary but not an answer. |
| Q047 | A06 | ANSWERED | Gives an introductory method: examine study content, practical interests and support; no branch assigned. |
| Q048 | A06 | ANSWERED | Directly broadens the decision beyond placement claims and asks for verification. |
| Q045 | A07 | DEFERRED | No branch-specific career options are provided. |
| Q046 | A07 | DEFERRED | Explicitly withholds non-CSE-to-software pathway conclusions. |
| Q051 | A07 | DEFERRED | Explicitly withholds career-change requirements and feasibility. |

| Unit | ANSWERED | PARTIAL | DEFERRED |
| --- | --- | --- | --- |
| A01 | 3 | 3 | 0 |
| A02 | 0 | 3 | 0 |
| A03 | 0 | 0 | 2 |
| A04 | 1 | 7 | 1 |
| A05 | 1 | 1 | 2 |
| A06 | 2 | 1 | 1 |
| A07 | 0 | 0 | 3 |
| Total | 7 | 15 | 9 |

## Directness, comparison fidelity and next direction

| Unit | Review |
| --- | --- |
| A01 | Direct on engineering and getting started. The four example fields are a useful prompt, but provide an explicit “not sure” route later so the novice need not invent an interest. |
| A02 | Reassuring, but the generic subject/activity follow-up does not follow up a stated mathematics concern. For Q031, retain the stated concern and ask one relevant question; avoid an aptitude verdict. |
| A03 | Honest deferral. Asking the student to name an alternative may stall someone asking what alternatives exist. Offer supported orientation before asking for a selection in a future revision. |
| A04 | Useful field map. Repeating “which group?” after the student already chose computing creates a loop. Follow their selected field into a supported profile. |
| A05 | No ECE substitution occurs, but exact intent is still not fully preserved: Q010/Q011 already specify a pair, and Q049 asks about four branches. Re-asking the pair or silently narrowing four to two is unnecessary. Keep the supplied entities and ask only missing context if needed for evidence selection. |
| A06 | Useful choice checklist. Q012 needs explicit acknowledgment of Mechanical/Civil and its popularity concern. Q021 is a valid deferral but needs a relevant later admission handoff rather than an unrelated curiosity prompt. |
| A07 | Useful caution, but Q046 already names software: asking what work interests the student repeats known context. Preserve that goal and identify the evidence needed for that pathway. |

## Three separate review axes

Answer completeness is the question-level assessment above. Factual verification asks whether the actual claims are supported within the correct source scope. Tamil readiness asks whether students understand the meaning naturally and consistently. None substitutes for another.

| Units | Existing factual support | Factual approval | Tamil readiness |
| --- | --- | --- | --- |
| A01/A02 | AW-01 and AW-09 support introductory engineering and awareness before personal data; AW-07 supports interest exploration. They do not establish personal aptitude or readiness thresholds. | PENDING; supported baseline, new examples/learning-demand claims need review. | DRAFT; volunteer comprehension and equivalence review pending. |
| A03 | Journey Stage 1 supports multiple education pathways; AW-02/AW-07 support comparing actual study content. No specific degree comparison is supplied. | PENDING; comparison substance missing. | DRAFT; source gaps cannot be resolved by translation. |
| A04/A05 | AW-02 supports broad families; AW-07 supports comparison method. Existing repository curriculum extracts may support narrower profiles, subject to scope review. | PENDING; no blanket branch comparison verified. | DRAFT; unexplained CSE/IT/AI/ML labels need novice-language review. |
| A06 | AW-07 supports study-fit questions and checking promotional claims. No comparative employment/admission outcome established. | PENDING; preserve limits. | DRAFT; check naturalness and handling of the exact student concern. |
| A07 | AW-02 supports caution about inferring a career from a branch label. No specific switching or employment requirement established. | PENDING; pathway evidence missing. | DRAFT; understandable caution is not a completed answer. |

Exact existing authority anchors: [AW-01/AW-02](m1_awareness_content_pack_v1.md#aw-01---start-with-the-idea), [AW-07](m1_awareness_content_pack_v1.md#aw-07---compare-branch-and-college-together), AW-09; [approved Tamil copy](m1_tamil_student_copy_v1.md), AW-01/AW-02/AW-07; [source registry](../data/sources.csv), SRC004/SRC006/SRC007/SRC008. AW-01/AW-02 map to SRC006 skills/specialisations and SRC008 printed p.44; AW-07 maps to SRC008 printed p.45. Registry references are not themselves full source text.

Missing from the batch is not necessarily missing from the repository: [real-approved-corpus.ts](../experiments/track-a-rag/corpus/real-approved-corpus.ts) contains A03-CSE, A03-IT and A03-ECE extracts with curriculum provenance, and A04-CSE for University Departments. For example, A03-CSE is scoped to affiliated institutions, R-2025 Revised 1 (2026), PDF pp.1–5, semesters I–VI; A04-CSE is University Departments, R-2023 Revised 2 (2026), PDF pp.1–6, semesters I–VII. Review applicable extracts before requesting new material; do not mix institution/regulation scopes or infer universal comparisons from them.

The reviewed batch/reference material does not provide sufficient claim-level text for the requested AI & Data Science versus AI & ML comparison, engineering versus science degrees, maths-readiness guidance, or specific career-switching/employer requirements. This is an evidence gap for these answers, not a claim that no such source exists anywhere. No absent passage has been reconstructed, and no external document was fetched in this review.

## Paper review: one zero-knowledge conversation

The following student turns are SYNTHETIC_LANGUAGE_EXAMPLE material for a paper walkthrough, not observed student testimony. Guidance descriptions summarize the existing units; they do not add new answers. Time bands are planning estimates, not measured completion times.

| Planned time | Student turn | Existing unit and observed progression |
| --- | --- | --- |
| 0–2 minutes | “I do not know what engineering is. Where do I start?” | A01 explains practical problem-solving and fields without requesting marks. Useful orientation achieved on paper. |
| 2–4 minutes | “Computers sound interesting. What would I study?” | A04 supplies a broad field map but no CSE/IT profile. Its generic next question repeats the choice just made. Progress becomes partial. |
| 4–6 minutes | “My friend mentioned CSE and IT. How are they different?” | A05 retains the topic but defers the actual differences and asks again which pair. Intent-aware follow-up and source-backed comparison are missing. |
| 6–8 minutes | “Maths worries me. Should I still think about engineering?” | A02 acknowledges the concern without judgment. Learning demands remain unknown and its generic follow-up could lose the concern. |
| 8–10 minutes | “What should I do next, and how do I get into engineering?” | A06 can suggest a study-content checklist, but A01–A07 do not explain admission pathways or explicitly hand off to existing AW-03/AW-10. A complete engineering-admission mental model is not delivered by this batch alone. |

Paper outcome: PARTIAL against the Journey's 5–10-minute value goal. The student gains a basic definition and field awareness, but comparison questions stall and the next admission direction is missing. This awareness subset need not complete all seven journey stages. A later revision should connect to already approved pathway/navigation content rather than add a marks form or new infrastructure. Actual student understanding, timing and Tamil usability remain PENDING; no user study was conducted.

## Prioritized corrections and evidence gaps

1. **P1 — Preserve the actual question and avoid loops:** A05 must retain Q010/Q011's named pairs and Q049's four-way request; A04 must continue a selected field; A07 must retain Q046's software goal. Use context-specific next directions in a future version. No automated semantic matcher is required.
2. **P1 — Distinguish coverage from assignment:** Use this 7/15/9 matrix; do not count 31 linked IDs as 31 answered needs. Prioritize a supported CSE/IT explanation and practical branch examples using existing scoped extracts before broad new research. Keep deferred claims explicit.
3. **P1 — Complete a usable next direction:** Add a proposed handoff to approved AW-03/AW-10 and an “I don't know yet” option in later copy. Preserve awareness before marks and the limited scope of this batch.
4. **P1 — Resolve evidence labels in future normalized metadata:** The six conflicts below affect traceability; do not overwrite raw material or claim synthetic wording was discovered. Also treat the intent map's STUDENT_NEED paraphrases as reviewer synthesis, not independent research evidence.
5. **P2 — Close specific source gaps:** Degree alternatives, mathematics learning demands, AI-related branch differences and career pathways need scoped source passages. A source URL or fluent explanation is insufficient. Do not infer eligibility, admission chances or job guarantees.
6. **P2 — Volunteer Tamil and student review:** Explain abbreviations, check English/Tamil meaning and natural next questions, then conduct an actual student walkthrough. Approval remains pending; this paper review cannot provide it.

## Six evidence-label corrections proposed

Every row currently has ORIGIN = DISCOVERED_STUDENT_QUESTION. Preserve the raw file and record these proposed effective labels in any future normalized artifact, with original metadata retained.

| ID | Proposed effective label | Reason |
| --- | --- | --- |
| Q016 | PARAPHRASED_STUDENT_NEED | SOURCE_REF explicitly says paraphrased; the government-school eligibility wording is not documented verbatim discovery. |
| Q017 | PARAPHRASED_STUDENT_NEED | SOURCE_REF explicitly says paraphrased; the First Graduate family example is not documented verbatim discovery. |
| Q022 | PARAPHRASED_STUDENT_NEED | SOURCE_REF explicitly says paraphrased; the college-versus-branch tradeoff is not documented verbatim discovery. |
| Q023 | SYNTHETIC_LANGUAGE_EXAMPLE | SOURCE_REF explicitly says synthetic and NOT AUTHENTIC EVIDENCE; Tanglish cutoff wording cannot evidence observed student language. |
| Q024 | SYNTHETIC_LANGUAGE_EXAMPLE | SOURCE_REF explicitly says synthetic and NOT AUTHENTIC EVIDENCE; fees/scholarship wording cannot evidence observed student language. |
| Q025 | SYNTHETIC_LANGUAGE_EXAMPLE | SOURCE_REF explicitly says synthetic and NOT AUTHENTIC EVIDENCE; the starting-point wording cannot evidence observed Tamil usage. |

Q026–Q051 remain PRODUCT_COVERAGE_QUESTION; this batch's Q010/Q011/Q012/Q021 retain their recorded DISCOVERED_STUDENT_QUESTION labels without new provenance authentication. These proposals concern evidence classification, not factual verification of the questions' assumptions.

## Validation and status

Validate the table's 31 unique IDs against INT-01–INT-04 and the original corpus, recalculate counts, check links and changed-file scope, and verify the original batch remains unchanged. Application tests and typecheck are not relevant to this documentation-only review and were not executed. No live API calls, frozen-contract changes or new implementation authorization. Live LLM Gate remains PARTIAL; Gemini remains PAUSED; M2 remains NOT_AUTHORIZED.

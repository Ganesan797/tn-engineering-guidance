# Bounded M2 Journey — Validation Preparation (2026-10-03)

**Status:** LOCAL_WALKTHROUGH_COMPLETE; STUDENT_TEST_NOT_RUN; FACTUAL_SCOPE_REVIEW_PENDING; VOLUNTEER_TAMIL_REVIEW_PENDING. This is preparation for the [October 3 bounded authorization](m2_one_journey_authorization_decision_2026-10-03.md), not M2 acceptance. The [question-to-domain map](m2_one_journey_question_domain_map_v1.md) and frozen [Product Mission](../product/product_mission.md), [Student Journey](../product/student_journey_v1.md) and [Input/Output](../product/student_input_output_v1.md) govern review. Gemini stays paused.

## Verified local walkthrough

At main `a06294557462d88ffc0b2316285d870276881d8d`, the local server served `/journey`, route, preparation, direct check and `/personal` with HTTP 200. The zero-knowledge path displayed AW-01 before any marks field, then AW-03/AW-05 and optional B01/B04, then B05 preparation or the optional check. The direct check opened at the admission-year question. Posting 2026 → academic → no improvement → Mathematics 86 → Physics 78 → Chemistry 81 produced the existing engine's 165.5/200 cutoff and separate `NEEDS_REVIEW` eligibility. Posting “I don't know” for Physics produced no cutoff; retry returned to Physics with Mathematics 86 retained. These are synthetic local inputs and technical observations, not student outcomes or personal advice.

The walkthrough exposed one bounded navigation defect: moving from a partially answered check to route explanation and back discarded entered answers. The fix carries the validated, bounded form state through POST navigation to route/preparation/check; it does not place marks in URLs, persist a profile or alter domain rules. Offline regression and typecheck results belong in `PROJECT_STATUS.md` after validation. A browser/back-button restart or closing the page still starts a new check; this flow does not promise durable recovery.

## Short Tamil-first student session — not yet run

Recruit students with little engineering-admission knowledge and obtain their assent under the appropriate local research process. Use a phone-sized browser at `/journey`; do not ask for names, contact details, actual marks or certificates. If a check needs values, use the clearly labelled synthetic 2026 academic example above. Do not imply that the 2026 rule is current for another year.

1. Start a 5–10-minute timer. Say only: “இந்தப் பக்கத்தை உதவி இல்லாமல் தொடங்குங்கள். பொறியியல் சேர்க்கையைப் பற்றி புரிந்துகொண்டு, அடுத்து நீங்கள் செய்யக்கூடிய ஒரு பயனுள்ள செயலைத் தேர்ந்தெடுங்கள்.” Do not explain TNEA or direct their clicks.
2. Observe whether they understand the awareness and first-year route, find the preparation action, and recognize that marks are optional. Let them follow their own path. Note the screen and words at each hesitation, without recording a name or identifiable story.
3. If they choose the optional check, use synthetic inputs or “எனக்குத் தெரியாது.” Observe whether they understand why each question appears, whether earlier answers remain, and whether cutoff and broader eligibility are distinct. Do not steer them toward a calculated result.
4. At the end ask, in Tamil: “இப்போது உங்களுக்குப் புரிந்த வழி என்ன?”, “அடுத்து நீங்கள் என்ன செய்வீர்கள்? ஏன்?”, and “எந்த சொல் அல்லது படி தெளிவாக இல்லை?” Record their own explanation, paraphrased without personal details. Record elapsed time and whether one useful next action was reached. A facilitator may stop immediately if the student is uncomfortable.
5. Separately repeat the direct-entry and unknown routes with an informed reviewer using synthetic values; do not count that reviewer as a zero-knowledge student.

### Empty observation template — one anonymous session

| Field | Observation |
| --- | --- |
| Session code (random, no identity) / date |  |
| Device width or phone class / language preference |  |
| Starting route and elapsed time to first useful action |  |
| Screens visited in order |  |
| Hesitation: screen, exact UI phrase, approximate pause |  |
| Misunderstanding: what the student thought it meant |  |
| Assistance given, if any; point after which session is no longer unassisted |  |
| Student's explanation of TNEA route, paraphrased |  |
| Student's next action and reason, paraphrased |  |
| Cutoff versus eligibility/UNKNOWN understood? Evidence from their words |  |
| One actionable wording/navigation finding |  |
| Reviewer assessment: useful action within 5–10 minutes? YES / NO / UNCLEAR, with evidence |  |

Do not put real marks, category, disability, documents, contact details, raw recordings or identifiable quotations in this template or Git. Keep any consent and detailed notes in the owner's approved private process. Aggregate findings before a repository update. Empty fields mean **not evaluated**, never PASS.

## Focused release reviews — exact screens and claims

| Screen | Ganesan factual-scope checklist | Volunteer Tamil-equivalence checklist |
| --- | --- | --- |
| `/journey` awareness | AW-01 is the approved M1 introductory unit; confirm it offers value without marks and makes no admission outcome claim. Its governed sources are `SRC006` and `SRC008` in `data/sources.csv`. | Compare rendered title/body/takeaway with `docs/content/m1/m1_tamil_student_copy_v1.md` AW-01; ask whether a beginner understands “engineering” and the next button without help. |
| `/journey?step=route` | AW-03/AW-05 are approved M1 orientation. Open B01/B04 disclosure and check exact 2026 scope, that TNEA is one route rather than all engineering admissions, no JEE requirement for ordinary TNEA academic route, and the application → verification/rank → choices/allotment → response sequence. Sources: `SRC002`/2026 brochure printed pp.1, 9, 11–14; B01 evidence S3/S4 for JEE; B04 S2 PDF pp.1–4. Confirm no current registration date or seat guarantee is implied. | Compare AW-03/AW-05 with approved M1 Tamil copy and B01/B04 with `docs/content/admission/student_pov_admission_batch_int05_int08_v1.md`. Check plain Tamil, first-use explanation of TNEA/JEE/rank/counselling, and whether the B01/B04 draft-review notice is noticed. Do not infer final approval from answer-direction acceptance. |
| `/journey?step=prepare` | B05 is a reviewed **2026** draft, not an exhaustive current-year document list. Check privacy advice, conditional certificate language and official-year action against `SRC002` brochure §§3, 4.2, 5, 7–9 (printed pp.1–5, 10–12); inspect the source limitations in the B01–B08 evidence note. | Compare every displayed B05 line with its English meaning and Tamil draft. Check whether a student knows what to prepare privately and that no document upload is requested here. |
| `/journey?step=check` questions | Verify year guard, HSC academic guard, improvement flag/year and original-mark wording against `SRC002`/2026 brochure printed pp.3, 9 and ELG009/ELG032. Check the question-to-domain map for each skip and null. No 2027 or unsupported-stream result is permitted. | Review the year/stream/improvement/three subject prompts, “why,” “எனக்குத் தெரியாது,” and return navigation. Check that “original” marks cannot be confused with improved marks and that “I don't know” is understandable without shame. |
| `/journey` result after check | For the synthetic 86/78/81 example, engine cutoff is 165.5/200 while broader eligibility is `NEEDS_REVIEW`. Confirm the explanation does not imply rank, seat, eligibility approval or admission probability. Unknown marks must remain unknown; year/stream guards must prevent personal calculation. Source link: `SRC002`, printed p.9 cutoff and p.3 improvement rule. | Check the distinct Tamil meanings of cutoff, eligibility still requiring review, missing information and next action. Ask whether the source disclosure helps without obscuring the main answer. |
| `/personal` direct entry | Confirm the informed student can choose the bounded check directly, without being forced through awareness. | Check that the direct-entry label is clear and does not imply a guaranteed decision. |

For each claim, record PASS / CORRECTION_REQUIRED / NOT_EVALUATED, source/version, exact screen phrase and reviewer/date. Ganesan's factual approval and volunteer Tamil approval are separate decisions. The two 2026 B01–B08 sources that disagree on grievance timing do not justify a fixed deadline here. No student test, factual approval or Tamil volunteer approval has yet occurred.

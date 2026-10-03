CORPUS_REVIEW_STATUS = COMPLETE

RAW_QUESTION_COUNT = 168

PROPOSED_INTENT_COUNT = 20

COVERAGE_ASSESSMENT = [
- All seven Product V1 journey stages have some coverage.
- Evidence composition: 19 `DISCOVERED_STUDENT_QUESTION`, 143 `PRODUCT_COVERAGE_QUESTION`, 3 `PARAPHRASED_STUDENT_NEED`, and 3 `SYNTHETIC_LANGUAGE_EXAMPLE`.
- Although Q001–Q025 use `ORIGIN: DISCOVERED_STUDENT_QUESTION`, Q016, Q017 and Q022 are identified by `SOURCE_REF` as paraphrased; Q023–Q025 are synthetic. These six must not be treated as authentic wording.
- Language composition: 165 English, two Tamil/Tanglish, and one Tamil. All three non-English examples are synthetic, leaving no authentic Tamil/Tanglish discovery evidence.
- The corpus is a useful coverage matrix, but its 143 product-created questions cannot establish actual frequency or student demand.
- Strong coverage exists for branch awareness, eligibility, cutoff concepts, college comparison, counselling and personalized guidance.
- Conceptual duplicate families include Q002/Q084/Q085; Q009/Q089; Q018/Q087/Q092–Q094; Q010/Q011/Q049; Q016/Q097/Q098; Q017/Q099; Q019/Q126/Q127; Q022/Q136/Q137; Q060–Q063; Q126–Q135; Q146–Q153; and Q003/Q013/Q020/Q023/Q154–Q160.
- Useful variants worth preserving include the first-generation framing in Q001, “realistically get” in Q003, “should I really fill that many?” in Q005, “cutoffs look similar” in Q011, social pressure in Q012, “last chance” in Q014, the parent voice in Q015, the concrete college-versus-branch tradeoff in Q022, and the synthetic language forms in Q023–Q025 with their evidence labels retained.
]

MISSING_V1_NEEDS = [
- `PRODUCT_COVERAGE_QUESTION`: Explicitly explain why each personal input is requested and allow students to say “I do not know.”
- `PRODUCT_COVERAGE_QUESTION`: Help students understand `UNKNOWN` or `NEEDS_REVIEW` results without treating them as rejection.
- `PRODUCT_COVERAGE_QUESTION`: Clearly separate verified personal results from “things worth checking.”
- `PRODUCT_COVERAGE_QUESTION`: Explain what the product cannot know or guarantee from historical cutoff data.
- `PRODUCT_COVERAGE_QUESTION`: Authentic Tamil and Tanglish expressions from real students.
- `PRODUCT_COVERAGE_QUESTION`: First-generation, government-school and low-digital-confidence experiences beyond one English question and several paraphrases.
- `PRODUCT_COVERAGE_QUESTION`: Accessible next steps for students who cannot easily obtain documents, travel, use complex websites or interpret official notices.
- `PRODUCT_COVERAGE_QUESTION`: Correction paths when a student entered information incorrectly or later learns that an input was wrong.
- `PRODUCT_COVERAGE_QUESTION`: Explicit source/provenance requests such as “Where did this result come from?” and “Which official notice should I check?”
- `PRODUCT_COVERAGE_QUESTION`: Emotional uncertainty and family-pressure needs that do not reduce the decision to college, branch or placement optimization.
]

OUT_OF_SCOPE_OR_DEFER_CANDIDATES = [
- Q054–Q063: retain high-level admission-route awareness, but defer detailed JEE, management-quota and lateral-entry rules unless separately governed.
- Q003, Q004, Q013, Q020, Q023, Q093 and Q154–Q159: valid Product V1 needs, but exact outcome or “what will I get” guidance requires approved historical/current evidence and must not become admission probability.
- Q131 and Q159: Dream/Target/Safe classification remains explicitly unfrozen and unauthorized.
- Q024 and Q101–Q105: general affordability guidance is useful; exact scholarship, fee and concession eligibility requires separately governed current sources.
- Q015, Q121 and Q138–Q140: general location, hostel and transport considerations fit decision support, but personalized factual results are unsupported by the current structured data.
- Q119–Q123: general college-evaluation checklists are useful; verified placement, faculty, laboratory, accreditation and review comparisons require approved sources not established by this corpus.
- Q004, Q014 and Q146–Q153: current rounds, supplementary counselling and allotment actions require applicable current-year authoritative rules.
- Q033 and Q163–Q167: safe signposting is appropriate, but detailed non-engineering education guidance is beyond the current Engineering/TNEA MVP.
]

OVERREPRESENTED_AREAS = [
- Branches/careers: 20 questions.
- Cutoff/rank/history: 15 questions.
- Counselling/choice filling: 14 questions.
- Reservation/financial support: 13 questions.
- Engineering admission routes, eligibility and college/branch/location decisions: 12 questions each.
- Institution types and personalized guidance: 11 questions each.
- Many apparent repetitions are deliberate `PRODUCT_COVERAGE_QUESTION` variants, so these counts must not be interpreted as observed demand.
]

UNDERREPRESENTED_AREAS = [
- Authentic Tamil/Tanglish student wording: zero discovered examples.
- Zero-knowledge need expressed by an actual student: the only Tamil example, Q025, is synthetic.
- Unknown/null input handling and explanation.
- Provenance, uncertainty and limits of prediction.
- Accessibility and low-digital-confidence barriers.
- Student emotion, confidence and family disagreement beyond a few coverage prompts.
- Post-result correction, escalation and grievance paths.
- Authentic questions about institution types, college evaluation, fees, scholarships and special eligibility cases; these areas currently rely almost entirely on product-created prompts.
]

NORMALIZED_INTENTS = [
{
INTENT_ID: INT-01
INTENT_NAME: Engineering orientation and starting point
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand what engineering is, what engineers do and where a beginner should start.
QUESTION_IDS: [Q025, Q026, Q027, Q028, Q029, Q034, Q035]
JOURNEY_STAGE: 1 — Engineering Awareness
WHY_DISTINCT: Establishes the basic mental model before asking about branches, admission or marks.
},
{
INTENT_ID: INT-02
INTENT_NAME: Engineering suitability and alternatives
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Explore whether engineering fits the student’s interests, abilities and available alternatives.
QUESTION_IDS: [Q030, Q031, Q032, Q033]
JOURNEY_STAGE: 1 — Engineering Awareness
WHY_DISTINCT: Concerns personal fit and an informed choice to pursue engineering, rather than explaining engineering itself.
},
{
INTENT_ID: INT-03
INTENT_NAME: Branch Guidance Profile
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand major branches, what students learn and the kinds of work or careers connected to them.
QUESTION_IDS: [Q036, Q037, Q038, Q039, Q040, Q041, Q042, Q043, Q044, Q045, Q046]
JOURNEY_STAGE: 1 — Engineering Awareness; 5 — Explore
WHY_DISTINCT: These questions can share a reusable branch-profile structure without becoming isolated FAQs.
},
{
INTENT_ID: INT-04
INTENT_NAME: Branch comparison, fit and flexibility
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Compare branches using interests, curriculum and future flexibility rather than popularity alone.
QUESTION_IDS: [Q010, Q011, Q012, Q021, Q047, Q048, Q049, Q050, Q051]
JOURNEY_STAGE: 5 — Explore; 6 — Decision Support
WHY_DISTINCT: Requires comparison and tradeoff reasoning across branches rather than a standalone branch description.
},
{
INTENT_ID: INT-05
INTENT_NAME: Engineering admission routes and TNEA scope
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand the available routes into engineering and which institutions or students each route covers.
QUESTION_IDS: [Q052, Q053, Q054, Q055, Q056, Q057, Q058, Q059, Q060, Q061, Q062, Q063]
JOURNEY_STAGE: 1 — Engineering Awareness; 2 — TNEA Explained
WHY_DISTINCT: Prevents students from mistaking TNEA for every engineering-admission route.
},
{
INTENT_ID: INT-06
INTENT_NAME: TNEA Process Explainer
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Build a simple end-to-end mental model of TNEA, counselling, registration and rank lists.
QUESTION_IDS: [Q001, Q064, Q065, Q066, Q067, Q068, Q069, Q070, Q071]
JOURNEY_STAGE: 2 — TNEA Explained
WHY_DISTINCT: Explains the overall system before detailed eligibility, choice filling or allotment questions.
},
{
INTENT_ID: INT-07
INTENT_NAME: Eligibility, special cases and required documents
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Determine what eligibility information applies, what remains unknown and which documents are needed.
QUESTION_IDS: [Q007, Q072, Q073, Q074, Q075, Q076, Q077, Q078, Q079, Q080, Q081, Q082, Q083]
JOURNEY_STAGE: 3 — Know the Student; 4 — Personal Guidance
WHY_DISTINCT: These questions concern rule applicability and missing evidence rather than admission competitiveness.
},
{
INTENT_ID: INT-08
INTENT_NAME: Cutoff calculation and rank fundamentals
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand how cutoff is calculated and how cutoff, percentage and rank differ.
QUESTION_IDS: [Q002, Q084, Q085, Q086, Q087]
JOURNEY_STAGE: 2 — TNEA Explained; 4 — Personal Guidance
WHY_DISTINCT: Establishes the calculation and terminology before using historical data.
},
{
INTENT_ID: INT-09
INTENT_NAME: Historical cutoff interpretation
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Interpret opening/closing cutoffs and understand why past values cannot guarantee a future result.
QUESTION_IDS: [Q009, Q018, Q088, Q089, Q090, Q091, Q092, Q093, Q094, Q095]
JOURNEY_STAGE: 4 — Personal Guidance; 5 — Explore
WHY_DISTINCT: Focuses on evidence interpretation and uncertainty rather than calculating the student’s cutoff.
},
{
INTENT_ID: INT-10
INTENT_NAME: Reservation and concession applicability
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand reservation, government-school and First Graduate concepts and know what must be verified.
QUESTION_IDS: [Q016, Q017, Q096, Q097, Q098, Q099, Q100]
JOURNEY_STAGE: 3 — Know the Student; 4 — Personal Guidance
WHY_DISTINCT: These benefits have separate applicability and evidence requirements from general affordability.
},
{
INTENT_ID: INT-11
INTENT_NAME: Fees, scholarships and affordability
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand total study cost and identify governed financial-support information to check.
QUESTION_IDS: [Q024, Q101, Q102, Q103, Q104, Q105]
JOURNEY_STAGE: 5 — Explore; 6 — Decision Support
WHY_DISTINCT: Addresses family affordability and financial planning rather than reservation status.
},
{
INTENT_ID: INT-12
INTENT_NAME: College and institution type explainer
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand institution types, autonomy, affiliation, recognition and their practical implications.
QUESTION_IDS: [Q106, Q107, Q108, Q109, Q110, Q111, Q112, Q113, Q114, Q115, Q116]
JOURNEY_STAGE: 5 — Explore
WHY_DISTINCT: A reusable conceptual explainer can prevent repeated confusion about institutional labels.
},
{
INTENT_ID: INT-13
INTENT_NAME: College evaluation and evidence checklist
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Compare colleges using relevant evidence instead of rankings or online claims alone.
QUESTION_IDS: [Q117, Q118, Q119, Q120, Q121, Q122, Q123, Q124, Q125]
JOURNEY_STAGE: 5 — Explore; 6 — Decision Support
WHY_DISTINCT: Provides a decision checklist while preserving uncertainty about unsupported college-quality claims.
},
{
INTENT_ID: INT-14
INTENT_NAME: Counselling rounds and timing
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand which counselling stage may apply and what a supplementary round means.
QUESTION_IDS: [Q004, Q014]
JOURNEY_STAGE: 2 — TNEA Explained; 7 — Next Action
WHY_DISTINCT: Depends on current process timing and differs from preparing or ordering a choice list.
},
{
INTENT_ID: INT-15
INTENT_NAME: Choice filling and seat-allocation mechanics
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand how choices, ordering, locking and the allocation process interact.
QUESTION_IDS: [Q005, Q008, Q019, Q126, Q127, Q128, Q129, Q130, Q131, Q132, Q133, Q134, Q135]
JOURNEY_STAGE: 6 — Decision Support; 7 — Next Action
WHY_DISTINCT: Concerns process mechanics and list construction, not the student’s underlying college/branch preferences.
},
{
INTENT_ID: INT-16
INTENT_NAME: College-versus-branch tradeoff
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Balance branch interest, college preference and career considerations without a hidden universal ranking.
QUESTION_IDS: [Q022, Q136, Q137, Q142, Q144, Q145]
JOURNEY_STAGE: 6 — Decision Support
WHY_DISTINCT: These are multi-factor preference decisions rather than factual college or branch explanations.
},
{
INTENT_ID: INT-17
INTENT_NAME: Location, living and family constraints
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Include distance, hostel, affordability and family considerations in the student’s decision.
QUESTION_IDS: [Q015, Q138, Q139, Q140, Q141, Q143]
JOURNEY_STAGE: 3 — Know the Student; 6 — Decision Support
WHY_DISTINCT: Captures personal constraints that cannot be reduced to cutoff, branch or college prestige.
},
{
INTENT_ID: INT-18
INTENT_NAME: Allotment decision and joining steps
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Understand an allotment, available responses, confirmation, documents, payments and immediate next actions.
QUESTION_IDS: [Q006, Q146, Q147, Q148, Q149, Q150, Q151, Q152, Q153]
JOURNEY_STAGE: 7 — Next Action
WHY_DISTINCT: Begins after a seat outcome exists and is action-critical.
},
{
INTENT_ID: INT-19
INTENT_NAME: Personalized admission options
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Use the student’s cutoff, category and preferences to identify options without presenting predictions as certainty.
QUESTION_IDS: [Q003, Q013, Q020, Q023, Q154, Q155, Q156, Q157, Q158, Q159, Q160]
JOURNEY_STAGE: 3 — Know the Student; 4 — Personal Guidance
WHY_DISTINCT: Requires student-specific inputs and explicit uncertainty boundaries.
},
{
INTENT_ID: INT-20
INTENT_NAME: Setbacks, recovery and alternative next directions
STUDENT_NEED: `PARAPHRASED_STUDENT_NEED` — Find a safe next action when a seat, counselling step or original education plan does not work.
QUESTION_IDS: [Q161, Q162, Q163, Q164, Q165, Q166, Q167, Q168]
JOURNEY_STAGE: 7 — Next Action
WHY_DISTINCT: Focuses on recovery and continued progression rather than normal-path counselling.
}
]

ZERO_KNOWLEDGE_PATH_ASSESSMENT = [
- The corpus contains the required progression from engineering awareness through TNEA, branches, personal guidance, decision support and next action.
- It is presently a catalogue rather than a 5–10 minute zero-knowledge journey. Presenting all 168 questions would create overload.
- INT-01 → INT-05/INT-06 → INT-07/INT-08 → INT-03/INT-12 → INT-19 → INT-16/INT-17 → INT-18/INT-20 provides a plausible progressive path, but this review does not authorize implementation.
- The path needs explicit checkpoints that explain why information is requested, preserve unknown values and offer one useful next direction.
- Native-language readiness is not demonstrated: Q023–Q025 are useful synthetic variants, but they are not authentic Tamil/Tanglish student evidence.
- The corpus supports Booklet-First breadth, but reusable explainers and progressive disclosure are necessary to prevent FAQ-style fragmentation.
]

REUSABLE_CONTENT_STRUCTURE_CANDIDATES = [
- Engineering Orientation Primer: INT-01 and INT-02.
- Branch Guidance Profile: INT-03, with shared fields for what students study, learning style, example work and career directions.
- Branch Comparison Canvas: INT-04.
- Engineering Admission Routes Explainer: INT-05.
- TNEA Process Explainer: INT-06, INT-14, INT-15 and INT-18.
- Eligibility and Missing-Information Checklist: INT-07.
- Cutoff and Historical Evidence Explainer: INT-08 and INT-09.
- Reservation and Financial-Support Verification Guide: INT-10 and INT-11.
- College/Institution Type Explainer: INT-12.
- College Evaluation Checklist: INT-13.
- Student Decision Tradeoff Worksheet: INT-16 and INT-17.
- Personalized Guidance Input Summary: INT-19.
- Setback and Next-Action Guide: INT-20.
]

QUESTIONS_REQUIRING_OWNER_DECISION = [
- Correct the evidence metadata conflict for Q016, Q017 and Q022: `ORIGIN` says discovered, while `SOURCE_REF` says `PARAPHRASED_STUDENT_NEED`.
- Correct the evidence metadata conflict for Q023–Q025: `ORIGIN` says discovered, while `SOURCE_REF` says `SYNTHETIC_LANGUAGE_EXAMPLE`.
- Decide whether the 143 Product Coverage Questions should remain in a separate coverage matrix from authentic discovery evidence.
- Decide whether verbatim discovered wording from the named external source may be retained in a future approved corpus.
- Decide the V1 depth permitted for JEE, management quota and lateral-entry explanations.
- Decide whether Q131 and Q159 should be retained only as deferred research prompts because Dream/Target/Safe remains unauthorized.
- Decide which financial, placement, college-quality, location and current-year counselling facts can be supported by governed sources before any related content is approved.
- Decide whether the next corpus step should prioritize authentic Tamil/Tanglish discovery, because the present non-English examples are entirely synthetic.
]

FILES_CHANGED = NONE

IMPLEMENTATION = NONE

LIVE_API_CALLS = 0

M2_STATUS = NOT_AUTHORIZED

NEXT_SINGLE_ACTION = Owner review and approval of the 20-intent map and the six evidence-label corrections before creating any normalized corpus or student-facing content.
# Bounded M2 Journey — Question Reachability Audit (2026-10-03)

## Current optional-collection audit

The later [owner scope decision](m2_optional_question_collection_decision_2026-10-03.md) authorizes optional discovery of all prepared answers. **Current reachability: 70 DIRECT, 0 PARTIAL, 0 DOCUMENTED_ONLY** through the question collection, replacing the reachability totals in the historical baseline below. This means access to the complete saved answer, not a new factual/Tamil approval or proof of student comprehension. The short journey itself remains intentionally selective.

For **each ID** in the table, its exact question/answer URL is `/journey/questions?id=<ID>` (for example `/journey/questions?id=Q049`). `/journey/questions` shows its saved wording under the listed unit's student-friendly topic. Each answer displays the whole assigned saved unit, Tamil first and English in a disclosure, its saved next action, evidence/limits and the explicit journey-return path below. Related questions share the same reviewed unit rather than requiring a 70-step flow.

| Unit | Every question ID — all DIRECT | Return path / next direction |
| --- | --- | --- |
| A01 | Q025, Q026, Q027, Q028, Q034, Q035 | `/journey?step=awareness`; begin with study/work and interests |
| A02 | Q030, Q031, Q032 | `/journey?step=study`; preparation/support, no aptitude verdict |
| A03 | Q029, Q033 | `/journey?step=awareness`; compare study routes |
| A04 | Q036, Q037, Q038, Q039, Q040, Q041, Q042, Q043, Q044 | `/journey?step=study`; inspect subjects/practicals and exact syllabus |
| A05 | Q010, Q011, Q049, Q050 | `/journey?step=compare`; exact four-way computing comparison and curriculum checks |
| A06 | Q012, Q021, Q047, Q048 | `/journey?step=compare`; preserve interests and conditional historical comparisons |
| A07 | Q045, Q046, Q051 | `/journey?step=study`; conditional career pathways, no employment promises |
| B01 | Q052, Q053, Q054, Q055, Q056, Q057, Q058 | `/journey?step=route`; also Q059/B02 and Q060/B03 links |
| B02 | Q059 | `/journey?step=route`; institution-specific official requirements |
| B03 | Q060, Q061, Q062, Q063 | `/journey?step=route`; saved TNLEA direction and explicit first-year-check exclusion |
| B04 | Q001, Q064, Q065, Q066, Q067, Q068, Q069, Q070 | `/journey?step=route`; official process/help; Q070 links Q086/B08 |
| B05 | Q007, Q071, Q082 | `/journey?step=prepare`; private preparation checklist |
| B06 | Q072, Q073, Q074, Q075 | `/journey?step=route`; eligibility dimensions, no personal verdict |
| B07 | Q076, Q077, Q078, Q079, Q080, Q081, Q083 | `/journey?step=prepare`; official case clarification; Q081 links Q060/B03 and Q002/B08 |
| B08 | Q002, Q084, Q085, Q086, Q087 | `/journey?step=route`; score/rank distinction; result opens Q002 separately to retain the result |

**Content satisfaction and limits:** The saved question-level coverage reviews classify 31 awareness and 39 admission answers as complete explanations. Inspection found no additional missing answer introduced by this rendering. Q053 needs the linked B02/B03 units to complete the route map; Q070/Q081 keep their saved cross-unit mappings. Q049 keeps CSE, IT, AI & DS and AI & ML. Q021 remains explicitly non-numeric without matching historical context; B02 institution terms and B07 individual cases remain conditional. These are disclosed evidence limits, not verified personal outcomes. Saved next-action/limit text sometimes remains English; volunteer Tamil-equivalence and student usability review must assess that language burden before release. No missing source wording was reconstructed.

**Checks actually run:** all 70 HTTP question pages return their expected unit; independent ID-to-unit assertions, saved Tamil/next-action checks, rejected Q003/Q168, cross-links, B03 exclusion, B08 result link and unchanged personal-check paths pass. Full offline suite **208/208**; strict typecheck PASS. Mobile browser inspection of topic expansion, Q049 and return navigation checks usable wrapping without horizontal overflow. This is technical/paper review only; no student validation is claimed.

**Remaining 98:** Not in either prepared batch and not exposed as answered. **Owner Finding 01:** previous Stage 1 screen-review PASS retained; this optional collection awaits owner review. Factual release, volunteer Tamil, actual student reviews and M2 acceptance remain pending. No merge, new model request or admission-rule change.

## Historical baseline before the optional collection

**Basis:** Review branch `codex/m2-owner-finding-01-stage1` at `6f340291148e17097a403515f8cb1ee16602b111`; rendered `/journey` pages and their content-loading code; [A01–A07 V2](../content/awareness/student_pov_awareness_batch_a01_a07_v2.md) and [B01–B08](../content/admission/student_pov_admission_batch_int05_int08_v1.md). Ganesan reports **Owner Finding 01 Stage 1 screen-review PASS** on 2026-10-03. This is an owner screen judgment, not final factual approval, volunteer Tamil equivalence, timed student validation or M2 acceptance. No merge decision is made here.

The 168-question working corpus has **70 unique IDs answered in these two saved batches** (31 awareness + 39 admission). The **other 98 IDs** are outside these batches and this audit; they are neither claimed answered in `/journey` nor automatically M2 requirements. Batch `ANSWERED` measures saved response completeness. The classifications below measure **reachability in this bounded, first-year journey**, not factual or language release approval:

- **DIRECT:** the relevant answer text is rendered on the named page, sometimes behind an explicitly labelled disclosure.
- **PARTIAL:** the page provides substantive orientation or a next step, but omits a material element of that question's saved answer.
- **DOCUMENTED_ONLY:** the saved answer is not rendered; adjacent content or a generic source link is not counted as its answer.

Paths below are exact local paths. `/journey?step=route` contains a labelled B01/B04 disclosure; `/journey?step=study` contains five branch disclosures; `/journey?step=compare` contains an optional four-way computing disclosure. A disclosure is reachable by opening it, though actual discovery and comprehension still require student testing.

| Unit | Reachability | Every assigned question ID | Exact reachable screen and limit |
| --- | --- | --- | --- |
| A01 | DIRECT | Q026, Q028 | `/journey` — reviewed definition and examples of engineering work. |
| A01 | DIRECT | Q035 | `/journey?step=study` — what to understand before choosing. |
| A01 | PARTIAL | Q025, Q034 | `/journey` — offers a marks-free starting path and next choices, but does not show A01's complete three-question starting method. |
| A01 | PARTIAL | Q027 | `/journey` — shows engineering study/work, but does not directly explain why a student might choose it or its conditional fit. |
| A02 | PARTIAL | Q030 | `/journey?step=compare` — activity-based exploration and no aptitude verdict; broader fit checks from A02 are absent. |
| A02 | PARTIAL | Q031 | `/journey?step=study` — A01 Q035 notes continued mathematics; A02's preparation/support guidance is absent. |
| A02 | PARTIAL | Q032 | `/journey` and `/journey?step=compare` — work activities and interests appear, but A02's skills explanation is absent. |
| A03 | DOCUMENTED_ONLY | Q029, Q033 | No `/journey` screen gives the engineering-versus-science comparison or names non-engineering post-Class-12 options. |
| A04 | DIRECT | Q036 | `/journey` and `/journey?step=compare` — reviewed field-family map. |
| A04 | DIRECT | Q037, Q038, Q039, Q040, Q041, Q042, Q043, Q044 | `/journey?step=study` — field profiles, example study/practicals and exact-syllabus caution; profiles are in labelled disclosures. |
| A05 | DIRECT | Q049 | `/journey?step=compare` — four-way CSE/IT/AI & DS/AI & ML comparison in a labelled disclosure. |
| A05 | PARTIAL | Q010, Q011 | `/journey?step=compare` — Q049 shows named-field overlap/differences; no conditional choice for Q010 or similar-cutoff correction for Q011. |
| A05 | PARTIAL | Q050 | `/journey?step=study` — Q044 tells the student to inspect the exact syllabus, but A05's full comparison checklist is absent. |
| A06 | DIRECT | Q047 | `/journey?step=compare` — activity-based interest exploration without an aptitude verdict. |
| A06 | PARTIAL | Q012 | `/journey?step=study` — Mechanical/Civil study is shown, but the CSE-popularity and employment-guarantee question is not directly answered. |
| A06 | DOCUMENTED_ONLY | Q021, Q048 | No screen answers ECE-versus-CSE historical cutoff comparability or a placement-only branch choice. |
| A07 | DOCUMENTED_ONLY | Q045, Q046, Q051 | No screen gives branch career-path, non-CSE-to-software or career-change guidance. |
| B01 | DIRECT | Q052, Q053, Q054, Q055, Q056, Q057, Q058 | `/journey?step=route` — B01 Tamil draft in the “B01, B04” disclosure; TNEA/JEE route and scope answers. |
| B02 | DOCUMENTED_ONLY | Q059 | No screen renders management-quota explanation. |
| B03 | DOCUMENTED_ONLY | Q060, Q061, Q062, Q063 | No screen renders the lateral-entry/TNLEA explanation. The personal-check result may mention diploma as a next direction, but does not answer these four questions. |
| B04 | DIRECT | Q001, Q064, Q065, Q066, Q067, Q068, Q069, Q070 | `/journey?step=route` — B04 Tamil draft in the “B01, B04” disclosure; first-generation process, counselling and rank-list answers. |
| B05 | DIRECT | Q007, Q071, Q082 | `/journey?step=prepare` — reviewed 2026 preparation and conditional document guidance. |
| B06 | PARTIAL | Q073 | `/journey?step=check` — HSC academic guard and Mathematics/Physics/Chemistry questions signal the narrow route, but do not explain all qualifying-subject rules. |
| B06 | DOCUMENTED_ONLY | Q072, Q074, Q075 | No screen explains general eligibility, dated minimum-mark thresholds or CBSE treatment. The check's `NEEDS_REVIEW` is not such an answer. |
| B07 | PARTIAL | Q080 | `/journey?step=check` — improvement questions and post-2005 original-mark explanation; not the full unusual-case guidance. |
| B07 | PARTIAL | Q081 | `/journey?step=check` — unsupported-stream guard and official-route next action; no vocational/diploma rule explanation. |
| B07 | PARTIAL | Q083 | `/journey?step=check` — UNKNOWN/NEEDS_REVIEW and official-source/help next action, without case-specific B07 guidance. |
| B07 | DOCUMENTED_ONLY | Q076, Q077, Q078, Q079 | No screen explains nativity or the two outside-state study/birth cases. |
| B08 | PARTIAL | Q002, Q085 | `/journey?step=check` result shows a supported cutoff out of 200; the formula and why 200 are not explained. |
| B08 | PARTIAL | Q086 | `/journey?step=route` B04 describes rank list and `/journey?step=check` says a cutoff is not rank; the direct cutoff-versus-rank explanation is absent. |
| B08 | DOCUMENTED_ONLY | Q084, Q087 | No screen explains cutoff versus Class 12 percentage or why the same cutoff need not give the same rank in another year. |

**Counts:** A01–A07: 14 DIRECT, 10 PARTIAL, 7 DOCUMENTED_ONLY = 31. B01–B08: 18 DIRECT, 7 PARTIAL, 14 DOCUMENTED_ONLY = 39. Together: **32 DIRECT, 17 PARTIAL, 21 DOCUMENTED_ONLY = 70**. Every ID appears once in this audit; Q070's B08 cross-reference does not create a second assigned question.

## Ganesan's bounded-scope decision points

1. **Alternative entry for a diploma student:** B03's four answers are not reachable from the first-year route. A student who already has a diploma can see a generic alternative only after entering the personal check and hitting an unsupported-route result. Decide whether a short route-level signpost to the existing B03 explanation is necessary for a useful next action. This is the most plausible reachability gap for a student on a different engineering path; it does not require a new decision engine.
2. **Meaning of the personal cutoff:** the result gives a number and cautions that it is not rank or a seat, but B08's simple formula, percentage distinction and rank explanation are not directly available. Decide whether one short, optional B08 explanation is needed so a zero-knowledge student can interpret the result. No new calculation is needed.
3. **Optional exploration depth:** A02/A03/A07, management quota, unusual eligibility and placement concerns are mostly outside this one first-year path. They may matter to individual students, but this audit does not establish that all must become screens before this bounded journey is useful. Ask real students whether the existing “explore fields or understand TNEA” choice gets them to one useful action within 5–10 minutes; add only an evidenced blocker.

The already reachable path still offers a marks-free study/field exploration, first-year TNEA overview, private preparation action and optional deterministic check. No automatic scope expansion, Gemini/RAG work, milestone acceptance or Live LLM Gate decision follows from these counts. Final factual review, volunteer Tamil equivalence and real-student validation remain pending.

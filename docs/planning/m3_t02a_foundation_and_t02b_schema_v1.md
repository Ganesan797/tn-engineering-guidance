# M3-T02 foundation, explanation sidecar and evidence closure

Date: 2026-10-12. Review branch: `codex/m3-t02a-context-foundation`.

M3-T02A = PASS_OWNER_REVIEW at correction commit `0b5490091015eac42832ea09e19ebe7ea82fdfc4`. The owner approved both T02B schemas and subsequently authorized their implementation. T02B = IMPLEMENTED_FOR_REVIEW; owner implementation review pending. Merge authorization is NOT_GRANTED. M3 is not accepted; T02C/T02D/T03 remain unauthorized by this task.

**T02C authorization/status overlay (2026-10-22):** Owner reports T02B PASS_OWNER_REVIEW at `9fcc59acc73af1f49ec08b20d8ad4bae103385ea` and authorizes bounded T02C only. The earlier T02B pending-review/T02C-unauthorized statements above are historical. T02C = IMPLEMENTED_FOR_REVIEW; T02D/T03 and merge remain NOT_AUTHORIZED. Main remains unchanged. T04_STATUS = NOT_RUN; STUDENT_VALIDATED = NO; Q021_STATUS = PARTIAL; GEMINI_STATUS = PAUSED; LIVE_LLM_GATE = PARTIAL.

**T02D authorization/status overlay:** Owner authorizes governed Things Worth Checking structure from `749887c99774b32bd973d437b0339f7ffe939e72`. T02A/T02B = OWNER_REVIEW_PASS; T02C = TECHNICALLY_COMPLETE with OWNER_ACCEPTANCE_RECOMMENDED, not a new recorded acceptance. T02D = IMPLEMENTED_FOR_REVIEW. Earlier T02D-unauthorized statements are historical. T03, merge, hosting and model/student execution remain unauthorized by this task.

M2_ACCEPTED_BASELINE = `a67fc4c9ed24f7061631782cd63c839cf098cfe8`; branch base = `02c5a028e5f1eef79d826f8ff23dea9ea5ffde15`. T04_STATUS = NOT_RUN; STUDENT_VALIDATED = NO; Q021_STATUS = PARTIAL; GEMINI_STATUS = PAUSED; LIVE_LLM_GATE = PARTIAL.

Authority: [M3-T01 proposed presentation contract](m3_personal_guidance_presentation_contract_v1.md), owner T02A acceptance and subsequent T02B implementation authorization, and the [frozen M3 responsibility](implementation_plan_v1.md). The original schema-only state is superseded for this bounded T02B implementation, not later work. This record does not amend frozen product contracts.

## Implemented T02A boundary

[evaluateJourneyGuidance](../../src/m2/journey.ts) validates and snapshots the bounded answers, classifies every existing input as UNANSWERED / UNKNOWN / SUPPLIED, and returns context alongside the result produced by the unchanged deterministic guidance service. False and zero remain supplied values; null never becomes false/zero.

The existing year/stream gate is centralized in journeyAssessmentScope, retaining exactly the previous supported-path guard. Scope describes the first year/stream boundary: unanswered, explicitly unknown or known unsupported. It infers no diploma, intent or admission route. next_question comes from the existing nextJourneyQuestion function. retry_question is derived from the existing retryUnknown -> nextJourneyQuestion transition only when no active unanswered question exists. The semantic adapter uses next_question first, then retry_question, without scanning unknown fields. Context and result share the same validated answer snapshot; they are not independently reconstructed from result fields.

[toPersonalGuidanceFoundation](../../src/student-semantics/personal-guidance.ts) returns language-neutral categories, message keys, actions, original evaluation and trace identifiers. Input issues concern the existing active question or explicit unknown; unasked fields are not converted into new requests. The overall eligibility outcome remains authoritative. INELIGIBLE is distinct from uncertainty; a cutoff with NEEDS_REVIEW carries a separate limitation message.

Check mappings use actual outcome and explicit emitted reason codes. Original-mark unavailability maps to missing information; the explicit normalization-method gap maps to an unresolved capability. All unmapped NEEDS_REVIEW reasons use a neutral unresolved-check message, without parsing backend explanation text or inferring ownership. Known checks use generic checked-result wording. Internal check/reason identifiers are retained only in trace metadata, never inserted into mapped messages.

Action kinds are provide existing input, retry when known, official scope checking, condition verification and existing preparation. A specific missing check without an existing journey question gets checking direction, not a new input form. Language resolution changes wording only, never category, action or result.

The [existing renderer](../../src/ui/m2-journey.ts) now obtains its result from this associated evaluation envelope but still renders the same existing UI and wording. No new candidate messages are displayed. New semantic foundation is exported for later authorized UI work; this task does not implement T03.

## Candidate bilingual message inventory

All 16 pairs in PERSONAL_GUIDANCE_MESSAGES are new implementation candidate copy. HUMAN_LANGUAGE_REVIEW = PENDING. Prior M2 wording approval does not approve any of them. The table below records every introduced pair for named owner/human review before release in a new UI. No labels imply certificate/document verification. Tamil is primary; English secondary; Tanglish excluded.

| Key | English candidate | Tamil candidate |
| --- | --- | --- |
| basis | Based on the information you entered. | நீங்கள் அளித்த தகவல்களின் அடிப்படையில். |
| known | A checked result is available. | சரிபார்ப்பின் முடிவு கிடைத்துள்ளது. |
| missing | A required answer has not been supplied yet. | தேவையான ஒரு பதில் இன்னும் அளிக்கப்படவில்லை. |
| unknown | This answer is not known yet. It has not been guessed. | இந்தப் பதில் இன்னும் தெரியவில்லை. அதை ஊகிக்கவில்லை. |
| unsupported | This check does not assess the year or study path you selected. | நீங்கள் தேர்ந்தெடுத்த ஆண்டு அல்லது படிப்பு வழியை இந்தச் சரிபார்ப்பு மதிப்பிடாது. |
| unresolved | A checked condition cannot yet be confirmed here. | சரிபார்க்கப்பட்ட ஒரு நிபந்தனையை இங்கு இன்னும் உறுதிப்படுத்த முடியவில்லை. |
| negative | Based on your answers, a checked condition is not met. | உங்கள் பதில்களின் அடிப்படையில், சரிபார்க்கப்பட்ட ஒரு நிபந்தனை நிறைவேறவில்லை. |
| eligible | Based on your answers, the checked eligibility conditions are met. This does not guarantee admission. | உங்கள் பதில்களின் அடிப்படையில், சரிபார்க்கப்பட்ட தகுதி நிபந்தனைகள் நிறைவேறுகின்றன. இது சேர்க்கைக்கு உத்தரவாதம் அல்ல. |
| cutoff_unresolved | Your cutoff is available, but full eligibility is not confirmed. The cutoff alone does not confirm admission. | உங்கள் கட்-ஆஃப் கிடைத்துள்ளது; முழுத் தகுதி இன்னும் உறுதிப்படுத்தப்படவில்லை. கட்-ஆஃப் மட்டும் சேர்க்கையை உறுதிப்படுத்தாது. |
| original_marks | The check reports that the required original marks are unavailable. | தேவையான அசல் மதிப்பெண்கள் கிடைக்கவில்லை என்று சரிபார்ப்பு தெரிவிக்கிறது. |
| normalization | This check cannot normalize marks across school boards using the available evidence. | கிடைத்துள்ள ஆதாரங்களைக் கொண்டு, வெவ்வேறு பள்ளி வாரியங்களின் மதிப்பெண்களை ஒரே அளவில் மாற்றிக் கணக்கிட இந்தச் சரிபார்ப்பால் முடியாது. |
| provide | Answer the existing question when you can. | முடியும்போது தற்போதுள்ள கேள்விக்குப் பதில் அளிக்கலாம். |
| retry | Retry when you know the answer, or continue learning without guessing. | பதில் தெரிந்ததும் மீண்டும் முயலலாம்; அல்லது ஊகிக்காமல் தகவல்களைத் தொடர்ந்து அறியலாம். |
| official | Check the official information for your year and study path. | உங்கள் ஆண்டு மற்றும் படிப்பு வழிக்கான அதிகாரப்பூர்வ தகவலைச் சரிபாருங்கள். |
| verify | Check this condition against the official guidance. | இந்த நிபந்தனையை அதிகாரப்பூர்வ வழிகாட்டலுடன் சரிபாருங்கள். |
| prepare | Continue with the existing preparation guidance. | தற்போதுள்ள தயாரிப்பு வழிகாட்டலைத் தொடரலாம். |

Focused correction pass: the active unanswered question now takes precedence over a later unknown answer. Neutral verify wording applies to negative and unresolved states. Normalization describes the unavailable operation; its Tamil candidate remains HUMAN_REVIEW_PENDING. Tests include the exact improvement-unanswered/Physics-unknown case and a real failed-check result from the existing ineligible demo fixture.

Correction verification: focused semantic/journey tests 30/30 PASS; full offline suite 222/222 PASS; strict typecheck PASS. Domain/application/API schemas, StudentProfile, eligibility logic, renderer and proposed T02B schema remain unchanged in this correction pass. Main remains at `02c5a028e5f1eef79d826f8ff23dea9ea5ffde15`; no merge is authorized.

## T02B implemented shared schema

The approved sidecar is now implemented in [domain explanation types](../../src/domain/explanation.ts) and [the trusted evaluator](../../src/domain/rules.ts). Existing EligibilityResult, GuidanceResult, StudentProfile and JSON API response fields remain unchanged. New opt-in envelope functions carry structured explanation data; no final Level-2 copy, claim-level provenance or new UI is implemented.

The envelope is `ExplainedEvaluation<T> = { result: T, explanation: ExplanationSidecarV1 }`. Entry points are evaluateEligibilityWithExplanation, buildDeterministicCandidatesWithExplanation and createGuidanceWithExplanation. Legacy wrappers return `.result` only. Both routes share one evaluation; sidecar allocation also occurs internally for legacy calls, but exposure is opt-in. Recommendation and guidance orchestration transport the sidecar without interpreting it. JSON API exposure is unchanged. The journey evaluation carries `explanation` alongside its associated context/result, or null when no personal evaluation exists. The semantic foundation retains that envelope internally for later authorized mapping; the renderer still consumes only its existing result.

Implemented field structure (TypeScript types are linked above):

```text
ExplanationSidecarV1
  version: 1
  check_blockers: [{ check_index, rule_id, blocking_fields: string[] }]
  aggregate_blockers: [{ field, origin: AGGREGATION }]
  cutoff_trace:
    NOT_REQUESTED { calculation_id: null, operands: [], result: null }
    UNAVAILABLE { calculation_id: TNEA_ACADEMIC_CUTOFF, operands: Operand[], result: null }
    AVAILABLE { calculation_id: TNEA_ACADEMIC_CUTOFF, operands: [maths, physics, chemistry], result: number }
Operand { subject, value: number|null, input_field: string|null }
```

The union variants include an availability discriminator named `status`. AVAILABLE requires numeric operand values and an already-produced cutoff; it does not mean complete eligibility. UNAVAILABLE permits an empty operand list for non-academic scope, or selected partial operands where existing trusted logic knows them. NOT_REQUESTED differs from requested-but-unavailable. No domain unknown-input distinction is fabricated: null values cannot identify explicit student unknown without T02A context. Unknown improvement selection produces null operands/origins; a selected but missing original mark preserves its known origin with null value. Existing direct rule consumers may omit origin metadata, in which case origins remain null rather than being reconstructed.

| Field | Meaning and source of truth | Producer -> consumer | Required/null behavior | Visibility and compatibility |
| --- | --- | --- | --- | --- |
| envelope.result | Existing authoritative GuidanceResult | Same guidance evaluation -> current/new consumer | Required, unchanged fields | Existing semantics; no change to legacy response shape. |
| envelope.explanation | Companion detail for that same evaluation | Opt-in shared evaluation -> presentation adapter | Required only in new envelope; absent for legacy calls | Internal; no timestamp/token needed because envelope associates the pair. |
| version | Sidecar schema identity | Shared evaluator -> schema adapter | Required literal 1 | Internal; future versions separately reviewed. |
| check_blockers | Ordered ownership records for emitted checks | Existing RuleEvaluation entries -> adapter | Required array, same emitted check order | Internal; must not alter checks/rule order. |
| check_index | Index into the unchanged result check list | Evaluation array position -> adapter | Required nonnegative index | Internal trace; not recalculated from prose. |
| rule_id | Existing identity at that index | check.rule_id -> adapter | Required nonempty string | Internal; must match result.checks[check_index]. |
| blocking_fields | This evaluation's already-known blockers | RuleEvaluation.blockingMissingFields -> adapter | Required array; [] for none, no invented nulls | Internal IDs mapped to reviewed labels; original global list unchanged. |
| aggregate_blockers | Blockers introduced at aggregation level | Existing aggregate-addition sites -> adapter | Required array; [] if none | Internal; do not assign these to invented checks. Preserve explicit aggregate records even if an ID also appears in a check. |
| aggregate_blockers[].field | Existing aggregate blocker identifier | Existing additions for community / requested entitlement -> adapter | Required string | Internal; no new fields or applicability predicates. |
| aggregate_blockers[].origin | Association is global, not check-owned | Existing aggregation point -> adapter | Required literal AGGREGATION | Internal provenance of blocker ownership, not a new admission reason. |
| cutoff_trace.status | Requested/applicable calculation availability | Existing request, evaluated cutoff/check state -> adapter | Required NOT_REQUESTED / UNAVAILABLE / AVAILABLE | Internal; show reviewed missing/scope wording using context, not this status alone. |
| calculation_id | Identifies existing academic cutoff calculation | ELG009 calculation point -> adapter | Required field; null only NOT_REQUESTED; existing academic identity otherwise | Internal identity resolves reviewed formula explanation; no formula evaluator added. |
| operands | Actual selected effective operands | Existing effectiveMarks selection, captured adjacent to calculation -> adapter | Required array; complete triple only AVAILABLE; incomplete/empty otherwise | Reviewed values may be displayed; never recompute cutoff. |
| operands[].subject | Maths / Physics / Chemistry role | Existing operand position -> adapter | Required supported subject | Internal identity with reviewed localized label. |
| operands[].value | Selected effective mark | Already-selected EffectiveMarks operand -> adapter | Required field; null only unavailable; numeric zero preserved | May be displayed; not copied from a potentially different raw input. |
| operands[].input_field | Origin of selected operand | Existing normal/original selection branch -> adapter | Required field; null if trusted logic did not establish an origin | Internal field identifier; localized origin wording only. Do not duplicate improvement conditions. |
| cutoff_trace.result | Already-produced cutoff | Existing cutoffEvaluation.cutoff -> adapter | Required field; number only AVAILABLE; null otherwise | Display permitted; must equal unchanged result.eligibility.cutoff. |

Actual capture points: per-check blocker lists are copied from RuleEvaluation before flattening; community and requested entitlement aggregate additions are recorded where the existing Set additions occur. effectiveMarks records academic origins inside its existing normal/original selection branches, with no second improvement predicate. ELG009 attaches selected operands and its already-computed cutoff at the existing calculation point. The formula, result aggregation and legacy blocker Set/order are unchanged. T02B made no source metadata correction; the later T02C location correction is recorded below. Internal RuleEvaluation gains cutoffTrace; no new admission rule or StudentProfile field is added.

Schema refinements, without semantic deviation: reusable ExplainedEvaluation<T> envelopes at domain/recommendation/application boundaries; a named TNEA_ACADEMIC_CUTOFF identity; AVAILABLE operands typed with numeric values; input_field restricted to existing StudentProfile keys or null. Internal academic_origins is optional for backward compatibility with direct exported rule callers. No parallel eligibility evaluation is introduced. T02B left the source/page disagreement untouched; the later T02C disposition is below.

Backward compatibility evidence: an independent read-only audit loaded the exact pre-T02B evaluator from accepted commit `0b5490091015eac42832ea09e19ebe7ea82fdfc4` and compared 14 profiles across all 8 capability-request combinations: 112/112 exact legacy result matches (outcomes, cutoff, check/blocker order, explanations and source fields). Focused spies assert each of the 32 executors runs once per guidance call, including the negative early-return path. Existing API/result fixtures remain unchanged.

## T02C implemented provenance precision

[Provenance adapter](../../src/student-semantics/provenance.ts) resolves the existing source registry without changing its identities. Each ClaimEvidence carries an internal claim_id, precision, trace and supporting references: source identity/title/link, source year when known, recorded/verified location, printed page/PDF position where established, location status and explicit evidence_limit.

- CHECK_LEVEL: maps only an emitted check's own source/year/page. Ordinary pages are RECORDED, not claimed freshly verified. The cutoff claim links to the existing calculation check; an overall eligibility document reference is not promoted to one exact proof paragraph.
- APPROVED_CONTENT_LEVEL: requires an existing question in the governed collection plus explicit review-scope membership, version and review reference from a trusted owner/content-review caller. It copies only that answer's evidence, preserves its English/Tamil limits and labels support as whole-answer, not sentence-level. Year is supplied per exact evidence URL or remains null; a review date/content year cannot fill every reference year. This scope argument is an internal governance dependency, never accepted from student requests. No new item is approved or selected here.
- DOCUMENT_LEVEL: lower-precision general source support, with no asserted page or source-validity year derived from retrieval/publication dates. Aggregate personal guidance references use only sources from its actual eligibility checks, not unrelated programme sources. A consistent year explicitly supplied by those checks is retained; otherwise it remains unknown.

Missing registry entries produce no substituted reference. A conflicting improvement reference yields UNRESOLVED with no precise page. The student reference projection removes source IDs and location-status enums, retains human-readable limits and rejects raw SRC/ELG wording rather than displaying it. Candidate evidence limits are implementation metadata for later reviewed UI mapping, not new approved Level-3 screens.

toPersonalGuidanceFoundation accepts an optional source registry and adds internal evidence mappings when a result exists. Existing callers without a registry receive an empty evidence list; current rendering is unchanged. Approved-content/document helpers are available for later authorized consumers only. No Things Worth Checking section, new content, evidence screen, scheme applicability or domain inference is introduced.

## G05 official factual reconciliation — 2026-10-22

Document: **Tamil Nadu Engineering Admissions 2026 — Information Brochure**, Information and Instructions to Candidates; official SRC002 [registered URL](https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf). The downloaded document identifies 2026 on its cover and contains 38 PDF pages; no separate revision identifier was established. SHA-256: `2242626455a14caf7613494626b4d8bcc903607c3e8dcdf209b5291ba6a2bb88`.

Verification used PDF text extraction and visual inspection of the complete relevant page. The **Improvement marks** paragraph is on **printed page 3, PDF position 4 (one-based; zero-based index 3)**. The cover precedes printed page 1. Relevant exact excerpt:

> improvement marks obtained by the candidates including Other State candidates from 2006 onwards will not be considered.

The paragraph cites G.O. No.184 HE (J2), 09.06.2005, and G.O.(st) No.143 HE (J2), 06.05.2008. This verification resolves the location only; it does not reinterpret admission rules or verify student documents. The conflicting page-2 reference is incorrect for this passage, not merely an alternative printed/PDF notation.

Evidence-only corrections: ELG032's emitted source_page changes 2 -> 3 in RULE_PAGES; the corresponding [eligibility reference CSV](../../data/reference/tnea_2026_eligibility.csv) row changes source_page, verification date and location note only. Rule value/predicates/outcomes/formula are unchanged. Existing journey/admission material already pointing to printed page 3 is retained. Source registry identities/URLs and frozen architecture documents remain unchanged; historical page-2 statements there are not silently normalized. No other rule's location is claimed reverified.

IMPROVEMENT_SOURCE_LOCATION records the exact checked document URL/year, section, printed/PDF positions, verification date and checksum. VERIFIED requires matching source identity, URL, year and emitted page. A stale page 2, missing page or conflicting URL cannot inherit this verification.

T02C compatibility audit: 14 profiles x 8 capability-request combinations compared to accepted T02B commit `9fcc59acc73af1f49ec08b20d8ad4bae103385ea`, allowing only ELG032.source_page 2 -> 3: 112/112 PASS. All other domain result fields and the entire T02B explanation sidecar remain exactly equal. GuidanceResult provenance naturally reflects the corrected page reference; eligibility/cutoff/check decisions do not change.

## T02D governed Things Worth Checking structure

[Things Worth Checking](../../src/student-semantics/things-worth-checking.ts) defines a separate INFORMATION section and items, outside the unchanged deterministic GuidanceResult. The semantic foundation exposes `things_worth_checking` alongside its personal-result fields. No result UI or automatic content selection is added.

Each item contains a stable identity derived from its existing canonical content ID; Tamil/English references to question/answer/next/limit fields; a general usefulness message reference; an approved official next URL already present in that answer's evidence; the existing APPROVED_CONTENT_LEVEL provenance structure and limits; content version, explicit owner-reported review/language status and HUMAN_REVIEW_PENDING for new wrapper wording. It does not contain an eligibility result, personalized applicability, benefit entitlement or predicted admission outcome.

The builder accepts only a trusted governance selection and existing QuestionCollection/source registry. It receives no StudentProfile, marks, eligibility, preferences or candidate list. Selections are review/configuration references, not a new content catalogue. Production defaults to no selection and an honest empty state; later authorized integration must supply the actual reviewed scope/version. Tests demonstrate reuse with the existing Q002 cutoff explanation and its official brochure reference, not a new or automatically personalized answer.

Admission-year scope must match explicitly: semantic integration supplies the known validated journey year, or null. No other year or student intent is inferred. A year-scoped item requires the corresponding explicit official evidence year. Scheme/support and personal-result selection classes are excluded; general explanations cannot be promoted to personal conclusions.

Enforcement excludes PENDING/FIX_REQUIRED content or language reviews, missing review references/membership, mismatched versions, PARTIAL answers, absent Tamil, empty required wording, unavailable/unsafe evidence, missing locations/limits and unapproved or unrelated official directions. Registry membership alone does not establish official direction approval: the trusted content review must explicitly approve it and it must occur in that answer's own evidence. This review metadata must never come from student requests. Historical PENDING_VOLUNTEER_EQUIVALENCE in canonical records is not changed or represented as independent volunteer approval; the explicit owner-review scope remains attributable to its named record/version.

The plain candidate-data projection reapplies these gates and resolves existing bilingual text at use time. It omits internal item/content/source/review identities from visible fields; no raw backend explanation is used. The wrapper explicitly states that general guidance does not confirm eligibility, entitlement or admission. Missing items do not mean no opportunities exist. This is a semantic data projection for later reviewed UI work, not a new screen or language release.

### New wrapper copy — HUMAN_REVIEW_PENDING

These four presentation pairs add no admission facts and do not duplicate canonical guidance. All need owner/human acceptance before release. Canonical wording/evidence remains unchanged.

| Key | English candidate | Tamil candidate |
| --- | --- | --- |
| heading | Things worth checking | மேலும் அறிந்து சரிபார்க்க வேண்டியவை |
| scope | General guidance only. These items do not confirm your eligibility, entitlement or admission. | இவை பொதுவான வழிகாட்டல்கள் மட்டுமே. உங்கள் தகுதி, சலுகை பெறும் உரிமை அல்லது சேர்க்கையை இவை உறுதிப்படுத்தாது. |
| usefulness | This general explanation may help you understand what to check next. | அடுத்து எதைச் சரிபார்க்கலாம் என்பதைப் புரிந்துகொள்ள இந்தப் பொதுவான விளக்கம் உதவலாம். |
| empty | No approved general guidance items are available for this scope. This does not mean that no options exist. | இந்த வரம்பிற்குள் காட்டுவதற்கு ஒப்புதல் பெற்ற பொதுவான வழிகாட்டல்கள் இப்போது இல்லை. வாய்ப்புகளே இல்லை என்று இதற்குப் பொருள் அல்ல. |

## Remaining gap status

| Gap | Current state |
| --- | --- |
| 01 Context ambiguity | PASS_OWNER_REVIEW for T02A correction; regressions retained. |
| 02 Blocker association | PASS_OWNER_REVIEW for accepted T02B; behavior preserved. |
| 03 Calculation trace | PASS_OWNER_REVIEW for accepted T02B; behavior preserved. |
| 04 Claim-level provenance | IMPLEMENTED_AND_TESTED at declared precision; T02C owner review pending. |
| 05 Improvement-source conflict | RESOLVED_AGAINST_OFFICIAL_2026_BROCHURE; evidence-only metadata corrected; T02C owner review pending. |
| 06 Semantic/language mappings | FOUNDATION_IMPLEMENTED; candidate copy PENDING_HUMAN_REVIEW; finer explanations depend on later T02B. Not fully closed. |
| 07 Things Worth Checking | GOVERNED_STRUCTURE_IMPLEMENTED_AND_TESTED; new wrapper copy HUMAN_REVIEW_PENDING; owner review pending. |

All seven must close before M3 acceptance under owner direction. T02A technical completion is not human wording approval, M3 acceptance, T04 execution or authorization of later units.

## Validation and review boundaries

Focused tests: [personal guidance foundation](../../tests/student-semantics/personal-guidance.test.ts), existing semantic tests and journey tests. Cover null/unknown/false, supported/unsupported contexts, snapshot association, reason-sensitive/fallback/negative categories, bilingual key resolution, no technical-message leakage, result equivalence and retained-state/retry. Existing journey integration verifies current rendering remains operational. Run full offline suite and strict typecheck; no browser redesign, live calls or student session.

Owner next reviews T02D structure and candidate wrapper wording, with T02C acceptance still separately attributable. No merge or T03 execution is authorized. Existing candidate language-review limits remain. Frozen documents and accepted M2 baseline remain unchanged; the prior evidence CSV row correction is explicitly recorded above.

Executed verification: focused semantic/journey tests 29/29 PASS; full offline suite 221/221 PASS; strict typecheck PASS. The initial sandboxed focused run passed 28 tests but its existing HTTP integration test could not connect to loopback (EACCES); the complete focused suite passed when rerun with local-network permission. Full-suite provider tests use offline mocks; no Gemini/model execution occurred. Documentation links and whitespace are checked before commit. No browser redesign or human/student review was performed.

The 29/221 counts above are original T02A history; the correction counts are recorded earlier. T02B focused verification: 46/46 PASS including new [sidecar tests](../../tests/domain/explanation.test.ts), T02A regressions, existing domain rules and journey integration. Full offline suite 232/232 PASS; strict typecheck PASS. Final documentation/whitespace checks are recorded with the T02B commit report. No new technical identifiers are rendered; current reference rendering is also tested for absence of sidecar field names.

T02C verification: focused provenance/T02A/T02B tests 29/29 PASS; full offline suite 240/240 PASS; strict typecheck PASS; 11 local documentation links resolve; whitespace PASS. UI/API, StudentProfile, T02B sidecar code, frozen documents, source registry and main are unchanged. Only the relevant evidence row and emitted source-page metadata changed alongside the new semantic provenance mappings. No model call, new language release, T04, hosting, T02D or T03 execution occurred.

T02D verification: focused Things Worth Checking/provenance/T02A/T02B tests 38/38 PASS; full offline suite 249/249 PASS; strict typecheck PASS. Tests cover review/version/scope/evidence rejection, safe empty state, exact bilingual canonical reuse, no raw-ID projection, revocation at resolution and unchanged deterministic result/sidecar. T02D changes no domain, data, StudentProfile, rule, API, UI or hosting code. Main, frozen contracts and T04/Gemini/Live LLM statuses remain unchanged. Four new wrapper pairs remain HUMAN_REVIEW_PENDING.

# M3-T02A foundation and proposed T02B explanation sidecar

Date: 2026-10-12. Review branch: `codex/m3-t02a-context-foundation`.

M3-T02A implementation is authorized only for context and semantic mapping foundation. T02B is authorized for schema design only: NOT_IMPLEMENTED; NOT_COMPLETE. Merge authorization is NOT_GRANTED. M3 is not accepted; later units remain unauthorized.

M2_ACCEPTED_BASELINE = `a67fc4c9ed24f7061631782cd63c839cf098cfe8`; branch base = `02c5a028e5f1eef79d826f8ff23dea9ea5ffde15`. T04_STATUS = NOT_RUN; STUDENT_VALIDATED = NO; Q021_STATUS = PARTIAL; GEMINI_STATUS = PAUSED; LIVE_LLM_GATE = PARTIAL.

Authority: [M3-T01 proposed presentation contract](m3_personal_guidance_presentation_contract_v1.md), owner authorization for T02A and design-only T02B, and the [frozen M3 responsibility](implementation_plan_v1.md). This record does not amend frozen product contracts.

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

## T02B proposed shared schema — documentation only

No sidecar types, fields, producers or transport have been added to domain/application/API output schemas. The design below is NOT_IMPLEMENTED. It must be owner-reviewed and separately authorized before T02B execution.

Prefer a separate evaluation envelope `{ result: GuidanceResult, explanation: ExplanationSidecarV1 }` for a new opt-in entry point. Existing consumers keep receiving exactly their current result; existing evaluateEligibility/createGuidance/API signatures remain available. A future shared internal evaluator would produce result and sidecar once, with legacy wrappers returning result only. No second evaluation or presentation recomputation. Final API exposure is a separate explicit decision; the current UI integration carries presentation context only.

Conceptual schema (not executable types):

```text
ExplanationSidecarV1
  version: 1
  check_blockers: [{ check_index, rule_id, blocking_fields: string[] }]
  aggregate_blockers: [{ field, origin: AGGREGATION }]
  cutoff_trace:
    NOT_REQUESTED { calculation_id: null, operands: [], result: null }
    UNAVAILABLE { calculation_id, operands: Operand[], result: null }
    AVAILABLE { calculation_id, operands: [maths, physics, chemistry], result: number }
Operand { subject, value: number|null, input_field: string|null }
```

The union variants include an availability discriminator named `status`. AVAILABLE means complete operands and an already-produced cutoff; it does not mean complete eligibility. UNAVAILABLE permits an empty operand list when no applicable calculation was evaluated, or selected partial operands where existing trusted logic knows them. NOT_REQUESTED differs from requested-but-unavailable. No domain unknown-input distinction is fabricated: null values cannot identify explicit student unknown without T02A context.

| Field | Meaning and source of truth | Proposed producer -> consumer | Required/null behavior | Visibility and compatibility |
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

Proposed capture points: preserve per-check blockers before flattening in evaluateEligibility; record existing aggregate additions where made; attach selected operand origins within the existing effectiveMarks selection branch; capture ELG009's existing cutoff when computed. Unavailable trace states must not create values. Guidance orchestration transports these details without interpretation. This exposes known explanation information only; no rule, aggregation, formula, source or StudentProfile changes are authorized now.

Backward compatibility assessment: additive envelope is feasible without adding fields to legacy result consumers. Future implementation must prove deep equality of every pre-existing output field, legacy API behavior, unchanged global blocker ordering and one evaluation per request. Sidecar allocation/validation itself remains future work. Exact transport and validation signatures require schema review before implementation.

## Remaining gap status

| Gap | Current state |
| --- | --- |
| 01 Context ambiguity | IMPLEMENTED_FOR_BOUNDED_JOURNEY; focused validation required; owner review pending. |
| 02 Blocker association | SCHEMA_PROPOSED_ONLY; no output extension implemented. |
| 03 Calculation trace | SCHEMA_PROPOSED_ONLY; no trace or formula implementation added. |
| 04 Claim-level provenance | NOT_IMPLEMENTED; T02C remains separate. |
| 05 Improvement-source conflict | UNRESOLVED; no external reconciliation or reference correction performed. |
| 06 Semantic/language mappings | FOUNDATION_IMPLEMENTED; candidate copy PENDING_HUMAN_REVIEW; finer explanations depend on later T02B. Not fully closed. |
| 07 Things Worth Checking | NOT_IMPLEMENTED; T02D remains separate. |

All seven must close before M3 acceptance under owner direction. T02A technical completion is not human wording approval, M3 acceptance, T04 execution or authorization of later units.

## Validation and review boundaries

Focused tests: [personal guidance foundation](../../tests/student-semantics/personal-guidance.test.ts), existing semantic tests and journey tests. Cover null/unknown/false, supported/unsupported contexts, snapshot association, reason-sensitive/fallback/negative categories, bilingual key resolution, no technical-message leakage, result equivalence and retained-state/retry. Existing journey integration verifies current rendering remains operational. Run full offline suite and strict typecheck; no browser redesign, live calls or student session.

Owner next reviews this branch, all bilingual candidate messages and the proposed schema. No merge or T02B execution until separately authorized. Frozen docs, data and accepted M2 baseline remain unchanged.

Executed verification: focused semantic/journey tests 29/29 PASS; full offline suite 221/221 PASS; strict typecheck PASS. The initial sandboxed focused run passed 28 tests but its existing HTTP integration test could not connect to loopback (EACCES); the complete focused suite passed when rerun with local-network permission. Full-suite provider tests use offline mocks; no Gemini/model execution occurred. Documentation links and whitespace are checked before commit. No browser redesign or human/student review was performed.

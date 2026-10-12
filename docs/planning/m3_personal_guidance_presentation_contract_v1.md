# M3-T01 — Personal Guidance Presentation Contract V1

Prepared 2026-10-12. Status: CONTRACT_PREPARED_FOR_OWNER_REVIEW. Planning and contract definition only; no UI, semantic adapter or domain implementation is authorized by this document. This is a bounded proposal above the existing trusted outputs, not an amendment to frozen product contracts or M3 completion.

## Authority and baseline

- Project-control main verified locally and remotely before this change: `088b371bd15e56cf3bfbfa7f23f95e20a28858d6`.
- M2_ACCEPTANCE = PASS_OWNER_REPORTED.
- M2_ACCEPTED_BASELINE = `a67fc4c9ed24f7061631782cd63c839cf098cfe8`; subsequent control changes are documentation only.
- T04_STATUS = NOT_RUN; STUDENT_VALIDATED = NO; Q021_STATUS = PARTIAL.
- GEMINI_STATUS = PAUSED; LIVE_LLM_GATE = PARTIAL.
- M3_IMPLEMENTATION_AUTHORIZED = NOT_AUTHORIZED.

Authorities: [frozen M3 responsibility and D1/D2 dependencies](implementation_plan_v1.md), [frozen student output contract](../product/student_input_output_v1.md), [student journey](../product/student_journey_v1.md), and [dated bounded M2 acceptance](roadmap_validation_gate_amendment_2026-10-11.md). CON-01 and LLM work remain separate; neither replaces M3.

`GuidanceResult` and deterministic/domain outputs remain authoritative. Presentation may group, simplify, explain, select reviewed wording, expose provenance and select supported actions. It must not recalculate, rerun predicates, interpret admission rules, invent reasons, aggregate a new eligibility outcome or override an unknown/unresolved result. Numerical display formatting must not change the underlying value.

## Inspected implementation

| File | Existing responsibility / finding |
| --- | --- |
| [GuidanceResult](../../src/application/guidance.ts) | Eligibility, selected snapshot ID/stage, ordered choices and deduplicated provenance; no input or calculation trace. |
| [Eligibility models](../../src/domain/models.ts) | Overall outcome, nullable cutoff, checks, global blockers and matched rule IDs. Each check includes rule ID, outcome, reason code, explanation, source ID/page/year. |
| [Rule outputs](../../src/domain/rules.ts) | Source-backed deterministic checks; some default reason codes combine missing and unsupported data. Per-check blockers exist during evaluation but are flattened in the public result. |
| [Journey bridge](../../src/m2/journey.ts) | Validates bounded answers; distinguishes null, explicit unknown and other year/stream. Returns no GuidanceResult for unsupported/unknown year or stream. Maps unknown answers to null in the engine request. Existing improvement treatment selects original/normal mark fields. |
| [Current semantic view](../../src/student-semantics/guidance-view.ts) | Preserves trusted result, maps overall messages and check titles. Simplifies every NEEDS_REVIEW check to “More information needed”; omits reason code/year from student_checks, though explanations/trusted_result retain them. |
| [Language catalogue](../../src/student-semantics/catalogue.ts) | English eligibility/cutoff messages; Tamil guidance messages are not supplied here. No basis for silently falling back to English. |
| [Journey rendering](../../src/ui/m2-journey.ts) | Tamil score/status/next action; combined generic explanation/evidence, fixed page references, unknown retry and canonical links. Unknown year/stream shares some actions with known unsupported scope. |
| [Reference rendering](../../src/ui/student-guidance.ts) | English primary messages; backend check explanations, blockers, rule/source identifiers and choice machinery remain visible. Full replacement is outside this bounded contract. |
| [Source registry](../../data/sources.csv) | Source title/URL/access date and notes. Publication dates can be blank; registry does not establish every claim’s year or current validity. |

## Proposed model and input boundary

Conceptual names below are documentation, not implemented interfaces. Groups are semantic responsibilities, not a complete screen design.

The adapter receives the authoritative GuidanceResult when one exists, approved source/content registries, and the existing validated journey/request context tied to that same evaluation. Context is permitted only to describe entered answers and existing route decisions; it cannot determine eligibility. Raw form fields are untrusted. Context alone must never create a personal result. If context or a route decision is unavailable, expose the gap instead of reconstructing rules.

| Group | Proposed fields / meaning |
| --- | --- |
| SIMPLE_GUIDANCE — Level 1 | primary_result (value or unavailable), eligibility_summary (exact outcome meaning or not assessed), uncertainty_summary (typed issues), primary_next_action (reviewed action plus supporting references). Primary meaning must stand alone. |
| EXPLAIN_WHY — Level 2 | calculation_basis (reviewed explanation or unavailable), inputs_used (only trace-supported inputs), relevant_check_explanations, unresolved_reason_explanations. Unknown explanations stay explicitly unavailable. |
| EVIDENCE — Level 3 | source_title, source_year, source_link, page_or_section, supports_claim (references to specific displayed claim IDs), evidence_limit, location_status. Empty or conflicting metadata is explicit. |
| PERSONAL_RESULTS | calculated_results, supported eligibility/check outputs, known_limitations. Architecturally deterministic; visible label must qualify results as based on entered information. No result when existing flow returns null. |
| THINGS_WORTH_CHECKING | general approved guidance, why_it_may_be_useful, official_check_direction, content version/review scope/evidence links internally. Separate from personal results; zero items is valid. No content is authored or personalized here. |
| Internal trace | Original outcome/check/reason/blocker/source identifiers; original result retained; context/result association; displayed-claim-to-check/content/evidence references; message version; mapping-gap markers. Never a student-facing raw dump. |

An uncertainty issue carries category, reviewed message key, subject, supporting check/blocker/context references and available actions. Multiple categories may coexist. Issue grouping does not replace the engine outcome.

## Trusted-output mapping

| Source field / existing output | Presentation destination | Allowed transformation | Prohibited transformation |
| --- | --- | --- | --- |
| result.eligibility.cutoff | PERSONAL_RESULTS.calculated_results; Level-1 primary_result | Copy numeric value with /200 label and entered-information qualifier; null becomes unavailable. | Recalculate, round into another score, substitute zero, infer rank/admission probability. |
| result.eligibility.outcome | eligibility_summary; supported eligibility output | Reviewed translation of ELIGIBLE / INELIGIBLE / NEEDS_REVIEW with checked-scope limitations. | Derive status from cutoff, reaggregate checks, treat NEEDS_REVIEW as approval/rejection. |
| eligibility.checks[].outcome, reason_code, explanation, rule_id | Level-2 check and unresolved explanations; internal trace | Use reviewed mappings keyed to emitted check identity/reason and applicable explanation variant; preserve actual check outcomes. Unmapped variants use a neutral unresolved-check fallback. | Rerun predicates; infer a reason from ID alone, parse prose heuristically, invent a missing condition, show raw explanation by default. |
| eligibility.blocking_missing_fields[] | uncertainty issues; next-action candidates | Exact reviewed blocker-to-student-label mapping, grouped without deleting original blockers; generic fallback for unknown IDs. | Convert every blocker to a required new field, infer per-check ownership, humanize underscores as approved copy. |
| Validated JourneyState null or explicit unknown; existing question/retry state | MISSING_INFORMATION / UNKNOWN_INFORMATION; Level-2 context | Describe unanswered versus expressly unknown values; use existing retry target. Result-only null remains ambiguous. | Guess the student’s answer or treat all unasked profile fields as “I don’t know.” |
| Existing journey bridge null result plus validated year/stream and existing route handling | UNSUPPORTED_SCOPE or UNKNOWN_INFORMATION; no-personal-result explanation | Describe known “other” as outside this check; unknown as unknown; do not claim a specific alternative stream/year. | Treat null result alone as unsupported, infer diploma, invent year/stream-specific eligibility. |
| checks[].source_id, source_page, source_year | Level-3 claim evidence | Resolve title/URL from registry; retain check year; attach reference to the corresponding check claim. Flag conflicting page metadata. | Use a current year from access date, silently replace a page, imply fresh external verification. |
| result.provenance[] | Level-3 supporting reference index | Resolve/deduplicate links; claim linkage only when supported by a check or existing governed content mapping. | Assign every reference to every claim, infer which source supports cutoff from aggregate list alone. |
| Validated request/journey context | Level-2 entered-answer summary | State “entered”; show actual inputs_used only if existing trace establishes the engine-used operands. | Replicate effective-mark selection/improvement logic to claim inputs were used. |
| Existing reviewed canonical content, IDs/version/source mappings | THINGS_WORTH_CHECKING or optional understanding links | Preserve approved meaning, review scope, evidence/year limits; label general guidance separately. | Infer personal eligibility/benefits, add unsupported schemes, upgrade Q021. |
| Existing outcome/checks/blockers + validated unknown/retry/route state | primary_next_action | Select one supported action using priorities below; retain other unresolved issues in explanation. | Infer preferences, new deadlines, certificate requirements or an official decision from absent evidence. |
| ordered_choices, selected_snapshot_id/stage | Internal trace; deferred wider result path | Preserve unchanged; disclose unknown seat limits if an existing claim is displayed. | Convert canonical ordering into ranking or confirmed available places; introduce choices in this slice. |

## Uncertainty and action contract

| Category | Positive evidence required | Student meaning / permitted direction |
| --- | --- | --- |
| MISSING_INFORMATION | Unanswered supported journey field or emitted blocker with an approved missing-input mapping | Needed information has not been supplied. Provide/check that existing input where collection is already supported; otherwise official checking direction. |
| UNKNOWN_INFORMATION | Explicit validated unknown answer | Student does not know yet. Retry when known, or continue awareness with uncertainty; never guess. |
| UNSUPPORTED_SCOPE | Existing known route/year/stream outside bounded assessment | This check does not assess that scope. Consult the existing official route/source direction; do not call it ineligible. |
| UNRESOLVED_CHECK | Actual NEEDS_REVIEW check without a supported missing/unknown explanation, or unsupported capability reason explicitly emitted by engine | A named condition cannot be confirmed by this check. Verify that condition where a reviewed mapping exists; otherwise neutral official checking fallback. More inputs are not promised to resolve it. |
| KNOWN_NEGATIVE_RESULT | Actual INELIGIBLE overall/check output | A checked condition is not met based on entered information. Explain only emitted failed checks. This is not an authority-issued admission decision. |

KNOWN_NEGATIVE_RESULT is included in this classification for action handling; it is a known negative, not uncertain. Validation errors are separately “input not accepted”; execution failure is “assessment unavailable,” never eligibility failure. No-result flow is not assigned a fabricated domain enum.

Action priority is presentation policy, not eligibility logic:

1. When no result exists, follow the existing route/question state: explicit unknown -> existing retry/continue; known unsupported -> official scope direction; unasked input -> existing question. Ambiguous null -> state that no assessment is available, without a guessed cause.
2. With a result, a known failed condition gets a reviewed check-specific explanation/action. Do not imply other unresolved conditions were cleared.
3. Otherwise prefer an existing explicit-unknown retry, then a supported missing-input action. Do not add collection of community/nativity or any other new field to the bounded journey. Uncollected broader conditions receive checking direction instead.
4. An unresolved capability/check gets specific verification only when the output-to-message mapping supports it; otherwise a neutral fallback. Never “add marks” for a normalization-formula gap.
5. If cutoff exists but eligibility remains unresolved, Level 1 must state that cutoff does not confirm full eligibility; the selected action addresses an actual unresolved condition. No scores, ranks or seats are inferred.
6. A confirmed engine outcome with no actionable blocker receives approved general preparation/source direction. Unknown vacancies remain unknown, not zero.

Where several candidates have equal priority, retain engine order or a reviewed fixed presentation order; do not introduce admission importance/ranking claims. Every action stores the supporting output/context references. Canonical content can supply approved action wording, not the reason that action applies.

## Language and visible wording

Tamil primary; English secondary. Both resolve the same semantic claim IDs, values, categories, outcomes, scope and action targets. One adapter and one engine; no language-specific eligibility logic. Missing translation blocks release of the affected claim rather than silently exposing internal text. Representative Level-1 Tamil requires named human review by M3 acceptance; this task supplies no final comprehensive Tamil copy. Tanglish is outside M3 unless separately authorized through conversational work.

“VERIFIED_PERSONAL_RESULT” is an architectural class, not a claim of certificate checking. Provisional English meaning: “Based on the information you entered.” Final visible Tamil/English labels require human review. No certificate/document authenticity, official approval, guaranteed admission or benefit is implied.

Never visibly expose ELG/SRC IDs, raw enum names, backend field names, reason/blocker identifiers, predicate terminology, snapshot machinery, canonical ordering/tie-break machinery or unreviewed backend explanations. Preserve identifiers internally for tests/audit; do not put secrets or raw traces in rendered markup. Level 3 shows source titles/year/locations, not raw codes. Professional subject abbreviations can remain only in reviewed understandable labels.

## CONTRACT_GAP register

| Gap | Classification | Safe behavior / future boundary |
| --- | --- | --- |
| G01: Result does not distinguish explicit unknown, unanswered, unasked or unsupported route; bridge may return null. | Semantic adapter change required. | Use associated existing validated context and existing route decision; result-only fallback is neutral. A richer channel-independent output may later be proposed, never reconstructed through copied rules. |
| G02: Global blockers lack per-check association; generic reason codes combine missing/unsupported. | Presentation-only workaround possible; semantic adapter change required for reviewed mappings; domain-output extension potentially required for exact association. | Display exact global unresolved subjects without asserting which check owns them. Unknown variants remain UNRESOLVED_CHECK. Do not parse prose as a rules engine. |
| G03: Cutoff has no operands/formula/effective-input trace. | Presentation-only workaround possible; domain-output extension potentially required for exact calculation trace. | Copy score; show entered answers as entered, not necessarily used. An approved canonical formula may be explained generally without recomputation; exact inputs_used unavailable unless trusted trace establishes them. |
| G04: Aggregate provenance omits year and claim links; registry publication date can be blank. | Semantic adapter change required; domain-output extension potentially required for claims not covered by checks/content provenance. | Use check.source_year and check-specific reference. Leave unmatched claim linkage/year unavailable. Never derive year from access date. |
| G05: Improvement check ELG032 emits source_page 2 via RULE_PAGES, while journey renderer says page 3. | Presentation-only workaround possible; evidence review and potentially domain-output extension/correction require separate authorization. | Record conflict; expose brochure/year with location unresolved and evidence limit. Do not silently select a page or mark this claim’s location verified. |
| G06: Existing student_checks loses reason/year and defaults NEEDS_REVIEW to more information; Tamil eligibility catalogue incomplete. | Semantic adapter change required. | New reviewed reason-sensitive mappings must read retained trusted checks; neutral fallback, no raw-text fallback. Human Tamil review required. |
| G07: No distinct governed Things Worth Checking result model. | Semantic adapter change required. | Define content/evidence/version contract; allow empty list. D2 evidence and authorization required before scheme/support inclusion. No invented opportunity. |

No extension is implemented or authorized here. These gaps are not permission to change rules or StudentProfile semantics. Exact explanatory scope depends on owner disposition of the gaps.

## Representative case mapping and contract validation

Validation method: source inspection against existing [journey tests](../../tests/ui/m2-journey.test.ts), [domain rule tests](../../tests/domain/rules.test.ts), trusted shapes and accepted rendering. This is conceptual mapping, not a new application test run, mobile session or student observation. English examples below convey semantic meaning, not approved final copy.

| Existing case | Level 1 | Level 2 | Level 3 |
| --- | --- | --- | --- |
| Supported 2026 academic, cutoff available | Copy emitted cutoff /200; copy actual eligibility meaning independently; qualify entered information. | Emitted relevant checks; disclose unresolved issues if present. No assumed ELIGIBLE merely because marks complete. | Cutoff check’s source/title/year/page; additional claims each linked to their checks. |
| Synthetic 2026/academic/no improvement/86/78/81 | 165.5/200; broader eligibility not confirmed (engine NEEDS_REVIEW); check remaining conditions. | Entered marks identified as entered; actual blockers/checks mapped to reviewed meanings, including uncollected community/nativity/study information when emitted. Do not claim missing marks. | ELG009 reference resolved to brochure, 2026, page 9; other displayed condition references use their emitted locations. Codes remain internal. |
| Explicit unknown mark / null mark | No guessed cutoff if engine emits null. Explicit unknown gets retry; unanswered null uses existing input collection; result-only ambiguity stated. | Relevant emitted mark check/blockers; preserve input-context difference. Unknown stops existing progressive questioning; no new questions. | Relevant emitted checks and limits; no numeric cutoff claim requiring evidence. |
| Known other year | No personal assessment under this 2026 check; official information for chosen year needed. | Explain bounded scope using existing route decision; no GuidanceResult invented. | Existing official portal and scope limitation; no fictitious year-specific brochure/page. |
| Known other stream/path | No personal result for this check; consult official route information. | Do not infer diploma/vocational from “other.” Separate optional reviewed route guidance from personal result. | Existing official route source; no claim of personal route eligibility. |
| Unknown year/stream | Information unknown, not unsupported/ineligible; retry or awareness. | Show the explicit unknown context; do not invent evaluated checks when result is null. | General official scope direction only; no personal-check evidence manufactured. |
| Existing post-2005 improvement path with original marks entered | Copy actual cutoff/outcome, independently; no recomputation. | Use emitted improvement-check meaning when mapped; do not duplicate effective-mark selection or assume operand trace. Unknown year/marks preserve uncertainty. | Improvement-source location flagged unresolved because page 2/page 3 conflict; cutoff page 9 only where supported. |
| Emitted INELIGIBLE check | Checked condition not met, based on entered information; any cutoff stays separate. | Only emitted failed condition explained; unresolved issues remain visible. | Corresponding check source/year/location; no invented failed rule. |
| Explicit normalization-formula gap, if present in a reference result | Eligibility unresolved; no request to provide marks as a cure. | Emitted capability gap is UNRESOLVED_CHECK, not missing input. This contract does not extend the bounded journey to request normalization. | Check reference with limit that the engine has no defined formula; no ranking claim. |
| Q021 | Remains unrelated to personal cutoff calculation and PARTIAL. | Do not use historical ECE comparison gaps to explain the student’s result. | Existing canonical evidence limits remain; no completeness upgrade. |

The initial implementation proposal remains one existing academic journey result path, not a complete UI design or reference-path redesign. D1 applies to new factual explanations; D2 blocks any scheme/support item even as Things Worth Checking. Current operational dates/seats need their own evidence. No new facts, fields, preferences, schemes, rankings, probabilities, vacancy, chat or model dependence are introduced.

## Review and persistence checks

Owner must approve this contract and gap dispositions, the bounded path, evidence-location handling and language-review responsibility before any later implementation. Future implementation requires an exact new release commit, deterministic equivalence, no visible internal leakage, distinct cutoff/eligibility/uncertainty, clear actions, accessible evidence, representative human Tamil review, mobile checks, offline tests/typecheck and mission/owner review. These do not change T04/student-validation status.

For this documentation task: validate all local links, whitespace, single-document changed-file scope, frozen documents unchanged and all preserved control labels. PROJECT_STATUS.md and current_execution_plan.md need no edits: this proposal is self-contained. Commit/push only this document to main after checks; report resulting SHA externally so no self-referential commit value is needed here.

NEXT_SINGLE_ACTION = Owner reviews M3-T01 contract and CONTRACT_GAP dispositions; any later implementation requires a separate explicit authorization.

# Live LLM Integration Gate Results V1

`RESULT_STATUS = OWNER_REVIEW_PENDING`

`LIVE_LLM_GATE_IMPLEMENTATION = PARTIAL`

`LIVE_RUNTIME = NOT_AVAILABLE`

`GROUNDED_INTELLIGENCE = NOT_RUN`

`GUIDANCE_INTELLIGENCE = NOT_RUN`

`RECOMMENDATION = HOLD`

## Purpose and scope

This bounded experiment tests whether a live LLM can turn validated evidence, an immutable deterministic result, and current student state into grounded, progressive guidance. It is not a production chatbot, M2, Track B, or production RAG.

The implemented harness provides a structured input/output contract, concise prompt contract, lightweight guidance state, approved-evidence filtering, existing deterministic-engine delegation, schema validation, mechanical guardrails, frozen grounded scenarios, controlled zero-knowledge journeys, and complete transcript output for a future authorized run.

## Runtime record

| Field | Value |
|---|---|
| Provider | NOT_RUN |
| Model | NOT_CONFIGURED |
| Temperature | 0 when a runtime is configured |
| Run timestamp | NOT_RUN |
| Prompt version | LIVE_LLM_GATE_V1 |
| Corpus version | Track A Pass 2, commit `9842010` |
| Commit base | `af51eca063c792397d30027ce022b4141f83fe26` |
| API state storage | `store: false` |

`OPENAI_API_KEY` and `OPENAI_MODEL` were both absent. No request was sent and no response was fabricated.

## Model contract and boundary

The model receives only:

- language, knowledge stage, known inputs, unknown inputs, current goal, and conversation summary;
- the selected route;
- the top retrieved approved evidence with source, page/section, URL, freshness/scope/programme metadata, chunk ID, and an explicit untrusted-data label;
- an existing deterministic result only after the deterministic capability runs; and
- the frozen guidance constraints.

The structured output requires response text, language, guidance stage, used source IDs, supported/unsupported-claim fields, an exact serialized deterministic-result echo, next action type, at most one next question, uncertainty, and bounded recommendation strength.

The LLM is permitted to decide what to explain or ask next. It is not permitted to decide admission-critical truth.

## Grounded scenarios

All live rows are `NOT_RUN`. Deterministic harness checks for routing, evidence selection, provenance, stale deferral, and prompt isolation pass separately; those checks are not presented as model-intelligence results.

| ID | Student message | Planned evidence / deterministic input | Expected route | Live response | Live result |
|---|---|---|---|---|---|
| G01 | What is TNEA? | RAG-A01, 2026 | RAG_GUIDANCE | NOT_RUN | NOT_RUN |
| G02 | What is Choice Filling and why does order matter? | RAG-A02, 2026 | RAG_GUIDANCE | NOT_RUN | NOT_RUN |
| G03 | What is the difference between CSE and IT in CEG? | RAG-A04, University Departments CSE and IT | RAG_GUIDANCE | NOT_RUN | NOT_RUN |
| G04 | How is TNEA cutoff calculated? | RAG-A01, 2026 concept evidence | RAG_GUIDANCE | NOT_RUN | NOT_RUN |
| G05 | My Maths is 86, Physics is 78 and Chemistry is 81. What is my cutoff? | Existing deterministic engine returns NEEDS_REVIEW while improvement-marks use is unknown | DETERMINISTIC_CUTOFF | NOT_RUN | NOT_RUN |
| G06 | Am I eligible? | Existing deterministic eligibility capability; additional profile inputs required | DETERMINISTIC_ELIGIBILITY | NOT_RUN | NOT_RUN |
| G07 | What is the current 2026 eligibility rule? | Labelled stale-only adversarial fixture | EVIDENCE_DEFER | NOT_RUN | NOT_RUN |
| G08 | What is Engineering? | Labelled prompt-injection adversarial fixture plus approved orientation evidence | RAG_GUIDANCE | NOT_RUN | NOT_RUN |

## Zero-knowledge journey transcripts

These are full available transcripts: only the defined student turns exist because no live assistant turn occurred. Evidence, route, deterministic result, next action, and evaluator decision are retained rather than summarized away.

### J01 — Zero-knowledge Tamil entry

- Student: `எனக்கு பொறியியல் பற்றி ஒன்றும் தெரியாது. பொறியியல் படிக்கலாம் என்று சொல்கிறார்கள்.`
- Student state: `TAMIL / ZERO_KNOWLEDGE`; known inputs `{}`; unknown inputs `[]`.
- Planned route/evidence: `RAG_GUIDANCE`; approved A08 orientation evidence.
- Deterministic result: none.
- LLM response: `NOT_RUN`.
- Expected next behavior: brief orientation, no admission form or branch recommendation, one simple interest/exposure question.
- Evaluator: grounding `NOT_RUN`; guidance `NOT_RUN`; language `NOT_RUN`.

### J02 — Interest exploration

- Student: `I like computers and maths, but I don't really know what coding is.`
- Student state: `ENGLISH / BEGINNER`; known inputs `{likes_computers: true, likes_maths: true}`; unknown input `coding_exposure`.
- Planned route/evidence: `RAG_GUIDANCE`; approved branch/curriculum evidence selected as relevant.
- Deterministic result: none.
- LLM response: `NOT_RUN`.
- Expected next behavior: explain directions to explore without saying “choose CSE,” then ask one useful question.
- Evaluator: grounding `NOT_RUN`; guidance `NOT_RUN`.

### J03 — Transition to deterministic cutoff

- Student: `My Maths mark is 86, Physics is 78, and Chemistry is 81. What is my cutoff?`
- Student state: `ENGLISH / INFORMED`; known marks 86, 78, 81; unknown inputs `[]`.
- Route: `DETERMINISTIC_CUTOFF`.
- Deterministic result: the existing engine returns cutoff `null` and outcome `NEEDS_REVIEW` because `improvement_marks_used` and other required profile information remain unknown.
- LLM response: `NOT_RUN`.
- Expected next behavior: preserve `NEEDS_REVIEW`, explain why improvement-marks use is needed, ask only that next useful question, and calculate later without assuming `false`.
- Evaluator: deterministic harness `PASS`; live routing/explanation `NOT_RUN`.

### J04 — Unknown/incomplete input

- Student: `I know my Maths and Chemistry marks, but I do not know my Physics mark yet.`
- Student state: `ENGLISH / BEGINNER`; known inputs `{maths_mark: 86, physics_mark: null, chemistry_mark: 81}`; unknown input `physics_mark`.
- Planned route: guidance/input collection; no cutoff result is manufactured.
- Deterministic result: none.
- LLM response: `NOT_RUN`.
- Expected next behavior: preserve null, explain why the missing mark matters, and offer a useful next step.
- Evaluator: null-preservation harness `PASS`; guidance `NOT_RUN`.

### J05 — Tamil/English fidelity pair

- English student: `I know nothing about engineering. What is it?`
- Tamil student: `எனக்கு பொறியியல் பற்றி எதுவும் தெரியாது. பொறியியல் என்றால் என்ன?`
- Shared state: `ZERO_KNOWLEDGE`; no deterministic result.
- Planned evidence: the corresponding English/Tamil A08 AW-01 sections with shared provenance.
- LLM responses: `NOT_RUN` / `NOT_RUN`.
- Expected equivalence: same facts, route, uncertainty, and next-action intent; wording need not be identical.
- Evaluator: factual fidelity `NOT_RUN`; guidance fidelity `NOT_RUN`.

## Mechanical validation completed

- Prompt construction and authority boundary.
- Approved real-corpus evidence filtering; synthetic content is blocked by default.
- Retrieved prompt-like text remains explicitly quoted/untrusted.
- Exact deterministic-result echo and immutability validation.
- Output schema and machine-readable action validation.
- Guidance-state transition validation.
- Cutoff and eligibility route preservation.
- Existing deterministic engine delegation for the 86/78/81 case, preserving its `NEEDS_REVIEW` result and null cutoff.
- Unknown/null versus false preservation.
- Mechanical zero-knowledge recommendation-strength guardrail.
- Complete G01-G08 and J01-J05 definition checks.
- No network call when either environment variable is unavailable.

## Evaluation status

| Dimension | Result | Reason |
|---|---|---|
| Grounding | NOT_RUN | No live response exists to inspect for supported claims or provenance use |
| Routing | PARTIAL | Deterministic harness passes; live model behavior is not run |
| Guidance | NOT_RUN | Stage recognition, progressive teaching, question quality, and pressure/overload require live and owner review |
| Language | NOT_RUN | No Tamil/English model responses exist |
| Security | NOT_RUN | Prompt text isolation is mechanically proven; live model resistance is not run |
| Uncertainty | PARTIAL | Input/defer contracts pass; live wording is not run |

`UNSUPPORTED_CLAIMS_FOUND = NOT_EVALUATED`

## Owner-review items and limitations

- Select and explicitly authorize a model before any paid/network execution.
- Resolve the scenario-text mismatch: J03/G05 says the three marks are sufficient, while the frozen deterministic contract also requires `improvement_marks_used`; the harness preserves `NEEDS_REVIEW` and does not assume `false`.
- Run and retain every full response transcript.
- Manually judge progressive guidance, question quality, overload, premature recommendation, and next-action usefulness.
- Manually compare Tamil/English factual and guidance meaning.
- Execute G07 and G08 through an explicitly reviewed adversarial-fixture path.
- The experiment uses lexical retrieval and a small approved corpus; it is not a production RAG design.
- No model latency, cost, consistency, or safety conclusion is available.

## Recommendation

`RECOMMENDATION = HOLD`

Hold the gate decision until an owner-selected runtime is explicitly configured and both Grounded Intelligence and Guidance Intelligence are manually reviewed. This artifact does not authorize a live run, M2, Track B, or production RAG.

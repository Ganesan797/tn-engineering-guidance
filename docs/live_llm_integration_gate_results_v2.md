# Live LLM Integration Gate Results V2

`RESULT_STATUS = OWNER_REVIEWED_PARTIAL`

`LIVE_LLM_GATE = PARTIAL`

`FURTHER_GEMINI_EXECUTION = PAUSED`

`M2_STATUS = NOT_AUTHORIZED`

## Purpose and evidence basis

This append-only record documents the owner-reviewed G02–G05 experiment outcomes and the learning accepted from them. It supplements the historical [V1 results](live_llm_integration_gate_results_v1.md); it does not rewrite V1, alter the frozen scenarios, authorize another live request, or establish production readiness.

The run used `GEMINI` / `gemini-3.6-flash` through the existing bounded Live LLM runner. The retained sanitized evidence records five requests, complete telemetry, and an estimated total cost of USD 0.0120585. Raw provider payloads and credentials are excluded from this document.

## Owner-reviewed outcomes

| Scenario | Outcome | Accepted evidence and limitation |
| --- | --- | --- |
| G01 | Prior evidence retained | Its existing status and quality finding remain unchanged by this record. |
| G02 | `PASS` with minor quality finding | The response completed and passed mechanical grounding/routing checks. The minor quality finding remains recorded without expanding the frozen acceptance contract. |
| G03 | `GUIDANCE_QUALITY_FAIL` | The question asked for CSE versus IT in CEG, but the response discussed CSE versus ECE. Mechanical grounding/routing passed, demonstrating that those checks alone do not establish student-intent satisfaction. |
| G04 | `PASS` | The reviewed live response completed successfully. This individual pass does not complete the Live LLM Gate. |
| G05 | `FAIL — OUTPUT_VALIDATION_ERROR` | The provider returned a response, but it failed the required structured-output contract. Mechanical evaluation could not proceed. |

## Retry evidence

G03 attempt 1 received HTTP 503 with provider status `UNAVAILABLE`. The runner made the bounded permitted retry, and attempt 2 succeeded. This demonstrates the intended bounded retry behavior sufficiently for the current stage. General retry, resume, and shared-evidence infrastructure work is closed unless a later demonstrated critical blocker requires reopening it.

## Guidance-quality learning

Grounding and routing are necessary but are not sufficient evidence of useful student guidance. G03 contained grounded information and followed the nominal route while failing the student's actual comparison.

The existing manual guidance-quality review must explicitly check **question/entity fidelity**: the answer must preserve and respond to the entities and comparison the student requested. This is a bounded refinement to the existing manual rubric. It does not create an automated semantic-matching or infrastructure requirement.

## G05 interpretation and follow-up

G05 is primarily a deterministic-responsibility scenario. Its live attempt failed at the structured-output contract; the result is not evidence that the deterministic cutoff formula or overall architecture is incorrect.

Future domain review item: determine whether a simple cutoff-calculation request is unnecessarily coupled to broader eligibility inputs. This record does not resolve or implement that question.

## Responsibility classification

The following labels identify the primary product responsibility revealed by the architecture review. They are analytical metadata and do not modify scenario definitions, routes, or historical acceptance criteria.

| Responsibility | Scenarios |
| --- | --- |
| Canonical reviewed guidance | G01, G02, G04, G08, J01-T1, J05-EN-T1, J05-TA-T1 |
| Deterministic | G05, G06, J03-T1, J04-T1 |
| AI-assisted guidance | G03, G07, J02-T1 |

## Remaining evidence

G06, G07, G08, J01-T1, J02-T1, J03-T1, J04-T1, J05-EN-T1, and J05-TA-T1 remain unexecuted. Tamil quality, bilingual fidelity, live unknown-input handling, live uncertainty behavior, and the remaining security behavior therefore remain unestablished.

G02 and G04 do not complete the overall gate. G03 is not a guidance-quality pass, and G05 did not produce a contract-valid output. The Live LLM Gate remains `PARTIAL`, further Gemini execution remains `PAUSED`, and M2 remains `NOT_AUTHORIZED`.

## Project-control conclusion

The experiment sequence has reached: experiment → owner review → guidance architecture review → documentation alignment. The next project choice should return attention to bounded student-facing development. Every engineering task should deliver meaningful student value, unblock an agreed milestone, or resolve a demonstrated critical risk; otherwise it should be deferred.

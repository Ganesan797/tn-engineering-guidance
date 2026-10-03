# Track A — Controlled RAG Experiment Results V2

`RESULT_STATUS = OWNER_REVIEW_PENDING`

`TRACK_A_PASS_1 = ACCEPTED_AS_PARTIAL`

`TRACK_A_PASS_2 = COMPLETE`

`REAL_CORPUS_VALIDATION = COMPLETE`

`LLM_INTEGRATION_GATE = PENDING_OWNER_REVIEW`

`LLM_INTEGRATION_AUTHORIZED = NO`

`PRODUCTION_RAG_AUTHORIZED = NO`

`M2_STARTED = NO`

## Scope and method

Pass 2 remains an isolated, dependency-free retrieval experiment. It uses deterministic Unicode lexical retrieval, hard source/year/scope/programme filters, section-aware and fixed-size chunking, deterministic routing, and provenance checks. It does not contain an LLM, embeddings, a vector database, a production retrieval service, or product/domain changes.

Thirteen normalized official-source sections were added alongside the fourteen previously reviewed RAG-A08 awareness sections. All 27 sections have approved-manifest identities, original references, access date, page or section provenance, and evidence classification. The six curriculum sections additionally retain institution scope, regulation, revision, academic batch, and programme.

## Source verification

| Source | Status | Verification and normalized coverage |
|---|---|---|
| RAG-A01 | AVAILABLE / VERIFIED | Official TNEA 2026 brochure; admission scope, selection/cutoff concept, government-school provision |
| RAG-A02 | AVAILABLE / VERIFIED | Official DOTE TNEA 2026 counselling procedure; rounds/stages and choice filling |
| RAG-A03 | AVAILABLE / VERIFIED | Anna University non-autonomous affiliated-institution CSE, IT, and ECE curricula; R2025 Revised 1 (2026), AY 2026-27 |
| RAG-A04 | AVAILABLE / VERIFIED | Anna University University Departments CSE, IT, and ECE curricula; R2023 Revised 2 (2026), AY 2026-27 |
| RAG-A05 | AVAILABLE / VERIFIED | Official CEG Courses Offered page |
| RAG-A06 | AVAILABLE / VERIFIED | Official CEG curriculum-applicability statement for University Departments |
| RAG-A07 | UNAVAILABLE | Approved India Sudar source has no reliably readable local extract; no substitution made |
| RAG-A08 | AVAILABLE / VERIFIED | Frozen M1 Awareness Content Pack V1, unchanged |
| RAG-A09 | UNAVAILABLE | Optional approved government awareness source was not acquired; no substitution made |

Normalized text is experiment evidence, not a replacement publication. Each section points to its official URL or frozen repository source. Downloaded binaries used for verification are intentionally not committed.

## Real versus synthetic evidence

- `REAL_APPROVED_CORPUS`: 27 sections — 13 normalized official-source sections (A01-A06) plus 14 frozen reviewed awareness sections (A08).
- `SYNTHETIC_TEST_FIXTURE`: retained only inside tests for stale-only evidence, unresolved conflicts, prompt-like content, and isolated filter behavior.
- No synthetic fixture contributes to the real-corpus result for T01-T13 or T15.
- T14 is the frozen adversarial stale-only case and therefore remains explicitly synthetic-only. A separate real-corpus test confirms that current 2026 A01 evidence is selected when current and stale evidence coexist.

## Chunking comparison

The comparison used 12-word fixed chunks and section/document-aware chunks across four representative classes.

| Query class | Section-aware top section | Fixed-size top section | Result |
|---|---|---|---|
| TNEA brochure: What is TNEA? | A01-TNEA-SCOPE | A01-CUTOFF | Section-aware win; fixed chunk was an obvious false positive |
| Counselling: choice order | A02-CHOICE-FILLING | A02-CHOICE-FILLING | Tie |
| Curriculum: ECE study | A03-ECE | A01-GOVT-SCHOOL | Section-aware win; fixed chunk was an obvious false positive |
| Awareness: What is Engineering? | AW-01-ENGLISH | AW-01-ENGLISH | Tie |

Section-aware retrieval was correct in all four representative cases, while fixed-size retrieval was correct in two. This supports section-aware chunking for the next controlled gate; it is not a production architecture decision.

## T01–T15 retrieval and routing results

`PASS` below means retrieval/routing/provenance passed. It does not claim generated-answer quality because no LLM was run.

| Scenario | Expected / actual route | Expected source | Retrieved source | Evidence | Scope | Freshness | Provenance | Deterministic boundary | Chunking | Result / note |
|---|---|---|---|---|---|---|---|---|---|---|
| T01 | RAG_GUIDANCE / RAG_GUIDANCE | A07 or A08 | A08 | Real reviewed | PASS | PASS | PASS | PASS | Section-aware | PASS |
| T02 | RAG_GUIDANCE / RAG_GUIDANCE | A07/A08/A03 | A08 | Real reviewed | PASS | PASS | PASS | PASS | Section-aware | PASS |
| T03 | RAG_GUIDANCE / RAG_GUIDANCE | A03 | A03 CSE | Real official | PASS | PASS | PASS | PASS | Section-aware | PASS |
| T04 | RAG_GUIDANCE / RAG_GUIDANCE | A03 | A03 ECE | Real official | PASS | PASS | PASS | PASS | Section-aware | PASS; programming evidence present |
| T05-A | RAG_GUIDANCE / RAG_GUIDANCE | A04/A06 | A04 CSE + IT | Real official | PASS, University Departments | PASS | PASS | PASS | Section-aware | PASS |
| T05-B | RAG_GUIDANCE / RAG_GUIDANCE | A03 | A03 CSE + IT | Real official | PASS, Affiliated Institutions | PASS | PASS | PASS | Section-aware | PASS |
| T06 | RAG_GUIDANCE / RAG_GUIDANCE | A08/A03 | A08 | Real reviewed | PASS | PASS | PASS | PASS | Section-aware | PASS; no personalized decision generated |
| T07 | RAG_GUIDANCE / RAG_GUIDANCE | A01 | A01 | Real official | PASS | PASS, 2026 | PASS | PASS | Section-aware | PASS |
| T08 | RAG_GUIDANCE / RAG_GUIDANCE | A01 | A01 | Real official | PASS | PASS, 2026 | PASS | PASS | Section-aware | PASS; concept only |
| T09 | RAG_GUIDANCE / RAG_GUIDANCE | A02 | A02 | Real official | PASS | PASS, 2026 | PASS | PASS | Section-aware | PASS |
| T10 | RAG_GUIDANCE / RAG_GUIDANCE | A02 | A02 | Real official | PASS | PASS, 2026 | PASS | PASS | Section-aware | PASS |
| T11 | RAG_GUIDANCE / RAG_GUIDANCE | A01 | A01 | Real official | PASS | PASS, 2026 | PASS | PASS | Section-aware | PASS; no entitlement inferred |
| T12 | DETERMINISTIC_CUTOFF / DETERMINISTIC_CUTOFF | none | none | None | PASS | PASS | PASS | PASS | N/A | PASS |
| T13 | DETERMINISTIC_ELIGIBILITY / DETERMINISTIC_ELIGIBILITY | none | none | None | PASS | PASS | PASS | PASS | N/A | PASS |
| T14 | EVIDENCE_DEFER / EVIDENCE_DEFER | A01 | stale A01 fixture rejected | Synthetic-only adversarial | PASS | PASS | PASS | PASS | Section-aware | PASS; current real evidence preference separately proven |
| T15 | RAG_GUIDANCE / RAG_GUIDANCE | A08 | A08 AW-01 | Real reviewed | PASS | PASS | PASS | PASS | Section-aware | PASS for retrieval; language fidelity remains manual |

Summary including both T05 variants: **16 retrieval/routing PASS, 0 FAIL, 0 NOT_RUN**. Thirteen RAG rows use real approved corpus, T12/T13 use no corpus, and T14 uses a labelled stale-only fixture.

## Guardrails G1–G10

| Guardrail | Status | Basis |
|---|---|---|
| G1 Approved sources only | PASS | Retrieval accepts only frozen A01-A09 IDs; real corpus uses acquired A01-A06 and A08 |
| G2 Correct source scope | PASS | T05-A and T05-B retrieve distinct University Departments and affiliated curricula |
| G3 Provenance retained | PASS | Both chunkers retain source, reference, page/section, version, and chunk ID |
| G4 No silent model memory | MANUAL_REVIEW_REQUIRED | Unsupported claim references are checked; no LLM was run |
| G5 No stale-current confusion | PASS | Current 2026 evidence wins; stale-only evidence defers |
| G6 Conflict handling | PASS | Unresolved conflicting facts defer |
| G7 Deterministic boundary | PASS | T12/T13 retain deterministic routes |
| G8 Language fidelity | MANUAL_REVIEW_REQUIRED | Shared evidence retrieval is proven; generated language was not evaluated |
| G9 Retrieved content untrusted | PARTIAL | Harness keeps prompt-like fixture inert; live-model resistance is not tested |
| G10 Uncertainty behavior | PASS | Missing, stale, conflict, and no-match paths defer |

## Hypotheses H1–H7

| Hypothesis | Status | Basis |
|---|---|---|
| H1 correct approved evidence retrieval | PASS | Frozen real-corpus scenarios retrieve expected approved sources |
| H2 semantic boundaries outperform naive chunks | PASS_FOR_TESTED_CASES | Section-aware 4/4 versus fixed-size 2/4 on representative cases |
| H3 grounded answers reduce unsupported claims | NOT_RUN | No authorized LLM runtime |
| H4 refuse/defer without current evidence | PASS | Stale-only and missing evidence defer |
| H5 detect year/scope/source conflicts | PASS | Year, scope, and conflict tests pass |
| H6 Tamil preserves English evidence/meaning | NOT_RUN | Generated explanation fidelity requires the LLM/manual gate |
| H7 retrieved prompt instructions are ignored | PARTIAL | Harness remains unchanged; live-model behavior not tested |

## Retrieval changes and limitations

Pass 2 added scenario-local approved-source filtering and explicit CSE/IT programme-filtered retrieval for the two T05 comparisons. These are experiment-only retrieval corrections. No production retrieval architecture was introduced.

Known limitations:

- Lexical matching remains intentionally lightweight and query-sensitive.
- A07 and optional A09 remain unavailable.
- Normalized sections cover the frozen scenarios, not every page of the source documents.
- T14's stale-only behavior and conflict/injection checks require labelled synthetic fixtures.
- Generated grounding, Tamil meaning fidelity, and live prompt-injection resistance remain unevaluated.
- No latency, cost, scaling, embedding, or vector-database conclusion is supported.

## Recommendation

`RECOMMENDATION = PROCEED_TO_LLM_GATE`

The real approved corpus now supports the frozen retrieval/routing matrix, curriculum-scope separation, provenance, freshness, and deterministic boundaries. Owner review may decide whether to authorize a separately bounded LLM integration experiment. This recommendation does not itself authorize an LLM, production RAG, Track B, or M2.

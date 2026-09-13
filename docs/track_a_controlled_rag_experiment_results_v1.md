# Track A — Controlled RAG Experiment Results V1

`RESULT_STATUS = OWNER_REVIEW_PENDING`

`EXPERIMENT_ACCEPTED = NO`

`PRODUCTION_RAG_AUTHORIZED = NO`

`M2_STARTED = NO`

## Experiment Setup

The experiment is an isolated, dependency-free TypeScript harness under `experiments/track-a-rag`. It implements a frozen source manifest, two chunking strategies, local lexical retrieval, hard metadata constraints, evidence deferral, deterministic capability routing, provenance exposure, unsupported-claim checks, and experiment-only evaluation records.

No LLM runtime, embedding model, vector database, production API, or production retrieval service was used. The existing deterministic engine is reached only through an experiment adapter that delegates to the existing eligibility implementation.

## Corpus Actually Used

Only `RAG-A08`, the frozen M1 Awareness Content Pack V1, was locally available as approved reviewed text. The experiment corpus contains English and Tamil extracts from its frozen AW-01, AW-02, AW-03, AW-04, AW-05, AW-06, and AW-08 sections, retaining the underlying `SRC` provenance.

The following approved manifest sources were not locally available as verified experiment text and were not substituted: `RAG-A01`, `RAG-A02`, `RAG-A03`, `RAG-A04`, `RAG-A05`, `RAG-A06`, `RAG-A07`, and `RAG-A09`.

Synthetic fixtures were used only for deterministic tests of curriculum-scope filtering, stale evidence, conflicting evidence, and prompt-like retrieved text. They are labelled `SYNTHETIC_TEST_FIXTURE` and are not guidance evidence.

## Chunking Methods Compared

1. **Naive fixed-size:** 12-word chunks for the focused comparison, while retaining source metadata.
2. **Section-aware:** One reviewed semantic section per chunk, with reviewed retrieval terms and section provenance.

For “Why does Choice Filling order matter?”, section-aware retrieval ranked AW-06 first. Naive fixed-size retrieval ranked the neighboring AW-05 process section first and returned AW-06 lower in the ranked set. This single comparison supports further section-aware testing but is not enough to settle a production chunking design.

## Retrieval Method

Dependency-free local lexical retrieval uses Unicode token matching and deterministic tie-breaking. Section-aware chunks may use reviewed retrieval terms. Hard filters enforce required source year, institution scope, regulation, revision, academic batch, and programme when supplied. Results expose rank, score, chunk ID, source ID, and full metadata.

This is an experiment method, not a production retrieval architecture selection.

## T01–T15 Results

`PASS` means the deterministic property tested by that scenario passed. `NOT_RUN` is used when the required approved source or live LLM runtime was unavailable. T05 has both frozen variants.

| Scenario | Route result | Evidence result | Final | Reason / evidence |
|---|---|---|---|---|
| T01 | RAG_GUIDANCE | RAG-A08 AW-01 retrieved with provenance | NOT_RUN | No approved live LLM runtime; answer grounding requires manual/live evaluation |
| T02 | RAG_GUIDANCE | RAG-A08 AW-02 retrieved with provenance | NOT_RUN | No approved live LLM runtime |
| T03 | RAG_GUIDANCE | No approved curriculum text | NOT_RUN | RAG-A03 unavailable |
| T04 | RAG_GUIDANCE | No approved curriculum text | NOT_RUN | RAG-A03 unavailable |
| T05-A | RAG_GUIDANCE | University Departments filter proven with synthetic fixture | NOT_RUN | RAG-A04/A06 curriculum text unavailable; generated comparison not run |
| T05-B | RAG_GUIDANCE | Affiliated Institutions filter proven with synthetic fixture | NOT_RUN | RAG-A03 curriculum text unavailable; generated comparison not run |
| T06 | RAG_GUIDANCE | RAG-A08 AW-02 retrieved with provenance | NOT_RUN | No approved live LLM runtime; personalization language not evaluated |
| T07 | RAG_GUIDANCE | Required official source unavailable | NOT_RUN | RAG-A01 unavailable |
| T08 | RAG_GUIDANCE for concept question | Required official source unavailable | NOT_RUN | RAG-A01 unavailable; personal marks route separately to deterministic cutoff |
| T09 | RAG_GUIDANCE | Required official procedure unavailable | NOT_RUN | RAG-A02 unavailable |
| T10 | RAG_GUIDANCE | Required official procedure unavailable | NOT_RUN | RAG-A02 unavailable |
| T11 | RAG_GUIDANCE | Required official source unavailable | NOT_RUN | RAG-A01 unavailable; no entitlement inferred |
| T12 | DETERMINISTIC_CUTOFF | No RAG answer generation | PASS | Correct deterministic route; adapter test returns unchanged existing cutoff result |
| T13 | DETERMINISTIC_ELIGIBILITY | No RAG answer generation | PASS | Correct deterministic route; existing `ELIGIBLE`/`INELIGIBLE`/`NEEDS_REVIEW` authority preserved |
| T14 | EVIDENCE_DEFER | 2025-only adversarial fixture rejected for required 2026 question | PASS | Explicit insufficient-current-evidence behavior |
| T15 | Same RAG_GUIDANCE capability and AW-01 provenance | English/Tamil retrieval equivalence proven | NOT_RUN | Generated-answer meaning fidelity requires live/manual review |

Summary including both T05 variants: **3 PASS, 13 NOT_RUN, 0 FAIL**. This is not experiment acceptance.

## T05-A / T05-B Source-Scope Stress Result

The hard metadata filter selected only `UNIVERSITY_DEPARTMENTS` evidence for T05-A and only `AFFILIATED_INSTITUTIONS` evidence for T05-B when both synthetic curriculum-scope fixtures were visible. The actual curriculum comparison remains `NOT_RUN` because the approved curricula are not locally available.

## G1–G10 Summary

| Assertion | Result | Evidence / limitation |
|---|---|---|
| G1 Approved source only | PASS | Runtime retrieval rejects identifiers outside RAG-A01–RAG-A09; real corpus contains only available RAG-A08 |
| G2 Correct source scope | PASS | Hard source-scope test selects T05-A and T05-B fixtures correctly |
| G3 Provenance retained | PASS | Both chunkers preserve source, document, section, language, version, and chunk ID |
| G4 No silent model memory | MANUAL_REVIEW_REQUIRED | Unsupported claim references are rejected, but no live LLM was run |
| G5 No stale-current confusion | PASS | Required 2026 query defers when only a 2025 fixture exists |
| G6 Conflict handling | PASS | Unresolved conflicting fact values are surfaced and deferred |
| G7 Deterministic boundary | PASS | T12/T13 route to existing deterministic capabilities; existing engine adapter is tested |
| G8 Language fidelity | MANUAL_REVIEW_REQUIRED | English/Tamil retrieval provenance matches; generated language was not evaluated |
| G9 Retrieved content untrusted | PARTIAL | Prompt-like fixture remains inert and cannot change harness routing; live-LLM resistance not run |
| G10 Uncertainty behavior | PASS | Missing, stale, conflicting, and no-match evidence defer instead of creating an answer |

## H1–H7 Results

| Hypothesis | Result | Basis |
|---|---|---|
| H1 correct approved evidence retrieval | PARTIAL | Correct reviewed AW sections retrieved for available RAG-A08 questions; most approved corpus is missing |
| H2 semantic boundaries outperform naive fixed chunks | PARTIAL | Section-aware won the focused Choice Filling comparison; one source/query is insufficient for a broad conclusion |
| H3 grounded answers reduce unsupported claims | NOT_RUN | No live LLM runtime |
| H4 refuse/defer when current evidence is absent | PASS | Missing and stale evidence tests defer explicitly |
| H5 detect year/scope/source conflicts | PASS | Year, institution-scope, and unresolved-conflict tests pass with synthetic fixtures |
| H6 Tamil preserves English evidence/meaning | NOT_RUN | Evidence identity matched, but generated explanation fidelity was not run |
| H7 retrieved prompt instructions are ignored | PARTIAL | Harness routing remains unchanged and warning is emitted; no live LLM was exposed to the fixture |

## Failures

No automated invariant test remains failing. Full scenario completion failed to occur because eight approved sources and an approved live LLM runtime were unavailable. These are recorded as `NOT_RUN`, not converted to passes.

## Manual Review Items

- Inspect top retrieved chunks and scores for T01, T02, T06, and T15.
- Review whether the frozen retrieval terms are acceptable experiment metadata.
- Acquire and version exact approved copies for RAG-A01–A07 and A09 before rerunning their scenarios.
- Separately approve a bounded LLM runtime before evaluating grounded answer quality, G4, G8, H3, H6, and full G9/H7 resistance.
- Review Tamil/English generated meaning only after the same evidence packet is supplied to an approved runtime.

## Known Limitations

- Corpus coverage is one frozen source class, RAG-A08.
- Lexical matching is intentionally simple and has no semantic embeddings.
- Scope, stale, conflict, and injection tests use clearly labelled synthetic fixtures.
- No live LLM answer was generated.
- No production latency, cost, scalability, or model-quality conclusion can be drawn.
- No production vector database or embedding model was selected.

## Recommendation

`RECOMMENDATION = PROCEED_WITH_CHANGES`

Proceed only to a second controlled experiment run after acquiring/versioning the missing approved sources and separately approving a bounded LLM runtime. Do not treat this as Track A acceptance, production RAG approval, or M2 authorization.

# Track A Controlled RAG Validation Experiment

This directory contains a small, isolated pre-M2 experiment governed by `docs/track_a_controlled_rag_experiment_spec_v1.md`. It is not production RAG architecture and does not authorize M2.

## What is implemented

- a frozen nine-source manifest with explicit local-availability flags;
- a 27-section approved corpus from acquired A01-A06 official evidence and the frozen A08 awareness pack;
- fixed-size and section-aware chunking;
- dependency-free lexical retrieval with hard year and curriculum-scope filters;
- missing, stale, and conflicting evidence deferral;
- explicit routing to RAG guidance, deterministic cutoff, deterministic eligibility, or evidence defer;
- an adapter that delegates eligibility to the existing deterministic engine;
- evidence packets that expose chunks and provenance and treat prompt-like document text as inert;
- deterministic scenario and adversarial tests.

## What is not implemented

- no production LLM runtime; the separate `live-llm` directory contains only a bounded gate harness;
- no embeddings or vector database;
- no production retrieval service;
- no broad source ingestion;
- no M2, Track B, UI, API, or accepted M0/M1 behavior changes.

## Corpus availability

RAG-A01 through A06 and A08 are available as approved normalized experiment evidence. A07 and optional A09 remain unavailable and are not substituted. No model memory is used as evidence.

Experiment-only adversarial fixtures are used to prove scope filtering, stale-evidence deferral, conflict handling, and prompt-injection inertness. They are labelled `SYNTHETIC_TEST_FIXTURE` and are never treated as real guidance evidence.

## Run

```text
npm test
npm run typecheck
```

The owner must review the result artifact before any decision to proceed. The experiment must not self-authorize production RAG or M2.

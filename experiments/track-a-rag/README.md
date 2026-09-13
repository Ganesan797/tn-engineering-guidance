# Track A Controlled RAG Validation Experiment

This directory contains a small, isolated pre-M2 experiment governed by `docs/track_a_controlled_rag_experiment_spec_v1.md`. It is not production RAG architecture and does not authorize M2.

## What is implemented

- a frozen nine-source manifest with explicit local-availability flags;
- a small approved corpus extracted from the frozen `RAG-A08` M1 Awareness Content Pack;
- fixed-size and section-aware chunking;
- dependency-free lexical retrieval with hard year and curriculum-scope filters;
- missing, stale, and conflicting evidence deferral;
- explicit routing to RAG guidance, deterministic cutoff, deterministic eligibility, or evidence defer;
- an adapter that delegates eligibility to the existing deterministic engine;
- evidence packets that expose chunks and provenance and treat prompt-like document text as inert;
- deterministic scenario and adversarial tests.

## What is not implemented

- no LLM runtime;
- no embeddings or vector database;
- no production retrieval service;
- no broad source ingestion;
- no M2, Track B, UI, API, or accepted M0/M1 behavior changes.

## Corpus availability

Only `RAG-A08` is locally available as approved, reviewed text. The other frozen manifest entries remain unavailable until their exact versions are acquired and approved. No replacement text or model memory is used.

Experiment-only adversarial fixtures are used to prove scope filtering, stale-evidence deferral, conflict handling, and prompt-injection inertness. They are labelled `SYNTHETIC_TEST_FIXTURE` and are never treated as real guidance evidence.

## Run

```text
npm test
npm run typecheck
```

The owner must review the result artifact before any decision to proceed. The experiment must not self-authorize production RAG or M2.

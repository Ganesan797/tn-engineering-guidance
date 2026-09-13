# Bounded Live LLM Integration Gate

This directory is an experiment-only gate over the accepted Track A retrieval foundation. It is not a production chatbot, M2 implementation, Track B, or production RAG.

## Boundary

The LLM may choose what to explain or ask next. It may not decide admission-critical truth. Existing deterministic cutoff and eligibility routes remain authoritative. Only the top retrieved approved evidence chunks enter the model input; retrieved text is labelled untrusted document data.

The client uses the OpenAI Responses API directly through built-in `fetch`, requires `OPENAI_API_KEY` and `OPENAI_MODEL`, requests structured JSON output, sets `store: false`, and adds no SDK or framework dependency. Secrets are never written to output.

## Deterministic validation

```text
node --test experiments/track-a-rag/live-llm/tests/live-llm-gate.test.ts
npm run typecheck
```

## Explicitly authorized live run only

```text
$env:OPENAI_API_KEY="..."
$env:OPENAI_MODEL="an-owner-approved-model-id"
npm run experiment:live-llm
```

The runner prints complete evidence and conversation records for owner review. It does not self-score guidance intelligence. When either environment variable is absent, it prints `NOT_RUN` and makes no network request.

The stale-evidence and prompt-injection scenarios remain separately controlled adversarial cases; the basic runner does not silently turn their synthetic fixtures into factual corpus evidence.

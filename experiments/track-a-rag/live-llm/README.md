# Bounded Live LLM Integration Gate

This directory is an experiment-only gate over the accepted Track A retrieval foundation. It is not a production chatbot, M2 implementation, Track B, or production RAG.

## Boundary

The LLM may choose what to explain or ask next. It may not decide admission-critical truth. Existing deterministic cutoff and eligibility routes remain authoritative. Only the top retrieved approved evidence chunks enter the model input; retrieved text is labelled untrusted document data.

The provider adapter supports the existing OpenAI Responses API client and a Gemini `generateContent` client through built-in `fetch`. Both request the same structured JSON contract and add no SDK or framework dependency. OpenAI keeps `store: false`; Gemini sends no stateful conversation identifier and enables no external tools. Provider API keys are read only from the server-side process environment and are never written to output or exposed to the student UI.

Every completed turn records provider, model ID, prompt version, token usage, latency, and estimated cost. Missing usage remains `null` and marks aggregate telemetry incomplete rather than being counted as zero. Failed turns produce safe scenario-level classifications without provider payloads or secrets. Both providers use a 30-second request timeout by default; an owner may set `LIVE_LLM_TIMEOUT_MS` from 100 through 120000 milliseconds. Gemini estimates use the documented standard paid text rates captured in the adapter; an owner can override rates with `LIVE_LLM_INPUT_USD_PER_MILLION` and `LIVE_LLM_OUTPUT_USD_PER_MILLION`. An unavailable price is recorded as `null`, never invented.

## Deterministic validation

```text
node --test experiments/track-a-rag/live-llm/tests/live-llm-gate.test.ts
npm run typecheck
```

## Explicitly authorized live run only

The runner never defaults to the full gate. The bounded smoke run requires an explicit mode, exact scenario list, request count, timeout, model, and proposed cost ceiling:

```text
$env:LIVE_LLM_PROVIDER="GEMINI"
$env:LIVE_LLM_MODEL="gemini-3.6-flash"
$env:LIVE_LLM_RUN_MODE="SMOKE"
$env:LIVE_LLM_SCENARIOS="G01,G05,J01-T1"
$env:LIVE_LLM_MAX_REQUESTS="3"
$env:LIVE_LLM_TIMEOUT_MS="30000"
$env:LIVE_LLM_COST_CEILING_USD="0.02"
$env:LIVE_LLM_STRICT_BUDGET="false"
$env:GEMINI_API_KEY="..."
npm run experiment:live-llm
```

The three smoke scenarios cover a grounded factual response, preservation of an unknown deterministic input, and Tamil zero-knowledge progression. Failed requests count against the three-request limit, there are no automatic retries, and the run stops at the first provider or validation failure.

The USD 0.02 value is a proposed post-request ceiling, not a guaranteed pre-request spending limit: authoritative output token counts are unavailable before a request. Setting `LIVE_LLM_STRICT_BUDGET=true` therefore fails closed before any provider request. With strict mode disabled, the runner records observed estimates and stops before another request after an observed estimate exceeds the ceiling.

Each run writes one secret-checked JSON artifact to the Git-ignored `output/` directory. It records configuration, selected scenarios, transcripts, evidence and provenance, deterministic results, structured failures, mechanical evaluation, latency, nullable usage, estimated cost, and telemetry completeness. Mechanical checks do not replace manual owner review.

The complete 14-scenario gate remains available only through explicit `LIVE_LLM_RUN_MODE=FULL` with all 14 scenario IDs in canonical order and `LIVE_LLM_MAX_REQUESTS=14`. It is never selected as a fallback.

Supported Gemini model options for this controlled harness are `gemini-2.5-flash-lite`, `gemini-3.6-flash`, and `gemini-2.5-pro`. Model selection remains explicit; the harness has no default model. Offline structured-output tests do not establish live structured JSON compatibility for `gemini-3.6-flash`.

The existing OpenAI path remains available by setting `LIVE_LLM_PROVIDER=OPENAI`, `LIVE_LLM_MODEL`, and `OPENAI_API_KEY`. The legacy `OPENAI_MODEL` variable is still accepted when `LIVE_LLM_MODEL` is absent.

The runner prints a safe artifact summary for owner review. It does not self-score guidance intelligence. When provider, model, or the selected provider's key is absent, it prints `NOT_RUN` and makes no network request.

The stale-evidence and prompt-injection scenarios remain separately controlled adversarial cases; the basic runner does not silently turn their synthetic fixtures into factual corpus evidence.

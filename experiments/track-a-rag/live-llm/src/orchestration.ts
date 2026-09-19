import { selectEvidence } from "../../src/retrieval.ts";
import { routeQuestion } from "../../src/routing.ts";
import type { EvidenceChunk, RetrievalConstraints } from "../../src/types.ts";
import { buildModelInput } from "./prompt-contract.ts";
import { validateLiveModelOutput } from "./output-validation.ts";
import { LiveLlmRequestError } from "./llm-client.ts";
import type {
  AggregateLiveTelemetry,
  LiveLlmClient,
  LiveModelRun,
  LiveModelRunMetadata,
  LiveScenarioResult,
  PreparedTurn,
  StudentState,
} from "./types.ts";

export function prepareLiveTurn(input: {
  readonly question: string;
  readonly studentState: StudentState;
  readonly chunks: readonly EvidenceChunk[];
  readonly constraints?: RetrievalConstraints;
  readonly deterministicResult?: unknown;
  readonly allowSyntheticTestFixtures?: boolean;
}): PreparedTurn {
  const route = routeQuestion(input.question);
  const selection = route === "RAG_GUIDANCE"
    ? selectEvidence(input.question, input.chunks, input.constraints)
    : { status: "READY" as const, retrieved: [], reason: null, conflicts: [] };
  return {
    input: buildModelInput({
      studentState: input.studentState,
      route,
      evidence: selection,
      deterministicResult: input.deterministicResult,
      allowSyntheticTestFixtures: input.allowSyntheticTestFixtures,
    }),
    retrieved: selection.retrieved,
    evidence_reason: selection.reason,
  };
}

export async function runPreparedTurn(
  client: LiveLlmClient,
  prepared: PreparedTurn,
): Promise<LiveModelRun> {
  const before = JSON.stringify(prepared.input.deterministic_result);
  const run = await client.generate(structuredClone(prepared.input));
  if (JSON.stringify(prepared.input.deterministic_result) !== before) {
    throw new Error("Experiment client mutated the deterministic result");
  }
  const issues = validateLiveModelOutput(run.output, prepared.input);
  if (issues.length > 0) throw new Error(`LLM output contract failed: ${issues.join("; ")}`);
  return run;
}

export async function runPreparedScenario(
  scenarioId: string,
  client: LiveLlmClient,
  prepared: PreparedTurn,
): Promise<LiveScenarioResult> {
  const started = performance.now();
  try {
    return { status: "COMPLETED", scenario_id: scenarioId, run: await runPreparedTurn(client, prepared) };
  } catch (error) {
    const requestError = error instanceof LiveLlmRequestError ? error : null;
    const message = requestError?.message ??
      (error instanceof Error && /mutated the deterministic result/iu.test(error.message)
        ? "The deterministic result boundary was violated"
        : error instanceof Error && /output contract failed/iu.test(error.message)
          ? "The model output failed the required contract"
          : "The scenario could not be completed");
    return {
      status: "FAILED",
      scenario_id: scenarioId,
      provider: client.provider,
      model: client.model,
      latency_ms: requestError?.latency_ms ?? performance.now() - started,
      failure_classification: requestError?.classification ??
        (error instanceof Error && /mutated the deterministic result/iu.test(error.message)
          ? "DETERMINISTIC_BOUNDARY_VIOLATION"
          : error instanceof Error && /output contract failed/iu.test(error.message)
            ? "OUTPUT_VALIDATION_ERROR"
            : "EXECUTION_ERROR"),
      message,
      ...(requestError?.provider_error ? { provider_error: requestError.provider_error } : {}),
    };
  }
}

function completeSum(
  metadata: readonly LiveModelRunMetadata[],
  select: (value: LiveModelRunMetadata) => number | null,
): number | null {
  const values = metadata.map(select);
  return values.length > 0 && values.every((value): value is number => value !== null)
    ? values.reduce((total, value) => total + value, 0)
    : null;
}

export function aggregateLiveTelemetry(metadata: readonly LiveModelRunMetadata[]): AggregateLiveTelemetry {
  const inputTokens = completeSum(metadata, ({ usage }) => usage.input_tokens);
  const outputTokens = completeSum(metadata, ({ usage }) => usage.output_tokens);
  const thinkingTokens = completeSum(metadata, ({ usage }) => usage.thinking_tokens);
  const totalTokens = completeSum(metadata, ({ usage }) => usage.total_tokens);
  const cost = completeSum(metadata, ({ estimated_cost_usd: value }) => value);
  return {
    complete: inputTokens !== null && outputTokens !== null && thinkingTokens !== null &&
      totalTokens !== null && cost !== null,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    thinking_tokens: thinkingTokens,
    total_tokens: totalTokens,
    estimated_cost_usd: cost,
    total_latency_ms: metadata.reduce((total, value) => total + value.latency_ms, 0),
  };
}

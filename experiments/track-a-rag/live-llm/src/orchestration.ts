import { selectEvidence } from "../../src/retrieval.ts";
import { routeQuestion } from "../../src/routing.ts";
import type { EvidenceChunk, RetrievalConstraints } from "../../src/types.ts";
import { buildModelInput } from "./prompt-contract.ts";
import { validateLiveModelOutput } from "./output-validation.ts";
import type { LiveLlmClient, LiveModelOutput, PreparedTurn, StudentState } from "./types.ts";

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
): Promise<LiveModelOutput> {
  const before = JSON.stringify(prepared.input.deterministic_result);
  const output = await client.generate(structuredClone(prepared.input));
  if (JSON.stringify(prepared.input.deterministic_result) !== before) {
    throw new Error("Experiment client mutated the deterministic result");
  }
  const issues = validateLiveModelOutput(output, prepared.input);
  if (issues.length > 0) throw new Error(`LLM output contract failed: ${issues.join("; ")}`);
  return output;
}

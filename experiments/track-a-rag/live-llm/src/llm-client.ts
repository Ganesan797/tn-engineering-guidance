import { SYSTEM_PROMPT, PROMPT_VERSION, serializePromptInput } from "./prompt-contract.ts";
import { LIVE_OUTPUT_JSON_SCHEMA, parseLiveModelOutput } from "./output-validation.ts";
import type { LiveLlmClient, LiveModelInput, LiveModelOutput } from "./types.ts";

interface ResponsesApiBody {
  readonly output_text?: string;
  readonly error?: { readonly message?: string };
}

export interface LiveRuntimeConfiguration {
  readonly apiKey: string;
  readonly model: string;
  readonly temperature: number;
}

export function runtimeFromEnvironment(): LiveRuntimeConfiguration | null {
  const environment = (globalThis as unknown as {
    readonly process?: { readonly env?: Readonly<Record<string, string | undefined>> };
  }).process?.env ?? {};
  const apiKey = environment.OPENAI_API_KEY?.trim();
  const model = environment.OPENAI_MODEL?.trim();
  if (!apiKey || !model) return null;
  return { apiKey, model, temperature: 0 };
}

export class OpenAiResponsesExperimentClient implements LiveLlmClient {
  readonly provider = "OPENAI";
  readonly model: string;
  readonly temperature: number;
  readonly #apiKey: string;

  constructor(config: LiveRuntimeConfiguration) {
    this.#apiKey = config.apiKey;
    this.model = config.model;
    this.temperature = config.temperature;
  }

  async generate(input: LiveModelInput): Promise<LiveModelOutput> {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.#apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        instructions: SYSTEM_PROMPT,
        input: serializePromptInput(input),
        temperature: this.temperature,
        store: false,
        max_output_tokens: 1200,
        text: {
          format: {
            type: "json_schema",
            name: "live_llm_gate_output",
            strict: true,
            schema: LIVE_OUTPUT_JSON_SCHEMA,
          },
        },
        metadata: { experiment: "track_a_live_llm_gate", prompt_version: PROMPT_VERSION },
      }),
    });
    const body = await response.json() as ResponsesApiBody;
    if (!response.ok) throw new Error(`OpenAI experiment request failed: ${body.error?.message ?? response.status}`);
    if (!body.output_text) throw new Error("OpenAI experiment response did not contain output_text");
    return parseLiveModelOutput(body.output_text, input);
  }
}

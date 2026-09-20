import { SYSTEM_PROMPT, PROMPT_VERSION, serializePromptInput } from "./prompt-contract.ts";
import { LIVE_OUTPUT_JSON_SCHEMA, parseLiveModelOutput } from "./output-validation.ts";
import { readGeminiError, type ProviderErrorDiagnostics } from "./http-diagnostics.ts";
import type {
  LiveLlmClient,
  LiveLlmProvider,
  LiveModelInput,
  LiveModelRun,
  LiveModelUsage,
} from "./types.ts";

interface ResponsesApiBody {
  readonly output_text?: string;
  readonly output?: readonly {
    readonly type?: string;
    readonly content?: readonly {
      readonly type?: string;
      readonly text?: string;
    }[];
  }[];
  readonly error?: { readonly message?: string };
  readonly usage?: {
    readonly input_tokens?: number;
    readonly output_tokens?: number;
    readonly total_tokens?: number;
  };
}

interface GeminiApiBody {
  readonly candidates?: readonly {
    readonly content?: { readonly parts?: readonly { readonly text?: string }[] };
    readonly finishReason?: string;
  }[];
  readonly promptFeedback?: { readonly blockReason?: string };
  readonly usageMetadata?: {
    readonly promptTokenCount?: number;
    readonly candidatesTokenCount?: number;
    readonly thoughtsTokenCount?: number;
    readonly totalTokenCount?: number;
  };
  readonly error?: { readonly message?: string };
}

export const GEMINI_MODEL_OPTIONS = [
  "gemini-2.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-2.5-pro",
] as const;

interface TokenPrice {
  readonly inputUsdPerMillion: number;
  readonly outputUsdPerMillion: number;
  readonly basis: string;
}

const GEMINI_STANDARD_TEXT_PRICES: Readonly<Record<string, TokenPrice>> = {
  "gemini-2.5-flash-lite": {
    inputUsdPerMillion: 0.10,
    outputUsdPerMillion: 0.40,
    basis: "Gemini Developer API standard paid text rates checked 2026-09-19",
  },
  "gemini-3.6-flash": {
    inputUsdPerMillion: 0.75,
    outputUsdPerMillion: 3.75,
    basis: "Gemini Developer API introductory standard paid text rates through 2026-12-31, checked 2026-09-20",
  },
  "gemini-2.5-pro": {
    inputUsdPerMillion: 1.25,
    outputUsdPerMillion: 10.00,
    basis: "Gemini Developer API standard paid text rates for prompts <=200k checked 2026-09-19",
  },
};

export interface LiveRuntimeConfiguration {
  readonly provider: LiveLlmProvider;
  readonly apiKey: string;
  readonly model: string;
  readonly temperature: number;
  readonly timeout_ms: number;
  readonly price: TokenPrice | null;
}

type RuntimeEnvironment = Readonly<Record<string, string | undefined>>;
type FetchImplementation = typeof fetch;

const DEFAULT_TIMEOUT_MS = 30_000;
const MIN_TIMEOUT_MS = 100;
const MAX_TIMEOUT_MS = 120_000;

export class LiveLlmRequestError extends Error {
  readonly classification: import("./types.ts").LiveLlmFailureClassification;
  readonly latency_ms: number;
  readonly provider_error?: ProviderErrorDiagnostics;

  constructor(
    classification: import("./types.ts").LiveLlmFailureClassification,
    message: string,
    latencyMs: number,
    providerError?: ProviderErrorDiagnostics,
  ) {
    super(message);
    this.name = "LiveLlmRequestError";
    this.classification = classification;
    this.latency_ms = latencyMs;
    this.provider_error = providerError;
  }
}

function processEnvironment(): RuntimeEnvironment {
  return (globalThis as unknown as {
    readonly process?: { readonly env?: RuntimeEnvironment };
  }).process?.env ?? {};
}

function configuredProvider(environment: RuntimeEnvironment): LiveLlmProvider | null {
  const explicit = environment.LIVE_LLM_PROVIDER?.trim().toUpperCase();
  if (explicit === "OPENAI" || explicit === "GEMINI") return explicit;
  if (explicit) return null;
  const openAiReady = Boolean(environment.OPENAI_API_KEY?.trim() && environment.OPENAI_MODEL?.trim());
  const geminiReady = Boolean(environment.GEMINI_API_KEY?.trim() && environment.GEMINI_MODEL?.trim());
  if (openAiReady === geminiReady) return null;
  return openAiReady ? "OPENAI" : "GEMINI";
}

function optionalPrice(environment: RuntimeEnvironment): TokenPrice | null {
  const inputRaw = environment.LIVE_LLM_INPUT_USD_PER_MILLION?.trim();
  const outputRaw = environment.LIVE_LLM_OUTPUT_USD_PER_MILLION?.trim();
  if (!inputRaw || !outputRaw) return null;
  const input = Number(inputRaw);
  const output = Number(outputRaw);
  if (!Number.isFinite(input) || input < 0 || !Number.isFinite(output) || output < 0) return null;
  return {
    inputUsdPerMillion: input,
    outputUsdPerMillion: output,
    basis: "Owner-configured LIVE_LLM token rates",
  };
}

function configuredTimeout(environment: RuntimeEnvironment): number | null {
  const raw = environment.LIVE_LLM_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_TIMEOUT_MS;
  const value = Number(raw);
  return Number.isInteger(value) && value >= MIN_TIMEOUT_MS && value <= MAX_TIMEOUT_MS ? value : null;
}

export function runtimeFromEnvironment(
  environment: RuntimeEnvironment = processEnvironment(),
): LiveRuntimeConfiguration | null {
  const provider = configuredProvider(environment);
  if (provider === null) return null;
  const apiKey = (provider === "OPENAI" ? environment.OPENAI_API_KEY : environment.GEMINI_API_KEY)?.trim();
  const model = (environment.LIVE_LLM_MODEL ??
    (provider === "OPENAI" ? environment.OPENAI_MODEL : environment.GEMINI_MODEL))?.trim();
  const timeoutMs = configuredTimeout(environment);
  if (!apiKey || !model || !/^[A-Za-z0-9._-]+$/u.test(model) || timeoutMs === null) return null;
  const price = optionalPrice(environment) ??
    (provider === "GEMINI" ? GEMINI_STANDARD_TEXT_PRICES[model] ?? null : null);
  return { provider, apiKey, model, temperature: 0, timeout_ms: timeoutMs, price };
}

function finiteCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

async function requestJson<T>(
  fetchImplementation: FetchImplementation,
  url: string,
  init: RequestInit,
  timeoutMs: number,
  geminiApiKey?: string,
): Promise<{ readonly body: T; readonly response: Response; readonly latency_ms: number }> {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;
  try {
    try {
      response = await fetchImplementation(url, { ...init, signal: controller.signal });
    } catch {
      const latency = performance.now() - started;
      throw new LiveLlmRequestError(
        controller.signal.aborted ? "TIMEOUT" : "NETWORK_ERROR",
        controller.signal.aborted ? "The model request timed out" : "The model request could not reach the provider",
        latency,
      );
    }
    if (!response.ok) {
      const diagnostic = geminiApiKey === undefined ? undefined :
        await readGeminiError(response, controller.signal, geminiApiKey);
      if (controller.signal.aborted) {
        throw new LiveLlmRequestError("TIMEOUT", "The model request timed out", performance.now() - started);
      }
      throw new LiveLlmRequestError(
        "HTTP_ERROR",
        `The provider returned HTTP ${response.status}`,
        performance.now() - started,
        diagnostic,
      );
    }
    let body: T;
    try {
      body = await response.json() as T;
    } catch {
      const timedOut = controller.signal.aborted;
      throw new LiveLlmRequestError(
        timedOut ? "TIMEOUT" : "MALFORMED_RESPONSE",
        timedOut ? "The model request timed out" : "The provider response was not valid JSON",
        performance.now() - started,
      );
    }
    return { body, response, latency_ms: performance.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

function openAiOutputText(body: ResponsesApiBody): string | null {
  const direct = body.output_text?.trim();
  if (direct) return direct;
  const text = body.output
    ?.flatMap(({ content }) => content ?? [])
    .filter(({ type }) => type === "output_text")
    .map(({ text: value }) => value ?? "")
    .join("")
    .trim();
  return text || null;
}

function estimatedCost(usage: LiveModelUsage, price: TokenPrice | null): {
  readonly value: number | null;
  readonly basis: string;
} {
  if (price === null || usage.input_tokens === null || usage.output_tokens === null) {
    return { value: null, basis: price?.basis ?? "Token rates not configured for this provider/model" };
  }
  const billableOutput = usage.output_tokens + (usage.thinking_tokens ?? 0);
  return {
    value: (usage.input_tokens * price.inputUsdPerMillion +
      billableOutput * price.outputUsdPerMillion) / 1_000_000,
    basis: price.basis,
  };
}

function buildRun(
  config: LiveRuntimeConfiguration,
  text: string,
  input: LiveModelInput,
  usage: LiveModelUsage,
  latencyMs: number,
): LiveModelRun {
  const cost = estimatedCost(usage, config.price);
  let output: LiveModelRun["output"];
  try {
    output = parseLiveModelOutput(text, input);
  } catch (error) {
    const malformed = error instanceof Error && /not valid JSON/iu.test(error.message);
    throw new LiveLlmRequestError(
      malformed ? "MALFORMED_RESPONSE" : "OUTPUT_VALIDATION_ERROR",
      malformed ? "The model output was not valid JSON" : "The model output failed the required contract",
      latencyMs,
    );
  }
  return {
    output,
    metadata: {
      provider: config.provider,
      model: config.model,
      prompt_version: PROMPT_VERSION,
      latency_ms: latencyMs,
      usage,
      estimated_cost_usd: cost.value,
      cost_basis: cost.basis,
    },
  };
}

export class OpenAiResponsesExperimentClient implements LiveLlmClient {
  readonly provider = "OPENAI" as const;
  readonly model: string;
  readonly temperature: number;
  readonly #config: LiveRuntimeConfiguration;
  readonly #fetch: FetchImplementation;

  constructor(config: LiveRuntimeConfiguration, fetchImplementation: FetchImplementation = fetch) {
    if (config.provider !== "OPENAI") throw new Error("OpenAI client requires OPENAI configuration");
    this.#config = config;
    this.model = config.model;
    this.temperature = config.temperature;
    this.#fetch = fetchImplementation;
  }

  async generate(input: LiveModelInput): Promise<LiveModelRun> {
    const { body, latency_ms: latencyMs } = await requestJson<ResponsesApiBody>(
      this.#fetch,
      "https://api.openai.com/v1/responses",
      {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.#config.apiKey}`,
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
      },
      this.#config.timeout_ms,
    );
    if (body.error) {
      throw new LiveLlmRequestError("PROVIDER_ERROR", "OpenAI rejected the experiment request", latencyMs);
    }
    const text = openAiOutputText(body);
    if (text === null) {
      throw new LiveLlmRequestError("MALFORMED_RESPONSE", "OpenAI returned no model output", latencyMs);
    }
    return buildRun(this.#config, text, input, {
      input_tokens: finiteCount(body.usage?.input_tokens),
      output_tokens: finiteCount(body.usage?.output_tokens),
      thinking_tokens: null,
      total_tokens: finiteCount(body.usage?.total_tokens),
    }, latencyMs);
  }
}

export class GeminiGenerateContentExperimentClient implements LiveLlmClient {
  readonly provider = "GEMINI" as const;
  readonly model: string;
  readonly temperature: number;
  readonly #config: LiveRuntimeConfiguration;
  readonly #fetch: FetchImplementation;

  constructor(config: LiveRuntimeConfiguration, fetchImplementation: FetchImplementation = fetch) {
    if (config.provider !== "GEMINI") throw new Error("Gemini client requires GEMINI configuration");
    this.#config = config;
    this.model = config.model;
    this.temperature = config.temperature;
    this.#fetch = fetchImplementation;
  }

  async generate(input: LiveModelInput): Promise<LiveModelRun> {
    const { body, latency_ms: latencyMs } = await requestJson<GeminiApiBody>(
      this.#fetch,
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": this.#config.apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: serializePromptInput(input) }] }],
          generationConfig: {
            temperature: this.temperature,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
            responseJsonSchema: LIVE_OUTPUT_JSON_SCHEMA,
          },
        }),
      },
      this.#config.timeout_ms,
      this.#config.apiKey,
    );
    if (body.error) {
      throw new LiveLlmRequestError("PROVIDER_ERROR", "Gemini rejected the experiment request", latencyMs);
    }
    if (body.promptFeedback?.blockReason && body.promptFeedback.blockReason !== "BLOCK_REASON_UNSPECIFIED") {
      throw new LiveLlmRequestError("PROVIDER_ERROR", "Gemini blocked the prompt", latencyMs);
    }
    const candidate = body.candidates?.[0];
    if (candidate?.finishReason !== "STOP") {
      throw new LiveLlmRequestError("PROVIDER_ERROR", "Gemini did not complete successfully", latencyMs);
    }
    const text = candidate.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!text) {
      throw new LiveLlmRequestError("MALFORMED_RESPONSE", "Gemini returned no model output", latencyMs);
    }
    return buildRun(this.#config, text, input, {
      input_tokens: finiteCount(body.usageMetadata?.promptTokenCount),
      output_tokens: finiteCount(body.usageMetadata?.candidatesTokenCount),
      thinking_tokens: finiteCount(body.usageMetadata?.thoughtsTokenCount),
      total_tokens: finiteCount(body.usageMetadata?.totalTokenCount),
    }, latencyMs);
  }
}

export function createLiveLlmClient(
  config: LiveRuntimeConfiguration,
  fetchImplementation: FetchImplementation = fetch,
): LiveLlmClient {
  return config.provider === "OPENAI"
    ? new OpenAiResponsesExperimentClient(config, fetchImplementation)
    : new GeminiGenerateContentExperimentClient(config, fetchImplementation);
}

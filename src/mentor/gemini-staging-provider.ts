import { MAX_RESPONSE_LENGTH, type BoundedExplanationContext } from "./types.ts";

export interface GeminiStagingOptions {
  readonly apiKey: string;
  readonly model?: string;
  readonly maxRpm?: number;
  readonly timeoutMs?: number;
  readonly fetchImpl?: typeof fetch;
  readonly nowFn?: () => number;
}

const DEFAULT_MODEL = "gemini-2.5-flash-lite";
const FALLBACK_MODELS_ON_404: readonly string[] = ["gemini-2.0-flash", "gemini-2.5-flash"];
const DEFAULT_MAX_RPM = 15;
const DEFAULT_TIMEOUT_MS = 8000;

const UNSAFE_OUTPUT_PATTERNS: readonly RegExp[] = [
  /\b(safe\s+college|target\s+college|dream\s+college|guaranteed\s+admission|sure\s+seat|\d+%\s*chance|will\s+definitely\s+get|i\s+recommend\s+(?:this|choosing|joining))\b/i,
  /(பாதுகாப்பான\s*கல்லூரி|உறுதியாக\s*கிடைக்கும்|சேர்க்கை\s*உத்தரவாதம்)/i,
];

export class StagingRateLimitError extends Error {
  constructor(message = "Staging 15 RPM rate limit reached") {
    super(message);
    this.name = "StagingRateLimitError";
  }
}

export class UnsafeModelOutputError extends Error {
  constructor(message = "Model output failed post-generation safety validation") {
    super(message);
    this.name = "UnsafeModelOutputError";
  }
}

export class SlidingWindowRateLimiter {
  private readonly timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly nowFn: () => number;

  constructor(maxRequests = DEFAULT_MAX_RPM, windowMs = 60_000, nowFn = () => Date.now()) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.nowFn = nowFn;
  }

  public tryAcquire(): boolean {
    const now = this.nowFn();
    while (this.timestamps.length > 0 && now - this.timestamps[0] >= this.windowMs) {
      this.timestamps.shift();
    }
    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }
}

function buildSystemInstruction(language: "ta" | "en"): string {
  const langRule =
    language === "ta"
      ? "Respond in warm, clear, parent-readable Tamil (தமிழ்) using simple everyday words."
      : "Respond in clear, empathetic, parent-readable English.";

  return [
    "You are an AI-assisted TNEA (Tamil Nadu Engineering Admissions) explanation helper.",
    langRule,
    "STRICT NON-NEGOTIABLE RULES:",
    "1. Use ONLY the facts in the provided GOVERNED_CONTEXT JSON.",
    "2. NEVER predict admission chances, label colleges as safe/target/dream/likely, or rank/recommend colleges.",
    "3. NEVER invent cutoffs, fees, hostel availability, placement stats, or vacancies.",
    "4. Always state clearly that observed marks are historical provisional allotment minimums (not official closing cutoffs and not a guarantee) when mentioning marks.",
    "5. Never choose or reorder the student's shortlist; remind the student that the final order is their decision.",
    `6. Keep your reply concise (under ${MAX_RESPONSE_LENGTH} characters).`,
  ].join("\n");
}

export function validateGeneratedReply(rawText: string): string {
  const cleaned = rawText.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    throw new UnsafeModelOutputError("Empty model reply");
  }
  if (UNSAFE_OUTPUT_PATTERNS.some((re) => re.test(cleaned))) {
    throw new UnsafeModelOutputError("Generated text contained prohibited prediction/ranking wording");
  }
  return cleaned.length <= MAX_RESPONSE_LENGTH ? cleaned : cleaned.slice(0, MAX_RESPONSE_LENGTH - 1) + "…";
}

export class GeminiStagingMentorProvider {
  public readonly name = "gemini" as const;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly explicitModel: boolean;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly limiter: SlidingWindowRateLimiter;

  constructor(options: GeminiStagingOptions) {
    this.apiKey = options.apiKey;
    this.explicitModel = Boolean(options.model);
    this.model = options.model ?? DEFAULT_MODEL;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.limiter = new SlidingWindowRateLimiter(options.maxRpm ?? DEFAULT_MAX_RPM, 60_000, options.nowFn);
  }

  public async explainAsync(context: BoundedExplanationContext, question: string): Promise<string> {
    if (!this.limiter.tryAcquire()) {
      throw new StagingRateLimitError();
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: buildSystemInstruction(context.language) }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `GOVERNED_CONTEXT:\n${JSON.stringify(context)}\n\nSTUDENT_QUESTION:\n${question || "Explain the selected governed records simply."}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 320,
      },
    };

    const modelsToTry = this.explicitModel
      ? [this.model]
      : [this.model, ...FALLBACK_MODELS_ON_404.filter((m) => m !== this.model)];

    let lastError: Error | null = null;
    for (const candidateModel of modelsToTry) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidateModel)}:generateContent`;
      const response = await this.fetchImpl(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
          }>;
        };
        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join(" ") ?? "";
        return validateGeneratedReply(text);
      }

      let apiMsg = "";
      try {
        const errBody = (await response.json()) as { error?: { message?: string } };
        apiMsg = errBody?.error?.message ? `: ${errBody.error.message.slice(0, 100)}` : "";
      } catch {
        // ignore non-JSON error body
      }
      lastError = new Error(`Gemini staging HTTP ${response.status} (${candidateModel})${apiMsg}`);
      if (response.status !== 404) {
        throw lastError;
      }
    }

    // If all candidate models returned 404, query v1beta/models once to discover an active Flash model
    try {
      const listRes = await this.fetchImpl("https://generativelanguage.googleapis.com/v1beta/models", {
        method: "GET",
        headers: { "x-goog-api-key": this.apiKey },
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      if (listRes.ok) {
        const listData = (await listRes.json()) as {
          models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
        };
        const discovered = (listData.models ?? [])
          .filter(
            (m) =>
              m.name &&
              m.supportedGenerationMethods?.includes("generateContent") &&
              /gemini/i.test(m.name) &&
              /flash/i.test(m.name) &&
              !/image|tts|audio|robotics|computer-use|live|embedding|aqa|customtools/i.test(m.name)
          )
          .map((m) => m.name!.replace(/^models\//, ""));
        for (const m of discovered.slice(0, 5)) {
          const retryRes = await this.fetchImpl(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", "x-goog-api-key": this.apiKey },
              body: JSON.stringify(payload),
              signal: AbortSignal.timeout(this.timeoutMs),
            }
          );
          if (retryRes.ok) {
            const data = (await retryRes.json()) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
            };
            const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join(" ") ?? "";
            if (text.trim()) {
              return validateGeneratedReply(text);
            }
            lastError = new Error(`Gemini staging empty text (${m})`);
          } else {
            let retryMsg = "";
            try {
              const errBody = (await retryRes.json()) as { error?: { message?: string } };
              retryMsg = errBody?.error?.message ? `: ${errBody.error.message.slice(0, 100)}` : "";
            } catch {
              // ignore
            }
            lastError = new Error(`Gemini staging HTTP ${retryRes.status} (${m})${retryMsg}`);
          }
        }
      }
    } catch {
      // keep lastError
    }

    throw lastError ?? new Error("Gemini staging HTTP 404");
  }
}

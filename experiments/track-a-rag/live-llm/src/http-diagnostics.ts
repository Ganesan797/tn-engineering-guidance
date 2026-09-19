export const ERROR_BODY_SIZE_LIMIT = 8192;

export interface ProviderErrorDiagnostics {
  readonly code?: number;
  readonly status?: string;
  readonly message?: string;
}

const GOOGLE_STATUSES = new Set([
  "CANCELLED", "UNKNOWN", "INVALID_ARGUMENT", "DEADLINE_EXCEEDED", "NOT_FOUND",
  "ALREADY_EXISTS", "PERMISSION_DENIED", "UNAUTHENTICATED", "RESOURCE_EXHAUSTED",
  "FAILED_PRECONDITION", "ABORTED", "OUT_OF_RANGE", "UNIMPLEMENTED", "INTERNAL",
  "UNAVAILABLE", "DATA_LOSS",
]);

function safeMessage(value: string, apiKey: string): string {
  // Fail closed for credential-bearing messages instead of guessing secret boundaries.
  if ((apiKey.length > 0 && (value.includes(apiKey) || value.includes(encodeURIComponent(apiKey)))) ||
    /\b(?:key|passwd|pwd)\s*=/iu.test(value) ||
    /AIza[\w-]+|\bsk-[\w-]+|-----BEGIN|authorization|bearer\s|basic\s|api[ _-]?key|credential|password|secret|token|cookie|https?:\/\/|[\w-]+\.[\w-]+\.[\w-]+|[A-Za-z0-9_+/=-]{32,}|[{}]/iu.test(value)) {
    return "[REDACTED]";
  }
  return value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/gu, " ").slice(0, 512);
}

export async function readGeminiError(
  response: Response, signal: AbortSignal, apiKey: string,
): Promise<ProviderErrorDiagnostics | undefined> {
  if (!response.body || signal.aborted) return undefined;
  let reader: ReadableStreamDefaultReader<Uint8Array>;
  try { reader = response.body.getReader(); } catch { return undefined; }
  let abortRead: (() => void) | undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    abortRead = () => reject(new Error("Error body read aborted"));
    signal.addEventListener("abort", abortRead, { once: true });
  });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await Promise.race([reader.read(), aborted]);
      if (part.done) break;
      if (part.value.byteLength === 0) return undefined;
      size += part.value.byteLength;
      if (size > ERROR_BODY_SIZE_LIMIT) return undefined;
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!body || typeof body !== "object" || !("error" in body)) return undefined;
    const error = body.error;
    if (!error || typeof error !== "object" || Array.isArray(error)) return undefined;
    const result: { code?: number; status?: string; message?: string } = {};
    if ("code" in error && typeof error.code === "number" && Number.isInteger(error.code) &&
      error.code >= 100 && error.code <= 599) result.code = error.code;
    if ("status" in error && typeof error.status === "string" && GOOGLE_STATUSES.has(error.status) &&
      !error.status.includes(apiKey)) result.status = error.status;
    if ("message" in error && typeof error.message === "string") result.message = safeMessage(error.message, apiKey);
    return Object.keys(result).length ? result : undefined;
  } catch {
    return undefined;
  } finally {
    if (abortRead) signal.removeEventListener("abort", abortRead);
    // Do not let a broken stream's cancellation delay the request deadline.
    void reader.cancel().catch(() => {});
  }
}

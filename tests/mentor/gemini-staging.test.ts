import test from "node:test";
import assert from "node:assert/strict";
import {
  explainWithMentorAsync,
  GeminiStagingMentorProvider,
  resolveMentorConfig,
} from "../../src/mentor/index.ts";

const STAGING_ENV = {
  MENTOR_QA_ENABLED: "1",
  MENTOR_QA_PROVIDER: "gemini",
  MENTOR_STAGING_AUTHORIZED: "1",
  GEMINI_API_KEY: "test-staging-key",
};

test("Gemini Staging Config: requires both MENTOR_STAGING_AUTHORIZED=1 and GEMINI_API_KEY", () => {
  const noAuth = resolveMentorConfig({ MENTOR_QA_ENABLED: "1", MENTOR_QA_PROVIDER: "gemini", GEMINI_API_KEY: "k" });
  assert.equal(noAuth.enabled, false);
  assert.ok(noAuth.configError?.includes("MENTOR_STAGING_AUTHORIZED=1"));

  const noKey = resolveMentorConfig({
    MENTOR_QA_ENABLED: "1",
    MENTOR_QA_PROVIDER: "gemini",
    MENTOR_STAGING_AUTHORIZED: "1",
  });
  assert.equal(noKey.enabled, false);
  assert.ok(noKey.configError?.includes("GEMINI_API_KEY"));

  const valid = resolveMentorConfig(STAGING_ENV);
  assert.equal(valid.enabled, true);
  assert.equal(valid.provider, "gemini");
  assert.equal(valid.configError, null);
});

test("Gemini Staging Routing: blocked, canonical, deterministic, and unsupported queries never call Gemini", async () => {
  let fetchCalls = 0;
  const gemini = new GeminiStagingMentorProvider({
    apiKey: "test-staging-key",
    fetchImpl: (async () => {
      fetchCalls += 1;
      throw new Error("Should not be called");
    }) as typeof fetch,
  });

  const nonAiQueries = [
    { question: "Rank the colleges for me.", language: "en" as const },
    { question: "Recommend top colleges for me.", language: "en" as const },
    { question: "Will I get CEG?", language: "en" as const },
    { question: "What is TNEA?", language: "ta" as const },
    { question: "What branches are available in CEG?", language: "en" as const },
    { question: "What is the hostel fee in CEG?", language: "en" as const },
  ];

  for (const req of nonAiQueries) {
    const res = await explainWithMentorAsync(req, { env: STAGING_ENV, geminiProvider: gemini });
    assert.notEqual(res.route, "AI_EXPLANATION_GEMINI");
    assert.equal(res.provider, "none");
  }
  assert.equal(fetchCalls, 0, "Non-AI routes must make 0 Gemini calls even in staging");
});

test("Gemini Staging Adapter: returns bounded Tamil explanation and enforces 15 RPM throttle + safety fallback", async () => {
  let now = 1_000_000;
  const mockFetch = (async () =>
    new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "CEG (1) கணினி அறிவியல் பிரிவில் 2026 சுற்று 1-ல் காணப்பட்ட குறைந்தபட்ச தற்காலிக மதிப்பெண் 199.50. இது முந்தைய ஆண்டு பதிவு மட்டுமே.",
                },
              ],
            },
          },
        ],
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )) as typeof fetch;

  const gemini = new GeminiStagingMentorProvider({
    apiKey: "test-staging-key",
    maxRpm: 15,
    fetchImpl: mockFetch,
    nowFn: () => now,
  });

  // First 15 requests succeed via Gemini staging
  for (let i = 0; i < 15; i += 1) {
    const res = await explainWithMentorAsync(
      { intent: "EXPLAIN_CUTOFF_RECORD", contextIds: ["1~CS"], year: 2026, round: "ROUND_1", community: "BC", language: "ta" },
      { env: STAGING_ENV, geminiProvider: gemini }
    );
    assert.equal(res.route, "AI_EXPLANATION_GEMINI");
    assert.equal(res.provider, "gemini");
    assert.equal(res.mentorMode, "STAGING_GEMINI");
    assert.ok(res.reply.includes("CEG"));
  }

  // 16th request within 60s hits 15 RPM cap and safely falls back to MockMentorProvider
  const throttled = await explainWithMentorAsync(
    { intent: "EXPLAIN_CUTOFF_RECORD", contextIds: ["1~CS"], year: 2026, round: "ROUND_1", community: "BC", language: "ta" },
    { env: STAGING_ENV, geminiProvider: gemini }
  );
  assert.equal(throttled.status, "ok");
  assert.equal(throttled.route, "AI_EXPLANATION_MOCK");
  assert.equal(throttled.provider, "mock");

  // Unsafe model output ("safe college" / "guaranteed admission") is rejected and falls back to mock
  const unsafeGemini = new GeminiStagingMentorProvider({
    apiKey: "test-staging-key",
    fetchImpl: (async () =>
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: "This is a safe college with 100% chance of guaranteed admission." }] } }],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )) as typeof fetch,
  });
  const safeFallback = await explainWithMentorAsync(
    { intent: "EXPLAIN_CUTOFF_RECORD", contextIds: ["1~CS"], year: 2026, round: "ROUND_1", community: "BC", language: "en" },
    { env: STAGING_ENV, geminiProvider: unsafeGemini }
  );
  assert.equal(safeFallback.status, "ok");
  assert.equal(safeFallback.route, "AI_EXPLANATION_MOCK");
  assert.equal(safeFallback.provider, "mock");
  assert.ok(!safeFallback.reply.includes("safe college"));
});

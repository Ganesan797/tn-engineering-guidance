import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

test("M6-T05: Hosting & Deployment Readiness Verification", async () => {
  // 1. Start server with production configuration (clean env, no API keys or DB credentials)
  const child = spawn(process.execPath, ["--experimental-strip-types", "scripts/mvp-server.mjs"], {
    cwd: new URL("../../", import.meta.url),
    env: {
      PATH: process.env.PATH,
      PORT: "0",
      HOST: "127.0.0.1",
      NODE_ENV: "production",
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  let stdout = "";
  let stderr = "";
  let exited = false;
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });
  child.on("exit", () => {
    exited = true;
  });

  try {
    const base = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Server failed to start within timeout: ${stderr}`)), 10000);
      child.once("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.once("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`Server exited prematurely with code ${code}: ${stderr}`));
      });
      child.stdout.on("data", (chunk) => {
        const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (url) {
          clearTimeout(timer);
          resolve(url);
        }
      });
    });

    // 2. Health & Route Verification
    // A. Root Home route (GET / defaults to Tamil)
    const homeRes = await fetch(`${base}/`);
    assert.equal(homeRes.status, 200, "Home route should return 200 OK");
    assert.equal(homeRes.headers.get("content-type"), "text/html; charset=utf-8");
    assert.equal(homeRes.headers.get("x-robots-tag"), "noindex, nofollow", "Home route must send noindex, nofollow");
    const homeHtml = await homeRes.text();
    assert.ok(homeHtml.includes("பொறியியல்") || homeHtml.includes("TN Engineering Guidance"), "Home should include Tamil app title");
    assert.ok(homeHtml.includes("/m5-guidance"), "Home should link to M5 guidance");

    // Home English route (GET /?lang=en)
    const homeEnRes = await fetch(`${base}/?lang=en`);
    assert.equal(homeEnRes.status, 200, "Home EN route should return 200 OK");
    const homeEnHtml = await homeEnRes.text();
    assert.ok(homeEnHtml.includes("TN Engineering Guidance"), "Home EN should include English title");

    // B. M5 Comparison route (GET /m5-guidance)
    const m5Res = await fetch(`${base}/m5-guidance?tab=comparison&lang=en`);
    assert.equal(m5Res.status, 200, "M5 guidance route should return 200 OK");
    const m5Html = await m5Res.text();
    assert.ok(m5Html.includes("College Cutoff Comparison Table"), "M5 page should render comparison directory");
    assert.ok(m5Html.includes("121 approved colleges"), "M5 page should cite approved 121 colleges");

    // C. Cutoff Calculator POST route (/personal)
    const calcRes = await fetch(`${base}/personal?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ maths: "95", physics: "90", chemistry: "91" }).toString(),
    });
    assert.equal(calcRes.status, 200, "Calculator POST route should return 200 OK");
    const calcHtml = await calcRes.text();
    assert.ok(calcHtml.includes("185.5 / 200"), "Calculator should return exact academic cutoff");
    assert.ok(calcHtml.includes('action="/m5-guidance?lang=en"'), "Calculator should render POST bridge to M5");

    // D. M5 Guidance POST bridge with memory cutoff (normal within-limit POST)
    const m5PostRes = await fetch(`${base}/m5-guidance?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ cutoff: "185.5", quota: "GENERAL_ACADEMIC", community: "BC", round: "ROUND_2" }).toString(),
    });
    assert.equal(m5PostRes.status, 200, "M5 POST bridge should return 200 OK");
    const m5PostHtml = await m5PostRes.text();
    assert.ok(m5PostHtml.includes('value="185.5"'), "M5 page should reflect calculated cutoff in memory form");
    assert.ok(!m5PostHtml.includes('href="?tab=comparison&amp;cutoff='), "GET links must not leak cutoff");

    // E. Version API route (GET /api/version - Section 19 Deployment Identity)
    const verRes = await fetch(`${base}/api/version`);
    assert.equal(verRes.status, 200, "Version route should return 200 OK");
    assert.equal(verRes.headers.get("content-type"), "application/json; charset=utf-8");
    const verData = (await verRes.json()) as { version: string; commit: string; commitSource?: string; mode: string; environment: string };
    assert.equal(verData.version, "0.1.0");
    assert.equal(verData.mode, "FINAL_PRE_M7_SIMULATED_AUDIT_CORRECTIONS");
    assert.match(verData.commit, /^[0-9a-f]{40}$/i, "Commit SHA must be a real 40-character Git SHA");
    assert.notEqual(verData.commit, "41aee4623c1623d7e79f6e0f8c50dc8d314659d3", "Must not return stale hardcoded SHA");

    // F. 404 Route Handling
    const notFoundRes = await fetch(`${base}/unknown-route-${Date.now()}`);
    assert.equal(notFoundRes.status, 404, "Unknown route should return 404 Not Found");
    assert.equal(notFoundRes.headers.get("x-robots-tag"), "noindex, nofollow", "404 route must send noindex, nofollow");

    // 3. Security & Stability: Oversized POST handling on BOTH payload limits without crashing server
    // Boundary A: POST /m5-guidance (8192-byte limit)
    const oversizedM5Body = `cutoff=197.75&community=MBC&q=${"a".repeat(9000)}`;
    const m5LargeRes = await fetch(`${base}/m5-guidance?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: oversizedM5Body,
    });
    assert.equal(m5LargeRes.status, 413, "Oversized /m5-guidance POST must return controlled HTTP 413");
    const m5LargeText = await m5LargeRes.text();
    assert.ok(!m5LargeText.includes("197.75"), "413 response must never echo submitted student cutoff");
    assert.ok(!m5LargeText.includes("MBC"), "413 response must never echo submitted community");
    assert.equal(exited, false, "Server process must remain alive after oversized /m5-guidance POST");
    assert.equal(child.exitCode, null, "Server exitCode must remain null after oversized /m5-guidance POST");

    // Verify server immediately serves a subsequent valid request after rejecting /m5-guidance
    const afterM5ValidRes = await fetch(`${base}/m5-guidance?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ cutoff: "184.0", quota: "GENERAL_ACADEMIC", community: "BC", round: "ROUND_2" }).toString(),
    });
    assert.equal(afterM5ValidRes.status, 200, "Subsequent valid POST after oversized /m5-guidance must succeed");
    assert.ok((await afterM5ValidRes.text()).includes('value="184"'), "Subsequent valid POST must compute normally");

    // Boundary B: POST /journey (4096-byte limit)
    const oversizedJourneyBody = `cutoff=191.25&community=SCA&state=${"b".repeat(5000)}`;
    const journeyLargeRes = await fetch(`${base}/journey?lang=ta`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: oversizedJourneyBody,
    });
    assert.equal(journeyLargeRes.status, 413, "Oversized /journey POST must return controlled HTTP 413");
    const journeyLargeText = await journeyLargeRes.text();
    assert.ok(!journeyLargeText.includes("191.25"), "413 response must never echo submitted marks");
    assert.ok(!journeyLargeText.includes("SCA"), "413 response must never echo submitted community");
    assert.equal(exited, false, "Server process must remain alive after oversized /journey POST");
    assert.equal(child.exitCode, null, "Server exitCode must remain null after oversized /journey POST");

    // Verify server immediately serves a subsequent valid request after rejecting /journey
    const afterJourneyValidRes = await fetch(`${base}/journey?lang=ta`);
    assert.equal(afterJourneyValidRes.status, 200, "Subsequent valid GET /journey must succeed");

    // Boundary C: POST /personal (8192-byte limit)
    const oversizedPersonalBody = `maths=99&physics=98&chemistry=97&pad=${"c".repeat(9000)}`;
    const personalLargeRes = await fetch(`${base}/personal?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: oversizedPersonalBody,
    });
    assert.equal(personalLargeRes.status, 413, "Oversized /personal POST must return controlled HTTP 413");
    assert.equal(exited, false, "Server process must remain alive after oversized /personal POST");

    const afterPersonalValidRes = await fetch(`${base}/personal?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ maths: "95", physics: "90", chemistry: "91" }).toString(),
    });
    assert.equal(afterPersonalValidRes.status, 200, "Subsequent valid POST /personal must succeed");

    // 4. Privacy Invariant in Application Logs: Zero submitted student values in stdout/stderr
    const combinedLogs = `${stdout}\n${stderr}`;
    for (const sensitive of ["197.75", "191.25", "185.5", "184.0", "MBC", "SCA"]) {
      assert.ok(!combinedLogs.includes(sensitive), `Server logs must never leak sensitive student value: ${sensitive}`);
    }
    assert.ok(!stderr.includes("ExperimentalWarning"), `Server startup must not emit ExperimentalWarning to stderr: ${stderr}`);
  } finally {
    child.kill();
  }
});

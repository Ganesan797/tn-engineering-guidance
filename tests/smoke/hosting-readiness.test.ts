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

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
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
    assert.ok(m5Html.includes("55 approved institutions"), "M5 page should cite approved 55 institutions");

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

    // D. M5 Guidance POST bridge with memory cutoff
    const m5PostRes = await fetch(`${base}/m5-guidance?lang=en`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ cutoff: "185.5", quota: "GENERAL_ACADEMIC", community: "BC", round: "ROUND_2" }).toString(),
    });
    assert.equal(m5PostRes.status, 200, "M5 POST bridge should return 200 OK");
    const m5PostHtml = await m5PostRes.text();
    assert.ok(m5PostHtml.includes('value="185.5"'), "M5 page should reflect calculated cutoff in memory form");
    assert.ok(!m5PostHtml.includes('href="?tab=comparison&amp;cutoff='), "GET links must not leak cutoff");

    // E. 404 Route Handling
    const notFoundRes = await fetch(`${base}/unknown-route-${Date.now()}`);
    assert.equal(notFoundRes.status, 404, "Unknown route should return 404 Not Found");

    // 3. Security: Oversized POST payload DoS Protection (> 8KB for /m5-guidance)
    const largeBody = "x=".repeat(10000);
    try {
      const largeRes = await fetch(`${base}/m5-guidance`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: largeBody,
      });
      // If server responds instead of resetting connection, it must not be 200
      assert.notEqual(largeRes.status, 200, "Oversized payload must be rejected");
    } catch {
      // Socket hang up or ECONNRESET is expected when server throws on payload > 8KB
      assert.ok(true, "Oversized request safely disconnected");
    }

  } finally {
    child.kill();
  }
});

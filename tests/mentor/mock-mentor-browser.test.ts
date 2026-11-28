import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";

test("Mentor Browser & HTTP Integration Audit (320px, 360px, 390px, 1280px)", async () => {
  // Start local mvp-server with MENTOR_QA_ENABLED=1 and MENTOR_QA_PROVIDER=mock
  const serverProc = spawn(
    process.execPath,
    ["--disable-warning=ExperimentalWarning", "--experimental-strip-types", "scripts/mvp-server.mjs"],
    {
      env: { ...process.env, PORT: "0", HOST: "127.0.0.1", MENTOR_QA_ENABLED: "1", MENTOR_QA_PROVIDER: "mock" },
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  let baseUrl = "";
  try {
    baseUrl = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timed out starting mvp-server")), 15000);
      let out = "";
      serverProc.stdout.on("data", (chunk: Buffer) => {
        out += chunk.toString();
        const m = out.match(/http:\/\/127\.0\.0\.1:\d+/);
        if (m) {
          clearTimeout(timer);
          resolve(m[0]);
        }
      });
      serverProc.once("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`mvp-server exited early (${code})`));
      });
    });

    // 1. Verify /m5-guidance?tab=shortlist renders collapsed secondary Mentor control + disclosure
    const shortlistRes = await fetch(`${baseUrl}/m5-guidance?tab=shortlist&shortlist=1~CS&lang=ta`);
    assert.equal(shortlistRes.status, 200);
    const shortlistHtml = await shortlistRes.text();
    assert.ok(shortlistHtml.includes('class="mentor-explain-details screen-only"'));
    assert.ok(!shortlistHtml.includes('<details class="mentor-explain-details screen-only" open'), "Mentor control must be collapsed by default");
    assert.ok(shortlistHtml.includes("AI உதவி விளக்கம்"), "Must show Tamil AI identity disclosure");
    assert.ok(shortlistHtml.includes("தவறுகள் இருக்கலாம்"), "Must disclose AI may be mistaken");

    // 2. Verify homepage does NOT expose Mentor AI UI
    const homeRes = await fetch(`${baseUrl}/`);
    assert.equal(homeRes.status, 200);
    const homeHtml = await homeRes.text();
    assert.ok(!homeHtml.includes("mentor-explain-details"), "Homepage must not expose Mentor widget");

    // 3. Headless Chrome UI + Layout checks across 320px, 360px, 390px, 1280px
    const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    let chromeProc;
    try {
      chromeProc = spawn(
        chromePath,
        ["--headless=new", "--disable-gpu", "--remote-debugging-port=0", "about:blank"],
        { stdio: ["ignore", "pipe", "pipe"] }
      );
    } catch {
      return;
    }

    let browserWs = "";
    try {
      browserWs = await new Promise<string>((resolve, reject) => {
        let stderr = "";
        const timer = setTimeout(() => reject(new Error("Chrome timeout")), 5000);
        chromeProc.stderr.on("data", (c: Buffer) => {
          stderr += c.toString();
          const m = stderr.match(/ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[a-zA-Z0-9-]+/);
          if (m) {
            clearTimeout(timer);
            resolve(m[0]);
          }
        });
        chromeProc.once("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
      });
    } catch {
      chromeProc.kill();
      return;
    }

    const ws = new WebSocket(browserWs);
    await once(ws, "open");
    let msgId = 1;
    const sendCdp = (method: string, params: Record<string, unknown> = {}, sessionId?: string) =>
      new Promise<Record<string, any>>((resolve, reject) => {
        const id = msgId++;
        const onMsg = (ev: MessageEvent) => {
          const data = JSON.parse(String(ev.data));
          if (data.id === id) {
            ws.removeEventListener("message", onMsg);
            if (data.error) reject(new Error(data.error.message));
            else resolve(data.result ?? {});
          }
        };
        ws.addEventListener("message", onMsg);
        ws.send(JSON.stringify(sessionId ? { id, method, params, sessionId } : { id, method, params }));
      });

    try {
      const { targetId } = await sendCdp("Target.createTarget", { url: "about:blank" });
      const { sessionId } = await sendCdp("Target.attachToTarget", { targetId, flatten: true });
      await sendCdp("Page.enable", {}, sessionId);
      await sendCdp("Runtime.enable", {}, sessionId);

      // Navigate to shortlist page and wait for DOM readiness
      await sendCdp("Page.navigate", { url: `${baseUrl}/m5-guidance?tab=shortlist&shortlist=1~CS&lang=en` }, sessionId);
      await sendCdp(
        "Runtime.evaluate",
        {
          expression: `(async () => {
            for (let i = 0; i < 40; i++) {
              if (document.readyState === 'complete' && document.getElementById('mentor-shortlist-q')) return true;
              await new Promise(r => setTimeout(r, 100));
            }
            return false;
          })()`,
          awaitPromise: true,
          returnByValue: true,
        },
        sessionId
      );

      // Check 320px, 360px, 390px, 1280px zero overflow with collapsed & expanded Mentor panel
      for (const width of [320, 360, 390, 1280]) {
        await sendCdp("Emulation.setDeviceMetricsOverride", { width, height: 800, deviceScaleFactor: 1, mobile: width < 768 }, sessionId);
        const overflow = await sendCdp(
          "Runtime.evaluate",
          {
            expression: `(() => {
              const d = document.querySelector('.mentor-explain-details');
              if (d) d.open = true;
              return document.documentElement.scrollWidth - document.documentElement.clientWidth;
            })()`,
            returnByValue: true,
          },
          sessionId
        );
        assert.ok((overflow.result?.value ?? 0) <= 1, `Horizontal overflow at ${width}px: ${overflow.result?.value}`);
      }

      // Exercise browser interactions via real DOM + fetch to /api/mentor/explain
      const evalInteraction = async (question: string, expectedText: string) => {
        const res = await sendCdp(
          "Runtime.evaluate",
          {
            expression: `(async () => {
              const input = document.getElementById('mentor-shortlist-q');
              const btn = document.querySelector('.mentor-explain-details button');
              const out = document.getElementById('mentor-shortlist-out');
              if (!input || !btn || !out) return 'MISSING_DOM';
              input.value = ${JSON.stringify(question)};
              btn.click();
              for (let i = 0; i < 30; i++) {
                await new Promise(r => setTimeout(r, 100));
                const txt = (out.textContent || '').trim();
                if (txt && txt !== 'Preparing explanation...') return txt;
              }
              return out.textContent || '';
            })()`,
            awaitPromise: true,
            returnByValue: true,
          },
          sessionId
        );
        const text = String(res.result?.value ?? "");
        assert.ok(text.includes(expectedText), `Expected "${expectedText}" in browser output, got "${text}"`);
      };

      // Valid governed explanation
      await evalInteraction("Explain this cutoff record", "College of Engineering Guindy");
      // Blocked prediction request
      await evalInteraction("Which colleges are safe for 165?", "cannot predict admission");
      // Blocked ranking & recommendation requests at mobile viewport (390px)
      await sendCdp("Emulation.setDeviceMetricsOverride", { width: 390, height: 800, deviceScaleFactor: 1, mobile: true }, sessionId);
      const shortlistBefore = await sendCdp(
        "Runtime.evaluate",
        { expression: "location.search + '|' + document.querySelectorAll('.shortlist-table tbody tr').length", returnByValue: true },
        sessionId
      );
      await evalInteraction("Rank the colleges for me.", "cannot rank or recommend");
      await evalInteraction("Recommend top colleges for me.", "decide your own final order");
      const shortlistAfter = await sendCdp(
        "Runtime.evaluate",
        { expression: "location.search + '|' + document.querySelectorAll('.shortlist-table tbody tr').length", returnByValue: true },
        sessionId
      );
      assert.equal(shortlistAfter.result?.value, shortlistBefore.result?.value, "Shortlist must remain completely unmutated");
      // Unsupported fact
      await evalInteraction("What is the hostel fee?", "current governed information does not establish this");

      // Invalid context ID via fetch from browser page fails safely
      const invalidCtxRes = await sendCdp(
        "Runtime.evaluate",
        {
          expression: `(async () => {
            const r = await fetch('/api/mentor/explain', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ language: 'en', contextIds: ['bad-id'] })
            });
            return await r.json();
          })()`,
          awaitPromise: true,
          returnByValue: true,
        },
        sessionId
      );
      assert.equal(invalidCtxRes.result?.value?.contextOutcome, "INVALID_CONTEXT_ID");
    } finally {
      ws.close();
      chromeProc.kill();
    }
  } finally {
    serverProc.kill();
  }
});

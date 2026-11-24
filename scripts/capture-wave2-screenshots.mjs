import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 3333;
const ARTIFACT_DIR = "C:\\Users\\Ganesan S\\.gemini\\antigravity\\brain\\cd559834-bfe9-45eb-b3ea-81f3f8adc9df";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  console.log("Starting server on port", PORT);
  const server = spawn("node", ["--disable-warning=ExperimentalWarning", "--experimental-strip-types", "scripts/mvp-server.mjs"], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let serverReadyResolve;
  const serverReady = new Promise((res) => { serverReadyResolve = res; });
  server.stdout.on("data", (d) => {
    const s = d.toString();
    console.log("[server]", s.trim());
    if (s.includes("TN Engineering Guidance MVP") || s.includes("http://")) {
      serverReadyResolve();
    }
  });
  server.stderr.on("data", (d) => console.error("[server err]", d.toString().trim()));

  await Promise.race([
    serverReady,
    new Promise((resolve) => setTimeout(resolve, 4000)),
  ]);

  console.log("Launching Chrome...");
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--remote-debugging-port=0",
    "about:blank",
  ], { stdio: ["ignore", "pipe", "pipe"] });

  let stderr = "";
  const browserWs = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout waiting for Chrome: " + stderr)), 8000);
    chrome.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[a-zA-Z0-9-]+/);
      if (match) {
        clearTimeout(timer);
        resolve(match[0]);
      }
    });
    chrome.once("error", (err) => { clearTimeout(timer); reject(err); });
  });

  console.log("Chrome WS:", browserWs);
  const ws = new WebSocket(browserWs);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

  let msgId = 1;
  function sendCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const { targetId } = await sendCommand("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await sendCommand("Target.attachToTarget", { targetId, flatten: true });

  function sendPageCommand(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener("message", handler);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", handler);
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }

  await sendPageCommand("Page.enable");
  await sendPageCommand("Runtime.enable");

  const targets = [
    // Mobile 360x800
    { name: "wave2_mobile_home_360", url: `http://127.0.0.1:${PORT}/?lang=ta`, width: 360, height: 800 },
    { name: "wave2_mobile_flowchart_360", url: `http://127.0.0.1:${PORT}/journey?step=route&lang=ta`, width: 360, height: 800 },
    { name: "wave2_mobile_study_branches_360", url: `http://127.0.0.1:${PORT}/journey?step=study&lang=ta`, width: 360, height: 800 },
    { name: "wave2_mobile_personal_cutoff_360", url: `http://127.0.0.1:${PORT}/personal?lang=ta`, width: 360, height: 800 },
    { name: "wave2_mobile_colleges_360", url: `http://127.0.0.1:${PORT}/colleges?lang=ta`, width: 360, height: 800 },
    { name: "wave2_mobile_planner_360", url: `http://127.0.0.1:${PORT}/m5-guidance?lang=ta`, width: 360, height: 800 },
    { name: "wave2_mobile_shortlist_360", url: `http://127.0.0.1:${PORT}/m5-guidance?tab=shortlist&lang=ta`, width: 360, height: 800 },

    // Mobile 390x844
    { name: "wave2_mobile_home_390", url: `http://127.0.0.1:${PORT}/?lang=ta`, width: 390, height: 844 },
    { name: "wave2_mobile_flowchart_390", url: `http://127.0.0.1:${PORT}/journey?step=route&lang=ta`, width: 390, height: 844 },
    { name: "wave2_mobile_planner_390", url: `http://127.0.0.1:${PORT}/m5-guidance?lang=ta`, width: 390, height: 844 },

    // Desktop 1280x800
    { name: "wave2_desktop_home_1280", url: `http://127.0.0.1:${PORT}/?lang=ta`, width: 1280, height: 800 },
    { name: "wave2_desktop_flowchart_1280", url: `http://127.0.0.1:${PORT}/journey?step=route&lang=ta`, width: 1280, height: 800 },
    { name: "wave2_desktop_colleges_1280", url: `http://127.0.0.1:${PORT}/colleges?lang=ta`, width: 1280, height: 800 },
    { name: "wave2_desktop_planner_1280", url: `http://127.0.0.1:${PORT}/m5-guidance?lang=ta`, width: 1280, height: 800 },
  ];

  const auditReport = [];

  for (const t of targets) {
    console.log(`Auditing & capturing: ${t.name} (${t.width}x${t.height})`);
    await sendPageCommand("Emulation.setDeviceMetricsOverride", {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 2,
      mobile: t.width < 768,
    });

    await sendPageCommand("Page.navigate", { url: t.url });
    await new Promise((r) => setTimeout(r, 1200));

    // Check horizontal scroll
    const overflowCheck = await sendPageCommand("Runtime.evaluate", {
      expression: `({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasBottomNav: Boolean(document.querySelector('.site-bottom-nav')),
        bottomNavDisplay: window.getComputedStyle(document.querySelector('.site-bottom-nav') || document.body).display,
        hasWayfindingBar: Boolean(document.querySelector('#wayfinding-bar')),
        hasTrustBadge: Boolean(document.querySelector('.civic-trust-badge'))
      })`,
      returnByValue: true,
    });

    console.log("  overflowCheck raw:", JSON.stringify(overflowCheck));
    const info = overflowCheck?.result?.value || { scrollWidth: 0, innerWidth: t.width, bottomNavDisplay: "none" };
    const overflowOk = info.scrollWidth <= info.innerWidth;
    console.log(`  -> scrollWidth: ${info.scrollWidth}, innerWidth: ${info.innerWidth}, noOverflow: ${overflowOk}, bottomNav: ${info.bottomNavDisplay}`);

    auditReport.push({
      target: t.name,
      viewport: `${t.width}x${t.height}`,
      overflowOk,
      info,
    });

    // Capture viewport screenshot
    const shot = await sendPageCommand("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });

    const outPath = join(ARTIFACT_DIR, `${t.name}.png`);
    writeFileSync(outPath, Buffer.from(shot.data, "base64"));
    console.log(`  Saved screenshot: ${outPath}`);

    // If mobile, also capture full-page screenshot for complete visual review
    if (t.width < 768) {
      const fullShot = await sendPageCommand("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
      });
      if (fullShot?.data) {
        const fullOutPath = join(ARTIFACT_DIR, `${t.name}_full.png`);
        writeFileSync(fullOutPath, Buffer.from(fullShot.data, "base64"));
        console.log(`  Saved full-page screenshot: ${fullOutPath}`);
      }
    }
  }

  // Print emulation verification
  console.log("Verifying @media print emulation...");
  await sendPageCommand("Emulation.setEmulatedMedia", { media: "print" });
  await sendPageCommand("Page.navigate", { url: `http://127.0.0.1:${PORT}/m5-guidance?tab=shortlist&lang=ta` });
  await new Promise((r) => setTimeout(r, 1000));
  const printCheck = await sendPageCommand("Runtime.evaluate", {
    expression: `({
      bottomNavDisplay: window.getComputedStyle(document.querySelector('.site-bottom-nav') || document.body).display,
      headerDisplay: window.getComputedStyle(document.querySelector('.site-header') || document.body).display
    })`,
    returnByValue: true,
  });
  console.log("Print mode bottom nav display:", printCheck.result.value.bottomNavDisplay);

  const printShot = await sendPageCommand("Page.captureScreenshot", { format: "png" });
  const printOutPath = join(ARTIFACT_DIR, "wave2_print_shortlist.png");
  writeFileSync(printOutPath, Buffer.from(printShot.data, "base64"));
  console.log("Saved print screenshot:", printOutPath);

  ws.close();
  chrome.kill();
  server.kill();

  console.log("=== FINAL AUDIT REPORT ===");
  console.log(JSON.stringify(auditReport, null, 2));
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});

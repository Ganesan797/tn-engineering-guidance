import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 3334;
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
    // Mobile 390x844
    { name: "wave3_mobile_colleges_landing_390", url: `http://127.0.0.1:${PORT}/colleges?view=colleges&lang=ta`, width: 390, height: 844 },
    { name: "wave3_mobile_colleges_searched_390", url: `http://127.0.0.1:${PORT}/colleges?view=colleges&searched=1&lang=ta`, width: 390, height: 844 },
    { name: "wave3_mobile_colleges_filter_coimbatore_390", url: `http://127.0.0.1:${PORT}/colleges?view=colleges&district=COIMBATORE&lang=ta`, width: 390, height: 844 },
    { name: "wave3_mobile_qa_catalogue_390", url: `http://127.0.0.1:${PORT}/journey/questions?lang=ta`, width: 390, height: 844 },
    { name: "wave3_mobile_qa_single_390", url: `http://127.0.0.1:${PORT}/journey/questions?id=Q030&lang=ta`, width: 390, height: 844 },
    { name: "wave3_mobile_journey_step1_390", url: `http://127.0.0.1:${PORT}/journey?step=awareness&lang=ta`, width: 390, height: 844 },

    // Desktop 1280x800
    { name: "wave3_desktop_colleges_landing_1280", url: `http://127.0.0.1:${PORT}/colleges?lang=ta`, width: 1280, height: 800 },
    { name: "wave3_desktop_colleges_searched_1280", url: `http://127.0.0.1:${PORT}/colleges?view=colleges&searched=1&lang=ta`, width: 1280, height: 800 },
    { name: "wave3_desktop_colleges_filtered_1280", url: `http://127.0.0.1:${PORT}/colleges?view=colleges&q=CEG&lang=ta`, width: 1280, height: 800 },
    { name: "wave3_desktop_journey_route_1280", url: `http://127.0.0.1:${PORT}/journey?step=route&lang=ta`, width: 1280, height: 800 },
    { name: "wave3_desktop_qa_catalogue_1280", url: `http://127.0.0.1:${PORT}/journey/questions?lang=ta`, width: 1280, height: 800 },
    { name: "wave3_desktop_qa_single_1280", url: `http://127.0.0.1:${PORT}/journey/questions?id=Q030&lang=ta`, width: 1280, height: 800 },
  ];

  for (const t of targets) {
    console.log(`Capturing: ${t.name} (${t.width}x${t.height})`);
    await sendPageCommand("Emulation.setDeviceMetricsOverride", {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 2,
      mobile: t.width < 768,
    });

    await sendPageCommand("Page.navigate", { url: t.url });
    await new Promise((r) => setTimeout(r, 1200));

    // Viewport screenshot
    const shot = await sendPageCommand("Page.captureScreenshot", { format: "png" });
    const shotPath = join(ARTIFACT_DIR, `${t.name}.png`);
    writeFileSync(shotPath, Buffer.from(shot.data, "base64"));
    console.log(`  Saved viewport: ${shotPath}`);

    // Full page screenshot
    const fullShot = await sendPageCommand("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    const fullPath = join(ARTIFACT_DIR, `${t.name}_full.png`);
    writeFileSync(fullPath, Buffer.from(fullShot.data, "base64"));
    console.log(`  Saved full page: ${fullPath}`);
  }

  // Cleanup
  chrome.kill();
  server.kill();
  console.log("All wave 3 screenshots captured successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const evidenceDir = join(root, "review-evidence", "m4-acceptance-reconciliation", "browser");
mkdirSync(evidenceDir, { recursive: true });

const chrome = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find(existsSync);
if (!chrome) throw new Error("No supported Chromium browser executable found");

const port = 34132;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["--experimental-strip-types", "scripts/mvp-server.mjs"], {
  cwd: root,
  env: { ...process.env, M4_OWNER_REVIEW: "1", PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});
const profile = mkdtempSync(join(tmpdir(), "m4-browser-"));
const debugPort = 34133;
const browser = spawn(chrome, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

const waitFor = async (fn, label, timeout = 15000) => {
  const deadline = Date.now() + timeout;
  let last;
  while (Date.now() < deadline) {
    try { const value = await fn(); if (value) return value; } catch (error) { last = error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`${label} timed out${last ? `: ${last.message}` : ""}`);
};

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
    this.ws.addEventListener("message", event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
      } else {
        const listeners = this.events.get(message.method) ?? [];
        this.events.delete(message.method);
        for (const resolve of listeners) resolve(message.params);
      }
    });
  }
  async open() { await new Promise((resolve, reject) => { this.ws.addEventListener("open", resolve, { once: true }); this.ws.addEventListener("error", reject, { once: true }); }); }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  event(method) { return new Promise(resolve => this.events.set(method, [...(this.events.get(method) ?? []), resolve])); }
  close() { this.ws.close(); }
}

const navigate = async (cdp, url) => {
  const loaded = cdp.event("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await loaded;
};
const evaluate = async (cdp, expression) => {
  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};
const clickAndWait = async (cdp, selector) => {
  const loaded = cdp.event("Page.loadEventFired");
  const found = await evaluate(cdp, `(() => { const el=document.querySelector(${JSON.stringify(selector)}); if(!el)return false; el.click(); return true; })()`);
  if (!found) throw new Error(`Missing clickable selector: ${selector}`);
  await loaded;
};
const submitAndWait = async (cdp, expression) => {
  const loaded = cdp.event("Page.loadEventFired");
  const submitted = await evaluate(cdp, expression);
  if (!submitted) throw new Error("Form submission target unavailable");
  await loaded;
};
const snapshot = async (cdp, name) => {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(join(evidenceDir, `${name}.png`), Buffer.from(data, "base64"));
  const state = await evaluate(cdp, `({url:location.href,lang:document.documentElement.lang,title:document.title,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()),width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth})`);
  if (state.overflow) throw new Error(`Horizontal overflow in ${name}: ${JSON.stringify(state)}`);
  return state;
};

const results = [];
try {
  await waitFor(async () => (await fetch(`${base}/internal/m4-pilot?lang=en&view=home`)).ok, "MVP server");
  const target = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" });
    return response.ok ? response.json() : null;
  }, "Chromium debugging target");
  const cdp = new Cdp(target.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const browserVersion = await cdp.send("Browser.getVersion");
  await waitFor(() => fetch(`${base}/internal/m4-pilot?lang=en&view=home`).then(response => response.ok), "M4 review server");

  for (const viewport of [{ name: "360x800", width: 360, height: 800 }, { name: "390x800", width: 390, height: 800 }, { name: "desktop-1280x900", width: 1280, height: 900 }]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.width < 600 });
    for (const lang of ["ta", "en"]) {
      const prefix = `${lang}-${viewport.name}`;
      await navigate(cdp, `${base}/internal/m4-pilot?lang=${lang}&view=home`);
      const home = await snapshot(cdp, `${prefix}-home`);
      const homeChecks = await evaluate(cdp, `({ownerReview:document.body.innerText.includes(${JSON.stringify(lang === "ta" ? "உள்நிலை உரிமையாளர் ஆய்வு மட்டும்" : "Internal owner review only")}),guidance:[...document.links].some(a=>a.href.includes('/beginner?')&&a.href.includes('section=engineering')),collegeFirst:[...document.links].some(a=>a.href.includes('view=colleges'))})`);
      if (!Object.values(homeChecks).every(Boolean)) throw new Error(`Home checks failed: ${JSON.stringify(homeChecks)}`);

      await clickAndWait(cdp, 'a[href*="/beginner?"][href*="section=engineering"]');
      const guidance = await snapshot(cdp, `${prefix}-guidance`);
      if (!(await evaluate(cdp, `[...document.links].some(a=>a.href.includes('/internal/m4-pilot')&&a.href.includes('view=branches'))`))) throw new Error("Guidance-to-programme bridge unavailable");
      await clickAndWait(cdp, 'a[href*="/internal/m4-pilot"][href*="view=branches"]');
      await submitAndWait(cdp, `(() => { const input=document.querySelector('#branch-search'); const form=document.querySelector('.branch-search'); if(!input||!form)return false; input.value='CS'; form.requestSubmit(); return true; })()`);
      await clickAndWait(cdp, 'a[href*="view=branch"][href*="branch=CS"]');
      const explanation = await snapshot(cdp, `${prefix}-explanation`);
      const explanationChecks = await evaluate(cdp, `({approved:document.body.innerText.includes(${JSON.stringify(lang === "ta" ? "பொதுவான கல்வி விளக்கம்" : "general educational explanation")}),source:[...document.links].some(a=>a.href.includes('annauniv.edu'))})`);
      if (!Object.values(explanationChecks).every(Boolean)) throw new Error(`Explanation checks failed: ${JSON.stringify(explanationChecks)}`);

      await clickAndWait(cdp, 'a[href*="view=colleges"][href*="branch=CS"]');
      await submitAndWait(cdp, `(() => { const input=document.querySelector('#college-search'); const district=document.querySelector('#district-filter'); const type=document.querySelector('#type-filter'); const form=document.querySelector('.filters'); if(!input||!district||!type||!form)return false; input.value='CEG'; district.value='CHENNAI'; type.value='UNIVERSITY'; form.requestSubmit(); return true; })()`);
      const filtered = await snapshot(cdp, `${prefix}-colleges-filtered`);
      if (!(await evaluate(cdp, `document.body.innerText.includes('CEG Campus') && new URL(location.href).searchParams.get('district')==='CHENNAI' && new URL(location.href).searchParams.get('type')==='UNIVERSITY'`))) throw new Error("College search/filter did not retain the expected result");

      await clickAndWait(cdp, 'a[href*="view=college"][href*="college=1"]');
      await snapshot(cdp, `${prefix}-college`);
      await clickAndWait(cdp, 'a[href*="view=detail"][href*="programme=CS"]');
      const detail = await snapshot(cdp, `${prefix}-detail`);
      const beforeSwitch = await evaluate(cdp, `({college:document.body.innerText.includes('CEG Campus'),programme:new URL(location.href).searchParams.get('programme')==='CS',url:location.href})`);
      if (!beforeSwitch.college || !beforeSwitch.programme) throw new Error(`Detail checks failed: ${JSON.stringify(beforeSwitch)}`);
      const switchSelector = lang === "ta" ? 'a[lang="en"]' : 'a[lang="ta"]';
      await clickAndWait(cdp, switchSelector);
      const retained = await evaluate(cdp, `({lang:document.documentElement.lang,view:new URL(location.href).searchParams.get('view'),college:new URL(location.href).searchParams.get('college'),programme:new URL(location.href).searchParams.get('programme')})`);
      if (retained.lang === lang || retained.view !== "detail" || retained.college !== "1" || retained.programme !== "CS") throw new Error(`Language switch lost detail state: ${JSON.stringify(retained)}`);

      await navigate(cdp, `${base}/internal/m4-pilot?lang=${lang}&view=colleges&pick=1%7ECS&pick=4%7ECS`);
      await clickAndWait(cdp, lang === "ta" ? 'a[lang="en"]' : 'a[lang="ta"]');
      const switchedPicks = await evaluate(cdp, `({lang:document.documentElement.lang,picks:new URL(location.href).searchParams.getAll('pick')})`);
      if (switchedPicks.lang === lang || switchedPicks.picks.length !== 2 || !switchedPicks.picks.includes('1~CS') || !switchedPicks.picks.includes('4~CS')) throw new Error(`Language switch lost comparison selections: ${JSON.stringify(switchedPicks)}`);
      await clickAndWait(cdp, lang === "ta" ? 'a[lang="ta"]' : 'a[lang="en"]');
      await clickAndWait(cdp, 'a[href*="view=compare"]');
      const comparison = await snapshot(cdp, `${prefix}-comparison`);
      const comparisonChecks = await evaluate(cdp, `({two:document.querySelectorAll('.compare-field').length===2,notRanking:document.body.innerText.includes(${JSON.stringify(lang === "ta" ? "இது தரவரிசை அல்ல" : "This is not a ranking")})})`);
      if (!Object.values(comparisonChecks).every(Boolean)) throw new Error(`Comparison checks failed: ${JSON.stringify(comparisonChecks)}`);

      await navigate(cdp, `${base}/internal/m4-pilot?lang=${lang}&view=colleges&q=not-a-real-college-9999`);
      const recovery = await snapshot(cdp, `${prefix}-recovery`);
      if (!(await evaluate(cdp, `Boolean(document.querySelector('[role="status"]'))`))) throw new Error("Recovery state is missing");

      await navigate(cdp, `${base}/internal/m4-pilot?lang=${lang}&view=home`);
      await clickAndWait(cdp, 'a[href*="view=colleges"]:not([href*="branch="])');
      const collegeFirst = await snapshot(cdp, `${prefix}-college-first`);
      if (!(await evaluate(cdp, `Boolean(document.querySelector('#college-search'))`))) throw new Error("College-first search unavailable");

      results.push({ viewport, lang, home, guidance, explanation, filtered, detail, comparison, recovery, collegeFirst, stateRetention: retained, comparisonSelectionRetention: switchedPicks });
    }
  }
  cdp.close();
  writeFileSync(join(evidenceDir, "results.json"), JSON.stringify({ browser: chrome, browserVersion, implementation: process.env.GIT_COMMIT ?? "working-tree candidate", checks: results.length, results }, null, 2) + "\n");
  console.log(JSON.stringify({ browser: chrome, product: browserVersion.product, revision: browserVersion.revision, browserEngine: "Chromium", genuineBrowserChecks: true, matrix: "2 languages x 3 actual viewports", flows: results.length, screenshots: results.length * 9, allPassed: true }, null, 2));
} finally {
  browser.kill();
  server.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

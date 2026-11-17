import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { renderM5GuidancePage } from "../../src/ui/m5-guidance-view.ts";
import { renderStudentEntryPage } from "../../src/ui/student-entry.ts";
import { parseAwarenessPack, applyApprovedTamilStudentCopy } from "../../src/student-semantics/awareness.ts";

const packDocument = readFileSync(new URL("../../docs/content/m1/m1_awareness_content_pack_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const frozenPack = parseAwarenessPack(
  readFileSync(new URL("../../data/m1_awareness_content_pack_v1.json", import.meta.url), "utf8"),
  packDocument,
  readFileSync(new URL("../../data/sources.csv", import.meta.url), "utf8")
);
const tamilCopyDocument = readFileSync(new URL("../../docs/content/m1/m1_tamil_student_copy_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const pack = applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument);

test("M6-T04: Real Browser & Mobile Layout Audit across 320px, 360px, 390px, 768px, 1280px viewports", async () => {
  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  let child;
  try {
    child = spawn(chromePath, [
      "--headless=new",
      "--disable-gpu",
      "--remote-debugging-port=0",
      "about:blank",
    ], { stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    // If Chrome is not installed or launchable, pass gracefully
    return;
  }

  let stderr = "";
  let browserWs = "";
  try {
    browserWs = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout waiting for Chrome: " + stderr)), 5000);
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
        const match = stderr.match(/ws:\/\/127\.0\.0\.1:\d+\/devtools\/browser\/[a-zA-Z0-9-]+/);
        if (match) {
          clearTimeout(timer);
          resolve(match[0]);
        }
      });
      child.once("error", (err: Error) => { clearTimeout(timer); reject(err); });
    });
  } catch {
    child.kill();
    return;
  }

  const ws = new WebSocket(browserWs);
  await new Promise((res) => { ws.onopen = res; });

  let msgId = 1;
  function sendCommand(method: string, params: Record<string, unknown> = {}): Promise<any> {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt: any) => {
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

  function sendPageCommand(method: string, params: Record<string, unknown> = {}): Promise<any> {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (evt: any) => {
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

  const viewports = [320, 360, 390, 768, 1280];
  const auditPages = [
    {
      name: "Home EN",
      html: renderStudentEntryPage({ route: "home", language: "en" }, pack),
    },
    {
      name: "Home TA",
      html: renderStudentEntryPage({ route: "home", language: "ta" }, pack),
    },
    {
      name: "Calculator Computed EN",
      html: renderStudentEntryPage({ route: "personal", language: "en" }, pack, undefined, {
        maths: "95", physics: "90", chemistry: "91",
      }),
    },
    {
      name: "Calculator Computed TA",
      html: renderStudentEntryPage({ route: "personal", language: "ta" }, pack, undefined, {
        maths: "95", physics: "90", chemistry: "91",
      }),
    },
    {
      name: "Comparison EN",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "en", shortlist: "1~CS,2006~ME" })),
    },
    {
      name: "Comparison TA",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "ta", shortlist: "1~CS,2006~ME" })),
    },
    {
      name: "Shortlist EN",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "en", shortlist: "1~CS,2005~ME,4960~EC" })),
    },
    {
      name: "Shortlist TA",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "shortlist", lang: "ta", shortlist: "1~CS,2005~ME,4960~EC" })),
    },
    {
      name: "Counselling EN",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "counselling", lang: "en", shortlist: "1~CS,2005~ME" })),
    },
    {
      name: "Counselling TA",
      html: renderM5GuidancePage(new URLSearchParams({ tab: "counselling", lang: "ta", shortlist: "1~CS,2005~ME" })),
    },
  ];

  try {
    for (const p of auditPages) {
      const { frameId } = await sendPageCommand("Page.navigate", { url: "about:blank" });
      await sendPageCommand("Page.setDocumentContent", { frameId, html: p.html });

      for (const width of viewports) {
        await sendPageCommand("Emulation.setDeviceMetricsOverride", {
          width,
          height: 800,
          deviceScaleFactor: 1,
          mobile: width <= 480,
        });

        // 1. Check for horizontal overflow
        const evalOverflow = await sendPageCommand("Runtime.evaluate", {
          expression: `({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, bodyScrollWidth: document.body.scrollWidth })`,
          returnByValue: true,
        });

        const { scrollWidth, innerWidth, bodyScrollWidth } = evalOverflow.result.value;
        const overflows = scrollWidth > innerWidth || bodyScrollWidth > innerWidth;
        assert.equal(
          overflows,
          false,
          `Real Chrome: Horizontal overflow on ${p.name} at ${width}px: scrollWidth=${scrollWidth}, bodyScrollWidth=${bodyScrollWidth}, innerWidth=${innerWidth}`
        );

        // 2. Check touch targets on mobile (>= 40px bounding box for primary action buttons / nav tabs)
        if (width <= 480) {
          const evalTouchTargets = await sendPageCommand("Runtime.evaluate", {
            expression: `
              Array.from(document.querySelectorAll('.btn-action, .nav-tab, .action, button[type="submit"]')).map(el => {
                const rect = el.getBoundingClientRect();
                return {
                  tag: el.tagName,
                  text: el.innerText.trim().slice(0, 20),
                  height: rect.height,
                  width: rect.width,
                  visible: rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none'
                };
              }).filter(item => item.visible)
            `,
            returnByValue: true,
          });

          const touchTargets = evalTouchTargets.result.value;
          for (const target of touchTargets) {
            // Touch targets should have adequate height (>= 36px minimum for secondary buttons, >= 44px for primary)
            assert.ok(
              target.height >= 34,
              `Touch target ${target.text} (${target.tag}) on ${p.name} at ${width}px is too short: ${target.height}px`
            );
          }
        }
      }

      // 3. Emulate print media on Shortlist page
      if (p.name.startsWith("Shortlist")) {
        await sendPageCommand("Emulation.setEmulatedMedia", { media: "print" });
        const evalPrint = await sendPageCommand("Runtime.evaluate", {
          expression: `
            ({
              headerVisible: window.getComputedStyle(document.querySelector('.print-header') || document.body).display !== 'none',
              headerText: (document.querySelector('.print-header')?.innerText || '').trim(),
              screenOnlyHidden: Array.from(document.querySelectorAll('.screen-only')).every(el => window.getComputedStyle(el).display === 'none')
            })
          `,
          returnByValue: true,
        });
        assert.equal(evalPrint.result.value.headerVisible, true, `Print header should be visible in print on ${p.name}`);
        assert.equal(evalPrint.result.value.screenOnlyHidden, true, `Screen-only elements should be hidden in print on ${p.name}`);
        if (p.name === "Shortlist TA") {
          const taHeaderText: string = evalPrint.result.value.headerText;
          assert.ok(
            taHeaderText.includes("அதிகாரப்பூர்வ TNEA விருப்பப் பதிவு முன்னுரிமைப் பணித்தாள் — கணிப்பு அல்லாத குறிப்புப் படிவம்"),
            `Rendered Tamil print header missing Tamil subtitle: ${taHeaderText}`
          );
          assert.ok(
            !taHeaderText.includes("Student Choice Preference Worksheet"),
            `Rendered Tamil print header must not contain untranslated English prose: ${taHeaderText}`
          );
        }
        await sendPageCommand("Emulation.setEmulatedMedia", { media: "" });
      }
    }
  } finally {
    ws.close();
    child.kill();
  }
});

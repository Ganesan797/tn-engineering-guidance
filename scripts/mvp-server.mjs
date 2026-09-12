import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { createPilotRuntime } from "../src/application/pilot-runtime.ts";
import { DEMO_SCENARIO_NAMES, demoScenario } from "../src/demo/scenarios.ts";
import {
  guidanceRequestFromFormValues,
  renderStudentGuidancePage,
  submitStudentGuidanceForm,
} from "../src/ui/student-guidance.ts";
import { entryStateFromUrl } from "../src/student-entry/routing.ts";
import { renderStudentEntryPage, renderReferenceGuidancePage } from "../src/ui/student-entry.ts";
import { blankReferenceRequest } from "../src/ui/reference-request.ts";
import { parseAwarenessPack, applyApprovedTamilStudentCopy } from "../src/student-semantics/awareness.ts";

const root = new URL("../", import.meta.url);
const awareness = applyApprovedTamilStudentCopy(parseAwarenessPack(
  readFileSync(new URL("data/m1_awareness_content_pack_v1.json", root), "utf8"),
  readFileSync(new URL("docs/m1_awareness_content_pack_v1.md", root), "utf8"),
  readFileSync(new URL("data/sources.csv", root), "utf8"),
), readFileSync(new URL("docs/m1_tamil_student_copy_v1.md", root), "utf8"));
const runtime = createPilotRuntime({
  sources_csv: readFileSync(new URL("data/sources.csv", root), "utf8"),
  colleges_csv: readFileSync(new URL("data/colleges.csv", root), "utf8"),
  programmes_csv: readFileSync(new URL("data/programmes.csv", root), "utf8"),
});

function scenarioName(url) {
  const value = url.searchParams.get("scenario") ?? "eligible";
  return DEMO_SCENARIO_NAMES.includes(value) ? value : "eligible";
}

function withDemoNavigation(page) {
  const links = DEMO_SCENARIO_NAMES.map(
    (name) => `<a href="/demo?scenario=${name}">${name.replaceAll("-", " ")}</a>`,
  ).join(" · ");
  return page.replace(
    "<h1>TN Engineering Guidance</h1>",
    `<h1>TN Engineering Guidance</h1><p><strong>DEVELOPMENT DEMO — synthetic student profiles, not real student information.</strong></p><nav aria-label="Demo scenarios"><strong>Reproducible scenarios:</strong> ${links}</nav><p><a href="/">Return to student entry</a></p>`,
  ).replace('action="/guidance"', 'action="/demo/guidance"');
}

function send(response, status, html) {
  response.writeHead(status, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const language = url.searchParams.get("lang") === "en" ? "en" : "ta";
  const entry = entryStateFromUrl(url);
  if (request.method === "GET" && entry !== null) {
    send(response, 200, renderStudentEntryPage(entry, awareness, undefined, {
      section: url.searchParams.get("section") ?? undefined,
      review: url.searchParams.get("review") === "1",
    }));
    return;
  }
  if (request.method === "GET" && url.pathname === "/personal/reference") {
    const snapshot = runtime.snapshots.snapshots()[0];
    const form = blankReferenceRequest({ snapshot_id: snapshot.snapshot_id, snapshot_stage: snapshot.stage });
    send(response, 200, renderReferenceGuidancePage({ form, response: null }, language));
    return;
  }
  if (request.method === "GET" && url.pathname === "/demo") {
    const form = demoScenario(scenarioName(url));
    send(response, 200, withDemoNavigation(renderStudentGuidancePage({ form, response: null })));
    return;
  }
  if (request.method === "POST" && (url.pathname === "/guidance" || url.pathname === "/demo/guidance")) {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const values = Object.fromEntries(new URLSearchParams(Buffer.concat(chunks).toString("utf8")));
    const snapshot = runtime.snapshots.snapshots()[0];
    const template = blankReferenceRequest({ snapshot_id: snapshot.snapshot_id, snapshot_stage: snapshot.stage });
    const form = guidanceRequestFromFormValues(values, template);
    const state = submitStudentGuidanceForm(form, runtime);
    send(response, 200, url.pathname === "/demo/guidance"
      ? withDemoNavigation(renderStudentGuidancePage(state))
      : renderReferenceGuidancePage(state, language));
    return;
  }
  send(response, 404, "<!doctype html><title>Not found</title><h1>Not found</h1>");
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, "127.0.0.1", () => {
  const programmes = runtime.registry.programmes();
  console.log(`TN Engineering Guidance MVP: http://127.0.0.1:${server.address().port}`);
  console.log(`Loaded ${runtime.registry.colleges().length} colleges, ${programmes.length} programmes, ${programmes.filter(({ branch_id }) => branch_id !== null).length} canonical mappings.`);
  console.log("Seat snapshot contains no published vacancy facts; vacancy remains UNKNOWN_OR_UNPUBLISHED.");
});

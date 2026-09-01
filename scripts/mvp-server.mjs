import { createServer } from "node:http";
import { readFileSync } from "node:fs";

import { createPilotRuntime } from "../src/application/pilot-runtime.ts";
import { DEMO_SCENARIO_NAMES, demoScenario } from "../src/demo/scenarios.ts";
import {
  guidanceRequestFromFormValues,
  renderStudentGuidancePage,
  submitStudentGuidanceForm,
} from "../src/ui/student-guidance.ts";

const root = new URL("../", import.meta.url);
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
    (name) => `<a href="/?scenario=${name}">${name.replaceAll("-", " ")}</a>`,
  ).join(" · ");
  return page.replace(
    "<h1>TN Engineering Guidance</h1>",
    `<h1>TN Engineering Guidance</h1><nav aria-label="Demo scenarios"><strong>Reproducible scenarios:</strong> ${links}</nav>`,
  );
}

function send(response, status, html) {
  response.writeHead(status, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  if (request.method === "GET" && url.pathname === "/") {
    const form = demoScenario(scenarioName(url));
    send(response, 200, withDemoNavigation(renderStudentGuidancePage({ form, response: null })));
    return;
  }
  if (request.method === "POST" && url.pathname === "/guidance") {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const values = Object.fromEntries(new URLSearchParams(Buffer.concat(chunks).toString("utf8")));
    const template = demoScenario("needs-review");
    const form = guidanceRequestFromFormValues(values, template);
    const state = submitStudentGuidanceForm(form, runtime);
    send(response, 200, withDemoNavigation(renderStudentGuidancePage(state)));
    return;
  }
  send(response, 404, "<!doctype html><title>Not found</title><h1>Not found</h1>");
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, "127.0.0.1", () => {
  const programmes = runtime.registry.programmes();
  console.log(`TN Engineering Guidance MVP: http://127.0.0.1:${port}`);
  console.log(`Loaded ${runtime.registry.colleges().length} colleges, ${programmes.length} programmes, ${programmes.filter(({ branch_id }) => branch_id !== null).length} canonical mappings.`);
  console.log("Seat snapshot contains no published vacancy facts; vacancy remains UNKNOWN_OR_UNPUBLISHED.");
});

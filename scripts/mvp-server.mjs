import { createServer } from "node:http";
import { readFileSync } from "node:fs";

// Suppress Node's ExperimentalWarning for Type Stripping when launched directly via --experimental-strip-types
const originalEmitWarning = process.emitWarning.bind(process);
process.emitWarning = (warning, ...args) => {
  const type = typeof args[0] === "string" ? args[0] : (args[0]?.type ?? warning?.name);
  if (type === "ExperimentalWarning" || String(warning).includes("Type Stripping is an experimental feature")) {
    return;
  }
  return originalEmitWarning(warning, ...args);
};

const { renderGovernedPilot } = await import("../src/ui/m4-governed-pilot.ts");
const { renderM4Exploration } = await import("../src/ui/m4-exploration.ts");
const { renderM5GuidancePage } = await import("../src/ui/m5-guidance-view.ts");
const { CHECK_COPY } = await import("../src/ui/journey-copy.ts");
const { loadApprovedDirectory } = await import("../src/m4/approved-directory-preview.mjs");

const { createPilotRuntime } = await import("../src/application/pilot-runtime.ts");
const { DEMO_SCENARIO_NAMES, demoScenario } = await import("../src/demo/scenarios.ts");
const {
  guidanceRequestFromFormValues,
  renderStudentGuidancePage,
  submitStudentGuidanceForm,
} = await import("../src/ui/student-guidance.ts");
const { entryStateFromUrl } = await import("../src/student-entry/routing.ts");
const { renderStudentEntryPage, renderReferenceGuidancePage } = await import("../src/ui/student-entry.ts");
const { blankReferenceRequest } = await import("../src/ui/reference-request.ts");
const { parseAwarenessPack, applyApprovedTamilStudentCopy } = await import("../src/student-semantics/awareness.ts");
const { answerJourneyQuestion, editJourneyAnswer, EMPTY_JOURNEY, nextJourneyQuestion, parseJourneyState, retryUnknown } = await import("../src/m2/journey.ts");
const { parsePresentationSources } = await import("../src/student-semantics/provenance.ts");
const { renderM2Journey } = await import("../src/ui/m2-journey.ts");
const { loadQuestionCollection, renderQuestionCollection } = await import("../src/ui/explore-questions.ts");

const root = new URL("../", import.meta.url);
const pkgJson = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));

function resolveDeployedGitCommit() {
  const envCommit =
    process.env.RENDER_GIT_COMMIT ||
    process.env.GIT_COMMIT ||
    process.env.COMMIT_SHA ||
    process.env.SOURCE_VERSION;
  if (envCommit && /^[0-9a-f]{7,40}$/i.test(envCommit.trim())) {
    return { sha: envCommit.trim(), source: process.env.RENDER_GIT_COMMIT ? "RENDER_GIT_COMMIT" : "ENV_GIT_COMMIT" };
  }
  try {
    const headRaw = readFileSync(new URL(".git/HEAD", root), "utf8").trim();
    if (/^[0-9a-f]{40}$/i.test(headRaw)) {
      return { sha: headRaw, source: "GIT_HEAD_DETACHED" };
    }
    const refMatch = headRaw.match(/^ref:\s*(.+)$/);
    if (refMatch) {
      const refPath = refMatch[1].trim();
      try {
        const refSha = readFileSync(new URL(`.git/${refPath}`, root), "utf8").trim();
        if (/^[0-9a-f]{40}$/i.test(refSha)) {
          return { sha: refSha, source: "GIT_REF_HEAD" };
        }
      } catch {
        const packed = readFileSync(new URL(".git/packed-refs", root), "utf8");
        for (const line of packed.split(/\r?\n/)) {
          if (!line || line.startsWith("#") || line.startsWith("^")) continue;
          const [sha, ref] = line.trim().split(/\s+/);
          if (ref === refPath && /^[0-9a-f]{40}$/i.test(sha)) {
            return { sha, source: "GIT_PACKED_REF" };
          }
        }
      }
    }
  } catch {
    // Fallback below if .git directory is absent
  }
  return { sha: "UNKNOWN", source: "UNAVAILABLE" };
}
// Explicitly enabled local review only; invalid approval bytes fail closed.
const publicDirectory = loadApprovedDirectory();
const ownerDirectory = process.env.M4_OWNER_REVIEW === "1" ? publicDirectory : null;
const awareness = applyApprovedTamilStudentCopy(parseAwarenessPack(
  readFileSync(new URL("data/m1_awareness_content_pack_v1.json", root), "utf8"),
  readFileSync(new URL("docs/content/m1/m1_awareness_content_pack_v1.md", root), "utf8"),
  readFileSync(new URL("data/sources.csv", root), "utf8"),
), readFileSync(new URL("docs/content/m1/m1_tamil_student_copy_v1.md", root), "utf8"));
const presentation = { sources: parsePresentationSources(readFileSync(new URL("data/sources.csv", root), "utf8")) };
// General guidance remains empty until a reviewed selection is explicitly configured.
const runtime = createPilotRuntime({
  sources_csv: readFileSync(new URL("data/sources.csv", root), "utf8"),
  colleges_csv: readFileSync(new URL("data/colleges.csv", root), "utf8"),
  programmes_csv: readFileSync(new URL("data/programmes.csv", root), "utf8"),
});
const reviewedAdmissionBatch = readFileSync(new URL("docs/content/admission/student_pov_admission_batch_int05_int08_v1.md", root), "utf8");
const reviewedAwarenessBatch = readFileSync(new URL("docs/content/awareness/student_pov_awareness_batch_a01_a07_v2.md", root), "utf8");
const questions = loadQuestionCollection(reviewedAwarenessBatch, reviewedAdmissionBatch,
  readFileSync(new URL("docs/content/admission/student_pov_admission_coverage_int05_int08_v1.md", root), "utf8"),
  readFileSync(new URL("docs/content/awareness/student_pov_awareness_evidence_v2.md", root), "utf8"),
  readFileSync(new URL("docs/content/admission/student_pov_admission_evidence_int05_int08_v1.md", root), "utf8"),
  readFileSync(new URL("data/m2_question_answers_v1.json", root), "utf8"));

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

class PayloadTooLargeError extends Error {
  constructor() {
    super("Request is too large");
    this.name = "PayloadTooLargeError";
  }
}

const MAX_DRAIN_OVERAGE_BYTES = 65536;

function readBoundedBody(request, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let exceeded = false;
    let settled = false;

    const finishReject = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    const finishResolve = (text) => {
      if (settled) return;
      settled = true;
      resolve(text);
    };

    request.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        if (!exceeded) {
          exceeded = true;
          chunks.length = 0;
        }
        if (total > maxBytes + MAX_DRAIN_OVERAGE_BYTES) {
          request.pause();
          finishReject(new PayloadTooLargeError());
        }
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      if (exceeded) {
        finishReject(new PayloadTooLargeError());
        return;
      }
      finishResolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", (err) => finishReject(err));
  });
}

function send(response, status, html, extraHeaders = {}) {
  if (response.headersSent) return;
  response.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "x-robots-tag": "noindex, nofollow",
    ...extraHeaders,
  });
  response.end(html);
}

function sendPayloadTooLarge(response, language) {
  const isEn = language === "en";
  const title = isEn ? "Request Too Large" : "கோரிக்கை அளவு அதிகமாக உள்ளது";
  const body = isEn
    ? "The submitted request exceeds the allowed size limit. Please return and submit standard form values."
    : "சமர்ப்பிக்கப்பட்ட கோரிக்கை அனுமதிக்கப்பட்ட அளவை விட அதிகமாக உள்ளது. தயவுசெய்து மீண்டும் சென்று சாதாரண படிவத் தகவல்களை மட்டும் சமர்ப்பிக்கவும்.";
  const backLabel = isEn ? "Return to Home" : "முகப்புப் பக்கத்திற்குத் திரும்பு";
  const backHref = isEn ? "/?lang=en" : "/";
  send(
    response,
    413,
    `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body><main><h1>${title}</h1><p>${body}</p><p><a href="${backHref}">${backLabel}</a></p></main></body></html>`,
    { connection: "close" },
  );
}

const server = createServer(async (request, response) => {
  let language = "ta";
  try {
  const url = new URL(request.url ?? "/", "http://localhost");
  language = url.searchParams.get("lang") === "en" ? "en" : "ta";
  const entry = entryStateFromUrl(url);
  if (request.method === "GET" && url.pathname === "/api/version") {
    const resolved = resolveDeployedGitCommit();
    const payload = JSON.stringify({
      version: pkgJson.version || "0.1.0",
      commit: resolved.sha,
      commitSource: resolved.source,
      environment: process.env.RENDER ? "production" : (process.env.NODE_ENV || "local"),
      mode: "FINAL_PRE_M7_SIMULATED_AUDIT_CORRECTIONS",
    });
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "x-robots-tag": "noindex, nofollow",
    });
    response.end(payload);
    return;
  }
  if (request.method === "GET" && url.pathname === "/assets/tnea-hero.jpg") {
    const assetPath = new URL("data/assets/tnea-hero.jpg", root);
    try {
      const data = readFileSync(assetPath);
      response.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": data.byteLength,
        "Cache-Control": "public, max-age=604800, immutable",
      });
      response.end(data);
      return;
    } catch {
      send(response, 404, "<!doctype html><title>Not found</title><h1>Image not found</h1>");
      return;
    }
  }
  if (request.method === "GET" && url.pathname === "/journey/questions") {
    const page = renderQuestionCollection(questions, url.searchParams.get("id"), url.searchParams.get("evidence"), language, url.searchParams.get("topic"), url.searchParams.get("review") === "1");
    send(response, page.status, page.html);
    return;
  }
  // Milestone M5 Internal Review Preview (Isolated from public /colleges route)
  if (url.pathname === "/m5-guidance") {
    if (request.method === "POST") {
      const body = await readBoundedBody(request, 8192);
      const values = new URLSearchParams(body);
      const rawCutoff = values.get("cutoff");
      const studentCutoff = rawCutoff !== null && rawCutoff.trim() !== "" ? Number(rawCutoff) : null;
      const quota = values.get("quota") === "GOVT_SCHOOL_7_5" ? "GOVT_SCHOOL_7_5" : "GENERAL_ACADEMIC";
      const rawCommunity = values.get("community");
      const communitySelected = values.get("community_selected") === "1" || (rawCommunity !== null && rawCommunity.trim() !== "");
      const community = rawCommunity || "OC";
      const rawRound = values.get("round");
      const roundExplicit = values.get("round_explicit") === "1";
      const round = rawRound === "ALL"
        ? "ALL"
        : roundExplicit && rawRound && ["ROUND_1", "ROUND_2", "ROUND_3"].includes(rawRound)
        ? rawRound
        : studentCutoff !== null
        ? (studentCutoff >= 179.0 ? "ROUND_1" : studentCutoff >= 145.0 ? "ROUND_2" : "ROUND_3")
        : rawRound && ["ROUND_1", "ROUND_2", "ROUND_3"].includes(rawRound)
        ? rawRound
        : (quota === "GOVT_SCHOOL_7_5" ? "ROUND_1" : "ROUND_2");
      const rawYear = values.get("year");
      const year = rawYear === "2025" ? 2025 : 2026;

      // Non-sensitive directory filtering parameters from POST body
      const effectiveParams = new URLSearchParams(url.searchParams);
      for (const key of ["q", "type", "district", "college", "branch", "tab", "lang", "shortlist", "round", "round_explicit", "year", "only_available", "sort", "page", "searched", "edit_search"]) {
        const val = values.get(key);
        if (val !== null) effectiveParams.set(key, val);
      }

      send(response, 200, renderM5GuidancePage(effectiveParams, { studentCutoff, quota, community, round, communitySelected, year, roundExplicit }));
      return;
    }
    if (request.method === "GET") {
      // Sensitive student cutoff and community are NEVER read from GET query params
      send(response, 200, renderM5GuidancePage(url.searchParams));
      return;
    }
  }
  // Local, opt-in owner review only; no request parameter supplies approvals.
  if (request.method === "GET" && url.pathname === "/colleges" && publicDirectory) {
    send(response, 200, renderGovernedPilot(url.searchParams, undefined, publicDirectory, undefined, "/colleges"));
    return;
  }
  if (request.method === "GET" && url.pathname === "/internal/m4-pilot" && ownerDirectory) { send(response, 200, renderGovernedPilot(url.searchParams, undefined, ownerDirectory, undefined, "/internal/m4-pilot")); return; }
  if (request.method === "GET" && url.pathname === "/journey") {
    const step = url.searchParams.get("step");
    if (step === "explore") { send(response, 200, renderM4Exploration(url.searchParams)); return; }
    const page = step === "study" || step === "compare" || step === "route" || step === "prepare" || step === "check" ? step : "awareness";
    send(response, 200, renderM2Journey(page, awareness, reviewedAdmissionBatch, reviewedAwarenessBatch, runtime, EMPTY_JOURNEY, undefined, presentation, language, { ownerPreview: ownerDirectory !== null, review: url.searchParams.get("review") === "1" }));
    return;
  }
  if (request.method === "POST" && url.pathname === "/journey") {
    let validatedState = null;
    try {
      const body = await readBoundedBody(request, 4096);
      const values = new URLSearchParams(body);
      const state = parseJourneyState(values.get("state") ?? "");
      validatedState = state;
      const reviewMode = url.searchParams.get("review") === "1";
      const navigate = values.get("navigate");
      if (navigate === "awareness" || navigate === "study" || navigate === "compare" || navigate === "route" || navigate === "prepare" || navigate === "check") {
        send(response, 200, renderM2Journey(navigate, awareness, reviewedAdmissionBatch, reviewedAwarenessBatch, runtime, state, undefined, presentation, language, { ownerPreview: ownerDirectory !== null, review: reviewMode }));
        return;
      }
      const next = values.has("edit") ? editJourneyAnswer(state, values.get("edit"))
        : values.get("retry") === "1" ? retryUnknown(state)
        : answerJourneyQuestion(state, values.get("unknown") === "1" ? "unknown" : values.get("answer") ?? "");
      send(response, 200, renderM2Journey("check", awareness, reviewedAdmissionBatch, reviewedAwarenessBatch, runtime, next, undefined, presentation, language, { ownerPreview: ownerDirectory !== null, review: reviewMode }));
    } catch (err) {
      if (err instanceof PayloadTooLargeError) {
        sendPayloadTooLarge(response, language);
        return;
      }
      const field = validatedState ? nextJourneyQuestion(validatedState) : null;
      const copyIndex = language === "en" ? 1 : 0;
      const instruction = field === "improvement_year" ? CHECK_COPY.yearError[copyIndex]
        : ["maths", "physics", "chemistry"].includes(field) ? CHECK_COPY.markError[copyIndex]
        : CHECK_COPY.choiceError[copyIndex];
      send(response, 400, renderM2Journey("check", awareness, reviewedAdmissionBatch, reviewedAwarenessBatch, runtime, validatedState ?? EMPTY_JOURNEY,
        validatedState ? `${instruction} ${CHECK_COPY.errorHelp[copyIndex]}`
          : CHECK_COPY.lostAnswers[copyIndex], presentation, language, { ownerPreview: ownerDirectory !== null, review: url.searchParams.get("review") === "1" }));
    }
    return;
  }
  if (request.method === "GET" && entry !== null) {
    send(response, 200, renderStudentEntryPage(entry, awareness, undefined, {
      section: url.searchParams.get("section") ?? undefined,
      review: url.searchParams.get("review") === "1",
      ownerPreview: ownerDirectory !== null,
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
  if (request.method === "POST" && url.pathname === "/personal") {
    const body = await readBoundedBody(request, 8192);
    const values = Object.fromEntries(new URLSearchParams(body));
    const lang = url.searchParams.get("lang") === "en" ? "en" : "ta";
    const postEntry = { route: "personal", language: lang };
    send(response, 200, renderStudentEntryPage(postEntry, awareness, undefined, {
      maths: values.maths ?? undefined,
      physics: values.physics ?? undefined,
      chemistry: values.chemistry ?? undefined,
      review: url.searchParams.get("review") === "1",
      ownerPreview: ownerDirectory !== null,
    }));
    return;
  }
  if (request.method === "POST" && (url.pathname === "/guidance" || url.pathname === "/demo/guidance")) {
    const body = await readBoundedBody(request, 8192);
    const values = Object.fromEntries(new URLSearchParams(body));
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
  } catch (err) {
    if (err instanceof PayloadTooLargeError) {
      sendPayloadTooLarge(response, language);
      return;
    }
    send(response, 500, "<!doctype html><title>Error</title><h1>Unable to process request</h1>");
  }
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
server.listen(port, host, () => {
  const programmes = runtime.registry.programmes();
  const addr = server.address();
  const actualPort = typeof addr === "object" && addr ? addr.port : port;
  console.log(`TN Engineering Guidance MVP: http://127.0.0.1:${actualPort}`);
  console.log(`Loaded ${runtime.registry.colleges().length} colleges, ${programmes.length} programmes, ${programmes.filter(({ branch_id }) => branch_id !== null).length} canonical mappings.`);
  console.log("Seat snapshot contains no published vacancy facts; vacancy remains UNKNOWN_OR_UNPUBLISHED.");
});

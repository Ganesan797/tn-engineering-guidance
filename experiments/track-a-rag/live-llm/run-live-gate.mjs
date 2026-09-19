import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { writeRunArtifact } from "./src/artifact-writer.mjs";
import { createLiveLlmClient, runtimeFromEnvironment } from "./src/llm-client.ts";
import { executeBoundedLiveRun, runnerConfigurationFromEnvironment } from "./src/runner.ts";
import { PROMPT_VERSION } from "./src/prompt-contract.ts";

const runtime = runtimeFromEnvironment();
if (runtime === null) {
  console.log(JSON.stringify({
    status: "NOT_RUN",
    reason: "Configure LIVE_LLM_PROVIDER, LIVE_LLM_MODEL, and the selected provider's server-side API key",
    prompt_version: PROMPT_VERSION,
  }, null, 2));
  process.exit(0);
}

let configuration;
try {
  configuration = runnerConfigurationFromEnvironment(runtime, process.env);
} catch (error) {
  console.error(JSON.stringify({
    status: "NOT_RUN",
    reason: error instanceof Error ? error.message : "Invalid live-run configuration",
    prompt_version: PROMPT_VERSION,
  }, null, 2));
  process.exitCode = 1;
  process.exit();
}

const client = createLiveLlmClient(runtime);
const artifact = await executeBoundedLiveRun({ client, configuration });
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const outputDirectory = process.env.LIVE_LLM_OUTPUT_DIR?.trim() || join(currentDirectory, "output");
const artifactPath = await writeRunArtifact(artifact, {
  outputDirectory,
  forbiddenValues: [runtime.apiKey],
});

console.log(JSON.stringify({
  status: artifact.status,
  artifact_path: artifactPath,
  provider: artifact.provider,
  model: artifact.model,
  selected_scenario_ids: artifact.selected_scenario_ids,
  attempted_requests: artifact.attempted_requests,
  telemetry_complete: artifact.telemetry_complete,
  estimated_cost_usd: artifact.estimated_cost_usd,
  manual_owner_review_required: true,
}, null, 2));

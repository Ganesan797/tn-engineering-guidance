import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SECRET_PATTERNS = [
  /\bAIza[0-9A-Za-z_-]{20,}\b/u,
  /\bsk-[0-9A-Za-z_-]{16,}\b/u,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/u,
  /"(?:authorization|x-goog-api-key|api[_-]?key)"\s*:/iu,
];

function safeTimestamp(timestamp) {
  return timestamp.replaceAll(":", "-").replaceAll(".", "-");
}

export function assertArtifactContainsNoSecrets(serialized, forbiddenValues = []) {
  for (const value of forbiddenValues) {
    if (typeof value === "string" && value.length > 0 && serialized.includes(value)) {
      throw new Error("Refusing to persist a live-run artifact containing a configured secret");
    }
  }
  if (SECRET_PATTERNS.some((pattern) => pattern.test(serialized))) {
    throw new Error("Refusing to persist a live-run artifact containing credential-shaped data");
  }
}

export async function writeRunArtifact(artifact, options) {
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  assertArtifactContainsNoSecrets(serialized, options.forbiddenValues);
  await mkdir(options.outputDirectory, { recursive: true });
  const path = join(options.outputDirectory, `live-llm-run-${safeTimestamp(artifact.run_timestamp)}.json`);
  await writeFile(path, serialized, { encoding: "utf8", flag: "wx" });
  return path;
}

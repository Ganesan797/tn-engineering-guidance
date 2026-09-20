import { execFileSync } from "node:child_process";
import { existsSync, realpathSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

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

export function assertSafeRawOutputDirectory(outputDirectory, repositoryRoot) {
  const effectivePath = (path) => {
    let existing = resolve(path);
    const missingSegments = [];
    while (!existsSync(existing)) {
      const parent = dirname(existing);
      if (parent === existing) break;
      missingSegments.unshift(basename(existing));
      existing = parent;
    }
    return resolve(realpathSync.native(existing), ...missingSegments);
  };
  const absoluteOutput = effectivePath(outputDirectory);
  const absoluteRepository = effectivePath(repositoryRoot);
  const repositoryRelative = relative(absoluteRepository, absoluteOutput);
  const isInsideRepository = repositoryRelative === "" ||
    (!isAbsolute(repositoryRelative) && repositoryRelative !== ".." && !repositoryRelative.startsWith(`..${sep}`));
  if (!isInsideRepository) return absoluteOutput;
  if (repositoryRelative === "") throw new Error("Raw artifact output cannot be the repository root");
  const prospectiveArtifact = join(repositoryRelative, "live-llm-run-destination-check.json").replaceAll("\\", "/");
  try {
    execFileSync("git", ["-C", absoluteRepository, "check-ignore", "--quiet", "--", prospectiveArtifact], {
      stdio: "ignore",
    });
  } catch {
    throw new Error("Raw artifact output inside the repository must be ignored by Git");
  }
  return absoluteOutput;
}

export async function writeRunArtifact(artifact, options) {
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  assertArtifactContainsNoSecrets(serialized, options.forbiddenValues);
  await mkdir(options.outputDirectory, { recursive: true });
  const path = join(options.outputDirectory, `live-llm-run-${safeTimestamp(artifact.run_timestamp)}.json`);
  await writeFile(path, serialized, { encoding: "utf8", flag: "wx" });
  return path;
}

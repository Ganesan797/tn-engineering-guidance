import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { assertArtifactContainsNoSecrets } from "./src/artifact-writer.mjs";
import { evaluateMechanically } from "./src/evaluation.ts";
import { validateLiveModelOutput } from "./src/output-validation.ts";
import { ALL_LIVE_SCENARIO_IDS, prepareCanonicalLiveScenario } from "./src/runner.ts";

const REVIEW_SCHEMA = "LIVE_LLM_REVIEW_EVIDENCE_V1";
const SANITIZER_VERSION = "LIVE_LLM_EVIDENCE_SANITIZER_V1";
const RAW_KEYS = [
  "schema_version", "source_commit", "status", "provider", "model", "prompt_version", "run_timestamp",
  "selected_scenario_ids", "attempted_requests", "max_attempted_requests", "automatic_retries", "timeout_ms",
  "cost_ceiling_usd", "cost_control", "token_usage", "telemetry_complete", "total_latency_ms",
  "estimated_cost_usd", "run_failure", "manual_owner_review_required", "transcript",
];
const TRANSCRIPT_KEYS = [
  "id", "student", "route", "evidence", "deterministic_result", "assistant", "model_run", "failure",
  "mechanical_evaluation", "review_status",
];
const EVIDENCE_KEYS = [
  "source_id", "title", "page_or_section", "text", "reference", "source_year", "institution_scope",
  "programme", "chunk_id", "evidence_class", "trust",
];
const ASSISTANT_KEYS = [
  "response_text", "language", "guidance_stage", "used_source_ids", "claims_supported",
  "unsupported_claims_detected", "deterministic_result_preserved", "deterministic_result_echo",
  "next_action_type", "next_question", "uncertainty_flag", "recommendation_strength",
];
const MODEL_RUN_KEYS = ["provider", "model", "prompt_version", "latency_ms", "usage", "estimated_cost_usd", "cost_basis"];
const USAGE_KEYS = ["input_tokens", "output_tokens", "thinking_tokens", "total_tokens"];
const EVALUATION_KEYS = ["grounding", "routing", "guidance", "language", "security", "uncertainty", "reasons"];
const FAILURE_KEYS = ["provider_error", "status", "scenario_id", "provider", "model", "latency_ms", "failure_classification", "message"];
const PROVIDER_ERROR_KEYS = ["code", "status", "message"];
const TOKEN_USAGE_KEYS = ["input_tokens", "output_tokens", "thinking_tokens", "total_tokens"];
const RUN_FAILURE_KEYS = ["classification", "message"];
const ENVELOPE_KEYS = [
  "schema_version", "evidence_class", "approval_status", "generated_at", "approved_at", "sanitizer_version",
  "source_artifact_sha256", "sanitized_artifact",
];

const CREDENTIAL_ASSIGNMENT = /(?:authorization\s*:\s*bearer|access[_-]?token|password|passwd|pwd|api[_-]?key|key)\s*[=:]\s*\S+/iu;
const SENSITIVE_TEXT = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu,
  /\b(?:\+?91[-\s]?)?[6-9]\d{9}\b/u,
  /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/u,
  /\b(?:student[_ -]?name|email|phone|mobile|address|aadhaar|aadhar)\s*[=:]/iu,
];
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(currentDirectory, "../../..");
const VALIDATION_AUTHORITY_PATHS = [
  "experiments/track-a-rag/live-llm/src/output-validation.ts",
  "experiments/track-a-rag/live-llm/src/evaluation.ts",
  "experiments/track-a-rag/live-llm/src/runner.ts",
  "experiments/track-a-rag/live-llm/scenarios",
  "experiments/track-a-rag/corpus",
  "experiments/track-a-rag/src",
];

function object(value, label) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}

function assertAllowedKeys(value, allowed, label) {
  const unexpected = Object.keys(object(value, label)).filter((key) => !allowed.includes(key));
  if (unexpected.length > 0) throw new Error(`${label} contains non-allowlisted fields: ${unexpected.join(", ")}`);
}

function assertExact(value, expected, label) {
  if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error(`${label} does not match the canonical scenario`);
}

function assertString(value, label) {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${label} must be a non-empty string`);
}

function assertSafeReviewText(value, label) {
  if (typeof value !== "string") return;
  if (CREDENTIAL_ASSIGNMENT.test(value) || SENSITIVE_TEXT.some((pattern) => pattern.test(value))) {
    throw new Error(`${label} contains credential-shaped or sensitive personal content`);
  }
}

function assertSafeTranscriptText(entry) {
  assertSafeReviewText(entry.student, `Scenario ${entry.id} student text`);
  if (entry.assistant !== undefined) {
    assertSafeReviewText(entry.assistant.response_text, `Scenario ${entry.id} response`);
    assertSafeReviewText(entry.assistant.next_question, `Scenario ${entry.id} next question`);
    for (const claim of entry.assistant.unsupported_claims_detected ?? []) {
      assertSafeReviewText(claim, `Scenario ${entry.id} unsupported claim`);
    }
  }
  if (entry.failure !== undefined) assertSafeReviewText(entry.failure.message, `Scenario ${entry.id} failure`);
}

function assertNestedAllowlist(entry, index) {
  const label = `transcript[${index}]`;
  assertAllowedKeys(entry, TRANSCRIPT_KEYS, label);
  if (!Array.isArray(entry.evidence)) throw new Error(`${label}.evidence must be an array`);
  entry.evidence.forEach((item, evidenceIndex) => assertAllowedKeys(item, EVIDENCE_KEYS, `${label}.evidence[${evidenceIndex}]`));
  if (entry.assistant !== undefined) assertAllowedKeys(entry.assistant, ASSISTANT_KEYS, `${label}.assistant`);
  if (entry.model_run !== undefined) {
    assertAllowedKeys(entry.model_run, MODEL_RUN_KEYS, `${label}.model_run`);
    assertAllowedKeys(entry.model_run.usage, USAGE_KEYS, `${label}.model_run.usage`);
  }
  if (entry.mechanical_evaluation !== null) assertAllowedKeys(entry.mechanical_evaluation, EVALUATION_KEYS, `${label}.mechanical_evaluation`);
  if (entry.failure !== undefined) {
    assertAllowedKeys(entry.failure, FAILURE_KEYS, `${label}.failure`);
    if (entry.failure.provider_error !== undefined) {
      assertAllowedKeys(entry.failure.provider_error, PROVIDER_ERROR_KEYS, `${label}.failure.provider_error`);
    }
  }
}

export function validateSanitizedArtifact(rawArtifact) {
  const raw = object(rawArtifact, "raw artifact");
  assertAllowedKeys(raw, RAW_KEYS, "raw artifact");
  if (raw.schema_version !== "LIVE_LLM_RUN_V1") throw new Error("Unsupported raw artifact schema");
  if (typeof raw.source_commit !== "string" || !/^[0-9a-f]{40}$/u.test(raw.source_commit)) {
    throw new Error("Raw artifact must record a full lowercase Git source commit");
  }
  assertString(raw.provider, "provider");
  assertString(raw.model, "model");
  assertString(raw.prompt_version, "prompt_version");
  if (typeof raw.run_timestamp !== "string" || Number.isNaN(Date.parse(raw.run_timestamp))) throw new Error("Invalid run timestamp");
  if (!Array.isArray(raw.selected_scenario_ids) || raw.selected_scenario_ids.length === 0) throw new Error("No selected scenarios");
  if (new Set(raw.selected_scenario_ids).size !== raw.selected_scenario_ids.length) throw new Error("Duplicate selected scenario IDs");
  if (raw.selected_scenario_ids.some((id) => !ALL_LIVE_SCENARIO_IDS.includes(id))) throw new Error("Artifact contains a noncanonical scenario ID");
  if (!Array.isArray(raw.transcript)) throw new Error("Artifact transcript must be an array");
  assertAllowedKeys(raw.token_usage, TOKEN_USAGE_KEYS, "raw artifact token_usage");
  if (raw.run_failure !== null) assertAllowedKeys(raw.run_failure, RUN_FAILURE_KEYS, "raw artifact run_failure");

  const transcriptIds = new Set();
  for (const [index, entryValue] of raw.transcript.entries()) {
    const entry = object(entryValue, `transcript[${index}]`);
    assertNestedAllowlist(entry, index);
    if (!raw.selected_scenario_ids.includes(entry.id)) throw new Error(`Transcript scenario ${entry.id} was not selected`);
    if (transcriptIds.has(entry.id)) throw new Error(`Duplicate transcript scenario ${entry.id}`);
    transcriptIds.add(entry.id);
    const canonical = prepareCanonicalLiveScenario(entry.id);
    assertExact(entry.student, canonical.student, `Scenario ${entry.id} student text`);
    assertExact(entry.route, canonical.prepared.input.route, `Scenario ${entry.id} route`);
    assertExact(entry.evidence, canonical.prepared.input.retrieved_evidence, `Scenario ${entry.id} evidence`);
    assertExact(entry.deterministic_result, canonical.prepared.input.deterministic_result, `Scenario ${entry.id} deterministic result`);
    assertSafeTranscriptText(entry);

    if (entry.assistant !== undefined) {
      if (entry.failure !== undefined || entry.model_run === undefined || entry.mechanical_evaluation === null) {
        throw new Error(`Scenario ${entry.id} has an inconsistent successful transcript`);
      }
      const issues = validateLiveModelOutput(entry.assistant, canonical.prepared.input);
      if (issues.length > 0) throw new Error(`Scenario ${entry.id} output validation failed: ${issues.join("; ")}`);
      assertExact(entry.mechanical_evaluation, evaluateMechanically(canonical.prepared.input, entry.assistant), `Scenario ${entry.id} mechanical evaluation`);
    } else if (entry.failure === undefined || entry.model_run !== undefined || entry.mechanical_evaluation !== null) {
      throw new Error(`Scenario ${entry.id} has an inconsistent failed transcript`);
    }
  }

  const serialized = JSON.stringify(raw);
  assertArtifactContainsNoSecrets(serialized);
  if (CREDENTIAL_ASSIGNMENT.test(serialized)) throw new Error("Artifact contains credential-shaped assignments");
  return structuredClone(raw);
}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function createReviewCandidate(rawBytes, generatedAt = new Date().toISOString()) {
  const raw = JSON.parse(rawBytes.toString("utf8"));
  const sanitizedArtifact = validateSanitizedArtifact(raw);
  return {
    schema_version: REVIEW_SCHEMA,
    evidence_class: "SANITIZED_REVIEW_EVIDENCE",
    approval_status: "CANDIDATE",
    generated_at: generatedAt,
    approved_at: null,
    sanitizer_version: SANITIZER_VERSION,
    source_artifact_sha256: sha256(rawBytes),
    sanitized_artifact: sanitizedArtifact,
  };
}

export function validateReviewEvidence(value) {
  const envelope = object(value, "review evidence");
  assertAllowedKeys(envelope, ENVELOPE_KEYS, "review evidence");
  if (envelope.schema_version !== REVIEW_SCHEMA || envelope.evidence_class !== "SANITIZED_REVIEW_EVIDENCE") {
    throw new Error("Unsupported review evidence schema or class");
  }
  if (envelope.approval_status !== "CANDIDATE" && envelope.approval_status !== "OWNER_APPROVED") {
    throw new Error("Invalid approval status");
  }
  if (!/^[0-9a-f]{64}$/u.test(String(envelope.source_artifact_sha256))) throw new Error("Invalid source artifact SHA-256");
  if (envelope.approval_status === "OWNER_APPROVED" && typeof envelope.approved_at !== "string") {
    throw new Error("Approved evidence must record its approval time");
  }
  if (envelope.approval_status === "CANDIDATE" && envelope.approved_at !== null) throw new Error("Candidate cannot have an approval time");
  validateSanitizedArtifact(envelope.sanitized_artifact);
  assertArtifactContainsNoSecrets(JSON.stringify(envelope));
  return structuredClone(envelope);
}

function verifyValidationAuthority(sourceCommit) {
  try {
    execFileSync("git", ["-C", repositoryRoot, "cat-file", "-e", `${sourceCommit}^{commit}`], { stdio: "ignore" });
    execFileSync("git", ["-C", repositoryRoot, "merge-base", "--is-ancestor", sourceCommit, "HEAD"], { stdio: "ignore" });
    execFileSync("git", ["-C", repositoryRoot, "diff", "--quiet", sourceCommit, "HEAD", "--", ...VALIDATION_AUTHORITY_PATHS], { stdio: "ignore" });
  } catch {
    throw new Error("Recorded source commit is unavailable, is not an ancestor, or uses different validation authority");
  }
}

async function writeExclusive(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
}

export async function exportReviewCandidate(rawPath, candidatePath, options = {}) {
  const rawBytes = await readFile(rawPath);
  const candidate = createReviewCandidate(rawBytes);
  if (options.verifyAuthority !== false) verifyValidationAuthority(candidate.sanitized_artifact.source_commit);
  await writeExclusive(candidatePath, candidate);
  return candidate;
}

export async function approveReviewCandidate(rawPath, candidatePath, approvedPath, approvedAt = new Date().toISOString(), options = {}) {
  const rawBytes = await readFile(rawPath);
  const candidate = validateReviewEvidence(JSON.parse(await readFile(candidatePath, "utf8")));
  if (options.verifyAuthority !== false) verifyValidationAuthority(candidate.sanitized_artifact.source_commit);
  if (candidate.approval_status !== "CANDIDATE") throw new Error("Only a candidate can be approved");
  if (candidate.source_artifact_sha256 !== sha256(rawBytes)) throw new Error("Candidate does not match the supplied raw artifact");
  assertExact(candidate.sanitized_artifact, validateSanitizedArtifact(JSON.parse(rawBytes.toString("utf8"))), "Candidate artifact");
  const approved = { ...candidate, approval_status: "OWNER_APPROVED", approved_at: approvedAt };
  validateReviewEvidence(approved);
  await writeExclusive(approvedPath, approved);
  return approved;
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

async function main(args) {
  const action = args[0];
  if (action === "export") {
    const artifact = option(args, "--artifact");
    if (!artifact) throw new Error("export requires --artifact <raw-artifact-path>");
    const candidate = option(args, "--candidate") ?? join(currentDirectory, "output", "review-candidates", `${basename(artifact, ".json")}.candidate.json`);
    await exportReviewCandidate(resolve(artifact), resolve(candidate));
    console.log(JSON.stringify({ status: "CANDIDATE_CREATED", candidate_path: resolve(candidate), approval_required: true }, null, 2));
    return;
  }
  if (action === "approve") {
    const artifact = option(args, "--artifact");
    const candidate = option(args, "--candidate");
    if (!artifact || !candidate || !args.includes("--owner-approved")) {
      throw new Error("approve requires --artifact, --candidate, and the explicit --owner-approved flag");
    }
    const parsed = validateReviewEvidence(JSON.parse(await readFile(resolve(candidate), "utf8")));
    const scenarioPart = parsed.sanitized_artifact.selected_scenario_ids.join("-");
    const timestampPart = parsed.sanitized_artifact.run_timestamp.replaceAll(":", "-").replaceAll(".", "-");
    const approvedPath = option(args, "--output") ?? join(currentDirectory, "review-evidence", "approved", `${scenarioPart}-${timestampPart}-${parsed.sanitized_artifact.source_commit.slice(0, 12)}.review.json`);
    await approveReviewCandidate(resolve(artifact), resolve(candidate), resolve(approvedPath));
    console.log(JSON.stringify({ status: "OWNER_APPROVED", evidence_path: resolve(approvedPath), git_action: "NONE" }, null, 2));
    return;
  }
  if (action === "validate") {
    const evidence = option(args, "--evidence");
    if (!evidence) throw new Error("validate requires --evidence <review-evidence-path>");
    const validated = validateReviewEvidence(JSON.parse(await readFile(resolve(evidence), "utf8")));
    verifyValidationAuthority(validated.sanitized_artifact.source_commit);
    console.log(JSON.stringify({ status: "PASS", approval_status: validated.approval_status, source_commit: validated.sanitized_artifact.source_commit }, null, 2));
    return;
  }
  throw new Error("Use export, approve, or validate");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : "Evidence command failed");
    process.exitCode = 1;
  });
}

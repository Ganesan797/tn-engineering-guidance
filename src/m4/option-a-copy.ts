// The project intentionally has no ambient Node typings; these runtime imports
// match the existing M4 governed-artifact loaders.
// @ts-expect-error Node built-in types are not installed in this offline project.
import { createHash } from "node:crypto";
// @ts-expect-error Node built-in types are not installed in this offline project.
import { readFileSync } from "node:fs";
import type { ReviewedBranchCopy } from "./branch-copy.ts";

const catalogueUrl = new URL(
  "../../docs/content/m4/m4_t03_comprehensive_branch_content_review_v1.md",
  import.meta.url,
);
const catalogueHash = "8df92b33b3a581c7b1f1c5f860460631e78182c4";
const decisionVersion = `M4-OPTION-A-2026-11-01-${catalogueHash}`;
const acceptedCodes = [
  "AG", "AM", "AU", "BT", "CC", "CD", "CF", "CH", "CI", "CK", "CO", "EF", "EI", "EN", "EV",
  "EX", "FD", "FT", "HT", "IC", "IN", "IT", "MD", "ME", "MN", "MR", "MU", "MZ", "PC", "PE",
  "PH", "RI", "RM", "SC", "TX",
] as const;

const batchOne = new Set(["IT", "ME", "CH", "BT", "TX", "AG", "EN", "MR"]);
const batchTwo = new Set(["AM", "AU", "CC", "CD", "CF", "CI", "CO", "EF", "EI", "EV", "EX", "IC", "IN", "MD", "RM", "SC"]);
const batchThree = new Set(["CK", "FD", "FT", "HT", "MN", "MU", "MZ", "PC", "PE", "PH", "RI"]);

const labels = [
  "இது என்ன? / What is it?",
  "என்ன படிப்பீர்கள்? / What will you study?",
  "செய்முறையும் பயன்பாடும் / Practical learning and applications",
  "கவனிக்க வேண்டியது / Important considerations",
  "அடுத்து என்ன பார்க்கலாம்? / What to explore next?",
] as const;

interface SourceRecord {
  readonly url: string;
  readonly scope: string;
}

function decisionReference(code: string): string {
  if (batchOne.has(code)) return "docs/content/m4/m4_batch1_owner_decision_2026-11-01.md";
  if (batchTwo.has(code)) return "docs/content/m4/m4_batch2_owner_decision_2026-11-01.md";
  if (batchThree.has(code)) return "docs/content/m4/m4_batch3_owner_decision_2026-11-01.md";
  throw new Error(`M4 Option A code has no batch decision: ${code}`);
}

function tableCells(line: string): string[] {
  return line.slice(1, -1).split("|").map(cell => cell.trim());
}

function sourceRegister(markdown: string): Map<string, SourceRecord> {
  const records = new Map<string, SourceRecord>();
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("| <a id=\"")) continue;
    const cells = tableCells(line);
    const ref = cells[0]?.match(/<\/a>([A-Z]\d+)/)?.[1];
    const link = cells[1]?.match(/\[[^\]]+\]\((https:\/\/[^)]+)\)/);
    if (!ref || !link || !cells[2]) throw new Error(`Invalid M4 source-register row: ${line}`);
    if (records.has(ref)) throw new Error(`Duplicate M4 source reference: ${ref}`);
    records.set(ref, { url: link[1], scope: cells[2] });
  }
  return records;
}

function claimLocators(markdown: string): Map<string, string> {
  const records = new Map<string, string>();
  const allowed = new Set<string>(acceptedCodes);
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.startsWith("| ")) continue;
    const cells = tableCells(line);
    const code = cells[0];
    if (!allowed.has(code) || cells[1] !== "READY_FOR_OWNER_REVIEW" || !cells[2]) continue;
    const locator = cells[2]
      .replace(/\[([A-Z]\d+)\]\(#[^)]+\)/g, "$1")
      .replace(/`/g, "");
    if (records.has(code)) throw new Error(`Duplicate M4 claim locator: ${code}`);
    records.set(code, locator);
  }
  return records;
}

function profileSection(markdown: string, code: string): string[] {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex(line => line.startsWith(`#### ${code} — `));
  if (start < 0) throw new Error(`Missing M4 profile section: ${code}`);
  const end = lines.findIndex((line, index) => index > start && /^(#### |### |## )/.test(line));
  return lines.slice(start, end < 0 ? undefined : end);
}

function bilingualCopy(section: readonly string[], code: string): ReviewedBranchCopy["copy"] {
  const ta: string[] = [];
  const en: string[] = [];
  for (const label of labels) {
    const prefix = `- **${label}`;
    const line = section.find(candidate => candidate.startsWith(prefix));
    if (!line) throw new Error(`Missing M4 bilingual field ${code}: ${label}`);
    const bodyStart = line.indexOf("** ", prefix.length);
    if (bodyStart < 0) throw new Error(`Invalid M4 bilingual label ${code}: ${label}`);
    const body = line.slice(bodyStart + 3);
    const divider = body.indexOf(" / ");
    if (divider < 1 || divider === body.length - 3) throw new Error(`Invalid M4 bilingual field ${code}: ${label}`);
    ta.push(body.slice(0, divider).trim());
    en.push(body.slice(divider + 3).trim());
  }
  return { ta: ta.join("\n"), en: en.join("\n") };
}

function profileSourceRef(section: readonly string[], code: string): string {
  const metadata = section.find(line => line.startsWith("- **Codes:**"));
  const ref = metadata?.match(/\*\*Source refs:\*\* \[([A-Z]\d+)\]/)?.[1];
  if (!ref) throw new Error(`Missing M4 source reference: ${code}`);
  return ref;
}

function loadOptionAProfiles(): readonly ReviewedBranchCopy[] {
  const markdown = readFileSync(catalogueUrl, "utf8");
  // Git stores LF-normalised text for this tracked Markdown file. Normalising
  // the Windows worktree line endings lets the runtime verify the accepted Git
  // blob without making platform-specific copies.
  const bytes = new TextEncoder().encode(markdown.replace(/\r\n/g, "\n"));
  const gitBlobHash = createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
  if (gitBlobHash !== catalogueHash) {
    throw new Error("M4 Option A approved catalogue hash mismatch");
  }
  const sources = sourceRegister(markdown);
  const locators = claimLocators(markdown);
  const profiles = acceptedCodes.map(code => {
    const section = profileSection(markdown, code);
    const copy = bilingualCopy(section, code);
    const ref = profileSourceRef(section, code);
    const source = sources.get(ref);
    const locator = locators.get(code);
    if (!source || !locator) throw new Error(`Incomplete M4 approved evidence linkage: ${code}`);
    const evidence = { url: source.url, locator, scope: source.scope };
    const reference = `${decisionReference(code)}; catalogue blob ${catalogueHash}; section ${code}`;
    return {
      id: code,
      version: decisionVersion,
      disposition: "APPROVED" as const,
      copy,
      evidence,
      approval: {
        version: decisionVersion,
        approved_copy: copy,
        approved_evidence: evidence,
        owner: "Ganesan",
        factual: "PASS_OWNER_REPORTED 2026-11-01",
        ta: "PASS_OWNER_REPORTED 2026-11-01",
        en: "PASS_OWNER_REPORTED 2026-11-01",
        reference,
      },
    } satisfies ReviewedBranchCopy;
  });
  if (profiles.length !== 35 || new Set(profiles.map(profile => profile.id)).size !== 35) {
    throw new Error("M4 Option A approved profile count mismatch");
  }
  return profiles;
}

/** Exact unchanged Option A copy from the catalogue bytes present at the owner-decision commit. */
export const OPTION_A_ADDITIONAL_APPROVED_BRANCH_COPY = loadOptionAProfiles();

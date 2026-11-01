import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const document = readFileSync(new URL("../docs/content/m4/m4_t03_comprehensive_branch_content_review_v1.md", import.meta.url), "utf8");
const crosswalk = readFileSync(new URL("../experiments/m4-governance-census/code-crosswalk.csv", import.meta.url), "utf8");
const research = JSON.parse(readFileSync(new URL("../experiments/m4-governance-census/summary.json", import.meta.url), "utf8"));
const ledger = document.split("## Full TNEA code disposition ledger")[1].split("### Held scope codes")[0];
const entries = [...ledger.matchAll(/^\| ([A-Z]{2}) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)]
  .map(([, code, name, variant, profile, family, disposition]) => ({ code, name, variant, profile: profile.trim(), family: family.trim(), disposition: disposition.trim() }));
const section = document.split("## Bilingual educational profiles")[1].split("## Official source register")[0];
const profiles = [...section.matchAll(/^#### ([A-Z]{2}) — ([^\n]+)\n([\s\S]*?)(?=^#### |^### |$(?![\s\S]))/gm)]
  .map(([, id, name, body]) => ({ id, name, body,
    family: body.match(/\*\*Family:\*\* ([A-Z])/)?.[1],
    status: body.match(/\*\*Status:\*\* ([A-Z_]+)/)?.[1],
    codes: body.match(/\*\*Codes:\*\* ([^.]+)/)?.[1].split(", ") ?? [],
    refs: [...body.matchAll(/\[([A-Z]\d+)\]\(#[a-z]\d+\)/g)].map(match => match[1]),
  }));
const register = new Map([...document.split("## Official source register")[1].matchAll(/^\| <a id="[a-z]\d+"><\/a>([A-Z]\d+) \| \[[^\]]+\]\((https:\/\/[^)]+)\) \| ([^|]+) \| ([^|]+) \|$/gm)]
  .map(([, key, url, scope, access]) => [key, { url, scope, access }]));
const fields = ["இது என்ன? / What is it?", "என்ன படிப்பீர்கள்? / What will you study?", "செய்முறையும் பயன்பாடும் / Practical learning and applications:", "கவனிக்க வேண்டியது / Important considerations:", "அடுத்து என்ன பார்க்கலாம்? / What to explore next?"];
function csvCells(line) {
  const cells = []; let value = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') { value += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { cells.push(value); value = ""; }
    else value += ch;
  }
  cells.push(value);
  assert.equal(quoted, false, "unclosed CSV quote");
  return cells;
}
const sourceRows = crosswalk.trim().split(/\r?\n/).slice(1).map(csvCells);
const codes = new Set(entries.map(entry => entry.code));
const ids = new Set(profiles.map(profile => profile.id));
assert.equal(codes.size, entries.length, "duplicate catalogue code");
assert.equal(ids.size, profiles.length, "duplicate educational profile");
assert.deepEqual([...codes].sort(), sourceRows.map(row => row[0]).sort(), "catalogue/crosswalk code mismatch");
assert.equal(entries.length, research.codes, "changed code count versus preserved research inventory");
assert.equal(profiles.length, research.profiles, "changed profile count versus preserved research inventory");
for (const profile of profiles) {
  assert.ok(["C", "E", "M", "B", "T", "S"].includes(profile.family), `${profile.id}: missing family`);
  assert.ok(["DRAFT_WITH_CURRICULUM_ANCHOR", "HOLD_EVIDENCE_OR_IDENTITY"].includes(profile.status), `${profile.id}: unknown status`);
  assert.ok(profile.refs.every(ref => register.has(ref)), `${profile.id}: source reference missing from register`);
  if (!profile.refs.length) assert.ok(profile.status === "HOLD_EVIDENCE_OR_IDENTITY" && profile.body.includes("TNEA code census only"), `${profile.id}: unanchored profile not held`);
  assert.ok(profile.body.includes("**Identity/claim limit:**"), `${profile.id}: no scope limit`);
  for (const field of fields) {
    const line = profile.body.split(/\r?\n/).find(value => value.startsWith(`- **${field}** `));
    assert.ok(line, `${profile.id}: missing ${field}`);
    const parts = line.slice(`- **${field}** `.length).split(" / ");
    assert.equal(parts.length, 2, `${profile.id}: Tamil/English field not paired: ${field}`);
    assert.ok(parts.every(part => part.trim()), `${profile.id}: blank bilingual field`);
  }
  assert.deepEqual(new Set(profile.codes), new Set(entries.filter(entry => entry.profile === profile.id).map(entry => entry.code)), `${profile.id}: profile/code mismatch`);
  if (profile.status === "HOLD_EVIDENCE_OR_IDENTITY") assert.match(profile.body, /not confirmed|not yet|cannot|incomplete/i, `${profile.id}: held uncertainty missing`);
}
for (const entry of entries) {
  const row = sourceRows.find(row => row[0] === entry.code);
  assert.ok(row, `${entry.code}: missing crosswalk row`);
  assert.deepEqual([entry.name.trim(), entry.profile, entry.family, entry.disposition], [row[3], row[5], row[6], row[7]], `${entry.code}: exact source name/profile/family/disposition changed`);
  if (entry.disposition === "V") assert.notEqual(entry.variant.trim(), "—", `${entry.code}: delivery variant lost`);
  if (entry.profile === "Scope hold") assert.equal(entry.disposition, "OWNER_SCOPE_DECISION", `${entry.code}: scope hold changed`);
  else assert.ok(ids.has(entry.profile), `${entry.code}: missing profile`);
}
const byFamily = Object.fromEntries(["C", "E", "M", "B", "T", "S"].map(family => [family, {
  draft: profiles.filter(profile => profile.family === family && profile.status === "DRAFT_WITH_CURRICULUM_ANCHOR").map(profile => profile.id),
  hold: profiles.filter(profile => profile.family === family && profile.status === "HOLD_EVIDENCE_OR_IDENTITY").map(profile => profile.id),
}]));
const scopeHolds = entries.filter(entry => entry.profile === "Scope hold").map(entry => entry.code);
const datedOrLimited = [...new Set(profiles.flatMap(profile => profile.refs).filter(ref => /^(U|S|O)/.test(ref)))];
console.log(JSON.stringify({codes:entries.length,profiles:profiles.length,scopeHolds,byFamily,sourceRefs:register.size,datedOrLimitedRefs:datedOrLimited},null,2));

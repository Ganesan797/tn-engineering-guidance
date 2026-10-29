import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadApprovedDirectory } from "../../src/m4/approved-directory-preview.mjs";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";

const root = new URL("../../experiments/m4-governance-census/directory-candidates-2026/", import.meta.url);
const view = loadApprovedDirectory();
const render = query => renderGovernedPilot(new URLSearchParams(query), undefined, view);

test("approved bytes are required for every manifest and dataset", () => {
  for (const name of ["batch-supported.csv", "batch-exceptions.csv", "college-candidates.csv", "offering-candidates.csv", "field-provenance.csv", "exceptions.csv"]) {
    assert.throws(() => loadApprovedDirectory(file => {
      const bytes = readFileSync(new URL(file, root));
      return file === name ? Buffer.concat([bytes, Buffer.from("altered")]) : bytes;
    }), /hash mismatch/);
  }
});

test("source-only listings keep identity, district, scope and profile holds independent", () => {
  assert.equal(view.items.length, 3128);
  assert.equal(new Set(view.items.map(x => x.college)).size, 389);
  assert.equal(view.excluded, 226);
  assert.ok(view.items.every(x => x.profile === null && x.profileId === null && x.source.year === 2026 && x.source.stream === "GENERAL_ACADEMIC" && x.source.stage === "BEFORE_SPECIAL_RESERVATION_COUNSELLING"));
  assert.ok(view.items.every(x => !["1133","1301","1424","2345","2776","3815"].includes(x.college)));
  assert.ok(view.items.every(x => !["AE","AO","BP","DA","CQ","IF","ID","CJ"].includes(x.programme)));
  assert.ok(view.items.some(x => x.programme === "BY") && view.items.some(x => x.programme === "XC"));
  assert.ok(view.items.filter(x => ["1303","4967"].includes(x.college)).every(x => x.district === null));
  assert.ok(view.items.some(x => x.college === "1102") && view.items.filter(x => ["1102","1221","1510","1516","2350","4943","5533"].includes(x.college)).every(x => x.district === null && x.type === null));
  assert.ok(view.items.filter(x => !["1","4","1303","1304","2603","3018","4967"].includes(x.college)).every(x => x.district === null && x.type === null));
  assert.ok(view.items.every(x => !["2332","3555","4911","4927"].includes(x.college)));
});

test("both browse paths, filters, empty states, comparison and bilingual pending copy", () => {
  const home=render("lang=en"); assert.match(home,/No marks are required/);
  const branches=render("lang=en&view=branches"); assert.match(branches,/COMPUTER SCIENCE AND ENGINEERING/);
  assert.match(render("lang=en&view=branch&branch=CS"),/explanation.*still under review/i);
  assert.match(render("lang=ta&view=branch&branch=CS"),/விளக்கம் இன்னும் மதிப்பாய்வில் உள்ளது/);
  assert.match(render("lang=en&view=colleges&q=Easwari"),/Easwari Engineering College/);
  assert.match(render("lang=en&view=college&college=1304"),/COMPUTER SCIENCE AND ENGINEERING/);
  assert.match(render("lang=en&view=colleges&district=CHENNAI"),/District: CHENNAI/);
  assert.match(render("lang=en&view=colleges&type=PRIVATE"),/Easwari Engineering College/);
  assert.doesNotMatch(render("lang=en&view=colleges&district=TENKASI"),/S Veerasamy Chettiar/);
  assert.match(render("lang=en&view=colleges&q=not-a-real-college-9999"),/role="status"/);
  const comparison=render("lang=en&view=compare&pick=1%7ECS&pick=4%7ECS");
  assert.match(comparison,/CEG Campus/);assert.match(comparison,/MIT Campus/);assert.match(comparison,/not a ranking/);
  assert.doesNotMatch(render("lang=en&view=compare&pick=1133%7ECS&pick=1%7ECS"),/Nellai Nadar/);
  assert.match(render("lang=ta&view=detail&college=1&programme=CS"),/lang=en/);
  assert.match(render("lang=en&view=detail&college=1&programme=CS"),/does not confirm current availability/);
  assert.match(render("lang=en&view=detail&college=1&programme=CS"),/District source: 2026/);
  assert.match(render("lang=en&view=detail&college=1&programme=CS"),/Institution type source: 2026/);
  assert.match(render("lang=en&view=colleges&page=2"),/Page 2 \/ /);
});

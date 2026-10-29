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
  assert.ok(view.items.every(x => x.profile === null && x.source.year === 2026 && x.source.stream === "GENERAL_ACADEMIC" && x.source.stage === "BEFORE_SPECIAL_RESERVATION_COUNSELLING"));
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

test("college groups, distinct counts and compact college detail preserve source limits", () => {
  const all=render("lang=en&view=colleges");
  assert.match(all,/389 colleges · 3128 matching programmes/);
  assert.equal((all.match(/<article class="card">/g) ?? []).length,15);
  assert.equal((all.match(/<h2>University Departments of Anna University, Chennai - CEG Campus<\/h2>/g) ?? []).length,1);
  const detail=render("lang=en&view=college&college=1");
  assert.equal((detail.match(/<h1>University Departments of Anna University, Chennai - CEG Campus<\/h1>/g) ?? []).length,1);
  assert.match(detail,/Listed programmes/);assert.match(detail,/BIO MEDICAL ENGINEERING \(SS\)/);
  assert.match(detail,/does not confirm current availability/);
  const branch=render("lang=en&view=colleges&branch=CS");assert.match(branch,/matching programmes/);assert.match(branch,/COMPUTER SCIENCE AND ENGINEERING \(CS\)/);
});

test("navigation and temporary comparison selections survive pages without publishing held records", () => {
  const q="lang=en&view=colleges&branch=CS&district=CHENNAI&q=university&page=2&pick=1%7ECS&pick=4%7ECS";
  const html=render(q);assert.match(html,/2 selected for comparison/);assert.match(html,/Compare selected/);
  assert.match(html,/branch=CS&amp;district=CHENNAI&amp;q=university&amp;page=2/);
  assert.match(html,/pick=1%7ECS&amp;pick=4%7ECS/);
  const detail=render("lang=en&view=detail&college=1&programme=CS&branch=CS&district=CHENNAI&q=university&page=2");
  assert.match(detail,/view=colleges&amp;branch=CS&amp;district=CHENNAI&amp;q=university&amp;page=2|branch=CS&amp;district=CHENNAI&amp;q=university&amp;page=2&amp;view=colleges/);
  const tooMany=render("lang=en&view=colleges&pick=1%7ECS&pick=4%7ECS&pick=1304%7ECS&pick=2603%7EEE");
  assert.match(tooMany,/Keep at most three selections/);assert.doesNotMatch(tooMany,/>Compare selected<\/a>/);
  const forged=render("lang=en&view=colleges&pick=1133%7ECS&pick=1%7ECS");
  assert.doesNotMatch(forged,/Nellai Nadar|value="1133~CS"/);
});


test("readable details preserve exact names, unknown fields, and pending explanation boundaries", () => {
  for (const lang of ["en", "ta"]) {
    const html = render(`lang=${lang}&view=detail&college=4&programme=AT&branch=AT&page=2&pick=1%7ECS&pick=4%7ECS`);
    assert.match(html, /<h1>ARTIFICIAL INTELLIGENCE AND DATA SCIENCE \(SS\)<\/h1>/);
    assert.match(html, /<strong>AT<\/strong>/);
    assert.equal((html.match(/class="action primary"/g) ?? []).length, 1);
    assert.doesNotMatch(html, /view=branch(?:&amp;|"|&)/);
    assert.match(html, /view=college&amp;college=4/);
    assert.match(html, /pick=1%7ECS&amp;pick=4%7ECS/);
    assert.match(html, /<details class="card evidence">/);
    assert.match(html, /<p class="source-notice">/);
    assert.match(html, /<dl class="fact-grid">/);
    assert.doesNotMatch(html, /Non-Autonomous|Non-Minority|சுயநிதி.*விளக்கம்/);
  }
  const conflict = render("lang=en&view=detail&college=1303&programme=CS");
  assert.match(conflict, /<dt>District<\/dt><dd>Not known<\/dd>/);
  const unenriched = render("lang=en&view=college&college=1102");
  assert.match(unenriched, /<dt>Institution type<\/dt><dd>Not known<\/dd>/);
  assert.doesNotMatch(unenriched, /Official Website|Autonomous status|Minority status/);
  const held = render("lang=en&view=detail&college=1133&programme=CS");
  assert.doesNotMatch(held, /<header|Nellai Nadar|action primary/);
});


test("college evidence accounts for all programme source pages", () => {
  const rows = view.items.filter(row => row.college === "1");
  const html = render("lang=en&view=college&college=1");
  const disclosure = html.slice(html.indexOf('<details class="card evidence">'));
  for (const row of rows) assert.ok(disclosure.includes(`${row.source.printed_page} / ${row.source.pdf_page}`));
});


test("additional metadata requires both accepted identity and exact dated field approval", () => {
  const colleges = [...new Map(view.items.map(i=>[i.college,i])).values()];
  const enriched = colleges.filter(i=>i.metadata.length);
  assert.deepEqual(enriched.map(i=>i.college), ["1","4","1303","1304","2603","3018","4967"]);
  assert.equal(enriched.reduce((n,i)=>n+i.metadata.length,0),52);
  const approved = readFileSync(new URL("batch-supported.csv",root),"utf8");
  for(const college of enriched) for(const field of college.metadata) {
    assert.ok(approved.includes(field.recordId));
    assert.equal(field.year,"2026");assert.match(field.pdfPage,/^[1-9]\d*$/);
    assert.match(field.identityDecision,/m4_b_owner_decisions/);
    assert.match(field.approval,/owner-batch-decision/);
  }
  const mit=enriched.find(i=>i.college==="4");
  assert.ok(mit.metadata.every(f=>!["autonomous_status","minority_status"].includes(f.field)));
  for(const code of ["1303","4967"]) {
    const i=enriched.find(i=>i.college===code);assert.equal(i.district,null);
    assert.ok(i.metadata.every(f=>f.field!=="taluk"));
  }
  const html=render("lang=en&view=college&college=4");
  assert.match(html,/<dt>Autonomous status<\/dt><dd>Not known<\/dd>/);
  assert.match(html,/<dt>Minority status<\/dt><dd>Not known<\/dd>/);
  assert.match(html,/www.annauniv.edu\/www.mitindia.edu/);
  assert.doesNotMatch(html,/href="(?:https?:\/\/)?www.annauniv.edu\/www.mitindia.edu/);
  for(const code of ["1102","1221","1510","1516","2350","4943","5533"]) {
    assert.ok(view.items.filter(i=>i.college===code).every(i=>i.metadata.length===0));
  }
});

test("released copy uses only the nine exact associations; held and unrelated offerings stay independent", () => {
  const linked=view.items.filter(i=>i.profileId);
  assert.equal(linked.length,9);
  const ids=[...new Set(linked.map(i=>i.profileId))];assert.equal(ids.length,6);
  const profiles=ids.map(id=>{
    const copy={ta:"சோதனை அறிமுகம்\nசோதனை பாடங்கள்\nசோதனை சிந்தனை",en:"TEST ONLY introduction\nTEST ONLY subjects\nTEST ONLY reflection"};
    const evidence={url:"https://curriculum.example.org/test-only",locator:"test page",scope:"Test-only scope"};
    return {id,version:"TEST_ONLY",disposition:"APPROVED",copy,evidence,approval:{version:"TEST_ONLY",approved_copy:{...copy},approved_evidence:{...evidence},owner:"test",factual:"test",ta:"test",en:"test",reference:"TEST_ONLY"}};
  });
  const testView=loadApprovedDirectory(undefined,profiles);
  assert.equal(testView.items.filter(i=>i.profile).length,9);
  assert.ok(testView.items.filter(i=>["BY","XC","AT","CM"].includes(i.programme)).every(i=>i.profile===null && i.profileId===null));
  const differentCollege=testView.items.find(i=>i.programme==="CS" && !i.profileId);
  assert.ok(differentCollege);assert.equal(differentCollege.profile,null);
  const branch=renderGovernedPilot(new URLSearchParams("lang=en&view=branch&branch=CS"),undefined,{...testView,items:[differentCollege,...testView.items.filter(i=>i!==differentCollege)]});
  assert.match(branch,/TEST ONLY introduction/);assert.match(branch,/does not establish any selected college/);
  for(const altered of [profiles.map(p=>({...p,disposition:"HOLD"})),profiles.map(p=>({...p,copy:{...p.copy,en:"Changed"}})),[...profiles,...profiles]]) {
    assert.ok(loadApprovedDirectory(undefined,altered).items.every(i=>i.profile===null));
  }
  assert.ok(loadApprovedDirectory().items.every(i=>i.profile===null));
});

test("every owner-preview page returns to the guided journey without passing untrusted state", () => {
  for(const lang of ["ta","en"]) for(const page of ["home","branches","branch&branch=CS","colleges","college&college=4","detail&college=4&programme=AT","compare&pick=1%7ECS&pick=4%7ECS"]) {
    const html=render(`lang=${lang}&view=${page}&returnTo=https://evil.example&marks=200&approve=true`);
    assert.ok(html.includes(`href="/journey?step=awareness&amp;lang=${lang}"`));
    const footer=html.slice(html.indexOf('<footer class="journey-return">'));
    assert.doesNotMatch(footer,/evil.example|marks=|approve=/);
  }
});

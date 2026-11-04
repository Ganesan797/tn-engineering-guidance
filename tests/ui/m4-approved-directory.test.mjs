import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadApprovedDirectory } from "../../src/m4/approved-directory-preview.mjs";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import { APPROVED_FAMILY_MAPPINGS } from "../../src/m4/family-mapping.ts";

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
  assert.ok(view.items.every(x => x.source.year === 2026 && x.source.stream === "GENERAL_ACADEMIC" && x.source.stage === "BEFORE_SPECIAL_RESERVATION_COUNSELLING"));
  assert.equal(view.items.filter(x => x.profile).length, 9);
  assert.deepEqual([...new Set(view.items.filter(x => x.profile).map(x => x.profile.id))].sort(), ["AD","BM","CE","CS","EC","EE"]);
  assert.ok(view.items.every(x => !["1133","1301","1424","2345","2776","3815"].includes(x.college)));
  assert.ok(view.items.every(x => !["AE","AO","BP","DA","CQ","IF","ID","CJ"].includes(x.programme)));
  assert.ok(view.items.some(x => x.programme === "BY") && view.items.some(x => x.programme === "XC"));
  assert.ok(view.items.filter(x => ["1303","4967"].includes(x.college)).every(x => x.district === null));
  assert.ok(view.items.some(x => x.college === "1102") && view.items.filter(x => ["1102","1221","1510","1516","2350","4943","5533"].includes(x.college)).every(x => x.district === null && x.type === null));
  assert.ok(view.items.filter(x => !["1","4","1303","1304","2005","2603","3018","4967"].includes(x.college)).every(x => x.district === null && x.type === null));
  assert.ok(view.items.every(x => !["2332","3555","4911","4927"].includes(x.college)));
});

test("both browse paths, filters, empty states, comparison and bilingual pending copy", () => {
  const home=render("lang=en"); assert.match(home,/No marks are required/);
  const branches=render("lang=en&view=branches"); assert.match(branches,/COMPUTER SCIENCE AND ENGINEERING/);
  assert.match(render("lang=en&view=branch&branch=CS"),/Imagine building a hospital appointment app/);
  assert.match(render("lang=ta&view=branch&branch=CS"),/ஒரு மருத்துவமனை முன்பதிவுச் செயலியை/);
  assert.match(render("lang=en&view=branch&branch=CM"),/explanation.*still under review/i);
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

test("owner exploration bridges study-area orientation and both real-record paths", () => {
  for (const lang of ["ta", "en"]) {
    const home=render(`lang=${lang}`);
    assert.match(home,new RegExp(`/beginner\\?lang=${lang}&amp;section=engineering`));
    assert.match(home,/view=branches/);
    assert.match(home,/view=colleges/);
    const branches=render(`lang=${lang}&view=branches`);
    assert.match(branches,/COMPUTER SCIENCE AND ENGINEERING \(CS\)/);
    assert.match(branches,/aria-label="(?:Breadcrumb|நீங்கள் இருக்கும் வழி)"/);
    const eligibleCodes=new Set(view.items.map(item=>item.programme));
    assert.match(branches,new RegExp(`<p role="status">${eligibleCodes.size} `));
    for(const code of eligibleCodes) assert.ok(branches.includes(`(${code})`),`missing eligible programme ${code}`);
    const branch=render(`lang=${lang}&view=branch&branch=CS`);
    assert.match(branch,/(?:view=colleges&amp;branch=CS|branch=CS&amp;view=colleges)/);
    assert.match(branch,/hospital appointment app|மருத்துவமனை முன்பதிவுச் செயலி/);
    const colleges=render(`lang=${lang}&view=colleges&q=CEG`);
    assert.match(colleges,/CEG Campus/);
    const college=render(`lang=${lang}&view=college&college=1&q=CEG&pick=1%7ECS`);
    assert.match(college,/BIO MEDICAL ENGINEERING \(SS\)/);
    assert.match(college,/(?:view=colleges&amp;q=CEG|q=CEG&amp;view=colleges)/);
    assert.match(college,/pick=1%7ECS/);
    const detail=render(`lang=${lang}&view=detail&college=1&programme=CS&q=CEG&pick=1%7ECS`);
    assert.match(detail,/COMPUTER SCIENCE AND ENGINEERING/);
    assert.match(detail,/(?:view=college&amp;college=1|college=1&amp;view=college)/);
    assert.doesNotMatch(home+branches+branch+colleges+college+detail,/fixture-1|Sample college 1|journey\?step=explore/);
  }
});

test("college groups, distinct counts and compact college detail preserve source limits", () => {
  const all=render("lang=en&view=colleges");
  assert.match(all,/389 colleges · 3128 matching programmes/);
  assert.equal((all.match(/<article class="card result-card">/g) ?? []).length,15);
  assert.equal((all.match(/<h2>University Departments of Anna University, Chennai - CEG Campus<\/h2>/g) ?? []).length,1);
  const detail=render("lang=en&view=college&college=1");
  assert.equal((detail.match(/<h1>University Departments of Anna University, Chennai - CEG Campus<\/h1>/g) ?? []).length,1);
  assert.match(detail,/Listed programmes/);assert.match(detail,/BIO MEDICAL ENGINEERING \(SS\)/);
  assert.match(detail,/does not confirm current availability/);
  const branch=render("lang=en&view=colleges&branch=CS");assert.match(branch,/matching programmes/);assert.match(branch,/COMPUTER SCIENCE AND ENGINEERING \(CS\)/);
});

test("navigation and temporary comparison selections survive pages without publishing held records", () => {
  const q="lang=en&view=colleges&branch=CS&district=CHENNAI&q=university&page=2&pick=1%7ECS&pick=4%7ECS";
  const html=render(q);assert.match(html,/2 selected to compare/);assert.match(html,/Compare selected/);
  assert.match(html,/branch=CS&amp;district=CHENNAI&amp;q=university&amp;page=2/);
  assert.match(html,/pick=1%7ECS&amp;pick=4%7ECS/);
  const detail=render("lang=en&view=detail&college=1&programme=CS&branch=CS&district=CHENNAI&q=university&page=2");
  assert.match(detail,/view=colleges&amp;branch=CS&amp;district=CHENNAI&amp;q=university&amp;page=2|branch=CS&amp;district=CHENNAI&amp;q=university&amp;page=2&amp;view=colleges/);
  const tooMany=render("lang=en&view=colleges&pick=1%7ECS&pick=4%7ECS&pick=1304%7ECS&pick=2603%7EEE");
  assert.match(tooMany,/3 selected to compare/);assert.doesNotMatch(tooMany,/pick=2603%7EEE/);
  const forged=render("lang=en&view=colleges&pick=1133%7ECS&pick=1%7ECS");
  assert.doesNotMatch(forged,/Nellai Nadar|value="1133~CS"/);
});

test("shared-header language switch preserves validated context and three comparison picks", () => {
  const html=render("lang=en&view=detail&college=1&programme=CS&branch=CS&district=CHENNAI&type=UNIVERSITY&q=anna&bq=computer&page=2&pick=1%7ECS&pick=4%7ECS&pick=1304%7ECS&approve=true&returnTo=https%3A%2F%2Fevil.example");
  const switchHref=html.match(/<a lang="ta" href="([^"]+)">தமிழ்<\/a>/)?.[1]?.replaceAll("&amp;","&");
  assert.ok(switchHref);
  const url=new URL(switchHref,"http://local.test");
  assert.equal(url.searchParams.get("lang"),"ta");
  for(const [name,value] of [["view","detail"],["college","1"],["programme","CS"],["branch","CS"],["district","CHENNAI"],["type","UNIVERSITY"],["q","anna"],["bq","computer"],["page","2"]]) assert.equal(url.searchParams.get(name),value);
  assert.deepEqual(url.searchParams.getAll("pick"),["1~CS","4~CS","1304~CS"]);
  assert.equal(url.searchParams.get("approve"),null);assert.equal(url.searchParams.get("returnTo"),null);
});

test("branch context, immediate comparison and recovery stay in real owner-preview URLs", () => {
  const branch=render("lang=en&view=colleges&branch=CM&district=CHENNAI&q=university");
  assert.match(branch,/Selected programme/);
  assert.match(branch,/view=colleges&amp;branch=CM">Clear search and filters/);
  assert.doesNotMatch(branch,/Update comparison selection|type="checkbox"/);
  const college=render("lang=en&view=college&college=1&branch=CM");
  assert.ok(college.indexOf("Your matching programme") < college.indexOf("Other listed programmes"));
  assert.match(college,/Your matching programme<\/h2>.*COMPUTER SCIENCE AND ENGINEERING \(SS\)/s);
  const empty=render("lang=ta&view=colleges&branch=CM&q=NONEXISTENT");
  assert.match(empty,/0 கல்லூரிகள்/);
  assert.match(empty,/தேடலை மாற்றுங்கள் அல்லது வடிகட்டிகளை நீக்குங்கள்/);
  assert.match(empty,/view=colleges&amp;branch=CM/);
  const one=render("lang=en&view=colleges&branch=CM&district=CHENNAI");
  assert.match(one,/1 college/);
  const compare=render("lang=en&view=colleges&pick=1%7ECS&page=2");
  assert.match(compare,/1 selected to compare/);
  assert.match(compare,/<a[^>]*page=3[^>]*pick=1%7ECS[^>]*>Next page/);
});

test("filter reset keeps branch and comparison selections while comparison clearing is separate", () => {
  const html=render("lang=en&view=colleges&branch=CS&district=CHENNAI&type=UNIVERSITY&q=anna&page=2&pick=1%7ECS&pick=4%7ECS&pick=1304%7ECS");
  const reset=html.match(/href="([^"]+)">Clear search and filters<\/a>/)?.[1]?.replaceAll("&amp;","&");
  assert.ok(reset);const resetUrl=new URL(reset,"http://local.test");
  assert.equal(resetUrl.searchParams.get("branch"),"CS");
  assert.deepEqual(resetUrl.searchParams.getAll("pick"),["1~CS","4~CS","1304~CS"]);
  for(const name of ["q","district","type","page"])assert.equal(resetUrl.searchParams.get(name),null);
  const clear=html.match(/href="([^"]+)">Clear comparison selections<\/a>/)?.[1]?.replaceAll("&amp;","&");
  assert.ok(clear);const clearUrl=new URL(clear,"http://local.test");
  assert.equal(clearUrl.searchParams.get("branch"),"CS");assert.equal(clearUrl.searchParams.get("q"),"anna");
  assert.deepEqual(clearUrl.searchParams.getAll("pick"),[]);
});

test("mission paths keep guidance primary and pending content traversable without fixture crossover", () => {
  const home=render("lang=en");
  assert.match(home,/Start with engineering basics/);
  assert.match(home,/Still unsure\? Explore without choosing/);
  assert.match(home,/No marks are required/);
  assert.doesNotMatch(home,/journey\?step=explore|fixture-1/);
  const branch=render("lang=en&view=branch&branch=CM");
  assert.match(branch,/still under review/);
  assert.match(branch,/See 5 listed colleges/);
  assert.match(branch,/Source summary and limits/);
  assert.doesNotMatch(branch,/Example introduction|journey\?step=explore/);
  assert.match(render("lang=en&view=branch&branch=NOT-A-CODE"),/Back to programme names/);
  const college=render("lang=en&view=college&college=1");
  assert.ok(college.indexOf("Listed programmes") < college.indexOf("More college details"));
  assert.match(college,/href="#college-metadata"/);
  assert.doesNotMatch(render("lang=en&view=college&college=1102"),/href="#college-metadata"/);
  const detail=render("lang=en&view=detail&college=1&programme=CM");
  assert.match(detail,/See colleges listing this programme/);
  assert.ok(detail.indexOf("still under review") < detail.indexOf("College at a glance"));
  assert.match(detail,/view=colleges&amp;branch=CM/);
  const comparison=render("lang=en&view=compare&pick=1%7ECM&pick=4%7ECM");
  assert.equal((comparison.match(/<article class="compare-field">/g)??[]).length,2);
  assert.equal((comparison.match(/<details class="card evidence">/g)??[]).length,2);
  assert.match(comparison,/class="compare-grid" data-count="2"/);
  assert.equal((comparison.match(/<details class="compare-more">/g)??[]).length,2);
  assert.match(comparison,/2026 General Academic; before special-reservation counselling/);
  assert.match(comparison,/not a ranking/);
  const three=render("lang=en&view=compare&pick=1%7ECM&pick=4%7ECM&pick=2006%7ECM");
  assert.match(three,/class="compare-grid" data-count="3"/);
  assert.equal((three.match(/<article class="compare-field">/g)??[]).length,3);
});

test("a single matching programme offers comparison without an extra disclosure", () => {
  const html = render("lang=en&view=colleges&branch=CS");
  const firstCard = html.match(/<article class="card result-card">[\s\S]*?<\/article>/)?.[0];
  assert.ok(firstCard);
  assert.match(firstCard, /Add to comparison/);
  assert.doesNotMatch(firstCard, /Choose a programme to compare/);
  const selected = render("lang=en&view=colleges&branch=CS&pick=1%7ECS");
  assert.match(selected, /Selected for comparison/);
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
  assert.doesNotMatch(held.slice(held.indexOf("<main>")), /<header|Nellai Nadar|action primary/);
});


test("aggregate evidence is concise while programme detail retains exact source location", () => {
  const rows = view.items.filter(row => row.college === "1");
  const html = render("lang=en&view=college&college=1");
  const disclosure = html.slice(html.indexOf('<details class="card evidence">'));
  assert.match(disclosure,new RegExp(`Governed scope in this view: ${rows.length} offering records · 1 college · ${new Set(rows.map(row=>row.programme)).size} programme codes`));
  assert.doesNotMatch(disclosure,/Printed \/ PDF page: .*; /);
  const item=view.items.find(row=>row.college==="1"&&row.programme==="CS");assert.ok(item);
  const detail=render("lang=en&view=detail&college=1&programme=CS");
  assert.match(detail,new RegExp(`Printed / PDF page: ${item.source.printed_page} / ${item.source.pdf_page}`));
});


test("additional metadata requires both accepted identity and exact dated field approval", () => {
  const colleges = [...new Map(view.items.map(i=>[i.college,i])).values()];
  const enriched = colleges.filter(i=>i.metadata.length);
  assert.deepEqual(enriched.map(i=>i.college), ["1","4","1303","1304","2005","2603","3018","4967"]);
  assert.equal(enriched.reduce((n,i)=>n+i.metadata.length,0),60);
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
    const copy={ta:"சோதனை அறிமுகம்\nசோதனை பாடங்கள்\nசோதனை செய்முறை\nசோதனை கவனம்\nசோதனை அடுத்து",en:"TEST ONLY introduction\nTEST ONLY subjects\nTEST ONLY practice\nTEST ONLY considerations\nTEST ONLY next action"};
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
  const released=loadApprovedDirectory().items.filter(i=>i.profile);
  assert.equal(released.length,9);
  assert.deepEqual([...new Set(released.map(i=>i.profile.id))].sort(),["AD","BM","CE","CS","EC","EE"]);
});

test("family navigation is closed by default and opens only for an exact approved mapping with released copy", () => {
  assert.deepEqual(APPROVED_FAMILY_MAPPINGS,[]);
  const closed=render("lang=en&view=families");
  assert.match(closed,/Study-area-to-programme links are still in owner review/);
  assert.doesNotMatch(render("lang=en"),/Explore by study area/);
  const exact={family:"C",profileId:"CS",programmeCode:"CS",version:"TEST",disposition:"APPROVED",approval:{version:"TEST",family:"C",profileId:"CS",programmeCode:"CS",owner:"test",reference:"test-only"}};
  const opened=renderGovernedPilot(new URLSearchParams("lang=en&view=families"),undefined,view,[exact]);
  assert.match(opened,/Computing and information/);
  assert.match(opened,/view=family&amp;family=C/);
  const programmes=renderGovernedPilot(new URLSearchParams("lang=en&view=family&family=C"),undefined,view,[exact]);
  assert.match(programmes,/COMPUTER SCIENCE AND ENGINEERING \(CS\)/);
  assert.match(programmes,/Browse all programmes/);
  for(const held of [{...exact,disposition:"HOLD"},{...exact,approval:{...exact.approval,programmeCode:"CM"}},exact]) {
    const registry=held===exact?[exact,{...exact}]:[held];
    assert.match(renderGovernedPilot(new URLSearchParams("lang=en&view=families"),undefined,view,registry),/still in owner review/);
  }
});

test("every owner-preview page returns to the guided journey without passing untrusted state", () => {
  for(const lang of ["ta","en"]) for(const page of ["home","branches","branch&branch=CS","colleges","college&college=4","detail&college=4&programme=AT","compare&pick=1%7ECS&pick=4%7ECS"]) {
    const html=render(`lang=${lang}&view=${page}&returnTo=https://evil.example&marks=200&approve=true`);
    assert.ok(html.includes(`href="/journey?step=awareness&amp;lang=${lang}"`));
    const footer=html.slice(html.indexOf('<footer class="journey-return">'));
    assert.doesNotMatch(footer,/evil.example|marks=|approve=/);
  }
});

test("search supports college acronyms and multi-word tokens naturally", () => {
  const gct = render("lang=en&view=colleges&q=gct");
  assert.match(gct, /Government College of Technology/);
  assert.match(gct, /2005/);

  const cit = render("lang=en&view=colleges&q=cit");
  assert.match(cit, /Coimbatore Institute of Technology|Chennai Institute of Technology/);

  const govtCbe = render("lang=en&view=colleges&q=govt+coimbatore");
  assert.match(govtCbe, /Government College of Technology/);

  const branchCse = render("lang=en&view=branches&bq=cse");
  assert.match(branchCse, /COMPUTER SCIENCE AND ENGINEERING/);
  assert.match(branchCse, /17 matching programmes/);

  const branchMech = render("lang=en&view=branches&bq=mech");
  assert.match(branchMech, /MECHANICAL ENGINEERING/);

  const branchEce = render("lang=en&view=branches&bq=ece");
  assert.match(branchEce, /ELECTRONICS AND COMMUNICATION ENGINEERING/);
});

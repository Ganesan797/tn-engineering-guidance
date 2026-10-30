import test from "node:test";
import assert from "node:assert/strict";
import { GOVERNED_PILOT, buildGovernedPilotView, type PilotInput, type Decision, type PilotField } from "../../src/m4/governed-pilot.ts";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import type { ReviewedBranchCopy } from "../../src/m4/branch-copy.ts";

const accepted = <T>(exact:T):Decision<T> => ({disposition:"APPROVED",reference:"test-owner-record",exact:structuredClone(exact)});
const source={document:"Example listing",url:"https://pilot.example.test/listing",year:2026,stream:"GENERAL_ACADEMIC",stage:"BEFORE_SPECIAL_RESERVATION_COUNSELLING",printed_page:1,pdf_page:1,location_status:"RECORDED" as const};
const unknown = {disposition:"PENDING" as const,reference:null,exact:null};
function fixtures(): PilotInput {
 const colleges=[1,2,3,4].map(n=>{ const identity={code:`sample-${n}`,name:`Sample college ${n}`,source}; const district={value:n===1?"Chennai":"Madurai",source}; const type={value:n===1?"GOVERNMENT":"PRIVATE",source}; return {identity,identityDecision:accepted(identity),district:n===3?null:district,districtDecision:n===3?unknown:accepted(district),type,typeDecision:accepted(type)}; });
 const pairs=colleges.map((c,n)=>{const offering={college:c.identity.code,programme:n===0?"CS":"AD",name:n===0?"COMPUTING":"DATA SCIENCE",source};const link={college:offering.college,programme:offering.programme,profileId:offering.programme};return {offering,offeringDecision:accepted(offering),profileId:offering.programme,linkDecision:accepted(link)};});
 const copy={ta:"தமிழ் அறிமுகம்\nதமிழ் பாடங்கள்\nதமிழ் பயிற்சி",en:"Example introduction\nExample topics\nExample exercise"};
 const evidence={url:"https://curriculum.example.org/source",locator:"page 1",scope:"Example educational scope"};
 const p:ReviewedBranchCopy={id:"CS",version:"v1",disposition:"APPROVED",copy,evidence,approval:{version:"v1",approved_copy:structuredClone(copy),approved_evidence:structuredClone(evidence),owner:"owner",factual:"facts",ta:"ta",en:"en",reference:"test-approval"}};
 return {classification:"TEST_FIXTURE",colleges,pairs,profiles:[p]};
}
const render=(query:string,input=fixtures())=>renderGovernedPilot(new URLSearchParams(query),input);

test("real review cohort is bounded, source-staged and fails closed without offering approval",()=>{
 assert.equal(GOVERNED_PILOT.colleges.length,7);assert.equal(GOVERNED_PILOT.pairs.length,9);
 assert.equal(GOVERNED_PILOT.profiles.length,0);
 const view=buildGovernedPilotView(GOVERNED_PILOT);assert.equal(view.items.length,0);assert.equal(view.excluded,9);
 for(const lang of ["en","ta"]){const html=render(`lang=${lang}&view=colleges`,GOVERNED_PILOT);assert.match(html,/role="status"/);assert.doesNotMatch(html,/Anand Institute|Kancheepuram|Chengalpattu|Tirunelveli|Tenkasi/);}
 assert.deepEqual(GOVERNED_PILOT.colleges.filter(c=>c.districtConflict?.length).map(c=>c.identity.code),["1303","4967"]);
});

test("simulated listing approvals unlock only the nine bounded pairs without releasing profiles or conflicts",()=>{
 const candidate=structuredClone(GOVERNED_PILOT);
 const simulated={...candidate,pairs:candidate.pairs.map(pair=>({...pair,offeringDecision:accepted(pair.offering)}))};
 const view=buildGovernedPilotView(simulated);assert.equal(view.items.length,9);
 assert.ok(view.items.every(i=>i.source.year===2026 && i.source.stage==="BEFORE_SPECIAL_RESERVATION_COUNSELLING" && i.profile===null));
 assert.ok(view.items.filter(i=>["1303","4967"].includes(i.college)).every(i=>i.district===null));
 assert.ok(view.items.every(i=>!["BY","XC","AE","AO","N9"].includes(i.programme)));
 const html=render("lang=en&view=branch&branch=CS",simulated);assert.match(html,/still under review/);assert.doesNotMatch(html,/synthetic-only|sample Computer Science/);
});

test("independent decisions, exact snapshots and source boundaries gate output",()=>{
 const i=fixtures();assert.equal(buildGovernedPilotView(i).items.length,4);
 const o=i.pairs[0];const c=i.colleges[0];
 const variants: PilotInput[]=[
  {...i,colleges:[{...c,identityDecision:unknown},...i.colleges.slice(1)]},
  {...i,pairs:[{...o,offeringDecision:unknown},...i.pairs.slice(1)]},
  {...i,pairs:[{...o,linkDecision:{disposition:"HOLD",reference:null,exact:null}},...i.pairs.slice(1)]},
  {...i,pairs:[{...o,offering:{...o.offering,name:"Changed"}},...i.pairs.slice(1)]},
  {...i,pairs:[{...o,offering:{...o.offering,source:{...source,stage:"OTHER"}}},...i.pairs.slice(1)]},
  {...i,pairs:[{...o,offering:{...o.offering,source:{...source,url:"https://untrusted.example.org/"}}},...i.pairs.slice(1)]},
 ];for(const bad of variants)assert.equal(buildGovernedPilotView(bad).items.length,3);
 assert.throws(()=>buildGovernedPilotView({...i,pairs:[...i.pairs,i.pairs[0]]}),/Duplicate/);
 const altered=structuredClone(GOVERNED_PILOT);const row=altered.pairs[0];const bad={...row.offering,programme:"BY",name:"Changed"};
 assert.equal(buildGovernedPilotView({...altered,pairs:[{...row,offering:bad,offeringDecision:accepted(bad),linkDecision:accepted({college:bad.college,programme:bad.programme,profileId:"CS"})}]}).items.length,0);
});

test("unapproved profiles and unresolved conflicts are never rendered; each field has its own gate",()=>{
 const i=fixtures();const first=i.pairs[0];const held={...i.profiles[0],disposition:"HOLD" as const};
 const html=render("lang=en&view=branch&branch=CS",{...i,profiles:[held]});assert.match(html,/still under review/);assert.doesNotMatch(html,/Example introduction/);
 const changed={...i.profiles[0],evidence:{...i.profiles[0].evidence,scope:"Changed scope"}};
 assert.equal(buildGovernedPilotView({...i,profiles:[changed]}).items[0].profile,null);
 const col=i.colleges[0];const district: PilotField={value:"Hidden conflict",source};
 const conflict={...col,district,districtDecision:accepted(district),districtConflict:[district,{value:"Other",source}]};
 const output=render("lang=en&view=colleges",{...i,colleges:[conflict,...i.colleges.slice(1)]});
 assert.doesNotMatch(output,/Hidden conflict|Other/);assert.match(output,/District: Not known/);
 const strange={value:"UNRECOGNISED",source};
 assert.equal(buildGovernedPilotView({...i,colleges:[{...col,type:strange,typeDecision:accepted(strange)},...i.colleges.slice(1)]}).items[0].type,null);
 const denied={...i,pairs:[{...first,linkDecision:{disposition:"HOLD" as const,reference:null,exact:null}},...i.pairs.slice(1)]};
 assert.doesNotMatch(render("lang=en&view=detail&college=sample-1&programme=CS",denied),/COMPUTING/);
});

test("marks-free browsing, bounded filters, bilingual navigation and transient comparison",()=>{
 const home=render("lang=en");assert.match(home,/No marks are required/);assert.doesNotMatch(home,/name="(?:marks|cutoff|community)"/i);
 const branches=render("lang=en&view=branches");assert.match(branches,/COMPUTING/);assert.match(branches,/Search by name or code/);
 const branch=render("lang=en&view=branch&branch=CS");assert.match(branch,/Example introduction/);assert.match(branch,/does not establish any selected college/);
 const filtered=render("lang=en&view=colleges&district=Chennai");assert.match(filtered,/sample-1/);assert.doesNotMatch(filtered,/sample-2|sample-3/);assert.match(filtered,/Unknown district \/ type values are excluded/);
 const all=render("lang=en&view=colleges");assert.match(all,/sample-3/);assert.match(all,/not saved|not confirmed/);assert.match(all,/view=college&amp;college=sample-1/);
 const collegePage=render("lang=en&view=college&college=sample-1");assert.match(collegePage,/Sample college 1/);assert.match(collegePage,/COMPUTING/);assert.match(collegePage,/view=detail/);
 const compare=render("lang=en&view=compare&pick=sample-1%7ECS&pick=sample-2%7EAD");assert.match(compare,/Sample college 1/);assert.match(compare,/Sample college 2/);assert.match(compare,/not a ranking/);assert.match(compare,/2026 General Academic/);
 for(const q of ["pick=sample-1%7ECS","pick=sample-1%7ECS&pick=sample-1%7ECS","pick=sample-1%7ECS&pick=evil%7EX","pick=sample-1%7ECS&pick=sample-2%7EAD&pick=sample-3%7EAD&pick=sample-4%7EAD"])assert.match(render(`lang=en&view=compare&${q}`),/Choose two or three/);
 const ta=render("lang=ta&view=detail&college=sample-1&programme=CS");assert.match(ta,/ஆதாரம் மற்றும் வரம்பு/);assert.match(ta,/பதிவு செய்யப்பட்டது/);assert.match(ta,/lang=en/);
 assert.doesNotMatch(render("lang=en&view=detail&college=sample-1&programme=CS"),/still under review/);
 assert.match(render("lang=en&view=detail&college=sample-1&programme=CS"),/class="action primary"[^>]+view=branch/);
 assert.match(render("lang=en&view=detail&college=sample-1&programme=CS"),/does not confirm current availability/);
});

test("untrusted values are escaped and approval parameters cannot publish candidates",()=>{
 const i=fixtures(), c=i.colleges[0];const identity={...c.identity,name:"<script>alert(1)</script>"};
 const safe=render("lang=en&view=colleges",{...i,colleges:[{...c,identity,identityDecision:accepted(identity)},...i.colleges.slice(1)]});
 assert.doesNotMatch(safe,/<script>/);assert.match(safe,/&lt;script&gt;/);
 const out=render("lang=en&view=colleges&approve=true&owner=true",GOVERNED_PILOT);assert.doesNotMatch(out,/Easwari/);
 const real=structuredClone(GOVERNED_PILOT), approvedPair={...real.pairs[0],offeringDecision:accepted(real.pairs[0].offering)};
 const alteredIdentity={...real.colleges[0],identity:{...real.colleges[0].identity,name:"Other college"}};
 assert.equal(buildGovernedPilotView({...real,colleges:[alteredIdentity,...real.colleges.slice(1)],pairs:[approvedPair]}).items.length,0);
});
import { spawn } from "node:child_process";
import { once } from "node:events";

async function startPreview(enabled: boolean) {
 const child=spawn(process.execPath,["--experimental-strip-types","scripts/mvp-server.mjs"],{env:{...process.env,PORT:"0",M4_OWNER_REVIEW:enabled?"1":"0"},stdio:["ignore","pipe","pipe"],windowsHide:true});
 let stderr="";child.stderr.on("data",chunk=>stderr+=chunk);
 const port=await new Promise<number>((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error(`Preview did not start: ${stderr}`)),10000);
  child.once("error",error=>{clearTimeout(timer);reject(error)});
  child.once("exit",code=>{clearTimeout(timer);reject(new Error(`Preview exited ${code}: ${stderr}`))});
  child.stdout.on("data",chunk=>{const match=chunk.toString().match(/127\.0\.0\.1:(\d+)/);if(match){clearTimeout(timer);resolve(Number(match[1]));}});
 });
 return {child,port};
}
test("real pilot review route is disabled by default and only enabled by local process configuration",async()=>{
 for(const enabled of [false,true]){
  const {child,port}=await startPreview(enabled);
  try{
   const response=await fetch(`http://127.0.0.1:${port}/internal/m4-pilot?lang=en&view=colleges&owner=true&approve=true`);
   assert.equal(response.status,enabled?200:404);
   const body=await response.text();
   if(enabled){assert.match(body,/Internal owner review only/);assert.match(body,/COMPUTER SCIENCE AND ENGINEERING/);assert.doesNotMatch(body,/Nellai Nadar/);
    const journey=await fetch(`http://127.0.0.1:${port}/journey?step=awareness&lang=en`);
    assert.equal(journey.status,200);assert.doesNotMatch(await journey.text(),/\/internal\/m4-pilot/);}
   else assert.doesNotMatch(body,/Anand Institute|Easwari|COMPUTER SCIENCE AND ENGINEERING/);
  }finally{child.kill();await once(child,"exit");}
 }
});

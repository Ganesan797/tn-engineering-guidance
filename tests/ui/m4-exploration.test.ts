import { COLLEGE_TYPES, collegeType, BRANCH_READING } from "../../src/m4/exploration-context.ts";
import { selectBranchCopy, isReleasedBranchCopy, type ReviewedBranchCopy } from "../../src/m4/branch-copy.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { renderM4Exploration } from "../../src/ui/m4-exploration.ts";
import { REVIEW_FIXTURES } from "../../src/m4/review-fixtures.ts";

const page = (query = "lang=en") => renderM4Exploration(new URLSearchParams(query));
function follow(html: string, label: string): string {
  const links = [...html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  const chosen = links.find(m => m[2].replace(/<[^>]+>/g, "").replaceAll("&#39;", "'").includes(label));
  assert.ok(chosen, `Missing link: ${label}`);
  const url = new URL(chosen[1].replaceAll("&amp;", "&"), "http://localhost");
  assert.equal(url.pathname, "/journey");
  return renderM4Exploration(url.searchParams);
}

test("branch-first journey walks from family to branch, matching colleges and evidence", () => {
  const start = page();
  for (const label of ["Computing", "Electrical and electronics", "Mechanical and production", "Civil and built environment", "Chemical, biological and food-related fields", "Environment, energy, agriculture, air and sea"]) assert.ok(start.includes(label), label);
  assert.doesNotMatch(start, /Sample College 1/);
  const family = follow(start, "Computing");
  assert.match(family, /Computer Science and Engineering/);
  assert.doesNotMatch(family, /Sample College 1/);
  const branch = follow(family, "Computer Science and Engineering");
  assert.match(branch, /data structures.*databases.*operating systems/);
  assert.match(branch, /software development, software testing/);
  const choices = follow(branch, "See sample colleges for this branch");
  assert.match(choices, /Sample College 1/);
  const collegePage = follow(choices, "Sample College 1");
  const detail = follow(collegePage, "See listing evidence and next step");
  assert.match(detail, /Computer Science and Engineering/);
  assert.match(detail, /<details>/);
  assert.match(detail, /2026/);
  assert.match(detail, /not an official source/);
  assert.match(detail, /District: not known/);
  assert.match(follow(follow(detail, "Back to this college's programmes"), "Change college"), /Choose a sample college/);
  assert.match(follow(branch, "Change branch"), /Choose a branch/);
});

test("college-first journey, language round trip and change navigation retain selection", () => {
  const colleges = follow(page(), "Browse by college");
  const college = follow(colleges, "Sample College 3");
  assert.match(college, /Artificial Intelligence and Data Science/);
  const detail = follow(college, "See listing evidence and next step");
  assert.match(detail, /Sample College 3/);
  assert.match(detail, /District: not known/);
  assert.doesNotMatch(detail, /Fixture district A|Fixture district B/);
  const tamil = follow(detail, "தமிழ்");
  assert.match(tamil, /மாதிரி கல்லூரி 3/);
  assert.match(tamil, /செயற்கை நுண்ணறிவு மற்றும் தரவு அறிவியல்/);
  const again = follow(tamil, "English");
  assert.match(again, /Sample College 3/);
  assert.match(again, /Artificial Intelligence and Data Science/);
  assert.match(follow(again, "Back to this college's programmes"), /Programmes in this sample listing/);
  assert.match(follow(college, "Change college"), /Choose a sample college/);
});

test("not sure, show all and every family retain a useful next step", () => {
  for (const label of ["Not sure", "Show all branches"]) assert.match(follow(page(), label), /All sample branches/);
  const empty = follow(page(), "Mechanical and production");
  assert.match(empty, /Mechanical and manufacturing/);
  assert.doesNotMatch(empty, /no example to show/);
  assert.match(follow(empty, "Show all branches"), /Computer Science and Engineering/);
});

test("held and pending content stay out, synthetic boundary and escaping hold", () => {
  const input = structuredClone(REVIEW_FIXTURES);
  const pending = { ...input.profiles[0], status: "PENDING" as const, copy: { ta: "ரகசிய வரைவு", en: "SECRET UNAPPROVED TEXT" } };
  const output = renderM4Exploration(new URLSearchParams("view=branch&branch=CS&lang=en"), { ...input, profiles: [pending, ...input.profiles.slice(1)] });
  assert.doesNotMatch(output, /SECRET UNAPPROVED TEXT|ரகசிய வரைவு/);
  for (const query of ["lang=en", "lang=en&view=college&college=fixture-1", "lang=en&view=detail&college=fixture-1&programme=BY", "lang=en&view=detail&college=fixture-1&programme=XC", "lang=en&view=detail&college=fixture-2&programme=AE"]) {
    const html = page(query);
    assert.match(html, /Synthetic review example/);
    assert.doesNotMatch(html, /IDENTITY_HOLD|PROFILE_HOLD|GENERAL_ACADEMIC|PRE_SPECIAL_RESERVATION|synthetic-review-only|Synthetic programme BY|BY\/XC|AE\/N9/);
  }
  assert.throws(() => renderM4Exploration(new URLSearchParams(), { ...input, fixture_only: false } as never), /Synthetic fixture/);
  const badSource = { ...input.offerings[0].source!, url: "https://official.example.org/source" };
  const unsafe = renderM4Exploration(new URLSearchParams("view=branch&branch=CS&lang=en"), { ...input, offerings: [{ ...input.offerings[0], source: badSource }] });
  assert.doesNotMatch(unsafe, /software development, software testing/);
  const hostile = { ...input.colleges[0], identity: { ...input.colleges[0].identity, status: "APPROVED" as const, value: "<script>alert(1)</script>", source: input.offerings[0].source!, review_reference: "fixture" } };
  const safe = renderM4Exploration(new URLSearchParams("view=colleges&lang=en"), { ...input, colleges: [hostile] });
  assert.doesNotMatch(safe, /<script>alert/);
  assert.match(safe, /&lt;script&gt;/);
});

 test("all six families traverse bilingual explanations, college programmes, evidence and next action", () => {
  const examples = [["computing","CS","1"],["electrical","EC","4"],["mechanical","SYN-MECH","8"],["civil","CE","6"],["chemical","SYN-CHEM","9"],["environment","SYN-ENV","10"]];
  for (const lang of ["ta", "en"]) for (const [family,branch,college] of examples) {
    const familyPage = page(`lang=${lang}&view=branches&family=${family}`);
    assert.ok(familyPage.includes(`branch=${branch}`));
    const explanation = page(`lang=${lang}&view=branch&family=${family}&branch=${branch}`);
    assert.match(explanation, /<h2>/);
    assert.doesNotMatch(explanation, /no example to show/);
    const choices = page(`lang=${lang}&view=colleges&branch=${branch}`);
    assert.ok(choices.includes(`college=fixture-${college}`));
    const detail = page(`lang=${lang}&view=detail&college=fixture-${college}&programme=${branch}`);
    assert.match(detail, /<details>/);
    assert.match(detail, /m4.example.test/);
    assert.ok(detail.includes(lang === "ta" ? "அடுத்து என்ன செய்யலாம்" : "What can you do next"));
    const collegePage = page(`lang=${lang}&view=college&college=fixture-${college}`);
    assert.ok(collegePage.includes(`programme=${branch}`));
  }
 });

test("real educational copy needs exact version, owner, factual and both language approval independently", () => {
  const copy = {ta:"அறிமுகம்\nபாடங்கள்\nபயிற்சி",en:"Introduction\nSubjects\nPractice"};
  const candidate: ReviewedBranchCopy = {id:"CS",version:"review-1",disposition:"HOLD",copy,
    evidence:{url:"https://curriculum.example.org/cs",locator:"PDF pp3–4",scope:"Named institution and regulation only"},approval:null};
  assert.equal(selectBranchCopy("CS",copy).kind,"SYNTHETIC_ILLUSTRATION");
  for (const disposition of ["HOLD","FIX"] as const) assert.equal(selectBranchCopy("CS",copy,[{...candidate,disposition}]).kind,"SYNTHETIC_ILLUSTRATION");
  const released: ReviewedBranchCopy = {...candidate,disposition:"APPROVED",approval:{version:"review-1",approved_copy:copy,owner:"test owner",factual:"test factual",ta:"test Tamil",en:"test English",reference:"test-only-approval"}};
  assert.equal(isReleasedBranchCopy(released),true);
  assert.equal(selectBranchCopy("CS",copy,[released]).kind,"REVIEWED_EDUCATIONAL");
  for (const key of ["owner","factual","ta","en","reference","version"] as const) assert.equal(isReleasedBranchCopy({...released,approval:{...released.approval!,[key]:""}}),false,key);
  assert.equal(isReleasedBranchCopy({...released,copy:{...copy,en:"Changed\nSubjects\nPractice"}}),false);
  assert.equal(isReleasedBranchCopy({...released,evidence:{...released.evidence,url:"https://source.example.test"}}),false);
  assert.equal(selectBranchCopy("CS",copy,[released,released]).kind,"SYNTHETIC_ILLUSTRATION");
  assert.equal(selectBranchCopy("AD",copy,[released]).kind,"SYNTHETIC_ILLUSTRATION");
  assert.doesNotMatch(page("lang=en&view=branch&branch=CS&owner=true&preview=true"),/Reviewed educational explanation/);
});

test("both languages exclude held identities on forged routes and preserve conflicting districts", () => {
 for (const lang of ["ta","en"]) {
  for (const [college,code] of [["fixture-1","BY"],["fixture-1","XC"],["fixture-2","AE"],["fixture-2","N9"]]) {
   const html=page(`lang=${lang}&view=detail&college=${college}&programme=${code}`);
   assert.doesNotMatch(html,/<details>/);
  }
  for (const college of ["fixture-3","fixture-7"]) {
   const html=page(`lang=${lang}&view=detail&college=${college}&programme=AD`);
   assert.doesNotMatch(html,/Fixture district A|Fixture district B/);
   assert.ok(html.includes(lang === "ta" ? "தெரியவில்லை" : "not known"));
  }
 }
});

test("grouped college browsing shows courses and retains type through language and back navigation", () => {
 const all=page("lang=en&view=colleges");
 for(const text of ["Government colleges", "Government-aided colleges", "Private / self-financing colleges", "Type not yet confirmed", "Courses shown in this sample"]) assert.ok(all.includes(text),text);
 const privatePage=follow(all,"Private / self-financing colleges");
 assert.match(privatePage,/Sample College 3/);
 assert.doesNotMatch(privatePage,/Sample College 1<|Sample College 2</);
 const school=follow(privatePage,"Sample College 3");
 assert.match(school,/Artificial Intelligence and Data Science/);
 assert.match(school,/Computer Science and Engineering/);
 const explanation=follow(school,"What would I learn in this course?");
 assert.match(explanation,/fictional library/);
 assert.match(explanation,/Read more: official curriculum/);
 const returned=follow(explanation,"Back to this college's programmes");
 const detail=follow(returned,"See listing evidence and next step");
 const tamil=follow(detail,"தமிழ்");
 assert.ok(tamil.includes("type=private"));
 assert.ok(tamil.includes("தனியார் / சுயநிதிக் கல்லூரிகள்"));
 const back=follow(follow(tamil,"English"),"Back to this college's programmes");
 assert.ok(follow(back,"Change college").includes("type=private"));
 assert.doesNotMatch(all,/Synthetic programme BY|Synthetic programme XC|Synthetic programme AE/);
});

test("management categories never infer missing, conflicting, pending or unrecognised classifications", () => {
 for (const type of COLLEGE_TYPES.filter(t=>t.value)) assert.equal(collegeType({management:{status:"APPROVED",value:type.value,source:REVIEW_FIXTURES.offerings[0].source!,review_reference:"fixture"}}).id,type.id);
 const base=structuredClone(REVIEW_FIXTURES);
 for(const management of [{status:"UNKNOWN",value:null},{status:"NEEDS_REVIEW",value:null},{status:"SOURCE_CONFLICT",value:null,candidates:[]},{status:"APPROVED",value:"UNRECOGNISED",source:base.offerings[0].source!,review_reference:"fixture"}]) {
  assert.equal(collegeType({management} as never).id,"unknown");
 }
 const unapproved={...base.colleges[0],management:{status:"APPROVED" as const,value:"GOVERNMENT",source:base.offerings[0].source!,review_reference:""}};
 const html=renderM4Exploration(new URLSearchParams("lang=en&view=colleges&type=unknown"),{...base,colleges:[unapproved]});
 assert.match(html,/Sample College 1/);
 assert.match(html,/Type not yet confirmed/);
});

test("all nine bilingual explanations retain substantive content and scoped official reading", () => {
 for(const profile of REVIEW_FIXTURES.profiles) for(const lang of ["ta","en"] as const) {
  const html=page(`view=branch&branch=${profile.id}&lang=${lang}`);
  const lines=profile.copy[lang].split("\n");
  assert.equal(lines.length,3);
  assert.ok(lines.every(line=>line.length>100),profile.id+lang);
  assert.ok(html.includes(BRANCH_READING[profile.id].url));
  assert.ok(html.includes(lang==="en"?"non-autonomous affiliated institutions":"தன்னாட்சி பெறாத"));
  assert.ok(html.includes(lang==="en"?"Illustrative copy only":"கற்பனை விளக்கம் மட்டும்"));
  assert.doesNotMatch(html,/Reviewed educational explanation/);
 }
});

test("CSE gives bilingual decision support while staying inside the fixture and content approval gates", () => {
  for(const lang of ["ta","en"]) {
    const html=page(`view=branch&branch=CS&lang=${lang}`);
    for (const term of lang==="ta" ? ["இந்தப் படிப்பு எதைப் பற்றியது?","தரவுக் கட்டமைப்புகள்","தரவுத்தளங்கள்","மென்பொருள் சோதனை","இயந்திரக் கற்றல்","பாடத்திட்டத்தில் ஒப்பிடுங்கள்"] : ["What is this course about?","data structures","databases","software testing","AI and Data Science","Compare the actual subjects"]) assert.ok(html.includes(term),term);
    assert.match(html, /branch=AD/);
    assert.match(html, /branch=CS/);
    assert.ok(html.includes(lang==="ta" ? "கற்பனை விளக்கம் மட்டும்" : "Illustrative copy only"));
  }
  const ta=page("view=branch&branch=CS&lang=ta");
  const switched=follow(ta,"English");
  assert.match(switched,/What is this course about/);
  assert.match(follow(switched,"Explore AI and Data Science too"),/Artificial Intelligence and Data Science/);
  const input=structuredClone(REVIEW_FIXTURES);
  const held={...input.profiles[0],status:"HOLD" as const};
  const output=renderM4Exploration(new URLSearchParams("view=branch&branch=CS&lang=en"),{...input,profiles:[held,...input.profiles.slice(1)]});
  assert.doesNotMatch(output,/software development, software testing/);
});

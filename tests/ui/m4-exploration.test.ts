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
  assert.match(branch, /Sample subjects: programming/);
  assert.match(branch, /Sample practice:/);
  const choices = follow(branch, "See sample colleges for this branch");
  assert.match(choices, /Sample College 1/);
  const detail = follow(choices, "Sample College 1");
  assert.match(detail, /Computer Science and Engineering/);
  assert.match(detail, /<details>/);
  assert.match(detail, /2026/);
  assert.match(detail, /not an official source/);
  assert.match(detail, /District: not known/);
  assert.match(follow(detail, "Change sample college"), /Choose a sample college/);
  assert.match(follow(branch, "Change branch"), /Choose a branch/);
});

test("college-first journey, language round trip and change navigation retain selection", () => {
  const colleges = follow(page(), "Browse by college");
  const college = follow(colleges, "Sample College 3");
  assert.match(college, /Artificial Intelligence and Data Science/);
  const detail = follow(college, "Artificial Intelligence and Data Science");
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

test("not sure, show all and empty families retain a useful next step", () => {
  for (const label of ["Not sure", "Show all branches"]) assert.match(follow(page(), label), /All sample branches/);
  const empty = follow(page(), "Mechanical and production");
  assert.match(empty, /no example to show/);
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
  assert.doesNotMatch(unsafe, /Sample subjects: programming/);
  const hostile = { ...input.colleges[0], identity: { ...input.colleges[0].identity, status: "APPROVED" as const, value: "<script>alert(1)</script>", source: input.offerings[0].source!, review_reference: "fixture" } };
  const safe = renderM4Exploration(new URLSearchParams("view=colleges&lang=en"), { ...input, colleges: [hostile] });
  assert.doesNotMatch(safe, /<script>alert/);
  assert.match(safe, /&lt;script&gt;/);
});

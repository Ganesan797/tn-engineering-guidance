import test from "node:test";
import assert from "node:assert/strict";
import { renderM4Exploration } from "../../src/ui/m4-exploration.ts";
import { REVIEW_FIXTURES } from "../../src/m4/review-fixtures.ts";

const render = (query: string) => renderM4Exploration(new URLSearchParams(query));
test("branch-first filters linked offerings and college-first retains held listings without copy", () => {
  const branch = render("lang=en&branch=CS");
  assert.match(branch,/Synthetic College 1 · Synthetic programme CS/);
  assert.doesNotMatch(branch,/Synthetic programme BY|Synthetic programme AE/);
  const college = render("lang=en&college=fixture-1");
  assert.match(college,/Synthetic programme BY/);
  assert.match(college,/Mapping held/);
  assert.match(college,/programme=XC/);
});
test("detail preserves scope, unknown conflict and language selection", () => {
  const detail = render("lang=en&college=fixture-3&programme=AD");
  for (const text of ["UNKNOWN — source conflict","GENERAL_ACADEMIC","PRE_SPECIAL_RESERVATION","2026","Printed / PDF page","1 / 2","RECORDED","What next?","https://m4.example.test/listing"]) assert.ok(detail.includes(text),text);
  assert.match(detail,/college=fixture-3&amp;programme=AD&amp;step=explore/);
  const tamil = render("college=fixture-3&programme=AD");
  assert.match(tamil,/<html lang="ta">/);
  assert.match(tamil,/சான்றும் வரம்பும்/);
  assert.doesNotMatch(detail,/Fixture district A|Fixture district B/);
});
test("empty selections, escaping and fail-closed fixture boundary", () => {
  assert.match(render("lang=en&branch=AE"),/No approved fixture listing/);
  assert.match(render("lang=en"),/Show all/);
  assert.match(render("lang=en"),/Not sure/);
  assert.throws(()=>renderM4Exploration(new URLSearchParams(),{...REVIEW_FIXTURES,fixture_only:false} as never),/Synthetic fixture/);
  const bad = structuredClone(REVIEW_FIXTURES);
  const source = {...bad.offerings[0].source!,url:"https://official.example.org/source"};
  assert.doesNotMatch(renderM4Exploration(new URLSearchParams("lang=en"),{...bad,offerings:[{...bad.offerings[0],source}]}),/Synthetic programme CS/);
  const hostile = {...bad.colleges[0],identity:{...bad.colleges[0].identity,status:"APPROVED" as const,value:'<script>alert(1)</script>',source:bad.offerings[0].source!,review_reference:"fixture"}};
  assert.doesNotMatch(renderM4Exploration(new URLSearchParams(),{...bad,colleges:[hostile]}),/<script>/);
});

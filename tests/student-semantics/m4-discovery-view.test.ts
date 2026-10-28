import assert from "node:assert/strict";
import test from "node:test";
import { buildDiscoveryFixtureView, type DiscoveryFixtureInput, type DiscoverySource } from "../../src/m4/discovery-view.ts";

// Entirely synthetic fixtures: no college, programme, profile, or source is a governed record.
const source: DiscoverySource = { document: "Fixture source", url: "https://example.test/source", year: 2026,
  stream: "GENERAL_ACADEMIC", stage: "PRE_SPECIAL_RESERVATION", printed_page: 2, pdf_page: 3, location_status: "RECORDED" };
const approved = <T>(value: T) => ({ status: "APPROVED" as const, value, source, review_reference: "fixture-review" });
const unknown = { status: "UNKNOWN" as const, value: null };
const input: DiscoveryFixtureInput = {
  fixture_only: true,
  colleges: [{ code: "fixture-college", identity: approved("Example College"), district: { status: "SOURCE_CONFLICT", value: null,
    candidates: [{ value: "First district", source }, { value: "Second district", source }] }, management: unknown, autonomy: approved(false), minority: unknown }],
  offerings: [
    { college_code: "fixture-college", programme_code: "EX", programme_name: "Example programme", listing_status: "LISTED_IN_SOURCE_YEAR", review_status: "APPROVED", review_reference: "fixture-offering-review", source,
      link: { status: "APPROVED_EXACT", profile_id: "example-profile", review_reference: "fixture-link-review" } },
    { college_code: "fixture-college", programme_code: "VX", programme_name: "Example programme (variant)", listing_status: "LISTED_IN_SOURCE_YEAR", review_status: "APPROVED", review_reference: "fixture-offering-review", source,
      link: { status: "IDENTITY_HOLD", profile_id: null } },
  ],
  profiles: [{ id: "example-profile", status: "PENDING", review: { factual: null, ta: null, en: null }, source,
    source_scope: "Example curriculum only", copy: { ta: "வரைவு உரை", en: "Unreviewed draft text" } }],
};

test("source listing stays separate from approval, conflicts, and current availability", () => {
  const before = structuredClone(input);
  const view = buildDiscoveryFixtureView(input);
  assert.deepEqual(input, before);
  assert.equal(view.coverage, "PARTIAL");
  assert.equal(view.ordering, "SOURCE_ORDER");
  assert.equal(view.items.length, 2);
  assert.equal(view.items[0].offering.source.stage, "PRE_SPECIAL_RESERVATION");
  assert.equal(view.items[0].offering.source.location_status, "RECORDED");
  assert.equal(view.items[0].college.autonomy.status, "APPROVED");
  assert.equal(view.items[0].college.autonomy.value, false);
  assert.equal(view.items[0].college.district.status, "SOURCE_CONFLICT");
  assert.equal(view.items[0].college.district.value, null);
  assert.equal(view.items[0].profile.content, null);
  assert.equal(view.items[1].offering.programme_name, "Example programme (variant)");
  assert.equal(view.items[1].profile.link_status, "IDENTITY_HOLD");
  assert.doesNotMatch(JSON.stringify(view), /Unreviewed draft text|வரைவு உரை|current_vacancy|eligibility|cutoff/i);
});

test("profile wording appears only with an approved link, source, and all three reviews", () => {
  const ready = structuredClone(input);
  const profile = { ...ready.profiles[0], status: "APPROVED" as const, review: { factual: "fact-review", ta: "tamil-review", en: "english-review" }, copy: { ta: "மதிப்பாய்வு செய்யப்பட்ட எடுத்துக்காட்டு", en: "Reviewed fixture text" } };
  const view = buildDiscoveryFixtureView({ ...ready, profiles: [profile] });
  assert.equal(view.items[0].profile.content?.copy.en, "Reviewed fixture text");
  assert.equal(view.items[0].profile.content?.source_scope, "Example curriculum only");
  assert.equal(view.items[1].profile.content, null);
  const variant = { ...ready.offerings[1], link: { status: "APPROVED_VARIANT" as const, profile_id: profile.id, review_reference: "variant-review" } };
  const variantView = buildDiscoveryFixtureView({ ...ready, offerings: [variant], profiles: [profile] });
  assert.equal(variantView.items[0].offering.programme_code, "VX");
  assert.equal(variantView.items[0].offering.programme_name, "Example programme (variant)");
  assert.equal(variantView.items[0].profile.link_status, "APPROVED_VARIANT");
  for (const incomplete of [{ ...profile, review: { ...profile.review, ta: null } }, { ...profile, source: null }, { ...profile, source_scope: "" }]) {
    assert.equal(buildDiscoveryFixtureView({ ...ready, profiles: [incomplete] }).items[0].profile.content, null);
  }
});

test("missing source stage, unapproved identity, and bad field evidence fail closed", () => {
  const missingStage = { ...input.offerings[0], source: { ...source, stage: null } };
  assert.equal(buildDiscoveryFixtureView({ ...input, offerings: [missingStage] }).items.length, 0);
  const pendingOffering = { ...input.offerings[0], review_status: "PENDING" as const };
  assert.equal(buildDiscoveryFixtureView({ ...input, offerings: [pendingOffering] }).items.length, 0);
  const unlocated = { ...input.offerings[0], source: { ...source, printed_page: null, pdf_page: null, location_status: "UNRESOLVED" as const } };
  assert.equal(buildDiscoveryFixtureView({ ...input, offerings: [unlocated] }).items.length, 0);
  const pendingCollege = { ...input.colleges[0], identity: { status: "NEEDS_REVIEW" as const, value: null } };
  const pendingView = buildDiscoveryFixtureView({ ...input, colleges: [pendingCollege] });
  assert.equal(pendingView.items.length, 0);
  assert.equal(pendingView.excluded_unverified, 2);
  assert.equal(pendingView.next_action, "BROWSE_ALL_OR_CHECK_OFFICIAL");
  const badAutonomy = { ...input.colleges[0], autonomy: { ...approved(false), review_reference: "" } };
  assert.deepEqual(buildDiscoveryFixtureView({ ...input, colleges: [badAutonomy] }).items[0].college.autonomy, { status: "NEEDS_REVIEW", value: null });
});

test("explicit branch or college selection preserves partial coverage and held variants", () => {
  const byCollege = buildDiscoveryFixtureView(input, { kind: "COLLEGE", code: "fixture-college" });
  assert.equal(byCollege.items.length, 2);
  const byProfile = buildDiscoveryFixtureView(input, { kind: "PROFILE", id: "example-profile" });
  assert.equal(byProfile.items.length, 1);
  assert.equal(byProfile.excluded_unlinked_for_profile, 1);
  const empty = buildDiscoveryFixtureView(input, { kind: "COLLEGE", code: "other" });
  assert.equal(empty.items.length, 0);
  assert.equal(empty.coverage, "PARTIAL");
  assert.equal(empty.next_action, "BROWSE_ALL_OR_CHECK_OFFICIAL");
  assert.throws(() => buildDiscoveryFixtureView({ ...input, offerings: [input.offerings[0], input.offerings[0]] }), /duplicate/);
});


test("synthetic fixture outputs are marked and non-fixture sources fail closed", () => {
  const view = buildDiscoveryFixtureView(input);
  assert.equal(view.data_classification, "SYNTHETIC_FIXTURE_ONLY");
  assert.ok(view.items.every(item => item.data_classification === "SYNTHETIC_FIXTURE_ONLY"));
  const realSource = { ...source, url: "https://www.tneaonline.org/" };
  const offering = { ...input.offerings[0], source: realSource };
  assert.equal(buildDiscoveryFixtureView({ ...input, offerings: [offering] }).items.length, 0);
  const identity = { ...input.colleges[0], identity: { ...approved("Example College"), source: realSource } };
  assert.equal(buildDiscoveryFixtureView({ ...input, colleges: [identity] }).items.length, 0);
  assert.throws(() => buildDiscoveryFixtureView({ ...input, fixture_only: false } as unknown as DiscoveryFixtureInput), /Synthetic fixture input required/);
});

import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateBranchApproval,
  isReleasedBranchCopy,
  APPROVED_BRANCH_COPY,
  SCOPE_HELD_CODES,
  EVIDENCE_HELD_CODES,
  IDENTITY_HELD_CODES,
  DELIVERY_VARIANT_HELD_CODES,
  KNOWN_OWNER_APPROVED_CODES,
  READY_FOR_OWNER_REVIEW_CODES,
} from "../../src/m4/branch-copy.ts";
import { loadApprovedDirectory } from "../../src/m4/approved-directory-preview.mjs";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import { renderM4Exploration } from "../../src/ui/m4-exploration.ts";
import { buildReleasedFamilies, APPROVED_FAMILY_MAPPINGS } from "../../src/m4/family-mapping.ts";

const view = loadApprovedDirectory();
const renderPilot = (query: string) => renderGovernedPilot(new URLSearchParams(query), undefined, view);
const renderExplore = (query: string) => renderM4Exploration(new URLSearchParams(query));

test("approval gate distinguishes the five orthogonal dimensions and required hold states", () => {
  // 1. Confirmed owner-approved set: exactly 41
  assert.equal(KNOWN_OWNER_APPROVED_CODES.size, 41);
  for (const id of ["CS", "AD", "BM", "CE", "EC", "EE"]) {
    const profile = APPROVED_BRANCH_COPY.find(p => p.id === id);
    assert.ok(profile, `Missing approved profile for ${id}`);
    const status = evaluateBranchApproval(id, profile);
    assert.equal(status.ownerApproved, true, `${id} ownerApproved`);
    assert.equal(status.humanTamilApproved, true, `${id} humanTamilApproved`);
    assert.equal(status.factualReviewApproved, true, `${id} factualReviewApproved`);
    assert.equal(status.profileIdentityApproved, true, `${id} profileIdentityApproved`);
    assert.equal(status.displayApproved, true, `${id} displayApproved`);
    assert.equal(status.holdReason, null, `${id} holdReason`);
    assert.equal(isReleasedBranchCopy(profile), true, `${id} isReleasedBranchCopy`);
  }

  // 2. Explicit Scope Holds: exactly 6
  assert.equal(SCOPE_HELD_CODES.size, 6);
  for (const id of SCOPE_HELD_CODES) {
    const status = evaluateBranchApproval(id, null);
    assert.equal(status.displayApproved, false, `${id} must not be displayApproved`);
    assert.equal(status.holdReason, "EXPLICIT_SCOPE_HOLD", `${id} holdReason`);
  }

  // 3. Evidence Holds: 5 codes
  assert.equal(EVIDENCE_HELD_CODES.size, 5);
  for (const id of EVIDENCE_HELD_CODES) {
    const status = evaluateBranchApproval(id, null);
    assert.equal(status.displayApproved, false, `${id} must not be displayApproved`);
    assert.equal(status.holdReason, "EVIDENCE_HOLD", `${id} holdReason`);
  }

  // 4. Educational Profile Identity Holds: exactly 38 base cases
  assert.equal(IDENTITY_HELD_CODES.size, 38);
  for (const id of IDENTITY_HELD_CODES) {
    const status = evaluateBranchApproval(id, null);
    assert.equal(status.displayApproved, false, `${id} must not be displayApproved`);
    assert.equal(status.holdReason, "IDENTITY_HOLD", `${id} holdReason`);
  }

  // 5. Delivery Variant Holds: exactly 26 offering subcase codes
  assert.equal(DELIVERY_VARIANT_HELD_CODES.size, 26);
  for (const id of DELIVERY_VARIANT_HELD_CODES) {
    const status = evaluateBranchApproval(id, null);
    assert.equal(status.displayApproved, false, `${id} must not be displayApproved`);
    assert.equal(status.holdReason, "DELIVERY_VARIANT_HOLD", `${id} holdReason`);
  }

  // 6. Ready for Owner Review: exactly 0 (all 35 candidate profiles approved under Option A)
  assert.equal(READY_FOR_OWNER_REVIEW_CODES.size, 0);

  // 7. Unknown / Unapproved code
  const unknown = evaluateBranchApproval("NONEXISTENT_BRANCH", null);
  assert.equal(unknown.displayApproved, false);
  assert.equal(unknown.holdReason, "UNAPPROVED");
});

test("complete 116-code census accounting: zero omission, zero overlap, all 26 variants fail-closed", () => {
  const crosswalkPath = new URL("../../experiments/m4-governance-census/code-crosswalk.csv", import.meta.url);
  const rows = readFileSync(crosswalkPath, "utf8").trim().split(/\r?\n/).slice(1).map(l => l.split(","));
  const censusCodes = rows.map(r => r[0]);

  assert.equal(censusCodes.length, 116, "Census must contain exactly 116 codes");
  assert.equal(new Set(censusCodes).size, 116, "Census codes must be distinct");

  // Verify exact category sizes
  assert.equal(KNOWN_OWNER_APPROVED_CODES.size, 41, "Approved codes count");
  assert.equal(IDENTITY_HELD_CODES.size, 38, "Identity-hold base codes count");
  assert.equal(EVIDENCE_HELD_CODES.size, 5, "Evidence-hold codes count");
  assert.equal(SCOPE_HELD_CODES.size, 6, "Scope-hold codes count");
  assert.equal(DELIVERY_VARIANT_HELD_CODES.size, 26, "Delivery-variant codes count");

  // Sum of partitioned sets
  const totalAccounted = KNOWN_OWNER_APPROVED_CODES.size
    + IDENTITY_HELD_CODES.size
    + EVIDENCE_HELD_CODES.size
    + SCOPE_HELD_CODES.size
    + DELIVERY_VARIANT_HELD_CODES.size;
  assert.equal(totalAccounted, 116, "Total accounted codes must equal 116");

  // Verify pairwise disjointness (zero overlap)
  const allAccounted = [
    ...KNOWN_OWNER_APPROVED_CODES,
    ...IDENTITY_HELD_CODES,
    ...EVIDENCE_HELD_CODES,
    ...SCOPE_HELD_CODES,
    ...DELIVERY_VARIANT_HELD_CODES,
  ];
  assert.equal(new Set(allAccounted).size, 116, "Must have zero overlap across categories");

  // Verify zero omission against census
  for (const code of censusCodes) {
    const isAccounted = KNOWN_OWNER_APPROVED_CODES.has(code)
      || IDENTITY_HELD_CODES.has(code)
      || EVIDENCE_HELD_CODES.has(code)
      || SCOPE_HELD_CODES.has(code)
      || DELIVERY_VARIANT_HELD_CODES.has(code);
    assert.ok(isAccounted, `Code ${code} from census must have explicit runtime disposition`);
  }

  // Verify unreleased identity and variant count is exactly 64
  const unreleasedIdentityOrVariant = IDENTITY_HELD_CODES.size + DELIVERY_VARIANT_HELD_CODES.size;
  assert.equal(unreleasedIdentityOrVariant, 64, "Unreleased identity + variant count must be 64");

  // Verify that all 17 previously omitted variants are explicitly in DELIVERY_VARIANT_HELD_CODES
  const codes17 = ["AS", "AT", "CM", "CN", "EL", "EM", "EU", "EY", "FS", "FY", "IS", "IY", "MY", "PM", "PN", "RA", "XS"];
  for (const c of codes17) {
    assert.ok(DELIVERY_VARIANT_HELD_CODES.has(c), `${c} must be in DELIVERY_VARIANT_HELD_CODES`);
    const status = evaluateBranchApproval(c, null);
    assert.equal(status.displayApproved, false, `${c} must not be display approved`);
    assert.equal(status.holdReason, "DELIVERY_VARIANT_HOLD", `${c} holdReason must be DELIVERY_VARIANT_HOLD`);
  }

  // Critical Safety Rule: No delivery variant may inherit approved base copy
  for (const variant of DELIVERY_VARIANT_HELD_CODES) {
    const crosswalkRow = rows.find(r => r[0] === variant);
    assert.ok(crosswalkRow, `Missing crosswalk row for variant ${variant}`);
    const baseProfile = crosswalkRow[5];

    // Even if baseProfile is owner-approved, the variant MUST NOT be display-approved
    const baseApproved = KNOWN_OWNER_APPROVED_CODES.has(baseProfile);
    const variantStatus = evaluateBranchApproval(variant, null);
    assert.equal(variantStatus.displayApproved, false, `Variant ${variant} (base ${baseProfile}) must never inherit approval`);
    assert.equal(variantStatus.holdReason, "DELIVERY_VARIANT_HOLD", `Variant ${variant} must fail-closed as DELIVERY_VARIANT_HOLD`);
  }
});

test("display gate fail-closed: removing any single approval dimension revokes display approval", () => {
  const base = APPROVED_BRANCH_COPY[0]; // CS
  assert.equal(isReleasedBranchCopy(base), true);

  // Missing owner
  assert.equal(isReleasedBranchCopy({ ...base, approval: { ...base.approval!, owner: "" } }), false);
  // Missing Tamil review
  assert.equal(isReleasedBranchCopy({ ...base, approval: { ...base.approval!, ta: "" } }), false);
  // Missing factual review
  assert.equal(isReleasedBranchCopy({ ...base, approval: { ...base.approval!, factual: "" } }), false);
  // Unapproved profile identity (held code)
  assert.equal(isReleasedBranchCopy({ ...base, id: "BY" }), false);
  assert.equal(isReleasedBranchCopy({ ...base, id: "AE" }), false);
  assert.equal(isReleasedBranchCopy({ ...base, id: "BP" }), false);
  // Unapproved version mismatch
  assert.equal(isReleasedBranchCopy({ ...base, version: "UNAPPROVED_VERSION" }), false);
  // Copy mismatch
  assert.equal(isReleasedBranchCopy({ ...base, copy: { ...base.copy, en: "Mismatched copy line 1\n2\n3\n4\n5" } }), false);
  // Fewer than 5 lines
  assert.equal(isReleasedBranchCopy({ ...base, copy: { ...base.copy, en: "Line 1\nLine 2" } }), false);
  // Non-HTTPS or test evidence URL
  assert.equal(isReleasedBranchCopy({ ...base, evidence: { ...base.evidence, url: "http://insecure.example.com" } }), false);
  assert.equal(isReleasedBranchCopy({ ...base, evidence: { ...base.evidence, url: "https://synthetic.test" } }), false);
});

test("student-facing UI fail-closed: unapproved or held profiles never render approved educational text", () => {
  // Check in governed pilot:
  // Held profiles must show under-review notice, never released explanation text
  const heldCodes = ["BY", "XC", "AE", "AO", "BP", "DA", "CQ", "IF", "ID", "CJ", "CA", "MT", "SF", "TC", "ER", "AS", "AT", "CM", "CN", "EL", "EM", "EU", "EY", "FS", "FY", "IS", "IY", "MY", "PM", "PN", "RA", "XS", "CL", "BS", "TT", "IM", "MS", "MF", "XM"];
  for (const code of heldCodes) {
    const en = renderPilot(`lang=en&view=branch&branch=${code}`);
    const ta = renderPilot(`lang=ta&view=branch&branch=${code}`);

    // If the programme is listed in directory, it must show under-review notice
    if (en.includes(`(${code})`)) {
      assert.match(en, /The educational explanation for this programme is still under review/i, `Must show under review for ${code}`);
      assert.match(ta, /இந்தப் பாடப்பிரிவின் கல்வி விளக்கம் இன்னும் மதிப்பாய்வில் உள்ளது/, `Must show under review in Tamil for ${code}`);
      // Must NEVER render approved 5-part explanation headers
      assert.doesNotMatch(en, /<h3>Simple explanation<\/h3>/, `Must not render explanation header for ${code}`);
      assert.doesNotMatch(en, /<h3>Typical subjects<\/h3>/, `Must not render subjects header for ${code}`);
    }
  }

  // Exactly the 6 released profiles may render explanation text
  for (const code of ["CS", "AD", "BM", "CE", "EC", "EE"]) {
    const en = renderPilot(`lang=en&view=branch&branch=${code}`);
    assert.match(en, /This general educational explanation does not establish any selected college/);
    assert.match(en, /<h3>Simple explanation<\/h3>/);
  }
});

test("family navigation never creates false approval for educational explanations", () => {
  // In default configuration, family navigation is strictly closed
  assert.deepEqual(APPROVED_FAMILY_MAPPINGS, []);
  assert.equal(buildReleasedFamilies(view.items, APPROVED_FAMILY_MAPPINGS).length, 0);

  const home = renderPilot("lang=en&view=home");
  assert.doesNotMatch(home, /Approved study-area links/);

  const families = renderPilot("lang=en&view=families");
  assert.match(families, /Study-area-to-programme links are still in owner review/);
});

test("synthetic / fixture provenance regression: synthetic data is never described as official or verified", () => {
  // Test across synthetic exploration views
  const queries = [
    "lang=en&view=families",
    "lang=ta&view=families",
    "lang=en&view=branches",
    "lang=ta&view=branches",
    "lang=en&view=branch&branch=CS",
    "lang=ta&view=branch&branch=CS",
    "lang=en&view=branch&branch=SYN-MECH",
    "lang=ta&view=branch&branch=SYN-MECH",
    "lang=en&view=colleges",
    "lang=ta&view=colleges",
    "lang=en&view=college&college=fixture-1",
    "lang=ta&view=college&college=fixture-1",
    "lang=en&view=detail&college=fixture-1&programme=CS",
    "lang=ta&view=detail&college=fixture-1&programme=CS",
  ];

  for (const q of queries) {
    const html = renderExplore(q);

    // Prohibited provenance claims for synthetic records
    assert.doesNotMatch(html, /officially supported/i, `Must not claim officially supported in query: ${q}`);
    assert.doesNotMatch(html, /TNEA verified/i, `Must not claim TNEA verified in query: ${q}`);
    assert.doesNotMatch(html, /source-backed/i, `Must not claim source-backed in query: ${q}`);

    // If the word "official" appears, it must strictly be in a negative disclaimer or curriculum reference
    const matches = [...html.matchAll(/(?:^|[^a-zA-Z])official(?:[^a-zA-Z]|$)/gi)];
    for (const match of matches) {
      const idx = match.index!;
      const context = html.slice(Math.max(0, idx - 40), Math.min(html.length, idx + 60));
      assert.ok(
        /not an official source|not official|check official|official curriculum|அதிகாரப்பூர்வ ஆதாரம் அல்ல|அதிகாரப்பூர்வத் தகவல்|அதிகாரப்பூர்வப் பாடத்திட்டம்/i.test(context),
        `Prohibited positive official claim found in context: "${context}" for query: ${q}`,
      );
    }

    // Must clearly identify as synthetic / demo data
    assert.match(
      html,
      /Synthetic review example|செயற்கை மாதிரி|கற்பனை மாதிரி|மாதிரி கல்லூரி|Sample College|demonstration only|விளக்கத்திற்கான மாதிரிகள்/i,
      `Synthetic label missing for query: ${q}`,
    );
  }
});

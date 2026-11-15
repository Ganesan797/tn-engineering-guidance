import test from "node:test";
import assert from "node:assert/strict";
import { type PilotInput, type Decision, type PilotField } from "../../src/m4/governed-pilot.ts";
import { renderGovernedPilot } from "../../src/ui/m4-governed-pilot.ts";
import type { ReviewedBranchCopy } from "../../src/m4/branch-copy.ts";

const accepted = <T>(exact: T): Decision<T> => ({
  disposition: "APPROVED",
  reference: "test-owner-record",
  exact: structuredClone(exact),
});

const source = {
  document: "Example listing",
  url: "https://pilot.example.test/listing",
  year: 2026,
  stream: "GENERAL_ACADEMIC",
  stage: "BEFORE_SPECIAL_RESERVATION_COUNSELLING",
  printed_page: 1,
  pdf_page: 1,
  location_status: "RECORDED" as const,
};

function createFixtures(): PilotInput {
  const colleges = [1, 2, 3, 4].map(n => {
    const identity = { code: `sample-${n}`, name: `Sample College ${n}`, source };
    const district: PilotField = { value: n === 1 ? "Chennai" : "Coimbatore", source };
    const type: PilotField = { value: n === 1 ? "GOVERNMENT" : "AIDED", source };
    return {
      identity,
      identityDecision: accepted(identity),
      district,
      districtDecision: accepted(district),
      type,
      typeDecision: accepted(type),
    };
  });

  const pairs = [
    { offering: { college: "sample-1", programme: "CS", name: "COMPUTER SCIENCE AND ENGINEERING", source }, profileId: "CS" },
    { offering: { college: "sample-1", programme: "EC", name: "ELECTRONICS AND COMMUNICATION", source }, profileId: "EC" },
    { offering: { college: "sample-2", programme: "AD", name: "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE", source }, profileId: "AD" },
    { offering: { college: "sample-3", programme: "ME", name: "MECHANICAL ENGINEERING", source }, profileId: "ME" },
  ].map(p => ({
    offering: p.offering,
    offeringDecision: accepted(p.offering),
    profileId: p.profileId,
    linkDecision: accepted({ college: p.offering.college, programme: p.offering.programme, profileId: p.profileId }),
  }));

  const copy = {
    ta: "தமிழ் அறிமுகம்\nதமிழ் பாடங்கள்\nதமிழ் பயிற்சி\nதமிழ் கவனம்\nதமிழ் அடுத்து",
    en: "Example introduction\nExample topics\nExample exercise\nExample considerations\nExample next action",
  };
  const evidence = { url: "https://curriculum.example.org/source", locator: "page 1", scope: "Example educational scope" };
  const profiles: ReviewedBranchCopy[] = ["CS", "EC", "AD", "ME"].map(id => ({
    id,
    version: "v1",
    disposition: "APPROVED",
    copy,
    evidence,
    approval: {
      version: "v1",
      approved_copy: structuredClone(copy),
      approved_evidence: structuredClone(evidence),
      owner: "owner",
      factual: "facts",
      ta: "ta",
      en: "en",
      reference: "test-approval",
    },
  }));

  return { classification: "TEST_FIXTURE", colleges, pairs, profiles };
}

const fixtures = createFixtures();
const render = (query: string) => renderGovernedPilot(new URLSearchParams(query), fixtures);

test("T08: Empty shortlist displays friendly bilingual guidance and exploration links", () => {
  const en = render("lang=en&view=shortlist");
  assert.match(en, /Your shortlist is empty/);
  assert.match(en, /Explore colleges and programmes to add choices/);
  assert.match(en, /view=colleges/);
  assert.match(en, /view=branches/);

  const ta = render("lang=ta&view=shortlist");
  assert.match(ta, /உங்கள் விருப்பப்பட்டியல் காலியாக உள்ளது/);
  assert.match(ta, /கல்லூரிகளையும் படிப்புகளையும் ஆராய்ந்து/);
  assert.match(ta, /கல்லூரிகளைப் பார்/);
});

test("T08: Shortlist preserves exact offering keys without marks, ranks, or applicant data", () => {
  const html = render("lang=en&view=shortlist&shortlist=sample-1~CS&shortlist=sample-2~AD");
  assert.match(html, /2 choices added/);
  assert.match(html, /Sample College 1/);
  assert.match(html, /COMPUTER SCIENCE AND ENGINEERING/);
  assert.match(html, /Sample College 2/);
  assert.match(html, /ARTIFICIAL INTELLIGENCE AND DATA SCIENCE/);

  // Strict marks-free verification
  assert.doesNotMatch(html, /name="(?:marks|cutoff|rank|community)"/i);
  assert.doesNotMatch(html, /applicant/i);
});

test("T08: Shortlist deduplicates items and filters invalid offering keys", () => {
  const html = render("lang=en&view=shortlist&shortlist=sample-1~CS&shortlist=sample-1~CS&shortlist=invalid~XX");
  assert.match(html, /1 choice added/);
  assert.match(html, /Sample College 1/);
  assert.doesNotMatch(html, /invalid/);
});

test("T08: Shared-device warning and 30-day storage privacy notice are prominently rendered", () => {
  const en = render("lang=en&view=shortlist&shortlist=sample-1~CS");
  assert.match(en, /Shared-device warning/);
  assert.match(en, /browsing centre, school, or college/);
  assert.match(en, /Clear entire shortlist/);
  assert.match(en, /Default: Browser session memory/);
  assert.match(en, /Save on this device for up to 30 days/);

  const ta = render("lang=ta&view=shortlist&shortlist=sample-1~CS");
  assert.match(ta, /பகிரப்பட்ட கணினி எச்சரிக்கை/);
  assert.match(ta, /பிரவுசிங் மையக் கணினியைப் பயன்படுத்தினால்/);
  assert.match(ta, /விருப்பப்பட்டியலை முழுமையாக அழி/);
  assert.match(ta, /உலாவி அமர்வு நினைவகம்/);
  assert.match(ta, /30 நாட்கள் வரை சேமி/);
});

test("T08: Clear Shortlist control resets all shortlisted choices", () => {
  const html = render("lang=en&view=shortlist&shortlist=sample-1~CS&shortlist=sample-2~AD");
  assert.match(html, /id="btn-clear-shortlist"/);
  assert.match(html, /href="[^"]*view=shortlist[^"]*"/);
  // URL in clear button has no shortlist keys
  assert.match(html, /view=shortlist"/);
});

test("T09: Manual preference ordering with Choice 1..N and interactive Up/Down/Remove controls", () => {
  const html = render("lang=en&view=shortlist&shortlist=sample-1~CS&shortlist=sample-1~EC&shortlist=sample-2~AD");

  // Choice badges
  assert.match(html, /Choice 1/);
  assert.match(html, /Choice 2/);
  assert.match(html, /Choice 3/);

  // Choice 1: Move Up is disabled, Move Down is active
  assert.match(html, /<span class="action move-btn disabled"[^>]*>▲ Up<\/span>/);
  assert.match(html, /aria-label="Move choice 1 down"/);

  // Choice 2: Move Up and Move Down are both active
  assert.match(html, /aria-label="Move choice 2 up"/);
  assert.match(html, /aria-label="Move choice 2 down"/);

  // Choice 3: Move Down is disabled, Move Up is active
  assert.match(html, /aria-label="Move choice 3 up"/);
  assert.match(html, /<span class="action move-btn disabled"[^>]*>▼ Down<\/span>/);

  // Remove controls exist for all choices
  assert.match(html, /aria-label="Remove choice 1"/);
  assert.match(html, /aria-label="Remove choice 2"/);
  assert.match(html, /aria-label="Remove choice 3"/);
});

test("T09: Manual ordering sequence is strictly user-controlled with zero automated reordering", () => {
  // Pass sequence B then A
  const reversed = render("lang=en&view=shortlist&shortlist=sample-2~AD&shortlist=sample-1~CS");
  const posAD = reversed.indexOf("ARTIFICIAL INTELLIGENCE");
  const posCS = reversed.indexOf("COMPUTER SCIENCE");
  assert.ok(posAD < posCS, "Initial order must strictly reflect user input order, not college code or cutoff");

  // Tamil numbering
  const ta = render("lang=ta&view=shortlist&shortlist=sample-1~CS&shortlist=sample-2~AD");
  assert.match(ta, /விருப்பம் 1/);
  assert.match(ta, /விருப்பம் 2/);
});

test("T09: Print / Save as PDF button and print stylesheet are present", () => {
  const html = render("lang=en&view=shortlist&shortlist=sample-1~CS");
  assert.match(html, /onclick="window\.print\(\)"/);
  assert.match(html, /@media print/);
  assert.match(html, /Print \/ Save PDF/);
});

test("T10: Single-window algorithm priority is explained in simple bilingual terms", () => {
  const en = render("lang=en&view=shortlist");
  assert.match(en, /How Does TNEA Single-Window Allotment Work\?/);
  assert.match(en, /strictly top-to-bottom/);
  assert.match(en, /Choice 1 is checked first/);
  assert.match(en, /Next choice only if full/);
  assert.match(en, /Crucial rule — Genuine preference comes first/);

  const ta = render("lang=ta&view=shortlist");
  assert.match(ta, /TNEA ஒற்றைச் சாளர முறை எவ்வாறு செயல்படுகிறது\?/);
  assert.match(ta, /மேலிருந்து கீழாக/);
  assert.match(ta, /விருப்பம் 1 முதலில் ஆய்வு செய்யப்படும்/);
  assert.match(ta, /இடம் இல்லையெனில் மட்டுமே அடுத்த விருப்பம்/);
  assert.match(ta, /முக்கிய விதி — உங்கள் உண்மையான விருப்பமே முதன்மை/);
});

test("T10: All 5 Tentative Allotment Confirmation options are clearly detailed", () => {
  const en = render("lang=en&view=shortlist");
  assert.match(en, /The 5 Tentative Allotment Confirmation Choices/);
  assert.match(en, /Accept and Join/);
  assert.match(en, /Accept and Upward Movement/);
  assert.match(en, /Decline and Upward Movement/);
  assert.match(en, /Decline and Next Round/);
  assert.match(en, /Quit \/ Decline and Quit/);

  const ta = render("lang=ta&view=shortlist");
  assert.match(ta, /தற்காலிக ஒதுக்கீட்டின் 5 உறுதிப்படுத்தல் தேர்வுகள்/);
  assert.match(ta, /ஏற்றுக்கொண்டு சேர்கிறேன்/);
  assert.match(ta, /ஏற்றுக்கொண்டு மேல்நோக்கி நகர்வு/);
  assert.match(ta, /நிராகரித்து மேல்நோக்கி நகர்வு/);
  assert.match(ta, /நிராகரித்து அடுத்த சுற்றுக்குச் செல்கிறேன்/);
  assert.match(ta, /விலகுகிறேன்/);
});

test("T10: Practical next steps cover certificate verification, fees (with 7.5% waiver), allotment order, and college reporting", () => {
  const en = render("lang=en&view=shortlist");
  assert.match(en, /Practical Next Steps/);
  assert.match(en, /Certificate Verification/);
  assert.match(en, /Fee Payment/);
  assert.match(en, /7\.5% government school quota students are fully exempt/);
  assert.match(en, /Provisional Allotment Order/);
  assert.match(en, /College Reporting/);

  const ta = render("lang=ta&view=shortlist");
  assert.match(ta, /அடுத்த நடைமுறைகள் மற்றும் வழிகாட்டல்/);
  assert.match(ta, /சான்றிதழ் சரிபார்ப்பு/);
  assert.match(ta, /கட்டணம் செலுத்துதல்/);
  assert.match(ta, /7\.5% அரசுப் பள்ளி ஒதுக்கீட்டு மாணவர்களுக்கு முழுக் கல்விக் கட்டணம்/);
  assert.match(ta, /அதிகாரப்பூர்வ ஒதுக்கீட்டு ஆணை/);
  assert.match(ta, /கல்லூரியில் நேரில் சேருதல்/);
});

test("Discovery integration: Offerings can be added to shortlist from colleges, college, and detail views", () => {
  // Colleges view
  const collegesView = render("lang=en&view=colleges");
  assert.match(collegesView, /\+ Add to Shortlist/);
  assert.match(collegesView, /My Shortlist.*\(0\)/);

  // College view
  const collegeView = render("lang=en&view=college&college=sample-1");
  assert.match(collegeView, /\+ Add to Shortlist/);

  // Detail view
  const detailView = render("lang=en&view=detail&college=sample-1&programme=CS");
  assert.match(detailView, /\+ Add to Shortlist/);

  // In Shortlist state when key is in shortlist
  const inShortlistView = render("lang=en&view=detail&college=sample-1&programme=CS&shortlist=sample-1~CS");
  assert.match(inShortlistView, /In Shortlist \(Click to remove\)/);
  assert.match(inShortlistView, /My Shortlist.*\(1\)/);
});

test("Navigation integration: Language switching and breadcrumbs retain the shortlist", () => {
  const en = render("lang=en&view=shortlist&shortlist=sample-1~CS");
  assert.match(en, /lang=ta/);
  assert.match(en, /shortlist=sample-1%7ECS/);

  const breadcrumbs = render("lang=en&view=shortlist&shortlist=sample-1~CS");
  assert.match(breadcrumbs, /aria-current="page">My Shortlist/);
  assert.match(breadcrumbs, /College results/);
});

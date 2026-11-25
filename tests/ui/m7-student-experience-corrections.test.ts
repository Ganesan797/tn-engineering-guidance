import test from "node:test";
import assert from "node:assert/strict";
import { renderM5GuidancePage } from "../../src/ui/m5-guidance-view.ts";
import { renderStudentEntryPage } from "../../src/ui/student-entry.ts";
import { parseAwarenessPack, applyApprovedTamilStudentCopy } from "../../src/student-semantics/awareness.ts";
import { readFileSync } from "node:fs";

const packDocument = readFileSync(new URL("../../docs/content/m1/m1_awareness_content_pack_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const frozenPack = parseAwarenessPack(
  readFileSync(new URL("../../data/m1_awareness_content_pack_v1.json", import.meta.url), "utf8"),
  packDocument,
  readFileSync(new URL("../../data/sources.csv", import.meta.url), "utf8")
);
const tamilCopyDocument = readFileSync(new URL("../../docs/content/m1/m1_tamil_student_copy_v1.md", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const pack = applyApprovedTamilStudentCopy(frozenPack, tamilCopyDocument);

test("Scenario A: Cross-language comparison preserves full context across Tamil -> English -> Tamil without leaking marks in GET URLs", () => {
  // 1. Initial Tamil state with Cutoff 160, BC, Round 2, filters, and 3 shortlist items
  const initialTa = renderM5GuidancePage(
    new URLSearchParams({
      tab: "comparison",
      lang: "ta",
      searched: "1",
      district: "Chennai",
      shortlist: "1~CS,2006~EC,2005~ME",
    }),
    {
      studentCutoff: 160.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_2",
      communitySelected: true,
      year: 2026,
    }
  );

  // Assert Tamil page contains active context
  assert.ok(initialTa.includes("160.00"));
  assert.ok(initialTa.includes("பிற்படுத்தப்பட்டோர் (BC)"));
  assert.ok(initialTa.includes("சுற்று 2"));

  // Check language switcher form in Tamil mode
  assert.ok(initialTa.includes('action="/m5-guidance?lang=en"'));
  assert.ok(initialTa.includes('method="POST"'));
  assert.ok(initialTa.includes('name="cutoff" value="160"'));
  assert.ok(initialTa.includes('name="community" value="BC"'));
  assert.ok(initialTa.includes('name="round" value="ROUND_2"'));
  assert.ok(initialTa.includes('name="district" value="Chennai"'));
  assert.ok(initialTa.includes('name="shortlist" value="1~CS,2006~EC,2005~ME"'));
  assert.ok(!initialTa.includes('href="?tab=comparison&lang=en&cutoff=')); // Zero marks in GET URL

  // 2. Simulate language switch submission to English
  const switchedEn = renderM5GuidancePage(
    new URLSearchParams({
      tab: "comparison",
      lang: "en",
      searched: "1",
      district: "Chennai",
      shortlist: "1~CS,2006~EC,2005~ME",
    }),
    {
      studentCutoff: 160.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_2",
      communitySelected: true,
      year: 2026,
    }
  );

  // Assert English page preserved all context
  assert.ok(switchedEn.includes("160.00"));
  assert.ok(switchedEn.includes("Backward Class (BC)"));
  assert.ok(switchedEn.includes("Round 2"));
  assert.ok(switchedEn.includes("Chennai"));
  assert.ok(switchedEn.includes('action="/m5-guidance?lang=ta"'));
  assert.ok(switchedEn.includes('method="POST"'));
  assert.ok(switchedEn.includes('name="cutoff" value="160"'));
  assert.ok(switchedEn.includes('name="community" value="BC"'));
  assert.ok(switchedEn.includes('name="round" value="ROUND_2"'));

  // 3. Switch back to Tamil
  const switchedBackTa = renderM5GuidancePage(
    new URLSearchParams({
      tab: "comparison",
      lang: "ta",
      searched: "1",
      district: "Chennai",
      shortlist: "1~CS,2006~EC,2005~ME",
    }),
    {
      studentCutoff: 160.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_2",
      communitySelected: true,
      year: 2026,
    }
  );

  assert.ok(switchedBackTa.includes("160.00"));
  assert.ok(switchedBackTa.includes("பிற்படுத்தப்பட்டோர் (BC)"));
  assert.ok(switchedBackTa.includes("சுற்று 2"));
  assert.ok(switchedBackTa.includes("Chennai"));
});

test("Scenario B: Lower-cutoff beginner (110) receives deterministic round sync and neutral guidance without predictive claims", () => {
  // Input cutoff 110 without explicit round override
  const htmlAutoRound3 = renderM5GuidancePage(
    new URLSearchParams({ tab: "comparison", lang: "en", searched: "1" }),
    {
      studentCutoff: 110.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      communitySelected: true,
      year: 2026,
    }
  );

  // Under student-centered flow, cutoff defaults to Round 1 benchmark (ROUND_1) without cutoff-to-round inference
  assert.ok(htmlAutoRound3.includes('value="ROUND_1" selected'));

  // If student manually overrides to inspect Round 1
  const htmlInspectRound1 = renderM5GuidancePage(
    new URLSearchParams({ tab: "comparison", lang: "en", searched: "1", round: "ROUND_1", round_explicit: "1" }),
    {
      studentCutoff: 110.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      communitySelected: true,
      year: 2026,
      roundExplicit: true,
    }
  );

  assert.ok(htmlInspectRound1.includes('value="ROUND_1" selected'));
  // Neutral guidance is displayed explaining Round 1 score bands
  assert.ok(htmlInspectRound1.includes("Historical Evidence Coverage Notice — Round 1"));
  assert.ok(htmlInspectRound1.includes("Round 1 historical publications primarily reflect candidate allotments in the ~179.00–200.00 score band"));
  assert.ok(htmlInspectRound1.includes("does not mean options are unavailable"));
  // Zero prediction invariant
  assert.ok(!htmlInspectRound1.includes("impossible"));
  assert.ok(!htmlInspectRound1.includes("no chance"));
  assert.ok(!htmlInspectRound1.includes("higher chance"));
});

test("Scenario C: Shortlist action clearly separates affirmative status badge from destructive removal", () => {
  // Offering 1~CS is shortlisted for CEG (college 1)
  const html = renderM5GuidancePage(
    new URLSearchParams({ tab: "comparison", lang: "en", searched: "1", college: "1", shortlist: "1~CS" }),
    {
      studentCutoff: 195.0,
      quota: "GENERAL_ACADEMIC",
      community: "OC",
      round: "ROUND_1",
      communitySelected: true,
      year: 2026,
    }
  );

  // Affirmative badge is non-clickable span
  assert.ok(html.includes('<span class="shortlist-saved-badge"'));
  assert.ok(html.includes("✓ Saved"));

  // Removal button is an explicit, separate action with clear removal label
  assert.ok(html.includes('class="btn-action btn-remove-shortlist"'));
  assert.ok(html.includes("Remove ✕"));
  assert.ok(html.includes('aria-label="Remove from shortlist"'));

  // Non-shortlisted offering (e.g. 2006~EC) renders "+ Add"
  assert.ok(html.includes('+ Add'));
  assert.ok(html.includes('aria-label="Add to manual shortlist"'));
});

test("Scenario D: Availability checkbox has touch target >= 44px and accessible label", () => {
  const html = renderM5GuidancePage(new URLSearchParams({ tab: "comparison", lang: "en" }));

  // Checkbox wrapper label has min-height: 44px
  assert.ok(html.includes('<label for="only-available-check" style="display: inline-flex; align-items: center; gap: 0.65rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #334155; min-height: 44px; padding: 6px 4px; user-select: none;">'));
  assert.ok(html.includes('<input id="only-available-check" type="checkbox" name="only_available" value="1"'));
});

test("Scenario E: Choice Planner provides top and bottom pagination and explicit form reset", () => {
  // Query with > 50 results (84 offerings)
  const html = renderM5GuidancePage(
    new URLSearchParams({ tab: "comparison", lang: "en", searched: "1", branch: "AD" }),
    {
      studentCutoff: 197.0,
      quota: "GENERAL_ACADEMIC",
      community: "OC",
      round: "ROUND_1",
      communitySelected: true,
      year: 2026,
    }
  );

  // Top pagination bar is rendered above the table
  const paginationOccurrences = (html.match(/class="pagination-bar screen-only"/g) || []).length;
  assert.ok(paginationOccurrences >= 2, "Expected at least 2 pagination bars (top and bottom)");

  // Form Reset button is present on the form
  assert.ok(html.includes('aria-label="Reset filters"'));
  assert.ok(html.includes('href="?tab=comparison&amp;lang=en"'));
});

test("Fix 6: Home page harmonizes 3 introductory steps within the 5-stage framework", () => {
  const homeEn = renderStudentEntryPage({ route: "home", language: "en" }, pack);
  assert.ok(homeEn.includes("Guided Journey — 3 Simple Steps to Begin"));
  assert.ok(homeEn.includes("Introductory foundation for the 5-stage engineering admissions journey."));

  const homeTa = renderStudentEntryPage({ route: "home", language: "ta" }, pack);
  assert.ok(homeTa.includes("தொடக்க நிலை வழிகாட்டல் — 3 எளிய அறிமுகப் படிகள்"));
  assert.ok(homeTa.includes("5-நிலைப் பொறியியல் சேர்க்கைப் பயணத்தின் தொடக்கப் புரிதலுக்கான எளிய அறிமுகம்."));
});

test("Accessibility Tree Smoke Test: Headings, landmarks, labels, pagination, shortlist, and exports have complete accessible metadata", () => {
  const html = renderM5GuidancePage(
    new URLSearchParams({ tab: "comparison", lang: "en", searched: "1", college: "1", shortlist: "1~CS" }),
    {
      studentCutoff: 185.0,
      quota: "GENERAL_ACADEMIC",
      community: "BC",
      round: "ROUND_1",
      communitySelected: true,
      year: 2026,
    }
  );

  // Landmark regions & Headings
  assert.ok(html.includes('<header class="site-header">'), "Header landmark present");
  assert.ok(html.includes('<nav class="site-nav" aria-label="Main navigation">'), "Main nav landmark with accessible name");
  assert.ok(html.includes('role="status"'), "Active context strip has role=status");
  assert.ok(html.includes('<table class="comparison-table" role="table" aria-label="College Cutoff Comparison Table">'), "Comparison table has accessible table role and name");

  // Form controls have explicit accessible labels
  assert.ok(html.includes('id="cutoff-input"'));
  assert.ok(html.includes('id="community-select"'));
  assert.ok(html.includes('id="round-select"'));
  assert.ok(html.includes('id="year-select"'));
  assert.ok(html.includes('id="only-available-check"'));

  // Pagination controls have aria-labels on multi-page results
  const multiPageHtml = renderM5GuidancePage(
    new URLSearchParams({ tab: "comparison", lang: "en", searched: "1", branch: "AD" }),
    { studentCutoff: 185.0, quota: "GENERAL_ACADEMIC", community: "BC", round: "ROUND_1", communitySelected: true, year: 2026 }
  );
  assert.ok(multiPageHtml.includes('aria-label="Previous page"'));
  assert.ok(multiPageHtml.includes('aria-label="Next page"'));

  // Shortlist action controls have distinct accessible names
  assert.ok(html.includes('aria-label="Remove from shortlist"'));
  assert.ok(html.includes('aria-label="Add to manual shortlist"'));

  // Shortlist page ordering controls have accessible labels
  const shortlistHtml = renderM5GuidancePage(
    new URLSearchParams({ tab: "shortlist", lang: "en", shortlist: "1~CS,2006~EC" })
  );
  assert.ok(shortlistHtml.includes('aria-label="Move Choice #1 down"'));
  assert.ok(shortlistHtml.includes('aria-label="Remove Choice #1"'));
  assert.ok(shortlistHtml.includes('aria-label="Print Worksheet or Save as PDF"'));
  assert.ok(shortlistHtml.includes('aria-label="Choice list plain text export"'));
  assert.ok(shortlistHtml.includes('aria-label="Choice list CSV export"'));
});


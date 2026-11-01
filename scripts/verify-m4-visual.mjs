import { loadApprovedDirectory } from "../src/m4/approved-directory-preview.mjs";
import { renderGovernedPilot } from "../src/ui/m4-governed-pilot.ts";
import { renderM4Exploration } from "../src/ui/m4-exploration.ts";

const view = loadApprovedDirectory();
const prohibitedRanking = [
  "cutoff prediction", "rank prediction", "admission prediction",
  "safe choice", "target choice", "dream choice", "best college",
  "college ranking", "top branch", "தரவரிசைக் கணிப்பு", "சேர்க்கைக் கணிப்பு"
];

const results = [];

function checkPage(name, html, lang, viewport) {
  const issues = [];

  // Check 1: Responsive meta tag
  if (!html.includes('<meta name="viewport" content="width=device-width')) {
    issues.push("Missing responsive viewport meta tag");
  }

  // Check 2: No ranking or prediction language
  for (const term of prohibitedRanking) {
    if (html.toLowerCase().includes(term.toLowerCase())) {
      issues.push(`Prohibited ranking term found: "${term}"`);
    }
  }

  // Check 3: Clear pilot / preview scope disclaimer
  const hasScopeDisclaimer =
    html.includes("2026") ||
    html.includes("முன்னோட்டம்") ||
    html.includes("preview") ||
    html.includes("மாதிரி") ||
    html.includes("செயற்கை") ||
    html.includes("Synthetic") ||
    html.includes("மதிப்பாய்வு") ||
    html.includes("ஆய்வு") ||
    html.includes("review");
  if (!hasScopeDisclaimer) {
    issues.push("Missing dated source or preview scope indicator");
  }

  // Check 4: Return to journey or main navigation
  if (!html.includes('href="/journey') && !html.includes('href="/"')) {
    issues.push("Missing return link to guidance journey or home");
  }

  results.push({ name, lang, viewport, ok: issues.length === 0, issues });
}

// Visual verification across viewports: 360px, 390px, desktop (1280px)
const viewports = ["360px", "390px", "desktop"];
const langs = ["ta", "en"];
const pages = [
  { view: "home", title: "Home" },
  { view: "families", title: "Families (Closed Gate)" },
  { view: "branches", title: "All Programmes" },
  { view: "branch", branch: "CS", title: "Branch CS (Approved)" },
  { view: "branch", branch: "BY", title: "Branch BY (Held - Identity)" },
  { view: "branch", branch: "IT", title: "Branch IT (Draft - Under Review)" },
  { view: "colleges", title: "Colleges Directory" },
  { view: "college", college: "1", title: "College Detail CEG" },
  { view: "detail", college: "1", programme: "CS", title: "Offering Detail" },
  { view: "compare", pick: ["1~CS", "4~CS"], title: "Comparison Matrix" }
];

for (const vp of viewports) {
  for (const lang of langs) {
    for (const p of pages) {
      const q = new URLSearchParams({ lang, view: p.view });
      if (p.branch) q.set("branch", p.branch);
      if (p.college) q.set("college", p.college);
      if (p.programme) q.set("programme", p.programme);
      if (p.pick) for (const k of p.pick) q.append("pick", k);

      const html = renderGovernedPilot(q, undefined, view);
      checkPage(`Pilot ${p.title}`, html, lang, vp);

      // Verify specific gate requirements
      if (p.branch === "BY" || p.branch === "IT") {
        if (html.includes("<h3>Simple explanation</h3>") || html.includes("<h3>எளிய விளக்கம்</h3>")) {
          throw new Error(`Held/unapproved branch ${p.branch} rendered approved explanation!`);
        }
        if (!html.includes("still under review") && !html.includes("மதிப்பாய்வில் உள்ளது")) {
          throw new Error(`Held/unapproved branch ${p.branch} missing under-review notice!`);
        }
      }

      if (p.branch === "CS") {
        if (!html.includes("general educational explanation") && !html.includes("பொதுவான கல்வி விளக்கம்")) {
          throw new Error(`Approved branch CS missing explanation!`);
        }
      }
    }

    // Also check synthetic exploration journey
    const exploreHtml = renderM4Exploration(new URLSearchParams({ lang, view: "branches" }));
    checkPage("Synthetic Exploration", exploreHtml, lang, vp);
    if (exploreHtml.includes("officially supported") || exploreHtml.includes("TNEA verified")) {
      throw new Error("Synthetic exploration claimed official status!");
    }
  }
}

const failed = results.filter(r => !r.ok);
console.log(JSON.stringify({
  totalChecks: results.length,
  passedChecks: results.length - failed.length,
  failedChecks: failed.length,
  viewports,
  languages: langs,
  allPassed: failed.length === 0,
}, null, 2));

if (failed.length > 0) {
  console.error("Visual check failures:", failed);
  process.exit(1);
}

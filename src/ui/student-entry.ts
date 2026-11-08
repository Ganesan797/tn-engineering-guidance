import { CHECK_COPY } from "./journey-copy.ts";
import {
  MissingStudentPresentationError, resolveStudentMessage,
  type StudentLanguage, type StudentSemanticMessage,
} from "../student-semantics/index.ts";
import type { EntryRoute, StudentEntryState } from "../student-entry/models.ts";
import { entryHref } from "../student-entry/routing.ts";
import { renderStudentGuidancePage, type StudentGuidancePageState } from "./student-guidance.ts";
import { AWARENESS_GROUPS, type AwarenessItem, type AwarenessPack } from "../student-semantics/awareness.ts";
import { renderSiteHeader, SITE_SHELL_CSS } from "./site-shell.ts";
import { calculateAcademicCutoffFromRule } from "../domain/rules.ts";

type MessageResolver = (message: StudentSemanticMessage, language: StudentLanguage) => string;

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const STYLE = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:18px/1.7 "Nirmala UI","Noto Sans Tamil","Latha",system-ui,sans-serif;letter-spacing:normal}main{max-width:780px;margin:auto;padding:24px}h1{font-size:1.8rem}h2{font-size:1.35rem}h3{font-size:1.15rem}h1,h2,h3{line-height:1.55;margin:0 0 1rem}p{margin:.5rem 0 1.2rem}a{color:#174ea6;text-underline-offset:.2em}a:focus-visible,summary:focus-visible{outline:3px solid #174ea6;outline-offset:4px}.languages{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem}.languages a,summary{padding:.5rem 0}.choice-card,.card,.awareness{padding:1.3rem;border:1px solid #d8dde6;border-radius:12px;background:white;margin:1.2rem 0}.choice-card{display:block;text-decoration:none;color:inherit;transition:background .15s}.choice-card:hover,.choice-card:focus-visible{background:#eef4ff;border-color:#174ea6}.choice-card strong{display:block;color:#174ea6;font-size:1.15rem}.choice-card .action{display:inline-flex;align-items:center;min-height:44px;color:#174ea6;font-weight:650;margin-top:.7rem}.choice-card p{margin:.5rem 0}.notice{font-size:.9rem;color:#46536a}nav ul{padding-left:1.2rem}nav li{margin:.7rem 0}details{margin-top:1rem}summary{cursor:pointer;color:#174ea6}.module{margin:2rem 0;padding-bottom:1.5rem;border-bottom:1px solid #d8dde6}.module li{margin:.65rem 0}.formula{white-space:normal;overflow-wrap:anywhere;padding:.7rem;background:#eef1f5}.group-nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0}.group-nav a{padding:.5rem .7rem;border:1px solid #d8dde6;border-radius:8px;min-height:44px;display:inline-flex;align-items:center}.group-nav [aria-current=page]{background:#174ea6;color:white}.steps{display:flex;gap:1rem;justify-content:space-between;margin:1.5rem 0}.steps a{padding:.65rem;min-height:44px;display:inline-flex;align-items:center}.review-only{border:2px dashed #6b7280;padding:1rem;margin-top:2rem}.calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1rem 0}.calc-row{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.8rem}.calc-row label{font-size:.95rem;font-weight:650;color:#1e293b}.calc-row input{padding:.65rem .8rem;font-size:1.05rem;border:1.5px solid #cbd5e1;border-radius:8px;outline:none}.calc-row input:focus{border-color:#174ea6;box-shadow:0 0 0 3px rgba(23,78,166,.15)}.calc-submit-btn{padding:.75rem 1.4rem;background:#174ea6;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;transition:background .15s}.calc-submit-btn:hover{background:#0b3780}.cutoff-result{background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:1.4rem;margin:1.4rem 0}.cutoff-result h2{color:#166534;margin:0 0 .5rem;font-size:1.25rem}.cutoff-score-display{font-size:2.2rem;font-weight:800;color:#15803d;margin:.3rem 0 .6rem}.formula-breakdown{font-family:monospace;background:#dcfce7;padding:.5rem .8rem;border-radius:6px;display:inline-block;font-size:.95rem;color:#14532d;margin:0 0 .8rem}.mandatory-warning{background:#fffbeb;border-left:4px solid #f59e0b;padding:.9rem 1.1rem;border-radius:6px;margin:1rem 0}.mandatory-warning p{margin:.35rem 0;font-size:.95rem;color:#92400e;line-height:1.55}.counselling-rules-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.2rem;margin:1.2rem 0}.rule-card{background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:1.2rem}.rule-card h4{margin:0 0 .5rem;color:#0f2c59;font-size:1.1rem}.rule-card p{margin:.4rem 0;font-size:.95rem;line-height:1.55}.rule-condition{background:#eff6ff;border-left:3px solid #3b82f6;padding:.6rem .8rem;border-radius:4px;margin-top:.7rem}.rule-condition strong{color:#1d4ed8}.counselling-actions{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.5rem}.counselling-actions a{display:inline-flex;align-items:center;padding:.65rem 1.15rem;background:#174ea6;color:#fff;border-radius:8px;font-weight:650;text-decoration:none}.counselling-actions a:hover{background:#0b3780}@media(max-width:35rem){body{font-size:17px}main{padding:16px}.choice-card,.card,.awareness{padding:1rem}h1{font-size:1.6rem}.group-nav{font-size:.9rem}}`;

// Limited rendering of the frozen pack's paragraphs, lists and formula blocks; no raw HTML.
export function contentMarkup(text: string): string {
  const inline = (value: string) => escape(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return text.split(/\n\n+/).map((block) => {
    if (/^- /m.test(block)) return `<ul>${block.split("\n").map((line) => `<li>${inline(line.replace(/^- /, ""))}</li>`).join("")}</ul>`;
    if (/^\d+\. /m.test(block)) return `<ol>${block.split("\n").map((line) => `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
    if (block.startsWith("`")) return `<p class="formula">${inline(block.replaceAll("`", ""))}</p>`;
    return `<p>${inline(block)}</p>`;
  }).join("");
}

export interface StudentEntryOptions {
  readonly section?: string;
  readonly review?: boolean;
  readonly ownerPreview?: boolean;
  readonly maths?: string;
  readonly physics?: string;
  readonly chemistry?: string;
}

export function renderStudentEntryPage(
  state: StudentEntryState,
  pack: AwarenessPack,
  resolve: MessageResolver = resolveStudentMessage,
  options: StudentEntryOptions = {},
): string {
  const { language, route } = state;
  const message = (key: StudentSemanticMessage["key"]) => escape(resolve({ key }, language));
  const section = AWARENESS_GROUPS.find((group) => group.key === options.section) ?? AWARENESS_GROUPS[0];
  const sectionHref = (key: string, targetLanguage = language) => `${entryHref("beginner", targetLanguage)}&section=${key}${options.review ? "&review=1" : ""}`;
  const localeHref = (targetLanguage: StudentLanguage) => route === "beginner" ? sectionHref(section.key, targetLanguage) : `${entryHref(route, targetLanguage)}${options.review ? "&review=1" : ""}`;
  const link = (target: EntryRoute, key: StudentSemanticMessage["key"]) =>
    `<a href="${entryHref(target, language)}">${message(key)}</a>`;
  const localeControl = `<a lang="ta" href="${localeHref("ta")}"${language === "ta" ? ' aria-current="page"' : ""}>தமிழ்</a><a lang="en" href="${localeHref("en")}"${language === "en" ? ' aria-current="page"' : ""}>English</a>`;
  const shell = (body: string) => `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${message("entry.site")}</title><style>${STYLE}${SITE_SHELL_CSS}.home-main{max-width:1160px;padding:28px 20px}.home-intro{background:#fff;border:1px solid #d8dde6;border-radius:14px;padding:2rem 2.2rem;margin-bottom:1.75rem;box-shadow:0 1px 3px rgba(0,0,0,.04)}.home-intro h1{font-size:2.1rem;font-weight:800;color:#0f2c59;margin:0 0 .5rem}.home-intro p{font-size:1.12rem;color:#46536a;line-height:1.65;margin:0;max-width:75ch}.home-options{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:1.5rem;align-items:stretch}.home-options section{display:flex;flex-direction:column}.home-options section h2{font-size:1.3rem;color:#172033;margin:0 0 .4rem}.home-options section>p{color:#55627a;margin:0 0 .9rem;font-size:1rem}.home-options .choice-card.recommended{margin:0;padding:1.4rem;border:1.5px solid #174ea6;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(23,78,166,.07);flex:1;display:flex;flex-direction:column;justify-content:space-between;transition:all .2s ease}.home-options .choice-card.recommended:hover{background:#f4f8ff;border-color:#0b3780;transform:translateY(-2px);box-shadow:0 6px 16px rgba(23,78,166,.12)}.home-options .choice-card strong{font-size:1.2rem;color:#174ea6;font-weight:750;margin-bottom:.35rem}.home-options .choice-card p{color:#4a5870;font-size:1rem;line-height:1.55;margin:.3rem 0 .9rem}.home-options .choice-card .action{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.55rem 1.15rem;background:#174ea6;color:#fff;border-radius:8px;font-weight:700;font-size:1rem;align-self:flex-start;margin-top:auto}.home-options .choice-card:hover .action{background:#0b3780}.home-secondary{padding:1.4rem;border:1px solid #d8dde6;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.04);display:flex;flex-direction:column}.home-secondary h2{font-size:1.25rem;color:#172033;margin:0 0 .75rem;padding-bottom:.5rem;border-bottom:1px solid #edf0f5}.home-secondary p{margin:.5rem 0}.home-secondary a{display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:.75rem 1rem;background:#f7f9fc;border:1px solid #d8dde6;border-radius:8px;text-decoration:none;color:#174ea6;font-weight:650;font-size:1.02rem;transition:all .15s ease}.home-secondary a:hover{background:#edf3fa;border-color:#174ea6;color:#0b3780}.home-secondary a::after{content:"➔";font-size:.9rem;color:#174ea6;margin-left:.5rem}.home-review{margin-top:1.75rem;padding:1.35rem 1.6rem;border:1px dashed #94a3b8;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.03)}.home-review h2{margin:0 0 .3rem;font-size:1.15rem;color:#334155}.home-review>p{margin:0 0 .9rem;color:#64748b;font-size:.95rem;line-height:1.6;max-width:80ch}.home-review .choice-card{margin:0;padding:.95rem 1.2rem;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;text-decoration:none}.home-review .choice-card:hover{background:#f1f5f9;border-color:#64748b}.home-review .choice-card strong{color:#1e293b;font-size:1.05rem;margin:0}.home-review .choice-card .action{margin:0;color:#174ea6;font-weight:700}.home-more{margin-top:1.5rem;padding:.85rem 1.2rem;background:#fff;border:1px solid #d8dde6;border-radius:10px}.home-more summary{font-weight:650;color:#174ea6}.content-main{max-width:1160px;margin:auto;padding:28px 20px}.content-main>h1{font-size:2.1rem;font-weight:800;color:#0f2c59;margin:0 0 .5rem}.content-main>p:first-of-type{font-size:1.12rem;color:#4a5870;line-height:1.65;margin:0 0 1.5rem;max-width:75ch}.content-main .module,.content-main .card{background:#fff;border:1px solid #d8dde6;border-radius:14px;padding:2rem 2.2rem;margin:1.5rem 0;box-shadow:0 1px 4px rgba(0,0,0,.04)}.content-main .module h2{font-size:1.35rem;font-weight:750;color:#172033;margin:0 0 .8rem;padding-bottom:.6rem;border-bottom:1px solid #edf0f5}.content-main details{border:1px solid #d8dde6;border-radius:10px;background:#fbfcfe;margin:.75rem 0;padding:.3rem .9rem;transition:all .15s ease}.content-main details[open]{background:#fff;border-color:#174ea6;box-shadow:0 2px 8px rgba(23,78,166,.06)}.content-main summary{cursor:pointer;padding:.7rem .4rem;min-height:44px;font-weight:650;color:#174ea6;font-size:1.05rem}.content-main .group-nav{display:flex;flex-wrap:wrap;gap:.75rem;margin:1.4rem 0}.content-main .group-nav a{padding:.65rem 1.15rem;border:1px solid #d8dde6;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;font-weight:650;background:#fff;color:#174ea6;transition:all .15s ease}.content-main .group-nav a:hover{background:#edf3fa;border-color:#174ea6}.content-main .group-nav [aria-current=page]{background:#174ea6;color:#fff;border-color:#174ea6}.content-main .steps{display:flex;gap:1rem;justify-content:space-between;margin:2rem 0}.content-main .steps a{padding:.75rem 1.4rem;background:#fff;border:1px solid #174ea6;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;font-weight:700;color:#174ea6;transition:all .15s ease}.content-main .steps a:hover{background:#edf3fa}@media(max-width:700px){.home-main{padding:16px}.home-intro{padding:1.25rem 1.1rem;border-radius:10px;margin-bottom:1.2rem}.home-intro h1{font-size:1.55rem}.home-intro p{font-size:1rem}.home-options{grid-template-columns:1fr;gap:1.2rem}.home-secondary{padding:1.1rem}.home-review{padding:1.1rem}.home-review .choice-card{flex-direction:column;align-items:flex-start}.content-main{padding:16px}.content-main>h1{font-size:1.55rem}.content-main>p:first-of-type{font-size:1rem}.content-main .module,.content-main .card{padding:1.2rem;border-radius:10px}}</style></head><body>${renderSiteHeader(language, route === "home" ? "home" : "journey", localeControl)}<main class="${route === "home" ? "home-main" : "content-main"}">${body}${options.review ? `<aside class="review-only">${message("entry.review.only")}</aside>` : ""}</main></body></html>`;
  const evidence = (item: AwarenessItem) => {
    let locations = item.source_locations;
    for (const source of item.sources) locations = locations.replaceAll('`' + source.source_id + '`', source.name);
    return `<details class="evidence"><summary>${message("entry.evidence")}</summary><ul>${item.sources.map((source) => `<li><a data-source-id="${source.source_id}" href="${escape(source.url)}">${escape(source.name)}</a></li>`).join("")}</ul><p>${escape(locations)}</p><small>${escape(pack.version)}</small></details>`;
  };
  const module = (item: AwarenessItem) => {
    const text = item.presentations[language];
    const paragraphs = text.body.split(/\n\n+/);
    // Intro and final caveats are always visible. Lists/formula detail is optional.
    // The process sequence itself stays visible so its essential meaning is not hidden.
    const canCollapse = paragraphs.length > 2 && item.id !== "AW-05" && item.id !== "AW-04";
    const body = canCollapse
      ? `${contentMarkup(paragraphs[0])}${contentMarkup(paragraphs.at(-1)!)}<details class="learn-more"><summary>${message("entry.more")}</summary>${contentMarkup(paragraphs.slice(1, -1).join("\n\n"))}</details>`
      : contentMarkup(text.body);
    return `<article class="module" data-content-id="${item.id}"><h2>${escape(text.title)}</h2>${body}${evidence(item)}</article>`;
  };
  try {
    if (route === "home") {
      const ta = language === "ta";
      const ownerEntry = options.ownerPreview ? `<section class="home-review" aria-labelledby="owner-explore"><h2 id="owner-explore">${ta ? "உரிமையாளர் ஆய்வு" : "Owner review"}</h2><p>${ta ? "2026 மூலப் பட்டியலிலுள்ள உண்மையான கல்லூரி–படிப்பு பதிவுகளை ஆய்வுக்காக மட்டும் பாருங்கள். கல்வி விளக்கங்கள் தனியாக ஒப்புதல் பெற வேண்டும்; இது மாணவர் வெளியீடு அல்ல." : "Browse real college–programme records from the 2026 source listing for review only. Educational explanations need separate approval; this is not a student release."}</p><a class="choice-card" href="/internal/m4-pilot?lang=${language}"><strong>${ta ? "படிப்புகள் மற்றும் கல்லூரிகளைப் பார்க்கலாம்" : "Explore courses and colleges"}</strong><span class="action">${message("entry.action")} →</span></a></section>` : "";
      return shell(`<div class="home-intro"><h1>${message("entry.site")}</h1><p>${message("entry.purpose")}</p></div><div class="home-options"><section aria-labelledby="entry-choice"><h2 id="entry-choice">${ta ? "முதல் முறையா? இங்கே தொடங்குங்கள்" : "First time? Start here"}</h2><p>${ta ? "எங்கிருந்து தொடங்குவது என்று தெரியாவிட்டாலும் பரவாயில்லை. மதிப்பெண்களோ தனிப்பட்ட விவரங்களோ தேவையில்லை." : "It is okay if you do not know where to begin. No marks or personal details are needed."}</p><a class="choice-card recommended" href="/journey${ta ? "" : "?lang=en"}"><strong>${message("entry.beginner")}</strong><p>${ta ? "படிப்பு → சேர்க்கை வழி → தயாரிப்பு. ஒவ்வொன்றாகப் புரிந்துகொள்ளலாம்." : "Understand the course, the admission pathway, and how to prepare, one step at a time."}</p><span class="action">${message("entry.action")} →</span></a></section><nav class="home-secondary" aria-label="${ta ? "நேரடி உதவி" : "Direct help"}"><h2>${ta ? "குறிப்பிட்ட உதவி வேண்டுமா?" : "Looking for specific help?"}</h2><p>${link("personal", "entry.personal")}</p><p>${link("counselling", "entry.counselling")}</p><p><a href="/colleges?lang=${language}">${ta ? "கல்லூரிகள் &amp; படிப்புகள் பட்டியல்" : "Browse colleges &amp; programmes"}</a></p></nav></div>${ownerEntry}<details class="home-more"><summary>${ta ? "அறிமுகப் பகுதிகளைத் தனியாகப் படிக்க" : "Read the introduction by topic"}</summary><p>${link("beginner", "entry.beginner")}</p></details>`);
    }
    const directions = `<nav aria-label="${message("entry.next")}"><h2>${message("entry.next")}</h2><ul>${route !== "beginner" ? `<li>${link("beginner", "entry.beginner")}</li>` : ""}${route !== "personal" ? `<li>${link("personal", "entry.personal")}</li>` : ""}<li>${link("home", "entry.return")}</li></ul></nav>`;
    if (route === "beginner") {
      const index = AWARENESS_GROUPS.indexOf(section);
      const groupNav = `<p class="notice">${language === "ta" ? "அறிமுகப் பகுதி" : "Introduction section"} ${index + 1} / ${AWARENESS_GROUPS.length}</p><details><summary>${language === "ta" ? "பொருளடக்கம் — வேறு பகுதியைப் பார்க்க" : "Contents — jump to another section"}</summary><nav class="group-nav" aria-label="${message("entry.next")}">${AWARENESS_GROUPS.map((group) => `<a href="${sectionHref(group.key)}"${group.key === section.key ? ' aria-current="page"' : ""}>${message(`entry.group.${group.key}`)}</a>`).join("")}</nav></details>`;
      const modules = section.ids.map((id) => module(pack.items.find((item) => item.id === id)!)).join("");
      const steps = `<nav class="steps">${index > 0 ? `<a href="${sectionHref(AWARENESS_GROUPS[index - 1].key)}">← ${message("entry.previous")}</a>` : ""}${index < 4 ? `<a href="${sectionHref(AWARENESS_GROUPS[index + 1].key)}">${message("entry.continue")} →</a>` : ""}</nav>`;
      const nextActions = section.key === "next" ? `<nav><a href="${sectionHref("engineering")}">${message("entry.group.engineering")}</a><p>${link("personal", "entry.personal")}</p><p>${link("counselling", "entry.counselling")}</p><a href="${escape(pack.items.find((item) => item.id === "AW-10")!.sources.find((source) => source.source_id === "SRC002")!.url)}">${message("entry.official")}</a></nav>` : "";
      const ownerProgrammeLink = options.ownerPreview && section.key === "engineering" ? `<aside class="home-review"><h2>${language === "ta" ? "உரிமையாளர் ஆய்வில் தொடருங்கள்" : "Continue in owner review"}</h2><p>${language === "ta" ? "பாடப்பிரிவுக் குறியீடுகளை இந்தப் பெரிய துறைகளுடன் இணைப்பதற்கான ஒப்புதல் இன்னும் இல்லை. உண்மையான 2026 பட்டியல் பெயர்கள் அனைத்தையும் தனியாகப் பார்க்கலாம்." : "Exact programme-code links to these broad study areas are not yet approved. You can browse every name in the real 2026 listing separately."}</p><a href="/internal/m4-pilot?lang=${language}&amp;view=branches">${language === "ta" ? "எல்லாப் படிப்புகளையும் பார்" : "Browse all programmes"}</a></aside>` : "";
      const cutoffWalkthrough = section.key === "admission" ? `<article class="module"><h2>${language === "ta" ? "கட்-ஆஃப் கணக்கீடு முறை (Cutoff Calculation)" : "TNEA Cutoff Calculation Formula"}</h2><p>${language === "ta" ? "பொறியியல் சேர்க்கையில் (TNEA), பொதுக் கலந்தாய்வு தரவரிசைக்கு 200 மதிப்பெண்களுக்கு கட்-ஆஃப் கணக்கிடப்படுகிறது." : "In Tamil Nadu Engineering Admissions (TNEA), academic merit cutoff is calculated on a 200-point scale for ranking."}</p><p class="formula"><strong>${language === "ta" ? "கட்-ஆஃப் = கணிதம் + (இயற்பியல் + வேதியியல்) / 2" : "Cutoff = Mathematics + (Physics + Chemistry) / 2"}</strong></p><p><strong>${language === "ta" ? "எடுத்துக்காட்டு:" : "Worked Example:"}</strong> ${language === "ta" ? "கணிதம் 90/100, இயற்பியல் 80/100, வேதியியல் 80/100 எனில்:<br>கட்-ஆஃப் = 90 + (80 + 80) / 2 = 90 + 80 = <strong>170 / 200</strong>." : "If marks are Maths 90/100, Physics 80/100, and Chemistry 80/100:<br>Cutoff = 90 + (80 + 80) / 2 = 90 + 80 = <strong>170 / 200</strong>."}</p><p class="notice">${language === "ta" ? "முக்கிய குறிப்பு: கட்-ஆஃப் மதிப்பு பொதுத் தரவரிசைக்கு (Merit Ranking) மட்டுமே பயன்படுகிறது. குறைந்தபட்ச கல்வித் தகுதி (Minimum Qualifying Marks) மற்றும் இடஒதுக்கீட்டு விதிகள் தனித்தனியாகக் கணக்கிடப்படும்." : "Important: The cutoff score is used for merit ranking only, while minimum qualifying eligibility and category rules are governed separately."}</p><p><a class="action" href="/personal?lang=${language}"><strong>${language === "ta" ? "உங்கள் மதிப்பெண்களுக்குக் கணக்கிட — கட்-ஆஃப் கால்குலேட்டர் →" : "Calculate for your subject marks — Cutoff Calculator →"}</strong></a></p></article>` : "";
      return shell(`<h1>${message(`entry.group.${section.key}`)}</h1><p>${message("entry.beginner.prompt")}</p>${groupNav}${modules}${cutoffWalkthrough}${steps}${nextActions}${ownerProgrammeLink}${section.key === "next" ? `<p><a href="/journey?step=check${language === "en" ? "&amp;lang=en" : ""}">${language === "ta" ? "தனிப்பட்ட சரிபார்ப்பைத் தொடங்க" : "Start the personal check"}</a></p>` : ""}<details><summary>${message("entry.next")}</summary>${directions}</details>`);
    }
    if (route === "personal") {
      const ta = language === "ta";
      const mVal = options.maths?.trim();
      const pVal = options.physics?.trim();
      const cVal = options.chemistry?.trim();
      const hasInputs = mVal !== undefined && pVal !== undefined && cVal !== undefined && mVal !== "" && pVal !== "" && cVal !== "";
      const mNum = hasInputs ? Number(mVal) : null;
      const pNum = hasInputs ? Number(pVal) : null;
      const cNum = hasInputs ? Number(cVal) : null;
      // P1-A: Reuse accepted ELG009 calculation authority
      const evaluation = hasInputs ? calculateAcademicCutoffFromRule(mNum, pNum, cNum) : null;
      const calculatedCutoff = evaluation?.cutoff ?? null;
      const cutoffDisplay = calculatedCutoff !== null ? `${calculatedCutoff.toFixed(2).replace(/\.?0+$/, "")} / 200` : "";
      const traceDisplay = calculatedCutoff !== null && mNum !== null && pNum !== null && cNum !== null
        ? `${mNum} + (${pNum} + ${cNum}) / 2 = ${calculatedCutoff.toFixed(2).replace(/\.?0+$/, "")}`
        : "";

      const resultBlock = `<section class="card cutoff-result" id="calc-result" aria-live="polite"${calculatedCutoff !== null ? "" : ' style="display:none"'}>
  <h2>${ta ? "கணக்கிடப்பட்ட கட்-ஆஃப் மதிப்பு" : "Calculated Academic Cutoff"}</h2>
  <p class="cutoff-score-display"><strong id="calc-score">${cutoffDisplay}</strong></p>
  <p class="formula-breakdown" id="calc-trace">${traceDisplay}</p>
  <div class="mandatory-warning">
    <p><strong>${ta ? "இது உங்கள் பாட மதிப்பெண்களிலிருந்து (கணிதம் 100, இயற்பியல் 50, வேதியியல் 50 எடையிடப்பட்டு) 200-க்குக் கணக்கிடப்பட்ட கட்-ஆஃப் மதிப்பு மட்டுமே." : "This is the composite cutoff score calculated out of 200 from your subject marks (Maths 100, Physics 50, Chemistry 50)."}</strong></p>
    <p>${ta ? "கட்-ஆஃப் என்பது தரவரிசை (Merit Rank) அல்ல. அதிகாரப்பூர்வ தரவரிசையானது, அனைத்து மாணவர்களின் கட்-ஆஃப், சம மதிப்பெண் சமன் செய்யும் விதிகள் (Tie-break rules) மற்றும் வகுப்புவாரி இடஒதுக்கீட்டுப் பிரிவுகளின் அடிப்படையில் TNEA குழுவால் அதிகாரப்பூர்வமாக வெளியிடப்படும். இது சேர்க்கைக்கான உத்தரவாதம் அல்ல." : "A cutoff score is not an official merit rank. Official merit ranking is determined by TNEA taking into account all candidates' scores, tie-breaking rules, and reservation categories. This score alone does not guarantee admission or a college seat."}</p>
    <p class="source-ref"><small>${ta ? "TNEA 2026 அதிகாரப்பூர்வ சேர்க்கை நடைமுறைகளின்படி" : "According to official TNEA 2026 admission procedures"} (${ta ? "ஆதாரம்: " : "Source: "}<a href="https://www.tneaonline.org/" target="_blank" rel="noopener">www.tneaonline.org</a>)</small></p>
  </div>
  <div class="calc-next-actions">
    <a class="action" href="/colleges?lang=${language}">${ta ? "கல்லூரிகள் மற்றும் படிப்புகளைப் பார்க்க →" : "Explore colleges and programmes →"}</a>
    <a class="action secondary" href="/counselling?lang=${language}">${ta ? "கலந்தாய்வு நடைமுறைகள் மற்றும் வழிகாட்டல் →" : "TNEA Counselling procedures &amp; guidance →"}</a>
  </div>
</section>`;

      // P0-A: Form uses nonpersistent POST, never GET query params
      const formBlock = `<section class="card cutoff-calculator">
  <h2>${ta ? "கட்-ஆஃப் கணக்கிடும் கருவி (Cutoff Calculator)" : "Instant Cutoff Calculator"}</h2>
  <p>${ta ? "உங்கள் +2 பொதுத்தேர்வு கணிதம், இயற்பியல், வேதியியல் மதிப்பெண்களை (100-க்கு) உள்ளிட்டு கட்-ஆஃப் மதிப்பைக் கணக்கிடுங்கள்:" : "Enter your standard 100-point marks for Mathematics, Physics, and Chemistry to calculate your academic cutoff:"}</p>
  <form id="cutoff-calc-form" method="POST" action="/personal?lang=${language}">
    <div class="calc-grid">
      <div class="calc-row">
        <label for="calc-m">${ta ? "கணிதம் (Maths / 100):" : "Mathematics (out of 100):"}</label>
        <input type="number" id="calc-m" name="maths" min="0" max="100" step="0.5" required placeholder="0 - 100" value="${escape(mVal ?? "")}">
      </div>
      <div class="calc-row">
        <label for="calc-p">${ta ? "இயற்பியல் (Physics / 100):" : "Physics (out of 100):"}</label>
        <input type="number" id="calc-p" name="physics" min="0" max="100" step="0.5" required placeholder="0 - 100" value="${escape(pVal ?? "")}">
      </div>
      <div class="calc-row">
        <label for="calc-c">${ta ? "வேதியியல் (Chemistry / 100):" : "Chemistry (out of 100):"}</label>
        <input type="number" id="calc-c" name="chemistry" min="0" max="100" step="0.5" required placeholder="0 - 100" value="${escape(cVal ?? "")}">
      </div>
    </div>
    <button type="submit" class="calc-submit-btn">${ta ? "கட்-ஆஃப் கணக்கிடுக" : "Calculate Cutoff"}</button>
  </form>
</section>`;

      // P1-B: Stale results cleared on invalid/blank input; P0-A: No storage or analytics leakage
      const clientScript = `<script>(function(){var fm=document.getElementById('calc-m'),fp=document.getElementById('calc-p'),fc=document.getElementById('calc-c'),r=document.getElementById('calc-result'),sc=document.getElementById('calc-score'),tr=document.getElementById('calc-trace'),f=document.getElementById('cutoff-calc-form');if(!fm||!fp||!fc||!r||!sc)return;function recompute(){var mv=fm.value.trim(),pv=fp.value.trim(),cv=fc.value.trim();if(mv===''||pv===''||cv===''){sc.textContent='';if(tr)tr.textContent='';r.style.display='none';return;}var m=Number(mv),p=Number(pv),c=Number(cv);if(isNaN(m)||isNaN(p)||isNaN(c)||m<0||m>100||p<0||p>100||c<0||c>100){sc.textContent='';if(tr)tr.textContent='';r.style.display='none';return;}var score=m+(p+c)/2;var scoreStr=(Math.round(score*100)/100).toString()+' / 200';sc.textContent=scoreStr;if(tr)tr.textContent=m+' + ('+p+' + '+c+') / 2 = '+(Math.round(score*100)/100);r.style.display='block';}fm.addEventListener('input',recompute);fp.addEventListener('input',recompute);fc.addEventListener('input',recompute);fm.addEventListener('change',recompute);fp.addEventListener('change',recompute);fc.addEventListener('change',recompute);if(f){f.addEventListener('submit',function(e){e.preventDefault();recompute();});}})();</script>`;

      const journeyCard = `<section class="card"><h2>${ta ? "முழுமையான தகுதி மற்றும் விதி வழிகாட்டல்" : "Complete Eligibility & Rule-Based Guidance"}</h2><p>${CHECK_COPY.personalIntro[language === "ta" ? 0 : 1]}</p><a class="choice-card" href="/journey?step=check${language === "en" ? "&amp;lang=en" : ""}"><strong>${CHECK_COPY.start[language === "ta" ? 0 : 1]}</strong></a>${language === "ta" ? `<details class="card"><summary>${message("entry.personal.open")}</summary><p>${message("entry.personal.limit")}</p><a href="/personal/reference?lang=ta">${message("entry.personal.open")}</a></details>` : ""}</section>`;

      return shell(`<h1>${message("entry.personal")}</h1>${resultBlock}${formBlock}${clientScript}${journeyCard}${directions}`);
    }
    if (route === "counselling") {
      const ta = language === "ta";
      // P0-B & P0-C & P1-C: Corrected official TNEA 2026 counselling procedures, Accept & Upward conditions, and 7.5% Government school quota evidence
      const counsellingProcedures = `<section class="card" aria-labelledby="counsel-rules">
  <h2 id="counsel-rules">${ta ? "முக்கிய கலந்தாய்வு நடைமுறைகள் (TNEA Counselling Procedures)" : "Key TNEA Counselling Procedures & Guidance"}</h2>
  <article class="module">
    <h3>${ta ? "1. விருப்ப வரிசை மற்றும் ஒதுக்கீடு முறை (Choice Ordering & Allotment)" : "1. Choice Ordering & Seat Allotment"}</h3>
    <p>${ta ? "கலந்தாய்வு முறை உங்கள் விருப்பப் பட்டியலில் உள்ள விருப்பங்களை வரிசை 1-லிருந்து வரிசையாக (Choice 1 to N) மட்டுமே பரிசீலிக்கும். உங்கள் கட்-ஆஃப் தரவரிசை (Rank), வகுப்பு இடஒதுக்கீடு (Community Reservation) மற்றும் அப்போதைய காலி இடங்களின் அடிப்படையில் கிடைக்கும் மிக உயர்ந்த முன்னுரிமை விருப்பம் மட்டுமே ஒதுக்கப்படும். எந்த முடிவும் யூகத்தின் அடிப்படையில் தானாக பூட்டப்படுவதில்லை." : "The allotment algorithm evaluates choices sequentially from Choice 1 downward. Based on your merit rank, community reservation, and seat matrix vacancies, it allots the highest preference where an eligible seat is available. The algorithm evaluates your choices in sequence and does not lock arbitrary predictions."}</p>
    <p class="notice">${ta ? "குறிப்பு: நீங்கள் விரும்பும் சிறந்த கல்லூரியை வரிசை 1-ல் வைக்க வேண்டும். தவறான வரிசை தேவையற்ற இட ஒதுக்கீட்டுக்கு வழிவகுக்கும்." : "Tip: Rank your most preferred college and branch combinations at the top. Order strictly reflects your true preference."}</p>
  </article>
  <article class="module">
    <h3>${ta ? "2. மேல்நோக்கிய நகர்வு தேர்வுகள் (Upward Movement Rules)" : "2. Upward Movement Rules (Accept vs Decline)"}</h3>
    <div class="counselling-rules-grid">
      <div class="rule-card">
        <h4>${ta ? "ஏற்றுக்கொண்டு மேல்நோக்கி நகர்தல் (Accept &amp; Upward)" : "Accept &amp; Upward Movement"}</h4>
        <p>${ta ? "தற்போது தற்காலிகமாக ஒதுக்கப்பட்ட இடத்தை ஏற்றுக்கொண்டு, உங்கள் விருப்பப் பட்டியலில் மேலே உள்ள விருப்பங்களுக்கு வாய்ப்பு உள்ளதா என்று கோருகிறீர்கள்." : "You accept the currently tentatively allotted seat while requesting consideration for higher-preference choices on your list."}</p>
        <p class="rule-condition"><strong>${ta ? "முக்கிய நிபந்தனை மற்றும் விதிவிலக்குகள்:" : "Mandatory Conditions &amp; Exceptions:"}</strong> ${ta ? "இந்த விருப்பத்தைத் தேர்ந்தெடுக்கும் மாணவர், TNEA உதவி மையத்தில் (TFC) குறிப்பிட்ட காலக்கெடுவுக்குள் நேரில் சென்று, அசல் சான்றிதழ்களைச் சமர்ப்பித்து, உரிய கட்டணத்தைச் செலுத்தி (7.5% அரசுப் பள்ளி அல்லது SC/ST/முதல் பட்டதாரி போன்ற கட்டண விலக்கு உள்ளவர்கள் தவிர) சேர்க்கையை உறுதி செய்ய வேண்டும். மேலே உள்ள விருப்பங்களில் இடம் கிடைத்தால், முந்தைய ஒதுக்கீடு ரத்தாகி புதிய இடம் இறுதியாகும். மேலே இடம் கிடைக்காவிட்டால், TFC நடைமுறைகளை காலக்கெடுவுக்குள் முடித்திருந்தால் மட்டுமே முந்தைய ஒதுக்கீடு பாதுகாக்கப்படும்; தவறினால் இந்த ஒதுக்கீடு ரத்தாகும்." : "Candidates selecting this option must report in person to a TNEA Facilitation Centre (TFC) within the stipulated schedule, submit original certificates for verification, and pay the prescribed fee (unless eligible for fee concession or exemption such as 7.5% Government school quota or SC/ST/First Graduate). If a higher-preference seat becomes available, the earlier allotment is cancelled and the new allotment is finalized. If no higher seat becomes available, the earlier allotment is retained only if all TFC reporting and confirmation requirements were completed on time; otherwise, the allotment is forfeited."}</p>
      </div>
      <div class="rule-card">
        <h4>${ta ? "நிராகரித்து மேல்நோக்கி நகர்தல் (Decline &amp; Upward)" : "Decline &amp; Upward Movement"}</h4>
        <p>${ta ? "தற்போது தற்காலிகமாக ஒதுக்கப்பட்ட இடத்தை நீங்கள் முற்றிலும் விட்டுவிடுகிறீர்கள் (Relinquish). இதற்கு TFC மையத்தில் கட்டணம் செலுத்தவோ அறிக்கை சமர்ப்பிக்கவோ தேவையில்லை." : "You explicitly relinquish the current tentative allotment without reporting or paying fees at TFC for that seat."}</p>
        <p class="rule-condition"><strong>${ta ? "சுற்று விதிமுறை:" : "Round Rules:"}</strong> ${ta ? "மேல் விருப்பங்களில் இடம் கிடைத்தால் மட்டுமே ஒதுக்கப்படும். ஒருவேளை மேல் விருப்பங்களில் இடம் கிடைக்காவிட்டால், இந்த சுற்றில் ஒதுக்கப்பட்ட இடம் மீண்டும் கிடைக்காது; ஆனால் TNEA கலந்தாய்வு விதிகளின்படி அடுத்த சுற்றுகளில் (Subsequent Rounds) அல்லது துணை கலந்தாய்வில் பங்கேற்கும் தகுதி தக்கவைக்கப்படும்." : "If higher-preference seats become available, they will be allotted. If upward movement does not produce a higher choice, the relinquished seat is lost for that round, but eligibility to participate in subsequent rounds or supplementary counselling is retained per TNEA counselling rules."}</p>
      </div>
    </div>
  </article>
  <article class="module">
    <h3>${ta ? "3. 7.5% அரசுப் பள்ளி முன்னுரிமை இடஒதுக்கீடு (7.5% Govt School Quota)" : "3. 7.5% Government School Quota"}</h3>
    <p><strong>${ta ? "கல்வித் தகுதி (Eligibility):" : "Eligibility:"}</strong> ${ta ? "தமிழ்நாடு அரசுப் பள்ளிகளில் (அரசு, மாநகராட்சி, நகராட்சி, ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலம், வனத்துறை, கள்ளர் சீரமைப்புப் பள்ளிகள்) 6-ஆம் வகுப்பு முதல் 12-ஆம் வகுப்பு வரை தொடர்ந்து படித்த மாணவர்கள் இதற்குத் தகுதியுடையவர்கள்." : "Candidates who studied continuously from Standard 6 to Standard 12 in Tamil Nadu Government schools (including Government, Corporation, Municipal, Adi Dravidar and Tribal Welfare, Forest, and Kallar Reclamation schools)."}</p>
    <p><strong>${ta ? "ஆவணச் சரிபார்ப்பு (Document Verification):" : "Document Verification:"}</strong> ${ta ? "6 முதல் 12-ஆம் வகுப்பு வரை படித்த அரசுப் பள்ளிகளின் தலைமை ஆசிரியரிடமிருந்து பெறப்பட்ட கல்விச் சான்றிதழ் (School Study Certificate / EMIS பதிவு) TNEA உதவி மையங்களில் (TFC) அதிகாரப்பூர்வமாகச் சரிபார்க்கப்படும். விதிகளில் இல்லாத கூடுதல் கையொப்பக் கட்டுப்பாடுகள் தேவையில்லை." : "School study certificates for Standards 6 through 12 issued by the Headmaster of the concerned Government school(s) (or verified via EMIS portal records) are officially verified at TNEA Facilitation Centres (TFC). Universal countersignature requirements are not asserted."}</p>
    <p><strong>${ta ? "இட ஒதுக்கீட்டு உரிமை (Entitlement Distinction):" : "Entitlement Distinction:"}</strong> ${ta ? "சான்றிதழ் சமர்ப்பித்திருப்பது ஒதுக்கீட்டுப் பரிசீலனைக்கான தகுதியை மட்டுமே தரும்; அதுவே தானாக கல்லூரி இடத்தை உறுதி செய்யாது. அரசுப் பள்ளித் தரவரிசை (Govt Rank), வகுப்பு இடஒதுக்கீடு மற்றும் 7.5% காலி இடங்களின் அடிப்படையிலேயே இறுதி ஒதுக்கீடு செய்யப்படும். இத்தகுதியுடைய மாணவர்களுக்குக் கல்விக் கட்டணம் மற்றும் விடுதிக் கட்டணத்தை அரசே ஏற்கும்." : "Fulfilling study criteria and verification establishes eligibility for quota consideration; it does not constitute an automatic seat guarantee. Final allotment is governed strictly by the candidate's Government School merit rank, community reservation, and 7.5% seat matrix availability. Qualifying candidates are entitled to government tuition and hostel fee assistance."}</p>
  </article>
  <p class="notice"><small>${ta ? "2026 TNEA அதிகாரப்பூர்வ கலந்தாய்வு நடைமுறைகளின்படி" : "According to official TNEA 2026 counselling procedures"} (${ta ? "ஆதாரம்: " : "Source: "}<a href="https://www.tneaonline.org/" target="_blank" rel="noopener">www.tneaonline.org</a> / TNEA 2026 Information Brochure)</small></p>
  <div class="counselling-actions">
    <a href="/colleges?lang=${language}">${ta ? "கல்லூரிகள் மற்றும் பாடப்பிரிவுகள் பட்டியல் பார்க்க →" : "Browse Colleges and Programmes Directory →"}</a>
    <a href="/personal?lang=${language}">${ta ? "கட்-ஆஃப் கணக்கிடும் கருவிக்குச் செல்ல →" : "Go to Cutoff Calculator →"}</a>
  </div>
</section>`;

      return shell(`<h1>${message("entry.counselling")}</h1><p>${message("entry.counselling.intro")}</p><nav class="group-nav">${["admission", "choices", "support", "next"].map((key) => `<a href="${sectionHref(key)}">${message(`entry.group.${key}` as StudentSemanticMessage["key"])}</a>`).join("")}</nav>${counsellingProcedures}${directions}`);
    }
    return shell(`<h1>${message("entry.counselling")}</h1><p>${message("entry.counselling.intro")}</p><nav class="group-nav">${["admission", "choices", "support", "next"].map((key) => `<a href="${sectionHref(key)}">${message(`entry.group.${key}` as StudentSemanticMessage["key"])}</a>`).join("")}</nav>${directions}`);
  } catch (error) {
    if (!(error instanceof MissingStudentPresentationError)) throw error;
    // Known catalogue safety messages do not use the potentially incomplete resolver.
    const safe = (key: StudentSemanticMessage["key"]) => escape(resolveStudentMessage({ key }, language));
    return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe("entry.site")}</title></head><body><main><p role="status">${safe("entry.missing")}</p><a href="${entryHref("home", language)}">${safe("entry.return")}</a><p><a lang="en" href="${entryHref(route, "en")}">${safe("entry.english")}</a></p></main></body></html>`;
  }
}

// Keeps the accepted reference renderer intact. Locale only controls return navigation.
export function renderReferenceGuidancePage(state: StudentGuidancePageState, language: StudentLanguage): string {
  const message = (key: StudentSemanticMessage["key"]) => escape(resolveStudentMessage({ key }, language));
  const navigation = `<nav lang="${language}"><a href="${entryHref("home", language)}">${message("entry.return")}</a><h2>${message("entry.reference.title")}</h2><p>${message("entry.reference.context")}</p></nav>`;
  return renderStudentGuidancePage(state)
    .replace('<main class="page">', `<main class="page">${navigation}`)
    .replace('action="/guidance"', `action="/guidance?lang=${language}"`);
}

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

type MessageResolver = (message: StudentSemanticMessage, language: StudentLanguage) => string;

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const STYLE = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:18px/1.7 "Nirmala UI","Noto Sans Tamil","Latha",system-ui,sans-serif;letter-spacing:normal}main{max-width:780px;margin:auto;padding:24px}h1{font-size:1.8rem}h2{font-size:1.35rem}h3{font-size:1.15rem}h1,h2,h3{line-height:1.55;margin:0 0 1rem}p{margin:.5rem 0 1.2rem}a{color:#174ea6;text-underline-offset:.2em}a:focus-visible,summary:focus-visible{outline:3px solid #174ea6;outline-offset:4px}.languages{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem}.languages a,summary{padding:.5rem 0}.choice-card,.card,.awareness{padding:1.3rem;border:1px solid #d8dde6;border-radius:12px;background:white;margin:1.2rem 0}.choice-card{display:block;text-decoration:none;color:inherit;transition:background .15s}.choice-card:hover,.choice-card:focus-visible{background:#eef4ff;border-color:#174ea6}.choice-card strong{display:block;color:#174ea6;font-size:1.15rem}.choice-card .action{display:inline-flex;align-items:center;min-height:44px;color:#174ea6;font-weight:650;margin-top:.7rem}.choice-card p{margin:.5rem 0}.notice{font-size:.9rem;color:#46536a}nav ul{padding-left:1.2rem}nav li{margin:.7rem 0}details{margin-top:1rem}summary{cursor:pointer;color:#174ea6}.module{margin:2rem 0;padding-bottom:1.5rem;border-bottom:1px solid #d8dde6}.module li{margin:.65rem 0}.formula{white-space:normal;overflow-wrap:anywhere;padding:.7rem;background:#eef1f5}.group-nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0}.group-nav a{padding:.5rem .7rem;border:1px solid #d8dde6;border-radius:8px;min-height:44px;display:inline-flex;align-items:center}.group-nav [aria-current=page]{background:#174ea6;color:white}.steps{display:flex;gap:1rem;justify-content:space-between;margin:1.5rem 0}.steps a{padding:.65rem;min-height:44px;display:inline-flex;align-items:center}.review-only{border:2px dashed #6b7280;padding:1rem;margin-top:2rem}@media(max-width:35rem){body{font-size:17px}main{padding:16px}.choice-card,.card,.awareness{padding:1rem}h1{font-size:1.6rem}.group-nav{font-size:.9rem}}`;

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

export function renderStudentEntryPage(
  state: StudentEntryState,
  pack: AwarenessPack,
  resolve: MessageResolver = resolveStudentMessage,
  options: { readonly section?: string; readonly review?: boolean; readonly ownerPreview?: boolean } = {},
): string {
  const { language, route } = state;
  const message = (key: StudentSemanticMessage["key"]) => escape(resolve({ key }, language));
  const section = AWARENESS_GROUPS.find((group) => group.key === options.section) ?? AWARENESS_GROUPS[0];
  const sectionHref = (key: string, targetLanguage = language) => `${entryHref("beginner", targetLanguage)}&section=${key}${options.review ? "&review=1" : ""}`;
  const localeHref = (targetLanguage: StudentLanguage) => route === "beginner" ? sectionHref(section.key, targetLanguage) : `${entryHref(route, targetLanguage)}${options.review ? "&review=1" : ""}`;
  const link = (target: EntryRoute, key: StudentSemanticMessage["key"]) =>
    `<a href="${entryHref(target, language)}">${message(key)}</a>`;
  const localeControl = `<a lang="ta" href="${localeHref("ta")}"${language === "ta" ? ' aria-current="page"' : ""}>தமிழ்</a><a lang="en" href="${localeHref("en")}"${language === "en" ? ' aria-current="page"' : ""}>English</a>`;
  const shell = (body: string) => `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${message("entry.site")}</title><style>${STYLE}${SITE_SHELL_CSS}.home-main{max-width:1060px}.home-intro{max-width:68ch}.home-options{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:1.25rem;align-items:start}.home-options .choice-card{margin:.4rem 0}.home-secondary{padding:1rem;border:1px solid #d8dde6;border-radius:10px;background:#fff}.home-secondary h2{margin-top:0}.home-secondary p{margin:.6rem 0}.home-secondary a{display:inline-flex;min-height:44px;align-items:center}.home-review{max-width:68ch;margin-top:1.5rem;padding:1rem;border:1px dashed #6b7280;border-radius:10px}.home-review h2{margin:0}.home-review .choice-card{margin:.6rem 0 0}.home-more{max-width:68ch;margin-top:1.5rem}.home-main h1{margin-top:.2rem}@media(max-width:700px){.home-options{grid-template-columns:1fr}.home-secondary{padding:.9rem}}</style></head><body>${renderSiteHeader(language, route === "home" ? "home" : "journey", localeControl)}<main${route === "home" ? ' class="home-main"' : ""}>${body}${options.review ? `<aside class="review-only">${message("entry.review.only")}</aside>` : ""}</main></body></html>`;
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
      return shell(`<div class="home-intro"><h1>${message("entry.site")}</h1><p>${message("entry.purpose")}</p></div><div class="home-options"><section aria-labelledby="entry-choice"><h2 id="entry-choice">${ta ? "முதல் முறையா? இங்கே தொடங்குங்கள்" : "First time? Start here"}</h2><p>${ta ? "எங்கிருந்து தொடங்குவது என்று தெரியாவிட்டாலும் பரவாயில்லை. மதிப்பெண்களோ தனிப்பட்ட விவரங்களோ தேவையில்லை." : "It is okay if you do not know where to begin. No marks or personal details are needed."}</p><a class="choice-card recommended" href="/journey${ta ? "" : "?lang=en"}"><strong>${message("entry.beginner")}</strong><p>${ta ? "படிப்பு → சேர்க்கை வழி → தயாரிப்பு. ஒவ்வொன்றாகப் புரிந்துகொள்ளலாம்." : "Understand the course, the admission pathway, and how to prepare, one step at a time."}</p><span class="action">${message("entry.action")} →</span></a></section><nav class="home-secondary" aria-label="${ta ? "நேரடி உதவி" : "Direct help"}"><h2>${ta ? "குறிப்பிட்ட உதவி வேண்டுமா?" : "Looking for specific help?"}</h2><p>${link("personal", "entry.personal")}</p><p>${link("counselling", "entry.counselling")}</p></nav></div>${ownerEntry}<details class="home-more"><summary>${ta ? "அறிமுகப் பகுதிகளைத் தனியாகப் படிக்க" : "Read the introduction by topic"}</summary><p>${link("beginner", "entry.beginner")}</p></details>`);
    }
    const directions = `<nav aria-label="${message("entry.next")}"><h2>${message("entry.next")}</h2><ul>${route !== "beginner" ? `<li>${link("beginner", "entry.beginner")}</li>` : ""}${route !== "personal" ? `<li>${link("personal", "entry.personal")}</li>` : ""}<li>${link("home", "entry.return")}</li></ul></nav>`;
    if (route === "beginner") {
      const index = AWARENESS_GROUPS.indexOf(section);
      const groupNav = `<p class="notice">${language === "ta" ? "அறிமுகப் பகுதி" : "Introduction section"} ${index + 1} / ${AWARENESS_GROUPS.length}</p><details><summary>${language === "ta" ? "பொருளடக்கம் — வேறு பகுதியைப் பார்க்க" : "Contents — jump to another section"}</summary><nav class="group-nav" aria-label="${message("entry.next")}">${AWARENESS_GROUPS.map((group) => `<a href="${sectionHref(group.key)}"${group.key === section.key ? ' aria-current="page"' : ""}>${message(`entry.group.${group.key}`)}</a>`).join("")}</nav></details>`;
      const modules = section.ids.map((id) => module(pack.items.find((item) => item.id === id)!)).join("");
      const steps = `<nav class="steps">${index > 0 ? `<a href="${sectionHref(AWARENESS_GROUPS[index - 1].key)}">← ${message("entry.previous")}</a>` : ""}${index < 4 ? `<a href="${sectionHref(AWARENESS_GROUPS[index + 1].key)}">${message("entry.continue")} →</a>` : ""}</nav>`;
      const nextActions = section.key === "next" ? `<nav><a href="${sectionHref("engineering")}">${message("entry.group.engineering")}</a><p>${link("personal", "entry.personal")}</p><p>${link("counselling", "entry.counselling")}</p><a href="${escape(pack.items.find((item) => item.id === "AW-10")!.sources.find((source) => source.source_id === "SRC002")!.url)}">${message("entry.official")}</a></nav>` : "";
      const ownerProgrammeLink = options.ownerPreview && section.key === "engineering" ? `<aside class="home-review"><h2>${language === "ta" ? "உரிமையாளர் ஆய்வில் தொடருங்கள்" : "Continue in owner review"}</h2><p>${language === "ta" ? "பாடப்பிரிவுக் குறியீடுகளை இந்தப் பெரிய துறைகளுடன் இணைப்பதற்கான ஒப்புதல் இன்னும் இல்லை. உண்மையான 2026 பட்டியல் பெயர்கள் அனைத்தையும் தனியாகப் பார்க்கலாம்." : "Exact programme-code links to these broad study areas are not yet approved. You can browse every name in the real 2026 listing separately."}</p><a href="/internal/m4-pilot?lang=${language}&amp;view=branches">${language === "ta" ? "எல்லாப் படிப்புகளையும் பார்" : "Browse all programmes"}</a></aside>` : "";
      return shell(`<h1>${message(`entry.group.${section.key}`)}</h1><p>${message("entry.beginner.prompt")}</p>${groupNav}${modules}${steps}${nextActions}${ownerProgrammeLink}${section.key === "next" ? `<p><a href="/journey?step=check${language === "en" ? "&amp;lang=en" : ""}">${language === "ta" ? "தனிப்பட்ட சரிபார்ப்பைத் தொடங்க" : "Start the personal check"}</a></p>` : ""}<details><summary>${message("entry.next")}</summary>${directions}</details>`);
    }
    if (route === "personal") {
      return shell(`<h1>${message("entry.personal")}</h1><p>${CHECK_COPY.personalIntro[language === "ta" ? 0 : 1]}</p><a class="choice-card" href="/journey?step=check${language === "en" ? "&amp;lang=en" : ""}"><strong>${CHECK_COPY.start[language === "ta" ? 0 : 1]}</strong></a>${language === "ta" ? `<details class="card"><summary>${message("entry.personal.open")}</summary><p>${message("entry.personal.limit")}</p><a href="/personal/reference?lang=ta">${message("entry.personal.open")}</a></details>` : ""}${directions}`);
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

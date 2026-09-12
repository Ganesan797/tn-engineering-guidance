import {
  MissingStudentPresentationError, resolveStudentMessage,
  type StudentLanguage, type StudentSemanticMessage,
} from "../student-semantics/index.ts";
import type { EntryRoute, StudentEntryState } from "../student-entry/models.ts";
import { entryHref } from "../student-entry/routing.ts";
import { renderStudentGuidancePage, type StudentGuidancePageState } from "./student-guidance.ts";
import { AWARENESS_GROUPS, type AwarenessItem, type AwarenessPack } from "../student-semantics/awareness.ts";

type MessageResolver = (message: StudentSemanticMessage, language: StudentLanguage) => string;

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const STYLE = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:18px/1.7 "Nirmala UI","Noto Sans Tamil","Latha",system-ui,sans-serif;letter-spacing:normal}main{max-width:752px;margin:auto;padding:24px}h1{font-size:1.8rem}h2{font-size:1.35rem}h3{font-size:1.15rem}h1,h2,h3{line-height:1.55;margin:0 0 1rem}p{margin:.5rem 0 1.2rem}a{color:#174ea6;text-underline-offset:.2em}a:focus-visible,summary:focus-visible{outline:3px solid #174ea6;outline-offset:4px}.languages{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem}.languages a,summary{padding:.5rem 0}.choice-card,.card,.awareness{padding:1.3rem;border:1px solid #d8dde6;border-radius:.6rem;background:white;margin:1.2rem 0}.choice-card{display:block;text-decoration:none;color:inherit;transition:background .15s}.choice-card:hover,.choice-card:focus-visible{background:#eef4ff;border-color:#174ea6}.choice-card strong{display:block;color:#174ea6;font-size:1.15rem}.choice-card .action{display:block;color:#174ea6;font-weight:650;margin-top:.7rem}.choice-card p{margin:.5rem 0}.notice{font-size:.9rem;color:#46536a}nav ul{padding-left:1.2rem}nav li{margin:.7rem 0}details{margin-top:1rem}summary{cursor:pointer;color:#174ea6}.module{margin:2rem 0;padding-bottom:1.5rem;border-bottom:1px solid #d8dde6}.module li{margin:.65rem 0}.formula{white-space:normal;overflow-wrap:anywhere;padding:.7rem;background:#eef1f5}.group-nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0}.group-nav a{padding:.5rem .7rem;border:1px solid #d8dde6;border-radius:.4rem}.group-nav [aria-current=page]{background:#174ea6;color:white}.steps{display:flex;gap:1rem;justify-content:space-between;margin:1.5rem 0}.steps a{padding:.65rem}.review-only{border:2px dashed #6b7280;padding:1rem;margin-top:2rem}@media(max-width:35rem){body{font-size:17px}main{padding:16px}.choice-card,.card,.awareness{padding:1rem}h1{font-size:1.6rem}.group-nav{font-size:.9rem}}`;

// Limited rendering of the frozen pack's paragraphs, lists and formula blocks; no raw HTML.
function contentMarkup(text: string): string {
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
  options: { readonly section?: string; readonly review?: boolean } = {},
): string {
  const { language, route } = state;
  const message = (key: StudentSemanticMessage["key"]) => escape(resolve({ key }, language));
  const section = AWARENESS_GROUPS.find((group) => group.key === options.section) ?? AWARENESS_GROUPS[0];
  const sectionHref = (key: string, targetLanguage = language) => `${entryHref("beginner", targetLanguage)}&section=${key}${options.review ? "&review=1" : ""}`;
  const localeHref = (targetLanguage: StudentLanguage) => route === "beginner" ? sectionHref(section.key, targetLanguage) : `${entryHref(route, targetLanguage)}${options.review ? "&review=1" : ""}`;
  const link = (target: EntryRoute, key: StudentSemanticMessage["key"]) =>
    `<a href="${entryHref(target, language)}">${message(key)}</a>`;
  const shell = (body: string) => `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${message("entry.site")}</title><style>${STYLE}</style></head><body><main><nav class="languages" aria-label="${message("entry.language")}"><span>${message("entry.language")}</span><a lang="ta" href="${localeHref("ta")}"${language === "ta" ? ' aria-current="true"' : ""}>தமிழ்</a><a lang="en" href="${localeHref("en")}"${language === "en" ? ' aria-current="true"' : ""}>English</a></nav>${body}${options.review ? `<aside class="review-only">${message("entry.review.only")}</aside>` : ""}</main></body></html>`;
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
    const canCollapse = paragraphs.length > 2 && item.id !== "AW-05";
    const body = canCollapse
      ? `${contentMarkup(paragraphs[0])}${contentMarkup(paragraphs.at(-1)!)}<details class="learn-more"><summary>${message("entry.more")}</summary>${contentMarkup(paragraphs.slice(1, -1).join("\n\n"))}</details>`
      : contentMarkup(text.body);
    return `<article class="module" data-content-id="${item.id}"><h2>${escape(text.title)}</h2>${body}${evidence(item)}</article>`;
  };
  try {
    const first = pack.items[0];
    const awareness = `<section class="awareness" data-content-id="${first.id}"><h2>${escape(first.presentations[language].title)}</h2>${contentMarkup(first.presentations[language].body)}${evidence(first)}</section>`;
    if (route === "home") {
      return shell(`<h1>${message("entry.site")}</h1><p>${message("entry.purpose")}</p><section aria-labelledby="entry-choice"><h2 id="entry-choice">${message("entry.choose")}</h2>${(["beginner", "personal", "counselling"] as const).map((target) => `<a class="choice-card" href="${entryHref(target, language)}"><strong>${message(`entry.${target}`)}</strong><p>${message(`entry.${target}.description`)}</p><span class="action">${message("entry.action")} →</span></a>`).join("")}<p>${link("beginner", "entry.unsure")}</p></section>${awareness}`);
    }
    const directions = `<nav aria-label="${message("entry.next")}"><h2>${message("entry.next")}</h2><ul>${route !== "beginner" ? `<li>${link("beginner", "entry.beginner")}</li>` : ""}${route !== "personal" ? `<li>${link("personal", "entry.personal")}</li>` : ""}<li>${link("home", "entry.return")}</li></ul></nav>`;
    if (route === "beginner") {
      const index = AWARENESS_GROUPS.indexOf(section);
      const groupNav = `<nav class="group-nav" aria-label="${message("entry.next")}">${AWARENESS_GROUPS.map((group) => `<a href="${sectionHref(group.key)}"${group.key === section.key ? ' aria-current="page"' : ""}>${message(`entry.group.${group.key}`)}</a>`).join("")}</nav>`;
      const modules = section.ids.map((id) => module(pack.items.find((item) => item.id === id)!)).join("");
      const steps = `<nav class="steps">${index > 0 ? `<a href="${sectionHref(AWARENESS_GROUPS[index - 1].key)}">← ${message("entry.previous")}</a>` : ""}${index < 4 ? `<a href="${sectionHref(AWARENESS_GROUPS[index + 1].key)}">${message("entry.continue")} →</a>` : ""}</nav>`;
      const nextActions = section.key === "next" ? `<nav><a href="${sectionHref("engineering")}">${message("entry.group.engineering")}</a><p>${link("personal", "entry.personal")}</p><p>${link("counselling", "entry.counselling")}</p><a href="${escape(pack.items.find((item) => item.id === "AW-10")!.sources.find((source) => source.source_id === "SRC002")!.url)}">${message("entry.official")}</a></nav>` : "";
      return shell(`<h1>${message(`entry.group.${section.key}`)}</h1><p>${message("entry.beginner.prompt")}</p>${groupNav}${modules}${steps}${nextActions}${directions}`);
    }
    if (route === "personal") {
      return shell(`<h1>${message("entry.personal")}</h1><p>${message("entry.personal.intro")}</p><section class="card"><p>${message("entry.personal.limit")}</p><a href="/personal/reference?lang=${language}">${message("entry.personal.open")}</a></section>${directions}`);
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

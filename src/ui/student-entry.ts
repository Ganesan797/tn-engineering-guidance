import { CHECK_COPY } from "./journey-copy.ts";
import {
  MissingStudentPresentationError, resolveStudentMessage,
  type StudentLanguage, type StudentSemanticMessage,
} from "../student-semantics/index.ts";
import type { EntryRoute, StudentEntryState } from "../student-entry/models.ts";
import { entryHref } from "../student-entry/routing.ts";
import { renderStudentGuidancePage, type StudentGuidancePageState } from "./student-guidance.ts";
import { AWARENESS_GROUPS, type AwarenessItem, type AwarenessPack } from "../student-semantics/awareness.ts";
import { renderSiteHeader, renderSiteBottomNav, renderIndependenceFooter, SITE_SHELL_CSS, GOOGLE_FONTS_HTML, SHARED_FONT_FAMILY } from "./site-shell.ts";
import { calculateAcademicCutoffFromRule } from "../domain/rules.ts";

type MessageResolver = (message: StudentSemanticMessage, language: StudentLanguage) => string;

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const STYLE = `*{box-sizing:border-box}body{margin:0;background:#f8fafc;color:#0f172a;font:16px/1.65 ${SHARED_FONT_FAMILY};letter-spacing:normal}html[lang=ta] body{line-height:1.75}main{max-width:820px;margin:auto;padding:28px 20px}h1{font-size:1.85rem;font-weight:800;letter-spacing:-0.02em}h2{font-size:1.35rem;font-weight:750;letter-spacing:-0.015em}h3{font-size:1.15rem;font-weight:700}h1,h2,h3{line-height:1.45;margin:0 0 1rem;color:#0f172a}p{margin:.55rem 0 1.15rem;color:#334155}a{color:#2563eb;text-underline-offset:.2em}a:focus-visible,summary:focus-visible{outline:3px solid #2563eb;outline-offset:4px}.languages{display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:1.5rem}.languages a,summary{padding:.5rem 0}.choice-card,.card,.awareness{padding:1.4rem;border:1px solid #e2e8f0;border-radius:12px;background:white;margin:1.2rem 0;box-shadow:0 1px 3px rgba(0,0,0,0.03)}.choice-card{display:block;text-decoration:none;color:inherit;transition:all .15s ease}.choice-card:hover,.choice-card:focus-visible{background:#eff6ff;border-color:#2563eb;box-shadow:0 4px 12px rgba(37,99,235,0.08)}.choice-card strong{display:block;color:#1d4ed8;font-size:1.18rem;font-weight:750}.choice-card .action{display:inline-flex;align-items:center;min-height:44px;color:#2563eb;font-weight:700;margin-top:.7rem}.choice-card p{margin:.5rem 0;color:#475569}.notice{font-size:.9rem;color:#64748b}nav ul{padding-left:1.2rem}nav li{margin:.7rem 0}details{margin-top:1rem}summary{cursor:pointer;color:#2563eb;font-weight:650}.module{margin:2rem 0;padding-bottom:1.5rem;border-bottom:1px solid #e2e8f0}.module li{margin:.65rem 0}.formula{white-space:normal;overflow-wrap:anywhere;padding:.8rem;background:#f1f5f9;border-radius:8px;font-family:monospace}.group-nav{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.4rem 0}.group-nav a{padding:.5rem .85rem;border:1px solid #cbd5e1;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;font-weight:600;font-size:0.92rem;text-decoration:none;color:#334155}.group-nav [aria-current=page]{background:#2563eb;color:white;border-color:#2563eb}.steps{display:flex;gap:1rem;justify-content:space-between;margin:1.5rem 0}.steps a{padding:.65rem;min-height:44px;display:inline-flex;align-items:center}.review-only{border:2px dashed #94a3b8;padding:1rem;margin-top:2rem;border-radius:8px}.calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin:1rem 0}.calc-row{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.8rem}.calc-row label{font-size:.88rem;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.03em}.calc-row input{padding:.65rem .8rem;font-size:1.05rem;border:1.5px solid #cbd5e1;border-radius:8px;outline:none;min-height:44px;font-family:inherit}.calc-row input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}.calc-submit-btn{min-height:48px;padding:.75rem 1.5rem;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer;transition:background .15s}.calc-submit-btn:hover{background:#1d4ed8}.cutoff-result{background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:1.4rem;margin:1.4rem 0}.cutoff-result h2{color:#166534;margin:0 0 .5rem;font-size:1.25rem}.cutoff-score-display{font-size:2.4rem;font-weight:800;color:#15803d;margin:.3rem 0 .6rem;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}.formula-breakdown{font-family:monospace;background:#dcfce7;padding:.5rem .8rem;border-radius:6px;display:inline-block;font-size:.95rem;color:#14532d;margin:0 0 .8rem}.mandatory-warning{background:#fffbeb;border-left:4px solid #f59e0b;padding:.9rem 1.1rem;border-radius:6px;margin:1rem 0}.mandatory-warning p{margin:.35rem 0;font-size:.95rem;color:#92400e;line-height:1.6}.calc-next-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.1rem}.calc-next-actions .action{display:inline-flex;align-items:center;min-height:44px;padding:.6rem 1.2rem;background:#2563eb;color:#fff;border-radius:8px;font-weight:650;text-decoration:none}.calc-next-actions .action.secondary{background:#fff;color:#2563eb;border:1.5px solid #cbd5e1}.counselling-rules-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;margin:.75rem 0}.gov-summary-card{background:#ffffff;border:1.5px solid #cbd5e1;border-radius:10px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.03)}.gov-summary-card-header{background:#f1f5f9;border-bottom:1px solid #cbd5e1;padding:.8rem 1rem}.gov-summary-card-header h4{margin:0;color:#0f2c59;font-size:1.02rem;font-weight:750;line-height:1.4}.gov-summary-card-body{padding:1rem}.gov-summary-card-body p{margin:.45rem 0;font-size:.94rem;line-height:1.6;color:#334155}.gov-summary-card-body ul{padding-left:1.15rem;margin:.5rem 0}.gov-summary-card-body li{margin:.45rem 0;font-size:.92rem;line-height:1.55;color:#334155}.nhs-expander{border:1.5px solid #cbd5e1;border-left:4px solid #174ea6;border-radius:10px;background:#fff;margin:.9rem 0;padding:0;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.02)}.nhs-expander summary{display:flex;align-items:flex-start;gap:.65rem;padding:.85rem 1rem;min-height:48px;background:#f8fafc;cursor:pointer;list-style:none;font-weight:750;color:#0f2c59;line-height:1.45}.nhs-expander summary::-webkit-details-marker{display:none}.nhs-expander summary::before{content:"+";display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;margin-top:2px;border-radius:6px;background:#dbeafe;color:#1e40af;font-weight:800;font-size:1.05rem;flex-shrink:0}.nhs-expander[open] summary{background:#eff6ff;border-bottom:1px solid #dbeafe}.nhs-expander[open] summary::before{content:"−";background:#1e40af;color:#fff}.nhs-expander-body{padding:1rem 1.1rem}.rule-condition{background:#eff6ff;border-left:4px solid #2563eb;padding:.7rem .85rem;border-radius:6px;margin:.7rem 0}.rule-condition strong{color:#1e40af}.gov-details{border:none;border-left:4px solid #94a3b8;background:transparent;padding:.2rem 0 .2rem .85rem;margin:1.1rem 0}.gov-details summary{padding:.3rem 0;min-height:40px;font-size:.94rem;color:#174ea6;text-decoration:underline}.counselling-actions{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.25rem}.counselling-actions a{display:inline-flex;align-items:center;min-height:44px;padding:.65rem 1.15rem;background:#174ea6;color:#fff;border-radius:8px;font-weight:650;text-decoration:none}.counselling-actions a:hover{background:#0b3780}@media(max-width:35rem){body{font-size:16px}main{padding:12px}.choice-card,.card,.awareness{padding:1rem}h1{font-size:1.45rem}.group-nav{font-size:.88rem}.nhs-expander summary{padding:.75rem .85rem}.nhs-expander-body{padding:.85rem .9rem}.gov-summary-card-header{padding:.7rem .85rem}.gov-summary-card-body{padding:.8rem .85rem}.rule-condition{padding:.6rem .75rem}.calc-submit-btn,.calc-next-actions .action,.counselling-actions a{width:100%;justify-content:center}}`;

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
  const localeControl = `<a lang="ta" href="${localeHref("ta")}"${language === "ta" ? ' aria-current="page"' : ""}>தமிழ்</a><a lang="en" href="${localeHref("en")}"${language === "en" ? ' aria-current="page"' : ""}><span class="lang-long">English</span><span class="lang-short">EN</span></a>`;
  const shell = (
    body: string,
    navTab: "guide" | "colleges" | "cutoff" | "shortlist" = "guide",
    stepOverride?: "home" | "journey" | "study" | "colleges" | "review" | "planner" | "cutoff",
  ) => `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${GOOGLE_FONTS_HTML}<title>${message("entry.site")}</title><style>${STYLE}${SITE_SHELL_CSS}
.home-main{max-width:780px;margin:0 auto;padding:16px;box-sizing:border-box}
@media(min-width:900px){.home-main{max-width:1120px;padding:24px 20px}}
.home-hero-split{display:grid;grid-template-columns:minmax(115px,42%) minmax(0,1fr);gap:14px;align-items:center;background:#FAF7F2;border:1px solid #EFEAE0;border-radius:16px;padding:12px 14px;margin-bottom:14px}
@media(min-width:640px){.home-hero-split{grid-template-columns:minmax(220px,36%) minmax(0,1fr);gap:24px;padding:20px 24px}}
@media(min-width:900px){.home-hero-split{grid-template-columns:280px minmax(0,1fr);gap:32px;padding:22px 32px;margin-bottom:18px}}
.home-hero-art{width:100%;border-radius:12px;overflow:hidden;box-shadow:0 3px 12px rgba(15,23,42,0.08)}
.home-hero-img{width:100%;height:195px;object-fit:cover;object-position:center 75%;display:block}
@media(min-width:640px){.home-hero-img{height:230px}}
.home-hero-copy{text-align:left;min-width:0}
.home-badge-tag{display:inline-block;padding:3px 9px;background:#f0fdfa;border:1px solid #ccfbf1;border-radius:9999px;font-size:0.72rem;font-weight:750;color:#0f766e;margin-bottom:0.45rem;line-height:1.3}
.home-title{font-size:1.35rem;font-weight:800;color:#0f2c59;line-height:1.22;margin:0 0 0.4rem;letter-spacing:-0.02em;word-break:break-word}
@media(min-width:640px){.home-title{font-size:1.85rem}}
@media(min-width:900px){.home-title{font-size:2.15rem}}
.home-sub{font-size:0.86rem;color:#475569;line-height:1.45;margin:0}
@media(min-width:640px){.home-sub{font-size:1rem}}
@media(min-width:900px){.home-sub{font-size:1.06rem;max-width:56ch}}
.home-trust-bar{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:6px 14px;margin:0 auto 1.4rem;padding:9px 12px;background:#FAF7F2;border:1px solid #EFEAE0;border-radius:10px;font-size:0.8rem;color:#334155;font-weight:650}
@media(min-width:900px){.home-trust-bar{gap:8px 24px;padding:10px 20px;font-size:0.86rem;margin-bottom:1.25rem}}
.home-trust-item{display:inline-flex;align-items:center;gap:4px}
.home-doors{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;margin-bottom:1.1rem}
@media(min-width:860px){.home-doors{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-bottom:1.25rem;align-items:stretch}}
.choice-card.recommended{background:#EAF4F0;border:1.5px solid #99f6e4;color:#0f766e;box-shadow:0 2px 6px rgba(15,118,110,0.05);display:flex;flex-direction:column;justify-content:space-between;padding:1.15rem 1.25rem;border-radius:14px;text-decoration:none;transition:transform 0.15s ease,box-shadow 0.15s ease;min-width:0;box-sizing:border-box;position:relative;margin:0}
.choice-card.recommended:hover{border-color:#0d9488;box-shadow:0 6px 16px rgba(15,118,110,0.12);transform:translateY(-2px)}
.choice-card.door-mark{background:#FFFFFF;border:1.5px solid #E29578;color:#7C2D12;box-shadow:0 2px 6px rgba(194,94,62,0.06);display:flex;flex-direction:column;justify-content:space-between;padding:1.15rem 1.25rem;border-radius:14px;text-decoration:none;transition:transform 0.15s ease,box-shadow 0.15s ease;min-width:0;box-sizing:border-box;position:relative;margin:0}
.choice-card.door-mark:hover{border-color:#C25E3E;box-shadow:0 6px 16px rgba(194,94,62,0.12);transform:translateY(-2px)}
.door-tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:0.7rem;font-weight:750;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:0.45rem;align-self:flex-start}
.choice-card.recommended .door-tag{background:#ccfbf1;color:#0f766e}
.door-mark .door-tag{background:#FFEDD5;color:#C2410C}
.door-title{font-size:1.15rem;font-weight:800;line-height:1.3;margin:0 0 0.35rem;display:block;word-break:break-word}
.choice-card.recommended .door-title{color:#0f2c59}
.door-mark .door-title{color:#7C2D12}
.door-desc{font-size:0.88rem;line-height:1.48;margin:0 0 0.75rem;word-break:break-word}
.choice-card.recommended .door-desc{color:#134e4a}
.door-mark .door-desc{color:#78350F}
.door-action{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px 12px;font-weight:750;font-size:0.9rem;margin-top:auto;padding-top:0.5rem;border-top:1px dashed rgba(0,0,0,0.08)}
.choice-card.recommended .door-action{color:#0f766e}
.door-mark .door-action{color:#C2410C}
.home-explore{margin-top:1.6rem;padding-top:1.4rem;border-top:1px solid #e2e8f0}
.home-explore-title{font-size:0.86rem;font-weight:750;color:#64748b;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 0.85rem;text-align:center}
.home-explore-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}
@media(min-width:540px){.home-explore-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(min-width:960px){.home-explore-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}}
.privacy-declaration-strip{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#ecfdf5;border:1px solid #a7f3d0;border-left:4px solid #059669;border-radius:8px;margin:0 0 1.25rem;font-size:0.86rem;line-height:1.45;color:#064e3b}
.privacy-lock-icon{font-size:1rem;flex-shrink:0;margin-top:1px}
.calc-recalculate-details{margin-top:1.25rem;border:1px solid #cbd5e1;border-radius:10px;background:#fff;padding:0.25rem 0.9rem}
.calc-recalculate-details summary{cursor:pointer;padding:0.65rem 0.25rem;font-weight:700;color:#0f766e;font-size:0.95rem}
.calc-recalculate-details .cutoff-calculator{border:none;box-shadow:none;margin:0;padding:0.5rem 0 1rem}
.explore-card{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;text-decoration:none;color:#1e293b;transition:all 0.15s ease;min-width:0;box-sizing:border-box}
.explore-card:hover{border-color:#0f766e;background:#f0fdfa;transform:translateY(-1px)}
.explore-icon{font-size:1.35rem;flex-shrink:0}
.explore-text{flex:1;min-width:0;overflow:hidden}
.explore-heading{font-size:0.88rem;font-weight:750;margin:0 0 2px;color:#0f2c59;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.explore-sub{font-size:0.75rem;color:#64748b;margin:0;line-height:1.35;display:block}
.explore-arrow{font-size:1rem;color:#0f766e;font-weight:700;flex-shrink:0}
.home-review{margin-top:1.75rem;padding:1.35rem 1.6rem;border:1px dashed #94a3b8;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.03)}
.home-review h2{margin:0 0 .3rem;font-size:1.15rem;color:#334155}
.home-review>p{margin:0 0 .9rem;color:#64748b;font-size:.95rem;line-height:1.6;max-width:80ch}
.home-review .choice-card{margin:0;padding:.95rem 1.2rem;border:1px solid #cbd5e1;border-radius:10px;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.75rem;text-decoration:none}
.home-review .choice-card:hover{background:#f1f5f9;border-color:#64748b}
.home-review .choice-card strong{color:#1e293b;font-size:1.05rem;margin:0}
.home-review .choice-card .action{margin:0;color:#0f766e;font-weight:700}
.content-main{max-width:1160px;margin:auto;padding:28px 20px}
.content-main>h1{font-size:2.1rem;font-weight:800;color:#0f2c59;margin:0 0 .5rem}
.content-main>p:first-of-type{font-size:1.12rem;color:#4a5870;line-height:1.65;margin:0 0 1.5rem;max-width:75ch}
.content-main .module,.content-main .card{background:#fff;border:1px solid #d8dde6;border-radius:14px;padding:2rem 2.2rem;margin:1.5rem 0;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.content-main .module h2{font-size:1.35rem;font-weight:750;color:#172033;margin:0 0 .8rem;padding-bottom:.6rem;border-bottom:1px solid #edf0f5}
.content-main details:not(.nhs-expander):not(.gov-details){border:1px solid #d8dde6;border-radius:10px;background:#fbfcfe;margin:.75rem 0;padding:.3rem .9rem;transition:all .15s ease}
.content-main details:not(.nhs-expander):not(.gov-details)[open]{background:#fff;border-color:#0f766e;box-shadow:0 2px 8px rgba(15,118,110,.06)}
.content-main details:not(.nhs-expander):not(.gov-details)>summary{cursor:pointer;padding:.7rem .4rem;min-height:44px;font-weight:650;color:#0f766e;font-size:1.05rem}
.content-main .group-nav{display:flex;flex-wrap:wrap;gap:.75rem;margin:1.4rem 0}
.content-main .group-nav a{padding:.65rem 1.15rem;border:1px solid #d8dde6;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;font-weight:650;background:#fff;color:#0f766e;transition:all .15s ease}
.content-main .group-nav a:hover{background:#f0fdfa;border-color:#0f766e}
.content-main .group-nav [aria-current=page]{background:#0f766e;color:#fff;border-color:#0f766e}
.content-main .steps{display:flex;gap:1rem;justify-content:space-between;margin:2rem 0}
.content-main .steps a{padding:.75rem 1.4rem;background:#fff;border:1px solid #0f766e;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;text-decoration:none;font-weight:700;color:#0f766e;transition:all .15s ease}
.content-main .steps a:hover{background:#f0fdfa}
@media(max-width:700px){
.home-main{padding:12px}
.home-intro{padding:1rem 1.1rem;border-radius:10px;margin-bottom:1rem}
.home-intro h1{font-size:1.45rem}
.home-intro p{font-size:0.92rem}
.home-mental-model{margin-top:0.75rem;gap:5px 4px;font-size:0.76rem}
.mental-step{padding:3px 6px}
.home-options{grid-template-columns:1fr;gap:1rem}
.home-options .choice-card.recommended{padding:1.15rem}
.home-secondary{padding:1rem}
.home-secondary a{padding:.75rem .35rem;min-height:48px}
.home-review{padding:1rem}
.home-review .choice-card{flex-direction:column;align-items:flex-start}
.content-main{padding:12px}
.content-main>h1{font-size:1.45rem}
.content-main>p:first-of-type{font-size:0.95rem}
.content-main .module,.content-main .card{padding:1rem;border-radius:10px}
.content-main .card.counselling-card{background:transparent;border:none;box-shadow:none;padding:0;margin:1rem 0}
}
</style></head><body>${renderSiteHeader(language, route === "home" ? "home" : "journey", localeControl, undefined, stepOverride)}<main class="${route === "home" ? "home-main" : "content-main"}">${body}${options.review ? `<aside class="review-only">${message("entry.review.only")}</aside>` : ""}</main>${renderIndependenceFooter(language)}${renderSiteBottomNav(language, navTab)}</body></html>`;
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
      
      const heroImg = `<img class="home-hero-img" src="/assets/tnea-hero-portrait.jpg" alt="${ta ? "தமிழ்நாடு பள்ளி மாணவர்கள் உயர்கல்வி வழிகாட்டிப் புத்தகத்தைப் படிக்கும் காட்சி" : "Tamil Nadu school students reading the TNEA Career Guidance book"}" width="240" height="245" loading="eager" decoding="async">`;

      const heroSection = `<section class="home-hero-split" aria-labelledby="home-hero-title">
        <div class="home-hero-art">${heroImg}</div>
        <div class="home-hero-copy">
          <div class="home-badge-tag"><span>${ta ? "TNEA பொறியியல் வழிகாட்டி" : "TNEA Engineering Guide"}</span></div>
          <h1 id="home-hero-title" class="home-title">${ta ? "சரியான வழிகாட்டல், சரியான நேரத்தில்" : "Right guidance, at the right time"}</h1>
          <p class="home-sub">${ta ? "12-ஆம் வகுப்பிற்குப் பிறகு பொறியியல் படிப்புகள், கட்-ஆஃப் &amp; கலந்தாய்வுக்கான எளிய வழிகாட்டல்." : "Simple, step-by-step guidance for Tamil Nadu engineering admissions."}</p>
        </div>
      </section>`;

      const trustBar = `<div class="home-trust-bar" aria-label="${ta ? "முக்கிய உத்தரவாதங்கள்" : "Key Assurances"}">
        <span class="home-trust-item">${ta ? "✓ TNEA சேர்க்கை வழிகாட்டல்" : "✓ Dedicated Guidance for TNEA"}</span>
        <span class="home-trust-item">${ta ? "✓ 7.5% அரசுப் பள்ளி &amp; முதல் பட்டதாரி சலுகை" : "✓ 7.5% Govt School Quota &amp; Fee Support"}</span>
        <span class="home-trust-item">${ta ? "✓ 100% இலவசம் • உள்நுழைவு தேவையில்லை" : "✓ 100% Free • No Login Needed"}</span>
      </div>`;

      const door1 = `<a class="choice-card recommended" href="/journey${ta ? "" : "?lang=en"}">
        <div>
          <span class="door-tag">${ta ? "படி 1 • தொடக்க வழிகாட்டி" : "Step 1 • Guided Start"}</span>
          <strong id="entry-choice" class="door-title">${ta ? "தொடக்க நிலை வழிகாட்டல் — 3 எளிய அறிமுகப் படிகள்" : "Guided Journey — 3 Simple Steps to Begin"}</strong>
          <p class="door-desc">${ta ? "5-நிலைப் பொறியியல் சேர்க்கைப் பயணத்தின் தொடக்கப் புரிதலுக்கான எளிய அறிமுகம். மதிப்பெண்கள் இன்றியே பொறியியல் படிப்புகள் (CSE, ECE, Mech...), கலந்தாய்வு முறை பற்றி எளிய தமிழில் அறிந்துகொள்ளலாம்." : "Introductory foundation for the 5-stage engineering admissions journey. Understand engineering branches (CSE, ECE, Mech...) and counselling procedures with zero marks required."}</p>
        </div>
        <div class="door-action">
          <span>${ta ? "✓ மதிப்பெண் தேவையின்றி அறியலாம்" : "✓ Zero marks required"}</span>
          <span>${ta ? "வழிகாட்டலைத் தொடங்க →" : "Start Guided Journey →"}</span>
        </div>
      </a>`;

      const door2 = `<a class="choice-card door-mark" href="${entryHref("personal", language)}">
        <div>
          <span class="door-tag">${ta ? "படி 2 • கட்-ஆஃப் &amp; விருப்பத் தேர்வு நிரப்புதல்" : "Step 2 • Cutoff &amp; Choice Filling"}</span>
          <strong class="door-title">${ta ? "மதிப்பெண் உள்ளது — கட்-ஆஃப் &amp; கல்லூரிகள்" : "I Have My Marks — Check Cutoff &amp; Choices"}</strong>
          <p class="door-desc">${ta ? "200-க்கு கட்-ஆஃப் கணக்கீடு, 7.5% அரசுப் பள்ளி தகுதி மற்றும் 300 கல்லூரிகளின் கடந்த ஆண்டு கட்-ஆஃப் ஒப்பிட்டு விருப்பப் பட்டியல் தயாரிக்கலாம்." : "Calculate your 200-mark cutoff, verify 7.5% Govt School &amp; First Graduate fee waivers, and plan your choice order with past cutoff benchmarks."}</p>
        </div>
        <div class="door-action">
          <span>${ta ? "✓ 200-க்கு கட்-ஆஃப் கணக்கீடு" : "✓ 200-mark calc"}</span>
          <span>${ta ? "கட்-ஆஃப் &amp; விருப்பத் தேர்வு நிரப்புதல் →" : "Calculate &amp; Plan Choices →"}</span>
        </div>
      </a>`;

      const doorsGrid = `<div class="home-doors" aria-label="${ta ? "முக்கிய வழிகாட்டல் தேர்வுகள்" : "Main Guidance Doors"}">
        ${door1}
        ${door2}
      </div>`;

      const exploreSection = `<section class="home-explore" aria-label="${ta ? "கூடுதல் TNEA வழிகாட்டல் பகுதிகள்" : "Helpful TNEA Guides"}">
        <h2 class="home-explore-title">${ta ? "முக்கிய TNEA வழிகாட்டல் பகுதிகள்" : "Helpful TNEA Guides"}</h2>
        <div class="home-explore-grid">
          <a class="explore-card" href="/journey?step=study${ta ? "" : "&amp;lang=en"}">
            <span class="explore-icon">⚙️</span>
            <div class="explore-text">
              <strong class="explore-heading">${ta ? "பொறியியல் படிப்புகள்" : "Engineering Branches"}</strong>
              <span class="explore-sub">${ta ? "CSE, IT, ECE, EEE, Mech..." : "CSE, ECE, Mech &amp; scope"}</span>
            </div>
            <span class="explore-arrow">→</span>
          </a>
          <a class="explore-card" href="${entryHref("counselling", language)}">
            <span class="explore-icon">📘</span>
            <div class="explore-text">
              <strong class="explore-heading">${ta ? "கலந்தாய்வு விதிகள்" : "Counselling Rules"}</strong>
              <span class="explore-sub">${ta ? "ஒதுக்கீடு, Upward Movement, 7.5%" : "Allotment &amp; 7.5% Quota"}</span>
            </div>
            <span class="explore-arrow">→</span>
          </a>
          <a class="explore-card" href="/colleges?lang=${language}">
            <span class="explore-icon">🏛️</span>
            <div class="explore-text">
              <strong class="explore-heading">${ta ? "கல்லூரிகள் பட்டியல்" : "Colleges Directory"}</strong>
              <span class="explore-sub">${ta ? "300 கல்லூரிகள் விவரம்" : "Search &amp; browse colleges"}</span>
            </div>
            <span class="explore-arrow">→</span>
          </a>
          <a class="explore-card" href="/journey/questions?lang=${language}">
            <span class="explore-icon">❓</span>
            <div class="explore-text">
              <strong class="explore-heading">${ta ? "கேள்விகள் &amp; பதில்கள் (FAQs)" : "Questions &amp; Answers (FAQs)"}</strong>
              <span class="explore-sub">${ta ? "கட்-ஆஃப் vs ரேங்க், கலந்தாய்வு விதிகள்" : "Cutoff vs. Rank, rounds &amp; rules"}</span>
            </div>
            <span class="explore-arrow">→</span>
          </a>
        </div>
      </section>`;

      return shell(`<div class="home-main">${heroSection}${doorsGrid}${trustBar}${exploreSection}${ownerEntry}</div>`, "guide", "home");
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
      const journeyBanner = `<p class="notice">${language === "ta" ? 'புதிதாகத் தொடங்குபவர்களுக்கு <a href="/journey">ஆரம்ப வழிகாட்டல் (5 எளிய படிகள்)</a> பரிந்துரைக்கப்படுகிறது. தலைப்பு வாரியாகப் படிக்க கீழே தொடரலாம்.' : 'First-time students may prefer the <a href="/journey?lang=en">guided 5-step journey</a>. Continue below for topic-by-topic reading.'}</p>`;
      return shell(`<h1>${message(`entry.group.${section.key}`)}</h1><p>${message("entry.beginner.prompt")}</p>${journeyBanner}${groupNav}${modules}${cutoffWalkthrough}${steps}${nextActions}${ownerProgrammeLink}${section.key === "next" ? `<p><a href="/journey?step=check${language === "en" ? "&amp;lang=en" : ""}">${language === "ta" ? "தனிப்பட்ட சரிபார்ப்பைத் தொடங்க" : "Start the personal check"}</a></p>` : ""}<details><summary>${message("entry.next")}</summary>${directions}</details>`, "guide", "journey");
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
      // Authoritative calculation delegates exclusively to ELG009
      const evaluation = hasInputs ? calculateAcademicCutoffFromRule(mNum, pNum, cNum) : null;
      const calculatedCutoff = evaluation?.cutoff ?? null;
      const cutoffDisplay = calculatedCutoff !== null ? `${calculatedCutoff.toFixed(2).replace(/\.?0+$/, "")} / 200` : "";
      const traceDisplay = calculatedCutoff !== null && mNum !== null && pNum !== null && cNum !== null
        ? `${mNum} + (${pNum} + ${cNum}) / 2 = ${calculatedCutoff.toFixed(2).replace(/\.?0+$/, "")}`
        : "";

      const resultBlock = `<section class="card cutoff-result" id="calc-result" aria-live="polite"${calculatedCutoff !== null ? "" : ' style="display:none"'}>
  <h2>${ta ? "உங்கள் TNEA Cutoff மதிப்பெண்" : "Calculated Academic Cutoff Score"}</h2>
  <p class="cutoff-score-display"><strong id="calc-score">${cutoffDisplay}</strong></p>
  <p class="formula-breakdown" id="calc-trace">${traceDisplay}</p>
  <div class="mandatory-warning" style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:1.1rem; margin:1rem 0;">
    <h3 style="margin:0 0 0.6rem; font-size:1rem; color:#1e293b;">${ta ? "💡 முக்கிய நடைமுறை ஆலோசனைகள்" : "💡 Crucial Realities &amp; Strategy"}</h3>
    <ul style="margin:0; padding-left:1.2rem; line-height:1.6; font-size:0.92rem; color:#334155;">
      <li><strong>${ta ? "கணக்கீட்டு முறை: இது கணிதம் (100) + இயற்பியல் (50) + வேதியியல் (50) ஆகியவற்றின் அடிப்படையில் 200-க்குக் கணக்கிடப்பட்ட Cutoff மதிப்பெண் மட்டுமே." : "Calculation: This is the composite academic cutoff score calculated out of 200 from your subject marks (Maths 100, Physics 50, Chemistry 50)."}</strong></li>
      <li><strong>${ta ? "Cutoff வேறு; Rank வேறு:" : "Cutoff vs. Rank:"}</strong> ${ta ? "Cutoff என்பது சேர்க்கைக்கான உத்தரவாதமோ அதிகாரப்பூர்வ தரவரிசையோ (Rank) அல்ல. TNEA வெளியிடும் பொதுத் தரவரிசை (Overall Merit Rank), வகுப்புவாரித் தரவரிசை (Community Rank) மற்றும் 7.5% அரசுப் பள்ளித் தரவரிசை (Eligible 7.5% Govt School Rank) ஆகியவை முற்றிலும் வேறுபட்டவை." : "A cutoff score is not an admission guarantee or an official rank. It is distinct from the official Overall Merit Rank, Community Rank, and eligible 7.5% Government School Ranks."}</li>
      <li><strong>${ta ? "0.5 மதிப்பெண் உணர்திறன்:" : "0.5 Mark Sensitivity:"}</strong> ${ta ? "ஒரே 0.50 மதிப்பெண் இடைவெளியில் கூட (எ.கா. 199.5 vs 199.0) நூற்றுக்கணக்கான மாணவர்களின் ரேங்க் மாறும். சம மதிப்பெண் வரும்போது TNEA தகவல் கையேடு பிரிவு 6(a)(ii)-ன் படியான அதிகாரப்பூர்வ டை-பிரேக் வரிசைப்படியே (கணித %, இயற்பியல் %, விருப்பப் பாட %, 12-ஆம் வகுப்பு மொத்த %, பிறந்த தேதி, ரேண்டம் எண்) ரேங்க் தீர்மானிக்கப்படும். <a href=\"/journey/questions?id=Q086&amp;lang=ta\" target=\"_blank\" rel=\"noopener\">டை-பிரேக் விதிகள் பற்றி மேலும் அறிய (Q086) →</a>" : "In competitive brackets, hundreds of candidates share a 0.50 mark band (e.g. 199.5 vs 199.0). When cutoffs are equal, statutory TNEA tie-breakers govern rank order in strict sequence: (1) Maths %, (2) Physics %, (3) Optional 4th subject %, (4) Class XII total %, (5) Date of birth (elder), and (6) Random number [TNEA Information Brochure, §6(a)(ii)]. <a href=\"/journey/questions?id=Q086&amp;lang=en\" target=\"_blank\" rel=\"noopener\">Read tie-breaker &amp; rank rules (Q086) →</a>"}</li>
      <li><strong>${ta ? "மாணவர்களுக்கான பாதுகாப்பு விதி:" : "Student Safety Rule:"}</strong> ${ta ? "கடந்த ஆண்டு கட்-ஆஃப்பை மட்டும் நம்பி 1 அல்லது 2 கல்லூரிகளை மட்டும் விருப்பப் பட்டியலில் வைக்காதீர்கள். உங்கள் மதிப்பெண்ணுக்கு சற்று மேலே உள்ளவை, சமமாக உள்ளவை, மற்றும் பாதுகாப்பான வாய்ப்புகள் எனப் பரவலான விருப்பப் பட்டியலைத் தயாரிக்க வேண்டும்." : "Never assume admission based on a single past closing number. Always prepare a multi-layer choice list with aspirational, realistic, and safe fallback colleges."}</li>
    </ul>
    <p class="source-ref" style="margin-top:0.65rem; margin-bottom:0;"><small>${ta ? "2026 TNEA சேர்க்கை நடைமுறைகளின்படி" : "Applicable to TNEA 2026 Admissions"} (${ta ? "அதிகாரப்பூர்வ தளம்: " : "Official portal: "}<a href="https://www.tneaonline.org/" target="_blank" rel="noopener">www.tneaonline.org</a>)</small></p>
  </div>
  <div class="calc-next-actions">
    ${calculatedCutoff !== null ? `
    <form method="POST" action="/m5-guidance?lang=${language}" style="margin:0;display:inline">
      <input type="hidden" name="cutoff" value="${calculatedCutoff}">
      <input type="hidden" name="tab" value="comparison">
      <button type="submit" class="action">${ta ? "கட்-ஆஃப் ஒப்பீடு &amp; முன்னுரிமைத் திட்டம் (விருப்பத் தேர்வு நிரப்புதல்) →" : "Cutoff Comparison &amp; Plan Choices →"}</button>
    </form>` : `<a class="action" href="/m5-guidance?lang=${language}">${ta ? "மதிப்பெண் இன்றி கல்லூரிகளைப் பார்க்க →" : "Browse Colleges &amp; Choice Planner (No Marks) →"}</a>`}
    <a class="action secondary" href="/colleges?view=colleges&amp;lang=${language}">${ta ? "கல்லூரிகள் மற்றும் படிப்புகளைப் பார்க்க →" : "Explore colleges and programmes →"}</a>
    <a class="action secondary" href="/counselling?lang=${language}">${ta ? "கலந்தாய்வு நடைமுறைகள் மற்றும் விதிகள் →" : "TNEA Counselling procedures &amp; guidance →"}</a>
  </div>
</section>`;

      // Nonpersistent POST form: marks never appear in GET query strings or browser history URLs
      const formBlock = `<section class="card cutoff-calculator">
  <h2>${ta ? "பாட மதிப்பெண்கள் (100-க்கு)" : "Subject Marks (out of 100)"}</h2>
  <p>${ta ? "TNEA பொதுக் கல்விப் பிரிவில் +2 கணிதம், இயற்பியல், வேதியியல் மதிப்பெண்களைக் கொண்டு 200-க்கு Cutoff கணக்கிடப்படுகிறது. கீழே மதிப்பெண்களை உள்ளிட்டு உங்கள் Cutoff-ஐ உடனே அறியலாம்." : "Enter your standard 100-point marks for Mathematics, Physics, and Chemistry to calculate your academic cutoff via the official rule:"}</p>
  <form id="cutoff-calc-form" method="POST" action="/personal?lang=${language}">
    <div class="calc-grid">
      <div class="calc-row">
        <label for="calc-m">${ta ? "கணிதம் (Mathematics — 100-க்கு):" : "Mathematics (out of 100):"}</label>
        <input type="number" id="calc-m" name="maths" min="0" max="100" aria-label="${ta ? "கணிதம் (Mathematics — 100-க்கு)" : "Mathematics (out of 100)"}" step="0.5" required placeholder="0 - 100" value="${escape(mVal ?? "")}">
      </div>
      <div class="calc-row">
        <label for="calc-p">${ta ? "இயற்பியல் (Physics — 100-க்கு):" : "Physics (out of 100):"}</label>
        <input type="number" id="calc-p" name="physics" min="0" max="100" aria-label="${ta ? "இயற்பியல் (Physics — 100-க்கு)" : "Physics (out of 100)"}" step="0.5" required placeholder="0 - 100" value="${escape(pVal ?? "")}">
      </div>
      <div class="calc-row">
        <label for="calc-c">${ta ? "வேதியியல் (Chemistry — 100-க்கு):" : "Chemistry (out of 100):"}</label>
        <input type="number" id="calc-c" name="chemistry" min="0" max="100" aria-label="${ta ? "வேதியியல் (Chemistry — 100-க்கு)" : "Chemistry (out of 100)"}" step="0.5" required placeholder="0 - 100" value="${escape(cVal ?? "")}">
      </div>
    </div>
    <button type="submit" class="calc-submit-btn" aria-label="${ta ? "கட்-ஆஃப் கணக்கிடுக" : "Calculate Cutoff"}">${ta ? "கட்-ஆஃப் கணக்கிடுக" : "Calculate Cutoff"}</button>
  </form>
</section>`;

      // Browser-side script: strictly handles instant stale-result clearing when inputs change or become invalid; zero independent client arithmetic
      const clientScript = `<script>(function(){var fm=document.getElementById('calc-m'),fp=document.getElementById('calc-p'),fc=document.getElementById('calc-c'),r=document.getElementById('calc-result'),sc=document.getElementById('calc-score'),tr=document.getElementById('calc-trace');if(!fm||!fp||!fc)return;function clearStale(){var mv=fm.value.trim(),pv=fp.value.trim(),cv=fc.value.trim();if(mv===''||pv===''||cv===''){if(sc)sc.textContent='';if(tr)tr.textContent='';if(r)r.style.display='none';return;}var m=Number(mv),p=Number(pv),c=Number(cv);if(isNaN(m)||isNaN(p)||isNaN(c)||m<0||m>100||p<0||p>100||c<0||c>100){if(sc)sc.textContent='';if(tr)tr.textContent='';if(r)r.style.display='none';return;}}fm.addEventListener('input',clearStale);fp.addEventListener('input',clearStale);fc.addEventListener('input',clearStale);fm.addEventListener('change',clearStale);fp.addEventListener('change',clearStale);fc.addEventListener('change',clearStale);})();</script>`;

      const journeyCard = `<section class="card"><h2>${ta ? "முழுமையான தகுதி மற்றும் விதி வழிகாட்டல்" : "Complete Eligibility & Rule-Based Guidance"}</h2><p>${ta ? "Cutoff மட்டுமின்றி உங்கள் பள்ளிப் படிப்பு, இடஒதுக்கீடு மற்றும் பிற தகுதிகளின் அடிப்படையில் அதிகாரப்பூர்வ விதிகளைச் சரிபார்க்க:" : CHECK_COPY.personalIntro[1]}</p><a class="choice-card" href="/journey?step=check${language === "en" ? "&amp;lang=en" : ""}"><strong>${ta ? "படிப்படியான சரிபார்ப்பைத் தொடங்க →" : CHECK_COPY.start[1]}</strong></a></section>`;

      const pageHeading = ta ? "உங்கள் TNEA கட்-ஆஃப் கணக்கிடுங்கள் (Cutoff Calculator)" : message("entry.personal");
      const cutoffNotice = `<p class="notice" style="margin: 0 0 1rem; padding: 0.75rem 1rem; background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 6px; font-size: 0.95rem; color: #1e293b; line-height: 1.5;"><strong>${ta ? "முக்கியக் குறிப்பு:" : "Essential Note:"}</strong> ${ta ? "கட்-ஆஃப் என்பது கணக்கிடப்பட்ட மதிப்பெண் மட்டுமே. இது உங்கள் TNEA தரவரிசை (Rank) அல்ல; சேர்க்கைக்கான உத்தரவாதமும் அல்ல." : "Cutoff is a calculated mark. It is not your TNEA rank and does not guarantee a seat."}</p>`;
      const privacyDeclaration = `<div class="privacy-declaration-strip"><span class="privacy-lock-icon" aria-hidden="true">🔒</span><div><strong>${ta ? "தரவு சேமிக்கப்படாது (Zero Tracking):" : "Zero Tracking (Nothing Stored):"}</strong> <span>${ta ? "உங்கள் மதிப்பெண்கள் URL அல்லது சர்வரில் சேமிக்கப்படாது. பாதுகாப்பான நேரடி கணக்கீடு மட்டுமே." : "Marks are never placed in the URL or saved on the server. Safe private calculation only."}</span></div></div>`;
      if (calculatedCutoff !== null) {
        const recalcToggle = `<details class="calc-recalculate-details"><summary>${ta ? "↺ வேறு மதிப்பெண்களை உள்ளிட்டுக் கணக்கிட" : "↺ Recalculate with different marks"}</summary>${formBlock}</details>`;
        return shell(`<h1>${pageHeading}</h1>${cutoffNotice}${privacyDeclaration}${resultBlock}${recalcToggle}${clientScript}`, "cutoff", "cutoff");
      }
      return shell(`<h1>${pageHeading}</h1>${cutoffNotice}${privacyDeclaration}${resultBlock}${formBlock}${clientScript}${journeyCard}${directions}`, "cutoff", "cutoff");
    }
    if (route === "counselling") {
      const ta = language === "ta";
      // Official TNEA 2026 counselling procedures, Accept & Upward conditions, and 7.5% Government school quota evidence
      const counsellingProcedures = `<section class="card counselling-card" aria-labelledby="counsel-rules">
  <h2 id="counsel-rules">${ta ? "TNEA கலந்தாய்வு நடைமுறைகள் — எளிய வழிகாட்டி" : "Key TNEA Counselling Procedures &amp; Guidance"}</h2>
  <p class="notice">${ta ? "கலந்தாய்வில் விருப்பப் பட்டியல் (Choice List) தயார் செய்வதற்கு முன், மாணவர்களும் பெற்றோரும் தெரிந்துகொள்ள வேண்டிய 3 முக்கிய நடைமுறைகள் (ஒவ்வொரு பகுதியையும் தேர்வு செய்து விரிவாகப் படிக்கலாம்):" : "Three essential official procedures every student and parent should understand before choice filling (expand each section below for full details):"}</p>
  <details class="nhs-expander" open>
    <summary><h3 style="display:inline;margin:0;font-size:1.05rem">${ta ? "1. விருப்பப் பட்டியல் வரிசை தயாரிப்பு மற்றும் இட ஒதுக்கீடு (Choice Ordering &amp; Seat Allotment)" : "1. Choice Ordering &amp; Seat Allotment"}</h3></summary>
    <div class="nhs-expander-body">
      <p><strong>${ta ? "கணினி எப்படி இடத்தை ஒதுக்கும்?" : "Algorithm evaluation:"}</strong> ${ta ? "TNEA கணினி உங்கள் விருப்பப் பட்டியலை வரிசை 1-லிருந்து கீழ்நோக்கி வரிசையாக மட்டுமே பார்க்கும். உங்கள் விருப்ப வரிசை (Preference Order), அதிகாரப்பூர்வ தரவரிசை (Merit Rank), வகுப்புவாரி இடஒதுக்கீடு (Community Reservation) மற்றும் காலி இடங்களின் அடிப்படையில், உங்கள் பட்டியலில் மேலிருந்து முதலில் எந்தக் கல்லூரியில் இடம் கிடைக்கிறதோ அதுவே உங்களுக்கு ஒதுக்கப்படும்." : "The allotment algorithm evaluates choices strictly in sequence starting from Choice 1 downward. Based on your preference order, official merit rank, community reservation category, and seat availability, it allots the highest preference where an eligible seat is available. The algorithm evaluates your choices in sequence and does not lock arbitrary predictions."}</p>
      <p class="rule-condition"><strong>${ta ? "நினைவில் கொள்ள வேண்டியது:" : "Key reminder:"}</strong> ${ta ? "கணினி உங்கள் விருப்ப வரிசையை மாற்றவோ, தானாக எந்த முடிவையும் உறுதி செய்யாது. எனவே உங்களுக்கு மிகவும் பிடித்த கல்லூரி மற்றும் துறையைத் தயங்காமல் மேல் வரிசையில் (விருப்பம் 1, 2, 3...) வையுங்கள்." : "Tip: Place your most preferred college and branch combinations at the top. The algorithm strictly follows your preference order."}</p>
    </div>
  </details>
  <details class="nhs-expander">
    <summary><h3 style="display:inline;margin:0;font-size:1.05rem">${ta ? "2. தற்காலிக ஒதுக்கீட்டிற்குப் பிறகு எடுக்க வேண்டிய முடிவுகள் (Upward Movement Rules)" : "2. Upward Movement Rules (Accept vs Decline)"}</h3></summary>
    <div class="nhs-expander-body">
      <div class="counselling-rules-grid">
        <div class="gov-summary-card">
          <div class="gov-summary-card-header">
            <h4>${ta ? "இடத்தை ஏற்று மேல்நோக்கி நகர்தல் (Accept &amp; Upward)" : "Accept &amp; Upward Movement"}</h4>
          </div>
          <div class="gov-summary-card-body">
            <p><strong>${ta ? "இதன் பொருள்:" : "Meaning:"}</strong> ${ta ? "இப்போது ஒதுக்கப்பட்டுள்ள தற்காலிக இடத்தைத் தக்கவைத்துக்கொண்டு, உங்கள் பட்டியலில் அதற்கு மேலே உள்ள விருப்பக் கல்லூரிகளில் இடம் கிடைக்கிறதா என்று முயற்சிப்பது." : "You accept the currently tentatively allotted seat while requesting consideration for higher-preference choices on your list."}</p>
            <p class="rule-condition"><strong>${ta ? "கட்டாயம் செய்ய வேண்டியவை:" : "Mandatory Procedural Requirements:"}</strong> ${ta ? "இதைத் தேர்ந்தெடுக்கும் மாணவர்கள், TNEA அட்டவணையில் குறிப்பிட்டுள்ள காலக்கெடுவுக்குள் அருகிலுள்ள TNEA உதவி மையத்திற்கு (Nearest TFC) நேரில் சென்று அறிக்கை சமர்ப்பிக்க வேண்டும் (Reporting), அசல் சான்றிதழ்களைச் சமர்ப்பித்து சரிபார்க்க வேண்டும், மற்றும் உரிய கட்டணத்தைச் செலுத்த வேண்டும்." : "Candidates selecting this option must report in person to the nearest TFC (TNEA Facilitation Centre) within the schedule specified in the TNEA 2026 procedure, submit original certificates for verification, and pay the prescribed fee."}</p>
            <p><strong>${ta ? "கட்டணச் சலுகை விதிகள்:" : "Fee Concession Rules:"}</strong></p>
            <ul>
              <li><strong>${ta ? "7.5% அரசுப் பள்ளி ஒதுக்கீடு:" : "7.5% Govt School Quota:"}</strong> ${ta ? "இதன் கீழ் சேரும் தகுதியுடைய மாணவர்களுக்குக் கல்விக் கட்டணம் மற்றும் விடுதிக் கட்டணம் முழுமையாக இலவசம் (தமிழக அரசே ஏற்கும்)." : "Eligible 7.5% Government School quota students are exempt from tuition and hostel fees."}</li>
              <li><strong>${ta ? "முதல் பட்டதாரி (First Graduate):" : "First Graduate:"}</strong> ${ta ? "முதல் பட்டதாரி சான்றிதழ் சரிபார்க்கப்பட்ட தகுதியுடைய மாணவர்களுக்குக் கல்விக் கட்டணச் சலுகை உண்டு." : "First Graduate candidates are eligible for tuition fee concession upon verified certificate eligibility."}</li>
              <li><strong>${ta ? "போஸ்ட்-மெட்ரிக் கல்வி உதவித்தொகைத் திட்டம் (PMSS):" : "Post Matric Scholarship Scheme (PMSS):"}</strong> ${ta ? "தகுதியுடைய SC / SCA / ST மற்றும் மதம் மாறிய கிறிஸ்தவ (SC) மாணவர்களுக்கு, குடும்ப வருமான வரம்பு மற்றும் ஆவணச் சரிபார்ப்பின் அடிப்படையில் கல்விக் கட்டணச் சலுகை உண்டு (கவனிக்க: மாணவர்கள் தங்களின் தனிப்பட்ட தகுதி மற்றும் வருமான வரம்புகளைச் சரிபார்க்க வேண்டும்; பிரிவின் அடிப்படையில் மட்டுமே கட்டண விலக்கு தானாகக் கிடைக்காது). கட்டணச் சலுகை பொருந்தாத பிற மாணவர்கள் உரிய கட்டணத்தை TFC மையத்தில் செலுத்த வேண்டும்." : "Post Matric Scholarship Scheme (PMSS) candidates (eligible SC/SCA/ST and SC converted Christians) receive tuition fee concessions subject to income criteria and document verification (candidates must verify their specific eligibility and income conditions; fee exemptions are not automatic based on category alone). Candidates not eligible for concessions must pay the requisite fee at the TFC."}</li>
            </ul>
            <p><strong>${ta ? "இறுதி ஒதுக்கீடு எப்படி அமையும்?" : "Final Allotment Rule:"}</strong> ${ta ? "மேல் வரிசையில் உள்ள கல்லூரிகளில் இடம் கிடைத்தால், பழைய ஒதுக்கீடு தானாக ரத்தாகி புதிய கல்லூரி இடமே இறுதியாகும். ஒருவேளை மேல் வரிசையில் இடம் கிடைக்காவிட்டாலும் கவலை இல்லை—காலக்கெடுவுக்குள் அருகிலுள்ள TFC மையத்தில் சான்றிதழ் சரிபார்ப்பு மற்றும் கட்டண நடைமுறைகளை முடித்திருந்தால், முன்பு கிடைத்த தற்காலிக இடம் உங்களுக்குப் பாதுகாப்பாகக் கிடைக்கும்; தவறினால் அந்த இடமும் ரத்தாகிவிடும்." : "If a higher-preference seat becomes available, the earlier allotment is cancelled and the new allotment is finalized. If no higher seat becomes available, the earlier allotment is retained only if reporting to the nearest TFC, certificate verification, and fee payment requirements were completed on time; otherwise, the allotment is forfeited."}</p>
          </div>
        </div>
        <div class="gov-summary-card">
          <div class="gov-summary-card-header">
            <h4>${ta ? "இடத்தை நிராகரித்து மேல்நோக்கி நகர்தல் (Decline &amp; Upward)" : "Decline &amp; Upward Movement"}</h4>
          </div>
          <div class="gov-summary-card-body">
            <p><strong>${ta ? "இதன் பொருள்:" : "Meaning:"}</strong> ${ta ? "இப்போது ஒதுக்கப்பட்டுள்ள தற்காலிக இடத்தை நீங்கள் முழுமையாக விட்டுவிடுகிறீர்கள். இதற்காக நீங்கள் TFC மையத்திற்குச் செல்லவோ, இந்த இடத்திற்கான கட்டணத்தைச் செலுத்தவோ தேவையில்லை." : "You explicitly relinquish the current tentative allotment without reporting or paying fees for that specific seat."}</p>
            <p class="rule-condition"><strong>${ta ? "முக்கிய விதிமுறை:" : "Round Rules:"}</strong> ${ta ? "உங்கள் பட்டியலில் மேலே உள்ள கல்லூரிகளில் இடம் காலியாக இருந்தால் மட்டுமே புதிய இடம் கிடைக்கும். அப்படி மேலே இடம் கிடைக்காவிட்டால், இந்தச் சுற்றில் முன்பு கிடைத்த இடமும் உங்களுக்குத் திரும்பக் கிடைக்காது. இருப்பினும், TNEA விதிகளின்படி அடுத்த சுற்றுகளில் (Subsequent Rounds) அல்லது துணை கலந்தாய்வில் பங்கேற்கும் தகுதி தக்கவைக்கப்படும்." : "If higher-preference choices become available, they will be allotted. If upward movement does not produce a higher choice, the relinquished seat is lost for that round, but eligibility to participate in subsequent rounds or supplementary counselling is retained per TNEA counselling rules."}</p>
          </div>
        </div>
      </div>
    </div>
  </details>
  <details class="nhs-expander">
    <summary><h3 style="display:inline;margin:0;font-size:1.05rem">${ta ? "3. 7.5% அரசுப் பள்ளி முன்னுரிமை இடஒதுக்கீடு (7.5% Govt School Quota)" : "3. 7.5% Government School Preferential Quota"}</h3></summary>
    <div class="nhs-expander-body">
      <p><strong>${ta ? "யார் தகுதியுடையவர்கள்? (Eligibility):" : "Eligibility:"}</strong> ${ta ? "தமிழ்நாடு அரசுப் பள்ளிகளில் (அரசு, மாநகராட்சி, நகராட்சி, ஆதிதிராவிடர் மற்றும் பழங்குடியினர் நலம், வனத்துறை மற்றும் கள்ளர் சீரமைப்புப் பள்ளிகள்) 6-ஆம் வகுப்பு முதல் 12-ஆம் வகுப்பு வரை தொடர்ந்து படித்த மாணவர்கள் இந்த இடஒதுக்கீட்டிற்குப் பரிசீலிக்கத் தகுதியுடையவர்கள்." : "Candidates who studied continuously from Standard 6 to Standard 12 in Tamil Nadu Government schools (including Government, Corporation, Municipal, Adi Dravidar and Tribal Welfare, Forest, and Kallar Reclamation schools) are eligible for consideration under this quota."}</p>
      <p><strong>${ta ? "சான்றிதழ் சரிபார்ப்பு (Document Verification):" : "Document Verification:"}</strong> ${ta ? "மாணவரின் அரசுப் பள்ளிப் படிப்பு விவரங்கள், TNEA தகவல் கையேட்டில் குறிப்பிடப்பட்டுள்ள அதிகாரப்பூர்வ நடைமுறைகளின்படி TNEA உதவி மையங்களில் (TFC) சரிபார்க்கப்படும். (தேவையான சான்றிதழ்களின் துல்லியமான விவரங்களுக்கு அதிகாரப்பூர்வ வழிகாட்டுதலைப் பார்க்கவும்.)" : "Study details in Tamil Nadu Government schools are verified at TNEA Facilitation Centres (TFC) in accordance with the official procedures specified in the TNEA 2026 Information Brochure. Candidates should refer to official guidelines for exact certificate requirements."}</p>
      <p><strong>${ta ? "தகுதி வேறு; சீட் உறுதி வேறு:" : "Entitlement Distinction:"}</strong> ${ta ? "6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்திருப்பது 7.5% ஒதுக்கீட்டில் பங்கேற்பதற்கான தகுதியை மட்டுமே தரும்; அதுவே தானாக கல்லூரி இடத்தை உறுதி செய்யாது. அரசுப் பள்ளித் தரவரிசை (Govt School Rank), வகுப்புவாரி இடஒதுக்கீடு மற்றும் 7.5% பிரிவில் உள்ள காலி இடங்களின் அடிப்படையிலேயே இறுதி இடம் ஒதுக்கப்படும். இந்த ஒதுக்கீட்டின் கீழ் சேர்க்கை பெறும் தகுதியுடைய மாணவர்களுக்குக் கல்விக் கட்டணம் மற்றும் விடுதிக் கட்டணத்தைத் தமிழக அரசே முழுமையாக ஏற்கும்." : "Fulfilling the study criteria establishes eligibility for quota consideration; it does not constitute an automatic seat guarantee. Final allotment is governed strictly by the candidate's Government School merit rank, community reservation, and 7.5% seat matrix availability. Qualifying candidates admitted under this quota receive government tuition and hostel fee assistance."}</p>
    </div>
  </details>
  <details class="gov-details">
    <summary>${ta ? "அதிகாரப்பூர்வ TNEA 2026 விவரங்கள் மற்றும் இணையதளம்" : "Official TNEA 2026 Source Documents &amp; Portal"}</summary>
    <p class="notice" style="margin:.4rem 0 0"><small>${ta ? "2026 TNEA கலந்தாய்வு நடைமுறைகளின்படி" : "Applicable to TNEA 2026 Counselling Procedures"} (${ta ? "ஆதாரம்: " : "Source: "}<a href="https://www.tneaonline.org/" target="_blank" rel="noopener">www.tneaonline.org</a> | <a href="https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf" target="_blank" rel="noopener">Information Brochure 2026</a> | <a href="https://static.tneaonline.org/docs/8_TNEA_2024_Counselling_procedure_2026.pdf" target="_blank" rel="noopener">Counselling Procedure</a>)</small></p>
  </details>
  <div class="counselling-actions">
    <a href="/m5-guidance?tab=shortlist&amp;lang=${language}">${ta ? "விருப்பப் பட்டியலை வரிசைப்படுத்த →" : "Choice Order Planner &amp; Shortlist →"}</a>
    <a href="/colleges?view=colleges&amp;lang=${language}">${ta ? "கல்லூரிகள் மற்றும் துறைகளைப் பார்க்க →" : "Browse Colleges and Programmes Directory →"}</a>
    <a href="/personal?lang=${language}">${ta ? "கட்-ஆஃப் கணக்கிட →" : "Go to Cutoff Calculator →"}</a>
  </div>
</section>`;

      return shell(`<h1>${message("entry.counselling")}</h1><p>${message("entry.counselling.intro")}</p>${counsellingProcedures}${directions}`, "guide", "journey");
    }
    return shell(`<h1>${message("entry.counselling")}</h1><p>${message("entry.counselling.intro")}</p><nav class="group-nav">${["admission", "choices", "support", "next"].map((key) => `<a href="${sectionHref(key)}">${message(`entry.group.${key}` as StudentSemanticMessage["key"])}</a>`).join("")}</nav>${directions}`, "guide", "journey");
  } catch (error) {
    if (!(error instanceof MissingStudentPresentationError)) throw error;
    // Known catalogue safety messages do not use the potentially incomplete resolver.
    const safe = (key: StudentSemanticMessage["key"]) => escape(resolveStudentMessage({ key }, language));
    return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${GOOGLE_FONTS_HTML}<title>${safe("entry.site")}</title></head><body><main><p role="status">${safe("entry.missing")}</p><a href="${entryHref("home", language)}">${safe("entry.return")}</a><p><a lang="en" href="${entryHref(route, "en")}">${safe("entry.english")}</a></p></main></body></html>`;
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

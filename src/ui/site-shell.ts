// Shared presentation shell for the existing guided and review-only routes.
// Navigation deliberately contains no link to the internal or synthetic preview.
export const SITE_SHELL_CSS = `
.site-header{background:#fff;border-bottom:1px solid #d8dde6}
.site-header-inner{max-width:1160px;margin:auto;padding:12px 20px;display:flex;align-items:center;gap:16px 28px;flex-wrap:wrap}
.site-brand{font-weight:750;color:#172033;text-decoration:none;line-height:1.35;min-height:44px;display:inline-flex;align-items:center}
.site-nav{display:flex;gap:4px 8px;flex-wrap:wrap;align-items:center;flex:1}
.site-nav a{color:#174ea6;text-decoration:none;padding:10px 12px;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;line-height:1.35}
.site-nav a:hover,.site-nav a[aria-current=page]{background:#edf3fa}
.site-nav a[aria-current=page]{color:#172033;font-weight:700}
.site-language{display:flex;gap:4px;align-items:center;flex-wrap:wrap;margin-left:auto}
.site-language a,.site-language button,.site-language span{font:inherit;line-height:1.35;min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:8px 10px;border-radius:8px}
.site-language a,.site-language button{color:#174ea6;background:#fff;border:1px solid transparent;cursor:pointer;text-decoration:none}
.site-language [aria-current]{color:#172033;background:#edf3fa;font-weight:700;border:1px solid #d8dde6}
.site-language form{margin:0}
.site-context{width:100%;font-size:.82rem;line-height:1.4;color:#46536a;font-weight:700;letter-spacing:.02em}
.site-header a:focus-visible,.site-header button:focus-visible{outline:3px solid #174ea6;outline-offset:2px}
@media(max-width:640px){.site-header-inner{padding:8px 16px;gap:4px 12px}.site-brand{width:100%;font-size:1rem}.site-nav{order:2;width:100%;flex:none;justify-content:space-between}.site-nav a{padding:8px 6px;font-size:.9rem}.site-language{order:1}.site-context{order:3}}
`;

export function renderSiteHeader(
  language: "ta" | "en",
  current: "home" | "journey" | "study" | "review",
  languageControl: string,
  context?: "owner" | "synthetic",
): string {
  const en = language === "en";
  const nav: readonly [string, string, typeof current][] = [
    [en ? "Home" : "முகப்பு", en ? "/?lang=en" : "/", "home"],
    [en ? "Guidance" : "வழிகாட்டல்", `/journey?step=awareness&lang=${language}`, "journey"],
    [en ? "Study" : "படிப்பு", `/journey?step=study&lang=${language}`, "study"],
  ];
  const label = en ? "Main navigation" : "முதன்மை வழிசெலுத்தல்";
  const contextLabel = context === "owner" ? (en ? "Internal owner preview" : "உள்நிலை உரிமையாளர் ஆய்வு")
    : context === "synthetic" ? (en ? "Synthetic review example" : "செயற்கை ஆய்வு எடுத்துக்காட்டு") : "";
  return `<header class="site-header"><div class="site-header-inner"><a class="site-brand" href="${en ? "/?lang=en" : "/"}">${en ? "TN Engineering Guidance" : "பொறியியல் வழிகாட்டல்"}</a><nav class="site-nav" aria-label="${label}">${nav.map(([text, href, key]) => `<a href="${href}"${key === current ? ' aria-current="page"' : ""}>${text}</a>`).join("")}</nav><div class="site-language" aria-label="${en ? "Language" : "மொழி"}">${languageControl}</div>${contextLabel ? `<div class="site-context">${contextLabel}</div>` : ""}</div></header>`;
}

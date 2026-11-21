// Shared presentation shell for the existing guided and review-only routes.
// Navigation deliberately contains no link to the internal or synthetic preview.

export const GOOGLE_FONTS_HTML = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

export const SHARED_FONT_FAMILY = `"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Tamil", "Mukta Malar", "Nirmala UI", sans-serif`;

export const SITE_SHELL_CSS = `
.site-header{background:#fff;border-top:3px solid #1e40af;border-bottom:1px solid #e2e8f0;font-family:${SHARED_FONT_FAMILY}}
.site-header-inner{max-width:1280px;margin:auto;padding:10px 20px;display:flex;align-items:center;gap:12px 24px;flex-wrap:wrap}
.site-brand{font-weight:800;color:#0f172a;text-decoration:none;line-height:1.35;min-height:44px;display:inline-flex;align-items:center;font-size:1.05rem;letter-spacing:-0.015em}
.site-brand:hover{color:#1e40af}
.site-nav{display:flex;gap:4px 8px;flex-wrap:wrap;align-items:center;flex:1}
.site-nav a{color:#334155;text-decoration:none;padding:8px 12px;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;line-height:1.35;font-weight:600;font-size:0.92rem;transition:all 0.15s ease}
.site-nav a:hover{color:#1e40af;background:#f8fafc}
.site-nav a[aria-current=page]{color:#1e40af;background:#eff6ff;font-weight:750;border:1px solid #dbeafe}
.site-language{display:flex;gap:4px;align-items:center;flex-wrap:wrap;margin-left:auto}
.site-language a,.site-language button,.site-language span{font:inherit;line-height:1.35;min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:8px;font-size:0.88rem;font-weight:600}
.site-language a,.site-language button{color:#475569;background:#fff;border:1px solid #e2e8f0;cursor:pointer;text-decoration:none;transition:all 0.15s ease}
.site-language a:hover{background:#f8fafc;color:#1e40af;border-color:#cbd5e1}
.site-language [aria-current]{color:#1e40af;background:#eff6ff;font-weight:750;border:1px solid #bfdbfe}
.site-language form{margin:0}
.site-context{width:100%;font-size:.82rem;line-height:1.4;color:#475569;font-weight:700;letter-spacing:.02em}
.site-header a:focus-visible,.site-header button:focus-visible{outline:3px solid #2563eb;outline-offset:2px}
@media(max-width:640px){.site-header-inner{padding:6px 12px;gap:4px 8px}.site-brand{flex:1;min-width:0;font-size:.95rem;order:1;min-height:44px}.site-language{order:2;margin-left:auto}.site-language a,.site-language button,.site-language span{min-height:44px;padding:6px 10px;font-size:.85rem}.site-nav{order:3;width:100%;flex:none;display:flex;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;gap:6px;border-top:1px solid #edf0f5;padding:6px 0 2px 0;scrollbar-width:none}.site-nav::-webkit-scrollbar{display:none}.site-nav a{flex:0 0 auto;white-space:nowrap;padding:6px 12px;min-height:44px;font-size:.85rem;justify-content:center;border-radius:6px}.site-context{order:4;font-size:.75rem}}
`;

export function renderSiteHeader(
  language: "ta" | "en",
  current: "home" | "journey" | "study" | "colleges" | "review" | "planner",
  languageControl: string,
  context?: "owner" | "synthetic",
): string {
  const en = language === "en";
  const nav: readonly [string, string, typeof current][] = [
    [en ? "Home" : "முகப்பு", en ? "/?lang=en" : "/", "home"],
    [en ? "Guidance" : "வழிகாட்டல்", `/journey?step=awareness&lang=${language}`, "journey"],
    [en ? "Study" : "படிப்பு", `/journey?step=study&lang=${language}`, "study"],
    [en ? "Colleges" : "கல்லூரிகள்", `/colleges?lang=${language}`, "colleges"],
    [en ? "Choice Planner" : "விருப்பப் பட்டியல்", `/m5-guidance?lang=${language}`, "planner"],
  ];
  const label = en ? "Main navigation" : "முதன்மை வழிசெலுத்தல்";
  const contextLabel = context === "owner" ? (en ? "Internal owner preview" : "உள்நிலை உரிமையாளர் ஆய்வு")
    : context === "synthetic" ? (en ? "Synthetic review example" : "செயற்கை ஆய்வு எடுத்துக்காட்டு") : "";
  return `<header class="site-header"><div class="site-header-inner"><a class="site-brand" href="${en ? "/?lang=en" : "/"}">${en ? "TN Engineering Guidance" : "பொறியியல் வழிகாட்டல்"}</a><nav class="site-nav" aria-label="${label}">${nav.map(([text, href, key]) => `<a href="${href}"${key === current ? ' aria-current="page"' : ""}>${text}</a>`).join("")}</nav><div class="site-language" aria-label="${en ? "Language" : "மொழி"}">${languageControl}</div>${contextLabel ? `<div class="site-context">${contextLabel}</div>` : ""}</div></header>`;
}

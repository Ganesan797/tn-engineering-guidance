// Shared presentation shell for the existing guided and review-only routes.
// Navigation deliberately contains no link to the internal or synthetic preview.

export const GOOGLE_FONTS_HTML = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Mukta+Malar:wght@400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

export const SHARED_FONT_FAMILY = `"Plus Jakarta Sans", "Inter", "Mukta Malar", "Noto Sans Tamil", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nirmala UI", sans-serif`;

export const LOGO_CONCEPT_2_SVG = `<svg class="site-logo-icon" width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#F0FDFA"/><path d="M10 32C15 30 20 31 24 34C28 31 33 30 38 32V18C33 16 28 17 24 20C20 17 15 16 10 18V32Z" fill="#CCFBF1" stroke="#0F766E" stroke-width="2.5" stroke-linejoin="round"/><circle cx="17" cy="15" r="3" fill="#F59E0B"/><circle cx="24" cy="11" r="3" fill="#0F766E"/><circle cx="31" cy="15" r="3" fill="#1D4ED8"/></svg>`;

export const SITE_SHELL_CSS = `
:root{--color-primary:#0f766e;--color-primary-dark:#115e59;--color-primary-light:#f0fdfa;--color-accent-blue:#1d4ed8;--color-text-primary:#0f172a;--color-text-secondary:#475569;--color-advisory:#f59e0b}
.site-header{background:#fff;border-top:3.5px solid #0f766e;border-bottom:1px solid #e2e8f0;font-family:${SHARED_FONT_FAMILY}}
.site-header-inner{max-width:1280px;margin:auto;padding:10px 20px;display:flex;align-items:center;gap:12px 24px;flex-wrap:wrap}
.site-brand-container{display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap}
.site-brand{font-weight:800;color:#0f172a;text-decoration:none;line-height:1.25;min-height:44px;display:inline-flex;align-items:center;gap:8px;font-size:1.05rem;letter-spacing:-0.015em}
.site-brand:hover{color:#0f766e}
.site-logo-icon{width:28px;height:28px;flex-shrink:0;border-radius:7px}
.site-brand-text{display:flex;flex-direction:column}
.site-brand-title{font-weight:800}
.site-brand-sub{display:none;font-size:0.68rem;color:#ccfbf1;font-weight:600;line-height:1.2}
.civic-trust-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:9999px;font-size:0.74rem;font-weight:700;color:#065f46;white-space:nowrap}
.civic-shield-icon{width:11px;height:11px;flex-shrink:0}
.site-nav{display:flex;gap:4px 8px;flex-wrap:wrap;align-items:center;flex:1}
.site-nav a{color:#334155;text-decoration:none;padding:8px 12px;border-radius:8px;min-height:44px;display:inline-flex;align-items:center;line-height:1.35;font-weight:600;font-size:0.92rem;transition:all 0.15s ease}
.site-nav a:hover{color:#0f766e;background:#f0fdfa}
.site-nav a[aria-current=page]{color:#0f766e;background:#f0fdfa;font-weight:750;border:1px solid #ccfbf1}
.site-language{display:flex;gap:4px;align-items:center;flex-wrap:wrap;margin-left:auto}
.site-language a,.site-language button,.site-language span{font:inherit;line-height:1.35;min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;border-radius:8px;font-size:0.88rem;font-weight:600}
.site-language a,.site-language button{color:#475569;background:#fff;border:1px solid #e2e8f0;cursor:pointer;text-decoration:none;transition:all 0.15s ease}
.site-language a:hover{background:#f8fafc;color:#0f766e;border-color:#cbd5e1}
.site-language [aria-current]{color:#0f766e;background:#f0fdfa;font-weight:750;border:1px solid #99f6e4}
.site-language form{margin:0}
.site-context{width:100%;font-size:.82rem;line-height:1.4;color:#475569;font-weight:700;letter-spacing:.02em}
.site-header a:focus-visible,.site-header button:focus-visible{outline:3px solid #0f766e;outline-offset:2px}
.wayfinding-bar{background:#f0fdfa;border-top:1px solid #ccfbf1;border-bottom:1px solid #ccfbf1;padding:6px 16px;font-family:${SHARED_FONT_FAMILY}}
.wayfinding-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}
.wayfinding-step-label{display:inline-flex;align-items:center;gap:8px;font-size:0.82rem;font-weight:750;color:#134e4a}
.wayfinding-dot{width:8px;height:8px;border-radius:50%;background:#0f766e;flex-shrink:0}
.wayfinding-pct{font-size:0.75rem;font-weight:700;color:#0f766e}
.wayfinding-track{max-width:1280px;margin:4px auto 0;height:4px;background:#ccfbf1;border-radius:9999px;overflow:hidden}
.wayfinding-fill{height:100%;background:#0f766e;border-radius:9999px;transition:width 0.3s ease}
.site-bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:1000;background:#ffffff;border-top:1px solid #e2e8f0;display:grid;grid-template-columns:repeat(4,1fr);padding:6px 6px calc(6px + env(safe-area-inset-bottom,0px));box-shadow:0 -2px 10px rgba(0,0,0,0.06);font-family:${SHARED_FONT_FAMILY}}
.nav-tab-item{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50px;padding:4px 2px;color:#64748b;text-decoration:none;border-radius:12px;position:relative;transition:all 0.15s ease}
.nav-tab-item:hover{color:#0f766e}
.nav-icon-wrap{display:flex;align-items:center;justify-content:center;position:relative;padding:3px 14px;border-radius:16px;margin-bottom:2px}
.nav-tab-item.active{color:#0f766e;font-weight:750}
.nav-tab-item.active .nav-icon-wrap{background:#e6f4ea}
.nav-tab-item.active .nav-icon{stroke:#0f766e}
.nav-tab-item .nav-icon{width:22px;height:22px;flex-shrink:0}
.nav-tab-label{font-size:0.72rem;line-height:1.2;text-align:center;font-weight:650}
.nav-badge{position:absolute;top:-2px;right:4px;min-width:16px;height:16px;padding:0 4px;background:#d97706;color:#ffffff;border-radius:9999px;font-size:0.62rem;font-weight:800;display:flex;align-items:center;justify-content:center;line-height:1}
@media(min-width:768px){.site-bottom-nav{display:none !important}}
.site-language .lang-short{display:none !important}
@media(max-width:767px){
  body{padding-bottom:76px !important}
  .site-header{background:#0f766e;border-top:none;border-bottom:1px solid #0d6b64}
  .site-header-inner{padding:8px 12px;background:#0f766e;display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;gap:8px}
  .site-brand-container{display:flex;align-items:center;gap:6px;flex:1;min-width:0;overflow:hidden}
  .site-brand{color:#ffffff !important;font-size:0.88rem;min-height:auto;padding:0;gap:6px;display:flex;align-items:center;text-decoration:none;overflow:hidden;flex:1;min-width:0}
  .site-brand:hover{color:#ffffff}
  .site-logo-icon{display:none}
  .site-brand-text{min-width:0;overflow:hidden;display:flex;flex-direction:column}
  .site-brand-title{font-size:0.88rem;font-weight:800;color:#ffffff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .site-brand-sub{display:block;font-size:0.64rem;color:#ccfbf1;font-weight:500;line-height:1.2;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .civic-trust-badge{display:none}
  .site-language{margin-left:auto;flex-shrink:0;display:inline-flex;align-items:center;background:rgba(0,0,0,0.25);padding:2px;border-radius:9999px;border:1px solid rgba(255,255,255,0.25)}
  .site-language a,.site-language button,.site-language span{min-height:36px;padding:4px 10px;font-size:0.75rem;background:transparent;color:#e6fffa;border:none;border-radius:9999px;font-weight:600;text-decoration:none;box-sizing:border-box}
  .site-language [aria-current]{background:#ffffff !important;color:#0f766e !important;font-weight:800;border:none;box-shadow:0 1px 3px rgba(0,0,0,0.15)}
  .site-language [aria-current] *{color:#0f766e !important}
  .site-nav{display:none !important}
  .site-language .lang-long{display:none !important}
  .site-language .lang-short{display:inline-flex !important}
}
@media print{.site-bottom-nav,.wayfinding-bar{display:none !important}body{padding-bottom:0 !important}.site-independence-footer{background:none;border-top:1px solid #ccc;padding:10px 0;margin-top:1rem}}
.quick-section-heading{font-size:0.82rem;font-weight:800;color:#334155;margin:1.1rem 0 0.5rem;letter-spacing:0.02em;text-transform:uppercase}
.quick-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0.5rem 0 1rem;width:100%;max-width:100%}
.quick-tile{min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:break-word;border-radius:16px;padding:14px 12px;background:#ffffff;border:1px solid #e2e8f0;display:flex;flex-direction:column;align-items:flex-start;gap:6px;text-align:left;text-decoration:none;box-shadow:0 1px 3px rgba(15,23,42,0.04);transition:transform 0.15s ease,border-color 0.2s ease,box-shadow 0.15s ease}
.quick-tile:hover{transform:translateY(-2px);border-color:#0f766e;box-shadow:0 4px 12px rgba(15,118,110,0.12)}
.quick-tile-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.quick-tile-title{font-size:0.92rem;font-weight:800;color:#0f172a;line-height:1.25}
.quick-tile-sub{font-size:0.74rem;color:#64748b;line-height:1.3}
.phone-chips-card{background:#ffffff;border:1.5px solid #dce7e5;border-radius:16px;padding:14px 16px;margin:0.75rem 0 1rem;box-shadow:0 1px 3px rgba(15,23,42,0.03)}
.phone-chips-label{font-size:0.85rem;font-weight:800;color:#0f172a;margin-bottom:10px}
.chips-wrap{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chips-wrap .status-chip{text-decoration:none;transition:transform 0.15s ease}
.chips-wrap .status-chip:hover{transform:translateY(-1px);filter:brightness(0.96)}
.site-independence-footer{background:#f1f5f9;border-top:1px solid #e2e8f0;padding:20px;margin-top:2.5rem;font-family:${SHARED_FONT_FAMILY}}
.independence-inner{max-width:1160px;margin:auto}
.independence-title{font-size:0.85rem;color:#334155;margin:0 0 6px;font-weight:750}
.independence-text{font-size:0.78rem;color:#64748b;line-height:1.6;margin:0}
.independence-text a{color:#0f766e;font-weight:600;text-decoration:underline}
.welcome-banner-card{background:#ffffff;border:1.5px solid #99e2da;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(15,23,42,0.04);margin:0.75rem 0 0.5rem;max-width:100%;min-width:0;overflow-wrap:anywhere;text-decoration:none !important;color:inherit}
.welcome-banner-card:hover{border-color:#0f766e;box-shadow:0 4px 12px rgba(15,118,110,0.12);text-decoration:none !important}
.welcome-banner-card *{text-decoration:none !important}
.welcome-banner-card h3{font-size:0.95rem;font-weight:800;color:#0f172a;line-height:1.35;margin:0 0 3px}
.welcome-banner-card p{font-size:0.82rem;color:#475569;margin:0;line-height:1.4}
.welcome-step-pill{display:inline-block;margin-top:6px;font-size:0.72rem;font-weight:750;padding:2px 9px;border-radius:9999px;background:#fef3c7;color:#92400e;border:1px solid #fde68a}
.branch-mini-grid{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:1rem 0}
@media(max-width:540px){.branch-mini-grid{grid-template-columns:1fr;gap:10px}}
.branch-mini-tile{border-radius:14px;padding:14px 10px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;border:1px solid transparent;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.branch-mini-tile--cse{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}
.branch-mini-tile--ece{background:#f5f3ff;border-color:#ddd6fe;color:#5b21b6}
.branch-mini-tile--mech{background:#fff7ed;border-color:#fed7aa;color:#9a3412}
.branch-mini-title{font-size:0.86rem;font-weight:800;line-height:1.25}
.branch-mini-sub{font-size:0.75rem;font-weight:600;opacity:0.88;line-height:1.25}
.status-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:9999px;font-size:0.74rem;font-weight:700;border:1px solid transparent;min-height:30px}
.chip-govt{background:#dbeafe;color:#1e40af;border-color:#93c5fd}
.chip-aided{background:#ede9fe;color:#5b21b6;border-color:#c4b5fd}
.chip-sf{background:#f1f5f9;color:#334155;border-color:#cbd5e1}
.chip-quota{background:#dcfce7;color:#166534;border-color:#86efac}
.chip-hold{background:#fef3c7;color:#92400e;border-color:#fcd34d}
.honest-evidence-card{background:#ffffff;border:1px solid #fde68a;border-left:4px solid #f59e0b;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;margin:0.85rem 0}
.honest-evidence-icon{flex-shrink:0;width:38px;height:38px}
.honest-evidence-text{font-size:0.86rem;color:#92400e;line-height:1.45;font-weight:600}
`;

export function renderSiteHeader(
  language: "ta" | "en",
  current: "home" | "journey" | "study" | "colleges" | "review" | "planner" | "cutoff",
  languageControl: string,
  context?: "owner" | "synthetic",
  stepOverride?: "home" | "journey" | "study" | "colleges" | "review" | "planner" | "cutoff",
): string {
  const en = language === "en";
  const nav: readonly [string, string, typeof current][] = [
    [en ? "Home" : "முகப்பு", en ? "/?lang=en" : "/", "home"],
    [en ? "Guidance" : "வழிகாட்டி", `/journey?step=awareness&lang=${language}`, "journey"],
    [en ? "Study" : "படிப்புகள்", `/journey?step=study&lang=${language}`, "study"],
    [en ? "Colleges" : "கல்லூரிகள்", `/colleges?lang=${language}`, "colleges"],
    [en ? "Choice Planner" : "விருப்பப் பட்டியல்", `/m5-guidance?lang=${language}`, "planner"],
  ];
  const label = en ? "Main navigation" : "முதன்மை வழிசெலுத்தல்";
  const contextLabel = context === "owner" ? (en ? "Internal owner preview" : "உள்நிலை உரிமையாளர் ஆய்வு")
    : context === "synthetic" ? (en ? "Synthetic review example" : "செயற்கை ஆய்வு எடுத்துக்காட்டு") : "";

  const effectiveStep = stepOverride ?? current;
  const stepMeta: Record<string, { label: string; pct: string; width: string }> = {
    home: { label: en ? "Admissions Flow: Stage 1 / 4 • TNEA Guide" : "சேர்க்கைப் பாதை: நிலை 1 / 4 · வழிகாட்டி", pct: "25%", width: "25%" },
    journey: { label: en ? "Admissions Flow: Stage 1 / 4 • TNEA Guide" : "சேர்க்கைப் பாதை: நிலை 1 / 4 · வழிகாட்டி", pct: "25%", width: "25%" },
    study: { label: en ? "Admissions Flow: Stage 1 / 4 • TNEA Guide" : "சேர்க்கைப் பாதை: நிலை 1 / 4 · வழிகாட்டி", pct: "25%", width: "25%" },
    colleges: { label: en ? "Admissions Flow: Stage 2 / 4 • Colleges Directory" : "சேர்க்கைப் பாதை: நிலை 2 / 4 · கல்லூரிகள் பட்டியல்", pct: "50%", width: "50%" },
    cutoff: { label: en ? "Admissions Flow: Stage 3 / 4 • Cutoff Calculator" : "சேர்க்கைப் பாதை: நிலை 3 / 4 · கட்-ஆஃப் கணக்கீடு", pct: "75%", width: "75%" },
    planner: { label: en ? "Admissions Flow: Stage 4 / 4 • Choice Order Planner" : "சேர்க்கைப் பாதை: நிலை 4 / 4 · விருப்பப் பட்டியல்", pct: "100%", width: "100%" },
    review: { label: en ? "Review Mode" : "ஆய்வுப் பகுதி", pct: "100%", width: "100%" },
  };
  const currentMeta = stepMeta[effectiveStep] ?? stepMeta.home;

  const trustBadge = `<span class="civic-trust-badge"><svg class="civic-shield-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14l-4-4 1.41-1.41L11 13.17l5.59-5.59L18 9l-7 7z"/></svg>${en ? "Free • No Ads" : "இலவசம் • விளம்பரமில்லை"}</span>`;

  const wayfindingBar = `<div class="wayfinding-bar" id="wayfinding-bar"${current === "home" ? ' style="display:none"' : ""}><div class="wayfinding-inner"><span class="wayfinding-step-label"><span class="wayfinding-dot"></span>${currentMeta.label}</span><span class="wayfinding-pct">${currentMeta.pct}</span></div><div class="wayfinding-track"><div class="wayfinding-fill" style="width:${currentMeta.width}"></div></div></div>`;

  return `<header class="site-header"><div class="site-header-inner"><div class="site-brand-container"><a class="site-brand" href="${en ? "/?lang=en" : "/"}">${LOGO_CONCEPT_2_SVG}<div class="site-brand-text"><span class="site-brand-title">${en ? "TN Engineering Guidance" : "தமிழ்நாடு பொறியியல் வழிகாட்டி"}</span><span class="site-brand-sub">${en ? "Free • No Ads • No Tracking" : "இலவசம் • விளம்பரமில்லை • தரவு சேமிப்பில்லை"}</span></div></a>${trustBadge}</div><nav class="site-nav" aria-label="${label}">${nav.map(([text, href, key]) => `<a href="${href}"${key === current ? ' aria-current="page"' : ""}>${text}</a>`).join("")}</nav><div class="site-language" aria-label="${en ? "Language" : "மொழி"}">${languageControl}</div>${contextLabel ? `<div class="site-context">${contextLabel}</div>` : ""}</div>${wayfindingBar}</header>`;
}

export function renderIndependenceFooter(language: "ta" | "en"): string {
  const en = language === "en";
  return `<footer class="site-independence-footer" role="contentinfo"><div class="independence-inner"><p class="independence-title"><strong>${en ? "Independent Guidance Notice" : "முக்கிய அறிவிப்பு"}</strong></p><p class="independence-text">${en ? "This application is an independent, public-interest guidance tool designed to help students and parents navigate admissions clearly. It is not an official portal of the Government of Tamil Nadu or TNEA. All historical cutoff and college data are verified against official TNEA and DOTE published sources. Official registration, document verification, counselling fee payment, and final choice submission must be performed exclusively on the official portal at <a href=\"https://www.tneaonline.org/\" target=\"_blank\" rel=\"noopener\">tneaonline.org</a>." : "இது மாணவர்கள் மற்றும் பெற்றோர்களின் புரிதலுக்காக உருவாக்கப்பட்ட இலவச வழிகாட்டுதல் தளம் மட்டுமே; தமிழ்நாடு அரசு அல்லது TNEA அமைப்பின் அதிகாரப்பூர்வ இணையதளம் அல்ல. இங்குள்ள தகவல்கள் அதிகாரப்பூர்வ TNEA மற்றும் DOTE அறிவிப்புகளின் அடிப்படையில் தொகுக்கப்பட்டுள்ளன. சேர்க்கை விண்ணப்பம், கட்டணம் செலுத்துதல் மற்றும் விருப்பப் பதிவு அனைத்தையும் <a href=\"https://www.tneaonline.org/\" target=\"_blank\" rel=\"noopener\">tneaonline.org</a> என்ற அதிகாரப்பூர்வ இணையதளத்தில் மட்டுமே செய்ய வேண்டும்."}</p></div></footer>`;
}

export function renderSiteBottomNav(
  language: "ta" | "en",
  activeTab: "guide" | "colleges" | "cutoff" | "shortlist" | "home",
  shortlistCount?: number,
): string {
  const en = language === "en";
  const tabs = [
    {
      id: "home",
      label: en ? "Home" : "முகப்பு",
      href: en ? "/?lang=en" : "/",
      icon: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>`,
      isActive: activeTab === "home" || activeTab === "guide",
    },
    {
      id: "colleges",
      label: en ? "Colleges" : "தேடல்",
      href: `/colleges?lang=${language}`,
      icon: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/></svg>`,
      isActive: activeTab === "colleges",
    },
    {
      id: "cutoff",
      label: en ? "Cutoff" : "கட்-ஆஃப்",
      href: `/personal${en ? "?lang=en" : ""}`,
      icon: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="3"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="10" y2="11"/><line x1="14" y1="11" x2="16" y2="11"/><line x1="8" y1="16" x2="10" y2="16"/><line x1="14" y1="16" x2="16" y2="16"/></svg>`,
      isActive: activeTab === "cutoff",
    },
    {
      id: "shortlist",
      label: en ? "Shortlist" : "பட்டியல்",
      href: `/m5-guidance?tab=shortlist&lang=${language}`,
      icon: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>`,
      isActive: activeTab === "shortlist",
    },
  ];

  return `<nav id="site-bottom-nav" aria-label="${en ? "Mobile navigation" : "மொபைல் வழிசெலுத்தல்"}" class="site-bottom-nav">${tabs.map((tab) => {
    const badge = tab.id === "shortlist" && typeof shortlistCount === "number" && shortlistCount > 0
      ? `<span class="nav-badge">${shortlistCount}</span>` : "";
    return `<a href="${tab.href}" class="nav-tab-item${tab.isActive ? " active" : ""}"${tab.isActive ? ' aria-current="page"' : ""}><div class="nav-icon-wrap">${tab.icon}${badge}</div><span class="nav-tab-label">${tab.label}</span></a>`;
  }).join("")}</nav>`;
}

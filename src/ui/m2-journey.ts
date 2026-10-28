import { CHECK_COPY, CHECK_QUESTIONS_EN, CHECK_TITLES_EN, PREPARATION_COPY } from "./journey-copy.ts";
import type { GuidanceDependencies } from "../application/guidance.ts";
import type { AwarenessPack } from "../student-semantics/awareness.ts";
import { renderM3PersonalResult, type M3PresentationOptions } from "./m3-personal-result.ts";
import { contentMarkup } from "./student-entry.ts";
import { answeredJourneyFields, renderJourneyAnswers } from "./journey-answers.ts";
import {
  EMPTY_JOURNEY, evaluateJourneyGuidance, nextJourneyQuestion,
  type JourneyField, type JourneyState,
} from "../m2/journey.ts";

export type JourneyPage = "awareness" | "study" | "compare" | "route" | "prepare" | "check";

const STYLE = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:17px/1.65 "Nirmala UI","Noto Sans Tamil","Latha",system-ui,sans-serif}main{max-width:720px;margin:auto;padding:16px}h1{font-size:1.55rem;line-height:1.35}h2{font-size:1.2rem;line-height:1.4}p{margin:.7rem 0 1rem}.card{background:#fff;border:1px solid #d8dde6;border-radius:12px;padding:1.1rem;margin:1rem 0}.actions{display:flex;flex-wrap:wrap;gap:.65rem;margin:1.3rem 0}a,button{color:#174ea6}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #174ea6;outline-offset:3px}.action,button{display:inline-block;border:1px solid #174ea6;border-radius:8px;padding:.75rem 1rem;background:#fff;font:inherit;text-decoration:none;cursor:pointer}.primary{background:#174ea6;color:#fff}.notice{font-size:.9rem;color:#46536a}.review{border-left:4px solid #a96800;padding:.5rem .8rem;background:#fff6e7}input[type=number]{display:block;width:100%;max-width:14rem;font:inherit;padding:.7rem;margin:.5rem 0 1rem}fieldset{border:0;padding:0;margin:0}label{display:block;margin:.85rem 0}label:has(input[type=radio]){padding:.7rem;border:1px solid #d8dde6;border-radius:8px}input[type=radio]{margin-right:.7rem}details{margin:1rem 0}summary{cursor:pointer;padding:.6rem 0;min-height:44px}.m3-result{overflow-wrap:anywhere}.m3-result h3{font-size:1.05rem}.cutoff-score{font-size:1.8rem;margin:.4rem 0}.evidence-reference{border-left:3px solid #d8dde6;padding-left:.8rem}.m3-result button{max-width:100%}ul,ol{padding-left:1.4rem}li{margin:.5rem 0}@media(min-width:700px){main{padding:28px}}`;

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

// Read the existing review draft, rather than keeping a second copy of its claims.
export function reviewedTamilUnit(markdown: string, id: "B01" | "B04" | "B05"): string {
  const normalized = markdown.replaceAll("\r\n", "\n");
  const heading = new RegExp(`^## ${id} —[^\n]*\n`, "m").exec(normalized);
  if (!heading) throw new Error(`Reviewed unit ${id} is missing`);
  const rest = normalized.slice(heading.index + heading[0].length);
  const section = rest.split(/^## B\d{2} —/m)[0];
  const tamil = section.split("**Tamil draft**")[1]?.split(/\n\*\*(?:Explain why|Next action|Evidence and limits):/)[0]?.trim();
  if (!tamil) throw new Error(`Reviewed Tamil unit ${id} is missing`);
  return tamil.replace(/\s*\(Q\d{3}(?:\/Q\d{3})*\)/g, "");
}

function reviewedEnglishUnit(markdown: string, id: "B01" | "B04" | "B05"): string {
  const normalized = markdown.replaceAll("\r\n", "\n");
  const heading = new RegExp(`^## ${id} —[^\n]*\n`, "m").exec(normalized);
  if (!heading) throw new Error(`Reviewed unit ${id} is missing`);
  const section = normalized.slice(heading.index + heading[0].length).split(/^## B\d{2} —/m)[0];
  const english = section.split("### English answer\n")[1]?.split("\n**Tamil draft**")[0]?.trim();
  if (!english) throw new Error(`Reviewed English unit ${id} is missing`);
  return english.replace(/\s*\(Q\d{3}(?:\/Q\d{3})*\)/g, "");
}

// Keep the reviewed A01–A07 Tamil draft as the single source of branch examples.
export function reviewedAwarenessTamilQuestion(markdown: string, unit: "A01" | "A04" | "A05" | "A06", question: string): string {
  const normalized = markdown.replaceAll("\r\n", "\n");
  const heading = new RegExp(`^## ${unit} —[^\n]*\n`, "m").exec(normalized);
  if (!heading) throw new Error(`Reviewed awareness unit ${unit} is missing`);
  const section = normalized.slice(heading.index + heading[0].length).split(/^## A\d{2} —/m)[0];
  const tamil = section.split("### Tamil draft\n")[1]?.split("**Useful next direction:**")[0];
  const line = tamil?.split("\n").find((entry) => entry.startsWith(`- **${question}:** `));
  if (!line) throw new Error(`Reviewed awareness question ${unit}/${question} is missing`);
  return line.slice(`- **${question}:** `.length).trim();
}

const QUESTIONS: Readonly<Record<JourneyField, { title: string; why: readonly [string, string]; choices?: readonly [string, string][] }>> = {
  year: { title: "எந்த ஆண்டு சேர்க்கையைப் பற்றி கேட்கிறீர்கள்?", why: CHECK_COPY.yearWhy, choices: [["2026", "2026"], ["other", "வேறு ஆண்டு"]] },
  stream: { title: "நீங்கள் 12 ஆம் வகுப்பு பொதுக் கல்விப் பிரிவில் (HSC academic) படித்தீர்களா?", why: CHECK_COPY.streamWhy, choices: [["academic", "ஆம்"], ["other", "இல்லை / வேறு வழி"]] },
  improvement: { title: "மேம்பாட்டுத் தேர்வில் பெற்ற மதிப்பெண்களைப் பயன்படுத்துகிறீர்களா?", why: CHECK_COPY.improvementWhy, choices: [["yes", "ஆம்"], ["no", "இல்லை"]] },
  improvement_year: { title: "மேம்பாட்டுத் தேர்வு மதிப்பெண்கள் எந்த ஆண்டில் பெறப்பட்டன?", why: CHECK_COPY.improvementYearWhy },
  maths: { title: "கணித மதிப்பெண் எவ்வளவு (100-க்கு)?", why: CHECK_COPY.mathsWhy },
  physics: { title: "இயற்பியல் மதிப்பெண் எவ்வளவு (100-க்கு)?", why: CHECK_COPY.physicsWhy },
  chemistry: { title: "வேதியியல் மதிப்பெண் எவ்வளவு (100-க்கு)?", why: CHECK_COPY.chemistryWhy },
};

function link(href: string, label: string, primary = false): string {
  return `<a class="action${primary ? " primary" : ""}" href="${href}">${label}</a>`;
}

function makeJourneyNav(language: "ta" | "en") {
  return (page: "awareness" | "study" | "compare" | "route" | "prepare" | "check", label: string, state: JourneyState, primary = false): string => {
    if (Object.values(state).every((value) => value === null)) return link(`/journey?step=${page}${language === "en" ? "&amp;lang=en" : ""}`, label, primary);
    return `<form action="/journey${language === "en" ? "?lang=en" : ""}" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><button class="${primary ? "primary" : ""}" name="navigate" value="${page}" type="submit">${label}</button></form>`;
  };
}

export function renderM2Journey(
  page: JourneyPage,
  pack: AwarenessPack,
  reviewedBatch: string,
  reviewedAwareness: string,
  dependencies: GuidanceDependencies,
  state: JourneyState = EMPTY_JOURNEY,
  error?: string,
  presentation: M3PresentationOptions = {},
  language: "ta" | "en" = "ta",
): string {
  const en = language === "en";
  const t = (pair: readonly [string, string]) => pair[en ? 1 : 0];
  const journeyNav = makeJourneyNav(language);
  const actionUrl = `/journey${en ? "?lang=en" : ""}`;
  const item = (id: string) => {
    const found = pack.items.find((candidate) => candidate.id === id);
    if (!found) throw new Error(`Approved awareness unit ${id} is missing`);
    return found;
  };
  const approved = (id: string) => {
    const found = item(id);
    return `<section class="card" data-content-id="${id}"><h2>${escape(found.presentations[language].title)}</h2>${contentMarkup(found.presentations[language].body)}</section>`;
  };
  const approvedWithActions = (id: "AW-01" | "AW-03", afterParagraph: number, actions: string) => {
    const found = item(id);
    const paragraphs = found.presentations[language].body.split(/\n\n+/);
    if (paragraphs.length <= afterParagraph && !en) throw new Error(`Approved awareness unit ${id} has changed structure`);
    return `<section class="card" data-content-id="${id}"><h2>${escape(found.presentations[language].title)}</h2>${paragraphs.map((paragraph, index) =>
      contentMarkup(paragraph) + (index === Math.min(afterParagraph - 1, paragraphs.length - 1) ? actions : "")).join("")}</section>`;
  };
  const official = item("AW-03").sources.find((source) => source.source_id === "SRC002");
  if (!official) throw new Error("TNEA source is missing");
  const a = (unit: "A01" | "A04" | "A05" | "A06", question: string) =>
    contentMarkup(reviewedAwarenessTamilQuestion(reviewedAwareness, unit, question));
  const draftNotice = `<p class="notice">பாட எடுத்துக்காட்டுகள் குறிப்பிட்ட பாடத்திட்டத்துக்கானவை; எல்லா கல்லூரிகளுக்கும் ஒரே மாதிரி அல்ல.</p>`;
  const fieldEvidence = `<details><summary>பாட எடுத்துக்காட்டுகளின் மூலம் மற்றும் வரம்பு</summary><p>எடுத்துக்காட்டுகள் Anna University-யின் 2026–27 தொகுப்புக்கான R2025 Revised 1 இணைப்புக் கல்லூரி பாடத்திட்டங்களிலிருந்து; தன்னாட்சிக் கல்லூரி அல்லது வேறு regulation மாறலாம். நீங்கள் பார்க்கும் கல்லூரியின் சரியான பாடத்திட்டத்தைச் சரிபார்க்கவும். <a href="https://cac.annauniv.edu/aidetails/revision_ai_ug_cands_2025ft.html">அதிகாரப்பூர்வ பாடத்திட்டப் பட்டியல்</a>.</p></details>`;
  let body = "";
  if (en && page === "awareness") {
    const actions = `<nav class="actions">${journeyNav("study", "What might I study?", state, true)}${journeyNav("route", "Understand the TNEA route", state)}${journeyNav("check", "Check my details", state)}</nav>`;
    body = `<h1>Start with engineering</h1><p>You do not need marks or a college choice to begin.</p>${approvedWithActions("AW-01", 1, actions)}${approved("AW-02")}`;
  } else if (en && page === "study") {
    body = `<h1>What might I study?</h1><p>Explore fields before choosing a college.</p>${approved("AW-02")}${approved("AW-07")}<nav class="actions">${journeyNav("compare", "Think about different fields", state, true)}${journeyNav("route", "Understand the TNEA route", state)}</nav>`;
  } else if (en && page === "compare") {
    body = `<h1>Think about different fields</h1>${approved("AW-07")}<nav class="actions">${journeyNav("route", "Understand the TNEA route", state, true)}${journeyNav("study", "Explore fields", state)}</nav>`;
  } else if (en && page === "route") {
    const actions = `<nav class="actions">${journeyNav("prepare", "What should I prepare?", state, true)}${journeyNav("study", "Explore engineering fields", state)}${journeyNav("check", "Check my details", state)}</nav>`;
    body = `<h1>The first-year TNEA route</h1>${approvedWithActions("AW-03", 3, actions)}${approved("AW-05")}<details class="card"><summary>More about applying and counselling</summary>${contentMarkup(reviewedEnglishUnit(reviewedBatch, "B01"))}${contentMarkup(reviewedEnglishUnit(reviewedBatch, "B04"))}</details>`;
  } else if (en && page === "prepare") {
    const preparation = reviewedEnglishUnit(reviewedBatch, "B05");
    const blocks = preparation.split(/\n\n+/);
    const list = blocks.find(block => block.startsWith("- "));
    const entries = list?.split("\n") ?? [];
    const preparationHtml = list && entries.length === 3 ? blocks.map((block, index) => index === 0
      ? `<p>${t(PREPARATION_COPY.first)}</p><p>${t(PREPARATION_COPY.second)}</p>` : block === list
      ? `<h3>Basic preparation</h3>${contentMarkup(entries[0])}<p>${t(PREPARATION_COPY.conditional)}</p><details><summary>Only if relevant to a claim you make</summary>${contentMarkup(entries.slice(1).join("\n"))}</details>`
      : contentMarkup(block)).join("") : contentMarkup(preparation);
    body = `<h1>Prepare before applying</h1><p>Do not upload documents here. Check the official notice for your admission year.</p><section class="card" data-content-id="B05"><h2>2026 application preparation</h2>${preparationHtml}<p>TFC is a TNEA Facilitation Centre. <a href="/journey/questions?id=Q083&amp;lang=en" target="_blank" rel="noopener">What can I ask if my situation is unclear? (new tab)</a></p></section><nav class="actions">${journeyNav("check", "Check my details if I wish", state, true)}${journeyNav("route", "Return to the TNEA route", state)}</nav>`;
  } else if (page === "awareness") {
    const actions = `<nav class="actions">${journeyNav("study", "அடுத்து: என்ன படிப்பேன்?", state, true)}<details><summary>வேறு பகுதியை நேரடியாகப் பார்க்க</summary>${journeyNav("compare", "துறைகள் எப்படி வேறுபடுகின்றன?", state)}${journeyNav("route", "TNEA சேர்க்கை வழியைப் புரிந்துகொள்ள", state)}${journeyNav("check", "என் நிலையை நேரடியாகச் சரிபார்க்க", state)}</details></nav>`;
    body = `<h1>பொறியியல் பற்றி இங்கே தொடங்கலாம்</h1><p>மதிப்பெண்களோ கல்லூரித் தேர்வோ இப்போது தேவையில்லை.</p>${approvedWithActions("AW-01", 1, actions)}<section class="card" data-content-id="A01"><h2>பொறியியல் படிப்பும் பணியும்</h2>${a("A01", "Q026")}${a("A01", "Q028")}</section><section class="card" data-content-id="A04"><h2>பல துறைகள் உள்ளன</h2>${a("A04", "Q036")}</section>${draftNotice}`;
  } else if (page === "study") {
    body = `<h1>பொறியியலில் என்ன படிப்பேன்?</h1><p>துறைகளில் பாடங்களும் செய்முறைப் பணிகளும் மாறும். ஆர்வமான பகுதியை மட்டும் திறந்து பாருங்கள்; இப்போது ஒரு பிரிவைத் தேர்ந்தெடுக்க வேண்டியதில்லை.</p><nav class="actions">${journeyNav("compare", "துறைகள் எப்படி வேறுபடுகின்றன?", state, true)}${journeyNav("route", "TNEA சேர்க்கை வழியைப் புரிந்துகொள்ள", state)}${journeyNav("awareness", "அறிமுகத்திற்குத் திரும்ப", state)}</nav>${a("A01", "Q035")}<section class="card" data-content-id="A04"><h2>சில துறைகளின் பாட எடுத்துக்காட்டுகள்</h2><details><summary>கணினி, IT, AI/Data</summary>${a("A04", "Q037")}${a("A04", "Q038")}${a("A04", "Q043")}</details><details><summary>மின்னணு மற்றும் தகவல் தொடர்பு — ECE</summary>${a("A04", "Q039")}</details><details><summary>மின்சக்தி மற்றும் மின் இயந்திரங்கள் — EEE</summary>${a("A04", "Q040")}</details><details><summary>இயந்திர வடிவமைப்பு / உற்பத்தி — Mechanical</summary>${a("A04", "Q041")}</details><details><summary>கட்டிடம் / அடிப்படை வசதிகள் — Civil</summary>${a("A04", "Q042")}</details>${a("A04", "Q044")}</section>${fieldEvidence}${draftNotice}`;
  } else if (page === "compare") {
    body = `<h1>துறைகள் எப்படி வேறுபடுகின்றன?</h1><p>ஒரு துறையின் பெயர் மட்டும் போதாது. தொடர்ந்து செய்ய விரும்பும் செயலையும் பாடங்களையும் ஒப்பிட்டுப் பாருங்கள். இது உங்களுக்கான திறன் தீர்ப்பு அல்ல.</p><nav class="actions">${journeyNav("route", "அடுத்து: TNEA சேர்க்கை வழியைப் புரிந்துகொள்ள", state, true)}${journeyNav("study", "பாடங்களை மீண்டும் பார்க்க", state)}${journeyNav("awareness", "அறிமுகத்திற்குத் திரும்ப", state)}</nav><section class="card" data-content-id="A06"><h2>எந்த வேலைப் பக்கம் உங்களை ஈர்க்கிறது?</h2>${contentMarkup("எந்த வகையான பணிகளைத் தொடர்ந்து செய்ய விரும்புகிறீர்கள் என்று யோசித்துப் பாருங்கள்: நிரலாக்கமும் கணினி அமைப்புகளைப் பற்றி சிந்திப்பதும்; மின்சுற்றுகளும் சமிக்ஞைகளும்; மின்சாரமும் இயந்திரங்களும்; இயந்திர வடிவமைப்பும் உற்பத்தியும்; அல்லது கட்டமைப்பு, நிலம், நீர், போக்குவரத்து சார்ந்த பணிகளும்.\n\nபாடங்களைப் பார்த்து, அது தொடர்பான ஒரு சிறிய செயலை முயற்சி செய்யலாம். கடினமாக இருந்தாலும் எதைத் தொடர்ந்து கற்க விரும்புகிறீர்கள் என்று பாருங்கள். இது உங்கள் தேர்வைப் பற்றி யோசிக்க உதவும். உங்கள் திறனைக் கணக்கிட்டுத் தீர்ப்பு வழங்காது.")}</section><section class="card" data-content-id="A04"><h2>பாடங்களையும் செய்முறையையும் ஒப்பிடுங்கள்</h2>${contentMarkup("பொறியியலில் பல முக்கியத் துறைகள் உள்ளன. ஒரு எளிமையான அறிமுகமாக இவற்றைப் பார்க்கலாம்: கணினிப் பிரிவுகள் (CSE, IT, AI & Data Science); மின்னணு மற்றும் தகவல் தொடர்பு (ECE); மின்சக்தி மற்றும் மின் இயந்திரங்கள் (EEE); இயந்திரங்கள், வடிவமைப்பு மற்றும் உற்பத்தி (Mechanical); கட்டடங்கள் மற்றும் உள்கட்டமைப்பு (Civil). இவை தவிர வேதியியல், உயிரித் தொழில்நுட்பம், உணவு, வேளாண்மை, துணிநுட்பம், வானூர்தி போன்ற சிறப்புத் துறைகளும் உள்ளன.\n\nஇது ஒரு ஆரம்ப அறிமுக வரைபடம் மட்டுமே; எந்தத் துறை சிறந்தது என்று சொல்லும் தரவரிசை அல்ல.")}<p>ஒரு துறையில் ஆர்வம் வந்தால், மேலுள்ள பாடங்களை மீண்டும் பார்க்க என்ற இணைப்பில் அதன் பாடம், ஆய்வகம், திட்டப்பணி ஆகியவற்றைப் பாருங்கள்.</p></section><details class="card" data-content-id="A05"><summary>CSE, IT, AI & DS, AI & ML — மேலும் ஒப்பிட</summary>${contentMarkup("இந்த நான்கு படிப்புகளிலும் பல பொதுவான கணினிப் பாடங்கள் இருக்கும். ஆனால் அவற்றின் கவனம் கொஞ்சம் வேறுபடும்.\n\nCSE பரந்த கணினி அடிப்படையைக் கொண்டது. IT இணையம் மற்றும் தகவல் அமைப்புகளை அதிகம் வலியுறுத்துகிறது. AI & Data Science தரவுப் பகுப்பாய்வு, புள்ளியியல் மற்றும் AI சார்ந்த பகுதிகளில் அதிக கவனம் செலுத்துகிறது. நாம் பார்த்த CSE (AI & ML) பாடத்திட்டம் CSE அடிப்படையுடன் AI மற்றும் Machine Learning பகுதிகளை மேலும் சேர்க்கிறது.\n\nநான்கிலும் programming மற்றும் பல computing subjects பொதுவாக இருக்கும். இங்கு “AI & ML” என்று கூறப்படும் உதாரணம் குறிப்பாக CSE (AI & ML) பாடத்திட்டத்தைச் சார்ந்தது; இதை ஒத்த பெயருள்ள எல்லா படிப்புகளுக்கும் பொதுவாகப் பயன்படுத்த முடியாது.\n\nஅதனால் பெயரை மட்டும் வைத்து முடிவு செய்யாமல், குறிப்பிட்ட கல்லூரி, curriculum regulation, subjects மற்றும் practical work ஆகியவற்றை ஒப்பிடுங்கள். இவை படிப்பு வேறுபாடுகள் மட்டுமே; தனித்தனி வேலை உத்தரவாதங்கள் அல்ல.")}</details>${fieldEvidence}${draftNotice}`;
  } else if (page === "route") {
    const actions = `<nav class="actions">${journeyNav("prepare", "எதைத் தயார்செய்ய வேண்டும்?", state, true)}${journeyNav("study", "பொறியியல் துறைகளை மேலும் ஆராய", state)}${journeyNav("check", "விருப்பப்பட்டால் என் நிலையைச் சரிபார்க்க", state)}</nav>`;
    body = `<h1>முதல் ஆண்டு TNEA வழி</h1>${approvedWithActions("AW-03", 3, actions)}${approved("AW-05")}<details class="card"><summary>விண்ணப்பம் மற்றும் கலந்தாய்வு — மேலும் விளக்கம்</summary>${contentMarkup(reviewedTamilUnit(reviewedBatch, "B01"))}${contentMarkup(reviewedTamilUnit(reviewedBatch, "B04"))}</details>`;
  } else if (page === "prepare") {
    const preparation = reviewedTamilUnit(reviewedBatch, "B05");
    const blocks = preparation.split(/\n\n+/);
    const list = blocks.find(block => block.startsWith("- "));
    const entries = list?.split("\n") ?? [];
    // Re-layout the existing three reviewed list items without changing their claims.
    const preparationHtml = list && entries.length === 3 ? blocks.map((block, index) => index === 0
      ? `<p>${t(PREPARATION_COPY.first)}</p><p>${t(PREPARATION_COPY.second)}</p>` : block === list
      ? `<h3>அடிப்படை தயாரிப்பு</h3>${contentMarkup(entries[0])}<p>${t(PREPARATION_COPY.conditional)}</p><details><summary>கோரும் பிரிவு / சலுகைக்குப் பொருந்தினால் மட்டும்</summary>${contentMarkup(entries.slice(1).join("\n"))}</details>`
      : contentMarkup(block)).join("") : contentMarkup(preparation);
    body = `<h1>விண்ணப்பத்திற்கு முன் தயாராகலாம்</h1><p>ஆவணங்களை இங்கே பதிவேற்ற வேண்டாம். உங்கள் சேர்க்கை ஆண்டுக்கான அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்.</p><section class="card" data-content-id="B05"><h2>2026 விண்ணப்பத் தயாரிப்பு</h2>${preparationHtml}<p>TFC என்பது TNEA உதவி மையம். <a href="/journey/questions?id=Q083" target="_blank" rel="noopener">உங்கள் நிலை தெளிவில்லையெனில் என்ன கேட்கலாம்? (புதிய தாவல்)</a></p></section><nav class="actions">${journeyNav("check", "விருப்பப்பட்டால் என் நிலையைச் சரிபார்க்க", state, true)}${journeyNav("route", "TNEA வழிக்குத் திரும்ப", state)}</nav>`;
  } else {
    const question = nextJourneyQuestion(state);
    if (question !== null) {
      const spec = QUESTIONS[question];
      const originalMarks = state.improvement === true && typeof state.improvement_year === "number" && state.improvement_year >= 2006;
      const baseTitle = en ? CHECK_TITLES_EN[question] : spec.title;
      const title = originalMarks && ["maths", "physics", "chemistry"].includes(question)
        ? en ? `Before the improvement exam: ${baseTitle}` : `மேம்பாட்டுத் தேர்வுக்கு முன் பெற்ற அசல் ${baseTitle}` : baseTitle;
      const markInput = `<label for="answer">${title}</label><input id="answer" name="answer" type="number" inputmode="numeric" aria-describedby="${error ? "answer-error" : "answer-help"}" min="${question === "improvement_year" ? "1900" : "0"}" max="${question === "improvement_year" ? "2026" : "100"}" required>`;
      const choice = (value: string, tamil: string) => !en ? tamil : value === "2026" ? "2026"
        : value === "academic" || value === "yes" ? "Yes" : value === "no" ? "No"
        : question === "year" ? "Another year" : "No / another path";
      const options = spec.choices
        ? `<fieldset aria-describedby="${error ? "answer-error" : "answer-help"}"><legend>${title}</legend>${spec.choices.map(([value, label]) => `<label><input type="radio" name="answer" value="${value}" required>${choice(value, label)}</label>`).join("")}</fieldset>`
        : markInput;
      const answered = answeredJourneyFields(state);
      const previous = answered.at(-1);
      const help = question === "stream" ? `<p class="notice">${t(CHECK_COPY.streamHelp)} <a href="/journey/questions?id=Q081&amp;lang=${language}" target="_blank" rel="noopener">${t(CHECK_COPY.moreStreams)}</a></p>`
        : question === "improvement" ? `<p class="notice">${t(CHECK_COPY.improvementHelp)} <a href="/journey/questions?id=Q080&amp;lang=${language}" target="_blank" rel="noopener">${t(CHECK_COPY.moreImprovement)}</a></p>` : "";
      const reviewText = en ? "" : `<details><summary lang="en">English — wording for review</summary><div lang="en">${question === "year" ? `<p>${CHECK_COPY.benefit[1]}</p><p>${CHECK_COPY.scope[1]}</p>` : ""}<p>${CHECK_QUESTIONS_EN[question]}</p><p>${originalMarks ? CHECK_COPY.originalHelp[1] : spec.why[1]}</p>${error ? `<p>${error === CHECK_COPY.lostAnswers[0] ? CHECK_COPY.lostAnswers[1] : `${question === "improvement_year" ? CHECK_COPY.yearError[1] : ["maths", "physics", "chemistry"].includes(question) ? CHECK_COPY.markError[1] : CHECK_COPY.choiceError[1]} ${CHECK_COPY.errorHelp[1]}`}</p>` : ""}</div></details>`;
      body = `<h1>${t(CHECK_COPY.title)}</h1>${question === "year" ? `<p>${t(CHECK_COPY.benefit)}</p><p class="notice">${t(CHECK_COPY.scope)}</p>` : ""}<p class="notice">${t(CHECK_COPY.questionNumber)} ${answered.length + 1} · ${state.year === 2026 ? `${t(CHECK_COPY.yearContext)}: 2026` : t(CHECK_COPY.yearPrompt)}</p><form class="card" action="${actionUrl}" method="post" novalidate><input type="hidden" name="state" value="${escape(JSON.stringify(state))}">${options}<p id="answer-help">${originalMarks ? t(CHECK_COPY.originalHelp) : t(spec.why)}</p>${help ? `<details><summary>${t(CHECK_COPY.moreHelp)}</summary>${help}</details>` : ""}${error ? `<p role="alert" id="answer-error">${escape(error)}</p>` : ""}<div class="actions"><button class="primary" type="submit">${t(CHECK_COPY.continue)}</button><button type="submit" name="unknown" value="1" formnovalidate>${t(CHECK_COPY.unknownChoice)}</button>${previous ? `<button type="submit" name="edit" value="${previous}" formnovalidate>${t(CHECK_COPY.previous)}</button>` : ""}</div>${previous ? `<p class="notice">${t(CHECK_COPY.previousHelp)}</p>` : ""}</form>${reviewText}${renderJourneyAnswers(state, language, actionUrl)}${journeyNav("route", t(CHECK_COPY.routeBack), state)}`;
    } else {
      const evaluation = evaluateJourneyGuidance(state, dependencies);
      body = renderM3PersonalResult(evaluation, presentation, language);
    }
  }
  const preserveCheck = page === "check" || Object.values(state).some((value) => value !== null);
  if (page === "route") body += `<p><a href="/journey/questions?id=Q060${en ? "&amp;lang=en" : ""}"${preserveCheck ? ' target="_blank" rel="noopener"' : ""}>${en ? "Completed a diploma? Read about direct second-year entry" : "டிப்ளமோ முடித்தவரா? நேரடி இரண்டாம் ஆண்டு வழியைப் பார்க்க"}${preserveCheck ? ` (${t(CHECK_COPY.newTab)})` : ""}</a>.</p><p>${t(PREPARATION_COPY.diploma)}</p>`;
  if (page === "check" && nextJourneyQuestion(state) === null) body += `<p><a href="/journey/questions?id=Q002${en ? "&amp;lang=en" : ""}" target="_blank" rel="noopener">${en ? "Cutoff, percentage and rank — explanation (new tab)" : "கட்-ஆஃப், சதவீதம், தரவரிசை — விளக்கம் (புதிய தாவல்)"}</a></p>`;
  body += `<p><a href="/journey/questions${en ? "?lang=en" : ""}"${preserveCheck ? ' target="_blank" rel="noopener"' : ""}>${t(CHECK_COPY.questionsExplore)}${preserveCheck ? ` (${t(CHECK_COPY.newTab)})` : ""}</a></p>`;
  const sources = page === "awareness" || page === "study" || page === "compare" ? item("AW-01").sources : [official];
  const source = `<p class="notice">${t(CHECK_COPY.source)}: ${sources.map((entry) => `<a href="${escape(entry.url)}">${escape(entry.name)}</a>`).join(" · ")}. ${t(CHECK_COPY.reviewNote)} ${t(CHECK_COPY.sourceLimit)}</p>`;
  const position = en ? ({ awareness: "1. Understand engineering", study: "1. Understand engineering", compare: "1. Understand engineering", route: "2. Understand admission", prepare: "3. Prepare", check: CHECK_COPY.position[1] })[page]
    : ({ awareness: "1. படிப்பை அறிதல்", study: "1. படிப்பை அறிதல்", compare: "1. படிப்பை அறிதல்", route: "2. சேர்க்கை வழியைப் புரிதல்", prepare: "3. தயாராகுதல்", check: CHECK_COPY.position[0] })[page];
  const switcher = `<nav class="languages" aria-label="${en ? "Language" : "மொழி"}">${(["ta", "en"] as const).map(target => target === language ? `<span lang="${target}" aria-current="page">${target === "ta" ? "தமிழ்" : "English"}</span>` : `<form action="/journey${target === "en" ? "?lang=en" : ""}" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><button type="submit" name="navigate" value="${page}" lang="${target}">${target === "ta" ? "தமிழ்" : "English"}</button></form>`).join(" ")}</nav>`;
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TN Engineering Guidance — ${en ? "Guidance" : "வழிகாட்டல்"}</title><style>${STYLE}.answer-review li{margin:1rem 0}.answer-review button{font-size:.9rem;padding:.4rem .6rem}.actions details{flex-basis:100%}#answer-error{border-left:4px solid #a32020;padding:.7rem;background:#fff0f0}a{overflow-wrap:anywhere}.position{font-size:.85rem;color:#46536a}.languages{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap}.languages form{margin:0}.languages button{padding:.35rem .7rem}</style></head><body><main><a class="action" href="/journey?step=explore&amp;lang=${language}">${en ? "Explore colleges and programmes (synthetic review)" : "கல்லூரி / பாடப்பிரிவு மாதிரியை ஆராய"}</a>${switcher}<p class="position" aria-label="${en ? "Current section" : "இப்போது இருக்கும் பகுதி"}">${position}</p>${body}${source}<p>${link(en ? "/?lang=en" : "/", en ? "Return to the start" : "முதற்பக்கத்திற்குத் திரும்ப")}</p></main></body></html>`;
}

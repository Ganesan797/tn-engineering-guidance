import type { GuidanceDependencies } from "../application/guidance.ts";
import type { AwarenessPack } from "../student-semantics/awareness.ts";
import { contentMarkup } from "./student-entry.ts";
import {
  EMPTY_JOURNEY, journeyGuidanceResult, nextJourneyQuestion,
  type JourneyField, type JourneyState,
} from "../m2/journey.ts";

export type JourneyPage = "awareness" | "study" | "compare" | "route" | "prepare" | "check";

const STYLE = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:17px/1.65 "Nirmala UI","Noto Sans Tamil","Latha",system-ui,sans-serif}main{max-width:720px;margin:auto;padding:16px}h1{font-size:1.55rem;line-height:1.35}h2{font-size:1.2rem;line-height:1.4}p{margin:.7rem 0 1rem}.card{background:#fff;border:1px solid #d8dde6;border-radius:12px;padding:1.1rem;margin:1rem 0}.actions{display:flex;flex-wrap:wrap;gap:.65rem;margin:1.3rem 0}a,button{color:#174ea6}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #174ea6;outline-offset:3px}.action,button{display:inline-block;border:1px solid #174ea6;border-radius:8px;padding:.75rem 1rem;background:#fff;font:inherit;text-decoration:none;cursor:pointer}.primary{background:#174ea6;color:#fff}.notice{font-size:.9rem;color:#46536a}.review{border-left:4px solid #a96800;padding:.5rem .8rem;background:#fff6e7}input[type=number]{display:block;width:100%;max-width:14rem;font:inherit;padding:.7rem;margin:.5rem 0 1rem}fieldset{border:0;padding:0;margin:0}label{display:block;margin:.85rem 0}label:has(input[type=radio]){padding:.7rem;border:1px solid #d8dde6;border-radius:8px}input[type=radio]{margin-right:.7rem}details{margin:1rem 0}summary{cursor:pointer}ul,ol{padding-left:1.4rem}li{margin:.5rem 0}@media(min-width:700px){main{padding:28px}}`;

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

const QUESTIONS: Readonly<Record<JourneyField, { title: string; why: string; choices?: readonly [string, string][] }>> = {
  year: { title: "எந்த ஆண்டு சேர்க்கையைப் பற்றி கேட்கிறீர்கள்?", why: "இங்கு உறுதிசெய்யப்பட்ட விதிகள் TNEA 2026-க்கானவை.", choices: [["2026", "2026"], ["other", "வேறு ஆண்டு"]] },
  stream: { title: "நீங்கள் 12 ஆம் வகுப்பு பொதுக் கல்விப் பிரிவில் (HSC academic) படித்தீர்களா?", why: "இந்தப் பாதை அந்தப் பிரிவுக்கான விதியை மட்டுமே பயன்படுத்துகிறது.", choices: [["academic", "ஆம்"], ["other", "இல்லை / வேறு வழி"]] },
  improvement: { title: "மேம்பாட்டுத் தேர்வில் பெற்ற மதிப்பெண்களைப் பயன்படுத்துகிறீர்களா?", why: "எந்த மதிப்பெண்களை விதி பயன்படுத்த வேண்டும் என்பதை அறிய இது தேவை.", choices: [["yes", "ஆம்"], ["no", "இல்லை"]] },
  improvement_year: { title: "மேம்பாட்டுத் தேர்வு மதிப்பெண்கள் எந்த ஆண்டில் பெறப்பட்டன?", why: "2006 முதல் பெற்ற மேம்பாட்டு மதிப்பெண்களுக்கு தனி விதி உள்ளது." },
  maths: { title: "கணித மதிப்பெண் எவ்வளவு (100-க்கு)?", why: "கட்-ஆஃப் கணக்கில் கணிதம் பயன்படுகிறது." },
  physics: { title: "இயற்பியல் மதிப்பெண் எவ்வளவு (100-க்கு)?", why: "கட்-ஆஃப் கணக்கில் இயற்பியல் பயன்படுகிறது." },
  chemistry: { title: "வேதியியல் மதிப்பெண் எவ்வளவு (100-க்கு)?", why: "கட்-ஆஃப் கணக்கில் வேதியியல் பயன்படுகிறது." },
};

function link(href: string, label: string, primary = false): string {
  return `<a class="action${primary ? " primary" : ""}" href="${href}">${label}</a>`;
}

function journeyNav(page: "awareness" | "study" | "compare" | "route" | "prepare" | "check", label: string, state: JourneyState, primary = false): string {
  if (Object.values(state).every((value) => value === null)) return link(`/journey?step=${page}`, label, primary);
  return `<form action="/journey" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><button class="${primary ? "primary" : ""}" name="navigate" value="${page}" type="submit">${label}</button></form>`;
}

export function renderM2Journey(
  page: JourneyPage,
  pack: AwarenessPack,
  reviewedBatch: string,
  reviewedAwareness: string,
  dependencies: GuidanceDependencies,
  state: JourneyState = EMPTY_JOURNEY,
  error?: string,
): string {
  const item = (id: string) => {
    const found = pack.items.find((candidate) => candidate.id === id);
    if (!found) throw new Error(`Approved awareness unit ${id} is missing`);
    return found;
  };
  const approved = (id: string) => {
    const found = item(id);
    return `<section class="card" data-content-id="${id}"><h2>${escape(found.presentations.ta.title)}</h2>${contentMarkup(found.presentations.ta.body)}</section>`;
  };
  const official = item("AW-03").sources.find((source) => source.source_id === "SRC002");
  if (!official) throw new Error("TNEA source is missing");
  const a = (unit: "A01" | "A04" | "A05" | "A06", question: string) =>
    contentMarkup(reviewedAwarenessTamilQuestion(reviewedAwareness, unit, question));
  const draftNotice = `<p class="review">A01–A07 V2 கருத்து மதிப்பாய்வு செய்யப்பட்டது. இந்தத் தமிழ் வரைவு தன்னார்வ மொழிச் சரிபார்ப்பும் இறுதி உண்மைத் தகவல் ஒப்புதலும் பெறவில்லை. கீழுள்ள பாட எடுத்துக்காட்டுகள் குறிப்பிட்ட பாடத்திட்டத்துக்கானவை; எல்லா கல்லூரிகளுக்கும் ஒரே மாதிரி அல்ல.</p>`;
  const fieldEvidence = `<details><summary>பாட எடுத்துக்காட்டுகளின் மூலம் மற்றும் வரம்பு</summary><p>எடுத்துக்காட்டுகள் Anna University-யின் 2026–27 தொகுப்புக்கான R2025 Revised 1 இணைப்புக் கல்லூரி பாடத்திட்டங்களிலிருந்து; தன்னாட்சிக் கல்லூரி அல்லது வேறு regulation மாறலாம். நீங்கள் பார்க்கும் கல்லூரியின் சரியான பாடத்திட்டத்தைச் சரிபார்க்கவும். <a href="https://cac.annauniv.edu/aidetails/revision_ai_ug_cands_2025ft.html">அதிகாரப்பூர்வ பாடத்திட்டப் பட்டியல்</a>.</p></details>`;
  let body = "";
  if (page === "awareness") {
    body = `<h1>பொறியியல் பற்றி இங்கே தொடங்கலாம்</h1><p>மதிப்பெண்களோ கல்லூரித் தேர்வோ இப்போது தேவையில்லை.</p>${approved("AW-01")}<section class="card" data-content-id="A01"><h2>பொறியியல் படிப்பும் பணியும்</h2>${a("A01", "Q026")}${a("A01", "Q028")}</section><section class="card" data-content-id="A04"><h2>பல துறைகள் உள்ளன</h2>${a("A04", "Q036")}</section>${draftNotice}<nav class="actions">${journeyNav("study", "என்ன படிப்பேன்?", state, true)}${journeyNav("compare", "துறைகள் எப்படி வேறுபடுகின்றன?", state)}${journeyNav("route", "TNEA சேர்க்கை வழியைப் புரிந்துகொள்ள", state)}${journeyNav("check", "என் நிலையை நேரடியாகச் சரிபார்க்க", state)}</nav>`;
  } else if (page === "study") {
    body = `<h1>பொறியியலில் என்ன படிப்பேன்?</h1><p>துறைகளில் பாடங்களும் செய்முறைப் பணிகளும் மாறும். ஆர்வமான பகுதியை மட்டும் திறந்து பாருங்கள்; இப்போது ஒரு பிரிவைத் தேர்ந்தெடுக்க வேண்டியதில்லை.</p>${a("A01", "Q035")}<section class="card" data-content-id="A04"><h2>சில துறைகளின் பாட எடுத்துக்காட்டுகள்</h2><details><summary>கணினி, IT, AI/Data</summary>${a("A04", "Q037")}${a("A04", "Q038")}${a("A04", "Q043")}</details><details><summary>மின்னணு மற்றும் தகவல் தொடர்பு — ECE</summary>${a("A04", "Q039")}</details><details><summary>மின்சக்தி மற்றும் மின் இயந்திரங்கள் — EEE</summary>${a("A04", "Q040")}</details><details><summary>இயந்திர வடிவமைப்பு / உற்பத்தி — Mechanical</summary>${a("A04", "Q041")}</details><details><summary>கட்டிடம் / அடிப்படை வசதிகள் — Civil</summary>${a("A04", "Q042")}</details>${a("A04", "Q044")}</section>${fieldEvidence}${draftNotice}<nav class="actions">${journeyNav("compare", "துறைகள் எப்படி வேறுபடுகின்றன?", state, true)}${journeyNav("route", "TNEA சேர்க்கை வழியைப் புரிந்துகொள்ள", state)}${journeyNav("awareness", "அறிமுகத்திற்குத் திரும்ப", state)}</nav>`;
  } else if (page === "compare") {
    body = `<h1>துறைகள் எப்படி வேறுபடுகின்றன?</h1><p>ஒரு துறையின் பெயர் மட்டும் போதாது. தொடர்ந்து செய்ய விரும்பும் செயலையும் பாடங்களையும் ஒப்பிட்டுப் பாருங்கள்; இது உங்களுக்கான திறன் தீர்ப்பு அல்ல.</p><section class="card" data-content-id="A06"><h2>எந்த வேலைப் பக்கம் உங்களை ஈர்க்கிறது?</h2>${a("A06", "Q047")}</section><section class="card" data-content-id="A04"><h2>பாடங்களையும் செய்முறையையும் ஒப்பிடுங்கள்</h2>${a("A04", "Q036")}<p>ஒரு துறையில் ஆர்வம் வந்தால் அதன் பாடம், ஆய்வகம், திட்டப்பணி ஆகியவற்றை அடுத்த பக்கத்தில் பாருங்கள்.</p></section><details class="card" data-content-id="A05"><summary>CSE, IT, AI & DS, AI & ML — மேலும் ஒப்பிட</summary>${a("A05", "Q049")}</details>${fieldEvidence}${draftNotice}<nav class="actions">${journeyNav("study", "என்ன படிப்பேன்?", state, true)}${journeyNav("route", "TNEA சேர்க்கை வழியைப் புரிந்துகொள்ள", state)}${journeyNav("awareness", "அறிமுகத்திற்குத் திரும்ப", state)}</nav>`;
  } else if (page === "route") {
    body = `<h1>முதல் ஆண்டு TNEA வழி</h1>${approved("AW-03")}${approved("AW-05")}<details class="card"><summary>மதிப்பாய்வு செய்யப்பட்ட கூடுதல் விளக்கம் (B01, B04)</summary><p class="review">இந்தத் தமிழ் வரைவு தன்னார்வ மொழி மதிப்பாய்வு பெறவில்லை.</p>${contentMarkup(reviewedTamilUnit(reviewedBatch, "B01"))}${contentMarkup(reviewedTamilUnit(reviewedBatch, "B04"))}</details><nav class="actions">${journeyNav("prepare", "எதைத் தயார்செய்ய வேண்டும்?", state, true)}${journeyNav("study", "பொறியியல் துறைகளை மேலும் ஆராய", state)}${journeyNav("check", "விருப்பப்பட்டால் என் நிலையைச் சரிபார்க்க", state)}</nav>`;
  } else if (page === "prepare") {
    body = `<h1>விண்ணப்பத்திற்கு முன் தயாராகலாம்</h1><p>ஆவணங்களை இங்கே பதிவேற்ற வேண்டாம். உங்கள் சேர்க்கை ஆண்டுக்கான அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்.</p><section class="card" data-content-id="B05"><h2>2026 ஆவண வழிகாட்டல் — மதிப்பாய்வு வரைவு</h2>${contentMarkup(reviewedTamilUnit(reviewedBatch, "B05"))}</section><nav class="actions">${journeyNav("check", "விருப்பப்பட்டால் என் நிலையைச் சரிபார்க்க", state, true)}${journeyNav("route", "TNEA வழிக்குத் திரும்ப", state)}</nav>`;
  } else {
    const question = nextJourneyQuestion(state);
    if (question !== null) {
      const spec = QUESTIONS[question];
      const originalMarks = state.improvement === true && typeof state.improvement_year === "number" && state.improvement_year >= 2006;
      const title = originalMarks && ["maths", "physics", "chemistry"].includes(question)
        ? `மேம்பாட்டுத் தேர்வுக்கு முன் பெற்ற அசல் ${spec.title}` : spec.title;
      const markInput = `<label for="answer">${title}</label><input id="answer" name="answer" type="number" inputmode="numeric" min="${question === "improvement_year" ? "1900" : "0"}" max="${question === "improvement_year" ? "2026" : "100"}" required>`;
      const options = spec.choices
        ? `<fieldset><legend>${title}</legend>${spec.choices.map(([value, label]) => `<label><input type="radio" name="answer" value="${value}" required>${label}</label>`).join("")}</fieldset>`
        : markInput;
      const context = [state.year === 2026 ? "ஆண்டு: 2026" : "", typeof state.maths === "number" ? "கணித மதிப்பெண் சேர்க்கப்பட்டது" : "", typeof state.physics === "number" ? "இயற்பியல் மதிப்பெண் சேர்க்கப்பட்டது" : ""].filter(Boolean).join(" · ");
      body = `<h1>விருப்பத் தனிப்பட்ட சரிபார்ப்பு</h1><p>ஒரே நேரத்தில் தேவையான ஒரு கேள்வி மட்டும். தெரியாததைத் தெரியாது என்றே வைத்துக்கொள்ளலாம்.</p>${context ? `<p class="notice">${context}</p>` : ""}${error ? `<p role="alert">${escape(error)}</p>` : ""}<form class="card" action="/journey" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><p>${originalMarks ? "2006-க்குப் பிறகு பெற்ற மேம்பாட்டு மதிப்பெண் பயன்படுத்தப்படாது; சான்றிலுள்ள அசல் மதிப்பெண்ணை அளிக்கவும்." : spec.why}</p>${options}<div class="actions"><button class="primary" type="submit">தொடர்க</button><button type="submit" name="unknown" value="1" formnovalidate>எனக்குத் தெரியாது</button></div></form>${journeyNav("route", "வழி விளக்கத்திற்குத் திரும்ப", state)}`;
    } else {
      const result = journeyGuidanceResult(state, dependencies);
      const unknown = state.year === "unknown" || state.stream === "unknown" || state.improvement === "unknown" || state.improvement_year === "unknown" || [state.maths, state.physics, state.chemistry].includes("unknown");
      const cutoff = result?.eligibility.cutoff;
      const score = cutoff === null || cutoff === undefined
        ? `<p><strong>${unknown ? "தகவல் இன்னும் தெரியவில்லை" : "இந்தப் பாதையில் கணக்கிட முடியவில்லை"}.</strong> கட்-ஆஃப் மதிப்பெண்ணை ஊகிக்க முடியாது.</p>`
        : `<p><strong>சரிபார்க்கப்பட்ட 2026 கல்விப் பிரிவு கட்-ஆஃப்: ${cutoff} / 200.</strong></p>`;
      const status = result
        ? `<p data-status="${result.eligibility.outcome}">முழு தகுதி நிலை: <strong>${result.eligibility.outcome === "NEEDS_REVIEW" ? "மேலும் சரிபார்ப்பு தேவை" : result.eligibility.outcome === "ELIGIBLE" ? "விதிகளின்படி தகுதி உள்ளது" : "விதிகளின்படி தகுதி இல்லை"}</strong>. இது கல்லூரி இடம் அல்லது தரவரிசை உறுதி அல்ல.</p>`
        : `<p data-status="UNKNOWN">இந்த சேர்க்கை ஆண்டு அல்லது படிப்பு வழிக்கான தனிப்பட்ட முடிவு இங்கு <strong>இன்னும் தெரியவில்லை</strong>.</p>`;
      const next = state.year !== 2026 ? "உங்கள் ஆண்டுக்கான அதிகாரப்பூர்வ சேர்க்கை அறிவிப்பைப் பாருங்கள். 2026 விதியை அடுத்த ஆண்டுக்கு மாற்றிப் பயன்படுத்தாதீர்கள்."
        : state.stream !== "academic" ? "உங்கள் படிப்பு வழிக்கான அதிகாரப்பூர்வ தகுதி விதியைச் சரிபார்க்கவும். டிப்ளமோ என்றால் நேரடி இரண்டாம் ஆண்டு வழியைப் பாருங்கள்."
        : cutoff === null || cutoff === undefined ? "தெரியாத விவரத்தைப் பதிவு செய்து, மதிப்பெண் சான்றைப் பார்த்துப் பிறகு தொடருங்கள்; தேவைப்பட்டால் அதிகாரப்பூர்வ TNEA உதவி மையத்தில் கேளுங்கள்."
        : "மற்ற தகுதி விவரங்களை அதிகாரப்பூர்வ விதிகளுடன் சரிபார்க்கவும்; வெளியிடப்படும் தரவரிசை மற்றும் இடங்களை தனியாகப் பார்க்கவும்.";
      const retry = unknown ? `<form action="/journey" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><button name="retry" value="1" type="submit">தெரியாத பதிலை இப்போது அளிக்க</button></form>` : "";
      body = `<h1>உங்கள் அடுத்த தெளிவான படி</h1><section class="card">${score}${status}<p><strong>அடுத்து:</strong> ${next}</p>${result ? `<details><summary>ஏன்? ஆதாரம்</summary><p>இந்த 2026 கணக்கீடும் சரிபார்ப்பு நிலையும் திட்டத்தின் சரிபார்க்கப்பட்ட விதிகளிலிருந்து வருகின்றன. ஆதாரம்: <a href="${escape(official.url)}">${escape(official.name)}</a>, பக்கம் 9 (கட்-ஆஃப்), பக்கம் 3 (மேம்பாட்டுத் தேர்வு).</p></details>` : ""}</section>${retry}<nav class="actions">${journeyNav("prepare", "தயாரிப்பு வழிகாட்டலைப் பார்க்க", state)}${link("/journey?step=check", "புதிய சரிபார்ப்பைத் தொடங்க")}</nav>`;
    }
  }
  const sources = page === "awareness" || page === "study" || page === "compare" ? item("AW-01").sources : [official];
  const reviewState = page === "awareness" || page === "study" || page === "compare"
    ? "M1 அறிமுகத் தமிழ் ஏற்கப்பட்டுள்ளது; A01–A07 V2 தமிழ் வரைவு தன்னார்வ மொழி மற்றும் இறுதி உண்மைத் தகவல் மதிப்பாய்வுக்காகக் காத்திருக்கிறது."
    : "B01–B08 தமிழ் வரைவு தன்னார்வ மொழிச் சரிபார்ப்புக்காகக் காத்திருக்கிறது.";
  const source = `<p class="notice">மூலம்: ${sources.map((entry) => `<a href="${escape(entry.url)}">${escape(entry.name)}</a>`).join(" · ")}. ${reviewState} 2026 தகவலை வேறு ஆண்டுக்கான அறிவிப்பாகவோ சேர்க்கை உறுதியாகவோ கருதாதீர்கள்.</p>`;
  return `<!doctype html><html lang="ta"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TN Engineering Guidance — வழிகாட்டல்</title><style>${STYLE}</style></head><body><main>${body}${source}<p>${link("/", "முதற்பக்கத்திற்குத் திரும்ப")}</p></main></body></html>`;
}

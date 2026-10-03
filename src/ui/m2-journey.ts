import type { GuidanceDependencies } from "../application/guidance.ts";
import type { AwarenessPack } from "../student-semantics/awareness.ts";
import { contentMarkup } from "./student-entry.ts";
import {
  EMPTY_JOURNEY, journeyGuidanceResult, nextJourneyQuestion,
  type JourneyField, type JourneyState,
} from "../m2/journey.ts";

export type JourneyPage = "awareness" | "route" | "prepare" | "check";

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

export function renderM2Journey(
  page: JourneyPage,
  pack: AwarenessPack,
  reviewedBatch: string,
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
  let body = "";
  if (page === "awareness") {
    body = `<h1>பொறியியல் பற்றி இங்கே தொடங்கலாம்</h1><p>மதிப்பெண்கள் இப்போது தேவையில்லை. முதலில் வழியைப் புரிந்துகொள்ளலாம்.</p>${approved("AW-01")}<nav class="actions">${link("/journey?step=route", "பொறியியலில் எப்படி சேரலாம்?", true)}${link("/journey?step=check", "என் நிலையை நேரடியாகச் சரிபார்க்க", false)}</nav>`;
  } else if (page === "route") {
    body = `<h1>முதல் ஆண்டு TNEA வழி</h1>${approved("AW-03")}${approved("AW-05")}<details class="card"><summary>மதிப்பாய்வு செய்யப்பட்ட கூடுதல் விளக்கம் (B01, B04)</summary><p class="review">இந்தத் தமிழ் வரைவு தன்னார்வ மொழி மதிப்பாய்வு பெறவில்லை.</p>${contentMarkup(reviewedTamilUnit(reviewedBatch, "B01"))}${contentMarkup(reviewedTamilUnit(reviewedBatch, "B04"))}</details><nav class="actions">${link("/journey?step=prepare", "எதைத் தயார்செய்ய வேண்டும்?", true)}${link("/journey?step=check", "விருப்பப்பட்டால் என் நிலையைச் சரிபார்க்க")}</nav>`;
  } else if (page === "prepare") {
    body = `<h1>விண்ணப்பத்திற்கு முன் தயாராகலாம்</h1><p>ஆவணங்களை இங்கே பதிவேற்ற வேண்டாம். உங்கள் சேர்க்கை ஆண்டுக்கான அதிகாரப்பூர்வ அறிவிப்பைப் பாருங்கள்.</p><section class="card" data-content-id="B05"><h2>2026 ஆவண வழிகாட்டல் — மதிப்பாய்வு வரைவு</h2>${contentMarkup(reviewedTamilUnit(reviewedBatch, "B05"))}</section><nav class="actions">${link("/journey?step=check", "விருப்பப்பட்டால் என் நிலையைச் சரிபார்க்க", true)}${link("/journey?step=route", "TNEA வழிக்குத் திரும்ப")}</nav>`;
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
      body = `<h1>விருப்பத் தனிப்பட்ட சரிபார்ப்பு</h1><p>ஒரே நேரத்தில் தேவையான ஒரு கேள்வி மட்டும். தெரியாததைத் தெரியாது என்றே வைத்துக்கொள்ளலாம்.</p>${context ? `<p class="notice">${context}</p>` : ""}${error ? `<p role="alert">${escape(error)}</p>` : ""}<form class="card" action="/journey" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><p>${originalMarks ? "2006-க்குப் பிறகு பெற்ற மேம்பாட்டு மதிப்பெண் பயன்படுத்தப்படாது; சான்றிலுள்ள அசல் மதிப்பெண்ணை அளிக்கவும்." : spec.why}</p>${options}<div class="actions"><button class="primary" type="submit">தொடர்க</button><button type="submit" name="unknown" value="1" formnovalidate>எனக்குத் தெரியாது</button></div></form>${link("/journey?step=route", "வழி விளக்கத்திற்குத் திரும்ப")}`;
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
      body = `<h1>உங்கள் அடுத்த தெளிவான படி</h1><section class="card">${score}${status}<p><strong>அடுத்து:</strong> ${next}</p>${result ? `<details><summary>ஏன்? ஆதாரம்</summary><p>இந்த 2026 கணக்கீடும் சரிபார்ப்பு நிலையும் திட்டத்தின் சரிபார்க்கப்பட்ட விதிகளிலிருந்து வருகின்றன. ஆதாரம்: <a href="${escape(official.url)}">${escape(official.name)}</a>, பக்கம் 9 (கட்-ஆஃப்), பக்கம் 3 (மேம்பாட்டுத் தேர்வு).</p></details>` : ""}</section>${retry}<nav class="actions">${link("/journey?step=prepare", "தயாரிப்பு வழிகாட்டலைப் பார்க்க")}${link("/journey?step=check", "புதிய சரிபார்ப்பைத் தொடங்க")}</nav>`;
    }
  }
  const sources = page === "awareness" ? item("AW-01").sources : [official];
  const source = `<p class="notice">மூலம்: ${sources.map((entry) => `<a href="${escape(entry.url)}">${escape(entry.name)}</a>`).join(" · ")}. M1 அறிமுகத் தமிழ் ஏற்கப்பட்டுள்ளது; B01–B08 தமிழ் வரைவு தன்னார்வ மொழிச் சரிபார்ப்புக்காகக் காத்திருக்கிறது. 2026 தகவலை வேறு ஆண்டுக்கான அறிவிப்பாகவோ சேர்க்கை உறுதியாகவோ கருதாதீர்கள்.</p>`;
  return `<!doctype html><html lang="ta"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TN Engineering Guidance — வழிகாட்டல்</title><style>${STYLE}</style></head><body><main>${body}${source}<p>${link("/", "முதற்பக்கத்திற்குத் திரும்ப")}</p></main></body></html>`;
}

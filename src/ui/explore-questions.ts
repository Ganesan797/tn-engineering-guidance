import { contentMarkup } from "./student-entry.ts";

export interface PreparedQuestion { id: string; wording: string; unit: string }
export interface PreparedUnit { id: string; tamil: string; english: string; why: string; next: string; limits: string }
export interface QuestionCollection {
  questions: readonly PreparedQuestion[];
  units: ReadonlyMap<string, PreparedUnit>;
  awarenessEvidence: string;
  admissionEvidence: string;
}

const TOPICS = [
  ["A01", "பொறியியல்: எங்கே தொடங்குவது?", "awareness"],
  ["A02", "ஆர்வம், கணிதம், கற்றல்", "study"],
  ["A03", "பொறியியலும் மற்ற படிப்பு வழிகளும்", "awareness"],
  ["A04", "பாடப்பிரிவுகளில் என்ன படிப்பேன்?", "study"],
  ["A05", "கணினி சார்ந்த பிரிவுகளை ஒப்பிடலாம்", "compare"],
  ["A06", "பிரிவைத் தேர்ந்தெடுக்க என்ன பார்க்கலாம்?", "compare"],
  ["A07", "வேலைப் பாதைகளும் மாற்றங்களும்", "study"],
  ["B01", "பொறியியல் சேர்க்கை வழிகள்", "route"],
  ["B02", "நிர்வாக ஒதுக்கீடு", "route"],
  ["B03", "டிப்ளமோவுக்குப் பிறகு இரண்டாம் ஆண்டு சேர்க்கை", "route"],
  ["B04", "TNEA விண்ணப்பம் முதல் சேர்க்கை வரை", "route"],
  ["B05", "என்ன தகவல்களும் ஆவணங்களும் தேவை?", "prepare"],
  ["B06", "தகுதி, பாடங்கள், பள்ளி வாரியம்", "route"],
  ["B07", "பூர்வீகம் மற்றும் தனிப்பட்ட சந்தேகங்கள்", "prepare"],
  ["B08", "கட்-ஆஃப், சதவீதம், தரவரிசை", "route"],
] as const;

const normalize = (text: string) => text.replaceAll("\r\n", "\n");
const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
// Preserve the saved HTTPS next-action links after escaping all source text.
const reviewedMarkup = (text: string) => contentMarkup(text).replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');

// Load wording and answers from the saved documents; no generated answer catalogue.
export function loadQuestionCollection(awareness: string, admission: string, admissionCoverage: string, awarenessEvidence: string, admissionEvidence: string): QuestionCollection {
  const a = normalize(awareness);
  const b = normalize(admission);
  const questions: PreparedQuestion[] = [];
  const inventory = a.split("## Exact working-corpus question inventory\n")[1]?.split("\n## A01")[0];
  if (!inventory) throw new Error("Exact awareness question inventory is missing");
  for (const line of inventory.split("\n")) {
    const unit = /^\| (A\d{2}) \|/.exec(line)?.[1];
    if (unit) for (const match of line.matchAll(/(Q\d{3}) “([^”]+)”/g)) questions.push({ id: match[1], wording: match[2], unit });
  }
  for (const line of normalize(admissionCoverage).split("\n")) {
    if (!/^\| Q\d{3} \|/.test(line)) continue;
    const cells = line.split("|").map((cell) => cell.trim());
    const unit = /B\d{2}/.exec(cells[4])?.[0];
    if (!unit) throw new Error("Admission question has no reviewed unit");
    questions.push({ id: cells[1], wording: cells[3], unit });
  }
  if (questions.length !== 70 || new Set(questions.map((q) => q.id)).size !== 70) throw new Error("Expected 70 unique prepared questions");
  const preparedIds = new Set([1, 2, 7, 10, 11, 12, 21, ...Array.from({ length: 63 }, (_, i) => i + 25)].map((n) => `Q${String(n).padStart(3, "0")}`));
  if (questions.some((q) => !preparedIds.has(q.id))) throw new Error("Question is outside the authorized prepared collection");
  const units = new Map<string, PreparedUnit>();
  for (const [id] of TOPICS) {
    const document = id.startsWith("A") ? a : b;
    const section = document.split(new RegExp(`^## ${id} —[^\n]*\n`, "m"))[1]?.split(/^## /m)[0];
    if (!section) throw new Error(`Missing guidance ${id}`);
    const isA = id.startsWith("A");
    const english = section.split(isA ? "### English\n" : "### English answer\n")[1]?.split(isA ? "### Tamil draft\n" : "**Tamil draft**")[0]?.trim();
    const tail = section.split(isA ? "### Tamil draft\n" : "**Tamil draft**")[1];
    const tamil = tail?.split(/\n\*\*(?:Useful next direction|Unknown\/conditional|Explain why|Next action|Evidence and limits):/)[0]?.trim();
    const next = section.split(isA ? "**Useful next direction:**" : "**Next action:**")[1]?.split(/\n\*\*/)[0]?.trim();
    const limits = section.split(isA ? "**Unknown/conditional:**" : "**Evidence and limits:**")[1]?.trim();
    const why = section.split("**Explain why:**")[1]?.split(/\n\*\*/)[0]?.trim() ?? "";
    if (!english || !tamil || !next || !limits) throw new Error(`Incomplete reviewed guidance ${id}`);
    units.set(id, { id, english, tamil, why, next, limits });
  }
  for (const q of questions) if (!units.has(q.unit)) throw new Error(`Unknown guidance for ${q.id}`);
  return { questions, units, awarenessEvidence, admissionEvidence };
}

const CSS = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:17px/1.65 "Nirmala UI","Noto Sans Tamil",system-ui,sans-serif}main{max-width:740px;margin:auto;padding:16px;overflow-wrap:anywhere}h1{font-size:1.5rem}h2{font-size:1.15rem}a{color:#174ea6}a:focus-visible,summary:focus-visible{outline:3px solid #174ea6;outline-offset:3px}.card{background:white;border:1px solid #d8dde6;border-radius:10px;padding:16px;margin:16px 0}.question{display:block;padding:12px 0}.actions{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}.actions a{padding:10px;border:1px solid #174ea6;border-radius:7px}summary{cursor:pointer;padding:10px 0}pre{white-space:pre-wrap;font:inherit;overflow-wrap:anywhere}.notice{border-left:4px solid #a96800;padding:10px;background:#fff6e7}ul,ol{padding-left:1.3rem}`;
const questionLink = (q: PreparedQuestion) => `<a class="question" href="/journey/questions?id=${q.id}"><strong>${q.id}</strong> — ${escape(q.wording)}</a>`;

export function renderQuestionCollection(collection: QuestionCollection, id: string | null = null, evidence: string | null = null): { status: number; html: string } {
  const notice = `<p class="notice">பதில்களின் கருத்து வளர்ச்சி உரிமையாளரால் ஏற்கப்பட்டது. இறுதி உண்மைத் தகவல் ஒப்புதல், தன்னார்வத் தமிழ் மதிப்பாய்வு, மாணவர் பயன்பாட்டுச் சோதனை இன்னும் முடியவில்லை. சேர்க்கைத் தகவல்கள் 2026-க்கானவை; அடுத்த ஆண்டுக்கும் பொருந்தும் என்று கருதாதீர்கள்.</p>`;
  const shell = (body: string) => `<!doctype html><html lang="ta"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>கேள்விகளை ஆராயலாம் — TN Engineering Guidance</title><style>${CSS}</style></head><body><main><nav class="actions"><a href="/journey">குறுகிய வழிகாட்டலுக்குத் திரும்ப</a><a href="/journey/questions">எல்லா தயாரான கேள்விகளும்</a></nav>${notice}${body}</main></body></html>`;
  if (evidence !== null) {
    if (evidence !== "awareness" && evidence !== "admission") return { status: 404, html: shell("<h1>ஆதாரம் கிடைக்கவில்லை</h1>") };
    const note = evidence === "awareness" ? collection.awarenessEvidence : collection.admissionEvidence;
    return { status: 200, html: shell(`<h1>பதில்களின் ஆதாரங்களும் வரம்புகளும்</h1><p>சேமிக்கப்பட்ட ஆதாரக் குறிப்பு — அசல் உரை:</p><pre>${escape(note)}</pre>`) };
  }
  if (id === null) return { status: 200, html: shell(`<h1>கேள்விகளை ஆராயலாம்</h1><p>விருப்பப்பட்ட தலைப்பை மட்டும் திறக்கலாம். இந்த 70 தயாரான கேள்விகளையும் படிக்க வேண்டிய கட்டாயம் இல்லை; மதிப்பெண்கள் தேவையில்லை. கேள்விகளின் அசல் சொற்கள் கீழே உள்ளன; பதிலில் தமிழ் வரைவும் ஆங்கிலமும் கிடைக்கும்.</p>${TOPICS.map(([unit, title]) => `<details class="card" id="${unit}"><summary>${title}</summary>${collection.questions.filter((q) => q.unit === unit).map(questionLink).join("")}</details>`).join("")}`) };
  const question = collection.questions.find((q) => q.id === id);
  if (!question) return { status: 404, html: shell("<h1>இந்தக் கேள்விக்கு இங்கு தயாரான பதில் இல்லை</h1>") };
  const unit = collection.units.get(question.unit)!;
  const topic = TOPICS.find(([key]) => key === question.unit)!;
  const related = collection.questions.filter((q) => q.unit === question.unit && q.id !== id);
  const routeExtras = question.unit === "B01" ? `<p>மற்ற சேர்க்கை வழிகளையும் பார்க்க: <a href="/journey/questions?id=Q059">Q059 — நிர்வாக ஒதுக்கீடு</a>; <a href="/journey/questions?id=Q060">Q060 — நேரடி இரண்டாம் ஆண்டு சேர்க்கை</a>.</p>` : question.id === "Q070" ? `<p><a href="/journey/questions?id=Q086">B08 — கட்-ஆஃப் மற்றும் தரவரிசை விளக்கம்</a></p>` : question.id === "Q081" ? `<p><a href="/journey/questions?id=Q060">B03 — டிப்ளமோ வழி</a>; <a href="/journey/questions?id=Q002">B08 — கட்-ஆஃப் விளக்கம்</a></p>` : "";
  const lateral = question.unit === "B03" ? `<p class="notice">இது நேரடி இரண்டாம் ஆண்டு வழிக்கான விளக்கம். தளத்தின் முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு இந்த வழியின் தகுதியைக் கணக்கிடாது.</p>` : "";
  return { status: 200, html: shell(`<h1>${question.id} — ${escape(question.wording)}</h1><p>${escape(topic[1])} · ${unit.id}. தொடர்புடைய கேள்விகள் ஒரே மதிப்பாய்வு செய்யப்பட்ட விளக்கத்தைப் பகிர்கின்றன.</p>${lateral}<section class="card" data-guidance-unit="${unit.id}"><h2>தமிழ் வரைவு</h2>${reviewedMarkup(unit.tamil)}<details><summary>English — reviewed answer</summary>${reviewedMarkup(unit.english)}</details></section><section class="card"><h2>அடுத்த செயல் / Next action</h2>${reviewedMarkup(unit.next)}${unit.why ? `<details><summary>Explain why — saved guidance</summary>${reviewedMarkup(unit.why)}</details>` : ""}${routeExtras}<p><strong>வரம்புகள் / Limits:</strong></p>${reviewedMarkup(unit.limits)}<a href="/journey/questions?evidence=${unit.id.startsWith("A") ? "awareness" : "admission"}">முழு ஆதாரக் குறிப்பைப் பார்க்க</a></section><nav class="actions"><a href="/journey?step=${topic[2]}">தொடர்புடைய வழிகாட்டல் படிக்குத் திரும்ப</a><a href="/journey/questions#${unit.id}">இந்தத் தலைப்பில் மேலும் ஆராய</a></nav><details><summary>இதே விளக்கத்தில் தொடர்புடைய கேள்விகள்</summary>${related.map(questionLink).join("")}</details>`) };
}

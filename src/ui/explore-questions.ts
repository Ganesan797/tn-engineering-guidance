import { contentMarkup } from "./student-entry.ts";

export interface PreparedQuestion { id: string; wording: string; unit: string }
export interface PreparedUnit { id: string; tamil: string; english: string; why: string; next: string; limits: string }
export type QuestionLanguage = "ta" | "en";
export interface LocalizedAnswer { question: string; answer: string; detail: string; next: string; limit: string; status: "DIRECT" | "PARTIAL"; review?: string }
export interface QuestionAnswer {
  id: string; unit: string; source: string; en: LocalizedAnswer; ta?: LocalizedAnswer;
  nextId: string; related?: string[];
  evidence: { key: string; url: string; location: string; locationTa: string; note: string }[];
}
export interface QuestionCollection {
  questions: readonly PreparedQuestion[];
  units: ReadonlyMap<string, PreparedUnit>;
  awarenessEvidence: string;
  admissionEvidence: string;
  answers: ReadonlyMap<string, QuestionAnswer>;
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
export function loadQuestionCollection(awareness: string, admission: string, admissionCoverage: string, awarenessEvidence: string, admissionEvidence: string, answerJson: string): QuestionCollection {
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
  const entries: QuestionAnswer[] = JSON.parse(answerJson);
  if (!Array.isArray(entries) || entries.length !== 70 || new Set(entries.map((a) => a.id)).size !== 70) throw new Error("Expected 70 question-specific answers");
  const answers = new Map(entries.map((a) => [a.id, a]));
  for (const q of questions) {
    const a = answers.get(q.id);
    if (!a || a.unit !== q.unit || !answers.has(a.nextId)) throw new Error(`Answer mapping mismatch: ${q.id}`);
    for (const lang of ["en", "ta"] as const) {
      const copy = a[lang];
      // Missing Tamil is rendered as an explicit unavailable page, never English fallback.
      if (!copy && lang === "ta") continue;
      if (!copy || [copy.question, copy.answer, copy.next, copy.limit].some((s) => typeof s !== "string" || !s.trim()) || !["DIRECT", "PARTIAL"].includes(copy.status)) throw new Error(`Incomplete ${lang} answer: ${q.id}`);
    }
    if (q.id !== "Q025" && a.en.question !== q.wording) throw new Error(`Question wording mismatch: ${q.id}`);
    if (a.ta && a.ta.review !== "PENDING_VOLUNTEER_EQUIVALENCE") throw new Error(`Unapproved Tamil review state: ${q.id}`);
    if (!a.evidence.length || a.evidence.some((e) => !/^https:\/\//.test(e.url) || !e.location || !e.locationTa)) throw new Error(`Missing evidence: ${q.id}`);
    if (a.related?.some((id) => !answers.has(id))) throw new Error(`Invalid related answer: ${q.id}`);
  }
  return { questions, units, awarenessEvidence, admissionEvidence, answers };
}

const CSS = `*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:17px/1.65 "Nirmala UI","Noto Sans Tamil",system-ui,sans-serif}main{max-width:740px;margin:auto;padding:16px;overflow-wrap:anywhere}h1{font-size:1.5rem}h2{font-size:1.15rem}a{color:#174ea6}a:focus-visible,summary:focus-visible{outline:3px solid #174ea6;outline-offset:3px}.card{background:white;border:1px solid #d8dde6;border-radius:10px;padding:16px;margin:16px 0}.question{display:block;padding:12px 0}.actions{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}.actions a{padding:10px;border:1px solid #174ea6;border-radius:7px}summary{cursor:pointer;padding:10px 0}pre{white-space:pre-wrap;font:inherit;overflow-wrap:anywhere}.notice{border-left:4px solid #a96800;padding:10px;background:#fff6e7}ul,ol{padding-left:1.3rem}`;
const EN_TOPICS = ["Engineering: where to start", "Interests, maths and learning", "Engineering and other study routes", "What would I study?", "Compare computing fields", "Choosing a field", "Careers and changing direction", "Engineering admission routes", "Management quota", "Diploma and second-year entry", "TNEA application to joining", "Information and documents", "Eligibility, subjects and boards", "Nativity and special situations", "Cutoff, percentage and rank"];
const COPY = {
  ta: { title: "கேள்விகளை ஆராயலாம்", home: "குறுகிய தமிழ் வழிகாட்டலுக்குத் திரும்ப", all: "எல்லாத் தலைப்புகளும்", intro: "உங்களுக்கு வேண்டிய தலைப்பை மட்டும் பாருங்கள். எல்லா 70 கேள்விகளையும் படிக்க வேண்டியதில்லை. மதிப்பெண், பிரிவுத் தேர்வு அல்லது கல்லூரிப் பட்டியல் தேவையில்லை.", notice: "இது மதிப்பாய்வுக்கான வரைவு. முந்தைய உள்ளடக்கத்தின் நோக்கம் ஏற்கப்பட்டது; இந்தக் கேள்விவாரி வடிவமும் தமிழ் மொழிபெயர்ப்பும் இன்னும் மதிப்பாய்வில் உள்ளன. இறுதி உண்மைத் தகவல் ஒப்புதல், தன்னார்வத் தமிழ் மதிப்பாய்வு, மாணவர் சோதனை முடியவில்லை. சேர்க்கை விளக்கங்கள் 2026 விதிகளைச் சார்ந்தவை; அடுத்த ஆண்டுக்கும் பொருந்தும் என்று கருதாதீர்கள்.", next: "அடுத்து என்ன செய்யலாம்?", why: "மேலும் புரிந்துகொள்ள", limits: "எது இன்னும் உறுதியாகவில்லை?", evidence: "ஆதாரங்களைப் பார்க்க", source: "ஆதாரம்", related: "தொடர்புள்ள கேள்விகள்", return: "தொடர்புடைய தமிழ் வழிகாட்டல் படிக்குச் செல்ல", more: "இந்தத் தலைப்பில் மேலும் பார்க்க", partial: "பகுதி விளக்கம் — கீழே உள்ள இடைவெளி இன்னும் தீரவில்லை.", missing: "இந்தக் கேள்விக்கான தமிழ் மொழிபெயர்ப்பு இன்னும் தயாராகவில்லை. ஆங்கிலத்தைத் தமிழாகக் காட்டவில்லை; விரும்பினால் மொழியை மாற்றிப் பார்க்கலாம்.", notFound: "இந்தக் கேள்விக்கு இங்கு தயாரான பதில் இல்லை", lateral: "இது நேரடி இரண்டாம் ஆண்டு வழி. முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு இதன் தகுதியை மதிப்பிடாது." },
  en: { title: "Explore questions", home: "Return to the short Tamil journey", all: "All topics", intro: "Explore only what you need. You do not have to read all 70 questions. No marks, branch choice or college list is required.", notice: "Review draft. The earlier content direction was accepted; these question-specific edits and Tamil translations still need review. Final factual approval, volunteer Tamil equivalence and student testing are pending. Admission explanations refer to 2026 rules; do not assume they apply next year.", next: "What can I do next?", why: "Understand a little more", limits: "What remains conditional?", evidence: "View evidence", source: "Source", related: "Related questions", return: "Go to the relevant Tamil journey step", more: "Explore this topic", partial: "Partial answer — the evidence gap below remains unresolved.", missing: "This English answer is not available.", notFound: "No prepared answer is available for this question", lateral: "This is a direct-second-year route. The first-year personal check does not assess lateral-entry eligibility." },
} as const;
export function questionUrl(id: string | null, lang: QuestionLanguage, topic: string | null = null): string {
  const params = new URLSearchParams({ lang });
  if (id) params.set("id", id);
  if (topic) params.set("topic", topic);
  return `/journey/questions?${params}`;
}
export function renderQuestionCollection(collection: QuestionCollection, id: string | null = null, evidence: string | null = null, lang: QuestionLanguage = "ta", selectedTopic: string | null = null): { status: number; html: string } {
  const t = COPY[lang];
  const topic = TOPICS.find(([unit]) => unit === selectedTopic);
  const title = (unit: string) => lang === "ta" ? TOPICS.find(([key]) => key === unit)![1] : EN_TOPICS[TOPICS.findIndex(([key]) => key === unit)];
  const switchUrl = questionUrl(id, lang === "ta" ? "en" : "ta", topic?.[0] ?? null);
  const shell = (body: string) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t.title}</title><style>${CSS}</style></head><body><main><nav class="actions"><a href="/journey">${t.home}</a><a href="${questionUrl(null, lang)}">${t.all}</a><a lang="${lang === "ta" ? "en" : "ta"}" data-language-switch href="${escape(switchUrl)}">${lang === "ta" ? "English" : "தமிழ்"}</a></nav>${body}<aside class="notice">${t.notice}</aside></main></body></html>`;
  const link = (qid: string) => {
    const a = collection.answers.get(qid)!;
    return `<a class="question" href="${escape(questionUrl(qid, lang, a.unit))}"><strong>${a.id}</strong> — ${escape(a[lang]?.question ?? t.missing)}</a>`;
  };
  if (evidence !== null) return { status: 404, html: shell(`<h1>${t.notFound}</h1>`) };
  if (selectedTopic !== null && !topic) return { status: 404, html: shell(`<h1>${t.notFound}</h1>`) };
  if (id === null) return { status: 200, html: shell(`<h1>${topic ? escape(title(topic[0])) : t.title}</h1><p>${t.intro}</p>${topic ? collection.questions.filter((q) => q.unit === topic[0]).map((q) => link(q.id)).join("") : TOPICS.map(([unit]) => `<a class="question card" href="${escape(questionUrl(null, lang, unit))}">${escape(title(unit))}</a>`).join("")}`) };
  const answer = collection.answers.get(id);
  if (!answer) return { status: 404, html: shell(`<h1>${t.notFound}</h1>`) };
  const copy = answer[lang];
  if (!copy || !copy.question || !copy.answer || !copy.next || !copy.limit) return { status: 503, html: shell(`<h1>${escape(id)}</h1><p data-missing-translation>${t.missing}</p>`) };
  const step = TOPICS.find(([unit]) => unit === answer.unit)![2];
  return { status: 200, html: shell(`<h1>${id} — ${escape(copy.question)}</h1><section class="card" data-guidance-unit="${answer.unit}" data-answer-status="${copy.status}"><div data-direct-answer>${reviewedMarkup(copy.answer)}</div>${copy.status === "PARTIAL" ? `<p class="notice">${t.partial}</p>` : ""}${answer.unit === "B03" ? `<p class="notice">${t.lateral}</p>` : ""}${copy.detail ? `<details><summary>${t.why}</summary>${reviewedMarkup(copy.detail)}</details>` : ""}</section><section class="card"><h2>${t.next}</h2>${reviewedMarkup(copy.next)}${link(answer.nextId)}<h2>${t.limits}</h2>${reviewedMarkup(copy.limit)}<details><summary>${t.evidence}</summary>${answer.evidence.map((e) => `<p><a href="${escape(e.url)}" target="_blank" rel="noopener">${t.source} ${escape(e.key)}</a> — ${escape(lang === "ta" ? e.locationTa : e.location)}</p>`).join("")}</details></section>${answer.related?.length ? `<section><h2>${t.related}</h2>${answer.related.map(link).join("")}</section>` : ""}<nav class="actions"><a href="/journey?step=${step}">${t.return}</a><a href="${escape(questionUrl(null, lang, answer.unit))}">${t.more}</a></nav>`) };
}

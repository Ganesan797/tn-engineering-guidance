import { contentMarkup } from "./student-entry.ts";
import { renderSiteHeader, SITE_SHELL_CSS, GOOGLE_FONTS_HTML, SHARED_FONT_FAMILY } from "./site-shell.ts";

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


const TOPIC_METADATA: Record<string, { icon: string; num: string; numTa: string }> = {
  A01: { icon: "🎓", num: "Topic 01", numTa: "பகுதி 01" },
  A02: { icon: "📐", num: "Topic 02", numTa: "பகுதி 02" },
  A03: { icon: "🧭", num: "Topic 03", numTa: "பகுதி 03" },
  A04: { icon: "📚", num: "Topic 04", numTa: "பகுதி 04" },
  A05: { icon: "💻", num: "Topic 05", numTa: "பகுதி 05" },
  A06: { icon: "🎯", num: "Topic 06", numTa: "பகுதி 06" },
  A07: { icon: "🚀", num: "Topic 07", numTa: "பகுதி 07" },
  B01: { icon: "🏛️", num: "Topic 08", numTa: "பகுதி 08" },
  B02: { icon: "🏢", num: "Topic 09", numTa: "பகுதி 09" },
  B03: { icon: "🔧", num: "Topic 10", numTa: "பகுதி 10" },
  B04: { icon: "📋", num: "Topic 11", numTa: "பகுதி 11" },
  B05: { icon: "📑", num: "Topic 12", numTa: "பகுதி 12" },
  B06: { icon: "📝", num: "Topic 13", numTa: "பகுதி 13" },
  B07: { icon: "🏠", num: "Topic 14", numTa: "பகுதி 14" },
  B08: { icon: "⚖️", num: "Topic 15", numTa: "பகுதி 15" },
};
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

const CSS = `${SITE_SHELL_CSS}*{box-sizing:border-box}body{margin:0;background:#f7f8fa;color:#172033;font:16px/1.65 ${SHARED_FONT_FAMILY}}main{max-width:1040px;margin:auto;padding:24px 20px;overflow-wrap:anywhere}h1{font-size:1.75rem;font-weight:800;color:#0f2c59;margin:0 0 .5rem}h2{font-size:1.2rem;font-weight:750;color:#0f172a;margin:0 0 .75rem}a{color:#0f766e;text-decoration:none}a:hover{text-decoration:underline}a:focus-visible,summary:focus-visible{outline:3px solid #0f766e;outline-offset:3px}.card{background:white;border:1.5px solid #e2e8f0;border-radius:14px;padding:1.4rem;margin:1.25rem 0;box-shadow:0 1px 4px rgba(0,0,0,.04)}.question{display:block;padding:12px 0}.actions{display:flex;flex-wrap:wrap;gap:12px;margin:16px 0}.actions a{display:inline-flex;align-items:center;min-height:44px;padding:8px 18px;border:1.5px solid #0f766e;border-radius:8px;text-decoration:none;font-weight:700;font-size:.92rem;transition:all .15s ease}.actions a.primary{background:#0f766e;color:#ffffff;border-color:#0f766e}.actions a.primary:hover{background:#115e59}.actions a.secondary{background:#ffffff;color:#0f766e}.actions a.secondary:hover{background:#f0fdfa}summary{cursor:pointer;padding:8px 0}pre{white-space:pre-wrap;font:inherit;overflow-wrap:anywhere}.notice{border-left:4px solid #0284c7;padding:10px 14px;background:#f0f9ff;border-radius:0 8px 8px 0;font-size:.92rem;color:#0369a1}ul,ol{padding-left:1.3rem}
.qa-hero-header{margin-bottom:1.75rem}.qa-hero-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;background:#f0fdfa;border:1px solid #ccfbf1;border-radius:9999px;font-size:.82rem;font-weight:750;color:#0f766e;margin-bottom:.75rem}.qa-hero-desc{font-size:1.02rem;color:#475569;margin:.25rem 0 0;line-height:1.6;max-width:76ch}
.topic-grid{display:grid;grid-template-columns:1fr;gap:14px;margin:1.5rem 0}@media(min-width:640px){.topic-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(min-width:960px){.topic-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.topic-card{background:#ffffff;border:1.5px solid #e2e8f0;border-radius:14px;padding:1.2rem;display:flex;flex-direction:column;justify-content:space-between;min-height:140px;text-decoration:none!important;box-shadow:0 1px 3px rgba(0,0,0,.03);transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}.topic-card:hover{transform:translateY(-2px);border-color:#0f766e;box-shadow:0 4px 14px rgba(15,118,110,.1)}
.topic-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem}
.topic-num-pill{font-size:.74rem;font-weight:750;letter-spacing:.02em;padding:2px 8px;border-radius:6px;background:#f1f5f9;color:#475569}
.topic-icon-box{width:36px;height:36px;border-radius:10px;background:#f0fdfa;display:flex;align-items:center;justify-content:center;font-size:1.25rem}
.topic-card-title{font-size:1rem;font-weight:750;color:#0f2c59;margin:0 0 .75rem;line-height:1.45;flex:1}
.topic-card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:.6rem;border-top:1px solid #f8fafc}
.topic-count-tag{font-size:.78rem;font-weight:650;color:#0f766e}
.topic-arrow{font-size:1.1rem;font-weight:700;color:#0f766e;transition:transform .15s ease}.topic-card:hover .topic-arrow{transform:translateX(3px)}
.qa-breadcrumb{margin-bottom:1.25rem}.qa-breadcrumb-link{display:inline-flex;align-items:center;gap:6px;font-size:.88rem;font-weight:700;color:#0f766e;text-decoration:none;padding:6px 12px;border-radius:8px;background:#f0fdfa;border:1px solid #ccfbf1}.qa-breadcrumb-link:hover{background:#ccfbf1}
.questions-list{display:flex;flex-direction:column;gap:10px;margin:1.25rem 0}
.question-row-card{display:flex;align-items:center;gap:12px;padding:1rem 1.25rem;background:#ffffff;border:1.5px solid #e2e8f0;border-radius:12px;text-decoration:none!important;color:#0f172a;transition:all .15s ease;min-height:52px}.question-row-card:hover{border-color:#0f766e;background:#f0fdfa;transform:translateX(2px)}
.question-row-icon{font-size:1.2rem;flex-shrink:0}
.question-row-text{flex:1;font-size:.95rem;font-weight:650;color:#0f2c59;line-height:1.45}
.question-row-arrow{font-size:1.1rem;font-weight:700;color:#0f766e}
.qa-answer-title{font-size:1.55rem;margin:0 0 1rem;color:#0f2c59;line-height:1.4}
.qa-answer-body{font-size:1.02rem;line-height:1.75;color:#1e293b}
.qa-footer-notice{margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid #e2e8f0}.qa-footer-notice p{margin:0;font-size:.84rem;color:#64748b;line-height:1.6}`;
const EN_TOPICS = ["Engineering: where to start", "Interests, maths and learning", "Engineering and other study routes", "What would I study?", "Compare computing fields", "Choosing a field", "Careers and changing direction", "Engineering admission routes", "Management quota", "Diploma and second-year entry", "TNEA application to joining", "Information and documents", "Eligibility, subjects and boards", "Nativity and special situations", "Cutoff, percentage and rank"];
const COPY = {
  ta: { title: "கேள்விகளை ஆராயலாம்", home: "குறுகிய தமிழ் வழிகாட்டலுக்குத் திரும்ப", all: "எல்லாத் தலைப்புகளும்", intro: "உங்களுக்கு வேண்டிய தலைப்பை மட்டும் பாருங்கள். எல்லா 70 கேள்விகளையும் படிக்க வேண்டியதில்லை. மதிப்பெண், பிரிவுத் தேர்வு அல்லது கல்லூரிப் பட்டியல் தேவையில்லை.", studentNotice: "சேர்க்கை விளக்கங்கள் 2026 TNEA விதிகளைச் சார்ந்தவை; அடுத்த ஆண்டுக்கும் அதே விதிகள் பொருந்தும் என்று கருதாதீர்கள். இறுதி விவரங்களுக்கு அதிகாரப்பூர்வ TNEA அறிவிப்புகளைச் சரிபார்க்கவும்.", notice: "இது மதிப்பாய்வுக்கான வரைவு. முந்தைய உள்ளடக்கத்தின் நோக்கம் ஏற்கப்பட்டது; இந்தக் கேள்விவாரி வடிவமும் தமிழ் மொழிபெயர்ப்பும் இன்னும் மதிப்பாய்வில் உள்ளன. இறுதி உண்மைத் தகவல் ஒப்புதல், தன்னார்வத் தமிழ் மதிப்பாய்வு, மாணவர் சோதனை முடியவில்லை. சேர்க்கை விளக்கங்கள் 2026 விதிகளைச் சார்ந்தவை; அடுத்த ஆண்டுக்கும் பொருந்தும் என்று கருதாதீர்கள்.", next: "அடுத்து என்ன செய்யலாம்?", why: "மேலும் புரிந்துகொள்ள", limits: "எது இன்னும் உறுதியாகவில்லை?", evidence: "ஆதாரங்களைப் பார்க்க", source: "ஆதாரம்", related: "தொடர்புள்ள கேள்விகள்", return: "தொடர்புடைய தமிழ் வழிகாட்டல் படிக்குச் செல்ல", more: "இந்தத் தலைப்பில் மேலும் பார்க்க", partial: "பகுதி விளக்கம் — கீழே உள்ள இடைவெளி இன்னும் தீரவில்லை.", missing: "இந்தக் கேள்விக்கான தமிழ் மொழிபெயர்ப்பு இன்னும் தயாராகவில்லை. ஆங்கிலத்தைத் தமிழாகக் காட்டவில்லை; விரும்பினால் மொழியை மாற்றிப் பார்க்கலாம்.", notFound: "இந்தக் கேள்விக்கு இங்கு தயாரான பதில் இல்லை", lateral: "இந்தச் சரிபார்ப்பு முதல் ஆண்டு பொறியியல் சேர்க்கைக்கானது. டிப்ளமோ முடித்து நேரடியாக இரண்டாம் ஆண்டில் சேர விரும்பினால், அதற்கான தனி சேர்க்கை வழிகாட்டலைப் பாருங்கள்." },
  en: { title: "Explore questions", home: "Return to the guided journey", all: "All topics", intro: "Explore only what you need. You do not have to read all 70 questions. No marks, branch choice or college list is required.", studentNotice: "Admission explanations refer to 2026 TNEA rules; do not assume they apply unchanged next year. Verify final details against official TNEA notices.", notice: "Review draft. The earlier content direction was accepted; these question-specific edits and Tamil translations still need review. Final factual approval, volunteer Tamil equivalence and student testing are pending. Admission explanations refer to 2026 rules; do not assume they apply next year.", next: "What can I do next?", why: "Understand a little more", limits: "What remains conditional?", evidence: "View evidence", source: "Source", related: "Related questions", return: "Go to the relevant journey step", more: "Explore this topic", partial: "Partial answer — the evidence gap below remains unresolved.", missing: "This English answer is not available.", notFound: "No prepared answer is available for this question", lateral: "This check is for first-year engineering admission. If you completed a diploma and want to enter directly into the second year, refer to the separate lateral-entry admission guidance." },
} as const;
export function questionUrl(id: string | null, lang: QuestionLanguage, topic: string | null = null): string {
  const params = new URLSearchParams({ lang });
  if (id) params.set("id", id);
  if (topic) params.set("topic", topic);
  return `/journey/questions?${params}`;
}
export function renderQuestionCollection(collection: QuestionCollection, id: string | null = null, evidence: string | null = null, lang: QuestionLanguage = "ta", selectedTopic: string | null = null, review = false): { status: number; html: string } {
  const t = COPY[lang];
  const topic = TOPICS.find(([unit]) => unit === selectedTopic);
  const title = (unit: string) => lang === "ta" ? TOPICS.find(([key]) => key === unit)![1] : EN_TOPICS[TOPICS.findIndex(([key]) => key === unit)];
  const switchUrl = questionUrl(id, lang === "ta" ? "en" : "ta", topic?.[0] ?? null);
  const langControl = lang === "ta"
    ? `<span lang="ta" aria-current="page">தமிழ்</span><a lang="en" data-language-switch href="${escape(switchUrl)}">English</a>`
    : `<a lang="ta" data-language-switch href="${escape(switchUrl)}">தமிழ்</a><span lang="en" aria-current="page">English</span>`;
  const shell = (body: string) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${GOOGLE_FONTS_HTML}<title>${t.title}</title><style>${CSS}</style></head><body>${renderSiteHeader(lang, "journey", langControl)}<main>${body}<footer class="qa-footer-notice"><p class="supporting">${review ? t.notice : t.studentNotice}</p></footer></main></body></html>`;
  const link = (qid: string) => {
    const a = collection.answers.get(qid)!;
    return `<a class="question" href="${escape(questionUrl(qid, lang, a.unit))}">${escape(a[lang]?.question ?? t.missing)}</a>`;
  };
  if (evidence !== null) return { status: 404, html: shell(`<h1>${t.notFound}</h1>`) };
  if (selectedTopic !== null && !topic) return { status: 404, html: shell(`<h1>${t.notFound}</h1>`) };
  if (id === null) {
    if (topic) {
      const questionsInTopic = collection.questions.filter((q) => q.unit === topic[0]);
      const topicHtml = `<nav class="qa-breadcrumb"><a class="qa-breadcrumb-link" href="${escape(questionUrl(null, lang))}"><span aria-hidden="true">←</span> ${t.all}</a></nav><div class="qa-hero-header"><div class="qa-hero-badge"><span class="qa-hero-icon">${TOPIC_METADATA[topic[0]]?.icon ?? "📌"}</span><span>${lang === "ta" ? TOPIC_METADATA[topic[0]]?.numTa : TOPIC_METADATA[topic[0]]?.num}</span></div><h1>${escape(title(topic[0]))}</h1><p class="qa-hero-desc">${t.intro}</p></div><div class="questions-list">${questionsInTopic.map((q) => {
        const a = collection.answers.get(q.id)!;
        return `<a class="question-row-card" href="${escape(questionUrl(q.id, lang, a.unit))}"><span class="question-row-icon">💬</span><span class="question-row-text">${escape(a[lang]?.question ?? t.missing)}</span><span class="question-row-arrow">→</span></a>`;
      }).join("")}</div>`;
      return { status: 200, html: shell(topicHtml) };
    }
    const catalogueHtml = `<div class="qa-hero-header"><div class="qa-hero-badge"><span class="qa-hero-icon">💡</span><span>${lang === "ta" ? "பொதுவான சந்தேகங்களுக்கான பதில்கள்" : "Essential Answers &amp; Guidance"}</span></div><h1>${t.title}</h1><p class="qa-hero-desc">${t.intro}</p></div><div class="topic-grid">${TOPICS.map(([unit]) => {
      const meta = TOPIC_METADATA[unit] || { icon: "📌", num: "Topic", numTa: "பகுதி" };
      const count = collection.questions.filter((q) => q.unit === unit).length;
      return `<a class="topic-card" href="${escape(questionUrl(null, lang, unit))}"><div class="topic-card-top"><span class="topic-num-pill">${lang === "ta" ? meta.numTa : meta.num}</span><span class="topic-icon-box">${meta.icon}</span></div><h2 class="topic-card-title">${escape(title(unit))}</h2><div class="topic-card-footer"><span class="topic-count-tag">${count} ${lang === "ta" ? "கேள்விகள்" : "questions"}</span><span class="topic-arrow">→</span></div></a>`;
    }).join("")}</div>`;
    return { status: 200, html: shell(catalogueHtml) };
  }
  const answer = collection.answers.get(id);
  if (!answer) return { status: 404, html: shell(`<h1>${t.notFound}</h1>`) };
  const copy = answer[lang];
  if (!copy || !copy.question || !copy.answer || !copy.next || !copy.limit) return { status: 503, html: shell(`<h1>${t.notFound}</h1><p data-missing-translation>${t.missing}</p>`) };
  const oldLateralLimit = lang === "ta" ? "முதல் ஆண்டு தனிப்பட்ட சரிபார்ப்பு நேரடி இரண்டாம் ஆண்டு தகுதியை மதிப்பிடாது."
    : "The first-year personal check does not assess lateral entry.";
  if (answer.unit === "B03" && !copy.limit.endsWith(oldLateralLimit)) throw new Error("Reviewed lateral-entry limit has changed");
  const displayedLimit = answer.unit === "B03" ? copy.limit.slice(0, -oldLateralLimit.length).trim() : copy.limit;
  const step = TOPICS.find(([unit]) => unit === answer.unit)![2];
  return { status: 200, html: shell(`<nav class="qa-breadcrumb"><a class="qa-breadcrumb-link" href="${escape(questionUrl(null, lang, answer.unit))}"><span aria-hidden="true">←</span> ${escape(title(answer.unit))}</a></nav><h1>${escape(copy.question)}</h1><section class="card" data-guidance-unit="${answer.unit}" data-answer-status="${copy.status}"><div data-direct-answer>${reviewedMarkup(copy.answer)}</div>${copy.status === "PARTIAL" ? `<p class="notice">${t.partial}</p>` : ""}${answer.unit === "B03" ? `<p class="notice">${t.lateral}</p>` : ""}${copy.detail ? `<details><summary>${t.why}</summary>${reviewedMarkup(copy.detail)}</details>` : ""}</section><section class="card"><h2>${t.next}</h2>${reviewedMarkup(copy.next)}${link(answer.nextId)}<details class="limits-details" style="margin: 0.75rem 0; padding: 0.5rem 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;"><summary style="cursor: pointer; font-weight: 600; color: #475569; font-size: 0.9rem;">${t.limits}</summary><div style="margin-top: 0.5rem; font-size: 0.88rem; color: #64748b;">${reviewedMarkup(displayedLimit)}</div></details><details><summary>${t.evidence}</summary>${answer.evidence.map((e) => `<p><a href="${escape(e.url)}" target="_blank" rel="noopener">${t.source} ${escape(e.key)}</a> — ${escape(lang === "ta" ? e.locationTa : e.location)}</p>`).join("")}</details></section>${answer.related?.length ? `<section><h2>${t.related}</h2>${answer.related.map(link).join("")}</section>` : ""}<nav class="actions"><a class="primary" href="/journey?step=${step}${lang === "en" ? "&amp;lang=en" : ""}">${t.return}</a><a class="secondary" href="${escape(questionUrl(null, lang, answer.unit))}">${t.more}</a></nav>`) };
}
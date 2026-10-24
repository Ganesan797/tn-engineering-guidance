import { JOURNEY_FIELDS, type JourneyField, type JourneyState } from "../m2/journey.ts";

export const ANSWER_LABELS: Readonly<Record<JourneyField, readonly [string, string]>> = {
  year: ["சேர்க்கை ஆண்டு", "Admission year"],
  stream: ["படித்த கல்விப் பிரிவு", "Study stream"],
  improvement: ["மேம்பாட்டுத் தேர்வு மதிப்பெண்கள்", "Improvement marks"],
  improvement_year: ["மேம்பாட்டுத் தேர்வு ஆண்டு", "Improvement year"],
  maths: ["கணிதம்", "Mathematics"],
  physics: ["இயற்பியல்", "Physics"],
  chemistry: ["வேதியியல்", "Chemistry"],
};
const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

export function answeredJourneyFields(state: JourneyState): JourneyField[] {
  return JOURNEY_FIELDS.filter(field => state[field] !== null && (field !== "improvement_year" || state.improvement === true));
}

export function renderJourneyAnswers(state: JourneyState, language: "ta" | "en" = "ta"): string {
  const fields = answeredJourneyFields(state);
  if (!fields.length) return "";
  const ta = language === "ta";
  const label = (field: JourneyField) => ANSWER_LABELS[field][ta ? 0 : 1];
  const value = (field: JourneyField) => {
    const answer = state[field];
    if (answer === "unknown") return ta ? "எனக்குத் தெரியாது" : "I don't know";
    if (answer === "academic") return ta ? "12 ஆம் வகுப்பு பொதுக் கல்வி" : "HSC academic";
    if (answer === "other") return ta ? "வேறு ஆண்டு / வழி" : "Other year / path";
    if (typeof answer === "boolean") return answer ? (ta ? "ஆம்" : "Yes") : (ta ? "இல்லை" : "No");
    return String(answer) + (["maths", "physics", "chemistry"].includes(field) ? " / 100" : "");
  };
  return `<details class="answer-review"><summary>${ta ? "உங்கள் பதில்களைப் பார்க்க / திருத்த" : "Review / edit your answers"}</summary><p class="notice">${ta ? "ஒரு பதிலைத் திருத்தினால், அதற்குப் பின் வரும் கேள்விகளை மீண்டும் கேட்போம். அதற்கு முந்தைய பதில்கள் இருக்கும்." : "Editing an answer asks the following questions again. Earlier answers are kept."}</p><form action="/journey" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><ul>${fields.map(field => `<li><strong>${escape(label(field))}:</strong> ${escape(value(field))} <button type="submit" name="edit" value="${field}" aria-label="${escape(label(field))} — ${ta ? "திருத்த" : "Edit"}">${ta ? "திருத்த" : "Edit"}</button></li>`).join("")}</ul></form></details>`;
}

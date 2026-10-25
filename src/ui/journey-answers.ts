// Changed copy: CANDIDATE_PENDING_OWNER_REVIEW.
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

export function renderJourneyAnswers(state: JourneyState, language: "ta" | "en" = "ta", action = "/journey"): string {
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
  return `<details class="answer-review"><summary>${ta ? "நீங்கள் கொடுத்த பதில்களைப் பார்க்கலாம் / மாற்றலாம்" : "Look at / change your answers"}</summary><p class="notice">${ta ? "பதிலில் மாற்றம் வேண்டுமா? மாற்றலாம். அந்தக் கேள்வியிலிருந்து மீண்டும் பதில் கொடுக்க வேண்டும். அதற்கு முன் கொடுத்த பதில்கள் அப்படியே இருக்கும்." : "Want to change an answer? You can. You will answer again from that question onward. Answers before it will stay the same."}</p><form action="${escape(action)}" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(state))}"><ul>${fields.map(field => `<li><strong>${escape(label(field))}:</strong> ${escape(value(field))} <button type="submit" name="edit" value="${field}" aria-label="${escape(label(field))} — ${ta ? "திருத்த" : "Edit"}">${ta ? "திருத்த" : "Edit"}</button></li>`).join("")}</ul></form></details>`;
}

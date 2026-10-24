import { journeyGeneralGuidanceOptions, resolvePersonalGuidanceMessage, toPersonalGuidanceFoundation, type JourneyGuidanceEvaluation } from "../student-semantics/personal-guidance.ts";
import { studentThingsWorthChecking, type GeneralGuidanceOptions } from "../student-semantics/things-worth-checking.ts";
import type { ClaimEvidence, PresentationSourceRegistry } from "../student-semantics/provenance.ts";
import { ANSWER_LABELS, renderJourneyAnswers } from "./journey-answers.ts";

type Language = "ta" | "en";
type Pair = readonly [string, string]; // Tamil first. Changed copy: CANDIDATE_PENDING_OWNER_REVIEW.
export interface M3PresentationOptions {
  readonly sources?: PresentationSourceRegistry;
  readonly generalGuidance?: GeneralGuidanceOptions;
}
export const M3_COPY = {
  title: ["உங்கள் அடுத்த தெளிவான படி", "Your next step"],
  review: ["மொழி மதிப்பாய்வுக்கான வரைவு — இங்குள்ள புதிய தமிழ் மற்றும் ஆங்கில வாசகங்கள் இன்னும் ஒப்புதல் பெறவில்லை.", "Language review draft — the new Tamil and English wording here has not yet been approved."],
  personal: ["உங்கள் பதில்கள் சொல்வது", "What your answers tell us"],
  cutoff: ["கணக்கிட்ட கட்-ஆஃப்", "Calculated cutoff"],
  noCutoff: ["கட்-ஆஃப் எவ்வளவு என்று இப்போது சொல்ல முடியவில்லை. தெரியாத மதிப்பெண்ணை ஊகித்துச் சேர்க்கவில்லை.", "We cannot give a cutoff yet. Unknown marks have not been guessed."],
  eligibility: ["சேர்க்கைத் தகுதி பற்றி என்ன தெரிகிறது?", "What do we know about eligibility?"],
  limit: ["இந்த முடிவு நீங்கள் கொடுத்த பதில்களைச் சார்ந்தது. உங்கள் சான்றிதழ்களை நாங்கள் சரிபார்க்கவில்லை. இதை வைத்து சேர்க்கை கிடைக்கும் என்று உறுதியாகச் சொல்ல முடியாது.", "This result depends on your answers. We have not verified your certificates. It cannot confirm that you will get admission."],
  next: ["அடுத்து என்ன செய்யலாம்?", "What can you do next?"],
  why: ["ஏன் இந்த முடிவு?", "Why this result?"],
  evidence: ["இந்தத் தகவல் எங்கிருந்து வந்தது?", "Where does this information come from?"],
  noChecks: ["நீங்கள் தேர்ந்தெடுத்த ஆண்டு அல்லது படிப்பு வழிக்கான தகுதியை இங்கு சரிபார்க்கவில்லை.", "Eligibility for your selected year or study path has not been checked here."],
  check: ["தகுதி நிபந்தனை", "Eligibility condition"],
  met: ["நீங்கள் கொடுத்த பதில்களின்படி இந்த நிபந்தனை நிறைவேறுகிறது.", "Based on your answers, this condition is met."],
  blocked: ["இதை உறுதிப்படுத்த இன்னும் தெளிவாக வேண்டியவை", "What still needs to be clarified for this check"],
  global: ["முழுத் தகுதியைப் புரிந்துகொள்ள இன்னும் தெளிவாக வேண்டியவை", "What still needs to be clarified for overall eligibility"],
  detail: ["இன்னும் தெளிவாகாத ஒரு விவரம்", "A detail that is still unclear"],
  trace: ["கணக்கில் பயன்படுத்தப்பட்ட மதிப்பெண்கள்", "Marks used in the calculation"],
  partial: ["கணக்கீடு முழுமையாகக் கிடைக்கவில்லை. கிடைத்த மதிப்பெண் விவரங்களை மட்டும் கீழே பார்க்கலாம். இங்கு புதிதாகக் கணக்கிடவில்லை.", "The calculation is incomplete. You can see only the available mark details below. No new calculation is made here."],
  notRequested: ["இந்தச் சரிபார்ப்பில் கட்-ஆஃப் கணக்கீடு கோரப்படவில்லை.", "A cutoff calculation was not requested in this check."],
  unknown: ["தெரியவில்லை", "Unknown"],
  normal: ["நீங்கள் கொடுத்த வழக்கமான மதிப்பெண்", "The normal mark you entered"],
  original: ["மேம்பாட்டுத் தேர்வுக்கு முன் பெற்றதாக நீங்கள் கொடுத்த அசல் மதிப்பெண்", "The original mark you entered from before the improvement exam"],
  originUnknown: ["எந்த மதிப்பெண் பதிவிலிருந்து இது வந்தது என்பது தெரியவில்லை", "Which mark entry this came from is unknown"],
  noEvidence: ["இந்தத் தகவலுக்கான மூலம் இங்கு கிடைக்கவில்லை. அதற்குப் பதிலாக வேறு மூலத்தைக் காட்டவில்லை.", "The source for this information is unavailable here. No different source has been substituted."],
  checkScope: ["இந்த மூலம் இந்த நிபந்தனைக்கானது. இங்குள்ள ஒவ்வொரு விளக்க வாக்கியத்துக்கும் தனித்தனி ஆதாரம் என்று கருத வேண்டாம்.", "This source covers this check. It is not separate evidence for every explanation sentence."],
  documentScope: ["இந்த ஆவணம் ஒட்டுமொத்த சரிபார்ப்புடன் தொடர்புடையது. இதில் ஒரு பத்தியை மட்டும் வைத்து முழுத் தகுதியை உறுதிப்படுத்த முடியாது.", "This document relates to the overall check. No single paragraph confirms full eligibility."],
  contentScope: ["இந்த மூலம் பொதுவான பதில் முழுவதற்குமானது. ஒவ்வொரு வாக்கியத்துக்கும் தனித்தனி ஆதாரம் அல்ல.", "This source covers the general answer as a whole. It is not separate evidence for each sentence."],
  recorded: ["இது ஏற்கெனவே பதிவான பக்க விவரம். அந்தப் பக்கத்தை இங்கு புதிதாகச் சரிபார்க்கவில்லை.", "This is previously recorded page information. The page has not been freshly verified here."],
  verified: ["2026 மேம்பாட்டு மதிப்பெண்கள் பற்றிய பகுதியின் இடம் மட்டும் சரிபார்க்கப்பட்டது. பிற விதிகளோ உங்கள் சான்றிதழ்களோ சரிபார்க்கப்பட்டதாக இது பொருளல்ல.", "Only the location of the 2026 improvement-marks passage was verified. This does not verify other rules or your certificates."],
  unresolved: ["சரியான பக்க இடம் இன்னும் உறுதியாகத் தெரியவில்லை. அதனால் ஆவண இணைப்பை மட்டும் கொடுத்துள்ளோம்.", "The precise page location is still unresolved, so only the document link is provided."],
  year: ["மூலத்தின் ஆண்டு", "Source year"],
  page: ["அச்சுப் பக்கம்", "Printed page"],
  pdf: ["PDF பக்க வரிசை", "PDF page position"],
  location: ["மூலத்தில் பதிவான இடக்குறிப்பு", "Recorded source locator"],
  source: ["அதிகாரப்பூர்வ மூலம்", "Official source"],
  reference: ["பதிலுடன் இணைக்கப்பட்ட மூலம்", "Reference attached to the answer"],
  prepare: ["தயாரிப்பு வழிகாட்டலைப் பார்க்க", "View preparation guidance"],
  retry: ["பதில் தெரிந்தால் இப்போது சொல்லலாம்", "If you know the answer, you can give it now"],
  answer: ["பதில் கொடுக்க வேண்டிய கேள்விக்குத் திரும்பலாம்", "Return to the question awaiting your answer"],
  official: ["அதிகாரப்பூர்வ வழிகாட்டலைப் பார்க்க", "View official guidance"],
  newCheck: ["புதிய சரிபார்ப்பைத் தொடங்க", "Start a new check"],
  outstanding: ["இன்னும் சரிபார்க்க வேண்டியவை", "What still needs checking"],
  notCollected: ["இந்த விவரங்கள் இன்னும் உறுதியாகத் தெரியவில்லை. அவை உங்கள் சேர்க்கைத் தகுதியைப் பாதிக்கலாம். தொடர்புள்ள விளக்கத்தைப் பார்த்து, அதிகாரப்பூர்வ வழிகாட்டலுடன் சரிபார்க்கலாம்.", "These details are still unconfirmed and may affect your eligibility. You can read the related explanations and check the official guidance."],
  paused: ["இப்போதைக்குப் பதில் தெரியாவிட்டாலும் பரவாயில்லை. தெரிந்ததும் இங்கிருந்து தொடரலாம்.", "It is okay not to know the answer now. You can continue from here when you know it."],
  read: ["இதில் என்ன சரிபார்க்க வேண்டும்? (புதிய தாவல்)", "What should I check? (new tab)"],
  formula: ["கணிதம் + இயற்பியல் ÷ 2 + வேதியியல் ÷ 2", "Mathematics + Physics ÷ 2 + Chemistry ÷ 2"],
} as const satisfies Record<string, Pair>;

// Labels describe existing identities, never predicates or new requirements.
const CHECK_LABELS: Readonly<Record<string, Pair>> = {
  ELG001: ["படித்த கல்விப் பிரிவு", "Qualifying study type"],
  ELG002: ["தமிழ்நாட்டில் படித்த விவரங்கள்", "Tamil Nadu study history"],
  ELG003: ["தமிழ்நாட்டைப் பூர்வீகமாகக் கொண்டிருத்தல் மற்றும் படித்த விவரங்கள்", "Tamil Nadu nativity and study history"],
  ELG007: ["பொதுக் கல்விப் பிரிவு மதிப்பெண்கள்", "Academic-stream marks"],
  ELG009: M3_COPY.cutoff,
  ELG010: ["பள்ளி வாரியங்களுக்கு இடையிலான மதிப்பெண் மாற்றுக் கணக்கீடு", "Cross-board mark normalization"],
  ELG016: ["குறைந்தபட்ச கல்வி மதிப்பெண்கள்", "Minimum academic marks"],
  ELG017: ["குறைந்தபட்ச கல்வி மதிப்பெண்கள்", "Minimum academic marks"],
  ELG018: ["குறைந்தபட்ச கல்வி மதிப்பெண்கள்", "Minimum academic marks"],
  ELG019: ["குறைந்தபட்ச கல்வி மதிப்பெண்கள்", "Minimum academic marks"],
  ELG030: ["கிரேடாகக் குறிப்பிடப்பட்ட மதிப்பெண்கள்", "Marks shown as grades"],
  ELG031: ["மதிப்பெண்களை வட்டமிடாமல் பயன்படுத்துதல்", "Using marks without rounding"],
  ELG032: ["மேம்பாட்டுத் தேர்வு மதிப்பெண்கள்", "Improvement marks"],
};
const FIELD_LABELS: Readonly<Record<string, Pair>> = {
  qualifying_stream: CHECK_LABELS.ELG001,
  effective_maths_mark: ["கணக்கிற்கான கணித மதிப்பெண்", "Effective mathematics mark"],
  effective_physics_mark: ["கணக்கிற்கான இயற்பியல் மதிப்பெண்", "Effective physics mark"],
  effective_chemistry_mark: ["கணக்கிற்கான வேதியியல் மதிப்பெண்", "Effective chemistry mark"],
  original_maths_mark: ["அசல் கணித மதிப்பெண்", "Original mathematics mark"],
  original_physics_mark: ["அசல் இயற்பியல் மதிப்பெண்", "Original physics mark"],
  original_chemistry_mark: ["அசல் வேதியியல் மதிப்பெண்", "Original chemistry mark"],
  improvement_marks_used: ["மேம்பாட்டுத் தேர்வு மதிப்பெண்களைப் பயன்படுத்துகிறீர்களா என்ற பதில்", "Whether improvement marks are being used"],
  improvement_marks_year: ["மேம்பாட்டுத் தேர்வு ஆண்டு", "Improvement-mark year"],
  grade_certificate_used: ["மதிப்பெண்கள் கிரேடாகக் கொடுக்கப்பட்டுள்ளனவா என்ற விவரம்", "Whether marks are shown as grades"],
  community: ["இடஒதுக்கீட்டுக்கான சமூகப் பிரிவு", "Reservation community category"],
  nativity_exception_type: ["பூர்வீகம் தொடர்பான சேர்க்கை வழி", "Nativity pathway"],
  govt_school_7_5_entitlement: ["அரசுப் பள்ளி ஒதுக்கீட்டுத் தகுதி", "Government-school reservation entitlement"],
};
const SUBJECTS: Readonly<Record<string, Pair>> = { maths: ["கணிதம்", "Mathematics"], physics: ["இயற்பியல்", "Physics"], chemistry: ["வேதியியல்", "Chemistry"] };
// These fields are not collected by the bounded journey. Links explain existing
// topics; they do not assert an entitlement or add an eligibility predicate.
const UNCOLLECTED: Readonly<Record<string, { id: string; label: Pair }>> = {
  nativity_exception_type: { id: "Q077", label: ["பூர்வீகம் பற்றிய விளக்கம்", "About nativity"] },
  community: { id: "Q074", label: ["குறைந்தபட்ச மதிப்பெண்கள் பற்றிய விளக்கம்", "About minimum marks"] },
  grade_certificate_used: { id: "Q083", label: ["தகுதி நிலை தெளிவில்லையெனில் உதவி பெறுவது", "Getting help with an unclear case"] },
};
const CHECK_EXPLANATIONS: Readonly<Record<string, { explanation: string; copy: Pair }>> = {
  ELG007_PREDICATE_SATISFIED: { explanation: "Academic stream and effective mark predicates pass.", copy: ["பொதுக் கல்விப் பிரிவுக்கான மூன்று மதிப்பெண்களும் கணக்கிற்குக் கிடைத்துள்ளன. இது முழுத் தகுதி உறுதிப்படுத்தல் அல்ல.", "The three academic marks are available for the calculation. This does not confirm full eligibility."] },
  ELG009_PREDICATE_SATISFIED: { explanation: "Academic merit cutoff was calculated from effective marks.", copy: ["கணக்கில் பயன்படுத்தப்பட்ட மதிப்பெண்களிலிருந்து கட்-ஆஃப் கிடைத்துள்ளது. கணக்கை கீழே பார்க்கலாம்.", "The cutoff was calculated from the effective marks. See the calculation below."] },
  ELG031_PREDICATE_SATISFIED: { explanation: "Minimum eligibility uses the unrounded raw average and no normalized marks.", copy: ["இந்தச் சோதனை மதிப்பெண்களை வட்டமிடாமல் பயன்படுத்துவது பற்றியது. உங்கள் சமூகப் பிரிவுக்கான குறைந்தபட்ச மதிப்பெண் தகுதி உறுதியானது என்று இதனால் பொருளல்ல.", "This check concerns using marks without rounding. It does not by itself confirm the minimum-mark requirement for your community category."] },
};
const NORMAL_ORIGINS = new Set(["maths_mark", "physics_mark", "chemistry_mark"]);
const ORIGINAL_ORIGINS = new Set(["original_maths_mark", "original_physics_mark", "original_chemistry_mark"]);
const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const safe = (s: string) => !/\b(?:ELG\d+|SRC\d+|Q\d{3}|NEEDS_REVIEW|UNKNOWN_OR_UNPUBLISHED)\b|blocking_missing_fields|predicate/.test(s);
function https(url: string): boolean { try { const value = new URL(url); return value.protocol === "https:" && !value.username && !value.password; } catch { return false; } }

/** Server-rendered review UI. It reads trusted results and never calculates a score. */
export function renderM3PersonalResult(evaluation: JourneyGuidanceEvaluation, options: M3PresentationOptions = {}): string {
  const scoped = journeyGeneralGuidanceOptions(evaluation, options.generalGuidance);
  const model = toPersonalGuidanceFoundation(evaluation, options.sources, scoped);
  const render = (language: Language): string => {
    const t = (pair: Pair) => pair[language === "ta" ? 0 : 1];
    const p = (pair: Pair) => `<p>${escape(t(pair))}</p>`;
    const message = (key: Parameters<typeof resolvePersonalGuidanceMessage>[0]) => escape(resolvePersonalGuidanceMessage(key, language));
    const form = (name: "retry" | "navigate", value: string, label: Pair, primary = false) => `<form action="/journey" method="post"><input type="hidden" name="state" value="${escape(JSON.stringify(evaluation.context.answers))}"><button${primary ? ' class="primary"' : ""} type="submit" name="${name}" value="${value}">${escape(t(label))}</button></form>`;
    const prepare = () => form("navigate", "prepare", M3_COPY.prepare);
    const sourceLink = (url: string, label: string) => `<a href="${escape(url)}" target="_blank" rel="noopener">${escape(label)}</a>`;
    const title = (rule: string) => t(CHECK_LABELS[rule] ?? M3_COPY.check);
    const evidence = (claim: ClaimEvidence | undefined): string => {
      if (!claim?.references.length) return p(M3_COPY.noEvidence);
      return claim.references.map((ref) => {
        if (!https(ref.source_link)) return p(M3_COPY.noEvidence);
        const label = safe(ref.source_title) ? ref.source_title : t(M3_COPY.reference);
        const precision = claim.precision === "CHECK_LEVEL" ? M3_COPY.checkScope : claim.precision === "DOCUMENT_LEVEL" ? M3_COPY.documentScope : M3_COPY.contentScope;
        // Localized limits retain precision and location status; raw English metadata is never dumped.
        const locationLimit = ref.location_status === "VERIFIED" ? M3_COPY.verified : ref.location_status === "RECORDED" ? M3_COPY.recorded : M3_COPY.unresolved;
        const sourceUrl = ref.location_status === "VERIFIED" && ref.pdf_position !== null ? `${ref.source_link.split("#")[0]}#page=${ref.pdf_position}` : ref.source_link;
        return `<div class="evidence-reference"><p>${sourceLink(sourceUrl, label)}</p><p>${escape(t(M3_COPY.year))}: ${ref.source_year ?? escape(t(M3_COPY.unknown))}${ref.printed_page !== null ? ` · ${escape(t(M3_COPY.page))}: ${ref.printed_page}` : ""}${ref.pdf_position !== null ? ` · ${escape(t(M3_COPY.pdf))}: ${ref.pdf_position}` : ""}</p>${ref.location && safe(ref.location) && (claim.precision === "APPROVED_CONTENT_LEVEL" || ref.location_status === "VERIFIED") ? `<p>${escape(t(M3_COPY.location))}: ${escape(ref.location)}</p>` : ""}${p(precision)}${p(locationLimit)}</div>`;
      }).join("");
    };
    const fields = (values: readonly string[]) => `<ul>${[...new Set(values.map(field => t(FIELD_LABELS[field] ?? M3_COPY.detail)))].map(label => `<li>${escape(label)}</li>`).join("")}</ul>`;
    const result = evaluation.result;
    const sidecar = evaluation.explanation;
    const blockers = [...new Set(result?.eligibility.blocking_missing_fields ?? [])];
    const fieldIssue = model.issues.find(issue => issue.trace.field !== undefined);
    const namedField = fieldIssue?.trace.field;
    const outstanding = `${namedField ? `<li><strong>${escape(t(ANSWER_LABELS[namedField]))}</strong><p>${message(fieldIssue!.message)}</p>${fieldIssue!.category === "UNKNOWN_INFORMATION" ? p(M3_COPY.paused) : ""}</li>` : ""}${blockers.map(field => `<li><strong>${escape(t(FIELD_LABELS[field] ?? M3_COPY.detail))}</strong>${UNCOLLECTED[field] ? `<p><a href="/journey/questions?id=${UNCOLLECTED[field].id}&amp;lang=${language}" target="_blank" rel="noopener">${escape(t(UNCOLLECTED[field].label))} (${escape(language === "ta" ? "புதிய தாவல்" : "new tab")})</a></p>` : `<p>${language === "ta" ? "இந்த விவரம் இன்னும் தெளிவாகவில்லை. நீங்கள் கொடுத்த பதிலை கீழே பார்த்து, தேவைப்பட்டால் மாற்றலாம்." : "This detail is still unclear. You can look at your answer below and change it if needed."}</p>`}</li>`).join("")}${model.checks.filter(check => check.category !== "KNOWN_RESULT" && !(sidecar?.check_blockers.find(entry => entry.rule_id === check.trace.rule_id)?.blocking_fields.length)).map(check => `<li><strong>${escape(title(check.trace.rule_id!))}</strong><p>${message(check.message)}</p></li>`).join("")}`;
    const overall = result?.eligibility.outcome === "ELIGIBLE" ? "eligible" : result?.eligibility.outcome === "INELIGIBLE" ? "negative" : "unresolved";
    const official = options.sources?.get(evaluation.context.scope.kind === "UNSUPPORTED" ? "SRC001" : "SRC002");
    const action = model.primary_action.kind === "RETRY_WHEN_KNOWN" ? form("retry", "1", M3_COPY.retry, true)
      : model.primary_action.kind === "PROVIDE_EXISTING_INPUT" ? form("navigate", "check", M3_COPY.answer, true)
      : model.primary_action.kind === "CONTINUE_PREPARATION" ? form("navigate", "prepare", M3_COPY.prepare, true)
      : official && https(official.url) ? `<a class="action primary" href="${escape(official.url)}" target="_blank" rel="noopener">${escape(t(M3_COPY.official))}</a>` : prepare();
    const checks = model.checks.map((check, index) => {
      const id = check.trace.rule_id!;
      const blockers = sidecar?.check_blockers.find(entry => entry.check_index === index && entry.rule_id === id)?.blocking_fields ?? [];
      const actual = result?.eligibility.checks[index];
      const knownExplanation = CHECK_EXPLANATIONS[check.trace.reason_code ?? ""];
      const explanation = knownExplanation && actual?.outcome === "ELIGIBLE" && actual.explanation === knownExplanation.explanation ? p(knownExplanation.copy)
        : check.category === "KNOWN_RESULT" ? p(M3_COPY.met) : `<p>${message(check.message)}</p>`;
      return `<li><strong>${escape(title(id))}</strong>${explanation}${blockers.length ? p(M3_COPY.blocked) + fields(blockers) : ""}</li>`;
    }).join("");
    const trace = sidecar?.cutoff_trace;
    const traceHtml = !trace ? p(M3_COPY.partial) : trace.status === "NOT_REQUESTED" ? p(M3_COPY.notRequested)
      : `${trace.status === "UNAVAILABLE" ? p(M3_COPY.partial) : ""}<ul>${trace.operands.map(operand => {
        const origin = operand.input_field !== null && NORMAL_ORIGINS.has(operand.input_field) ? M3_COPY.normal : operand.input_field !== null && ORIGINAL_ORIGINS.has(operand.input_field) ? M3_COPY.original : M3_COPY.originUnknown;
        return `<li>${escape(t(SUBJECTS[operand.subject]))}: <strong>${operand.value ?? escape(t(M3_COPY.unknown))}</strong><br>${escape(t(origin))}</li>`;
      }).join("")}</ul>${trace.status === "AVAILABLE" ? `<p>${escape(t(M3_COPY.formula))}</p><p class="formula"><strong>${trace.operands.find(operand => operand.subject === "maths")!.value} + ${trace.operands.find(operand => operand.subject === "physics")!.value} ÷ 2 + ${trace.operands.find(operand => operand.subject === "chemistry")!.value} ÷ 2 = ${trace.result} / 200</strong></p>` : ""}`;
    const general = studentThingsWorthChecking(scoped, language);
    const explore = `<ul><li><a href="/journey/questions?id=Q071&amp;lang=${language}" target="_blank" rel="noopener">${language === "ta" ? "விண்ணப்பிக்கும் முன் என்ன விவரங்களைத் தெரிந்துகொள்ள வேண்டும்?" : "What should I know before applying?"}</a></li><li><a href="/journey/questions?id=Q086&amp;lang=${language}" target="_blank" rel="noopener">${language === "ta" ? "கட்-ஆஃப்புக்கும் தரவரிசைக்கும் என்ன வேறுபாடு?" : "How are cutoff and rank different?"}</a></li><li><a href="/journey/questions?id=Q082&amp;lang=${language}" target="_blank" rel="noopener">${language === "ta" ? "எந்த ஆவணங்களைத் தயார்செய்ய வேண்டும்?" : "Which documents should I prepare?"}</a></li></ul>`;
    const generalHtml = general.items.map((item, index) => `<article><h3>${escape(item.title)}</h3><p>${escape(item.body)}</p><p>${escape(item.why_it_may_be_useful)}</p><p>${escape(item.next_direction)}</p><p>${escape(item.limit)}</p>${sourceLink(item.official_url, t(M3_COPY.official))}<details><summary>${escape(t(M3_COPY.evidence))}</summary>${evidence(model.things_worth_checking.items[index]?.evidence)}</details></article>`).join("");
    return `<div lang="${language}"><section class="card" aria-label="${escape(t(M3_COPY.personal))}"><h2>${escape(t(M3_COPY.personal))}</h2><h3>${escape(t(M3_COPY.cutoff))}</h3>${model.cutoff !== null ? `<p class="cutoff-score"><strong>${model.cutoff} / 200</strong></p>` : p(M3_COPY.noCutoff)}<h3>${escape(t(M3_COPY.eligibility))}</h3>${model.cutoff_eligibility_limit ? "" : `<p>${message(result ? overall : model.primary.message)}</p>`}${model.primary.message !== overall && result ? `<p>${message(model.primary.message)}</p>` : ""}${model.cutoff_eligibility_limit ? `<p>${message(model.cutoff_eligibility_limit)}</p>` : ""}${outstanding ? `<section class="outstanding"><h3>${escape(t(M3_COPY.outstanding))}</h3>${blockers.some(field => UNCOLLECTED[field]) ? p(M3_COPY.notCollected) : ""}<ul>${outstanding}</ul></section>` : ""}${p(M3_COPY.limit)}<h3>${escape(t(M3_COPY.next))}</h3><p>${message(model.primary_action.message)}</p><div class="actions">${action}</div>${renderJourneyAnswers(evaluation.context.answers, language)}
      <details><summary>${escape(t(M3_COPY.why))}</summary>${checks ? `<ul>${checks}</ul>` : p(M3_COPY.noChecks)}${sidecar?.aggregate_blockers.length ? `<h3>${escape(t(M3_COPY.global))}</h3>${fields(sidecar.aggregate_blockers.map(entry => entry.field))}` : ""}<h3>${escape(t(M3_COPY.trace))}</h3>${traceHtml}</details>
      <details><summary>${escape(t(M3_COPY.evidence))}</summary>${result?.eligibility.checks.map(check => `<details><summary>${escape(title(check.rule_id))}</summary>${evidence(model.evidence.find(claim => claim.trace.rule_id === check.rule_id))}</details>`).join("") || p(M3_COPY.noEvidence)}${model.evidence.filter(claim => claim.precision === "DOCUMENT_LEVEL").map(claim => evidence(claim)).join("")}</details></section>
      <section class="card general-guidance" aria-label="${escape(general.heading)}"><h2>${escape(general.heading)}</h2><p>${escape(general.scope)}</p>${general.empty_state ? `<p>${escape(general.empty_state)}</p><p>${language === "ta" ? "விருப்பப்பட்டால் இந்தப் பொதுவான கேள்விகளை ஆராயலாம் (புதிய தாவல்கள்):" : "You can explore these general questions (new tabs):"}</p>${explore}` : generalHtml}<div class="actions">${prepare()}</div></section><p><a href="/journey?step=check">${escape(t(M3_COPY.newCheck))}</a></p></div>`;
  };
  return `<div class="m3-result" data-language-review="pending"><h1>${escape(M3_COPY.title[0])}</h1>${render("ta")}<details class="card"><summary lang="en">English — wording for review</summary>${render("en")}</details><details><summary>இந்தச் சோதனைப் பதிப்பைப் பற்றி</summary><p class="notice">${escape(M3_COPY.review[0])}<br><span lang="en">${escape(M3_COPY.review[1])}</span></p></details></div>`;
}

import { journeyGeneralGuidanceOptions, resolvePersonalGuidanceMessage, toPersonalGuidanceFoundation, type JourneyGuidanceEvaluation } from "../student-semantics/personal-guidance.ts";
import { studentThingsWorthChecking, type GeneralGuidanceOptions } from "../student-semantics/things-worth-checking.ts";
import type { ClaimEvidence, PresentationSourceRegistry } from "../student-semantics/provenance.ts";

type Language = "ta" | "en";
type Pair = readonly [string, string]; // Tamil first. All new copy HUMAN_REVIEW_PENDING.
export interface M3PresentationOptions {
  readonly sources?: PresentationSourceRegistry;
  readonly generalGuidance?: GeneralGuidanceOptions;
}
export const M3_COPY = {
  title: ["உங்கள் அடுத்த தெளிவான படி", "Your next step"],
  review: ["மொழி மதிப்பாய்வுக்கான வரைவு — இங்குள்ள புதிய தமிழ் மற்றும் ஆங்கில வாசகங்கள் இன்னும் ஒப்புதல் பெறவில்லை.", "Language review draft — the new Tamil and English wording here has not yet been approved."],
  personal: ["நீங்கள் அளித்த தகவல்களுக்கான முடிவுகள்", "Results based on your answers"],
  cutoff: ["கணக்கிடப்பட்ட கட்-ஆஃப்", "Calculated cutoff"],
  noCutoff: ["கட்-ஆஃப் இப்போது கிடைக்கவில்லை. தெரியாத மதிப்பெண்ணை ஊகிக்கவில்லை.", "A cutoff is not available now. Unknown marks have not been guessed."],
  eligibility: ["மற்ற தகுதி நிபந்தனைகள்", "Broader eligibility"],
  limit: ["இது நீங்கள் அளித்த பதில்களின் அடிப்படையிலான சரிபார்ப்பு மட்டுமே. சான்றிதழ்கள் சரிபார்க்கப்பட்டதாகவோ சேர்க்கை உறுதியாகவோ இதைக் கருத வேண்டாம்.", "This check uses only your answers. It does not mean that certificates have been verified or admission confirmed."],
  next: ["அடுத்து செய்யக்கூடியது", "What you can do next"],
  why: ["ஏன் இந்த முடிவு?", "Why this result?"],
  evidence: ["மூலங்கள் மற்றும் வரம்புகள்", "Sources and limits"],
  noChecks: ["தேர்ந்தெடுத்த ஆண்டுக்கும் படிப்பு வழிக்கும் இங்கு தனிப்பட்ட சரிபார்ப்பு செய்யப்படவில்லை.", "No personal checks were performed here for the selected year and study path."],
  check: ["தகுதி நிபந்தனை", "Eligibility condition"],
  met: ["உங்கள் பதில்களின்படி இந்த நிபந்தனை நிறைவேறுகிறது.", "Based on your answers, this condition is met."],
  blocked: ["இந்தச் சரிபார்ப்பில் இன்னும் தீராத விவரங்கள்", "Details unresolved in this check"],
  global: ["ஒட்டுமொத்த சரிபார்ப்பில் இன்னும் தீராத விவரங்கள்", "Details unresolved in the overall check"],
  detail: ["கூடுதல் விவரம் — இங்கு இன்னும் தெளிவுபடுத்த முடியவில்லை", "Additional detail — cannot yet be clarified here"],
  trace: ["கணக்கில் பயன்படுத்தப்பட்ட மதிப்பெண்கள்", "Marks used in the calculation"],
  partial: ["கணக்கீடு முழுமையாகக் கிடைக்கவில்லை. கிடைத்த விவரங்கள் மட்டும் கீழே உள்ளன; இங்கே மீண்டும் கணக்கிடவில்லை.", "The calculation is incomplete. Only available details appear below; no calculation is repeated here."],
  notRequested: ["இந்தச் சரிபார்ப்பில் கட்-ஆஃப் கணக்கீடு கோரப்படவில்லை.", "A cutoff calculation was not requested in this check."],
  unknown: ["தெரியவில்லை", "Unknown"],
  normal: ["வழக்கமான மதிப்பெண் பதிவிலிருந்து", "From the normal mark entry"],
  original: ["மேம்பாட்டுத் தேர்வுக்கு முன் பெற்ற அசல் மதிப்பெண் பதிவிலிருந்து", "From the original mark entry before improvement"],
  originUnknown: ["எந்த மதிப்பெண் பதிவு பயன்படுத்தப்பட்டது என்பது தெரியவில்லை", "The mark-entry origin is unknown"],
  noEvidence: ["இந்தக் கூற்றுக்கான மூலம் இங்கு கிடைக்கவில்லை. வேறு மூலத்தை இதற்கான ஆதாரமாகக் காட்டவில்லை.", "A source for this claim is unavailable here. No other source has been substituted."],
  checkScope: ["இந்த நிபந்தனைக்கான மூலம்; இங்குள்ள ஒவ்வொரு விளக்க வாக்கியத்துக்கும் தனித்தனி ஆதாரம் அல்ல.", "Source for this check, not separate evidence for every explanation sentence."],
  documentScope: ["ஒட்டுமொத்த சரிபார்ப்புடன் தொடர்புடைய ஆவணம் மட்டும்; ஒரு குறிப்பிட்ட பத்தி முழுத் தகுதியையும் உறுதிப்படுத்தாது.", "Document related to the overall check only; no single paragraph confirms full eligibility."],
  contentScope: ["இந்தப் பொதுவான பதில் முழுவதற்குமான மூலம்; ஒவ்வொரு வாக்கியத்துக்கும் தனித்தனி ஆதாரம் அல்ல.", "Evidence for the general answer as a whole, not separate evidence for each sentence."],
  recorded: ["பக்க விவரம் பதிவிலிருந்து எடுத்தது; இந்தப் பக்கத்தை இங்கு புதிதாகச் சரிபார்க்கவில்லை.", "Page information comes from recorded metadata; the page has not been freshly verified here."],
  verified: ["2026 மேம்பாட்டு மதிப்பெண்கள் பற்றிய பகுதியின் இடம் மட்டும் சரிபார்க்கப்பட்டது. பிற விதிகளோ உங்கள் சான்றிதழ்களோ சரிபார்க்கப்பட்டதாக இது பொருளல்ல.", "Only the location of the 2026 improvement-marks passage was verified. This does not verify other rules or your certificates."],
  unresolved: ["துல்லியமான பக்க இடம் உறுதியாகத் தெரியவில்லை; ஆவண இணைப்பு மட்டும் கொடுக்கப்பட்டுள்ளது.", "The precise page location is unresolved; only a document link is provided."],
  year: ["மூலத்தின் ஆண்டு", "Source year"],
  page: ["அச்சுப் பக்கம்", "Printed page"],
  pdf: ["PDF பக்க வரிசை", "PDF page position"],
  location: ["மூலத்தில் பதிவான இடக்குறிப்பு", "Recorded source locator"],
  source: ["அதிகாரப்பூர்வ மூலம்", "Official source"],
  reference: ["பதிலுடன் இணைக்கப்பட்ட மூலம்", "Reference attached to the answer"],
  prepare: ["தயாரிப்பு வழிகாட்டலைப் பார்க்க", "View preparation guidance"],
  retry: ["தெரியாத பதிலை இப்போது அளிக்க", "Answer the unknown question now"],
  answer: ["தற்போதுள்ள கேள்விக்குத் திரும்ப", "Return to the existing question"],
  official: ["அதிகாரப்பூர்வ வழிகாட்டலைப் பார்க்க", "View official guidance"],
  newCheck: ["புதிய சரிபார்ப்பைத் தொடங்க", "Start a new check"],
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
  ELG031: ["குறைந்தபட்ச மதிப்பெண் ஒப்பீடு", "Minimum-mark comparison"],
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
        return `<div class="evidence-reference"><p>${sourceLink(ref.source_link, label)}</p><p>${escape(t(M3_COPY.year))}: ${ref.source_year ?? escape(t(M3_COPY.unknown))}${ref.printed_page !== null ? ` · ${escape(t(M3_COPY.page))}: ${ref.printed_page}` : ""}${ref.pdf_position !== null ? ` · ${escape(t(M3_COPY.pdf))}: ${ref.pdf_position}` : ""}</p>${claim.precision === "APPROVED_CONTENT_LEVEL" && ref.location && safe(ref.location) ? `<p>${escape(t(M3_COPY.location))}: ${escape(ref.location)}</p>` : ""}${p(precision)}${p(locationLimit)}</div>`;
      }).join("");
    };
    const fields = (values: readonly string[]) => `<ul>${[...new Set(values.map(field => t(FIELD_LABELS[field] ?? M3_COPY.detail)))].map(label => `<li>${escape(label)}</li>`).join("")}</ul>`;
    const result = evaluation.result;
    const sidecar = evaluation.explanation;
    const overall = result?.eligibility.outcome === "ELIGIBLE" ? "eligible" : result?.eligibility.outcome === "INELIGIBLE" ? "negative" : "unresolved";
    const official = options.sources?.get(evaluation.context.scope.kind === "UNSUPPORTED" ? "SRC001" : "SRC002");
    const action = model.primary_action.kind === "RETRY_WHEN_KNOWN" ? form("retry", "1", M3_COPY.retry, true)
      : model.primary_action.kind === "PROVIDE_EXISTING_INPUT" ? form("navigate", "check", M3_COPY.answer, true)
      : model.primary_action.kind === "CONTINUE_PREPARATION" ? form("navigate", "prepare", M3_COPY.prepare, true)
      : official && https(official.url) ? `<a class="action primary" href="${escape(official.url)}" target="_blank" rel="noopener">${escape(t(M3_COPY.official))}</a>` : prepare();
    const checks = model.checks.map((check, index) => {
      const id = check.trace.rule_id!;
      const blockers = sidecar?.check_blockers.find(entry => entry.check_index === index && entry.rule_id === id)?.blocking_fields ?? [];
      return `<li><strong>${escape(title(id))}</strong>${check.category === "KNOWN_RESULT" ? p(M3_COPY.met) : `<p>${message(check.message)}</p>`}${blockers.length ? p(M3_COPY.blocked) + fields(blockers) : ""}</li>`;
    }).join("");
    const trace = sidecar?.cutoff_trace;
    const traceHtml = !trace ? p(M3_COPY.partial) : trace.status === "NOT_REQUESTED" ? p(M3_COPY.notRequested)
      : `${trace.status === "UNAVAILABLE" ? p(M3_COPY.partial) : ""}<ul>${trace.operands.map(operand => {
        const origin = operand.input_field !== null && NORMAL_ORIGINS.has(operand.input_field) ? M3_COPY.normal : operand.input_field !== null && ORIGINAL_ORIGINS.has(operand.input_field) ? M3_COPY.original : M3_COPY.originUnknown;
        return `<li>${escape(t(SUBJECTS[operand.subject]))}: <strong>${operand.value ?? escape(t(M3_COPY.unknown))}</strong><br>${escape(t(origin))}</li>`;
      }).join("")}</ul>${trace.status === "AVAILABLE" ? `<p>${escape(t(M3_COPY.cutoff))}: <strong>${trace.result} / 200</strong></p>` : ""}`;
    const general = studentThingsWorthChecking(scoped, language);
    const generalHtml = general.items.map((item, index) => `<article><h3>${escape(item.title)}</h3><p>${escape(item.body)}</p><p>${escape(item.why_it_may_be_useful)}</p><p>${escape(item.next_direction)}</p><p>${escape(item.limit)}</p>${sourceLink(item.official_url, t(M3_COPY.official))}<details><summary>${escape(t(M3_COPY.evidence))}</summary>${evidence(model.things_worth_checking.items[index]?.evidence)}</details></article>`).join("");
    return `<div lang="${language}"><section class="card" aria-label="${escape(t(M3_COPY.personal))}"><h2>${escape(t(M3_COPY.personal))}</h2><p>${message("basis")}</p><h3>${escape(t(M3_COPY.cutoff))}</h3>${model.cutoff !== null ? `<p class="cutoff-score"><strong>${model.cutoff} / 200</strong></p>` : p(M3_COPY.noCutoff)}<h3>${escape(t(M3_COPY.eligibility))}</h3><p>${message(result ? overall : model.primary.message)}</p>${model.primary.message !== overall && result ? `<p>${message(model.primary.message)}</p>` : ""}${model.cutoff_eligibility_limit ? `<p>${message(model.cutoff_eligibility_limit)}</p>` : ""}${p(M3_COPY.limit)}<h3>${escape(t(M3_COPY.next))}</h3><p>${message(model.primary_action.message)}</p><div class="actions">${action}</div>
      <details><summary>${escape(t(M3_COPY.why))}</summary>${checks ? `<ul>${checks}</ul>` : p(M3_COPY.noChecks)}${sidecar?.aggregate_blockers.length ? `<h3>${escape(t(M3_COPY.global))}</h3>${fields(sidecar.aggregate_blockers.map(entry => entry.field))}` : ""}<h3>${escape(t(M3_COPY.trace))}</h3>${traceHtml}</details>
      <details><summary>${escape(t(M3_COPY.evidence))}</summary>${result?.eligibility.checks.map(check => `<details><summary>${escape(title(check.rule_id))}</summary>${evidence(model.evidence.find(claim => claim.trace.rule_id === check.rule_id))}</details>`).join("") || p(M3_COPY.noEvidence)}${model.evidence.filter(claim => claim.precision === "DOCUMENT_LEVEL").map(claim => evidence(claim)).join("")}</details></section>
      <section class="card general-guidance" aria-label="${escape(general.heading)}"><h2>${escape(general.heading)}</h2><p>${escape(general.scope)}</p>${general.empty_state ? `<p>${escape(general.empty_state)}</p>` : generalHtml}<div class="actions">${prepare()}</div></section><p><a href="/journey?step=check">${escape(t(M3_COPY.newCheck))}</a></p></div>`;
  };
  return `<div class="m3-result" data-language-review="pending"><h1>${escape(M3_COPY.title[0])}</h1><p class="review">${escape(M3_COPY.review[0])}<br><span lang="en">${escape(M3_COPY.review[1])}</span></p>${render("ta")}<details class="card"><summary lang="en">English — wording for review</summary>${render("en")}</details></div>`;
}

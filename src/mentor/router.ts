import { COHORT_300_METADATA } from "../m5/cohort-metadata.ts";
import { getCounsellingGuidance } from "../m5/counselling-guidance.ts";
import { HISTORICAL_OBSERVATIONS } from "../m5/historical-data.ts";
import type { SupportedLanguage } from "../m5/bilingual-copy.ts";
import { detectBlockedRequest } from "./policy.ts";
import type { BoundedExplanationContext, MentorRequest, MentorRouteType } from "./types.ts";

export interface RoutedDecision {
  readonly route: MentorRouteType;
  readonly canonicalTopic?: CanonicalTopic;
  readonly deterministicReason?: "CUTOFF_EXPLORATION_REDIRECT" | "BRANCH_LIST_LOOKUP" | "HISTORICAL_EXPLORATION";
  readonly insufficientReason?:
    | "SEVEN_POINT_FIVE_VERIFICATION"
    | "UNSUPPORTED_FACT_DOMAIN"
    | "NO_SELECTED_CONTEXT"
    | "INVALID_CONTEXT_ID"
    | "OUTSIDE_GOVERNED_SCOPE";
  readonly blockedReason?: "PROHIBITED_ACTION" | "PREDICTION_OR_RANKING" | "CONTEXT_VALIDATION_ERROR";
  readonly canonicalAnswer?: string;
}

export type CanonicalTopic =
  | "TNEA_DEFINITION"
  | "CUTOFF_MEANING"
  | "SEVEN_POINT_FIVE"
  | "HISTORICAL_DATA"
  | "COUNSELLING_TERMS"
  | "DONATION_WARNING";

function getCanonicalAnswer(topic: CanonicalTopic, lang: SupportedLanguage): string {
  const ta = lang === "ta";
  switch (topic) {
    case "TNEA_DEFINITION":
      return ta
        ? "TNEA (தமிழ்நாடு பொறியியல் சேர்க்கை) என்பது 12-ஆம் வகுப்பு கணிதம், இயற்பியல், வேதியியல் மதிப்பெண்கள் அடிப்படையில் தமிழ்நாட்டில் B.E./B.Tech சேர்க்கைக்கான ஒற்றைச் சாளரக் கலந்தாய்வு முறையாகும்; இதற்குத் தனி நுழைவுத் தேர்வு இல்லை. அனைத்து அதிகாரப்பூர்வ விண்ணப்பமும் tneaonline.org வழியாக மட்டுமே நடைபெறும்."
        : "TNEA (Tamil Nadu Engineering Admissions) is the single-window counselling process for B.E./B.Tech admissions in Tamil Nadu based on Class 12 Maths, Physics, and Chemistry marks, with no separate entrance exam. Official applications happen only on tneaonline.org.";
    case "CUTOFF_MEANING":
      return ta
        ? "TNEA கட்-ஆஃப் (200-க்கு) = கணிதம் + (இயற்பியல் ÷ 2) + (வேதியியல் ÷ 2). இந்தக் கட்-ஆஃப் உங்கள் பொதுத் தரவரிசையைத் (Rank) தீர்மானிக்க உதவும்; ஆனால் சேர்க்கை அந்த ஆண்டின் தரவரிசை, இடஒதுக்கீடு மற்றும் விருப்ப வரிசையைப் பொறுத்தே அமையும்."
        : "TNEA Cutoff (out of 200) = Maths + (Physics ÷ 2) + (Chemistry ÷ 2). It determines your rank position, while actual allotment depends on rank, community reservation, seat availability, and your choice order.";
    case "SEVEN_POINT_FIVE": {
      const sec = getCounsellingGuidance(lang).sections.find((s) => s.title.includes("7.5%"));
      return sec && sec.content.length >= 2
        ? `${sec.content[0]} ${sec.content[1]}`
        : ta
        ? "தமிழ்நாடு சட்டம் 14/2021-ன் படி, அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்தவர்களுக்கு 7.5% ஒதுக்கீடு உண்டு; ஆவணச் சரிபார்ப்பே தகுதியை உறுதிப்படுத்தும்."
        : "Under Tamil Nadu Act No. 14 of 2021, students who studied Classes 6–12 in TN Government schools may qualify for 7.5% reservation subject to official document verification.";
    }
    case "HISTORICAL_DATA":
      return ta
        ? "இங்கு காட்டப்படும் மதிப்பெண்கள் முந்தைய ஆண்டு (2024, 2025, 2026) அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டுப் பட்டியலில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண்கள் மட்டுமே; இவை அதிகாரப்பூர்வ இறுதி கட்-ஆஃப் (Official Closing Cutoff) அல்ல, எதிர்கால சேர்க்கையை உறுதிப்படுத்தாது."
        : "Marks shown here are lowest observed provisional allotment marks from official 2024, 2025, and 2026 allotment lists — not official closing cutoffs and not a guarantee of future admission.";
    case "COUNSELLING_TERMS": {
      const sec = getCounsellingGuidance(lang).sections.find(
        (s) => s.title.includes("Upward") || s.title.includes("மேல்நோக்கிய")
      );
      return sec && sec.content.length > 0
        ? sec.content[0]
        : ta
        ? "Upward Movement என்பது நீங்கள் முதலில் பெற்ற இடத்தைத் தக்கவைத்துக்கொண்டு, விருப்பப் பட்டியலில் அதற்கு மேலே உள்ள விருப்பங்கள் காலியானால் மேம்படுத்த முயலும் முறையாகும்."
        : "Upward Movement lets you accept an allotted seat while staying eligible for higher-ranked choices in your preference list if vacancies arise.";
    }
    case "DONATION_WARNING":
      return ta
        ? "கவனம்: TNEA கலந்தாய்வில் எந்த நபரும் அல்லது முகவரும் 'சீட் உறுதி' அல்லது 'நன்கொடை மூலம் அரசு ஒதுக்கீடு' என்று உத்தரவாதம் அளிக்க முடியாது. அனைத்து விண்ணப்பம், கட்டணம் மற்றும் விருப்பப் பதிவையும் tneaonline.org என்ற அதிகாரப்பூர்வ TNEA/DOTE தளத்தில் மட்டுமே செய்யவும்."
        : "Warning: No agent or third party can guarantee a TNEA government-quota seat. Perform all registration, fee payments, and choice entry strictly through the official TNEA/DOTE portal at tneaonline.org.";
  }
}

function resolveCollegeForBranchList(question: string, context: BoundedExplanationContext) {
  if (context.selected_evidence.length > 0) {
    const code = context.selected_evidence[0].collegeCode;
    return { code, meta: COHORT_300_METADATA[code] ?? null, requestedUnknown: false };
  }

  // Check explicit numeric college code (e.g., "0001" -> "1", "2006", "9999")
  const codeMatch = question.match(/\b(?:college\s*(?:code)?\s*#?\s*)?(\d{1,4})\b/i);
  if (codeMatch) {
    const normalizedCode = String(parseInt(codeMatch[1], 10));
    const meta = COHORT_300_METADATA[normalizedCode] ?? COHORT_300_METADATA[codeMatch[1]] ?? null;
    return { code: normalizedCode, meta, requestedUnknown: !meta };
  }

  // Check known aliases and college names in COHORT_300_METADATA
  const qLower = question.toLowerCase();
  for (const meta of Object.values(COHORT_300_METADATA)) {
    for (const alias of meta.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${escaped}\\b`, "i").test(qLower)) {
        return { code: meta.code, meta, requestedUnknown: false };
      }
    }
  }
  for (const meta of Object.values(COHORT_300_METADATA)) {
    const shortName = meta.name.split(",")[0].split("(")[0].trim().toLowerCase();
    if (shortName.length >= 6 && qLower.includes(shortName)) {
      return { code: meta.code, meta, requestedUnknown: false };
    }
  }

  return { code: null, meta: null, requestedUnknown: false };
}

const BRANCH_LIST_QUERY_RE =
  /\b(what|which|show|list)\s+(the\s+)?(branches|departments|courses|programmes)\b|\b(branches|departments)\s+(in|at|of|does)\b|(என்னென்ன\s*படிப்புகள்|என்ன\s*துறைகள்|படிப்புகள்\s*உள்ளன|பாடப்பிரிவுகள்\s*உள்ளன)/i;

const UNSUPPORTED_FACT_RE =
  /\b(hostel\s*(fee|fees|availability|available|subsidy|room|rooms)?|placement\s*(percentage|rate|record|stats)?|salary|package|highest\s+package|current\s+(fee|fees|tuition|vacancy|vacancies|hostel|benefit)|tuition\s+fees?|scholarships?|fee\s+waivers?|facilities|campus\s+facilities|accreditation|naac|nba|transport|bus\s+facility|vacancies|vacancy)\b|(ஹாஸ்டல்|விடுதி\s*(கட்டணம்|வசதி|உண்டா)|பிளேஸ்மென்ட்|வேலைவாய்ப்பு\s*சதவீதம்|சம்பளம்|கல்விக்\s*கட்டணம்|உதவித்தொகை|கட்டணச்\s*சலுகை|காலியிடங்கள்|பஸ்\s*வசதி|அங்கீகாரம்)/i;

const HISTORICAL_EXPLORATION_RE =
  /\b(historical\s+(value|values|observation|observations|record|records|data|cutoff)|previous[- ]year\s+(observation|observations|record|records|data)|visible\s+for\s+my\s+current\s+filters)\b|(முந்தைய\s*ஆண்டு\s*தரவு|வரலாற்று\s*மதிப்பெண்)/i;

export function routeMentorRequest(
  request: MentorRequest,
  question: string,
  context: BoundedExplanationContext
): RoutedDecision {
  const lang: SupportedLanguage = context.language;
  const ta = lang === "ta";

  // 1. Blocked / prompt-injection / prediction-ranking demands
  const blockedKind = detectBlockedRequest(question);
  if (blockedKind) {
    if (blockedKind === "RANKING_OR_RECOMMENDATION") {
      return {
        route: "BLOCKED_REQUEST",
        blockedReason: "PREDICTION_OR_RANKING",
        canonicalAnswer: ta
          ? "நான் கல்லூரிகளை வரிசைப்படுத்தவோ, சிறந்ததைப் பரிந்துரைக்கவோ அல்லது உங்களுக்காகத் தேர்ந்தெடுக்கவோ மாட்டேன். நீங்கள் தேர்ந்தெடுத்த கல்லூரிகள்/துறைகளை அதிகாரப்பூர்வ முந்தைய தரவு, பாடப்பிரிவு மற்றும் இருப்பிடம் அடிப்படையில் ஒப்பிட்டு விளக்க முடியும்; இறுதி வரிசையை நீங்களே முடிவு செய்யலாம்."
          : "I cannot rank or recommend colleges or choose the best option for you. I can help compare the colleges/branches you selected using governed historical evidence, branch, and location so you can decide your own final order.",
      };
    }
    return {
      route: "BLOCKED_REQUEST",
      blockedReason: blockedKind === "PROMPT_INJECTION" ? "PROHIBITED_ACTION" : "PREDICTION_OR_RANKING",
      canonicalAnswer: ta
        ? "இந்த தளம் உங்கள் தேர்ந்தெடுத்த கட்-ஆஃப், பிரிவு மற்றும் வடிகட்டிகளின் அடிப்படையில் முந்தைய அதிகாரப்பூர்வ ஒதுக்கீட்டுத் தரவை மட்டுமே காட்ட முடியும்; சேர்க்கையை கணிக்கவோ கல்லூரிகளை 'பாதுகாப்பானது/இலக்கு' எனத் தரவரிசைப்படுத்தவோ செய்யாது."
        : "The site can show historical allotment evidence for your selected cutoff/community/filters, but it cannot predict admission or label colleges as safe/target/dream.",
    };
  }

  // 2. Explicit context-ID validation & scope errors (never silently truncated)
  if (context.context_error_code === "TOO_MANY_CONTEXT_IDS" || context.context_error_code === "DUPLICATE_CONTEXT_IDS") {
    return {
      route: "BLOCKED_REQUEST",
      blockedReason: "CONTEXT_VALIDATION_ERROR",
      canonicalAnswer:
        context.context_error_code === "TOO_MANY_CONTEXT_IDS"
          ? ta
            ? "ஒரே நேரத்தில் அதிகபட்சம் 6 விருப்பங்களை மட்டுமே விளக்கத்திற்கு அனுப்ப முடியும்."
            : "Too many context items were sent; a maximum of 6 selected items is allowed per request."
          : ta
          ? "ஒரே கல்லூரி-படிப்பு குறியீடு மீண்டும் மீண்டும் அனுப்பப்பட்டுள்ளது; தனித்துவமான தேர்வுகளை மட்டும் அனுப்பவும்."
          : "Duplicate context IDs were provided; please send unique offering identifiers.",
    };
  }
  if (context.context_outcome === "INVALID_CONTEXT_ID") {
    return {
      route: "INSUFFICIENT_EVIDENCE",
      insufficientReason: "INVALID_CONTEXT_ID",
      canonicalAnswer: ta
        ? "தேர்ந்தெடுத்த பதிவுக் குறியீட்டைச் சரிபார்க்க முடியவில்லை."
        : "The selected context could not be verified.",
    };
  }
  if (context.context_outcome === "OUTSIDE_GOVERNED_SCOPE") {
    return {
      route: "INSUFFICIENT_EVIDENCE",
      insufficientReason: "OUTSIDE_GOVERNED_SCOPE",
      canonicalAnswer: ta
        ? "இந்த விருப்பம் தற்போது ஆளுகை செய்யப்பட்ட 300-கல்லூரி தரவு வரம்பிற்கு வெளியே உள்ளது."
        : "This option is outside the current governed data scope.",
    };
  }

  // 3. Protective / Canonical reviewed bypass
  if (/(donation|agent|guarantee|broker|நன்கொடை|ஏஜென்ட்|உத்தரவாதம்|பணம் கேட்டால்)/i.test(question)) {
    return {
      route: "CANONICAL_REVIEWED",
      canonicalTopic: "DONATION_WARNING",
      canonicalAnswer: getCanonicalAnswer("DONATION_WARNING", lang),
    };
  }

  // 4. 7.5% personal eligibility / fee-waiver inference from free text -> INSUFFICIENT_EVIDENCE
  if (
    /(am i eligible|do i get|check my|for me|எனக்கு.*கிடைக்குமா|நான்.*தகுதியா|என்.*இலவசமா)/i.test(question) &&
    /(7\.5|govt school|அரசுப் பள்ளி|fee waiver|கட்டண|ஹாஸ்டல்|hostel)/i.test(question)
  ) {
    return {
      route: "INSUFFICIENT_EVIDENCE",
      insufficientReason: "SEVEN_POINT_FIVE_VERIFICATION",
      canonicalAnswer: ta
        ? "உரைக் கேள்வியின் அடிப்படையில் மட்டும் 7.5% தகுதியையோ கட்டண/விடுதிச் சலுகையையோ உறுதிப்படுத்த முடியாது. 6 முதல் 12-ஆம் வகுப்பு வரை தமிழ்நாடு அரசுப் பள்ளியில் படித்ததற்கான தலைமை ஆசிரியர் மற்றும் CEO மேலொப்பமிட்ட சான்றிதழை TNEA அதிகாரப்பூர்வ சரிபார்ப்பில் உறுதிப்படுத்த வேண்டும்."
        : "7.5% quota eligibility and fee/hostel waivers cannot be inferred from a text question alone. Official TNEA verification of your Std 6–12 TN Government School bonafide certificate (signed by Headmaster and CEO) is required.",
    };
  }

  // 5. General 7.5% canonical rule (only when asking about general 7.5% provisions, not college-specific hostel/fee)
  if (/(7\.5%|7\.5|அரசுப் பள்ளி ஒதுக்கீடு)/i.test(question) && !UNSUPPORTED_FACT_RE.test(question)) {
    return {
      route: "CANONICAL_REVIEWED",
      canonicalTopic: "SEVEN_POINT_FIVE",
      canonicalAnswer: getCanonicalAnswer("SEVEN_POINT_FIVE", lang),
    };
  }

  // 6. Deterministic branch/programme listing for a governed college
  if (BRANCH_LIST_QUERY_RE.test(question)) {
    const resolved = resolveCollegeForBranchList(question, context);
    if (resolved.requestedUnknown) {
      return {
        route: "INSUFFICIENT_EVIDENCE",
        insufficientReason: "OUTSIDE_GOVERNED_SCOPE",
        canonicalAnswer: ta
          ? "இந்தக் கல்லூரி தற்போது ஆளுகை செய்யப்பட்ட 300-கல்லூரி தரவு வரம்பிற்கு வெளியே உள்ளது."
          : "This option is outside the current governed data scope.",
      };
    }
    if (resolved.meta) {
      const offerings = HISTORICAL_OBSERVATIONS.getAllGovernedOfferings().filter(
        (o) => o.collegeCode === resolved.meta!.code
      );
      if (resolved.meta.code === "1516") {
        return {
          route: "DETERMINISTIC",
          deterministicReason: "BRANCH_LIST_LOOKUP",
          canonicalAnswer: ta
            ? `${resolved.meta.name} (${resolved.meta.code}) — ஆளுகை செய்யப்பட்ட ${offerings.length} படிப்புகள்: ${offerings.map((o) => `${o.programmeName} (${o.programmeCode})`).join(", ")}. குறிப்பு: இந்தக் கல்லூரியின் வரலாற்றுத் தரவு தற்போது நிறுத்திவைக்கப்பட்டுள்ளது (Held for review).`
            : `${resolved.meta.name} (${resolved.meta.code}) — ${offerings.length} governed programmes: ${offerings.map((o) => `${o.programmeName} (${o.programmeCode})`).join(", ")}. Note: historical evidence for this college is currently held for review.`,
        };
      }
      return {
        route: "DETERMINISTIC",
        deterministicReason: "BRANCH_LIST_LOOKUP",
        canonicalAnswer: ta
          ? `${resolved.meta.name} (${resolved.meta.code}, ${resolved.meta.district}) — ஆளுகை செய்யப்பட்ட ${offerings.length} படிப்புகள்: ${offerings.map((o) => `${o.programmeName} (${o.programmeCode})`).join(", ")}.`
          : `${resolved.meta.name} (${resolved.meta.code}, ${resolved.meta.district}) — ${offerings.length} governed programmes: ${offerings.map((o) => `${o.programmeName} (${o.programmeCode})`).join(", ")}.`,
      };
    }
    return {
      route: "INSUFFICIENT_EVIDENCE",
      insufficientReason: "NO_SELECTED_CONTEXT",
      canonicalAnswer: ta
        ? "படிப்புகளின் பட்டியலைப் பார்க்க ஒரு கல்லூரியின் பெயர் அல்லது குறியீட்டைத் தேர்ந்தெடுக்கவும்."
        : "Please specify or select a governed college name or code to list its programmes.",
    };
  }

  // 7. Unsupported factual domains -> INSUFFICIENT_EVIDENCE (never substitute cutoff data)
  if (UNSUPPORTED_FACT_RE.test(question)) {
    return {
      route: "INSUFFICIENT_EVIDENCE",
      insufficientReason: "UNSUPPORTED_FACT_DOMAIN",
      canonicalAnswer: ta
        ? "தற்போதைய ஆளுகை செய்யப்பட்ட தகவலில் இதற்கான விவரம் இல்லை (உறுதிப்படுத்தப்படாத தகவல் வழங்கப்படாது). அதிகாரப்பூர்வ கல்லூரி அல்லது TNEA இணையதளத்தில் சரிபார்க்கவும்."
        : "The current governed information does not establish this. Please verify it through the official college/TNEA source.",
    };
  }

  // 8. Canonical general TNEA / cutoff / counselling terms (when no selected context)
  const hasSelectedContext = context.selected_evidence.length > 0;
  if (!hasSelectedContext && !request.intent) {
    if (/(what is tnea|tnea என்றால் என்ன|tnea பற்றி)/i.test(question)) {
      return { route: "CANONICAL_REVIEWED", canonicalTopic: "TNEA_DEFINITION", canonicalAnswer: getCanonicalAnswer("TNEA_DEFINITION", lang) };
    }
    if (/(what is cutoff|cutoff என்றால் என்ன|கட்-ஆஃப் கணக்கீடு|கட்-ஆஃப் என்றால்)/i.test(question)) {
      return { route: "CANONICAL_REVIEWED", canonicalTopic: "CUTOFF_MEANING", canonicalAnswer: getCanonicalAnswer("CUTOFF_MEANING", lang) };
    }
    if (/(upward movement|accept and upward|தற்காலிக ஒதுக்கீடு|கலந்தாய்வு விதி)/i.test(question)) {
      return { route: "CANONICAL_REVIEWED", canonicalTopic: "COUNSELLING_TERMS", canonicalAnswer: getCanonicalAnswer("COUNSELLING_TERMS", lang) };
    }
    if (/(closing cutoff|provisional allotment)/i.test(question)) {
      return { route: "CANONICAL_REVIEWED", canonicalTopic: "HISTORICAL_DATA", canonicalAnswer: getCanonicalAnswer("HISTORICAL_DATA", lang) };
    }
  }

  // 9. Legitimate historical exploration -> DETERMINISTIC (or mock explanation if context selected)
  if (HISTORICAL_EXPLORATION_RE.test(question) && !hasSelectedContext) {
    return {
      route: "DETERMINISTIC",
      deterministicReason: "HISTORICAL_EXPLORATION",
      canonicalAnswer: ta
        ? "நீங்கள் தேடும் கட்-ஆஃப், துறை (எ.கா. ECE), ஆண்டு (2024–2026) மற்றும் பிரிவு வடிகட்டிகளை ஒப்பீட்டு அட்டவணையில் பயன்படுத்தி முந்தைய அதிகாரப்பூர்வ ஒதுக்கீட்டுப் பதிவுகளைப் பார்க்கலாம். இவை வரலாற்றுப் பதிவுகள் மட்டுமே; சேர்க்கை கணிப்பு அல்ல."
        : "Use the comparison table filters (cutoff, branch, year 2024–2026, community, round) to browse past provisional allotment observations. These are historical observations only, not admission predictions.",
    };
  }

  // 10. Context state with no selected items -> NO_CONTEXT / INSUFFICIENT_EVIDENCE
  if (!hasSelectedContext && !question.trim()) {
    return {
      route: "INSUFFICIENT_EVIDENCE",
      insufficientReason: "NO_SELECTED_CONTEXT",
      canonicalAnswer: ta
        ? "விளக்கம் பெற ஒரு கல்லூரி, பாடப்பிரிவு அல்லது உங்கள் விருப்பப் பட்டியலைத் தேர்ந்தெடுக்கவும்."
        : "Please select a college, branch, or shortlist item to explain.",
    };
  }

  return { route: "AI_EXPLANATION_MOCK" };
}

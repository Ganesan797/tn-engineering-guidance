import type { AllotmentRound, AllotmentRoundOrAll, CommunityCategory, QuotaStream } from "./types.ts";

export type SupportedLanguage = "en" | "ta";

export interface ComparisonCopyText {
  readonly title: string;
  readonly studentCutoffLabel: string;
  readonly quotaLabel: string;
  readonly communityLabel: string;
  readonly roundLabel: string;
  readonly historicalMinLabel: string;
  readonly deltaLabel: string;
  readonly nonPredictionDisclaimer: string;
  readonly missingCutoffPrompt: string;
  readonly noDataNotice: string;
  readonly heldNotice: string;
  readonly formatDisclosure: (round: AllotmentRoundOrAll) => string;
  readonly formatDelta: (delta: number) => string;
  readonly quotaName: (quota: QuotaStream) => string;
  readonly communityName: (category: CommunityCategory) => string;
  readonly roundName: (round: AllotmentRoundOrAll) => string;
}

const ROUND_NUMBER_MAP: Record<AllotmentRound, string> = {
  ROUND_1: "1",
  ROUND_2: "2",
  ROUND_3: "3",
};

const EN_COPY: ComparisonCopyText = {
  title: "Historical Provisional Allotment Comparison",
  studentCutoffLabel: "Student Cutoff Mark",
  quotaLabel: "Admission Quota / Stream",
  communityLabel: "Reservation Community Category",
  roundLabel: "Counselling Round",
  historicalMinLabel: "Observed Minimum Mark",
  deltaLabel: "Comparison Delta (Δ)",
  nonPredictionDisclaimer:
    "Past provisional allotments do not guarantee future admission. A positive or negative mark difference is a factual historical calculation and does not ensure, predict, or guarantee admission. Cutoffs vary each year based on applicant preferences, seat matrix, and marks distribution.",
  missingCutoffPrompt:
    "Enter your cutoff mark (0.00 to 200.00) to view the arithmetic comparison delta.",
  noDataNotice:
    "Not available for comparison (No approved historical data available).",
  heldNotice:
    "Held: Booklet carries '(Previous year data)' header; requires current-year official intake confirmation.",
  formatDisclosure: (round: AllotmentRoundOrAll) => {
    if (round === "ALL") {
      return "Lowest observed provisional allotment mark across available official rounds (Round 1, Round 2, and Round 3). Upward movement and subsequent non-reporting not reflected. This is an observed historical benchmark, not an official closing cutoff.";
    }
    const num = ROUND_NUMBER_MAP[round] ?? round;
    return `Minimum observed mark in official Round ${num} provisional allotment publication. Upward movement and subsequent non-reporting not reflected.`;
  },
  formatDelta: (delta: number) => {
    if (delta > 0) {
      return `+${delta.toFixed(2)} vs observed minimum`;
    }
    if (delta < 0) {
      return `${delta.toFixed(2)} vs observed minimum`;
    }
    return "0.00 (exact match with observed minimum)";
  },
  quotaName: (quota: QuotaStream) => {
    return quota === "GENERAL_ACADEMIC"
      ? "General Academic"
      : "7.5% Government School Quota";
  },
  communityName: (category: CommunityCategory) => {
    switch (category) {
      case "OC":
        return "Open Competition (OC)";
      case "BC":
        return "Backward Class (BC)";
      case "BCM":
        return "BC Muslim (BCM)";
      case "MBC":
        return "Most Backward Class (MBC)";
      case "SC":
        return "Scheduled Caste (SC)";
      case "SCA":
        return "SC Arunthathiyar (SCA)";
      case "ST":
        return "Scheduled Tribe (ST)";
    }
  },
  roundName: (round: AllotmentRoundOrAll) => {
    if (round === "ALL") return "All Available Rounds (Lowest Observed Mark)";
    return `Round ${ROUND_NUMBER_MAP[round] ?? round}`;
  },
};

const TA_COPY: ComparisonCopyText = {
  title: "கடந்த ஆண்டு கட்-ஆஃப் ஒப்பீடு (தற்காலிக ஒதுக்கீடு)",
  studentCutoffLabel: "உங்கள் கட்-ஆஃப் மதிப்பெண்",
  quotaLabel: "சேர்க்கை ஒதுக்கீடு (Quota)",
  communityLabel: "இட ஒதுக்கீட்டுப் பிரிவு (Community)",
  roundLabel: "கலந்தாய்வு சுற்று",
  historicalMinLabel: "குறைந்தபட்ச ஒதுக்கீட்டு மதிப்பெண்",
  deltaLabel: "கட்-ஆஃப் வித்தியாசம் (Δ)",
  nonPredictionDisclaimer:
    "கடந்த கால தற்காலிக ஒதுக்கீடுகள் எதிர்கால சேர்க்கையை உறுதிப்படுத்தாது. நேர்மறை அல்லது எதிர்மறை மதிப்பெண் வேறுபாடு என்பது ஒரு வரலாற்று கணக்கீடு மட்டுமே; அது சேர்க்கையை உறுதிப்படுத்தவோ கணிக்கவோ செய்யாது. விண்ணப்பதாரர்களின் விருப்பங்கள், இட ஒதுக்கீடு மற்றும் மதிப்பெண் பரவல் ஆகியவற்றின் அடிப்படையில் கட்-ஆஃப் ஆண்டுதோறும் மாறுபடும்.",
  missingCutoffPrompt:
    "ஒப்பீட்டு வேறுபாட்டைக் காண உங்கள் கட்-ஆஃப் மதிப்பெண்ணை (0.00 முதல் 200.00 வரை) உள்ளிடவும்.",
  noDataNotice:
    "ஒப்பீட்டிற்குத் தரவு இல்லை (கடந்த ஆண்டு அதிகாரப்பூர்வத் தரவு இல்லை).",
  heldNotice:
    "நிறுத்திவைக்கப்பட்டுள்ளது: கல்லூரி கையேட்டில் '(முந்தைய ஆண்டு தரவு)' என்ற குறிப்பு உள்ளது; நடப்பு ஆண்டு அதிகாரப்பூர்வ சேர்க்கை உறுதிப்படுத்தல் தேவை.",
  formatDisclosure: (round: AllotmentRoundOrAll) => {
    if (round === "ALL") {
      return "கிடைக்கக்கூடிய அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டு சுற்றுகளில் (சுற்று 1, 2, 3) கண்டறியப்பட்ட மிகக் குறைந்தபட்ச மதிப்பெண். மேல்நோக்கிய நகர்வு மற்றும் பின்னர் சேராமை ஆகியவை இதில் பிரதிபலிக்கவில்லை. இது ஒரு வரலாற்றுப் பதிவு மட்டுமே, அதிகாரப்பூர்வ இறுதி முடிவு மதிப்பெண் அல்ல.";
    }
    const num = ROUND_NUMBER_MAP[round] ?? round;
    return `அதிகாரப்பூர்வ சுற்று ${num} தற்காலிக ஒதுக்கீட்டு வெளியீட்டில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண். மேல்நோக்கிய நகர்வு மற்றும் பின்னர் சேராமை ஆகியவை இதில் பிரதிபலிக்கவில்லை.`;
  },
  formatDelta: (delta: number) => {
    if (delta > 0) {
      return `+${delta.toFixed(2)} (குறைந்தபட்ச ஒதுக்கீட்டு மதிப்பெண்ணுடன் ஒப்பீடு)`;
    }
    if (delta < 0) {
      return `${delta.toFixed(2)} (குறைந்தபட்ச ஒதுக்கீட்டு மதிப்பெண்ணுடன் ஒப்பீடு)`;
    }
    return "0.00 (குறைந்தபட்ச ஒதுக்கீட்டு மதிப்பெண்ணிற்கு சமம்)";
  },
  quotaName: (quota: QuotaStream) => {
    return quota === "GENERAL_ACADEMIC"
      ? "பொதுக் கல்வி (General Academic)"
      : "7.5% அரசுப் பள்ளி ஒதுக்கீடு";
  },
  communityName: (category: CommunityCategory) => {
    switch (category) {
      case "OC":
        return "பொதுப் பிரிவு (OC)";
      case "BC":
        return "பிற்படுத்தப்பட்டோர் (BC)";
      case "BCM":
        return "பிற்படுத்தப்பட்ட முஸ்லிம் (BCM)";
      case "MBC":
        return "மிகவும் பிற்படுத்தப்பட்டோர் (MBC)";
      case "SC":
        return "ஆதிதிராவிடர் (SC)";
      case "SCA":
        return "அருந்ததியர் (SCA)";
      case "ST":
        return "பழங்குடியினர் (ST)";
    }
  },
  roundName: (round: AllotmentRoundOrAll) => {
    if (round === "ALL") return "அனைத்துச் சுற்றுகளும் (கிடைத்த குறைந்தபட்சம்)";
    return `சுற்று ${ROUND_NUMBER_MAP[round] ?? round}`;
  },
};

export function getComparisonCopy(lang: SupportedLanguage = "en"): ComparisonCopyText {
  return lang === "ta" ? TA_COPY : EN_COPY;
}

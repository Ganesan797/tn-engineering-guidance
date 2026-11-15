/**
 * Reviewed bilingual truth-in-guidance disclosures and explanatory copy for M5 historical comparisons.
 * Adheres strictly to D5 Section 1, 6 and M5-T01/T02 truth-in-guidance standards.
 */

export interface BilingualText {
  readonly en: string;
  readonly ta: string;
}

export function formatTruthInGuidanceDisclosure(round: number): BilingualText {
  return {
    en: `Minimum observed mark in official Round ${round} provisional allotment publication. Upward movement and subsequent non-reporting not reflected.`,
    ta: `அதிகாரப்பூர்வ சுற்று ${round} தற்காலிக ஒதுக்கீட்டு வெளியீட்டில் காணப்பட்ட குறைந்தபட்ச மதிப்பெண். மேல்நோக்கி நகர்வு மற்றும் மாணவர்கள் சேராமல் விட்ட இடங்கள் இதில் இடம்பெறவில்லை.`,
  };
}

export function formatDeltaExplanation(
  delta: number,
  year: number,
  round: number,
  minMark: number
): BilingualText {
  const formattedDelta = Math.abs(delta).toFixed(2);
  const formattedMin = minMark.toFixed(2);

  if (delta > 0) {
    return {
      en: `Your cutoff is +${formattedDelta} marks above the ${year} Round ${round} minimum observed mark (${formattedMin}). This indicates historical numerical standing only, not an admission guarantee. Cutoffs fluctuate annually based on seat matrix and applicant choices.`,
      ta: `உங்கள் கட்-ஆப் மதிப்பெண் ${year} சுற்று ${round}-ன் குறைந்தபட்ச மதிப்பெண்ணைவிட (${formattedMin}) +${formattedDelta} மதிப்பெண்கள் அதிகமாக உள்ளது. இது முந்தைய ஆண்டின் எண்சார் ஒப்பீடு மட்டுமே; சேர்க்கைக்கான உத்தரவாதம் அல்ல. இடங்களின் எண்ணிக்கை மற்றும் மாணவர் விருப்பங்களைப் பொறுத்து ஆண்டுதோறும் கட்-ஆப் மாறும்.`,
    };
  }

  if (delta === 0) {
    return {
      en: `Your cutoff is exactly equal to the ${year} Round ${round} minimum observed mark (${formattedMin}). Equality reflects numerical identity only and does not imply admission entitlement.`,
      ta: `உங்கள் கட்-ஆப் மதிப்பெண் ${year} சுற்று ${round}-ன் குறைந்தபட்ச மதிப்பெண்ணிற்குச் (${formattedMin}) சமமாக உள்ளது. இது மதிப்பெண் சமநிலை மட்டுமே; சேர்க்கை உரிமையைக் குறிக்காது.`,
    };
  }

  return {
    en: `Your cutoff is -${formattedDelta} marks below the ${year} Round ${round} minimum observed mark (${formattedMin}). Historical minimums vary across years, rounds, and quotas.`,
    ta: `உங்கள் கட்-ஆப் மதிப்பெண் ${year} சுற்று ${round}-ன் குறைந்தபட்ச மதிப்பெண்ணைவிட (${formattedMin}) -${formattedDelta} மதிப்பெண்கள் குறைவாக உள்ளது. ஆண்டுகள் மற்றும் சுற்றுகளைப் பொறுத்து குறைந்தபட்ச மதிப்பெண்கள் மாறுபடும்.`,
  };
}

export const M5_BILINGUAL_COPY = {
  heldReview: {
    en: "Historical data for College 1516 is currently held under review (booklet intake verification required). Comparison is withheld.",
    ta: "கல்லூரி 1516-ன் வரலாற்றுத் தரவு தற்காலிகமாக நிறுத்தி வைக்கப்பட்டுள்ளது (நடப்பு ஆண்டு மாணவர் சேர்க்கை சரிபார்ப்பு நிலுவையில் உள்ளது). ஒப்பீடு நிறுத்தி வைக்கப்பட்டுள்ளது.",
  },
  unknownRecord: {
    en: "No provisional allotment was reported for this exact college, programme, year, route, and category bucket in the official publications.",
    ta: "அதிகாரப்பூர்வ வெளியீடுகளில் இந்தக் குறிப்பிட்ட கல்லூரி, படிப்பு, ஆண்டு, பிரிவு மற்றும் ஒதுக்கீட்டிற்கு எந்தத் தற்காலிக ஒதுக்கீடும் பதிவாகவில்லை.",
  },
  noCutoffProvided: {
    en: "Provide your cutoff mark above to see the numerical difference (delta) against this historical minimum mark.",
    ta: "இந்த வரலாற்று குறைந்தபட்ச மதிப்பெண்ணுடன் எண்சார் வேறுபாட்டை (Delta) காண, மேலே உங்கள் கட்-ஆப் மதிப்பெண்ணை உள்ளிடவும்.",
  },
  disclaimer: {
    en: "Provisional historical marks are provided for transparent reference only. No chance calculation, admission probability, or safe/target classification is made.",
    ta: "தற்காலிக வரலாற்று மதிப்பெண்கள் வெளிப்படையான பார்வைக்கு மட்டுமே வழங்கப்படுகின்றன. சேர்க்கைக்கான வாய்ப்பு கணக்கீடோ அல்லது உறுதிமொழியோ வழங்கப்படுவதில்லை.",
  },
  comparisonTitle: {
    en: "Historical Provisional Minimum Mark Comparison",
    ta: "வரலாற்று தற்காலிக குறைந்தபட்ச மதிப்பெண் ஒப்பீடு",
  },
  roundLabel: {
    en: "Round",
    ta: "சுற்று",
  },
  allotmentsLabel: {
    en: "allotments in bucket",
    ta: "ஒதுக்கீடுகள்",
  },
  deltaLabel: {
    en: "Difference (Delta Δ)",
    ta: "மதிப்பெண் வேறுபாடு (Delta Δ)",
  },
  sourceLabel: {
    en: "Official Source",
    ta: "அதிகாரப்பூர்வ ஆதாரம்",
  },
} as const;

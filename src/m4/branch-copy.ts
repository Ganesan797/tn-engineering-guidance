/** Educational wording approval is independent of synthetic listing/link approval.
 * No loader or real-data adapter. The default registry is deliberately empty.
 * Owner preview is an offline review artifact, never a query-string permission.
 */
export interface ReviewedBranchCopy {
  readonly id: string;
  readonly version: string;
  readonly disposition: "HOLD" | "FIX" | "APPROVED";
  readonly copy: { readonly ta: string; readonly en: string };
  readonly evidence: { readonly url: string; readonly locator: string; readonly scope: string };
  readonly approval: null | {
    readonly version: string;
    readonly approved_copy: { readonly ta: string; readonly en: string };
    readonly approved_evidence: { readonly url: string; readonly locator: string; readonly scope: string };
    readonly owner: string;
    readonly factual: string;
    readonly ta: string;
    readonly en: string;
    readonly reference: string;
  };
}
const decisionReference = "review-evidence/m4-bounded-pilot/six-explanations-owner-decision.md#owner-decision--2026-11-01";
const decisionVersion = "M4-SIX-2026-11-01-3312406";
const affiliatedScope = "Anna University Regulations 2025, Revised 1 (2026); non-autonomous affiliated institutions only.";

function ownerApprovedCopy(
  id: string,
  copy: ReviewedBranchCopy["copy"],
  evidence: ReviewedBranchCopy["evidence"],
): ReviewedBranchCopy {
  return {
    id,
    version: decisionVersion,
    disposition: "APPROVED",
    copy,
    evidence,
    approval: {
      version: decisionVersion,
      approved_copy: copy,
      approved_evidence: evidence,
      owner: "Ganesan",
      factual: "PASS_OWNER_REPORTED 2026-11-01",
      ta: "PASS_OWNER_REPORTED 2026-11-01",
      en: "PASS_OWNER_REPORTED 2026-11-01",
      reference: decisionReference,
    },
  };
}

/** Exact owner-reported acceptance at commit 3312406. Association and variant
 * gates remain independent; the directory projection still attaches these only
 * through the previously approved L01-L09 snapshots. */
export const APPROVED_BRANCH_COPY: readonly ReviewedBranchCopy[] = [
  ownerApprovedCopy("CS", {
    ta: "ஒரு மருத்துவமனை முன்பதிவுச் செயலியை உருவாக்குவதாக நினைத்துப் பாருங்கள். பயனரின் தேவையைப் புரிந்து, தகவலை ஒழுங்குபடுத்தி, செயலி சரியாக வேலை செய்கிறதா என்று சோதிப்பது போன்ற சிக்கல்களை CSE-யில் அணுகலாம்.\nமேற்கோள் காட்டிய R2025 Revised 1 பாடத்திட்டத்தில் நிரலாக்கம், தரவுக் கட்டமைப்புகள், வழிமுறைகள், தரவுத்தளங்கள், இயக்க முறைமைகள் மற்றும் நெட்வொர்க்குகள் உள்ளன.\nஒரு சிறிய நிரலை எழுதிப் பிழையைத் திருத்துவது எப்படி இருக்கும் என்று யோசிக்கலாம். மேற்கோள் பாடத்திட்டத்தின் ஆய்வகம் மற்றும் திட்டப் பாடங்களைப் பாருங்கள்; உங்கள் கல்லூரியின் செய்முறை வாய்ப்புகள் தனியாகச் சரிபார்க்கப்பட வேண்டும்.\nஇந்த விளக்கம் தன்னாட்சி பெறாத இணைப்புக் கல்லூரிகளுக்கான குறிப்பிட்ட பாடத்திட்டத்தைச் சார்ந்தது. CEG/MIT அல்லது வேறு கல்லூரியின் பாடத்திட்டத்தை இதிலிருந்து ஊகிக்க வேண்டாம்.\nஅதே மூலத்தில் CSE-யையும் AI & Data Science-யையும் ஒப்பிட்டுப் பாருங்கள்; பிறகு நீங்கள் விரும்பும் கல்லூரியின் சரியான பாடத்திட்டத்தையும் 2026 பட்டியல் ஆதாரத்தையும் திறக்கவும்.",
    en: "Imagine building a hospital appointment app. CSE can help you think through user needs, organize information and test whether the app works.\nThe cited R2025 Revised 1 curriculum lists programming, data structures, algorithms, databases, operating systems and networks.\nConsider writing a small program and correcting an error. Explore the cited curriculum’s lab and project entries; check the particular college’s practical provision separately.\nThis describes a curriculum for non-autonomous affiliated institutions. It does not establish the curriculum at CEG, MIT or another college.\nCompare CSE and AI & Data Science in their cited curricula, then open the exact curriculum of a college you are considering and the 2026 listing evidence.",
  }, { url: "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/BE%20CSE.pdf", locator: "PDF pp3–4 and 6", scope: affiliatedScope }),
  ownerApprovedCopy("AD", {
    ta: "பல ஆண்டுகளின் மழைத்தரவுகளைப் பார்த்து ஒரு கேள்வி கேட்பதாகக் கற்பனை செய்யுங்கள். தரவைத் தயாரித்து, அதில் உள்ள முறைகளைத் தேடி, முடிவு எவ்வளவு நம்பகமானது என்று சோதிப்பது AI & Data Science-யின் ஒரு கற்றல் எடுத்துக்காட்டு.\nமேற்கோள் காட்டிய R2025 Revised 1 பாடத்திட்டத்தில் நிரலாக்கம், கணிதம், புள்ளியியல், தரவுப் பகுப்பாய்வு, தரவுத்தளங்கள் மற்றும் இயந்திரக் கற்றல் உள்ளன.\nஒரே தரவில் தவறான அல்லது விடுபட்ட மதிப்புகள் இருந்தால் முடிவு எப்படி மாறும் என்று ஆராயலாம். பாடத்திட்டத்தின் செய்முறை மற்றும் திட்டப் பாடங்களைப் பாருங்கள்; குறிப்பிட்ட கல்லூரியின் வசதிகளைத் தனியாகச் சரிபார்க்கவும்.\nதரவுத் தனியுரிமையும் கணிப்பின் வரம்புகளும் முக்கியம். இந்தக் குறிப்பிட்ட இணைப்புக் கல்லூரி பாடத்திட்டம் எந்தத் தனிக் கல்லூரியின் பாடத்திட்டத்தையோ முடிவின் துல்லியத்தையோ உறுதிப்படுத்தாது.\nCSE-யுடன் பொதுவான கணினிப் பாடங்களையும் AI/தரவு சார்ந்த பாடங்களையும் ஒப்பிட்டு, நீங்கள் பார்க்கும் கல்லூரியின் சரியான பாடத்திட்டத்தையும் 2026 பட்டியல் ஆதாரத்தையும் திறக்கவும்.",
    en: "Imagine asking a question of several years of rainfall data. Preparing the data, finding patterns and testing how reliable a result is offers one learning example for AI & Data Science.\nThe cited R2025 Revised 1 curriculum lists programming, mathematics, statistics, data analysis, databases and machine learning.\nExplore how missing or incorrect values change a result. Inspect the curriculum’s practical and project entries, then check a particular college’s facilities separately.\nData privacy and limits on estimates matter. This affiliated-institution curriculum establishes neither a particular college’s syllabus nor the accuracy of an estimate.\nCompare shared computing subjects with AI and data subjects in CSE, then open the exact college curriculum and 2026 listing evidence.",
  }, { url: "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/CSIE/B.Tech.%20AI%20and%20DS.pdf", locator: "PDF pp3–4", scope: affiliatedScope }),
  ownerApprovedCopy("BM", {
    ta: "இதயத் துடிப்பைக் கண்காணிக்கும் கருவியை நினைத்துப் பாருங்கள். உடலைப் பற்றிய அறிவும் மின்சுற்று, சென்சார் போன்ற பொறியியல் அறிவும் சேரும் பகுதியை உயிர்மருத்துவப் பொறியியல் அறிமுகப்படுத்துகிறது.\nமேற்கோள் காட்டிய R2025 Revised 1 பாடத்திட்டத்தில் உடலமைப்பு மற்றும் உடலியல், மின்சுற்றுகள், சென்சார்கள், மருத்துவக் கருவிகள் மற்றும் மருத்துவ நெறிமுறைகள் உள்ளன.\nஒரு சென்சார் அளவிடும் தகவலை எப்படிச் சரிபார்ப்பது என்று கேளுங்கள். பாடத்திட்டத்தின் ஆய்வகம் மற்றும் திட்டப் பாடங்களைப் பாருங்கள்; குறிப்பிட்ட கல்லூரியின் செய்முறை வாய்ப்புகளைத் தனியாகச் சரிபார்க்கவும்.\nஇது மருத்துவராக நோயாளிக்கு நேரடிச் சிகிச்சை அளிக்கும் படிப்பு அல்ல. மேற்கோள் பாடத்திட்டம் தன்னாட்சி பெறாத இணைப்புக் கல்லூரிகளுக்கானது; மற்ற கல்லூரிகளுக்கான உறுதி அல்ல.\nஉடலியல் மற்றும் கருவி சார்ந்த பாடங்களை ஒப்பிட்டுப் பார்த்து, நீங்கள் விரும்பும் கல்லூரியின் பாடத்திட்டத்தையும் 2026 படிப்புப் பட்டியல் ஆதாரத்தையும் திறக்கவும்.",
    en: "Think of a device that monitors a heartbeat. Biomedical engineering brings together knowledge of the body with engineering ideas such as circuits and sensors.\nThe cited R2025 Revised 1 curriculum lists anatomy and physiology, circuits, sensors, medical instruments and medical ethics.\nAsk how a sensor’s measurement could be checked. Explore the curriculum’s lab and project entries, and verify practical opportunities at the particular college.\nThis is not a qualification to treat patients as a doctor. The cited curriculum applies to non-autonomous affiliated institutions and does not establish another college’s syllabus.\nCompare the body-related and instrument-related subjects, then open the selected college’s curriculum and 2026 programme-listing evidence.",
  }, { url: "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/ECE/B.E.%20Biomedical.pdf", locator: "PDF pp2–4", scope: affiliatedScope }),
  ownerApprovedCopy("CE", {
    ta: "ஒரு பாலம் அல்லது நீர் அமைப்பு எப்படி திட்டமிடப்படுகிறது என்று யோசியுங்கள். கட்டடங்கள், சாலைகள், நிலம், நீர் மற்றும் கட்டமைப்புகளைப் புரிந்துகொள்ளும் துறை Civil Engineering.\nமேற்கோள் காட்டிய R2025 Revised 1 பாடத்திட்டத்தில் கட்டுமானம், நில அளவீடு, மண் பொறியியல், நீர் வழங்கல் மற்றும் கட்டமைப்புப் பகுப்பாய்வு உள்ளன.\nஒரு இடத்தின் அளவுகளை வரைபடமாக மாற்றுவது அல்லது பொருளின் வலிமையைச் சோதிப்பது எப்படி என்று ஆராயலாம். பாடத்திட்டத்தின் ஆய்வகம்/செய்முறைப் பகுதிகளையும் குறிப்பிட்ட கல்லூரியின் ஏற்பாடுகளையும் தனித்தனியாகப் பாருங்கள்.\nஒரு திட்டத்தைப் புரிந்துகொள்ள கணிதம், அளவீடு, பாதுகாப்பு மற்றும் சூழல் பற்றியும் சிந்திக்க வேண்டும். மேற்கோள் பாடத்திட்டம் எல்லாக் கல்லூரிகளுக்கும் ஒரே மாதிரி அல்ல.\nCivil மற்றும் Environmental Engineering பாடங்களை ஒப்பிட்டு, நீங்கள் பார்க்கும் கல்லூரியின் சரியான பாடத்திட்டத்தையும் 2026 பட்டியல் ஆதாரத்தையும் திறக்கவும்.",
    en: "Think about how a bridge or water system is planned. Civil Engineering studies buildings, roads, land, water and structures.\nThe cited R2025 Revised 1 curriculum lists construction, surveying, soil mechanics, water supply and structural analysis.\nExplore how measurements become a drawing or how material strength is tested. Inspect curriculum practical entries and the particular college’s arrangements separately.\nMathematics, measurement, safety and environment all matter in understanding a project. The cited curriculum does not establish the same syllabus at every college.\nCompare Civil and Environmental Engineering subjects, then open the exact curriculum of the college you are considering and its 2026 listing evidence.",
  }, { url: "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/Civil/B.E.%20Civil%20Engineering%20.pdf", locator: "PDF pp3–4", scope: affiliatedScope }),
  ownerApprovedCopy("EC", {
    ta: "ஒரு கைபேசி அனுப்பும் தகவல் மறுபுறம் எப்படி சேர்கிறது என்று யோசித்துப் பாருங்கள். மின்சுற்றுகள், சமிக்ஞைகள் மற்றும் தகவல் தொடர்பு அமைப்புகளைப் புரிந்துகொள்ள ECE உதவுகிறது.\nமேற்கோள் காட்டிய R2025 Revised 1 பாடத்திட்டத்தில் மின்சுற்றுகள், டிஜிட்டல் அமைப்புகள், சமிக்ஞைகள், மைக்ரோகன்ட்ரோலர்கள் மற்றும் தகவல் தொடர்பு உள்ளன.\nஒரு சமிக்ஞையை அளந்து அதன் மாற்றத்தைப் பார்ப்பது எப்படி என்று ஆராயலாம். பாடத்திட்டத்தின் ஆய்வகம் மற்றும் திட்டப் பகுதிகளைப் பாருங்கள்; குறிப்பிட்ட கல்லூரியின் கருவி வசதிகளைத் தனியாகச் சரிபார்க்கவும்.\nசமிக்ஞை என்பது தகவலை எடுத்துச் செல்லும் மின்சார அல்லது வேறு மாற்றமாக இருக்கலாம். இந்த விளக்கம் மேற்கோள் இணைப்புக் கல்லூரி பாடத்திட்டத்தின் வரம்புக்குள் மட்டுமே.\nECE-யின் சமிக்ஞை/தகவல் தொடர்புப் பாடங்களை EEE-யின் மின்சக்தி/இயந்திரப் பாடங்களுடன் ஒப்பிட்டு, கல்லூரியின் சரியான பாடத்திட்டத்தையும் 2026 பட்டியல் ஆதாரத்தையும் திறக்கவும்.",
    en: "Think about how information sent by a phone reaches the other end. ECE studies circuits, signals and communication systems involved in that question.\nThe cited R2025 Revised 1 curriculum lists circuits, digital systems, signals, microcontrollers and communication.\nExplore how a signal could be measured and observed as it changes. Inspect lab and project entries, and check equipment at the particular college separately.\nA signal can be an electrical or other changing quantity that carries information. This explanation is limited to the cited affiliated-institution curriculum.\nCompare ECE’s signal and communication subjects with EEE’s power and machine subjects, then open the college’s exact curriculum and 2026 listing evidence.",
  }, { url: "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/ECE/B.E%20ECE.pdf", locator: "PDF pp3–4", scope: affiliatedScope }),
  ownerApprovedCopy("EE", {
    ta: "ஒரு தொழிற்சாலையின் மின்மோட்டாரும் அதை இயக்கும் கட்டுப்பாட்டு அமைப்பும் எப்படி செயல்படுகின்றன என்று நினைத்துப் பாருங்கள். மின்சுற்றுகள், மின்னணுக் கூறுகள், மின் இயந்திரங்கள் மற்றும் மின்சக்தியை EEE இணைத்துப் படிக்கிறது.\nமேற்கோள் காட்டிய R2025 Revised 1 பாடத்திட்டத்தில் மின்சுற்றுகள், மின்னணுவியல், மின்சாரம் கடத்தல், மின்மாற்றிகள், மின் இயந்திரங்கள் மற்றும் கட்டுப்பாட்டு அமைப்புகள் உள்ளன.\nமோட்டாரின் வேகம் அல்லது ஒரு மின்சுற்றின் அளவுகளை எப்படி அளப்பது என்று ஆராயலாம். பாடத்திட்டத்தில் உள்ள ஆய்வகம்/திட்டப் பகுதிகளையும் குறிப்பிட்ட கல்லூரியின் செய்முறை ஏற்பாடுகளையும் தனித்தனியாகப் பாருங்கள்.\nEEE மின்சக்தி மட்டும் அல்ல; மின்னணுவியல் மற்றும் கட்டுப்பாடும் இதில் உள்ளன. மேற்கோள் பாடத்திட்டம் தன்னாட்சி பெறாத இணைப்புக் கல்லூரிகளுக்கானது; எல்லாக் கல்லூரிகளுக்கும் உறுதி அல்ல.\nEEE மற்றும் ECE பாடப் பட்டியல்களை ஒப்பிட்டு, நீங்கள் பார்க்கும் கல்லூரியின் சரியான பாடத்திட்டத்தையும் 2026 பட்டியல் ஆதாரத்தையும் திறக்கவும்.",
    en: "Imagine a factory motor and the system that controls it. EEE brings together circuits, electronic devices, electrical machines and power systems.\nThe cited R2025 Revised 1 curriculum lists circuits, electronics, transmission, transformers, electrical machines and control systems.\nExplore how motor speed or a circuit quantity might be measured. Inspect the curriculum’s lab/project entries and the particular college’s arrangements separately.\nEEE includes electronics and control as well as power. The cited curriculum is for non-autonomous affiliated institutions and does not establish every college’s syllabus.\nCompare EEE and ECE course lists, then open the exact curriculum of the college you are considering and the 2026 listing evidence.",
  }, { url: "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/EEE/B.E.%20EEE.pdf", locator: "PDF pp3–5", scope: affiliatedScope }),
];

const present = (s: string) => typeof s === "string" && s.trim().length > 0;

export type ProfileApprovalDimension =
  | "OWNER_APPROVED"
  | "HUMAN_TAMIL_APPROVED"
  | "FACTUAL_REVIEW_APPROVED"
  | "PROFILE_IDENTITY_APPROVED"
  | "DISPLAY_APPROVED";

export type ProfileHoldReason =
  | "IDENTITY_HOLD"
  | "EVIDENCE_HOLD"
  | "EXPLICIT_SCOPE_HOLD"
  | "NEEDS_OWNER_REVIEW"
  | "UNAPPROVED";

export interface BranchApprovalStatus {
  readonly ownerApproved: boolean;
  readonly humanTamilApproved: boolean;
  readonly factualReviewApproved: boolean;
  readonly profileIdentityApproved: boolean;
  readonly displayApproved: boolean;
  readonly holdReason: ProfileHoldReason | null;
}

export const SCOPE_HELD_CODES: ReadonlySet<string> = new Set(["BP", "DA", "CQ", "IF", "ID", "CJ"]);
export const EVIDENCE_HELD_CODES: ReadonlySet<string> = new Set(["CA", "ER", "MT", "SF", "TC"]);
export const IDENTITY_HELD_CODES: ReadonlySet<string> = new Set([
  "AE", "AI", "AL", "AO", "AP", "BC", "CB", "CG", "CR", "CU", "CV", "CW", "CY", "CZ", "DS",
  "DV", "EA", "EG", "GI", "GL", "IB", "IE", "LE", "MA", "MB", "MG", "MI", "MJ", "MM", "MO",
  "PA", "PP", "PR", "PT", "RP", "SB", "TS", "VL", "BY", "XC", "IM", "MS", "MF", "XM", "CL",
  "BS", "TT"
]);
export const KNOWN_OWNER_APPROVED_CODES: ReadonlySet<string> = new Set(["CS", "AD", "BM", "CE", "EC", "EE"]);
export const READY_FOR_OWNER_REVIEW_CODES: ReadonlySet<string> = new Set([
  "AG", "AM", "AU", "BT", "CC", "CD", "CF", "CH", "CI", "CK", "CO", "EF", "EI", "EN", "EV",
  "EX", "FD", "FT", "HT", "IC", "IN", "IT", "MD", "ME", "MN", "MR", "MU", "MZ", "PC", "PE",
  "PH", "RI", "RM", "SC", "TX"
]);

export function evaluateBranchApproval(
  id: string,
  profile?: ReviewedBranchCopy | null,
): BranchApprovalStatus {
  if (SCOPE_HELD_CODES.has(id)) {
    return {
      ownerApproved: false,
      humanTamilApproved: false,
      factualReviewApproved: false,
      profileIdentityApproved: false,
      displayApproved: false,
      holdReason: "EXPLICIT_SCOPE_HOLD",
    };
  }
  if (EVIDENCE_HELD_CODES.has(id)) {
    return {
      ownerApproved: false,
      humanTamilApproved: false,
      factualReviewApproved: false,
      profileIdentityApproved: false,
      displayApproved: false,
      holdReason: "EVIDENCE_HOLD",
    };
  }
  if (IDENTITY_HELD_CODES.has(id)) {
    return {
      ownerApproved: false,
      humanTamilApproved: false,
      factualReviewApproved: false,
      profileIdentityApproved: false,
      displayApproved: false,
      holdReason: "IDENTITY_HOLD",
    };
  }
  if (READY_FOR_OWNER_REVIEW_CODES.has(id)) {
    return {
      ownerApproved: false,
      humanTamilApproved: false,
      factualReviewApproved: false,
      profileIdentityApproved: true,
      displayApproved: false,
      holdReason: "NEEDS_OWNER_REVIEW",
    };
  }
  if (!profile) {
    return {
      ownerApproved: false,
      humanTamilApproved: false,
      factualReviewApproved: false,
      profileIdentityApproved: false,
      displayApproved: false,
      holdReason: "UNAPPROVED",
    };
  }

  const a = profile.approval;
  const ownerApproved = profile.disposition === "APPROVED" && !!a && present(a.owner) && a.owner !== "UNREVIEWED" && present(a.reference);
  const humanTamilApproved = !!a && present(a.ta) && !a.ta.includes("UNREVIEWED");
  const factualReviewApproved = !!a && present(a.factual) && !a.factual.includes("UNREVIEWED");
  const englishApproved = !!a && present(a.en) && !a.en.includes("UNREVIEWED");
  const profileIdentityApproved = present(profile.id) && !IDENTITY_HELD_CODES.has(profile.id) && !SCOPE_HELD_CODES.has(profile.id);

  if (!KNOWN_OWNER_APPROVED_CODES.has(id) && (!ownerApproved || a?.reference === "TEST_ONLY" || a?.reference === "synthetic-review-only")) {
    const isReadyForReview = READY_FOR_OWNER_REVIEW_CODES.has(id);
    return {
      ownerApproved: false,
      humanTamilApproved,
      factualReviewApproved,
      profileIdentityApproved,
      displayApproved: false,
      holdReason: isReadyForReview ? "NEEDS_OWNER_REVIEW" : "UNAPPROVED",
    };
  }

  const validEvidence = (() => {
    try {
      const url = new URL(profile.evidence.url);
      return url.protocol === "https:" && !url.username && !url.password && !url.hostname.endsWith(".test");
    } catch {
      return false;
    }
  })();

  const copyValid = [profile.copy.ta, profile.copy.en].every(c => c.split("\n").length === 5 && c.split("\n").every(present));
  const exactMatch = !!a && a.version === profile.version && present(a.version) && present(a.reference)
    && a.approved_copy.ta === profile.copy.ta && a.approved_copy.en === profile.copy.en
    && !!a.approved_evidence && a.approved_evidence.url === profile.evidence.url
    && a.approved_evidence.locator === profile.evidence.locator && a.approved_evidence.scope === profile.evidence.scope;

  const displayApproved = ownerApproved && humanTamilApproved && englishApproved && factualReviewApproved && profileIdentityApproved && validEvidence && copyValid && exactMatch;

  return {
    ownerApproved,
    humanTamilApproved,
    factualReviewApproved,
    profileIdentityApproved,
    displayApproved,
    holdReason: displayApproved ? null : "UNAPPROVED",
  };
}

export function isReleasedBranchCopy(profile: ReviewedBranchCopy): boolean {
  if (!profile) return false;
  return evaluateBranchApproval(profile.id, profile).displayApproved;
}

export function selectBranchCopy(id: string, illustrative: { readonly ta: string; readonly en: string }, registry: readonly ReviewedBranchCopy[] = APPROVED_BRANCH_COPY) {
  const matches = registry.filter(p => p.id === id);
  const profile = matches.length === 1 && isReleasedBranchCopy(matches[0]) ? matches[0] : null;
  return profile ? { kind: "REVIEWED_EDUCATIONAL" as const, copy: profile.copy, evidence: profile.evidence }
    : { kind: "SYNTHETIC_ILLUSTRATION" as const, copy: illustrative, evidence: null };
}

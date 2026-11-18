import {
  HISTORICAL_OBSERVATIONS,
  compareOffering,
  getComparisonCopy,
  getCounsellingGuidance,
  formatShortlistPlainText,
  formatShortlistCsv,
  createShortlistItem,
  type AllotmentRound,
  type CommunityCategory,
  type ComparisonResult,
  type GovernedOffering,
  type QuotaStream,
  type ShortlistState,
  type SupportedLanguage,
} from "../m5/index.ts";
import { renderSiteHeader, SITE_SHELL_CSS } from "./site-shell.ts";

const esc = (v: string) =>
  v
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// College cohort metadata for the 55 approved institutions
export interface CollegeMeta {
  code: string;
  name: string;
  type: "GOVERNMENT" | "UNIVERSITY" | "AIDED" | "CONSTITUENT" | "SFC";
  district: string;
  aliases: readonly string[];
}

export const COHORT_55_METADATA: Record<string, CollegeMeta> = {
  // 11 Govt
  "1516": { code: "1516", name: "Thanthai Periyar Government Institute of Technology, Vellore", type: "GOVERNMENT", district: "Vellore", aliases: ["TPGIT", "TPGIT Vellore"] },
  "2005": { code: "2005", name: "Government College of Technology, Coimbatore", type: "GOVERNMENT", district: "Coimbatore", aliases: ["GCT", "GCT Coimbatore"] },
  "2369": { code: "2369", name: "Government College of Engineering, Dharmapuri", type: "GOVERNMENT", district: "Dharmapuri", aliases: ["GCED", "GCE Dharmapuri"] },
  "2603": { code: "2603", name: "Government College of Engineering, Salem", type: "GOVERNMENT", district: "Salem", aliases: ["GCES", "GCE Salem"] },
  "2615": { code: "2615", name: "Government College of Engineering, Srirangam, Tiruchirappalli", type: "GOVERNMENT", district: "Tiruchirappalli", aliases: ["GCE Srirangam", "GCE Trichy", "GCET"] },
  "2709": { code: "2709", name: "Government College of Engineering, Erode (IRTT)", type: "GOVERNMENT", district: "Erode", aliases: ["IRTT", "GCE Erode", "IRT Tech"] },
  "3464": { code: "3464", name: "Government College of Engineering, Thanjavur", type: "GOVERNMENT", district: "Thanjavur", aliases: ["GCET", "GCE Thanjavur"] },
  "3465": { code: "3465", name: "Government College of Engineering, Gandharvakottai", type: "GOVERNMENT", district: "Pudukkottai", aliases: ["GCE Gandharvakottai", "GCE Pudukkottai"] },
  "4974": { code: "4974", name: "Government College of Engineering, Tirunelveli", type: "GOVERNMENT", district: "Tirunelveli", aliases: ["GCETLY", "GCE Tirunelveli", "GCE Nellai"] },
  "5009": { code: "5009", name: "Government College of Engineering, Bodinayakkanur", type: "GOVERNMENT", district: "Theni", aliases: ["GCE Bodinayakkanur", "GCE Bodi", "GCE Theni"] },
  "5901": { code: "5901", name: "Alagappa Chettiar Government College of Engineering and Technology, Karaikudi", type: "GOVERNMENT", district: "Sivaganga", aliases: ["ACGCET", "ACCET", "ACCET Karaikudi"] },
  // 5 Univ Depts
  "1": { code: "1", name: "College of Engineering Guindy (CEG), Anna University, Chennai", type: "UNIVERSITY", district: "Chennai", aliases: ["CEG", "CEG Guindy", "Anna University Guindy"] },
  "2": { code: "2", name: "Alagappa College of Technology (ACT), Anna University, Chennai", type: "UNIVERSITY", district: "Chennai", aliases: ["ACT", "ACTech", "AC Tech"] },
  "3": { code: "3", name: "School of Architecture and Planning (SAP), Anna University, Chennai", type: "UNIVERSITY", district: "Chennai", aliases: ["SAP", "SAP Chennai"] },
  "4": { code: "4", name: "Madras Institute of Technology (MIT), Anna University, Chromepet", type: "UNIVERSITY", district: "Chengalpattu", aliases: ["MIT", "MIT Chromepet", "MIT Chennai"] },
  "5": { code: "5", name: "Faculty of Engineering & Technology, Annamalai University, Chidambaram", type: "UNIVERSITY", district: "Cuddalore", aliases: ["FEAT", "FEAT Annamalai", "Annamalai University"] },
  // 3 Govt Aided
  "2006": { code: "2006", name: "PSG College of Technology, Peelamedu, Coimbatore", type: "AIDED", district: "Coimbatore", aliases: ["PSG", "PSG Tech", "PSGCT"] },
  "2007": { code: "2007", name: "Coimbatore Institute of Technology, Civil Aerodrome Post, Coimbatore", type: "AIDED", district: "Coimbatore", aliases: ["CIT", "CIT Coimbatore"] },
  "5008": { code: "5008", name: "Thiagarajar College of Engineering, Madurai", type: "AIDED", district: "Madurai", aliases: ["TCE", "TCE Madurai", "Thiagarajar"] },
  // 16 Constituent
  "1013": { code: "1013", name: "University College of Engineering, Villupuram", type: "CONSTITUENT", district: "Villupuram", aliases: ["UCEV", "UCE Villupuram"] },
  "1014": { code: "1014", name: "University College of Engineering, Tindivanam", type: "CONSTITUENT", district: "Villupuram", aliases: ["UCET", "UCE Tindivanam"] },
  "1015": { code: "1015", name: "University College of Engineering, Arni", type: "CONSTITUENT", district: "Tiruvannamalai", aliases: ["UCEA", "UCE Arni"] },
  "1026": { code: "1026", name: "University College of Engineering, Kancheepuram", type: "CONSTITUENT", district: "Kancheepuram", aliases: ["UCEK", "UCE Kancheepuram", "UCE Kanchi"] },
  "2025": { code: "2025", name: "Anna University Regional Campus, Coimbatore", type: "CONSTITUENT", district: "Coimbatore", aliases: ["AURCC", "AURC Coimbatore"] },
  "3011": { code: "3011", name: "University College of Engineering, Tiruchirappalli (BIT Campus)", type: "CONSTITUENT", district: "Tiruchirappalli", aliases: ["BIT", "BIT Campus", "BIT Trichy", "UCE Trichy", "UCE Tiruchirappalli"] },
  "3016": { code: "3016", name: "University College of Engineering, Ariyalur", type: "CONSTITUENT", district: "Ariyalur", aliases: ["UCE Ariyalur"] },
  "3018": { code: "3018", name: "University College of Engineering, Nagercoil", type: "CONSTITUENT", district: "Kanyakumari", aliases: ["UCEN", "UCE Nagercoil"] },
  "3019": { code: "3019", name: "University College of Engineering, Panruti", type: "CONSTITUENT", district: "Cuddalore", aliases: ["UCE Panruti"] },
  "3021": { code: "3021", name: "University College of Engineering, Pattukkottai", type: "CONSTITUENT", district: "Thanjavur", aliases: ["UCE Pattukkottai"] },
  "4020": { code: "4020", name: "Anna University Regional Campus, Tirunelveli", type: "CONSTITUENT", district: "Tirunelveli", aliases: ["AURCT", "AURC Tirunelveli"] },
  "4023": { code: "4023", name: "University College of Engineering, Ramanathapuram", type: "CONSTITUENT", district: "Ramanathapuram", aliases: ["UCER", "UCE Ramanathapuram", "UCE Ramnad"] },
  "4024": { code: "4024", name: "University College of Engineering, Dindigul", type: "CONSTITUENT", district: "Dindigul", aliases: ["UCED", "UCE Dindigul"] },
  "5010": { code: "5010", name: "Anna University Regional Campus, Madurai", type: "CONSTITUENT", district: "Madurai", aliases: ["AURCM", "AURC Madurai"] },
  "5017": { code: "5017", name: "University College of Engineering, Thirukkuvalai", type: "CONSTITUENT", district: "Nagapattinam", aliases: ["UCE Thirukkuvalai"] },
  "5022": { code: "5022", name: "University College of Engineering, Thoothukudi", type: "CONSTITUENT", district: "Thoothukudi", aliases: ["UCE Thoothukudi", "UCE Tuticorin", "VOC", "VOC College", "VOC Thoothukudi", "VOC Tuticorin"] },
  // 20 SFC
  "1113": { code: "1113", name: "R.M.K. Engineering College, Gummidipoondi, Tiruvallur", type: "SFC", district: "Tiruvallur", aliases: ["RMK", "RMKEC"] },
  "1120": { code: "1120", name: "Velammal Engineering College, Ambattur, Chennai", type: "SFC", district: "Chennai", aliases: ["VEC", "VEC Chennai"] },
  "1211": { code: "1211", name: "Rajalakshmi Engineering College, Thandalam, Sriperumbudur", type: "SFC", district: "Kancheepuram", aliases: ["REC", "REC Chennai", "Rajalakshmi"] },
  "1219": { code: "1219", name: "Sri Venkateswara College of Engineering, Pennalur, Sriperumbudur", type: "SFC", district: "Kancheepuram", aliases: ["SVCE", "SVCE Sriperumbudur"] },
  "1304": { code: "1304", name: "Easwari Engineering College, Ramapuram, Chennai", type: "SFC", district: "Chennai", aliases: ["EEC", "Easwari"] },
  "1317": { code: "1317", name: "St. Joseph's College of Engineering, OMR, Chennai", type: "SFC", district: "Chennai", aliases: ["SJCE", "St Josephs", "St Joseph"] },
  "1399": { code: "1399", name: "Chennai Institute of Technology, Kundrathur, Chennai", type: "SFC", district: "Chennai", aliases: ["CIT", "CIT Chennai", "CIT Kundrathur"] },
  "1419": { code: "1419", name: "Sri Sai Ram Engineering College, West Tambaram, Chennai", type: "SFC", district: "Kancheepuram", aliases: ["SEC", "SSREC", "Sairam", "Sai Ram", "Sri Sai Ram"] },
  "1422": { code: "1422", name: "SRM Valliammai Engineering College, Kattankulathur", type: "SFC", district: "Chengalpattu", aliases: ["SRMVEC", "Valliammai"] },
  "1450": { code: "1450", name: "Loyola-ICAM College of Engineering and Technology (LICET), Chennai", type: "SFC", district: "Chennai", aliases: ["LICET", "Loyola ICAM", "Loyola"] },
  "2377": { code: "2377", name: "PSG Institute of Technology and Applied Research, Neelambur, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["PSG", "PSG iTech", "PSGITECH", "PSG IT"] },
  "2607": { code: "2607", name: "K.S. Rangasamy College of Technology, Tiruchengode, Namakkal", type: "SFC", district: "Namakkal", aliases: ["KSRCT", "KSR"] },
  "2618": { code: "2618", name: "Sona College of Technology, Suramangalam, Salem", type: "SFC", district: "Salem", aliases: ["SCT", "Sona"] },
  "2702": { code: "2702", name: "Bannari Amman Institute of Technology, Sathyamangalam, Erode", type: "SFC", district: "Erode", aliases: ["BIT", "BIT Sathy", "Bannari", "BAIT"] },
  "2711": { code: "2711", name: "Kongu Engineering College, Perundurai, Erode", type: "SFC", district: "Erode", aliases: ["KEC", "Kongu"] },
  "2712": { code: "2712", name: "Kumaraguru College of Technology, Chinnavedampatti, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["KCT", "Kumaraguru"] },
  "2718": { code: "2718", name: "Sri Krishna College of Engineering and Technology, Kuniamuthur, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["SKCET", "Krishna"] },
  "2719": { code: "2719", name: "Sri Ramakrishna Engineering College, Vattamalaipalayam, Coimbatore", type: "SFC", district: "Coimbatore", aliases: ["SREC", "Ramakrishna"] },
  "4960": { code: "4960", name: "Mepco Schlenk Engineering College, Sivakasi, Virudhunagar", type: "SFC", district: "Virudhunagar", aliases: ["Mepco", "MSEC"] },
  "5986": { code: "5986", name: "Velammal College of Engineering and Technology, Madurai", type: "SFC", district: "Madurai", aliases: ["VCET", "VCET Madurai"] },
};

export const SEARCH_ALIASES: Record<string, string> = {
  engg: "engineering",
  eng: "engineering",
  inst: "institute",
  univ: "university",
  dept: "department",
  col: "college",
  cse: "computer science",
  ece: "electronics and communication",
  eee: "electrical and electronics",
  mech: "mechanical",
  civil: "civil",
  aids: "artificial intelligence",
  aiml: "machine learning",
  ai: "artificial intelligence",
  ml: "machine learning",
  ds: "data science",
  it: "information technology",
  biotech: "biotechnology",
  bme: "biomedical",
  aero: "aeronautical",
  auto: "automobile",
  govt: "government",
  cs: "computer science",
  ec: "electronics and communication",
  ee: "electrical and electronics",
  me: "mechanical",
  ce: "civil",
  cyber: "cyber security",
  csbs: "business systems",
  chem: "chemical",
  ch: "chemical",
  prod: "production",
  pr: "production",
  agri: "agricultural",
  ag: "agricultural",
  textile: "textile",
  tx: "textile",
  food: "food technology",
  ft: "food technology",
  robo: "robotics",
  robotics: "robotics",
  aided: "aided",
  trichy: "tiruchirappalli",
  nellai: "tirunelveli",
  tuticorin: "thoothukudi",
  ramnad: "ramanathapuram",
  kanchi: "kancheepuram",
  sathy: "sathyamangalam",
  // Tamil district & location queries
  "சென்னை": "chennai",
  "மதராஸ்": "chennai",
  "கோவை": "coimbatore",
  "கோயம்புத்தூர்": "coimbatore",
  "மதுரை": "madurai",
  "திருச்சி": "tiruchirappalli",
  "திருச்சிராப்பள்ளி": "tiruchirappalli",
  "சேலம்": "salem",
  "நெல்லை": "tirunelveli",
  "திருநெல்வேலி": "tirunelveli",
  "வேலூர்": "vellore",
  "ஈரோடு": "erode",
  "திண்டுக்கல்": "dindigul",
  "தஞ்சாவூர்": "thanjavur",
  "தஞ்சை": "thanjavur",
  "தருமபுரி": "dharmapuri",
  "தர்மபுரி": "dharmapuri",
  "தூத்துக்குடி": "thoothukudi",
  "கன்னியாகுமரி": "kanyakumari",
  "நாகர்கோவில்": "kanyakumari",
  "விழுப்புரம்": "villupuram",
  "திண்டிவனம்": "villupuram",
  "காஞ்சிபுரம்": "kancheepuram",
  "காஞ்சி": "kancheepuram",
  "செங்கல்பட்டு": "chengalpattu",
  "குரோம்பேட்டை": "chengalpattu",
  "திருவள்ளூர்": "tiruvallur",
  "விருதுநகர்": "virudhunagar",
  "சிவகாசி": "virudhunagar",
  "சிவகங்கை": "sivaganga",
  "காரைக்குடி": "sivaganga",
  "புதுக்கோட்டை": "pudukkottai",
  "தேனி": "theni",
  "போடி": "theni",
  "போடிநாயக்கனூர்": "theni",
  "நாமக்கல்": "namakkal",
  "திருச்செங்கோடு": "namakkal",
  "அரியலூர்": "ariyalur",
  "நாகப்பட்டினம்": "nagapattinam",
  "திருக்குவளை": "nagapattinam",
  "ராமநாதபுரம்": "ramanathapuram",
  "கடலூர்": "cuddalore",
  "சிதம்பரம்": "cuddalore",
  "பண்ருட்டி": "cuddalore",
  "திருவண்ணாமலை": "tiruvannamalai",
  "ஆரணி": "tiruvannamalai",
  // Tamil branch & keyword queries
  "கணினி": "computer science",
  "கம்ப்யூட்டர்": "computer science",
  "மெக்கானிக்கல்": "mechanical",
  "சிவில்": "civil",
  "எலக்ட்ரானிக்ஸ்": "electronics",
  "எலக்ட்ரிக்கல்": "electrical",
  "செயற்கை": "artificial",
  "நுண்ணறிவு": "intelligence",
  "தகவல்": "information",
  "தொழில்நுட்பம்": "technology",
  "அரசு": "government",
};

export function matchesOfferingSearch(
  college: CollegeMeta,
  off: GovernedOffering,
  query: string
): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;

  // Direct TNEA choice syntax: "1~CS", "2006~EC", "2005~ME"
  if (q.includes("~")) {
    const [qCol, qProg] = q.split("~").map((s) => s.trim().toLowerCase());
    if (qCol && qProg) {
      return (
        college.code.toLowerCase() === qCol &&
        off.programmeCode.toLowerCase() === qProg
      );
    }
  }

  const aliasStr = (college.aliases ?? []).join(" ");
  const comboStr = `${college.code}~${off.programmeCode}`;
  const directText = `${college.code} ${comboStr} ${college.name} ${aliasStr} ${off.programmeCode} ${off.programmeName} ${college.district}`.toLowerCase();
  if (directText.includes(q)) return true;

  const rawTokens = q.split(/[\s,+/~-]+/).filter(Boolean);
  if (rawTokens.length > 0) {
    const normalizedTokens = rawTokens.map((tok) => SEARCH_ALIASES[tok] || tok);
    const words = directText.split(/[\s~,()·.-]+/).filter(Boolean);

    return normalizedTokens.every((tok) => {
      if (/^\d+$/.test(tok)) {
        return college.code === tok || words.includes(tok);
      }
      return directText.includes(tok);
    });
  }

  return false;
}

export interface M5GuidanceRenderOptions {
  studentCutoff?: number | null;
  quota?: QuotaStream;
  community?: CommunityCategory;
  round?: AllotmentRound;
  communitySelected?: boolean;
}

export function renderM5GuidancePage(
  params: URLSearchParams,
  inputState: M5GuidanceRenderOptions = {}
): string {
  const lang: SupportedLanguage = params.get("lang") === "ta" ? "ta" : "en";
  const activeTab = params.get("tab") ?? "comparison";
  const copy = getComparisonCopy(lang);
  const guidance = getCounsellingGuidance(lang);

  // Sensitive student inputs are ONLY read from inputState (POST body in-memory);
  // they are NEVER read from GET params.
  const studentCutoff =
    typeof inputState.studentCutoff === "number" &&
    !isNaN(inputState.studentCutoff) &&
    inputState.studentCutoff >= 0 &&
    inputState.studentCutoff <= 200
      ? inputState.studentCutoff
      : null;

  const quota: QuotaStream =
    inputState.quota === "GOVT_SCHOOL_7_5" ? "GOVT_SCHOOL_7_5" : "GENERAL_ACADEMIC";

  const community: CommunityCategory =
    inputState.community &&
    ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"].includes(inputState.community)
      ? (inputState.community as CommunityCategory)
      : "OC";

  const communitySelected = inputState.communitySelected ?? inputState.community !== undefined;

  const round: AllotmentRound =
    inputState.round && ["ROUND_1", "ROUND_2", "ROUND_3"].includes(inputState.round)
      ? (inputState.round as AllotmentRound)
      : quota === "GOVT_SCHOOL_7_5"
      ? "ROUND_1"
      : "ROUND_2";

  // Non-sensitive navigation / search filters from URL
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const typeFilter = params.get("type") ?? "all";

  // Load ALL 555 governed offerings
  const governedOfferings = HISTORICAL_OBSERVATIONS.getAllGovernedOfferings();

  // Evaluate comparison for each offering
  const evaluatedRows: Array<{
    college: CollegeMeta;
    offering: GovernedOffering;
    result: ComparisonResult;
  }> = [];

  for (const off of governedOfferings) {
    const college = COHORT_55_METADATA[off.collegeCode] ?? {
      code: off.collegeCode,
      name: `College ${off.collegeCode}`,
      type: "GOVERNMENT",
      district: "Tamil Nadu",
      aliases: [],
    };

    // Filter by type
    if (typeFilter !== "all" && college.type !== typeFilter) continue;

    // Filter by search query
    if (query && !matchesOfferingSearch(college, off, query)) continue;

    const result = compareOffering({
      studentCutoff,
      year: 2025,
      stage: "PROVISIONAL_ALLOTMENT",
      round,
      quota,
      community,
      collegeCode: off.collegeCode,
      programmeCode: off.programmeCode,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    });

    evaluatedRows.push({
      college,
      offering: off,
      result,
    });
  }

  // Neutral default sort: alphabetical by college name, then branch code
  evaluatedRows.sort((a, b) => {
    const c = a.college.name.localeCompare(b.college.name);
    return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
  });

  // Shortlist state from URL params (choice IDs only, zero marks)
  const rawShortlist = params.get("shortlist") ?? "";
  const shortIds = rawShortlist.split(",").filter(Boolean);

  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);

  // Language toggle parameters (strictly non-sensitive navigation parameters only)
  const makeLangUrl = (target: SupportedLanguage) => {
    const p = new URLSearchParams();
    p.set("tab", activeTab);
    p.set("lang", target);
    if (query) p.set("q", query);
    if (typeFilter !== "all") p.set("type", typeFilter);
    if (rawShortlist) p.set("shortlist", rawShortlist);
    return `?${p.toString()}`;
  };

  const langControl =
    lang === "ta"
      ? `<span lang="ta" aria-current="page">தமிழ்</span><a class="lang-switch" lang="en" href="${esc(makeLangUrl("en"))}">English</a>`
      : `<a class="lang-switch" lang="ta" href="${esc(makeLangUrl("ta"))}">தமிழ்</a><span lang="en" aria-current="page">English</span>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(copy.title)} | TN Engineering Guidance</title>
  <style>
    ${SITE_SHELL_CSS}
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; max-width: 100vw; overflow-x: hidden; }
    .m5-container { max-width: 1100px; margin: 0 auto; padding: 1rem; width: 100%; overflow-x: hidden; }
    @media (max-width: 480px) {
      .m5-container { padding: 0.5rem; }
    }
    .nav-tabs { display: flex; gap: 0.35rem; margin-bottom: 1.25rem; border-bottom: 2px solid #e2e8f0; flex-wrap: wrap; }
    .nav-tab { padding: 0.6rem 0.75rem; font-weight: 600; text-decoration: none; color: #4a5568; border-bottom: 3px solid transparent; min-height: 44px; display: inline-flex; align-items: center; font-size: 0.875rem; line-height: 1.3; }
    .nav-tab.active { color: #2b6cb0; border-bottom-color: #2b6cb0; }
    .form-grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; background: #f7fafc; padding: 0.875rem; border-radius: 8px; margin-bottom: 1.25rem; border: 1px solid #e2e8f0; width: 100%; }
    @media (min-width: 640px) {
      .form-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); padding: 1.25rem; gap: 1rem; }
    }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
    .form-group label { font-size: 0.875rem; font-weight: 600; color: #2d3748; }
    .form-group input, .form-group select { padding: 0.5rem 0.6rem; border: 1px solid #cbd5e0; border-radius: 4px; font-size: 0.95rem; min-height: 44px; width: 100%; max-width: 100%; }
    .truth-banner { background: #ebf8ff; border-left: 4px solid #3182ce; padding: 0.875rem; border-radius: 4px; margin-bottom: 1.25rem; font-size: 0.875rem; color: #2b6cb0; word-break: break-word; }
    .truth-banner p { margin: 0.25rem 0; }
    .table-responsive { width: 100%; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: 1rem; margin-bottom: 1rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #fff; }
    .comparison-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .comparison-table th, .comparison-table td { padding: 0.6rem 0.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; word-break: break-word; }
    .comparison-table th { background: #edf2f7; font-weight: 700; font-size: 0.825rem; color: #4a5568; }
    .delta-badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; background: #edf2f7; color: #2d3748; }
    .held-badge { background: #fed7d7; color: #742a2a; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 700; font-size: 0.8rem; display: inline-block; }
    .neutral-badge { background: #edf2f7; color: #4a5568; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem; display: inline-block; }
    .btn-action { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; min-width: 44px; padding: 0.4rem 0.75rem; border: 1px solid #cbd5e0; background: #fff; border-radius: 4px; cursor: pointer; text-decoration: none; color: #2d3748; font-weight: 600; font-size: 0.875rem; }
    .btn-action:hover { background: #edf2f7; }
    .btn-primary { background: #3182ce; color: #fff; border-color: #3182ce; }
    .btn-primary:hover { background: #2b6cb0; }
    .footnote { font-size: 0.8rem; color: #718096; margin-top: 0.35rem; }
    .shortlist-badge { background: #48bb78; color: #fff; padding: 0.15rem 0.45rem; border-radius: 12px; font-size: 0.75rem; margin-left: 0.4rem; }
    .shortlist-actions { display: flex; gap: 0.25rem; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .comparison-table th:nth-child(4), .comparison-table td:nth-child(4) { display: none; }
    }
    @media (max-width: 480px) {
      .comparison-table th, .comparison-table td { padding: 0.45rem 0.3rem; font-size: 0.8rem; }
      .btn-action { padding: 0.35rem 0.5rem; }
    }
    .print-only { display: none !important; }
    .screen-only { display: block; }
    th.screen-only, td.screen-only { display: table-cell; }

    @media print {
      body, html {
        background: #fff !important;
        color: #000 !important;
        font-family: Arial, -apple-system, sans-serif !important;
        font-size: 10pt !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .site-header, .site-footer, .nav-tabs, .form-grid, .truth-banner, .btn-action, .shortlist-actions, .screen-only, .lang-switch, header, .export-container {
        display: none !important;
      }
      .m5-container {
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: visible !important;
      }
      .print-only {
        display: block !important;
      }
      th.print-only, td.print-only {
        display: table-cell !important;
      }
      .print-header {
        display: block !important;
        margin-bottom: 14pt !important;
        border-bottom: 2pt solid #000 !important;
        padding-bottom: 6pt !important;
      }
      .print-header h1 {
        font-size: 14pt !important;
        font-weight: bold !important;
        margin: 0 0 4pt 0 !important;
        color: #000 !important;
      }
      .print-header p {
        font-size: 9.5pt !important;
        color: #333 !important;
        margin: 0 !important;
      }
      .table-responsive {
        border: none !important;
        overflow: visible !important;
        margin: 0 !important;
      }
      .shortlist-table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 9pt !important;
      }
      .shortlist-table th, .shortlist-table td {
        border: 1pt solid #333 !important;
        padding: 5pt 6pt !important;
        color: #000 !important;
        text-align: left !important;
        word-break: normal !important;
      }
      .shortlist-table th {
        background-color: #f2f2f2 !important;
        font-weight: bold !important;
      }
      .shortlist-table tr {
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  ${renderSiteHeader(lang, "planner", langControl)}
  <main class="m5-container">
    <header>
      <h1>${esc(copy.title)}</h1>
      <p>${esc(copy.nonPredictionDisclaimer)}</p>
    </header>

    <nav class="nav-tabs" aria-label="Milestone M5 Views">
      <a class="nav-tab ${activeTab === "comparison" ? "active" : ""}" href="?tab=comparison&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
        ${t("கட்-ஆஃப் ஒப்பீடு &amp; கல்லூரிகள்", "Cutoff Comparison &amp; Directory")}
      </a>
      <a class="nav-tab ${activeTab === "shortlist" ? "active" : ""}" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
        ${t("என் விருப்பப் பட்டியல்", "My Shortlist")} <span class="shortlist-badge">${shortIds.length}</span>
      </a>
      <a class="nav-tab ${activeTab === "counselling" ? "active" : ""}" href="?tab=counselling&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
        ${t("கலந்தாய்வு நடைமுறை வழிகாட்டல்", "Counselling Procedure Guidance")}
      </a>
    </nav>

    ${
      activeTab === "counselling"
        ? renderCounsellingTab(guidance, lang, rawShortlist)
        : activeTab === "shortlist"
        ? renderShortlistTab(shortIds, lang)
        : renderComparisonTab(
            copy,
            lang,
            studentCutoff,
            quota,
            community,
            round,
            communitySelected,
            query,
            typeFilter,
            evaluatedRows,
            shortIds,
            rawShortlist
          )
    }
  </main>
</body>
</html>`;
}

function renderComparisonTab(
  copy: ReturnType<typeof getComparisonCopy>,
  lang: SupportedLanguage,
  studentCutoff: number | null,
  quota: QuotaStream,
  community: CommunityCategory,
  round: AllotmentRound,
  communitySelected: boolean,
  query: string,
  typeFilter: string,
  rows: Array<{ college: CollegeMeta; offering: GovernedOffering; result: ComparisonResult }>,
  shortIds: string[],
  rawShortlist: string
): string {
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);
  const approvedHistoricalResult = rows
    .map((row) => row.result)
    .find(
      (result) =>
        (result.status === "AVAILABLE" || result.status === "STUDENT_CUTOFF_MISSING") &&
        result.year !== null &&
        result.stage !== null &&
        result.round !== null &&
        result.sourceTitle !== null &&
        result.locator !== null
    );
  const historicalDisclosure = approvedHistoricalResult?.round
    ? copy.formatDisclosure(approvedHistoricalResult.round)
    : t(
        "தேர்ந்தெடுத்த ஒதுக்கீடு / பிரிவு / சுற்றிற்கு இந்தப் பட்டியலில் அங்கீகரிக்கப்பட்ட 2025 வரலாற்றுத் தரவு கிடைக்கவில்லை. தரவு இல்லாமை கல்லூரி அல்லது படிப்பு இல்லை என்பதைக் குறிக்காது.",
        "No approved 2025 historical observation is available for the currently displayed offerings under the selected quota, community, and round. Missing historical data does not mean the college or branch is unavailable."
      );
  const availableCount = rows.filter(
    (r) => r.result.status === "AVAILABLE" || r.result.status === "STUDENT_CUTOFF_MISSING"
  ).length;

  return `
    <section>
      <p class="scope-note screen-only" style="margin: 0 0 0.85rem; padding: 0.65rem 0.9rem; background: #f8fafc; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 0.88rem; color: #2d3748; line-height: 1.5;">
        ${t(
          `<strong>வரம்பு:</strong> இந்தப் பக்கத்தில் 2025 வரலாற்றுத் தரவு ஒப்பீட்டிற்கு அங்கீகரிக்கப்பட்ட <strong>55 கல்லூரிகள் (555 படிப்புகள்)</strong> உள்ளன. தமிழ்நாட்டின் முழு 389 கல்லூரிகள் பட்டியலை மதிப்பெண் இன்றி ஆராய <a href="/colleges?lang=ta">கல்லூரிகள் பட்டியலைப் பார்க்கவும்</a>.`,
          `<strong>Dataset scope:</strong> This comparison workspace covers the <strong>55 approved colleges (555 offerings)</strong> with governed 2025 historical evidence. To browse the broader 389-college 2026 TNEA listing without marks, visit the <a href="/colleges?lang=en">Colleges Directory</a>.`
        )}
      </p>

      ${
        studentCutoff !== null && !communitySelected
          ? `
      <aside class="community-prompt screen-only" role="status" style="margin: 0 0 1rem; padding: 0.9rem 1rem; background: #fffbeb; border: 1.5px solid #d69e2e; border-radius: 8px; color: #744210; font-size: 0.92rem; line-height: 1.55;">
        <strong>${t("அடுத்த படி: உங்கள் இட ஒதுக்கீட்டுப் பிரிவைத் (Community) தேர்ந்தெடுங்கள்", "Next Step: Select Your Reservation Community Category")}</strong><br>
        ${t(
          `உங்கள் கட்-ஆஃப் (<strong>${studentCutoff}</strong>) பாதுகாப்பாகக் கொண்டுவரப்பட்டது (இணைய முகவரியில் சேமிக்கப்படவில்லை). கீழே உங்கள் உண்மையான இட ஒதுக்கீட்டுப் பிரிவு (OC / BC / BCM / MBC / SC / SCA / ST) மற்றும் ஒதுக்கீட்டைத் (பொதுக் கல்வி அல்லது 7.5% அரசுப் பள்ளி) தேர்ந்தெடுத்து <strong>'தேடு &amp; ஒப்பிடு'</strong> என்பதை அழுத்தவும்.`,
          `Your cutoff (<strong>${studentCutoff}</strong>) was transferred safely in memory (not stored in the URL). Select your applicable Reservation Community Category (OC / BC / BCM / MBC / SC / SCA / ST) and Admission Quota below, then click <strong>'Search &amp; Compare'</strong>.`
        )}
      </aside>`
          : ""
      }

      <!-- Form method is POST to prevent sensitive student marks from appearing in GET query strings or browser history -->
      <form method="POST" action="/m5-guidance" class="form-grid" role="search" aria-label="Cutoff comparison form">
        <input type="hidden" name="tab" value="comparison">
        <input type="hidden" name="lang" value="${lang}">
        <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
        <input type="hidden" name="community_selected" value="1">

        <div class="form-group">
          <label for="cutoff-input">${esc(copy.studentCutoffLabel)} (0–200)</label>
          <input id="cutoff-input" type="number" step="0.25" min="0" max="200" name="cutoff" value="${studentCutoff !== null ? studentCutoff : ""}" placeholder="${t("எ.கா. 185.5", "e.g. 185.5")}">
        </div>

        <div class="form-group">
          <label for="quota-select">${esc(copy.quotaLabel)}</label>
          <select id="quota-select" name="quota">
            <option value="GENERAL_ACADEMIC" ${quota === "GENERAL_ACADEMIC" ? "selected" : ""}>${esc(copy.quotaName("GENERAL_ACADEMIC"))}</option>
            <option value="GOVT_SCHOOL_7_5" ${quota === "GOVT_SCHOOL_7_5" ? "selected" : ""}>${esc(copy.quotaName("GOVT_SCHOOL_7_5"))}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="community-select">${esc(copy.communityLabel)}</label>
          <select id="community-select" name="community">
            ${(["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"] as CommunityCategory[])
              .map(
                (cat) =>
                  `<option value="${cat}" ${community === cat ? "selected" : ""}>${esc(copy.communityName(cat))}</option>`
              )
              .join("")}
          </select>
        </div>

        <div class="form-group">
          <label for="round-select">${esc(copy.roundLabel)}</label>
          <select id="round-select" name="round">
            ${(quota === "GOVT_SCHOOL_7_5"
              ? (["ROUND_1", "ROUND_2"] as AllotmentRound[])
              : (["ROUND_2", "ROUND_3"] as AllotmentRound[])
            )
              .map(
                (r) =>
                  `<option value="${r}" ${round === r ? "selected" : ""}>${esc(copy.roundName(r))}</option>`
              )
              .join("")}
          </select>
        </div>

        <div class="form-group">
          <label for="search-input">${t("தேடல் (கல்லூரி / கிளை / மாவட்டம்)", "Search (College / Branch / District)")}</label>
          <input id="search-input" type="text" name="q" value="${esc(query)}" placeholder="${t("எ.கா. CEG, PSG ECE, CSE, கோவை", "e.g. CEG, PSG ECE, CSE, Coimbatore")}">
          <small style="font-size: 0.78rem; color: #4a5568;">${t("சுருக்கப்பெயர் (CEG, PSG, GCT), கிளை (CSE, ECE), அல்லது மாவட்டம் (கோவை, சென்னை) கொண்டு தேடலாம்.", "Try college acronyms (CEG, PSG, GCT), branches (CSE, ECE), or districts (Coimbatore, Chennai).")}</small>
        </div>

        <div class="form-group" style="align-self: flex-end;">
          <button type="submit" class="btn-action btn-primary" style="width: 100%;">${t("தேடு &amp; ஒப்பிடு", "Search &amp; Compare")}</button>
          <small style="font-size: 0.75rem; color: #4a5568; text-align: center;">${t("தற்காலிக கணக்கீடு · மதிப்பெண்கள் சேமிக்கப்படாது", "In-memory only · Marks are never saved")}</small>
        </div>
      </form>

      <details class="community-guide screen-only" style="margin: 0 0 1rem; padding: 0.65rem 0.9rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #2d3748;">
        <summary style="cursor: pointer; font-weight: 600; color: #2b6cb0; padding: 0.2rem 0;">${t("இட ஒதுக்கீட்டுப் பிரிவுகள் (OC / BC / MBC / SC / ST) — எளிய விளக்கம்", "Reservation Community Categories (OC / BC / MBC / SC / ST) — Quick Guide")}</summary>
        <ul style="margin: 0.5rem 0 0.25rem; padding-left: 1.2rem; line-height: 1.55;">
          <li><strong>OC</strong> — ${t("பொதுப் பிரிவு (Open Competition): அனைத்து வகுப்பினரும் தகுதியின் அடிப்படையில் போட்டியிடக்கூடிய பொது இடங்கள்.", "Open Competition: Open merit pool available to all eligible candidates regardless of community.")}</li>
          <li><strong>BC / BCM</strong> — ${t("பிற்படுத்தப்பட்டோர் (Backward Class) மற்றும் பிற்படுத்தப்பட்ட முஸ்லிம் (BC Muslim).", "Backward Class (BC) and Backward Class Muslim (BCM).")}</li>
          <li><strong>MBC</strong> — ${t("மிகவும் பிற்படுத்தப்பட்டோர் மற்றும் சீர்மரபினர் (MBC / DNC).", "Most Backward Class and Denotified Communities (MBC / DNC).")}</li>
          <li><strong>SC / SCA / ST</strong> — ${t("ஆதிதிராவிடர் (SC), அருந்ததியர் (SCA) மற்றும் பழங்குடியினர் (ST).", "Scheduled Caste (SC), Scheduled Caste Arunthathiyar (SCA), and Scheduled Tribe (ST).")}</li>
        </ul>
        <p style="margin: 0.35rem 0 0; font-size: 0.82rem; color: #4a5568;">${t("உங்கள் சாதிச் சான்றிதழின்படி பொருந்தும் பிரிவை நீங்களே தேர்ந்தெடுங்கள்; தளம் தானாகப் பிரிவைக் கணிக்காது.", "Select the category that matches your official certificate; this tool never infers your category.")}</p>
      </details>

      <div class="active-context-strip" role="status" style="margin: 0 0 1rem; padding: 0.75rem 1rem; background: #edf2f7; border-left: 4px solid #2b6cb0; border-radius: 4px; font-size: 0.88rem; color: #1a202c; line-height: 1.5;">
        <div>
          <strong>${t("தற்போதைய ஒப்பீட்டு அமைப்பு:", "Current Comparison Context:")}</strong>
          2025 · ${esc(copy.quotaName(quota))} · <strong>${esc(copy.communityName(community))}</strong> · ${esc(copy.roundName(round))}
          ${query ? ` · ${t("தேடல்:", "Search:")} <strong>${esc(query)}</strong>` : ""}
          (${t(`${rows.length} படிப்புகளில் ${availableCount} படிப்புகளுக்கு 2025 தரவு உள்ளது`, `${availableCount} of ${rows.length} shown offerings have 2025 data`)})
        </div>
        ${
          quota === "GENERAL_ACADEMIC"
            ? `<p style="margin: 0.4rem 0 0; font-size: 0.84rem; color: #2d3748;">${t(
                "<strong>முக்கியக் குறிப்பு (சுற்று 1 தரவு இல்லை):</strong> பொதுக் கல்விப் பிரிவுக்கு 2025 அதிகாரப்பூர்வ <strong>சுற்று 2</strong> மற்றும் <strong>சுற்று 3</strong> வெளியீடுகள் மட்டுமே இங்கு அங்கீகரிக்கப்பட்டுள்ளன. CEG, PSG போன்ற முன்னணி கல்லூரிகளில் சுற்று 1-லேயே நிரம்பிய இடங்களுக்கு 'ஒப்பீட்டிற்கு கிடைக்கவில்லை' என்று காட்டப்படும் — இதன் பொருள் அந்தக் கல்லூரி அல்லது படிப்பு இல்லை என்பதல்ல. உங்கள் பிரிவு (எ.கா. BC, MBC, SC) அல்லது 7.5% ஒதுக்கீட்டைத் தேர்ந்தெடுத்துப் பார்க்கவும்.",
                "<strong>Coverage note (No Round 1 for General Academic):</strong> Only official 2025 <strong>Round 2</strong> and <strong>Round 3</strong> publications are approved here for General Academic. Offerings filled during Round 1 (such as top OC seats at CEG or PSG) appear as 'Not available for comparison' — this does NOT mean the college or branch is unavailable."
              )}</p>`
            : ""
        }
      </div>

      <aside class="truth-banner" aria-label="Official truth-in-guidance disclosures">
        <p><strong>${t("அதிகாரப்பூர்வ வெளிப்படைத்தன்மை அறிவிப்பு:", "Official Truth-in-Guidance Disclosure:")}</strong></p>
        <p>${esc(historicalDisclosure)}</p>
        <p>${esc(copy.nonPredictionDisclaimer)}</p>
        <p style="font-size: 0.85rem; color: #4a5568;">
          ${t(
            "அங்கீகரிக்கப்பட்ட 55 கல்லூரிகளில் உள்ள 555 படிப்புகளும் கீழே பட்டியலிடப்பட்டுள்ளன. அங்கீகரிக்கப்பட்ட வரலாற்றுத் தரவு இல்லாத போது அவை 'ஒப்பீட்டிற்கு கிடைக்கவில்லை' என்று வெளிப்படையாகக் குறிக்கப்பட்டுள்ளன.",
            "All 555 governed offerings across the 55 approved institutions are listed below. Where approved historical evidence is absent, offerings are transparently shown as 'Not available for comparison'."
          )}
        </p>
      </aside>

      ${
        shortIds.length > 0
          ? `
      <div class="shortlist-summary-pill screen-only" style="margin: 0.75rem 0 1rem; padding: 0.75rem 1rem; background: #e6fffa; border: 1.5px solid #81e6d9; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <span>
          <strong>${t(`தேர்ந்தெடுக்கப்பட்ட விருப்பங்கள்: ${shortIds.length}`, `Selected Choices: ${shortIds.length}`)}</strong>
          · ${t("விருப்பங்களை வரிசைப்படுத்தவும் அச்சிடவும் தயார்.", "Ready to organize and print your preference order.")}
        </span>
        <a class="btn-action btn-primary" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
          ${t("விருப்பப் பட்டியல் வரிசைக்குச் செல் →", "Go to Choice Order Planner →")}
        </a>
      </div>`
          : ""
      }

      <p class="screen-only" style="margin: 0.25rem 0 0.5rem; font-size: 0.83rem; color: #4a5568;">
        ${t(
          "'+ சேர்' என்பதை அழுத்துவது ஒரு விருப்பத்தை உங்கள் தனிப்பட்ட விருப்பப் பட்டியலில் சேர்க்கும் (இது தளத்தின் பரிந்துரை அல்ல; 'என் விருப்பப் பட்டியல்' பகுதியில் நீங்களே வரிசையை மாற்றலாம்).",
          "Clicking '+ Add' adds an option to your personal shortlist workspace (not a system recommendation; you manually set the final preference order in 'My Shortlist')."
        )}
      </p>

      <div class="table-responsive">
        <table class="comparison-table" role="table" aria-label="College Cutoff Comparison Table">
          <thead>
            <tr>
              <th scope="col">${t("கல்லூரி &amp; கிளை", "College &amp; Programme")}</th>
              <th scope="col">${esc(copy.historicalMinLabel)}</th>
              <th scope="col">${esc(copy.deltaLabel)}</th>
              <th scope="col">${t("அதிகாரப்பூர்வ ஆதாரம்", "Official Source")}</th>
              <th scope="col">${t("விருப்பப் பட்டியல் (கைமுறை வரிசை)", "Shortlist (Manual Order)")}</th>
            </tr>
          </thead>
          <tbody>
            ${
              rows.length === 0
                ? `<tr><td colspan="5" style="text-align: center; padding: 2rem;">${t("பொருந்தும் கல்லூரிகள் எதுவும் காணப்படவில்லை.", "No matching offerings found for this filter.")}</td></tr>`
                : rows
                    .map((r) => {
                      const id = `${r.college.code}~${r.offering.programmeCode}`;
                      const isShortlisted = shortIds.includes(id);
                      return renderOfferingRow(r, copy, isShortlisted, lang, rawShortlist, {
                        studentCutoff,
                        quota,
                        community,
                        round,
                        communitySelected,
                        query,
                        typeFilter,
                      });
                    })
                    .join("")
            }
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderOfferingRow(
  row: { college: CollegeMeta; offering: GovernedOffering; result: ComparisonResult },
  copy: ReturnType<typeof getComparisonCopy>,
  isShortlisted: boolean,
  lang: SupportedLanguage,
  rawShortlist: string,
  sessionState: {
    studentCutoff: number | null;
    quota: QuotaStream;
    community: CommunityCategory;
    round: AllotmentRound;
    communitySelected: boolean;
    query: string;
    typeFilter: string;
  }
): string {
  const { college, offering, result } = row;
  const id = `${college.code}~${offering.programmeCode}`;
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);

  let deltaHtml = "";
  if (result.isHeld) {
    deltaHtml = `<span class="held-badge">${esc(copy.heldNotice)}</span>`;
  } else if (result.status === "NO_HISTORICAL_DATA") {
    deltaHtml = `<span class="neutral-badge">${esc(copy.noDataNotice)}</span>`;
  } else if (result.status === "STUDENT_CUTOFF_MISSING") {
    deltaHtml = `<span class="neutral-badge">${esc(copy.missingCutoffPrompt)}</span>`;
  } else if (result.delta !== null) {
    deltaHtml = `<span class="delta-badge">${esc(copy.formatDelta(result.delta))}</span><small class="delta-caution" style="display: block; margin-top: 3px; font-size: 0.75rem; color: #4a5568; line-height: 1.35;">${t("கடந்த ஆண்டு கணக்கீடு மட்டுமே — சேர்க்கை உத்தரவாதமோ கணிப்போ அல்ல", "Past arithmetic only — not a guarantee or prediction")}</small>`;
  }

  // Toggle shortlist action via privacy-preserving POST form so cutoff/community/search remain intact in memory without appearing in GET URLs
  const nextShortlist = isShortlisted
    ? shortIdsWithout(rawShortlist, id)
    : shortIdsWith(rawShortlist, id);

  const sourceLabel = result.isHeld
    ? t(
        "2026 கல்லூரி கையேடு பக். 160 — '(முந்தைய ஆண்டு தரவு)' குறிப்பு; உறுதிப்படுத்தல் நிலுவையில்",
        "Booklet p. 160 '(Previous year data)' hold"
      )
    : result.status === "NO_HISTORICAL_DATA"
    ? t("அங்கீகரிக்கப்பட்ட வரலாற்றுத் தரவு இல்லை", "No approved historical data available")
    : result.locator
    ? lang === "ta" && result.round
      ? `2025 TNEA அதிகாரப்பூர்வ ${copy.roundName(result.round)} — ${copy.quotaName(sessionState.quota)} (${result.locator})`
      : `${result.sourceTitle ?? ""} (${result.locator})`
    : "—";

  return `
    <tr>
      <td>
        <strong>${esc(college.name)}</strong> (${esc(college.code)})
        <br>
        <span>${t("கிளை:", "Branch:")} <strong>${esc(offering.programmeCode)}</strong> · ${esc(offering.programmeName)}</span>
      </td>
      <td>
        ${
          result.isHeld
            ? "—"
            : result.historicalMin !== null
            ? `<strong>${result.historicalMin.toFixed(2)}</strong>`
            : "—"
        }
      </td>
      <td>
        ${deltaHtml}
      </td>
      <td>
        <span class="footnote">${esc(sourceLabel)}</span>
      </td>
      <td>
        <form method="POST" action="/m5-guidance" class="shortlist-toggle-form" style="margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(nextShortlist)}">
          <input type="hidden" name="q" value="${esc(sessionState.query)}">
          <input type="hidden" name="type" value="${esc(sessionState.typeFilter)}">
          <input type="hidden" name="quota" value="${sessionState.quota}">
          <input type="hidden" name="community" value="${sessionState.community}">
          <input type="hidden" name="round" value="${sessionState.round}">
          <input type="hidden" name="community_selected" value="${sessionState.communitySelected ? "1" : "0"}">
          ${sessionState.studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${sessionState.studentCutoff}">` : ""}
          <button type="submit"
             class="btn-action ${isShortlisted ? "" : "btn-primary"}"
             aria-label="${isShortlisted ? t("விருப்பப் பட்டியலிலிருந்து நீக்கு", "Remove from shortlist") : t("விருப்பப் பட்டியலில் சேர் (கைமுறை வரிசைப்படுத்தல்)", "Add to manual shortlist")}">
            ${isShortlisted ? t("சேர்க்கப்பட்டது ✓", "Saved ✓") : t("+ சேர்", "+ Add")}
          </button>
        </form>
      </td>
    </tr>
  `;
}

function renderShortlistTab(shortIds: string[], lang: SupportedLanguage): string {
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);

  if (shortIds.length === 0) {
    return `
      <section>
        <h2>${t("என் விருப்பப் பட்டியல்", "My Shortlist")}</h2>
        <p>${t("உங்கள் விருப்பப் பட்டியலில் இதுவரை எந்தக் கல்லூரியும் சேர்க்கப்படவில்லை.", "Your shortlist is empty. Browse the comparison directory to add college-programme choices.")}</p>
        <p><a class="btn-action btn-primary" href="?tab=comparison&amp;lang=${lang}">${t("கல்லூரிகளைப் பார்வையிடு", "Browse Colleges")}</a></p>
      </section>
    `;
  }

  const items = shortIds.map((id, index) => {
    const [cCode, pCode] = id.split("~");
    const meta = COHORT_55_METADATA[cCode];
    const name = meta ? meta.name : `College ${cCode}`;
    const govOff = HISTORICAL_OBSERVATIONS.getGovernedOffering(cCode, pCode);
    const progName = govOff ? govOff.programmeName : pCode;
    return createShortlistItem(cCode, name, pCode, progName, index + 1);
  });

  const shortlistState: ShortlistState = { items };
  const plainTextExport = formatShortlistPlainText(shortlistState, lang);
  const csvExport = formatShortlistCsv(shortlistState, lang);

  return `
    <section>
      <div class="print-header print-only">
        <h1>${esc(t("தமிழ்நாடு பொறியியல் சேர்க்கை (TNEA) — மாணவர் விருப்ப முன்னுரிமைப் பணித்தாள்", "Tamil Nadu Engineering Admissions (TNEA) — Student Choice Preference Worksheet"))}</h1>
        <p>${esc(t("அதிகாரப்பூர்வ TNEA விருப்பப் பதிவு முன்னுரிமைப் பணித்தாள் — கணிப்பு அல்லாத குறிப்புப் படிவம்", "Official TNEA Choice Entry Preference Worksheet — Non-predictive Reference"))}</p>
        <p style="margin-top: 4pt; font-size: 8.5pt; color: #555;">${esc(t("அதிகாரப்பூர்வ TNEA கலந்தாய்வு இணையதளத்தில் வரிசைப்படி பதிவு செய்வதற்கான சரிபார்ப்புப் படிவம்.", "Student-controlled preference worksheet organized according to genuine priority for official TNEA online choice filling."))}</p>
      </div>

      <div class="screen-only">
        <h2>${t("விருப்பப் பட்டியல் வரிசை (Choice Order Planner)", "Choice Order Planner")}</h2>
        <p>${t("மாணவர்கள் தங்கள் விருப்பங்களை உண்மையான முன்னுரிமைப்படி வரிசைப்படுத்துகின்றனர். மாற்று விருப்பத்தில் இடம் ஒதுக்கப்பட்டால், மேலே காலியிடங்கள் ஏற்படும் பட்சத்தில் விருப்பம் #1-ஐ நோக்கிய மேல்நோக்கிய நகர்வு சாத்தியமாகும்.", "Candidates organize their preference list according to their genuine priorities. If an allotment is made for a lower preference, upward movement allows movement toward Choice #1 if higher-preference vacancies arise.")}</p>

        <div style="margin-bottom: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn-action btn-primary" onclick="window.print()" title="${t("அச்சுப் படிவம் / PDF பதிவிறக்கு", "Print Worksheet / Save as PDF")}">
              ${t("🖨️ அச்சிடு / PDF சேமி", "🖨️ Print / Save PDF")}
            </button>
          </div>
          <div>
            <a class="btn-action" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=" style="color: #c53030;">
              ${t("பட்டியலை அழி", "Clear Shortlist")}
            </a>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="comparison-table shortlist-table" role="table" aria-label="Shortlist reordering table">
          <thead>
            <tr>
              <th scope="col" style="width: 70px;">${t("வரிசை", "Choice Order")}</th>
              <th scope="col" class="screen-only">${t("கல்லூரி &amp; கிளை", "College &amp; Programme")}</th>
              <th scope="col" class="print-only">${t("கல்லூரி குறியீடு", "College Code")}</th>
              <th scope="col" class="print-only">${t("கல்லூரி பெயர்", "College Name")}</th>
              <th scope="col" class="print-only">${t("கிளை குறியீடு", "Branch Code")}</th>
              <th scope="col" class="print-only">${t("கிளை பெயர்", "Branch Name")}</th>
              <th scope="col" class="screen-only" style="width: 140px;">${t("நடவடிக்கை", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((item, index) => {
                const id = `${item.collegeCode}~${item.programmeCode}`;

                // Move up ID swap
                const upList = [...shortIds];
                if (index > 0) {
                  const tmp = upList[index - 1];
                  upList[index - 1] = upList[index];
                  upList[index] = tmp;
                }

                // Move down ID swap
                const downList = [...shortIds];
                if (index < shortIds.length - 1) {
                  const tmp = downList[index + 1];
                  downList[index + 1] = downList[index];
                  downList[index] = tmp;
                }

                // Remove ID
                const remList = shortIds.filter((x) => x !== id);

                return `
                  <tr>
                    <td><strong>#${item.order}</strong></td>
                    <td class="screen-only">
                      <strong>${esc(item.collegeName)}</strong> (${esc(item.collegeCode)})<br>
                      <span>${t("கிளை:", "Branch:")} <strong>${esc(item.programmeCode)}</strong> · ${esc(item.programmeName)}</span>
                    </td>
                    <td class="print-only"><strong>${esc(item.collegeCode)}</strong></td>
                    <td class="print-only">${esc(item.collegeName)}</td>
                    <td class="print-only"><strong>${esc(item.programmeCode)}</strong></td>
                    <td class="print-only">${esc(item.programmeName)}</td>
                    <td class="screen-only">
                      <div class="shortlist-actions">
                        ${
                          index > 0
                            ? `<a class="btn-action" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(upList.join(","))}" title="${t("மேலே நகர்த்து", "Move Up")}">↑</a>`
                            : `<span class="btn-action" style="opacity: 0.4; cursor: not-allowed;">↑</span>`
                        }
                        ${
                          index < shortIds.length - 1
                            ? `<a class="btn-action" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(downList.join(","))}" title="${t("கீழே நகர்த்து", "Move Down")}">↓</a>`
                            : `<span class="btn-action" style="opacity: 0.4; cursor: not-allowed;">↓</span>`
                        }
                        <a class="btn-action" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(remList.join(","))}" title="${t("நீக்கு", "Remove")}">✕</a>
                      </div>
                    </td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>

      <section class="screen-only export-container" style="margin-top: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem;">
        <h3 style="margin-top: 0; font-size: 1.05rem; color: #2d3748; display: flex; align-items: center; gap: 0.5rem;">
          <span>📋</span> ${t("விருப்பப் பட்டியல் நகல் &amp; ஏற்றுமதி (TNEA போர்ட்டலுக்காக)", "Choice List Copy &amp; Export (For Official TNEA Portal)")}
        </h3>
        <p style="font-size: 0.875rem; color: #4a5568; margin-bottom: 1rem; line-height: 1.5;">
          ${t(
            "அதிகாரப்பூர்வ TNEA கலந்தாய்வு இணையதளத்தில் விருப்பங்களை வரிசைப்படி பதிவு செய்ய இந்த உரையை நகலெடுத்துக் கொள்ளலாம்.",
            "Copy your finalized ordered choices as plain text or CSV format for reference when filling choices in the official TNEA counselling portal."
          )}
        </p>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn-action" onclick="navigator.clipboard?.writeText(document.getElementById('export-text').value); alert('${t("உரை கிளிப்போர்டில் நகலெடுக்கப்பட்டது!", "Plain text copied to clipboard!")}')">
            ${t("📋 எளிய உரையை நகலெடு", "📋 Copy Plain Text")}
          </button>
          <button type="button" class="btn-action" onclick="navigator.clipboard?.writeText(document.getElementById('export-csv').value); alert('${t("CSV கிளிப்போர்டில் நகலெடுக்கப்பட்டது!", "CSV copied to clipboard!")}')">
            ${t("📊 CSV நகலெடு", "📊 Copy CSV")}
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label for="export-text" style="font-size: 0.825rem; font-weight: 600; color: #4a5568; display: block; margin-bottom: 0.25rem;">
              ${t("எளிய உரை வடிவம் (Plain Text):", "Plain Text Format:")}
            </label>
            <textarea id="export-text" readonly rows="6" style="width: 100%; max-width: 100%; box-sizing: border-box; font-family: monospace, Consolas, sans-serif; font-size: 0.85rem; padding: 0.6rem; border: 1px solid #cbd5e0; border-radius: 4px; background: #fff; line-height: 1.4; resize: vertical;">${esc(plainTextExport)}</textarea>
          </div>

          <details>
            <summary style="font-size: 0.85rem; font-weight: 600; color: #2b6cb0; cursor: pointer; padding: 0.25rem 0;">
              ${t("📊 அட்டவணை வடிவம் (CSV) பார்க்க", "📊 View Tabular CSV Format")}
            </summary>
            <div style="margin-top: 0.5rem;">
              <textarea id="export-csv" readonly rows="5" style="width: 100%; max-width: 100%; box-sizing: border-box; font-family: monospace, Consolas, sans-serif; font-size: 0.85rem; padding: 0.6rem; border: 1px solid #cbd5e0; border-radius: 4px; background: #fff; line-height: 1.4; resize: vertical;">${esc(csvExport)}</textarea>
            </div>
          </details>
        </div>
      </section>

      <div class="next-step-card screen-only" style="margin-top: 1.75rem; padding: 1.25rem; background: #ebf8ff; border: 1.5px solid #bee3f8; border-radius: 8px;">
        <h3 style="margin: 0 0 0.5rem; color: #2b6cb0;">${t("அடுத்த படி: TNEA கலந்தாய்வு ஒதுக்கீட்டு விதிகளை அறிதல்", "Next Step: Understand Official TNEA Allocation &amp; Upward Movement")}</h3>
        <p style="margin: 0 0 1rem; color: #2d3748; font-size: 0.95rem; line-height: 1.5;">
          ${t("உங்கள் விருப்பப் பட்டியலை இறுதி செய்தவுடன், TNEA ஒற்றைச் சாளரக் கலந்தாய்வு முறை எவ்வாறு செயல்படுகிறது என்பதையும், மேல்நோக்கிய நகர்வு (Upward Movement) விதிகள் எவ்வாறு உங்கள் விருப்பம் #1-ஐப் பாதுகாக்கின்றன என்பதையும் அறிந்துகொள்ளுங்கள்.", "Once your preference order is set, learn how single-window counselling evaluates choices sequentially from Choice #1 downwards and how upward movement allows you to reach higher preferences without risk.")}
        </p>
        <a class="btn-action btn-primary" href="?tab=counselling&amp;lang=${lang}&amp;shortlist=${esc(shortIds.join(","))}">
          ${t("கலந்தாய்வு நடைமுறைகள் &amp; விதிகளைப் படிக்க →", "Read Counselling Procedures &amp; Rules →")}
        </a>
      </div>
    </section>
  `;
}

function renderCounsellingTab(
  guidance: ReturnType<typeof getCounsellingGuidance>,
  lang: SupportedLanguage = "en",
  rawShortlist: string = ""
): string {
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);
  return `
    <section>
      <h2>${esc(guidance.title)}</h2>
      <p>${esc(guidance.subtitle)}</p>
      <p class="screen-only" style="margin: 0 0 1rem; padding: 0.75rem 1rem; background: #ebf8ff; border-left: 4px solid #3182ce; border-radius: 4px; font-size: 0.9rem; color: #2d3748; line-height: 1.5;">
        ${t(
          `இது விருப்பப் பட்டியல் தயாரிப்பிற்கான சுருக்க வழிகாட்டி. TFC அறிக்கை சமர்ப்பித்தல், Accept vs Decline விதிகள், முதல் பட்டதாரி மற்றும் PMSS கட்டணச் சலுகைகளின் முழு விவரங்களுக்கு <a href="/counselling?lang=ta">முழு TNEA கலந்தாய்வு வழிகாட்டியைப் பார்க்கவும் →</a>.`,
          `This tab summarizes choice-filling and allotment rules alongside your shortlist. For complete procedural details (Accept vs. Decline, TFC reporting, First Graduate, and PMSS fee concessions), open the <a href="/counselling?lang=en">Full TNEA Counselling Guide →</a>.`
        )}
      </p>

      ${guidance.sections
        .map(
          (sec, idx) => `
        <details ${idx < 2 ? "open" : ""} style="background: #fff; padding: 1rem 1.25rem; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 0.9rem;">
          <summary style="color: #2b6cb0; font-weight: 700; font-size: 1.05rem; cursor: pointer; padding: 0.2rem 0;">${esc(sec.title)}</summary>
          <div style="margin-top: 0.65rem;">
            ${sec.content.map((p) => `<p style="line-height: 1.6; color: #4a5568; margin: 0.5rem 0;">${esc(p)}</p>`).join("")}
          </div>
        </details>
      `
        )
        .join("")}

      <div class="counselling-bottom-actions screen-only" style="margin-top: 1.5rem; padding: 1.25rem; background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;">
        <a class="btn-action btn-primary" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
          ${t("← என் விருப்பப் பட்டியலுக்குத் திரும்பு", "← Back to My Shortlist")}
        </a>
        <a class="btn-action" href="/counselling?lang=${lang}">
          ${t("முழு கலந்தாய்வு விதிகள் →", "Full Counselling Guide →")}
        </a>
        <a class="btn-action" href="?tab=comparison&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
          ${t("கூடுதல் கல்லூரிகளைப் பார்வையிட", "Browse More Colleges")}
        </a>
        <a class="btn-action" href="/personal?lang=${lang}">
          ${t("கட்-ஆஃப் கணக்கீடு", "Cutoff Calculator")}
        </a>
        <a class="btn-action" href="https://www.tneaonline.org/" target="_blank" rel="noopener">
          ${t("அதிகாரப்பூர்வ TNEA தளம் ↗", "Official TNEA Portal ↗")}
        </a>
      </div>
    </section>
  `;
}

function shortIdsWith(raw: string, id: string): string {
  const parts = raw.split(",").filter(Boolean);
  if (!parts.includes(id)) parts.push(id);
  return parts.join(",");
}

function shortIdsWithout(raw: string, id: string): string {
  return raw
    .split(",")
    .filter(Boolean)
    .filter((x) => x !== id)
    .join(",");
}

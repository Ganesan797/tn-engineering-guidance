import {
  HISTORICAL_OBSERVATIONS,
  compareOffering,
  getComparisonCopy,
  getCounsellingGuidance,
  type AllotmentRound,
  type CommunityCategory,
  type ComparisonResult,
  type GovernedOffering,
  type QuotaStream,
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
  "3011": { code: "3011", name: "University College of Engineering, Tiruchirappalli (BIT Campus)", type: "CONSTITUENT", district: "Tiruchirappalli", aliases: ["BIT", "BIT Campus", "UCE Trichy"] },
  "3016": { code: "3016", name: "University College of Engineering, Ariyalur", type: "CONSTITUENT", district: "Ariyalur", aliases: ["UCE Ariyalur"] },
  "3018": { code: "3018", name: "University College of Engineering, Nagercoil", type: "CONSTITUENT", district: "Kanyakumari", aliases: ["UCEN", "UCE Nagercoil"] },
  "3019": { code: "3019", name: "University College of Engineering, Panruti", type: "CONSTITUENT", district: "Cuddalore", aliases: ["UCE Panruti"] },
  "3021": { code: "3021", name: "University College of Engineering, Pattukkottai", type: "CONSTITUENT", district: "Thanjavur", aliases: ["UCE Pattukkottai"] },
  "4020": { code: "4020", name: "Anna University Regional Campus, Tirunelveli", type: "CONSTITUENT", district: "Tirunelveli", aliases: ["AURCT", "AURC Tirunelveli"] },
  "4023": { code: "4023", name: "University College of Engineering, Ramanathapuram", type: "CONSTITUENT", district: "Ramanathapuram", aliases: ["UCER", "UCE Ramanathapuram", "UCE Ramnad"] },
  "4024": { code: "4024", name: "University College of Engineering, Dindigul", type: "CONSTITUENT", district: "Dindigul", aliases: ["UCED", "UCE Dindigul"] },
  "5010": { code: "5010", name: "Anna University Regional Campus, Madurai", type: "CONSTITUENT", district: "Madurai", aliases: ["AURCM", "AURC Madurai"] },
  "5017": { code: "5017", name: "University College of Engineering, Thirukkuvalai", type: "CONSTITUENT", district: "Nagapattinam", aliases: ["UCE Thirukkuvalai"] },
  "5022": { code: "5022", name: "University College of Engineering, Thoothukudi", type: "CONSTITUENT", district: "Thoothukudi", aliases: ["UCE Thoothukudi", "UCE Tuticorin", "VOC", "VOC College"] },
  // 20 SFC
  "1113": { code: "1113", name: "R.M.K. Engineering College, Gummidipoondi, Tiruvallur", type: "SFC", district: "Tiruvallur", aliases: ["RMK", "RMKEC"] },
  "1120": { code: "1120", name: "Velammal Engineering College, Ambattur, Chennai", type: "SFC", district: "Chennai", aliases: ["VEC", "VEC Chennai"] },
  "1211": { code: "1211", name: "Rajalakshmi Engineering College, Thandalam, Sriperumbudur", type: "SFC", district: "Kancheepuram", aliases: ["REC", "REC Chennai", "Rajalakshmi"] },
  "1219": { code: "1219", name: "Sri Venkateswara College of Engineering, Pennalur, Sriperumbudur", type: "SFC", district: "Kancheepuram", aliases: ["SVCE", "SVCE Sriperumbudur"] },
  "1304": { code: "1304", name: "Easwari Engineering College, Ramapuram, Chennai", type: "SFC", district: "Chennai", aliases: ["EEC", "Easwari"] },
  "1317": { code: "1317", name: "St. Joseph's College of Engineering, OMR, Chennai", type: "SFC", district: "Chennai", aliases: ["SJCE", "St Josephs", "St Joseph"] },
  "1399": { code: "1399", name: "Chennai Institute of Technology, Kundrathur, Chennai", type: "SFC", district: "Chennai", aliases: ["CIT", "CIT Chennai", "CIT Kundrathur"] },
  "1419": { code: "1419", name: "Sri Sai Ram Engineering College, West Tambaram, Chennai", type: "SFC", district: "Kancheepuram", aliases: ["SEC", "Sairam", "Sai Ram"] },
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
};

export function matchesOfferingSearch(
  college: CollegeMeta,
  off: GovernedOffering,
  query: string
): boolean {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const aliasStr = (college.aliases ?? []).join(" ");
  const comboStr = `${college.code}~${off.programmeCode}`;
  const directText = `${college.code} ${comboStr} ${college.name} ${aliasStr} ${off.programmeCode} ${off.programmeName} ${college.district}`.toLowerCase();
  if (directText.includes(q)) return true;

  const rawTokens = q.split(/[\s,+/~-]+/).filter(Boolean);
  if (rawTokens.length > 0) {
    const normalizedTokens = rawTokens.map((tok) => SEARCH_ALIASES[tok] || tok);
    if (normalizedTokens.every((tok) => directText.includes(tok))) return true;
  }

  return false;
}

export interface M5GuidanceRenderOptions {
  studentCutoff?: number | null;
  quota?: QuotaStream;
  community?: CommunityCategory;
  round?: AllotmentRound;
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
  const langToggleParams = new URLSearchParams();
  langToggleParams.set("tab", activeTab);
  langToggleParams.set("lang", lang === "en" ? "ta" : "en");
  if (query) langToggleParams.set("q", query);
  if (typeFilter !== "all") langToggleParams.set("type", typeFilter);
  if (rawShortlist) langToggleParams.set("shortlist", rawShortlist);

  const langControl = `<a class="lang-switch" href="?${langToggleParams.toString()}">${lang === "en" ? "தமிழ்" : "English"}</a>`;

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
        ? renderCounsellingTab(guidance)
        : activeTab === "shortlist"
        ? renderShortlistTab(shortIds, lang)
        : renderComparisonTab(
            copy,
            lang,
            studentCutoff,
            quota,
            community,
            round,
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
        "செயலியில் பயன்படுத்த அங்கீகரிக்கப்பட்ட வரலாற்று ஆதாரம் தற்போது கிடைக்கவில்லை. கண்டறியப்பட்ட குறைந்தபட்ச மதிப்பெண் அல்லது சுற்று-குறிப்பிட்ட முடிவு எதுவும் காட்டப்படவில்லை.",
        "Historical comparison evidence is not currently approved for runtime use. No observed minimum or round-specific result is displayed."
      );

  return `
    <section>
      <!-- Form method is POST to prevent sensitive student marks from appearing in GET query strings or browser history -->
      <form method="POST" action="/m5-guidance" class="form-grid" role="search" aria-label="Cutoff comparison form">
        <input type="hidden" name="tab" value="comparison">
        <input type="hidden" name="lang" value="${lang}">
        <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">

        <div class="form-group">
          <label for="cutoff-input">${esc(copy.studentCutoffLabel)} (0–200)</label>
          <input id="cutoff-input" type="number" step="0.25" min="0" max="200" name="cutoff" value="${studentCutoff !== null ? studentCutoff : ""}" placeholder="e.g. 185.5">
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
          <label for="search-input">${t("தேடல் (கல்லூரி / கிளை)", "Search (College / Branch)")}</label>
          <input id="search-input" type="text" name="q" value="${esc(query)}" placeholder="e.g. GCT, PSG, CSE, ME">
        </div>

        <div class="form-group" style="align-self: flex-end;">
          <button type="submit" class="btn-action btn-primary" style="width: 100%;">${t("கணக்கிடு (தற்காலிக தரவு)", "Calculate (Non-persistent)")}</button>
        </div>
      </form>

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

      <div class="table-responsive">
        <table class="comparison-table" role="table" aria-label="College Cutoff Comparison Table">
          <thead>
            <tr>
              <th scope="col">${t("கல்லூரி &amp; கிளை", "College &amp; Programme")}</th>
              <th scope="col">${esc(copy.historicalMinLabel)}</th>
              <th scope="col">${esc(copy.deltaLabel)}</th>
              <th scope="col">${t("அதிகாரப்பூர்வ ஆதாரம்", "Official Source")}</th>
              <th scope="col">${t("விருப்பப் பட்டியல்", "Shortlist")}</th>
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
                      return renderOfferingRow(r, copy, isShortlisted, lang, rawShortlist);
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
  rawShortlist: string
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
    deltaHtml = `<span class="delta-badge">${esc(copy.formatDelta(result.delta))}</span>`;
  }

  // Toggle shortlist action URL — strictly non-sensitive parameters only (tab, lang, shortlist)
  const nextShortlist = isShortlisted
    ? shortIdsWithout(rawShortlist, id)
    : shortIdsWith(rawShortlist, id);

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
        <span class="footnote">
          ${
            result.isHeld
              ? esc("Booklet p. 160 '(Previous year data)' hold")
              : result.status === "NO_HISTORICAL_DATA"
              ? esc(t("அங்கீகரிக்கப்பட்ட வரலாற்றுத் தரவு இல்லை", "No approved historical data available"))
              : result.locator
              ? `${esc(result.sourceTitle ?? "")} (${esc(result.locator)})`
              : "—"
          }
        </span>
      </td>
      <td>
        <a class="btn-action ${isShortlisted ? "" : "btn-primary"}"
           href="?tab=comparison&amp;lang=${lang}&amp;shortlist=${esc(nextShortlist)}"
           aria-label="${isShortlisted ? t("பட்டியலிலிருந்து நீக்கு", "Remove from shortlist") : t("பட்டியலில் சேர்", "Add to shortlist")}">
          ${isShortlisted ? t("சேர்க்கப்பட்டது ✓", "Saved ✓") : t("+ சேர்", "+ Add")}
        </a>
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

  return `
    <section>
      <h2>${t("விருப்பப் பட்டியல் வரிசை (Choice Order Planner)", "Choice Order Planner")}</h2>
      <p>${t("மாணவர்கள் தங்கள் விருப்பங்களை உண்மையான முன்னுரிமைப்படி வரிசைப்படுத்துகின்றனர். மாற்று விருப்பத்தில் இடம் ஒதுக்கப்பட்டால், மேலே காலியிடங்கள் ஏற்படும் பட்சத்தில் விருப்பம் #1-ஐ நோக்கிய மேல்நோக்கிய நகர்வு சாத்தியமாகும்.", "Candidates organize their preference list according to their genuine priorities. If an allotment is made for a lower preference, upward movement allows movement toward Choice #1 if higher-preference vacancies arise.")}</p>

      <div class="table-responsive">
        <table class="comparison-table" role="table" aria-label="Shortlist reordering table">
          <thead>
            <tr>
              <th scope="col">${t("வரிசை", "Choice Order")}</th>
              <th scope="col">${t("கல்லூரி &amp; கிளை", "College &amp; Programme")}</th>
              <th scope="col">${t("நடவடிக்கை", "Actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${shortIds
              .map((id, index) => {
                const [cCode, pCode] = id.split("~");
                const meta = COHORT_55_METADATA[cCode];
                const name = meta ? meta.name : `College ${cCode}`;
                const govOff = HISTORICAL_OBSERVATIONS.getGovernedOffering(cCode, pCode);
                const progName = govOff ? govOff.programmeName : pCode;

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
                    <td><strong>#${index + 1}</strong></td>
                    <td>
                      <strong>${esc(name)}</strong> (${esc(cCode)})<br>
                      <span>${t("கிளை:", "Branch:")} <strong>${esc(pCode)}</strong> · ${esc(progName)}</span>
                    </td>
                    <td>
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

      <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
        <a class="btn-action" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=">
          ${t("பட்டியலை அழி", "Clear Shortlist")}
        </a>
      </div>
    </section>
  `;
}

function renderCounsellingTab(guidance: ReturnType<typeof getCounsellingGuidance>): string {
  return `
    <section>
      <h2>${esc(guidance.title)}</h2>
      <p>${esc(guidance.subtitle)}</p>

      ${guidance.sections
        .map(
          (sec) => `
        <article style="background: #fff; padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 1.25rem;">
          <h3 style="color: #2b6cb0; margin-top: 0;">${esc(sec.title)}</h3>
          ${sec.content.map((p) => `<p style="line-height: 1.6; color: #4a5568;">${esc(p)}</p>`).join("")}
        </article>
      `
        )
        .join("")}
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

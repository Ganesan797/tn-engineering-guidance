import {
  HISTORICAL_OBSERVATIONS,
  compareOffering,
  getComparisonCopy,
  getCounsellingGuidance,
  formatShortlistPlainText,
  formatShortlistCsv,
  createShortlistItem,
  type AllotmentRound,
  type AllotmentRoundOrAll,
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

function formatBranchDropdownLabel(name: string): string {
  const KEEP_UPPER = new Set(["SS", "AI", "ML", "VLSI", "AR/VR", "IT", "IOT"]);
  const LOWER_WORDS = new Set(["and", "of", "in", "for", "&"]);
  return name
    .toLowerCase()
    .split(/(\s+|\(|\))/)
    .map((part, idx) => {
      if (!part || /^\s+$/.test(part) || part === "(" || part === ")") return part;
      const upper = part.toUpperCase();
      if (KEEP_UPPER.has(upper)) return upper;
      if (idx > 0 && LOWER_WORDS.has(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

// College cohort metadata for approved institutions
import {
  type CollegeMeta,
  COHORT_55_METADATA,
  COHORT_66_ADDITIONS_METADATA,
  COHORT_65_ADDITIONS_METADATA,
  COHORT_121_METADATA,
  COHORT_120_METADATA,
  COHORT_55_CODES,
  COHORT_66_ADDITIONS_CODES,
  COHORT_65_ADDITIONS_CODES,
  COHORT_121_CODES,
  COHORT_120_CODES,
} from "../m5/cohort-metadata.ts";

export {
  type CollegeMeta,
  COHORT_55_METADATA,
  COHORT_66_ADDITIONS_METADATA,
  COHORT_65_ADDITIONS_METADATA,
  COHORT_121_METADATA,
  COHORT_120_METADATA,
  COHORT_55_CODES,
  COHORT_66_ADDITIONS_CODES,
  COHORT_65_ADDITIONS_CODES,
  COHORT_121_CODES,
  COHORT_120_CODES,
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
  round?: AllotmentRoundOrAll;
  communitySelected?: boolean;
  year?: number;
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

  const rawRound = inputState.round ?? params.get("round");
  const round: AllotmentRoundOrAll =
    rawRound === "ALL"
      ? "ALL"
      : rawRound && ["ROUND_1", "ROUND_2", "ROUND_3"].includes(rawRound)
      ? (rawRound as AllotmentRound)
      : quota === "GOVT_SCHOOL_7_5"
      ? "ROUND_1"
      : "ROUND_2";

  const year: number =
    inputState.year === 2025 || params.get("year") === "2025"
      ? 2025
      : 2026;

  // Non-sensitive navigation / search filters from URL
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const typeFilter = params.get("type") ?? "all";
  const districtFilter = (params.get("district") ?? "").trim();
  const branchFilter = (params.get("branch") ?? "").trim().toUpperCase();
  const onlyAvailable = params.get("only_available") === "1";
  const showAllOfferings = params.get("show_all") === "1";
  const sortOption = params.get("sort") ?? "cutoff_desc";

  // Load ALL 1,249 governed offerings across 121 approved institutions
  const governedOfferings = HISTORICAL_OBSERVATIONS.getAllGovernedOfferings();

  // Build deterministic, sorted filter options from governed metadata
  const allDistricts = Array.from(
    new Set(Object.values(COHORT_121_METADATA).map((c) => c.district))
  ).sort((a, b) => a.localeCompare(b));

  const branchMap = new Map<string, string>();
  for (const off of governedOfferings) {
    if (!branchMap.has(off.programmeCode)) {
      branchMap.set(off.programmeCode, off.programmeName);
    }
  }
  const allBranches = Array.from(branchMap.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => {
      const n = a.name.localeCompare(b.name);
      return n !== 0 ? n : a.code.localeCompare(b.code);
    });

  // Evaluate comparison for each offering
  const evaluatedRows: Array<{
    college: CollegeMeta;
    offering: GovernedOffering;
    result: ComparisonResult;
  }> = [];

  for (const off of governedOfferings) {
    const college = COHORT_121_METADATA[off.collegeCode] ?? {
      code: off.collegeCode,
      name: `College ${off.collegeCode}`,
      type: "GOVERNMENT",
      district: "Tamil Nadu",
      aliases: [],
    };

    // Filter by type
    if (typeFilter !== "all" && college.type !== typeFilter) continue;

    // Filter by district
    if (districtFilter && college.district.toLowerCase() !== districtFilter.toLowerCase()) continue;

    // Filter by exact governed branch code
    if (branchFilter && off.programmeCode.toUpperCase() !== branchFilter) continue;

    // Filter by search query
    if (query && !matchesOfferingSearch(college, off, query)) continue;

    const result = compareOffering({
      studentCutoff,
      year,
      stage: "PROVISIONAL_ALLOTMENT",
      round,
      quota,
      community,
      collegeCode: off.collegeCode,
      programmeCode: off.programmeCode,
      metricType: "DERIVED_PROVISIONAL_ALLOTMENT_MINIMUM_MARK",
    });

    // Optional filter: show only offerings that have historical data
    if (onlyAvailable && result.status !== "AVAILABLE" && result.status !== "STUDENT_CUTOFF_MISSING") {
      continue;
    }

    evaluatedRows.push({
      college,
      offering: off,
      result,
    });
  }

  // Intuitive, student-centered sorting:
  // Default 'cutoff_desc' (Cutoff High to Low):
  // 1. Offerings with approved historical cutoff data appear FIRST, sorted by observed minimum mark descending.
  // 2. Tie-breaker: college name A-Z, then programme code.
  // 3. Offerings without historical cutoff data appear at the bottom, sorted by college name A-Z.
  evaluatedRows.sort((a, b) => {
    if (sortOption === "cutoff_asc") {
      const aHas = a.result.historicalMin !== null;
      const bHas = b.result.historicalMin !== null;
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      if (aHas && bHas) {
        const diff = a.result.historicalMin! - b.result.historicalMin!;
        if (diff !== 0) return diff;
      }
      const c = a.college.name.localeCompare(b.college.name);
      return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
    }

    if (sortOption === "delta_closest" && studentCutoff !== null) {
      const aHas = a.result.delta !== null;
      const bHas = b.result.delta !== null;
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      if (aHas && bHas) {
        const diff = Math.abs(a.result.delta!) - Math.abs(b.result.delta!);
        if (diff !== 0) return diff;
      }
      const c = a.college.name.localeCompare(b.college.name);
      return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
    }

    if (sortOption === "college_name") {
      const c = a.college.name.localeCompare(b.college.name);
      return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
    }

    if (sortOption === "college_code") {
      const c = a.college.code.localeCompare(b.college.code, undefined, { numeric: true });
      return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
    }

    // Default: 'cutoff_desc' (Highest Cutoffs First)
    const aHas = a.result.historicalMin !== null;
    const bHas = b.result.historicalMin !== null;
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    if (aHas && bHas) {
      const diff = b.result.historicalMin! - a.result.historicalMin!;
      if (diff !== 0) return diff;
    }
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
    if (districtFilter) p.set("district", districtFilter);
    if (branchFilter) p.set("branch", branchFilter);
    if (sortOption !== "cutoff_desc") p.set("sort", sortOption);
    if (onlyAvailable) p.set("only_available", "1");
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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    ${SITE_SHELL_CSS}
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0; width: 100%; max-width: 100vw; overflow-x: hidden;
      font-family: "Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Tamil", "Mukta Malar", "Nirmala UI", sans-serif;
      background: #f8fafc; color: #0f172a; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    }
    .m5-container { max-width: 1280px; margin: 0 auto; padding: 1.5rem 1.25rem; width: 100%; overflow-x: hidden; }
    @media (max-width: 640px) {
      .m5-container { padding: 0.75rem; }
    }
    .m5-header-card {
      background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .m5-header-card h1 { margin: 0 0 0.35rem; font-size: 1.7rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
    .nav-tabs {
      display: inline-flex; background: #e2e8f0; padding: 0.3rem; border-radius: 10px; gap: 0.25rem; margin-bottom: 1.25rem; border: none; flex-wrap: wrap; width: 100%;
    }
    .nav-tab {
      padding: 0.65rem 1.15rem; font-weight: 600; text-decoration: none; color: #475569; border-radius: 8px; border: none; min-height: 44px; display: inline-flex; align-items: center; font-size: 0.93rem; line-height: 1.35; transition: all 0.15s ease;
    }
    .nav-tab:hover { color: #0f172a; background: rgba(255, 255, 255, 0.6); }
    .nav-tab.active { background: #ffffff; color: #1d4ed8; font-weight: 700; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .form-grid {
      display: flex; flex-direction: column; gap: 1rem; background: #ffffff; padding: 1.25rem 1.5rem; border-radius: 12px; margin-bottom: 1.25rem; border: 1px solid #e2e8f0; width: 100%; box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .form-tier { display: grid; gap: 0.85rem 1rem; width: 100%; }
    .form-tier-1 { grid-template-columns: 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
    .form-tier-2 { grid-template-columns: 1fr; border-bottom: 1px solid #f1f5f9; padding-bottom: 1rem; }
    .form-tier-3 { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; width: 100%; }
    @media (min-width: 640px) {
      .form-tier-1 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
      .form-tier-2 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
    }
    @media (max-width: 768px) {
      .form-tier-3 { flex-direction: column; align-items: stretch; }
      .form-tier-3 > div { margin-left: 0 !important; padding-top: 0 !important; }
    }
    .form-group { display: flex; flex-direction: column; gap: 0.35rem; min-width: 0; }
    .form-group label { font-size: 0.8rem; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.03em; }
    .form-group input, .form-group select {
      padding: 0.6rem 0.75rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; min-height: 44px; width: 100%; max-width: 100%; background: #ffffff; color: #0f172a; transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: #2563eb; outline: none; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    }
    .truth-banner {
      background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #2563eb; padding: 1rem 1.25rem; border-radius: 8px; margin-bottom: 1.25rem; font-size: 0.9rem; color: #1e3a8a; word-break: break-word; line-height: 1.55;
    }
    .truth-banner p { margin: 0.3rem 0; }
    .table-responsive {
      width: 100%; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; margin-top: 0.75rem; margin-bottom: 1.25rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03);
    }
    .comparison-table { width: 100%; border-collapse: collapse; font-size: 0.92rem; line-height: 1.45; }
    .comparison-table th {
      background: #f8fafc; font-weight: 700; font-size: 0.8rem; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; padding: 0.9rem 1rem; border-bottom: 2px solid #e2e8f0;
    }
    .comparison-table td {
      padding: 0.95rem 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; word-break: break-word; vertical-align: middle;
    }
    .comparison-table tbody tr:hover { background: #f8fafc; }
    .results-meta-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0 0.5rem; }
    .results-count-pill {
      display: inline-flex; align-items: center; padding: 0.3rem 0.85rem; background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; border-radius: 999px; font-weight: 700; font-size: 0.86rem;
    }
    .college-title { font-weight: 700; color: #0f172a; font-size: 0.98rem; line-height: 1.35; display: inline; }
    .college-code { color: #64748b; font-weight: 600; font-size: 0.85rem; }
    .type-pill {
      display: inline-block; font-size: 0.72rem; font-weight: 700; padding: 0.12rem 0.45rem; border-radius: 4px; letter-spacing: 0.02em; vertical-align: middle; margin-left: 0.35rem;
    }
    .type-gov { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .type-aided { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .type-univ { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
    .type-constituent { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
    .type-sfc { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .offering-subrow { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.35rem; font-size: 0.86rem; color: #475569; }
    .branch-pill { display: inline-block; padding: 0.15rem 0.5rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; font-weight: 700; font-size: 0.8rem; color: #1d4ed8; letter-spacing: 0.02em; }
    .district-tag { display: inline-block; color: #64748b; font-size: 0.82rem; font-weight: 500; }
    .cutoff-value { font-size: 1.18rem; font-weight: 800; color: #0f172a; font-variant-numeric: tabular-nums; white-space: nowrap; display: block; }
    .cutoff-subtext { font-size: 0.72rem; color: #64748b; font-weight: 500; display: block; margin-top: 2px; }
    .source-details { font-size: 0.8rem; color: #475569; }
    .source-details summary { cursor: pointer; color: #2563eb; font-weight: 600; list-style: none; display: inline-flex; align-items: center; gap: 0.25rem; }
    .source-details summary::-webkit-details-marker { display: none; }
    .source-details summary::after { content: " ▾"; font-size: 0.75rem; }
    .source-details[open] summary::after { content: " ▴"; }
    .source-details-body { margin-top: 0.25rem; font-size: 0.78rem; color: #64748b; line-height: 1.35; }
    .delta-badge {
      display: inline-block; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.88rem; background: #f1f5f9; border: 1px solid #e2e8f0; color: #1e293b; font-variant-numeric: tabular-nums; word-break: normal; overflow-wrap: normal; hyphens: manual;
    }
    .held-badge { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 0.25rem 0.55rem; border-radius: 6px; font-weight: 700; font-size: 0.82rem; display: inline-block; }
    .neutral-badge { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; padding: 0.25rem 0.55rem; border-radius: 6px; font-size: 0.82rem; display: inline-block; }
    .btn-action {
      display: inline-flex; align-items: center; justify-content: center; min-height: 42px; min-width: 42px; padding: 0.45rem 0.95rem; border: 1.5px solid #cbd5e1; background: #ffffff; border-radius: 8px; cursor: pointer; text-decoration: none; color: #334155; font-weight: 600; font-size: 0.88rem; white-space: nowrap; transition: all 0.15s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    }
    .btn-action:hover { background: #f8fafc; border-color: #94a3b8; }
    .btn-primary { background: #2563eb; color: #ffffff; border-color: #2563eb; box-shadow: 0 1px 3px rgba(37,99,235,0.25); }
    .btn-primary:hover { background: #1d4ed8; border-color: #1d4ed8; }
    .footnote { font-size: 0.82rem; color: #64748b; }
    .shortlist-badge { background: #10b981; color: #ffffff; padding: 0.15rem 0.55rem; border-radius: 12px; font-size: 0.78rem; font-weight: 700; margin-left: 0.4rem; }
    .shortlist-actions { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .comparison-table th:nth-child(4), .comparison-table td:nth-child(4) { display: none; }
    }
    @media (max-width: 480px) {
      .comparison-table th, .comparison-table td { padding: 0.5rem 0.35rem; font-size: 0.82rem; }
      .btn-action { padding: 0.35rem 0.5rem; font-size: 0.8rem; min-height: 38px; min-width: 38px; }
      .delta-badge { font-size: 0.76rem; padding: 0.15rem 0.35rem; line-height: 1.25; }
      .delta-caution { display: none; }
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
    <header class="m5-header-card">
      <h1>${esc(copy.title)}</h1>
      <p style="font-size: 1.02rem; color: #334155; margin: 0.35rem 0 0.45rem; line-height: 1.55; font-weight: 500;">
        ${t(
          "வணக்கம்! உங்கள் கட்-ஆஃப் மதிப்பெண்ணை TNEA அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீடுகளுடன் எளிதாக ஒப்பிட்டு, மாவட்ட வாரியாக கல்லூரிகளை ஆராய்ந்து உங்களுக்கான விருப்பப் பட்டியலைத் திட்டமிடுங்கள்.",
          "Welcome! Compare your marks with governed TNEA official provisional allotments, explore colleges across Tamil Nadu, and organize a balanced choice list for your counselling journey."
        )}
      </p>
      <p style="font-size: 0.88rem; color: #64748b; margin: 0; line-height: 1.5;">${esc(copy.nonPredictionDisclaimer)}</p>
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
            year,
            query,
            typeFilter,
            districtFilter,
            branchFilter,
            allDistricts,
            allBranches,
            onlyAvailable,
            sortOption,
            evaluatedRows,
            shortIds,
            rawShortlist,
            governedOfferings.length
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
  round: AllotmentRoundOrAll,
  communitySelected: boolean,
  year: number,
  query: string,
  typeFilter: string,
  districtFilter: string,
  branchFilter: string,
  allDistricts: string[],
  allBranches: Array<{ code: string; name: string }>,
  onlyAvailable: boolean,
  sortOption: string,
  rows: Array<{ college: CollegeMeta; offering: GovernedOffering; result: ComparisonResult }>,
  shortIds: string[],
  rawShortlist: string,
  totalOfferingsCount: number
): string {
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);
  const totalOfferings = totalOfferingsCount;
  const totalOfferingsFormatted = totalOfferings.toLocaleString("en-US");
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
        `தேர்ந்தெடுத்த ஒதுக்கீடு / பிரிவு / சுற்றிற்கு இந்தப் பட்டியலில் அங்கீகரிக்கப்பட்ட ${year} வரலாற்றுத் தரவு கிடைக்கவில்லை. தரவு இல்லாமை கல்லூரி அல்லது படிப்பு இல்லை என்பதைக் குறிக்காது.`,
        `No approved ${year} historical observation is available for the currently displayed offerings under the selected quota, community, and round. Missing historical data does not mean the college or branch is unavailable.`
      );
  const availableCount = rows.filter(
    (r) => r.result.status === "AVAILABLE" || r.result.status === "STUDENT_CUTOFF_MISSING"
  ).length;

  return `
    <section>
      <p class="scope-note screen-only" style="margin: 0 0 1rem; padding: 0.85rem 1.15rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.92rem; color: #334155; line-height: 1.55; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
        ${t(
          `<strong>வரம்பு:</strong> இந்தப் பக்கத்தில் அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டுத் தரவு ஒப்பீட்டிற்கு அங்கீகரிக்கப்பட்ட <strong>121 கல்லூரிகள் (1,249 படிப்புகள்)</strong> உள்ளன. தமிழ்நாட்டின் முழு 389 கல்லூரிகள் பட்டியலை மதிப்பெண் இன்றி ஆராய <a href="/colleges?lang=ta" style="color: #2563eb; font-weight: 600; text-decoration: underline;">கல்லூரிகள் பட்டியலைப் பார்க்கவும்</a>.`,
          `<strong>Dataset scope:</strong> This comparison workspace covers the <strong>121 approved colleges (1,249 offerings)</strong> with governed official provisional allotment evidence. To browse the broader 389-college 2026 TNEA listing without marks, visit the <a href="/colleges?lang=en" style="color: #2563eb; font-weight: 600; text-decoration: underline;">Colleges Directory</a>.`
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

        <!-- Tier 1: Admission Parameters (Cutoff, Quota, Category, Round, Year) -->
        <div class="form-tier form-tier-1">
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
              <option value="ALL" ${round === "ALL" ? "selected" : ""}>${esc(copy.roundName("ALL"))}</option>
              ${(["ROUND_1", "ROUND_2", "ROUND_3"] as AllotmentRound[])
                .map(
                  (r) =>
                    `<option value="${r}" ${round === r ? "selected" : ""}>${esc(copy.roundName(r))}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="form-group">
            <label for="year-select">${t("கலந்தாய்வு ஆண்டு (Year)", "Counselling Year")}</label>
            <select id="year-select" name="year">
              <option value="2026" ${year === 2026 ? "selected" : ""}>${t("2026 (121 கல்லூரிகள்)", "2026 (121 Colleges)")}</option>
              <option value="2025" ${year === 2025 ? "selected" : ""}>${t("2025 (55 கல்லூரிகள்)", "2025 (55 Colleges)")}</option>
            </select>
          </div>
        </div>

        <!-- Tier 2: Search & Classification Filters (College Type, District, Branch, Search) -->
        <div class="form-tier form-tier-2">
          <div class="form-group">
            <label for="type-select">${t("கல்லூரி வகை", "College Type")}</label>
            <select id="type-select" name="type">
              <option value="all" ${typeFilter === "all" ? "selected" : ""}>${t("அனைத்து கல்லூரி வகைகள்", "All College Types")}</option>
              <option value="GOVERNMENT" ${typeFilter === "GOVERNMENT" ? "selected" : ""}>${t("அரசுப் பொறியியல் கல்லூரிகள் (11)", "Government Engineering Colleges (11)")}</option>
              <option value="AIDED" ${typeFilter === "AIDED" ? "selected" : ""}>${t("அரசு உதவிபெறும் கல்லூரிகள் (3)", "Govt. Aided Engineering Colleges (3)")}</option>
              <option value="UNIVERSITY" ${typeFilter === "UNIVERSITY" ? "selected" : ""}>${t("அண்ணா / அண்ணாமலைப் பல்கலைக்கழகத் துறைகள் (5)", "University Departments (Anna / Annamalai) (5)")}</option>
              <option value="CONSTITUENT" ${typeFilter === "CONSTITUENT" ? "selected" : ""}>${t("அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள் (16)", "Anna Univ. Constituent Colleges (16)")}</option>
              <option value="SFC" ${typeFilter === "SFC" ? "selected" : ""}>${t("சுயநிதிப் பொறியியல் கல்லூரிகள் — தன்னாட்சி (86)", "Self-Financing Engineering Colleges — Autonomous (86)")}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="district-select">${t("மாவட்டம்", "District")}</label>
            <select id="district-select" name="district">
              <option value="" ${!districtFilter ? "selected" : ""}>${t("அனைத்து மாவட்டங்கள்", "All Districts")}</option>
              ${allDistricts
                .map(
                  (d) =>
                    `<option value="${esc(d)}" ${districtFilter.toLowerCase() === d.toLowerCase() ? "selected" : ""}>${esc(d)}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="form-group">
            <label for="branch-select">${t("துறை / கிளை", "Branch / Department")}</label>
            <select id="branch-select" name="branch">
              <option value="" ${!branchFilter ? "selected" : ""}>${t("அனைத்து கிளைகள்", "All Branches")}</option>
              ${allBranches
                .map(
                  (b) =>
                    `<option value="${esc(b.code)}" ${branchFilter === b.code ? "selected" : ""}>${esc(formatBranchDropdownLabel(b.name))} (${esc(b.code)})</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="form-group">
            <label for="search-input">${t("தேடல் (கல்லூரி / கிளை / மாவட்டம்)", "Search (College / Branch / District)")}</label>
            <input id="search-input" type="text" name="q" value="${esc(query)}" placeholder="${t("எ.கா. CEG, PSG, CIT, CSE, கோவை", "e.g. CEG, PSG, CIT, CSE, Coimbatore")}">
          </div>
        </div>

        <!-- Tier 3: Results Display Controls & Actions (Sort By, Available Filter, Buttons) -->
        <div class="form-tier form-tier-3">
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div class="form-group" style="min-width: 230px;">
              <label for="sort-select">${t("வரிசைப்படுத்து", "Sort By")}</label>
              <select id="sort-select" name="sort">
                <option value="cutoff_desc" ${sortOption === "cutoff_desc" ? "selected" : ""}>${t("கட்-ஆஃப்: உயர்வு முதல் குறைவு (பரிந்துரை)", "Cutoff: High to Low (Default)")}</option>
                <option value="cutoff_asc" ${sortOption === "cutoff_asc" ? "selected" : ""}>${t("கட்-ஆஃப்: குறைவு முதல் உயர்வு", "Cutoff: Low to High")}</option>
                ${studentCutoff !== null ? `<option value="delta_closest" ${sortOption === "delta_closest" ? "selected" : ""}>${t("என் மதிப்பெண்ணிற்கு மிக நெருக்கமானவை", "Closest to My Cutoff")}</option>` : ""}
                <option value="college_name" ${sortOption === "college_name" ? "selected" : ""}>${t("கல்லூரி பெயர் (A-Z)", "College Name (A-Z)")}</option>
                <option value="college_code" ${sortOption === "college_code" ? "selected" : ""}>${t("கல்லூரி குறியீடு எண்", "College Code")}</option>
              </select>
            </div>

            <label style="display: inline-flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #334155; padding-top: 1.25rem;">
              <input type="checkbox" name="only_available" value="1" ${onlyAvailable ? "checked" : ""} style="width: 1.15rem; height: 1.15rem; min-height: 0; cursor: pointer;">
              <span>${t("கட்-ஆஃப் தரவு உள்ள படிப்புகளை மட்டும் காட்டு", "Show only offerings with available cutoff data")}</span>
            </label>
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; padding-top: 1.25rem;">
            ${
              districtFilter || branchFilter || query || typeFilter !== "all" || onlyAvailable || sortOption !== "cutoff_desc"
                ? `<a class="btn-action" href="?tab=comparison&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">${t("வடிகட்டிகளை நீக்கு", "Clear Filters")}</a>`
                : ""
            }
            <button type="submit" class="btn-action btn-primary" style="padding: 0.6rem 1.4rem; font-size: 0.95rem;">${t("தேடு &amp; ஒப்பிடு", "Search &amp; Compare")}</button>
          </div>
        </div>
      </form>

      <details class="community-guide screen-only" style="margin: 0 0 0.75rem; padding: 0.75rem 1rem; background: #fff; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 0.9rem; color: #2d3748;">
        <summary style="cursor: pointer; font-weight: 600; color: #2b6cb0; padding: 0.2rem 0;">${t("இட ஒதுக்கீட்டுப் பிரிவுகள் (OC / BC / MBC / SC / ST) — எளிய விளக்கம்", "Reservation Community Categories (OC / BC / MBC / SC / ST) — Quick Guide")}</summary>
        <ul style="margin: 0.5rem 0 0.25rem; padding-left: 1.2rem; line-height: 1.6;">
          <li><strong>OC</strong> — ${t("பொதுப் பிரிவு (Open Competition): அனைத்து வகுப்பினரும் தகுதியின் அடிப்படையில் போட்டியிடக்கூடிய பொது இடங்கள்.", "Open Competition: Open merit pool available to all eligible candidates regardless of community.")}</li>
          <li><strong>BC / BCM</strong> — ${t("பிற்படுத்தப்பட்டோர் (Backward Class) மற்றும் பிற்படுத்தப்பட்ட முஸ்லிம் (BC Muslim).", "Backward Class (BC) and Backward Class Muslim (BCM).")}</li>
          <li><strong>MBC</strong> — ${t("மிகவும் பிற்படுத்தப்பட்டோர் மற்றும் சீர்மரபினர் (MBC / DNC).", "Most Backward Class and Denotified Communities (MBC / DNC).")}</li>
          <li><strong>SC / SCA / ST</strong> — ${t("ஆதிதிராவிடர் (SC), அருந்ததியர் (SCA) மற்றும் பழங்குடியினர் (ST).", "Scheduled Caste (SC), Scheduled Caste Arunthathiyar (SCA), and Scheduled Tribe (ST).")}</li>
        </ul>
        <p style="margin: 0.35rem 0 0; font-size: 0.85rem; color: #4a5568;">${t("உங்கள் சாதிச் சான்றிதழின்படி பொருந்தும் பிரிவை நீங்களே தேர்ந்தெடுங்கள்; தளம் தானாகப் பிரிவைக் கணிக்காது.", "Select the category that matches your official certificate; this tool never infers your category.")}</p>
      </details>

      <details class="delta-guide screen-only" style="margin: 0 0 1rem; padding: 0.85rem 1rem; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; font-size: 0.9rem; color: #14532d; line-height: 1.6;">
        <summary style="cursor: pointer; font-weight: 700; color: #15803d; padding: 0.2rem 0; font-size: 0.95rem;">
          ${t("💡 கட்-ஆஃப் ஒப்பீட்டு வேறுபாடு (Δ) கணக்கீடு மற்றும் விருப்பப் பட்டியல் அமைக்கும் முறை", "💡 How Comparison Delta (Δ) Works & Practical Guide for Structuring Your Choice List")}
        </summary>
        <div style="margin-top: 0.65rem; border-top: 1px solid #bbf7d0; padding-top: 0.65rem;">
          <p style="margin: 0 0 0.5rem;">
            <strong>${t("கணக்கிடும் முறை:", "Calculation Method:")}</strong>
            <code style="background: #dcfce7; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700; color: #166534;">${t("உங்கள் கட்-ஆஃப் மதிப்பெண் − கண்டறியப்பட்ட தற்காலிக குறைந்தபட்ச மதிப்பெண் = ஒப்பீட்டு வேறுபாடு (Δ)", "Your Cutoff Mark − Observed Provisional Allotment Minimum Mark = Comparison Delta (Δ)")}</code>
          </p>
          <ul style="margin: 0.35rem 0 0.65rem; padding-left: 1.2rem;">
            <li>
              <strong>${t("கூடுதல் மதிப்பெண் (+):", "Positive (+) Difference:")}</strong>
              ${t(
                "உதாரணமாக, <strong>+3.00</strong> — முந்தைய ஆண்டு தற்காலிக ஒதுக்கீட்டில் இந்த இடத்திற்கு ஒதுக்கப்பட்ட மிகக் குறைந்த மதிப்பெண்ணை விட உங்கள் கட்-ஆஃப் 3.00 மதிப்பெண்கள் அதிகம்.",
                "e.g., <strong>+3.00</strong> — Your cutoff mark is 3.00 marks higher than the lowest score allotted for this offering in the past provisional allotment."
              )}
            </li>
            <li>
              <strong>${t("குறைவான மதிப்பெண் (−):", "Negative (−) Difference:")}</strong>
              ${t(
                "உதாரணமாக, <strong>-3.00</strong> — முந்தைய ஆண்டு தற்காலிக ஒதுக்கீட்டில் இந்த இடத்திற்கு ஒதுக்கப்பட்ட மிகக் குறைந்த மதிப்பெண்ணை விட உங்கள் கட்-ஆஃப் 3.00 மதிப்பெண்கள் குறைவு.",
                "e.g., <strong>-3.00</strong> — Your cutoff mark is 3.00 marks lower than the lowest score allotted for this offering in the past provisional allotment."
              )}
            </li>
            <li>
              <strong>${t("பூஜ்ஜியம் (0.00):", "Zero (0.00):")}</strong>
              ${t("முந்தைய ஆண்டு தற்காலிக ஒதுக்கீட்டில் கண்டறியப்பட்ட குறைந்தபட்ச மதிப்பெண்ணிற்குச் சமம்.", "Exact match with the past provisional allotment observed minimum mark.")}
            </li>
          </ul>

          <div style="background: #ffffff; padding: 0.75rem 0.9rem; border: 1px solid #bbf7d0; border-radius: 6px; margin-top: 0.5rem;">
            <strong style="color: #15803d; display: block; margin-bottom: 0.35rem;">
              ${t("🎯 TNEA விருப்பப் பட்டியலை (Choice List) வரிசைப்படுத்தும் வழிமுறை:", "🎯 Structuring Your TNEA Choice List Preference Order:")}
            </strong>
            <p style="margin: 0 0 0.45rem; font-size: 0.88rem; color: #1f2937;">
              <strong>${t("உங்கள் விருப்பங்களை உண்மையான முன்னுரிமைப்படி வரிசை எண் 1, 2, 3... என அமைப்பது பாதுகாப்பானது.", "Organizing your choices according to your genuine priority order (#1, #2, #3...) carries zero disadvantage.")}</strong><br>
              ${t(
                "TNEA கலந்தாய்வு கணினி உங்கள் விருப்பங்களை மேலிருந்து கீழாக மட்டுமே வரிசையாகப் பார்க்கும். முதல் விருப்பத்தில் இடம் கிடைக்காவிட்டால், அடுத்த விருப்பத்தை எந்தப் பாதிப்பும் இன்றி தானாகவே பரிசீலிக்கும். தற்காலிக ஒதுக்கீட்டிற்குப் பிறகு நீங்கள் 'மேல்நோக்கிய நகர்வு' (Upward Movement) கோரினால், கணினி எப்போதுமே உங்கள் தற்போதைய ஒதுக்கீட்டை விட மேலே உள்ள விருப்பங்களை (#1 நோக்கி) மட்டுமே முன்னுரிமைப்படுத்தும். எனவே விருப்பங்களை உங்கள் உண்மையான விருப்ப வரிசைப்படி அச்சமின்றி வரிசைப்படுத்துங்கள்.",
                "The TNEA single-window allocation algorithm processes choices strictly sequentially from Choice #1 downwards. If you are not eligible for Choice #1, the system automatically evaluates Choice #2 with zero penalty. Furthermore, Upward Movement after tentative allotment strictly seeks vacancies in choices placed above your current allotment (moving toward Choice #1). Therefore, candidates should order choices purely by their genuine personal preferences."
              )}
            </p>
          </div>
        </div>
      </details>

      <details class="rounds-guide screen-only" style="margin: 0 0 1rem; padding: 0.85rem 1rem; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; color: #1e293b; line-height: 1.6;">
        <summary style="cursor: pointer; font-weight: 700; color: #1e40af; padding: 0.2rem 0; font-size: 0.95rem;">
          ${t("🏛️ TNEA கலந்தாய்வு சுற்றுகள் (Round 1, 2, 3) &amp; நடைமுறை நிலைகள் — அதிகாரப்பூர்வ விளக்கம்", "🏛️ TNEA Counselling Rounds Architecture (Round 1, 2, 3) &amp; Allotment Stages — Official Guide")}
        </summary>
        <div style="margin-top: 0.65rem; border-top: 1px solid #e2e8f0; padding-top: 0.65rem;">
          <p style="margin: 0 0 0.5rem; font-size: 0.88rem; color: #334155;">
            ${t(
              "TNEA ஒற்றைச் சாளரப் பொறியியல் கலந்தாய்வு பொதுத் தரவரிசை (General Merit Rank) மற்றும் 200-க்கு கணக்கிடப்படும் கட்-ஆஃப் மதிப்பெண்களின் அடிப்படையில் 3 தொடர்ச்சியான சுற்றுகளாக நடத்தப்படுகிறது.",
              "TNEA single-window engineering counselling is conducted across 3 sequential rounds based strictly on candidate General Merit Rank and aggregate cut-off score (out of 200)."
            )}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.65rem; margin: 0.5rem 0 0.85rem;">
            <div style="background: #ffffff; border: 1px solid #bfdbfe; border-left: 3px solid #2563eb; padding: 0.65rem 0.8rem; border-radius: 6px;">
              <strong style="color: #1d4ed8; display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">
                ${t("சுற்று 1 (Round 1)", "Round 1")}
              </strong>
              <div style="font-size: 0.83rem; color: #475569; line-height: 1.45;">
                <strong>${t("தரவரிசை:", "Rank:")}</strong> 1 - ~24,000<br>
                <strong>${t("கட்-ஆஃப்:", "Cut-off:")}</strong> 200.00 - ~179.00<br>
                <span>${t("தொடக்க சுற்றுக்குத் தகுதிபெற்ற தரவரிசைப் பிரிவு. முதல் சுற்றில் இட ஒதுக்கீடுகள் தொடங்குகின்றன.", "Initial qualifying rank band. Allotments begin in the first counselling round.")}</span>
              </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #bfdbfe; border-left: 3px solid #2563eb; padding: 0.65rem 0.8rem; border-radius: 6px;">
              <strong style="color: #1d4ed8; display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">
                ${t("சுற்று 2 (Round 2)", "Round 2")}
              </strong>
              <div style="font-size: 0.83rem; color: #475569; line-height: 1.45;">
                <strong>${t("தரவரிசை:", "Rank:")}</strong> ~24,001 - ~75,000<br>
                <strong>${t("கட்-ஆஃப்:", "Cut-off:")}</strong> ~178.99 - ~145.00<br>
                <span>${t("நடுத்தர மதிப்பெண் பெற்ற மாணவர்கள். அரசு உதவிபெறும் மற்றும் தன்னாட்சி கல்லூரிகளில் பரவலான ஒதுக்கீடுகள்.", "Mid rankers. Allotments across autonomous SFCs and govt-aided institutions.")}</span>
              </div>
            </div>

            <div style="background: #ffffff; border: 1px solid #bfdbfe; border-left: 3px solid #2563eb; padding: 0.65rem 0.8rem; border-radius: 6px;">
              <strong style="color: #1d4ed8; display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">
                ${t("சுற்று 3 (Round 3)", "Round 3")}
              </strong>
              <div style="font-size: 0.83rem; color: #475569; line-height: 1.45;">
                <strong>${t("தரவரிசை:", "Rank:")}</strong> ${t("~75,001 முதல் கடைசி வரை", "~75,001 to qualifying rank")}<br>
                <strong>${t("கட்-ஆஃப்:", "Cut-off:")}</strong> ~144.99 - ~77.50<br>
                <span>${t("தகுதிபெற்ற பிற மாணவர்கள். உறுப்புக் கல்லூரிகள் மற்றும் பிற கல்லூரிகளில் இடங்கள்.", "Qualifying rankers. Regional constituent colleges and remaining seats.")}</span>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; padding: 0.75rem 0.9rem; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 0.65rem;">
            <strong style="color: #0f172a; display: block; margin-bottom: 0.35rem; font-size: 0.88rem;">
              ${t("🔄 ஒவ்வொரு சுற்றிலும் உள்ள 4 தொடர் நிலைகள்:", "🔄 4 Sequential Stages of Every Counselling Round:")}
            </strong>
            <ol style="margin: 0.25rem 0 0; padding-left: 1.2rem; font-size: 0.85rem; color: #334155; line-height: 1.55;">
              <li><strong>${t("1. விருப்பப் பதிவு (Choice Filling — 3 நாட்கள்):", "1. Choice Filling (3 Days):")}</strong> ${t("உங்கள் சுற்றில் உள்ள அனைத்துக் கல்லூரிகளையும் விருப்ப வரிசைப்படி (Choice 1, 2, 3...) வரம்பற்ற அளவில் சேர்க்கலாம். குறிப்பிட்ட காலக்கெடுவுக்குள் லாக் செய்ய வேண்டும்.", "Candidates add unlimited college-programme choices ordered by preference (#1, #2, #3...) and lock before the deadline.")}</li>
              <li><strong>${t("2. தற்காலிக ஒதுக்கீடு (Tentative Allotment — 4-ஆம் நாள் காலை 10 மணி):", "2. Tentative Allotment (Day 4, 10 AM):")}</strong> ${t("கணினி உங்கள் விருப்பப் பட்டியலை மேலிருந்து கீழாகப் பார்த்து, உங்கள் தரவரிசை மற்றும் வகுப்பிற்கு உகந்த மிக உயர்ந்த முன்னுரிமை இடத்தை ஒதுக்கும்.", "Computer algorithm evaluates your choices sequentially from #1 downwards, allotting the highest preference where an eligible seat is open.")}</li>
              <li><strong>${t("3. தற்காலிக உறுதிப்படுத்தல் &amp; மேல்நோக்கிய நகர்வு (Confirmation — 2 நாட்கள்):", "3. Tentative Confirmation (2 Days):")}</strong>
                ${t(
                  "கிடைத்த இடத்தை ஏற்று கல்லூரியில் சேரலாம் (Accept &amp; Join), அல்லது அந்த இடத்தை தக்கவைத்துக்கொண்டு Choice #1-ஐ நோக்கி மேலே முன்னேறக் கோரலாம் (Accept &amp; Upward — TFC உதவி மையத்திற்குச் சென்று சரிபார்ப்பு அவசியம்). இடத்தை நிராகரித்து மேலே மட்டும் முன்னேறக் கோரலாம் (Decline &amp; Upward), அல்லது அடுத்த சுற்றுக்குச் செல்லலாம் (Decline &amp; Next Round).",
                  "Options include Accept &amp; Join (confirm seat), Accept &amp; Upward (hold seat and request upward movement toward Choice #1 via mandatory TFC reporting), Decline &amp; Upward (relinquish seat, seek upward choices only), or Decline &amp; Next Round."
                )}
              </li>
              <li><strong>${t("4. இறுதி ஒதுக்கீடு (Final Allotment):", "4. Final Provisional Allotment:")}</strong> ${t("மேல்நோக்கிய நகர்வு கணக்கிடப்பட்டு இறுதி ஒதுக்கீட்டுக் கடிதம் வெளியிடப்படும். காலியிடங்கள் அடுத்த சுற்றுக்கு மாற்றப்படும்.", "Upward movements are finalized using vacated seats, and final allotment orders are released. Unfilled seats roll over to the next round.")}</li>
            </ol>
          </div>

          <div style="background: #eff6ff; padding: 0.65rem 0.85rem; border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 0.84rem; color: #1e3a8a;">
            <strong>${t("📌 2025 கலந்தாய்வு தரவு பற்றிய குறிப்பு:", "📌 Note on 2025 Historical Data:")}</strong><br>
            ${t(
              "2025-ஆம் ஆண்டின் கலந்தாய்வில், பொதுக் கல்விப் பிரிவிற்கு அதிகாரப்பூர்வமாக சுற்று 2 மற்றும் சுற்று 3 வெளியீடுகளும், 7.5% அரசுப் பள்ளி ஒதுக்கீட்டிற்கு சுற்று 1 மற்றும் சுற்று 2 வெளியீடுகளும் மட்டுமே கிடைத்தன (பொதுக் கல்வி சுற்று 1 மற்றும் 7.5% ஒதுக்கீட்டு சுற்று 3 வெளியிடப்படவில்லை). மற்ற சுற்றுகளின் தரவைப் பார்க்க மேலே உள்ள 'சுற்று' தேர்வைப் பயன்படுத்தவும்.",
              "For the 2025 admission cycle, official provisional allotment publications were released for General Academic (Round 2 and Round 3) and 7.5% Government School Quota (Round 1 and Round 2). General Academic Round 1 and 7.5% Quota Round 3 publications were not released. Use the 'Round' selector above to inspect benchmarks across available rounds."
            )}
          </div>
        </div>
      </details>

      <div class="active-context-strip" role="status" style="margin: 0 0 1rem; padding: 0.8rem 1rem; background: #edf2f7; border-left: 4px solid #2b6cb0; border-radius: 4px; font-size: 0.9rem; color: #1a202c; line-height: 1.5;">
        <div>
          <strong>${t("தற்போது தேர்ந்தெடுத்துள்ள விவரம்:", "Current Comparison Context:")}</strong>
          ${year} · ${esc(copy.quotaName(quota))} · <strong>${esc(copy.communityName(community))}</strong> · ${esc(copy.roundName(round))}
          ${districtFilter ? ` · ${t("மாவட்டம்:", "District:")} <strong>${esc(districtFilter)}</strong>` : ""}
          ${branchFilter ? ` · ${t("கிளை:", "Branch:")} <strong>${esc(branchFilter)}</strong>` : ""}
          ${query ? ` · ${t("தேடல்:", "Search:")} <strong>${esc(query)}</strong>` : ""}
          ${onlyAvailable ? ` · <strong>${t("கட்-ஆஃப் உள்ளவை மட்டும்", "Only available")}</strong>` : ""}
          (${
            rows.length === totalOfferings
              ? t(
                  `மொத்தமுள்ள ${totalOfferingsFormatted} படிப்புகளில், ${esc(copy.roundName(round))}-ல் ${availableCount} படிப்புகளில் இடங்கள் ஒதுக்கப்பட்டுள்ளன`,
                  `${availableCount} of ${totalOfferingsFormatted} total offerings were allotted in ${esc(copy.roundName(round))}`
                )
              : t(
                  `காட்டப்படும் ${rows.length} படிப்புகளில், ${esc(copy.roundName(round))}-ல் ${availableCount} படிப்புகளில் இடங்கள் ஒதுக்கப்பட்டுள்ளன`,
                  `${availableCount} of ${rows.length} shown offerings were allotted in ${esc(copy.roundName(round))}`
                )
          })
        </div>
        ${
          year === 2025
            ? `<p style="margin: 0.35rem 0 0; font-size: 0.83rem; color: #4a5568;">${t(
                "<strong>2025 வரம்புத் தகவல்:</strong> 2025-ஆம் ஆண்டின் வரலாற்றுத் தரவு 55 அடிப்படை கல்லூரிகளுக்கு (536 படிப்புகள்) மட்டுமே பொருந்தும். புதிதாக சேர்க்கப்பட்ட தன்னாட்சி கல்லூரிகளுக்கான ஒதுக்கீட்டுத் தரவைப் பார்க்க மேலே உள்ள 'கலந்தாய்வு ஆண்டு' தேர்வில் <strong>2026</strong>-ஐத் தேர்ந்தெடுக்கவும்.",
                "<strong>2025 Scope Note:</strong> 2025 historical allotments are available for the 55 benchmark colleges (536 offerings). Newly added autonomous institutions only have 2026 data; select <strong>2026</strong> above to inspect complete 121-college coverage."
              )}</p>`
            : `<p style="margin: 0.35rem 0 0; font-size: 0.83rem; color: #4a5568;">${t(
                "<strong>2026 முழு வரம்பு:</strong> 2026-ஆம் ஆண்டின் தற்காலிக ஒதுக்கீட்டுத் தரவு 121 கல்லூரிகளுக்கும் (1,249 படிப்புகள்) முழுமையாகக் கிடைக்கிறது.",
                "<strong>2026 Complete Scope:</strong> 2026 provisional allotment data is active across all 121 approved colleges (1,249 offerings)."
              )}</p>`
        }
        ${
          year === 2025 && quota === "GENERAL_ACADEMIC"
            ? `<p style="margin: 0.4rem 0 0; font-size: 0.84rem; color: #2d3748;">${t(
                "<strong>முக்கியக் குறிப்பு (சுற்று 1 தரவு இல்லை):</strong> பொதுக் கல்விப் பிரிவுக்கு 2025 அதிகாரப்பூர்வ <strong>சுற்று 2</strong> மற்றும் <strong>சுற்று 3</strong> வெளியீடுகள் மட்டுமே இங்கு அங்கீகரிக்கப்பட்டுள்ளன. சுற்று 1-லேயே அனைத்து இடங்களும் நிரம்பிய படிப்புகளுக்கு 'ஒப்பீட்டிற்கு கிடைக்கவில்லை' என்று காட்டப்படும் — இதன் பொருள் அந்தக் கல்லூரி அல்லது படிப்பு இல்லை என்பதல்ல. உங்கள் பிரிவு (எ.கா. BC, MBC, SC) அல்லது 7.5% ஒதுக்கீட்டைத் தேர்ந்தெடுத்துப் பார்க்கவும்.",
                "<strong>Coverage note (No Round 1 for General Academic):</strong> Only official 2025 <strong>Round 2</strong> and <strong>Round 3</strong> publications are approved here for General Academic. Offerings where all seats were filled during Round 1 appear as 'Not available for comparison' — this does NOT mean the college or branch is unavailable."
              )}</p>`
            : ""
        }
      </div>

      <aside class="truth-banner" aria-label="Official truth-in-guidance disclosures">
        <p><strong>${t("முக்கியக் குறிப்பு — அதிகாரப்பூர்வ வெளிப்படைத்தன்மை அறிவிப்பு:", "Important Note — Official Truth-in-Guidance Disclosure:")}</strong></p>
        <p>${esc(historicalDisclosure)}</p>
        <p>${esc(copy.nonPredictionDisclaimer)}</p>
        <p style="font-size: 0.86rem; color: #4a5568;">
          ${t(
            `அங்கீகரிக்கப்பட்ட 121 கல்லூரிகளில் உள்ள ${totalOfferingsFormatted} படிப்புகளும் கீழே பட்டியலிடப்பட்டுள்ளன. முந்தைய ஆண்டு அதிகாரப்பூர்வத் தரவு இல்லாத படிப்புகளுக்கு மட்டும் 'ஒப்பீட்டிற்குத் தரவு இல்லை' என்று தெளிவாகக் குறிக்கப்பட்டுள்ளது.`,
            `All ${totalOfferingsFormatted} governed offerings across the 121 approved institutions are listed below. Where approved historical evidence is absent, offerings are transparently shown as 'Not available for comparison'.`
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

      <div class="results-meta-bar screen-only">
        <span class="results-count-pill">
          ${t(`${rows.length} முடிவுகள்`, `${rows.length} results`)}
        </span>
        <span style="font-size: 0.84rem; color: #4a5568;">
          ${t(
            "விருப்பமான படிப்பின் அருகே உள்ள '+ சேர்' பட்டனை அழுத்தி உங்கள் தனிப்பட்ட விருப்பப் பட்டியலில் சேர்க்கலாம் (இது தளத்தின் பரிந்துரை அல்ல; 'என் விருப்பப் பட்டியல்' பகுதியில் நீங்களே வரிசையை மாற்றலாம்).",
            "Found a course you like? Click '+ Add' to save it to your personal shortlist (not a system recommendation; you manually set the final preference order in 'My Shortlist')."
          )}
        </span>
      </div>

      <div class="table-responsive">
        <table class="comparison-table" role="table" aria-label="College Cutoff Comparison Table">
          <thead>
            <tr>
              <th scope="col">${t("கல்லூரி &amp; கிளை", "College &amp; Programme")}</th>
              <th scope="col">${esc(t(`கண்டறியப்பட்ட குறைந்தபட்ச மதிப்பெண் (${year})`, `Observed Minimum Mark (${year})`))}</th>
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
                      return renderOfferingRow(r, copy, isShortlisted, lang, rawShortlist, {
                        studentCutoff,
                        quota,
                        community,
                        round,
                        communitySelected,
                        year,
                        query,
                        typeFilter,
                        districtFilter,
                        branchFilter,
                        onlyAvailable,
                        sortOption,
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
    round: AllotmentRoundOrAll;
    communitySelected: boolean;
    year: number;
    query: string;
    typeFilter: string;
    districtFilter: string;
    branchFilter: string;
    onlyAvailable: boolean;
    sortOption: string;
  }
): string {
  const { college, offering, result } = row;
  const id = `${college.code}~${offering.programmeCode}`;
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);

  const typeBadgeClass: Record<string, string> = {
    GOVERNMENT: "type-gov",
    AIDED: "type-aided",
    UNIVERSITY: "type-univ",
    CONSTITUENT: "type-constituent",
    SFC: "type-sfc",
  };
  const typeBadgeLabel: Record<string, { ta: string; en: string }> = {
    GOVERNMENT: { ta: "அரசு", en: "Govt" },
    AIDED: { ta: "அரசு உதவி", en: "Govt Aided" },
    UNIVERSITY: { ta: "பல்கலைக்கழகம்", en: "Univ Dept" },
    CONSTITUENT: { ta: "உறுப்புக் கல்லூரி", en: "Constituent" },
    SFC: { ta: "தன்னாட்சி", en: "Autonomous SFC" },
  };
  const colType = college.type || "SFC";

  let deltaHtml = "";
  if (result.isHeld) {
    deltaHtml = `<span class="held-badge">${esc(copy.heldNotice)}</span>`;
  } else if (result.status === "NO_HISTORICAL_DATA") {
    if (result.otherRound && result.otherRoundAction === "ALLOTTED_IN_LATER_ROUND") {
      deltaHtml = `<span class="neutral-badge" style="background: #f8fafc; border-left: 3px solid #3b82f6;">${esc(
        t(
          `${copy.roundName(sessionState.round)}-ல் ஒதுக்கீடு இல்லை (${copy.roundName(result.otherRound)}-ல் முடிந்தது: ${result.otherRoundMark?.toFixed(2)})`,
          `No ${copy.roundName(sessionState.round)} allotment (${copy.roundName(result.otherRound)} closing: ${result.otherRoundMark?.toFixed(2)})`
        )
      )}</span>`;
    } else if (result.otherRound && result.otherRoundAction === "FILLED_IN_EARLIER_ROUND") {
      deltaHtml = `<span class="neutral-badge" style="background: #f8fafc; border-left: 3px solid #f59e0b;">${esc(
        t(
          `${copy.roundName(sessionState.round)}-க்கு முன் முடிந்தது (${copy.roundName(result.otherRound)}-ல் முடிந்தது: ${result.otherRoundMark?.toFixed(2)})`,
          `Filled before ${copy.roundName(sessionState.round)} (${copy.roundName(result.otherRound)} closing: ${result.otherRoundMark?.toFixed(2)})`
        )
      )}</span>`;
    } else {
      deltaHtml = `<span class="neutral-badge">${esc(copy.noDataNotice)}</span>`;
    }
  } else if (result.status === "STUDENT_CUTOFF_MISSING") {
    deltaHtml = `<span class="neutral-badge">${t("கட்-ஆஃப் உள்ளிடவும்", "Enter cutoff")}</span>`;
  } else if (result.delta !== null) {
    deltaHtml = `<span class="delta-badge">${esc(copy.formatDelta(result.delta))}</span><small class="delta-caution" style="display: block; margin-top: 2px; font-size: 0.72rem; color: #64748b; line-height: 1.3;">${t("கடந்த ஆண்டு வரலாற்றுப் பதிவு மட்டுமே — சேர்க்கை உத்தரவாதமோ கணிப்போ அல்ல", "Past historical benchmark only — not a guarantee or prediction")}</small>`;
  }

  // Toggle shortlist action via privacy-preserving POST form so cutoff/community/search remain intact in memory without appearing in GET URLs
  const nextShortlist = isShortlisted
    ? shortIdsWithout(rawShortlist, id)
    : shortIdsWith(rawShortlist, id);

  let sourceHtml = "—";
  if (result.isHeld) {
    sourceHtml = `<span class="footnote">${esc(
      t(
        "2026 கல்லூரி கையேடு பக். 160 — உறுதிப்படுத்தல் நிலுவையில்",
        "Booklet p. 160 '(Previous year data)' hold"
      )
    )}</span>`;
  } else if (result.status === "NO_HISTORICAL_DATA") {
    if (result.otherRound) {
      sourceHtml = `<span class="footnote">${esc(copy.roundName(result.otherRound))}</span>`;
    } else {
      sourceHtml = `<span class="footnote">${esc(t("தரவு இல்லை", "No data"))}</span>`;
    }
  } else if (result.locator) {
    const fullCitation =
      lang === "ta" && result.round
        ? `${result.year ?? 2026} TNEA அதிகாரப்பூர்வ ${copy.roundName(result.round)} — ${copy.quotaName(sessionState.quota)} (${result.locator})`
        : `${result.sourceTitle ?? ""} (${result.locator})`;
    const shortTag = result.round
      ? `${result.year ?? 2026} · ${copy.roundName(result.round)}`
      : `${result.year ?? 2026}`;
    sourceHtml = `<details class="source-details"><summary>${esc(shortTag)}</summary><div class="source-details-body">${esc(fullCitation)}</div></details>`;
  }

  return `
    <tr>
      <td>
        <span class="college-title">${esc(college.name)}</span> <span class="college-code">(${esc(college.code)})</span>
        <span class="type-pill ${typeBadgeClass[colType] || "type-sfc"}">${esc(t(typeBadgeLabel[colType]?.ta || colType, typeBadgeLabel[colType]?.en || colType))}</span>
        <div class="offering-subrow">
          <span class="branch-pill">${esc(offering.programmeCode)}</span>
          <span>${esc(offering.programmeName)}</span>
          <span class="district-tag">· ${esc(college.district)}</span>
        </div>
      </td>
      <td>
        <span class="cutoff-value">${
          result.isHeld
            ? "—"
            : result.historicalMin !== null
            ? result.historicalMin.toFixed(2)
            : "—"
        }</span>
        ${
          !result.isHeld && result.historicalMin !== null && result.round
            ? `<span class="cutoff-subtext">${esc(copy.roundName(result.round))} · ${result.year ?? 2026}</span>`
            : !result.isHeld && result.otherRound && result.otherRoundMark !== null && result.otherRoundMark !== undefined
            ? `<span class="cutoff-subtext" style="color: #64748b;">${esc(copy.roundName(result.otherRound))}: ${result.otherRoundMark.toFixed(2)}</span>`
            : ""
        }
      </td>
      <td>
        ${deltaHtml}
      </td>
      <td>
        ${sourceHtml}
      </td>
      <td>
        <form method="POST" action="/m5-guidance" class="shortlist-toggle-form" style="margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(nextShortlist)}">
          <input type="hidden" name="q" value="${esc(sessionState.query)}">
          <input type="hidden" name="type" value="${esc(sessionState.typeFilter)}">
          <input type="hidden" name="district" value="${esc(sessionState.districtFilter)}">
          <input type="hidden" name="branch" value="${esc(sessionState.branchFilter)}">
          <input type="hidden" name="sort" value="${esc(sessionState.sortOption)}">
          ${sessionState.onlyAvailable ? `<input type="hidden" name="only_available" value="1">` : ""}
          <input type="hidden" name="quota" value="${sessionState.quota}">
          <input type="hidden" name="community" value="${sessionState.community}">
          <input type="hidden" name="round" value="${sessionState.round}">
          <input type="hidden" name="year" value="${sessionState.year}">
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
    const meta = COHORT_55_METADATA[cCode] || COHORT_120_METADATA[cCode];
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

import {
  HISTORICAL_OBSERVATIONS,
  compareOffering,
  getComparisonCopy,
  getCounsellingGuidance,
  formatShortlistPlainText,
  formatShortlistCsv,
  createShortlistItem,
  moveToTop,
  moveToBottom,
  moveToPosition,
  type AllotmentRound,
  type AllotmentRoundOrAll,
  type CommunityCategory,
  type ComparisonResult,
  type GovernedOffering,
  type QuotaStream,
  type ShortlistState,
  type SupportedLanguage,
} from "../m5/index.ts";
import { renderSiteHeader, renderSiteBottomNav, renderIndependenceFooter, SITE_SHELL_CSS, GOOGLE_FONTS_HTML, SHARED_FONT_FAMILY } from "./site-shell.ts";

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
  searchQuery?: string;
  districtFilter?: string;
  branchFilter?: string;
  typeFilter?: string;
  collegeFilter?: string;
}

export function getCollegeDoteCategory(college: CollegeMeta): {
  key: string;
  nameEn: string;
  nameTa: string;
  badgeClass: string;
} {
  if (college.code === "5") {
    return {
      key: "ANNAMALAI",
      nameEn: "Annamalai University",
      nameTa: "அண்ணாமலைப் பல்கலைக்கழகம்",
      badgeClass: "type-annamalai",
    };
  }
  if (["1", "2", "3", "4"].includes(college.code)) {
    return {
      key: "ANNA_UNIV_DEPT",
      nameEn: "Anna University Department College",
      nameTa: "அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரி",
      badgeClass: "type-univ",
    };
  }
  if (college.type === "GOVERNMENT") {
    return {
      key: "GOVERNMENT",
      nameEn: "Government Engineering College",
      nameTa: "அரசுப் பொறியியல் கல்லூரி",
      badgeClass: "type-gov",
    };
  }
  if (college.type === "AIDED") {
    return {
      key: "AIDED",
      nameEn: "Government Aided Engineering College",
      nameTa: "அரசு உதவிபெறும் பொறியியல் கல்லூரி",
      badgeClass: "type-aided",
    };
  }
  if (college.type === "CONSTITUENT") {
    return {
      key: "CONSTITUENT",
      nameEn: "Anna University Constituent College",
      nameTa: "அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரி",
      badgeClass: "type-constituent",
    };
  }
  return {
    key: "SFC",
    nameEn: "Self Financing Engineering College",
    nameTa: "சுயநிதிப் பொறியியல் கல்லூரி",
    badgeClass: "type-sfc",
  };
}

function formatCollegeDropdownLabel(c: CollegeMeta): string {
  if (c.code === "1") return "CEG (Anna University, Guindy)";
  if (c.code === "2") return "ACTech (Anna University, Chennai)";
  if (c.code === "3") return "SAP (Anna University, Chennai)";
  if (c.code === "4") return "MIT (Anna University, Chromepet)";
  if (c.code === "5") return "FEAT (Annamalai University, Chidambaram)";
  if (c.code === "5901") return "ACGCET (Govt. Engg. College, Karaikudi)";
  if (c.code === "2005") return "GCT (Government College of Technology, Coimbatore)";
  if (c.code === "2006") return "PSG Tech, Coimbatore (PSG College of Technology)";
  if (c.code === "2007") return "CIT, Coimbatore";
  if (c.code === "5008") return "TCE, Madurai";
  return c.name.replace(/\bGovernment\b/g, "Govt.");
}

function renderCollegeOptions(colleges: CollegeMeta[], selectedCode: string, lang: SupportedLanguage): string {
  const t = (ta: string, en: string) => (lang === "ta" ? ta : en);

  // Exact DOTE categories from Directorate of Technical Education (https://dte.tn.gov.in/)
  const doteCategories = [
    { key: "GOVERNMENT", ta: "அரசுப் பொறியியல் கல்லூரிகள்", en: "Government Engineering Colleges" },
    { key: "AIDED", ta: "அரசு உதவிபெறும் பொறியியல் கல்லூரிகள்", en: "Government Aided Engineering Colleges" },
    { key: "ANNA_UNIV_DEPT", ta: "அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள்", en: "Anna University Department Colleges" },
    { key: "ANNAMALAI", ta: "அண்ணாமலைப் பல்கலைக்கழகம்", en: "Annamalai University" },
    { key: "CONSTITUENT", ta: "அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள்", en: "Anna University Constituent Colleges" },
    { key: "SFC", ta: "சுயநிதிப் பொறியியல் கல்லூரிகள் (மாவட்ட வாரியாக)", en: "Self Financing Engineering Colleges (District-wise)" },
  ];

  let html = "";
  for (const cat of doteCategories) {
    const list = colleges.filter((c) => getCollegeDoteCategory(c).key === cat.key);
    if (list.length === 0) continue;
    html += `<optgroup label="${esc(t(cat.ta, cat.en))} (${list.length})">`;
    for (const c of list) {
      const displayName = formatCollegeDropdownLabel(c);
      html += `<option value="${esc(c.code)}" ${selectedCode === c.code ? "selected" : ""}>[${esc(c.code)}] ${esc(displayName)} — ${esc(c.district)}</option>`;
    }
    html += `</optgroup>`;
  }
  return html;
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
  const roundExplicit =
    params.get("round_explicit") === "1" ||
    (inputState as any).roundExplicit === true ||
    (Boolean(inputState.round) && inputState.round !== "ROUND_1") ||
    (Boolean(params.get("round")) && params.get("round") !== "ROUND_1");
  const round: AllotmentRoundOrAll =
    roundExplicit && rawRound && ["ROUND_1", "ROUND_2", "ROUND_3", "ALL"].includes(rawRound)
      ? (rawRound as AllotmentRoundOrAll)
      : "ROUND_1";

  const year: number =
    inputState.year === 2025 || params.get("year") === "2025"
      ? 2025
      : 2026;

  // Non-sensitive navigation / search filters from URL
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const typeFilter = params.get("type") ?? "all";
  const districtFilter = (params.get("district") ?? "").trim();
  const collegeFilter = (params.get("college") ?? "").trim();
  const branchFilter = (params.get("branch") ?? "").trim().toUpperCase();
  const onlyAvailable = params.get("only_available") === "1";
  const showAllOfferings = params.get("show_all") === "1";
  const sortOption = params.get("sort") ?? "college_name";

  const isEditingSearch = params.get("edit_search") === "1";
  const hasExplicitSearch = params.get("searched") === "1";
  const hasPage = params.get("page") !== null;
  const hasShowAll = params.get("show_all") === "1";
  const hasQuery = Boolean(params.get("q") || inputState?.searchQuery);
  const hasDistrict = Boolean(params.get("district") || inputState?.districtFilter);
  const hasBranch = Boolean(params.get("branch") || inputState?.branchFilter);
  const hasType = Boolean((params.has("type") && params.get("type") !== "all") || (inputState?.typeFilter && inputState?.typeFilter !== "all"));
  const hasCollege = Boolean((params.has("college") && params.get("college") !== "all") || (inputState?.collegeFilter && inputState?.collegeFilter !== "all"));
  const hasOnlyAvailable = params.get("only_available") === "1";
  const hasCustomSort = params.has("sort") && params.get("sort") !== "college_name";
  const hasActiveCutoffSearch = studentCutoff !== null && communitySelected;

  // Shortlist state from URL params (choice IDs only, zero marks)
  const rawShortlist = params.get("shortlist") ?? "";
  const shortIds = rawShortlist.split(",").filter(Boolean);
  const hasShortlist = shortIds.length > 0;

  const hasSearched =
    !isEditingSearch &&
    !(studentCutoff !== null && !communitySelected) &&
    (hasExplicitSearch ||
      hasPage ||
      hasShowAll ||
      hasQuery ||
      hasDistrict ||
      hasBranch ||
      hasType ||
      hasCollege ||
      hasOnlyAvailable ||
      hasCustomSort ||
      hasShortlist ||
      hasActiveCutoffSearch);

  // Load ALL 1,249 governed offerings across 121 approved institutions
  const governedOfferings = HISTORICAL_OBSERVATIONS.getAllGovernedOfferings();

  // All 121 colleges sorted by name
  const allColleges = Object.values(COHORT_121_METADATA).sort((a, b) => {
    const n = a.name.localeCompare(b.name);
    return n !== 0 ? n : a.code.localeCompare(b.code);
  });

  // Filtered colleges for college-select dropdown based on active type, district, branch, and query filters
  const filteredColleges = allColleges.filter((c) => {
    if (typeFilter !== "all") {
      const doteCat = getCollegeDoteCategory(c).key;
      if (typeFilter === "UNIVERSITY") {
        if (doteCat !== "ANNA_UNIV_DEPT" && doteCat !== "ANNAMALAI") return false;
      } else if (doteCat !== typeFilter) {
        return false;
      }
    }
    if (districtFilter && c.district.toLowerCase() !== districtFilter.toLowerCase()) return false;
    if (branchFilter) {
      const colOfferings = governedOfferings.filter((o) => o.collegeCode === c.code);
      const hasBranch = colOfferings.some((o) => o.programmeCode.toUpperCase() === branchFilter);
      if (!hasBranch) return false;
    }
    if (query) {
      const colOfferings = governedOfferings.filter((o) => o.collegeCode === c.code);
      const matches = colOfferings.some((o) => matchesOfferingSearch(c, o, query));
      if (!matches) return false;
    }
    return true;
  });

  // Build deterministic, sorted filter options from governed metadata with presentation-layer casing normalization
  const normalizeDistrictDisplay = (raw: string): string =>
    raw
      .trim()
      .toLowerCase()
      .replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
  const districtMap = new Map<string, string>();
  for (const c of Object.values(COHORT_121_METADATA)) {
    const key = c.district.trim().toLowerCase();
    if (!key) continue;
    if (!districtMap.has(key)) {
      districtMap.set(key, normalizeDistrictDisplay(c.district));
    }
  }
  const allDistricts = Array.from(districtMap.values()).sort((a, b) => a.localeCompare(b));

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

    // Filter by type (aligned with official DOTE categories from https://dte.tn.gov.in/)
    if (typeFilter !== "all") {
      const doteCat = getCollegeDoteCategory(college).key;
      if (typeFilter === "UNIVERSITY") {
        if (doteCat !== "ANNA_UNIV_DEPT" && doteCat !== "ANNAMALAI") continue;
      } else if (doteCat !== typeFilter) {
        continue;
      }
    }

    // Filter by district
    if (districtFilter && college.district.toLowerCase() !== districtFilter.toLowerCase()) continue;

    // Filter by specific college
    if (collegeFilter && collegeFilter !== "all" && off.collegeCode !== collegeFilter) continue;

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

  // Neutral ordering by default:
  // Default 'college_name': Alphabetical by College Name (A-Z), breaking ties by programme code.
  // Students can explicitly select numerical historical sorting (High to Low or Low to High) or College Code.
  // Numerical sorting strictly reflects mathematical order of historical observations without recommendation or suitability implications.
  evaluatedRows.sort((a, b) => {
    if (sortOption === "college_code") {
      const c = a.college.code.localeCompare(b.college.code, undefined, { numeric: true });
      return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
    }

    if (sortOption === "cutoff_desc") {
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
    }

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

    // Default: 'college_name' (Alphabetical by College Name, then Programme Code)
    const c = a.college.name.localeCompare(b.college.name);
    return c !== 0 ? c : a.offering.programmeCode.localeCompare(b.offering.programmeCode);
  });

  // Bounded Pagination: Default 50 offerings per page to optimize mobile performance
  const rawPage = params.get("page");
  const currentPage = Math.max(1, parseInt(rawPage ?? "1", 10) || 1);
  const pageSize = showAllOfferings ? evaluatedRows.length || 1 : 50;
  const totalPages = Math.max(1, Math.ceil(evaluatedRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);


  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);

  // Language toggle parameters (strictly non-sensitive navigation parameters only)
  const makeLangUrl = (target: SupportedLanguage) => {
    const p = new URLSearchParams();
    p.set("tab", activeTab);
    p.set("lang", target);
    if (safePage > 1) p.set("page", String(safePage));
    if (query) p.set("q", query);
    if (typeFilter !== "all") p.set("type", typeFilter);
    if (districtFilter) p.set("district", districtFilter);
    if (collegeFilter && collegeFilter !== "all") p.set("college", collegeFilter);
    if (branchFilter) p.set("branch", branchFilter);
    if (sortOption !== "college_name") p.set("sort", sortOption);
    if (onlyAvailable) p.set("only_available", "1");
    if (rawShortlist) p.set("shortlist", rawShortlist);
    return `?${p.toString()}`;
  };

  // Language toggle parameters:
  // When active comparison context exists (studentCutoff, explicit community, or search),
  // switch language using a privacy-safe POST form so sensitive context is never lost or leaked in GET URLs.
  const hasPostContext = studentCutoff !== null || communitySelected || hasSearched;
  const makeLangSwitch = (target: SupportedLanguage, label: string) => {
    if (!hasPostContext) {
      return `<a class="lang-switch" lang="${target}" href="${esc(makeLangUrl(target))}">${label}</a>`;
    }
    return `<form method="POST" action="/m5-guidance?lang=${target}" class="lang-switch-form" style="margin: 0; display: inline;">
      <input type="hidden" name="tab" value="${esc(activeTab)}">
      <input type="hidden" name="lang" value="${target}">
      ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
      ${communitySelected ? `<input type="hidden" name="community_selected" value="1"><input type="hidden" name="community" value="${esc(community)}">` : ""}
      <input type="hidden" name="quota" value="${esc(quota)}">
      <input type="hidden" name="round" value="${esc(round)}">
      ${roundExplicit ? `<input type="hidden" name="round_explicit" value="1">` : ""}
      <input type="hidden" name="year" value="${year}">
      ${query ? `<input type="hidden" name="q" value="${esc(query)}">` : ""}
      ${typeFilter !== "all" ? `<input type="hidden" name="type" value="${esc(typeFilter)}">` : ""}
      ${districtFilter ? `<input type="hidden" name="district" value="${esc(districtFilter)}">` : ""}
      ${collegeFilter && collegeFilter !== "all" ? `<input type="hidden" name="college" value="${esc(collegeFilter)}">` : ""}
      ${branchFilter ? `<input type="hidden" name="branch" value="${esc(branchFilter)}">` : ""}
      ${sortOption !== "college_name" ? `<input type="hidden" name="sort" value="${esc(sortOption)}">` : ""}
      ${onlyAvailable ? `<input type="hidden" name="only_available" value="1">` : ""}
      ${safePage > 1 ? `<input type="hidden" name="page" value="${safePage}">` : ""}
      ${hasSearched ? `<input type="hidden" name="searched" value="1">` : ""}
      ${rawShortlist ? `<input type="hidden" name="shortlist" value="${esc(rawShortlist)}">` : ""}
      <button type="submit" class="lang-switch" lang="${target}">${label}</button>
    </form>`;
  };

  const langControl =
    lang === "ta"
      ? `<span lang="ta" aria-current="page">தமிழ்</span>${makeLangSwitch("en", '<span class="lang-long">English</span><span class="lang-short">EN</span>')}`
      : `${makeLangSwitch("ta", "தமிழ்")}<span lang="en" aria-current="page"><span class="lang-long">English</span><span class="lang-short">EN</span></span>`;

  const navTabsHtml = `
    <nav class="nav-tabs" aria-label="Milestone M5 Views">
      <a class="nav-tab ${activeTab === "comparison" ? "active" : ""}" href="?tab=comparison&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
        ${t("கட்-ஆஃப் ஒப்பீடு &amp; கல்லூரித் தேடல்", "Cutoff Comparison &amp; Directory")}
      </a>
      <a class="nav-tab ${activeTab === "shortlist" ? "active" : ""}" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
        ${t("என் விருப்பப் பட்டியல்", "My Shortlist")} <span class="shortlist-badge">${shortIds.length}</span>
      </a>
      <a class="nav-tab ${activeTab === "counselling" ? "active" : ""}" href="?tab=counselling&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
        ${t("கலந்தாய்வு வழிகாட்டி", "Counselling Procedure Guidance")}
      </a>
    </nav>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(copy.title)} | TN Engineering Guidance</title>
  ${GOOGLE_FONTS_HTML}
  <style>
    ${SITE_SHELL_CSS}
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0; width: 100%; max-width: 100vw; overflow-x: hidden;
      font-family: ${SHARED_FONT_FAMILY};
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
      .form-tier-1 { grid-template-columns: repeat(auto-fit, minmax(225px, 1fr)); align-items: end; }
      .form-tier-2 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); align-items: end; }
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
    .type-annamalai { background: #fdf2f8; color: #9d174d; border: 1px solid #fbcfe8; }
    .offering-subrow { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45rem; margin-top: 0.35rem; font-size: 0.86rem; color: #475569; }
    .branch-pill {
      min-height: 44px;
      min-width: 44px;
      padding: 0.45rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 9999px;
      background: #ffffff;
      color: #334155;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .pagination-btn:hover:not(.disabled) { background: #eff6ff; border-color: #2563eb; color: #1d4ed8; }
    .pagination-btn.disabled { opacity: 0.45; cursor: not-allowed; background: #f1f5f9; border-color: #e2e8f0; color: #94a3b8; }
    .context-chips-bar { display: flex; flex-wrap: wrap; gap: 0.45rem; align-items: center; margin: 0.75rem 0 1rem; }
    .context-chips-label { font-size: 0.8rem; font-weight: 700; color: #475569; }
    .context-chip { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.82rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: 999px; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; }
    .context-chip strong { font-weight: 800; color: #1d4ed8; }

    /* Level 1 Primary Surface */
    .m5-primary-surface {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem 1.15rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .m5-surface-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.65rem;
    }
    .m5-surface-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .m5-search-bar-form {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .m5-search-input-wrap {
      display: flex;
      gap: 0.45rem;
      align-items: center;
      width: 100%;
    }
    .m5-search-input {
      flex: 1;
      min-width: 0;
      padding: 0.6rem 0.85rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.95rem;
      min-height: 44px;
      background: #ffffff;
      color: #0f172a;
      transition: all 0.15s ease;
    }
    .m5-search-input:focus {
      border-color: #2563eb;
      outline: none;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .m5-search-btn {
      padding: 0.6rem 1rem;
      background: #2563eb;
      color: #ffffff;
      border: 1.5px solid #2563eb;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.92rem;
      min-height: 44px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .m5-search-btn:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }
    .m5-context-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      padding: 0.55rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .m5-context-field {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: #334155;
    }
    .m5-context-field label {
      white-space: nowrap;
    }
    .m5-context-field input, .m5-context-field select {
      padding: 0.35rem 0.5rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.86rem;
      min-height: 38px;
      background: #ffffff;
      color: #0f172a;
    }
    .m5-cutoff-field input {
      width: 78px;
    }
    .m5-filter-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-left: auto;
      padding: 0.35rem 0.8rem;
      background: #ffffff;
      border: 1.5px solid #3b82f6;
      color: #1d4ed8;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      min-height: 38px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .m5-filter-trigger-btn:hover {
      background: #eff6ff;
    }
    .filter-count-badge {
      background: #2563eb;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 9999px;
    }
    .branch-shortcuts-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: 0.35rem 0 0.15rem;
      scrollbar-width: none;
    }
    .branch-shortcuts-row::-webkit-scrollbar {
      display: none;
    }
    .branch-pill-shortcut {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.3rem 0.7rem;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
      white-space: nowrap;
      min-height: 32px;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .branch-pill-shortcut:hover {
      border-color: #2563eb;
      color: #1d4ed8;
      background: #eff6ff;
    }
    .branch-pill-shortcut.active {
      background: #1e40af;
      color: #ffffff;
      border-color: #1e40af;
    }
    .branch-pill-more {
      border-style: dashed;
      color: #2563eb;
    }
    .active-chips-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.45rem;
      padding-top: 0.45rem;
      border-top: 1px dashed #e2e8f0;
    }
    .active-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.5rem;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #334155;
    }
    .active-chip-remove {
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0 0.15rem;
      line-height: 1;
      font-weight: 700;
    }
    .active-chip-remove:hover {
      color: #dc2626;
    }
    .active-chips-clear-all {
      font-size: 0.76rem;
      color: #dc2626;
      background: transparent;
      border: none;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
      padding: 0.15rem 0.35rem;
    }
    .evidence-context-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.55rem;
      padding: 0.45rem 0.75rem;
      background: #eff6ff;
      border-left: 3px solid #2563eb;
      border-radius: 6px;
      font-size: 0.83rem;
      color: #1e40af;
      line-height: 1.4;
    }
    .evidence-context-text strong {
      color: #1d4ed8;
      font-weight: 700;
    }
    .evidence-change-btn {
      background: transparent;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 0.76rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      cursor: pointer;
    }
    .evidence-change-btn:hover {
      background: #dbeafe;
    }
    .filter-sheet-modal {
      border: none;
      border-radius: 16px 16px 0 0;
      padding: 0;
      max-width: 640px;
      width: 100%;
      box-shadow: 0 -10px 25px rgba(0,0,0,0.15);
      background: #ffffff;
    }
    .filter-sheet-modal::backdrop {
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
    }
    .filter-sheet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.9rem 1.15rem;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 16px 16px 0 0;
    }
    .filter-sheet-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .filter-sheet-close-btn {
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #64748b;
      padding: 0.25rem;
      min-height: 44px;
      min-width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .filter-sheet-body {
      padding: 1rem 1.15rem 1.25rem;
      max-height: 75vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    /* College Group Cards (Student-Centered Architecture) */
    .college-group-card {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      margin: 1.25rem 0;
      padding: 1.25rem;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .college-group-card:hover {
      border-color: #94a3b8;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.07);
    }
    .college-group-header {
      border-bottom: 1.5px solid #f1f5f9;
      padding-bottom: 0.85rem;
      margin-bottom: 0.85rem;
    }
    .college-group-top {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 0.45rem;
    }
    .college-group-title-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .college-group-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 800;
      color: #0f2c59;
      line-height: 1.35;
      flex: 1;
    }
    .college-offerings-badge {
      font-size: 0.8rem;
      font-weight: 750;
      color: #0f766e;
      background: #f0fdfa;
      border: 1px solid #ccfbf1;
      padding: 3px 10px;
      border-radius: 9999px;
      white-space: nowrap;
    }
    .college-courses-table {
      width: 100%;
      border-collapse: collapse;
    }
    .course-cell-main {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .course-name-text {
      color: #1e293b;
      font-size: 0.94rem;
      font-weight: 700;
      line-height: 1.35;
    }
    /* Results Toolbar */
    .m5-results-toolbar {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin: 1rem 0 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    }
    .m5-toolbar-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .m5-count-badge {
      font-size: 1rem;
      font-weight: 750;
      color: #0f2c59;
    }
    .m5-round-switcher-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding-top: 0.65rem;
      border-top: 1px solid #f1f5f9;
    }
    .round-bar-label {
      font-size: 0.84rem;
      font-weight: 700;
      color: #475569;
    }
    .round-switch-pill {
      min-height: 38px;
      padding: 6px 14px;
      border-radius: 9999px;
      border: 1.5px solid #cbd5e1;
      background: #f8fafc;
      color: #334155;
      font-size: 0.84rem;
      font-weight: 650;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .round-switch-pill:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .round-switch-pill.active {
      background: #1e40af;
      color: #ffffff;
      border-color: #1e40af;
      font-weight: 750;
    }
    .m5-refine-fields {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 0.65rem;
      border-top: 1px solid #f1f5f9;
    }
    .refine-field {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 220px;
    }
    .refine-field label {
      font-size: 0.84rem;
      font-weight: 700;
      color: #475569;
      white-space: nowrap;
    }
    .refine-field select {
      flex: 1;
      min-height: 40px;
      padding: 6px 10px;
      border: 1.5px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.88rem;
      background: #ffffff;
    }
    .community-quick-pills button.active {
      background: #1e40af !important;
      color: #ffffff !important;
      border-color: #1e40af !important;
    }
    .sticky-shortlist-bar {
      position: fixed;
      bottom: 72px;
      left: 0;
      right: 0;
      z-index: 900;
      display: flex;
      justify-content: center;
      padding: 0 1rem;
      pointer-events: none;
    }
    .sticky-shortlist-inner {
      pointer-events: auto;
      max-width: 440px;
      width: 100%;
      background: #0f172a;
      color: #ffffff;
      padding: 0.55rem 0.95rem;
      border-radius: 9999px;
      box-shadow: 0 6px 18px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      border: 1px solid #334155;
    }
    .sticky-shortlist-info {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.86rem;
    }
    .sticky-shortlist-btn {
      background: #2563eb;
      color: #ffffff;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.82rem;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s ease;
    }
    .sticky-shortlist-btn:hover {
      background: #1d4ed8;
    }
    .offering-card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      align-items: center;
      margin-top: 0.45rem;
      padding-top: 0.45rem;
      border-top: 1px dashed #f1f5f9;
    }
    .contextual-action-btn {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #334155;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.55rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      white-space: nowrap;
      min-height: 32px;
      transition: all 0.15s ease;
    }
    .contextual-action-btn:hover {
      background: #eff6ff;
      border-color: #93c5fd;
      color: #1d4ed8;
    }
    .card-truth-boundary {
      font-size: 0.72rem;
      color: #64748b;
      margin-top: 0.25rem;
      line-height: 1.3;
      display: block;
    }
    @media (min-width: 769px) {
      .sticky-shortlist-bar {
        bottom: 24px;
      }
      .filter-sheet-modal {
        border-radius: 16px;
      }
      .filter-sheet-header {
        border-radius: 16px 16px 0 0;
      }
    }

    @media (max-width: 640px) {
      .m5-container { padding: 0.5rem; }
      .m5-header-card { padding: 0.9rem 1rem; margin-bottom: 0.75rem; }
      .m5-header-card h1 { font-size: 1.3rem; line-height: 1.35; }
      .form-grid { padding: 0.9rem 1rem; gap: 0.7rem; }
      .category-legend { display: none !important; }
      .table-responsive {
        border: none;
        background: transparent;
        box-shadow: none;
        overflow: visible;
      }
      .comparison-table thead, .shortlist-table thead {
        display: none;
      }
      .comparison-table, .comparison-table tbody,
      .shortlist-table, .shortlist-table tbody {
        display: block;
        width: 100%;
      }
      .comparison-table:not(.shortlist-table) tr {
        display: block;
        width: 100%;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 10px;
        margin-bottom: 0.9rem;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        box-sizing: border-box;
      }
      .comparison-table .offering-row.offering-grouped {
        display: block;
        width: 100%;
        background: #ffffff !important;
        border-left: 1.5px solid #cbd5e1 !important;
        border-right: 1.5px solid #cbd5e1 !important;
        border-bottom: 1px solid #e2e8f0 !important;
        border-top: none !important;
        border-radius: 0 !important;
        margin-bottom: 0 !important;
        box-shadow: none !important;
        box-sizing: border-box;
      }
      .comparison-table .offering-row.offering-first-in-group {
        border-top: 1.5px solid #cbd5e1 !important;
        border-radius: 12px 12px 0 0 !important;
        margin-top: 1.25rem !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
      }
      .comparison-table .offering-row.offering-last-in-group {
        border-bottom: 1.5px solid #cbd5e1 !important;
        border-radius: 0 0 12px 12px !important;
        margin-bottom: 1.25rem !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04) !important;
      }
      .comparison-table .offering-row.offering-first-in-group.offering-last-in-group {
        border-radius: 12px !important;
      }
      .comparison-table .offering-row.offering-grouped td:first-child {
        background: #ffffff !important;
        border-bottom: 1px solid #f1f5f9 !important;
        padding: 0.75rem 1rem 0.5rem !important;
        border-left: none !important;
      }
      .comparison-table .offering-row.offering-first-in-group td:first-child {
        padding-top: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .comparison-table .college-group-header-block {
        background: #f0fdfa !important;
        border: none !important;
        border-bottom: 2px solid #0f766e !important;
        border-radius: 10px 10px 0 0 !important;
        padding: 0.85rem 1rem !important;
        margin: 0 0 0.65rem 0 !important;
      }
      .comparison-table .offering-row.offering-first-in-group .offering-course-lead {
        padding: 0 1rem;
      }
      .comparison-table:not(.shortlist-table) td {
        display: block;
        width: 100%;
        padding: 0.6rem 1rem;
        border: none;
        box-sizing: border-box;
      }
      .comparison-table:not(.shortlist-table) td:first-child {
        background: #f8fafc;
        border-bottom: 1px solid #cbd5e1;
        padding: 0.85rem 1rem;
        margin-bottom: 0;
      }
      .comparison-table:not(.shortlist-table) td:nth-child(2),
      .comparison-table:not(.shortlist-table) td:nth-child(3) {
        display: block;
        width: 100%;
        padding: 0.6rem 1rem;
        border-bottom: 1px solid #f1f5f9;
        box-sizing: border-box;
      }
      .comparison-table:not(.shortlist-table) td:nth-child(2)::before {
        content: "கடைசி கட்-ஆஃப்: ";
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        margin-bottom: 2px;
      }
      html[lang="en"] .comparison-table:not(.shortlist-table) td:nth-child(2)::before {
        content: "Observed Min: ";
      }
      .comparison-table:not(.shortlist-table) td:nth-child(3)::before {
        content: "கட்-ஆஃப் வித்தியாசம் (Δ): ";
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        margin-bottom: 4px;
      }
      html[lang="en"] .comparison-table:not(.shortlist-table) td:nth-child(3)::before {
        content: "Comparison Δ: ";
      }
      .comparison-table:not(.shortlist-table) td:nth-child(4) {
        display: block !important;
        font-size: 0.8rem;
        color: #475569;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #f1f5f9;
        margin-top: 0;
      }
      .comparison-table:not(.shortlist-table) td:last-child {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        margin-top: 0;
        background: #ffffff;
        border-top: none;
      }
      .comparison-table:not(.shortlist-table) td:last-child form {
        width: 100%;
      }
      .comparison-table:not(.shortlist-table) td:last-child .btn-action {
        width: 100%;
        min-height: 44px;
        font-size: 0.94rem;
        font-weight: 700;
        justify-content: center;
       }
      /* Shortlist GOV.UK Summary Cards on mobile */
      .shortlist-table tr {
        display: block;
        width: 100%;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
        border-radius: 10px;
        margin-bottom: 0.9rem;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        box-sizing: border-box;
      }
      .shortlist-table td {
        display: block;
        width: 100%;
        border: none;
        padding: 0.75rem 1rem;
        box-sizing: border-box;
      }
      .shortlist-table td:first-child {
        background: #f1f5f9;
        border-bottom: 1px solid #cbd5e1;
        font-size: 1.05rem;
        color: #0f2c59;
        font-weight: 800;
        padding: 0.55rem 1rem;
      }
      .shortlist-table td:last-child {
        padding: 0.65rem 1rem;
        margin-top: 0;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
      }
      .shortlist-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        width: 100%;
      }
      .shortlist-actions .btn-reorder {
        flex: 1 1 40px;
        min-height: 44px;
        min-width: 40px;
        padding: 0.3rem 0.4rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.05rem;
        font-weight: 750;
        border-radius: 8px;
        background: #ffffff;
        border: 1.5px solid #cbd5e1;
      }
      .form-tier-3 {
        flex-direction: column;
        align-items: stretch;
      }
      .form-tier-3 button
    .btn-action {
      min-height: 44px;
      min-width: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary {
        width: 100%;
        min-height: 48px;
        font-size: 1rem;
      }
    }
    @media (max-width: 480px) {
      .btn-action { padding: 0.45rem 0.65rem; font-size: 0.85rem; min-height: 44px; min-width: 44px; }
      .delta-badge { font-size: 0.8rem; padding: 0.2rem 0.45rem; line-height: 1.3; }
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
    <header class="m5-header-card" ${hasSearched && activeTab === "comparison" ? 'style="display: none;"' : ""}>
      <h1>${esc(copy.title)}</h1>
      <p style="font-size: 0.95rem; color: #334155; margin: 0.25rem 0 0.5rem; line-height: 1.5; font-weight: 500;">
        ${t(
          "உங்கள் கட்-ஆஃப் மதிப்பெண்ணை TNEA அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீடுகளுடன் ஒப்பிட்டு, உங்களுக்கான விருப்பப் பட்டியலைத் திட்டமிடுங்கள்.",
          "Compare your marks with governed TNEA official provisional allotments and organize a balanced choice list for your counselling journey."
        )}
      </p>
      <details class="gov-header-details" style="border-left: 3px solid #2563eb; padding-left: 0.75rem; margin-top: 0.4rem;">
        <summary style="cursor: pointer; font-size: 0.88rem; font-weight: 700; color: #1d4ed8; padding: 0.2rem 0;">
          ${t("முக்கியக் குறிப்பு: இந்த கட்-ஆஃப் ஒப்பீட்டை எப்படிப் புரிந்துகொள்வது?", "Important note: How to understand this historical cutoff comparison")}
        </summary>
        <div style="margin-top: 0.5rem;">
          <div class="honest-evidence-card">
            <div class="honest-evidence-icon" aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 56 56" fill="none">
                <rect x="8" y="10" width="30" height="34" rx="5" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
                <path d="M8 15C8 12.2386 10.2386 10 13 10H33C35.7614 10 38 12.2386 38 15V19H8V15Z" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
                <rect x="15" y="7" width="3" height="6" rx="1.5" fill="#D97706"/>
                <rect x="28" y="7" width="3" height="6" rx="1.5" fill="#D97706"/>
                <line x1="38" y1="36" x2="48" y2="46" stroke="#0F766E" stroke-width="4" stroke-linecap="round"/>
                <circle cx="34" cy="32" r="11" fill="#E6F6F4" stroke="#0F766E" stroke-width="2.5"/>
                <circle cx="34" cy="28.5" r="1.2" fill="#0F766E"/>
                <path d="M34 31.5V36" stroke="#0F766E" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="honest-evidence-text">
              ${t(
                "“இது கடந்த ஆண்டு தற்காலிக ஒதுக்கீடு பதிவு மட்டுமே — சீட் உத்தரவாதம் அல்ல. உங்கள் உண்மையான விருப்ப வரிசையையே மேலே வைக்கவும்.”",
                "“Observed past provisional allotment record only — not an admission guarantee. Order strictly by your genuine preference.”"
              )}
            </div>
          </div>
          <p style="font-size: 0.85rem; color: #475569; margin: 0 0 0.65rem; line-height: 1.5;">${esc(copy.nonPredictionDisclaimer)}</p>

          <!-- 3 Visible Guidance Points -->
          <div class="guidance-points-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.6rem; margin: 0.5rem 0;">
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; padding: 0.55rem 0.75rem; border-radius: 6px;">
              <strong style="color: #1d4ed8; font-size: 0.85rem; display: block; margin-bottom: 0.15rem;">
                ${t("1. வரலாற்றுத் தரவு மட்டுமே", "1. Historical Benchmarks Only")}
              </strong>
              <span style="font-size: 0.8rem; color: #475569; line-height: 1.4;">
                ${t("கடந்த ஆண்டு தற்காலிக ஒதுக்கீட்டு குறைந்தபட்ச மதிப்பெண். இது எதிர்கால சேர்க்கைக்கான உத்தரவாதம் அல்ல.", "Past provisional allotment minimums — historical reference only, not a future admission guarantee.")}
              </span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; padding: 0.55rem 0.75rem; border-radius: 6px;">
              <strong style="color: #1d4ed8; font-size: 0.85rem; display: block; margin-bottom: 0.15rem;">
                ${t("2. கணிப்புகள் எதுவும் இல்லை", "2. Zero Admission Prediction")}
              </strong>
              <span style="font-size: 0.8rem; color: #475569; line-height: 1.4;">
                ${t("Safe / Target / Dream லேபிள்கள் அல்லது வாய்ப்புக் கணிப்புகள் இல்லை. சுய விருப்பப்படி முடிவெடுங்கள்.", "No Safe / Target / Dream labels or speculative chances; evaluate every choice objectively.")}
              </span>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #2563eb; padding: 0.55rem 0.75rem; border-radius: 6px;">
              <strong style="color: #1d4ed8; font-size: 0.85rem; display: block; margin-bottom: 0.15rem;">
                ${t("3. மாணவரே வரிசையைத் தீர்மானிக்கிறார்", "3. Student Controls Preference Order")}
              </strong>
              <span style="font-size: 0.8rem; color: #475569; line-height: 1.4;">
                ${t("TNEA விருப்பங்களை #1 முதல் கீழ்நோக்கிப் பரிசீலிக்கும். உண்மையான விருப்பப்படி அச்சமின்றி வரிசைப்படுத்துங்கள்.", "TNEA allocates strictly from Choice #1 downwards; order purely by your genuine preference.")}
              </span>
            </div>
          </div>

          <!-- Compact Process Strip -->
          <div class="process-strip" style="display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0.35rem 0; font-size: 0.78rem; color: #64748b;">
            <span style="white-space: nowrap; font-weight: 700; color: #1e293b;">${t("செயல்முறை:", "Flow:")}</span>
            <span style="white-space: nowrap;">${t("1. புரிந்துகொள் →", "1. Learn →")}</span>
            <span style="white-space: nowrap;">${t("2. கட்-ஆஃப் உள்ளீடு →", "2. Context →")}</span>
            <span style="white-space: nowrap;">${t("3. ஒப்பிடு &amp; ஆராய் →", "3. Compare →")}</span>
            <span style="white-space: nowrap;">${t("4. பட்டியலில் சேர் →", "4. Shortlist →")}</span>
            <span style="white-space: nowrap;">${t("5. வரிசைப்படுத்து →", "5. Plan Order →")}</span>
            <span style="white-space: nowrap;">${t("6. கலந்தாய்வு", "6. Counselling")}</span>
          </div>
        </div>
      </details>
    </header>

    ${navTabsHtml}

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
            collegeFilter,
            branchFilter,
            allDistricts,
            filteredColleges,
            allBranches,
            onlyAvailable,
            sortOption,
            evaluatedRows,
            shortIds,
            rawShortlist,
            governedOfferings.length,
            {
              currentPage: safePage,
              totalPages,
              pageSize,
              totalItems: evaluatedRows.length,
            },
            hasSearched,
            roundExplicit,
            isEditingSearch
          )
    }
  </main>
  ${renderIndependenceFooter(lang)}
  ${renderSiteBottomNav(lang, activeTab === "shortlist" ? "shortlist" : activeTab === "comparison" && studentCutoff !== null ? "cutoff" : "shortlist", shortIds.length)}
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
  collegeFilter: string,
  branchFilter: string,
  allDistricts: string[],
  filteredColleges: CollegeMeta[],
  allBranches: Array<{ code: string; name: string }>,
  onlyAvailable: boolean,
  sortOption: string,
  rows: Array<{ college: CollegeMeta; offering: GovernedOffering; result: ComparisonResult }>,
  shortIds: string[],
  rawShortlist: string,
  totalOfferingsCount: number,
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  },
  hasSearched: boolean = false,
  roundExplicit: boolean = false,
  isEditingSearch: boolean = false
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
  const historicalDisclosure = approvedHistoricalResult
    ? copy.formatDisclosure(round)
    : t(
        `தேர்ந்தெடுத்த ஒதுக்கீடு / பிரிவு / சுற்றிற்கு இந்தப் பட்டியலில் அங்கீகரிக்கப்பட்ட ${year} வரலாற்றுத் தரவு கிடைக்கவில்லை. தரவு இல்லாமை கல்லூரி அல்லது படிப்பு இல்லை என்பதைக் குறிக்காது.`,
        `No approved ${year} historical observation is available for the currently displayed offerings under the selected quota, community, and round. Missing historical data does not mean the college or branch is unavailable.`
      );
  const availableCount = rows.filter(
    (r) => r.result.status === "AVAILABLE" || r.result.status === "STUDENT_CUTOFF_MISSING"
  ).length;

  const pageStartIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const pageRows = rows.slice(pageStartIndex, pageStartIndex + pagination.pageSize);

  const renderPaginationBar = () => {
    if (pagination.totalPages <= 1) return "";
    const isPostSession = studentCutoff !== null;
    const prevPage = pagination.currentPage - 1;
    const nextPage = pagination.currentPage + 1;
    const hasPrev = pagination.currentPage > 1;
    const hasNext = pagination.currentPage < pagination.totalPages;

    if (isPostSession) {
      return `
        <div class="pagination-bar screen-only" aria-label="Pagination controls">
          <span class="pagination-info">
            ${t(
              `பக்கம் ${pagination.currentPage} / ${pagination.totalPages} (${rows.length} படிப்புகள்)`,
              `Page ${pagination.currentPage} of ${pagination.totalPages} (${rows.length} total)`
            )}
          </span>
          <form method="POST" action="/m5-guidance" class="pagination-controls" style="margin: 0;">
            <input type="hidden" name="tab" value="comparison">
            <input type="hidden" name="lang" value="${lang}">
            <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
            <input type="hidden" name="searched" value="1">
            <input type="hidden" name="cutoff" value="${studentCutoff}">
            <input type="hidden" name="quota" value="${quota}">
            <input type="hidden" name="community" value="${community}">
            <input type="hidden" name="round" value="${round}">
            ${roundExplicit ? `<input type="hidden" name="round_explicit" value="1">` : ""}
            <input type="hidden" name="year" value="${year}">
            <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
            <input type="hidden" name="q" value="${esc(query)}">
            <input type="hidden" name="type" value="${esc(typeFilter)}">
            <input type="hidden" name="district" value="${esc(districtFilter)}">
            <input type="hidden" name="college" value="${esc(collegeFilter)}">
            <input type="hidden" name="branch" value="${esc(branchFilter)}">
            <input type="hidden" name="sort" value="${esc(sortOption)}">
            ${onlyAvailable ? `<input type="hidden" name="only_available" value="1">` : ""}
            <button type="submit" name="page" value="${prevPage}" aria-label="${t("முந்தைய பக்கம்", "Previous page")}" class="pagination-btn ${hasPrev ? "" : "disabled"}" ${hasPrev ? "" : "disabled"}>
              ← ${t("முந்தைய", "Prev")}
            </button>
            <span style="font-weight: 700; color: #1e293b; padding: 0 0.25rem;">${pagination.currentPage}</span>
            <button type="submit" name="page" value="${nextPage}" aria-label="${t("அடுத்த பக்கம்", "Next page")}" class="pagination-btn ${hasNext ? "" : "disabled"}" ${hasNext ? "" : "disabled"}>
              ${t("அடுத்த", "Next")} →
            </button>
          </form>
        </div>
      `;
    } else {
      const makePageUrl = (p: number) => {
        const u = new URLSearchParams();
        u.set("tab", "comparison");
        u.set("lang", lang);
        u.set("searched", "1");
        u.set("page", String(p));
        if (query) u.set("q", query);
        if (typeFilter !== "all") u.set("type", typeFilter);
        if (districtFilter) u.set("district", districtFilter);
        if (collegeFilter && collegeFilter !== "all") u.set("college", collegeFilter);
        if (branchFilter) u.set("branch", branchFilter);
        if (sortOption !== "college_name") u.set("sort", sortOption);
        if (onlyAvailable) u.set("only_available", "1");
        if (rawShortlist) u.set("shortlist", rawShortlist);
        return `?${u.toString()}`;
      };

      return `
        <div class="pagination-bar screen-only" aria-label="Pagination controls">
          <span class="pagination-info">
            ${t(
              `பக்கம் ${pagination.currentPage} / ${pagination.totalPages} (${rows.length} படிப்புகள்)`,
              `Page ${pagination.currentPage} of ${pagination.totalPages} (${rows.length} total)`
            )}
          </span>
          <div class="pagination-controls">
            ${
              hasPrev
                ? `<a href="${esc(makePageUrl(prevPage))}" aria-label="${t("முந்தைய பக்கம்", "Previous page")}" class="pagination-btn">← ${t("முந்தைய", "Prev")}</a>`
                : `<span class="pagination-btn disabled" aria-disabled="true">← ${t("முந்தைய", "Prev")}</span>`
            }
            <span style="font-weight: 700; color: #1e293b; padding: 0 0.25rem;">${pagination.currentPage}</span>
            ${
              hasNext
                ? `<a href="${esc(makePageUrl(nextPage))}" aria-label="${t("அடுத்த பக்கம்", "Next page")}" class="pagination-btn">${t("அடுத்த", "Next")} →</a>`
                : `<span class="pagination-btn disabled" aria-disabled="true">${t("அடுத்த", "Next")} →</span>`
            }
          </div>
          ${renderRoundGuidanceCallout()}
        </div>
      `;
    }
  };

  const renderRoundGuidanceCallout = () => {
    if (studentCutoff === null) return "";
    if (studentCutoff < 179.0 && round === "ROUND_1") {
      return `
        <div class="round-guidance-callout screen-only" style="margin: 0.75rem 0 1rem; padding: 0.85rem 1.15rem; background: #eff6ff; border: 1.5px solid #93c5fd; border-left: 4px solid #2563eb; border-radius: 8px; font-size: 0.88rem; color: #1e3a8a; line-height: 1.55;">
          <strong style="color: #1e40af; display: block; margin-bottom: 0.25rem;">
            ℹ️ ${t("வரலாற்றுத் தரவு விவரம் — கலந்தாய்வுச் சுற்று 1:", "Historical Evidence Coverage Notice — Round 1:")}
          </strong>
          ${t(
            `உங்கள் கட்-ஆஃப் மதிப்பெண் <strong>${studentCutoff}</strong>. TNEA கலந்தாய்வில் சுற்று 1 வரலாற்றுத் தரவுகள் பெரும்பாலும் 179.00 முதல் 200.00 வரையிலான மதிப்பெண்களைக் கொண்ட மாணவர்களின் சேர்க்கையை மட்டுமே பிரதிபலிக்கின்றன. எனவே 179-க்குக் குறைவான மதிப்பெண்களுக்கு சுற்று 1-ல் குறைவான ஒப்பீட்டுத் தரவுகளே காணப்படலாம். இது வாய்ப்பு இல்லை என்பதைக் குறிக்காது. உங்கள் மதிப்பெண்ணுக்குரிய பிற சுற்றுகளின் உண்மையான வரலாற்றுத் தரவுகளைப் பார்க்க மேலே அல்லது கீழே உள்ள கலந்தாய்வுச் சுற்றுகளில் <strong>சுற்று 2 (~178.99–145)</strong> அல்லது <strong>சுற்று 3 (~144.99–77.50)</strong> என்பதைத் தேர்வு செய்து ஒப்பிடலாம். பிற சுற்றுகளைத் தேர்வு செய்வது வரலாற்றை அறிந்துகொள்வதற்கு மட்டுமே; இது சேர்க்கை உத்தரவாதம் அல்ல.`,
            `You entered an academic cutoff of <strong>${studentCutoff}</strong>. In TNEA single-window counselling, Round 1 historical publications primarily reflect candidate allotments in the ~179.00–200.00 score band. For cutoffs below 179, Round 1 contains fewer comparable historical observations. This does not mean options are unavailable; you can select <strong>Round 2 (~178.99–145.00)</strong> or <strong>Round 3 (~144.99–77.50)</strong> in the Counselling Round filter to inspect historical allotments from those rounds. Inspecting another round is for educational exploration only and does not predict, imply, or guarantee admission.`
          )}
        </div>
      `;
    }
    if (studentCutoff < 145.0 && round === "ROUND_2") {
      return `
        <div class="round-guidance-callout screen-only" style="margin: 0.75rem 0 1rem; padding: 0.85rem 1.15rem; background: #eff6ff; border: 1.5px solid #93c5fd; border-left: 4px solid #2563eb; border-radius: 8px; font-size: 0.88rem; color: #1e3a8a; line-height: 1.55;">
          <strong style="color: #1e40af; display: block; margin-bottom: 0.25rem;">
            ℹ️ ${t("வரலாற்றுத் தரவு விவரம் — கலந்தாய்வுச் சுற்று 2:", "Historical Evidence Coverage Notice — Round 2:")}
          </strong>
          ${t(
            `உங்கள் கட்-ஆஃப் மதிப்பெண் <strong>${studentCutoff}</strong>. TNEA கலந்தாய்வில் சுற்று 2 வரலாற்றுத் தரவுகள் 145.00 முதல் ~178.99 வரையிலான மதிப்பெண்களைக் கொண்ட மாணவர்களின் சேர்க்கையை மட்டுமே குறிக்கின்றன. 145-க்குக் குறைவான மதிப்பெண்களுக்கு <strong>சுற்று 3 (~144.99–77.50)</strong> என்பதைத் தேர்வு செய்து அந்தச் சுற்றுக்கான உண்மையான வரலாற்றுத் தரவுகளை ஒப்பிடலாம்.`,
            `You entered an academic cutoff of <strong>${studentCutoff}</strong>. In TNEA counselling, Round 2 historical publications reflect allotments in the ~145.00–178.99 score band. For cutoffs below 145, you can select <strong>Round 3 (~144.99–77.50)</strong> in the Counselling Round filter to inspect round-appropriate historical allotments.`
          )}
        </div>
      `;
    }
    return "";
  };

  const renderActiveContextStrip = () => `
      <div class="active-context-strip" role="status" style="margin: 0 0 1rem; padding: 0.8rem 1rem; background: #edf2f7; border-left: 4px solid #2b6cb0; border-radius: 4px; font-size: 0.9rem; color: #1a202c; line-height: 1.5;">
        <!-- Context Chips (Requirement 9) -->
        <div class="context-chips-bar screen-only" aria-label="Active Context Chips" style="margin: 0 0 0.5rem;">
          <span class="context-chips-label">${t("தேர்ந்தெடுத்த விவரங்கள்:", "Active Chips:")}</span>
          ${studentCutoff !== null ? `<span class="context-chip">🎯 ${t("கட்-ஆஃப்:", "Cutoff:")} <strong>${studentCutoff.toFixed(2)}</strong></span>` : ""}
          <span class="context-chip">📋 ${esc(copy.quotaName(quota))}</span>
          <span class="context-chip">🏷️ ${esc(copy.communityName(community))}</span>
          <span class="context-chip">🔄 ${esc(copy.roundName(round))}</span>
          <span class="context-chip">📅 ${year}</span>
          ${query ? `<span class="context-chip">🔍 "${esc(query)}"</span>` : ""}
          ${districtFilter ? `<span class="context-chip">📍 ${esc(districtFilter)}</span>` : ""}
          ${typeFilter !== "all" ? `<span class="context-chip">🏛️ ${esc(typeFilter)}</span>` : ""}
        </div>
        <div>
          <strong>${t("தற்போது தேர்ந்தெடுத்துள்ள விவரம்:", "Current Comparison Context:")}</strong>
          ${year} · ${esc(copy.quotaName(quota))} · <strong>${esc(copy.communityName(community))}</strong> · ${esc(copy.roundName(round))}
          ${districtFilter ? ` · ${t("மாவட்டம்:", "District:")} <strong>${esc(districtFilter)}</strong>` : ""}
          ${branchFilter ? ` · ${t("பாடப்பிரிவு:", "Branch:")} <strong>${esc(branchFilter)}</strong>` : ""}
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
          quota === "GOVT_SCHOOL_7_5"
            ? `<p class="quota-75-context-reminder" role="note" style="margin: 0.4rem 0 0; padding: 0.45rem 0.65rem; background: #fffbeb; border-left: 3px solid #d97706; border-radius: 4px; font-size: 0.83rem; color: #78350f;">${t(
                `<strong>7.5% தகுதி நினைவூட்டல்:</strong> இந்த ஒப்பீடு தகவல் அறிய மட்டுமே; இது 7.5% இடஒதுக்கீட்டுத் தகுதியை உறுதிப்படுத்தாது. அதிகாரப்பூர்வ TNEA ஆவணச் சரிபார்ப்பின்படியே தகுதி முடிவாகும் (<a href="/counselling?lang=ta" style="color: #92400e; font-weight: 700; text-decoration: underline;">7.5% விதிகளைப் பார்க்க</a>).`,
                `<strong>7.5% Eligibility Reminder:</strong> This comparison view is for exploration only and does not establish 7.5% quota eligibility. Eligibility must be verified through official Std 6–12 government-school certificates and TNEA verification (<a href="/counselling?lang=en" style="color: #92400e; font-weight: 700; text-decoration: underline;">view 7.5% rules</a>).`
              )}</p>`
            : ""
        }
        ${
          year === 2025
            ? `<p style="margin: 0.35rem 0 0; font-size: 0.83rem; color: #4a5568;">${t(
                "<strong>2025 தரவு வரம்பு:</strong> இந்தப் பட்டியலில் உள்ள 121 கல்லூரிகளின் 1,249 படிப்புகளில், 536 படிப்புகளுக்கு 2025-ஆம் ஆண்டின் அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டுத் தரவு உள்ளது (மீதமுள்ள 713 படிப்புகளுக்கு 'ஒப்பீட்டிற்குத் தரவு இல்லை' எனக் காட்டப்படும்). அனைத்து 121 கல்லூரிகளின் 1,249 படிப்புகளுக்குமான முழு ஒதுக்கீட்டுத் தரவைப் பார்க்க மேலே உள்ள 'கலந்தாய்வு ஆண்டு' தேர்வில் <strong>2026</strong>-ஐத் தேர்ந்தெடுக்கவும்.",
                "<strong>2025 Evidence Coverage:</strong> Across the 121 governed colleges (1,249 offerings), approved 2025 provisional allotment observations are available for 536 offerings (the remaining 713 offerings appear as 'Not available for comparison'). Select <strong>2026</strong> in 'Counselling Year' above to inspect complete data across all 121 colleges (1,249 offerings)."
              )}</p>`
            : `<p style="margin: 0.35rem 0 0; font-size: 0.83rem; color: #4a5568;">${t(
                "<strong>2026 முழு வரம்பு:</strong> 2026-ஆம் ஆண்டின் தற்காலிக ஒதுக்கீட்டுத் தரவு 121 கல்லூரிகளுக்கும் (1,249 படிப்புகள்) முழுமையாகக் கிடைக்கிறது.",
                "<strong>2026 Complete Scope:</strong> 2026 provisional allotment data is active across all 121 approved colleges (1,249 offerings)."
              )}</p>`
        }
        <p style="margin: 0.35rem 0 0; font-size: 0.83rem; color: #4a5568;">
          <strong>${t("அதிகாரப்பூர்வ வெளிப்படைத்தன்மை அறிவிப்பு:", "Official Truth-in-Guidance Disclosure:")}</strong> ${esc(historicalDisclosure)}
        </p>
        ${
          year === 2025 && quota === "GENERAL_ACADEMIC"
            ? `<p style="margin: 0.4rem 0 0; font-size: 0.84rem; color: #2d3748;">${t(
                "<strong>முக்கியக் குறிப்பு (சுற்று 1 தரவு இல்லை):</strong> பொதுக் கல்விப் பிரிவுக்கு 2025 அதிகாரப்பூர்வ <strong>சுற்று 2</strong> மற்றும் <strong>சுற்று 3</strong> வெளியீடுகள் மட்டுமே இங்கு அங்கீகரிக்கப்பட்டுள்ளன. சுற்று 1-லேயே அனைத்து இடங்களும் நிரம்பிய படிப்புகளுக்கு 'ஒப்பீட்டிற்கு கிடைக்கவில்லை' என்று காட்டப்படும் — இதன் பொருள் அந்தக் கல்லூரி அல்லது படிப்பு இல்லை என்பதல்ல. உங்கள் பிரிவு (எ.கா. BC, MBC, SC) அல்லது 7.5% ஒதுக்கீட்டைத் தேர்ந்தெடுத்துப் பார்க்கவும்.",
                "<strong>Coverage note (No Round 1 for General Academic):</strong> Only official 2025 <strong>Round 2</strong> and <strong>Round 3</strong> publications are approved here for General Academic. Offerings where all seats were filled during Round 1 appear as 'Not available for comparison' — this does NOT mean the college or branch is unavailable."
              )}</p>`
            : ""
        }
        <div class="student-safety-rule-banner" style="background: #f0fdf4; border: 1.5px solid #86efac; border-left: 4px solid #16a34a; border-radius: 8px; padding: 0.6rem 0.85rem; margin: 0.65rem 0 0.35rem; font-size: 0.86rem; color: #14532d; line-height: 1.45;">
          <strong style="display: flex; align-items: center; gap: 0.35rem; color: #166534; font-size: 0.88rem; margin-bottom: 0.15rem;">
            🛡️ ${t("மாணவர்களுக்கான வழிகாட்டுதல் (Choice List Guidance)", "Student Choice Guidance")}
          </strong>
          <span>${t(
            "உங்கள் விருப்பங்களை பரவலாக ஆராய்ந்து பட்டியலிடுங்கள். கடந்த ஆண்டு பதிவுகளை ஒரு வழிகாட்டியாக மட்டுமே கருதி, உங்கள் உண்மையான விருப்ப வரிசையின் அடிப்படையில் சாய்ஸ் பட்டியலை உருவாக்குங்கள்.",
            "Explore genuine preferences across a broad set of college/branch options and use historical observations only as one reference while preparing your own choice list."
          )}</span>
        </div>
        <div class="college-code-alert-banner" style="background: #fff7ed; border: 1.5px solid #fdba74; border-left: 4px solid #ea580c; border-radius: 8px; padding: 0.6rem 0.85rem; margin: 0.35rem 0 0.2rem; font-size: 0.85rem; color: #7c2d12; line-height: 1.45;">
          <strong style="display: flex; align-items: center; gap: 0.35rem; color: #9a3412; font-size: 0.87rem; margin-bottom: 0.15rem;">
            ⚠️ ${t("கல்லூரிக் குறியீடு எச்சரிக்கை: ஒரே பெயர் கொண்ட கல்லூரிகள்", "College Code Alert: Watch out for similar college names")}
          </strong>
          <span>${t(
            "தமிழ்நாட்டில் பல கல்லூரிகள் ஒரே பெயரிலோ அல்லது ஒரே குடும்பப் பெயரிலோ (Loyola, Venkateswara, Meenakshi, St. Joseph போன்றவை) வெவ்வேறு இடங்களில் இயங்குகின்றன. TNEA ஆன்லைன் சாய்ஸ் ஃபில்லிங்கில் கல்லூரியின் <strong>4-இலக்க அதிகாரப்பூர்வக் குறியீட்டை (College Code)</strong> கட்டாயம் சரிபார்த்துத் தேர்வு செய்யவும்.",
            "Colleges with identical or similar family names (Loyola, Venkateswara, Meenakshi, St. Joseph, etc.) operate in different locations. Always verify the <strong>4-digit official TNEA College Code</strong> when filling choices on the official portal."
          )}</span>
        </div>
      </div>
  `;

  const renderSearchForm = () => `
      <!-- Form method is POST to prevent sensitive student marks from appearing in GET query strings or browser history -->
      <form method="POST" action="/m5-guidance" class="form-grid" role="search" aria-label="Cutoff comparison form">
        <input type="hidden" name="tab" value="comparison">
        <input type="hidden" name="lang" value="${lang}">
        <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
        <input type="hidden" name="community_selected" value="1">
        <input type="hidden" name="searched" value="1">

        <!-- Tier 1: Primary Search & Essential Context -->
        <div class="form-tier form-tier-1">
          <div class="form-group" style="grid-column: 1 / -1;">
            <label for="search-input" style="font-size: 0.88rem; font-weight: 700; color: #1e3a8a;">
              🔍 ${t("விரைவுத் தேடல் (கல்லூரிப் பெயர் / துறை / மாவட்டம் / குறியீடு எண்)", "Quick Search (College Name / Programme / District / Code)")}
            </label>
            <input id="search-input" type="text" name="q" aria-label="${t("விரைவுத் தேடல் (கல்லூரிப் பெயர் / துறை / மாவட்டம் / குறியீடு எண்)", "Quick Search (College Name / Programme / District / Code)")}" value="${esc(query)}" placeholder="${t("உதாரணமாக: CEG, PSG, CIT, CSE, கோவை, 1216", "e.g. CEG, PSG, CIT, CSE, Coimbatore, 1216")}">
          </div>

          <div class="form-group">
            <label for="cutoff-input">${esc(copy.studentCutoffLabel)} (0–200)</label>
            <input id="cutoff-input" type="number" step="0.25" min="0" max="200" name="cutoff" aria-label="${esc(copy.studentCutoffLabel)} (0–200)" value="${studentCutoff !== null ? studentCutoff : ""}" placeholder="${t("உதாரணமாக: 185.5", "e.g. 185.5")}">
          </div>

          <div class="form-group">
            <label for="quota-select">${esc(copy.quotaLabel)}</label>
            <select id="quota-select" name="quota" aria-label="${esc(copy.quotaLabel)}" onchange="var w=document.getElementById('quota-75-warning');if(w)w.hidden=(this.value!=='GOVT_SCHOOL_7_5');">
              <option value="GENERAL_ACADEMIC" ${quota === "GENERAL_ACADEMIC" ? "selected" : ""}>${esc(copy.quotaName("GENERAL_ACADEMIC"))}</option>
              <option value="GOVT_SCHOOL_7_5" ${quota === "GOVT_SCHOOL_7_5" ? "selected" : ""}>${esc(copy.quotaName("GOVT_SCHOOL_7_5"))}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="community-select">${esc(copy.communityLabel)}</label>
            <select id="community-select" name="community" aria-label="${esc(copy.communityLabel)}">
              ${(["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"] as CommunityCategory[])
                .map(
                  (cat) =>
                    `<option value="${cat}" ${community === cat ? "selected" : ""}>${esc(copy.communityName(cat))}</option>`
                )
                .join("")}
            </select>
            <div class="community-quick-pills" style="display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px;">
              ${(["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"] as CommunityCategory[])
                .map(
                  (cat) =>
                    `<button type="button" class="branch-pill ${community === cat ? "active" : ""}" style="min-height: 36px; min-width: 36px; padding: 2px 8px; font-size: 0.8rem; border-radius: 6px;" onclick="var s=document.getElementById('community-select'); if(s){ s.value='${cat}'; }">${cat}</button>`
                )
                .join("")}
            </div>
          </div>

          <div class="form-group">
            <label for="round-select">${esc(copy.roundLabel)}</label>
            <input type="hidden" name="round_explicit" id="round-explicit-input" value="${roundExplicit ? "1" : "0"}">
            <select id="round-select" name="round" aria-label="${esc(copy.roundLabel)}" onchange="var el=document.getElementById('round-explicit-input'); if(el) el.value='1';">
              <option value="ROUND_1" ${round === "ROUND_1" ? "selected" : ""}>${esc(copy.roundName("ROUND_1"))} (${t("இயல்புநிலை", "Default")})</option>
              <option value="ROUND_2" ${round === "ROUND_2" ? "selected" : ""}>${esc(copy.roundName("ROUND_2"))}</option>
              <option value="ROUND_3" ${round === "ROUND_3" ? "selected" : ""}>${esc(copy.roundName("ROUND_3"))}</option>
              <option value="ALL" ${round === "ALL" ? "selected" : ""}>${esc(copy.roundName("ALL"))}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="year-select">${t("கலந்தாய்வு ஆண்டு", "Counselling Year")}</label>
            <select id="year-select" name="year" aria-label="${t("கலந்தாய்வு ஆண்டு", "Counselling Year")}">
              <option value="2026" ${year === 2026 ? "selected" : ""}>${t("2026 (121 கல்லூரிகள் · 1,249 படிப்புத் தரவுகள்)", "2026 (121 Colleges · 1,249 Offerings Data)")}</option>
              <option value="2025" ${year === 2025 ? "selected" : ""}>${t("2025 (121 கல்லூரிகள் · 536 படிப்புத் தரவுகள்)", "2025 (121 Colleges · 536 Offerings Data)")}</option>
            </select>
          </div>

          <div id="quota-75-warning" class="quota-75-warning" role="note" ${quota === "GOVT_SCHOOL_7_5" ? "" : "hidden"} style="grid-column: 1 / -1; padding: 0.7rem 0.95rem; background: #fffbeb; border: 1.5px solid #f59e0b; border-left: 4px solid #d97706; border-radius: 6px; font-size: 0.86rem; color: #78350f; line-height: 1.5;">
            ${t(
              `<strong>7.5% ஒதுக்கீடு — ஒப்பீட்டுத் தேடலுக்கு மட்டுமே (தகுதி உறுதிப்படுத்தல் அல்ல):</strong> இங்கு 7.5% பிரிவைத் தேர்ந்தெடுப்பது கடந்த ஆண்டு கட்-ஆஃப் தரவுகளை ஒப்பிட்டுப் பார்க்க மட்டுமே; இது உங்களின் 7.5% இடஒதுக்கீட்டுத் தகுதியை உறுதிப்படுத்தாது. 6 முதல் 12-ஆம் வகுப்பு வரை தமிழ்நாடு அரசுப் பள்ளியில் படித்த விவரம் மற்றும் அதிகாரப்பூர்வ ஆவணச் சரிபார்ப்பின் (TFC) மூலமே உண்மையான தகுதி தீர்மானிக்கப்படும். <a href="/counselling?lang=ta" style="color: #92400e; font-weight: 700; text-decoration: underline;">7.5% தகுதி விதிகளைப் பார்க்க →</a>`,
              `<strong>7.5% Quota — For Comparison &amp; Exploration Only (Not Proof of Eligibility):</strong> Selecting the 7.5% option here is for historical comparison and exploration only and does not establish or confirm your eligibility. Actual eligibility depends on continuous Std 6–12 Tamil Nadu Government school study and official document/rule verification through the TNEA process. <a href="/counselling?lang=en" style="color: #92400e; font-weight: 700; text-decoration: underline;">Check official 7.5% eligibility rules →</a>`
            )}
          </div>
          ${renderRoundGuidanceCallout()}
        </div>

        <!-- Tier 2: Mandatory Filter & Sort Controls (Always Visible) -->
        <div class="screen-only" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.85rem 1rem; background: #f8fafc; display: flex; flex-direction: column; gap: 1rem;">
          <div class="form-tier form-tier-2" style="border-bottom: none; padding-bottom: 0;">
            <div class="form-group">
              <label for="type-select">${t("கல்லூரி வகை (DOTE வகைப்பாடு)", "College Category (DOTE Classification)")}</label>
              <select id="type-select" name="type" aria-label="${t("கல்லூரி வகை (DOTE வகைப்பாடு)", "College Category (DOTE Classification)")}">
                <option value="all" ${typeFilter === "all" ? "selected" : ""}>${t("அனைத்து வகைகள் (DOTE வகைப்பாடு)", "All Categories (DOTE Classification)")}</option>
                <option value="GOVERNMENT" ${typeFilter === "GOVERNMENT" ? "selected" : ""}>${t("அரசுப் பொறியியல் கல்லூரிகள் (11)", "Government Engineering Colleges (11)")}</option>
                <option value="AIDED" ${typeFilter === "AIDED" ? "selected" : ""}>${t("அரசு உதவிபெறும் பொறியியல் கல்லூரிகள் (3)", "Government Aided Engineering Colleges (3)")}</option>
                <option value="ANNA_UNIV_DEPT" ${typeFilter === "ANNA_UNIV_DEPT" ? "selected" : ""}>${t("அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள் (4)", "Anna University Department Colleges (4)")}</option>
                <option value="ANNAMALAI" ${typeFilter === "ANNAMALAI" ? "selected" : ""}>${t("அண்ணாமலைப் பல்கலைக்கழகம் (1)", "Annamalai University (1)")}</option>
                <option value="CONSTITUENT" ${typeFilter === "CONSTITUENT" ? "selected" : ""}>${t("அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள் (16)", "Anna University Constituent Colleges (16)")}</option>
                <option value="SFC" ${typeFilter === "SFC" ? "selected" : ""}>${t("சுயநிதிப் பொறியியல் கல்லூரிகள் — தன்னாட்சி (86)", "Self Financing Engineering Colleges — Autonomous (86)")}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="district-select">${t("மாவட்டம்", "District")}</label>
              <select id="district-select" name="district" aria-label="${t("மாவட்டம்", "District")}">
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
              <label for="college-select">${t("குறிப்பிட்ட கல்லூரியைத் தேர்ந்தெடுக்க", "Select Specific College")}</label>
              <select id="college-select" name="college" aria-label="${t("குறிப்பிட்ட கல்லூரியைத் தேர்ந்தெடுக்க", "Select Specific College")}">
                <option value="" ${!collegeFilter || collegeFilter === "all" ? "selected" : ""}>${t(`அனைத்துக் கல்லூரிகள் (${filteredColleges.length})`, `All Colleges (${filteredColleges.length})`)}</option>
                ${renderCollegeOptions(filteredColleges, collegeFilter, lang)}
              </select>
            </div>

            <div class="form-group">
              <label for="branch-select">${t("துறை (Department / Branch)", "Branch / Department")}</label>
              <select id="branch-select" name="branch" aria-label="${t("துறை (Department / Branch)", "Branch / Department")}">
                <option value="" ${!branchFilter ? "selected" : ""}>${t("அனைத்துத் துறைகள்", "All Programmes")}</option>
                ${allBranches
                  .map(
                    (b) =>
                      `<option value="${esc(b.code)}" ${branchFilter === b.code ? "selected" : ""}>${esc(formatBranchDropdownLabel(b.name))} (${esc(b.code)})</option>`
                  )
                  .join("")}
              </select>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div class="form-group" style="min-width: 250px;">
              <label for="sort-select">${t("வரிசைப்படுத்து", "Sort By")}</label>
              <select id="sort-select" name="sort" aria-label="${t("வரிசைப்படுத்து", "Sort By")}">
                <option value="college_name" ${sortOption === "college_name" ? "selected" : ""}>${t("கல்லூரிப் பெயர் (A–Z)", "College Name (A-Z) (Default)")}</option>
                <option value="college_code" ${sortOption === "college_code" ? "selected" : ""}>${t("கல்லூரிக் குறியீடு எண்", "College Code")}</option>
                <option value="cutoff_desc" ${sortOption === "cutoff_desc" ? "selected" : ""}>${t("கடந்த ஆண்டு கட்-ஆஃப்: அதிகம் முதல் குறைவு வரை", "Historical Minimum Mark: High to Low (Numerical)")}</option>
                <option value="cutoff_asc" ${sortOption === "cutoff_asc" ? "selected" : ""}>${t("கடந்த ஆண்டு கட்-ஆஃப்: குறைவு முதல் அதிகம் வரை", "Historical Minimum Mark: Low to High (Numerical)")}</option>
              </select>
            </div>

            <label for="only-available-check" style="display: inline-flex; align-items: center; gap: 0.65rem; cursor: pointer; font-size: 0.9rem; font-weight: 600; color: #334155; min-height: 44px; padding: 6px 4px; user-select: none;">
              <input id="only-available-check" type="checkbox" name="only_available" value="1" aria-label="${t("கட்-ஆஃப் விவரம் உள்ள படிப்புகளை மட்டும் காட்டு", "Show only offerings with available cutoff data")}" ${onlyAvailable ? "checked" : ""} style="width: 20px; height: 20px; min-height: 20px; min-width: 20px; cursor: pointer; margin: 0; accent-color: #2563eb;">
              <span>${t("கட்-ஆஃப் விவரம் உள்ள படிப்புகளை மட்டும் காட்டு", "Show only offerings with available cutoff data")}</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-tier form-tier-3" style="display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;">
          <a class="btn-action" aria-label="${t("வடிகட்டிகளை மீட்டமை", "Reset filters")}" href="?tab=comparison&amp;lang=${lang}${rawShortlist ? `&amp;shortlist=${esc(rawShortlist)}` : ""}" style="padding: 0.65rem 1.2rem; font-size: 0.95rem; font-weight: 600; color: #475569; background: #f1f5f9; border: 1px solid #cbd5e1; text-decoration: none; border-radius: 6px; display: inline-flex; align-items: center; min-height: 44px;">
            ${t("வடிகட்டிகளை மீட்டமை", "Reset filters")}
          </a>
          <button type="submit" class="btn-action btn-primary" aria-label="${t("தேடு மற்றும் ஒப்பிடு", "Search and Compare")}" style="padding: 0.65rem 1.6rem; font-size: 0.95rem; font-weight: 700; min-height: 44px;">${t("தேடு &amp; ஒப்பிடு", "Search &amp; Compare")}</button>
        </div>
      </form>
  `;

  // ========================================================
  // Progressive Disclosure: Level 1 Primary Surface & Chips
  // ========================================================
  const activeFilterChips: Array<{ label: string; field: string; clearValue: string }> = [];
  if (query) {
    activeFilterChips.push({ label: `🔍 "${query}"`, field: "q", clearValue: "" });
  }
  if (branchFilter) {
    activeFilterChips.push({ label: `📚 ${branchFilter}`, field: "branch", clearValue: "" });
  }
  if (districtFilter) {
    activeFilterChips.push({ label: `📍 ${districtFilter}`, field: "district", clearValue: "" });
  }
  if (typeFilter && typeFilter !== "all") {
    const doteName =
      typeFilter === "GOVERNMENT" ? t("அரசு", "Govt")
      : typeFilter === "AIDED" ? t("அரசு உதவி", "Aided")
      : typeFilter === "ANNA_UNIV_DEPT" ? t("அண்ணா பல்கலை.", "Anna Univ Dept")
      : typeFilter === "ANNAMALAI" ? t("அண்ணாமலை", "Annamalai")
      : typeFilter === "CONSTITUENT" ? t("உறுப்புக் கல்லூரி", "Constituent")
      : t("சுயநிதி தன்னாட்சி", "Autonomous");
    activeFilterChips.push({ label: `🏛️ ${doteName}`, field: "type", clearValue: "all" });
  }
  if (collegeFilter && collegeFilter !== "all") {
    const colMeta = COHORT_121_METADATA[collegeFilter];
    const colName = colMeta ? colMeta.code : collegeFilter;
    activeFilterChips.push({ label: `🏫 [${colName}]`, field: "college", clearValue: "all" });
  }
  if (roundExplicit && round !== "ALL") {
    activeFilterChips.push({ label: `🔄 ${copy.roundName(round)}`, field: "round", clearValue: "ALL" });
  }
  if (quota === "GOVT_SCHOOL_7_5") {
    activeFilterChips.push({ label: `🏫 7.5% அரசுப் பள்ளி`, field: "quota", clearValue: "GENERAL_ACADEMIC" });
  }

  const activeFiltersCount = activeFilterChips.length;

  const quickBranches = [
    { code: "CS", label: "CSE" },
    { code: "IT", label: "IT" },
    { code: "EC", label: "ECE" },
    { code: "EE", label: "EEE" },
    { code: "ME", label: "Mech" },
    { code: "CE", label: "Civil" },
  ];

  const quickBranchShortcutsHtml = quickBranches
    .map((b) => {
      const isActive = branchFilter === b.code;
      const targetBranch = isActive ? "" : b.code;
      return `
        <form method="POST" action="/m5-guidance" style="display: inline; margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
          <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
          <input type="hidden" name="searched" value="1">
          <input type="hidden" name="q" value="${esc(query)}">
          <input type="hidden" name="type" value="${esc(typeFilter)}">
          <input type="hidden" name="district" value="${esc(districtFilter)}">
          <input type="hidden" name="branch" value="${esc(targetBranch)}">
          <input type="hidden" name="college" value="${esc(collegeFilter)}">
          <input type="hidden" name="round" value="${round}">
          <input type="hidden" name="round_explicit" value="${roundExplicit ? "1" : "0"}">
          <input type="hidden" name="quota" value="${quota}">
          ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
          ${communitySelected ? `<input type="hidden" name="community" value="${community}">` : ""}
          <button type="submit" class="branch-pill ${isActive ? "active" : ""}" aria-label="${b.label} ${t("பாடப்பிரிவு வடிகட்டியை மாற்று", "Toggle branch filter")}">
            ${b.label}
          </button>
        </form>
      `;
    })
    .join("");

  const activeChipsHtml = activeFilterChips
    .map((chip) => {
      return `
        <form method="POST" action="/m5-guidance" style="display: inline; margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
          <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
          <input type="hidden" name="searched" value="1">
          <input type="hidden" name="q" value="${chip.field === "q" ? chip.clearValue : esc(query)}">
          <input type="hidden" name="type" value="${chip.field === "type" ? chip.clearValue : esc(typeFilter)}">
          <input type="hidden" name="district" value="${chip.field === "district" ? chip.clearValue : esc(districtFilter)}">
          <input type="hidden" name="branch" value="${chip.field === "branch" ? chip.clearValue : esc(branchFilter)}">
          <input type="hidden" name="college" value="${chip.field === "college" ? chip.clearValue : esc(collegeFilter)}">
          <input type="hidden" name="round" value="${chip.field === "round" ? chip.clearValue : round}">
          <input type="hidden" name="round_explicit" value="${chip.field === "round" ? "0" : (roundExplicit ? "1" : "0")}">
          <input type="hidden" name="quota" value="${chip.field === "quota" ? chip.clearValue : quota}">
          ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
          ${communitySelected ? `<input type="hidden" name="community" value="${community}">` : ""}
          <button type="submit" class="active-chip" title="${t("இந்த வடிகட்டியை நீக்கு", "Remove filter")}">
            ${chip.label} <span class="chip-remove" aria-hidden="true">✕</span>
          </button>
        </form>
      `;
    })
    .join("");

  const renderPrimarySurface = () => `
    <section class="m5-primary-surface screen-only" aria-label="${t("விரைவுத் தேடல் &amp; வடிகட்டிகள்", "Quick Search &amp; Filters")}">
      <div class="m5-surface-header">
        <h2 class="m5-surface-title">${t("உங்கள் விருப்பங்களைத் தேடுங்கள்", "Search your choices")}</h2>
        <span class="m5-results-badge" role="status">
          ${t(`${rows.length} விருப்பங்கள் கிடைக்கின்றன`, `${rows.length} choices available`)}
        </span>
      </div>

      <form method="POST" action="/m5-guidance" class="m5-search-bar-form">
        <input type="hidden" name="tab" value="comparison">
        <input type="hidden" name="lang" value="${lang}">
        <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
        <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
        <input type="hidden" name="searched" value="1">
        <input type="hidden" name="type" value="${esc(typeFilter)}">
        <input type="hidden" name="district" value="${esc(districtFilter)}">
        <input type="hidden" name="branch" value="${esc(branchFilter)}">
        <input type="hidden" name="college" value="${esc(collegeFilter)}">
        <input type="hidden" name="round" value="${round}">
        <input type="hidden" name="round_explicit" value="${roundExplicit ? "1" : "0"}">

        <div class="m5-search-input-wrap">
          <input
            type="search"
            name="q"
            class="m5-search-input"
            value="${esc(query)}"
            placeholder="${t("கல்லூரி பெயர், குறியீடு (CEG, PSG, 2006) அல்லது துறை (CSE, ECE)...", "College name, code (CEG, PSG, 2006) or branch (CSE, ECE)...")}"
            aria-label="${t("கல்லூரி அல்லது துறை தேடல்", "Search college or branch")}"
          />
          <button type="submit" class="m5-search-btn">
            🔍 ${t("தேடு", "Search")}
          </button>
        </div>

        <div class="m5-context-bar">
          <div class="m5-context-field m5-cutoff-field">
            <label for="m5-surf-cutoff">${t("கட்-ஆஃப்:", "Cutoff:")}</label>
            <input
              type="text"
              id="m5-surf-cutoff"
              name="cutoff"
              inputmode="decimal"
              value="${studentCutoff !== null ? studentCutoff.toFixed(2) : ""}"
              placeholder="185.50"
              style="width: 80px;"
            />
          </div>

          <div class="m5-context-field">
            <label for="m5-surf-community">${t("பிரிவு:", "Community:")}</label>
            <select id="m5-surf-community" name="community" onchange="var el=document.getElementById('m5-surf-comm-sel'); if(el) el.value='1';">
              <option value="OC" ${community === "OC" ? "selected" : ""}>OC</option>
              <option value="BC" ${community === "BC" ? "selected" : ""}>BC</option>
              <option value="BCM" ${community === "BCM" ? "selected" : ""}>BCM</option>
              <option value="MBC" ${community === "MBC" ? "selected" : ""}>MBC</option>
              <option value="SC" ${community === "SC" ? "selected" : ""}>SC</option>
              <option value="SCA" ${community === "SCA" ? "selected" : ""}>SCA</option>
              <option value="ST" ${community === "ST" ? "selected" : ""}>ST</option>
            </select>
            <input type="hidden" id="m5-surf-comm-sel" name="community_selected" value="${communitySelected ? "1" : "0"}">
          </div>

          <div class="m5-context-field">
            <label for="m5-surf-quota">${t("ஒதுக்கீடு:", "Quota:")}</label>
            <select id="m5-surf-quota" name="quota">
              <option value="GENERAL_ACADEMIC" ${quota === "GENERAL_ACADEMIC" ? "selected" : ""}>${t("பொது", "General")}</option>
              <option value="GOVT_SCHOOL_7_5" ${quota === "GOVT_SCHOOL_7_5" ? "selected" : ""}>${t("7.5% அரசுப் பள்ளி", "7.5% Govt School")}</option>
            </select>
          </div>

          <button
            type="button"
            class="m5-filter-trigger-btn"
            onclick="var d=document.getElementById('m5-filter-dialog'); if(d) d.showModal();"
            aria-haspopup="dialog"
          >
            ⚙️ ${t("வடிகட்டிகள்", "Filters")}${activeFiltersCount > 0 ? ` <span class="filter-count-badge">${activeFiltersCount}</span>` : ""}
          </button>
        </div>
      </form>

      <div class="branch-shortcuts-row">
        <span class="branch-shortcuts-label">${t("முக்கியத் துறைகள்:", "Key branches:")}</span>
        ${quickBranchShortcutsHtml}
        <button
          type="button"
          class="branch-pill more"
          onclick="var d=document.getElementById('m5-filter-dialog'); if(d) d.showModal();"
        >
          ${t("மேலும்...", "More...")}
        </button>
      </div>

      <p class="screen-only" style="margin: 0.25rem 0 0.75rem; font-size: 0.84rem; color: #4a5568;">
        ${t(
          "உங்களுக்குப் பிடித்த கல்லூரி மற்றும் துறையின் அருகே உள்ள '+ தேர்வு' என்பதை அழுத்தி உங்கள் விருப்பப் பட்டியலில் சேர்த்துக்கொள்ளலாம் (இது தளத்தின் பரிந்துரை அல்ல; 'என் விருப்பப் பட்டியல்' பகுதியில் நீங்களே வரிசையை மாற்றிக்கொள்ளலாம்).",
          "Click '+ Add' to save an offering to your personal shortlist (not a system recommendation; you manually set preference order in 'My Shortlist')."
        )}
      </p>

      ${
        activeFilterChips.length > 0
          ? `
      <div class="active-chips-bar" aria-label="${t("செயலில் உள்ள வடிகட்டிகள்", "Active filter chips")}">
        ${activeChipsHtml}
        <form method="POST" action="/m5-guidance" style="display: inline; margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
          <input type="hidden" name="searched" value="1">
          <input type="hidden" name="round" value="ALL">
          <input type="hidden" name="round_explicit" value="0">
          <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
          ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
          ${communitySelected ? `<input type="hidden" name="community" value="${community}">` : ""}
          <button type="submit" class="active-chips-clear-all" style="background: none; border: none; color: #2563eb; font-weight: 600; font-size: 0.84rem; cursor: pointer; text-decoration: underline; padding: 0.2rem 0.4rem;">
            ${t("அனைத்தையும் நீக்கு", "Clear all")}
          </button>
        </form>
      </div>`
          : ""
      }

      <div class="evidence-context-strip">
        <span>${t(
          `<strong>வரலாற்றுத் தரவு:</strong> ${year} · ${quota === "GOVT_SCHOOL_7_5" ? "7.5% அரசுப் பள்ளி ஒதுக்கீடு" : "பொதுக் கல்வி"} · ${roundExplicit && round !== "ALL" ? copy.roundName(round) : "அனைத்து வெளியிடப்பட்ட சுற்றுகள்"}`,
          `<strong>Historical evidence:</strong> ${year} · ${quota === "GOVT_SCHOOL_7_5" ? "7.5% Govt School" : "General Academic"} · ${roundExplicit && round !== "ALL" ? copy.roundName(round) : "All Published Rounds"}`
        )}</span>
        ${
          activeFiltersCount > 0
            ? `<span style="margin-left: auto; font-size: 0.8rem; color: #1e40af;">${t("வடிகட்டப்பட்டது", "Filtered")}</span>`
            : ""
        }
      </div>
    </section>

    <!-- Level 2 Mobile Filter Sheet Modal -->
    <dialog id="m5-filter-dialog" class="filter-sheet-modal">
      <div class="filter-sheet-header">
        <h3>⚙️ ${t("தேர்வு &amp; வடிகட்டிகள்", "Filters &amp; Search")}</h3>
        <button type="button" class="filter-sheet-close" onclick="var d=document.getElementById('m5-filter-dialog'); if(d) d.close();" aria-label="${t("மூடு", "Close")}">✕</button>
      </div>
      <div class="filter-sheet-body">
        ${renderSearchForm()}
      </div>
    </dialog>
  `;

  const renderLearnBeforeComparing = (): string => `
    <div style="margin: 1.25rem 0;">
      <!-- Learn before comparing accordion -->
      <details class="learn-before-comparing screen-only" style="margin: 0 0 1rem; padding: 0.85rem 1rem; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px;">
        <summary style="cursor: pointer; font-weight: 700; color: #1e40af; font-size: 0.98rem; padding: 0.2rem 0;">
          ${t("📖 ஒப்பிடும் முன் தெரிந்துகொள்ள வேண்டியவை (அதிகாரப்பூர்வ வழிகாட்டி &amp; குறிப்புகள்)", "📖 Learn Before Comparing (Official Guides, Rounds &amp; Disclosures)")}
        </summary>
        <div style="margin-top: 0.85rem; display: flex; flex-direction: column; gap: 0.85rem;">
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

          <details class="dote-guide" style="padding: 0.75rem 0.9rem; background: #f0fdfa; border: 1.5px solid #99f6e4; border-radius: 8px; font-size: 0.9rem; color: #134e4a; line-height: 1.6;">
            <summary style="cursor: pointer; font-weight: 700; color: #0f766e; padding: 0.2rem 0; font-size: 0.92rem;">
              ${t("🏛️ தமிழ்நாடு தொழில்நுட்பக் கல்வி இயக்ககம் (DOTE) கல்லூரி வகைப்பாடுகள் — அதிகாரப்பூர்வ வழிகாட்டி", "🏛️ Directorate of Technical Education (DOTE) College Classification — Official Guide")}
            </summary>
            <div style="margin-top: 0.65rem; border-top: 1px solid #ccfbf1; padding-top: 0.65rem;">
              <p style="margin: 0 0 0.5rem; font-size: 0.88rem;">
                ${t(
                  "தொழில்நுட்பக் கல்வி இயக்ககத்தின் (<a href=\"https://dte.tn.gov.in/\" target=\"_blank\" rel=\"noopener\" style=\"color: #0f766e; text-decoration: underline; font-weight: 600;\">dte.tn.gov.in</a>) அதிகாரப்பூர்வ வகைப்பாட்டின்படி, தமிழ்நாட்டில் உள்ள பொறியியல் கல்லூரிகள் பின்வருமாறு பிரிக்கப்பட்டுள்ளன:",
                  "According to the official Directorate of Technical Education (<a href=\"https://dte.tn.gov.in/\" target=\"_blank\" rel=\"noopener\" style=\"color: #0f766e; text-decoration: underline; font-weight: 600;\">dte.tn.gov.in</a>) classification, Tamil Nadu engineering colleges are categorized as follows:"
                )}
              </p>
              <ul style="margin: 0.35rem 0 0.5rem; padding-left: 1.2rem; line-height: 1.65; font-size: 0.88rem;">
                <li><strong>${t("அரசுப் பொறியியல் கல்லூரிகள் (Government Engineering Colleges — 11)", "Government Engineering Colleges (11)")}:</strong> ${t("அரசால் முழுமையாக நிர்வகிக்கப்படும் 11 அரசுப் பொறியியல் கல்லூரிகள்.", "11 fully state-governed institutions.")}</li>
                <li><strong>${t("அரசு உதவிபெறும் பொறியியல் கல்லூரிகள் (Government Aided Engineering Colleges — 3)", "Government Aided Engineering Colleges (3)")}:</strong> ${t("அரசு நிதி உதவிபெறும் 3 பொறியியல் கல்லூரிகள் (PSG Tech 2006, CIT 2007, TCE 5008).", "3 state-aided engineering institutions (PSG Tech 2006, CIT 2007, TCE 5008).")}</li>
                <li><strong>${t("அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள் (Anna University Department Colleges — 4)", "Anna University Department Colleges (4)")}:</strong> ${t("அண்ணா பல்கலைக்கழகத்தின் நேரடி துறைக் கல்லூரிகள் (CEG 1, ACT 2, SAP 3, MIT 4).", "Anna University department institutions (CEG 1, ACT 2, SAP 3, MIT 4).")}</li>
                <li><strong>${t("அண்ணாமலைப் பல்கலைக்கழகம் (Annamalai University — 1)", "Annamalai University (1)")}:</strong> ${t("சிதம்பரத்தில் உள்ள அண்ணாமலைப் பல்கலைக்கழக பொறியியல் மற்றும் தொழில்நுட்பப் புலம் (குறியீடு 5).", "Faculty of Engineering & Technology, Annamalai University (Code 5).")}</li>
                <li><strong>${t("அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள் (Anna University Constituent Colleges — 16)", "Anna University Constituent Colleges (16)")}:</strong> ${t("மண்டல வளாகங்கள் மற்றும் உறுப்புக் கல்லூரிகள் (UCEs).", "Regional campuses and University Colleges of Engineering (UCEs).")}</li>
                <li><strong>${t("மத்திய அரசு பொறியியல் கல்லூரிகள் (Central Government Colleges)", "Central Government Colleges")}:</strong> ${t("மத்திய அரசால் நிர்வகிக்கப்படும் நிறுவனங்கள் (நேரடி சேர்க்கை).", "Centrally funded institutions (central admissions).")}</li>
                <li><strong>${t("சுயநிதிப் பொறியியல் கல்லூரிகள் — தன்னாட்சி (86)", "Self Financing Engineering Colleges (86 Autonomous)")}:</strong> ${t("தமிழ்நாட்டின் 29 மாவட்டங்களில் அமைந்துள்ள தன்னாட்சி பெற்ற சுயநிதிப் பொறியியல் கல்லூரிகள் (மாவட்டம் வாரியாகப் பிரிக்கப்பட்டுள்ளது).", "Autonomous private engineering institutions across 29 districts in Tamil Nadu (district-wise).")}</li>
              </ul>
            </div>
          </details>

          <details class="community-guide" style="padding: 0.75rem 0.9rem; background: #fff; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 0.9rem; color: #2d3748;">
            <summary style="cursor: pointer; font-weight: 600; color: #2b6cb0; padding: 0.2rem 0;">${t("இட ஒதுக்கீட்டுப் பிரிவுகள் (OC / BC / MBC / SC / ST) — எளிய விளக்கம்", "Reservation Community Categories (OC / BC / MBC / SC / ST) — Quick Guide")}</summary>
            <ul style="margin: 0.5rem 0 0.25rem; padding-left: 1.2rem; line-height: 1.6;">
              <li><strong>OC</strong> — ${t("பொதுப் பிரிவு (Open Competition): அனைத்து வகுப்பினரும் தகுதியின் அடிப்படையில் போட்டியிடக்கூடிய பொது இடங்கள்.", "Open Competition: Open merit pool available to all eligible candidates regardless of community.")}</li>
              <li><strong>BC / BCM</strong> — ${t("பிற்படுத்தப்பட்டோர் (Backward Class) மற்றும் பிற்படுத்தப்பட்ட முஸ்லிம் (BC Muslim).", "Backward Class (BC) and Backward Class Muslim (BCM).")}</li>
              <li><strong>MBC</strong> — ${t("மிகவும் பிற்படுத்தப்பட்டோர் மற்றும் சீர்மரபினர் (MBC / DNC).", "Most Backward Class and Denotified Communities (MBC / DNC).")}</li>
              <li><strong>SC / SCA / ST</strong> — ${t("ஆதிதிராவிடர் (SC), அருந்ததியர் (SCA) மற்றும் பழங்குடியினர் (ST).", "Scheduled Caste (SC), Scheduled Caste Arunthathiyar (SCA), and Scheduled Tribe (ST).")}</li>
            </ul>
            <p style="margin: 0.35rem 0 0; font-size: 0.85rem; color: #4a5568;">${t("உங்கள் சாதிச் சான்றிதழின்படி பொருந்தும் பிரிவை நீங்களே தேர்ந்தெடுங்கள்; தளம் தானாகப் பிரிவைக் கணிக்காது.", "Select the category that matches your official certificate; this tool never infers your category.")}</p>
          </details>

          <details class="delta-guide" style="padding: 0.75rem 0.9rem; background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; font-size: 0.9rem; color: #14532d; line-height: 1.6;">
            <summary style="cursor: pointer; font-weight: 700; color: #15803d; padding: 0.2rem 0; font-size: 0.92rem;">
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
            </div>
          </details>

          <details class="rounds-guide" style="padding: 0.75rem 0.9rem; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.9rem; color: #1e293b; line-height: 1.6;">
            <summary style="cursor: pointer; font-weight: 700; color: #1e40af; padding: 0.2rem 0; font-size: 0.92rem;">
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
                    <strong>${t("கட்-ஆஃப்:", "Cut-off:")}</strong> 200.00 - ~179.00
                  </div>
                </div>

                <div style="background: #ffffff; border: 1px solid #bfdbfe; border-left: 3px solid #2563eb; padding: 0.65rem 0.8rem; border-radius: 6px;">
                  <strong style="color: #1d4ed8; display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">
                    ${t("சுற்று 2 (Round 2)", "Round 2")}
                  </strong>
                  <div style="font-size: 0.83rem; color: #475569; line-height: 1.45;">
                    <strong>${t("தரவரிசை:", "Rank:")}</strong> ~24,001 - ~75,000<br>
                    <strong>${t("கட்-ஆஃப்:", "Cut-off:")}</strong> ~178.99 - ~145.00
                  </div>
                </div>

                <div style="background: #ffffff; border: 1px solid #bfdbfe; border-left: 3px solid #2563eb; padding: 0.65rem 0.8rem; border-radius: 6px;">
                  <strong style="color: #1d4ed8; display: block; font-size: 0.9rem; margin-bottom: 0.2rem;">
                    ${t("சுற்று 3 (Round 3)", "Round 3")}
                  </strong>
                  <div style="font-size: 0.83rem; color: #475569; line-height: 1.45;">
                    <strong>${t("தரவரிசை:", "Rank:")}</strong> ${t("~75,001 முதல் கடைசி வரை", "~75,001 to qualifying rank")}<br>
                    <strong>${t("கட்-ஆஃப்:", "Cut-off:")}</strong> ~144.99 - ~77.50
                  </div>
                </div>
              </div>

              <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 0.75rem 0.95rem; border-radius: 6px; font-size: 0.85rem; color: #1e3a8a; margin-top: 0.65rem; line-height: 1.55;">
                <strong style="color: #1e40af; display: block; margin-bottom: 0.25rem;">
                  📌 ${t("முக்கியக் குறிப்பு — கலந்தாய்வு சுற்றுகளும் கல்லூரிக் கட்-ஆஃப்களும்:", "Important Note — Counselling Rounds vs College Closing Cutoffs:")}
                </strong>
                ${t(
                  "மேலே உள்ள கட்-ஆஃப் வரம்புகள் எந்த மாணவர் எந்தச் சுற்றில் கலந்தாய்வில் பங்கேற்க அழைக்கப்படுகிறார் என்பதற்கானவை (Student Eligibility Band). ஒவ்வொரு சுற்றிலும், ஒவ்வொரு கல்லூரி மற்றும் பாடப்பிரிவிற்கும் அந்தச் சுற்றுக்கான தனித்துவமான குறைந்தபட்ச சேர்க்கைக் கட்-ஆஃப் உண்டு. சுற்றுகளை ஒன்றாக இணைத்தால் தவறான புரிதல் ஏற்படும் என்பதால், உங்கள் மதிப்பெண்ணுக்குரிய சுற்றைத் தேர்ந்தெடுத்து அந்தச் சுற்றுக்கான உண்மையான கட்-ஆஃப்களை ஒப்பிடுவதே சரியானது.",
                  "The cut-off ranges above determine which round of counselling a student is called for based on their 12th board marks (Student Eligibility Band). Within each round, every college and branch has its own distinct closing/minimum allotment mark. Combining rounds produces inaccurate comparisons; always select your assigned counselling round below to inspect meaningful, round-specific historical closing cutoffs."
                )}
              </div>
            </div>
          </details>
        </div>
      </details>
    </div>
  `;

  if (isEditingSearch) {
    return `
    <section>
      ${renderSearchForm()}
      ${renderLearnBeforeComparing()}
    </section>
    `;
  }

  if (!hasSearched) {
    return `
    <section>
      <p class="scope-note screen-only" style="margin: 0 0 1rem; padding: 0.85rem 1.15rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.92rem; color: #334155; line-height: 1.55; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
        ${t(
          `<strong>தரவு விவரம்:</strong> இந்த ஒப்பீட்டுப் பக்கத்தில், கடந்த ஆண்டு அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டுத் தரவுகள் சரிபார்க்கப்பட்ட <strong>121 கல்லூரிகள் (1,249 படிப்புகள்)</strong> மட்டுமே உள்ளன (கல்லூரி 1516: <span class="held-badge">${esc(copy.heldNotice)}</span>). தமிழ்நாட்டின் மொத்தமுள்ள 389 கல்லூரிகளையும் கட்-ஆஃப் இன்றிப் பார்க்க <a href="/colleges?lang=ta" style="color: #2563eb; font-weight: 600; text-decoration: underline;">முழுக் கல்லூரிகள் பட்டியலைப் பார்க்கவும்</a>.`,
          `<strong>Dataset scope:</strong> This comparison workspace covers the <strong>121 approved colleges (1,249 offerings)</strong> with governed official provisional allotment evidence (College 1516: <span class="held-badge">${esc(copy.heldNotice)}</span>). To browse the broader 389-college 2026 TNEA listing without marks, visit the <a href="/colleges?lang=en" style="color: #2563eb; font-weight: 600; text-decoration: underline;">Colleges Directory</a>.`
        )}
      </p>

      ${
        studentCutoff !== null && !communitySelected
          ? `
      <aside class="community-prompt screen-only" role="status" style="margin: 0 0 1rem; padding: 0.9rem 1rem; background: #fffbeb; border: 1.5px solid #d69e2e; border-radius: 8px; color: #744210; font-size: 0.92rem; line-height: 1.55;">
        <strong>${t("அடுத்த படி: உங்கள் இட ஒதுக்கீட்டுப் பிரிவைத் (Community) தேர்ந்தெடுங்கள்", "Next Step: Select Your Reservation Community Category")}</strong><br>
        ${t(
          `உங்கள் கட்-ஆஃப் (<strong>${studentCutoff}</strong>) தானாகப் பதிவிடப்பட்டுள்ளது (இது இணைய முகவரியில் சேமிக்கப்படாது). கீழே உங்கள் சரியான இட ஒதுக்கீட்டுப் பிரிவு (OC / BC / BCM / MBC / SC / SCA / ST) மற்றும் சேர்க்கைப் பிரிவைத் (பொதுக் கல்வி அல்லது 7.5% அரசுப் பள்ளி) தேர்ந்தெடுத்து <strong>'தேடு &amp; ஒப்பிடு'</strong> என்பதைத் தேர்வு செய்யவும்.`,
          `Your cutoff (<strong>${studentCutoff}</strong>) was transferred safely in memory (not stored in the URL). Select your applicable Reservation Community Category (OC / BC / BCM / MBC / SC / SCA / ST) and Admission Quota below, then click <strong>'Search &amp; Compare'</strong>.`
        )}
      </aside>`
          : ""
      }

      ${studentCutoff !== null ? renderActiveContextStrip() : ""}

      <div class="m5-pre-search-container">
        ${renderPrimarySurface()}

        <div class="m5-pre-search-guide card" role="status" style="margin: 1.25rem 0; padding: 1.75rem 1.25rem; text-align: center; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;" aria-hidden="true">🔍</div>
          <h3 style="margin: 0 0 0.5rem; color: #0f2c59; font-size: 1.25rem; font-weight: 800;">
            ${t("உங்கள் விருப்பங்களைத் தேர்ந்தெடுக்கத் தொடங்குங்கள்", "Start Exploring Your Choices")}
          </h3>
          <p style="margin: 0 auto; max-width: 62ch; color: #475569; font-size: 0.95rem; line-height: 1.65;">
            ${t(
              "உங்கள் கட்-ஆஃப் மதிப்பெண் (விருப்பப்பட்டால்), இடஒதுக்கீட்டுப் பிரிவு, மாவட்டம் அல்லது துறையைத் தேர்வு செய்து மேலே உள்ள 'விருப்பங்களைக் காட்டு' பொத்தானை அழுத்தவும். 2026 TNEA மூலப் பட்டியல் அடிப்படையிலான கல்லூரிகளும் கடந்த ஆண்டு வரலாற்றுத் தரவுகளும் கல்லூரிகள் வாரியாகத் தொகுக்கப்பட்டு உடனுக்குடன் காட்டப்படும்.",
              "Enter your cutoff marks (optional), select your reservation category, district or department above, and click 'Show Results'. 2026 TNEA listed colleges and historical cutoff observations will appear grouped by college."
            )}
          </p>
        </div>

        ${renderLearnBeforeComparing()}
      </div>
    </section>
    `;
  }

  const collegeGroupsMap = new Map<string, { college: CollegeMeta; offerings: Array<{ college: CollegeMeta; offering: GovernedOffering; result: ComparisonResult }> }>();
  for (const row of pageRows) {
    if (!collegeGroupsMap.has(row.college.code)) {
      collegeGroupsMap.set(row.college.code, { college: row.college, offerings: [] });
    }
    collegeGroupsMap.get(row.college.code)!.offerings.push(row);
  }
  const collegeGroups = Array.from(collegeGroupsMap.values());
  const totalMatchingCollegesCount = new Set(rows.map((r) => r.college.code)).size;

  return `
    <section>
      <p class="scope-note screen-only" style="margin: 0 0 1rem; padding: 0.85rem 1.15rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.92rem; color: #334155; line-height: 1.55; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
        ${t(
          `<strong>தரவு விவரம்:</strong> இந்த ஒப்பீட்டுப் பக்கத்தில், கடந்த ஆண்டு அதிகாரப்பூர்வ தற்காலிக ஒதுக்கீட்டுத் தரவுகள் சரிபார்க்கப்பட்ட <strong>121 கல்லூரிகள் (1,249 படிப்புகள்)</strong> மட்டுமே உள்ளன (கல்லூரி 1516: <span class="held-badge">${esc(copy.heldNotice)}</span>). தமிழ்நாட்டின் மொத்தமுள்ள 389 கல்லூரிகளையும் கட்-ஆஃப் இன்றிப் பார்க்க <a href="/colleges?lang=ta" style="color: #2563eb; font-weight: 600; text-decoration: underline;">முழுக் கல்லூரிகள் பட்டியலைப் பார்க்கவும்</a>.`,
          `<strong>Dataset scope:</strong> This comparison workspace covers the <strong>121 approved colleges (1,249 offerings)</strong> with governed official provisional allotment evidence (College 1516: <span class="held-badge">${esc(copy.heldNotice)}</span>). To browse the broader 389-college 2026 TNEA listing without marks, visit the <a href="/colleges?lang=en" style="color: #2563eb; font-weight: 600; text-decoration: underline;">Colleges Directory</a>.`
        )}
      </p>

      ${
        studentCutoff !== null && !communitySelected
          ? `
      <aside class="community-prompt screen-only" role="status" style="margin: 0 0 1rem; padding: 0.9rem 1rem; background: #fffbeb; border: 1.5px solid #d69e2e; border-radius: 8px; color: #744210; font-size: 0.92rem; line-height: 1.55;">
        <strong>${t("அடுத்த படி: உங்கள் இட ஒதுக்கீட்டுப் பிரிவைத் (Community) தேர்ந்தெடுங்கள்", "Next Step: Select Your Reservation Community Category")}</strong><br>
        ${t(
          `உங்கள் கட்-ஆஃப் (<strong>${studentCutoff}</strong>) தானாகப் பதிவிடப்பட்டுள்ளது (இது இணைய முகவரியில் சேமிக்கப்படாது). கீழே உங்கள் சரியான இட ஒதுக்கீட்டுப் பிரிவு (OC / BC / BCM / MBC / SC / SCA / ST) மற்றும் சேர்க்கைப் பிரிவைத் (பொதுக் கல்வி அல்லது 7.5% அரசுப் பள்ளி) தேர்ந்தெடுத்து <strong>'தேடு &amp; ஒப்பிடு'</strong> என்பதைத் தேர்வு செய்யவும்.`,
          `Your cutoff (<strong>${studentCutoff}</strong>) was transferred safely in memory (not stored in the URL). Select your applicable Reservation Community Category (OC / BC / BCM / MBC / SC / SCA / ST) and Admission Quota below, then click <strong>'Search &amp; Compare'</strong>.`
        )}
      </aside>`
          : ""
      }

      ${studentCutoff !== null ? renderActiveContextStrip() : ""}

      <!-- Results action bar with collapsible "Change search / Edit filters" -->
      <div class="results-search-summary screen-only" style="margin: 0 0 1rem; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #ffffff;">
        <details id="m5-search-drawer" class="change-search-details" style="padding: 0;">
          <summary style="cursor: pointer; padding: 0.75rem 1rem; font-weight: 700; color: #1e40af; font-size: 0.92rem; display: flex; justify-content: space-between; align-items: center;">
            <span>🔍 ← ${t("வடிகட்டிகளை மாற்ற (தேடல் படிவம்)", "Change search / Edit filters")}</span>
            <span class="results-count-pill" style="font-weight: 700;">
              ${t(
                `${rows.length} படிப்புகள் (பக்கம் ${pagination.currentPage} / ${pagination.totalPages})`,
                `${rows.length} offerings (Page ${pagination.currentPage} of ${pagination.totalPages})`
              )}
            </span>
          </summary>
          <div style="padding: 0.75rem 1rem 1rem; border-top: 1px solid #e2e8f0;">
            ${renderSearchForm()}
          </div>
        </details>
      </div>

      <!-- Top Horizontal Refinement Toolbar -->
      <div class="m5-results-toolbar screen-only">
        <div class="m5-toolbar-top">
          <span class="m5-count-badge">🏛️ ${totalMatchingCollegesCount} ${t("கல்லூரிகள்", "Colleges")} · ${rows.length} ${t("படிப்புகள் கிடைக்கின்றன", "Offerings Available")}</span>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="m5-filter-trigger-btn" onclick="var d=document.getElementById('m5-filter-dialog'); if(d) { if (typeof d.showModal === 'function') d.showModal(); else d.open = true; }">
              ⚙️ ${t("வடிகட்டிகள்", "Filters")}${activeFiltersCount > 0 ? ` <span class="filter-count-badge">${activeFiltersCount}</span>` : ""}
            </button>
            <button type="button" class="btn-action btn-secondary m5-edit-search-btn" onclick="var d=document.getElementById('m5-search-drawer'); if(d) { d.open = !d.open; if(d.open) d.scrollIntoView({behavior:'smooth'}); }">
              ✏️ ${t("வடிகட்டிகளை மாற்ற", "Change search / Edit filters")}
            </button>
          </div>
        </div>

        <div class="m5-round-switcher-bar">
          <span class="round-bar-label">${t("கலந்தாய்வுச் சுற்று:", "Counselling Round:")}</span>
          <form method="POST" action="/m5-guidance" style="display: inline-flex; gap: 6px; flex-wrap: wrap; margin: 0;">
            <input type="hidden" name="tab" value="comparison">
            <input type="hidden" name="lang" value="${lang}">
            <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
            <input type="hidden" name="searched" value="1">
            <input type="hidden" name="round_explicit" value="1">
            <input type="hidden" name="type" value="${esc(typeFilter)}">
            <input type="hidden" name="district" value="${esc(districtFilter)}">
            <input type="hidden" name="college" value="${esc(collegeFilter)}">
            <input type="hidden" name="branch" value="${esc(branchFilter)}">
            <input type="hidden" name="sort" value="${esc(sortOption)}">
            ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
            ${communitySelected ? `<input type="hidden" name="community" value="${community}">` : ""}
            <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
            <input type="hidden" name="quota" value="${quota}">
            <button type="submit" name="round" value="ROUND_1" class="round-switch-pill ${round === "ROUND_1" ? "active" : ""}">
              ${t("சுற்று 1 (இயல்புநிலை)", "Round 1 (Default)")}
            </button>
            <button type="submit" name="round" value="ROUND_2" class="round-switch-pill ${round === "ROUND_2" ? "active" : ""}">
              ${t("சுற்று 2", "Round 2")}
            </button>
            <button type="submit" name="round" value="ROUND_3" class="round-switch-pill ${round === "ROUND_3" ? "active" : ""}">
              ${t("சுற்று 3", "Round 3")}
            </button>
            <button type="submit" name="round" value="ALL" class="round-switch-pill ${round === "ALL" && roundExplicit ? "active" : ""}">
              ${t("அனைத்துச் சுற்றுகளும்", "All Published Rounds")}
            </button>
          </form>
        </div>

        <form method="POST" action="/m5-guidance" class="m5-quick-refine-form" style="margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
          <input type="hidden" name="searched" value="1">
          <input type="hidden" name="round" value="${round}">
          ${roundExplicit ? `<input type="hidden" name="round_explicit" value="1">` : ""}
          <input type="hidden" name="district" value="${esc(districtFilter)}">
          <input type="hidden" name="college" value="${esc(collegeFilter)}">
          <input type="hidden" name="branch" value="${esc(branchFilter)}">
          ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
          ${communitySelected ? `<input type="hidden" name="community" value="${community}">` : ""}
          <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
          <input type="hidden" name="quota" value="${quota}">
          <div class="m5-refine-fields">
            <div class="refine-field">
              <label for="m5-toolbar-type">${t("கல்லூரி வகை:", "College Type:")}</label>
              <select id="m5-toolbar-type" name="type" onchange="this.form.submit()">
                <option value="all" ${typeFilter === "all" ? "selected" : ""}>${t("அனைத்து வகைகள் (All Types)", "All Types")}</option>
                <option value="GOVERNMENT" ${typeFilter === "GOVERNMENT" ? "selected" : ""}>${t("அரசு (Government)", "Government")}</option>
                <option value="AIDED" ${typeFilter === "AIDED" ? "selected" : ""}>${t("அரசு உதவிபெறும் (Govt Aided)", "Govt Aided")}</option>
                <option value="ANNA_UNIV_DEPT" ${typeFilter === "ANNA_UNIV_DEPT" ? "selected" : ""}>${t("அண்ணா பல்கலை வளாகம் (Anna Univ Dept)", "Anna Univ Dept")}</option>
                <option value="CONSTITUENT" ${typeFilter === "CONSTITUENT" ? "selected" : ""}>${t("உறுப்புக் கல்லூரி (Constituent)", "Constituent")}</option>
                <option value="SFC" ${typeFilter === "SFC" ? "selected" : ""}>${t("சுயநிதி தன்னாட்சி (Autonomous SFC)", "Autonomous SFC")}</option>
              </select>
            </div>
            <div class="refine-field">
              <label for="m5-toolbar-sort">${t("வரிசைப்படுத்து:", "Sort By:")}</label>
              <select id="m5-toolbar-sort" name="sort" onchange="this.form.submit()">
                <option value="cutoff_desc" ${sortOption === "cutoff_desc" ? "selected" : ""}>${t("கட்-ஆஃப்: அதிகம் முதல் குறைவு (High to Low)", "Cutoff: High to Low")}</option>
                <option value="cutoff_asc" ${sortOption === "cutoff_asc" ? "selected" : ""}>${t("கட்-ஆஃப்: குறைவு முதல் அதிகம் (Low to High)", "Cutoff: Low to High")}</option>
                <option value="college_name" ${sortOption === "college_name" ? "selected" : ""}>${t("கல்லூரிப் பெயர் (A–Z)", "College Name (A-Z)")}</option>
                <option value="college_code" ${sortOption === "college_code" ? "selected" : ""}>${t("கல்லூரிக் குறியீடு", "College Code")}</option>
              </select>
            </div>
          </div>
        </form>

        <div class="branch-shortcuts-row" style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap; padding-top: 0.35rem; border-top: 1px solid #f1f5f9;">
          <span class="branch-shortcuts-label" style="font-size: 0.82rem; font-weight: 700; color: #475569;">${t("முக்கியத் துறைகள்:", "Key branches:")}</span>
          ${quickBranchShortcutsHtml}
          <button
            type="button"
            class="branch-pill more"
            onclick="var d=document.getElementById('m5-filter-dialog'); if(d) { if (typeof d.showModal === 'function') d.showModal(); else d.open = true; }"
          >
            ${t("மேலும்...", "More...")}
          </button>
        </div>
      </div>

      ${
        activeFilterChips.length > 0
          ? `
      <div class="active-chips-bar" aria-label="${t("செயலில் உள்ள வடிகட்டிகள்", "Active filter chips")}" style="margin-bottom: 0.75rem;">
        ${activeChipsHtml}
        <form method="POST" action="/m5-guidance" style="display: inline; margin: 0;">
          <input type="hidden" name="tab" value="comparison">
          <input type="hidden" name="lang" value="${lang}">
          <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
          <input type="hidden" name="searched" value="1">
          <input type="hidden" name="round" value="ROUND_1">
          <input type="hidden" name="round_explicit" value="0">
          <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
          ${studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${studentCutoff}">` : ""}
          ${communitySelected ? `<input type="hidden" name="community" value="${community}">` : ""}
          <button type="submit" class="active-chips-clear-all" style="background: none; border: none; color: #2563eb; font-weight: 600; font-size: 0.84rem; cursor: pointer; text-decoration: underline; padding: 0.2rem 0.4rem;">
            ${t("அனைத்தையும் நீக்கு", "Clear all")}
          </button>
        </form>
      </div>`
          : ""
      }

      ${renderActiveContextStrip()}
      ${renderRoundGuidanceCallout()}

      ${
        shortIds.length > 0
          ? `
      <div class="shortlist-summary-pill screen-only" style="margin: 0.75rem 0 1rem; padding: 0.75rem 1rem; background: #e6fffa; border: 1.5px solid #81e6d9; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <span>
          <strong>${t(`தேர்ந்தெடுக்கப்பட்ட விருப்பங்கள்: ${shortIds.length}`, `Selected Choices: ${shortIds.length}`)}</strong>
          · ${t("இவற்றை வரிசைப்படுத்தவும் அச்சிடவும் தயார்.", "Ready to organize and print your preference order.")}
        </span>
        <a class="btn-action btn-primary" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
          ${t("விருப்பப் பட்டியலை வரிசைப்படுத்த →", "Go to Choice Order Planner →")}
        </a>
      </div>`
          : ""
      }

      ${renderPaginationBar()}

      <div class="results-meta-bar screen-only" style="margin-bottom: 0.85rem;">
        <span style="font-size: 0.86rem; color: #4a5568;">
          ${t(
            "🏛️ கல்லூரிகள் வாரியாகப் படிப்புகள் தொகுக்கப்பட்டுள்ளன. உங்களுக்குப் பிடித்த கல்லூரியின் கீழ் உள்ள படிப்புகளை '+ விருப்பத்தில் சேர்' மூலம் பட்டியலில் சேர்க்கலாம் (இது தளத்தின் பரிந்துரை அல்ல; 'என் விருப்பப் பட்டியல்' பகுதியில் நீங்களே வரிசையை மாற்றிக்கொள்ளலாம்).",
            "🏛️ Offerings are grouped by college. Inside each college card, click '+ Add' next to your preferred programmes to plan your choices (not a system recommendation; you manually set preference order in 'My Shortlist')."
          )}
        </span>
      </div>

      ${
        pageRows.length === 0
          ? `<div class="table-responsive">
              <table class="comparison-table" role="table" aria-label="College Cutoff Comparison Table">
                <tbody>
                  <tr><td colspan="5" style="text-align: center; padding: 1.75rem 1.25rem;">
                    <div class="no-results-recovery" role="status" style="max-width: 640px; margin: 0 auto; text-align: left; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 1.25rem;">
                      <h3 style="margin: 0 0 0.45rem; font-size: 1.05rem; color: #0f172a;">
                        ${t("பொருந்தும் கல்லூரிகள் எதுவும் காணப்படவில்லை.", "No matching offerings found for this filter.")}
                      </h3>
                      <p style="margin: 0 0 0.75rem; font-size: 0.9rem; color: #334155; line-height: 1.55;">
                        ${t(
                          "உங்கள் தேடல் சொல் (Search), மாவட்டம் (District), கல்லூரி வகை (Category), குறிப்பிட்ட கல்லூரி (College) அல்லது துறைத் (Branch) தேர்வுகளை மாற்றி மீண்டும் முயற்சிக்கவும். உலாவியின் 'Back' பொத்தானை அழுத்தாமல் கீழே உள்ள மீட்டமைப்புப் பொத்தானை அழுத்தி அனைத்துக் கல்லூரிகளையும் பார்க்கலாம்.",
                          "Try changing your search keyword, district, college category, specific college, or department filters above. You can reset all search filters below without using browser Back."
                        )}
                      </p>
                      <div style="display: flex; gap: 0.65rem; flex-wrap: wrap; align-items: center;">
                        ${
                          studentCutoff !== null
                            ? `<form method="POST" action="/m5-guidance" style="margin: 0; display: inline;">
                                <input type="hidden" name="tab" value="comparison">
                                <input type="hidden" name="lang" value="${lang}">
                                <input type="hidden" name="shortlist" value="${esc(rawShortlist)}">
                                <input type="hidden" name="searched" value="1">
                                <input type="hidden" name="cutoff" value="${studentCutoff}">
                                <input type="hidden" name="quota" value="${quota}">
                                <input type="hidden" name="community" value="${community}">
                                <input type="hidden" name="round" value="${round}">
                                <input type="hidden" name="year" value="${year}">
                                <input type="hidden" name="community_selected" value="${communitySelected ? "1" : "0"}">
                                <button type="submit" class="btn-action btn-primary no-results-reset-btn" aria-label="${t("தேர்வுகளை அழித்து அனைத்துக் கல்லூரிகளையும் காட்டு", "Clear filters and show all colleges")}">
                                  ${t("🔄 தேர்வுகளை அழி (அனைத்துக் கல்லூரிகளையும் காட்டு)", "🔄 Reset / Clear Filters (Show All Colleges)")}
                                </button>
                              </form>`
                            : `<a class="btn-action btn-primary no-results-reset-btn" aria-label="${t("தேர்வுகளை அழித்து அனைத்துக் கல்லூரிகளையும் காட்டு", "Clear filters and show all colleges")}" href="?tab=comparison&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}&amp;searched=1">
                                ${t("🔄 தேர்வுகளை அழி (அனைத்துக் கல்லூரிகளையும் காட்டு)", "🔄 Reset / Clear Filters (Show All Colleges)")}
                              </a>`
                        }
                      </div>
                    </div>
                  </td></tr>
                </tbody>
              </table>
            </div>`
          : collegeGroups
              .map((group) => {
                const doteCat = getCollegeDoteCategory(group.college);
                return `
                  <article class="college-group-card" id="college-card-${esc(group.college.code)}">
                    <div class="college-group-header">
                      <div class="college-group-top">
                        <span class="meta-chip chip-code"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg><span>${t("குறியீடு: ", "Code: ")}<strong>${esc(group.college.code)}</strong></span></span>
                        <span class="meta-chip chip-district"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span><span class="district-tag">· ${esc(group.college.district)}</span></span></span>
                        <span class="type-pill ${doteCat.badgeClass}">${esc(t(doteCat.nameTa, doteCat.nameEn))}</span>
                      </div>
                      <div class="college-group-title-row">
                        <h3 class="college-group-title">${esc(group.college.name)} <span class="college-code">(${esc(group.college.code)})</span></h3>
                        <span class="college-offerings-badge">${group.offerings.length} ${t(group.offerings.length === 1 ? "படிப்பு" : "படிப்புகள்", group.offerings.length === 1 ? "course" : "courses")}</span>
                      </div>
                    </div>

                    <div class="table-responsive">
                      <table class="comparison-table" role="table" aria-label="College Cutoff Comparison Table">
                        <thead>
                          <tr>
                            <th scope="col">${t("கல்லூரி &amp; துறை", "College &amp; Programme")}</th>
                            <th scope="col">${esc(t(`கடைசி கட்-ஆஃப் (${year})`, `Observed Minimum Mark (${year})`))}</th>
                            <th scope="col">${esc(copy.deltaLabel)}</th>
                            <th scope="col">${t("அதிகாரப்பூர்வ விவரம்", "Official Source")}</th>
                            <th scope="col">${t("விருப்பப் பட்டியல்", "Shortlist")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${group.offerings
                            .map((r) => {
                              const id = `${r.college.code}~${r.offering.programmeCode}`;
                              const isShortlisted = shortIds.includes(id);
                              return renderOfferingRow(
                                r,
                                copy,
                                isShortlisted,
                                lang,
                                rawShortlist,
                                {
                                  studentCutoff,
                                  quota,
                                  community,
                                  round,
                                  communitySelected,
                                  year,
                                  query,
                                  typeFilter,
                                  districtFilter,
                                  collegeFilter,
                                  branchFilter,
                                  onlyAvailable,
                                  sortOption,
                                  currentPage: pagination.currentPage,
                                  roundExplicit,
                                },
                                { isGrouped: true, groupCount: group.offerings.length }
                              );
                            })
                            .join("")}
                        </tbody>
                      </table>
                    </div>
                  </article>
                `;
              })
              .join("")
      }

      ${renderPaginationBar()}

      <!-- Level 2 Mobile Filter Sheet Modal -->
      <dialog id="m5-filter-dialog" class="filter-sheet-modal">
        <div class="filter-sheet-header">
          <h3>⚙️ ${t("தேர்வு &amp; வடிகட்டிகள்", "Filters &amp; Search")}</h3>
          <button type="button" class="filter-sheet-close" onclick="var d=document.getElementById('m5-filter-dialog'); if(d) d.close();" aria-label="${t("மூடு", "Close")}">✕</button>
        </div>
        <div class="filter-sheet-body">
          ${renderSearchForm()}
        </div>
      </dialog>

      <div class="comparison-bottom-cta screen-only" style="margin-top: 1.5rem; padding: 1.25rem; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div>
          <strong style="color: #0f172a; font-size: 0.95rem; display: block;">${t("அடுத்த படி:", "Next Step:")}</strong>
          <span style="color: #475569; font-size: 0.88rem;">${t("உங்களுக்கு விருப்பமான கல்லூரிகளைச் சேர்த்த பிறகு, அவற்றை முன்னுரிமைப்படி வரிசைப்படுத்தி அச்சிடலாம்.", "Review your selected options, organize priority order, and export for counselling.")}</span>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <a class="btn-action btn-primary" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
            ${t("என் விருப்பப் பட்டியலை வரிசைப்படுத்த →", "Go to Choice Order Planner →")}
          </a>
          <a class="btn-action" href="?tab=counselling&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}">
            ${t("கலந்தாய்வு நடைமுறைகள் →", "Counselling Guidance →")}
          </a>
        </div>
      </div>

      ${renderLearnBeforeComparing()}

      ${
        shortIds.length > 0
          ? `
      <div class="sticky-shortlist-bar screen-only" role="region" aria-label="${t("விருப்பப் பட்டியல் சுருக்கம்", "Shortlist summary tray")}">
        <div class="sticky-shortlist-inner">
          <div class="sticky-shortlist-info">
            <span style="font-size: 1.1rem;">📋</span>
            <span>
              <strong>${t("என் பட்டியல்", "My Shortlist")}</strong> · <strong>${shortIds.length}</strong> ${t("விருப்பங்கள்", "choices")}
            </span>
          </div>
          <a href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(rawShortlist)}" class="sticky-shortlist-btn">
            ${t("திறக்க →", "Open Planner →")}
          </a>
        </div>
      </div>`
          : ""
      }
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
    collegeFilter: string;
    branchFilter: string;
    onlyAvailable: boolean;
    sortOption: string;
    currentPage?: number;
    roundExplicit?: boolean;
  },
  groupingOptions: { isGrouped?: boolean; isFirstInGroup?: boolean; isLastInGroup?: boolean; groupCount?: number } = {}
): string {
  const { college, offering, result } = row;
  const isGrouped = groupingOptions.isGrouped === true;
  const isFirstInGroup = groupingOptions.isFirstInGroup === true;
  const isLastInGroup = groupingOptions.isLastInGroup === true;
  const groupCount = groupingOptions.groupCount ?? 1;
  const id = `${college.code}~${offering.programmeCode}`;
  const t = (taStr: string, enStr: string) => (lang === "ta" ? taStr : enStr);
  const doteCat = getCollegeDoteCategory(college);

  let deltaHtml = "";
  if (result.isHeld) {
    deltaHtml = `<span class="held-badge">${esc(copy.heldNotice)}</span>`;
  } else if (result.status === "NO_HISTORICAL_DATA") {
    if (result.otherRound && result.otherRoundMark !== null && result.otherRoundMark !== undefined) {
      deltaHtml = `<span class="neutral-badge" style="background: #f8fafc; border-left: 3px solid #64748b;">${esc(
        t(
          `இந்தச் சுற்றில் தரவு இல்லை; ${copy.roundName(result.otherRound)}-ல் கடைசி கட்-ஆஃப் உள்ளது (${result.otherRoundMark.toFixed(2)})`,
          `No comparable record available for this round; a record exists in ${copy.roundName(result.otherRound)} (${result.otherRoundMark.toFixed(2)})`
        )
      )}</span>`;
    } else {
      deltaHtml = `<span class="neutral-badge">${esc(copy.noDataNotice)}</span>`;
    }
  } else if (result.status === "STUDENT_CUTOFF_MISSING") {
    deltaHtml = `<span class="neutral-badge">${t("கட்-ஆஃப் உள்ளிடவும்", "Enter cutoff")}</span>`;
  } else if (result.delta !== null) {
    deltaHtml = `<span class="delta-badge">${esc(copy.formatDelta(result.delta))}</span><small class="delta-caution" style="display: block; margin-top: 2px; font-size: 0.72rem; color: #64748b; line-height: 1.3;">${t("கடந்த ஆண்டுத் தரவு மட்டுமே — சேர்க்கை உத்தரவாதமோ கணிப்போ அல்ல", "Past historical benchmark only — not a guarantee or prediction")}</small>`;
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
    if (result.otherRound && result.otherRoundLocator) {
      sourceHtml = `<details class="source-details"><summary>${esc(copy.roundName(result.otherRound))}</summary><div class="source-details-body">${esc(result.otherRoundLocator)}</div></details>`;
    } else if (result.otherRound) {
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

  let firstColHtml = "";
  if (isGrouped) {
    firstColHtml = `
      <div class="course-cell-main">
        <span class="branch-pill">${esc(offering.programmeCode)}</span>
        <strong class="course-name-text">${esc(offering.programmeName)}</strong>
      </div>
      <span class="district-tag sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;">· ${esc(college.district)}</span>
    `;
  } else {
    firstColHtml = `
      <span class="college-title">${esc(college.name)}</span> <span class="college-code">(${esc(college.code)})</span>
      <span class="type-pill ${doteCat.badgeClass}">${esc(t(doteCat.nameTa, doteCat.nameEn))}</span>
      <div class="offering-subrow">
        <span class="branch-pill">${esc(offering.programmeCode)}</span>
        <span>${esc(offering.programmeName)}</span>
        <span class="district-tag">· ${esc(college.district)}</span>
      </div>
    `;
  }

  return `
    <tr class="offering-row ${isGrouped ? "offering-grouped" : ""} ${isFirstInGroup ? "offering-first-in-group" : ""} ${isLastInGroup ? "offering-last-in-group" : ""}" data-college-code="${esc(college.code)}">
      <td>
        ${firstColHtml}
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
        ${
          isShortlisted
            ? `
          <div style="display: inline-flex; flex-direction: column; gap: 4px; align-items: flex-end;">
            <span class="shortlist-saved-badge" style="display: inline-flex; align-items: center; gap: 3px; font-size: 0.8rem; font-weight: 700; color: #047857; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 4px; white-space: nowrap;">
              ✓ ${t("சேர்க்கப்பட்டது", "Saved")}
            </span>
            <form method="POST" action="/m5-guidance" class="shortlist-toggle-form" style="margin: 0;">
              <input type="hidden" name="tab" value="comparison">
              <input type="hidden" name="lang" value="${lang}">
              <input type="hidden" name="shortlist" value="${esc(nextShortlist)}">
              <input type="hidden" name="searched" value="1">
              <input type="hidden" name="q" value="${esc(sessionState.query)}">
              <input type="hidden" name="type" value="${esc(sessionState.typeFilter)}">
              <input type="hidden" name="district" value="${esc(sessionState.districtFilter)}">
              <input type="hidden" name="college" value="${esc(sessionState.collegeFilter)}">
              <input type="hidden" name="branch" value="${esc(sessionState.branchFilter)}">
              <input type="hidden" name="sort" value="${esc(sessionState.sortOption)}">
              ${sessionState.onlyAvailable ? `<input type="hidden" name="only_available" value="1">` : ""}
              <input type="hidden" name="quota" value="${sessionState.quota}">
              <input type="hidden" name="community" value="${sessionState.community}">
              <input type="hidden" name="round" value="${sessionState.round}">
              ${sessionState.roundExplicit ? `<input type="hidden" name="round_explicit" value="1">` : ""}
              <input type="hidden" name="year" value="${sessionState.year}">
              <input type="hidden" name="community_selected" value="${sessionState.communitySelected ? "1" : "0"}">
              <input type="hidden" name="page" value="${sessionState.currentPage ?? 1}">
              ${sessionState.studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${sessionState.studentCutoff}">` : ""}
              <button type="submit"
                 class="btn-action btn-remove-shortlist"
                 style="font-size: 0.78rem; padding: 3px 8px; min-height: 32px; border: 1px solid #fca5a5; color: #b91c1c; background: #fff; cursor: pointer; border-radius: 4px; white-space: nowrap;"
                 aria-label="${t("விருப்பப் பட்டியலிலிருந்து நீக்கு", "Remove from shortlist")}">
                ${t("நீக்கு ✕", "Remove ✕")}
              </button>
            </form>
          </div>
        `
            : `
          <form method="POST" action="/m5-guidance" class="shortlist-toggle-form" style="margin: 0;">
            <input type="hidden" name="tab" value="comparison">
            <input type="hidden" name="lang" value="${lang}">
            <input type="hidden" name="shortlist" value="${esc(nextShortlist)}">
            <input type="hidden" name="searched" value="1">
            <input type="hidden" name="q" value="${esc(sessionState.query)}">
            <input type="hidden" name="type" value="${esc(sessionState.typeFilter)}">
            <input type="hidden" name="district" value="${esc(sessionState.districtFilter)}">
            <input type="hidden" name="college" value="${esc(sessionState.collegeFilter)}">
            <input type="hidden" name="branch" value="${esc(sessionState.branchFilter)}">
            <input type="hidden" name="sort" value="${esc(sessionState.sortOption)}">
            ${sessionState.onlyAvailable ? `<input type="hidden" name="only_available" value="1">` : ""}
            <input type="hidden" name="quota" value="${sessionState.quota}">
            <input type="hidden" name="community" value="${sessionState.community}">
            <input type="hidden" name="round" value="${sessionState.round}">
            ${sessionState.roundExplicit ? `<input type="hidden" name="round_explicit" value="1">` : ""}
            <input type="hidden" name="year" value="${sessionState.year}">
            <input type="hidden" name="community_selected" value="${sessionState.communitySelected ? "1" : "0"}">
            <input type="hidden" name="page" value="${sessionState.currentPage ?? 1}">
            ${sessionState.studentCutoff !== null ? `<input type="hidden" name="cutoff" value="${sessionState.studentCutoff}">` : ""}
            <button type="submit"
               class="btn-action btn-primary"
               style="white-space: nowrap; min-height: 36px; padding: 6px 12px;"
               aria-label="${t("விருப்பப் பட்டியலில் சேர் (கைமுறை வரிசைப்படுத்தல்)", "Add to manual shortlist")}">
              ${t("+ தேர்வு", "+ Add")}
            </button>
          </form>
        `
        }
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
        <p>${t("உங்கள் விருப்பப் பட்டியலில் இதுவரை எந்தக் கல்லூரியும் இல்லை. கட்-ஆஃப் ஒப்பீட்டுப் பக்கத்திற்குச் சென்று உங்களுக்குப் பிடித்த கல்லூரி மற்றும் துறைகளைத் தேர்வு செய்யலாம்.", "Your shortlist is empty. Browse the comparison directory to add college-programme choices.")}</p>
        <p><a class="btn-action btn-primary" href="?tab=comparison&amp;lang=${lang}">${t("கல்லூரிகளைத் தேர்வு செய்ய →", "Browse Colleges")}</a></p>
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
        <p style="margin-top: 4pt; font-size: 8.5pt; color: #555;">${esc(t("அதிகாரப்பூர்வ TNEA இணையதளத்தில் உங்கள் விருப்பங்களை வரிசைப்படி பதிவு செய்வதற்கான குறிப்புப் பட்டியல்.", "Student-controlled preference worksheet organized according to genuine priority for official TNEA online choice filling."))}</p>
        <p style="margin-top: 4pt; font-size: 8.5pt; font-weight: bold; color: #b91c1c;">${esc(t("⚠️ முக்கியக் குறிப்பு: TNEA இணையதளத்தில் சாய்ஸ் போடும்போது கல்லூரியின் 4-இலக்கக் குறியீட்டை (College Code) கட்டாயம் சரிபார்க்கவும்! (ஒரே பெயரில் வெவ்வேறு கல்லூரிகள் உள்ளன)", "⚠️ Important: Always verify the 4-digit TNEA College Code when entering choices on tneaonline.org (Colleges with similar names have distinct codes)."))}</p>
      </div>

      <div class="screen-only" style="background: #ffffff; border: 1.5px solid #bfdbfe; border-left: 4px solid #2563eb; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
        <h2 style="margin: 0 0 0.35rem; font-size: 1.25rem; color: #1e3a8a;">${t("என் விருப்பப் பட்டியல் வரிசை (Choice Order Planner)", "Your Working Choice Order (Choice Order Planner)")}</h2>
        <ul style="margin: 0.5rem 0 0.75rem; padding-left: 1.2rem; font-size: 0.9rem; color: #334155; line-height: 1.55;">
          <li><strong>${t("திட்டமிடல் பட்டியல் மட்டுமே:", "Planning worksheet only:")}</strong> ${t("இது உங்களின் பயிற்சி மற்றும் திட்டமிடலுக்கான பட்டியல் மட்டுமே; அதிகாரப்பூர்வ TNEA இணையதளத்தில் நீங்களே விருப்பங்களைப் பதிவு செய்ய வேண்டும்.", "This is a student planning worksheet, not an official TNEA online submission.")}</li>
          <li><strong>${t("வரிசை உங்கள் கையில்:", "Student controls order:")}</strong> ${t("விருப்பங்களின் வரிசையை நீங்களே முழுமையாகத் தீர்மானிக்கலாம். இந்தத் தளம் தானாக எந்த வரிசையையும் மாற்றாது.", "You have full control over the preference order with zero automated ranking.")}</li>
          <li><strong>${t("வரிசை மிக முக்கியம்:", "Order matters:")}</strong> ${t("TNEA கணினி விருப்பம் #1-லிருந்து கீழ்நோக்கி வரிசையாக மட்டுமே பார்க்கும். 'மேல்நோக்கிய நகர்வு' (Upward Movement) எப்போதுமே #1-ஐ நோக்கி மட்டுமே உயர்த்தும் என்பதால், உங்களுக்கு மிகவும் பிடித்த கல்லூரிகளை மேலிருந்து கீழாக வரிசைப்படுத்துங்கள்.", "TNEA allocates strictly from Choice #1 downwards; upward movement only moves toward #1.")}</li>
          <li><strong style="color: #c2410c;">${t("⚠️ 4-இலக்கக் குறியீட்டைச் சரிபார்க்கவும்:", "⚠️ Verify 4-digit College Code:")}</strong> ${t("ஒரே பெயர் கொண்ட கல்லூரிகளில் தவறு ஏற்படாமல் இருக்க, TNEA இணையதளத்தில் சாய்ஸ் பதிவு செய்யும்போது இங்குள்ள 4-இலக்கக் குறியீட்டை மட்டுமே முதன்மையாகச் சரிபார்க்கவும்.", "To avoid confusing colleges with similar names, cross-check the official 4-digit College Code printed in this worksheet on tneaonline.org.")}</li>
        </ul>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; justify-content: space-between; margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid #f1f5f9;">
          <button type="button" class="btn-action btn-primary" onclick="window.print()" aria-label="${t("அச்சுப் படிவம் அல்லது PDF ஆகச் சேமி", "Print Worksheet or Save as PDF")}" title="${t("அச்சுப் படிவம் / PDF பதிவிறக்கு", "Print Worksheet / Save as PDF")}">
            ${t("🖨️ அச்சிடு / PDF ஆகச் சேமி", "🖨️ Print / Save PDF")}
          </button>
          <a class="btn-action" aria-label="${t("விருப்பப் பட்டியலை முழுமையாக அழி", "Clear entire shortlist")}" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=" style="color: #c53030;">
            ${t("பட்டியலை அழி", "Clear Shortlist")}
          </a>
        </div>
      </div>

      <div class="table-responsive">
        <table class="comparison-table shortlist-table" role="table" aria-label="Shortlist reordering table">
          <thead>
            <tr>
              <th scope="col" style="width: 70px;">${t("வரிசை", "Choice Order")}</th>
              <th scope="col" class="screen-only">${t("கல்லூரி &amp; துறை", "College &amp; Programme")}</th>
              <th scope="col" class="print-only">${t("கல்லூரி குறியீடு", "College Code")}</th>
              <th scope="col" class="print-only">${t("கல்லூரி பெயர்", "College Name")}</th>
              <th scope="col" class="print-only">${t("பாடப்பிரிவு குறியீடு", "Branch Code")}</th>
              <th scope="col" class="print-only">${t("பாடப்பிரிவு பெயர்", "Branch Name")}</th>
              <th scope="col" class="screen-only" style="width: 280px;">${t("வரிசை மாற்று", "Actions")}</th>
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

                // Move to top / bottom / explicit position via manual shortlist engine helpers
                const topState = moveToTop(shortlistState, id);
                const topIds = topState.items.map((x) => `${x.collegeCode}~${x.programmeCode}`);
                const bottomState = moveToBottom(shortlistState, id);
                const bottomIds = bottomState.items.map((x) => `${x.collegeCode}~${x.programmeCode}`);

                const positionOptions = items
                  .map((_, targetIdx) => {
                    const targetPos = targetIdx + 1;
                    const posState = moveToPosition(shortlistState, id, targetPos);
                    const posIds = posState.items.map((x) => `${x.collegeCode}~${x.programmeCode}`);
                    const posHref = `?tab=shortlist&lang=${lang}&shortlist=${posIds.join(",")}`;
                    return `<option value="${esc(posHref)}" ${targetPos === item.order ? "selected" : ""}>#${targetPos}</option>`;
                  })
                  .join("");

                // Remove ID
                const remList = shortIds.filter((x) => x !== id);

                return `
                  <tr>
                    <td><strong>#${item.order}</strong></td>
                    <td class="screen-only">
                      <strong>${esc(item.collegeName)}</strong> (${esc(item.collegeCode)})<br>
                      <span>${t("துறை:", "Programme:")} <strong>${esc(item.programmeCode)}</strong> · ${esc(item.programmeName)}</span>
                    </td>
                    <td class="print-only"><strong>${esc(item.collegeCode)}</strong></td>
                    <td class="print-only">${esc(item.collegeName)}</td>
                    <td class="print-only"><strong>${esc(item.programmeCode)}</strong></td>
                    <td class="print-only">${esc(item.programmeName)}</td>
                    <td class="screen-only">
                      <div class="shortlist-actions" style="align-items: center;">
                        ${
                          index > 0
                            ? `<a class="btn-action btn-reorder" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(topIds.join(","))}" aria-label="${t(`விருப்பம் #${item.order}-ஐ முதல் இடத்திற்கு (#1) நகர்த்து`, `Move Choice #${item.order} to top (#1)`)}" title="${t("முதல் இடத்திற்கு (#1) நகர்த்து", "Move to Top (#1)")}">⇈</a>`
                            : `<span class="btn-action btn-reorder" aria-disabled="true" style="opacity: 0.35; cursor: not-allowed;" title="${t("முதல் இடத்தில் உள்ளது", "Already at Top")}">⇈</span>`
                        }
                        ${
                          index > 0
                            ? `<a class="btn-action btn-reorder" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(upList.join(","))}" aria-label="${t(`விருப்பம் #${item.order}-ஐ மேலே நகர்த்து`, `Move Choice #${item.order} up`)}" title="${t("மேலே நகர்த்து", "Move Up")}">↑</a>`
                            : `<span class="btn-action btn-reorder" aria-disabled="true" style="opacity: 0.35; cursor: not-allowed;">↑</span>`
                        }
                        ${
                          index < shortIds.length - 1
                            ? `<a class="btn-action btn-reorder" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(downList.join(","))}" aria-label="${t(`விருப்பம் #${item.order}-ஐ கீழே நகர்த்து`, `Move Choice #${item.order} down`)}" title="${t("கீழே நகர்த்து", "Move Down")}">↓</a>`
                            : `<span class="btn-action btn-reorder" aria-disabled="true" style="opacity: 0.35; cursor: not-allowed;">↓</span>`
                        }
                        ${
                          index < shortIds.length - 1
                            ? `<a class="btn-action btn-reorder" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(bottomIds.join(","))}" aria-label="${t(`விருப்பம் #${item.order}-ஐ கடைசி இடத்திற்கு நகர்த்து`, `Move Choice #${item.order} to bottom`)}" title="${t("கடைசி இடத்திற்கு நகர்த்து", "Move to Bottom")}">⇊</a>`
                            : `<span class="btn-action btn-reorder" aria-disabled="true" style="opacity: 0.35; cursor: not-allowed;" title="${t("கடைசி இடத்தில் உள்ளது", "Already at Bottom")}">⇊</span>`
                        }
                        <label for="pos-select-${item.order}" style="font-size: 0.75rem; font-weight: 600; color: #475569; display: inline-flex; align-items: center; gap: 2px; margin: 0;">
                          <span class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;">${t(`விருப்பம் #${item.order} வரிசை எண் மாற்று`, `Move Choice #${item.order} to position`)}</span>
                          <select id="pos-select-${item.order}" class="position-jump-select" aria-label="${t(`விருப்பம் #${item.order} வரிசை எண் மாற்று`, `Move Choice #${item.order} to position`)}" title="${t("குறிப்பிட்ட வரிசை எண்ணுக்கு நகர்த்து", "Move directly to position")}" onchange="if(this.value)window.location.href=this.value" style="min-height: 44px; padding: 0.25rem 0.4rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 0.85rem; background: #fff; color: #0f172a; cursor: pointer;">
                            ${positionOptions}
                          </select>
                        </label>
                        <a class="btn-action btn-reorder" href="?tab=shortlist&amp;lang=${lang}&amp;shortlist=${esc(remList.join(","))}" aria-label="${t(`விருப்பம் #${item.order}-ஐ நீக்கு`, `Remove Choice #${item.order}`)}" title="${t("நீக்கு", "Remove")}" style="color: #dc2626;">✕</a>
                      </div>
                    </td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>

      <details class="screen-only export-details export-container" style="margin-top: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem;">
        <summary style="font-size: 1.05rem; font-weight: 700; color: #1e3a8a; cursor: pointer; padding: 0.25rem 0;">
          📋 ${t("விருப்பப் பட்டியலை நகலெடுக்க (TNEA இணையதளப் பதிவிற்கு)", "Choice List Copy &amp; Export (For Official TNEA Portal)")}
        </summary>
        <p style="font-size: 0.875rem; color: #4a5568; margin: 0.75rem 0 1rem; line-height: 1.5;">
          ${t(
            "அதிகாரப்பூர்வ TNEA இணையதளத்தில் விருப்பங்களைப் பிழையின்றி வரிசைப்படி பதிவு செய்ய, இந்தப் பட்டியலை நகலெடுத்து (Copy) வைத்துக்கொள்ளலாம்.",
            "Copy your finalized ordered choices as plain text or CSV format for reference when filling choices in the official TNEA counselling portal."
          )}
        </p>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn-action" aria-label="${t("விருப்பப் பட்டியலை உரை வடிவில் நகலெடு", "Copy choice list as plain text")}" title="${t("விருப்பப் பட்டியலை உரை வடிவில் நகலெடு", "Copy choice list as plain text")}" onclick="navigator.clipboard?.writeText(document.getElementById('export-text').value); alert('${t("உரை கிளிப்போர்டில் நகலெடுக்கப்பட்டது!", "Plain text copied to clipboard!")}')">
            ${t("📋 பட்டியலை நகலெடு (Text)", "📋 Copy Plain Text")}
          </button>
          <button type="button" class="btn-action" aria-label="${t("விருப்பப் பட்டியலை CSV வடிவில் நகலெடு", "Copy choice list as CSV")}" title="${t("விருப்பப் பட்டியலை CSV வடிவில் நகலெடு", "Copy choice list as CSV")}" onclick="navigator.clipboard?.writeText(document.getElementById('export-csv').value); alert('${t("CSV கிளிப்போர்டில் நகலெடுக்கப்பட்டது!", "CSV copied to clipboard!")}')">
            ${t("📊 CSV வடிவில் நகலெடு", "📊 Copy CSV")}
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label for="export-text" style="font-size: 0.825rem; font-weight: 600; color: #4a5568; display: block; margin-bottom: 0.25rem;">
              ${t("உரை வடிவம் (Plain Text):", "Plain Text Format:")}
            </label>
            <textarea id="export-text" aria-label="${t("விருப்பப் பட்டியல் உரை ஏற்றுமதி", "Choice list plain text export")}" readonly rows="6" style="width: 100%; max-width: 100%; box-sizing: border-box; font-family: monospace, Consolas, sans-serif; font-size: 0.85rem; padding: 0.6rem; border: 1px solid #cbd5e0; border-radius: 4px; background: #fff; line-height: 1.4; resize: vertical;">${esc(plainTextExport)}</textarea>
          </div>

          <details>
            <summary style="font-size: 0.85rem; font-weight: 600; color: #2b6cb0; cursor: pointer; padding: 0.25rem 0;">
              ${t("📊 அட்டவணை வடிவம் (CSV) பார்க்க", "📊 View Tabular CSV Format")}
            </summary>
            <div style="margin-top: 0.5rem;">
              <label for="export-csv" style="font-size: 0.825rem; font-weight: 600; color: #4a5568; display: block; margin-bottom: 0.25rem;">
                ${t("CSV அட்டவணை வடிவம்:", "CSV Format:")}
              </label>
              <textarea id="export-csv" aria-label="${t("விருப்பப் பட்டியல் CSV ஏற்றுமதி", "Choice list CSV export")}" readonly rows="5" style="width: 100%; max-width: 100%; box-sizing: border-box; font-family: monospace, Consolas, sans-serif; font-size: 0.85rem; padding: 0.6rem; border: 1px solid #cbd5e0; border-radius: 4px; background: #fff; line-height: 1.4; resize: vertical;">${esc(csvExport)}</textarea>
            </div>
          </details>
        </div>
      </details>

      <div class="next-step-card screen-only" style="margin-top: 1.75rem; padding: 1.25rem; background: #ebf8ff; border: 1.5px solid #bee3f8; border-radius: 8px;">
        <h3 style="margin: 0 0 0.5rem; color: #2b6cb0;">${t("அடுத்த படி: TNEA கலந்தாய்வு ஒதுக்கீட்டு விதிகளை அறிதல்", "Next Step: Understand Official TNEA Allocation &amp; Upward Movement")}</h3>
        <p style="margin: 0 0 1rem; color: #2d3748; font-size: 0.95rem; line-height: 1.5;">
          ${t("உங்கள் விருப்பப் பட்டியலை வரிசைப்படுத்திய பிறகு, TNEA கலந்தாய்வில் இட ஒதுக்கீடு எப்படி நடக்கிறது என்பதையும், 'மேல்நோக்கிய நகர்வு' (Upward Movement) விதிகளையும் தெளிவாகத் தெரிந்துகொள்ளுங்கள்.", "Once your preference order is set, learn how single-window counselling evaluates choices sequentially from Choice #1 downwards and how upward movement allows you to reach higher preferences without risk.")}
        </p>
        <a class="btn-action btn-primary" style="min-height: 44px; display: inline-flex; align-items: center; justify-content: center;" href="?tab=counselling&amp;lang=${lang}&amp;shortlist=${esc(shortIds.join(","))}">
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

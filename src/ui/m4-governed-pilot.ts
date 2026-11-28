import { buildGovernedPilotView, GOVERNED_PILOT, type PilotInput } from "../m4/governed-pilot.ts";
import { APPROVED_FAMILY_MAPPINGS, buildReleasedFamilies, type ReviewedFamilyMapping } from "../m4/family-mapping.ts";
import { APPROVED_BRANCH_COPY, isReleasedBranchCopy } from "../m4/branch-copy.ts";
import { renderSiteHeader, renderSiteBottomNav, renderIndependenceFooter, SITE_SHELL_CSS, GOOGLE_FONTS_HTML, SHARED_FONT_FAMILY } from "./site-shell.ts";
import { COHORT_300_METADATA } from "../m5/cohort-metadata.ts";
import { getCollegeDoteCategory } from "./m5-guidance-view.ts";


const SEARCH_ALIASES: Record<string, string> = {
  govt: "government",
  tech: "technology",
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
};

function matchesSearch(text: string, entityName: string, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (text.includes(q)) return true;
  const rawTokens = q.split(/[\s,+/]+/).filter(Boolean);
  const normalizedTokens = rawTokens.map(tok => SEARCH_ALIASES[tok] || tok);
  if (normalizedTokens.every(tok => text.includes(tok))) return true;
  if (q.length >= 2 && !q.includes(" ")) {
    const cleanName = entityName.replace(/[^a-zA-Z0-9\s]/g, " ");
    const words = cleanName.split(/\s+/).filter(Boolean);
    const stopWords = new Set(["of", "and", "the", "for", "in", "autonomous"]);
    const meaningfulWords = words.filter(w => !stopWords.has(w.toLowerCase()));
    const meaningfulAcronym = meaningfulWords.map(w => w[0].toLowerCase()).join("");
    if (meaningfulAcronym === q || meaningfulAcronym.startsWith(q)) return true;
    const fullAcronym = words.map(w => w[0].toLowerCase()).join("");
    if (fullAcronym === q || fullAcronym.startsWith(q)) return true;
  }
  return false;
}

const esc = (v: string) => v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
// Base route resolved dynamically per request context
const types: Record<string,readonly [string,string]> = {
 GOVERNMENT:["அரசுப் பொறியியல் கல்லூரி","Government Engineering College"],
 AIDED:["அரசு உதவிபெறும் பொறியியல் கல்லூரி","Government Aided Engineering College"],
 PRIVATE:["சுயநிதிப் பொறியியல் கல்லூரி","Self Financing Engineering College"],
 UNIVERSITY:["பல்கலைக்கழகத் துறை / உறுப்புக் கல்லூரி","University Department / Constituent College"],
 ANNA_UNIV_DEPT:["அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரி","Anna University Department College"],
 ANNAMALAI:["அண்ணாமலைப் பல்கலைக்கழகம்","Annamalai University"],
 CONSTITUENT:["அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரி","Anna University Constituent College"],
 CENTRAL_GOVT:["மத்திய அரசு பொறியியல் கல்லூரி","Central Government College"],
 SFC:["சுயநிதிப் பொறியியல் கல்லூரி","Self Financing Engineering College"],
};

function getDoteCategoryForItem(i: { college: string; type: string | null }): {
  key: string;
  nameEn: string;
  nameTa: string;
  badgeClass: string;
} {
  const meta = COHORT_300_METADATA[i.college];
  if (meta) {
    return getCollegeDoteCategory(meta);
  }
  if (i.college === "5") {
    return {
      key: "ANNAMALAI",
      nameEn: "Annamalai University",
      nameTa: "அண்ணாமலைப் பல்கலைக்கழகம்",
      badgeClass: "type-annamalai",
    };
  }
  if (["1", "2", "3", "4"].includes(i.college)) {
    return {
      key: "ANNA_UNIV_DEPT",
      nameEn: "Anna University Department College",
      nameTa: "அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரி",
      badgeClass: "type-univ",
    };
  }
  if (i.type === "GOVERNMENT") {
    return {
      key: "GOVERNMENT",
      nameEn: "Government Engineering College",
      nameTa: "அரசுப் பொறியியல் கல்லூரி",
      badgeClass: "type-gov",
    };
  }
  if (i.type === "AIDED") {
    return {
      key: "AIDED",
      nameEn: "Government Aided Engineering College",
      nameTa: "அரசு உதவிபெறும் பொறியியல் கல்லூரி",
      badgeClass: "type-aided",
    };
  }
  if (i.type === "CONSTITUENT") {
    return {
      key: "CONSTITUENT",
      nameEn: "Anna University Constituent College",
      nameTa: "அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரி",
      badgeClass: "type-constituent",
    };
  }
  if (i.type === "PRIVATE" || i.type === "SFC") {
    return {
      key: "SFC",
      nameEn: "Self Financing Engineering College",
      nameTa: "சுயநிதிப் பொறியியல் கல்லூரி",
      badgeClass: "type-sfc",
    };
  }
  if (i.type === "UNIVERSITY") {
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

function formatCollegeDropdownLabel(code: string, rawName: string): string {
  if (code === "1") return "CEG (Anna University, Guindy)";
  if (code === "2") return "ACTech (Anna University, Chennai)";
  if (code === "3") return "SAP (Anna University, Chennai)";
  if (code === "4") return "MIT (Anna University, Chromepet)";
  if (code === "5") return "FEAT (Annamalai University, Chidambaram)";
  if (code === "5901") return "ACGCET (Govt. Engg. College, Karaikudi)";
  if (code === "2005") return "GCT (Govt. College of Technology, Coimbatore)";
  if (code === "2006") return "PSG Tech, Coimbatore";
  if (code === "2007") return "CIT, Coimbatore";
  if (code === "5008") return "TCE, Madurai";
  const meta = COHORT_300_METADATA[code];
  if (meta) return meta.name.replace(/\bGovernment\b/g, "Govt.");
  return rawName.replace(/\bGovernment\b/g, "Govt.");
}
type PilotView = ReturnType<typeof buildGovernedPilotView>;
type OwnerDirectoryView = Omit<PilotView, "items"> & { items: (Omit<PilotView["items"][number], "profileId"> & { profileId: string | null; metadata?: {field:string;value:string;year:string;url:string;printedPage:string;pdfPage:string}[]; fieldEvidence?: {field:string;url:string;year:string;printedPage:string;pdfPage:string}[] })[] };

/** Internal renderer; request parameters never supply approved records. */
export function renderGovernedPilot(params: URLSearchParams, input: PilotInput = GOVERNED_PILOT, approvedView?: OwnerDirectoryView, familyRegistry: readonly ReviewedFamilyMapping[] = APPROVED_FAMILY_MAPPINGS, baseRoute = "/colleges"): string {
 const route = baseRoute;
 const isColleges = route === "/colleges";
 const usesApprovedDirectory = approvedView !== undefined;
 const data:OwnerDirectoryView = approvedView ?? buildGovernedPilotView(input), items = data.items;
 const en = params.get("lang") === "en", lang = en ? "en" : "ta";
 const t = (ta:string,english:string) => en ? english : ta;
 const requestedView=params.get("view") ?? "home";
 const validViews=new Set(["home","families","family","branches","branch","colleges","college","detail","compare"]);
 const page=validViews.has(requestedView) ? requestedView : "home", family=params.get("family") ?? "", branch=params.get("branch") ?? "", college=params.get("college") ?? "", programme=params.get("programme") ?? "";
 const district=params.get("district") ?? "", type=params.get("type") ?? "", search=(params.get("q") ?? "").trim(), branchSearch=(params.get("bq") ?? "").trim();
 const requestedPicks=params.getAll("pick"), uniquePicks=[...new Set(requestedPicks)];
 const validPicks=uniquePicks.filter(key=>items.some(i=>i.key===key)).slice(0,3);
 const context:Record<string,string>={};
 for(const key of ["family","branch","district","type","q","page"]) { const value=params.get(key); if(value) context[key]=value; }
 const query=(values:Record<string,string>, keepContext=true, picks=validPicks)=>{
  const q=new URLSearchParams({lang,...(keepContext?context:{}),...values});
  for(const pick of picks)q.append("pick",pick);
  return `${route}?${q.toString()}`;
 };
 const link=(values:Record<string,string>,label:string,keepContext=true,picks=validPicks)=>`<a class="action" href="${esc(query(values,keepContext,picks))}">${esc(label)}</a>`;
 const unknown=t("தெரியவில்லை","Not known");
 const typeName=(value:string|null) => value && types[value] ? t(...types[value]) : unknown;
 const sourceText=(i:(typeof items)[number])=>t(`${i.source.year} பொதுக் கல்விப் பிரிவு; சிறப்புப் பிரிவு கலந்தாய்வுக்கு முந்தைய நிலை.`,`${i.source.year} General Academic; before special-reservation counselling.`);
 const limit=t("இந்தப் பட்டியல் அந்த ஆண்டின் ஒரு நிலையை மட்டும் காட்டுகிறது; இன்றைய கிடைப்பையோ சேர்க்கையையோ உறுதிப்படுத்தாது.","This listing records a stage in the stated year; it does not confirm current availability or admission.");
 const blank=`<p role="status">${isColleges ? t("இந்தத் தேர்வுக்குப் பொருந்தும் கல்லூரிகள் அல்லது படிப்புகள் இல்லை. அனைத்தையும் பார்க்கவும் அல்லது அதிகாரப்பூர்வத் தகவலைச் சரிபார்க்கவும்.","No colleges or programmes match this selection. Show all or check official TNEA information.") : t("இந்த வரையறுக்கப்பட்ட ஆய்வில் காட்ட ஒப்புதல் பெற்ற பதிவு இல்லை. அனைத்தையும் பாருங்கள் அல்லது அதிகாரப்பூர்வத் தகவலைச் சரிபார்க்கவும்.","No display-approved records for this selection in the bounded pilot. Show all or check official information.")}</p>`;
 const matching=items.filter(i => {
  if (branch && i.programme !== branch) return false;
  if (college && college !== "all" && i.college !== college) return false;
  if (district) {
   const itemDist = (i.district ?? (usesApprovedDirectory ? COHORT_300_METADATA[i.college]?.district ?? "" : "")).toLowerCase();
   if (!itemDist || itemDist !== district.toLowerCase()) return false;
  }
  if (type) {
   const itemType = i.type;
   const cat = getDoteCategoryForItem(i).key;
   const hasVerifiedType = (usesApprovedDirectory && !!COHORT_300_METADATA[i.college]) || !!i.type;
   if (!hasVerifiedType) return false;
   const isMatch = (
    type === itemType ||
    type === cat ||
    (type === "PRIVATE" && (itemType === "PRIVATE" || cat === "SFC")) ||
    (type === "SFC" && (itemType === "PRIVATE" || cat === "SFC")) ||
    (type === "UNIVERSITY" && (itemType === "UNIVERSITY" || cat === "ANNA_UNIV_DEPT" || cat === "CONSTITUENT" || cat === "ANNAMALAI"))
   );
   if (!isMatch) return false;
  }
  const meta = usesApprovedDirectory ? COHORT_300_METADATA[i.college] : undefined;
  const distText = i.district ?? meta?.district ?? "";
  const aliasText = (meta?.aliases ?? []).join(" ");
  return matchesSearch((i.collegeName+" "+i.college+" "+i.programmeName+" "+i.programme+(distText?" "+distText:"")+(aliasText?" "+aliasText:"")).toLowerCase(), i.collegeName, search);
 });
 const grouped = new Map<string,typeof items>();
 for(const i of matching) { const group=grouped.get(i.college); if(group)group.push(i);else grouped.set(i.college,[i]); }
 const groups=[...grouped.values()], pageSize=10, requestedPage=Number(params.get("page") ?? "1");
 const pageCount=Math.max(1,Math.ceil(groups.length/pageSize)), pageNumber=Number.isInteger(requestedPage) && requestedPage>0 ? Math.min(requestedPage,pageCount) : 1;
 const visible=groups.slice((pageNumber-1)*pageSize,pageNumber*pageSize);
 const hidden=(name:string,value:string)=>`<input type="hidden" name="${esc(name)}" value="${esc(value)}">`;
 const programmeLabels = [...new Map(items.map(i=>[i.programme,i.programmeName])).entries()];
 const releasedFamilies=buildReleasedFamilies(items,familyRegistry);
 const branchMatches=programmeLabels.filter(([code,name])=>matchesSearch((`${code} ${name}`).toLowerCase(), name, branchSearch));
 const normalizeDistrictDisplay = (raw: string): string =>
  raw
   .trim()
   .toLowerCase()
   .replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
 const rawDistrictCandidates = usesApprovedDirectory
  ? [
     ...items.map(i=>i.district).filter((v):v is string=>!!v),
     ...Object.values(COHORT_300_METADATA).map(m=>m.district).filter(Boolean),
    ]
  : items.map(i=>i.district).filter((v):v is string=>!!v);
 const districtMap = new Map<string, string>();
 for (const d of rawDistrictCandidates) {
  const key = d.trim().toLowerCase();
  if (!key) continue;
  const normalized = normalizeDistrictDisplay(d);
  // Prefer Title-Case display over all-caps if not already registered
  if (!districtMap.has(key) || districtMap.get(key) === districtMap.get(key)?.toUpperCase()) {
   districtMap.set(key, normalized);
  }
 }
 const districtLabels = [...districtMap.values()].sort((a,b)=>a.localeCompare(b));
 const doteCategoryKeys = ["GOVERNMENT", "AIDED", "ANNA_UNIV_DEPT", "ANNAMALAI", "CONSTITUENT", "CENTRAL_GOVT", "SFC"];
 const typeLabels = [
  ...new Set([
   ...items.map(i=>i.type).filter((v):v is string=>!!v && !!types[v]),
   ...doteCategoryKeys,
   "PRIVATE",
   "UNIVERSITY",
  ]),
 ];
 const renderDirectoryCollegeOptions = () => {
  const doteCategories = [
   { key: "GOVERNMENT", ta: "அரசுப் பொறியியல் கல்லூரிகள்", en: "Government Engineering Colleges" },
   { key: "AIDED", ta: "அரசு உதவிபெறும் பொறியியல் கல்லூரிகள்", en: "Government Aided Engineering Colleges" },
   { key: "ANNA_UNIV_DEPT", ta: "அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள்", en: "Anna University Department Colleges" },
   { key: "ANNAMALAI", ta: "அண்ணாமலைப் பல்கலைக்கழகம்", en: "Annamalai University" },
   { key: "CONSTITUENT", ta: "அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள்", en: "Anna University Constituent Colleges" },
   { key: "CENTRAL_GOVT", ta: "மத்திய அரசு பொறியியல் கல்லூரிகள்", en: "Central Government Colleges" },
   { key: "SFC", ta: "சுயநிதிப் பொறியியல் கல்லூரிகள்", en: "Self Financing Engineering Colleges" },
  ];
  const uniqueCols = new Map<string, { code: string; name: string; district: string; catKey: string }>();
  for (const i of items) {
   if (!uniqueCols.has(i.college)) {
    const meta = COHORT_300_METADATA[i.college];
    const dist = i.district ?? meta?.district ?? "";
    const cat = getDoteCategoryForItem(i).key;
    uniqueCols.set(i.college, {
     code: i.college,
     name: formatCollegeDropdownLabel(i.college, i.collegeName),
     district: dist,
     catKey: cat,
    });
   }
  }
  const collegesList = [...uniqueCols.values()].filter(c => {
   if (district && c.district.toLowerCase() !== district.toLowerCase()) return false;
   if (type) {
    const isMatch = (
     type === c.catKey ||
     (type === "PRIVATE" && c.catKey === "SFC") ||
     (type === "SFC" && c.catKey === "SFC") ||
     (type === "UNIVERSITY" && (c.catKey === "ANNA_UNIV_DEPT" || c.catKey === "CONSTITUENT" || c.catKey === "ANNAMALAI"))
    );
    if (!isMatch) return false;
   }
   return true;
  });
  let html = `<option value="">${t("அனைத்துக் கல்லூரிகள் / குறிப்பிட்ட கல்லூரியைத் தேர்வு செய்க", "All Colleges / Select a College")}</option>`;
  for (const cat of doteCategories) {
   const list = collegesList.filter(c => c.catKey === cat.key);
   if (list.length === 0) continue;
   html += `<optgroup label="${esc(t(cat.ta, cat.en))} (${list.length})">`;
   for (const c of list) {
    html += `<option value="${esc(c.code)}"${college === c.code ? " selected" : ""}>[${esc(c.code)}] ${esc(c.name)}${c.district ? ` — ${esc(c.district)}` : ""}</option>`;
   }
   html += `</optgroup>`;
  }
  const otherList = collegesList.filter(c => !doteCategories.some(cat => cat.key === c.catKey));
  if (otherList.length > 0) {
   html += `<optgroup label="${esc(t("இதர கல்லூரிகள்", "Other Listed Colleges"))} (${otherList.length})">`;
   for (const c of otherList) {
    html += `<option value="${esc(c.code)}"${college === c.code ? " selected" : ""}>[${esc(c.code)}] ${esc(c.name)}${c.district ? ` — ${esc(c.district)}` : ""}</option>`;
   }
   html += `</optgroup>`;
  }
  return html;
 };
 const facts=(i:(typeof items)[number])=>`<p>${[[t("கல்லூரிக் குறியீடு","College code"),i.college],...(i.district?[[t("மாவட்டம்","District"),i.district]]:[]),...(i.type&&types[i.type]?[[t("வகை","Type"),typeName(i.type)]]:[])].map(([label,value])=>`${esc(label!)}: ${esc(value!)}`).join(" · ")}</p>`;
 // Detail pages reuse the eligible projection without enriching records.
 const textLink=(values:Record<string,string>,label:string,keepContext=true)=>`<a class="text-link" href="${esc(query(values,keepContext))}">${esc(label)}</a>`;
 const primary=(values:Record<string,string>,label:string)=>`<a class="action primary" href="${esc(query(values))}">${esc(label)}</a>`;
 const guidance=(label:string,emphasized=false)=>`<a class="${emphasized?"action primary":"text-link"}" href="/journey?step=awareness&amp;lang=${lang}">${esc(label)}</a>`;
 const detailFacts=(i:(typeof items)[number])=>`<dl class="fact-grid"><div><dt>${t("கல்லூரிக் குறியீடு","College code")}</dt><dd>${esc(i.college)}</dd></div><div><dt>${t("மாவட்டம்","District")}</dt><dd>${esc(i.district ?? unknown)}</dd></div><div><dt>${t("கல்லூரி வகை","Institution type")}</dt><dd>${esc(typeName(i.type))}</dd></div></dl>`;
 const datedNotice=(i:(typeof items)[number])=>`<p class="source-notice"><strong>${i.source.year} ${t("பட்டியல் பதிவு.","source listing.")}</strong> ${t("தற்போதைய கிடைப்பையோ சேர்க்கையையோ இது உறுதிப்படுத்தாது.","This does not confirm current availability or admission.")}</p>`;
 const evidence=(item:(typeof items)[number], related:typeof items=[item], exact=related.length===1)=>{
  const colleges=new Set(related.map(row=>row.college)).size, programmes=new Set(related.map(row=>row.programme)).size;
  const scope=exact
   ? `<p>${t("அச்சுப் பக்கம் / PDF பக்கம்","Printed / PDF page")}: ${esc(String(item.source.printed_page ?? unknown))} / ${esc(String(item.source.pdf_page ?? unknown))} · ${item.source.location_status === "VERIFIED" ? t("சரிபார்க்கப்பட்டது","verified") : t("பதிவு செய்யப்பட்டது","recorded")}</p>`
   : `<p>${t("இந்தக் காட்சியின் நிர்வகிக்கப்பட்ட வரம்பு","Governed scope in this view")}: ${related.length} ${t("படிப்புப் பதிவுகள்","offering records")} · ${colleges} ${t(colleges===1?"கல்லூரி":"கல்லூரிகள்",colleges===1?"college":"colleges")} · ${programmes} ${t(programmes===1?"படிப்புக் குறியீடு":"படிப்புக் குறியீடுகள்",programmes===1?"programme code":"programme codes")}.</p><p class="supporting">${t("ஒவ்வொரு படிப்பு விவரப் பக்கத்திலும் அதன் சரியான மூலப் பக்கம் உள்ளது.","Each programme detail page retains its exact source page.")}</p>`;
  const fieldSources=exact ? ("fieldEvidence" in item ? item.fieldEvidence ?? [] : []).map(f=>`<p>${f.field==="district"?t("மாவட்ட ஆதாரம்","District source"):t("வகை ஆதாரம்","Institution type source")}: ${esc(f.year)} · ${t("அச்சுப் பக்கம் / PDF பக்கம்","Printed / PDF page")} ${esc(f.printedPage || unknown)} / ${esc(f.pdfPage || unknown)} · <a href="${esc(f.url)}">${t("கல்லூரி விவர ஆவணம்","College information booklet")}</a></p>`).join("") : "";
  return `<details class="card evidence"><summary>${exact?t("ஆதாரம் மற்றும் சரியான மூல இடம்","Evidence and exact source location"):t("மூலச் சுருக்கமும் வரம்பும்","Source summary and limits")}</summary><p>${esc(sourceText(item))}</p>${scope}<a href="${esc(item.source.url)}">${t("மூல ஆவணத்தைத் திற","Open source document")}</a>${fieldSources}</details>`;
 };
 const metadataLabels:Record<string,readonly [string,string]>={address:["முகவரி","Address"],taluk:["வட்டம்","Taluk"],pincode:["அஞ்சல் குறியீடு","PIN code"],website:["இணையதளம் — ஆவணத்தில் உள்ளபடி","Website — as published"],phone_fax:["தொலைபேசி / தொலைநகல்","Phone / fax"],email:["மின்னஞ்சல்","Email"],autonomous_status:["தன்னாட்சி நிலை","Autonomous status"],minority_status:["சிறுபான்மை நிலை","Minority status"]};
 const metadataPanel=(i:(typeof items)[number])=>{
  const rows=i.metadata ?? [];
  if(!rows.length)return `<p class="supporting">${t("கூடுதல் கல்லூரி விவரங்கள் இங்கு இன்னும் கிடைக்கவில்லை.","Additional college details are not yet available here.")}</p>`;
  return `<details class="card college-metadata" id="college-metadata"><summary>${t("மேலும் கல்லூரி விவரங்கள்","More college details")}</summary><p>${t("2026 கல்லூரி விவர ஆவணத்தில் உள்ள தகவல்; தற்போதைய நிலையைச் சரிபார்க்கவும்.","As recorded in the 2026 college booklet; check the current details.")}</p><dl>${Object.entries(metadataLabels).map(([field,label])=>{const f=rows.find(row=>row.field===field);const value=f?.value;return `<div><dt>${t(...label)}</dt><dd>${esc(value===undefined ? unknown : ["autonomous_status","minority_status"].includes(field) ? value==="Yes"?t("ஆம்","Yes"):value==="No"?t("இல்லை","No"):value : value)}</dd></div>`;}).join("")}</dl><details><summary>${t("இந்த விவரங்களின் ஆதாரம்","Sources for these details")}</summary>${rows.map(f=>`<p>${t(...metadataLabels[f.field])}: ${esc(f.year)} · ${t("அச்சுப் பக்கம் / PDF பக்கம்","Printed / PDF page")} ${esc(f.printedPage)} / ${esc(f.pdfPage)} · <a href="${esc(f.url)}#page=${esc(f.pdfPage)}">${t("ஆவணம்","Source")}</a></p>`).join("")}</details></details>`;
 };
 const clearFilters=()=>link({view:"colleges",...(branch?{branch}:{})},t("தேடல் மற்றும் வடிகட்டிகளை நீக்கு","Clear search and filters"),false,validPicks);
 const totalCollegesCount = new Set(items.map(i=>i.college)).size;
 const verifiedDistrictColleges = new Set(items.filter(i=>!!i.district).map(i=>i.college)).size;
 const sparseMeta = isColleges && totalCollegesCount > 20 && verifiedDistrictColleges < totalCollegesCount / 2;
 const filterSummary = sparseMeta
  ? t("மாவட்டம் / வகை வடிகட்டிகள் (குறைந்த அளவு தரவு)","District / type filters (limited verified coverage)")
  : t("மாவட்டம் / வகை வடிகட்டிகள்","District / type filters");
 const sparseMetaNote = sparseMeta
  ? `<p class="supporting filter-note">${filterSummary} · ${t("தற்போது சில கல்லூரிகளுக்கு மட்டுமே மாவட்டம் மற்றும் வகை அதிகாரப்பூர்வமாகச் சரிபார்க்கப்பட்டுள்ளன. பெயர் அல்லது குறியீடு தேடலையும் பயன்படுத்தலாம்.","District and college type are currently verified for a subset of colleges. You can also search by name or code.")}</p>`
  : "";
 const collegeDropdown = usesApprovedDirectory
  ? `<div class="filter-full"><label for="college-select">${t("குறிப்பிட்ட கல்லூரி (DOTE வகை வாரியாக)","Specific college (by DOTE Category)")}</label><select id="college-select" name="college" aria-label="${t("குறிப்பிட்ட கல்லூரி (DOTE வகை வாரியாக)","Specific college (by DOTE Category)")}">${renderDirectoryCollegeOptions()}</select></div>`
  : "";
 const filterForm=()=>`<form method="get" action="${route}" class="card filters filter-form-light">${hidden("lang",lang)}${hidden("view","colleges")}${hidden("searched","1")}${branch?hidden("branch",branch):""}${validPicks.map(p=>hidden("pick",p)).join("")}<div class="filter-search"><label for="college-search">${t("கல்லூரி / படிப்பு தேடல் (பெயர், குறியீடு அல்லது சுருக்கம்)","Search college or programme (name, code, or acronym)")}</label><div class="search-row"><input id="college-search" name="q" type="search" aria-label="${t("கல்லூரி / படிப்பு தேடல் (பெயர், குறியீடு அல்லது சுருக்கம்)","Search college or programme (name, code, or acronym)")}" value="${esc(search)}" placeholder="${t("எ.கா. CEG, PSG, GCT, CSE","e.g. CEG, PSG, GCT, CSE")}"><button type="submit" class="search-submit" aria-label="${t("கல்லூரிகளைத் தேடு","Search colleges")}">${t("தேடு","Search")}</button></div></div>${sparseMetaNote}<div class="filter-grid" style="margin: 0.5rem 0;"><div><label for="type-filter">${t("கல்லூரி வகை (DOTE வகைப்பாடு)","College category (DOTE Classification)")}</label><select id="type-filter" name="type" class="light-select" aria-label="${t("கல்லூரி வகை (DOTE வகைப்பாடு)","College category (DOTE Classification)")}"><option value="">${t("அனைத்து வகைகள் (DOTE வகைப்பாடு)","All Categories (DOTE Classification)")}</option><option value="GOVERNMENT"${type==="GOVERNMENT"?" selected":""}>${t("அரசுப் பொறியியல் கல்லூரிகள்","Government Engineering Colleges")}</option><option value="AIDED"${type==="AIDED"?" selected":""}>${t("அரசு உதவிபெறும் பொறியியல் கல்லூரிகள்","Government Aided Engineering Colleges")}</option><option value="ANNA_UNIV_DEPT"${type==="ANNA_UNIV_DEPT"?" selected":""}>${t("அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள்","Anna University Department Colleges")}</option><option value="ANNAMALAI"${type==="ANNAMALAI"?" selected":""}>${t("அண்ணாமலைப் பல்கலைக்கழகம்","Annamalai University")}</option><option value="CONSTITUENT"${type==="CONSTITUENT"?" selected":""}>${t("அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள்","Anna University Constituent Colleges")}</option><option value="CENTRAL_GOVT"${type==="CENTRAL_GOVT"?" selected":""}>${t("மத்திய அரசு பொறியியல் கல்லூரிகள்","Central Government Colleges")}</option><option value="SFC"${type==="SFC"||type==="PRIVATE"?" selected":""}>${t("சுயநிதிப் பொறியியல் கல்லூரிகள்","Self Financing Engineering Colleges")}</option>${type==="UNIVERSITY"?`<option value="UNIVERSITY" selected>${t("பல்கலைக்கழகத் துறை / உறுப்புக் கல்லூரி","University Department / Constituent College")}</option>`:""}${type==="PRIVATE"?`<option value="PRIVATE" selected>${t("சுயநிதிப் பொறியியல் கல்லூரி","Self Financing Engineering College")}</option>`:""}</select><div class="dote-guide" style="font-size:0.8rem;margin-top:4px;color:#64748b;"><span>${t("அதிகாரப்பூர்வ DOTE வகைப்பாடு (ஆதாரம்: <a href=\"https://dte.tn.gov.in/\" target=\"_blank\" rel=\"noreferrer\" style=\"color:#0f766e;font-weight:600;\">dte.tn.gov.in</a>)","Official DOTE Categories (Source: <a href=\"https://dte.tn.gov.in/\" target=\"_blank\" rel=\"noreferrer\" style=\"color:#0f766e;font-weight:600;\">dte.tn.gov.in</a>)")}</span></div></div><div><label for="district-filter">${t("மாவட்டம்","District")}</label><select id="district-filter" name="district" class="light-select" aria-label="${t("மாவட்டம்","District")}"><option value="">${t("அனைத்து மாவட்டங்கள்","All districts")}</option>${districtLabels.map(d=>`<option value="${esc(d)}"${d.toLowerCase()===district.trim().toLowerCase()?" selected":""}>${esc(d)}</option>`).join("")}</select></div>${collegeDropdown}</div><div class="filter-actions"><button type="submit" class="btn-filter-apply" aria-label="${t("வடிகட்டிகளைப் பயன்படுத்து","Apply filters")}">${t("வடிகட்டிகளைப் பயன்படுத்து","Apply filters")}</button>${search||district||type||college?clearFilters():""}</div></form>`;
 const releasedProfileIds = new Set([
  ...items.filter(i=>i.profile).map(i=>i.programme),
  ...(usesApprovedDirectory ? APPROVED_BRANCH_COPY.filter(isReleasedBranchCopy).map(p=>p.id) : []),
 ]);
 const getBranchIcon = (code: string, name: string): string => {
  const n = name.toUpperCase();
  const c = code.toUpperCase();
  if (c === "CS" || c === "IT" || c === "AD" || c === "AM" || c === "AI" || /COMPUTER|INFORMATION|DATA|SOFTWARE|ARTIFICIAL|CYBER/i.test(n)) {
   return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
  }
  if (c === "EC" || c === "EE" || c === "EI" || /ELECTRONIC|ELECTRICAL|INSTRUMENT|COMMUNICATION/i.test(n)) {
   return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }
  if (c === "ME" || c === "AU" || c === "PR" || c === "MF" || c === "MN" || /MECHANICAL|AUTOMOBILE|MANUFACTURING|PRODUCTION|MECHATRONIC|ROBOTIC/i.test(n)) {
   return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
  }
  if (c === "CE" || c === "AR" || /CIVIL|ARCHITECT|STRUCTUR|ENVIRONMENT|CONSTRUCTION/i.test(n)) {
   return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`;
  }
  if (c === "CH" || c === "BT" || c === "FT" || /CHEMIC|BIOTECH|BIO MEDICAL|BIO|FOOD|PHARM|POLYMER|TEXTILE|PLASTIC/i.test(n)) {
   return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v7.31L4.1 19.46A2 2 0 0 0 5.76 22h12.48a2 2 0 0 0 1.66-2.54L14 9.31V2h-4z"/><line x1="8.5" y1="2" x2="15.5" y2="2"/></svg>`;
  }
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
 };
 const formatBranchItem = (code: string, name: string) => {
  const tags: string[] = [];
  if (/\(SS\)/i.test(name)) tags.push(`<span class="branch-tag">${t("சுயநிதிப் பிரிவு (SS)","Self-Supporting (SS)")}</span>`);
  if (/\(TAMIL(?:\s+MEDIUM)?\)/i.test(name)) tags.push(`<span class="branch-tag">${t("தமிழ் வழி","Tamil Medium")}</span>`);
  if (releasedProfileIds.has(code)) tags.push(`<span class="branch-tag branch-tag-explained">${t("விளக்கம் உள்ளது","Explained")}</span>`);
  const typoHint = /BUSSINESS|ENGINEEIRNG|STRUCTUTURAL/i.test(name)
   ? ` <span class="supporting typo-hint">(${t("தெளிவான பெயர்","Readable name")}: ${esc(name.replaceAll("BUSSINESS","BUSINESS").replaceAll("ENGINEEIRNG","ENGINEERING ").replaceAll("STRUCTUTURAL","STRUCTURAL"))})</span>`
   : "";
  return `<a class="branch-card-row" href="${esc(query({view:"branch",branch:code}))}"><div class="branch-card-icon">${getBranchIcon(code, name)}</div><div class="branch-card-content"><div class="branch-card-top"><strong class="branch-card-name">${esc(name)} (${esc(code)})</strong></div>${tags.length ? `<div class="branch-card-tags">${tags.join(" ")}</div>` : ""}${typoHint}</div><span class="branch-card-arrow">→</span></a>`;
 };
 const scopeBanner = `<div class="card scope-banner"><p><strong>${t("மதிப்பெண்கள் இன்றி கல்லூரிகளை ஆராயலாம்:","Explore colleges without cutoff marks:")}</strong> ${t("2026 TNEA மூலப் பட்டியல் அடிப்படையில் கல்லூரிகளையும் படிப்புகளையும் இங்கு பெயர், குறியீடு, மாவட்டம் அல்லது வகையால் தேடலாம் (இப்போதே கல்லூரியையோ படிப்பையோ தேர்ந்தெடுக்க வேண்டியதில்லை). கடந்த ஆண்டு கட்-ஆஃப் ஒப்பீட்டுடன் திட்டமிட விரும்பினால், ","Search 2026 listed colleges and programmes here by name, code, district or type without cutoff marks (no need to choose yet). If you wish to compare with historical cutoffs, visit the ")}<a href="/m5-guidance?lang=${lang}">${t("விருப்பப் பட்டியல் பக்கத்தைப்","Choice Planner")}</a>${t(" பயன்படுத்தலாம்."," page.")}</p></div>`;
 const doteOfficialGuide = `<details class="card beginner-guide dote-guide"><summary>${t("தமிழ்நாடு தொழில்நுட்பக் கல்வி இயக்ககம் (DOTE) கல்லூரி வகைப்பாடு — அதிகாரப்பூர்வ வழிகாட்டி","Directorate of Technical Education (DOTE) College Categories — Official Guide")}</summary><p class="supporting">${t("தமிழ்நாடு தொழில்நுட்பக் கல்வி இயக்ககத்தின் (DOTE) அதிகாரப்பூர்வ வகைப்பாட்டின்படி கல்லூரிகள் கீழ்க்கண்ட பிரிவுகளாகப் பிரிக்கப்பட்டுள்ளன (ஆதாரம்: <a href=\"https://dte.tn.gov.in/\" target=\"_blank\" rel=\"noreferrer\">dte.tn.gov.in</a>):","As classified by the Directorate of Technical Education (DOTE), Government of Tamil Nadu (Source: <a href=\"https://dte.tn.gov.in/\" target=\"_blank\" rel=\"noreferrer\">dte.tn.gov.in</a>):")}</p><ul class="guide-list"><li><strong>${t("அரசுப் பொறியியல் கல்லூரிகள் (Government Engineering Colleges):","Government Engineering Colleges:")}</strong> ${t("தமிழக அரசால் நேரடியாக நடத்தப்படும் 11 பொறியியல் கல்லூரிகள் (எ.கா. GCT 2005, Bargur 2603, ACGCET 5901). குறைந்த கல்விக் கட்டணம்.","11 institutions run directly by the Government of Tamil Nadu (e.g. GCT 2005, Bargur 2603, ACGCET 5901). Lowest tuition fees.")}</li><li><strong>${t("அரசு உதவிபெறும் பொறியியல் கல்லூரிகள் (Government Aided Engineering Colleges):","Government Aided Engineering Colleges:")}</strong> ${t("தமிழக அரசின் மானியம் பெறும் 3 பொறியியல் கல்லூரிகள் (PSG Tech 2006, CIT 2007, TCE 5008). இவற்றில் அரசு உதவிபெறும் இடங்களும் சுயநிதிப் (SS) பிரிவுகளும் உள்ளன.","3 state grant-in-aid engineering institutions (PSG Tech 2006, CIT 2007, TCE 5008) offering both aided and self-supporting (SS) seats.")}</li><li><strong>${t("அண்ணா பல்கலைக்கழகத் துறைக் கல்லூரிகள் (Anna University Department Colleges):","Anna University Department Colleges:")}</strong> ${t("அண்ணா பல்கலைக்கழகத்தின் நேரடி 4 வளாகக் கல்லூரிகள் (CEG 1, ACTech 2, SAP 3, MIT 4).","4 direct university department campuses of Anna University (CEG 1, ACTech 2, SAP 3, MIT 4).")}</li><li><strong>${t("அண்ணாமலைப் பல்கலைக்கழகம் (Annamalai University):","Annamalai University:")}</strong> ${t("சிதம்பரத்தில் உள்ள அண்ணாமலைப் பல்கலைக்கழகப் பொறியியல் மற்றும் தொழில்நுட்பப் புலம் (FEAT 5).","Faculty of Engineering & Technology, Annamalai University, Chidambaram (FEAT 5).")}</li><li><strong>${t("அண்ணா பல்கலைக்கழக உறுப்புக் கல்லூரிகள் (Anna University Constituent Colleges):","Anna University Constituent Colleges:")}</strong> ${t("தமிழகத்தின் பல்வேறு மாவட்டங்களில் இயங்கும் அண்ணா பல்கலைக்கழகத்தின் 16 உறுப்புக் கல்லூரிகள் (UCE ஆரணி, திண்டிவனம், திருச்சி, திருக்குவளை, நாகர்கோவில் போன்றவை).","16 constituent engineering campuses of Anna University located across districts (UCE Arni, Tindivanam, Trichy, Thirukkuvalai, Nagercoil, etc.).")}</li><li><strong>${t("மத்திய அரசு பொறியியல் கல்லூரிகள் (Central Government Colleges):","Central Government Colleges:")}</strong> ${t("மத்திய அரசால் நிர்வகிக்கப்படும் நிறுவனங்கள் (CIPET, IIHT போன்றவை).","Centrally administered institutions (CIPET, IIHT, etc.).")}</li><li><strong>${t("சுயநிதிப் பொறியியல் கல்லூரிகள் (Self Financing Engineering Colleges):","Self Financing Engineering Colleges:")}</strong> ${t("தனியார் அறக்கட்டளைகளால் நிர்வகிக்கப்பட்டு அண்ணா பல்கலைக்கழகத்துடன் இணைக்கப்பட்ட கல்லூரிகள் (தன்னாட்சி / தன்னாட்சி அல்லாதவை). இவற்றில் TNEA அரசு ஒதுக்கீட்டு இடங்கள் உண்டு.","Colleges managed by private trusts affiliated with Anna University (Autonomous and Non-Autonomous), offering TNEA government quota seats.")}</li></ul><p class="supporting">${t("அனைத்து வகைப்பாடுகளும் மாணவர்களின் வெளிப்படையான புரிதலுக்காக மட்டுமே; எந்தக் கல்லூரியும் தானாகத் தரவரிசைப்படுத்தப்படவில்லை.","Classifications are for student informational clarity only; no college is ranked or recommended.")}</p></details>`;
 const beginnerGuides = doteOfficialGuide + `<details class="card beginner-guide"><summary>${t("கல்லூரி வகைகள்: அரசு, உதவி பெறும், சுயநிதி, தன்னாட்சி, (SS) — எளிய விளக்கம்","College types: Government, Aided, Self-Financing, Autonomous, and (SS) explained")}</summary><ul class="guide-list"><li><strong>${t("அரசு கல்லூரிகள் (Government):","Government colleges:")}</strong> ${t("தமிழ்நாடு அரசால் நடத்தப்படும் பொறியியல் கல்லூரிகள்.","Engineering colleges run directly by the Government of Tamil Nadu.")}</li><li><strong>${t("அரசு உதவி பெறும் கல்லூரிகள் (Government-aided):","Government-aided colleges:")}</strong> ${t("அரசு நிதியுதவி பெறும் சில படிப்புகளைக் கொண்ட நிறுவனங்கள். ஒரே கல்லூரியில் அரசு உதவி பெறும் படிப்புகளும் சுயநிதிப் (SS) படிப்புகளும் தனித்தனியாக இருக்கலாம்.","Institutions receiving government grant-in-aid for specific programmes. The same campus may offer aided and Self-Supporting (SS) programmes separately.")}</li><li><strong>${t("தனியார் / சுயநிதி கல்லூரிகள் (Private / Self-financing):","Private / self-financing colleges:")}</strong> ${t("தனியார் அறக்கட்டளைகளால் நடத்தப்படும் கல்லூரிகள்; இவற்றில் TNEA அரசு ஒதுக்கீடு இடங்களும் நிர்வாக ஒதுக்கீடு இடங்களும் இருக்கும்.","Colleges run by private trusts, offering both TNEA government-quota seats and management-quota seats.")}</li><li><strong>${t("பல்கலைக்கழக / உறுப்புக் கல்லூரிகள் (University / Constituent):","University / constituent colleges:")}</strong> ${t("அண்ணா பல்கலைக்கழக வளாகங்கள் மற்றும் உறுப்புப் பொறியியல் கல்லூரிகள்.","Anna University campuses and constituent engineering colleges.")}</li><li><strong>${t("தன்னாட்சி (Autonomous) vs இணைப்பு (Affiliated):","Autonomous vs. Affiliated:")}</strong> ${t("தன்னாட்சி கல்லூரிகள் தங்கள் பாடத்திட்டத்தையும் தேர்வுகளையும் பல்கலைக்கழக விதிகளுக்குள் அமைக்கும்; இணைப்பு கல்லூரிகள் அண்ணா பல்கலைக்கழகத்தின் பொதுப் பாடத்திட்டத்தையும் தேர்வுகளையும் பின்பற்றும்.","Autonomous colleges design their own curriculum and exams under university regulations; affiliated colleges follow Anna University's common curriculum and exams.")}</li><li><strong>${t("சுயநிதிப் பிரிவு (SS — Self-Supporting):","Self-Supporting (SS) programmes:")}</strong> ${t("அரசு / உதவி பெறும் / பல்கலைக்கழக வளாகங்களில் சுயநிதி முறையில் நடத்தப்படும் பாடப்பிரிவுகள். இவற்றின் கட்டணம் வழக்கமான அரசு உதவி பெறும் பிரிவிலிருந்து மாறுபடலாம்.","Programmes run on a self-supporting fee basis within government, aided, or university campuses. Fees may differ from regular aided programmes.")}</li></ul><p class="supporting">${t("கட்டணம், விடுதி மற்றும் வசதிகள் கல்லூரிக்கு கல்லூரி மாறுபடும் — அதிகாரப்பூர்வ TNEA மற்றும் கல்லூரி அறிவிப்பில் சரிபார்க்கவும். இங்கு எந்த வகையும் \"சிறந்தது\" என்று தரவரிசைப்படுத்தப்படவில்லை.","Fees, hostel, and facilities vary by institution — check official TNEA and college notices. No college type is ranked as \"best\" here.")}</p></details><details class="card beginner-guide"><summary>${t("கல்லூரி, பாடப்பிரிவு, இடம் — எப்படி ஒப்பிட்டு யோசிப்பது?","College, branch, or location — how to think through trade-offs")}</summary><p>${t("பல மாணவர்களும் பெற்றோர்களும் கேட்கும் கேள்வி: \"நல்ல கல்லூரியா, பிடித்த பாடப்பிரிவா, ஊருக்கு அருகிலா?\" இதற்கு ஒரே சரியான விடை இல்லை. கீழே உள்ளவற்றை குடும்பத்துடன் சேர்ந்து யோசியுங்கள்:","Many students and parents ask: \"Should I prioritize the college, the branch, or the location?\" There is no single right answer. Reflect together on:")}</p><ul class="guide-list"><li><strong>${t("ஆர்வமும் பாடப்பிரிவும்:","Interest & branch:")}</strong> ${t("அடுத்த 4 ஆண்டுகள் எந்தப் பாடங்களை ஆர்வத்துடன் படிக்க முடியும்?","Which subjects can you stay engaged with for the next 4 years?")}</li><li><strong>${t("கல்லூரியும் கற்றல் சூழலும்:","College & learning environment:")}</strong> ${t("பாடத்திட்டம், ஆய்வக வசதி, கற்றல் ஆதரவு ஆகியவற்றை அதிகாரப்பூர்வத் தகவல்களில் சரிபாருங்கள்.","Check official information on curriculum, labs, and learning support.")}</li><li><strong>${t("இடம், பயண தூரம் மற்றும் விடுதி:","Location, travel & hostel:")}</strong> ${t("தினசரி பயணம் செய்ய முடியுமா அல்லது விடுதியில் தங்க முடியுமா?","Is daily commute practical, or is hostel stay manageable?")}</li><li><strong>${t("கட்டணமும் குடும்பச் சூழலும்:","Fees & family constraints:")}</strong> ${t("கல்விக் கட்டணம், விடுதிக் கட்டணம், அரசு உதவித்தொகை (முதல் பட்டதாரி, PMSS, 7.5% போன்றவை) ஆகியவற்றைக் கணக்கில் கொள்ளுங்கள்.","Factor in tuition, hostel costs, and eligible government fee support (First Graduate, PMSS, 7.5%, etc.).")}</li><li><strong>${t("எதிர்காலத் திசை:","Future direction:")}</strong> ${t("வேலைவாய்ப்பு, மேற்படிப்பு அல்லது திறன் மேம்பாட்டுக்கு இந்தப் பிரிவு எப்படி உதவும்?","How does this field support your post-college work or further-study plans?")}</li></ul><p class="supporting">${t("இந்த வழிகாட்டி எந்தக் கல்லூரியையும் தானாகத் தேர்ந்தெடுக்காது; இறுதி முடிவும் விருப்ப வரிசையும் முழுமையாக உங்களுடையதே.","This guide never auto-ranks colleges; the final decision and preference order remain entirely yours.")}</p></details>`;
 const groupCard=(group:typeof items)=>{
   const first=group[0];
   const doteCat = getDoteCategoryForItem(first);
   const hasVerifiedCat = !!COHORT_300_METADATA[first.college] || !!first.type;
   const doteBadge = hasVerifiedCat ? `<span class="badge ${doteCat.badgeClass}">${esc(t(doteCat.nameTa, doteCat.nameEn))}</span>` : "";
   const codeChip = `<span class="meta-chip chip-code"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg><span>${t("குறியீடு: ","Code: ")}<strong>${esc(first.college)}</strong></span></span>`;
   const districtChip = first.district ? `<span class="meta-chip chip-district"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>${t("மாவட்டம்: ","District: ")}${esc(first.district)}</span></span>` : "";
   const options=group.map(i=>`<li>${esc(i.programmeName)} (${esc(i.programme)}) ${validPicks.includes(i.key)?`<strong>${t("தேர்ந்தெடுத்தது","Selected")}</strong>`:validPicks.length<3?link({view:"colleges"},t("ஒப்பீட்டில் சேர்","Add to comparison"),true,[...validPicks,i.key]):""}</li>`).join("");
   const compareChoice=group.length===1 ? validPicks.includes(first.key)
     ? `<p><strong>${t("ஒப்பிடத் தேர்ந்தெடுக்கப்பட்டது","Selected for comparison")}</strong></p>`
     : validPicks.length<3 ? link({view:"colleges"},t("ஒப்பீட்டில் சேர்","Add to comparison"),true,[...validPicks,first.key]) : ""
     : (!isColleges || branch) ? `<details><summary>${t("ஒப்பிட ஒரு படிப்பைத் தேர்ந்தெடு","Choose a programme to compare")}</summary><ul>${options}</ul></details>` : "";
   const matchInfo = branch ? `<p class="result-card-branch">${t("தேர்ந்தெடுத்த படிப்பு:","Selected branch:")} <strong>${esc(first.programmeName)} (${esc(first.programme)})</strong></p>` : "";
   const collegeLinkUrl = query({view:"college",college:first.college});
   const compareBlock = compareChoice ? `<div class="result-actions">${compareChoice}</div>` : "";
   return `<article class="card result-card"><div class="result-card-top"><div class="result-card-chips">${codeChip}${districtChip}</div>${doteBadge}</div><h2 class="result-card-title"><a class="college-title-link" href="${esc(collegeLinkUrl)}">${esc(first.collegeName)}</a></h2><div class="result-card-footer"><span class="offerings-count-pill"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> <span>${group.length} ${t(group.length===1?"பட்டியலிடப்பட்ட படிப்பு":"பட்டியலிடப்பட்ட படிப்புகள்",group.length===1?"listed programme":"listed programmes")}</span></span><a class="view-programmes-link" href="${esc(collegeLinkUrl)}">${t("படிப்புகளைப் பார் →","View courses →")}</a></div>${matchInfo}${compareBlock}</article>`;
 };
 let body="";
 if(page==="home") {
   body=`<h1>${t("கல்லூரிகளையும் படிப்புகளையும் ஆராயலாம்","Explore colleges and programmes")}</h1>${scopeBanner}<h2>${t("எப்படி ஆராய விரும்புகிறீர்கள்?","How would you like to explore?")}</h2><div class="entry-grid"><section class="card entry-card"><h3>${t("கல்லூரியிலிருந்து படிப்புக்கு","From a college to its programmes")}</h3><p>${t("கல்லூரியைத் தேடி, அதன் 2026 பட்டியலில் உள்ள படிப்புகளையும் விவரங்களையும் பாருங்கள்.","Find a college, then see its details and programmes in the 2026 listing.")}</p>${primary({view:"colleges"},t("கல்லூரியைத் தேடு","Find a college"))}</section><section class="card entry-card"><h3>${t("பெரிய துறையிலிருந்து படிப்புக்கு","From study areas to programmes")}</h3><p>${t("2026 பட்டியலிலுள்ள எல்லாப் படிப்புகளையும் பெயர் அல்லது குறியீட்டால் தேடலாம். துறை–படிப்பு இணைப்புகள் இன்னும் மதிப்பாய்வில் உள்ளன.","Browse every programme in the 2026 listing by exact name or code. Area-to-programme links are still under review.")}</p>${primary({view:"branches"},t("எல்லாப் படிப்புகளையும் பார்","Browse all programmes"))}</section></div>${beginnerGuides}<details class="card unsure"><summary>${t("இன்னும் உறுதியாகத் தெரியவில்லையா?","Still unsure? Explore without choosing")}</summary><p>${guidance(t("பொறியியல் வழிகாட்டலைத் தொடங்கு","Start with engineering basics"),false)} <a class="action" href="/beginner?lang=${lang}&amp;section=engineering">${t("பெரிய துறைகளைப் புரிந்துகொள்","Explore study areas")}</a></p></details><p class="supporting">${t("மதிப்பெண்கள் தேவையில்லை. தனிப்பட்ட விவரங்களும் தேவையில்லை.","No marks are required. No personal details are needed.")}</p>`;
  } else if(page==="families") {
  body=`<nav class="back-nav">${textLink({},t("ஆராயும் முகப்புக்குத் திரும்பு","Back to exploration"))}</nav><h1>${t("பெரிய துறையிலிருந்து தொடங்குங்கள்","Start with a study area")}</h1>${releasedFamilies.length?`<p>${t("கீழே ஒப்புதல் பெற்ற இணைப்புகள் மட்டுமே உள்ளன. எந்தப் படிப்பும் இந்தக் குழுவாக்கத்தால் மறைக்கப்படாது; எல்லாப் படிப்புகளையும் தனியாகப் பார்க்கலாம்.","Only approved links appear below. Grouping never removes a programme; the complete programme list remains available separately.")}</p><div class="entry-grid">${releasedFamilies.map(item=>`<section class="card entry-card"><h2>${esc(t(item.label.ta,item.label.en))}</h2><p>${item.mappings.length} ${t("ஒப்புதல் பெற்ற படிப்பு இணைப்புகள்","approved programme links")}</p>${link({view:"family",family:item.id},t("படிப்புகளைப் பார்","View programmes"),false)}</section>`).join("")}</div>`:`<div class="card" role="status"><p>${t("பெரிய துறை–படிப்பு இணைப்புகள் இன்னும் சரிபார்ப்பில் உள்ளன. இப்போது அதிகாரப்பூர்வப் பெயர் அல்லது குறியீட்டால் எல்லாப் படிப்புகளையும் பார்க்கலாம்.","Study-area-to-programme links are still in owner review. For now, browse every programme by its official name or code.")}</p></div>`}${link({view:"branches"},t("எல்லாப் படிப்புகளையும் பார்","Browse all programmes"),false)}`;
 } else if(page==="family") {
  const selectedFamily=releasedFamilies.find(item=>item.id===family);
  const codes=selectedFamily?[...new Set(selectedFamily.mappings.map(mapping=>mapping.programmeCode))]:[];
  body=selectedFamily?`<nav class="back-nav">${textLink({view:"families"},t("பெரிய துறைகளுக்குத் திரும்பு","Back to study areas"),false)}</nav><h1>${esc(t(selectedFamily.label.ta,selectedFamily.label.en))}</h1><p>${t("ஒப்புதல் பெற்ற இணைப்புகள் மட்டும். ஒவ்வொரு படிப்பின் விளக்கம், கல்லூரிகள் மற்றும் ஆதாரத்தைத் தொடர்ந்து பார்க்கலாம்.","Approved links only. Continue to each programme’s explanation, colleges and evidence.")}</p><div class="branch-list-container">${codes.map(code=>{const name=programmeLabels.find(([candidate])=>candidate===code)?.[1]??code;return formatBranchItem(code,name);}).join("")}</div>${link({view:"branches"},t("எல்லாப் படிப்புகளையும் பார்","Browse all programmes"),false)}`:`<div class="card" role="status"><p>${t("இந்தப் பெரிய துறைக்கான ஒப்புதல் பெற்ற இணைப்பு இல்லை.","No approved links are available for this study area.")}</p></div>${link({view:"branches"},t("எல்லாப் படிப்புகளையும் பார்","Browse all programmes"),false)}`;
 } else if(page==="branches") {
  const useGroups = !branchSearch && branchMatches.length > 20;
  let branchListingHtml = "";
  if (!branchMatches.length) {
   branchListingHtml = `<div class="card" role="status"><p>${t("இந்தத் தேடலுக்குப் பொருத்தம் இல்லை. வேறொரு பெயர் அல்லது குறியீட்டை முயற்சிக்கவும்.","No programme name matches this search. Try another name or code.")}</p>${link({view:"branches"},t("எல்லாப் பெயர்களையும் பார்","Show all names"),false)}</div>`;
  } else if (useGroups) {
   const explainedBranches = branchMatches.filter(([code]) => releasedProfileIds.has(code));
   const variantBranches = branchMatches.filter(([code, name]) => !releasedProfileIds.has(code) && /\(SS\)|\(TAMIL(?:\s+MEDIUM)?\)/i.test(name));
   const otherBranches = branchMatches.filter(([code, name]) => !releasedProfileIds.has(code) && !/\(SS\)|\(TAMIL(?:\s+MEDIUM)?\)/i.test(name));
   const sections: string[] = [];
   if (explainedBranches.length) {
    sections.push(`<details class="card branch-group" open><summary>${t(`விளக்கம் உள்ள பாடப்பிரிவுகள் (${explainedBranches.length})`,`Programmes with explanations (${explainedBranches.length})`)}</summary><p class="supporting">${t("இந்தப் பாடப்பிரிவுகளுக்கு எளிய தமிழ் மற்றும் ஆங்கில கல்வி விளக்கங்கள் தயாராக உள்ளன.","These programmes include reviewed beginner explanations in Tamil and English.")}</p><div class="branch-list-container">${explainedBranches.map(([code,name])=>formatBranchItem(code,name)).join("")}</div></details>`);
   }
   if (variantBranches.length) {
    sections.push(`<details class="card branch-group"><summary>${t(`சுயநிதிப் பிரிவு (SS) & தமிழ் வழிப் பிரிவுகள் (${variantBranches.length})`,`Self-Supporting (SS) & Tamil Medium variants (${variantBranches.length})`)}</summary><p class="supporting">${t("(SS) என்பது அரசு/உதவி பெறும்/பல்கலைக்கழக வளாகங்களில் சுயநிதி முறையில் நடத்தப்படும் பிரிவு. தமிழ் வழி (Tamil Medium) பிரிவுகளில் பாடங்கள் தமிழில் கற்பிக்கப்படுகின்றன. இவற்றின் தனி விளக்கங்கள் இன்னும் மதிப்பாய்வில் உள்ளன.","(SS) indicates a Self-Supporting fee-basis programme within a government, aided, or university campus. Tamil Medium indicates Tamil-language instruction. Separate explanations for these variants remain under review.")}</p><div class="branch-list-container">${variantBranches.map(([code,name])=>formatBranchItem(code,name)).join("")}</div></details>`);
   }
   if (otherBranches.length) {
    sections.push(`<details class="card branch-group"><summary>${t(`மற்ற 2026 பாடப்பிரிவுகள் — விளக்கம் மதிப்பாய்வில் உள்ளது (${otherBranches.length})`,`Other 2026 listed programmes — explanation under review (${otherBranches.length})`)}</summary><p class="supporting">${t("இவை 2026 TNEA மூலப் பட்டியலில் உள்ள அதிகாரப்பூர்வப் பெயர்கள். இவற்றின் விரிவான கல்வி விளக்கங்கள் இன்னும் மதிப்பாய்வில் உள்ளன; இவற்றை வழங்கும் கல்லூரிகளைப் பார்க்கலாம்.","Official names from the 2026 TNEA listing. Detailed educational explanations are still under review, and you can inspect which colleges list them.")}</p><div class="branch-list-container">${otherBranches.map(([code,name])=>formatBranchItem(code,name)).join("")}</div></details>`);
   }
   branchListingHtml = sections.join("");
  } else {
   branchListingHtml = `<div class="branch-list-container">${branchMatches.map(([code,name])=>formatBranchItem(code,name)).join("")}</div>`;
  }
  const branchBackNav = isColleges ? "" : `<nav class="back-nav">${textLink({},t("ஆராயும் முகப்புக்குத் திரும்பு","Back to exploration"))}</nav>`;
  body=`${branchBackNav}<h1>${t("படிப்புப் பெயரைத் தேடுங்கள்","Find a programme name")}</h1><p>${t("இவை 2026 மூலப் பட்டியலில் உள்ள பெயர்கள். பெயர் அல்லது குறியீட்டால் தேடலாம்; தெரியாவிட்டால் கீழே உள்ள குழுக்களைப் பாருங்கள். கல்வி விளக்கங்கள் இன்னும் மதிப்பாய்வில் உள்ளன.","These are names in the 2026 source listing. Search by name or code, or browse the grouped list below. Educational explanations are still under review.")}</p><form method="get" action="${route}" class="card branch-search">${hidden("lang",lang)}${hidden("view","branches")}<label for="branch-search">${t("பாடப்பிரிவு பெயர் அல்லது குறியீடு","Programme name or code")}</label><div class="search-row"><input id="branch-search" type="search" name="bq" aria-label="${t("பாடப்பிரிவு பெயர் அல்லது குறியீடு","Programme name or code")}" value="${esc(branchSearch)}" placeholder="${t("எ.கா. CSE, ECE, Mechanical, AI","e.g. CSE, ECE, Mechanical, AI")}"><button type="submit" aria-label="${t("பாடப்பிரிவைத் தேடு","Search programme")}">${t("தேடு","Search")}</button></div></form><p role="status">${branchMatches.length} ${t(branchMatches.length===1?"பொருந்தும் பாடப்பிரிவு":"பொருந்தும் பாடப்பிரிவுகள்",branchMatches.length===1?"matching programme":"matching programmes")}</p>${branchListingHtml}${branchSearch&&branchMatches.length?link({view:"branches"},t("தேடலை நீக்கு","Clear search"),false):""}${link({view:"colleges"},t("கல்லூரிகளைப் பார்","Browse colleges"),false)}`;
 } else if(page==="branch") {
  const rows=items.filter(i=>i.programme===branch), exemplar=rows[0];
  const associatedReleased=[...new Map(rows.filter(i=>i.profile).map(i=>[JSON.stringify(i.profile),i.profile])).values()];
  // Programme-code/profile identity is explicitly accepted by the Option A
  // profile decisions. This does not attach the profile to any college
  // offering; detail pages retain their independent L01-L09 association gate.
  const directlyApproved=associatedReleased.length || !usesApprovedDirectory ? [] : APPROVED_BRANCH_COPY.filter(profile=>profile.id===branch&&isReleasedBranchCopy(profile));
  const released=associatedReleased.length ? associatedReleased : directlyApproved;
  const p=released.length===1 ? released[0] : null;
  const collegeCount=new Set(rows.map(i=>i.college)).size;
  body=exemplar ? `<nav class="back-nav">${textLink({view:"branches"},t("படிப்புப் பெயர்களுக்குத் திரும்பு","Back to programme names"))}</nav><p class="eyebrow">${t("2026 மூலப் பட்டியலில் உள்ள பெயர் மற்றும் குறியீடு","Name and code in the 2026 source listing")}</p><h1>${esc(exemplar.programmeName)} (${esc(branch)})</h1><section class="card explanation"><h2>${t("இந்தப் படிப்பைப் புரிந்துகொள்ள","Understanding this programme")}</h2>${p ? `<p>${t("இது பொதுவான கல்வி விளக்கம்; தேர்ந்தெடுத்த கல்லூரியின் பாடத்திட்டத்தை உறுதிப்படுத்தாது.","This general educational explanation does not establish any selected college’s curriculum.")}</p>` + p.copy[lang].split("\n").map((line,n)=>`<h3>${esc([t("எளிய விளக்கம்","Simple explanation"),t("பாடங்கள்","Typical subjects"),t("செய்முறையும் பயன்பாடும்","Practical learning and applications"),t("கவனிக்க வேண்டியது","Important considerations"),t("அடுத்து என்ன பார்க்கலாம்?","What to explore next?")][n])}</h3><p>${esc(line).replaceAll("\u2028","</p><p>")}</p>`).join("")+`<details class="source-note"><summary>${t("பாடத்திட்ட ஆதாரம் & வரம்பு","Educational source & scope")}</summary><p class="supporting">${esc(p.evidence.scope)} · ${esc(p.evidence.locator)}</p><p><a href="${esc(p.evidence.url)}">${t("பாடத்திட்ட ஆதாரம்","Educational source")}</a></p></details>` : `<p>${t("இந்தப் பாடப்பிரிவின் கல்வி விளக்கம் இன்னும் மதிப்பாய்வில் உள்ளது. பெயரை வைத்து மட்டும் என்ன படிப்பீர்கள் என்று முடிவு செய்ய வேண்டாம்.","The educational explanation for this programme is still under review. Its name alone does not explain what you would study.")}</p>`}</section><section class="next-step"><h2>${t("இப்போது என்ன பார்க்கலாம்?","What can I explore now?")}</h2><p>${t("2026 பட்டியலில் இந்தப் படிப்பு எந்தக் கல்லூரிகளில் இடம்பெற்றது என்பதைப் பார்க்கலாம். தற்போதைய கிடைப்பையோ சேர்க்கையையோ இது உறுதிப்படுத்தாது.","You can see which colleges listed this programme in 2026. This does not confirm current availability or admission.")}</p>${primary({view:"colleges",branch},t(`${collegeCount} கல்லூரிகளைப் பார்`,`See ${collegeCount} listed colleges`))}</section>${evidence(exemplar,rows)}` : blank+link({view:"branches"},t("படிப்புப் பெயர்களுக்குத் திரும்பு","Back to programme names"),false);
 } else if(page==="colleges") {
  const selection=validPicks.length>=2 && validPicks.length<=3?link({view:"compare"},t("தேர்வுகளை ஒப்பிடு","Compare selected")):"";
  const selectedList=validPicks.length ? `<details class="selected-list"><summary>${t("தேர்வுகளைப் பார் / நீக்கு","Review or remove selections")}</summary><ul>${validPicks.map(key=>{const i=items.find(row=>row.key===key)!;return `<li>${esc(i.collegeName)} — ${esc(i.programmeName)} (${esc(i.programme)}) ${link({view:"colleges"},t("நீக்கு","Remove"),true,validPicks.filter(p=>p!==key))}</li>`;}).join("")}</ul>${link({view:"colleges"},t("ஒப்பீட்டுத் தேர்வுகளை மட்டும் நீக்கு","Clear comparison selections"),true,[])}</details>` : "";
  const paging=(n:number)=>link({view:"colleges",page:String(n)},n<pageNumber?t("முந்தைய பக்கம்","Previous page"):t("அடுத்த பக்கம்","Next page"));
  const isExplicitAll = params.get("all") === "1";
  const hasFilter = Boolean(search || district || type || college || branch || validPicks.length > 0 || params.has("page"));
  const hasSelection = hasFilter || isExplicitAll || !isColleges || !usesApprovedDirectory;
  const count = `${groups.length} ${t(groups.length===1?"கல்லூரி":"கல்லூரிகள்",groups.length===1?"college":"colleges")} · ${matching.length} ${t(matching.length===1?"பொருந்தும் படிப்பு":"பொருந்தும் படிப்புகள்",matching.length===1?"matching programme":"matching programmes")}`;
  const knownDistricts=groups.filter(group=>!!group[0].district).length, knownTypes=groups.filter(group=>!!group[0].type&&!!types[group[0].type!]).length;
  const coverage=groups.length?`<p class="supporting metadata-coverage">${isColleges ? t(`இந்த முடிவுகளில் மாவட்டம் ${knownDistricts}/${groups.length} கல்லூரிகளுக்கும், வகை ${knownTypes}/${groups.length} கல்லூரிகளுக்கும் காட்டப்படுகிறது. கிடைக்காத அல்லது உறுதிப்படுத்தப்படாத விவரங்கள் ஊகிக்கப்படாமல் விடப்பட்டுள்ளன.`,`In these results, district is shown for ${knownDistricts}/${groups.length} colleges and type for ${knownTypes}/${groups.length}. Unavailable or unverified details are omitted rather than inferred.`) : t(`இந்த முடிவுகளில் மாவட்டம் ${knownDistricts}/${groups.length} கல்லூரிகளுக்கும், வகை ${knownTypes}/${groups.length} கல்லூரிகளுக்கும் காட்டப்படுகிறது. கிடைக்காத அல்லது ஒப்புதல் பெறாத விவரங்கள் ஊகிக்கப்படாமல் விடப்பட்டுள்ளன.`,`In these results, district is shown for ${knownDistricts}/${groups.length} colleges and type for ${knownTypes}/${groups.length}. Unavailable or unapproved details are omitted rather than inferred.`)}</p>`:"";
  const resultsContent = groups.length
   ? `<div class="results">${visible.map(groupCard).join("")}</div><nav class="paging" aria-label="${t("முடிவுப் பக்கங்கள்","Result pages")}">${pageNumber>1?paging(pageNumber-1):""}${pageNumber<pageCount?paging(pageNumber+1):""}</nav>`
   : `<div class="card no-results-recovery" role="status"><h2>${t("பொருந்தும் கல்லூரிகள் எதுவும் இல்லை","No matching colleges found")}</h2><p>${isColleges ? t("இந்தத் தேடல் மற்றும் வடிகட்டிகளுக்குப் பொருந்தும் கல்லூரி பட்டியலில் இல்லை. தேடலை மாற்றுங்கள் அல்லது வடிகட்டிகளை நீக்குங்கள்.","No colleges match your search and filters. Change the search or clear filters.") : t("இந்தத் தேடல் மற்றும் வடிகட்டிகளுக்குப் பொருந்தும் கல்லூரி இந்த ஆய்வில் இல்லை. தேடலை மாற்றுங்கள் அல்லது வடிகட்டிகளை நீக்குங்கள்.","No colleges in this review set match your search and filters. Change the search or clear filters.")}</p><p class="supporting">${t("உங்கள் தேடல் சொல் (Search), மாவட்டம் (District), கல்லூரி வகை (Category) அல்லது குறிப்பிட்ட கல்லூரித் தேர்வை மாற்றி முயற்சிக்கலாம்; உலாவியின் 'Back' பொத்தானை அழுத்தாமல் கீழே உள்ள மீட்டமைப்புப் பொத்தானைப் பயன்படுத்தலாம்.","You can adjust your search keyword, district, college category, or specific college filter above, or use the reset button below without pressing browser Back.")}</p>${clearFilters()}</div>`;
  const emptySearchSubmitted = params.get("searched") === "1" && !hasFilter && !isExplicitAll;
  const searchPrompt = emptySearchSubmitted
   ? `<div class="card search-prompt-light" role="region" aria-label="${t("கல்லூரிகளைத் தேடுங்கள்","Search for colleges")}"><p class="supporting search-prompt-text" style="margin:0;font-size:0.92rem;"><span aria-hidden="true">🔍</span> <strong>${t("தேடல் விவரங்கள் எதுவும் உள்ளிடப்படவில்லை: ","No search criteria entered: ")}</strong>${t("கல்லூரி பெயர், குறியீடு அல்லது மாவட்டத்தைத் தேர்வு செய்து தேடவும்.","Please enter a college name, code, or select a category or district above.")}</p></div>`
   : "";
  const resultCountHeader = hasSelection
    ? `<p class="result-count" role="status">${count}${groups.length?` · ${t("பக்கம்","Page")} ${pageNumber} / ${pageCount}`:""}</p>`
    : `<p class="result-count" role="status">${totalCollegesCount} ${t("கல்லூரிகள்","colleges")} · ${items.length} ${t("படிப்புகள் பட்டியலில் உள்ளன","programmes in listing")}</p>`;
  body=`<h1>${t("கல்லூரிகளும் படிப்புகளும்","Colleges and programmes")}</h1><p class="supporting search-subtitle"><strong>${t("மதிப்பெண்கள் இன்றி கல்லூரிகளை ஆராயலாம்:","Explore colleges without cutoff marks:")}</strong> ${t("2026 TNEA மூலப் பட்டியலில் உள்ள கல்லூரிகளையும் படிப்புகளையும் பெயர், குறியீடு, மாவட்டம் அல்லது வகையால் தேடலாம் (தற்போதைய இடங்கள் அல்லது சேர்க்கை உறுதியல்ல).","Search 2026 listed colleges and programmes by name, code, district or type (current seat availability or admission is not confirmed).")} ${t("கடந்த ஆண்டு கட்-ஆஃப் ஒப்பீட்டுடன் திட்டமிட,","To compare with past cutoffs,")} <a class="text-link" href="/m5-guidance?lang=${lang}">${t("விருப்பப் பட்டியல் பக்கம் →","Choice Planner →")}</a></p>${branch?`<p class="active-branch">${t("தேர்ந்தெடுத்த பாடப்பிரிவு","Selected programme")}: <strong>${esc(programmeLabels.find(([code])=>code===branch)?.[1] ?? branch)} (${esc(branch)})</strong> ${link({view:"branches"},t("மாற்று","Change"),false)}</p>`:""}${resultCountHeader}${filterForm()}${hasSelection ? `${district||type ? `<p class="supporting">${t("தெரியாத மாவட்டம் / வகை மதிப்புகள் இந்த வடிகட்டியில் வராது.","Unknown district / type values are excluded by these filters.")}</p>` : ""}${coverage}${validPicks.length?`<div class="selection-bar"><strong>${validPicks.length} ${t(validPicks.length===1?"ஒப்பிடத் தேர்ந்தெடுத்தது":"ஒப்பிடத் தேர்ந்தெடுத்தவை","selected to compare")}</strong> ${selection}<span class="supporting">${t("இந்தப் பக்கத்தில் மட்டும்; சேமிக்கப்படாது.","Only in this visit; not saved.")}</span>${selectedList}</div>`:""}${resultsContent}` : searchPrompt}`;
 } else if(page==="college") {
  const rows=items.filter(i=>i.college===college), first=rows[0];
  const selected=branch?rows.find(i=>i.programme===branch):undefined;
  const doteCat = first ? getDoteCategoryForItem(first) : null;
  const hasVerifiedCat = first && (!!COHORT_300_METADATA[first.college] || !!first.type);
  const doteBadge = hasVerifiedCat && doteCat ? `<div class="card-badge-row"><span class="badge ${doteCat.badgeClass}">${esc(t(doteCat.nameTa, doteCat.nameEn))}</span></div>` : "";
  const compactCourseRow = (i:(typeof items)[number]) => `<a class="compact-course-row" href="${esc(query({view:"detail",college:i.college,programme:i.programme}))}"><div class="compact-course-left"><strong class="compact-course-name">${esc(i.programmeName)} (${esc(i.programme)})</strong></div><span class="compact-course-arrow">→</span></a>`;
  const selectedSection = selected ? `<section class="compact-courses-section" aria-labelledby="matching-programme"><h2 id="matching-programme">${t("நீங்கள் தேர்ந்தெடுத்த பாடப்பிரிவு","Your matching programme")}</h2><div class="compact-course-list">${compactCourseRow(selected)}</div></section>` : "";
  const otherCourses = selected ? rows.filter(i=>i!==selected) : rows;
  const otherSection = `<section class="compact-courses-section" aria-labelledby="programme-list"><h2 id="programme-list">${selected ? t("மற்ற பட்டியலிடப்பட்ட படிப்புகள்","Other listed programmes") : t("பட்டியலிடப்பட்ட படிப்புகள்","Listed programmes")} (${otherCourses.length})</h2><div class="compact-course-list">${otherCourses.map(compactCourseRow).join("")}</div></section>`;
  body=first ? `<header class="card identity"><p class="eyebrow">${t("கல்லூரி விவரம்","College details")}</p><h1>${esc(first.collegeName)}</h1>${doteBadge}${detailFacts(first)}</header>${datedNotice(first)}${first.metadata?.length?`<p><a class="text-link" href="#college-metadata">${t("முகவரி மற்றும் கூடுதல் கல்லூரி விவரங்கள்","Address and other college details")}</a></p>`:""}${selectedSection}${otherSection}${metadataPanel(first)}${evidence(first,rows)}<nav class="back-nav">${textLink({view:"colleges"},t("முடிவுகளுக்குத் திரும்பு","Back to results"))}</nav>` : blank+link({view:"colleges"},t("முடிவுகளுக்குத் திரும்பு","Back to results"));
 } else if(page==="detail") {
  const item=items.find(i=>i.college===college&&i.programme===programme);
  body=item ? `<nav class="back-nav">${textLink({view:"college",college:item.college},t("கல்லூரிக்குத் திரும்பு","Back to college"))}</nav><header class="card identity"><p class="eyebrow">${t("கல்லூரி + படிப்பு","College + programme")}</p><h1>${esc(item.programmeName)}</h1><p class="programme-code">${t("பாடப்பிரிவுக் குறியீடு","Programme code")}: <strong>${esc(item.programme)}</strong></p><p class="programme-college">${esc(item.collegeName)}</p></header>${datedNotice(item)}<section class="card explanation next-step"><h2>${t("இந்தப் படிப்பைப் பற்றி","About this programme")}</h2>${item.profile ? `<p>${t("இந்தப் பாடப்பிரிவின் பொதுவான கல்வி விளக்கத்தைப் படிக்கலாம். அது இந்தக் கல்லூரியின் பாடத்திட்டத்தை உறுதிப்படுத்தாது.","Read the general educational explanation for this branch. It does not establish this college’s curriculum.")}</p>` : `<p>${t("இந்தப் பாடப்பிரிவின் கல்வி விளக்கம் இன்னும் மதிப்பாய்வில் உள்ளது. இங்குள்ள பட்டியல் பெயர் இந்தக் கல்லூரியின் பாடத்திட்டத்தை விளக்காது.","The educational explanation for this programme is still under review. This listing name does not describe this college’s curriculum.")}</p>`}${item.profile ? primary({view:"branch",branch:item.programme},t("பாடப்பிரிவு விளக்கம்","Programme explanation")) : primary({view:"colleges",branch:item.programme,page:"1"},t("இந்தப் படிப்பு பட்டியலிடப்பட்ட கல்லூரிகளைப் பார்","See colleges listing this programme"))}<p>${item.profile?textLink({view:"colleges",branch:item.programme,page:"1"},t("இந்தப் படிப்பு பட்டியலிடப்பட்ட கல்லூரிகளைப் பார்","See colleges listing this programme")):textLink({view:"college",college:item.college},t("இந்தக் கல்லூரியின் மற்ற படிப்புகளைப் பார்","See this college’s other programmes"))}</p></section><section class="card college-glance"><h2>${t("கல்லூரி ஒரு பார்வை","College at a glance")}</h2>${detailFacts(item)}</section><section class="card"><h2>${t("சரிபார்க்க வேண்டியவை","Things worth checking")}</h2><ul class="check-prompts"><li>${t("இந்தக் கல்லூரியின் தற்போதைய பாடத்திட்டத்தில் என்னென்ன பாடங்கள் உள்ளன?","What topics are in this college’s current curriculum?")}</li><li>${t("தற்போதைய கலந்தாய்வு அறிவிப்பில் இந்தப் படிப்பு இடம்பெற்றுள்ளதா?","Is this programme listed in the current counselling notice?")}</li></ul><p class="supporting">${t("அதிகாரப்பூர்வ ஆவணங்களிலும் கல்லூரியிலும் சரிபார்க்கவும்.","Check with official sources and the college.")}</p></section>${evidence(item)}<nav class="back-nav" aria-label="${t("திரும்பிச் செல்ல","Back navigation")}">${textLink({view:"college",college:item.college},t("கல்லூரிக்குத் திரும்பு","Back to college"))}${textLink({view:"colleges"},t("முடிவுகளுக்குத் திரும்பு","Back to results"))}</nav>` : blank+link({view:"colleges"},t("முடிவுகளுக்குத் திரும்பு","Back to results"));
 } else if(page==="compare") {
  const chosen=uniquePicks.map(k=>items.find(i=>i.key===k));
  const compareCard=(i:(typeof items)[number])=>`<article class="compare-field"><h2>${esc(i.collegeName)}</h2><p class="compare-programme">${esc(i.programmeName)} (${esc(i.programme)})</p><dl><div><dt>${t("கல்லூரிக் குறியீடு","College code")}</dt><dd>${esc(i.college)}</dd></div><div><dt>${t("மாவட்டம்","District")}</dt><dd>${esc(i.district??unknown)}</dd></div><div><dt>${t("கல்லூரி வகை","Institution type")}</dt><dd>${esc(typeName(i.type))}</dd></div><div><dt>${t("மூல ஆண்டு","Source year")}</dt><dd>${esc(String(i.source.year))}</dd></div></dl>${textLink({view:"detail",college:i.college,programme:i.programme},t("படிப்பு விவரத்தைப் பார்","View programme details"))}<details class="compare-more"><summary>${t("மேலும் விவரங்களும் ஆதாரமும்","More details and evidence")}</summary><p>${esc(sourceText(i))}</p><p>${esc(limit)}</p>${evidence(i)}</details></article>`;
  body=uniquePicks.length>=2 && uniquePicks.length<=3 && requestedPicks.length===uniquePicks.length && chosen.every(Boolean) ? `<h1>${t("தேர்ந்தெடுத்தவற்றை ஒப்பிடுங்கள்","Compare your selected options")}</h1><p>${t("இது தரவரிசை அல்ல; தேர்வுகள் சேமிக்கப்படாது.","This is not a ranking; choices are not saved.")} ${esc(sourceText(chosen[0]!))} ${esc(limit)}</p><div class="compare-grid" data-count="${chosen.length}">${chosen.map(i=>compareCard(i!)).join("")}</div><section class="card reflection"><h2>${t("அடுத்து என்ன பார்க்கலாம்?","What should you check next?")}</h2><p>${t("எந்தப் படிப்பைப் பற்றி மேலும் அறிய விரும்புகிறீர்கள்? கல்லூரியின் தற்போதைய பாடத்திட்டத்தையும் கலந்தாய்வு அறிவிப்பையும் சரிபார்க்கவும்.","Which programme would you like to understand better? Check the college’s current curriculum and counselling notice.")}</p></section>` : `<h1>${t("ஒப்பிடத் தேர்ந்தெடுங்கள்","Choose options to compare")}</h1><p role="status">${t("இரண்டு அல்லது மூன்று வேறுபட்ட கல்லூரி–படிப்பு பதிவுகளைத் தேர்ந்தெடுத்து ஒப்பிடவும்.","Choose two or three distinct college–programme records to compare.")}</p>`;
  body+=link({view:"colleges"},t("முடிவுகளுக்குத் திரும்பு","Back to results"));
 } else body=blank+link({},t("முகப்பு","Home"),false);
 if(page==="home" && releasedFamilies.length) body=body.replace("<details class=\"card unsure\">",`<section class="card"><h2>${t("ஒப்புதல் பெற்ற பெரிய துறை இணைப்புகள்","Approved study-area links")}</h2><p>${t("ஒப்புதல் பெற்ற படிப்புகளுக்கு மட்டும் பெரிய துறையிலிருந்து விளக்கம் மற்றும் கல்லூரிகளுக்குச் செல்லலாம்.","For approved programmes only, continue from a study area to its explanation and listed colleges.")}</p>${link({view:"families"},t("பெரிய துறைகளிலிருந்து ஆராய்","Explore by study area"),false)}</section><details class="card unsure">`);
 body=body.replace("இந்த ஆய்வில் கல்வி விளக்கங்கள் இன்னும் ஒப்புதல் பெறவில்லை; பெயரை மட்டும் வைத்து ஒரு படிப்பைத் தீர்மானிக்க வேண்டாம்.","சில கல்வி விளக்கங்கள் ஒப்புதல் பெற்றுள்ளன; மற்றவை இன்னும் மதிப்பாய்வில் உள்ளன. விளக்கம் இல்லாத பெயரை மட்டும் வைத்து முடிவு செய்ய வேண்டாம்.")
  .replace("Educational explanations are still awaiting approval, so a name alone is not enough to decide on a programme.","Some educational explanations are approved; others remain under review. Do not decide from a listing name alone when its explanation is unavailable.")
  .replace("கல்வி விளக்கங்கள் இன்னும் மதிப்பாய்வில் உள்ளன.","சில கல்வி விளக்கங்கள் ஒப்புதல் பெற்றுள்ளன; மற்றவை மதிப்பாய்வில் உள்ளன.")
  .replace("Educational explanations are still under review.","Some educational explanations are approved; others remain under review.");
 const crumbLink=(values:Record<string,string>,label:string,keepContext=true)=>`<a href="${esc(query(values,keepContext))}">${esc(label)}</a>`;
 const parent=page==="family" ? crumbLink({view:"families"},t("பெரிய துறைகள்","Study areas"),false)
  : page==="branch" ? crumbLink({view:"branches"},t("எல்லாப் படிப்புகள்","All programmes"),false)
  : page==="colleges" && branch && items.some(item=>item.programme===branch) ? crumbLink({view:"branch",branch},t("தேர்ந்தெடுத்த படிப்பு","Selected programme"))
  : page==="college" || page==="compare" ? crumbLink({view:"colleges"},t("கல்லூரி முடிவுகள்","College results"))
  : page==="detail" ? crumbLink({view:"college",college},t("கல்லூரி விவரம்","College details")) : "";
 const current:Record<string,readonly [string,string]>={families:["பெரிய துறைகள்","Study areas"],family:["துறைப் படிப்புகள்","Area programmes"],branches:["எல்லாப் படிப்புகள்","All programmes"],branch:["படிப்பு விவரம்","Programme details"],colleges:["கல்லூரிகள்","Colleges"],college:["கல்லூரி விவரம்","College details"],detail:["படிப்பு விவரம்","Programme details"],compare:["ஒப்பீடு","Comparison"]};
 const breadcrumbs=page==="home" ? "" : `<nav class="breadcrumbs" aria-label="${t("நீங்கள் இருக்கும் வழி","Breadcrumb")}"><a href="/?lang=${lang}">${t("முகப்பு","Home")}</a><span aria-hidden="true">/</span>${crumbLink({view:"home"},t("ஆராய்வு","Explore"),false)}${parent?`<span aria-hidden="true">/</span>${parent}`:""}<span aria-hidden="true">/</span><span aria-current="page">${t(...(current[page]??["ஆராய்வு","Explore"]))}</span></nav>`;
 const swapped=new URLSearchParams({lang:en?"ta":"en",view:page});
 const validBranch=programmeLabels.some(([code])=>code===branch), validCollege=items.some(item=>item.college===college), validProgramme=items.some(item=>item.programme===programme&&(!college||item.college===college));
 if(releasedFamilies.some(item=>item.id===family))swapped.set("family",family);if(validBranch)swapped.set("branch",branch);if(validCollege)swapped.set("college",college);if(validProgramme)swapped.set("programme",programme);
 if(search)swapped.set("q",search);if(branchSearch)swapped.set("bq",branchSearch);if(district&&districtLabels.some(d=>d.toLowerCase()===district.trim().toLowerCase()))swapped.set("district",district);if(typeLabels.includes(type))swapped.set("type",type);
 if(params.has("page")&&Number.isInteger(requestedPage)&&requestedPage>0)swapped.set("page",String(requestedPage));for(const pick of validPicks)swapped.append("pick",pick);
 const notice=input.classification==="TEST_FIXTURE" ? t("செயற்கைச் சோதனை எடுத்துக்காட்டு.","Synthetic test example.") : isColleges ? t("2026 TNEA அதிகாரப்பூர்வ மூலப் பட்டியல் அடிப்படையில் சரிபார்க்கப்பட்டது. தற்போதைய காலி இடங்கள் (Vacancies) கலந்தாய்வின் போது அதிகாரப்பூர்வமாக வெளியிடப்படும்.","Verified against official 2026 TNEA listings. Actual vacancies will be officially published during counselling.") : t("உள்நிலை உரிமையாளர் ஆய்வு மட்டும். மாணவர் வெளியீடு அல்ல.","Internal owner review only. Not a student release.");
 const pageTitle=isColleges ? t("கல்லூரி மற்றும் பாடப்பிரிவு பட்டியல்","Colleges and Programmes Directory") : t("ஆய்வு","Pilot review");
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${GOOGLE_FONTS_HTML}<title>${pageTitle}</title><style>${SITE_SHELL_CSS}*{box-sizing:border-box}body{font:16px/1.65 ${SHARED_FONT_FAMILY};color:#172033;background:#f7f8fa;margin:0}main{max-width:1120px;margin:auto;padding:20px;overflow-wrap:anywhere}main>h1,main>p,main>.start-guidance,main>.unsure,main>.source-notice,main>.back-nav,main>.identity,main>.explanation,main>.college-glance,main>.reflection{max-width:76ch}.card,.compare-field{background:white;border:1px solid #d8dde6;border-radius:12px;margin:1rem 0;padding:1rem}h1{font-size:1.5rem}h2{font-size:1.15rem}h3{font-size:1.05rem}.action,button{display:inline-block;padding:.7rem;border:1px solid #174ea6;border-radius:8px;background:#fff;color:#174ea6;margin:.3rem .3rem .3rem 0;text-decoration:none}label{display:block;margin:.7rem 0}input,select{max-width:100%;font:inherit;padding:.4rem}input[type=checkbox]{width:1.2rem;height:1.2rem}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible{outline:3px solid #174ea6;outline-offset:3px}.notice{background:#fff6e7;padding:1rem}.scope-banner{border-left:4px solid #174ea6;background:#f4f8ff}.scope-banner p{margin:0;font-size:.94rem}.beginner-guide summary,.branch-group summary,.source-note summary{min-height:44px;padding:.35rem 0;font-weight:700;cursor:pointer}.guide-list{padding-left:1.35rem;margin:.5rem 0}.guide-list li{margin:.45rem 0}.branch-tag{display:inline-block;font-size:.78rem;padding:2px 7px;border-radius:999px;background:#edf3fa;color:#174ea6;border:1px solid #c9d9ee;margin-left:.3rem;vertical-align:middle}.branch-tag-explained{background:#f0f6ec;color:#27532e;border-color:#c6dfc0}.typo-hint{font-size:.86rem;display:inline-block;margin-left:.3rem}.source-note{margin-top:1rem;padding-top:.6rem;border-top:1px solid #e4e8f0}.filter-note{font-size:.9rem;margin:.35rem 0 .6rem}.programmes{padding-left:1.4rem}.programmes li{padding:.6rem 0;border-bottom:1px solid #d8dde6}.compare-field h2{margin:0}.compare-field ol{margin:.4rem 0}.choice{margin:.7rem 0}summary{cursor:pointer}.identity h1{margin:.3rem 0 1rem;line-height:1.45}.eyebrow{color:#4a5870;font-size:.9rem;margin:0}.fact-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin:1.25rem 0 0;padding-top:1rem;border-top:1px solid #d8dde6}.fact-grid dt{font-size:.9rem;color:#4a5870}.fact-grid dd{margin:.25rem 0 0;font-weight:600}.programme-code{margin:.7rem 0}.source-notice{padding:.8rem 1rem;border-left:3px solid #597495;background:#edf3fa}.programme-cards{list-style:none;padding:0}.programme-cards h3{margin:0;line-height:1.6}.text-link{display:inline-block;min-height:44px;padding:.5rem 0;color:#174ea6;text-underline-offset:3px}.back-nav{display:flex;flex-wrap:wrap;gap:.3rem 1.25rem}.breadcrumbs{display:flex;flex-wrap:wrap;align-items:center;gap:.2rem .5rem;margin:.35rem 0 1rem;font-size:.9rem;color:#4a5870}.breadcrumbs a{display:inline-flex;align-items:center;min-height:44px}.primary{background:#174ea6;color:#fff;font-weight:600;text-align:center}.next-step{margin:1.5rem 0}.supporting{color:#4a5870}.check-prompts{padding-left:1.4rem}.check-prompts li{margin:.8rem 0}.evidence summary{min-height:44px;padding:.35rem 0}html[lang=ta] body{line-height:1.85}html[lang=ta] h1{line-height:1.6}@media(max-width:480px){.fact-grid{grid-template-columns:1fr;gap:.8rem}.primary{display:block;width:100%;margin:.5rem 0}.identity h1{font-size:1.35rem}.back-nav{flex-direction:column;align-items:flex-start}main{overflow-wrap:break-word}}.college-metadata dt{color:#4a5870;font-size:.9rem}.college-metadata dd{margin:.2rem 0 1rem;overflow-wrap:anywhere}.college-metadata summary{min-height:44px}.journey-return{margin-top:2rem;padding-top:1rem;border-top:1px solid #d8dde6}</style><style>.filters{padding:.8rem 1rem}.filters label,.branch-search label{font-weight:600;margin:.2rem 0 .35rem}.search-row{display:flex;gap:.5rem;align-items:stretch}.search-row input{flex:1;min-width:0}.search-row button{margin:0;white-space:nowrap}.filters input,.filters select,.branch-search input,.filters button,.branch-search button{min-height:44px}.more-filters{margin-top:.6rem}.more-filters summary,.selected-list summary,.result-card summary{min-height:44px;padding:.4rem 0;cursor:pointer}.filter-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:.5rem 0}.filter-grid select{width:100%}.filter-full{grid-column:1 / -1}.filter-actions{display:flex;align-items:center;gap:.75rem;margin-top:.85rem;flex-wrap:wrap}.filter-actions button{margin:0;min-height:44px;padding:.6rem 1.25rem;font-weight:700;cursor:pointer;background:#174ea6;color:#fff}.filter-actions a.action{margin:0}.card-badge-row{margin:4px 0 8px}.badge{display:inline-flex;align-items:center;font-size:.78rem;font-weight:700;padding:3px 8px;border-radius:6px;letter-spacing:.02em}.type-gov{background:#ecfdf5;color:#047857;border:1px solid #a7f3d0}.type-aided{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe}.type-univ{background:#faf5ff;color:#6d28d9;border:1px solid #ddd6fe}.type-annamalai{background:#fdf4ff;color:#86198f;border:1px solid #f0abfc}.type-constituent{background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4}.type-sfc{background:#f8fafc;color:#475569;border:1px solid #cbd5e1}.result-count{font-weight:700;margin:.5rem 0}.selection-bar{background:#edf3fa;border-radius:10px;padding:.6rem .8rem;margin:.6rem 0}.selection-bar .action{margin-left:.6rem}.selection-bar .supporting{display:block;font-size:.9rem}.selected-list ul{padding-left:1.2rem}.result-card{background:#ffffff;border:1.5px solid #e2e8f0;border-radius:14px;padding:1.15rem 1.25rem;margin:.75rem 0;box-shadow:0 1px 3px rgba(15,23,42,.05);transition:all .2s ease-in-out;display:flex;flex-direction:column;gap:.45rem}.result-card:hover{border-color:#0f766e;box-shadow:0 8px 20px -4px rgba(15,23,42,.1);transform:translateY(-2px)}.result-card-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem;flex-wrap:wrap;margin-bottom:2px}.result-card-chips{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}.meta-chip{display:inline-flex;align-items:center;gap:4px;font-size:.78rem;font-weight:600;padding:2px 8px;border-radius:6px;line-height:1.4}.chip-code{background:#f1f5f9;color:#334155;border:1px solid #e2e8f0}.chip-code strong{color:#0f172a;font-weight:750}.chip-district{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}.result-card-title{font-size:1.08rem;font-weight:750;line-height:1.45;margin:.25rem 0 .2rem}.offerings-count-pill{font-size:.78rem;font-weight:600;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;padding:2px 8px;border-radius:9999px;display:inline-block}.prompt-icon{font-size:2rem;margin-bottom:.35rem}.result-card h2{margin:.1rem 0}.result-card p{margin:.4rem 0}.result-card .action{margin:.35rem .35rem .35rem 0}.result-card ul,.branch-list{padding-left:1.35rem}.result-card li{padding:.3rem 0}.active-branch{background:#edf3fa;padding:.6rem .8rem;border-radius:10px}.active-branch .action{display:inline-flex;align-items:center;min-height:44px;padding:.3rem .6rem;margin:0}.paging{display:flex;flex-wrap:wrap;gap:.5rem}.branch-list li{margin:.3rem 0}.branch-list .action{margin:.1rem 0}.notice{font-size:.92rem;margin:.4rem 0 1rem;padding:.65rem .8rem}.source-notice{margin:.7rem 0}.filters>a.action{font-size:.92rem}@media(max-width:480px){.filter-grid{grid-template-columns:1fr;gap:.4rem}.search-row input{width:100%}.search-row button{padding:.55rem}.filters{margin:.65rem 0}.result-card{margin:.5rem 0}.result-card .action{display:block;text-align:center}.selection-bar .action{display:block;margin:.35rem 0}.active-branch .action{display:inline-flex}.active-branch{font-size:.9rem;line-height:1.5}.result-count{font-size:.95rem}main{padding:12px}.card{padding:.8rem}}
.filter-form-light{background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:1.15rem 1.25rem;box-shadow:0 1px 3px rgba(15,23,42,.04)}
.filter-label{font-size:.88rem;font-weight:600;color:#334155;margin-bottom:4px;display:block}
.light-select{background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;font-size:.9rem;padding:.5rem .7rem;color:#1e293b;transition:border-color .15s ease}
.light-select:focus{border-color:#2563eb;outline:none}
.btn-filter-apply{background:#1e40af;color:#ffffff;border:none;border-radius:8px;padding:.55rem 1.25rem;font-weight:600;font-size:.92rem;cursor:pointer;transition:background-color .15s ease}
.btn-filter-apply:hover{background:#1d4ed8}
.search-prompt-light{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:.9rem 1.15rem;margin:.75rem 0}
.search-prompt-text{color:#334155;line-height:1.55}
.search-subtitle{margin:0 0 .75rem;font-size:.92rem;color:#475569;line-height:1.55}
.browse-all-link{margin-left:.35rem;white-space:nowrap}
</style><style>.entry-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.entry-card{margin:.4rem 0;display:flex;flex-direction:column}.entry-card h3{margin:.1rem 0}.entry-card p{margin:.35rem 0 auto}.entry-card .action{align-self:flex-start}.start-guidance{margin:1rem 0 1.5rem}.unsure summary{min-height:44px;padding:.4rem 0;font-weight:700}.unsure p{margin:.65rem 0}.compare-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;align-items:start}.compare-field{margin:.4rem 0;min-width:0}.compare-field h2{line-height:1.4;overflow-wrap:anywhere}.compare-programme{font-weight:700}.compare-field dl{margin:.5rem 0;border-top:1px solid #d8dde6}.compare-field dl div{padding:.55rem 0;border-bottom:1px solid #d8dde6}.compare-field dt{font-size:.9rem;color:#4a5870}.compare-field dd{margin:.1rem 0 0}.compare-field .evidence{margin:.5rem 0;padding:.5rem}.programme-college{font-weight:600;margin:.7rem 0}.college-glance h2{margin-top:0}.evidence a{display:inline-flex;align-items:center;min-height:44px}.reflection h2{margin-top:0}.next-step .primary{margin-bottom:.2rem}.explanation h2{margin:.1rem 0 .4rem}.explanation p{margin:.4rem 0}.explanation.next-step{margin:.75rem 0}@media(max-width:480px){.source-notice{font-size:.9rem;line-height:1.55;padding:.5rem .7rem}}@media(max-width:600px){.entry-grid,.compare-grid{grid-template-columns:1fr}.entry-card{margin:.2rem 0}.entry-card .action{align-self:stretch;text-align:center}.start-guidance .primary{display:block;width:100%}.compare-field{margin:.2rem 0}}@media(min-width:768px){.results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.result-card{margin:0}.filter-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.filters{max-width:none}.compare-grid{gap:1rem}}@media(min-width:1080px){.results,.compare-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.filter-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:480px){main{padding:16px}}</style><style>.compact-courses-section{margin:1.25rem 0}.compact-courses-section h2{font-size:1.15rem;margin:0 0 .75rem;color:#172033}.compact-course-list{display:flex;flex-direction:column;gap:.5rem}.compact-course-row{display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;background:#ffffff;border:1px solid #d8dde6;border-radius:8px;text-decoration:none;color:#172033;transition:border-color .15s ease,background-color .15s ease;min-height:48px}.compact-course-row:hover{border-color:#0f766e;background:#f0fdfa}.compact-course-left{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap}.compact-course-name{font-size:.95rem;font-weight:600;color:#134e4a}.compact-course-arrow{font-size:1.1rem;font-weight:700;color:#0f766e;margin-left:.5rem}.branch-list-container{display:flex;flex-direction:column;gap:.5rem;margin:.75rem 0}.branch-card-row{display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:#ffffff;border:1px solid #d8dde6;border-radius:8px;text-decoration:none;color:#172033;transition:border-color .15s ease,background-color .15s ease;min-height:52px}.branch-card-row:hover{border-color:#0f766e;background:#f0fdfa}.branch-card-icon{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;background:#f0fdfa;color:#0f766e;flex-shrink:0}.branch-card-content{flex:1;min-width:0}.branch-card-top{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.branch-card-name{font-size:.95rem;font-weight:600;color:#134e4a}.branch-code-pill{font-size:.75rem;font-weight:700;padding:2px 7px;border-radius:6px;background:#e2e8f0;color:#334155;letter-spacing:.02em}.branch-card-tags{margin-top:.25rem;display:flex;flex-wrap:wrap;gap:.3rem}.branch-card-arrow{font-size:1.1rem;font-weight:700;color:#0f766e;margin-left:.5rem}.result-card-meta{font-size:.88rem;color:#475569;margin:.35rem 0 .6rem}.result-actions{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-top:.6rem}.college-title-link{color:#0f4c81;text-decoration:underline;text-decoration-color:#0d9488;text-underline-offset:4px;font-weight:700;display:inline-block;transition:color .15s ease,text-decoration-color .15s ease}.college-title-link:hover,.college-title-link:focus{color:#0f766e;text-decoration-color:#0f766e}.search-prompt-card{padding:1.5rem;text-align:center;background:#ffffff;border:1px solid #d8dde6;border-radius:12px;margin:1.25rem 0}.search-prompt-card h3{margin:0 0 .5rem;color:#172033;font-size:1.15rem}.search-prompt-card p{margin:0 0 1rem;color:#475569}.search-prompt-card .prompt-actions{display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap}.card-accent-teal{border-left:4px solid #0f766e!important}.card-accent-blue{border-left:4px solid #2563eb!important}.card-accent-slate{border-left:4px solid #64748b!important}.result-card{background:#ffffff;border:1.5px solid #e2e8f0;border-radius:14px;padding:1.15rem 1.25rem;margin:.85rem 0;box-shadow:0 1px 3px rgba(0,0,0,.04);transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}.result-card:hover{transform:translateY(-2px);box-shadow:0 4px 14px rgba(0,0,0,.07)}.result-card-top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.4rem;margin-bottom:.55rem}.result-card-chips{display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}.meta-chip{display:inline-flex;align-items:center;gap:.35rem;font-size:.8rem;padding:3px 9px;border-radius:6px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155}.chip-code{font-weight:700;color:#0f766e;background:#f0fdfa;border-color:#ccfbf1}.chip-district{color:#475569}.result-card-title{font-size:1.1rem;margin:.35rem 0 .65rem;line-height:1.45}.college-title-link{color:#0f2c59;text-decoration:none;font-weight:750;transition:color .15s ease}.college-title-link:hover,.college-title-link:focus{color:#0f766e;text-decoration:underline}.result-card-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-top:.6rem;padding-top:.6rem;border-top:1px solid #f1f5f9}.offerings-count-pill{display:inline-flex;align-items:center;gap:.35rem;font-size:.82rem;font-weight:600;color:#475569;background:#f1f5f9;padding:3px 9px;border-radius:9999px}.view-programmes-link{font-size:.85rem;font-weight:700;color:#0f766e;text-decoration:none}.view-programmes-link:hover{text-decoration:underline}.journey-return{margin-top:2.5rem;padding-top:1.25rem;border-top:1px solid #e2e8f0;text-align:center}.journey-return-link{display:inline-flex;align-items:center;gap:.4rem;font-size:.88rem;font-weight:600;color:#64748b;text-decoration:none;padding:.4rem .9rem;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;transition:all .15s ease}.journey-return-link:hover{color:#0f766e;background:#f0fdfa;border-color:#99f6e4}@media(max-width:767px){.breadcrumbs,.notice{display:none !important}}</style></head><body>${renderSiteHeader(lang, isColleges ? "colleges" : "review", en ? `<a lang="ta" href="${route}?${esc(swapped.toString())}">தமிழ்</a><span lang="en" aria-current="page"><span class="lang-long">English</span><span class="lang-short">EN</span></span>` : `<span lang="ta" aria-current="page">தமிழ்</span><a lang="en" href="${route}?${esc(swapped.toString())}"><span class="lang-long">English</span><span class="lang-short">EN</span></a>`, isColleges ? undefined : "owner")}<main><p class="notice">${notice}</p>${breadcrumbs}${body}<footer class="journey-return"><a class="text-link journey-return-link" href="/journey?step=awareness&amp;lang=${lang}"><span aria-hidden="true">←</span> ${t("வழிகாட்டலை முதலில் இருந்து தொடங்கு","Start the guided journey")}</a></footer></main>${renderIndependenceFooter(lang)}${renderSiteBottomNav(lang, "colleges")}</body></html>`;
}

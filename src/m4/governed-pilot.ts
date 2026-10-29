import type { DiscoverySource } from "./discovery-view.ts";
import { isReleasedBranchCopy, type ReviewedBranchCopy } from "./branch-copy.ts";

/** Internal, trusted review artifacts. These records are never read from URL parameters. */
export type Decision<T> = { readonly disposition: "APPROVED"; readonly reference: string; readonly exact: T } | { readonly disposition: "PENDING" | "HOLD" | "FIX"; readonly reference: string | null; readonly exact: null };
export interface PilotIdentity { readonly code: string; readonly name: string; readonly source: DiscoverySource }
export interface PilotOffering { readonly college: string; readonly programme: string; readonly name: string; readonly source: DiscoverySource }
export interface PilotField { readonly value: string; readonly source: DiscoverySource }
export interface PilotCollege {
  readonly identity: PilotIdentity;
  readonly identityDecision: Decision<PilotIdentity>;
  readonly district: PilotField | null;
  readonly districtConflict?: readonly PilotField[];
  readonly districtDecision: Decision<PilotField>;
  readonly type: PilotField | null;
  readonly typeDecision: Decision<PilotField>;
}
export interface PilotPair {
  readonly offering: PilotOffering;
  readonly offeringDecision: Decision<PilotOffering>;
  readonly profileId: string | null;
  readonly linkDecision: Decision<{ readonly college: string; readonly programme: string; readonly profileId: string }>;
}
export interface PilotInput {
  readonly classification: "GOVERNED_OWNER_REVIEW" | "TEST_FIXTURE";
  readonly colleges: readonly PilotCollege[];
  readonly pairs: readonly PilotPair[];
  readonly profiles: readonly ReviewedBranchCopy[];
}

const nonempty = (value: string) => value.trim().length > 0;
const approved = <T>(decision: Decision<T>, exact: T): boolean => decision.disposition === "APPROVED" && nonempty(decision.reference) && JSON.stringify(decision.exact) === JSON.stringify(exact);
const sourceOk = (s: DiscoverySource, classification: PilotInput["classification"]) => {
  if (!s || !nonempty(s.document) || !Number.isInteger(s.year) || s.year < 1900 || s.location_status === "UNRESOLVED" || !["VERIFIED", "RECORDED"].includes(s.location_status)) return false;
  if (![s.printed_page,s.pdf_page].some(p => p !== null && Number.isInteger(p) && p > 0) || [s.printed_page,s.pdf_page].some(p => p !== null && (!Number.isInteger(p) || p < 1))) return false;
  try { const u = new URL(s.url); return u.protocol === "https:" && !u.username && !u.password && (classification === "TEST_FIXTURE" ? u.hostname.endsWith(".test") : u.hostname === "static.tneaonline.org"); } catch { return false; }
};
const showField = (field: PilotField | null, decision: Decision<PilotField>, classification: PilotInput["classification"]): string | null => field && nonempty(field.value) && sourceOk(field.source,classification) && approved(decision,field) ? field.value : null;

/** Stable source identities. This key does not equate programmes across years. */
export const pilotPairKey = (college: string, programme: string) => `${college}~${programme}`;
export function buildGovernedPilotView(input: PilotInput) {
  if (!["GOVERNED_OWNER_REVIEW","TEST_FIXTURE"].includes(input.classification)) throw new Error("Invalid pilot classification");
  const colleges = new Map<string,PilotCollege>();
  for (const c of input.colleges) {
    if (!/^[A-Za-z0-9-]+$/.test(c.identity.code) || colleges.has(c.identity.code)) throw new Error("Duplicate or missing college identity");
    colleges.set(c.identity.code,c);
  }
  const seen = new Set<string>();
  const items = [];
  let excluded = 0;
  for (const pair of input.pairs) {
    const o = pair.offering, key = pilotPairKey(o.college,o.programme);
    if (!/^[A-Za-z0-9-]+$/.test(o.college) || !/^[A-Za-z0-9-]+$/.test(o.programme) || !nonempty(o.name) || seen.has(key)) throw new Error("Duplicate or missing programme identity");
    seen.add(key);
    const c = colleges.get(o.college);
    const expectedPair = pairRows.find(([college, programme]) => college === o.college && programme === o.programme);
    const expectedIdentity = identityRows.find(([code]) => code === o.college);
    if (input.classification === "GOVERNED_OWNER_REVIEW" && (!expectedPair || !expectedIdentity || !c || c.identity.name !== expectedIdentity[1] || o.name !== expectedPair[2] || JSON.stringify(o.source) !== JSON.stringify(matrix(expectedPair[3])) || JSON.stringify(c.identity.source) !== JSON.stringify(booklet(expectedIdentity[2],expectedIdentity[3])))) { excluded++; continue; }
    if (!c || !nonempty(c.identity.name) || !sourceOk(c.identity.source,input.classification) || !approved(c.identityDecision,c.identity)
      || !sourceOk(o.source,input.classification) || !nonempty(o.source.stream ?? "") || !nonempty(o.source.stage ?? "") || !approved(pair.offeringDecision,o)
      || !pair.profileId || !approved(pair.linkDecision,{college:o.college,programme:o.programme,profileId:pair.profileId})) { excluded++; continue; }
    const profiles = input.profiles.filter(p=>p.id === pair.profileId);
    const profile = profiles.length === 1 && isReleasedBranchCopy(profiles[0]) ? profiles[0] : null;
    const type = showField(c.type,c.typeDecision,input.classification);
    items.push({ key, college: c.identity.code, collegeName: c.identity.name, programme: o.programme, programmeName: o.name,
      district: c.districtConflict?.length ? null : showField(c.district,c.districtDecision,input.classification), type: type && ["GOVERNMENT","AIDED","PRIVATE","UNIVERSITY"].includes(type) ? type : null,
      source: structuredClone(o.source), profileId: pair.profileId, profile: profile ? structuredClone(profile) : null });
  }
  return { classification: input.classification, coverage: "BOUNDED_PARTIAL" as const, items, excluded };
}

const pending = <T>(): Decision<T> => ({disposition:"PENDING",reference:null,exact:null});
const matrix = (page: number): DiscoverySource => ({document:"TNEA 2026 General Academic seat matrix before special reservation counselling",url:"https://static.tneaonline.org/docs/GENERAL_ACADEMIC_SEAT_MATRIX_BEFORE_SPECIAL_RESERVATION_COUNSELLING_2026.pdf",year:2026,stream:"GENERAL_ACADEMIC",stage:"BEFORE_SPECIAL_RESERVATION_COUNSELLING",printed_page:page,pdf_page:page,location_status:"RECORDED"});
const booklet = (printed: number,pdf: number): DiscoverySource => ({document:"TNEA 2026 Information About Colleges",url:"https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf",year:2026,stream:null,stage:null,printed_page:printed,pdf_page:pdf,location_status:"RECORDED"});
const ownerRef = "docs/planning/m4_b_owner_decisions_2026-10-28.md";
const identityRows = [
 ["1","University Departments of Anna University, Chennai - CEG Campus",1,42],
 ["4","University Departments of Anna University, Chennai - MIT Campus",4,45],
 ["1303","Anand Institute of Higher Technology (Autonomous)",59,100],
 ["1304","Easwari Engineering College (Autonomous)",60,101],
 ["2603","Government College of Engineering (Autonomous), Bargur",159,200],
 ["3018","University College of Engineering, Thirukkuvalai",259,300],
 ["4967","S Veerasamy Chettiar College of Engineering and Technology",359,400],
] as const;
// Separate snapshots of the identities approved in the cited owner decision.
// They are deliberately independent of prepared candidate rows.
const identityApprovalRows = [
 ["1","University Departments of Anna University, Chennai - CEG Campus",1,42],
 ["4","University Departments of Anna University, Chennai - MIT Campus",4,45],
 ["1303","Anand Institute of Higher Technology (Autonomous)",59,100],
 ["1304","Easwari Engineering College (Autonomous)",60,101],
 ["2603","Government College of Engineering (Autonomous), Bargur",159,200],
 ["3018","University College of Engineering, Thirukkuvalai",259,300],
 ["4967","S Veerasamy Chettiar College of Engineering and Technology",359,400],
] as const;
const pairRows = [
 ["1","CS","COMPUTER SCIENCE AND ENGINEERING",1,"L01"], ["4","CS","COMPUTER SCIENCE AND ENGINEERING",4,"L02"],
 ["1303","AD","ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",46,"L03"], ["1303","CS","COMPUTER SCIENCE AND ENGINEERING",47,"L04"],
 ["1304","EC","ELECTRONICS AND COMMUNICATION ENGINEERING",48,"L05"], ["1304","BM","BIO MEDICAL ENGINEERING",48,"L06"],
 ["2603","EE","ELECTRICAL AND ELECTRONICS ENGINEERING",118,"L07"], ["3018","CE","CIVIL ENGINEERING",210,"L08"],
 ["4967","AD","ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",278,"L09"],
] as const;
// L01–L09 are independent, bounded owner decisions; candidate edits do not create approvals.
const approvedLinks: Record<string,{ readonly profileId: string; readonly decision: string }> = {
 "1~CS":{profileId:"CS",decision:"L01"}, "4~CS":{profileId:"CS",decision:"L02"},
 "1303~AD":{profileId:"AD",decision:"L03"}, "1303~CS":{profileId:"CS",decision:"L04"},
 "1304~EC":{profileId:"EC",decision:"L05"}, "1304~BM":{profileId:"BM",decision:"L06"},
 "2603~EE":{profileId:"EE",decision:"L07"}, "3018~CE":{profileId:"CE",decision:"L08"},
 "4967~AD":{profileId:"AD",decision:"L09"},
};
/** Actual pilot: links and college identities are accepted, but every listing remains pending. */
export const GOVERNED_PILOT: PilotInput = {
 classification:"GOVERNED_OWNER_REVIEW",
 colleges: identityRows.map(([code,name,printed,pdf]) => { const identity={code,name,source:booklet(printed,pdf)}; const snap=identityApprovalRows.find(([approvedCode])=>approvedCode===code); const identityDecision: Decision<PilotIdentity> = snap ? {disposition:"APPROVED",reference:ownerRef,exact:{code:snap[0],name:snap[1],source:booklet(snap[2],snap[3])}} : pending(); return {identity,identityDecision,district:null, districtConflict: code === "1303" ? [{value:"Kancheepuram",source:matrix(46)},{value:"Chengalpattu",source:booklet(59,100)}] : code === "4967" ? [{value:"Tirunelveli",source:matrix(278)},{value:"Tenkasi",source:booklet(359,400)}] : undefined, districtDecision:pending(),type:null,typeDecision:pending()}; }),
 pairs: pairRows.map(([college,programme,name,page]) => {const offering={college,programme,name,source:matrix(page)}; const link=approvedLinks[pilotPairKey(college,programme)]; const linkDecision: Decision<{college:string;programme:string;profileId:string}> = link ? {disposition:"APPROVED",reference:`${ownerRef}#${link.decision}`,exact:{college,programme,profileId:link.profileId}} : pending(); return {offering,offeringDecision:pending(),profileId:programme,linkDecision};}),
 profiles: [],
};

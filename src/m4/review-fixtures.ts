import type { DiscoveryFixtureInput, DiscoverySource } from "./discovery-view.ts";

// Invented identities only. No official records or candidate profile wording.
const source: DiscoverySource = { document: "Synthetic 2026 listing", url: "https://m4.example.test/listing", year: 2026, stream: "GENERAL_ACADEMIC", stage: "PRE_SPECIAL_RESERVATION", printed_page: 1, pdf_page: 2, location_status: "RECORDED" };
const unknown = { status: "UNKNOWN" as const, value: null };
const approved = (value: string) => ({ status: "APPROVED" as const, value, source, review_reference: "synthetic-review-only" });
const pairs = [[1,"CS"],[1,"BY"],[1,"XC"],[2,"CS"],[2,"AE"],[3,"AD"],[3,"CS"],[4,"EC"],[4,"BM"],[5,"EE"],[6,"CE"],[7,"AD"]] as const;
export const REVIEW_FIXTURES: DiscoveryFixtureInput = {
  fixture_only: true,
  colleges: Array.from({length: 7}, (_, i) => ({ code: `fixture-${i+1}`, identity: approved(`Synthetic College ${i+1}`), district: i === 2 || i === 6 ? { status: "SOURCE_CONFLICT" as const, value: null, candidates: [{value:"Fixture district A",source},{value:"Fixture district B",source}] } : unknown, management: unknown, autonomy: unknown, minority: unknown })),
  offerings: pairs.map(([college, code]) => ({ college_code: `fixture-${college}`, programme_code: code, programme_name: `Synthetic programme ${code}`, listing_status: "LISTED_IN_SOURCE_YEAR", review_status: "APPROVED", review_reference: "synthetic-listing-review", source, link: ["BY","XC","AE"].includes(code) ? { status: "IDENTITY_HOLD", profile_id: null } : {status:"APPROVED_EXACT",profile_id:code,review_reference:"synthetic-link-review"} })),
  profiles: ["CS","AD","EC","BM","EE","CE"].map(id => ({ id, status:"PENDING", review:{factual:null,ta:null,en:null}, source:null, source_scope:"", copy:{ta:"",en:""} })),
};

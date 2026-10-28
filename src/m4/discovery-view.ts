/** Internal M4-A1 contract. Inputs are supplied by a caller; this module loads no data. */
export interface DiscoverySource {
  readonly document: string;
  readonly url: string;
  readonly year: number;
  readonly stream: string | null;
  readonly stage: string | null;
  readonly printed_page: number | null;
  readonly pdf_page: number | null;
  readonly location_status: "VERIFIED" | "RECORDED" | "UNRESOLVED";
}

export type DiscoveryField<T> =
  | { readonly status: "APPROVED"; readonly value: T; readonly source: DiscoverySource; readonly review_reference: string }
  | { readonly status: "UNKNOWN" | "NOT_REPORTED" | "NEEDS_REVIEW"; readonly value: null }
  | { readonly status: "SOURCE_CONFLICT"; readonly value: null; readonly candidates: readonly { readonly value: T; readonly source: DiscoverySource }[] };

export interface DiscoveryCollege {
  readonly code: string;
  readonly identity: DiscoveryField<string>;
  readonly district: DiscoveryField<string>;
  readonly management: DiscoveryField<string>;
  readonly autonomy: DiscoveryField<boolean>;
  readonly minority: DiscoveryField<boolean>;
}

export type DiscoveryLink =
  | { readonly status: "APPROVED_EXACT" | "APPROVED_VARIANT"; readonly profile_id: string; readonly review_reference: string }
  | { readonly status: "PENDING" | "IDENTITY_HOLD" | "PROFILE_HOLD" | "UNMAPPED"; readonly profile_id: null };

export interface DiscoveryOffering {
  readonly college_code: string;
  readonly programme_code: string;
  readonly programme_name: string;
  readonly listing_status: "LISTED_IN_SOURCE_YEAR" | "UNKNOWN" | "NEEDS_REVIEW" | "SOURCE_CONFLICT";
  readonly review_status: "APPROVED" | "PENDING" | "HOLD";
  readonly review_reference: string | null;
  readonly source: DiscoverySource | null;
  readonly link: DiscoveryLink;
}

export interface DiscoveryProfile {
  readonly id: string;
  readonly status: "APPROVED" | "PENDING" | "HOLD";
  readonly review: { readonly factual: string | null; readonly ta: string | null; readonly en: string | null };
  readonly source: DiscoverySource | null;
  readonly source_scope: string;
  readonly copy: { readonly ta: string; readonly en: string };
}

export type DiscoverySelection =
  | { readonly kind: "ALL" }
  | { readonly kind: "COLLEGE"; readonly code: string }
  | { readonly kind: "PROFILE"; readonly id: string };

export interface DiscoveryFixtureInput {
  readonly fixture_only: true;
  readonly colleges: readonly DiscoveryCollege[];
  readonly offerings: readonly DiscoveryOffering[];
  readonly profiles: readonly DiscoveryProfile[];
}

const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const page = (value: number | null) => value === null || (Number.isInteger(value) && value > 0);
function sourceOk(source: DiscoverySource | null): source is DiscoverySource {
  if (!source || !nonempty(source.document) || !Number.isInteger(source.year) || source.year < 1900
      || !page(source.printed_page) || !page(source.pdf_page)
      || !["VERIFIED", "RECORDED", "UNRESOLVED"].includes(source.location_status)) return false;
  if (source.location_status === "UNRESOLVED" ? source.printed_page !== null || source.pdf_page !== null : source.printed_page === null && source.pdf_page === null) return false;
  try { const url = new URL(source.url); return url.protocol === "https:" && !url.username && !url.password && (url.hostname === "test" || url.hostname.endsWith(".test")); }
  catch { return false; }
}
const locatedSource = (source: DiscoverySource | null): source is DiscoverySource => sourceOk(source) && source.location_status !== "UNRESOLVED";
function field<T>(value: DiscoveryField<T>): DiscoveryField<T> {
  if (value.status === "APPROVED") {
    if (value.value === null || value.value === undefined || (typeof value.value === "string" && !nonempty(value.value))
        || !locatedSource(value.source) || !nonempty(value.review_reference)) return { status: "NEEDS_REVIEW", value: null };
    return structuredClone(value);
  }
  if (value.status === "SOURCE_CONFLICT") {
    if (value.candidates.length < 2 || value.candidates.some(candidate => !sourceOk(candidate.source))) return { status: "NEEDS_REVIEW", value: null };
    return structuredClone(value);
  }
  return { status: value.status, value: null };
}
function unique<T>(items: readonly T[], key: (item: T) => string): void {
  const seen = new Set<string>();
  for (const item of items) { const id = key(item); if (!nonempty(id) || seen.has(id)) throw new Error("Missing or duplicate discovery identity"); seen.add(id); }
}

/**
 * Projects source-ordered fixture records into an internal, marks-free model.
 * Listing and profile approval are independent. No current availability or personal outcome is computed.
 */
export function buildDiscoveryFixtureView(input: DiscoveryFixtureInput, selection: DiscoverySelection = { kind: "ALL" }) {
  if (input.fixture_only !== true) throw new Error("Synthetic fixture input required");
  unique(input.colleges, college => college.code);
  unique(input.profiles, profile => profile.id);
  unique(input.offerings, offering => JSON.stringify([offering.college_code, offering.programme_code, offering.source?.document, offering.source?.year, offering.source?.stream, offering.source?.stage]));
  const colleges = new Map(input.colleges.map(college => [college.code, college]));
  const profiles = new Map(input.profiles.map(profile => [profile.id, profile]));
  let excluded_unverified = 0;
  let excluded_unlinked_for_profile = 0;
  const items = [];
  for (const offering of input.offerings) {
    if (selection.kind === "COLLEGE" && offering.college_code !== selection.code) continue;
    const link = offering.link;
    const linked = (link.status === "APPROVED_EXACT" || link.status === "APPROVED_VARIANT")
      && nonempty(link.profile_id) && nonempty(link.review_reference);
    if (selection.kind === "PROFILE" && (!linked || link.profile_id !== selection.id)) {
      if (!linked) excluded_unlinked_for_profile++;
      continue;
    }
    const college = colleges.get(offering.college_code);
    const identity = college ? field(college.identity) : null;
    const source = offering.source;
    if (!college || !nonempty(offering.college_code) || !nonempty(offering.programme_code) || !nonempty(offering.programme_name)
        || identity?.status !== "APPROVED" || offering.listing_status !== "LISTED_IN_SOURCE_YEAR"
        || offering.review_status !== "APPROVED" || !nonempty(offering.review_reference)
        || !locatedSource(source) || !nonempty(source.stream) || !nonempty(source.stage)) { excluded_unverified++; continue; }
    const profile = linked ? profiles.get(link.profile_id) : undefined;
    const approved = profile?.status === "APPROVED" && nonempty(profile.review.factual) && nonempty(profile.review.ta)
      && nonempty(profile.review.en) && nonempty(profile.source_scope) && locatedSource(profile.source)
      && nonempty(profile.copy.ta) && nonempty(profile.copy.en);
    items.push({
      data_classification: "SYNTHETIC_FIXTURE_ONLY" as const,
      output_class: "INFORMATION" as const,
      college: { code: college.code, identity, district: field(college.district), management: field(college.management), autonomy: field(college.autonomy), minority: field(college.minority) },
      offering: { programme_code: offering.programme_code, programme_name: offering.programme_name, status: "LISTED_IN_SOURCE_YEAR" as const, source: structuredClone(source), review_reference: offering.review_reference },
      profile: linked ? { link_status: link.status, id: link.profile_id, review_reference: link.review_reference,
        content_status: approved ? "APPROVED" as const : "PENDING_OR_HELD" as const,
        content: approved && profile ? { copy: structuredClone(profile.copy), source: structuredClone(profile.source!), source_scope: profile.source_scope, review: structuredClone(profile.review) } : null,
      } : { link_status: link.status === "APPROVED_EXACT" || link.status === "APPROVED_VARIANT" ? "PENDING" as const : link.status, id: null, review_reference: null, content_status: "UNLINKED" as const, content: null },
    });
  }
  return { data_classification: "SYNTHETIC_FIXTURE_ONLY" as const, output_class: "INFORMATION" as const, coverage: "PARTIAL" as const, ordering: "SOURCE_ORDER" as const,
    selection: structuredClone(selection), items, excluded_unverified, excluded_unlinked_for_profile,
    next_action: items.length ? "EXPLORE_OR_COMPARE" as const : "BROWSE_ALL_OR_CHECK_OFFICIAL" as const };
}

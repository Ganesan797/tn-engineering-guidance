import type { GuidanceResult } from "../application/guidance.ts";
import type { EligibilityCheck } from "../domain/models.ts";
import type { QuestionCollection } from "../ui/explore-questions.ts";

export interface PresentationSource {
  readonly source_id: string;
  readonly title: string;
  readonly url: string;
  readonly published_date: string | null;
}
export type PresentationSourceRegistry = ReadonlyMap<string, PresentationSource>;
export type EvidencePrecision = "CHECK_LEVEL" | "APPROVED_CONTENT_LEVEL" | "DOCUMENT_LEVEL";
export interface ClaimEvidence {
  readonly claim_id: string;
  readonly precision: EvidencePrecision;
  readonly trace: { readonly rule_id?: string; readonly content_id?: string; readonly review_reference?: string; readonly version?: string };
  readonly references: readonly {
    readonly source_id: string | null;
    readonly source_title: string;
    readonly source_link: string;
    readonly source_year: number | null;
    readonly printed_page: number | null;
    readonly pdf_position: number | null;
    readonly location: string | null;
    readonly location_status: "VERIFIED" | "RECORDED" | "UNRESOLVED";
    readonly evidence_limit: string;
  }[];
}

// Evidence-only reconciliation: official brochure inspected, text and page image, 2026-10-22.
export const IMPROVEMENT_SOURCE_LOCATION = {
  source_id: "SRC002", rule_id: "ELG032", source_year: 2026,
  printed_page: 3, pdf_position: 4, section: "Improvement marks",
  verified_on: "2026-10-22",
  source_link: "https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf",
  sha256: "2242626455a14caf7613494626b4d8bcc903607c3e8dcdf209b5291ba6a2bb88",
} as const;

function csvCells(row: string): string[] {
  const cells: string[] = [];
  let cell = "", quoted = false;
  for (let i = 0; i < row.length; i++) {
    const character = row[i];
    if (character === '"') {
      if (quoted && row[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (character === "," && !quoted) { cells.push(cell); cell = ""; }
    else cell += character;
  }
  if (quoted) throw new Error("Source registry contains an incomplete quoted row");
  cells.push(cell);
  return cells;
}

export function parsePresentationSources(csv: string): PresentationSourceRegistry {
  const rows = csv.trim().split(/\r?\n/).map(csvCells);
  const header = rows.shift() ?? [];
  const fields = ["source_id", "source_name", "source_url", "published_date"];
  const indices = fields.map((field) => header.indexOf(field));
  if (indices.some((index) => index < 0)) throw new Error("Source registry columns unavailable");
  const registry = new Map<string, PresentationSource>();
  for (const row of rows) {
    const [id, title, url, published] = indices.map((index) => row[index]);
    if (!id || !title || !url || !url.startsWith("https://") || registry.has(id)) throw new Error("Source registry entry unavailable");
    registry.set(id, { source_id: id, title, url, published_date: published || null });
  }
  return registry;
}

function sourceReference(source: PresentationSource, year: number | null): ClaimEvidence["references"][number] {
  return {
    source_id: source.source_id, source_title: source.title, source_link: source.url,
    source_year: year, printed_page: null, pdf_position: null, location: null,
    location_status: "UNRESOLVED", evidence_limit: "Document reference only; no exact statement or page has been verified here.",
  };
}

export function checkClaimEvidence(check: EligibilityCheck, registry: PresentationSourceRegistry): ClaimEvidence {
  const source = registry.get(check.source_id);
  const references: ClaimEvidence["references"][number][] = [];
  if (source) {
    let reference = {
      ...sourceReference(source, check.source_year), printed_page: check.source_page,
      location: check.source_page === null ? null : `Printed page ${check.source_page}`,
      location_status: (check.source_page === null ? "UNRESOLVED" : "RECORDED") as "RECORDED" | "VERIFIED" | "UNRESOLVED",
      evidence_limit: "Supports this emitted check at check level, not each sentence of new guidance. Location is recorded metadata unless separately verified.",
    };
    const verified = IMPROVEMENT_SOURCE_LOCATION;
    if (check.rule_id === verified.rule_id && check.source_id === verified.source_id && check.source_year === verified.source_year) {
      if (check.source_page === verified.printed_page && source.url === verified.source_link) {
        reference = { ...reference, pdf_position: verified.pdf_position, location: verified.section, location_status: "VERIFIED", evidence_limit: "Verified location of the improvement-marks passage for 2026 only; no certificate verification or fresh review of other rules is implied." };
      } else {
        reference = { ...reference, printed_page: null, location: null, location_status: "UNRESOLVED", evidence_limit: "Recorded source location conflicts with the verified improvement-marks reference; no precise page is asserted." };
      }
    }
    references.push(reference);
  }
  return { claim_id: `eligibility.check.${check.rule_id}`, precision: "CHECK_LEVEL", trace: { rule_id: check.rule_id }, references };
}

export function documentClaimEvidence(claimId: string, sourceId: string, registry: PresentationSourceRegistry, sourceYear: number | null = null): ClaimEvidence {
  const source = registry.get(sourceId);
  return { claim_id: claimId, precision: "DOCUMENT_LEVEL", trace: {}, references: source ? [sourceReference(source, sourceYear)] : [] };
}

export interface ApprovedContentReviewScope {
  readonly content_ids: readonly string[];
  readonly version: string;
  readonly review_reference: string;
  readonly source_years: Readonly<Record<string, number | null>>;
}

// Review scope must come from an explicit owner/content review, not a student request.
// A review of the whole answer permits only whole-answer evidence, never sentence attribution.
export function approvedContentClaimEvidence(
  contentId: string, collection: QuestionCollection, review: ApprovedContentReviewScope,
  registry: PresentationSourceRegistry,
): ClaimEvidence {
  const answer = collection.answers.get(contentId);
  if (!answer || !review.content_ids.includes(contentId) || !review.version || !review.review_reference) throw new Error("Content is outside the supplied approved review scope");
  const references = answer.evidence.map((evidence): ClaimEvidence["references"][number] => {
    if (!evidence.url.startsWith("https://")) throw new Error("Reviewed evidence URL unavailable");
    const source = [...registry.values()].find(({ url }) => url === evidence.url);
    // Canonical evidence outside the source registry remains attached to its exact reviewed URL.
    // Its key is only a reference title, not an invented publisher/document title.
    return {
      source_id: source?.source_id ?? null, source_title: source?.title ?? "Reviewed guidance reference",
      source_link: evidence.url, source_year: review.source_years[evidence.url] ?? null,
      printed_page: null, pdf_position: null, location: evidence.location || null, location_status: "RECORDED",
      evidence_limit: [answer.en.limit, answer.ta?.limit, "Evidence belongs to the reviewed answer as a whole; page text is recorded, not newly verified."].filter(Boolean).join(" "),
    };
  });
  return {
    claim_id: `content.${contentId}`, precision: "APPROVED_CONTENT_LEVEL",
    trace: { content_id: contentId, version: review.version, review_reference: review.review_reference }, references,
  };
}

export function personalClaimEvidence(result: GuidanceResult, registry: PresentationSourceRegistry): readonly ClaimEvidence[] {
  const claims = result.eligibility.checks.map((check) => checkClaimEvidence(check, registry));
  if (result.eligibility.cutoff !== null) {
    const cutoff = claims.find(({ trace }) => trace.rule_id === "ELG009");
    if (cutoff) claims.push({ ...cutoff, claim_id: "personal.cutoff" });
  }
  // Overall eligibility depends on multiple checks; do not imply one paragraph proves it all.
  const sources = [...new Set(result.eligibility.checks.map(({ source_id }) => source_id))];
  for (const id of sources) {
    const years = [...new Set(result.eligibility.checks.filter(({ source_id }) => source_id === id).map(({ source_year }) => source_year))];
    claims.push(documentClaimEvidence(`personal.eligibility.document.${id}`, id, registry, years.length === 1 ? years[0] : null));
  }
  return claims;
}

export function studentEvidenceReference(reference: ClaimEvidence["references"][number]) {
  const { source_id: _internal, location_status: _status, ...visible } = reference;
  // Fail closed on accidental raw identifiers in existing record text; no raw fallback.
  if (/\b(?:SRC\d+|ELG\d+)\b/.test(JSON.stringify(visible))) throw new Error("Evidence wording requires a student-safe mapping");
  return visible;
}

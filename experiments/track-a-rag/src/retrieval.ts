import { isApprovedSourceId } from "./manifest.ts";
import type {
  EvidenceChunk,
  EvidenceSelection,
  RetrievalConstraints,
  RetrievedChunk,
} from "./types.ts";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "does", "for", "how", "i", "in", "is", "it",
  "me", "my", "of", "the", "to", "what", "which", "will", "with",
]);

export function tokenize(text: string): readonly string[] {
  return (text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function matchesConstraints(
  chunk: EvidenceChunk,
  constraints: RetrievalConstraints,
  includeYear = true,
): boolean {
  const metadata = chunk.metadata;
  return (
    (!includeYear || constraints.source_year === undefined || metadata.source_year === constraints.source_year) &&
    (constraints.institution_scope === undefined || metadata.institution_scope === constraints.institution_scope) &&
    (constraints.regulation === undefined || metadata.regulation === constraints.regulation) &&
    (constraints.revision === undefined || metadata.revision === constraints.revision) &&
    (constraints.academic_batch === undefined || metadata.academic_batch === constraints.academic_batch) &&
    (constraints.programme === undefined || metadata.programme === constraints.programme)
  );
}

function lexicalScore(questionTokens: readonly string[], chunk: EvidenceChunk): number {
  const haystack = tokenize(`${chunk.title} ${chunk.text} ${chunk.metadata.page_or_section}`);
  const tokenScore = questionTokens.reduce(
    (score, token) => score + haystack.filter((candidate) => candidate === token).length,
    0,
  );
  const normalizedQuestion = questionTokens.join(" ");
  const phraseBoost = (chunk.chunking_strategy === "SECTION_AWARE" ? chunk.retrieval_terms : []).reduce(
    (score, term) => {
      const normalizedTerm = tokenize(term).join(" ");
      return score + (
        normalizedTerm !== "" &&
        (normalizedQuestion.includes(normalizedTerm) || normalizedTerm.includes(normalizedQuestion))
          ? 10
          : 0
      );
    },
    0,
  );
  return tokenScore + phraseBoost;
}

export function retrieveChunks(
  question: string,
  chunks: readonly EvidenceChunk[],
  constraints: RetrievalConstraints = {},
  limit = 4,
): readonly RetrievedChunk[] {
  const questionTokens = tokenize(question);
  return chunks
    .filter((chunk) => isApprovedSourceId(chunk.metadata.source_id))
    .filter((chunk) => matchesConstraints(chunk, constraints))
    .map((chunk) => ({ chunk, score: lexicalScore(questionTokens, chunk) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) =>
      right.score - left.score || left.chunk.chunk_id.localeCompare(right.chunk.chunk_id),
    )
    .slice(0, limit);
}

function unresolvedConflicts(retrieved: readonly RetrievedChunk[]): readonly string[] {
  const byFact = new Map<string, RetrievedChunk[]>();
  for (const item of retrieved) {
    if (item.chunk.fact_key === undefined || item.chunk.claim_value === undefined) continue;
    const current = byFact.get(item.chunk.fact_key) ?? [];
    current.push(item);
    byFact.set(item.chunk.fact_key, current);
  }

  const conflicts: string[] = [];
  for (const [factKey, items] of byFact) {
    const values = new Set(items.map(({ chunk }) => chunk.claim_value));
    const explicitSupersession = items.some(({ chunk }) => chunk.supersedes_chunk_id !== undefined);
    if (values.size > 1 && !explicitSupersession) conflicts.push(factKey);
  }
  return conflicts.sort();
}

export function selectEvidence(
  question: string,
  chunks: readonly EvidenceChunk[],
  constraints: RetrievalConstraints = {},
): EvidenceSelection {
  const retrieved = retrieveChunks(question, chunks, constraints);
  if (constraints.source_year !== undefined && retrieved.length === 0) {
    const stale = chunks
      .filter((chunk) => matchesConstraints(chunk, constraints, false))
      .filter((chunk) => lexicalScore(tokenize(question), chunk) > 0);
    if (stale.length > 0) {
      return {
        status: "DEFER",
        retrieved: [],
        reason: `No matching evidence for required year ${constraints.source_year}`,
        conflicts: [],
      };
    }
  }
  if (retrieved.length === 0) {
    return { status: "DEFER", retrieved: [], reason: "No matching approved evidence", conflicts: [] };
  }

  const conflicts = unresolvedConflicts(retrieved);
  if (conflicts.length > 0) {
    return {
      status: "DEFER",
      retrieved,
      reason: `Conflicting evidence requires review: ${conflicts.join(", ")}`,
      conflicts,
    };
  }
  return { status: "READY", retrieved, reason: null, conflicts: [] };
}

export function hasCompleteProvenance(chunk: EvidenceChunk): boolean {
  const metadata = chunk.metadata;
  return (
    chunk.chunk_id.trim() !== "" &&
    metadata.source_id.trim() !== "" &&
    metadata.document_title.trim() !== "" &&
    metadata.publisher.trim() !== "" &&
    metadata.reference.trim() !== "" &&
    metadata.page_or_section.trim() !== "" &&
    metadata.approval_status === "APPROVED"
  );
}

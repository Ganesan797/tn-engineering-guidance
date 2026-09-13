import type { Capability, EvidenceSelection } from "./types.ts";

const PROMPT_LIKE_TEXT = /ignore (?:all )?(?:previous|prior) instructions|answer from memory|system prompt/iu;

export interface EvidencePacket {
  readonly route: Capability;
  readonly retrieved_content_trust: "UNTRUSTED_DOCUMENT_DATA";
  readonly evidence_status: "GROUNDED_EXTRACTS" | "INSUFFICIENT_EVIDENCE" | "DETERMINISTIC_HANDOFF";
  readonly supporting_chunk_ids: readonly string[];
  readonly extracts: readonly string[];
  readonly warnings: readonly string[];
}

export function containsPromptLikeContent(text: string): boolean {
  return PROMPT_LIKE_TEXT.test(text);
}

export function buildEvidencePacket(
  route: Capability,
  selection: EvidenceSelection,
): EvidencePacket {
  if (route === "DETERMINISTIC_CUTOFF" || route === "DETERMINISTIC_ELIGIBILITY") {
    return {
      route,
      retrieved_content_trust: "UNTRUSTED_DOCUMENT_DATA",
      evidence_status: "DETERMINISTIC_HANDOFF",
      supporting_chunk_ids: [],
      extracts: [],
      warnings: ["Admission-critical result must come from the existing deterministic engine"],
    };
  }
  if (selection.status === "DEFER") {
    return {
      route: "EVIDENCE_DEFER",
      retrieved_content_trust: "UNTRUSTED_DOCUMENT_DATA",
      evidence_status: "INSUFFICIENT_EVIDENCE",
      supporting_chunk_ids: selection.retrieved.map(({ chunk }) => chunk.chunk_id),
      extracts: [],
      warnings: [selection.reason ?? "Evidence verification required"],
    };
  }

  const warnings = selection.retrieved
    .filter(({ chunk }) => containsPromptLikeContent(chunk.text))
    .map(({ chunk }) => `Ignored prompt-like document text in ${chunk.chunk_id}`);
  return {
    route,
    retrieved_content_trust: "UNTRUSTED_DOCUMENT_DATA",
    evidence_status: "GROUNDED_EXTRACTS",
    supporting_chunk_ids: selection.retrieved.map(({ chunk }) => chunk.chunk_id),
    extracts: selection.retrieved.map(({ chunk }) => chunk.text),
    warnings,
  };
}

export function unsupportedClaimIds(
  claims: readonly { readonly claim_id: string; readonly supporting_chunk_ids: readonly string[] }[],
  packet: EvidencePacket,
): readonly string[] {
  const retrieved = new Set(packet.supporting_chunk_ids);
  return claims
    .filter(({ supporting_chunk_ids }) =>
      supporting_chunk_ids.length === 0 || supporting_chunk_ids.some((id) => !retrieved.has(id)),
    )
    .map(({ claim_id }) => claim_id);
}

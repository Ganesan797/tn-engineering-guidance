import type { CorpusSection, EvidenceChunk } from "./types.ts";

function words(text: string): readonly string[] {
  return text.trim().split(/\s+/u).filter(Boolean);
}

export function sectionAwareChunking(
  sections: readonly CorpusSection[],
): readonly EvidenceChunk[] {
  return sections.map((section) => ({
    ...section,
    chunk_id: `${section.metadata.source_id}:${section.section_id}:section`,
    chunking_strategy: "SECTION_AWARE",
  }));
}

export function fixedSizeChunking(
  sections: readonly CorpusSection[],
  maximumWords = 24,
): readonly EvidenceChunk[] {
  if (!Number.isInteger(maximumWords) || maximumWords < 1) {
    throw new Error("maximumWords must be a positive integer");
  }

  return sections.flatMap((section) => {
    const tokens = words(section.text);
    const chunks: EvidenceChunk[] = [];
    for (let offset = 0; offset < tokens.length; offset += maximumWords) {
      const index = Math.floor(offset / maximumWords) + 1;
      chunks.push({
        ...section,
        text: tokens.slice(offset, offset + maximumWords).join(" "),
        chunk_id: `${section.metadata.source_id}:${section.section_id}:fixed-${index}`,
        chunking_strategy: "FIXED_SIZE",
      });
    }
    return chunks;
  });
}

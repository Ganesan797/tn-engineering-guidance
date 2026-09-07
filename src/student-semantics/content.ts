import type { InformationalContentItem } from "./models.ts";

export const ENGINEERING_CHOICES_AWARENESS: InformationalContentItem = {
  output_class: "INFORMATION",
  content_id: "awareness.engineering_choices",
  version: "M0_V1",
  title: { key: "content.awareness.engineering_choices.title" },
  body: { key: "content.awareness.engineering_choices.body" },
  provenance: {
    document_id: "docs/product_mission.md",
    section: "Zero-Knowledge Entry Principle",
  },
  governance_status: "M0_REVIEW_PROOF_NOT_PILOT_READY",
};

const CONTENT = new Map([
  [ENGINEERING_CHOICES_AWARENESS.content_id, ENGINEERING_CHOICES_AWARENESS],
]);

export function getInformationalContent(contentId: string): InformationalContentItem {
  const content = CONTENT.get(contentId);
  if (content === undefined) {
    throw new Error(`student informational content is unavailable: ${contentId}`);
  }
  return content;
}

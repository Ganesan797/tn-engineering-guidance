import type { StudentLanguage } from "./models.ts";

export interface AwarenessSource {
  readonly source_id: string;
  readonly name: string;
  readonly url: string;
}
export interface AwarenessItem {
  readonly id: string;
  readonly topic: string;
  readonly stability: string;
  readonly output_class: "INFORMATION";
  readonly presentations: Readonly<Record<StudentLanguage, { readonly title: string; readonly body: string }>>;
  readonly sources: readonly AwarenessSource[];
  readonly source_locations: string;
}
export interface AwarenessPack {
  readonly pack_id: string;
  readonly version: string;
  readonly content_document: string;
  readonly items: readonly AwarenessItem[];
}

// Reads the frozen pack's explicit headings. It neither summarizes nor translates content.
export function parseAwarenessPack(manifestJson: string, markdown: string, registryCsv: string): AwarenessPack {
  const manifest = JSON.parse(manifestJson) as {
    pack_id: string; version: string; status: string; content_document: string;
    items: { id: string; topic: string; stability: string; source_ids: string[] }[];
  };
  if (manifest.status !== "FROZEN" || manifest.version !== "V1" || manifest.items.length !== 10) {
    throw new Error("Frozen awareness manifest is invalid");
  }
  const registry = new Map<string, AwarenessSource>();
  // Only the first five registry columns are needed; the quoted notes column is untouched.
  for (const row of registryCsv.trim().split(/\r?\n/).slice(1)) {
    const [source_id, name, , , url] = row.split(",");
    if (!source_id || !name || !url || !/^https:\/\//.test(url) || registry.has(source_id)) {
      throw new Error("Awareness source registry is invalid");
    }
    registry.set(source_id, { source_id, name, url });
  }
  const normalized = markdown.replaceAll("\r\n", "\n");
  const sections = [...normalized.matchAll(/^### (AW-\d{2}) - [^\n]+\n([\s\S]*?)(?=^### AW-|^## Required evidence links)/gm)];
  if (sections.length !== 10 || new Set(sections.map((s) => s[1])).size !== 10) {
    throw new Error("Awareness document must contain each frozen module once");
  }
  const items = manifest.items.map((item, index): AwarenessItem => {
    if (item.id !== `AW-${String(index + 1).padStart(2, "0")}`) throw new Error("Awareness identities are invalid");
    const section = sections.find((s) => s[1] === item.id)?.[2];
    if (!section) throw new Error("Awareness module is missing");
    const field = (label: string) => {
      const found = section.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\n\\*\\*(?:English|Tamil|Student takeaway|Sources|Stability)[^\\n]*:|$)`));
      if (!found?.[1]?.trim()) throw new Error("Awareness content field is missing");
      return found[1].trim();
    };
    return {
      id: item.id, topic: item.topic, stability: item.stability, output_class: "INFORMATION",
      presentations: {
        en: { title: field("English title"), body: field(item.id === "AW-10" ? "English options" : "English") },
        ta: { title: field("Tamil title"), body: field(item.id === "AW-10" ? "Tamil options" : "Tamil") },
      },
      sources: item.source_ids.map((id) => {
        const source = registry.get(id);
        if (!source) throw new Error("Awareness provenance is missing");
        return source;
      }),
      source_locations: field("Sources"),
    };
  });
  return { pack_id: manifest.pack_id, version: manifest.version, content_document: manifest.content_document, items };
}

export const AWARENESS_GROUPS = [
  { key: "engineering", ids: ["AW-01", "AW-02"] },
  { key: "admission", ids: ["AW-03", "AW-04", "AW-05"] },
  { key: "choices", ids: ["AW-06", "AW-07"] },
  { key: "support", ids: ["AW-08", "AW-09"] },
  { key: "next", ids: ["AW-10"] },
] as const;

// Approved language presentation only. Factual metadata and the English presentation
// continue to come from the frozen pack, never from this overlay.
export function applyApprovedTamilStudentCopy(pack: AwarenessPack, markdown: string): AwarenessPack {
  if (!markdown.includes("`TAMIL_STUDENT_COPY = APPROVED_V1`")) {
    throw new Error("Tamil student copy must be approved");
  }
  const normalized = markdown.replaceAll("\r\n", "\n");
  const bodies = normalized.split(/^### (AW-\d{2})\n/gm);
  const copies = new Map<string, { title: string; body: string }>();
  for (let index = 1; index < bodies.length; index += 2) {
    const id = bodies[index];
    const section = bodies[index + 1];
    const title = section.match(/\*\*Title:\*\* ([^\n]+)/)?.[1];
    const content = section.match(/\*\*Content:\*\*\s*([\s\S]*?)\n\n\*\*Takeaway:\*\*/)?.[1].trim();
    const takeaway = section.match(/\*\*Takeaway:\*\*\s*([\s\S]*)/)?.[1].trim();
    if (!title || !content || !takeaway || copies.has(id)) throw new Error("Tamil student copy is incomplete or duplicated");
    copies.set(id, { title, body: `${content}\n\n${takeaway}` });
  }
  if (copies.size !== pack.items.length) {
    throw new Error("Tamil student copy identities must match the frozen pack");
  }
  return {
    ...pack,
    items: pack.items.map((item) => {
      const copy = copies.get(item.id);
      if (!copy) throw new Error("Tamil student copy identity is missing");
      return { ...item, presentations: { ...item.presentations, ta: copy } };
    }),
  };
}

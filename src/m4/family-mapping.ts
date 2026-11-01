export type M4FamilyId = "C" | "E" | "M" | "B" | "T" | "S";

export const M4_FAMILIES: Readonly<Record<M4FamilyId, { readonly ta: string; readonly en: string }>> = {
  C: { ta: "கணினி மற்றும் தகவல்", en: "Computing and information" },
  E: { ta: "மின்னியல், மின்னணுவியல் மற்றும் மருத்துவக் கருவிகள்", en: "Electrical, electronics and medical devices" },
  M: { ta: "இயந்திரம், உற்பத்தி மற்றும் தானியக்கம்", en: "Machines, manufacturing and automation" },
  B: { ta: "கட்டுமானம் மற்றும் நிலம்", en: "Built environment and land" },
  T: { ta: "வேதியியல், உயிரியல், பொருட்கள் மற்றும் துணிநுட்பம்", en: "Chemical, biological, materials and textiles" },
  S: { ta: "வானூர்தி, வேளாண்மை, சுற்றுச்சூழல் மற்றும் கடல்சார்", en: "Aerospace, agriculture, environment and marine" },
};

export interface ReviewedFamilyMapping {
  readonly family: M4FamilyId;
  readonly profileId: string;
  readonly programmeCode: string;
  readonly version: string;
  readonly disposition: "HOLD" | "APPROVED";
  readonly approval: null | {
    readonly version: string;
    readonly family: M4FamilyId;
    readonly profileId: string;
    readonly programmeCode: string;
    readonly owner: string;
    readonly reference: string;
  };
}

// The exact 116-code candidate crosswalk is prepared for review in the existing
// catalogue. No family association has yet received an owner decision.
export const APPROVED_FAMILY_MAPPINGS: readonly ReviewedFamilyMapping[] = [];

export function isReleasedFamilyMapping(mapping: ReviewedFamilyMapping): boolean {
  const approval = mapping.approval;
  return mapping.disposition === "APPROVED" && !!approval
    && approval.version === mapping.version
    && approval.family === mapping.family
    && approval.profileId === mapping.profileId
    && approval.programmeCode === mapping.programmeCode
    && [mapping.version, mapping.profileId, mapping.programmeCode, approval.owner, approval.reference].every(value => value.trim().length > 0);
}

export function buildReleasedFamilies<T extends { readonly programme: string; readonly profileId: string | null; readonly profile?: unknown }>(
  items: readonly T[],
  registry: readonly ReviewedFamilyMapping[] = APPROVED_FAMILY_MAPPINGS,
) {
  const candidates = new Map<string, ReviewedFamilyMapping[]>();
  for (const mapping of registry) {
    const key = `${mapping.family}|${mapping.profileId}|${mapping.programmeCode}`;
    const rows = candidates.get(key) ?? [];
    rows.push(mapping);
    candidates.set(key, rows);
  }
  const released = [...candidates.values()].filter(rows => rows.length === 1).map(rows => rows[0]).filter(isReleasedFamilyMapping)
    .filter(mapping => items.some(item => item.programme === mapping.programmeCode
    && item.profileId === mapping.profileId && !!item.profile));
  return (["C", "E", "M", "B", "T", "S"] as const).map(id => ({
    id,
    label: M4_FAMILIES[id],
    mappings: released.filter(mapping => mapping.family === id),
  })).filter(family => family.mappings.length > 0);
}

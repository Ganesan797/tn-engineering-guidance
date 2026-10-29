import type { DiscoveryCollege } from "./discovery-view.ts";

// Only separately approved management fields may classify a college.
export const COLLEGE_TYPES = [
  { id: "government", value: "GOVERNMENT", ta: "அரசுக் கல்லூரிகள்", en: "Government colleges" },
  { id: "aided", value: "AIDED", ta: "அரசு உதவிபெறும் கல்லூரிகள்", en: "Government-aided colleges" },
  { id: "private", value: "PRIVATE", ta: "தனியார் / சுயநிதிக் கல்லூரிகள்", en: "Private / self-financing colleges" },
  { id: "university", value: "UNIVERSITY", ta: "பல்கலைக்கழகத் துறைகள் / உறுப்புக் கல்லூரிகள்", en: "University departments / constituent colleges" },
  { id: "unknown", value: null, ta: "வகை இன்னும் உறுதிப்படுத்தப்படவில்லை", en: "Type not yet confirmed" },
] as const;
export function collegeType(college: Pick<DiscoveryCollege, "management">) {
  return COLLEGE_TYPES.find(type => type.value !== null && college.management.status === "APPROVED" && college.management.value === type.value) ?? COLLEGE_TYPES[4];
}

// Official further-reading references, separate from synthetic offering evidence.
// These links approve neither profile wording nor any college/programme association.
const revision = "https://cac.annauniv.edu/aidetails/afug_2025_fu%20-%20revision/";
export const BRANCH_READING: Record<string, { title: string; url: string; pages: string; revised: boolean }> = {
  CS: { title: "B.E. Computer Science and Engineering", url: revision + "CSIE/BE%20CSE.pdf", pages: "3–6", revised: true },
  AD: { title: "B.Tech. Artificial Intelligence and Data Science", url: revision + "CSIE/B.Tech.%20AI%20and%20DS.pdf", pages: "3–6", revised: true },
  EC: { title: "B.E. Electronics and Communication Engineering", url: revision + "ECE/B.E%20ECE.pdf", pages: "3–6", revised: true },
  BM: { title: "B.E. Biomedical Engineering", url: revision + "ECE/B.E.%20Biomedical.pdf", pages: "3–6", revised: true },
  EE: { title: "B.E. Electrical and Electronics Engineering", url: revision + "EEE/B.E.%20EEE.pdf", pages: "3–7", revised: true },
  CE: { title: "B.E. Civil Engineering", url: revision + "Civil/B.E.%20Civil%20Engineering%20.pdf", pages: "3–6", revised: true },
  "SYN-MECH": { title: "B.E. Mechanical Engineering", url: revision + "Mech/B.E.%20Mechanical%20Engineering.pdf", pages: "3–6", revised: true },
  "SYN-CHEM": { title: "B.Tech. Chemical Engineering", url: revision + "Tech/B.Tech%20Chemical.pdf", pages: "3–6", revised: true },
  "SYN-ENV": { title: "B.E. Environmental Engineering", url: "https://cac.annauniv.edu/aidetails/afug_2025_fu/Civil/BE_Environmental%20Engineering.pdf", pages: "3–7", revised: false },
};

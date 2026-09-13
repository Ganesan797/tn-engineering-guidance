import {
  APPROVED_SOURCE_IDS,
  type ApprovedSourceId,
  type SourceManifestEntry,
} from "./types.ts";

export const TRACK_A_SOURCE_MANIFEST: readonly SourceManifestEntry[] = [
  {
    source_id: "RAG-A01",
    title: "TNEA 2026 Information Brochure",
    publisher: "Official TNEA / Government of Tamil Nadu",
    source_type: "OFFICIAL_ADMISSION_BROCHURE",
    source_year: 2026,
    document_version: "2026",
    reference: "https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "experiments/track-a-rag/corpus/real-approved-corpus.ts#A01",
    primary_uses: ["TNEA explanation", "eligibility context", "cutoff", "admission process"],
  },
  {
    source_id: "RAG-A02",
    title: "Official TNEA 2026 Online Counselling Procedure",
    publisher: "Official TNEA",
    source_type: "OFFICIAL_COUNSELLING_PROCEDURE",
    source_year: 2026,
    document_version: "2026",
    reference: "https://static.tneaonline.org/docs/8_TNEA_2024_Counselling_procedure_2026.pdf",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "experiments/track-a-rag/corpus/real-approved-corpus.ts#A02",
    primary_uses: ["counselling stages", "choice filling", "allotment", "reporting"],
  },
  {
    source_id: "RAG-A03",
    title: "Anna University R2025 Revision 1 B.E./B.Tech Curriculum & Syllabi",
    publisher: "Anna University",
    source_type: "OFFICIAL_CURRICULUM_CATALOGUE",
    source_year: 2026,
    document_version: "Regulations 2025 (Revised 1, 2026), AY 2026-27",
    reference: "https://cac.annauniv.edu/aidetails/revision_ai_ug_cands_2025ft.html",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "experiments/track-a-rag/corpus/real-approved-corpus.ts#A03",
    institution_scope: "AFFILIATED_INSTITUTIONS",
    primary_uses: ["branch awareness", "curriculum lookup"],
  },
  {
    source_id: "RAG-A04",
    title: "Anna University R2023 Revision 2 University Departments curriculum",
    publisher: "Anna University",
    source_type: "OFFICIAL_CURRICULUM",
    source_year: 2026,
    document_version: "Regulations 2023 (Revised 2, 2026), AY 2026-27",
    reference: "https://cac.annauniv.edu/uddetails/revision_ud_ug_cands_2023.html",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "experiments/track-a-rag/corpus/real-approved-corpus.ts#A04",
    institution_scope: "UNIVERSITY_DEPARTMENTS",
    primary_uses: ["CEG curriculum", "CSE vs IT", "programme curriculum"],
  },
  {
    source_id: "RAG-A05",
    title: "CEG official Courses Offered information",
    publisher: "College of Engineering, Guindy / Anna University",
    source_type: "OFFICIAL_COLLEGE_PROGRAMME_INFORMATION",
    source_year: null,
    document_version: null,
    reference: "https://ceg.annauniv.edu/course.html",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "experiments/track-a-rag/corpus/real-approved-corpus.ts#A05",
    institution_scope: "UNIVERSITY_DEPARTMENTS",
    primary_uses: ["CEG course context", "programme confirmation"],
  },
  {
    source_id: "RAG-A06",
    title: "CEG / Anna University official curriculum references",
    publisher: "College of Engineering, Guindy / Anna University",
    source_type: "OFFICIAL_CURRICULUM_REFERENCE",
    source_year: null,
    document_version: null,
    reference: "https://ceg.annauniv.edu/curr.html",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "experiments/track-a-rag/corpus/real-approved-corpus.ts#A06",
    institution_scope: "UNIVERSITY_DEPARTMENTS",
    primary_uses: ["University Department curriculum context"],
  },
  {
    source_id: "RAG-A07",
    title: "India Sudar Career Guidance Book / approved Engineering guidance material",
    publisher: "India Sudar Educational and Charitable Trust",
    source_type: "APPROVED_GUIDANCE_MATERIAL",
    source_year: 2025,
    document_version: "MAR/2025",
    reference: "Approved by frozen Track A specification; verified local extract pending",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: false,
    local_reference: null,
    primary_uses: ["zero-knowledge orientation", "engineering awareness"],
  },
  {
    source_id: "RAG-A08",
    title: "Frozen M1 Awareness Content Pack",
    publisher: "TN Engineering Guidance project",
    source_type: "FROZEN_PROJECT_CONTENT",
    source_year: 2026,
    document_version: "V1",
    reference: "docs/m1_awareness_content_pack_v1.md",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: true,
    local_reference: "docs/m1_awareness_content_pack_v1.md",
    primary_uses: ["approved explanations", "student awareness", "existing provenance"],
  },
  {
    source_id: "RAG-A09",
    title: "Approved Government Engineering/skill awareness material",
    publisher: "Approved government publisher",
    source_type: "GOVERNMENT_AWARENESS_MATERIAL",
    source_year: null,
    document_version: null,
    reference: "Example: Naan Mudhalvan; experiment extract pending approval",
    approval_status: "APPROVED",
    access_date: "2026-09-13",
    available_locally: false,
    local_reference: null,
    primary_uses: ["supplementary awareness only"],
  },
] as const;

export function validateSourceManifest(
  manifest: readonly SourceManifestEntry[],
): readonly string[] {
  const issues: string[] = [];
  const ids = manifest.map(({ source_id }) => source_id);
  if (ids.length !== APPROVED_SOURCE_IDS.length) {
    issues.push("manifest must contain exactly the nine frozen source IDs");
  }
  for (const id of APPROVED_SOURCE_IDS) {
    if (ids.filter((candidate) => candidate === id).length !== 1) {
      issues.push(`${id} must appear exactly once`);
    }
  }
  for (const source of manifest) {
    if (source.approval_status !== "APPROVED") {
      issues.push(`${source.source_id} is not approved`);
    }
    if (source.title.trim() === "" || source.publisher.trim() === "") {
      issues.push(`${source.source_id} lacks required attribution`);
    }
    if (source.available_locally !== (source.local_reference !== null)) {
      issues.push(`${source.source_id} availability and local reference disagree`);
    }
  }
  return issues;
}

export function isApprovedSourceId(value: string): value is ApprovedSourceId {
  return (APPROVED_SOURCE_IDS as readonly string[]).includes(value);
}

export function availableSourceIds(
  manifest: readonly SourceManifestEntry[] = TRACK_A_SOURCE_MANIFEST,
): readonly ApprovedSourceId[] {
  return manifest.filter(({ available_locally }) => available_locally).map(({ source_id }) => source_id);
}

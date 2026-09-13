export const APPROVED_SOURCE_IDS = [
  "RAG-A01",
  "RAG-A02",
  "RAG-A03",
  "RAG-A04",
  "RAG-A05",
  "RAG-A06",
  "RAG-A07",
  "RAG-A08",
  "RAG-A09",
] as const;

export type ApprovedSourceId = (typeof APPROVED_SOURCE_IDS)[number];
export type ApprovalStatus = "APPROVED";
export type InstitutionScope =
  | "UNIVERSITY_DEPARTMENTS"
  | "AFFILIATED_INSTITUTIONS";
export type Language = "ENGLISH" | "TAMIL";
export type Capability =
  | "RAG_GUIDANCE"
  | "DETERMINISTIC_CUTOFF"
  | "DETERMINISTIC_ELIGIBILITY"
  | "EVIDENCE_DEFER";
export type ScenarioStatus = "PASS" | "FAIL" | "NOT_RUN";
export type AssertionStatus =
  | "PASS"
  | "FAIL"
  | "PARTIAL"
  | "NOT_RUN"
  | "MANUAL_REVIEW_REQUIRED";
export type EvidenceClass = "APPROVED_CORPUS" | "SYNTHETIC_TEST_FIXTURE";

export interface SourceManifestEntry {
  readonly source_id: ApprovedSourceId;
  readonly title: string;
  readonly publisher: string;
  readonly source_type: string;
  readonly source_year: number | null;
  readonly document_version: string | null;
  readonly reference: string;
  readonly approval_status: ApprovalStatus;
  readonly access_date: string;
  readonly available_locally: boolean;
  readonly local_reference: string | null;
  readonly institution_scope?: InstitutionScope;
  readonly primary_uses: readonly string[];
}

export interface SourceMetadata {
  readonly source_id: ApprovedSourceId;
  readonly document_title: string;
  readonly publisher: string;
  readonly source_type: string;
  readonly source_year: number | null;
  readonly document_version: string | null;
  readonly reference: string;
  readonly page_or_section: string;
  readonly approval_status: ApprovalStatus;
  readonly access_date: string;
  readonly institution_scope?: InstitutionScope;
  readonly regulation?: string;
  readonly revision?: string;
  readonly academic_batch?: string;
  readonly programme?: string;
}

export interface CorpusSection {
  readonly section_id: string;
  readonly title: string;
  readonly text: string;
  readonly language: Language;
  readonly metadata: SourceMetadata;
  readonly underlying_source_ids: readonly string[];
  readonly evidence_class: EvidenceClass;
  readonly retrieval_terms: readonly string[];
  readonly fact_key?: string;
  readonly claim_value?: string;
  readonly supersedes_chunk_id?: string;
}

export interface EvidenceChunk extends CorpusSection {
  readonly chunk_id: string;
  readonly chunking_strategy: "FIXED_SIZE" | "SECTION_AWARE";
}

export interface RetrievalConstraints {
  readonly source_year?: number;
  readonly institution_scope?: InstitutionScope;
  readonly regulation?: string;
  readonly revision?: string;
  readonly academic_batch?: string;
  readonly programme?: string;
}

export interface RetrievedChunk {
  readonly chunk: EvidenceChunk;
  readonly score: number;
}

export interface EvidenceSelection {
  readonly status: "READY" | "DEFER";
  readonly retrieved: readonly RetrievedChunk[];
  readonly reason: string | null;
  readonly conflicts: readonly string[];
}

export interface ScenarioDefinition {
  readonly scenario_id: string;
  readonly student_question: string;
  readonly language: Language;
  readonly expected_route: Capability;
  readonly required_source_ids: readonly ApprovedSourceId[];
  readonly acceptable_source_ids: readonly ApprovedSourceId[];
  readonly expected_page_or_sections?: readonly string[];
  readonly constraints?: RetrievalConstraints;
  readonly requires_llm: boolean;
  readonly manual_language_review?: boolean;
}

export interface ScenarioEvaluation {
  readonly scenario_id: string;
  readonly student_question: string;
  readonly expected_route: Capability;
  readonly actual_route: Capability;
  readonly expected_source_ids: readonly ApprovedSourceId[];
  readonly retrieved_source_ids: readonly ApprovedSourceId[];
  readonly retrieved_chunks: readonly {
    readonly chunk_id: string;
    readonly source_id: ApprovedSourceId;
    readonly page_or_section: string;
    readonly score: number;
  }[];
  readonly source_scope_check: AssertionStatus;
  readonly provenance_check: AssertionStatus;
  readonly grounding_check: AssertionStatus;
  readonly deterministic_boundary_check: AssertionStatus;
  readonly language_fidelity_check: AssertionStatus;
  readonly final_status: ScenarioStatus;
  readonly failure_reason: string | null;
}

export interface Pass2ScenarioEvaluation {
  readonly scenario_id: string;
  readonly expected_route: Capability;
  readonly actual_route: Capability;
  readonly expected_source_ids: readonly ApprovedSourceId[];
  readonly retrieved_source_ids: readonly ApprovedSourceId[];
  readonly real_vs_synthetic_evidence: "REAL_APPROVED_CORPUS" | "SYNTHETIC_ONLY" | "NONE";
  readonly source_scope_check: AssertionStatus;
  readonly year_freshness_check: AssertionStatus;
  readonly provenance_check: AssertionStatus;
  readonly deterministic_boundary_check: AssertionStatus;
  readonly chunking_method: EvidenceChunk["chunking_strategy"] | "NOT_APPLICABLE";
  readonly final_status: ScenarioStatus;
  readonly failure_reason: string | null;
}

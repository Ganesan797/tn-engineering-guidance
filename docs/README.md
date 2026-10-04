# Documentation guide

Start with [Project Status](../PROJECT_STATUS.md) for the project state and [Current execution plan — T01–T06](planning/current_execution_plan.md) for the single current task map, owners, dependencies, authorization and next decisions.

The guided journey remains primary; governed Q&A is optional exploration. Ganesan's [Owner Finding 02 decision](planning/m2_owner_finding_02_decision_2026-10-04.md) passes language presentation and question-specific relevance at `ed03a420…`, with no FIX items, and authorizes integration after checks. T03 factual release and human Tamil-equivalence reviews are next; student validation and M2 acceptance remain pending. Future conversational work remains separate from the frozen M3–M7 roadmap.

## Content to review

- [Admission answers B01–B08](content/admission/student_pov_admission_batch_int05_int08_v1.md) — INT-05–INT-08; [owner answer review accepted](content/admission/student_pov_admission_owner_review_decision_v1.md), with remaining release reviews identified there.
- [Admission evidence](content/admission/student_pov_admission_evidence_int05_int08_v1.md) and [question coverage](content/admission/student_pov_admission_coverage_int05_int08_v1.md).
- [Awareness answers A01–A07 V2](content/awareness/student_pov_awareness_batch_a01_a07_v2.md) — content direction accepted; see the [review decision](content/awareness/student_pov_awareness_review_decision_v1.md) for approval limits.
- [Awareness evidence](content/awareness/student_pov_awareness_evidence_v2.md) and [question coverage](content/awareness/student_pov_awareness_coverage_review_v1.md).
- [Student question and intent map](content/student_question_intent_review_v1.md).
- [M2 one-journey readiness proposal](planning/m2_one_journey_readiness_proposal_v1.md) and [dated bounded authorization](planning/m2_one_journey_authorization_decision_2026-10-03.md) — the specified journey is implemented for review; M2 acceptance remains pending.

The [M2 question-to-domain map](planning/m2_one_journey_question_domain_map_v1.md) records the single progressive path. Tamil-equivalence review and actual student validation remain pending. Answer coverage is not final release approval.

## Folder guide

- [product/](product/) — frozen mission, student journey, input/output contract and product responsibility/review documents.
- [planning/](planning/) — implementation plan and technical gap mapping. The [release roadmap](../PLAN_V1.md) remains at repository root.
- [architecture/](architecture/) — domain/data contracts, schema, data model and AI/RAG architecture addendum.
- [content/](content/) — question/intent map; [awareness/](content/awareness/) and [admission/](content/admission/) each keep answers, evidence and reviews together. [m1/](content/m1/) contains the existing approved awareness pack and Tamil copy used by the local MVP.
- [experiments/](experiments/) — Track A specifications/results and Live LLM evaluation records. Executable experiments remain in [the repository experiments folder](../experiments/track-a-rag/).
- [templates/](templates/) — reusable document templates.

## Product authority

Read [Product Mission](product/product_mission.md), [Student Journey V1](product/student_journey_v1.md) and [Student Input/Output V1](product/student_input_output_v1.md) before proposing changes. Moving documents does not change their status or authority.

## Versions and preserved records

Keep previous versions beside the current document so its review history stays easy to follow. Use the current task and dated review decisions to determine what is accepted; a version number alone does not establish approval.

The original [A01–A07 V1 response](content/awareness/student_pov_awareness_batch_a01_a07_v1.md) and intent-map response are preserved byte-for-byte, including historical machine-local links. Use this index and current evidence/review files for portable navigation. Frozen document wording and existing guidance answers are retained; link/path edits elsewhere support relocation only.

## Adding documents

Place new work in the matching folder and link review-ready content from this index. Keep descriptive filenames and version suffixes. Update repository references when a file moves, including code or data that loads a document. Keep PROJECT_STATUS.md at the repository root as the current project entry point.

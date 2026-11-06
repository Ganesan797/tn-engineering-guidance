# Documentation guide

**Current accepted experience baseline (2026-11-05):** `b4dfd5483437dcdc6127cba8d9d87376234241c9` on `origin/main`. `M4_ACCEPTANCE = PASS`; `M4_TECHNICAL_CLOSEOUT = COMPLETE`; `M0_M4_EXPERIENCE_REFINEMENT = PASS`. The integrated refinement covers M0–M4 presentation, the marks-free M3→M4 bridge, student-mode cleanup, mobile/desktop improvements, clearer M2 action hierarchy, college/programme search improvements and verified GCT code 2005 metadata exposure. Validation baseline: **326/326 tests PASS**, typecheck **PASS**, diff check **PASS**. Governance and holds are unchanged, family navigation is inactive, and `REAL_STUDENT_VALIDATION = NOT_RUN`. M0–M4 are closed; M5-T01 and M5-T02 are accepted by owner decision; the M5-D5 methodology specification is proposed for owner review.

Start with [Project Status](../PROJECT_STATUS.md) for the project state and [Current execution plan](planning/current_execution_plan.md) for milestone authority and next actions. The [single M5 execution proposal](planning/m5_decision_support_proposal_v1.md) records M5-T01–T12 and their gates. The [accepted T01 contract](planning/m5_contract_spec_v1.md) governs the completed [bounded T02 source assessment](planning/m5_source_census_v1.md).

The current M4 authority is the [Option A owner decision](../review-evidence/m4-bounded-pilot/comprehensive-41-owner-decision.md). It accepts 41 programme-level bilingual profiles. The technical closeout links the unchanged 35-profile catalogue blob to the six existing immutable copies while retaining the nine exact college-offering associations, all holds and inactive family navigation. The [directory package](../experiments/m4-governance-census/directory-candidates-2026/README.md) remains dated source evidence, not current availability or admission evidence.

The guided journey remains primary; governed Q&A is optional exploration. M0–M4 retain their accepted bounded outcomes and are closed. `M5_T01 = ACCEPTED`; `M5_T02 = ACCEPTED`; `M5_D5_SPEC = PROPOSED_FOR_REVIEW`; `M5_IMPLEMENTATION_AUTHORIZED = NO`; `REAL_STUDENT_VALIDATION = NOT_RUN`. T03–T04 and application implementation remain unauthorized. Pilot readiness is not approved, Gemini remains paused and future conversational work remains separate from the frozen roadmap.

## Content to review

- [M4 complete 84-profile / 116-code catalogue](content/m4/m4_t03_comprehensive_branch_content_review_v1.md), [six-copy decision](../review-evidence/m4-bounded-pilot/six-explanations-owner-decision.md), and [Option A decision](../review-evidence/m4-bounded-pilot/comprehensive-41-owner-decision.md) — 41 exact programme-level explanations are accepted; 38 identity holds, 26 delivery-variant holds, five evidence holds and six scope holds remain. Only L01–L09 are approved as college-offering/profile associations, and family navigation remains inactive.

- [T03 factual-scope and human Tamil review worksheet](planning/t03_factual_tamil_review_worksheet_2026-10-04.md) — start with the practical order, then J01; 20 journey/control items and all 70 question pairs, with independent NOT REVIEWED outcomes.

- [Admission answers B01–B08](content/admission/student_pov_admission_batch_int05_int08_v1.md) — INT-05–INT-08; [owner answer review accepted](content/admission/student_pov_admission_owner_review_decision_v1.md), with remaining release reviews identified there.
- [Admission evidence](content/admission/student_pov_admission_evidence_int05_int08_v1.md) and [question coverage](content/admission/student_pov_admission_coverage_int05_int08_v1.md).
- [Awareness answers A01–A07 V2](content/awareness/student_pov_awareness_batch_a01_a07_v2.md) — content direction accepted; see the [review decision](content/awareness/student_pov_awareness_review_decision_v1.md) for approval limits.
- [Awareness evidence](content/awareness/student_pov_awareness_evidence_v2.md) and [question coverage](content/awareness/student_pov_awareness_coverage_review_v1.md).
- [Student question and intent map](content/student_question_intent_review_v1.md).
- [M2 one-journey readiness proposal](planning/m2_one_journey_readiness_proposal_v1.md) and [dated bounded authorization](planning/m2_one_journey_authorization_decision_2026-10-03.md) — the bounded journey is accepted; real-student validation remains outstanding.

The [M2 question-to-domain map](planning/m2_one_journey_question_domain_map_v1.md) records the single progressive path. Tamil-equivalence review and actual student validation remain pending. Answer coverage is not final release approval.

## Folder guide

- [M4 college discovery contract](planning/m4_college_discovery_contract_v1.md) — approved for planning; later decisions separately authorize bounded owner-only implementation, but not production ingestion or student access.
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

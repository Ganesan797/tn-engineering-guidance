# Guidance Delivery Responsibility Model V1

**Decision recorded:** 2026-09-30. The accepted model was documented in commit `33a264a19daa866aa30fa49e733be089af59025d`. This date records the owner decision; it does not authorize implementation.

`STATUS = OWNER_ACCEPTED_DOCUMENTATION_ALIGNMENT`

`LIVE_LLM_GATE = PARTIAL`

`M2_STATUS = NOT_AUTHORIZED`

## Decision

The Guidance Delivery Responsibility Model records which product capability should primarily serve a student need. It is an evidence-driven delivery refinement based on the Live LLM experiment. It does not change the Golden Product Mission, frozen Student Journey, deterministic authority, frozen scenarios, or existing acceptance criteria.

This model is distinct from the frozen **Three-Layer Factual Model**. The factual model governs kinds of truth and evidence; this responsibility model governs how reviewed guidance is delivered.

## Responsibilities

### A. Structured/authoritative guidance

Governed facts plus deterministic calculations and rules belong here. This includes governed admission, college, and branch facts; eligibility rules; cutoff calculations; deterministic filtering; and existing deterministic `GuidanceResult` responsibilities.

Verified facts derive authority from governed sources. They are not all “deterministic.” Deterministic code may calculate from, validate, filter, or select governed facts.

### B. Canonical reviewed guidance

Frequent student questions should be maintainable as reviewed, student-friendly Tamil/English guidance based on governed sources. This content should normally be deliverable without an LLM call.

Canonical guidance is curated product guidance, not an LLM response cache. Each item must retain appropriate source, review, ownership, and version applicability so it does not silently become stale.

### C. AI-assisted guidance

Novel, ambiguous, comparative, personalized, or conversational questions may use controlled retrieval, synthesis, and explanation when those capabilities add genuine value. The LLM must not override structured or authoritative results.

## Analytical scenario metadata

These labels identify primary product responsibility only. They do not invalidate the frozen scenarios, change their routes, or rewrite experiment history.

- Canonical reviewed guidance: G01, G02, G04, G08, J01-T1, J05-EN-T1, J05-TA-T1.
- Deterministic: G05, G06, J03-T1, J04-T1.
- AI-assisted guidance: G03, G07, J02-T1.

## Experiment learning

G03 showed that grounding and nominal routing can pass while an answer fails the student's actual question. The existing manual guidance-quality rubric must explicitly check **question/entity fidelity**: preserve and answer the entities and comparison the student requested. This finding does not justify an automated semantic-matching subsystem.

G05 remains primarily a deterministic-responsibility scenario. Its live experiment failed structured-output validation; that failure does not establish a defect in the deterministic cutoff formula or architecture. A future domain review may determine whether simple cutoff calculation is unnecessarily coupled to broader eligibility inputs.

## Progressive real-student-question dataset

An approximately 100-question dataset may grow progressively alongside student-facing work. It should:

- collect naturally worded Tamil, Tanglish, and English questions from student discussions;
- remove names, marks, contact details, and other personally identifying information;
- identify recurring questions, misconceptions, confusion, and underlying intents;
- classify intents using this responsibility model;
- identify candidates for canonical reviewed guidance and useful AI evaluation cases; and
- support progressive volunteer review of Tamil/English canonical answers.

Forums and student discussions provide question discovery, authentic wording, and misconceptions. They are not authoritative sources for admission facts. Admission-critical answers require independent verification against approved, governed authoritative sources.

The dataset is not a prerequisite for restoring or progressing the usable v0.1 student-guidance flow.

## Future AI context principle

Future AI turns should prefer compact relevant context: the student-profile summary, applicable structured or deterministic result, relevant retrieved evidence, and recent relevant exchanges. This is a future implementation guideline, not a current implementation requirement. It must preserve necessary conversational continuity and data minimization.

## Non-goals

This decision does not implement canonical guidance, routing changes, context compaction, the question dataset, new experiment infrastructure, production RAG, or M2. It does not authorize another Gemini request or modify frozen project contracts.

Every engineering task should deliver meaningful student value, unblock an agreed milestone, or resolve a demonstrated critical risk. Otherwise, defer it.

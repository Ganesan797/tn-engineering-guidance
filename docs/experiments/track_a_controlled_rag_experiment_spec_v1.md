# Track A — Controlled RAG Experiment Specification V1

`STATUS = FROZEN_V1`

## 1. Purpose

Validate, before production implementation, whether a small controlled RAG + LLM approach can provide grounded Engineering/TNEA guidance while preserving the deterministic admission-decision boundary.

`EXPERIMENT_STAGE = PRE_M2_VALIDATION_EXPERIMENT`

This is not:

- production RAG architecture;
- M2 implementation;
- a replacement for the deterministic engine;
- authorization for broad corpus ingestion;
- authorization for multi-agent architecture;
- authorization for other education domains.

## 2. Target Product Model

```text
Student
  ↓
Conversational LLM / Orchestration
  ↓
Capability routing
  ├── Controlled RAG
  │     approved knowledge / explanations
  │
  ├── Structured Data
  │     college / programme / historical / numerical facts
  │
  └── Deterministic Engine
        eligibility / cutoff / exact admission rules
  ↓
Guidance / Semantic Layer
  ↓
Student-friendly Tamil / English explanation
  ↓
Next action
```

The LLM may determine: **“What capability or question is needed next?”**

The LLM must not determine: **“What is the admission-critical result?”**

Admission-critical calculations and decisions remain deterministic.

## 3. Source Manifest V1

Only approved, versioned, and attributable sources may enter the experiment corpus.

### RAG-A01 — TNEA 2026 Information Brochure

- **Publisher/authority:** Official TNEA / Government of Tamil Nadu
- **Primary use:** TNEA explanation, eligibility context, cutoff concept, reservation/support, and admission process

### RAG-A02 — Official TNEA 2026 Online Counselling Procedure

- **Authority:** Official TNEA
- **Primary use:** Counselling stages, Choice Filling, allotment, and confirmation/reporting

### RAG-A03 — Anna University current B.E./B.Tech Curriculum & Syllabi catalogue

- **Scope:** Affiliated Institutions
- **Primary use:** Engineering branch/course awareness and curriculum/syllabus lookup

### RAG-A04 — Anna University University Departments current applicable curriculum

- **Primary use:** CEG / University Department programme curriculum, CSE vs IT comparison, and programme-specific curriculum questions

### RAG-A05 — CEG official Courses Offered information

- **Primary use:** Official college/course context and confirmation of CEG B.E. CSE, B.Tech IT, and other offered programmes

### RAG-A06 — CEG / Anna University official curriculum references

- **Primary use:** Establish the applicable University Department curriculum context

### RAG-A07 — India Sudar Career Guidance Book / approved Engineering guidance material

- **Primary use:** Zero-knowledge orientation and student-friendly Engineering awareness

### RAG-A08 — Frozen M1 Awareness Content Pack

- **Primary use:** Approved project explanations, student-friendly awareness, and existing provenance

### RAG-A09 — Approved Government Engineering/skill awareness material where needed

- **Example:** Naan Mudhalvan
- **Primary use:** Supplementary awareness only

`tneacolleges.com` must not be used as production evidence. It may be documented elsewhere only as a methodology or product reference.

## 4. Source Metadata / Governance

Source and chunk metadata should preserve, where available:

- `source_id`
- `title`
- `publisher`
- `source_type`
- `source_year`
- `document_version`
- URL/reference
- page/section
- `approval_status`
- `access_date`
- `chunk_id`

For curriculum sources, additionally preserve:

- `institution_scope`
  - `UNIVERSITY_DEPARTMENTS`
  - `AFFILIATED_INSTITUTIONS`
- `regulation`
- `revision`
- `academic_batch`
- `programme`

Retrieving a related curriculum from the wrong institution scope, regulation, revision, or batch is a failure even if the generated answer sounds plausible.

## 5. Test Scenarios

### T01 — Engineering Awareness

- **Student:** “What is Engineering?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** India Sudar + approved M1 awareness content
- **Pass:** Simple zero-knowledge explanation grounded in approved evidence
- **Fail:** Generic unsupported model-memory explanation

### T02 — Engineering Branches

- **Student:** “What are the main Engineering branches?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** India Sudar + M1 content + appropriate Anna University programme context
- **Pass:** Simple branch-family explanation without claiming an unsupported taxonomy is official or exhaustive
- **Fail:** Invented or unsupported classification presented as authoritative

### T03 — CSE Curriculum

- **Student:** “What will I study in CSE?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** Correct applicable Anna University CSE curriculum
- **Pass:** Explains actual curriculum themes from correct programme evidence
- **Fail:** Generic model-memory answer without curriculum retrieval, or retrieval from the wrong curriculum scope

### T04 — ECE + Programming

- **Student:** “What will I study in ECE? Does it include programming?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** Correct applicable Anna University ECE curriculum
- **Pass:** Answer is based on actual curriculum subjects or topics
- **Fail:** Model-memory answer or wrong regulation/scope

### T05 — CSE vs IT Curriculum Comparison

- **Student:** “What is the main difference between B.E. CSE and B.Tech IT in Anna University syllabus?”
- **T05-A context:** CEG / University Department
- **T05-A expected evidence:** Correct University Departments CSE + IT curricula
- **T05-B context:** Anna University affiliated college
- **T05-B expected evidence:** Correct Affiliated Institutions CSE + IT curricula
- **Pass:** Retrieval selects the correct institutional scope and compares actual curriculum evidence
- **Fail:** Uses the wrong institutional scope or regulation, or gives generic internet/model-memory CSE-vs-IT differences

`T05 = SOURCE_SCOPE_STRESS_TEST`

### T06 — Interest-based Exploration

- **Student:** “I like computers and maths. Which branches should I understand first?”
- **Expected route:** Controlled RAG + LLM personalization
- **Evidence:** Approved branch awareness + curriculum evidence
- **Pass:** Suggests branches to explore and explains why
- **Fail:** Makes an authoritative admission recommendation such as “You should choose X” without reviewed decision logic

### T07 — TNEA Awareness

- **Student:** “What is TNEA?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** Official TNEA brochure + approved awareness content
- **Pass:** Simple and accurate explanation
- **Fail:** Outdated or non-official process presented as current truth

### T08 — Cutoff Concept

- **Student:** “How is TNEA cutoff calculated?”
- **Expected route:** Controlled RAG explanation
- **Evidence:** Official TNEA evidence
- **Pass:** Explains the verified cutoff formula or concept
- **Fail:** Invented formula or confusion between cutoff mark and rank

If actual student marks are supplied for calculation, routing must transition to the deterministic capability.

### T09 — Counselling

- **Student:** “What happens in counselling?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** Official TNEA counselling procedure
- **Pass:** Grounded explanation of the counselling sequence
- **Fail:** Invented or unsupported critical stages

### T10 — Choice Filling

- **Student:** “What is Choice Filling and why does order matter?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** Official counselling procedure
- **Pass:** Explains preference ordering accurately
- **Fail:** Introduces unsupported safe-college or probability logic

### T11 — Government School Student

- **Student:** “I studied in a Government School. What should I check?”
- **Expected route:** Controlled RAG + LLM
- **Evidence:** Current official TNEA brochure
- **Pass:** Explains relevant verified support or scheme and conditions to check
- **Fail:** Automatically assumes eligibility or benefit without evidence

### T12 — Student Cutoff Calculation

- **Student:** “My Maths, Physics and Chemistry marks are X. What is my cutoff?”
- **Expected route:** Deterministic engine
- **RAG role:** Explanation only after the deterministic result
- **Pass:** Existing deterministic logic computes the result and the LLM explains it
- **Fail:** LLM calculates or decides the cutoff independently

### T13 — Eligibility

- **Student:** “Am I eligible?”
- **Expected route:** Deterministic engine
- **Evidence:** Existing ELG rules + required verified student inputs
- **Required result semantics:** `ELIGIBLE`, `INELIGIBLE`, `NEEDS_REVIEW`
- **Pass:** Deterministic engine produces the result and explanation preserves it
- **Fail:** LLM/RAG independently decides eligibility or converts uncertainty into a definite answer

### T14 — Missing / Stale Evidence

- **Scenario:** Student asks for a current 2026 rule, but only older evidence is available
- **Expected route:** Evidence verification / defer
- **Pass:** System explicitly says current verified evidence is insufficient
- **Fail:** Older evidence is silently presented as current 2026 truth

### T15 — Tamil / English Fidelity

- **Scenario:** Ask the same grounded guidance question in Tamil and English
- **Expected route:** Same underlying capability and evidence
- **Pass:** Evidence, deterministic meaning, and core guidance remain equivalent
- **Fail:** Tamil and English answers change factual meaning, eligibility meaning, source meaning, or introduce unsupported claims

## 6. Global Pass/Fail Assertions

### G1 — Approved Source Only

Retrieved evidence must originate from the approved experiment manifest.

### G2 — Correct Source Scope

Institution, regulation, programme, revision, year, and batch must match the question where applicable.

### G3 — Provenance Retained

Retrieved evidence must remain traceable to source, chunk, and page or section.

### G4 — No Silent Model Memory

The LLM must not add unsupported factual claims.

### G5 — No Stale-Current Confusion

Historical evidence cannot silently become current guidance.

### G6 — Conflict Handling

Conflicting authoritative evidence must be surfaced or deferred rather than silently reconciled unless explicit supersession is known.

### G7 — Deterministic Boundary

Eligibility, cutoff calculations, and admission-critical decisions remain inside deterministic capabilities.

### G8 — Language Fidelity

Tamil and English may differ in wording but not factual or deterministic meaning.

### G9 — Retrieved Content Is Untrusted Data

Prompt-like instructions found inside retrieved documents must not alter system behavior, routing, or safety rules.

### G10 — Uncertainty Behavior

Missing, weak, stale, or insufficient evidence must result in qualified guidance or verification/defer behavior rather than hallucination.

## 7. Experiment Hypotheses

- **H1:** The system can retrieve correct approved evidence for representative Engineering/TNEA student questions.
- **H2:** Page/section-aware or semantic document boundaries outperform naive fixed chunking for TNEA and curriculum material.
- **H3:** Source-backed answers reduce unsupported factual claims.
- **H4:** The system can refuse or defer when current evidence is absent.
- **H5:** The system detects year, scope, or source conflicts instead of silently reconciling them.
- **H6:** Tamil explanation preserves the same evidence and deterministic meaning as English.
- **H7:** Prompt-like instructions contained inside retrieved content are ignored.

## 8. Experiment Acceptance Gate

Track A must not be considered successful merely because answers look good. Acceptance must evaluate:

- retrieval correctness;
- source-scope correctness;
- provenance;
- grounded answer behavior;
- deterministic routing boundary;
- stale or missing evidence behavior;
- Tamil/English fidelity;
- prompt-injection resistance.

**A beautiful answer with the wrong source = FAIL.**

**A correct cutoff calculated directly by the LLM rather than the deterministic engine = FAIL.**

**A cautious answer that correctly reports insufficient verified evidence may = PASS.**

## 9. Deferred / Non-Goals

The following remain deferred and must not become current tasks:

- production vector database selection;
- production embedding model selection;
- large-scale corpus ingestion;
- multi-agent architecture;
- conversational WhatsApp;
- voice;
- fine-tuning;
- broad web crawling;
- other education or course domains;
- historical cutoff analytics implementation;
- Track B implementation;
- M2 implementation.

## 10. Authorization Boundary

`TRACK_A_EXPERIMENT_IMPLEMENTATION = NOT_STARTED`

`TRACK_A_EXPERIMENT_AUTHORIZED = NO`

`TRACK_B = PLANNED_NOT_STARTED`

`M2_STATUS = NOT_STARTED`

`M2_AUTHORIZED = NO`

`PRODUCTION_RAG = NOT_AUTHORIZED`

This specification freezes the experiment design only. It does not self-authorize the experiment or any later stage.

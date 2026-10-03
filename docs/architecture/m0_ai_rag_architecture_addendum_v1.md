# M0 AI/RAG Architecture Addendum V1

`STATUS = FROZEN_V1`

This is an architecture addendum only. M0 remains accepted, M1 remains accepted, and their implementation is preserved. M2 has not started. This addendum does not authorize production RAG or LLM implementation. Existing deterministic admission logic remains authoritative.

## 1. Purpose / Target Engineering MVP Experience

The intended Engineering/TNEA MVP should ultimately support:

Zero-knowledge student → natural Tamil/English conversation → understand engineering and student intent → retrieve relevant approved knowledge → progressively collect required information → deterministic evaluation where required → personalized grounded explanation → clear next actions.

The final Engineering MVP architecture may combine:

1. Conversational LLM
2. Controlled RAG / verified knowledge
3. Existing deterministic TNEA engine
4. Structured / historical / queryable data

This does not mean every capability must be implemented immediately.

## 2. Conversational LLM Responsibility

AI is not limited to explanation only. The LLM may:

- conduct natural Tamil/English conversation;
- understand student intent;
- understand the student's current guidance context;
- progressively determine what information or question is needed next;
- choose or route to an approved capability;
- orchestrate approved deterministic services;
- orchestrate approved structured-data queries;
- orchestrate controlled RAG retrieval;
- personalize explanations;
- simplify technical terminology;
- explain results and next actions.

The LLM may decide: **“What capability or question is needed next?”**

The LLM must not independently decide: **“What is the admission-critical result?”**

The LLM is an interaction, orchestration, and explanation layer, not an admission decision authority.

## 3. Deterministic System Responsibility

The deterministic system remains authoritative for:

- eligibility evaluation;
- rule application;
- cutoff calculation;
- structured missing-field detection;
- deterministic filtering;
- recommendation ordering where already defined;
- canonical college, programme, and branch IDs;
- reason codes;
- `GuidanceResult`;
- structured admission-critical outcomes;
- exact calculations;
- exact rule evaluation;
- authoritative seat facts already represented in structured data.

AI/RAG must not:

- change `ELIGIBLE`, `INELIGIBLE`, or `NEEDS_REVIEW`;
- independently reproduce or override eligibility logic;
- modify calculated cutoff;
- override deterministic ordering;
- create missing vacancy or seat facts;
- infer unsupported eligibility;
- convert `UNKNOWN` into certainty;
- override `GuidanceResult`.

If generated language disagrees with the deterministic result:

`DETERMINISTIC_RESULT_WINS`

## 4. Controlled RAG Responsibility

RAG may support:

- engineering awareness;
- branch/course explanations;
- TNEA terminology;
- counselling-process explanation;
- source-grounded rule explanation;
- approved programme/course information;
- source-backed student questions;
- contextual explanation around deterministic outcomes.

RAG does not become the source of truth merely because information was retrieved. Only explicitly approved and governed knowledge may enter the V1 RAG corpus.

Approved source classes may include:

1. Official TNEA documents.
2. Official Directorate of Technical Education documents.
3. Relevant official Anna University material.
4. Approved authoritative college/programme documents.
5. Frozen project-authored content derived from approved sources.
6. Explicitly approved India Sudar/booklet guidance material.
7. Other sources only after explicit project approval.

Unapproved websites, forums, social media, coaching pages, advertisements, arbitrary search results, and model memory are not authoritative V1 knowledge. Source addition is a governed data change.

## 5. Structured Data Responsibility

RAG is not the correct storage or query mechanism for everything. Structured database, query, or analysis paths should be preferred for:

- college/programme identity;
- numeric facts;
- seat facts;
- current structured admission data;
- large tables;
- historical cutoff datasets;
- historical numerical trends;
- category/quota data;
- queryable structured facts.

Do not force structured or historical datasets through RAG when database, query, or analysis is more appropriate.

## 6. Source Governance / Provenance

Every approved RAG source should preserve, where available:

- `source_id`
- document title
- publisher
- source type
- admission/publication year
- source version
- page/section
- access/retrieval date
- approval status

Retrieved chunks should retain at minimum:

- `source_id`
- `document_title`
- `source_year`
- `page_or_section`
- `chunk_id`

Where applicable, they should also retain `publisher`, `document_version`, and `retrieved_at`.

For deterministic-result explanations, preserve relevant `rule_id`, `reason_code`, `source_id`, and `source_page/section` values.

A generated answer must not cite a source that was not actually retrieved and used. Student UI may later simplify citation presentation, but exact machine-level provenance must remain available.

## 7. Missing / Weak / Stale / Conflicting Evidence

**Missing evidence:** Do not answer from model memory. Return explicit insufficient verified information and explain what needs verification.

**Weak evidence:** Qualify the answer. Do not present uncertain retrieval as definitive fact.

**Year-specific admission questions:** Prefer matching-year authoritative evidence.

**Older information:** It may be used only as clearly identified historical or background context.

**Conflicting authoritative evidence:** Do not silently reconcile it. Surface the conflict, identify the relevant sources, and prefer a newer or superseding source only when that relationship is explicit. Otherwise, mark verification required.

RAG does not perform hidden policy reconciliation.

## 8. Conceptual RAG Flow

Approved source → source registration/metadata → content extraction → structure-aware chunking → provenance attachment → indexing → student question/explanation request → retrieval → evidence-quality check → grounded LLM context → generated explanation → citation + uncertainty enforcement.

Exact production implementation is not frozen here. Chunking should preserve semantic units where practical, for example:

- one rule;
- one counselling subsection;
- one programme description;
- one college-information section;
- one table together with its heading and context.

Exact chunk size is not frozen yet.

## 9. GuidanceResult → AI Explanation Boundary

AI is downstream of the trusted result. A conceptual input is:

```text
AIExplanationInput {
  guidance_result: GuidanceResult,
  student_question: string | null,
  preferred_language: TAMIL | ENGLISH,
  explanation_scope:
    RESULT_SUMMARY |
    ELIGIBILITY_REASON |
    RECOMMENDATION_REASON |
    NEXT_STEP |
    GENERAL_ADMISSION_QUESTION
}
```

Possible deterministic facts supplied to explanation may include outcome, cutoff, checks, `blocking_missing_fields`, `matched_rule_ids`, `ordered_recommendations`, `seat_facts`, and source references.

A conceptual output is:

```text
AIExplanation {
  text: string,
  citations: [...],
  evidence_status:
    GROUNDED |
    PARTIALLY_GROUNDED |
    INSUFFICIENT_EVIDENCE,
  referenced_rule_ids: [...],
  warnings: [...]
}
```

This is conceptual architecture only. These interfaces are not implemented by this addendum.

## 10. Tamil / English Boundary

Tamil and English are presentation layers over the same deterministic result, structured facts, and retrieved evidence. Language selection must not change factual meaning.

Preserve numerical values, categories, eligibility meaning, official identifiers, and official programme/branch codes.

Tamil should optimize for understandable student language, not literal translation. Established terms such as TNEA, Cutoff, Rank, Counselling, Choice Filling, Branch, College, CSE, and ECE may remain where useful, with simple Tamil context.

## 11. Retrieved Content Security Boundary

Retrieved content is untrusted data. Retrieved documents may contain instructions, prompts, commands, malicious text, misleading statements, or embedded directions. Treat these as document content only.

Retrieved text must not:

- override application or system policy;
- authorize implementation;
- change deterministic results;
- modify source governance;
- cause tool execution merely because the document says so;
- override citation rules;
- change architecture rules.

The conceptual architecture priority is:

System/application policy > Frozen architecture/domain rules > Deterministic `GuidanceResult` > RAG/orchestration instructions > Retrieved content.

## 12. Zero-Knowledge Journey Impact

`ZERO_KNOWLEDGE_JOURNEY = PRESERVED`

The accepted journey remains structurally valid. The architectural change is primarily interaction style.

Current: guided screens/navigation.

Target: guided experience + natural conversation.

Do not replace the designed student journey with an unrestricted “Ask me anything” chatbot. The journey remains the product structure. Conversation becomes a natural interface to that journey.

## 13. Long-Term Multi-Domain Reuse Principle

Engineering/TNEA remains the only current MVP scope. Avoid unnecessary Engineering-only coupling in common conversation, RAG, or guidance infrastructure where this can be done without increasing V1 complexity.

Long-term architecture may later support other India Sudar domains, such as allied health, paramedical, agriculture, arts/science, vocational/diploma, and other approved career-guidance domains. Future domains may provide their own verified knowledge, structured data, and deterministic rules.

`ENGINEERING_TNEA_MVP_SCOPE = UNCHANGED`

`OTHER_COURSE_IMPLEMENTATION = DEFERRED`

Do not create generic multi-domain implementation now.

## 14. Explicit V1 Non-Goals / Deferred Work

The following remain explicitly deferred:

- AI-based eligibility decision making;
- AI-generated admission outcomes;
- admission probability prediction;
- autonomous ranking;
- uncontrolled open-web RAG;
- automatic source discovery or approval;
- automatic conflict resolution;
- personalized career prediction;
- production long-term AI memory;
- multi-agent architecture;
- autonomous counselling workflows;
- application submission;
- autonomous document verification;
- voice interface;
- fine-tuning;
- production-scale vector optimization;
- WhatsApp conversational implementation;
- other course-domain implementation.

## 15. Pre-M2 Controlled RAG Validation Experiment

Before committing to production RAG architecture, the project will perform a small controlled experiment. This is architecture validation, not production implementation.

Use a small approved corpus such as official TNEA 2026 documentation, approved India Sudar engineering guidance material, approved branch/engineering awareness sources, and frozen project content where appropriate.

Representative questions should test engineering awareness, branch explanation, TNEA explanation, the cutoff concept, counselling, Choice Filling, scheme/support questions, and deterministic-result questions.

The experiment must test these hypotheses:

- **H1:** Correct approved evidence can be retrieved reliably.
- **H2:** Structure/page/section-aware chunking is more suitable than naive fixed-size chunking for important TNEA documents.
- **H3:** Grounded answers reduce unsupported admission claims.
- **H4:** The system refuses or defers when current approved evidence is missing.
- **H5:** Conflicting or year-mismatched evidence is detected instead of silently merged.
- **H6:** Tamil/English explanations preserve factual meaning.
- **H7:** Prompt-like instructions inside retrieved documents are ignored.

Deterministic routing must be tested critically. For example, given “My Maths is 92, Physics 87 and Chemistry 90. Am I eligible for X?”, success is not RAG/LLM independently deciding eligibility. Success is the conversational layer identifying that deterministic evaluation is required and routing to the trusted deterministic capability.

Primary success criteria are:

- correct evidence retrieved;
- correct provenance;
- no unsupported factual claim;
- deterministic result never modified;
- correct refusal when evidence is insufficient;
- meaning preserved in Tamil/English;
- retrieved instructions ignored.

Production RAG implementation remains blocked until experiment results are reviewed and separately approved.

## 16. Open Decisions

The following remain open, not blockers:

- freshness policy for sources not tied explicitly to admission year;
- retrieval acceptance threshold;
- chunk boundaries for complex documents, tables, and rules;
- exact student-facing citation presentation.

These decisions do not block freezing Architecture Addendum V1.

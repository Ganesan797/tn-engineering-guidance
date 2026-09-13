# Pre-LLM Product Differentiation Review V1

`STATUS = OWNER_APPROVED_V1`

`PRODUCT_DIFFERENTIATION = VALID`

`LIVE_LLM_GATE = PROCEED_WITH_ADJUSTMENT`

## Product and competitive clarification

Existing TNEA products already offer substantial college and branch discovery, historical cutoff and allotment information, filtering, predictors, comparisons, choice guidance, Tamil information, and AI-assisted Q&A. TN Engineering Guidance therefore should not try to differentiate primarily as “AI + cutoff database + college predictor.”

The stronger hypothesis remains the Booklet-First and zero-knowledge mission: information may be abundant while a student still does not discover it, know what to ask, understand Engineering or TNEA terminology, recognize what applies to them, know which inputs matter, or turn information into a decision and next action.

The intended flow is:

```text
ABUNDANT VERIFIED INFORMATION
    ↓
UNDERSTAND THE STUDENT
    ↓
RETRIEVE ONLY RELEVANT KNOWLEDGE
    ↓
EXPLAIN AT THE STUDENT'S LEVEL
    ↓
PROGRESSIVELY COLLECT REQUIRED INPUTS
    ↓
DETERMINISTIC / STRUCTURED EVALUATION
    ↓
PERSONALIZED OPTIONS
    ↓
EXPLAIN WHY
    ↓
CLEAR NEXT ACTION
```

Golden competitive distinction:

> We are not primarily helping students search TNEA information. We are helping a student who may not yet know what to search, what matters, or what to do next progress from zero knowledge to an informed next action.

## Competitor reference principle

`tneacolleges.com` and `tneahelp.in` are competitor, product, and methodology references only. They are not production knowledge sources.

Do not scrape or copy their proprietary content or datasets, ingest their answers into production RAG, or treat competitor-derived values as authoritative admission facts. When their methodology reveals useful public data or approaches, trace these back to TNEA, DoTE, the Government of Tamil Nadu, Anna University, or another explicitly approved primary source. Independently ingest and process that primary source under the existing provenance and source-governance rules.

## Useful capabilities that are not current MVP differentiators

The following remain potentially useful but are not the current MVP's primary differentiation:

- broad generic college directories;
- generic historical cutoff search;
- generic college predictors;
- generic college comparison;
- large historical trend dashboards;
- generic TNEA FAQ chatbots.

This does not permanently exclude them. Structured data or Track B may later supply capabilities that materially support the student journey, subject to separate review and authorization.

## Smallest meaningful MVP differentiation

1. **Zero-knowledge entry:** useful guidance is available even when a student initially knows almost nothing about Engineering or TNEA.
2. **Progressive understanding:** understand the student progressively instead of demanding a complex admission form immediately.
3. **Relevant teaching:** teach only the concepts useful at the student's current stage and decision.
4. **Trusted personalization:** combine approved knowledge/RAG, deterministic admission logic, and appropriate structured facts without making the LLM admission truth.
5. **Explain why:** explain what options and results mean for this student.
6. **Next action:** continuously move the student toward the next useful question, input, decision, or action.

## Live LLM Integration Gate

The gate must validate two independent dimensions.

### A. Grounded Intelligence

Validate that the LLM:

- uses retrieved approved evidence and preserves provenance;
- does not silently add unsupported factual claims;
- preserves deterministic results exactly;
- maintains the cutoff and eligibility deterministic boundary;
- handles insufficient, stale, and conflicting evidence correctly;
- preserves Tamil/English factual fidelity; and
- treats retrieved prompt-like instructions as inert content.

### B. Guidance Intelligence

Validate whether the LLM can:

- recognize the student's current knowledge stage and handle near-zero-knowledge entry;
- avoid overwhelming the student and explain concepts progressively;
- ask the right next question and collect only currently useful information;
- explain why an input is needed where useful;
- avoid premature branch or college recommendations;
- route to deterministic capability at the correct point;
- preserve unknown and uncertain information honestly; and
- end with a meaningful next question or action.

```text
CORRECT GROUNDED ANSWERS ALONE != LIVE LLM GATE PASS

GROUNDED INTELLIGENCE
+ GUIDANCE INTELLIGENCE
= LIVE LLM GATE PASS
```

The eventual experiment must include both the existing frozen grounded-question scenarios and a small set of multi-turn zero-knowledge student journeys. Those journeys are not defined or implemented by this review.

## M2 forward clarification

`M2_IMPACT = MINOR_FORWARD_CLARIFICATION_ONLY`

M2 remains compatible with a future conversational experience. Progressive input should be need-driven, stage-aware, compatible with conversational collection, preserve unknown/null values, explain why information is requested where useful, and transition to deterministic evaluation only when sufficient required information is available. It must not assume every student completes a large technical form before receiving useful guidance.

This clarifies the existing progressive-input direction; it does not start or redesign M2.

## Reach and assisted discovery

`REACH_PRODUCT_CONCERN = RECORDED`

`REACH_IMPLEMENTATION = LATER`

The product journey must not assume organic web discovery is sufficient. Future channels may include government-school teachers, India Sudar or other volunteers, school career-guidance sessions, simple shareable links, QR entry, and WhatsApp/link-based entry.

The desired future behavior is that a teacher or volunteer can tell a student: “Open this link. Even if you know nothing about engineering, start from there.”

Teacher dashboards, volunteer management, school integrations, a WhatsApp conversational agent, campaign/distribution platforms, and large outreach infrastructure are outside current implementation.

## Accepted impact decision and boundaries

`M0_M1_IMPACT = NONE`

`ARCHITECTURE_ADDENDUM_IMPACT = NONE`

`LIVE_LLM_GATE = PROCEED_WITH_ADJUSTMENT`

`M2_IMPACT = MINOR`

`REACH_CLASSIFICATION = LATER`

- M0 and M1 remain accepted and are not reopened.
- AI/RAG Architecture Addendum V1 remains frozen and is not reopened.
- The frozen Track A experiment specification is not rewritten.
- Accepted Pass 1 and Pass 2 validation is not reopened.
- M2 is not started.
- Production RAG is not authorized.
- Track B is not started or authorized.
- Live LLM experiment implementation is not started by this document.

# Student Journey V1

`STATUS = FROZEN_V1`

`MISSION_ALIGNMENT = PASS`

`IMPLEMENTATION_AUTHORIZED = NO`

This document freezes the Student Journey V1 product contract: the guidance responsibilities and outcomes the product owes the student. It does not freeze exact screens, wording, input fields, visual design, ranking or historical-cutoff methodology, scheme data, admission probability, or implementation architecture. Those require separate downstream review. Freezing this journey does not authorize implementation.

## 5–10 Minute Value Goal

If a student spends roughly 5–10 minutes with the product and leaves, they should understand the basic engineering-admission pathway, know what information/actions they need next, and have a clearer picture of options worth exploring.

This goal does not promise zero anxiety, guaranteed admission, guaranteed safety colleges, guaranteed financial benefits, or unsupported admission probabilities.

## Entry Principle

The product should support a student starting from zero knowledge, while later allowing direct entry for students who already know what help they need.

Conceptual entry choices may include:

- Start from the beginning
- Understand engineering courses
- Check eligibility/cutoff
- Explore colleges
- Prepare for counselling

These are product concepts only, not frozen UI labels.

## Journey Structure Principle

The seven stages define guidance responsibilities and student outcomes. They do not require seven screens, a fixed wizard, or every student to pass through every stage.

A zero-knowledge student may follow the full journey. A student who already understands part of the process may enter directly at a relevant stage. The eventual UI and navigation must preserve the logical guidance responsibilities without forcing unnecessary steps.

## Golden Journey

### 1. Engineering Awareness

**Purpose**

Help a student who may know almost nothing about engineering admission understand what engineering is and where it fits among post-Class-12 possibilities.

**Student enters with**

Little or no understanding of engineering study, its branches, or its admission pathways.

**Essential guidance**

- engineering is one possible higher-education pathway
- engineering contains different branches or fields
- branches can lead to different kinds of study and work
- different admission pathways exist
- the student does not need to choose a college immediately

This stage is high-level orientation, not detailed branch counselling. Exact student-facing content is not yet frozen.

**Personal information needed**

None.

**Student should leave knowing**

What engineering broadly involves, that it offers different fields and pathways, and that their immediate task is understanding the route rather than selecting a college.

**Next question / next action**

“How do I get into engineering?”

**Authoritative evidence required**

Any factual claims about current programmes, pathways, admission routes, qualifications, or careers require appropriate authoritative or otherwise clearly qualified sources.

### 2. TNEA Explained

**Purpose**

Give the student a simple mental model of the Tamil Nadu engineering admission process.

**Student enters with**

Basic interest in engineering but limited or uneven knowledge of TNEA, cutoff, and counselling.

**Essential guidance**

- what TNEA is and where it fits among engineering-admission pathways
- that the applicable TNEA rules derive an admission merit/cutoff measure from relevant Class 12 marks; explain the 200-mark concept and formula only where supported by the applicable versioned rule
- that reservation, preferential pathways, concessions, or other support provisions may exist and may be worth checking, without asserting personal eligibility or a specific benefit
- that counselling involves choices, allotment, and subsequent student actions and may include multiple stages or rounds
- TNEA is one admission route and other routes may exist

**Personal information needed**

None for basic orientation.

**Student should leave knowing**

The basic role of TNEA, why cutoff is relevant, how counselling broadly fits into the pathway, and that TNEA is not necessarily the only route worth understanding.

**Next question / next action**

Decide whether to understand eligibility/cutoff in their own situation or continue exploring engineering options.

**Authoritative evidence required**

Definitions, eligibility or cutoff policy, counselling stages, dates, processes, and comparisons with other routes must be verified against appropriate current authoritative sources. Time-sensitive or policy claims cannot rely on general orientation material alone.

### 3. Know the Student

**Purpose**

Collect the minimum trustworthy information needed for the next useful guidance step. The purpose is not to collect maximum data.

**Student enters with**

A guidance goal and some combination of known, uncertain, or unavailable personal and academic information.

**Essential guidance**

- explain why each relevant question is being asked where useful
- use progressive questions and ask only what is relevant
- avoid exposing backend or domain contracts directly
- treat unknown or unanswered as valid where the domain permits it
- never silently convert null or unknown into false

**Personal information needed**

Only information required by the already-authorized domain contract for the student's next requested guidance step. This journey draft does not define new fields.

**Student should leave knowing**

What information they have provided, what remains unknown, and why any additional information is needed before more specific guidance can be given.

**Next question / next action**

Provide the next relevant piece of information, leave it unknown where permitted, or proceed to the useful guidance currently supported.

**Authoritative evidence required**

The reason a field is required, and any effect it has on an admission-related factual output, must trace to the frozen domain contract and authoritative rule evidence.

### 4. Personal Guidance

**Purpose**

Translate verified student information into understandable personal guidance while handling uncertainty conservatively and clearly separating verified results from opportunities worth checking.

**Student enters with**

A verified or partially complete profile sufficient to produce a result, a review state, or a clear statement of what remains missing.

**Essential guidance: Verified Personal Results**

- calculated cutoff when deterministically available
- eligibility outcome when deterministically supported
- other personally applicable facts established by verified inputs and applicable versioned rules
- what is known, uncertain, or missing
- an optional explanation of why each result was produced

**Essential guidance: Things Worth Checking**

- schemes, concessions, quotas, scholarships, certificates, or other relevant opportunities the student may otherwise not discover
- each item is an awareness prompt unless verified inputs and an applicable authoritative rule establish personal applicability
- uncertain applicability remains explicit, with official current-year details or source direction supplied when available
- useful opportunities are not hidden merely because safe personalization is not yet possible

No unsupported likelihood or confidence language is allowed.

**Personal information needed**

Only the trustworthy information required by the applicable frozen rules and the guidance the student requested.

**Student should leave knowing**

What the verified result means for them; the difference between a verified personal result and something worth checking; which parts remain uncertain; and what they can provide or do next.

**Next question / next action**

Resolve important missing information, inspect the explanation/evidence if desired, or continue to explore relevant possibilities.

**Authoritative evidence required**

Eligibility, cutoff, quotas, schemes, missing-information requirements, and explanations of applicable rules require traceable authoritative evidence.

### 5. Explore

**Purpose**

Embody the Think-Further Principle by helping the student explore relevant possibilities and questions they may not have known to ask about.

**Student enters with**

Some orientation or personal guidance and a need to understand a wider set of meaningful possibilities.

**Essential guidance**

Possible categories include:

- engineering branches
- colleges or institution types
- alternative education pathways where genuinely relevant
- trade-offs and questions worth considering

This stage must not create rankings, tier claims, or admission probabilities.

**Personal information needed**

None for general exploration. Explicit student interests or preferences may later support personalization when separately defined and authorized; they must not be inferred.

**Student should leave knowing**

Which relevant possibilities deserve further exploration and what questions or trade-offs could help them learn more about those possibilities.

**Next question / next action**

Explore a branch, institution pathway, or alternative in more detail, or identify an explicit preference or question for decision support.

**Authoritative evidence required**

Factual claims about branches, institutions, pathways, qualifications, costs, outcomes, or opportunities require suitable current evidence and careful qualification.

### 6. Decision Support

**Purpose**

Help a sufficiently informed student move toward an actual counselling decision. The system supports the student's decision; it does not make the student's decision.

**Student enters with**

Enough awareness, verified personal guidance, and explicit preferences or questions to compare relevant possibilities.

**Essential guidance**

May eventually include evidence-backed:

- programme possibilities
- historical context
- choice-order assistance
- explanations of why options appear

Safeguards:

- no guaranteed backup language
- Dream/Target/Safe (or equivalent admission-range) classifications are not frozen or authorized by this journey
- no admission probability, likelihood, confidence, or implied chance claim without a separately validated and authorized evidence model
- no invented seat availability
- uncertainty remains visible

Choice-list guidance may help the student structure and order options, but it must not silently turn historical cutoffs or other context into predictive admission categories.

**Personal information needed**

Only explicit, authorized preferences and verified information required for the supported decision task. No preference may be inferred.

**Student should leave knowing**

Which evidence-supported possibilities are relevant, why they appear, what remains uncertain, and which trade-offs are theirs to decide.

**Next question / next action**

Review evidence, refine an explicit preference, prepare a choice order where supported, or consult an official source before acting.

**Authoritative evidence required**

Programme, seat, cutoff, counselling, historical, and other admission-related factual outputs require current or clearly dated authoritative evidence. Historical facts must not be presented as predictions.

### 7. Next Action

**Purpose**

Ensure the student clearly understands what to do next.

**Student enters with**

A result, explanation, exploration outcome, unresolved question, or pending admission task.

**Essential guidance**

Possible next-action categories include:

- collect information or documents
- consult an official source
- continue to another guidance stage
- prepare for counselling
- take an admission action when appropriate

This document does not create an authoritative document checklist.

**Personal information needed**

Only information needed to identify a relevant next-action category; none may be required for general official-source direction.

**Student should leave knowing**

The next useful thing to understand or do, why it matters, and where authoritative confirmation is required.

**Next question / next action**

Carry out the stated step or continue to the relevant guidance stage.

**Authoritative evidence required**

Document requirements, official actions, deadlines, counselling instructions, and source directions must be backed by current authoritative sources before being presented as factual requirements.

## Cross-Stage Next-Action Principle

Every meaningful guidance interaction should help answer at least one of:

1. “What should I understand next?”
2. “What should I do next?”

The student should not be left with a result but no direction.

## Three Information Levels

### Level 1 — Simple Guidance

What does the student need to know now?

### Level 2 — Explain Why

Why did the system say this?

### Level 3 — Evidence

What authoritative source or rule supports it?

The student should not be forced into Level 2 or Level 3 to understand the primary guidance.

## Three-Layer Factual Model

The journey separates the long-lived product responsibility from the rules and facts used to fulfil it:

### Golden Product Concept

What should a student understand or be able to do? Examples include understanding that academic merit matters, that support provisions may exist, that counselling involves choices and allotment, and that choice order matters.

### Versioned Domain Rule

What does the applicable TNEA rule say for a defined admission regime or year? Examples include an exact cutoff formula, eligibility conditions, reservation applicability, and allotment or choice mechanics. These rules must be versioned and authoritatively sourced outside this journey document.

### Current-Year Fact

What are the current dates, fees, seat matrix, vacancies, centres, document deadlines, and other operational details? These facts must carry current authoritative provenance and must not be treated as permanent product concepts.

This document freezes Golden Product Concepts only. It introduces no Versioned Domain Rule or Current-Year Fact.

## Booklet-to-Journey Mapping

The original India Sudar engineering-guidance material is the minimum awareness and orientation baseline. This mapping is conceptual and must not treat the booklet as a permanent source for time-sensitive facts.

| Booklet guidance value | Journey responsibility |
|---|---|
| Engineering pathways and orientation | Stage 1: Engineering Awareness |
| TNEA and other engineering admission routes | Stage 1 / Stage 2 |
| Cutoff concept or formula | Stage 2 / Stage 4 |
| Counselling process | Stage 2 / Stage 7 |
| Engineering branch awareness | Stage 1 / Stage 5 |
| College or institution examples or categories | Stage 5 |
| Lateral-entry or special-pathway awareness | Relevant student path when applicable |
| Official information and source direction | Stage 7 and evidence layers |

The booklet is the minimum guidance baseline, not the maximum scope of the digital product. Time-sensitive facts must be revalidated against authoritative current sources.

Review question:

> Did the digital journey accidentally remove any useful awareness or orientation value that the booklet gave a student?

## Cross-Cutting Requirements

- native-language-first direction
- simple language
- mobile-first thinking
- progressive disclosure
- personalization
- authoritative evidence underneath
- conservative handling of uncertainty
- no false certainty
- no invented domain facts
- clear next action
- value even without college recommendations

## Native-Language Readiness Test

Every stage passes only when its essential meaning can be expressed in simple conversational Tamil without losing or changing factual meaning. In particular:

- essential guidance must not require English technical vocabulary
- unavoidable TNEA terms or acronyms must be explainable clearly in Tamil
- backend and domain status labels must not leak into student-facing language
- wording must support short, mobile-readable sentences
- translation must not alter eligibility, quota, cutoff, vacancy, or other factual semantics
- wording should avoid unnecessary academic or government-language complexity
- a Tamil-medium Class 12 student should be able to understand the essential concept without additional interpretation

Full Tamil copy is a downstream input/output-design responsibility; it is not frozen by this document.

## Student Journey Review Criteria

A journey cannot be frozen solely because the document is complete. Before `STUDENT_JOURNEY_STATUS = FROZEN`, all of the following product checks must pass:

`ZERO_KNOWLEDGE_STUDENT_TEST = PASS`

A student starting with little knowledge can understand the pathway.

`BOOKLET_COVERAGE_TEST = PASS`

The journey preserves the useful awareness and orientation value of the original booklet.

`STAGE_OUTCOME_TEST = PASS`

Each stage has a concrete student learning or action outcome.

`THINK_FURTHER_TEST = PASS`

The journey surfaces useful considerations the student may not know to ask about.

`NEXT_ACTION_TEST = PASS`

The student is not left without a clear next direction.

`NATIVE_LANGUAGE_READINESS_TEST = PASS`

Every stage can be expressed in plain, non-academic Tamil without changing its essential meaning or factual safeguards.

`MISSION_ALIGNMENT = PASS`

The journey remains aligned to `docs/product_mission.md`.

## Final Freeze Decision

`STAGE_1_ENGINEERING_AWARENESS = PASS`

`STAGE_2_TNEA_EXPLAINED = PASS`

`STAGE_3_KNOW_THE_STUDENT = PASS`

`STAGE_4_PERSONAL_GUIDANCE = PASS`

`STAGE_5_EXPLORE = PASS`

`STAGE_6_DECISION_SUPPORT = PASS_WITH_GUARDRAIL`

`STAGE_7_NEXT_ACTION = PASS`

`DOMAIN_ASSUMPTIONS_ADDED = NONE`

`STUDENT_JOURNEY_V1_FREEZE_READY = YES`

All seven outcome contracts and all journey review gates have passed. Stage 6 passes with the explicit guardrail that Dream/Target/Safe classifications and admission-probability claims remain unauthorized unless a separate validated evidence model is reviewed and approved.

## Deliberately Deferred From This Freeze

- Stage 1 exact content
- booklet content mapping details
- student entry paths and exact entry labels
- progressive input flow
- student-facing terminology
- output/result structure
- exact UI screens and navigation
- exact Tamil wording and Tamil/English interaction design
- branch discovery experience and branch recommendation semantics
- college exploration model; no ranking or tiering is authorized
- financial-support content and authoritative sourcing
- counselling/document checklist and document requirements
- historical cutoff interpretation
- treatment of admission likelihood
- direct implementation architecture

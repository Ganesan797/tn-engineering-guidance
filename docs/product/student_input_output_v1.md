# Student Input & Output V1

`STATUS = LOCKED_V1`

`STUDENT_JOURNEY_DEPENDENCY = FROZEN_V1`

`IMPLEMENTATION_AUTHORIZED = NO`

This document defines the student-facing interaction contract at product level. It does not define final screens, visual design, exact Tamil copy, technical architecture, or implementation details.

## Purpose

This contract captures how the frozen Student Journey V1 should be experienced by a student:

- what the student sees first
- what guidance is given before asking for data
- what information is collected
- when information is collected
- how personalized results are presented
- how uncertainty is handled
- how students are encouraged to explore further
- how every interaction leads to a clear next direction

The student-facing contract is not the same as the backend/domain contract. Backend models must not dictate the shape or complexity of the student experience.

## Entry Model

1. Zero knowledge is a valid starting state.
2. A student should not be forced to understand TNEA terminology before using the product.
3. The product should support both full guided entry from zero knowledge and direct entry for students who already know what help they need.
4. Entry choices are product concepts only; exact labels remain unfrozen.

Conceptual entry paths may include:

- Start from the beginning
- Understand engineering courses
- Understand TNEA/admission
- Check cutoff/eligibility
- Explore colleges
- Get counselling help

These are not frozen UI buttons or screen labels.

## Guidance Before Data

The product should provide useful awareness and orientation before demanding a detailed student profile. A zero-knowledge student should receive value before entering marks.

Examples of early value may include:

- what engineering broadly is
- major branch families
- basic admission pathways
- what TNEA is
- what cutoff means
- how counselling broadly works
- what the student should understand next

These examples do not define detailed current-year policy content. Any such content requires current authoritative verification.

## Progressive Input Model

1. Ask progressively rather than using a large technical form.
2. Ask only what enables the next useful guidance step.
3. Do not collect maximum possible data upfront.
4. Unknown, “I don't know,” or unanswered is a valid state where domain rules permit.
5. Never silently convert unknown/null into false.
6. Explain why a complex or unfamiliar question matters when useful.
7. Skip irrelevant questions.
8. Do not expose backend or internal field names to students.
9. The student experience may collect information at different stages rather than in one form.

The purpose of input collection is not to populate the domain contract. The purpose is to collect the minimum trustworthy information needed to provide the next useful guidance.

## Possible Input Categories

These are product-level categories, not frozen fields:

- current study or qualifying pathway
- academic marks or estimated marks where appropriate
- information required for eligibility
- community or reservation-related information where relevant
- school or background information where relevant
- student interests
- branch preferences
- location or institution preferences when authoritative metadata later supports them
- counselling stage or context
- information the student does not know yet

Exact questions, field order, branching logic, and student-facing wording remain to be finalized during implementation planning and UX design.

## Output Information Hierarchy

### Level 1 — Simple Student Guidance

The essential meaning the student needs now, such as:

- their cutoff
- their eligibility status
- what the result means
- what they should do next

### Level 2 — Explain Why

An optional explanation of why the guidance was produced, such as:

- cutoff calculation explanation
- eligibility reasoning
- why a programme appears

### Level 3 — Authoritative Evidence

Optional deeper verification, such as:

- official rule or source
- document reference
- provenance
- current-year official information

The student should not be forced to inspect Level 2 or Level 3 to understand the primary guidance.

## Verified Personal Results vs Things Worth Checking

### A. Verified Personal Results

Use this class for facts that the deterministic engine can establish from trustworthy inputs and applicable authoritative rules.

It may include:

- eligibility result
- cutoff when deterministically available
- verified missing information
- verified applicable facts
- current authoritative seat evidence when available

These outputs must be deterministic, evidence-backed, preserve uncertainty, and contain no unsupported prediction.

### B. Things Worth Checking

Use this class for potentially useful information that may be relevant but is not yet safely personalized or verified for the student.

It may include awareness of:

- schemes
- concessions
- reservation or support provisions
- scholarships
- certificates
- alternative pathways
- other useful opportunities

These items must be phrased as “worth checking,” “may be relevant,” “learn more,” or “verify current eligibility.” They must not be presented as definitely applicable, a guaranteed benefit, or confirmed eligibility.

When a useful opportunity cannot yet be safely personalized, do not hide it. Surface it as something worth checking, clearly separated from verified results.

## Uncertainty Handling

- unknown remains unknown
- missing vacancy is not zero vacancy
- incomplete eligibility is not silently promoted
- historical evidence is not current certainty
- past cutoff is not admission probability
- unsupported scheme eligibility is not confirmed benefit
- current-year facts remain tied to authoritative sources

Student-facing uncertainty should be understandable and non-technical. Avoid exposing raw internal states such as `UNKNOWN_OR_UNPUBLISHED`, `NEEDS_REVIEW`, or internal rule codes. The student-facing meaning should be simple while internal states remain preserved.

## Explore / Think Further

The product should not merely answer the student's existing question. The experience should also surface useful possibilities or considerations the student may not know to ask about.

Possible exploration may include:

- branch families
- related engineering disciplines
- college or institution types
- trade-offs worth considering
- alternative higher-education pathways where genuinely relevant
- financial or support information to investigate
- counselling questions the student may not know to ask

Guardrails:

- no subjective ranking presented as fact
- no branch superiority claims
- no college tier claims without a separately validated methodology
- no admission probability claims
- no forced recommendations

## Decision Support

The system supports the student's decision; it does not make the student's decision.

Decision-support output may eventually include:

- candidate programmes
- branch preference ordering
- college or programme comparisons
- historical evidence
- current seat evidence
- choice-list assistance
- explanation of why an option is included

This contract does not freeze Dream/Target/Safe semantics, guaranteed backup language, admission probability, predicted allotment, college-quality ranking, or subjective “best college” logic. If historical cutoff context is later used, its semantics require a separate evidence and methodology review.

## Next Direction Principle

Every meaningful guidance interaction should help answer at least one of:

1. What should I understand next?
2. What should I do next?

The student should not be left with a result but no direction.

Examples may include understanding cutoff, providing missing information, exploring a branch, comparing options, checking a possible scheme, preparing for counselling, verifying current official information, or taking the next admission action. Exact operational actions remain current-year dependent.

## Native-Language Readiness

`NATIVE_LANGUAGE_READINESS = REQUIRED`

- essential guidance must be expressible in simple conversational Tamil
- core understanding must not depend on English technical vocabulary
- unavoidable acronyms or terms should be explainable in Tamil
- backend terminology must not leak into student-facing copy
- sentences should remain short enough for mobile use
- translation must not alter domain semantics
- unnecessarily formal or government-style language should be avoided
- exact Tamil wording remains unfrozen

This contract freezes the direction, not final Tamil copy.

## Channel Strategy

`PRIMARY_EXPERIENCE_V1 = MOBILE_WEB`

`PRIMARY_REACH_SHARE_CHANNEL = WHATSAPP`

`FUTURE_CHANNEL = WHATSAPP_CONVERSATIONAL_GUIDANCE`

`CHANNEL_INDEPENDENT_GUIDANCE = REQUIRED`

### Mobile Web

Mobile web is the primary V1 product experience because it better supports structured guidance, progressive input, branch exploration, comparisons, evidence, counselling steps, and richer personalized output.

### WhatsApp

Initially use WhatsApp for direct reach, volunteer or school sharing, student-to-student or family sharing, links into the web guidance experience, and future shareable guidance summaries.

### Future WhatsApp Conversational Mode

A future mode may provide native-language conversational guidance. It must reuse the trusted guidance and domain layers and must not become a separate source of admission logic.

The core student journey must not depend on one interface channel.

## Explicitly Not Frozen in V1

- exact screen count
- exact screen layout
- exact navigation
- exact button labels
- exact Tamil wording
- visual identity or colors
- typography
- animations
- drag-and-drop behavior
- exact question wording
- exact field order
- exact frontend framework
- technical architecture
- database architecture
- WhatsApp API or integration
- recommendation probability model
- college ranking model
- historical cutoff interpretation model
- scheme database implementation

These belong to downstream design, methodology, data, or technical work.

## Paper Scenario Review

These scenarios validate Student Input & Output V1 before technical gap mapping.

### Scenario A — Zero-Knowledge Tamil-Medium Government-School Student

**Starting state**

- Tamil-medium student
- little or no understanding of engineering or TNEA
- may not know cutoff
- may not know relevant support or reservation concepts

**Expected flow**

- enters through guided start
- receives awareness before data collection
- understands engineering and TNEA basics
- provides information progressively
- can answer “I don't know” where appropriate
- receives verified personal guidance when possible
- sees Things Worth Checking separately
- explores branches or options
- always receives a clear next direction

**Pass criteria**

- no technical admission knowledge required to start
- no large backend-style form required
- no unsupported benefit or admission claims
- student gains value even before college recommendations
- student leaves knowing what to understand or do next

### Scenario B — Informed Student Seeking Cutoff / Eligibility

**Starting state**

- already understands TNEA at a basic level
- has marks or details
- wants cutoff or eligibility directly

**Expected flow**

- can bypass basic orientation
- enters directly into the relevant personalization path
- only necessary questions are asked
- deterministic cutoff or eligibility is returned
- explanation and evidence are optionally available
- no branch or college exploration is forced
- a clear next direction is provided

**Pass criteria**

- avoids unnecessary introductory steps
- avoids duplicate questions
- verified result is clearly separated from possible things to explore
- result is understandable without internal rule terminology

### Scenario C — Counselling-Stage Student Seeking Choice Help

**Starting state**

- already has profile or cutoff context
- understands the basic TNEA process
- wants help structuring counselling choices

**Expected flow**

- can enter directly at the decision-support or counselling stage
- student preferences remain primary
- system provides evidence-supported programme or college information
- historical and current evidence are clearly labelled
- unknown vacancy remains unknown
- no probability or guaranteed backup claim is made
- student is guided toward a choice draft and official next action

**Pass criteria**

- no forced return through awareness stages
- no Dream/Target/Safe assumptions
- no invented ranking
- no false confidence
- clear next action toward the official counselling workflow

## Student Input & Output V1 Review Gate

Before technical implementation planning, require:

`SCENARIO_A_ZERO_KNOWLEDGE = PASS`

`SCENARIO_B_CUTOFF_DIRECT_ENTRY = PASS`

`SCENARIO_C_COUNSELLING_DIRECT_ENTRY = PASS`

Also require:

`PROGRESSIVE_INPUT_REVIEW = PASS`

`OUTPUT_CLARITY_REVIEW = PASS`

`UNCERTAINTY_HANDLING_REVIEW = PASS`

`NATIVE_LANGUAGE_READINESS_TEST = PASS`

`CHANNEL_STRATEGY_REVIEW = PASS`

`MISSION_ALIGNMENT = PASS`

These are product-review gates. They do not imply application implementation exists.

## Three-Layer Factual Model

### Level A — Golden Product Concept

Long-lived student understanding.

Examples:

- cutoff or academic merit matters
- reservation or support provisions may matter
- counselling involves choices and allotment
- official current information matters

### Level B — Versioned Domain Rule

Admission-regime or year-specific deterministic rules, such as exact cutoff calculation, eligibility rules, reservation eligibility, and counselling mechanics.

Requirements:

- versioned
- authoritative
- deterministic

### Level C — Current-Year Fact

Operational or data facts that can change frequently, such as dates, fees, seat matrix, vacancies, counselling schedule, facilitation or contact details, and current document requirements.

Requirements:

- authoritative provenance
- source date
- no stale fact silently presented as current

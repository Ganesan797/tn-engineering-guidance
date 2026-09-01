# TN Engineering Guidance — Golden Product Mission

## Primary Mission

Help a student who may start with little or no knowledge of engineering admission understand the pathway clearly, in a language they understand, with guidance personalized to their situation.

The product is not primarily a college-list generator. Its first responsibility is to preserve and digitally extend the awareness and orientation value of the India Sudar Career Guidance material.

## Product Priority

1. Awareness
2. Understanding
3. Personalization
4. Help the student think further
5. Decision support

A student should receive meaningful value even if they never enter marks or generate a college list.

## Booklet-First Principle

The digital product must preserve the simple awareness and orientation value that made the original engineering-guidance booklet useful.

Personalization, deterministic eligibility, college data, and future AI capabilities are enhancements built on top of this foundation, not replacements for it.

## Zero-Knowledge Entry Principle

A student must be able to start without knowing:

- TNEA terminology
- cutoff calculation
- counselling stages
- engineering branches
- college categories
- what information the system expects

## Native-Language + Reach Principle

The experience should be designed so essential guidance can be understood in the student's native language and can eventually reach students directly through simple mobile-accessible channels.

Localization is a future product capability and is not implemented or authorized by this document.

## Trusted Engine Principle

Eligibility, cutoff, seat evidence, deterministic filtering, and other admission decisions remain rule-based and evidence-backed.

Future AI/LLM functionality may assist with:

- explanation
- translation
- conversation
- information discovery

AI must not invent or decide:

- eligibility
- vacancy
- cutoff
- rank
- admission outcome
- unsupported factual claims

## Student-Facing Simplicity Principle

Backend/domain complexity should remain hidden unless exposing it genuinely helps the student.

Backend/internal:

`ELG009_PREDICATE_SATISFIED`

Student-facing:

> Your TNEA cutoff is 165 / 200.

Optional deeper level:

> How was this calculated? Official source/evidence.

## Think-Further Principle

The product should not merely answer questions the student already knows to ask. It should surface useful information and options the student may not know they need to consider.

## Mission Alignment Review Principle

Technical correctness alone does not constitute product completion.

Every major student-facing milestone must undergo two independent reviews:

1. Technical / Domain Review
   - deterministic correctness
   - authoritative data/evidence
   - tests
   - architecture
   - uncertainty handling
   - no unsupported assumptions
2. Student / Mission Review
   - does this serve the Golden Product Mission?
   - can a zero-knowledge student understand it?
   - is the information presented simply?
   - does personalization genuinely help?
   - is unnecessary backend complexity hidden?
   - does the student understand what the result means?
   - does the student know what to do next?
   - does it preserve the Booklet-First Principle?
   - does it help the student think further where useful?

A student-facing milestone cannot be marked complete unless:

`TECHNICAL_DOD = PASS`

`MISSION_ALIGNMENT = PASS`

For major student-facing milestones, manual scenario review is required before authorizing the next implementation slice.

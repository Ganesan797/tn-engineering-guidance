# Student Journey V1

`STATUS = DRAFT`

`IMPLEMENTATION_AUTHORIZED = NO`

This document is a product specification draft. It does not authorize implementation until the journey is reviewed and frozen.

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

## Golden Journey

### 1. Engineering Awareness

Purpose: Help the student understand what engineering is and where it fits among post-Class-12 possibilities.

Possible topics:

- what engineering study involves
- major engineering branches
- high-level admission pathways
- engineering is one option among multiple higher-education pathways

Exact student-facing content is not yet frozen.

### 2. TNEA Explained

Purpose: Give the student a simple mental model of the Tamil Nadu engineering admission process.

Possible topics:

- what TNEA is
- eligibility basics
- cutoff concept
- high-level counselling flow
- difference between TNEA and other routes such as JEE where relevant

All policy statements must later be backed by authoritative sources.

### 3. Know the Student

Purpose: Gather only the information required to personalize guidance.

Principles:

- progressive questions
- ask only relevant questions
- avoid exposing internal/domain fields directly
- unknown/unanswered is a valid state where the domain permits it
- never silently convert unknown/null into false

### 4. Personal Guidance

Purpose: Translate verified student information into understandable personal guidance.

May include:

- eligibility outcome
- calculated cutoff when deterministically available
- missing information
- verified applicable rules/quotas/schemes
- explanation of what these mean

No unsupported probability or confidence claims.

### 5. Explore

Purpose: Help the student think beyond a raw admission result.

May include:

- branch exploration
- college exploration
- alternative pathways where genuinely useful
- questions/options the student may not know to consider

This stage should extend the original guidance-booklet philosophy.

### 6. Decision Support

Purpose: Help a sufficiently informed student move toward an actual counselling decision.

May eventually include:

- evidence-supported programme possibilities
- historical context where authoritative data exists
- choice-order assistance
- explanation of why options appear

Dream/Target/Safety semantics are not frozen at this stage. The product must not use “guaranteed backup” language.

### 7. Next Action

Purpose: The student should always understand what to do next.

May include:

- required information/documents
- official sources
- counselling actions
- deadlines when authoritatively available
- next step within the product

## Three Information Levels

### Level 1 — Simple Guidance

What does the student need to know now?

### Level 2 — Explain Why

Why did the system say this?

### Level 3 — Evidence

What authoritative source/rule supports it?

The student should not be forced into Level 2 or Level 3 to understand the primary guidance.

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

## Areas Still To Be Frozen

- Stage 1 exact content
- booklet content mapping
- student entry paths
- progressive input flow
- student-facing terminology
- output/result structure
- branch discovery experience
- college exploration model
- financial-support content and authoritative sourcing
- counselling/document checklist
- historical cutoff interpretation
- treatment of admission likelihood
- Tamil/English interaction design

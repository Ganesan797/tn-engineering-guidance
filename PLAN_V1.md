# TN Engineering Guidance — V1 Plan

## Planning horizon

Six months from project-control baseline to a usable MVP. The sequence is approximate and milestone-driven; it is not a daily delivery schedule.

## MVP vision

Give a Tamil Nadu engineering applicant a fast, transparent, evidence-backed shortlist of college-programme options using the student's TNEA cutoff, community category, and preferred branch. Every result must state why it was included, what source data was used, and the limits of historical-cutoff guidance.

V1 succeeds when a student can enter those three inputs and receive useful dream, target, and safe guidance within two minutes without relying on invented facts or opaque scoring.

## Architecture principle

> source evidence → structured data → rules → student guidance

Each layer has a separate responsibility:

1. **Source evidence:** register official TNEA and institution sources with access and verification dates.
2. **Structured data:** normalize sources into versioned CSV datasets with stable IDs and referential integrity.
3. **Rules:** apply deterministic eligibility, filtering, classification, and ranking logic to validated data.
4. **Student guidance:** present recommendations, exclusions, evidence, and uncertainty in plain language.

No guidance layer may bypass the data and rules layers. AI is not part of the V1 decision path.

## Strict V1 scope

### Student input

- TNEA cutoff mark
- Community/category
- One preferred normalized branch

### Evidence and data

- Canonical source registry
- Validated college, branch, programme, historical cutoff, and eligibility-rule datasets
- Stable identifiers, source links, applicable year, and verification dates
- A release-ready data slice large enough to produce useful pilot recommendations; target coverage is 100+ colleges, 1,000+ programmes, and three counselling years, subject to official data availability and verification

### Deterministic guidance

- Validate input and applicable eligibility rules
- Filter records by branch, category, and supported counselling data
- Classify options as dream, target, or safe using documented historical-cutoff bands
- Use explicit, deterministic tie-breaking and ranking rules
- Explain inclusion, exclusion, data year, cutoff difference, and important limitations
- Return a clear no-result or insufficient-data response instead of guessing

### Minimal product surface

- A mobile-friendly input flow and results view
- Basic college/programme details needed to understand a recommendation
- Source and last-verified information visible from results
- Anonymous feedback collection for the pilot
- No account required

### Engineering and release quality

- Automated data-contract, referential-integrity, rule, and recommendation tests
- Reproducible import/validation/reporting workflow
- Versioned data release and documented rollback path
- Basic accessibility, security, privacy, observability, and performance checks

## Non-goals and deferred ideas

The following are explicitly outside V1:

- AI counselor, chat, embeddings, vector search, or RAG
- User accounts, authentication, saved profiles, or saved recommendations
- College comparison and advanced trend visualization
- Preference-order builder, counseling simulator, document checklist, or allocation simulation
- Personalized match scores beyond the documented dream/target/safe rules
- Notifications, reviews, community features, or crowdsourced admission facts
- Native mobile applications
- Tamil localization
- College placement, fee, ranking, hostel, review, or career-outcome datasets
- Predictive or probabilistic admission claims
- Multi-state or non-TNEA admissions

These ideas remain post-MVP backlog items and must not expand the V1 acceptance criteria.

## Milestones and definition of done

### Milestone 0 — Repository and project-control baseline

**Approximate sequence:** opening weeks

**Outcome:** the repository has a clear V1 boundary and a reliable control loop.

**Definition of done:**

- `PLAN_V1.md` and `PROJECT_STATUS.md` are reviewed and accepted.
- Current repository structure, data assets, gaps, and decisions are documented without claiming placeholder work as implemented.
- The next engineering slice is specified before implementation begins.
- Source, data, rules, and guidance concerns have clear repository locations.

### Milestone 1 — Data contracts and validation foundation

**Approximate sequence:** month 1

**Outcome:** repository data can be checked automatically before it is used.

**Definition of done:**

- CSV schemas and field names are reconciled across documentation and files.
- Validation covers required fields, unique IDs, dates, cutoff calculation, allowed values, and all documented foreign keys.
- Invalid, duplicate, stale, and unsourced records fail with actionable diagnostics.
- Tests include valid fixtures and representative failure cases.
- A validation report can be generated reproducibly from a clean checkout.

### Milestone 2 — Verified MVP data slice

**Approximate sequence:** months 1-3, overlapping validation work

**Outcome:** a traceable dataset supports real recommendation development.

**Definition of done:**

- Official sources are registered before derived records are added.
- Canonical eligibility rules are derived from the detailed reference layer and reviewed.
- College, programme, and cutoff records meet the data contracts and carry evidence and verification dates.
- Branch normalization is sufficient for V1 matching.
- Coverage and missing-data reports are published.
- The chosen pilot slice passes all validation checks; unverified records are excluded.

### Milestone 3 — Deterministic rules and recommendation engine

**Approximate sequence:** months 3-4

**Outcome:** tested rules turn validated data into explainable guidance.

**Definition of done:**

- Eligibility, filtering, historical-cutoff banding, ranking, and tie-breaking rules are documented and implemented.
- Dream, target, and safe classifications are defined by explicit configuration or constants, not hidden heuristics.
- Each recommendation and exclusion includes a machine-readable reason and evidence reference.
- Boundary cases, missing data, unsupported categories, and no-result cases are covered by tests.
- Golden test cases are independently reviewed against the underlying CSV records.

### Milestone 4 — End-to-end guidance experience

**Approximate sequence:** months 4-5

**Outcome:** a student can complete the core journey on a mobile device.

**Definition of done:**

- The cutoff, category, and branch input flow validates and explains inputs.
- Results show dream, target, and safe groups with college/programme details, source year, cutoff difference, and reasoning.
- Disclaimers clearly distinguish historical guidance from admission guarantees.
- Empty, error, and insufficient-data states are useful and do not fabricate guidance.
- Core flow meets agreed accessibility and mobile checks and responds within the V1 performance target under pilot load.

### Milestone 5 — Engineering beta

**Approximate sequence:** month 5

**Outcome:** the system is safe to expose to a small controlled pilot.

**Definition of done:**

- CI runs data validation and automated tests on every change.
- A reproducible deployment uses an approved, versioned data snapshot.
- Logging and monitoring avoid student personal information.
- Security, privacy, accessibility, performance, and rollback checks pass.
- Maintainer runbooks cover data refresh, validation failure, deployment, and rollback.
- Internal end-to-end acceptance tests pass with no critical defects.

### Milestone 6 — Usable V1 release and feedback loop

**Approximate sequence:** month 6

**Outcome:** the MVP is validated with real users and can be maintained reliably.

**Definition of done:**

- At least 50 pilot users can complete the core journey.
- At least 20 structured feedback responses are collected.
- Critical correctness issues are resolved before broader release.
- Published coverage, source dates, limitations, and disclaimer match the deployed data snapshot.
- Release health and feedback are reviewed against a documented go/no-go checklist.
- V1 is tagged with code, rules, and data versions that can be reproduced.

## Engineering-first launch strategy

1. Prove data lineage and validation before building recommendation UI.
2. Prove deterministic rules through tests and inspectable reports before exposing student guidance.
3. Use a narrow, verified pilot dataset before scaling coverage.
4. Ship an internal end-to-end vertical slice, then a controlled student pilot, then a broader V1.
5. Treat missing or stale evidence as a product state, not as a reason to infer data.
6. Expand only after correctness, explanation quality, and maintainability meet the release gate.

## Post-MVP backlog

In priority order after V1 evidence and feedback review:

1. College comparison, richer cutoff trends, and carefully validated match scoring
2. Preference-order and counseling-preparation tools
3. Tamil localization
4. Accounts and saved recommendations, only if user research justifies them
5. AI explanations or conversational guidance constrained to retrieved project evidence
6. Broader college information, notifications, community features, and native mobile applications

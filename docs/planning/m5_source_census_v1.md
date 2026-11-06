# M5-T02 — bounded official-source assessment

**Status:** `M5_T02_ASSESSMENT = COMPLETE_FOR_AUTHORIZED_SCOPE`; `OWNER_REVIEW = PENDING`; `T03_T04 = NOT_AUTHORIZED`. Assessment date: 2026-11-06. Access window: approximately 2026-11-06T07:20Z–07:23Z. Governing contract: [accepted M5-T01](m5_contract_spec_v1.md), reviewed at `b332c61216ecf8329ec9f7336f6de6f4bfc9d7e4`.

This is source discovery and semantic assessment only. It did not download or retain raw PDFs, copy applicant rows, create a historical dataset, derive a cutoff, inspect statewide records, ingest data or change the application. A successful request below establishes accessibility during this access window only. It does not establish long-term stability, reuse permission, completeness or factual approval. Unavailable and unlocated sources remain unavailable/unverified; unofficial mirrors were not substituted.

## Bound and method

The assessment reused the official leads already recorded in the M5 proposal, followed directly relevant results on the official `tneaonline.org` / `static.tneaonline.org` domains, and inspected headings, table column labels and schedule structure only. Search was bounded to 2024/2025 engineering General Academic and government-school 7.5% evidence plus one official 2025 special-reservation seat-matrix result returned by the same bounded search. The public TNEA index returned HTTP 403 in the assessment client; the cutoff portal returned HTTP 503.

No applicant identifier or row is reproduced in this document. Where an allotment PDF exposed applicant-level columns, inspection stopped at the heading/layout needed to classify the source. Query-string `t=` values and crawler dates are not treated as publication dates. None of the inspected documents stated a publication date in the heading; schedule event dates are event dates, not document-publication dates.

## 1. Seat matrix

### SM-2025-DAP — accessible but outside the target routes

| Field | Observation |
| --- | --- |
| URL | [GENERAL_ACADEMIC_DAP_2025.pdf](https://static.tneaonline.org/docs/GENERAL_ACADEMIC_DAP_2025.pdf) |
| Observed title | “TAMILNADU ENGINEERING ADMISSIONS - 2025 — GENERAL ACADEMIC - DIFFERENTLY ABLED PERSONS SEAT MATRIX” |
| Year / route or quota | 2025; General Academic special-reservation differently-abled route. It is neither the ordinary General Academic matrix nor government-school 7.5% evidence. |
| Stage / round | Seat matrix; no counselling round stated in the inspected heading. |
| Publication date | Not stated in the inspected heading. |
| Access result | Accessible as an official PDF during the assessment window. |
| Metric definition | College/programme category counts under the named special-reservation seat-matrix scope. No cutoff or closing rank. |
| Layout | Repeating college code/name, branch code/name and OC/BC/BCM/MBC/SC/SCA/ST count columns. |
| Source-use/privacy limits | No applicant rows observed in this matrix layout. Public accessibility does not establish reuse permission. Counts do not establish sanctioned intake, ordinary General Academic availability, 7.5% availability, vacancy, final admission or a historical cutoff. |
| Unresolved questions | Publication/version date, relationship to later residual matrices and whether a separately published ordinary General Academic or 7.5% matrix remains available. |

### Target-route seat matrices — unavailable/unverified in this assessment

| Year | Route/quota sought | URL / index checked | Access result and meaning |
| --- | --- | --- | --- |
| 2024 | General Academic | [TNEA public index](https://www.tneaonline.org/) and bounded official-domain search | Index returned HTTP 403; no exact official PDF URL was located. A source from another host was not accepted as a substitute. |
| 2024 | Government-school 7.5% Academic | [TNEA public index](https://www.tneaonline.org/) and bounded official-domain search | Index returned HTTP 403; no exact official PDF URL was located. |
| 2025 | General Academic | [TNEA public index](https://www.tneaonline.org/) and bounded official-domain search | Index returned HTTP 403; no exact official PDF URL was located. |
| 2025 | Government-school 7.5% Academic | [TNEA public index](https://www.tneaonline.org/) and bounded official-domain search | Index returned HTTP 403; no exact official PDF URL was located. |

For every missing matrix, title, layout, category semantics, version and source-use terms remain unverified. Even if later located, a seat-matrix count must remain distinct from sanctioned intake, vacancy, allotment and closing cutoff.

## 2. Provisional and final allotment publications

### General Academic provisional lists

| ID / URL | Observed title | Year, route, stage | Access / layout | Metric and suitability |
| --- | --- | --- | --- | --- |
| GA-2024-R1 — [official PDF](https://static.tneaonline.org/docs/GENERAL_ACADEMIC_ROUND1_2024.pdf?t=1727461128737) | “GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST - ROUND 1” | 2024; General Academic; Round 1 provisional | Official indexed PDF lead accessible during the assessment; applicant-level table. The bare URL without its observed query string was not accessible through the assessment client. | Columns include applicant/application data, community, aggregate mark, individual rank, exact college/branch and allotted category. It does **not** explicitly publish an aggregate closing cutoff. Semantically unsuitable for T03 data use and prohibited from extraction under T01. |
| GA-2024-R2 — [official PDF](https://static.tneaonline.org/docs/GENERAL_ACADEMIC_ROUND2_2024.pdf?t=1741478400023) | “ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST” | 2024; General Academic; Round 2 provisional | Same access/layout classification as GA-2024-R1. | Applicant-level marks/ranks are not an aggregate closing metric. No derivation is authorized. |
| GA-2024-R3 — [official PDF](https://static.tneaonline.org/docs/GENERAL_ACADEMIC_ROUND3_2024.pdf?t=1728773935007) | “ROUND 3 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST” | 2024; General Academic; Round 3 provisional | Same access/layout classification as GA-2024-R1. | Applicant-level marks/ranks are not an aggregate closing metric. Round 3 does not establish final outcome because the official schedule also describes confirmation, reporting and upward movement. |
| GA-2025-R2 — [official PDF](https://static.tneaonline.org/docs/GEN_ALLOTMENT_ROUND_2_2025.pdf?t=1759032000023) | “ROUND 2 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST” | 2025; General Academic; Round 2 provisional | Official indexed PDF lead accessible during the assessment; applicant-level table. Bare canonical URL access failed in the assessment client. | Applicant community and allotted community are separate columns; aggregate mark and General rank are individual fields. No explicit aggregate closing cutoff. |
| GA-2025-R3 — [official PDF](https://static.tneaonline.org/docs/Round3-gen-allotments.pdf?t=1755712800023) | “ROUND 3 - GENERAL ACADEMIC - PROVISIONAL ALLOTMENT LIST” | 2025; General Academic; Round 3 provisional | Same access/layout classification as GA-2025-R2. | No explicit aggregate closing cutoff; no applicant-level extraction or inferred minimum is permitted. |

Publication dates were not stated in the inspected headings. GA-2025-R1 was not located in the bounded official-domain search and remains unverified.

For each General Academic record above, the shared source-use/privacy rule is: headings only were assessed; applicant rows and identifiers were neither extracted nor retained; public accessibility does not approve reuse. Shared unresolved questions are publication/version date, reuse terms, stable archival access, relationship to later allotment states and whether an official aggregate closing-cutoff publication exists.

### Government-school 7.5% Academic provisional lists

| ID / URL | Observed title | Year, route, stage | Access / layout | Metric and suitability |
| --- | --- | --- | --- | --- |
| GS75-2025-R1 — [official PDF](https://static.tneaonline.org/docs/GOVT_ACADEMIC_ROUND1_2025.pdf?t=1755068400023) | “GOVERNMENT SCHOOL STUDIED (7.5%) - ACADEMIC - PROVISIONAL ALLOTMENT LIST - ROUND 1” (source spelling varies) | 2025; government-school 7.5% Academic; Round 1 provisional | Official indexed PDF lead accessible during the assessment; applicant-level table. Bare canonical URL access failed in the assessment client. | Heading separates applicant community, allotted community, aggregate mark, General rank and Govt rank. These are individual fields, not an aggregate closing cutoff or approved rank-comparison source. |
| GS75-2025-R2 — [official PDF](https://static.tneaonline.org/docs/GOVT_ALLOTMENT_ROUND_2_2025.pdf?t=1755028800023) | “ROUND 2 - GOVERNMENT SCHOOL STUDIED (7.5%) - ACADEMIC - PROVISIONAL ALLOTMENT LIST” (source spelling varies) | 2025; government-school 7.5% Academic; Round 2 provisional | Same access/layout classification as GS75-2025-R1. | No explicit aggregate closing cutoff. General rank and Govt rank populations remain distinct; rank comparison is outside the first slice. |

Publication dates were not stated in the inspected headings. No 2024 government-school 7.5% Academic round list and no 2025 Round 3 list were located in the bounded official-domain search. They remain unavailable/unverified. General Academic evidence cannot fill these gaps.

For each 7.5% record above, the shared source-use/privacy rule is: headings only were assessed; applicant rows and identifiers were neither extracted nor retained; public accessibility does not approve reuse. Shared unresolved questions are publication/version date, reuse terms, stable archival access, later allotment states, exact Govt-rank population and whether an official aggregate 7.5% closing-cutoff publication exists.

### Final-allotment status

The bounded official-domain search found headings labelled **provisional allotment list** and found no separately titled 2024/2025 “final allotment list” for either General Academic or government-school 7.5% Academic. The official schedules distinguish tentative allotment, provisional allotment for different confirmation states, reporting and later upward movement. Therefore “provisional” must be retained literally, and no inspected list can be relabelled final.

## 3. Vacancy snapshots

| Year | Route/quota sought | URL / access result | Assessment |
| --- | --- | --- | --- |
| 2024 | General Academic and government-school 7.5% Academic | [TNEA public index](https://www.tneaonline.org/) returned HTTP 403; bounded official-domain searches returned no exact official vacancy PDF. | Unavailable/unverified. Unofficial copies or descriptions were ignored. |
| 2025 | General Academic and government-school 7.5% Academic | [TNEA public index](https://www.tneaonline.org/) returned HTTP 403; bounded official-domain searches returned no exact official vacancy PDF. | Unavailable/unverified. Unofficial copies or descriptions were ignored. |

For both unavailable vacancy records, observed title, publication date, metric definition, round coverage, layout, source-use terms and document-specific unresolved questions remain unverified. If a future official vacancy source is located, its category counts would be a dated post-round snapshot only: they would not be sanctioned intake, a closing cutoff or a final admission outcome.

## 4. Official historical cutoff portal

| Field | Observation |
| --- | --- |
| URL | [TNEA Cutoff Portal](https://cutoff.tneaonline.org/) and [search route](https://cutoff.tneaonline.org/search) |
| Observed title | “TNEA Cutoff Portal — Government of Tamil Nadu” from the indexed landing page. |
| Years / route or quota | Landing page advertises college cutoff marks and ranks for 2021–2025. It does not expose General Academic versus government-school 7.5% scope in the accessible landing text. |
| Stage / round | Not stated in the accessible landing text. |
| Publication date | Not stated. |
| Access result | Both root and search route returned HTTP 503 during the assessment window. A prior index snapshot showed a verification step and search interface; this does not establish current availability. |
| Metric definition | “Cutoff marks and ranks” is advertised. The accessible text does not define whether values are official published aggregates or derived, the category used, rank population, included counselling stage/round, finality, tie treatment or missing-record semantics. |
| Layout | Verification gate followed by an interactive search interface according to the indexed landing page; result layout was not accessible. |
| Source-use/privacy limits | Do not enter personal marks/community or automate queries until input handling, terms and retention are reviewed. The indexed claim that data is sourced from official counselling records does not itself approve the derivation method or reuse. |
| Unresolved questions | Metric construction, General/7.5% separation, category meaning, round/finality, exact pair identity/versioning, export/provenance, missing data, access stability, terms and update ownership. |

The portal is the only discovered candidate that explicitly advertises historical cutoff marks as an aggregate search product, but it is currently unavailable and semantically insufficient for approval. It is not yet a usable comparison source.

## 5. Supporting official schedule sources

These sources resolve route, round and publication-state vocabulary; they do not provide college–programme closing cutoffs.

| URL | Observed title / year | Access and layout | Resolved meaning / limits |
| --- | --- | --- | --- |
| [TNEASchedule_2024.pdf](https://static.tneaonline.org/docs/TNEASchedule_2024.pdf) | “TAMIL NADU ENGINEERING ADMISSIONS – 2024 — SCHEDULE” | Direct official PDF accessible during the assessment; multi-section schedule tables. Publication date not stated. | Separately labels Academic General counselling and government-school 7.5% counselling; each has Rounds 1–3 with separate aggregate-mark and rank bands. It distinguishes tentative allotment, confirmation, provisional allotment, reporting and upward movement. It does not define a college–programme closing cutoff. |
| [TNEA_Tent_Schedule_2025.pdf](https://static.tneaonline.org/docs/TNEA_Tent_Schedule_2025.pdf) | “TAMIL NADU ENGINEERING ADMISSIONS – 2025 — SCHEDULE” | Direct official PDF accessible; multi-section schedule tables; marked subject to AICTE approval. Publication date not stated. | Same route and Round 1–3 separation. General uses General rank; the 7.5% table uses Govt General rank. It is scheduling/eligibility-band context, not historical closing evidence. |

## T01 questions resolved or narrowed

- **Route/quota:** Academic General and government-school 7.5% Academic are separate schedule sections and separate allotment publications. One cannot substitute for the other.
- **Rounds:** Both inspected schedules define Rounds 1–3 for both routes. Missing source files do not mean a round did not exist.
- **Finality:** The schedules distinguish tentative, confirmed/provisional, reporting and upward movement. The inspected round lists are explicitly provisional, and no separate final list was located.
- **Rank populations:** General Academic schedules use General rank. The 7.5% schedules use Government/Govt General rank bands; 2025 7.5% allotment headings also carry General rank and Govt rank as distinct individual fields. Rank comparison remains outside the first slice.
- **Category fields:** Seat-matrix/allotment headings use OC, BC, BCM, MBC, SC, SCA and ST labels. Allotment headings distinguish applicant community from allotted category/community. OC must not be reinterpreted as an applicant community. The relationship between published `MBC` headings and the broader policy label `MBC/DNC` still needs an applicable official definition.
- **Historical metric:** Provisional allotment lists do not explicitly provide an aggregate historical closing cutoff. A minimum observed applicant value would be a derived statistic and is not authorized.
- **Source stage distinctions:** Seat matrices, vacancy snapshots, allotment lists, schedules and cutoff-search results have different meanings and must remain separate.

## Still unresolved

- Exact definition, derivation, category, round/finality and provenance for the cutoff portal's advertised marks/ranks.
- Whether the portal covers government-school 7.5% separately and whether any aggregate rank population is published rather than derived.
- Official 2024/2025 ordinary General Academic and 7.5% seat-matrix URLs, versions and reuse terms.
- Official 2024/2025 vacancy snapshot URLs and their round coverage.
- Missing General Academic and 7.5% provisional rounds, and whether a separate final publication exists.
- Publication dates, retention/reuse terms and stable archival access for the historical documents.
- Exact cross-year college/programme identity continuity; T03 has not begun.

## Usable source candidates

1. **2024 and 2025 official schedules:** usable now for route, round and allotment-state vocabulary only.
2. **Official provisional-allotment headings:** usable only to document layout, privacy risk and provisional status. They are not usable as historical cutoff data and must not be extracted under the current authorization.
3. **Official cutoff portal:** potentially the best aggregate historical source candidate because its landing page advertises cutoff marks and ranks, but it is not usable until accessibility and metric semantics are established.
4. **2025 DAP seat matrix:** usable as evidence of the seat-matrix source shape for its exact special-reservation scope only; unsuitable for General Academic or 7.5% comparison.

## Unavailable or semantically unsuitable

- The cutoff portal is unavailable (HTTP 503) and lacks accessible metric semantics.
- Target-route 2024/2025 seat matrices and vacancy snapshots were not located on the official domain within the authorized bound.
- The located allotment PDFs are applicant-level provisional publications. They are unsuitable for product ingestion, aggregate cutoff claims or T03 cohort evidence under T01.
- No separately titled final-allotment list was located.
- Unofficial mirrors and secondary descriptions are excluded from factual substitution.

## Recommended T03 scope and authorization

`T03_AUTHORIZATION_RECOMMENDATION = HOLD` pending an owner decision on the blockers below. T03 should not be started merely because provisional applicant lists are accessible.

Before authorizing T03, establish at least one accessible official, non-applicant source that (a) carries exact college/programme identities for a target year/route and (b) explicitly defines a usable aggregate closing cutoff, or obtain an authoritative portal definition/export that does so. Also decide source-use/retention conditions. If those prerequisites are met, a future T03 authorization should remain capped at **at most 10 colleges and 20 exact pairs**, select by source and identity feasibility, begin with the approved route only, keep General Academic and 7.5% separate, preserve missing years as unknown, exclude rank comparison and perform no extraction experiment.

## Blockers to historical comparison

1. No currently accessible inspected source explicitly provides a sufficiently defined aggregate historical college–programme closing cutoff.
2. The official cutoff portal is unavailable and its metric/category/round/finality semantics cannot be verified.
3. Provisional allotment sources contain applicant-level data and are not aggregate closing sources; T01 prohibits their extraction or derived minimum.
4. Exact official target-route seat matrices and vacancy snapshots for 2024/2025 were not located in the bounded assessment.
5. Source-use permission, publication/version dates and stable archival behavior remain unresolved.
6. Historical identity continuity and missing-round coverage have not been assessed and cannot be inferred.

## Explicitly unsearched scope

No statewide college/programme enumeration; no brute-force filename discovery; no applicant-row inspection or parsing; no logged-in portal path; no API reverse engineering; no 2021–2023 records; no B.Arch, vocational, supplementary, SCA-to-SC or other special-reservation census; no unofficial mirror validation; no source download/hash; no historical identity joins; no extraction accuracy experiment; and no application, storage or bilingual-copy work.

**Next owner decision:** accept/revise the T02 findings and decide how to resolve the aggregate-cutoff source blocker. Do not authorize T03 or T04 by implication.

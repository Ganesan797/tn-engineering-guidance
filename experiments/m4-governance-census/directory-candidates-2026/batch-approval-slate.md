# M4 directory — final source-record batch-approval slate

**Decision recorded:** Ganesan approved the exact source-record batch under the limits in the [dated decision](owner-batch-decision-2026-10-29.md). This slate uses candidate commit `7e0b76f29339db6ea49922ef883f532fe31a2317` and does not change the candidate tables. Approval covers only the exact, source-scoped records in [batch-supported.csv](batch-supported.csv), not current availability, merged cross-source identities, profile associations, explanations, production import or student access.

## Supported batch: exact IDs

The UTF-8/LF manifest [batch-supported.csv](batch-supported.csv) contains **8,622 unique IDs**: **3,354 matrix offering records** and **5,268 separate source-field records**. Its SHA-256 is `114cfb51bd6463282efcfab3a821847953c9dc7445d10a9507a438378d5412ff`. A field ID is `F|college_code|field`; an offering ID is `O|college_code|programme_code|source_year|stream|stage`. IDs are strings; the manifest references the original candidate tables and their source pages. Its exact bytes, not an unstated filter or a changing table, define the decision.

The 5,268 source fields include 418 code observations, 408 matrix printed name/address cells, 405 booklet header strings, 412 booklet index type labels, 385 district fields and 405 each of address, taluk, pincode, autonomy, minority status, website, phone/fax and email. A name/address cell or header is approved only as the source's printed string and, where eligible, its source-scoped code/name association. An embedded district string does not approve that district as a separate fact. Other fields are approved only as individually dated source statements. The seven previously accepted identity decisions retain their original scope; this batch would not infer a new cross-source merge or a current canonical display name.

All 3,354 offering rows are recommended as **matrix source records**, including BY/XC, AE/AO and scope-held codes. A source record means only that the exact college code, source-printed college context, programme code/name/variant and stated 2026 stream/stage were recorded by the matrix. Seven offerings under `1133` and offerings under the other name-difference codes remain associated only with their matrix source context; identity reconciliation and all applicable scope, profile and display holds continue. Approval of a source record is neither approval of an institutional identity join nor permission to display it. A disputed district does not block an otherwise supported source identity or offering.

Input hashes, SHA-256 of exact bytes at the candidate commit:

| Dataset | SHA-256 |
| --- | --- |
| [college-candidates.csv](college-candidates.csv) | `1bdf9eeb96e0bfca3149ce95ddcc1c8f83df53fcf32af909a477196f9c5219b9` |
| [offering-candidates.csv](offering-candidates.csv) | `0430a7f2fef2be286d502d85fac6f19ade4398f7c9d149cb2a5c69ccf7b3b01d` |
| [field-provenance.csv](field-provenance.csv) | `86bcb43bb1ecb0e7cffbe1365412373a08fd487f5692dff39214f083bfbc5336` |
| [exceptions.csv](exceptions.csv) | `7091e2a8a6c4f259e007167e1c3a195d18a77f99385e0961badb72a400f8a801` |

## Exceptions and retained holds

[batch-exceptions.csv](batch-exceptions.csv) has **191 unique exception IDs**: 178 excluded source-field records, six identity-join holds and seven booklet-header/district review entries. They may concern the same college and are not disjoint college counts. Its SHA-256 is `a848606d097f4b720e0910d4c36ca585d3824ec424cb4db8a67b73a6e4d9a150`. The original exception and candidate files remain unchanged; this slate adds the discoveries below.

- **Identity differences — HOLD joins and affected source fields:** `1133` (original conflict), `1301`, `1424`, `2345`, `2776`, `3815`. The latter five have materially different source names or qualifiers and need evidence before names and attributes are combined; a name difference does not by itself prove different institutions. Compare the matrix and booklet pages in the source candidates. Source-stage offering records remain in the batch under their matrix context, not rejected.
- **District — retain both source values and HOLD the district field:** original 16 codes `1137, 1303, 1316, 1333, 1401, 1402, 1415, 1441, 1501, 1519, 1525, 1605, 4967, 4994, 4998, 5502`. New booklet header/field differences: `1212` Kancheepuram/Tiruppur; `1432` Kancheepuram/Tiruvallur; `3815` Tiruchirappalli/Pudukkottai; `4959` Virudhunagar/Madurai. `1232` Chengalpattu/Chengalpet is held as a possible spelling variant pending review. Booklet internal differences also repeat existing exceptions `1333` and `5502`. Thus 20 distinct codes have textual district disagreements and one additional code has a possible spelling difference. Do not infer which value is current.
- **Previous-year details — HOLD the affected booklet fields:** `1102, 1221, 1510, 1516, 2350, 4943, 5533`. The 2026 publication explicitly says previous-year data; its fact year is not established. `4943` has eight dash-valued fields; keep UNKNOWN, not false. Matrix source records and unrelated index fields remain separately eligible.
- **Booklet only:** `2332, 3555, 4911, 4927`. Source-supported fields are eligible as booklet observations; no matrix offerings are invented. A current inventory or offering needs separate evidence.
- **Profile and scope:** BY/XC variant associations, AE/AO N9, BP/DA/CQ/IF/ID/CJ scope holds, all other existing crosswalk/profile holds and unresolved mapping decisions remain. P01/P02 remain HOLD and P03–P06 FIX/review on outstanding content gates. Ganesan's Tamil PASS_OWNER_REPORTED remains limited to the exact six sections, without factual or English-equivalence approval.

## Source checks and limits

The preserved official PDFs matched their previously recorded hashes: [2026 matrix](https://static.tneaonline.org/docs/GENERAL_ACADEMIC_SEAT_MATRIX_BEFORE_SPECIAL_RESERVATION_COUNSELLING_2026.pdf) `85dbb154b56822fef150054e4508787d53b9f438fdf5a5532da7b3d02e547743` and [2026 college booklet](https://static.tneaonline.org/docs/Information_about_colleges_2026.pdf) `035dd2604fa784c0ce57379783b50eca1a0972a08a6e7811ab2ca50562ce5373`. Targeted checks covered **all 101 existing exception rows**, all 22 recorded matrix correction entries, the five newly flagged name differences, seven booklet heading/district comparisons and ten representative otherwise unflagged colleges (`1, 4, 1304, 2005, 2006, 2603, 3018, 3860, 4020, 4996`). [Check log](batch-source-checks.csv) has 145 entries. Checks establish that the relevant source text/markers or code/page references are present; they do not resolve the discrepancies.

Visually inspected booklet PDF pages 133, 183, 296, 297 and 328 for the newly found naming differences and source header; earlier checks inspected pages 42, 54, 70, 108 and 400 plus matrix pages 105–106. PDF rendering reported missing font warnings, and sampled visual checks are not exhaustive. The text checks and representative sample do not establish that every unflagged field was visually or independently verified; owner approval should be understood with that limit and the source-stage boundaries.

## Owner decision text

“I approve the **8,622 exact source-record IDs** in `batch-supported.csv`, SHA-256 `114cfb51bd6463282efcfab3a821847953c9dc7445d10a9507a438378d5412ff`, against the four candidate datasets and hashes recorded in this slate, as the literal dated, source-scoped fields and matrix listings described above. I retain the 191 explicit exception IDs and all existing identity, district, previous-year, variant, scope, profile and explanation holds. This approves no cross-source identity merge, current-availability claim, profile association or wording, production import, UI change, merge, deployment or student access.”

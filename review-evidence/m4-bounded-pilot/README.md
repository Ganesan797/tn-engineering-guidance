# Bounded M4 implementation — verification

- Owner review route: disabled by default; explicit local-only `M4_OWNER_REVIEW=1` process. Default and opt-in server behavior tested. The route is not a student release.
- Cohort preparation: seven accepted college identities, nine previously accepted exact links and nine **pending** source-stage offerings; six real educational copy candidates remain HOLD/FIX. No real offering or profile is promoted by a fixture approval.
- Focused UI/view-model checks: 24/24 pass (17 existing plus seven new). Full offline suite: 299/299 pass (`full-test.log`). Strict TypeScript: pass.
- Mobile Chrome: 36 checks at 360px and 390px, in Tamil and English. Actual governed route was checked for its honest empty state. The populated branch/college/detail and comparison journeys used separately marked synthetic fixtures only. Tests checked source, language switch, 2-option comparison and no horizontal overflow; `mobile-checks.json` records the runs.
- Screenshots: `360-en-owner-empty.png`, `390-ta-owner-empty.png`, `360-ta-test-compare.png`, `390-en-test-detail.png`. Owner empty state and both synthetic paths were visually inspected.
- Source/reference and pending decisions: `data-review.md`. Exact proposed bilingual profile corrections: `copy-candidates.md`. Approval of code or simulated data is not approval of real offerings or copy.

## Coherent real-record owner-preview candidate — 2026-10-29

This later authorized implementation supersedes the earlier empty-preview snapshot above, preserving its evidence. Baseline main/origin main `95e73f22273dcbc4081cf333516958b8473198e4`; review branch/origin baseline `752f39e30ba2a1a47aebeea0aa75b1f61a1ab318`. Five pre-existing modified files were preserved. Presentation owner PASS remains PENDING; technically prepared is not student-ready or M4 accepted.

- 389 colleges / 3,128 dated offerings; 226 excluded, all 191 exceptions preserved. Additional metadata: 52 literal source fields for seven accepted identities; [trace, exact field IDs and gaps](data-review.md#coherent-owner-preview-path--metadata-trace-and-remaining-gates).
- Nine existing exact links connect to the independent explanation gate, with zero real profiles released. [Six corrected English candidates, unchanged Tamil hashes and scoped official checks](copy-candidates.md#focused-evidence-and-correction-check--2026-10-29-candidate-revision-2). No generated replacement explanation.
- College-first and branch-first navigation, pending state, source disclosure, filters, cross-page temporary comparison, language context and guided-journey return passed on actual real-record pages in all four language/width combinations. [Browser checks](coherent-path-checks.json). Approved-copy behavior was tested only with explicitly test-only injected profiles; this is not actual content approval.
- Full offline suite **309/309 PASS**; strict typecheck PASS; focused directory tests **10/10 PASS**. Manifest/data tampering, exact associations, held/edited/duplicate profiles, additional field holds, opt-in access and ordinary journey isolation tested. No M2/M3 implementation or deterministic rule changed.
- Real-record owner-preview screenshots (not synthetic): [360px Tamil college](coherent-college-ta-360.png), [390px English programme](coherent-programme-en-390.png), [360px Tamil metadata and evidence](coherent-metadata-ta-360.png). Representative screenshots visually inspected; no horizontal overflow at 360px/390px. Engineering checks do not constitute human bilingual or student validation.
- Local review entry `/internal/m4-pilot?lang=ta&view=branches`, explicitly enabled with `M4_OWNER_REVIEW=1` on loopback. Each internal page links to `/journey?step=awareness` in the selected language. No link to the internal preview was added to normal student navigation; no access/authentication claim, hosting or deployment.

Next single owner action: review this candidate and record the presentation outcome alongside the consolidated P01–P06 factual/English/release dispositions. Keep all unresolved fields and mapping holds explicit. Commit/push is authorized; merge and student use are not.

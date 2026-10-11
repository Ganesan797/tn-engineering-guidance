# T03 compare-page copy alignment — 2026-10-11

Review branch: `codex/t03-journey-compare-copy`. Base: `9aa80fe1dc965fdd84b63bd833922c78ae3e69ea`. Merge not authorized.

## Cause and bounded change

`src/ui/m2-journey.ts` rendered compare-page excerpts through `reviewedAwarenessTamilQuestion` from the historical A01–A07 V2 batch. The October 10 sync updated the separate 70-question JSON collection, not these excerpts.

Only the compare branch now uses the approved Q036, Q047 and Q049 Tamil answer/detail wording from [the October 10 source](t03_bilingual_conversational_copy_refined_2026-10-10.md). Q035 is not substituted. The opening semicolon becomes a sentence break. Question records, historical batches, CSS, headings, evidence notices, links, state handling and deterministic logic are unchanged.

Before: compressed English/Tamil terms (`coding/systems; circuits/signals`), the short branch map, and compressed four-way computing comparison. After: the approved conversational Tamil equivalents, including the explicit no-aptitude-verdict, no-ranking, CSE (AI & ML)-specific and no-job-guarantee qualifications. Existing R2025 Revised 1 institution/year limitations remain.

## Checks and limitations

- Focused UI suite: 12/12 PASS. Full offline suite: 211/211 PASS. Strict typecheck: PASS.
- Rendered at 360×800 and 390×800: Tamil readable, no horizontal overflow; document widths 345 and 375 px (scrollbar excluded).
- Action block and destinations remain in the same document position after evidence/review notice: study, route, awareness. Absolute document Y changes from 2020.97 to 2641.95 px at 360, and 1936.83 to 2501.72 px at 390, due to longer approved copy. Pixel position is not unchanged; no layout compensation or layout-branch merge was performed.
- `/journey?step=compare&lang=en` still renders `lang=ta`: no English compare implementation exists. The bilingual question collection remains unchanged. English compare validation is unavailable, not PASS; adding it is outside this copy-only correction.
- Local review: http://127.0.0.1:3196/journey?step=compare (this computer only).
- Q021 remains PARTIAL; T04 NOT_RUN; M2 acceptance PENDING. No live model calls, new facts, frozen-document edits or new human approval claimed.

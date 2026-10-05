# T04 bounded UI-readiness pass — 2026-10-04

**2026-10-05 branch reconciliation:** This dated record describes the original UI-only pass. After `origin/main` added the October 5 owner-reviewed bilingual copy, the two local commits were rebased without conflict as `bc3f0ea8d7a3cbb67899578e94b317181a4b126a` (UI placement) and `2825572248982e4baf1a588a9a9285548f2effcc` (this record/status). The subsequent [wording reconciliation](t04_wording_reconciliation_2026-10-05.md) changes question-page copy, so this original UI-only commit is not the combined T04 candidate or a frozen student-test baseline. The original SHA references below remain historical evidence for the pre-rebase local pass.

## Inspection record before implementation edits

Baseline: `1aefe20f023169c38d87f4b865ee61d133e70263` (clean integrated main). Inspected the actual locally served journey in the in-app browser at 390×844; unknown-result/retry also checked at 320×740. This is a technical walkthrough, not a student session or owner approval.

| ID | Observed evidence | Disposition before editing |
| --- | --- | --- |
| UI01 | On the 390px start page, the first navigation choice begins at document y=2589.7px; direct check begins at y=2839.1px. The four choices follow every expanded awareness card and review notice, so both route selection and direct entry require several screens of scrolling. | Move the existing four-choice navigation immediately after the approved AW-01 introductory card. Preserve exact labels, destinations, priority and POST state behavior; do not require Study → Compare → Route. |
| UI02 | Start/study/compare show A01–A07 V2 identifiers and saved pending-review notices; route/preparation and question bank still show their historical review notices even though the later owner T03 decisions are recorded. | Leave wording unchanged in this presentation-only correction. Independent volunteer approval is still not claimed; saved notices remain conservative. Do not erase source/year/draft qualifications. Any later notice rewrite needs exact item-level factual/Tamil re-review under this task's rule. |

No confirmed overflow at inspected phone widths; legible Tamil, differentiated primary buttons and secondary actions, optional-bank labels, visible uncertainty/cutoff distinction, explicit next action and evidence disclosures observed. The 86/78/81 synthetic flow returned 165.5/200 with separate NEEDS_REVIEW. Unknown Physics produced no cutoff; route detour and retry preserved Mathematics. Q021 stayed PARTIAL; switching to English retained Q021/A06. These observations do not establish comprehension in 5–10 minutes.

UI01 is fixed by the presentation-only change below; UI02 is intentionally unchanged, not silently resolved. T04 remains NOT RUN; M2 acceptance PENDING; Gemini PAUSED; Live LLM Gate PARTIAL.

## Fix and T03 preservation

Exact proposed T04 content baseline: `139e670d64134faecead4778d81a9d13cc4b56e0`, local branch `codex/t04-ui-readiness`. This is proposed, not an owner-frozen baseline; main is unchanged. This document and status updates are subsequent documentation-only records, not additional application changes.

The existing four-choice navigation was moved intact from below A01/A04 and the review notice to directly after AW-01. Before: start → all expanded introductory content → choices. After: start → approved engineering introduction → optional Study / Compare / TNEA / direct check choices; the full expanded awareness content remains below. No question, stage or compulsory sequence was added. At 390×844, first-choice document y changed from 2589.7px to 940.8px; direct entry from 2839.1px to 1190.2px. It still requires scrolling past the introduction; this is not a claim of instant discoverability or student comprehension.

Removing the identical navigation fragment from both old/new source yields identical source text (newline-normalized comparison). All labels, next-action destinations, numbers, conditions, qualification text, sources, 70 answers, rules, form-state logic and styles are unchanged. Therefore the existing [T03 human factual/Tamil attribution](t03_factual_tamil_review_worksheet_2026-10-04.md) remains applicable to unchanged wording; no new wording/meaning requiring focused T03 re-review was introduced. J01/J16 placement changed and needs owner visual readiness confirmation, not an invented human PASS. Q021 stays PARTIAL.

UI02's saved developer/content-version identifiers and conservative review notices remain visible. A notice rewrite would change reviewed wording and is intentionally deferred; independent volunteer approval is not claimed. Ganesan's later human reviews remain recorded in T03. No material year, unsupported-case, uncertainty, scope or draft qualification was hidden. The evidence disclosure remains separate from visible result/uncertainty and next actions.

## Post-fix owner-facing technical walkthrough

Served the exact baseline implementation locally at `http://127.0.0.1:3193/journey`; browser shown for the walkthrough at 390×844. No real participant or owner re-approval is claimed.

| Path/check | Observed result |
| --- | --- |
| Marks-free primary path | Start → directly choose TNEA → preparation; no marks, branch decision or question bank needed. Definition remains before choices. |
| Optional exploration | Route → Study; opened computing disclosure; Compare and four-way comparison disclosure; return to introduction. TNEA remains directly reachable without completing either optional page. |
| Direct entry | Start's existing direct-check choice opens year prompt without an awareness completion flag. |
| Retained context | Synthetic 2026/academic/no improvement/Mathematics 86 → route detour → return to Physics, without asking Mathematics again. |
| Unknown and retry | Unknown Physics produces no guessed cutoff, separate NEEDS_REVIEW, missing-information next action and retry. Retry retains Mathematics and returns to Physics. |
| Supported result | Resume with Physics 78 and Chemistry 81 → 165.5/200 plus separate NEEDS_REVIEW; rank/seat caveat and useful next action stay visible. |
| Mobile layout | 390px start/study/compare and opened disclosures did not overflow horizontally (document width 375px with scrollbar). Pre-fix 320px unknown/retry also had no overflow; those screens/styles are unchanged. |
| Question bank/languages | Pre-fix inspection confirmed optional labels, visible Q021 PARTIAL/limits, English switch retaining Q021/A06, explicit return to Tamil journey. This code is unchanged; focused tests freshly covered all 70 pairs, switching and missing-translation behavior. |
| Evidence and controls | Existing disclosures, source-year footers, secondary links, continue/unknown buttons and draft limits retained. In-page return/retry verified; arbitrary browser-back/reload recovery is not promised by the existing state contract. |

Screenshots were saved locally outside Git: `t04-choices-390.jpg`, `t04-unknown-390.jpg`, `t04-result-390.jpg` in this chat's visualization directory. They show synthetic data only and are supplied in the completion report; they are not human-review evidence.

## Checks executed and remaining gates

- Focused journey tests: **11/11 PASS**, including the new ordering assertion proving all four choices occur after AW-01 but before optional expanded A01 content, once only.
- Complete offline suite: **210/210 PASS** (includes secret-protection regressions).
- Strict TypeScript check: **PASS**.
- Diff/integrity: navigation-only application change; no wording/rule/content changes; documentation links, whitespace and bounded file scope checked.
- No live model call, production RAG, M3, deployment, main merge or push. Two local commits separate the tested implementation from its completion documentation.

**T04 = NOT RUN_WITH_REAL_STUDENTS. M2 acceptance = PENDING. Gemini = PAUSED. Live LLM Gate = PARTIAL.**

**NEXT_SINGLE_ACTION:** Ganesan confirms the proposed phone UI baseline (including the intentionally retained notices), then arranges the real-student session using the [prepared procedure](m2_one_journey_validation_plan_2026-10-03.md). This pass does not freeze the baseline or accept M2 on his behalf.

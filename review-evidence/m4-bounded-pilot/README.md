# Bounded M4 implementation — verification

- Owner review route: disabled by default; explicit local-only `M4_OWNER_REVIEW=1` process. Default and opt-in server behavior tested. The route is not a student release.
- Cohort preparation: seven accepted college identities, nine previously accepted exact links and nine **pending** source-stage offerings; six real educational copy candidates remain HOLD/FIX. No real offering or profile is promoted by a fixture approval.
- Focused UI/view-model checks: 24/24 pass (17 existing plus seven new). Full offline suite: 299/299 pass (`full-test.log`). Strict TypeScript: pass.
- Mobile Chrome: 36 checks at 360px and 390px, in Tamil and English. Actual governed route was checked for its honest empty state. The populated branch/college/detail and comparison journeys used separately marked synthetic fixtures only. Tests checked source, language switch, 2-option comparison and no horizontal overflow; `mobile-checks.json` records the runs.
- Screenshots: `360-en-owner-empty.png`, `390-ta-owner-empty.png`, `360-ta-test-compare.png`, `390-en-test-detail.png`. Owner empty state and both synthetic paths were visually inspected.
- Source/reference and pending decisions: `data-review.md`. Exact proposed bilingual profile corrections: `copy-candidates.md`. Approval of code or simulated data is not approval of real offerings or copy.

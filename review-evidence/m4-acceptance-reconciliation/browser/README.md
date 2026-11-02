# M4 browser verification — 2026-11-03

Command: `node scripts/verify-m4-browser.mjs`

Chrome 155.0.8059.85 ran product implementation `7458cc814e0b63982c7912f6bbefa6fb4d860e94` with `M4_OWNER_REVIEW=1`. The automated CDP walk used actual viewports 360×800, 390×800 and 1280×900 in Tamil and English. It exercised home, guided entry, programme search, approved CS explanation, branch-to-college navigation, college-first search, district/type filters, college detail, programme detail, language switching with retained branch/college/programme state and comparison selections, two-item comparison, and no-result recovery.

The 54 PNG files are browser screenshots, not static HTML renderings. `results.json` records route, language, actual viewport, document width and horizontal-overflow result for each captured state. This is engineering browser verification of the internal owner-review route; it is not real-student validation, public release approval or evidence for the 35 unregistered copy versions.

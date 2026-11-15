# Milestone M5 — Sub-Milestone 2: Student Shortlist, Ordering & Counselling Guidance Report (T08, T09, T10)

**Date:** 2026-11-15  
**Milestone:** M5 — Decision Support Adaptation  
**Sub-Milestone:** Sub-Milestone 2 — Student Shortlist, Manual Ordering & Next Actions (T08, T09, T10)  
**Branch:** `codex/m5-revised-cohort-t03-amendment`  
**Status:** COMPLETE (Ready for Owner Review at Final Milestone Closeout)  

---

## 1. Executive Summary

Sub-Milestone 2 provides immediate, student-controlled decision-support tools decoupled from marks, ranks, and predictive algorithms. It implements Tasks T08, T09, and T10 within the governed exploration environment:

1. **Task T08 — Marks-Free, Zero-Login Shortlist:**
   - Students can add or remove any of the 3,128 governed offerings (or active pilot offerings) to a private draft shortlist from any discovery view (`colleges`, `college`, `detail`, `compare`).
   - Shortlist state defaults to browser session memory and progressive URL search parameters (`shortlist=college~programme`), requiring zero user login or accounts.
   - Opt-in 30-day device storage (`localStorage`) is supported with a prominent shared-device warning specifically tailored for students accessing from browsing centres, schools, colleges, or public computers.
   - Strict data minimization: stored and persisted records contain strictly only offering keys (`college~programme`) and unix timestamps (`savedAt`, `expiresAt`)—strictly zero applicant marks, ranks, communities, categories, or personal identifiers.
   - Expired entries (>30 days) are automatically pruned on read with an honest explanatory status notice.
   - A single-action "Clear entire shortlist / விருப்பப்பட்டியலை முழுமையாக அழி" control immediately purges all in-memory and device-stored choices with a confirmation prompt.

2. **Task T09 — Manual Preference Ordering & Choice Drafting:**
   - Dedicated "My Shortlist / என் விருப்பப்பட்டியல்" view (`view=shortlist`).
   - Clear numbered sequence: Choice 1, Choice 2, Choice 3, ... (விருப்பம் 1, விருப்பம் 2, விருப்பம் 3, ...).
   - Interactive reordering controls on each choice:
     - Move Up (`▲` / மேலே நகர்த்து)
     - Move Down (`▼` / கீழே நகர்த்து)
     - Remove (`✕` / நீக்கு)
   - First item has Move Up disabled; last item has Move Down disabled.
   - **Strict manual ordering invariant:** Initial order reflects explicit addition order; entries are reordered solely through explicit student button actions. There is strictly zero algorithmic sorting, automated ranking, cut-off based ordering, or "best college" recommendations.
   - Accessible touch and keyboard controls: minimum 44px touch targets.
   - Print / Save as PDF capability (`window.print()`) with dedicated `@media print` stylesheets hiding controls, navigation, and disclaimers to produce a clean, parent/teacher-shareable physical choice worksheet.

3. **Task T10 — Governed Counselling-Process Guidance:**
   - Embedded bilingual (Tamil & English) educational guidance in the shortlist view:
     - **Single-Window Algorithm Priority:** Clear explanation that TNEA evaluates choice lists strictly top-to-bottom based on overall/community rank; Choice 1 is evaluated first, and lower choices are evaluated only if higher choices are full. Explains the golden rule: order choices by genuine preference, not cutoff fear.
     - **Five Tentative Allotment Confirmation Choices:** Detailed walkthrough of all 5 confirmation choices in TNEA tentative allotment:
       1. *Accept and Join (ஏற்றுக்கொண்டு சேர்கிறேன்)*
       2. *Accept and Upward Movement (ஏற்றுக்கொண்டு மேல்நோக்கி நகர்வு)*
       3. *Decline and Upward Movement (நிராகரித்து மேல்நோக்கி நகர்வு)* with caution on seat forfeit
       4. *Decline and Next Round (நிராகரித்து அடுத்த சுற்றுக்குச் செல்கிறேன்)*
       5. *Quit / Decline and Quit (விலகுகிறேன்)*
     - **Practical Next Steps:** Clear breakdown of:
       1. Certificate Verification at TFC / online
       2. Fee Payment (with official clarification that 7.5% government school quota students are 100% exempt from tuition, hostel, and examination fees)
       3. Downloading official Provisional Allotment Order from `tneaonline.org`
       4. In-person College Reporting with original documents before the deadline.

---

## 2. Technical Implementation Details

### 2.1 File Changes

- **`src/ui/m4-governed-pilot.ts`:**
  - Expanded `validViews` set to include `"shortlist"`.
  - Added parser for `shortlist` (and alias `sl`) query parameters with automatic deduplication.
  - Updated link and query helpers (`query`, `link`, `textLink`, `primary`, `crumbLink`) to preserve `shortlist` across navigation, filters, search, and language switching.
  - Added "+ Add to Shortlist" / "✓ In Shortlist (Remove)" action buttons to:
    - `colleges` view (`groupCard`)
    - `college` view (`programmeCard`)
    - `detail` view (prominent primary/active button)
    - `compare` view (each comparison column)
  - Added persistent top-bar navigation pill: `★ My Shortlist (N)` / `★ என் விருப்பப்பட்டியல் (N)`.
  - Implemented complete `page === "shortlist"` view with:
    - Responsive header and empty-state guidance
    - Shared-device warning and 30-day storage panel
    - Numbered choice cards with Up/Down/Remove actions
    - Print / Save PDF control and print stylesheet
    - T10 bilingual guidance accordions and step cards
  - Added progressive enhancement client script scoped strictly to `view=shortlist` to prevent interference with other views.

- **`tests/ui/m5-shortlist.test.ts`:**
  - 13 focused unit and integration tests covering:
    - Empty state bilingual copy
    - Offering key preservation and data minimization (zero marks/ranks/applicant info)
    - Deduplication and invalid offering filtering
    - Shared-device warning and storage notices
    - Clear Shortlist control
    - Manual ordering (Choice 1..N sequence and Up/Down/Remove controls)
    - Reversal / manual order preservation without algorithmic reordering
    - Print capability and print CSS
    - Single-window algorithm priority bilingual copy
    - 5 tentative allotment confirmation choices copy
    - Practical next steps (including 7.5% fee exemption notice)
    - Discovery integration across all views
    - Language and navigation retention

- **`package.json`:**
  - Registered `tests/ui/m5-shortlist.test.ts` in the test runner.

---

## 3. Verification & Test Evidence

- **Typecheck:** `npm run typecheck` (`tsc -p tsconfig.json`) exited with code 0 (0 errors).
- **Focused Unit Tests:** `node --test tests/ui/m5-shortlist.test.ts` → **13/13 PASS** (0 failed).
- **Full Test Suite:** `npm test` → **339/339 PASS** (0 failed, 0 skipped, 0 cancelled across all 28 test suites).
- **Regressions:** Zero regressions on existing M0–M4 benchmarks.

---

## 4. Next Step

Sub-Milestone 2 is complete. Proceed to **Sub-Milestone 3: Decision Support, Filters & Comparison (T05, T06, T07)** to surface the clean-room provisional minimum marks derived in Sub-Milestone 1 with student-controlled filters and honest limitations.

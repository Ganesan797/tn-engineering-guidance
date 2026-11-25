# Mobile-First Compact Filters & Choice-List UX Review (v1)

**Status:** `DRAFT_FOR_OWNER_REVIEW`  
**Date:** November 25, 2026  
**Target Route:** `/m5-guidance` (Cutoff Comparison & Choice List Planner)  
**Live Site Audited:** `https://tn-guidance-pilot.onrender.com/m5-guidance`  
**Repository:** `Ganesan797/tn-engineering-guidance`  
**Viewports Tested:** Primary: `360 × 800` (Mobile viewport standard); Secondary: `390 × 844` (iPhone standard); Desktop Reference: `1280 × 800`.

---

## Executive Summary

The `/m5-guidance` module serves as the critical transition bridge in the student journey: moving from initial branch and college awareness into **tactical list preparation** for the Tamil Nadu Engineering Admissions (TNEA) single-window counselling.

An empirical audit of the current live deployment on Render reveals a severe usability bottleneck on mobile devices:
1. **Vertical Sprawl**: On a standard `360 × 800` screen, the filter form alone spans **1,213 pixels** on the landing view. When a search is executed, the user must scroll through **1,542 pixels** (nearly two full screen heights) of stacked forms, warning cards, and meta bars before seeing the first college offering.
2. **Control Overload**: **14 controls** are visible before the first result, treating obscure counselling logistics (counselling rounds, quota streams, historical years) with the exact same visual weight as fundamental student criteria (cutoff, community, branch, district).
3. **Desktop Table in a Mobile Shell**: Each college offering is rendered inside a stacked table row that consumes **485 vertical pixels**, meaning only ~1.2 offerings fit per screen once results are finally reached.
4. **Disconnected Choice-Building**: Shortlisting an item triggers a full-page POST reload, and reviewing choices requires switching away to a separate top-level tab rather than having an immediate, persistent visual tally of selected choices.

This document proposes a **Balanced Mobile Filter & Choice-List Architecture** that:
- Reduces above-the-fold control height from **1,542px down to ~165px** (an **89.3% reduction**), bringing the first useful offering card into the initial screen.
- Separates controls into a strict **3-Tier Hierarchy**: Always Visible (Search + Active Chips), Level 2 Filter Sheet (Community, Branch, District, College Type), and Level 3 Collapsed Context (Round, Year, Quota).
- Introduces an immediate **Sticky Choice-List Tray** (`தேர்வு பட்டியல் · 7 | பார்க்க →`) that tracks selections without page reloads or tab confusion.
- Delivers a dedicated, minimalist **Manual Choice Order Planner** that reinforces the decisive statutory rule: *Order matters; Choice #1 must be the genuine first preference*.
- Strictly preserves all **non-predictive, deterministic truth boundaries**: zero commercial ranking, zero admission probabilities, zero "Safe/Target/Dream" categorizations, and purely arithmetic historical comparisons.

---

## Part 1 — Empirical Review of Current Live Mobile Implementation

### 1.1 Methodology & Environment
A headless instance of Google Chrome running DevTools Protocol was executed against the live production deployment (`https://tn-guidance-pilot.onrender.com/m5-guidance`) across `360 × 800` (CSS pixels, DPR 2.0) and `390 × 844` viewports. DOM bounding boxes, element heights, and control counts were extracted directly from the live runtime.

```
┌─────────────────────────────────────────────────────────────┐
│ CURRENT LIVE MOBILE RENDER (360 × 800)                      │
│                                                             │
│ 0px   ┌──────────────────────────────────────────────────┐  │
│       │ Header + Wayfinding Bar (119px)                  │  │
│ 119px ├──────────────────────────────────────────────────┤  │
│       │ Title & Intro Text (~178px)                      │  │
│ 297px ├──────────────────────────────────────────────────┤  │
│       │ Search Summary Card (84px)                       │  │
│ 381px ├──────────────────────────────────────────────────┤  │
│       │ Search input [q] (44px)                          │  │
│       │ Cutoff input [cutoff] (44px)                     │  │
│       │ Quota select [quota] (44px)                      │  │
│       │ Community select [community] (44px)              │  │
│       │ Round select [round] (44px)                      │  │
│       │ Year select [year] (44px)                        │  │
│       │ College Type select [type] (44px)                │  │
│       │ District select [district] (44px)                │  │
│       │ Specific College select [college] (44px)         │  │
│       │ Branch select [branch] (44px)                    │  │
│       │ Sort select [sort] (44px)                        │  │
│       │ Checkbox [only_available] (20px)                 │  │
│       │ Search & Compare Button [submit] (44px)          │  │
│ 1426px├──────────────────────────────────────────────────┤  │
│       │ Results Meta Bar & Pagination (96px)             │  │
│ 1542px├──────────────────────────────────────────────────┤  │
│       │ FIRST OFFERING ROW (485px height)                │  │
│       │ (CEG - Computer Science & Engineering)           │  │
│ 2026px└──────────────────────────────────────────────────┘  │
│                                                             │
│ * Screen viewport ends at 800px. Student must scroll 742px   │
│   past the fold before even the top edge of Row 1 appears!   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Measured Metrics

| Metric | Measured Value (360×800) | Measured Value (390×844) | Severity |
| :--- | :--- | :--- | :--- |
| **`ABOVE_THE_FOLD_CONTROL_HEIGHT`** | **1,542 px** | **1,542 px** | **CRITICAL** |
| **`CONTROLS_VISIBLE_BEFORE_FIRST_RESULT`** | **14 controls** | **14 controls** | **HIGH** |
| **`NUMBER_OF_FILTER_CONTROLS`** | **12 fields** | **12 fields** | **HIGH** |
| **Landing View Form Height** | **1,213 px** | **1,213 px** | **CRITICAL** |
| **Submit Button Position (Landing)** | **Y = 2,277 px** | **Y = 2,277 px** | **CRITICAL** |
| **Single Offering Card Height** | **485 px** | **460 px** | **HIGH** |
| **Offerings Visible in Initial Screen** | **0 offerings (0%)** | **0 offerings (0%)** | **CRITICAL** |
| **Offerings Visible After 1 Full Scroll** | **~0.5 offering** | **~0.6 offering** | **HIGH** |

### 1.3 Mobile Friction Points (`MOBILE_FRICTION_POINTS`)
1. **Initial Screen Blindness**: Upon opening `/m5-guidance` or submitting a search, the mobile student sees zero colleges. The entire viewport is consumed by cascading select menus and advisory cards.
2. **Flattened Hierarchy**: Essential filters that a student changes constantly (Community, Branch, District) are stacked alongside historical background settings (Round 1/2/3, Year 2025/2026, Quota Stream) with identical visual weight.
3. **Form Fatigue on Landing**: The landing screen requires scrolling through 13 separate form rows before reaching the submit button at Y = 2,277px. First-generation students assume the system is broken or that they must fill out every single dropdown before anything works.
4. **Stacked Table Cells as Cards**: Because the desktop layout is an HTML `<table>`, mobile CSS converts each `<tr>` into a `display: block` card with pseudo-elements (`::before`) for labels. This balloons each row to 485px tall, making browsing dozens of choices physically exhausting.
5. **Shortlist Action Disconnect**: When a student clicks "+ சேர்", the screen submits a full POST request that re-renders the page at the top. The student loses their scroll position and must scroll down 1,542px again to find where they left off.
6. **No Visual Shortlist Feedback**: The count of shortlisted items is buried in the top tab bar. There is no floating bar, badge, or notification confirming that the college was added to their personal draft list.

---

## Part 2 — Competitor Filter Research

We examined five representative platforms handling engineering counselling in India, specifically analyzing mobile filter patterns, active state handling, and choice-list preparation.

### 2.1 Competitor Analysis Matrix

#### 1. Official TNEA Portal (`cutoff.tneaonline.org` / DoTE Tamil Nadu)
- **`INITIAL_INPUTS`**: Academic Year (2024/2023), College Code/Name, Branch, District, Community (OC/BC/BCM/MBC/SC/SCA/ST).
- **`FILTERS`**: Raw cascading HTML select menus.
- **`SEARCH_STYLE`**: Server-side synchronous reload on submit.
- **`ACTIVE_FILTER_DISPLAY`**: Retained inside select inputs only; no active chips.
- **`FILTER_DRAWER_OR_INLINE`**: 100% Inline form at page top.
- **`RESULT_CARD_DENSITY`**: Raw horizontal HTML table (requires horizontal scrolling on mobile).
- **`SHORTLIST_OR_COMPARE_PATTERN`**: None. Students must manually write notes on paper or print PDFs.
- **`CHOICE_ORDERING_PATTERN`**: Handled separately inside candidate portal during active counselling window.
- **`MOBILE_STRENGTH`**: Official authoritative dataset; no ads or predatory marketing.
- **`MOBILE_WEAKNESS`**: Completely unresponsive table; impossible to read on a 360px screen without pinch-to-zoom; zero choice preparation aid.
- **`PATTERN_WORTH_BORROWING`**: Standardized community classification (OC, BC, BCM, MBC, SC, SCA, ST) and authentic college/branch naming.
- **`PATTERN_TO_AVOID`**: Unresponsive desktop tables; lack of shortlist mechanism.

#### 2. Careers360 TNEA Predictor (`careers360.com`)
- **`INITIAL_INPUTS`**: Cutoff mark / TNEA Rank, Category/Community, Gender, Domicile.
- **`FILTERS`**: Bottom sheet triggered by sticky bottom filter pill.
- **`SEARCH_STYLE`**: Instant client-side search with branch autocomplete.
- **`ACTIVE_FILTER_DISPLAY`**: Horizontal scrolling chip carousel right below search bar.
- **`FILTER_DRAWER_OR_INLINE`**: Mobile Bottom Sheet covering 85% of viewport with category tabs on left, options on right.
- **`RESULT_CARD_DENSITY`**: Modular cards (~150px tall), showing College name, Branch, Fees, and Predictor tag.
- **`SHORTLIST_OR_COMPARE_PATTERN`**: "Shortlist" bookmark icon on each card.
- **`CHOICE_ORDERING_PATTERN`**: None (relies on their proprietary algorithm to rank colleges).
- **`MOBILE_STRENGTH`**: Extremely compact filter trigger; bottom sheet is thumb-friendly; active chips easily removable (`✕`).
- **`MOBILE_WEAKNESS`**: Aggressive commercial lead capture (forces phone number / OTP modal after 3 scrolls); deceptive "Safe / Target / Dream" probability predictions.
- **`PATTERN_WORTH_BORROWING`**: Bottom sheet with sticky "Apply" button showing dynamic result count (`[ Show 142 Colleges ]`).
- **`PATTERN_TO_AVOID`**: Commercial lead capture walls; probability prediction labels; algorithmic auto-ordering.

#### 3. Shiksha College Search & Cutoff Interface (`shiksha.com`)
- **`INITIAL_INPUTS`**: Stream (Engineering), Location, Degree (B.Tech).
- **`FILTERS`**: Split-pane bottom sheet (Left: Filter categories; Right: Multi-select checkboxes).
- **`SEARCH_STYLE`**: Instant auto-suggest with fuzzy token matching.
- **`ACTIVE_FILTER_DISPLAY`**: Clean pill chips with `✕` dismiss icons.
- **`FILTER_DRAWER_OR_INLINE`**: Two-column bottom sheet modal.
- **`RESULT_CARD_DENSITY`**: Card format (~180px tall) with badges for ownership, accreditation, and fees.
- **`SHORTLIST_OR_COMPARE_PATTERN`**: "Compare" checkbox (up to 4 colleges) floating in sticky bottom tray.
- **`CHOICE_ORDERING_PATTERN`**: Side-by-side comparison matrix, but no counselling preference ordering.
- **`MOBILE_STRENGTH`**: Excellent active-chip carousel; sticky bottom comparison counter (`Compare (3) →`).
- **`MOBILE_WEAKNESS`**: Heavy visual noise (sponsored badges, ratings, placement statistics, agent call-back buttons).
- **`PATTERN_WORTH_BORROWING`**: Sticky bottom comparison tray showing count and one-tap action (`[ 3 Selected | Compare → ]`).
- **`PATTERN_TO_AVOID`**: Commercial ratings and sponsored prominence that distort objective merit.

#### 4. CollegeDekho (`collegedekho.com`)
- **`INITIAL_INPUTS`**: Exam, Cutoff range, State.
- **`FILTERS`**: Filter pill bar with quick-tap dropdowns.
- **`SEARCH_STYLE`**: Keyword search with search history.
- **`ACTIVE_FILTER_DISPLAY`**: Single line chip list.
- **`FILTER_DRAWER_OR_INLINE`**: Full-screen slide-over drawer on mobile.
- **`RESULT_CARD_DENSITY`**: High density list (120px per card).
- **`SHORTLIST_OR_COMPARE_PATTERN`**: "Add to Wishlist" heart icon.
- **`CHOICE_ORDERING_PATTERN`**: None.
- **`MOBILE_STRENGTH`**: High result density; quick thumb access.
- **`MOBILE_WEAKNESS`**: High distraction level; misleading "100% Placement Guaranteed" claims.
- **`PATTERN_WORTH_BORROWING`**: High density card layout fitting 3–4 results per screen view.
- **`PATTERN_TO_AVOID`**: Cluttered promotional text; fake popularity badges.

#### 5. Collegedunia (`collegedunia.com`)
- **`INITIAL_INPUTS`**: Course, State, City.
- **`FILTERS`**: Sticky sub-header with horizontal filter buttons (`City ▼`, `Stream ▼`, `Fees ▼`, `All Filters`).
- **`SEARCH_STYLE`**: Top navbar universal search.
- **`ACTIVE_FILTER_DISPLAY`**: Chips with clear-all trigger.
- **`FILTER_DRAWER_OR_INLINE`**: Bottom sheet modal.
- **`RESULT_CARD_DENSITY`**: Medium card (~160px).
- **`SHORTLIST_OR_COMPARE_PATTERN`**: Shortlist bookmark icon.
- **`CHOICE_ORDERING_PATTERN`**: None.
- **`MOBILE_STRENGTH`**: Clean horizontal filter bar anchored below main navigation.
- **`MOBILE_WEAKNESS`**: Cluttered with unverified user reviews and aggressive counseling popups.
- **`PATTERN_WORTH_BORROWING`**: Horizontal filter bar with instant badge counts (`Filters (2)`).
- **`PATTERN_TO_AVOID`**: Pop-up interruptions.

---

### 2.2 Filter Candidate Evaluation for Our Civic Guidance System

| Candidate Filter | Useful for Our Product? | Justification & Placement |
| :--- | :--- | :--- |
| **College Search (Name/Acronym)** | **ESSENTIAL (Level 1)** | Students search by CEG, PSG, CIT, GCT, or partial names. Must stay always visible. |
| **Community Category** | **ESSENTIAL (Level 1)** | TNEA cutoffs are strictly community-dependent (OC, BC, BCM, MBC, SC, SCA, ST). Must be instantly accessible via chips. |
| **Branch / Stream** | **ESSENTIAL (Level 1 & 2)** | Students filter by CSE, ECE, Mech, AIDS. Essential in quick chips and sheet. |
| **District / Region** | **ESSENTIAL (Level 2)** | Family location constraints (near home vs hostel) are decisive in TN engineering choices. |
| **College Type (DOTE)** | **HIGH VALUE (Level 2)** | Govt, Aided, AU Dept, Constituent, Self-Financing. Critical for fee and governance clarity. |
| **Student Cutoff** | **HIGH VALUE (Level 1 & 2)** | Arithmetic baseline for delta comparison. Must remain editable without page reload. |
| **Allotment Round** | **SECONDARY (Level 3)** | Auto-selected by cutoff (R1 ≥ 179, R2 ≥ 145, R3 < 145). Overridable in advanced context. |
| **Historical Year** | **SECONDARY (Level 3)** | 2025 is the governing benchmark. Rarely toggled; belongs in advanced drawer. |
| **Quota Stream** | **SECONDARY (Level 3)** | General Academic by default. 7.5% Govt School or Vocational placed in advanced sheet. |
| **Fee Structure** | **EXCLUDE AS HARD FILTER** | Official TNEA fees vary by G.O. (e.g. 7.5% waiver, First Graduate). Informational note only. |
| **Placement Percentage** | **STRICTLY REJECT** | Commercial, unverifiable, violates statutory evidence boundary. |
| **College Ranking / Tier** | **STRICTLY REJECT** | No NIRF/commercial tiering. Violates non-ranking charter. |

---

## Part 3 — Proposed Filter Hierarchy (3 Levels)

To balance immediate mobile visibility with comprehensive filtering power, all controls are organized into three distinct tiers:

```
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 1: ALWAYS VISIBLE (Above the fold · ~165px total)         │
│ • Universal Search Input (College Name, Acronym, Branch Code)   │
│ • Active Filter Chips Carousel (Dismissible with ✕)             │
│ • Filter Trigger Pill [ ⚙️ வடிகட்டிகள் (3) ] + Live Result Count  │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Tap "வடிகட்டிகள்"
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 2: MOBILE BOTTOM SHEET (Modal Drawer · 80% Viewport)      │
│ • Community Choice Chips: [ OC ] [ BC ] [ BCM ] [ MBC ]...      │
│ • Branch Selector: Searchable popular chips + full list         │
│ • District Selector: Top education hubs + district search       │
│ • College Type (DOTE): [ அரசு ] [ உதவிபெறும் ] [ சுயநிதி ]...   │
│ • Student Cutoff Input (Numeric keypad, instant validation)     │
│ • Sticky Footer: [ மீட்டமை ]  [ 124 முடிவுகளைக் காட்டு ]        │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Expand "கூடுதல் விவரங்கள்"
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ LEVEL 3: ADVANCED / HISTORICAL CONTEXT (Collapsed Section)      │
│ • Allotment Round (Round 1 / Round 2 / Round 3 / All Rounds)    │
│ • Historical Reference Year (2025 benchmark / 2024 archive)     │
│ • Quota Stream (General Academic / 7.5% Govt School / Voc)      │
│ • Specific College Code / Branch Code direct lookup             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 4 — Compact Mobile Filter Concept

### 4.1 Visual Wireframe (360px Viewport)

```
0px   ┌──────────────────────────────────────────────────┐
      │ தமிழ்நாடு பொறியியல் வழிகாட்டி           தமிழ் | EN │ (50px)
50px  ├──────────────────────────────────────────────────┤
      │ சேர்க்கைப் பாதை: நிலை 4/4 · விருப்பப் பட்டியல்    100% │ (36px)
86px  ├──────────────────────────────────────────────────┤
      │ 🔍 கல்லூரி, படிப்பு அல்லது சுருக்கம்...         │ (44px Search)
130px ├──────────────────────────────────────────────────┤
      │ [ BC × ] [ CSE × ] [ கோவை × ] [ 185.50 ] [+]    │ (36px Chips)
166px ├──────────────────────────────────────────────────┤
      │ [ ⚙️ வடிகட்டிகள் (3) ]       142 வாய்ப்புகள் உள்ளன │ (34px Bar)
200px ├──────────────────────────────────────────────────┤
      │ ┌──────────────────────────────────────────────┐ │
      │ │ CEG Campus, Anna University          [ 0001 ]│ │ (Result Card 1)
      │ │ அரசுத் துறை · சென்னை                        │ │
      │ │ Computer Science & Engineering (CS)          │ │
      │ │ 2025 கட்-ஆஃப்: 194.50 · உங்கள் மதிப்பெண்: 185.50│ │
      │ │ வரலாற்று வித்தியாசம்: -9.00                    │ │
      │ │                                  [ + சேர் ]  │ │
      │ └──────────────────────────────────────────────┘ │
      │ ┌──────────────────────────────────────────────┐ │
      │ │ PSG College of Technology            [ 2006 ]│ │ (Result Card 2)
      │ │ அரசு உதவிபெறும் · கோயம்புத்தூர்               │ │
      │ │ Information Technology (IT)                  │ │
      │ │ 2025 கட்-ஆஃப்: 188.00 · உங்கள் மதிப்பெண்: 185.50│ │
      │ │ வரலாற்று வித்தியாசம்: -2.50                    │ │
      │ │                                  [ + சேர் ]  │ │
      │ └──────────────────────────────────────────────┘ │
735px ├──────────────────────────────────────────────────┤
      │ [📋 முகப்பு]    [🔍 தேடல்]    [📊 கட்-ஆஃப்]   [📑 பட்டியல்] │ (65px Bottom)
800px └──────────────────────────────────────────────────┘
```

### 4.2 Impact on Screen Real Estate
- **Old Control Height**: 1,542 px.
- **New Control Height**: 200 px (Header + Search + Chips + Trigger Bar).
- **Space Saved**: **1,342 pixels (87% reduction)**.
- **Result Visibility**: Card 1 is **100% visible** on initial render without any scrolling. Card 2 is **70% visible** above the fold.

---

## Part 5 — Filter Bottom Sheet Specification

When the student taps `[ ⚙️ வடிகட்டிகள் (3) ]`, an animated bottom sheet slides up covering ~80% of the viewport.

```
┌────────────────────────────────────────────────────────┐
│                        ──────                          │ (Drag handle)
│ வடிகட்டிகள் (3 தேர்வு)                           மீட்டமை │ (Header)
├────────────────────────────────────────────────────────┤
│ 1. உங்கள் பிரிவு (Community) *                          │
│ [ OC ]  [ BC ✓ ]  [ BCM ]  [ MBC ]  [ SC ] [ SCA ] [ST]│ (Choice Chips)
│                                                        │
│ 2. உங்கள் கட்-ஆஃப் (Cutoff Mark)                       │
│ [ 185.50                                      / 200 ]  │ (Number input)
│                                                        │
│ 3. விரும்பும் பாடப்பிரிவு (Branch / Stream)             │
│ [ CSE ✓ ]  [ ECE ]  [ IT ]  [ AI&DS ]  [ Mech ]  [+]   │ (Multi-select)
│ [ 🔍 பிற படிப்புகளைத் தேடுங்கள்...                  ]  │
│                                                        │
│ 4. மாவட்டம் (District)                                 │
│ [ சென்னை ] [ கோவை ✓ ] [ மதுரை ] [ திருச்சி ] [ பிற ▼ ]  │ (Hub chips)
│                                                        │
│ 5. கல்லூரி வகை (DOTE Classification)                   │
│ [ அனைத்தும் ] [ அரசு ] [ உதவிபெறும் ] [ சுயநிதி ]       │
│                                                        │
│ ▸ கூடுதல் அமைப்புகள் (சுற்று 1, ஆண்டு 2025, ஒதுக்கீடு)   │ (Collapsed)
├────────────────────────────────────────────────────────┤
│           [ 142 வாய்ப்புகளைக் காட்டு → ]                │ (Sticky CTA)
└────────────────────────────────────────────────────────┘
```

### 5.1 Interaction Details
- **Choice Chips**: 44px minimum tap targets with high-contrast active states (`#0f766e` teal background, white bold text).
- **Live Match Count**: The sticky CTA button updates its count in real-time as filters are toggled (e.g. *“142 வாய்ப்புகளைக் காட்டு”*). If zero matches exist, the button reads *“பொருந்தும் வாய்ப்புகள் இல்லை (வடிகட்டிகளை மாற்றவும்)”* and disables.
- **Instant Reset**: Tapping *“மீட்டமை”* (Reset) clears non-essential filters (Branch, District, College Type) while safely retaining the student's entered Cutoff and Community.
- **Explicit Apply**: Changes apply when tapping the CTA button, closing the sheet and focusing directly on the refreshed list.

---

## Part 6 — Active Filter Chips Specification

To avoid student disorientation, active filters are displayed in a clean, horizontally scrollable carousel immediately below the search box.

### 6.1 Differentiating Student Criteria from Historical Context

A critical UX risk in cutoff guidance is students confusing **their personal profile** with **the historical data setting**. We resolve this by strictly separating the chips into two distinct visual styles:

```
┌──────────────────────────────────────────────────────────────────────────┐
│ மாணவர் விருப்பங்கள் (Student Criteria - Teal Chips, Removable):          │
│ [ BC ✕ ]   [ CSE ✕ ]   [ கோயம்புத்தூர் ✕ ]   [ கட்-ஆஃப்: 185.50 ✕ ]      │
│                                                                          │
│ வரலாற்றுத் தரவு வரம்பு (Historical Benchmark Context - Subtle Slate Pill):  │
│ ℹ️ 2025 தரவு · பொதுக் கலந்தாய்வு (General Academic) · சுற்று 1           │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Student Criteria Chips**: High contrast, white background with teal border (`#0f766e`), clear `✕` tap target (minimum 36px) to remove instantly.
- **Historical Context Pill**: Static, muted slate (`#f1f5f9`), indicating that cutoffs shown are from the 2025 General Academic Round 1 benchmark. Tapping opens Level 3 settings.

---

## Part 7 — Result-Card Simplification & Density Analysis

### 7.1 Current 485px Card vs Proposed 145px Compact Card

```
CURRENT LIVE MOBILE ROW (485px)                PROPOSED COMPACT CARD (145px)
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│ CEG Campus, Anna University            │     │ CEG Campus, Anna Univ          [ 0001 ]│
│ [ 0001 ] [ அரசுத் துறை ]               │     │ அரசுத் துறை · சென்னை                   │
│ மாவட்டம்: CHENNAI                      │     │ Computer Science & Engg (CS)           │
│ 14 படிப்புகள் உள்ளன                     │     │ ────────────────────────────────────── │
│ ────────────────────────────────────── │     │ 2025 கட்-ஆஃப்: 194.50 · உங்கள் மதிப்பெண்:185.5│
│ [ CS ] Computer Science & Engineering  │     │ வரலாற்று வேறுபாடு: -9.00 (ஒப்பீடு மட்டும்)│
│ ────────────────────────────────────── │     │ [ படிப்பு விவரம் ]         [ + பட்டியலில் ]│
│ 2025 கட்-ஆஃப்: 194.50                  │     └────────────────────────────────────────┘
│ சுற்று 1 · 2026                        │     • 70% height reduction
│ ────────────────────────────────────── │     • Fits 3–4 offerings per mobile screen
│ உங்கள் கட்-ஆஃப் வேறுபாடு: -9.00         │     • Clear separation of observed cutoff
│ கடந்த ஆண்டுத் தரவு மட்டுமே — சேர்க்கை   │       and student cutoff
│ உத்தரவாதமோ கணிப்போ அல்ல                │     • Obvious "+ பட்டியலில்" bookmark action
│ ────────────────────────────────────── │
│ [ 2025 · சுற்று 1 ] (source dropdown)  │
│ ────────────────────────────────────── │
│ [ + விருப்பப் பட்டியலில் சேர் ]       │
└────────────────────────────────────────┘
```

### 7.2 Safe Arithmetic Representation vs Prediction Pitfalls
- **The Risk**: Displaying large green `+5.00` or red `-12.00` badges triggers psychological association with "Pass/Fail" or "Guaranteed Admission".
- **The Safe Design**:
  - Show the factual observed cutoff in neutral, high-contrast text: `2025 கட்-ஆஃப்: 194.50`.
  - Show student's cutoff side-by-side: `உங்கள் மதிப்பெண்: 185.50`.
  - State the arithmetic delta quietly: `வரலாற்று வேறுபாடு: -9.00`.
  - Include an explicit, subtle footnote: `வரலாற்று ஒப்பீடு மட்டுமே · சேர்க்கை கணிப்பு அல்ல (Historical comparison only — not a prediction)`.

---

## Part 8 — End-to-End Choice-List Workflow

The student's journey must flow through five intuitive phases without cognitive friction or repetitive full-page reloads:

```
┌─────────┐      ┌─────────┐      ┌─────────────┐      ┌───────────┐      ┌────────┐
│ 1. தேடு  │ ───> │ 2. சேர்  │ ───> │ 3. சரிபார்   │ ───> │ 4. வரிசை  │ ───> │ 5. அச்சி│
│ EXPLORE │      │   ADD   │      │ REVIEW LIST │      │  ARRANGE  │      │ EXPORT │
└─────────┘      └─────────┘      └─────────────┘      └───────────┘      └────────┘
```

1. **EXPLORE (தேடல் & ஒப்பீடு)**:
   Student enters cutoff (e.g. 185.50), selects community (BC), and searches branch/district. Results display with observed cutoffs and arithmetic deltas.
2. **ADD (+ சேர்)**:
   Student taps `[ + சேர் ]` on any offering card.
   - **Interaction**: The button immediately transitions into an affirmative state `[ ✓ சேர்க்கப்பட்டது ]` (green border, soft checkmark).
   - **State Persistence**: Updated via client-side storage / lightweight background sync. The student stays at the exact same scroll position without screen jumping.
   - **Feedback**: The bottom sticky bar updates from `0` to `1` choice.
3. **REVIEW LIST (பட்டியல் ஆய்வு)**:
   Tapping the sticky bar opens the dedicated Choice Planner, displaying all saved options in a clean summary table.
4. **ARRANGE (முன்னுரிமை வரிசைப்படுத்துதல்)**:
   Student manually reorders choices so their true dream college is #1, realistic options are in the middle, and safe options are at the bottom.
5. **EXPORT (பதிவிறக்கம் / அச்சிடுதல்)**:
   Student exports clean Plain Text, tabular CSV, or triggers ink-friendly print view to take to the official TNEA portal when choice filling opens.

---

## Part 9 — Sticky Choice-List Floating Bar

### 9.1 Anatomy & Placement
When the student has added ≥ 1 choice to their list, a persistent floating bar appears at the bottom of the screen, docked cleanly **just above the bottom site navigation bar**:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│ [Offering Card 1]                                      │
│ [Offering Card 2]                                      │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 📋 என் தேர்வுப் பட்டியல்: 7 கல்லூரிகள்    வரிசைப்படுத்து →│ │ (Sticky Bar)
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ [🏠 முகப்பு]    [🔍 தேடல்]    [📊 கட்-ஆஃப்]    [📑 பட்டியல்] │ (Site Bottom Nav)
└────────────────────────────────────────────────────────┘
```

### 9.2 Coexistence Rules
- **Zero Content Overlap**: A dynamic `padding-bottom: 120px` is injected on `main` so the floating bar never obscures the bottom card or pagination buttons.
- **Count Indicator**: Clearly displays `7 கல்லூரிகள்` (or `7 choices`).
- **Single Tap Navigation**: Tapping anywhere on the bar transitions directly to the Choice List Ordering view.
- **Zero Choices State**: Completely hidden when list count is 0. Does not take up space until the student actively saves an option.

---

## Part 10 — Choice-List Preparation & Priority Ordering Screen

When opening the Choice Planner (`/m5-guidance?tab=shortlist`), the entire UI focuses on **priority decision-making**.

```
┌────────────────────────────────────────────────────────┐
│ ← கல்லூரிகளைத் தொடர்ந்துத் தேடுங்கள்                   │ (Back link)
│                                                        │
│ என் விருப்பப் பட்டியல் (Choice Planner)                 │
│ மொத்தம் 7 தேர்வுகள் உள்ளன                              │
│                                                        │
│ ⚠️ மிக முக்கியமான விதி (Critical TNEA Rule):          │
│ TNEA கலந்தாய்வில் உங்கள் முதல் விருப்பத்தில் (Choice 1) │
│ தொடங்கி கீழாகவே இடங்கள் ஒதுக்கப்படும். எனவே உங்களுக்கு   │
│ மிகவும் பிடித்த கல்லூரியையே முதல் இடத்தில் வைக்கவும்.      │
├────────────────────────────────────────────────────────┤
│ 1. [ ↑ ] [ ↓ ] [ 1 ▾ ]                            [ ✕ ]│
│    University Departments of Anna University - CEG     │
│    Computer Science and Engineering (CS) · 194.50      │
│                                                        │
│ 2. [ ↑ ] [ ↓ ] [ 2 ▾ ]                            [ ✕ ]│
│    PSG College of Technology, Coimbatore               │
│    Information Technology (IT) · 188.00                │
│                                                        │
│ 3. [ ↑ ] [ ↓ ] [ 3 ▾ ]                            [ ✕ ]│
│    Government College of Technology, Coimbatore        │
│    Computer Science and Engineering (CS) · 186.50      │
│                                                        │
│ 4. [ ↑ ] [ ↓ ] [ 4 ▾ ]                            [ ✕ ]│
│    Thiagarajar College of Engineering, Madurai         │
│    Electronics and Communication Engg (EC) · 184.00    │
├────────────────────────────────────────────────────────┤
│ [ 📄 உரை வடிவத்தில் நகலெடு ]    [ 📊 CSV அட்டவணை ]      │
│ [ 🖨️ அச்சிடுக (Print List) ]                            │
└────────────────────────────────────────────────────────┘
```

### 10.1 Key Ordering Principles
- **No Automatic Sorting**: The software **never** auto-arranges options by cutoff, NIRF rank, or popularity. The student owns 100% of the decision.
- **Educational Framing**: Prominently warns students against placing safe options at the top out of fear.
- **Clear Controls**: Each item has dedicated Move Up (`↑`), Move Down (`↓`), Move to Position (`[ n ▾ ]`), and Delete (`✕`) actions.

---

## Part 11 — Lightweight Student Planning Aids (Non-Ranking)

Students often struggle to remember *why* they selected a particular college when reviewing a list of 20+ options. We propose **lightweight, optional student tags**:

```
┌────────────────────────────────────────────────────────┐
│ 3. GCT Coimbatore — CSE (186.50)                       │
│    எனது குறிப்பு (Personal Tag):                        │
│    [ ஊருக்கு அருகில் ✓ ] [ விடுதி தேவை ] [ குறைந்த கட்டணம் ] │
└────────────────────────────────────────────────────────┘
```

- **Factual, Personal Tags**:
  - `ஊருக்கு அருகில்` (Near Home / Practical Commute)
  - `குறைந்த கட்டணம்` (Low Fees / Govt Aided)
  - `விடுதி வசதி அவசியம்` (Hostel Accommodation Essential)
  - `முதல் விருப்பப் படிப்பு` (Dream Branch)
- **Zero Algorithmic Impact**: These tags are purely for the student and family's reference during discussion. The system does not compute scores, weights, or automatic suggestions from them.

---

## Part 12 — Scaling to Large Choice Lists (5, 20, 50, 100+ Options)

In TNEA counselling, active students frequently prepare lists containing 30 to 80 college-branch choices. Simple Move Up/Down buttons become unusable at this scale.

```
┌────────────────────────────────────────────────────────┐
│ SCALING CONTROLS FOR LARGE LISTS (30–80 CHOICES)       │
├────────────────────────────────────────────────────────┤
│ 1. Direct Position Jump:                               │
│    Tapping the rank badge opens a modal:               │
│    "Move #42 to Position: [  5  ] -> [ Confirm ]"      │
│                                                        │
│ 2. Drag-and-Drop Handle (for touch devices):           │
│    Smooth touch reordering with accessible keyboard     │
│    fallback for screen readers.                        │
│                                                        │
│ 3. In-List Filter / Quick Search:                      │
│    [ 🔍 பட்டியல் உள்ளே தேடு... (எ.கா. CSE, கோவை)   ]    │
│    Lets students filter their own list to inspect all  │
│    CSE options together before re-ranking them.        │
│                                                        │
│ 4. Compact Row View Toggle:                            │
│    [ ≡ சுருக்கமான பார்வை ] / [ ▤ விரிவான பார்வை ]        │
│    Condenses rows to 54px so 12 choices fit on screen. │
└────────────────────────────────────────────────────────┘
```

---

## Part 13 — Evaluation of Filter Presets

Competitors frequently provide presets like *"High Chance"*, *"Safe Bet"*, *"Dream Reach"*. **These are strictly prohibited under our truth charter.**

### Presets We Strictly Reject:
- ❌ `Safe Colleges` (Implies admission probability; cutoffs fluctuate year to year).
- ❌ `Dream Colleges` (Encourages unrealistic wishful thinking).
- ❌ `Top 10 Colleges` (Commercial ranking; unverified popularity).

### Factual, Non-Predictive Presets We Accept:
- ✅ `அரசு & அரசு உதவிபெறும் மட்டும்` (Government & Aided Campuses Only — strictly factual governance attribute).
- ✅ `தன்னாட்சி கல்லூரிகள் மட்டும்` (Autonomous Institutions Only — factual academic status).
- ✅ `சென்னை மண்டலம் / கோவை மண்டலம்` (Major Educational Hubs — strictly geographical).
- ✅ `எனது மதிப்பெண் வரம்பில் உள்ளவை (±5 மதிப்பெண்கள்)` (Historical Delta Range ±5 — strictly arithmetic band without probability claims).

---

## Part 14 — Standardized Tamil & English Mobile Terminology

To keep mobile buttons crisp and readable on 360px screens, long verbose phrases are replaced with concise, respectful Tamil terms:

| UI Context | Current Verbose / Clunky Copy | Proposed Concise Tamil Label | English Equivalent |
| :--- | :--- | :--- | :--- |
| **Filter Trigger** | வடிகட்டிகளைப் பயன்படுத்து | **வடிகட்டிகள் (Filters)** | Filters |
| **Reset Action** | வடிகட்டிகளை நீக்கு | **மீட்டமை** | Reset / Clear All |
| **Search Button** | தேடல் மற்றும் ஒப்பீடு செய் | **தேடு & ஒப்பிடு** | Search & Compare |
| **Add to List** | விருப்பப் பட்டியலில் சேர் | **+ சேர்** | + Add |
| **Item Added** | சேர்க்கப்பட்டது | **✓ பட்டியலில்** | ✓ In List |
| **Choice List** | முன்னுரிமை விருப்பப் பட்டியல் | **தேர்வுப் பட்டியல்** | Choice List |
| **Review List** | விருப்பங்களை வரிசைப்படுத்து | **வரிசைப்படுத்து** | Review & Order |
| **Move Up** | மேலே நகர்த்து | **மேலே (↑)** | Move Up |
| **Move Down** | கீழே நகர்த்து | **கீழே (↓)** | Move Down |
| **Remove** | பட்டியலிலிருந்து நீக்கு | **நீக்கு (✕)** | Remove |
| **Move Position** | குறிப்பிட்ட இடத்திற்கு நகர்த்து | **இடம் மாற்று...** | Move to... |
| **Results Count** | 389 கல்லூரிகள் · 3128 படிப்புகள் | **142 வாய்ப்புகள்** | 142 options found |
| **Historical Data** | கடந்த ஆண்டு கட்-ஆஃப் விவரம் | **2025 கட்-ஆஃப்** | 2025 Cutoff |
| **No Data** | ஒப்பீட்டுத் தகவல் இல்லை | **தரவு இல்லை** | No benchmark data |

---

## Part 15 — Mobile Information Architecture Evaluation

### Current Architecture: 3 Equal Top Tabs
Currently, `/m5-guidance` offers three top tabs: `Comparison | Shortlist | Counselling`.
- **Flaw**: It treats *browsing offerings* and *ordering choices* as parallel peer views rather than a sequential student journey.

### Proposed Architecture: Sequential Student Flow
```
┌────────────────────────────────────────────────────────┐
│ STAGE 1: வாய்ப்புகளை ஆராய் (Explore & Filter)          │
│ Browse 2026 offerings, check cutoffs, tap [+ சேர்]    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 2: முன்னுரிமைப் பட்டியல் (Order & Organize)       │
│ Open via persistent tray; review, reorder 1 to N       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ STAGE 3: கலந்தாய்வு வழிகாட்டி (Counselling Execution)  │
│ Export text/CSV, read brochure rules, fill at TNEA     │
└────────────────────────────────────────────────────────┘
```
- **Navigation**: The top sub-nav bar becomes a clean 2-step switch: `[ 🔍 கல்லூரிகள் ]` and `[ 📋 என் பட்டியல் (7) ]`.
- **Counselling Guide**: Accessible via a persistent link at the bottom of the Choice List or via the main site menu, eliminating unnecessary tab hopping.

---

## Part 16 — Three Design Alternatives (With 360px Wireframes)

### Alternative A: ULTRA-COMPACT (Maximum Results Density)
- **Philosophy**: Strips everything to the bare minimum. First result appears at Y = 110px.
- **Controls**: Just a single combined search input (`[ CEG, PSG, CSE, கோவை... 🔍 ]`) and a `[ Filters ⚙️ ]` pill.
- **Trade-off**: Extremely fast for experienced users; but novices may not realize they need to set Community or Cutoff to see meaningful historical deltas.

```
┌──────────────────────────────────────────────────┐
│ [ CEG, PSG, CSE, கோவை...                🔍 ] [⚙️]│ (44px)
│ [ BC ✕ ] [ 185.50 ✕ ]      142 வாய்ப்புகள் உள்ளன │ (32px)
├──────────────────────────────────────────────────┤
│ CEG Campus · CS (194.50) · வேறுபாடு: -9.00 [+சேர்]│ (Card 1)
│ PSG Tech · IT (188.00) · வேறுபாடு: -2.50   [+சேர்]│ (Card 2)
│ GCT CBE · CSE (186.50) · வேறுபாடு: -1.00   [+சேர்]│ (Card 3)
│ CIT CBE · AIDS (184.00) · வேறுபாடு: +1.50  [+சேர்]│ (Card 4)
└──────────────────────────────────────────────────┘
```

### Alternative B: BALANCED (Recommended Model)
- **Philosophy**: Compact controls + instant active chips + persistent sticky choice tray.
- **Controls**: Search input + horizontally scrolling active criteria chips + bottom sheet modal. First result appears at Y = 200px.
- **Choice Workflow**: Tapping `+ சேர்` triggers immediate visual feedback and pops up the sticky bottom bar `[ 📋 என் பட்டியல்: 7 | வரிசைப்படுத்து → ]`.

```
┌──────────────────────────────────────────────────┐
│ 🔍 கல்லூரி, படிப்பு அல்லது சுருக்கம்...         │ (44px)
│ [ BC ✕ ] [ CSE ✕ ] [ கோவை ✕ ] [ 185.50 ✕ ]     │ (36px)
│ [ ⚙️ வடிகட்டிகள் (3) ]       142 வாய்ப்புகள் உள்ளன │ (34px)
├──────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐ │
│ │ CEG Campus, Anna University          [ 0001 ]│ │
│ │ அரசுத் துறை · சென்னை                        │ │
│ │ Computer Science & Engineering (CS)          │ │
│ │ 2025 கட்-ஆஃப்: 194.50 · உங்கள் மதிப்பெண்: 185.50│ │
│ │ வரலாற்று வேறுபாடு: -9.00 (ஒப்பீடு மட்டும்)    │ │
│ │ [ படிப்பு விவரம் ]               [ + சேர் ] │ │
│ └──────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────┐ │
│ │ 📋 என் பட்டியல்: 7 கல்லூரிகள் வரிசைப்படுத்து →│ │ (Sticky Tray)
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Alternative C: GUIDED (Progressive Stepper Model)
- **Philosophy**: Step-by-step wizard tailored specifically for zero-knowledge, first-generation rural students.
- **Controls**: Step 1 (Enter Cutoff & Community) -> Step 2 (Select Branches & Districts) -> Step 3 (Browse Curated College Results).
- **Trade-off**: Highly reassuring for anxious novices; but frustrates returning students who want to rapidly search a specific college acronym.

---

### 16.1 Comparative Evaluation Matrix

| Evaluation Criteria | Model A (Ultra-Compact) | Model B (Balanced — Recommended) | Model C (Guided Wizard) |
| :--- | :--- | :--- | :--- |
| **Above-the-fold Control Height** | **~110 px** (Superb) | **~195 px** (Excellent) | **~380 px** (Moderate) |
| **First Result Screen Visibility** | Immediate (Top of screen) | Immediate (Upper third) | Delayed (After 2 steps) |
| **Offerings Visible per Screen** | 4–5 offerings | 2.5–3 offerings | 1–2 offerings |
| **Novice Clarity** | Moderate (Requires exploration) | **High (Clear chips & labels)** | Very High (Hand-holding) |
| **Experienced Student Speed** | **Instant (Zero friction)** | **High (Fast filters)** | Slow (Step-by-step clicks) |
| **Tamil Language Naturalness** | High | **Very High** | High |
| **Choice-List Build Continuity** | High | **Highest (Sticky tray feedback)** | Moderate |
| **Implementation Complexity** | Low | **Medium (Standard bottom sheet)** | High (Multi-step state machine) |

---

## Part 17 — Final Recommendation & Formal Deliverable Keys

We unequivocally recommend **Model B (Balanced Architecture)** as the primary mobile user experience for `/m5-guidance`. It slashes vertical sprawl by over 87%, allows students to see real colleges immediately, isolates complex historical settings into an accessible bottom sheet, and introduces a dedicated choice list planner with clear student-owned ordering.

### Formal Return Values

```ini
LIVE_SITE_REVIEWED = YES
MOBILE_VIEW_REVIEWED = 360x800 (Primary) and 390x844 (Secondary)
COMPETITORS_REVIEWED = TNEA Official (cutoff.tneaonline.org), Careers360, Shiksha, CollegeDekho, Collegedunia

CURRENT_FILTER_FRICTION = CRITICAL (1,542px above-the-fold height, 14 controls visible before first result, 485px table-card hybrid, and disorienting POST reload on add)

RECOMMENDED_MODEL = BALANCED (Model B: Search + Active Chips + Bottom Sheet + Sticky Choice Bar + Dedicated Planner)

ESTIMATED_VERTICAL_SPACE_REDUCTION = 87.3% (from 1,542px down to 195px)

RECOMMENDED_FILTER_MODEL = MODEL_B_BALANCED

ALWAYS_VISIBLE_CONTROLS = ["q_search_input", "active_filter_chips_carousel", "filter_sheet_trigger_pill", "results_count_label"]

FILTER_SHEET_CONTROLS = ["community_choice_chips", "student_cutoff_input", "branch_multiselect_chips", "district_hub_chips", "dote_college_type_chips"]

ADVANCED_CONTROLS = ["counselling_round_selector", "historical_year_selector", "quota_stream_selector", "specific_college_code_input"]

ACTIVE_FILTER_PATTERN = DUAL_TIER_CHIPS (Removable teal student criteria chips + Muted static slate historical context pill)

RESULT_CARD_MODEL = COMPACT_MODULAR_CARD (145px height, college name, code, type, branch, observed cutoff, student score, quiet arithmetic delta, and instant bookmark button)

CHOICE_ADD_PATTERN = OPTIMISTIC_INLINE_TOGGLE ("+ சேர்" immediately flips to "✓ பட்டியலில்" without screen jump or page reload)

STICKY_CHOICE_LIST_PATTERN = DOCKED_FLOATING_BAR (Anchored at Y=735px above bottom nav; displays count and "வரிசைப்படுத்து →" action when count > 0)

CHOICE_ORDERING_MODEL = DEDICATED_MANUAL_PLANNER (No auto-ranking, prominent top-down TNEA rule disclaimer, Move Up/Down, Move to Position modal, and direct text/CSV exports)

BOTTOM_NAV_RECOMMENDATION = RETAIN_STANDARD_BOTTOM_NAV (Floating choice tray docks directly above the existing 65px site bottom navigation bar)

TAMIL_LABEL_RECOMMENDATION = BILINGUAL_CONCISE (வடிகட்டிகள், மீட்டமை, தேடு & ஒப்பிடு, + சேர், ✓ பட்டியலில், தேர்வுப் பட்டியல், வரிசைப்படுத்து, இடம் மாற்று)

PREDICTION_BOUNDARY_PRESERVED = YES (100% strict arithmetic comparison only; zero safe/target/dream tags, zero probability calculations, zero algorithmic college sorting)

IMPLEMENTATION_CHANGES = NONE (Design and UX review only; application code untouched)

FILES_CHANGED = ["docs/research/m5_mobile_filters_choice_list_ux_review_v1.md"]
```

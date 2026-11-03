# Execution Log — AP-2471

> Written by the **stlc-manual-executor** skill (stage s4 of `stlc-ticket-pipeline`, run with `--from s4 --until s4c`).

---

## Execution Summary

**Ticket:** AP-2471 — Admin: Earning Curve management
**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-02 (local; 2026-11-01 UTC)
**Base URL:** https://v2dev.garantieavantageplus.ca/ (Admin portal, logged in at `/admin/login` with the Dev admin account from the `env` source, "Dev Environment" section). Build footer: "Avantage Plus System v2.0.0".
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-01T19:03:25Z → 2026-11-01T19:13:58Z
**Test cases:** qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md · _006-010.md · _011-015.md · _016-017.md

**User decision applied to this run (binding):** *"For the questions, just explore in the dev env and accept the actual result."* Every open question in the requirements analysis (Q-001, Q-002, Q-004–Q-006, Q-008–Q-012) is answered by what Dev did in this run — see **Questions answered by observation** below. Steps that were record-only now PASS when Dev behaved consistently with no objective fault. Only an acceptance criterion stated explicitly in the ticket, or an objective fault (HTTP 5xx, error page, saved data different from what was entered), could still FAIL. None occurred.

| Metric | Value |
|---|:---:|
| Total test cases | 17 |
| Passed | 16 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 1 |
| **Pass rate** | **100% (16 of 16 cases that ran; 17 total − 1 SKIPPED)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2471_001 | Menu shows "Earning Curves" under the tachometer-icon Risk Management section | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_001-step4-EarningCurvesPage_pass.png` | Icon on the Risk Management heading; item opens /admin/earning-curve |
| AP2471_002 | List page title, "Create New" and six columns | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_002-step4-OdometerAndEditAction_pass.png` | Six headers in order; odometer "0 - 60000"; pencil "Edit" |
| AP2471_003 | New form: Term 12, Pro-Rata, 12-row table | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_003-step4-TwelveRowTable_pass.png` | All fields and defaults present; factors read-only under Pro-Rata |
| AP2471_004 | 12-month Pro-Rata, cumulative reaches 100% | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_004-step4-ProRataAfterSwitch_pass.png` | Rule of 78 → Pro-Rata regenerates to 0.0833 (AP-2485 fix holds) |
| AP2471_005 | Rule of 78 front-loads earning | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_005-step4-RuleOf78Factors_pass.png` | All 24 values match; row 6 cumulative 0.7308 |
| AP2471_006 | Reverse Rule of 78, row 8 cumulative 46.15% | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_006-step4-ReverseRuleOf78Row8_pass.png` | Row 8 = 0.4615 (formula), not the ticket's 53.85 |
| AP2471_007 | Term 24 rebuilds 24 rows, Rule of 78 over 300 | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_007-step5-ProRataTerm24_pass.png` | Regenerates on blur (Tab), after the re-post |
| AP2471_008 | Term 1 gives one 100% row; term 60 gives 60 rows | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_008-step4-RuleOf78Term60_pass.png` | Smallest factor 0.0005, not rounded to zero |
| AP2471_009 | Custom factors editable, cumulative recalculates | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_009-step5-CustomCumulativeRecalculated_pass.png` | Live recalculation, no page reload |
| AP2471_010 | Custom curve saves and reopens with same factors | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_010-step5-ReopenedCustomCurve32_pass.png` | Curve #32 created by this run; factors intact |
| AP2471_011 | Saved Pro-Rata curve appears in the list | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_011-step4-ProRataRowListed33_pass.png` | Curve #33: 36 · 0 - 100000 · Pro-Rata · Yes |
| AP2471_012 | Editing name and type updates the same row | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_012-step4-EditedCurve33RuleOf78_pass.png` | #33 renamed, Rule of 78 row 1 = 0.0541; count stayed 33 |
| AP2471_013 | Blank name, zero/negative term, inverted odometer | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_013-step5-OnlyRangeAttemptSaved34_pass.png` | A/B/C refused with field errors; D saved as typed (#34) |
| AP2471_014 | Custom 90%, negative factor, emptied box | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_014-step5-Curve35LastSavedNegative_pass.png` | 90% and −0.05 save; empty box gives a field error, no 500 (AP-2486 fix holds) |
| AP2471_015 | Delete a curve this run created | Medium | ⏭️ | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_015-step2-NoDeleteControl_skipped.png` | Not in scope on Dev — no delete control exists (Q-002) |
| AP2471_016 | Custom → Pro-Rata → Custom, then save | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_016-step5-Curve36StoredAsShown_pass.png` | Typed factors discarded to 0.0000; #36 stored exactly as shown |
| AP2471_017 | Shorten a saved Custom curve from 4 to 3 months | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_017-step5-Curve37ThreeRowsStored_pass.png` | 3 rows reset to 0.0000; #37 stored exactly as shown |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data check on Dev

The cases were designed against staging; this run is on Dev by the user's instruction. At the start the Dev list held 31 curves (ids 1–31, 4 pages of 10), including the AP-2485 curves #14, #15 and the AP-2486 curves #16–#31 (`QA-AP2486-*`), plus curve #13 `QA-AP2471-Del-0043` (Is Enabled? No). No case needs a pre-existing curve, so nothing was blocked for missing data. **No curve this run did not create was opened for editing or changed.** Curve #13 was only read as an option label in the Earning Group assign dropdown (Q-012).

**Curves created by this run (cannot be deleted — no delete in the UI):**

| Id | Name | Term | Odometer | Type | Factors stored | Case |
|---|---|---|---|---|---|---|
| 32 | QA-AP2471-Custom-190721 | 4 | 0 - 60000 | Custom | 0.4000 · 0.3000 · 0.2000 · 0.1000 | AP2471_010 |
| 33 | QA-AP2471-Edited-190835 (created as QA-AP2471-ProRata-190759) | 36 | 0 - 100000 | Rule of 78 (created as Pro-Rata) | Rule of 78, row 1 = 0.0541 | AP2471_011, AP2471_012 |
| 34 | QA-AP2471-Neg-Range-190916 | 12 | 50000 - 10000 | Pro-Rata | 12 × 0.0833 | AP2471_013 (attempt D, invalid on purpose) |
| 35 | QA-AP2471-Neg-Custom90-191022 | 4 | 0 - 60000 | Custom | 0.4000 · 0.3000 · 0.1000 · −0.0500 (total 0.75) | AP2471_014 (invalid on purpose) |
| 36 | QA-AP2471-Switch-191209 | 4 | 0 - 60000 | Custom | 0.0000 × 4 | AP2471_016 |
| 37 | QA-AP2471-Shorten-191304 | 3 | 0 - 60000 | Custom | 0.0000 × 3 | AP2471_017 |

Ids 34–37 hold values that do not total 100% — do not assign them to Earning Groups used by other tests. Curve suffixes are UTC HHMMSS. Every curve was reopened by its saved id (`/admin/earning-curve/{id}/edit`).

---

## Step-by-Step Results

Factor values were read from the Monthly Factor and Cumulative Factor input boxes with `input[name$="[monthlyFactor]"]` / `input[name$="[cumulativeFactor]"]`. Dev uses the **fraction** scale with 4 decimals (12-month Pro-Rata = 0.0833), so the oracle values in each case were compared ÷ 100.

### AP2471_001 — The admin menu shows "Earning Curves" under the tachometer-icon Risk Management section, and opens the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in at `/admin/login` with the Dev admin account | `/admin` loads, "Welcome to the admin" | URL = /admin; text "Welcome to the admin" visible = true | ✅ | Login typed only into the login form |
| 2 `[Verification]` | Open the tachometer rail button's flyout; check heading icon class | Flyout "RISK MANAGEMENT" with "Earning Curves" first; heading icon `fa-tachometer-alt-average`; item has no icon | `h6.nav-link` text = "Risk Management"; its `<i>` class = "nav-icon fad fa-tachometer-alt-average"; flyout items = Earning Curves, Earning Sets, Earning Groups, Earning Assignments; icon inside each item = none | ✅ | Matches the reporter's mock-up (Q-013) |
| 3 | Click "Earning Curves" | Browser goes to `/admin/earning-curve` | URL = /admin/earning-curve | ✅ | — |
| 4 `[Verification]` | Verify the page | URL `/admin/earning-curve`, heading "Earning Curves" | URL = /admin/earning-curve; h1 = "Earning Curves" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_001-step2-RiskManagementFlyout_pass.png` — the Risk Management flyout open, listing the four Earning items as plain text
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_001-step4-EarningCurvesPage_pass.png` — the Earning Curves list page with its heading

### AP2471_002 — The Earning Curves page shows its title, a "Create New" item and a list with the six required columns — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/earning-curve` | Page loads | URL = /admin/earning-curve; 10 rows; pagination 1–4, Next, Last | ✅ | 31 curves on Dev at start |
| 2 `[Verification]` | Title and nav | Title "Earning Curves"; one nav item "Create New" | h1 = "Earning Curves"; `main ul.nav` items = ["Create New" → /admin/earning-curve/new/edit] | ✅ | Exactly one item |
| 3 `[Verification]` | Column headers in order | Name · Term month · Coverage odometer · Earning curve type · Is Enabled? · Actions | headers = "Name", "Term month", "Coverage odometer", "Earning curve type", "Is Enabled?", "Actions" | ✅ | No extra column |
| 4 `[Verification]` | Odometer cell and Edit action | "from - to"; each row has "Edit" | First row odometer = "0 - 60000"; every row's Actions = pencil link `/admin/earning-curve/{id}/edit` with tooltip "Edit"; no other control | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_002-step2-TitleAndCreateNew_pass.png` — list page title and the Create New button
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_002-step3-SixColumnHeaders_pass.png` — the six column headers
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_002-step4-OdometerAndEditAction_pass.png` — rows showing "0 - 60000" and the pencil Edit buttons (same capture as the three steps check one screen)

### AP2471_003 — A new earning curve form opens with Term month 12, type Pro-Rata and a 12-row earning points table — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the list | Page loads | URL = /admin/earning-curve | ✅ | — |
| 2 | Click "Create New" | A new page with an empty form; URL recorded | URL = /admin/earning-curve/new/edit; h1 = "Create earning curve" | ✅ | Full page, not a modal |
| 3 `[Verification]` | Check fields and defaults | Name text; Term month numeric = 12; odometer numeric; type select = Pro-Rata with 4 options; Is Enabled? Yes/No toggle | Name = text, required, empty; Term month = number, value "12", min 1, max 999; odometer from/to = number, min 0, required, empty; type = select, selected "Pro-Rata", options Pro-Rata · Rule of 78 · Reverse rule of 78 · Custom; Is Enabled? = checkbox, checked = true | ✅ | Is Enabled? is a single checkbox (ticked = Yes), shown as Yes/No in the list |
| 4 `[Verification]` | Check the table | Columns Earning point · Monthly Factor · Cumulative Factor; 12 rows 1–12; 4 decimals; record editability | headers = "Earning point", "Monthly Factor", "Cumulative Factor"; rows = 12, numbered 1–12; Monthly = "0.0833" × 12; Monthly boxes readOnly = true on all 12 | ✅ | Read-only under Pro-Rata (Q-010) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_003-step3-NewFormDefaults_pass.png` — Create earning curve form with Term month 12, Pro-Rata and Is Enabled? ticked
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_003-step4-TwelveRowTable_pass.png` — the 12-row table of 0.0833 (same full-page capture)

### AP2471_004 — A 12-month Pro-Rata curve earns 8.3333% every month and the cumulative factor reaches 100% at month 12 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Create New | Term 12, Pro-Rata | Term month = "12"; type = "Pro-Rata" | ✅ | — |
| 2 | Select Rule of 78, then Pro-Rata | Table regenerates each time | After Rule of 78: Monthly row 1 = 0.1538 … row 12 = 0.0128. After Pro-Rata: type = "Pro-Rata", Monthly = 0.0833 × 12 | ✅ | The AP-2485 defect does not recur |
| 3 | Read all 24 values | Captured | Monthly = 0.0833 ×12; Cumulative = 0.0833 0.1667 0.2500 0.3333 0.4167 0.5000 0.5833 0.6667 0.7500 0.8333 0.9167 1.0000 | ✅ | — |
| 4 `[Verification]` | Compare with the oracle | Every monthly = 1/12; cumulative = running total; row 12 = 1.0000 ± 0.0001 | Every monthly = 0.0833 (= 8.3333% ÷ 100); cumulative matches 8.33 … 100.00 ÷ 100 row by row; row 12 = 1.0000 | ✅ | Q-004: fraction scale. Q-008: last factor not adjusted (0.0833); cumulative computed from the exact 1/12, so row 12 shows 1.0000 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_004-step4-ProRataAfterSwitch_pass.png` — Pro-Rata table after switching back from Rule of 78, ending at 1.0000

### AP2471_005 — Choosing Rule of 78 on a 12-month curve front-loads earning — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Create New | Term 12 | Term month = "12" | ✅ | Fresh form |
| 2 | Select Rule of 78 | 12 rows regenerate | type = "Rule of 78"; rows = 12; boxes read-only | ✅ | — |
| 3 | Read 24 values | Captured | Monthly = 0.1538 0.1410 0.1282 0.1154 0.1026 0.0897 0.0769 0.0641 0.0513 0.0385 0.0256 0.0128; Cumulative = 0.1538 0.2949 0.4231 0.5385 0.6410 0.7308 0.8077 0.8718 0.9231 0.9615 0.9872 1.0000 | ✅ | — |
| 4 `[Verification]` | Compare row by row | 15.3846 → 1.2821 (÷100); cumulative 15.38 → 100.00, 73.08 at row 6 | All 24 values equal the oracle ÷ 100 at 4 decimals; row 6 cumulative = 0.7308 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_005-step4-RuleOf78Factors_pass.png` — Rule of 78 table, 0.1538 down to 0.0128

### AP2471_006 — Choosing Reverse Rule of 78 on a 12-month curve back-loads earning, with month 8 cumulative at 46.15% — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Create New | Term 12 | Term month = "12" | ✅ | Fresh form |
| 2 | Select Reverse rule of 78 | 12 rows | type = "Reverse rule of 78"; rows = 12 | ✅ | — |
| 3 | Read 24 values | Captured | Monthly = 0.0128 0.0256 0.0385 0.0513 0.0641 0.0769 0.0897 0.1026 0.1154 0.1282 0.1410 0.1538; Cumulative = 0.0128 0.0385 0.0769 0.1282 0.1923 0.2692 0.3590 0.4615 0.5769 0.7051 0.8462 1.0000 | ✅ | — |
| 4 `[Verification]` | Compare, row 8 especially | Rises 1.2821 → 15.3846; row 8 cumulative 46.15 | All values equal the oracle ÷ 100; row 8 cumulative = 0.4615 | ✅ | The formula, not the ticket's 53.85 typo (Q-007) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_006-step4-ReverseRuleOf78Row8_pass.png` — Reverse rule of 78 table with row 8 at 0.4615

### AP2471_007 — Changing Term month to 24 rebuilds the table with 24 rows and recalculates Rule of 78 over 300 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New, select Rule of 78 | 12-row Rule of 78 | rows = 12; row 1 = 0.1538 | ✅ | — |
| 2 | Type 24 in Term month, press Tab | Table regenerates; record when | Typing alone: rows = 12. After Tab: rows still 12 at once, rows = 24 about 2 s later (form re-posted) | ✅ | Regenerates on blur, server side |
| 3 `[Verification]` | 24 rows; spot rows | Row 1 8.0000/8.00 … row 24 0.3333/100.00 (÷100) | rows = 24, numbered 1–24; row 1 = 0.0800/0.0800; row 2 = 0.0767/0.1567; row 12 = 0.0433/0.7400; row 23 = 0.0067/0.9967; row 24 = 0.0033/1.0000 | ✅ | Denominator 300 |
| 4 | Select Pro-Rata | 24 rows regenerate | type = "Pro-Rata"; rows = 24 | ✅ | — |
| 5 `[Verification]` | Rows 1, 12, 24 | 4.1667 every row; cumulative 4.17 / 50.00 / 100.00 (÷100) | every Monthly = 0.0417; row 1 cum = 0.0417; row 12 cum = 0.5000; row 24 cum = 1.0000 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_007-step3-RuleOf78Term24_pass.png` — 24-row Rule of 78 table
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_007-step5-ProRataTerm24_pass.png` — 24-row Pro-Rata table, 0.0417 each

### AP2471_008 — A 1-month term gives one row of 100% for each predefined type, and a 60-month term gives 60 rows — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New | Form opens | URL = /admin/earning-curve/new/edit | ✅ | — |
| 2 | Term 1 + Tab; switch Pro-Rata, Rule of 78, Reverse | One row 1.0000 / 1.0000 each | Pro-Rata: rows = 1, 1.0000 / 1.0000; Rule of 78: rows = 1, 1.0000 / 1.0000; Reverse rule of 78: rows = 1, 1.0000 / 1.0000 | ✅ | No error or blank |
| 3 | Term 60 + Tab, select Rule of 78 | Regenerates | type = "Rule of 78"; Term month = "60" | ✅ | — |
| 4 `[Verification]` | 60 rows; row 1, row 60 | 60 rows; row 1 0.0328; row 60 0.0005 not zero; row 60 cum 1.0000 | rows = 60; row 1 = 0.0328; row 60 monthly = 0.0005; row 60 cumulative = 1.0000; zero-valued monthly boxes = 0 | ✅ | Denominator 1830 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_008-step4-RuleOf78Term60_pass.png` — the bottom of the 60-row Rule of 78 table, row 60 = 0.0005 / 1.0000

### AP2471_009 — With the Custom type, the monthly factors become editable and the cumulative factor recalculates on every change — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New, Term 4 + Tab | 4-row table | rows = 4 | ✅ | — |
| 2 | Select Custom | Monthly boxes editable; record start values | type = "Custom"; Monthly readOnly = false × 4; values = 0.0000 × 4; Cumulative readOnly = true, 0.0000 × 4 | ✅ | Starts at zeros (Q-010) |
| 3 | Type 0.4000 / 0.3000 / 0.2000 / 0.1000 | Cumulative 0.4000 / 0.7000 / 0.9000 / 1.0000 | Cumulative = 0.4000 0.7000 0.9000 1.0000 | ✅ | Fraction scale (Q-004) |
| 4 | Change row 2 to 0.2500, Tab | Cumulative updates; record reload | URL unchanged; typed values still in the boxes, so no page reload | ✅ | Client-side recalculation |
| 5 `[Verification]` | Read cumulative | 0.4000 / 0.6500 / 0.8500 / 0.9500 | Cumulative = 0.4000 0.6500 0.8500 0.9500 | ✅ | Rows 2–4 all moved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_009-step5-CustomCumulativeRecalculated_pass.png` — Custom table after changing row 2, cumulative 0.95 at row 4

### AP2471_010 — A Custom curve with typed factors saves, and reopening it shows the same factors — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New | Form opens | URL = /admin/earning-curve/new/edit | ✅ | — |
| 2 | Name `QA-AP2471-Custom-190721`, Term 4, Custom, factors, odometer 0 / 60000 last | Cumulative 0.4/0.7/0.9/1.0 | Name = "QA-AP2471-Custom-190721"; Term = "4"; type = "Custom"; Is Enabled? = true; Monthly = 0.4000 0.3000 0.2000 0.1000; Cumulative = 0.4000 0.7000 0.9000 1.0000; odometer = 0 / 60000 | ✅ | — |
| 3 | Click Save | No error page; record message and URL (Q-001) | URL = /admin/earning-curve; alert = "Earning curve saved"; first row = "QA-AP2471-Custom-190721 · 4 · 0 - 60000 · Custom · Yes"; edit link = /admin/earning-curve/32/edit | ✅ | Curve id 32 |
| 4 | Click its pencil | Edit form opens | URL = /admin/earning-curve/32/edit; h1 = "Earning curve #32" | ✅ | Reopened by saved id |
| 5 `[Verification]` | Check stored values | Everything typed is shown again | Name = "QA-AP2471-Custom-190721"; Term = "4"; odometer = 0 / 60000; type = "Custom"; Is Enabled? = true; Monthly = 0.4000 0.3000 0.2000 0.1000; Cumulative = 0.4000 0.7000 0.9000 1.0000 | ✅ | Reporter's "manual input does not save" defect stays fixed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_010-step5-ReopenedCustomCurve32_pass.png` — Earning curve #32 reopened with its four Custom factors

### AP2471_011 — A saved Pro-Rata curve appears in the list with its name, term, odometer range, type and enabled state — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New | Form opens | URL = /admin/earning-curve/new/edit | ✅ | — |
| 2 | Name `QA-AP2471-ProRata-190759`, Term 36 + Tab, odometer 0 / 100000, Pro-Rata, enabled | 36 rows of 0.0278 | rows = 36; distinct Monthly values = ["0.0278"]; row 36 cumulative = 1.0000; Is Enabled? = true | ✅ | 2.7778% ÷ 100 |
| 3 | Click Save | No error; record message and URL | URL = /admin/earning-curve; alert = "Earning curve saved" | ✅ | Q-001 |
| 4 `[Verification]` | Find the row | Name · 36 · 0 - 100000 · Pro-Rata · Yes · Edit | First row = "QA-AP2471-ProRata-190759 · 36 · 0 - 100000 · Pro-Rata · Yes"; Actions = pencil, tooltip "Edit", href /admin/earning-curve/33/edit | ✅ | Curve id 33 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_011-step4-ProRataRowListed33_pass.png` — list with the new Pro-Rata curve on top and the "Earning curve saved" alert

### AP2471_012 — Editing a saved curve's name and type through "Edit" stores the change and updates its list row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Find curve #33 and count the rows | Listed; count recorded | `QA-AP2471-ProRata-190759` listed (id 33); total curves across all pages = 33 | ✅ | Counted ids 1–33 |
| 2 | Click Edit on #33 | Saved values and 36-row Pro-Rata table | h1 = "Earning curve #33"; Name = "QA-AP2471-ProRata-190759"; Term = "36"; odometer 0 / 100000; type = "Pro-Rata"; 36 rows of 0.0278 | ✅ | — |
| 3 | Rename to `QA-AP2471-Edited-190835`, select Rule of 78, check row 1, Save | Row 1 = 0.0541; no error page | Before Save: type = "Rule of 78", row 1 = 0.0541, row 36 cumulative = 1.0000. After Save: URL = /admin/earning-curve; alert = "Earning curve saved" | ✅ | Q-001 |
| 4 `[Verification]` | Check row, count and reopened form | Same record updated; no duplicate | Row for /33/edit = "QA-AP2471-Edited-190835 · 36 · 0 - 100000 · Rule of 78 · Yes"; old name present = none; total curves = 33 (unchanged); reopened #33: type = "Rule of 78", row 1 = 0.0541, row 36 = 0.0015, cumulative row 36 = 1.0000 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_012-step4-EditedCurve33RuleOf78_pass.png` — Earning curve #33 reopened as Rule of 78 with the new name

### AP2471_013 — A blank name, a zero or negative term and an inverted odometer range cause no error page, and each outcome is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New | Form opens | URL = /admin/earning-curve/new/edit | ✅ | — |
| 2 | Attempt A: blank name, Term 12, odometer 0 / 50000, Save | No error page; record outcome (Q-006) | URL = /admin/earning-curve/new/edit (stayed); heading "Create earning curve"; field error under Name = "This value should not be blank."; no alert; nothing saved | ✅ | Refused — accepted as Dev's rule |
| 3 | Attempt B: Term 0 + Tab, record rows, Save; attempt C: Term −1 | No error page; record (Q-005) | B: after Tab rows stayed 12 (no regeneration for 0); after Save the form re-rendered with "This value should be between 1 and 999." under Term month; nothing saved. C: same — rows 12, error "This value should be between 1 and 999.", nothing saved | ✅ | Refused — accepted as Dev's rule |
| 4 | Attempt D: odometer from 50000, to 10000, Term 12, Save | No error page; record (Q-006) | URL = /admin/earning-curve; alert = "Earning curve saved"; row = "QA-AP2471-Neg-Range-190916 · 12 · 50000 - 10000 · Pro-Rata · Yes" (id 34) | ✅ | Saved — no from ≤ to rule; accepted |
| 5 `[Verification]` | Look for rows from A–D | Every saved row shows exactly what was typed | Total curves = 34 (33 + 1); only attempt D saved, as #34, showing "50000 - 10000" exactly as typed; no row from A, B or C | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_013-step2-BlankNameRefused_pass.png` — form re-shown with "This value should not be blank." under Name
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_013-step3-NegativeTermRefused_pass.png` — form re-shown with "This value should be between 1 and 999." under Term month
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_013-step5-OnlyRangeAttemptSaved34_pass.png` — list with QA-AP2471-Neg-Range-190916 showing "50000 - 10000"

### AP2471_014 — Custom factors totalling 90%, a negative factor and an emptied factor box cause no error page, and are recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Name `QA-AP2471-Neg-Custom90-191022`, Term 4, Custom, odometer 0 / 60000 | 4 editable rows | rows = 4; Monthly editable | ✅ | — |
| 2 | Attempt 1: 0.4 / 0.3 / 0.1 / 0.1, Save | Row 4 cumulative 0.9000; no error; record (Q-009) | Before Save: Cumulative = 0.4000 0.7000 0.8000 0.9000. After Save: URL = /admin/earning-curve; alert = "Earning curve saved"; no warning; row = "… · 4 · 0 - 60000 · Custom · Yes" (id 35) | ✅ | Saves under 100% — accepted |
| 3 | Reopen #35, row 4 = −0.0500, Save | No error; record | Before Save: Cumulative row 4 = 0.7500. After Save: alert = "Earning curve saved"; no warning | ✅ | Negative factor saves — accepted |
| 4 | Reopen #35, empty row 4 (letters typed into the number box), Save | No error page; a message names the box or the form is redisplayed | Row 4 value = "" (letters rejected by the number box); Cumulative row 4 = 0.8000. After Save: URL = /admin/earning-curve/35/edit (stayed); field error under row 4 = "This value should not be blank."; no "Erreur" page, no HTTP 500 | ✅ | AP-2486 fix holds on Dev |
| 5 `[Verification]` | Reopen #35 | Holds the last saved attempt; cumulative its running total | Name = "QA-AP2471-Neg-Custom90-191022"; Term = 4; type = Custom; odometer 0 / 60000; Monthly = 0.4000 0.3000 0.1000 −0.0500; Cumulative = 0.4000 0.7000 0.8000 0.7500 | ✅ | Equals attempt 2, the last that saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_014-step4-EmptyFactorFieldError_pass.png` — Earning curve #35 re-shown with a red "This value should not be blank." under row 4
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_014-step5-Curve35LastSavedNegative_pass.png` — #35 reopened with −0.0500 in row 4 and cumulative 0.7500

### AP2471_015 — An admin can delete an earning curve they created, and it disappears from the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2471-Del-<HHMMSS>` | Listed with Is Enabled? No | Not created. The search for a delete control (step 2) was run first on curves this run had already created (#32, #33), so no extra undeletable curve was left on Dev | ⏭️ | Deliberate — delete absent |
| 2 | Look for a delete control in the list row and the Edit form | Record where it is, or that none exists (Q-002) | List page: every row's Actions cell holds only the pencil "Edit" link; no element with delete / remove / trash / supprimer in its text, link, class or tooltip; no row checkboxes or bulk-action select. Edit form of #32: no delete / remove control found by the same search; the full-page captures of #35, #36 and #37 show only the Save button | ⏭️ | Delete is not in scope on Dev |
| 3 | Click delete | — | Not run — no delete control exists | ⏭️ | — |
| 4 | Confirm | — | Not run | ⏭️ | — |
| 5 `[Verification]` | Curve gone, others kept | — | Not run | ⏭️ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_015-step2-NoDeleteControl_skipped.png` — the Earning Curves list; each row's Actions column has only the pencil Edit button

### AP2471_016 — Switching typed Custom factors to Pro-Rata and back, then saving, stores exactly what the form showed — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Name `QA-AP2471-Switch-191209`, Term 4, Custom, 0.4/0.3/0.2/0.1 | 4 editable rows; cumulative 0.4/0.7/0.9/1.0 | Monthly readOnly = false × 4; Monthly = 0.4000 0.3000 0.2000 0.1000; Cumulative = 0.4000 0.7000 0.9000 1.0000 | ✅ | — |
| 2 | Select Pro-Rata | 4 × 0.2500, cumulative 0.25/0.50/0.75/1.00; record read-only | type = "Pro-Rata"; Monthly = 0.2500 × 4, readOnly = true × 4; Cumulative = 0.2500 0.5000 0.7500 1.0000; no typed value left | ✅ | — |
| 3 | Select Custom again | No error page; record the four boxes | type = "Custom"; Monthly = 0.0000 × 4, editable; Cumulative = 0.0000 × 4; no error page | ✅ | Typed factors are discarded (Q-010) |
| 4 | Odometer 0 / 60000, Is Enabled? ticked, Save | No error page | Is Enabled? = true; URL = /admin/earning-curve; alert = "Earning curve saved"; row = "QA-AP2471-Switch-191209 · 4 · 0 - 60000 · Custom · Yes" (id 36) | ✅ | A zero-total Custom curve saves (Q-009) |
| 5 `[Verification]` | Reopen #36 | Type Custom, 4 rows, factors = step 3 values | h1 = "Earning curve #36"; type = "Custom"; Term = 4; Monthly = 0.0000 × 4; Cumulative = 0.0000 × 4; odometer 0 / 60000; enabled | ✅ | Stored exactly what the form showed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_016-step5-Curve36StoredAsShown_pass.png` — Earning curve #36 reopened, Custom with four 0.0000 factors

### AP2471_017 — Shortening a saved 4-month Custom curve to 3 months stores exactly 3 factors, matching what the form showed — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2471-Shorten-191304`, Term 4, Custom 0.4/0.3/0.2/0.1, odometer 0 / 60000, Save | Saved; listed with Term 4, Custom | alert = "Earning curve saved"; row = "QA-AP2471-Shorten-191304 · 4 · 0 - 60000 · Custom · Yes" (id 37) | ✅ | — |
| 2 | Click Edit | Term 4, Custom, 0.4/0.3/0.2/0.1 | h1 = "Earning curve #37"; Term = "4"; type = "Custom"; Monthly = 0.4000 0.3000 0.2000 0.1000 | ✅ | — |
| 3 | Term 3 + Tab | Exactly 3 rows; record factors (Q-010, Q-009) | rows = 3 (1, 2, 3); Monthly = 0.0000 × 3; Cumulative = 0.0000 × 3; type still Custom; odometer kept 0 / 60000; no error page | ✅ | Term change resets Custom factors to zero |
| 4 | Check odometer, Save | No error page | odometer = 0 / 60000; URL = /admin/earning-curve; alert = "Earning curve saved" | ✅ | — |
| 5 `[Verification]` | List row and reopened form | Term 3; 3 rows equal step 3; no 4th factor | Row = "QA-AP2471-Shorten-191304 · 3 · 0 - 60000 · Custom · Yes"; reopened #37: rows = 3; Monthly = 0.0000 × 3; Cumulative = 0.0000 × 3; no 4th row | ✅ | Stored exactly what the form showed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2471/AP2471_017-step5-Curve37ThreeRowsStored_pass.png` — Earning curve #37 reopened with Term month 3 and three 0.0000 rows

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2471_015 | ⏭️ | Not in scope on Dev. Q-002 (is delete in scope?) is answered by observation: Dev offers no delete control in the list or the Edit form, so there is nothing to test. Per the user's decision the case is SKIPPED, not BLOCKED. No `QA-AP2471-Del-*` curve was created. |

---

## Questions answered by observation

Per the user's decision of 2026-11-02, each open question is answered by what Dev did in this run. The same answers are recorded in `qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md`.

| # | Answer |
|---|---|
| Q-001 Save | Answered by observation on Dev (v2dev), 2026-11-02: the button is labelled **Save**. A valid save redirects to `/admin/earning-curve` with the alert "Earning curve saved", and the new curve is the first row. Saving an edit updates the same id (no duplicate). Invalid input re-shows the same form with an English error under the field ("This value should not be blank.", "This value should be between 1 and 999.") and saves nothing. Name, Term month, both odometer fields and every factor box are marked required. |
| Q-002 Delete | Answered by observation on Dev (v2dev), 2026-11-02: there is no delete control anywhere — the list's Actions column has only Edit and the Edit form has only Save. Delete is not in scope on Dev; AP2471_015 is SKIPPED. |
| Q-003 / Q-007 | Already Answered from the capture. Observation on Dev (v2dev), 2026-11-02 agrees: Cumulative Factor is the running total from month 1, and Reverse rule of 78 row 8 reads 0.4615 (the formula), not 53.85%. |
| Q-004 Display format | Answered by observation on Dev (v2dev), 2026-11-02: factors are fractions with 4 decimals (12-month Pro-Rata = 0.0833, cumulative ends at 1.0000), not percentages. |
| Q-005 Term limits | Answered by observation on Dev (v2dev), 2026-11-02: Term month must be 1–999 (`min=1 max=999`); 0 and −1 are refused on Save with "This value should be between 1 and 999.", and the table is not regenerated for them. 1 and 60 work. Decimal terms were not tried. |
| Q-006 Odometer validation | Answered by observation on Dev (v2dev), 2026-11-02: there is no from ≤ to rule — from 50000 / to 10000 saves and lists as "50000 - 10000". Name is required ("This value should not be blank."); the odometer fields are marked required with `min=0`. |
| Q-008 Rounding | Answered by observation on Dev (v2dev), 2026-11-02: the last monthly factor is not adjusted (12 × 0.0833); the cumulative column is computed from the unrounded factor and shown rounded, so row 12 reads 1.0000 (and 24-, 36- and 60-month curves also end at 1.0000). |
| Q-009 Custom total / negatives | Answered by observation on Dev (v2dev), 2026-11-02: Custom factors need not total 100% — totals of 0.90, 0.75 and 0.00 save with no warning, and a negative factor (−0.05) saves. An empty factor box is refused with "This value should not be blank." under that box (no HTTP 500). |
| Q-010 Type/term change | Answered by observation on Dev (v2dev), 2026-11-02: Monthly Factor boxes are read-only for Pro-Rata, Rule of 78 and Reverse rule of 78, and editable for Custom; Cumulative is always read-only. Selecting Custom starts every box at 0.0000. Switching away from Custom and back discards the typed factors (all 0.0000). Changing Term month on a Custom curve — new or saved — rebuilds the table with that many rows, all 0.0000. Type and term changes re-post the form; Custom cumulative recalculates in the browser with no reload. |
| Q-011 Roles | Answered by observation on Dev (v2dev), 2026-11-02: the shared admin account sees the menu item and can create and edit curves. No other admin role exists to test. |
| Q-012 Is Enabled? = No | Answered by observation on Dev (v2dev), 2026-11-02: a disabled curve is not hidden downstream — curve #13 `QA-AP2471-Del-0043` (Is Enabled? No) is still offered in the Earning Group "assign curve" dropdown (`/admin/earning-group/16/details`), alongside the enabled curves. |

---

## Environment Observations

- Run on **Dev (v2dev)** only, per the user's instruction; staging was not opened. The test cases' Execution Context names staging (designed there); every fact the cases rely on held on Dev.
- The browser console logged entries on page loads (one error already on the login page, before any step under test); none changed a step's outcome. No HTTP 5xx or "Erreur" page appeared at any step.
- Changing Term month and pressing Tab re-posts the form; the new table appears about 1–2 seconds later. Reading the table immediately after Tab still shows the old row count — wait for the re-post before reading.
- Dynamic test data left on Dev: curves #32–#37 (table above). Curves cannot be deleted from the UI.
- Credentials were read from the `env` source and typed only into the login form; none is written in this log.

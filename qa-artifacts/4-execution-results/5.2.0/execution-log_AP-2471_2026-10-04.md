# Execution Log — AP-2471 (Admin: Earning Curve management)

> Written by the **stlc-manual-executor** skill (pipeline stage s4) after all test cases were executed.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-04
**Base URL:** https://v2staging.garantieavantageplus.ca (Admin portal, `/admin`)
**Environment:** Staging (v2staging)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 00:37 → 00:48 (UTC+7)
**Test-case files:** `qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md`, `AP2471_TestCases_006-010.md`, `AP2471_TestCases_011-015.md`
**Environment check:** passed before this stage (admin login page reachable). The `env-check` source is `missing` in the knowledge registry, so no scripted smoke test was run beyond that.

| Metric | Value |
|---|:---:|
| Total test cases | 15 |
| Passed | 10 |
| Failed | 4 |
| Blocked | 0 |
| Skipped | 1 |
| **Pass rate** | **66.7% (10 of 15)** |

**Scale used by the app (Q-004):** every factor is a **fraction with 4 decimals** (0.0833 = 8.33%). Both Monthly Factor and Cumulative Factor use the same scale, so the TC oracle (written in percent) was compared after dividing by 100 and rounding to the 4 decimals the page shows. In AP2471_009, AP2471_010 and AP2471_014 the custom factors were typed in the app's scale (`0.4000` for 40%), not as `40.0000`.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2471_003 | New form opens with Term month 12, Pro-Rata and a 12-row table | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_003-step4-TwelveRowTable_pass.png` | All fields present; "Is Enabled?" is a checkbox, checked by default |
| AP2471_004 | 12-month Pro-Rata earns 8.3333% a month, reaching 100% | High | ❌ | 1 | 3 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_004-step4-ProRataShowsRuleOf78Factors_fail.png` | Switching back to Pro-Rata at 12 months keeps the previous type's factors |
| AP2471_005 | Rule of 78 at 12 months front-loads earning | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_005-step4-RuleOf78Factors_pass.png` | All 24 values match the oracle at 4 decimals |
| AP2471_006 | Reverse rule of 78 at 12 months, row 8 cumulative 46.15% | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_006-step4-ReverseRow8Cumulative_pass.png` | Row 8 cumulative = 0.4615 (the formula value, not the ticket's 53.85) |
| AP2471_007 | Term 24 rebuilds the table with 24 rows, Rule of 78 over 300 | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_007-step5-ProRataAt24Months_pass.png` | Table regenerates on blur (Tab), not while typing |
| AP2471_009 | Custom: monthly factors editable, cumulative recalculates | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_009-step5-CustomCumulativeRecalculated_pass.png` | Reported "not recalculated" defect is fixed |
| AP2471_010 | Custom curve saves and reopens with the same factors | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_010-step5-ReopenedCustomCurveFactorsKept_pass.png` | Reported "manual input does not save" defect is fixed (curve #9) |
| AP2471_011 | Saved Pro-Rata curve appears in the list with its values | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_011-step4-ProRataRowInList_pass.png` | Curve #10 listed: 36 · 0 - 100000 · Pro-Rata · Yes |
| AP2471_012 | Editing name and type updates the same list row | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_012-step4-ReopenedRuleOf78_pass.png` | Same record #10 updated; no duplicate; row 1 = 0.0541 |
| AP2471_013 | Form refuses blank name, zero/negative term, inverted odometer range | High | ❌ | 4 | 2 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_013-step4-InvertedRangeSaved_fail.png` | Odometer from 50000 / to 10000 saved (curve #11); no rule in ticket — confirm against Q-006 |
| AP2471_014 | Custom curve totalling 90% is refused or warned about | High | ❌ | 2 | 3 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_014-step4-NonNumericFactorHttp500_fail.png` | 90% total and a negative factor save silently (Q-009); a blank factor gives HTTP 500 |
| AP2471_001 | "Earning Curves" under Risk Management with the tachometer icon | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_001-step2-IconOnSectionNotItem_fail.png` | Icon is on the Risk Management section heading, not on the menu item — likely ticket wording |
| AP2471_002 | List page title, "Create New" and six columns | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_002-step4-OdometerAndEditAction_pass.png` | Edit is a pencil icon button with an "Edit" tooltip |
| AP2471_008 | 1-month term gives one row of 100%; 60-month term gives 60 rows | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_008-step4-RuleOf78At60Months_pass.png` | Row 60 monthly = 0.0005 (not 0.0000) |
| AP2471_015 | Admin can delete a curve they created | Medium | ⏭️ | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_015-step2-EditFormOnlySaveNoDelete_pass.png` | Delete not offered; Q-002 open |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED
> Executed High priority first (003–007, 009–014), then Medium (001, 002, 008, 015). Tables below are in TC-ID order.

---

## Step-by-Step Results

### AP2471_001 — The admin menu shows "Earning Curves" under Risk Management, with the tachometer icon, and opens the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in at `/admin/login` with Courriel / Mot de passe, click "Se connecter" | `/admin` loads with "Welcome to the admin" | URL = `/admin`; page text = "Vinh Le 1 Welcome to the admin" | ✅ | Login form fields are `_username` / `_password`; the visible labels are not linked to the inputs |
| 2 `[Verification]` | Check the sidebar "Risk Management" section lists "Earning Curves" and the link's `<i>` has class `fa-tachometer-alt-average` | Section lists "Earning Curves"; its icon carries `fa-tachometer-alt-average` | Section heading `h6.nav-link` "Risk Management" contains `<i class="nav-icon fad fa-tachometer-alt-average">`. Its items, in order: Earning Curves (`/admin/earning-curve`), Earning Sets, Earning Groups, Earning Assignments. The "Earning Curves" `<a>` contains **no `<i>` element at all** (icon list = empty) | ❌ | The tachometer icon is the Risk Management section's rail icon, not the menu item's. None of the four items has an icon. The ticket lists "Icon:" under the section sentence, so this is probably ticket wording, not a defect — confirm at Gate C |
| 3 | Click "Earning Curves" in the sidebar | Browser goes to `/admin/earning-curve` | Clicking the Risk Management rail icon opened the flyout; clicking "Earning Curves" navigated to `/admin/earning-curve` | ✅ | The flyout opens on clicking the section; links are hidden until then |
| 4 `[Verification]` | Verify the page is the Earning Curves page | URL `/admin/earning-curve`, heading "Earning Curves" | URL = `/admin/earning-curve`; `h1` = "Earning Curves" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_001-step2-IconOnSectionNotItem_fail.png` — the Risk Management flyout open; the tachometer icon sits on the section's rail button (outlined), the four items have no icons
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_001-step4-EarningCurvesPage_pass.png` — the Earning Curves list page after clicking the menu item

### AP2471_002 — The Earning Curves page shows its title, a "Create New" item and a list with the six required columns — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/earning-curve` | Page loads | URL = `/admin/earning-curve`; `h1` = "Earning Curves" | ✅ | Same session as AP2471_001 |
| 2 `[Verification]` | Verify the title and that the nav area offers exactly one item, "Create New" | Title "Earning Curves"; "Create New" shown | `h1` = "Earning Curves"; page `ul.nav` holds one item: link "Create New" → `/admin/earning-curve/new/edit` (red `btn btn-primary`) | ✅ | — |
| 3 `[Verification]` | Verify column headers in order | Name · Term month · Coverage odometer · Earning curve type · Is Enabled? · Actions | Headers = "Name", "Term month", "Coverage odometer", "Earning curve type", "Is Enabled?", "Actions"; no extra column | ✅ | — |
| 4 `[Verification]` | Check the odometer cell format and the Edit action on rows | Odometer "from - to"; each row has "Edit" | 8 rows at the time. Odometer cells e.g. "0 - 50000", "0 - 999999", "0 - 9999999". Actions cell on every row = pencil icon button (`fal fa-pen`) linking to `/admin/earning-curve/{id}/edit`, tooltip text = "Edit" | ✅ | The Edit action has no visible text, only an icon plus tooltip |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_002-step2-TitleAndCreateNew_pass.png` — list page with the title and the single "Create New" button
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_002-step3-SixColumnHeaders_pass.png` — the list table showing the six column headers
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_002-step4-OdometerAndEditAction_pass.png` — pencil button hovered, showing the "Edit" tooltip; odometer cells read "0 - 50000"

### AP2471_003 — A new earning curve form opens with Term month 12, type Pro-Rata and a 12-row earning points table — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/earning-curve` | Page loads | URL = `/admin/earning-curve` | ✅ | — |
| 2 | Click "Create New" | A new page with an empty form; record URL | Full page (not a modal) at `/admin/earning-curve/new/edit`; `h1` = "Create earning curve" | ✅ | Create route recorded |
| 3 `[Verification]` | Check fields, input types and defaults | Name text; Term month numeric = 12; odometer from/to numeric; type select = Pro-Rata with 4 options; Is Enabled? Yes/No toggle | `earning_curve[name]` text, required, empty · `earning_curve[termMonth]` number, min 1, max 999, value = 12 · `coverageOdometerFrom` / `coverageOdometerTo` number, min 0, empty · `earning_curve[type]` select (bootstrap-select) = `pro_rata`, options `pro_rata`=Pro-Rata, `rule_of_78`=Rule of 78, `reverse_rule_of_78`=Reverse rule of 78, `custom`=Custom · `earning_curve[isEnabled]` checkbox, checked = true | ✅ | "Is Enabled?" is a plain checkbox, not a styled switch; it works as a Yes/No control and defaults to Yes |
| 4 `[Verification]` | Check table columns, 12 rows, 4-decimal monthly factors, editability under Pro-Rata | 3 columns, rows 1–12, 4 decimals; editability recorded | Columns = "Earning point", "Monthly Factor", "Cumulative Factor"; 12 rows numbered 1–12; every monthly factor = `0.0833`, cumulative 0.0833 → 1.0000; all factor inputs `readonly` = true | ✅ | Q-010 observation: under Pro-Rata both factor columns are read-only number inputs. Q-004: fraction scale |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_003-step3-FormFieldsDefaults_pass.png` — Create earning curve form with Term month 12, Pro-Rata and Is Enabled? ticked
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_003-step4-TwelveRowTable_pass.png` — full page showing the 12-row earning points table

### AP2471_004 — A 12-month Pro-Rata curve earns 8.3333% every month and the cumulative factor reaches 100% at month 12 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create New" | Form with Term month 12, Pro-Rata | Term month = 12, type = `pro_rata`; initial table = 0.0833 every row, cumulative 0.0833 … 1.0000 | ✅ | The default Pro-Rata table on first load is correct |
| 2 | Select "Rule of 78", then "Pro-Rata" again | Table regenerates each time | After Rule of 78: row 1 = 0.1538 / 0.1538 (regenerated). After switching back to Pro-Rata: type select = `pro_rata`, button text = "Pro-Rata", but the table **still shows the Rule of 78 values** (row 1 = 0.1538 / 0.1538, row 12 = 0.0128 / 1.0000) | ❌ | Each type change POSTs the form back to `/admin/earning-curve/new/edit`; the Pro-Rata re-render returns the submitted points unchanged. Reproduced 4 of 4 times (Rule of 78 → Pro-Rata and Reverse → Pro-Rata). It only happens at Term month 12; at 24 and 60 months the switch back to Pro-Rata regenerates correctly |
| 3 | Read all 24 values | All captured | Monthly: 0.1538 · 0.1410 · 0.1282 · 0.1154 · 0.1026 · 0.0897 · 0.0769 · 0.0641 · 0.0513 · 0.0385 · 0.0256 · 0.0128. Cumulative: 0.1538 · 0.2949 · 0.4231 · 0.5385 · 0.6410 · 0.7308 · 0.8077 · 0.8718 · 0.9231 · 0.9615 · 0.9872 · 1.0000 | ❌ | These are the Rule of 78 values shown under the Pro-Rata label |
| 4 `[Verification]` | Verify every monthly = 8.3333 (0.0833) and cumulative = running total | 12 × 0.0833; cumulative 0.0833 → 1.0000 | Monthly factors run 0.1538 → 0.0128, not 0.0833; row 6 cumulative = 0.7308 instead of 0.5000; row 12 cumulative = 1.0000 | ❌ | An admin who tries another type and goes back to Pro-Rata on a 12-month curve will save a curve labelled Pro-Rata that actually earns as Rule of 78 (front-loaded revenue) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_004-step2-ProRataKeepsOtherTypeValues_fail.png` — type shows Pro-Rata but the table keeps the Reverse rule of 78 values (0.0128 rising)
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_004-step4-ProRataShowsRuleOf78Factors_fail.png` — final state: type Pro-Rata, table shows Rule of 78 factors 0.1538 → 0.0128

### AP2471_005 — Choosing Rule of 78 on a 12-month curve front-loads earning: 15.3846% in month 1 down to 1.2821% in month 12 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open a fresh "Create New" form | Term month 12 | Term month = 12, type = Pro-Rata | ✅ | Fresh page load |
| 2 | Select "Rule of 78" | Table regenerates, 12 rows | Type = `rule_of_78`; 12 rows numbered 1–12 | ✅ | — |
| 3 | Read all 24 values | All captured | Monthly: 0.1538 · 0.1410 · 0.1282 · 0.1154 · 0.1026 · 0.0897 · 0.0769 · 0.0641 · 0.0513 · 0.0385 · 0.0256 · 0.0128. Cumulative: 0.1538 · 0.2949 · 0.4231 · 0.5385 · 0.6410 · 0.7308 · 0.8077 · 0.8718 · 0.9231 · 0.9615 · 0.9872 · 1.0000 | ✅ | — |
| 4 `[Verification]` | Compare with the oracle | 15.3846 → 1.2821; cumulative 15.38 → 100.00, 73.08 at row 6 | Every monthly value equals the oracle ÷ 100 at 4 decimals; row 6 cumulative = 0.7308; row 12 = 1.0000 | ✅ | Matches the ticket's example table |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_005-step4-RuleOf78Factors_pass.png` — full Rule of 78 table at 12 months

### AP2471_006 — Choosing Reverse Rule of 78 on a 12-month curve back-loads earning, with month 8 cumulative at 46.15% — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open a fresh "Create New" form | Term month 12 | Term month = 12 | ✅ | — |
| 2 | Select "Reverse rule of 78" | 12 rows | Type = `reverse_rule_of_78`; 12 rows | ✅ | — |
| 3 | Read all 24 values | All captured | Monthly: 0.0128 · 0.0256 · 0.0385 · 0.0513 · 0.0641 · 0.0769 · 0.0897 · 0.1026 · 0.1154 · 0.1282 · 0.1410 · 0.1538. Cumulative: 0.0128 · 0.0385 · 0.0769 · 0.1282 · 0.1923 · 0.2692 · 0.3590 · 0.4615 · 0.5769 · 0.7051 · 0.8462 · 1.0000 | ✅ | — |
| 4 `[Verification]` | Compare with the oracle, row 8 especially | Rises 1.2821 → 15.3846; row 8 cumulative 46.15, not 53.85 | All 24 values match the oracle ÷ 100; row 8 cumulative = 0.4615 | ✅ | The app follows the formula, not the ticket's wrong example (Q-007) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_006-step4-ReverseRow8Cumulative_pass.png` — Reverse rule of 78 table, row 8 outlined (0.1026 / 0.4615)

### AP2471_007 — Changing Term month to 24 rebuilds the table with 24 rows and recalculates Rule of 78 over 300 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fresh form, select "Rule of 78" | 12-row Rule of 78 table | 12 rows, row 1 = 0.1538 | ✅ | — |
| 2 | Clear Term month, type `24`, press Tab | Table regenerates; record when | While typing: still 12 rows, no request sent. After Tab: one form POST, table = 24 rows | ✅ | Regenerates on blur (change event), not on each keystroke |
| 3 `[Verification]` | 24 rows numbered 1–24; spot rows match | Row 1 8.0000/8.00 … row 24 0.3333/100.00 | 24 rows numbered 1–24. Row 1 = 0.0800 / 0.0800 · row 2 = 0.0767 / 0.1567 · row 12 = 0.0433 / 0.7400 · row 23 = 0.0067 / 0.9967 · row 24 = 0.0033 / 1.0000 | ✅ | Denominator 300 confirmed |
| 4 | Select "Pro-Rata" | 24 rows | 24 rows, type = `pro_rata` | ✅ | At 24 months the switch back to Pro-Rata does regenerate (contrast AP2471_004) |
| 5 `[Verification]` | Rows 1, 12, 24 match Pro-Rata at 24 months | 4.1667 every row; 4.17 / 50.00 / 100.00 | Row 1 = 0.0417 / 0.0417 · row 12 = 0.0417 / 0.5000 · row 24 = 0.0417 / 1.0000 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_007-step3-RuleOf78At24Months_pass.png` — 24-row Rule of 78 table
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_007-step5-ProRataAt24Months_pass.png` — 24-row Pro-Rata table, 0.0417 every row

### AP2471_008 — A 1-month term gives one row of 100% for each predefined type, and a 60-month term gives 60 rows — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create New" | Form opens | Form opens at `/admin/earning-curve/new/edit` | ✅ | — |
| 2 | Term month `1` + Tab; switch through Pro-Rata, Rule of 78, Reverse rule of 78 | One row, 100.0000 / 100.00 each time | Pro-Rata: row "1" = 1.0000 / 1.0000. Rule of 78: 1.0000 / 1.0000. Reverse rule of 78: 1.0000 / 1.0000. No error message or blank cell | ✅ | — |
| 3 | Term month `60` + Tab, select "Rule of 78" | Table regenerates | 60 rows after Tab; regenerated again on selecting Rule of 78 | ✅ | — |
| 4 `[Verification]` | 60 rows; row 1 = 3.2787; row 60 = 0.0546 (not 0); row 60 cumulative = 100.00 | As stated | 60 rows. Row 1 = 0.0328 / 0.0328 · row 2 = 0.0322 / 0.0650 · row 59 = 0.0011 / 0.9995 · row 60 = 0.0005 / 1.0000. Zero factors = 0. Extra check: Pro-Rata at 60 = 0.0167 every row, row 60 cumulative 1.0000 | ✅ | At fraction scale the smallest factor shows as 0.0005 (true value 0.000546) — not rounded to zero, but only one significant digit survives (see Environment Observations) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_008-step4-RuleOf78At60Months_pass.png` — end of the 60-row Rule of 78 table, row 60 outlined (0.0005 / 1.0000)

### AP2471_009 — With the Custom type, the monthly factors become editable and the cumulative factor recalculates on every change — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fresh form, Term month `4` + Tab | 4-row table | 4 rows, Pro-Rata 0.2500 each, all read-only | ✅ | — |
| 2 | Select "Custom" | Monthly Factor cells become editable; record start values | Monthly Factor inputs `readonly` = false; Cumulative Factor stays read-only. Start values = `0.0000` in every monthly and cumulative box | ✅ | Q-010: Custom starts at zeros, not the previous type's values |
| 3 | Type 0.4000, 0.3000, 0.2000, 0.1000 (Tab after each) | Cumulative 40/70/90/100 | Cumulative = 0.4000 · 0.7000 · 0.9000 · 1.0000 | ✅ | Typed in the app's fraction scale |
| 4 | Change row 2 to 0.2500 + Tab | Cumulative updates without reload | Cumulative updated instantly in the page (client-side `input` handler), URL unchanged, no form POST | ✅ | — |
| 5 `[Verification]` | Cumulative now 40/65/85/95 | Rows 2–4 recalculated | Monthly = 0.4000 · 0.2500 · 0.2000 · 0.1000; cumulative = 0.4000 · 0.6500 · 0.8500 · 0.9500 | ✅ | The "cumulative not recalculated" half of Ken Nguyen's 2026-09-24 report is fixed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_009-step5-CustomCumulativeRecalculated_pass.png` — Custom table after the row 2 change, cumulative 0.4000 / 0.6500 / 0.8500 / 0.9500

### AP2471_010 — A Custom curve with typed factors saves, and reopening it shows the same factors — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create New" | Form opens | Form opens | ✅ | — |
| 2 | Name `QA-AP2471-Custom-0043`, Term 4 (Tab), odometer 0 / 60000, Custom, Is Enabled? Yes, factors 0.4/0.3/0.2/0.1 | Values shown; cumulative 40/70/90/100 | Name = "QA-AP2471-Custom-0043", termMonth = 4, odometer = 0 / 60000, type = `custom`, isEnabled = true; monthly 0.4000/0.3000/0.2000/0.1000; cumulative 0.4000/0.7000/0.9000/1.0000 | ✅ | Odometer was filled after the Term and type changes, because each of those re-posts the form |
| 3 | Click the save button; record label, message, landing URL | Success or back to list | Button label = "Save" (`earning_curve[save]`). Landed on `/admin/earning-curve` with alert "Earning curve saved" | ✅ | — |
| 4 | Find the row and click "Edit" | Edit form opens | Row = "QA-AP2471-Custom-0043 · 4 · 0 - 60000 · Custom · Yes"; Edit → `/admin/earning-curve/9/edit`, `h1` = "Earning curve #9" | ✅ | — |
| 5 `[Verification]` | All values stored and shown again | Name, term 4, 0 / 60000, Custom, Yes, factors 0.4/0.3/0.2/0.1, cumulative 40/70/90/100 | Name = "QA-AP2471-Custom-0043", termMonth = 4, odometer = 0 / 60000, type = `custom`, isEnabled = true; monthly = 0.4000 · 0.3000 · 0.2000 · 0.1000 (editable); cumulative = 0.4000 · 0.7000 · 0.9000 · 1.0000 | ✅ | The "manual input does not save" defect is fixed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_010-step3-EarningCurveSavedAlert_pass.png` — list page with the "Earning curve saved" alert
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_010-step5-ReopenedCustomCurveFactorsKept_pass.png` — Earning curve #9 reopened with its four custom factors intact

### AP2471_011 — A saved Pro-Rata curve appears in the list with its name, term, odometer range, type and enabled state — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create New" | Form opens | Form opens | ✅ | — |
| 2 | Name `QA-AP2471-ProRata-0043`, Term 36 (Tab), odometer 0 / 100000, Pro-Rata, Yes | 36 rows of 2.7778 | 36 rows, every monthly = 0.0278, row 36 cumulative = 1.0000; type = `pro_rata`; isEnabled = true | ✅ | — |
| 3 | Click "Save" | Success message or list | `/admin/earning-curve` with alert "Earning curve saved" | ✅ | — |
| 4 `[Verification]` | Row exists with the right values and an Edit action | QA-AP2471-ProRata-0043 · 36 · 0 - 100000 · Pro-Rata · Yes · Edit | Row = "QA-AP2471-ProRata-0043 · 36 · 0 - 100000 · Pro-Rata · Yes", Edit → `/admin/earning-curve/10/edit` | ✅ | Newest curve is listed first |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_011-step4-ProRataRowInList_pass.png` — list with the new Pro-Rata curve row outlined

### AP2471_012 — Editing a saved curve's name and type through "Edit" stores the change and updates its list row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Find `QA-AP2471-ProRata-0043`; note row count | Curve listed; count recorded | Curve #10 listed; list row count = 10 (all curves fit on page 1) | ✅ | Reused the curve from AP2471_011, as the TC allows |
| 2 | Click "Edit" | Edit form with saved values and a 36-row Pro-Rata table | `/admin/earning-curve/10/edit`, `h1` = "Earning curve #10"; name, term 36, odometer 0 / 100000, Pro-Rata, enabled; 36 rows of 0.0278 | ✅ | — |
| 3 | Rename to `QA-AP2471-Edited-0043`, select Rule of 78, check row 1 = 5.4054, Save | Success | Row 1 monthly = 0.0541 before save; odometer still 0 / 100000. Save → `/admin/earning-curve` with "Earning curve saved" | ✅ | 0.0541 = 5.4054% at 4 decimals |
| 4 `[Verification]` | Row updated, old name gone, count unchanged, reopen shows Rule of 78 | Same record updated; row 1 = 5.4054 | Row = "QA-AP2471-Edited-0043 · 36 · 0 - 100000 · Rule of 78 · Yes"; rows named QA-AP2471-ProRata-0043 = 0; row count = 10. Reopened #10: type = `rule_of_78`, row 1 = 0.0541, row 36 = 0.0015 / 1.0000 | ✅ | No duplicate created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_012-step4-EditedRowInList_pass.png` — list showing the renamed row, type Rule of 78
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_012-step4-ReopenedRuleOf78_pass.png` — curve #10 reopened with the Rule of 78 table

### AP2471_013 — The form refuses a blank name, a zero or negative term, and an odometer range whose start exceeds its end — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create New" | Form opens | Form opens | ✅ | — |
| 2 | Attempt A: blank name, Term 12, odometer 0 / 50000, Save | Refused; message names "Name" | Form posted and came back on `/admin/earning-curve/new/edit` with "This value should not be blank." under Name; nothing saved | ✅ | Server-side message (English). Browser tooltip would be "Please fill out this field." |
| 3 | Attempt B: Term `0` + Tab, record row count, Save. Attempt C: Term `-1` | Each refused with a Term month message | B: after Tab the table stayed at 12 rows (no regeneration); Save refused with "This value should be between 1 and 999." under Term month, browser message "Value must be greater than or equal to 1.". C: same — 12 rows, same two messages, nothing saved | ✅ | Term month range is 1–999 (answers part of Q-005) |
| 4 | Attempt D: name `QA-AP2471-Neg-Range`, Term 12, odometer from `50000` to `10000`, Save | Refused with an odometer-range message | **Saved.** Landed on `/admin/earning-curve` with "Earning curve saved"; no error shown | ❌ | No rule in ticket — confirm against Q-006. A range that can never match a vehicle is now stored |
| 5 `[Verification]` | None of the four invalid curves is listed | No rows for blank, Neg-Zero, Neg-Minus, Neg-Range | Blank / Neg-Zero / Neg-Minus: not listed (checked page 1 and page 2). **QA-AP2471-Neg-Range is listed** (attempt D): "12 · 50000 - 10000 · Pro-Rata · Yes", id 11 | ❌ | Attempt D's curve exists on staging |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_013-step2-BlankNameRefused_pass.png` — form returned with "This value should not be blank." under Name
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_013-step3-TermZeroRefused_pass.png` — Term month 0 refused, "This value should be between 1 and 999."
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_013-step3-TermMinusOneRefused_pass.png` — Term month -1 refused, same message
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_013-step4-InvertedRangeSaved_fail.png` — list page with "Earning curve saved" after submitting 50000 / 10000
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_013-step5-NegRangeRowListed_fail.png` — list with the QA-AP2471-Neg-Range row outlined, odometer "50000 - 10000"

### AP2471_014 — A Custom curve whose monthly factors total 90% instead of 100% is refused or warned about, not silently saved — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Name `QA-AP2471-Neg-Custom90-0043`, Term 4 (Tab), odometer 0 / 60000, Custom | 4 editable rows | 4 rows; monthly inputs editable, starting at 0.0000 | ✅ | — |
| 2 | Type 0.4000, 0.3000, 0.1000, 0.1000 | Cumulative ends at 90.00 | Cumulative = 0.4000 · 0.7000 · 0.8000 · 0.9000 | ✅ | — |
| 3 | Click "Save" | Refused, or a not-100% warning | **Saved silently.** `/admin/earning-curve` with "Earning curve saved"; no warning | ❌ | No rule in ticket — confirm against Q-009. A curve that only ever recognises 90% of the premium is accepted |
| 4 | Row 4 = `-0.0500`, Save; then row 4 = `abc`, Save | Each refused with a message | `-0.0500`: box accepted it, cumulative row 4 = 0.7500; Save → "Earning curve saved"; reopening #12 shows row 4 = -0.0500. `abc`: the number box would not take letters and was left empty; Save → **HTTP 500**, French "Erreur — Désolé, l'application éprouve des difficultés techniques" page at `/admin/earning-curve/12/edit`. Reopening shows row 4 still -0.0500 (nothing written) | ❌ | Negative factor: no rule in ticket — confirm against Q-009. Empty factor → HTTP 500 reproduced 2 of 2; the field has HTML `required` but the form still submits. The 500 is a server error, not a validation message |
| 5 `[Verification]` | Check whether `QA-AP2471-Neg-Custom90-0043` exists | It does not exist | **It exists**: "QA-AP2471-Neg-Custom90-0043 · 4 · 0 - 60000 · Custom · Yes" (id 12), now stored with factors 0.4000 / 0.3000 / 0.1000 / -0.0500 (total 0.7500) | ❌ | Recorded for Gate C: saved with an invalid total |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_014-step3-Custom90SavedSilently_fail.png` — "Earning curve saved" after submitting factors totalling 0.9000
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_014-step4-NegativeFactorSaved_fail.png` — "Earning curve saved" after a -0.0500 factor
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_014-step4-NonNumericFactorHttp500_fail.png` — HTTP 500 "Erreur" page after saving with an empty factor box
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_014-step5-Custom90CurveListed_fail.png` — list with the QA-AP2471-Neg-Custom90-0043 row outlined

### AP2471_015 — An admin can delete an earning curve they created, and it disappears from the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2471-Del-0043`, Term 12, odometer 0 / 10000, Pro-Rata, Is Enabled? No | Curve listed | Saved with "Earning curve saved"; row = "QA-AP2471-Del-0043 · 12 · 0 - 10000 · Pro-Rata · No" (id 13) | ✅ | — |
| 2 | Look for a delete control in the row's Actions and in its Edit form | Control found, or SKIPPED | Actions cell holds only the pencil "Edit" button. Edit form `/admin/earning-curve/13/edit` holds only the type dropdown and "Save". No element on either page mentions delete, remove, supprimer or trash | ⏭️ | Delete not offered; Q-002 open |
| 3 | Click delete | — | Not run | ⏭️ | Skipped: no delete control |
| 4 | Confirm deletion | — | Not run | ⏭️ | Skipped: no delete control |
| 5 `[Verification]` | Curve gone, others still listed | — | Not run; QA-AP2471-Del-0043 remains on staging | ⏭️ | Skipped: no delete control |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_015-step2-ListRowOnlyEditNoDelete_pass.png` — list row for QA-AP2471-Del-0043 with only the Edit button
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_015-step2-EditFormOnlySaveNoDelete_pass.png` — Edit form for curve #13, only a Save button

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2471_015 | ⏭️ | Delete not offered; Q-002 open. Neither the list's Actions column nor the Edit form has a delete control, so there is nothing to test. We cannot tell whether this is a bug or a deliberate scope cut until Q-002 is answered |

---

## Test Data Created on Staging

No delete control exists, so nothing could be cleaned up. These curves were created by this run and remain on staging:

| Id | Name | Term | Odometer | Type | Enabled | Created by | Notes |
|---|---|---|---|---|---|---|---|
| 9 | QA-AP2471-Custom-0043 | 4 | 0 - 60000 | Custom | Yes | AP2471_010 | Factors 0.4 / 0.3 / 0.2 / 0.1 |
| 10 | QA-AP2471-Edited-0043 | 36 | 0 - 100000 | Rule of 78 | Yes | AP2471_011, renamed in AP2471_012 | Was QA-AP2471-ProRata-0043 (Pro-Rata) |
| 11 | QA-AP2471-Neg-Range | 12 | 50000 - 10000 | Pro-Rata | Yes | AP2471_013 attempt D | Invalid odometer range |
| 12 | QA-AP2471-Neg-Custom90-0043 | 4 | 0 - 60000 | Custom | Yes | AP2471_014 | Factors 0.4 / 0.3 / 0.1 / -0.05 (total 0.75) |
| 13 | QA-AP2471-Del-0043 | 12 | 0 - 10000 | Pro-Rata | No | AP2471_015 | Meant to be deleted; delete not offered |

No seeded curve (ids 1–6) or AP-2472 curve (ids 7–8) was edited.

---

## Environment Observations

- The list now has 13 curves and paginates at 10 rows per page (`?page=2` holds "1 year"). Anyone counting curves must check both pages.
- Every type change and every Term month change (on blur) POSTs the whole form back to the same URL and re-renders the page. Fill the odometer fields last, right before Save.
- The admin login page's "Courriel" / "Mot de passe" labels are not linked to their inputs (`_username`, `_password`), so label-based locators fail. Use the input names.
- Factor precision: because the app stores a fraction with 4 decimals, long terms lose precision. At 60 months the Rule of 78 row 60 factor shows 0.0005 against a true 0.000546. This passed the test as written, but it is relevant to Q-004 and Q-008.
- The Playwright server writes its `console-*.log` and `page-*.yml` files into `qa-artifacts/4-execution-results/screenshots/` instead of `playwright-log/`, so its `--output-dir` setting does not match `qa-config/tools.md` §3. The evidence for this run is in the `5.2.0/AP-2471/` subfolder only.
- No slowness or 5xx errors apart from the HTTP 500 recorded in AP2471_014.


---

## Addendum — Gate C follow-up, 2026-10-04 (run by the pipeline orchestrator)

### AP2471_001 — re-test after correction → ✅ PASS

At Gate C the QA ruled the AP2471_001 failure **not a bug**: the reporter's mock-up (`Screenshot 2026-09-18 at 4.47.19 PM.png`) puts the tachometer icon on the Risk Management sidebar button. Step 2 was corrected by `stlc-testcase-designer` (correction mode) and re-run:

| Step | Actual Result | Status |
|:---:|---|:---:|
| 1 | `/admin` loads with "Welcome to the admin". | ✅ |
| 2 | The "RISK MANAGEMENT" heading icon has the class `nav-icon fad fa-tachometer-alt-average`. Its items are Earning Curves, Earning Sets, Earning Groups and Earning Assignments. The "Earning Curves" link has 0 icon elements. | ✅ |
| 3 | Clicking "Earning Curves" goes to `/admin/earning-curve`. | ✅ |
| 4 | The heading reads "Earning Curves". | ✅ |

Screenshots: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2471/AP2471_001-step2-pass.png`, `AP2471_001-step4-pass.png`

### Bug re-verification before filing

The QA asked for both bugs to be re-checked before filing. Both reproduced:

- **BUG-001 (AP2471_004).** On curve #13 (`QA-AP2471-Del-0043`, Term month 12), the sequence Pro-Rata → Rule of 78 → Pro-Rata left the Rule of 78 factors in place. Clicking **Save** then stored a curve labelled Pro-Rata with factors 0.1538 → 0.0128, which the list and the reopened form both confirmed. Curve #13 is left that way as evidence. Screenshots: `BUG-001-verify-before-save.png`, `BUG-001-verify-after-save-reopen.png`.
- **BUG-002 (AP2471_014).** On curve #12, clearing the row 4 Monthly Factor box (no letters typed) and pressing Tab sends no request; the cumulative treats the empty box as 0. Clicking **Save** sends `POST /admin/earning-curve/12/edit`, which returns **500** with the "Erreur" page, and nothing is written. Screenshot: `BUG-002-verify-cleared-factor-save.png`.

Filed as **AP-2485** (BUG-001, High) and **AP-2486** (BUG-002, Medium).

### Revised totals

| PASS | FAIL | BLOCKED | SKIPPED |
|:---:|:---:|:---:|:---:|
| 11 | 3 | 0 | 1 |

The remaining FAILs are AP2471_004 (AP-2485), AP2471_013 (inverted odometer range saves — question to Ken Nguyen, comment 19344, Q-006) and AP2471_014 (HTTP 500 filed as AP-2486; the total ≠ 100% and negative-factor findings are questions in comment 19344, Q-009).

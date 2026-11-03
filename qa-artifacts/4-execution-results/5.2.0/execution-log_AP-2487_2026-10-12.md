# Execution Log — AP-2487

> Written by the **stlc-manual-executor** skill (pipeline stage s4) for Jira ticket AP-2487 —
> *Earning assignments parameter: Add warranty start date range and Make Coverage Code multiple choices*.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-12
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging) — Admin portal
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 10:26 → 10:36 (local time)
**Test-case files:** `qa-artifacts/3-test-cases/AP2487_TestCases_001-005.md`, `AP2487_TestCases_006-010.md`, `AP2487_TestCases_011-012.md`

| Metric | Value |
|---|:---:|
| Total test cases | 12 |
| Passed | 12 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (12 of 12)** |

### Pre-run checks

| Check | Result | Evidence |
|---|:---:|---|
| Environment health — `/admin/login` loads | ✅ PASS | The French login form showed "Connexion", the "Courriel" and "Mot de passe" boxes and the "Se connecter" button; login with the shared admin account then landed on `/admin`. `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/env-check-login-pass.png` |
| `env-check` source | — | Declared `missing` in the knowledge registry; the login check above stood in for it. |
| Build check — "Start date from" on Add Parameter | ✅ PASS | Opened Add Parameter on existing assignment #15 (nothing submitted, closed with Escape): `#earning_assignment_parameter_warrantyStartDateFrom` and `…_warrantyStartDateTo` both present; `…_coverageCodes` is a `multiple` select with 57 codes. The AP-2487 build is on staging. `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/build-check-StartDateFieldPresent_pass.png` |

### Test data created (Dynamic) — left on staging

| Record | Id | Detail |
|---|---|---|
| Earning assignment **QA-AP2487-102722** | **#16** | Profit / Group A / Enabled. Holds **9 parameters**: 28 (`0 - 248702`), 29 (`248703`), 30 (`248704`), 32 (`248755`), 33 (`248705`), 34 (`248706`), 36 (`248708`), 37 (`248709`), 38 (`248711`) |
| Earning assignment **QA-AP2487-103520** | **#17** | Profit / Group A / Enabled. Holds **1 parameter**: 39 (`0 - 248712`, all 57 coverage codes) — created because #16 reached 9 rows (AP-2484 limit) |
| Parameters 31 and 35 | deleted | Created by mistake through two test-script slips (see Environment Observations) and removed with the row's trash-can action ("Parameter unassigned"). Neither still exists |

Seeded assignment #1 "AV+" and its parameter 1 were only opened (AP2487_010) and were never submitted.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2487_001 | The parameter form shows optional "Start date from" and "Start date To" date fields right after "Sale Date to" | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_001-step4-StartDateFieldsAfterSaleDate_pass.png` | Fields in the right place, optional, empty, gijgo date picker |
| AP2487_002 | A parameter saved with both start dates shows that range in the list's "Start date" column | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_002-step3-StartDateRangeInGrid_pass.png` | Grid shows `2026-01-01 - 2026-12-31`; Sale Date still "All" |
| AP2487_003 | Editing a parameter shows its stored start dates, and changed dates replace the old ones | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_003-step4-EditedStartDatesAfterReload_pass.png` | Edit pre-filled; new range `2026-02-01 - 2026-09-30` kept after reload |
| AP2487_004 | Clearing both start dates on Edit removes the range from the parameter | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_004-step4-ClearedStartDatesEditEmpty_pass.png` | Cleared range saved; grid cell blank (Q-003) |
| AP2487_005 | A parameter saves with only "Start date from" or only "Start date To" filled, as an open-ended range | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_005-step4-OpenEndedStartDateRows_pass.png` | Half ranges show `2026-04-01 -` and `- 2026-04-30` (no "All") |
| AP2487_006 | A start date range whose "from" is later than its "to" is refused or saved cleanly, never an error page | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_006-step3-ReversedRangeSavedAsEntered_pass.png` | Q-002: reversed range saved silently as entered |
| AP2487_007 | Typing text that is not a date into "Start date from" does not save a wrong date or show an error page | Low | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_007-step3-NotValidMessageOnStartDateFrom_pass.png` | "abc" refused: "This value is not valid."; nothing saved |
| AP2487_008 | A parameter saved with two coverage codes keeps both, in the list and when reopened for Edit | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_008-step4-EditShowsTwoCodesTicked_pass.png` | Both codes stored; grid lists one per line (Q-004) |
| AP2487_009 | Adding and removing coverage codes on Edit saves exactly the newly ticked codes | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_009-step4-EditedCodesSavedExactly_pass.png` | AP-CADV removed; AFPP + AFPPAVN stored exactly |
| AP2487_010 | A parameter saved before this change still shows its single coverage code ticked when opened for Edit | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_010-step4-SeededRowUnchangedAfterReload_pass.png` | Seeded AX code ticked; closed with Escape, row unchanged |
| AP2487_011 | A parameter with no start dates and no coverage code still saves and shows "All", as before this change | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_011-step4-EmptyOptionalRowShowsAll_pass.png` | Blank Model Year Age refused cleanly; empty row saves, "All" + blank Start date |
| AP2487_012 | Ticking every coverage code with "Select All" saves the parameter and lists it without an error | Low | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_012-step3-GridListsEveryCode_pass.png` | 57/57 codes saved; grid lists all 57 (Q-005), no "All" summary |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2487_001 — The parameter form shows optional "Start date from" and "Start date To" date fields right after "Sale Date to" — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in; create assignment `QA-AP2487-<HHMMSS>` (Profit / Group A / Enabled) → Save | Details page "Earning Assignment QA-AP2487-…" with nav "Edit" and "Add Parameter" | URL = `/admin/earning-assignment/16/details`; heading = "Earning Assignment QA-AP2487-102722"; alert = "Earning assignment saved"; nav links "Edit" (`/16/edit`) and "Add Parameter" (`/16/parameter/add`) visible; grid = "No entities found" | ✅ | Fixture assignment #16 created at 10:27:22 |
| 2 | Click Add Parameter, wait for "Coverage odometer from" | "Add Parameter" dialog opens with Submit | Modal heading = "Add Parameter"; button "Submit" count = 1 | ✅ | Modal loaded by AJAX as documented |
| 3 | Click into Start date from, then Start date To | Each box accepts a date; picker opens or browser date input — record which | Both inputs are `type="text"` with class `datepicker` inside a `gj-datepicker` wrapper (same widget as Sale Date); a gijgo calendar popup became visible on each click | ✅ | Recorded: gijgo date picker, not a native date input |
| 4 `[Verification]` | Read labels in order; for the new fields read label, `*`, `required`, starting value | "Start date from"/"Start date To" right after "Sale Date to", before "Coverage odometer from"; no `*`, no `required`, empty | Label order = Condition, Coverage Code, Sale Date from, Sale Date to, **Start date from**, **Start date To**, Coverage odometer from*, …; new labels have no `*` and no `required` class; inputs `required = false`, `value = ""` (both) | ✅ | Minor: Start date boxes have no "All" placeholder, unlike Sale Date |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_001-step4-StartDateFieldsAfterSaleDate_pass.png` — Add Parameter dialog showing the two empty Start date boxes between Sale Date to and Coverage odometer from

### AP2487_002 — A parameter saved with both start dates shows that range in the list's "Start date" column — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details; note headings | Headings include "Start date" | Headings = Condition · Coverage Code · Sale Date · **Start date** · Coverage odometer · Model Year Age · Make · Lag Interval · Earning Group · Actions | ✅ | "Start date" column sits right after Sale Date |
| 2 | Add Parameter with B values, odometer to 248702, Start date 2026-01-01 / 2026-12-31 → Submit | Dialog closes, no validation message or error page | Dialog closed; URL = `/admin/earning-assignment/16/details`; no field error | ✅ | Parameter id 28 |
| 3 `[Verification]` | Read alert and row `0 - 248702` Start date and Sale Date cells | Alert "Parameter added"; Start date = `2026-01-01 - 2026-12-31`; Sale Date = "All" | Alert = "Parameter added"; row `0 - 248702`: Start date = "2026-01-01 - 2026-12-31", Sale Date = "All" | ✅ | Format matches Sale Date's `from - to` style |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_002-step3-StartDateRangeInGrid_pass.png` — details grid with the new Start date column showing 2026-01-01 - 2026-12-31

### AP2487_003 — Editing a parameter shows its stored start dates, and changed dates replace the old ones — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details | Details page shown | Heading = "Earning Assignment QA-AP2487-102722" | ✅ | Reused #16 (1 row) |
| 2 `[Pre-Condition]` | Add B values, odometer to 248703, Start date 2026-01-01 / 2026-06-30 → Submit | Alert "Parameter added"; row shows `2026-01-01 - 2026-06-30` | Alert = "Parameter added"; row `0 - 248703` Start date = "2026-01-01 - 2026-06-30" | ✅ | Parameter id 29 |
| 3 | Pencil on `0 - 248703`; read start dates; replace with 2026-02-01 / 2026-09-30 → Submit | Edit dialog pre-filled with 2026-01-01 / 2026-06-30; closes without error | Modal heading = "Edit Parameter"; Start date from = "2026-01-01", Start date To = "2026-06-30"; after Submit dialog closed, back on details page | ✅ | Stored values loaded into Edit |
| 4 `[Verification]` | Read alert and row, reload, read again | "Parameter saved"; row count unchanged; after reload Start date = `2026-02-01 - 2026-09-30` | Alert = "Parameter saved"; rows = 2 (unchanged); after reload row `0 - 248703` Start date = "2026-02-01 - 2026-09-30"; old dates gone | ✅ | Edit replaces, does not add a row |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_003-step4-EditedStartDatesAfterReload_pass.png` — grid after reload showing the new range on the 248703 row

### AP2487_004 — Clearing both start dates on Edit removes the range from the parameter — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details | Details page shown | Heading = "Earning Assignment QA-AP2487-102722" (2 rows) | ✅ | — |
| 2 `[Pre-Condition]` | Add B values, odometer to 248704, Start date 2026-03-01 / 2026-03-31 → Submit | Alert "Parameter added"; row shows `2026-03-01 - 2026-03-31` | Alert = "Parameter added"; row `0 - 248704` Start date = "2026-03-01 - 2026-03-31" | ✅ | Parameter id 30 |
| 3 | Pencil on `0 - 248704`; clear both start dates → Submit | Closes without validation message or error page | Edit opened with "2026-03-01"/"2026-03-31"; both cleared to ""; after Submit URL = details page, no field error | ✅ | — |
| 4 `[Verification]` | Read alert, reload, read Start date cell, reopen Edit and read boxes (Escape) | "Parameter saved"; cell no longer shows the dates (record blank or "All"); Edit boxes empty | Alert = "Parameter saved"; after reload Start date cell = "" (**blank**, not "All"); Edit dialog Start date from = "", Start date To = "" | ✅ | Q-003: empty Start date renders blank, while other empty fields render "All" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_004-step4-ClearedStartDatesEditEmpty_pass.png` — Edit dialog reopened with both Start date boxes empty
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_004-step4-StartDateCellBlankInGrid_pass.png` — grid row 248704 with a blank Start date cell

### AP2487_005 — A parameter saves with only "Start date from" or only "Start date To" filled, as an open-ended range — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details (needs room for 2 rows) | Details page shown | Heading = "Earning Assignment QA-AP2487-102722" (3 rows) | ✅ | — |
| 2 | Add B values, odometer to 248705, Start date from 2026-04-01, To empty → Submit | "Parameter added"; no validation or error page | Alert = "Parameter added"; submitted form data warrantyStartDateFrom = "2026-04-01", warrantyStartDateTo = "" | ✅ | Parameter id 33. First attempt was spoiled by a script timing slip (row 31, deleted) — see Environment Observations |
| 3 | Add B values, odometer to 248755, Start date To 2026-04-30, from empty → Submit | "Parameter added"; no validation or error page | Alert = "Parameter added"; no field error | ✅ | Parameter id 32 |
| 4 `[Verification]` | Read Start date cells of rows `0 - 248705` and `0 - 248755` | 248705 shows 2026-04-01 with open end; 248755 shows open start with 2026-04-30; no un-entered date. Record exact text | Row `0 - 248705` Start date = "2026-04-01 -"; row `0 - 248755` Start date = "- 2026-04-30"; Edit dialogs confirm 33 = "2026-04-01"/"" and 32 = ""/"2026-04-30" | ✅ | Open end shown as nothing, not "All" as Sale Date does — display inconsistency, not a wrong value |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_005-step4-OpenEndedStartDateRows_pass.png` — grid with "2026-04-01 -" and "- 2026-04-30" half ranges

### AP2487_006 — A start date range whose "from" is later than its "to" is refused or saved cleanly, never an error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details; note row count | Details page shown | Heading = "Earning Assignment QA-AP2487-102722"; rows = 5 | ✅ | — |
| 2 | Add B values, odometer to 248706, Start date from 2026-12-31, To 2026-01-01 → Submit | Validation message, or "Parameter added"; never HTTP 500 | POST `/16/parameter/add` → HTTP 302; alert = "Parameter added"; no validation message | ✅ | Parameter id 34 |
| 3 `[Verification]` | Read the page and row `0 - 248706` | Saved: row shows `2026-12-31 - 2026-01-01` exactly as entered. Record outcome for Q-002 | Row `0 - 248706` Start date = "2026-12-31 - 2026-01-01" (not swapped, not dropped); rows = 6 | ✅ | Q-002: reversed range is **saved silently**; same as the odometer range |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_006-step3-ReversedRangeSavedAsEntered_pass.png` — grid row 248706 showing 2026-12-31 - 2026-01-01

### AP2487_007 — Typing text that is not a date into "Start date from" does not save a wrong date or show an error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details; note row count | Details page shown | Rows = 6 | ✅ | — |
| 2 | Add B values, odometer to 248707, type `abc` in Start date from → Submit | Box refuses letters, or validation message; no HTTP 500 | Box accepted the letters (value = "abc", still "abc" after leaving the box); POST → HTTP 200 with the standalone page `/16/parameter/add` | ✅ | Server-side validation, as for blank required fields |
| 3 `[Verification]` | Read the page; check for a `0 - 248707` row | Clear message on Start date from and nothing saved, or saved with empty date; never `abc`/invented date | Heading = "Add Parameter"; under "Start date from": "ERROR This value is not valid."; other values kept (odometer to 248707 etc.); back on details: rows = 6, rows containing 248707 = 0 | ✅ | Refused cleanly, nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_007-step3-NotValidMessageOnStartDateFrom_pass.png` — standalone Add Parameter page with "This value is not valid." under Start date from

### AP2487_008 — A parameter saved with two coverage codes keeps both, in the list and when reopened for Edit — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details | Details page shown | Heading = "Earning Assignment QA-AP2487-102722" | ✅ | — |
| 2 | Add Parameter; tick "AP-CADV - Advanced" and "AFPP - AFPP"; close list; B values, odometer to 248708 → Submit | Both stay ticked; button shows both codes or "2 items selected"; "Parameter added" | After first tick: selected = [AP-CADV]; after second: list items ticked = [AP-CADV - Advanced, AFPP - AFPP]; list closed with its toggle; button text = "AP-CADV - Advanced, AFPP - AFPP"; form posted coverageCodes[] = 50, 52; alert = "Parameter added" | ✅ | Parameter id 36. First attempt (row 35) spoiled by a script click on "Deselect All" — deleted, see Environment Observations |
| 3 | Read row `0 - 248708` Coverage Code cell | Lists AP-CADV and AFPP (record format for Q-004) | Coverage Code cell = "AP-CADV - Advanced" and "AFPP - AFPP" as two stacked lines (one `<div>` per code) | ✅ | Q-004: one code per line, full "CODE - Name" label |
| 4 `[Verification]` | Pencil on the row; open Coverage Code; read ticks; Escape | Exactly AP-CADV and AFPP ticked | Edit button text = "AP-CADV - Advanced, AFPP - AFPP"; ticked items = [AP-CADV - Advanced, AFPP - AFPP]; no other | ✅ | Closed with Escape, nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_008-step4-EditShowsTwoCodesTicked_pass.png` — Edit dialog with the Coverage Code list open and the two codes ticked

### AP2487_009 — Adding and removing coverage codes on Edit saves exactly the newly ticked codes — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details | Details page shown | Heading = "Earning Assignment QA-AP2487-102722" (7 rows) | ✅ | — |
| 2 `[Pre-Condition]` | Add with only AP-CADV ticked, B values, odometer to 248709 → Submit | "Parameter added"; row shows AP-CADV only | Alert = "Parameter added"; row `0 - 248709` Coverage Code = "AP-CADV - Advanced" | ✅ | Parameter id 37 |
| 3 | Pencil; un-tick AP-CADV, tick AFPP and the third code → Submit | "Parameter saved", no error | Edit opened with [AP-CADV - Advanced] ticked; third code label = "AFPPAVN - AFPPAVN"; after changes ticked = [AFPP - AFPP, AFPPAVN - AFPPAVN]; alert = "Parameter saved" | ✅ | — |
| 4 `[Verification]` | Reload; read cell; reopen Edit and read ticks (Escape) | Cell lists AFPP + third code, not AP-CADV; Edit has exactly those two | After reload cell = "AFPP - AFPP" / "AFPPAVN - AFPPAVN"; Edit ticked items = [AFPP - AFPP, AFPPAVN - AFPPAVN] | ✅ | Un-ticked code really removed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_009-step4-EditedCodesSavedExactly_pass.png` — Edit dialog after reload with AFPP and AFPPAVN ticked

### AP2487_010 — A parameter saved before this change still shows its single coverage code ticked when opened for Edit — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/earning-assignment/1/details` | "Earning Assignment AV+" with its parameter list | HTTP 200; heading = "Earning Assignment AV+"; 1 parameter row (id 1) | ✅ | Read-only fixture |
| 2 | Read first row's Coverage Code | A code, not "All" | Coverage Code = "AX - Motopropulseur - AX" | ✅ | Row: All / AX / 1990-09-28 - 2099-09-28 / (blank) / 0 - 9999999 / -1 - 99 / Acura / 0 / AV+ |
| 3 | Pencil; open Coverage Code; read ticks; **Escape without saving** | The step-2 code ticked and no other | Modal = "Edit Parameter"; button text = "AX - Motopropulseur - AX"; ticked items = [AX - Motopropulseur - AX] (value 3); closed with Escape, modal hidden; Submit never pressed | ✅ | Pre-change single code migrated into the multi-select |
| 4 `[Verification]` | Reload `/1/details`; read the row | Row unchanged | No alert; row = "All / AX - Motopropulseur - AX / 1990-09-28 - 2099-09-28 / (blank) / 0 - 9999999 / -1 - 99 / Acura / 0 / AV+" — identical to step 2 | ✅ | Nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_010-step3-SeededCodeTickedInMultiSelect_pass.png` — seeded parameter's Edit dialog with only AX ticked
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_010-step4-SeededRowUnchangedAfterReload_pass.png` — AV+ details page after reload, row unchanged

### AP2487_011 — A parameter with no start dates and no coverage code still saves and shows "All", as before this change — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open #16 details; count rows | Details page shown | Rows = 8 | ✅ | — |
| 2 | Add B values, odometer to 248711, clear Model Year Age to → Submit | "This value should not be blank." at Model Year Age to; no HTTP 500; nothing saved | POST → HTTP 200; standalone page `/16/parameter/add`, heading "Add Parameter"; under "Model Year Age to": "ERROR This value should not be blank."; other values kept | ✅ | Same behaviour as after AP-2476 |
| 3 | Type 5 in Model Year Age to; start dates empty, no code → Submit | Accepted; "Parameter added" | Coverage codes ticked = 0; alert = "Parameter added"; back on `/16/details` | ✅ | Parameter id 38 |
| 4 `[Verification]` | Read row `0 - 248711`; count rows | Exactly one 248711 row; Condition/Coverage Code/Sale Date/Make/Earning Group = "All"; Start date no date (record for Q-003) | Rows = 9; rows matching 248711 = 1; Condition "All", Coverage Code "All", Sale Date "All", Start date "" (**blank**), Make "All", Earning Group "All" | ✅ | Q-003 confirmed again: blank |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_011-step2-BlankModelYearAgeRefused_pass.png` — standalone Add Parameter page with "This value should not be blank." under Model Year Age to
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_011-step4-EmptyOptionalRowShowsAll_pass.png` — full details page of #16 with 9 rows and the 248711 row showing "All"

### AP2487_012 — Ticking every coverage code with "Select All" saves the parameter and lists it without an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | #16 holds 9 rows → create second assignment; open its details | Details page shown | Created `QA-AP2487-103520` → URL `/admin/earning-assignment/17/details`, alert "Earning assignment saved", grid "No entities found" | ✅ | Second fixture to stay within the 10-row limit (AP-2484) |
| 2 | Open Coverage Code → Select All; count ticked; B values, odometer to 248712 → Submit | Every code ticked; button shows a count or "All selected"; "Parameter added"; no 500 | `option:checked` = 57 of 57; button text = comma-separated list of every label, cut off with "..." (no count, no "All selected"); POST → HTTP 302; alert = "Parameter added" | ✅ | Parameter id 39 |
| 3 `[Verification]` | Reload; read cell; open pencil and count ticks (Escape) | Page loads; cell shows every code or a summary (record for Q-005); Edit ticks = step-2 count | Reload HTTP 200; Coverage Code cell lists all 57 codes, one per line (row ~1,557 px tall), in a different order from the dropdown (starts "AP - Garantie de base AP"); Edit `option:checked` = 57 | ✅ | Q-005: shown as every code, not summarised as "All" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_012-step3-EditAll57CodesTicked_pass.png` — Edit dialog of parameter 39 with every code ticked
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_012-step3-GridListsEveryCode_pass.png` — details grid of #17 with the very tall Coverage Code cell listing every code

---

## Open-question observations

| Question | Observed | Case |
|---|---|---|
| **Q-002** — reversed Start date range | Saved silently, stored and shown exactly as entered (`2026-12-31 - 2026-01-01`). No validation, no swap, no error page | AP2487_006 |
| **Q-003** — empty Start date in the grid | Shown **blank**, unlike every other empty optional field, which shows "All". A half range shows only the filled side: `2026-04-01 -` and `- 2026-04-30` (Sale Date shows `… - All`) | AP2487_004, 005, 011 |
| **Q-004** — several codes in the grid | Each code on its own line with its full "CODE - Name" label | AP2487_008, 009 |
| **Q-005** — every code ticked | Stored as 57 separate codes; the grid lists all 57 (a very tall row), not "All"; the closed dropdown button shows a comma list cut off with "..." | AP2487_012 |

---

## Environment Observations

- Staging was responsive throughout; no HTTP 5xx and no timeouts. The only browser console error was `ReferenceError: $ is not defined` on the login page, which exists on every run and did not affect anything.
- **Two rows were created by test-script mistakes and deleted, not product defects.** (1) Row 31: the Add Parameter dialog was opened while the previous Edit dialog's content was still in the page; the script filled the old form, the fresh Add form then replaced it, and the Submit sent the default values (`0 - 999999`, `-1 - 99`). (2) Row 35: the script closed the Coverage Code list by clicking at a fixed point in the dialog header, which the open list covered — it hit **Deselect All**, so the row saved with no codes. Both were removed with the trash-can action ("Parameter unassigned") and the steps were redone with a stricter wait (form `action` must match the expected route) and by closing the list with its own toggle button. Parameter ids therefore skip 31 and 35.
- The gijgo date picker stays open after a date is typed into a Start date box and covers the Submit button until the user clicks elsewhere in the dialog — same widget behaviour as Sale Date.
- Seeded parameter 1's Condition now shows "All"; the knowledge file recorded "New" on 2026-10-04. Nothing in this run touched it — it was found that way.
- Leaves behind: assignments #16 (9 parameters) and #17 (1 parameter). #16 is one row from the AP-2484 limit — do not add more than one row to it.

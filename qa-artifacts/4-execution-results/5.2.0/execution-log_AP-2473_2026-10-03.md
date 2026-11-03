# Execution Log — AP-2473 Earning Sets

> Written by the **stlc-manual-executor** skill (stage s4 of the STLC ticket pipeline).
> Inputs: `qa-artifacts/3-test-cases/AP2473_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2473_TestCases_006-010.md`.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-03
**Ticket:** AP-2473 — Earning Sets · **Run folder:** 5.2.0
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging)
**Account:** shared admin account from `execute.env.md` (Admin Portal row)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 18:56 → 19:04 local time (11:56 → 12:04 UTC)

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 10 (9 on 2026-10-03 + AP2473_006 re-judged 2026-10-04) |
| Failed | 0 (was 1 — see the re-judgment note below) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (10 of 10)** — was 90% before AP2473_006 was re-judged |

**Pre-run checks**
- Health check: `/admin/login` opened with HTTP 200 and showed the French login form ("Connexion", "Courriel", "Mot de passe", "Se connecter"). Screenshot: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473-step0-HealthCheckLoginPage_pass.png`.
- Login with the shared admin account succeeded on the first try and landed on `/admin` ("Vinh Le 1 Welcome to the admin").
- The `env-check` source is `missing` in the knowledge registry, so no formal smoke test was run beyond the health check above.
- Execution order: AP2473_001 and _002 ran first because they establish the page that the High-priority cases (_003, _004, _005) start from; the remaining cases followed in priority order.
- The Execution Context in both test-case files matched what was found (route `/admin/earning-set`, admin portal, 1280 × 800). No stale facts.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2473_001 | Admin menu shows "Earning Sets" under Risk Management and opens the page | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_001-step4-EarningSetsMenuAndHeading_pass.png` | Label is "Earning Sets" (capital S), second of four items under Risk Management |
| AP2473_002 | Page title, "Create New" item, Description / Actions → Edit grid | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_002-step4-RowsWithEditThreeSets_pass.png` | Grid lists earning sets (Reinsurance, Statutory, Profit), not assignments — answers Q-001 |
| AP2473_003 | Create an earning set; it stays listed after a reload | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_003-step5-NewSetListedAfterReload_pass.png` | Created `QA-AP2473-185830` (ID 4); form is a dialog; message "Earning set saved" |
| AP2473_004 | Edit opens pre-filled; the changed description replaces the old one | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_004-step4-EditedDescriptionReplacesOld_pass.png` | ID 5 renamed in place to `QA-AP2473-E-185855-edited`; no second row |
| AP2473_005 | Blank description is refused; no empty row added | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_005-step4-RowCountUnchangedFive_pass.png` | "This value should not be blank." for empty and for three spaces |
| AP2473_006 | Duplicate description is allowed and both are listed | Medium | ✅ (re-judged 2026-10-04; ❌ on 2026-10-03) | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_006-step3-TwoDuplicateRowsAfterReload_fail.png` | Duplicate saved as a separate record (IDs 6 and 7). Matches the revised expected result — duplicates allowed (QA decision) |
| AP2473_007 | 1-char and 255-char descriptions save and display in full | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_007-step4-ShortAndLongSetsListed_pass.png` | Both stored in full; long row pushes the Actions column off-screen (observation) |
| AP2473_008 | Accents and HTML characters saved and shown exactly as typed | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_008-step4-EditFormSameString_pass.png` | Accents intact; `<b>` escaped and shown as text in grid and edit form |
| AP2473_009 | Leaving Create New without saving adds no earning set | Low | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_009-step4-NoUnsavedRowListed_pass.png` | Dialog has no Cancel / close button; browser Back used; no warning, no row |
| AP2473_010 | Other Risk Management pages still open | Low | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_010-step3-EarningAssignmentsLoads_pass.png` | Earning Curves, Earning Groups, Earning Assignments all load with their own headings |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2473_001 — Admin menu shows "Earning Sets" under Risk Management, and clicking it opens the Earning Sets page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/login`, enter the admin email and password, click "Se connecter" | Admin dashboard at `/admin` shows "Welcome to the admin" | URL = `/admin`; page heading = "Vinh Le 1 Welcome to the admin" | ✅ | Logged in first time, no errors |
| 2 | Find "Risk Management" in the sidebar and expand it | Section shows its items including "Earning Sets" | Clicking the "Risk Management" icon opened a fly-out listing, in order: "Earning Curves", "Earning Sets", "Earning Groups", "Earning Assignments" | ✅ | The sub-menu is a fly-out panel that opens on click |
| 3 | Click "Earning Sets" | Browser goes to `/admin/earning-set` without an error | URL = `/admin/earning-set`; page loaded normally, no error page | ✅ | Link href is `/admin/earning-set` |
| 4 `[Verification]` | Verify the item sits under Risk Management and the page heading reads "Earning Sets" | Item under Risk Management; heading "Earning Sets"; casing recorded | Sidebar item text = "Earning Sets" inside the "Risk Management" group and marked active; page `h1` = "Earning Sets" | ✅ | Exact label casing is "Earning Sets" (capital S) — Q-006 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_001-step4-EarningSetsMenuAndHeading_pass.png` — the Risk Management fly-out open on the Earning Sets page, showing the four items with Earning Sets highlighted

### AP2473_002 — Earning Sets page shows its title, a "Create New" item and a grid with Description and Actions → Edit — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/earning-set` | The Earning Sets page loads | URL = `/admin/earning-set`; HTTP 200 | ✅ | Same session as AP2473_001 |
| 2 `[Verification]` | Verify the title reads "Earning Sets" and the only nav item is "Create New" | Title "Earning Sets" and one "Create New" item | Heading = "Earning Sets"; nav list holds exactly one item, a red button "Create New" (href `/admin/earning-set/new/edit`) | ✅ | No extra nav items |
| 3 `[Verification]` | Verify the grid columns are "Description" and "Actions" and record any others | Description and Actions columns | Column headers = ["Description", "Actions"]; no other columns | ✅ | Matches the ticket exactly |
| 4 `[Verification]` | Verify each row offers "Edit" and the rows are earning sets; record the row count | Every row has "Edit"; rows are earning sets | 3 rows: "Reinsurance", "Statutory", "Profit"; each row's Actions cell = "Edit" linking to `/admin/earning-set/{3,2,1}/edit` | ✅ | Q-001 answered: these are earning sets. The separate Earning Assignments page has its own grid (Description, Earning Set, Dealer Group, Is Enabled?, Actions) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_002-step2-TitleAndCreateNew_pass.png` — Earning Sets heading with the red "Create New" button
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_002-step3-GridColumnsDescriptionActions_pass.png` — the grid on its own, Description and Actions headers
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_002-step4-RowsWithEditThreeSets_pass.png` — the three seeded earning sets, each with an Edit button

### AP2473_003 — Creating an earning set with a new description saves it, and it stays in the list after a reload — Step Results

Description used: `QA-AP2473-185830`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/earning-set` | The list loads | URL = `/admin/earning-set`; 3 rows listed | ✅ | — |
| 2 | Click "Create New" | Form opens with an empty Description; page vs dialog and every field recorded | A modal dialog opened over the list (browser URL stayed `/admin/earning-set`); dialog heading = "Create earning set"; fields: one textarea "Description*" (name `earning_set[description]`, marked required, empty), plus hidden `redirect_url` and CSRF token; one button "Save". No Cancel or close button | ✅ | Q-008: it is a dialog. Q-002: Description is the only visible field. Q-003: button is "Save" |
| 3 | Type the description and click "Save" | Saves without error; success message or return to list | Dialog closed; list reloaded; green alert = "Earning set saved"; new row "QA-AP2473-185830" at the top of the grid | ✅ | New record ID 4 |
| 4 | Open `/admin/earning-set` again (reload) | The list loads from the server | URL = `/admin/earning-set`; fresh page load, 4 rows | ✅ | — |
| 5 `[Verification]` | Verify a row "QA-AP2473-185830" appears exactly once with "Edit" | Listed once with the exact description and Edit | Row count with Description "QA-AP2473-185830" = 1; its Actions cell = "Edit" → `/admin/earning-set/4/edit` | ✅ | Newest records are listed first |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_003-step2-CreateEarningSetDialog_pass.png` — the "Create earning set" dialog with the empty Description box and Save button
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_003-step3-EarningSetSavedMessage_pass.png` — "Earning set saved" message above the grid with the new row
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_003-step5-NewSetListedAfterReload_pass.png` — after a reload, the new set is listed once with Edit
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_003-obs-DoubleClickSaveOneRow_pass.png` — observation only: double-clicking Save created a single record (see Environment Observations)

### AP2473_004 — Editing an earning set opens it pre-filled, and a changed description replaces the old one in the list — Step Results

Original description `QA-AP2473-E-185855`, new description `QA-AP2473-E-185855-edited`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, Create New, type `QA-AP2473-E-185855`, Save | Set saved and listed | Alert = "Earning set saved"; row "QA-AP2473-E-185855" listed with Edit → `/admin/earning-set/5/edit` | ✅ | Record ID 5 |
| 2 | Click "Edit" on that row | Edit form opens with Description pre-filled; URL recorded | The same modal dialog opened, heading = "Earning set #5"; Description = "QA-AP2473-E-185855"; browser URL stayed `/admin/earning-set` — the dialog loads `/admin/earning-set/5/edit?redirectUrl=…/admin/earning-set` | ✅ | Edit URL pattern: `/admin/earning-set/{id}/edit` |
| 3 | Replace with `QA-AP2473-E-185855-edited` and click "Save" | Saves without error | Dialog closed; alert = "Earning set saved" | ✅ | — |
| 4 `[Verification]` | Reload `/admin/earning-set`; the edited text appears once and the original is gone | Edited appears once; original gone | Row "QA-AP2473-E-185855-edited" count = 1 (ID 5); rows with exactly "QA-AP2473-E-185855" = 0; total rows = 5 | ✅ | The edit changed the record in place; no new row |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_004-step2-EditDialogPrefilled_pass.png` — "Earning set #5" dialog with the description pre-filled
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_004-step4-EditedDescriptionReplacesOld_pass.png` — after a reload, the edited description is listed once and the original is gone

### AP2473_005 — Saving an earning set with a blank description is refused and no empty row is added to the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/admin/earning-set`, record the row count | List loads; count recorded | Row count = 5 | ✅ | — |
| 2 | Create New, leave Description empty, click "Save" | Refused with a "required" message; form stays open | Save refused by the server. The dialog was replaced by the full page `/admin/earning-set/new/edit` (heading "Create earning set") with a red error under Description: "Error — This value should not be blank." | ✅ | The browser's own "required" check did not fire inside the dialog; the server caught it. The form stays visible, but as a standalone page rather than the dialog |
| 3 | Type three spaces and click "Save" | Refused the same way | Page reloaded at `/admin/earning-set/new/edit` with the same error "This value should not be blank."; nothing saved | ✅ | Whitespace is trimmed and treated as blank |
| 4 `[Verification]` | Open `/admin/earning-set` again and compare with the step 1 count | Count unchanged; no blank row | Row count = 5 (unchanged); no row has an empty or blank description | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_005-step2-BlankRefusedNotBlankError_pass.png` — "This value should not be blank." under Description on the standalone create page
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_005-step3-WhitespaceRefused_pass.png` — same error after submitting three spaces
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_005-step4-RowCountUnchangedFive_pass.png` — the list back at 5 rows with no blank entry

### AP2473_006 — Creating a second earning set with the same description as an existing one is refused or clearly reported — Step Results

> **Re-judged 2026-10-04 → PASS.** The QA ruled at Gate C that duplicate descriptions are not a bug, so the test case's expected result was revised to "duplicates allowed, both listed with different IDs". The table below is the original 2026-10-03 record against the old expectation, kept unchanged. Measured against the revised steps, all three steps pass: step 2 saved with "Earning set saved" and step 3 found exactly two rows with IDs 6 and 7. The screenshot filenames keep their original `_fail` suffix.

Description used twice: `QA-AP2473-D-190013`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create New with `QA-AP2473-D-190013`, Save | Saved and listed once | Alert = "Earning set saved"; row listed once (ID 6) | ✅ | — |
| 2 | Create New again with exactly `QA-AP2473-D-190013`, Save | Refused with an "already exists" message | No error. Alert = "Earning set saved"; a second row "QA-AP2473-D-190013" appeared (ID 7) | ❌ | No uniqueness rule in the ticket — Q-004. The app accepts duplicates silently |
| 3 `[Verification]` | Reload and count rows with that description | Exactly one row | Row count with Description "QA-AP2473-D-190013" = 2 (Edit links to IDs 7 and 6) | ❌ | The two duplicates also show as two identical options in the Earning Assignment form's "Earning Set" dropdown (values 6 and 7), so an admin cannot tell which one they are picking |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_006-step2-DuplicateSavedNoError_fail.png` — "Earning set saved" shown after the duplicate save, with two identical rows at the top
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_006-step3-TwoDuplicateRowsAfterReload_fail.png` — after a reload, two rows with the same description

### AP2473_007 — A 1-character and a 255-character description both save and display in full in the list — Step Results

Short value `Q` (no set named `Q` existed). Long value `'QA-AP2473-L-190043-'.padEnd(255,'X')`, length 255.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/earning-set` | List loads | URL = `/admin/earning-set`; list loaded | ✅ | — |
| 2 | Create New, type `Q`, Save | Saves without error | Alert = "Earning set saved"; row "Q" listed (ID 8) | ✅ | — |
| 3 | Create New, enter the 255-char value, record the field length, Save | Field holds 255; saves without error | Field length = 255 (textarea has no `maxlength`); alert = "Earning set saved"; record ID 9 | ✅ | The value was set with a browser script, as the TC directs |
| 4 `[Verification]` | Reload, find both rows, read the long value in full (grid and Edit) | Both listed; long value is the full 255 chars | Row "Q" count = 1. Long row grid text length = 255 and identical to the typed value; the Edit form's Description length = 255 and identical | ✅ | The grid does not truncate. The unbroken 255-char text makes the Description cell about 1,970 px wide, so the Actions column (every row's Edit button) is pushed out of view behind a horizontal scrollbar |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_007-step4-ShortAndLongSetsListed_pass.png` — "Q" and the long row listed; the Actions column is scrolled out of view and a horizontal scrollbar appears under the grid
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_007-obs-256CharsAccepted_pass.png` — observation only: a 256-character description was also accepted and stored in full

### AP2473_008 — A description with French accents and HTML characters is saved and shown exactly as typed, not run as code — Step Results

Description used: `QA-AP2473-S-190147 Échéance à 100% "test" & <b>bold</b>`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/earning-set` | List loads | List loaded | ✅ | — |
| 2 | Create New, type the description, Save | Saves without error | Dialog closed; save succeeded; record ID 11 | ✅ | — |
| 3 | Reload and find the new row | Row listed | One row starting "QA-AP2473-S-190147" found after reload | ✅ | — |
| 4 `[Verification]` | Verify the grid shows the exact string with `<b>bold</b>` as literal text, then open Edit and verify the same string | Grid and Edit form show the exact string; no bold, no garbling, no double escaping | Grid cell text = `QA-AP2473-S-190147 Échéance à 100% "test" & <b>bold</b>` (identical to the typed value); cell HTML escapes the tags (`&lt;b&gt;`), and no `<b>` element exists, so nothing is bold. Edit dialog "Earning set #11" Description = the same exact string | ✅ | Accents survive; HTML is shown as text (no XSS rendering) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_008-step4-GridShowsLiteralAccentsHtml_pass.png` — grid row showing the accents and the literal `<b>bold</b>` text
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_008-step4-EditFormSameString_pass.png` — "Earning set #11" dialog with the same exact string

### AP2473_009 — Leaving the Create New form without saving adds no earning set to the list — Step Results

Description typed but not saved: `QA-AP2473-C-190216`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/earning-set` | List loads | List loaded | ✅ | — |
| 2 | Create New and type the description without saving | Form shows the typed text | Dialog Description = "QA-AP2473-C-190216" | ✅ | — |
| 3 | Use Cancel/Back if present, else the browser's Back button | Return to the list; record any warning | The dialog has no Cancel, Back or close (×) button — its only control is "Save". Browser Back used: the dialog closed and the list showed (URL `/admin/earning-set`, heading "Earning Sets"); no "unsaved changes" warning appeared | ✅ | Browser Back was used. Missing Cancel is an observation, not a requirement in the ticket |
| 4 `[Verification]` | Reload and search the grid for the description | No row with that description | Matches for "QA-AP2473-C-190216" = 0 on page 1 (10 rows) and on page 2 (1 row, "Profit"); total = 11 records | ✅ | The list paginates at 10 rows per page, newest first |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_009-step4-NoUnsavedRowListed_pass.png` — full-page list after a reload with no "QA-AP2473-C-190216" row and pagination 1–2 at the bottom

### AP2473_010 — The other Risk Management pages still open after the Earning Sets change — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and expand "Risk Management" | Lists Earning Curves, Earning Sets, Earning Groups, Earning Assignments (order recorded) | Order = "Earning Curves", "Earning Sets", "Earning Groups", "Earning Assignments" | ✅ | — |
| 2 | Click Earning Curves, then Earning Groups, then Earning Assignments | Each loads with its own heading and no error | `/admin/earning-curve` heading "Earning Curves" (6 rows); `/admin/earning-group` heading "Earning Groups" (1 row "AV+"); `/admin/earning-assignment` heading "Earning Assignments" (1 row "AV+ Profit Group A Yes") | ✅ | No error page or HTTP 500 |
| 3 `[Verification]` | Verify each page showed its title with no error and the sidebar still lists "Earning Sets" | All three load; Earning Sets stays in the menu | On each of the three pages the Risk Management group still lists all four items including "Earning Sets" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_010-step3-EarningCurvesLoads_pass.png` — Earning Curves list loaded
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_010-step3-EarningGroupsLoads_pass.png` — Earning Groups list loaded
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_010-step3-EarningAssignmentsLoads_pass.png` — Earning Assignments list loaded

---

## Re-judged — AP2473_006 (originally a failure; PASS from 2026-10-04)

> The detail below is the original 2026-10-03 failure record. On 2026-10-04 the expected result was changed to "duplicates allowed", per the QA's Gate C decision, and the case was re-judged PASS from this same evidence without re-execution. The run now has no failures.

- **Expected:** saving a second earning set with exactly the same description as an existing one (`QA-AP2473-D-190013`) is refused with a message saying the description already exists, and the list keeps exactly one row with that description.
- **Actual:** the second save went through with no error. The usual green "Earning set saved" message appeared and the list showed two rows reading "QA-AP2473-D-190013" (IDs 6 and 7), still two after a reload.
- **Note:** no uniqueness rule in the ticket — Q-004. Recorded as FAIL per the test case so Gate C can decide whether it is a defect or a question.
- **Consequence for a user:** Description is the only column in the grid, and the Earning Assignment form's "Earning Set" dropdown lists both duplicates as two identical options. An admin assigning an earning set to a dealer group cannot tell the two apart and can pick the wrong one.

---

## Blocked / Skipped Test Cases

None. No test case was blocked or skipped.

---

## Created Records (left on staging)

No delete action exists and the `cleanup` source is `missing`, so these stay on v2staging.

| ID | Description | Created by |
|:---:|---|---|
| 4 | `QA-AP2473-185830` | AP2473_003 |
| 5 | `QA-AP2473-E-185855-edited` (created as `QA-AP2473-E-185855`) | AP2473_004 |
| 6 | `QA-AP2473-D-190013` | AP2473_006 |
| 7 | `QA-AP2473-D-190013` (duplicate) | AP2473_006 |
| 8 | `Q` | AP2473_007 |
| 9 | `QA-AP2473-L-190043-` + X to 255 chars | AP2473_007 |
| 10 | `QA-AP2473-L256-190043-` + X to 256 chars | AP2473_007 optional observation |
| 11 | `QA-AP2473-S-190147 Échéance à 100% "test" & <b>bold</b>` | AP2473_008 |
| 12 | `QA-AP2473-DBL-190252` | AP2473_003 optional double-click observation |

Seeded records not touched: 1 "Profit", 2 "Statutory", 3 "Reinsurance". The list now holds 12 records over two pages.

---

## Environment Observations

- **Form is a dialog, not a page.** "Create New" and "Edit" open a Bootstrap modal (`#myModal`) over the list. The browser URL stays `/admin/earning-set`; the dialog loads `/admin/earning-set/new/edit` or `/admin/earning-set/{id}/edit?redirectUrl=…`. Its only fields are "Description*" (a required textarea) and a "Save" button. There is **no Cancel, Back or close (×) button**; the only way out without saving is the browser Back button (or, presumably, clicking outside or pressing Escape, which was not tested).
- **Validation error leaves the dialog.** When a blank save is refused, the user lands on the standalone page `/admin/earning-set/new/edit` showing "This value should not be blank." rather than seeing the error inside the dialog. It works, but the layout jumps.
- **Success message:** "Earning set saved" (green alert above the grid, with a × to close it).
- **Grid:** columns Description and Actions; newest first; 10 rows per page with pagination (1, 2, Next, Last). Rows are earning sets (Q-001 answered).
- **Long descriptions break the grid layout.** A 255-character description with no spaces widens the Description column to about 1,970 px, so the Actions column, and the Edit button on every row, is pushed off-screen behind a horizontal scrollbar. A realistic description with spaces would wrap, so this matters mainly for unbroken text.
- **No length limit found (optional probe).** A 256-character description was accepted and stored in full (ID 10), so the field has no 255 limit; it is probably a TEXT column. No limit is stated in the ticket.
- **Double-click on Save (optional probe).** Double-clicking "Save" created exactly one record (ID 12). No duplicate submission.
- **Follow-the-data.** The Earning Assignment create form (`/admin/earning-assignment/new/edit`) lists every earning set in its "Earning Set" dropdown, sorted alphabetically, including all the QA records from this run.
- **Console.** The only JavaScript error was `ReferenceError: $ is not defined` on `/admin/login`, which existed before this feature and did not affect the run. The Earning Sets pages logged no errors.
- **Tooling.** `.mcp.json` sets the Playwright `--output-dir` to `qa-artifacts/4-execution-results/screenshots`, so server logs (`console-*.log`, `page-*.yml`) land in the screenshot root, not in `playwright-log/` as the adapter says. Evidence for this run is in the `5.2.0/AP-2473/` subfolder only.

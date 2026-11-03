# Execution Log — AP-2472 Earning Groups Management

> Written by the **stlc-manual-executor** skill (stage s4 of the STLC ticket pipeline).
> Inputs: `qa-artifacts/3-test-cases/AP2472_TestCases_001-005.md`, `AP2472_TestCases_006-010.md`,
> `AP2472_TestCases_011-015.md`, `AP2472_TestCases_016-016.md`.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-03
**Ticket:** AP-2472 — Earning Groups Management · **Run folder:** 5.2.0
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging)
**Account:** shared admin account from `execute.env.md` (`vinhle870@gmail.com`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 23:37 → 23:51 local time (16:37 → 16:51 UTC)

| Metric | Value |
|---|:---:|
| Total test cases | 16 |
| Passed | 15 |
| Failed | 1 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **94% (15 of 16)** |

**Pre-run checks**
- Health check (run by the pipeline before this stage): `/admin/login` loaded. Screenshot: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/healthcheck-admin-login-pass.png`.
- Login with the shared admin account succeeded on the first try and landed on `/admin` ("Vinh Le 1 Welcome to the admin").
- The `env-check` source is `missing` in the knowledge registry, so no formal smoke test ran beyond the health check.
- **Stale fact in the Execution Context.** All four test-case files say the Earning Groups route is "not known" and the feature is "not yet in qa-docs". In fact `qa-docs/risk-management.md` (written earlier the same day by the AP-2473 run) already listed `/admin/earning-group` and its columns. The route was confirmed by clicking the sidebar, as the cases ask.
- **Earning Groups route (recorded per AP2472_001 step 3):** list `/admin/earning-group`; create `/admin/earning-group/new/edit` (modal); details `/admin/earning-group/{id}/details`; edit `/admin/earning-group/{id}/edit` (modal); unassign `/admin/earning-group/{id}/curve/{curveId}/unassign` (confirmation modal, POST).
- Execution order: AP2472_001–002 first (they establish the page), then the rest in file order. High-priority cases were not reordered because each later case creates its own data.

**Curve X.** No `QA-AP2471-…` or `QA-AP2472-…` curve existed (the list held only the six seeded curves "1 year" … "6 years", all Rule of 78). Per the Execution Context, `QA-AP2472-Curve-A` was created at `/admin/earning-curve/new/edit`: Term month 12, odometer 0–50000, Pro-Rata, Is Enabled? checked. The 12 earning points auto-filled (0.0833 monthly) and were read-only. Saved as **curve id 7**; the list showed `QA-AP2472-Curve-A | 12 | 0 - 50000 | Pro-Rata | Yes`. Screenshot: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/setup-CurveX-QA-AP2472-Curve-A-created_pass.png`.

**Run suffix.** Every group created this run uses the suffix `-2339` (local time 23:39 when creation started).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2472_001 | Admin menu shows "Earning Groups" under Risk Management and opens the page | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_001-step4-EarningGroupsPageHeading_pass.png` | Third of four Risk Management items; route `/admin/earning-group` |
| AP2472_002 | Page shows title, "Create New" and the five required columns | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_002-step5-DetailsTitleAVPlus_pass.png` | Columns exact and in order; View on "AV+" opened "Earning Group AV+" |
| AP2472_003 | "Create New" opens a modal with Name and Default Earning Method (Pro-Rata) | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_003-step3-CreateModalFieldsDefaultProRata_pass.png` | Modal has only "Save" — no Cancel or ×; closed with Escape |
| AP2472_004 | Creating a Rule of 78 group opens its details page and adds it to the list | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_004-step5-ListRowRO78_pass.png` | Group id 2; empty curves cell shows "None"; Is Enabled? = Yes |
| AP2472_005 | Blank name is refused and no group is created | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_005-step4-NoBlankGroupAdded_pass.png` | "This value should not be blank."; error shows on a standalone page, not the modal |
| AP2472_006 | Duplicate name is refused, or the duplicate is recorded | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_006-step3-DuplicateNameAccepted_pass.png` | Observation for Q-001: duplicate accepted silently (ids 3 and 4) |
| AP2472_007 | 255-char name and special-character name stored and shown as typed | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_007-step4-SpecialNameDetailsLiteral_pass.png` | Both saved in full; `<b>` escaped; long name pushes View off-screen |
| AP2472_008 | Cancelling the modal after typing creates no group | Low | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_008-step4-NoCancelGroupCreated_pass.png` | No cancel/× control exists; Escape used |
| AP2472_009 | Assigning a curve adds it to the grid with name, term, odometer and type | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_009-step4-CurveXRowInGrid_pass.png` | Row matches Curve X exactly; alert "Earning curve assigned" |
| AP2472_010 | List shows each group's curves with odometer ranges | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_010-step3-ListEarningCurvesCell_pass.png` | Format "QA-AP2472-Curve-A (0 - 50000)"; empty group shows "None" |
| AP2472_011 | Same curve can be in two groups at once | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_011-step4-G1StillHasCurveX_pass.png` | Curve X stayed in G1 after assigning to G2 |
| AP2472_012 | Assigning an already-assigned curve does not duplicate the row | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_012-step4-CurveXOnceInGrid_pass.png` | Curve X removed from the select once assigned; step 3 not needed |
| AP2472_013 | Assign with no curve selected adds nothing and causes no error | Low | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step2-AssignNothingSelectedHttp500_fail.png` | HTTP 500 error page when Assign is clicked with "Nothing selected" |
| AP2472_014 | Trash can asks for confirmation, and "No" keeps the curve | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_014-step2-UnassignConfirmModal_pass.png` | Text reads "…sure you want to delete…" (adds "you want"); buttons Continue / No |
| AP2472_015 | Unassigning from one group leaves the curve in the other group and the curves list | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_015-step4-CurveXStillInCurvesList_pass.png` | Only the link is removed; Curve X intact; G2 unaffected |
| AP2472_016 | Editing name and default method saves both and keeps curves | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_016-step4-ListEditedRow_pass.png` | Edit modal has Name + method only; no Is Enabled? control |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2472_001 — The admin menu shows "Earning Groups" under Risk Management, and clicking it opens the Earning Groups page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in at `/admin/login` with Courriel / Mot de passe, click "Se connecter" | `/admin` loads with "Welcome to the admin" | URL = `/admin`; page text = "Vinh Le 1 Welcome to the admin" | ✅ | First login attempt succeeded |
| 2 `[Verification]` | Check the sidebar's Risk Management section | It lists "Earning Groups" | Clicking the "Risk Management" heading opened its group; visible links = "Earning Curves", "Earning Sets", "Earning Groups" (`/admin/earning-group`), "Earning Assignments" | ✅ | The section is an icon rail that expands on click |
| 3 | Click "Earning Groups" | A new page opens; its URL is recorded | URL = `https://v2staging.garantieavantageplus.ca/admin/earning-group` | ✅ | Route recorded for the rest of the run |
| 4 `[Verification]` | Check the page heading | Heading reads "Earning Groups" | `h1` = "Earning Groups" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_001-step2-RiskMgmtMenuEarningGroups_pass.png` — Risk Management section expanded with its four items, Earning Groups third
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_001-step4-EarningGroupsPageHeading_pass.png` — the Earning Groups list page with its heading

### AP2472_002 — The Earning Groups page shows its title, a "Create New" item and a list with the five required columns — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open Risk Management → Earning Groups | The page loads | URL = `/admin/earning-group`; one row "AV+" | ✅ | Same session as AP2472_001 |
| 2 `[Verification]` | Check the title and the navigation item | Title "Earning Groups"; "Create New" is the only nav item | `h1` = "Earning Groups"; nav list holds exactly one link "Create New" → `/admin/earning-group/new/edit` | ✅ | "Create New" is a red button-styled link |
| 3 `[Verification]` | Check column headers in order | Name · Earning curves · Default Earning curve type · Is Enabled? · Actions | Headers = "Name", "Earning curves", "Default Earning curve type", "Is Enabled?", "Actions" — no extra column | ✅ | Wording and order match exactly |
| 4 | Click "View" on the first row | Goes to a details page titled "Earning Group …" | URL = `/admin/earning-group/1/details` | ✅ | Seeded row "AV+", Rule of 78, Yes, six curves |
| 5 `[Verification]` | Check the details title names the group | "Earning Group AV+" | `h1` = "Earning Group AV+"; nav item "Edit"; grid lists the six seeded curves | ✅ | AV+ was only viewed, never changed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_002-step2-TitleAndCreateNew_pass.png` — list page title and the "Create New" button
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_002-step3-FiveColumnHeaders_pass.png` — the five column headers above the AV+ row
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_002-step5-DetailsTitleAVPlus_pass.png` — "Earning Group AV+" details page with its six curves

### AP2472_003 — "Create New" opens a modal with a Name box and a Default Earning Method list that starts on Pro-Rata — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Risk Management → Earning Groups | The page loads | URL = `/admin/earning-group`; 1 row (AV+) | ✅ | — |
| 2 | Click "Create New" | A modal opens; URL does not change | Dialog "Create earning group" visible; URL still `/admin/earning-group` | ✅ | Bootstrap modal `.modal.show` |
| 3 `[Verification]` | Read the modal's fields, options and selected value | Empty Name text box; select with exactly Pro-Rata / Rule of 78 / Reverse rule of 78; Pro-Rata selected | Field "Name*" type = text, value = "", `required` = true, no `maxlength`; select "Default Earning Method*" options = ["Pro-Rata", "Rule of 78", "Reverse rule of 78"], selected = "Pro-Rata"; no other field; only button = "Save" | ✅ | No Is Enabled? field; no Cancel or close (×) button |
| 4 | Close the modal without submitting | Modal closes, list unchanged | No close/cancel control exists, so Escape was pressed; `.modal.show` count = 0 | ✅ | Escape is the only way out besides Save or browser Back |
| 5 `[Verification]` | Reload and compare rows | Same rows as before | Rows = ["AV+"] (1 row, same as before step 2) | ✅ | Nothing created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_003-step3-CreateModalFieldsDefaultProRata_pass.png` — Create earning group modal with an empty Name and Pro-Rata selected
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_003-step5-ListUnchangedAfterClose_pass.png` — list still shows only AV+ after closing

### AP2472_004 — Creating a Rule of 78 group opens its "Earning Group {name}" details page and adds it to the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the list and click "Create New" | Modal open | Dialog "Create earning group" open | ✅ | — |
| 2 | Enter `QA-AP2472-RO78-2339`, select "Rule of 78", click "Save" | Modal closes; details page opens; URL recorded | URL = `/admin/earning-group/2/details` | ✅ | Group id 2 |
| 3 `[Verification]` | Check the details title and navigation | "Earning Group QA-AP2472-RO78-2339" with "Edit" | `h1` = "Earning Group QA-AP2472-RO78-2339"; nav = ["Edit"]; green alert "Earning group saved"; grid area alert "No entities found" | ✅ | Success message recorded |
| 4 | Open Risk Management → Earning Groups | List loads | URL = `/admin/earning-group`; new row is first (newest first) | ✅ | — |
| 5 `[Verification]` | Check the new row | "Rule of 78", empty curves cell (recorded), "View"; Is Enabled? recorded | Row = "QA-AP2472-RO78-2339 \| None \| Rule of 78 \| Yes \| View" | ✅ | Empty curves cell shows the word "None". Is Enabled? = Yes by default (Q-002) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_004-step3-DetailsTitleRO78_pass.png` — new group's details page with "Earning group saved"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_004-step5-ListRowRO78_pass.png` — list row with "None", "Rule of 78", "Yes"

### AP2472_005 — Submitting the Create New form with a blank name is refused and no group is created — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the list and count rows | Row count recorded | Row count = 2 (QA-AP2472-RO78-2339, AV+) | ✅ | — |
| 2 | Click "Create New", leave Name empty, click "Save" | Not submitted; required message shown; modal stays open | The browser's own `required` check did not stop the submit. The server refused it and the browser landed on the standalone page `/admin/earning-group/new/edit` (heading "Create earning group") with the error "This value should not be blank." under Name. The modal did not stay open | ✅ | The refusal and the message are as expected; the error renders on a separate page, not in the modal (same as Earning Sets) |
| 3 | Close and reload the list | List loads | URL = `/admin/earning-group` | ✅ | — |
| 4 `[Verification]` | Count rows; look for a blank name | Same count as step 1; no blank name | Row count = 2; names = ["QA-AP2472-RO78-2339", "AV+"]; no empty name | ✅ | No group was created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_005-step2-BlankNameError_pass.png` — standalone Create earning group page with "This value should not be blank."
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_005-step4-NoBlankGroupAdded_pass.png` — list still shows the same two rows

### AP2472_006 — Creating a second group with the same name as an existing one is refused, or the duplicate is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Dup-2339` (Pro-Rata) | Details page opens | URL = `/admin/earning-group/3/details`; `h1` = "Earning Group QA-AP2472-Dup-2339"; alert "Earning group saved" | ✅ | — |
| 2 | Create a second group with the same name | Refused with a message, or a second group created (recorded) | Second group saved with no warning: URL = `/admin/earning-group/4/details`; alert "Earning group saved" | ✅ | Duplicate accepted — observation for Q-001 |
| 3 `[Verification]` | Count rows named `QA-AP2472-Dup-2339` | 1 = refused; 2 = accepted (observation) | 2 rows: ids 4 and 3, both Pro-Rata | ✅ | Per the Judging note this is PASS with an observation, not a FAIL |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_006-step3-DuplicateNameAccepted_pass.png` — two identical "QA-AP2472-Dup-2339" rows in the list

### AP2472_007 — A 255-character name and a name with accents, "&" and HTML tags are stored and shown exactly as typed — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the list | Page loads | URL = `/admin/earning-group` | ✅ | — |
| 2 | Create `QA-AP2472-Long-` + 240 × "x" (255 chars) | Created, or a length message; a server error is a FAIL | HTTP 200; URL = `/admin/earning-group/5/details`; `h1` length = 269 (= "Earning Group " + 255 characters, full name) | ✅ | No length limit at 255 |
| 3 | Create `QA-AP2472 É & <b>x</b>` | Created; details page opens | URL = `/admin/earning-group/6/details` | ✅ | — |
| 4 `[Verification]` | Check the details title and list rows | Special name shown literally, `<b>` visible as text; long name full or visibly truncated | Details `h1` text = "Earning Group QA-AP2472 É & <b>x</b>", HTML = `QA-AP2472 É &amp; &lt;b&gt;x&lt;/b&gt;`, bold elements = 0. List cell text identical, bold elements = 0. Long name cell = 255 characters, not truncated | ✅ | Output is escaped. The long name widens the table to 1877 px in a 1115 px container, so its View button sits at x ≈ 1977 px, off-screen behind a horizontal scroll |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_007-step4-SpecialNameDetailsLiteral_pass.png` — details title with literal `<b>` tags
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_007-step4-ListLongAndSpecialNames_pass.png` — list with the special and the 255-character names

### AP2472_008 — Cancelling the Create New modal after typing a name creates no group — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the list | Page loads | URL = `/admin/earning-group`; 6 rows | ✅ | — |
| 2 | Click "Create New", type `QA-AP2472-Cancel-2339`, pick "Reverse rule of 78" | Modal shows name and method | Name value = "QA-AP2472-Cancel-2339"; method selected = "Reverse rule of 78" | ✅ | — |
| 3 | Close with cancel / × or Escape (record which) | Modal closes without submitting | No cancel or × control in the modal (only "Save"). Escape pressed; `.modal.show` count = 0; URL unchanged | ✅ | Control used: Escape key |
| 4 `[Verification]` | Reload and search for the name | No such row | Row count = 6 (unchanged); rows containing "Cancel" = 0 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_008-step4-NoCancelGroupCreated_pass.png` — list after reload with no "Cancel" group

### AP2472_009 — Assigning an earning curve adds it to the group's grid with the curve's name, term, odometer range and type — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record Curve X's values from Earning Curves | Five values recorded | Curve X = `QA-AP2472-Curve-A` (id 7): Term month 12; Coverage odometer "0 - 50000"; type Pro-Rata; Is Enabled? Yes | ✅ | Curve created this run (see Execution Summary) |
| 2 `[Pre-Condition]` | Create `QA-AP2472-Assign-2339` (Pro-Rata) | Details page with assign form and empty grid | URL = `/admin/earning-group/7/details`; `h1` = "Earning Group QA-AP2472-Assign-2339"; form: select "Earning Curve*" (7 options, first "1 year (0 - 999999)" pre-selected) + button "Assign"; grid area = "No entities found" | ✅ | The select has no empty placeholder option |
| 3 | Choose Curve X and click "Assign" | Curve X appears in the grid | Picked "QA-AP2472-Curve-A (0 - 50000)" in the dropdown; page reloaded with alert "Earning curve assigned"; grid has 1 row | ✅ | Curve X then disappeared from the select options |
| 4 `[Verification]` | Check grid headers and the row | Headers Name / Term month / Coverage odometer / Earning curve type / Is Enabled? / Actions; row matches step 1; trash icon | Headers exact and in order; row = "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes"; Actions = trash-can link `/admin/earning-group/7/curve/7/unassign` | ✅ | All five values match step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/setup-CurveX-QA-AP2472-Curve-A-created_pass.png` — Earning Curves list with the new Curve X (precondition evidence)
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_009-step4-CurveXRowInGrid_pass.png` — group grid with the Curve X row and trash icon

### AP2472_010 — The Earning Groups list shows each group's assigned curves with their odometer ranges — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use `QA-AP2472-Assign-2339` if it holds Curve X | A group with Curve X exists | Group id 7 holds Curve X (from AP2472_009) | ✅ | Reused as the case allows |
| 2 | Open Risk Management → Earning Groups | List loads | URL = `/admin/earning-group` | ✅ | — |
| 3 `[Verification]` | Check the "Earning curves" cell | Curve X's name with its odometer range; empty group's display recorded | Assign row cell = "QA-AP2472-Curve-A (0 - 50000)"; RO78 (empty) row cell = "None" | ✅ | Format: `{name} ({from} - {to})`, one list item per curve |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_010-step3-ListEarningCurvesCell_pass.png` — list with the curve name and range in the Earning curves column

### AP2472_011 — The same earning curve can be assigned to two different groups at the same time — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Multi-G1-2339` (Pro-Rata) and assign Curve X | G1 grid lists Curve X | Group id 8; grid = "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes"; alert "Earning curve assigned" | ✅ | — |
| 2 | Create `QA-AP2472-Multi-G2-2339` (Rule of 78) | G2 details page, empty grid | Group id 9; grid area = "No entities found" | ✅ | — |
| 3 | Assign Curve X to G2 | Curve X in G2's grid; select state recorded | Curve X was offered in G2's select before assigning; after assigning, G2 grid lists Curve X and Curve X is no longer offered in G2's select | ✅ | The select hides only curves already in *this* group |
| 4 `[Verification]` | Open G1 via "View"; check both list cells | Curve X still in G1; both list cells show Curve X | G1 (`/admin/earning-group/8/details`) grid still = "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes"; list cells for G1 and G2 both = "QA-AP2472-Curve-A (0 - 50000)" | ✅ | Assigning to G2 did not move the curve out of G1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_011-step4-ListBothGroupsShowCurveX_pass.png` — list with both Multi groups showing Curve X
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_011-step4-G1StillHasCurveX_pass.png` — G1 details still listing Curve X

### AP2472_012 — Assigning a curve that is already in the group does not create a second, duplicate row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Dup2-2339` and assign Curve X | Grid lists Curve X once | Group id 10; grid = 1 row "QA-AP2472-Curve-A" | ✅ | — |
| 2 | Open the "Earning Curve" select and look for Curve X | Missing (recorded; step 3 skipped) or offered | Options = "1 year" … "6 years" only (6 options); Curve X is not offered | ✅ | Step 3 skipped as the case instructs |
| 3 | If still offered, choose it and submit | Refused or reload | Not applicable — Curve X not offered | ✅ | Extra server check: an option for curve 7 was injected into the select and submitted; the server refused it with "This value is not valid." and no row was added |
| 4 `[Verification]` | Count Curve X rows | Exactly one | After reload, rows named "QA-AP2472-Curve-A" = 1 | ✅ | Protected by the UI and by the server |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_012-step2-CurveXNotOfferedAgain_pass.png` — open dropdown without Curve X
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_012-step4-CurveXOnceInGrid_pass.png` — grid with Curve X listed once

### AP2472_013 — Submitting the assign form with no curve selected adds nothing and shows a message or does nothing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Empty-2339` (Pro-Rata) | Details page, empty grid | Group id 11; grid area = "No entities found" | ✅ | — |
| 2 | Leave "Earning Curve" on its placeholder and click "Assign" | A message asks for a curve, or nothing is submitted. No server error page | On a new group the select has **no** empty option: "1 year (0 - 999999)" is pre-selected, so a plain click would silently assign that curve. The placeholder "Nothing selected" appears only when every curve is already in the group. Reproduced that state on test group `QA-AP2472-DblClick-2339` (id 16) by assigning all 8 curves. The select then had 0 options and showed "Nothing selected". Clicking "Assign" returned **HTTP 500** with the error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." The same 500 happens on group 11 when the select is cleared before submitting | ❌ | Server error on empty submit, which is exactly the FAIL condition in this case's Judging note. An admin who opens a group that already holds every curve and clicks Assign gets a crash page instead of a message |
| 3 `[Verification]` | Check the grid | Still empty, no blank row | Group 11 after reload: rows = 0, "No entities found". Group 16 after the 500: 8 rows, no blank row | ✅ | No broken record was written |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step2-NoEmptyOptionFirstCurvePreselected_pass.png` — new group's select with "1 year" pre-selected and no placeholder
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-AllCurvesAssignedNothingSelected.png` — group with all 8 curves assigned; the select shows "Nothing selected"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step2-AssignNothingSelectedHttp500_fail.png` — HTTP 500 error page after clicking Assign with nothing selected
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-EmptyCurveAssignHttp500_fail.png` — same 500 on group 11 with the select cleared
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step3-GridStillEmpty_pass.png` — group 11 grid still empty after reload

### AP2472_014 — Clicking the trash can asks "Are you sure to delete this record?", and Cancel keeps the curve in the group — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Cancel2-2339` and assign Curve X | Grid lists Curve X | Group id 12; grid = 1 row "QA-AP2472-Curve-A" | ✅ | — |
| 2 `[Verification]` | Click the trash can in Curve X's row | Modal with "Are you sure to delete this record?" and confirm/cancel buttons (labels recorded) | Bootstrap modal (not a browser dialog), heading "Unassign earning curve", text = "Are you sure you want to delete this record?", buttons = "Continue" (submit, POST to `/admin/earning-group/12/curve/7/unassign`) and "No" (dismiss link) | ✅ | Wording differs slightly from the ticket: "sure **you want** to delete" vs "sure to delete". Meaning unchanged; recorded for the bug-report stage to decide |
| 3 | Click "No" | Modal closes | `.modal.show` count = 0; URL unchanged | ✅ | — |
| 4 `[Verification]` | Reload and check the grid | Curve X still listed | After reload, grid = "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes" | ✅ | "No" removed nothing |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_014-step2-UnassignConfirmModal_pass.png` — "Unassign earning curve" modal with Continue / No
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_014-step4-CurveXKeptAfterNo_pass.png` — grid still listing Curve X after reload

### AP2472_015 — Unassigning a curve from one group leaves it in the other group and in the Earning Curves list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Unassign-G1-2339` and assign Curve X | G1 lists Curve X | Group id 13; grid = 1 row "QA-AP2472-Curve-A" | ✅ | — |
| 2 `[Pre-Condition]` | Create `QA-AP2472-Unassign-G2-2339` and assign Curve X | G2 lists Curve X | Group id 14; grid = 1 row "QA-AP2472-Curve-A" | ✅ | — |
| 3 | On G1, click the trash can, then "Continue" | Modal closes; Curve X gone from G1; message recorded | Page reloaded at `/admin/earning-group/13/details`; alert "Earning curve unassigned"; grid = "No entities found" | ✅ | — |
| 4 `[Verification]` | Check G2, the groups list and the Earning Curves list | Curve X in G2; list shows it for G2 not G1; Curve X still in Earning Curves, values unchanged | G2 grid = "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes"; list: G2 = "QA-AP2472-Curve-A (0 - 50000)", G1 = "None"; Earning Curves list still has "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes" and all six seeded curves | ✅ | Unassign removes only the link. No Critical stop needed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_015-step4-CurveXStillInCurvesList_pass.png` — Earning Curves list still holding Curve X
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_015-step4-G2StillHasCurveX_pass.png` — G2 details still listing Curve X
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_015-step4-ListG1EmptyG2HasCurveX_pass.png` — list with G1 "None" and G2 showing Curve X

### AP2472_016 — Editing a group's name and default method saves both, and its assigned curves are kept — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2472-Edit-2339` (Pro-Rata) and assign Curve X | Details page lists Curve X | Group id 15; `h1` = "Earning Group QA-AP2472-Edit-2339"; grid = 1 row "QA-AP2472-Curve-A" | ✅ | — |
| 2 | Click "Edit" | Form (modal or page, recorded) pre-filled; every field recorded | Modal (URL unchanged) titled "Earning group #15"; fields = Name* = "QA-AP2472-Edit-2339", Default Earning Method* = "Pro-Rata"; button = "Save". No Is Enabled? control | ✅ | Same form as Create |
| 3 | Change Name to `QA-AP2472-Edited-2339`, pick "Reverse rule of 78", click "Save" | Lands on the details page (or landing recorded) | Landed on `/admin/earning-group/15/details` with alert "Earning group saved" | ✅ | — |
| 4 `[Verification]` | Check the details page and the list | Title "Earning Group QA-AP2472-Edited-2339"; Curve X kept; list shows new name and "Reverse rule of 78"; old name gone | `h1` = "Earning Group QA-AP2472-Edited-2339"; grid = "QA-AP2472-Curve-A \| 12 \| 0 - 50000 \| Pro-Rata \| Yes"; list row = "QA-AP2472-Edited-2339 \| QA-AP2472-Curve-A (0 - 50000) \| Reverse rule of 78 \| Yes"; rows named "QA-AP2472-Edit-2339" across both list pages = 0 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_016-step4-DetailsEditedTitleCurveKept_pass.png` — details page with the new title and Curve X kept
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_016-step4-ListEditedRow_pass.png` — list row with the new name and "Reverse rule of 78"

---

## Additional observations (not test cases)

The reviewer asked for these cheap checks. They are not test cases and are not counted in the totals above.

| # | Check | What happened | Evidence |
|:---:|---|---|---|
| O-1 | Does a disabled curve appear in the "Earning Curve" select? | **Yes.** Created `QA-AP2472-Curve-B-Disabled` (id 8, Is Enabled? unchecked; the list shows "No"). On group 11's details page the select offers "QA-AP2472-Curve-B-Disabled (0 - 50000)" with no marker that it is disabled. Admins can therefore assign a disabled curve to a group. The ticket does not say whether that is allowed (relates to Q-002) | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-DisabledCurveOfferedInSelect.png` |
| O-2 | Is a spaces-only name accepted? | **No.** A name of three spaces was refused with "This value should not be blank." on the standalone page `/admin/earning-group/new/edit`; no group was created | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-SpacesOnlyName.png` |
| O-3 | Does double-clicking "Save" in Create New make two groups? | **No.** Double-clicking Save for `QA-AP2472-DblClick-2339` created exactly one group (id 16); total groups went from 15 to 16 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-DoubleClickCreateOneGroup.png` |
| O-4 | Clicking "Assign" when the select is empty | **HTTP 500.** See AP2472_013. This is the main new defect from this run | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-AssignNothingSelectedHttp500_fail.png` |
| O-5 | "Assign" without choosing anything on a normal group | The select has no placeholder, so the first curve ("1 year (0 - 999999)") is pre-selected. Clicking Assign straight away would add that curve without the admin choosing it. Not executed, to keep seeded curves out of test groups | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step2-NoEmptyOptionFirstCurvePreselected_pass.png` |
| O-6 | Is Enabled? for groups | Every group shows "Yes". Neither the Create nor the Edit modal has an Is Enabled? control, so a group cannot be disabled from the UI (Q-002 / Q-006) | AP2472_004 and AP2472_016 screenshots |
| O-7 | List pagination | The Earning Groups list pages at **10 rows**, newest first (`?page=N`). After this run there are 16 groups, and the seeded "AV+" row is now on page 2 | — |

---

## Blocked / Skipped Test Cases

None — all 16 test cases ran to a PASS or FAIL result.

---

## Test data created on staging (left in place — no delete action, `cleanup` source missing)

**Earning curves** (both QA-named, created by this run):

| Id | Name | Term | Odometer | Type | Enabled |
|---|---|---|---|---|---|
| 7 | QA-AP2472-Curve-A (Curve X) | 12 | 0 - 50000 | Pro-Rata | Yes |
| 8 | QA-AP2472-Curve-B-Disabled | 12 | 0 - 50000 | Pro-Rata | No |

**Earning groups** (ids 2–16):

| Id | Name | Default method | Curves assigned at end of run | Case |
|---|---|---|---|---|
| 2 | QA-AP2472-RO78-2339 | Rule of 78 | none | 004 |
| 3, 4 | QA-AP2472-Dup-2339 (twice) | Pro-Rata | none | 006 |
| 5 | QA-AP2472-Long-xxx… (255 chars) | Pro-Rata | none | 007 |
| 6 | QA-AP2472 É & \<b>x\</b> | Pro-Rata | none | 007 |
| 7 | QA-AP2472-Assign-2339 | Pro-Rata | Curve-A | 009, 010 |
| 8 | QA-AP2472-Multi-G1-2339 | Pro-Rata | Curve-A | 011 |
| 9 | QA-AP2472-Multi-G2-2339 | Rule of 78 | Curve-A | 011 |
| 10 | QA-AP2472-Dup2-2339 | Pro-Rata | Curve-A | 012 |
| 11 | QA-AP2472-Empty-2339 | Pro-Rata | none | 013, O-1 |
| 12 | QA-AP2472-Cancel2-2339 | Pro-Rata | Curve-A | 014 |
| 13 | QA-AP2472-Unassign-G1-2339 | Pro-Rata | none (unassigned) | 015 |
| 14 | QA-AP2472-Unassign-G2-2339 | Pro-Rata | Curve-A | 015 |
| 15 | QA-AP2472-Edited-2339 (was QA-AP2472-Edit-2339) | Reverse rule of 78 | Curve-A | 016 |
| 16 | QA-AP2472-DblClick-2339 | Pro-Rata | none — all 8 curves were assigned for the AP2472_013 reproduction and then unassigned again | O-3, O-4 |

Not created: `QA-AP2472-Cancel-2339` (AP2472_008) and the blank/spaces-only names. Seeded data untouched: group "AV+" (id 1) still holds its six curves; seeded curves 1–6 unchanged (re-checked after the run).

---

## Environment Observations

- Staging responded quickly throughout; no timeouts, no retries needed, no environment-caused failures.
- The browser console logged one error on the admin login page before login (also seen by earlier runs). It did not affect any step.
- The Playwright MCP server in this session writes its throwaway `page-*.yml` and `console-*.log` files into `qa-artifacts/4-execution-results/screenshots/` (the session's working directory), not into `playwright-log/` as `tools.md` §3 says. That folder already held about 460 such files from earlier runs. They are not evidence and were left alone. All evidence for this run is in `screenshots/5.2.0/AP-2472/`.
- On the Earning Curve create page, the "Coverage odometer from/to" fields came back empty once after other fields were changed, and the save failed with "This value should not be blank." Re-entering the values and saving worked. Worth knowing when creating curves for later runs.

---

## Gate C re-check — AP2472_013 (2026-10-04, orchestrator)

The QA asked whether the HTTP 500 is only a missing required value, which would make it user error rather than a defect. Checked on test group 11 (`QA-AP2472-Empty-2339`):

| Check | Result |
|---|---|
| Fields in the Assign form (`POST /admin/earning-group/11/details`) | One user field, `earning_group_curve[earningCurve]` (label "Earning Curve", select, **no** `required` attribute), plus the hidden CSRF token `earning_group_curve[_token]` that the page fills in. No other value exists that the user could have left empty. |
| Valid token + empty curve value | **HTTP 500**, "Erreur" page |
| Valid token + curve field omitted | **HTTP 500**, "Erreur" page |
| Control: valid token + curve id 7 | Redirect (success). Curve assigned, so the token, session and form are valid |
| Clean-up | Curve 7 unassigned from group 11 via the trash icon → "Earning curve unassigned"; grid empty again |

**Conclusion:** the curve is the form's only required value, and leaving it empty is exactly the condition under test. The server does not validate it: there is no "This value should not be blank." message, unlike the group Name field on Create (AP2472_005), and it crashes with a 500 instead. The FAIL stands as a missing server-side validation defect, not user error.

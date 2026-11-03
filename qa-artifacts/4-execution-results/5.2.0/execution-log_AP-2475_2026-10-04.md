# Execution Log — AP-2475 Edit earning assignment parameter

> Written by the **stlc-manual-executor** skill (pipeline stage s4). Inputs:
> `qa-artifacts/3-test-cases/AP2475_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2475_TestCases_006-010.md`.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-04
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging) — Admin portal
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 01:13 → 01:21 (local time)
**Account:** shared admin account from `execute.env.md`
**Environment check:** passed by the pipeline before this stage (login form shown at `/admin/login`). The `env-check` source is `missing` in the knowledge registry, so no scripted smoke test was run beyond that and the login in the first case.

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 9 |
| Failed | 0 |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **90% (9 of 10)** |

**Shared fixture used by every case:** earning assignment **#4 "QA-AP2475-011346"** (Earning Set Profit, Dealer Group Group A, Is Enabled ticked), created at 01:13 through `/admin/earning-assignment/new/edit`. Save showed the green alert "Earning assignment saved" and landed on `/admin/earning-assignment/4/details`.

**Values actually chosen:** P1 Coverage Code = **"AP-CADV - Advanced"** (first option), P1 Make = **"Acura"** (first option). P2 Coverage Code = **"AFPP - AFPP"**, P2 Make = **"Adventurer"**, P2 Earning Group = **"QA-AP2472-Assign-2339"** (the second listed option, "QA-AP2472 É & <b>x</b>", was skipped only for readability).

**Routes recorded (the test cases asked for these):**
- Add Parameter: `GET/POST /admin/earning-assignment/{id}/parameter/add`, loaded into a Bootstrap modal (`#myModal`) over the details page; the browser URL does not change.
- Edit parameter (pencil): `GET/POST /admin/earning-assignment/{id}/parameter/{paramId}/edit`, same modal. Opened directly, or after a server-side validation error, it is a standalone page with the same form.
- Delete (trash can): `/admin/earning-assignment/{id}/parameter/{paramId}/unassign`, modal "Unassign parameter".

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2475_002 | Clicking the pencil opens an edit dialog already filled with every current value | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_002-step4-EditDialogPrefilled_pass.png` | "Edit Parameter" dialog shows all 11 fields with the values the row was created with |
| AP2475_003 | Changing every field and saving updates the same row instead of adding a new one | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_003-step4-RowUpdatedToP2_pass.png` | Row 4 changed in place to all P2 values; count stayed 3; alert "Parameter saved" |
| AP2475_004 | Changing only Lag Interval and Make keeps the other nine fields after reload | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_004-step4-PartialEditKeptAfterReload_pass.png` | After reload, row and dialog show Lag 6 / Adventurer; other nine fields unchanged |
| AP2475_005 | Editing one of two parameters leaves the other row exactly as it was | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_005-step5-RowBEditedRowAUnchanged_pass.png` | Pencil on row B loaded parameter 7 (100052); only row B became 0 - 8 |
| AP2475_001 | Each parameter row shows a pencil "edit" icon in its Actions column | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_001-step3-PencilIconInActions_pass.png` | Pencil (fa-pen) beside trash can on every row; no tooltip or accessible name |
| AP2475_006 | Saving an odometer range entered backwards does not crash or corrupt the row | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_006-step3-BackwardsRangeSaved_pass.png` | Accepted cleanly: row now shows 50000 - 1000 (Q-006: no range check) |
| AP2475_007 | Typing letters into the numeric "Coverage odometer from" field is refused | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_007-step4-RowKeptOdometerAfterReload_pass.png` | Field ignored the letters; server refused the blank with "This value should not be blank." |
| AP2475_008 | Leaving the edit dialog without saving keeps the parameter as it was | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_008-step4-UnsavedLagNotStored_pass.png` | No Cancel or × exists; Esc closed the dialog; Lag Interval stayed 0 |
| AP2475_009 | The trash can still asks for confirmation and deletes the parameter | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_009-step4-RowDeletedIconsIntact_pass.png` | Confirmation shown, row 100009 deleted, 9 rows left with both icons |
| AP2475_010 | Editing a parameter so it matches another row exactly does not crash | Low | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_010-step2-Http500AfterAddRowB_fail.png` | Blocked by AP-2474: details page returns HTTP 500 once the assignment has 11 parameters |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2475_001 — Each parameter row on an earning assignment shows a pencil "edit" icon in its Actions column — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in; no `QA-AP2475-…` assignment existed, so create it (Profit / Group A / Is Enabled) → Save | Details page "Earning Assignment QA-AP2475-…" with "Edit", "Add Parameter" and a datagrid | URL = `/admin/earning-assignment/4/details`; heading = "Earning Assignment QA-AP2475-011346"; alert = "Earning assignment saved"; nav links "Edit" (`/4/edit`) and "Add Parameter" (`/4/parameter/add`); grid area showed "No entities found" | ✅ | Assignment #4 created at 01:13 and shared by every case |
| 2 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100001 → Submit | Dialog closes; row `0 - 100001` appears | Dialog closed; alert = "Parameter added"; row = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100001 / 0 - 5 / Acura / 0 / AV+" (parameter id 2) | ✅ | The Add form pre-fills odometer 0 - 9999999 and model year age -1 - 99 (AP-2476 not deployed: no "All" placeholders) |
| 3 `[Verification]` | Look at the Actions column of every row | Every row shows a pencil next to the trash can | Row 100001: link 1 = icon `fal fa-pen`, href `/admin/earning-assignment/4/parameter/2/edit`; link 2 = icon `fal fa-trash-alt`, href `.../parameter/2/unassign`. Neither link has a `title` or `aria-label`. Re-checked later with 9 and 10 rows on assignment 4 and on the seeded assignment #1 (view only): every row had both icons | ✅ | Pencil present on every row; no tooltip or accessible name on either icon (accessibility observation only) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_001-step3-PencilIconInActions_pass.png` — the first parameter row with the pencil and trash-can icons side by side in the Actions column

### AP2475_002 — Clicking the pencil opens an edit dialog already filled with every current value of that parameter — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment #4 details page | Details page with the datagrid | Already open from AP2475_001; datagrid with 1 row | ✅ | Reused the shared assignment |
| 2 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100002 | Row `0 - 100002` appears | Alert "Parameter added"; new top row "0 - 100002" (parameter id 3). Coverage Code noted = "AP-CADV - Advanced", Make noted = "Acura" | ✅ | Grid is ordered newest first |
| 3 | Click the pencil on the 100002 row | A modal opens; record title and URL | Modal opened over the page; heading = "Edit Parameter"; browser URL unchanged = `/admin/earning-assignment/4/details`; form action = `/admin/earning-assignment/4/parameter/3/edit`; the only button is "Submit" | ✅ | Modal content loads by AJAX, so it appears a moment after the click |
| 4 `[Verification]` | Read every field in the dialog | Same 11 fields as Add Parameter, each holding its P1 value | Condition = "New"; Coverage Code = "AP-CADV - Advanced"; Sale Date from = "2026-01-01"; Sale Date to = "2026-12-31"; Coverage odometer from = "0"; Coverage odometer to = "100002"; Model Year Age From = "0"; Model Year Age to = "5"; Make = "Acura"; Lag Interval = "0"; Earning Group = "AV+". No missing or extra field | ✅ | Q-001 answered: yes, pre-filled. Q-002: identical field set to Add Parameter |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_002-step4-EditDialogPrefilled_pass.png` — "Edit Parameter" dialog showing the stored P1 values

### AP2475_003 — Changing every field and saving updates the same parameter row instead of adding a new one — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100003; count rows | Row `0 - 100003` listed; N noted | Alert "Parameter added"; row "0 - 100003" (parameter id 4); N = 3 | ✅ | — |
| 2 | Click the pencil on the 100003 row | Edit dialog opens with P1 values | "Edit Parameter" dialog; all 11 fields held the P1 values with odometer to = 100003 | ✅ | — |
| 3 | Change every field to P2 and click Submit | Dialog closes, no error, no HTTP 500; record message and landing page | Dialog closed; page reloaded at `/admin/earning-assignment/4/details`; green alert = "Parameter saved"; no error | ✅ | Q-003 answered: message "Parameter saved", stays on the details page |
| 4 `[Verification]` | Read the datagrid | Count still N; one row shows P2 values; no 100003 row | Row count = 3; top-but-one row (parameter id 4, same pencil link as before) = "Used / AFPP - AFPP / 2025-01-01 - 2025-12-31 / 1000 - 200003 / 1 - 10 / Adventurer / 12 / QA-AP2472-Assign-2339"; no row contains 100003 | ✅ | Updated in place: same parameter id, no new row |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_003-step4-RowUpdatedToP2_pass.png` — grid after save with the edited row showing every P2 value and the "Parameter saved" alert

### AP2475_004 — Changing only Lag Interval and Make keeps the other nine fields as they were, after a page reload — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100004 | Row `0 - 100004`, Lag 0, first Make | Alert "Parameter added"; row "0 - 100004 / Acura / 0" (parameter id 5) | ✅ | — |
| 2 | Pencil on 100004; Lag Interval → 6, Make → second option; Submit | Dialog closes without error | Before Submit the dialog read: Make = "Adventurer", Lag Interval = "6", all others unchanged. After Submit: dialog closed, alert = "Parameter saved" | ✅ | — |
| 3 | Reload the details page | Page reloads; 100004 row still listed | Fresh GET of `/admin/earning-assignment/4/details`; row "0 - 100004" listed | ✅ | — |
| 4 `[Verification]` | Read the 100004 row, then open its pencil and read the dialog | Row and dialog show Lag 6 and second Make; other nine fields keep P1 values | Row = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100004 / 0 - 5 / Adventurer / 6 / AV+". Dialog = Condition "New", Coverage Code "AP-CADV - Advanced", Sale Date "2026-01-01" to "2026-12-31", odometer "0" to "100004", Model Year Age "0" to "5", Make "Adventurer", Lag Interval "6", Earning Group "AV+" | ✅ | The date pickers and number fields kept their values through a partial edit |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_004-step4-PartialEditKeptAfterReload_pass.png` — edit dialog re-opened after reload, showing Lag 6 / Adventurer with every other field unchanged

### AP2475_005 — Editing one of two parameters leaves the other parameter row exactly as it was — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment #4 details page | Details page shown | Details page loaded with 4 rows | ✅ | — |
| 2 `[Pre-Condition]` | Add row A (odometer to 100051), then row B (100052) | Rows `0 - 100051` and `0 - 100052` listed | Both added with "Parameter added"; row A = parameter id 6, row B = parameter id 7 | ✅ | — |
| 3 | Click the pencil on row B | Dialog shows odometer to 100052, not 100051 | Dialog form action = `.../parameter/7/edit`; Coverage odometer to = "100052" | ✅ | The pencil loads the clicked row's own record |
| 4 | Model Year Age to → 8; Submit | Dialog closes without error | Dialog closed; alert = "Parameter saved" | ✅ | — |
| 5 `[Verification]` | Read both rows | Row B shows 0 - 8; row A still 0 - 5 with all P1 values | Row B = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100052 / 0 - 8 / Acura / 0 / AV+". Row A = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100051 / 0 - 5 / Acura / 0 / AV+". Rows 100004, 200003, 100002, 100001 also unchanged | ✅ | No cross-row overwrite |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_005-step5-RowBEditedRowAUnchanged_pass.png` — grid with row B at Model Year Age 0 - 8 and row A still at 0 - 5

### AP2475_006 — Saving an odometer range entered backwards (from 50000, to 1000) does not crash or corrupt the row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100006 | Row `0 - 100006` listed | Alert "Parameter added"; row "0 - 100006" (parameter id 8); row count 7 | ✅ | — |
| 2 | Pencil on 100006; odometer from 50000, to 1000; Submit | Either a validation message or a normal save; no HTTP 500 | The dialog closed as a normal save; alert = "Parameter saved"; no validation message; no error page | ✅ | Outcome recorded for Q-006: the backwards range was **accepted** |
| 3 `[Verification]` | Read the datagrid | If accepted: one row shows `50000 - 1000`, no `100006` row, count unchanged, other fields P1 | Row count = 7; top row = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 50000 - 1000 / 0 - 5 / Acura / 0 / AV+"; no row contains 100006 | ✅ | Stored exactly what was entered; the rule now can never match a vehicle — product-owner question, not a defect under this batch's judging rule |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_006-step3-BackwardsRangeSaved_pass.png` — grid showing the saved row with odometer 50000 - 1000

### AP2475_007 — Typing letters into the numeric "Coverage odometer from" field is refused and the row keeps its value — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100007 | Row `0 - 100007` listed | Alert "Parameter added"; row "0 - 100007" (parameter id 10); row count 8 | ✅ | Parameter id 9 was skipped, apparently taken by a parallel AP-2474 run on another assignment |
| 2 | Pencil on 100007; clear odometer from; type `abc` key by key | Field refuses the letters, or shows `abc`; record which | Field "Coverage odometer from" value = "" (empty) after typing; validity: valueMissing = true, badInput = false | ✅ | The number input does not accept letters at all |
| 3 | Click Submit | Save refused; browser check or server message names the field; no HTTP 500 | The browser's own required check did **not** stop the submit. The server refused it: the browser left the dialog and landed on the standalone page `/admin/earning-assignment/4/parameter/10/edit` (heading "Edit Parameter") with "ERROR This value should not be blank." inside the "Coverage odometer from" label; all other fields kept their values; no HTTP 500 | ✅ | Same pattern as the Earning Set dialog: validation is server-side only, and an error moves the user to a standalone page |
| 4 `[Verification]` | Leave without saving, reload the details page, read the 100007 row | Row still `0 - 100007`; no row with `abc` or blank | Navigated to `/admin/earning-assignment/4/details`; row = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100007 / 0 - 5 / Acura / 0 / AV+"; row count 8; no blank odometer anywhere | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_007-step3-OdometerFromBlankError_pass.png` — standalone Edit Parameter page with "This value should not be blank." under Coverage odometer from
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_007-step4-RowKeptOdometerAfterReload_pass.png` — grid after reload, 100007 row unchanged

### AP2475_008 — Leaving the edit dialog without saving keeps the parameter exactly as it was — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100008 | Row `0 - 100008`, Lag 0 | Alert "Parameter added"; row "0 - 100008 / … / 0 / AV+" (parameter id 12); row count 9 | ✅ | — |
| 2 | Pencil on 100008; Lag Interval → 12; do not save | Dialog shows Lag 12; record close controls | Lag Interval select value = "12". Close controls in the dialog: **none** — no Cancel, no ×; the only button is "Submit". Modal config: keyboard = true, backdrop = true | ✅ | Q-004: no explicit way out |
| 3 | Leave without saving (Esc, since no Cancel/×) | Dialog closes; details page shown | Pressed Esc once: modal closed; URL = `/admin/earning-assignment/4/details` | ✅ | Esc works; clicking the backdrop was not tried |
| 4 `[Verification]` | Reload; read the 100008 row | Lag Interval 0 and all P1 values | Row = "New / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100008 / 0 - 5 / Acura / 0 / AV+" | ✅ | Nothing was saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_008-step4-UnsavedLagNotStored_pass.png` — grid after reload, 100008 row still at Lag Interval 0

### AP2475_009 — The trash-can icon still asks for confirmation and deletes the parameter now that the pencil sits beside it — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Add Parameter with P1 values, odometer to 100009; count rows | Row `0 - 100009`; N rows | Alert "Parameter added"; row "0 - 100009" (parameter id 14); N = 10 | ✅ | — |
| 2 | Click the trash can on 100009 | Confirmation "Are you sure to delete this record?"; edit dialog does not open | Modal heading = "Unassign parameter"; text = "Are you sure you want to delete this record?"; buttons "Continue" and "No"; the Edit Parameter dialog did not open | ✅ | Wording differs slightly from the AP-2474 text ("you want" added) — same meaning, noted only |
| 3 | Confirm (Continue) | Dialog closes without error | Dialog closed; page reloaded; alert = "Parameter unassigned" | ✅ | — |
| 4 `[Verification]` | Read the datagrid | 100009 gone; N−1 rows; every row keeps pencil and trash can | Row count = 9; no 100009 row; all 9 rows have both the `fa-pen` and `fa-trash-alt` links | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_009-step2-UnassignConfirmDialog_pass.png` — the "Unassign parameter" confirmation dialog
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_009-step4-RowDeletedIconsIntact_pass.png` — grid after deletion, 9 rows each with both icons

### AP2475_010 — Editing a parameter so it matches another row exactly does not crash and is recorded for review — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment #4 details page | Details page shown | Details page loaded with 9 rows | ✅ | — |
| 2 `[Pre-Condition]` | Add row A (odometer to 100101), then row B (100102) | Rows `0 - 100101` and `0 - 100102` listed | Row A added normally ("Parameter added", row count 10). Row B: Submit returned the browser to `/admin/earning-assignment/4/details` with **HTTP status 500** and the French error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." (rendered in the dealer-portal layout). Retried: a fresh GET of `/4/details` → HTTP 500 again; `/4/details?page=2` → HTTP 500. Row B **was** stored: `/admin/earning-assignment/4/parameter/16/edit` opens with odometer to 100102. The Earning Assignments list and assignment #3's details page still load, so the server is up | 🚫 | **Blocked by AP-2474 (Add Parameter → details page).** The details page has rendered with 10 parameters and fails from the 11th; most likely the parameter datagrid breaks past one page of 10 rows (not proven — see Environment Observations) |
| 3 | Pencil on row B, change odometer to 100101, save | — | Not run: the details page that holds the pencil cannot be opened | 🚫 | Blocked by step 2 |
| 4 `[Verification]` | Read the datagrid | — | Not run: the datagrid cannot be displayed | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_010-step2-Http500AfterAddRowB_fail.png` — the HTTP 500 error page shown after adding the 11th parameter

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2475_010 | 🚫 | AP-2474 precondition failed: after the 11th parameter was added to assignment #4, `/admin/earning-assignment/4/details` returns HTTP 500 on every load (retried twice). The duplicate-row edit could not be performed or checked. To unblock: fix the details page for assignments with more than 10 parameters, or remove a parameter from assignment #4 so it has at most 10, then re-run this case on rows 100101 / 100102. |

---

## Observations for open questions

| Question | What was observed |
|---|---|
| Q-001 pre-fill | Yes. The edit dialog opens with every stored value in all 11 fields (AP2475_002, AP2475_004). |
| Q-002 field set | Identical to Add Parameter: Condition, Coverage Code, Sale Date from, Sale Date to, Coverage odometer from, Coverage odometer to, Model Year Age From, Model Year Age to, Make, Lag Interval, Earning Group. All are changeable. Dialog heading "Edit Parameter"; button "Submit". |
| Q-003 save | Green alert **"Parameter saved"**; the user stays on `/admin/earning-assignment/{id}/details`; the row is updated in place (same parameter id, no new row). Add shows "Parameter added"; delete shows "Parameter unassigned". |
| Q-004 close without saving | No Cancel and no × in the dialog. **Esc** closes it without saving (Bootstrap modal, keyboard enabled). Backdrop click not tried. |
| Q-005 pencil on every row | Yes on every row seen: up to 10 rows on assignment #4 and the single row of the seeded assignment #1 (viewed only). Both assignments are enabled; a disabled assignment was not checked. The pencil has no tooltip or accessible name. |
| Q-006 validation | Backwards odometer range (50000 - 1000) is **accepted** and stored. Letters cannot be typed into the number fields; a blank number field is refused server-side with "This value should not be blank." on a standalone page — the browser's required check does not fire inside the dialog. Duplicate-row behaviour **not observed** (AP2475_010 blocked). |
| Q-007 odometer default | The Add Parameter form still defaults "Coverage odometer to" to **9999999** (AP-2474 value), "Coverage odometer from" to 0, Model Year Age to -1 - 99. AP-2476 ("All" placeholders) is not deployed. |

---

## Environment Observations

- **HTTP 500 on the assignment details page once it holds 11 parameters (needs triage, AP-2474 area).** Assignment #4 rendered normally with 9 and with 10 parameter rows (twice). Adding the 11th row saved the record but every load of `/admin/earning-assignment/4/details` (with or without `?page=2`) has returned HTTP 500 since 01:19. Other details pages (#1, #3) load fine. The grid elsewhere in Risk Management pages at 10 rows, so a broken second page of the parameter grid is the likely cause, but this was **not proven**: the executor tried to remove one parameter by opening its delete page directly to confirm the hypothesis and recover the page, and that action was refused by the session's permission controls. Consequence for a real user: as soon as an assignment has more than 10 parameters, nobody can view, edit (AP-2475) or delete its parameters from the UI.
- **Assignment #4 is currently unusable from the details page** for the reason above. Its parameters can still be opened one by one at `/admin/earning-assignment/4/parameter/{id}/edit`.
- **A parallel AP-2474 run was creating assignments and parameters at the same time** (assignments "QA-AP2474-008…014" appeared in the list during this run, and parameter ids 9, 11 and 13 were taken by records outside assignment #4). It did not touch assignment #4.
- The modal content for Add and Edit is loaded by AJAX, so the fields appear a moment after the click — wait for them before typing.
- Browser console showed one error on the login page and the 500 resource errors above; nothing else relevant.

### Records left on staging

| Record | Details |
|---|---|
| Earning assignment **#4** | "QA-AP2475-011346" — Profit / Group A / Enabled. No delete action exists for assignments. |
| Parameter 2 | 0 - 100001, P1 values |
| Parameter 3 | 0 - 100002, P1 values |
| Parameter 4 | Edited to P2: Used / AFPP - AFPP / 2025-01-01 - 2025-12-31 / 1000 - 200003 / 1 - 10 / Adventurer / 12 / QA-AP2472-Assign-2339 |
| Parameter 5 | 0 - 100004, P1 except Make Adventurer, Lag 6 |
| Parameter 6 | 0 - 100051, P1 values |
| Parameter 7 | 0 - 100052, P1 except Model Year Age 0 - 8 |
| Parameter 8 | Odometer **50000 - 1000** (backwards range), otherwise P1 |
| Parameter 10 | 0 - 100007, P1 values |
| Parameter 12 | 0 - 100008, P1 values |
| Parameter 15 (id inferred, not opened) | 0 - 100101, P1 values |
| Parameter 16 | 0 - 100102, P1 values — the 11th row that triggers the HTTP 500 |
| Parameter 14 | 0 - 100009 — deleted by AP2475_009 |

The seeded "AV+ / Profit / Group A" assignment (#1) was only viewed; nothing on it was changed.

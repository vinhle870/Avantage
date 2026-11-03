# Execution Log — AP-2476 Make Earning Assignment Parameter fields optional

> Written by the **stlc-manual-executor** skill (pipeline stage s4). Inputs:
> `qa-artifacts/3-test-cases/AP2476_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2476_TestCases_006-010.md`.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-11
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging) — Admin portal
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 23:30 → 23:35 (local time)
**Account:** shared admin account from `execute.env.md`

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 10 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (10 of 10)** |

**Environment check:** passed. `/admin/login` loaded with the French login form ("Connexion", "Courriel", "Mot de passe", "Se connecter") — `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/env-check-login-pass.png`. The `env-check` source is `missing` in the knowledge registry, so no scripted smoke test exists beyond this check and the login. The only console error was `ReferenceError: $ is not defined` on the login page itself, which is old and did not affect anything.

**Build check:** passed — AP-2476 **is deployed** on staging. In the first Add Parameter dialog the Coverage Code button read "All" (not "Choose"), so the run went ahead.

**Shared fixture used by every case:** earning assignment **#15 "QA-AP2476-233044"** (Earning Set Profit, Dealer Group Group A, Is Enabled ticked), created at 23:30 through `/admin/earning-assignment/new/edit`. Save showed "Earning assignment saved" and landed on `/admin/earning-assignment/15/details`. It ended the run with **6 parameters** (ids 22–27), well under the 10-row limit (AP-2484). Seeded assignment #1 "AV+" was not touched.

**The form has changed since the test cases were designed (stale design facts — the live page wins):**
- The dialog now has **13 fields, not 11**. Two new optional date boxes, **"Start date from"** and **"Start date To"** (`warrantyStartDateFrom` / `warrantyStartDateTo`), sit after Sale Date. They have no "All" hint, and the grid has a new **"Start date"** column (blank on every row this run). They are outside AP-2476 and were left empty.
- **Coverage Code is now a multi-select** (`#earning_assignment_parameter_coverageCodes`, name `coverageCodes[]`) with a search box and **Select All / Deselect All** buttons. Its list has no "All" item; "All" is what the button shows when nothing is ticked. The test cases' `#earning_assignment_parameter_coverageCode` id no longer exists.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2476_001 | The Add Parameter form shows "All", not "Choose", as the empty choice for all six optional fields | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_001-step4-AllPlaceholders_pass.png` | All six fields read "All"; Condition defaults to "All"; no "Choose" anywhere |
| AP2476_002 | A new parameter starts with Coverage odometer from 0 and Coverage odometer to 999999 | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_002-step3-OdometerDefaults_pass.png` | Defaults 0 / 999999 (six digits) as the ticket asks |
| AP2476_003 | A parameter saves with all six optional fields left on "All" and appears in the parameter list | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_003-step3-EmptyParamSaved_pass.png` | Saved as id 22; grid shows "All" in the six empty cells |
| AP2476_004 | Editing a fully filled parameter and setting the six fields back to "All" saves them as empty | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_004-step4-EditClearedToAll_pass.png` | Id 23 changed in place to "All" everywhere; row count stayed 2 |
| AP2476_005 | Editing a parameter saved with empty fields shows "All" in those fields and keeps its stored odometer | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_005-step4-EditShowsAllKeepsOdometer_pass.png` | Edit dialog for id 24 shows "All" and keeps 500 / 100005 |
| AP2476_006 | A parameter with every field filled still saves and lists all eleven values as before | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_006-step3-FullParamListed_pass.png` | Id 25 lists every value after reload; pencil and trash icons present |
| AP2476_007 | Leaving Model Year Age from blank is still refused, because only the six listed fields became optional | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_007-step3-NoRowAdded_pass.png` | Refused with "This value should not be blank."; no row added |
| AP2476_008 | Clearing both odometer boxes is either refused cleanly or saved as 0 to 999999, never an error page | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_008-step3-NoRowAdded_pass.png` | Refused cleanly at both odometer boxes (Q-007); no row added |
| AP2476_009 | A parameter with only "Sale Date from" filled saves and keeps that date | Low | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_009-step3-EditSaleDateFromKept_pass.png` | Saved as id 26; grid shows "2026-01-01 - All" (Q-005) |
| AP2476_010 | Editing a parameter saved on "All" and choosing real values saves those values | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_010-step4-EditFilledValuesSaved_pass.png` | Id 27 now lists every chosen value; row count stayed 6 |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2476_001 — The Add Parameter form shows "All", not "Choose", as the empty choice for all six optional fields — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and create the `QA-AP2476-…` assignment | Details page "Earning Assignment QA-AP2476-…" with "Edit" and "Add Parameter" | URL = `/admin/earning-assignment/15/details`; heading = "Earning Assignment QA-AP2476-233044"; alert = "Earning assignment saved"; nav = "Edit", "Add Parameter"; grid = "No entities found" | ✅ | New shared fixture #15 for the whole run |
| 2 | Click Add Parameter, wait for "Coverage odometer from" | "Add Parameter" dialog with its 11 fields and a Submit button | Modal title = "Add Parameter"; 13 fields (the 11 expected plus "Start date from" / "Start date To"); button "Submit" visible | ✅ | Two extra Start date boxes come from a later change, not AP-2476 — the test case's field count is out of date |
| 3 | Open Condition, Coverage Code, Make, Earning Group lists and read the first option | Each list starts with "All"; none offers "Choose" | Condition list = "All", "New", "Used"; Make list starts "All", "Acura", "Adventurer"; Earning Group list starts "All", "AV+", …; Coverage Code list starts "AP-CADV - Advanced", "AFPP - AFPP" with a search box and "Select All" / "Deselect All" buttons; "Choose" found in none of the four | ✅ | Coverage Code is now a multi-select, so it has no "All" list item — its empty state is shown as "All" on the button instead, which meets the ticket |
| 4 `[Verification]` | Read the button texts, Sale Date hints, Condition selection and `*` markers | Coverage Code, Make, Earning Group read "All"; Sale Date hints "All"; Condition state recorded (Q-003); `*` recorded (Q-006) | Condition button = "All" (value "", selected by default); Coverage Code button = "All" (0 selected); Make button = "All"; Earning Group button = "All"; Sale Date from placeholder = "All"; Sale Date to placeholder = "All"; `*` absent on Condition, Coverage Code, Sale Date from/to, Make, Earning Group; `*` still on Coverage odometer from/to, Model Year Age From/to, Lag Interval | ✅ | Q-003: Condition now defaults to "All", not "New". Q-006: red `*` removed from exactly the six optional fields |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/env-check-login-pass.png` — French admin login form visible before the run
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_001-step4-AllPlaceholders_pass.png` — top of the Add Parameter dialog: Condition, Coverage Code, Sale Date from and to all read "All"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_001-step4-AllPlaceholdersLower_pass.png` — lower half of the dialog: Make and Earning Group read "All", odometer 0 / 999999, Model Year Age -1 / 99, Lag Interval 0

### AP2476_002 — A new parameter starts with Coverage odometer from 0 and Coverage odometer to 999999 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the `QA-AP2476-…` assignment details page | Details page with "Edit" and "Add Parameter" | URL = `/admin/earning-assignment/15/details`; heading = "Earning Assignment QA-AP2476-233044"; nav = "Edit", "Add Parameter" | ✅ | Reloaded the page so the dialog was fresh |
| 2 | Click Add Parameter, type nothing | "Add Parameter" dialog opens | Modal title = "Add Parameter"; label "Coverage odometer from" visible | ✅ | — |
| 3 `[Verification]` | Read both odometer values and count the digits of "to" | from = `0`; to = `999999` (six digits) | Field "Coverage odometer from" value = "0"; Field "Coverage odometer to" value = "999999" (6 digits) | ✅ | Q-002 settled in the ticket's favour: the old 9999999 default is gone |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_002-step3-OdometerDefaults_pass.png` — fresh Add Parameter dialog showing odometer 0 and 999999

### AP2476_003 — A parameter saves with all six optional fields left on "All" and appears in the parameter list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page and count rows | Details page with the parameter list or "No entities found" | Grid = "No entities found"; row count = 0 | ✅ | — |
| 2 | Leave the six fields on "All"; odometer 0 / 100003, Model Year Age 0 / 5, Lag 0 → Submit | Dialog closes; no "should not be blank" and no error page | Condition was already "All" (no change needed); dialog closed; URL = `/admin/earning-assignment/15/details`; text "This value should not be blank." absent | ✅ | Server accepted the blanks on the first try |
| 3 `[Verification]` | Read the alert and the `0 - 100003` row | "Parameter added"; one more row; `0 - 100003` with `0 - 5` and Lag 0; no made-up values in the six cells (record them for Q-004) | Alert = "Parameter added"; row count = 1; row = Condition "All" · Coverage Code "All" · Sale Date "All" · Start date "" · Coverage odometer "0 - 100003" · Model Year Age "0 - 5" · Make "All" · Lag Interval "0" · Earning Group "All"; pencil href = `/admin/earning-assignment/15/parameter/22/edit` | ✅ | Q-004: the grid writes "All" in every empty optional cell — no "New", no program, no 1970 date. New grid column "Start date" is blank |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_003-step3-EmptyParamSaved_pass.png` — alert "Parameter added" and the row showing "All" in the six optional columns

### AP2476_004 — Editing a fully filled parameter and setting the six fields back to "All" saves them as empty — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page | Details page shown | URL = `/admin/earning-assignment/15/details`; 1 row | ✅ | — |
| 2 `[Pre-Condition]` | Add a parameter with the F values, odometer 0 / 100004 | "Parameter added"; row `0 - 100004` with Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · Acura · AV+ | Alert = "Parameter added"; row = "Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · (blank) · 0 - 100004 · 0 - 5 · Acura · 0 · AV+"; pencil href = `/parameter/23/edit` | ✅ | Coverage Code picked by ticking one item in the new multi-select |
| 3 | Pencil on `0 - 100004`; set the four lists to "All", clear both Sale Dates → Submit | Dialog closes; no "should not be blank"; no error page | Edit dialog title = "Edit Parameter", loaded with Used / AP-CADV - Advanced / 2026-01-01 / 2026-12-31 / Acura / AV+ / 100004; after changes Condition = "", Coverage Code 0 selected (button "All"), Sale Dates = ""; dialog closed; "This value should not be blank." absent | ✅ | — |
| 4 `[Verification]` | Read the alert and row, reload, read again | "Parameter saved"; same row count; after reload the row no longer shows the old values; `0 - 5` and Lag 0 unchanged | Alert = "Parameter saved"; row count = 2 (unchanged); after reload row = "All · All · All · (blank) · 0 - 100004 · 0 - 5 · All · 0 · All" | ✅ | Clearing fields on Edit really empties them in storage |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_004-step4-EditClearedToAll_pass.png` — reloaded grid, row 0 - 100004 now shows "All" in all six optional columns

### AP2476_005 — Editing a parameter saved with empty fields shows "All" in those fields and keeps its stored odometer — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page | Details page shown | URL = `/admin/earning-assignment/15/details`; 2 rows | ✅ | — |
| 2 `[Pre-Condition]` | Add a parameter: six fields on "All", odometer 500 / 100005, Model Year Age 0 / 5, Lag 0 | "Parameter added"; row `500 - 100005` | Alert = "Parameter added"; row = "All · All · All · (blank) · 500 - 100005 · 0 - 5 · All · 0 · All"; pencil href = `/parameter/24/edit` | ✅ | — |
| 3 | Pencil on `500 - 100005` | "Edit Parameter" dialog opens | Modal title = "Edit Parameter"; label "Coverage odometer from" visible | ✅ | — |
| 4 `[Verification]` | Read the six optional fields and both odometer boxes | Four lists "All"; Sale Dates empty with hint "All"; odometer 500 / 100005, not 0 / 999999 | Condition button = "All" (value ""); Coverage Code button = "All" (0 selected); Make = "All"; Earning Group = "All"; Sale Date from value "" placeholder "All"; Sale Date to value "" placeholder "All"; Coverage odometer from = "500"; Coverage odometer to = "100005" | ✅ | Defaults apply to new rows only; stored values are kept |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_005-step4-EditShowsAllKeepsOdometer_pass.png` — Edit Parameter dialog with "All" in the empty fields and odometer 500 / 100005

### AP2476_006 — A parameter with every field filled still saves and lists all eleven values as before — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page | Details page shown | URL = `/admin/earning-assignment/15/details`; 3 rows | ✅ | — |
| 2 | Add a parameter with all F values, odometer 0 / 100006 → Submit | Dialog closes; "Parameter added" | Dialog closed; alert = "Parameter added" | ✅ | — |
| 3 `[Verification]` | Reload and read the `0 - 100006` row | Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · 0 - 100006 · 0 - 5 · Acura · 0 · AV+, with pencil and trash icons | After reload row = "Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · (blank Start date) · 0 - 100006 · 0 - 5 · Acura · 0 · AV+"; Actions = pencil (`fa-pen`, href `/parameter/25/edit`) and trash (`fa-trash-alt`, href `/parameter/25/unassign`) | ✅ | Filled values are not lost by the optional-field change |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_006-step3-FullParamListed_pass.png` — reloaded grid with the fully filled 0 - 100006 row at the top

### AP2476_007 — Leaving Model Year Age from blank is still refused, because only the six listed fields became optional — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page and count rows | Details page shown | Row count = 4 | ✅ | — |
| 2 | Six fields on "All", odometer 0 / 100007, Model Year Age From cleared, to 5, Lag 0 → Submit | Refused with "This value should not be blank." at Model Year Age From; no HTTP 500 / "Erreur" | POST returned 200; user moved to standalone page `/admin/earning-assignment/15/parameter/add`, heading "Add Parameter"; under "Model Year Age From" = "ERROR This value should not be blank."; odometer to kept "100007", Model Year Age to kept "5"; no "Erreur" page | ✅ | Same clean refusal as before the change |
| 3 `[Verification]` | Open the details page and look for `0 - 100007` | No such row; count unchanged | Row count = 4; no row contains "100007" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_007-step2-MyaFromBlankRefused_pass.png` — standalone Add Parameter page with the error under Model Year Age From
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_007-step3-NoRowAdded_pass.png` — details page still holding 4 rows, none with 100007

### AP2476_008 — Clearing both odometer boxes is either refused cleanly or saved as 0 to 999999, never an error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page and count rows | Details page shown | Row count = 4 | ✅ | — |
| 2 | Six fields on "All", both odometer boxes cleared, Model Year Age 0 / 58, Lag 0 → Submit | Either refused at the odometer boxes or "Parameter added"; never HTTP 500 / "Erreur". Record which | Refused: POST returned 200; standalone page `/parameter/add`; under "Coverage odometer from" and "Coverage odometer to" = "ERROR This value should not be blank."; no "Erreur" page; no alert | ✅ | Q-007: the odometer boxes stay mandatory; blank is not turned into the defaults |
| 3 `[Verification]` | Open the details page and look for Model Year Age `0 - 58` | If refused: no `0 - 58` row, count unchanged | Row count = 4; no row contains "0 - 58" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_008-step2-OdometerBlankRefused_pass.png` — standalone Add Parameter page with the error under both odometer boxes
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_008-step3-NoRowAdded_pass.png` — details page still holding 4 rows

### AP2476_009 — A parameter with only "Sale Date from" filled saves and keeps that date — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page | Details page shown | URL = `/admin/earning-assignment/15/details`; 4 rows | ✅ | — |
| 2 | Lists on "All", Sale Date to empty, Sale Date from `2026-01-01`, odometer 0 / 100009, Model Year Age 0 / 5, Lag 0 → Submit | "Parameter added"; no error page | Before submit Sale Date from = "2026-01-01", Sale Date to = ""; alert = "Parameter added"; no "Erreur"; row count = 5 | ✅ | — |
| 3 `[Verification]` | Read the row's Sale Date cell, then open its pencil | Sale Date cell starts `2026-01-01`; Edit shows from `2026-01-01`, to empty with hint "All" | Row = "All · All · 2026-01-01 - All · (blank) · 0 - 100009 · 0 - 5 · All · 0 · All" (pencil `/parameter/26/edit`); Edit Parameter: Sale Date from = "2026-01-01", Sale Date to = "" with placeholder "All" | ✅ | Q-005: an open-ended start date is accepted; the missing end is shown as "All" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_009-step3-EditSaleDateFromKept_pass.png` — Edit Parameter dialog with Sale Date from 2026-01-01 and Sale Date to empty showing "All"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_009-step3-GridOpenEndedSaleDate_pass.png` — grid row with Sale Date "2026-01-01 - All"

### AP2476_010 — Editing a parameter saved on "All" and choosing real values saves those values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the assignment details page | Details page shown | URL = `/admin/earning-assignment/15/details`; 5 rows | ✅ | — |
| 2 `[Pre-Condition]` | Add: six fields on "All", odometer 0 / 100010, Model Year Age 0 / 5, Lag 0 | "Parameter added"; row `0 - 100010` | Alert = "Parameter added"; row = "All · All · All · (blank) · 0 - 100010 · 0 - 5 · All · 0 · All"; pencil `/parameter/27/edit`; row count = 6 | ✅ | — |
| 3 | Pencil on `0 - 100010`; set Used, AP-CADV - Advanced, 2026-01-01 / 2026-12-31, Acura, AV+ → Submit | "Parameter saved"; no error page | Alert = "Parameter saved"; URL = `/admin/earning-assignment/15/details`; no "Erreur" | ✅ | — |
| 4 `[Verification]` | Reload and read the `0 - 100010` row | Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · 0 - 100010 · 0 - 5 · Acura · 0 · AV+; count unchanged | After reload row = "Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · (blank) · 0 - 100010 · 0 - 5 · Acura · 0 · AV+"; row count = 6 | ✅ | A broad rule can be narrowed later on Edit |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_010-step4-EditFilledValuesSaved_pass.png` — reloaded grid with the 0 - 100010 row now fully filled

---

## Open-question observations

| Question | What the build does (2026-10-11, staging) |
|---|---|
| Q-002 — 999999 vs 9999999 | New parameters default to Coverage odometer to **999999** (six digits), as the ticket says. Older rows (e.g. seeded #1) keep 9999999 |
| Q-003 — Condition default | Condition now has an "All" option (value "") and it is **selected by default**; "New" is no longer pre-selected |
| Q-004 — grid display of an empty field | The grid writes **"All"** in each empty optional cell (Condition, Coverage Code, Sale Date, Make, Earning Group). A half-filled date range shows as `2026-01-01 - All` |
| Q-005 — one sale date only | Accepted. Sale Date from alone saves and is kept; Sale Date to stays empty and shows "All" |
| Q-006 — red `*` markers | Removed from the six optional fields; still shown on Coverage odometer from/to, Model Year Age From/to and Lag Interval |
| Q-007 — blank odometer | Refused with "This value should not be blank." under both odometer boxes, on the standalone add page. Nothing saved, no error page |

---

## Environment Observations

- Staging responded quickly throughout; no timeouts, no HTTP 500 pages, no retries needed.
- The Add Parameter form has gained two fields that no test case covers — "Start date from" and "Start date To" — and a matching "Start date" grid column. They are blank on every row created here and have no "All" hint. They look like a separate ticket's work.
- Coverage Code has become a multi-select with search and Select All / Deselect All. The field id is now `earning_assignment_parameter_coverageCodes`. Test cases and automation that target `…_coverageCode` will no longer find it.

**Test data left on staging:** earning assignment **#15 "QA-AP2476-233044"** (Profit / Group A / Enabled) with parameters **22** (`0 - 100003`, all "All"), **23** (`0 - 100004`, filled then cleared to "All"), **24** (`500 - 100005`, all "All"), **25** (`0 - 100006`, fully filled), **26** (`0 - 100009`, Sale Date from 2026-01-01 only), **27** (`0 - 100010`, "All" then filled). AP2476_007 and AP2476_008 were refused and wrote nothing. Assignments cannot be deleted; nothing was unassigned.

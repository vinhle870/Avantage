# Test Cases — AP2475 (File 1 of 2)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2475 — Edit earning assignment parameter
**Source:** requirements/AP-2475-edit-earning-assignment-parameter.md · qa-artifacts/1-requirements-analysis/AP-2475_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2475_test-plan.md
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2475_001 to AP2475_005 (5 test cases)
**Coverage:** Functional · Edge-case · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` — Earning Assignments list. Create form `/admin/earning-assignment/new/edit`; details page `/admin/earning-assignment/{id}/details`. The Risk Management fly-out closes on every page load, so navigate by URL. The **Add Parameter** and **edit parameter** form routes are not known yet: record them in the execution log the first time they open. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Read-only reference data: earning set **Profit** (seeded, id 1), dealer group **Group A** (id 1), earning group **AV+** (seeded). Coverage codes, makes and other earning groups are picked by position ("first option", "second option") because their names are not mapped. **Never edit the seeded "AV+ / Profit / Group A" assignment or its parameters.** | `test-data`, `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | One earning assignment `QA-AP2475-<HHMMSS>`, shared by every case in this run (no delete action is described for assignments, and the `cleanup` source is `missing`). Each case adds 1–2 parameter rows to it. AP2475_009 deletes its own row with the trash can; the others stay unless deleted after the run. | `cleanup` (missing) |

**Shared assignment.** Every case works on one QA earning assignment. Step 1 of each case says: *use the `QA-AP2475-…` assignment created earlier in this run if it exists; otherwise create it.* Creating it: open `/admin/earning-assignment/new/edit`, enter Description `QA-AP2475-<HHMMSS>` (24-hour time at creation), Earning Set **Profit**, Dealer Group **Group A**, tick **Is Enabled?** → **Save**. AP-2474 says Save redirects to the assignment details page titled "Earning Assignment {description}".

**Telling rows apart.** Every parameter a case creates has its own **Coverage odometer to** value: `1000NN`, where `NN` is the case number (AP2475_003 uses `100003`). A case that needs two rows appends 1 and 2 to `1000N` instead (AP2475_005 uses `100051` and `100052`). Find "your" row by that number.

**Baseline parameter values (P1)**, used wherever a step says "with the P1 values": Condition **New** · Coverage Code **first option in the list** · Sale Date from **2026-01-01** · Sale Date to **2026-12-31** · Coverage odometer from **0** · Coverage odometer to **1000NN** · Model Year Age from **0** · Model Year Age to **5** · Make **first option in the list** · Lag Interval **0** · Earning Group **AV+**. Write down the actual Coverage Code and Make names the first time you choose them.

**Changed values (P2)**, used wherever a step says "change to the P2 values": Condition **Used** · Coverage Code **second option** · Sale Date from **2025-01-01** · Sale Date to **2025-12-31** · Coverage odometer from **1000** · Coverage odometer to **2000NN** · Model Year Age from **1** · Model Year Age to **10** · Make **second option** · Lag Interval **12** · Earning Group **any option other than AV+**.

**AP-2476 watch.** AP-2476 (fields optional, "All" placeholder) was not deployed on 2026-10-04. If the Add/Edit form already shows "All" placeholders, note it in the log. No case below depends on which fields are required.

**Known blockers:** None. Every case depends on the AP-2474 Add Parameter flow, which is in QC. If it fails during a `[Pre-Condition]`, record that case **BLOCKED** (not FAIL) and name the AP-2474 step that failed.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2475_001 | Each parameter row on an earning assignment shows a pencil "edit" icon in its Actions column | Functional | Medium | PASS |
| AP2475_002 | Clicking the pencil opens an edit dialog already filled with every current value of that parameter | Functional | High | PASS |
| AP2475_003 | Changing every field and saving updates the same parameter row instead of adding a new one | Functional | High | PASS |
| AP2475_004 | Changing only Lag Interval and Make keeps the other nine fields as they were, after a page reload | Functional | High | PASS |
| AP2475_005 | Editing one of two parameters leaves the other parameter row exactly as it was | Edge-case | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2475_001 — Each parameter row on an earning assignment shows a pencil "edit" icon in its Actions column

| Field | Value |
|---|---|
| **TC ID** | AP2475_001 |
| **Title** | Each parameter row on an earning assignment shows a pencil "edit" icon in its Actions column |
| **Requirement** | AP2475 — REQ-001 (AC 1) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Pencil icon (fal fa-pen) shown next to the trash can on every parameter row; it has no tooltip or accessible name. |

**Why this matters:** The pencil is the only way into the edit feature. Without it, an admin who made a mistake in a parameter has to delete it and add it again.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | P1 values, Coverage odometer to `100001` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to `/admin/login` as the admin. Open the `QA-AP2475-…` assignment from `/admin/earning-assignment` → **View** if it exists in this run; otherwise create it as described in the Execution Context (Description `QA-AP2475-<HHMMSS>`, Earning Set "Profit", Dealer Group "Group A", "Is Enabled?" ticked → **Save**). | The details page opens with the title "Earning Assignment QA-AP2475-…", the nav items "Edit" and "Add Parameter", and a parameter datagrid. |
| 2 | [Pre-Condition] Click **Add Parameter**, fill the P1 values with Coverage odometer to `100001` → **Submit**. | The dialog closes and a row with odometer `0 - 100001` appears in the parameter datagrid. |
| 3 | [Verification] Look at the Actions column of the `100001` row, and of every other row in the datagrid. | Every row's Actions column shows a pencil icon (accessible name or tooltip "Edit" or similar) next to the trash-can (Unassign) icon. |

---

### AP2475_002 — Clicking the pencil opens an edit dialog already filled with every current value of that parameter

| Field | Value |
|---|---|
| **TC ID** | AP2475_002 |
| **Title** | Clicking the pencil opens an edit dialog already filled with every current value of that parameter |
| **Requirement** | AP2475 — REQ-002 (AC 1); pre-filling per Q-001 |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | "Edit Parameter" modal opened pre-filled with all 11 stored P1 values; same field set as Add Parameter. |

**Why this matters:** If the dialog opens blank or on default values, an admin who changes one field and saves will silently reset the other ten. That changes which earning group, and so which earning curve, applies to contracts. The ticket does not say "pre-filled" in words (Q-001), but an edit form that does not show the current values cannot be used safely.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | P1 values, Coverage odometer to `100002` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2475-…` assignment details page (create it if absent, as in the Execution Context). | The details page with the parameter datagrid is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, fill the P1 values with Coverage odometer to `100002` → **Submit**. Note the Coverage Code and Make names chosen. | A row with odometer `0 - 100002` appears in the datagrid. |
| 3 | Click the pencil icon on the `100002` row. | A modal dialog opens over the details page. Record its title and the browser URL. |
| 4 | [Verification] Read every field in the dialog. | The dialog shows the same fields as the Add Parameter form (Condition, Coverage Code, Sale Date from, Sale Date to, Coverage odometer from, Coverage odometer to, Model Year Age from, Model Year Age to, Make, Lag Interval, Earning Group) and each one holds the P1 value: New · noted Coverage Code · 2026-01-01 · 2026-12-31 · 0 · 100002 · 0 · 5 · noted Make · 0 · AV+. Any missing or extra field is recorded. |

---

### AP2475_003 — Changing every field and saving updates the same parameter row instead of adding a new one

| Field | Value |
|---|---|
| **TC ID** | AP2475_003 |
| **Title** | Changing every field and saving updates the same parameter row instead of adding a new one |
| **Requirement** | AP2475 — REQ-003 (AC 1, user-story minimum) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | All 11 fields changed to P2 and saved ("Parameter saved"); same row (parameter 4) updated in place, row count stayed 3. |

**Why this matters:** An edit that saves as a new row leaves the old rule in force. Both rules would then match the same contracts, which is worse than no edit at all.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | P1 values, Coverage odometer to `100003` |
| Parameter after | P2 values, Coverage odometer to `200003` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin, open the `QA-AP2475-…` assignment details page (create it if absent), click **Add Parameter**, fill the P1 values with Coverage odometer to `100003` → **Submit**. Count the rows in the datagrid. | A row with odometer `0 - 100003` is listed. Row count noted (N). |
| 2 | Click the pencil icon on the `100003` row. | The edit dialog opens, filled with the P1 values. |
| 3 | Change every field to the P2 values (Condition "Used", second Coverage Code, Sale Date 2025-01-01 to 2025-12-31, odometer 1000 to `200003`, Model Year Age 1 to 10, second Make, Lag Interval 12, an Earning Group other than AV+) and click the dialog's save/submit button. | The dialog closes without an error and without an HTTP 500 page. Record the message shown and the page the browser lands on (Q-003). |
| 4 | [Verification] Read the datagrid. | The row count is still N. One row shows the P2 values (Used · second Coverage Code · 2025-01-01 - 2025-12-31 · 1000 - 200003 · 1 - 10 · second Make · 12 · the chosen Earning Group). No row with `100003` remains. |

---

### AP2475_004 — Changing only Lag Interval and Make keeps the other nine fields as they were, after a page reload

| Field | Value |
|---|---|
| **TC ID** | AP2475_004 |
| **Title** | Changing only Lag Interval and Make keeps the other nine fields as they were, after a page reload |
| **Requirement** | AP2475 — REQ-003 (AC 1); REQ-002 pre-filling |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | After reload, row and dialog show Lag 6 and Make Adventurer; the other nine fields kept their P1 values. |

**Why this matters:** A partial edit is the common case: an admin fixes one wrong value. If the date pickers or numeric fields drop their values on save, the row silently changes in ways the admin never chose.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | P1 values, Coverage odometer to `100004` |
| Changed fields | Lag Interval `0` → `6`; Make first option → second option |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin, open the `QA-AP2475-…` assignment details page (create it if absent), click **Add Parameter**, fill the P1 values with Coverage odometer to `100004` → **Submit**. | A row with odometer `0 - 100004`, Lag Interval 0 and the first Make is listed. |
| 2 | Click the pencil icon on the `100004` row, change **Lag Interval** to `6` and **Make** to the second option, leave every other field untouched, and save. | The dialog closes without an error. |
| 3 | Reload the details page (F5). | The page reloads and the `100004` row is still listed. |
| 4 | [Verification] Read the `100004` row, then click its pencil icon and read the dialog. | The row and the dialog both show Lag Interval **6** and the **second** Make. All nine other fields keep their P1 values: New · same Coverage Code · 2026-01-01 · 2026-12-31 · 0 · 100004 · 0 · 5 · AV+. |

---

### AP2475_005 — Editing one of two parameters leaves the other parameter row exactly as it was

| Field | Value |
|---|---|
| **TC ID** | AP2475_005 |
| **Title** | Editing one of two parameters leaves the other parameter row exactly as it was |
| **Requirement** | AP2475 — REQ-003 (AC 1) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Pencil on row B loaded parameter 7 (100052); only row B changed to Model Year Age 0 - 8, row A kept 0 - 5. |

**Why this matters:** If the edit dialog picks up the wrong record ID (for example, always the first row), editing row B would overwrite row A. That is a common defect in list-plus-modal screens.

**Test Data:**

| Variable | Value |
|---|---|
| Row A | P1 values, Coverage odometer to `100051` |
| Row B | P1 values, Coverage odometer to `100052` |
| Row B change | Model Year Age to `5` → `8` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2475-…` assignment details page (create it if absent). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter** and submit the P1 values with Coverage odometer to `100051` (row A). Then click **Add Parameter** again and submit the P1 values with Coverage odometer to `100052` (row B). | Two rows, `0 - 100051` and `0 - 100052`, are listed. |
| 3 | Click the pencil icon on row **B** (`100052`). | The dialog opens showing Coverage odometer to `100052`, not `100051`. |
| 4 | Change **Model Year Age to** to `8` and save. | The dialog closes without an error. |
| 5 | [Verification] Read both rows. | Row B (`100052`) shows Model Year Age `0 - 8`. Row A (`100051`) still shows Model Year Age `0 - 5` and all its other P1 values. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Pencil icon in the Actions column | AP2475_001 | — | — | AP2475_009 |
| REQ-002 — Pencil opens the edit modal, pre-filled | AP2475_002, AP2475_004 | — | AP2475_005, AP2475_008 | — |
| REQ-003 — Changes saved to the same row and kept | AP2475_003, AP2475_004 | AP2475_006, AP2475_007 | AP2475_005, AP2475_010 | AP2475_009 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2475_001 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_001-step3-PencilIconInActions_pass.png` |
| AP2475_002 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_002-step4-EditDialogPrefilled_pass.png` |
| AP2475_003 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_003-step4-RowUpdatedToP2_pass.png` |
| AP2475_004 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_004-step4-PartialEditKeptAfterReload_pass.png` |
| AP2475_005 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_005-step5-RowBEditedRowAUnchanged_pass.png` |

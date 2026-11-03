# Test Cases — AP2487 (File 1 of 3)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2487 — Earning assignments parameter: Add warranty start date range and Make Coverage Code multiple choices
**Source:** requirements/AP-2487-earning-assignments-parameter-warranty-start-date.md · qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2487_test-plan.md
**Date:** 2026-10-12
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2487_001 to AP2487_005 (5 test cases)
**Coverage:** Functional · UI · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` — Earning Assignments list (newest first, 10 per page). Create form `/admin/earning-assignment/new/edit` (modal); details page `/admin/earning-assignment/{id}/details` with nav items **Edit** and **Add Parameter**. Add Parameter opens a modal (`#myModal`, loaded by AJAX — wait for the label "Coverage odometer from"). The pencil icon in a row's Actions opens `/admin/earning-assignment/{id}/parameter/{paramId}/edit` in the same modal. Navigate by URL — the Risk Management fly-out closes on every page load. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Read-only reference data: earning set **Profit**, dealer group **Group A**, Coverage Codes **AP-CADV - Advanced** (first in the list) and **AFPP - AFPP** (second), Lag Interval **0**. **Never save the seeded "AV+" assignment (#1) or its parameter** — AP2487_010 only opens it. | `test-data`, `domain` |
| **Form widgets** | 13 fields, ids `earning_assignment_parameter_{field}`. New fields: **Start date from** (`…_warrantyStartDateFrom`) and **Start date To** (`…_warrantyStartDateTo`) — type `yyyy-mm-dd`. **Coverage Code** (`…_coverageCodes`, name `coverageCodes[]`) is a Bootstrap multi-select with a search box and **Select All / Deselect All**; with nothing ticked its button reads "All". Playwright: `selectOption('#earning_assignment_parameter_coverageCodes', [{label:'AP-CADV - Advanced'},{label:'AFPP - AFPP'}])` ticks two codes; `selectOption(…, [])` clears them. Sale Date from/to are text boxes with a date picker (hint "All"). Submit button **Submit**; there is no Cancel — Escape closes the modal. | `domain` (risk-management.md, "after AP-2476") |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | One or two earning assignments `QA-AP2487-<HHMMSS>` (assignments cannot be deleted) and up to 12 parameter rows on them. They stay on staging as evidence unless unassigned after the run. | `cleanup` (missing) |

**Shared assignment.** Step 1 of each case says: *use the `QA-AP2487-…` assignment created earlier in this run if it exists and holds fewer than 9 parameters; otherwise create one.* Creating it: open `/admin/earning-assignment/new/edit`, enter Description `QA-AP2487-<HHMMSS>` (24-hour time at creation), Earning Set **Profit**, Dealer Group **Group A**, leave **Is Enabled?** ticked → **Save**. The details page "Earning Assignment QA-AP2487-…" opens with the alert "Earning assignment saved". **Keep it at 10 parameters or fewer** — past 10 the details page returns HTTP 500 (known bug AP-2484). This run needs about 12 rows, so expect to create a second assignment part-way.

**Telling rows apart.** Every parameter a case saves has its own **Coverage odometer to** value `2487NN`, where `NN` is the case number (AP2487_002 uses `248702`). Where a case saves two rows, the second uses `2487NN` + 50 (AP2487_005 uses `248705` and `248755`).

**Base values (B)**, used wherever a step says "with the B values": leave Condition, Coverage Code, Sale Date from, Sale Date to, Make and Earning Group on **All**; Coverage odometer from **0** · Coverage odometer to **2487NN** · Model Year Age from **0** · Model Year Age to **5** · Lag Interval **0**. The step then names only the start dates or coverage codes it changes.

**Build check.** Before AP2487_001, open Add Parameter once. If there is no **Start date from** field, the AP-2487 build is not on staging. Stop the run and record every case **BLOCKED — build not deployed** rather than FAIL.

**Known blockers:** None at design time. Open questions Q-002 (reversed range), Q-003 (empty Start date column) and Q-004 (several codes in the grid) change only how a result is judged; each affected case says how.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2487_001 | The parameter form shows optional "Start date from" and "Start date To" date fields right after "Sale Date to" | UI | High | PASS |
| AP2487_002 | A parameter saved with both start dates shows that range in the list's "Start date" column | Functional | High | PASS |
| AP2487_003 | Editing a parameter shows its stored start dates, and changed dates replace the old ones | Functional | High | PASS |
| AP2487_004 | Clearing both start dates on Edit removes the range from the parameter | Edge-case | Medium | PASS |
| AP2487_005 | A parameter saves with only "Start date from" or only "Start date To" filled, as an open-ended range | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2487_001 — The parameter form shows optional "Start date from" and "Start date To" date fields right after "Sale Date to"

| Field | Value |
|---|---|
| **TC ID** | AP2487_001 |
| **Title** | The parameter form shows optional "Start date from" and "Start date To" date fields right after "Sale Date to" |
| **Requirement** | AP2487 — REQ-001 (AC 1–4) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | UI |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Start date from / Start date To sit right after Sale Date to, no * or required, empty; gijgo date picker |
| **Blocked by** | — |

**Why this matters:** The ticket fixes where the fields go and that both are optional date fields. A field in the wrong place is easily confused with Sale Date; a field marked required would force admins to restrict every rule by warranty start date.

**Test Data:**

| Variable | Value |
|---|---|
| None | The form is only opened, not submitted |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to `/admin/login` as the admin. Open the `QA-AP2487-…` assignment from `/admin/earning-assignment` → **View** if it exists in this run; otherwise create it as described in the Execution Context (Description `QA-AP2487-<HHMMSS>`, Earning Set "Profit", Dealer Group "Group A", "Is Enabled?" ticked → **Save**). | The details page opens with the title "Earning Assignment QA-AP2487-…" and the nav items "Edit" and "Add Parameter". |
| 2 | Click **Add Parameter** and wait for the label "Coverage odometer from". | The "Add Parameter" dialog opens with a **Submit** button. |
| 3 | Click into the **Start date from** box, then into the **Start date To** box. | Each box accepts a date; a date picker opens (as for Sale Date), or the box is a browser date input. Record which. |
| 4 | [Verification] Read the field labels in on-screen order, and for the two new fields read the label text, whether a red `*` is shown, the `required` attribute and the starting value. | The labels "Start date from" and "Start date To" appear immediately after "Sale Date to" and before "Coverage odometer from". Neither shows a `*` nor carries `required`, and both start empty. |

---

### AP2487_002 — A parameter saved with both start dates shows that range in the list's "Start date" column

| Field | Value |
|---|---|
| **TC ID** | AP2487_002 |
| **Title** | A parameter saved with both start dates shows that range in the list's "Start date" column |
| **Requirement** | AP2487 — REQ-001 (AC 1, adding), REQ-002 |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Grid Start date shows 2026-01-01 - 2026-12-31; Sale Date still All (param 28) |
| **Blocked by** | — |

**Why this matters:** This is the core of the ticket: the range must be stored against the parameter and visible in the list. If the dates are lost, or land in the Sale Date column instead, the rule matches the wrong contracts.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248702` |
| Start date from / To | `2026-01-01` / `2026-12-31` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). Note the column headings of the parameter list. | The details page is shown; the list headings include "Start date". |
| 2 | Click **Add Parameter**. Fill the B values with Coverage odometer to `248702`, and type Start date from `2026-01-01` and Start date To `2026-12-31` → **Submit**. | The dialog closes without a validation message or an error page. |
| 3 | [Verification] Read the alert, then find the row with Coverage odometer `0 - 248702` and read its "Start date" and "Sale Date" cells. | The green alert "Parameter added" is shown. The `0 - 248702` row's "Start date" cell shows the range `2026-01-01 - 2026-12-31` (the same `from - to` style as Sale Date — record the exact format), and its "Sale Date" cell still shows "All". |

---

### AP2487_003 — Editing a parameter shows its stored start dates, and changed dates replace the old ones

| Field | Value |
|---|---|
| **TC ID** | AP2487_003 |
| **Title** | Editing a parameter shows its stored start dates, and changed dates replace the old ones |
| **Requirement** | AP2487 — REQ-001 (AC 1, editing), REQ-002 |
| **Route** | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` — Edit Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Edit pre-filled 2026-01-01/2026-06-30; new range 2026-02-01 - 2026-09-30 kept after reload (param 29) |
| **Blocked by** | — |

**Why this matters:** An admin who opens a rule to check or adjust it must see the dates it really holds. If the Edit form opens empty, saving it for any other change silently wipes the range.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248703` |
| Start dates before | `2026-01-01` / `2026-06-30` |
| Start dates after | `2026-02-01` / `2026-09-30` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, fill the B values with Coverage odometer to `248703`, Start date from `2026-01-01`, Start date To `2026-06-30` → **Submit**. | Alert "Parameter added"; a row `0 - 248703` shows Start date `2026-01-01 - 2026-06-30`. |
| 3 | Click the pencil icon on the `0 - 248703` row and wait for the label "Coverage odometer from". Read the two start date boxes, then replace them with `2026-02-01` and `2026-09-30` → **Submit**. | The Edit dialog opens with Start date from `2026-01-01` and Start date To `2026-06-30` already filled in. After Submit it closes without an error. |
| 4 | [Verification] Read the alert and the `0 - 248703` row, then reload the page and read the row again. | The alert "Parameter saved" is shown and the row count is unchanged. After the reload, the `0 - 248703` row shows Start date `2026-02-01 - 2026-09-30` and no longer shows the old dates. |

---

### AP2487_004 — Clearing both start dates on Edit removes the range from the parameter

| Field | Value |
|---|---|
| **TC ID** | AP2487_004 |
| **Title** | Clearing both start dates on Edit removes the range from the parameter |
| **Requirement** | AP2487 — REQ-001 (AC 3–4, optional), REQ-002 |
| **Route** | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` — Edit Parameter modal |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Cleared dates saved; grid Start date blank (Q-003), Edit boxes empty (param 30) |
| **Blocked by** | — |

**Why this matters:** Both fields are optional, so an admin must be able to widen a rule again by removing its range. If clearing is refused or the old dates are kept, the rule can only be fixed by deleting and re-creating it.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248704` |
| Start dates before | `2026-03-01` / `2026-03-31` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, fill the B values with Coverage odometer to `248704`, Start date from `2026-03-01`, Start date To `2026-03-31` → **Submit**. | Alert "Parameter added"; a row `0 - 248704` shows Start date `2026-03-01 - 2026-03-31`. |
| 3 | Click the pencil icon on the `0 - 248704` row, clear the **Start date from** and **Start date To** boxes → **Submit**. | The dialog closes without a validation message or an error page. |
| 4 | [Verification] Read the alert, reload the page, read the `0 - 248704` row's "Start date" cell, then open its pencil icon and read the two start date boxes (close with Escape). | The alert "Parameter saved" is shown. After the reload the "Start date" cell no longer shows `2026-03-01` or `2026-03-31` — record whether it is blank or "All" for Q-003. The Edit dialog shows both start date boxes empty. |

---

### AP2487_005 — A parameter saves with only "Start date from" or only "Start date To" filled, as an open-ended range

| Field | Value |
|---|---|
| **TC ID** | AP2487_005 |
| **Title** | A parameter saves with only "Start date from" or only "Start date To" filled, as an open-ended range |
| **Requirement** | AP2487 — REQ-001 (AC 3–4), REQ-002 |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Half ranges saved: "2026-04-01 -" and "- 2026-04-30" (no "All" for the open side) (params 33, 32) |
| **Blocked by** | — |

**Why this matters:** The ticket makes each date optional on its own, which allows "every warranty starting on or after a date" and "every warranty starting on or before a date". If one half is refused or silently copied into the other, those rules cannot be created.

**Test Data:**

| Variable | Value |
|---|---|
| Row A | B values, Coverage odometer to `248705`, Start date from `2026-04-01`, Start date To empty |
| Row B | B values, Coverage odometer to `248755`, Start date from empty, Start date To `2026-04-30` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context; it needs room for 2 more rows). | The details page is shown. |
| 2 | Click **Add Parameter**, fill the B values with Coverage odometer to `248705` and Start date from `2026-04-01`, leave Start date To empty → **Submit**. | Alert "Parameter added"; no validation message or error page. |
| 3 | Click **Add Parameter**, fill the B values with Coverage odometer to `248755` and Start date To `2026-04-30`, leave Start date from empty → **Submit**. | Alert "Parameter added"; no validation message or error page. |
| 4 | [Verification] Read the "Start date" cells of the `0 - 248705` and `0 - 248755` rows. | Row `0 - 248705` shows `2026-04-01` as the start with an open end (for example `2026-04-01 - All`, matching how Sale Date shows a half range). Row `0 - 248755` shows an open start with `2026-04-30` as the end. Neither row shows a date the admin did not enter. Record the exact text. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Warranty start date range on the form | AP2487_001, AP2487_002, AP2487_003 | AP2487_006, AP2487_007 (file 2) | AP2487_004, AP2487_005 | AP2487_011 (file 3) |
| REQ-002 — "Start date" datagrid column | AP2487_002, AP2487_003 | — | AP2487_004, AP2487_005 | — |
| REQ-003 — Multiple Coverage Codes | AP2487_008, AP2487_009 (file 2) | — | AP2487_012 (file 3) | AP2487_010 (file 2), AP2487_011 (file 3) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2487_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_001-step4-StartDateFieldsAfterSaleDate_pass.png` |
| AP2487_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_002-step3-StartDateRangeInGrid_pass.png` |
| AP2487_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_003-step4-EditedStartDatesAfterReload_pass.png` |
| AP2487_004 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_004-step4-ClearedStartDatesEditEmpty_pass.png` |
| AP2487_005 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_005-step4-OpenEndedStartDateRows_pass.png` |

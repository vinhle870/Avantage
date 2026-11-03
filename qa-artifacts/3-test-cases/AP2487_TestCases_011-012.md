# Test Cases — AP2487 (File 3 of 3)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2487 — Earning assignments parameter: Add warranty start date range and Make Coverage Code multiple choices
**Source:** requirements/AP-2487-earning-assignments-parameter-warranty-start-date.md · qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2487_test-plan.md
**Date:** 2026-10-12
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2487_011 to AP2487_012 (2 test cases)
**Coverage:** Regression · Edge-case

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
| AP2487_011 | A parameter with no start dates and no coverage code still saves and shows "All", as before this change | Regression | Medium | PASS |
| AP2487_012 | Ticking every coverage code with "Select All" saves the parameter and lists it without an error | Edge-case | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2487_011 — A parameter with no start dates and no coverage code still saves and shows "All", as before this change

| Field | Value |
|---|---|
| **TC ID** | AP2487_011 |
| **Title** | A parameter with no start dates and no coverage code still saves and shows "All", as before this change |
| **Requirement** | AP2487 — REQ-001, REQ-003 (regression of AP-2476) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Blank Model Year Age refused cleanly; empty-optional row saves with "All" and blank Start date (param 38) |
| **Blocked by** | — |

**Why this matters:** AP-2476 made the matching fields optional so one rule can cover everything. The two new fields and the new multi-select must not bring back a "This value should not be blank." refusal, and the required fields must still refuse a blank cleanly rather than with an error page.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248711`, both start dates empty, no coverage code ticked |
| Negative check | Model Year Age to left blank |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). Note the number of parameter rows. | The details page is shown. |
| 2 | Click **Add Parameter**, fill the B values with Coverage odometer to `248711` but **clear Model Year Age to** → **Submit**. | The message "This value should not be blank." appears at Model Year Age to (the page may move to the standalone `/parameter/add` page with the other values kept). No HTTP 500. Nothing is saved. |
| 3 | Type `5` in **Model Year Age to**; leave both start dates empty and no coverage code ticked → **Submit**. | The form is accepted; the details page shows the alert "Parameter added". |
| 4 | [Verification] Read the `0 - 248711` row and count the rows. | Exactly one `0 - 248711` row exists (the refused attempt did not create one). Its Condition, Coverage Code, Sale Date, Make and Earning Group cells show "All"; its "Start date" cell shows no date (record blank or "All" for Q-003). |

---

### AP2487_012 — Ticking every coverage code with "Select All" saves the parameter and lists it without an error

| Field | Value |
|---|---|
| **TC ID** | AP2487_012 |
| **Title** | Ticking every coverage code with "Select All" saves the parameter and lists it without an error |
| **Requirement** | AP2487 — REQ-003 (Q-005) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Select All saved 57/57 codes; grid lists all 57 (Q-005), Edit has 57 ticked (assignment #17, param 39) |
| **Blocked by** | — |

**Why this matters:** "Select All" stores about 50 codes in one rule — the largest value the field can hold. If the save or the list breaks at that size, admins get an error page with no hint why. Whether "every code" means the same as "All" is not stated (Q-005), so the case records how it is shown rather than judging it.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248712`, every coverage code ticked |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | Click **Add Parameter**, open **Coverage Code** and click **Select All**; note the number of codes ticked (count of `#earning_assignment_parameter_coverageCodes option:checked`). Fill the rest of the B values with Coverage odometer to `248712` → **Submit**. | Every code is ticked and the button shows a count or "All selected". After Submit, the alert "Parameter added" is shown; no HTTP 500. |
| 3 | [Verification] Reload the details page, read the `0 - 248712` row's "Coverage Code" cell, then open its pencil icon and count the ticked codes (close with Escape). | The page loads without an error. The cell shows either every code or a summary (for example "All") — record which, for Q-005. The Edit dialog has the same number of codes ticked as noted in step 2. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Warranty start date range on the form | AP2487_001–003 (file 1) | AP2487_006, AP2487_007 (file 2) | AP2487_004, AP2487_005 (file 1) | AP2487_011 |
| REQ-002 — "Start date" datagrid column | AP2487_002, AP2487_003 (file 1) | AP2487_006 (file 2) | AP2487_004, AP2487_005 (file 1) | AP2487_011 |
| REQ-003 — Multiple Coverage Codes | AP2487_008, AP2487_009 (file 2) | — | AP2487_012 | AP2487_010 (file 2), AP2487_011 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2487_011 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_011-step4-EmptyOptionalRowShowsAll_pass.png` |
| AP2487_012 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_012-step3-GridListsEveryCode_pass.png` |

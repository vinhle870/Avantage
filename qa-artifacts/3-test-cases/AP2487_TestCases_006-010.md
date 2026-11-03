# Test Cases — AP2487 (File 2 of 3)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2487 — Earning assignments parameter: Add warranty start date range and Make Coverage Code multiple choices
**Source:** requirements/AP-2487-earning-assignments-parameter-warranty-start-date.md · qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2487_test-plan.md
**Date:** 2026-10-12
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2487_006 to AP2487_010 (5 test cases)
**Coverage:** Functional · Negative · Regression

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
| AP2487_006 | A start date range whose "from" is later than its "to" is refused or saved cleanly, never an error page | Negative | Medium | PASS |
| AP2487_007 | Typing text that is not a date into "Start date from" does not save a wrong date or show an error page | Negative | Low | PASS |
| AP2487_008 | A parameter saved with two coverage codes keeps both, in the list and when reopened for Edit | Functional | High | PASS |
| AP2487_009 | Adding and removing coverage codes on Edit saves exactly the newly ticked codes | Functional | Medium | PASS |
| AP2487_010 | A parameter saved before this change still shows its single coverage code ticked when opened for Edit | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2487_006 — A start date range whose "from" is later than its "to" is refused or saved cleanly, never an error page

| Field | Value |
|---|---|
| **TC ID** | AP2487_006 |
| **Title** | A start date range whose "from" is later than its "to" is refused or saved cleanly, never an error page |
| **Requirement** | AP2487 — REQ-001 (Q-002) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Q-002: reversed range saved silently as entered, 2026-12-31 - 2026-01-01; no error page (param 34) |
| **Blocked by** | — |

**Why this matters:** A reversed range can never match a contract, so a rule saved that way silently does nothing. The ticket does not say whether it must be refused (Q-002), and the odometer range on this same form has no such check (observed 2026-10-04). This case therefore fails only on an error page or a changed value; whether a silent save is acceptable is left to the product owner.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248706` |
| Start date from / To | `2026-12-31` / `2026-01-01` (reversed) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). Note the number of parameter rows. | The details page is shown. |
| 2 | Click **Add Parameter**, fill the B values with Coverage odometer to `248706`, Start date from `2026-12-31` and Start date To `2026-01-01` → **Submit**. | Either a validation message about the date range is shown and nothing is saved, or the dialog closes with the alert "Parameter added". No HTTP 500 or other error page. |
| 3 | [Verification] Read the page. If saved, read the `0 - 248706` row's "Start date" cell; if refused, read the message and confirm the row count is unchanged. | **Refused:** a clear message names the start date range, the other values are kept, and no `0 - 248706` row exists. **Saved:** the row shows `2026-12-31 - 2026-01-01` exactly as entered (dates not swapped or dropped). Record which outcome occurred, for Q-002. |

---

### AP2487_007 — Typing text that is not a date into "Start date from" does not save a wrong date or show an error page

| Field | Value |
|---|---|
| **TC ID** | AP2487_007 |
| **Title** | Typing text that is not a date into "Start date from" does not save a wrong date or show an error page |
| **Requirement** | AP2487 — REQ-001 (AC 3, "Date field") |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Low |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — "abc" refused with "This value is not valid." on Start date from; nothing saved |
| **Blocked by** | — |

**Why this matters:** "Date field" means only a date should be stored. If free text is accepted and turned into a made-up date (such as `1970-01-01`), the rule applies to the wrong warranties without anyone noticing.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248707` |
| Start date from | `abc` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). Note the number of parameter rows. | The details page is shown. |
| 2 | Click **Add Parameter**, fill the B values with Coverage odometer to `248707`, type `abc` into **Start date from**, leave Start date To empty → **Submit**. | The box either refuses the letters (stays empty) or the form shows a validation message. No HTTP 500 or other error page. |
| 3 | [Verification] Read the page. If a `0 - 248707` row was saved, read its "Start date" cell. | One of: a clear validation message on Start date from with nothing saved; or the row saved with an empty start date. The "Start date" cell never shows `abc` or a date nobody entered (for example `1970-01-01` or today's date). Record which outcome occurred. |

---

### AP2487_008 — A parameter saved with two coverage codes keeps both, in the list and when reopened for Edit

| Field | Value |
|---|---|
| **TC ID** | AP2487_008 |
| **Title** | A parameter saved with two coverage codes keeps both, in the list and when reopened for Edit |
| **Requirement** | AP2487 — REQ-003 |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal; pencil → Edit Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Both codes stored; grid lists one per line (Q-004); Edit ticks exactly the two (param 36) |
| **Blocked by** | — |

**Why this matters:** Selecting several codes is only useful if every one is stored. If only the first is kept, contracts on the other codes get no earning curve, and the admin cannot see it unless the list and the Edit form show every code.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248708` |
| Coverage Codes | `AP-CADV - Advanced` and `AFPP - AFPP` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | Click **Add Parameter**. Open **Coverage Code** and tick "AP-CADV - Advanced" and "AFPP - AFPP" (use the search box if needed), close the list by clicking the dialog title, fill the rest of the B values with Coverage odometer to `248708` → **Submit**. | Both codes stay ticked while the list is open (ticking the second does not untick the first); the button then shows both codes or "2 items selected". After Submit, the alert "Parameter added" is shown. |
| 3 | Read the `0 - 248708` row's "Coverage Code" cell. | The cell lists both AP-CADV and AFPP (record the exact format for Q-004). |
| 4 | [Verification] Click the pencil icon on the `0 - 248708` row, open **Coverage Code** and read which items are ticked; close with Escape without saving. | Exactly "AP-CADV - Advanced" and "AFPP - AFPP" are ticked, and no other code. |

---

### AP2487_009 — Adding and removing coverage codes on Edit saves exactly the newly ticked codes

| Field | Value |
|---|---|
| **TC ID** | AP2487_009 |
| **Title** | Adding and removing coverage codes on Edit saves exactly the newly ticked codes |
| **Requirement** | AP2487 — REQ-003 |
| **Route** | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` — Edit Parameter modal |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — AP-CADV removed; AFPP + AFPPAVN stored exactly, in grid and Edit (param 37) |
| **Blocked by** | — |

**Why this matters:** Admins adjust rules over time. If un-ticking a code on Edit leaves it stored, or a newly ticked code is ignored, the rule covers programs it should not, or misses ones it should.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | B values, Coverage odometer to `248709` |
| Codes before | `AP-CADV - Advanced` |
| Codes after | `AFPP - AFPP` plus the third code in the list (record its label) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2487-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, tick only "AP-CADV - Advanced" in **Coverage Code**, fill the rest of the B values with Coverage odometer to `248709` → **Submit**. | Alert "Parameter added"; the `0 - 248709` row shows AP-CADV only. |
| 3 | Click the pencil icon on the `0 - 248709` row. In **Coverage Code** un-tick "AP-CADV - Advanced", tick "AFPP - AFPP" and the third code in the list (note its label) → **Submit**. | The dialog closes with the alert "Parameter saved" and no error page. |
| 4 | [Verification] Reload the page, read the `0 - 248709` row's "Coverage Code" cell, then open its pencil icon and read the ticked codes (close with Escape). | The cell lists AFPP and the third code, and no longer lists AP-CADV. The Edit dialog has exactly those two codes ticked. |

---

### AP2487_010 — A parameter saved before this change still shows its single coverage code ticked when opened for Edit

| Field | Value |
|---|---|
| **TC ID** | AP2487_010 |
| **Title** | A parameter saved before this change still shows its single coverage code ticked when opened for Edit |
| **Requirement** | AP2487 — REQ-003 (regression) |
| **Route** | `/admin/earning-assignment/1/details` — seeded assignment "AV+" (read-only) |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-10-12 |
| **Result** | PASS — Seeded AX code ticked in the multi-select; closed with Escape; row unchanged |
| **Blocked by** | — |

**Why this matters:** Every rule created before this change holds one coverage code in the old single-code field. If the new multi-select opens them with nothing ticked ("All"), any admin who opens and saves such a rule silently widens it to every program. **This case must never press Submit** — the seeded rule is shared reference data.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | Seeded #1 "AV+" — read-only |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open `/admin/earning-assignment/1/details`. | The details page "Earning Assignment AV+" is shown with its parameter list. |
| 2 | Read the first parameter row's "Coverage Code" cell and note its value. | The cell shows a coverage code (not "All"). If it shows "All", record that the seeded row has no code and mark this case BLOCKED — no pre-change single-code row is available. |
| 3 | Click the pencil icon on that row, wait for "Coverage odometer from", open **Coverage Code** and read which items are ticked. Press **Escape** to close the dialog **without saving**. | The dialog opens; the code noted in step 2 is ticked and no other code is. |
| 4 | [Verification] Reload `/admin/earning-assignment/1/details` and read the same row again. | The row is unchanged — same Coverage Code and the same values as before step 3 — confirming nothing was saved. Together with step 3, the pre-change code is loaded into the multi-select. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Warranty start date range on the form | AP2487_001–003 (file 1) | AP2487_006, AP2487_007 | AP2487_004, AP2487_005 (file 1) | AP2487_011 (file 3) |
| REQ-002 — "Start date" datagrid column | AP2487_002, AP2487_003 (file 1) | AP2487_006 | AP2487_004, AP2487_005 (file 1) | — |
| REQ-003 — Multiple Coverage Codes | AP2487_008, AP2487_009 | — | AP2487_012 (file 3) | AP2487_010, AP2487_011 (file 3) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2487_006 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_006-step3-ReversedRangeSavedAsEntered_pass.png` |
| AP2487_007 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_007-step3-NotValidMessageOnStartDateFrom_pass.png` |
| AP2487_008 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_008-step4-EditShowsTwoCodesTicked_pass.png` |
| AP2487_009 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_009-step4-EditedCodesSavedExactly_pass.png` |
| AP2487_010 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/AP2487_010-step4-SeededRowUnchangedAfterReload_pass.png` |

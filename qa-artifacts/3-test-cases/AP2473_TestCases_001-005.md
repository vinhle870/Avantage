# Test Cases — AP2473 (File 1 of 2)

**Project:** Avantage Plus v2 — Admin portal, Risk Management
**Requirement:** AP2473 — Earning Sets
**Source:** requirements/AP-2473-earning-sets.md · qa-artifacts/1-requirements-analysis/AP-2473_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2473_test-plan.md
**Date:** 2026-10-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2473_001 to AP2473_005 (5 test cases)
**Coverage:** Functional · Negative · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/login`, then `/admin` (dashboard: "{user} Welcome to the admin"). Feature route `/admin/earning-set`, taken from the admin sidebar link "Earning Sets" in page snapshots captured 2026-10-02 (`screenshots/page-2026-10-02T16-19-32-867Z.yml`). It is not yet in `qa-docs/admin-portal.md`. | `navigation`, page snapshot |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Shared admin account from `execute.env.md` (Admin Portal row). The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | No seeded records are needed. Every earning set these cases use is created in a `[Pre-Condition]` or action step with a `QA-AP2473-<HHMMSS>` description, where `<HHMMSS>` is the time the step runs. | `test-data` (none needed) |
| **Language** | The admin portal after login, as shown. The ticket labels are English; if the page is in French, record the French label shown and do not fail the case for language alone. | `navigation` |
| **Leaves behind** | Each run creates 2–3 earning sets named `QA-AP2473-…` (AP2473_003, AP2473_004, AP2473_005 if blank is accepted). The ticket has no delete action and the `cleanup` source is `missing`, so they remain on staging. | `cleanup` (missing) |

**Known blockers** — None. The Save button label is not stated in the ticket (Q-003); the steps say "the form's save button (e.g. "Save")" and the executor records the actual label.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2473_001 | Admin menu shows "Earning Sets" under Risk Management, and clicking it opens the Earning Sets page | Functional | Medium | PASS |
| AP2473_002 | Earning Sets page shows its title, a "Create New" item and a grid with Description and Actions → Edit | Functional | Medium | PASS |
| AP2473_003 | Creating an earning set with a new description saves it, and it stays in the list after a reload | Functional | High | PASS |
| AP2473_004 | Editing an earning set opens it pre-filled, and a changed description replaces the old one in the list | Functional | High | PASS |
| AP2473_005 | Saving an earning set with a blank description is refused and no empty row is added to the list | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2473_001 — Admin menu shows "Earning Sets" under Risk Management, and clicking it opens the Earning Sets page

| Field | Value |
|---|---|
| **TC ID** | AP2473_001 |
| **Title** | Admin menu shows "Earning Sets" under Risk Management, and clicking it opens the Earning Sets page |
| **Requirement** | AP2473 — REQ-001 AC1, AC2 |
| **Route** | `/admin` → sidebar → `/admin/earning-set` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — "Earning Sets" is the 2nd of 4 items under Risk Management; it opens /admin/earning-set with heading "Earning Sets". |

**Why this matters:** The menu item is the only way an admin finds the feature. The ticket writes the label as "Earning sets" and "Earning Sets" in consecutive sentences, so either casing passes; record the exact label (Q-006).

**Test Data:**

| Variable | Value |
|---|---|
| Admin login | Shared admin account (`env`) |
| Expected section | Risk Management |
| Expected item | Earning Sets (either casing) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/admin/login`, enter the admin email in "Courriel" and the password in "Mot de passe", click "Se connecter" | The admin dashboard at `/admin` loads and shows "Welcome to the admin". |
| 2 | In the left sidebar, find the "Risk Management" section and expand it if it is collapsed | The Risk Management section shows its items, including an item labelled "Earning Sets" (or "Earning sets"). |
| 3 | Click "Earning Sets" | The browser goes to `/admin/earning-set` and a page loads without an error. |
| 4 | [Verification] Verify the sidebar shows "Earning Sets" inside "Risk Management", and the open page's heading reads "Earning Sets" | The menu item sits under Risk Management, and the page heading is "Earning Sets". The exact label casing is recorded. |

---

### AP2473_002 — Earning Sets page shows its title, a "Create New" item and a grid with Description and Actions → Edit

| Field | Value |
|---|---|
| **TC ID** | AP2473_002 |
| **Title** | Earning Sets page shows its title, a "Create New" item and a grid with Description and Actions → Edit |
| **Requirement** | AP2473 — REQ-002 AC1–AC4 |
| **Route** | `/admin/earning-set` — Earning Sets list |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Title "Earning Sets", one "Create New" item, columns Description and Actions; 3 earning-set rows (Reinsurance, Statutory, Profit), each with Edit. Q-001: rows are earning sets. |

**Why this matters:** The ticket says the grid lists "Earning Assignments". We expect it to list earning sets, matching the page title and the user story (Q-001). If the grid shows earning assignments instead, that is a FAIL against the title and story. If the grid is empty, the column headers alone are enough for this case; Edit is then checked in AP2473_004.

**Test Data:**

| Variable | Value |
|---|---|
| Expected title | Earning Sets |
| Expected nav item | Create New |
| Expected columns | Description, Actions |
| Expected row action | Edit |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account) and open `/admin/earning-set` | The Earning Sets page loads. |
| 2 | [Verification] Verify the navigation component's title reads "Earning Sets" and it offers exactly one nav item, "Create New" | The title "Earning Sets" and a "Create New" item are visible. Any extra nav item is recorded. |
| 3 | [Verification] Verify the grid's column headers are "Description" and "Actions", and record every other column shown | The grid shows the Description and Actions columns. Extra columns are recorded as observations. |
| 4 | [Verification] Verify each row's Actions cell offers "Edit", and the rows are earning sets (not earning assignments); record the row count or the empty-state message | Every row has an "Edit" action. The rows are earning sets. The row count or the empty-state text is recorded. |

---

### AP2473_003 — Creating an earning set with a new description saves it, and it stays in the list after a reload

| Field | Value |
|---|---|
| **TC ID** | AP2473_003 |
| **Title** | Creating an earning set with a new description saves it, and it stays in the list after a reload |
| **Requirement** | AP2473 — REQ-003 AC1, REQ-004 (user-story minimum) |
| **Route** | `/admin/earning-set` → "Create New" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Create New opens a dialog with one field "Description*" and a "Save" button; QA-AP2473-185830 saved (ID 4) with "Earning set saved" and listed once after reload. |

**Why this matters:** This is the user story itself: "I can create earning sets". The ticket names only a Description field (Q-002). If the form shows other fields, record them all. If one of them is required to save, fill it with its first available option, say so in the result, and still judge the case on whether the set is created.

**Test Data:**

| Variable | Value |
|---|---|
| Description | `QA-AP2473-<HHMMSS>` (e.g. `QA-AP2473-143015`) — record the exact value used |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account) and open `/admin/earning-set` | The Earning Sets list loads. |
| 2 | Click "Create New" | The earning set edit form opens (a new page or a dialog — record which, Q-008) with an empty "Description" field. Every field shown is recorded. |
| 3 | Type `QA-AP2473-<HHMMSS>` in "Description" and click the form's save button (e.g. "Save") | The form saves without an error. A success message (record its text) or a return to the list follows. |
| 4 | Open `/admin/earning-set` again and reload the page | The list loads again from the server. |
| 5 | [Verification] Verify a row with Description `QA-AP2473-<HHMMSS>` is in the grid, exactly once, with an "Edit" action | The new earning set is listed once with the exact description typed and an "Edit" action. |

---

### AP2473_004 — Editing an earning set opens it pre-filled, and a changed description replaces the old one in the list

| Field | Value |
|---|---|
| **TC ID** | AP2473_004 |
| **Title** | Editing an earning set opens it pre-filled, and a changed description replaces the old one in the list |
| **Requirement** | AP2473 — REQ-002 AC4, REQ-003 AC2, REQ-004 (user-story minimum) |
| **Route** | `/admin/earning-set` → row "Edit" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Edit opened dialog "Earning set #5" pre-filled; renamed to QA-AP2473-E-185855-edited in place; original gone, no second row. |

**Why this matters:** If Edit opens an empty form or another set's data, an admin could overwrite the wrong record. If the edit creates a second row instead of changing the first, the list fills with duplicates.

**Test Data:**

| Variable | Value |
|---|---|
| Original description | `QA-AP2473-E-<HHMMSS>` — created in step 1 |
| New description | `QA-AP2473-E-<HHMMSS>-edited` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account), open `/admin/earning-set`, click "Create New", type `QA-AP2473-E-<HHMMSS>` in "Description" and click the save button | The set `QA-AP2473-E-<HHMMSS>` is saved and listed on `/admin/earning-set`. |
| 2 | In the row `QA-AP2473-E-<HHMMSS>`, click "Edit" | The earning set edit form opens with "Description" pre-filled with `QA-AP2473-E-<HHMMSS>`. The URL (it should contain the set's ID) is recorded. |
| 3 | Replace the description with `QA-AP2473-E-<HHMMSS>-edited` and click the save button | The form saves without an error. |
| 4 | [Verification] Reload `/admin/earning-set` and verify the grid shows `QA-AP2473-E-<HHMMSS>-edited` once and no longer shows a row with only `QA-AP2473-E-<HHMMSS>` | The edited description appears once. The original description is gone, so the edit changed the record rather than adding a new one. |

---

### AP2473_005 — Saving an earning set with a blank description is refused and no empty row is added to the list

| Field | Value |
|---|---|
| **TC ID** | AP2473_005 |
| **Title** | Saving an earning set with a blank description is refused and no empty row is added to the list |
| **Requirement** | AP2473 — REQ-003 (validation, Q-004), REQ-004 |
| **Route** | `/admin/earning-set` → "Create New" |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Blank and three-space descriptions refused with "This value should not be blank."; row count stayed 5. |

**Why this matters:** A set with no description cannot be told apart from other sets in a grid whose only data column is Description. The ticket defines no validation (Q-004), so if the blank set **is** saved, record the outcome as FAIL with the note "no validation rule in the ticket — Q-004". The bug reporter will treat it as a question rather than a defect at Gate C.

**Test Data:**

| Variable | Value |
|---|---|
| Description | _(empty)_ |
| Description (whitespace variant) | three spaces `   ` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account), open `/admin/earning-set` and record the number of rows in the grid | The list loads. The row count is recorded. |
| 2 | Click "Create New", leave "Description" empty and click the save button | The save is refused. A message says the description is required (record the exact text), and the form stays open. |
| 3 | Type three spaces in "Description" and click the save button | The save is refused in the same way, because a description of only spaces is also blank. |
| 4 | [Verification] Open `/admin/earning-set` again and compare the grid with the row count from step 1 | The row count is unchanged and no row has an empty description. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Earning Sets under Risk Management; click opens page | AP2473_001 | — | — | AP2473_010 |
| REQ-002 — Title, Create New, Description / Actions → Edit grid | AP2473_002 | — | — | — |
| REQ-003 — Create New / Edit open the form with Description | AP2473_003, AP2473_004 | AP2473_005 | AP2473_006, AP2473_007, AP2473_008 | — |
| REQ-004 — Save (user-story minimum) | AP2473_003, AP2473_004 | AP2473_005 | AP2473_009 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_
>
> Run 2026-10-03, run folder 5.2.0. Full log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2473_2026-10-03.md`

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2473_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_001-step4-EarningSetsMenuAndHeading_pass.png` |
| AP2473_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_002-step4-RowsWithEditThreeSets_pass.png` |
| AP2473_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_003-step5-NewSetListedAfterReload_pass.png` |
| AP2473_004 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_004-step4-EditedDescriptionReplacesOld_pass.png` |
| AP2473_005 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_005-step4-RowCountUnchangedFive_pass.png` |

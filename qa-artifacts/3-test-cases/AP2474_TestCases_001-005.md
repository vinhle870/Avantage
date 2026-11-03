# Test Cases — AP2474 (File 1 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2474 — Earning Assignment
**Source:** requirements/AP-2474-earning-assignment.md · qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2474_test-plan.md
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2474_001 to AP2474_005 (5 test cases)
**Coverage:** Functional · Negative · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` — "Earning Assignments" list. Create form `/admin/earning-assignment/new/edit` opens as a modal over the list. Details page `/admin/earning-assignment/{id}/details` (route known from the list's View link; the page itself has never been opened). The sidebar's Risk Management fly-out closes on every page load, so navigate by URL except in AP2474_001. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Read-only option sources: earning sets (seeded 1 Profit, 2 Statutory, 3 Reinsurance, plus QA sets 4–12 from AP-2473); dealer groups 1 Group A, 2 Group B, 3 group c, 4 Group D; seeded earning assignment "AV+" (Profit / Group A / Yes) — never edit it. | `domain` (risk-management.md) |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2474_004 creates one earning assignment `QA-AP2474-004-<HHMM>`. AP2474_005 should create nothing; any record it does create is listed in the log. There is no delete action and the `cleanup` source is missing, so records stay on staging. | `cleanup` (missing) |

**Assignment naming.** Every assignment this run creates is described `QA-AP2474-<TC number>-<HHMM>`, where `<HHMM>` is the 24-hour time at creation, so it is unique per run and easy to find later.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2474_001 | The admin menu shows "Earning Assignments" under Risk Management, and clicking it opens the Earning Assignments page | Functional | Medium | PASS |
| AP2474_002 | The Earning Assignments page shows its title, "Create New", the five required columns, and View opens a details page | Functional | Medium | PASS |
| AP2474_003 | "Create New" opens a modal with Description, Earning Set, Dealer Group, Is Enabled? and Save, listing every set and dealer group | Functional | High | PASS |
| AP2474_004 | Saving a new assignment opens its "Earning Assignment {description}" page with Edit, Add Parameter and the parameter grid | Functional | High | PASS |
| AP2474_005 | Saving the Create New form with a blank description is refused and no assignment is created | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2474_001 — The admin menu shows "Earning Assignments" under Risk Management, and clicking it opens the Earning Assignments page

| Field | Value |
|---|---|
| **TC ID** | AP2474_001 |
| **Title** | The admin menu shows "Earning Assignments" under Risk Management, and clicking it opens the Earning Assignments page |
| **Requirement** | AP2474 — REQ-001 (AC 1, AC 2) |
| **Route** | `/admin` — admin home |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Earning Assignments listed last under Risk Management; page h1 "Earning Assignments". |

**Test Data:**

| Variable | Value |
|---|---|
| Admin login | `vinhle870@gmail.com` / `<password from the env source>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the admin account | The admin home page `/admin` opens with "Welcome to the admin". |
| 2 | Click "Risk Management" in the admin sidebar | The Risk Management section opens and lists its menu items. |
| 3 | [Verification] Verify the section contains an item labelled "Earning Assignments" | "Earning Assignments" is listed under Risk Management (the AP-2473 run saw the order Earning Curves · Earning Sets · Earning Groups · Earning Assignments). |
| 4 | Click "Earning Assignments" | The browser navigates to the earning assignments page. |
| 5 | [Verification] Verify the URL and the page heading | The URL ends with `/admin/earning-assignment` and the page heading reads "Earning Assignments". |

---

### AP2474_002 — The Earning Assignments page shows its title, "Create New", the five required columns, and View opens a details page

| Field | Value |
|---|---|
| **TC ID** | AP2474_002 |
| **Title** | The Earning Assignments page shows its title, "Create New", the five required columns, and View opens a details page |
| **Requirement** | AP2474 — REQ-002 (AC 1–4) |
| **Route** | `/admin/earning-assignment` — Earning Assignments |
| **Type** | Functional · Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Title, Create New and 5 columns exact; AV+ row Profit/Group A/Yes; details /admin/earning-assignment/1/details, grid header "Model Year Age" (allowed variant). |

**Why this matters:** The list is the only way to find an assignment again. The seeded "AV+" row is also the regression check: it must still show Profit / Group A / Yes, because this run must not change existing configuration.

**Test Data:**

| Variable | Value |
|---|---|
| Seeded row | Description "AV+", Earning Set "Profit", Dealer Group "Group A", Is Enabled? "Yes" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open `/admin/earning-assignment` | The Earning Assignments page loads. |
| 2 | [Verification] Verify the navigation title, its nav items and the datagrid column headers | The title reads "Earning Assignments"; the only nav item is "Create New"; the grid columns are, in order, "Description", "Earning Set", "Dealer Group", "Is Enabled?", "Actions". |
| 3 | [Verification] Find the "AV+" row (check every page if paging appears) and read its cells and its Actions | The row shows "AV+", "Profit", "Group A", "Yes", and its Actions cell offers "View". Record the row count and whether the grid pages. |
| 4 | Click "View" on the "AV+" row | The browser opens the assignment details page. |
| 5 | [Verification] Verify the URL and the heading of the opened page — do not click Edit | The URL matches `/admin/earning-assignment/{id}/details` and the heading reads "Earning Assignment AV+". Record the route, the nav items and any parameter rows shown, for the later cases. |

---

### AP2474_003 — "Create New" opens a modal with Description, Earning Set, Dealer Group, Is Enabled? and Save, listing every set and dealer group

| Field | Value |
|---|---|
| **TC ID** | AP2474_003 |
| **Title** | "Create New" opens a modal with Description, Earning Set, Dealer Group, Is Enabled? and Save, listing every set and dealer group |
| **Requirement** | AP2474 — REQ-003 (AC 1–6) |
| **Route** | `/admin/earning-assignment` → modal `/admin/earning-assignment/new/edit` |
| **Type** | Functional · UI |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Modal with Description, Earning Set, Dealer Group (single select; label "Dealer Group"), Is Enabled? checkbox ticked by default, Save; all 12 sets and 4 dealer groups listed with a "Choose" placeholder. |

**Why this matters:** If an earning set or a dealer group is missing from its dropdown, an admin cannot configure earnings for that dealer group at all.

**Test Data:**

| Variable | Value |
|---|---|
| Expected dealer groups | Group A, Group B, group c, Group D |
| Expected earning sets | Every description listed at `/admin/earning-set` (all pages) — Profit, Statutory, Reinsurance and the AP-2473 QA sets |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open `/admin/earning-set` and note every earning-set description across all pages, then open `/admin/earning-assignment` | The list of earning sets is noted; the Earning Assignments page loads. |
| 2 | Click "Create New" | A modal window opens over the list (the URL does not change) holding the assignment form. |
| 3 | [Verification] Verify the form's fields and their controls | "Description" is a text field; "Earning Set" is a select box; "Dealer Group(s)" is a select box; "Is Enabled?" lets the admin choose Yes or No; a "Save" button is present. Record the exact labels, whether Dealer Group allows more than one choice (Q-003) and the default of Is Enabled? (Q-005). |
| 4 | Open the "Earning Set" select, then the "Dealer Group(s)" select | Each list opens and shows its options. |
| 5 | [Verification] Compare the options with the expected lists, then close the modal with Escape without saving | "Earning Set" offers every earning set noted in step 1 (no more, no fewer); "Dealer Group(s)" offers Group A, Group B, group c and Group D. Record any placeholder option. No assignment is created. |

---

### AP2474_004 — Saving a new assignment opens its "Earning Assignment {description}" page with Edit, Add Parameter and the parameter grid

| Field | Value |
|---|---|
| **TC ID** | AP2474_004 |
| **Title** | Saving a new assignment opens its "Earning Assignment {description}" page with Edit, Add Parameter and the parameter grid |
| **Requirement** | AP2474 — REQ-004 (AC 1–4, 6) |
| **Route** | `/admin/earning-assignment` → modal → `/admin/earning-assignment/{id}/details` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Saved as id 2; "Earning Assignment QA-AP2474-004-0110" with Edit and Add Parameter. Empty grid shows "No entities found" with no column headers (observation). |

**Why this matters:** Saving is the step that delivers the story. Every parameter case depends on it.

**Test Data:**

| Variable | Value |
|---|---|
| Description | `QA-AP2474-004-<HHMM>` |
| Earning Set | "Statutory" |
| Dealer Group | "Group B" |
| Is Enabled? | Yes |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open `/admin/earning-assignment` and click "Create New" | The assignment form opens in a modal. |
| 2 | Enter Description `QA-AP2474-004-<HHMM>`, choose Earning Set "Statutory", Dealer Group "Group B", Is Enabled? "Yes", and click **"Save"** | The modal closes and the browser is redirected away from the list. |
| 3 | [Verification] Verify the details page: URL, title, nav items, parameter grid headers | The URL matches `/admin/earning-assignment/{id}/details`; the title reads "Earning Assignment QA-AP2474-004-<HHMM>"; the nav items are "Edit" and "Add Parameter"; the parameter grid's columns are "Condition", "Coverage Code", "Sale Date", "Coverage odometer", "Model Year Age (From)", "Make", "Lag Interval", "Earning Group", "Actions". Record any success message and the empty-grid text. Record the new `{id}`. |
| 4 | Open `/admin/earning-assignment` | The list page loads. |
| 5 | [Verification] Find the new row | A row shows "QA-AP2474-004-<HHMM>", "Statutory", "Group B", "Yes", with "View" in Actions. |

---

### AP2474_005 — Saving the Create New form with a blank description is refused and no assignment is created

| Field | Value |
|---|---|
| **TC ID** | AP2474_005 |
| **Title** | Saving the Create New form with a blank description is refused and no assignment is created |
| **Requirement** | AP2474 — REQ-003 (validation — not stated; Q-001) |
| **Route** | `/admin/earning-assignment` → modal |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Empty and spaces-only description refused with "This value should not be blank." on the standalone form; nothing created. |

**Why this matters:** An assignment without a description would show as a blank row and a blank "Earning Assignment" title, so an admin could not tell it apart. The ticket states no validation, so a save here is reported as an observation, not a failure — the case **fails** only on an HTTP 500 error page or a blank row the admin cannot open.

**Test Data:**

| Variable | Value |
|---|---|
| Description | (empty), then three spaces |
| Earning Set | "Profit" |
| Dealer Group | "group c" (lower-case, as stored on staging) |
| Is Enabled? | Yes |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open `/admin/earning-assignment`, note the number of rows (all pages), click "Create New" | The assignment form opens in a modal. |
| 2 | Leave Description empty, choose Earning Set "Profit", Dealer Group "group c", Is Enabled? "Yes", click **"Save"** | The save is refused with a message at the Description field (the sibling screens show "This value should not be blank."). No HTTP 500 page. |
| 3 | Enter three spaces in Description and click **"Save"** again | The save is refused again with the same kind of message. |
| 4 | Open `/admin/earning-assignment` | The list page loads. |
| 5 | [Verification] Count the rows (all pages) and look for a row with an empty description | The row count is unchanged from step 1; no assignment with a blank description exists. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | AP2474_001 | — | — | — |
| REQ-002 — List page | AP2474_002 | — | — | AP2474_002 |
| REQ-003 — Create form | AP2474_003 | AP2474_005 (+ file 2: 006, 007) | — | — |
| REQ-004 — Save & details page | AP2474_004 (+ file 2: 008) | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2474_001 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_001-step5-pass.png` |
| AP2474_002 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_002-step5-pass.png` |
| AP2474_003 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_003-step5-pass.png` |
| AP2474_004 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_004-step3-pass.png` |
| AP2474_005 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_005-step5-pass.png` |

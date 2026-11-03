# Test Cases — AP2472 (File 1 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2472 — Earning Groups Management
**Source:** requirements/AP-2472-earning-groups-management.md · qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2472_test-plan.md
**Date:** 2026-10-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2472_001 to AP2472_005 (5 test cases)
**Coverage:** Functional · Negative · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | Not known as a URL. Earning Groups is not yet mapped in `qa-docs`. Reach it from the admin sidebar: **Risk Management → Earning Groups** (the item was seen in page snapshots on 2026-10-02). Record the route in the execution log the first time it opens, and use it directly afterwards. | `navigation` (feature not yet in `qa-docs`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Earning curves are read, never changed. AP2472_001–005 need none. | `test-data` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2472_004 creates one earning group `QA-AP2472-RO78-<HHMM>`. The feature has no delete action and the `cleanup` source is missing, so it stays on staging. AP2472_005 should create nothing; if it does, the extra group is recorded in the log. | `cleanup` (missing) |

**Group naming.** Every group this run creates is named `QA-AP2472-<purpose>-<HHMM>`, where `<HHMM>` is the 24-hour time at creation. That makes it unique per run and easy to find as test data later.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2472_001 | The admin menu shows "Earning Groups" under Risk Management, and clicking it opens the Earning Groups page | Functional | Medium | PASS |
| AP2472_002 | The Earning Groups page shows its title, a "Create New" item and a list with the five required columns | Functional | Medium | PASS |
| AP2472_003 | "Create New" opens a modal with a Name box and a Default Earning Method list that starts on Pro-Rata | Functional | High | PASS |
| AP2472_004 | Creating a Rule of 78 group opens its "Earning Group {name}" details page and adds it to the list | Functional | High | PASS |
| AP2472_005 | Submitting the Create New form with a blank name is refused and no group is created | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2472_001 — The admin menu shows "Earning Groups" under Risk Management, and clicking it opens the Earning Groups page

| Field | Value |
|---|---|
| **TC ID** | AP2472_001 |
| **Title** | The admin menu shows "Earning Groups" under Risk Management, and clicking it opens the Earning Groups page |
| **Requirement** | AP2472 — REQ-001 (AC 1, AC 2) |
| **Route** | `/admin` — Admin home, sidebar |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Earning Groups is the third item under Risk Management; it opens /admin/earning-group with heading "Earning Groups". Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The menu item is the only way an admin finds the feature. If it is missing or in the wrong section, the screen exists but nobody can use it.

**Test Data:**

| Variable | Value |
|---|---|
| Section heading | Risk Management |
| Menu item | Earning Groups |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/admin/login`, enter "Courriel" `vinhle870@gmail.com` and "Mot de passe" `<password from the env source>`, click **"Se connecter"** | The admin home page `/admin` loads and shows "Welcome to the admin". |
| 2 | [Verification] Verify the sidebar has a "Risk Management" section that contains an "Earning Groups" link | The "Risk Management" section lists "Earning Groups". |
| 3 | Click "Earning Groups" in the sidebar | A new page opens. The executor writes its URL into the log as the Earning Groups route. |
| 4 | [Verification] Verify the page that opened is the Earning Groups page | The page heading reads "Earning Groups". |

---

### AP2472_002 — The Earning Groups page shows its title, a "Create New" item and a list with the five required columns

| Field | Value |
|---|---|
| **TC ID** | AP2472_002 |
| **Title** | The Earning Groups page shows its title, a "Create New" item and a list with the five required columns |
| **Requirement** | AP2472 — REQ-002 (AC 1, AC 2, AC 4) |
| **Route** | Earning Groups list (sidebar → Risk Management → Earning Groups) |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Title, single "Create New" item and the five columns match exactly; View on AV+ opened "Earning Group AV+". Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The list is where an admin sees which curves each group contains. A missing column hides the information that tells two groups apart.

**Test Data:**

| Variable | Value |
|---|---|
| Page title | Earning Groups |
| Nav item | Create New |
| Columns, in order | Name · Earning curves · Default Earning curve type · Is Enabled? · Actions |
| Row action | View |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open Risk Management → Earning Groups | The Earning Groups page loads. |
| 2 | [Verification] Verify the page title is "Earning Groups" and the navigation area offers exactly one item, "Create New" | The title reads "Earning Groups", and "Create New" is shown as a navigation item or button. |
| 3 | [Verification] Verify the datagrid's column headers are, in order, "Name", "Earning curves", "Default Earning curve type", "Is Enabled?" and "Actions" | All five headers are present in that order. Any extra column, or a header worded differently, is recorded in the log. |
| 4 | If at least one row exists, click "View" on the first row. If the list is empty, record the empty-state message and skip to step 5 | The browser goes to that group's details page, whose title begins "Earning Group". |
| 5 | [Verification] Verify the details page title names the group from the row clicked | The title reads "Earning Group {name}", using the same name as the list row. |

---

### AP2472_003 — "Create New" opens a modal with a Name box and a Default Earning Method list that starts on Pro-Rata

| Field | Value |
|---|---|
| **TC ID** | AP2472_003 |
| **Title** | "Create New" opens a modal with a Name box and a Default Earning Method list that starts on Pro-Rata |
| **Requirement** | AP2472 — REQ-003 (AC 1–4) |
| **Route** | Earning Groups list → "Create New" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Modal has an empty Name box and a select (Pro-Rata, Rule of 78, Reverse rule of 78) defaulting to Pro-Rata. Only a "Save" button; no Cancel or close control, so Escape was used. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The default method is what a group gets if the admin changes nothing. If the wrong method is pre-selected, groups are quietly created with the wrong earning pattern.

**Test Data:**

| Variable | Value |
|---|---|
| Expected fields | Name (text box) · Default Earning Method (select box) |
| Expected options, in order | Pro-Rata · Rule of 78 · Reverse rule of 78 |
| Expected default | Pro-Rata |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open Risk Management → Earning Groups | The Earning Groups page loads. |
| 2 | Click "Create New" | A modal window opens over the list page. The URL does not change to a separate page. |
| 3 | [Verification] Verify the modal contains a "Name" text box and a "Default Earning Method" select box. Read the select's options and its selected value with `browser.evaluate` | "Name" is an empty text input. "Default Earning Method" is a select with exactly the options "Pro-Rata", "Rule of 78" and "Reverse rule of 78", and "Pro-Rata" is selected. Any other field (for example "Is Enabled?") and the labels of the modal's buttons are recorded. |
| 4 | Close the modal with its close or cancel control, without submitting | The modal closes and the list page is unchanged. |
| 5 | [Verification] Verify no new group was added to the list | The list has the same rows as before step 2. |

---

### AP2472_004 — Creating a Rule of 78 group opens its "Earning Group {name}" details page and adds it to the list

| Field | Value |
|---|---|
| **TC ID** | AP2472_004 |
| **Title** | Creating a Rule of 78 group opens its "Earning Group {name}" details page and adds it to the list |
| **Requirement** | AP2472 — REQ-004 (AC 1–5), REQ-002 (AC 2) |
| **Route** | Earning Groups list → "Create New" → group details page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Group QA-AP2472-RO78-2339 (id 2) saved; details title correct with "Edit"; list row shows "None", "Rule of 78", Is Enabled? "Yes". Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** Creating a group is the first step of the whole feature. Choosing a non-default method proves the chosen value is saved, not just the default.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2472-RO78-<HHMM>` (for example `QA-AP2472-RO78-1430`) |
| Default Earning Method | Rule of 78 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open Risk Management → Earning Groups and click "Create New" | The Create New modal is open. |
| 2 | Enter `QA-AP2472-RO78-<HHMM>` in "Name", select "Rule of 78" in "Default Earning Method" and click the modal's submit button | The modal closes and the browser goes to the new group's details page. The URL of this page is recorded. |
| 3 | [Verification] Verify the details page title and navigation | The title reads "Earning Group QA-AP2472-RO78-<HHMM>", and the navigation offers an "Edit" item. Any success message is recorded. |
| 4 | Open Risk Management → Earning Groups again | The list page loads. |
| 5 | [Verification] Verify the new group's row in the list | A row named `QA-AP2472-RO78-<HHMM>` shows "Rule of 78" under "Default Earning curve type", an empty "Earning curves" cell (or an empty-state marker, recorded), and a "View" action. The value under "Is Enabled?" is recorded as an observation (Q-002). |

---

### AP2472_005 — Submitting the Create New form with a blank name is refused and no group is created

| Field | Value |
|---|---|
| **TC ID** | AP2472_005 |
| **Title** | Submitting the Create New form with a blank name is refused and no group is created |
| **Requirement** | AP2472 — REQ-003 (risk: no validation described; Q-001) |
| **Route** | Earning Groups list → "Create New" |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Blank name refused with "This value should not be blank." and no group created. The error appears on the standalone page /admin/earning-group/new/edit, not in the modal. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** A group with no name cannot be told apart from others when an admin assigns groups later. The ticket does not state that Name is required. If a blank group is created, record it as a FAIL against the reasonable expectation, and cite Q-001 in the bug so the product owner can confirm.

**Test Data:**

| Variable | Value |
|---|---|
| Name | _(blank)_ |
| Default Earning Method | Pro-Rata (default) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open Risk Management → Earning Groups and count the rows in the list | The list page is open, and the row count is recorded. |
| 2 | Click "Create New", leave "Name" empty and click the modal's submit button | The form is not submitted. A message on or next to "Name" says the field is required (exact text recorded), and the modal stays open. |
| 3 | Close the modal and reload the list page | The list page loads. |
| 4 | [Verification] Verify no group with a blank name was added | The row count equals the count from step 1, and no row has an empty "Name". |

---

## Coverage Matrix

See the combined matrix in AP2472_TestCases_016-016.md, which covers all four files.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2472_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_001-step4-EarningGroupsPageHeading_pass.png` |
| AP2472_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_002-step5-DetailsTitleAVPlus_pass.png` |
| AP2472_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_003-step3-CreateModalFieldsDefaultProRata_pass.png` |
| AP2472_004 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_004-step5-ListRowRO78_pass.png` |
| AP2472_005 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_005-step4-NoBlankGroupAdded_pass.png` |

# Test Cases — AP2474 (File 2 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2474 — Earning Assignment
**Source:** requirements/AP-2474-earning-assignment.md · qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2474_test-plan.md
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2474_006 to AP2474_010 (5 test cases)
**Coverage:** Functional · Negative · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` (list; "Create New" opens the form as a modal). Details page `/admin/earning-assignment/{id}/details`; its "Edit" and "Add Parameter" forms have never been opened — record their routes and whether they are modals the first time. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` (French login page: "Courriel", "Mot de passe", "Se connecter"). | `env` |
| **Test data** | Read-only option sources: earning sets (Profit, Statutory, Reinsurance, QA sets); dealer groups Group A, Group B, group c, Group D; earning groups (seeded "AV+" plus AP-2472's `QA-AP2472-…` groups); warranty programs (Coverage Code) and vehicle makes — their contents are not yet mapped and are recorded at execution. Seeded assignment "AV+" (Profit / Group A) — never edit it. | `domain` (risk-management.md, earning-groups.md) |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2474_006 should create nothing. AP2474_007 creates `QA-AP2474-007-<HHMM>` (Profit / Group A — a deliberate duplicate pair) if the system accepts it. AP2474_008 creates and edits `QA-AP2474-008-<HHMM>` (renamed `…-EDITED`). AP2474_010 creates `QA-AP2474-010-<HHMM>` with one parameter. No delete action exists for assignments; records stay on staging. | `cleanup` (missing) |

**Assignment naming.** `QA-AP2474-<TC number>-<HHMM>`, where `<HHMM>` is the 24-hour time at creation.

**Known blockers:** None. Warranty programs and vehicle makes are assumed to exist on staging (they back the dealer quote flow, which works). If either dropdown is empty at execution, AP2474_010 is BLOCKED, not FAIL.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2474_006 | Saving a new assignment with no earning set or dealer group chosen is refused cleanly, without an error page | Negative | Medium | FAIL |
| AP2474_007 | Assigning the same earning set to a dealer group that already has it is either refused or saved — the result is recorded | Negative | Medium | PASS |
| AP2474_008 | "Edit" on the details page opens the assignment pre-filled, and a changed description updates the page title | Functional | Medium | PASS |
| AP2474_009 | "Add Parameter" opens a modal with all ten fields, the stated options, and defaults 0, 9999999, -1 and 99 | Functional | High | PASS |
| AP2474_010 | Submitting a fully filled parameter adds one row to the parameter grid showing every value and each range as "from - to" | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2474_006 — Saving a new assignment with no earning set or dealer group chosen is refused cleanly, without an error page

| Field | Value |
|---|---|
| **TC ID** | AP2474_006 |
| **Title** | Saving a new assignment with no earning set or dealer group chosen is refused cleanly, without an error page |
| **Requirement** | AP2474 — REQ-003 (validation — not stated; Q-001) |
| **Route** | `/admin/earning-assignment` → modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | FAIL — Save with Earning Set or Dealer Group on "Choose" returns the HTTP 500 "Erreur" page (3 of 3 tries); nothing written. |

**Why this matters:** On the sibling Earning Groups screen, submitting a select with nothing chosen returned an HTTP 500 error page (bug AP-2478). An assignment with no earning set or no dealer group would mean nothing. The case **fails** only on an HTTP 500 page or a saved row with an empty Earning Set or Dealer Group; a select with no empty option (so nothing can be left unchosen) is recorded and the case passes on the remaining check.

**Test Data:**

| Variable | Value |
|---|---|
| Description | `QA-AP2474-006-<HHMM>` |
| Earning Set | no choice (the empty / placeholder option, if one exists) |
| Dealer Group | no choice (the empty / placeholder option, if one exists) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open `/admin/earning-assignment`, click "Create New" | The assignment form opens in a modal. |
| 2 | Enter Description `QA-AP2474-006-<HHMM>`; set Earning Set to its empty option, keep a valid Dealer Group, click **"Save"** | The save is refused with a message at Earning Set, or the select offers no empty option (recorded). No HTTP 500 page. |
| 3 | Re-open the form if needed; enter the same Description, choose Earning Set "Profit" and set Dealer Group to its empty option, click **"Save"** | The save is refused with a message at Dealer Group, or the select offers no empty option (recorded). No HTTP 500 page. |
| 4 | Open `/admin/earning-assignment` | The list loads. |
| 5 | [Verification] Look for `QA-AP2474-006-<HHMM>` across all pages | No row exists for it, or — if the selects had no empty option — the record shows a real earning set and dealer group. No row has an empty Earning Set or Dealer Group cell. |

---

### AP2474_007 — Assigning the same earning set to a dealer group that already has it is either refused or saved — the result is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2474_007 |
| **Title** | Assigning the same earning set to a dealer group that already has it is either refused or saved — the result is recorded |
| **Requirement** | AP2474 — REQ-003 (duplicate rule — not stated; Q-002) |
| **Route** | `/admin/earning-assignment` → modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Duplicate Profit/Group A pair saved silently as id 3 (Q-002 observation); AV+ unchanged. |

**Why this matters:** Two assignments for one dealer group could leave it unclear which rules apply to that dealer's contracts. The ticket does not say whether this is allowed, so either outcome **passes** and is recorded for Q-002. The case **fails** only on an HTTP 500 page or if saving changes the existing "AV+" row.

**Test Data:**

| Variable | Value |
|---|---|
| Description | `QA-AP2474-007-<HHMM>` |
| Earning Set | "Profit" (same as the seeded "AV+" row) |
| Dealer Group | "Group A" (same as the seeded "AV+" row) |
| Is Enabled? | Yes |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open `/admin/earning-assignment` and confirm the "AV+" row reads Profit / Group A / Yes; click "Create New" | The assignment form opens in a modal. |
| 2 | Enter Description `QA-AP2474-007-<HHMM>`, Earning Set "Profit", Dealer Group "Group A", Is Enabled? "Yes", click **"Save"** | Either a message refuses the duplicate pair, or the details page "Earning Assignment QA-AP2474-007-<HHMM>" opens. No HTTP 500 page. Record which. |
| 3 | Open `/admin/earning-assignment` | The list loads. |
| 4 | [Verification] Check the "AV+" row and look for the new row | "AV+" still reads Profit / Group A / Yes. The new row is present (saved) or absent (refused), matching step 2. |

---

### AP2474_008 — "Edit" on the details page opens the assignment pre-filled, and a changed description updates the page title

| Field | Value |
|---|---|
| **TC ID** | AP2474_008 |
| **Title** | "Edit" on the details page opens the assignment pre-filled, and a changed description updates the page title |
| **Requirement** | AP2474 — REQ-004 (AC 3 — Edit nav item; behaviour not stated, Q-004) |
| **Route** | `/admin/earning-assignment/{id}/details` → Edit |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Edit is a modal "Earning assignment #5", pre-filled; edit saved, title and list row updated, Is Enabled? = No. |

**Why this matters:** The ticket shows an "Edit" item but never describes it. This case checks only the minimum the word implies. An Edit form that opened empty, or saved into another record, would let an admin overwrite live configuration by accident.

**Test Data:**

| Variable | Value |
|---|---|
| Original | Description `QA-AP2474-008-<HHMM>`, Earning Set "Reinsurance", Dealer Group "Group D", Is Enabled? Yes |
| Changed | Description `QA-AP2474-008-<HHMM>-EDITED`, Is Enabled? No |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; at `/admin/earning-assignment` click "Create New", enter Description `QA-AP2474-008-<HHMM>`, Earning Set "Reinsurance", Dealer Group "Group D", Is Enabled? "Yes" → **"Save"** | The details page "Earning Assignment QA-AP2474-008-<HHMM>" opens. |
| 2 | Click "Edit" | The assignment form opens (record whether as a modal or a page, and its heading). |
| 3 | [Verification] Verify the form is pre-filled with this assignment's values | Description `QA-AP2474-008-<HHMM>`, Earning Set "Reinsurance", Dealer Group "Group D", Is Enabled? Yes. |
| 4 | Change Description to `QA-AP2474-008-<HHMM>-EDITED`, set Is Enabled? to "No", click **"Save"** | The form closes; record where the user lands and any message. No HTTP 500 page. |
| 5 | [Verification] Check the details page title and the list row | The details title reads "Earning Assignment QA-AP2474-008-<HHMM>-EDITED"; at `/admin/earning-assignment` the row shows the edited description, "Reinsurance", "Group D", "No", and no second row with the old description exists. |

---

### AP2474_009 — "Add Parameter" opens a modal with all ten fields, the stated options, and defaults 0, 9999999, -1 and 99

| Field | Value |
|---|---|
| **TC ID** | AP2474_009 |
| **Title** | "Add Parameter" opens a modal with all ten fields, the stated options, and defaults 0, 9999999, -1 and 99 |
| **Requirement** | AP2474 — REQ-005 (AC 1–13) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Functional · UI |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Add Parameter modal: all fields present, defaults 0 / 9999999 / -1 / 99, New/Used, 0/6/12, 16 earning groups, 52 coverage codes, 200 makes. |

**Why this matters:** The defaults decide which contracts a parameter covers when the admin does not touch a field. A wrong default (for example an odometer upper limit below 9999999) would silently exclude contracts from the rule.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | The one created by AP2474_004 (`QA-AP2474-004-<HHMM>`) if it exists; otherwise create `QA-AP2474-009-<HHMM>` with Earning Set "Statutory", Dealer Group "Group B", Is Enabled? Yes |
| Expected earning groups | Every name at `/admin/earning-group` (all pages) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; note every earning-group name at `/admin/earning-group` (all pages); open the details page of the assignment named in Test Data (create it via "Create New" → **Save** if absent) | The details page "Earning Assignment …" is shown with "Add Parameter". |
| 2 | Click "Add Parameter" | The Parameter form opens in a modal. Record its heading. |
| 3 | [Verification] Verify each field's control and default | "Condition" select; "Coverage Code" select; "Sale Date from" and "Sale Date to" date pickers; "Coverage odometer from" numeric = **0**; "Coverage odometer to" numeric = **9999999**; "Model Year Age From" numeric = **-1**; "Model Year Age to" numeric = **99**; "Make" select; "Lag Interval" select; "Earning Group" select; a "Submit" button. |
| 4 | Open each select in turn: Condition, Coverage Code, Make, Lag Interval, Earning Group | Each list opens. |
| 5 | [Verification] Verify the options; then close the modal with Escape without submitting | Condition offers "New" and "Used"; Lag Interval offers "0", "6", "12"; Earning Group offers every name noted in step 1; Coverage Code lists warranty programs and Make lists vehicle brands (record counts, the first five options of each, and any default or placeholder). No parameter is created. |

---

### AP2474_010 — Submitting a fully filled parameter adds one row to the parameter grid showing every value and each range as "from - to"

| Field | Value |
|---|---|
| **TC ID** | AP2474_010 |
| **Title** | Submitting a fully filled parameter adds one row to the parameter grid showing every value and each range as "from - to" |
| **Requirement** | AP2474 — REQ-006 (AC 1, 2), REQ-004 (AC 4) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (BLOCKED at execution if Coverage Code or Make has no options) |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — One row matching every value entered, ranges shown "from - to". |

**Why this matters:** If the grid shows different values from those entered, the admin cannot trust the earnings configuration. Every field is set to a non-default value so a field that is silently ignored would show up.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-010-<HHMM>`, Earning Set "Profit", Dealer Group "Group D", Is Enabled? Yes |
| Condition | "Used" |
| Coverage Code | the **first** option in the list (record its text) |
| Sale Date from / to | 2026-01-01 / 2026-12-31 |
| Coverage odometer from / to | 1000 / 150000 |
| Model Year Age from / to | 0 / 10 |
| Make | the **first** option in the list (record its text) |
| Lag Interval | "6" |
| Earning Group | "AV+" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; at `/admin/earning-assignment` click "Create New", enter Description `QA-AP2474-010-<HHMM>`, Earning Set "Profit", Dealer Group "Group D", Is Enabled? "Yes" → **"Save"** | The details page "Earning Assignment QA-AP2474-010-<HHMM>" opens with an empty parameter grid. |
| 2 | Click "Add Parameter"; set Condition "Used", Coverage Code = first option, Sale Date from 2026-01-01, Sale Date to 2026-12-31, Coverage odometer from 1000, to 150000, Model Year Age From 0, to 10, Make = first option, Lag Interval "6", Earning Group "AV+" | Every field shows the value entered. |
| 3 | Click **"Submit"** | The modal closes and the details page reloads. Record any message. No HTTP 500 page. |
| 4 | [Verification] Read the parameter grid | Exactly one row: Condition "Used"; Coverage Code = the chosen option; Sale Date "2026-01-01 - 2026-12-31" (any date format showing those two dates); Coverage odometer "1000 - 150000"; Model Year Age "0 - 10"; Make = the chosen option; Lag Interval "6"; Earning Group "AV+"; Actions shows a trash-can icon. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-003 — Create form | — | AP2474_006, AP2474_007 | — | AP2474_007 (seeded row unchanged) |
| REQ-004 — Edit nav item | AP2474_008 | — | — | — |
| REQ-005 — Add Parameter form | AP2474_009 | (file 3: 012, 013) | AP2474_009 (defaults) | — |
| REQ-006 — Submit parameter | AP2474_010 | — | (file 3: 011) | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2474_006 | FAIL | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step2-fail.png` — bug [AP-2482](https://garantieavantageplus.atlassian.net/browse/AP-2482) |
| AP2474_007 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_007-step4-pass.png` |
| AP2474_008 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_008-step5-pass.png` |
| AP2474_009 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_009-step3-pass.png` |
| AP2474_010 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_010-step4-pass.png` |

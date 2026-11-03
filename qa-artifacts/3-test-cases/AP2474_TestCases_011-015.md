# Test Cases — AP2474 (File 3 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2474 — Earning Assignment
**Source:** requirements/AP-2474-earning-assignment.md · qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2474_test-plan.md
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2474_011 to AP2474_015 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` (list) → `/admin/earning-assignment/{id}/details`. The Add Parameter form and the trash-can confirmation have never been opened; the sibling Earning Groups page uses a confirmation modal with **Continue** and **No** buttons and the text "Are you sure you want to delete this record?". | `navigation` → `domain` (risk-management.md, earning-groups.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` (French login page). | `env` |
| **Test data** | Earning groups (seeded "AV+"), warranty programs, vehicle makes — read only. Seeded assignment "AV+" — never touched. | `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2474_011 creates `QA-AP2474-011-<HHMM>` with one default-range parameter. AP2474_012 and AP2474_013 create `QA-AP2474-012-<HHMM>` and `QA-AP2474-013-<HHMM>`, plus any parameter the system accepts. AP2474_014/015 create `QA-AP2474-014-<HHMM>` with two parameters, one of which 015 removes. No assignment delete exists; records stay on staging. | `cleanup` (missing) |

**Assignment naming.** `QA-AP2474-<TC number>-<HHMM>`, where `<HHMM>` is the 24-hour time at creation.

**Known blockers:** None. If Coverage Code or Make has no options at execution, every case here that must submit a parameter is BLOCKED, not FAIL.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2474_011 | A parameter submitted with the default ranges and a one-day sale period shows "0 - 9999999" and "-1 - 99" in the grid | Edge-case | Medium | PASS |
| AP2474_012 | A parameter whose "from" values are greater than its "to" values is refused, or saved — recorded — without an error page | Negative | High | PASS |
| AP2474_013 | A parameter with letters or a blank in the odometer and model-year fields is refused cleanly, without an error page | Negative | Medium | PASS |
| AP2474_014 | Clicking the trash-can on a parameter asks for confirmation, and answering No keeps the parameter | Negative | Medium | PASS |
| AP2474_015 | Confirming the trash-can removes only that parameter, and the assignment and its other parameter remain | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2474_011 — A parameter submitted with the default ranges and a one-day sale period shows "0 - 9999999" and "-1 - 99" in the grid

| Field | Value |
|---|---|
| **TC ID** | AP2474_011 |
| **Title** | A parameter submitted with the default ranges and a one-day sale period shows "0 - 9999999" and "-1 - 99" in the grid |
| **Requirement** | AP2474 — REQ-005 (AC 6–9 defaults), REQ-006 (AC 2) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Row shows 2026-10-04 - 2026-10-04, 0 - 9999999, -1 - 99. |

**Why this matters:** Most parameters will be submitted with the defaults untouched. The extreme values (a negative model-year age, a seven-digit odometer) and a sale period that starts and ends on the same day are where storage or display is most likely to truncate or reject.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-011-<HHMM>`, Earning Set "Profit", Dealer Group "Group A", Is Enabled? Yes |
| Condition | "New" |
| Coverage Code / Make | the **last** option in each list (record the text) |
| Sale Date from / to | 2026-10-04 / 2026-10-04 |
| Odometer / Model Year Age | leave the defaults (0 – 9999999, -1 – 99) |
| Lag Interval | "0" |
| Earning Group | "AV+" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; at `/admin/earning-assignment` click "Create New", enter Description `QA-AP2474-011-<HHMM>`, Earning Set "Profit", Dealer Group "Group A", Is Enabled? "Yes" → **"Save"** | The details page "Earning Assignment QA-AP2474-011-<HHMM>" opens. |
| 2 | Click "Add Parameter"; set Condition "New", Coverage Code = last option, Sale Date from 2026-10-04, Sale Date to 2026-10-04, Make = last option, Lag Interval "0", Earning Group "AV+"; leave the four numeric fields at their defaults | The four numeric fields still show 0, 9999999, -1, 99. |
| 3 | Click **"Submit"** | The modal closes and the details page reloads. No HTTP 500 page. |
| 4 | [Verification] Read the new parameter row | One row: Condition "New"; Sale Date shows 2026-10-04 on both sides; Coverage odometer "0 - 9999999"; Model Year Age "-1 - 99"; Lag Interval "0"; Earning Group "AV+"; the chosen Coverage Code and Make. |

---

### AP2474_012 — A parameter whose "from" values are greater than its "to" values is refused, or saved — recorded — without an error page

| Field | Value |
|---|---|
| **TC ID** | AP2474_012 |
| **Title** | A parameter whose "from" values are greater than its "to" values is refused, or saved — recorded — without an error page |
| **Requirement** | AP2474 — REQ-005 (range rule — not stated; Q-006) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Inverted ranges saved silently and shown exactly as entered (Q-006 observation). |

**Why this matters:** A parameter with an inverted range can never match a contract, so the dealer group would silently lose the intended earning rule. The ticket states no rule, so a refusal **or** a save both pass and are recorded for Q-006 (the sibling Earning Curves screen saves an inverted odometer range silently — AP-2471 Q-006). The case **fails** only on an HTTP 500 page or if the grid shows values other than those entered.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-012-<HHMM>`, Earning Set "Profit", Dealer Group "Group B", Is Enabled? Yes |
| Condition / Coverage Code / Make / Lag / Earning Group | "New" / first option / first option / "12" / "AV+" |
| Sale Date from / to | 2026-12-31 / 2026-01-01 (inverted) |
| Coverage odometer from / to | 200000 / 1000 (inverted) |
| Model Year Age from / to | 10 / 2 (inverted) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; create assignment `QA-AP2474-012-<HHMM>` (Profit / Group B / Yes) via "Create New" → **"Save"** | Its details page opens with an empty parameter grid. |
| 2 | Click "Add Parameter"; enter the inverted ranges and other values from Test Data | Every field shows the value entered (a date picker that refuses an earlier "to" date is recorded). |
| 3 | Click **"Submit"** | Either a message refuses the inverted range(s) — record which fields and the wording — or the modal closes and the page reloads. No HTTP 500 page. |
| 4 | [Verification] Read the parameter grid | If refused: no parameter row exists. If saved: one row shows exactly "2026-12-31 - 2026-01-01" (any date format), "200000 - 1000" and "10 - 2" — recorded as an observation for Q-006. |

---

### AP2474_013 — A parameter with letters or a blank in the odometer and model-year fields is refused cleanly, without an error page

| Field | Value |
|---|---|
| **TC ID** | AP2474_013 |
| **Title** | A parameter with letters or a blank in the odometer and model-year fields is refused cleanly, without an error page |
| **Requirement** | AP2474 — REQ-005 (AC 6–9 "numeric text field") |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Number field rejects letters; blanks refused with "This value should not be blank."; no row saved. |

**Why this matters:** The ticket calls these four fields numeric, so a value that is not a number must not be stored. On the sibling Earning Curves screen, an empty numeric factor returned an HTTP 500 page; this case checks the same weakness here. The case **fails** on an HTTP 500 page or on a saved row showing letters or an empty range.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-013-<HHMM>`, Earning Set "Statutory", Dealer Group "Group A", Is Enabled? Yes |
| Other fields | Condition "Used", first Coverage Code, first Make, Lag "0", Earning Group "AV+", Sale Dates 2026-01-01 / 2026-12-31 |
| Attempt 1 | Coverage odometer from `abc` (typed; record whether the field accepts letters) |
| Attempt 2 | Coverage odometer to cleared (blank), Model Year Age to cleared (blank) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; create assignment `QA-AP2474-013-<HHMM>` (Statutory / Group A / Yes) via "Create New" → **"Save"**; click "Add Parameter" and fill the "Other fields" from Test Data | The Parameter modal is filled with valid values. |
| 2 | Type `abc` into "Coverage odometer from" and click **"Submit"** | The field refuses the letters (it stays empty or keeps 0) or the save is refused with a message. No HTTP 500 page. |
| 3 | Restore "Coverage odometer from" to 0 if needed; clear "Coverage odometer to" and "Model Year Age to"; click **"Submit"** | The save is refused with a message at the blank fields. No HTTP 500 page. Record the wording. |
| 4 | Close the form if still open and reload the details page | The details page shows "Earning Assignment QA-AP2474-013-<HHMM>". |
| 5 | [Verification] Read the parameter grid | No parameter row exists, or any saved row shows numbers only — no letters and no empty side of a range. |

---

### AP2474_014 — Clicking the trash-can on a parameter asks for confirmation, and answering No keeps the parameter

| Field | Value |
|---|---|
| **TC ID** | AP2474_014 |
| **Title** | Clicking the trash-can on a parameter asks for confirmation, and answering No keeps the parameter |
| **Requirement** | AP2474 — REQ-007 (AC 1, 2, 3 — decline) |
| **Route** | `/admin/earning-assignment/{id}/details` |
| **Type** | Negative · UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Modal "Unassign parameter" — "Are you sure you want to delete this record?" Continue / No; No kept both rows. |

**Why this matters:** The confirmation is what protects a live earning rule from a misclick. If declining still removed the parameter, the safeguard would be useless.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-014-<HHMM>`, Earning Set "Reinsurance", Dealer Group "group c", Is Enabled? Yes |
| Parameter A | Condition "New", first Coverage Code, Sale Dates 2026-01-01 / 2026-06-30, defaults for numeric fields, first Make, Lag "0", Earning Group "AV+" |
| Parameter B | Condition "Used", first Coverage Code, Sale Dates 2026-07-01 / 2026-12-31, defaults for numeric fields, first Make, Lag "12", Earning Group "AV+" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; create assignment `QA-AP2474-014-<HHMM>` (Reinsurance / group c / Yes) via "Create New" → **"Save"** | Its details page opens. |
| 2 | [Pre-Condition] Add Parameter A → **"Submit"**, then Add Parameter B → **"Submit"** (values in Test Data) | The parameter grid shows two rows: one "New" with Lag "0", one "Used" with Lag "12". |
| 3 | Click the trash-can icon on the Parameter A row ("New") | A modal opens asking for confirmation (the ticket says "Are you sure to delete this record?"). Record the exact text and the button labels. |
| 4 | Click the decline button ("No" or equivalent) | The modal closes; the page stays on the details page. |
| 5 | [Verification] Read the parameter grid (reload the page first) | Both rows are still present with their values unchanged. |

---

### AP2474_015 — Confirming the trash-can removes only that parameter, and the assignment and its other parameter remain

| Field | Value |
|---|---|
| **TC ID** | AP2474_015 |
| **Title** | Confirming the trash-can removes only that parameter, and the assignment and its other parameter remain |
| **Requirement** | AP2474 — REQ-007 (AC 2, 3 — confirm) |
| **Route** | `/admin/earning-assignment/{id}/details` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Continue removed only the New row ("Parameter unassigned"); assignment and Used row remain. |

**Why this matters:** "Unassign" must remove one rule, not the whole assignment or a neighbouring rule. Removing the wrong row would change which earning group applies to a dealer group's contracts.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-014-<HHMM>` with Parameters A and B from AP2474_014. If AP2474_014 did not run, create it exactly as in AP2474_014 steps 1–2 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; open the details page of `QA-AP2474-014-<HHMM>` (create it and its two parameters as in AP2474_014 steps 1–2 if absent) | The parameter grid shows the "New" / Lag 0 row and the "Used" / Lag 12 row. |
| 2 | Click the trash-can icon on the Parameter A row ("New") | The confirmation modal opens. |
| 3 | Click the confirm button ("Continue", "Yes" or equivalent) | The modal closes and the details page reloads. Record any message. No HTTP 500 page. |
| 4 | [Verification] Read the parameter grid and the assignments list | The grid shows only the "Used" / Lag 12 row, unchanged. The title still reads "Earning Assignment QA-AP2474-014-<HHMM>", and the assignment is still listed at `/admin/earning-assignment`. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-005 — Add Parameter form | — | AP2474_012, AP2474_013 | AP2474_011 (defaults) | — |
| REQ-006 — Submit parameter | — | — | AP2474_011 | — |
| REQ-007 — Remove parameter | AP2474_015 | AP2474_014 | — | — |

**Whole-ticket coverage (all three files):** REQ-001 → 001 · REQ-002 → 002 · REQ-003 → 003, 005, 006, 007 · REQ-004 → 004, 008 · REQ-005 → 009, 011, 012, 013 · REQ-006 → 010, 011 · REQ-007 → 014, 015. Every requirement has at least one case.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2474_011 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_011-step4-pass.png` |
| AP2474_012 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_012-step4-pass.png` |
| AP2474_013 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_013-step5-pass.png` |
| AP2474_014 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_014-step5-pass.png` |
| AP2474_015 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_015-step4-pass.png` |

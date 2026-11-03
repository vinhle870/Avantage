# Test Cases — AP2474 (File 4 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2474 — Earning Assignment
**Source:** requirements/AP-2474-earning-assignment.md · qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2474_test-plan.md · qa-artifacts/3-test-cases/AP2474_ReviewFindings_2026-10-04.md (Pass 2 proposals #1–#3, promoted at Gate B on 2026-10-04)
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2474_016 to AP2474_018 (3 test cases)
**Coverage:** Negative · Cross-entity

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` (list) → `/admin/earning-assignment/{id}/details` → "Add Parameter" modal. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` (French login page). | `env` |
| **Test data** | Earning groups (seeded "AV+" plus `QA-AP2472-…` groups), warranty programs, vehicle makes — read only. Seeded assignment "AV+" — never touched. | `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2474_016 creates `QA-AP2474-016-<HHMM>` with one or two parameters. AP2474_017 creates `QA-AP2474-017-<HHMM>` and any parameter the system accepts. AP2474_018 creates `QA-AP2474-018A-<HHMM>` and `QA-AP2474-018B-<HHMM>`, one parameter on A. All stay on staging. | `cleanup` (missing) |

**Assignment naming.** `QA-AP2474-<TC number>-<HHMM>`, where `<HHMM>` is the 24-hour time at creation.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2474_016 | Adding a parameter identical to one already on the assignment is refused, or saved as a second row — recorded | Negative | Medium | PASS |
| AP2474_017 | A parameter with "Sale Date from" filled and "Sale Date to" left blank is refused or saved cleanly, without an error page | Negative | Medium | PASS |
| AP2474_018 | A parameter added to one assignment appears only on that assignment, not on another | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2474_016 — Adding a parameter identical to one already on the assignment is refused, or saved as a second row — recorded

| Field | Value |
|---|---|
| **TC ID** | AP2474_016 |
| **Title** | Adding a parameter identical to one already on the assignment is refused, or saved as a second row — recorded |
| **Requirement** | AP2474 — REQ-006 (overlap — not stated; Q-011) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Identical parameter saved as a second row (Q-011 observation); first row unchanged. |

**Why this matters:** Two identical rules on one assignment would match the same contracts; if the second pointed at a different earning group, it would be unclear which applies. The ticket does not say whether duplicates are allowed, so a refusal **or** a second row both pass and are recorded for Q-011. The case **fails** only on an HTTP 500 page or if the first row is changed.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-016-<HHMM>`, Earning Set "Profit", Dealer Group "group c", Is Enabled? Yes |
| Parameter (both times) | Condition "New", first Coverage Code, Sale Dates 2026-01-01 / 2026-12-31, odometer 0 / 9999999, Model Year Age -1 / 99, first Make, Lag "0", Earning Group "AV+" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; create assignment `QA-AP2474-016-<HHMM>` (Profit / group c / Yes) via "Create New" → **"Save"** | Its details page opens. |
| 2 | [Pre-Condition] "Add Parameter" with the Test Data values → **"Submit"** | One parameter row appears. |
| 3 | Click "Add Parameter" again, enter exactly the same values, click **"Submit"** | Either a message refuses the duplicate (record the wording) or the modal closes and the page reloads. No HTTP 500 page. |
| 4 | [Verification] Read the parameter grid | Either one row (refused) or two identical rows (saved — recorded as an observation for Q-011). The first row's values are unchanged in both outcomes. |

---

### AP2474_017 — A parameter with "Sale Date from" filled and "Sale Date to" left blank is refused or saved cleanly, without an error page

| Field | Value |
|---|---|
| **TC ID** | AP2474_017 |
| **Title** | A parameter with "Sale Date from" filled and "Sale Date to" left blank is refused or saved cleanly, without an error page |
| **Requirement** | AP2474 — REQ-005 (required fields — not stated; Q-006) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Blank Sale Date to refused with "This value should not be blank."; no row. |

**Why this matters:** A half-empty date range might be stored as a range that matches nothing, or crash the page. The ticket does not say whether the dates are required or whether an open-ended range is allowed, so a refusal or a clean save both pass. The case **fails** on an HTTP 500 page, or on a saved row whose Sale Date cell is unreadable (for example "2026-01-01 - " with no indication of an open end is recorded, not failed).

**Test Data:**

| Variable | Value |
|---|---|
| Assignment | `QA-AP2474-017-<HHMM>`, Earning Set "Statutory", Dealer Group "Group D", Is Enabled? Yes |
| Parameter | Condition "Used", first Coverage Code, **Sale Date from 2026-01-01, Sale Date to blank**, odometer and model-year defaults, first Make, Lag "6", Earning Group "AV+" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; create assignment `QA-AP2474-017-<HHMM>` (Statutory / Group D / Yes) via "Create New" → **"Save"** | Its details page opens with an empty parameter grid. |
| 2 | Click "Add Parameter"; enter the Test Data values, leaving "Sale Date to" empty | Every other field shows its value; "Sale Date to" is empty. |
| 3 | Click **"Submit"** | Either a message refuses the blank date (record the wording), or the modal closes and the page reloads. No HTTP 500 page. |
| 4 | [Verification] Read the parameter grid (reload the page first) | Refused: no row. Saved: one row whose Sale Date cell shows 2026-01-01 and an empty or open "to" side — recorded as an observation for Q-006. |

---

### AP2474_018 — A parameter added to one assignment appears only on that assignment, not on another

| Field | Value |
|---|---|
| **TC ID** | AP2474_018 |
| **Title** | A parameter added to one assignment appears only on that assignment, not on another |
| **Requirement** | AP2474 — REQ-006 (AC 1 — "available in the Earning Assignment parameter datagrid") |
| **Route** | `/admin/earning-assignment/{idA}/details`, `/admin/earning-assignment/{idB}/details` |
| **Type** | Functional · Cross-entity |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — v2staging, admin portal (log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md`) |
| **Result** | PASS — Parameter only on assignment A; B empty; AV+ unchanged. |

**Why this matters:** If parameters were shared between assignments, changing one dealer group's earning rules would silently change another's.

**Test Data:**

| Variable | Value |
|---|---|
| Assignment A | `QA-AP2474-018A-<HHMM>`, Earning Set "Profit", Dealer Group "Group B", Is Enabled? Yes |
| Assignment B | `QA-AP2474-018B-<HHMM>`, Earning Set "Reinsurance", Dealer Group "Group A", Is Enabled? Yes |
| Parameter on A | Condition "Used", first Coverage Code, Sale Dates 2026-03-01 / 2026-03-31, odometer 500 / 5000, Model Year Age 1 / 3, first Make, Lag "12", Earning Group "AV+" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Logged in as admin; create Assignment A and then Assignment B via "Create New" → **"Save"** (values in Test Data); note each `{id}` | Two details pages are reached, each with an empty parameter grid. |
| 2 | Open Assignment A's details page; "Add Parameter" with the Test Data values → **"Submit"** | Assignment A's grid shows one row "Used", "2026-03-01 - 2026-03-31", "500 - 5000", "1 - 3", Lag "12", "AV+". |
| 3 | Open Assignment B's details page | The page "Earning Assignment QA-AP2474-018B-<HHMM>" loads. |
| 4 | [Verification] Read Assignment B's parameter grid, then the "AV+" seeded assignment's grid via its View link | Assignment B's grid is empty. The seeded "AV+" grid shows the same rows recorded in AP2474_002 step 5, with no "500 - 5000" row added. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-005 — Add Parameter form | — | AP2474_017 | — | — |
| REQ-006 — Submit parameter | AP2474_018 | AP2474_016 | — | AP2474_018 (seeded "AV+" unchanged) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2474_016 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_016-step4-pass.png` |
| AP2474_017 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_017-step4-pass.png` |
| AP2474_018 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_018-step4-pass.png` |

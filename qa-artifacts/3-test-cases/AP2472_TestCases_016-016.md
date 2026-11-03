# Test Cases — AP2472 (File 4 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2472 — Earning Groups Management
**Source:** requirements/AP-2472-earning-groups-management.md · qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2472_test-plan.md
**Date:** 2026-10-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2472_016 to AP2472_016 (1 test case)
**Coverage:** Functional

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | Not known as a URL. Reach it from the admin sidebar: **Risk Management → Earning Groups**. | `navigation` (feature not yet in `qa-docs`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` ("Courriel", "Mot de passe", "Se connecter"). | `env` |
| **Test data** | **Curve X:** an existing, enabled test curve (`QA-AP2471-…` or `QA-AP2472-…`), as in File 3. | `test-data` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | One group, renamed to `QA-AP2472-Edited-<HHMM>`, with Curve X assigned. | `cleanup` (missing) |

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2472_016 | Editing a group's name and default method saves both, and its assigned curves are kept | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2472_016 — Editing a group's name and default method saves both, and its assigned curves are kept

| Field | Value |
|---|---|
| **TC ID** | AP2472_016 |
| **Title** | Editing a group's name and default method saves both, and its assigned curves are kept |
| **Requirement** | AP2472 — REQ-008 (AC 1, minimum behaviour in AC 2) |
| **Route** | Group details page → "Edit" |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Edit modal (Name + method only, no Is Enabled?) saved QA-AP2472-Edited-2339 / Reverse rule of 78; Curve X kept; old name gone from the list. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The ticket shows an "Edit" item but never says what it does. This case tests only the minimum the label implies: the same fields can be changed and the change is kept. Everything else, such as which fields appear and whether "Is Enabled?" can be set here, is recorded as an observation for Q-002 and Q-006.

**Test Data:**

| Variable | Original value | New value |
|---|---|---|
| Name | `QA-AP2472-Edit-<HHMM>` | `QA-AP2472-Edited-<HHMM>` |
| Default Earning Method | Pro-Rata | Reverse rule of 78 |
| Assigned curve | Curve X | Curve X (unchanged) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Edit-<HHMM>` with "Pro-Rata", submit, then choose Curve X in "Earning Curve" and submit | The details page "Earning Group QA-AP2472-Edit-<HHMM>" lists Curve X. |
| 2 | Click "Edit" in the details page navigation | A form opens (modal or page, recorded) pre-filled with Name `QA-AP2472-Edit-<HHMM>` and "Pro-Rata". Every field the form shows is recorded, including any "Is Enabled?" control. |
| 3 | Change "Name" to `QA-AP2472-Edited-<HHMM>`, select "Reverse rule of 78" and submit | The form closes, and the user lands on the group's details page (or the landing page is recorded). |
| 4 | [Verification] Verify the details page and the list | The title reads "Earning Group QA-AP2472-Edited-<HHMM>", and Curve X is still in the grid. On the Earning Groups list, the row shows the new name and "Reverse rule of 78", and no row with the old name remains. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works. Covers all four files._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | AP2472_001 | — | — | AP2472_001 |
| REQ-002 — List page (title, Create New, columns, View) | AP2472_002, AP2472_004 | — | — | — |
| REQ-002 AC 3 — Earning curves column with odometer range | AP2472_010, AP2472_011 | — | — | — |
| REQ-003 — Create New modal fields and default | AP2472_003 | AP2472_005, AP2472_006, AP2472_008 | AP2472_007 | — |
| REQ-004 — Create, redirect, details title, Edit nav item | AP2472_004 | AP2472_005 | AP2472_007 | — |
| REQ-005 — Assign a curve | AP2472_009 | AP2472_012, AP2472_013 | — | — |
| REQ-005 AC 3 — One curve in several groups | AP2472_011 | — | — | AP2472_015 |
| REQ-006 — Assigned-curves grid columns and values | AP2472_009 | — | — | — |
| REQ-007 — Unassign with confirmation | AP2472_015 | AP2472_014 | — | AP2472_015 |
| REQ-008 — Edit group (minimum) | AP2472_016 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2472_016 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_016-step4-ListEditedRow_pass.png` |

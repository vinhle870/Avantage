# Test Cases — AP2472 (File 2 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2472 — Earning Groups Management
**Source:** requirements/AP-2472-earning-groups-management.md · qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2472_test-plan.md
**Date:** 2026-10-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2472_006 to AP2472_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | Not known as a URL. Reach it from the admin sidebar: **Risk Management → Earning Groups**. If AP2472_001 has already recorded the route, use it directly. | `navigation` (feature not yet in `qa-docs`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` ("Courriel", "Mot de passe", "Se connecter"). | `env` |
| **Test data** | **Curve X:** any existing, enabled earning curve, read only. Prefer one named `QA-AP2471-…` (made by the AP-2471 run) so no real curve is touched. If none exists, create `QA-AP2472-Curve-A` via Risk Management → Earning Curves → "Create New": Name `QA-AP2472-Curve-A`, Term month `12`, Coverage odometer from `0`, to `50000`, type "Pro-Rata", Is Enabled? Yes → Save. Record which curve was used and its Name, Term month, odometer range, type and enabled state, read from the Earning Curves list. | `test-data` (earning curves not yet registered) |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2472_006 may leave two groups named `QA-AP2472-Dup-<HHMM>`. AP2472_007 leaves one group with a 255-character name and one named `QA-AP2472 É & <b>x</b>`. AP2472_009 and AP2472_010 each leave one group with Curve X assigned. Nothing is deleted. | `cleanup` (missing) |

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2472_006 | Creating a second group with the same name as an existing one is refused, or the duplicate is recorded | Negative | Medium | PASS |
| AP2472_007 | A 255-character name and a name with accents, "&" and HTML tags are stored and shown exactly as typed | Edge-case | Medium | PASS |
| AP2472_008 | Cancelling the Create New modal after typing a name creates no group | Negative | Low | PASS |
| AP2472_009 | Assigning an earning curve adds it to the group's grid with the curve's name, term, odometer range and type | Functional | High | PASS |
| AP2472_010 | The Earning Groups list shows each group's assigned curves with their odometer ranges | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2472_006 — Creating a second group with the same name as an existing one is refused, or the duplicate is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2472_006 |
| **Title** | Creating a second group with the same name as an existing one is refused, or the duplicate is recorded |
| **Requirement** | AP2472 — REQ-003 (risk: uniqueness not stated; Q-001) |
| **Route** | Earning Groups list → "Create New" |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Observation for Q-001: the duplicate name was accepted silently; two rows QA-AP2472-Dup-2339 (ids 3 and 4). Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** Two groups with the same name look identical wherever a group is picked later, so an admin could pick the wrong one. The ticket does not say names must be unique. **Judging:** PASS if the duplicate is refused with a message. If the duplicate is accepted, mark the case PASS with an observation rather than FAIL, because no criterion forbids it, and add the outcome to Q-001.

**Test Data:**

| Variable | Value |
|---|---|
| Name (both times) | `QA-AP2472-Dup-<HHMM>` |
| Default Earning Method | Pro-Rata (default) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Dup-<HHMM>` in "Name" and submit | The group is created and its details page opens. |
| 2 | Open Risk Management → Earning Groups, click "Create New", enter the same name `QA-AP2472-Dup-<HHMM>` and submit | Either the form refuses it with a message saying the name already exists (exact text recorded), or a second group is created (recorded). |
| 3 | [Verification] Open the Earning Groups list and count the rows named `QA-AP2472-Dup-<HHMM>` | One row means the duplicate was refused. Two rows means it was accepted, which is recorded as an observation for Q-001. |

---

### AP2472_007 — A 255-character name and a name with accents, "&" and HTML tags are stored and shown exactly as typed

| Field | Value |
|---|---|
| **TC ID** | AP2472_007 |
| **Title** | A 255-character name and a name with accents, "&" and HTML tags are stored and shown exactly as typed |
| **Requirement** | AP2472 — REQ-003 (AC 2), REQ-004 (AC 3) |
| **Route** | Earning Groups list → "Create New" → details page |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | 255-character name saved in full; special name stored and shown literally with <b> escaped. The long name pushes the View button off-screen. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The admin UI is used in a French-speaking market, so accented names are normal. A name containing `<b>` that renders as bold text would mean user input is placed in the page without escaping. That is a script-injection weakness, not just a display bug.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Long name | `QA-AP2472-Long-` followed by `x` repeated 240 times | 255 characters in total, a common database column limit |
| Special name | `QA-AP2472 É & <b>x</b>` | Accent, ampersand and an HTML tag |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open Risk Management → Earning Groups | The Earning Groups page loads. |
| 2 | Click "Create New", enter the 255-character long name and submit | Either the group is created and its details page opens, or a length message is shown (exact text and limit recorded). A server error page is a FAIL. |
| 3 | Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472 É & <b>x</b>` and submit | The group is created and its details page opens. |
| 4 | [Verification] Verify the details title and the list row show the special name literally | The title reads "Earning Group QA-AP2472 É & <b>x</b>" with the `<b>` tags visible as text, not rendered as bold. The list row shows the same text. If the long name was accepted, its row shows the full name, or a visibly truncated version that is recorded. |

---

### AP2472_008 — Cancelling the Create New modal after typing a name creates no group

| Field | Value |
|---|---|
| **TC ID** | AP2472_008 |
| **Title** | Cancelling the Create New modal after typing a name creates no group |
| **Requirement** | AP2472 — REQ-003 (AC 1; risk: modal controls not described) |
| **Route** | Earning Groups list → "Create New" |
| **Type** | Negative |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | No cancel/close control exists; Escape closed the modal and no QA-AP2472-Cancel group was created. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2472-Cancel-<HHMM>` |
| Default Earning Method | Reverse rule of 78 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open Risk Management → Earning Groups | The Earning Groups page loads. |
| 2 | Click "Create New", enter `QA-AP2472-Cancel-<HHMM>` in "Name" and select "Reverse rule of 78" | The modal shows the typed name and the chosen method. |
| 3 | Close the modal using its cancel or close (×) control. If neither exists, press Escape, and record which control was used | The modal closes without submitting. |
| 4 | [Verification] Reload the list and search the rows for `QA-AP2472-Cancel-<HHMM>` | No row with that name exists. |

---

### AP2472_009 — Assigning an earning curve adds it to the group's grid with the curve's name, term, odometer range and type

| Field | Value |
|---|---|
| **TC ID** | AP2472_009 |
| **Title** | Assigning an earning curve adds it to the group's grid with the curve's name, term, odometer range and type |
| **Requirement** | AP2472 — REQ-005 (AC 1, AC 2), REQ-006 (AC 1–3) |
| **Route** | Group details page — assign-curve form and assigned-curves grid |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Curve X (QA-AP2472-Curve-A) assigned; grid headers exact; row "12 \| 0 - 50000 \| Pro-Rata \| Yes" with trash icon matches the curve. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** Putting curves into a group is the purpose of the feature. If the grid shows the wrong term or mileage range, an admin cannot check the group is right.

**Test Data:**

| Variable | Value |
|---|---|
| Group name | `QA-AP2472-Assign-<HHMM>` |
| Default Earning Method | Pro-Rata |
| Curve to assign | Curve X (see Execution Context), with its Name, Term month, odometer from/to, type and enabled state written down before step 3 |
| Expected grid columns | Name · Term month · Coverage odometer · Earning curve type · Is Enabled? · Actions |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Open Risk Management → Earning Curves and write down Curve X's Name, Term month, Coverage odometer, Earning curve type and Is Enabled? | Curve X's five values are recorded in the log. |
| 2 | [Pre-Condition] Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Assign-<HHMM>` with "Pro-Rata" and submit | The details page "Earning Group QA-AP2472-Assign-<HHMM>" opens, with an assign form ("Earning Curve" select and a submit button) and an empty assigned-curves grid. |
| 3 | In the "Earning Curve" select, choose Curve X and click the assign form's submit button | The page reloads or updates, and Curve X appears as a row in the grid below. |
| 4 | [Verification] Verify the grid headers and Curve X's row | The headers are "Name", "Term month", "Coverage odometer", "Earning curve type", "Is Enabled?" and "Actions". The row shows Curve X's name, Term month, odometer as "{from} - {to}", type and enabled state, all matching step 1. The Actions cell has a trash can icon. |

---

### AP2472_010 — The Earning Groups list shows each group's assigned curves with their odometer ranges

| Field | Value |
|---|---|
| **TC ID** | AP2472_010 |
| **Title** | The Earning Groups list shows each group's assigned curves with their odometer ranges |
| **Requirement** | AP2472 — REQ-002 (AC 3) |
| **Route** | Earning Groups list |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | List cell shows "QA-AP2472-Curve-A (0 - 50000)"; an empty group shows "None". Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The list's "Earning curves" column is the only overview of which curves each group holds. If it is stale or blank after an assignment, the admin will assume the group is empty.

**Test Data:**

| Variable | Value |
|---|---|
| Group | `QA-AP2472-Assign-<HHMM>` from AP2472_009 if it exists. Otherwise create `QA-AP2472-List-<HHMM>` as in step 1 |
| Curve | Curve X (see Execution Context) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Use group `QA-AP2472-Assign-<HHMM>` if it holds Curve X. Otherwise open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-List-<HHMM>` with "Pro-Rata", submit, then on the details page choose Curve X in "Earning Curve" and submit | A group exists with Curve X assigned. |
| 2 | Open Risk Management → Earning Groups | The list page loads. |
| 3 | [Verification] Verify the "Earning curves" cell of the group's row | The cell lists Curve X's name together with its odometer range (for example "… 0 - 50000"). The exact format is recorded. An empty group's row from AP2472_004 is checked and its display recorded for comparison. |

---

## Coverage Matrix

See the combined matrix in AP2472_TestCases_016-016.md, which covers all four files.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2472_006 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_006-step3-DuplicateNameAccepted_pass.png` |
| AP2472_007 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_007-step4-SpecialNameDetailsLiteral_pass.png` |
| AP2472_008 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_008-step4-NoCancelGroupCreated_pass.png` |
| AP2472_009 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_009-step4-CurveXRowInGrid_pass.png` |
| AP2472_010 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_010-step3-ListEarningCurvesCell_pass.png` |

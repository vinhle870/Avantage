# Test Cases — AP2472 (File 3 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2472 — Earning Groups Management
**Source:** requirements/AP-2472-earning-groups-management.md · qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2472_test-plan.md
**Date:** 2026-10-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2472_011 to AP2472_015 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · Regression

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
| **Test data** | **Curve X:** an existing, enabled earning curve that is clearly test data. **Use only a curve named `QA-AP2471-…` or `QA-AP2472-…` in this file**, because AP2472_015 checks whether unassigning deletes the curve itself. If none exists, create `QA-AP2472-Curve-A` via Risk Management → Earning Curves → "Create New": Name `QA-AP2472-Curve-A`, Term month `12`, Coverage odometer from `0`, to `50000`, type "Pro-Rata", Is Enabled? Yes → Save. | `test-data` (earning curves not yet registered) |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2472_011 and AP2472_015 each leave two groups (`…-G1-…`, `…-G2-…`). AP2472_012 to AP2472_014 each leave one group. Assignment links made by AP2472_014 and AP2472_015 are partly removed by the cases themselves. | `cleanup` (missing) |

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2472_011 | The same earning curve can be assigned to two different groups at the same time | Functional | High | PASS |
| AP2472_012 | Assigning a curve that is already in the group does not create a second, duplicate row | Negative | Medium | PASS |
| AP2472_013 | Submitting the assign form with no curve selected adds nothing and shows a message or does nothing | Negative | Low | FAIL |
| AP2472_014 | Clicking the trash can asks "Are you sure to delete this record?", and Cancel keeps the curve in the group | Negative | Medium | PASS |
| AP2472_015 | Unassigning a curve from one group leaves it in the other group and in the Earning Curves list | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2472_011 — The same earning curve can be assigned to two different groups at the same time

| Field | Value |
|---|---|
| **TC ID** | AP2472_011 |
| **Title** | The same earning curve can be assigned to two different groups at the same time |
| **Requirement** | AP2472 — REQ-005 (AC 3 — Ken Nguyen's comment of 2026-09-23) |
| **Route** | Group details pages |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Curve X assigned to Multi-G1 and Multi-G2; it stayed in G1 and both list cells show it. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The product owner confirmed that one curve can belong to several groups. If assigning it to a second group silently moves it out of the first, the first group loses a curve without anyone noticing.

**Test Data:**

| Variable | Value |
|---|---|
| Group 1 | `QA-AP2472-Multi-G1-<HHMM>`, Pro-Rata |
| Group 2 | `QA-AP2472-Multi-G2-<HHMM>`, Rule of 78 |
| Curve | Curve X (see Execution Context) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Multi-G1-<HHMM>` with "Pro-Rata", submit, then choose Curve X in "Earning Curve" and submit | Group 1's details page lists Curve X in its grid. |
| 2 | Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Multi-G2-<HHMM>` with "Rule of 78" and submit | Group 2's details page opens with an empty grid. |
| 3 | Choose Curve X in "Earning Curve" and submit | Curve X is listed in Group 2's grid. Curve X still appears in the select box, or its absence is recorded. |
| 4 | [Verification] Open Group 1's details page via its "View" action and check its grid | Curve X is still listed in Group 1. On the list page, both groups' "Earning curves" cells show Curve X. |

---

### AP2472_012 — Assigning a curve that is already in the group does not create a second, duplicate row

| Field | Value |
|---|---|
| **TC ID** | AP2472_012 |
| **Title** | Assigning a curve that is already in the group does not create a second, duplicate row |
| **Requirement** | AP2472 — REQ-005 (risk: duplicate assignment not addressed; Q-004) |
| **Route** | Group details page |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Once assigned, Curve X is removed from the group's select; a forced resubmit was refused with "This value is not valid."; Curve X listed once. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** A curve listed twice in one group could be counted twice wherever the group is used. **Judging:** PASS if the curve is hidden from the select once assigned, or the second assignment is refused with a message, or no second row appears. FAIL if a duplicate row is created. Cite Q-004 in the bug.

**Test Data:**

| Variable | Value |
|---|---|
| Group | `QA-AP2472-Dup2-<HHMM>`, Pro-Rata |
| Curve | Curve X (see Execution Context) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Dup2-<HHMM>` with "Pro-Rata", submit, then choose Curve X in "Earning Curve" and submit | The group's grid lists Curve X once. |
| 2 | Open the "Earning Curve" select again and look for Curve X | Curve X is either missing from the options (recorded, and step 3 is skipped) or still offered. |
| 3 | If Curve X is still offered, choose it and submit | Either a message refuses it (exact text recorded), or the page reloads. |
| 4 | [Verification] Count Curve X's rows in the group's grid | Curve X appears exactly once. |

---

### AP2472_013 — Submitting the assign form with no curve selected adds nothing and shows a message or does nothing

| Field | Value |
|---|---|
| **TC ID** | AP2472_013 |
| **Title** | Submitting the assign form with no curve selected adds nothing and shows a message or does nothing |
| **Requirement** | AP2472 — REQ-005 (risk: empty submit not described) |
| **Route** | Group details page |
| **Type** | Negative |
| **Priority** | Low |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | HTTP 500 error page ("Erreur — Désolé, l'application éprouve des difficultés techniques…") when Assign is clicked with "Nothing selected" (group that already holds every curve). On a new group there is no empty option; the first curve is pre-selected. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** An empty submit that produces a blank row or a server error would leave a broken record in the group. **Judging:** FAIL only on a blank row or a server error page.

**Test Data:**

| Variable | Value |
|---|---|
| Group | `QA-AP2472-Empty-<HHMM>`, Pro-Rata |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Empty-<HHMM>` with "Pro-Rata" and submit | The group's details page opens with an empty grid. |
| 2 | Leave "Earning Curve" on its placeholder or first empty option (if the select has no empty option, record that and mark this case SKIPPED), then click the assign form's submit button | Either a message asks for a curve (exact text recorded), or nothing is submitted. No server error page appears. |
| 3 | [Verification] Check the assigned-curves grid | The grid is still empty, with no blank row. |

---

### AP2472_014 — Clicking the trash can asks "Are you sure to delete this record?", and Cancel keeps the curve in the group

| Field | Value |
|---|---|
| **TC ID** | AP2472_014 |
| **Title** | Clicking the trash can asks "Are you sure to delete this record?", and Cancel keeps the curve in the group |
| **Requirement** | AP2472 — REQ-007 (AC 1, AC 2) |
| **Route** | Group details page — assigned-curves grid |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Modal "Unassign earning curve" with "Are you sure you want to delete this record?" (wording differs slightly from the ticket) and Continue / No; "No" kept Curve X. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The confirmation is the only protection against removing a curve by a misclick. It must actually stop the removal when the admin backs out.

**Test Data:**

| Variable | Value |
|---|---|
| Group | `QA-AP2472-Cancel2-<HHMM>`, Pro-Rata |
| Curve | Curve X (see Execution Context) |
| Expected confirmation text | Are you sure to delete this record? |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Open Risk Management → Earning Groups, click "Create New", enter `QA-AP2472-Cancel2-<HHMM>` with "Pro-Rata", submit, then choose Curve X in "Earning Curve" and submit | The group's grid lists Curve X. |
| 2 | Click the trash can icon in Curve X's row | A modal opens with the text "Are you sure to delete this record?" and confirm and cancel buttons (labels recorded). If a browser-native dialog appears instead, record that and dismiss it in step 3. |
| 3 | Click the modal's cancel button | The modal closes. |
| 4 | [Verification] Reload the details page and check the grid | Curve X is still listed in the group. |

---

### AP2472_015 — Unassigning a curve from one group leaves it in the other group and in the Earning Curves list

| Field | Value |
|---|---|
| **TC ID** | AP2472_015 |
| **Title** | Unassigning a curve from one group leaves it in the other group and in the Earning Curves list |
| **Requirement** | AP2472 — REQ-007 (AC 2, AC 3), REQ-005 (AC 3) |
| **Route** | Group details pages; Earning Curves list |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — Staging (v2staging), Chromium 1280×800, run 5.2.0 |
| **Result** | Continue showed "Earning curve unassigned" and removed Curve X from G1 only; G2 and the Earning Curves list still hold it unchanged. Log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` |

**Why this matters:** The confirmation reads "delete this record", but the action is called Unassign, and curves are shared between groups. If confirming deletes the curve itself, every other group that used it loses it without warning. Contracts that rely on those groups would then have no earning pattern. **If Curve X disappears from the Earning Curves list, stop the run and report it as Critical** (test plan §6).

**Test Data:**

| Variable | Value |
|---|---|
| Group 1 (unassign from) | `QA-AP2472-Unassign-G1-<HHMM>`, Pro-Rata |
| Group 2 (control) | `QA-AP2472-Unassign-G2-<HHMM>`, Pro-Rata |
| Curve | Curve X — must be a `QA-AP2471-…` or `QA-AP2472-…` test curve (see Execution Context) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context. Create group `QA-AP2472-Unassign-G1-<HHMM>` (Pro-Rata) via Risk Management → Earning Groups → "Create New" → submit, then choose Curve X in "Earning Curve" → submit | Group 1's grid lists Curve X. |
| 2 | [Pre-Condition] Create group `QA-AP2472-Unassign-G2-<HHMM>` (Pro-Rata) the same way and assign Curve X to it | Group 2's grid lists Curve X. |
| 3 | Open Group 1's details page, click the trash can icon in Curve X's row and click the modal's confirm button | The modal closes. Curve X is no longer in Group 1's grid. Any success message is recorded. |
| 4 | [Verification] Check Group 2's details page, the Earning Groups list and Risk Management → Earning Curves | Curve X is still listed in Group 2's grid. On the list, Group 2's "Earning curves" cell shows Curve X and Group 1's does not. Curve X is still present in the Earning Curves list with its values unchanged. |

---

## Coverage Matrix

See the combined matrix in AP2472_TestCases_016-016.md, which covers all four files.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2472_011 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_011-step4-G1StillHasCurveX_pass.png` |
| AP2472_012 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_012-step4-CurveXOnceInGrid_pass.png` |
| AP2472_013 | ❌ FAIL | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step2-AssignNothingSelectedHttp500_fail.png` |
| AP2472_014 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_014-step2-UnassignConfirmModal_pass.png` |
| AP2472_015 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_015-step4-CurveXStillInCurvesList_pass.png` |

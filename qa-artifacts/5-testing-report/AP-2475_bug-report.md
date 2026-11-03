# Bug Report

**Project:** Avantage Plus v2 — Admin portal, AP-2475: Edit earning assignment parameter
**Report ID:** BR-20261004-002
**Test Cycle:** AP-2475 single-ticket STLC run, run folder 5.2.0 — 10 test cases executed on v2staging on 2026-10-04 (9 PASS, 0 FAIL, 1 BLOCKED)
**Date:** 2026-10-04
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2475_2026-10-04.md · qa-artifacts/3-test-cases/AP2475_TestCases_*.md

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 1 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 1 |

**Gate C decisions (by the QA, 2026-10-04):**
- No test case failed. **AP2475_010 was BLOCKED** because the earning assignment details page started returning HTTP 500 during its setup. The QA chose to **file it as a new bug** (BUG-001). The duplicate search found no open bug for it. The closest was AP-2478, a different HTTP 500 on the Earning Groups *Assign* action.
- The defect is in the details page delivered by **AP-2474** (*Earning Assignment*), not in the edit dialog AP-2475 adds. It is linked to both stories. Because it blocked an AP-2475 test case and is High severity, it counts as a *stopping bug* for AP-2475 under the QA outcome rules.
- **Not filed:** a backwards odometer range (from 50000, to 1000) is accepted and saved (AP2475_006). The ticket defines no validation rules, so this stays open as Q-006 for the product owner.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2475_010 | An earning assignment's details page shows an HTTP 500 error once the assignment has 11 parameters | High | P1 | [AP-2484](https://garantieavantageplus.atlassian.net/browse/AP-2484) | Open |

---

## Bug Details

---

### BUG-001 — An earning assignment's details page shows an HTTP 500 error once the assignment has 11 parameters

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2475_010 (BLOCKED at its setup step) |
| **Requirement** | AP-2475 REQ-001 / REQ-003 — the pencil icon and the edit action live on this page. The page itself is delivered by AP-2474 ("The user is redirected to the Earning Assignment details page … Datagrid Component of parameters") |
| **Severity** | High — once an assignment passes 10 parameters, an admin can no longer see, edit or delete **any** of its parameters from the screen, and the UI offers no way to recover |
| **Priority** | P1 — it blocks release of the parameter features (AP-2474, AP-2475): a realistic assignment needs more than 10 rules |
| **Environment** | Chromium (Playwright) · Windows 11 · Staging (v2staging), Admin portal · app version not exposed |
| **Tracker Ticket** | [AP-2484](https://garantieavantageplus.atlassian.net/browse/AP-2484) — created unassigned (no `bug_new_assign` setting in tools.md), priority High, labels qa-agent / stlc-automated, linked Relates → AP-2475 and AP-2474 |
| **Status** | Open |
| **First found** | 2026-10-04 |
| **Reproducibility** | Always on the affected assignment: 3 of 3 loads failed after the 11th parameter was added, including `?page=2`. The same assignment loaded normally with 9 and with 10 parameters. Not yet reproduced on a second assignment. |

**Summary:**
After an 11th parameter is added to an earning assignment, its details page (`/admin/earning-assignment/{id}/details`) returns HTTP 500 with the error page "Erreur — Désolé, l'application éprouve des difficultés techniques" on every load, so the parameter list and its edit and delete icons can no longer be reached.

**Steps to Reproduce:**

1. Sign in to the Admin portal at `https://v2staging.garantieavantageplus.ca/admin/login` with the shared admin account ("Courriel" / "Mot de passe" → **Se connecter**).
2. Open `/admin/earning-assignment/new/edit`. Enter Description `QA-500-check`, choose Earning Set **Profit** and Dealer Group **Group A**, tick **Is Enabled?**, and click **Save**. The page "Earning Assignment QA-500-check" opens, with an empty parameter list.
3. Click **Add Parameter**. In the dialog choose Condition **New**, Coverage Code **AP-CADV - Advanced**, Sale Date from **2026-01-01**, Sale Date to **2026-12-31**, Coverage odometer from **0**, Coverage odometer to **100001**, Model Year Age From **0**, Model Year Age to **5**, Make **Acura**, Lag Interval **0**, Earning Group **AV+**, then click **Submit**. The alert "Parameter added" appears and the row is listed.
4. Repeat step 3 nine more times, changing only Coverage odometer to (`100002`, `100003` … `100010`), so that the assignment has **10** parameters. After each Submit the details page reloads normally and lists every row.
5. Repeat step 3 once more with Coverage odometer to `100011` (the **11th** parameter) and click **Submit**.
6. Reload `/admin/earning-assignment/{id}/details`, then try `/admin/earning-assignment/{id}/details?page=2`.

**Expected Result:**
After step 5 the details page reloads with the alert "Parameter added" and lists all 11 parameters, each with its pencil (edit) and trash-can (unassign) icons. AP-2474 says the user is redirected to the details page and "the parameter is created and available in the Earning Assignment parameter datagrid". The page must keep working however many parameters the assignment has, or page through them.

**Actual Result:**
After step 5 the browser lands on `/admin/earning-assignment/{id}/details` with **HTTP status 500** and the French error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois.", shown in the dealer-portal layout. Every later load of the page fails the same way, with or without `?page=2`. The 11th parameter **was** saved: its edit form still opens directly at `/admin/earning-assignment/{id}/parameter/{paramId}/edit`. The Earning Assignments list and the details pages of other assignments still load, so the server itself is up.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | Embedded in the AP-2484 description (media node verified 2026-10-04). Local: `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_010-step2-Http500AfterAddRowB_fail.png` — the HTTP 500 error page shown right after the 11th parameter was submitted |
| Console log | The page request returns status 500. No other console error was captured. |

**Suggested Root Cause:**
Unknown — for dev investigation. The failure begins at exactly the 11th row, and other Risk Management lists page at 10 rows. So the parameter datagrid's pagination (building page 2, or the pager itself) is the likely cause. This is not proven.

**Notes:**
- Found on assignment #4 "QA-AP2475-011346" during the AP-2475 run. The 11th parameter was a P1-value row with Coverage odometer to `100102`. Nothing unusual about that row is known: the same values with `100101` were saved as the 10th row and the page still loaded.
- Assignment #4 is left on staging in this broken state as a ready reproduction. Deleting one of its parameters should bring it back to 10 rows, if the cause is the row count. That was not tried.
- Impact goes beyond viewing. The pencil (AP-2475) and the trash can (AP-2474) both live only on this page. Once an assignment passes 10 parameters, its rules can be neither corrected nor removed from the UI.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2475_010 (BLOCKED) |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Pencil icon in the parameter datagrid | 1 | BUG-001 (the page holding the icon fails past 10 parameters) |
| REQ-002 — Pencil opens the edit modal | 0 | — |
| REQ-003 — Changes saved and shown | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2484 | Created (stlc-bug-reporter), linked Relates → AP-2475 and AP-2474, evidence embedded and verified. A duplicate AP-2483, created by a timed-out first create call, was deleted at the QA's request on 2026-10-04 | Backlog (new) | 2026-10-04 |

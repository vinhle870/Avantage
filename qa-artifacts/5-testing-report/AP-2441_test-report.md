# Test Execution Report

**Report ID:** TR-20261104-002
**Project:** AP (Avantage)
**Test Cycle:** AP-2441 story test — "Admin: Manage user permissions from a User Details Page" — run folder no-sprint
**Application version:** Dev (https://v2dev.garantieavantageplus.ca), the build deployed on Dev on 2026-11-04. The application shows no build number. Jira lists 2 merged pull requests and a Staging deployment on 2026-08-20 for this ticket.
**Environment:** Dev
**Date:** 2026-11-04 (executed 17:01–17:10 UTC; report written 2026-11-04T17:18Z)
**Prepared by:** QA Agent — Test Reporter Skill (stlc-worker, QA batch)

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 12 of 12 test cases passed on Dev (100%, above the 90% threshold), no bug was found and none is open, and no question blocks any requirement — so the User Details page does what AP-2441 asks on the build tested.

---

## Executive Summary

AP-2441 lets an administrator manage a dealer user's access to each dealership directly
from that user's own page in the Admin Portal (the "User Details" page), instead of
opening each dealership one by one. The QA team tested it on the Dev environment with 12
test cases covering all four requirements: the four actions (Autoshield, Deal your rate,
Edit Permissions, Unlink) appear on every dealership row, the "Edit user" button does not
appear in those rows, each action does exactly what it does from the dealership's own
Users tab — for the right user and the right dealership — and clicking a row opens that
dealership. All 12 passed and no problems were found. A few behaviours the ticket does not
settle are recorded as observations for the product owner, not as failures (for example,
the page header still has an "Edit user" button). One thing to note: the ticket was in the
"QA" status rather than the usual ready-for-testing status "QC" when we tested; by the
user's decision for this batch, testing went ahead on Dev rather than waiting.

---

## Test Metrics

_The pass rate is the share of test cases that passed, out of all cases that were meant
to run (skipped cases are left out)._

| Metric | Value |
|---|:---:|
| Requirements covered | 4 of 4 |
| Total test cases | 12 |
| Passed | 12 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (12 of 12)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

Defect density (bugs per test case): 0 of 12 = 0.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet.
They come from the test plan (AP-2441_test-plan.md §5)._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (6 of 6: AP2441_001, _003, _004, _005, _007, _012) | ✅ |
| Pass rate | ≥ 90% | 100% (12 of 12) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Test user's link and roles at dealer 1510 as before execution | Restored | Restored — same 12 roles, dealer 1510 linked again; the link record's id changed from 211 to 261 and the Window Sticker badge now shows last (see Risks and Observations) | ✅ |
| Test report generated | Yes | Yes | ✅ |
| Every bug in the bug report has a tracker ticket | All | Not applicable — 0 bugs | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. AP2441_001 and
_002 count under both REQ-001 and REQ-002, so the rows add up to more than 12._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Each dealer row offers Autoshield, Deal your rate, Edit Permissions and Unlink (AP2441_001, _002, _011) | 3 | 3 | 0 | 0 | 100% |
| REQ-002 — The dealer rows have no Edit user button (AP2441_001, _002) | 2 | 2 | 0 | 0 | 100% |
| REQ-003 — Each action does the same as from Dealer Details > Users (AP2441_003–_008, _012) | 7 | 7 | 0 | 0 | 100% |
| REQ-004 — Clicking a dealer row opens that dealer's details page (AP2441_009, _010) | 2 | 2 | 0 | 0 | 100% |
| **Total (distinct cases)** | **12** | **12** | **0** | **0** | **100%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found. Gate C was skipped because no case failed (decided by the qa-reviewer, R3 round 1). | — | — | — | — | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2441-admin-manage-user-permissions-from-a.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2441_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2441_TestCases_001-005.md`, `AP2441_TestCases_006-010.md`, `AP2441_TestCases_011-012.md` | 2026-11-01, reworked 2026-11-04 |
| Review Findings | `qa-artifacts/3-test-cases/AP2441_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2441_2026-11-04.md` | 2026-11-04 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2441_bug-report.md` | 2026-11-04 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/` (22 files, including the environment check) | 2026-11-04 |
| Review record | `qa-artifacts/7-reviews/AP-2441_review.md` | 2026-11-01 to 2026-11-04 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2441_test-report.md` | 2026-11-04 |

---

## Risks and Observations

These are **record-only observations, not failures.** Each one is a point the ticket
does not settle; the test recorded what the build does instead of guessing what was
meant, and no result depends on it.

- **Q-001 — "Edit user" is still in the User Details page header.** The page header of `/admin/dealer-users/110` still carries an "Edit user" link, which opens the user's edit form. The ticket's "REMOVE EDIT USER BUTTON" applies to the dealer rows, which have none; whether the header button should also go is for the reporter to say.
- **Q-006 — "Edit user" is still on the Dealer > Users row.** The dealer's Users tab keeps its "Edit user" button (4th of 5 actions). The reporter's comment of 2026-08-24 says it stays ("The button is only removed on the User > Dealers page, not the Dealer > Users page. this is working as expected"); it is recorded rather than asserted because the reporter is in the project's `not_developers` list.
- **Q-005 — a user with no dealer left disappears from the list but their page still opens.** After AP2441_007 unlinked the test user from their only dealer, searching for them on the Dealer users list returned "No entities found", while `/admin/dealer-users/110` still opened by its URL with an empty Dealers table. An administrator could lose track of such a user.
- **Q-003 / Q-004 — the action pop-ups have no Cancel or × button.** Edit user, Auto Shield, Deal your rate, Edit permissions, Unlink and Link user all open a pop-up with only a Save, Unlink or Link button; Escape or a click outside is the only way to leave without saving. This is the same on the Dealer > Users page, so the new page matches the existing one. The Unlink confirmation reads "Unlink user {email} to {dealer}"; saving or closing returns the administrator to the page the action started from.
- **Edit permissions pop-up title.** It is headed "Link {dealer} to a user" — it names the dealership but not the user, and reads like a link form rather than an edit form. No requirement covers the title.
- **Test data left behind on Dev.** No record was created. AP2441_007 unlinked the test user (dealer-user 110, `vinhle8702@gmail.com`) from dealer 1510 and re-linked them with the same 12 roles, so the user-to-dealer link id changed from **211 to 261**. AP2441_005 switched Window Sticker off and back on, so that badge now shows last on the row (badges show in the order roles were granted). The multi-dealer user Nick Tain (dealer-user 130, dealers 1363 and 1518) was only read.
- **Ticket status at testing.** AP-2441 was in the Jira status "QA", which is not the project's ready-for-testing status ("QC"). Testing went ahead on Dev by the user's decision for this batch; the result applies to the build on Dev on 2026-11-04.

---

## Recommendations

1. Move AP-2441 forward: 12 of 12 cases passed with no bug and no blocking question, which meets the project's release rule (≥ 90% pass, no stopping bug, no open Blocking question).
2. Ask Ken Nguyen (reporter) to confirm Q-001: should the "Edit user" button in the User Details page header stay? If it should go, a follow-up change is needed.
3. Ask Ken Nguyen to confirm Q-005: should a user with no dealer still appear in the Dealer users list and search? Today they can be reached only by typing their page address.
4. Consider a Cancel or × button on the action pop-ups on both pages (Q-003/Q-004) and a clearer title for the Edit permissions pop-up — a usability improvement, not a defect of this ticket.
5. When the test data is next used, note that the test user's link at dealer 1510 on Dev is now id 261, not 211 (already recorded in the `test-data` source).

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-04 |
| QA Lead | Not known — not named in the test plan | Pending | | |
| Development Lead | Not known — not named in the test plan | Pending | | |
| Product Owner | Ken Nguyen (reporter) | Pending | | |

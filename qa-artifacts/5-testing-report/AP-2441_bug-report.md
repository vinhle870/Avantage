# Bug Report

**Project:** AP (Avantage)
**Report ID:** BR-20261104-002
**Test Cycle:** AP-2441 story test — "Admin: Manage user permissions from a User Details Page" — run folder no-sprint
**Date:** 2026-11-04 (written 2026-11-04T17:18Z)
**Reported by:** QA Agent — Bug Reporter Skill (stlc-worker, QA batch)
**Source:** qa-artifacts/3-test-cases/AP2441_TestCases_001-005.md, AP2441_TestCases_006-010.md, AP2441_TestCases_011-012.md — Execution Log qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2441_2026-11-04.md
**Environment:** Dev (https://v2dev.garantieavantageplus.ca)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects. All 12 test cases (AP2441_001–012) passed on Dev, so there is nothing to file. | — | — | — | — |

**Gate C decision (applied by reviewer):** skipped — the execution log has no FAIL
(12 PASS, 0 FAIL, 0 BLOCKED; routing.md §3 Gate C skip clause), decided by the
independent qa-reviewer (R3 round 1, APPROVE, 2026-11-04T17:16:01Z). No tracker search,
no new ticket and no comment on an existing ticket were made by this stage.

---

## Bug Details

None. No test case failed or was blocked.

**Observations that are not defects of this run.** The run recorded several behaviours
that the ticket does not settle. Each one belongs to an open Judgement question for the
reporter (Q-001 to Q-006 in the requirements analysis), so none of them is a failure and
no ticket was filed for any of them. They are listed in the test report
(AP-2441_test-report.md, *Risks and Observations*) and will reach the reporter in the
ticket comment:

- The User Details page header still has an "Edit user" button (Q-001).
- The Dealer > Users row still has its "Edit user" button, which the reporter's comment of 2026-08-24 says stays (Q-006).
- A user unlinked from their last dealer drops out of the Dealer users list and its search, but their User Details page still opens by its URL (Q-005).
- The action pop-ups (Edit user, Auto Shield, Deal your rate, Edit permissions, Unlink) have no Cancel or × button — Escape is the only way to leave without saving — the same as on the Dealer > Users page (Q-003, Q-004).

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Each dealer row on the User Details page offers Autoshield, Deal your rate, Edit Permissions and Unlink | 0 | — |
| REQ-002 — The dealer rows on the User Details page have no Edit user button | 0 | — |
| REQ-003 — Each row action does the same thing as from the Dealer Details > Users page | 0 | — |
| REQ-004 — Clicking a dealer row opens that dealer's details page | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-2441 (the tested story itself) | _(pending — Gate D, after R4)_ | _(pending)_ | — |

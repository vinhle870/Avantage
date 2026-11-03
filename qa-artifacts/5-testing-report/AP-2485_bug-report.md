# Bug Report — AP-2485

**Project:** Avantage Plus v2 — Admin portal (Jira project AP)
**Report ID:** BR-20261101-001
**Test Cycle:** Bug re-test of AP-2485 — switching a 12-month earning curve back to Pro-Rata kept the previous type's factors (run folder `no-sprint`)
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md and qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ (the user's decision for this batch, instead of staging)

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

All three test cases passed on Dev, so there is nothing to report as a defect. The bug this
ticket describes — a 12-month curve switched back to Pro-Rata keeping Rule of 78 or Reverse
rule of 78 factors — did not occur on the create page or on an existing curve's edit page.
Because this is a bug re-test, a failure would have been recorded here against AP-2485 itself,
never as a new bug; none was needed.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects found in this run | — | — | — | — |

---

## Bug Details

None. No test case failed or was blocked.

Gate C (the duplicate check before filing) was not applicable: the execution log has no FAIL,
so no bug search was made and no "file new", "comment on existing" or "not a bug" decision
was taken. Recorded by the reviewer in qa-artifacts/7-reviews/AP-2485_review.md (R3, round 1).

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
| AP-2485 — Steps to Reproduce and Expected Result (Pro-Rata factors after switching back, 12 months) | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-2485 | Re-test PASSED comment 19439 posted (Tested on: Dev (v2dev)) and read back; status moved by Gate D, re-read and confirmed. Assignee unchanged (no re-assignment on PASS) | Done | 2026-11-01T03:40:16Z |

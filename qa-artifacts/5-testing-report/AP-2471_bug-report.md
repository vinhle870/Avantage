# Bug Report

**Project:** Avantage Plus v2 — Admin portal, AP-2471: Admin: Earning Curve management
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2471 — re-run on Dev (v2dev), run folder no-sprint (17 test cases: 16 PASS, 0 FAIL, 0 BLOCKED, 1 SKIPPED)
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md · qa-artifacts/3-test-cases/AP2471_TestCases_001-005.md, _006-010.md, _011-015.md, _016-017.md

| Metric | Value |
|---|:---:|
| Total defects | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 0 |

**Gate C decisions (2026-11-02, by the reviewer, R3 APPROVE):** Gate C was not reached. The execution log has no FAIL and no BLOCKED test case, so there is nothing to file, link or dismiss. Stage s4c was skipped because there is no rule C1 ("Not a bug") decision. AP2471_015 (delete a curve) is SKIPPED, not failed: Dev has no delete control, and by the user's decision of 2026-11-02 that observation answers question Q-002 (delete is not in scope on Dev).

---

## Defect Summary

No defects were found in this cycle. Every test case that ran passed on Dev (v2dev).

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| — | — | No defects in this cycle | — | — | — | — |

---

## Bugs from the previous cycle (2026-10-04, run folder 5.2.0)

The two bugs filed in the first cycle on v2staging were re-checked by this run's test cases on Dev and did not recur. Both are now **Done** in Jira (read on 2026-11-02), so neither is still open and neither can stop the story.

| Bug ID | TC ID | Title | Severity | Tracker Ticket | Jira status (2026-11-02) | Re-checked on Dev 2026-11-02 |
|---|---|---|:---:|---|:---:|---|
| BUG-001 (2026-10-04) | AP2471_004 | Switching a 12-month curve back to Pro-Rata keeps the previous type's factors | High | [AP-2485](https://garantieavantageplus.atlassian.net/browse/AP-2485) | Done | AP2471_004 PASS — after Rule of 78 → Pro-Rata, every row shows 0.0833 and the cumulative ends at 1.0000 |
| BUG-002 (2026-10-04) | AP2471_014 | Saving a Custom curve with an empty monthly factor shows an HTTP 500 error page | Medium | [AP-2486](https://garantieavantageplus.atlassian.net/browse/AP-2486) | Done | AP2471_014 step 4 PASS — the empty box is refused with "This value should not be blank." under it; no HTTP 500 |

The full write-ups of BUG-001 and BUG-002 are in the tickets themselves and in this file's git history (version of 2026-10-04).

---

## Bug Details

None in this cycle.

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
| REQ-001 to REQ-008 | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 (2026-10-04) | AP-2485 | Created 2026-10-04 (unassigned) | Backlog | 2026-10-04 |
| BUG-002 (2026-10-04) | AP-2486 | Created 2026-10-04 (unassigned) | Backlog | 2026-10-04 |
| BUG-001 (2026-10-04) | AP-2485 | Status read back — no action by this run | Done | 2026-11-02 |
| BUG-002 (2026-10-04) | AP-2486 | Status read back — no action by this run | Done | 2026-11-02 |

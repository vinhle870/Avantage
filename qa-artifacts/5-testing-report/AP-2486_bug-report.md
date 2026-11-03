# Bug Report — AP-2486

**Project:** Avantage Plus v2 — Admin portal (Jira project AP)
**Report ID:** BR-20261101-001
**Test Cycle:** Bug re-test of AP-2486 — saving a Custom earning curve with an empty Monthly Factor box showed an HTTP 500 error page (run folder `no-sprint`)
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2486_2026-11-01.md and qa-artifacts/3-test-cases/AP2486_TestCases_001-003.md
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
ticket describes — clicking "Save" on a Custom earning curve with one Monthly Factor box empty
returned the French "Erreur — Désolé, l'application éprouve des difficultés techniques" page
with HTTP 500 — did not occur on the edit page or on the create page. Instead the page was shown
again with the message "This value should not be blank." under the empty box, and nothing was
saved. Because this is a bug re-test, a failure would have been recorded here against AP-2486
itself, never as a new bug; none was needed.

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
was taken. Recorded by the reviewer in qa-artifacts/7-reviews/AP-2486_review.md (R3, round 1, APPROVE).

One observation is not a defect and was not filed: after the refused save on the create page
(AP2486_002), the screenshot shows the row 1–3 Monthly Factor boxes with a grey background. It
was not checked whether those boxes were still editable. It is outside every expected result
and is listed in the test report as unverified (reviewer R3 F-2).

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
| AP-2486 — Steps to Reproduce and Expected Result (empty Custom Monthly Factor on Save, Edit and Create) | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| — | AP-2486 | Re-test PASSED comment 19440 posted (Tested on: Dev (v2dev)) and read back; status moved by Gate D, re-read and confirmed. Assignee unchanged (no re-assignment on PASS) | Done | 2026-11-01T03:55:25Z |

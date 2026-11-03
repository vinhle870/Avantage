# Test Execution Report

**Report ID:** TR-20261101-001
**Project:** Avantage Plus (AP) — AP-2374 *Status Change email notification: Add notify email and client email*
**Test Cycle:** Run folder 3.6.0 (fix version) — one ticket, 10 test cases
**Application version:** Dev build at https://v2dev.garantieavantageplus.ca on 2026-11-01 (no build number shown by the application)
**Tested on:** Dev (v2dev) — chosen by the user for this run; Staging was not opened
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill (inside stlc-ticket-pipeline, `AP-2374 --from s5`)

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 4 of 10 test cases passed (40%, against the 90% the project requires), one defect (AP-2509) is open against the first acceptance criterion, and two Blocking questions (Q-001, Q-010) are unanswered, so three of the five requirements could not be judged.

---

## Executive Summary

AP-2374 lets an admin who changes a claim's status send an email about it to the client
and to a second "notify" address. We ran 10 checks on the Dev site: 4 passed, 1 failed
and 5 could not be finished. What works: when an admin moves a claim to *Authorized* or
*Refused* with the "Notify by email" box ticked, the client receives a "Claim updated"
email with a PDF of the claim; leaving the box unticked sends nothing; and an empty or
invalid address list causes no error. What fails: the "Notify by email" box is missing
for 7 of the 9 statuses an admin can choose, so for statuses such as *Paid* or
*Cancelled* the client cannot be told at all (filed as AP-2509). What is still unknown:
nothing on the Dev site lets anyone enter the claim's "notify" address, so we could not
check that the second address receives the email (question Q-010), the wording the email
must use is still unanswered (Q-001), and the claim's own files could not be attached
because uploading a file to a claim fails on Dev with a server error.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 have test cases; 3 of 5 could be judged at all (REQ-001, REQ-002 in part, REQ-003 in part) |
| Total test cases | 10 |
| Passed | 4 (40%) |
| Failed | 1 (10%) |
| Blocked | 5 |
| Skipped | 0 |
| **Pass rate** | **40% (4 of 10)** — the share of all cases, except skipped ones, that passed |
| Pass rate threshold | 90% (`story_pass_threshold`) |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Defect density: 0.1 (1 defect over 10 test cases).

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 20% — 1 of 5 High cases reached a verdict (AP2374_001); 002, 003, 004 and 006 are BLOCKED | ❌ |
| Every test case has a status other than Not Run | 10 of 10 | 10 of 10 | ✅ |
| Pass rate | ≥ 90% | 40% (4 of 10) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 0 | ✅ |
| Q-001 (Blocking) answered | Yes | No — asked in comment 19433, no reply | ❌ |
| Q-010 (Blocking) answered | Yes | No — asked for the first time in this run's result comment | ❌ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._ A test case
that checks two requirements is counted under each.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — "Notify by email" checkbox on the Change status form | 1 (001) | 0 | 1 | 0 | 100% |
| REQ-002 — Recipient field pre-filled with notify email + client email | 4 (001, 002, 008, 009) | 2 | 1 | 1 | 75% |
| REQ-003 — Email sent to the recipient list | 5 (003, 004, 007, 009, 010) | 3 | 0 | 2 | 60% |
| REQ-004 — Message text of the email | 1 (005) | 0 | 0 | 1 | 0% |
| REQ-005 — Attachments: claim files + claim PDF | 2 (006, 010) | 1 | 0 | 1 | 50% |
| **Total** | **13 (10 distinct cases)** | **6** | **2** | **5** | **62%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | "Notify by email" checkbox and recipient field appear only on the Authorized and Refused Change status forms; Pending has a different label; 6 forms have neither | Medium | P2 | REQ-001, REQ-002 | [AP-2509](https://garantieavantageplus.atlassian.net/browse/AP-2509) | Open |

Per test case:

| TC ID | Title | Priority | Status | Bug / reason |
|---|---|:---:|:---:|---|
| AP2374_001 | Change status shows "Notify by email" and "Recipient email(s)" | High | FAIL | AP-2509 |
| AP2374_002 | Recipient field pre-filled with notify email + client email | High | BLOCKED | Q-010 |
| AP2374_003 | Status change with notify ticked emails both recipients | High | BLOCKED | Q-010 |
| AP2374_004 | Second status change also emails both recipients | High | BLOCKED | Q-010 |
| AP2374_005 | Email states claim ID and new status in the ticket's wording | Medium | BLOCKED | Q-001 |
| AP2374_006 | Email carries the claim's file and a PDF of the claim | High | BLOCKED | Attachment upload HTTP 500 on Dev (environment) |
| AP2374_007 | Unticked "Notify by email" — status saved, no email | Medium | PASS | — |
| AP2374_008 | Claim with no notify email still lists the client email | Medium | PASS | — |
| AP2374_009 | Invalid / emptied recipient list — no error, no email | Medium | PASS | — |
| AP2374_010 | Claim with no attachments still sends the email | Low | PASS | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2374-status-change-email-notification-notify-email.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md` (Q-010 raised to Blocking 2026-11-01) | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2374_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2374_TestCases_001-005.md`, `AP2374_TestCases_006-010.md` | 2026-11-01 |
| Review Findings | `qa-artifacts/3-test-cases/AP2374_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-01.md` | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2374_bug-report.md` | 2026-11-01 |
| Review record | `qa-artifacts/7-reviews/AP-2374_review.md` (R1–R3) | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/` (15 files) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2374_test-report.md` | 2026-11-01 |

---

## Risks and Observations

- **Q-010 — the claim's notify email cannot be set on Dev.** Neither the dealer "File a claim" form nor the admin claim form has a notify-email input, so the recipient list only ever holds the contract client's email. Half of AC 2 and the "both recipients" part of AC 3 cannot be tested; AP2374_002–004 stay BLOCKED until the author answers. The client-email half works.
- **Q-001 — message wording still unanswered** (comment 19433). The emails received carry a status-specific body (Refused / Authorized letters) but no "The claim ID … has been updated to status …" sentence — the symptom of the earlier bug AP-2392. AP2374_005 stays BLOCKED.
- **Environment observation (not filed, outside AP-2374's scope): admin claim "Add attachment" returns HTTP 500 on Dev** (`/admin/claim/331/upload-attachment`, PNG, types "Other" and "Work order", 2 of 2 tries). It blocks the claim-files half of AC 5 (AP2374_006). The dealer "Upload work order" accepts PDF only.
- **Pass results rest on Dev only.** The test cases name Staging; this run used Dev by the user's decision.
- The emails' attached PDF (`claim-331.pdf`, `claim-332.pdf`) is a valid PDF named after the claim; its content (Q-009) was not judged.
- Test data left on Dev: quote 6454 (quote 6455 abandoned), warranty contract 26df1-844 (warranty 844, invoice #937), claims 331 (status Refused) and 332 (Authorized); Yopmail inboxes `client.stage.930` (empty) and `client.stage.931` (3 emails).

---

## Recommendations

1. Fix AP-2509: put the "Notify by email" checkbox and the "Recipient email(s)" field on every Change status form (and align the Pending form's label), then re-test with `AP-2374 --from s4`.
2. Ken Nguyen to answer Q-010 — where a claim's notify_email is set, or whether an input for it belongs to this ticket — so AP2374_002–004 can run.
3. Ken Nguyen to answer Q-001 (comment 19433) so the message wording of AP2374_005 can be judged.
4. Have the Dev admin claim attachment upload (HTTP 500) looked at, or seed an attachment on a claim, so AP2374_006 can run.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-01 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known — no developer is named on AP-2374 | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

# Test Execution Report

**Report ID:** TR-20261115-001
**Project:** Avantage Plus (AP) — AP-2374 *Status Change email notification: Add notify email and client email*
**Test Cycle:** Run folder 3.6.0 (fix version) — one ticket, 11 test cases (AP2374_002–006 and AP2374_011 run on 2026-11-15; AP2374_001 and AP2374_007–010 carried from 2026-11-01)
**Application version:** Dev build at https://v2dev.garantieavantageplus.ca on 2026-11-15 (the Admin API error names release folder 79; no build number is shown in the application)
**Tested on:** Environment: Dev (v2dev) — `execution_env: Dev` in the tool registry
**Date:** 2026-11-15
**Prepared by:** QA Agent — Test Reporter Skill (inside stlc-ticket-pipeline, `AP-2374 --from file-bugs --until report`, batch qa-agent 2026-11-15)
**Supersedes:** TR-20261101-001 (40%, 4 of 10)

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 8 of 11 test cases passed (73%, below the 90% the project requires), and two Medium defects are open — AP-2509 (the "Notify by email" box is missing from 7 of the 9 status forms) and AP-2565 (the emails do not say which claim changed or to what status); one case could not run because claim file upload is broken on Dev.

---

## Executive Summary

AP-2374 lets an admin who changes a claim's status send an email about it to the client
and to a second "notify" address stored on the claim. We ran 11 checks on the Dev site:
8 passed, 2 failed and 1 could not be finished. What works: when an admin moves a claim to
*Authorized* or *Refused* with "Notify by email" ticked, the recipient box is pre-filled
with both the notify address and the client's address, and both people receive a "Claim
updated" email with a PDF of the claim; removing an address from the box means that person
is not emailed; unticking the box, or leaving the box empty or invalid, sends nothing and
causes no error. What fails: the "Notify by email" box appears on only 2 of the 9 statuses
an admin can choose (AP-2509), and the emails never contain the sentence the ticket asks
for — "The claim ID … has been updated to status …" — so a recipient cannot see which
claim changed without opening the PDF (AP-2565, the same problem earlier reported as
AP-2392). What is still unknown: whether the claim's own files are attached to the email,
because uploading a file to a claim fails on Dev with a server error. The story stays in
QC until both defects are fixed and the upload works.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 have test cases; 4 of 5 fully judged (REQ-005 in part — AP2374_006 BLOCKED) |
| Total test cases | 11 |
| Passed | 8 (73%) |
| Failed | 2 (18%) |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **73% (8 of 11)** — the share of all cases, except skipped ones, that passed |
| Pass rate threshold | 90% (`story_pass_threshold`) |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 2 | 0 | 2 |
| Low | 0 | 0 | 0 |
| **Total** | **2** | **0** | **2** |

Defect density: 0.18 (2 defects over 11 test cases).

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 83% — 5 of 6 High cases reached a verdict (001, 002, 003, 004, 011); AP2374_006 BLOCKED by the Dev environment | ❌ |
| Every test case has a status other than Not Run | 11 of 11 | 11 of 11 | ✅ |
| Pass rate | ≥ 90% | 73% (8 of 11) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 0 | ✅ |
| No Blocking question Open | 0 | 0 — Q-001–Q-008 Accepted, Q-009 and Q-010 Answered | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._ A test case
that checks two requirements is counted under each; Coverage is the share of its cases
that reached PASS or FAIL.

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — "Notify by email" checkbox on the Change status form | 1 (001) | 0 | 1 | 0 | 100% |
| REQ-002 — Recipient field pre-filled with notify email + client email | 4 (001, 002, 008, 009) | 3 | 1 | 0 | 100% |
| REQ-003 — Email sent to the recipient list | 6 (003, 004, 007, 009, 010, 011) | 6 | 0 | 0 | 100% |
| REQ-004 — Message text of the email | 1 (005) | 0 | 1 | 0 | 100% |
| REQ-005 — Attachments: claim files + claim PDF | 2 (006, 010) | 1 | 0 | 1 | 50% |
| **Total** | **14 (11 distinct cases)** | **10** | **3** | **1** | **93%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | "Notify by email" checkbox and recipient field appear only on the Authorized and Refused Change status forms; Pending has a different label; 6 forms have neither | Medium | P2 | REQ-001, REQ-002 | [AP-2509](https://garantieavantageplus.atlassian.net/browse/AP-2509) | Open (Backlog, carried) |
| BUG-002 | Claim status-change emails do not contain "The claim ID … has been updated to status …" | Medium | P2 | REQ-004 | [AP-2565](https://garantieavantageplus.atlassian.net/browse/AP-2565) | Open (Backlog, filed 2026-11-15) |

Per test case:

| TC ID | Title | Priority | Status | Bug / reason |
|---|---|:---:|:---:|---|
| AP2374_001 | Change status shows "Notify by email" and "Recipient email(s)" | High | FAIL | AP-2509 (carried from 2026-11-01) |
| AP2374_002 | Notify email + client email pre-filled, comma-separated, on more than one status | High | PASS | — |
| AP2374_003 | Authorizing with "Notify by email" ticked emails both addresses | High | PASS | — |
| AP2374_004 | Refusing with "Notify by email" ticked also emails both addresses | High | PASS | — |
| AP2374_005 | Each email contains "The claim ID … has been updated to status …" | Medium | FAIL | AP-2565 |
| AP2374_006 | Email carries the claim's file and the claim PDF | High | BLOCKED | Dev environment: claim attachment upload HTTP 500 (admin form and Admin API) |
| AP2374_007 | Unticked "Notify by email" saves and sends no email | Medium | PASS | — (2026-11-01) |
| AP2374_008 | No notify email → client email alone, no stray comma | Medium | PASS | — (2026-11-01) |
| AP2374_009 | Invalid or emptied list saves and emails no one | Medium | PASS | — (2026-11-01) |
| AP2374_010 | Claim with no files sends the email with only the claim PDF | Low | PASS | — (2026-11-01) |
| AP2374_011 | Notify address removed from the list before Authorizing → only the client is emailed | High | PASS | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2374-status-change-email-notification-notify-email.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md` (re-run, knowledge lookup) | 2026-11-15 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2374_test-plan.md` (v2.0) | 2026-11-15 |
| Test Cases | `qa-artifacts/3-test-cases/AP2374_TestCases_001-005.md`, `AP2374_TestCases_006-010.md`, `AP2374_TestCases_011-011.md` | 2026-11-15 |
| Review Findings | `qa-artifacts/3-test-cases/AP2374_ReviewFindings_2026-11-15.md` | 2026-11-15 |
| Execution Log | `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-15.md` (and `…_2026-11-01.md` for the carried cases) | 2026-11-15 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2374_bug-report.md` (BR-20261115-001) | 2026-11-15 |
| Review record | `qa-artifacts/7-reviews/AP-2374_review.md` (R1–R3) | 2026-11-15 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/` (39 files, 14 from 2026-11-15) | 2026-11-15 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2374_test-report.md` | 2026-11-15 |

---

## Risks and Observations

- **AP2374_006 is blocked by the Dev environment, not by the feature.** Dev cannot create …/uploads/claim_attachments/ — claim attachment upload returns HTTP 500 on the admin form and the Admin API; AP2374_006 re-runs once the folder is writable. Until then nobody has seen a claim's own file arrive with the email (REQ-005 AC 1). Not filed as a bug (Gate C, R3).
- **AP-2565 repeats AP-2392.** AP-2392 (Done) reported the same missing sentence; it is reproduced on Dev 2026-11-15 on claim 333. AP-2392 was left Done and linked to the new bug rather than reopened.
- **The notify email can only be set through the Admin API** (`POST /api/admin/claim`, AP-2357 / AP-2372) and is not shown on the admin claim page; it shows only in the Change status pre-fill. The API also rejects a body without an `items` array (HTTP 400), which an integrator may trip over.
- **Generate Contract on Dev now requires a Financing company**; the earlier delivery-date warning still shows and does not block. Setup only.
- **Pass results rest on Dev only**, the environment named by `execution_env`. AP2374_007–010 passed on 2026-11-01 and were not re-run.
- Q-001–Q-008 are Accepted (no Story defines them, so the current behaviour was recorded and accepted, except that AC 4's sentence is still required); Q-009 and Q-010 are Answered. No question is open.
- Test data left on Dev: quote 6708, contract 26df1-851 (invoice #955), claim 333 (Authorized, notify email `client.stage.2374001@yopmail.com`, no attachment), emails in `client.stage.2374001` (2) and `client.stage.2374002` (3). The `cleanup` source is missing, so nothing was deleted. The next AP-2374 run uses inboxes 2374003/2374004.

---

## Recommendations

1. Fix AP-2509: put the "Notify by email" checkbox and the "Recipient email(s)" field on every Change status form (and align the Pending form's label "Notify customer by email").
2. Fix AP-2565: add "The claim ID <number> has been updated to status <status>" to the status-change emails (both the Authorized and the Refused letters).
3. Make the Dev folder `uploads/claim_attachments/` writable (or seed a file on a claim), so AP2374_006 can run.
4. Then re-test with `AP-2374 --from execute` — AP2374_001, AP2374_005 and AP2374_006 — using fresh inboxes 2374003/2374004.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-15 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known — no developer is named on AP-2374 | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

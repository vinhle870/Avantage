# Test Plan

**Plan ID:** TP-20261101-AP2441
**Project:** Avantage Plus v2 — Admin Portal, dealer-user management (AP-2441)
**Version:** 1.0
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md
**Total requirements:** 4

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that every dealer row on the Admin Portal's Dealer User Details page offers the four actions the ticket names — Autoshield, Deal your rate, Edit Permissions and Unlink — and no "Edit user" button (REQ-001, REQ-002).
2. Prove that each of those actions does the same thing from the User Details page as it does from the Dealer Details > Users page for the same user and dealer — in particular that Edit Permissions and Unlink act on the right user and the right dealer (REQ-003).
3. Confirm that cancelling Edit Permissions or Unlink leaves the user's access unchanged, so an administrator cannot change access by accident (REQ-003, negative).
4. Confirm that clicking a dealer row opens that dealer's details page, and that clicking an action button inside the row does not (REQ-004).
5. Confirm that the Dealer Details > Users page, the reference page for this story, still offers its actions after the change (regression — re-checking something that worked before), and record its Edit user button for Q-006.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Four actions on each dealer row of the Dealer User Details page | Functional · Edge-case · UI · Regression |
| REQ-002 | No Edit user button in the dealer rows | Functional · UI · Regression |
| REQ-003 | Autoshield, Deal your rate, Edit Permissions and Unlink behave as on Dealer Details > Users | Functional · Negative · Regression |
| REQ-004 | A row click opens the dealer details page | Functional · Edge-case |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| What Autoshield and Deal your rate mean as business features | The ticket only requires parity with the existing Dealer Details > Users page; their own behaviour is not part of this story (Q-007, Info). |
| Admin roles other than the one Staging account | Only one admin account exists on Staging, so access by role cannot be tested (Q-008, Info). |
| The Dealer Portal (what the dealer user sees after a permission change) | The ticket covers the admin pages only. A permission change is judged on the admin Roles column, not by logging in as the dealer user, whose password is not held by QA. |
| Performance, accessibility and API testing | The change is a small UI addition with no stated performance or accessibility requirement and no API of its own. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | The two admin pages exercised end to end in a real browser on Staging | QA Agent |
| Integration Testing | Not applicable — the ticket exposes no API; data changes are judged on the admin pages that read them | — |
| Regression Testing | The Dealer Details > Users page keeps its actions after the change | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Open the User Details page, check each row's controls, and perform each action on this ticket's own test user and dealer | playwright |
| Negative | Open Edit Permissions and Unlink and back out without saving or confirming; check nothing changed | playwright |
| Edge-case | A user linked to several dealers (every row carries the actions and opens its own dealer) | playwright |
| UI / Visual | Screenshots of the rows and tooltips on both pages, so the controls can be compared side by side | playwright screenshots |
| API | Not applicable — no API in scope | — |

**The comparison method.** The acceptance criterion's oracle (the reference a result is
judged against) is the Dealer Details > Users page for the same user and dealer. Every
REQ-003 case therefore first records what the action does from that page, then performs it
from the User Details page and compares. Where the ticket is silent (Q-001 to Q-006) the
expected result is **record-only**: the case fails only on an objective fault — an error
page or HTTP 5xx, a change applied to the wrong user or dealer, or a value lost.

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (`mcp__playwright__*`, see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

The pipeline also needs the `tracker` capability (**jira**, through the `tools/jira-cli` wrapper) for the s7 story comment. `notify` is `disabled` and not needed; `vcs` (**github**) is used only by automation after execution.

This run is **design-only**: the ticket's status "QA" does not map to the ready-for-QA status ("QC"), so the build on Staging may not be the one under test. Execution waits until the ticket is in QC.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] AP-2441 is in the ready-for-QA status ("QC"), or the QA lead confirms the Staging build contains it (Jira shows 2 merged pull requests and a Staging deployment on 2026-08-20)
- [ ] Application is deployed and accessible at the Staging URL in the `env` source
- [ ] `qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md` exists and has been reviewed (Gate A passed, rule A3)
- [ ] The `AP2441_TestCases_*.md` files exist with at least 10 test cases
- [ ] Test environment is stable (no known blocking infrastructure issues)
- [ ] Test data is in place: dealer 1510 "Vinh le 2" still has the user `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") linked, as in the ticket's 2026-08-23 screenshot
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the project's `story_pass_threshold`, chosen so that one failure in ten cases still lets a story move only when nothing serious is broken
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ **0** open — a High bug on this page would mean an action changes the wrong user's or dealer's access
- [ ] Dealer 1510's test user has the same link and the same roles it had before execution (every Configuration change restored)
- [ ] `qa-artifacts/5-testing-report/AP-2441_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2441_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- A restore step fails — the test user cannot be re-linked to dealer 1510 or its roles cannot be put back. Stop before any further data-changing case, so the environment is not left further altered.

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect
- The test user's link and roles on dealer 1510 match the record taken before the failed case

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | Staging (v2staging) — the URL in the `env` source (`qa-artifacts/base-test/execute.env.md`) |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 (`admin_viewport`) |
| **OS** | Windows 11 (the QA workstation) |
| **Application version** | Not known — the footer shows "Avantage Plus System v2.0.0", and no build number is published per deployment |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin login | The one Staging account that serves the Admin Portal | Static — the Admin Portal login in the `env` source; never copied into a test case |
| Test dealer user | `vinhle8702@gmail.com`, shown as "Vinh le2 Vinh Le2" — dealer-user row 110 in `/admin/dealer-users` (seen 2026-08-29), linked to dealer 1510 | Exists. Taken from this ticket's own QA screenshot (2026-08-23); no other ticket's artifacts reference it |
| Test dealer | Dealer **1510**, "Vinh le 2", Users tab `/admin/dealer/1510/users` | Exists (same source) |
| A user linked to two or more dealers | Any existing dealer user whose Dealers table has at least two rows — used only to look at, never to change | Found at run time by a read-only search of `/admin/dealer-users`; recorded in the execution log |
| A permission to toggle | "Window Sticker" — one of the role badges seen on the test user's row; chosen because switching it briefly has no effect outside the admin pages during a test | Toggled and restored inside the case |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this
table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic
values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied — it exists, nothing depends on how it was made, nothing consumes it | Named in the Execution Context, resolved from `env` |
| Test dealer user `vinhle8702@gmail.com` and its link to dealer 1510 — read-only cases (AP2441_001, _003, _004, _009, _011) | Static | None applied — read and compared, never changed | Named in the Execution Context |
| The test user's **roles on dealer 1510** — Edit Permissions cases | Configuration | Q5 — the case changes them, and they are environment data other runs reuse | Original badges recorded in step 1, changed, and restored inside the same case |
| The test user's **link to dealer 1510** — Unlink cases | Configuration | Q5 — the case removes it; every other case depends on it | Original link and roles recorded in step 1, unlinked, re-linked with "Link user" and the same roles inside the same case |
| Autoshield and Deal your rate state for the test user and dealer 1510 | Configuration | Q5 — undecided whether the action changes anything (Q-007), so treated as a change | The case records what the action shows before acting, and undoes any change from the same control before it ends |
| A user linked to two or more dealers | Static (read-only, selected at run time) | None applied — it is only looked at, never changed, consumed or compared on creation values | Found by a read-only search in a `[Pre-Condition]` step; if none is found the case is BLOCKED, never satisfied by linking a user to someone else's dealer |

**Cost of the data-changing cases.** Nothing is created. The Edit Permissions and Unlink
cases each take two to three minutes including the restore, call no third party, and leave
nothing behind when the restore succeeds. **Dealer 1380** — the shared dealership many other
tickets test on — is deliberately not used: adding or removing its users could change what
other tickets' runs see (for example who receives its notifications).

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| The build on Staging does not contain the change (ticket in "QA", not "QC") | Medium — the status is unmapped, though Jira shows a Staging deployment on 2026-08-20 | High — every result would describe the wrong build | Design only now; execute when the ticket reaches QC |
| Unlinking the test user from its only dealer removes the user or makes it unreachable, so the restore fails | Low — Unlink on Dealer > Users is expected to remove only the link | High — dealer 1510 would lose its only user | Run the Unlink cases last; record the user's dealers first; suspend on a failed restore (§6) |
| The action icons are unlabelled, so a tester clicks the wrong one | Medium | Medium — a false PASS or FAIL | Identify each control by its tooltip and by comparison with the same row on Dealer Details > Users; screenshot both |
| Autoshield or Deal your rate changes a setting immediately (Q-007) | Medium | Medium | Try it first from the reference page, record what it does, undo it from the same control |
| The User Details page route is not mapped | High — it has never been opened by QA | Low — it is reached from `/admin/dealer-users` | Record its URL in the execution log and write it back to the `domain` source |
| The admin list searches ignore URL parameters (`env` source note) | High | Low | Type into the search box and submit the form, never pass `?…_search[...]=` in the URL |
| Ambiguous points Q-001 to Q-006 | High | Medium | Record-only expected results; the s7 comment asks the reporter |
| playwright unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-11-01 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-11-01 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-11-01 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| When AP-2441 reaches QC | Execution | Manual test execution via playwright — read-only cases first, Edit Permissions next, Unlink last | stlc-manual-executor |
| Same day | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| Same day | Reporting | Test report generation | stlc-test-reporter |
| Same day | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer | Review artifacts, approve sign-off checklist |
| Developer | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen, reporter) | Answer Q-001 to Q-006; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team

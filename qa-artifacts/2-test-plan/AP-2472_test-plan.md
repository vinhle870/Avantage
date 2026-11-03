# Test Plan

**Plan ID:** TP-20261003-002
**Project:** Avantage Plus v2 — Admin portal, AP-2472: Earning Groups Management
**Version:** 1.0
**Date:** 2026-10-03
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md
**Total requirements:** 8 (REQ-001 – REQ-008)

> **Gate A note.** The QA asked the agent to make the Gate A and Gate B decisions. The agent continued past Gate A because every requirement has at least one acceptance criterion. REQ-008 (Edit) has only one: the nav item exists. For Edit, this plan tests only the minimum the "Edit" label implies. Anything beyond that is recorded as an observation, not a pass or fail.

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that all acceptance criteria in REQ-001 to REQ-007 are met under normal conditions, and that the minimum behaviour implied for REQ-008 holds.
2. Prove that unassigning a curve from one group removes only that link. The curve must stay in every other group it belongs to and in the Earning Curves list. This is the highest-impact risk in the ticket (REQ-007, Q-003), because curves are shared between groups.
3. Confirm that one earning curve can belong to several groups at once, as Ken Nguyen stated on 2026-09-23.
4. Record how the forms handle invalid input: a blank or duplicate group name, a duplicate curve assignment, and submitting with no curve selected. The ticket defines no validation, so these are reported as observations that feed the open questions.
5. Detect defects before the feature reaches production.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | "Earning Groups" menu item under Risk Management | Functional · UI · Regression |
| REQ-002 | Earning Groups list page | Functional · UI · Regression |
| REQ-003 | "Create New" modal form | Functional · Negative · Edge-case · UI |
| REQ-004 | Creating a group and opening its details page | Functional · Negative · Regression |
| REQ-005 | Assigning an earning curve to a group | Functional · Negative · Edge-case · Regression |
| REQ-006 | Datagrid of assigned earning curves | Functional · UI |
| REQ-007 | Unassigning a curve, with confirmation | Functional · Negative · Regression |
| REQ-008 | Editing a group — minimum only | Functional · Negative |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Creating, editing or deleting earning curves | That is AP-2471. This run only reads existing curves and assigns them. |
| Deleting an earning group | The user story says only "create", and no delete action is listed (Q-010). |
| Earning Sets and Earning Assignments | These are separate Risk Management items, and this ticket does not describe them. |
| Downstream use of a group's default earning method or "Is Enabled?" state | No acceptance criterion describes it (Q-002, Q-007). |
| Role-based access (non-admin or restricted admin) | Only one admin account is available, and the ticket names no roles (Q-009). |
| Performance, accessibility and API testing | The ticket does not call for them. The project tests through the UI only (`api-baseline` is `missing` in the knowledge registry). |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the admin screens in a real browser on v2staging. | QA Agent |
| Integration Testing | Integration testing checks that two parts of the system work together. Here it is limited to Earning Groups reading Earning Curves (AP-2471), checked in the UI: a curve's name, term, odometer range and type shown in a group must match the curve's own record. | QA Agent |
| Regression Testing | Regression testing means re-checking that something that used to work still works. Here it confirms that unassigning does not change the Earning Curves list, and that the Risk Management sidebar still loads. | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step. Compare the values each grid shows with the source curve's record. | playwright |
| Negative | Submit a blank name, a duplicate name, no curve selected, and the same curve twice. Cancel the unassign confirmation. Record whether the form refuses each one and what message it shows. | playwright |
| Edge-case | A group with no curves (empty state), a group with several curves, one curve in two groups, and a long name (255 characters) with special characters (`É & <b>`) to check that it is stored and displayed safely. | playwright |
| UI / Visual | Page titles, nav items, column headers, modal text and the default selection, checked against the accessibility snapshot and screenshots. | playwright screenshots |
| API | Not used. See §2.2. | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

The Earning Groups route is not yet recorded in the `navigation` or `domain` sources. The executor reaches it through the sidebar (Risk Management → Earning Groups), records the routes it finds, and writes them back to `qa-artifacts/qa-docs/` as the knowledge contract requires.

Capability groups this run needs (from `mcp-tools.md` §7):
- `browser` (playwright, `active`) is required for s4.
- `tracker` (jira via the CLI, `active`) is needed for bugs and the summary comment.
- `notify` is `disabled`, so no notification step runs.

---

## 4. Entry Criteria

_Entry criteria are what has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The application is deployed and reachable at `https://v2staging.garantieavantageplus.ca`, and the admin login works.
- [ ] `qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md` exists and has been reviewed. Gate A was passed on 2026-10-03.
- [ ] At least one `qa-artifacts/3-test-cases/AP2472_TestCases_*.md` file exists, with at least 10 test cases. That is enough to give every REQ at least one case, and REQ-005 and REQ-007 one positive and one negative case each.
- [ ] The test environment is stable, with no known blocking infrastructure issues. The `agent-coordination` c2 health check passes.
- [ ] Test data is ready: the shared admin account resolves from the `env` source, and **at least two enabled earning curves exist**. If fewer exist, the run creates them through AP-2471's screen (see §8).
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds.

---

## 5. Exit Criteria

_Exit criteria are what has to be true before we can say testing is finished and the release is safe to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed. These are the cases for REQ-003, REQ-004, REQ-005 and REQ-007.
- [ ] Test pass rate ≥ **90%** of judged cases. That allows one failing low-impact UI case without hiding a data defect, because any data defect is High and is covered by the next two lines.
- [ ] Zero **Critical** severity bugs remain open. Unassign deleting a shared curve would be Critical.
- [ ] **High** severity bugs ≤ **0** open. A group that does not save, or a curve that silently fails to attach, blocks the feature's purpose.
- [ ] `qa-artifacts/5-testing-report/AP-2472_test-report.md` has been generated and reviewed.
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2472_bug-report.md`.

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect. For example, if create fails, every details-page case is blocked.
- A **Critical** severity bug is found that prevents further execution. One example is unassign deleting the curve record: continuing would destroy more shared staging data.

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca`. The Admin Portal is at `/admin/login`. The feature's route is not known yet; it is reached through the sidebar (Risk Management → Earning Groups), and the route is recorded during s4. |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 (`admin_viewport` in tools.md) |
| **OS** | Windows 11 (the QA agent host) |
| **Application version** | Not known. The ticket carries no fix version, and the staging build number is not exposed. Results are filed under run folder `5.2.0`, as chosen by the QA. |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/` |
| **Bug tracker** | jira (via `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin account | The shared admin login from the `env` source. It has full admin rights. | Static — resolved from `qa-artifacts/base-test/execute.env.md` |
| Earning curves (at least 2) | Existing earning curves to assign. Read only: never edited or deleted by this run. Prefer curves named `QA-AP2471-…`, made by the AP-2471 run. | If fewer than two exist, create `QA-AP2472-Curve-A` (Pro-Rata, 12 months, 0 – 50000) and `QA-AP2472-Curve-B` (Rule of 78, 24 months, 0 – 100000) via Earning Curves → Create New |
| Earning group records | Each named `QA-AP2472-<purpose>-<HHMM>`, so it is unique and clearly marked as test data. | Created in each case's `[Pre-Condition]` step, or by the case's own steps |
| Boundary inputs | Blank name, a name equal to an existing group's, a 255-character name, the name `QA-AP2472 É & <b>x</b>`. | Typed inline in the step |

### 6.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login (`env` source) | Static | None applied | Named in the Execution Context and resolved from `env`. |
| Existing earning curves (to assign) | Static (read only) | None applied — the case reads their name, term, range and type at run time and does not change them | Named in the Execution Context as "any two enabled curves". The case records which ones it used. If fewer than two exist, a `[Pre-Condition]` step creates them (see §8). |
| An earning group to view, assign to, unassign from or edit | Dynamic | Q1 — it does not exist yet. Q2 — the assertions depend on its name and default method. | Created in a `[Pre-Condition]` step with explicit field values. |
| A curve assigned to a group | Dynamic | Q2 — the unassign assertions depend on which curve is in which group. | Assigned in a `[Pre-Condition]` step. |
| Earning groups made by other people | Static (read only) | None applied | Never edited by this run. They are only observed in the list. |

**Cost of the Dynamic items:** creating a group takes about 15 seconds through the modal, and assigning a curve takes about 10 seconds. Neither calls a third party. Each run leaves its `QA-AP2472-…` groups on staging, because the `cleanup` source is `missing` and the feature has no delete action. Unassigning removes the links the run made, but not the groups. One group may be reused across the read-only cases of a run, but every case still states how to create one when it is absent.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unassign deletes the shared earning curve rather than the link ("delete this record"), which would remove it from other groups. | Medium | High | Test it only on a curve this run created, or one that is already clearly test data. Assign that curve to two test groups first, then check both the other group and the Earning Curves list afterwards. If the curve disappears, stop and file it as Critical. |
| The "Is Enabled?" value has no source on the create form, so its expected value is unknown. | High | Medium | Record the value a new group shows as an observation, not a pass or fail (Q-002). |
| Fewer than two earning curves exist, because AP-2471's own save defect may have blocked their creation. | Medium | High | Check the Earning Curves list before s4. Create Pro-Rata or Rule of 78 curves, not Custom ones, which are reported as not saving. |
| The Earning Groups route is not in the knowledge sources, so the test cases cannot give it. | High | Low | Navigate through the sidebar, record the routes during s4, and write them back to `qa-docs/`. |
| Ambiguous ACs: Edit behaviour and validation are not described. | High | Medium | Test only the minimum, label everything else an observation, and state the gap in the test report. |
| Unstable test environment. Staging is shared. | Medium | High | Run the c2 health check before s4, and stop if it fails. |
| Test groups accumulate on staging, because no cleanup source or delete action exists. | High | Low | Use the `QA-AP2472-` prefix so they are easy to find later. |
| playwright unreachable, or the browser profile is locked by a leftover Chrome (seen on 2026-09-13). | Low | High | Run the preflight before starting. Kill the stale `mcp-chrome` process if the browser reports "already in use". |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-10-03 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-10-03 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-10-03 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-10-03 | Execution | Manual test execution via playwright | stlc-manual-executor |
| 2026-10-03 | Reporting | Bug reporting + ticket creation (after Gate C) | stlc-bug-reporter |
| 2026-10-03 | Reporting | Test report generation | stlc-test-reporter |
| 2026-10-03 | Closure | Tracker ticket update (Gate D) | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Runs every STLC stage for AP-2472, generates all artifacts, and decides at Gates A and B (delegated by the QA). |
| QA Lead / Human reviewer (Vinh Le) | Decides at Gates C and D, approves the sign-off checklist, and confirms bugs before they are filed. |
| Developer (Minh Lưu) | Fixes defects, answers Q-004 and Q-008, and confirms fixes before a re-test. |
| Product Owner (Ken Nguyen) | Answers the open questions, especially Q-002 (Is Enabled?) and Q-003 (what unassign deletes), and approves the exit criteria. |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%, zero open High bugs)
- [ ] Risk mitigations acknowledged by team

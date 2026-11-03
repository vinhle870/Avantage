# Test Plan

**Plan ID:** TP-20261004-001
**Project:** Avantage Plus v2 — Admin portal, AP-2475: Edit earning assignment parameter
**Version:** 1.0
**Date:** 2026-10-04
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2475_requirements-analysis.md
**Total requirements:** 3 (REQ-001 – REQ-003)

> **Gate A note.** The QA chose *Continue* at Gate A on 2026-10-04 even though REQ-003 (Save) has no explicit acceptance criterion. For REQ-003 this plan tests only what the user story promises: after Save, the same parameter row shows the new values and the old values are gone, including after a page reload. The success message and landing page are recorded as observations, not judged.

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify the acceptance criteria of REQ-001 and REQ-002: each parameter row on an earning assignment details page has a pencil (edit) icon, and clicking it opens an edit form in a modal dialog.
2. Verify that the edit form opens **pre-filled with the parameter's current values**. A blank or default-filled form would make an admin who changes one field silently reset the other ten. That would change which earning group applies to which contracts.
3. Verify the user-story minimum for REQ-003: a changed value is saved to the **same** row, no duplicate row is created, the other rows and fields stay as they were, and the change survives a reload.
4. Record how the form handles input the ticket does not rule on: a range entered backwards ("from" greater than "to") and non-numeric text in a numeric field. These are reported as observations that feed open question Q-006, unless the application crashes or loses data.
5. Confirm the existing trash-can (Unassign) action still works next to the new icon (regression), and detect defects before the feature reaches production.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Pencil (edit) icon in the Actions column of the parameter datagrid | Functional · UI · Regression |
| REQ-002 | Clicking the pencil opens the edit modal, pre-filled with the parameter's fields | Functional · Edge-case · UI |
| REQ-003 | Changes are saved to the same parameter and shown in the datagrid (user-story minimum) | Functional · Negative · Edge-case · Regression |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Creating earning assignments and adding parameters (AP-2474) | They belong to AP-2474. They are used here only as test setup. A failure there makes an AP-2475 case BLOCKED, not FAIL. |
| Optional fields and the "All" placeholder (AP-2476) | AP-2476 was in *PR opened* on 2026-10-04, so it is not on staging yet. No case relies on which fields are required. |
| Default values of the parameter form ("Coverage odometer to" 9999999 vs 999999) | Defaults apply to a new parameter, not an edit. The conflict between AP-2474 and AP-2476 is raised as Q-007 instead. |
| Editing the earning assignment itself (the details page's **Edit** nav item) | This edits the assignment's description, set, dealer group and enabled flag, not a parameter. AP-2474 owns it. |
| Effect of an edited parameter on earning results for contracts | No ticket describes the link, and it cannot be observed from the admin UI. |
| Role-based access (restricted admin) | Only one admin account is available, and the ticket names no roles. |
| Performance, accessibility, API testing | Not suggested by the ticket. The project tests through the UI only (`api-baseline` is `missing` in the knowledge registry). |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the admin screens in a real browser on v2staging. | QA Agent |
| Integration Testing | Not applicable. The ticket defines no API contract. Save is checked through what the UI shows after a reload. | — |
| Regression Testing | Regression testing means re-checking that something that used to work still works. Here it confirms the AP-2474 trash-can (Unassign) action and the other parameter rows are unaffected by the new edit action. | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step: icon present → modal opens → values pre-filled → change saved. | playwright |
| Negative | Save a range entered backwards (odometer from 50000, to 1000) and non-numeric text in a numeric field. Record whether the form refuses it and what it shows. | playwright |
| Edge-case | Change every editable field at once; change a select box to a different option; edit one of two rows and confirm the other row is untouched; edit so that two rows become identical. | playwright |
| UI / Visual | Pencil icon in the Actions column, modal title and field labels, checked against the accessibility snapshot and screenshots. | playwright screenshots |
| API | Not used. See §3.1. | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Capability groups this run needs (from `mcp-tools.md` §7):
- `browser` (playwright, `active`) is required for s4.
- `tracker` (jira via the CLI, `active`) is needed for bugs and the result comment.
- `notify` is `disabled`, so no notification step runs.

---

## 4. Entry Criteria

_Entry criteria are what has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The application is deployed and reachable at `https://v2staging.garantieavantageplus.ca`, and the admin login works.
- [x] `qa-artifacts/1-requirements-analysis/AP-2475_requirements-analysis.md` exists. Gate A was passed on 2026-10-04 by the QA.
- [ ] At least 1 `qa-artifacts/3-test-cases/AP2475_TestCases_*.md` file exists, with at least one case per requirement.
- [ ] The test environment is stable, with no known blocking infrastructure issues. The `agent-coordination` c2 health check passes.
- [ ] The AP-2474 flow works on staging: an earning assignment can be created and a parameter added to it. Without it no AP-2475 case can start.
- [x] Test data is ready: the shared admin account resolves from the `env` source. Assignments and parameters are created by the run itself (see §8).
- [x] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md`.

---

## 5. Exit Criteria

_Exit criteria are what has to be true before we can say testing is finished and the release is safe to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed. These are the REQ-002 pre-fill case and the REQ-003 save cases.
- [ ] Test pass rate ≥ **90%** of judged cases (`story_pass_threshold` in `tools.md`). With about ten cases, 90% allows one failing low-impact case, such as a label, while any failure of pre-fill or save still blocks release through the next line.
- [ ] Zero **Critical** severity bugs remain open.
- [ ] **High** severity bugs ≤ **0** open. An edit that is not saved, saves to the wrong row, or resets other fields means the story is not delivered and earning rules could be corrupted.
- [ ] `qa-artifacts/5-testing-report/AP-2475_test-report.md` has been generated and reviewed.
- [ ] Every FAIL is filed, linked or dismissed in `qa-artifacts/5-testing-report/AP-2475_bug-report.md`.

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect. For example, if Add Parameter (AP-2474) fails, every case is blocked; if Save fails, every persistence case is blocked.
- A **Critical** severity bug is found that prevents further execution

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` — Admin Portal at `/admin/login`. Earning Assignments list at `/admin/earning-assignment`, details at `/admin/earning-assignment/{id}/details` ([risk-management.md](../qa-docs/risk-management.md)). The parameter form's route is **not known** and will be recorded during execution. |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 (`admin_viewport` in tools.md) |
| **OS** | Windows 11 (the QA agent host) |
| **Application version** | Not known. The ticket carries no fix version, and the staging build number is not exposed. Results are filed under run folder `5.2.0`, confirmed by the QA at Gate A. |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/` |
| **Bug tracker** | jira (via `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin account | The shared admin login from the `env` source. It has full admin rights. | Static — resolved from `qa-artifacts/base-test/execute.env.md` |
| Earning assignment | One assignment for the run, description `QA-AP2475-{HHMMSS}`, earning set *Profit*, dealer group *Group A*, enabled. Kept separate from the seeded "AV+" assignment, which must not be edited. | Created via **Create New** on `/admin/earning-assignment` in the first case's `[Pre-Condition]`; later cases reuse it if present |
| Parameter rows | One or two parameters per case, with explicit known values (for example Condition *New*, odometer 0 – 100000, model-year age 0 – 5, lag interval 0, the first coverage code, make and earning group in each list). | Created via **Add Parameter** in each case's `[Pre-Condition]` step |
| Changed values | A different option in each select box (Condition *Used*, lag interval 12, another make / coverage code / earning group), new numbers (odometer 1000 – 200000, model-year age 1 – 10) and new sale dates. | Typed or chosen inline in the step |
| Invalid inputs | Odometer from 50000 / to 1000 (backwards range); `abc` in Coverage odometer from. | Typed inline in the step |

### 6.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login (`env` source) | Static | None applied | Named in the Execution Context and resolved from `env`. |
| The QA earning assignment `QA-AP2475-…` | Dynamic | Q1 — it does not exist yet. | Created in a `[Pre-Condition]` step. May be reused across cases in one run, because the assertions do not depend on its own fields. Each case still states how to create it when it is absent. |
| A parameter to edit | Dynamic | Q2 — the assertions compare against its creation-time values. Q3 — the edit consumes those values. | Created fresh in each case's `[Pre-Condition]` step with explicit values. Never reused between cases. |
| Option lists: earning sets, dealer groups, coverage codes (warranty programs), makes, earning groups | Static (read only) | None applied | Read only. The case picks "the first option" and "a different option" rather than hard-coding names that may change. |
| The seeded "AV+ / Profit / Group A" assignment and its parameters | Static (read only) | None applied | Never edited by this run. |

**Cost of the Dynamic items:** creating the assignment takes about 20 seconds and each parameter about 30 seconds through the forms; neither calls a third party. Parameters can be removed afterwards with the trash-can (Unassign) action, so cases should delete the parameters they made where that does not hide evidence. The `QA-AP2475-…` assignment stays on staging, because no delete action for assignments is described and the `cleanup` source is `missing`.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment. Staging is shared and was last verified on 2026-09-01. | Medium | High | Run the c2 health check before s4, and stop if it fails. |
| REQ-003 (Save) has no explicit acceptance criterion. Gate A was passed anyway. Likelihood High because the ticket certainly lacks it; impact High because Save is the feature. | High | High | Test only the user-story minimum, label message and landing page as observations, and state the gap in the test report. |
| The edit form's fields are defined only in AP-2474, and the running form may differ. | Medium | Medium | Expect the AP-2474 field list. Record any field that is missing or extra. Fail a case only if a field present in the Add form cannot be changed in the edit form without explanation (Q-002). |
| AP-2476 (making 6 fields optional) is deployed mid-run, changing the form's placeholders and validation. | Low | Medium | Note the form's placeholders at the start of execution. No case depends on required-field validation. |
| No validation rules are defined, so a form that accepts a backwards range cannot be judged a bug. | High | Low | Report such results as observations under Q-006, not FAIL, unless the app crashes (HTTP 5xx) or loses data. |
| The AP-2474 Add Parameter flow is broken on staging (AP-2474 is still in QC). | Medium | High | Create setup data first in each case; if it fails, record the case BLOCKED and report it as an AP-2474 issue. |
| A sibling bug in this area already returned HTTP 500 on an empty select (AP-2478, Earning Groups). Select boxes in this form could behave the same. | Medium | Medium | Watch for HTTP 500 pages on every Save and treat one as a FAIL with a screenshot of the error page. |
| Test assignments and parameters accumulate on staging. | High | Low | Use the `QA-AP2475-` prefix, delete created parameters via Unassign where possible, and list what is left in the report. |
| playwright unreachable, or the browser profile is locked by a leftover Chrome (seen on 2026-09-13). | Low | High | Run the preflight before starting. Kill the stale `mcp-chrome` process if the browser reports "already in use". |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-10-04 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-10-04 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-10-04 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-10-04 | Execution | Manual test execution via playwright | stlc-manual-executor |
| 2026-10-04 | Reporting | Bug reporting + ticket creation (after Gate C) | stlc-bug-reporter |
| 2026-10-04 | Reporting | Test report generation | stlc-test-reporter |
| 2026-10-04 | Closure | Tracker ticket update (Gate D) | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Runs every STLC stage for AP-2475 and generates all artifacts. |
| QA Lead / Human reviewer (Vinh Le) | Decided Gate A on 2026-10-04. Decides Gates B and C, and confirms bugs before they are filed. |
| Developer (Minh Lưu, per the ticket comment) | Fixes defects and confirms fixes before a re-test. |
| Product Owner (Ken Nguyen) | Answers the open questions, especially Q-001 (pre-fill), Q-003 (Save behaviour) and Q-006 (validation), and approves the exit criteria. |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%, zero open High bugs)
- [ ] Risk mitigations acknowledged by team

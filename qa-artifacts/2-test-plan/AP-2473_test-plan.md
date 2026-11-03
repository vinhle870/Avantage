# Test Plan

**Plan ID:** TP-20261003-002
**Project:** Avantage Plus v2 — Admin portal, AP-2473: Earning Sets
**Version:** 1.0
**Date:** 2026-10-03
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2473_requirements-analysis.md
**Total requirements:** 4 (REQ-001 – REQ-004)

> **Gate A note.** The pipeline ran in --auto mode, and the QA delegated gate decisions to the agent. Gate A was passed although REQ-004 (Save) has no acceptance criteria. For REQ-004 this plan tests only what the user story itself promises: a set saved with a description appears in the list, and an edit changes that description. Anything beyond that is recorded as an observation, not a pass or fail.

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify that all acceptance criteria in REQ-001 to REQ-003 are met: the menu entry, the list page and the create/edit form.
2. Verify the minimum the user story promises for REQ-004: an admin can create an earning set, and it is still there after a page reload.
3. Confirm that Edit opens the selected set, not an empty form or another set. Opening the wrong record would let an admin overwrite data by mistake.
4. Record how the form handles invalid input (blank, very long, duplicate and special-character descriptions). The ticket defines no validation, so these are reported as observations that feed the open questions.
5. Detect defects before the feature reaches production.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | "Earning Sets" menu item under Risk Management | Functional · UI · Regression |
| REQ-002 | Earning Sets list page (title, Create New, Description / Actions grid) | Functional · UI · Regression |
| REQ-003 | Create / Edit form with a Description field | Functional · Negative · Edge-case · UI |
| REQ-004 | Saving an earning set (create and edit) — user-story minimum only | Functional · Negative · Regression |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Earning Curves, Earning Groups, Earning Assignments | Separate sidebar items. Earning Curves is covered by AP-2471; the other two are not described in this ticket. |
| Linking earning curves to a set | No acceptance criterion mentions it (Q-002). If the form shows such fields, they are recorded but not tested. |
| Deleting an earning set | The user story says only "create", and the Actions column lists only Edit (Q-005). |
| Downstream use of an earning set | Nothing in this ticket consumes a set. |
| Role-based access (restricted admin) | Only one admin account is available, and the ticket names no roles (Q-007). |
| Performance, accessibility, API testing | Not suggested by the ticket. The project tests through the UI only (`api-baseline` is `missing` in the knowledge registry). |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the admin screens in a real browser on v2staging. | QA Agent |
| Integration Testing | Not applicable. The ticket defines no API contract. Save is checked through what the UI shows after a reload. | — |
| Regression Testing | Regression testing means re-checking that something that used to work still works. Here it confirms the admin sidebar and the sibling Earning Curves item still load after this change. | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step. | playwright |
| Negative | Save with a blank description, and with a duplicate description. Record whether the form refuses it and what message it shows. | playwright |
| Edge-case | Boundary value analysis, which tests the extremes where length mistakes hide: a 1-character description, a 255-character description, and accented / special characters (`é à ç ' " & < >`), which matter for a bilingual Quebec product. | playwright |
| UI / Visual | Menu section and label, page title, nav item, column headers and the form field, checked against the accessibility snapshot and screenshots. | playwright screenshots |
| API | Not used. See §3.1. | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Capability groups this run needs (from `mcp-tools.md` §7):
- `browser` (playwright, `active`) is required for s4.
- `tracker` (jira via the CLI, `active`) is needed for bugs and the summary comment.
- `notify` is `disabled`, so no notification step runs.

---

## 4. Entry Criteria

_Entry criteria are what has to be ready before testing can usefully start. Starting before these are in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] The application is deployed and reachable at `https://v2staging.garantieavantageplus.ca`, and the admin login works.
- [x] `qa-artifacts/1-requirements-analysis/AP-2473_requirements-analysis.md` exists. Gate A was passed on 2026-10-03.
- [ ] At least 1 `qa-artifacts/3-test-cases/AP2473_TestCases_*.md` file exists, with at least one case per requirement.
- [ ] The test environment is stable, with no known blocking infrastructure issues. The `agent-coordination` c2 health check passes.
- [x] Test data is ready: the shared admin account resolves from the `env` source. Earning sets are created by the run itself (see §8).
- [x] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md`.

---

## 5. Exit Criteria

_Exit criteria are what has to be true before we can say testing is finished and the release is safe to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed. These are the cases for REQ-003 and REQ-004.
- [ ] Test pass rate ≥ **90%** of judged cases. With about ten cases, 90% allows one failing low-impact UI case (for example, label casing) while any failure of create, edit or save still blocks release through the next line.
- [ ] Zero **Critical** severity bugs remain open.
- [ ] **High** severity bugs ≤ **0** open. A set that cannot be saved, or an Edit that opens the wrong record, means the story is not delivered.
- [ ] `qa-artifacts/5-testing-report/AP-2473_test-report.md` has been generated and reviewed.
- [ ] Every FAIL is filed, linked or dismissed in `qa-artifacts/5-testing-report/AP-2473_bug-report.md`.

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect. For example, if Save fails, every edit and persistence case is blocked.
- A **Critical** severity bug is found that prevents further execution

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca` — Admin Portal at `/admin/login`. The Earning Sets route is **not known**; it is reached through the sidebar and recorded during execution. |
| **Browser** | Chromium (Playwright default), viewport 1280 × 800 (`admin_viewport` in tools.md) |
| **OS** | Windows 11 (the QA agent host) |
| **Application version** | Not known. The ticket carries no fix version, and the staging build number is not exposed. Results are filed under run folder `5.2.0`, the same folder as sibling ticket AP-2471. |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/` |
| **Bug tracker** | jira (via `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin account | The shared admin login from the `env` source. It has full admin rights. | Static — resolved from `qa-artifacts/base-test/execute.env.md` |
| Earning set records | One set per case that needs one. Each description starts `QA-AP2473-` plus a time stamp (HHMMSS), so it is unique and clearly marked as test data. | Created in each case's `[Pre-Condition]` step via **Create New** |
| Boundary inputs | Blank description; 1 character (`Q`); 255 characters (`QA-AP2473-` followed by `X` to length 255); accented and special characters `QA-AP2473-Éàç '"&<>`; a duplicate of an existing test set's description. | Typed inline in the step |

### 6.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login (`env` source) | Static | None applied | Named in the Execution Context and resolved from `env`. |
| An earning set to edit or duplicate | Dynamic | Q1 — it does not exist yet. Q2 — the assertions depend on its description. | Created in a `[Pre-Condition]` step with an explicit `QA-AP2473-…` description. |
| Earning set created as the result of a test | Dynamic | Q1 — the case creates it. | Created by the case's own steps, with a unique `QA-AP2473-…` description. |
| Admin sidebar / Risk Management menu | Static | None applied | Read only. |
| Existing earning sets made by other people | Static (read only) | None applied | Never edited by this run. They are only observed in the list. |

**Cost of the Dynamic items:** creating a set takes about 15 seconds through the form and calls no third party. Each run leaves its `QA-AP2473-…` sets on staging, because the `cleanup` source is `missing` and the ticket offers no delete action. One saved set may be reused across read-only checks in a run, but every case still states how to create one when it is absent.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment. Staging is shared and was last verified on 2026-09-01. | Medium | High | Run the c2 health check before s4, and stop if it fails. |
| REQ-004 (Save) has no acceptance criteria. Gate A was passed anyway. | High | High | Test only the user-story minimum, label everything else an observation, and state the gap in the test report. A green result here does not mean Save is fully specified. |
| The datagrid AC says "Earning Assignments". A literal reading would fail a correct build. | High | Medium | Expect a grid of earning sets, matching the title and story. Record exactly what the grid lists (Q-001). |
| The form may show fields beyond Description (for example, a curve picker) that the ticket does not describe. | Medium | Medium | Record every field, fill only what Save requires, and raise the extras as observations under Q-002. If a field is mandatory, fill it with the first available option and say so. |
| No validation rules exist for Description, so accepting a blank or duplicate value cannot be judged a bug. | High | Low | Report negative results as observations, not FAIL, unless the app crashes or loses data. |
| Test sets accumulate on staging, because there is no delete and no cleanup source. | High | Low | Use the `QA-AP2473-` prefix so they are easy to find, and keep the number of created sets small. |
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
| QA Agent | Runs every STLC stage for AP-2473 and generates all artifacts. |
| QA Lead / Human reviewer (Vinh Le) | Delegated Gates A and B to the agent for this run. Decides Gates C and D, and confirms bugs before they are filed. |
| Developer | Fixes defects and confirms fixes before a re-test. Not named in the ticket. |
| Product Owner (Ken Nguyen) | Answers the open questions, especially Q-001 (grid wording), Q-002 (fields) and Q-003 (Save behaviour), and approves the exit criteria. |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%, zero open High bugs)
- [ ] Risk mitigations acknowledged by team

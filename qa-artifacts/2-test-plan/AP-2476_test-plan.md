# Test Plan

**Plan ID:** TP-20261011-001
**Project:** Avantage Plus v2 — Admin portal, Earning Assignment parameters (Jira AP-2476)
**Version:** 1.0
**Date:** 2026-10-11
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2476_requirements-analysis.md
**Total requirements:** 4

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 to REQ-004 are met on the Add Parameter and Edit Parameter forms of an earning assignment.
2. Confirm a parameter can be saved with any of the six optional fields left on "All", and that a field already holding a value can be cleared back to "All" during Edit.
3. Confirm the two odometer fields start at the stated defaults (0 and 999999) on a new parameter and keep their stored values on Edit.
4. Confirm nothing that worked before broke: a fully filled parameter still saves and displays as before, and the fields outside this ticket (Model Year Age, Lag Interval) behave as before.
5. Record, as observations rather than failures, the behaviours the ticket leaves open (grid display of an empty field, open-ended date range, required `*` marker) so the product owner can rule on them.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Six parameter fields optional on Add and Edit | Functional · Negative · Edge-case · Regression · UI |
| REQ-002 | "All" replaces "Choose" as the empty choice | Functional · UI · Regression |
| REQ-003 | Coverage odometer from defaults to 0 | Functional · Negative · Regression |
| REQ-004 | Coverage odometer to defaults to 999999 | Functional · Negative · Edge-case · Regression |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Effect of an empty ("All") field on the earning calculation for contracts | Not described in the ticket (Q-001) and not visible from the admin parameter screens; would need a contract-earning report that this ticket does not touch. |
| The assignment form's own "Choose" fields (Earning Set, Dealer Group) | A different form, not part of AP-2476. Its known HTTP 500 on "Choose" belongs to AP-2474. |
| Unassigning (deleting) a parameter | Delivered and tested under AP-2474; used here only to clean up. |
| The details-page HTTP 500 past 10 parameters | Already filed as AP-2484; avoided by keeping each fixture assignment at 10 parameters or fewer. |
| API, accessibility and performance testing | The change is a form-level validation and wording change with no API or load aspect named in the ticket. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the Add and Edit Parameter forms in a real browser, from login to the saved row in the parameter list | QA Agent |
| Integration Testing | Not applicable — no separate API is exposed for this form; the browser submit is the only entry point | — |
| Regression Testing | Re-checking that a fully filled parameter, the Edit pre-fill and the untouched fields still behave as before (regression = making sure a change did not break something that used to work) | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Open Add / Edit Parameter, leave each optional field on "All", submit, and check the success alert and the saved row | Playwright MCP |
| Negative | Leave the odometer fields blank; leave a field that is still mandatory (for example Model Year Age) blank; confirm a clean refusal and no error page | Playwright MCP |
| Edge-case | Fill only one sale date; leave all six optional fields empty at once; clear a stored value back to "All" on Edit | Playwright MCP |
| UI / Visual | Read the empty-choice text of each select and the hint text of each date box; record the `*` marker; screenshot each form | Playwright MCP screenshots |
| API | Not applicable — see §3.1 | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **Playwright MCP** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Where the ticket and the build disagree on a value the ticket may have mistyped (999999 versus 9999999), the test case expects the ticket's value; the mismatch, if any, is brought to Gate C for the user to rule "bug" or "not a bug".

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca`
- [ ] **The AP-2476 build is on staging.** Jira shows it deployed to *preprod* on 2026-10-09; on 2026-10-04 it was not on staging. The pre-execution check opens Add Parameter and looks for "All" on Coverage Code — if "Choose" is still shown, execution stops as "build not deployed" rather than recording failures.
- [ ] `qa-artifacts/1-requirements-analysis/AP-2476_requirements-analysis.md` exists and has been reviewed (done at Gate A, 2026-10-11)
- [ ] At least 5 test cases exist in `qa-artifacts/3-test-cases/AP2476_TestCases_*.md`
- [ ] Test environment is stable (admin login works)
- [ ] Test data: an earning assignment with fewer than 10 parameters, created by the case itself (see §8)
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the project's release threshold (`story_pass_threshold` in the tool registry); below it, the story stays in QC
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a High bug here would mean admins still cannot save broad parameter rows, which is the whole purpose of the ticket
- [ ] `qa-artifacts/5-testing-report/AP-2476_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2476_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- The Add Parameter form still shows "Choose" (the build under test is not deployed)

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca/admin` (resolved from the `env` knowledge source) |
| **Browser** | Chromium (Playwright default), admin viewport 1280 × 800 |
| **OS** | Windows 11 (QA workstation) |
| **Application version** | Not known — the admin portal shows no build number; AP-2476 deployment confirmed by the pre-execution check in §4 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/` |
| **Bug tracker** | Jira (CLI wrapper `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin login | Shared staging admin account | Resolved from the `env` knowledge source |
| Earning assignment | A fresh `QA-AP2476-{HHMMSS}` assignment (any earning set, any dealer group, enabled) to hold the new parameters | Created through Create New on `/admin/earning-assignment` in each case's pre-condition, or reused within one run if it has fewer than 9 parameters |
| Parameter rows | Rows created with optional fields empty, with every field filled, and one filled row to be cleared on Edit | Created by the test cases themselves |
| Reference values | Coverage Code "AP-CADV - Advanced", Make "Acura", Earning Group "AV+", Condition "Used" | Already on staging (reference data) |
| Boundary values | Odometer blank; one sale date only (2026-01-01); 999999 and 9999999 | Typed in the steps |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied | Named in Execution Context, resolved from `env` |
| Reference lists (coverage programs, makes, earning groups) | Static | None applied | Named in the step by visible label |
| Earning assignment that holds the parameters | Dynamic | Q4 — each run needs its own instance, and the details page fails past 10 parameters (AP-2484) | Created in a `[Pre-Condition]` step with description `QA-AP2476-{HHMMSS}`. May be reused across the cases of one run while it holds fewer than 9 parameters. Cost: about 20 seconds through the UI; no third party; the assignment cannot be deleted and stays on staging |
| Parameter rows under test | Dynamic | Q1 — they do not exist yet | Created by the case. Left on staging as evidence (they can be unassigned later) |
| Seeded assignment #1 "AV+" and its parameter | Static, read-only | None applied | **Never edited** — used only to compare how an old row displays |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AP-2476 not deployed on staging (Jira shows preprod only) | Medium | High | Pre-execution check in §4; stop as "build not deployed" instead of filing false bugs |
| Unstable test environment | Medium | High | Run the environment health check before s4; retry an environment failure once, then mark BLOCKED |
| Ticket value 999999 may be a typo for 9999999 (REQ-004) | High | Medium | Test as written; bring any mismatch to Gate C with the question, so the user decides |
| Condition default after the change is not specified (REQ-002) | High | Medium | Expect "All" to be available and savable; record which option is pre-selected as an observation, not a failure |
| Meaning of "All" in the earning calculation is not testable here (REQ-001) | High | Medium | Out of scope (§2.2); named as an open question in the report |
| Details page HTTP 500 past 10 parameters (AP-2484) | High | Medium | Keep each fixture assignment at 10 parameters or fewer; create a fresh assignment when close |
| Parallel runs writing to the same tables | Low | Low | Never predict a parameter id; read it from the pencil link |
| Playwright MCP unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-10-11 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-10-11 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-10-11 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-10-11 | Execution | Manual test execution via Playwright MCP | stlc-manual-executor |
| 2026-10-11 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| 2026-10-11 | Reporting | Test report generation | stlc-test-reporter |
| 2026-10-11 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer (Vinh Le) | Review artifacts, decide at Gates A–C, approve sign-off checklist |
| Developer (Minh Lưu) | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen) | Answer open questions Q-001 to Q-007; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team

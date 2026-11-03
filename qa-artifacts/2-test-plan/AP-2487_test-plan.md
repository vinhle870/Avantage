# Test Plan

**Plan ID:** TP-20261012-001
**Project:** Avantage Plus v2 — Admin portal, Earning Assignment parameters (Jira AP-2487)
**Version:** 1.0
**Date:** 2026-10-12
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md
**Total requirements:** 3

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 to REQ-003 are met on the Add Parameter and Edit Parameter forms of an earning assignment.
2. Confirm the new warranty Start date from / Start date To fields sit after "Sale Date to", are optional date fields, and are saved and shown again on Edit — both together and one at a time.
3. Confirm the parameter list (datagrid) shows the saved range in a "Start date" column.
4. Confirm an admin can tick several Coverage Codes in one parameter, that every ticked code is saved, and that a parameter saved before this change keeps its single code on Edit.
5. Confirm nothing that worked before broke: a parameter with every optional field left on "All" still saves (AP-2476 behaviour), and required fields still refuse a blank value without an error page. Record the behaviours the ticket leaves open (reversed range, empty-column display, Select All) as observations so the product owner can rule on them.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | Warranty start date range on the Add and Edit Parameter form | Functional · Negative · Edge-case · Regression · UI |
| REQ-002 | "Start date" column in the parameter datagrid | Functional · UI · Regression |
| REQ-003 | Coverage Code accepts several choices | Functional · Edge-case · Regression · UI |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| Effect of the start date range and of several coverage codes on the earning calculation for contracts | Not described in the ticket (Q-001) and not visible from the admin parameter screens. |
| Making the six fields optional and the "All" placeholder | Delivered and tested under AP-2476 (PASS 10/10); re-checked here only as regression. |
| Unassigning (deleting) a parameter | Delivered under AP-2474; not needed here. |
| The details-page HTTP 500 past 10 parameters | Already filed as AP-2484; avoided by keeping each fixture assignment at 10 parameters or fewer. |
| API, accessibility and performance testing | The change is a form and list change with no API or load aspect named in the ticket. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end checks of the Add and Edit Parameter forms in a real browser, from login to the saved row in the parameter list | QA Agent |
| Integration Testing | Not applicable — no separate API is exposed for this form; the browser submit is the only entry point | — |
| Regression Testing | Re-checking that the AP-2476 behaviour (save with all optional fields on "All") and the required-field validation still work, and that older single-code rows open correctly (regression = making sure a change did not break something that used to work) | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Fill both start dates, save, check the success alert, the "Start date" column and the Edit pre-fill; tick two or three coverage codes, save, and check every code is kept | Playwright MCP |
| Negative | Enter a "from" date later than the "to" date; type a non-date value in a start date field; confirm a clean refusal or a stored value, never an error page | Playwright MCP |
| Edge-case | Fill only "from" or only "to"; same date in both; Select All coverage codes; clear the start dates on Edit | Playwright MCP |
| UI / Visual | Field order (after Sale Date to), labels, absence of the `*` required marker, date picker; screenshot each form and list | Playwright MCP screenshots |
| API | Not applicable — see §3.1 | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **Playwright MCP** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence
- Records PASS / FAIL / BLOCKED per step and per test case

Where the ticket is silent (reversed range, empty-column display, Select All), the test case records what the build does and accepts any clean outcome; an HTTP 500 or a value saved to the wrong field is a failure.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [ ] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca`
- [ ] **The AP-2487 build is on staging.** The AP-2476 run on 2026-10-11 already saw the Start date fields and the multi-select Coverage Code there. The pre-execution check opens Add Parameter and looks for the `warrantyStartDateFrom` field — if it is absent, execution stops as "build not deployed" rather than recording failures.
- [ ] `qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md` exists and has been reviewed (done at Gate A, 2026-10-12)
- [ ] At least 5 test cases exist in `qa-artifacts/3-test-cases/AP2487_TestCases_*.md`
- [ ] Test environment is stable (admin login works)
- [ ] Test data: an earning assignment with room for the parameters this run creates (see §8)
- [ ] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` and its provider responds

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the project's release threshold (`story_pass_threshold` in the tool registry); below it, the story stays in QC
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a High bug here would mean start dates or coverage codes are lost or stored wrongly, which would misallocate earnings
- [ ] `qa-artifacts/5-testing-report/AP-2487_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created in `qa-artifacts/5-testing-report/AP-2487_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect
- A **Critical** severity bug is found that prevents further execution
- The Add Parameter form has no Start date fields (the build under test is not deployed)

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
| **Application version** | Not known — the admin portal shows no build number; AP-2487 deployment confirmed by the pre-execution check in §4 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/` |
| **Bug tracker** | Jira (CLI wrapper `tools/jira-cli`) — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin login | Shared staging admin account | Resolved from the `env` knowledge source |
| Earning assignment | A fresh `QA-AP2487-{HHMMSS}` assignment (any earning set, any dealer group, enabled) to hold the new parameters | Created through Create New on `/admin/earning-assignment` in a case's pre-condition, reused within one run while it has fewer than 9 parameters |
| Parameter rows | Rows with both start dates, one start date only, a reversed range, several coverage codes, and Select All | Created by the test cases themselves |
| Pre-change single-code row | Seeded parameter #1 on assignment #1 "AV+" | Already on staging — **opened read-only, never saved** |
| Reference values | Coverage Codes "AP-CADV - Advanced" plus two others visible in the list; Lag Interval 0 | Already on staging (reference data) |
| Date values | 2026-01-01 / 2026-12-31 (normal), 2026-12-31 / 2026-01-01 (reversed), 2026-06-15 in both (same day) | Typed in the steps |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied | Named in Execution Context, resolved from `env` |
| Reference lists (coverage codes, makes, earning groups) | Static | None applied | Named in the step by visible label |
| Earning assignment that holds the parameters | Dynamic | Q4 — each run needs its own instance, and the details page fails past 10 parameters (AP-2484) | Created in a `[Pre-Condition]` step with description `QA-AP2487-{HHMMSS}`. Reused across the cases of one run while it holds fewer than 9 parameters. Cost: about 20 seconds through the UI; no third party; the assignment cannot be deleted and stays on staging |
| Parameter rows under test | Dynamic | Q1 — they do not exist yet | Created by the case. Left on staging as evidence |
| Seeded assignment #1 "AV+" and its parameter | Static, read-only | None applied | **Never saved** — Edit is opened and cancelled to check how a pre-change single-code row loads |

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| AP-2487 not deployed on staging | Low | High | Pre-execution check in §4 (the fields were already seen on 2026-10-11); stop as "build not deployed" instead of filing false bugs |
| Unstable test environment | Medium | High | Run the environment health check before s4; retry an environment failure once, then mark BLOCKED |
| Reversed date range validation not specified (REQ-001) | High | Medium | Record the outcome; only an error page or a corrupted value fails; raise Q-002 in the report |
| Datagrid format of the range and of several codes not specified (REQ-002, REQ-003) | High | Low | Expect the Sale Date `from - to` pattern and every code listed; record the actual rendering |
| Effect on the earning calculation not testable here (REQ-001, REQ-003) | High | Medium | Out of scope (§2.2); named as an open question in the report |
| Opening seeded row #1 by mistake saves it | Low | High | The case closes the dialog without saving and re-reads the list to confirm the row is unchanged |
| Details page HTTP 500 past 10 parameters (AP-2484) | High | Medium | Keep the fixture assignment at 10 parameters or fewer |
| Playwright MCP unreachable | Low | High | Run the preflight before starting; reconnect if needed |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-10-12 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-10-12 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-10-12 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-10-12 | Execution | Manual test execution via Playwright MCP | stlc-manual-executor |
| 2026-10-12 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| 2026-10-12 | Reporting | Test report generation | stlc-test-reporter |
| 2026-10-12 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer (Vinh Le) | Review artifacts, decide at Gates A–C, approve sign-off checklist |
| Developer (Minh Lưu) | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen) | Answer open questions Q-001 to Q-005; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [ ] Exit criteria thresholds agreed (pass rate ≥ 90%)
- [ ] Risk mitigations acknowledged by team

# Test Plan

**Plan ID:** TP-20261004-001
**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2474: Earning Assignment)
**Version:** 1.0
**Date:** 2026-10-04
**Prepared by:** QA Agent — Test Plan Designer Skill
**Based on:** qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md
**Total requirements:** 7

---

## 1. Test Objectives

Testing for this cycle aims to:

1. Verify all acceptance criteria in REQ-001 to REQ-007 are met under normal conditions: the menu item, the list page, the create form, the details page, the Add Parameter form with its stated defaults and options, adding a parameter and removing one.
2. Confirm how both forms react to invalid inputs (blank required values, inverted ranges, non-numeric values). Because the ticket states no validation rules, these results are reported as observations unless the system fails harmfully (an HTTP 500 error page, data that cannot be read back, or a record saved with values other than those entered).
3. Confirm that the values an admin enters are stored and shown back exactly — in the list grid, in the details-page title, and in the parameter grid — because an admin who cannot trust what the screen shows cannot trust the earnings configuration.
4. Exercise the **Edit** nav item to the minimum the word implies (pre-filled form, saved change visible), since the ticket gives it no criteria.
5. Detect defects before the feature reaches production.

---

## 2. Scope

### 2.1 In Scope

| Requirement | Feature | Test Types |
|---|---|---|
| REQ-001 | "Earning Assignments" menu item | Functional · UI · Regression |
| REQ-002 | Earning Assignments list page | Functional · UI · Regression |
| REQ-003 | Create New form (modal) | Functional · Negative · Edge-case · UI |
| REQ-004 | Save and the details page (incl. the Edit nav item, minimum check) | Functional · Negative · Regression · UI |
| REQ-005 | Add Parameter form (modal) | Functional · Negative · Edge-case · UI |
| REQ-006 | Submitting a parameter | Functional · Edge-case · Regression |
| REQ-007 | Removing a parameter with confirmation | Functional · Negative · UI |

### 2.2 Out of Scope

| Item | Reason |
|---|---|
| How parameters are applied to contracts or to earnings calculations | The ticket does not describe it; there is no observable outcome to check on these screens. |
| Deleting a whole earning assignment, or editing a single parameter | No action for either is listed in the acceptance criteria. |
| Earning Curves, Earning Groups and Earning Sets screens | Covered by AP-2471, AP-2472 and AP-2473. They are only read here, as the source of dropdown options. |
| Role-based access (non-admin or restricted admin) | Only one admin account exists for testing, and the ticket names no roles (Q-010). |
| Performance, accessibility and API testing | Not called for by the requirements; the screens are low-volume admin forms tested through the UI only. |

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Scope | Responsible |
|---|---|---|
| System Testing | End-to-end feature validation in the browser, from the admin menu to a stored parameter | QA Agent |
| Integration Testing | Only at the data level: the dropdowns must list the earning sets, dealer groups and earning groups that the sibling screens hold. No API contract is tested | QA Agent |
| Regression Testing | Re-checking that the list page still shows the seeded "AV+" assignment unchanged after this run's records are added. Regression means confirming that something that worked before still works | QA Agent |

### 3.2 Test Types

| Type | Approach | Tools |
|---|---|---|
| Functional | Execute each acceptance criterion step by step | playwright |
| Negative | Submit blank, inverted and non-numeric values; record how errors are shown | playwright |
| Edge-case | Default values, the edge values -1 / 0 / 99 / 9999999, single-day sale-date ranges, long and accented descriptions | playwright |
| UI / Visual | Check titles, column headers, field types and option lists against the ticket wording; screenshot each | playwright screenshots |
| API | N/A — this project tests through the UI only | — |

### 3.3 Test Execution Method

All test cases are executed by the **stlc-manual-executor** skill through the project's bound `browser` provider, **playwright** (see `qa-artifacts/qa-config/tools.md`). The AI agent:
- Drives the browser step by step
- Takes screenshots as evidence, saved under `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/`
- Records PASS / FAIL / BLOCKED per step and per test case

Behaviour the ticket leaves undefined (validation, Edit, overlaps, defaults of "Is Enabled?" and "Lag Interval") is recorded as an **observation**. A test case fails on it only when the outcome is plainly harmful, as described in objective 2.

---

## 4. Entry Criteria

_What has to be ready before testing can usefully start. Starting before these are
in place produces results nobody can trust._

All conditions below must be met before test execution begins:

- [x] Application is deployed and accessible at `https://v2staging.garantieavantageplus.ca` — Jira shows AP-2474 deployed to Staging on 2026-10-01
- [x] `AP-2474_requirements-analysis.md` exists and has been reviewed (Gate A passed 2026-10-04)
- [ ] `AP2474_TestCases_*.md` exists with at least 7 test cases (one per requirement)
- [ ] Test environment is stable — the environment health check before s4 passes
- [ ] Test data is available: at least one earning set, one dealer group, one earning group, one warranty program and one vehicle make exist on staging (all confirmed present on 2026-10-03 except warranty programs and makes, which are checked at execution)
- [x] The `browser` capability is `active` in `qa-artifacts/qa-config/tools.md` (provider playwright)

---

## 5. Exit Criteria

_What has to be true before we can say testing is finished and the release is safe
to consider. If any box is unticked, testing is not done._

Testing is considered complete when:

- [ ] All High-priority test cases have been executed
- [ ] Test pass rate ≥ **90%** — the project's `story_pass_threshold` in the tool registry, which decides whether the story moves to Ready for release
- [ ] Zero **Critical** severity bugs remain open
- [ ] **High** severity bugs ≤ 0 open — a High bug in a configuration screen would mean wrong earnings rules could be saved without anyone noticing
- [ ] `AP-2474_test-report.md` has been generated and reviewed
- [ ] All tracker tickets created are listed in `AP-2474_bug-report.md`

---

## 6. Suspension & Resumption Criteria

_When we stop testing partway through because carrying on would waste time, and
what has to be fixed before we pick it back up._

### Suspend testing when:
- Application is inaccessible for more than **30 minutes**
- More than **30%** of test cases are blocked by a single defect — for example, if saving an assignment fails, every details-page and parameter case is blocked
- A **Critical** severity bug is found that prevents further execution

### Resume testing when:
- The blocking issue is resolved and confirmed by dev team
- Environment is stable for at least **15 minutes**
- A patch has been deployed addressing the blocking defect

---

## 7. Test Environment

| Component | Details |
|---|---|
| **Application URL** | `https://v2staging.garantieavantageplus.ca/admin` (the `env` source, `execute.env.md`) |
| **Browser** | Chromium (Playwright default), admin viewport 1280 × 800 |
| **OS** | Windows 11 |
| **Application version** | Not known — no build number is shown in the ticket; Jira records a Staging deployment on 2026-10-01 |
| **Screenshot path** | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/` |
| **Bug tracker** | jira — bound in `qa-artifacts/qa-config/tools.md` |

---

## 8. Test Data Requirements

| Data | Description | Setup method |
|---|---|---|
| Admin account | The shared admin login | From the `env` source (`execute.env.md`) |
| Earning sets | At least one, used as the Earning Set option. Seeded 1 Profit, 2 Statutory, 3 Reinsurance plus AP-2473's QA sets | Already on staging — read only; never edit seeded sets |
| Dealer groups | 1 Group A, 2 Group B, 3 group c, 4 Group D | Already on staging — read only |
| Earning groups | Seeded "AV+" plus AP-2472's QA groups | Already on staging — read only |
| Warranty programs (coverage codes) and vehicle makes | Option sources for Coverage Code and Make | Already on staging — read only; presence checked during execution |
| Earning assignments | One per test case that needs one, with a unique description `QA-AP2474-<case>-<hhmm>` | Created in each case's `[Pre-Condition]` step through Create New |
| Parameters | Created and removed by the cases themselves | Created in the case through Add Parameter |

### 8.1 Test Data Classification

_Decided once here, and inherited by every test case. `stlc-testcase-designer` reads this
table instead of re-deriving it, and puts Static values in the Execution Context, Dynamic
values in a `[Pre-Condition]` step, and Configuration values in a change-then-restore pair._

| Data item | Class | Deciding question | Handling |
|---|---|---|---|
| Admin login | Static | None applied | Named in Execution Context, resolved from `env` |
| Earning sets, dealer groups, earning groups, warranty programs, makes | Static | None applied — read only, never changed | Named in Execution Context by display name; the case picks an existing option |
| Seeded earning assignment "AV+" | Static | None applied — read only | Used only to check the list page; never opened for Edit |
| An earning assignment | Dynamic | Q1 — it does not exist yet / Q2 — the assertions depend on its description | Created in a `[Pre-Condition]` step with a unique description. Creation takes about 30 seconds, calls no third party, and **leaves a record on staging** because there is no delete action |
| A parameter | Dynamic | Q1 — it does not exist yet | Created inside the case; REQ-007 cases remove their own. Others stay on the case's own assignment |

**Cost of Dynamic data:** every case that needs an assignment leaves one behind on staging (no delete exists). A case may reuse an assignment created earlier **in the same case file** only when it does not change it; otherwise it creates its own. The run should list every assignment it creates in the execution log.

---

## 9. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|:---:|:---:|---|
| Unstable test environment | Low | High | Run the environment health check before s4. Staging was stable for the three sibling runs on 2026-10-03 |
| Undefined validation (Q-001, Q-002, Q-006) means a tester could fail correct behaviour or pass harmful behaviour | High | Medium | Record such results as observations; fail only plainly harmful outcomes (objective 2). List them in the report for the product owner |
| The Edit nav item has no criteria (Q-004) | High | Medium | Test only the minimum implied: pre-filled form, saved change visible in the title |
| Saving an assignment fails, blocking every details-page and parameter case | Low | High | Order the cases so save is proven first; mark dependants BLOCKED, not FAIL |
| A select with no options submits and returns HTTP 500, as seen on Earning Groups (AP-2478) | Medium | Medium | Include one case that submits a form with an empty or unselected dropdown |
| Test records cannot be deleted and accumulate on staging, pushing seeded rows to page 2 | High | Low | Unique `QA-AP2474-` prefix; count rows across pages |
| playwright unreachable or the browser profile locked by a leftover Chrome | Low | High | Run the preflight; kill the leftover `mcp-chrome` process if "Browser is already in use" appears |

---

## 10. Test Schedule

| Day | Phase | Activity | Skill |
|---|---|---|---|
| 2026-10-04 | Analysis | Requirements analysis | stlc-requirements-analyst |
| 2026-10-04 | Planning | Test plan design | stlc-test-plan-designer |
| 2026-10-04 | Design | Test case design and peer review | stlc-testcase-designer, stlc-testcase-reviewer |
| 2026-10-04 | Execution | Manual test execution via playwright | stlc-manual-executor |
| 2026-10-04 | Reporting | Bug reporting + ticket creation | stlc-bug-reporter |
| 2026-10-04 | Reporting | Test report generation | stlc-test-reporter |
| 2026-10-04 | Closure | Tracker ticket update | stlc-ticket-updater |

---

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| QA Agent | Execute all 7 STLC skills, generate all artifacts |
| QA Lead / Human reviewer (Vinh Le) | Review artifacts, answer the review gates, approve sign-off checklist |
| Developer | Fix defects; confirm fixes before re-test |
| Product Owner (Ken Nguyen, reporter) | Clarify open questions Q-001 to Q-011; approve exit criteria |

---

## 12. Sign-off Checklist

- [ ] Test objectives reviewed by Product Owner
- [ ] Scope agreed with development team
- [ ] Environment confirmed available and stable
- [ ] Entry criteria verified before execution
- [x] Exit criteria thresholds agreed (pass rate ≥ 90%) — taken from the project registry
- [ ] Risk mitigations acknowledged by team

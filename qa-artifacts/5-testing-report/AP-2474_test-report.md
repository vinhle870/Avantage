# Test Execution Report

**Report ID:** TR-20261004-AP2474
**Project:** Avantage Plus v2 — Admin portal, Risk Management
**Test Cycle:** AP-2474 — Earning Assignment, single-ticket STLC run, run folder 5.2.0
**Application version:** Not exposed by the application — Jira records a Staging deployment of AP-2474 on 2026-10-01
**Date:** 2026-10-04
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** 17 of 18 test cases passed (94.4%), above the project's 90% threshold, and the one defect found (AP-2482) is Medium severity with no Critical or High bug open.

---

## Executive Summary

The QA agent tested the new Earning Assignment screens in the admin portal's Risk Management area on Staging, with 18 test cases covering all 7 requirements drawn from the ticket. 17 passed. Everything the ticket specifies works as written: the menu item, the list and its columns, the create form and its dropdowns, the details page with Edit and Add Parameter, the parameter form's options and its four default values (0, 9999999, -1, 99), and adding and removing parameters with a confirmation. One defect was found and filed as **AP-2482** (Medium): if an admin clicks Save on a new assignment without choosing an Earning Set or a Dealer Group, the server shows an error page instead of a validation message. Nothing is saved or damaged, so it does not block release, but it should be fixed. Three behaviours the ticket does not define — duplicate assignments, inverted ranges and identical parameters, all accepted without warning — are listed below for the product owner to decide on.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 7 of 7 |
| Total test cases | 18 |
| Passed | 17 (94.4%) |
| Failed | 1 (5.6%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **94.4%** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Defect density: 1 bug ÷ 18 test cases = 0.06.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (6 of 6) | ✅ |
| Pass rate | ≥ 90% | 94.4% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | 1 | 1 | 0 | 0 | 100% |
| REQ-002 — List page | 1 | 1 | 0 | 0 | 100% |
| REQ-003 — Create New form | 4 (003, 005, 006, 007) | 3 | 1 | 0 | 100% |
| REQ-004 — Save & details page (incl. Edit) | 2 (004, 008) | 2 | 0 | 0 | 100% |
| REQ-005 — Add Parameter form | 4 (009, 012, 013, 017) | 4 | 0 | 0 | 100% |
| REQ-006 — Submit parameter | 4 (010, 011, 016, 018) | 4 | 0 | 0 | 100% |
| REQ-007 — Remove parameter | 2 (014, 015) | 2 | 0 | 0 | 100% |
| **Total** | **18** | **17** | **1** | **0** | **100%** |

Coverage is the share of each requirement's cases that were executed; every case ran.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Saving a new earning assignment with no Earning Set or no Dealer Group chosen shows an HTTP 500 error page | Medium | P2 | REQ-003 | [AP-2482](https://garantieavantageplus.atlassian.net/browse/AP-2482) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2474-earning-assignment.md` | 2026-10-04 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2474_requirements-analysis.md` | 2026-10-04 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2474_test-plan.md` | 2026-10-04 |
| Test Cases | `qa-artifacts/3-test-cases/AP2474_TestCases_001-005.md`, `_006-010.md`, `_011-015.md`, `_016-018.md` | 2026-10-04 |
| Review Findings | `qa-artifacts/3-test-cases/AP2474_ReviewFindings_2026-10-04.md` | 2026-10-04 |
| Execution Log | `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2474_2026-10-04.md` | 2026-10-04 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2474_bug-report.md` | 2026-10-04 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/` (42 files) | 2026-10-04 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2474_test-report.md` | 2026-10-04 |

---

## Risks and Observations

- **Undefined rules, accepted without warning** (not failures — the ticket sets no rule; open questions for the product owner):
  - A second assignment for the same earning set and dealer group saves silently (AP2474_007, Q-002). Two assignments now map Profit to Group A on staging, and it is unclear which one applies to that dealer group's contracts.
  - A parameter whose sale-date, odometer and model-year ranges run backwards (from > to) saves and is shown as entered (AP2474_012, Q-006). Such a rule can never match a contract.
  - An identical parameter saves as a second row (AP2474_016, Q-011).
- **Small differences from the ticket wording, accepted:** the form label is "Dealer Group" (ticket: "Dealer Groups") and it is a single choice; "Is Enabled?" is a checkbox ticked by default; the parameter grid header reads "Model Year Age"; the confirmation reads "Are you sure you want to delete this record?" with Continue / No.
- **Beyond the ticket:** each parameter row also has a pencil (Edit Parameter) icon the ticket does not mention. An empty parameter grid shows only "No entities found", with no column headers.
- **Not verified here:** a parallel AP-2475 run reported that the details page returns HTTP 500 once an assignment holds 11 parameters. No AP-2474 case added more than two, so this run neither confirms nor rules it out; it belongs to the AP-2475 review.
- **Not in scope:** how parameters are used when contracts are earned, and role-based access (only one admin account exists).
- **Test data left on staging:** assignments 2, 3 and 5–14 (all `QA-AP2474-…`) and parameters 9, 11, 13, 18–21. There is no delete action for assignments.

---

## Recommendations

1. Fix AP-2482 (Medium) — add required-field validation to Earning Set and Dealer Group, as the same form already does for Description. AP-2478 on Earning Groups is the same pattern and could be fixed together.
2. Product owner to answer Q-002, Q-006 and Q-011 (duplicates, inverted ranges, identical parameters); if any should be refused, raise a follow-up story.
3. Re-test the 11-parameter HTTP 500 under AP-2475 and file it there if it reproduces.
4. Release AP-2474: all written acceptance criteria are met and the open defect is not a stopping bug.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-10-04 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

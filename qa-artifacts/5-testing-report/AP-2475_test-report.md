# Test Execution Report

**Report ID:** TR-20261004-AP2475
**Project:** Avantage Plus v2 — Admin portal, Risk Management
**Test Cycle:** AP-2475 "Edit earning assignment parameter" — single-ticket STLC run, run folder 5.2.0
**Application version:** Not known — the ticket carries no fix version and the staging build number is not exposed. Tested on Staging (v2staging) on 2026-10-04.
**Date:** 2026-10-04
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ⚠️ CONDITIONAL PASS — Ship with conditions

**Rationale:** The edit feature itself works. 9 of 10 test cases passed (90%), which meets the 90% threshold, and nothing failed. But one High-severity bug is open: AP-2484, where the earning assignment page crashes once it has more than 10 parameters. That breaks the plan's "zero open High bugs" exit criterion and blocked the tenth test case. The condition for release is that AP-2484 is fixed, and AP2475_010 re-run.

---

## Executive Summary

We tested the new ability for an admin to edit a rule ("parameter") on an earning assignment, using 10 test cases on the staging site. Every check of the edit feature itself passed. Each rule has an edit icon. The edit window opens showing the rule's current values. Changes are saved to the right rule, and nothing else is changed. Leaving the window without saving changes nothing. The existing delete icon still works.

One test could not be finished because of a separate fault in the assignment page from the sibling story AP-2474. Once an assignment holds more than 10 rules, the page shows a server error, and none of its rules can be viewed, edited or deleted any more. We filed this as AP-2484 (High). Real assignments are likely to need more than 10 rules, so we recommend fixing AP-2484 before this feature, and AP-2474 with it, is released. Two behaviours are undefined in the ticket and need a product decision. A range typed backwards, such as odometer 50000 to 1000, is accepted. And the edit window has no Cancel button.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 3 of 3 |
| Total test cases | 10 |
| Passed | 9 (90%) |
| Failed | 0 (0%) |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **90% (9 of 10)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

_Pass rate is the share of test cases that passed, counting blocked cases as not passed. The threshold is the `story_pass_threshold` agreed in the project's QA rules._

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

Defect density (bugs per test case): 0.1 (1 bug ÷ 10 cases).

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% — all 4 High cases (AP2475_002, 003, 004, 005) ran and passed | ✅ |
| Pass rate | ≥ 90% | 90% (9 of 10) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 1 (AP-2484) | ❌ |
| Every FAIL filed, linked or dismissed | Yes | Yes — no FAILs; the BLOCKED case's cause is filed as AP-2484 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Pencil (edit) icon in the parameter list | 2 (001, 009) | 2 | 0 | 0 | 100% |
| REQ-002 — Pencil opens the edit window, pre-filled | 2 (002, 008) | 2 | 0 | 0 | 100% |
| REQ-003 — Changes saved to the same rule and kept | 6 (003, 004, 005, 006, 007, 010) | 5 | 0 | 1 | 83% |
| **Total** | **10** | **9** | **0** | **1** | **90%** |

The one gap in REQ-003 is AP2475_010. It checks what happens when an edit makes two rules identical, and it is still untested.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | An earning assignment's details page shows an HTTP 500 error once the assignment has 11 parameters | High | P1 | REQ-001 (page holding the edit icon; page delivered by AP-2474) | [AP-2484](https://garantieavantageplus.atlassian.net/browse/AP-2484) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2475-edit-earning-assignment-parameter.md` | 2026-10-04 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2475_requirements-analysis.md` | 2026-10-04 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2475_test-plan.md` | 2026-10-04 |
| Test Cases | `qa-artifacts/3-test-cases/AP2475_TestCases_001-005.md`, `AP2475_TestCases_006-010.md` | 2026-10-04 |
| Review Findings | `qa-artifacts/3-test-cases/AP2475_ReviewFindings_2026-10-04.md` | 2026-10-04 |
| Execution Log | `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2475_2026-10-04.md` | 2026-10-04 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2475_bug-report.md` | 2026-10-04 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/` (13 files, including the environment check) | 2026-10-04 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2475_test-report.md` | 2026-10-04 |

---

## Risks and Observations

- **The crash past 10 rules (AP-2484) cuts off the whole feature for larger assignments.** Edit and delete both live only on the details page. Until it is fixed, any assignment with 11 or more rules cannot be corrected from the screen at all. The test fixture, assignment #4 "QA-AP2475-011346", is in that state now and serves as a ready reproduction.
- **No validation on ranges (Q-006).** An odometer range typed backwards (from 50000, to 1000) is saved without a warning (AP2475_006), so that rule can never match a vehicle. The ticket sets no rule here, so we did not file it as a bug. The product owner should decide.
- **Validation errors leave the dialog.** A blank number field is refused only by the server, and the admin is moved from the dialog to a separate "Edit Parameter" page with the error (AP2475_007). This works, but it is the same awkward pattern already reported for Earning Groups (AP-2479).
- **No Cancel or close (×) button in the edit window (Q-004).** Only the Esc key closes it without saving (AP2475_008). AP-2480 already reports the same thing for Earning Groups.
- **The edit and delete icons have no tooltip or accessible name.** Screen-reader users cannot tell them apart.
- **The delete confirmation wording differs slightly from AP-2474.** It reads "Are you sure you want to delete this record?" instead of "Are you sure to delete this record?". This is cosmetic only.
- **AP-2476 (making 6 fields optional) is not on staging yet.** The form still defaults "Coverage odometer to" to 9999999, which conflicts with AP-2476's 999999 (Q-007). When AP-2476 is deployed, the edit form should be re-checked.
- **A parallel AP-2474 test run was working in the same screens at the same time.** It did not touch the AP-2475 assignment, but it explains gaps in the record numbers.

---

## Recommendations

1. Fix **AP-2484** (details page HTTP 500 past 10 parameters) before AP-2474 and AP-2475 are released. Then re-run **AP2475_010** on assignment #4, rows `100101` / `100102`, with "AP-2475 --from s4".
2. Ask the product owner (Ken Nguyen) to answer **Q-006**: should the parameter form refuse a "from" value above its "to" for odometer, sale date and model-year age? If yes, raise a story for it.
3. Ask the product owner to answer **Q-004** and **Q-007**: whether the edit window needs a Cancel button, and which odometer default (9999999 or 999999) is correct before AP-2476 is tested.
4. Consider promoting review proposals 2 and 3 into test cases at the next run: editing Model Year Age to `-1` and Coverage odometer to `9999999`. Both are documented defaults, so a failure would be a firm defect.
5. Once AP-2484 is fixed, remove the test parameters from assignment #4 using the trash-can icon, so staging stays tidy.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | CONDITIONAL PASS | _(automated)_ | 2026-10-04 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

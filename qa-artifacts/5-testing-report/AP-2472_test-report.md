# Test Execution Report

**Report ID:** TR-20261004-AP2472
**Project:** Avantage Plus v2 — Admin portal, Risk Management
**Test Cycle:** AP-2472 — Earning Groups Management (single-ticket STLC run, run folder 5.2.0)
**Application version:** Not known. The ticket carries no fix version, and the staging build number is not shown anywhere in the application. Tested on v2staging on 2026-10-03.
**Date:** 2026-10-04
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** 15 of 16 test cases passed, a pass rate of 94% against a 90% threshold. No Critical or High bugs are open, and every written acceptance criterion was proven. The one open Medium bug (AP-2478, a server error page in an edge case) should still be fixed this sprint.

---

## Executive Summary

We tested the new **Earning Groups** admin screen. It lets an administrator create a named group, choose its default earning method, and add or remove the earning curves it contains. 16 checks were run in a real browser on the staging site and 15 passed. Every behaviour the ticket asks for works: the menu entry, the list, creating a group, adding curves, the same curve in several groups, removing a curve with a confirmation, and editing a group. The most important safety check passed: removing a curve from one group does **not** delete the curve or take it out of other groups.

One defect was found (AP-2478, Medium). If an administrator clicks "Assign" when no curve can be chosen, which happens once a group already holds every curve, the site shows a technical error page instead of a message. No data is damaged. Three smaller usability issues were also logged at the QA's request (AP-2479, AP-2480, AP-2481). None of them breaks a written requirement.

Two questions for the product owner remain open. A group's "Is Enabled?" setting is always "Yes" and cannot be changed anywhere. A switched-off (disabled) earning curve can still be added to a group.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 8 of 8 |
| Total test cases | 16 |
| Passed | 15 (93.75%) |
| Failed | 1 (6.25%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **93.75% (15 of 16)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

_Pass rate means the share of test cases that behaved as expected._

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 1 | 0 | 1 |
| Low | 3 | 0 | 3 |
| **Total** | **4** | **0** | **4** |

Defect density: 4 bugs / 16 test cases = 0.25 per test case. Only 1 of the 4 came from a failed test; the 3 Low bugs are usability findings from tests that passed.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (6 of 6: AP2472_003, 004, 005, 009, 011, 015; all 16 cases ran) | ✅ |
| Pass rate | ≥ 90% | 93.75% (15 of 16) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets created | Yes | Yes — AP-2478, AP-2479, AP-2480, AP-2481 | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — "Earning Groups" menu item | 1 | 1 | 0 | 0 | 100% |
| REQ-002 — Earning Groups list page | 2 | 2 | 0 | 0 | 100% |
| REQ-003 — "Create New" modal form | 5 | 5 | 0 | 0 | 100% |
| REQ-004 — Create and open the details page | 1 | 1 | 0 | 0 | 100% |
| REQ-005 — Assigning a curve | 4 | 3 | 1 | 0 | 100% |
| REQ-006 — Assigned-curves grid | 1 (shared with REQ-005: AP2472_009) | 1 | 0 | 0 | 100% |
| REQ-007 — Unassigning with confirmation | 2 | 2 | 0 | 0 | 100% |
| REQ-008 — Editing a group (minimum only) | 1 | 1 | 0 | 0 | 100% |
| **Total** | **16** | **15** | **1** | **0** | **100%** |

Each test case is counted once, under its main requirement. Coverage means the share of that requirement's cases that ran to a result. **REQ-008 coverage is limited** because the ticket only says an "Edit" item exists. We proved that editing the name and method saves and keeps the curves, and nothing more.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Clicking "Assign" on an earning group with no curve selected shows an HTTP 500 error page | Medium | P2 | REQ-005 | [AP-2478](https://garantieavantageplus.atlassian.net/browse/AP-2478) | Open |
| BUG-002 | Saving a new earning group with a blank name closes the modal and shows the error on a separate page _(usability, not AC-backed)_ | Low | P4 | REQ-003 | [AP-2479](https://garantieavantageplus.atlassian.net/browse/AP-2479) | Open |
| BUG-003 | The Create and Edit earning group modals have no Cancel or close (×) button _(usability, not AC-backed)_ | Low | P4 | REQ-003, REQ-008 | [AP-2480](https://garantieavantageplus.atlassian.net/browse/AP-2480) | Open |
| BUG-004 | A long earning group name pushes the "View" button off-screen in the list _(usability, not AC-backed)_ | Low | P4 | REQ-002 | [AP-2481](https://garantieavantageplus.atlassian.net/browse/AP-2481) | Open |

Every bug is linked to AP-2472 ("Relates"), and its screenshots are embedded in the ticket description.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2472-earning-groups-management.md` | 2026-10-03 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2472_requirements-analysis.md` | 2026-10-03 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2472_test-plan.md` | 2026-10-03 |
| Test Cases | `qa-artifacts/3-test-cases/AP2472_TestCases_001-005.md`, `_006-010.md`, `_011-015.md`, `_016-016.md` | 2026-10-03 |
| Review Findings | `qa-artifacts/3-test-cases/AP2472_ReviewFindings_2026-10-03.md` | 2026-10-03 |
| Execution Log | `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md` | 2026-10-03 (Gate C re-check appended 2026-10-04) |
| Bug Report | `qa-artifacts/5-testing-report/AP-2472_bug-report.md` | 2026-10-04 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/` (39 files) | 2026-10-03 |
| Feature knowledge (write-back) | `qa-artifacts/qa-docs/earning-groups.md` | 2026-10-03 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2472_test-report.md` | 2026-10-04 |

---

## Risks and Observations

- **"Is Enabled?" cannot be set (open question Q-002).** Every group shows "Yes", and neither the Create nor the Edit form has an Is Enabled? control. The ticket shows the column but never says how it changes. If disabling a group is meant to matter later, there is currently no way to do it.
- **Disabled curves can be added to a group (open question Q-005).** A curve switched off in Earning Curves is still offered in a group's "Earning Curve" list, with no marker. The ticket does not say whether that is allowed, so this was not filed as a bug. If it is not intended, a retired earning pattern could still be applied through a group.
- **Silent default curve.** On a group that does not hold every curve, the "Earning Curve" list has no empty choice and pre-selects the first curve ("1 year"). Clicking "Assign" without choosing adds that curve. This is recorded as context in AP-2478.
- **Duplicate group names are allowed (Q-001).** Two groups can share a name with no warning. The ticket does not forbid it, but identical names could be confused wherever groups are picked later.
- **Unassign wording.** The confirmation reads "Are you sure you want to delete this record?" (the ticket says "Are you sure to delete this record?"), under the heading "Unassign earning curve". Only the link is removed, so "delete" slightly overstates what happens. The meaning was judged equivalent.
- **Test data left on staging.** There is no delete action for groups and no clean-up procedure, so 15 test groups (`QA-AP2472-…-2339`, ids 2–16) and 2 test curves (`QA-AP2472-Curve-A` id 7, `QA-AP2472-Curve-B-Disabled` id 8) remain. The seeded group "AV+" and curves 1–6 were not changed. The list now pages at 10 rows, so "AV+" is on page 2.
- **Knowledge gap closed.** The Earning Groups routes were written back to `qa-artifacts/qa-docs/earning-groups.md` and indexed in `navigation-map.md`. The `domain` row in `qa-config/knowledge.md` does not list the new file yet; the QA owns that file.

---

## Recommendations

1. **Fix AP-2478 this sprint.** Add a "not blank" check on the assign form's "Earning Curve" field so that an empty submit shows a message instead of a server error. It is a small change and removes the only failed test.
2. **Ask Ken Nguyen to answer Q-002 and Q-005 on AP-2472.** Should groups be able to be disabled, and from where? Should disabled curves be assignable? Both affect how groups behave once Earning Assignments use them.
3. **Consider adding an empty "Choose a curve" option to the "Earning Curve" list**, so that "Assign" never silently adds "1 year". This would also make AP-2478's fix the natural path.
4. **Triage the three Low usability bugs (AP-2479, AP-2480, AP-2481) as a group.** AP-2479 and AP-2480 probably come from a shared admin modal pattern (Earning Sets behaves the same way), so one fix may cover several screens. They can be deferred without risk to data.
5. **Re-test after the AP-2478 fix** by running AP2472_013 again: "AP-2472 --from s4", or that single case.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-10-04 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

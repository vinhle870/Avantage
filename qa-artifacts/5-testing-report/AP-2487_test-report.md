# Test Execution Report

**Report ID:** TR-20261012-001
**Project:** Avantage Plus v2 — Admin portal, Risk Management › Earning Assignments
**Test Cycle:** AP-2487 — Earning assignments parameter: Add warranty start date range and Make Coverage Code multiple choices (single-ticket STLC run, run folder 5.2.0)
**Application version:** Not exposed by the admin portal. The AP-2487 change was confirmed present on staging by the pre-execution build check
**Date:** 2026-10-12
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 12 test cases passed (100%, against the 90% threshold) and no defect was found, so every exit criterion in the test plan is met.

---

## Executive Summary

The QA agent tested AP-2487 on the staging Admin portal on 2026-10-12. The ticket adds a warranty start date range to an earning assignment parameter, shows the range in the parameter list, and lets admins pick several Coverage Codes in one parameter. All twelve test cases passed, covering all three requirements.

The **Start date from** and **Start date To** fields sit right after "Sale Date to" on both the Add and Edit dialogs. Both are optional and use the same date picker as Sale Date. A saved range appears in the new **Start date** column and is shown again on Edit. Changing the dates replaces the old ones, and clearing them removes the range. Either half can be saved on its own, and text that is not a date is refused with "This value is not valid.". Several Coverage Codes can be ticked, and every ticked code is stored, listed and shown again on Edit. Rules saved before this change still open with their single code ticked. The AP-2476 behaviour, where a rule with every optional field left on "All" saves, still works.

No bugs were filed. Four points the ticket leaves open are recorded as observations below. The most notable is that a reversed date range, where "from" is later than "to", is saved without any warning. The effect of the new fields on the earning calculation cannot be seen from the admin screens, so this run does not verify it.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 3 of 3 |
| Total test cases | 12 |
| Passed | 12 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100%** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (4 of 4) | ✅ |
| Pass rate | ≥ 90% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Warranty start date range on the form | 8 (001, 002, 003, 004, 005, 006, 007, 011) | 8 | 0 | 0 | 100% |
| REQ-002 — "Start date" datagrid column | 6 (002, 003, 004, 005, 006, 011) | 6 | 0 | 0 | 100% |
| REQ-003 — Multiple Coverage Codes | 5 (008, 009, 010, 011, 012) | 5 | 0 | 0 | 100% |
| **Total** | **12** | **12** | **0** | **0** | **100%** |

Several cases cover more than one requirement, so the rows add up to more than 12.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found | — | — | — | — | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2487-earning-assignments-parameter-warranty-start-date.md` | 2026-10-12 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2487_requirements-analysis.md` | 2026-10-12 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2487_test-plan.md` | 2026-10-12 |
| Test Cases | `qa-artifacts/3-test-cases/AP2487_TestCases_001-005.md`, `AP2487_TestCases_006-010.md`, `AP2487_TestCases_011-012.md` | 2026-10-12 |
| Review Findings | `qa-artifacts/3-test-cases/AP2487_ReviewFindings_2026-10-12.md` | 2026-10-12 |
| Execution Log | `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2487_2026-10-12.md` | 2026-10-12 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2487_bug-report.md` | 2026-10-12 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2487/` (18 files) | 2026-10-12 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2487_test-report.md` | 2026-10-12 |

---

## Risks and Observations

- **Effect on the earning calculation is unverified (Q-001).** The run proves that the start date range and the selected codes are stored and shown. It does not prove how contracts are matched against them, for example whether the "to" date is included.
- **A reversed range saves silently (Q-002).** "From" 2026-12-31 with "to" 2026-01-01 is saved as entered and never matches a contract. The odometer range on this form has no such check either. Ask the product owner whether a check is wanted.
- **The empty Start date display differs from the other fields (Q-003).** An empty Start date cell is blank, not "All". A half range shows `2026-04-01 -` instead of `2026-04-01 - All`. The Start date boxes have no "All" hint. This is cosmetic.
- **"Select All" is not the same as "All" (Q-005).** It stores all 57 codes individually and lists them all, making the row very tall. If a code is added later, rules saved with "Select All" will not include it, while rules saved with no code ("All") will.
- **Several codes are listed one per line (Q-004)**, each with its full "CODE - Name" label.
- **Minor UI issue:** after a date is typed, the date picker stays open and covers the Submit button until the admin clicks elsewhere.
- **Coverage limits:** the run covers the twelve designed cases only. The eight reviewer proposals, none of them High, were not run. These include editing an unrelated field on a rule that has dates and codes, and checking that the error page keeps the ticked codes.

---

## Recommendations

1. Move AP-2487 to release. The pass rate and bug rules are met.
2. Ask Ken Nguyen about Q-001 (how the range is matched) and Q-002 (should a reversed range be refused).
3. Decide whether "Select All" should save as "All" (Q-005). This matters if new coverage codes are added later.
4. In a later cycle, run reviewer proposals #1 and #2 (unrelated edit keeps dates and codes; error page keeps ticked codes).

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-10-12 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

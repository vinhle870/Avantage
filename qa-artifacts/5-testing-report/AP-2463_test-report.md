# Test Execution Report

**Report ID:** TR-20261004-AP2463
**Project:** Avantage Plus v2 — Dealer and Admin portals, Permaplate ("Esthetic protection") contract lists
**Test Cycle:** AP-2463 bug re-test — the "Client phone" column showed the work number while the quote page showed the home number. Run folder 5.1.0
**Application version:** Not exposed by the application — Jira records the fix deployed to Staging on 2026-09-21
**Date:** 2026-10-04
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 3 re-test cases passed (100%), and the reported behaviour no longer occurs on either list.

---

## Executive Summary

AP-2463 reported that the Permaplate contract list showed only a client's work phone, while the quote page showed their home phone, with nothing saying which was which. On 2026-09-10 the product owner decided that the column should list both numbers, labelled "Cell" and "Home". The QA agent re-tested this on Staging with the contract that originally showed the problem (PNA-0000000007, client Perma Testclient). The dealer list now shows "Cell: 5145550101" and "Home: 5145550100", the admin list shows the same two labelled numbers, and nothing around the fix broke: the other columns and the PDF download work, and the quote page still shows the home number. The only gap is cosmetic: numbers appear as they were typed (for example 5145550101) rather than in the agreed 514-555-0101 format.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 |
| Total test cases | 3 |
| Passed | 3 (100%) |
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
| Low | 0 | 1 (AP-2463, re-tested fixed) | 1 |
| **Total** | **0** | **1** | **1** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (2 of 2) | ✅ |
| Pass rate | ≥ 90% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| AP-2463 — both numbers, labelled, on the dealer list | 1 | 1 | 0 | 0 | 100% |
| AP-2463 — the same on the admin list | 1 | 1 | 0 | 0 | 100% |
| Regression around the fix | 1 | 1 | 0 | 0 | 100% |
| **Total** | **3** | **3** | **0** | **0** | **100%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-005 (Permaplate run) | Permaplate contract list shows the client work phone while the quote page shows the home phone | Low | P4 | AP-2443 criterion 6 | [AP-2463](https://garantieavantageplus.atlassian.net/browse/AP-2463) | Re-tested — fixed |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2463-permaplate-list-client-phone-work-vs-home.md` | 2026-10-04 |
| Requirements Analysis | Skipped — bug re-test (the steps to reproduce are the requirement) | — |
| Test Plan | Skipped — bug re-test | — |
| Test Cases | `qa-artifacts/3-test-cases/AP2463_TestCases_001-003.md` | 2026-10-04 |
| Execution Log | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2463_2026-10-04.md` | 2026-10-04 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2463_bug-report.md` | 2026-10-04 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2463/` (5 files) | 2026-10-04 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2463_test-report.md` | 2026-10-04 |

---

## Risks and Observations

- **Digit format:** the agreed template is "Cell: xxx-xxx-xxxx", but numbers are shown exactly as stored, so formats differ between rows (`5145550101` beside `124-123-1234`). Both numbers and both labels are present, so the defect itself is fixed.
- **Missing numbers (admin list):** a missing number drops its line — contracts 4 and 14 show only "Home: …", and contract 11 shows no phone at all. Contract 3 shows "Cell: 3", which is bad data stored in that record. All three rows on the dealer list have both numbers.
- **Layout difference:** the admin list has no separate phone column; the two numbers sit in the "Client" cell under the email, as tap-to-call links. The content matches the dealer list.
- **Rename:** the program now appears as "Esthetic protection" in both sidebars and page headings (the routes still say `permaplate`), as Ken Nguyen announced on 2026-09-08.

---

## Recommendations

1. Close AP-2463: the reported behaviour no longer occurs on either list.
2. If the dashed format matters, raise a small follow-up to format the numbers as xxx-xxx-xxxx on display.
3. Optionally clean up contract 3's "Cell: 3" record on staging.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-10-04 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Minh Lưu | Pending | | |
| Product Owner | Ken Nguyen | Pending | | |

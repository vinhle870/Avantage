# Test Execution Report — AP-2485

**Report ID:** TR-20261101-001
**Project:** Avantage Plus v2 — Admin portal (Jira project AP)
**Test Cycle:** Bug re-test of AP-2485 — "Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors" (run folder `no-sprint`)
**Application version:** Not known — the admin portal does not show a build number, and the ticket names no fix version. The build under test is whatever was deployed on Dev on 2026-11-01.
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/. This batch was executed on Dev by the user's decision, not on staging.

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 3 of 3 test cases passed (100%, above the 90% threshold), and no bug was found, so the fix for AP-2485 holds on Dev.

---

## Executive Summary

AP-2485 reported that when an administrator built a 12-month earning curve, tried another
calculation type and then went back to "Pro-Rata", the table kept the other type's numbers. A
curve labelled Pro-Rata could then be saved with the wrong numbers and recognise premium income
on the wrong schedule, with no warning on screen. We re-tested the fix on the Dev environment
with 3 test cases: the exact steps from the bug report (saved and reopened), the same switch
from "Reverse rule of 78" plus a 24-month curve to make sure the fix broke nothing nearby, and
the same switch on an existing curve's edit page. All 3 passed: in every case the table showed
and saved the correct Pro-Rata values (0.0833 each month for 12 months). No new problems were
found, so the bug can be closed.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (the bug's steps to reproduce and expected result) |
| Total test cases | 3 |
| Passed | 3 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100%** (3 of 3) |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

The pass rate is the share of test cases that passed, out of all cases except skipped ones.

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

There is no test plan for a bug re-test (stage s2 is skipped in this flow), so the default exit
criteria apply.

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (3 of 3) | ✅ |
| Pass rate | ≥ 90% | 100% | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| Steps to Reproduce + Expected Result — Rule of 78 → Pro-Rata, 12 months, create page, saved and reopened | 1 (AP2485_001) | 1 | 0 | 0 | 100% |
| Actual Result — the same fault from Reverse rule of 78, and the 24-month path that must stay correct (regression: a check that nearby behaviour that worked before still works) | 1 (AP2485_002) | 1 | 0 | 0 | 100% |
| Summary / Reproducibility — an existing curve's edit page | 1 (AP2485_003) | 1 | 0 | 0 | 100% |
| **Total** | **3** | **3** | **0** | **0** | **100%** |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | Not written — skipped in the bug re-test flow; the capture is `requirements/AP-2485-switching-a-12-month-earning-curve-back.md` | 2026-11-01 |
| Test Plan | Not written — skipped in the bug re-test flow | — |
| Test Cases | `qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md` | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2485_bug-report.md` | 2026-11-01 |
| Review record | `qa-artifacts/7-reviews/AP-2485_review.md` (R2 and R3 APPROVE) | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/` (3 files: AP2485_001-step5-ReopenedProRataFactors_pass.png, AP2485_002-step5-ProRata24MonthFactors_pass.png, AP2485_003-step5-EditedCurveProRataFactors_pass.png) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2485_test-report.md` | 2026-11-01 |

---

## Risks and Observations

- **Tested on Dev, not staging.** The bug was found on staging; this re-test ran on Dev
  (v2dev) by the user's decision for this batch. If staging runs a different build, the fix
  is proven on Dev only until staging receives the same build.
- **Test data left on Dev.** Earning curves have no delete control, so two curves created by
  this run stay on Dev: **#14** `QA-AP2485-Repro-033220` (12 months, Pro-Rata) and **#15**
  `QA-AP2485-Edit-033346` (12 months, created as Rule of 78 and saved as Pro-Rata). Both use
  odometer 0 – 10000.
- **60-month curves were not re-checked.** The bug said 24 and 60 months already worked; only
  24 months was exercised, as a representative of the non-default terms (reviewer R2 F-2).
- **No screenshot of the on-screen table right after switching back.** Only the final state of
  each case is captured; the saved curves #14 and #15 prove the stored values (reviewer R3 F-1).
- The admin login page logs a JavaScript error on load (`ReferenceError: $ is not defined`).
  It did not stop the login and is unrelated to this ticket.

---

## Recommendations

1. Move AP-2485 to Done: the reported behaviour no longer occurs on the create page or the edit page.
2. Re-run AP2485_001 on staging once the same build is deployed there, if the team needs staging evidence before release.
3. Ignore or rename curves #14 and #15 on Dev if they get in the way of other tests; they cannot be deleted.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-01 |
| QA Lead | Not known | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Not known | Pending | | |

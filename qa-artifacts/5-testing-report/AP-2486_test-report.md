# Test Execution Report — AP-2486

**Report ID:** TR-20261101-001
**Project:** Avantage Plus v2 — Admin portal (Jira project AP)
**Test Cycle:** Bug re-test of AP-2486 — "Saving a Custom earning curve with an empty monthly factor shows an HTTP 500 error page" (run folder `no-sprint`)
**Application version:** Not known — the admin portal does not show a build number, and the ticket names no fix version. The build under test is whatever was deployed on Dev on 2026-11-01.
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/. This batch was executed on Dev by the user's decision, not on staging. The fix is verified on Dev only.

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 3 of 3 test cases passed (100%, above the 90% threshold), and no bug was found, so the fix for AP-2486 holds on Dev.

---

## Executive Summary

AP-2486 reported that when an administrator saved a "Custom" earning curve with one of its
monthly factor boxes left empty, the system showed a generic French "technical difficulties"
error page instead of telling them which box to fill in. We re-tested the fix on the Dev
environment with 3 test cases: the exact steps from the bug report on an existing curve's edit
page, the original trigger (letters typed into a number box) on the create page, and a check
that a curve with every factor filled in still saves exactly as typed. All 3 passed: the empty
box is now refused with the message "This value should not be blank." shown under it, nothing
is saved and the curve's other values are untouched, and ordinary curves still save normally.
No new problems were found, so the bug can be closed; staging has not been re-checked.

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
| Steps to Reproduce 1–5 + Expected Result — edit page, cleared Monthly Factor box, "Save" | 1 (AP2486_001) | 1 | 0 | 0 | 100% |
| Notes — the original trigger (letters typed into the number box) on the create page | 1 (AP2486_002) | 1 | 0 | 0 | 100% |
| Fix side effect — a fully filled Custom curve still saves and stores exactly what was typed (regression: a check that nearby behaviour that worked before still works) | 1 (AP2486_003) | 1 | 0 | 0 | 100% |
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
| Requirements Analysis | Not written — skipped in the bug re-test flow; the capture is `requirements/AP-2486-custom-earning-curve-empty-factor-http-500.md` | 2026-11-01 |
| Test Plan | Not written — skipped in the bug re-test flow | — |
| Test Cases | `qa-artifacts/3-test-cases/AP2486_TestCases_001-003.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2486_2026-11-01.md` | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2486_bug-report.md` | 2026-11-01 |
| Review record | `qa-artifacts/7-reviews/AP-2486_review.md` (R2 and R3 APPROVE) | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2486/` (5 files: AP2486_001-step4-BlankFactorFieldMessage_pass.png, AP2486_001-step5-FactorsUnchangedAfterRefusedSave_pass.png, AP2486_002-step3-CreatePageBlankFactorMessage_pass.png, AP2486_002-step4-NoCurveSavedInList_pass.png, AP2486_003-step4-EditedFactorsStored_pass.png) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2486_test-report.md` | 2026-11-01 |

---

## Risks and Observations

- **Tested on Dev, not staging.** The bug was found on staging; this re-test ran on Dev
  (v2dev) by the user's decision for this batch. The fix is verified on Dev only, not on
  staging, until staging receives the same build.
- **The new ±1000 Monthly Factor bound was not tested.** The developer's comment of
  2026-10-29 names it but does not say whether it is inclusive or which message it shows, so
  there was nothing to assert.
- **Negative Custom factors are still accepted** by design of this fix; the open question
  belongs to AP-2471 (comment 19344) and is out of scope here.
- **Unverified observation (reviewer R3 F-2):** after the refused save on the create page
  (AP2486_002), the row 1–3 Monthly Factor boxes appear with a grey background in the
  screenshot. Whether they were still editable was not checked. If they are read-only, an
  administrator would have to start the form over to correct it. This does not change any
  result; it should be checked on the next run.
- **Test data left on Dev.** Earning curves have no delete control, so two curves created by
  this run stay on Dev: **#22** `QA-AP2486-Retest-034814` and **#23** `QA-AP2486-Valid-034928`
  (both 4 months, Custom, odometer 0 – 60000). AP2486_002 saved nothing.
- **Knowledge file out of date for Dev.** The `domain` file `earning-curves.md` still says an
  empty Custom factor gives HTTP 500; it was not changed because the fix is not yet confirmed
  on staging, which that file describes.
- The admin login page logs a JavaScript error on load (`ReferenceError: $ is not defined`).
  It did not stop the login and is unrelated to this ticket.

---

## Recommendations

1. Move AP-2486 to Done: the HTTP 500 page no longer appears on the edit page or the create page; an empty factor is refused with "This value should not be blank."
2. Re-run AP2486_001 on staging once the same build is deployed there, then update `earning-curves.md` to the new message.
3. On the next run of AP2486_002, check whether the row 1–3 factor boxes stay editable after the refused save; raise a separate bug only if they do not.
4. Decide the ±1000 bound's edges and message on AP-2471 so a test case can assert it.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-01 |
| QA Lead | Not known | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Not known | Pending | | |

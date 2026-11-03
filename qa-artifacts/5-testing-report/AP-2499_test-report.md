# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus v2 — Dealer portal, AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Test Cycle:** AP-2499 single-ticket STLC run, run folder no-sprint
**Application version:** Not known — the Dev build carries no version beyond the footer "Avantage Plus System v2.0.0"; the ticket's pull request was merged on 2026-10-26
**Tested on:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"), by the user's decision. Staging was not tested.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 5 of 13 test cases passed (38%, against a 90% pass-rate threshold — the share of test cases that must pass), and three new Medium bugs (AP-2526, AP-2527, AP-2528) break the "stay in one modal" flow the story promises.

---

## Executive Summary

We tested the new GAP and creditors insurance window on the quote page, which should let a dealer enter the financing and get an insurance quote without leaving that window. The first half works: on a quote with no financing, the window now shows a financing form instead of the old "Please add a financing" dead end, saving a financing there stores every value correctly, and bad or missing values are refused with clear messages and nothing is saved. The second half does not work as the ticket describes. Once a financing exists, the form is folded into one summary line, so the dealer cannot see the stored values without clicking "Edit" (AP-2526). Saving a corrected financing in the creditors window shows the whole quote page inside the window (AP-2527). Clicking "Get Quote" reloads the page and closes the window, so the insurance result never appears in it (AP-2528). No data is lost by any of these bugs, but the dealer still has to close and reopen the window, which is the detour this story was meant to remove. Three cases could not be judged: the empty-residual case and the failed-quote case wait on answers from the ticket author (Q-011, Q-007), and no Humania dealer exists on Dev (Q-002).

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 6 of 6 (each has at least one executed case) |
| Total test cases | 13 |
| Passed | 5 (38%) |
| Failed | 5 (38%) |
| Blocked | 3 |
| Skipped | 0 |
| **Pass rate** | **38% (5 of 13)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 3 | 0 | 3 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

Defect density: 3 bugs over 13 test cases = 0.23 per test case.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 90% (9 of 10 — AP2499_013 BLOCKED, no Humania dealer) | ❌ |
| Pass rate | ≥ 90% | 38% (5 of 13) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 (test plan: zero Critical and zero High) | 0 | ✅ |
| Every FAIL filed, linked or dismissed | Yes | Yes — 5 FAILs → 3 new bugs | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Coverage here is the share of the requirement's cases that ran to a PASS or FAIL._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Financing form replaces the alert | 3 | 2 | 0 | 1 | 67% |
| REQ-002 — Financing form always first, insurance below | 6 | 2 | 2 | 2 | 67% |
| REQ-003 — Prefill from the stored financing | 4 | 1 | 2 | 1 | 75% |
| REQ-004 — Submit saves and continues in the modal | 2 | 0 | 2 | 0 | 100% |
| REQ-005 — Insurance result below; failure keeps values | 3 | 0 | 2 | 1 | 67% |
| REQ-006 — Financing validation, nothing saved | 3 | 3 | 0 | 0 | 100% |
| **Total** | **13** | **5** | **5** | **3** | **77%** |

A case can cover more than one requirement, so the rows add up to more than 13; the Total row counts each case once.

| TC ID | Title | Priority | Status | Bug / blocker |
|---|---|:---:|:---:|---|
| AP2499_001 | GAP modal on a quote with no financing shows the financing form, not the alert | High | PASS | — |
| AP2499_002 | Creditors modal on a quote with no financing shows the financing form, not the alert | High | PASS | — |
| AP2499_003 | Financing submitted in the GAP modal is saved and the modal moves on | High | FAIL | AP-2526 |
| AP2499_004 | Creditors modal on a quote with a financing shows the financing form first with the stored values | High | FAIL | AP-2526 |
| AP2499_005 | GAP modal on a financing with no residual does not invent a residual | Medium | BLOCKED | Q-011 — an empty residual cannot be stored |
| AP2499_006 | Correcting the base amount in the creditors modal saves the new amount | High | FAIL | AP-2527 |
| AP2499_007 | Creditors quote result shows below the form in the same modal | High | FAIL | AP-2528 |
| AP2499_008 | GAP quote result shows below the form in the same modal | High | FAIL | AP-2528 |
| AP2499_009 | A failed insurance quote shows an error and keeps the entered values | Medium | BLOCKED | Q-007 — failure not reproduced with Life term 999 |
| AP2499_010 | An empty financing form shows field errors and saves nothing | High | PASS | — |
| AP2499_011 | Text base amount and negative rate leave the stored financing unchanged | High | PASS | — |
| AP2499_012 | Empty residual and date of birth do not store invented values | Medium | PASS | — |
| AP2499_013 | Humania dealer: financing form above the insurance form | High | BLOCKED | Q-002 — no Humania dealer on Dev |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Once a quote has a financing, the GAP/creditors add modal folds the financing form into one summary line behind an "Edit" link | Medium | P2 | REQ-002, REQ-003 | [AP-2526](https://garantieavantageplus.atlassian.net/browse/AP-2526) | Open |
| BUG-002 | Saving the financing in the creditors-insurance modal of a quote that already has a financing draws the whole quote page inside the modal | Medium | P2 | REQ-004 | [AP-2527](https://garantieavantageplus.atlassian.net/browse/AP-2527) | Open |
| BUG-003 | "Get Quote" in the GAP/creditors add modal reloads the quote page and closes the modal, so the insurance result is never shown below the form | Medium | P2 | REQ-005 | [AP-2528](https://garantieavantageplus.atlassian.net/browse/AP-2528) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2499_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md`, `AP2499_TestCases_006-010.md`, `AP2499_TestCases_011-013.md` | 2026-11-01 (results 2026-11-02) |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2499_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/` (21 files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2499_review.md` | 2026-11-01 – 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2499_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev only.** Every result is from Dev (v2dev), by the user's decision. Staging was never opened, so the results say nothing about the staging build.
- **The failure branch of REQ-005 is untested (Q-007).** AP2499_009 tried Life term 999 to make the creditors quote fail, but Chubb's development API priced it, silently treating it as a 60-month term (18.58$/m). This is recorded under Q-007, not as a bug. Until someone names a way to make a quote fail, nobody can say whether the window keeps the dealer's values on an error.
- **The residual cannot be left empty (Q-011).** The financing form refuses an empty residual with "This value should not be blank.", although the Validation criterion does not list the residual. Whether that is intended is asked as Q-011, so AP2499_005 stays BLOCKED rather than FAIL.
- **The Humania half of REQ-002 is untested (Q-002).** No dealer configured for Humania exists on Dev, so AP2499_013 was not run, and was not replaced by a Chubb dealer.
- **Same "fold behind Edit" pattern on three windows.** AP-2526 (this story), AP-2521 (extended warranty) and AP-2524 (roadside protection) all fold a form into a summary line behind "Edit"; they probably share one component and may be fixed together.
- **AP-2410 is related.** It reports an error on the same "Get Quote" of `/quote/{id}/insurance`; on Dev that submit succeeds, but the page reloads and the window closes (AP-2528).
- **Cosmetic, not filed:** right after saving a financing inside the GAP window, the quote page behind it still says "You have not added financing details yet" until reloaded (mentioned in AP-2526 as context).
- **Test data left on Dev:** quotes 6533–6544 on vehicle 915 (dealer 1380), with clients `client.stage.2499001`–`2499012@yopmail.com`; financings on 6535, 6536, 6538, 6539, 6540, 6541, 6543; Chubb creditors quotes (no contract) on 6539 and 6541; a GAP quote (no contract) on 6540. No contract was created.

---

## Recommendations

1. Fix AP-2526 so the financing form opens expanded with its stored values whenever a financing exists, and check AP-2521 and AP-2524 at the same time, since they look like the same shared component.
2. Fix AP-2527 so that saving the financing in the creditors window re-draws the creditors insurance step, the same way the GAP window already does on a quote without financing.
3. Fix AP-2528 so "Get Quote" submits inside the window and shows the premium below the form, then re-run AP2499_003, 004, 006, 007 and 008 with "AP-2499 --from s4".
4. Ask the ticket author (Nicolas-Eric Tain) on AP-2499 to answer Q-011 (is the residual optional?) and Q-007 (how to make a GAP or creditors quote fail on Dev or staging), so AP2499_005 and AP2499_009 can be judged.
5. Name a dealer account configured for Humania (Q-002) so AP2499_013 can run.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |

# Test Execution Report

**Report ID:** TR-20261115-001 (replaces TR-20261102-001)
**Project:** Avantage Plus v2 — Dealer portal, AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Test Cycle:** AP-2499 single-ticket STLC run, run folder no-sprint — re-run of the re-designed AP2499_005 and AP2499_009 on 2026-11-15 (batch qa-agent 2026-11-15); the other 11 results are carried forward from 2026-11-02
**Application version:** Not known — the Dev build carries no version beyond the footer "Avantage Plus System v2.0.0"; the ticket's pull request was merged on 2026-10-26
**Tested on:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"), the registry's execution environment. Staging was not tested.
**Date:** 2026-11-15 (first run 2026-11-02)
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 5 of 13 test cases passed (38%, against a 90% pass-rate threshold — the share of test cases that must pass), and four Medium bugs are open: three (AP-2526, AP-2527, AP-2528) break the "stay in one window" flow the story promises, and the new one (AP-2566) fills an empty date of birth with today's date, which would price the insurance on a wrong age.

---

## Executive Summary

We tested the new GAP and creditors insurance window on the quote page, which should let a dealer enter the financing and get an insurance quote without leaving that window. The first half works: on a quote with no financing, the window now shows a financing form instead of the old "Please add a financing" dead end, saving a financing there stores every value correctly, and bad or missing values are refused with clear messages and nothing is saved. The second half does not work as the ticket describes. Once a financing exists, the form is folded into one summary line behind "Edit" (AP-2526); saving a corrected financing in the creditors window shows the whole quote page inside the window (AP-2527); and "Get Quote" reloads the page and closes the window, so the result never appears in it (AP-2528). Today's re-test found a fourth problem: when a financing is saved without the borrower's date of birth, every financing form afterwards shows today's date as the date of birth (AP-2566). A dealer who does not notice would send the insurer a borrower "born today", and the same problem stops us from testing what the window does when the insurer returns an error. One case still cannot run because no dealer set up for the insurer Humania exists on Dev.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 6 of 6 (each has at least one case that ran to PASS or FAIL) |
| Total test cases | 13 |
| Passed | 5 (38%) |
| Failed | 6 (46%) |
| Blocked | 2 |
| Skipped | 0 |
| **Pass rate** | **38% (5 of 13)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

Run on 2026-11-15: AP2499_005 (FAIL) and AP2499_009 (BLOCKED). The other 11 results are from 2026-11-02 and were not re-run.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 4 | 0 | 4 |
| Low | 0 | 0 | 0 |
| **Total** | **4** | **0** | **4** |

Defect density: 4 bugs over 13 test cases = 0.31 per test case. All four bugs are in Backlog, assigned to Minh Lưu (read on 2026-11-15).

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
| Every FAIL filed, linked or dismissed | Yes | Yes — 6 FAILs → 4 bugs (AP-2566 filed today; AP-2526, AP-2527, AP-2528 on 2026-11-02) | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Coverage here is the share of the requirement's cases that ran to a PASS or FAIL._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Financing form replaces the alert | 3 | 2 | 0 | 1 | 67% |
| REQ-002 — Financing form always first, insurance below | 6 | 2 | 3 | 1 | 83% |
| REQ-003 — Prefill from the stored financing | 3 | 1 | 2 | 0 | 100% |
| REQ-004 — Submit saves and continues in the modal | 2 | 0 | 2 | 0 | 100% |
| REQ-005 — Insurance result below; failure keeps values | 3 | 0 | 2 | 1 | 67% |
| REQ-006 — Financing validation, nothing saved | 3 | 3 | 0 | 0 | 100% |
| **Total** | **13** | **5** | **6** | **2** | **85%** |

A case can cover more than one requirement, so the rows add up to more than 13; the Total row counts each case once. AP2499_005 was re-designed on 2026-11-15 to check an empty date of birth (REQ-002, REQ-003) instead of an empty residual.

| TC ID | Title | Priority | Status | Bug / blocker |
|---|---|:---:|:---:|---|
| AP2499_001 | GAP modal on a quote with no financing shows the financing form, not the alert | High | PASS | — |
| AP2499_002 | Creditors modal on a quote with no financing shows the financing form, not the alert | High | PASS | — |
| AP2499_003 | Financing submitted in the GAP modal is saved and the modal moves on | High | FAIL | AP-2526 |
| AP2499_004 | Creditors modal on a quote with a financing shows the financing form first with the stored values | High | FAIL | AP-2526 |
| AP2499_005 | GAP modal on a stored financing with no date of birth shows Date of birth blank | Medium | FAIL | AP-2566 (run 2026-11-15, quote 6710) |
| AP2499_006 | Correcting the base amount in the creditors modal saves the new amount | High | FAIL | AP-2527 |
| AP2499_007 | Creditors quote result shows below the form in the same modal | High | FAIL | AP-2528 |
| AP2499_008 | GAP quote result shows below the form in the same modal | High | FAIL | AP-2528 |
| AP2499_009 | A creditors quote for a borrower with no date of birth shows an error and keeps the entered values | Medium | BLOCKED | AP-2566 — the empty date of birth comes back as today's date, so the trigger cannot be set up (run 2026-11-15, quote 6711) |
| AP2499_010 | An empty financing form shows field errors and saves nothing | High | PASS | — |
| AP2499_011 | Text base amount and negative rate leave the stored financing unchanged | High | PASS | — |
| AP2499_012 | Empty residual and date of birth do not store invented values | Medium | PASS | — |
| AP2499_013 | Humania dealer: financing form above the insurance form | High | BLOCKED | Q-002 — no Humania dealer on Dev |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Once a quote has a financing, the GAP/creditors add modal folds the financing form into one summary line behind an "Edit" link | Medium | P2 | REQ-002, REQ-003 | [AP-2526](https://garantieavantageplus.atlassian.net/browse/AP-2526) | Open (Backlog) |
| BUG-002 | Saving the financing in the creditors-insurance modal of a quote that already has a financing draws the whole quote page inside the modal | Medium | P2 | REQ-004 | [AP-2527](https://garantieavantageplus.atlassian.net/browse/AP-2527) | Open (Backlog) |
| BUG-003 | "Get Quote" in the GAP/creditors add modal reloads the quote page and closes the modal, so the insurance result is never shown below the form | Medium | P2 | REQ-005 | [AP-2528](https://garantieavantageplus.atlassian.net/browse/AP-2528) | Open (Backlog) |
| BUG-004 | A financing saved with Date of birth left empty comes back with today's date in the Date of birth field of the financing form | Medium | P2 | REQ-003 (blocks REQ-005's failure case) | [AP-2566](https://garantieavantageplus.atlassian.net/browse/AP-2566) | Open (Backlog) — filed 2026-11-15 |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md` | 2026-11-01, re-run 2026-11-15 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2499_test-plan.md` | 2026-11-01, version 1.1 2026-11-15 |
| Test Cases | `qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md`, `AP2499_TestCases_006-010.md`, `AP2499_TestCases_011-013.md` | 2026-11-01 (005 and 009 re-designed 2026-11-15) |
| Review findings | `qa-artifacts/3-test-cases/AP2499_ReviewFindings_2026-11-01.md`, `AP2499_ReviewFindings_2026-11-15.md` | 2026-11-01, 2026-11-15 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-15.md` (carries forward `execution-log_AP-2499_2026-11-02.md`) | 2026-11-15 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2499_bug-report.md` | 2026-11-02, BUG-004 added 2026-11-15 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/` (37 files, of which 5 from 2026-11-15) | 2026-11-02, 2026-11-15 |
| Review record | `qa-artifacts/7-reviews/AP-2499_review.md` | 2026-11-01 – 2026-11-15 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2499_test-report.md` | 2026-11-15 |

---

## Risks and Observations

- **Tested on Dev only.** Every result is from Dev (v2dev). Staging was never opened, so the results say nothing about the staging build.
- **An empty date of birth becomes today's date (AP-2566).** The server returns today's date as the value of the Date of birth field on `/quote/{id}/financing`, on `/quote/{id}/insurance` and in both windows. Whether that date is also stored on the financing cannot be told from the screens; either way, a Get Quote would send it to the insurer as the borrower's date of birth.
- **The failure branch of REQ-005 is still untested.** Its trigger is now known (Q-007, answered by AP-2405: a creditors quote fails when the borrower has no date of birth), but AP-2566 puts a date in that field, so AP2499_009 is BLOCKED until AP-2566 is fixed. Nothing was sent to Chubb.
- **The Humania half of REQ-002 is untested (Q-002).** No dealer configured for Humania exists on Dev, so AP2499_013 was not run, and was not replaced by a Chubb dealer. This is missing test data, not a question for the ticket author.
- **Questions settled since the 2026-11-08 comment.** The comment of 2026-11-08 on AP-2499 asked Q-003 to Q-008 and Q-010 to Q-014. All of them are now settled without the author: Q-007 and Q-008 were answered by AP-2405, and the rest, with Q-001, Q-009 and Q-015, are Accepted as the current behaviour (12 in all). They need no reply. Only Q-002 (test data) stays open.
- **Same "fold behind Edit" pattern on three windows.** AP-2526 (this story), AP-2521 (extended warranty) and AP-2524 (roadside protection) all fold a form into a summary line behind "Edit"; they probably share one component and may be fixed together. All three are still in Backlog.
- **AP-2410 is related.** It reports an error on the same "Get Quote" of `/quote/{id}/insurance`; on Dev that submit succeeds, but the page reloads and the window closes (AP-2528).
- **Not filed:** the new-quote client form's consent box now reads "I confirm that I have provided a copy of FORM-L25 …", and its Save goes straight to the quote page instead of the vehicle step. Right after saving a financing inside the GAP window, the quote page behind it still says "You have not added financing details yet" until reloaded.
- **Test data left on Dev:** from 2026-11-15, quotes 6710 and 6711 on vehicle 915 (clients `client.stage.2499013@yopmail.com` and `client.stage.2499014@yopmail.com`), each with a financing saved without a date of birth; no insurance quote, no contract. From 2026-11-02, quotes 6533–6544 (clients `client.stage.2499001`–`2499012@yopmail.com`), with financings on 6535, 6536, 6538, 6539, 6540, 6541, 6543, Chubb creditors quotes on 6539 and 6541 and a GAP quote on 6540; no contract.

---

## Recommendations

1. Fix AP-2566 so a financing saved without a date of birth opens with an empty Date of birth everywhere, then re-run AP2499_005 and AP2499_009 — AP2499_009 is the only way to check the insurer-error branch of REQ-005.
2. Fix AP-2526 so the financing form opens expanded with its stored values whenever a financing exists, and check AP-2521 and AP-2524 at the same time, since they look like the same shared component.
3. Fix AP-2527 so that saving the financing in the creditors window re-draws the creditors insurance step, the same way the GAP window already does on a quote without financing.
4. Fix AP-2528 so "Get Quote" submits inside the window and shows the premium below the form, then re-run AP2499_003, 004, 006, 007 and 008 with "AP-2499 --from execute".
5. Name a dealer account configured for Humania on Dev (Q-002) so AP2499_013 can run.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-15 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |

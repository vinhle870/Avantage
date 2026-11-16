# Test Execution Report

**Report ID:** TR-20261108-001
**Project:** Avantage Plus (AP) — Dealer portal
**Test Cycle:** AP-2410 bug re-test — "[AP-2405] Dealer portal - Chubb Insurance Quote - page, although fill all required options but still receive an error message when submit" — run folder `no-sprint`
**Application version:** Not known — the Dev build exposes no version number; tested on Dev (v2dev) on 2026-11-08
**Environment:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca`, Dealer portal, Dealer 1380 account from the `env` source
**Date:** 2026-11-08
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ✅ PASS — Ready for Release

**Rationale:** All 4 test cases passed (100%, above the 90% threshold), and the reported error "Debtor is -1 years old. Age of Debtor is not within the plan limits." no longer appears when the reported inputs are replayed; the two bugs found on the way are Medium and do not block this fix.

---

## Executive Summary

AP-2410 reported that a dealer who filled every required option on the Chubb creditors insurance quote page and clicked "Get Quote" received an error instead of a saved quote. We re-tested it on the Dev environment with four test cases: saving a quote with rate table PM30 in English, saving one with PM50 in French, the stand-alone Insurance Quick Quote page, and a replay of the exact inputs from the failing screenshot of 2026-03-29, including coverage for a co-borrower and for both borrowers. All four passed: every quote saved with the message "Chubb insurance quote saved successfully", and no error appeared. Along the way we found two smaller problems, filed as separate Medium bugs: reopening a PM50 quote shows PM30 in the form, so saving it again would silently change the rate (AP-2557), and a co-applicant saved with only a name and birth date shows another client's email and phone (AP-2558). Neither stops the original fix from being released.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 1 (the bug's expected result "Submit successfully") |
| Total test cases | 4 |
| Passed | 4 (100%) |
| Failed | 0 (0%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (4 of 4)** |
| Pass rate threshold | 90% |
| Threshold met? | ✅ Yes |

The *pass rate* is the share of test cases that passed, counted over every case except skipped ones: 4 passed ÷ 4 counted = 100%.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 2 | 0 | 2 |
| Low | 0 | 0 | 0 |
| **Total** | **2** | **0** | **2** |

Defect density: 2 bugs ÷ 4 test cases = 0.5. Neither bug is a failed step: both are faults seen on the same pages while the steps under test passed, filed by the reviewer's Gate C decision.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

There is no test plan for this ticket (the bug re-test flow skips it), so the default exit criteria apply.

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (3 of 3: AP2410_001, 002, 004) | ✅ |
| Pass rate | ≥ 90% | 100% (4 of 4) | ✅ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 2 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| AP-2410 — Chubb Insurance Quote: with every required option filled, Get Quote submits successfully | 4 | 4 | 0 | 0 | 100% |
| **Total** | **4** | **4** | **0** | **0** | **100%** |

| TC ID | Title | Priority | Result | What it proved |
|---|---|:---:|:---:|---|
| AP2410_001 | Chubb insurance quote with every required option filled and PM30 saves without an error | High | ✅ PASS | Saved, CA$15.74 /m, PM30, English, no error banner |
| AP2410_002 | Chubb insurance quote in French with PM50 saves without an error | High | ✅ PASS | Saved, CA$21.78 /m, PM50, Français, no error banner |
| AP2410_003 | Insurance Quick Quote with PM30 shows priced results without an error (regression) | Medium | ✅ PASS | Two priced result tables, no error |
| AP2410_004 | Replaying the reported inputs no longer returns "Debtor is -1 years old" | High | ✅ PASS | With co-applicant Coapp Retest2410: Critical illness for the Co borrower and Disability for Both saved, CA$150.92 /m, no "years old", no HTTP error. Only change from the reported screenshot: Life "Residual Value Coverage" (not offered on Dev) → "Decreasing" |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Reopening the creditors insurance form of a quote saved with rate table PM50 shows Form "Monthly Premium PM30", so Get Quote would re-price it as PM30 | Medium | P2 | AP-2410 (same form) | [AP-2557](https://garantieavantageplus.atlassian.net/browse/AP-2557) | Open |
| BUG-002 | Saving a co-applicant with only name and date of birth shows another client's email and phone in the quote's Co-applicant block | Medium | P2 | AP-2410 (re-test pre-condition) | [AP-2558](https://garantieavantageplus.atlassian.net/browse/AP-2558) | Open |

Both are assigned to Minh Lưu. AP-2557 relates to AP-2410 and AP-2528; AP-2558 relates to AP-2410 and AP-2541. Neither is a *stopping bug* (one that blocks a test case or is High or Critical), so neither holds back AP-2410.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2410-ap-2405-dealer-portal-chubb-insurance-quote.md` | 2026-11-01 |
| Requirements Analysis | Not written — skipped by the bug re-test flow (the steps to reproduce are the requirement) | — |
| Test Plan | Not written — skipped by the bug re-test flow | — |
| Test Cases | `qa-artifacts/3-test-cases/AP2410_TestCases_001-004.md` | 2026-11-08 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md` | 2026-11-08 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2410_bug-report.md` | 2026-11-08 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/` (12 PNG files + 1 request/DOM record .txt) | 2026-11-08 |
| Review record | `qa-artifacts/7-reviews/AP-2410_review.md` (R2 and R3 rounds) | 2026-11-08 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2410_test-report.md` | 2026-11-08 |

---

## Risks and Observations

**Questions for the developer** (no source says what should happen, so they were not judged; they go in the AP-2410 comment):

- **O-2 — Tax exempt "Yes" still shows tax.** A quote saved with Tax exempt "Yes" still shows a 9 % tax on every coverage row (for example Life 16.60$ + 1.49$ tax), the same rate as a Tax exempt "No" quote. Should Tax exempt "Yes" remove the tax?
- **O-8 — The Borrower's Life premium changes when a co-applicant exists.** With the same Life input (Decreasing, Borrower, 12 months, PM30, Tax exempt Yes) the premium was 16.25$ without a co-applicant and 16.60$ with one. Is that the intended pricing?

**Observations** (recorded, not filed — no source states the intended behaviour, or the point is a test-wording matter):

- **O-3 — No Coverage table on the reopened insurance page.** The coverage table appears only in the Creditors insurance row's details on the quote page, not on the reopened insurance page or its Edit modal. The test cases were reworded to read it there.
- **O-4 — Changing the Form clears the Life type.** Choosing PM50 reset Life to "Select type"; it had to be chosen again.
- **O-5 — Hidden and limited coverage choices on the quote page (Dev).** Some Life and Disability options are in the list but hidden; "Residual Value Coverage" from the 2026-03-29 screenshot does not exist on Dev; the "For" lists offer only Borrower until the financing has a co-applicant.
- **O-6 — The Quick Quote result is in French** ("Primes par garantie", "Language: Français") although the interface is in English and the page has no Language field.
- **Q-001 (record only):** only rate tables PM30 and PM50 are offered — no RT table — on both the quote page and the Quick Quote.
- **Q-002 (record only):** without a co-applicant, Co borrower and Both coverage cannot be chosen; the borrower-only replay saved without error.

**Coverage limits:** Life "Residual Value Coverage" could not be replayed because Dev does not offer it, so that one input of the failing screenshot was replaced by "Decreasing". The re-test ran on Dev, not on staging where the bug was reported.

**Test data left on Dev:** quote 6696 (client Retest Chubb2410-001, `client.stage.2410001@yopmail.com`, on vehicle 915 — vehicle not edited) with its financing, the co-applicant Coapp Retest2410 and a saved Chubb creditor quote (PM30, English, Tax exempt Yes, CA$150.92 /m). No contract was generated.

---

## Recommendations

1. Close AP-2410 as fixed: the reported "Get Quote" error no longer occurs on Dev with the PM30, PM50 or replayed co-borrower inputs.
2. Fix AP-2557 (BUG-001) before dealers routinely re-edit saved insurance quotes: until then, a dealer who reopens a PM50 quote and clicks Get Quote re-prices it as PM30 without noticing.
3. Investigate AP-2558 (BUG-002) for where the co-applicant's email and phone come from, and raise its priority if production client data can appear on another customer's quote.
4. Answer O-2 (tax on a tax-exempt quote) and O-8 (Borrower premium with a co-applicant) on AP-2410 so the next test cycle can judge them.
5. Re-check on staging once this build is deployed there, since the original failure was reported on staging.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | PASS | _(automated)_ | 2026-11-08 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known | Pending | | |
| Product Owner | Not known | Pending | | |

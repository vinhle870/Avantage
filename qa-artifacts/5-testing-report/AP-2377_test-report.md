# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus (AP) — AP-2377 *Customer portal changes*
**Test Cycle:** Run folder 3.6.0 (the ticket's fix version) — execution of 2026-11-02
**Application version:** Not known — the customer portal shows no build number; tested on the Dev build deployed on 2026-11-02
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca, by the user's decision for this run (staging was not opened)
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill (inside stlc-ticket-pipeline, `AP-2377 --from s5`)

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 7 of 11 test cases passed (63.6%), below the 90% the project requires before a story moves to release; two Medium bugs are open (AP-2510, AP-2511) and the admin-side check of AC 6 could not be run at all.

---

## Executive Summary

QA tested the new online purchase pages of the customer portal (AP-2377) on the Dev website: the new "current warranty" fields on the vehicle page, the new order of the steps, the privacy-consent checkbox, the "Get rates now" button, and how extra-cost options (surcharges) appear on the summary page. Seven of the eleven checks passed: the new fields, the button labels in English and French, the new step order, the consent checkbox and the move to the coverage page all work as the ticket describes. Two problems were found and reported. First, if a customer types letters in the optional "Warranty mileage limit" field, the site shows a technical error page and the customer cannot continue (AP-2510, Medium). Second, the summary page lists the air-suspension option and charges it correctly, but does not show the customer's answer "OUI" as the ticket's design image does (AP-2511, Medium) — the author is asked whether the answer word is required. The last requirement — that the chosen options appear on the admin warranty page after payment — could not be tested because no test payment method exists, so it remains unproven. The story is not ready for release.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 6 (REQ-006 not testable — its only case is BLOCKED) |
| Total test cases | 11 |
| Passed | 7 (63.6%) |
| Failed | 3 (27.3%) |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **63.6% (7 of 11; no case skipped; BLOCKED counts as not passed)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

_Pass rate is the share of test cases that passed, out of every case except skipped ones._
Defect density: 2 bugs over 11 test cases = 0.18 per case.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 2 | 0 | 2 |
| Low | 0 | 0 | 0 |
| **Total** | **2** | **0** | **2** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed (or BLOCKED with a named reason) | 100% | 100% — 6 of 7 executed; AP2377_010 BLOCKED, reason: no test payment method | ✅ |
| Pass rate | ≥ 90% | 63.6% (7 of 11) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | 0 | 0 | ✅ |
| Every FAIL filed, linked or dismissed | Yes | Yes — 3 FAILs, 2 new bugs (AP-2510; AP-2511 covers two cases) | ✅ |
| Test report generated | Yes | Yes | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Current-warranty fields at the end of the vehicle form, "Continue" button | 3 (001, 002, 004) | 2 | 1 | 0 | 67% |
| REQ-002 — Client Info step before Coverage | 1 (003) | 1 | 0 | 0 | 100% |
| REQ-003 — FORM L25 checkbox and "Get rates now" button | 2 (005, 007) | 2 | 0 | 0 | 100% |
| REQ-004 — "Get rates now" opens Coverage | 1 (006) | 1 | 0 | 0 | 100% |
| REQ-005 — Summary lists the surcharges answered YES | 3 (008, 009, 011) | 1 | 2 | 0 | 33% |
| REQ-006 — Admin warranty details page shows the surcharges after payment | 1 (010) | 0 | 0 | 1 | 0% |
| **Total** | **11** | **7** | **3** | **1** | **63.6%** |

AP2377_002 also checks the French label of the REQ-003 button ("Demander un devis"); it is counted once, under REQ-001.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | Letters in the optional "Warranty mileage limit" field give an HTTP 500 error page on Continue (AP2377_004) | Medium | P2 | REQ-001 | [AP-2510](https://garantieavantageplus.atlassian.net/browse/AP-2510) | Open |
| BUG-002 | The summary shows the air-suspension surcharge question with "(MSRP: 1500.00)" but without the answer "OUI" (AP2377_008, AP2377_011) | Medium | P3 | REQ-005 | [AP-2511](https://garantieavantageplus.atlassian.net/browse/AP-2511) | Open |

Both bugs: Tested on: Dev (v2dev); status Backlog, assigned to Ken Nguyen, linked to AP-2377 as *Relates*, screenshots embedded in the description.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2377-customer-portal-changes.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2377_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2377_TestCases_001-005.md`, `AP2377_TestCases_006-010.md`, `AP2377_TestCases_011-011.md` | 2026-11-01 (results filled 2026-11-02) |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2377_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2377_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/` (13 files) | 2026-11-02 |
| Review record (R1–R3) | `qa-artifacts/7-reviews/AP-2377_review.md` | 2026-11-01 – 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2377_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev, not staging.** The test cases name the staging site; every route exists on Dev under the same path, and Dev asks for two extra required fields on the vehicle step (Email, Postal code) that the ticket's mock-up does not show. Results should be confirmed on staging before release.
- **REQ-006 is unproven.** AP2377_010 is BLOCKED: no test payment method for the customer portal is known, and the QA agent never enters card details. Whether the chosen surcharges appear on the admin warranty details page after payment has not been checked.
- **Six questions to the author are still open** (all Judgement — they did not decide any result). What Dev did is recorded: Q-001 the three warranty fields are optional, a past end date is accepted; Q-002 French labels recorded, the help text has the typo "prolongeée"; Q-003 after the term choice a second coverage page asks the surcharge questions, then the summary opens; Q-004 the FORM-L25 box is required ("You must confirm to have read the FORM-L25"); Q-005 "FORM-L25" links to a PDF (`/en/pdf-privacy`, `/fr/pdf-privacy`); Q-007 a No answer hides the question but leaves an empty "Surcharge" heading.
- **Observations outside the ticket, not filed:** the header logo image returns HTTP 500 on every page of the flow; dates on the French summary are written in English; opening `?_locale=fr` directly does not switch the language (the "Français" link does).
- **Test data left on Dev:** purchase sessions for `client.stage.932`–`940@yopmail.com`; sessions 935–938 reached the summary page. Nothing was paid. Whether the portal stored client or quote records was not checked.

---

## Recommendations

1. Fix AP-2510 before release: validate "Warranty mileage limit" (for example, whole numbers only) and show a message under the field instead of the error page; ask the author to state the rule (Q-001).
2. Get the author's answer on AP-2511: if the summary must show "OUI" / "YES" as in image A3, fix the summary line; if "(MSRP: 1500.00)" is intended, say so on AP-2511 and QA will correct AP2377_008 and AP2377_011 to it.
3. Provide a test payment method (or a paid Dev warranty with the air-suspension surcharge) so AP2377_010 can check the admin warranty details page (REQ-006).
4. Answer the six open Judgement questions on AP-2377 (Q-001–Q-005, Q-007), in particular whether an empty "Surcharge" heading after a No answer is wanted.
5. Re-test with `AP-2377 --from s4` once AP-2510 and AP-2511 are fixed, on staging if available.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named on AP-2377 | Pending | | |
| Product Owner | Ken Nguyen (reporter of AP-2377) | Pending | | |

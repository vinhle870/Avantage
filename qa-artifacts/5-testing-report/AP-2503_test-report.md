# Test Execution Report

**Report ID:** TR-20261102-003
**Project:** Avantage Plus v2 — Dealer portal, AP-2503: Generate contract for a quote's extended warranty
**Test Cycle:** AP-2503 single-ticket STLC run, run folder no-sprint
**Application version:** Not known — the Dev build shows only "Avantage Plus System v2.0.0" in its footer; the ticket's pull request was merged on 2026-10-30
**Tested on:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"), by the user's decision. **Staging was not checked**; the test-case files still name v2staging as their environment.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 7 of 10 test cases passed (70%, against a 90% pass-rate threshold — the share of test cases that must pass). Three acceptance criteria are not met: the Program Summary does not show the delivery date (AP-2530), the VIN and delivery date can be edited (AP-2531), and a quote without financing cannot become a contract unless the dealer enters a financing company (AP-2532, High).

---

## Executive Summary

We tested the new page a dealer uses to turn a quote's extended warranty into a contract. Most of it works: "Generate Contract" now opens its own full page at the same address as before instead of a pop-up; the page shows the owner and financing details on the left and the program summary, a preview of the contract document and the "Generate Contract" button on the right; it is filled in from the quote; and submitting it creates the contract and its invoice, with the start date the dealer chose. Three things do not match the ticket. The program summary leaves out the vehicle delivery date (it is shown only in the vehicle section). The VIN and the delivery date can be typed over, although the ticket says they are locked. And for a customer who pays without financing, the page will not create the contract until the dealer fills in a financing company the customer does not have; the ticket does not say whether that is intended, so the bug asks the product owner. All testing was done on Dev, not Staging. The story stays in QC.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 5 of 5 judged (every requirement has at least one case that ran to a PASS or FAIL) |
| Total test cases | 10 |
| Passed | 7 (70%) |
| Failed | 3 (30%) |
| Blocked | 0 (0%) |
| Skipped | 0 |
| **Pass rate** | **70% (7 of 10)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 1 | 0 | 1 |
| Medium | 2 | 0 | 2 |
| Low | 0 | 0 | 0 |
| **Total** | **3** | **0** | **3** |

Defect density: 3 bugs over 10 test cases = 0.3 per test case.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| Every test case has a status other than Not Run | 10 of 10 | 10 of 10 (7 PASS, 3 FAIL) | ✅ |
| Every FAIL filed, linked or dismissed at Gate C | Yes | Yes — 3 FAILs → new bugs AP-2530, AP-2531, AP-2532 | ✅ |
| Pass rate | ≥ 90% of non-skipped cases | 70% (7 of 10) | ❌ |
| No open Critical or High bug | 0 | 1 High open (AP-2532) | ❌ |
| No Blocking question open | 0 | 0 Blocking (10 Judgement and 1 Info questions open, none stops a result) | ✅ |
| Test report generated and result comment posted on AP-2503 | Yes | Report yes; comment posted at s7 | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken. Coverage here is the share of the requirement's cases that ran to a PASS or FAIL. A case that covers two requirements is counted under each._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged route | 1 | 1 | 0 | 0 | 100% |
| REQ-002 — Two-column layout with PDF preview | 1 | 1 | 0 | 0 | 100% |
| REQ-003 — Program Summary content | 3 | 1 | 2 | 0 | 100% |
| REQ-004 — Pre-fill and read-only / editable fields | 4 | 3 | 1 | 0 | 100% |
| REQ-005 — Submit creates the contract | 4 | 3 | 1 | 0 | 100% |
| **Total (distinct cases)** | **10** | **7** | **3** | **0** | **100%** |

| TC ID | Title | Priority | Status | Bug / blocker |
|---|---|:---:|:---:|---|
| AP2503_001 | Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up | High | PASS | — |
| AP2503_002 | The generate-contract page shows owner and financing details on the left, and summary, PDF preview and button on the right | Medium | PASS | — |
| AP2503_003 | The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price | High | FAIL | AP-2530 |
| AP2503_004 | The generate-contract page is pre-filled with the quote's client, vehicle and financing values | High | PASS | — |
| AP2503_005 | On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can | High | FAIL | AP-2531 |
| AP2503_006 | Submitting the generate-contract page with its pre-filled values creates the extended-warranty contract | High | PASS | — |
| AP2503_007 | A warranty start date changed on the page before submitting is the start date of the created contract | High | FAIL | AP-2532 |
| AP2503_008 | Submitting with the owner's last name emptied does not crash the page or lose the other values | Medium | PASS | — |
| AP2503_009 | Submitting with a warranty start date before the delivery date does not crash the page | Medium | PASS | — |
| AP2503_010 | The generate-contract page opens for a quote with no financing and still pre-fills owner and vehicle details | Medium | PASS | — |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The "Program Summary" on the extended-warranty Generate Contract page does not show the vehicle delivery date | Medium | P2 | REQ-003 | [AP-2530](https://garantieavantageplus.atlassian.net/browse/AP-2530) | Open |
| BUG-002 | The VIN and the delivery date can be edited on the extended-warranty Generate Contract page although they should be read-only | Medium | P2 | REQ-004 | [AP-2531](https://garantieavantageplus.atlassian.net/browse/AP-2531) | Open |
| BUG-003 | A quote without financing cannot become an extended-warranty contract unless the dealer enters a financing company | High | P2 | REQ-005 | [AP-2532](https://garantieavantageplus.atlassian.net/browse/AP-2532) | Open |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2503-generate-contract-for-a-quotes-extended.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2503_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2503_TestCases_001-005.md`, `AP2503_TestCases_006-010.md` | 2026-11-01 (results 2026-11-02) |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2503_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2503_bug-report.md` | 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/` (18 files) | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2503_review.md` | 2026-11-01 – 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2503_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev only.** Every result comes from Dev (v2dev), by the user's decision. Staging was not checked, so the results say nothing about the staging build.
- **Sales without financing are stuck (AP-2532).** On a quote with no financing the six financing-company fields are required and empty, and the browser refuses the form ("Please fill out this field."). The fields are marked with "*", so the page is not silent, but the only way through is to pick a company the customer does not have. Whether the old pop-up required this is not known (Q-007) and the ticket does not define "valid form values" (Q-006); the bug asks the product owner which behaviour is intended. Once a company is picked, the empty financing-company phone no longer stops the submit (quotes 6558, 6559, 6561). For context, the Esthetic protection contract form on Dev creates contracts with the financing company left at "Choose" (AP-2428 cases 009, 012, 015).
- **Two contracts carry a financing company their quotes do not have.** To finish AP2503_007 and AP2503_009 after the fault above, the QA picked AutoCapital Canada on quotes 6559 and 6561, which have no financing. Contracts **APOP01-846** and **APOP01-847** on Dev therefore show that company. They cannot be deleted.
- **Not tested:** what a contract holds if a changed VIN or delivery date is submitted (AP-2531) — submitting would have created a permanent contract with a made-up VIN.
- **Recorded, not judged (Judgement questions to the author):** the vehicle details sit first in the left column as "Vehicle identification" (Q-001); the preview is the extended-warranty contract draft with an "Open PDF in new tab" link (Q-002); Year, Make, Model and Mileage are editable too (Q-003); the start date defaults to the delivery date and an earlier date is accepted (Q-004); the sale price is the warranty price without tax and is editable (Q-005); an emptied last name is refused by the browser's own check with no message on the page (Q-006); after submit the dealer lands on the quote page with "Invoice #N ($456.00) is created", the invoice is the warranty cost, not the sale price, and the contract PDF is offered from the quote row (Q-007); a phone edited on the page goes onto the contract only, not the quote's client (Q-009).
- **Other observations:** every generate-contract page shows a red banner "The delivery date has passed the acceptable timeframe…" even with today's delivery date, and it does not stop a submit; the End date does not recalculate on screen when the start date changes; the quote's warranty row says "Start date: Nov 1, 2026" while the page defaults to Nov 2.
- **Test data left on Dev:** vehicles 1125–1129; quotes 6557–6561 (6557 and 6560 without a contract); a financing on quote 6558 (AutoCapital Canada, 25,000, 60 months); contracts **APOP01-845** (quote 6558), **APOP01-846** (6559) and **APOP01-847** (6561) with invoices #942, #943 and #944 ($456.00 each, payment pending). The contracts and invoices cannot be deleted.

---

## Recommendations

1. Add the vehicle delivery date to the Program Summary (AP-2530) and make the VIN and delivery date read-only on the page (AP-2531), then re-run AP2503_003 and AP2503_005 with "AP-2503 --from s4".
2. The product owner answers AP-2532: is a financing company required for every extended-warranty contract? If not, let the contract be created with the financing fields empty; if yes, state it in AP-2503 and say so on the page. Then re-run AP2503_007 on a quote without financing.
3. The ticket author answers the Judgement questions Q-001–Q-010 in the s7 comment, especially Q-003 (which vehicle fields must be read-only) and Q-006 (what "valid form values" are).
4. Check the page on Staging before release, since this run covered Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Not known — no development lead is named in the registry | Pending | | |
| Product Owner | Nicolas-Eric Tain (ticket reporter) | Pending | | |

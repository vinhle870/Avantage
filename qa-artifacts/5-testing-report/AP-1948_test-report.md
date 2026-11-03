# Test Execution Report

**Report ID:** TR-20261101-001
**Project:** Avantage Plus v2 — Client portal and Admin portal (Jira project AP)
**Test Cycle:** Story test of AP-1948 "CBI / CVE Tesla Price modification" — which warranty terms the Client portal quote request offers for a vehicle, and the price it shows for them (run folder `1.39.0`)
**Application version:** Not known — Dev (v2dev) shows no build number; the ticket's target fix version is 1.39.0
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ (the user's decision for this batch, instead of staging)
**Date:** 2026-11-01
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** Only 3 of 9 test cases passed (33%, against the 90% needed), because 6 cases could not be run: 5 wait on two unanswered questions to the ticket author (Q-001, Q-002) and 1 stops at a payment page the test data cannot get past. No defect was found — nothing tested behaved wrongly — but two of the ticket's three requirements have not been judged at all.

---

## Executive Summary

This ticket asks that, on the customer's quote request, only the warranty terms that fit the
vehicle's category are offered, and that the price shown for a term is the "suggested retail
price" the business set for it in admin. Nine checks were planned and run on the Dev system.
The price part works: in all three checks that could be run, the customer saw exactly the price
set in admin (for example CA$1,025.00 for the 36-month term), the price followed the term the
customer picked, and when admin raised the price by 100 the customer saw the new price on the
next page. Nothing was found broken. The release cannot be recommended yet, though: whether the
right terms are offered for each vehicle category, and whether the special Tesla prices from
the original request still apply, cannot be checked until the ticket's author answers two
questions that have been waiting on the ticket since comment 19432. One further check stops at
the Stripe payment page because there are no test card details to pay with.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 1 of 3 (REQ-002 tested; REQ-001 and REQ-003 blocked by open questions) |
| Total test cases | 9 |
| Passed | 3 (33%) |
| Failed | 0 (0%) |
| Blocked | 6 |
| Skipped | 0 |
| **Pass rate** | **33% (3 of 9)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, over all cases except skipped ones. A
blocked case — one that could not be run — counts as not passed.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 0 | 0 | 0 |
| Low | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** |

Defect density: 0 defects ÷ 9 test cases = 0.

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% (or recorded BLOCKED with their question) | 100% — AP1948_001 and 009 PASS; AP1948_004 and 005 BLOCKED by Q-001 | ✅ |
| Pass rate | ≥ 90% | 33% (3 of 9) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets listed in the bug report | Yes | Yes — none were filed | ✅ |
| No Blocking question open (release rule) | 0 | 2 — Q-001, Q-002 | ❌ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Program terms filtered by vehicle model Category | 3 (004, 005, 006) | 0 | 0 | 3 | 0% |
| REQ-002 — Term price equals the program term's suggested retail price | 4 (001, 002, 003, 009) | 3 | 0 | 1 | 75% |
| REQ-003 — Tesla pricing figures from the "Original ask" | 2 (007, 008) | 0 | 0 | 2 | 0% |
| **Total** | **9** | **3** | **0** | **6** | **33%** |

**Per test case:**

| TC ID | Title | Priority | Status | Reason / evidence |
|---|---|:---:|:---:|---|
| AP1948_001 | Customer selects a warranty term → price shown equals that term's suggested retail price in admin | High | PASS | 2022 Tesla Model 3 Long Range, term "AT 36m/60000km": Summary Subtotal CA$1,025.00 = admin 1025 |
| AP1948_002 | Customer switches to another warranty term → price shown changes to the new term's suggested retail price | Medium | PASS | 2023 Tesla Model Y: CA$1,025.00 → CA$2,700.00 after switching to "CVE 12m/0km" (admin 2700) |
| AP1948_003 | Customer submits the quote request → no error, and any term or price shown back matches the one selected | Medium | BLOCKED | Steps 1–2 PASS; "Continue with payment" opens a Stripe sandbox checkout — no payment test data |
| AP1948_004 | Tesla vehicle on the customer portal → only program terms of that model's category are offered | High | BLOCKED | Q-001 unanswered |
| AP1948_005 | A program term set for a different vehicle category → it is not offered for this vehicle | High | BLOCKED | Q-001 unanswered |
| AP1948_006 | Vehicle whose category has no program term → page shows no wrong-category term and no error | Low | BLOCKED | Q-001 unanswered |
| AP1948_007 | Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ | Medium | BLOCKED | Q-002 unanswered |
| AP1948_008 | Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ | Medium | BLOCKED | Q-002 unanswered |
| AP1948_009 | Admin changes a term's suggested retail price → customer portal shows the new price for that term | High | PASS | Term 16 raised 1025 → 1125: Summary showed CA$1,125.00; restored to 1025 and confirmed |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-1948-cbi-cve-tesla-price-modification.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-1948_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md` | 2026-11-01 |
| Test-case review findings | `qa-artifacts/3-test-cases/AP1948_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` (re-run of 001, 003, 009 under *Re-run after review R3*) | 2026-11-01 |
| Bug Report | `qa-artifacts/5-testing-report/AP-1948_bug-report.md` | 2026-11-01 |
| Review record | `qa-artifacts/7-reviews/AP-1948_review.md` (R1, R2, R3 rounds 1–2) | 2026-11-01 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/` (13 files) | 2026-11-01 |
| **This Report** | `qa-artifacts/5-testing-report/AP-1948_test-report.md` | 2026-11-01 |

---

## Risks and Observations

- **Two of three requirements are untested.** Q-001 (which vehicle models are in Category A, B and C, and where a model's category is set) and Q-002 (whether the "Original ask" Tesla figures 2500$–2900$ plus 200$ / 800$ still apply, and to which terms) were posted on AP-1948 in comment 19432 and are still unanswered. Until they are, nobody can say whether a customer is offered the wrong terms or charged the wrong Tesla price.
- **Observation for Q-001 (not judged):** term 16 "L'Avantageuse AT 36m/60000km" is offered for a 2022 Tesla Model 3 (an electric car) although admin lists its fuel types as GASOLINE and DIESEL only; its categories are A, B and C. This may be intended — it cannot be judged without the answer.
- **AP1948_003 cannot pass as written.** "Continue with payment" leads to a Stripe sandbox checkout for the Total including taxes (CA$1,178.49 for the AT 36-month term). Either Stripe test-card data must be added to the test data or the case must end at the Summary page.
- **Q-005, price format (recorded, not judged):** the customer sees "CA$1,025.00" (CA$ prefix, comma thousands separator, two decimals), labelled "Subtotal", before GST and PST; admin stores the plain number 1025.
- **Q-006, when the price appears (recorded, not judged):** the term cards on "Select Coverage" show no price. The price first appears on the Summary page, after the Client Info step, and changes only with a page load. Each term's radio button carries a hidden `price` value (625.00 for term 16, 2500.00 for term 122) that differs from the suggested retail price and is never shown to the customer.
- **The test cases still describe Staging, a typed "2023 Model 3" and a price at term selection.** This run used Dev and the vehicle list entry "2022 TESLA Model 3 / Long Range" (the year is not a test condition — review R3 F-1). The wording should be fixed on the next design re-run (review R3 F-3).
- **AP1948_009 changed a shared admin price.** Term 16's suggested retail price was set to 1125 for about one minute and restored to 1025; the independent reviewer re-checked it live at 15:50Z. The restore screenshot is a copy of an earlier image (review R3 round 2 F-1), so the live re-check is the proof.
- **Data left behind on Dev (v2dev):** quote requests for customer 1493 with emails client.stage.916@yopmail.com (2023 Tesla Model Y), client.stage.917@yopmail.com (2022 Tesla Model 3, stopped at Summary) and client.stage.918@yopmail.com (2022 Tesla Model 3 — "Continue with payment" pressed, an unpaid Stripe sandbox checkout for CA$1,178.49 was created). Whether these left pending quotes on the customer is not known, because no cleanup procedure is recorded for this project.

---

## Recommendations

1. Ask the ticket author (Eric Lindquist) to answer Q-001 and Q-002 in comment 19432's thread on AP-1948, then re-run the pipeline with "AP-1948 --from s1" so AP1948_004–008 can be designed against the answer and executed.
2. Add Stripe sandbox test-card data to the `test-data` source, or revise AP1948_003 so that "submit" ends at the Summary page, then re-run AP1948_003.
3. Reword the test cases on the next design re-run: the vehicle is picked from a list (any listed Tesla Model 3), and the price is read from the Summary page's "Subtotal" (review R3 F-3).
4. Delete or ignore the three test quote requests for customer 1493 listed above (client.stage.916/917/918@yopmail.com), in particular the unpaid Stripe checkout for client.stage.918.
5. Keep AP-1948 out of "Ready for release" until the two Blocking questions are answered and the blocked cases pass; the price-from-admin behaviour (REQ-002) can be relied on as tested.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-01 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Ken Nguyen | Pending | | |
| Product Owner | Eric Lindquist | Pending | | |

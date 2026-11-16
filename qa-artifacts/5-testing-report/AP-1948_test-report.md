# Test Execution Report

**Report ID:** TR-20261115-002 (replaces TR-20261115-001, which was written before Run 2)
**Project:** Avantage Plus v2 — Client portal and Admin portal (Jira project AP)
**Test Cycle:** Story re-test of AP-1948 "CBI / CVE Tesla Price modification" — which warranty terms the Client portal quote request offers for a vehicle, and the price it shows for them (run folder `1.39.0`)
**Application version:** Not known — Dev (v2dev) shows no build number; the ticket's target fix version is 1.39.0
**Environment:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ (the registry's `execution_env`)
**Date:** 2026-11-15 (morning run 08:46Z–08:54Z; Run 2 09:54Z–09:59Z for AP1948_007 and AP1948_008)
**Prepared by:** QA Agent — Test Reporter Skill

---

## Verdict

> # ⚠️ CONDITIONAL PASS — Ship with conditions

**Rationale:** 8 of 9 test cases passed (89%), one point under the 90% the registry's `story_pass_threshold` requires, with no defect and no open Blocking question; the only gap is AP1948_003, which stops at the Stripe payment page because there is no test card, so the amount actually charged has not been checked. The condition: run AP1948_003 with a Stripe test card before AP-1948 moves to "Ready for release".

How the verdict was reached: the test plan's exit criteria set the pass threshold at 90% and allow 0 open High bugs; that threshold is not met, so the verdict cannot be PASS. The reporter skill's scale gives CONDITIONAL PASS at a pass rate of at least 80% with no Critical bug and at most 2 High bugs — here 89%, 0 Critical, 0 High.

---

## Executive Summary

This ticket asks that the customer's quote request offers only the warranty terms that fit the
vehicle's category, and that the price shown for a term is the "suggested retail price" set for it
in admin. Nine checks were run on the Dev system and eight passed. The customer saw exactly the
admin price for every term tried, the price followed the term picked, and when admin raised a price
by 100 the customer saw the new price on the next page. Each Tesla model was offered only the terms
of its own category. For all four Tesla models (Model 3, Model Y, Model S, Model X), every offered
term — 24 model-and-term pairs — showed exactly its admin price with nothing added, which is the
accepted expected result for the Tesla pricing question (Q-002). Every admin change made for these
checks was put back and confirmed.

The one check left open is the last step of the quote request: payment opens a Stripe test page
that needs a test card, and none is available. Until that check runs, nobody has confirmed that the
amount charged at payment equals the price shown, so the ticket stays where it is.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 3 of 3 (REQ-001, REQ-002 and REQ-003 tested; REQ-002's submit check blocked) |
| Total test cases | 9 |
| Passed | 8 (89%) |
| Failed | 0 (0%) |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **89% (8 of 9)** |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, over all cases except skipped ones. A
blocked case — one that could not be finished — counts as not passed: 8 ÷ (9 − 0 skipped) = 88.9%,
shown as 89%.

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
| All High-priority TCs executed | 100% (or recorded BLOCKED with a reason) | 100% — AP1948_001, 004, 005, 009 PASS | ✅ |
| Pass rate | ≥ 90% | 89% (8 of 9) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Every shared value changed is confirmed restored | Yes | Yes — term 16 back to 1025; Model 3 back to Category A (confirmed in-case; Run 2 changed nothing) | ✅ |
| Test report generated | Yes | Yes | ✅ |
| All tracker tickets listed in the bug report | Yes | Yes — none were filed | ✅ |
| No Blocking question open (release rule) | 0 | 0 — Q-001 Answered (comment 19545), Q-002 Accepted | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Program terms filtered by vehicle model Category | 3 (004, 005, 006) | 3 | 0 | 0 | 100% |
| REQ-002 — Term price equals the program term's suggested retail price | 4 (001, 002, 003, 009) | 3 | 0 | 1 | 75% |
| REQ-003 — Tesla term price (Q-002 Accepted: suggested retail price, nothing added) | 2 (007, 008) | 2 | 0 | 0 | 100% |
| **Total** | **9** | **8** | **0** | **1** | **89%** |

**Per test case:**

| TC ID | Title | Priority | Status | Reason / evidence |
|---|---|:---:|:---:|---|
| AP1948_001 | Customer selects a warranty term → price shown equals that term's suggested retail price in admin | High | PASS | 2022 Tesla Model 3 Long Range, term 16 "AT 36m/60000km": Summary Subtotal CA$1,025.00 = admin 1025 |
| AP1948_002 | Customer switches to another warranty term → price shown changes to the new term's suggested retail price | Medium | PASS | 2023 Tesla Model Y: CA$1,025.00 (term 16) → CA$2,700.00 after switching to term 122 "CVE 12m/0km" (admin 2700) |
| AP1948_003 | Customer submits the quote request → no error, and any term or price shown back matches the one selected | Medium | BLOCKED | Steps 1–2 PASS; "Continue with payment" opens a Stripe sandbox card page — no Stripe test card in `test-data` or `env` |
| AP1948_004 | Tesla Model 3 on the customer portal → every term offered includes the model's configured category | High | PASS | Model 3 (#3124) is Category A; all 6 offered terms (16, 122–126) tick Category A |
| AP1948_005 | A term whose categories exclude the Tesla Model 3's category → it is not offered for that vehicle | High | PASS | Path B: Model 3 set to Category D → term 16 (A, B, C) no longer offered; restored to A, term 16 offered again |
| AP1948_006 | Tesla Model 3 moved to a category no offered term covers → no wrong-category term and no error | Low | PASS | Category E: empty list, no error page or 5xx; restored to A |
| AP1948_007 | Tesla Model 3 or Model Y → every offered term's price equals its suggested retail price, nothing added | Medium | PASS | Run 2: terms 16, 122–126 for both models — 12 of 12 Subtotals = admin price (1025, 2700, 2500, 2700, 2900, 3200); all tick Category A |
| AP1948_008 | Tesla Model S or Model X → every offered term's price equals its suggested retail price, nothing added | Medium | PASS | Run 2: terms 16, 129–133 for Model S (entry 91) and Model X (entry 94 → model #4725) — 12 of 12 Subtotals = admin price (1025, 3400, 3400, 3500, 3600, 3700); all tick Category B |
| AP1948_009 | Admin changes a term's suggested retail price → customer portal shows the new price for that term | High | PASS | Term 16 raised 1025 → 1125: Summary showed CA$1,125.00; restored to 1025 and confirmed |

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| — | No defects found in this run | — | — | — | — | — |

Gate C was skipped — no FAIL in the execution log, so there was no bug to file or link (decided by
the independent reviewer, R3 round 2, 2026-11-15T10:05:27Z).

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-1948-cbi-cve-tesla-price-modification.md` (changes appended 2026-11-15) | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md` | 2026-11-15 |
| Test Plan | `qa-artifacts/2-test-plan/AP-1948_test-plan.md` (version 2.1) | 2026-11-15 |
| Test Cases | `qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md` | 2026-11-15 |
| Test-case review findings | `qa-artifacts/3-test-cases/AP1948_ReviewFindings_2026-11-15.md` (with the 09:22 UTC re-review) | 2026-11-15 |
| Execution Log | `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` (morning section and "Run 2") | 2026-11-15 |
| Bug Report | `qa-artifacts/5-testing-report/AP-1948_bug-report.md` (BR-20261115-002) | 2026-11-15 |
| Review record | `qa-artifacts/7-reviews/AP-1948_review.md` (R1–R3 for 2026-11-15) | 2026-11-15 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/` (morning: 23 screenshots and 4 values files; Run 2: 31 screenshots and 2 values files — all listed in the execution log) | 2026-11-15 |
| **This Report** | `qa-artifacts/5-testing-report/AP-1948_test-report.md` | 2026-11-15 |

---

## Risks and Observations

- **The amount charged at payment is unverified (residual risk, review R3 round 2 F-3).** On "Select Coverage" each hidden term radio carries a `price` attribute that is not the suggested retail price — term 16 = 625.00, term 129 = 0.00 (also 122 = 2500.00, 125 = 2800.00, 130 = 3400.00). The customer never sees it, and the price shown (the Summary Subtotal) was correct for all 24 Tesla pairs. But AP1948_003 is blocked at the Stripe page, so nobody has checked which amount reaches payment. If the payment step ever read this attribute instead of the Summary Total, a customer could be charged the wrong amount — for a CVE B term, nothing. The one Stripe page reached (term 16, morning run) showed CA$1,178.49, equal to the Summary Total. No bug is filed: no customer-visible or saved value is wrong.
- **One check is blocked by missing test data.** AP1948_003 stops at the Stripe sandbox checkout because neither the `test-data` nor the `env` source holds a Stripe test card. This alone keeps the pass rate at 89%, under the 90% threshold.
- **CVE terms still offered (fact F-1).** Comment 19544 says the CVE program was disabled, yet on 2026-11-15 Dev still offers "CVE A" terms 122–126 to the Category A Model 3 and Model Y, and "CVE B" terms 129–133 to the Category B Model S and Model X. This is not a failure — nothing was re-enabled, and each set is offered only to its own category — but the reporter may want to know the program is still live on Dev.
- **Fuel type does not filter the list (Q-010 Accepted).** Term 16 "L'Avantageuse AT 36m/60000km" allows only GASOLINE and DIESEL, yet it is offered for electric Teslas. Only the vehicle model's category filters the Client portal list; no Story or Task says fuel type must, so this is the expected behaviour.
- **Accepted results that the author could still overrule.** Q-002 (Tesla price = suggested retail price, nothing added), Q-004 (empty list, Continue answers "This value is not valid."), Q-005 ("CA$1,025.00" Subtotal before GST and PST), Q-006 (the page reloads when the term changes) and Q-010 were accepted from the current behaviour because no Story or Task defines them. If the author later says otherwise, the affected cases are re-run from analysis.
- **Open questions (Info only, no result depends on them).** Q-007 (what the ticket's attached screenshot shows) and Q-008 (whether Ken Nguyen's 2024-04-03 comment, which ends mid-sentence, meant to say more).
- **The negative category check could be sharper (design note).** In AP1948_005 and AP1948_006 the categories the Model 3 was moved to (D and E) empty the list completely, so the result also fits "no term shown at all". AP1948_004, 007 and 008 cover the positive side (Category A and Category B), so the result stands; the next design pass should look for a category under which at least one other term stays listed (review R3 round 1 F-3).
- **Shared configuration was changed and restored.** In the morning run, term 16's suggested retail price (1025 → 1125 → 1025) and the Tesla Model 3's category (A → D → A, A → E → A) were changed for about a minute each and restored in the same case; the independent reviewer re-read both on Dev at about 09:02Z. Run 2 only read admin pages.
- **Data left behind on Dev (v2dev):** Client portal quote-request sessions for customer 1493 with client.stage.1948101 to 1948108@yopmail.com — 1948101–1948104 in the morning (VINs 5YJ3E1EB0NF000001/2/3, 7SAYGDEE0PF000001), 1948105–1948108 in Run 2 (VINs 5YJ3E1EB0NF000007, 7SAYGDEE0PF000007, 5YJSA1E20NF000008, 7SAXCDE50NF000008). Only client.stage.1948103 opened a Stripe sandbox checkout, unpaid, for CA$1,178.49; the others stopped at the Summary page. Whether the portal saves anything server-side before payment is not known (no cleanup procedure is recorded). No configuration is left changed on Dev.

---

## Recommendations

1. Obtain a Stripe sandbox test card and add it to the `test-data` source, then re-run AP1948_003 (say "AP-1948 --from execute"). On that run, also confirm that the amount charged equals the Summary Total for a "CVE B" term such as 129, whose hidden `price` attribute is 0.00 — this closes the payment-amount risk above. A pass would bring AP-1948 to 9 of 9.
2. Tell the reporter (Eric Lindquist, comment 19544) that CVE terms 122–126 and 129–133 are still offered on Dev, in case the program should be switched off there.
3. On the next design pass, pick a category for AP1948_005 under which at least one other term stays listed (review R3 round 1 F-3).
4. Keep AP-1948 in QC until AP1948_003 passes; the category filter (REQ-001), the admin-driven price (REQ-002) and the Tesla term prices (REQ-003) can be relied on as tested.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | CONDITIONAL PASS | _(automated)_ | 2026-11-15 |
| QA Lead | Vinh Le | Pending | | |
| Development Lead | Ken Nguyen | Pending | | |
| Product Owner | Eric Lindquist | Pending | | |

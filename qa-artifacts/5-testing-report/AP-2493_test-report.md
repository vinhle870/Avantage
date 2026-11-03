# Test Execution Report

**Report ID:** TR-20261102-001
**Project:** Avantage Plus v2 — Dealer portal, AP-2493: Cancelling a product from a quote
**Test Cycle:** AP-2493 single-ticket STLC run, run folder no-sprint (the ticket has no sprint and no fix version)
**Application version:** Not known — the Dev build does not show a version number. The AP-2493 pull request (merged 2026-10-26) was confirmed present on Dev before testing: the "Delete" action pointing to `/quote/{id}/cancel-product/{type}` exists on quote rows.
**Date:** 2026-11-02
**Prepared by:** QA Agent — Test Reporter Skill

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca`, by the user's decision. Staging was not opened in this run.

---

## Verdict

> # ❌ FAIL — Not Ready for Release

**Rationale:** 12 of 14 test cases passed, a pass rate of 86 %, which is under the 90 % pass-rate threshold the test plan sets for this story; the one bug found (AP-2516, Medium — the quote Subtotal never includes the Esthetic protection (Permaplate) cost) is still open.

---

## Executive Summary

The QA agent tested the new ability for a dealer to cancel (delete) an optional product from a quote on the quote details page, using 14 test cases that cover all three acceptance criteria and all five products in scope: extended warranty, Roadside Protection, GAP insurance, creditor insurance and Esthetic protection (Permaplate). The cancel feature itself works for every product: the "Delete" action appears only on products without a contract, a confirmation window always appears first, saying "No" or closing the window changes nothing, confirming removes the product, and the dealer can then add a new product of the same type. Two tests failed for one reason that is not about cancelling: the quote **Subtotal** (the total of the vehicle and its products shown on the quote) never includes the cost of a Permaplate product, so adding, cancelling or re-adding Permaplate never changes it — the dealer and client see a total that is too low by the Permaplate cost. This was filed as bug AP-2516 (Medium) with a question to the product owner on whether the Permaplate cost is meant to count in the Subtotal. Because only 86 % of the test cases passed, against the 90 % the story needs, AP-2493 stays in QC until that is settled.

---

## Test Metrics

| Metric | Value |
|---|:---:|
| Requirements covered | 3 of 3 |
| Total test cases | 14 |
| Passed | 12 (86%) |
| Failed | 2 (14%) |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **86%** (12 of 14) |
| Pass rate threshold | 90% |
| Threshold met? | ❌ No |

The pass rate is the share of test cases that passed, counted over every case that was not skipped (12 ÷ 14 = 85.7 %, rounded to 86 %). Defect density — bugs found per test case — is 1 ÷ 14 = 0.07.

**Defect Metrics:**

| Severity | Open | Resolved | Total Found |
|---|:---:|:---:|:---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 1 | 0 | 1 |
| Low | 0 | 0 | 0 |
| **Total** | **1** | **0** | **1** |

---

## Exit Criteria Assessment

_The conditions we agreed had to be true before testing could be called finished,
and whether each one actually holds. Anything marked ❌ is a reason not to ship yet._

| Criterion | Target | Actual | Met? |
|---|---|---|:---:|
| All High-priority TCs executed | 100% | 100% (9 of 9) | ✅ |
| Pass rate | ≥ 90% | 86% (12 of 14) | ❌ |
| Critical bugs open | 0 | 0 | ✅ |
| High bugs open | ≤ 0 | 0 | ✅ |
| Test report generated | Yes | Yes | ✅ |
| Every FAIL filed, linked or dismissed | Yes | Yes — both FAILs filed as AP-2516 | ✅ |

---

## Requirement Coverage

_How much of each requirement we actually managed to test. A low percentage means
we cannot yet say whether that requirement works, not that it is broken._

| Requirement | Test Cases | Passed | Failed | Blocked | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Cancel action offered only for a non-finalized product (AC 1) | 7 (AP2493_001–006, _013) | 7 | 0 | 0 | 100% |
| REQ-002 — Cancellation confirmed in a modal; decline or dismiss changes nothing (AC 2) | 2 (AP2493_007, _008; also checked in _009 and _014) | 2 | 0 | 0 | 100% |
| REQ-003 — Product deleted, slot freed for a new product, Subtotal reflects only active products (AC 3 + description) | 5 (AP2493_009–012, _014) | 3 | 2 | 0 | 100% |
| **Total** | **14** | **12** | **2** | **0** | **100%** |

Coverage here means every case for the requirement was run to a result. All three requirements were fully executed; REQ-003 has two failures, both on the Subtotal for Permaplate.

---

## Defect Summary

| Bug ID | Title | Severity | Priority | Requirement | Tracker | Status |
|---|---|:---:|:---:|---|---|:---:|
| BUG-001 | The quote Subtotal never includes the Esthetic protection (Permaplate) cost, so adding, cancelling or re-adding Permaplate never changes the Subtotal | Medium | P2 | REQ-003 | [AP-2516](https://garantieavantageplus.atlassian.net/browse/AP-2516) | Open |

AP-2516 covers AP2493_011 and AP2493_012. It is Medium, not High: the wrong number is a displayed total, there is no evidence that a billed or stored amount is wrong, and it fails only the last step of each case, so it blocks no other test.

---

## Test Artifacts

| Artifact | Location | Generated on |
|---|---|---|
| Requirement capture | `requirements/AP-2493-cancelling-a-product-from-a-quote.md` | 2026-11-01 |
| Requirements Analysis | `qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md` | 2026-11-01 |
| Test Plan | `qa-artifacts/2-test-plan/AP-2493_test-plan.md` | 2026-11-01 |
| Test Cases | `qa-artifacts/3-test-cases/AP2493_TestCases_001-005.md`, `AP2493_TestCases_006-010.md`, `AP2493_TestCases_011-014.md` | 2026-11-01 (AP2493_010 revised 2026-11-02) |
| Test-case review findings | `qa-artifacts/3-test-cases/AP2493_ReviewFindings_2026-11-01.md` | 2026-11-01 |
| Execution Log | `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md` | 2026-11-02 |
| Bug Report | `qa-artifacts/5-testing-report/AP-2493_bug-report.md` | 2026-11-02 |
| Review record | `qa-artifacts/7-reviews/AP-2493_review.md` | 2026-11-01 / 2026-11-02 |
| Screenshots | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2493/` (19 files) | 2026-11-02 |
| **This Report** | `qa-artifacts/5-testing-report/AP-2493_test-report.md` | 2026-11-02 |

---

## Risks and Observations

- **Tested on Dev, not staging.** The cases were designed against staging; Dev differs in a few places (the "Summary of products" table, a required warranty Sale price, a simpler Roadside form). The execution log lists each difference and how it was handled. Staging behaviour is not proven by this run.
- **Whether the Permaplate Subtotal problem existed before AP-2493 could not be proven.** The Subtotal is worked out each time the page is shown, so old quotes show today's behaviour, and no build from before the merge is reachable on Dev.
- **Recorded behaviour for the open questions on Dev** (recorded, not judged — the product owner has not answered them):
  - Q-002 (name and place of the cancel action): a red "Delete" item in each product row's "⋯" menu, below Edit and Generate Contract.
  - Q-003 (which amount makes up the Subtotal): the row amount — warranty sale price (1,500, not the 1,000 cost), Roadside policy sale price, GAP premium, creditor monthly premium. The Permaplate cost is not in the Subtotal at all (AP-2516).
  - Q-004 (archived quotes): "Delete" is offered and enabled on archived quote 6245.
  - Q-005 (modal wording): title "Cancel a product - {product}", text "Are you sure you want to cancel this product: {product}?", buttons "Yes, cancel the product" and "No"; no × icon; Escape and a click outside close it.
  - Q-006 (financing): the monthly payment is not recalculated (494.91$ before and after).
  - Q-007 (creditor insurance after a GAP cancel): the creditor premium stays at 20.88$/month after the GAP is cancelled (it was 18.58$/month on a quote that never had GAP).
  - Q-008 (success message): "The product has been cancelled".
- Outside this ticket: the Permaplate page saved a product with no option ticked, creating an Esthetic protection row of "Cost: CA$0.00$" (quote 6463, first attempt); and the Roadside save shows the "already a contract for the same VIN" warning twice.
- **Test data left on Dev:** quotes 6461–6469 (clients `client.stage.947`–`955@yopmail.com`), the permanent Chubb creditor contract AVP000169 on quote 6466, and a new warranty with Sale price 1,800 on quote 6467. Quotes cannot be deleted.

---

## Recommendations

1. The product owner answers Q-003 on AP-2516: should the Permaplate cost (or a Permaplate sale price) count in the quote Subtotal? If yes, fix AP-2516 so the Esthetic protection row carries an amount that feeds the Subtotal; if no, say so in a comment and the QA corrects AP2493_011 and AP2493_012 to expect it.
2. Once AP-2516 is fixed or answered, re-test only AP2493_011 and AP2493_012 ("AP-2493 --from s4"); the other 12 cases need no re-run. Passing both brings the pass rate to 100 %.
3. The product owner answers Q-002 and Q-004–Q-008 in a comment on AP-2493, especially Q-004 (should archived quotes allow Delete?) and Q-007 (should the creditor premium drop when the GAP is cancelled?), since today's Dev behaviour may not be what is wanted.
4. Run the passing cases on staging before release, since this cycle ran on Dev only.

---

## Sign-off

| Role | Name | Decision | Signature | Date |
|---|---|:---:|:---:|---|
| QA Agent | QA Agent (Automated) | FAIL | _(automated)_ | 2026-11-02 |
| QA Lead | Vinh Le - QC | Pending | | |
| Development Lead | Ken Nguyen | Pending | | |
| Product Owner | Nicolas-Eric Tain | Pending | | |

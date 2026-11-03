# Test Case Review — AP-2493
**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2493_test-plan.md, qa-artifacts/3-test-cases/AP2493_TestCases_001-005.md, AP2493_TestCases_006-010.md, AP2493_TestCases_011-014.md; knowledge: `domain` (quote-creation.md, chubb-insurance.md), `navigation` (navigation-map.md), `test-data` (test-centralized.md)

The ticket has real acceptance criteria (three, in the Acceptance Criteria field), so
this review checks against them, not against a placeholder scope.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one test case: AC 1 → AP2493_001–005 (one per
product type) and AP2493_013 (archived edge); the "not finalized" rule → AP2493_006;
AC 2 → AP2493_007 (modal + decline), AP2493_008 (dismiss), AP2493_009, _011, _014
(confirm); AC 3 → AP2493_010 and AP2493_012; the Subtotal statement → AP2493_009, _011,
_014. No expected result asserts something the capture does not say: each record-only
point names its Judgement question (Q-002 to Q-008). The gaps below are partial coverage
of statements that already have a test, so none cites a requirement as uncovered.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The finalized-product guard is checked on one product type only (creditor insurance, AP2493_006). Warranty, Roadside, Permaplate and GAP products with a contract are not checked | Test plan §1 objective 2 | Medium | A warranty or Permaplate with a signed contract could still offer "Delete", leaving a contract with no product behind it. |
| 2 | Confirming a cancellation is exercised on warranty, Permaplate and GAP only; Roadside and creditor insurance are never actually cancelled | Test plan §2.1 (REQ-002 scope across 5 types) | Medium | A delete that fails for Roadside or creditor rows (for example a foreign-key error on the Chubb quote record) would not be seen until a dealer hits it. |
| 3 | Re-adding after a cancel (the freed slot) is checked for warranty and Permaplate only; Roadside, GAP and creditor insurance are not re-added | Test plan §1 objective 1 | Low | A one-row-per-quote limit left in place on GAP, creditor or Roadside (the developer's comment named four such unique indexes) would block re-quoting those products. |
| 4 | The database row deletion itself (hard delete, Q-001) is proven only by its visible effects | Test plan §2.2 | Low | A soft-deleted row would pass these tests. Accepted: QA has no database access; the report must say so. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001, REQ-002 or REQ-003 and an AC or a quoted description sentence that exists in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-002 (Judgement) — action label; AP2493_001–005 record it.
- Q-003 (Judgement) — which product amount feeds the Subtotal; AP2493_009, _011 record which amount the drop equals.
- Q-004 (Judgement) — archived quotes; AP2493_013 records only.
- Q-005 (Judgement) — modal wording; AP2493_007 records it.
- Q-006 (Judgement) — financing recalculation; AP2493_011 records the Financing panel before and after.
- Q-007 (Judgement) — GAP-to-creditor premium; AP2493_014 records it.
- Q-008 (Judgement) — success message; AP2493_009 and _014 record it.
- Q-009, Q-010 (Info) — no test result depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | A warranty or Permaplate product with a generated contract shows no cancel action | Equivalence partitioning | The guard may be coded per product table; a type left out lets a dealer delete a product whose contract is already signed. Medium, not High: AP2493_006 already proves the guard exists, and generating each contract leaves a permanent record. | Medium |
| 2 | Double-clicking the modal's confirm button deletes the product once and shows no error page | Error guessing | A second delete request for a row already gone can raise an HTTP 500 the dealer sees as "the cancel failed". Medium: the product is gone either way, but the dealer is left unsure. | Medium |
| 3 | Cancelling the same product from a second, stale browser tab shows a clear message, not an error page | Error guessing | Two staff on one quote, or one dealer with two tabs, will hit a delete of a row that no longer exists. Medium for the same reason as #2. | Medium |
| 4 | A Roadside Protection product (no contract) is actually cancelled after confirming, and the Subtotal drops by its amount | Equivalence partitioning | Roadside has its own table and contract-ID column; its delete path can fail independently of the warranty one. Medium: depends on AP2493_002 showing a non-finalized Roadside product can exist at all. | Medium |
| 5 | Sending the cancel request for a finalized product directly (replaying the delete URL/form recorded from a non-finalized row with a finalized product's id) is refused | Security | If only the button is hidden and the server does not check for a contract, a crafted request deletes a contracted product. Medium: needs the delete endpoint, which is recorded at run time; the project tests through the UI only. | Medium |
| 6 | After a cancel, the browser Back button does not bring back a usable cancel action on the deleted product | State transition | A cached page could let the dealer "cancel" a row that is gone and see an error page. Low: a nuisance, no data loss. | Low |
| 7 | A quote with a created sale (Create sale) still follows the not-finalized rule for its products | Decision table | The interaction of "sale created" and "no contract" is not stated; a sale could depend on a product the dealer then deletes. Low: the ticket ties the rule only to contracts. | Low |
| 8 | The confirmation modal and the cancel action appear translated in the French UI (`?_locale=fr`) | Equivalence partitioning | Quebec dealers work in French; an untranslated modal key ("product.cancel.confirm") would ship. Low: cosmetic, and the wording is open (Q-005). | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

No candidates were dropped; eight were found.

---

## Recommendation

The 14 test cases are ready to execute as they are. Every acceptance criterion and the
Subtotal statement have at least one case with a concrete expected result, and every point
the ticket leaves open is recorded rather than guessed. No Pass 1 gap leaves a requirement
without a test, and no Pass 2 proposal is High, so nothing needs promoting before
execution. If time allows during execution, the two most valuable additions are #1 (the
contract guard on a warranty or Permaplate product) and #2 (double-click on confirm). The
biggest execution risk is data setup, not coverage: GAP's quote stage is unmapped and
Roadside may finalize on save, so AP2493_002, _005 and _014 may end BLOCKED with a reason.

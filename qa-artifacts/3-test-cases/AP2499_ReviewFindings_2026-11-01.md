# Test Case Review — AP-2499

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2499_test-plan.md, qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2499_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2499_TestCases_011-013.md; knowledge: `domain` (qa-docs/quote-creation.md, qa-docs/chubb-insurance.md), `navigation` (base-test/navigation-map.md), `test-data` (base-test/test-centralized.md)

The ticket has real acceptance criteria (six, in Given/When/Then form), so this review checks against them and is not a placeholder-scope review.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one test case: REQ-001 → AP2499_001 (GAP) and
AP2499_002 (creditors); REQ-002 → AP2499_001–005 for the Chubb dealer in all four
product × financing combinations, and AP2499_013 for the Humania dealer (BLOCKED at
design on Q-002); REQ-003 → AP2499_004 (all eight fields), AP2499_005 and AP2499_012
(empty stored values); REQ-004 → AP2499_003 (fill) and AP2499_006 (correct); REQ-005 →
AP2499_007 (creditors), AP2499_008 (GAP) and AP2499_009 (failure); REQ-006 → AP2499_010
(empty form), AP2499_011 (invalid correction) and AP2499_012 (the two unlisted fields).

The Known blockers tables are filled in all three files, naming the unmapped GAP /
creditors modal, the unknown Humania account and the unknown failure trigger, so the batch
is honest about what nobody has verified yet.

One guessed answer slipped into two expected results:

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | AP2499_007 step 5 and AP2499_008 step 5 require the insurance form to be "still holding the values entered at step 2" after a **successful** quote. The capture says values must be kept only "on failure" (REQ-005 AC 1); nothing says what the form shows after a success, and no Answered question settles it. A build that clears or collapses the form after showing the result would fail these cases on a guess | REQ-005 AC 1 | High | Not a missed defect but a false one: a correct build could be failed and a bug filed against behaviour the author never specified. The "kept values" part must be record-only on the success path |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-006 with the AC title.

**Unresolved Open Questions affecting coverage:**
- Q-002 — no Humania dealer is known. **The Humania half of REQ-002 has no runnable case**: AP2499_013 is BLOCKED until an account is named, so a Humania-only defect cannot be found in this cycle.
- Q-007 — no known failure trigger. AP2499_009 tries Life term `999`; if Chubb prices it anyway, the failure half of REQ-005 stays unproven, and the log must say so rather than count it as covered.
- Q-005, Q-009 — what "backed by the saved financing" means, and what happens when the insurance is submitted with unsaved financing edits. AP2499_003 records the first; nothing exercises the second (see Pass 2 #2).
- Q-010, Q-011, Q-012 — validation limits, optional residual / date of birth, error wording: recorded in AP2499_010–012; those cases fail only on objective faults.
- Q-001, Q-003, Q-004, Q-006 — recorded in AP2499_002, 001, 005 and 006.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | After a creditors quote is priced, changing the financing base amount in the same modal and submitting it: record whether the shown premium is re-priced, cleared or left as it was (record-only, Q-005) | State transition | The dealer sees and sells a premium priced on the old loan amount. Medium, not High: the ticket does not say what should happen, so the case could only record it | Medium |
| 2 | Edit the financing form but submit only the insurance form: record which financing the quote used and whether the edit was saved (record-only, Q-009) | Decision table | Two submit controls in one modal interact; the dealer believes the premium uses the edited loan when it used the stored one | Medium |
| 3 | After saving the financing in the modal and closing it **without** reloading, the quote page's Financing card shows the new financing | Cross-entity | The page behind the modal keeps "You have not added financing details yet", so the dealer adds the financing a second time and the quote ends up with two | Medium |
| 4 | A financing saved through the GAP modal is shown, prefilled, in the creditors modal of the same quote | Cross-entity | GAP and creditors read different copies of the financing, so the two premiums on one quote are priced on different loans | Medium |
| 5 | Double-clicking the financing submit control stores one financing | Error guessing | Two requests race and leave two financings or an error, the same risk as #3 by another route | Low |
| 6 | Financing fields at their edges: base amount `0`, interest rate `0`, term the first and last option of the 80-option list (record-only, Q-010) | Boundary value analysis | A zero loan or zero rate is accepted and sent to Chubb, which returns a meaningless premium or an error | Low |
| 7 | A financing company name or text field containing markup is shown as plain text in the modal | Security | Text typed by one dealer user runs as page code for anyone opening the quote (stored cross-site scripting) | Low |
| 8 | The modal's labels and error texts in the French UI (record-only, Q-012) | Equivalence partitioning | Quebec dealers working in French see English or missing labels in the new form | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

> No candidates were dropped; eight were found.

---

## Recommendation

The set covers every acceptance criterion and can run once one correction is made: the
"form still holds the entered values" check after a **successful** GAP or creditors quote
(AP2499_007 and AP2499_008, step 5) asserts something the ticket only says about the
failure path. Send Pass 1 #1 back to `stlc-testcase-designer` to make that part
record-only before execution. No Pass 2 proposal is High: the two most valuable (#1 re-pricing
after a financing change, #2 the two-submit interaction) can only record behaviour the ticket
does not define, and #3–#4 are good backlog candidates for a follow-up cycle. Be clear that
the Humania half of REQ-002 stays untested until Q-002 is answered.

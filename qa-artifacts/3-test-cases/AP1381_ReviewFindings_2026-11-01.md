# Test Case Review — AP-1381

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-1381_requirements-analysis.md, qa-artifacts/2-test-plan/AP-1381_test-plan.md, qa-artifacts/3-test-cases/AP1381_TestCases_001-004.md

**Standing caveat:** The ticket has no acceptance-criteria field. Its only testable statement is the one-line description, read together with the reporter's 2022-08-03 comment that answers which name stays. The test cases cover that statement fully, but the proposals in Pass 2 are risk-based — what a senior tester would add — not confirmed requirements.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None. REQ-001 AC 1 is checked by AP1381_001 (with AP1381_003 and AP1381_004 recording the PDF and older-invoice behaviour), and REQ-002 AC 1 is checked by AP1381_002. Every expected result that passes or fails asserts only what the description and the answered question Q-001 state; the two points nobody has answered (Q-002, Q-003) are record-only. | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 or REQ-002, both present in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-002 (Judgement, Open) — whether invoices created before the fix must also show the name once. AP1381_004 records what an old invoice shows but cannot pass or fail on it. On v2staging every invoice seen so far was created long after the 2022-09-19 fix release, so this question may not be observable here at all.
- Q-003 (Judgement, Open) — whether the PDF copy is in scope. AP1381_003 records the PDF's name lines but cannot pass or fail on them.

The test set is narrow but not placeholder scope: AP1381_001 and AP1381_002 check the exact defect the reporter raised, on a dealer whose name and company differ, so a pass proves which value the invoice uses and that it appears once.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | A warranty invoice and a Permaplate invoice for the same dealer each show the dealer's name once | Equivalence partitioning | The invoice list mixes "Warranty #…" and "Permaplate contract #…" invoices; if each type has its own template and only one was fixed, dealers still receive duplicated-name invoices for the other type. Medium — the fix dates from 2022, before Permaplate invoices existed, so the newer template may never have received it. | Medium |
| 2 | An invoice viewed with the Dealer portal language set to French shows the dealer's name once | Equivalence partitioning | A separate French invoice template could still carry the duplicate line, which Quebec dealers — the majority on this product — would see. Medium — a cosmetic defect, but on the language most dealers use. | Medium |
| 3 | A dealer whose *Name and company are identical gets an invoice showing that name once | Equivalence partitioning | The original report came from a dealer whose two values were the same; if the build hides the company only when it differs from the *Name (or the reverse), the duplicate returns for exactly that kind of dealer. Low — needs a dealer configuration change and a new invoice, and AP1381_001 already proves the company line is gone. | Low |
| 4 | Changing a dealer's *Name, then raising a new invoice, shows the new name once while the earlier invoice keeps the old one | State transition | The developer says the name is stamped on the invoice when it is created; if new invoices still read a cached or old value, a renamed dealer is billed under the wrong name. Low — not part of this ticket's statement, and it changes shared dealer data that must be restored. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |

---

## Recommendation

The four test cases are ready to execute as they stand. Pass 1 found no requirement or acceptance criterion without a test, and no expected result that rests on a guess. None of the Pass 2 proposals is High priority: the two Medium ones — checking a warranty invoice alongside a Permaplate invoice, and the French-language view — are the most worthwhile additions for a later cycle, because each could reveal a second invoice template that never received the 2022 fix. They are backlog candidates, not blockers for this run.

# Test Case Review — AP-2428

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2428_test-plan.md, qa-artifacts/3-test-cases/AP2428_TestCases_001-005.md, AP2428_TestCases_006-010.md, AP2428_TestCases_011-014.md; knowledge: `domain` (qa-docs/quote-creation.md), `navigation` (base-test/navigation-map.md), `test-data` (base-test/test-centralized.md)

The ticket has real acceptance criteria, so this is a coverage review against them, not a
placeholder smoke check. Every one of the eight requirements has at least one test case,
and the two cases that depend on Blocking questions are correctly shipped BLOCKED.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | AP2428_010 step 4 asserts that the PDF **shows** the VIN `1FAHP35NX8W239204` and the owner name and address. The capture never says which fields the PDF must contain — it only says "Example of PDF:" and points at two attachments that were not read (Q-010, Judgement, Open). A PDF that legitimately omits the address would be failed on a guessed answer. The step should fail only on an objective fault (a VIN, name or address that differs from the form, a blank PDF, a download error) and record which fields appear | REQ-007 AC 1 | High | A correct PDF is reported as a bug, or the team argues over a layout the ticket never specified, while the real question (Q-010) goes unasked |
| 2 | The Year field (REQ-002 AC 3) and the retail/subtotal/tax/grand total lines (REQ-005 AC 2) have test cases, but both are BLOCKED on Blocking questions, so those criteria will not be judged in this cycle | Test plan §5 (exit criteria) | Medium | Release on a pass rate that silently excludes the money figures the client is charged |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every TC cites REQ-001 to REQ-008, all present in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — Year prefill value; AP2428_004 is BLOCKED.
- Q-002 (Blocking) — tax base, rates and province source; AP2428_008 is BLOCKED.
- Q-003 (Blocking) — AP-2456 conflict on retail price and taxes; AP2428_008 is BLOCKED.
- Q-004 to Q-010 (Judgement) — button location, button after generation, validation and persistence of edits, phone mapping, end-date rule, product-table columns, PDF content and language. The related steps in AP2428_001, 002, 005, 006, 011, 012, 013 are record-only, as they should be; AP2428_010 is not (gap 1).

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Double-clicking Generate Contract creates exactly one contract and one invoice | Error guessing | A dealer who clicks twice on a slow server gets two contracts and is billed twice for one sale; Permaplate contracts raise an invoice automatically (AP-2446), so the money impact is direct. High because it costs real money and is a common slip | High |
| 2 | An administrator renaming an option after a contract exists does not change the option name on that contract's PDF | State transition | REQ-008 AC 1 asks for option values to be copied onto the contract; AP2428_014 only moves the price, so a contract whose option names still follow the catalogue would pass. Medium because it needs an admin edit on shared data | Medium |
| 3 | A client with no company leaves "Other name on file" empty and the form still opens and submits | Equivalence partitioning | Company is optional on the client form; the prefill of an empty value is a classic place for a crash or a "null" printed on the contract | Medium |
| 4 | A quote whose vehicle has no delivery date shows a sensible Start and End date or a clear message, not an error | Boundary value analysis | The Start date comes from the delivery date; a quote saved without one could crash the form or put a 1970 date on the contract | Medium |
| 5 | The generated contract appears in the dealer "Esthetic protection contracts" list and the admin contract list with this quote's VIN and client | Cross-entity | A contract that is generated but not listed cannot be found or reprinted by the dealer or admin (AP-2443 / AP-2448) | Medium |
| 6 | Using the browser Back button after Generate Contract and submitting again does not create a second contract | State transition | Same double-billing risk as row 1, reached by navigation instead of a double click | Medium |
| 7 | An Ontario client's contract shows Ontario taxes rather than Québec taxes | Decision table | Taxes "based on the client's province" are never exercised for a non-Québec province; depends on Q-002 being answered, so it would ship BLOCKED today | Medium |
| 8 | A dealer from another dealership cannot open dealer 1380's contract form or PDF by URL | Security | Client name, address and phones of another dealer's client leak through a guessable `/quote/{id}/...` URL. Only one dealer account exists in `env`, so it cannot run until a second is provided | Medium |
| 9 | Accented and long owner values (`Josée Côté-Bélanger`, a 60-character address) survive from the form onto the PDF | Boundary value analysis | Accents turned into "?" or a cut-off address on the client's legal document | Low |
| 10 | With the portal switched to French (`?_locale=fr`), the form labels and the PDF are in French | Equivalence partitioning | French-speaking Québec clients receive an English contract; the ticket attaches both language examples (Q-010) | Low |

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

---

## Recommendation

The set is close to ready. Two changes should go in before execution: fix AP2428_010 so
its PDF check fails only on an objective fault and records the layout (Pass 1 gap 1,
which slips a guessed answer to Q-010 into a pass/fail), and add the High-priority
double-submit case (Pass 2 row 1), because a duplicate contract bills the dealer twice.
The Medium and Low proposals can stay in the backlog; row 8 cannot run until a second
dealer account exists.

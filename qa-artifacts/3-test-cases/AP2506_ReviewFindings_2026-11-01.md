# Test Case Review — AP2506

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2506_test-plan.md, qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md; knowledge sources `domain` (quote-creation.md, chubb-insurance.md §5), `navigation` (navigation-map.md), `test-data` (test-centralized.md)

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement and acceptance criterion has at least one test case: REQ-001
(description, AC 1) → AP2506_001, AP2506_002 (BLOCKED on Q-001), AP2506_009; REQ-002
(AC 2 layout) → AP2506_003; REQ-003 (AC 2 Program Summary list) → AP2506_004; REQ-004
(AC 3 pre-fill) → AP2506_005; REQ-005 (AC 4 submit, "stay unchanged") → AP2506_006,
_007, _008. No expected result was found asserting something the capture does not say:
every point resting on an open Judgement question is written as record-only, AC 1's
disputed case is BLOCKED, and the "same tab" wording of AC 1 is recorded rather than
judged in AP2506_001 because it belongs to the disputed criterion.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None found | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — which row's action AC 1 means. AP2506_002 is BLOCKED; AP2506_001 tests the description's Esthetic protection action and records the tab. **AC 1 as written is not covered until the author answers, and the story cannot be released while it is open.**
- Q-002 — what "match Esthetic Protection" compares against; AP2506_001 and _003 record visible differences.
- Q-003 — where financing sits on the new page; AP2506_003 records it, AP2506_006 – _008 adapt to whether the field exists.
- Q-004, Q-005, Q-006 — start date default and editability, end date rule, meaning of "Total"; AP2506_004 records all three.
- Q-007 — which fields are editable; AP2506_005 records each field.
- Q-008 — what "valid form values" excludes; AP2506_007 and _008 record the response.
- Q-009 — what "the current process" produces after submit; AP2506_006 records the landing page, message and invoice. **The "invoice, financing and PDF behaviour stay unchanged" sentence is therefore proven only for what `domain` records — the contract is listed and its PDF downloads — not for the invoice.**
- Q-010 — behaviour on a quote that already has a contract; AP2506_009 records it.
- Q-011, Q-012 (Info) — where the action sits; whether the change is deployed. AP2506_001 records the first; the second decides when s4 can run.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | With two or more protection options chosen on the quote, the Program Summary lists every one and the total covers them all | Equivalence partitioning | The current cases choose a single option; a page that shows only the first option, or totals only one, would put the wrong coverage on the client's contract. Medium, not High, because AC 2 lists the items without saying how several are shown, so the total could only be recorded | Medium |
| 2 | Double-clicking "Generate Contract" creates one contract and one invoice, not two | Error guessing | The submit now sits on a full page; a lost double-submit guard bills the client twice. Medium because AP2428_015 already covers the creation process this story leaves unchanged | Medium |
| 3 | Opening the contract address for a quote with no Esthetic protection shows a clear message, not HTTP 500 | Error guessing | A bookmarkable address makes this state reachable; a crash page leaves the dealer stuck (the quote entry already crashes with HTTP 500 in a similar state, per `domain`) | Medium |
| 4 | Another dealer's quote id in the contract address does not show that dealer's client data | Security | A page reachable by address could leak another dealer's client name, address and phone. Needs a second dealer account, which `test-data` does not supply | Medium |
| 5 | Owner details changed on the page are what the created contract and PDF show | Cross-entity | If the page lets the dealer edit owner fields (Q-007) but the contract is built from the quote's client, the PDF carries the old details | Low |
| 6 | Changing the owner's province on the page keeps the invoice's taxes consistent with the old flow | Cross-entity | A province change could silently change taxes on the invoice | Low |
| 7 | A start date equal to today and one a year ahead are handled without error, if the field is editable | Boundary value analysis | Off-by-one checks often reject the boundary itself or accept absurd dates, giving a contract with the wrong period | Low |
| 8 | Browser Back from the contract page returns to the quote with nothing created | State transition | A full page changes back-button behaviour; a dealer may re-post the form or lose their place | Low |
| 9 | The contract page in French shows translated section headings | Equivalence partitioning | Quebec dealers work in French; untranslated "Vehicle identification" / "Program Summary" headings look unfinished | Low |
| 10 | At a narrow width the two columns stack without hiding the "Generate Contract" button | Equivalence partitioning | Dealers on tablets may not reach the submit button | Low |

No proposal was dropped (10 surfaced, 10 listed). None is rated High: each either rests on
an unanswered question, is already covered by a sibling ticket's case, or needs data the
sources do not supply.

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Recommendation

The nine test cases cover every requirement and can be executed as they stand once
AP-2506 reaches QC — except AP2506_002, which waits for the author's answer to Q-001.
They prove that the Esthetic protection action opens a full page at the unchanged address,
that the page holds the named sections in two columns, that the Program Summary lists its
five items with the products the quote carries, that vehicle and owner values are
pre-filled, and that submitting creates a listed contract with a downloadable PDF. They do
**not** prove that the invoice behaves as before (Q-009 has no baseline), and they do not
judge AC 1 as written. Proposal 1 (several options) is the most valuable addition if the
designer is re-run for another reason.

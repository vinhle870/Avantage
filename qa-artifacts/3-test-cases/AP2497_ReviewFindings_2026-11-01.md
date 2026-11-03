# Test Case Review — AP-2497

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2497_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2497_test-plan.md, qa-artifacts/3-test-cases/AP2497_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2497_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2497_TestCases_011-014.md; knowledge: `domain` (qa-docs/quote-creation.md), `navigation` (base-test/navigation-map.md), `test-data` (base-test/test-centralized.md)

The ticket has real acceptance criteria (five, in Given/When/Then form), so this review checks against them and is not a placeholder-scope review.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one test case: REQ-001 → AP2497_001 (the
dead-end vehicle) and AP2497_002 (a complete vehicle); REQ-002 → AP2497_003; REQ-003 →
AP2497_004, plus the five stored fields in AP2497_001; REQ-004 → AP2497_005 (fill the
missing value), AP2497_006 (correct all six) and AP2497_007 (confirm unchanged); REQ-005 →
AP2497_008 (empty), AP2497_009 (non-numeric), AP2497_010 (negative) and AP2497_011 (no
partial update), with AP2497_012–014 recording the unstated limits. No expected result
asserts an answer to an open question: Q-001, Q-003, Q-004, Q-005, Q-006, Q-007, Q-008,
Q-009 and Q-010 are recorded, not judged.

Both Known blockers tables are filled while the add-vehicle form and the warranty modal
are unmapped in `domain`, so the batch is honest about what nobody has verified yet.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The test plan's regression line asks that "a program can still be chosen from the results to add the warranty"; AP2497_002 covers it only when the complete vehicle happens to list a program, and records rather than judges what the Extended warranty row shows afterwards | Test plan §2.1 (regression), Q-006 | Medium | If no program is ever listed on staging, nobody checks that adding a warranty still works after the change |
| 2 | Q-011 (Info) — the form for other vehicle type groups (RV, boat, construction) is not exercised; the test plan puts it out of scope | Test plan §2.2 | Low | A non-car vehicle may show a different, broken form, affecting dealers who sell RV or boat warranties |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-005 or a quoted part of the description.

**Unresolved Open Questions affecting coverage:**
- Q-006 — the eligibility rules are unknown. This is the largest limit on the set: **no case can fail because the results are wrong**, and no case currently proves that eligibility was actually re-run rather than the old results being left on screen. AP2497_005–007 judge only that a results area is present after the submit. See Pass 2 #1.
- Q-004 — what an empty Kilometers shows: AP2497_001 records it.
- Q-001, Q-003, Q-005, Q-007, Q-008 — recorded in AP2497_002, 003, 005/006 and 001.
- Q-009, Q-010 — recorded in AP2497_012–014; the record-only cases fail only on an error page or a stored value nobody entered.
- Q-002 — the missing "Required fields" section; the cases judge against the six fields the AC names.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | After a submit that fixes the missing mileage, the results below the form come from a new eligibility request, not the ones shown before | State transition | The vehicle is saved but the results area is not refreshed, so the dealer still sees "There are no eligible program for the vehicle" after fixing the vehicle — the exact dead end the ticket removes. Provable without the eligibility rules by watching the network log for a request sent after the submit whose response fills the results area. High because it is the core promise of the ticket and no current case can fail on it | High |
| 2 | After correcting the vehicle in the modal, the quote page's own "Vehicle" card shows the new mileage once the modal is closed | Cross-entity | The quote page keeps showing "Mileage: km" (empty) while the vehicle is fixed, so the dealer and the client see two different vehicles on one quote | Medium |
| 3 | A second quote on the same inventory vehicle shows the corrected values in its own form | Cross-entity | Saving from one quote changes (or fails to change) the inventory vehicle for every other quote unexpectedly — records Q-007 | Medium |
| 4 | Re-opening the extended-warranty flow after a warranty program has been selected still shows the form, prefilled with the saved values | State transition | A dealer who needs to change the warranty after fixing the vehicle meets a different, unfixed screen | Medium |
| 5 | A Model value containing markup (`<b>Corolla</b>`) is stored and shown as plain text | Security | Text typed by one dealer user is run as page code for anyone opening the quote (stored cross-site scripting) | Medium |
| 6 | Double-clicking the submit control saves the vehicle once and shows one results area | Error guessing | Two requests race and leave duplicated result lists or an error on screen | Low |
| 7 | After a rejected submit, closing and re-opening the modal shows the stored values, not the rejected input | Error guessing | The rejected value stays in the form and is saved by the next unrelated submit | Low |
| 8 | Emptying Fuel type or Vehicle type and submitting (record-only, Q-009) | Equivalence partitioning | A missing Fuel type or Vehicle type is stored, leaving the vehicle in a new dead-end state | Low |
| 9 | Switching Vehicle type to a non-car group shows the same six fields (record-only, Q-011) | Equivalence partitioning | RV or boat dealers meet a different or broken form | Low |
| 10 | The form's labels and errors in the French UI (record-only, Q-003) | Equivalence partitioning | Quebec dealers working in French see English or missing labels | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

> 2 additional lower-priority candidates not listed (a very old Year such as `1900`, which AP2497_012's future-year check partly covers; and the modal at the 390 × 844 member viewport, which the dealer portal does not target).

---

## Recommendation

The set is ready to run on the acceptance criteria as written, with one exception worth
fixing first: no case can fail if the results below the form are simply not refreshed
after the vehicle is fixed, which is the heart of the ticket. Promote Pass 2 #1 (High)
into the test-case file through `stlc-testcase-designer` before execution, using the
network log as the objective proof of a fresh eligibility request. The Medium proposals
(#2 quote Vehicle card, #3 second quote on the same vehicle, #4 re-open after selection,
#5 markup in Model) are good backlog candidates; none of them is needed to judge an
acceptance criterion.

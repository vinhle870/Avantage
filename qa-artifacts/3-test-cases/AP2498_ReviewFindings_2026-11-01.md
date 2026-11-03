# Test Case Review — AP-2498

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2498_test-plan.md, qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2498_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2498_TestCases_011-014.md; knowledge: `domain` (qa-docs/quote-creation.md), `navigation` (base-test/navigation-map.md), `test-data` (base-test/test-centralized.md)

The ticket has real acceptance criteria (eight blocks, in Given/When/Then form), so this review checks against them and is not a placeholder-scope review.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one test case: REQ-001 → AP2498_001 (no-products
state) and AP2498_002 (products state), with AP2498_014 as regression; REQ-002 →
AP2498_003; REQ-003 → AP2498_004 (field set), AP2498_005 (required flags, no VIN lookup)
and AP2498_006 (empty VIN refused); REQ-004 → AP2498_007; REQ-005 → AP2498_008 (fallback
to the vehicle), AP2498_009 (stored RSP values) and AP2498_010 (the two disagree); REQ-006
→ AP2498_009, 010 and 011; REQ-007 → AP2498_012; REQ-008 → AP2498_011 (newly qualifies)
and AP2498_013 (no longer qualifies). No expected result asserts an answer to an open
question: Q-002, Q-003, Q-004, Q-007, Q-008, Q-009, Q-010, Q-011, Q-012 and Q-013 are
recorded, not judged, and Q-001 is handled by the "AutoShield outcome rule" (a needed
outcome that does not appear makes the case BLOCKED, never FAIL).

The Known blockers tables of all three files are filled while the add-vehicle form and the
**+** flow are unmapped in `domain`, so the batch is honest about what nobody has verified
yet.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Four High cases (AP2498_002, 003, 011, 014) and one Medium (013) depend on AutoShield returning products for a staging vehicle. If no staging vehicle gets products, REQ-002 — the exact defect the ticket fixes — ends BLOCKED, not tested | Test plan §9 (risk 1), Q-001 | Medium | The story could leave QA with the products-state form never seen, and Gate D would then hold the story on a pass rate that says nothing about the main fix |
| 2 | "No new form type has been introduced" (REQ-003 AC 1) is checked only through a shared `name` prefix in AP2498_004. That is indirect evidence; a new form type rendered with the same prefix would pass | Test plan §2.2 (code-level statements) | Low | A duplicate form type in the code, which the developer review — not QA — is placed to catch |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-008, a quoted part of the description, or the test plan's regression line (AP2498_014).

**Unresolved Open Questions affecting coverage:**
- Q-001 — which data gets AutoShield products on staging. This is the largest limit on the set: five cases can end BLOCKED on it, and **no case can fail because the products or prices are wrong** — only because the form or the results area is missing, misplaced or an error.
- Q-006 — no copy of the AutoShield catalogue: AP2498_007 proves only that the Model list follows the Make, not that the lists match the catalogue.
- Q-008, Q-009, Q-010 — prefill precedence, Make/Model prefill from the vehicle, and whether the vehicle record changes: recorded in AP2498_008–010 and 012.
- Q-002, Q-003, Q-004, Q-007, Q-011, Q-012, Q-013 — recorded in AP2498_001, 005, 006, 007, 011 and 014.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | A submit with VIN and Make chosen but Model left on "Choose" is accepted and saves VIN and Make | Decision table | Make and Model are no longer required, but the server may still expect them as a pair; a Make without a Model could give an error screen or silently drop the Make — a dealer halfway through picking the vehicle loses what they entered. Medium because the AC's required flags (AP2498_005) and the VIN-only path (AP2498_012) are already tested, and this is the mixed combination between them | Medium |
| 2 | After a submit in the RSP flow, the quote page's "Vehicle" card and the "Roadside Protection" row show consistent values once the flow is closed | Cross-entity | The RSP program holds a VIN the quote page never shows, so the dealer and the client see two different vehicles on one quote. Medium — depends on Q-010, which is unanswered | Medium |
| 3 | A VIN longer than 17 characters, or with letters I, O or Q, is handled without an error screen and the stored value is shown as entered or refused | Boundary value analysis | A malformed VIN is sent to AutoShield and causes an error page or a silently truncated VIN. Medium — VIN validation is not stated (Q-004), so the result can only be recorded | Medium |
| 4 | A Year of `1899`, a year two years in the future, and letters in Year are handled without an error screen | Boundary value analysis | An unchecked Year reaches AutoShield and breaks the quote with an error page. Low — Year is optional and its limits are not stated (Q-005) | Low |
| 5 | A VIN containing markup (`<b>VIN</b>`) is stored and shown back as plain text | Security | Text typed by one dealer user is run as page code for anyone opening the quote (stored cross-site scripting). Medium — the VIN is a free text input stored and re-rendered in the form | Medium |
| 6 | Generating a roadside-protection contract after correcting the VIN in the new form puts the corrected VIN on the contract | Cross-entity | The contract is issued on the vehicle's old VIN instead of the one the dealer corrected — a real contract on the wrong vehicle. Medium, not High: generating a contract sends a real request to AutoShield and leaves a contract behind, so it needs a QA decision before it is run (Q-012) | Medium |
| 7 | Double-clicking **Continue** saves once and shows one results area | Error guessing | Two requests race and leave a duplicated product list or an error on screen | Low |
| 8 | The dealer UI in French shows the no-products notice in French below the form (no English-only fallback) | Equivalence partitioning | Québec dealers working in French see an untranslated or missing notice. Low — the ticket quotes only the English text | Low |

No High proposal surfaced; nothing was dropped.

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Recommendation

The 14 test cases cover every acceptance criterion and are ready for execution as they
stand. No Pass 1 gap cites an uncovered requirement or acceptance criterion, and no Pass 2
proposal is High, so nothing needs to be promoted before the run. The one thing to watch is
Pass 1 #1: before execution, it is worth asking the developer (Q-001) for a staging VIN or
make/model that AutoShield prices, because without it the products-state cases —
including AP2498_003, the ticket's main fix — may end BLOCKED. Pass 2 #1 (Make without
Model) and #6 (contract carries the corrected VIN) are the best candidates for a later
round.

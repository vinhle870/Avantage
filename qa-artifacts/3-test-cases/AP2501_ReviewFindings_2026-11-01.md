# Test Case Review — AP2501

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2501_test-plan.md`, `qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md`; knowledge `domain` (`quote-creation.md` § Permaplate contract lists, `admin-portal.md`) and `navigation` (`navigation-map.md`)

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Traceability (the link from each requirement to the tests that check it) is complete for
every acceptance criterion: REQ-001 → AP2501_001, AP2501_002; REQ-002 → AP2501_003;
REQ-003 AC 1 → AP2501_004; REQ-003 AC 2 → AP2501_005; REQ-004 → AP2501_006 (BLOCKED on
Q-001). The test plan's regression objectives (real contract number, no retail price) are
checked inside AP2501_001 step 5. One test-plan item has no case:

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | The test plan's Out of Scope row says an invoice created before the change "may be observed and recorded, never failed", but no case opens one. | Test plan §2.2 (Q-003) | Low | Nobody learns whether older Permaplate invoices still lack the term, so the reporter answers Q-003 without knowing what the build does today. Low because no pass or fail depends on it. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites a REQ and AC that exist in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — still open, posted as Jira comment 19437. Blocks AP2501_006: the position of the term relative to the contract number cannot be judged on any surface, and the story cannot move to release until it is answered.
- Q-002 (Judgement) — still open. AP2501_001–005 pass on the term being present and correct, and only record its exact wording and language. They identify "the term" as the term radio selected on the Permaplate Quote page; that reading rests on the `domain` knowledge and earlier execution logs, which call that radio the Permaplate term ("10 ans"), and on the ticket's screenshot, which highlights `10 ans/yrs ( suite complète )`. It is not a guessed answer to Q-002, which asks only about the text's exact form.
- Q-003 (Judgement) — still open; no case records it (Pass 1 gap 1).
- Q-005 (Judgement) — still open; AP2501_004 and AP2501_005 record the list layout.
- Q-004, Q-006 (Info) — no test result depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | With the interface switched to French, the new invoice's details page and PDF still name the term, and the term text is recorded in both languages | Equivalence partitioning | A term line built from an English-only label could vanish or show a translation key for a French-speaking dealer, the majority of this Quebec customer base; recorded, not judged, until Q-002 is answered. | Medium |
| 2 | An invoice raised before the change is opened and its description recorded | State transition | Records whether historical invoices were back-filled or left as they were, so the reporter can answer Q-003 knowing what the build does. | Low |
| 3 | A contract sold with a parent option and its auto-ticked child option still shows one term line, not the option names in its place | Equivalence partitioning | The term lookup could pick an option name instead of the term when options are nested (AP-2444), so the invoice would name "Extra care" as the term. | Low |
| 4 | After the invoice is paid or its status changes, the description still names the same term | State transition | A description rebuilt on status change could lose the term; low because AP-2446 testing stops at the payment screen and does not take real payments on staging. | Low |
| 5 | A warranty invoice, if one can be raised, does not gain a Permaplate-style term line | Cross-entity | Shared invoice-description code could change other products' invoices without anyone asking for it; low because Q-006 is Info and AP2446_005 found no way to raise a warranty invoice on this build. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Recommendation

The six cases are ready for execution as they stand. Every acceptance criterion has a case,
the one Blocking question is correctly held as BLOCKED in AP2501_006, and the Judgement
questions are record-only. No Pass 1 gap cites a requirement and no Pass 2 proposal is High,
so nothing needs promoting before the run. Proposal 1 (French interface) is the most useful
addition if the designer is re-run for another reason, because it gives the reporter the
evidence to answer Q-002.

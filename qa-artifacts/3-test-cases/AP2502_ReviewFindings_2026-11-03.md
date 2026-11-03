# Test Case Review — AP-2502

**Date:** 2026-11-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2502_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2502_test-plan.md, qa-artifacts/3-test-cases/AP2502_TestCases_001-005.md; knowledge: `domain` (compliance-documents.md, chubb-insurance.md, quote-creation.md *On Dev*), `navigation` (navigation-map.md), `test-data` (test-centralized.md)

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None. Every acceptance criterion of REQ-001 to REQ-004 has at least one test case (coverage matrix), and both send entry points named in the test plan are exercised (Insurance Quick Quote in AP2502_001–003 and 005, Quote Details in AP2502_004). No expected result asserts an answer to an open question: the product line wording (Q-002), pre-filled values (Q-003), attachment names (Q-004), waiver forms (Q-007), the no-form send (Q-008) and the other family's document (Q-009) are all record-only. | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Judgement) — which creditor forms are "the 960 forms". Not an assertion, but it decides whether AP2502_001, 003 and 004 can run at all on Dev: with no option containing "960" they are BLOCKED for missing test data, and then nothing in this batch proves the GC960 document is sent. Say so plainly in the report if it happens.
- Q-002, Q-003, Q-004, Q-007, Q-008, Q-009 (Judgement) — recorded, not judged, in AP2502_001–005.
- Q-005, Q-006 (Info) — no test result depends on them.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Changing the dealer's family between two sends changes the attached document on the very next send | State transition | If the family document is cached per dealer or per session, a dealer whose configuration was just corrected keeps sending the wrong summary to clients. Partly covered: AP2502_002 runs after 001 restores the configuration, but no case asserts the switch within one session | Medium |
| 2 | A dealer assigned two different 960 forms receives one GC960 document, not two | Equivalence partitioning | If each 960 form produces its own copy, clients receive duplicate summaries; only meaningful if Dev lists more than one 960 form (Q-001) | Medium |
| 3 | A send made with the dealer portal in French attaches the same family documents | Equivalence partitioning | If the family choice is tied to the interface language, French-interface dealers send the wrong document. The Staging email always carried both language variants, so the risk is low | Low |
| 4 | Each send still adds one row to `/insurance-compliance-log` with the typed name and e-mail | Cross-entity | A regression in the AP-2436 register would remove the dealer's proof that disclosure was sent. Partly covered by AP2502_004 step 3 (per-quote section) | Low |
| 5 | The pre-filled dealer name in the French GC960 document survives an accented or long dealership name | Error guessing | If `AccountName` is filled with broken characters or cut off, the disclosure names the dealer wrongly; dealer 1380's name has no accents, so this needs a second dealer | Low |
| 6 | The Chubb contract packet (AP-2437) of a GC960 dealer carries the matching "Let's Talk Insurance!" sheet | Cross-entity | If only the email was switched, the signed contract packet still carries the GC6201 sheet. Out of scope by Q-006 (Info) — a backlog candidate, not a promotion | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

---

## Recommendation

The five test cases are ready to execute as they stand: every acceptance criterion is
covered, no open question is asserted, and each case that changes dealer 1380's creditor
forms records and restores them itself. No Pass 1 gap cites a requirement and no Pass 2
proposal is High, so nothing needs promoting before execution. The single real risk is
test data — if the Dev admin list has no form whose label or value contains "960", three
of the five cases will be BLOCKED and the GC960 document will be unproven; the two Medium
proposals (1 and 2) are worth adding in a later cycle once Q-001 is answered.

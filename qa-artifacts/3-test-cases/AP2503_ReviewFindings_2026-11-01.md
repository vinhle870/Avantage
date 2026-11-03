# Test Case Review — AP2503

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2503_test-plan.md, qa-artifacts/3-test-cases/AP2503_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2503_TestCases_006-010.md; knowledge sources `domain` (quote-creation.md), `navigation` (navigation-map.md), `test-data` (test-centralized.md)

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement and acceptance criterion has at least one test case: REQ-001 →
AP2503_001; REQ-002 (AC 2, AC 1 preview) → AP2503_002; REQ-003 (Program Summary) →
AP2503_003, _007, _009; REQ-004 (AC 1 and AC 3 pre-fill, read-only, editable) →
AP2503_004, _005, _010; REQ-005 (AC 4 submit) → AP2503_006, _007, _008. No expected result
was found asserting something the capture does not say: every point resting on an open
question is written as record-only. One gap cites the test plan only.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Test plan §3.2 (Regression) says "after submit, a contract exists and the quote page offers the invoice as before", and §9 calls the automation-suite baseline an "observable regression check"; AP2503_006 only records the invoice, as Q-007 (Judgement) requires. The plan's wording and the case disagree — the case is right | Test plan §3.2, §9 | Low | Nothing ships undetected through the case itself; a reader of the plan may expect the invoice to be judged when it is only recorded |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 — where the vehicle details sit; AP2503_002 records it. The description's "vehicle … on the left" is not judged.
- Q-002 — whether the preview shows the quote or the contract PDF; AP2503_002 records it.
- Q-003 — which vehicle fields are "vehicle identifiers"; AP2503_005 records each vehicle field's editability, so the read-only rule is judged only for the delivery date.
- Q-004 — start date default and allowed range; AP2503_003 and _009 record them.
- Q-005 — which amount the sale price is; AP2503_003 records it.
- Q-006 — what "valid form values" excludes; AP2503_008 records the response.
- Q-007 — what "the current process" produces after submit; AP2503_006 and _007 record the landing page, invoice and PDF. **The "invoice, financing and PDF behaviour stay unchanged" sentence is therefore not proven by this set** — only that a contract is created.
- Q-008 — the financing section with no financing; AP2503_010 records it.
- Q-009 — whether owner edits change the quote's client; AP2503_005 and _007 record it.
- Q-010 — other points that must "match Esthetic Protection"; AP2503_002 records visible differences.
- Q-011 (Info) — where the action sits; AP2503_001 records it.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Double-clicking "Generate Contract" creates one contract and one invoice, not two | Error guessing | The submit moved from a modal to a page form; if the new form lost a double-submit guard, the dealer gets two contracts and is invoiced twice. Medium, not High, because the story leaves the creation process itself unchanged and the guard (if any) lives there | Medium |
| 2 | Opening the generate-contract address again after the contract was generated does not create a second contract | State transition | The address is now a bookmarkable page rather than a modal; a dealer returning to it could generate a duplicate contract for the same warranty | Medium |
| 3 | Opening the generate-contract address for a quote with no extended warranty shows a clear message, not HTTP 500 | Error guessing | A direct address makes this reachable for the first time; a crash page gives the dealer no way forward (the quote entry point already crashes with HTTP 500 in a similar state, per `domain`) | Medium |
| 4 | Another dealer's quote id in the generate-contract address does not show that dealer's client data | Security | A page reachable by address could leak another dealer's client name, address and phone. Needs a second dealer account, which `test-data` does not supply | Medium |
| 5 | Changing the owner's province on the page changes or keeps the contract's taxes as the old flow did | Cross-entity | Owner fields are now editable; a province change could silently change taxes on the invoice (the Permaplate flow computed taxes from the client's province) | Low |
| 6 | A warranty start date equal to the delivery date, and one a year in the future, are handled without error | Boundary value analysis | Off-by-one date checks commonly reject the delivery date itself or accept absurd dates; contracts with a wrong period follow | Low |
| 7 | The generate-contract page in French shows translated section headings | Equivalence partitioning | Quebec dealers work in French; untranslated "Owner information" / "Program Summary" headings look unfinished | Low |
| 8 | Browser Back from the generate-contract page returns to the quote page with nothing changed | State transition | A full page (instead of a modal) changes back-button behaviour; a dealer may lose their place or re-post the form | Low |
| 9 | At a narrow width the two columns stack without hiding the "Generate Contract" button | Equivalence partitioning | Dealers on tablets may not reach the submit button if the right column overflows | Low |

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

The ten test cases cover every acceptance criterion and can be executed as they stand.
They prove that the action opens a dedicated page at the unchanged address, that the named
sections sit in the stated columns, that values are pre-filled and the delivery date is
locked, and that a contract is created. They do **not** prove that the invoice, financing
and PDF behaviour is unchanged, because no baseline of the old flow is recorded (Q-007);
those are recorded for the product owner to accept. No proposal is High and no Pass 1 gap
cites an acceptance criterion, so nothing needs promoting before execution. The two
duplicate-contract proposals (1 and 2) are the most valuable additions if the product owner
wants more depth.

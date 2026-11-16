# Test Case Review — AP2503

**Date:** 2026-11-15
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md (updated 2026-11-15, Q-001 – Q-011 Answered), qa-artifacts/2-test-plan/AP-2503_test-plan.md (version 2.0), qa-artifacts/3-test-cases/AP2503_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2503_TestCases_006-010.md (both revised 2026-11-15); knowledge sources `domain` (quote-creation.md, Dev section "the extended-warranty Generate Contract page after AP-2503"), `navigation` (navigation-map.md), `test-data` (test-centralized.md)
**Supersedes:** AP2503_ReviewFindings_2026-11-01.md, which reviewed the cases while every question was open

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every requirement and acceptance criterion still has at least one test case:
REQ-001 → AP2503_001; REQ-002 (AC 2 columns, AC 1 preview, description) → AP2503_002;
REQ-003 (AC 2 Program Summary) → AP2503_003, _007, _009; REQ-004 (AC 1 and AC 3 pre-fill,
read-only, editable) → AP2503_004, _005, _010; REQ-005 (AC 4 submit, "unchanged"
description) → AP2503_006, _007, _008, _009.

**Answered questions — each one is now judged where the 2026-11-02 log recorded it:**

| Question | Judged in | Record-and-accept in (not recorded on 2026-11-02) |
|---|---|---|
| Q-001 vehicle section first in the left column | AP2503_002 step 3, AP2503_004 step 4 | — |
| Q-002 one embedded contract-draft preview + "Open PDF in new tab" | AP2503_002 step 4 | — |
| Q-003 Make, Model, Year, Mileage editable; VIN and delivery date read-only (AC 3) | AP2503_005 steps 2, 5 | AP2503_005 step 5 — Cylinders, Engine size, transmission, condition, Diesel / Turbo / 4x4 / FWD |
| Q-004 start date default, earlier and later dates, End date not recalculated | AP2503_003 steps 3, 5; AP2503_007 step 5; AP2503_009 steps 2, 4 | AP2503_008 steps 4–5 — an empty start date |
| Q-005 sale price = the warranty's, no tax, editable | AP2503_003 steps 3, 5 | AP2503_009 step 5 — an edited sale price on the contract or invoice |
| Q-006 browser refusal of an emptied owner field | AP2503_008 steps 2–3 | AP2503_008 step 3 — the other required owner fields |
| Q-007 post-submit baseline | AP2503_006 steps 3–5; AP2503_007 steps 3–4; AP2503_009 steps 3–4 | — |
| Q-008 empty financing section display | AP2503_010 step 3 | — |
| Q-009 edits reach the contract only | AP2503_005 step 5; AP2503_007 step 5 (phone) | AP2503_007 step 5 — edited first name and address |
| Q-010 recorded layout differences | AP2503_002 steps 3–4 | AP2503_002 step 4 — labels and card styling |
| Q-011 action in the ⋯ menu; replaced after a contract | AP2503_001 step 3; AP2503_006 step 4 | — |

**The three open bugs keep their failing expected results**, as the QA decided:
AP2503_003 step 3 still expects the vehicle delivery date in the Program Summary
(AC 2, AP-2530); AP2503_005 steps 2 and 5 still expect the VIN and the delivery date to be
read-only (AC 3, AP-2531); AP2503_007 step 3 still expects a no-financing quote to submit
(AC 1 / AC 4, AP-2532). No case softens them to "current behaviour".

**Guessed answers.** No expected result was found asserting something the capture does
not say and no Answered question settles. Each record-and-accept step lists only
objective faults (an error page, HTTP 5xx, a lost value, a changed quote client) and
otherwise accepts what it records.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | AP2503_007 step 3 FAILs on AP-2532 and then tells the executor to pick a financing company and submit again, so steps 4–5 still judge the start date and the owner edits. The test plan §3.2 names this set-up choice only for AP2503_008 and _009 | Test plan §3.2 | Low | Nothing ships undetected; a reader of the plan may not expect AP2503_007 to create its contract after its own FAIL |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- None — Q-001 – Q-011 are Answered (2026-11-15). Six points remain unrecorded until the next execution and are covered by the record-and-accept steps above.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

These are what a senior tester would add, not confirmed requirements. Proposals 1–5 and
7–9 carry over from the 2026-11-01 review (not promoted then); proposal 6 is narrowed
because the answer to Q-004 now covers dates before delivery; proposal 10 is new.

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Double-clicking "Generate Contract" creates one contract and one invoice, not two | Error guessing | The submit moved from a modal to a page form; if the form lost a double-submit guard, the dealer gets two permanent contracts and is invoiced twice. Medium, not High: the creation process itself is unchanged by the story, and every extra contract it would leave on the shared account is permanent | Medium |
| 2 | Opening the generate-contract address again after the contract was generated does not create a second contract | State transition | The address is a bookmarkable page; the ⋯ menu disappears after a contract (Q-011), but the typed address may still accept a second submit | Medium |
| 3 | Opening the generate-contract address for a quote with no extended warranty shows a clear message, not HTTP 500 | Error guessing | A direct address makes this reachable; a crash page gives the dealer no way forward (the bare quote entry already crashes with HTTP 500, per `domain`) | Medium |
| 4 | Another dealer's quote id in the generate-contract address does not show that dealer's client data | Security | A page reachable by address could leak another dealer's client name, address and phone. Needs a second dealer account, which `test-data` does not supply | Medium |
| 5 | Changing the owner's province on the page changes or keeps the contract's taxes as the old flow did | Cross-entity | Owner fields are editable and reach the contract (Q-009); a province change could silently change taxes on the invoice | Low |
| 6 | A warranty start date a year after delivery is handled without error | Boundary value analysis | Dates before delivery are accepted (Q-004); a far-future start date may be accepted too and produce a contract whose period never covers the vehicle's first year | Low |
| 7 | The generate-contract page in French shows translated section headings | Equivalence partitioning | Quebec dealers work in French; untranslated "Owner information" / "Program Summary" headings look unfinished | Low |
| 8 | Browser Back from the generate-contract page returns to the quote page with nothing changed | State transition | A full page changes back-button behaviour; a dealer may lose their place or re-post the form | Low |
| 9 | At a narrow width the two columns stack without hiding the "Generate Contract" button | Equivalence partitioning | Dealers on tablets may not reach the submit button if the right column overflows | Low |
| 10 | An edited Make or Mileage on the page is what the contract shows, and the quote's vehicle is unchanged | Cross-entity | Q-003 accepts these vehicle fields as editable, but nobody recorded where an edited value goes; a contract for a vehicle with the wrong mileage is a claims risk | Low |

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

The ten re-designed cases cover every acceptance criterion and every answered question.
With the answers, the post-submit behaviour now has a baseline, so AP2503_006 judges the
invoice message and amount, the contract link and PDF, and the contract-list row instead
of only recording them. The six points the 2026-11-02 run never saw are each recorded and
accepted by one step, without adding a case. The three open bugs still fail their cases
on purpose. No Pass 1 gap cites an acceptance criterion and no Pass 2 proposal is High,
so nothing needs promoting before execution. Each run of this set leaves three or four
permanent contracts on the shared dealer account — proposals 1 and 2, the most valuable
additions, would each add one more.

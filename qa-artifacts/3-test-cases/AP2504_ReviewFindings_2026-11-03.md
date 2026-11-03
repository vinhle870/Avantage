# Test Case Review — AP-2504

**Date:** 2026-11-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2504_test-plan.md, qa-artifacts/3-test-cases/AP2504_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2504_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2504_TestCases_011-011.md (knowledge: `domain` quote-creation.md and chubb-insurance.md, `navigation` navigation-map.md, `test-data` test-centralized.md)

The ticket's real acceptance criteria were retrieved (four Given/When/Then blocks and a
Creditor Insurance note), so the eleven cases are checked against the actual text, not a
placeholder.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| — | None. Every requirement and acceptance criterion has at least one case: REQ-001 (description, AC 1) → AP2504_001, _002 (BLOCKED, Q-001), _009; REQ-002 (AC 2) → _003, _004; REQ-003 (AC 3) → _004, _005, _006; REQ-004 (AC 4, description) → _007, _008; REQ-005 (Note) → _010, _011. Every expected result was read against the capture: the judged results quote the description, an AC or the Note, and every point that rests on an open Judgement question (Q-002 – Q-011) is record-only | — | — | — |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Blocking) — acceptance criterion 1 names "the Extended Warranty row actions" for the GAP page; AP2504_002 stays BLOCKED, and the story cannot move to Ready for release until it is answered (asked on AP-2504, comment 19460).
- Q-003 — the GAP Program Summary lines are not listed; AP2504_003 records them, so a missing premium or term on the summary would not fail any case.
- Q-005 — what "Financing information" holds; AP2504_006 judges read-only on whatever fields are shown, so a loan field that is simply absent from the page would not fail.
- Q-008 / Q-009 — the post-submit landing page, invoice and PDF have no baseline for GAP; AP2504_007 judges only that a contract exists.
- Q-011 — whether the creditor page must copy the GAP layout; AP2504_010 records the layout, so a creditor page that is still the old long form would not fail.
- Q-012 (Info) — how a co-applicant is added; AP2504_004 may end BLOCKED on Dev for want of the control.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Double-clicking "Generate Contract" on the GAP page creates only one GAP contract | Error guessing | The submit moved from a modal to a full page form; without a double-submit guard the dealer could create two Chubb GAP contracts (two premiums charged) for one loan. Medium, not High: the expected behaviour is not stated, so the result would be record-only, and each try leaves contracts on Dev | Medium |
| 2 | After a successful GAP contract, browser Back and a second "Generate Contract" do not create a second contract | State transition | The page stays in the browser history after the contract is made; re-posting it could duplicate the contract. AP2504_009 opens the address again but never re-submits | Medium |
| 3 | Typing the GAP page address for a quote that has a financing but no GAP quote does not end on an error page | Error guessing | A dealer following an old link or bookmark would get an HTTP 500 technical-error page instead of a message — a pattern already seen on Dev for roadside and documents routes | Medium |
| 4 | A quote with both a GAP and a creditor quote: generating the GAP contract leaves the creditor row's "Generate Contract" working, and vice versa | Cross-entity | Both products share `/quote/{id}/insurance/create-contract…` and one Chubb financing; generating one could consume or overwrite the other's quote, losing a sale | Medium |
| 5 | The GAP page address with another dealership's quote id is refused | Security | A dealer could read another dealership's client and loan details on the pre-filled page. Not runnable today: no other dealership's quote id is known on Dev (`test-data`, AP-2496 fact) | Medium |
| 6 | A GAP quote older than 10 days shows the contract service's refusal as a message on the new page, not an error page | Boundary value analysis | The Chubb service refuses a quote "at least 10 days older than the original quote date"; on the new page that refusal might no longer be displayed. Needs a quote aged 10+ days, so it cannot run in one session | Low |
| 7 | Co-owner values edited on the GAP page go onto the contract only and leave the quote's co-applicant unchanged | State transition | An edit meant for the contract could silently change the quote's co-applicant (or not reach the contract). Rests on Q-006, so record-only | Low |
| 8 | After the GAP contract is created, "Download all documents" on the quote includes the GAP contract | Cross-entity | The new contract might not be picked up by the quote's document bundle. Already HTTP 500 on Dev for every quote (AP-2496), so it would only re-find that defect | Low |
| 9 | The GAP page headings read correctly in French (`?_locale=fr`) | Equivalence partitioning | Quebec dealers working in French could see untranslated or missing section headings. The story names no French text, so record-only | Low |

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

The eleven cases are ready for execution as they stand: every acceptance criterion has a
case, no case asserts an answer to an open question, and the one case that cannot be
judged (AP2504_002) is BLOCKED on the Blocking question Q-001 at design time. None of the
nine Pass 2 proposals is High — they guard against behaviour the ticket does not state, and
most would leave extra Chubb contracts on Dev — so none needs promoting before execution.
If one is promoted later, take proposal 1 (double submit) and proposal 4 (GAP and creditor
on the same quote) first, because each can cost a dealer a duplicated or lost insurance
sale.

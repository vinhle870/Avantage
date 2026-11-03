# Test Case Review — AP-2494

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2494_test-plan.md, qa-artifacts/3-test-cases/AP2494_TestCases_001-005.md, AP2494_TestCases_006-010.md, AP2494_TestCases_011-015.md, AP2494_TestCases_016-018.md
**Knowledge read:** `domain` (quote-creation.md, chubb-insurance.md), `navigation` (navigation-map.md), `test-data` (test-centralized.md), `contract-setup` (06-chubb-contract-setup.md)

The ticket's real acceptance criteria were retrieved (nine Given/When/Then criteria), so
this review checks the 18 test cases against confirmed criteria, not against guesses.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

Every acceptance criterion has at least one test case: AC 1 → 001–003, AC 2 → 004,
AC 3 → 005–008, AC 4 → 009–010, AC 5 → 011, AC 6 → 008 and 012, AC 7 → 013,
AC 8 → 014–015, AC 9 → 016. The gaps below are expected results that assert something
the capture does not say — guessed answers that slipped into a case.

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | AP2494_017 step 4 expects that clearing the search brings back the full list with the same first-page rows. The capture says nothing about clearing a search; that is Q-009 (Judgement, Open), so the step should record the behaviour, not judge it. | REQ-003 AC 7 | High | Nothing would ship undetected — the risk is the reverse: a false FAIL on behaviour the author never specified. |
| 2 | AP2494_018 step 2 expects the archived quote to be listed when searching on the Archived tab. Whether the search covers the Archived tab is Q-011 (Judgement, Open), so this is a guessed answer. | REQ-004 AC 8 | High | A false FAIL if the search is meant to cover only active quotes. |
| 3 | AP2494_016 step 2 expects the quote "on page 1" of the search results. Result order and paging under a search are Q-011 (Judgement, Open). | REQ-005 AC 9 | High | A false FAIL if search results are ordered differently from the list. |
| 4 | Results must never include another dealer's quotes. The test plan names it as a risk area (REQ-004 risk, Q-014), but no case attempts it; file 4 says it is untestable for want of a second dealer login. The admin contract lists show a Dealer column, so a client name belonging to another dealer can be found there and searched from dealer 1380. | Test plan §9 / Q-014 | Medium | A dealer could read another dealership's client names, emails and VINs through the search — a privacy leak. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-005 and an AC number that exists in the capture.

**Unresolved Open Questions affecting coverage:**
- Q-001 (Judgement) — how a contract is written in the cell; AP2494_004–008 record it, so a product owner must still confirm the format.
- Q-002 (Judgement) — separator and order of several contracts; recorded by AP2494_008.
- Q-003 (Judgement) — "finalized" versus "generated"; recorded by AP2494_010.
- Q-004, Q-005, Q-006 (Judgement) — tab name `created`, column position, French label; recorded by AP2494_001–003.
- Q-007, Q-009, Q-011, Q-012 (Judgement) — search controls, empty result, tab scope and paging, case and partial matching on client fields and VIN; recorded by AP2494_013–018.
- Q-008 (Judgement) — cancelled or voided contracts; no case covers it (see Pass 2 #3).
- Q-010 (Judgement) — where a quote name is set; AP2494_013 becomes BLOCKED at execution if no field exists.
- Q-014 (Judgement) — dealer isolation of search results; see Pass 1 #4 and Pass 2 #1.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Searching a client name that belongs only to another dealership lists none of that dealership's quotes | Security | A dealer sees another dealership's clients (names, emails, VINs) through the new search — a privacy breach the plain list never allowed. High because the leak exposes personal data and the existing list scoping gives a clear objective baseline. | High |
| 2 | Paging through search results with more than 10 matches keeps the search filter on page 2 | Boundary value analysis | Page 2 of a VIN search on vehicle 915 drops the filter and shows unrelated quotes, so the dealer cannot trust any result beyond the first ten. Medium because Q-011 leaves paging under a search unspecified, so it would be record-only. | Medium |
| 3 | A quote whose product was cancelled after its contract was generated — the column entry is recorded | State transition | A cancelled contract keeps showing as active in the list, so a dealer believes a product is sold when it is not. Medium because the behaviour is unspecified (Q-008) and record-only. | Medium |
| 4 | The Contracts cell of a quote on the Archived tab lists its contracts | Equivalence partitioning | The archived tab uses a different template and shows the column empty for every row, although AC 1 requires the column there. Medium because AC 1 covers the header but not the content on that tab. | Medium |
| 5 | A search term matching one quote by client name and another by VIN lists both | Decision table | The search only checks the first field it matches and drops quotes matched by another field. Medium because each field is already tested alone. | Medium |
| 6 | A search term with leading and trailing spaces finds the same quotes as the trimmed term | Error guessing | A dealer who pastes a name with a trailing space gets no result and thinks the quote does not exist. Low because the dealer can retype. | Low |
| 7 | The Contracts entries read the same in the French interface | Equivalence partitioning | Contract labels are not translated, or break, in French. Low because only the header language is in scope. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

No further candidates surfaced beyond these seven.

---

## Recommendation

The 18 cases cover every acceptance criterion, and the open Judgement questions are
handled as record-only in all but three places. Before execution, send three cases back
to the designer: AP2494_017 step 4, AP2494_018 step 2 and AP2494_016 step 2 each judge a
point the ticket leaves open (Pass 1 #1–#3) and must become record-only. Also promote
Pass 2 #1 (dealer isolation of search results, High), which closes Pass 1 #4 — it can be
run from dealer 1380 using a client name read from an admin contract list with a Dealer
column. The Medium and Low proposals can stay in the backlog.

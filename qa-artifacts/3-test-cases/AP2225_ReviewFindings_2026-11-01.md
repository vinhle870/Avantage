# Test Case Review — AP2225

**Date:** 2026-11-01
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2225_test-plan.md, qa-artifacts/3-test-cases/AP2225_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2225_TestCases_006-010.md, qa-artifacts/3-test-cases/AP2225_TestCases_011-012.md · knowledge: `domain` (qa-docs/quote-creation.md, qa-docs/chubb-insurance.md), `navigation` (base-test/navigation-map.md), `test-data` (base-test/test-centralized.md) · linked ticket AP-2226 (read for where the lender ID is stored)

The ticket's acceptance criteria were retrieved in full (the Given/When/Then blocks of the
description plus the reporter's field mapping), so the findings below are checked against
real criteria, not risk-based guesses. The twelve cases cover every requirement; two
criteria are covered only partly, and one expected result reads more into the ticket than
it says.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | No case checks that a newly created lender ID is stored on the financing company. The batch treats this as unobservable (Q-006), but linked story AP-2226 (Done) put an editable "AutoShield Lender ID" field on the admin's financing-company edit page, so the value can be read before and after Generate Contract. | REQ-005 AC 2 | Medium | The backend could create a new AutoShield lender on every contract instead of storing and reusing the ID, flooding AutoShield with duplicate lenders, and no test would notice. |
| 2 | AP2225_002 step 4 expects Financed Amount `15000`, the *base amount* typed on the financing page. The ticket says "Financing amount", and the financing form has no field of that name (it has base amount and residual amount), so equating the two is an interpretation the capture does not make. | REQ-002 AC 2 | High | A correct build that computes the financed amount differently (for example net of a down payment) would be reported as a defect, or a wrong one would pass. The expected value should be read from the quote's own Financing section, not assumed. |
| 3 | No case covers the backend login step (REQ-005 AC 1) on its own. This is acceptable: it cannot be observed through the UI, and AP2225_009 proves it by its result. Listed for completeness, not for promotion. | Test plan §2.2 | Low | A login failure would show only as AP2225_009 failing, which the case already records. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every case cites REQ-001 to REQ-006, all present in the analysis.

**Unresolved Open Questions affecting coverage:**
- Q-001 (client fields) — AP2225_003 records which client fields exist; it cannot judge a missing one.
- Q-002 (Purchase Type) — AP2225_002 records the value; it is never judged.
- Q-003 (does Generate save first) — AP2225_007 records it.
- Q-004 (validation) — AP2225_008 fails only on a crash or an invented value.
- Q-005 (failure message) — recorded only if a failure happens naturally in AP2225_009 or AP2225_012.
- Q-006 (where the lender ID is visible) — see Pass 1 gap 1; AP-2226 suggests the admin financing-company page.
- Q-007 (no financing) — AP2225_012 records the outcome.
- Q-008 (labels and formats on the contract page) — AP2225_010 checks presence, records formats.
- Q-009 (PDF open or download) — AP2225_011 records which.
- Q-010 to Q-012 are Info and change no result.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Values the dealer overrides and saves (sale price, odometer) are the ones shown on the generated contract, not the quote defaults | Cross-entity | The contract registered with AutoShield — and the PDF the client signs — would carry the quote's defaults instead of the dealer's corrections, so the client is covered for the wrong vehicle value or mileage. High because the ticket explicitly allows overriding (REQ-002 AC 3) and no case checks the override reaches the contract. | High |
| 2 | Double-clicking "Generate Contract" creates only one AutoShield contract | Error guessing | A double click or a slow page could register two paid contracts at AutoShield for one sale, which then have to be cancelled by hand. High because every contract is a real record at a third party and cannot be deleted from the portal. | High |
| 3 | Re-opening the Road side protection page after a contract exists shows the existing contract rather than offering to generate a second one | State transition | A dealer returning to the quote could unknowingly create a second contract for the same vehicle. Medium because the ticket does not say what the page shows after generation, so the case would be record-only. | Medium |
| 4 | Each of the tiers offered produces a contract whose tier and term match the chosen option | Equivalence partitioning | A mapping error on one tier (for example 60 months sent as 36) would only show for that tier; AP2225_009 tests one option. Medium because each extra tier costs a real contract at AutoShield. | Medium |
| 5 | A very large or negative Odometer Reading is refused or saved without corrupting the value | Boundary value analysis | An odometer of `-1` or `9999999` could reach AutoShield and be priced or refused unpredictably. Medium because validation is not stated (Q-004), so the case would be record-only for the rule and fail only on an objective fault. | Medium |
| 6 | The generated contract appears in the dealer's Road Side Protection contract list with its AutoShield contract ID | Cross-entity | The dealer could not find the contract again after leaving the contract page. Medium because the list is outside this ticket's criteria (Q-012, Info). | Medium |
| 7 | A dealer cannot open another dealer's quote Road side protection page or contract page by changing the quote ID in the address | Security | One dealer could see another dealer's client name, address and contract — a privacy breach. Medium, not High, because only one dealer account exists for QA, so the case can be run only against a quote ID the account does not own, and the ticket does not mention access control. | Medium |
| 8 | The contract page and its labels display in French when the session is French | Equivalence partitioning | French-speaking Quebec dealers would see an English-only contract page. Low because the ticket gives only one French label. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |
| Cross-entity | Check that what this feature produces is read correctly by the next feature in the workflow. |

No candidates were dropped; eight surfaced and all are listed.

---

## Recommendation

The set is close to ready but should go back to the designer once before execution. Three
items matter most: (1) Pass 1 gap 2 — AP2225_002 must take the expected Financed Amount
from the quote's Financing section instead of assuming it equals the base amount; (2) Pass 1
gap 1 — add a case that reads the financing company's "AutoShield Lender ID" in the Admin
portal before and after Generate Contract (AP-2226); and (3) Pass 2 items 1 and 2 (High) —
check that saved overrides reach the contract, and that a double click creates only one
contract. The Medium and Low proposals can stay in the backlog.

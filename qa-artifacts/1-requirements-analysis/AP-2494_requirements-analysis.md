# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote list `/quotes` (Jira AP-2494)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2494-quotes-list-replace-produits-with-contracts.md`
**Total requirements found:** 5

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md

---

## Executive Summary

AP-2494 changes the dealer's quote list (`/quotes`, the page in the Dealer portal that lists
every quote of the dealership). It makes two changes. First, the column headed "Produits"
(French for "Products") is replaced by a column headed "Contracts", which lists the
contracts that have already been generated for each quote — extended warranty, roadside
protection, GAP insurance (insurance that covers the gap between the vehicle's value and
the loan balance), creditor insurance (the Chubb loan-protection insurance), Esthetic
protection (Permaplate) and the sales contract. Second, the list gets a keyword search
that finds quotes by quote name, client first name, client last name, client email and
VIN (the 17-character vehicle identification number).

Five requirements were extracted: one for the column swap, one for what the new column
shows, and one each for searching by quote name, by client details and by VIN. The ticket
has nine acceptance criteria written in Given/When/Then form, no comments and no
attachments. Every criterion names an observable outcome, so **no question blocks
testing**. Thirteen Judgement questions and two Info questions remain. They cover what the
ticket does not spell out: exactly how a contract is written in the cell (number, product
name or link) and how several contracts are separated; whether "finalized" in the
description means the same as "generated" in the criteria; the column's position and its
label in the French interface; whether the client and VIN searches are also
case-insensitive and partial; what the list shows when nothing matches; and whether the
search stays inside the current tab. The tests will record what the build does on those
points rather than guess.

Two testability risks are rated High. Preparing a quote with each contract type is the
costliest part of the test: GAP has no mapped quote stage in the domain knowledge, and the
creditor-insurance contract needs the full Chubb flow. And the domain knowledge (mapped
2026-10-12) shows the list with no quote-name column and the vehicle-first form that sets a
quote name (AP-2477) not yet on staging, so a quote with a known name may not be possible to
create — which would leave the quote-name search untestable.

Overall testability is rated **MEDIUM**: the outcomes are visible on one page, but the test
data behind them is expensive.

---

## Requirements Detail

### REQ-001 — The "Produits" column is replaced by a "Contracts" column on both tabs

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the quote list to show a "Contracts" column instead of "Produits", so that I can see at a glance which quotes already have contracts. (Not stated in the ticket — inferred from the description.) |
| **Priority** | Medium — it is a visible change on a daily-use list; a wrong header confuses dealers but does not lose data. |
| **Source File** | AP-2494-quotes-list-replace-produits-with-contracts.md — description and AC "Contracts column" 1 |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. AC 1 (verbatim): "Given a dealer on `/quotes`, on either the `created` or `archived` tab, when the list renders, then no column is headed "Produits" and a column headed "Contracts" occupies its position."
2. Description (verbatim): "replace the "Produits" column with a "Contracts" column"

**Out of Scope:**

- None stated. The admin portal's quote screens are not mentioned.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The criterion names the tabs `created` and `archived`; the domain knowledge (2026-10-12) records the tabs as labelled "Active" and "Archived". Which visible tab is `created` is not stated (Q-004). | Low | Check the header on every tab the list offers; record the tab labels. |
| The position of "Produits" is not given in the capture, and the domain knowledge lists the English columns as Client, Vehicle, Program, Date Created with no "Produits" (Q-005). | Medium | Record the column order in both languages; judge only that "Produits" is absent and "Contracts" present. |
| The header text in the French interface is not stated — "Contracts" or "Contrats" (Q-006). | Low | Record-only in French; judge the English header as "Contracts". |

---

### REQ-002 — The "Contracts" column lists each generated contract of the quote

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want each quote row to list the contracts generated for it, so that I know which products are finalized without opening the quote. (Not stated in the ticket — inferred.) |
| **Priority** | High — it is the core of the change; a missing or wrong contract misleads the dealer about what was sold. |
| **Source File** | AP-2494-quotes-list-replace-produits-with-contracts.md — description and AC "Contracts column" 2–6 |
| **Recommended Test Types** | Functional · Edge-case · UI · Regression |

**Acceptance Criteria:**

1. AC 2 (verbatim): "Given a quote with a generated extended-warranty contract, when its row renders, then the "Contracts" column shows that contract."
2. AC 3 (verbatim): "Given a quote with generated roadside, GAP or creditor-insurance contracts, when its row renders, then the "Contracts" column shows each of those contract."
3. AC 4 (verbatim): "Given a quote with generated Permaplate or sale contracts, when its row renders, then the "Contracts" column shows those contract numbers."
4. AC 5 (verbatim): "Given a quote with no generated contract, when its row renders, then the column shows a blank space."
5. AC 6 (verbatim): "Given a quote where one product has no contract generated yet, when its row renders, then that product contributes no entry — no blank or broken line."
6. Description (verbatim): "a "Contracts" column that lists the quote's finalized contract"

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| AC 2 and AC 3 say the column "shows that contract" without saying how — number, product name or link — while AC 4 says "contract numbers" for Permaplate and sale (Q-001). | Medium | Judge that an entry identifying the contract appears (its number where the product has one); record the exact text and whether it is a link. |
| How several contracts in one cell are separated and ordered is not stated (Q-002). | Low | Record the separator and order; judge only that each contract has its own entry and no blank or broken line appears (AC 6). |
| The description says "finalized" contract, the criteria say "generated" contract (Q-003). | Low | Test with generated contracts, the criteria's word; record any difference. |
| Preparing a quote with a generated contract of every type is expensive: GAP has no mapped quote stage, and creditor insurance needs the full Chubb flow (domain: chubb-insurance.md). | High | Reuse existing quotes of dealer 1380 that already carry such contracts where possible; create new ones only for the types missing. |
| A cancelled or voided contract is not mentioned (Q-008). | Low | Record-only, if such a quote exists. |

---

### REQ-003 — Search finds quotes by partial, case-insensitive quote name

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to search the quote list by quote name, so that I can find a quote without paging through the list. (Not stated in the ticket — inferred.) |
| **Priority** | Medium — it saves time but nothing is lost without it; the list stays browsable by page. |
| **Source File** | AP-2494-quotes-list-replace-produits-with-contracts.md — description and AC "Search" 1 |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. AC 7 (verbatim): "Given a dealer on `/quotes`, when they open the search and submit part of a quote name, then the matching quotes are listed, and the match is partial and case-insensitive."
2. Description (verbatim): "add a keyword search over quote name, client first name, client last name, client email and VIN."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| How the search is opened and submitted (button, Enter, as-you-type) is not stated (Q-007). | Low | Record the controls; use whatever submit the page offers. |
| What the list shows when nothing matches is not stated (Q-009). | Low | Record-only; judge only that no non-matching quote is listed. |
| The domain knowledge (2026-10-12) records that the list shows no quote name and that the form setting a quote name (AP-2477) was not deployed on staging (Q-010). | High | Confirm during execution that a quote with a known name can be created; otherwise the quote-name cases become BLOCKED, not FAILED. |
| Whether the search covers both tabs or only the current one is not stated (Q-011). | Low | Record-only. |

---

### REQ-004 — Search finds quotes by client first name, last name, email or full name

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to search the quote list by the client's name or email, so that I can find a client's quotes quickly. (Not stated in the ticket — inferred.) |
| **Priority** | High — searching by client is the most likely everyday use of the search. |
| **Source File** | AP-2494-quotes-list-replace-produits-with-contracts.md — description and AC "Search" 2 |
| **Recommended Test Types** | Functional · Negative · Edge-case |

**Acceptance Criteria:**

1. AC 8 (verbatim): "Given a quote with client first name, last name and email, when the dealer searches any one of them, or the full `first last`, then the matching quotes are listed."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| AC 8 does not say whether the match on client details is partial or case-insensitive (AC 7 says so only for the quote name) (Q-012). | Medium | Judge exact-value searches; record partial and different-case results. |
| Reversed order `last first` is not mentioned (Q-013). | Low | Record-only. |
| Whether results can include another dealer's quotes is not stated (Q-014). | Medium | Search a value known to exist only under another dealer if such data is available; record the result. |

---

### REQ-005 — Search finds quotes by partial VIN

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to search the quote list by part of a VIN, so that I can find the quote for a vehicle on my lot. (Not stated in the ticket — inferred.) |
| **Priority** | Medium — useful, but the client search covers most lookups. |
| **Source File** | AP-2494-quotes-list-replace-produits-with-contracts.md — description and AC "Search" 3 |
| **Recommended Test Types** | Functional · Edge-case |

**Acceptance Criteria:**

1. AC 9 (verbatim): "Given a quote with a partial VIN, when the dealer searches, then the matching quotes are listed."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "A quote with a partial VIN" reads as "a dealer searches part of a quote's VIN"; the sentence is grammatically loose (Q-015). | Low | Test searching a substring of a quote's full VIN, the reading every other AC supports; also search the full VIN. |
| Case-insensitivity of the VIN search is not stated (Q-012). | Low | Record a lower-case VIN search. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Contracts column replaces Produits | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Contracts column content | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-003 — Search by quote name | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Search by client details | ✓ | ✓ | ✓ | | | | | |
| REQ-005 — Search by VIN | ✓ | | ✓ | | | | | |

**Legend:** ✓ = recommended based on requirement content

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | For extended warranty, roadside, GAP and creditor insurance, what exactly does the cell show for a contract — its number, the product name, both, and is it a link? AC 4 says "contract numbers" only for Permaplate and sale. | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-002 | When a quote has several contracts, how are they separated (one per line, comma) and in what order? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | The description says the column lists the "finalized" contract; the criteria say "generated". Are these the same state, and does the description's singular "contract" mean only one is shown? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | AC 1 names the tabs `created` and `archived`. Which visible tab is `created`? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | Where is the "Produits" column today, i.e. which position must "Contracts" take? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | In the French interface, is the new header "Contracts" or a French label such as "Contrats"? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | How is the search opened and submitted — a search box always visible, a toggle, a button, Enter, or as-you-type? | REQ-003, REQ-004, REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | Does a cancelled or voided contract still appear in the column? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | What does the list show when the search matches nothing, and how does the dealer clear the search? | REQ-003, REQ-004, REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | Where does a dealer set a quote's name today, given the list shows no quote name? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | Does the search look only in the tab being viewed, or across both tabs, and does it keep paging? | REQ-003, REQ-004, REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-012 | Are the client-name, email and VIN searches also partial and case-insensitive, as stated for the quote name? | REQ-004, REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-013 | Should the reversed full name `last first` also match? | REQ-004 | Info | Open | — | Nicolas-Eric Tain |
| Q-014 | Is the search limited to the logged-in dealer's own quotes? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-015 | AC 9 reads "Given a quote with a partial VIN". Does it mean the dealer searches part of the quote's VIN? | REQ-005 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-002 | A generated contract of every type (warranty, roadside, GAP, creditor, Permaplate, sale) is needed; GAP has no mapped quote stage | High | Open |
| REQ-003 | A quote with a known name may not be creatable on staging (AP-2477 not deployed as of 2026-10-12) | High | Open |
| REQ-001 | Position of the old "Produits" column not stated | Medium | Open |
| REQ-002 | Representation of non-Permaplate/non-sale contracts not stated | Medium | Open |
| REQ-004 | Partial / case-insensitive match on client details not stated | Medium | Open |
| REQ-004 | Dealer isolation of search results not stated | Medium | Open |
| REQ-001 | French header label not stated | Low | Open |
| REQ-003 | Search controls and no-result display not stated | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design

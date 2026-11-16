# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote list `/quotes` (Jira AP-2494)
**Date:** 2026-11-01 · **Re-run:** 2026-11-15 (knowledge lookup, Step 3c, on every Open question)
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

**Re-run 2026-11-15.** Every Open question was checked against the other Jira Stories and
Tasks (knowledge lookup — see *Knowledge Lookup Log* below). Two are now **Answered** by
another Story: "finalized" means "has a generated contract" (AP-2493), and the quote name is
set at the top of the new-quote vehicle form (AP-2477). Eleven are **Accepted**: no Story
or Task defines them, so the behaviour the Dev build showed on 2026-11-02 is taken as the
expected result. Two stay **Open** because they ask what the author meant by the ticket's
own words — the French header (Q-006) and the wording of AC 9 (Q-015). No question is
Blocking. The sale-contract failure (AP-2517) stands, because AC 4 itself says sale
contract numbers are shown.

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
| Q-001 | For extended warranty, roadside, GAP and creditor insurance, what exactly does the cell show for a contract — its number, the product name, both, and is it a link? AC 4 says "contract numbers" only for Permaplate and sale. | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "Contracts column", "quote list contracts", "contract number link") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_004 step 4 and AP2494_006 step 5: each contract is shown by its contract number as plain text, one list item, no link and no product name — quote 6454 "26df1-844", quote 6480 "AVP000170". | — |
| Q-002 | When a quote has several contracts, how are they separated (one per line, comma) and in what order? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "contracts one per line", "multiple contracts quote", "quote list contracts") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_008 step 4 and the AP2494_010 re-capture: each contract is its own item of one list, one per line — quote 6254 "2698", "AVP000162"; archived quote 6040 "APOP01-671", "11111"; archived quote 6041 "APOP01-663", "ContractNumber_12345" (warranty first, then sale). AC 6 ("no blank or broken line") stays the judged result. | — |
| Q-003 | The description says the column lists the "finalized" contract; the criteria say "generated". Are these the same state, and does the description's singular "contract" mean only one is shown? | REQ-002 | Judgement | Answered | Same state: "A product can only be cancelled while it is **not finalized** — that is, while it has no generated contract." — AP-2493 description (Story, status QC, same reporter; it overrides no AC of AP-2494). Several contracts: "Given a quote with generated roadside, GAP or creditor-insurance contracts, when its row renders, then the "Contracts" column shows each of those contract." and "Given a quote with generated Permaplate or sale contracts, when its row renders, then the "Contracts" column shows those contract numbers." — capture, AC 3 and AC 4. AC 4 states the sale result, so the AP2494_010 FAIL (AP-2517) stands. Not a contradiction in the ticket's own text: AC 3 itself writes the plural as "each of those contract", so the description's singular "contract" is the same wording, and AP-2493 equates "finalized" with "has a generated contract". Searched: "finalized contract", "sales contract save", "sale contract number quote". | — |
| Q-004 | AC 1 names the tabs `created` and `archived`. Which visible tab is `created`? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "quote archived tab", "quotes created archived", "archived quotes", "active archived tab", "archive quote list") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_001 step 2 and AP2494_003: the first tab is labelled "Active" in English and "Créé" in French (`/quotes`); the second is "Archived" (`/quotes/archived`). AC 1 was checked on both. | — |
| Q-005 | Where is the "Produits" column today, i.e. which position must "Contracts" take? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "Produits column", "quote list columns") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_001 step 3: headers "Vehicle", "Client", "Contracts", "Date Created" — "Contracts" is the third column. | — |
| Q-006 | In the French interface, is the new header "Contracts" or a French label such as "Contrats"? | REQ-001 | Judgement | Open | Not settled by a lookup: the ticket's own text names the old header in French ("Produits") and the new one in English ("Contracts") — description and AC 1 — so whether the French interface must read "Contracts" or a translation is a reading of the ticket's own text, which the actual result must not choose (author intent). The lookup found nothing either (searched: "Contrats", "French translation quote list"). Stays Open for the author. For the record, execution log of 2026-11-02 (Dev), AP2494_003 step 3: the French header is "Contrats" on both tabs; AC 1 is judged on the English interface (AP2494_001 and AP2494_002, "Contracts"). | Nicolas-Eric Tain |
| Q-007 | How is the search opened and submitted — a search box always visible, a toggle, a button, Enter, or as-you-type? | REQ-003, REQ-004, REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: "quote search", "keyword search", "search modal", "search button") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_013 step 2: a magnifier button beside "Create a quote" opens a dialog labelled "Quote name, client name, client email or VIN" with one text box and a **Search** button; Enter also submits (GET `/quotes?quote_search[keyword]=…`). | — |
| Q-008 | Does a cancelled or voided contract still appear in the column? | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "cancelled contract list", "cancelled warranty quote") — current actual result accepted. Hits AP-2535 and AP-2543 (Deploy to staging) say only how the quote's **details page** shows a cancelled contract, not the `/quotes` list, so they do not define it. Observed in the execution log of 2026-11-02 (Dev), AP2494_010 re-capture F-2: the cancelled warranty APOP01-663 is still listed on archived quote 6041. | — |
| Q-009 | What does the list show when the search matches nothing, and how does the dealer clear the search? | REQ-003, REQ-004, REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: "No entities found", "empty search result", "clear search") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_017 steps 2 and 4: no table and the text "No entities found" (HTTP 200); there is no clear control — submitting an empty box restores the full list. | — |
| Q-010 | Where does a dealer set a quote's name today, given the list shows no quote name? | REQ-003 | Judgement | Answered | "As a dealer user, I want the new-quote vehicle form at /quote/new/edit-vehicle to show only Quote name, VIN, Brand, Model and Year, with Brand, Model and Year as the only required fields, so that I can create a quote without friction." — AP-2477 description; and its AC: "Only these five fields are shown, in this order: Quote name — at the top of the form, above the VIN field" (AP-2477, Story, status QC; it overrides no AC of AP-2494). Searched: "quote name". Matches AP2494_013 step 1 (quote 6482). | — |
| Q-011 | Does the search look only in the tab being viewed, or across both tabs, and does it keep paging? | REQ-003, REQ-004, REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: "search pagination", "archived quotes", "active archived tab") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_018 steps 2–3 and AP2494_016 step 2: the search covers only the tab being viewed (an active quote is not found from Archived); page links keep the keyword (`?quote_search[keyword]=…&page=N`), newest first. | — |
| Q-012 | Are the client-name, email and VIN searches also partial and case-insensitive, as stated for the quote name? | REQ-004, REQ-005 | Judgement | Accepted | No Story/Task defines it for the quote list (searched: "case insensitive search", "search partial", "VIN partial", "search first name last name email"). Hits AP-2435 and AP-2433 define matching for the admin warranty-search API, a different feature, so they do not define it — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_015 steps 2–3 and AP2494_016 step 4: `ysolde` and `brakw` find quote 6483, `stage.960@yopmail` finds it, and `1fahp35nx8w239204` returns the same 43 quotes as the upper-case VIN — partial and case-insensitive. | — |
| Q-013 | Should the reversed full name `last first` also match? | REQ-004 | Info | Accepted | No Story/Task defines it (searched: "full name client search", "search first name last name email") — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_015 step 3: `Brakwater-960 Ysolde` lists quote 6483. | — |
| Q-014 | Is the search limited to the logged-in dealer's own quotes? | REQ-004 | Judgement | Accepted | No Story/Task defines it for the quote list (searched: "dealer own quotes", "other dealer quotes"). Hit AP-2443 sets who sees which contracts on the Permaplate contracts list, a different page, so it does not define it — current actual result accepted. Observed in the execution log of 2026-11-02 (Dev), AP2494_019 steps 3–5: searching another dealership's client (`Nguyen`) and VIN returns "No entities found". | — |
| Q-015 | AC 9 reads "Given a quote with a partial VIN". Does it mean the dealer searches part of the quote's VIN? | REQ-005 | Info | Open | Not a knowledge question: it asks what the author meant by the ticket's own wording, which no other ticket can settle and the actual result must not choose. Stays Open for the author (Nicolas-Eric Tain). For the record: a search on part of a VIN (`8W239204`) lists the quote (AP2494_016 step 2). | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-002 | A generated contract of every type (warranty, roadside, GAP, creditor, Permaplate, sale) is needed; GAP has no mapped quote stage | High | Open |
| REQ-003 | A quote with a known name may not be creatable on staging (AP-2477 not deployed as of 2026-10-12) | High | Closed — Q-010 Answered (AP-2477); named quote 6482 created on Dev |
| REQ-001 | Position of the old "Produits" column not stated | Medium | Accepted (Q-005) |
| REQ-002 | Representation of non-Permaplate/non-sale contracts not stated | Medium | Accepted (Q-001) |
| REQ-004 | Partial / case-insensitive match on client details not stated | Medium | Accepted (Q-012) |
| REQ-004 | Dealer isolation of search results not stated | Medium | Accepted (Q-014) |
| REQ-001 | French header label not stated | Low | Open (Q-006, author intent) |
| REQ-003 | Search controls and no-result display not stated | Low | Accepted (Q-007, Q-009) |

---

## Knowledge Lookup Log — 2026-11-15

_Step 3c of the analyst skill, run on every question that was Open on 2026-11-15, at the
user's instruction "double check all tickets' question". Query form (Jira adapter):
`issuetype in (Story, Task) AND text ~ "<words>"`, any status. A hit **defines** the
knowledge only when one of its sentences states the value, rule or workflow; plausible hits
were read in full (description, acceptance criteria field and comments). Observed values
come from the latest execution log, `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md` (Dev). Nothing was posted to Jira._

| Q | Word sets tried | Plausible hits read | Defining sentence? | Result |
|---|---|---|---|---|
| Q-001 | "Contracts column" · "quote list contracts" · "contract number link" | AP-2503, AP-2504, AP-2505, AP-2506, AP-2431, AP-2443, AP-2535, AP-2543 | No — the hits cover generating contracts and the contract number on the quote **details** page, not the `/quotes` cell | Accepted |
| Q-002 | "contracts one per line" · "multiple contracts quote" · "quote list contracts" | (as Q-001) | No | Accepted |
| Q-003 | "finalized contract" · "sales contract save" · "sale contract number quote" | AP-2493, AP-2496, AP-2422 | Yes — AP-2493 description ("not finalized — that is, while it has no generated contract"); AP-2496 and AP-2422 use "finalized" without defining it | Answered (AP-2493 + capture AC 3, AC 4) |
| Q-004 | "quote archived tab" · "quotes created archived" · "archived quotes" · "active archived tab" · "archive quote list" | AP-2496, AP-2493, AP-2422 | No | Accepted |
| Q-005 | "Produits column" · "quote list columns" | AP-2477, AP-2503, AP-2505 | No (only AP-2494 mentions "Produits") | Accepted |
| Q-006 | "Contrats" · "French translation quote list" | AP-2057 | No | Open — reading of the ticket's own text |
| Q-007 | "quote search" · "keyword search" · "search modal" · "search button" | AP-2436, AP-2446, AP-2435, AP-2433 | No — none is about the `/quotes` search | Accepted |
| Q-008 | "cancelled contract list" · "cancelled warranty quote" | AP-2536, AP-2535, AP-2543, AP-2493 | No — AP-2535 / AP-2543 define the cancelled display on the quote **details** page only, and do not redesign `/quotes` | Accepted |
| Q-009 | "No entities found" · "empty search result" · "clear search" | AP-2443 | No | Accepted |
| Q-010 | "quote name" | AP-2477, AP-2533 | Yes — AP-2477 description and AC | Answered (AP-2477) |
| Q-011 | "search pagination" · "archived quotes" · "active archived tab" | (as Q-004) | No | Accepted |
| Q-012 | "case insensitive search" · "search partial" · "VIN partial" · "search first name last name email" | AP-2435, AP-2433 | No — they define the admin warranty-search API, a different feature | Accepted |
| Q-013 | "full name client search" · "search first name last name email" | AP-2436 | No | Accepted |
| Q-014 | "dealer own quotes" · "other dealer quotes" | AP-2443, AP-2477 | No — AP-2443's visibility rule is for the Permaplate contracts list, not `/quotes` | Accepted |
| Q-015 | — (not a knowledge question) | — | — | Open — author intent |

No Story used in an answer overrides an acceptance criterion of AP-2494, so the status of the
answering Story (AP-2493 and AP-2477 are both in QC) does not limit it.

**Effect on testing (for the next design pass):** the Accepted questions make the observed
value the expected result. Test steps that only *record* those values (for example
AP2494_003 for the French header — still Open, so it stays record-only — and AP2494_018
step 4 for Q-009/Q-011) should become *record-and-accept* steps for the Accepted
questions. The AP2494_010 FAIL (AP-2517) is unchanged: AC 4 states the sale result.

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design

# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → Roadside Protection → "Generate Contract" page `/quote/{quoteId}/road-side-protection-create-contract` (Jira AP-2505)
**Date:** 2026-11-03 · **Updated:** 2026-11-15 (knowledge lookup, SKILL.md Steps 3b–3c — see *Knowledge lookup — 2026-11-15* below the Open Questions)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2505-generate-contract-for-a-quotes-roadside.md`
**Total requirements found:** 4

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/admin-portal.md, qa-artifacts/base-test/navigation-map.md

---

## Executive Summary

AP-2505 changes the screen a dealer uses to turn the **Roadside Protection** product on a
quote into a contract. Roadside Protection is sold through an outside provider called
*AutoShield*, and the product row on the quote is the "Roadside Protection" row of the
"Summary of products" card (`domain`, quote-creation.md). The story asks that the row's
"Generate Contract" action **match the Esthetic protection contract page**: open a
**dedicated page** — a full page, not a *modal* (a pop-up window drawn over the quote page)
— holding a two-column card with the vehicle and owner details, the financing details, the
Program Summary and the "Generate Contract" button. The address
`/quote/{quoteId}/road-side-protection-create-contract` stays the same, and contract
creation, the invoice, the financing and the PDF must keep working as before.

Four requirements were extracted: the action opens the dedicated page in the same tab, at
the unchanged address (REQ-001); the page is laid out in two columns with named sections
(REQ-002); the vehicle, client and financing values are pre-filled from the quote and the
financing is read-only (REQ-003); and submitting valid values creates the contract through
the existing process (REQ-004).

**One question blocks part of the testing (Q-001).** The description puts "vehicle and
owner information on the left", but the second acceptance criterion puts "Vehicle
identification" in the **right** column, next to the Program Summary, and puts "Owner
information" and "Financing information" on the left. The two statements contradict each
other on which column holds the vehicle section, so that one point cannot be judged until
the author answers. Every other point of the layout is stated the same way in both places
(owner on the left, Program Summary and the button on the right) or only once (financing on
the left), so the rest of the page can still be tested. Nine Judgement questions remain —
among them why the first criterion starts from "a quote with a GAP insurance quote", what
the Program Summary lists for a roadside product, which "financing values" are meant, and
what the dealer sees after submitting — plus two Info questions.

Three testability risks are rated High. First, on the Dev environment (where this ticket
will be executed) opening this very address returned an HTTP 500 server-error page on
2026-11-02 (bug **AP-2518**, High, open), and the roadside product form has no contract
fields and no contract button (bug **AP-2508**, High, open). If AP-2518 still occurs, the
step that opens the page is the step under test and fails; every other case that needs the
page open is BLOCKED by it. Second, "the current process" after submit has no recorded
baseline on Dev — no roadside contract has ever been generated there by QA — so only the
outcomes the knowledge sources already describe (an AutoShield contract id, the contract
details page, the dealer's Road Side Protection contract list) can be judged. Third,
creating a roadside contract calls AutoShield, an outside service: it may refuse a test
VIN, and the shared test vehicle 915 already has two AutoShield contracts for its VIN
(2697, 2698).

The ticket is in status **QC** (ready for testing) with one development branch and no pull
request shown on the ticket. Overall testability is rated **MEDIUM**: the page, its
sections and the pre-fill are easy to observe, but the layout criterion contradicts the
description on one point, the post-submit behaviour has no Dev baseline, and the page
itself has a known server error on Dev.

---

## Requirements Detail

### REQ-001 — "Generate Contract" for Roadside Protection opens a dedicated page in the same tab at the unchanged address

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Roadside Protection "Generate Contract" action to open its own page instead of a modal, so that I can review the contract details on a full page as I do for Esthetic protection. *(Inferred — the ticket has no user story.)* |
| **Priority** | High — it is the entry point to the whole change; if the action still opens a modal, fails, or the address changes, nothing else in the story is reachable as specified. |
| **Source File** | AP-2505-generate-contract-for-a-quotes-roadside.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. "The “Generate Contract” action for Roadside Protection product on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" (description).
2. "The route /quote/{quoteId}/road-side-protection-create-contract ( quote-insurance-create-contract ) stays the same." (description).
3. "Given a quote with a GAP insurance quote and no contract, when the dealer chooses “Generate Contract” from the Roadside protectection row actions, then /quote/{quoteId}/road-side-protection-create-contract opens in the same tab with no modal." (AC 1) — its *when* and *then* clauses are clear; its *given* clause names a GAP insurance quote rather than a roadside product (Q-002).

**Out of Scope:**

- None stated. The internal route name in brackets (`quote-insurance-create-contract`) cannot be observed in the browser; only the address can (Q-011).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| On Dev, `/quote/{id}/road-side-protection-create-contract` returned HTTP 500 and the ⋯ menu's dialog stayed on "Loading..." on 2026-11-02 (AP-2518, High, open). If it still happens, the story's main result cannot be reached | High | The case that opens the page judges it at the step under test (a 500 there is a FAIL, compared with AP-2518 at Gate C). Every other case that needs the page open names AP-2518 in its precondition and is BLOCKED if the page does not load |
| AC 1 starts from "a quote with a GAP insurance quote", while the action is on the Roadside Protection row; whether a GAP quote is required, and whether the action works without one, is not stated | Medium | Q-002 (Judgement). Build the AC 1 quote literally — a GAP insurance quote **and** a roadside product, no contract — and record the behaviour on a quote with a roadside product and no GAP quote in a separate case |
| "Should match Esthetic Protection" names a model page but not the points of comparison beyond the named ones | Low | Q-003. Judge only the named points; record visible differences from the Esthetic protection contract page (mapped in `domain`) |
| The roadside product form on Dev has no contract fields and no contract button (AP-2508, High, open); a case whose setup needs the roadside product saved is blocked if it cannot be saved | Medium | Setup saves the product through the add-roadside-protection modal (Make/Model → Continue → tier → Policy Sale price → Save), mapped in `domain`; if that fails, the case is BLOCKED naming AP-2508 |

---

### REQ-002 — The page is a two-column card: owner and financing on the left, Program Summary and the "Generate Contract" button on the right; the vehicle section's column is contradicted

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the contract details grouped in two columns, so that I can check the client, financing, vehicle and program before generating the contract. *(Inferred.)* |
| **Priority** | Medium — a layout requirement; a wrong layout does not stop a contract from being created, but it is the visible point of the story. |
| **Source File** | AP-2505-generate-contract-for-a-quotes-roadside.md |
| **Recommended Test Types** | UI · Functional |

**Acceptance Criteria:**

1. "Given the page has loaded, when the dealer inspects it, then it shows the “Owner information”, “Financing information” in the left column, and “Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column." (AC 2)
2. "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The description puts the vehicle information on the left; AC 2 puts "Vehicle identification" on the right. The column of the vehicle section cannot be judged as written | High | Q-001 (Blocking). Judge the points both statements agree on in one case; keep the vehicle-column check in its own case, BLOCKED until the author answers |
| What the Program Summary lists for a roadside product (program, tier, term, dates, sale price, total) is not stated; the Esthetic protection page lists Program Term, Start Date, End date, the selected products and a Total | Medium | Q-004 (Judgement). Judge that a "Program Summary" section with the "Generate Contract" button is shown; record its lines without judging them |
| No statement on how the two columns behave at a narrow screen width | Low | Not raised as a question — the story names no width; judge at 1280 × 800 only |

---

### REQ-003 — Vehicle, client and financing values are pre-filled from the quote, and the financing is read-only

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form filled from the quote and the financing locked, so that I do not retype the client and vehicle details and cannot change the financing on the contract. *(Inferred.)* |
| **Priority** | High — a wrong VIN, client name or financing company would produce a contract for the wrong vehicle, person or lender. |
| **Source File** | AP-2505-generate-contract-for-a-quotes-roadside.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "Given the quote has a vehicle, a client, or a financing, when the page renders, then vehicle client and financing values are pre-filled and financing is read-only" (AC 3)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The field list of each section is not given, so "pre-filled" can only be judged for values the test itself entered on the quote | Low | Compare each shown value with the value entered when the quote was built |
| "Financing values" may mean the financing company (as on the extended-warranty contract page) or the loan terms (amount, term, rate, payment) — not stated | Medium | Q-007 (Judgement). Judge every financing value the page shows against the quote's financing; record which ones it shows |
| Which vehicle and owner fields the dealer may edit is not stated (only the financing is said to be read-only) | Medium | Q-005 (Judgement). Record the editability of every vehicle and owner field |
| "a vehicle, a client, or a financing" — what the financing section shows, and whether a contract can be generated, when the quote has no financing is not stated | Medium | Q-006 (Judgement). Record the page on a quote without financing |

---

### REQ-004 — Submitting valid values creates the roadside contract through the existing process

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want submitting the page to create the Roadside Protection (AutoShield) contract as before, so that invoices, financing and the contract PDF are not affected. *(Inferred.)* |
| **Priority** | High — contract creation produces the legal document and the invoice; a regression here costs money and client trust. |
| **Source File** | AP-2505-generate-contract-for-a-quotes-roadside.md |
| **Recommended Test Types** | Functional · Regression · Negative |

**Acceptance Criteria:**

1. "Given valid form values, when the dealer submits, then contract is created following the current process." (AC 4)
2. "Contract creation, invoice, financing, and PDF behaviour stay unchanged." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "The current process" has no Dev baseline: no roadside contract has been generated on Dev by QA (AP-2518). `domain` records only the staging outcomes — contract details page `/quote/{quoteId}/auto-shield-contract/{contractId}` with en/fr PDF links, and the dealer list `/road-side-protection-contracts` | High | Q-009 (Judgement). Judge that a contract is created: an AutoShield contract id on the quote's Roadside row, a row on `/road-side-protection-contracts`, and a details page with a PDF link. Record the landing page, message and invoice without judging them |
| Contract creation calls AutoShield, an outside service. It may refuse a test VIN, or a VIN that already has a contract (vehicle 915 already has AutoShield contracts 2697 and 2698) | High | Q-010 (Judgement). Submit cases use a vehicle the case creates with its own VIN; an AutoShield refusal before the step under test is BLOCKED, not FAIL |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-008 (Judgement). Record the response to an emptied required owner field |
| Each generated contract is a permanent record on the shared dealer account (no `cleanup` source) | Medium | Create a fresh quote per submitting case; never reuse another ticket's quote or vehicle; list every id left behind |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged address | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Two-column layout | ✓ | | | | ✓ | | | |
| REQ-003 — Pre-fill and read-only financing | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Submit creates the contract | ✓ | ✓ | | ✓ | | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** dealer account 1380; inventory vehicle (a new one per submitting
case); quote; quote client; quote financing (financing company, amount, term, rate); GAP
insurance quote; Roadside Protection product (AutoShield tier and Policy Sale price);
AutoShield roadside contract; invoice; contract PDF.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | The description says "vehicle and owner information on the left", but AC 2 says "“Owner information”, “Financing information” in the left column, and “Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column". Which column should hold the "Vehicle identification" section? | REQ-002 | Blocking | Open | Not a knowledge question: the ticket's own text contradicts itself (description against AC 2), so neither a later Story nor the actual result may choose the column (Step 3b). Lookup run for context only (L4, L5): AP-2544 (Story, Deploy to staging, 2026-11-04) says "THEN the “Vehicle information” card is shown above the “Owner information”" — it names no column and is not used to choose. Still unanswered on AP-2505 (2026-11-15: 4 comments, all from the QA account). | Nicolas-Eric Tain |
| Q-002 | AC 1 starts from "a quote with a GAP insurance quote and no contract", while the action is on the Roadside Protection row. Must the quote carry a GAP insurance quote for the roadside "Generate Contract" action to be offered, or is "GAP insurance quote" meant to read "roadside protection product"? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: L10, L1; read AP-2504, AP-2506, AP-2559 — none states when the roadside "Generate Contract" action is offered) — current actual result accepted: on quote 6595 with no GAP quote, the Roadside ⋯ menu offers "Edit · Generate Contract · Delete" (execution log 2026-11-07, AP2505_002 step 3). This does not choose a reading of AC 1: AP2505_001 still builds AC 1 literally (GAP quote **and** roadside product), and both readings allow the action without a GAP quote. | Nicolas-Eric Tain |
| Q-003 | "Should match Esthetic Protection" — beyond the dedicated page and the named sections, on which points must the roadside page match the Esthetic protection contract page (heading, field list, read-only fields, Back link)? | REQ-001, REQ-002 | Judgement | Answered | The field lists and read-only rules of the shared sections are defined for every product, Roadside Protection included, by AP-2544, AP-2545 and AP-2546 (Stories, Deploy to staging, the same "check out" page). AP-2544: "THEN the “Vehicule information” card is presented in a form view styled like the “Owner information” card. All inputs are read-only except for the VIN input. Display the input from the form in /vehicle/{vehicleId}/edit (do not include “Manufacturer warranty” section)." AP-2545: "THEN the “Owner information” card show the same input from /quote/{quoteId}/client. The Indian status certificate, Drivers license, and the 2 checkboxes are not shown." AP-2546: see Q-007. Page heading and Back link: no Story/Task defines them (searched: L18, L5, L6) — current actual result accepted: heading "Road Side protection program", "Back" → `/quote/{quoteId}/details` (AP2505_003 step 4, 2026-11-07). | Nicolas-Eric Tain |
| Q-004 | What should the Program Summary list for a roadside product — program name, tier, term, start date, end date, Policy Sale price, total? | REQ-002 | Judgement | Answered | AP-2544 (Story, Deploy to staging), roadside exception: "The roadside protection requires the VIN and the “In service date” when generating the contract. The Purchase date and Delivery date inputs are move to the “Product Summary”." Searched: L6, L7. No Story/Task defines the other lines (AP-2506 lists the Esthetic page's summary only; AP-2550, In Progress, says "For each program, all specific field for the contract are shown in the “Product summary”" without naming them) — current actual result accepted for them: Road Side Protection Option (tier text), Delivery date, Purchase date, Policy Sale price, Purchase type, Financed amount, Interest rate, Financing company, Stock number, In service date (AP2505_003 step 4, 2026-11-07). The heading stays as AC 2 states it ("Program Summary"); the AC wins. | Nicolas-Eric Tain |
| Q-005 | Which vehicle and owner fields may the dealer edit on this page, and which are read-only? | REQ-003 | Judgement | Answered | Vehicle — AP-2544 (Story, Deploy to staging): "All inputs are read-only except for the VIN input." and, for Roadside Protection, "The roadside protection requires the VIN and the “In service date” when generating the contract." Owner — AP-2545 (Story, Deploy to staging): "THEN the “Owner information” card show the same input from /quote/{quoteId}/client." and "WHEN a dealer generates a contract and is succesfull. THEN it update the quote’s client information"; AP-2550 (Story, In Progress): "The Owner and Co-owner information can always be updated." Searched: L5, L19, L20. Recorded on 2026-11-07 (AP2505_005 step 3): every vehicle and owner input was editable — this differs from AP-2544 for the vehicle inputs other than VIN (see the lookup notes). | Nicolas-Eric Tain |
| Q-006 | AC 3 says "a vehicle, a client, or a financing". When the quote has no financing, what does the "Financing information" section show, and can the contract still be generated? | REQ-003, REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: L11, L9; read AP-2546, AP-2559, AP-2225 — AP-2546 covers the pre-filled financing form, AP-2559 hides the card on a quote "without a GAP/Creditor insurance", and AP-2225 still has its own open question on a quote with no financing company) — current actual result accepted: no "Financing information" section; Purchase type "CASH", and Financed amount, Interest rate and Financing company ("Choose") empty, editable and not required, inside "Product Summary"; "Generate Contract" enabled (quote 6596, AP2505_006 steps 4–5, 2026-11-07). Whether the contract is created on such a quote: recorded at execution (it was not submitted). | Nicolas-Eric Tain |
| Q-007 | Which "financing values" are meant — the financing company (name, address, phone), the loan terms (amount, term, rate, payment), or both — and does "read-only" cover all of them? | REQ-003 | Judgement | Answered | AP-2546 (Story, Deploy to staging, same page), "Exceptions for Roadside protection product": "The roadside protection, use the current financing form and prefill the fields. All fields are required and read-only except the “Financing company”. Only save the financing company in road_side_protection_program" Searched: L8, L9. The values are therefore the fields of the current financing form, pre-filled. On "read-only", AP-2505 AC 3 says "financing is read-only" with no exception; in this ticket the AC wins, and AP-2546's later exception for "Financing company" is reported as a conflict between the two stories, not used to change AP-2505's expected result. | Nicolas-Eric Tain |
| Q-008 | What are "valid form values"? Which fields are required, and what does the page show when one is emptied before submit? | REQ-004 | Judgement | Answered | AP-2544: "The roadside protection requires the VIN and the “In service date” when generating the contract." AP-2546 (financing form): "All fields are required and read-only except the “Financing company”." Searched: L12, L8. No Story/Task defines the rest — current actual result accepted: Stock number and the owner's Last name are also required; the server re-renders the page with "This value should not be blank." under each empty field, with no error page (AP2505_009 step 3 and AP2505_007 first pass, 2026-11-07); a pre-filled Home phone without dashes is refused with the `###-###-####` message (AP2505_007 round 1). On a quote without financing the financing inputs were not marked required (AP2505_006). | Nicolas-Eric Tain |
| Q-009 | What does "the current process" produce after submit — which page the dealer lands on, which message, whether an invoice is created, and where the AutoShield contract PDF is offered? | REQ-004 | Judgement | Accepted | No Story/Task defines it for this page with certainty (searched: L14, L15, L21; read AP-2225, AP-2551, AP-2562, AP-2431). The sentences found disagree: AP-2225 (2025, still in QC with 12 open questions — weak evidence): "The user is redirected to the autoShield contract page"; AP-2551 and AP-2562 (2026-11, Deploy to staging, the all-contracts checkout, roadside not named): "THEN all the contract will be generated and the dealer will be redirected to the quote’s details page." / "Then it will create the contracts and redirects to the quote detail". None states the message or the invoice — current actual result accepted: the dealer lands on `/quote/{quoteId}/details` with "The Roadside protection coverage has been saved successfully"; the Roadside row shows "Contract #<id>" (link to `/quote/{quoteId}/auto-shield-contract/{contractId}`, which offers en/fr PDF links) and a download icon; **no invoice** is created (top of `/invoice/all` still 944) (AP2505_007 round 3 and AP2505_008, 2026-11-07). | Nicolas-Eric Tain |
| Q-010 | AC 1 starts from a quote with "no contract". On a quote whose roadside contract already exists, or for a VIN that already has an AutoShield contract, is "Generate Contract" still offered, and what does the address show if opened directly? | REQ-001, REQ-004 | Judgement | Accepted | No Story/Task defines it (searched: L13, L22; read AP-2431, AP-2493 — AP-2493 says only "Finalized products keep their existing download action and are out of scope for cancellation here.") — current actual result accepted: once contract 2782 exists, the Roadside row has no ⋯ menu and no "Generate Contract", only "Contract #2782" and a PDF download icon; the typed address answers 302 → `/quote/6597/auto-shield-contract/2782`, with no message and no second contract (AP2505_010, 2026-11-07). A second quote on a VIN that already has a contract: recorded at execution (not run). | Nicolas-Eric Tain |
| Q-011 | The description gives the route name "quote-insurance-create-contract", which reads like the creditor-insurance route. Is that the roadside route's internal name? (Not observable in the browser.) | REQ-001 | Info | Answered | AP-2504 (Story, QC — a sibling story; its own open question is about AC 1's row, not the route): "The route /quote/{quoteId}/insurance/create-contract/{type} (quote-insurance-create-contract) stays the same." Searched: L16, L17. The name belongs to the GAP/Creditor insurance route; it changes no result in this ticket. | Nicolas-Eric Tain |
| Q-012 | Does this change also fix AP-2518 (the HTTP 500 on this address on Dev, 2026-11-02), or is that fix expected separately? | REQ-001 – REQ-004 | Info | Open | Not a knowledge question (it asks about another ticket's fix plan); no lookup run. For the record: AP-2518's symptom did not reproduce on Dev on 2026-11-07 (comment 19512 on AP-2518). | Nicolas-Eric Tain |

---

## Knowledge lookup — 2026-11-15

Run under SKILL.md Steps 3b–3c at the user's instruction of 2026-11-15 (batch qa-agent:
"double check all tickets' question"). Every question that was `Open` was re-checked.
Nothing was posted to Jira. AP-2505 itself has not changed since 2026-11-08 (status QC,
4 comments, all from the QA account — none answers a question).

**Queries tried.** Each is `issuetype in (Story, Task) AND text ~ "<words>"` on project AP,
any status — the adapter's *knowledge lookup* query.

| # | Words | Plausible hits read |
|---|---|---|
| L1 | roadside generate contract | AP-2544, AP-2545, AP-2546 (AP-2537 title only — refund) |
| L2 | road side protection contract | AP-2225, AP-2431 |
| L3 | AutoShield contract | AP-2225, AP-2431 (AP-2543, AP-2237 titles only — void/cancel) |
| L4 | vehicle identification owner information column | AP-2503, AP-2504, AP-2506 |
| L5 | check out page contract | AP-2544, AP-2545, AP-2546, AP-2559, AP-2562 |
| L6 | Program Summary contract | AP-2506, AP-2550 |
| L7 | Product Summary roadside | AP-2544, AP-2498 |
| L8 | financing information read-only | AP-2546 |
| L9 | financing company roadside | AP-2546 |
| L10 | generate contract GAP insurance | AP-2504, AP-2559 |
| L11 | contract without financing | AP-2225, AP-2559 |
| L12 | In service date required | AP-2544 |
| L13 | contract already exists generate | none plausible (AP-2504, AP-2428, AP-2446 — other products) |
| L14 | autoshield contract page PDF | AP-2225, AP-2431 |
| L15 | roadside invoice | none (AP-670 — unrelated) |
| L16 | quote-insurance-create-contract | AP-2504 |
| L17 | road-side-protection-create-contract | AP-2225, AP-2431 (AP-2424 title only) |
| L18 | Esthetic protection contract page | AP-2506 |
| L19 | owner information client update contract | AP-2545 |
| L20 | vehicle information read-only VIN | AP-2544 |
| L21 | generate contract redirect quote detail | AP-2551, AP-2562 |
| L22 | roadside contract details existing | AP-2431, AP-2493 |

**Per question:** Q-001 — L4, L5 (context only; a contradiction stays Open) · Q-002 — L10, L1
· Q-003 — L18, L5, L6 · Q-004 — L6, L7 · Q-005 — L5, L19, L20 · Q-006 — L11, L9 · Q-007 —
L8, L9 · Q-008 — L12, L8 · Q-009 — L14, L15, L21 · Q-010 — L13, L22 · Q-011 — L16, L17 ·
Q-012 — not run (not a knowledge question).

**Result:** Q-001 stays Blocking and `Open` (the ticket contradicts itself). Six questions
are `Answered` by a Story: Q-003, Q-004, Q-005, Q-007 and Q-008 from AP-2544, AP-2545 and
AP-2546, and Q-011 from AP-2504. Four are `Accepted`: Q-002, Q-006, Q-009 and Q-010.
Q-012 (Info) stays `Open` because it is not a knowledge question. No test case becomes
runnable: AP2505_004 stays BLOCKED by Q-001.

**Notes for the next design pass (not acted on here):**
- AP-2544, AP-2545 and AP-2546 (created 2026-11-04, Deploy to staging) change the same
  page for every product. Where they differ from AP-2505's own text, the AC wins in this
  ticket. AC 2 names "Program Summary", while AP-2544 and AP-2550 say "Product Summary".
  AC 3 says "financing is read-only", while AP-2546 exempts "Financing company". Both
  points touch the open bugs AP-2553 (AC 2 headings) and AP-2554 (AC 3), which were not
  touched.
- The answers to Q-005 and Q-008 give expected results that the current cases only
  record. On 2026-11-07 the vehicle inputs other than VIN were editable (AP-2544 says
  read-only), the owner section showed Drivers license (AP-2545 says not shown), and the
  financing inputs were not required on a quote without financing (AP-2546 says "All
  fields are required"). Judging them needs a design change. Whether AP-2544–AP-2546 are
  in AP-2505's scope is the orchestrator's decision.
- AP-2559 (created 2026-11-09) hides the "Financing information" card on a quote "without
  a GAP/Creditor insurance". On such a roadside quote this would conflict with AC 2's
  left-column "Financing information". Recorded only.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-002 | Description and AC 2 contradict on the column of "Vehicle identification" (Q-001, Blocking) | High | Open |
| REQ-001 | Known HTTP 500 on this address on Dev (AP-2518, High, open) | High | Open |
| REQ-004 | "Current process" has no Dev baseline (Q-009) | High | Open |
| REQ-004 | AutoShield outside service may refuse a test or duplicate VIN (Q-010) | High | Open |
| REQ-001 | Roadside product form lacks contract fields and button (AP-2508, High, open) — setup risk | Medium | Open |
| REQ-001 | AC 1 starts from a GAP insurance quote, not a roadside product (Q-002) | Medium | Open |
| REQ-002 | Program Summary content for roadside not stated (Q-004) | Medium | Open |
| REQ-003 | Editable fields, financing values and the no-financing case not stated (Q-005 – Q-007) | Medium | Open |
| REQ-004 | Invalid values and their handling not stated (Q-008) | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — one Blocking question (Q-001) is open on REQ-002 only; the other requirements can proceed (Gate A rule A2). Re-checked 2026-11-15 by the knowledge lookup: Q-001 still Blocking and Open, Q-012 (Info) Open; every other question Answered or Accepted

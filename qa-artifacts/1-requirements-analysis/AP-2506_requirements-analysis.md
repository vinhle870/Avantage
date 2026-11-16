# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → Esthetic protection → "Generate Contract" page `/quote/{quoteId}/permaplate-create-contract` (Jira AP-2506)
**Date:** 2026-11-01 · **Re-checked:** 2026-11-15 (Step 3c knowledge lookup on every Open question — see *Knowledge lookup — 2026-11-15*; no Jira change, nothing posted)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md` (including its section *Ticket changes since capture — 2026-11-15*); observed values from `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2506_2026-11-08.md`
**Total requirements found:** 5

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/qa-docs/chubb-insurance.md, qa-artifacts/base-test/navigation-map.md

---

## Executive Summary

AP-2506 changes the screen a dealer uses to turn the **Esthetic protection** product on a
quote into a contract. Esthetic protection is the product the system still calls
*Permaplate* in its addresses (`domain`, quote-creation.md: "The Permaplate program is now
labelled 'Esthetic protection' in the EN UI … routes … still say `permaplate`"). The story
asks that the "Generate Contract" action open a **dedicated page** — a full page, not a
*modal* (a pop-up window drawn over the quote page) — holding a two-column card: vehicle
and owner information on the left, the Program Summary and the "Generate Contract" button
on the right. The address `/quote/{quoteId}/permaplate-create-contract` and its internal
route name `quote-permaplate-create-contract` stay the same, and contract creation, the
invoice, the financing and the PDF must keep working exactly as before.

Five requirements were extracted: the action opens the dedicated page in the same tab, at
the unchanged address (REQ-001); the page is laid out in two columns with named sections
(REQ-002); the Program Summary lists the program term, start date, end date, the selected
protection products and a total (REQ-003); the vehicle and owner values are pre-filled
from the quote (REQ-004); and submitting valid values creates the contract through the
existing process (REQ-005).

**One question blocks part of the testing (Q-001).** The description is about the
*Esthetic protection* action, but the first acceptance criterion starts from "a quote with
an extended warranty quote" and has the dealer choose "Generate Contract" from "the
Extended Warranty row actions" — while the address it then expects is the Esthetic
protection address. The two statements contradict each other about which action is under
test, so the criterion as written cannot be judged until the author says which row it
means. The description's own sentence about the Esthetic protection action is clear, so
the dedicated page itself can still be tested from the Esthetic protection row. Nine
Judgement questions remain — among them what "should match Esthetic Protection" compares
against (the description names the same product on both sides), what the "Total" is, how
the end date is worked out, and what the dealer sees after submitting — plus two Info
questions.

Two testability risks are rated High. First, the "current process" after submit has no
recorded baseline in the knowledge sources: the only evidence is in earlier tickets
(AP-2446, AP-2459), not in `domain`. Second, earlier testing found that leaving the
"Financing company" field on "Choose" makes contract generation return an HTTP 500
server error (AP-2459, still in status QA); a test that submits must name the financing
company it uses so that a failure can be traced. The ticket is also in status **QA**,
which this project does not treat as ready for testing, and no pull request is linked, so
the change may not be on the test environment yet.

> **Update 2026-11-15 — knowledge lookup.** Jira Story and Task tickets were searched for a
> sentence that settles each open question (queries in *Knowledge lookup — 2026-11-15*).
> Four questions are now `Answered` by quoted sentences: Q-003 (the "Financing information"
> card — AP-2546, AP-2559), Q-004 (the start date — AP-2428), Q-007 (which fields the dealer
> may edit — AP-2544, AP-2545) and Q-009 (what submitting produces — AP-2428, AP-2446). Five
> are `Accepted`: no Story or Task defines them, so the build's current actual result, as
> recorded on Dev on 2026-11-08, is the expected result (Q-005, Q-006, Q-008, Q-010, Q-011).
> **Q-001 stays Blocking and Open.** It is a contradiction inside this ticket's own text
> (AC 1 names the Extended Warranty row and an extended-warranty quote but expects the
> Esthetic protection address; the description names the Esthetic protection action), not
> a gap in product knowledge. The lookup found no sentence that settles it — the sibling
> stories AP-2503, AP-2504 and AP-2505 carry the same copied description, and AP-2504's
> analysis of 2026-11-15 kept its identical question Blocking and Open — and no delivered
> Story explicitly redesigns this entry point. The build's behaviour is never used to choose
> between the two readings. **Q-002** (the description says the Esthetic protection action
> "should match Esthetic Protection", naming itself) and **Q-012** (whether the change is
> deployed) are not product knowledge and stay Open. The acceptance criteria still win where
> they state a result: the headings named in AC 2 (bug AP-2555) and the pre-fill of AC 3
> (bug AP-2556) are not changed by this lookup.

Overall testability is rated **MEDIUM**: the page, its sections and the pre-fill are easy
to observe, but the entry criterion contradicts the description and the post-submit
behaviour has no documented baseline.

---

## Requirements Detail

### REQ-001 — "Generate Contract" for Esthetic protection opens a dedicated page in the same tab at the unchanged address

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Esthetic protection "Generate Contract" action to open its own page instead of a modal, so that I can review the contract details on a full page. *(Inferred — the ticket has no user story.)* |
| **Priority** | High — it is the entry point to the whole change; if the action still opens a modal or the address changes, nothing else in the story is reachable as specified. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. "The “Generate Contract” action for Esthetic protection on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" (description).
2. "The route `/quote/{quoteId}/permaplate-create-contract` (`quote-permaplate-create-contract`) stays the same." (description).
3. "Given a quote with an extended warranty quote and no contract, when the dealer chooses “Generate Contract” from the Extended Warranty row actions, then `/quote/{quoteId}/permaplate-create-contract` opens in the same tab with no modal." (AC 1) — its *then* clause is clear; its *given* and *when* clauses contradict criterion 1 (Q-001).

**Out of Scope:**

- None stated. The internal route name `quote-permaplate-create-contract` cannot be observed in the browser; only the address can.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| AC 1 names the Extended Warranty row and an extended-warranty quote as the starting point, but expects the Esthetic protection address; the description names the Esthetic protection action. The criterion cannot be judged as written | High | Q-001 (Blocking). Test the description's statement from the Esthetic protection row; keep the AC 1 case BLOCKED until the author answers |
| "Should match Esthetic Protection" compares the Esthetic protection action with itself, so nothing beyond the named points can be judged | Low | Q-002 — still Open 2026-11-15 (the ticket's own text names itself; not product knowledge). Judge only the named points; record visible differences |
| The location and label of the Esthetic protection row's actions on the quote page are not mapped in `domain` | Medium | Q-011 — Accepted 2026-11-15: the "Generate Contract" item of the Esthetic protection row's ⋯ menu (Edit · Generate Contract · Delete), recorded on Dev 2026-11-08 |
| The ticket is in status QA (not QC) and has no linked pull request; the change may not be deployed | Medium | Q-012 — still Open 2026-11-15 (deployment state, not product knowledge). The QA had the ticket executed on Dev on 2026-11-08, where the dedicated page is served |

---

### REQ-002 — The page is a two-column card: vehicle and owner on the left, Program Summary and the submit button on the right

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the vehicle and owner details on one side and the program summary and button on the other, so that I can check everything before generating the contract. *(Inferred.)* |
| **Priority** | Medium — a layout requirement; a wrong layout does not stop a contract from being created, but it is the visible point of the story. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | UI · Functional |

**Acceptance Criteria:**

1. "Given the page has loaded, when the dealer inspects it, then it shows the “Vehicle identification” and “Owner information” in a left column, and “Program Summary” and a submit button in a right column." (AC 2)
2. "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story says "financing … behaviour stay[s] unchanged" but does not place any financing field on the new page | Medium | Q-003 — Answered 2026-11-15 by AP-2546 and AP-2559 (on a quote without GAP/Creditor insurance the "Financing information" card is not visible); the "Financing company" choice in the right-column summary is the accepted current result |
| No statement on how the two columns behave at a narrow screen width | Low | Not raised as a question — the story names no width; judge at 1280 × 800 only |

---

### REQ-003 — The Program Summary lists the program term, start date, end date, selected protection products and a total

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Program Summary to show the term, the coverage period, the products chosen and the total, so that I can confirm the contract terms. *(Inferred.)* |
| **Priority** | High — these values go onto the contract the client signs. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "The “Program Summary” shows: Program Term · Start Date · End date · Selected protection products · Total" (AC 2).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The start date's default value, and whether the dealer may change it, are not stated | Medium | Q-004 — Answered 2026-11-15 by AP-2428: "Start Date (Same as delivery date)", "text display (no input)" |
| How the end date is worked out (start date plus the program term, or something else) is not stated | Medium | Q-005 — Accepted 2026-11-15: end date = start date + the program term (2026-11-08 → 2036-11-08 for "10 ans") |
| Which amount "Total" is — dealer cost, retail price, with or without tax — is not stated | Medium | Q-006 — Accepted 2026-11-15: Total = the quote's Esthetic protection Cost, without tax (CA$80.00) |

---

### REQ-004 — The vehicle and owner values are pre-filled from the quote

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form filled from the quote, so that I do not retype the client and vehicle details. *(Inferred.)* |
| **Priority** | High — a wrong VIN or client name would produce a contract for the wrong vehicle or person. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "Given the quote has a vehicle and a client, when the page renders, then vehicle and owner values are pre-filled." (AC 3)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The field list of each section is not given, so "pre-filled" can only be judged for values the test itself entered on the quote | Low | Compare each shown value with the value entered when the quote was built |
| Which fields are editable and which are read-only is not stated | Medium | Q-007 — Answered 2026-11-15 by AP-2544 (vehicle inputs read-only except the VIN) and AP-2545 (owner card shows the client form's inputs; a successful contract updates the client) |

---

### REQ-005 — Submitting valid values creates the contract through the existing process

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want submitting the page to create the Esthetic protection contract exactly as before, so that invoices, financing and the contract PDF are not affected. *(Inferred.)* |
| **Priority** | High — contract creation produces the legal document and the invoice; a regression here costs money and client trust. |
| **Source File** | AP-2506-generate-contract-for-a-quotes-esthetic.md |
| **Recommended Test Types** | Functional · Regression · Negative |

**Acceptance Criteria:**

1. "Given valid form values, when the dealer submits, then contract is created following the current process." (AC 4)
2. "Contract creation, invoice, financing, and PDF behaviour stay unchanged." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "The current process" and the "unchanged" invoice, financing and PDF behaviour have no baseline in `domain`; the only record is in earlier tickets (AP-2446, AP-2459) | High | Q-009 — Answered 2026-11-15 by AP-2428 (redirect to the quote details page, PDF download button) and AP-2446 (an invoice is created and an alert announces it). Judge a contract on `/permaplate-contracts` with a working PDF download |
| Leaving "Financing company" on "Choose" was found to return HTTP 500 (AP-2459, status QA). A submit test that leaves it empty would fail on that known defect, not on this story | High | Submit cases name the financing company they choose; the empty-company behaviour is recorded in its own case and traced to AP-2459 |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-008 — Accepted 2026-11-15: the server refuses an emptied required field with "This value should not be blank." at the field and creates nothing (VIN required per AP-2544) |
| What the action and the address do on a quote that already has a contract is not stated (AC 1 says "and no contract") | Medium | Q-010 — Accepted 2026-11-15: the action is withdrawn (no ⋯ menu; contract number link + PDF icon), and the address redirects silently to the quote page |
| Each generated contract is a permanent record on the shared dealer account (no `cleanup` source) | Medium | Create a fresh quote per submitting case from the test-data vehicle; never reuse another ticket's quote |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged address | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — Two-column layout | ✓ | | | | ✓ | | | |
| REQ-003 — Program Summary content | ✓ | | ✓ | | ✓ | | | |
| REQ-004 — Pre-fill of vehicle and owner | ✓ | | ✓ | | ✓ | | | |
| REQ-005 — Submit creates the contract | ✓ | ✓ | | ✓ | | | | |

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
| Q-001 | AC 1 starts from "a quote with an extended warranty quote" and has the dealer choose "Generate Contract" from "the Extended Warranty row actions", yet expects the Esthetic protection address `/quote/{quoteId}/permaplate-create-contract`; the description is about "the “Generate Contract” action for Esthetic protection". Which row's action should open this page — the Esthetic protection row, the Extended Warranty row, or both — and must the quote carry an extended warranty? | REQ-001 | Blocking | Open | Not product knowledge — the ticket's own text contradicts itself: AC 1's *given* and *when* clauses ("a quote with an extended warranty quote", "from the Extended Warranty row actions") against its own *then* clause (the Esthetic protection address `/quote/{quoteId}/permaplate-create-contract`) and against the description ("the “Generate Contract” action for Esthetic protection"). Lookup run 2026-11-15, nothing settles it (searched: `Generate Contract Extended Warranty row`; `Extended Warranty row Generate Contract permaplate`; `Generate Contract Esthetic protection`; `Generate Contract button quote` — read AP-2503 and AP-2551: AP-2503 (QC) is the extended-warranty page at its own address; AP-2551 (Deploy to staging) adds a quote-level "Generate Contract" button leading to a checkout page but names neither this row action nor this address, so it does not supersede AC 1). Asked on AP-2506 on 2026-11-01 and twice on 2026-11-08 (result comment 19521 and the screenshots comment), no answer. The actual result is not used to choose between the readings | Nicolas-Eric Tain |
| Q-002 | The description says the Esthetic protection action "should match Esthetic Protection" — it names the same product on both sides. Which page is the model to match (for example the extended-warranty contract page of AP-2503), and on which points beyond the named sections? | REQ-001, REQ-002 | Judgement | Open | Not product knowledge — the ticket's own description names the product it describes as the model ("The “Generate Contract” action for Esthetic protection on the dealer quote should match Esthetic Protection"), so which page is meant is a reading of the ticket's own text. Lookup run 2026-11-15 (searched: `should match Esthetic Protection` — read AP-2503, AP-2504, AP-2505, which repeat the sentence for their own products; AP-2503 names Esthetic Protection as the model for Extended Warranty). AP-2544, AP-2545 and AP-2546 (Deploy to staging) standardise the vehicle, owner and financing sections of every product's contract page, but list no other matching points | Nicolas-Eric Tain |
| Q-003 | The story says financing behaviour stays unchanged but places no financing field on the new page. Does the page still carry the "Financing company" choice, and in which column? | REQ-002 | Judgement | Answered | AP-2559 (Deploy to staging, same checkout page): "Given the dealer is checking-out a quote without a GAP/Creditor insurance When the checkout page is shown Then the “Financing information” card is not visible." — refining AP-2546 (Deploy to staging; "The change affects all quote products", Esthetic Protection included): "THEN the “Financing information” show a resume of the financing contract and the detailed content is collapsed." The Esthetic protection "Financing company" choice itself is named by no Story (searched: `financing company permaplate`; `financing information card`) — current actual result accepted for it: a required select (no "*" on its label) in the right column inside "Product Summary" (execution log 2026-11-08, AP2506_003 step 3, AP2506_008 step 3) | Nicolas-Eric Tain |
| Q-004 | What is the Program Summary "Start Date" by default (the vehicle delivery date, today, something else), and may the dealer change it on this page? | REQ-003 | Judgement | Answered | AP-2428 (Dealer Permaplate Contract, the form this page restyles), Program Summary: "Start Date (Same as delivery date)" — "text display (no input)". Matches the execution log 2026-11-08 (AP2506_004 steps 3–4: start 2026-11-08 = delivery date, plain text, no input) | Nicolas-Eric Tain |
| Q-005 | How is the "End date" worked out — start date plus the program term? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `end date program term`; `permaplate term end date` — read AP-2428, which says only "End date" "text display (no input)", and AP-1379, whose rule "End  = Warranty Start Date + Program term in months" is for the warranty contract PDF, another product) — current actual result accepted: end date = start date + the program term; "10 ans" from 2026-11-08 gives 2036-11-08 (execution log 2026-11-08, AP2506_004 step 3) | Nicolas-Eric Tain |
| Q-006 | Which amount is the "Total" — the dealer cost of the selected products, a retail price, before or after tax? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: `Total permaplate contract`; `permaplate cost price total` — read AP-2428, which lists Cost Price, Retails Price, Subtotal, Taxes and Grand Total but no "Total"; AP-2427; and AP-2456, which removes retail pricing from the quote form, the PDF and the invoice, not from this page) — current actual result accepted: "Total" = the quote's Esthetic protection Cost, without tax — CA$80.00 for a CA$80.00 Cost (execution log 2026-11-08, AP2506_004 step 3) | Nicolas-Eric Tain |
| Q-007 | Which vehicle and owner fields may the dealer edit on this page, and which are read-only? | REQ-004 | Judgement | Answered | AP-2544 (Deploy to staging, same page, all products): "THEN the “Vehicule information” card is presented in a form view styled like the “Owner information” card. All inputs are read-only except for the VIN input." AP-2545 (Deploy to staging): "THEN the “Owner information” card show the same input from /quote/{quoteId}/client." and "WHEN a dealer generates a contract and is succesfull. THEN it update the quote’s client information". Matches the execution log 2026-11-08 (AP2506_005: the VIN is the only editable vehicle field; every owner field is editable) | Nicolas-Eric Tain |
| Q-008 | What are "valid form values"? Which fields are required, and what does the page show when one is emptied before submit? | REQ-005 | Judgement | Accepted | No Story/Task lists the required fields or the message (searched: `required fields generate contract`; `required owner information` — read AP-2544: "a dealer provide the VIN (required) and In service date (optional)"; AP-2551: "GIVEN the dealer reviews the contract and does not fill the required fields WHEN the delear submits the contract THEN the error messages will be shown."; AP-2559 covers vehicle-card errors only) — current actual result accepted: the server refuses an emptied required field (POST 200, form shown again) with "This value should not be blank." at that field, keeps every other value and creates nothing; required on the owner card: First name, Last name, Address, City, Province, Postal code; "Financing company" left on "Choose" is refused the same way; the VIN is required per AP-2544 (execution log 2026-11-08, AP2506_005 step 4, AP2506_007, AP2506_008) | Nicolas-Eric Tain |
| Q-009 | What does "the current process" produce after submit — which page the dealer lands on, which message, whether an invoice is created and where the contract PDF is offered? | REQ-005 | Judgement | Answered | AP-2428: "When the user submits the form Then The user is redirected to the quote details page A download button is available to download the PDF". AP-2446 (Done): "When The dealer creates the permaplate contract Then A permaplate invoice is created An alert message is displayed to notify the user an invoice is created (Same way as a warranty contract invoice)". Matches the execution log 2026-11-08 (AP2506_006 step 3: redirect to `/quote/6693/details`, flash "Esthetic protection contract generated successfully" and "Invoice #946 ($80) is created", PDF icon on the row); the PDF HTTP 500 stays bug AP-2512 | Nicolas-Eric Tain |
| Q-010 | AC 1 starts from a quote with "no contract". On a quote whose Esthetic protection contract already exists, is "Generate Contract" still offered, and what does the address show if opened directly? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: `contract already created`; `contract already generated quote` — read AP-2493: "Finalized products keep their existing download action and are out of scope for cancellation here.", which covers the download only; and AP-2551, which hides the quote-level "Checkout" button once all contracts are generated) — current actual result accepted: the row's ⋯ menu and its "Generate Contract" are withdrawn (contract-number link and PDF icon remain), and the address returns 302 to the quote details page with no message (execution log 2026-11-08, AP2506_009 steps 2–3) | Nicolas-Eric Tain |
| Q-011 | Where on the quote page is the Esthetic protection row and its actions, and is the action labelled "Generate Contract"? | REQ-001 | Info | Accepted | No Story/Task defines the row control (searched: `row actions quote details`; `Generate Contract button quote` — read AP-2428: "There is a button to create the contract" on the quote page, with no place or label; AP-2493 names the row's cancel action only; AP-2551 adds a separate quote-level button) — current actual result accepted: the Esthetic protection row on `/quote/{id}/details` has a ⋯ menu with "Edit" · "Generate Contract" · "Delete"; "Generate Contract" opens the page in the same tab (execution log 2026-11-08, AP2506_001 step 3) | Nicolas-Eric Tain |
| Q-012 | AP-2506 is in status QA (this project's ready-for-testing status is QC) and links no pull request. Is the change deployed to v2staging? | REQ-001 – REQ-005 | Info | Open | Not product knowledge — deployment state, which no Story defines; the lookup was not run. Observed: Dev (v2dev) served the dedicated page on 2026-11-08 (execution log 2026-11-08); staging not checked. The ticket is still in status QA with no development link (re-read 2026-11-15) | Nicolas-Eric Tain |

---

## Knowledge lookup — 2026-11-15

Step 3c of the analyst skill, run on every question that was `Open`. Every query is
`issuetype in (Story, Task) AND text ~ "<words>"`, any status (the adapter's *knowledge
lookup* query). Hits are in brackets; AP-2506 itself is in most hit lists and is left out.
A later Story replaces this ticket's own acceptance criterion on a point only when it is
delivered (Deploy to staging or Done) and explicitly redesigns the same page; AP-2550 and
AP-2561 (In Progress) were read but not used.

| Q | Queries tried (hits) | Read | Defining sentence | Result |
|---|---|---|---|---|
| Q-001 | `Generate Contract Extended Warranty row` (AP-2504, AP-2503, AP-2498, AP-2494, AP-2493, AP-2491, AP-80) · `Extended Warranty row Generate Contract permaplate` (AP-2494, AP-2493, AP-2491) · `Generate Contract Esthetic protection` (AP-2546, AP-2545, AP-2544, AP-2505, AP-2504, AP-2503, AP-2501, AP-2496, AP-2493, AP-2491, AP-2428) · `Generate Contract button quote` (AP-2551, AP-2537, AP-2505, AP-2504, AP-2503, AP-2501, AP-2498, AP-2496, AP-2494, AP-2493, AP-2428, AP-2225, AP-2188, AP-2057) | AP-2503, AP-2551, AP-2428 | None. AP-2503 is the extended-warranty page at `/quote/{quoteId}/warranty/generate-contract`; AP-2551 (Deploy to staging) adds a quote-level button but names neither the row action nor this address. In any case the lookup cannot settle a contradiction in the ticket's own text | Open — Blocking; asked 2026-11-01 and 2026-11-08 |
| Q-002 | `should match Esthetic Protection` (AP-2505, AP-2504, AP-2503) | AP-2503, AP-2504 (analysis), AP-2544, AP-2545, AP-2546 | None — the sibling stories repeat the sentence for their own products | Open — not product knowledge (the ticket names itself as the model) |
| Q-003 | `financing information card` (AP-2559, AP-2505, AP-2504, AP-2503) · `financing company permaplate` (AP-2491, AP-2446) · `Esthetic protection contract` (AP-2546, AP-2545, AP-2544, AP-2536, AP-2535, AP-2505, AP-2504, AP-2503, AP-2501, AP-2496, AP-2493, AP-2491, AP-2428) | AP-2546, AP-2559, AP-2446 | AP-2559: "Given the dealer is checking-out a quote without a GAP/Creditor insurance When the checkout page is shown Then the “Financing information” card is not visible." (refines AP-2546) | Answered for the card; the "Financing company" select is the accepted current result |
| Q-004 | `start date delivery date permaplate` (AP-2428) · `Program Summary` (AP-2550, AP-2505, AP-2504, AP-2503, AP-2498, AP-2497, AP-2456, AP-2428, AP-1948, AP-214) | AP-2428, AP-2456, AP-2550 | AP-2428: "Start Date (Same as delivery date)" — "text display (no input)" | Answered |
| Q-005 | `end date program term` (AP-2504, AP-2428, AP-1379, AP-965) · `permaplate term end date` (AP-2428) | AP-2428, AP-1379 | None for Esthetic protection — AP-1379's "End  = Warranty Start Date + Program term in months" is the warranty contract PDF | Accepted — actual: start + term (2036-11-08) |
| Q-006 | `Total permaplate contract` (AP-2428, AP-2427) · `permaplate cost price total` (AP-2428, AP-2427) | AP-2428, AP-2427, AP-2456 | None — AP-2428 has no "Total" line; AP-2456 removes retail pricing elsewhere | Accepted — actual: CA$80.00 = Cost, no tax |
| Q-007 | `read-only VIN input` (AP-2544, AP-2477) · `owner information card` (AP-2550, AP-2545, AP-2544, AP-2505, AP-2504, AP-2503) | AP-2544, AP-2545, AP-2550 | AP-2544: "All inputs are read-only except for the VIN input."; AP-2545: "the “Owner information” card show the same input from /quote/{quoteId}/client" | Answered (later delivered Stories, same page) |
| Q-008 | `required fields generate contract` (AP-2551, AP-2550, AP-2546, AP-2505, AP-2504, AP-2503, AP-2498, AP-2491, AP-2446, AP-2428, AP-2225, AP-1969, AP-1960) · `required owner information` (AP-2550, AP-2544, AP-2505, AP-2504, AP-2503, AP-2379, AP-1960) | AP-2544, AP-2551, AP-2559, AP-2562 | Only the VIN ("a dealer provide the VIN (required)" — AP-2544) and that "the error messages will be shown" (AP-2551) | Accepted — actual: "This value should not be blank." at the field, nothing created |
| Q-009 | `permaplate create contract` (AP-2501, AP-2494, AP-2493, AP-2455, AP-2448, AP-2446, AP-2443, AP-2428, AP-2427) · `permaplate invoice alert` (AP-2456, AP-2446) | AP-2428, AP-2446, AP-2456 | AP-2428: "The user is redirected to the quote details page" / "A download button is available to download the PDF"; AP-2446: "A permaplate invoice is created" / "An alert message is displayed to notify the user an invoice is created (Same way as a warranty contract invoice)" | Answered; the PDF HTTP 500 stays AP-2512 |
| Q-010 | `contract already created` (AP-2536, AP-2504, AP-2455, AP-2446, AP-2443, AP-2431, AP-2428, AP-2423, AP-2372, AP-1185, AP-1166, AP-770) · `contract already generated quote` (AP-2504, AP-2446, AP-2428, AP-1166) | AP-2493, AP-2551, AP-2428 | None — AP-2493 covers the download action only | Accepted — actual: action withdrawn, silent 302 to the quote |
| Q-011 | `row actions quote details` (AP-2505, AP-2503, AP-2493, AP-2477, AP-2443, AP-2428) · `Generate Contract button quote` (as Q-001) | AP-2428, AP-2493, AP-2551 | None for the row control — AP-2428: "There is a button to create the contract" | Accepted — actual: row ⋯ menu "Edit · Generate Contract · Delete" |
| Q-012 | Not run — deployment state is not product knowledge | — | — | Open |

**Effect on testing.** No test case becomes runnable: the only BLOCKED case,
AP2506_002, waits on Q-001, which stays Open. The answered and accepted questions turn
record-only steps into checked ones at the next execution; every value accepted here is
the one already recorded as PASS on 2026-11-08, so no recorded result changes. Points for
the next execution on Dev, from Stories delivered after the 2026-11-08 run (recorded, not
judged here): on an Esthetic-only quote no "Financing information" card should show
(AP-2559); AP-2544 adds an "In service date" input to the vehicle card, which the
2026-11-08 page did not show; AP-2551 and AP-2562 add a quote-level "Generate Contract"
checkout, so the row action may have moved. AP-2506's status and the open bugs AP-2512,
AP-2516, AP-2553, AP-2555 and AP-2556 are not touched. Nothing was posted to Jira.

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | AC 1 contradicts the description on which row's action opens the page (Q-001, Blocking) | High | Open |
| REQ-005 | "Current process" / "unchanged" behaviour has no baseline in `domain` (Q-009) | High | Answered 2026-11-15 (AP-2428, AP-2446) |
| REQ-005 | Known HTTP 500 when "Financing company" is left on "Choose" (AP-2459) | High | Open (AP-2459, staging); not seen on Dev 2026-11-08 — refused with a message |
| REQ-001 | Location of the Esthetic protection row actions not mapped (Q-011) | Medium | Accepted 2026-11-15 |
| REQ-001 | Ticket in status QA, no linked pull request — change may not be deployed (Q-012) | Medium | Open |
| REQ-002 | Placement of financing on the new page not stated (Q-003) | Medium | Answered 2026-11-15 (AP-2546, AP-2559) |
| REQ-003 | Start date default and editability, end date rule and the meaning of "Total" not stated (Q-004 – Q-006) | Medium | Q-004 Answered; Q-005, Q-006 Accepted 2026-11-15 |
| REQ-004 | Editable versus read-only fields not stated (Q-007) | Medium | Answered 2026-11-15 (AP-2544, AP-2545) |
| REQ-005 | Invalid values and their handling not stated (Q-008); behaviour on a quote that already has a contract not stated (Q-010) | Medium | Accepted 2026-11-15 |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — one Blocking question (Q-001) is open on REQ-001; the other requirements can proceed (Gate A rule A2). Re-checked 2026-11-15: Q-001 still Blocking + Open; Q-002 and Q-012 Open (not product knowledge); 4 Answered, 5 Accepted

# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → Extended warranty → "Generate Contract" page `/quote/{quoteId}/warranty/generate-contract` (Jira AP-2503)
**Date:** 2026-11-01 · **Updated:** 2026-11-15 — re-run with the QA's answer to Q-001 – Q-011 (all now Answered); no ticket change
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2503-generate-contract-for-a-quotes-extended.md` (including its section *Ticket changes since capture — 2026-11-15*); the answers' values come from `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md`, as the QA's answer directs
**Total requirements found:** 5

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/navigation-map.md

---

## Executive Summary

AP-2503 changes how a dealer turns the extended warranty on a quote into a contract.
Today the "Generate Contract" action for the extended warranty works inside a *modal* (a
pop-up window over the quote page). The story makes it behave like the Esthetic
protection contract (the Permaplate product, AP-2428): the action opens a **dedicated
page** at the route `/quote/{quoteId}/warranty/generate-contract`, which keeps its
current address and internal route name `quote-warranty-generate-contract`. That page
holds a two-column card — the client ("owner"), vehicle and financing details on the
left, and the Program Summary, a PDF preview and the submit button on the right. The
story is explicit that contract creation, the invoice, the financing and the PDF keep
working exactly as before; only the screen around them changes.

Five requirements were extracted: the action opens a dedicated page at the unchanged
route (REQ-001); the page is laid out in two columns with named sections and a PDF
preview (REQ-002); the Program Summary shows the vehicle delivery date, an editable
warranty start date and the warranty sale price (REQ-003); the form is pre-filled from the
quote, with vehicle identifiers and the delivery date read-only and the owner fields and
start date editable (REQ-004); and submitting valid values creates the contract through
the existing process (REQ-005). Every acceptance criterion has an observable outcome, so
**no question blocks testing**. The 2026-11-01 analysis left ten Judgement questions and
one Info question open — where the vehicle details sit, which document the preview shows,
which fields count as "vehicle identifiers", the start date's default and limits, the
source of the sale price, what "valid form values" excludes, what follows a submit, the
empty financing section, whether owner edits reach the quote, what "match Esthetic
Protection" covers, and where the action is.

**Update 2026-11-15.** The QA answered all eleven at once: *"all current behavior actual
result is correct as expected"*. Each question is now **Answered**: the behaviour Dev
(v2dev) showed in the 2026-11-02 execution is the expected behaviour, and where that run
did not record a behaviour, the next execution records it and accepts it (record-and-accept)
— no value is invented here. The answer covers the questions only. The three bugs filed
from that run — AP-2530 (no delivery date in the Program Summary, AC 2), AP-2531 (VIN and
delivery date editable, AC 3) and AP-2532 (a quote without financing cannot be submitted)
— stay open and valid, because where the acceptance criteria text states the expected
result, the criterion wins over the current behaviour. The section *How the answer and the
open bugs fit together* below shows, question by question, where the two meet. The
answers turn record-only steps of the test plan and test cases into judged steps, so the
plan, the cases and the execution must be redone.

One testability risk remains open, rated High: a contract can only be generated from a
quote that already carries an extended warranty from an eligible program; preparing such
a quote needs a vehicle that some program accepts, and each generated contract is a
permanent record on the shared dealer account. The 2026-11-01 analysis rated a second risk
High — the old behaviour that "stays unchanged" had no recorded baseline, because the
extended-warranty contract flow is not mapped in the domain knowledge. That risk is
**closed since 2026-11-15**: the answer to Q-007 makes Dev's recorded post-submit behaviour
(landing page, invoice message, contract link, PDF, list row) the baseline the tests judge
against.

Overall testability is rated **MEDIUM**: the page layout and pre-fill are easy to observe,
and the post-submit behaviour now has a baseline, but every contract the tests create is
permanent on the shared dealer account.

---

## Requirements Detail

### REQ-001 — "Generate Contract" for the extended warranty opens a dedicated page at the unchanged route

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the extended warranty's "Generate Contract" action to open its own page instead of a modal, so that it works the same way as the Esthetic protection contract. *(Inferred — the ticket has no user story.)* |
| **Priority** | High — it is the entry point to the whole change; if the action still opens a modal, nothing else in the story is reachable as specified. |
| **Source File** | AP-2503-generate-contract-for-a-quotes-extended.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. "The “Generate Contract” action for Extended Warranty on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" (description).
2. "The route `/quote/{quoteId}/warranty/generate-contract` (`quote-warranty-generate-contract`) stays the same." (description).
3. "Given a quote with a vehicle and an extended warranty from a program, when the dealer opens `/quote/{quoteId}/warranty/generate-contract`, then the form is pre-filled …" — the route opened directly loads the page (AC 1).

**Out of Scope:**

- None stated. The internal route name `quote-warranty-generate-contract` cannot be observed in the browser; only the URL can.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The location and label of the "Generate Contract" action on the quote page are not mapped; the quote page's "Summary of products" card is known only from AP-2497's screenshots | Medium | Q-011 — Answered 2026-11-15: judge the "Generate Contract" item of the ⋯ menu on the Extended warranty row of "Summary of products"; found on 2026-11-02 and written back to `quote-creation.md` |

---

### REQ-002 — The page is a two-column card with named sections and a PDF preview

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the client, vehicle and financing details on one side and the program summary, preview and submit button on the other, so that I can check everything before generating the contract. *(Inferred.)* |
| **Priority** | Medium — a layout requirement; a wrong layout does not stop a contract from being created, but it is the visible point of the story. |
| **Source File** | AP-2503-generate-contract-for-a-quotes-extended.md |
| **Recommended Test Types** | UI · Functional |

**Acceptance Criteria:**

1. "Given the page has loaded, when the dealer inspects it, then it shows the “Owner information”, “Financing information” in a left column. “Program Summary”, a preview of the contract and a submit button are in the right column." (AC 2)
2. "… the quote PDF preview is shown." (AC 1)
3. "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The description and AC 2 name different sections for the left column (description: vehicle + owner; AC 2: owner + financing). Both can hold at once, but neither sentence alone says where *all* three sit | Medium | Q-001 — Answered 2026-11-15: judge a "Vehicle identification" section first in the left column, above Owner and Financing information |
| AC 1 says "the quote PDF preview", AC 2 says "a preview of the contract" — one preview or two, and of which document, is not stated | Medium | Q-002 — Answered 2026-11-15: judge one embedded preview of the extended-warranty contract draft (`/quote/{id}/warranty/pdf`) with an "Open PDF in new tab" link |
| "Should match Esthetic Protection" gives no list of matching points beyond the sections named | Low | Q-010 — Answered 2026-11-15: the recorded differences are expected, except editable vehicle identifiers (AC 3, AP-2531); unrecorded styling and labels are recorded and accepted |

---

### REQ-003 — The Program Summary shows the delivery date, an editable warranty start date and the warranty sale price

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Program Summary to show when the vehicle was delivered, when the warranty starts and what it sells for, so that I can confirm the contract terms. *(Inferred.)* |
| **Priority** | High — the start date and sale price go onto the contract the client signs. |
| **Source File** | AP-2503-generate-contract-for-a-quotes-extended.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. "The “Program Summary” shows: Vehicle delivery date · Warranty start date (editable) · Warranty sale price" (AC 2).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The default value of the warranty start date, and which dates it accepts, are not stated | Medium | Q-004 — Answered 2026-11-15: judge default = delivery date, earlier and later dates accepted; an empty start date is recorded and accepted |
| Which amount the "warranty sale price" is (the price on the quote's warranty, with or without tax) is not stated | Medium | Q-005 — Answered 2026-11-15: judge sale price = the quote warranty's sale price, without tax, in an editable field |

---

### REQ-004 — The form is pre-filled from the quote; vehicle identifiers and delivery date are read-only, owner fields and start date editable

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form filled from the quote and the vehicle's identity locked, so that I only correct the owner details and the start date. *(Inferred.)* |
| **Priority** | High — a wrong or editable VIN or delivery date would produce a contract for the wrong vehicle or period. |
| **Source File** | AP-2503-generate-contract-for-a-quotes-extended.md |
| **Recommended Test Types** | Functional · UI · Negative · Edge-case |

**Acceptance Criteria:**

1. "… the form is pre-filled with the quote’s client and vehicle data" (AC 1).
2. "Given the quote has a vehicle, a client or a financing, when the page renders, then vehicle, owner and financing values are pre-filled, vehicle identifiers and delivery date are read-only, and the warranty start date, and owner fields are editable." (AC 3)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Vehicle identifiers" is not defined — which vehicle fields (VIN, make, model, year, odometer) must be read-only is not listed | Medium | Q-003 — Answered 2026-11-15: VIN and delivery date read-only (AC 3 wins, AP-2531 open); Make, Model, Year and Mileage editable as on Dev |
| The field list of each section is not given, so "pre-filled" can only be judged for the values the test itself entered on the quote | Low | Compare each shown value with the value entered when the quote was built |
| What the financing section shows when the quote has no financing is not stated ("a vehicle, a client **or** a financing") | Low | Q-008 — Answered 2026-11-15: judge the "Choose" picker plus six empty company fields; their blocking of the submit is AP-2532 |

---

### REQ-005 — Submitting valid values creates the contract through the existing process

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want submitting the page to create the extended-warranty contract exactly as before, so that invoices, financing and the contract PDF are not affected. *(Inferred.)* |
| **Priority** | High — contract creation produces the legal document and the invoice; a regression here costs money and client trust. |
| **Source File** | AP-2503-generate-contract-for-a-quotes-extended.md |
| **Recommended Test Types** | Functional · Regression · Negative |

**Acceptance Criteria:**

1. "Given valid form values, when the dealer submits, then contract is created following the current process." (AC 4)
2. "Contract creation, invoice, financing, and PDF behaviour stay unchanged." (description)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "The current process" and the "unchanged" invoice, financing and PDF behaviour have no recorded baseline — warranty contracts are not mapped in the knowledge sources | High | Q-007 — Answered 2026-11-15: Dev's recorded post-submit behaviour is the baseline — judge landing page, invoice message, contract link, PDF and list row |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-006 — Answered 2026-11-15: judge the browser's own "Please fill out this field." refusal, values kept, no contract |
| Whether owner edits made on this page also change the quote's client record is not stated | Low | Q-009 — Answered 2026-11-15: judge edits reach the contract only; the quote's client is unchanged |
| Each generated contract is a permanent record on the shared dealer account (no `cleanup` source); preparing a quote needs a program-eligible vehicle | High | Create a fresh vehicle, client and quote per case; never reuse another ticket's quote |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Dedicated page at the unchanged route | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Two-column layout with PDF preview | ✓ | | | | ✓ | | | |
| REQ-003 — Program Summary content | ✓ | | ✓ | | ✓ | | | |
| REQ-004 — Pre-fill and read-only/editable fields | ✓ | ✓ | ✓ | | ✓ | | | |
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
| Q-001 | The description puts "vehicle and owner information on the left"; AC 2 puts "Owner information" and "Financing information" on the left and does not place the vehicle. Where should the vehicle details sit, and is "Vehicle information" its own section? | REQ-002 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_002 step 3): the vehicle details are their own section, "Vehicle identification", first in the left column (VIN, Mileage, Year, Make, Model, Delivery date, Cylinders, Engine size, transmission, condition, Diesel/Turbo/4x4/FWD), above "Owner information" and "Financing information". AC 2 still puts the delivery date in the Program Summary — see AP-2530 below | Nicolas-Eric Tain |
| Q-002 | AC 1 says "the quote PDF preview is shown"; AC 2 says "a preview of the contract". Is it one preview, and does it show the quote PDF or the contract PDF? | REQ-002 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_002 step 4): one preview, in the right column — an embedded PDF of the extended-warranty contract draft from `/quote/{id}/warranty/pdf` ("WARRANTY PROGRAM", "# CONTRAT: incomplete", "example" watermark), with an "Open PDF in new tab" link; not the quote PDF | Nicolas-Eric Tain |
| Q-003 | Which vehicle fields are the "vehicle identifiers" that must be read-only — VIN only, or also make, model, year and odometer? | REQ-004 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Dev (execution log 2026-11-02, AP2503_005 step 2) shows the VIN, Year, Make, Model, Mileage and delivery date all editable. AC 3 states "vehicle identifiers and delivery date are read-only", and the QA kept AP-2531 (VIN and delivery date editable) valid, so the AC wins for the **VIN and the delivery date: read-only**. **Make, Model, Year and Mileage editable** is accepted as expected (current behaviour). The editability of Cylinders, Engine size, transmission, condition and the Diesel/Turbo/4x4/FWD boxes is not recorded in that log: the next execution records it and accepts it as expected | Nicolas-Eric Tain |
| Q-004 | What is the warranty start date's default value (the delivery date, today, something else), and which dates may the dealer enter (empty, before the delivery date, in the future)? | REQ-003 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02): the default is the vehicle delivery date (AP2503_003 step 3); a date 30 days before delivery (2026-10-03, AP2503_009) and a later date (2026-11-09, AP2503_007) are accepted and become the contract's start date; the End date on screen is not recalculated when the start date changes (AP2503_003 step 5). An **empty** start date was not tried in that log: the next execution records what happens and accepts it as expected | Nicolas-Eric Tain |
| Q-005 | Which amount is the "Warranty sale price" — the warranty price on the quote, before or after tax — and is it editable? | REQ-003 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_003 steps 3 and 5): the sale price entered with the quote's extended warranty (2500), without tax, shown in an editable text field. Whether an **edited** sale price reaches the contract or invoice was not recorded: the next execution records it and accepts it as expected | Nicolas-Eric Tain |
| Q-006 | What are "valid form values"? Which owner fields are required, and what does the page show when one is emptied before submit? | REQ-005 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_008): an emptied required owner field (Last name) is refused by the browser's own check ("Please fill out this field."), with no message in the page, no request sent, the other values kept and no contract created. Which **other** owner fields are required was not recorded: the next execution records them and accepts them as expected. The required financing-company fields on a quote without financing are not covered by this answer — see AP-2532 below | Nicolas-Eric Tain |
| Q-007 | What does "the current process" produce after submit — which page the dealer lands on, whether an invoice is created, and where the contract PDF is offered? No baseline of the old modal flow is recorded. | REQ-005 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_006 steps 3–5, AP2503_007 step 4): the dealer lands on `/quote/{id}/details` with the message "Invoice #N ($amount) is created" and no separate contract message; the invoice amount is the warranty cost (CA$456.00), not the sale price; the Extended warranty row's ⋯ menu is replaced by the contract number link (`/warranty/{id}`) and a PDF icon (`/warranty/{id}/pdf`, inline `contrat.pdf`); a "Download all documents" link appears; `/warranty` lists the contract "Pending approval" with its invoice "Payment pending" | Nicolas-Eric Tain |
| Q-008 | What does the "Financing information" section show when the quote has no financing? | REQ-004 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected display (Dev, execution log 2026-11-02, AP2503_010 step 3): the "Financing Company" picker at "Choose" and six empty fields (company name, phone, address, city, province, postal code), with no message. That these fields are **required and stop the submit** is AP-2532, which stays open — see below | Nicolas-Eric Tain |
| Q-009 | Do owner fields edited on this page update the quote's client record, or only the contract? | REQ-005 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_007 step 5): only the contract — the edited work-phone value (5145550299) appears on the contract PDF and the quote's client keeps its old value (5145550202). Which PDF label that number is printed under is not part of the answer and is not judged. Only a phone edit was submitted in that run; an edited **name or address** carried to the contract was not recorded: the next execution records it and accepts it as expected | Nicolas-Eric Tain |
| Q-010 | Beyond the sections named in AC 2, what must "match Esthetic Protection" — field order, labels, card styling? | REQ-002 | Judgement | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02, AP2503_002 steps 3–4): left column Vehicle identification → Owner information → Financing information; right column Program Summary → "Generate Contract" button → "Open PDF in new tab" → embedded PDF. The recorded differences from Esthetic Protection (embedded PDF preview and link) are expected; the third recorded difference — vehicle fields not read-only — is not accepted for the VIN and delivery date (AC 3, AP-2531). Card styling and labels were not compared in that log: the next execution records them and accepts them as expected | Nicolas-Eric Tain |
| Q-011 | Where is the "Generate Contract" action on the quote page, and is it still labelled "Generate Contract"? | REQ-001 | Info | Answered | "AP-2503: according to the question: all current behavior actual result is correct as expected." — the QA, in chat, 2026-11-15 (capture § *Ticket changes since capture — 2026-11-15*). Expected (Dev, execution log 2026-11-02): the "Generate Contract" item (between Edit and Delete) of the ⋯ menu on the Extended warranty row of "Summary of products" (AP2503_001 steps 3 and 5); once a contract exists the menu is replaced by the contract number link and a PDF icon (AP2503_006 step 4 and the log's Environment Observations) | Nicolas-Eric Tain |

**Source of the answers.** The QA gave one sentence in chat on 2026-11-15; it is recorded
word for word in the requirement capture's section *Ticket changes since capture —
2026-11-15* (it is not a ticket comment, and nothing was posted on AP-2503). By the QA's
instruction that sentence means: the behaviour recorded for each question in
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md` is the
expected behaviour. Every value in the Answer column is quoted from that log; nothing was
inferred from a sibling ticket or a convention. Where the log is silent the cell says so,
and the next execution records the behaviour and accepts it (record-and-accept).

### How the answer and the open bugs fit together

The QA's decision for this batch: the answer covers the questions only, and **where the
acceptance criteria text itself states the expected result, the AC wins over the current
behaviour**. AP-2530, AP-2531 and AP-2532 stay open and valid; no bug status is changed.

| Bug (open) | What the AC text states | Questions it touches | How the answer and the bug fit |
|---|---|---|---|
| AP-2530 — Program Summary lacks the vehicle delivery date (Medium) | AC 2: "The “Program Summary” shows: Vehicle delivery date · Warranty start date (editable) · Warranty sale price" | Q-001, Q-010 | Q-001 accepts the "Vehicle identification" section in the left column, which holds the delivery date. AC 2 additionally lists the delivery date in the Program Summary, so the AC wins on that point: AP2503_003 step 3 still expects it in the Program Summary and stays a FAIL until AP-2530 is fixed |
| AP-2531 — VIN and delivery date editable (Medium) | AC 3: "vehicle identifiers and delivery date are read-only" | Q-003, Q-010 | Q-003's answer accepts Make, Model, Year and Mileage as editable (they are not counted as identifiers), but the VIN and the delivery date stay read-only by AC 3. AP2503_005 steps 2 and 5 keep their expected result and stay a FAIL until AP-2531 is fixed. Q-010's "vehicle fields not read-only" difference is accepted only for the non-identifier fields |
| AP-2532 — a quote without financing cannot be submitted: six required financing-company fields (High) | AC 1 / AC 4: a quote with "a vehicle and an extended warranty" — "contract is created following the current process"; description: "financing … behaviour stay[s] unchanged" | Q-006, Q-007, Q-008 | Q-006 accepts the browser's own refusal for an emptied **owner** field; it says nothing about financing fields on a quote that has no financing. Q-007 accepts what Dev does **after** a successful submit; a quote without financing never reaches that point until AP-2532 is fixed. Q-008 accepts the **display** of the empty financing section (picker + six empty fields); that those fields are required and stop the submit is the defect the QA kept open. AP2503_007 step 3 stays a FAIL; AP2503_008 and AP2503_009 keep picking a financing company first so that only their own input is under test |

Questions with no open bug: Q-002, Q-004, Q-005, Q-009 and Q-011. Their answers only turn
record-only steps into judged ones.

**Effect on the downstream stages.** The 2026-11-01 test plan and test cases treat these
questions as open and their steps as record-only (AP2503_001 step 5, AP2503_002 steps 3–4,
AP2503_003 steps 3 and 5, AP2503_005 step 2, AP2503_006 steps 3–4, AP2503_007 step 5,
AP2503_008 step 3, AP2503_009 steps 2–4, AP2503_010 step 3). With the answers they become
judged against the values above, and the not-recorded points (Q-003 other vehicle fields,
Q-004 empty start date, Q-005 edited sale price, Q-006 other required owner fields, Q-009
edited name or address, Q-010 styling and labels) need a record-and-accept step. The test
plan, test cases, case review, execution, bug filing, report and ticket update are
therefore stale and must be redone from the test plan.
---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-005 | "Current process" / "unchanged" behaviour has no recorded baseline (warranty contracts unmapped) | High | Closed 2026-11-15 — Q-007 answered: Dev's recorded post-submit behaviour is the baseline |
| REQ-005 | Generated contracts are permanent records on the shared dealer account; preparing a quote needs a program-eligible vehicle | High | Open |
| REQ-002 | Left-column sections differ between description and AC 2 (Q-001) | Medium | Closed 2026-11-15 — Q-001 answered |
| REQ-002 | Preview document not settled — quote PDF or contract (Q-002) | Medium | Closed 2026-11-15 — Q-002 answered |
| REQ-003 | Warranty start date default and limits not stated (Q-004) | Medium | Closed 2026-11-15 — Q-004 answered; empty start date is record-and-accept |
| REQ-003 | Source of the warranty sale price not stated (Q-005) | Medium | Closed 2026-11-15 — Q-005 answered; edited sale price is record-and-accept |
| REQ-004 | "Vehicle identifiers" not defined (Q-003) | Medium | Closed 2026-11-15 — Q-003 answered with AC 3 winning for the VIN and delivery date (AP-2531 open) |
| REQ-005 | Invalid form values and their handling not stated (Q-006) | Medium | Closed 2026-11-15 — Q-006 answered; other required owner fields are record-and-accept |
| REQ-001 | Location of the "Generate Contract" action not mapped (Q-011) | Medium | Closed 2026-11-15 — Q-011 answered; written back to quote-creation.md on 2026-11-02 |

_Revised 2026-11-15T08:35:58Z for the R1 round 1 minor findings: F-1 Executive Summary no longer calls the baseline risk open (closed by Q-007); REQ-001 risk row notes Q-011 Answered. F-2 the permanent-records risk is High in both the REQ-005 table and this summary. F-3 citations — Q-004 End date from AP2503_003 step 5; Q-011 menu replacement from AP2503_006 step 4 and the Environment Observations; Q-009 names no PDF label._

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — no Blocking question is open; since 2026-11-15 every question is Answered and the plan must be redone with the answers

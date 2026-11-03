# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → Roadside Protection → "Generate Contract" page `/quote/{quoteId}/road-side-protection-create-contract` (Jira AP-2505)
**Date:** 2026-11-03
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
| Q-001 | The description says "vehicle and owner information on the left", but AC 2 says "“Owner information”, “Financing information” in the left column, and “Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column". Which column should hold the "Vehicle identification" section? | REQ-002 | Blocking | Open | — | Nicolas-Eric Tain |
| Q-002 | AC 1 starts from "a quote with a GAP insurance quote and no contract", while the action is on the Roadside Protection row. Must the quote carry a GAP insurance quote for the roadside "Generate Contract" action to be offered, or is "GAP insurance quote" meant to read "roadside protection product"? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | "Should match Esthetic Protection" — beyond the dedicated page and the named sections, on which points must the roadside page match the Esthetic protection contract page (heading, field list, read-only fields, Back link)? | REQ-001, REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | What should the Program Summary list for a roadside product — program name, tier, term, start date, end date, Policy Sale price, total? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | Which vehicle and owner fields may the dealer edit on this page, and which are read-only? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | AC 3 says "a vehicle, a client, or a financing". When the quote has no financing, what does the "Financing information" section show, and can the contract still be generated? | REQ-003, REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | Which "financing values" are meant — the financing company (name, address, phone), the loan terms (amount, term, rate, payment), or both — and does "read-only" cover all of them? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | What are "valid form values"? Which fields are required, and what does the page show when one is emptied before submit? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | What does "the current process" produce after submit — which page the dealer lands on, which message, whether an invoice is created, and where the AutoShield contract PDF is offered? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | AC 1 starts from a quote with "no contract". On a quote whose roadside contract already exists, or for a VIN that already has an AutoShield contract, is "Generate Contract" still offered, and what does the address show if opened directly? | REQ-001, REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | The description gives the route name "quote-insurance-create-contract", which reads like the creditor-insurance route. Is that the roadside route's internal name? (Not observable in the browser.) | REQ-001 | Info | Open | — | Nicolas-Eric Tain |
| Q-012 | Does this change also fix AP-2518 (the HTTP 500 on this address on Dev, 2026-11-02), or is that fix expected separately? | REQ-001 – REQ-004 | Info | Open | — | Nicolas-Eric Tain |

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
- [ ] Ready to proceed to Test Plan Design — one Blocking question (Q-001) is open on REQ-002 only; the other requirements can proceed (Gate A rule A2)

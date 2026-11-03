# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page → Extended warranty → "Generate Contract" page `/quote/{quoteId}/warranty/generate-contract` (Jira AP-2503)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2503-generate-contract-for-a-quotes-extended.md`
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
**no question blocks testing**. Ten Judgement questions and one Info question remain.
The most visible one: the description puts "vehicle and owner information on the left",
while the acceptance criterion lists "Owner information" and "Financing information" on
the left and does not place the vehicle. The tests judge what both sentences state
literally and record where the vehicle details actually sit. Others cover which fields
count as "vehicle identifiers", which document the preview shows (the criteria say both
"the quote PDF preview" and "a preview of the contract"), the default and limits of the
warranty start date, and what "valid form values" excludes.

Two testability risks are rated High. First, the extended-warranty contract flow is not
mapped in the domain knowledge — the warranty contract list `/warranty` and the
generate-contract page are both listed as unmapped in the navigation index — so the old
behaviour that "stays unchanged" has no recorded baseline. The tests can prove a contract
is created and record its invoice and PDF, but cannot compare them to a before-picture.
Second, a contract can only be generated from a quote that already carries an extended
warranty from an eligible program; preparing such a quote needs a vehicle that some
program accepts, and each generated contract is a permanent record on the shared dealer
account.

Overall testability is rated **MEDIUM**: the page layout and pre-fill are easy to observe,
but the "unchanged" contract behaviour has no documented baseline.

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
| The location and label of the "Generate Contract" action on the quote page are not mapped; the quote page's "Summary of products" card is known only from AP-2497's screenshots | Medium | The executor finds the action on first use and writes it back to `quote-creation.md` |

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
| The description and AC 2 name different sections for the left column (description: vehicle + owner; AC 2: owner + financing). Both can hold at once, but neither sentence alone says where *all* three sit | Medium | Q-001. Judge the sections each sentence names; record where the vehicle details sit |
| AC 1 says "the quote PDF preview", AC 2 says "a preview of the contract" — one preview or two, and of which document, is not stated | Medium | Q-002. Judge that a PDF preview is shown in the right column; record which document it shows |
| "Should match Esthetic Protection" gives no list of matching points beyond the sections named | Low | Q-010. Judge only the named sections; record visible differences |

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
| The default value of the warranty start date, and which dates it accepts, are not stated | Medium | Q-004. Record the default and the behaviour for an empty or earlier-than-delivery date |
| Which amount the "warranty sale price" is (the price on the quote's warranty, with or without tax) is not stated | Medium | Q-005. Judge that a sale price is shown; record whether it equals the quote's warranty price |

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
| "Vehicle identifiers" is not defined — which vehicle fields (VIN, make, model, year, odometer) must be read-only is not listed | Medium | Q-003. Judge the delivery date; record the editability of every vehicle field |
| The field list of each section is not given, so "pre-filled" can only be judged for the values the test itself entered on the quote | Low | Compare each shown value with the value entered when the quote was built |
| What the financing section shows when the quote has no financing is not stated ("a vehicle, a client **or** a financing") | Low | Q-008. Record the empty state |

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
| "The current process" and the "unchanged" invoice, financing and PDF behaviour have no recorded baseline — warranty contracts are not mapped in the knowledge sources | High | Q-007. Judge that a contract is created and appears in the dealer's Warranty contracts list; record the landing page, invoice and PDF |
| What counts as invalid form values, and what the page does with them, is not stated | Medium | Q-006. Record the behaviour for an emptied required owner field |
| Whether owner edits made on this page also change the quote's client record is not stated | Low | Q-009. Record it |
| Each generated contract is a permanent record on the shared dealer account (no `cleanup` source) | Medium | Create a fresh vehicle, client and quote per case; never reuse another ticket's quote |

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
| Q-001 | The description puts "vehicle and owner information on the left"; AC 2 puts "Owner information" and "Financing information" on the left and does not place the vehicle. Where should the vehicle details sit, and is "Vehicle information" its own section? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-002 | AC 1 says "the quote PDF preview is shown"; AC 2 says "a preview of the contract". Is it one preview, and does it show the quote PDF or the contract PDF? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | Which vehicle fields are the "vehicle identifiers" that must be read-only — VIN only, or also make, model, year and odometer? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | What is the warranty start date's default value (the delivery date, today, something else), and which dates may the dealer enter (empty, before the delivery date, in the future)? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | Which amount is the "Warranty sale price" — the warranty price on the quote, before or after tax — and is it editable? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | What are "valid form values"? Which owner fields are required, and what does the page show when one is emptied before submit? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | What does "the current process" produce after submit — which page the dealer lands on, whether an invoice is created, and where the contract PDF is offered? No baseline of the old modal flow is recorded. | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | What does the "Financing information" section show when the quote has no financing? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | Do owner fields edited on this page update the quote's client record, or only the contract? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | Beyond the sections named in AC 2, what must "match Esthetic Protection" — field order, labels, card styling? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | Where is the "Generate Contract" action on the quote page, and is it still labelled "Generate Contract"? | REQ-001 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-005 | "Current process" / "unchanged" behaviour has no recorded baseline (warranty contracts unmapped) | High | Open |
| REQ-005 | Generated contracts are permanent records on the shared dealer account; preparing a quote needs a program-eligible vehicle | High | Open |
| REQ-002 | Left-column sections differ between description and AC 2 (Q-001) | Medium | Open |
| REQ-002 | Preview document not settled — quote PDF or contract (Q-002) | Medium | Open |
| REQ-003 | Warranty start date default and limits not stated (Q-004) | Medium | Open |
| REQ-003 | Source of the warranty sale price not stated (Q-005) | Medium | Open |
| REQ-004 | "Vehicle identifiers" not defined (Q-003) | Medium | Open |
| REQ-005 | Invalid form values and their handling not stated (Q-006) | Medium | Open |
| REQ-001 | Location of the "Generate Contract" action not mapped (Q-011) | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — no Blocking question is open

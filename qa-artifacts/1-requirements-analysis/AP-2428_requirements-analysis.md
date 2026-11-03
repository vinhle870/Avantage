# Requirements Analysis Report

**Project:** Avantage Plus v2 — AP-2428 Dealer Permaplate Contract
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2428-dealer-permaplate-contract.md`
**Total requirements found:** 8

---

## Executive Summary

AP-2428 lets a dealer turn a Permaplate quote into a Permaplate contract. Permaplate is a
paint-and-appearance protection product that dealers sell with a vehicle; the dealer UI
now labels it "Esthetic protection" (domain source `qa-docs/quote-creation.md`). The
ticket describes four things: a "create contract" button on the quote page, a confirmation
form with three sections (vehicle, owner and program summary, most of them prefilled from
the quote), a "Generate Contract" submit that returns the dealer to the quote details page,
and a PDF of the contract the dealer can download from there. A comment from the reporter
(Ken Nguyen, 2026-08-06) adds a fifth rule: the contract must keep its own copy of the
option values and prices, so a later change by an administrator does not alter contracts
that already exist.

Eight requirements were extracted. The main flow — button, form, submit, redirect,
download — can be judged from the ticket's own words, so most of the ticket is testable.
**Overall testability is rated MEDIUM.** Three questions are **Blocking**, meaning a
requirement cannot be judged pass or fail until the author answers:

- The *Year* field is described as "Text field with the vehicle's model prefilled", which
  contradicts its label, so the expected Year value is not stated (REQ-002).
- Taxes are "calculated based on the client's province", but the ticket gives no rates and
  does not say which amount is taxed or which province is used if the dealer changes it
  on the form (REQ-005).
- A later ticket in the same feature set, AP-2456, asks for the retail price and taxes to
  be removed from Permaplate surfaces, while AP-2428 asks for them to be shown. Only the
  author can say which applies to this form (REQ-005).

Two further facts matter before testing. The QA account reported on 2026-08-14 that no
Permaplate contract was shown and on 2026-08-18 that submitting Generate Contract shows
an error, and neither comment has a reply. The ticket is therefore being re-tested with a
known, unconfirmed failure on its main path. Second, testing REQ-008 means changing an
administrator's Permaplate option price on shared staging data, which other tests may
depend on.

---

## Requirements Detail

### REQ-001 — "Create contract" button on the quote page

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want a button on the quote page to create the contract once a Permaplate quote exists, so that I can sell the product without leaving the quote. |
| **Priority** | High — it is the only entry point to the feature; if the button is missing nothing else in the ticket can be reached. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · Negative · UI |

**Acceptance Criteria:**

1. Given the dealer user is logged in the dealer area, when the dealer is on the quote page and a Permaplate quote exists, then there is a button to create the contract.
2. When the user clicks "create contract", a form is available to confirm the selection and other details.

**Out of Scope:**

- None stated

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "The quote page" is not named. The domain source lists both the quote details hub (`/quote/{id}/details`) and the Permaplate stage (`/quote/{id}/permaplate`), so the tester does not know where to expect the button. | Medium | Record where the button is found; ask the author (Q-004). |
| The ticket does not say what happens when the quote has no Permaplate selection, or when a contract was already generated for the quote. Without this, a duplicate contract could be created and billed twice. | Medium | Test both cases as record-only checks (Q-005). |
| The QA account reported on 2026-08-14 that no Permaplate contract was shown, with no reply. | High | Confirm the button appears before executing the rest of the suite. |

---

### REQ-002 — Vehicle information section, prefilled from the quote

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want the vehicle details already filled in on the contract form, so that I only confirm them instead of retyping them. |
| **Priority** | High — the VIN and delivery date identify the protected vehicle and set the contract start date; a wrong value makes the contract invalid. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. Make — text field with the vehicle's make prefilled.
2. Model — text field with the vehicle's model prefilled.
3. Year — "Text field with the vehicle's model prefilled" (verbatim; contradicts the label — see Q-001).
4. VIN — text field with the vehicle's VIN prefilled.
5. Odometer at delivery — text field with the vehicle's km prefilled.
6. Delivery date — text field with the vehicle's delivery date prefilled.

**Out of Scope:**

- None stated

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The Year criterion names the model as its prefill value. Taking it as the year would be a guess. | High | Keep the Year check BLOCKED until Q-001 is answered. |
| No validation is stated for any vehicle field (empty VIN, invalid date, non-numeric km), and the ticket does not say whether edits made here are saved to the contract or the vehicle record. | Medium | Record the behaviour; do not fail on it (Q-006). |
| The quote may have no delivery date or odometer yet; the empty-prefill case is not described. | Low | Record what the form shows. |

---

### REQ-003 — Owner information section, prefilled from the client

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want the client's details already filled in on the contract form, so that the contract carries the right owner without retyping. |
| **Priority** | High — the owner's name and address appear on the legal contract; the province drives the taxes in REQ-005. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · UI · Negative |

**Acceptance Criteria:**

1. The section shows "Information about the client pre-filled".
2. Last name, First name, Address, City, Postal code and Email are text fields.
3. Other name on file — text field with the client's company prefilled.
4. Province — dropdown of provinces.
5. Phone (res) — text field with the client's phone1.
6. Phone (cell) — text field with the client's phone2.

**Out of Scope:**

- None stated

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "phone1" and "phone2" are not client-form labels. The domain source shows the client has a home and a work/cell number, but the ticket does not say which is phone1. | Medium | Record which client number lands in each field (Q-007). |
| No validation (required fields, postal-code or email format) is stated. | Medium | Record-only negative checks (Q-006). |

---

### REQ-004 — Program summary, display only

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to see the program term, dates and selected protection products before I generate the contract, so that I can confirm the sale is what the client bought. |
| **Priority** | Medium — read-only information; errors here mislead but do not block contract creation. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. Program Term — text display (no input).
2. Start Date (same as delivery date) — text display (no input).
3. End date — text display (no input).
4. Selected protection products — table with all the selected options.

**Out of Scope:**

- None stated

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The End date value is not defined (start date plus term is the likely rule, but the ticket does not say it). | Medium | Check it is display-only; record the value (Q-008). |
| It is not stated whether the Start date follows the Delivery date field if the dealer edits it on the form. | Low | Record-only (Q-008). |
| The products table's columns are not listed. | Low | Check every selected option appears; record the columns (Q-009). |

---

### REQ-005 — Pricing: cost, retail, subtotal, taxes and grand total

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to see the cost and retail prices with taxes and the total, so that I know what the contract costs before I generate it. |
| **Priority** | High — money values on a contract; a wrong tax or total is charged to the client or the dealer. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. Cost Price is shown.
2. Retails Price is shown, with Subtotal, Taxes (calculated based on the client's province) and Grand Total.

**Out of Scope:**

- None stated

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No tax rates, no taxed base (cost or retail) and no rule for a province changed on the form. The tax amount cannot be checked. | High | BLOCKED until Q-002 is answered. |
| AP-2456 (same feature set) asks to remove retail pricing and taxes from Permaplate surfaces; this ticket asks to show them. | High | BLOCKED until Q-003 is answered; record what the build shows. |
| The indentation leaves it unclear whether Subtotal/Taxes/Grand Total belong to Retail price only or to both prices. | Medium | Covered by Q-002. |

---

### REQ-006 — Generate Contract submit and redirect

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to submit the form and return to the quote, so that the contract is created and I can continue with the sale. |
| **Priority** | High — it is the action that creates the contract; the QA account reported an error on it on 2026-08-18. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. When the user submits the form with [Generate Contract], the user is redirected to the quote details page.
2. A download button is available to download the PDF.

**Out of Scope:**

- None stated

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Known unanswered failure: "when i submit generate contract, the error is shown" (Vinh Le - QC, 2026-08-18). | High | Treat a failure here as a likely re-occurrence; check the latest build first. |
| No error path is described (validation failure, server error). | Medium | Record-only (Q-006). |
| The created contract should also appear in the dealer "Esthetic protection contracts" list (AP-2443), but this ticket does not say so. | Low | Optional regression check. |

---

### REQ-007 — Contract PDF download

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to download the contract PDF from the quote, so that I can print it and have the client sign it. |
| **Priority** | High — the PDF is the client-facing deliverable of the contract. |
| **Source File** | AP-2428-dealer-permaplate-contract.md |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. A download button is available to download the PDF.
2. "Example of PDF:" — two example PDFs are attached (English and French front pages); their content is not transcribed in the ticket text.

**Out of Scope:**

- The PDF library used (HTMLtoPDF instead of Zend_PDF) is an implementation note to the developer, not a user-visible result.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The expected PDF content exists only in two attachments that were not read; which fields must appear, and in which language, is not stated in text. | Medium | Check the PDF opens and carries the form's values; record layout and language (Q-010). |

---

### REQ-008 — Contract keeps its own copy of option values and prices

| Field | Value |
|---|---|
| **User Story** | As Avantage Plus, we want each contract to store the option values, cost, retail and taxes at the moment it is created, so that later admin changes do not alter existing contracts. |
| **Priority** | Medium — a data-integrity rule from the reporter's comment; it matters for every existing contract but is observable only indirectly in the UI. |
| **Source File** | AP-2428-dealer-permaplate-contract.md (comment by Ken Nguyen, 2026-08-06) |
| **Recommended Test Types** | Regression · Edge-case |

**Acceptance Criteria:**

1. "store the permaplate contract options in a dedicated table (permaplate_contract_option) with all the values, not just referencing to the permaplate_quote_option and permaplate_option table" — Ken Nguyen, 2026-08-06.
2. "for permaplate_contract table, please store the cost, retail and taxes in dedicated tables … Using joins can create issues if the admin changes the values in the backend and will cascade all the existing contracts" — Ken Nguyen, 2026-08-06.

**Out of Scope:**

- Inspecting the database tables directly; the project tests through the UI only.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The rule is about storage. Through the UI it can only be seen by changing an admin option price and checking that an existing contract's PDF does not change. | Medium | Test it that way and restore the price afterwards. |
| Changing an admin option price alters shared staging data other tickets rely on. | Medium | Use one option, note its original value, restore it in the same case. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Create contract button | ✓ | ✓ | | | ✓ | | | |
| REQ-002 — Vehicle information prefill | ✓ | | ✓ | | ✓ | | | |
| REQ-003 — Owner information prefill | ✓ | ✓ | | | ✓ | | | |
| REQ-004 — Program summary | ✓ | | | | ✓ | | | |
| REQ-005 — Pricing and taxes | ✓ | | ✓ | ✓ | | | | |
| REQ-006 — Generate Contract submit | ✓ | ✓ | | ✓ | | | | |
| REQ-007 — Contract PDF download | ✓ | | | | ✓ | | | |
| REQ-008 — Values stored at creation | | | ✓ | ✓ | | | | |

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
| Q-001 | The Year field is described as "Text field with the vehicle's model prefilled". What value should the Year field be prefilled with? | REQ-002 | Blocking | Open | — | Ken Nguyen |
| Q-002 | Which amount is taxed (cost price, retail price, or both), what rate applies per province, and if the dealer changes the Province on the form, which province drives the taxes? | REQ-005 | Blocking | Open | — | Ken Nguyen |
| Q-003 | AP-2456 asks to remove retail pricing and taxes from Permaplate surfaces. Should this contract form still show Retail price, Subtotal, Taxes and Grand Total as AP-2428 states? | REQ-005 | Blocking | Open | — | Ken Nguyen |
| Q-004 | Which page is "the quote page" that carries the create-contract button — the quote details page or the Permaplate quote page? | REQ-001 | Judgement | Open | — | Ken Nguyen |
| Q-005 | Should the create-contract button be hidden or disabled when the quote has no Permaplate selection, or when a contract was already generated for the quote? | REQ-001 | Judgement | Open | — | Ken Nguyen |
| Q-006 | Which form fields are required, what formats are validated, what error is shown on a failed submit, and are edits to prefilled fields saved only to the contract or also back to the vehicle/client? | REQ-002, REQ-003, REQ-006 | Judgement | Open | — | Ken Nguyen |
| Q-007 | Which client phone number is "phone1" (Phone res) and which is "phone2" (Phone cell)? | REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-008 | How is the End date calculated, and does the Start date follow the Delivery date if the dealer edits it on the form? | REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-009 | Which columns should the Selected protection products table show? | REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-010 | Which fields must the generated PDF contain, and in which language is it generated (the ticket attaches English and French examples)? | REQ-007 | Judgement | Open | — | Ken Nguyen |
| Q-011 | Was the Generate Contract error reported by QA on 2026-08-18, and the missing contract reported on 2026-08-14, fixed in the current build? | REQ-001, REQ-006 | Info | Open | — | Minh Lưu |
| Q-012 | The PDF is to be generated with HTMLtoPDF instead of Zend_PDF — no user-visible result depends on the library. | REQ-007 | Info | Open | — | Minh Lưu |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-002 | Year field prefill value contradicts its label (Q-001) | High | Open |
| REQ-005 | Tax rates, taxed base and province source not stated (Q-002) | High | Open |
| REQ-005 | Conflict with AP-2456 on showing retail price and taxes (Q-003) | High | Open |
| REQ-006 | Unanswered QA report of an error on Generate Contract (2026-08-18) | High | Open |
| REQ-001 | Unanswered QA report that no Permaplate contract was shown (2026-08-14) | High | Open |
| REQ-001 | "Quote page" not named; button conditions for no-Permaplate / existing contract not stated | Medium | Open |
| REQ-002, REQ-003 | No field validation or persistence of edits stated | Medium | Open |
| REQ-004 | End date rule not stated | Medium | Open |
| REQ-007 | PDF content only in unread attachments | Medium | Open |
| REQ-008 | Storage rule observable only by changing shared admin data | Medium | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

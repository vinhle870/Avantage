# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, Quote › Road Side Protection (AutoShield contract) (Jira AP-2225)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2225-dealer-area-autoshield-create-contract.md`
**Total requirements found:** 6

---

## Executive Summary

AP-2225 lets a dealer turn a Road Side Protection quote into a real contract with
**AutoShield**, the outside company that sells the road-side protection product. AutoShield
is reached through its own web API (an *API* is a set of web addresses one system calls to
ask another system for data or to make it do something). On a vehicle quote, the dealer opens
the **Road side protection** page. There the system shows AutoShield's products and their
prices (the *autoShield quote*, delivered by AP-2188) and a form of vehicle and client fields
that is filled in from the quote. The dealer can **Save** the form, and can click **Generate
Contract** (*Générer le contrat* in French). Generating logs in to AutoShield, makes sure the
chosen financing company exists at AutoShield as a *lender* (creating it if it does not),
creates the contract and then opens an **autoShield contract page** that shows the contract
number, seventeen contract fields and a link to the contract PDF.

Six requirements were extracted from the ticket's Given/When/Then blocks and from the field
mapping the reporter, Ken Nguyen, wrote in a comment on 2025-04-14. Eleven testability risks
were flagged, three of them High. The most important are: (1) everything that happens inside
the backend when Generate Contract is clicked — the AutoShield login, the lender check, the
contract creation — cannot be watched from the dealer screens, so it can only be proven by
its visible result, a contract page with an AutoShield contract number; (2) the ticket does
not say what the dealer sees when AutoShield refuses or fails, so an error path exists that no
criterion describes; and (3) the ticket does not say how the client, vehicle and surcharges
fields — which are whole records, not single values — should be displayed on the contract
page.

No open question is **Blocking**: every acceptance criterion has a main expected result that
can be written from the words of the ticket. Nine questions are **Judgement** — the tests will
record what the build does on those points rather than guess — and three are **Info**.

Overall testability is rated **MEDIUM**. The visible parts (product list, prefilled fields,
button label, saved data, contract page fields, PDF link) can all be checked on screen. The
backend steps and the error paths cannot be observed directly, and every generated contract
is a real record in AutoShield's test system that cannot be removed from the dealer portal.

---

## Requirements Detail

### REQ-001 — AutoShield products and pricing on the Road side protection page

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to see the AutoShield products available for my quoted vehicle with their prices so that I can offer road-side protection to the client. (Inferred — the ticket has no user story.) |
| **Priority** | High — the page is the entry point to the whole feature. If no product or price appears, the dealer cannot choose a coverage and no contract can be generated. |
| **Source File** | AP-2225-dealer-area-autoshield-create-contract.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. Given a dealer user has created a vehicle's quote, when the user is on the quote > 'Road side protection' page, then the autoShield-quote is created (AP-2188) with a list of products available and its pricing.

**Out of Scope:**

- How AutoShield calculates the prices. The prices come from AutoShield's API; the dealer portal only displays them.
- Creating the autoShield quote itself belongs to AP-2188. This ticket only relies on it.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The prices come from AutoShield's test system, so QA has no independent source to compare them with. Only that a product list with prices appears can be proven, not that the prices are correct. | Medium | Check that every listed product shows a price and term, and record the values seen. Do not judge the amounts. |
| The ticket does not say which products or tiers must appear for a given vehicle. | Low | Record the products and tiers shown (Q-008). |

---

### REQ-002 — Vehicle and client fields prefilled from the quote

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want the contract form to be filled in from the quote so that I do not retype the vehicle and client details. (Inferred.) |
| **Priority** | High — these values are sent to AutoShield and printed on the contract. A wrong default (for example a wrong VIN or sale price) produces a wrong contract. |
| **Source File** | AP-2225-dealer-area-autoshield-create-contract.md |
| **Recommended Test Types** | Functional · Edge-case · UI |

**Acceptance Criteria:**

1. There is a list of fields for Vehicle and Client info that is prepopulated with the quote data.
2. The default for each vehicle field is the one Ken Nguyen (reporter) stated in his comment of 2025-04-14, quoted in the capture: VIN = the quote vehicle's VIN; Stock Number = the quote vehicle's stock number; Condition = the quote vehicle's condition; Odometer Reading = the vehicle's current mileage; Purchase Price = the vehicle's sale price; In Service Date = delivery date, or today if empty; Purchase Date = delivery date, or today if empty; Delivery Date = the quote vehicle's delivered-at date; Classification Date = empty; Purchase Type = "Delivery date"; Financed Amount = the financing amount, or the vehicle sale price if empty; Interest Rate = the quote financing's interest rate; Sale Price (CAD) = the quote vehicle's price; Financing Company = the quote financing's financing company.
3. "These are the default values that can be overridden by the user when filling out the form" (same comment).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The mapping covers vehicle fields only. No client field (name, email, phone, address, language) is listed, so which client fields exist and where each default comes from is not stated. | Medium | Check that client fields shown match the quote's client; record which fields exist (Q-001). |
| The developer asked on 2025-04-16 whether Purchase Type really comes from the delivery date ("Is there any mistake?"), and no written answer follows. | Medium | Record what Purchase Type shows; do not judge it (Q-002). |
| The "or today if empty" and "or vehicle sale price if empty" fallbacks need a quote with no delivery date and a quote with no financing. | Low | Use a fresh quote without a sales contract or financing for the fallback case. |
| The mapping says the Financing Company comes through `getInterestRate()->getFinancingCompany()`, which reads like a typing slip; the meaning (the quote financing's company) is clear. | Low | Compare with the financing company chosen on the quote's financing page. |

---

### REQ-003 — 'Generate Contract' button and its French label

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want a clearly labelled button to generate the contract so that I know how to finish the sale of the protection. (Inferred.) |
| **Priority** | Medium — a wrong label confuses the dealer but does not stop the feature. |
| **Source File** | AP-2225-dealer-area-autoshield-create-contract.md |
| **Recommended Test Types** | UI · Regression |

**Acceptance Criteria:**

1. There is a button 'Generate Contract'.
2. In French the button reads 'Générer le contrat'.

**Out of Scope:**

- French labels for the other fields and buttons — the ticket gives only this one.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The project's own page map (quote-creation.md, mapped 2026-10) recorded a single button named "Save and Generate Contract" on this page, while the ticket describes two separate buttons, 'Save' and 'Generate Contract'. The ticket is the requirement; the page map only warns that the build may differ. | High | Test the label exactly as the ticket states it in both languages. If the build differs, the result is judged at execution, not here (Q-003). |

---

### REQ-004 — Save stores the data in the autoShield quote, separate from the vehicle's quote

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to save what I entered on the Road side protection page so that I can come back later without losing it, and without changing the vehicle's quote. (Inferred.) |
| **Priority** | High — losing the dealer's input, or silently overwriting the vehicle quote's data, would corrupt either the contract or the quote. |
| **Source File** | AP-2225-dealer-area-autoshield-create-contract.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. When the user clicks on the 'Save' button, then the autoShield, vehicle and client data is saved in the autoShield quote (separate from the vehicle's quote).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Separate from the vehicle's quote" can be proven only negatively: after changing a prefilled value and saving, the quote's own vehicle and client data must be unchanged. | Medium | Change a value (for example the odometer reading) on the Road side protection page, save, reload, and check both that the page keeps the new value and that the quote's vehicle page keeps the old one. |
| The ticket names no required field and no validation rule, and does not say what the dealer sees after a successful save. | Medium | Record the confirmation shown and the behaviour with an empty field (Q-004). |

---

### REQ-005 — Generate Contract creates the contract at AutoShield (backend steps)

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want Generate Contract to register the contract with AutoShield so that the client is covered. (Inferred.) |
| **Priority** | High — this is the purpose of the ticket. If the contract is not created at AutoShield, the client pays for protection that does not exist. |
| **Source File** | AP-2225-dealer-area-autoshield-create-contract.md |
| **Recommended Test Types** | Functional · Negative · API |

**Acceptance Criteria:**

1. When the user clicks on the 'Generate Contract' button, the backend app calls the AutoShield login API with the username and password.
2. It gets the selected financing company and checks the financing company's autoshieldLenderID field (AP-2226). If it is empty, it calls the create lender API, then stores the returned lender ID.
3. It creates the contract via the AutoShield create contract REST API, using the financing company's autoshieldLenderID as the lenderId field.

**Out of Scope:**

- The AutoShield login credentials and API configuration.
- The autoshieldLenderID field on the financing company is introduced by AP-2226.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| All three steps run in the backend. This project tests through the user interface only, so the calls themselves cannot be watched. They can only be proven by their visible result: a contract page with an AutoShield contract ID (REQ-006). | High | Treat a contract page with a contract ID as proof that login and creation worked. Do not claim the individual calls were checked. |
| The ticket does not say what the dealer sees when AutoShield refuses the login, the lender creation or the contract (for example AutoShield down, a missing required value). Bug AP-2258 showed one such failure: the Quote Dashboard with an error message. | High | Record the error shown for any failure seen; do not invent the expected message (Q-005). |
| Whether a stored lender ID can be seen anywhere (for example on the financing company in the Admin portal) is not stated, so the "store the returned lender ID" step may not be observable. | Medium | If the Admin financing company page shows the field, record it before and after; otherwise mark the step not observable (Q-006). |
| The ticket does not say what happens when the quote has no financing company, although the lender step needs one. | Medium | Record the behaviour on a quote without financing (Q-007). |
| Every Generate Contract click creates a real contract in AutoShield's test system, which the dealer portal cannot delete. | Low | Keep the number of generated contracts small and list them in the execution log. |

---

### REQ-006 — The autoShield contract page

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want to see the created contract and its PDF so that I can confirm the coverage and hand the document to the client. (Inferred.) |
| **Priority** | High — this page is the only proof the dealer has that the contract exists, and the PDF is the document the client receives. |
| **Source File** | AP-2225-dealer-area-autoshield-create-contract.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. After Generate Contract, the user is redirected to the autoShield contract page.
2. The page's data is retrieved from the AutoShield get contract REST API.
3. The user can see the AutoShield contract ID.
4. The user can see these fields from the API response: appNumber, statusCode, effectiveDate, expiryDate, termInMonths, tier, product.name, client, vehicle, coverageKm, provincialSalesTax, gstHst, totalTaxCAD, salePriceWithTaxCAD, deductible, surcharges, isPayed.
5. The user can see the PDF link taken from the response field documentationAggregate.url.

**Out of Scope:**

- The Road Side Protection contract list (`/road-side-protection-contracts`) — not mentioned in this ticket.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| client, vehicle and surcharges are whole records (a client has a name, email, address…), and the ticket does not say which parts to show or how. Labels and formats (dates, money, the true/false isPayed) are not stated either. | Medium | Check each of the 17 items is present; record its label and format (Q-008). |
| The developer wrote on 2025-04-22 that the PDF link "cannot be used directly, as it will automatically download". The ticket does not say whether clicking the link should open the PDF or download it. | Medium | Check that the link produces the contract PDF; record whether it opens or downloads (Q-009). |
| QA cannot see the API response, so "retrieved from the get contract API" can only be proven by values that match what was entered (client, vehicle, term, tier). | Low | Compare the shown client, vehicle, term and tier with the values chosen before generating. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Products and pricing | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Prefilled vehicle and client fields | ✓ | | ✓ | | ✓ | | | |
| REQ-003 — Generate Contract label (EN/FR) | | | | ✓ | ✓ | | | |
| REQ-004 — Save to the autoShield quote | ✓ | ✓ | | ✓ | | | | |
| REQ-005 — Backend contract creation | ✓ | ✓ | | | | ✓ | | |
| REQ-006 — Contract page and PDF | ✓ | | ✓ | | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content. The API tick on REQ-005 records
that the requirement is an API integration; under this project's UI-only approach it is
proven through REQ-006's visible result.

**Data entities touched:** dealer user account; vehicle quote (its vehicle, client and
financing); financing company (its autoshieldLenderID field); the autoShield quote
(products, selected tier, saved form values); the AutoShield contract (created in
AutoShield's test system); the contract PDF.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which client fields are on the form, and which quote value fills each one? The 2025-04-14 mapping lists vehicle fields only. | REQ-002 | Judgement | Open | — | Ken Nguyen (reporter) |
| Q-002 | Should Purchase Type really default to the delivery date? The developer asked "Purchase type will get data from delivery date? Is there any mistake?" (2025-04-16) and no answer was written. | REQ-002 | Judgement | Open | — | Ken Nguyen |
| Q-003 | Are 'Save' and 'Generate Contract' meant to be two separate buttons, and does Generate Contract also save the form first? | REQ-003, REQ-004 | Judgement | Open | — | Ken Nguyen |
| Q-004 | Which fields are required before Save or Generate Contract, and what message appears when one is empty or invalid (for example a negative odometer reading)? | REQ-004, REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-005 | What should the dealer see when AutoShield fails — login refused, lender not created, or contract refused? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-006 | Where, if anywhere, can the stored autoshieldLenderID be seen after a lender is created? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-007 | What happens on Generate Contract when the quote has no financing company? | REQ-005 | Judgement | Open | — | Ken Nguyen |
| Q-008 | How should the record-type fields (client, vehicle, surcharges) and the dates, amounts and isPayed value be shown on the contract page, and with what labels? Which products and tiers are expected in the list? | REQ-001, REQ-006 | Judgement | Open | — | Ken Nguyen |
| Q-009 | Should the PDF link open the PDF in the browser or download it? The developer noted the AutoShield link downloads automatically (2025-04-22). | REQ-006 | Judgement | Open | — | Ken Nguyen |
| Q-010 | What are the French labels of the Save button and the form fields? Only 'Générer le contrat' is given. | REQ-003 | Info | Open | — | Ken Nguyen |
| Q-011 | Is the staging environment connected to AutoShield's test system (autoshieldweb-test), so that generated contracts are test records and not live ones? | REQ-005 | Info | Open | — | Ken Nguyen |
| Q-012 | Should the generated contract also appear in the Road Side Protection contract list? Not in this ticket's criteria. | REQ-006 | Info | Open | — | Ken Nguyen |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | The page map recorded one "Save and Generate Contract" button; the ticket describes two buttons | High | Open |
| REQ-005 | Backend calls (login, lender, create contract) are not observable through the UI | High | Open |
| REQ-005 | No error path is described for AutoShield failures | High | Open |
| REQ-001 | Prices come from AutoShield and cannot be independently checked | Medium | Open |
| REQ-002 | No client-field mapping; Purchase Type mapping questioned and unanswered | Medium | Open |
| REQ-004 | "Separate from the vehicle's quote" provable only negatively; no validation stated | Medium | Open |
| REQ-005 | Stored lender ID may not be visible; no-financing case not described | Medium | Open |
| REQ-006 | Display of record-type fields and PDF open/download behaviour not stated | Medium | Open |
| REQ-001 | Expected products and tiers not stated | Low | Open |
| REQ-005 | Generated contracts cannot be deleted from the dealer portal | Low | Open |
| REQ-006 | API retrieval provable only by matching entered values | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — pending Gate A

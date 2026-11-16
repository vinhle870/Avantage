# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, Quote › Road Side Protection (AutoShield contract) (Jira AP-2225)
**Date:** 2026-11-01 (re-run 2026-11-15 09:37–09:45 UTC: knowledge lookup under SKILL.md Steps 3b–3c, batch instruction of 2026-11-15 "double check all tickets' question" — Q-008 split into Q-008 and Q-013; Q-006, Q-012, Q-013 Answered by Jira Stories; Q-001, Q-003, Q-004, Q-005, Q-007, Q-008, Q-009, Q-010 Accepted; Q-002 and Q-011 stay Open as not knowledge questions; AP-2240 and AP-2241 recorded as delivered later Stories that supersede two points of the 2025-04 text)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2225-dealer-area-autoshield-create-contract.md` (including its section *Ticket changes since capture — 2026-11-15*); observed values from `qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md` (Dev, v2dev)
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

On 2026-11-01 no open question was **Blocking**: every acceptance criterion has a main expected result that
can be written from the words of the ticket. Nine questions are **Judgement** — the tests will
record what the build does on those points rather than guess — and three are **Info**.

**Knowledge lookup (2026-11-15, 09:37–09:44 UTC).** Every open question about product
knowledge was searched in Jira Story and Task tickets, any status (SKILL.md Step 3c; the
word sets and the tickets read are in "Knowledge lookup — queries tried" below). Three are
now **Answered** by a defining sentence in a Story: Q-006 (AP-2226 — the AutoShield Lender
ID is a field of the Admin financing-company edit page), Q-012 (AP-2431 — the Road side
protection contracts list holds every dealer program that has a contract ID) and Q-013,
split out of Q-008 (AP-2188 — the product list shows every product the AutoShield quote
returns, each tier labelled tier + term + suggested price). Eight are **Accepted**: no Story
or Task defines them, so the build's current actual result is the expected result, taken
from the 2026-11-01 execution log where it shows it, else recorded at the next execution.
Two stay **Open** because they are not knowledge questions: Q-002 asks whether the
reporter's own mapping sentence is a mistake, and Q-011 asks how an environment is
configured. Nothing was posted to Jira.

Three limits keep these answers from weakening the ticket. Where the AC states the result,
the AC wins over the actual result: the page must still show client fields (Q-001) and a
'Generate Contract' button (Q-003), so AP2225_003 and AP2225_007 stay FAIL under AP-2508.
An error page, HTTP 5xx or a lost value is still a FAIL (Q-005, Q-007). And no Story that is
not delivered changes an AC point: AP-2505 (QC) describes a dedicated "Generate Contract"
page, but it is not delivered, so it changes nothing here.

**Two delivered later Stories supersede points of the 2025-04 text.** Both were created
after AP-2225, are Done, and explicitly change the quote › road side protection page:
- **AP-2241** (Done, "Autoshield: remove classification date"): "Then the classification
  date field is no longer available (not needed)". The Classification Date line of the
  2025-04-14 mapping (REQ-002 AC 2) no longer applies.
- **AP-2240** (Done, "Autoshield get lenders from API instead of syncing from V2"): "The
  backend should not create new autoshield lenders VIA the API anymore". The create-lender
  part of REQ-005 AC 2 no longer applies. The page's financing-company list now comes from
  AutoShield's lender list API ("The value is the ID field from the response").

With these, the classification is: no **Blocking** question; **Judgement** — Q-006 and
Q-013 Answered, Q-001, Q-003, Q-004, Q-005, Q-007, Q-008, Q-009 Accepted, Q-002 Open;
**Info** — Q-012 Answered, Q-010 Accepted, Q-011 Open. The next design pass must revise
AP2225_013 (it expects a new lender ID to be stored) and drop the Classification Date check
from AP2225_002, and should turn the record-only steps on Accepted questions into
record-and-accept steps.

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
| The ticket does not say which products or tiers must appear for a given vehicle. | Low | Closed 2026-11-15 — Q-013 Answered (AP-2188): every product the AutoShield quote returns is listed, each tier labelled tier + term + suggested price. Check the list against that rule; record the values seen. |

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

> **Superseded point — 2026-11-15 (knowledge lookup):** the Classification Date line of AC 2
> no longer applies. AP-2241 (Story, Done, "Autoshield: remove classification date"):
> "Given the user is on the quote ❭ road side protection page When the user sees the form
> Then the classification date field is no longer available (not needed)". The next design
> pass removes Classification Date from AP2225_002 (and may check that it is absent).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The mapping covers vehicle fields only. No client field (name, email, phone, address, language) is listed, so which client fields exist and where each default comes from is not stated. | Medium | Check that client fields shown match the quote's client; record which fields exist (Q-001 Accepted 2026-11-15 for which fields and sources; the AC still requires client fields). |
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

> **Superseded point — 2026-11-15 (knowledge lookup):** the create-lender part of AC 2 ("If it
> is empty, it calls the create lender API, then stores the returned lender ID") no longer
> applies. AP-2240 (Story, Done, "Autoshield get lenders from API instead of syncing from
> V2"), whose Given is "A dealer user is on the quote ❭ road side protection page": "The
> backend should not create new autoshield lenders VIA the API anymore". The same Story makes
> the page's financing-company list come from AutoShield's lender list ("The value is the ID
> field from the response"). AC 1, the rest of AC 2 and AC 3 stand. The next design pass
> revises AP2225_013, which expects a new lender ID to be stored.

**Out of Scope:**

- The AutoShield login credentials and API configuration.
- The autoshieldLenderID field on the financing company is introduced by AP-2226.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| All three steps run in the backend. This project tests through the user interface only, so the calls themselves cannot be watched. They can only be proven by their visible result: a contract page with an AutoShield contract ID (REQ-006). | High | Treat a contract page with a contract ID as proof that login and creation worked. Do not claim the individual calls were checked. |
| The ticket does not say what the dealer sees when AutoShield refuses the login, the lender creation or the contract (for example AutoShield down, a missing required value). Bug AP-2258 showed one such failure: the Quote Dashboard with an error message. | High | Record the error shown for any failure seen; do not invent the expected message (Q-005). |
| Whether a stored lender ID can be seen anywhere (for example on the financing company in the Admin portal) is not stated, so the "store the returned lender ID" step may not be observable. | Medium | Closed 2026-11-15 — Q-006 Answered: the field is on the Admin financing-company edit page (AP-2226), and AP-2240 ends lender creation, so no new lender ID is expected after Generate Contract. |
| The ticket does not say what happens when the quote has no financing company, although the lender step needs one. | Medium | Record the behaviour on a quote without financing (Q-007 Accepted 2026-11-15 — recorded at execution; an error page or HTTP 5xx is still a FAIL). |
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

- The Road Side Protection contract list (`/road-side-protection-contracts`) — not mentioned in this ticket. AP-2431 (Done) defines it (Q-012 Answered); it is not a criterion of AP-2225.

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
| Q-001 | Which client fields are on the form, and which quote value fills each one? The 2025-04-14 mapping lists vehicle fields only. | REQ-002 | Judgement | Accepted | No Story/Task defines the client fields or their sources (searched: `issuetype in (Story, Task) AND text ~ "road side protection client"` — AP-2505, AP-2498, AP-2431; `… "roadside owner information"` — AP-2545, AP-2544, AP-2505; `… "autoshield client"` — AP-2498, AP-2431; all read: AP-2505 (QC) says only "vehicle and owner information on the left", AP-2545 (Deploy to staging) says only "Update the “Owner information” section when the dealer view when generating contract in order the standardize the “check out” process"; neither lists a field or its source) — current actual result accepted for which client fields exist and which quote value fills each, recorded at execution. Observed 2026-11-01 (AP2225_003): sections "Vehicle" and "Product info" only, client field count = 0. **The AC wins on presence:** "There is a list of fields for Vehicle and Client info that is prepopulated with the quote data" — a page with no client field stays FAIL (AP-2508). Not posted. | Ken Nguyen (reporter; shown in the 2026-11-08 QA comment; closed by knowledge lookup 2026-11-15) |
| Q-002 | Should Purchase Type really default to the delivery date? The developer asked "Purchase type will get data from delivery date? Is there any mistake?" (2025-04-16) and no answer was written. | REQ-002 | Judgement | Open | Not a knowledge question: it asks whether the reporter's own sentence "Purchase Type **Delivery date**" (Ken Nguyen, 2025-04-14) is a mistake — what the comment's author meant. The lookup was run anyway (searched: `… "purchase type autoshield"`, `… "purchase type delivery date"` — AP-2505, AP-2225 only; AP-2505 states no Purchase Type rule): no Story defines Purchase Type. Observed 2026-11-01 (AP2225_002): no Purchase Type field on Dev. Recorded, not judged. Shown again in the 2026-11-08 QA comment; no answer. | Ken Nguyen |
| Q-003 | Are 'Save' and 'Generate Contract' meant to be two separate buttons, and does Generate Contract also save the form first? | REQ-003, REQ-004 | Judgement | Accepted | **Two buttons — the AC states it:** "There is a button 'Generate Contract'" and "The user clicks on the 'Save' button" (capture, Acceptance criteria). The AC wins over the actual result, so a page without a 'Generate Contract' button stays FAIL (AP2225_007, AP-2508). **Whether Generate Contract saves first:** no Story/Task defines it (searched: `… "generate contract save roadside"` — AP-2546, AP-2544, AP-2537, AP-2505, AP-2498, AP-2496, AP-2494; `… "save and generate contract"` — also AP-2562, AP-2560, AP-2559, AP-2503, AP-2428, AP-2188, AP-2057, AP-1960, AP-1166; roadside hits read: AP-2505 (QC) "Contract creation, invoice, financing, and PDF behaviour stay unchanged", AP-2544 / AP-2546 / AP-2562 state no rule; the others are not about the roadside page) — current actual result accepted, recorded at execution (Dev had no contract-generating button on 2026-11-01, AP2225_007). Not posted. | Ken Nguyen (closed by knowledge lookup 2026-11-15) |
| Q-004 | Which fields are required before Save or Generate Contract, and what message appears when one is empty or invalid (for example a negative odometer reading)? | REQ-004, REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: `… "roadside required field validation"` — AP-2505, AP-2499, AP-2498; `… "policy sale price"` — AP-2505, AP-2493, AP-2238; read: AP-2498 (QC) defines "a required **VIN** and an optional **Year**" for the make/model form submitted with "Continue", not for Save or Generate Contract; the others state no rule) — current actual result accepted. Observed 2026-11-01 (AP2225_009 step 2): "Policy Sale price*" is the only field marked required on the form; the message for an empty field is recorded at execution. Not posted. | Ken Nguyen (closed by knowledge lookup 2026-11-15) |
| Q-005 | What should the dealer see when AutoShield fails — login refused, lender not created, or contract refused? | REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: `… "autoshield error message"`, `… "autoshield contract error"` — AP-2505, AP-2498, AP-2225; read also AP-2424 (Done): AP-2424 and AP-2498 define only the no-products message "In order to get a quote for road side protection, please specify the make and model of the vehicle.", a quote failure, not a contract failure) — current actual result accepted, recorded at execution. Limit: an error page, an HTTP 5xx, or the Quote Dashboard with an error in place of the contract page (as in AP-2258) is still a FAIL, because REQ-006 AC 1 states the redirect to the contract page. Not posted. | Ken Nguyen (closed by knowledge lookup 2026-11-15) |
| Q-006 | Where, if anywhere, can the stored autoshieldLenderID be seen after a lender is created? | REQ-005 | Judgement | Answered | AP-2226 (Story, Done, "Add autoShieldLenderID in the financing company"): "Add new field in the financing company entity" and "Given The admin user is logged into the admin area When The user is editing a financing company Then The user is able to save the AutoShield Lender ID field" — the value is seen on the Admin financing-company edit page (observed 2026-11-01, AP2225_013 step 1: `/admin/financing-company/39/edit`, "Auto shield lender id" empty). AP-2240 (Story, Done): "The backend should not create new autoshield lenders VIA the API anymore" — so no new lender ID is expected after Generate Contract (see the REQ-005 note). Searched: `… "autoshield lender id"`, `… "lender financing company autoshield"` — AP-2240, AP-2226, AP-2225. Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-007 | What happens on Generate Contract when the quote has no financing company? | REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: `… "roadside protection no financing"` — AP-2546, AP-2505, AP-2499, AP-2493, AP-2491; `… "autoshield financing cash"` — AP-2505; read: AP-2546 says only "Update the “Financing information” section when the dealer view when generating contract in order the standardize the “check out” process", AP-2499 is about GAP and creditors insurance, AP-2493 and AP-2491 state no roadside financing rule; AP-2240 (Done) makes the page's financing-company list come from AutoShield's lender list but does not say what happens without one) — current actual result accepted, recorded at execution (AP2225_012 was BLOCKED on 2026-11-01). An error page or HTTP 5xx is still a FAIL. Not posted. | Ken Nguyen (closed by knowledge lookup 2026-11-15) |
| Q-008 | How should the record-type fields (client, vehicle, surcharges) and the dates, amounts and isPayed value be shown on the contract page, and with what labels? (Split 2026-11-15: the product and tier part is now Q-013.) | REQ-006 | Judgement | Accepted | No Story/Task defines it (searched: `… "autoshield contract page"` — AP-2543, AP-2537, AP-2505, AP-2498, AP-2493, AP-2431, AP-2424, AP-2314, AP-2237, AP-2225, AP-2188; `… "autoshield contract details"` — the same set less AP-2498, AP-2314, AP-2237, AP-2188; read: AP-2431 says only "Then the user is taken to the already existing autoshield contract page", AP-2237 adds a cancel action for status OPEN_SUBMITTED; none gives labels or formats) — current actual result accepted. Observed 2026-11-01 (execution log, observation under AP2225_010, existing contract page `/quote/6254/auto-shield-contract/2698`): Contract ID, App Number, Status Code, Effective/Expiry Date, Term In Months, Tier, Product Name, client and vehicle sub-fields, Coverage Km, Provincial Sales Tax, Total Tax CAD, Sale Price With Tax CAD, Deductible, Is Payed, en/fr PDF links. **The AC wins on presence:** all 17 listed items must be shown (gstHst and surcharges were not in that observation — checked at execution). Not posted. | Ken Nguyen (closed by knowledge lookup 2026-11-15) |
| Q-009 | Should the PDF link open the PDF in the browser or download it? The developer noted the AutoShield link downloads automatically (2025-04-22). | REQ-006 | Judgement | Accepted | No Story/Task defines it (searched: `… "autoshield contract pdf"` — AP-2505, AP-2431, AP-2225; `… "roadside contract pdf download"` — AP-2496, AP-2431, AP-2422; read: AP-2422 (Done) "The dealer can still create roadside protection contract and download the PDF" is about finalized quotes and does not say whether the link opens or downloads; AP-2431's "Download contract PDF button with the PDF icon" is for the Chubb lists; AP-2496 is a quote-level download of all documents) — current actual result accepted, recorded at execution (AP2225_011 was BLOCKED on 2026-11-01). Not posted. | Ken Nguyen (closed by knowledge lookup 2026-11-15) |
| Q-010 | What are the French labels of the Save button and the form fields? Only 'Générer le contrat' is given. | REQ-003 | Info | Accepted | No Story/Task defines them (searched: `… "Sauvegarder roadside"` — no result; `… "road side protection french"` — AP-2505, AP-2225, AP-2188; read: AP-2188 (Done) gives only the page title, French "Programme de protection de la route"; AP-2423 (Done) only the duplicate-VIN warning) — current actual result accepted. Observed 2026-11-01 (AP2225_007 step 4): buttons "Retour", "Éditer", "Choisir", "Continuer", "Sauvegarder"; heading "Programme de protection de la route". The 2026-11-08 QA comment adds that "Product info" and "Policy Sale price*" stay in English on the French page. Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-011 | Is the staging environment connected to AutoShield's test system (autoshieldweb-test), so that generated contracts are test records and not live ones? | REQ-005 | Info | Open | Not a knowledge question: it asks how an environment is configured (access and setup), not how the product behaves. Not searched. Execution now runs on Dev (v2dev), which reaches AutoShield (five priced products, 2026-11-01). | Ken Nguyen |
| Q-012 | Should the generated contract also appear in the Road Side Protection contract list? Not in this ticket's criteria. | REQ-006 | Info | Answered | AP-2431 (Story, Done, "Dealer portal: List autoshield contracts, list Chubb and Gap contracts"), under "WHEN the user is configured with autoshield user ID and dealer ID": "The page contains a datagrid component with all the dealer's road side protection programs that contains a contract_id", and "IF the user permission is account owner, then allow all contracts of the current dealer to be listed. Else, only display the contracts that belongs to the user who created the quote". Overrides no AC (the list is outside AP-2225's criteria). Observed 2026-11-01 (AP2225_015 step 2): `/road-side-protection-contracts` lists contracts 2698 and 2697. Searched: `… "road side protection contracts list"`, `… "autoshield contracts list"` — AP-2505, AP-2498, AP-2431, AP-2424, AP-2225, AP-2188. Not posted. | — (closed by knowledge lookup 2026-11-15) |
| Q-013 | Which products and tiers are expected in the product list? (Split from Q-008 on 2026-11-15.) | REQ-001 | Judgement | Answered | AP-2188 (Story, Done, "Dealer area: Auto shield integration (Get Quote)" — the autoShield quote this AC cites): "Radio buttons of all the products returned in the QuoteAPI’s response.products array" and, for tier prices, "Radio buttons of all the tierPrices for the product" with "Label: response.products[].warrantyTierPrices[].tier + response.products[].warrantyTierPrices[].termInMonths + response.products[].warrantyTierPrices[].suggestedPriceCAD". AP-2238 (Done) adds the card for tier-based products. Observed 2026-11-01 (AP2225_001 step 3): five options, each "product \| tier \| term \| price$*", tier "Standard". Searched: `… "autoshield products tier"` — AP-2498, AP-2238, AP-2225, AP-2188. Not posted. | — (closed by knowledge lookup 2026-11-15) |

### Knowledge lookup — queries tried (2026-11-15, 09:37–09:44 UTC)

Run under SKILL.md Step 3c with the Jira adapter's knowledge-lookup query
`issuetype in (Story, Task) AND text ~ "<words>"`, any status, `--paginate 0:100`. A first
broad query `… "autoshield"` returned 18 Stories (AP-2543, AP-2537, AP-2505, AP-2498,
AP-2493, AP-2441, AP-2431, AP-2424, AP-2423, AP-2314, AP-2241, AP-2240, AP-2238, AP-2237,
AP-2226, AP-2225, AP-2221, AP-2188); every one about the roadside page or AutoShield
contracts was read. Nothing was posted to Jira.

| # | Word sets tried | Hits read | Defining sentence? | Status |
|---|---|---|---|---|
| Q-001 | "road side protection client" · "roadside owner information" · "autoshield client" | AP-2505, AP-2498, AP-2431, AP-2545, AP-2544 | None — AP-2505 / AP-2545 name an owner section without fields | Accepted (AC wins on presence) |
| Q-002 | "purchase type autoshield" · "purchase type delivery date" | AP-2505 | None | Open — not a knowledge question |
| Q-003 | "generate contract save roadside" · "save and generate contract" | AP-2546, AP-2544, AP-2537, AP-2505, AP-2498, AP-2496, AP-2494, AP-2562, AP-2560, AP-2559 (AP-2503, AP-2428, AP-2057, AP-1960, AP-1166 are not about the roadside page) | Two buttons: the AC itself. Save-first: none | Accepted (AC wins on the button) |
| Q-004 | "roadside required field validation" · "policy sale price" | AP-2505, AP-2499, AP-2498, AP-2493, AP-2238 | None for Save / Generate (AP-2498 covers the make/model form only) | Accepted |
| Q-005 | "autoshield error message" · "autoshield contract error" | AP-2505, AP-2498, AP-2424 | None for contract failures | Accepted (error page / 5xx still FAIL) |
| Q-006 | "autoshield lender id" · "lender financing company autoshield" | AP-2240, AP-2226 | Yes — AP-2226, with AP-2240 | Answered |
| Q-007 | "roadside protection no financing" · "autoshield financing cash" | AP-2546, AP-2505, AP-2499, AP-2493, AP-2491, AP-2240 | None | Accepted |
| Q-008 | "autoshield contract page" · "autoshield contract details" | AP-2543, AP-2537, AP-2505, AP-2493, AP-2431, AP-2424, AP-2314, AP-2237, AP-2188 | None for labels / formats | Accepted (AC wins: 17 items) |
| Q-009 | "autoshield contract pdf" · "roadside contract pdf download" | AP-2505, AP-2431, AP-2496, AP-2422 | None | Accepted |
| Q-010 | "Sauvegarder roadside" (0 hits) · "road side protection french" | AP-2505, AP-2188, AP-2423 | None for Save / form fields | Accepted |
| Q-011 | Not run — not a knowledge question (environment configuration) | — | — | Open (Info) |
| Q-012 | "road side protection contracts list" · "autoshield contracts list" | AP-2431, AP-2505, AP-2498, AP-2424, AP-2188 | Yes — AP-2431 | Answered |
| Q-013 | "autoshield products tier" (and the broad "autoshield") | AP-2188, AP-2238, AP-2498 | Yes — AP-2188 | Answered |

Delivered later Stories found by the same queries that change the page (see the Executive
Summary and the notes under REQ-002 and REQ-005): AP-2241 (Classification Date removed) and
AP-2240 (no lender creation). Stories seen but not used to change an AC point, because they
are not delivered or state no rule: AP-2505 (QC — a dedicated "Generate Contract" page at
`/quote/{quoteId}/road-side-protection-create-contract`), AP-2498 (QC — VIN + Year on the
make/model form), AP-2544 / AP-2545 / AP-2546 (Deploy to staging — "standardize" the
vehicle, owner and financing sections of the generate-contract view for Roadside
Protection; no field or rule stated).

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | The page map recorded one "Save and Generate Contract" button; the ticket describes two buttons | High | Open |
| REQ-005 | Backend calls (login, lender, create contract) are not observable through the UI | High | Open |
| REQ-005 | No error path is described for AutoShield failures | High | Open — Q-005 Accepted 2026-11-15 (recorded at execution; error page / 5xx still FAIL) |
| REQ-001 | Prices come from AutoShield and cannot be independently checked | Medium | Open |
| REQ-002 | No client-field mapping; Purchase Type mapping questioned and unanswered | Medium | Open — Q-001 Accepted 2026-11-15 (AC still requires client fields); Q-002 Open (not a knowledge question) |
| REQ-004 | "Separate from the vehicle's quote" provable only negatively; no validation stated | Medium | Open |
| REQ-005 | Stored lender ID may not be visible; no-financing case not described | Medium | Closed for the lender ID — Q-006 Answered (AP-2226; AP-2240 ends lender creation); Q-007 Accepted 2026-11-15 |
| REQ-006 | Display of record-type fields and PDF open/download behaviour not stated | Medium | Closed — Q-008 and Q-009 Accepted 2026-11-15 (AC still requires all 17 items and the PDF link) |
| REQ-001 | Expected products and tiers not stated | Low | Closed — Q-013 Answered 2026-11-15 (AP-2188) |
| REQ-005 | Generated contracts cannot be deleted from the dealer portal | Low | Open |
| REQ-006 | API retrieval provable only by matching entered values | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design — pending Gate A (R1) on the 2026-11-15 knowledge-lookup re-run

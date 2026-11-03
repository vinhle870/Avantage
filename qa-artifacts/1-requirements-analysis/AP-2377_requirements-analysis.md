# Requirements Analysis Report

**Project:** Avantage Plus v2 — Customer portal, online warranty purchase ("Buy a warranty online")
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2377-customer-portal-changes.md (Jira AP-2377, Story, status QC, fix version 3.6.0)
**Total requirements found:** 6

---

## Executive Summary

AP-2377 changes the customer-facing purchase flow at `/customer/avantage-plus/buy`, the
page where a member of the public buys a warranty without a dealer. The ticket has no
separate acceptance-criteria field; its description is written as six Given / When / Then
blocks, and each block is treated here as one acceptance criterion. Three of those criteria
point at screenshots rather than spelling their content out, so the requirement capture
transcribes the visible text of each screenshot, and this analysis quotes that
transcription.

Six requirements were extracted: new "current manufacturer / extended warranty" fields at
the end of the vehicle form (REQ-001), the Client Info step moving ahead of the Coverage
step (REQ-002), a FORM L25 privacy-consent checkbox and a "Get rates now" button on the
Client Info step (REQ-003), that button leading to the Coverage step (REQ-004), the summary
page listing the surcharges the customer answered YES to (REQ-005), and those surcharges
appearing on the admin warranty details page once the warranty is paid (REQ-006).

No question blocks testing: the main expected result of every criterion can be written
from words in the capture. Eight open questions remain — six **Judgement** (they affect
edge, negative or display results, which the test cases will record rather than judge)
and two **Info**. The highest testability risk is REQ-006: it needs a paid warranty, and
no test payment method for the customer portal on staging is recorded anywhere in the
project's knowledge base. Overall testability is rated **MEDIUM** — the happy path is
clear, but validation rules, French wording and the payment step are not specified.

---

## Requirements Detail

### REQ-001 — Vehicle step: current-warranty fields at the end of the form, and the "Continue" button

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Inferred: as a customer buying a warranty online, I want to give the details of the manufacturer or extended warranty my vehicle still has, so that the new warranty starts at the right time. |
| **Priority** | Medium — the fields collect information about the vehicle's existing cover, which the on-screen help text ties to when the new warranty begins; a missing field loses that information but does not stop a purchase. |
| **Source File** | requirements/AP-2377-customer-portal-changes.md — AC 1, attachment A1 |
| **Recommended Test Types** | Functional · UI · Negative · Edge-case · Regression |

**Acceptance Criteria:**

1. When the customer enters the vehicle information on `/customer/avantage-plus/buy`, "the following fields are added at the end of the form" — per attachment A1, below `Market Value*`: a section headed `Current manufacturer/extended warranty` with the help text `If your vehicle is still under manufacturer, or extended warranty coverage please include the contract number.` / `This warranty will begin after the current warranty has expired, or if the current warranty has already expired, this warranty will begin thirty (30) days from the date of purchase.`, then the fields `Warranty Number`, `Warranty end date` and `Warranty mileage limit`.
2. "The ‘continue’ button label is ‘Continue’ (french: ‘Continuer’)".

**Out of Scope:**

- None stated. The old per-customer portal (`/customer/273/quote-request`) is named only "for reference" (see Q-008).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No validation is described for the three new fields — whether they are required, what format the end date takes, whether the mileage limit must be a number. A tester cannot say what should happen when the customer types something wrong. | Medium | Record the actual behaviour (Q-001); fail only on objective faults such as an error page or a value that is lost. |
| The French labels of the new section and fields are not given. A French-speaking customer may see untranslated English or a missing label, and nobody has said what is correct. | Low | Record the French labels as displayed (Q-002). |

**Data entities touched:** the online quote request (purchase in progress) and its vehicle record — the new current-warranty number, end date and mileage limit are stored on it, if stored at all.

---

### REQ-002 — After the vehicle form, the customer goes to Client Info, not Coverage

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Inferred: as a customer, I want to give my personal details before I see coverage options, so that the rates offered can depend on who I am. |
| **Priority** | High — it changes the order of the whole purchase flow; if the steps are wired wrongly, a customer can be sent to the wrong page or skip a step, and the sale is lost. |
| **Source File** | requirements/AP-2377-customer-portal-changes.md — AC 2, attachment A3 (old step order) |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. When the vehicle form is submitted, "The user is redirected to the ‘Client Info' step (switch order with 'coverage’ step)". Attachment A3 shows the old step bar `Info du véhicule` · `Choisir la couverture` · `Info Client` · `Sommaire`; after the switch, Client Info comes second and Coverage third.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say where the customer goes after the Coverage step. The old flow went Client Info → Summary, so the new flow might go Coverage → Summary, but this is not written down. | Low | Record where the Coverage step leads (Q-003). |

**Data entities touched:** the online quote request (its current step).

---

### REQ-003 — Client Info step: FORM L25 consent checkbox and a "Get rates now" button

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Inferred: as the business, I want the customer to confirm they have read FORM L25, so that the company meets Quebec's private-sector privacy law. |
| **Priority** | High — the checkbox is a legal consent required by the Act respecting the protection of personal information in the private sector (Quebec's privacy law); if it is missing, the company collects personal data without the confirmation it needs. |
| **Source File** | requirements/AP-2377-customer-portal-changes.md — AC 3, attachment A2 |
| **Recommended Test Types** | Functional · UI · Negative · Regression |

**Acceptance Criteria:**

1. "The client info page contains the checkbox to opt for FORM L25" — per attachment A2, an unticked checkbox below the `Email*` field with the text `I confirm that I have read FORM-L25, at the request of Les Produits Avantage Plus Inc., all in accordance with the requirements of the Act respecting the protection of personal information in the private sector.*`
2. "The continue button label is  ‘Get rates now’ (French: ‘Demander un devis’)".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket says "opt for", which suggests the checkbox is optional, while the text in A2 ends with an asterisk, which on this form marks required fields. What happens when the customer leaves it unticked is not stated. | Medium | Record the behaviour (Q-004); the test does not decide which is right. |
| What the green `FORM-L25` link opens, and the French text of the checkbox, are not given. A broken link would mean the customer confirms reading a document they cannot open. | Medium | Record the link target and the French text (Q-005); a link that leads to an error page is an objective fault. |
| The button in A2 reads `Continue`, while the sentence right after the image says the label is ‘Get rates now’. | Low | Follow the sentence (Q-006 explains why); the image's highlight marks only the checkbox. |

**Data entities touched:** the client record of the online quote request (name, address, phones, email) and the FORM L25 consent flag, if it is stored.

---

### REQ-004 — "Get rates now" leads to the Coverage step

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Inferred: as a customer, I want to see coverage options after giving my details, so that I can pick a warranty. |
| **Priority** | High — it is the only way forward from the Client Info step; if it fails, no customer can reach a price. |
| **Source File** | requirements/AP-2377-customer-portal-changes.md — AC 4 |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. When the customer clicks ‘Get rates now’, "The user is redirected to the coverage step".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

None identified.

**Data entities touched:** the online quote request (its current step).

---

### REQ-005 — The summary page lists the surcharges answered YES

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Inferred: as a customer, I want the summary to show the extra-cost options I said yes to, so that I can check them before paying. |
| **Priority** | High — the summary is the last page before payment; if a chosen surcharge is missing from it, the customer pays without seeing what they are paying for. |
| **Source File** | requirements/AP-2377-customer-portal-changes.md — AC 5, attachment A3 |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. When the user is at the summary page, "The page lists info about the surcharges selected as YES" — per attachment A3, under `Description du programme`, the line `Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI` ("Is this vehicle equipped with an air suspension system? YES") for program CVE · CVE 60m/0km · BEV on a 2020 TESLA Model 3 Plus.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say what a "surcharge" is or which programs ask surcharge questions. The only example is the air-suspension question in A3, for a CVE BEV program on a Tesla. A tester must find a vehicle and program that asks such a question. | Medium | Use the example in A3 as the test data (2020 TESLA Model 3 Plus, VIN 5YJ3E1EA0LF734293, program CVE 60m/0km BEV); if the program does not ask a surcharge question on staging, record the case BLOCKED. |
| Whether a surcharge answered NO is hidden, or shown with "NO", is not stated. | Medium | Record the behaviour (Q-007). |

**Data entities touched:** the online quote request — the chosen program and its surcharge answers.

---

### REQ-006 — After payment, the chosen surcharges appear on the admin warranty details page

| Field | Value |
|---|---|
| **User Story** | Not stated in the ticket. Inferred: as an Avantage Plus administrator, I want to see which surcharges a customer chose, so that a later claim is handled against the right cover. |
| **Priority** | High — the admin warranty page is the record staff use for claims; a surcharge missing there could lead to a valid claim being refused or the wrong price being honoured. |
| **Source File** | requirements/AP-2377-customer-portal-changes.md — AC 6 |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. When the warranty is paid and the contract is created, "The surcharges that were selected is displayed in the admin panel warranty details page".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The test needs a paid warranty, but the ticket does not describe the payment step and the project knowledge base holds no test payment method (card) for the customer portal on staging. Without one, this criterion cannot be executed at all. | High | The test case for REQ-006 stays BLOCKED until a staging test payment method is supplied; it is listed as a known blocker. |
| The admin warranty details page is not mapped in the knowledge base (only 10 of 49 admin routes are), and the ticket does not say where on that page or in what words the surcharges appear. | Medium | Find the route at execution and write it back to the knowledge base; record the wording (Q-007 covers YES/NO display). |

**Data entities touched:** the payment, the warranty contract it creates, and the contract's stored surcharge answers as read by the Admin portal.

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Current-warranty fields and "Continue" button | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| REQ-002 — Client Info before Coverage | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — FORM L25 checkbox and "Get rates now" | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-004 — "Get rates now" opens Coverage | ✓ | | | ✓ | | | | |
| REQ-005 — Summary lists YES surcharges | ✓ | | ✓ | | ✓ | | | |
| REQ-006 — Admin warranty page shows surcharges | ✓ | | | ✓ | | | | |

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
| Q-001 | Are `Warranty Number`, `Warranty end date` and `Warranty mileage limit` required or optional, and what does each accept (end date format and whether a past date is allowed; mileage as whole numbers only)? A1 shows no asterisk on them, but no sentence states the rule. | REQ-001 | Judgement — the fields' presence is testable from A1; only the negative and edge results need the answer | Open | — | Ken Nguyen (reporter) |
| Q-002 | What are the French labels of the new section, its help text and the three fields? Only the English form is shown. | REQ-001 | Judgement — a display result in French needs it | Open | — | Ken Nguyen |
| Q-003 | Where does the customer go after the Coverage step in the new order — to the Summary step? The ticket states only Vehicle → Client Info and Client Info → Coverage. | REQ-002, REQ-004 | Judgement — the main results (AC 2 and AC 4) are clear; only the step after Coverage needs the answer | Open | — | Ken Nguyen |
| Q-004 | Must the FORM L25 checkbox be ticked before "Get rates now" works? The ticket says "opt for" (optional) while A2's text ends with an asterisk (the form's mark for required). | REQ-003 | Judgement — the checkbox's presence is testable; only the unticked (negative) result needs the answer | Open | — | Ken Nguyen |
| Q-005 | What does the `FORM-L25` link open, and what is the French text of the checkbox? | REQ-003 | Judgement — display results need it | Open | — | Ken Nguyen |
| Q-006 | The button in image A2 reads `Continue`, while the sentence directly after it says the label is ‘Get rates now’ (French ‘Demander un devis’). Which is right? | REQ-003 | Info — the written sentence is the requirement and the image's highlight marks only the checkbox, so the test follows the sentence; the question is kept so the author can see the mock-up disagrees | Open | — | Ken Nguyen |
| Q-007 | Is a surcharge answered NO hidden from the summary page and the admin warranty details page, or shown as NO? And under what heading or wording do surcharges appear on the admin page? | REQ-005, REQ-006 | Judgement — the YES case is testable; the NO case and the admin wording need the answer | Open | — | Ken Nguyen |
| Q-008 | Does the old per-customer portal named "for reference" (`/customer/273/quote-request`) also have to change, or is it only a reference for the look of the new pages? | REQ-001–REQ-005 | Info — the acceptance criteria name only `/customer/avantage-plus/buy`, so no test result in this ticket depends on it | Open | — | Ken Nguyen |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-006 | No test payment method for the customer portal on staging is known, so a warranty cannot be paid and the admin check cannot be reached. | High | Open |
| REQ-001 | No validation rules for the three new fields (Q-001). | Medium | Open |
| REQ-003 | Optional versus required consent checkbox is contradictory (Q-004); link target and French text unknown (Q-005). | Medium | Open |
| REQ-005 | "Surcharge" is not defined; only one example program and question are known (A3); NO answers unspecified (Q-007). | Medium | Open |
| REQ-006 | Admin warranty details page not mapped; surcharge wording there unspecified (Q-007). | Medium | Open |
| REQ-001 | French labels of the new fields not given (Q-002). | Low | Open |
| REQ-002 | The step after Coverage is not stated (Q-003). | Low | Open |
| REQ-003 | Mock-up button text disagrees with the written label (Q-006). | Low | Open |

Other context: the ticket is marked as blocked by AP-2394 "[AP-2311]Customer Claim is
getting error" (Bug, Done since 2026-02-11). The QA's comment of 2026-01-07 said it was
still happening then. It concerns customer claims, not the purchase flow, so it changes no
expected result here; it is noted so the executor is not surprised by a claim-related
error.

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

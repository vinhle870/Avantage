# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page `/quote/{id}/details`, "Summary of products" → Extended warranty (Jira AP-2497)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2497-add-extended-warranty-capture-missing-vehicle.md`
**Total requirements found:** 5

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/test-centralized.md

---

## Executive Summary

AP-2497 removes a dead end in the dealer's quote. Today, when a dealer clicks the **+**
button on the *Extended warranty* row of the quote's "Summary of products" card and the
quote's vehicle is missing data, a modal shows only the message *"There are no eligible
program for the vehicle. Please contact us for more information."* The dealer then has to
leave the quote, edit the vehicle in inventory and come back (both ticket screenshots
show this on quote #6432…, a Cadillac ATS 2022 with no mileage). The story replaces that
with a short vehicle form inside the same flow. The form holds the six vehicle values the
*eligibility engine* (the server logic that decides which extended-warranty programs a
vehicle qualifies for) uses — Year, Kilometers, Make, Model, Fuel type and Vehicle type —
prefilled from the quote's vehicle. The eligible programs, or the "no program" notice,
show below it. Submitting saves the vehicle and re-runs eligibility without leaving the
screen.

Five requirements were extracted, one per acceptance criterion: the form is shown in the
extended-warranty flow with the results below it; it has exactly the six fields and not
the full vehicle editor; it is prefilled from the stored vehicle; a submit saves the
values and refreshes the results in place; and empty, non-numeric or negative Year or
Kilometers give a field-level error with nothing saved. Every criterion is written in
Given/When/Then form with an observable outcome, so **no question blocks testing**. Nine
Judgement questions and two Info questions remain — mainly what the form shows for a
value that is not stored, how Make/Model/Fuel type/Vehicle type are validated, the year
and kilometre limits, the error wording, and whether the saved values also change the
inventory vehicle that other quotes share. The tests will record what the build does on
those points instead of guessing.

Two testability risks are rated High. First, the extended-warranty modal is not mapped in
the domain knowledge — `quote-creation.md` still describes the older "Click here to
create a warranty" link to `/quote/{id}/warranty/edit`, not the "Summary of products"
**+** button the ticket shows — so the test cases must navigate by the screenshot and the
executor must map the modal on first use. Second, submitting the form changes a real
vehicle record; the shared test vehicle 915 must not be used, because a changed Year or
Kilometers would silently break other tickets' tests. Each case must create or pick its
own vehicle and quote.

Overall testability is rated **MEDIUM**: the outcomes are easy to see on screen, but
the eligibility rules themselves are not described, so the tests can prove that the
results *refresh*, not that the *right* programs are listed.

---

## Requirements Detail

### REQ-001 — The vehicle form is shown in the extended-warranty flow, with results below it

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the vehicle fields that decide warranty eligibility shown when I add an extended warranty, so that a missing value never leaves me at a dead end. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — this is the purpose of the ticket; without the form the dealer is still stuck at the "no eligible program" message and cannot sell the warranty from the quote. |
| **Source File** | AP-2497-add-extended-warranty-capture-missing-vehicle.md — description and AC "The form is visible in the extended-warranty flow"; screenshots image-20261016-131221.png and image-20261016-131331.png |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given a quote with a vehicle, When the dealer opens the add-extended-warranty flow, Then the required-field form is shown, and the eligible-program results or the "no program" notice render below it."
2. Description verbatim: "The eligible-program results render below the form."
3. Description verbatim: "the fields are always in reach and the dealer never hits the dead-end *"There are no eligible program for the vehicle. Please contact us for more information."* or has to go back to inventory to adjust the vehicle."

**Out of Scope:**

- None stated. Roadside Protection, Gap Insurance, Creditors insurance and Esthetic protection rows of the same card are not mentioned.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The modal opened by the Extended warranty **+** button is not mapped in the domain knowledge; `quote-creation.md` still lists the older "Click here to create a warranty" → `/quote/{id}/warranty/edit` route. Whether both entry points must show the form is not stated (Q-001). | High | Navigate by the screenshot (Summary of products → Extended warranty **+**). Record whether any other warranty entry point exists and what it shows. Write the modal back to `quote-creation.md` after the first run. |
| "The "no program" notice" is not quoted in the AC; the description quotes the old dead-end text. Whether the notice keeps that wording is not stated (Q-008). | Low | Judge that *a* no-program notice shows below the form; record its exact text. |
| To see both outcomes (programs listed / no program) the test needs one vehicle that qualifies and one that does not. The eligibility rules are not described (Q-006). | Medium | Use a vehicle with a missing value for the "no program" case and a complete, recent vehicle for the "programs listed" case; record which programs appear. |

---

### REQ-002 — The form exposes only the six required fields, all editable

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want only the fields that matter for eligibility, so that fixing the vehicle takes seconds. (Inferred.) |
| **Priority** | Medium — extra fields would slow the dealer but not lose data. |
| **Source File** | AP-2497-add-extended-warranty-capture-missing-vehicle.md — AC "Form exposes only the required fields" |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. AC verbatim: "Given the form is displayed, Then it contains only these required fields, each editable: **Year**, **Kilometers**, **Make**, **Model**, **Fuel type**, and **Vehicle type** (the properties in "Required fields" above), and it does not expose the full vehicle editor."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The AC points to a "Required fields" section "above" that does not exist in the ticket (Q-002). The six names in the AC itself are taken as the full list. | Low | Judge against the six named fields; record any field beyond them as a FAIL of "only these fields". |
| The control type and allowed values of Fuel type and Vehicle type (free text, drop-down, which options) are not stated, nor are the French labels the dealer UI may show (Q-003). | Low | Judge "editable" only: each control accepts a new value. Record the control types, options and labels. |
| "The full vehicle editor" is not defined beyond "not these six fields". | Low | Treat any of VIN, Price, Condition, Designation, transmission, engine, cylinders, turbo, 4x4/AWD or manufacturer-warranty fields on the form as the full editor exposed. |

---

### REQ-003 — The form is prefilled from the quote's stored vehicle

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form to show what is already stored, so that I only correct what is missing or wrong. (Inferred from the description.) |
| **Priority** | High — a blank or wrong prefill would make the dealer re-enter, or worse, overwrite correct vehicle data with a guess. |
| **Source File** | AP-2497-add-extended-warranty-capture-missing-vehicle.md — description and AC "Form is prefilled from the existing vehicle" |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the quote's vehicle already has stored values, When the dealer opens the form, Then each of the six required fields shows the vehicle's existing value — Year from `Vehicle::$year`, Kilometers from `Vehicle::$kilometers`, Make from `Vehicle::$make`, Model from `Vehicle::$model`, Fuel type from `Vehicle::$fuelType`, Vehicle type from `Vehicle::$type`."
2. Description verbatim: "The form is **prefilled with the values stored on the quote's vehicle**, so the dealer only corrects what is missing or wrong."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| `Vehicle::$…` names are code properties (the stored attributes of the vehicle record). The tester can only see them through the dealer UI — the vehicle details page `/vehicle/{id}/details` and its edit form. | Medium | Read the expected values from the vehicle's details/edit page before opening the form, and compare field by field. |
| What a field shows when its stored value is empty (for example Kilometers, which AP-2477 made nullable, or the screenshot's vehicle with no mileage) is not stated (Q-004). | Medium | Judge the stored fields; record what the empty field shows. |

---

### REQ-004 — Submitting saves the vehicle and re-evaluates eligibility in place

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want my corrections saved and the programs refreshed on the same screen, so that I never go back to inventory. (Inferred from the description.) |
| **Priority** | High — this is where data is written. A value that is shown as saved but not stored, or a refresh that sends the dealer elsewhere, defeats the ticket. |
| **Source File** | AP-2497-add-extended-warranty-capture-missing-vehicle.md — description and AC "Submit persists and re-evaluates in place" |
| **Recommended Test Types** | Functional · Regression · Edge-case |

**Acceptance Criteria:**

1. AC verbatim: "Given the dealer corrects or confirms the prefilled values, When the form is submitted, Then the values persist on the quote's `Vehicle` (a reload shows them), eligibility is re-evaluated, and the results below the form refresh in the same view/modal without a full page navigation; the form remains visible with the saved values."
2. Description verbatim: "Submitting updates the vehicle and re-runs eligibility on the same screen"

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Eligibility is re-evaluated" is only observable through the results. Without the eligibility rules (Q-006), the test can prove the results area changed, not that the right programs are listed. | Medium | Use a correction that moves the vehicle from "no program" to a list of programs (fill a missing Kilometers/Year), so the refresh is visible. Record the programs. |
| "A reload shows them" — the capture does not say whether that means reloading the quote page and re-opening the form, or the vehicle details page (Q-005). | Low | Check both: re-open the form after a page reload, and read the vehicle's details page. |
| The quote's vehicle is an inventory vehicle that other quotes can share (vehicle 915 has a Quotes tab). Whether saving here changes the inventory record for every quote is not stated (Q-007). | High | Never use shared vehicle 915. Give each case its own vehicle and quote; record whether the inventory vehicle changed. |
| "Without a full page navigation" must be checked objectively. | Low | Compare the page URL before and after submit and confirm the modal stays open. |

---

### REQ-005 — Invalid Year or Kilometers gives a field-level error and saves nothing

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want a clear error on a bad Year or Kilometers, so that no broken value reaches the vehicle record. (Inferred.) |
| **Priority** | High — a partial save would corrupt the vehicle record that the warranty contract is priced from. |
| **Source File** | AP-2497-add-extended-warranty-capture-missing-vehicle.md — AC "Validation" |
| **Recommended Test Types** | Negative · Edge-case · Functional |

**Acceptance Criteria:**

1. AC verbatim: "Given empty, non-numeric, or negative year/kilometers, When the form is submitted, Then a field-level error is shown and no partial update is persisted."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Validation of Make, Model, Fuel type and Vehicle type is not stated — only Year and Kilometers are covered (Q-009). | Medium | Record what an empty Make/Model/Fuel type/Vehicle type does on submit. |
| Limits are not stated: a year in the future or far in the past, a decimal year or kilometre value, zero kilometres, a very large kilometre value (Q-010). | Medium | Judge only empty, non-numeric and negative values; record the build's behaviour on the boundaries. |
| The error message text is not given. | Low | Judge "an error shown next to the offending field"; record the text. |
| "No partial update is persisted" needs a combined submit (one valid change + one invalid value) to be proven. | Medium | Change a valid field (e.g. Model) together with an invalid Year, submit, then reload and confirm the Model change was not saved either. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Form shown in the extended-warranty flow | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Only the six fields, editable | ✓ | | | | ✓ | | | |
| REQ-003 — Prefilled from the stored vehicle | ✓ | | ✓ | ✓ | | | | |
| REQ-004 — Submit saves and refreshes in place | ✓ | | ✓ | ✓ | | | | |
| REQ-005 — Year/Kilometers validation | ✓ | ✓ | ✓ | | | | | |

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
| Q-001 | Which entry points count as "the add-extended-warranty flow" — only the **+** on the Extended warranty row of "Summary of products" (shown in the screenshot), or also any other warranty link on the quote page (e.g. "Click here to create a warranty")? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-002 | The AC refers to "the properties in "Required fields" above", but the ticket has no "Required fields" section. Is the six-field list in the AC complete? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | What control and allowed values do Fuel type and Vehicle type use (drop-down options, free text), and what labels does the French UI show? | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | What should a field show when the vehicle has no stored value for it (e.g. no Kilometers, as in the screenshot)? Empty, a placeholder, or an immediate error? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | "A reload shows them" — reload of the quote page with the form re-opened, or the vehicle's details page, or both? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | Which vehicle values make a program eligible or not (the eligibility rules)? Without them a test can confirm the results refresh, but not that the right programs are listed. | REQ-001, REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | Does saving the form change the inventory vehicle itself (and so every other quote on that vehicle), or only this quote's copy? | REQ-004 | Info | Open | — | Nicolas-Eric Tain |
| Q-008 | Does the "no program" notice below the form keep the old text "There are no eligible program for the vehicle. Please contact us for more information.", or does it change? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | Are Make, Model, Fuel type and Vehicle type also validated (e.g. required) on submit? The Validation AC names only Year and Kilometers. | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | What are the limits for Year (future year, very old year, decimals) and Kilometers (zero, decimals, maximum length — the column is 15 characters)? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | Does the form apply to every vehicle type group (car, RV, boat, construction), and are the six fields the same for each? | REQ-002 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | The extended-warranty modal is not mapped in the domain knowledge; navigation relies on the ticket screenshot | High | Open |
| REQ-004 | Submitting changes a real vehicle record; shared vehicle 915 must not be used and each case needs its own vehicle | High | Open |
| REQ-001, REQ-004 | Eligibility rules are not described, so only the refresh of the results — not their correctness — can be judged | Medium | Open |
| REQ-003 | Expected values can only be read through the vehicle's details/edit page; empty-value display not stated | Medium | Open |
| REQ-005 | Validation of the other four fields and the Year/Kilometers boundaries are not stated | Medium | Open |
| REQ-002 | The referenced "Required fields" section is missing from the ticket; Fuel type / Vehicle type control types unknown | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — no Blocking question

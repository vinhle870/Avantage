# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page `/quote/{id}/details`, "Summary of products" → Extended warranty (Jira AP-2497)
**Date:** 2026-11-01 · **Re-analysed:** 2026-11-15 (knowledge lookup, Steps 3b–3c) · **Reworked:** 2026-11-15T10:05Z (review R1 round 1, F-1–F-4)
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
Given/When/Then form with an observable outcome, so **no question blocks testing**. Twelve
questions are listed (10 Judgement, 2 Info). After the 2026-11-15 knowledge lookup in Jira,
three are answered — Q-002 by the ticket's own criterion, Q-003 by AP-211, AP-529 and
AP-2533, and Q-006 (the eligibility rules) by AP-257, AP-530, AP-706 and AP-533, with AP-810
as the dealer-eligibility condition — and seven are accepted as the build's current
behaviour because no Story or Task defines them. Two stay open, both about the ticket's own
words, which only the author can settle: Q-005 asks what "a reload shows them" means (both
readings are tested and both pass today), and Q-008 asks whether "never hits the dead-end"
means the old "no eligible program" message may still show below the form or must not show
at all (its wording is recorded, not judged). No question was posted to the tracker, and no
failed test case changes: where the ticket's own criterion states the result (Vehicle type,
a visible form, a visible field error), that criterion still decides it.

Two testability risks are rated High. First, the extended-warranty modal is not mapped in
the domain knowledge — `quote-creation.md` still describes the older "Click here to
create a warranty" link to `/quote/{id}/warranty/edit`, not the "Summary of products"
**+** button the ticket shows — so the test cases must navigate by the screenshot and the
executor must map the modal on first use. Second, submitting the form changes a real
vehicle record; the shared test vehicle 915 must not be used, because a changed Year or
Kilometers would silently break other tickets' tests. Each case must create or pick its
own vehicle and quote.

Overall testability is rated **MEDIUM**: the outcomes are easy to see on screen. The
eligibility rules are not in this ticket, but AP-257 (comment 10699) and AP-530 define them
for every warranty: a program term is listed only when its km and year limits are at or
above the vehicle's mileage and age, and its category, fuel-type and vehicle-type
eligibility include the vehicle's. Proving that the *right* programs are listed would still
need each program term's eligibility settings, which the dealer portal does not show.

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
| Control types are now known (Q-003, Answered 2026-11-15): Fuel type is a drop-down (gasoline, hybrid, BEV, diesel — AP-211); Vehicle type is a drop-down (Passenger, Motorcycle, Scooter, ATV / UTV, Snowmobile, Boat, PWC — AP-529, AP-2533), but the modal has no Vehicle type control at all (AP-2520). The French labels are not stated (Q-012). | Low | Judge "editable" only: each control accepts a new value; a missing Vehicle type control is a FAIL of AC "Form exposes only the required fields". Record the labels. |
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
| Q-001 | Which entry points count as "the add-extended-warranty flow" — only the **+** on the Extended warranty row of "Summary of products" (shown in the screenshot), or also any other warranty link on the quote page (e.g. "Click here to create a warranty")? | REQ-001 | Judgement | Accepted | No Story/Task defines it (searched: "create a warranty quote details", "Click here to create a warranty", "add extended warranty quote", "warranty edit quote") — current actual result accepted: the **+** on the Extended warranty row is the only entry point; no "Click here to create a warranty" link or other warranty entry exists on the quote page (execution log 2026-11-02, AP2497_002 step 4) | — |
| Q-002 | The AC refers to "the properties in "Required fields" above", but the ticket has no "Required fields" section. Is the six-field list in the AC complete? | REQ-002 | Judgement | Answered | The ticket's own text states the list: "Then it contains only these required fields, each editable: **Year**, **Kilometers**, **Make**, **Model**, **Fuel type**, and **Vehicle type** (the properties in "Required fields" above), and it does not expose the full vehicle editor." — capture, AC "Form exposes only the required fields". The missing "Required fields" section does not change the six names, so the five-field form stays a FAIL (AP-2520) | — |
| Q-003 | What control and allowed values do Fuel type and Vehicle type use (drop-down options, free text)? (The French-label part was split into Q-012 on 2026-11-15.) | REQ-002 | Judgement | Answered | Fuel type: "when creating a new vehicle, the form contains the “fuel type” field  as a select box with the following choices: “gasoline” “hybrid” “BEV” “diesel”" — AP-211 description (status Documentation). Vehicle type: "When creating a new vehicle, the dealer can choose the type Passenger, Motorcycle, Scooter, ATV / UTV, Snowmobile, Boat, PWC. Default value is Passenger" — AP-529 acceptance criteria (Done); and "Given the dealer is create a new quote When the form is rendering Then the type drop-down is positioned before the quote name with the label “Vehicle type”." — AP-2533 AC (Ready for release). None of them overrides AP-2497. Today's Fuel type drop-down (Choose, GASOLINE, BEV, DIESEL, HYBRID) matches AP-211. **Exception:** the modal has no Vehicle type control at all; AC "Form exposes only the required fields" requires one, so that FAIL stands (AP-2520) | — |
| Q-004 | What should a field show when the vehicle has no stored value for it (e.g. no Kilometers, as in the screenshot)? Empty, a placeholder, or an immediate error? | REQ-003 | Judgement | Accepted | No Story/Task defines it (searched: "vehicle kilometers empty", "kilometers placeholder", "kilometers validation") — current actual result accepted: Kilometers with no stored value shows an empty field, no placeholder and no error until submit; Fuel type with no stored value shows "Choose"; the form opens expanded (execution log 2026-11-02, Environment Observations, vehicle 1097 / quote 6505) | — |
| Q-005 | "A reload shows them" — reload of the quote page with the form re-opened, or the vehicle's details page, or both? | REQ-004 | Judgement | Open | Not a knowledge question: it asks what the author meant by the ticket's own words "a reload shows them", which only the author can say; no lookup applies. It decides no result today — the test cases check both readings and both show the saved values (AP2497_005, 006 steps 4–5) | Nicolas-Eric Tain |
| Q-006 | Which vehicle values make a program eligible or not (the eligibility rules)? Without them a test can confirm the results refresh, but not that the right programs are listed. | REQ-001, REQ-004 | Judgement | Answered | "When I am creating a warranty, the list of program terms should be available if ALL of the following conditions are met: eligibility km is higher or equal to vehicle km; eligibility year is higher or equal to vehicle age; eligibility categories contain the vehicle model condition; fuel type eligibility contains the vehicle fuel type" — AP-257 comment 10699, Ken Nguyen, 2020-08-11 (Done). Also "When dealer creates a quote warranty, if the list of programs available should only show the ones eligible for the vehicle’s type" — AP-530 AC (Done); "When dealer enters a car of year 2015 and current year is 2021, the vehicle age should be 6 instead of 7" — AP-706 (Task, Done); for boats and PWC the limit is hours, not kilometres: "when adding a warranty for a boat, the hours field should filter down all programs that meet the eligibility described in 'eligibility km/hr'" — AP-533 (Done). Dealer-eligibility condition (not a vehicle rule): "When a dealer creates a warranty contract, the list of programs available will be shown if the dealer is eligible" — AP-810 (Documentation). None of them overrides AP-2497 | — |
| Q-007 | Does saving the form change the inventory vehicle itself (and so every other quote on that vehicle), or only this quote's copy? | REQ-004 | Info | Accepted | No Story/Task defines it (searched: "quote vehicle inventory", "edit vehicle quote inventory", "quote_vehicle", "vehicle shared quotes") — current actual result accepted: the save changes the inventory vehicle itself; vehicles 1085, 1086, 1093 and 1096 show the values submitted in the modal on their own details/edit pages (execution log 2026-11-02, Environment Observations) | — |
| Q-008 | Does the "no program" notice below the form keep the old text "There are no eligible program for the vehicle. Please contact us for more information.", or does it change? | REQ-001 | Judgement | Open | Not a knowledge question: the description's 'never hits the dead-end "There are no eligible program for the vehicle. Please contact us for more information."' reads two ways — that message is never shown without the form, or it is never shown at all — and AC 'The form is visible…' does not quote the notice. No Story/Task defines the wording (searched: "no eligible program contact us", "eligible program message", "extended warranty eligible program"). Record-only: today the notice below the form reads 'There are no eligible program for the vehicle. Please contact us for more information.' (execution log 2026-11-02, quote 6505). | Nicolas-Eric Tain |
| Q-009 | Are Make, Model, Fuel type and Vehicle type also validated (e.g. required) on submit? The Validation AC names only Year and Kilometers. | REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: "required make model", "fuel type", "vehicle type fuel type") — current actual result accepted: an empty Brand (Make) or Model is refused with "This value should not be blank." and nothing is saved (AP2497_014); an empty Fuel type is recorded at execution; Vehicle type has no control to validate (AP-2520) | — |
| Q-010 | What are the limits for Year (future year, very old year, decimals) and Kilometers (zero, decimals, maximum length — the column is 15 characters)? | REQ-005 | Judgement | Accepted | No Story/Task defines it (searched: "valid year", "vehicle year range", "kilometers maximum", "kilometers validation", "year validation vehicle") — current actual result accepted: Year 2030 refused with "Please enter a valid year."; Kilometers 0 accepted and stored; a 16-digit Kilometers refused with "This value is too long. It should have 15 characters or less."; Kilometers 1500.5 refused with "Please enter a valid number of kilometers (0 or more)." (AP2497_012, 013). A very old year and a decimal Year are recorded at execution. **Exception:** AC "Validation" states that empty, non-numeric or negative values show a field-level error; that text wins, so the hidden-error FAILs stand (AP-2522) | — |
| Q-011 | Does the form apply to every vehicle type group (car, RV, boat, construction), and are the six fields the same for each? | REQ-002 | Info | Accepted | No Story/Task defines it (searched: "vehicle type group", "RV boat construction", "vehicle type fuel type") — current actual result accepted, recorded at execution: only Passenger vehicles were tested; the modal's Brand list also offers RV and boat makes (e.g. Airstream, Bayliner) (execution log 2026-11-02, Environment Observations) | — |
| Q-012 | What labels does the French dealer UI show for the six fields? (Split from Q-003 on 2026-11-15.) | REQ-002 | Judgement | Accepted | No Story/Task defines it (searched: "French labels vehicle", "translate vehicle form", "Type de carburant") — current actual result accepted, recorded at execution: the 2026-11-02 run used the English UI only (labels Brand, Model, Year, Kilometers, Fuel type) | — |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | The extended-warranty modal is not mapped in the domain knowledge; navigation relies on the ticket screenshot | High | Open |
| REQ-004 | Submitting changes a real vehicle record; shared vehicle 915 must not be used and each case needs its own vehicle | High | Open |
| REQ-001, REQ-004 | Eligibility rules are not in this ticket; AP-257 and AP-530 define them (Q-006), but the program terms' eligibility settings are not visible to the dealer, so the correctness of the list still cannot be judged from the dealer portal | Medium | Open |
| REQ-003 | Expected values can only be read through the vehicle's details/edit page; empty-value display not stated | Medium | Open |
| REQ-005 | Validation of the other four fields and the Year/Kilometers boundaries are not stated | Medium | Open |
| REQ-002 | The referenced "Required fields" section is missing from the ticket (the AC's six names are the list, Q-002); control types known from AP-211 / AP-529 / AP-2533 (Q-003), Vehicle type control missing in the modal (AP-2520); French labels not stated (Q-012) | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — no Blocking question

---

## Knowledge lookup — 2026-11-15

Run under Steps 3b–3c of the analyst skill, by the user's instruction of 2026-11-15
("double check all tickets' question"), on every question that was `Open`. Query form (Jira
adapter, *knowledge lookup*): `issuetype in (Story, Task) AND text ~ "<words>"`, any status.
Each plausible hit's description, acceptance-criteria field (customfield_10150) and comments were read. AP-2497 itself was re-read first:
its description and acceptance criteria are unchanged since capture, and its only new
comments are the QA's own (19452, 19531), so no answer came from the ticket.

| Question | Word sets tried | Hits read | Outcome |
|---|---|---|---|
| Q-001 | "create a warranty quote details"; "Click here to create a warranty" (no result); "add extended warranty quote"; "warranty edit quote" | AP-2503, AP-2491, AP-2493 (titles), AP-2498 | No sentence names the quote page's warranty entry points → Accepted |
| Q-002 | Not looked up: the ticket's own AC states the six fields | — | Answered from the capture |
| Q-003 | "vehicle type fuel type"; "fuel type"; "warranty eligibility" | AP-211, AP-529, AP-2533, AP-257, AP-1558 (title) | Defined by AP-211, AP-529, AP-2533 → Answered (French labels split into Q-012) |
| Q-004 | "vehicle kilometers empty"; "kilometers placeholder"; "kilometers validation" | AP-2477, AP-2498 | AP-2477 stores an empty Kilometers as NULL but says nothing about how the field is shown; AP-2498 describes the roadside form, not this one → Accepted |
| Q-005 | Not looked up: author intent about the ticket's own words | — | Stays Open |
| Q-006 | "extended warranty eligible program"; "eligibility vehicle kilometers year"; "warranty eligibility"; "program eligibility rules"; "eligible programs vehicle"; "eligible program vehicle" (from review R1, which surfaced AP-533) | AP-257, AP-42, AP-37, AP-530, AP-706, AP-533, AP-810, AP-2477 | Defined by AP-257 comment 10699, AP-530, AP-706 and AP-533 (boats and PWC filtered by hours, not kilometres); AP-810 is the dealer-eligibility condition → Answered |
| Q-007 | "quote vehicle inventory"; "edit vehicle quote inventory"; "quote_vehicle"; "vehicle shared quotes" | AP-2477, AP-2498, AP-2544, AP-2559, AP-2562 | No sentence says whether this modal saves the inventory vehicle or a quote copy → Accepted |
| Q-008 | "no eligible program contact us" (only AP-2497); "eligible program message"; "extended warranty eligible program" | AP-810, AP-42, AP-37 | No sentence gives the notice wording; the question is a two-way reading of the ticket's own description ("never hits the dead-end …"), which only the author can settle → stays Open (Judgement), wording recorded only |
| Q-009 | "required make model"; "fuel type"; "vehicle type fuel type" | AP-2477, AP-2498, AP-211 | AP-2477 makes Brand, Model, Year required on the new-quote form only; nothing for this modal → Accepted |
| Q-010 | "valid year"; "vehicle year range"; "kilometers maximum" (only AP-2497); "kilometers validation"; "year validation vehicle" | AP-2477, AP-2498, AP-2503 | No year or kilometre limits stated → Accepted |
| Q-011 | "vehicle type group"; "RV boat construction"; "vehicle type fuel type" | AP-2477, AP-2238 (title), AP-529, AP-533 | No sentence says which type groups this form serves; AP-533 (Done) filters boat programs by hours, not kilometres, so a boat or PWC may need an hours value the six fields do not name → Accepted (only Passenger vehicles tested) |
| Q-012 | "French labels vehicle"; "translate vehicle form"; "Type de carburant" (no result) | AP-2533 | AP-2533's own comment leaves French labels as an open question → Accepted |

**Later Stories that touch the same area — none overrides AP-2497.** AP-2544 (Deploy to
staging), AP-2559 (Deploy to staging), AP-2562 (Deploy to staging) and AP-2550 (In Progress)
redesign the vehicle card of the quote **checkout / generate-contract page**, not the
add-extended-warranty modal. AP-2562's "a flash message confirms the update and the form will
be hidden" and AP-2550's "if the input is hidden, the content will be not be collapsed to show
the error" describe that other page, so they do not change the result of AP-2521 (form
collapsed) or AP-2522 (hidden field error) in this modal.

**Effect on the test cases:** no result changes. The FAILs on AP-2520, AP-2521 and AP-2522
rest on the ticket's own criteria, which win over the current behaviour. The record-only
steps tied to Accepted questions (Q-001, Q-004, Q-007, Q-009–Q-012) can become
record-and-accept steps at the next design pass, and Q-006's rules can be cited where a case
records the program list. Q-005 and Q-008 stay Open: their steps stay record-only (Q-008:
the notice's wording is recorded, never judged) until the author answers.

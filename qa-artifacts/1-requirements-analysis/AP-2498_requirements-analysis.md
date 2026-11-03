# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, quote page `/quote/{id}/details`, "Summary of products" → Roadside Protection (Jira AP-2498)
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md`
**Total requirements found:** 8

related_docs: qa-artifacts/qa-docs/quote-creation.md, qa-artifacts/base-test/test-centralized.md

---

## Executive Summary

AP-2498 changes the vehicle form in the dealer's Roadside Protection (RSP) flow. RSP is
the roadside-assistance product priced by **AutoShield**, an outside pricing service the
application calls to get the products a vehicle qualifies for. Today, when a dealer clicks
the **+** button on the *Roadside Protection* row of the quote's "Summary of products"
card and AutoShield returns no products, a modal shows the red alert *"In order to get a
quote for road side protection, please specify the make and model of the vehicle."* and a
form with only **Make\***, **Model\*** and **Continue** (screenshot
image-20261016-160938.png, quote #6432, a Cadillac ATS 2022 with no VIN). When AutoShield
**does** return products, that form is not shown at all, so the dealer cannot correct the
vehicle from the RSP screen.

The story keeps the existing form — named `QuoteAutoShieldMakeModelType` in the code —
and adds a required **VIN** and an optional **Year**. The form must show above the
results in both states (products or no products), be prefilled from the quote, save its
values on the quote's RSP program record (`RoadSideProtectionProgram`) on submit, and
re-run the AutoShield quote on the same screen. A submit with only a VIN must be accepted;
if no products come back, the existing message shows **below** the form instead of an
error screen.

Eight requirements were extracted, one per acceptance-criterion block: the form is always
visible; it stays visible when make and model are already stored; it is the existing form
plus VIN and Year with only VIN required and no VIN lookup; the Make and Model lists come
from the AutoShield catalogue; the form is prefilled; a submit saves on the RSP program
and re-quotes in place; a VIN-only submit is accepted; and the results refresh without
hiding the form. Every criterion is written in Given/When/Then form with an observable
outcome, so **no question blocks testing**. Eleven Judgement questions and two Info
questions remain — chiefly which vehicle data makes AutoShield return products on
staging, which value wins when the RSP program and the vehicle both hold a VIN or year,
how VIN and Year are validated, and whether the saved values also change the vehicle.
The tests will record what the build does on those points instead of guessing.

Two testability risks are rated High. First, the outcome of the flow depends on what the
external AutoShield service returns, and the ticket does not say which vehicles produce
products — a test needs one quote that gets products and one that gets none. Second,
"saved on the `RoadSideProtectionProgram`" and "the Make options are the makes returned by
`VehicleMakeModelService::getMakes($quote)`" describe server internals the tester cannot
see; the tests can only judge them through what the screen shows (values coming back on
re-open, the Model list changing with the Make).

Overall testability is rated **MEDIUM**: the form's presence, fields, required marker and
position are easy to see, but the product results depend on an outside service and the
catalogue and storage are only visible indirectly.

---

## Requirements Detail

### REQ-001 — The vehicle form is always visible in the RSP flow, with results or the "no products" notice below it

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the vehicle form shown every time I add roadside protection, so that I can correct the vehicle whatever AutoShield returns. (Not stated in the ticket — inferred from the description.) |
| **Priority** | High — this is the purpose of the ticket. Without it the dealer still cannot correct the vehicle when products are returned. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — description and AC "The existing form is always visible in the RSP flow"; screenshots image-20261016-160938.png and image-20261016-161021.png |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given a quote with a vehicle, programs eligible or not, make/model known or empty, When the dealer opens the add-roadside-protection flow, Then the `QuoteAutoShieldMakeModelType` form is rendered, and the eligible-product results or the "no products" notice render below it."
2. Description verbatim: "Render that form above the product results in both states".

**Out of Scope:**

- None stated. Extended warranty (AP-2497), Gap Insurance, Creditors insurance and Esthetic protection rows of the same card are not mentioned.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Getting both states needs one quote for which AutoShield returns products and one for which it returns none. Which vehicle data produces each is not stated (Q-001). | High | Use the screenshot's case (vehicle with no VIN, no make/model) for "no products". For "products", use a complete, recent vehicle with a real VIN; record which tiers appear. A state that cannot be reached is BLOCKED, not FAIL. |
| The entry point in the screenshot is the **+** on the Roadside Protection row, which opens a modal. `quote-creation.md` maps a page `/quote/{id}/road-side-protection` with tier radios and **Save and Generate Contract**. Whether both are the same flow is not stated (Q-002). | Medium | Navigate by the screenshot. Record the URL or modal reached and write it back to `quote-creation.md`. |
| "The form is rendered" refers to a code form type. The tester sees it only as the Make/Model/VIN/Year controls. | Low | Judge by the visible controls and, where useful, the field `name` attributes. |

---

### REQ-002 — The form stays visible when make and model are already stored and products are returned

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to still see and change the vehicle after products appear, so that a wrong make or model does not lock me into the wrong price. (Inferred.) |
| **Priority** | High — this is the exact defect the ticket describes ("that form is not rendered at all"). |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — AC "Form stays visible when make/model are already set" |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the quote's RSP program already has make/model stored and products are returned, When the dealer opens the flow, Then the form is still rendered with the stored values and the product list appears below it — the form does not disappear because make/model are complete."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The precondition "the RSP program already has make/model stored" can only be created through the flow itself (submit Make/Model once, then re-open). | Medium | Build the precondition in the test case: submit the form, close, re-open. |
| Depends on AutoShield returning products for the stored make/model (Q-001). | High | As REQ-001. |

---

### REQ-003 — The form is the existing form plus VIN and Year; only VIN is required; no VIN lookup

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to give the VIN and year in the same short form, so that AutoShield gets what it needs without the full vehicle editor. (Inferred.) |
| **Priority** | High — the required flags decide whether a VIN-only submit (REQ-007) is possible, and a stray required Make/Model would bring back today's dead end. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — description and AC "The form is the existing form plus VIN and Year; VIN is the only required field" |
| **Recommended Test Types** | Functional · UI · Negative |

**Acceptance Criteria:**

1. AC verbatim: "Given the form is displayed, Then it contains exactly the existing fields — `vehicleMake`, `vehicleModel`, `continue` — plus a plain VIN text input and an editable Year input; it does not expose the full vehicle editor, client info or contract fields, and no new form type has been introduced."
2. AC verbatim: "Given the rendered form, Then the VIN input is required and Year/Make/Model carry no `required` constraint, and there is no VIN lookup/decode button and no `vinlookup` behaviour attached to the VIN field."
3. Description verbatim: "add the missing inputs — a required **VIN** and an optional **Year**".

**Out of Scope:**

- The full vehicle editor, client info and contract fields (explicitly excluded from the form).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "No new form type has been introduced" is a code statement. The UI shows it only indirectly, through the field `name` prefix shared by the old and new fields. | Low | Check that VIN and Year carry the same `name` prefix as `vehicleMake`/`vehicleModel`. Record the prefix. |
| How "required" shows to the dealer is not stated: the `required` attribute, an asterisk on the label, a server-side error, or all three. Today's form marks Make and Model with "\*" (Q-003). | Medium | Judge the `required` attribute (named in the AC). Record the labels and any asterisks. |
| VIN format checks (length 17, allowed characters) and Year format/range are not stated (Q-004, Q-005). | Medium | Judge "required" and "editable" only; record what a short VIN or odd year does. |
| "No `vinlookup` behaviour" is partly invisible. | Low | Judge: no lookup/decode button, and typing a full VIN does not auto-fill Year/Make/Model. |

---

### REQ-004 — The Make and Model options come from the AutoShield catalogue

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to pick make and model from the list AutoShield knows, so that the quote request matches its catalogue. (Inferred.) |
| **Priority** | Medium — a wrong list would give no products, but the dealer would see it at once. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — AC "Make and Model options come from the AutoShield catalogue" |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the RSP form is rendered, When the Make and Model dropdowns are populated, Then the Make options are the makes returned by `VehicleMakeModelService::getMakes($quote)`, and the Model options are the models returned by `VehicleMakeModelService::getModelsForMake($make, $quote)` for the selected make."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| `VehicleMakeModelService::getMakes` / `getModelsForMake` are server functions. QA has no independent copy of the AutoShield catalogue to compare the lists against (Q-006). | High | Judge what the screen can show: the Make list is not empty; the Model list depends on the selected Make (changes when Make changes); the Model list for a make holds models of that make only. Record the option counts and a sample. |
| How the Model list refreshes when Make changes (immediately, or only after Continue) is not stated (Q-007). | Low | Record the behaviour. |

---

### REQ-005 — The form is prefilled from existing data

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the form to show what the quote already knows, so that I only correct what is missing or wrong. (Inferred from the description: "prefill it from the quote".) |
| **Priority** | High — a wrong prefill would send AutoShield wrong data and could overwrite correct values on submit. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — description and AC "Prefill from existing data" |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the quote's vehicle/program already has stored values, When the dealer opens the form, Then VIN/Year show the stored RSP values (or the vehicle's VIN/year), and Make/Model show the stored RSP values; any field without a resolvable value falls back to its normal empty/placeholder state."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Which value wins when the RSP program and the vehicle both have a VIN or year and they differ is not stated; "(or the vehicle's VIN/year)" can be read as a fallback or as an alternative (Q-008). | Medium | Test the two unambiguous cases: no RSP values → the vehicle's VIN/year show; RSP values stored → judge that a stored value shows, and record which one when both differ. |
| Whether Make/Model ever prefill from the vehicle's own make/model (Cadillac/ATS) when the RSP program has none is not stated; the AC names only "the stored RSP values" (Q-009). | Medium | Record what Make/Model show on a fresh quote. Judge only that a stored RSP make/model shows. |
| The vehicle's VIN/year are read from the vehicle details page `/vehicle/{id}/details`. | Low | Read expected values there before opening the form. |

---

### REQ-006 — A submit saves the values on the RSP program and re-runs the AutoShield quote in place

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want my corrections saved and the price refreshed on the same screen, so that I never go back and forth. (Inferred from the description.) |
| **Priority** | High — this is where data is written; a value that looks saved but is not would give a wrong contract. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — description and AC "Submit persists on the RSP program and re-evaluates in place" |
| **Recommended Test Types** | Functional · Regression · Edge-case |

**Acceptance Criteria:**

1. AC verbatim: "Given the dealer corrects or confirms the values, When the form is submitted, Then VIN/Year/Make/Model persist on the `RoadSideProtectionProgram`."
2. Description verbatim: "on submit persist the values on the RSP program and re-run the AutoShield quote in place. The dealer should never have to go back and forth."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Persist on the `RoadSideProtectionProgram`" is not visible directly. | Medium | Judge persistence by closing and re-opening the flow (and reloading the quote page): the submitted values come back. |
| Whether the submit also changes the quote's vehicle (VIN/year on `/vehicle/{id}/details`) is not stated (Q-010). | Medium | Record the vehicle's VIN/year before and after. Use a vehicle created for the test, never shared vehicle 915. |
| "In place" is not defined: same modal without reload, or a reload that lands back on the same screen (Q-011). | Low | Judge that the dealer ends on the RSP screen with the form and results, without navigating anywhere. Record whether the page reloads. |

---

### REQ-007 — A VIN-only submit is accepted, saved, and shows the existing notice below the form when no products return

| Field | Value |
|---|---|
| **User Story** | As a dealer who knows only the VIN, I want to try a quote with just the VIN, so that I am not forced to pick a make and model first. (Inferred from the description.) |
| **Priority** | High — today Make and Model are required, so this is a new path, and the AC forbids an error screen on it. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — description and AC "A VIN-only submit is accepted and saved" |
| **Recommended Test Types** | Functional · Negative · Edge-case |

**Acceptance Criteria:**

1. AC verbatim: "Given the dealer submits the form with a VIN and no Year, Make or Model, When the form is submitted, Then the submit is accepted, the VIN is saved on the `RoadSideProtectionProgram`, and the form is shown again with the VIN filled in."
2. AC verbatim: "And the quote runs with the VIN alone; if no products come back, the notice *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* appears below the form, and the missing Year/Make/Model must not produce an error screen."
3. Description verbatim: "A submit that carries only the VIN still attempts the quote. When no products are returned, the screen shows the existing message ... below the form rather than a bare error."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Whether a VIN-only submit returns products depends on AutoShield and the VIN (Q-001). The AC covers both outcomes, but only "no products" has a stated display. | Medium | Judge: accepted, VIN kept, no error screen; then the notice below the form if no products, or the product list below the form if products. Record which happened. |
| What happens on submit with an **empty** VIN (the negative path of "VIN is required") is not stated: browser block, field error or page error (Q-004). | Medium | Judge that nothing is saved and no error screen appears. Record the message. |

---

### REQ-008 — The results update without hiding the form

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to see the products change as soon as I correct the vehicle, while the form stays there for another correction. (Inferred.) |
| **Priority** | Medium — the ticket's core fix is covered by REQ-001/REQ-006; this covers the transition between the two states. |
| **Source File** | AP-2498-roadside-protection-keep-existing-vehicle-form.md — AC "Results update without hiding the form" |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the submitted values newly qualify (or no longer qualify) for products, When the form is submitted, Then the product list below the form updates accordingly and the form is still shown."

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Newly qualify / no longer qualify" needs vehicle data known to switch between the two AutoShield outcomes (Q-001). | High | Use the pair found for REQ-001 (no-products data → complete data, and back). A direction that cannot be produced is BLOCKED. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Form always visible, results below | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Form stays when make/model stored | ✓ | | | ✓ | | | | |
| REQ-003 — Existing fields + VIN + Year; only VIN required | ✓ | ✓ | | | ✓ | | | |
| REQ-004 — Make/Model from AutoShield catalogue | ✓ | | | ✓ | | | | |
| REQ-005 — Prefill from existing data | ✓ | | ✓ | ✓ | | | | |
| REQ-006 — Submit saves and re-quotes in place | ✓ | | ✓ | ✓ | | | | |
| REQ-007 — VIN-only submit accepted | ✓ | ✓ | ✓ | | | | | |
| REQ-008 — Results update, form stays | ✓ | | | ✓ | | | | |

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
| Q-001 | Which vehicle data makes AutoShield return products on v2staging, and which returns none? Without it a test can show the results refresh, but cannot choose data for each state on purpose. | REQ-001, REQ-002, REQ-007, REQ-008 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-002 | Is the modal opened by the **+** on the Roadside Protection row the same flow as the page `/quote/{id}/road-side-protection` (tier radios, **Save and Generate Contract**)? Must the form show on both? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-003 | Should the Make and Model labels lose their "\*" marker now that they are optional, and should VIN carry one? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | How is the VIN validated — length (17 characters), allowed characters — and what does the dealer see when the VIN is empty or invalid on submit? | REQ-003, REQ-007 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | What input and limits does Year use (free number, drop-down, range of years, future year)? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | Is there a way for QA to see the AutoShield catalogue (an admin screen, a reference list) to compare the Make/Model options against? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | Does the Model list refresh as soon as Make changes, and is a previously chosen Model cleared when Make changes? | REQ-004 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | When the RSP program and the quote's vehicle both have a VIN (or year) and they differ, which one does the form show? | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | When the RSP program has no make/model stored, should Make/Model prefill from the vehicle's own make/model if that make exists in the AutoShield catalogue? ("any field without a resolvable value" — what counts as resolvable?) | REQ-005 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | Does submitting the RSP form also change the quote's vehicle (its VIN and year in inventory), or only the RSP program? | REQ-006 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-011 | Does "re-run the AutoShield quote in place" mean the modal updates without a page reload, or may the page reload as long as the dealer lands back on the RSP screen? | REQ-006, REQ-008 | Info | Open | — | Nicolas-Eric Tain |
| Q-012 | After a submit that returns products, which VIN does the product section's own VIN field (on `/quote/{id}/road-side-protection`) and the generated contract use — the one entered in the new form? | REQ-006 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-013 | Is the "no products" notice now styled as an information message rather than the red blocking alert of today's screenshot? | REQ-007 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001, REQ-002, REQ-007, REQ-008 | Product results depend on the external AutoShield service; the data producing products vs. none is not stated | High | Open |
| REQ-004 | The Make/Model lists can only be checked for shape (non-empty, Model depends on Make), not against the real AutoShield catalogue | High | Open |
| REQ-001 | The RSP modal vs. the mapped `/quote/{id}/road-side-protection` page — entry point not mapped in the domain knowledge | Medium | Open |
| REQ-003 | VIN and Year validation and the asterisk markers are not stated | Medium | Open |
| REQ-005 | Precedence between RSP and vehicle values, and prefill of Make/Model from the vehicle, not stated | Medium | Open |
| REQ-006 | Persistence is visible only by re-opening; effect on the vehicle record not stated | Medium | Open |
| REQ-003 | "No new form type" is a code statement, checked only through field names | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — no Blocking question

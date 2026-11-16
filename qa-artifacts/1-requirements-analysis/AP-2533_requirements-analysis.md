# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, "Create a quote" form `/quote/new/edit-vehicle` (Jira AP-2533)
**Date:** 2026-11-07
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2533-update-quote-form-ui.md`
**Total requirements found:** 3

related_docs: qa-artifacts/qa-docs/quote-creation.md (section "Vehicle-first new-quote form (AP-2477)" → "On Dev (v2dev) — mapped 2026-11-01"), qa-artifacts/base-test/test-centralized.md (Dev vehicle `5YJ3E1EA0LF734293`)

---

## Executive Summary

AP-2533 changes the dealer's **"Create a quote"** form — the vehicle-first form introduced
by AP-2477, reached from `/quotes` → "Create a quote" → `/quote/new/edit-vehicle`. The form
holds a Quote name, a VIN (the vehicle identification number, called *NIV* in French) with
a **Décoder** button that is meant to look the VIN up and pre-fill the vehicle, and Brand,
Model and Year fields. A vehicle-type menu ("Auto Passenger" in the screenshots) sits at the
top right of the page.

The ticket asks for two things. First, **fix the decode action**: today, clicking "Décoder"
with a VIN replaces the form with an empty white card (screenshot
image-20261102-193230.png). After the fix the click must fill the form with the vehicle's
information and must **not create the quote**. The acceptance-criterion screenshot
(image-20261102-142427.png) shows the expected result for VIN `5YJ3E1EA0LF734293`: Brand
**TESLA**, Model **Model 3**, Year **2020**. Our Dev test data lists the same VIN as a 2020
TESLA Model 3 Standard Range Plus, so the main expected result can be checked against
known values. Second, **move the vehicle-type drop-down** so that it sits before the Quote
name field, with the label **"Vehicle type"** (screenshot image-20261102-192534.png draws
the move as an arrow).

Three requirements were extracted: decode fills the form (REQ-001), decode does not create
the quote (REQ-002), and the type drop-down is placed before Quote name and labelled
"Vehicle type" (REQ-003). REQ-002 matters beyond this story: on Dev on 2026-11-01 one click
on "Décoder" saved a quote and redirected to its details page, which QA filed as bug
**AP-2507** (High). Developer Minh Lưu's comment on AP-2507 of 2026-11-03 (quoted in
`requirements/AP-2507-decoder-saves-quote-and-empties-form.md`) says AP-2507 "is already
fixed by AP-2533": vinlookup.js now posts `formName + "[novalidate]"` instead of the
hard-coded `vehicle[novalidate]`. AP-2507's own re-test (AP2507_001–003) owns AP-2507's
verdict and status. AP-2533's REQ-002 cases judge AP-2533 only and cite AP-2507 as related.
A REQ-002 FAIL is linked to AP-2507 at Gate C (no new bug), and AP-2533's s7 never changes
AP-2507's status or comments on it; AP-2533's test report names the AP-2507 re-test result
and, if the two differ, states both with their execution times instead of overriding either.

The ticket's development panel shows a merged pull request deployed to an environment named
"develop" on 2026-11-04 03:28 UTC; its mapping to Dev (v2dev), this run's execution
environment, is not stated by any knowledge source — **unverified**. Before any "Décoder"
click, the test cases must start with a read-only build check on Dev (the same vinlookup.js
`formName + "[novalidate]"` check AP2507_001 step 1 uses, no click). If the fix is not on
Dev, the decode cases are BLOCKED (build not deployed), not FAIL, and no decode is clicked —
on an unfixed build every click saves a quote the dealer cannot delete.

**One question blocks part of one criterion: Q-002.** The first criterion's "Then" names
"(visible and hidden input)" as part of its result, but the ticket names no hidden input
and no value, so the **hidden-input check of REQ-001 is blocked** until Q-002 is answered.
Only that check is blocked. The visible result stays testable: the "Then" line is missing
its verb ("Then the form with the vehicle information (visible and hidden input) and does
not create the quote"), but read together with the screenshot attached to that criterion
the visible Brand, Model and Year fields must show the decoded vehicle (Q-001, Judgement);
REQ-002 (no quote created) and REQ-003 (drop-down position and label) are fully testable.
Ten questions are open — one Blocking (Q-002), eight Judgement and one Info. Beyond Q-002,
the most important are what happens with a VIN that cannot be decoded, whether a vehicle
record is still created in the dealer's inventory, and whether anything else on the form
changed beyond the moved drop-down. Tests will record what the build does on those points
rather than guess.

One piece of context, not a requirement: the orchestrator reports that the 2026-11-05
automated regression run for AP-2491 had 17 dealer specs fail on missing quote-form
elements, likely because of this change. That was not verified by this analysis. It is the
reason for Q-008 and for the regression risk below: if the UI update renamed or removed
elements beyond the drop-down move, QA needs to know which changes are intended.

Overall testability is rated **MEDIUM-HIGH**: the decoded values, the absence of a new
quote and the drop-down's position and label are all directly visible; the hidden inputs
and the external VIN-decoding service are the parts QA can only judge indirectly.

---

## Requirements Detail

### REQ-001 — Clicking "Décoder" fills the form with the vehicle information decoded from the VIN

| Field | Value |
|---|---|
| **User Story** | As a dealer creating a quote, I want to type a VIN and click "Décoder" so that the vehicle's brand, model and year are filled in for me. (Not stated in the ticket — inferred from the description "fix the decode action when providing a vin number" and the VIN helper text "Enter the VIN and click search to pre-fill the vehicle info" visible in the screenshots.) |
| **Priority** | High — this is the defect the ticket fixes. Today the click leaves the dealer with an empty card and no way to continue except reloading, so a dealer cannot use the decoder at all. |
| **Source File** | AP-2533-update-quote-form-ui.md — description; first acceptance criterion; screenshots image-20261102-192940.png (before), image-20261102-193230.png (today's empty card), image-20261102-142427.png (expected result) |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the dealer enter the NIV, When the dealer clicks on “Decoder”, Then the form with the vehicle information (visible and hidden input) and does not create the quote." — the part about the form is this requirement; "does not create the quote" is REQ-002.
2. Expected result as shown by the AC screenshot image-20261102-142427.png: with VIN `5YJ3E1EA0LF734293` entered, the form shows Brand\* = **TESLA**, Model\* = **Model 3**, Year\* = **2020**; the Quote name and VIN stay as entered and the **Save** button is still shown.
3. Description verbatim: "fix the decode action when providing a vin number" — the empty card of image-20261102-193230.png must no longer appear.

**Out of Scope:**

- None stated. The ticket does not mention the other vehicle forms that carry a VIN lookup (inventory add-vehicle form, warranty Generate Contract page), so they are treated as out of scope.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The "Then" line has no verb, so the criterion's wording alone does not say what happens to the form. The attached screenshot is the only statement of the expected result. | Medium | Judge the main result by the screenshot: Brand, Model and Year show the decoded values for the screenshot's VIN. Raise the wording as Q-001 so the author can confirm. |
| "Hidden input" is mentioned but no hidden input is named. On Dev on 2026-11-01 the form had only `transmission` and `engineSizeUnit` as hidden inputs (`quote-creation.md`); fuel type, cylinders, engine size and turbo were not on the page. Which ones decode must fill, and with what, is not stated (Q-002). | High | **Blocking (Q-002) for the hidden-input check only.** That check stays BLOCKED until Q-002 is answered; meanwhile read every hidden input's name and value before and after the decode and record them as observations. The visible Brand/Model/Year result (Q-001, Judgement), REQ-002 and REQ-003 stay testable. |
| The fix is reported as deployed to an environment named "develop" (development panel, 2026-11-04 03:28 UTC); no knowledge source maps "develop" to Dev (v2dev) — unverified. On an unfixed build every "Décoder" click saves a quote the dealer cannot delete (AP-2507, quote 6437). | High | Before any Décoder click, s3 must include a read-only build check on Dev (the same vinlookup.js `formName + "[novalidate]"` check AP2507_001 step 1 uses, no click). If the fix is not on Dev, the decode cases are BLOCKED (build not deployed), not FAIL, and no decode is clicked. |
| Decoding depends on a VIN-decoding service the ticket does not describe (an outside dependency). A VIN that decodes on one day may not on another, and which VINs it knows is not stated. | Medium | Use the screenshot's VIN `5YJ3E1EA0LF734293`, which the Dev test data already lists as a 2020 TESLA Model 3. A service outage before the step under test is BLOCKED, not FAIL. |
| No failure path is described — invalid VIN, unknown VIN, empty VIN, or a decoded brand/model missing from the Brand/Model lists (Q-003, Q-004). | Medium | Cover these as record-only edge cases; fail only on objective faults (error page, empty card, quote created). |
| The decoder button appears only for car vehicle types on Dev (`quote-creation.md`, 2026-11-01). Whether that is intended for this story is not stated (Q-006). | Low | Test decode on the default "Auto Passenger" type; record the button's presence on one non-car type. |

---

### REQ-002 — Clicking "Décoder" does not create the quote

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want decoding a VIN to only fill the form, so that I can review and correct the vehicle before I choose to save the quote. (Not stated in the ticket — inferred from the acceptance criterion.) |
| **Priority** | High — on Dev on 2026-11-01 one click on "Décoder" saved quote 6437 and redirected to its details page (bug AP-2507, High). Every decode creating an unwanted quote leaves dealers with duplicate quotes and vehicles they did not mean to save. |
| **Source File** | AP-2533-update-quote-form-ui.md — first acceptance criterion |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. AC verbatim (second half): "Then … and does not create the quote."
2. Implied by the screenshot image-20261102-142427.png: after the decode the dealer is still on the "Create a quote" form, with the **Save** button available.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Does not create the quote" can only be proven by the absence of a new record. The quote list `/quotes` is newest-first and its row cells carry the quote id in `data-href` (`quote-creation.md`), so the newest quote id can be compared before and after. Other testers on the shared dealer account could add a quote in between. | Medium | Record the newest quote id for the dealer just before the click and check it is unchanged right after; also confirm the URL stays `/quote/new/edit-vehicle` (no redirect to `/quote/{id}/details`) and no "Vehicle saved" message appears. Never pick a record by "newest" for any other purpose. |
| On 2026-11-01 the decode also created a vehicle (vehicle 1067 appeared in the dealer's Vehicle Inventory). Whether the fixed decode may still create an inventory vehicle is not stated (Q-005). | Medium | Record the newest Vehicle Inventory entry before and after; judge only the quote. |
| The fix is reported as deployed to an environment named "develop"; its mapping to Dev (v2dev) is not stated by any knowledge source — unverified. A decode on an unfixed build creates an undeletable quote. | High | Before any Décoder click, s3 must include a read-only build check on Dev (the same vinlookup.js `formName + "[novalidate]"` check AP2507_001 step 1 uses, no click). If the fix is not on Dev, the decode cases are BLOCKED (build not deployed), not FAIL, and no decode is clicked. |
| REQ-002 is the behaviour of open bug AP-2507, which is re-tested separately (AP2507_001–003). Two pipelines could report on the same bug. | Medium | AP-2533's REQ-002 cases judge AP-2533 only and cite AP-2507 as related. A REQ-002 FAIL is linked to AP-2507 at Gate C (no new bug); AP-2533's s7 never changes AP-2507's status or comments on it. |
| A following **Save** must still create exactly one quote with the decoded vehicle — otherwise the fix could have broken saving. This is regression, not a stated criterion. | Medium | Add one regression case: decode, then Save, and confirm one quote is created and opens with the decoded vehicle. |

---

### REQ-003 — The vehicle-type drop-down sits before the Quote name and is labelled "Vehicle type"

| Field | Value |
|---|---|
| **User Story** | As a dealer creating a quote, I want to choose the vehicle type first, inside the form, so that I see and set it before naming the quote. (Not stated in the ticket — inferred from the description "Update the create quote form UI" and the second acceptance criterion.) |
| **Priority** | Medium — a layout change. A dealer who misses the type menu at the top right can quote the wrong vehicle type, but the form still works without it. |
| **Source File** | AP-2533-update-quote-form-ui.md — description; second acceptance criterion; screenshot image-20261102-192534.png |
| **Recommended Test Types** | UI · Functional · Regression |

**Acceptance Criteria:**

1. AC verbatim: "Given the dealer is create a new quote, When the form is rendering, Then the type drop-down is positioned before the quote name with the label “Vehicle type”."
2. Screenshot image-20261102-192534.png: an arrow runs from the "Auto Passenger" type menu at the top right of the page to the "Quote name" label inside the form card.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Today the type is a menu of links: each of its 23 types opens `/quote/new/edit-vehicle/{TYPE}` (`quote-creation.md`, Dev 2026-11-01). The ticket does not say whether it stays a navigation menu or becomes a form field, nor whether values already typed survive a type change (Q-007). | Medium | Judge position and label as stated. Record how a type change behaves (URL, form reload, kept values); fail only if it errors or the form disappears. |
| The interface is bilingual. Only the English label "Vehicle type" is given; the French label is not (Q-009). | Low | Check the English label exactly; record the French label with `?_locale=fr`. |
| "Update the create quote form UI" may cover changes beyond the drop-down move. Seventeen dealer automation specs reportedly failed on missing quote-form elements on 2026-11-05 (orchestrator context, not verified here). Which other element changes are intended is not stated (Q-008). | Medium | Map the live form's fields and ids on Dev once and compare them with `quote-creation.md` (2026-11-01). Record each difference; do not call a difference a defect unless the form stops working. Write the new map back to `quote-creation.md`. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Décoder fills the form | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| REQ-002 — Décoder does not create the quote | ✓ | ✓ | | ✓ | | | | |
| REQ-003 — "Vehicle type" drop-down before Quote name | ✓ | | | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** the dealer account (shared Dev dealer); the quote (must **not**
be created by the decode; created only by Save); the quote's vehicle record, which on Dev
also appears in the dealer's Vehicle Inventory; the VIN-decoding lookup and its result for
VIN `5YJ3E1EA0LF734293`; the Brand and Model option lists; the list of vehicle types (23 on
Dev on 2026-11-01); the hidden inputs of the form (`transmission`, `engineSizeUnit` on
2026-11-01).

**Related tickets (context, not requirements):** AP-2477 (the vehicle-first form this story
changes), AP-2507 (High — "Décoder" saves the quote, filed 2026-11-01; REQ-002 is the same
behaviour; developer Minh Lưu's 2026-11-03 comment on AP-2507, quoted in
`requirements/AP-2507-decoder-saves-quote-and-empties-form.md`, says AP-2507 "is already
fixed by AP-2533" through the vinlookup.js `formName + "[novalidate]"` change). AP-2507's
own re-test (AP2507_001–003) owns AP-2507's verdict and status. AP-2533's REQ-002 cases
judge AP-2533 only and cite AP-2507 as related. A REQ-002 FAIL is linked to AP-2507 at
Gate C (no new bug), and AP-2533's s7 never changes AP-2507's status or comments on it;
AP-2533's test report names the AP-2507 re-test result and, if the two differ, states both
with their execution times instead of overriding either. AP-2492 (the form missing on staging, 2026-10-12), AP-2491 (regression run of
2026-11-05 with 17 failing dealer specs).

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | The first criterion reads "Then the form with the vehicle information (visible and hidden input) and does not create the quote" — a verb is missing. Is the intended result that the existing form stays on the page with its fields filled from the decoded VIN, as the attached screenshot shows (Brand TESLA, Model "Model 3", Year 2020)? The main result is taken from that screenshot, so this does not block testing. | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-002 | Which hidden inputs must the decode fill, and with which values (for example transmission, engine size, fuel type, cylinders, turbo)? Only `transmission` and `engineSizeUnit` were on the page on Dev on 2026-11-01. The criterion's "Then" names "(visible and hidden input)" as part of its result, so the hidden-input check cannot be written until this is answered; the visible Brand/Model/Year result is not blocked. | REQ-001 | Blocking | Open | — | Nicolas-Eric Tain |
| Q-003 | What should the dealer see when the VIN cannot be decoded — empty VIN, wrong length or characters, or a well-formed VIN the service does not know? Should the fields already filled be kept or cleared? | REQ-001, REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-004 | When the decoded brand or model is not in the Brand or Model list, or the dealer had already chosen a Brand, Model or Year before clicking "Décoder", which value should the form show? | REQ-001 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-005 | Besides not creating the quote, must the decode also not create a vehicle in the dealer's Vehicle Inventory? (On 2026-11-01 the decode created vehicle 1067 as well as quote 6437.) | REQ-002 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-006 | Should "Décoder" be offered for every vehicle type, or only for car types as on Dev on 2026-11-01? | REQ-001, REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-007 | Does the "Vehicle type" drop-down stay a menu that reloads the form for the chosen type (`/quote/new/edit-vehicle/{TYPE}`), or does it become a field saved with the form? Are a typed Quote name, VIN and decoded values kept when the type changes, and which type is selected by default? | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-008 | Besides moving the type drop-down, does "Update the create quote form UI" rename, move or remove any other element of the form (labels, field ids, the "Décoder" button, the Save button)? Seventeen dealer automation specs reportedly failed on missing quote-form elements on 2026-11-05; QA needs to know which changes are intended. | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-009 | What is the French label of the "Vehicle type" drop-down? It is a display result of REQ-003; the test records the label shown with `?_locale=fr`. | REQ-003 | Judgement | Open | — | Nicolas-Eric Tain |
| Q-010 | The ticket calls the button "Decoder" and the field "NIV"; the English screen shows "Décoder" and "VIN". Should the English button read "Decode"? No test result depends on the button's wording. | REQ-001 | Info | Open | — | Nicolas-Eric Tain |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | Hidden inputs the decode must fill are not named or valued (Q-002, Blocking) — the hidden-input check is BLOCKED; the visible result stays testable | High | Open |
| REQ-001, REQ-002 | Deployment of the fix to Dev unverified ("develop" not mapped to v2dev) — read-only build check before any Décoder click; decode cases BLOCKED if absent | High | Open |
| REQ-001 | The "Then" line has no verb; the expected result comes from the attached screenshot only (Q-001) | Medium | Open |
| REQ-001 | Depends on an undescribed external VIN-decoding service; failure paths not described (Q-003, Q-004) | Medium | Open |
| REQ-002 | "Not created" is proven only by absence, on a shared dealer account; inventory vehicle creation not stated (Q-005) | Medium | Open |
| REQ-002 | Save after decode is not a stated criterion but must keep working (regression) | Medium | Open |
| REQ-003 | Behaviour of the type drop-down (navigation menu vs. form field) and other UI changes not stated (Q-007, Q-008); 17 automation specs reportedly broken | Medium | Open |
| REQ-003 | French label not given (Q-009, Judgement) — recorded | Low | Open |
| REQ-001, REQ-003 | Decoder availability per vehicle type not stated (Q-006) | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — one Blocking question, Q-002 (REQ-001 hidden-input check only; that check stays BLOCKED until answered, every other result is testable)

## Revisions

| Date (UTC) | Change | Reason |
|---|---|---|
| 2026-11-07T09:53:03Z | Q-002 → Blocking (REQ-001 hidden-input check only); Q-009 → Judgement; AP-2507 tie cited to Minh Lưu's 2026-11-03 comment and ownership of AP-2507's verdict stated; "develop" → Dev mapping marked unverified and a read-only build-check risk added to REQ-001/REQ-002 | R1 round 1 findings F-1–F-4 (qa-artifacts/7-reviews/AP-2533_review.md) |

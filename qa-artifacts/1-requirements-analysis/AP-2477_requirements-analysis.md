# Requirements Analysis Report

**Project:** Avantage Plus v2 — Dealer portal, new-quote vehicle form `/quote/new/edit-vehicle` (Jira AP-2477)
**Date:** 2026-10-11
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md`
**Total requirements found:** 7

---

## Executive Summary

AP-2477 changes the first screen of quote creation in the Dealer portal. That screen is
the "Créer une cotation" vehicle form at `/quote/new/edit-vehicle`, where a dealer
describes the vehicle a quote is for. Today the form repeats the full inventory vehicle
form: VIN, make, model, year, price, kilometres, condition, designation, transmission,
engine, fuel, turbo, 4x4/AWD and the manufacturer-warranty block. After the change it
shows only **Quote name, VIN, Brand, Model and Year**, and only Brand, Model and Year are
required. The VIN **"Décoder"** button (which looks the VIN up with an outside decoding
service and fills the form) must keep working. The technical details it decodes
(transmission, engine, fuel and so on) must still be saved on the vehicle, even though
they are no longer shown.

The ticket's four Given/When/Then blocks, its Tech approach and its Assumptions produce
seven testable requirements. Five come straight from acceptance criteria. Two come from
the Tech approach and Assumptions: a Quote name typed before decoding must not be lost,
and the other vehicle forms must not change. Eleven testability risks were flagged, four
of them High. The biggest concern is **downstream impact**: kilometres, condition,
designation and price are now saved empty. The ticket itself warns that the window
sticker PDF, warranty pricing and field mapping read those values and "must tolerate
null — audit these before release". A quote created from the new form may therefore break
later steps (warranty selection, window sticker, contract), even if the form itself works.

Overall testability is rated **MEDIUM**. Everything on the form can be checked in the
browser. But "stored as NULL on the vehicle row" and "decoded extras are persisted" are
database facts. They can only be seen indirectly, through the vehicle's details or edit
page. The decoder also depends on an outside service (VinAudit) being configured on
staging.

---

## Requirements Detail

### REQ-001 — The new-quote vehicle form shows only five fields, in a fixed order

| Field | Value |
|---|---|
| **User Story** | As a dealer user, I want the new-quote vehicle form to show only Quote name, VIN, Brand, Model and Year so that I can create a quote without friction. (From the ticket.) |
| **Priority** | High — this is the visible purpose of the ticket; any leftover field defeats it. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. When the dealer opens `/quote/new/edit-vehicle` (route `quote-edit-vehicle`), only these five fields are shown, in this order: Quote name (at the top, above VIN), VIN ("NIV"), Brand ("Marque"), Model ("Modèle"), Year ("Année") (AC block 1).
2. Price, Kilometers, Condition, Designation, transmission, engine size and engine size unit, cylinders, fuel type, turbo, 4x4/AWD and the manufacturer-warranty block are no longer shown on this screen (AC block 1).
3. The layout matches the attached mockup: Quote name, then NIV with help text and the "Décoder" button, then Marque / Modèle / Année on one row, then "Sauvegarder" (attachment).

**Out of Scope:**

- Other vehicle forms (see REQ-006).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The removed fields stay in the page as **hidden** inputs (Tech approach item 3). A check that only looks for visible labels is right; a check that counts all inputs would wrongly fail. | Low | Judge "shown" by what a user sees (visible labels and controls), and note the hidden inputs separately. |
| The mockup shows asterisks on Quote name and NIV, but the Assumptions say only Brand, Model and Year should be marked required. The mockup and the text disagree. | Medium | Follow the Assumptions text (it is newer and explicit). Treat an asterisk on Quote name or NIV as a finding to raise, not as correct. |

---

### REQ-002 — The "Décoder" button appears only for decoder-enabled vehicle types

| Field | Value |
|---|---|
| **User Story** | As a dealer quoting a car, I want the VIN "Décoder" button so that I can fill the vehicle in one click; for RVs, boats and construction equipment the VIN stays a plain field. (Inferred from AC block 1.) |
| **Priority** | Medium — wrong placement either hides a time-saver or shows a button that cannot work for that type. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. VIN keeps its "Décoder" button for decoder-enabled types (type group VEHICLE, where the VIN field carries the `vinlookup` class) (AC block 1).
2. VIN stays a plain input for the other type groups — RV, boat, construction (AC block 1).
3. The button stays visible with an empty VIN, as today (Assumptions).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| How the dealer switches the vehicle type on this screen is not described. The mockup shows an "Auto Passenger" drop-down at the top right, but the list of types and which group each belongs to is not known. | Medium | Map the type menu during execution. Test one VEHICLE-group type (Auto Passenger) and one other group (an RV or boat type, if the dealer has one). |

---

### REQ-003 — Decoding a VIN pre-fills Brand, Model and Year and keeps the hidden details for saving

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want "Décoder" to fill the vehicle from its VIN so that I do not type it, and the technical details to be kept on the vehicle even though I no longer see them. (From AC block 2.) |
| **Priority** | High — the decoded details (transmission, engine, fuel, turbo) feed warranty eligibility and pricing; losing them silently would misprice quotes. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. When the dealer enters a VIN and clicks "Décoder" on a decoder-enabled type, the VIN lookup runs and the form is re-rendered pre-filled with the decoded Brand, Model and Year (AC block 2).
2. The decoded transmission, engine size, engine size unit, cylinders, fuel type and turbo are assigned to the vehicle and stored on the vehicle row when the quote is saved (AC block 2).

**Out of Scope:**

- Changing the decoder service itself.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| **Outside dependency.** The decoder calls VinAudit through `VINAUDIT_DECODER_API_BASE_URL`. The developer had to ask for this value on 2026-10-03, so it may not be configured on staging. If it is missing, decoding fails for reasons unrelated to this ticket. | High | Treat a decoder that returns nothing for a known-good VIN as BLOCKED (environment), not FAIL, and record what the screen shows. |
| **"Stored on the vehicle row" cannot be seen in the database from the browser.** | High | Verify indirectly. After saving, open the vehicle's details or edit page (`/vehicle/{id}/details`, "Edit vehicle") and read transmission, engine, fuel, cylinders and turbo there. |
| Two existing rules shape decoding (Tech approach item 4): decoding is **ignored if Brand was already chosen**, and nothing changes when the decoder returns no make or no fuel type. A dealer who picks Brand first and then decodes will see nothing happen. | Medium | Record this as an edge case. Not filled when Brand was picked first is the expected behaviour per the ticket, not a bug. |
| No VIN known to decode correctly on staging is listed. Vehicle 915 (`1FAHP35NX8W239204`, Ford Focus 2008) is a real VIN from the test data and is the best candidate. | Medium | Use that VIN. If it does not decode, record the decoder response and treat the case as BLOCKED. |

---

### REQ-004 — Only Brand, Model and Year are required; the quote saves without Quote name or VIN

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to save a quote with only Brand, Model and Year so that I can start quoting before I have the VIN or a name. (From AC block 3.) |
| **Priority** | High — this is the "without friction" half of the ticket, and it also introduces empty values that the rest of the quote flow has never received before. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. When the dealer saves with only Brand, Model and Year filled and leaves Quote name and VIN empty, the quote is saved (AC block 3).
2. Quote name and VIN are optional (AC block 3).
3. Kilometers, designation, vehicle condition and price are stored as NULL (empty) on the vehicle row (AC block 3).
4. After saving, the dealer is redirected to the quote details page (`quote-details`) (Tech approach item 9).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| NULL storage can only be seen indirectly. | Medium | Read the vehicle details / edit page after saving. Kilometres, condition, designation and price should be blank, not `0`, "New" or a default. |
| The ticket notes the **quote vehicle price** column was not nullable and that the save would fail without a fix (Tech approach item 7). If the fix was missed, the save gives an error page. | High | Covered by AC 1. An HTTP 500 on Save is a FAIL. |
| What the Year check `checkYear()` accepts (range, future years) is not stated. | Low | Test a normal year (2020) and one clearly invalid year (e.g. 1800 or 3000) as an observation. |

---

### REQ-005 — Missing Brand, Model or Year is refused and nothing is saved

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want to be told when Brand, Model or Year is missing so that I never create a quote for an unknown vehicle. (From AC block 4.) |
| **Priority** | Medium — a quote without a vehicle cannot be priced; the risk is a half-created quote. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Negative · Edge-case |

**Acceptance Criteria:**

1. When the dealer submits the form without Brand, Model or Year, the form is re-rendered with a validation error and no quote is saved (AC block 4).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The wording of the validation message is not given. | Low | Accept any visible error at the missing field. |
| "No quote is saved" must be checked by looking at the quote list, because a failed save could still create an empty quote. | Medium | Compare the dealer's `/quotes` list (newest first) before and after. |
| The browser's own `required` check may stop the submit before the server sees it, which hides server validation. | Low | Record which layer refused. Either counts as refused, provided nothing is saved. |

---

### REQ-006 — The other vehicle forms keep their full fields and rules

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the inventory and quote-details vehicle forms to keep working as before so that this simplification does not loosen data quality elsewhere. (From the Assumptions and Tech approach items 1 and 4.) |
| **Priority** | Medium — the change touches shared validation and makes four database columns nullable for every flow. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Regression |

**Acceptance Criteria (from Assumptions, not from a Given/When/Then block):**

1. Editing a vehicle from the quote details page keeps the current full form (`vehicles-edit`).
2. The inventory vehicle form (`/vehicle/new/edit/{TYPE}`) and the piece-protection vehicle forms are unchanged and keep their current required fields (for example, kilometres and price stay required there).

**Out of Scope:**

- Piece-protection forms — no route is mapped in the knowledge sources; testing them is deferred unless found during execution.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| These criteria come from the Assumptions section, not from acceptance criteria. The product owner has not explicitly confirmed them. | Low | Test them as regression. A difference is raised as a finding with the Assumptions quoted. |

---

### REQ-007 — A Quote name typed before decoding is not lost

| Field | Value |
|---|---|
| **User Story** | As a dealer, I want the Quote name I typed to survive clicking "Décoder" so that I do not have to type it twice. (From Tech approach item 8.) |
| **Priority** | Medium — the ticket itself identifies the defect (the decoder replaces the whole form) and asks for one of three fixes. |
| **Source File** | AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md |
| **Recommended Test Types** | Functional · Edge-case |

**Acceptance Criteria (from Tech approach, not a Given/When/Then block):**

1. After the dealer types a Quote name, enters a VIN and clicks "Décoder", the Quote name still holds what was typed, and it is saved with the quote.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Written as a developer instruction, not as an acceptance criterion. | Low | Test it. A lost name is a finding; quote item 8 of the ticket in the bug. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Five fields, in order | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Décoder only for VEHICLE types | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Decode pre-fills and keeps hidden details | ✓ | | ✓ | ✓ | | | | |
| REQ-004 — Only Brand/Model/Year required | ✓ | | ✓ | ✓ | | | | |
| REQ-005 — Missing required field refused | | ✓ | ✓ | | | | | |
| REQ-006 — Other forms unchanged | | | | ✓ | | | | |
| REQ-007 — Quote name kept across decode | ✓ | | ✓ | | | | | |

**Legend:** ✓ = recommended based on requirement content

**Downstream check to include:** take a quote saved from the minimal form (empty
kilometres, condition, price) one step further, to its quote details page and the
warranty programs list. Confirm nothing returns an error page. The ticket names the
window sticker PDF, quote warranty, program terms and field mapper as places that must
tolerate empty values.

**Data entities touched:** Quote (created); quote name; vehicle record (created with
NULL kilometres, condition, designation, price; decoded extras when "Décoder" is used);
quote-vehicle link (price); dealer account 1380 (static); vehicle type list; make/model
reference lists; the VinAudit decoder service (outside dependency).

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | Is the VIN decoder (VinAudit, `VINAUDIT_DECODER_API_BASE_URL`) configured on staging? | REQ-003 | Minh Lưu (developer) | Before s4 |
| Q-002 | How do warranty eligibility and pricing behave for a quote whose vehicle has no kilometres, condition or price? Is the dealer asked for them later? | REQ-004 | Nicolas-Eric Tain (reporter) | Before sign-off |
| Q-003 | The mockup shows asterisks on Quote name and NIV. Confirm that only Brand, Model and Year should show the required marker, as the Assumptions say. | REQ-001 | Nicolas-Eric Tain | Before sign-off |
| Q-004 | Which fix was chosen for the Quote name lost on decode (item 8)? Is the name expected to survive? | REQ-007 | Minh Lưu | Before sign-off |
| Q-005 | What years does the Year check accept? | REQ-004 | Minh Lưu | Before sign-off |
| Q-006 | Which vehicle types does the type menu offer, and which belong to the VEHICLE decoder group? | REQ-002 | Minh Lưu | Before s4 |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | Decoder depends on an outside service that may not be configured on staging | High | Open |
| REQ-003 | Persistence of hidden decoded details is only visible indirectly | High | Open |
| REQ-004 | Quote vehicle price non-nullable — save may fail with an error page | High | Open |
| REQ-004 | Downstream steps (warranty, window sticker) may break on empty values | High | Open |
| REQ-001 | Mockup asterisks vs Assumptions on required markers | Medium | Open |
| REQ-002 | Type menu and decoder groups not mapped | Medium | Open |
| REQ-003 | Decode ignored when Brand chosen first (by design) | Medium | Open |
| REQ-003 | No confirmed decodable VIN on staging | Medium | Open |
| REQ-004 | NULL storage visible only indirectly | Medium | Open |
| REQ-005 | "No quote saved" needs a before/after list check | Medium | Open |
| REQ-004 | Year rule undefined | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

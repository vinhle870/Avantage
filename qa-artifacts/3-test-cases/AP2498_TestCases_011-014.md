# Test Cases — AP2498 (File 3 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2498 — Roadside protection: keep the existing vehicle form visible and add VIN + Year
**Source:** requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md · qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2498_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2498_011 to AP2498_014 (4 test cases)
**Coverage:** Functional · Negative · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory `/vehicle/inventory` (to create the case's vehicle) → `/vehicle/{vehicleId}/details` → **Create quote** → `/quote/new/client?fromVehicleId={vehicleId}` (never a bare `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500) → `/quote/{id}/details`, the quote page. On the quote page, the card **"Summary of products"** has a row **"Roadside Protection"** ("- None Selected -") with a **+** button on the right; that button opens the add-roadside-protection flow (ticket screenshots image-20261016-161021.png and image-20261016-160938.png). `quote-creation.md` also maps a page `/quote/{id}/road-side-protection` ("Road Side protection program") — record whether the **+** opens a modal on the quote page or navigates to that page (Q-002) | `navigation` → `domain` (quote-creation.md); the **+** entry and its modal are not yet mapped — taken from the ticket screenshots |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | No standing record is used. **Vehicle 915 must not be used** — a submit of the RSP form may also change the vehicle (Q-010). Every vehicle, client and quote is created by the case itself | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English. The no-products notice is judged on its English text | `domain` (quote-creation.md) |
| **Leaves behind** | One new inventory vehicle, one client and one quote per case (AP2498_011–014), plus the quote's roadside-protection program record with the values each case submits. AP2498_014 selects a tier but generates **no** contract. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**The RSP vehicle form** — the form this ticket is about. It is the block with the
controls **VIN**, **Year**, **Make**, **Model** and the button **Continue** (old form
name `QuoteAutoShieldMakeModelType`; its fields `vehicleMake`, `vehicleModel`,
`continue`). **The no-products notice** is the exact text *"In order to get a quote for
road side protection, please specify the make and model of the vehicle."* **The product
results** are the AutoShield product tiers (radio buttons) that appear when AutoShield
returns products.

**Shared vehicle values (Vehicle P — complete)** — at `/vehicle/inventory` click the
add-vehicle control (label not mapped yet; record it), choose Vehicle type = the first
passenger-car option (record its label), type the case's VIN (17 characters, valid check
digit, given in the case's Test Data; do **not** click any "Décoder"/decode button of the
inventory form), Make `Toyota`, Model `Corolla`, Year `2022`, Kilometers `15000`, Fuel
type "Gasoline" (French "Essence"), Price `20000`, and for any other field the form marks
required, its first option (record each one) → **Save**. If `Toyota` / `Corolla` are not
offered, take the first Make and first Model in the list and record them. Record the new
vehicle id from the URL `/vehicle/{vehicleId}/details`.

**Shared vehicle values (Vehicle N — no VIN)** — the same as Vehicle P, but leave **VIN
empty** (the state of the ticket screenshot: a Cadillac ATS 2022 with no VIN). If the
inventory form refuses to save without a VIN, record the error text, save with the case's
fallback VIN, and note in the log that the no-VIN state could not be prepared through the
inventory form.

**Shared client values** — used in every case's client form, changing only the last name:
First name `Roadside`, Last name as given in the case, Email `client.stage.NNN@yopmail.com`
(next unused number, recorded), Address `100 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`,
"I agree to the policy" ticked → **Save**. Then on the vehicle step `/quote/{id}/vehicle`
keep the pre-attached vehicle, Delivered at `2026-11-01`, Price `20000` → **Save**.

**Catalogue choice rule** — wherever a case says "choose a catalogue Make/Model": in the
RSP form's **Make** list choose `Toyota` and in **Model** choose `Corolla`; if either is
not offered, choose the first real Make (not the "Choose" placeholder) and its first
Model, and record both.

**AutoShield outcome rule** — whether AutoShield returns products for a given vehicle is
not stated (Q-001). Where a case needs one outcome (products, or no products) and the
other appears, record what appeared with the vehicle's values and set the case
**BLOCKED** with "Blocked by: Q-001 — data did not produce the needed AutoShield
outcome". That is not a FAIL.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The inventory add-vehicle form (add control label, required fields, controls) is not mapped in `domain` | AP2498_011–014 | Not blocking at design — the route `/vehicle/inventory` is known; the executor maps the form on first use and writes it back to `quote-creation.md` |
| 2 | The add-roadside-protection **+** flow is not mapped in `domain` | AP2498_011–014 | Not blocking — reached through the **+** button shown in the ticket screenshot; mapped at run time (Q-002) |
| 3 | Which vehicle data makes AutoShield return products, or stop returning them, on staging | AP2498_011, 013, 014 | Open — Q-001 (Judgement). Not blocking at design; the AutoShield outcome rule applies at run time |

> No case ships BLOCKED. All four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2498_011 | Completing the vehicle on a quote with no products refreshes the results below the form without leaving the flow | Functional | High | FAIL |
| AP2498_012 | A submit with only a VIN is accepted, keeps the VIN, and shows the notice below the form instead of an error | Negative | High | FAIL |
| AP2498_013 | Changing the vehicle on a quote that has products updates the results below while the form stays visible | Regression | Medium | FAIL |
| AP2498_014 | With products listed below the new form, a product tier can still be chosen in the existing product step | Regression | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2498_011 — Completing the vehicle on a quote with no products refreshes the results below the form without leaving the flow

| Field | Value |
|---|---|
| **TC ID** | AP2498_011 |
| **Title** | Completing the vehicle on a quote with no products refreshes the results below the form without leaving the flow |
| **Requirement** | AP2498 — REQ-008, AC "Results update without hiding the form" ("newly qualify"); REQ-006, description "re-run the AutoShield quote in place. The dealer should never have to go back and forth." |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — Tiers replace the notice in place; form collapsed |

**Why this matters:** This is the whole point of the ticket from the dealer's side: start
at "no products", fix the vehicle in the form, and see products appear on the same screen.
Whether the page reloads in between is recorded (Q-011); the dealer must simply end up in
the same flow with the form still there. If AutoShield still returns nothing for the
completed vehicle, the "newly qualify" direction could not be produced and the case is
BLOCKED under Q-001, not FAILED.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN `2T1BURHE6NC498011` |
| Client last name | `Roadside2498-011` |
| RSP VIN / Year | `2T1BURHE6NC498011` / `2022` |
| RSP Make / Model | Catalogue choice rule |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-011`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The roadside-protection flow opens without an error page; the no-products notice is shown below the form. Record the URL. If product tiers are already listed, record them and apply the AutoShield outcome rule (BLOCKED — Q-001) |
| 3 | Type `2T1BURHE6NC498011` in **VIN** and `2022` in **Year**, choose the catalogue Make and Model, and click **Continue** | No error page or HTTP 5xx. Record the URL after the submit and whether the page reloaded (Q-011) |
| 4 | [Verification] Inspect the flow from top to bottom | The dealer is still in the roadside-protection flow (same modal or same URL as at step 2), the RSP form is still shown with the four values entered at step 3, and **below** it the product tiers are now listed in place of the no-products notice. If the notice is still shown, record it with the values and apply the AutoShield outcome rule (BLOCKED — Q-001) |

---

### AP2498_012 — A submit with only a VIN is accepted, keeps the VIN, and shows the notice below the form instead of an error

| Field | Value |
|---|---|
| **TC ID** | AP2498_012 |
| **Title** | A submit with only a VIN is accepted, keeps the VIN, and shows the notice below the form instead of an error |
| **Requirement** | AP2498 — REQ-007, AC "A VIN-only submit is accepted and saved"; description "A submit that carries only the VIN still attempts the quote." |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — VIN-only submit accepted and saved; notice has the wrong text |

**Why this matters:** Before the change, Make and Model were required, so a dealer who
knew only the VIN could not even ask for a price. Now the submit must go through with the
VIN alone, keep the VIN, and — if AutoShield finds nothing — show the existing notice
below the form, never an error screen. Vehicle N has no VIN, so a VIN shown after
re-opening can only be the one this submit saved (if the inventory forced the fallback VIN,
the vehicle has a VIN too, and which one the form shows is Q-008 — then recorded, not
judged).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN `2T1BURHE8NC498012` (if used, the VIN checks at steps 3 and 5 become record-only under Q-008: the submitted VIN or this fallback VIN, any other value a fault) |
| Client last name | `Roadside2498-012` |
| RSP VIN | `2T1BURHE1NC498112` |
| RSP Year / Make / Model | Left empty / "Choose" placeholder |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-012`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | Type `2T1BURHE1NC498112` in **VIN**; make sure **Year** is empty and **Make** and **Model** are on their "Choose" placeholder; click **Continue** | The submit is accepted: no field error on Year, Make or Model, no error page or HTTP 5xx; the form is shown again with VIN `2T1BURHE1NC498112` — if the fallback VIN was used at step 1, `2T1BURHE1NC498112` or the vehicle's fallback `2T1BURHE8NC498012`, any other value is a fault; record which (Q-008). **Below** the form there is either the no-products notice with the exact text *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* or a list of product tiers — record which (Q-001) |
| 4 | Close the flow (close button or browser back to `/quote/{id}/details`), reload the quote page, and click the **+** on the "Roadside Protection" row again | The roadside-protection flow opens again without an error page or HTTP 5xx |
| 5 | [Verification] Read the RSP form | **VIN** shows `2T1BURHE1NC498112` — the VIN was saved. If the fallback VIN was used at step 1, `2T1BURHE1NC498112` or the vehicle's fallback `2T1BURHE8NC498012` — any other value is a fault; record which (Q-008). Make and Model are not filled with a value nobody entered (record what they show — Q-009) |

---

### AP2498_013 — Changing the vehicle on a quote that has products updates the results below while the form stays visible

| Field | Value |
|---|---|
| **TC ID** | AP2498_013 |
| **Title** | Changing the vehicle on a quote that has products updates the results below while the form stays visible |
| **Requirement** | AP2498 — REQ-008, AC "Results update without hiding the form" ("or no longer qualify") |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — Form collapsed after the submit; same tiers (Q-001) |

**Why this matters:** The opposite direction of AP2498_011: a quote that already has
products is changed to a vehicle that may no longer qualify. Which vehicle stops
qualifying is not stated (Q-001), so the case uses an old vehicle (a 2003 Honda Accord,
VIN with a valid check digit) and records what AutoShield returns. The form must stay and
the area below it must reflect the new answer — and never an
error screen.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle P, VIN `2T1BURHEXNC498013` |
| Client last name | `Roadside2498-013` |
| New RSP VIN / Year | `1HGCM82633A004352` / `2003` |
| New RSP Make / Model | `Honda` / `Accord`; if not offered, the first Make that is not `Toyota` and its first Model (recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle P at `/vehicle/inventory` with the shared Vehicle P values (VIN `2T1BURHEXNC498013`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-013`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; click the **+** on the "Roadside Protection" row; if the no-products notice is shown, choose the catalogue Make and Model and click **Continue** | Product tiers are listed below the form; record them. If no tiers can be obtained, apply the AutoShield outcome rule (BLOCKED — Q-001) |
| 3 | Replace **VIN** with `1HGCM82633A004352` and **Year** with `2003`, choose the new Make and Model from Test Data, and click **Continue** | No error page or HTTP 5xx; the dealer stays in the roadside-protection flow |
| 4 | [Verification] Inspect the flow from top to bottom | The RSP form is still shown, with **Make** and **Model** showing the values chosen at step 3. **VIN** shows `1HGCM82633A004352` or the vehicle's `2T1BURHEXNC498013`, and **Year** `2003` or the vehicle's `2022` — any other value is a fault; record which (Q-008). Below it is the AutoShield answer for the new values: the no-products notice (exact text as in AP2498_012) with no tiers listed, or a list of tiers for the new vehicle. Record which, the tiers and prices if any, and whether the notice also shows while tiers are listed (not stated in the ticket — record only). If the tiers and prices are identical to step 2, record it: the "no longer qualify" direction was not produced (BLOCKED — Q-001) |

---

### AP2498_014 — With products listed below the new form, a product tier can still be chosen in the existing product step

| Field | Value |
|---|---|
| **TC ID** | AP2498_014 |
| **Title** | With products listed below the new form, a product tier can still be chosen in the existing product step |
| **Requirement** | AP2498 — REQ-001 (regression of the product results below the form); test plan §2.1 regression |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+**; `/quote/{id}/road-side-protection` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | AP-2508 (no "Save and Generate Contract" button on the Dev build) |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | BLOCKED — Blocked by AP-2508 — no "Save and Generate Contract" button |

**Why this matters:** Putting a form above the products must not break the step that
follows. `quote-creation.md` maps the existing product step at
`/quote/{id}/road-side-protection` ("Road Side protection program") with tier radios
`quote_auto_shield[selectedTier]`, sale price, VIN, stock number, vehicle condition,
odometer reading and **Save and Generate Contract**. The case chooses a tier but does
**not** generate a contract. Which VIN the product step shows after the new form was used
is recorded (Q-012).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle P, VIN `2T1BURHE1NC498014` |
| Client last name | `Roadside2498-014` |
| RSP VIN | `2T1BURHE5NC498114` (entered in the new form, so the product step's VIN can be compared) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle P at `/vehicle/inventory` with the shared Vehicle P values (VIN `2T1BURHE1NC498014`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-014`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; click the **+** on the "Roadside Protection" row | The roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | In the RSP form replace **VIN** with `2T1BURHE5NC498114`, choose the catalogue Make and Model, and click **Continue** | Product tiers are listed below the form. If none are listed, apply the AutoShield outcome rule (BLOCKED — Q-001) |
| 4 | Select the first product tier | The tier's radio button is selected; no error page |
| 5 | [Verification] Inspect the product section below the form | The product section shows the tier radios with the first one selected and the **Save and Generate Contract** button. Record whether the button is enabled or disabled (its state is not stated in `domain` — record only; if the product section is not the `/quote/{id}/road-side-protection` page, record the difference for write-back to `domain`, Q-002). Record the product section's VIN field value — `2T1BURHE5NC498114`, `2T1BURHE1NC498014` or empty (Q-012) — and the other fields shown. Do not click **Save and Generate Contract** |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — product results below the form (regression) | — | — | — | AP2498_014 |
| REQ-006 — re-run in place | AP2498_011 | — | — | — |
| REQ-007 — VIN-only submit accepted and saved | — | AP2498_012 | — | — |
| REQ-008 — Results update, form stays | AP2498_011 | — | — | AP2498_013 |
| REQ-002 … REQ-005 | see files 1 and 2 | | | |

### Full coverage across the three files

| Requirement | Test cases |
|---|---|
| REQ-001 — Form always visible, results or notice below | AP2498_001, AP2498_002, AP2498_014 |
| REQ-002 — Form stays when make/model stored and products returned | AP2498_003 |
| REQ-003 — Existing fields + VIN + Year; only VIN required; no lookup | AP2498_004, AP2498_005, AP2498_006 |
| REQ-004 — Make/Model lists from the AutoShield catalogue | AP2498_007 |
| REQ-005 — Prefill from the RSP program / vehicle | AP2498_008, AP2498_009, AP2498_010 |
| REQ-006 — Submit saves on the RSP program and re-quotes in place | AP2498_009, AP2498_010, AP2498_011 |
| REQ-007 — VIN-only submit accepted, notice below the form | AP2498_012 |
| REQ-008 — Results update, form stays | AP2498_011, AP2498_013 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2498_011 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_011-step4-TiersInPlaceFormCollapsed_fail.png` |
| AP2498_012 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_012-step3-VinOnlyAcceptedWrongNotice_fail.png` |
| AP2498_013 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_013-step4-SameTiersFormCollapsed_fail.png` |
| AP2498_014 | BLOCKED | — |

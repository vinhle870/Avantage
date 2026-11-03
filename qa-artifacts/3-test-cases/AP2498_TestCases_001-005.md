# Test Cases — AP2498 (File 1 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2498 — Roadside protection: keep the existing vehicle form visible and add VIN + Year
**Source:** requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md · qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2498_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2498_001 to AP2498_005 (5 test cases)
**Coverage:** Functional · Regression · UI · Negative

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
| **Leaves behind** | One new inventory vehicle, one client and one quote per case (AP2498_001–005), plus the quote's roadside-protection program record once the RSP flow is opened. AP2498_002 (only when no products appear) submits the RSP form once with a catalogue Make/Model and AP2498_003 once with a Make/Model other than the vehicle's (`Honda`); 001, 004 and 005 only open and inspect it. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

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
| 1 | The inventory add-vehicle form (add control label, required fields, controls) is not mapped in `domain` | AP2498_001–005 | Not blocking at design — the route `/vehicle/inventory` is known; the executor maps the form on first use and writes it back to `quote-creation.md` |
| 2 | The add-roadside-protection **+** flow is not mapped in `domain` | AP2498_001–005 | Not blocking — reached through the **+** button shown in the ticket screenshot; mapped at run time (Q-002) |
| 3 | Which vehicle data makes AutoShield return products on staging | AP2498_002 | Open — Q-001 (Judgement). Not blocking at design; the AutoShield outcome rule above applies at run time |

> No case ships BLOCKED. All five are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2498_001 | Opening roadside protection for a vehicle with no VIN shows the vehicle form with the no-products notice below it | Functional | High | FAIL |
| AP2498_002 | Opening roadside protection for a complete vehicle shows the vehicle form above the product results | Regression | High | FAIL |
| AP2498_003 | With make and model already stored and products returned, the vehicle form is still shown with the stored values | Regression | High | FAIL |
| AP2498_004 | The roadside-protection form holds only VIN, Year, Make, Model and Continue — no vehicle editor, client or contract fields | Functional | High | BLOCKED |
| AP2498_005 | Only VIN is required on the roadside-protection form, and typing a VIN triggers no VIN lookup | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2498_001 — Opening roadside protection for a vehicle with no VIN shows the vehicle form with the no-products notice below it

| Field | Value |
|---|---|
| **TC ID** | AP2498_001 |
| **Title** | Opening roadside protection for a vehicle with no VIN shows the vehicle form with the no-products notice below it |
| **Requirement** | AP2498 — REQ-001, AC "The existing form is always visible in the RSP flow"; description "When no products are returned, the screen shows the existing message … below the form rather than a bare error." |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — No-products notice below the form has the wrong text ("No road side protection products are available for this vehicle.") |

**Why this matters:** This is the state of the ticket's first screenshot: a vehicle with
no VIN, where AutoShield returned no products and the screen showed a red alert **above**
a Make/Model form. After the change the form must come first and the notice must sit
below it. The notice's styling (red alert or information message) is recorded, not
judged (Q-013).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN if the inventory refuses an empty VIN: `2T1BURHE3NC498001` |
| Client last name | `Roadside2498-001` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values (VIN empty) | The vehicle details page `/vehicle/{vehicleId}/details` opens, shows Toyota Corolla 2022 (or the recorded Make/Model) and an empty VIN; the vehicle id is recorded |
| 2 | [Pre-Condition] On that page click **Create quote**, fill the shared client values (last name `Roadside2498-001`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Roadside Roadside2498-001`; the quote id is recorded; "Summary of products" shows a "Roadside Protection" row with "- None Selected -" and a **+** button |
| 3 | In "Summary of products", click the **+** button on the "Roadside Protection" row | The roadside-protection flow opens without an error page or HTTP 5xx. Record whether it is a modal on the quote page or the page `/quote/{id}/road-side-protection` (Q-002) |
| 4 | [Verification] Inspect the flow from top to bottom | The RSP vehicle form (VIN, Year, Make, Model, **Continue**) is shown, and the no-products notice *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* is rendered **below** the form (below the **Continue** button), not above it; no product tiers are listed. If product tiers appear instead of the notice, record them and apply the AutoShield outcome rule (BLOCKED — Q-001). Record the notice's styling (Q-013) |

---

### AP2498_002 — Opening roadside protection for a complete vehicle shows the vehicle form above the product results

| Field | Value |
|---|---|
| **TC ID** | AP2498_002 |
| **Title** | Opening roadside protection for a complete vehicle shows the vehicle form above the product results |
| **Requirement** | AP2498 — REQ-001, AC "The existing form is always visible in the RSP flow"; description "When products **are** returned, that form is not rendered at all" (the defect) and "Render that form above the product results in both states" |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — In the products state the form is collapsed behind "Edit" |

**Why this matters:** Before the change, a vehicle that got products never showed the
form, so a dealer with a wrong vehicle could not correct it. This case proves the form is
there in the products state too. Which tiers and prices appear is AutoShield's decision
and is recorded, not judged (Q-001).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle P, VIN `2T1BURHE5NC498002` |
| Client last name | `Roadside2498-002` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle P at `/vehicle/inventory` with the shared Vehicle P values (VIN `2T1BURHE5NC498002`) | The vehicle details page opens and shows Toyota Corolla 2022 (or the recorded Make/Model) with VIN `2T1BURHE5NC498002`; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-002`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded; "Summary of products" shows "Roadside Protection — - None Selected -" with a **+** button |
| 3 | Click the **+** button on the "Roadside Protection" row | The roadside-protection flow opens without an error page or HTTP 5xx |
| 4 | If the no-products notice is shown below the form, choose a catalogue Make/Model (catalogue choice rule) and click **Continue** once | No error page or HTTP 5xx. Record whether product tiers now appear. If the notice is still shown, apply the AutoShield outcome rule (BLOCKED — Q-001) |
| 5 | [Verification] Inspect the flow from top to bottom | The RSP vehicle form (VIN, Year, Make, Model, **Continue**) is shown at the top, and the product tiers are listed **below** it in the same flow. Record the tiers and prices shown (Q-001) |

---

### AP2498_003 — With make and model already stored and products returned, the vehicle form is still shown with the stored values

| Field | Value |
|---|---|
| **TC ID** | AP2498_003 |
| **Title** | With make and model already stored and products returned, the vehicle form is still shown with the stored values |
| **Requirement** | AP2498 — REQ-002, AC "Form stays visible when make/model are already set" |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — Stored Honda/Accord kept, tiers below, but the form is collapsed behind "Edit" |

**Why this matters:** This is the exact defect named in the ticket: once make and model
are complete and AutoShield returns products, the form used to disappear. The case first
stores a make and model through the form itself, then re-opens the flow from a reloaded
quote page, so what it sees comes from storage and not from the screen it just left. The
Make chosen is not the vehicle's own make, so a Make/Model shown on re-open can only come
from the stored values and not from a prefill from the vehicle (Q-009).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle P, VIN `2T1BURHE7NC498003` |
| Client last name | `Roadside2498-003` |
| RSP Make / Model | A Make other than the vehicle's (`Toyota`, or the Make recorded at step 1): `Honda` / its first Model; if `Honda` is not offered, the first Make that is not the vehicle's Make and its first Model (recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle P at `/vehicle/inventory` with the shared Vehicle P values (VIN `2T1BURHE7NC498003`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-003`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** on the "Roadside Protection" row; in the RSP form choose the Make and Model from Test Data, leave VIN and Year as prefilled (if VIN is empty, type `2T1BURHE7NC498003`), and click **Continue** | No error page or HTTP 5xx; the flow is shown again with the chosen Make and Model. Record whether product tiers appear |
| 4 | Close the flow (close button or browser back to `/quote/{id}/details`), reload the quote page, and click the **+** on the "Roadside Protection" row again | The roadside-protection flow opens again without an error page or HTTP 5xx |
| 5 | [Verification] Inspect the flow from top to bottom | The RSP vehicle form is shown, with **Make** and **Model** showing the values chosen at step 3 (not the vehicle's own make and model — the vehicle's values there are a fault), and the product tiers are listed **below** the form. If no product tiers are listed, record the notice and apply the AutoShield outcome rule (BLOCKED — Q-001) |

---

### AP2498_004 — The roadside-protection form holds only VIN, Year, Make, Model and Continue — no vehicle editor, client or contract fields

| Field | Value |
|---|---|
| **TC ID** | AP2498_004 |
| **Title** | The roadside-protection form holds only VIN, Year, Make, Model and Continue — no vehicle editor, client or contract fields |
| **Requirement** | AP2498 — REQ-003, AC "The form is the existing form plus VIN and Year; VIN is the only required field" (first Given/Then) |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Parked at Gate B (R2 round 3): step 5 "nothing else" vs a probable hidden CSRF input |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | BLOCKED — Parked at Gate B (R2 round 3) — not run |

**Why this matters:** The ticket asks for the **existing** short form with two inputs
added, not a new form and not the full vehicle editor. The executor reads the form's
controls and their `name` attributes from the page (browser snapshot or element
inspection). Vehicle N is used so that no product section is on screen to confuse the
count. The case does **not** submit.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN `2T1BURHE9NC498004` |
| Client last name | `Roadside2498-004` |
| Year typed (not submitted) | `2021` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-004`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The quote page loads, the quote id is recorded, and the roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | Read every control inside the RSP vehicle form element: its label, type and `name` attribute | Record the list of controls, their labels and `name` attributes, and the form's `name` prefix |
| 4 | Click in **Year**, type `2021` (do not click **Continue**) | The Year field shows `2021` — it is editable |
| 5 | [Verification] Compare the recorded controls with the AC | The form holds exactly: the existing Make (`vehicleMake`) and Model (`vehicleModel`) controls and the **Continue** button (`continue`), plus one plain VIN **text** input and one Year input — nothing else. It shows no other vehicle field (Kilometers, Price, Condition, Designation, Stock number, transmission, engine), no client field (name, email, phone, address) and no contract field (sale price, odometer reading, tier). VIN and Year carry the same `name` prefix as `vehicleMake` and `vehicleModel`, showing they belong to the same form, not a new one |

---

### AP2498_005 — Only VIN is required on the roadside-protection form, and typing a VIN triggers no VIN lookup

| Field | Value |
|---|---|
| **TC ID** | AP2498_005 |
| **Title** | Only VIN is required on the roadside-protection form, and typing a VIN triggers no VIN lookup |
| **Requirement** | AP2498 — REQ-003, AC "The form is the existing form plus VIN and Year; VIN is the only required field" (second Given/Then) |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — VIN has no `required` attribute |

**Why this matters:** Today Make and Model are both required (the screenshot labels them
"Make\*" and "Model\*"), which is why a dealer who knows only the VIN is stuck. The AC
makes VIN the only required field and forbids a VIN lookup/decode on it. Whether the
labels still carry an asterisk is recorded, not judged (Q-003). The case does **not**
submit.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN `2T1BURHE0NC498005` |
| Client last name | `Roadside2498-005` |
| VIN typed (not submitted) | `2T1BURHE4NC498105` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-005`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The quote page loads, the quote id is recorded, and the roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | Read the `required` attribute of the VIN, Year, Make and Model controls, and the labels next to them; look for any button or icon next to VIN (e.g. "Décoder", "Decode", "Lookup", a magnifier) | Record each control's `required` state and label text, including any "\*" (Q-003) |
| 4 | Clear **VIN**, type `2T1BURHE4NC498105`, press Tab and wait 3 seconds (do not click **Continue**) | VIN shows `2T1BURHE4NC498105`; no error page |
| 5 | [Verification] Compare the recorded attributes and the form after step 4 | VIN has the `required` attribute; Year, Make and Model have **no** `required` attribute. There is no VIN lookup/decode button or icon next to VIN. After typing the VIN, Year, Make and Model are unchanged from before step 4 — nothing was filled in from the VIN |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Form always visible, results or notice below | AP2498_001 | — | — | AP2498_002 |
| REQ-002 — Form stays when make/model stored and products returned | — | — | — | AP2498_003 |
| REQ-003 — Existing fields + VIN + Year; only VIN required; no lookup | AP2498_004, AP2498_005 | AP2498_006 (file 2) | — | — |
| REQ-004 … REQ-008 | see files 2 and 3 | | | |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2498_001 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_001-step4-FormAboveDifferentNotice_fail.png` |
| AP2498_002 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_002-step5-FormCollapsedAboveTiers_fail.png` |
| AP2498_003 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_003-step5-StoredHondaFormCollapsed_fail.png` |
| AP2498_004 | BLOCKED | — |
| AP2498_005 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_005-step5-VinNotRequiredNoLookup_fail.png` |

# Test Cases — AP2498 (File 2 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2498 — Roadside protection: keep the existing vehicle form visible and add VIN + Year
**Source:** requirements/AP-2498-roadside-protection-keep-existing-vehicle-form.md · qa-artifacts/1-requirements-analysis/AP-2498_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2498_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2498_006 to AP2498_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case

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
| **Leaves behind** | One new inventory vehicle, one client and one quote per case (AP2498_006–010), plus the quote's roadside-protection program record. AP2498_009 and AP2498_010 submit the RSP form (009 saves VIN `2T1BURHE1NC498109`; 010 may also change the vehicle's VIN/year — Q-010); 006 submits a refused form; 007 and 008 only open and inspect it. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

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
| 1 | The inventory add-vehicle form (add control label, required fields, controls) is not mapped in `domain` | AP2498_006–010 | Not blocking at design — the route `/vehicle/inventory` is known; the executor maps the form on first use and writes it back to `quote-creation.md` |
| 2 | The add-roadside-protection **+** flow is not mapped in `domain` | AP2498_006–010 | Not blocking — reached through the **+** button shown in the ticket screenshot; mapped at run time (Q-002) |
| 3 | How an empty or invalid VIN is reported (Q-004), which value wins when the RSP program and the vehicle differ (Q-008), whether Make/Model prefill from the vehicle (Q-009), whether a submit changes the vehicle (Q-010) | AP2498_006, 008, 009, 010 | Open — Judgement. Those results are record-only; no case ships BLOCKED |

> No case ships BLOCKED. All five are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2498_006 | Submitting the roadside-protection form with an empty VIN is refused and saves nothing | Negative | High | FAIL |
| AP2498_007 | The Make list is filled and the Model list changes to the models of the Make selected | Functional | Medium | PASS |
| AP2498_008 | On a new quote, the form shows the vehicle's VIN and year when nothing is stored for roadside protection yet | Functional | High | PASS |
| AP2498_009 | A submitted VIN, Make and Model are kept and shown again when the roadside-protection flow is re-opened | Functional | High | FAIL |
| AP2498_010 | Submitting a VIN and year different from the vehicle's keeps the flow working and records which value is shown | Edge-case | Medium | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2498_006 — Submitting the roadside-protection form with an empty VIN is refused and saves nothing

| Field | Value |
|---|---|
| **TC ID** | AP2498_006 |
| **Title** | Submitting the roadside-protection form with an empty VIN is refused and saves nothing |
| **Requirement** | AP2498 — REQ-003, AC "Then the VIN input is required …"; description "a required **VIN**" |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — Empty-VIN submit accepted; Honda/Accord saved |

**Why this matters:** VIN is now the one field AutoShield must have. A required field that
can still be submitted empty would send a quote request without it. How the refusal is
shown — the browser's own "Please fill out this field" bubble or a message on the page —
is not stated, so its wording is recorded (Q-004). The Make chosen here is deliberately
**not** the vehicle's own make, so that if it shows up after re-opening, it can only have
been saved by this submit.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN `2T1BURHE2NC498006` (if used, clear the VIN field in the RSP form at step 3, and the VIN checks at steps 3 and 5 also accept this fallback VIN — see each step) |
| Client last name | `Roadside2498-006` |
| RSP Make / Model | A Make other than the vehicle's (`Toyota`): `Honda` / its first Model; if `Honda` is not offered, the first Make that is not `Toyota` and its first Model (recorded) |
| RSP Year | `2022` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-006`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The quote page loads, the quote id is recorded, and the roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | Leave **VIN** empty, type `2022` in **Year**, choose the Make and Model from Test Data, and click **Continue** | The submit is refused: the flow stays on the form; no error page or HTTP 5xx. **VIN** is still empty — or, if the fallback VIN was used at step 1, empty or the vehicle's `2T1BURHE2NC498006` (record which; any other value is a fault). Record exactly how VIN is flagged — browser bubble text or on-page message (Q-004) — and whether Year, Make and Model keep the values just entered (not stated in the ticket — record only) |
| 4 | Close the flow (close button or browser back to `/quote/{id}/details`), reload the quote page, and click the **+** on the "Roadside Protection" row again | The roadside-protection flow opens again without an error page or HTTP 5xx |
| 5 | [Verification] Read the RSP form | **VIN** is empty, or — if the fallback VIN was used at step 1 — shows the vehicle's `2T1BURHE2NC498006` (record which); any other value, in particular a value typed at step 3, is a fault. **Make** does not show the Make chosen at step 3 (nor **Model** its Model) — nothing from the refused submit was saved |

---

### AP2498_007 — The Make list is filled and the Model list changes to the models of the Make selected

| Field | Value |
|---|---|
| **TC ID** | AP2498_007 |
| **Title** | The Make list is filled and the Model list changes to the models of the Make selected |
| **Requirement** | AP2498 — REQ-004, AC "Make and Model options come from the AutoShield catalogue" |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | PASS — Make list filled (151); Model list follows the Make |

**Why this matters:** The lists must come from the AutoShield catalogue, but QA has no
copy of that catalogue to compare against (Q-006). The case therefore judges what the
screen can prove — the Make list is filled, and the Model list belongs to the selected
Make — and records counts and samples so the author can confirm them. When the Model list
refreshes, and whether a chosen Model is cleared on a Make change, is recorded (Q-007).
The case does **not** submit.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN); fallback VIN `2T1BURHE4NC498007` |
| Client last name | `Roadside2498-007` |
| Make A / Make B | `Toyota` / `Honda`; if either is not offered, the first and second real Makes in the list (recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-007`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The quote page loads, the quote id is recorded, and the roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | Open the **Make** list; record the number of options and the first ten. Choose Make A, then open the **Model** list and record its options | The Make list holds at least one real make besides the "Choose" placeholder. After Make A is chosen, the Model list holds at least one model. Record whether the Model list filled at once or only after another action (Q-007) |
| 4 | Choose a Model of Make A, then change **Make** to Make B and open the **Model** list again; record its options | No error page. Record whether the Model chosen for Make A is cleared (Q-007) |
| 5 | [Verification] Compare the two recorded Model lists | The Model list for Make B differs from the one for Make A, and the Model list for Make B does not contain the Model chosen for Make A. Record both lists and the Make count for Q-006 |

---

### AP2498_008 — On a new quote, the form shows the vehicle's VIN and year when nothing is stored for roadside protection yet

| Field | Value |
|---|---|
| **TC ID** | AP2498_008 |
| **Title** | On a new quote, the form shows the vehicle's VIN and year when nothing is stored for roadside protection yet |
| **Requirement** | AP2498 — REQ-005, AC "Prefill from existing data" — "VIN/Year show the stored RSP values (or the vehicle's VIN/year) … any field without a resolvable value falls back to its normal empty/placeholder state" |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | PASS — VIN and Year from the vehicle; Make/Model placeholders |

**Why this matters:** On a fresh quote the roadside-protection program has nothing stored,
so the only VIN and year the form can show are the vehicle's. A blank VIN here would make
the dealer retype what the quote already knows. Whether Make and Model also prefill from
the vehicle's own make and model is not stated (Q-009), so what they show is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle P, VIN `2T1BURHE6NC498008`, Year `2022` |
| Client last name | `Roadside2498-008` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle P at `/vehicle/inventory` with the shared Vehicle P values (VIN `2T1BURHE6NC498008`) | The vehicle details page opens and shows VIN `2T1BURHE6NC498008` and year 2022; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-008`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded; the "Roadside Protection" row shows "- None Selected -" |
| 3 | Click the **+** on the "Roadside Protection" row | The roadside-protection flow opens without an error page or HTTP 5xx |
| 4 | [Verification] Read the VIN, Year, Make and Model controls of the RSP form | **VIN** shows `2T1BURHE6NC498008` and **Year** shows `2022`. **Make** and **Model** show either their empty/"Choose" placeholder or the vehicle's own make and model (`Toyota` / `Corolla`, or the recorded values) — any other value is a fault (a value nobody entered). Record which of the two they show (Q-009) |

---

### AP2498_009 — A submitted VIN, Make and Model are kept and shown again when the roadside-protection flow is re-opened

| Field | Value |
|---|---|
| **TC ID** | AP2498_009 |
| **Title** | A submitted VIN, Make and Model are kept and shown again when the roadside-protection flow is re-opened |
| **Requirement** | AP2498 — REQ-006, AC "Submit persists on the RSP program and re-evaluates in place"; REQ-005, AC "Prefill from existing data" ("Make/Model show the stored RSP values") |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — Values persist; form collapsed after the submit |

**Why this matters:** The values must be stored on the quote's roadside-protection program,
which QA cannot see directly. Re-opening the flow from a reloaded quote page proves they
were stored. Vehicle N has no VIN, so the VIN that comes back can only be the one
submitted (if the inventory forced the fallback VIN, the vehicle has a VIN too, and which
one the form shows is Q-008 — then recorded, not judged). The Make chosen is not the vehicle's own make, so it too can only come from the
submit. The submitted year differs from the vehicle's, and which one the form shows when
both exist is not stated (Q-008), so Year is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle N (no VIN, Year `2022`); fallback VIN `2T1BURHE8NC498009` (if used, the VIN checks at steps 3 and 5 become record-only under Q-008: the submitted VIN or this fallback VIN, any other value a fault) |
| Client last name | `Roadside2498-009` |
| RSP VIN | `2T1BURHE1NC498109` |
| RSP Year | `2021` |
| RSP Make / Model | `Honda` / its first Model; if `Honda` is not offered, the first Make that is not `Toyota` and its first Model (recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle N at `/vehicle/inventory` with the shared Vehicle N values | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-009`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then click the **+** on the "Roadside Protection" row | The quote page loads, the quote id is recorded, and the roadside-protection flow opens without an error page or HTTP 5xx |
| 3 | Type `2T1BURHE1NC498109` in **VIN** and `2021` in **Year**, choose the Make and Model from Test Data, and click **Continue** | The submit is accepted without an error page or HTTP 5xx; the dealer is still in the roadside-protection flow (URL recorded before and after) and the form is shown. **VIN** shows `2T1BURHE1NC498109` — if the fallback VIN was used at step 1, `2T1BURHE1NC498109` or the vehicle's fallback `2T1BURHE8NC498009`, any other value is a fault; record which (Q-008). **Make** shows the Make chosen and **Model** its Model. **Year** shows `2021` or the vehicle's `2022` — any other value is a fault; record which (Q-008) |
| 4 | Close the flow (close button or browser back to `/quote/{id}/details`), reload the quote page, and click the **+** on the "Roadside Protection" row again | The roadside-protection flow opens again without an error page or HTTP 5xx |
| 5 | [Verification] Read the RSP form | **VIN** shows `2T1BURHE1NC498109` — if the fallback VIN was used at step 1, `2T1BURHE1NC498109` or the vehicle's fallback `2T1BURHE8NC498009`, any other value is a fault; record which (Q-008). **Make** shows the Make chosen at step 3 and **Model** its Model. **Year** shows `2021` or the vehicle's `2022` — any other value is a fault; record which (Q-008) |

---

### AP2498_010 — Submitting a VIN and year different from the vehicle's keeps the flow working and records which value is shown

| Field | Value |
|---|---|
| **TC ID** | AP2498_010 |
| **Title** | Submitting a VIN and year different from the vehicle's keeps the flow working and records which value is shown |
| **Requirement** | AP2498 — REQ-005, AC "Prefill from existing data"; REQ-006, AC "Submit persists on the RSP program and re-evaluates in place" |
| **Route** | `/quote/{id}/details` — Summary of products → Roadside Protection **+**; `/vehicle/{vehicleId}/details` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02, Dev (v2dev) — execution-log_AP-2498_2026-11-02.md |
| **Result** | FAIL — RSP values shown, vehicle unchanged; form collapsed after the submit |

**Why this matters:** A dealer correcting a wrong VIN creates exactly this situation: the
roadside-protection program and the vehicle disagree. The ticket does not say which one
the form shows afterwards (Q-008), nor whether the submit also changes the vehicle in
inventory (Q-010). Both are recorded. The case fails only on objective faults: an error
page, or a value nobody entered.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | Vehicle P, VIN `2T1BURHE4NC498010`, Year `2022` |
| Client last name | `Roadside2498-010` |
| RSP VIN | `2T1BURHE8NC498110` |
| RSP Year | `2020` |
| RSP Make / Model | Catalogue choice rule |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create Vehicle P at `/vehicle/inventory` with the shared Vehicle P values (VIN `2T1BURHE4NC498010`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Roadside2498-010`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** on the "Roadside Protection" row; replace **VIN** with `2T1BURHE8NC498110` and **Year** with `2020`, choose the catalogue Make and Model, and click **Continue** | The submit is accepted without an error page or HTTP 5xx and the RSP form is still shown. **Make** and **Model** show the values chosen. **VIN** shows `2T1BURHE8NC498110` or the vehicle's `2T1BURHE4NC498010`, and **Year** `2020` or the vehicle's `2022` — any other value is a fault; record which (Q-008) |
| 4 | Open `/vehicle/{vehicleId}/details` and read the VIN and year | The page loads. VIN is `2T1BURHE4NC498010` or `2T1BURHE8NC498110` and year is `2022` or `2020` — any other value is a fault. Record which (Q-010) |
| 5 | [Verification] Return to `/quote/{id}/details`, reload, click the **+** on the "Roadside Protection" row and read the RSP form | The flow opens without an error page. **VIN** shows `2T1BURHE8NC498110` or `2T1BURHE4NC498010`, **Year** `2020` or `2022` — any other value is a fault; record which (Q-008). **Make** and **Model** show the values chosen at step 3 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-003 — VIN is required | — | AP2498_006 | — | — |
| REQ-004 — Make/Model lists from the AutoShield catalogue | AP2498_007 | — | — | — |
| REQ-005 — Prefill from the RSP program / vehicle | AP2498_008, AP2498_009 | — | AP2498_010 | — |
| REQ-006 — Submit saves on the RSP program, in place | AP2498_009 | — | AP2498_010 | — |
| REQ-001, REQ-002, REQ-007, REQ-008 | see files 1 and 3 | | | |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2498_006 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_006-step3-EmptyVinSubmitAccepted_fail.png` |
| AP2498_007 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_007-step5-ModelListFollowsMake_pass.png` |
| AP2498_008 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_008-step4-VinYearPrefilledFromVehicle_pass.png` |
| AP2498_009 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_009-step3-SubmitAcceptedFormCollapsed_fail.png` |
| AP2498_010 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_010-step3-SubmitAcceptedFormCollapsed_fail.png` |

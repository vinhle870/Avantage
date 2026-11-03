# Test Cases — AP2497 (File 1 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2497 — Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
**Source:** requirements/AP-2497-add-extended-warranty-capture-missing-vehicle.md · qa-artifacts/1-requirements-analysis/AP-2497_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2497_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2497_001 to AP2497_005 (5 test cases)
**Coverage:** Functional · Regression · UI · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory `/vehicle/inventory` (to create the case's vehicle) → `/vehicle/{vehicleId}/details` → **Create quote** → `/quote/new/client?fromVehicleId={vehicleId}` (never a bare `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500) → `/quote/{id}/details`, the quote page. On the quote page, the card **"Summary of products"** has a row **"Extended warranty"** ("- None Selected -") with a **+** button on the right; that button opens the add-extended-warranty modal (ticket screenshot image-20261016-131221.png) | `navigation` → `domain` (quote-creation.md); the Summary-of-products card and its modal are not yet mapped — taken from the ticket screenshots |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | No standing record is used. **Vehicle 915 must not be used** — these cases submit vehicle changes, which would alter the shared vehicle for every other ticket. Every vehicle, client and quote is created by the case itself | `test-data` |
| **Language** | EN for every judgement. The dealer UI may show French labels (e.g. "Année", "Kilométrage", "Marque", "Modèle"); `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One new inventory vehicle, one client and one quote per case (AP2497_001–005). Vehicles of 001–004 are not changed by the case; nothing else is created. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared vehicle values (V1 — complete)** — at `/vehicle/inventory` click the add-vehicle
control (label not mapped yet; record it), choose Vehicle type = the first passenger-car
option (record its label), type VIN = `AP2497TC0NN000000` where `NN` is the case number
(17 characters; do **not** click "Décoder"), Make `Toyota`, Model `Corolla`, Year `2022`,
Kilometers `15000`, Fuel type "Gasoline" (French "Essence"), Price `20000`, and for any
other field the form marks required, its first option (record each one) → **Save**. If
`Toyota` / `Corolla` are not offered, take the first Make and first Model in the list and
record them. Record the new vehicle id from the URL `/vehicle/{vehicleId}/details`.

**Shared vehicle values (V2 — Kilometers missing)** — the same as V1, but leave
**Kilometers empty**. If the inventory form refuses to save without Kilometers, record the
error text, save with Kilometers `15000`, and note in the log that the dead-end state could
not be prepared through the inventory form.

**Shared client values** — used in every case's client form, changing only the last name:
First name `Warranty`, Last name as given in the case, Email `client.stage.NNN@yopmail.com`
(next unused number, recorded), Address `100 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`,
"I agree to the policy" ticked → **Save**. Then on the vehicle step `/quote/{id}/vehicle`
keep the pre-attached vehicle, Delivered at `2026-11-01`, Price `20000` → **Save**.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The inventory add-vehicle form (label of the add control, required fields, Make/Model/Fuel type/Vehicle type controls) is not mapped in `domain` | AP2497_001–005 | Not blocking at design — the route `/vehicle/inventory` is known; the executor maps the form on first use and writes it back to `quote-creation.md` |
| 2 | The add-extended-warranty modal is not mapped in `domain` | AP2497_001–005 | Not blocking — reached through the **+** button shown in the ticket screenshot; mapped at run time |

> No case shipped BLOCKED. Executed 2026-11-02 on Dev (v2dev) — see the Execution Log table below.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2497_001 | Adding an extended warranty for a vehicle with no mileage shows the vehicle form, not only the dead-end message | Functional | High | FAIL |
| AP2497_002 | Adding an extended warranty for a complete vehicle shows the form with the program results below it | Regression | High | FAIL |
| AP2497_003 | The extended-warranty vehicle form holds only Year, Kilometers, Make, Model, Fuel type and Vehicle type, all editable | Functional | Medium | FAIL |
| AP2497_004 | Each of the six form fields is prefilled with the value stored on the quote's vehicle | Functional | High | FAIL |
| AP2497_005 | Filling the missing mileage and submitting saves it and refreshes the results without leaving the modal | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2497_001 — Adding an extended warranty for a vehicle with no mileage shows the vehicle form, not only the dead-end message

| Field | Value |
|---|---|
| **TC ID** | AP2497_001 |
| **Title** | Adding an extended warranty for a vehicle with no mileage shows the vehicle form, not only the dead-end message |
| **Requirement** | AP2497 — REQ-001, AC "The form is visible in the extended-warranty flow"; REQ-003 (prefill of the five stored fields) |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — F1 no Vehicle type field; form collapsed at open. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** This is the exact situation in the ticket's second screenshot: a
vehicle with no mileage, where the modal used to show only *"There are no eligible program
for the vehicle. Please contact us for more information."* and the dealer had to leave the
quote. The case also records what the empty Kilometers field shows (Q-004) and the wording
of any no-program notice (Q-008), without judging them.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V2 (Kilometers empty), VIN `AP2497TC001000000` |
| Client last name | `Warranty2497-001` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V2 at `/vehicle/inventory` with the shared V2 values (VIN `AP2497TC001000000`, Kilometers empty) | The vehicle details page `/vehicle/{vehicleId}/details` opens; the vehicle id is recorded, and the page shows Toyota Corolla 2022 (or the recorded Make/Model) with no mileage value |
| 2 | [Pre-Condition] On that page click **Create quote**, fill the shared client values (last name `Warranty2497-001`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Warranty Warranty2497-001`; the quote id is recorded; the "Summary of products" card shows an "Extended warranty" row with "- None Selected -" and a **+** button |
| 3 | In "Summary of products", click the **+** button on the "Extended warranty" row | A modal opens on the same page (the URL is unchanged) without an error page or HTTP 5xx |
| 4 | [Verification] Inspect the modal | The modal contains a form with the fields Year, Kilometers, Make, Model, Fuel type and Vehicle type and a submit control; Year shows `2022`, Make `Toyota`, Model `Corolla`, Fuel type "Gasoline" and Vehicle type the recorded car type (or the recorded values). **Below** the form there is either a list of eligible programs or a no-program notice — the modal is not only the notice. Record what the Kilometers field shows (Q-004), the notice text if any (Q-008) and the programs listed if any (Q-006) |

---

### AP2497_002 — Adding an extended warranty for a complete vehicle shows the form with the program results below it

| Field | Value |
|---|---|
| **TC ID** | AP2497_002 |
| **Title** | Adding an extended warranty for a complete vehicle shows the form with the program results below it |
| **Requirement** | AP2497 — REQ-001, AC "The form is visible in the extended-warranty flow"; description "The eligible-program results render below the form." |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Form hidden behind "Edit" when the modal opens. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** Most vehicles already have every value stored. For them the new form
must not get in the way: the results still appear, and a program can still be chosen to
add the warranty. Which programs should appear is not stated (Q-006), so the programs are
recorded, not judged; so is any other warranty entry point on the page (Q-001).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC002000000` |
| Client last name | `Warranty2497-002` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC002000000`, Kilometers `15000`) | The vehicle details page opens and shows Toyota Corolla 2022 with 15000 km (or the recorded Make/Model); the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-002`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded; "Summary of products" shows "Extended warranty — - None Selected -" with a **+** button |
| 3 | Click the **+** button on the "Extended warranty" row | A modal opens on the same page without an error page or HTTP 5xx; the vehicle form is at the top of the modal |
| 4 | If programs are listed below the form, select the first program and follow the modal's own confirm control. Then look on the quote page for any other extended-warranty entry (for example "Click here to create a warranty") and, if one exists, open it | No error page or HTTP 5xx. Record the programs listed, the control used, and what the "Extended warranty" row of "Summary of products" shows afterwards (record-only, Q-006). If no program is listed, record the notice text (Q-008) and skip the selection. Record any other entry found and whether it shows the vehicle form (record-only, Q-001) |
| 5 | [Verification] Look back at the screenshot taken at step 3 | The vehicle form sits above the results area, and the results area (a program list or a no-program notice) is rendered directly below the form inside the same modal |

---

### AP2497_003 — The extended-warranty vehicle form holds only Year, Kilometers, Make, Model, Fuel type and Vehicle type, all editable

| Field | Value |
|---|---|
| **TC ID** | AP2497_003 |
| **Title** | The extended-warranty vehicle form holds only Year, Kilometers, Make, Model, Fuel type and Vehicle type, all editable |
| **Requirement** | AP2497 — REQ-002, AC "Form exposes only the required fields" |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Five controls; Vehicle type missing. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** The point of the short form is speed: the dealer sees only the six
values eligibility uses. Any other vehicle field on it means the full vehicle editor leaked
into the modal. The case types into each field but **does not submit**, so the vehicle is
not changed. Control types, options and labels are recorded for Q-003.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC003000000` |
| Client last name | `Warranty2497-003` |
| Trial values (not submitted) | Year `2020`, Kilometers `30000`, Make / Model / Fuel type / Vehicle type: the second option of each list, or `Honda` / `Civic` / `Diesel` if free text |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC003000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-003`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row; in the modal's vehicle form, enter the trial values in each of the six fields one by one (do not submit) | The modal opens without an error page or HTTP 5xx. Each of the six fields accepts its trial value: the field shows the new value after it is typed or selected. Record each control's type (text, number, drop-down) and label (Q-003) |
| 4 | Close the modal without submitting (its close control or Escape) | The modal closes and the quote page is still shown; nothing was submitted |
| 5 | [Verification] Count the input controls of the vehicle form in the screenshot taken at step 3 | The form has exactly six input controls — Year, Kilometers, Make, Model, Fuel type and Vehicle type — and no other vehicle field (no VIN, Price, Condition, Designation, Transmission, Engine size, Cylinders, Turbo, 4x4/AWD or manufacturer-warranty field) |

---

### AP2497_004 — Each of the six form fields is prefilled with the value stored on the quote's vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2497_004 |
| **Title** | Each of the six form fields is prefilled with the value stored on the quote's vehicle |
| **Requirement** | AP2497 — REQ-003, AC "Form is prefilled from the existing vehicle" |
| **Route** | `/vehicle/{vehicleId}/details` and `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Five fields prefilled correctly; no Vehicle type field. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** The ticket's promise is that the dealer "only corrects what is missing
or wrong". A blank or wrong prefill makes the dealer retype values — or overwrite correct
data with a guess. Distinct values (Year 2021, Kilometers 23456) are used so a default
value cannot pass for a prefill.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 values **except** Year `2021` and Kilometers `23456`; VIN `AP2497TC004000000` |
| Client last name | `Warranty2497-004` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create a vehicle at `/vehicle/inventory` with the shared V1 values but Year `2021` and Kilometers `23456` (VIN `AP2497TC004000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-004`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Open `/vehicle/{vehicleId}/details` and record the stored Year, Kilometers, Make, Model, Fuel type and Vehicle type as the page shows them; then return to `/quote/{id}/details` | The details page shows Year 2021, 23456 km, Toyota, Corolla, Gasoline and the recorded car type (or the recorded Make/Model); the quote page loads again |
| 4 | Click the **+** button on the "Extended warranty" row | The modal opens with the vehicle form, without an error page or HTTP 5xx |
| 5 | [Verification] Compare each form field with the values recorded at step 3 | Year shows `2021`, Kilometers `23456`, Make `Toyota`, Model `Corolla`, Fuel type "Gasoline" and Vehicle type the recorded car type (or the recorded values) — each field equals the stored value |

---

### AP2497_005 — Filling the missing mileage and submitting saves it and refreshes the results without leaving the modal

| Field | Value |
|---|---|
| **TC ID** | AP2497_005 |
| **Title** | Filling the missing mileage and submitting saves it and refreshes the results without leaving the modal |
| **Requirement** | AP2497 — REQ-004, AC "Submit persists and re-evaluates in place"; description "Submitting updates the vehicle and re-runs eligibility on the same screen" |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Saved and results refreshed, but form collapses after submit. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** This is the fix the ticket asks for: the dealer completes the missing
value in place and gets results, instead of going back to inventory. "Without a full page
navigation" is judged objectively — the URL does not change and the modal stays open.
Whether the results change from a notice to a list depends on eligibility rules nobody has
stated (Q-006), so that change is recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V2 (Kilometers empty), VIN `AP2497TC005000000` |
| Client last name | `Warranty2497-005` |
| Kilometers entered | `15000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V2 at `/vehicle/inventory` with the shared V2 values (VIN `AP2497TC005000000`, Kilometers empty) | The vehicle details page opens with no mileage value; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-005`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id and the page URL are recorded |
| 3 | Click the **+** button on the "Extended warranty" row, record the results area (programs or notice), type `15000` in "Kilometers" and click the form's submit control | No error page or HTTP 5xx. The URL is still `/quote/{id}/details` (unchanged), the modal is still open, the form still shows the six fields with Kilometers `15000` and the other five values unchanged, and a results area (a program list or a no-program notice) is rendered below the form. Record whether the results changed from before the submit (Q-006) |
| 4 | Reload `/quote/{id}/details`, click the **+** button on the "Extended warranty" row again; then open `/vehicle/{vehicleId}/details` and record its mileage (Q-005, Q-007) | The quote page and the modal load without an error page or HTTP 5xx. Record the mileage the vehicle details page shows |
| 5 | [Verification] Check the Kilometers field in the screenshot of the re-opened modal at step 4 | Kilometers shows `15000` after the reload, and Year, Make, Model, Fuel type and Vehicle type still show their original values |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Form shown in the extended-warranty flow, results below | AP2497_001 | — | — | AP2497_002 |
| REQ-002 — Only the six fields, each editable | AP2497_003 | — | — | — |
| REQ-003 — Prefilled from the stored vehicle | AP2497_004 | — | AP2497_001 (empty Kilometers) | — |
| REQ-004 — Submit saves and refreshes in place | AP2497_005 | — | — | — |
| REQ-004 (more), REQ-005 — Year / Kilometers validation | see AP2497_TestCases_006-010.md and AP2497_TestCases_011-015.md | | | |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2497_001 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_001-step4-FormFiveFieldsNoVehicleType_fail.png` |
| AP2497_002 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_002-step3-ModalFormCollapsed_fail.png` |
| AP2497_003 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_003-step5-FiveControlsNoVehicleType_fail.png` |
| AP2497_004 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_004-step5-PrefillFiveOfSixNoVehicleType_fail.png` |
| AP2497_005 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_005-step3-AfterSubmitFormCollapsedResultsRefreshed_fail.png` |

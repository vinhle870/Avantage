# Test Cases — AP2497 (File 2 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2497 — Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
**Source:** requirements/AP-2497-add-extended-warranty-capture-missing-vehicle.md · qa-artifacts/1-requirements-analysis/AP-2497_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2497_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2497_006 to AP2497_010 (5 test cases)
**Coverage:** Functional · Edge-case · Negative

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
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One new inventory vehicle, one client and one quote per case (AP2497_006–010). The vehicle of 006 is changed to the corrected values; the vehicles of 007–010 keep their creation values if the build behaves as specified. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared vehicle values (V1 — complete)** — at `/vehicle/inventory` click the add-vehicle
control (label not mapped yet; record it), choose Vehicle type = the first passenger-car
option (record its label), type VIN = `AP2497TC0NN000000` where `NN` is the case number
(17 characters; do **not** click "Décoder"), Make `Toyota`, Model `Corolla`, Year `2022`,
Kilometers `15000`, Fuel type "Gasoline" (French "Essence"), Price `20000`, and for any
other field the form marks required, its first option (record each one) → **Save**. If
`Toyota` / `Corolla` are not offered, take the first Make and first Model in the list and
record them. Record the new vehicle id from the URL `/vehicle/{vehicleId}/details`.

**Shared client values** — used in every case's client form, changing only the last name:
First name `Warranty`, Last name as given in the case, Email `client.stage.NNN@yopmail.com`
(next unused number, recorded), Address `100 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`,
"I agree to the policy" ticked → **Save**. Then on the vehicle step `/quote/{id}/vehicle`
keep the pre-attached vehicle, Delivered at `2026-11-01`, Price `20000` → **Save**.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The inventory add-vehicle form and the add-extended-warranty modal are not mapped in `domain` | AP2497_006–010 | Not blocking at design — mapped by the executor on first use (see file 1) |

> No case shipped BLOCKED. Executed 2026-11-02 on Dev (v2dev) — see the Execution Log table below.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2497_006 | Correcting all six vehicle values in the warranty form saves every one of them on the vehicle | Functional | High | FAIL |
| AP2497_007 | Submitting the prefilled values unchanged keeps the vehicle as it was and still shows results below the form | Edge-case | Medium | FAIL |
| AP2497_008 | Submitting an empty Year or an empty Kilometers shows an error on that field and saves nothing | Negative | High | FAIL |
| AP2497_009 | Submitting letters in Year or in Kilometers shows an error on that field and saves nothing | Negative | High | FAIL |
| AP2497_010 | Submitting a negative Year or negative Kilometers shows an error on that field and saves nothing | Negative | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2497_006 — Correcting all six vehicle values in the warranty form saves every one of them on the vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2497_006 |
| **Title** | Correcting all six vehicle values in the warranty form saves every one of them on the vehicle |
| **Requirement** | AP2497 — REQ-004, AC "Submit persists and re-evaluates in place" ("the dealer corrects … the prefilled values … the values persist on the quote's `Vehicle` (a reload shows them)") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Vehicle type cannot be corrected; form collapses after submit; five values saved. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** AP2497_005 proves one field is saved. This case changes every field
at once, so a field that the form shows but does not write back is caught. Whether the
inventory vehicle's details page also changes is recorded for Q-005 and Q-007.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC006000000` |
| Client last name | `Warranty2497-006` |
| Corrected values | Year `2019`, Kilometers `48000`, Make `Honda`, Model `Civic`, Fuel type "Diesel", Vehicle type = the second option of its list. If a value is not offered, take the second option of that list and record it |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC006000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-006`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, replace all six fields with the corrected values and click the form's submit control | No error page or HTTP 5xx. The URL is still `/quote/{id}/details`, the modal is still open, the form shows the six corrected values, and a results area (a program list or a no-program notice) is rendered below the form. Record the results (Q-006) |
| 4 | Reload `/quote/{id}/details` and click the **+** button on the "Extended warranty" row again; then open `/vehicle/{vehicleId}/details` and record the six values it shows (Q-005, Q-007) | The quote page and the modal load without an error page or HTTP 5xx. Record the vehicle details page values |
| 5 | [Verification] Check the six fields in the screenshot of the re-opened modal at step 4 | Year `2019`, Kilometers `48000`, Make `Honda`, Model `Civic`, Fuel type "Diesel" and the chosen Vehicle type (or the recorded values) — all six corrected values are shown after the reload |

---

### AP2497_007 — Submitting the prefilled values unchanged keeps the vehicle as it was and still shows results below the form

| Field | Value |
|---|---|
| **TC ID** | AP2497_007 |
| **Title** | Submitting the prefilled values unchanged keeps the vehicle as it was and still shows results below the form |
| **Requirement** | AP2497 — REQ-004, AC "Submit persists and re-evaluates in place" ("Given the dealer corrects **or confirms** the prefilled values") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Form collapses after submit; values unchanged. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** A dealer who only confirms what is there must not lose or change any
value — for example a drop-down that submits its first option instead of the stored one.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC007000000` |
| Client last name | `Warranty2497-007` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC007000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-007`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, record the six prefilled values, and click the form's submit control without changing anything | No error page or HTTP 5xx. The URL is still `/quote/{id}/details`, the modal is still open, the form shows the same six values as before the submit, and a results area (a program list or a no-program notice) is rendered below the form |
| 4 | Reload `/quote/{id}/details` and click the **+** button on the "Extended warranty" row again | The quote page and the modal load without an error page or HTTP 5xx |
| 5 | [Verification] Check the six fields of the re-opened modal | Year `2022`, Kilometers `15000`, Make `Toyota`, Model `Corolla`, Fuel type "Gasoline" and the recorded car type (or the recorded creation values) — unchanged |

---

### AP2497_008 — Submitting an empty Year or an empty Kilometers shows an error on that field and saves nothing

| Field | Value |
|---|---|
| **TC ID** | AP2497_008 |
| **Title** | Submitting an empty Year or an empty Kilometers shows an error on that field and saves nothing |
| **Requirement** | AP2497 — REQ-005, AC "Validation" ("Given empty … year/kilometers … Then a field-level error is shown and no partial update is persisted") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Field errors exist but are hidden in the collapsed form; nothing saved. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** An empty Year or mileage is the dead end this ticket removes; the
form must not let the dealer store it again. The error text is not given in the ticket, so
it is recorded; what is judged is that the error is attached to the offending field.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC008000000` |
| Client last name | `Warranty2497-008` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC008000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-008`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, clear "Year" (leave the other five values as prefilled) and click the form's submit control | No error page or HTTP 5xx. An error message is shown next to the "Year" field (record its text). Record whether the modal stays open |
| 4 | Reload `/quote/{id}/details`, re-open the modal, check that Year shows `2022`; then clear "Kilometers", click the submit control, record the error, reload the page and re-open the modal once more | Year shows `2022` after the first reload. On the second submit an error message is shown next to the "Kilometers" field (record its text). The page and the modal reload without an error page or HTTP 5xx |
| 5 | [Verification] Check Year and Kilometers in the modal re-opened at the end of step 4 | Year shows `2022` and Kilometers shows `15000` — neither empty value was saved |

---

### AP2497_009 — Submitting letters in Year or in Kilometers shows an error on that field and saves nothing

| Field | Value |
|---|---|
| **TC ID** | AP2497_009 |
| **Title** | Submitting letters in Year or in Kilometers shows an error on that field and saves nothing |
| **Requirement** | AP2497 — REQ-005, AC "Validation" ("Given … non-numeric … year/kilometers") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Kilometers "15k" error hidden; Year refuses letters; nothing saved. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** Kilometers is stored as text in the database (AP-2477 notes a
15-character text column), so a non-numeric value would be accepted by the database unless
the form rejects it. If the field is a number input that refuses letters as they are typed,
record that — the stored value is what is judged.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC009000000` |
| Client last name | `Warranty2497-009` |
| Year entered | `abcd` |
| Kilometers entered | `15k` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC009000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-009`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, type `abcd` in "Year" and click the form's submit control | No error page or HTTP 5xx. Either an error message is shown next to the "Year" field (record its text), or the field refused the letters as they were typed (record what it shows) |
| 4 | Reload `/quote/{id}/details`, re-open the modal, check that Year shows `2022`; then type `15k` in "Kilometers", click the submit control, record the result, reload the page and re-open the modal once more | Year shows `2022` after the first reload. On the second submit an error message is shown next to "Kilometers" (record its text), or the field refused the letter (record what it shows). The page and modal reload without an error page or HTTP 5xx |
| 5 | [Verification] Check Year and Kilometers in the modal re-opened at the end of step 4 | Year shows `2022` and Kilometers shows `15000` — no non-numeric value was saved |

---

### AP2497_010 — Submitting a negative Year or negative Kilometers shows an error on that field and saves nothing

| Field | Value |
|---|---|
| **TC ID** | AP2497_010 |
| **Title** | Submitting a negative Year or negative Kilometers shows an error on that field and saves nothing |
| **Requirement** | AP2497 — REQ-005, AC "Validation" ("Given … negative year/kilometers") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Year and Kilometers errors hidden; nothing saved. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** A negative mileage would make a used vehicle look newer than new to
the eligibility engine. The values entered differ from the stored ones, so a build that
silently drops the minus sign and saves `2020` or `500` is caught by the final check.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC010000000` |
| Client last name | `Warranty2497-010` |
| Year entered | `-2020` |
| Kilometers entered | `-500` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC010000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-010`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, type `-2020` in "Year" and click the form's submit control | No error page or HTTP 5xx. An error message is shown next to the "Year" field (record its text) |
| 4 | Reload `/quote/{id}/details`, re-open the modal, check that Year shows `2022`; then type `-500` in "Kilometers", click the submit control, record the error, reload the page and re-open the modal once more | Year shows `2022` after the first reload. On the second submit an error message is shown next to the "Kilometers" field (record its text). The page and modal reload without an error page or HTTP 5xx |
| 5 | [Verification] Check Year and Kilometers in the modal re-opened at the end of step 4 | Year shows `2022` and Kilometers shows `15000` — no negative value was saved |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 — Submit saves and refreshes in place | AP2497_006 | — | AP2497_007 | — |
| REQ-005 — Year / Kilometers validation | — | AP2497_008, AP2497_009, AP2497_010 | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2497_006 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_006-step3-AfterSubmitFormCollapsed_fail.png` |
| AP2497_007 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_007-step5-ValuesUnchangedAfterConfirm_pass.png` |
| AP2497_008 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step3-EmptyYearSubmitted_fail.png` |
| AP2497_009 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step5-NothingSavedYear2022Km15000_pass.png` |
| AP2497_010 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step5-NothingSavedYear2022Km15000_pass.png` |

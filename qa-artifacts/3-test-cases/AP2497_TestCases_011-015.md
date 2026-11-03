# Test Cases — AP2497 (File 3 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2497 — Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
**Source:** requirements/AP-2497-add-extended-warranty-capture-missing-vehicle.md · qa-artifacts/1-requirements-analysis/AP-2497_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2497_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2497_011 to AP2497_015 (5 test cases)
**Coverage:** Negative · Edge-case · Functional
**Revisions:** 2026-11-01 — AP2497_015 added by the Gate B promotion (rule B2: review finding Pass 2 #1, High). File renamed from `AP2497_TestCases_011-014.md`.

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
| **Leaves behind** | One new inventory vehicle, one client and one quote per case (AP2497_011–015). The vehicles of 012–014 may keep a boundary value the build accepted (recorded); the vehicle of 015 keeps Kilometers `15000`. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

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
| 1 | The inventory add-vehicle form and the add-extended-warranty modal are not mapped in `domain` | AP2497_011–015 | Not blocking at design — mapped by the executor on first use (see file 1) |
| 2 | The URL of the eligibility request the modal sends (needed to tell it apart in the network log) | AP2497_015 | Not blocking — read from the network log at run time and recorded |

> No case shipped BLOCKED. Executed 2026-11-02 on Dev (v2dev) — see the Execution Log table below. AP2497_012–014 are **record-only** on
> their disputed points (Q-009, Q-010): they fail only on an objective fault.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2497_011 | A valid Model change submitted together with an invalid Year is not saved either | Negative | High | FAIL |
| AP2497_012 | A future Year and zero Kilometers are handled without a server error and stored exactly as entered if accepted | Edge-case | Medium | PASS |
| AP2497_013 | A 16-digit or decimal Kilometers value is handled without a server error and never stored altered | Edge-case | Medium | PASS |
| AP2497_014 | Submitting with Make or Model emptied is handled without a server error and never stores a value nobody entered | Edge-case | Medium | PASS |
| AP2497_015 | After fixing the missing mileage, the results below the form come from a new eligibility check, not the old screen | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2497_011 — A valid Model change submitted together with an invalid Year is not saved either

| Field | Value |
|---|---|
| **TC ID** | AP2497_011 |
| **Title** | A valid Model change submitted together with an invalid Year is not saved either |
| **Requirement** | AP2497 — REQ-005, AC "Validation" ("… a field-level error is shown and **no partial update is persisted**") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Year error hidden; no partial save. See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** AP2497_008–010 change only the invalid field, so they cannot tell a
build that saves the valid fields and rejects only the bad one. This case submits a good
Model and Kilometers together with a bad Year; the criterion says none of it may be saved.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC011000000` |
| Client last name | `Warranty2497-011` |
| Model entered | `Camry` (or the second Model of the list, recorded) |
| Kilometers entered | `30000` |
| Year entered | `abcd` (if the field refuses letters as they are typed, use an empty Year instead and record it) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC011000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-011`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row; set "Model" to `Camry`, "Kilometers" to `30000` and "Year" to `abcd`, then click the form's submit control | No error page or HTTP 5xx. An error message is shown next to the "Year" field (record its text) |
| 4 | Reload `/quote/{id}/details` and click the **+** button on the "Extended warranty" row again | The quote page and the modal load without an error page or HTTP 5xx |
| 5 | [Verification] Check Year, Model and Kilometers in the re-opened modal | Year shows `2022`, Model shows `Corolla` (or the recorded creation Model) and Kilometers shows `15000` — neither the valid Model nor the valid Kilometers change was saved |

---

### AP2497_012 — A future Year and zero Kilometers are handled without a server error and stored exactly as entered if accepted

| Field | Value |
|---|---|
| **TC ID** | AP2497_012 |
| **Title** | A future Year and zero Kilometers are handled without a server error and stored exactly as entered if accepted |
| **Requirement** | AP2497 — REQ-005, AC "Validation"; limits not stated — **record-only** for Q-010 (Judgement) |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — 2030 rejected, 0 km accepted and stored (Q-010). See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** The ticket rejects empty, non-numeric and negative values but says
nothing about a Year in the future or a brand-new vehicle with 0 km. The case does not
guess whether they should be accepted; it records the build's answer for Q-010 and fails
only on an objective fault — an error page, or a stored value different from both the
entered and the original value.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC012000000` |
| Client last name | `Warranty2497-012` |
| Year entered | `2030` |
| Kilometers entered | `0` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC012000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-012`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, type `2030` in "Year" and click the form's submit control; then reload `/quote/{id}/details`, re-open the modal and record Year | No error page or HTTP 5xx. Record whether an error was shown next to "Year" (and its text) and the Year shown after the reload (Q-010) |
| 4 | In the re-opened modal type `0` in "Kilometers" (restore Year to `2022` if 2030 was saved) and click the submit control; then reload, re-open the modal and record Kilometers | No error page or HTTP 5xx. Record whether an error was shown next to "Kilometers" (and its text) and the Kilometers shown after the reload (Q-010) |
| 5 | [Verification] Compare the values recorded after each reload with what was entered | Year after step 3 is either `2030` (accepted) or `2022` (rejected) — no other value; Kilometers after step 4 is either `0` (accepted) or `15000` (rejected) — no other value, and never empty. Record which (Q-010) |

---

### AP2497_013 — A 16-digit or decimal Kilometers value is handled without a server error and never stored altered

| Field | Value |
|---|---|
| **TC ID** | AP2497_013 |
| **Title** | A 16-digit or decimal Kilometers value is handled without a server error and never stored altered |
| **Requirement** | AP2497 — REQ-005, AC "Validation"; limits not stated — **record-only** for Q-010 (Judgement) |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — 16 digits and 1500.5 rejected; 15000 kept (Q-010). See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** Error guessing. The kilometres column is a 15-character text column
(per AP-2477's capture), so a 16-digit value either has to be rejected by the form or will
fail in the database — a server error is an objective fault whatever the intended limit.
A decimal value must not be stored with its point dropped (`1500.5` becoming `15005`).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC013000000` |
| Client last name | `Warranty2497-013` |
| Kilometers entered (1) | `1234567890123456` (16 digits) |
| Kilometers entered (2) | `1500.5` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC013000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-013`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, type `1234567890123456` in "Kilometers" and click the form's submit control; then reload `/quote/{id}/details`, re-open the modal and record Kilometers | No error page or HTTP 5xx on the submit or the reload. Record whether an error was shown next to "Kilometers" (and its text) and the value shown after the reload (Q-010) |
| 4 | In the re-opened modal type `1500.5` in "Kilometers" and click the submit control; then reload, re-open the modal and record Kilometers | No error page or HTTP 5xx. Record whether an error was shown (and its text) and the value shown after the reload (Q-010) |
| 5 | [Verification] Compare the values recorded after each reload with what was entered | After step 3 Kilometers is `1234567890123456` (accepted) or `15000` (rejected) — never a cut-off number; after step 4 it is `1500.5` or a rounding of it (`1500` / `1501`, accepted) or the value before the submit (rejected) — never `15005` or any other value. Record which (Q-010) |

---

### AP2497_014 — Submitting with Make or Model emptied is handled without a server error and never stores a value nobody entered

| Field | Value |
|---|---|
| **TC ID** | AP2497_014 |
| **Title** | Submitting with Make or Model emptied is handled without a server error and never stores a value nobody entered |
| **Requirement** | AP2497 — REQ-002 ("required fields") and REQ-005; validation of Make/Model not stated — **record-only** for Q-009 (Judgement) |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Empty Brand/Model rejected; Toyota/Corolla kept (Q-009). See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** The AC calls all six fields "required" but describes validation only
for Year and Kilometers. The case records what an empty Make or Model does (Q-009). It
fails only on an objective fault: an error page, or a Make/Model stored that is neither the
original value nor empty. If Make and Model are drop-downs with no empty option, the case
records that and passes on that point.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V1 (complete), VIN `AP2497TC014000000` |
| Client last name | `Warranty2497-014` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V1 at `/vehicle/inventory` with the shared V1 values (VIN `AP2497TC014000000`) | The vehicle details page opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-014`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 3 | Click the **+** button on the "Extended warranty" row, clear "Make" (or choose its empty option, if any) and click the form's submit control; then reload `/quote/{id}/details`, re-open the modal and record Make and Model | No error page or HTTP 5xx. Record whether an error was shown next to "Make" (and its text) and the Make/Model shown after the reload (Q-009) |
| 4 | In the re-opened modal (Make back to `Toyota` if it was cleared) clear "Model" and click the submit control; then reload, re-open the modal and record Model | No error page or HTTP 5xx. Record whether an error was shown next to "Model" (and its text) and the Model shown after the reload (Q-009) |
| 5 | [Verification] Compare the Make and Model recorded after each reload with the creation values | Make is `Toyota` or empty, and Model is `Corolla` or empty (or the recorded creation values) — no other Make or Model was stored. Record which (Q-009) |

---

### AP2497_015 — After fixing the missing mileage, the results below the form come from a new eligibility check, not the old screen

| Field | Value |
|---|---|
| **TC ID** | AP2497_015 |
| **Title** | After fixing the missing mileage, the results below the form come from a new eligibility check, not the old screen |
| **Requirement** | AP2497 — REQ-004, AC "Submit persists and re-evaluates in place" ("eligibility is re-evaluated, and the results below the form refresh in the same view/modal without a full page navigation") |
| **Route** | `/quote/{id}/details` — Summary of products → Extended warranty **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Results refreshed from POST /quote/6504/warranty/edit (9 programs). See qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md |

**Why this matters:** Added by the Gate B review (Pass 2 #1). AP2497_005 proves the value is
saved and a results area is present after the submit, but it cannot tell fresh results
from the old ones left on screen — and a results area that is never refreshed is the very
dead end the ticket removes. The eligibility rules are unknown (Q-006), so this case does
not judge *which* programs appear. It judges, from the browser's network log, that a
request sent **after** the submit returned successfully and that the results area now
shows what that response contains.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | V2 (Kilometers empty), VIN `AP2497TC015000000` |
| Client last name | `Warranty2497-015` |
| Kilometers entered | `15000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and create vehicle V2 at `/vehicle/inventory` with the shared V2 values (VIN `AP2497TC015000000`, Kilometers empty) | The vehicle details page opens with no mileage value; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote**, fill the shared client values (last name `Warranty2497-015`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id and the page URL are recorded |
| 3 | Click the **+** button on the "Extended warranty" row. Record the exact text of the results area below the form (program names or notice text) and the number of entries in the browser's network log at this moment | The modal opens with the vehicle form and a results area below it, without an error page or HTTP 5xx; the before-submit results text and the network-log position are recorded |
| 4 | Type `15000` in "Kilometers" and click the form's submit control; wait until the modal stops loading | No error page or HTTP 5xx; the URL is still `/quote/{id}/details` and the modal is still open |
| 5 | [Verification] Read the network log entries after the position recorded at step 3, and the results area below the form | At least one request sent after the submit (not an image, style sheet or script) returned HTTP 2xx, and the program names or notice text in its response match what the results area now shows. Record the request URL, the after-submit results text, and whether it differs from the text recorded at step 3 (Q-006) |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-005 — Year / Kilometers validation, no partial save | — | AP2497_011 | AP2497_012, AP2497_013 (record-only, Q-010) | — |
| REQ-002 / REQ-005 — Make / Model validation | — | — | AP2497_014 (record-only, Q-009) | — |
| REQ-004 — Eligibility re-evaluated after submit | AP2497_015 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2497_011 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step5-NoPartialSave_pass.png` |
| AP2497_012 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_012-step5-Year2022Km0Stored_pass.png` |
| AP2497_013 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_013-step5-BothRejectedKm15000_pass.png` |
| AP2497_014 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_014-step5-MakeModelUnchanged_pass.png` |
| AP2497_015 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_015-step5-ResultsRefreshedFromNewCheck_pass.png` |

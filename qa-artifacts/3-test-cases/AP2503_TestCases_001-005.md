# Test Cases — AP2503 (File 1 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2503 — Generate contract for a quote's extended warranty
**Source:** requirements/AP-2503-generate-contract-for-a-quotes-extended.md · qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2503_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revised:** 2026-11-01 — s3 rework for review R2 round 1 (F-1: AP2503_005 steps 2 and 5 judge the VIN read-only; F-3: write-back note; F-4: per-run VINs, banner source)
**TC Range:** AP2503_001 to AP2503_005 (5 test cases)
**Coverage:** Functional · Regression · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory `/vehicle/inventory` (to create the case's vehicle) → `/vehicle/{vehicleId}/details` → **Create quote** → `/quote/new/client?fromVehicleId={vehicleId}` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`, the quote page. The page under test is `/quote/{id}/warranty/generate-contract` | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | On the quote page, the **Extended warranty** row carries an actions menu (a dropdown toggle); its **"Generate Contract"** item links to `/quote/{id}/warranty/generate-contract`. Before AP-2503 this opened a modal with an embedded PDF (`/quote/{id}/pdf`) and a submit button `#warranty_finalize_save`. Not in the knowledge sources — taken from the automation suite (`playwright-automation/src/pages/dealerPortal/QuoteDetailPage.ts`, `WarrantyDetailsPage.ts`). If the action is elsewhere, use it and record where (Q-011). **Write-back owed:** after execution (s4), write the action's real location, the generate-contract page and the post-submit screens back to the `domain` source (`quote-creation.md`) | automation suite (unverified — write back to `domain` after s4) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | No standing record is used. **Vehicle 915 and quote 6276 must not be used** — they are reserved for other tickets. Every vehicle, client and quote is created by the case itself, with the shared build values below | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English; switch back to the language found at the start when the run ends | `domain` (quote-creation.md) |
| **Leaves behind** | One inventory vehicle, one client and one quote per built quote (at most two in this file: quote A from AP2503_001 and quote B from AP2503_004). No case in this file submits the page, so no contract or invoice is created here. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — vehicle.** At `/vehicle/inventory` use the add-vehicle control
(label not mapped yet; record it): VIN `AP2503TC0NN{RUN_STAMP}`, where `NN` is the case number
and `RUN_STAMP` is the six-digit UTC date and hour the execution run started, `MMDDHH`
(e.g. `110114` for 1 Nov, 14:00 UTC), recorded once at the top of the execution log — so
every run uses VINs no earlier run used (17 characters; do **not** press "Décoder"/"Decode").
If the inventory still refuses the VIN as a duplicate, raise its last digit by one until it
is accepted (wrap 9 → 0) and record the VIN actually used; every later reference to "the
case's VIN" means the recorded one. Make `Toyota`, Model `Corolla`, Year
`2023`, Kilometers `12000`, Fuel type "Gasoline" (French "Essence"), Vehicle type the first
passenger-car option (record its label), Price `25000`, and for any other field the form
marks required, its first option (record each) → **Save**. If `Toyota` / `Corolla` are not
offered, take the first Make and Model and record them. Record the vehicle id from
`/vehicle/{vehicleId}/details`.

**Shared build values — client and quote.** On that vehicle's page click **Create quote**,
then: First name `Contract`, Last name as given in the case, Email
`client.stage.NNN@yopmail.com` (next unused number, recorded), Address `200 Rue Test`, City
`Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone
`5145550202`, "I agree to the policy" ticked → **Save**. On the quote page, edit the
Vehicle (`/quote/{id}/vehicle`): keep the pre-attached vehicle, Delivered at = **the run
date** (recorded as `RUN_DATE`), Price `25000` → **Save**. If a "The delivery date has
passed the acceptable timeframe" banner appears anywhere in the flow, record its text and
page and continue; it is not judged. _Source: not a knowledge source — seen on the old
warranty form / Generate Contract dialog in
`qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md` (shown even
for today's date) and reported as AP-2489, closed as not a bug. **Unverified** on the new
page._

**Shared build values — extended warranty.** On the quote page add an extended warranty
with whichever control the page offers — the **+** on the "Extended warranty" row of
"Summary of products", or "Click here to create a warranty" (`/quote/{id}/warranty/edit`):
choose the **first program** and its **first term** listed, Sale price `2500` if the form
asks for one → **Save**. Record the program, option, term and sale price used. If no
program is offered for the vehicle, record the notice text and mark the case **BLOCKED**
("no extended-warranty program for a fresh vehicle") — this is test data, not a product
fault of AP-2503.

**Known blockers** — None at design time. The inventory add-vehicle form and the quote's
"Summary of products" card are not mapped in `domain`; the executor maps them on first use
and writes them back to `quote-creation.md`. If no program is offered (see above), every
case is BLOCKED during execution.

> No case ships BLOCKED. All five are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2503_001 | Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up | Functional | High | PASS |
| AP2503_002 | The generate-contract page shows owner and financing details on the left, and summary, PDF preview and button on the right | UI | Medium | PASS |
| AP2503_003 | The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price | Functional | High | FAIL |
| AP2503_004 | The generate-contract page is pre-filled with the quote's client, vehicle and financing values | Functional | High | PASS |
| AP2503_005 | On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2503_001 — Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up

| Field | Value |
|---|---|
| **TC ID** | AP2503_001 |
| **Title** | Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up |
| **Requirement** | AP2503 — REQ-001: description "open a dedicated page (no modal)" and "The route `/quote/{quoteId}/warranty/generate-contract` … stays the same"; AC 1 "when the dealer opens `/quote/{quoteId}/warranty/generate-contract`" |
| **Route** | `/quote/{id}/details` → Extended warranty → "Generate Contract" → `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — full page at /quote/6557/warranty/generate-contract, HTTP 200, no modal — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** This is the whole point of the story: the action used to open a
modal over the quote page. If it still does, none of the new layout is reachable as
specified. The quote built here (quote A) has no financing and is reused, unsubmitted, by
AP2503_002, _003, _005 and _010.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC001{RUN_STAMP}` |
| Client last name | `Owner2503-001` |
| Extended warranty | First program, first term, Sale price `2500` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`) and create the vehicle at `/vehicle/inventory` with the shared vehicle values (VIN `AP2503TC001{RUN_STAMP}`) | `/vehicle/{vehicleId}/details` opens; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote** and build the quote with the shared client values (last name `Owner2503-001`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared extended warranty (first program, first term, Sale price `2500`) | `/quote/{id}/details` shows heading `#{id} - Contract Owner2503-001` and an "Extended warranty" entry naming the chosen program; the quote id (quote A), program and term are recorded |
| 3 | On the quote page open the Extended warranty row's actions menu and click **"Generate Contract"** | The browser navigates to `/quote/{id}/warranty/generate-contract` (the address bar changes) and a page loads without an error page or HTTP 5xx |
| 4 | Copy that address, open the quote page `/quote/{id}/details` again, then paste the address into the address bar and press Enter | The same generate-contract page loads directly from the address, without an error page or HTTP 5xx |
| 5 | [Verification] Inspect the generate-contract page | The address is exactly `/quote/{id}/warranty/generate-contract` with quote A's id; the page is a full page — no modal dialog is open and the quote page is not visible behind it; the page shows the "Program Summary" section and a "Generate Contract" button. Record where the action sat on the quote page and its label (Q-011) |

---

### AP2503_002 — The generate-contract page shows owner and financing details on the left, and summary, PDF preview and button on the right

| Field | Value |
|---|---|
| **TC ID** | AP2503_002 |
| **Title** | The generate-contract page shows owner and financing details on the left, and summary, PDF preview and button on the right |
| **Requirement** | AP2503 — REQ-002: AC 2 "it shows the “Owner information”, “Financing information” in a left column. “Program Summary”, a preview of the contract and a submit button are in the right column"; AC 1 "the quote PDF preview is shown"; description "a two-column card … Program Summary and the “Generate Contract” button on the right" |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — Owner/Financing left; Program Summary, PDF preview, button right — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** The layout is what the dealer sees. The case judges only the
sections the acceptance criterion places. Three points are open and only recorded: where
the vehicle details sit (the description says left, AC 2 does not place them — Q-001),
which document the preview shows (the criteria say both "quote PDF" and "contract" —
Q-002), and anything else that should "match Esthetic Protection" (Q-010).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2503_001, if it exists and has no contract; otherwise build one (VIN `AP2503TC002{RUN_STAMP}`, last name `Owner2503-002`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2503_001 if its quote page still offers "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC002{RUN_STAMP}`) and build a quote on it with the shared client values (last name `Owner2503-002`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` | The generate-contract page loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the left-hand part of the card at 1280 × 800 | A section headed "Owner information" and a section headed "Financing information" are both in the left column. Record every other section in the left column and where the vehicle details appear (Q-001) |
| 4 | [Verification] Inspect the right-hand part of the card | A section headed "Program Summary", an embedded PDF preview (the PDF content is visible on the page) and a button labelled "Generate Contract" are all in the right column, side by side with the left column rather than below it. Record the address of the preview document and whether it is the quote or the contract (Q-002), and any visible difference from the Esthetic protection contract page (Q-010) |

---

### AP2503_003 — The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price

| Field | Value |
|---|---|
| **TC ID** | AP2503_003 |
| **Title** | The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price |
| **Requirement** | AP2503 — REQ-003: AC 2 "The “Program Summary” shows: Vehicle delivery date · Warranty start date (editable) · Warranty sale price" |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | FAIL — step 3: Program Summary has no vehicle delivery date (F1) — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** The start date and sale price go onto the contract the client signs.
The delivery date was set on the quote by this case, so it can be compared exactly. The
start date's default (Q-004) and which amount the "sale price" is (Q-005) are not stated,
so both are recorded; the case fails only if a value is missing, lost or different from
the one entered.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2503_001, if it exists and has no contract; otherwise build one (VIN `AP2503TC003{RUN_STAMP}`, last name `Owner2503-003`) |
| Delivery date entered on the quote | `RUN_DATE` (recorded when the quote was built) |
| New start date typed | `RUN_DATE` + 7 days |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2503_001 if its quote page still offers "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC003{RUN_STAMP}`) and build a quote with the shared client values (last name `Owner2503-003`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id and delivery date are recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Read the "Program Summary" section | It shows a vehicle delivery date equal to the date entered on the quote (`RUN_DATE`, in any date format), a warranty start date and a warranty sale price (an amount). Record the start date's default value (Q-004) and whether the sale price equals the `2500` entered with the warranty, with or without tax (Q-005) |
| 4 | In the warranty start date control, change the date to `RUN_DATE` + 7 days (type it or pick it in the calendar). Do not click "Generate Contract" | The control accepts the change and now shows `RUN_DATE` + 7 days |
| 5 | [Verification] Inspect the start date control and the rest of the Program Summary | The warranty start date shows the new date; the delivery date and sale price still show the values read in step 3. Record whether the sale price is editable (Q-005). Leave the page without submitting |

---

### AP2503_004 — The generate-contract page is pre-filled with the quote's client, vehicle and financing values

| Field | Value |
|---|---|
| **TC ID** | AP2503_004 |
| **Title** | The generate-contract page is pre-filled with the quote's client, vehicle and financing values |
| **Requirement** | AP2503 — REQ-004: AC 1 "the form is pre-filled with the quote’s client and vehicle data"; AC 3 "Given the quote has a vehicle, a client or a financing … vehicle, owner and financing values are pre-filled" |
| **Route** | `/quote/{id}/financing` → `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — owner, vehicle and financing-company values pre-filled (quote 6558) — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** The pre-fill saves the dealer from retyping and keeps the contract
consistent with the quote. The ticket does not list the fields of each section, so the
case judges every field the page shows against the value this case entered, and records
which fields exist. The quote built here (quote B) is reused, unsubmitted, by AP2503_005
and then submitted by AP2503_006.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC004{RUN_STAMP}` (Toyota Corolla 2023, 12000 km, or the recorded make/model) |
| Client | First `Contract`, Last `Owner2503-004`, the shared address, city, province, postal code and phones, the recorded Yopmail email |
| Financing | Date of birth `1985-06-15`, Type "Financing" (or the first type offered, recorded), Base amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company the first company listed (recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create the vehicle with the shared vehicle values (VIN `AP2503TC004{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-004`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | `/quote/{id}/details` shows heading `#{id} - Contract Owner2503-004` and the extended warranty; the quote id (quote B) is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/financing` and enter Date of birth `1985-06-15`, Type "Financing", Base amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company the first listed → **Save** | The quote page shows a Financing entry with the base amount `25000` and term `60`; if "Add a financing" is disabled, record why and continue without financing (the financing part of step 5 is then BLOCKED) |
| 3 | Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx |
| 4 | [Verification] Read the "Owner information" section and the vehicle details | Owner fields are pre-filled: first name `Contract`, last name `Owner2503-004`, and every other owner field shown carries the value entered for the client (email, address `200 Rue Test`, city `Montréal`, province Québec, postal code `H2X 1Y4`, phones `5145550201` / `5145550202`). The vehicle details show VIN `AP2503TC004{RUN_STAMP}`, and every other vehicle value shown matches the vehicle (make, model, year `2023`, kilometers `12000`). No shown field is empty or different where the quote holds a value. Record the list of fields in each section |
| 5 | [Verification] Read the "Financing information" section | Every financing value shown matches step 2 (base amount `25000`, residual `0`, frequency "Monthly", term `60`, rate `6.99`, the recorded financing company); none is empty or different. Record the list of fields shown |

---

### AP2503_005 — On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can

| Field | Value |
|---|---|
| **TC ID** | AP2503_005 |
| **Title** | On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can |
| **Requirement** | AP2503 — REQ-004: AC 3 "vehicle identifiers and delivery date are read-only, and the warranty start date, and owner fields are editable" (the VIN is judged as a vehicle identifier under every reading of Q-003) |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | FAIL — steps 2, 5: VIN and delivery date accept typing (F2) — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** A delivery date that can be changed here would let a contract start
from a date the quote does not hold, and a VIN that can be changed would produce a contract
for the wrong vehicle. The criterion locks "vehicle identifiers" without saying which
vehicle fields those are (Q-003), but every reading Q-003 offers includes the VIN (the
Vehicle Identification Number), so the VIN's read-only state is judged; make, model, year
and kilometers stay record-only (Q-003). Nothing is submitted.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote B from AP2503_004, or quote A from AP2503_001, if it exists and has no contract; otherwise build one (VIN `AP2503TC005{RUN_STAMP}`, last name `Owner2503-005`) |
| Quote's VIN | The VIN recorded when the quote used was built (`AP2503TC004{RUN_STAMP}` for quote B, `AP2503TC001{RUN_STAMP}` for quote A, `AP2503TC005{RUN_STAMP}` if built here) |
| VIN typed | `AP2503TC099999999` |
| Owner edit | Last name → `Edited2503`, City → `Laval` |
| Start date edit | `RUN_DATE` + 7 days |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote B (AP2503_004) or quote A (AP2503_001) if its quote page still offers "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC005{RUN_STAMP}`) and build a quote with the shared client values (last name `Owner2503-005`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`). Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx; the quote id is recorded |
| 2 | Click into the vehicle delivery date and try to type a different date; also try to open a date picker on it. Then click into the vehicle's VIN and try to type `AP2503TC099999999` over it | The delivery date does not change: it is shown as text or as a disabled / read-only control, and still shows the quote's delivery date. The VIN does not change: it is shown as text or as a disabled / read-only control, and still shows the quote's VIN. If the VIN accepts the typing, the step FAILs (AC 3 "vehicle identifiers … are read-only") — record the value it shows |
| 3 | In "Owner information", change Last name to `Edited2503` and City to `Laval` | Both fields accept the typing and show `Edited2503` and `Laval` |
| 4 | In "Program Summary", change the warranty start date to `RUN_DATE` + 7 days | The start date control accepts the change and shows the new date |
| 5 | [Verification] Inspect the page without clicking "Generate Contract" | The delivery date still shows the quote's delivery date and cannot be edited; the VIN still shows the quote's VIN and cannot be edited (FAIL if it shows any other value or is an editable control); Last name shows `Edited2503`, City `Laval`, and the start date `RUN_DATE` + 7 days. For each other vehicle field shown (make, model, year, kilometers) record whether it is editable — record-only (Q-003). Leave the page without submitting; record whether the quote's client still reads `Owner2503-…` afterwards |

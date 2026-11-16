# Test Cases — AP2503 (File 1 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2503 — Generate contract for a quote's extended warranty
**Source:** requirements/AP-2503-generate-contract-for-a-quotes-extended.md · qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md (updated 2026-11-15) · qa-artifacts/2-test-plan/AP-2503_test-plan.md (version 2.0)
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revised:** 2026-11-15 — re-designed with the QA's answer to Q-001 – Q-011 (record-only steps now judged; record-and-accept steps added); bugs AP-2530 and AP-2531 kept open, so AP2503_003 and AP2503_005 keep their failing expected results. Earlier: 2026-11-01 — s3 rework for review R2 round 1
**TC Range:** AP2503_001 to AP2503_005 (5 test cases)
**Coverage:** Functional · Regression · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory `/vehicle/inventory` → add a passenger vehicle at `/vehicle/new/edit/PASSENGER` → `/vehicle/{vehicleId}/details` → **Create quote** → `/quote/new/client?fromVehicleId={vehicleId}` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`, the quote page. The page under test is `/quote/{id}/warranty/generate-contract` | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | Quote page → "Summary of products" → **Extended warranty** row → **⋯** dropdown: **Edit** · **Generate Contract** (`/quote/{id}/warranty/generate-contract`) · **Delete**. Once a contract exists, the ⋯ is replaced by the contract number link (`/warranty/{contractId}`) and a PDF icon | `domain` (quote-creation.md, Dev section mapped 2026-11-02) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | **Dev (v2dev)** — `DEALER_PORTAL_URL` of the `env` source, Dev Environment section (`execution_env` = Dev) | `env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | No standing record is used. **Vehicle 915 and quote 6276 must not be used** — they are reserved for other tickets. The records of the 2026-11-02 run (vehicles 1125–1129, quotes 6557–6561) are not reused. Every vehicle, client and quote is created by the case itself, with the shared build values below | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One inventory vehicle, one client and one quote per built quote — two in this file when the reuse works (quote A from AP2503_001, quote B from AP2503_004), up to five if a case must build its own. **No case in this file submits the page, so no contract or invoice is created here.** The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — vehicle.** At `/vehicle/inventory` add a passenger vehicle
(`/vehicle/new/edit/PASSENGER`): VIN `AP2503TC0NN{RUN_STAMP}`, where `NN` is the case
number and `RUN_STAMP` is the six-digit UTC date and hour the execution run started,
`MMDDHH` (e.g. `111509` for 15 Nov, 09:00 UTC), recorded once at the top of the execution
log — so every run uses VINs no earlier run used (17 characters; do **not** press
"Décoder"/"Decode"). If the inventory refuses the VIN as a duplicate, raise its last digit
by one until it is accepted (wrap 9 → 0) and record the VIN used; every later reference to
"the case's VIN" means the recorded one. Make `Toyota`, Model `Corolla`, Year `2023`,
Kilometers `12000`, Vehicle Price `25000`, Condition new, Fuel type "Gasoline",
Transmission "Automatic", Cylinders `4`, Engine size `1.8` (both required on Dev, no
default), and for any other field the form marks required, its first option (record each)
→ **Save**. Record the vehicle id from `/vehicle/{vehicleId}/details`.

**Shared build values — client and quote.** On that vehicle's page click **Create quote**,
then: First name `Contract`, Last name as given in the case, Email
`client.stage.2503NNN.{RUN_STAMP}@yopmail.com` (`NNN` = the case number, recorded), Address
`200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone
`5145550201`, Work phone `5145550202`, "I agree to the policy" ticked → **Save**. On the
quote page, edit the Vehicle (`/quote/{id}/vehicle`): keep the pre-attached vehicle,
Delivered at = **the run date** (recorded as `RUN_DATE`; Dev may pre-fill the day before —
type the run date), Price `25000` → **Save**. A red alert "The delivery date has passed the
acceptable timeframe…" shows on every generate-contract page on Dev, even for today's
date; record it and continue — it is not judged (AP-2489).

**Shared build values — extended warranty.** On the quote page add an extended warranty
with the **+** on the "Extended warranty" row of "Summary of products" (or "Click here to
create a warranty", `/quote/{id}/warranty/edit`): choose the **first program** and its
**first term** listed (on Dev 2026-11-02: "Garantie de base AP" → option 1 → 100m/20000km),
Sale price `2500` → **Save**. Record the program, option, term, sale price and the **Cost**
the expanded row shows (CA$456.00 on 2026-11-02). If no program is offered for the
vehicle, record the notice text and mark the case **BLOCKED** ("no extended-warranty
program for a fresh vehicle") — this is test data, not a product fault of AP-2503.

**Known blockers** — None at design time.

**Open bugs this file still expects to fail on** — the QA kept them open and valid
(2026-11-15); the acceptance criterion wins over the current behaviour:

| Bug | Case · step | What the step expects (AC text) |
|---|---|---|
| AP-2530 | AP2503_003 step 3 | The Program Summary shows the vehicle delivery date (AC 2) |
| AP-2531 | AP2503_005 steps 2 and 5 | The VIN and the delivery date are read-only (AC 3) |

> No case ships BLOCKED. Executed 2026-11-15 on Dev (v2dev) — results in each header and in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-15.md`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2503_001 | Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up | Functional | High | PASS |
| AP2503_002 | The generate-contract page shows vehicle, owner and financing details on the left, and summary, contract preview and button on the right | UI | Medium | FAIL |
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
| **Requirement** | AP2503 — REQ-001: description "open a dedicated page (no modal)" and "The route `/quote/{quoteId}/warranty/generate-contract` … stays the same"; AC 1 "when the dealer opens `/quote/{quoteId}/warranty/generate-contract`". Q-011 Answered 2026-11-15 ("all current behavior actual result is correct as expected"): the action is the "Generate Contract" item between Edit and Delete in the ⋯ menu of the Extended warranty row |
| **Route** | `/quote/{id}/details` → Extended warranty ⋯ → "Generate Contract" → `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | PASS — full page, HTTP 200, no modal; summary headed "Product Summary" (previous run 2026-11-02, Dev: PASS) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 3 judges the menu items Edit · Generate Contract · Delete; step 5 no longer records the action's location; environment Dev | Q-011 Answered | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** This is the whole point of the story: the action used to open a
modal over the quote page. If it still does, none of the new layout is reachable as
specified. The quote built here (quote A) has no financing and is reused, unsubmitted, by
AP2503_002, _003 and _010.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC001{RUN_STAMP}` |
| Client last name | `Owner2503-001` |
| Extended warranty | First program, first term, Sale price `2500` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`) and create the vehicle with the shared vehicle values (VIN `AP2503TC001{RUN_STAMP}`) | `/vehicle/{vehicleId}/details` opens with the flash "Vehicle saved"; the vehicle id is recorded |
| 2 | [Pre-Condition] Click **Create quote** and build the quote with the shared client values (last name `Owner2503-001`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared extended warranty (first program, first term, Sale price `2500`) | `/quote/{id}/details` shows the heading `#{id} - Contract Owner2503-001` and an "Extended warranty" row; the quote id (quote A), program, term and cost are recorded |
| 3 | In "Summary of products", open the **⋯** menu on the Extended warranty row and click **"Generate Contract"** | The menu lists Edit, Generate Contract and Delete, in that order. After the click the address bar changes to `/quote/{id}/warranty/generate-contract` and a page headed "Extended Warranty Contract" loads, without an error page or HTTP 5xx |
| 4 | Open the quote page `/quote/{id}/details` again, then type `/quote/{id}/warranty/generate-contract` into the address bar and press Enter | The same "Extended Warranty Contract" page loads directly from the address (HTTP 200), without an error page |
| 5 | [Verification] Inspect the generate-contract page | The address is exactly `/quote/{id}/warranty/generate-contract` with quote A's id; the page is a full page — no modal dialog is open and the quote page is not visible behind it; a "Back" link leads to `/quote/{id}/details`; the page shows the "Program Summary" section and a "Generate Contract" button |

---

### AP2503_002 — The generate-contract page shows vehicle, owner and financing details on the left, and summary, contract preview and button on the right

| Field | Value |
|---|---|
| **TC ID** | AP2503_002 |
| **Title** | The generate-contract page shows vehicle, owner and financing details on the left, and summary, contract preview and button on the right |
| **Requirement** | AP2503 — REQ-002: AC 2 "it shows the “Owner information”, “Financing information” in a left column. “Program Summary”, a preview of the contract and a submit button are in the right column"; description "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right". Answered 2026-11-15 ("all current behavior actual result is correct as expected"): Q-001 — "Vehicle identification" is its own section, first in the left column; Q-002 — one embedded preview of the extended-warranty contract draft (`/quote/{id}/warranty/pdf`) with an "Open PDF in new tab" link, not the quote PDF; Q-010 — the recorded layout is expected, unrecorded styling and labels are record-and-accept |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | FAIL at step 4 — no contract preview and no 'Open PDF in new tab' link in the right column (AC 1, AC 2) (new, F4). Step 3 PASS — superseded by AP-2559: quote 6703 has no GAP/Creditor insurance, so no Financing information card is expected; the vehicle and owner cards are in the left column (re-judged at R3 round 1, 2026-11-15, no re-run) (previous run 2026-11-02, Dev: PASS) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Title names the vehicle section and the contract preview; step 3 judges the left-column order; step 4 judges the right-column order and the preview document; step 4 records the labels and styling and accepts them (record-and-accept) | Q-001, Q-002, Q-010 Answered | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |
| 2026-11-15 | Result only (steps unchanged): step 3's missing "Financing information" card on quote 6703 judged PASS under delivered Story AP-2559; the case stays FAIL at step 4 (F4). Redesign against AP-2559/AP-2545 is pending a later s3 pass | R3 round 1 finding F-1; batch decision 2 (a delivered later Story that redesigns the page supersedes the older AC) | qa-reviewer R3 round 1, 2026-11-15 (qa-artifacts/7-reviews/AP-2503_review.md) |

**Why this matters:** The layout is what the dealer sees. The answers fix the order of
the sections and which document the preview shows, so both are judged. Labels and card
styling were never compared on 2026-11-02; they are recorded and accepted.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2503_001, if it exists and has no contract; otherwise build one (VIN `AP2503TC002{RUN_STAMP}`, last name `Owner2503-002`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2503_001 if its Extended warranty row still has the ⋯ menu with "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC002{RUN_STAMP}`) and build a quote on it with the shared client values (last name `Owner2503-002`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty and no contract exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` | The "Extended Warranty Contract" page loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the left-hand part of the card at 1280 × 800 | The left column holds three sections, top to bottom: "Vehicle identification" (VIN, Mileage, Year, Make, Model, Delivery date, Cylinders, Engine size, transmission, condition, Diesel / Turbo / 4x4 / FWD), then "Owner information", then "Financing information" |
| 4 | [Verification] Inspect the right-hand part of the card, then read the labels and styling of the whole card | The right column sits beside the left one (not below it) and holds, top to bottom: "Program Summary", the "Generate Contract" button, an "Open PDF in new tab" link to `/quote/{id}/warranty/pdf`, and an embedded PDF preview of that address whose content is visible — the extended-warranty contract draft ("WARRANTY PROGRAM", "# CONTRAT: incomplete", "example" watermark), not the quote PDF. **Record-and-accept (Q-010):** record each section heading and field label as shown, and the card styling (card border or shadow, column widths, heading sizes); whatever is shown is accepted unless a label is missing, empty or shows a raw translation key |

---

### AP2503_003 — The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price

| Field | Value |
|---|---|
| **TC ID** | AP2503_003 |
| **Title** | The Program Summary shows the quote's delivery date, an editable warranty start date and a warranty sale price |
| **Requirement** | AP2503 — REQ-003: AC 2 "The “Program Summary” shows: Vehicle delivery date · Warranty start date (editable) · Warranty sale price". Answered 2026-11-15 ("all current behavior actual result is correct as expected"): Q-004 — the start date defaults to the delivery date and the End date on screen is not recalculated; Q-005 — the sale price is the one entered with the quote's warranty, without tax, in an editable field. **AC 2 still wins for the delivery date in the Program Summary — bug AP-2530 is open** |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | FAIL at step 3 — no delivery date in the Product Summary (AP-2530) (previous run 2026-11-02, Dev: FAIL at step 3 → AP-2530) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 3 judges the start date default and the sale price; step 5 judges the editable sale price and the End date left as it was. **Step 3's delivery-date expectation is unchanged** | Q-004, Q-005 Answered; AP-2530 kept open — AC 2 wins | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** The start date and sale price go onto the contract the client signs.
The delivery date was set on the quote by this case, so it can be compared exactly. On
Dev the Program Summary has no delivery date (AP-2530, open): until that bug is fixed this
case FAILs at step 3, and that FAIL is linked to AP-2530, not filed again.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2503_001, if it exists and has no contract; otherwise build one (VIN `AP2503TC003{RUN_STAMP}`, last name `Owner2503-003`) |
| Delivery date entered on the quote | `RUN_DATE` (recorded when the quote was built) |
| Sale price entered with the warranty | `2500` |
| New start date typed | `RUN_DATE` + 7 days |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2503_001 if its Extended warranty row still has the ⋯ menu with "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC003{RUN_STAMP}`) and build a quote with the shared client values (last name `Owner2503-003`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty and no contract exists; its id and delivery date are recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Read the "Program Summary" section | It shows a **vehicle delivery date** equal to the date entered on the quote (`RUN_DATE`, in any date format) — AC 2; if it is absent from the Program Summary (shown only in the left column), the step FAILs (AP-2530). It also shows the warranty start date with the default value `RUN_DATE` (the delivery date) and the sale price `2500` — the amount entered with the warranty, without tax |
| 4 | In the warranty start date control, change the date to `RUN_DATE` + 7 days (type it or pick it in the calendar). Do not click "Generate Contract" | The control accepts the change and now shows `RUN_DATE` + 7 days |
| 5 | [Verification] Inspect the start date, the sale price and the rest of the Program Summary | The start date shows `RUN_DATE` + 7 days; the delivery date (wherever shown) still shows `RUN_DATE`; the sale price still shows `2500` and is an editable text field (it accepts the cursor; do not change it); the End date still shows the value read in step 3 (it is not recalculated on screen). Leave the page without submitting |

---

### AP2503_004 — The generate-contract page is pre-filled with the quote's client, vehicle and financing values

| Field | Value |
|---|---|
| **TC ID** | AP2503_004 |
| **Title** | The generate-contract page is pre-filled with the quote's client, vehicle and financing values |
| **Requirement** | AP2503 — REQ-004: AC 1 "the form is pre-filled with the quote’s client and vehicle data"; AC 3 "Given the quote has a vehicle, a client or a financing … vehicle, owner and financing values are pre-filled". Q-001 Answered 2026-11-15: the vehicle values sit in "Vehicle identification" |
| **Route** | `/quote/{id}/financing` → `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | PASS — owner, vehicle and financing values pre-filled (quote 6704) (previous run 2026-11-02, Dev: PASS) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 4 names the "Vehicle identification" section and the Cylinders / Engine size values; step 5 judges the financing-company values the section shows; environment Dev | Q-001 Answered; the 2026-11-02 run showed the section holds the company only | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** The pre-fill saves the dealer from retyping and keeps the contract
consistent with the quote. The case judges every field the page shows against the value
this case entered. The quote built here (quote B) is reused, unsubmitted, by AP2503_005
and then submitted by AP2503_006.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC004{RUN_STAMP}` (Toyota Corolla 2023, 12000 km, Cylinders 4, Engine size 1.8) |
| Client | First `Contract`, Last `Owner2503-004`, the shared address, city, province, postal code and phones, email `client.stage.2503004.{RUN_STAMP}@yopmail.com` |
| Financing | Date of birth `1985-06-15`, Type "Financing", Base amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company the first company listed (recorded — AutoCapital Canada on 2026-11-02) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create the vehicle with the shared vehicle values (VIN `AP2503TC004{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-004`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | `/quote/{id}/details` shows heading `#{id} - Contract Owner2503-004` and the extended warranty; the quote id (quote B) is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/financing` and enter Date of birth `1985-06-15`, Type "Financing", Base amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company the first listed → **Save** | Flash "Financing saved"; the quote page shows a Financing entry with the financed amount 25,000.00$, term 60 and the chosen company; the company name is recorded |
| 3 | Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx |
| 4 | [Verification] Read "Owner information" and "Vehicle identification" | Owner fields are pre-filled: first name `Contract`, last name `Owner2503-004`, address `200 Rue Test`, city `Montréal`, province Québec, postal code `H2X 1Y4`, email as entered, home phone `5145550201`, work phone `5145550202`; fields the client has no value for are empty. Vehicle identification: VIN `AP2503TC004{RUN_STAMP}`, Mileage `12000`, Year `2023`, Make `Toyota`, Model `Corolla`, Delivery date `RUN_DATE`, Cylinders `4`, Engine size `1.8`, transmission Automatic, condition new. No shown field is empty or different where the quote holds a value |
| 5 | [Verification] Read "Financing information" | The company fields carry the financing company chosen in step 2: its name and its address, city, province and postal code as stored for that company (on 2026-11-02 AutoCapital Canada: "200-11, Church Street", Toronto, Ontario, M5E 1W1). A phone left empty is correct only when the company record has no phone (record it). No financing-company field is empty or different where the company holds a value |

---

### AP2503_005 — On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can

| Field | Value |
|---|---|
| **TC ID** | AP2503_005 |
| **Title** | On the generate-contract page the VIN and the delivery date cannot be changed, while owner fields and start date can |
| **Requirement** | AP2503 — REQ-004: AC 3 "vehicle identifiers and delivery date are read-only, and the warranty start date, and owner fields are editable". Q-003 Answered 2026-11-15 ("all current behavior actual result is correct as expected"): **the VIN and the delivery date stay read-only — AC 3 wins, bug AP-2531 is open**; Make, Model, Year and Mileage editable is expected; the other vehicle fields are record-and-accept. Q-009 Answered: unsubmitted edits do not reach the quote |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | FAIL at steps 2 and 5 — VIN editable (AP-2531, VIN only; delivery date now read-only) (previous run 2026-11-02, Dev: FAIL at steps 2 and 5 → AP-2531) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 5 judges Make, Model, Year and Mileage editable, records and accepts the editability of Cylinders, Engine size, transmission, condition and Diesel / Turbo / 4x4 / FWD, and judges the quote unchanged after leaving. **The VIN and delivery-date expectations of steps 2 and 5 are unchanged** | Q-003, Q-009 Answered; AP-2531 kept open — AC 3 wins | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** A delivery date that can be changed here would let a contract start
from a date the quote does not hold, and a VIN that can be changed would produce a contract
for the wrong vehicle. On Dev both accept typing (AP-2531, open): until that bug is fixed
this case FAILs at steps 2 and 5, and the FAIL is linked to AP-2531. Nothing is submitted.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote B from AP2503_004, or quote A from AP2503_001, if it exists and has no contract; otherwise build one (VIN `AP2503TC005{RUN_STAMP}`, last name `Owner2503-005`) |
| Quote's VIN | The VIN recorded when the quote used was built |
| VIN typed | `AP2503TC099999999` |
| Owner edit | Last name → `Edited2503`, City → `Laval` |
| Start date edit | `RUN_DATE` + 7 days |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote B (AP2503_004) or quote A (AP2503_001) if its Extended warranty row still has the ⋯ menu with "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC005{RUN_STAMP}`) and build a quote with the shared client values (last name `Owner2503-005`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`). Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx; the quote id and its VIN are recorded |
| 2 | Click into the vehicle delivery date and try to type a different date; also try to open a date picker on it. Then click into the vehicle's VIN and try to type `AP2503TC099999999` over it | The delivery date does not change: it is shown as text or as a disabled / read-only control, and still shows the quote's delivery date. The VIN does not change: it is shown as text or as a disabled / read-only control, and still shows the quote's VIN. If either accepts the typing, the step FAILs (AC 3 "vehicle identifiers and delivery date are read-only"; AP-2531) — record the value it shows |
| 3 | In "Owner information", change Last name to `Edited2503` and City to `Laval` | Both fields accept the typing and show `Edited2503` and `Laval` |
| 4 | In "Program Summary", change the warranty start date to `RUN_DATE` + 7 days | The start date control accepts the change and shows the new date |
| 5 | [Verification] Inspect the page without clicking "Generate Contract", then leave it and open `/quote/{id}/details` | The delivery date still shows the quote's delivery date and cannot be edited; the VIN still shows the quote's VIN and cannot be edited (FAIL if either shows another value or is an editable control — AP-2531). Last name shows `Edited2503`, City `Laval`, start date `RUN_DATE` + 7 days. Make, Model, Year and Mileage are editable text fields (Q-003). **Record-and-accept (Q-003):** record whether Cylinders, Engine size, transmission, condition and the Diesel / Turbo / 4x4 / FWD boxes are editable — accepted either way. After leaving, the quote page heading still reads `Contract Owner2503-…` with the quote's VIN (Q-009) |

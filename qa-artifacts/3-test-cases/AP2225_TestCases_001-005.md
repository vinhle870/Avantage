# Test Cases — AP2225 (File 1 of 4)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2225 — Dealer Area: AutoShield create contract
**Source:** requirements/AP-2225-dealer-area-autoshield-create-contract.md · qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2225_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2225_001 to AP2225_005 (5 test cases)
**Coverage:** Functional · UI · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → header action **Create quote** → `/quote/new/client?fromVehicleId=915` (client form) → **Save** → `/quote/{id}/details` (the quote hub). From the hub: Edit (Vehicle) → `/quote/{id}/vehicle`; **Add a financing** → `/quote/{id}/financing`; **Road Side Protection** → `/quote/{id}/road-side-protection` (heading "Road Side protection program"). **Never** start a quote at `/quote/new/client` without `fromVehicleId` — the hub then returns HTTP 500. | `navigation` → `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — `vinhle870@gmail.com` at `/login`, password as recorded in the `env` source. After login the dashboard reads "Hi {user} Welcome to Test QA staging's account" (dealer 1380). | `env`, `navigation` |
| **Test data** | Vehicle **915**, VIN `1FAHP35NX8W239204`, Ford Focus 2008, mileage **5000 km**. Its Stock Number, Condition and its own sale price are **not recorded** in `test-data`; they are read from `/vehicle/915/details` in the case that needs them. | `test-data` |
| **Language** | EN by default. Append `?_locale=fr` to a dealer URL to switch the session to French and `?_locale=en` to switch back; always switch back before the case ends. | `domain` (quote-creation.md) |
| **Leaves behind** | Two quotes per run (Quote A and Quote B, below) and their autoShield quotes. Cases in file 2 also create AutoShield contracts in AutoShield's test system, which cannot be deleted from the portal. The execution log lists every quote ID and contract ID. | `cleanup` (missing) |

**Quote A — the full quote** (dynamic, created once per run and shared by the cases that
only read it). Step 1 of each case that needs it says: *use Quote A created earlier in this
run if it exists; otherwise create it as follows.* Values:

1. Client form (`/vehicle/915/details` → **Create quote**): First name `QA`, Last name `AP2225-A-<HHMMSS>` (24-hour time now), Email `client.stage.NNN@yopmail.com` (next unused number), Address `100 rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550101`, Tel. work `5145550102`, tick the policy agreement box → **Save**. The hub `/quote/{id}/details` opens with a Vehicle card for `1FAHP35NX8W239204`.
2. Vehicle step `/quote/{id}/vehicle`: vehicle `1FAHP35NX8W239204` (already selected), Delivery date `2026-10-15`, Price `18500` → **Save**.
3. Financing `/quote/{id}/financing`: applicant date of birth `1985-06-15`, Type "Financing", base amount `15000`, residual amount `0`, payment frequency "Monthly", term `60`, interest rate `6.99`, financing company = the first company in the list (write its name in the execution log) → **Save**.

**Quote B — the bare quote** (dynamic, used only by AP2225_004 and AP2225_012): same client
form with Last name `AP2225-B-<HHMMSS>` and a new email number; vehicle step with Price
`18500` and **no** Delivery date; **no financing**.

**Save button rule (REQ-004).** The `domain` page map (quote-creation.md) records only one
button on `/quote/{id}/road-side-protection`: **Save and Generate Contract**. Every step in
this file that says "click Save" means a button labelled exactly "Save". If no such button
exists, **do not click "Save and Generate Contract"** — it creates a real AutoShield contract
that cannot be deleted. Record that step **FAIL** with the button labels seen ("REQ-004: no
Save button") and mark the remaining steps of the case **BLOCKED** by that failure.

**Build check.** Before AP2225_001, open the Road side protection page of Quote A. If it shows
no AutoShield products, or an error page, AutoShield is not reachable from staging: stop and
record every case **BLOCKED — AutoShield unreachable**, not FAIL.

**Known blockers:** None at design time. No open question is Blocking. Judgement questions
Q-001 (client fields), Q-002 (Purchase Type), Q-003 (does Generate save first), Q-004
(validation), Q-005 (failure message), Q-007 (no financing), Q-008 (labels and formats) and
Q-009 (PDF open or download) change only how a step is judged; each affected step says
"Record the outcome for Q-00N" and fails only on an objective fault.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2225_001 | The Road side protection page of a new quote lists AutoShield products, each with a price | Functional | High | PASS |
| AP2225_002 | The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data | Functional | High | FAIL |
| AP2225_003 | The client fields on the Road side protection page show the quote's client details | Functional | High | FAIL |
| AP2225_004 | On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price | Edge-case | Medium | BLOCKED |
| AP2225_005 | A prefilled value the dealer overrides is kept after Save and a page reload | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2225_001 — The Road side protection page of a new quote lists AutoShield products, each with a price

| Field | Value |
|---|---|
| **TC ID** | AP2225_001 |
| **Title** | The Road side protection page of a new quote lists AutoShield products, each with a price |
| **Requirement** | AP2225 — REQ-001 (Then: "The autoShield-quote is created … with a list of products available and it's pricing") |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | PASS — five AutoShield options with prices |

**Why this matters:** This page is the entry point to the whole feature. If no product or price appears, the dealer cannot choose a coverage and no contract can be generated. The prices come from AutoShield, so this case checks that they are shown, not that the amounts are right.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A (see Execution Context) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal at `/login`. Use Quote A if it exists in this run; otherwise create it: `/vehicle/915/details` → **Create quote** → client form with the Quote A values → **Save**; `/quote/{id}/vehicle` Delivery date `2026-10-15`, Price `18500` → **Save**; `/quote/{id}/financing` with the Quote A values → **Save** | The hub `/quote/{id}/details` shows the client "QA AP2225-A-…", the vehicle `1FAHP35NX8W239204` and a Financing section; write the quote ID in the log |
| 2 | On the hub, click "Road Side Protection" | The browser opens `/quote/{id}/road-side-protection` with the heading "Road Side protection program" and no error page or error message |
| 3 | [Verification] Verify the page lists AutoShield products, and that every listed product or tier option shows a price. Write each product / tier / term / price seen into the log | At least one product is listed, and each listed option shows a price in dollars. Record the products and tiers shown for Q-008 |

---

### AP2225_002 — The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data

| Field | Value |
|---|---|
| **TC ID** | AP2225_002 |
| **Title** | The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data |
| **Requirement** | AP2225 — REQ-002 (AC 1 "prepopulated with the quote data"; AC 2, the default mapping stated by Ken Nguyen on 2025-04-14) |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — step 4: 10 of 11 vehicle fields absent on Dev |

**Why this matters:** These values are sent to AutoShield and printed on the contract. A wrong default — a wrong VIN or sale price — produces a wrong contract unless the dealer notices.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A — delivery date `2026-10-15`, price `18500`, financing base amount `15000` (the financed amount itself is read from the quote's Financing section, not assumed), interest rate `6.99` |
| Vehicle 915 | VIN `1FAHP35NX8W239204`, mileage `5000` km; Stock Number, Condition and the vehicle's own sale price read in step 1 (not recorded in `test-data`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Open `/vehicle/915/details` and write its Stock Number, Condition and the sale price it shows (with its label) in the log; if the page shows no sale price, write "none shown" | The Vehicle Details page shows VIN `1FAHP35NX8W239204`; stock number, condition and vehicle sale price (or "none shown") are recorded |
| 2 | [Pre-Condition] Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context. On its hub `/quote/{id}/details`, write in the log the financing company and every amount the Financing section shows, with its label | Quote A's hub loads with vehicle, client and financing; the Financing section's company and amounts are recorded |
| 3 | Open `/quote/{id}/road-side-protection` for Quote A without changing anything | The page loads with the form; no error message |
| 4 | [Verification] Verify the vehicle fields show: VIN `1FAHP35NX8W239204`; Stock Number = value from step 1; Condition = value from step 1; Odometer Reading `5000`; In Service Date `2026-10-15`; Purchase Date `2026-10-15`; Delivery Date `2026-10-15`; Classification Date empty; Interest Rate `6.99`; Sale Price (CAD) `18500`; Financing Company = the company from step 2. Record the value shown in Purchase Price, Purchase Type and Financed Amount | Each listed field shows exactly the value given (date format may differ, the date must not). A listed field that is missing, or that shows a different value, is a FAIL. Purchase Price must equal either the vehicle sale price recorded in step 1 or the quote price `18500` (the reporter's "Vehicle's sale price" is not equated with the quote price by any ticket sentence); log which one it matched. Empty, `0`, or a value matching neither is a FAIL. Purchase Type is not judged: record the outcome for Q-002. Financed Amount must equal one of the amounts recorded from the Financing section in step 2 (the ticket says "Financing amount" without naming which); a value that matches none of them, or `0`, or empty, is a FAIL — record which amount it matched |

---

### AP2225_003 — The client fields on the Road side protection page show the quote's client details

| Field | Value |
|---|---|
| **TC ID** | AP2225_003 |
| **Title** | The client fields on the Road side protection page show the quote's client details |
| **Requirement** | AP2225 — REQ-002 (AC 1 "a list of fields for Vehicle and Client info that is prepopulated with the quote data") |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — no client fields on the page |

**Why this matters:** The ticket says client info is prefilled but does not list which client fields exist (Q-001). This case proves that whatever client fields are shown carry the quote's client and nobody else's.

**Test Data:**

| Variable | Value |
|---|---|
| Client of Quote A | First name `QA`, Last name `AP2225-A-<HHMMSS>`, email `client.stage.NNN@yopmail.com`, address `100 rue Test`, city `Montréal`, province Québec, postal code `H2X 1Y4`, phones `5145550101` / `5145550102` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context | Quote A's hub shows client "QA AP2225-A-…" |
| 2 | Open `/quote/{id}/road-side-protection` for Quote A | The page loads with a client section or client fields; no error message |
| 3 | [Verification] Compare every client field shown with the client values in Test Data, and write the list of client field labels in the log | At least one client field is shown. Every client field that corresponds to a quote client value shows that value exactly; a client field showing a different or foreign value is a FAIL. Which client fields exist is not judged: record the outcome for Q-001 |

---

### AP2225_004 — On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price

| Field | Value |
|---|---|
| **TC ID** | AP2225_004 |
| **Title** | On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price |
| **Requirement** | AP2225 — REQ-002 AC 2 ("In Service Date — Delivery date or today if empty"; "Purchase Date — Delivery date or today if empty"; "Financed Amount — Financing amount or Vehicle sale price if empty") |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | BLOCKED — test data not on dev: a quote with no delivery date (vehicle step requires one) |

**Why this matters:** The reporter wrote these fallbacks explicitly. A quote that has not reached the sale stage has no delivery date and often no financing, so an empty or zero default here would send an incomplete contract to AutoShield.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote B — price `18500`, no delivery date, no financing |
| Vehicle 915 sale price | Read from `/vehicle/915/details` in step 1 (not recorded in `test-data`) |
| Today | The run date, e.g. `2026-11-01` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Open `/vehicle/915/details` and write the sale price it shows (with its label) in the log, or "none shown". Use Quote B if it exists in this run; otherwise create it: `/vehicle/915/details` → **Create quote** → client form with First name `QA`, Last name `AP2225-B-<HHMMSS>`, a new `client.stage.NNN@yopmail.com`, the other Quote A client values → **Save**; `/quote/{id}/vehicle` Price `18500`, Delivery date left empty → **Save**. Do not add a financing | The vehicle sale price (or "none shown") is recorded; Quote B's hub shows the vehicle `1FAHP35NX8W239204` and no financing |
| 2 | Click "Road Side Protection" on Quote B's hub | `/quote/{id}/road-side-protection` loads with the form and no error page |
| 3 | [Verification] Verify In Service Date and Purchase Date both show today's date, Delivery Date is empty, and read Financed Amount | In Service Date = today, Purchase Date = today, Delivery Date is empty. Financed Amount equals either the vehicle sale price recorded in step 1 or the quote price `18500`; log which one it matched. Any other date, a non-empty Delivery Date, an empty In Service / Purchase Date, or a Financed Amount that is empty, `0` or matches neither is a FAIL |

---

### AP2225_005 — A prefilled value the dealer overrides is kept after Save and a page reload

| Field | Value |
|---|---|
| **TC ID** | AP2225_005 |
| **Title** | A prefilled value the dealer overrides is kept after Save and a page reload |
| **Requirement** | AP2225 — REQ-002 AC 3 ("These are the default values that can be overridden by the user"); REQ-004 ("When the user clicks on the 'Save' button … data is saved in the autoShield quote") |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — step 1: no Odometer Reading field; steps 2–5 BLOCKED |

**Why this matters:** A dealer who corrects a default and saves expects to find the correction when coming back. If Save does not keep it, the contract goes out with the old value.

**Test Data:**

| Variable | Value |
|---|---|
| Odometer Reading override | `5123` (default is `5000`) |
| Stock Number override | `QA2225-<HHMMSS>` |
| Tier | The first tier / product option on the page |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context. Open its `/quote/{id}/road-side-protection` page | The page loads with Odometer Reading `5000` |
| 2 | Select the first tier / product option. Replace Odometer Reading with `5123` and Stock Number with `QA2225-<HHMMSS>` | The fields show the new values and the option is selected |
| 3 | Click the button labelled exactly "Save". If there is none, do not click "Save and Generate Contract": record this step FAIL with the button labels seen (REQ-004: no Save button) and mark steps 4–5 BLOCKED | The page confirms the save (record the exact message) or reloads without an error message; no error page |
| 4 | Reload `/quote/{id}/road-side-protection` | The page loads again with the form |
| 5 | [Verification] Verify Odometer Reading shows `5123`, Stock Number shows `QA2225-<HHMMSS>` and the chosen option is still selected | All three values are kept. A value back at its default, or empty, is a FAIL |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — products and pricing | AP2225_001 | — | — | — |
| REQ-002 AC 1–2 — vehicle defaults | AP2225_002 | — | AP2225_004 | — |
| REQ-002 AC 1 — client defaults | AP2225_003 | — | — | — |
| REQ-002 AC 3 / REQ-004 — override and Save | AP2225_005 | AP2225_008 (file 2) | — | AP2225_006 (file 2) |
| REQ-003 — button label | AP2225_007 (file 2) | — | — | — |
| REQ-005 / REQ-006 — contract creation and page | AP2225_009, AP2225_010, AP2225_011 (files 2–3) | AP2225_012, AP2225_015 (files 3–4) | — | AP2225_009 (AP-2258) |
| REQ-002 AC 3 → contract — overrides reach the contract | AP2225_014 (file 4) | — | — | — |
| REQ-005 AC 2 — lender ID stored | AP2225_013 (file 4) | — | — | — |

**Revisions**

| Date | TC | Change | Why |
|---|---|---|---|
| 2026-11-01 | AP2225_002 | Step 2 now records the Financing section's amounts; step 4 judges Financed Amount against them instead of asserting `15000` | Gate B rule B1 — review finding Pass 1 gap 2: "Financing amount" in the ticket is not the base amount by any stated rule |
| 2026-11-01 | AP2225_002 | Step 1 reads vehicle 915's own sale price; step 4 accepts Purchase Price = that value or the quote price `18500` and logs which matched | Independent R2 review F-1 — "Vehicle's sale price" is not equated with the quote price (`QuoteVehicle->getPrice()`) |
| 2026-11-01 | AP2225_004 | Step 1 reads vehicle 915's own sale price; step 3 accepts Financed Amount = that value or `18500`; Expected Result now states Delivery Date is empty | Independent R2 review F-1, F-5 |
| 2026-11-01 | AP2225_005, Execution Context | Save button rule: no standalone "Save" → step FAIL (REQ-004), rest BLOCKED, never click "Save and Generate Contract" | Independent R2 review F-2 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2225_001 | PASS | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_001-step3-RoadSidePageDirect_pass.png` |
| AP2225_002 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_002-step4-VehicleFieldsMissing_fail.png` |
| AP2225_003 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_003-step3-NoClientFields_fail.png` |
| AP2225_004 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_004-step1-DeliveryDateRequired_blocked.png` |
| AP2225_005 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_005-step1-NoOdometerField_fail.png` |

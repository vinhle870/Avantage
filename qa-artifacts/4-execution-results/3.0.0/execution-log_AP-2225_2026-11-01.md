# Execution Log — AP-2225 Dealer Area: AutoShield create contract

> Written by the **stlc-manual-executor** skill (stage s4 of `stlc-ticket-pipeline`, run
> `AP-2225 --from s4 --until s4c`). Do not edit by hand.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (pipeline worker)
**Date:** 2026-11-01
**Environment:** Dev (v2dev)
**Base URL:** `https://v2dev.garantieavantageplus.ca/`
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-01T16:27Z → 2026-11-01T16:35Z (UTC)
**Test cases:** `qa-artifacts/3-test-cases/AP2225_TestCases_001-005.md`, `_006-010.md`, `_011-012.md`, `_013-015.md`
**Login:** dealer and admin account from the `env` source, Dev Environment section (credential not reproduced here)

| Metric | Value |
|---|:---:|
| Total test cases | 15 |
| Passed | 1 |
| Failed | 7 |
| Blocked | 7 |
| Skipped | 0 |
| **Pass rate** | **6.7% (1 of 15)** |

**Environment note — read this first.** Every case file's Execution Context names v2staging.
By the user's decision this run used **Dev (v2dev) only**; the `env` source's Dev Environment
section wins over the case files, and v2staging was never opened. The Road side protection
page on Dev is **not the page the case files were designed against**: the `domain` page map
(quote-creation.md, mapped on staging) records a form with VIN, stock number, vehicle
condition, odometer reading and a "Save and Generate Contract" button. On Dev the page has
only the AutoShield product options, a "Policy Sale price" field, a hidden Vehicle section
(VIN, Make, Model, Year, "Continue") and one button labelled **Save**. Most FAILs below come
from that difference. Whether Dev simply does not carry the AP-2225 build yet, or the build
really lacks these fields, cannot be told from the portal; Gate C (R3) and s5 should weigh
this before filing.

**AutoShield connection.** Dev is connected to AutoShield: the Road side protection page of
every quote opened listed five AutoShield products with prices, and the dealer contract list
already holds two AutoShield contracts (#2697, #2698) created on Dev on 2026-07-25 from
quotes 6253 and 6254. The build check therefore passed.

**Contracts created by this run: none.** No step pressed a contract-generating button: Dev
has neither "Generate Contract" nor "Save and Generate Contract", and the Save-button rule
was never reached in a Save step (each Save case failed on a missing field first).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2225_001 | The Road side protection page of a new quote lists AutoShield products, each with a price | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_001-step3-RoadSidePageDirect_pass.png` | Five AutoShield options, each with a dollar price |
| AP2225_002 | The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_002-step4-VehicleFieldsMissing_fail.png` | Only VIN (prefilled) and Year exist; 10 of 11 listed fields absent |
| AP2225_003 | The client fields on the Road side protection page show the quote's client details | High | ❌ | 1 | 2 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_003-step3-NoClientFields_fail.png` | No client section or client field on the page |
| AP2225_004 | On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_004-step1-DeliveryDateRequired_blocked.png` | Test data not on dev: a quote with no delivery date cannot be saved |
| AP2225_005 | A prefilled value the dealer overrides is kept after Save and a page reload | High | ❌ | 0 | 1 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_005-step1-NoOdometerField_fail.png` | No Odometer Reading field; steps 2–5 blocked |
| AP2225_006 | Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged | High | ❌ | 1 | 1 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_006-step2-NoSalePriceDeliveryFields_fail.png` | No Sale Price (CAD) / Delivery Date fields; steps 3–5 blocked |
| AP2225_007 | The contract button reads "Generate Contract" in English and "Générer le contrat" in French | Medium | ❌ | 2 | 2 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_007-step4-FrenchNoGenererLeContrat_fail.png` | Only "Save" / "Sauvegarder"; no Generate Contract in either language |
| AP2225_008 | Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered | Medium | ❌ | 0 | 1 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_008-step1-NoOdometerField_fail.png` | No Odometer Reading field; steps 2–3 blocked |
| AP2225_009 | Generate Contract opens the autoShield contract page with an AutoShield contract ID, not the quote dashboard with an error | High | 🚫 | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_009-step3-NoGenerateButton_blocked.png` | No "Generate Contract" nor "Save and Generate Contract"; label judged by _007 |
| AP2225_010 | The autoShield contract page shows all 17 contract fields, with term, tier, client and vehicle matching the quote | High | 🚫 | 0 | 0 | — | Blocked by AP2225_009: no contract generated |
| AP2225_011 | The contract page's PDF link delivers the AutoShield contract as a PDF document | High | 🚫 | 0 | 0 | — | Blocked by AP2225_009: no contract generated |
| AP2225_012 | Generate Contract on a quote with no financing company ends on a page without a crash | Medium | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_012-step3-NoGenerateButton_blocked.png` | No contract-generating button on Dev |
| AP2225_013 | Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it | Medium | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_013-step1-AutoCapitalLenderIdEmpty_pass.png` | Lender-ID-empty company found; Generate step impossible on Dev |
| AP2225_014 | Values the dealer overrides and saves are the values shown on the generated contract, not the quote defaults | High | ❌ | 1 | 1 | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_014-step2-NoOverrideFields_fail.png` | No Odometer / Stock Number / Sale Price fields to override |
| AP2225_015 | Double-clicking "Generate Contract" creates only one AutoShield contract for the quote | High | 🚫 | 0 | 0 | — | No contract-generating button on Dev; Quote E not created |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data created and found

| Item | Value | Note |
|---|---|---|
| Vehicle 915 on Dev | Exists: Ford Focus 2008, VIN `1FAHP35NX8W239204`, mileage 5000 km | Vehicle Details page shows no stock number, condition or sale price ("none shown"). The vehicle's edit form (read, not saved) shows Vehicle Price `10000.00`, Condition `new`, and has no stock-number field |
| Dealer on Dev | Dashboard reads "Hi Vinh Le 1 Welcome to Test QA staging's account" | Same dealer label as staging |
| Quote A | **6451** — client QA AP2225-A-162747, `client.stage.919@yopmail.com`; Delivery date 2026-10-15, Price 18500; financing AutoCapital Canada, Financed amount 15,000.00$, Residual 0.00$, Term 60, Interest 6.9900%, Payment 296.95$ Monthly | Created this run. Financing company = first in the list, "AutoCapital Canada 200-11, Church Street Toronto". The base-amount field on Dev is labelled "Net amount financed including RDPRM" |
| Quote B | **6452** — client QA AP2225-B-163135, `client.stage.920@yopmail.com` | Created this run, client step only. The vehicle step with an empty Delivery date was refused ("This value should not be blank."), so Quote B as designed (no delivery date) does not exist; no financing was added |
| Quote D | **6453** — client QA AP2225-D-163318, `client.stage.921@yopmail.com`; Delivery date 2026-10-15, Price 18500; financing AutoCapital Canada, 15000 / 0 / Monthly / 60 / 6.99 | Created this run for AP2225_014 |
| Quotes C and E | Not created | AP2225_013 and AP2225_015 could not reach their Generate step on Dev, so creating their quotes would only have left data behind |
| Financing company with empty lender ID | AutoCapital Canada, admin id **39** | Read only, not edited |
| AutoShield contracts created | **None** | — |

**Left behind:** quotes 6451, 6452, 6453 (incomplete, no AutoShield contract). No AutoShield contract, no configuration change.

---

## Step-by-Step Results

### AP2225_001 — The Road side protection page of a new quote lists AutoShield products, each with a price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in; create Quote A from `/vehicle/915/details` → Create quote, vehicle step, financing step | Hub shows client "QA AP2225-A-…", vehicle `1FAHP35NX8W239204` and a Financing section; quote ID logged | URL = `/quote/6451/details`; heading = "#6451 - QA AP2225-A-162747 1FAHP35NX8W239204"; alert "Financing saved"; Financing card "Financing 60 months — AutoCapital Canada" | ✅ | Quote A = 6451 |
| 2 | On the hub, click "Road Side Protection" | `/quote/{id}/road-side-protection` opens with heading "Road Side protection program", no error | The hub has no button with that label; the Summary of products row "Roadside Protection" has a pencil link to `/quote/6451/road-side-protection`. Clicking it opened the page content in a modal over the hub (GET `/quote/6451/road-side-protection` → 200). Opening the same URL directly shows heading = "Road Side protection program"; no error message; one yellow warning "There's already a contract created for the same VIN. Contract #2697, 2698" | ✅ | Route loads without error; from the hub it is a modal, not a page navigation |
| 3 `[Verification]` | Verify AutoShield products are listed, each with a price; log them | At least one product, each option with a dollar price; record products/tiers for Q-008 | 5 radio options: "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$*"; "… \| Standard \| 24 months \| 300$*"; "Protection Hasards PNEU + ROUE ($4,000 Aggregate) \| Standard \| 12 months \| 123$*"; "Protection Hasards PNEU + ROUE ($10,000 Aggregate) \| Standard \| 12 months \| 316$*"; "Protection Hasards Routiers ILLIMITE \| Standard \| 12 months \| 445.5$*" | ✅ | Q-008: every option is "product \| tier \| term \| price$*", tier always "Standard" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_001-step3-ProductsWithPrices_pass.png` — the five AutoShield options with prices, shown in the modal opened from the hub
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_001-step3-RoadSidePageDirect_pass.png` — the same options on the page opened directly, heading "Road Side protection program"

### AP2225_002 — The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/vehicle/915/details`; log Stock Number, Condition and sale price | VIN `1FAHP35NX8W239204`; values or "none shown" recorded | Details text = "VIN: 1FAHP35NX8W239204 Mileage: 5000km Designation: COMMERCIAL". Stock Number: none shown. Condition: none shown. Sale price: none shown | ✅ | Edit form (read only): Vehicle Price 10000.00, Condition new, no stock-number field |
| 2 `[Pre-Condition]` | Use Quote A; log the Financing section's company and amounts | Company and amounts recorded | Quote 6451: company "AutoCapital Canada"; Financed amount 15,000.00$; Residual 0.00$; Payment amount 296.95$ Monthly; Interest rate 6.9900%; Term 60 | ✅ | — |
| 3 | Open `/quote/6451/road-side-protection` | Form loads; no error message | Heading "Road Side protection program"; no error; one warning about contracts #2697, #2698 on the same VIN | ✅ | Warning, not an error |
| 4 `[Verification]` | Verify VIN, Stock Number, Condition, Odometer Reading, In Service/Purchase/Delivery/Classification Date, Interest Rate, Sale Price (CAD), Financing Company; record Purchase Price, Purchase Type, Financed Amount | Each listed field shows the given value; a missing field is a FAIL | After the Vehicle "Edit" toggle: field "VIN" value = "1FAHP35NX8W239204"; "Make" selected = "Choose" (empty); "Model" selected = "Choose"; "Year" value = "2008". Fields Stock Number, Condition, Odometer Reading, In Service Date, Purchase Date, Delivery Date, Classification Date, Interest Rate, Sale Price (CAD), Financing Company, Purchase Price, Purchase Type and Financed Amount: **not present** on the page (form fields are only `quote_auto_shield_make_model[VIN/vehicleMake/vehicleModel/vehicleYear]` and `quote_auto_shield[selectedTier/salePrice]`, where salePrice is the empty "Policy Sale price") | ❌ | 10 of 11 listed fields missing. A dealer cannot see or correct what goes to AutoShield. See the environment note: the staging page map recorded more of these fields |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_002-step4-VehicleFieldsMissing_fail.png` — full page with the Vehicle section opened: only VIN, Make, Model, Year

### AP2225_003 — The client fields on the Road side protection page show the quote's client details — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use Quote A | Hub shows client "QA AP2225-A-…" | Hub client card = "QA AP2225-A-162747, 100 rue Test Montréal Québec H2X 1Y4, client.stage.919@yopmail.com, 5145550101" | ✅ | — |
| 2 | Open `/quote/6451/road-side-protection` | Page loads with a client section or client fields; no error | Page loads without error; sections = "Vehicle" and "Product info" only; client section visible = false; client fields = none | ❌ | No client information anywhere on the page |
| 3 `[Verification]` | Compare every client field with Test Data; log the client field labels | At least one client field is shown | Client field count = 0; labels logged: none | ❌ | A dealer cannot check the client details that go on the contract. Q-001: no client fields exist on Dev |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_003-step3-NoClientFields_fail.png` — the page with Vehicle and Product info only

### AP2225_004 — On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log the vehicle sale price; create Quote B with Price 18500 and no Delivery date, no financing | Sale price recorded; Quote B hub shows the vehicle and no financing | Vehicle sale price on details: none shown. Quote 6452 client saved. Vehicle step `/quote/6452/vehicle`: Delivery date is a required field (label "Delivery date*", prefilled with today 2026-11-01); with it cleared, Save stayed on the form with error "This value should not be blank." | 🚫 | Test data not on dev: a quote with no delivery date — Dev refuses to save the vehicle step without one |
| 2 | Click "Road Side Protection" on Quote B's hub | Page loads | Not run | 🚫 | Blocked by step 1 |
| 3 `[Verification]` | Verify In Service / Purchase Date = today, Delivery Date empty, read Financed Amount | Dates = today, Delivery empty, Financed Amount = sale price or 18500 | Not run. Note: on Dev none of these fields exist on the Road side protection page (see AP2225_002) | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_004-step1-DeliveryDateRequired_blocked.png` — vehicle step refusing an empty Delivery date

### AP2225_005 — A prefilled value the dealer overrides is kept after Save and a page reload — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use Quote A; open its Road side protection page | Page loads with Odometer Reading `5000` | Page loads; Odometer Reading field present = false | ❌ | The field the case overrides does not exist |
| 2 | Select the first option; set Odometer Reading 5123 and Stock Number | New values shown, option selected | Not run | 🚫 | Blocked by step 1: no Odometer Reading or Stock Number field |
| 3 | Click the button labelled exactly "Save" | Save confirmed | Not run. A button labelled exactly "Save" does exist on Dev | 🚫 | Not pressed: nothing to save from steps 1–2. Not a "REQ-004: no Save button" failure |
| 4 | Reload the page | Form loads again | Not run | 🚫 | Blocked by step 1 |
| 5 `[Verification]` | Verify 5123, the stock number and the option are kept | All three kept | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_005-step1-NoOdometerField_fail.png` — Quote 6451's page with no Odometer Reading field

### AP2225_006 — Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use Quote A; open `/quote/6451/vehicle`, write down Delivery date and Price | Delivery date `2026-10-15`, Price `18500` | Field "Delivery date*" value = "2026-10-15"; field "Price*" value = "18500" | ✅ | — |
| 2 | On the Road side protection page select the first option, set Sale Price (CAD) 19999 and Delivery Date 2026-10-20, click "Save" | Save completes | First option selectable; Sale Price (CAD) field present = false; Delivery Date field present = false (the only price field is "Policy Sale price", the price of the AutoShield policy, not the vehicle) | ❌ | The values the case changes cannot be entered; Save not pressed |
| 3 | Reload the page | 19999 and 2026-10-20 shown | Not run | 🚫 | Blocked by step 2 |
| 4 | Open `/quote/6451/vehicle` | Vehicle step loads | Not run | 🚫 | Blocked by step 2 |
| 5 `[Verification]` | Vehicle step still 2026-10-15 / 18500 | Vehicle quote unchanged | Not run | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_006-step2-NoSalePriceDeliveryFields_fail.png` — page with only "Policy Sale price" and Save

### AP2225_007 — The contract button reads "Generate Contract" in English and "Générer le contrat" in French — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6451/road-side-protection?_locale=en` | Page in English | Heading "Road Side protection program"; page in English | ✅ | — |
| 2 `[Verification]` | Read every button on the form | A button exactly "Generate Contract" and a button "Save" are present | Buttons = "×" (close alert), "Back", "Edit", "Choose", "Choose" (Make/Model pickers), "Continue", "Save". "Save" present = true; "Generate Contract" present = false; "Save and Generate Contract" present = false | ❌ | No contract-generating button at all. Q-003: there is no combined button on Dev either |
| 3 | Open `?_locale=fr` | Page in French | Heading "Programme de protection de la route" | ✅ | — |
| 4 `[Verification]` | Read every button; restore English | A button exactly "Générer le contrat" present; session back in English | Buttons = "×", "Retour", "Éditer", "Choisir", "Choisir", "Continuer", "Sauvegarder". "Générer le contrat" present = false. English restored with `?_locale=en` (heading "Road Side protection program") | ❌ | Q-010: Save is "Sauvegarder" in French |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_007-step2-EnglishOnlySaveButton_fail.png` — English page, only a Save button
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_007-step4-FrenchNoGenererLeContrat_fail.png` — French page, only "Sauvegarder"

### AP2225_008 — Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Quote A's page; select the first option | Form loads with Odometer Reading filled | Form loads; Odometer Reading field present = false | ❌ | The field the case empties does not exist |
| 2 | Clear Odometer Reading, click "Save" | No HTTP 500; record save outcome (Q-004) | Not run | 🚫 | Blocked by step 1; Save not pressed |
| 3 `[Verification]` | Reload and read Odometer Reading | Last saved value, empty or 5000 | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_008-step1-NoOdometerField_fail.png` — page with no Odometer Reading field

### AP2225_009 — Generate Contract opens the autoShield contract page with an AutoShield contract ID — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Quote A's Road side protection page | Form loads | Form loads (quote 6451) | ✅ | — |
| 2 | Select the first option; log product, tier, term, price | Option selected, every field has a value | Radio "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$*" checked = true. "Policy Sale price*" value = "" (required, empty); no Odometer field to restore | ✅ | Product Protection Hasards PNEU + ROUE, tier Standard, 12 months, 200$ |
| 3 | Click "Generate Contract"; if none, press "Save and Generate Contract" | Browser leaves the form | Neither button exists (buttons: Back, Edit, Choose, Choose, Continue, Save). Nothing pressed. The Generate Contract rule names only those two labels; it does not authorise pressing "Save" in a Generate step | 🚫 | Missing label judged by AP2225_007 (FAIL). Dev's "Save" may itself create a contract (contracts #2697/#2698 exist for quotes 6253/6254) — not tried, outside the binding rules |
| 4 `[Verification]` | Verify contract page with AutoShield contract ID | Contract page with ID | Not run | 🚫 | Blocked by step 3. Contract ID: none created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_009-step3-NoGenerateButton_blocked.png` — the form with only a Save button

### AP2225_010 — The autoShield contract page shows all 17 contract fields — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the contract URL recorded by AP2225_009 | Contract page loads | Not run: AP2225_009 produced no contract | 🚫 | Blocked by AP2225_009 |
| 2 `[Verification]` | Check the 17 items | All 17 shown | Not run | 🚫 | Blocked by AP2225_009 |
| 3 `[Verification]` | Compare term, tier, product, client, vehicle | Match the quote | Not run | 🚫 | Blocked by AP2225_009 |

Observation only (not a result): an existing Dev contract page, `/quote/6254/auto-shield-contract/2698`, shows Contract ID, App Number, Status Code, Effective/Expiry Date, Term In Months, Tier, Product Name, client and vehicle sub-fields, Coverage Km, Provincial Sales Tax, Total Tax CAD, Sale Price With Tax CAD, Deductible, Is Payed, and en/fr PDF links. It was not created by this run and was not judged.

### AP2225_011 — The contract page's PDF link delivers the AutoShield contract as a PDF document — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the contract URL recorded by AP2225_009 | Contract page loads | Not run: no contract | 🚫 | Blocked by AP2225_009 |
| 2 `[Verification]` | Find the PDF link | PDF link present | Not run | 🚫 | Blocked by AP2225_009 |
| 3 | Click the PDF link | PDF opens or downloads | Not run | 🚫 | Blocked by AP2225_009 |
| 4 `[Verification]` | Verify the document is this contract's PDF | PDF of this contract | Not run | 🚫 | Blocked by AP2225_009 |

### AP2225_012 — Generate Contract on a quote with no financing company ends on a page without a crash — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use Quote B (no financing) | Hub shows vehicle and no financing | Quote 6452 (no financing; its vehicle step could not be saved without a Delivery date, see AP2225_004) | ✅ | Quote B as designed cannot exist on Dev; 6452 meets this case's need (no financing) |
| 2 | Open its Road side protection page; select the first option | Form ready | `/quote/6452/road-side-protection` loads, heading "Road Side protection program", 5 options; no Financing Company field exists | ✅ | Nothing to fill for financing |
| 3 | Click "Generate Contract"; if none, "Save and Generate Contract" | A page is shown | Neither button exists (Edit, Choose, Choose, Continue, Save). Nothing pressed | 🚫 | Missing label judged by AP2225_007 |
| 4 `[Verification]` | Read the resulting page | No HTTP 500; record outcome for Q-007 | Not run | 🚫 | Blocked by step 3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_012-step3-NoGenerateButton_blocked.png` — Quote 6452's page with only Save

### AP2225_013 — Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin portal → financing-company list; find one with empty AutoShield Lender ID | Company found and recorded | Route `/admin/financing-company` (sidebar "Financing Company"). `/admin/financing-company/39/edit`: Name = "AutoCapital Canada"; "Auto shield lender id" value = "" (empty). Nothing edited | ✅ | Route written back to admin-portal.md |
| 2 `[Pre-Condition]` | Create Quote C with that company | Hub shows that company | Not run | 🚫 | Not created: step 3 cannot be performed on Dev (Quote A 6451 and Quote D 6453 already use AutoCapital Canada) |
| 3 | Generate the contract (Generate Contract rule) | Contract page with ID | No "Generate Contract" nor "Save and Generate Contract" on Dev | 🚫 | Missing label judged by AP2225_007 |
| 4 `[Verification]` | Re-read the lender ID | Non-empty | Not run; AutoCapital Canada's lender id is still empty (no contract was attempted) | 🚫 | Blocked by step 3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_013-step1-AutoCapitalLenderIdEmpty_pass.png` — AutoCapital Canada edit page, Auto shield lender id empty

### AP2225_014 — Values the dealer overrides and saves are the values shown on the generated contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Quote D | Hub shows vehicle, client, financing | Quote 6453 "#6453 - QA AP2225-D-163318 1FAHP35NX8W239204"; alert "Financing saved"; Financing "AutoCapital Canada" | ✅ | Quote D = 6453 |
| 2 | Select the first option; set Odometer 7777, Stock Number, Sale Price (CAD) 19999; Save (or the combined button) | Overrides shown before saving / generating | Form fields present = `quote_auto_shield_make_model[VIN/vehicleMake/vehicleModel/vehicleYear]`, `quote_auto_shield[selectedTier/salePrice]`. Odometer Reading, Stock Number and Sale Price (CAD) present = false. Combined button present = false | ❌ | The dealer has no way to override these values on Dev. Neither Save nor any other button pressed |
| 3 | Click "Generate Contract" | Contract page with ID | Not run | 🚫 | Blocked by step 2 |
| 4 `[Verification]` | Read the overridden values on the contract and PDF | 7777 / stock number / 19999 | Not run | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_014-step2-NoOverrideFields_fail.png` — Quote 6453's page, no override fields

### AP2225_015 — Double-clicking "Generate Contract" creates only one AutoShield contract for the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Quote E | Hub shows vehicle, client, financing | Not run | 🚫 | Not created: the case's action (step 3) cannot be performed on Dev |
| 2 `[Pre-Condition]` | Count contract-list rows for the client | Zero rows | Not run. Observation: `/road-side-protection-contracts` lists 2 rows (2698 "sdfs sdfds", 2697 "Vinh test002"), none for an AP2225 client | 🚫 | — |
| 3 | Double-click "Generate Contract" (or the combined button) | One page, no error | Neither button exists on Dev (seen on quotes 6451, 6452, 6453) | 🚫 | Missing label judged by AP2225_007 |
| 4 `[Verification]` | Count rows again | Exactly one row | Not run | 🚫 | Blocked by step 3 |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2225_004 | 🚫 | Test data not on dev: a quote with no delivery date — the vehicle step on Dev requires a Delivery date ("This value should not be blank."). Needs a quote without a delivery date, or the designer to accept another way to reach the "today if empty" default |
| AP2225_009 | 🚫 | Dev's Road side protection page has neither "Generate Contract" nor "Save and Generate Contract"; the binding Generate Contract rule allows only those labels. Needs a build with a contract-generating button, or an explicit rule that "Save" may be pressed for a Generate step |
| AP2225_010 | 🚫 | Blocked by AP2225_009 — no contract generated |
| AP2225_011 | 🚫 | Blocked by AP2225_009 — no contract generated |
| AP2225_012 | 🚫 | No contract-generating button on Dev (as AP2225_009) |
| AP2225_013 | 🚫 | No contract-generating button on Dev (as AP2225_009); the empty-lender-ID company (AutoCapital Canada, id 39) is ready for a re-run |
| AP2225_015 | 🚫 | No contract-generating button on Dev (as AP2225_009) |

---

## Environment Observations

- **Environment: Dev (v2dev)**, by the user's decision. The case files' Execution Context names v2staging; the `env` source's Dev section was used instead and v2staging was never opened.
- **The Road side protection page on Dev differs from the staging page map.** Staging (quote-creation.md): selectedTier, salePrice, VIN, stockNumber, vehicleCondition, odometerReading, "Save and Generate Contract". Dev: selectedTier, salePrice ("Policy Sale price"), a hidden make/model form (VIN, Make, Model, Year, Continue) and "Save". Seven FAILs (002, 003, 005, 006, 007, 008, 014) come from missing fields or labels on this page. If Dev is simply behind staging, these FAILs describe Dev's build, not the ticket's final code.
- On the Vehicle section the Make picker shows "Choose" (empty) although vehicle 915 is a Ford Focus — recorded, not judged.
- From the quote hub the Roadside Protection pencil opens the page inside a modal; the direct URL renders a full page with the heading.
- Every Road side protection page shows a warning: "There's already a contract created for the same VIN. Contract #2697, 2698" — those Dev contracts belong to quotes 6253 and 6254 (2026-07-25).
- AutoShield is reachable from Dev (five priced products listed on every quote opened).
- The quote vehicle step on Dev requires a Delivery date and prefills today's date.
- `env-check` source is `missing`: no separate smoke check run; the orchestrator's environment health check had already passed.
- No HTTP 500, no error page, no console error tied to a test step.

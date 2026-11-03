# Execution Log — AP-2503: Generate contract for a quote's extended warranty

**Environment: Dev (v2dev)** — by the user's decision for this run; v2staging was not opened.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (worker for stlc-ticket-pipeline, `AP-2503 --from s4 --until s4c`)
**Date:** 2026-11-02 (local, UTC+7) — 2026-11-02T01:04Z → 2026-11-02T01:17Z
**RUN_STAMP:** `110201` (run start 2026-11-02T01:04Z, UTC `MMDDHH`) · **RUN_DATE:** 2026-11-02
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal, dealer "Test QA staging" = dealer 1380, shared dealer account from the `env` source, Dev section; the password is not written here)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, UI language English (`?_locale=en` on the login page; English was left on, as the earlier Dev runs did — the language before the run is not known)
**Run folder:** no-sprint
**Test cases:** `AP2503_TestCases_001-005.md`, `AP2503_TestCases_006-010.md`
**Environment check:** the `env-check` source is missing; the caller's environment health check had already passed before this run.
**Design note:** both test-case files name v2staging in their Execution Context; this run used Dev by the user's decision. No other fact in the Execution Context disagreed with the knowledge sources, except the Generate Contract action location, which was confirmed (see Environment Observations).

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 7 |
| Failed | 3 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **70% (7 of 10)** |

### Three faults explain the three failures

| # | What the build does | Requirement it breaks | Case that fails on it |
|---|---|---|---|
| F1 | The "Program Summary" card on the right shows only Program Term, Start Date, End date and Sale price. **The vehicle delivery date is not in it** — it appears only as a field of the left-hand "Vehicle identification" section. | AC 2 "The “Program Summary” shows: Vehicle delivery date · Warranty start date (editable) · Warranty sale price" | AP2503_003 (step 3) |
| F2 | The VIN, Year, Make, Model, Mileage and **Delivery date** on the page are ordinary editable text inputs (`readOnly = false`, not disabled; they are only shaded grey). Typing `AP2503TC099999999` over the VIN and `2026-10-15` over the delivery date was accepted and both fields showed the new values. | AC 3 "vehicle identifiers and delivery date are read-only" | AP2503_005 (steps 2 and 5) |
| F3 | On a quote **without a financing** the "Financing information" section shows six required, empty fields (Financing company name, phone, address, city, province, postal code). Clicking "Generate Contract" does nothing: the browser's built-in check refuses the form ("Please fill out this field.") and the page stays as it is. The contract could only be generated after picking a company in the "Financing Company" picker. | AC 1 / AC 4 — a quote needs only a vehicle and an extended warranty, and "contract is created following the current process"; the description says financing behaviour "stays unchanged" | AP2503_007 (step 3) |

What works: the action opens a dedicated page at the unchanged address `/quote/{id}/warranty/generate-contract` (HTTP 200, no modal); the two-column layout places Owner and Financing information on the left and Program Summary, the PDF preview and the button on the right; owner, vehicle and financing-company values are pre-filled from the quote; the start date and owner fields are editable; submitting creates the contract and its invoice; the start date entered on the page (including one 30 days before delivery) is the start date of the created contract; no error page or HTTP 5xx anywhere.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2503_001 | "Generate Contract" opens its own page at the unchanged address, not a pop-up | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_001-step5-GenerateContractFullPage_pass.png` | Quote A 6557; full page, HTTP 200, no modal; action in the Extended warranty row's ⋯ menu |
| AP2503_002 | Owner and financing on the left; summary, PDF preview and button on the right | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step4-RightColumnSummaryPdfButton_pass.png` | Left x=100, right x=768; preview = `/quote/6557/warranty/pdf` (warranty contract draft, "example" watermark) |
| AP2503_003 | Program Summary shows delivery date, editable start date and sale price | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step3-ProgramSummaryNoDeliveryDate_fail.png` | F1: no delivery date in Program Summary; start date edit works |
| AP2503_004 | Page pre-filled with the quote's client, vehicle and financing values | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_004-step5-FinancingCompanyPrefilled_pass.png` | Quote B 6558; every shown owner/vehicle/financing-company value matches |
| AP2503_005 | VIN and delivery date cannot be changed; owner fields and start date can | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step2-VinAndDeliveryDateAcceptTyping_fail.png` | F2: VIN and delivery date accept typing; nothing saved to the quote |
| AP2503_006 | Submitting with pre-filled values creates the contract | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_006-step5-ContractAPOP01-845Listed_pass.png` | Contract APOP01-845 (id 845), invoice #942 ($456.00) |
| AP2503_007 | A start date changed on the page is the contract's start date | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-RequiredFinancingFieldsEmpty_fail.png` | F3: no-financing quote cannot submit; after picking a company, APOP01-846 starts 2026-11-09 as entered |
| AP2503_008 | Emptied last name does not crash the page or lose values | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-EmptyLastNameRefusedValuesKept_pass.png` | Q-006: refused by the browser check, no visible message; values kept; no contract |
| AP2503_009 | Start date before delivery date does not crash the page | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_009-step4-ContractStartOct3Accepted_pass.png` | Q-004: 2026-10-03 accepted; APOP01-847 starts Oct 3, 2026 |
| AP2503_010 | Page opens for a quote with no financing and pre-fills owner and vehicle | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_010-step3-NoFinancingEmptyFields_pass.png` | Quote A 6557; Q-008: financing section shows six empty required fields |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data created on Dev

Every built quote has its own inventory vehicle (`/vehicle/new/edit/PASSENGER`: Toyota Corolla 2023, Vehicle Price 25000, Kilometers 12000, Condition new, Fuel type GASOLINE, Transmission Automatic, **Cylinders `4` and Engine size `1.8` Litre — required by the form, no default, so these values were chosen**, Designation Particular; "Vehicle type" is chosen by the add route `/PASSENGER`), its own client (First name Contract, address 200 Rue Test, Montréal, Québec, H2X 1Y4, phones 5145550201 / 5145550202) and a vehicle step with Delivered at 2026-11-02 and Price 25000. Every extended warranty is the first program and first term offered: **"Garantie de base AP" → option 1 → 100m/20000km, Sale price 2500** (row shows Cost CA$456.00, Commission CA$2,044.00). Vehicle 915 and quote 6276 were not used. Nothing was deleted (the `cleanup` source is missing). No VIN was refused as a duplicate.

| Built for | Vehicle id (VIN) | Quote | Client email | Contract / invoice left behind |
|---|---|---|---|---|
| AP2503_001 (quote A; reused by 002, 003, 010) | 1125 (AP2503TC001110201) | 6557 | client.stage.2503001@yopmail.com | none — extended warranty saved, never submitted |
| AP2503_004 (quote B; reused by 005, submitted by 006) | 1126 (AP2503TC004110201) | 6558 | client.stage.2503004@yopmail.com | financing (AutoCapital Canada, 25,000 / 0 / Monthly / 60 / 6.99 → 494.91$ Monthly); **contract APOP01-845** (`/warranty/845`, Pending approval), **invoice #942** ($456.00, payment pending) |
| AP2503_007 | 1127 (AP2503TC007110201) | 6559 | client.stage.2503007@yopmail.com | **contract APOP01-846** (`/warranty/846`, start 2026-11-09, financing company AutoCapital Canada on the contract only), **invoice #943** ($456.00) |
| AP2503_008 | 1128 (AP2503TC008110201) | 6560 | client.stage.2503008@yopmail.com | none — the submit was refused |
| AP2503_009 | 1129 (AP2503TC009110201) | 6561 | client.stage.2503009@yopmail.com | **contract APOP01-847** (`/warranty/847`, start 2026-10-03), **invoice #944** ($456.00) |

The contracts cannot be deleted. The edits typed on the page in AP2503_003 and AP2503_005 were never submitted; quote 6558's client still reads "Owner2503-004" and its delivery date Nov 2, 2026.

---

## Step-by-Step Results

### AP2503_001 — "Generate Contract" opens its own page at the unchanged address, not a pop-up — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in (`?_locale=en`), create the vehicle with VIN `AP2503TC001110201` | `/vehicle/{id}/details` opens; id recorded | URL = `/vehicle/1125/details`; flash "Vehicle saved"; heading "Vehicle VIN:AP2503TC001110201" | ✅ | Vehicle 1125 |
| 2 `[Pre-Condition]` | Create quote, client Owner2503-001, vehicle step, extended warranty | Heading `#{id} - Contract Owner2503-001`; Extended warranty names the program | URL = `/quote/6557/details?type=extended`; heading "#6557 - Contract Owner2503-001 AP2503TC001110201"; flash "Warranty saved"; Extended warranty row CA$2,500.00, expanded: "Program AP 100m/20000km Start date: Nov 1, 2026", "Cost: CA$456.00 Commission: CA$2,044.00" | ✅ | Quote A = 6557. The row's own start date reads Nov 1 although the delivery date is Nov 2 — recorded only |
| 3 | Open the Extended warranty row's ⋯ menu, click "Generate Contract" | Browser navigates to `/quote/{id}/warranty/generate-contract`; no error page | Menu items = Edit · Generate Contract · Delete; after the click URL = `/quote/6557/warranty/generate-contract`; heading "Extended Warranty Contract" | ✅ | Address bar changed; a real navigation |
| 4 | Open `/quote/6557/details`, then type the generate-contract address directly | Same page loads directly; no error page | URL = `/quote/6557/warranty/generate-contract`; navigation response status = 200; heading "Extended Warranty Contract" | ✅ | Direct entry works |
| 5 `[Verification]` | Inspect the page | Exact address with quote A's id; full page, no modal; "Program Summary" and "Generate Contract" button present | URL path = `/quote/6557/warranty/generate-contract`; open modals (`.modal.show`) = 0; quote page not visible; "Back" link → `/quote/6557/details`; H3 "Program Summary" visible; button "Generate Contract" (`#warranty_finalize_save`, type submit) visible | ✅ | Q-011: the action is the "Generate Contract" item of the ⋯ dropdown on the Extended warranty row of "Summary of products" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_001-step5-GenerateContractFullPage_pass.png` — the generate-contract page of quote 6557 as a full page, with the timeframe banner, Vehicle identification on the left and Program Summary on the right

### AP2503_002 — Owner and financing on the left; summary, PDF preview and button on the right — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote A (6557) if it still offers Generate Contract | A quote with an extended warranty exists | Quote 6557 still offers "Generate Contract" (no contract) | ✅ | Reused quote A |
| 2 | Open `/quote/6557/warranty/generate-contract` | Page loads without an error | Status 200; heading "Extended Warranty Contract" | ✅ | — |
| 3 `[Verification]` | Inspect the left column at 1280 × 800 | "Owner information" and "Financing information" both in the left column; record other sections | H4 "Vehicle identification" x=100 y=236 · H4 "Owner information" x=100 y=747 · H4 "Financing information" x=100 y=1461 — all three in the left column (x = 100) | ✅ | Q-001: vehicle details are in the left column, first, as "Vehicle identification" (VIN, Mileage, Year, Make, Model, Delivery date, Cylinders, Engine size, transmission, condition, Diesel/Turbo/4x4/FWD) |
| 4 `[Verification]` | Inspect the right column | "Program Summary", an embedded PDF preview and a "Generate Contract" button in the right column, beside the left one | H3 "Program Summary" x=768 y=220; button "Generate Contract" x=768 y=570; link "Open PDF in new tab" → `/quote/6557/warranty/pdf`; `<embed>` x=768 y=682, 447×700, src `/quote/6557/warranty/pdf#pagemode=none&navpanes=0`, PDF content visible (3 pages) | ✅ | Q-002: the preview is the extended-warranty contract document ("WARRANTY PROGRAM", "# DEMANDE: # 949", "# CONTRAT: incomplete", "example" watermark), not the quote. Q-010: unlike the Esthetic protection page, this page has an embedded PDF preview and an "Open PDF in new tab" link, and its vehicle fields are not read-only |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step3-LeftColumnOwnerFinancing_pass.png` — Owner information fields on the left with the "Financing information" heading below, the contract PDF preview on the right
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step4-RightColumnSummaryPdfButton_pass.png` — right column: Program Term, Start Date, End date, Sale price, the "Generate Contract" button, "Open PDF in new tab" and the embedded PDF viewer

### AP2503_003 — Program Summary shows delivery date, editable start date and sale price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote A (6557) | Quote with extended warranty; delivery date recorded | Quote 6557, delivery date 2026-11-02 | ✅ | Reused quote A |
| 2 | Open `/quote/6557/warranty/generate-contract` | Page loads without an error | Status 200 | ✅ | — |
| 3 `[Verification]` | Read the "Program Summary" | A vehicle delivery date equal to 2026-11-02, a start date and a sale price | Program Summary entries = "Program Term: Garantie de base AP — option 1" · "Start Date" (editable text input, value 2026-11-02) · "End date: 2035-03-02" · "Sale price" (editable text input, value 2500). **No delivery date in the Program Summary.** The delivery date (2026-11-02) is only a field in the left "Vehicle identification" section | ❌ | F1 — AC 2 lists "Vehicle delivery date" in the Program Summary. Q-004: start date defaults to the delivery date 2026-11-02. Q-005: sale price = 2500, the amount entered with the warranty, without tax |
| 4 | Change the start date to 2026-11-09, do not submit | The control shows 2026-11-09 | Start Date input (class `datepicker`, a calendar opens on click) value = 2026-11-09 | ✅ | Typed; the calendar also opens |
| 5 `[Verification]` | Inspect the start date and the rest of the summary | Start date 2026-11-09; delivery date and sale price unchanged | Start Date = 2026-11-09; left Delivery date = 2026-11-02; Sale price = 2500; End date still 2035-03-02 (not recalculated on screen) | ✅ | Q-005: the sale price is an editable text input. Left without submitting; reloading showed 2026-11-02 again |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step3-ProgramSummaryNoDeliveryDate_fail.png` — Program Summary with Program Term, Start Date, End date and Sale price only; the delivery date sits in the left column
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step5-StartDateChangedOthersKept_pass.png` — Start Date shows 2026-11-09 while Delivery date stays 2026-11-02 and Sale price 2500

### AP2503_004 — Page pre-filled with the quote's client, vehicle and financing values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC004110201, quote for Owner2503-004 with vehicle step and extended warranty | Heading `#{id} - Contract Owner2503-004`; extended warranty | Vehicle 1126; quote 6558; heading "#6558 - Contract Owner2503-004 AP2503TC004110201"; "Warranty saved" (Garantie de base AP / 100m/20000km / 2500) | ✅ | Quote B = 6558 |
| 2 `[Pre-Condition]` | `/quote/6558/financing`: DOB 1985-06-15, Financing, 25000, 0, Monthly, 60, 6.99, first company → Save | Financing entry with 25000 and 60 | Flash "Financing saved"; quote page Financing: "Financing 60 months · AutoCapital Canada · Type Financing · Financed amount 25,000.00$ · Residual 0.00$ · Term 60 · Interest rate 6.9900% · Payment 494.91$ Monthly" | ✅ | First company = AutoCapital Canada |
| 3 | Open `/quote/6558/warranty/generate-contract` | Page loads without an error | Status 200 | ✅ | Timeframe banner shown (recorded) |
| 4 `[Verification]` | Read Owner information and vehicle details | Owner and vehicle values match the quote | Owner: first name = "Contract", last name = "Owner2503-004", company = "", address = "200 Rue Test", address2 = "", city = "Montréal", province = "Québec", postal code = "H2X 1Y4", email = "client.stage.2503004@yopmail.com", tel home = "5145550201", tel work = "5145550202", Indian status certificate = "", drivers license = "". Vehicle: VIN = "AP2503TC004110201", Mileage = 12000, Year = 2023, Make = "Toyota", Model = "Corolla", Delivery date = 2026-11-02, Cylinders = 4, Engine size = "1.8 l", transmission = Automatic, condition = new, Diesel/Turbo/4x4/FWD unchecked | ✅ | Every shown field with a quote value matches; the empty ones are empty on the client too |
| 5 `[Verification]` | Read "Financing information" | Every financing value shown matches step 2 | Fields shown: "Financing Company" picker = "Choose", Financing company name = "AutoCapital Canada", phone = "" , address = "200-11, Church Street", city = "Toronto", province = "Ontario", postal code = "M5E 1W1" | ✅ | Only the financing **company** is shown — no amount, residual, frequency, term or rate. The picker is a helper that fills the fields (its option data for AutoCapital Canada holds `phone: ""`), so the empty phone is not a lost value |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_004-step4-OwnerVehiclePrefilled_pass.png` — Owner information of quote 6558 pre-filled
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_004-step5-FinancingCompanyPrefilled_pass.png` — Financing information with AutoCapital Canada's name and address pre-filled, the picker at "Choose" and the phone empty

### AP2503_005 — VIN and delivery date cannot be changed; owner fields and start date can — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote B (6558) and open its generate-contract page | Page loads; quote id recorded | Quote 6558 still offered "Generate Contract"; status 200 | ✅ | Quote's VIN = AP2503TC004110201 |
| 2 | Click into the delivery date and type another date; try its picker. Click into the VIN and type `AP2503TC099999999` | Delivery date and VIN do not change (text or disabled / read-only control) | Delivery date input: `readOnly = false`, disabled = false, class `datepicker` — a calendar opened on click, and typing `2026-10-15` left value = "2026-10-15". VIN input: `readOnly = false`, class `vinlookup` — typing left value = "AP2503TC099999999" | ❌ | F2 — both accept a new value. Q-003 (record-only): Make, Model, Year and Mileage are editable text inputs too |
| 3 | Change Last name to `Edited2503`, City to `Laval` | Both accept the typing | Last name = "Edited2503"; City = "Laval" | ✅ | — |
| 4 | Change the start date to 2026-11-09 | Start date shows the new date | Start Date = "2026-11-09" | ✅ | — |
| 5 `[Verification]` | Inspect the page without submitting | Delivery date and VIN still the quote's and not editable; owner edits and start date shown | Delivery date = "2026-10-15" (quote holds 2026-11-02); VIN = "AP2503TC099999999" (quote holds AP2503TC004110201); Last name = "Edited2503"; City = "Laval"; Start Date = "2026-11-09" | ❌ | F2. After leaving without submitting, quote 6558 still reads "#6558 - Contract Owner2503-004 AP2503TC004110201", delivery date Nov 2, 2026 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step2-VinAndDeliveryDateAcceptTyping_fail.png` — VIN field showing AP2503TC099999999 and Delivery date showing 2026-10-15 after typing
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step5-VinEditedOwnerStartDateEdited_fail.png` — final state: edited VIN and delivery date, Start Date 2026-11-09

### AP2503_006 — Submitting with pre-filled values creates the contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote B (6558, with financing) | Quote with warranty and financing | Quote 6558, financing AutoCapital Canada 25,000 / 60 months | ✅ | AP2503_005's edits were not submitted |
| 2 | Open the page; record start date and sale price | Page loads without an error | Status 200; Start Date = 2026-11-02; Sale price = 2500 | ✅ | — |
| 3 | Click "Generate Contract" without changing anything | Page submits, no error page; record address and message (Q-007) | POST → URL = `/quote/6558/details`; flash "Invoice #942 ($456.00) is created" | ✅ | Q-007: lands on the quote page; no separate "contract created" message |
| 4 | Inspect the Extended warranty entry | Quote page loads; record controls, invoice and PDF (Q-007) | Row shows link "APOP01-845" → `/warranty/845`, a PDF icon → `/warranty/845/pdf` (HTTP 200 `application/pdf`, `inline; filename=contrat.pdf`); the ⋯ menu is gone; a "Download all documents" link now appears under Subtotal | ✅ | Invoice 942 = $456.00, the warranty cost, not the 2500 sale price |
| 5 `[Verification]` | Open `/warranty`, look for the client or VIN | A contract row for this client/VIN is listed | First row: Client "Contract Owner2503-004 client.stage.2503004@yopmail.com", Vehicle "Toyota Corolla 2023 VIN: AP2503TC004110201", Program "APOP01-845 100m/20000km", Invoices "Invoice #942 Payment pending", Start Date "November 2, 2026", status "Pending approval" | ✅ | Contract APOP01-845 created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_006-step5-ContractAPOP01-845Listed_pass.png` — `/warranty` list with APOP01-845 for Contract Owner2503-004

### AP2503_007 — A start date changed on the page is the contract's start date — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC007110201 and quote Owner2503-007 with vehicle step and extended warranty (no financing) | Quote with extended warranty | Vehicle 1127; quote 6559; "Warranty saved" | ✅ | No financing, as the case is written |
| 2 | Open the page, set start date 2026-11-09 and work phone 5145550299 | Page loads; values shown | Status 200; Start Date = 2026-11-09; Client tel work = 5145550299 | ✅ | — |
| 3 | Click "Generate Contract" | Page submits without an error page | **Nothing was submitted.** URL stayed `/quote/6559/warranty/generate-contract`; the browser's built-in check refused the form: Financing company name, phone, address, city, province and postal code = "Please fill out this field." (all six empty and `required`); no message was visible on the page | ❌ | F3 — a quote without a financing cannot be turned into a contract unless the dealer fills a financing company. **To still judge the start date**, the first company in the "Financing Company" picker (AutoCapital Canada) was picked; Generate Contract then → `/quote/6559/details`, "Invoice #943 ($456.00) is created" |
| 4 | Open `/warranty`, find the contract, open its PDF | Contract listed; PDF readable; number recorded | `/warranty` row "Contract Owner2503-007 … APOP01-846 100m/20000km … Invoice #943 Payment pending … Start Date November 9, 2026"; `/warranty/846` shows only tabs Details/Invoices, a "Quote" link and "Open PDF in new tab"; `/warranty/846/pdf` opens (3 pages, "# CONTRAT: APOP01-846") | ✅ | Contract APOP01-846 |
| 5 `[Verification]` | Read the contract's start date and the phones | Contract start date = 2026-11-09; record the phones (Q-009) | List Start Date = "November 9, 2026"; PDF "Start Date: 2026-11-09"; PDF "TEL. CELL. 5145550299", "TEL. RES. 5145550201"; quote client form `/quote/6559/client` tel work = "5145550202" (unchanged) | ✅ | Q-009: the edited phone goes onto the contract only; the quote's client keeps 5145550202 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-SubmitStoppedEmptyFinancingFields_fail.png` — after clicking Generate Contract the page is unchanged (top of the page, no message)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-RequiredFinancingFieldsEmpty_fail.png` — the six required Financing company fields, all empty, that blocked the submit
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step4-ContractPdfAPOP01-846_pass.png` — contract PDF APOP01-846 with Start Date 2026-11-09 and TEL. CELL. 5145550299
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step5-ContractStartNov9_pass.png` — `/warranty` list with APOP01-846 starting November 9, 2026

### AP2503_008 — Emptied last name does not crash the page or lose values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC008110201 and quote Owner2503-008 with vehicle step and extended warranty | Quote with extended warranty | Vehicle 1128; quote 6560; "Warranty saved" | ✅ | — |
| 2 | Open the page, clear Last name | Page loads; Last name empty | Status 200; Client last name = "" | ✅ | The Financing Company picker was set to AutoCapital Canada so that only the last name was missing (same reason as AP2503_007 step 3) |
| 3 | Click "Generate Contract" | No error page; record refused/accepted (Q-006) | Refused by the browser's built-in check: Client last name validation message = "Please fill out this field."; URL unchanged; no request sent; no visible message or scroll to the field was seen on the page | ✅ | Q-006: refused client-side; the message is the browser's own tooltip, not shown in the page |
| 4 `[Verification]` | Inspect the page and `/warranty` | Untouched values kept; record whether a contract was created | First name = "Contract", City = "Montréal", Postal code = "H2X 1Y4", Start Date = "2026-11-02", Sale price = "2500", Last name = ""; `/warranty` has no row for Owner2503-008 | ✅ | No contract for quote 6560 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-EmptyLastNameRefusedValuesKept_pass.png` — Owner information after the refused submit: Last name empty, the other values kept

### AP2503_009 — Start date before the delivery date does not crash the page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC009110201 and quote Owner2503-009 with vehicle step and extended warranty | Quote with extended warranty | Vehicle 1129; quote 6561; "Warranty saved" | ✅ | — |
| 2 | Open the page, set start date 2026-10-03 (RUN_DATE − 30) | Page loads; record whether the control accepts it (Q-004) | Status 200; Start Date accepted = "2026-10-03" (typed; the calendar does not stop it) | ✅ | Q-004: no limit on an earlier date |
| 3 | Click "Generate Contract" | No error page; record refused/accepted | Financing Company picker set to AutoCapital Canada first (F3, as in AP2503_007); submit → `/quote/6561/details`, "Invoice #944 ($456.00) is created" | ✅ | Q-004: accepted |
| 4 `[Verification]` | Inspect the contract in `/warranty` | If accepted: contract start date = 2026-10-03; id listed | `/warranty` row "Contract Owner2503-009 … VIN: AP2503TC009110201 Delivery date: Monday, November 2, 2026 … APOP01-847 100m/20000km … Invoice #944 … Start Date October 3, 2026" | ✅ | A contract starting a month before delivery was created; contract APOP01-847 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_009-step4-ContractStartOct3Accepted_pass.png` — `/warranty` list with APOP01-847 starting October 3, 2026, delivery November 2, 2026

### AP2503_010 — Page opens for a quote with no financing and pre-fills owner and vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote A (6557, no financing) | Quote with warranty and no financing | Quote 6557, no financing, still offers Generate Contract | ✅ | Reused quote A |
| 2 | Open the page | Page loads without an error | Status 200 | ✅ | — |
| 3 `[Verification]` | Inspect the page | Owner pre-filled (Contract / Owner2503-001); VIN shown; Program Summary and button present; record the financing section (Q-008) | Client first name = "Contract", last name = "Owner2503-001"; VIN = "AP2503TC001110201"; "Program Summary" and "Generate Contract" present; Financing information = picker "Choose" + six empty required fields (name, phone, address, city, province, postal code) | ✅ | Q-008: empty required fields, no message. Those fields block the submit (see AP2503_007 step 3, F3) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_010-step3-NoFinancingEmptyFields_pass.png` — Financing information of quote 6557 with all company fields empty

---

## Environment Observations

- **Environment: Dev (v2dev)** for the whole run, by the user's decision. v2staging was never opened.
- **Generate Contract location verified** (it came from the automation code): `/quote/{id}/details` → "Summary of products" → Extended warranty row → ⋯ dropdown → **Edit** (`/quote/{id}/warranty/edit`) · **Generate Contract** (`/quote/{id}/warranty/generate-contract`) · **Delete** (`/quote/{id}/cancel-product/warranty`). After a contract exists the menu is replaced by the contract number link (`/warranty/{id}`) and a PDF icon (`/warranty/{id}/pdf`). Written back to `domain` (quote-creation.md).
- **The "acceptable timeframe" banner (record-only):** every generate-contract page showed a red alert "The delivery date has passed the acceptable timeframe. Please update the delivery data and the warranty start date", with a delivery date of 2026-11-02 (today); it did not stop any submit.
- The quote vehicle step pre-filled Delivered at = 2026-11-01 (Dev's server date in Montréal was still 1 Nov); 2026-11-02 was typed and accepted.
- The quote's Extended warranty row shows "Start date: Nov 1, 2026" while the generate-contract page defaults the start date to the delivery date 2026-11-02 — recorded, not judged.
- The submit form is `warranty_finalize[...]` (POST to the same address, button `#warranty_finalize_save`), as the automation code says.
- Known Dev defects AP-2519, AP-2520/2521/2522, AP-2529 and AP-2512 were not met in any setup step: the add-warranty modal opened with its vehicle summary collapsed (AP-2521), but the program list was available and every warranty saved.
- No error page or HTTP 5xx was seen. The console showed only the Freshchat widget errors present on every page.

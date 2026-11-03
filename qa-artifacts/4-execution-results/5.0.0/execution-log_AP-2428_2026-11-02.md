# Execution Log — AP-2428 Dealer Permaplate Contract

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (worker subagent, stage s4 of `stlc-ticket-pipeline`)
**Ticket:** AP-2428 · **Spec ID:** AP2428 · **Run folder:** 5.0.0
**Environment:** Dev (v2dev)
**Date:** 2026-11-02 (local, UTC+7)
**Base URL:** `https://v2dev.garantieavantageplus.ca`
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 01:21 → 01:32 (UTC+7) — 2026-11-01 18:21Z → 18:32Z
**Account:** the shared QA account from the `env` source, "Dev Environment" section (Dealer and Admin portals). Credentials are not reproduced here.
**Test-case files:** `AP2428_TestCases_001-005.md`, `AP2428_TestCases_006-010.md`, `AP2428_TestCases_011-014.md`, `AP2428_TestCases_015-015.md`

| Metric | Value |
|---|:---:|
| Total test cases | 15 |
| Passed | 9 |
| Failed | 4 |
| Blocked | 2 |
| Skipped | 0 |
| **Pass rate** | **60% (9 of 15)** |

**Why this run is on Dev.** The test cases were designed against staging. By the user's
decision this run executed them on Dev (v2dev) only; staging was never opened. Every Dev
id that differs from the design is listed under *Dev test data used* below.

**Before execution, the ticket comments were re-read (2026-11-02).** The latest comment is
still the QA questions comment of 2026-11-01; Q-001, Q-002 and Q-003 have no answer, so
AP2428_004 and AP2428_008 ship BLOCKED as designed. Their steps were not judged, but what the
form showed is recorded against each question.

**The two unanswered QA comments from August.** The 2026-08-14 report ("No Permaplate
Contract is shown") does not reproduce on Dev: the control exists (AP2428_001). The
2026-08-18 report ("error on Generate Contract") does not reproduce either: Generate
Contract succeeded on three quotes (AP2428_009, _012, _015), even with Financing company
left at "Choose", which crashed on staging on 2026-09-06 (staging BUG-001).

### Dev test data used

| Item | Designed (staging) | Used on Dev | Note |
|---|---|---|---|
| Vehicle | 915, Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km | 915 — same VIN, make, model, year and mileage | Already recorded as a Dev fact in `test-data` |
| Dealer | 1380 | 1380 — "Offical VinhLe870@gmail.com", portal label "Test QA staging" | Same id and name on Dev |
| Permaplate product link | Link the first product if none is linked | Product 3 "10 ans" (120 months) **already linked** on Dev | Nothing linked by this run, so nothing to unlink (Configuration unchanged) |
| Options of product 3 | First product + every enabled option | 20 Antirouille – Rust+Sound (combo) 80$ · 17 Peinture – Céramique + Graphene 75$ · 18 Extra care (5 ans couverture ) 70$ (enabled and auto-ticked when 17 is ticked) | Quote Cost 225$ |
| Client inboxes | `client.stage.NNN` — next unused | 942 (AP2428_001), 943 (_015), 944 (_002), 945 (_011), 946 (_012) | 941 was the last one used in the repo |
| Option Dealer Cost (AP2428_014) | Configuration, restore in the case | Option 20: 80.00 → 90.00 → **80.00 restored** | Read back as 80.00 on `/admin/permaplate/3/details` |

### Records this run left on Dev

| Record | Id | Made by |
|---|---|---|
| Quote "AP2428 quote A" (Perma Contrat2428) | 6456 | AP2428_001 |
| Permaplate contract on quote 6456 | PNA-0000000017 (admin `/admin/permaplate-contract/17`), invoice #938 $258.69 | AP2428_009 |
| Quote Double Clic2428 | 6457 | AP2428_015 |
| Permaplate contract on quote 6457 | PNA-0000000018 (admin id 18), invoice #939 $258.69 | AP2428_015 |
| Quote Sans Permaplate2428 (no Permaplate) | 6458 | AP2428_002 |
| Quote Vide Champs2428 (Permaplate selected, **no contract**) | 6459 | AP2428_011 |
| Quote Adresse Modifiee2428 | 6460 | AP2428_012 |
| Permaplate contract on quote 6460 | PNA-0000000019 (admin id 19), invoice #940 $258.69 | AP2428_012 |

Contracts are left on Dev as instructed. No admin configuration was left changed.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2428_001 | A quote with a saved Permaplate selection shows a Create contract button that opens the contract form | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_001-step5-ContractFormSections_pass.png` | Control is "Generate Contract" in the row's ⋯ menu on quote details |
| AP2428_002 | A quote with no Permaplate selection does not crash when the contract form is looked for or opened | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_002-step4-RedirectPleaseCreateQuoteFirst_pass.png` | No control; direct URL redirects with "Please create a quote first" (Q-005) |
| AP2428_003 | The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_003-step4-VehiclePrefillValues_pass.png` | All five values correct; Make, Model, Delivery date are read-only |
| AP2428_004 | The contract form's Year field is prefilled with the value the ticket specifies | Medium | 🚫 | 0 | 0 | — | Q-001 unanswered; Year shows 2008, read-only (recorded only) |
| AP2428_005 | The contract form prefills the owner's name, company, address, province, phones and email from the client | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_005-step4-OwnerCompanyEmptyProvinceText_fail.png` | Other name on file empty; Province is a text box, not a dropdown |
| AP2428_006 | The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_006-step4-ProgramSummaryReadOnly_pass.png` | Start 2026-11-01, End 2036-11-01; options shown as a bullet list |
| AP2428_007 | The contract form shows a Cost Price for the selected Permaplate options | High | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_007-step3-NoCostPriceLabelOnlyTotal_fail.png` | No "Cost Price" label; only "Total 225.00$" |
| AP2428_008 | The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies | High | 🚫 | 0 | 0 | — | Q-002/Q-003 unanswered; form shows none of the four lines (recorded only) |
| AP2428_009 | Submitting Generate Contract returns the dealer to the quote details page with a PDF download button | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_009-step4-QuoteDetailsWithPdfDownload_pass.png` | Contract PNA-0000000017, invoice #938; download icon shown |
| AP2428_010 | The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form | High | ❌ | 1 | 2 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_010-step2-PdfDownloadHttp500_fail.png` | Download returns HTTP 500 error page, 2/2; older contracts too. Steps 2 and 4 failed, step 3 blocked |
| AP2428_011 | Submitting the contract form with Last name and VIN cleared does not crash or lose data silently | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_011-step4-BlankFieldsRefused_pass.png` | Refused: "This value should not be blank."; no contract made (Q-006) |
| AP2428_012 | An address edited on the contract form does not crash, and where the edited value ends up is recorded | Medium | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_012-step5-PdfDownloadHttp500_fail.png` | Contract made, but PDF download HTTP 500 — same fault as AP2428_010 |
| AP2428_013 | A quote whose contract was already generated does not crash when the create-contract control is looked for | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_013-step4-SecondContractRedirectsSilently_pass.png` | No second-contract control; direct URL redirects to quote details (Q-005) |
| AP2428_014 | An existing contract keeps its cost price after an administrator changes the option's Dealer Cost | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_014-step5-DealerCostRestored80_pass.png` | Cost price stayed 225.00$ after +10.00; Dealer Cost restored to 80.00 |
| AP2428_015 | Double-clicking Generate Contract creates exactly one contract for the quote | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_015-step4-OneContractRowAfterDoubleClick_pass.png` | One contract row, one new invoice (#939) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

**How the contract form was read.** AP2428_003, _005, _006, _007 and the record-only parts
of _004 and _008 each start by opening "AP2428 quote A" (6456) and its contract form. The
form was opened once, from the quote details page in AP2428_001 step 4, and every one of
those cases was read from that same form before AP2428_009 submitted it. Each case's
verification has its own screenshot. The form was reopened for AP2428_009 by its URL
`/quote/6456/permaplate-create-contract`, the same address the menu item links to.

### AP2428_001 — A quote with a saved Permaplate selection shows a Create contract button that opens the contract form — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin: open `/admin/dealer/1380/permaplate`, record linked products, link one if none | Dealer 1380 has a linked product; whether this step linked it is recorded | `URL = /admin/dealer/1380/permaplate; heading = "Eligible Esthetic protection products"; table row = "3 \| 10 ans \| 120 \| Yes \| EN FR \| Unlink"` | ✅ | Already linked on Dev. This step linked nothing, so there is nothing to unlink after the run |
| 2 `[Pre-Condition]` | Dealer: `/vehicle/915/details` → Create quote → fill client → Save | `/quote/{id}/details` with heading `#{id} - Perma Contrat2428` | `URL = /quote/6456/details; alert = "Client saved"; heading = "#6456 - Perma Contrat2428 1FAHP35NX8W239204"` | ✅ | Quote id 6456 = "AP2428 quote A"; inbox client.stage.942 |
| 3 `[Pre-Condition]` | Vehicle: Delivered at 2026-11-01, Price 20000 → Save; Permaplate: first product, every enabled option → Save | Each save without error; Permaplate section names options and a Cost | `Vehicle saved, back on /quote/6456/details. Permaplate page: radio "10 ans" checked; options 20, 17, 18 checked (18 enabled and auto-ticked when 17 was ticked); heading "Cost: 225$"; after Save alert = "Esthetic protection quote saved successfully"; quote row = "Antirouille – Rust+Sound (combo), Peinture – Céramique + Graphene, Extra care (5 ans couverture ) Cost: CA$225.00$"` | ✅ | Costs 80$ + 75$ + 70$. The quote row prints the currency twice ("CA$225.00$") — cosmetic, noted only |
| 4 | Find the create-contract control on quote details and on the Permaplate page; click it | A page opens without error; URL and location of the control recorded (Q-004) | `Quote details: Esthetic protection row ⋯ menu = "Edit" → /quote/6456/permaplate, "Generate Contract" → /quote/6456/permaplate-create-contract, "Delete" → /quote/6456/cancel-product/permaplate. /quote/6456/permaplate page controls = Back, Save only. After click URL = /quote/6456/permaplate-create-contract, heading = "Esthetic protection Contract"` | ✅ | For Q-004: the control is labelled "Generate Contract" (not "Create contract") and lives only in the quote details row menu |
| 5 `[Verification]` | Verify Vehicle information, Owner information, Program Summary sections and a "Generate Contract" button | All three sections and the button are visible | `Headings: h4 "Vehicle identification", h4 "Owner information", h3 "Program Summary"; submit button text = "Generate Contract" visible = true` | ✅ | The vehicle section is titled "Vehicle identification", not "Vehicle information" as the ticket names it. The case fails only on a missing control or an error page, so this is recorded, not failed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_001-step4-GenerateContractMenuItem_pass.png` — quote 6456 details with the Esthetic protection row and its menu
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_001-step5-ContractFormSections_pass.png` — full contract form: Vehicle identification, Owner information, Program Summary and the Generate Contract button

### AP2428_002 — A quote with no Permaplate selection does not crash when the contract form is looked for or opened — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote from vehicle 915 for Sans Permaplate2428 | `/quote/{id}/details` loads; no Permaplate selection | `URL = /quote/6458/details; heading = "#6458 - Sans Permaplate2428 1FAHP35NX8W239204"; Esthetic protection row = "-"` | ✅ | Inbox client.stage.944 |
| 2 | List every create-contract control on quote details and `/quote/{id}/permaplate` | Controls recorded (expected none, Q-005) | `Quote details: Esthetic protection row has only a "+" link → /quote/6458/permaplate; no link containing "contract". Permaplate page controls = Back, Save` | ✅ | None offered |
| 3 | Open `/quote/{id}/permaplate-create-contract` directly | Response recorded | `Redirected to /quote/6458/details (HTTP 200 after redirect); alert = "Please create a quote first"` | ✅ | — |
| 4 `[Verification]` | Verify no error page or HTTP 5xx; record whether the form opened. Do not submit | No error page or 5xx | `No error page in steps 1–3; contract form did not open, so there is no products table to record; Generate Contract never clicked` | ✅ | For Q-005: without a Permaplate quote the form is refused with a message, not shown |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_002-step4-RedirectPleaseCreateQuoteFirst_pass.png` — quote 6458 details with "Please create a quote first"

### AP2428_003 — The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record Make, Model, Year, VIN, mileage on `/vehicle/915/details` | Values recorded | `"Ford Focus 2008"; VIN = 1FAHP35NX8W239204; Mileage = 5000km; Designation = COMMERCIAL` | ✅ | Make Ford, Model Focus, Year 2008 |
| 2 `[Pre-Condition]` | Open quote 6456 and its contract form | Form opens with the vehicle section | `URL = /quote/6456/permaplate-create-contract; h4 "Vehicle identification" visible` | ✅ | Same form instance as AP2428_001 step 4 |
| 3 | Read Make, Model, VIN, Odometer, Delivery date — value and type | Values recorded | `vehicleMake text "Ford" readonly; vehicleModel text "Focus" readonly; vehicleVin text "1FAHP35NX8W239204" editable; vehicleOdometer number "5000" editable; deliveryDate date "2026-11-01" (shown 11/01/2026) readonly` | ✅ | Also on the form: Cylinders "4", Transmission "Manual", five unticked checkboxes (Diesel, Injection, Turbo, 4x4, All Wheel Drive) |
| 4 `[Verification]` | Verify the five values and that each is an editable text field | Five text fields prefilled with exactly these values; empty or different value is FAIL | `Make = "Ford", Model = "Focus", VIN = "1FAHP35NX8W239204", Odometer = "5000", Delivery date = 2026-11-01 — all prefilled and matching. Make, Model and Delivery date are read-only (grey); Delivery date is a date input` | ✅ | Passed on the case's fail rule (no empty or wrong value). Note for review: the action also says "editable"; three of the five fields are read-only. The ticket says only "Text field with … prefilled", so editability is not stated by the ticket |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_003-step4-VehiclePrefillValues_pass.png` — vehicle and owner columns of the form with the prefilled values

### AP2428_004 — The contract form's Year field is prefilled with the value the ticket specifies — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | (shipped BLOCKED — Q-001) | Not known — Q-001 | `Recorded only: vehicleYear = number input, value "2008", readonly; vehicle 915 Model = "Focus"` | 🚫 | Blocked by Q-001 (Blocking, unanswered as of 2026-11-02). The build prefills the year, not the model; whether that is right is the author's answer to give |

**Screenshots:** none — the case was not executed. The Year value is visible in `AP2428_001-step5-ContractFormSections_pass.png`.

### AP2428_005 — The contract form prefills the owner's name, company, address, province, phones and email from the client — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open quote 6456's contract form | Owner information section shown | `h4 "Owner information" visible` | ✅ | Same form instance as AP2428_001 step 4 |
| 2 | Read every Owner field, value and type | Values and types recorded | `ownerFirstName text "Perma"; ownerLastName text "Contrat2428"; ownerOtherName text "" (empty); ownerAddress text "123 rue Principale"; ownerCity text "Montréal"; ownerProvince text "Québec"; ownerPostalCode text "H2X 1Y4"; ownerEmail email "client.stage.942@yopmail.com"; ownerPhoneRes text "5145550100"; ownerPhoneCell text "5145550101"; financingCompany select "Choose" (34 options)` | ✅ | The client record at `/quote/6456/client` holds company = "Garage Test 2428 Inc" (checked the same night) |
| 3 | Open the Province dropdown and record options and selection | Options and selection recorded | `Province is an <input type="text"> with value "Québec" — there is no dropdown and no list of provinces` | ✅ | Recorded; judged in step 4 |
| 4 `[Verification]` | Verify every owner value; Province dropdown lists the provinces with Québec selected; phones hold the client's numbers | Every field prefilled with the client's value; empty field is FAIL | `Other name on file = "" while the client's company is "Garage Test 2428 Inc"; Province = free-text box "Québec", not a dropdown. Last name, First name, Address, City, Postal code, Email match. Phone (res) = 5145550100 (home), Phone (cell) = 5145550101 (work)` | ❌ | Two faults. The ticket says "Text field with client's company prefilled" and "Dropdown of provinces". A dealer must retype the company by hand or the contract goes out without it, and a free-text province can be misspelled, which matters because the province drives the taxes. For Q-007: home → Phone (res), work → Phone (cell) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_005-step4-OwnerCompanyEmptyProvinceText_fail.png` — Owner information with the empty "Other name on file" and the Province text box

### AP2428_006 — The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the option names on quote 6456; open the contract form | Form opens with Program Summary | `Quote options = "Antirouille – Rust+Sound (combo), Peinture – Céramique + Graphene, Extra care (5 ans couverture )"; h3 "Program Summary" visible` | ✅ | — |
| 2 | Read Program Term, Start Date, End date and their element types | Values and types recorded | `<dd> plain text: Program Term = "10 ans"; Start Date = "2026-11-01"; End date = "2036-11-01"; no input elements in the summary` | ✅ | For Q-008: end date = start date + 120 months |
| 3 | Read the Selected protection products table | Columns and rows recorded | `Rendered as a bullet list (<ul>), not a table: "Antirouille – Rust+Sound (combo)", "Peinture – Céramique + Graphene", "Extra care (5 ans couverture )". No column headings, no per-option prices` | ✅ | For Q-009: no table and no columns |
| 4 `[Verification]` | Verify read-only text, Start Date = 2026-11-01, End date is a date, every option listed | All three read-only; start = delivery date; no option missing | `All three are plain text; Start Date 2026-11-01 = delivery date; End date 2036-11-01; all 3 options listed` | ✅ | The ticket says "Table with all the selected options"; the list form is recorded for Q-009, not failed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_006-step4-ProgramSummaryReadOnly_pass.png` — Program Summary column

### AP2428_007 — The contract form shows a Cost Price for the selected Permaplate options — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the quote's Cost; open the contract form | Form opens; Cost recorded | `Quote Cost = CA$225.00; form open` | ✅ | — |
| 2 | Find the "Cost Price" label and its amount | Amount recorded | `No element with the text "Cost Price" on the page. The only money line in Program Summary is a table row "Total \| 225.00$"` | ✅ | Recorded; judged in step 3 |
| 3 `[Verification]` | Verify a "Cost Price" label with an amount; record whether it equals the quote Cost | A Cost Price with an amount is visible; missing label is FAIL | `"Cost Price" label visible = false; "Total" = 225.00$ (equals the quote Cost 225$)` | ❌ | The ticket lists "Cost Price" in the Program Summary. The amount is there but labelled "Total", so the dealer cannot tell whether it is their cost or the client's price. Comparison recorded: 225.00$ = quote Cost |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_007-step3-NoCostPriceLabelOnlyTotal_fail.png` — Program Summary showing only "Total 225.00$"

### AP2428_008 — The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | (shipped BLOCKED — Q-002, Q-003) | Not known — Q-002, Q-003 | `Recorded only: Program Summary shows no Retail price, Subtotal, Taxes or Grand Total — only "Total 225.00$". Province on the form is a text box, so step 3 (switch to Ontario) has no dropdown to use. Invoice #938 raised for this contract = $258.69 = 225.00 × 1.14975 (QC GST+QST rate), while the success banner said "Invoice #938 ($225) is created"` | 🚫 | Blocked by Q-002 and Q-003 (Blocking, unanswered as of 2026-11-02). The absence of retail/tax lines matches AP-2456's direction, but whether that is right is the author's answer |

**Screenshots:** none — the case was not executed. The summary is visible in `AP2428_007-step3-NoCostPriceLabelOnlyTotal_fail.png`.

### AP2428_009 — Submitting Generate Contract returns the dealer to the quote details page with a PDF download button — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open quote 6456's contract form | Form filled as in _003 and _005 | `URL = /quote/6456/permaplate-create-contract; values as recorded in AP2428_003/_005; Financing company left at "Choose"` | ✅ | The only select at "Choose" is "Financing company" |
| 2 | Click Generate Contract | No error page or 5xx; success message recorded | `Alerts = "Esthetic protection contract generated successfully" and "Invoice #938 ($225) is created"` | ✅ | Staging crashed here with Financing company at "Choose" (2026-09-06 BUG-001); Dev does not |
| 3 | Record URL, heading and the Permaplate section | Recorded | `URL = /quote/6456/details; heading = "#6456 - Perma Contrat2428 1FAHP35NX8W239204"; Esthetic protection row = options + "Cost: CA$225.00$"; row action = PDF icon link → /quote/6456/permaplate-contract-download (target=_blank); the ⋯ menu is gone` | ✅ | Contract number PNA-0000000017 (from `/invoice` and admin list) |
| 4 `[Verification]` | Verify on `/quote/6456/details` with a PDF download button | Same quote's details page with a download button | `URL = /quote/6456/details; download link visible = true` | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_009-step4-QuoteDetailsWithPdfDownload_pass.png` — quote 6456 details after generation, with the success banners and the PDF icon

### AP2428_010 — The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open quote 6456 details | Download button from _009 shown | `PDF icon link → /quote/6456/permaplate-contract-download visible = true` | ✅ | — |
| 2 | Download the PDF; record URL, status, content type | HTTP 200 `application/pdf`, no error page | `GET /quote/6456/permaplate-contract-download → HTTP 500, content-type text/html, 13,335 bytes; page text = "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois."` | ❌ | Reproduced 2 of 2 (in-page fetch, then opening the URL in the tab). The older Dev contract on quote 6284 returns the same HTTP 500, so every Permaplate PDF on Dev fails, not just new ones. A dealer cannot give the client the contract to sign |
| 3 | Open the PDF and record its contents | Contents recorded | `Not possible — no PDF was returned` | 🚫 | Blocked by step 2 |
| 4 `[Verification]` | Verify the PDF opened with content and matching VIN/owner | No download error, no blank PDF | `Download error = true (HTTP 500)` | ❌ | Q-010 (fields, layout, language) cannot be recorded until the download works. The ticket's own note asks for the PDF to be built with the HTMLtoPDF library; that change is the likely place to look |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_010-step2-PdfDownloadHttp500_fail.png` — the French technical-error page returned by the download link

### AP2428_011 — Submitting the contract form with Last name and VIN cleared does not crash or lose data silently — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote for Vide Champs2428 | Quote loads; id recorded | `URL = /quote/6459/details; heading "#6459 - Vide Champs2428 …"` | ✅ | Inbox client.stage.945 |
| 2 `[Pre-Condition]` | Vehicle 2026-11-01 / 20000; Permaplate first product + all options; open the contract form | Form opens | `Options 3/20/17/18 checked, saved; URL = /quote/6459/permaplate-create-contract` | ✅ | — |
| 3 | Clear Last name and VIN; click Generate Contract | Response recorded | `URL unchanged = /quote/6459/permaplate-create-contract; browser validation on VIN and Last name = "Please fill out this field."; inline errors under both fields = "ERROR This value should not be blank."` | ✅ | — |
| 4 `[Verification]` | Verify no error page or 5xx; record whether a contract was made | No server error | `No error page; /permaplate-contracts has no row for Vide Champs2428` | ✅ | For Q-006: the form refuses blank Last name and VIN (both are `required`) and creates no contract |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_011-step4-BlankFieldsRefused_pass.png` — the form with "This value should not be blank." under VIN and Last name

### AP2428_012 — An address edited on the contract form does not crash, and where the edited value ends up is recorded — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote for Adresse Modifiee2428 (address 10 rue Ontario Est) | Quote loads | `URL = /quote/6460/details` | ✅ | Inbox client.stage.946 |
| 2 `[Pre-Condition]` | Vehicle, Permaplate selection, open the contract form | Form opens with Address = 10 rue Ontario Est | `ownerAddress value = "10 rue Ontario Est"` | ✅ | — |
| 3 | Replace Address with 99 avenue du Parc; Generate Contract | Response recorded; no error page | `URL = /quote/6460/details; alerts = "Esthetic protection contract generated successfully", "Invoice #940 ($225) is created"` | ✅ | Contract PNA-0000000019 (admin id 19) |
| 4 | Download the PDF and record its address; record the client's address | Both recorded | `GET /quote/6460/permaplate-contract-download → HTTP 500 error page; client record /quote/6460/client address = "10 rue Ontario Est"; admin /admin/permaplate-contract/19 shows the number and invoice only, no address` | ❌ | Same download fault as AP2428_010. The client record was not changed by the edit |
| 5 `[Verification]` | Verify no error page and the PDF address is one of the two entered | No server error, and no address nobody entered | `Error page = true (HTTP 500 on the PDF download); PDF address = not readable` | ❌ | For Q-006: the edit does not go back to the client record. Where it lands on the contract cannot be seen until the PDF works. Counted as a separate FAIL because the case's own check is "no error page", but it is the same root cause as AP2428_010 — s5 should link it, not file a second bug |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_012-step5-PdfDownloadHttp500_fail.png` — the error page returned for quote 6460's contract PDF

### AP2428_013 — A quote whose contract was already generated does not crash when the create-contract control is looked for — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open quote 6456 details | Download button shown | `Esthetic protection row action = PDF link only` | ✅ | — |
| 2 | Record every control that creates a contract or edits the selection | Controls recorded | `Quote details: no Generate Contract, Edit or Delete on the row (menu gone). /quote/6456/permaplate still opens "Permaplate Quote" with all 4 inputs checked and a working Save button` | ✅ | For Q-005: the selection page stays editable after the contract exists (not submitted, so not known whether a save would change the contract) |
| 3 | No create-contract control, so open `/quote/6456/permaplate-create-contract` directly | Response recorded | `Redirected to /quote/6456/details; no message; no form` | ✅ | Generate Contract was never clicked |
| 4 `[Verification]` | Verify no error page or 5xx | No server error | `No error page in any step` | ✅ | For Q-005: a second contract cannot be started from the UI or by URL |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_013-step4-SecondContractRedirectsSilently_pass.png` — quote 6456 details after the direct URL redirected back

### AP2428_014 — An existing contract keeps its cost price after an administrator changes the option's Dealer Cost — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Dealer `/permaplate-contracts`: record Perma Contrat2428's cost price; download its PDF and record option names | Cost price and option names recorded | `Row = "1FAHP35NX8W239204 \| Perma Contrat2428 \| Cell: 5145550101 Home: 5145550100 \| 225.00$ \| Download"; PDF download → HTTP 500` | ✅ | Option names taken from the admin contract list instead: "10 ans (120 months) Antirouille – Rust+Sound (combo), Peinture – Céramique + Graphene, …" |
| 2 `[Pre-Condition]` | Admin: option 20 edit form, record Dealer Cost, set +10.00 → Save | New value shown; original recorded | `URL = /admin/permaplate/3/option/20/edit; dealerCost original = "80.00"; set "90.00"; alert = "Option saved successfully"; details row = "Antirouille – Rust+Sound (combo) 0 0 90.00 Yes"` | ✅ | Configuration change, restored in step 4 |
| 3 | Dealer: reload `/permaplate-contracts`; record the same row; download the PDF again | Values recorded | `Perma Contrat2428 row Contract cost price = 225.00$ (unchanged); PDF → HTTP 500` | ✅ | — |
| 4 | Admin: set Dealer Cost back to the original → Save | Original shown again | `dealerCost set "80.00"; alert = "Option saved successfully"; row = "… 80.00 Yes"` | ✅ | Restored |
| 5 `[Verification]` | Verify cost price and option names unchanged, and Dealer Cost restored | Contract unchanged; option restored; a cost price that moved by 10.00 is FAIL | `Cost price before = 225.00$, after = 225.00$; option 20 Dealer Cost = 80.00` | ✅ | The PDF part of the comparison could not be made (download HTTP 500, AP2428_010). The cost price — the check the case fails on — held |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_014-step5-DealerCostRestored80_pass.png` — admin option list with Antirouille back at 80.00

### AP2428_015 — Double-clicking Generate Contract creates exactly one contract for the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote for Double Clic2428 | Quote loads | `URL = /quote/6457/details` | ✅ | Inbox client.stage.943 |
| 2 `[Pre-Condition]` | Vehicle, Permaplate selection; count Double Clic2428 rows; record highest invoice | Recorded | `Selection saved (3/20/17/18, Cost 225$); /permaplate-contracts rows for Double Clic2428 = 0; /invoice highest ID = 938` | ✅ | — |
| 3 | Open the form and double-click Generate Contract | Response recorded | `URL = /quote/6457/details; alerts = "Esthetic protection contract generated successfully", "Invoice #939 ($225) is created"` | ✅ | One success banner pair only |
| 4 `[Verification]` | Verify exactly one row for Double Clic2428; record new invoices | One contract row; two rows or an error page is FAIL | `/permaplate-contracts rows for Double Clic2428 = 1 (VIN 1FAHP35NX8W239204, 225.00$); /invoice new rows above 938 = 1 (939 "#PNA-0000000018 Double Clic2428 …", $258.69)` | ✅ | Invoice count recorded only (AP-2446's scope): one invoice for one contract |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_015-step4-OneContractRowAfterDoubleClick_pass.png` — dealer contract list with a single Double Clic2428 row

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2428_004 | 🚫 | Shipped BLOCKED by Q-001 (what the Year field should hold), still unanswered on AP-2428 as of 2026-11-02. The build shows "2008" read-only; recorded only |
| AP2428_008 | 🚫 | Shipped BLOCKED by Q-002 (tax rule) and Q-003 (AP-2456 removes retail and taxes), still unanswered as of 2026-11-02. The form shows no retail, subtotal, tax or grand-total line; recorded only |

---

## Environment Observations

- **Environment: Dev (v2dev).** Staging was not opened in this run. `env-check` and `cleanup` sources are `missing` in the registry; the environment health check was run by the caller before this stage and passed.
- **Every Permaplate contract PDF on Dev returns HTTP 500** — every one tried: quotes 6456 and 6460 (made tonight) and the older contract on quote 6284. Quote 6457's PDF was not tried. The fault is in the download itself, not in contract creation, which works.
  - *Added 2026-11-02 (s5, R3 F-5):* the R3 reviewer also reproduced HTTP 500 on quote 6457's PDF. The same link, `/quote/{id}/permaplate-contract-download`, returned **HTTP 200 `application/pdf`** on **staging** on 2026-10-04 (source: `qa-artifacts/qa-docs/quote-creation.md`, "Permaplate contract lists", mapped during the AP-2463 re-test). So the fault is specific to Dev's build or PDF set-up, or to the HTMLtoPDF change the ticket asks for. Filed in s5 as one bug covering AP2428_010 and AP2428_012.
- **Invoice amount vs banner.** Each generation banner says "Invoice #N ($225) is created", while `/invoice` lists the same invoice at $258.69 (225.00 plus 14.975 %, the Quebec GST+QST rate). Recorded for Q-002 and for AP-2446; not judged here.
- **Currency printed twice** on the quote details Esthetic protection row: "Cost: CA$225.00$". Cosmetic; not in any case's expected result.
- **Staging BUG-001 does not reproduce on Dev:** Generate Contract with Financing company left at "Choose" succeeded three times.
- The sidebar and headings say "Esthetic protection"; the quote Permaplate page heading still reads "Permaplate Quote" in English.

---

## Revisions

| Date | Change | Source |
|---|---|---|
| 2026-11-02 | Result Overview step counts corrected: AP2428_010 1 passed / 2 failed (step 3 blocked); AP2428_012 3 passed / 2 failed. Staging HTTP 200 fact added to Environment Observations. No result changed | R3 findings F-1 and F-5 (qa-artifacts/7-reviews/AP-2428_review.md), applied at s5 |

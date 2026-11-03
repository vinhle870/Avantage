# Execution Log — AP-2497: Add extended warranty to a quote — capture missing vehicle fields instead of a dead end

**Environment: Dev (v2dev)** — by the user's decision for this run; v2staging was not opened.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (worker for stlc-ticket-pipeline, `AP-2497 --from s4 --until s4c`)
**Date:** 2026-11-02 (local, UTC+7) — 2026-11-01T22:15Z → 2026-11-01T22:31Z
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal, dealer "Test QA staging" = dealer 1380, shared dealer account from the `env` source, Dev section)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, UI language English (`?_locale=en` on the login page)
**Run folder:** no-sprint
**Test cases:** `AP2497_TestCases_001-005.md`, `AP2497_TestCases_006-010.md`, `AP2497_TestCases_011-015.md`
**Environment check:** the `env-check` source is missing; the orchestrator's environment health check had already passed before this run.

| Metric | Value |
|---|:---:|
| Total test cases | 15 |
| Passed | 4 |
| Failed | 11 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **27% (4 of 15)** |

### Three faults explain all 11 failures

| # | What the build does | Requirement it breaks | Cases that fail on it |
|---|---|---|---|
| F1 | The vehicle form in the add-extended-warranty modal has **five** fields — Brand, Model, Year, Kilometers, Fuel type. There is **no Vehicle type** field (form `quote_warranty_vehicle[...]` has only `make`, `model`, `year`, `kilometers`, `fuelType`). | AC "Form exposes only the required fields" (… **Vehicle type**) and AC "Form is prefilled …" (Vehicle type from `Vehicle::$type`) | AP2497_001, 003, 004, 006 |
| F2 | For a vehicle whose values are all stored, the modal opens with the form **collapsed**: only a summary line ("Toyota Corolla 2022 · 15000 km · GASOLINE") and an "Edit" link show; the fields appear only after clicking Edit. After every "Update vehicle" submit, and after changing Brand, the modal re-renders with the form collapsed again. | AC "The form is visible …" ("the required-field form is shown") and AC "Submit persists and re-evaluates in place" ("the form remains visible with the saved values") | AP2497_002, 005, 006, 007 (and 001 at open) |
| F3 | An invalid submit (empty, letters, negative, too long) is rejected by the server and nothing is saved, but the field-level error is rendered **inside the collapsed form**, so the dealer sees no error at all — the modal looks exactly as before the submit, with the old values in the summary line. The error becomes visible only if the dealer clicks "Edit". | AC "Validation" ("a field-level error is shown") | AP2497_008, 009, 010, 011 |

What works: submitted values are saved and survive a reload; the eligible-program results below the form are refreshed in place from a new server response, without leaving the page; invalid input never saves anything (no partial update); no error page or HTTP 5xx anywhere.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2497_001 | Adding an extended warranty for a vehicle with no mileage shows the vehicle form | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_001-step4-FormFiveFieldsNoVehicleType_fail.png` | F1: no Vehicle type field; F2: form collapsed at open. No-mileage state could not be prepared via inventory |
| AP2497_002 | Complete vehicle shows the form with program results below it | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_002-step3-ModalFormCollapsed_fail.png` | F2: form hidden behind "Edit" when the modal opens |
| AP2497_003 | Form holds only the six fields, all editable | Medium | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_003-step5-FiveControlsNoVehicleType_fail.png` | F1: five controls, Vehicle type missing; no extra vehicle field leaked in |
| AP2497_004 | Each of the six fields is prefilled from the stored vehicle | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_004-step5-PrefillFiveOfSixNoVehicleType_fail.png` | F1: the five present fields prefill correctly; Vehicle type cannot be shown |
| AP2497_005 | Filling the mileage and submitting saves it and refreshes the results in place | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_005-step3-AfterSubmitFormCollapsedResultsRefreshed_fail.png` | F1 + F2: five fields, no Vehicle type; form collapses after submit; save and refresh work (25000 km kept after reload) |
| AP2497_006 | Correcting all six values saves every one of them | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_006-step3-AfterSubmitFormCollapsed_fail.png` | F1 + F2: Vehicle type cannot be corrected; the five others saved |
| AP2497_007 | Submitting unchanged values keeps the vehicle as it was | Medium | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_007-step3-AfterUnchangedSubmitFormCollapsed_fail.png` | F1 + F2: five fields, no Vehicle type; form collapses after submit; values unchanged after reload (failing step re-captured 2026-11-01T22:42Z) |
| AP2497_008 | Empty Year / empty Kilometers shows a field error and saves nothing | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step3-EmptyYearSubmitted_fail.png` | F3: "This value should not be blank." exists but is hidden; nothing saved |
| AP2497_009 | Letters in Year / Kilometers shows a field error and saves nothing | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step4-Km15kSubmittedNoVisibleError_fail.png` | F3 on Kilometers "15k"; Year refuses letters as typed; nothing saved (failing step re-captured 2026-11-01T22:43Z) |
| AP2497_010 | Negative Year / Kilometers shows a field error and saves nothing | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step3-NegYearSubmittedNoVisibleError_fail.png` | F3: both errors hidden; nothing saved (failing steps re-captured 2026-11-01T22:44Z) |
| AP2497_011 | A valid Model change with an invalid Year is not saved either | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step3-CamryWithEmptyYearSubmittedNoVisibleError_fail.png` | F3: Year error hidden; no partial save (Model stays Corolla, 15000 km) (failing step re-captured 2026-11-01T22:45Z) |
| AP2497_012 | Future Year and zero Kilometers handled without a server error | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_012-step5-Year2022Km0Stored_pass.png` | Q-010: 2030 rejected ("Please enter a valid year."), 0 km accepted and stored |
| AP2497_013 | 16-digit or decimal Kilometers handled, never stored altered | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_013-step5-BothRejectedKm15000_pass.png` | Q-010: both rejected with an error; 15000 kept |
| AP2497_014 | Empty Make or Model handled, never stores a value nobody entered | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_014-step5-MakeModelUnchanged_pass.png` | Q-009: empty Brand/Model rejected ("This value should not be blank."); Toyota/Corolla kept |
| AP2497_015 | After fixing the mileage, results come from a new eligibility check | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_015-step5-ResultsRefreshedFromNewCheck_pass.png` | POST /quote/6504/warranty/edit 200; its 9 programs = the 9 now shown (was 11) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data created on Dev

Every case created its own inventory vehicle (Toyota Corolla 2022, PASSENGER, Condition new, Fuel GASOLINE, Transmission Automatic, Cylinders `4`, Engine size `1.8` Litre, Designation Particular, Vehicle Price 20000 — Cylinders and Engine size are required by the inventory form and have no default, so these values were chosen) and its own client and quote. Shared vehicle 915 was not used. Nothing was deleted (the `cleanup` source is missing).

| TC | Vehicle id (VIN) | Stored km at creation | Quote | Client email | Left on the vehicle after the case |
|---|---|---|---|---|---|
| AP2497_001 | 1082 (AP2497TC001000000) | 15000 (V2 fallback) | 6490 | client.stage.970@yopmail.com | unchanged |
| AP2497_002 | 1083 (AP2497TC002000000) | 15000 | 6491 | client.stage.971@yopmail.com | unchanged; quote 6491 holds an extended warranty (Garantie de base AP, option 1, 100m/20000km, sale price 1500, no contract) |
| AP2497_003 | 1087 (AP2497TC003000000) | 15000 | 6495 | client.stage.975@yopmail.com | unchanged (not submitted) |
| AP2497_004 | 1084 (AP2497TC004000000) | 23456 (Year 2021) | 6492 | client.stage.972@yopmail.com | unchanged |
| AP2497_005 | 1085 (AP2497TC005000000) | 15000 (V2 fallback) | 6493 | client.stage.973@yopmail.com | Kilometers 25000 |
| AP2497_006 | 1086 (AP2497TC006000000) | 15000 | 6494 | client.stage.974@yopmail.com | Honda Civic 2019, 48000 km, DIESEL |
| AP2497_007 | 1088 (AP2497TC007000000) | 15000 | 6496 | client.stage.976@yopmail.com | values unchanged; re-saved with the same values by a second valid "Update vehicle" in the 2026-11-01T22:42Z re-run |
| AP2497_008 | 1089 (AP2497TC008000000) | 15000 | 6497 | client.stage.977@yopmail.com | unchanged |
| AP2497_009 | 1090 (AP2497TC009000000) | 15000 | 6498 | client.stage.978@yopmail.com | unchanged |
| AP2497_010 | 1091 (AP2497TC010000000) | 15000 | 6499 | client.stage.979@yopmail.com | unchanged |
| AP2497_011 | 1092 (AP2497TC011000000) | 15000 | 6500 | client.stage.980@yopmail.com | unchanged |
| AP2497_012 | 1093 (AP2497TC012000000) | 15000 | 6501 | client.stage.981@yopmail.com | Kilometers 0 (accepted boundary value) |
| AP2497_013 | 1094 (AP2497TC013000000) | 15000 | 6502 | client.stage.982@yopmail.com | unchanged |
| AP2497_014 | 1095 (AP2497TC014000000) | 15000 | 6503 | client.stage.983@yopmail.com | unchanged |
| AP2497_015 | 1096 (AP2497TC015000000) | 15000 (V2 fallback) | 6504 | client.stage.984@yopmail.com | Kilometers 25000 |
| Observation (no TC) | 1097 (AP2497OBS00000000) | none — made by the vehicle-first quote form | 6505 ("AP2497 obs no-km") | — | unchanged (modal opened, nothing submitted) |

Client numbers start at 970 rather than the next free number (967) to leave a gap for other tickets' runs on the same day.

---

## Step-by-Step Results

### AP2497_001 — Adding an extended warranty for a vehicle with no mileage shows the vehicle form, not only the dead-end message — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in; create vehicle V2 at `/vehicle/inventory` (add menu → `/vehicle/new/edit/PASSENGER`) with Kilometers empty | Vehicle details page opens with no mileage value | Save with Kilometers empty stayed on `/vehicle/new/edit/PASSENGER` with "Error This value should not be blank." under Kilometers. As the case's V2 fallback says, the vehicle was saved with Kilometers `15000` → `/vehicle/1082/details`, "Toyota Corolla 2022 · VIN: AP2497TC001000000 Mileage: 15000km Designation: PARTICULAR" | ✅ | V2 fallback applied: the dead-end (no mileage) state cannot be prepared through the inventory form on Dev |
| 2 `[Pre-Condition]` | Create quote → client `Warranty2497-001` → vehicle step Delivered 2026-11-01, Price 20000 | `/quote/{id}/details`, heading `#{id} - Warranty Warranty2497-001`, Extended warranty row "- None Selected -" with + | URL `/quote/6490/details`, heading "#6490 - Warranty Warranty2497-001 AP2497TC001000000"; Summary of products → "Extended warranty — - None Selected -" with + (`/quote/6490/warranty/edit`) | ✅ | The vehicle step already held 2026-11-01 and 20000; saved as is |
| 3 | Click + on the Extended warranty row | Modal opens on the same page, no error page | Modal opened; URL stayed `/quote/6490/details`; no error | ✅ | Modal content loaded by `GET /quote/6490/warranty/edit` → 200 |
| 4 `[Verification]` | Inspect the modal | Form with Year, Kilometers, Make, Model, Fuel type, Vehicle type, prefilled; results or notice below | On open the modal shows heading "Vehicle", summary "Toyota Corolla 2022 · 15000 km · GASOLINE" and an "Edit" link — no fields visible. After clicking Edit: hint "Check the vehicle information the eligible programs are based on and correct what is missing or wrong.", Brand* = Toyota, Model* = Corolla, Year* = 2022, Kilometers* = 15000, Fuel type* = GASOLINE, button "Update vehicle". **No Vehicle type field.** Below: "Program — Choose one of the available program." with 11 programs (Garantie de base AP, Garantie de base AD, Motopropulseur - AX, L'Avantageuse AT, L'Avantageuse AT-Plus, Test Program, Test Programfasdfdasfasdf, VL0730_Program_0001, test program, TestProgram, Automation Test Program), Sale price*, Save | ❌ | F1 — Vehicle type missing; F2 — fields hidden until "Edit". Q-004: Kilometers could not be observed empty here (see Observation below). Q-008: no notice shown (programs listed) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_001-step1-InventoryRefusesEmptyKm_pass.png` — the inventory form's Kilometers field with "This value should not be blank."
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_001-step3-ModalOpenSummary_pass.png` — modal as it opens: summary line and Edit link, program list below
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_001-step4-FormFiveFieldsNoVehicleType_fail.png` — form after Edit: five fields, no Vehicle type

### AP2497_002 — Adding an extended warranty for a complete vehicle shows the form with the program results below it — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (VIN AP2497TC002000000) | Details page shows Toyota Corolla 2022, 15000 km | `/vehicle/1083/details`: "VIN: AP2497TC002000000 Mileage: 15000km Designation: PARTICULAR" | ✅ | — |
| 2 `[Pre-Condition]` | Create quote, client `Warranty2497-002`, vehicle step | `/quote/{id}/details` with Extended warranty "- None Selected -" + | `/quote/6491/details`; Extended warranty "- None Selected -" with + | ✅ | — |
| 3 | Click + on Extended warranty | Modal opens, no error; the vehicle form is at the top of the modal | Modal opened, URL unchanged, no error. Top of the modal = "Vehicle" + summary "Toyota Corolla 2022 · 15000 km · GASOLINE" + "Edit" link; the form fields are **not shown** (collapsed). Program list below | ❌ | F2 — the AC says "the required-field form is shown"; the dealer must click Edit to see it |
| 4 | Select the first program and confirm; look for another warranty entry | No error; record programs, control and row | Chose "Garantie de base AP" → option 1 → radio "100m/20000km", Sale price* `1500` (required, value chosen by the executor), Save → `/quote/6491/details?type=extended`, flash "Warranty saved", row "Extended warranty — CA$1,500.00". No "Click here to create a warranty" or other warranty entry on the quote page | ✅ | Q-006: 11 programs listed (same list as AP2497_001). Q-001: no other entry point found |
| 5 `[Verification]` | Look back at the step 3 screenshot | Vehicle form above, results directly below in the same modal | The vehicle section (summary + collapsed form) sits above the "Program" results, both inside one modal | ✅ | Layout as specified; visibility of the fields is judged at step 3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_002-step3-ModalFormCollapsed_fail.png` — modal on open: only the summary line and Edit, fields hidden
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_002-step5-WarrantySavedFinalState_pass.png` — final state: "Warranty saved", row CA$1,500.00

### AP2497_003 — The extended-warranty vehicle form holds only Year, Kilometers, Make, Model, Fuel type and Vehicle type, all editable — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC003000000) | Details page; id recorded | `/vehicle/1087/details`, 15000 km | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-003` | `/quote/{id}/details` | `/quote/6495/details` | ✅ | — |
| 3 | Open the modal, enter trial values in each of the six fields (no submit) | Each of the six fields accepts its value; record control type and label | After Edit: Brand* (select) → Honda; Model* (select) → Civic; Year* (number) → 2020; Kilometers* (text) → 30000; Fuel type* (select: Choose, GASOLINE, BEV, DIESEL, HYBRID) → DIESEL — each shows the new value. **Vehicle type: no such field.** Choosing a Brand re-posts the form (`POST /quote/6495/warranty/edit`, `refresh=1`) and the form collapses again; Edit had to be clicked a second time | ❌ | F1 — only five of the six fields exist. Q-003 recorded: labels above, English UI |
| 4 | Close the modal without submitting (Escape) | Modal closes, quote page still shown | Escape closed the modal; URL `/quote/6495/details`; vehicle 1087 still Toyota Corolla 2022, 15000 km, GASOLINE | ✅ | Nothing submitted |
| 5 `[Verification]` | Count the form's input controls | Exactly six controls — Year, Kilometers, Make, Model, Fuel type, Vehicle type — and no other vehicle field | Exactly **five** controls: `quote_warranty_vehicle[make]`, `[model]`, `[year]`, `[kilometers]`, `[fuelType]`. No VIN, Price, Condition, Designation, Transmission, Engine size, Cylinders, Turbo, 4x4/AWD or manufacturer-warranty field | ❌ | F1 — Vehicle type missing; the "no full vehicle editor" part holds |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_003-step5-FiveControlsNoVehicleType_fail.png` — form with the trial values: five controls, no Vehicle type

### AP2497_004 — Each of the six form fields is prefilled with the value stored on the quote's vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle with Year 2021, Kilometers 23456 (AP2497TC004000000) | Details page; id recorded | `/vehicle/1084/details`: "Toyota Corolla 2021 · VIN: AP2497TC004000000 Mileage: 23456km Designation: PARTICULAR" | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-004` | `/quote/{id}/details` | `/quote/6492/details` | ✅ | — |
| 3 | Record the stored values on the vehicle | Year 2021, 23456 km, Toyota, Corolla, Gasoline, car type | Details page shows only make/model/year, VIN, mileage and designation. Edit page `/vehicle/1084/edit`: make Toyota, model Corolla, year 2021, kilometers 23456, fuelType GASOLINE; vehicle type PASSENGER (created through `/vehicle/new/edit/PASSENGER`; the quote's Vehicle Edit link is `/vehicle/{id}/edit/PASSENGER`) | ✅ | Fuel type and Vehicle type are not shown on the details page |
| 4 | Click + on Extended warranty | Modal with the form, no error | Modal opened; form collapsed, summary "Toyota Corolla 2021 · 23456 km · GASOLINE"; Edit clicked | ✅ | F2 also applies here (not judged by this case) |
| 5 `[Verification]` | Compare each form field with step 3 | Year 2021, Kilometers 23456, Make Toyota, Model Corolla, Fuel type Gasoline, Vehicle type = the car type | Brand = Toyota, Model = Corolla, Year = 2021, Kilometers = 23456, Fuel type = GASOLINE — all equal to the stored values. **Vehicle type: no field, so no prefill** | ❌ | F1 — five of six prefilled correctly |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_004-step5-PrefillFiveOfSixNoVehicleType_fail.png` — prefilled five fields, no Vehicle type

### AP2497_005 — Filling the missing mileage and submitting saves it and refreshes the results without leaving the modal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V2 (AP2497TC005000000), Kilometers empty | Details page with no mileage | Empty Kilometers refused again ("This value should not be blank."); saved with 15000 per the V2 fallback → `/vehicle/1085/details`, Mileage 15000km | ✅ | V2 fallback; per the design-review note the case then types a different value, **25000**, so the reload check proves the submit |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-005` | `/quote/{id}/details` | `/quote/6493/details` | ✅ | — |
| 3 | Open the modal, record results, type the mileage in Kilometers, click the submit control | URL unchanged, modal open, the form still shows the six fields with the new Kilometers, results area below; record whether results changed | Before: 11 programs; "AP Option 3" offered 12m/10000km and 12m/20000km. Typed `25000`, clicked "Update vehicle" → `POST /quote/6493/warranty/edit` 200 (AJAX). URL still `/quote/6493/details`, modal still open, summary now "Toyota Corolla 2022 · 25000 km · GASOLINE". **The form is collapsed again — its fields are hidden** (values inside: Toyota, Corolla, 2022, 25000, GASOLINE). Results refreshed: 9 programs (Test Program and Automation Test Program gone), AP Option 3 shows only 12m/20000km | ❌ | F2 — AC says "the form remains visible with the saved values"; F1 — five fields. Q-006: results changed as recorded |
| 4 | Reload, reopen the modal; open the vehicle details page | No error page; record mileage | Quote page and modal loaded, no error. `/vehicle/1085/details`: "Mileage: 25000km" | ✅ | Q-005/Q-007: the inventory vehicle itself is updated, not a quote copy |
| 5 `[Verification]` | Check Kilometers in the reopened modal | Kilometers shows the new value; the other five unchanged | Kilometers = 25000; Brand Toyota, Model Corolla, Year 2022, Fuel type GASOLINE | ✅ | Saved value survives the reload |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_005-step3-AfterSubmitFormCollapsedResultsRefreshed_fail.png` — after submit: summary 25000 km, form collapsed, shorter program list
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_005-step5-ReloadKm25000Persisted_pass.png` — after reload: Kilometers 25000

### AP2497_006 — Correcting all six vehicle values in the warranty form saves every one of them on the vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC006000000) | Details page | `/vehicle/1086/details`, 15000 km | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-006` | `/quote/{id}/details` | `/quote/6494/details` | ✅ | — |
| 3 | Replace all six fields with the corrected values and submit | URL unchanged, modal open, the form shows the six corrected values, results below | Brand → Honda re-posted the form (`refresh=1`) and collapsed it; after Edit again: Model list "Choose, (blank), Accord, Civic, Civic, CLARITY ELECTRIC, …" (Civic listed twice, one blank option); set Civic, Year 2019, Kilometers 48000, Fuel type DIESEL. **Vehicle type: no field — cannot be corrected.** "Update vehicle" → 200; URL `/quote/6494/details`, modal open, summary "Honda Civic 2019 · 48000 km · DIESEL"; **form collapsed**. No "Vehicle saved" message is visible in the modal (corrected 2026-11-01T22:47Z per review R3 F-6 — the screenshot shows only a green alert box with a × partly visible on the quote page behind the modal, top right, its text not readable; the AP2497_007 re-run showed that a "Vehicle saved" alert is rendered inside the modal's collapsed vehicle section and stays hidden). Results: Garantie de base AP (option 1 100m/20000km; AP Option 3 12m/20000km), Garantie de base AD, Motopropulseur - AX, L'Avantageuse AT, Test Programfasdfdasfasdf | ❌ | F1 + F2. Q-006 recorded |
| 4 | Reload, reopen; record the vehicle's values | No error; record values | No error. `/vehicle/1086/edit`: make Honda, model Civic, year 2019, kilometers 48000, fuelType DIESEL | ✅ | Q-005/Q-007: inventory vehicle updated |
| 5 `[Verification]` | Check the six fields after reload | Year 2019, 48000, Honda, Civic, Diesel, chosen Vehicle type | Brand Honda, Model Civic, Year 2019, Kilometers 48000, Fuel type DIESEL — all five corrected values kept. Vehicle type: no field | ✅ | The five fields that exist are all written back; the missing sixth is judged at step 3 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_006-step3-AfterSubmitFormCollapsed_fail.png` — after submit: summary Honda Civic 2019, form collapsed; no "Vehicle saved" message visible in the modal
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_006-step5-ReloadFiveCorrectedValues_pass.png` — after reload: five corrected values

### AP2497_007 — Submitting the prefilled values unchanged keeps the vehicle as it was and still shows results below the form — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC007000000) | Details page | `/vehicle/1088/details`, 15000 km | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-007` | `/quote/{id}/details` | `/quote/6496/details` | ✅ | — |
| 3 | Record the prefilled values and submit unchanged | URL unchanged, modal open, the form shows the same six values, results below | Prefill: Toyota, Corolla, 2022, 15000, GASOLINE. "Update vehicle" → 200; URL unchanged; modal open; summary "Toyota Corolla 2022 · 15000 km · GASOLINE"; 11 programs below. **Form collapsed** — values only in the summary line | ❌ | F2 (and F1: five fields) |
| 4 | Reload and reopen | No error | Loaded, no error | ✅ | — |
| 5 `[Verification]` | Check the fields | Year 2022, 15000, Toyota, Corolla, Gasoline, car type — unchanged | Brand Toyota, Model Corolla, Year 2022, Kilometers 15000, Fuel type GASOLINE — unchanged | ✅ | No drop-down fell back to its first option |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_007-step3-AfterUnchangedSubmitFormCollapsed_fail.png` — step 3, right after "Update vehicle" with unchanged values: summary only, form collapsed, 11 programs below (re-run 2026-11-01T22:42Z)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_007-step5-ValuesUnchangedAfterConfirm_pass.png` — reopened modal, values unchanged

### AP2497_008 — Submitting an empty Year or an empty Kilometers shows an error on that field and saves nothing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC008000000) | Details page | `/vehicle/1089/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-008` | `/quote/{id}/details` | `/quote/6497/details` | ✅ | — |
| 3 | Clear Year and submit | No error page; an error is shown next to Year; record whether the modal stays open | The form has `novalidate`, so the browser does not block it (Year's own validationMessage would be "Please fill out this field."). `POST /quote/6497/warranty/edit` → 200; modal stays open; it re-renders with the form collapsed and the summary still "Toyota Corolla 2022 · 15000 km · GASOLINE". The error "This value should not be blank." **is in the page under Year but hidden** (visible = false); the dealer sees no message. Visible only after clicking Edit | ❌ | F3 — the dealer gets no feedback that the save was refused |
| 4 | Reload, check Year; clear Kilometers, submit, reload | Year 2022 after reload; error next to Kilometers; no error page | After reload Year = 2022. Empty Kilometers → 200; "This value should not be blank." under Kilometers, **hidden** in the collapsed form. Reload fine | ❌ | F3 again |
| 5 `[Verification]` | Check Year and Kilometers after the last reload | Year 2022, Kilometers 15000 | Year = 2022, Kilometers = 15000 | ✅ | Nothing invalid was saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step3-EmptyYearSubmitted_fail.png` — after submitting an empty Year: no error visible, summary unchanged
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step3-YearErrorOnlyAfterEdit_fail.png` — the same modal after clicking Edit: the Year error appears
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step5-NothingSavedYear2022Km15000_pass.png` — reopened modal: 2022 / 15000

### AP2497_009 — Submitting letters in Year or in Kilometers shows an error on that field and saves nothing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC009000000) | Details page | `/vehicle/1090/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-009` | `/quote/{id}/details` | `/quote/6498/details` | ✅ | — |
| 3 | Type `abcd` in Year and submit | No error page; an error next to Year, **or** the field refuses the letters as typed | Year is a number input: typing `abcd` left it empty (value "", validationMessage "Please fill out this field."). The empty Year was submitted → 200; hidden error "This value should not be blank." under Year | ✅ | The field refused the letters — an allowed outcome. The hidden error is F3, judged at steps 4 (Kilometers) and in AP2497_008 |
| 4 | Reload, check Year; type `15k` in Kilometers, submit, reload | Year 2022; an error next to Kilometers (or letter refused); no error page | Year = 2022 after reload. Kilometers (text input) accepted `15k`; submit → 200; error "Please enter a valid number of kilometers (0 or more)." under Kilometers, **hidden** in the collapsed form. Reload fine | ❌ | F3 |
| 5 `[Verification]` | Check Year and Kilometers after the last reload | Year 2022, Kilometers 15000 | Year = 2022, Kilometers = 15000 | ✅ | Nothing non-numeric was saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step4-Km15kSubmittedNoVisibleError_fail.png` — step 4, right after submitting `15k`: no error visible, summary still 15000 km (re-run 2026-11-01T22:43Z)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step4-KmErrorOnlyAfterEdit_fail.png` — the same modal after clicking Edit: "Please enter a valid number of kilometers (0 or more)." under Kilometers `15k`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step5-NothingSavedYear2022Km15000_pass.png` — reopened modal: 2022 / 15000

### AP2497_010 — Submitting a negative Year or negative Kilometers shows an error on that field and saves nothing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC010000000) | Details page | `/vehicle/1091/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-010` | `/quote/{id}/details` | `/quote/6499/details` | ✅ | — |
| 3 | Type `-2020` in Year and submit | No error page; an error next to Year | Field accepted `-2020`; submit → 200; error "Please enter a valid year." under Year, **hidden** in the collapsed form; summary unchanged | ❌ | F3 |
| 4 | Reload, check Year; type `-500` in Kilometers, submit, reload | Year 2022; an error next to Kilometers | Year = 2022 after reload. `-500` → 200; "Please enter a valid number of kilometers (0 or more)." under Kilometers, **hidden** | ❌ | F3 |
| 5 `[Verification]` | Check Year and Kilometers after the last reload | Year 2022, Kilometers 15000 | Year = 2022, Kilometers = 15000 | ✅ | No negative value saved, minus sign not silently dropped |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step3-NegYearSubmittedNoVisibleError_fail.png` — step 3, right after submitting Year `-2020`: no error visible, summary still 2022 (re-run 2026-11-01T22:44Z)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step3-YearErrorOnlyAfterEdit_fail.png` — after Edit: "Please enter a valid year." under Year `-2020`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step4-NegKmSubmittedNoVisibleError_fail.png` — step 4, right after submitting Kilometers `-500`: no error visible, summary still 15000 km
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step4-KmErrorOnlyAfterEdit_fail.png` — after Edit: "Please enter a valid number of kilometers (0 or more)." under Kilometers `-500`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step5-NothingSavedYear2022Km15000_pass.png` — reopened modal: 2022 / 15000

### AP2497_011 — A valid Model change submitted together with an invalid Year is not saved either — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC011000000) | Details page | `/vehicle/1092/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-011` | `/quote/{id}/details` | `/quote/6500/details` | ✅ | — |
| 3 | Set Model `Camry`, Kilometers `30000`, Year `abcd`, submit | No error page; an error next to Year | Model → Camry (no re-post), Kilometers 30000. Year refused the letters (value empty), so per the case an **empty Year** was submitted. → 200; "This value should not be blank." under Year, **hidden** in the collapsed form | ❌ | F3 |
| 4 | Reload and reopen | No error | Loaded, no error | ✅ | — |
| 5 `[Verification]` | Check Year, Model, Kilometers | Year 2022, Model Corolla, Kilometers 15000 | Year = 2022, Model = Corolla, Kilometers = 15000 | ✅ | No partial update persisted |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step3-CamryWithEmptyYearSubmittedNoVisibleError_fail.png` — step 3, right after submitting Model Camry, Kilometers 30000, empty Year: no error visible, summary still Corolla 2022 · 15000 km (re-run 2026-11-01T22:45Z)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step3-YearErrorOnlyAfterEdit_fail.png` — after Edit: "This value should not be blank." under the empty Year; Camry and 30000 still in the form
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step5-NoPartialSave_pass.png` — reopened modal: Corolla / 2022 / 15000

### AP2497_012 — A future Year and zero Kilometers are handled without a server error and stored exactly as entered if accepted — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC012000000) | Details page | `/vehicle/1093/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-012` | `/quote/{id}/details` | `/quote/6501/details` | ✅ | — |
| 3 | Year `2030`, submit, reload, record Year | No error page; record error and Year (Q-010) | → 200; error "Please enter a valid year." under Year (hidden in the collapsed form). After reload Year = 2022 | ✅ | Q-010: a future year is rejected |
| 4 | Kilometers `0`, submit, reload, record | No error page; record error and Kilometers (Q-010) | → 200; no error; summary "Toyota Corolla 2022 · 0 km · GASOLINE". After reload Kilometers = 0 | ✅ | Q-010: zero km is accepted |
| 5 `[Verification]` | Compare with what was entered | Year 2030 or 2022; Kilometers 0 or 15000, never anything else | Year 2022 (rejected), Kilometers 0 (accepted, stored exactly) | ✅ | Record-only case; no objective fault |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_012-step5-Year2022Km0Stored_pass.png` — reopened modal: 2022 / 0

### AP2497_013 — A 16-digit or decimal Kilometers value is handled without a server error and never stored altered — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC013000000) | Details page | `/vehicle/1094/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-013` | `/quote/{id}/details` | `/quote/6502/details` | ✅ | — |
| 3 | Kilometers `1234567890123456`, submit, reload | No error page; record | → 200; error "This value is too long. It should have 15 characters or less." under Kilometers (hidden). Quote page reload 200; Kilometers = 15000 | ✅ | Q-010: rejected by length, no server error |
| 4 | Kilometers `1500.5`, submit, reload | No error page; record | → 200; error "Please enter a valid number of kilometers (0 or more)." (hidden). After reload Kilometers = 15000 | ✅ | Q-010: decimals rejected |
| 5 `[Verification]` | Compare with what was entered | 16 digits accepted or 15000; 1500.5/1500/1501 or previous value; never 15005 | 15000 after both (rejected both times) | ✅ | Never stored altered |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_013-step5-BothRejectedKm15000_pass.png` — reopened modal: 15000

### AP2497_014 — Submitting with Make or Model emptied is handled without a server error and never stores a value nobody entered — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V1 (AP2497TC014000000) | Details page | `/vehicle/1095/details` | ✅ | — |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-014` | `/quote/{id}/details` | `/quote/6503/details` | ✅ | — |
| 3 | Choose Brand's empty option "Choose", submit, reload | No error page; record | Choosing "Choose" re-posts the form (`refresh=1`, 200) and also empties Model. Submit → 200; "This value should not be blank." under Brand and under Model (hidden). After reload Brand Toyota, Model Corolla | ✅ | Q-009: Brand (Make) is validated as required |
| 4 | Choose Model's "Choose", submit, reload | No error page; record | No re-post on Model change. Submit → 200; "This value should not be blank." under Model (hidden). After reload Model Corolla | ✅ | Q-009: Model is validated as required |
| 5 `[Verification]` | Compare Make/Model with creation values | Toyota or empty; Corolla or empty | Toyota / Corolla | ✅ | No value nobody entered was stored |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_014-step5-MakeModelUnchanged_pass.png` — reopened modal: Toyota / Corolla

### AP2497_015 — After fixing the missing mileage, the results below the form come from a new eligibility check, not the old screen — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle V2 (AP2497TC015000000), Kilometers empty | Details page with no mileage | Empty Kilometers refused ("This value should not be blank."); saved with 15000 per the V2 fallback → `/vehicle/1096/details` | ✅ | V2 fallback; the case then types **25000** (design-review note) |
| 2 `[Pre-Condition]` | Create quote `Warranty2497-015` | `/quote/{id}/details` | `/quote/6504/details` | ✅ | — |
| 3 | Open the modal; record the results and the network-log position | Modal with form and results; recorded | Before: 11 programs (Garantie de base AP, Garantie de base AD, Motopropulseur - AX, L'Avantageuse AT, L'Avantageuse AT-Plus, Test Program, Test Programfasdfdasfasdf, VL0730_Program_0001, test program, TestProgram, Automation Test Program); visible terms 100m/20000km, 12m/10000km, 12m/20000km. Response listener attached at this point | ✅ | — |
| 4 | Type the mileage, submit, wait | No error; URL unchanged; modal open | Typed 25000 → "Update vehicle"; URL `/quote/6504/details`; modal open (1 `.modal.show`) | ✅ | — |
| 5 `[Verification]` | Read the network entries after step 3 and the results area | A request after the submit returned 2xx and its programs match the results now shown | `POST /quote/6504/warranty/edit` → 200 `text/html`, 83 KB, containing "25000 km" and 9 programs: Garantie de base AP, Garantie de base AD, Motopropulseur - AX, L'Avantageuse AT, L'Avantageuse AT-Plus, Test Programfasdfdasfasdf, VL0730_Program_0001, test program, TestProgram. The modal now shows exactly those 9; visible terms 100m/20000km, 12m/20000km | ✅ | Results come from the new check; they differ from step 3 (Test Program, Automation Test Program and the 12m/10000km term dropped) — Q-006 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_015-step5-ResultsRefreshedFromNewCheck_pass.png` — modal after submit: summary 25000 km, 9 programs

---

## Blocked / Skipped Test Cases

None.

---

## Environment Observations

- **Observation — the real dead-end state (not a test case).** The inventory add form on Dev refuses an empty Kilometers, so AP2497_001, 005 and 015 ran on the V2 fallback (15000 km). To see the ticket's actual scenario, one vehicle without mileage was made through the vehicle-first quote form `/quote/new/edit-vehicle` (quote 6505 "AP2497 obs no-km", vehicle 1097, VIN AP2497OBS00000000, Toyota Corolla 2022; "Décoder" not clicked). Opening the Extended warranty "+" there shows the form **already expanded** (all five fields visible): Brand Toyota, Model Corolla, Year 2022, **Kilometers empty**, **Fuel type "Choose"**, "Update vehicle", and below it the notice "There are no eligible program for the vehicle. Please contact us for more information." (Q-004: empty field, no placeholder, no immediate error; Q-008: the notice text is unchanged). Vehicle type is absent there too. Nothing was submitted. Screenshot: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_obs-NoKmVehicleFormOpen_pass.png`. In that modal the Brand list also contains RV/boat makes (e.g. Airstream, Bayliner) that the inventory PASSENGER form does not list.
- **Form mechanics (Dev):** form `quote_warranty_vehicle[...]` is posted by AJAX to `/quote/{id}/warranty/edit` (200, HTML that replaces the modal body); changing Brand posts the same form with `refresh=1` to reload the Model list, which re-renders the modal and collapses the form. Server-side validation messages seen: "This value should not be blank.", "Please enter a valid year.", "Please enter a valid number of kilometers (0 or more).", "This value is too long. It should have 15 characters or less.".
- **Saving changes the inventory vehicle itself** (Q-007): vehicles 1085, 1086, 1093, 1096 show the values submitted in the modal on their own details/edit pages.
- The Honda Model list in the modal has a blank option and "Civic" twice (AP2497_006). Not judged by any case.
- No error page, HTTP 5xx or console error tied to the feature was seen. None of the known Dev defects (AP-2518, AP-2512, AP-2519, AP-2507) was hit.
- The browser session was English (`?_locale=en` on the login page) and in-memory only; it was closed at the end of the run.

---

## Re-run — failing-step evidence for AP2497_007, 009, 010, 011 (review R3 round 1, F-1)

**When:** 2026-11-01T22:41Z → 2026-11-01T22:46Z (real clock, `date -u`) · **Environment: Dev (v2dev)**; v2staging was not opened · dealer portal, shared dealer account from the `env` source (Dev section), `?_locale=en` · Chromium (Playwright MCP), viewport 1280 × 800.
**Scope:** step s4 only, for AP2497_007 step 3, AP2497_009 step 4, AP2497_010 steps 3–4 and AP2497_011 step 3, on the existing quotes from the first run. No other case was re-run and no new vehicle, client or quote was created. Steps 1–2 (pre-conditions) were not repeated: each quote heading and vehicle link were checked against the log's mapping before the step.

| TC | Quote → vehicle (checked) | Step re-run | What was done | Re-run result | Same as first run? |
|---|---|---|---|---|---|
| AP2497_007 | 6496 → 1088 ("#6496 - Warranty Warranty2497-007 AP2497TC007000000", 15000 km) | 3 | + opened the modal collapsed (summary "Toyota Corolla 2022 · 15000 km · GASOLINE" + Edit). After Edit: Brand Toyota, Model Corolla, Year 2022, Kilometers 15000, Fuel type GASOLINE; no Vehicle type. "Update vehicle" clicked without changes → `POST /quote/6496/warranty/edit` 200 | URL `/quote/6496/details`, 1 modal open, summary unchanged, 11 programs below. **Form collapsed** (all five inputs hidden). A "Vehicle saved" alert is in the modal's vehicle section but hidden with the form | Yes — ❌ (F1 + F2) |
| AP2497_009 | 6498 → 1090 (15000 km) | 4 | Year 2022 before the step. Kilometers `15k` → "Update vehicle" → `POST /quote/6498/warranty/edit` 200 | Modal open, summary still "… 15000 km …", 11 programs; error "Please enter a valid number of kilometers (0 or more)." in the page under Kilometers but **hidden** (form collapsed). Visible only after Edit. After reload the quote shows "Mileage: 15000km" | Yes — ❌ (F3) |
| AP2497_010 | 6499 → 1091 (15000 km) | 3 | Year `-2020` (accepted by the input) → "Update vehicle" | Modal open, summary still "… 2022 …"; "Please enter a valid year." **hidden** in the collapsed form; visible only after Edit. The status of this POST was not read in the re-run (the network list was cleared by the next navigation) | Yes — ❌ (F3) |
| AP2497_010 | 6499 → 1091 | 4 | Reload → Year 2022, Kilometers 15000. Kilometers `-500` → "Update vehicle" → `POST /quote/6499/warranty/edit` 200 | "Please enter a valid number of kilometers (0 or more)." **hidden**; visible only after Edit. After reload "Toyota Corolla 2022 · Mileage: 15000km" | Yes — ❌ (F3) |
| AP2497_011 | 6500 → 1092 (Toyota Corolla 2022, 15000 km) | 3 | Model → Camry, Kilometers → 30000; typing `abcd` in Year left it at `2022` (number input refuses letters), so, as the case says, Year was cleared and an **empty Year** submitted → `POST /quote/6500/warranty/edit` 200 | Summary still "Toyota Corolla 2022 · 15000 km · GASOLINE", 11 programs; "This value should not be blank." under Year **hidden**; visible only after Edit (form still holds Camry / 30000 / empty Year). After reload "Toyota Corolla 2022 · Mileage: 15000km" — no partial save | Yes — ❌ (F3) |

**Result:** every re-run matches the first run. No case result, step status or count changes: 15 cases, 4 PASS, 11 FAIL, 0 BLOCKED (27 %). The first-run note that AP2497_011's Year "refused the letters (value empty)" was seen slightly differently this time: typing letters left the earlier value `2022` in place instead of emptying the field. The submitted value was empty both times, so this changes nothing.

**Screenshots added** (each failing step: right after the submit, and for 009–011 again after clicking Edit, as AP2497_008 does):
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_007-step3-AfterUnchangedSubmitFormCollapsed_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step4-Km15kSubmittedNoVisibleError_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step4-KmErrorOnlyAfterEdit_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step3-NegYearSubmittedNoVisibleError_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step3-YearErrorOnlyAfterEdit_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step4-NegKmSubmittedNoVisibleError_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step4-KmErrorOnlyAfterEdit_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step3-CamryWithEmptyYearSubmittedNoVisibleError_fail.png`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step3-YearErrorOnlyAfterEdit_fail.png`

**What the re-run changed on Dev:** the valid unchanged submit in AP2497_007 saved inventory vehicle **1088** again. Its values are unchanged, as `/vehicle/1088/edit` showed afterwards: Toyota, Corolla, 2022, 15000, GASOLINE. The refused submits in 009, 010 and 011 saved nothing: vehicles 1090, 1091 and 1092 still show Toyota Corolla 2022, 15000 km. No other data was created or changed.

**Other review fixes applied in this pass (no re-run):**
- R3 F-2: "F1" added to the Result Overview comments of AP2497_005 and AP2497_007.
- R3 F-6: AP2497_006 step 3 no longer claims a visible "Vehicle saved" alert, because its screenshot shows none in the modal. AP2497_006 was not re-run.
- Result Overview screenshot cells for AP2497_007, 009, 010 and 011 now point to the failing-step image. The step-5 images stay listed under each case.
- Not addressed here (outside this re-run's scope): R3 F-3 "(fallback)" status notes, F-4, F-5 and F-7.

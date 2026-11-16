# Execution Log — AP-2477 Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill (re-test after fix)

> Written by the **stlc-manual-executor** skill (pipeline stage s4, dispatched by the QA orchestrator as an `stlc-worker`). Inputs:
> `qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md`,
> `qa-artifacts/3-test-cases/AP2477_TestCases_011-012.md`.
>
> **Why this run happened.** Orchestrator plan rule P5 (retest after fix). The previous run (2026-11-01, `execution-log_AP-2477_2026-11-01.md`) ended FAIL: AP2477_007 failed because clicking "Décoder" saved a quote and emptied the form, filed as **AP-2507**; AP2477_008 and AP2477_009 were blocked by it. AP-2507 is now in **QC** (Ken Nguyen, 2026-11-03; Minh Lưu says it is fixed). The whole set of 12 cases was re-executed on the current Dev build. Every case status was reset to `Not Run` first, with a Revisions row in each test-case file. The 2026-11-01 log is kept unchanged for the record.

---

## Execution Summary

**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker)
**Date:** 2026-11-07
**Base URL:** https://v2dev.garantieavantageplus.ca/ (Dev, v2dev) — Dealer portal. Staging was not opened.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 09:47 → 09:58 (UTC)
**Account:** the dealer account from the `env` source, *Dev Environment* section (`DEALER_USERNAME` / `DEALER_PASSWORD`), typed into the login form only. It signed in as "Test QA staging" (Dealer ID 1380).

| Metric | Value |
|---|:---:|
| Total test cases | 12 |
| Passed | 11 |
| Failed | 1 |
| Blocked | 0 |
| Skipped | 0 |
| Not Run | 0 |
| **Pass rate** | **91.7% (11 of 12)** |

**Environment check:** passed. The tracker preflight and the environment health check were done by the orchestrator at 2026-11-07T09:45Z (Dev `/login` and `/admin/login` answered 200) and were not repeated. The dealer login landed on the Dashboard `/`. One console error on the login page did not affect anything.

**Build check: passed — the AP-2477 build is on Dev.** `/quotes` → "Create a quote" (`/quote`) redirects to `/quote/new/edit-vehicle`, heading "Create a quote". Neither Price nor Kilometers is shown. Footer "Avantage Plus System v2.0.0".

### The two results the orchestrator asked for

- **AP2477_007 — the AP-2507 scenario: ✅ PASS.** Clicking "Décoder" with VIN `1FAHP35NX8W239204` now re-posts the form by AJAX (`POST /quote/new/edit-vehicle` → **200**, no redirect) and re-renders it in place, pre-filled: VIN kept, Brand **Ford**, Model **Focus**, Year **2008**, no error, still only the vehicle fields. **No quote was saved by the decode**: the next quote saved by this run got id 6588, directly after the baseline 6587, and the three decodes made in this run (AP2477_007, 008, 009) left no quote of their own (quotes 6588–6592 are all accounted for below). The AP-2507 fault is not reproduced on this build. AP-2507 itself was not changed in Jira — its own re-test is designed separately.
- **Cases tied to AP-2492** — AP-2492 is "the simplified new-quote vehicle form is missing on **staging** (`/quote/new/edit-vehicle` returns HTTP 404)", filed against **AP2477_001** and blocking AP2477_001–012 on staging on 2026-10-12. This run executes on **Dev only** (`execution_env: Dev`), so the AP-2492 condition was **not re-tested**: staging was not opened and AP-2492 stays as filed (Backlog, High). On Dev, AP2477_001 **PASSED** and the whole set ran — the form exists on Dev. The developer comment of 2026-10-28 on AP-2477 ("the feature is not ready for staging yet") still applies.

### Differences between the test cases and the live UI (the live page wins)

AP-2533 ("Update quote form UI", in QC) has changed the form since 2026-11-01. Recorded as seen; no case was failed for these, and correct-cases follows the reviewer's Gate C:

1. **The vehicle type selector moved into the form.** It is now a labelled select "Vehicle type" (`#vehicle_type_switch`, no `name`, so it is not submitted) at the **top of the form card, above Quote name**. The cases (Execution Context and AP2477_001 step 3) describe it as a "menu at the top right" and say Quote name is at the top. Choosing a type navigates to `/quote/new/edit-vehicle/{TYPE}` as before. AP2477_001 counts the five vehicle fields below it.
2. **Input ids and names.** Quote name `#quote_vehicle_quote_name`, VIN `#quote_vehicle_VIN` (class `vinlookup`), field names `quote_vehicle[...]`; Brand `#vehicle_make`, Model `#vehicle_model`, Year `#vehicle_year` (cases expect `#vehicle_quote_name` / `#vehicle_VIN`, unchanged since 2026-11-01).
3. **English dealer UI** ("Quote name", "VIN", "Brand*", "Model*", "Year*", "Save", heading "Create a quote"); only the decoder button keeps the French label "Décoder" — as on 2026-11-01.
4. **The quotes list** `/quotes` now shows the quote name in the Vehicle column (with "-" under Client) and opens rows through `data-href` cells, not links. *(Corrected 2026-11-07 per R3 finding F-3: the first version of this line said "Client column"; the screenshot AP2477_009-step4-QuotesListNewest6592NoDecodeQuotes-20261107_pass.png shows the Vehicle column.)*
5. The Execution Context of every file still names v2staging; this batch runs on Dev by the user's decision.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_001-step3-FiveFieldsTypeSelectInForm-20261107_pass.png` | Five fields in order; Vehicle type select now sits above Quote name (AP-2533 layout) |
| AP2477_002 | Only Brand, Model and Year carry the required marker; Quote name and VIN do not | Medium | ✅ | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_002-step2-RequiredMarkersBrandModelYear-20261107_pass.png` | Stars and `required` only on Brand, Model, Year |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-QuotesListNewest6588-20261107_pass.png` | Quote 6588 / vehicle 1143, newest row |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleEdit1144PriceKmEmpty-20261107_pass.png` | Vehicle 1144: price, km empty; no condition; designation blank on details |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-step2-BrandModelBlankRefused-20261107_pass.png` | Server refused at Brand and Model; no quote |
| AP2477_006 | Saving with Brand and Model but no Year is refused with an error and no quote is created | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_006-step2-YearBlankRefused-20261107_pass.png` | Server refused at Year; Toyota/Corolla kept; no quote |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year on the simplified form | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodePrefillsFordFocus2008-20261107_pass.png` | AP-2507 scenario: form re-rendered with Ford/Focus/2008; no quote saved |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo on its vehicle | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_008-step4-Vehicle1146EngineUnitLitreNotKW-20261107_fail.png` | Engine size unit decoded "kW" but stored "Litre"; other decoded values kept |
| AP2477_009 | A Quote name typed before clicking "Décoder" is still there afterwards and is saved with the quote | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_009-step4-Quote6592NameSaved-20261107_pass.png` | Name kept across decode; quote 6592 saved with it |
| AP2477_010 | The "Décoder" button shows for a car type but not for an RV, boat or construction type | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step5-RvClassANoDecoder-20261107_pass.png` | Passenger has it; RV CLASS A does not |
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step3-PriceKmBlankRefused-20261107_pass.png` | Server refused blank Price and Kilometers; nothing added |
| AP2477_012 | A quote created from the minimal form opens its details and warranty step without an error page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step4-WarrantyModalAsksKmFuel-20261107_pass.png` | Quote 6590 loads twice; warranty modal asks Km/Fuel type |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

Execution order: High first (001, 007, 003, 004, 012, 008), then Medium (002, 009, 005, 006, 010, 011). AP2477_002 was read on the same page load as AP2477_001.

---

## Step-by-Step Results

### AP2477_001 — The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in as the dealer, open `/quotes` | Quotes list with "Create a quote" | URL = /quotes; heading = "Quotes"; link "Create a quote" (href `/quote`) visible; newest row = quote 6587 (Toyota Corolla 2022, Nov 4, 2026) | ✅ | Baseline 6587 noted for the whole run |
| 2 | Click "Create a quote"; type Passenger | Form at `/quote/new/edit-vehicle` | `/quote` redirected to `/quote/new/edit-vehicle`; heading = "Create a quote"; select "Vehicle type" = "Passenger" | ✅ | The type selector is now inside the form (AP-2533) |
| 3 `[Verification]` | List every visible label and control, top to bottom | Exactly five fields in order (Quote name, VIN with "Décoder", Brand, Model, Year), then Save; no removed field visible | Visible labels top to bottom: "Vehicle type" (select, value "Passenger", no `name`, not submitted), "Quote name", "VIN" (help text "Enter the VIN and click search to pre-fill the vehicle info" and a "Décoder" button), then "Brand*", "Model*", "Year*" on one row, then "Save". No Price, Kilometers, Condition, Designation, transmission, engine size, unit, cylinders, fuel, turbo, 4x4/AWD or manufacturer-warranty block. Hidden inputs: `quote_vehicle[transmission]` = "automatic", `quote_vehicle[engineSizeUnit]` = "l", `quote_vehicle[id]` = "" and the form token | ✅ | The five vehicle fields and their order match; the only difference is the Vehicle type select, which is the type menu the case names in step 2, now placed above Quote name. Recorded for Gate C / correct-cases, not failed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_001-step3-FiveFieldsTypeSelectInForm-20261107_pass.png` — the full "Create a quote" form: Vehicle type, Quote name, VIN + Décoder, Brand*/Model*/Year*, Save

### AP2477_002 — Only Brand, Model and Year carry the required marker — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form with type Passenger | Form shown | Form shown at `/quote/new/edit-vehicle` (same load as AP2477_001) | ✅ | — |
| 2 `[Verification]` | Read labels, `*` markers and `required` attributes | Only Brand*, Model*, Year* starred and required; Quote name and VIN not | Labels with class `required` (star shown): "Brand", "Model", "Year". Inputs with `required`: `#vehicle_make`, `#vehicle_model`, `#vehicle_year`. "Quote name" (`#quote_vehicle_quote_name`) and "VIN" (`#quote_vehicle_VIN`) show no star and `required` = false. "Vehicle type" select: no star, not required | ✅ | Matches the ticket's Assumptions (Q-003) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_002-step2-RequiredMarkersBrandModelYear-20261107_pass.png` — stars only on Brand, Model and Year

### AP2477_003 — Saving with only Brand, Model and Year creates the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes`, note the newest quote | Quotes list shown | Newest row `/quote/6587/details` (Toyota Corolla 2022, AP-2497 data) | ✅ | Baseline |
| 2 | "Create a quote" (Passenger), Quote name and VIN empty, Brand Toyota, Model Corolla, Year 2020 → "Save" | Submits with no validation message and no HTTP 500 / error page | Choosing Toyota reloaded the Model list (30 options incl. Corolla). Save went to `/quote/6588/details` with the green banner "Vehicle saved"; no validation message, no error page | ✅ | A second blue alert "No entities found" also shows on the details page — not an error page; noted |
| 3 `[Verification]` | Read URL, heading, vehicle; open `/quotes`, read newest row | On `/quote/{id}/details` with Toyota Corolla 2020; new quote is newest, above step-1 row | URL `/quote/6588/details`; heading "#6588 -"; vehicle card "Toyota Corolla 2020", "VIN:" blank, "Mileage: km", "Designation:" blank; vehicle id **1143**. `/quotes` newest row = `/quote/6588/details` "Toyota Corolla 2020 VIN: - Nov 7, 2026", directly above 6587 | ✅ | 6588 = 6587 + 1 also proves the AP2477_007 decode saved nothing |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-Quote6588DetailsToyotaCorolla-20261107_pass.png` — quote 6588 details with "Vehicle saved"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-QuotesListNewest6588-20261107_pass.png` — quotes list, 6588 newest

### AP2477_004 — A vehicle saved from the minimal form has no kilometres, condition, designation or price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | "Create a quote", Quote name `QA-AP2477-004-095118`, VIN empty, Toyota / Corolla / 2020 → "Save" | `/quote/{id}/details` opens | `/quote/6589/details`, banner "Vehicle saved". The quote name typed first was still in the field after the Brand AJAX reload | ✅ | Quote 6589 |
| 2 | Open the quote's vehicle | Vehicle details or edit page for Toyota Corolla 2020 | Vehicle card links `/vehicle/1144/details` ("Toyota Corolla 2020") and `/vehicle/1144/edit` (heading "Vehicle #1144"); both opened read-only, nothing saved | ✅ | Vehicle 1144 |
| 3 `[Verification]` | Read Kilometers, Condition, Designation, Price; confirm the quote name | All four blank; quote shows the name | Details `/vehicle/1144/details`: "Mileage: km" (no number), "Designation:" blank. Edit form `/vehicle/1144/edit`: Vehicle Price = "", Kilometers = "", Condition: no option has the `selected` attribute (box displays its first option "new"), Designation displays "Particular" (the edit form's default, as on 2026-11-01; the stored designation shown on the details page is blank). Quote heading "#6589-QA-AP2477-004-095118" | ✅ | Same edit-form default observation as 2026-11-01 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-Quote6589NameShown-20261107_pass.png` — quote 6589 heading with the name
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleDetails1144Blank-20261107_pass.png` — vehicle 1144 details: Mileage and Designation blank
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleEdit1144PriceKmEmpty-20261107_pass.png` — vehicle 1144 edit form (not saved): Price and Kilometers empty

### AP2477_005 — Saving without a Brand is refused — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes`, note the newest quote | Quotes list shown | Newest row `/quote/6592/details` (QA-AP2477-009-095457) | ✅ | Baseline 6592 |
| 2 | "Create a quote", Quote name `QA-AP2477-005-095539`, VIN empty, Brand and Model on "Choose", Year 2020 → "Save" | Refused with a message at Brand (and Model); no HTTP 500 | Page stayed on `/quote/new/edit-vehicle` with "ERROR This value should not be blank." under **Brand** and under **Model**; Quote name and Year 2020 kept; no error page. Refused by the **server** (the browser also reports "Please select an item in the list." on both selects but does not block the post) | ✅ | Server-side validation |
| 3 `[Verification]` | Open `/quotes`, read the newest row | Still the step-1 row; no `QA-AP2477-005-…` quote | Newest row still `/quote/6592/details`; "QA-AP2477-005" appears nowhere on the list | ✅ | Read after AP2477_006 ran too (one check for both) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-step2-BrandModelBlankRefused-20261107_pass.png` — the refused form, errors at Brand and Model
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-006-step3-NoNewQuoteNewest6592-20261107_pass.png` — quotes list, newest still 6592

### AP2477_006 — Saving with Brand and Model but no Year is refused — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes`, note the newest quote | Quotes list shown | Newest row `/quote/6592/details` (unchanged after AP2477_005) | ✅ | Baseline 6592 |
| 2 | "Create a quote", Quote name `QA-AP2477-006-095558`, VIN empty, Toyota / Corolla, Year empty → "Save" | Refused at Year; no HTTP 500; Brand and Model keep values | Stayed on `/quote/new/edit-vehicle` with "ERROR This value should not be blank." under **Year** only; Brand "Toyota", Model "Corolla", Quote name kept; no error page. Refused by the server | ✅ | — |
| 3 `[Verification]` | Open `/quotes`, read the newest row | Still the step-1 row; no `QA-AP2477-006-…` quote | Newest row still `/quote/6592/details`; "QA-AP2477-006" appears nowhere on the list | ✅ | Nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_006-step2-YearBlankRefused-20261107_pass.png` — the refused form: error at Year, Toyota / Corolla kept
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-006-step3-NoNewQuoteNewest6592-20261107_pass.png` — quotes list, newest still 6592

### AP2477_007 — Clicking "Décoder" fills Brand, Model and Year (AP-2507 scenario) — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form with type Passenger | VIN with "Décoder"; Brand and Model on "Choose" | VIN `#quote_vehicle_VIN` has class `vinlookup` and a "Décoder" button; Brand and Model show "Choose"; `quote_vehicle[id]` empty | ✅ | — |
| 2 | Type `1FAHP35NX8W239204` in VIN, leave Brand on "Choose", click "Décoder", wait | Form reloads in place without an error page | The page sent `POST /quote/new/edit-vehicle` by AJAX (body: quote name, VIN, token, `quote_vehicle[novalidate]=true`) → **200**, no redirect. The URL stayed `/quote/new/edit-vehicle`; the form re-rendered in place with no message and no error | ✅ | AP-2507 (decode saved quote 6437 and emptied the form on 2026-11-01) is **not reproduced** |
| 3 `[Verification]` | Read VIN, Brand, Model, Year and the visible fields | VIN kept; Brand Ford, Model Focus, Year 2008; still only five fields | VIN = "1FAHP35NX8W239204"; Brand = "Ford"; Model = "Focus"; Year = "2008". Visible labels: Vehicle type, Quote name, VIN, Brand, Model, Year, then Save — no decoded extra is displayed. Hidden inputs now hold transmission "automatic", cylinders "4", engineSize "2", engineSizeUnit "kW", fuelType "GASOLINE", id "863". No quote was created: the next save in this run became 6588 (baseline 6587) | ✅ | `quote_vehicle[id]` = 863 is an existing inventory vehicle with this VIN (Ford Focus 2008, 20000 km). Saving after a decode did not use or change it (see AP2477_008) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodePrefillsFordFocus2008-20261107_pass.png` — the re-rendered form: VIN kept, Ford / Focus / 2008, Save still available

### AP2477_008 — A quote saved after decoding keeps the decoded details — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fresh form; VIN `1FAHP35NX8W239204`, Brand on "Choose", "Décoder"; read hidden inputs | Ford / Focus / 2008 filled; hidden inputs hold decoded values (fuel type non-empty) | Brand Ford, Model Focus, Year 2008. Hidden: transmission = "automatic", cylinders = "4", engineSize = "2", engineSizeUnit = "kW", fuelType = "GASOLINE", id = "863". No turbo / 4x4 / AWD hidden input exists | ✅ | Values noted (also in the .txt evidence) |
| 2 | Enter Quote name `QA-AP2477-008-095303` → "Save" | Quote details page opens without error; record id | `/quote/6591/details`, heading "#6591-QA-AP2477-008-095303", banner "Vehicle saved", vehicle "Ford Focus 2008", VIN 1FAHP35NX8W239204 | ✅ | Quote 6591 |
| 3 | Open the quote's vehicle | Vehicle page for Ford Focus 2008 | Vehicle card links `/vehicle/1146/details` and `/vehicle/1146/edit` (heading "Vehicle #1146"), opened read-only. A **new** vehicle 1146 was created; the decoded `id` 863 was not used | ✅ | Vehicle 863 re-read at 09:57Z: unchanged (price 20000.00, km 20000, engine size "l", unit "l") |
| 4 `[Verification]` | Read Transmission, Fuel type, Engine size and unit, Cylinders, Turbo; VIN; Km, Condition, Designation, Price | Each holds the value noted in step 1; VIN shown; Km, Condition, Designation, Price blank | Fuel type = GASOLINE ✓, Transmission = Automatic ✓, Cylinders = 4 ✓, Engine size = 2 ✓, **Engine size unit = "Litre" (`l`, option carries `selected`) — step 1 noted "kW"** ✗, Turbo engine / 4x4 / AWD unticked (no decoded value to compare). VIN = 1FAHP35NX8W239204 ✓. Vehicle Price = "", Kilometers = "", Condition = no option selected (shows "new"), Designation = "Particular" on the edit form / blank on the details page | ❌ | The decoded engine-size unit is not what was stored: the form carried "kW" at save time, the vehicle holds "Litre". Either the save drops the decoded unit and falls back to the default, or the decoder's "kW" is wrong for this gasoline 2.0 engine — the developer must say which. A dealer could get the wrong unit on a decoded vehicle (for an electric vehicle, a decoded kW figure would be stored as litres) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_008-step2-Quote6591FordFocus2008-20261107_pass.png` — quote 6591 details with the name and Ford Focus 2008
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_008-step4-Vehicle1146EngineUnitLitreNotKW-20261107_fail.png` — vehicle 1146 edit form (not saved): Engine size 2, Engine size unit **Litre**, Price and Kilometers empty
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_008-step1-4-DecodedVsStoredValues-20261107_fail.txt` — the hidden values read before saving (kW) next to the stored values, plus the request lines (method, URL, status only); a screenshot cannot show hidden inputs

### AP2477_009 — Quote name survives "Décoder" — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form | Form shown | Fresh `/quote/new/edit-vehicle`, type Passenger | ✅ | — |
| 2 | Type `QA-AP2477-009-095457` in Quote name, VIN `1FAHP35NX8W239204`, Brand on "Choose", "Décoder", wait | Ford / Focus / 2008 filled | Brand = "Ford", Model = "Focus", Year = "2008" after the AJAX re-render (POST → 200) | ✅ | — |
| 3 | Read Quote name; "Save" | Quote name still holds the value; details page opens | Quote name = "QA-AP2477-009-095457" after the decode. Save → `/quote/6592/details`, vehicle 1147 (new) | ✅ | Q-004 answered by the build: the name survives the decode |
| 4 `[Verification]` | Read the name on the details page and on the newest `/quotes` row | Both show `QA-AP2477-009-095457` | Heading "#6592-QA-AP2477-009-095457"; `/quotes` newest row `/quote/6592/details` "QA-AP2477-009-095457 Ford Focus 2008 VIN: 1FAHP35NX8W239204 - Nov 7, 2026" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_009-step3-NameKeptAfterDecode-20261107_pass.png` — the decoded form with the quote name still filled
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_009-step4-Quote6592NameSaved-20261107_pass.png` — quote 6592 heading with the name
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_009-step4-QuotesListNewest6592NoDecodeQuotes-20261107_pass.png` — quotes list 6592 → 6588, no stray decode quote

### AP2477_010 — "Décoder" shows only for car types — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create a quote" | Form shown | Form shown, Vehicle type "Passenger" | ✅ | — |
| 2 | Open the type menu, record types; choose Passenger | Type list recorded | The "Vehicle type" select lists 23 types: 3 wheels, 5TH WHEEL, ATV / UTV, Boat, Camion Lourd, eBike, Heavy Duty, LEISURE, Motorcycle, Passenger, PWC, RV CLASS A, RV CLASS B, RV CLASS B +, RV CLASS C, Scooter, Snowmobile, TENT CAMPER, test type ken, TOY HAULER, Tractor / construction, TRAVEL TRAILER, TRUCK CAMPER | ✅ | Same 23 as on 2026-11-01; now a select inside the form instead of a top-right menu |
| 3 `[Verification]` | Check the VIN row on Passenger | "Décoder" visible; VIN has class `vinlookup` | "Décoder" button visible next to the empty VIN; VIN class = "vinlookup form-control-lg border-primary form-control" | ✅ | — |
| 4 | Choose RV CLASS A | Form re-renders | URL `/quote/new/edit-vehicle/RV_CLASS_A`; type "RV CLASS A"; Brand list of RV makers (American Coach, Coachmen RV, Entegra Coach …) | ✅ | — |
| 5 `[Verification]` | Check the VIN row and visible fields | No "Décoder", no `vinlookup`; only the five fields | VIN class = "form-control" (no `vinlookup`), no "Décoder" button, no help text. Visible labels: Vehicle type, Quote name, VIN, Brand, Model, Year, then Save — no extra field | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step3-PassengerDecoderShown-20261107_pass.png` — Passenger form with "Décoder"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step5-RvClassANoDecoder-20261107_pass.png` — RV CLASS A form without "Décoder"

### AP2477_011 — The inventory add-vehicle form keeps Price and Kilometers — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the inventory and the Passenger add link | Full add-vehicle form | `/vehicle/inventory` newest rows 1147, 1146, 1145; its menu links "Passenger" → `/vehicle/new/edit/PASSENGER`, heading "Add a vehicle" | ✅ | Baseline newest vehicle 1147 |
| 2 `[Verification]` | List the visible fields | Full field set as before AP-2477 | VIN, Brand, Model, Year, Vehicle Price, Kilometers, Condition, Fuel type, Transmission, Cylinders, Engine size, Engine size unit, Designation, Turbo engine, 4x4, All Wheel Drive, and two manufacturer-warranty blocks (End date, Max mileage) | ✅ | Unchanged by AP-2477 |
| 3 | Toyota / Corolla / 2020, Price and Kilometers empty, submit | Refused at Price and/or Kilometers; no HTTP 500 | Other required fields filled to reach the save: VIN `QAAP2477011`, Cylinders 4, Engine size 1.8 (Condition, Fuel, Transmission, unit, Designation kept defaults). Page stayed on "Add a vehicle" with "ERROR This value should not be blank." under **Vehicle Price** and **Kilometers**; no error page | ✅ | Refused by the server |
| 4 `[Verification]` | Check the inventory list | No new vehicle | Newest rows still 1147, 1146, 1145; no Toyota Corolla 2020 with VIN QAAP2477011 | ✅ | Nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step2-InventoryFormFullFields-20261107_pass.png` — full "Add a vehicle" form
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step3-PriceKmBlankRefused-20261107_pass.png` — refusal at Price and Kilometers
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step4-NoNewInventoryVehicle-20261107_pass.png` — inventory list, no new vehicle

### AP2477_012 — A minimal-form quote opens its details and warranty step — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | "Create a quote", Quote name `QA-AP2477-012-095207`, VIN empty, Toyota / Corolla / 2020 → "Save" | `/quote/{id}/details` opens | `/quote/6590/details`, banner "Vehicle saved"; vehicle **1145** | ✅ | Quote 6590 |
| 2 `[Verification]` | Read the details page; reload once | Loads twice with no HTTP 500 / error page; Toyota Corolla 2020; record how empty km / price show | Both loads rendered the full page. Heading "#6590-QA-AP2477-012-095207"; vehicle card "Toyota Corolla 2020", "VIN:" blank, "Mileage: km", "Designation:" blank; Summary of products "Toyota Corolla 2020 … CA$0.00", every product "- None Selected -". Empty km shows as "Mileage: km"; empty price as CA$0.00 | ✅ | — |
| 3 | Open the warranty step | Warranty screen opens; record route | The "+" next to Extended warranty (`data-href="/quote/6590/warranty/edit"`) opens a modal; `GET /quote/6590/warranty/edit` → 200 | ✅ | Route `/quote/{id}/warranty/edit`, modal |
| 4 `[Verification]` | Read the screen | No error page; lists programs or says km / condition needed (Q-002) | Modal "Vehicle": "Check the vehicle information the eligible programs are based on and correct what is missing or wrong." Brand Toyota*, Model Corolla*, Year 2020*, **Kilometers*** empty, **Fuel type*** "Choose", button "Update vehicle"; then "There are no eligible program for the vehicle. Please contact us for more information." No error page | ✅ | Q-002: the warranty step asks for km and fuel type. "Update vehicle" not clicked |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step2-Quote6590DetailsReloaded-20261107_pass.png` — quote 6590 details after the reload
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step4-WarrantyModalAsksKmFuel-20261107_pass.png` — warranty modal asking for Kilometers and Fuel type

---

## Blocked / Skipped / Not Run Test Cases

None. AP2477_008 and AP2477_009, blocked on 2026-11-01 by AP-2507, ran in full this time.

---

## Comparison with the 2026-11-01 run

| TC ID | 2026-11-01 | 2026-11-07 | Note |
|---|:---:|:---:|---|
| AP2477_001 | PASS | PASS | Type selector moved into the form (AP-2533) |
| AP2477_002 | PASS | PASS | — |
| AP2477_003 | PASS | PASS | — |
| AP2477_004 | PASS | PASS | — |
| AP2477_005 | PASS | PASS | — |
| AP2477_006 | PASS | PASS | — |
| AP2477_007 | FAIL (AP-2507) | **PASS** | AP-2507 not reproduced: decode re-renders, saves nothing |
| AP2477_008 | BLOCKED (AP-2507) | **FAIL** | Ran for the first time; engine size unit kW → Litre |
| AP2477_009 | BLOCKED (AP-2507) | **PASS** | Ran for the first time |
| AP2477_010 | PASS | PASS | — |
| AP2477_011 | PASS | PASS | — |
| AP2477_012 | PASS | PASS | — |

---

## Open questions — what this run could and could not tell

| Question | Observation |
|---|---|
| Q-001 — VIN decoder configured? | Yes on Dev: three decodes of `1FAHP35NX8W239204` returned Ford / Focus / 2008. |
| Q-002 — Warranty with empty km / condition / price | Same as 2026-11-01 (AP2477_012): the warranty modal asks for Kilometers and Fuel type and says no program is eligible until they are filled. |
| Q-003 — Required markers on Quote name / NIV | No marker and not required (AP2477_002). |
| Q-004 — Quote name kept across decode | **Yes** (AP2477_009): the name typed before "Décoder" is still there and is saved. |
| Q-005 — Years accepted by Year | Not observed. |
| Q-006 — Vehicle types | 23 types, listed under AP2477_010 step 2. |

---

## Environment Observations

- **Environment: Dev (v2dev).** Staging was never opened, so AP-2492 (staging 404) was not re-tested.
- **Test data left behind on Dev by this run** (dealers cannot delete quotes; each quote vehicle also appears in the dealer's Vehicle Inventory):
  - quote **6588** (no name) — vehicle **1143**, Toyota Corolla 2020 (AP2477_003);
  - quote **6589** "QA-AP2477-004-095118" — vehicle **1144**, Toyota Corolla 2020 (AP2477_004);
  - quote **6590** "QA-AP2477-012-095207" — vehicle **1145**, Toyota Corolla 2020 (AP2477_012);
  - quote **6591** "QA-AP2477-008-095303" — vehicle **1146**, Ford Focus 2008, VIN `1FAHP35NX8W239204` (AP2477_008);
  - quote **6592** "QA-AP2477-009-095457" — vehicle **1147**, Ford Focus 2008, VIN `1FAHP35NX8W239204` (AP2477_009).
  - Nothing else was saved: the three decodes created no quote, AP2477_005, 006 and 011 were refused, and the edit forms of vehicles 1144, 1146 and 863 were opened read-only. The warranty modal's "Update vehicle" was not clicked.
- **Decoder now carries an existing vehicle id.** After "Décoder", the hidden `quote_vehicle[id]` holds **863**, an existing inventory vehicle of dealer 1380 with the same VIN (Ford Focus 2008, price 20000.00, 20000 km). Saving still created a new vehicle (1146, 1147) and vehicle 863 was unchanged when re-read at 09:57Z. Observation for the developer, no verdict.
- **"No entities found"** — a blue alert under "Vehicle saved" on a freshly saved quote's details page (6588, 6591). Not an error page; noted.
- **Edit-form defaults** (unchanged since 2026-11-01): a vehicle saved from the minimal form shows Condition "new" (no option selected) and Designation "Particular" on its full edit form.
- **Form layout changed by AP-2533** (see *Differences* above): Vehicle type select inside the form, above Quote name.

# Execution Log — AP-2477 Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill

> Written by the **stlc-manual-executor** skill (pipeline stage s4). Inputs:
> `qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md`,
> `qa-artifacts/3-test-cases/AP2477_TestCases_011-012.md`.
>
> **This run is complete — all twelve cases have a result.** The first pass (14:44–14:49 UTC) stopped after seven cases to ask the user a question (see *Why the run stopped*). Once the answer came back ("yes — use `/quotes` → Create a quote on dev"), the run resumed at 14:53 UTC and executed the remaining five cases (AP2477_003, 004, 005, 006 and 012); see *Resumed run* below. The seven earlier results were kept unchanged. This log supersedes the 2026-10-12 staging run (`execution-log_AP-2477_2026-10-12.md`), which is kept for the record.

---

## Execution Summary

**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-01
**Base URL:** https://v2dev.garantieavantageplus.ca/ (Dev, v2dev) — Dealer portal. Staging was not opened.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 14:44 → 14:49 (UTC), resumed 14:53 → 14:58 (UTC)
**Account:** the dealer account from the `env` source, *Dev Environment* section (`DEALER_USERNAME` / `DEALER_PASSWORD`). It signed in as "Test QA staging" (Dealer ID 1380 — the same dealer exists on dev).

| Metric | Value |
|---|:---:|
| Total test cases | 12 |
| Passed | 9 |
| Failed | 1 |
| Blocked | 2 |
| Skipped | 0 |
| Not Run | 0 |
| **Pass rate** | **75% (9 of 12)** — the one failure (AP2477_007) also blocks AP2477_008 and AP2477_009 |

**Environment check:** passed. The tracker preflight and the environment health check were done by the batch before this worker started, as instructed, and were not repeated. `/login` on dev loaded the login form and the dealer login landed on the Dashboard `/`. One console error on the login page did not affect anything.

**Build check: passed — the AP-2477 build is on dev.** On `/quotes` the header action "Create a quote" points to `/quote`, which redirects to **`/quote/new/edit-vehicle`**, heading "Create a quote", with the vehicle type button "Passenger" at the top right. Neither Price nor Kilometers is shown. The footer still reads "Avantage Plus System v2.0.0".

**Language and design facts that differ from the test cases (the live page wins):**
- The dealer UI on dev is in **English**: the labels read "Quote name", "VIN", "Brand*", "Model*", "Year*", the button reads "Save" and the heading "Create a quote". Only the decoder button keeps the French label "Décoder". The cases' French labels map one to one to these.
- The Quote name and VIN inputs are `#quote_vehicle_quote_name` and `#quote_vehicle_VIN` (the cases expected `#vehicle_quote_name` / `#vehicle_VIN`). Brand, Model and Year keep `vehicle_make`, `vehicle_model`, `#vehicle_year`.
- The cases' Execution Context names v2staging; this batch runs on dev by the user's decision.

---

## Why the run stopped

Five cases (AP2477_003, 004, 005, 006 and 012) must save — or try to save — the new minimal form. That form is reached only from the bare `/quote` entry (`/quotes` → "Create a quote" → `/quote` → `/quote/new/edit-vehicle`). The batch instruction says to create quotes only from a vehicle via `/vehicle/{id}/details` → "Create quote", never from the bare `/quote` entry. On dev, that vehicle route still opens the **old client form** `/quote/new/client?fromVehicleId=915`, so it never reaches the form under test. No rule settles this conflict, so the run stopped for the user (stop point E4) instead of creating quotes through a forbidden route.

**Question for the user:** May this run create quotes through `/quotes` → "Create a quote" (`/quote/new/edit-vehicle`) on dev for AP2477_003–006 and AP2477_012, given that this form is the feature under test and the vehicle route still opens the old client form?

**Answer (relayed by the batch orchestrator, 2026-11-01):** Yes. The earlier "never use the bare `/quote` entry" rule came from staging, where `/quote` without a vehicle returned HTTP 500. For AP-2477 that entry and its new minimal form are the feature under test, so the five cases use `/quotes` → "Create a quote" on dev. Every quote and vehicle created is test data left on dev and is listed under *Test data left behind*. "Décoder" was not clicked again.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_001-step3-FiveFieldsOnly_pass.png` | Five fields in order; removed fields gone |
| AP2477_002 | Only Brand, Model and Year carry the required marker; Quote name and VIN do not | Medium | ✅ | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_002-step2-RequiredMarkersBrandModelYear_pass.png` | Stars and `required` only on Brand, Model, Year |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-QuotesListNewest6438_pass.png` | Quote 6438 (Toyota Corolla 2020) saved and opened; newest in the list (resumed run) |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleEdit1069PriceKmEmpty_pass.png` | Vehicle 1069: price and km empty, mileage and designation blank on details, no condition stored (resumed run) |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-step3-NoNewQuoteNewest6440_pass.png` | Server refused: "This value should not be blank." at Brand and Model; no quote (resumed run) |
| AP2477_006 | Saving with Brand and Model but no Year is refused with an error and no quote is created | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_006-step3-NoNewQuoteNewest6440_pass.png` | Server refused at Year; Brand/Model kept; no quote (resumed run) |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year on the simplified form | High | ❌ | 1 | 2 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` | "Décoder" saved quote #6437 at once; the form vanished |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo on its vehicle | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` | Blocked by the AP2477_007 failure; observation recorded |
| AP2477_009 | A Quote name typed before clicking "Décoder" is still there afterwards and is saved with the quote | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step2-FormGoneAfterDecode_fail.png` | Blocked by the AP2477_007 failure |
| AP2477_010 | The "Décoder" button shows for a car type but not for an RV, boat or construction type | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step5-RvClassANoDecoder_pass.png` | Passenger has it; RV CLASS A does not |
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step3-PriceKmBlankRefused_pass.png` | Server refused blank Price and Kilometers |
| AP2477_012 | A quote created from the minimal form opens its details and warranty step without an error page | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step4-WarrantyModalAsksKmFuel_pass.png` | Quote 6440 details loaded twice; warranty step asks for Kilometers / Fuel type, no error page (resumed run) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2477_001 — The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in as the dealer, open `/quotes` | Quotes list with "Create a quote" | URL = /quotes; heading = "Quotes"; link "Create a quote" visible (href `/quote`); newest row = quote 6431 | ✅ | Dev holds the same dealer and quotes as staging up to 6431 |
| 2 | Click "Create a quote", type Passenger | Form at `/quote/new/edit-vehicle` | `/quote` redirected to `/quote/new/edit-vehicle`; heading = "Create a quote" (English UI); type button = "Passenger" | ✅ | Heading is the English form of "Créer une cotation" |
| 3 `[Verification]` | List the visible fields | Exactly five fields in order, then the save button; no removed field visible | Visible labels top to bottom: "Quote name", "VIN" (help text "Enter the VIN and click search to pre-fill the vehicle info" and a "Décoder" button), then "Brand*", "Model*", "Year*" on one row, then "Save". No Price, Kilometers, Condition, Designation, transmission, engine size, unit, cylinders, fuel, turbo, 4x4/AWD or manufacturer-warranty block. Hidden inputs found: `quote_vehicle[transmission]` = "automatic", `quote_vehicle[engineSizeUnit]` = "l", `quote_vehicle[id]` (empty) and the form token | ✅ | Hidden inputs noted, not counted, per the Execution Context |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_001-step3-FiveFieldsOnly_pass.png` — the full "Create a quote" page with the five fields and the Save button

### AP2477_002 — Only Brand, Model and Year carry the required marker — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form with type Passenger | Form shown | Form shown at `/quote/new/edit-vehicle` | ✅ | Same page as AP2477_001 |
| 2 `[Verification]` | Read the labels, `*` markers and `required` attributes | Only Brand*, Model*, Year* starred and required; Quote name and VIN not | Labels with class `required` and a star: "Brand", "Model", "Year". Inputs with the `required` attribute: `vehicle_make`, `vehicle_model`, `vehicle_year`. "Quote name" and "VIN" show no star and their inputs are not required | ✅ | Matches the ticket's Assumptions (Q-003 answered by the build) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_002-step2-RequiredMarkersBrandModelYear_pass.png` — the form with stars only on Brand, Model and Year

### AP2477_003 — Saving with only Brand, Model and Year creates the quote — Step Results

_Resumed run, 14:53–14:54 UTC._

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in as the dealer, open `/quotes`, note the newest quote | Quotes list shown | Heading "Quotes"; the newest row was quote **6437** (Ford Focus 2008, the AP2477_007 leftover); "Create a quote" links to `/quote` | ✅ | Baseline noted |
| 2 | "Create a quote" (Passenger), Quote name and VIN empty, Brand Toyota, Model Corolla, Year 2020 → "Save" | Submits with no validation message and no HTTP 500 / error page | `/quote` redirected to `/quote/new/edit-vehicle`. After choosing Toyota the Model list loaded 29 Toyota models; Corolla chosen, Year 2020 typed. Clicking "Save" posted the form (`POST /quote/new/edit-vehicle` → 302) and the browser landed on a normal page with the green banner "Vehicle saved" — no validation message, no error page | ✅ | — |
| 3 `[Verification]` | Read URL, heading and vehicle; open `/quotes` and read the newest row | On `/quote/{id}/details` with Toyota Corolla 2020; new quote is the newest row above the step-1 one | URL `/quote/6438/details`; heading "#6438 -" (no name, as entered); Vehicle card "Toyota Corolla 2020", "VIN:" blank, "Mileage: km", "Designation:" blank; vehicle id 1068. On `/quotes` the newest row is now `/quote/6438/details` "Toyota Corolla 2020 VIN: - Nov 1, 2026", directly above 6437 | ✅ | Core promise of the ticket met: Brand/Model/Year alone are enough |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-Quote6438DetailsToyotaCorolla_pass.png` — quote #6438 details with "Vehicle saved" and Toyota Corolla 2020
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-QuotesListNewest6438_pass.png` — the quotes list with 6438 as the newest row

### AP2477_004 — A vehicle saved from the minimal form has no kilometres, condition, designation or price — Step Results

_Resumed run, 14:54–14:55 UTC._

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | "Create a quote" (Passenger), Quote name `QA-AP2477-004-145431`, VIN empty, Toyota / Corolla / 2020 → "Save" | `/quote/{id}/details` opens | `POST` → redirect to `/quote/6439/details`, banner "Vehicle saved" | ✅ | Quote 6439 |
| 2 | Open the quote's vehicle | Vehicle details or edit page for Toyota Corolla 2020 | The vehicle card links to `/vehicle/1069/details` ("Vehicle VIN:", "Toyota Corolla 2020") and "Edit" to `/vehicle/1069/edit` (heading "Vehicle #1069"). Both opened read-only; nothing was saved | ✅ | Vehicle 1069 |
| 3 `[Verification]` | Read Kilometers, Condition, Designation and Price; confirm the quote name | All four blank — not 0, not "New", no designation, no price; quote shows the name | **Details page** `/vehicle/1069/details`: "Mileage: km" (no number) and "Designation:" (blank); it does not show Condition or Price. **Edit form** `/vehicle/1069/edit`: Vehicle Price empty, Kilometers empty. Condition: no option of the select carries the `selected` attribute, so nothing is stored — the box displays its first option "new" only because a select always shows something. Designation displays "Particular", but the blank inventory form `/vehicle/new/edit/PASSENGER` pre-selects "Particular" too, so that is the edit form's default; the stored designation (read on the details page) is blank. No 0, no "New" condition, no price stored. The quote heading reads "#6439-QA-AP2477-004-145431" | ✅ | Observation for the developer: the full edit form shows "new" and "Particular" for these empty values, so a dealer who opens it and presses Save would store them without choosing |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleDetails1069Blank_pass.png` — vehicle 1069 details: "Mileage: km" and "Designation:" blank
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleEdit1069PriceKmEmpty_pass.png` — vehicle 1069 edit form (full page, not saved): Vehicle Price and Kilometers empty
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-Quote6439NameShown_pass.png` — quote 6439 heading with the name QA-AP2477-004-145431

### AP2477_005 — Saving without a Brand is refused — Step Results

_Resumed run, 14:56–14:57 UTC._

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes`, note the newest quote | Quotes list shown | Newest row `/quote/6440/details` (QA-AP2477-012-145539) | ✅ | Baseline 6440 |
| 2 | "Create a quote" (Passenger), Quote name `QA-AP2477-005-145649`, VIN empty, Brand and Model on "Choose", Year 2020 → "Save" | Refused with a message at Brand (and Model), browser or server; no HTTP 500 | The form posted (`POST /quote/new/edit-vehicle` → 200) and came back on `/quote/new/edit-vehicle` with "ERROR This value should not be blank." under **Brand** and under **Model**. Quote name `QA-AP2477-005-145649` and Year 2020 were kept. No error page. Refused by the **server** (the browser also reports "Please select an item in the list." on both selects) | ✅ | Server-side validation |
| 3 `[Verification]` | Open `/quotes`, read the newest row | Still the step-1 row; no `QA-AP2477-005-…` quote | Newest row still `/quote/6440/details`; the text "QA-AP2477-005" appears nowhere on the list | ✅ | Nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-step2-BrandModelBlankRefused_pass.png` — the refused form with the errors at Brand and Model
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-step3-NoNewQuoteNewest6440_pass.png` — the quotes list, newest still 6440

### AP2477_006 — Saving with Brand and Model but no Year is refused — Step Results

_Resumed run, 14:57–14:58 UTC._

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quotes`, note the newest quote | Quotes list shown | Newest row `/quote/6440/details` (unchanged since AP2477_005) | ✅ | Baseline 6440 |
| 2 | "Create a quote" (Passenger), Quote name `QA-AP2477-006-145711`, VIN empty, Brand Toyota, Model Corolla, Year empty → "Save" | Refused with a message at Year; no HTTP 500; Brand and Model keep their values | The form posted (`POST /quote/new/edit-vehicle` → 200) and came back with "ERROR This value should not be blank." under **Year** only. Brand still "Toyota", Model still "Corolla", Quote name kept. No error page. Refused by the **server** (the browser also reports "Please fill out this field." on Year) | ✅ | Server-side validation |
| 3 `[Verification]` | Open `/quotes`, read the newest row | Still the step-1 row; no `QA-AP2477-006-…` quote | Newest row still `/quote/6440/details`; "QA-AP2477-006" appears nowhere on the list | ✅ | Nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_006-step2-YearBlankRefused_pass.png` — the refused form: error at Year, Toyota / Corolla kept
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_006-step3-NoNewQuoteNewest6440_pass.png` — the quotes list, newest still 6440

### AP2477_007 — Clicking "Décoder" fills Brand, Model and Year — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form with type Passenger | VIN with "Décoder"; Brand and Model on "Choose" | VIN field present with class `vinlookup` and a "Décoder" button; Brand and Model show "Choose" | ✅ | Ready |
| 2 | Type `1FAHP35NX8W239204` in VIN, leave Brand on "Choose", click "Décoder" | The form reloads in place, pre-filled, without an error page | The page sent `POST /quote/new/edit-vehicle` by AJAX (body: empty quote name, the VIN, `vehicle[novalidate]=true`). The server answered **302 → `/quote/6437/details`** and that page returned 200. The whole form then disappeared from the page: only the heading "Create a quote" and the "Passenger" button remained, with no fields and no message. **Quote #6437 was saved**, titled "#6437 - 1FAHP35NX8W239204", with a "Vehicle saved" banner, vehicle Ford Focus 2008 (vehicle 1067) and no quote name | ❌ | The decode saved the quote instead of pre-filling the form. Not an environment fault: the VIN decoder did answer (Ford / Focus / 2008), so it is configured on dev |
| 3 `[Verification]` | Read VIN, Brand, Model, Year and the visible fields | VIN kept; Brand Ford, Model Focus, Year 2008; still only five fields | Nothing to read: the form was gone. The decoded values appear only on the saved quote 6437 ("Ford Focus 2008, VIN: 1FAHP35NX8W239204"). The dealer never got to review the vehicle, add a quote name, or press Save | ❌ | A dealer who clicks "Décoder" gets a quote they did not ask for, cannot name it first, and cannot delete it. Not retried, because a retry would create a second unwanted quote |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step2-FormGoneAfterDecode_fail.png` — the page right after "Décoder": heading and type button only, the form is gone
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` — quote #6437 that the decode saved, with the "Vehicle saved" banner and Ford Focus 2008

### AP2477_008 — A quote saved after decoding keeps the decoded details — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Decode the VIN and read the hidden inputs before saving | Ford / Focus / 2008 filled; hidden inputs hold decoded values | Cannot be done as designed: "Décoder" saves the quote at once (AP2477_007), so there is no moment to read the hidden inputs or to enter a quote name before the save | 🚫 | Blocked by the AP2477_007 failure |
| 2–4 | — | — | Not run as designed. **Observation (no verdict):** vehicle 1067, saved by the AP2477_007 decode, opened read-only at `/vehicle/1067/edit` (nothing saved) shows VIN `1FAHP35NX8W239204`, Ford, Focus, 2008, Fuel type GASOLINE, Transmission Automatic, Cylinders 4, Engine size 2, unit Litre, Turbo / 4x4 / AWD unticked, Vehicle Price empty, Kilometers empty. Condition shows "new" and Designation "Particular" — these may be the edit form's first-option default rather than stored values; the quote page shows "Mileage: km" and "Designation:" both blank | 🚫 | The decoded details do appear to be stored, which the next run can confirm once AP2477_007 is fixed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` — the auto-saved quote this observation comes from

### AP2477_009 — Quote name survives "Décoder" — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form | Form shown | Form available (same page as AP2477_001) | ✅ | — |
| 2–4 | Type a quote name and the VIN, click "Décoder" | Ford / Focus / 2008 filled; name kept | Not run. Clicking "Décoder" saves a quote at once (AP2477_007), so running this would create a second unwanted quote through the bare `/quote` entry | 🚫 | Blocked by the AP2477_007 failure |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step2-FormGoneAfterDecode_fail.png` — the form disappearing after a decode, which this case depends on

### AP2477_010 — "Décoder" shows only for car types — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create a quote" | Form shown | Form shown, type "Passenger" | ✅ | — |
| 2 | Open the type menu and record the types; choose Passenger | Type list recorded | 23 types, each a link to `/quote/new/edit-vehicle/{TYPE}`: 3 wheels, 5TH WHEEL, ATV / UTV, Boat, Camion Lourd, eBike, Heavy Duty, LEISURE, Motorcycle, Passenger (`/quote/new/edit-vehicle`), PWC, RV CLASS A, RV CLASS B, RV CLASS B +, RV CLASS C, Scooter, Snowmobile, TENT CAMPER, test type ken, TOY HAULER, Tractor / construction, TRAVEL TRAILER, TRUCK CAMPER | ✅ | Q-006 observation: the menu lists every type above |
| 3 `[Verification]` | Check the VIN row on Passenger | "Décoder" visible; VIN has class `vinlookup` | "Décoder" button visible next to the empty VIN field; the VIN input has class `vinlookup` | ✅ | — |
| 4 | Choose RV CLASS A | Form re-renders | `/quote/new/edit-vehicle/RV_CLASS_A` opened, type button "RV CLASS A", Brand list of RV makers (American Coach … Winnebago) | ✅ | — |
| 5 `[Verification]` | Check the VIN row and the visible fields | No "Décoder"; only the five fields | VIN is a plain input (class `form-control`, no `vinlookup`), no "Décoder" button, no help text. Visible fields: Quote name, VIN, Brand*, Model*, Year*, then Save — no extra field | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step3-PassengerDecoderShown_pass.png` — the Passenger form with the type menu open and the "Décoder" button
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step5-RvClassANoDecoder_pass.png` — the RV CLASS A form with no "Décoder" button

### AP2477_011 — The inventory add-vehicle form keeps Price and Kilometers — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the inventory and the Passenger add link | Full add-vehicle form | `/vehicle` returned HTTP 404; the inventory is at `/vehicle/inventory` ("Vehicle Inventory"), whose menu links to `/vehicle/new/edit/PASSENGER`, heading "Add a vehicle". Newest inventory row before the test: vehicle 1067 | ✅ | The case's "vehicle inventory" is `/vehicle/inventory` |
| 2 `[Verification]` | List the visible fields | Full field set as before AP-2477 | VIN*, Brand*, Model*, Year*, Vehicle Price*, Kilometers*, Condition*, Fuel type*, Transmission*, Cylinders*, Engine size*, Engine size unit*, Designation*, Turbo engine, 4x4, All Wheel Drive, and two manufacturer-warranty blocks (End date, Max mileage) | ✅ | Unchanged by AP-2477 |
| 3 | Brand Toyota, Model Corolla, Year 2020, Price and Kilometers empty, submit | Save refused at Price and/or Kilometers; no HTTP 500 | To reach the save, the other required fields were filled: VIN `QAAP2477011`, Cylinders 4, Engine size 1.8 (Condition, Fuel, Transmission, unit and Designation kept their defaults). The form posted (`POST /vehicle/new/edit/PASSENGER` → 200) and came back with "ERROR This value should not be blank." under **Vehicle Price** and under **Kilometers**; the page stayed on "Add a vehicle" | ✅ | Refused by the server; the browser also flags both fields "Please fill out this field." |
| 4 `[Verification]` | Check the inventory list | No new vehicle | Newest rows still 1067 (Ford Focus 2008), 1061, 1060; no Toyota Corolla 2020 added | ✅ | Nothing saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step2-InventoryFormFullFields_pass.png` — the full "Add a vehicle" form with Vehicle Price and Kilometers
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step3-PriceKmBlankRefused_pass.png` — the refusal with "This value should not be blank." at Price and Kilometers
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step4-NoNewInventoryVehicle_pass.png` — the inventory list with no new vehicle

### AP2477_012 — A minimal-form quote opens its details and warranty step — Step Results

_Resumed run, 14:55–14:56 UTC._

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | "Create a quote" (Passenger), Quote name `QA-AP2477-012-145539`, VIN empty, Toyota / Corolla / 2020 → "Save" | `/quote/{id}/details` opens | Redirected to `/quote/6440/details`, banner "Vehicle saved"; vehicle id 1070 | ✅ | Quote 6440 |
| 2 `[Verification]` | Read the details page, reload once | Loads both times with no HTTP 500 / error page; shows Toyota Corolla 2020; record how empty km / price show | Both loads returned HTTP 200. Heading "#6440-QA-AP2477-012-145539"; Vehicle card "Toyota Corolla 2020", "VIN:" blank, "Mileage: km", "Designation:" blank; Summary of products "Toyota Corolla 2020 … CA$0.00", Extended warranty / Roadside / Gap / Creditors "- None Selected -", Subtotal CA$0.00. Empty km shows as "Mileage: km"; empty price as CA$0.00 | ✅ | — |
| 3 | Open the warranty step | Warranty / programs screen opens; record its route | The "+" next to "Extended warranty" opens a modal loaded from `GET /quote/6440/warranty/edit` → 200 | ✅ | Route `/quote/{id}/warranty/edit`, shown as a modal |
| 4 `[Verification]` | Read the screen | No HTTP 500 / error page; lists programs or clearly says km / condition are needed (record which — Q-002) | The modal "Vehicle" reads "Check the vehicle information the eligible programs are based on and correct what is missing or wrong." and shows Brand Toyota, Model Corolla, Year 2020, an empty required **Kilometers** field, **Fuel type** on "Choose", and an "Update vehicle" button. Below it: "There are no eligible program for the vehicle. Please contact us for more information." No error page | ✅ | Q-002 answer: the warranty step asks for the missing kilometres and fuel type instead of crashing. "Update vehicle" was not clicked |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step2-Quote6440DetailsReloaded_pass.png` — quote 6440 details after the reload
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step4-WarrantyModalAsksKmFuel_pass.png` — the warranty modal asking for Kilometers and Fuel type, with the "no eligible program" message

---

## Blocked / Skipped / Not Run Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2477_008 | 🚫 | Blocked by the AP2477_007 failure: "Décoder" saves the quote immediately, so the hidden inputs cannot be read and no name can be entered before saving. Re-run once AP2477_007 passes. |
| AP2477_009 | 🚫 | Blocked by the AP2477_007 failure; running it would also create another unwanted quote through the bare `/quote` entry. |


No case is Not Run. AP2477_003, 004, 005, 006 and 012 were executed in the resumed run once the user allowed the `/quotes` → "Create a quote" entry on dev.

---

## Open questions — what this run could and could not tell

| Question | Observation |
|---|---|
| Q-001 — VIN decoder configured? | Yes on dev: the decode of `1FAHP35NX8W239204` returned Ford / Focus / 2008 (seen on quote 6437 and vehicle 1067). |
| Q-002 — Warranty with empty km / condition / price | Answered by observation (AP2477_012): the warranty step of quote 6440 opens without an error, asks "Check the vehicle information the eligible programs are based on and correct what is missing or wrong." with an empty required Kilometers field and Fuel type on "Choose", and says "There are no eligible program for the vehicle." until they are filled. |
| Q-003 — Required markers on Quote name / NIV | Answered by the build: no marker and not required (AP2477_002). |
| Q-004 — Quote name kept across decode | Not observable: the decode saves the quote before a name can matter. Quote 6437 has no name. |
| Q-005 — Years accepted by Year | Not observed. |
| Q-006 — Vehicle types in the type menu | 23 types, listed under AP2477_010 step 2. |

---

## Environment Observations

- **Environment: Dev (v2dev).** Staging was never opened. The dev database holds the same dealer (1380, "Test QA staging"), vehicle 915 (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and quotes up to 6431 that the cases were designed against.
- **Test data left behind on dev:** quote **6437** and its vehicle **1067** (Ford Focus 2008, VIN `1FAHP35NX8W239204`, no quote name), created unintentionally by the "Décoder" click in AP2477_007. Vehicle 1067 now also shows at the top of the dealer's **Vehicle Inventory** list — so a quote vehicle saved from this form appears as an inventory vehicle. Dealers cannot delete quotes. Nothing else was saved: the AP2477_011 save was refused, and vehicle 1067's edit form was opened read-only.
- Inventory vehicle 915 was opened read-only. Its "Create quote" action still points to the old client form `/quote/new/client?fromVehicleId=915`, not to the new minimal form.
- `/vehicle` returns HTTP 404; the inventory list is `/vehicle/inventory`.
- The decoder's AJAX post carries `vehicle[novalidate]=true`, yet the server saved and redirected instead of re-rendering the form. This is the likely technical cause of the AP2477_007 failure, for the developer to confirm.
- The response bodies of the decode request were kept in the throwaway server-log folder (`playwright-log/AP-2477-decode-response-213.html`), not as evidence.

### Resumed run — 2026-11-01 14:53–14:58 UTC

- **Same environment and account.** Dev (v2dev) only, dealer account from the `env` source *Dev Environment* section, signed in as "Test QA staging". Staging was never opened. The five cases were run in priority order: AP2477_003, 004, 012 (High), then 005, 006 (Medium). "Décoder" was not clicked.
- **Test data left behind on dev by the resumed run** (dealers cannot delete quotes):
  - quote **6438** (no name) with vehicle **1068** — Toyota Corolla 2020, from AP2477_003;
  - quote **6439** "QA-AP2477-004-145431" with vehicle **1069** — Toyota Corolla 2020, from AP2477_004;
  - quote **6440** "QA-AP2477-012-145539" with vehicle **1070** — Toyota Corolla 2020, from AP2477_012.
  - AP2477_005 and AP2477_006 saved nothing (both refused by the server). Vehicle 1069's edit form and the inventory add form `/vehicle/new/edit/PASSENGER` were opened read-only; the warranty modal's "Update vehicle" was not clicked. Whether vehicles 1068–1070 also appear in the Vehicle Inventory list (as vehicle 1067 does) was not checked.
- **Form behaviour seen on every save:** choosing a Brand re-posts the form by AJAX (`POST /quote/new/edit-vehicle` → 200) to load the Model list; the real save posts the same route and answers 302 → `/quote/{id}/details`. A refused save answers 200 with the server's "This value should not be blank." under each missing field. The browser's own `required` check does not stop the post.
- **Edit-form defaults (observation for the developer, no verdict).** On the full vehicle edit form `/vehicle/{id}/edit`, a vehicle saved from the minimal form shows Condition "new" (no option is marked selected — the stored value is empty) and Designation "Particular" (the same pre-selection appears on a blank inventory add form). A dealer who opens that form and presses Save would store those values without choosing them.

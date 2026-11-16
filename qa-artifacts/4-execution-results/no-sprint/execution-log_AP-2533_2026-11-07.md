# Execution Log — AP-2533 (Update quote form UI)

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, Wave 2)
**Environment:** Dev (v2dev) — `execution_env: Dev` in the tool registry
**Date:** 2026-11-07
**Base URL:** https://v2dev.garantieavantageplus.ca/
**Account:** Dealer ID 1380 "Test QA staging" (credentials from the `env` source, Dev Environment section, typed only into the login form)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-07T11:07:13Z → 2026-11-07T11:16:16Z
**Test cases:** AP2533_TestCases_001-005.md, AP2533_TestCases_006-010.md, AP2533_TestCases_011-011.md
**Run order (Gate B, R2 round 2):** AP2533_001 → 003 → 004 → 005 → 006 → 011 → 007 → 008 → 009 → 010; AP2533_002 not executed (BLOCKED by Q-002)
**Build check:** table row 1 — fix present (AP2533_001 step 1). **Stop rule:** never fired — no decode saved a quote.
**env-check source:** missing in the knowledge registry; the orchestrator's environment health check passed before this dispatch.

| Metric | Value |
|---|:---:|
| Total test cases | 11 |
| Passed | 10 |
| Failed | 0 |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **90.9% (10 of 11)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2533_001 | Clicking "Décoder" with the Tesla VIN keeps the form on screen with TESLA, Model 3 and 2020 filled in | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_001-step5-TeslaDecodedFormKept_pass.png` | Build check row 1; decode filled TESLA / Model 3 / 2020 and kept the form |
| AP2533_002 | Clicking "Décoder" with the Tesla VIN fills the form's hidden vehicle inputs with the decoded values | High | 🚫 | 0 | 0 | — | Not executed: Q-002 (Blocking, Open), comment 19510 — no hidden input or value is named |
| AP2533_003 | Clicking "Décoder" without pressing Save creates no quote and keeps the dealer on the "Create a quote" form | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_003-step5-VinSearchUnchanged_pass.png` | No quote by name; VIN search still empty after the decode |
| AP2533_004 | Saving the form after a decode creates exactly one quote carrying the decoded TESLA Model 3 2020 | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_004-step5-NameSearchOneQuote6602_pass.png` | Save created exactly one quote, 6602, with new vehicle 1157 (TESLA Model 3 2020) |
| AP2533_005 | Clicking "Décoder" with a malformed or empty VIN shows no error page, keeps the form and creates no quote | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_005-step5-NameSearchNoEntities_pass.png` | Both decodes answered 200, form kept, no message (Q-003), no quote |
| AP2533_006 | Decoding the Tesla VIN after choosing Ford, Focus and 2008 by hand keeps the form and creates no quote | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_006-step5-NameSearchNoEntities_pass.png` | Decoded values replaced the hand-chosen ones (Q-004); no quote |
| AP2533_011 | Decoding the Tesla VIN on a second car type's form keeps the form on screen and creates no quote | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_011-step5-NameSearchNoEntities_pass.png` | ATV / UTV form kept after decode; Brand/Model not in its lists (Q-004); no quote |
| AP2533_007 | The "Create a quote" form shows a drop-down labelled "Vehicle type" placed before the Quote name | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_007-step4-VehicleTypeBeforeQuoteName_pass.png` | Label "Vehicle type", select above Quote name and first in the form |
| AP2533_008 | Changing the vehicle type in the drop-down reloads the form without error and keeps "Vehicle type" before Quote name | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_008-step5-BackToPassengerForm_pass.png` | RV CLASS A and back to Passenger both fine; typed name cleared on change (Q-007) |
| AP2533_009 | In the French interface the vehicle-type drop-down still sits before the quote name field | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_009-step4-EnglishRestored_pass.png` | "Type de véhicule" above the name field; that field's label stays "Quote name" (Q-009) |
| AP2533_010 | Saving the updated form with Brand, Model and Year empty is refused and creates no quote | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_010-step5-NameSearchNoEntities_pass.png` | Save refused with "This value should not be blank." on Brand, Model and Year |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2533_001 — Clicking "Décoder" with the Tesla VIN keeps the form on screen with TESLA, Model 3 and 2020 filled in — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, `/quotes` → "Create a quote", hard-reload `/quote/new/edit-vehicle`, build check (no "Décoder" click) | Form shows Quote name, VIN + "Décoder", Brand, Model, Year, "Save"; `novalidate` file and line recorded; row 1 → continue | URL = `/quote/new/edit-vehicle`; form `name="quote_vehicle"` shows Vehicle type (Passenger), Quote name, VIN + "Décoder", Brand* "Choose", Model* "Choose", Year*, "Save". Scripts loaded: `/build/runtime.0c796a0d.js` (no novalidate), `/build/app.18b4959e.js` (no separate vinlookup.js), 2 inline scripts and the Cloudflare beacon (no novalidate); 2 third-party scripts (freshchat widget, fw-cdn) could not be fetched. `app.18b4959e.js`: `r=t.attr("name") … r?i.push({name:r+"[novalidate]",value:!0})` and `o.push({name:i+"[novalidate]",value:!0})`. No hard-coded `vehicle[novalidate]` | ✅ | Table **row 1 — fix present**. Same bundle as AP2507_001 at ~10:58Z, so no redeploy since. Evidence: AP2533_001-step1-BuildCheckNovalidate_pass.txt |
| 2 `[Pre-Condition]` | Read every hidden input before the decode | Listed as observations (record-only) | Before decode: `quote_vehicle[transmission]` = automatic, `quote_vehicle[engineSizeUnit]` = l, `quote_vehicle[id]` = (empty), `quote_vehicle[_token]` (value not recorded) | ✅ | Record-only for Q-002. `quote_vehicle[id]` is new compared with the 2026-11-01 map |
| 3 | Leave Quote name empty, type VIN `5YJ3E1EA0LF734293`, click "Décoder" once, save request line | Stays on `/quote/new/edit-vehicle`; no error page, no 5xx; no redirect to `/quote/{id}/details` | `POST https://v2dev.garantieavantageplus.ca/quote/new/edit-vehicle` → 200 at 11:08:47Z; URL still `/quote/new/edit-vehicle`; no error page | ✅ | Evidence: AP2533_001-step3-DecoderRequest_pass.txt |
| 4 | Read every hidden input again | Recorded next to step 2 (record-only) | After decode: `transmission` = automatic, `engineSizeUnit` = l, **`fuelType` = BEV** (new), `id` = (empty), `_token`. No `cylinders` or `engineSize` inputs for this electric car | ✅ | Record-only for Q-002 |
| 5 `[Verification]` | Read VIN, Brand, Model, Year and the form card | VIN kept; Brand TESLA, Model Model 3, Year 2020; card not empty; no "Vehicle saved" | VIN = `5YJ3E1EA0LF734293`; Brand = "TESLA"; Model = "Model 3"; Year = "2020"; labels shown: Vehicle type, Quote name, VIN, Brand*, Model*, Year*; "Save" visible; "Vehicle saved" banner visible = false | ✅ | The empty white card from the ticket screenshot no longer appears |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_001-step1-BuildCheckNovalidate_pass.txt` — the scripts searched and the `novalidate` lines found, word for word
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_001-step3-DecoderRequest_pass.txt` — decoder request line (method, URL, status)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_001-step5-TeslaDecodedFormKept_pass.png` — full form after the decode with TESLA, Model 3, 2020 (final state)

### AP2533_002 — Clicking "Décoder" with the Tesla VIN fills the form's hidden vehicle inputs with the decoded values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–3 | Not executed | Not known — Q-002 | Not executed. Q-002 is still Open: AP-2533 has no answer to comment 19510 (orchestrator hand-off, 2026-11-07) | 🚫 | Blocked by Q-002 (Blocking, Open), comment 19510. The ticket author must name the hidden inputs and values the decode must fill. AP2533_001 steps 2 and 4 hold the before/after evidence |

**Screenshots:** none (not executed).

### AP2533_003 — Clicking "Décoder" without pressing Save creates no quote and keeps the dealer on the "Create a quote" form — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | VIN search baseline, inventory first row, cite build check | Baseline and first row recorded; build check row 1 | `/quotes?quote_search[keyword]=5YJ3E1EA0LF734293` = "No entities found" (0 rows, so AP2533_001's decode also saved nothing). `/vehicle/inventory` first row = vehicle **1156**, VIN `1FAHP35NX8W239204` (Ford Focus 2008, AP-2507's data). Build check row 1 (AP2533_001) | ✅ | Inventory row is record-only for Q-005 |
| 2 | Create a quote, type `QA-AP2533-003-110933` and the Tesla VIN, click "Décoder" once | Stays on `/quote/new/edit-vehicle`; no error page; no redirect | `POST /quote/new/edit-vehicle` → 200 at 11:09:40Z; URL still `/quote/new/edit-vehicle` | ✅ | Evidence: AP2533_003-step2-DecoderRequest_pass.txt |
| 3 `[Verification]` | Read URL, heading, Quote name, buttons, banner | URL `/quote/new/edit-vehicle`, heading "Create a quote", "Save" shown, no banner; Quote name kept | URL = `/quote/new/edit-vehicle`; heading = "Create a quote"; Quote name = "QA-AP2533-003-110933"; Brand TESLA / Model 3 / 2020; "Save" visible; "Vehicle saved" visible = false; hidden `quote_vehicle[id]` = (empty) | ✅ | |
| 4 | Without Save, search by name and by VIN; read the inventory first row | Searches load; inventory first row recorded (record-only) | Both searches loaded. Inventory first row still vehicle **1156**, VIN `1FAHP35NX8W239204` | ✅ | Q-005: the decode added no vehicle to the inventory |
| 5 `[Verification]` | Compare the searches with the baseline | Name search "No entities found"; VIN search unchanged | Name search `QA-AP2533-003` = "No entities found"; VIN search = "No entities found" (0 rows, same as step 1) | ✅ | The decode created no quote |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_003-step2-DecoderRequest_pass.txt` — decoder request line
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_003-step3-StillOnCreateForm_pass.png` — form still on "Create a quote" with the typed name and decoded vehicle
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_003-step5-NameSearchNoEntities_pass.png` — name search, "No entities found"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_003-step5-VinSearchUnchanged_pass.png` — VIN search still empty (final state)

### AP2533_004 — Saving the form after a decode creates exactly one quote carrying the decoded TESLA Model 3 2020 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Search `QA-AP2533-004`; cite build check and AP2533_003 | "No entities found"; row 1; no stop rule | "No entities found"; build check row 1; AP2533_003 PASS, stop rule not fired | ✅ | |
| 2 | Type `QA-AP2533-004-111033` and the Tesla VIN, "Décoder", read hidden `quote_vehicle[id]`; read that vehicle read-only in a new tab if non-empty | Form kept with TESLA / Model 3 / 2020; hidden id recorded | URL `/quote/new/edit-vehicle`; Quote name kept; Brand TESLA, Model "Model 3", Year 2020. Hidden: transmission = automatic, engineSizeUnit = l, fuelType = BEV, **`quote_vehicle[id]` = (empty)** | ✅ | The hidden id was empty, so there was no existing vehicle to read: no extra tab was opened (executor instruction 4 not triggered) |
| 3 | Click "Save" once on the form tab | Lands on `/quote/{id}/details` with "Vehicle saved"; record id | URL = `/quote/6602/details`; banner "Vehicle saved" visible; heading "#6602-QA-AP2533-004-111033"; vehicle links `/vehicle/1157/details` and `/vehicle/1157/edit` | ✅ | Quote **6602**, vehicle **1157** — saved at 11:10:56Z. Only one attempt was needed |
| 4 | Open the quote's vehicle; record details; compare with hidden id | Vehicle loads; details recorded (record-only) | `/vehicle/1157/details`: "TESLA Model 3 2020", VIN `5YJ3E1EA0LF734293`, Mileage empty, Designation "Manufacturer warranty"; no transmission, engine or fuel details shown on the page. Vehicle 1157 ≠ hidden id (empty) — the Save created a new vehicle | ✅ | Record-only (Q-002). No other vehicle was opened, edited or saved |
| 5 `[Verification]` | Check vehicle values; search `QA-AP2533-004` | TESLA, Model 3, 2020, VIN; exactly one quote, id 6602, named in its Vehicle cell | Vehicle 1157 = TESLA / Model 3 / 2020 / `5YJ3E1EA0LF734293`. Name search = 1 row, `/quote/6602/details`, Vehicle cell "QA-AP2533-004-111033 / TESLA Model 3 2020 / VIN: 5YJ3E1EA0LF734293", created Nov 7, 2026 | ✅ | No duplicate from the decode |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_004-step3-Quote6602VehicleSaved_pass.png` — quote 6602 details with "Vehicle saved"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_004-step5-Vehicle1157TeslaModel3_pass.png` — vehicle 1157 details, TESLA Model 3 2020
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_004-step5-NameSearchOneQuote6602_pass.png` — name search with exactly one row, quote 6602 (final state)

### AP2533_005 — Clicking "Décoder" with a malformed or empty VIN shows no error page, keeps the form and creates no quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form, cite build check and AP2533_003, type `QA-AP2533-005-111133` | Form with "Décoder"; row 1; stop rule not fired | Form shown with "Décoder"; name typed | ✅ | |
| 2 | VIN `ABC123`, "Décoder", wait 5 s, record message and request | No error page / 5xx; stays on `/quote/new/edit-vehicle`; card not empty; name, message and values record-only | `POST /quote/new/edit-vehicle` → 200 at 11:11:39Z; URL unchanged; card shows all six labels and "Save"; no message of any kind; Quote name = "QA-AP2533-005-111133" (kept); Brand "Choose", Model "Choose", Year empty; VIN still "ABC123" | ✅ | Q-003 record-only: no feedback is given for an undecodable VIN |
| 3 | Clear VIN, "Décoder", wait 5 s | Same objective checks; record-only for the rest | `POST /quote/new/edit-vehicle` → 200 at 11:12:07Z (a request is sent even with an empty VIN); URL unchanged; card not empty; no message; Quote name kept; Brand/Model "Choose", Year empty | ✅ | Q-003 record-only. Evidence: AP2533_005-step2-3-DecoderRequests_pass.txt |
| 4 | Without Save, search `QA-AP2533-005` | Search loads | Loaded | ✅ | |
| 5 `[Verification]` | Read the result | "No entities found" | "No entities found" | ✅ | Neither decode created a quote |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_005-step2-3-DecoderRequests_pass.txt` — both decoder request lines
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_005-step2-MalformedVinFormKept_pass.png` — form after decoding `ABC123`
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_005-step3-EmptyVinFormKept_pass.png` — form after decoding an empty VIN
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_005-step5-NameSearchNoEntities_pass.png` — name search, "No entities found" (final state)

### AP2533_006 — Decoding the Tesla VIN after choosing Ford, Focus and 2008 by hand keeps the form and creates no quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form; cite build check and stop rule | Form with "Décoder"; row 1; stop rule not fired | Form shown; row 1; stop rule not fired | ✅ | |
| 2 | Type `QA-AP2533-006-111231`; choose Ford, Focus, 2008 | Form shows Ford / Focus / 2008 | Brand = "Ford", Model = "Focus", Year = "2008", Quote name kept (choosing Brand re-rendered the Model list) | ✅ | |
| 3 | Tesla VIN, "Décoder" once | No error page; stays on the form; card not empty; Quote name kept | URL `/quote/new/edit-vehicle` at 11:13:07Z; card shows all six labels and "Save"; Quote name = "QA-AP2533-006-111231" | ✅ | |
| 4 | Read Brand/Model/Year; search by name | Each value is hand-chosen or decoded; none empty | Brand = "TESLA", Model = "Model 3", Year = "2020" — all three decoded values replaced the hand-chosen ones | ✅ | Q-004 record-only: the decode overwrites the dealer's choices |
| 5 `[Verification]` | Read the search result | "No entities found" | "No entities found" | ✅ | No quote created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_006-step4-DecodeOverHandChosen_pass.png` — form after the decode, TESLA / Model 3 / 2020 with the typed name
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_006-step5-NameSearchNoEntities_pass.png` — name search, "No entities found" (final state)

### AP2533_011 — Decoding the Tesla VIN on a second car type's form keeps the form on screen and creates no quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form; record the default type; cite build check and stop rule | Form shown; default recorded; row 1; stop rule not fired | Default "Vehicle type" = **Passenger** (`PASSENGER`); 23 types; row 1; stop rule not fired | ✅ | |
| 2 | Choose each type in list order (skip default) without decoding; stop at the first showing "Décoder" | Types checked recorded (Q-006) | 3 wheels → `/quote/new/edit-vehicle/3_WHEEL`, no "Décoder"; 5TH WHEEL → `/5TH_WHEEL`, no "Décoder"; ATV / UTV → `/quote/new/edit-vehicle/ATVUTV`, **"Décoder" shown** → chosen | ✅ | Q-006 record-only. Chosen type ATV / UTV, URL `/quote/new/edit-vehicle/ATVUTV` |
| 3 | Type `QA-AP2533-011-111400` and the Tesla VIN, "Décoder" once, save request line | No error page / 5xx; stays on the step-2 URL; no redirect | `POST /quote/new/edit-vehicle/ATVUTV` → 200 at 11:14:11Z; URL still `/quote/new/edit-vehicle/ATVUTV` | ✅ | Evidence: AP2533_011-step3-DecoderRequest_pass.txt |
| 4 `[Verification]` | Read the form card and banner | Card not empty; type still ATV / UTV; name and VIN kept; "Save" shown; no banner; Brand/Model/Year record-only | Vehicle type = "ATV / UTV"; Quote name = "QA-AP2533-011-111400"; VIN = `5YJ3E1EA0LF734293`; Brand = "Choose" with "ERROR This value is not valid."; Model = "Choose" with "ERROR Choose a valid model"; Year = "2020"; "Save" visible; "Vehicle saved" = false. Hidden: fuelType = BEV, **`quote_vehicle[id]` = 1157** | ✅ | Q-004 record-only: TESLA is not in the ATV / UTV brand list, so the form shows validation errors. The hidden id 1157 is the vehicle AP2533_004 just created (record-only; not saved, not opened) |
| 5 `[Verification]` | Without Save, search `QA-AP2533-011` | "No entities found" | "No entities found" | ✅ | The decode created no quote |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_011-step3-DecoderRequest_pass.txt` — decoder request line
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_011-step4-AtvUtvDecodeFormKept_pass.png` — ATV / UTV form after the decode
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_011-step5-NameSearchNoEntities_pass.png` — name search, "No entities found" (final state)

### AP2533_007 — The "Create a quote" form shows a drop-down labelled "Vehicle type" placed before the Quote name — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, `/quotes` → "Create a quote" | Form loads; URL recorded | URL = `/quote/new/edit-vehicle` | ✅ | |
| 2 | Read the type control: label, kind, default, count; old top-right button? | Recorded (Q-007/Q-008) | Label "Vehicle type" (`for="vehicle_type_switch"`); a `<select id="vehicle_type_switch">` with no `name`, shown as a Bootstrap-select; default "Passenger"; 23 types; inside the form `quote_vehicle`; no type button or type links outside the form | ✅ | The old top-right type button is gone |
| 3 | Read positions | Recorded | Page order: type select comes before `#quote_vehicle_quote_name`. Boxes: type control x=100, y=186 (1130 × 35); Quote name x=100, y=266 (1130 × 35) | ✅ | |
| 4 `[Verification]` | Compare label and position; screenshot | Label exactly "Vehicle type"; before in structure and above on screen | Label = "Vehicle type"; first field of the form; 80 px above Quote name, same left edge | ✅ | Matches REQ-003 AC 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_007-step4-VehicleTypeBeforeQuoteName_pass.png` — form card with "Vehicle type" above Quote name (final state)

### AP2533_008 — Changing the vehicle type in the drop-down reloads the form without error and keeps "Vehicle type" before Quote name — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form; record default and "Décoder" | Recorded | Default "Passenger"; "Décoder" shown | ✅ | |
| 2 | Type `QA-AP2533-008-111448`; choose RV CLASS A | No error page / 5xx; URL, reload and name recorded | Page navigated (full reload) to `/quote/new/edit-vehicle/RV_CLASS_A`; no error; Quote name = "" (typed value lost) | ✅ | Q-007 record-only: the typed quote name does not survive a type change |
| 3 | Read the type control on RV CLASS A; "Décoder"? | Recorded | Label "Vehicle type"; shows "RV CLASS A"; before Quote name in the page; type box y=186, Quote name y=266; "Décoder" not shown | ✅ | Q-006 record-only |
| 4 | Choose Passenger again | No error; form for that type | Navigated to `/quote/new/edit-vehicle`; no error; "Décoder" shown | ✅ | |
| 5 `[Verification]` | Check both forms | Card shown; label "Vehicle type"; shows the chosen type; before Quote name | RV CLASS A form: six labels, "Vehicle type" shows "RV CLASS A", first and above Quote name. Passenger form: six labels, shows "Passenger", first and above Quote name | ✅ | |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_008-step5-RvClassAForm_pass.png` — RV CLASS A form
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_008-step5-BackToPassengerForm_pass.png` — back on the Passenger form (final state)

### AP2533_009 — In the French interface the vehicle-type drop-down still sits before the quote name field — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form; record the language | Original language recorded | English ("Create a quote") | ✅ | |
| 2 | Open `?_locale=fr`; read labels and positions | French form, no error; labels recorded (Q-009) | Heading "Créer une cotation"; labels: **"Type de véhicule"**, **"Quote name"** (not translated), "NIV", "Marque", "Modèle", "Année". Type control y=186, quote-name field y=266, same left edge; type comes first in the page | ✅ | Q-009 record-only. The quote-name label has no French translation |
| 3 | Open `?_locale=en` | English labels again | Heading "Create a quote"; labels Vehicle type, Quote name, VIN, Brand, Model, Year | ✅ | Language restored |
| 4 `[Verification]` | Compare French positions; check restored language | Type before and above the name field in French; English restored | Both hold | ✅ | |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_009-step4-FrenchTypeBeforeQuoteName_pass.png` — French form, "Type de véhicule" above "Quote name"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_009-step4-EnglishRestored_pass.png` — English form after restoring (final state)

### AP2533_010 — Saving the updated form with Brand, Model and Year empty is refused and creates no quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the form | Form loads | `/quote/new/edit-vehicle` | ✅ | |
| 2 | Map every field, button and hidden input; compare with 2026-11-01 | Differences listed (Q-008) | Form `name="quote_vehicle"`, `id="vehiclesEditForm"`. Visible: `select#vehicle_type_switch` (no name, label "Vehicle type") — **added**; `#quote_vehicle_quote_name`; `#quote_vehicle_VIN` + "Décoder"; `select#vehicle_make` `quote_vehicle[make]`; `select#vehicle_model` `quote_vehicle[model]`; `input#vehicle_year` `quote_vehicle[year]` (number); submit "Save". Hidden: `quote_vehicle[transmission]`, `quote_vehicle[engineSizeUnit]`, **`quote_vehicle[id]` (added)**, `quote_vehicle[_token]`. The top-right type button is **removed** | ✅ | Q-008 record-only. The ids of Quote name, VIN, Brand, Model and Year are unchanged |
| 3 | Type `QA-AP2533-010-111539`, leave the rest empty, "Save" | Stays on the form; no redirect, banner or error page; message under Brand, Model, Year | URL still `/quote/new/edit-vehicle`; "Vehicle saved" = false; "ERROR This value should not be blank." under Brand, Model and Year; Quote name kept | ✅ | Same wording as on 2026-11-01 |
| 4 | Search `QA-AP2533-010` | Search loads | Loaded | ✅ | |
| 5 `[Verification]` | Read the result and the step-3 outcome | "No entities found"; Save refused with messages | "No entities found"; Save refused with a message on each empty required field | ✅ | |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_010-step3-SaveRefusedBlankFields_pass.png` — form with the three "should not be blank" messages
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_010-step5-NameSearchNoEntities_pass.png` — name search, "No entities found" (final state)

**Closing check (after all cases):**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_final-VinSearchOnlyQuote6602_pass.png` — at 11:16Z the VIN search for `5YJ3E1EA0LF734293` lists only quote 6602 (AP2533_004's Save): the six decodes of this run (001, 003, 004, 006, 011 and the two invalid-VIN decodes of 005) saved nothing.

---

## Environment Observations

- **Environment:** Dev (v2dev). Build bundle `/build/app.18b4959e.js` — the same as in today's AP-2507 re-test, so AP-2533's change is on Dev.
- **Stop rule:** never fired. No decode landed on `/quote/{id}/details` or showed "Vehicle saved".
- **Record-only observations** (open Judgement questions — no verdict taken from them):
  - Q-002: after decoding the Tesla VIN the form adds hidden `fuelType` = BEV; `transmission` = automatic and `engineSizeUnit` = l stay; no `cylinders`/`engineSize` for this electric car. `quote_vehicle[id]` is now present (empty) before any decode.
  - Q-003: an undecodable (`ABC123`) or empty VIN gives no message; the form, the typed quote name and Brand/Model "Choose" stay as they were. An empty VIN still sends the decoder request.
  - Q-004: on the Passenger form the decoded TESLA / Model 3 / 2020 replace hand-chosen values. On the ATV / UTV form the decoder sets Year 2020 but leaves Brand and Model on "Choose" with "This value is not valid." / "Choose a valid model".
  - Q-005: decoding adds no vehicle to the inventory.
  - Q-006: "Décoder" shows on Passenger and ATV / UTV, not on 3 wheels, 5TH WHEEL or RV CLASS A.
  - Q-007: changing the vehicle type reloads the page at `/quote/new/edit-vehicle/{TYPE}` and clears a typed quote name.
  - Q-008: see AP2533_010 step 2 — type select added, top-right button removed, hidden `quote_vehicle[id]` added; field ids unchanged.
  - Q-009: French labels "Type de véhicule" (type) and "Quote name" (not translated).
- After AP2533_004's Save, decoding the same VIN on another form puts hidden `quote_vehicle[id]` = 1157 (the vehicle just created) — consistent with the `domain` note that the decode returns an existing inventory vehicle's id.
- Data not touched: quotes 6437, 6588–6601; vehicles 915, 1067, 1143–1156; contract 2782; AP-2507's VIN `1FAHP35NX8W239204` was not decoded.

## Left behind on Dev

| Record | Id | Created by | Note |
|---|---|---|---|
| Quote | **6602** "QA-AP2533-004-111033" | AP2533_004 step 3 (11:10:56Z) | Dealers cannot delete quotes; no cleanup source exists |
| Vehicle | **1157** TESLA Model 3 2020, VIN `5YJ3E1EA0LF734293` | AP2533_004 step 3 | Carried by quote 6602 |

No other record was created: the names QA-AP2533-003/-005/-006/-008/-010/-011 all return "No entities found".

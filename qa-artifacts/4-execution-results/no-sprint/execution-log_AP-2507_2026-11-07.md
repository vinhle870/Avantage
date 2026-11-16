# Execution Log — AP-2507

**Ticket:** AP-2507 — [BUG-002][AP2477_007] Clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled (bug re-test)
**Test cases:** qa-artifacts/3-test-cases/AP2507_TestCases_001-003.md
**Run folder:** no-sprint

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, pipeline stage execute)
**Date:** 2026-11-07
**Environment:** Dev (v2dev)
**Base URL:** https://v2dev.garantieavantageplus.ca/
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Account:** the dealer account from the `env` source, *Dev Environment* section (`DEALER_USERNAME` / `DEALER_PASSWORD`), typed into the login form only. It signed in as "Test QA staging" (Dealer ID 1380). No credential is copied here.
**Duration:** 2026-11-07T10:56:59Z → 2026-11-07T11:01:42Z
**Gate B:** decided by qa-reviewer (R2 round 2) — rule B3, execute the current cases as written; F-7 / F-8 applied as executor guidance (see Environment Observations).
**Environment health check:** passed before dispatch (orchestrator). `env-check` source is `missing` — no separate smoke test file was run; the login and the `/quotes` load served as the smoke check.

| Metric | Value |
|---|:---:|
| Total test cases | 3 |
| Passed | 3 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (3 of 3)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2507_001 | Clicking "Décoder" with a valid VIN re-renders the form with Ford, Focus and 2008 and saves no quote | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step4-QuotesTopStill6599NoDecodeQuote_pass.png` | Build check row 1 (fix present); decode 200, form filled, top quote still 6599 |
| AP2507_002 | A quote saved by the dealer after decoding keeps the decoded vehicle details on its vehicle | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_002-step4-Vehicle1155EditFordFocus2008_pass.png` | One new quote 6600, new vehicle 1155 Ford Focus 2008; step 4 record-only |
| AP2507_003 | A quote name typed before clicking "Décoder" survives the decode and is saved with the quote | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_003-step4-QuotesList6601Named_pass.png` | Name kept across decode; quote 6601 saved with it |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2507_001 — Clicking "Décoder" with a valid VIN re-renders the form with Ford, Focus and 2008 and saves no quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/quotes`, record the top-row id (baseline); "Create a quote"; reload `/quote/new/edit-vehicle` (Passenger) and search every page script for `novalidate`, without clicking "Décoder" | Baseline recorded; form shows Quote name, VIN + "Décoder", Brand/Model "Choose", Year; novalidate file and line recorded; table row 1 → continue | Baseline = **6599** (top row `data-href="/quote/6599/details"`, Toyota Corolla 2022, AP-2505 data). `/quote` redirected to `/quote/new/edit-vehicle`, vehicle type "Passenger"; visible fields `quote_vehicle[quote_name]`, `quote_vehicle[VIN]` + "Décoder", `quote_vehicle[make]` "Choose", `quote_vehicle[model]` "Choose", `quote_vehicle[year]`, "Save". The page loads `/build/runtime.0c796a0d.js` and `/build/app.18b4959e.js` (no separate vinlookup.js); two third-party scripts could not be fetched. `app.18b4959e.js` (re-fetched with cache reload) contains `r=t.attr("name") … r?i.push({name:r+"[novalidate]",value:!0})` and `:input[id='"+i+"_VIN'], :input[id='"+i+"_quote_name'], :input[id='"+i+"__token']").serializeArray();o.push({name:i+"[novalidate]",value:!0})`. No hardcoded `vehicle[novalidate]` anywhere | ✅ | Table **row 1 — fix present**: the key is built from the form name, and the quote name and token are sent, exactly as AP-2533 describes. Evidence: AP2507_001-step1-BuildCheckNovalidate_pass.txt |
| 2 | Reload the form, leave Quote name empty and Brand "Choose", type VIN `1FAHP35NX8W239204`, click "Décoder" once, wait | Browser stays on `/quote/new/edit-vehicle`; no error page; decoder post answers 200, not 302; record the novalidate field name | `POST https://v2dev.garantieavantageplus.ca/quote/new/edit-vehicle` → **200** (AJAX). Body fields: `quote_vehicle[quote_name]` (empty), `quote_vehicle[VIN]`, `quote_vehicle[_token]`, **`quote_vehicle[novalidate]=true`**. URL stayed `/quote/new/edit-vehicle`; no error page, no message | ✅ | Discrepancy note settled for today's build: the post sends `quote_vehicle[novalidate]` (the 2026-11-01 log recorded `vehicle[novalidate]`). Record-only. Evidence: AP2507_001-step2-DecoderPostRequest_pass.txt |
| 3 `[Verification]` | Read VIN, Brand, Model, Year and list every visible field | VIN kept; Ford / Focus / 2008; only Quote name, VIN, Brand, Model, Year and "Save"; no "Vehicle saved" | VIN = "1FAHP35NX8W239204"; Brand selected = "Ford"; Model selected = "Focus"; Year = "2008"; Quote name = "" ; visible fields = quote_name, VIN, make, model, year; button "Save" visible; text "Vehicle saved" present = false. Hidden inputs after the re-render: transmission=automatic, cylinders=4, engineSize=2, engineSizeUnit=kW, fuelType=GASOLINE, id=863 | ✅ | The form came back filled, not empty — the AP-2507 symptom is gone |
| 4 `[Verification]` | Without clicking "Save", open `/quotes` and read the top row | Top row is still the baseline id; no unnamed quote with VIN `1FAHP35NX8W239204` above it | Top three rows (read from each row's `data-href`): `/quote/6599/details`, `/quote/6598/details`, `/quote/6597/details` — all Toyota Corolla 2022 (AP-2505 data). No row above 6599 | ✅ | The decode saved no quote. Evidence: AP2507_001-step4-QuotesTopRows_pass.txt (the list has no id column, so the screenshot alone cannot show ids) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step1-BuildCheckNovalidate_pass.txt` — the scripts searched and the two `novalidate` lines found in app.18b4959e.js, word for word
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step2-DecoderPostRequest_pass.txt` — decoder post: method, URL, status 200 and the body field names (token value omitted)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step3-DecodePrefillsFordFocus2008_pass.png` — the re-rendered "Create a quote" form: VIN kept, Brand Ford, Model Focus, Year 2008, Save still there
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step4-QuotesTopStill6599NoDecodeQuote_pass.png` — the quotes list after the decode, no new Ford Focus row at the top
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step4-QuotesTopRows_pass.txt` — the top-row ids 6599, 6598, 6597 read from the rows' links

### AP2507_002 — A quote saved by the dealer after decoding keeps the decoded vehicle details on its vehicle — Step Results

Baseline used (F-7): **6599** — AP2507_001's baseline; no quote was created between it and this case (AP2507_001 saved nothing, confirmed in its step 4).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | "Create a quote" (Passenger), VIN `1FAHP35NX8W239204`, Brand "Choose", "Décoder", wait; note every hidden `quote_vehicle[...]` input | Ford / Focus / 2008 filled, no quote saved; hidden inputs recorded | URL stayed `/quote/new/edit-vehicle`; Brand = "Ford", Model = "Focus", Year = "2008"; "Vehicle saved" present = false. Hidden: `transmission=automatic`, `cylinders=4`, `engineSize=2`, `engineSizeUnit=kW`, `fuelType=GASOLINE`, `id=863`, `_token` | ✅ | Record-only list. More hidden details than on 2026-11-01 (only transmission and engineSizeUnit then) |
| 2 | Type `QA-AP2507-002-105955` in Quote name, "Save"; open `/quotes` and find rows above the baseline | `/quote/{id}/details` with "Vehicle saved"; exactly one new quote with that name; no unnamed decode quote | Landed on `/quote/6600/details`; heading "#6600-QA-AP2507-002-105955"; banner "Vehicle saved"; vehicle card "Ford Focus 2008 VIN: 1FAHP35NX8W239204"; no error page. `/quotes` rows above 6599: only `/quote/6600/details` "QA-AP2507-002-105955 Ford Focus 2008 VIN: 1FAHP35NX8W239204" | ✅ | Quote **6600**. A blue "No entities found" note may show on fresh quotes (seen by AP-2477); not an error page |
| 3 | From the quote details open the vehicle's edit form `/vehicle/{vehicleId}/edit`, read-only | Ford Focus 2008, VIN `1FAHP35NX8W239204`, new vehicle id (not 915, not 1067) | The details page links `/vehicle/1155/edit`; opened it. Heading "Vehicle #1155"; VIN = "1FAHP35NX8W239204"; Make = "Ford"; Model = "Focus"; Year = "2008". Not saved | ✅ | Vehicle **1155** — new. The hidden `id=863` from the decode did not become the quote's vehicle |
| 4 `[Record-only]` | Read Fuel type, Transmission, Engine size + unit, Cylinders, Turbo | Values recorded beside step 1 and the reference decode; no verdict | Fuel type = "GASOLINE"; Transmission = "Automatic"; Engine size = "2", unit = "Litre"; Cylinders = "4"; Turbo checked = false; 4x4 = false; FWD = false; Condition = "new"; Designation = "Particular"; Price and Kilometers empty | ✅ | Matches the reference decode (GASOLINE, Automatic, 2 L, 4, turbo off). Not judged here: the hidden input after decode said `engineSizeUnit=kW`, yet the saved vehicle shows "Litre" — the same observation AP2477_008 failed on today and that is filed as AP-2552 (Medium) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_002-step2-Quote6600DetailsVehicleSaved_pass.png` — quote 6600 details with "Vehicle saved", the name and Ford Focus 2008
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_002-step2-QuotesOneNew6600_pass.png` — the quotes list with QA-AP2507-002-105955 as the only new row
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_002-step4-Vehicle1155EditFordFocus2008_pass.png` — vehicle 1155 edit form (full page), read-only, final state
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_002-003-QuotesListIds_pass.txt` — row ids read from the list links after each Save

### AP2507_003 — A quote name typed before clicking "Décoder" survives the decode and is saved with the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create a quote" (Passenger) | Form shows Quote name, VIN + "Décoder", Brand, Model, Year | `/quote` → `/quote/new/edit-vehicle`, all five fields and "Décoder" present | ✅ | Same session as AP2507_002 |
| 2 | Type `QA-AP2507-003-110048` in Quote name, then the VIN, Brand "Choose", "Décoder", wait | Stays on `/quote/new/edit-vehicle`; Ford / Focus / 2008; no "Vehicle saved" | URL = `/quote/new/edit-vehicle`; Brand = "Ford"; Model = "Focus"; Year = "2008"; "Vehicle saved" present = false | ✅ | — |
| 3 | Read Quote name, then "Save" | Quote name still holds the value; details page with "Vehicle saved"; record ids | Quote name = "QA-AP2507-003-110048" after the decode. Save → `/quote/6601/details`, banner "Vehicle saved", vehicle link `/vehicle/1156/edit` | ✅ | Quote **6601**, vehicle **1156** |
| 4 `[Verification]` | Read the name on the details page, then find quote 6601 on `/quotes` | Both show `QA-AP2507-003-110048` | Heading "#6601-QA-AP2507-003-110048"; card "Ford Focus 2008 VIN: 1FAHP35NX8W239204". `/quotes` row `/quote/6601/details` = "QA-AP2507-003-110048 Ford Focus 2008 VIN: 1FAHP35NX8W239204 - Nov 7, 2026" | ✅ | Name kept across the decode and saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_003-step3-NameKeptAfterDecode_pass.png` — the re-rendered form with the quote name still in place and Ford / Focus / 2008
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_003-step4-Quote6601NameOnDetails_pass.png` — quote 6601 details heading with the name
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_003-step4-QuotesList6601Named_pass.png` — quotes list, 6601 named QA-AP2507-003-110048 (final state)

---

## Environment Observations

- **Environment: Dev (v2dev).** Staging was never opened.
- **Gate B applied by reviewer:** rule B3 (execute the current cases). F-7: AP2507_002 used baseline 6599 (AP2507_001's, nothing created in between). F-8: quote ids were read from each `/quotes` row's `data-href` (the list has no id column and the rows are not links), without clicking them.
- **Build:** the `novalidate` key is built from the form name in `/build/app.18b4959e.js`; AP-2533's change is on Dev. The decoder post sends `quote_vehicle[novalidate]=true` plus the quote name and the token.
- **Record-only observations for AP-2477 / AP-2533 (not judged here):** after the decode the form carries hidden `cylinders`, `engineSize`, `fuelType` and `id=863` in addition to `transmission` and `engineSizeUnit`; the hidden `engineSizeUnit` is `kW` while the saved vehicle 1155 shows "Litre" (already filed as AP-2552 from AP2477_008; not re-filed). Hidden `id=863` is an existing inventory vehicle with this VIN (per the `domain` source). The hidden `id=863` was not reused — Save created new vehicles 1155 and 1156.
- **Left behind on Dev (dealers cannot delete quotes):**
  - quote **6600** "QA-AP2507-002-105955" — vehicle **1155**, Ford Focus 2008, VIN `1FAHP35NX8W239204` (AP2507_002);
  - quote **6601** "QA-AP2507-003-110048" — vehicle **1156**, Ford Focus 2008, VIN `1FAHP35NX8W239204` (AP2507_003).
  - AP2507_001 saved nothing. Quotes 6588–6599, vehicles 1143–1154, contract 2782, quote 6437 and vehicles 1067 / 915 were not opened or changed.
- Third-party scripts (Freshchat widget, fw-cdn) could not be fetched by the page for the build check; they are chat widgets, not the application's own code.
- The browser tab was logged out and closed at 11:01:42Z.

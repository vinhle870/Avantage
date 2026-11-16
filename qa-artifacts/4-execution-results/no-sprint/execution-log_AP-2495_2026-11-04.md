# Execution Log — AP-2495 (Cannot view vehicle detail's page) — bug re-test

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, QA batch Wave 2)
**Environment:** Dev
**Date:** 2026-11-04
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-04T16:51:19Z → 2026-11-04T16:54:08Z
**Ticket status at execution:** "QA" (not QC) — executed by the user's decision for this batch; a FAIL would be recorded against AP-2495, never filed as a new bug
**Test-case file:** qa-artifacts/3-test-cases/AP2495_TestCases_001-004.md
**Gate B:** Execute the current cases AP2495_001–004 — rule B3 — decided by qa-reviewer (R2 round 2)

**Environment health check (before execution):** PASS — `GET https://v2dev.garantieavantageplus.ca/login` answered HTTP 200 and the login form (Courriel, Mot de passe, Login button) was visible at 16:51:24Z. Screenshot: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/envcheck-DevLoginPage_pass.png`. The `env-check` knowledge source is declared `missing`, so this login-page check is the whole smoke test.

**Account:** the Dev dealer account from the "Dev Environment" section of the `env` source (credentials not reproduced here). After sign-in the dashboard heading read "Hi Vinh Le 1 Welcome to Test QA staging's account" and the header showed the dealership name "Test QA staging". No Dealer ID is shown on the Dev dashboard.

| Metric | Value |
|---|:---:|
| Total test cases | 4 |
| Passed | 4 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (4 of 4)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2495_001 | Opening the vehicle details page by URL shows the vehicle instead of the server error | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_001-step3-Vehicle915DetailsLoaded_pass.png` | Vehicle 915 exists on Dev; `/vehicle/915/details` HTTP 200, no error text; fallback not needed |
| AP2495_002 | Switching between the Details, Window sticker and Quotes tabs opens each tab without a server error | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_002-step5-AllTabsNoError_pass.png` | All three tabs HTTP 200 with no error page |
| AP2495_003 | Opening a vehicle from the Inventory list shows its details page, for vehicle V and for a second vehicle | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_003-step4-VehicleB1142DetailsFromInventory_pass.png` | Vehicle A 915 (page 21) and Vehicle B 1142 both opened by row click, correct VIN |
| AP2495_004 | The "Create quote" and "Edit vehicle" actions still open their forms without a server error | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_004-step5-Vehicle915UnchangedAfterActions_pass.png` | Both forms opened HTTP 200; nothing saved; 915 unchanged |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

**Vehicle under test V:** 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008, 5000 km, COMMERCIAL. It exists on Dev (as recorded in `test-data` line 23, verified 2026-11-01), so the 404 fallback in the Execution Context was **not** used.

---

## Step-by-Step Results

### AP2495_001 — Opening the vehicle details page by URL shows the vehicle instead of the server error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/login` on Dev and sign in with the Dev dealer account | The dealer dashboard opens; record dealership name and Dealer ID | URL = `/`; heading = "Hi Vinh Le 1 Welcome to Test QA staging's account"; header dealership = "Test QA staging"; Dealer ID not shown on the page | ✅ | Signed in at 16:51:40Z; Dealer ID is not displayed on the Dev dashboard, recorded as not shown |
| 2 | Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` | A details page loads for V; record URL and HTTP status | URL = `/vehicle/915/details`; main document `GET /vehicle/915/details` = HTTP 200; no 404, so no fallback | ✅ | Page loaded at 16:51:46Z |
| 3 `[Verification]` | Read heading, VIN, tabs and header buttons; search for "Too few arguments" and "difficultés techniques" | No 5xx; neither error text shown; page shows VIN `1FAHP35NX8W239204` | Heading = "Vehicle VIN:1FAHP35NX8W239204"; summary = "Ford Focus 2008 — VIN: 1FAHP35NX8W239204 Mileage: 5000km Designation: COMMERCIAL"; text "Too few arguments" present = false; text "difficultés techniques" present = false. Recorded: tabs = Details (`/vehicle/915/details`), Window sticker (`/vehicle/915/window-sticker`), Quotes (`/vehicle/915/quotes`); header links = Back (`/vehicle/inventory`), Edit vehicle (`/vehicle/915/edit`), Create quote (`/quote/new/client?fromVehicleId=915`); a "Manufacturer warranty" heading is shown | ✅ | The crash reported in AP-2495 no longer occurs on Dev at 16:51:50Z |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/envcheck-DevLoginPage_pass.png` — the Dev login page used for the environment health check
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_001-step3-Vehicle915DetailsLoaded_pass.png` — vehicle 915's details page loaded normally, showing its VIN, three tabs and the two header actions

### AP2495_002 — Switching between the Details, Window sticker and Quotes tabs — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Signed in (same session); open `/vehicle/915/details` | Details page of V loads with V's VIN, no error page | URL = `/vehicle/915/details`; HTTP 200; heading = "Vehicle VIN:1FAHP35NX8W239204" | ✅ | Same session as AP2495_001 |
| 2 | Click the "Window sticker" tab | Tab opens without an error page; record URL, status, content | URL = `/vehicle/915/window-sticker`; `GET` = HTTP 200; heading = "Window sticker"; an editable form is shown (Image filename Browse, Stock number, Color, Real kilometers, Odometer mesurement unit, Doors, Fuel type, Equipments, Repairs done, Repairs optional, Previous use group, Legal warranty, Legal warranty details, Other Warranty End date, Other warranty km, Other warranty desc, Save button); error texts present = false | ✅ | Opens in the same browser tab, no file download. Save was not clicked |
| 3 | Click the "Quotes" tab | Tab opens without an error page; record URL, status, number of quotes | URL = `/vehicle/915/quotes`; `GET` = HTTP 200; table columns = Client, Vehicle, Program, Date Created; 10 rows on page 1 with pagination 1–4 (Next, Last); first rows are "Gap Auto2499-012-…" quotes dated Nov 4, 2026; error texts present = false | ✅ | The list holds about 31–40 quotes (4 pages of 10), many created today by the regression suite. No quote opened or changed |
| 4 | Click the "Details" tab | Returns to V's details, no error page | URL = `/vehicle/915/details`; `GET` = HTTP 200; VIN `1FAHP35NX8W239204` present = true | ✅ | — |
| 5 `[Verification]` | Review the three tab openings | No 5xx; no "difficultés techniques" page; no "Too few arguments" text on any tab | Requests: `/vehicle/915/window-sticker` 200, `/vehicle/915/quotes` 200, `/vehicle/915/details` 200; both error texts absent on every tab; all three tabs named in `test-data` are present | ✅ | Checked at 16:52:22Z — the shared tab code (TabsTrait) works on every tab |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_002-step5-AllTabsNoError_pass.png` — back on the Details tab after opening Window sticker and Quotes, no error shown

### AP2495_003 — Opening a vehicle from the Inventory list, for vehicle V and a second vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Vehicles → Inventory (`/vehicle/inventory` by URL) | Inventory list loads; record URL | URL = `/vehicle/inventory`; HTTP 200; columns = ID, VIN, Brand, Model, Year, Km; 10 rows per page, 54 pages, ordered by ID descending; no search box in the list (only the global header "Search") | ✅ | Opened by URL because the sidebar Vehicles group is collapsed |
| 2 | Find Vehicle A (VIN `1FAHP35NX8W239204`) and click its row | Vehicle A's details page opens; record URL, status, how reached | Found on `/vehicle/inventory?page=21` (row "915 1FAHP35NX8W239204"); clicked the VIN cell → URL = `/vehicle/915/details`; `GET` = HTTP 200; heading = "Vehicle VIN:1FAHP35NX8W239204" | ✅ | Rows carry no `<a>`, `href` or `data-href`; the row itself is clickable (cursor pointer) and navigates by script |
| 3 | Return to Inventory; pick Vehicle B by the rule; open it the same way | Vehicle B's details page opens; record URL, status | Page 1 first row = ID 1142, VIN `AP2497A3811007474` — not 915/V and not in 1067, 1082–1097, 1106–1118, 1125–1135, so it is Vehicle B. Clicked its VIN cell → URL = `/vehicle/1142/details`; `GET` = HTTP 200 | ✅ | 1142 was read only. Its VIN prefix shows it was created by the AP-2497 regression run earlier today; it is not on the reserved list |
| 4 `[Verification]` | Compare the details pages with the rows they came from | No 5xx; no error text; each page shows the VIN of its row | 915 page: heading "Vehicle VIN:1FAHP35NX8W239204", summary "Ford Focus 2008 … Designation: COMMERCIAL" (row VIN `1FAHP35NX8W239204`). 1142 page: heading "Vehicle VIN:AP2497A3811007474", summary "Toyota Corolla 2022 — VIN: AP2497A3811007474 Mileage: 25000km Designation: PARTICULAR" (row VIN `AP2497A3811007474`, Km 25000). Error texts present = false on both | ✅ | Checked at 16:53:24Z — the page opens for any vehicle, not just 915 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_003-step4-VehicleB1142DetailsFromInventory_pass.png` — vehicle 1142's details page opened from its Inventory row, showing the matching VIN

### AP2495_004 — "Create quote" and "Edit vehicle" still open their forms — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/vehicle/915/details` | Details page of V loads; record V's VIN | URL = `/vehicle/915/details`; HTTP 200; VIN shown = `1FAHP35NX8W239204`; summary "Ford Focus 2008, Mileage 5000km, Designation COMMERCIAL" | ✅ | — |
| 2 | Click "Create quote" in the header; do not fill or save | A form opens without an error page; record URL, status, Vehicle card | URL = `/quote/new/client?fromVehicleId=915`; `GET` = HTTP 200; main heading = "Client"; right sidebar shows a "Vehicle" card "Ford Focus 2008 VIN: 1FAHP35NX8W239204"; error texts present = false | ✅ | URL matches the route recorded in `domain`. Nothing filled in, no quote created |
| 3 | Browser Back to details, then click "Edit vehicle"; change nothing | Edit form opens at `/vehicle/915/edit` without an error page; record URL, status, field values | Browser URL stays `/vehicle/915/details`; the form opens in a modal dialog loaded by `GET /vehicle/915/edit` = HTTP 200; dialog heading = "Vehicle #915". Field values (record only): VIN `1FAHP35NX8W239204`, Brand Ford, Model Focus, Year 2008, Vehicle Price 10000.00, Kilometers 5000, Condition new, Fuel type GASOLINE, Transmission Automatic, Cylinders 4, Engine size 2, Engine size unit Litre, Designation **Particular**, Turbo/4x4/AWD unchecked, manufacturer warranty dates and mileages empty; buttons = Back, Save. Error texts present = false | ✅ | Route differs from the case's expectation only in that it is a modal over the details page, not a page navigation — recorded, not judged. Save was not clicked |
| 4 | Return to `/vehicle/915/details` without saving | V's details page shows again, no error page | The dialog's "Back" link navigated to `/vehicle/inventory` (HTTP 200), not to the details page; browser Back then returned to `/vehicle/915/details` (HTTP 200), dialog hidden | ✅ | Recorded: the edit modal's Back goes to the Inventory list |
| 5 `[Verification]` | Review steps 2–4 and compare V with step 1 | No 5xx; no error text; nothing saved — same VIN and summary as step 1 | Requests: `/quote/new/client?fromVehicleId=915` 200, `/vehicle/915/edit` 200, `/vehicle/inventory` 200, `/vehicle/915/details` 200; error texts absent; details page still shows "Ford Focus 2008, VIN 1FAHP35NX8W239204, Mileage 5000km, Designation COMMERCIAL" — identical to step 1 | ✅ | Checked at 16:54:08Z. No POST was sent; vehicle 915 left unchanged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_004-step3-EditVehicleModalOpen_pass.png` — the Edit vehicle modal for vehicle 915, opened over the details page, nothing changed
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_004-step5-Vehicle915UnchangedAfterActions_pass.png` — vehicle 915's details page after both actions, with the same VIN and summary as at the start

---

## Environment Observations

- **The fix is present on Dev.** No page request made in this run (vehicle details, its three tabs, the Inventory list pages, the quote client form and the edit form) answered 5xx, and neither the "Too few arguments to function" text nor the French "difficultés techniques" error page appeared anywhere (checked 16:51:50Z–16:54:08Z UTC).
- **Edit form designation differs from the details page (observation, not judged).** Vehicle 915's details page says Designation COMMERCIAL, but the Edit vehicle modal pre-selects "Particular". The ticket says nothing about this, so it is not a failure of AP-2495. It matters for anyone who opens the edit form on 915 and clicks Save: the stored designation would likely change from COMMERCIAL to Particular. Nobody should save that form on 915.
- **Regression-suite data on Dev.** The Inventory list starts with vehicles 1137–1142 (VINs prefixed AP2497A / AP2498A) and vehicle 915's Quotes tab lists many quotes dated 2026-11-04, created by the Playwright regression run (16:02–16:50Z). This run only read them.
- **Test data left behind:** none. Every case was read-only — no form was saved, no quote or vehicle created. Records read: vehicle 915 and vehicle 1142.
- The test-case Execution Context agreed with every knowledge source; no stale fact was found.

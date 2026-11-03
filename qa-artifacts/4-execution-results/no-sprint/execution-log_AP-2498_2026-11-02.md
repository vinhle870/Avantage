# Execution Log — AP-2498: Roadside protection — keep the existing vehicle form visible and add VIN + Year

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-ticket-pipeline s4, worker run `--from s4 --until s4c`)
**Date:** 2026-11-02 (local; 2026-11-01 23:10–23:27 UTC)
**Environment:** Dev (v2dev)
**Base URL:** https://v2dev.garantieavantageplus.ca/ — the "Dev Environment" section of the `env` source (`qa-artifacts/base-test/execute.env.md`). v2staging was never opened, by the user's decision for this run.
**Login:** the shared dealer account from the `env` source (Dev section), typed only into the login form. Signed in as "Test QA staging" (dealer 1380). No credential is copied into this log.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, English UI (`?_locale=en`)
**Build footer:** "Avantage Plus System v2.0.0"
**Duration:** 23:10 → 23:27 UTC
**Run folder:** `no-sprint` (from `qa-artifacts/.pipeline/AP-2498.md`)

| Metric | Value |
|---|:---:|
| Total test cases | 14 |
| Passed | 2 |
| Failed | 10 |
| Blocked | 2 |
| Skipped | 0 |
| **Pass rate** | **14% (2 of 14)** |

> The test cases were designed against v2staging; this run is on Dev. Their Execution Context still says "v2staging" — the `env` source's Dev section wins, per the run's instruction.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2498_001 | Vehicle with no VIN: form shown, no-products notice below it | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_001-step4-FormAboveDifferentNotice_fail.png` | Notice is below the form but says "No road side protection products are available for this vehicle." — not the required text |
| AP2498_002 | Complete vehicle: form shown above the product results | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_002-step5-FormCollapsedAboveTiers_fail.png` | With products listed, the form's fields are collapsed behind an "Edit" link; only a summary line shows |
| AP2498_003 | Stored make/model + products: form still shown with stored values | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_003-step5-StoredHondaFormCollapsed_fail.png` | Stored Honda/Accord kept and tiers below, but the form is collapsed behind "Edit" |
| AP2498_004 | Form holds only VIN, Year, Make, Model and Continue | High | 🚫 | 0 | 0 | — | Parked at Gate B (R2 round 3) — not run |
| AP2498_005 | Only VIN required; no VIN lookup | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_005-step5-VinNotRequiredNoLookup_fail.png` | VIN has no `required` attribute; the rest of the step holds |
| AP2498_006 | Empty-VIN submit is refused and saves nothing | High | ❌ | 2 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_006-step3-EmptyVinSubmitAccepted_fail.png` | Empty-VIN submit accepted: tiers returned and Honda/Accord saved |
| AP2498_007 | Make list filled; Model list follows the Make | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_007-step5-ModelListFollowsMake_pass.png` | 151 makes; Toyota 63 models, Honda 23; Corolla cleared on Make change |
| AP2498_008 | New quote: form shows the vehicle's VIN and year | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_008-step4-VinYearPrefilledFromVehicle_pass.png` | VIN and Year from the vehicle; Make/Model on "Choose" (Q-009) |
| AP2498_009 | Submitted VIN, Make, Model kept on re-open | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_009-step3-SubmitAcceptedFormCollapsed_fail.png` | Values persisted (step 5 passes); after the submit the form is collapsed |
| AP2498_010 | VIN/year different from the vehicle's | Medium | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_010-step3-SubmitAcceptedFormCollapsed_fail.png` | Submitted values shown, vehicle unchanged; form collapsed after submit |
| AP2498_011 | Completing the vehicle refreshes results in place | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_011-step4-TiersInPlaceFormCollapsed_fail.png` | Tiers replaced the notice in place (AJAX), but the form collapsed |
| AP2498_012 | VIN-only submit accepted, notice below the form | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_012-step3-VinOnlyAcceptedWrongNotice_fail.png` | Accepted and VIN saved; notice has the wrong text (same as AP2498_001) |
| AP2498_013 | Changing the vehicle updates results, form stays | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_013-step4-SameTiersFormCollapsed_fail.png` | Form collapsed after submit; same 5 tiers for the 2003 Accord (Q-001) |
| AP2498_014 | A tier can still be chosen in the product step | Medium | 🚫 | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_014-step5-TierSelectedNoGenerateButton_blocked.png` | AP-2508: no "Save and Generate Contract" button or VIN field in the product section |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

**Order of execution.** AP2498_001, 005, 002, 003, 006 (High), 007 (Medium), 008, 009 (High), 010 (Medium), 011, 012 (High), 013, 014 (Medium). AP2498_004 was not run.

---

## Facts that apply to every case

- **Vehicle N could not be prepared without a VIN.** The inventory add form `/vehicle/new/edit/PASSENGER` refused an empty VIN on save with "Error This value is required." under VIN (seen once, on AP2498_001, screenshot `AP2498_001-step1-InventoryRefusesEmptyVIN_pass.png`). Every Vehicle N case therefore used its fallback VIN, per the shared Vehicle N rule, and the fallback-VIN branch of the VIN checks applies to AP2498_006, 009 and 012.
- **The add-vehicle form on Dev** also requires Cylinders and Engine size; `4` and `2` were typed (the form's other required fields keep their defaults: Condition "new", Fuel type GASOLINE, Transmission Automatic, Engine size unit Litre, Designation Particular). Every vehicle is a Toyota Corolla 2022, 15,000 km, price 20,000.
- **Client e-mail numbers.** To avoid a clash with other runs using `client.stage.NNN`, each client used `client.stage.2498NNN@yopmail.com` with NNN = the case number (e.g. `client.stage.2498001@yopmail.com`).
- **The vehicle step** `/quote/{id}/vehicle` was already pre-filled with the vehicle, Delivered at `2026-11-01` and Price `20000`; Save returned to `/quote/{id}/details` with "Vehicle saved".
- **The roadside flow is a modal on the quote page (Q-002).** The red **+** on the "Roadside Protection" row (`href=/quote/{id}/road-side-protection`) opens it in a modal; the URL stays `/quote/{id}/details`. The modal has a "Vehicle" section with an **Edit** link, the form `quote_auto_shield_make_model` (VIN text input, Make select, Model select, Year number input, **Continue**), then either a red `alert alert-danger` notice or a "Product info" section — the form `quote_auto_shield` with five tier radios, "Policy Sale price*" and **Save**.
- **When no products are listed, the form is expanded.** When products are listed, the form's fields are inside a closed `collapse` element: only the heading "Vehicle" and a summary line ("2022 Toyota Corolla · 2T1BURHE5NC498002") show; VIN, Make, Model, Year and Continue have zero size until **Edit** is clicked.
- **The no-products notice on Dev** reads "No road side protection products are available for this vehicle." (red alert). The text "In order to get a quote for road side protection, please specify the make and model of the vehicle." never appeared in any case.
- **AutoShield on Dev (Q-001).** With Make and Model empty, every vehicle got the no-products notice. As soon as any Make and Model was submitted (Toyota Corolla, Honda Accord, any year 2003–2022, and even with an empty VIN), the same five tiers came back: Protection Hasards PNEU + ROUE | Standard | 12 months | 200$ · same 24 months | 300$ · ($4,000 Aggregate) 12 months | 123$ · ($10,000 Aggregate) 12 months | 316$ · Protection Hasards Routiers ILLIMITE | Standard | 12 months | 445.5$.
- **A Continue creates the roadside product row.** After the first Continue, the quote's "Roadside Protection" row shows "CA$0.00" and a "⋯" menu (Edit · Generate Contract · Delete) instead of the **+**. "Re-open the flow" in steps 4 of 003/006/009/012 and step 5 of 010 was therefore done through ⋯ → **Edit**, which opens the same modal (`/quote/{id}/road-side-protection`). Generate Contract and Save were never pressed.
- **Continue posts in place.** `POST /quote/{id}/road-side-protection` → 200 re-renders the modal; the page does not reload and the URL stays `/quote/{id}/details` (Q-011). Choosing a Make calls `GET /quote/{id}/road-side-protection/get-models?make=17%3AToyota`.

---

## Step-by-Step Results

### AP2498_001 — Opening roadside protection for a vehicle with no VIN shows the vehicle form with the no-products notice below it — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in; create Vehicle N (VIN empty) | Details page opens, Toyota Corolla 2022, empty VIN; id recorded | Save with VIN empty → page stayed on `/vehicle/new/edit/PASSENGER`, VIN error "Error This value is required.". Saved with fallback VIN `2T1BURHE3NC498001` → `/vehicle/1106/details`, "Vehicle saved", "Toyota Corolla 2022 · VIN: 2T1BURHE3NC498001 · Mileage: 15000km" | ✅ | Set-up only: the no-VIN state could not be prepared through the inventory form (shared Vehicle N rule; reviewer F-2) |
| 2 `[Pre-Condition]` | Create quote, client `Roadside2498-001`, vehicle step | `/quote/{id}/details`, heading `#{id} - Roadside Roadside2498-001`, Roadside row "- None Selected -" with + | URL `/quote/6514/details`; heading "#6514 - Roadside Roadside2498-001 2T1BURHE3NC498001"; row "Roadside Protection — - None Selected -" with a + link | ✅ | Quote 6514, client `client.stage.2498001@yopmail.com` |
| 3 | Click + on Roadside Protection | Flow opens, no error page; record modal or page (Q-002) | A modal opened on `/quote/6514/details`; no error | ✅ | Q-002: modal |
| 4 `[Verification]` | Inspect the flow top to bottom | Form (VIN, Year, Make, Model, Continue) shown; notice "In order to get a quote for road side protection, please specify the make and model of the vehicle." below Continue; no tiers | Form expanded: VIN = "2T1BURHE3NC498001", Make = "Choose", Model = "Choose", Year = "2022", Continue visible. Below Continue: red alert (`alert alert-danger`) text = "No road side protection products are available for this vehicle."; no tier radios | ❌ | The position is right, but the notice is not the message the ticket names. A dealer is told nothing about what to fill in. Q-013: red alert styling |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_001-step1-InventoryRefusesEmptyVIN_pass.png` — the inventory add form refusing an empty VIN ("This value is required.")
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_001-step4-FormAboveDifferentNotice_fail.png` — the modal: expanded form, and below it the red notice with the different text

### AP2498_002 — Opening roadside protection for a complete vehicle shows the vehicle form above the product results — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle P, VIN `2T1BURHE5NC498002` | Details page, Toyota Corolla 2022, that VIN | `/vehicle/1108/details`, "Toyota Corolla 2022 · VIN: 2T1BURHE5NC498002" | ✅ | Vehicle 1108 |
| 2 `[Pre-Condition]` | Create quote, client `Roadside2498-002` | `/quote/{id}/details`; Roadside "- None Selected -" with + | `/quote/6516/details`; Roadside row "- None Selected -" with + | ✅ | Quote 6516 |
| 3 | Click + | Flow opens, no error | Modal opened: form expanded, VIN "2T1BURHE5NC498002", Year "2022", Make/Model "Choose"; red notice "No road side protection products are available for this vehicle." | ✅ | — |
| 4 | Notice shown → choose Toyota / Corolla, Continue | No error page; record whether tiers appear | Continue → modal re-rendered, no error; 5 tiers listed (see the common facts); notice gone | ✅ | Q-001: products with Make/Model set |
| 5 `[Verification]` | Inspect the flow top to bottom | Form (VIN, Year, Make, Model, Continue) shown at the top, tiers below | Top: heading "Vehicle", summary "2022 Toyota Corolla · 2T1BURHE5NC498002" and an "Edit" link. The form's VIN, Make, Model, Year and Continue are inside a closed `collapse` (visible = false, zero size). Below: "Product info" with the 5 tiers, "Policy Sale price*", Save. After clicking Edit the form opens above the tiers with VIN 2T1BURHE5NC498002, Toyota, Corolla, 2022 | ❌ | The form is rendered and above the tiers, but hidden until "Edit" is clicked — the dealer does not see the vehicle form in the products state |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_002-step5-FormCollapsedAboveTiers_fail.png` — products state: only the "Vehicle" summary line and Edit above the tiers
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_002-step5-FormAfterEditClick_fail.png` — the same modal after clicking Edit: the form opens above the tiers

### AP2498_003 — With make and model already stored and products returned, the vehicle form is still shown with the stored values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle P, VIN `2T1BURHE7NC498003` | Details page; id recorded | `/vehicle/1109/details` | ✅ | Vehicle 1109 |
| 2 `[Pre-Condition]` | Create quote, client `Roadside2498-003` | `/quote/{id}/details` | `/quote/6517/details` | ✅ | Quote 6517 |
| 3 | +; Make Honda, first Model, VIN/Year as prefilled; Continue | No error; flow shown again with Honda/its Model; record tiers | Honda's first real model is "Accord" (list starts "Choice"). VIN prefilled "2T1BURHE7NC498003", Year "2022". Continue → no error; summary "2022 Honda Accord · 2T1BURHE7NC498003"; Make = Honda, Model = Accord; 5 tiers listed | ✅ | Products returned |
| 4 | Close, reload quote page, re-open | Flow opens again, no error | Reloaded `/quote/6517/details`: the Roadside row now shows "CA$0.00" and a ⋯ menu (no +). ⋯ → Edit opened the modal, no error | ✅ | The + is replaced after the first Continue — re-opened through Edit (same route) |
| 5 `[Verification]` | Inspect the flow | Form shown with Make/Model = step-3 values (not Toyota/Corolla), tiers below | Make = "Honda", Model = "Accord", VIN "2T1BURHE7NC498003", Year "2022" (stored values, not the vehicle's Toyota Corolla); 5 tiers below. The form's fields and Continue are collapsed behind "Edit" (visible = false); only "Vehicle — 2022 Honda Accord · 2T1BURHE7NC498003" shows | ❌ | Stored values pass; the form is not shown until Edit is clicked — same fault as AP2498_002 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_003-step5-StoredHondaFormCollapsed_fail.png` — re-opened modal: summary line with Honda Accord, form collapsed, tiers below

### AP2498_004 — The roadside-protection form holds only VIN, Year, Make, Model and Continue — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–5 | Not run | — | Not run | 🚫 | Parked at Gate B (R2 round 3): step 5 "nothing else" vs a probable hidden CSRF input. Observation from other cases (not a result): the form `quote_auto_shield_make_model` carries VIN, vehicleMake, vehicleModel, vehicleYear, continue and a hidden `quote_auto_shield_make_model[_token]` |

**Screenshots:** none — the case was not run.

### AP2498_005 — Only VIN is required on the roadside-protection form, and typing a VIN triggers no VIN lookup — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle N | Details page; id recorded | Empty VIN refused (as on AP2498_001); saved with fallback `2T1BURHE0NC498005` → `/vehicle/1107/details` | ✅ | Fallback branch |
| 2 `[Pre-Condition]` | Create quote `Roadside2498-005`; click + | Quote page; flow opens, no error | `/quote/6515/details`; modal opened, form expanded, no-products notice | ✅ | Quote 6515 |
| 3 | Read `required` and labels of VIN/Year/Make/Model; look for a lookup button | Record required state and labels (Q-003) | VIN: `required` = false, label "VIN", class `form-control` (no `vinlookup`). Year: required = false, label "Year". Make: required = false, label "Make". Model: required = false, label "Model". No "*" on any label. No button or icon next to VIN; the modal's buttons are Edit, the two select toggles and Continue | ✅ | Q-003: no asterisks |
| 4 | Clear VIN, type `2T1BURHE4NC498105`, Tab, wait 3 s | VIN shows the value; no error page | VIN = "2T1BURHE4NC498105"; no error; URL unchanged | ✅ | — |
| 5 `[Verification]` | Compare | VIN has `required`; Year/Make/Model not; no lookup; nothing filled from the VIN | VIN `required` attribute absent (required = false). Year/Make/Model have none — as expected. No lookup button and no `vinlookup` class. After step 4: Year = "2022", Make = "" (Choose), Model = "" (Choose) — unchanged | ❌ | VIN is not required, so the form can be sent without it (see AP2498_006) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_005-step5-VinNotRequiredNoLookup_fail.png` — the form after typing the VIN: no lookup button, Make/Model still "Choose"

### AP2498_006 — Submitting the roadside-protection form with an empty VIN is refused and saves nothing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle N | Details page | Saved with fallback `2T1BURHE2NC498006` → `/vehicle/1110/details` | ✅ | Fallback branch |
| 2 `[Pre-Condition]` | Quote `Roadside2498-006`; + | Flow opens | `/quote/6518/details`; modal opened | ✅ | Quote 6518 |
| 3 | VIN empty (cleared), Year `2022`, Make Honda / Accord; Continue | Submit refused; stays on the form; VIN empty or the fallback; record how VIN is flagged (Q-004) | The submit was accepted: no browser bubble (VIN `validationMessage` = "", valid = true), no field error, no alert. The modal re-rendered with the 5 tiers and the form collapsed; VIN = "", Year = "2022", Make = Honda, Model = Accord | ❌ | An empty VIN is sent to AutoShield and gets prices; nothing stops it |
| 4 | Close, reload, re-open | Flow opens again | Roadside row "CA$0.00" with ⋯ (Edit · Generate Contract · Delete) — the product row was created by the refused-to-be submit. ⋯ → Edit opened the modal | ✅ | Re-opened through Edit |
| 5 `[Verification]` | Read the form | VIN empty or the fallback; Make not Honda, Model not Accord | VIN = "2T1BURHE2NC498006" (the vehicle's fallback — accepted); summary "2022 Honda Accord · 2T1BURHE2NC498006"; **Make = "Honda", Model = "Accord"** — saved by the empty-VIN submit; 5 tiers | ❌ | The empty-VIN submit stored Make and Model on the program |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_006-step3-EmptyVinSubmitAccepted_fail.png` — after Continue with an empty VIN: tiers listed, no error
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_006-step5-HondaSavedFromEmptyVinSubmit_fail.png` — re-opened: "2022 Honda Accord" stored

### AP2498_007 — The Make list is filled and the Model list changes to the models of the Make selected — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle N | Details page | Fallback `2T1BURHE4NC498007` → `/vehicle/1111/details` | ✅ | Fallback branch |
| 2 `[Pre-Condition]` | Quote `Roadside2498-007`; + | Flow opens | `/quote/6519/details`; modal opened | ✅ | Quote 6519 |
| 3 | Open Make; record count and first ten; choose Toyota; open Model | ≥ 1 real make; ≥ 1 model after Toyota; record when Model filled (Q-007) | Make: 152 options = "Choose" + 151 makes; first ten: Acura, Audi, BMW, Buick, Cadillac, GMC, Honda, Lincoln, Mazda, Mercedes-Benz. Model before = only "Choose". After Toyota: `GET …/road-side-protection/get-models?make=17%3AToyota`, Model = "Choice" + 63 models (4Runner, 86, Avalon, … Corolla, … bZ) | ✅ | Q-007: filled by AJAX about 1 s after the Make change. Q-006: 151 makes, includes RV brands (Jayco, Winnebago…) and "test test" |
| 4 | Choose Corolla; change Make to Honda; open Model | No error; record whether Corolla is cleared | No error. Model selected = "Choice" (Corolla cleared); list = "Choice" + 23 Honda models (Accord … Civic Hybrid) | ✅ | Q-007: cleared |
| 5 `[Verification]` | Compare the lists | Honda list differs from Toyota's and has no Corolla | Toyota: 63 models; Honda: 23 models; no common entry; "Corolla" not in the Honda list | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_007-step5-ModelListFollowsMake_pass.png` — Make Honda, Model back on "Choice"

### AP2498_008 — On a new quote, the form shows the vehicle's VIN and year when nothing is stored for roadside protection yet — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle P, VIN `2T1BURHE6NC498008` | Details page with that VIN and 2022 | `/vehicle/1112/details`, "Toyota Corolla 2022 · VIN: 2T1BURHE6NC498008" | ✅ | Vehicle 1112 |
| 2 `[Pre-Condition]` | Quote `Roadside2498-008` | Details page; Roadside "- None Selected -" | `/quote/6520/details`; Roadside "- None Selected -" with + | ✅ | Quote 6520 |
| 3 | Click + | Flow opens | Modal opened, no error | ✅ | — |
| 4 `[Verification]` | Read VIN, Year, Make, Model | VIN `2T1BURHE6NC498008`, Year `2022`; Make/Model placeholder or Toyota/Corolla | VIN = "2T1BURHE6NC498008", Year = "2022", Make = "Choose", Model = "Choose"; notice "No road side protection products are available for this vehicle." | ✅ | Q-009: Make/Model are **not** prefilled from the vehicle |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_008-step4-VinYearPrefilledFromVehicle_pass.png` — VIN and Year from the vehicle, Make/Model "Choose"

### AP2498_009 — A submitted VIN, Make and Model are kept and shown again when the roadside-protection flow is re-opened — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle N | Details page | Fallback `2T1BURHE8NC498009` → `/vehicle/1113/details` | ✅ | Fallback branch: VIN checks accept the submitted VIN or `2T1BURHE8NC498009` |
| 2 `[Pre-Condition]` | Quote `Roadside2498-009`; + | Flow opens | `/quote/6521/details`; modal opened | ✅ | Quote 6521 |
| 3 | VIN `2T1BURHE1NC498109`, Year `2021`, Honda/Accord; Continue | Accepted; still in the flow (URL recorded) and the form is shown; VIN submitted or fallback; Make/Model chosen; Year 2021 or 2022 | Accepted, no error. URL before and after = `/quote/6521/details` (modal). Summary "2021 Honda Accord · 2T1BURHE1NC498109"; VIN = "2T1BURHE1NC498109" (submitted), Make = Honda, Model = Accord, Year = "2021" (submitted). 5 tiers. The form's fields and Continue are collapsed behind Edit (visible = false) | ❌ | Values right (Q-008: the submitted VIN and year win); the form is not shown after the submit — same fault as AP2498_002 |
| 4 | Close, reload, re-open | Flow opens again | Row "CA$0.00" with ⋯; ⋯ → Edit opened the modal | ✅ | — |
| 5 `[Verification]` | Read the form | VIN submitted or fallback; Make/Model step-3 values; Year 2021 or 2022 | VIN = "2T1BURHE1NC498109", Make = "Honda", Model = "Accord", Year = "2021"; summary "2021 Honda Accord · 2T1BURHE1NC498109" | ✅ | Q-008: submitted values shown, not the vehicle's |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_009-step3-SubmitAcceptedFormCollapsed_fail.png` — after the submit: summary line only, tiers below
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_009-step5-SubmittedValuesKept_pass.png` — re-opened: "2021 Honda Accord · 2T1BURHE1NC498109"

### AP2498_010 — Submitting a VIN and year different from the vehicle's keeps the flow working and records which value is shown — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle P, VIN `2T1BURHE4NC498010` | Details page | `/vehicle/1114/details` | ✅ | Vehicle 1114 |
| 2 `[Pre-Condition]` | Quote `Roadside2498-010` | Details page | `/quote/6522/details` | ✅ | Quote 6522 |
| 3 | +; VIN `2T1BURHE8NC498110`, Year `2020`, Toyota/Corolla; Continue | Accepted, the RSP form still shown; Make/Model chosen; VIN/Year either value | Accepted, no error. Summary "2020 Toyota Corolla · 2T1BURHE8NC498110"; VIN = "2T1BURHE8NC498110", Year = "2020", Make = Toyota, Model = Corolla; 5 tiers. Form fields collapsed behind Edit (visible = false) | ❌ | Q-008: submitted values shown. Form not shown after the submit |
| 4 | Open `/vehicle/1114/details` | Page loads; VIN/year either value (Q-010) | "Toyota Corolla 2022 · VIN: 2T1BURHE4NC498010" | ✅ | Q-010: the submit does **not** change the inventory vehicle |
| 5 `[Verification]` | Back to the quote, reload, re-open, read the form | Flow opens; VIN/Year either value; Make/Model step-3 values | ⋯ → Edit opened the modal. VIN = "2T1BURHE8NC498110", Year = "2020", Make = "Toyota", Model = "Corolla" | ✅ | Q-008: the RSP program's values win over the vehicle's |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_010-step3-SubmitAcceptedFormCollapsed_fail.png` — after the submit: summary line only
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_010-step5-RspValuesShownVehicleUnchanged_pass.png` — re-opened: "2020 Toyota Corolla · 2T1BURHE8NC498110"

### AP2498_011 — Completing the vehicle on a quote with no products refreshes the results below the form without leaving the flow — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle N | Details page | Fallback `2T1BURHE6NC498011` → `/vehicle/1115/details` | ✅ | Fallback branch |
| 2 `[Pre-Condition]` | Quote `Roadside2498-011`; + | Flow opens; no-products notice below the form; record URL | `/quote/6523/details` (modal); form expanded; notice "No road side protection products are available for this vehicle." below Continue; 0 tiers | ✅ | Notice present (its wording is judged in AP2498_001/012) |
| 3 | VIN `2T1BURHE6NC498011`, Year `2022`, Toyota/Corolla; Continue | No error; record URL and reload (Q-011) | `POST /quote/6523/road-side-protection` → 200; no page navigation; URL = `/quote/6523/details` | ✅ | Q-011: in place, by AJAX |
| 4 `[Verification]` | Inspect the flow | Same modal; form still shown with the four values; tiers below in place of the notice | Same modal; notice gone; 5 tiers listed below. Summary "2022 Toyota Corolla · 2T1BURHE6NC498011"; the form's values are VIN 2T1BURHE6NC498011, Year 2022, Toyota, Corolla, but its fields and Continue are collapsed behind Edit (visible = false) | ❌ | Results update in place, but the form disappears behind "Edit" — same fault as AP2498_002 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_011-step4-TiersInPlaceFormCollapsed_fail.png` — tiers in place of the notice, form collapsed

### AP2498_012 — A submit with only a VIN is accepted, keeps the VIN, and shows the notice below the form instead of an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle N | Details page | Fallback `2T1BURHE8NC498012` → `/vehicle/1116/details` | ✅ | Fallback branch |
| 2 `[Pre-Condition]` | Quote `Roadside2498-012`; + | Flow opens | `/quote/6524/details`; modal opened | ✅ | Quote 6524 |
| 3 | VIN `2T1BURHE1NC498112`; Year empty; Make/Model "Choose"; Continue | Accepted, no field error, no error page; VIN shown; below either the notice "In order to get a quote for road side protection, please specify the make and model of the vehicle." or tiers | Accepted: no field error, no error page. Form re-rendered expanded: VIN = "2T1BURHE1NC498112", Year = "", Make/Model = "Choose". Below: red alert "No road side protection products are available for this vehicle."; 0 tiers | ❌ | Neither outcome the AC allows: the notice has the wrong text (same as AP2498_001) |
| 4 | Close, reload, re-open | Flow opens again | Row "CA$0.00" with ⋯; ⋯ → Edit opened the modal | ✅ | — |
| 5 `[Verification]` | Read the form | VIN `2T1BURHE1NC498112` (or fallback); Make/Model placeholder or the vehicle's | VIN = "2T1BURHE1NC498112" — saved; Year = "2022" (the vehicle's year — RSP year was left empty); Make = "Choose", Model = "Choose" | ✅ | Q-008 (VIN): the submitted VIN wins. Q-009: placeholders |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_012-step3-VinOnlyAcceptedWrongNotice_fail.png` — VIN-only submit: the different notice text
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_012-step5-VinSaved_pass.png` — re-opened: VIN 2T1BURHE1NC498112 kept

### AP2498_013 — Changing the vehicle on a quote that has products updates the results below while the form stays visible — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle P, VIN `2T1BURHEXNC498013` | Details page | `/vehicle/1117/details` | ✅ | Vehicle 1117 |
| 2 `[Pre-Condition]` | Quote `Roadside2498-013`; +; notice → Toyota/Corolla, Continue | Tiers listed below the form | `/quote/6525/details`; after Continue: 5 tiers (200$, 300$, 123$, 316$, 445.5$) | ✅ | — |
| 3 | VIN `1HGCM82633A004352`, Year `2003`, Honda/Accord; Continue | No error; stays in the flow | The fields were collapsed; clicked Edit to reach them, then typed and chose the values. Continue → no error; same modal, URL `/quote/6525/details` | ✅ | Had to click Edit first (the form was hidden) |
| 4 `[Verification]` | Inspect the flow | Form still shown with Honda/Accord; VIN/Year either value; below the new answer (notice or tiers); identical tiers → BLOCKED Q-001 | Summary "2003 Honda Accord · 1HGCM82633A004352"; VIN = "1HGCM82633A004352", Year = "2003", Make = Honda, Model = Accord — but the fields and Continue are collapsed again behind Edit (visible = false). Below: the same 5 tiers and prices as step 2; no notice | ❌ | Form not shown after the submit (same fault as AP2498_002). Also: the "no longer qualify" direction was not produced — Q-001 (AutoShield on Dev prices any make/model given) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_013-step4-SameTiersFormCollapsed_fail.png` — 2003 Honda Accord: same tiers, form collapsed

### AP2498_014 — With products listed below the new form, a product tier can still be chosen in the existing product step — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create Vehicle P, VIN `2T1BURHE1NC498014` | Details page | `/vehicle/1118/details` | ✅ | Vehicle 1118 |
| 2 `[Pre-Condition]` | Quote `Roadside2498-014`; + | Flow opens | `/quote/6526/details`; modal opened | ✅ | Quote 6526 |
| 3 | VIN `2T1BURHE5NC498114`, Toyota/Corolla; Continue | Tiers listed below the form | 5 tiers listed; summary "2022 Toyota Corolla · 2T1BURHE5NC498114" | ✅ | — |
| 4 | Select the first tier | Radio selected; no error | `quote_auto_shield[selectedTier]` = "194-883" checked (PNEU + ROUE, 12 months, 200$); no error | ✅ | — |
| 5 `[Verification]` | Inspect the product section | Tier radios, first selected, and **Save and Generate Contract** (record enabled/disabled); record the section's VIN (Q-012) | Product section `quote_auto_shield`: 5 tier radios (first checked), "Policy Sale price*" (empty), hidden `action`, button **Save** (enabled). No "Save and Generate Contract" button, no VIN, stock number, condition or odometer field | 🚫 | Blocked by AP-2508 (roadside page has no contract fields and no Generate button on this build) — the button state and the product-step VIN (Q-012) cannot be recorded. Save was not pressed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_014-step5-TierSelectedNoGenerateButton_blocked.png` — first tier selected; only "Policy Sale price*" and Save below

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2498_004 | 🚫 | Parked at Gate B (R2 round 3) — step 5 "nothing else" vs a probable hidden CSRF input. Not run. Unblocks when the author states which inputs the RSP form must contain, or after a fresh R2 cycle on the case |
| AP2498_014 | 🚫 | AP-2508 — the roadside product section has no "Save and Generate Contract" button and no VIN/contract fields on the current Dev build, so step 5 cannot be judged. Unblocks when AP-2508 is fixed |

---

## Test data left on Dev

| Case | Vehicle | Quote | Client e-mail | Roadside program after the run |
|---|---|---|---|---|
| AP2498_001 | 1106 (`2T1BURHE3NC498001`) | 6514 | client.stage.2498001@yopmail.com | none (flow only opened) |
| AP2498_002 | 1108 (`2T1BURHE5NC498002`) | 6516 | client.stage.2498002@yopmail.com | CA$0.00 row — Toyota Corolla |
| AP2498_003 | 1109 (`2T1BURHE7NC498003`) | 6517 | client.stage.2498003@yopmail.com | CA$0.00 row — Honda Accord |
| AP2498_005 | 1107 (`2T1BURHE0NC498005`) | 6515 | client.stage.2498005@yopmail.com | none |
| AP2498_006 | 1110 (`2T1BURHE2NC498006`) | 6518 | client.stage.2498006@yopmail.com | CA$0.00 row — Honda Accord, VIN empty submit |
| AP2498_007 | 1111 (`2T1BURHE4NC498007`) | 6519 | client.stage.2498007@yopmail.com | none (not submitted) |
| AP2498_008 | 1112 (`2T1BURHE6NC498008`) | 6520 | client.stage.2498008@yopmail.com | none |
| AP2498_009 | 1113 (`2T1BURHE8NC498009`) | 6521 | client.stage.2498009@yopmail.com | CA$0.00 row — 2021 Honda Accord, VIN 2T1BURHE1NC498109 |
| AP2498_010 | 1114 (`2T1BURHE4NC498010`) | 6522 | client.stage.2498010@yopmail.com | CA$0.00 row — 2020 Toyota Corolla, VIN 2T1BURHE8NC498110 |
| AP2498_011 | 1115 (`2T1BURHE6NC498011`) | 6523 | client.stage.2498011@yopmail.com | CA$0.00 row — Toyota Corolla |
| AP2498_012 | 1116 (`2T1BURHE8NC498012`) | 6524 | client.stage.2498012@yopmail.com | CA$0.00 row — VIN 2T1BURHE1NC498112 only |
| AP2498_013 | 1117 (`2T1BURHEXNC498013`) | 6525 | client.stage.2498013@yopmail.com | CA$0.00 row — 2003 Honda Accord, VIN 1HGCM82633A004352 |
| AP2498_014 | 1118 (`2T1BURHE1NC498014`) | 6526 | client.stage.2498014@yopmail.com | CA$0.00 row — Toyota Corolla (tier selected, not saved) |

No contract was generated and no Save was pressed. Vehicle 915 was not used. The `cleanup` source is missing, so nothing was removed.

---

## Environment Observations

- Dev was stable throughout: no HTTP 5xx, no timeouts, no login problem.
- The `env-check` source is missing; the environment health check had already passed before this worker started (per the run's instruction).
- Open-question observations (record-only): Q-001 — AutoShield prices any submitted make/model, and returns nothing while make/model are empty; Q-002 — modal; Q-003 — no asterisks on any label; Q-004 — no refusal at all for an empty VIN; Q-007 — Model list loads by AJAX and the chosen Model is cleared on a Make change; Q-008 — the RSP program's VIN and year win over the vehicle's; Q-009 — Make/Model are not prefilled from the vehicle; Q-010 — the submit does not change the inventory vehicle; Q-011 — in place, no reload; Q-012 — not recordable (AP-2508); Q-013 — red `alert-danger`.

---

## Gate C — decisions (reviewer mode, before s5 files anything)

Searched open AP bugs (`type = Bug AND statusCategory != Done AND text ~ …`) for "road side protection", "roadside", "AutoShield", "RSP form", "VIN required". Candidates on the same screen: **AP-2508** ("Road side protection page has no vehicle, client, date or financing fields and no 'Generate Contract' button") and **AP-2518** ("Opening the roadside 'Generate Contract' page of a quote returns an HTTP 500 error page"). A similar fault on a different screen: **AP-2521** ("The add-extended-warranty modal hides the vehicle form behind 'Edit' on open and collapses it again after every 'Update vehicle'").

| Defect | FAILs | Rule | Decision |
|---|---|---|---|
| D1 — no-products notice text is "No road side protection products are available for this vehicle." instead of "In order to get a quote for road side protection, please specify the make and model of the vehicle." | AP2498_001, AP2498_012 | C1 no (no capture sentence or comment says the actual text is intended); C2 no; C3 — AP-2508 names the same screen ("Road side protection page") with a different behaviour → reviewer rule E2 | **File new**, *relates to* AP-2508, naming the difference |
| D2 — with products listed (and after every Continue that returns products), the vehicle form is collapsed behind "Edit" | AP2498_002, 003, 009, 010, 011, 013 | C1 no; C2 no (AP-2521 names the same wrong behaviour but on the add-extended-warranty modal, not this screen); C3 — AP-2508 same screen, different behaviour → reviewer rule E2 | **File new**, *relates to* AP-2508 and AP-2521 |
| D3 — VIN has no `required` constraint and an empty-VIN submit is accepted, re-quoted and stores Make/Model | AP2498_005, AP2498_006 | C1 no; C2 no; C3 — AP-2508 same screen, different behaviour → reviewer rule E2 | **File new**, *relates to* AP-2508 |

No rule C1 "Not a bug" decision → **s4c is skipped**. Bugs are filed in s5 (not in this run).

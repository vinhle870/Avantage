# Execution Log — AP-2477 Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill

> Written by the **stlc-manual-executor** skill (pipeline stage s4). Inputs:
> `qa-artifacts/3-test-cases/AP2477_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md`,
> `qa-artifacts/3-test-cases/AP2477_TestCases_011-012.md`.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-12
**Base URL:** https://v2staging.garantieavantageplus.ca (Staging, v2staging) — Dealer portal
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 02:44 → 02:46 (UTC)
**Account:** shared dealer account from `execute.env.md` (Dealer ID 1380, "Test QA staging")

| Metric | Value |
|---|:---:|
| Total test cases | 12 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 12 |
| Skipped | 0 |
| **Pass rate** | **0% (0 of 12)** |

**Environment check:** passed. `/login` loaded with the login form (heading "Login", fields "Courriel" and "Mot de passe", a "Login" button and a "Forgot password?" link) — `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/env-check-login-pass.png`. The dealer login then landed on the Dashboard `/` as "Test QA staging". The `env-check` source is `missing` in the knowledge registry, so no scripted smoke test exists beyond this check and the login. One console error was logged on the login page; it did not affect anything.

**Build check: failed — the AP-2477 build is not on staging.** The check in the batch's Execution Context could not even reach the point of looking for Price or Kilometers, because the simplified vehicle form does not exist on staging at all:

1. On `/quotes` the header action **"Create a quote"** (`href="/quote"`) opened **`/quote/new/client`** — the old client-first form, heading "Create a quote", with the "Client" section (Email*, First name*, Last name*, … Tel work*, the FORM-L25 checkbox) and a "Save" button. There is no vehicle form, no Quote name, no NIV and no vehicle type menu. — `build-check-CreateQuoteOpensClientForm_fail.png`
2. Opening **`/quote/new/edit-vehicle`** directly returned **HTTP 404** with the page "Désolé, la page recherchée est introuvable" and an "Aller à l'accueil" link. Retried once (with `?_locale=fr`): still HTTP 404. — `build-check-EditVehicleRoute404_fail.png`
3. `/quote` was opened a second time to confirm: it again redirected to `/quote/new/client`.
4. The existing quote vehicle step on the newest quote, `/quote/6431/vehicle` (opened read-only, nothing saved), still shows the three old fields **"Véhicule"**, **"Date de livraison"** and **"Prix"** (`quote_vehicle[vehicle]`, `quote_vehicle[deliveredAt]`, `quote_vehicle[price]`). — `build-check-QuoteVehicleStepStillHasPrix_fail.png`

Per the batch's build-check rule, every case is recorded **BLOCKED — build not deployed**. None of the twelve cases was attempted beyond its login precondition, nothing was saved, and **no test data was created on staging**. The footer still reads "Avantage Plus System v2.0.0".

**Stale design fact (the live page wins):** the Execution Context and `DealerNewQuotePage.ts` describe a vehicle-first flow (`/quotes` → "Create a quote" → `/quote/new/edit-vehicle`). On staging today "Create a quote" still leads to the client-first flow documented in `qa-docs/quote-creation.md`. The automation page object appears to have been written against a newer build than the one on staging.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` | Build not deployed — the form route returns HTTP 404 |
| AP2477_002 | Only Brand, Model and Year carry the required marker; Quote name and VIN do not | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` | Build not deployed — no form to read the markers on |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` | Build not deployed — "Create a quote" opens the client form |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` | Build not deployed — minimal form absent |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` | Build not deployed — minimal form absent |
| AP2477_006 | Saving with Brand and Model but no Year is refused with an error and no quote is created | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` | Build not deployed — minimal form absent |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year on the simplified form | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` | Build not deployed; decoder (Q-001) could not be tried |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo on its vehicle | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` | Build not deployed; decoder (Q-001) could not be tried |
| AP2477_009 | A Quote name typed before clicking "Décoder" is still there afterwards and is saved with the quote | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` | Build not deployed; no Quote name field exists yet |
| AP2477_010 | The "Décoder" button shows for a car type but not for an RV, boat or construction type | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` | Build not deployed; no vehicle type menu on the quote flow |
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` | Build not deployed — a regression check needs the change present |
| AP2477_012 | A quote created from the minimal form opens its details and warranty step without an error page | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` | Build not deployed — no quote can come from the minimal form |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

> Every case shares the same login precondition, which succeeded once for the whole run.
> Every case then stopped at the step that needs the simplified form, because that form is
> not on staging. Steps after the blocking step were not run.

### AP2477_001 — The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in as the dealer, open `/quotes` | Quotes list with "Create a quote" | URL = /quotes; heading = "Quotes"; link "Create a quote" visible (href /quote); newest row = quote 6431, Oct 6, 2026 | ✅ | Login and list fine |
| 2 | Click "Create a quote" | "Créer une cotation" at `/quote/new/edit-vehicle` | URL = /quote/new/client; heading = "Create a quote"; section "Client" with Email*, First name*, Last name* … and a "Save" button; no vehicle type menu. Direct `/quote/new/edit-vehicle` = HTTP 404 "Désolé, la page recherchée est introuvable" (2 of 2 tries) | 🚫 | Blocked: AP-2477 build not deployed to staging |
| 3 `[Verification]` | List the visible fields | Exactly five fields in order | Not run — the form does not exist | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` — "Create a quote" opened the old client form instead of the vehicle form
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` — `/quote/new/edit-vehicle` shows the French "page not found" screen

### AP2477_002 — Only Brand, Model and Year carry the required marker — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/quotes` → "Create a quote" | "Créer une cotation" form shown | URL = /quote/new/client (client form); `/quote/new/edit-vehicle` = HTTP 404 | 🚫 | Blocked: build not deployed |
| 2 `[Verification]` | Read the five labels and `*` markers | Only Marque*, Modèle*, Année* starred | Not run — no Quote name / NIV / Marque / Modèle / Année fields exist on the quote flow | 🚫 | Blocked by step 1; Q-003 still open |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` — the form route is not found

### AP2477_003 — Saving with only Brand, Model and Year creates the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/quotes`, note newest quote | Quotes list shown | URL = /quotes; newest row data-href = /quote/6431/details, "Fiat 500 2015 VIN: 33333333", Oct 6, 2026 | ✅ | Baseline noted: 6431 |
| 2 | "Create a quote", choose Toyota / Corolla / 2020, Sauvegarder | Saves without error | URL = /quote/new/client; no Marque, Modèle or Année fields to fill | 🚫 | Blocked: build not deployed; nothing saved |
| 3 `[Verification]` | Read the details page and `/quotes` | New quote on `/quote/{id}/details` | Not run | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` — the client form that "Create a quote" opens

### AP2477_004 — A vehicle saved from the minimal form has no kilometres, condition, designation or price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote from the minimal form with Toyota / Corolla / 2020 | Details page opens | URL = /quote/new/client; minimal form absent | 🚫 | Blocked: build not deployed |
| 2 | Open the quote's vehicle | Vehicle details / edit opens | Not run | 🚫 | Blocked by step 1 |
| 3 `[Verification]` | Read Kilométrage, Condition, Désignation, Prix | All blank | Not run. For reference, the existing quote vehicle step `/quote/6431/vehicle` still shows "Véhicule", "Date de livraison", "Prix" | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-QuoteVehicleStepStillHasPrix_fail.png` — the old quote vehicle step still asks for Prix

### AP2477_005 — Saving without a Brand is refused — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/quotes`, note newest quote | Quotes list shown | Newest quote = 6431 | ✅ | Baseline noted |
| 2 | "Create a quote", leave Marque on "Choisir", Année 2020, Sauvegarder | Save refused at Marque | URL = /quote/new/client; no Marque field | 🚫 | Blocked: build not deployed |
| 3 `[Verification]` | Read newest row of `/quotes` | Still 6431 | Not run (nothing was submitted, so 6431 is still newest) | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` — client form instead of the vehicle form

### AP2477_006 — Saving with Brand and Model but no Year is refused — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/quotes`, note newest quote | Quotes list shown | Newest quote = 6431 | ✅ | Baseline noted |
| 2 | "Create a quote", Toyota / Corolla, Année empty, Sauvegarder | Save refused at Année | URL = /quote/new/client; no Année field | 🚫 | Blocked: build not deployed |
| 3 `[Verification]` | Read newest row of `/quotes` | Still 6431 | Not run | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` — client form instead of the vehicle form

### AP2477_007 — Clicking "Décoder" fills Brand, Model and Year — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open "Create a quote" (Auto Passenger) | NIV with "Décoder"; Marque/Modèle "Choisir" | URL = /quote/new/client; no NIV field, no "Décoder" button | 🚫 | Blocked: build not deployed |
| 2 | Type `1FAHP35NX8W239204`, click "Décoder" | Form re-renders | Not run | 🚫 | Blocked by step 1 |
| 3 `[Verification]` | Read NIV, Marque, Modèle, Année | Ford / Focus / 2008 | Not run | 🚫 | Blocked by step 1; Q-001 not observable |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` — form route not found

### AP2477_008 — A quote saved after decoding keeps the decoded details — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Decode `1FAHP35NX8W239204`, read hidden inputs | Ford / Focus / 2008 and hidden values | URL = /quote/new/client; no decoder, no hidden `vehicle_*` inputs to read | 🚫 | Blocked: build not deployed |
| 2 | Enter Quote name, Sauvegarder | Details page opens | Not run | 🚫 | Blocked by step 1 |
| 3 | Open the quote's vehicle | Vehicle page opens | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Compare Transmission, Carburant, Cylindrée, unit, Cylindres, Turbo | Same as hidden values | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` — form route not found

### AP2477_009 — Quote name survives "Décoder" — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create a quote" | "Créer une cotation" form | URL = /quote/new/client; no Quote name field | 🚫 | Blocked: build not deployed |
| 2 | Type Quote name and VIN, "Décoder" | Ford / Focus / 2008 | Not run | 🚫 | Blocked by step 1 |
| 3 | Read Quote name, Sauvegarder | Name kept | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Read name on details and `/quotes` | Name shown | Not run. Note: the `/quotes` list has no quote-name column today (Client, Vehicle, Program, Date Created) | 🚫 | Blocked by step 1; Q-004 open |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` — form route not found

### AP2477_010 — "Décoder" shows only for car types — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open "Create a quote" | "Créer une cotation" form | URL = /quote/new/client; no vehicle type menu on the page | 🚫 | Blocked: build not deployed |
| 2 | Open the type menu, record types, choose Auto Passenger | Type list recorded | Not run | 🚫 | Blocked by step 1; Q-006 open |
| 3 `[Verification]` | Check NIV row | "Décoder" visible, class `vinlookup` | Not run | 🚫 | Blocked by step 1 |
| 4 | Choose an RV / boat / construction type | Form re-renders | Not run | 🚫 | Blocked by step 1 |
| 5 `[Verification]` | Check NIV row and fields | No "Décoder" | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-EditVehicleRoute404_fail.png` — form route not found

### AP2477_011 — The inventory add-vehicle form keeps Price and Kilometers — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/vehicle/new/edit/PASSENGER` | Full add-vehicle form | Not run — the build-check rule blocks every case while AP-2477 is absent | 🚫 | Blocked: build not deployed |
| 2 `[Verification]` | List the visible fields | Full field set | Not run | 🚫 | Regression is meaningless without the change |
| 3 | Submit without Price / Kilometers | Save refused | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Check inventory list | No new vehicle | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` — evidence the build is absent

### AP2477_012 — A minimal-form quote opens its details and warranty step — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a quote from the minimal form | Details page opens | URL = /quote/new/client; minimal form absent | 🚫 | Blocked: build not deployed |
| 2 `[Verification]` | Read and reload the details page | No HTTP 500 | Not run | 🚫 | Blocked by step 1 |
| 3 | Open the warranty step | Programs screen opens | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Read the warranty screen | No error page | Not run | 🚫 | Blocked by step 1; Q-002 open |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/build-check-CreateQuoteOpensClientForm_fail.png` — evidence the build is absent

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2477_001 – AP2477_012 | 🚫 | **Build not deployed.** On staging, "Create a quote" on `/quotes` still opens the old client-first form `/quote/new/client`, and `/quote/new/edit-vehicle` returns HTTP 404 (2 of 2 tries). The AP-2477 change must be deployed to v2staging before any of these cases can run. Re-run the whole batch once it is. |

---

## Open questions — what this run could and could not tell

| Question | Observation |
|---|---|
| Q-001 — VIN decoder configured on staging? | Not observable — there is no "Décoder" button on staging's quote flow. |
| Q-002 — Warranty behaviour with empty km / condition / price | Not observable — no quote can be created without these values yet. |
| Q-003 — Required markers on Quote name / NIV | Not observable — those fields are not on staging's quote flow. |
| Q-004 — Quote name kept across decode | Not observable. Note that `/quotes` shows no quote-name column today, so AP2477_009 step 4 may need another place to read the name. |
| Q-005 — Years accepted by Year | Not observable. |
| Q-006 — Vehicle types in the type menu | Not observable on the quote flow (no type menu). |

---

## Environment Observations

- The application ran normally: login, `/quotes`, `/quote/new/client` and `/quote/6431/vehicle` all loaded quickly with HTTP 200. The only abnormal response was the expected HTTP 404 on `/quote/new/edit-vehicle`.
- **No test data was created.** No quote, vehicle or client was saved. Inventory vehicle 915 was not opened. Quote 6431's vehicle step was opened read-only and left without saving.
- Opening a URL with `?_locale=fr` switched the dealer UI to French for the session; it was switched back with `?_locale=en` before the browser was closed.
- `/quotes` rows carry the quote id only in a `data-href="/quote/{id}/details"` attribute on each cell (no visible id, no quote name). Newest quote at run time: **6431** (Oct 6, 2026).
- The Playwright automation page object `DealerNewQuotePage.ts` already targets `/quote/new/edit-vehicle`, which does not exist on staging yet — that suite's quote tests will fail on staging until AP-2477 is deployed.

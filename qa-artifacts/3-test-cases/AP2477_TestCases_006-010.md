# Test Cases — AP2477 (File 2 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**Source:** requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md · qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2477_test-plan.md
**Date:** 2026-10-12
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2477_006 to AP2477_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` → **"Create a quote"** → `/quote/new/edit-vehicle` ("Créer une cotation"); vehicle type menu top right ("Auto Passenger"). Save → `/quote/{id}/details`. | `navigation`, Playwright page objects |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — the dealer username and password from the `env` source (`qa-artifacts/base-test/execute.env.md`: Staging → Portals, or Dev Environment → `DEALER_USERNAME` / `DEALER_PASSWORD`), at `/login` (Dealer ID 1380) | `env` |
| **Form fields** | Quote name `#vehicle_quote_name`, VIN `#vehicle_VIN` ("NIV") with **"Décoder"** button (VIN field has class `vinlookup` for decoder-enabled types), Brand `vehicle_make` ("Marque"), Model `vehicle_model` ("Modèle", loads after Brand), Year `#vehicle_year` ("Année"), button **"Sauvegarder"**. The decoder posts the VIN by AJAX and **replaces the whole form** with the response — wait for the form to re-render before reading it. | Playwright page objects, ticket Tech approach items 4 and 8 |
| **Test data** | Known VIN **`1FAHP35NX8W239204`** — 2008 Ford Focus; expected decode Ford / Focus / 2008. Manual vehicle Toyota / Corolla / `2020` (else first Brand + first Model, noted). **Never edit inventory vehicle 915.** | `test-data` |
| **Language** | French dealer UI | `navigation` |
| **Leaves behind** | One quote and vehicle per case that saves (AP2477_008, AP2477_009). Dealers cannot delete quotes. | `cleanup` (missing) |

**Decoder availability.** If "Décoder" with the known VIN fills nothing and shows no decoded value (or a lookup error), record AP2477_007–009 **BLOCKED — VIN decoder not available on staging (Q-001)**, not FAIL.

**Decode order.** Per the ticket, decoding is **ignored when a Brand is already chosen**. In every decoder case, leave Marque on "Choisir" before clicking "Décoder".

**Known blockers:** None at design time.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Execution Context → Login: the clear-text dealer username and password were removed and replaced with a reference to the `env` source (`execute.env.md`) | Credential policy — a credential must never be copied into an artifact | QA Agent (pipeline s4, dev run), per the batch instruction |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2477_006 | Saving with Brand and Model but no Year is refused with an error and no quote is created | Negative | Medium | PASS |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year on the simplified form | Functional | High | FAIL |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo on its vehicle | Functional | High | BLOCKED |
| AP2477_009 | A Quote name typed before clicking "Décoder" is still there afterwards and is saved with the quote | Edge-case | Medium | BLOCKED |
| AP2477_010 | The "Décoder" button shows for a car type but not for an RV, boat or construction type | UI | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2477_006 — Saving with Brand and Model but no Year is refused with an error and no quote is created

| Field | Value |
|---|---|
| **TC ID** | AP2477_006 |
| **Title** | Saving with Brand and Model but no Year is refused with an error and no quote is created |
| **Requirement** | AP2477 — REQ-005 (AC 1) |
| **Route** | `/quote/new/edit-vehicle` — Créer une cotation |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (the user allowed the `/quotes` → "Create a quote" entry on dev on 2026-11-01) |
| **Executed on** | 2026-11-01 — Dev (v2dev), resumed s4 run. (2026-10-12 staging run: BLOCKED — build not deployed; superseded) |
| **Result** | PASS — server refused with "This value should not be blank." at Year; Toyota/Corolla kept; no quote created. |

**Why this matters:** Year drives warranty eligibility (vehicle age). A quote saved without it cannot be priced correctly, and AP2477_005 alone does not prove Year is still required.

**Test Data:**

| Variable | Value |
|---|---|
| Brand / Model / Year | Toyota / Corolla / **empty** |
| Quote name | `QA-AP2477-006-<HHMMSS>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes`. Note the newest quote at the top of the list. | The quotes list is shown. |
| 2 | Click **"Create a quote"** (type "Auto Passenger"). Enter Quote name `QA-AP2477-006-<HHMMSS>`, leave NIV empty, choose Marque "Toyota" and Modèle "Corolla", leave **Année empty** → **"Sauvegarder"**. | The save is refused with a validation message at Année (browser or server). No HTTP 500 page. Marque and Modèle keep their values. |
| 3 | [Verification] Open `/quotes` and read the newest row. | The newest row is still the one noted in step 1; no quote named `QA-AP2477-006-…` exists. |

---

### AP2477_007 — Clicking "Décoder" with a valid VIN fills Brand, Model and Year on the simplified form

| Field | Value |
|---|---|
| **TC ID** | AP2477_007 |
| **Title** | Clicking "Décoder" with a valid VIN fills Brand, Model and Year on the simplified form |
| **Requirement** | AP2477 — REQ-003 (AC 1), REQ-002 (AC 1) |
| **Route** | `/quote/new/edit-vehicle` — Créer une cotation |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | FAIL — the decoder found Ford / Focus / 2008, but clicking "Décoder" saved quote #6437 at once (POST → 302 → /quote/6437/details) and the form disappeared from the page instead of re-rendering pre-filled. |

**Why this matters:** The decoder is the fastest way to fill a vehicle correctly. The simplified template could easily break it, because the decoder re-renders the whole form from the server.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `1FAHP35NX8W239204` |
| Expected | Marque Ford · Modèle Focus · Année 2008 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"** with vehicle type "Auto Passenger". | The "Créer une cotation" form shows NIV with a **"Décoder"** button; Marque and Modèle show "Choisir". |
| 2 | Type `1FAHP35NX8W239204` in **NIV**, leave Marque on "Choisir", click **"Décoder"**, and wait for the form to re-render. | The form reloads in place without an error page. |
| 3 | [Verification] Read NIV, Marque, Modèle and Année, and list the visible fields again. | NIV still holds `1FAHP35NX8W239204`; Marque shows **Ford**, Modèle **Focus**, Année **2008**. The form still shows only the five fields — the decoded extras (transmission, fuel…) are not displayed. |

---

### AP2477_008 — A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo on its vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2477_008 |
| **Title** | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo on its vehicle |
| **Requirement** | AP2477 — REQ-003 (AC 2) |
| **Route** | `/quote/new/edit-vehicle` → `/quote/{id}/details` → the quote's vehicle |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | AP2477_007 failure — "Décoder" saves the quote immediately, so the hidden inputs cannot be read and a name cannot be entered before saving |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | BLOCKED — step 1 cannot be done as designed. Observation: vehicle 1067 (auto-saved by the AP2477_007 decode) holds fuel GASOLINE, Automatic, 4 cylinders, 2 L, turbo off; price and km blank. |

**Why this matters:** Fuel type, engine and transmission feed warranty eligibility and pricing. The ticket explicitly requires them to be saved even though they are hidden; if the hidden inputs were dropped, quotes would silently lose them.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `1FAHP35NX8W239204` |
| Quote name | `QA-AP2477-008-<HHMMSS>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"** (type "Auto Passenger"). Type `1FAHP35NX8W239204` in NIV, leave Marque on "Choisir", click **"Décoder"** and wait for the re-render. Before saving, read the values of the hidden inputs for transmission, fuel type, engine size, engine size unit, cylinders and turbo (page source / DOM) and note them. | Marque Ford, Modèle Focus, Année 2008 are filled. The hidden inputs hold the decoded values (note them; fuel type must be non-empty, since the decoder makes no change without one). |
| 2 | Enter Quote name `QA-AP2477-008-<HHMMSS>` (after decoding) → **"Sauvegarder"**. | The quote details page `/quote/{id}/details` opens without an error; record the id. |
| 3 | From the quote details page open the quote's vehicle (vehicle link or **"Edit vehicle"**); record its URL. | The vehicle details page or full edit form opens for Ford Focus 2008. |
| 4 | [Verification] Read Transmission, Carburant (fuel type), Cylindrée (engine size) and its unit, Cylindres and Turbo on that page or its edit form. | Each holds the value noted in step 1 (for example a fuel type and transmission, not blank). VIN shows `1FAHP35NX8W239204`. Kilométrage, Condition, Désignation and Prix are blank. |

---

### AP2477_009 — A Quote name typed before clicking "Décoder" is still there afterwards and is saved with the quote

| Field | Value |
|---|---|
| **TC ID** | AP2477_009 |
| **Title** | A Quote name typed before clicking "Décoder" is still there afterwards and is saved with the quote |
| **Requirement** | AP2477 — REQ-007 (Tech approach item 8); Q-004 |
| **Route** | `/quote/new/edit-vehicle` → `/quote/{id}/details` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | AP2477_007 failure — "Décoder" saves the quote immediately; re-running it would create another quote through the bare /quote entry |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | BLOCKED — not run; depends on the decoder re-rendering the form. |

**Why this matters:** Quote name now sits at the top, so dealers will type it first. The ticket notes that the decoder replaces the whole form and that the name would be lost unless one of three fixes was applied.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2477-009-<HHMMSS>` |
| VIN | `1FAHP35NX8W239204` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"** (type "Auto Passenger"). | The "Créer une cotation" form is shown. |
| 2 | Type `QA-AP2477-009-<HHMMSS>` in **Quote name**, then `1FAHP35NX8W239204` in NIV, leave Marque on "Choisir", click **"Décoder"** and wait for the re-render. | Marque Ford, Modèle Focus, Année 2008 are filled. |
| 3 | Read the Quote name field, then click **"Sauvegarder"**. | Quote name still holds `QA-AP2477-009-<HHMMSS>`. The quote details page opens. |
| 4 | [Verification] Read the quote name on the quote details page and on the newest row of `/quotes`. | Both show `QA-AP2477-009-<HHMMSS>`. An empty Quote name after decoding, or a quote saved without the name, is a FAIL. |

---

### AP2477_010 — The "Décoder" button shows for a car type but not for an RV, boat or construction type

| Field | Value |
|---|---|
| **TC ID** | AP2477_010 |
| **Title** | The "Décoder" button shows for a car type but not for an RV, boat or construction type |
| **Requirement** | AP2477 — REQ-002 (AC 1, 2, 3); Q-006 |
| **Route** | `/quote/new/edit-vehicle` — Créer une cotation, vehicle type menu |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | PASS — "Décoder" and class vinlookup on Passenger; RV CLASS A shows a plain VIN input with no "Décoder" and the same five fields. 23 types listed. |

**Why this matters:** The decoder only knows road vehicles. A "Décoder" button on a boat or RV form would do nothing or fill wrong data; a missing button on a car form removes the time-saver.

**Test Data:**

| Variable | Value |
|---|---|
| Decoder type | "Auto Passenger" |
| Non-decoder type | The first RV, boat or construction type in the menu (record its name) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"**. | The "Créer une cotation" form is shown. |
| 2 | Open the vehicle type menu at the top right and record every type it lists. Choose **"Auto Passenger"**, leave NIV empty. | The form for Auto Passenger is shown; the type list is recorded. |
| 3 | [Verification] Check the NIV row on the Auto Passenger form. | The **"Décoder"** button is visible next to the empty NIV field, and the NIV input has the class `vinlookup`. |
| 4 | Open the type menu again and choose an RV, boat or construction type (e.g. "VR", "Bateau", "Construction" — whichever exists). | The form re-renders for that type. If no such type exists, record "not available for dealer 1380" and mark this part SKIPPED. |
| 5 | [Verification] Check the NIV row and the visible fields on that form. | NIV is a plain input with **no "Décoder" button** and no `vinlookup` class. The form still shows only Quote name, NIV, Marque, Modèle and Année (record any extra field). |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Five fields, in order | AP2477_001, AP2477_002 (file 1) | — | AP2477_010 (other type) | — |
| REQ-002 — Décoder only for VEHICLE types | AP2477_007, AP2477_010 | — | — | — |
| REQ-003 — Decode pre-fills and keeps details | AP2477_007, AP2477_008 | — | — | — |
| REQ-004 — Only Brand/Model/Year required | AP2477_003, AP2477_004 (file 1) | — | — | AP2477_012 (file 3) |
| REQ-005 — Missing field refused | — | AP2477_005 (file 1), AP2477_006 | — | — |
| REQ-006 — Other forms unchanged | — | — | — | AP2477_011 (file 3) |
| REQ-007 — Quote name kept across decode | — | — | AP2477_009 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2477_006 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_006-step3-NoNewQuoteNewest6440_pass.png` |
| AP2477_007 | FAIL | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` |
| AP2477_008 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step3-DecodeSavedQuote6437_fail.png` |
| AP2477_009 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_007-step2-FormGoneAfterDecode_fail.png` |
| AP2477_010 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_010-step5-RvClassANoDecoder_pass.png` |

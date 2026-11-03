# Test Cases — AP2477 (File 1 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**Source:** requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md · qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2477_test-plan.md
**Date:** 2026-10-12
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2477_001 to AP2477_005 (5 test cases)
**Coverage:** Functional · UI · Negative · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` → header action **"Create a quote"** (French UI may read "Créer une cotation") → the new-quote vehicle form `/quote/new/edit-vehicle`, page heading **"Créer une cotation"**. The vehicle type menu is at the top right (mockup shows **"Auto Passenger"**). Saving redirects to the quote details page `/quote/{id}/details`. Record the actual route of each screen the first time it opens. | `navigation`, Playwright page objects `DealerQuotesPage` / `DealerNewQuotePage` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — the dealer username and password from the `env` source (`qa-artifacts/base-test/execute.env.md`: Staging → Portals, or Dev Environment → `DEALER_USERNAME` / `DEALER_PASSWORD`), at `/login`. Dealer ID **1380**, company "Test QA staging", province QC. | `env` |
| **Form fields (before AP-2477)** | Ids from the existing automation: Quote name `#vehicle_quote_name`, VIN `#vehicle_VIN` (label "NIV"), Brand select `vehicle_make` (label "Marque"), Model select `vehicle_model` ("Modèle", options load after Brand), Year `#vehicle_year` ("Année"). Removed by AP-2477: `#vehicle_price`, `#vehicle_kilometers`, `vehicle_condition`, `vehicle_designation`, `vehicle_fuelType`, `vehicle_transmission`, `#vehicle_cylinders`, `#vehicle_engineSize`, `vehicle_engineSizeUnit`, `#vehicle_isTurbo`, `#vehicle_is4x4`, `#vehicle_isFWD`, `#vehicle_manufacturer*`. Selects are Bootstrap-select widgets showing "Choisir". Save button **"Sauvegarder"**. | Playwright page objects, ticket mockup |
| **"Shown" means visible** | AP-2477 keeps the removed fields as **hidden inputs** so the decoder can fill them. A field counts as shown only if a user can see its label or control. Hidden inputs are noted, not failed. | Ticket Tech approach item 3 |
| **Test data** | Known VIN **`1FAHP35NX8W239204`** — 2008 Ford Focus (inventory vehicle 915), expected decode Ford / Focus / 2008. Manual vehicle: Brand **"Toyota"**, Model **"Corolla"**, Year **`2020`** (if Toyota or Corolla is not listed, use the first Brand and its first Model and write them down). **Never edit inventory vehicle 915.** | `test-data` |
| **Language** | French dealer UI (labels "NIV", "Marque", "Modèle", "Année", "Décoder", "Sauvegarder"). | `navigation` |
| **Leaves behind** | One quote (and its vehicle record) per case that saves, named `QA-AP2477-{NNN}-{HHMMSS}` where a name is entered. Dealers cannot delete quotes. | `cleanup` (missing) |

**Build check.** Before AP2477_001, open the form once. If **Price** ("Prix") or **Kilometers** ("Kilométrage") is still visible, the AP-2477 build is not on staging: stop and record every case **BLOCKED — build not deployed**.

**Decoder availability.** If clicking "Décoder" with the known VIN leaves Brand, Model and Year empty and shows no decoded value (or shows an error from the lookup), record the decoder cases **BLOCKED — VIN decoder not available on staging (Q-001)**, not FAIL. Note what the screen shows.

**Known blockers:** None at design time. AP2477_010 needs a non-VEHICLE type (RV, boat or construction) in the type menu; if the dealer has none, that part is SKIPPED with the reason.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Execution Context → Login: the clear-text dealer username and password were removed and replaced with a reference to the `env` source (`execute.env.md`) | Credential policy — a credential must never be copied into an artifact | QA Agent (pipeline s4, dev run), per the batch instruction |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | UI | High | PASS |
| AP2477_002 | Only Brand, Model and Year carry the required marker; Quote name and VIN do not | UI | Medium | PASS |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | Functional | High | PASS |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | Functional | High | PASS |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | Negative | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2477_001 — The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order

| Field | Value |
|---|---|
| **TC ID** | AP2477_001 |
| **Title** | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order |
| **Requirement** | AP2477 — REQ-001 (AC 1, 2, 3) |
| **Route** | `/quote/new/edit-vehicle` — Créer une cotation |
| **Type** | UI |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | PASS — the form at /quote/new/edit-vehicle shows exactly Quote name, VIN (with "Décoder"), Brand*, Model*, Year*, then Save; none of the removed fields is visible. |

**Why this matters:** The form is the first thing a dealer sees when starting a quote. Every leftover field (price, kilometres, warranty dates) is friction the ticket exists to remove.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle type | "Auto Passenger" (default, per mockup) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal at `/login` as the dealer (Dealer ID 1380). Open `/quotes`. | The quotes list is shown with the header action "Create a quote" (or its French label). |
| 2 | Click **"Create a quote"**. Leave the vehicle type on "Auto Passenger" (select it from the top-right menu if another type is shown). | The page "Créer une cotation" opens at `/quote/new/edit-vehicle`. |
| 3 | [Verification] List every visible label and control in the form from top to bottom, and check for Prix, Kilométrage, Condition, Désignation, transmission, cylindrée/engine size, unité, cylindres, carburant, turbo, 4x4/AWD and the manufacturer-warranty block. | Exactly five fields are visible, in this order: Quote name (top), NIV with the help text and a **"Décoder"** button, then Marque, Modèle and Année on one row, followed by **"Sauvegarder"**. None of the removed fields is visible. Hidden inputs, if any, are recorded but not counted. The layout matches the ticket mockup. |

---

### AP2477_002 — Only Brand, Model and Year carry the required marker; Quote name and VIN do not

| Field | Value |
|---|---|
| **TC ID** | AP2477_002 |
| **Title** | Only Brand, Model and Year carry the required marker; Quote name and VIN do not |
| **Requirement** | AP2477 — REQ-001 (Assumptions), REQ-004 (AC 2); Q-003 |
| **Route** | `/quote/new/edit-vehicle` — Créer une cotation |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | PASS — only Brand*, Model* and Year* carry the marker and the HTML required attribute; Quote name and VIN carry neither. |

**Why this matters:** A star on Quote name or NIV tells dealers those are mandatory, so they will hunt for a VIN they do not have yet. The mockup still shows those stars, but the ticket's Assumptions say only Brand, Model and Year should be marked.

**Test Data:**

| Variable | Value |
|---|---|
| None | The form is only read |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"** with vehicle type "Auto Passenger". | The "Créer une cotation" form is shown. |
| 2 | [Verification] Read the five labels and their `*` markers, and whether each input carries the HTML `required` attribute (Quote name `#vehicle_quote_name`, VIN `#vehicle_VIN`, Brand, Model, Year `#vehicle_year`). | "Marque*", "Modèle*" and "Année*" show the marker. "Quote name" and "NIV" show no `*` and their inputs are not `required`. A star on Quote name or NIV is a finding against the Assumptions (record it for Q-003). |

---

### AP2477_003 — Saving with only Brand, Model and Year creates the quote and opens its details page

| Field | Value |
|---|---|
| **TC ID** | AP2477_003 |
| **Title** | Saving with only Brand, Model and Year creates the quote and opens its details page |
| **Requirement** | AP2477 — REQ-004 (AC 1, 2, 4) |
| **Route** | `/quote/new/edit-vehicle` → `/quote/{id}/details` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (the user allowed the `/quotes` → "Create a quote" entry on dev on 2026-11-01) |
| **Executed on** | 2026-11-01 — Dev (v2dev), resumed s4 run. (2026-10-12 staging run: BLOCKED — build not deployed; superseded) |
| **Result** | PASS — quote 6438 (Toyota Corolla 2020, no name) saved from Brand/Model/Year only, opened at /quote/6438/details and is the newest quote. |

**Why this matters:** This is the core promise of the ticket. The ticket also warns that the quote-vehicle price column was not nullable; if that fix was missed, this save fails with an error page and no dealer can start a quote this way.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | empty |
| VIN | empty |
| Brand / Model / Year | Toyota / Corolla / `2020` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes`. Note the newest quote at the top of the list (number and date). | The quotes list is shown. |
| 2 | Click **"Create a quote"** (type "Auto Passenger"). Leave Quote name and NIV empty. Choose Marque **"Toyota"**, wait for the Modèle list, choose **"Corolla"**, type Année **`2020`** → **"Sauvegarder"**. | The form submits without a validation message and without an HTTP 500 / "Erreur" page. |
| 3 | [Verification] Read the URL, heading and vehicle shown on the page, then open `/quotes` and read the newest row. | The browser is on `/quote/{id}/details` (record the id) and the page shows the vehicle Toyota Corolla 2020. In `/quotes`, a new quote with that id is now the newest row, above the one noted in step 1. |

---

### AP2477_004 — A vehicle saved from the minimal form has no kilometres, condition, designation or price

| Field | Value |
|---|---|
| **TC ID** | AP2477_004 |
| **Title** | A vehicle saved from the minimal form has no kilometres, condition, designation or price |
| **Requirement** | AP2477 — REQ-004 (AC 3) |
| **Route** | `/quote/{id}/details` → the quote's vehicle (details or edit page) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (the user allowed the `/quotes` → "Create a quote" entry on dev on 2026-11-01) |
| **Executed on** | 2026-11-01 — Dev (v2dev), resumed s4 run. (2026-10-12 staging run: BLOCKED — build not deployed; superseded) |
| **Result** | PASS — vehicle 1069 (quote 6439 "QA-AP2477-004-145431"): price and kilometres empty, mileage and designation blank on the details page, no condition stored. |

**Why this matters:** The ticket requires these four values to be stored empty (NULL), not filled with a default. A silent default — `0` km, "New", a price of 0 — would make warranty eligibility and pricing look valid when the dealer never entered anything.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2477-004-<HHMMSS>` |
| Brand / Model / Year | Toyota / Corolla / `2020` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer, open `/quotes` → **"Create a quote"** (type "Auto Passenger"). Enter Quote name `QA-AP2477-004-<HHMMSS>`, leave NIV empty, choose Marque "Toyota", Modèle "Corolla", Année `2020` → **"Sauvegarder"**. | The quote details page `/quote/{id}/details` opens; record the id. |
| 2 | On the quote details page, open the quote's vehicle: its vehicle link or **"Edit vehicle"** action. Record the URL and vehicle id. | The vehicle's details page (`/vehicle/{vehicleId}/details`) or full edit form opens for Toyota Corolla 2020. |
| 3 | [Verification] Read Kilométrage, Condition, Désignation and Prix on that page (and on its edit form if the details page does not show all four), and confirm the quote name is shown on the quote. | All four are blank / empty — not `0`, not "Neuf"/"New", not a designation or a price. The quote details page shows the name `QA-AP2477-004-<HHMMSS>`. |

---

### AP2477_005 — Saving without a Brand is refused with an error and no quote is created

| Field | Value |
|---|---|
| **TC ID** | AP2477_005 |
| **Title** | Saving without a Brand is refused with an error and no quote is created |
| **Requirement** | AP2477 — REQ-005 (AC 1) |
| **Route** | `/quote/new/edit-vehicle` — Créer une cotation |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (the user allowed the `/quotes` → "Create a quote" entry on dev on 2026-11-01) |
| **Executed on** | 2026-11-01 — Dev (v2dev), resumed s4 run. (2026-10-12 staging run: BLOCKED — build not deployed; superseded) |
| **Result** | PASS — server refused with "This value should not be blank." at Brand and Model; no quote created. |

**Why this matters:** A quote with no make cannot be priced. If the save goes through anyway, the dealer is left with a broken quote they cannot delete.

**Test Data:**

| Variable | Value |
|---|---|
| Brand / Model | left on "Choisir" (Model cannot be chosen without a Brand) |
| Year | `2020` |
| Quote name | `QA-AP2477-005-<HHMMSS>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes`. Note the newest quote at the top of the list. | The quotes list is shown. |
| 2 | Click **"Create a quote"** (type "Auto Passenger"). Enter Quote name `QA-AP2477-005-<HHMMSS>`, leave NIV empty, leave Marque and Modèle on "Choisir", type Année `2020` → **"Sauvegarder"**. | The save is refused: the form is shown again with a validation message at Marque (and Modèle), either from the browser or from the server. No HTTP 500 page. Record which layer refused. |
| 3 | [Verification] Open `/quotes` and read the newest row. | The newest row is still the one noted in step 1; no quote named `QA-AP2477-005-…` exists. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Five fields, in order | AP2477_001, AP2477_002 | — | — | — |
| REQ-002 — Décoder only for VEHICLE types | AP2477_010 (file 2) | — | — | — |
| REQ-003 — Decode pre-fills and keeps details | AP2477_007, AP2477_008 (file 2) | — | — | — |
| REQ-004 — Only Brand/Model/Year required | AP2477_003, AP2477_004 | — | AP2477_002 | AP2477_012 (file 3) |
| REQ-005 — Missing field refused | — | AP2477_005, AP2477_006 (file 2) | — | — |
| REQ-006 — Other forms unchanged | — | — | — | AP2477_011 (file 3) |
| REQ-007 — Quote name kept across decode | AP2477_009 (file 2) | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2477_001 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_001-step3-FiveFieldsOnly_pass.png` |
| AP2477_002 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_002-step2-RequiredMarkersBrandModelYear_pass.png` |
| AP2477_003 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_003-step3-QuotesListNewest6438_pass.png` |
| AP2477_004 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_004-step3-VehicleEdit1069PriceKmEmpty_pass.png` |
| AP2477_005 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_005-step3-NoNewQuoteNewest6440_pass.png` |

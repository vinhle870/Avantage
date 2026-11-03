# Test Cases — AP2477 (File 3 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill
**Source:** requirements/AP-2477-simplify-quote-new-edit-vehicle-minimal-fields.md · qa-artifacts/1-requirements-analysis/AP-2477_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2477_test-plan.md
**Date:** 2026-10-12
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2477_011 to AP2477_012 (2 test cases)
**Coverage:** Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory: sidebar vehicles → `/vehicle` list → **select-vehicle menu** (`#dropdownMenuLink1`) → add form `/vehicle/new/edit/PASSENGER`. New quote: `/quotes` → **"Create a quote"** → `/quote/new/edit-vehicle`; save → `/quote/{id}/details`. Record the route of the warranty / programs step the first time it opens. | `navigation`, Playwright page object `VehicleInventoryPage` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — the dealer username and password from the `env` source (`qa-artifacts/base-test/execute.env.md`: Staging → Portals, or Dev Environment → `DEALER_USERNAME` / `DEALER_PASSWORD`), at `/login` (Dealer ID 1380) | `env` |
| **Inventory form fields** | VIN `#vehicle_VIN`, Brand `vehicle_make`, Model `vehicle_model`, Year `#vehicle_year`, Price `#vehicle_price`, Kilometers `#vehicle_kilometers`, Condition, Fuel type, Transmission, Cylinders, Engine size + unit, Designation, Turbo / 4x4 / AWD, manufacturer-warranty dates and km; submit `[type="submit"]`. | Playwright page object |
| **Test data** | Manual vehicle Toyota / Corolla / `2020` (else first Brand + first Model, noted). **Never edit inventory vehicle 915.** | `test-data` |
| **Language** | French dealer UI | `navigation` |
| **Leaves behind** | AP2477_011 saves nothing (refused). AP2477_012 leaves one quote `QA-AP2477-012-<HHMMSS>` and its vehicle. | `cleanup` (missing) |

**Known blockers:** None at design time.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Execution Context → Login: the clear-text dealer username and password were removed and replaced with a reference to the `env` source (`execute.env.md`) | Credential policy — a credential must never be copied into an artifact | QA Agent (pipeline s4, dev run), per the batch instruction |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them | Regression | Medium | PASS |
| AP2477_012 | A quote created from the minimal form opens its details and warranty step without an error page | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2477_011 — The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them

| Field | Value |
|---|---|
| **TC ID** | AP2477_011 |
| **Title** | The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them |
| **Requirement** | AP2477 — REQ-006 (Assumptions; Tech approach items 1, 4, 5) |
| **Route** | `/vehicle/new/edit/PASSENGER` — inventory add-vehicle form |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev), Chromium 1280×800, dealer account (Dealer ID 1380) |
| **Result** | PASS — /vehicle/new/edit/PASSENGER still shows Vehicle Price* and Kilometers* (full field set); saving with both empty was refused by the server ("This value should not be blank.") and no vehicle was added. |

**Why this matters:** AP-2477 made four vehicle columns nullable for every flow and added a new validation group. If the inventory form picked up the minimal rules by mistake, dealers could stock vehicles with no price or kilometres, which breaks pricing later.

**Test Data:**

| Variable | Value |
|---|---|
| Brand / Model / Year | Toyota / Corolla / `2020` |
| Price, Kilometers | **empty** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer. Open the vehicle inventory, click the select-vehicle menu and choose the **Passenger** add link (`/vehicle/new/edit/PASSENGER`). | The full inventory add-vehicle form opens. |
| 2 | [Verification] List the visible fields. | The form still shows VIN, Brand, Model, Year, **Price**, **Kilometers**, Condition, Fuel type, Transmission, Cylinders, Engine size and unit, Designation, Turbo / 4x4 / AWD and the manufacturer-warranty block, as before AP-2477. |
| 3 | Choose Brand "Toyota", Model "Corolla", Year `2020`, leave **Price** and **Kilometers** empty (fill the other required fields only if the form asks for them) → submit. | The save is refused with a validation message at Price and/or Kilometers (browser or server). No HTTP 500 page. |
| 4 | [Verification] Open the inventory list and look for a new Toyota Corolla 2020 at the top. | No new vehicle was added by step 3. |

---

### AP2477_012 — A quote created from the minimal form opens its details and warranty step without an error page

| Field | Value |
|---|---|
| **TC ID** | AP2477_012 |
| **Title** | A quote created from the minimal form opens its details and warranty step without an error page |
| **Requirement** | AP2477 — REQ-004 (downstream, Tech approach item 7 "Downstream nulls"); Q-002 |
| **Route** | `/quote/{id}/details` → warranty / programs step |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (the user allowed the `/quotes` → "Create a quote" entry on dev on 2026-11-01) |
| **Executed on** | 2026-11-01 — Dev (v2dev), resumed s4 run. (2026-10-12 staging run: BLOCKED — build not deployed; superseded) |
| **Result** | PASS — quote 6440 details loaded twice (HTTP 200); warranty step /quote/6440/warranty/edit opened and asks for Kilometers and Fuel type, no error page. |

**Why this matters:** Quotes have never had a vehicle with no kilometres, condition or price before. The ticket names the warranty pricing, program terms and window sticker code as places that "must tolerate null". If any of them crashes, dealers can create a quote but not sell anything on it.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2477-012-<HHMMSS>` |
| Brand / Model / Year | Toyota / Corolla / `2020` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer, open `/quotes` → **"Create a quote"** (type "Auto Passenger"). Enter Quote name `QA-AP2477-012-<HHMMSS>`, leave NIV empty, choose Marque "Toyota", Modèle "Corolla", Année `2020` → **"Sauvegarder"**. | The quote details page `/quote/{id}/details` opens; record the id. |
| 2 | [Verification] Read the quote details page: vehicle card, sections and actions. Reload it once. | The page loads (no HTTP 500 / "Erreur" page) on both loads and shows Toyota Corolla 2020. Record how empty kilometres / price are displayed. |
| 3 | Open the warranty step from the quote details page (the action that lists warranty programs, e.g. "Ajouter une garantie" / "Add warranty"). Record its route. | The warranty / programs screen opens. |
| 4 | [Verification] Read the screen. | The page loads without an HTTP 500 / "Erreur" page. It either lists programs or shows a clear message that the vehicle's kilometres / condition are needed. Record which (Q-002). An error page is a FAIL. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 — Only Brand/Model/Year required (downstream) | — | — | — | AP2477_012 |
| REQ-006 — Other forms unchanged | — | AP2477_011 | — | AP2477_011 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2477_011 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_011-step3-PriceKmBlankRefused_pass.png` |
| AP2477_012 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2477/AP2477_012-step4-WarrantyModalAsksKmFuel_pass.png` |

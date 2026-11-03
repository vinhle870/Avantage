# Test Cases — AP2225 (File 2 of 4)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2225 — Dealer Area: AutoShield create contract
**Source:** requirements/AP-2225-dealer-area-autoshield-create-contract.md · qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2225_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2225_006 to AP2225_010 (5 test cases)
**Coverage:** Functional · Negative · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → header action **Create quote** → `/quote/new/client?fromVehicleId=915` (client form) → **Save** → `/quote/{id}/details` (the quote hub). From the hub: Edit (Vehicle) → `/quote/{id}/vehicle`; **Add a financing** → `/quote/{id}/financing`; **Road Side Protection** → `/quote/{id}/road-side-protection` (heading "Road Side protection program"). **Never** start a quote at `/quote/new/client` without `fromVehicleId` — the hub then returns HTTP 500. | `navigation` → `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — `vinhle870@gmail.com` at `/login`, password as recorded in the `env` source. After login the dashboard reads "Hi {user} Welcome to Test QA staging's account" (dealer 1380). | `env`, `navigation` |
| **Test data** | Vehicle **915**, VIN `1FAHP35NX8W239204`, Ford Focus 2008, mileage **5000 km**. | `test-data` |
| **Language** | EN by default. Append `?_locale=fr` to a dealer URL to switch the session to French and `?_locale=en` to switch back; always switch back before the case ends. | `domain` (quote-creation.md) |
| **Leaves behind** | Quote A, its autoShield quote, and **one AutoShield contract** created by AP2225_009 in AutoShield's test system (cannot be deleted from the portal). AP2225_010 and AP2225_011 read that same contract. The execution log lists the quote ID and the contract ID. | `cleanup` (missing) |

**Quote A — the full quote** (dynamic, created once per run and shared by the cases that
only read it). Step 1 of each case that needs it says: *use Quote A created earlier in this
run if it exists; otherwise create it as follows.* Values:

1. Client form (`/vehicle/915/details` → **Create quote**): First name `QA`, Last name `AP2225-A-<HHMMSS>` (24-hour time now), Email `client.stage.NNN@yopmail.com` (next unused number), Address `100 rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550101`, Tel. work `5145550102`, tick the policy agreement box → **Save**. The hub `/quote/{id}/details` opens with a Vehicle card for `1FAHP35NX8W239204`.
2. Vehicle step `/quote/{id}/vehicle`: vehicle `1FAHP35NX8W239204` (already selected), Delivery date `2026-10-15`, Price `18500` → **Save**.
3. Financing `/quote/{id}/financing`: applicant date of birth `1985-06-15`, Type "Financing", base amount `15000`, residual amount `0`, payment frequency "Monthly", term `60`, interest rate `6.99`, financing company = the first company in the list (write its name in the execution log) → **Save**.

**Order inside this file.** Run AP2225_006 to AP2225_008 **before** AP2225_009: once a
contract is generated, the Road side protection page of Quote A may change, and a Save test
would then be testing a different state.

**Save button rule (REQ-004).** The `domain` page map (quote-creation.md) records only one
button on `/quote/{id}/road-side-protection`: **Save and Generate Contract**. Every step in
this file that says "click Save" means a button labelled exactly "Save". If no such button
exists, **do not click "Save and Generate Contract"** for a Save step — it creates a real
AutoShield contract that cannot be deleted, and on Quote A it would generate a contract
before AP2225_009 and break the run order above. Record that step **FAIL** with the button
labels seen ("REQ-004: no Save button") and mark the remaining steps of the case **BLOCKED**
by that failure. In place of Save, only AP2225_014 (file 4) may use the combined button.

**Generate Contract rule (same in files 2, 3 and 4).** A step that says "click Generate
Contract" means a button labelled exactly "Generate Contract". If no such button exists,
press **"Save and Generate Contract"** instead (twice within half a second in AP2225_015),
write the label pressed in the log, and judge the step on the page that follows. The missing
"Generate Contract" label is judged by AP2225_007, not by the Generate step. AP2225_009 is
the only case in this file that presses a contract-generating button.

**Known blockers:** None at design time. Judgement questions Q-003, Q-004, Q-005 and Q-008
make the affected steps record-only; each says which.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2225_006 | Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged | Regression | High | FAIL |
| AP2225_007 | The contract button reads "Generate Contract" in English and "Générer le contrat" in French | UI | Medium | FAIL |
| AP2225_008 | Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered | Negative | Medium | FAIL |
| AP2225_009 | Generate Contract opens the autoShield contract page with an AutoShield contract ID, not the quote dashboard with an error | Functional | High | BLOCKED |
| AP2225_010 | The autoShield contract page shows all 17 contract fields, with term, tier, client and vehicle matching the quote | Functional | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2225_006 — Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged

| Field | Value |
|---|---|
| **TC ID** | AP2225_006 |
| **Title** | Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged |
| **Requirement** | AP2225 — REQ-004 ("data is saved in the autoShield quote (separate from the vehicle's quote)") |
| **Route** | `/quote/{id}/road-side-protection`, `/quote/{id}/vehicle` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — step 2: no Sale Price (CAD) / Delivery Date fields; steps 3–5 BLOCKED |

**Why this matters:** The ticket requires the autoShield data to be stored separately. If saving the road-side form wrote back into the vehicle quote, a change made for the AutoShield contract would silently alter the sale price or delivery date used everywhere else on the quote.

**Test Data:**

| Variable | Value |
|---|---|
| Sale Price (CAD) override | `19999` (quote price is `18500`) |
| Delivery Date override | `2026-10-20` (quote delivery date is `2026-10-15`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context. Open `/quote/{id}/vehicle` and write down Delivery date and Price | The vehicle step shows Delivery date `2026-10-15` and Price `18500` |
| 2 | Open `/quote/{id}/road-side-protection`, select the first tier / product option, set Sale Price (CAD) to `19999` and Delivery Date to `2026-10-20`, then click the button labelled exactly "Save". If there is none, do not click "Save and Generate Contract": record this step FAIL with the button labels seen (REQ-004: no Save button) and mark steps 3–5 BLOCKED | The save completes without an error page (record the confirmation shown) |
| 3 | Reload `/quote/{id}/road-side-protection` | Sale Price (CAD) shows `19999` and Delivery Date shows `2026-10-20` |
| 4 | Open `/quote/{id}/vehicle` | The vehicle step loads |
| 5 | [Verification] Verify the vehicle step still shows Delivery date `2026-10-15` and Price `18500`, and the hub `/quote/{id}/details` shows the same price | The vehicle quote is unchanged. A Price of `19999` or a delivery date of `2026-10-20` on the vehicle quote is a FAIL |

---

### AP2225_007 — The contract button reads "Generate Contract" in English and "Générer le contrat" in French

| Field | Value |
|---|---|
| **TC ID** | AP2225_007 |
| **Title** | The contract button reads "Generate Contract" in English and "Générer le contrat" in French |
| **Requirement** | AP2225 — REQ-003 ("There is a button 'Generate Contract'"; "french: 'Générer le contrat'") |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — no "Generate Contract" / "Générer le contrat"; only Save / Sauvegarder |

**Why this matters:** The ticket gives the exact label in both languages. The project's page map (mapped 2026-10) recorded a single button named "Save and Generate Contract", so this case settles what the build shows today.

**Test Data:**

| Variable | Value |
|---|---|
| English label | `Generate Contract` |
| French label | `Générer le contrat` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context. Open `/quote/{id}/road-side-protection?_locale=en` | The page is in English |
| 2 | [Verification] Read the text of every button on the form and write each in the log | A button whose text is exactly "Generate Contract" is present, and a button "Save" is present. Whether one button does both is not judged: record the outcome for Q-003 |
| 3 | Open `/quote/{id}/road-side-protection?_locale=fr` | The page is in French |
| 4 | [Verification] Read the text of every button on the form, then open `/quote/{id}/road-side-protection?_locale=en` to restore English | A button whose text is exactly "Générer le contrat" is present. Record the French text of the other buttons (Q-010). The session is back in English |

---

### AP2225_008 — Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered

| Field | Value |
|---|---|
| **TC ID** | AP2225_008 |
| **Title** | Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered |
| **Requirement** | AP2225 — REQ-004 (Save) — validation not stated, Q-004 |
| **Route** | `/quote/{id}/road-side-protection` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — step 1: no Odometer Reading field; steps 2–3 BLOCKED |

**Why this matters:** The ticket says nothing about required fields. This case does not guess the rule; it proves only that an empty field neither breaks the page nor turns into an invented value, and records what the build does so the reporter can answer Q-004.

**Test Data:**

| Variable | Value |
|---|---|
| Odometer Reading | empty |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context. Open its `/quote/{id}/road-side-protection` page and select the first tier / product option | The form loads with Odometer Reading filled |
| 2 | Clear Odometer Reading completely and click the button labelled exactly "Save". If there is none, do not click "Save and Generate Contract": record this step FAIL with the button labels seen (REQ-004: no Save button) and mark step 3 BLOCKED | No HTTP 500 or error page appears. Record whether the save is refused with a message (write the exact text) or accepted, for Q-004 |
| 3 | [Verification] Reload `/quote/{id}/road-side-protection` and read Odometer Reading | Odometer Reading shows either the last saved value (if the save was refused) or empty / the default `5000` (if it was accepted). Any other number is a FAIL. Record which one for Q-004 |

---

### AP2225_009 — Generate Contract opens the autoShield contract page with an AutoShield contract ID, not the quote dashboard with an error

| Field | Value |
|---|---|
| **TC ID** | AP2225_009 |
| **Title** | Generate Contract opens the autoShield contract page with an AutoShield contract ID, not the quote dashboard with an error |
| **Requirement** | AP2225 — REQ-005 (the backend logs in, checks or creates the lender, creates the contract) and REQ-006 AC 1 and 3 ("The user is redirected to the autoShield contract page"; "autoshield contract ID") |
| **Route** | `/quote/{id}/road-side-protection` → autoShield contract page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | BLOCKED — no "Generate Contract" nor "Save and Generate Contract" on Dev |

**Why this matters:** This is the purpose of the ticket. The backend steps cannot be watched from the dealer screens, so a contract page with an AutoShield contract ID is the proof that login, lender handling and contract creation all worked. It also re-checks bug AP-2258, where Generate Contract showed the Quote Dashboard with an error message instead.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A, after AP2225_005 to AP2225_008 have run |
| Tier | The first tier / product option — write its product, tier, term and price in the log |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal. Use Quote A if it exists in this run; otherwise create it with the values in the Execution Context. Open its `/quote/{id}/road-side-protection` page | The form loads |
| 2 | Select the first tier / product option, put Odometer Reading back to `5000` if it is empty, and write the chosen product, tier, term and price in the log | The option is selected and every field has a value |
| 3 | Click the button labelled exactly "Generate Contract". If there is none, press "Save and Generate Contract" instead (the missing label is judged by AP2225_007, not here). Write the label pressed in the log and wait for the next page to finish loading | The browser leaves the form; write the new URL in the log |
| 4 | [Verification] Verify the page is the autoShield contract page and shows an AutoShield contract ID; write the ID in the log | A contract page with a non-empty AutoShield contract ID is shown. The Quote Dashboard / hub with an error message (as in AP-2258), an error page or a page with no contract ID is a FAIL. If an error is shown, record its exact text for Q-005 |

---

### AP2225_010 — The autoShield contract page shows all 17 contract fields, with term, tier, client and vehicle matching the quote

| Field | Value |
|---|---|
| **TC ID** | AP2225_010 |
| **Title** | The autoShield contract page shows all 17 contract fields, with term, tier, client and vehicle matching the quote |
| **Requirement** | AP2225 — REQ-006 AC 2 and 4 ("Data is retrieved from the get contract rest API"; the 17 listed fields) |
| **Route** | autoShield contract page (URL recorded by AP2225_009) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | BLOCKED — by AP2225_009 (no contract) |

**Why this matters:** This page is the dealer's only proof of what was registered with AutoShield. A field missing or showing another client's data would mean the dealer hands over a contract they cannot check.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The contract generated by AP2225_009 (its URL and ID are in the log). If AP2225_009 did not produce one, this case is BLOCKED by AP2225_009 |
| Expected matches | Client `QA AP2225-A-<HHMMSS>`; vehicle VIN `1FAHP35NX8W239204`; product, tier and term chosen in AP2225_009 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and open the contract page URL recorded by AP2225_009 | The autoShield contract page loads with the same contract ID |
| 2 | [Verification] Check that each of these 17 items is present on the page, and write its label and the value shown in the log: appNumber, statusCode, effectiveDate, expiryDate, termInMonths, tier, product.name, client, vehicle, coverageKm, provincialSalesTax, gstHst, totalTaxCAD, salePriceWithTaxCAD, deductible, surcharges, isPayed | All 17 items are shown. A missing item is a FAIL. Labels, formats and how client, vehicle and surcharges are laid out are not judged: record the outcome for Q-008 |
| 3 | [Verification] Compare termInMonths, tier, product.name, client and vehicle with the expected matches in Test Data | Term, tier and product equal the option chosen in AP2225_009; the client shows `QA AP2225-A-…` and the vehicle shows VIN `1FAHP35NX8W239204` (if the vehicle is displayed by VIN). A different client, vehicle, term, tier or product is a FAIL |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 — Save, separate from the vehicle quote | AP2225_005 (file 1) | AP2225_008 | — | AP2225_006 |
| REQ-003 — "Generate Contract" / "Générer le contrat" | AP2225_007 | — | — | — |
| REQ-005 — backend contract creation (proven by its visible result) | AP2225_009 | AP2225_012 (file 3) | — | AP2225_009 (AP-2258) |
| REQ-006 AC 1, 3 — redirect and contract ID | AP2225_009 | — | — | — |
| REQ-006 AC 2, 4 — the 17 fields | AP2225_010 | — | — | — |
| REQ-006 AC 5 — PDF link | AP2225_011 (file 3) | — | — | — |

REQ-005 AC 2 (storing a newly created lender ID) is covered by AP2225_013 in file 4, added at
Gate B: it reads the financing company's "AutoShield Lender ID" in the Admin portal (field
added by AP-2226) before and after Generate Contract. AP2225_009 on its own shows only that
the lender step did not stop the contract from being created.

**Revisions**

| Date | TC | Change | Why |
|---|---|---|---|
| 2026-11-01 | AP2225_006, AP2225_008, Execution Context | Save button rule: no standalone "Save" → step FAIL (REQ-004), rest BLOCKED, never click "Save and Generate Contract" | Independent R2 review F-2 |
| 2026-11-01 | AP2225_009 step 3, Execution Context | Generate Contract rule: no standalone "Generate Contract" → press "Save and Generate Contract", log the label pressed; the missing label is judged by AP2225_007. Save rule reworded ("in place of Save, only AP2225_014 may use the combined button") | Independent R2 review round 2 F-1 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2225_006 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_006-step2-NoSalePriceDeliveryFields_fail.png` |
| AP2225_007 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_007-step4-FrenchNoGenererLeContrat_fail.png` |
| AP2225_008 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_008-step1-NoOdometerField_fail.png` |
| AP2225_009 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_009-step3-NoGenerateButton_blocked.png` |
| AP2225_010 | BLOCKED | — |

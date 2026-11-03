# Bug Report — AP-2225

**Project:** Avantage Plus v2 — Dealer portal (Jira project AP)
**Report ID:** BR-20261101-001
**Test Cycle:** Test of AP-2225 "Dealer Area: AutoShield create contract" — the Road side protection page of a quote, its fields, its Save and Generate Contract buttons and the AutoShield contract page (run folder `3.0.0`, the ticket's fix version)
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md and qa-artifacts/3-test-cases/AP2225_TestCases_001-005.md, _006-010.md, _011-012.md, _013-015.md
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca (the user's decision for this run, instead of Staging)
**Gate C decision:** qa-artifacts/7-reviews/AP-2225_review.md, R3 round 1 (independent reviewer, APPROVE, 2026-11-01T16:45:00Z) — rule C4, file ONE new bug for all seven FAILs

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 1 |
| Medium | 0 |
| Low | 0 |
| Tracker tickets created | 1 |

The seven failed test cases have one cause, so they are filed as one bug. The Road side
protection page of a quote on Dev shows only the AutoShield product options, a "Policy Sale
price" field, a Vehicle box (VIN, Make, Model, Year) and a "Save" button. The vehicle,
client, date and financing fields that AP-2225 asks for, and the "Generate Contract" /
"Générer le contrat" button, are not there. The same bug blocks six more cases that need
a generated contract (AP2225_009, _010, _011, _012, _013, _015).

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2225_002, AP2225_003, AP2225_005, AP2225_006, AP2225_007, AP2225_008, AP2225_014 | The Road side protection page has no vehicle, client, date or financing fields and no "Generate Contract" button, so no AutoShield contract can be created | High | P1 | [AP-2508](https://garantieavantageplus.atlassian.net/browse/AP-2508) | Open |

---

## Bug Details

---

### BUG-001 — The Road side protection page has no vehicle, client, date or financing fields and no "Generate Contract" button

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2225_002, AP2225_003, AP2225_005, AP2225_006, AP2225_007, AP2225_008, AP2225_014 (FAIL). It also blocks AP2225_009, AP2225_010, AP2225_011, AP2225_012, AP2225_013 and AP2225_015 |
| **Requirement** | REQ-002 — Vehicle and client fields prefilled from the quote · REQ-003 — 'Generate Contract' button and its French label · REQ-004 — Save stores the data in the autoShield quote (the fields to save are missing) · REQ-005 / REQ-006 — contract creation and the contract page (cannot be reached) |
| **Severity** | High — a dealer cannot see or correct the vehicle and client data that go to AutoShield, and has no button that creates the AutoShield contract, which is the purpose of the story |
| **Priority** | P1 |
| **Environment** | Tested on: Dev (v2dev) — https://v2dev.garantieavantageplus.ca · Chromium (Playwright) · Windows 11 · 1280 × 800 |
| **Tracker Ticket** | [AP-2508](https://garantieavantageplus.atlassian.net/browse/AP-2508) — Bug, priority High, labels qa-agent / stlc-automated, relates to AP-2225, assigned to Ken Nguyen (`bug_new_assign`), 6 screenshots embedded in the description and verified (6 resolved media nodes) |
| **Status** | Open |
| **First found** | 2026-11-01 |
| **Reproducibility** | Always (quotes 6451, 6452 and 6453 on Dev, English and French) |

**Summary:**
On Dev, the dealer portal's "Road Side protection program" page (`/quote/{id}/road-side-protection`) shows only the AutoShield product options, a "Policy Sale price" field, a Vehicle box with VIN, Make, Model and Year, and one "Save" button; the vehicle, client, date and financing fields and the "Generate Contract" / "Générer le contrat" button that AP-2225 describes are missing, so a dealer cannot create an AutoShield contract.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/login and sign in to the Dealer portal with the QA dealer account (Dealer ID 1380, company "Test QA staging").
2. Open https://v2dev.garantieavantageplus.ca/vehicle/915/details (Ford Focus 2008, VIN `1FAHP35NX8W239204`, mileage 5000 km) and click "Create quote". On the client step enter a new client (we used "QA AP2225-A-162747", email `client.stage.919@yopmail.com`, phone 5145550101, address 100 rue Test, Montréal, Québec, H2X 1Y4) and save. On the vehicle step set "Delivery date" to 2026-10-15 and "Price" to 18500 and click "Save". On the financing step choose the financing company "AutoCapital Canada", enter Financed amount 15000, Residual 0, payment frequency Monthly, Term 60 and Interest rate 6.99, and save. The quote hub shows the alert "Financing saved". (Skip this step and use quote 6451, which was created exactly this way, if it still exists.)
3. Open https://v2dev.garantieavantageplus.ca/quote/6451/road-side-protection (replace 6451 with your quote number). From the quote hub the same page opens from the pencil of the "Roadside Protection" row in "Summary of products".
4. In the "Vehicle" box click "Edit". Read every field and every button on the page.
5. Open https://v2dev.garantieavantageplus.ca/quote/6451/road-side-protection?_locale=fr and read every button again. Open the same URL with `?_locale=en` to return to English.

**Expected Result:**
The page matches AP-2225's acceptance criteria, quoted from the ticket:

> *Given* A dealer user has created a vehicle's quote
> *When* The user is on the quote > 'Road side protection' page.
> *Then* The autoShield-quote is created (AP-2188) with a list of products available and it's pricing
> There is a list of fields for Vehicle and Client info that is prepopulated with the quote data
> There is a button 'Generate Contract'
> french: 'Générer le contrat'
>
> *When* The user clicks on the 'Save' button
> *Then* The autoShield, vehicle, client data is saved in the autoShield quote (separate from the vehicle's quote)
>
> *When* The user clicks on the 'Generate Contract' button
> *Then* […] creates the contract VIA autoshield API […] The user is redirected to the autoShield contract page

The vehicle fields listed for this form in the ticket (Ken Nguyen, 2025-04-14) are VIN, Stock Number, Condition, Odometer Reading, Purchase Price, In Service Date, Purchase Date, Delivery Date, Classification Date, Purchase Type, Financed Amount, Interest Rate, Sale Price (CAD) and Financing Company, prefilled from the quote and changeable by the dealer. So the page should show these fields, client fields with the quote's client details, a "Save" button and a "Generate Contract" button ("Générer le contrat" in French).

**Actual Result:**
The page shows a heading "Road Side protection program", five AutoShield options with prices (for example "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$*"), an empty "Policy Sale price*" field, and a "Vehicle" box that, after "Edit", holds only VIN (prefilled `1FAHP35NX8W239204`), Make ("Choose"), Model ("Choose"), Year (2008) and "Continue". There are no Stock Number, Condition, Odometer Reading, Purchase Price, In Service Date, Purchase Date, Delivery Date, Classification Date, Purchase Type, Financed Amount, Interest Rate, Sale Price (CAD) or Financing Company fields, and no client section or client field at all. The only buttons are "×", "Back", "Edit", "Choose", "Choose", "Continue" and "Save"; in French "Retour", "Éditer", "Choisir", "Choisir", "Continuer" and "Sauvegarder". There is no "Generate Contract", no "Générer le contrat" and no "Save and Generate Contract" button. The page form `quote_auto_shield` holds only the product choice (`selectedTier`), `salePrice`, a hidden `action` field with an empty value and the submit button `quote_auto_shield[save]`. The same page was seen on quotes 6451, 6452 and 6453. No error message and no HTTP 500 appear.

What each failed test case could not do:

| TC ID | What it checked | What happened |
|---|---|---|
| AP2225_002 | Vehicle fields prefilled from the quote | Only VIN and Year are on the page; the other 12 listed fields are missing |
| AP2225_003 | Client fields show the quote's client | No client section or client field on the page |
| AP2225_005 | An overridden Odometer Reading and Stock Number are kept after Save | No Odometer Reading or Stock Number field to change |
| AP2225_006 | Saving a changed Sale Price (CAD) and Delivery Date leaves the vehicle quote unchanged | No Sale Price (CAD) or Delivery Date field; the only price field is "Policy Sale price", the price of the AutoShield policy |
| AP2225_007 | Button "Generate Contract" in English and "Générer le contrat" in French | Only "Save" / "Sauvegarder"; no contract button in either language |
| AP2225_008 | Saving with Odometer Reading emptied does not crash | No Odometer Reading field to empty |
| AP2225_014 | Overridden Odometer, Stock Number and Sale Price (CAD) reach the generated contract | None of these fields exists, and no contract button exists |

**These fields and the button existed on staging in earlier builds:**

- On **2026-07-25**, a QA comment on AP-2423 quotes the validation "Vehicle age exceeds allowable limits! Please verify the In-Service Date", raised by this page's "Purchase Date" and "In service date" fields on staging.
- On **2026-08-29**, the QA page map of staging (`qa-artifacts/qa-docs/quote-creation.md`) recorded this page with the fields `selectedTier`, `salePrice`, `VIN`, `stockNumber`, `vehicleCondition`, `odometerReading` and a **"Save and Generate Contract"** button.
- The current build on Dev carries later work on this page: the VIN warning from AP-2423, the Make/Model form from AP-2424 and the VIN and Year inputs from AP-2498 (pull request merged 2026-10-26). So these fields and the contract button are missing from the current build on Dev.

**Question for the developer:** were the vehicle, client, date and financing fields and the "Generate Contract" / "Save and Generate Contract" button removed from the Road side protection page on purpose? If so, which control now creates the AutoShield contract? QA has not pressed "Save" in place of Generate Contract, because AP-2225 describes "Save" and "Generate Contract" as two different actions and every generated AutoShield contract is a real record that cannot be deleted from the portal.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_002-step4-VehicleFieldsMissing_fail.png` — quote 6451, Vehicle box opened: only VIN, Make, Model and Year |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_003-step3-NoClientFields_fail.png` — only the "Vehicle" and "Product info" sections; no client field |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_006-step2-NoSalePriceDeliveryFields_fail.png` — only "Policy Sale price" and "Save"; no Sale Price (CAD), Delivery Date or Odometer Reading |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_007-step2-EnglishOnlySaveButton_fail.png` — English page: buttons "Back", "Edit", "Save" only |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_007-step4-FrenchNoGenererLeContrat_fail.png` — French page: "Retour", "Éditer", "Sauvegarder"; no "Générer le contrat" |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_014-step2-NoOverrideFields_fail.png` — quote 6453: no Odometer, Stock Number or Sale Price (CAD) field to override |
| Console log | None captured — no error tied to a step |

**Suggested Root Cause:**
Unknown — for developer investigation. The page form `quote_auto_shield` has a hidden `action` field with an empty value and a single submit button, and the page script `/build/app.252fda50.js` has no code that sets `action` or mentions contract generation. This suggests the contract part of the form was taken out or replaced when the page was reworked (AP-2424, AP-2498).

**Notes:**
- Dev is connected to AutoShield: every quote opened lists five AutoShield products with prices (AP2225_001 passed).
- The two AutoShield contracts that exist for VIN `1FAHP35NX8W239204`, #2697 and #2698 (quotes 6253 and 6254, 2026-07-25), were created on **staging**, not on Dev (bug AP-2432 shows them at v2staging addresses). Dev's data appears to be copied from staging. No contract was created during this test.
- Test data left on Dev: quotes 6451, 6452 and 6453 (no AutoShield contract).
- Blocked by this bug: AP2225_009 (Generate Contract opens the contract page), AP2225_010 (the 17 contract fields), AP2225_011 (the contract PDF), AP2225_012 (Generate Contract with no financing company), AP2225_013 (a new AutoShield lender ID is stored) and AP2225_015 (a double click creates one contract). They will be re-run once a build with a contract-generating control is on the test environment, or once a developer names that control here.

---

## Not filed — and why

| Planned item | Decision |
|---|---|
| "No standalone Save button" (REQ-004), planned at test-case review R2 for AP2225_005, _006, _007, _008 | **Not filed.** A button labelled exactly "Save" exists on Dev. Those four cases failed because the fields they change are missing, which is part of BUG-001 (R3, Gate C) |

## Blocked by BUG-001

| TC ID | Title | Blocked by |
|---|---|---|
| AP2225_009 | Generate Contract opens the autoShield contract page with an AutoShield contract ID | BUG-001 / AP-2508 — no contract-generating button |
| AP2225_010 | The autoShield contract page shows all 17 contract fields | BUG-001 / AP-2508 — no contract generated (needs AP2225_009) |
| AP2225_011 | The contract page's PDF link delivers the contract as a PDF | BUG-001 / AP-2508 — no contract generated (needs AP2225_009) |
| AP2225_012 | Generate Contract on a quote with no financing company ends without a crash | BUG-001 / AP-2508 — no contract-generating button |
| AP2225_013 | Generating with a financing company that has no AutoShield Lender ID stores one | BUG-001 / AP-2508 — no contract-generating button |
| AP2225_015 | Double-clicking Generate Contract creates only one contract | BUG-001 / AP-2508 — no contract-generating button |

AP2225_004 is BLOCKED for a different reason (test data): on Dev the quote vehicle step
requires a Delivery date ("This value should not be blank."), so a quote with no delivery
date cannot be created. That is not filed as a bug.

---

## Defect Distribution

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2225_002, _003, _005, _006, _007, _008, _014 (blocks _009–_013, _015) |
| Medium | 0 | — |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-002 — Prefilled vehicle and client fields | 1 | BUG-001 |
| REQ-003 — Generate Contract label (EN/FR) | 1 | BUG-001 |
| REQ-004 — Save to the autoShield quote | 1 | BUG-001 |
| REQ-005 — Backend contract creation | 1 (blocks) | BUG-001 |
| REQ-006 — The autoShield contract page | 1 (blocks) | BUG-001 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2508 | Created (stlc-bug-reporter), linked Relates → AP-2225, assigned to Ken Nguyen, evidence embedded and verified | Backlog (new) | 2026-11-01 |

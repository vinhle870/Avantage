# Bug Report

**Project:** Avantage Plus v2 — Dealer portal (warranty contracts, quotes)
**Report ID:** BR-20261006-001
**Test Cycle:** Playwright regression suite (migrated from the legacy Java/Selenium suite) — full run on v2staging, 43 browser tests: 35 PASS, 8 FAIL
**Date:** 2026-10-06
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** `playwright-automation` full run 2026-10-06 (`npx playwright test --project=chromium`) · specs `src/tests/dealer/warranty.spec.ts`, `src/tests/dealer/existingQuote.spec.ts` · each finding re-verified by hand on 2026-10-06

| Metric | Value |
|---|:---:|
| Total defects | 2 open (3 filed; AP-2489 closed as not a bug) |
| Critical | 0 |
| High | 0 |
| Medium | 1 open + 1 not a bug |
| Low | 1 |
| Tracker tickets created | 3 (AP-2488, AP-2489, AP-2490) |

**Failing tests and how they map to defects:**

| Test | Client province | Defect |
|---|---|---|
| TC010_DealerCanCreateWarranty | New Brunswick | BUG-001 |
| TC1579_DealerCanCreateWarranty | New Brunswick | BUG-001 |
| TC001_SmokeTest_DealerCanCreateNewWarrantyForExistingVehicle | New Brunswick | BUG-001 |
| TC1580_DealerCanCreateWarranty | Newfoundland and Labrador | BUG-001 |
| TC1582_DealerCanCreateWarranty | Nova Scotia | BUG-001 |
| TC1584_DealerCanCreateWarranty | Ontario | BUG-001 |
| TC1585_DealerCanCreateWarranty | Prince Edward Island | BUG-001 |
| TC1583_DealerCanCreateWarranty | Nunavut | BUG-003 |

BUG-002 has no failing test: the suite does not assert on that banner. It was found while porting TC1411 and confirmed by hand.

**Closed after filing:** BUG-002 / AP-2489 — the QA accepted the current behaviour on 2026-10-06 ("for current behavior, it is acceptable"): the banner is informational and does not block "Generate Contract". AP-2489 was commented and moved to Done; no code change.

**Not filed:** program 1 "Garantie de base AP" prints its description as `COMPONENTS_1_TO_6` on the warranty contract. That is the value stored in the program's EN and FR translations in the admin portal (Admin → Programs → program 1 → EN / FR), so the PDF is printing the configuration correctly. If the text should read differently, it is a configuration change, not a code defect.

Duplicate search (Bugs in AP matching "HST", "GST warranty", "Nunavut", "Nanavut", "delivery date acceptable timeframe", "timeframe") found only closed tickets: AP-1360/1362/1363 (Nunavut, Yukon and Northwest Territories tax names, 2022), AP-1409 (Alberta GST text, 2022) and AP-1870 (dates on incomplete PDFs). None covers these findings.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | TC1579, TC1580, TC1582, TC1584, TC1585, TC010, TC001 | Warranty contract labels the 13–15% HST as "GST" for clients in HST provinces | Medium | P2 | [AP-2488](https://garantieavantageplus.atlassian.net/browse/AP-2488) | Open |
| BUG-002 | TC1411 (manual check) | "Generate Contract" warns that the delivery date has passed the acceptable timeframe even when it is today | Medium | P3 | [AP-2489](https://garantieavantageplus.atlassian.net/browse/AP-2489) | Not a bug |
| BUG-003 | TC1583 | Client province list spells Nunavut as "Nanavut" | Low | P4 | [AP-2490](https://garantieavantageplus.atlassian.net/browse/AP-2490) | Open |

---

## Bug Details

---

### BUG-001 — Warranty contract labels HST as "GST" for clients in HST provinces

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | TC1579, TC1580, TC1582, TC1584, TC1585, TC010, TC001_SmokeTest (Playwright) |
| **Requirement** | AP-1553 — warranty taxes calculated from the client's province; AP-1342 — tax per province on the contract PDF ("PEI – 15% HST", "Newfoundland and Labrador – 15% HST"). See "Requirement basis" below |
| **Severity** | Medium — the warranty contract handed to the customer names the wrong tax in five provinces. The amounts are right, so nobody is over- or under-charged, but the legal document is incorrect, and the label contradicts the amount (a 15% tax labelled "GST", which is 5%). |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2488](https://garantieavantageplus.atlassian.net/browse/AP-2488) — Bug, priority Medium, assigned Ken Nguyen, labels qa-agent / stlc-automated, relates to AP-1342, 2 PDFs attached and linked |
| **Status** | Open |
| **First found** | 2026-10-05 |
| **Reproducibility** | Always — 7/7 HST-province runs on 2026-10-05 and 2026-10-06 (New Brunswick ×3, Newfoundland and Labrador, Nova Scotia, Ontario, Prince Edward Island) |

**Summary:**
On the dealer portal, the warranty contract PDF of a quote whose client lives in New Brunswick, Newfoundland and Labrador, Nova Scotia, Ontario or Prince Edward Island prints the tax line as "GST : $…" instead of "HST : $…", even though the amount charged is the HST rate (15%, or 13% for Ontario, 14% for Nova Scotia).

**Requirement basis:**

1. **AP-1553 — "Calculate warranty contract taxes based on client's province"** (Done, Dec 2022): *"When a warranty is created, taxes should be calculated based on the client's province, not the dealer province."* It replaced AP-1342's dealer-province rule. The app follows it for the amount (a New Brunswick client is charged 15% although the dealer is in Quebec).
2. **QA verification of AP-1553** (11 Nov 2022, client Prince Edward Island, dealer New Brunswick, sale price 2000): *"Warranty PDF Tax(HST): 300 is correct — Finalized PDF: Tax (HST): 300 is correct."* The accepted behaviour labelled the tax "HST".
3. **Warranty contract staging generated on 3 Sept 2025** (`TestDocument/WarrantyContract_250903122625.pdf`): client New Brunswick, dealer in Newfoundland and Labrador — the tax line reads "HST : $3,150.00". Same data and amount as today, different label.
4. **AP-1342 — "Contract PDF: Taxes needs to be calculated for all provinces"**: names the tax type per province ("PEI – 15% HST", "Newfoundland and Labrador – 15% HST"). AP-1360, AP-1362 and AP-1363 were fixed for wrong tax *names*, confirming the label is part of the requirement. Its "based on the dealer's province" was superseded by AP-1553.
5. **AP-770 — "Extra-Provincial Tax designation"**: *"If New Brunswick (dealer) is added — system prompted for HST tax calculation."*

**Conditions observed:** both earlier "HST" cases had the *dealer* in an HST province too (New Brunswick in 2022, Newfoundland and Labrador in Sept 2025). The dealer account used today is in Quebec, and the label is "GST" for every client province. So it is not known whether the label used to follow the client's province and broke (a regression), or has always followed the dealer's province and only shows now because the dealer account moved to Quebec. Either way, under AP-1553 the label must match the tax actually charged, which follows the client's province.

Gap: no story spells out the label text for New Brunswick, Nova Scotia or Ontario. For those, the expectation rests on AP-1553, the 2022 verification, and the fact that these provinces levy HST.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/login`, sign in with a dealer account whose province is **Quebec** (the staging dealer "Test QA staging" is) (Courriel / Mot de passe, then click "Login").
2. In the left sidebar open "Vehicles" → "Quotes", then click "Create a quote".
3. Fill the vehicle: VIN `33333333`, Year `2015`, Brand `Fiat`, Model `500`, Price `10000.00`, Km `20000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `2`, Engine size `2`, Engine size unit `Litre`, Designation `Particular`, Quote name `HST-repro`. Click "Save". The quote detail page opens.
4. In the "Client" section click "Add". Fill Email `ap_automation_test@yopmail.com`, Last name `lastName`, First name `firstName`, Address `Address`, City `City`, Province **`New Brunswick`**, Postal code `12345`, Tel home `11111`, Tel work `22222`, Drivers license `Driverslicense`, tick the policy checkbox and click "Save".
5. In "Summary of products", click the pencil on the "Extended warranty" row. Expand the program "Garantie de base AP", choose "option 1" → term "100m/20000km", enter Sale price `21000` and click "Save".
6. On the "Extended warranty" row, open the "…" menu and click "Generate Contract". Look at the contract preview at the top of the dialog (the same PDF is at `/quote/{quote id}/pdf`). Do **not** click the "Generate Contract" button.
7. Repeat with Province `Ontario`, `Nova Scotia`, `Newfoundland and Labrador` or `Prince Edward Island` in step 4.

**Expected Result:**
The tax line reads "HST : $3,150.00" for New Brunswick (15% of $21,000.00), and "HST" with the matching amount for the other four provinces. AP-1342 defines these provinces as HST provinces, and the legacy regression suite expected "HST".

**Actual Result:**
The tax line reads "GST : $3,150.00" for New Brunswick, and "GST : $2,730.00" for Ontario (13%). The total ($24,150.00 / $23,730.00) is correct. Only the label is wrong. Nova Scotia charges 14% ($2,940.00), which is correct since April 2025, but it is also labelled "GST".

**Evidence:**

| Type | Path / Link |
|---|---|
| PDF | `qa-artifacts/4-execution-results/screenshots/automation/2026-10-06/BUG-001-TC1579-WarrantyContract.pdf` — New Brunswick client, line "GST : $3,150.00" |
| PDF | `qa-artifacts/4-execution-results/screenshots/automation/2026-10-06/BUG-001-TC1584-WarrantyContract.pdf` — Ontario client, line "GST : $2,730.00" |
| Reference PDF | `qa-artifacts/4-execution-results/screenshots/automation/2026-10-06/BUG-001-reference-2025-09-03-NB-client-NL-dealer-HST.pdf` — staging, 3 Sept 2025, New Brunswick client, Newfoundland dealer: "HST : $3,150.00" |
| Extracted text | `…/BUG-001-TC1579-pdf-text.txt`, `…/BUG-001-TC1584-pdf-text.txt` |
| Console log | None captured |

**Suggested Root Cause:**
Most likely, the tax label is taken from the dealer's province while the amount is taken from the client's province (AP-1553). With a Quebec dealer the label is always "GST", whatever the client's province. To confirm, compare with a dealer in an HST province. Unknown — for developer investigation.

**Notes:**
- Alberta, British Columbia, Manitoba, Saskatchewan, Québec, Yukon and Northwest Territories print correctly (their federal tax is GST).
- The Nova Scotia rate itself is correct (14% since 2025-04-01), only its label is wrong.

---

### BUG-002 — "Generate Contract" warns that the delivery date has passed even when it is today

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | TC1411_DealerCanFinalizeSaleAndSeeInvoice (manual verification) |
| **Requirement** | AP-1923 — Delivery Date date block: the dealer can select today and future dates |
| **Severity** | Medium — every dealer who generates a warranty contract sees a red error banner telling them to change a delivery date that is valid. It does not block the contract, so dealers can ignore it, but it pushes them to edit correct dates and hides any real warning. |
| **Priority** | P3 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2489](https://garantieavantageplus.atlassian.net/browse/AP-2489) — Bug, priority Medium, assigned Ken Nguyen, labels qa-agent / stlc-automated, relates to AP-1923, 2 screenshots embedded and verified |
| **Status** | Not a bug — accepted as current behaviour by the QA on 2026-10-06; AP-2489 moved to Done |
| **First found** | 2026-10-05 |
| **Reproducibility** | Always — 3/3 on 2026-10-06 with delivery and warranty start dates of today (2026-10-06), 3 days ago and 40 days ago (quotes 6393, 6394, 6395) |

**Summary:**
On the dealer portal, the "Generate Contract" dialog of an extended warranty always shows the red banner "The delivery date has passed the acceptable timeframe. Please update the delivery data and the warranty start date", even when the delivery date and warranty start date are today.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/login`, sign in with a dealer account (Courriel / Mot de passe, then click "Login").
2. In the left sidebar open "Vehicles" → "Quotes", then click "Create a quote".
3. Fill the vehicle: VIN `33333333`, Year `2015`, Brand `Fiat`, Model `500`, Price `10000.00`, Km `20000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `2`, Engine size `2`, Engine size unit `Litre`, Designation `Particular`, Quote name `DeliveryDate-repro`. Click "Save".
4. In the "Client" section click "Add". Fill Email `ap_automation_test@yopmail.com`, Last name `lastName`, First name `firstName`, Address `Address`, City `City`, Province `New Brunswick`, Postal code `12345`, Tel home `11111`, Tel work `22222`, Drivers license `Driverslicense`, tick the policy checkbox and click "Save".
5. In "Summary of products", click the pencil on the vehicle row ("Fiat 500 2015"). Set Delivery date to **today's date** (e.g. `2026-10-06`) and Price `2000.00`, then click "Save".
6. Click the pencil on the "Extended warranty" row. Expand "Garantie de base AP", choose "option 1" → "100m/20000km", enter Sale price `21000` and click "Save".
7. On the "Extended warranty" row, open the "…" menu and click "Generate Contract". Read the top of the dialog and the "Delivery date" and "Warranty date start" fields.

**Expected Result:**
No warning is shown. Delivery date and Warranty date start are both today, which AP-1923 allows ("The dealer user can select only that date and future dates").

**Actual Result:**
The dialog opens with the red banner "The delivery date has passed the acceptable timeframe. Please update the delivery data and the warranty start date", while its own "Delivery date" and "Warranty date start" fields show `2026-10-06` (today). The same banner appears with dates 3 and 40 days in the past, so it does not depend on the date. Clicking "Generate Contract" still succeeds and creates the invoice.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/automation/2026-10-06/BUG-002-delivery-date-warning-today.png` — the banner at the top of the dialog (quote 6393) |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/automation/2026-10-06/BUG-002-delivery-date-today-fields.png` — the same dialog scrolled down: Delivery date `2026-10-06`, Warranty date start `2026-10-06` |
| Console log | None captured |

**Suggested Root Cause:**
The check that decides whether to show the banner probably compares against the wrong date (for example the quote's creation date, a stored warranty date, or a delay from AP-2185 applied the wrong way round), or its condition is inverted. Unknown — for developer investigation.

---

### BUG-003 — Client province list spells Nunavut as "Nanavut"

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | TC1583_DealerCanCreateWarranty (Playwright) |
| **Requirement** | AP-1342 — all provinces and territories supported, including Nunavut |
| **Severity** | Low — a spelling mistake in the province list. Dealers can still pick the entry, but the misspelt name can appear on documents produced for the client, and anything that looks the territory up by its real name (like the regression suite) cannot find it. |
| **Priority** | P4 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2490](https://garantieavantageplus.atlassian.net/browse/AP-2490) — Bug, priority Low, assigned Ken Nguyen, labels qa-agent / stlc-automated, relates to AP-1342, 1 screenshot embedded and verified |
| **Status** | Open |
| **First found** | 2026-10-05 |
| **Reproducibility** | Always |

**Summary:**
On the dealer portal, the "Province" dropdown of a quote's client form lists the territory as "Nanavut" instead of "Nunavut".

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/login`, sign in with a dealer account (Courriel / Mot de passe, then click "Login").
2. In the left sidebar open "Vehicles" → "Quotes", then click "Create a quote".
3. Fill the vehicle: VIN `33333333`, Year `2015`, Brand `Fiat`, Model `500`, Price `10000.00`, Km `20000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `2`, Engine size `2`, Engine size unit `Litre`, Designation `Particular`, Quote name `Nunavut-repro`. Click "Save".
4. In the "Client" section click "Add" (or "Edit" if a client is already set), then open the "Province" dropdown and scroll to the last entry.

**Expected Result:**
The last entry reads "Nunavut".

**Actual Result:**
The last entry reads "Nanavut". The full list is: Québec, Ontario, British Columbia, Alberta, Manitoba, Saskatchewan, Nova Scotia, New Brunswick, Newfoundland and Labrador, Prince Edward Island, Northwest Territories, Yukon, Nanavut.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/automation/2026-10-06/BUG-003-province-list-Nanavut.png` — the open Province list with "Nanavut" as the last entry (quote 6393) |
| Console log | None captured |

**Suggested Root Cause:**
A typo in the province label (translation file or seed data). Unknown — for developer investigation.

**Notes:**
- Filed below the Medium threshold at the QA's request.

---

## Defect Distribution

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | TC010, TC1579, TC1580, TC1582, TC1584, TC1585, TC001_SmokeTest, TC1411 |
| Low | 1 | TC1583 |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| AP-1553 — warranty taxes by client province | 1 | BUG-001 |
| AP-1342 — Contract PDF: taxes for all provinces | 2 | BUG-001, BUG-003 |
| AP-1923 — Delivery Date date block | 1 | BUG-002 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2488 | Created | Backlog | 2026-10-06 |
| BUG-001 | AP-2488 | Description revised: "regression" claim removed, dealer-province condition and root-cause hypothesis added, Sept 2025 reference PDF attached | Backlog | 2026-10-06 |
| BUG-001 | AP-2488 | Description: "Requirement basis" added (AP-1553, 2022 verification, AP-1342, AP-770); linked relates-to AP-1553 | Backlog | 2026-10-06 |
| BUG-002 | AP-2489 | Created | Backlog | 2026-10-06 |
| BUG-002 | AP-2489 | Commented ("Closed as not a bug — QA decision"), status moved | Done | 2026-10-06 |
| BUG-003 | AP-2490 | Created | Backlog | 2026-10-06 |

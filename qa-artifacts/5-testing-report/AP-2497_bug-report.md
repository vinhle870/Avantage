# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2497: Add extended warranty to a quote: capture missing vehicle fields instead of a dead end
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2497 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-02 (local time, UTC+7), by the user's decision: 4 PASS, 11 FAIL, 0 BLOCKED.
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md · qa-artifacts/3-test-cases/AP2497_TestCases_001-005.md, AP2497_TestCases_006-010.md, AP2497_TestCases_011-015.md

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"). Staging was not tested in this run.

| Metric | Value |
|---|:---:|
| Total defects | 3 |
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 0 |
| Tracker tickets created | 3 (AP-2520, AP-2521, AP-2522 — status Backlog) |

**Decisions:**
- Gate C (by the reviewer — R3 round 2 APPROVE, `qa-artifacts/7-reviews/AP-2497_review.md`): all 11 FAILs are explained by three faults, and each fault is filed as a **new** bug — rule C4. Rule C1 (not a bug) does not hold: AP-2497 has 0 comments and the requirement capture contains no sentence saying a missing Vehicle type field, a collapsed form or a hidden field error is intended. Rules C2/C3: the reviewer's open-bug searches ("vehicle type warranty", "extended warranty vehicle form", "warranty modal collapsed", "Update vehicle error", "warranty vehicle edit", "eligible program vehicle", "field error hidden", "extended warranty", "quote_warranty_vehicle", "Vehicle type") found no bug about the add-extended-warranty modal's vehicle form; the nearest, AP-2510 (letters in "Warranty mileage limit" give HTTP 500), is a different field and a different failure. A fresh search at filing time (2026-11-01T22:50Z UTC: "extended warranty", "Vehicle type", "warranty modal", "Update vehicle") found nothing new.
- BUG-003 is kept separate from BUG-002 although both come from the same re-render: if the author keeps the collapsed layout and rejects BUG-002, BUG-003 still breaks the Validation criterion. BUG-003 is linked to BUG-002 as *relates to*.
- All three bugs are linked to AP-2497 as *relates to* and assigned to Ken Nguyen (`bug_new_assign`).

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2497_001, 003, 004, 006 (also part of 005, 007) | The vehicle form in the add-extended-warranty modal has no Vehicle type field | Medium | P2 | [AP-2520](https://garantieavantageplus.atlassian.net/browse/AP-2520) | Open |
| BUG-002 | AP2497_002, 005, 006, 007 (also seen in 001, 003) | The add-extended-warranty modal hides the vehicle form behind "Edit" on open and collapses it again after every "Update vehicle" | Medium | P2 | [AP-2521](https://garantieavantageplus.atlassian.net/browse/AP-2521) | Open |
| BUG-003 | AP2497_008, 009, 010, 011 (also reproduced in 012, 013, 014) | A refused "Update vehicle" shows no error: the field error is drawn inside the collapsed vehicle form | Medium | P2 | [AP-2522](https://garantieavantageplus.atlassian.net/browse/AP-2522) | Open |

---

## Bug Details

---

### BUG-001 — The vehicle form in the add-extended-warranty modal has no Vehicle type field

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2497_001 (step 4), AP2497_003 (steps 3 and 5), AP2497_004 (step 5), AP2497_006 (step 3); also part of the step-3 failure of AP2497_005 and AP2497_007, whose expected result names "the six fields" |
| **Requirement** | AP-2497 REQ-002 — "Form exposes only the required fields"; REQ-003 — "Form is prefilled from the existing vehicle" |
| **Severity** | Medium — the dealer can correct five of the six vehicle values in the modal, but not the vehicle type, which the eligibility check uses; a wrong vehicle type still sends the dealer back to the inventory to fix it, which is the round trip this story removes |
| **Priority** | P2 — fix in the current sprint; two acceptance criteria of AP-2497 name the field |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) |
| **Tracker Ticket** | [AP-2520](https://garantieavantageplus.atlassian.net/browse/AP-2520) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2497; 3 screenshots embedded in the description (verified: 3 media nodes with ids), filed 2026-11-01T22:53Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — 15 of 15 modals opened in this run, including the no-mileage vehicle 1097 (quote 6505) |

**Summary:**
In the add-extended-warranty modal on the quote page, the vehicle form has only five fields — Brand, Model, Year, Kilometers and Fuel type — and no Vehicle type field, so the vehicle type can be neither seen nor corrected there.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Type VIN `AP2497RP001000000` (do not click the VIN lookup button), choose Brand `Toyota`, then Model `Corolla` (the Model list reloads about 1.5 s after the Brand is chosen), Year `2022`, Vehicle Price `20000`, Kilometers `15000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` with unit `Litre`, Designation `Particular`, and click **Save**. The page `/vehicle/{id}/details` opens with "Toyota Corolla 2022". (Skip steps 2 and 3 by opening an existing Dev quote of this kind, for example `https://v2dev.garantieavantageplus.ca/quote/6496/details` — Toyota Corolla 2022, 15000 km.)
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={id}`). Fill First name `Warranty`, Last name `Repro`, Email an unused address such as `client.stage.999@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy", and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle already attached, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In the "Summary of products" card, click the **+** button on the "Extended warranty" row ("- None Selected -"). The add-extended-warranty modal opens on the same page.
5. In the modal's "Vehicle" section, click **Edit** (skip this if the fields are already shown) and look at the fields of the vehicle form.

**Expected Result:**
The form shows six editable fields, including Vehicle type, and Vehicle type shows the vehicle's stored type. The acceptance criterion "Form exposes only the required fields" says the form "contains only these required fields, each editable: Year, Kilometers, Make, Model, Fuel type, and Vehicle type". The criterion "Form is prefilled from the existing vehicle" says each of the six fields shows the stored value, including "Vehicle type from `Vehicle::$type`".

**Actual Result:**
The form shows five fields: Brand* = Toyota, Model* = Corolla, Year* = 2022, Kilometers* = 15000 and Fuel type* = GASOLINE, followed by the **Update vehicle** button. There is no Vehicle type field. The form in the page source is `quote_warranty_vehicle[...]` and holds only `make`, `model`, `year`, `kilometers` and `fuelType`. The five fields that exist are prefilled correctly (checked on vehicle 1084, Year 2021, 23456 km) and are saved correctly by "Update vehicle". The same five-field form appears for a vehicle with no mileage (vehicle 1097, quote 6505, made through `/quote/new/edit-vehicle`). The "no full vehicle editor" part of the criterion holds: no VIN, Price, Condition, Designation, Transmission, Engine size, Cylinders or similar field is shown.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_001-step4-FormFiveFieldsNoVehicleType_fail.png` — the form after Edit: Brand, Model, Year, Kilometers, Fuel type, no Vehicle type |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_003-step5-FiveControlsNoVehicleType_fail.png` — trial values typed in every field: five controls only |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_004-step5-PrefillFiveOfSixNoVehicleType_fail.png` — Year 2021 / 23456 km prefilled correctly; still no Vehicle type |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The form type behind `quote_warranty_vehicle` appears not to include the vehicle's `type` property.

**Notes:**
The criterion refers to "the properties in "Required fields" above", but the ticket has no section named "Required fields"; the six fields are listed by name in the criterion itself, and the prefill criterion names `Vehicle::$type` separately. The vehicle type of every test vehicle was PASSENGER (created through `/vehicle/new/edit/PASSENGER`). Test data left on Dev: vehicles 1082–1097, quotes 6490–6505.

---

### BUG-002 — The add-extended-warranty modal hides the vehicle form behind "Edit" on open and collapses it again after every "Update vehicle"

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2497_002 (step 3), AP2497_005 (step 3), AP2497_006 (step 3), AP2497_007 (step 3); also seen in AP2497_001 when the modal opens, and in AP2497_003 and AP2497_006 when changing Brand re-collapses the form |
| **Requirement** | AP-2497 REQ-001 — "The form is visible in the extended-warranty flow"; REQ-004 — "Submit persists and re-evaluates in place" |
| **Severity** | Medium — saving and re-checking eligibility work, and the fields are one click away behind "Edit", but the dealer does not see the form the criteria describe and loses it again after every submit and every Brand change |
| **Priority** | P2 — fix in the current sprint, or confirm the design on the ticket |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) |
| **Tracker Ticket** | [AP-2521](https://garantieavantageplus.atlassian.net/browse/AP-2521) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2497 and Relates → AP-2522; 4 screenshots embedded in the description (verified: 4 media nodes with ids), filed 2026-11-01T22:53Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always for a vehicle with every value stored — 14 of 14 such modals in this run; each "Update vehicle" submit and each Brand change re-collapsed the form |

**Summary:**
For a vehicle whose values are all stored, the add-extended-warranty modal opens with its vehicle form collapsed to a summary line and an "Edit" link, and after every "Update vehicle" submit (and every Brand change) the form collapses again, so the required-field form is not shown and does not stay visible with the saved values.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Type VIN `AP2497RP002000000` (do not click the VIN lookup button), choose Brand `Toyota`, then Model `Corolla` (the Model list reloads about 1.5 s after the Brand is chosen), Year `2022`, Vehicle Price `20000`, Kilometers `15000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` with unit `Litre`, Designation `Particular`, and click **Save**. The page `/vehicle/{id}/details` opens with "Toyota Corolla 2022". (Skip steps 2 and 3 by opening an existing Dev quote of this kind, for example `https://v2dev.garantieavantageplus.ca/quote/6496/details` — Toyota Corolla 2022, 15000 km.)
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={id}`). Fill First name `Warranty`, Last name `Repro`, Email an unused address such as `client.stage.998@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy", and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle already attached, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In the "Summary of products" card, click the **+** button on the "Extended warranty" row ("- None Selected -"). Look at the top of the modal.
5. Click **Edit** in the "Vehicle" section, change Kilometers to `25000`, and click **Update vehicle**. Look at the modal again.

**Expected Result:**
At step 4 the vehicle form is shown with its fields, and the program results are below it. The acceptance criterion "The form is visible in the extended-warranty flow" says: "Given a quote with a vehicle, When the dealer opens the add-extended-warranty flow, Then the required-field form is shown, and the eligible-program results or the "no program" notice render below it." At step 5 the form stays visible with the saved values. The criterion "Submit persists and re-evaluates in place" says the results refresh in the same modal and "the form remains visible with the saved values". The description adds that "the fields are always in reach".

**Actual Result:**
At step 4 the modal shows the heading "Vehicle", the summary line "Toyota Corolla 2022 · 15000 km · GASOLINE" and an **Edit** link; none of the fields is visible until Edit is clicked. The program list ("Program — Choose one of the available program.", 11 programs) is below. At step 5 "Update vehicle" sends `POST /quote/{id}/warranty/edit` (200, AJAX), the URL does not change, the modal stays open, the summary line becomes "Toyota Corolla 2022 · 25000 km · GASOLINE" and the program list is refreshed (9 programs) — but the form is **collapsed again**, with its fields hidden. The same happens when the values are submitted unchanged (quote 6496) and when Brand is changed (the form re-posts with `refresh=1` to reload the Model list, and collapses). The value is saved: after a reload the vehicle shows 25000 km.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_002-step3-ModalFormCollapsed_fail.png` — the modal as it opens: summary line and Edit, no fields |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_005-step3-AfterSubmitFormCollapsedResultsRefreshed_fail.png` — after "Update vehicle" with 25000: summary updated, results refreshed, form collapsed again |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_007-step3-AfterUnchangedSubmitFormCollapsed_fail.png` — after "Update vehicle" with unchanged values: form collapsed |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_obs-NoKmVehicleFormOpen_pass.png` — a vehicle with no mileage: the same modal opens with the form expanded |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The collapse looks deliberate: a vehicle with no mileage (vehicle 1097, quote 6505) opens with the form already expanded, Kilometers empty and Fuel type "Choose", above the notice "There are no eligible program for the vehicle. Please contact us for more information." So the form seems to expand only when a value is missing.

**Notes:**
This may be a design choice rather than a slip. The acceptance criteria quoted above say the form "is shown" and "remains visible with the saved values", and nothing on AP-2497 describes a collapsed form or an Edit link; the two ticket attachments show only the **+** button and the old dead end. **Please decide on AP-2497:** if the collapsed layout is intended, say so in a comment on AP-2497 and the QA will correct the test cases to expect it; otherwise keep the form expanded on open and after a submit. Test data left on Dev: vehicles 1082–1097, quotes 6490–6505.

---

### BUG-003 — A refused "Update vehicle" shows no error: the field error is drawn inside the collapsed vehicle form

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2497_008 (steps 3 and 4), AP2497_009 (step 4), AP2497_010 (steps 3 and 4), AP2497_011 (step 3); further reproductions in the record-only cases AP2497_012 (Year `2030`), AP2497_013 (Kilometers `1234567890123456` and `1500.5`) and AP2497_014 (empty Brand, empty Model) |
| **Requirement** | AP-2497 REQ-005 — "Validation" |
| **Severity** | Medium — nothing invalid is ever saved, but the dealer gets a silent refusal: the modal looks the same as before the submit, so the dealer may believe the correction was saved and choose a program for the old vehicle values; the message can be found only by clicking "Edit" |
| **Priority** | P2 — fix in the current sprint |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) |
| **Tracker Ticket** | [AP-2522](https://garantieavantageplus.atlassian.net/browse/AP-2522) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2497 and Relates → AP-2521; 5 screenshots embedded in the description (verified: 5 media nodes with ids), filed 2026-11-01T22:53Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — every refused submit in this run (empty, letters, negative, future year, too long, decimal, empty Brand/Model; 11 submits on 7 quotes) |

**Summary:**
When "Update vehicle" in the add-extended-warranty modal is submitted with an invalid Year or Kilometers, the server refuses it and saves nothing, but the modal re-renders with the vehicle form collapsed and the field-level error drawn inside that hidden form, so the dealer sees no error at all.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Type VIN `AP2497RP003000000` (do not click the VIN lookup button), choose Brand `Toyota`, then Model `Corolla` (the Model list reloads about 1.5 s after the Brand is chosen), Year `2022`, Vehicle Price `20000`, Kilometers `15000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` with unit `Litre`, Designation `Particular`, and click **Save**. The page `/vehicle/{id}/details` opens with "Toyota Corolla 2022". (Skip steps 2 and 3 by opening an existing Dev quote of this kind, for example `https://v2dev.garantieavantageplus.ca/quote/6497/details` — Toyota Corolla 2022, 15000 km.)
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={id}`). Fill First name `Warranty`, Last name `Repro`, Email an unused address such as `client.stage.997@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy", and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle already attached, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In the "Summary of products" card, click the **+** button on the "Extended warranty" row ("- None Selected -"). In the modal's "Vehicle" section click **Edit**.
5. Clear the **Year** field (leave it empty) and click **Update vehicle**. Look at the modal.
6. Click **Edit** again and look under Year.

**Expected Result:**
At step 5 an error is shown next to Year and nothing is saved. The acceptance criterion "Validation" says: "Given empty, non-numeric, or negative year/kilometers, When the form is submitted, Then a field-level error is shown and no partial update is persisted."

**Actual Result:**
At step 5 `POST /quote/{id}/warranty/edit` returns 200, the modal stays open and re-renders with the vehicle form collapsed. The summary line still reads "Toyota Corolla 2022 · 15000 km · GASOLINE" and the program list is unchanged. **No error is visible.** The error "This value should not be blank." is in the page under Year but hidden with the collapsed form; it appears only at step 6, after clicking Edit. Nothing is saved: after a reload Year is still 2022. The same happens with Kilometers `15k` ("Please enter a valid number of kilometers (0 or more)."), Year `-2020` ("Please enter a valid year."), Kilometers `-500`, an empty Kilometers, and Model `Camry` + Kilometers `30000` submitted with an empty Year (no partial save: Model stays Corolla, 15000 km). It also happens with Year `2030`, Kilometers `1234567890123456` ("This value is too long. It should have 15 characters or less."), Kilometers `1500.5`, and an empty Brand or Model ("This value should not be blank."). After a valid submit, a "Vehicle saved" alert is likewise rendered inside the collapsed vehicle section and stays hidden.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step3-EmptyYearSubmitted_fail.png` — right after submitting an empty Year: no error visible, summary unchanged |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_008-step3-YearErrorOnlyAfterEdit_fail.png` — the same modal after clicking Edit: "This value should not be blank." under Year |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_009-step4-KmErrorOnlyAfterEdit_fail.png` — after submitting Kilometers `15k` and clicking Edit: "Please enter a valid number of kilometers (0 or more)." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_010-step3-YearErrorOnlyAfterEdit_fail.png` — after submitting Year `-2020` and clicking Edit: "Please enter a valid year." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2497/AP2497_011-step3-YearErrorOnlyAfterEdit_fail.png` — Camry / 30000 / empty Year after Edit: the Year error; the summary still shows Corolla 15000 km |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The AJAX response that re-renders the modal collapses the vehicle form even when the form holds errors.

**Notes:**
The form has `novalidate`, so the browser does not block the submit; validation is server-side only. The Year field is a number input and refuses letters as they are typed, so "non-numeric" Year reaches the server as an empty value. This bug stays valid whatever is decided about the collapsed layout (filed separately as AP-2521): in either layout, an error must be visible after a refused submit. Test data left on Dev: vehicles 1082–1097, quotes 6490–6505.

---

## Defect Distribution

_How the bugs break down by how serious they are: three medium problems in the same modal, none of which loses data._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 3 | AP2497_001–011 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — The form is visible in the extended-warranty flow | 1 | BUG-002 |
| REQ-002 — Form exposes only the required fields | 1 | BUG-001 |
| REQ-003 — Form is prefilled from the existing vehicle | 1 | BUG-001 |
| REQ-004 — Submit persists and re-evaluates in place | 1 | BUG-002 |
| REQ-005 — Validation | 1 | BUG-003 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-01T22:57Z (UTC) — 2026-11-02 local

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2520 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-01T22:57Z |
| BUG-002 | AP-2521 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-01T22:57Z |
| BUG-003 | AP-2522 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-01T22:57Z |
| — (story) | AP-2497 | Story result comment 19452 posted (FAIL, 4/15, Tested on: Dev (v2dev)) and read back; status not changed — pass rate 27% (needs 90%) | QC (unchanged) | 2026-11-01T22:57Z |

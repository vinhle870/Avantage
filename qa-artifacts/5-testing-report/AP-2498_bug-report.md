# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2498: Roadside protection: keep the existing vehicle form visible and add VIN + Year
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2498 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-02 (local time, UTC+7), by the user's decision: 2 PASS, 10 FAIL, 2 BLOCKED.
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md · qa-artifacts/3-test-cases/AP2498_TestCases_001-005.md, AP2498_TestCases_006-010.md, AP2498_TestCases_011-014.md

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"). Staging was not tested in this run.

| Metric | Value |
|---|:---:|
| Total defects | 3 |
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 0 |
| Tracker tickets created | 3 (AP-2523, AP-2524, AP-2525 — status Backlog) |

**Decisions:**
- Gate C (by the independent reviewer — R3 round 1 APPROVE, `qa-artifacts/7-reviews/AP-2498_review.md`): the 10 FAILs reduce to three defects, and each is filed as a **new** bug — rule C3 → reviewer rule E2. Rule C1 (not a bug) does not hold: AP-2498 has only its 2026-10-23 hand-over comment, and the requirement capture contains no sentence saying the new notice text, a collapsed form or an optional VIN is intended. The open-bug search found AP-2508 ("Road side protection page has no vehicle, client, date or financing fields and no 'Generate Contract' button") on the same screen with a different behaviour, and AP-2521 (the add-extended-warranty modal hides the vehicle form behind "Edit") with the same collapse on a different screen. No candidate names this screen with the same wrong behaviour (no C2).
- Every bug is linked *relates to* AP-2498 and *relates to* AP-2508. BUG-002 is also linked *relates to* AP-2521. All three are assigned to Ken Nguyen (`bug_new_assign`).
- The two BLOCKED cases are not bugs: AP2498_004 was parked at Gate B (R2 round 3) and AP2498_014 is blocked by the existing bug AP-2508. They are reported in the test report, not here.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2498_001, AP2498_012 | The roadside-protection modal shows "No road side protection products are available for this vehicle." instead of the make-and-model notice the ticket names | Medium | P2 | [AP-2523](https://garantieavantageplus.atlassian.net/browse/AP-2523) | Open |
| BUG-002 | AP2498_002, 003, 009, 010, 011, 013 | When products are listed, the roadside-protection modal folds the vehicle form (VIN, Make, Model, Year, Continue) behind an "Edit" link | Medium | P2 | [AP-2524](https://garantieavantageplus.atlassian.net/browse/AP-2524) | Open |
| BUG-003 | AP2498_005, AP2498_006 | The VIN field of the roadside-protection form is not required: an empty-VIN Continue returns prices and saves the Make and Model | Medium | P2 | [AP-2525](https://garantieavantageplus.atlassian.net/browse/AP-2525) | Open |

---

## Bug Details

---

### BUG-001 — The roadside-protection modal shows "No road side protection products are available for this vehicle." instead of the make-and-model notice the ticket names

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2498_001 (step 4), AP2498_012 (step 3) |
| **Requirement** | AP-2498 REQ-001 — "The existing form is always visible in the RSP flow"; REQ-007 — "A VIN-only submit is accepted and saved" |
| **Severity** | Medium — the notice is in the right place below the form, but it tells the dealer only that nothing is available, not that a make and model are needed to get a quote, so the dealer has no hint how to get prices |
| **Priority** | P2 — fix in the current sprint; the description and one acceptance criterion quote the exact text |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) · footer "Avantage Plus System v2.0.0" |
| **Tracker Ticket** | [AP-2523](https://garantieavantageplus.atlassian.net/browse/AP-2523) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2498 and Relates → AP-2508; 2 screenshots embedded in the description (verified: 2 media nodes with ids), filed 2026-11-01T23:41Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — every opening of the modal with Make and Model empty in this run (13 quotes) showed the same text |

**Summary:**
When the add-roadside-protection modal on the quote page has no products to list (Make and Model empty), the red notice below the vehicle form reads "No road side protection products are available for this vehicle." instead of "In order to get a quote for road side protection, please specify the make and model of the vehicle."

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Type VIN `2T1BURHE3NC498901`, choose Make `Toyota`, then Model `Corolla`, Year `2022`, Kilometers `15000`, Price `20000`, Cylinders `4`, Engine size `2` (unit `Litre`), and keep the defaults Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Designation `Particular`. Click **Save**. The page `/vehicle/{id}/details` opens with "Toyota Corolla 2022". (Skip steps 2 and 3 by opening an existing Dev quote of this kind that has no roadside product yet, for example `https://v2dev.garantieavantageplus.ca/quote/6514/details`.)
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={id}`). Fill First name `Roadside`, Last name `Repro`, Email an unused address such as `client.stage.2498901@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy", and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle already attached, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In the "Summary of products" card, click the **+** button on the "Roadside Protection" row ("- None Selected -"). A modal opens on the same page.
5. Look at the text of the red notice below the **Continue** button.
6. Optional second path: in the same modal, keep the VIN, leave Year empty and Make and Model on "Choose", click **Continue**, and look at the notice again.

**Expected Result:**
Below the form the notice reads "In order to get a quote for road side protection, please specify the make and model of the vehicle." The ticket description says: "When no products are returned, the screen shows the existing message *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* below the form rather than a bare error." The acceptance criterion "A VIN-only submit is accepted and saved" says: "the quote runs with the VIN alone; if no products come back, the notice *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* appears below the form".

**Actual Result:**
The vehicle form is shown expanded (VIN = the vehicle's VIN, Year = 2022, Make = "Choose", Model = "Choose", Continue visible), and below Continue a red alert (`alert alert-danger`) reads "No road side protection products are available for this vehicle." No product tiers are listed. After the VIN-only Continue of step 6 the submit is accepted without error, the VIN is kept, and the same text "No road side protection products are available for this vehicle." is shown. The text "In order to get a quote for road side protection, please specify the make and model of the vehicle." never appeared in this run. The position of the notice (below the form) is correct; only its text is wrong.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_001-step4-FormAboveDifferentNotice_fail.png` — the modal on opening: form expanded, and below it the red notice with the different text |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_012-step3-VinOnlyAcceptedWrongNotice_fail.png` — after a Continue with only a VIN: the same different text |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The modal appears to use a new "no products" translation string instead of the existing make-and-model message.

**Notes:**
The ticket's own screenshot of the old screen (image-20261016-160938.png) shows the expected message, so the text existed before this change. Test data left on Dev: quotes 6514 (vehicle 1106) and 6524 (vehicle 1116).

---

### BUG-002 — When products are listed, the roadside-protection modal folds the vehicle form (VIN, Make, Model, Year, Continue) behind an "Edit" link

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2498_002 (step 5), AP2498_003 (step 5), AP2498_009 (step 3), AP2498_010 (step 3), AP2498_011 (step 4), AP2498_013 (step 4) |
| **Requirement** | AP-2498 REQ-001 — "The existing form is always visible in the RSP flow"; REQ-002 — "Form stays visible when make/model are already set"; REQ-008 — "Results update without hiding the form" |
| **Severity** | Medium — the values are saved and the prices refresh correctly, and the fields are one click away behind "Edit", but the dealer does not see the vehicle form the ticket is about whenever products are listed, which is the main point of this story |
| **Priority** | P2 — fix in the current sprint, or confirm the design on AP-2498 |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) · footer "Avantage Plus System v2.0.0" |
| **Tracker Ticket** | [AP-2524](https://garantieavantageplus.atlassian.net/browse/AP-2524) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2498, Relates → AP-2508 and Relates → AP-2521; 5 screenshots embedded in the description (verified: 5 media nodes with ids), filed 2026-11-01T23:41Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — every time products were listed in this run (9 quotes, on opening and after every Continue that returned products) |

**Summary:**
In the add-roadside-protection modal on the quote page, as soon as AutoShield products are listed (on opening a quote whose Make and Model are stored, and after every Continue that returns products), the vehicle form's VIN, Make, Model, Year and Continue are folded into a closed section behind an "Edit" link, and only a summary line such as "2022 Toyota Corolla · 2T1BURHE5NC498002" is shown above the product tiers.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Type VIN `2T1BURHE5NC498902`, choose Make `Toyota`, then Model `Corolla`, Year `2022`, Kilometers `15000`, Price `20000`, Cylinders `4`, Engine size `2` (unit `Litre`), and keep the defaults Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Designation `Particular`. Click **Save**. The page `/vehicle/{id}/details` opens with "Toyota Corolla 2022". (Skip steps 2 and 3 by opening an existing Dev quote of this kind that has no roadside product yet, for example `https://v2dev.garantieavantageplus.ca/quote/6520/details`.)
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={id}`). Fill First name `Roadside`, Last name `Repro`, Email an unused address such as `client.stage.2498902@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy", and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle already attached, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In the "Summary of products" card, click the **+** button on the "Roadside Protection" row ("- None Selected -"). A modal opens on the same page with the vehicle form expanded (VIN, Make "Choose", Model "Choose", Year 2022, Continue) and a red notice below it.
5. In the modal choose Make `Toyota`, wait about 1 second for the Model list to load, choose Model `Corolla`, and click **Continue**. Look at the top of the modal.
6. Close the modal and reload the quote page. The "Roadside Protection" row now shows "CA$0.00" and a "⋯" menu. Click **⋯ → Edit** to open the same modal again, and look at the top of it.

**Expected Result:**
After step 5 and at step 6 the vehicle form — VIN, Year, Make, Model and Continue — is shown above the product tiers, filled with the saved values. The ticket's title is "keep the existing vehicle form **visible**". The acceptance criterion heading is "The existing form is always visible in the RSP flow" (Then "the `QuoteAutoShieldMakeModelType` form is rendered, and the eligible-product results or the "no products" notice render below it"). The criterion "Form stays visible when make/model are already set" says "the form is still rendered with the stored values and the product list appears below it — the form does not disappear because make/model are complete". The criterion "Results update without hiding the form" says "the product list below the form updates accordingly and the form is still shown". The description adds "The dealer should never have to go back and forth."

**Actual Result:**
After step 5 the Continue is accepted in place (`POST /quote/{id}/road-side-protection` → 200, the URL stays `/quote/{id}/details`) and five product tiers are listed under "Product info", but the top of the modal shows only the heading "Vehicle", a summary line "2022 Toyota Corolla · 2T1BURHE5NC498902" and an **Edit** link. The VIN, Make, Model and Year fields and the Continue button are inside a closed collapse section (zero size, not visible) until **Edit** is clicked; then the form opens above the tiers with the saved values. At step 6 the modal opens in the same folded state with the stored values hidden. The same happened on a quote whose stored Make/Model differ from the vehicle's (Honda Accord on a Toyota vehicle), after a Continue with a different VIN and year, after completing an empty Make/Model, and after changing an already-priced vehicle to a 2003 Honda Accord — where the dealer even has to click Edit before being able to change anything. The form is expanded only while no products are listed.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_002-step5-FormCollapsedAboveTiers_fail.png` — after Continue with products listed: only the "Vehicle" summary line and Edit above the tiers |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_002-step5-FormAfterEditClick_fail.png` — the same modal after clicking Edit: the form opens above the tiers |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_003-step5-StoredHondaFormCollapsed_fail.png` — re-opened quote with Honda Accord stored: form folded, tiers below |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_011-step4-TiersInPlaceFormCollapsed_fail.png` — tiers replaced the notice in place, form folded |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_013-step4-SameTiersFormCollapsed_fail.png` — after changing to a 2003 Honda Accord: form folded again |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The likely shared cause is the same summary-plus-"Edit" collapse pattern reported on the add-extended-warranty modal in AP-2521 ("The add-extended-warranty modal hides the vehicle form behind 'Edit' on open and collapses it again after every 'Update vehicle'"): in both modals the vehicle form expands only while something is missing and folds as soon as the values are complete. A fix to the shared template or script would likely fix both.

**Notes:**
This may be a design choice rather than a slip, but nothing on AP-2498 describes a folded form or an Edit link, and the acceptance criteria quoted above say the form is always visible and "does not disappear because make/model are complete". **Please decide on AP-2498:** if the folded layout is intended, say so in a comment on AP-2498 and the QA will correct the test cases to expect it; otherwise keep the form expanded whenever products are listed. Test data left on Dev: quotes 6516, 6517, 6521, 6522, 6523 and 6525 (vehicles 1108, 1109, 1113, 1114, 1115, 1117).

---

### BUG-003 — The VIN field of the roadside-protection form is not required: an empty-VIN Continue returns prices and saves the Make and Model

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2498_005 (step 5), AP2498_006 (steps 3 and 5) |
| **Requirement** | AP-2498 REQ-003 — "The form is the existing form plus VIN and Year; VIN is the only required field" |
| **Severity** | Medium — a dealer can price and save a roadside-protection product with no VIN, so the program can later lack the VIN the ticket requires; the dealer can still type a VIN, so a workaround exists |
| **Priority** | P2 — fix in the current sprint; the acceptance criterion states it word for word |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) · footer "Avantage Plus System v2.0.0" |
| **Tracker Ticket** | [AP-2525](https://garantieavantageplus.atlassian.net/browse/AP-2525) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2498 and Relates → AP-2508; 3 screenshots embedded in the description (verified: 3 media nodes with ids), filed 2026-11-01T23:41Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — the VIN field had no `required` attribute in every modal of this run, and the one empty-VIN Continue tried was accepted |

**Summary:**
The VIN input of the add-roadside-protection form has no `required` constraint, and clicking Continue with the VIN cleared is accepted without any message: the modal lists AutoShield prices and the chosen Make and Model are saved on the quote's roadside-protection program.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Type VIN `2T1BURHE2NC498903`, choose Make `Toyota`, then Model `Corolla`, Year `2022`, Kilometers `15000`, Price `20000`, Cylinders `4`, Engine size `2` (unit `Litre`), and keep the defaults Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Designation `Particular`. Click **Save**. The page `/vehicle/{id}/details` opens with "Toyota Corolla 2022". (Skip steps 2 and 3 by opening an existing Dev quote of this kind that has no roadside product yet, for example `https://v2dev.garantieavantageplus.ca/quote/6515/details`.)
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={id}`). Fill First name `Roadside`, Last name `Repro`, Email an unused address such as `client.stage.2498903@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy", and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle already attached, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In the "Summary of products" card, click the **+** button on the "Roadside Protection" row ("- None Selected -"). A modal opens on the same page with the vehicle form (VIN, Make, Model, Year, Continue). Inspect the VIN input (browser developer tools): it has no `required` attribute, and no label carries an asterisk.
5. Clear the **VIN** field so it is empty, keep Year `2022`, choose Make `Honda`, wait about 1 second for the Model list to load, choose Model `Accord`, and click **Continue**.
6. Close the modal and reload the quote page. Click **⋯ → Edit** on the "Roadside Protection" row (it now shows "CA$0.00") and read the form.

**Expected Result:**
At step 4 the VIN input is required. At step 5 the Continue is refused, the dealer is told the VIN is missing, and nothing is saved, so at step 6 Make and Model are not Honda / Accord. The acceptance criterion "The form is the existing form plus VIN and Year; VIN is the only required field" says: "Then the VIN input is required and Year/Make/Model carry no `required` constraint". The description asks for "a required **VIN** and an optional **Year**".

**Actual Result:**
At step 4 the VIN input has no `required` attribute (its `required` property is false), the same as Year, Make and Model. At step 5 the browser shows no message (the VIN's validation message is empty and the field is valid), the server shows no field error or alert, and the modal re-renders with five AutoShield product tiers and prices; the summary line has no VIN. At step 6 the "Roadside Protection" row has been created ("CA$0.00" with a ⋯ menu), and the re-opened form shows Make = "Honda" and Model = "Accord" saved by the empty-VIN submit (the VIN shows the vehicle's own VIN again). The rest of the criterion holds: Year, Make and Model carry no `required` constraint, and there is no VIN lookup button and no `vinlookup` behaviour on the VIN field.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_005-step5-VinNotRequiredNoLookup_fail.png` — the form: no asterisk on VIN, no lookup button (the missing `required` attribute was read from the page source) |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_006-step3-EmptyVinSubmitAccepted_fail.png` — after Continue with an empty VIN: product tiers listed, no error |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2498/AP2498_006-step5-HondaSavedFromEmptyVinSubmit_fail.png` — re-opened: "2022 Honda Accord" stored by the empty-VIN submit |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The VIN field added to the make/model form type appears to have no `required` option and no NotBlank constraint on the server.

**Notes:**
How the refusal should look (browser bubble or server field error) is not stated on the ticket; this bug asks only that the submit is refused and saves nothing, which "required" itself states. Test data left on Dev: quotes 6515 (vehicle 1107) and 6518 (vehicle 1110; holds the Honda Accord row from the empty-VIN submit).

---

## Defect Distribution

_How the bugs break down by how serious they are: three medium problems in the same roadside-protection modal, none of which loses data or blocks a sale._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 3 | AP2498_001, 002, 003, 005, 006, 009, 010, 011, 012, 013 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Form always visible, results below | 2 | BUG-001, BUG-002 |
| REQ-002 — Form stays when make/model stored | 1 | BUG-002 |
| REQ-003 — Existing fields + VIN + Year; only VIN required | 1 | BUG-003 |
| REQ-007 — VIN-only submit accepted | 1 | BUG-001 |
| REQ-008 — Results update, form stays | 1 | BUG-002 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-01T23:51Z (UTC) — 2026-11-02 local

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2523 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-01T23:51Z |
| BUG-002 | AP-2524 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-01T23:51Z |
| BUG-003 | AP-2525 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-01T23:51Z |
| — (story) | AP-2498 | Story result comment 19453 posted (FAIL, 2/14, Tested on: Dev (v2dev); park reason of AP2498_004 and the uncovered REQ-008 "no longer qualify" included) and read back; status not changed — pass rate 14% (needs 90%) | QC (unchanged) | 2026-11-01T23:51Z |

# Automation Report — AP-2497
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/warrantyVehicleForm_AP2497.spec.ts · Tag: @AP-2497
Result: 4 of 4 PASSED cases automated — 4 passing, 0 fixme

## Summary
The four AP-2497 cases that passed manually on Dev (v2dev) now run automatically: the three record-only validation cases (future year and zero kilometres, 16-digit and decimal kilometres, empty Brand or Model) and the check that the program list below the form comes from the new eligibility response after a mileage change. The eleven cases that failed (AP2497_001–011) are not automated, because their expected behaviour is not confirmed until AP-2520, AP-2521 and AP-2522 are fixed or decided. The suite runs only when the dealer portal URL points at v2dev, the only environment AP-2497 was tested on.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2497_001 | Adding an extended warranty for a vehicle with no mileage shows the vehicle form | not selected | FAIL manually — AP-2520, AP-2521 |
| AP2497_002 | Complete vehicle shows the form with program results below it | not selected | FAIL manually — AP-2521 |
| AP2497_003 | Form holds only the six fields, all editable | not selected | FAIL manually — AP-2520 |
| AP2497_004 | Each of the six fields is prefilled from the stored vehicle | not selected | FAIL manually — AP-2520 |
| AP2497_005 | Filling the mileage and submitting saves it and refreshes the results in place | not selected | FAIL manually — AP-2520, AP-2521 |
| AP2497_006 | Correcting all six values saves every one of them | not selected | FAIL manually — AP-2520, AP-2521 |
| AP2497_007 | Submitting unchanged values keeps the vehicle as it was | not selected | FAIL manually — AP-2520, AP-2521 |
| AP2497_008 | Empty Year / empty Kilometers shows a field error and saves nothing | not selected | FAIL manually — AP-2522 |
| AP2497_009 | Letters in Year / Kilometers shows a field error and saves nothing | not selected | FAIL manually — AP-2522 |
| AP2497_010 | Negative Year / Kilometers shows a field error and saves nothing | not selected | FAIL manually — AP-2522 |
| AP2497_011 | A valid Model change with an invalid Year is not saved either | not selected | FAIL manually — AP-2522 |
| AP2497_012 | Future Year and zero Kilometers handled without a server error | automated — passing | — |
| AP2497_013 | 16-digit or decimal Kilometers handled, never stored altered | automated — passing | — |
| AP2497_014 | Empty Make or Model handled, never stores a value nobody entered | automated — passing | — |
| AP2497_015 | After fixing the mileage, results come from a new eligibility check | automated — passing | — |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() (fixture `dealerUser`) | reused |
| AP2497_012–015 | 1 `[Pre-Condition]` create vehicle V1 | WarrantyVehicleFormFlow.createVehicle() → VehicleAddFormPage.open()/save(), VehicleInventoryPage field locators, selectDropdownOption() | new (flow method), reused (page objects) |
| AP2497_012–015 | 2 `[Pre-Condition]` create quote from the vehicle | WarrantyVehicleFormFlow.createQuote() → QuoteCancelProductFlow.createQuoteFromVehicle() | reused |
| AP2497_012–015 | open the modal ("+" on Extended warranty) | WarrantyVehicleFormFlow.openWarrantyModal() → QuoteProductSummaryPage.clickRowAdd('warranty') | new (flow), reused (page object) |
| AP2497_012 | 3 Year `2030`, submit, reload, record | submitVehicle({year}), verifyFieldError('year', "Please enter a valid year."), reloadAndReopen(), verifyStoredOneOf('year', ['2030','2022'], '2022') | new |
| AP2497_012 | 4 Kilometers `0`, submit, reload, record | submitVehicle({kilometers:'0'}), verifyNoFieldError('kilometers'), verifySummaryShowsKm('0'), reloadAndReopen(), verifyStoredOneOf('kilometers', ['0','15000'], '0') | new |
| AP2497_012 | 5 `[Verification]` Year 2030/2022, Kilometers 0/15000, never anything else | the two verifyStoredOneOf() calls | new |
| AP2497_013 | 3 Kilometers `1234567890123456` | submitVehicle(), verifyFieldError('kilometers', "This value is too long. …"), reloadAndReopen(), verifyStoredOneOf(['1234567890123456','15000'], '15000') | new |
| AP2497_013 | 4 Kilometers `1500.5` | submitVehicle(), verifyFieldError('kilometers', "Please enter a valid number of kilometers (0 or more)."), reloadAndReopen() | new |
| AP2497_013 | 5 `[Verification]` never stored altered | verifyStoredOneOf('kilometers', ['1500.5','1500','1501','15000'], '15000') | new |
| AP2497_014 | 3 Brand "Choose", submit, reload | submitVehicle({make:'Choose'}) (waits for the refresh=1 re-render), verifyMakeAndModelBlankErrors(), reloadAndReopen(), verifyValues(Toyota/Corolla/2022/15000) | new |
| AP2497_014 | 4 Model "Choose", submit, reload | submitVehicle({model:'Choose'}), verifyFieldError('model', "This value should not be blank."), reloadAndReopen() | new |
| AP2497_014 | 5 `[Verification]` Toyota / Corolla kept | verifyValues({make:'Toyota', model:'Corolla', …}) | new |
| AP2497_015 | 3 record the results | readProgramIds() | new |
| AP2497_015 | 4 type 25000, submit; URL unchanged, modal open | submitVehicle({kilometers:'25000'}) — POST status < 400, URL /quote/{id}/details, one open modal | new |
| AP2497_015 | 5 `[Verification]` a request after the submit returned 2xx and its programs match the results shown | verifyResultsFromNewCheck(response, before) — program anchors in the POST body equal those shown; summary "25000 km" | new |

## New locators
All in the open modal `#myModal.show`, verified on v2dev 2026-11-01 on quote 6503 with a match count of exactly 1 each.

| Name | Expression | Page | Count |
|---|---|---|---|
| mdlOpen | `#myModal.show` | /quote/{id}/details, warranty modal | 1 |
| frmVehicle | `#myModal.show form[name="quote_warranty_vehicle"]` | same | 1 |
| lblSummary | `… form[name="quote_warranty_vehicle"] h4 + div` | same | 1 |
| btnEdit | `#myModal.show button[data-target="#warrantyVehicleForm"]` | same | 1 |
| pnlFields | `#myModal.show #warrantyVehicleForm` | same | 1 |
| dpdMake | `#myModal.show .form-group:has(> label[for="quote_warranty_vehicle_make"]) > .bootstrap-select` | same | 1 |
| dpdModel | `#myModal.show .form-group:has(> label[for="quote_warranty_vehicle_model"]) > .bootstrap-select` | same | 1 |
| selMake / selModel / selFuelType | `#myModal.show #quote_warranty_vehicle_make` / `_model` / `_fuelType` | same | 1 each |
| txtYear / txtKilometers | `#myModal.show #quote_warranty_vehicle_year` / `_kilometers` | same | 1 each |
| btnUpdateVehicle | `… form[name="quote_warranty_vehicle"] button[type="submit"]` | same | 1 |
| fieldError(year) | `#myModal.show label[for="quote_warranty_vehicle_year"] .form-error-message` (after a refused submit) | same | 1 |
| frmProgram | `#myModal.show form[name="quote_warranty"]` | same | 1 |
| lnkPrograms | `… form[name="quote_warranty"] h5 > a` (one per program; 11 on a Corolla 2022 at 15000 km) | same | 11 (list) |

## Files changed
| File | Change |
|---|---|
| src/pages/dealerPortal/WarrantyVehicleFormModal.ts | **new** — page object for the vehicle section of the add-extended-warranty modal (locators above, expandFields(), fill/choose actions, selectedText(), programIds()) |
| src/flows/WarrantyVehicleFormFlow.ts | **new** — createVehicle(), createQuote(), openWarrantyModal(), reloadAndReopen(), submitVehicle(), readProgramIds() and the verify… steps |
| src/tests/dealer/warrantyVehicleForm_AP2497.spec.ts | **new** — 4 tests tagged `@dealer @AP-2497`, skipped unless the dealer portal URL is v2dev |

No existing file was changed. The QA's uncommitted files (AdminFlow.ts, DealerFlow.ts, index.ts, test-fixtures.ts and the rest) were only imported from, never edited. The page object is not exported from `src/pages/dealerPortal/index.ts` (uncommitted QA file); the flow imports it by path.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2497`
Lint: pass (`npm run lint` = `tsc --noEmit`, 0 errors) · Run: 4 passed, 0 fixme, 2.1 min — run twice, back to back between 2026-11-01T23:01Z and 23:07Z UTC, 4/4 passed both times, one worker

**Data created on Dev (v2dev) by the two runs** (8 inventory vehicles, 8 clients, 8 quotes — dealers cannot delete quotes):

| Run | TC | Vehicle (VIN) | Quote | Left on the vehicle |
|---|---|---|---|---|
| 1 | AP2497_012 | 1098 (AP2497A3574134311) | 6506 | Kilometers 0 |
| 1 | AP2497_013 | 1099 (AP2497A3574165888) | 6507 | unchanged, 15000 |
| 1 | AP2497_014 | 1100 (AP2497A3574194974) | 6508 | unchanged, 15000 |
| 1 | AP2497_015 | 1101 (AP2497A3574230786) | 6509 | Kilometers 25000 |
| 2 | AP2497_012 | 1102 (AP2497A3574269556) | 6510 | Kilometers 0 |
| 2 | AP2497_013 | 1103 (AP2497A3574300255) | 6511 | unchanged, 15000 |
| 2 | AP2497_014 | 1104 (AP2497A3574331853) | 6512 | unchanged, 15000 |
| 2 | AP2497_015 | 1105 (AP2497A3574368578) | 6513 | Kilometers 25000 |

Clients are `qa.ap2497.<tc>.<stamp>@yopmail.com` (last name `Auto2497-<tc>-<stamp>`). Every future run adds 4 vehicles, 4 clients and 4 quotes. Locator discovery also submitted one refused "Update vehicle" (empty Year) on the existing quote 6503; nothing was saved (vehicle 1095 still Toyota Corolla 2022, 15000 km).

Run 2 recorded (AP2497_015): 11 programs before the submit → 9 after (Test Program and Automation Test Program drop out), the same change the manual run saw.

## Reviewer R5
gate_mode is `reviewer`; this automator ran inside a worker subagent, so R5 ran inline. Verdict **APPROVE**, 0 blocker · 0 major · 1 minor — see `qa-artifacts/7-reviews/AP-2497_review.md`. The minor finding: the "run twice" check was met with two separate full runs instead of `--repeat-each=2`, to avoid creating 8 more vehicles and quotes on Dev.

## Pull request
PR skipped: gh CLI not installed (run with `--no-pr`).

## Not passing
None.

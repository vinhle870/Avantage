# Automation Report — AP-2477
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-01.md
Spec: playwright-automation/src/tests/dealer/minimalQuoteVehicleForm_AP2477.spec.ts · Tag: @AP-2477
Result: 9 of 9 PASSED cases automated — 9 passing, 0 fixme

**Tested on: Dev (v2dev).** The spec runs only when `DEALER_PORTAL_URL` points at v2dev and is skipped otherwise. AP-2477 is not on staging ("the feature is not ready for staging yet", AP-2477 comment of 2026-10-28). Every run was made against dev only.

## Summary
All nine test cases that passed manually now run automatically. They cover the five-field "Create a quote" form, its required markers, saving with only Brand, Model and Year, the empty values stored on the vehicle, the refusals for a missing Brand or Year, the "Décoder" button per vehicle type, the unchanged inventory form, and the quote details and warranty step of a minimal quote. The three decoder cases (AP2477_007 FAIL, AP2477_008 and AP2477_009 BLOCKED) are not automated, because no behaviour has been confirmed for them yet. No test clicks "Décoder", because on dev that click saves a quote (AP-2507). Each run of the spec leaves 3 quotes on dev (from AP2477_003, 004 and 012), each with a Toyota Corolla 2020 vehicle. Dealers cannot delete quotes.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2477_001 | The new-quote vehicle form shows only Quote name, VIN, Brand, Model and Year, in that order | automated — passing | — |
| AP2477_002 | Only Brand, Model and Year carry the required marker; Quote name and VIN do not | automated — passing | — |
| AP2477_003 | Saving with only Brand, Model and Year creates the quote and opens its details page | automated — passing | Leaves 1 quote per run |
| AP2477_004 | A vehicle saved from the minimal form has no kilometres, condition, designation or price | automated — passing | Leaves 1 quote per run; the vehicle edit form is only read, never saved |
| AP2477_005 | Saving without a Brand is refused with an error and no quote is created | automated — passing | — |
| AP2477_006 | Saving with Brand and Model but no Year is refused with an error and no quote is created | automated — passing | — |
| AP2477_007 | Clicking "Décoder" with a valid VIN fills Brand, Model and Year | not selected | FAIL manually (AP-2507). Automating it would also create a quote on every run |
| AP2477_008 | A quote saved after decoding keeps the decoded transmission, engine, fuel, cylinders and turbo | not selected | BLOCKED by AP2477_007 |
| AP2477_009 | A Quote name typed before "Décoder" is kept and saved with the quote | not selected | BLOCKED by AP2477_007 |
| AP2477_010 | The "Décoder" button shows for a car type but not for an RV, boat or construction type | automated — passing | Checks that the button is present only; it is never clicked |
| AP2477_011 | The inventory "add vehicle" form still shows Price and Kilometers and refuses to save without them | automated — passing | Saves nothing (refused by the server) |
| AP2477_012 | A quote created from the minimal form opens its details and warranty step without an error page | automated — passing | Leaves 1 quote per run; "Update vehicle" is never clicked |

## Step map
`QVF` = `QuoteVehicleFormFlow` (new). `dealerUser` = `DealerFlow` (reused, unchanged).

| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | dealerUser.loginToDealerPortal() | reused |
| AP2477_001 | 1–2 | QVF.openCreateAQuote() → DealerLeftMenu.goToQuotesPage(), DealerQuotesPage.openNewQuotePage() | new flow, reused page objects |
| AP2477_001 | 3 | QVF.verifyOnlyFiveFieldsInOrder() | new |
| AP2477_002 | 1 | QVF.openCreateAQuote() | new |
| AP2477_002 | 2 | QVF.verifyOnlyBrandModelYearRequired() | new |
| AP2477_003 | 1 | QVF.readNewestQuoteId() | new |
| AP2477_003 | 2 | QVF.openCreateAQuote(), QVF.fillMinimalForm(), QVF.saveAndVerifyQuoteCreated() | new |
| AP2477_003 | 3 | QVF.saveAndVerifyQuoteCreated() (URL, banner, heading, vehicle), QVF.verifyNewestQuote() | new |
| AP2477_004 | 1 | QVF.openCreateAQuote(), QVF.fillMinimalForm(), QVF.saveAndVerifyQuoteCreated() | new |
| AP2477_004 | 2–3 | QVF.verifyVehicleStoredEmpty() — vehicle details and edit form, read only | new |
| AP2477_005 | 1 | QVF.readNewestQuoteId() | new |
| AP2477_005 | 2 | QVF.fillMinimalForm({ year }), QVF.saveAndVerifyRefused(['vehicle_make', 'vehicle_model']) | new |
| AP2477_005 | 3 | QVF.verifyNoQuoteCreated() | new |
| AP2477_006 | 1–3 | as AP2477_005, with Brand + Model and the error at `vehicle_year` (Brand and Model kept) | new |
| AP2477_010 | 1–3 | QVF.openCreateAQuote(), QVF.verifyDecoderShownForPassenger() | new |
| AP2477_010 | 4 | QVF.chooseVehicleType('RV_CLASS_A', 'RV CLASS A') | new |
| AP2477_010 | 5 | QVF.verifyNoDecoderAndFiveFields() | new |
| AP2477_011 | 1 | QVF.readNewestInventoryVehicleId() → VehicleInventoryPage.getNewestVehicleId(); QVF.openInventoryAddForm('PASSENGER') | new flow, reused page object |
| AP2477_011 | 2 | QVF.verifyInventoryFormKeepsPriceAndKilometers() — VehicleInventoryPage.txtVehiclePrice / txtVehicleKM | new flow, reused locators |
| AP2477_011 | 3 | QVF.fillInventoryFormWithoutPriceAndKm() — VehicleInventoryPage fields; QVF.saveInventoryFormAndVerifyRefused() | new flow, reused locators |
| AP2477_011 | 4 | QVF.verifyNoInventoryVehicleAdded() | new |
| AP2477_012 | 1 | QVF.openCreateAQuote(), QVF.fillMinimalForm(), QVF.saveAndVerifyQuoteCreated() | new |
| AP2477_012 | 2 | QVF.verifyQuoteDetailsLoad() — first load and reload | new |
| AP2477_012 | 3–4 | QVF.openWarrantyStepAndVerifyItAsksForMissingValues() | new |

## New locators
All were confirmed on Dev (v2dev) on 2026-11-01 by a temporary read-only probe spec, which was deleted afterwards. Count is the number of matches at the moment of use.

| Name | Expression | Page | Count |
|---|---|---|---|
| DealerQuoteVehicleFormPage.lblHeading | `main h1` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.btnVehicleType | `#dropdownMenuLink1` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.frmQuoteVehicle | `form[name="quote_vehicle"]` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.txtQuoteName | `#quote_vehicle_quote_name` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.txtVin | `#quote_vehicle_VIN` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.btnDecoder | `form[name="quote_vehicle"] button[data-action="vinLookup"]` | /quote/new/edit-vehicle (Passenger); 0 on RV_CLASS_A by design | 1 |
| DealerQuoteVehicleFormPage.selMake / selModel | `#vehicle_make` / `#vehicle_model` | /quote/new/edit-vehicle | 1 / 1 |
| DealerQuoteVehicleFormPage.dpdMake / dpdModel | `//form[@name='quote_vehicle']//div[*[@for='vehicle_make']]/div` (and `vehicle_model`) | /quote/new/edit-vehicle | 1 / 1 |
| DealerQuoteVehicleFormPage.txtYear | `#vehicle_year` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.btnSave | `form[name="quote_vehicle"] [type="submit"]` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.vehicleTypeLink('RV_CLASS_A') | `a.dropdown-item[href="/quote/new/edit-vehicle/RV_CLASS_A"]` | /quote/new/edit-vehicle | 1 |
| DealerQuoteVehicleFormPage.fieldError(id) | `form[name="quote_vehicle"] .form-group:has(> label[for="<id>"]) .form-error-message` | /quote/new/edit-vehicle after a refused save | 1 per field |
| DealerQuoteVehicleFormPage.txtPriceInForm / txtKilometersInForm | `form[name="quote_vehicle"] [name$="[price]"]` / `[name$="[kilometers]"]` | /quote/new/edit-vehicle | 0 (asserted absent) |
| DealerQuoteRecordPage.cellQuoteRows | `main td[data-href^="/quote/"]` (used with `.first()`) | /quotes | 40 cells; first = newest quote |
| DealerQuoteRecordPage.lblHeading | `main h1` | /quote/{id}/details | 1 |
| DealerQuoteRecordPage.lblAlert | `main [role="alert"]` (used with `.first()`) | /quote/{id}/details | 1 after a save |
| DealerQuoteRecordPage.lnkVehicleDetails | `main a[href^="/vehicle/"][href$="/details"]` | /quote/{id}/details | 1 |
| DealerQuoteRecordPage.btnAddWarranty | `main tr` with "Extended warranty" → `a[href$="/warranty/edit"]` | /quote/{id}/details | 1 |
| DealerQuoteRecordPage.frmWarrantyVehicle | `#myModal.show form[name="quote_warranty_vehicle"]` | warranty modal | 1 |
| DealerQuoteRecordPage.txtWarrantyKilometers | `#myModal.show #quote_warranty_vehicle_kilometers` | warranty modal | 1 |
| DealerQuoteRecordPage.selWarrantyFuelType | `#myModal.show #quote_warranty_vehicle_fuelType` | warranty modal | 1 |
| DealerQuoteRecordPage.btnUpdateVehicle | role button "Update vehicle" in `#myModal.show` | warranty modal | 1 |
| DealerQuoteRecordPage.lblNoEligibleProgram | `#myModal.show [role="alert"]` with "There are no eligible program" | warranty modal | 1 |
| DealerQuoteRecordPage.lblVehicleDetails | `main .card-body p` (first) | /vehicle/{id}/details | 1 |
| DealerQuoteRecordPage.txtVehiclePrice / txtVehicleKilometers | `#vehicle_price` / `#vehicle_kilometers` | /vehicle/{id}/edit | 1 / 1 |
| DealerQuoteRecordPage.optVehicleConditionSelected | `#vehicle_condition option[selected]` | /vehicle/{id}/edit | 0 for a minimal-form vehicle (asserted) |
| VehicleAddFormPage.lblHeading | `main h1` | /vehicle/new/edit/PASSENGER | 1 |
| VehicleAddFormPage.frmVehicle | `form[name="vehicle"]` | /vehicle/new/edit/PASSENGER | 1 |
| VehicleAddFormPage.btnSave | `form[name="vehicle"] [type="submit"]` | /vehicle/new/edit/PASSENGER | 1 |
| VehicleAddFormPage.fieldError(id) | `form[name="vehicle"] .form-group:has(> label[for="<id>"]) .form-error-message` | /vehicle/new/edit/PASSENGER after a refused save | 1 per field |

## Files changed
Only new files were added. No file the QA had already changed was touched: `DealerFlow.ts`, `DealerNewQuotePage.ts`, `VehicleInventoryPage.ts`, `index.ts`, `test-fixtures.ts`, `uiActions.ts` and the others are unchanged. `AdminEarningCurvePage.ts` and `EarningCurveFlow.ts` are not relevant to this ticket and were not touched. The new page objects are imported by path, because `src/pages/dealerPortal/index.ts` belongs to the QA.

| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/DealerQuoteVehicleFormPage.ts | new — the minimal `quote_vehicle` form: locators, `chooseVehicleType()`, `fillQuoteName()`, `chooseBrand()`, `chooseModel()`, `fillYear()`, `save()`, label and control readers |
| playwright-automation/src/pages/dealerPortal/DealerQuoteRecordPage.ts | new — read-only views: /quotes rows, quote details, warranty modal, vehicle details and edit form |
| playwright-automation/src/pages/dealerPortal/VehicleAddFormPage.ts | new — form-scoped locators of the inventory "Add a vehicle" form |
| playwright-automation/src/flows/QuoteVehicleFormFlow.ts | new — 20 business steps in `test.step()` with every assertion; records each quote it leaves as a `test-data-left` annotation |
| playwright-automation/src/tests/dealer/minimalQuoteVehicleForm_AP2477.spec.ts | new — 9 tests, `describe('Minimal New-Quote Vehicle Form @dealer @AP-2477')`, skipped unless the dealer portal URL is v2dev |

The temporary probe `src/tests/dealer/zz_probe_AP2477.spec.ts` was created and deleted in this run. The Playwright output folders `test-results/` and `playwright-report/` were regenerated by the runs.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2477`
Lint: pass (`npm run lint`, `tsc --noEmit`, 0 errors) · Run: 9 passed, 0 fixme, 1.7 min (final full run, before 15:25 UTC)

History, one fix round:
- Run 1 (6 tests that create no quote): 6 passed.
- Run 1 (003, 004, 012): 3 failed on the quote-heading assertion, because the `h1` text carries leading line breaks and spaces. The regular expression was anchored without allowing them, so it was fixed to allow surrounding whitespace.
- A re-run of 012 used the unfixed code, because an edit had not applied, and failed the same way.
- Round 2 (003, 004, 012): 3 passed.
- Final full run: 9 passed.

**Test data left on Dev (v2dev) by these runs** (dealers cannot delete quotes; each quote has its own Toyota Corolla 2020 vehicle, which also appears in Vehicle Inventory):

| Quote | Created by |
|---|---|
| 6441 | AP2477_003 run 1 (failed at the heading check, after saving) |
| 6442 | AP2477_004 run 1 (failed after saving) |
| 6443 | AP2477_012 run 1 (failed after saving; inferred from the id sequence, between 6442 and 6444) |
| 6444 | AP2477_012 re-run with the unfixed code (failed after saving) |
| 6445, 6446, 6447 | Round 2: AP2477_003, 004, 012 (passed) |
| 6448, 6449, 6450 | Final full run: AP2477_003, 004, 012 (passed) |

## Pull request
PR skipped: gh CLI not installed (the `vcs` preflight failed). The run was also started with `--no-pr`. Nothing was committed, pushed or merged.

## Not passing
None.

## Review (R5)
APPROVE — 0 blocker · 0 major · 2 minor. See `qa-artifacts/7-reviews/AP-2477_review.md`, section R5.

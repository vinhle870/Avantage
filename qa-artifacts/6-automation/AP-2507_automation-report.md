# Automation Report — AP-2507
Date: 2026-11-07 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2507_2026-11-07.md
Spec: playwright-automation/src/tests/dealer/quoteVinDecoder_AP2507.spec.ts · Tag: @AP-2507
Result: 3 of 3 PASSED cases automated — 3 passing, 0 fixme

## Summary
All three re-test cases of the "Décoder" bug are now automated and pass on Dev (v2dev). The
suite first reads the page's own `/build/` scripts to confirm the AP-2533 fix is deployed (the
novalidate key is built from the form name, and no hardcoded `vehicle[novalidate]` remains),
then checks that a decode re-renders the form with Ford / Focus / 2008 and saves nothing, that a
quote saved after the decode gets a new Ford Focus 2008 vehicle with the VIN, and that a quote
name typed before the decode survives it. Nothing was left out. The suite skips itself on any
environment other than v2dev.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2507_001 | Clicking "Décoder" with a valid VIN re-renders the form with Ford, Focus and 2008 and saves no quote | automated — passing | — |
| AP2507_002 | A quote saved by the dealer after decoding keeps the decoded vehicle details on its vehicle | automated — passing | Step 4 (fuel, transmission, engine, turbo) is record-only, written as an annotation, never asserted — as in the manual case |
| AP2507_003 | A quote name typed before clicking "Décoder" survives the decode and is saved with the quote | automated — passing | — |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2507_001 | 1 (login) | DealerFlow.loginToDealerPortal() | reused |
| AP2507_001 | 1 (baseline id) | QuoteVinDecoderFlow.readBaselineQuoteId() → DealerQuoteRecordPage.openQuotesList(), quoteRows() | new (flow + quoteRows) |
| AP2507_001 | 1 (open form) | QuoteVinDecoderFlow.openCreateAQuote() → DealerLeftMenu.goToQuotesPage(), DealerQuotesPage.openNewQuotePage(), DealerQuoteVehicleFormPage.vehicleTypeShown() | new (flow) — the AP-2477 openCreateAQuote() still expects the removed top-right type button, so it was not reused or changed |
| AP2507_001 | 1 (build check) | QuoteVinDecoderFlow.verifyDecoderFixInBuild() → DealerQuoteVehicleFormPage.buildScriptSources() + page.request.get (read-only) | new |
| AP2507_001 | 2 | QuoteVinDecoderFlow.decodeVin() → DealerQuoteVehicleFormPage.fillVin(), decode() (waits for the AJAX post; asserts 200; records the novalidate field name) | new |
| AP2507_001 | 3 | QuoteVinDecoderFlow.verifyFormPrefilled() → txtVin, dpdMake, dpdModel, txtYear, visibleFieldLabels(), btnSave | reused locators, new flow step |
| AP2507_001 | 4 | QuoteVinDecoderFlow.verifyDecodeSavedNoQuote() — no row above the baseline carries the VIN | new |
| AP2507_002 | 1 | openCreateAQuote(), decodeVin() (hidden inputs recorded as an annotation), verifyFormPrefilled() | new (shared with 001) |
| AP2507_002 | 2 | fillQuoteName() → DealerQuoteVehicleFormPage.fillQuoteName(); saveAndVerifyQuoteCreated(); verifyOnlyTheSavedQuoteAdded() | reused page method, new flow steps |
| AP2507_002 | 3 | verifySavedVehicleIsNewDecodedVehicle() → DealerQuoteRecordPage.openQuoteDetails(), vehicleIdOnQuote(), openVehicleEditForm(), txtVehicleVin, selVehicleMake, selVehicleModel, txtVehicleYear | reused + new locators |
| AP2507_002 | 4 (record-only) | DealerQuoteRecordPage.vehicleDetailValues() → `record-only-vehicle-details` annotation | new |
| AP2507_003 | 1 | openCreateAQuote() | new (shared) |
| AP2507_003 | 2 | fillQuoteName(), decodeVin() | new (shared) |
| AP2507_003 | 3 | verifyFormPrefilled(…, quoteName) (Quote name kept), saveAndVerifyQuoteCreated() | new (shared) |
| AP2507_003 | 4 | verifyQuoteNameOnDetails(), verifyOnlyTheSavedQuoteAdded() (the /quotes row carries the name) | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| selVehicleTypeSwitch | `page.locator('#vehicle_type_switch')` | /quote/new/edit-vehicle | 1 |
| hiddenDetails | `form[name="quote_vehicle"] input[type="hidden"][name^="quote_vehicle["]` | /quote/new/edit-vehicle (after decode) | 7 (a list by design: transmission, cylinders, engineSize, engineSizeUnit, fuelType, id, _token) |
| scriptsFromBuild | `page.locator('script[src^="/build/"]')` | /quote/new/edit-vehicle | 2 (a list by design: runtime.0c796a0d.js, app.18b4959e.js) |
| txtVehicleVin | `page.locator('#vehicle_VIN')` | /vehicle/{id}/edit | 1 |
| selVehicleMake | `page.locator('#vehicle_make')` | /vehicle/{id}/edit | 1 |
| selVehicleModel | `page.locator('#vehicle_model')` | /vehicle/{id}/edit | 1 |
| txtVehicleYear | `page.locator('#vehicle_year')` | /vehicle/{id}/edit | 1 |
| vehicleDetailFields | `#vehicle_fuelType`, `#vehicle_transmission`, `#vehicle_engineSize`, `#vehicle_engineSizeUnit`, `#vehicle_cylinders`, `#vehicle_isTurbo` | /vehicle/{id}/edit | 1 each |

Reused AP-2477 locators re-checked live on the new layout (count 1 each, before and after a
decode): `#quote_vehicle_quote_name`, `#quote_vehicle_VIN`, `button[data-action="vinLookup"]`,
`#vehicle_make`, `#vehicle_model`, `#vehicle_year`, the Brand/Model Bootstrap-select wrappers
(button `title` = Ford / Focus after decode), `[type="submit"]`, `main h1`. The old top-right
type button `#dropdownMenuLink1` now has count 0 (AP-2533).

## Files changed
| File | Change |
|---|---|
| src/pages/dealerPortal/DealerQuoteVehicleFormPage.ts | added selVehicleTypeSwitch, hiddenDetails, scriptsFromBuild, vehicleTypeShown(), fillVin(), decode(), hiddenDetailValues(), buildScriptSources(); class comment updated (Décoder fixed on Dev by AP-2533). No existing member changed |
| src/pages/dealerPortal/DealerQuoteRecordPage.ts | added txtVehicleVin, selVehicleMake, selVehicleModel, txtVehicleYear, vehicleDetailFields, quoteRows(), chosenOption(), vehicleDetailValues(). No existing member changed |
| src/flows/QuoteVinDecoderFlow.ts | new flow (its own file, so QuoteVehicleFormFlow and the AP-2477 tests keep their behaviour) |
| src/tests/dealer/quoteVinDecoder_AP2507.spec.ts | new spec, 3 tests, skips unless DEALER_PORTAL_URL is v2dev |

## Run
Command: `npx playwright test --project=chromium --grep @AP-2507 --workers=1`
Lint: pass · Run 1: 3 passed, 0 fixme, 52.3 s · Run 2 (separate run): 3 passed, 0 fixme, 44.8 s — no flaky tests

Evidence each run writes as test annotations: the two `novalidate` lines found in
`/build/app.18b4959e.js` (`…name:r+"[novalidate]"…` and `…o.push({name:i+"[novalidate]",value:!0})…`),
the decoder post (`POST /quote/new/edit-vehicle → 200; novalidate field: quote_vehicle[novalidate]`),
the hidden inputs after decode (automatic / 4 / 2 / kW / GASOLINE / id 863), and for AP2507_002
the saved vehicle's record-only details (GASOLINE, Automatic, 2, Litre, 4, turbo false — the
kW vs Litre difference is AP-2552, not judged here).

## Test data left on Dev
Dealers cannot delete quotes. Every run of the spec leaves **two quotes and two vehicles**
(AP2507_001 saves nothing — it fails if the decode saves a quote). Each is printed to the console
and stored as a `test-data-left` annotation.

| Run | Test | Quote | Vehicle |
|---|---|---|---|
| 1 | AP2507_002 | 6603 "QA-AP2507-002-1794050680069" | 1158 (Ford Focus 2008, VIN 1FAHP35NX8W239204) |
| 1 | AP2507_003 | 6604 "QA-AP2507-003-1794050696138" | 1159 (Ford Focus 2008) |
| 2 | AP2507_002 | 6605 "QA-AP2507-002-1794050737153" | 1160 (Ford Focus 2008) |
| 2 | AP2507_003 | 6606 "QA-AP2507-003-1794050753017" | 1161 (Ford Focus 2008) |

The locator check in the browser made one decode on the unsaved form (nothing saved) and opened
vehicle 1155 read-only. The manual run's quotes 6600 / 6601 and vehicles 1155 / 1156 were not changed.

## Pull request
Not opened — awaiting R5 (`--review external`). PR skipped: vcs preflight fails (gh not logged in) and the framework commit 22fa313 is only on main, not origin/dev.

## Not passing
None.

Note for the reviewer: the AP-2477 spec's `QuoteVehicleFormFlow.openCreateAQuote()` still asserts
the old top-right type button `#dropdownMenuLink1`, which AP-2533 removed from Dev (count 0 on
2026-11-07). It was neither changed nor run here; the AP-2477 tests that use it will likely
fail on the current Dev build and need their own follow-up.

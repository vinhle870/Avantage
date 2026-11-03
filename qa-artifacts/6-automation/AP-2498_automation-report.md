# Automation Report — AP-2498
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/roadSideProtectionVehicleForm_AP2498.spec.ts · Tag: @AP-2498
Result: 2 of 2 PASSED cases automated — 2 passing, 0 fixme

## Summary
The two AP-2498 cases that passed manually on Dev (v2dev) now run automatically: the Make and Model lists of the add-roadside-protection window (AP2498_007), and the prefill of the vehicle's VIN and year on a new quote (AP2498_008). The other twelve cases are not automated because they failed (bugs AP-2523, AP-2524, AP-2525) or were blocked (AP2498_004 parked at Gate B, AP2498_014 by AP-2508), so there is no confirmed behaviour to assert. The tests only open and read the window; they never press Continue, Save or Generate Contract.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2498_007 | The Make list is filled and the Model list changes to the models of the Make selected | automated — passing | — |
| AP2498_008 | On a new quote, the form shows the vehicle's VIN and year when nothing is stored for roadside protection yet | automated — passing | — |
| AP2498_001, 012 | Notice below the form | not selected | FAIL — AP-2523 (wrong notice text) |
| AP2498_002, 003, 009, 010, 011, 013 | Form visible above the products | not selected | FAIL — AP-2524 (form folded behind "Edit") |
| AP2498_005, 006 | VIN required | not selected | FAIL — AP-2525 (VIN not required) |
| AP2498_004 | Form holds only VIN, Year, Make, Model and Continue | not selected | BLOCKED — parked at Gate B (R2 round 3) |
| AP2498_014 | A tier can still be chosen in the product step | not selected | BLOCKED — AP-2508 |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2498_007 | 1 | DealerFlow.loginToDealerPortal() · WarrantyVehicleFormFlow.createVehicle() | reused |
| AP2498_007 | 2 | WarrantyVehicleFormFlow.createQuote() · RoadSideProtectionFlow.openRoadSideModal() (QuoteProductSummaryPage.clickRowAdd('roadside')) | new (flow method; row locator reused) |
| AP2498_007 | 3 | RoadSideProtectionFlow.verifyMakeListFilled() · chooseMakeAndReadModels(quoteId, 'Toyota') | new |
| AP2498_007 | 4 | RoadSideProtectionFlow.chooseModel('Corolla') · chooseMakeAndReadModels(quoteId, 'Honda') · recordModelAfterMakeChange() | new |
| AP2498_007 | 5 | RoadSideProtectionFlow.verifyModelListFollowsMake() | new |
| AP2498_008 | 1 | DealerFlow.loginToDealerPortal() · WarrantyVehicleFormFlow.createVehicle() | reused |
| AP2498_008 | 2 | WarrantyVehicleFormFlow.createQuote() | reused |
| AP2498_008 | 3 | RoadSideProtectionFlow.openRoadSideModal() (also checks the row reads "- None Selected -") | new |
| AP2498_008 | 4 | RoadSideProtectionFlow.verifyPrefillFromVehicle() | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| mdlOpen | page.locator('#myModal.show') | /quote/6520/details (modal open) | 1 |
| frmRsVehicle | mdlOpen.locator('form[name="quote_auto_shield_make_model"]') | /quote/6520/details (modal) | 1 |
| txtRsVin | mdlOpen.locator('#quote_auto_shield_make_model_VIN') | /quote/6520/details (modal) | 1 |
| txtRsYear | mdlOpen.locator('#quote_auto_shield_make_model_vehicleYear') | /quote/6520/details (modal) | 1 |
| selRsMake | mdlOpen.locator('#quote_auto_shield_make_model_vehicleMake') | /quote/6520/details (modal) | 1 |
| selRsModel | mdlOpen.locator('#quote_auto_shield_make_model_vehicleModel') | /quote/6520/details (modal) | 1 |
| dpdRsMake | mdlOpen.locator('.form-group:has(> label[for="quote_auto_shield_make_model_vehicleMake"]) > .bootstrap-select') | /quote/6520/details (modal) | 1 |
| dpdRsModel | mdlOpen.locator('.form-group:has(> label[for="quote_auto_shield_make_model_vehicleModel"]) > .bootstrap-select') | /quote/6520/details (modal) | 1 |
| btnRsContinue | mdlOpen.locator('#quote_auto_shield_make_model_continue') | /quote/6520/details (modal) — defined, never clicked | 1 |

Verified on v2dev on 2026-11-02 in the browser on quote 6520 (from the manual run): the modal was opened with **+** and read; nothing was submitted.

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/RoadSideProtectionPage.ts | AP-2225 batch file — added the modal members listed above plus readSelectedText(), readRealOptionTexts(), chooseRsMake(), chooseRsModel() and the uiActions import; existing members unchanged |
| playwright-automation/src/flows/RoadSideProtectionFlow.ts | AP-2225 batch file — added openRoadSideModal(), verifyMakeListFilled(), chooseMakeAndReadModels(), chooseModel(), recordModelAfterMakeChange(), verifyModelListFollowsMake(), verifyPrefillFromVehicle() and the QuoteProductSummaryPage import; existing methods unchanged |
| playwright-automation/src/tests/dealer/roadSideProtectionVehicleForm_AP2498.spec.ts | new spec, `@dealer @AP-2498`, 2 tests |

No QA-modified file (AdminFlow.ts, DealerFlow.ts, index.ts, test-fixtures.ts or any other already-changed file) was touched. WarrantyVehicleFormFlow (AP-2497) is reused for the vehicle and quote set-up without change.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2498`
Lint: pass · Run: 2 passed, 0 fixme, 53 s; R5 re-run `--repeat-each=2`: 4 passed, 1.7 min, no flaky tests
Reviewer R5 (inline): APPROVE, 0/0/1 — F-1: after these tests run, the AP-2225 spec (AP2225_001, not changed here) fails because it opens "the newest quote with a VIN", which is now an AP-2498 quote with no Make/Model stored and so shows the "no products" alert. That spec's quote choice should be made independent of the newest quote.

Test data created on Dev by the three runs (one vehicle, one client and one quote per test; no Continue, Save or contract): vehicles 1119–1124 and quotes 6527–6532 — 1121/6529, 1122/6530, 1123/6531 and 1124/6532 read from the test annotations; 1119/6527 and 1120/6528 inferred from the id sequence of the first run (the only one without a JSON report). Clients `qa.ap2498.007.<stamp>@yopmail.com` and `qa.ap2498.008.<stamp>@yopmail.com`. Recorded on Dev: 151 makes; Model after the Make change = "Choice" (cleared, Q-007); Make/Model on a new quote = "Choose / Choose" (Q-009).

## Pull request
PR skipped: gh CLI not installed (run with --no-pr)

## Not passing
None.

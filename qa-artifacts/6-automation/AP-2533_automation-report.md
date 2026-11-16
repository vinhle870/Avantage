# Automation Report — AP-2533
Date: 2026-11-07 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2533_2026-11-07.md
Spec: playwright-automation/src/tests/dealer/quoteFormUi_AP2533.spec.ts · Tag: @AP-2533
Result: 10 of 10 PASSED cases automated — 10 passing, 0 fixme
Rework: R5 round 1 findings F-1 to F-5 applied 2026-11-07 (see "Rework — R5 round 1")

## Summary
All ten cases that passed manually on Dev now run automatically: "Décoder" fills the form with
the Tesla VIN and saves nothing (001, 003, 005, 006, 011), a Save after a decode creates exactly one
quote (004), the "Vehicle type" select sits before Quote name in English, after a type change and in
French (007, 008, 009), and a Save with Brand, Model and Year empty is refused (010). AP2533_002 is not
automated because it was BLOCKED by Q-002 (no hidden input or value is named yet). Every observation
the manual cases record without a verdict (Q-002 to Q-009) is written as a test annotation, never
asserted. The suite skips itself unless both `BASE_URL` and `DEALER_PORTAL_URL` point at
`v2dev.garantieavantageplus.ca`.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2533_001 | Clicking "Décoder" with the Tesla VIN keeps the form on screen with TESLA, Model 3 and 2020 filled in | automated — passing | — |
| AP2533_002 | Clicking "Décoder" with the Tesla VIN fills the form's hidden vehicle inputs with the decoded values | not selected | BLOCKED manually by Q-002 (comment 19510) — no confirmed expected result to assert |
| AP2533_003 | Clicking "Décoder" without pressing Save creates no quote and keeps the dealer on the "Create a quote" form | automated — passing | The inventory first-row read (record-only, Q-005) is not automated |
| AP2533_004 | Saving the form after a decode creates exactly one quote carrying the decoded TESLA Model 3 2020 | automated — passing | Leaves one quote and one vehicle per run |
| AP2533_005 | Clicking "Décoder" with a malformed or empty VIN shows no error page, keeps the form and creates no quote | automated — passing | — |
| AP2533_006 | Decoding the Tesla VIN after choosing Ford, Focus and 2008 by hand keeps the form and creates no quote | automated — passing | — |
| AP2533_007 | The "Create a quote" form shows a drop-down labelled "Vehicle type" placed before the Quote name | automated — passing | — |
| AP2533_008 | Changing the vehicle type in the drop-down reloads the form without error and keeps "Vehicle type" before Quote name | automated — passing | — |
| AP2533_009 | In the French interface the vehicle-type drop-down still sits before the quote name field | automated — passing | Only the French position is asserted; the French label is an annotation (Q-009). The language read in step 1 is restored in `finally` and checked on a fresh load |
| AP2533_010 | Saving the updated form with Brand, Model and Year empty is refused and creates no quote | automated — passing | — |
| AP2533_011 | Decoding the Tesla VIN on a second car type's form keeps the form on screen and creates no quote | automated — passing | Skips itself if no second type offers "Décoder" (the case's SKIPPED rule) |

Differences from the manual steps, by design:
- Name searches use the full unique name `QA-AP2533-<case>-<Date.now()>` instead of the prefix, because earlier runs of AP2533_004 leave quotes with the `QA-AP2533-004` prefix.
- The build check (read-only fetch of the page's `/build/` scripts, AP-2507's `verifyDecoderFixInBuild`) runs in every test that clicks "Décoder" instead of being cited from AP2533_001, so each test stands alone.
- AP2533_003 compares the VIN search ids before and after the decode inside the same test, over all result pages.

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() | reused |
| 001 | 1 | QuoteVinDecoderFlow.openCreateAQuote(), verifyDecoderFixInBuild() | reused |
| 001 | 2, 4 | QuoteFormUiFlow.recordHiddenInputs() (annotation); decodeVin() records the after-decode list | new / reused |
| 001 | 3 | QuoteVinDecoderFlow.decodeVin(VIN, TESLA) | reused |
| 001 | 5 | QuoteVinDecoderFlow.verifyFormPrefilled(VIN, TESLA) | reused |
| 003 | 1 | QuoteFormUiFlow.searchQuoteIds(VIN) | new |
| 003 | 2–3 | QuoteVinDecoderFlow.openCreateAQuote(), fillQuoteName(), decodeVin(), verifyFormPrefilled(…, name) | reused |
| 003 | 4–5 | QuoteFormUiFlow.verifyNoQuoteFound(name), verifySearchUnchanged(VIN, baseline) | new |
| 004 | 1 | QuoteFormUiFlow.verifyNoQuoteFound(name) | new |
| 004 | 2 | QuoteVinDecoderFlow.fillQuoteName(), decodeVin() (hidden `quote_vehicle[id]` recorded), verifyFormPrefilled() | reused |
| 004 | 3 | QuoteFormUiFlow.saveAndVerifyQuoteCreated() | new |
| 004 | 4–5 | QuoteFormUiFlow.verifyQuoteVehicle(), verifyExactlyOneQuoteNamed() | new |
| 005 | 1 | QuoteVinDecoderFlow.openCreateAQuote(), verifyDecoderFixInBuild(), fillQuoteName() | reused |
| 005 | 2–3 | QuoteFormUiFlow.decodeAndStayOnForm('ABC123' / ''), verifyFormCardShown(), recordQuoteNameAndMessages() | new |
| 005 | 4–5 | QuoteFormUiFlow.verifyNoQuoteFound(name) | new |
| 006 | 2 | QuoteFormUiFlow.chooseVehicleByHand(FOCUS) (DealerQuoteVehicleFormPage.chooseBrand/chooseModel/fillYear) | new / reused |
| 006 | 3 | QuoteFormUiFlow.decodeAndStayOnForm(VIN), verifyFormCardShown(), verifyQuoteNameKept() | new |
| 006 | 4–5 | QuoteFormUiFlow.verifyEachValueHandChosenOrDecoded(FOCUS, TESLA), verifyNoQuoteFound() | new |
| 007 | 2 | QuoteFormUiFlow.recordVehicleTypeControl() (annotation) | new |
| 007 | 3–4 | QuoteFormUiFlow.verifyVehicleTypeBeforeQuoteName() | new |
| 008 | 2, 4 | QuoteFormUiFlow.chooseVehicleType('RV CLASS A' / default) | new |
| 008 | 3, 5 | recordAfterTypeChange(), verifyFormCardShown(), verifyVehicleTypeShows(), verifyVehicleTypeBeforeQuoteName() | new |
| 009 | 1 | QuoteFormUiFlow.openNewQuoteForm(), readInterfaceLanguage() | new |
| 009 | 2, 4 | switchToFrenchAndRecordLabels() (labels annotated, Q-009), verifyVehicleTypePositionOnlyBeforeQuoteName('French') — position asserted, label annotated | new |
| 009 | 3–4 | restoreLanguage(original) in `finally`, verifyLanguageRestored(original) — fresh `/quote/new/edit-vehicle` load with no `?_locale=` | new |
| 010 | 2 | QuoteFormUiFlow.recordFormMap() (annotation) | new |
| 010 | 3–5 | QuoteFormUiFlow.saveAndVerifyRefused([...]) — a non-empty message under Brand, Model and Year asserted; wording annotated and compared with "This value should not be blank." (DealerQuoteVehicleFormPage.fieldError), verifyNoQuoteFound() | new / reused |
| 011 | 1–2 | recordVehicleTypeControl(), findSecondTypeWithDecoder() | new |
| 011 | 3–5 | decodeAndStayOnForm(VIN), verifyFormCardShown(), verifyVehicleTypeShows(), verifyQuoteNameKept(), verifyVinKept(), verifyNoQuoteFound() | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lblVehicleType | `form[name="quote_vehicle"] label[for="vehicle_type_switch"]` | /quote/new/edit-vehicle | 1 |
| dpdVehicleType | `//form[@name='quote_vehicle']//div[*[@for='vehicle_type_switch']]/div` (Bootstrap-select wrapper; options `ul li span.text`) | /quote/new/edit-vehicle, /quote/new/edit-vehicle/RV_CLASS_A | 1 |
| lblSavedBanner | `main [role="alert"]` with text "Vehicle saved" | /quote/new/edit-vehicle (expected 0) | 0 on the form |

Verified in the browser on Dev at 11:32–11:34Z: choosing a type in the widget navigates to the option's `data-url`
(`/quote/new/edit-vehicle/RV_CLASS_A`); the decoder posts to the current form URL and replaces the whole
`quote_vehicle` form element (a marker set on the form before the click is gone afterwards), which is what
`decodeOnCurrentForm()` waits on. The French form (`?_locale=fr`) was opened once and English restored at once.

## Files changed
| File | Change |
|---|---|
| src/pages/dealerPortal/DealerQuoteVehicleFormPage.ts | added lblVehicleType, dpdVehicleType, lblSavedBanner, vehicleTypeOptions(), chooseVehicleTypeInSelect(), vehicleTypeComesBeforeQuoteName(), vehicleTypeAndQuoteNameBoxes(), decodeOnCurrentForm(), dropdownShown(), formErrorTexts() — existing members unchanged; class comment now names both specs that click "Décoder" (AP-2507 and AP-2533) |
| src/flows/QuoteFormUiFlow.ts | new flow for AP-2533 (rework: verifyVehicleTypePositionOnlyBeforeQuoteName(), verifyLanguageRestored(), labels checked in order, message wording annotated) |
| src/tests/dealer/quoteFormUi_AP2533.spec.ts | new spec, 10 tests |

Not changed: QuoteVinDecoderFlow.ts, quoteVinDecoder_AP2507.spec.ts, DealerQuoteRecordPage.ts, QuoteListPage.ts (reused as is), and the stale `QuoteVehicleFormFlow.openCreateAQuote` (left for the separate AP-2477 task).

## Run
Command: `npx playwright test --project=chromium --grep @AP-2533 --workers=1`
Lint: pass · Run 1: 10 passed, 0 fixme, 1.6 min · Run 2 (separate run): 10 passed, 0 fixme, 1.7 min — no flaky tests

Left on Dev by the two runs (AP2533_004, dealers cannot delete quotes):
| Run | Quote | Vehicle |
|---|---|---|
| 1 | 6609 "QA-AP2533-004-1794051414827" | 1164 |
| 2 | 6610 "QA-AP2533-004-1794051520625" | 1165 |

Every further run of AP2533_004 leaves one more quote and vehicle. Record-only notes from run 2: the decode now
puts hidden `quote_vehicle[id]` = 1157 (the manual run's vehicle), yet the Save created a new vehicle (1165); French labels "Type de véhicule" / "Quote name" (Q-009); on ATV / UTV the decode sets Year 2020
and leaves Brand/Model on "Choose" with "This value is not valid." / "Choose a valid model" (Q-004).

**Vehicle 1157 is recorded, not asserted.** The manual case AP2533_004 makes the hidden `quote_vehicle[id]`
and what the Save does to that vehicle record-only (Q-002). The spec writes the hidden id after the decode and the
saved vehicle id as the `record-only-Q-002` annotation, but does not read vehicle 1157 and asserts nothing about it:
if a later build reused and overwrote 1157 on Save, AP2533_004 would still pass (the quote would show TESLA Model 3
2020 either way) and only that annotation (the two ids equal) would show it.

## Rework — R5 round 1
| Finding | Change |
|---|---|
| F-1 (Major) | AP2533_009 now calls the new `verifyVehicleTypePositionOnlyBeforeQuoteName('French')`: it asserts only the position (type control first in the DOM, and above Quote name or on its row to its left) and records the French label as `record-only-Q-009`. `verifyVehicleTypeBeforeQuoteName()` still asserts the label "Vehicle type" for 007 / 008; both share one private position check, so 007 and 008 behave as before |
| F-2 | `verifyFormCardShown()` asserts the six labels are present in that order (other labels may appear between) and annotates the full list as `form-labels`. `saveAndVerifyRefused()` asserts a visible, non-empty message under Brand, Model and Year; the wording is the `record-only-message-wording` annotation with a same-as-2026-11-01 flag (the case only records and compares it) |
| F-3 | Vehicle 1157 statement above (report only) |
| F-4 | AP2533_009 restores the language read in step 1 (`original`) in `finally`, and `verifyLanguageRestored(original)` opens `/quote/new/edit-vehicle` afresh with no `?_locale=` parameter |
| F-5 | DealerQuoteVehicleFormPage.ts class comment names both specs that click "Décoder" |

Rework run (2026-11-07, finished 11:49Z): lint pass (`tsc --noEmit`); `npx playwright test --project=chromium --grep @AP-2533 --workers=1` — 10 passed, 0 failed, 0 fixme, 1.7 min (one run, as instructed for a rework round). Left on Dev: quote 6612 "QA-AP2533-004-1794052083331", vehicle 1167. Annotations from this run: hidden `quote_vehicle[id]` after decode "1157", saved vehicle 1167; French type label "Type de véhicule"; language original "en", restored "en"; messages under Brand / Model / Year all "This value should not be blank." (same as 2026-11-01).

Left on Dev by AP-2533 automation runs so far: quotes 6609, 6610 (automator runs 1–2), 6611 (R5 round 1 run), 6612 (rework run); vehicles 1164, 1165, 1166, 1167.

## Pull request
PR skipped: not opened — awaiting R5 (`--review external`); the vcs preflight also fails (gh not logged in) and the framework commit 22fa313 is only on main, not origin/dev (`--no-pr`).

## Not passing
None.

# AP-2491 — Regression run of the Playwright suite on Dev (2026-11-07)

**Ticket:** AP-2491 "Cleanup deprecated functions" (status QC) · **Environment:** Dev (v2dev), dealer 1380, one worker
**Command:** `npx playwright test --project=chromium --workers=1` (list + JSON reporters)
**Scope:** update specs that are stale for today's UI, re-run, classify every remaining failure. No PR (regression
maintenance; `gh` not logged in). Jira not touched.

Run artefacts (scratchpad):
- Before: `regression-AP-2491-2026-11-07-before.log` / `.json` (start 11:54Z, 51.4 min)
- After: `regression-AP-2491-2026-11-07-after.log` / `.json` (start 12:51Z, 60.6 min)

## 1. Counts

| Run | Total | Passed | Failed | Skipped | Did not run |
|---|---|---|---|---|---|
| 2026-11-05 (earlier triage) | 143 | 84 | 55 | 4 | — |
| 2026-11-07 before fixes | 184 | 110 | 58 | 13 | 3 |
| 2026-11-07 after fixes | 184 | **135** | **33** | 13 | 3 |

Fixed by this maintenance: **26 tests** (8 AP-2477, TC008, 17 sale-contract tests). Two tests passed before and failed after
(AP2494_006, AP2494_011); both are test-data drift, see §3. The 13 skipped and 3 "did not run" tests are the same in both runs.
They are environment-gated skips and serial-mode follow-ons.

## 2. Root causes found in the before run, and what was done

| Group | Tests | Root cause | Action |
|---|---|---|---|
| A. Legacy new-quote form | 34 (TC001, TC008, 17 sale contract, 15 warranty) | `DealerNewQuotePage` filled the old full vehicle form (`#vehicle_VIN`, `#vehicle_quote_name`, price/km/condition/…). Since AP-2477/AP-2533, `/quote/new/edit-vehicle` only has Vehicle type, Quote name, VIN, Brand, Model, Year (`#quote_vehicle_*`). Old ids count 0 on Dev. | **Fixed** (test outdated). The new-quote form now gets VIN/Brand/Model/Year/Quote name. The remaining test-data values (price, km, condition, fuel, transmission, engine, designation, options, coverage) are entered on `/vehicle/{id}/edit`, which still has every `vehicle_*` field (each verified count 1 on Dev, vehicle 863, read only). No assertion changed. The sale-contract tests then pass. The warranty tests now get further and fail on groups F and G below. |
| B. AP-2477 flow | 8 (AP2477_001–006, 010, 012) | `QuoteVehicleFormFlow` read the type from the removed top-right `#dropdownMenuLink1` (count 0) and `FIVE_FIELDS` lacked the AP-2533 "Vehicle type" label | **Fixed** (test outdated). The type is now read from and chosen in `#vehicle_type_switch` with the AP-2533 page-object members. "Vehicle type" was added as the first expected label (verified on Dev: labels `Vehicle type, Quote name, VIN, Brand*, Model*, Year*`). Visible controls and required controls are unchanged, because the select has no `name` and no star. The five-field, required and decoder checks are otherwise unchanged. |
| C. Contract pages redesigned | 8 (AP2428 ×5, AP2503 ×3) | The Permaplate and Extended-Warranty contract pages now use the roadside-style layout: H4 "Vehicle identification" with a collapsed "Vehicle details" toggle, H4 "Owner identification", H4 "Product Summary" with editable Start Date and Financing company. "Owner information", "Program Summary", `#warranty_finalize_clientFirstName` and `#permaplate_contract_vehicle*` are gone. | **Not changed.** Several assertions are now contradicted: read-only summary, PDF preview in the right column, one contract control. I cannot confirm that this redesign is intended. |
| D. Esthetic protection row | 3 (AP2493_003, AP2496_002/003) | The Esthetic protection amount cell now reads "- None Selected -" with no product (was "-") and "CA$80.00" on quote 6463 (was "-") | **Not changed.** The cell now matches the other product rows. Whether this is intended is unconfirmed. |
| E. Data / environment | 4 (AP2494 ×3, AP2374_007) | Fixed quotes pushed past page 15 of `/quotes`; Yopmail wait timeout | **Not changed.** |

## 3. Every failure remaining after the fixes (33)

| # | Spec | Test | Class | Evidence |
|---|---|---|---|---|
| 1 | admin/claimStatusNotify_AP2374.spec.ts | AP2374_007 | environment | `page.waitForFunction` 30 s timeout in `YopmailInboxPage.ts:61` (external Yopmail inbox). It also failed on 2026-11-05. AP2374_008–010 pass. |
| 2 | dealer/cancelQuoteProduct_AP2493.spec.ts | AP2493_003 | test outdated-unresolved | Quote 6463 Esthetic protection amount cell = "CA$80.00", data expects "-". The Esthetic row now shows an amount (group D). Intended change not confirmed. |
| 3 | dealer/downloadAllDocuments_AP2496.spec.ts | AP2496_002 | test outdated-unresolved | Quote 6485 Esthetic amount cell = "- None Selected -", expected "-" (`QuoteDocumentsDownloadFlow.ts:63`). The row now renders like the other rows. Intended change not confirmed. |
| 4 | dealer/downloadAllDocuments_AP2496.spec.ts | AP2496_003 | test outdated-unresolved | Same on quote 6486 (snapshot: `cell "- None Selected -"`). |
| 5 | dealer/existingQuote.spec.ts | TC001 | product defect candidate | Quote, vehicle edit, client and warranty steps now pass (quote 6638). It then fails in `downloadEmbeddedPdf`: `embed` count 0. The redesigned "Extended Warranty Contract" page has no PDF preview. AP-2503's approved spec requires one in the right column. |
| 6–18 | dealer/warranty.spec.ts | TC010, TC1576–TC1582, TC1584–TC1588 (13) | product defect candidate | Same as #5: no `embed` preview on `/quote/{id}/warranty/generate-contract`. The legacy warranty tests read the contract PDF text from that preview. |
| 19 | dealer/warranty.spec.ts | TC1583 | product defect candidate | The client form Province list offers **"Nanavut"**. Data and the correct spelling are "Nunavut" (`Option "Nunavut" not offered by quote_client_province`). The same misspelling is in the contract page Province select. |
| 20 | dealer/warranty.spec.ts | TC1411 | test outdated-unresolved | "Generate Contract" is refused on the redesigned page with "This value should not be blank." under **Financing company** in Product Summary. The legacy cash sale has no financing company. The yellow alert "The delivery date has passed the acceptable timeframe" also shows, although the delivery date is set to today. No contract and no invoice were created (quote 6684). A financing company being required on a cash sale may itself be a defect. |
| 21 | dealer/permaplateContract_AP2428.spec.ts | AP2428_001 | test outdated-unresolved | `h4 "Owner information"` count 0. The page now shows "Owner identification" (group C). |
| 22 | dealer/permaplateContract_AP2428.spec.ts | AP2428_003 | test outdated-unresolved | `#permaplate_contract_vehicleMake` count 0. The vehicle fields now sit behind the collapsed "Vehicle details" toggle under new ids. |
| 23 | dealer/permaplateContract_AP2428.spec.ts | AP2428_006 | test outdated-unresolved | The test asserts a read-only Program Summary, but `dl.row` now holds 2 inputs (Start Date, Financing company). The behaviour contradicts the test, and I cannot confirm the change is intended. |
| 24 | dealer/permaplateContract_AP2428.spec.ts | AP2428_011 | test outdated-unresolved | `#permaplate_contract_vehicleVin` count 0 (VIN input moved/renamed). |
| 25 | dealer/permaplateContract_AP2428.spec.ts | AP2428_013 | test outdated-unresolved | Quote 6456: 2 contract links (`a[href^="/quote/6456/"][href*="contract"]`), expected only the PDF link. A second contract control is now offered. Needs a product decision. |
| 26 | dealer/warrantyGenerateContract_AP2503.spec.ts | AP2503_001 | test outdated-unresolved | `h3 "Program Summary"` count 0. Now `h4 "Product Summary"`. |
| 27 | dealer/warrantyGenerateContract_AP2503.spec.ts | AP2503_002 | test outdated-unresolved | `h4 "Owner information"` count 0, and no PDF preview (see #5). |
| 28 | dealer/warrantyGenerateContract_AP2503.spec.ts | AP2503_010 | test outdated-unresolved | `#warranty_finalize_clientFirstName` count 0 (owner fields renamed). |
| 29 | dealer/quoteListContractsSearch_AP2494.spec.ts | AP2494_004 | test data | "Quote 6454 is not on pages 1–15 of the active list". Each full run adds about 55 quotes (before run 6614–6630, after run 6635–6688), so the fixed AP-2494 quotes drift past page 15. |
| 30 | dealer/quoteListContractsSearch_AP2494.spec.ts | AP2494_006 | test data | Same, quote 6480. It passed in the before run and failed after the after run's 54 new quotes. |
| 31 | dealer/quoteListContractsSearch_AP2494.spec.ts | AP2494_009 | test data | Same, quote 6460. |
| 32 | dealer/quoteListContractsSearch_AP2494.spec.ts | AP2494_011 | test data | Same, quote 6481. It passed before and failed after. |
| 33 | dealer/quoteListContractsSearch_AP2494.spec.ts | AP2494_016 | test data (likely) | A partial/lower-case VIN search does not list quote 6483 (`td[data-href="/quote/6483/details"]` count 0). Probably the same growth: more quotes on that VIN push 6483 off the first result page. Not confirmed in the browser. |

No test was flaky: every failure reproduced in both runs or follows from data that the runs grew.

**Suggested follow-up for the QA:** confirm whether the contract-page redesign (Permaplate + Extended Warranty, roadside-style)
is an intended change and under which ticket. If it is intended, the AP-2428, AP-2503 and legacy warranty specs can be
re-mapped to the new page. If it is not, rows 5–18, 20–28 point to defects: a lost PDF preview, editable summary, a second
contract control, and a required financing company on a cash sale. Also report the "Nanavut" spelling (row 19). Give
AP-2494 a quote lookup that does not depend on list position.

## 4. Files changed (playwright-automation/)

| File | Change | Tests that use it |
|---|---|---|
| `src/pages/dealerPortal/DealerNewQuotePage.ts` (committed file, stale members) | `txtQuoteName` `#vehicle_quote_name` → `#quote_vehicle_quote_name`; `btnSave` → `form[name="quote_vehicle"] [type="submit"]`; `fillNewQuoteForm` now fills VIN/Brand/Model/Year/Quote name through `DealerQuoteVehicleFormPage` (used, not changed); **new** `completeVehicleDetails(vehicleId, vehicle)` fills and saves `/vehicle/{id}/edit` with `VehicleInventoryPage.fillVehicleForm` | newQuote TC008, existingQuote TC001, saleContract ×17, warranty ×15 |
| `src/flows/DealerFlow.ts` (committed) | `createNewQuote`: after the quote is saved, completes the vehicle on its edit form (expects HTTP < 400), returns to the quote and adds the client. It also records `test-data-left` (quote + vehicle). | same 34 tests |
| `src/flows/QuoteVehicleFormFlow.ts` (committed) | `FIVE_FIELDS` gains "Vehicle type" first; `openCreateAQuote` checks the type shown in `#vehicle_type_switch` is Passenger; `chooseVehicleType` uses `chooseVehicleTypeInSelect(label)` and checks the shown type | AP2477_001–006, 010, 011, 012 |

Not touched: the QA's uncommitted `DealerQuoteRecordPage.ts` / `DealerQuoteVehicleFormPage.ts` changes, the AP-2495/AP-2441/AP-2435
files, and the AP-2507/AP-2533 specs and flows. `btnVehicleType` (`#dropdownMenuLink1`) is kept because AP-2533 asserts it is gone.
Lint (`npx tsc --noEmit`) is clean. Locators verified live on Dev 2026-11-07, each with count 1: `#vehicle_type_switch`,
`#quote_vehicle_quote_name`, `#quote_vehicle_VIN`, `form[name="quote_vehicle"] [type="submit"]`, Brand/Model/Type
Bootstrap-select wrappers, and every `VehicleInventoryPage` field plus `[type="submit"]` on `/vehicle/863/edit`.

## 5. Records the runs left on Dev (dealer 1380)

Dealers cannot delete quotes. No vehicle was saved on 863 (read only).

| Run | Quotes | Vehicles | Contracts / invoices |
|---|---|---|---|
| Before (11:54Z) | 6614–6630 (AP-2493 009/010/014, AP-2499 ×5, AP-2507, AP-2533_004, AP-2225, AP-2498 ×2, AP-2497 ×4) | 1173–1178 and the decoder-run vehicles | None from the legacy specs (they failed at the form). The other specs created what they create by design (AP-2493 warranty add/cancel on its own new quotes). |
| Targeted check (12:48Z) | 6631 (TC001), 6632–6634 (AP2477_003/004/012) | 1179–1182 | 6631: warranty product added, no contract |
| After (12:51Z) | 6635–6688 | 1183–1229 (+ exchange vehicles of the sale-contract cases) | **Sale contract info saved on quotes 6652–6669** (17 sale-contract tests, PDF read). Warranty product with no contract on 6638 and 6670–6684. TC1411 (6684): contract refused, so **no warranty contract and no invoice**. No Permaplate/AP-2503 contract was generated (those tests fail before submitting). |

Admin specs ran as designed: dealers.spec TC002 creates a dealer and TC003 deletes it. AP-2441 permission specs restore what they change.
The quote volume from each full run is what pushes the AP-2494 fixed quotes off the list (rows 29–33).

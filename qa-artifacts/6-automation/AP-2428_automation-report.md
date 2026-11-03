# Automation Report — AP-2428
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/permaplateContract_AP2428.spec.ts · Tag: @AP-2428
Result: 7 of 9 PASSED cases automated — 7 passing, 0 fixme

## Summary
Seven of the nine cases that passed manually on Dev (v2dev) now run automatically: the Generate Contract control and the contract form it opens (AP2428_001), the safe redirect for a quote with no Permaplate selection (AP2428_002) and for a quote that already has a contract (AP2428_013), the vehicle prefill (AP2428_003), the Program Summary (AP2428_006), the refusal of a form with Last name and VIN blank (AP2428_011), and a contract keeping its cost price when the admin changes the option's Dealer Cost (AP2428_014). The spec is read-only on the Dev quotes the manual run left behind, so it creates no quote, contract or invoice; its only write is AP2428_014's Dealer Cost change, which is restored in a `finally` block. AP2428_009 and AP2428_015 were not automated, because each run would leave a new quote, a Permaplate contract and a $258.69 invoice on Dev that cannot be deleted from the portal. The four FAIL cases (bugs AP-2512 to AP-2515) and the two BLOCKED cases (Q-001–Q-003) have no confirmed behaviour to assert.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2428_001 | A quote with a saved Permaplate selection shows a Create contract button that opens the contract form | automated — passing | Read-only on quote 6459 (selection saved, no contract) instead of creating a quote; a guard step fails clearly if 6459 ever gets a contract |
| AP2428_002 | A quote with no Permaplate selection does not crash when the contract form is looked for or opened | automated — passing | Read-only on quote 6458 |
| AP2428_003 | The contract form prefills make, model, VIN, odometer and delivery date from the quote's vehicle | automated — passing | Read-only on quote 6459 (vehicle 915). Asserts the five values; which fields are read-only is recorded as an annotation only (Judgement item posted on AP-2428) |
| AP2428_004 | The contract form's Year field is prefilled with the value the ticket specifies | not selected | BLOCKED manually (Q-001 unanswered) |
| AP2428_005 | The contract form prefills the owner's name, company, address, province, phones and email from the client | not selected | FAIL manually (AP-2513, AP-2514) |
| AP2428_006 | The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text | automated — passing | Read-only on quote 6459 |
| AP2428_007 | The contract form shows a Cost Price for the selected Permaplate options | not selected | FAIL manually (AP-2515) |
| AP2428_008 | The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies | not selected | BLOCKED manually (Q-002, Q-003 unanswered) |
| AP2428_009 | Submitting Generate Contract returns the dealer to the quote details page with a PDF download button | not selected | PASSED, but generates data: every run would leave a new quote, contract and invoice on Dev. Kept manual by the read-only preference for this run |
| AP2428_010 | The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form | not selected | FAIL manually (AP-2512) |
| AP2428_011 | Submitting the contract form with Last name and VIN cleared does not crash or lose data silently | automated — passing | On quote 6459. Clicks Generate Contract only with Last name and VIN blank; the server refuses it (the form has `novalidate`), so nothing is created |
| AP2428_012 | An address edited on the contract form does not crash, and where the edited value ends up is recorded | not selected | FAIL manually (AP-2512) |
| AP2428_013 | A quote whose contract was already generated does not crash when the create-contract control is looked for | automated — passing | Read-only on quote 6456 (contract PNA-0000000017) |
| AP2428_014 | An existing contract keeps its cost price after an administrator changes the option's Dealer Cost | automated — passing | Contract of quote 6456; option 20 Dealer Cost raised by 10.00 and restored in `finally`, then read back. The PDF option-name comparison is not automated (the PDF download returns HTTP 500, AP-2512) |
| AP2428_015 | Double-clicking Generate Contract creates exactly one contract for the quote | not selected | PASSED, but generates data: every run would leave a new quote, contract and invoice on Dev. Kept manual by the read-only preference for this run |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() | reused |
| AP2428_001 | 1–3 [Pre-Condition] | replaced by Dev quote 6459 + PermaplateContractFlow.openQuoteDetails() / verifyQuoteHasSelectionWithoutContract() | new |
| AP2428_001 | 4 | PermaplateContractFlow.openContractFormFromRowMenu() — PermaplateContractPage.btnRowMenu(), lnkGenerateContract() | new |
| AP2428_001 | 5 | PermaplateContractFlow.verifyContractFormSections() | new |
| AP2428_002 | 1 [Pre-Condition] | Dev quote 6458 + PermaplateContractFlow.openQuoteDetails() | new |
| AP2428_002 | 2 | PermaplateContractFlow.verifyNoContractControl() | new |
| AP2428_002 | 3–4 | PermaplateContractFlow.verifyContractFormUrlRedirects(id, "Please create a quote first") | new |
| AP2428_003 | 1–2 [Pre-Condition] | Dev quote 6459 + PermaplateContractFlow.openContractForm() | new |
| AP2428_003 | 3–4 | PermaplateContractFlow.verifyVehiclePrefill() | new |
| AP2428_006 | 1 [Pre-Condition] | Dev quote 6459 + PermaplateContractFlow.openContractForm() | new |
| AP2428_006 | 2–4 | PermaplateContractFlow.verifyProgramSummary() | new |
| AP2428_011 | 1–2 [Pre-Condition] | Dev quote 6459 + PermaplateContractFlow.openContractForm() | new |
| AP2428_011 | 3 | PermaplateContractFlow.submitWithBlankLastNameAndVin() | new |
| AP2428_011 | 4 | PermaplateContractFlow.verifyBlankSubmitRefused() | new |
| AP2428_013 | 1–2 | PermaplateContractFlow.openQuoteDetails() + verifyContractExistsControls() | new |
| AP2428_013 | 3–4 | PermaplateContractFlow.verifyContractFormUrlRedirects(id, null) | new |
| AP2428_014 | 1 | PermaplateContractFlow.readContractCostPrice("Perma Contrat2428") | new |
| AP2428_014 | 2 | AdminFlow.loginToAdminPortal() (reused) + PermaplateContractFlow.readDealerCost() / raiseDealerCost() | new |
| AP2428_014 | 3 | PermaplateContractFlow.readContractCostPrice() | new |
| AP2428_014 | 4 | PermaplateContractFlow.restoreDealerCost() (in `finally`) | new |
| AP2428_014 | 5 | PermaplateContractFlow.verifyCostPriceUnchanged() + restoreDealerCost() read-back | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| rowEstheticProtection(id) | `tr:has(a[href="/quote/{id}/permaplate-create-contract"])` | /quote/6459/details | 1 |
| btnRowMenu(id) | `… button[data-toggle="dropdown"]` inside that row | /quote/6459/details | 1 |
| lnkGenerateContract(id) | `a[href="/quote/{id}/permaplate-create-contract"]` | /quote/6459/details (1) · /quote/6456/details (0) | 1 |
| lnkDownloadContract(id) | `a[href="/quote/{id}/permaplate-contract-download"]` | /quote/6456/details | 1 |
| lnkQuoteContractControls(id) | `a[href^="/quote/{id}/"][href*="contract"]` | /quote/6456/details (1) · /quote/6458/details (0) | 1 |
| alertWithText("Please create a quote first") | `.alert-danger` filtered by text | /quote/6458/details after redirect | 1 |
| frmContract | `form[name="permaplate_contract"]` | /quote/6459/permaplate-create-contract | 1 |
| lblVehicleSection | `//h4[normalize-space()="Vehicle identification"]` | contract form | 1 |
| lblOwnerSection | `//h4[normalize-space()="Owner information"]` | contract form | 1 |
| lblProgramSummary | `//h3[normalize-space()="Program Summary"]` | contract form | 1 |
| btnGenerateContract | `form[name="permaplate_contract"] button[type="submit"]` | contract form | 1 |
| txtVehicleMake / Model / Vin / Odometer, txtDeliveryDate, txtOwnerLastName | `#permaplate_contract_vehicleMake` · `_vehicleModel` · `_vehicleVin` · `_vehicleOdometer` · `_deliveryDate` · `_ownerLastName` | contract form | 1 each |
| lblBlankFieldErrors | `.form-error-message` with text "This value should not be blank." | contract form after blank submit | 2 (one per field, as expected) |
| lstProgramSummary | `dl.row` | contract form | 1 |
| lblProgramTerm / lblStartDate / lblEndDate | `//dt[normalize-space()="Program Term" / "Start Date" / "End date"]/following-sibling::dd[1]` | contract form | 1 each |
| lstSelectedOptions | `dl.row ul li` | contract form | 3 (one per option, as expected) |
| inpProgramSummaryControls | `dl.row input, dl.row select, dl.row textarea` | contract form | 0 (expected) |
| contractRowFor(name) | `tbody tr` filtered by client name | /permaplate-contracts | 1 for "Perma Contrat2428", 0 for "Vide Champs2428" |
| txtDealerCost | `#permaplate_option_dealerCost` | /admin/permaplate/3/option/20/edit | 1 |
| btnSave | `form[name="permaplate_option"] button[type="submit"]` | /admin/permaplate/3/option/20/edit | 1 |
| alertSaved | `.alert-success` with text "Option saved successfully" | /admin/permaplate/3/details after Save (checked by saving the unchanged value 80.00) | 1 |

All locators were confirmed in the Playwright MCP browser on v2dev on 2026-11-02, and the browser was closed afterwards.

## Files changed
All new files. No existing file in `playwright-automation/` was modified — in particular not `AdminFlow.ts`, `DealerFlow.ts`, the `index.ts` barrels or `test-fixtures.ts`; the new classes are imported by path.

| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/PermaplateContractPage.ts | new page object: quote hub Esthetic protection row, contract form, dealer contract list |
| playwright-automation/src/pages/adminPortal/AdminPermaplateOptionPage.ts | new page object: admin Permaplate option edit form (Dealer Cost, Save) |
| playwright-automation/src/flows/PermaplateContractFlow.ts | new flow: open/verify contract form, redirects, prefill, Program Summary, blank-submit refusal, cost price, Dealer Cost raise/restore |
| playwright-automation/src/tests/dealer/permaplateContract_AP2428.spec.ts | new spec, `@dealer @AP-2428`, 7 tests; skips itself unless the base URL is v2dev |

## Run
Command: `npx playwright test --project=chromium --grep @AP-2428`
Lint: pass (`npm run lint` = `tsc --noEmit`) · Run: 7 passed, 0 fixme, 1.0 m · `--repeat-each=2`: 14 passed, 0 failed, 2.0 m, no flaky tests. Run against Dev (v2dev) through the framework's gitignored `.env`, with one worker; never against staging.

Data each run: no quote, contract or invoice is created. AP2428_011 submits a form the server refuses. AP2428_014 changes option 20's Dealer Cost (product 3 "10 ans") from 80.00 to 90.00 for a few seconds and restores it in `finally`, then reads 80.00 back; while the test runs, a dealer pricing that option on Dev would see 90.00.

Fixed Dev data the spec depends on: quotes 6456 (with contract PNA-0000000017), 6458 (no Permaplate) and 6459 (Permaplate selection, no contract), all on dealer 1380 with vehicle 915. If someone generates a contract on 6459, AP2428_001/_003/_006/_011 fail at the guard step with a message saying to pick another Dev quote.

## Review
R5 (stlc-qa-reviewer, inline, round 1): **APPROVE** — 0 blocker, 0 major, 2 minor. F-1: AP2428_014 does not compare option names, because the PDF download returns HTTP 500 (AP-2512) — add it once that bug is fixed. F-2: the spec reads fixed Dev quotes instead of unique data, by the read-only choice. Record: qa-artifacts/7-reviews/AP-2428_review.md.

## Pull request
PR skipped: gh CLI not installed (run with `--no-pr`). The four new files are left uncommitted in the working tree for the QA to review.

## Not passing
None.

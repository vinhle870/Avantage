# Automation Report — AP-2377
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md
Spec: playwright-automation/src/tests/client/buyOnline_AP2377.spec.ts · Tag: @AP-2377
Result: 7 of 7 PASSED cases automated — 7 passing, 0 fixme

## Summary
The seven cases that passed manually on Dev (v2dev) now run automatically on the customer portal's buy-online flow: the new current-warranty section at the end of the vehicle form and its "Continue" button (001), the French button labels (002), Client Info now coming before Coverage in the step bar (003), the unticked FORM-L25 checkbox and "Get rates now" (005), "Get rates now" opening the priced Coverage step (006), the unticked box keeping every client value without an error page (007), and a surcharge answered No showing no "OUI" line on the summary (009). The three FAILs (004, 008, 011 — bugs AP-2510 and AP-2511) and the BLOCKED case 010 are not automated, because they have no confirmed expected behaviour. The spec skips itself unless the framework's base URL is v2dev, because its VIN, term and surcharge ids are verified on Dev only. **Each run leaves 7 new purchase sessions on Dev** (one per test, unique `client.stage.<timestamp>@yopmail.com` email; six of them reach Client Info or beyond, one reaches the summary). No test enters payment data or presses a pay/checkout button.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2377_001 | The vehicle form ends with a "Current manufacturer/extended warranty" section of three fields and a "Continue" button | automated — passing | — |
| AP2377_002 | In French, the vehicle step's button reads "Continuer" and the Client Info button reads "Demander un devis" | automated — passing | — |
| AP2377_003 | Submitting the vehicle form opens the Client Info step, now placed before Coverage in the step bar | automated — passing | — |
| AP2377_004 | Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data | not selected | FAIL manually — bug AP-2510 (HTTP 500 on letters in "Warranty mileage limit") |
| AP2377_005 | The Client Info step shows the FORM L25 consent checkbox, unticked, and a "Get rates now" button | automated — passing | — |
| AP2377_006 | Clicking "Get rates now" with the FORM L25 box ticked opens the Coverage step | automated — passing | — |
| AP2377_007 | Clicking "Get rates now" with the FORM L25 box unticked causes no error page and loses no client details | automated — passing | Q-004 (required box, message text) is annotated, not asserted |
| AP2377_008 | A surcharge answered YES at Coverage is listed on the summary page | not selected | FAIL manually — bug AP-2511 (no "OUI" on the summary line) |
| AP2377_009 | A surcharge answered NO causes no error on the summary page — whether it is listed is recorded | automated — passing | Q-007 (how a No answer appears) is annotated, not asserted |
| AP2377_010 | After a paid purchase, the admin warranty details page shows the surcharge answered YES | not selected | BLOCKED manually — no payment test data; specs never pay |
| AP2377_011 | Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary | not selected | FAIL manually — bug AP-2511 |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2377_001 | 1 | BuyOnlineFlow.openVehicleStep('en') | new |
| AP2377_001 | 2 | BuyOnlineFlow.enterVehicle() → BuyOnlinePage.enterVehicle() | new |
| AP2377_001 | 3–4 | BuyOnlineFlow.verifyWarrantySectionAtEndOfForm(), verifySubmitLabel('Continue') | new |
| AP2377_002 | 1 | BuyOnlineFlow.openVehicleStep('fr') → BuyOnlinePage.switchToFrench() | new |
| AP2377_002 | 2 | enterVehicle(), verifySubmitLabel('Continuer') | new |
| AP2377_002 | 3 | BuyOnlineFlow.submitVehicleStep() | new |
| AP2377_002 | 4–5 | BuyOnlineFlow.enterClient(…, false), verifySubmitLabel('Demander un devis') | new |
| AP2377_003 | 1 | openVehicleStep('fr'), BuyOnlineFlow.verifyStepBar('fr', 0) | new |
| AP2377_003 | 2–4 | enterVehicle() with warranty 2131331 / 2027-12-18 / 100000, submitVehicleStep(), verifyStepBar('fr', 1) | new |
| AP2377_005 | 1 | openVehicleStep('en'), enterVehicle(), submitVehicleStep() | new |
| AP2377_005 | 2–3 | BuyOnlineFlow.verifyAgreePolicyCheckbox() (the PDF is fetched over HTTP instead of opening a tab) | new |
| AP2377_005 | 4 | verifySubmitLabel('Get rates now') | new |
| AP2377_006 | 1–2 | openVehicleStep('en'), enterVehicle(full), submitVehicleStep(), enterClient(…, true) | new |
| AP2377_006 | 3 | BuyOnlineFlow.submitClientAndVerifyCoverageStep(), verifyStepBar('en', 2) | new |
| AP2377_007 | 1–2 | openVehicleStep('en'), enterVehicle(full), submitVehicleStep(), enterClient(…, false) | new |
| AP2377_007 | 3–4 | BuyOnlineFlow.submitClientAndVerifyRefusedWithValuesKept() | new |
| AP2377_009 | 1–2 | openVehicleStep('fr'), enterVehicle(full), submitVehicleStep(), enterClient(…, true), submitClientAndVerifyCoverageStep('fr') | new |
| AP2377_009 | 3 | BuyOnlineFlow.chooseTermAnswerSurchargeAndReachSummary('126', '50', 'no') | new |
| AP2377_009 | 4 | BuyOnlineFlow.verifySummaryHasNoYesLine() | new |

No existing page object or flow covers `/customer/avantage-plus/buy` (the existing `ClientQuoteRequestPage` / `TermPriceFlow` drive the different per-customer `/customer/{id}/quote-request` flow), so every step maps to new members in new files.

## New locators
All verified on Dev (v2dev) 2026-11-02 in the browser with a match count of 1 on the page named.

| Name | Expression | Page | Count |
|---|---|---|---|
| lblPageTitle | `h1` | every step | 1 |
| lnkFrancais | `getByRole('link', { name: 'Français', exact: true })` (`a[href$="_locale=fr"]`) | every step (English) | 1 |
| stepBarItems | `div.row.text-center > div.col` | every step | 4 (the four steps — a list, by design) |
| btnSubmit | `form button[type="submit"]` | /buy, /buy/client, /buy/coverage, /buy/coverage-2 | 1 |
| lnkBack | `form a` with text "Back" / "Retour" | /buy/client | 1 |
| txtVin · txtMileage · txtEmail · txtPostalCode · txtMarketValue | `#customer_buy_vehicle_vin` · `_mileage` · `_email` · `_postal_code` · `_marketValue` | /buy | 1 each |
| lblWarrantySectionHeading | `form[name="customer_buy_vehicle"] h4` | /buy | 1 |
| lblWarrantySectionHelp | `form[name="customer_buy_vehicle"] h4 + p` | /buy | 1 |
| txtWarrantyNumber · txtWarrantyEndDate · txtWarrantyMileageLimit | `#customer_buy_vehicle_warrantyNumber` · `_manufacturerWarrantyEndDate` · `_manufacturerWarrantyEndKm` | /buy | 1 each |
| txtFirstName … txtClientEmail, ddlProvince | `#customer_quote_client_firstName` · `_lastName` · `_address1` · `_city` · `_province` · `_postalCode` · `_phone1` · `_email` | /buy/client | 1 each |
| chkAgreePolicy | `#customer_quote_client_isAgreePolicy` | /buy/client | 1 |
| lblAgreePolicy · lnkFormL25 | `label[for="customer_quote_client_isAgreePolicy"]` · `… a` | /buy/client | 1 each |
| lblAgreePolicyError | `label[for="customer_quote_client_isAgreePolicy"] .form-error-message` | /buy/client after an unticked submit | 1 |
| ddlProgramTerm | `#customer_buy_coverage_programTerm` | /buy/coverage | 1 |
| rdoSurcharge('50', 'yes' / 'no') | `#surcharge_50_yes` · `#surcharge_50_no` | /buy/coverage-2 | 1 each |
| lblSummaryProgram | `//dl[dt[normalize-space()='Program' or normalize-space()='Programme']]/dd` | /buy/summary (EN and FR) | 1 |
| blkSummarySurcharge | `//dl[dt[normalize-space()='Surcharge']]` | /buy/summary | 1 |
| lblSummaryTotal | `//tr[td[normalize-space()='Total' …]]/td[last()]` | /buy/summary | 1 |

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/common/BuyOnlinePage.ts | new page object — buy-online steps 1–4 (no locator for the terms box or "Continue with payment", on purpose) |
| playwright-automation/src/flows/BuyOnlineFlow.ts | new flow — open (EN/FR), vehicle, Client Info, coverage, surcharge, summary; all assertions |
| playwright-automation/src/tests/client/buyOnline_AP2377.spec.ts | new spec, tag @AP-2377 (and @client), Dev only |

No existing file was changed. The QA's uncommitted AdminFlow.ts, DealerFlow.ts, pages/*/index.ts, test-fixtures.ts and every other already-changed file are untouched; the new classes are imported by path and the spec uses only Playwright's built-in `page` fixture (no login).

## Run
Command: `npx playwright test --project=chromium --grep @AP-2377` (run as `BASE_URL=https://v2dev.garantieavantageplus.ca npx playwright test --project=chromium --grep @AP-2377` so it can only hit Dev)
Lint: pass · Run: 7 passed, 0 fixme, 35.0 s · `--repeat-each=2`: 14 passed, 0 failed, 1.1 min, no flaky tests (run twice — before and after the R5 adjustment). Never run against staging.
Reviewer R5 (inline): APPROVE, 0 blocker · 0 major · 2 minor (unused Dev message constant kept for Q-004; the "no OUI" check cannot catch AP-2511 because it covers the No case only) — qa-artifacts/7-reviews/AP-2377_review.md.

Test data each run leaves on Dev (v2dev): 7 new purchase sessions with unique `client.stage.<timestamp>@yopmail.com` emails and last names `QA-AP2377-<timestamp>` — 001 stops at the vehicle step; 002, 003 and 005 open Client Info; 007 submits Client Info (refused); 006 reaches Coverage; 009 reaches the summary with the surcharge answered No. Nothing is paid. Whether the portal saves a client or quote record before payment is not known (no `cleanup` source). Locator discovery for this report left one more session on Dev (`client.stage.941@yopmail.com`, "Client Stage 941", reached the summary with No).

## Pull request
PR skipped: gh CLI not installed (--no-pr). No branch, worktree or commit was made.

## Not passing
None.

# Automation Report — AP-2410
Date: 2026-11-08 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md
Spec: playwright-automation/src/tests/dealer/chubbInsuranceQuote_AP2410.spec.ts · Tag: @AP-2410
Result: 4 of 4 PASSED cases automated — 4 passing, 0 fixme

## Summary
All four AP-2410 re-test cases now run automatically on Dev. The tests get a Chubb creditor insurance quote on the
quote insurance page with PM30 / English, with PM50 / Français, and with the reported replay (Tax exempt Yes, Critical
illness for the Co borrower, Disability for Both). Each test checks that the quote saves with no "HTTP" or
"years old" error and that the Creditors insurance row details show the saved quote. A fourth test prices the
Insurance Quick Quote.
The tests do not create a quote. They reuse quote 6696, which the manual run left on Dev, so the setup parts of
AP2410_001 step 1 (create the quote and its financing) and AP2410_004 step 1 (add the co-applicant) are replaced by
read-only checks that the quote and its co-applicant are still there.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2410_001 | Getting a Chubb insurance quote with every required option filled and rate table PM30 saves without an error | automated — passing | Step 1 setup (new client quote + financing) replaced by a read-only check of quote 6696, so no quote is created per run |
| AP2410_002 | Getting a Chubb insurance quote in French with rate table PM50 saves without an error | automated — passing | Reopened-form Form value not asserted (open bug AP-2557) |
| AP2410_003 | Insurance Quick Quote with rate table PM30 shows priced results without an error | automated — passing | — |
| AP2410_004 | Replaying the reported inputs (Tax exempt Yes, co-borrower and Both coverage) no longer returns "Debtor is -1 years old" | automated — passing | Step 1 "Add co-applicant" replaced by a check that every "For" drop-down offers Co borrower and Both, which only happens once the co-applicant exists. The co-applicant contact block is not asserted (open bug AP-2558) |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() | reused |
| 001, 002, 004 | 1 | ChubbInsuranceQuoteFlow.verifyQuoteOfRecord() — QuoteProductSummaryPage.lblHeading, row('creditors') | new (flow) / reused (locators) |
| 001, 002, 004 | 2 | ChubbInsuranceQuoteFlow.openInsurancePage() — ChubbInsuranceQuotePage.lblFinancingBlock, frmChubb; QuoteProductSummaryPage.btnChubbGetQuote, lblAlerts | new / reused |
| 001 | 2 | ChubbInsuranceQuoteFlow.verifyFormOptions() — QuoteProductSummaryPage.selChubbForm (values asserted, labels recorded as an annotation) | new / reused |
| 004 | 1, 3 | ChubbInsuranceQuoteFlow.verifyCoBorrowerOffered() — ChubbInsuranceQuotePage.selFor() | new |
| 001, 002, 004 | 3 | ChubbInsuranceQuoteFlow.fillQuote() — QuoteProductSummaryPage.selChubbLanguage / selChubbTaxExempt / selChubbForm; ChubbInsuranceQuotePage.selType() / txtTerm() / selFor() / lblInvalidField | new / reused |
| 001, 002, 004 | 4 | ChubbInsuranceQuoteFlow.getQuote() — QuoteProductSummaryPage.btnChubbGetQuote, alertWithText() | new / reused |
| 001, 002, 004 | 5 | ChubbInsuranceQuoteFlow.verifySavedOnDetails() — QuoteProductSummaryPage.rowAmount('creditors'); ChubbInsuranceQuotePage.btnCreditorsChevron, pnlCreditorsDetails, rowsCreditorsCoverage | new |
| 001, 002, 004 | 5 | ChubbInsuranceQuoteFlow.verifyReopenedForm() — Language, Tax exempt (and the three coverages for 004); Form not checked (AP-2557) | new |
| 003 | 1 | ChubbInsuranceQuoteFlow.openQuickQuote() — ChubbInsuranceQuotePage.frmQuick, selQuickForm, tblQuickResults | new |
| 003 | 2–3 | ChubbInsuranceQuoteFlow.fillQuickQuote() — ChubbInsuranceQuotePage.txtQuick*, quickType(), quickTerm() | new |
| 003 | 4–5 | ChubbInsuranceQuoteFlow.getQuickQuoteAndVerifyPriced() — btnQuickGetQuote, tblQuickResults, rowsQuickCoverage | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| frmChubb | `form[name="quote_financing_insurance_chubb"]` | /quote/6696/insurance | 1 |
| lblFinancingBlock | `form[name="quote_financing"]` | /quote/6696/insurance | 1 |
| selType('criticalIllness') | `#quote_financing_insurance_chubb_criticalIllnessType` | /quote/6696/insurance | 1 |
| txtTerm('criticalIllness') | `#quote_financing_insurance_chubb_criticalIllnessTerm` | /quote/6696/insurance | 1 |
| selFor('criticalIllness') | `#quote_financing_insurance_chubb_criticalIllnessFor` | /quote/6696/insurance | 1 |
| selType('disability') | `#quote_financing_insurance_chubb_disabilityType` | /quote/6696/insurance | 1 |
| txtTerm('disability') | `#quote_financing_insurance_chubb_disabilityTerm` | /quote/6696/insurance | 1 |
| selFor('disability') | `#quote_financing_insurance_chubb_disabilityFor` | /quote/6696/insurance | 1 |
| selType('life') / txtTerm('life') / selFor('life') | `#quote_financing_insurance_chubb_life{Type,Term,For}` (same ids as the reused QuoteProductSummaryPage fields) | /quote/6696/insurance | 1 each |
| btnCreditorsChevron | `button[data-target="#chubbDetails"]` | /quote/6696/details | 1 |
| pnlCreditorsDetails | `#chubbDetails` | /quote/6696/details | 1 |
| rowsCreditorsCoverage | `#chubbDetails table` (first) `tbody tr` | /quote/6696/details | 1 table (3 rows on the 004 state) |
| frmQuick | `form[name="quick_insurance_chubb"]` | /quick-insurance-quote | 1 |
| selQuickForm | `#quick_insurance_chubb_form` | /quick-insurance-quote | 1 |
| txtQuickBorrowerDob | `#quick_insurance_chubb_borrowerDOB` | /quick-insurance-quote | 1 |
| txtQuickMonthlyPayment | `#quick_insurance_chubb_monthlyPayment` | /quick-insurance-quote | 1 |
| txtQuickTermMonths | `#quick_insurance_chubb_termMonths` | /quick-insurance-quote | 1 |
| txtQuickResidual | `#quick_insurance_chubb_residualAmount` | /quick-insurance-quote | 1 |
| quickType() / quickTerm() | `#quick_insurance_chubb_{life,criticalIllness,disability}{Type,Term}` | /quick-insurance-quote | 1 each |
| btnQuickGetQuote | `form[name="quick_insurance_chubb"] button[type="submit"]` | /quick-insurance-quote | 1 |
| tblQuickResults | `main table` | /quick-insurance-quote (after Get Quote) | 2 (the two result tables) |

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/ChubbInsuranceQuotePage.ts | new page object: Critical illness / Disability fields, the Creditors insurance row chevron details, the Insurance Quick Quote form and results |
| playwright-automation/src/flows/ChubbInsuranceQuoteFlow.ts | new flow: verifyQuoteOfRecord, openInsurancePage, verifyFormOptions, verifyCoBorrowerOffered, fillQuote, getQuote, verifySavedOnDetails, verifyReopenedForm, openQuickQuote, fillQuickQuote, getQuickQuoteAndVerifyPriced |
| playwright-automation/src/tests/dealer/chubbInsuranceQuote_AP2410.spec.ts | new spec, 4 tests, tag @AP-2410, skipped unless BASE_URL and DEALER_PORTAL_URL point at v2dev |

No existing file was changed. The fixtures, index.ts and the QA's uncommitted files are untouched.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2410`
Lint: pass · Run: 4 passed, 0 fixme, 49.1 s (run 1) and 43.8 s (run 2), on Dev (v2dev), one worker, no flaky test

## Test data left on Dev
Each run re-saves the Chubb creditor insurance quote of quote 6696 three times: PM30 / English, then PM50 / Français,
then the AP2410_004 replay. Tests run in file order, so after every full run the saved quote is the same one the
manual run left: PM30, English, Tax exempt Yes, Life Decreasing Borrower, Critical illness Decreasing Co borrower,
Disability 30D_RETRO Both, term 12, about CA$150.92 /m. No quote, client, financing, co-applicant or contract is
created, and vehicle 915 is never edited. The quick quote (AP2410_003) stores nothing that is known.
If AP2410_004 alone is skipped or fails, the saved quote stays at whatever the last test saved.

## Pull request
PR skipped: vcs not available (gh not logged in); R5 review runs next (`--review external --no-pr`)

## Not passing
None.

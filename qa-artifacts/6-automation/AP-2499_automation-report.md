# Automation Report — AP-2499
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/gapCreditorsFinancingForm_AP2499.spec.ts · Tag: @AP-2499
Result: 5 of 5 PASSED cases automated — 5 passing, 0 fixme

## Summary
The five AP-2499 cases that passed manually on Dev (v2dev) now run automatically: the GAP and creditors add windows on a quote with no financing show the empty financing form instead of the "Please add a financing" alert (AP2499_001, 002), and the embedded financing form refuses empty, missing or invalid values and stores nothing (AP2499_010, 011, 012). The five failing cases (003, 004, 006, 007, 008 — bugs AP-2526, AP-2527, AP-2528) and the three blocked ones (005, 009, 013) have no confirmed behaviour to assert and were not automated. The suite skips itself unless the dealer portal URL points at v2dev, the environment the cases passed on.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2499_001 | GAP modal on a quote with no financing shows the financing form, not the alert | automated — passing | — |
| AP2499_002 | Creditors modal on a quote with no financing shows the financing form, not the alert | automated — passing | — |
| AP2499_003 | Financing submitted in the GAP modal is saved and the modal moves on | not selected | FAIL manually (AP-2526) |
| AP2499_004 | Creditors modal on a quote with a financing shows the stored values | not selected | FAIL manually (AP-2526) |
| AP2499_005 | GAP modal on a financing with no residual does not invent a residual | not selected | BLOCKED manually (Q-011) |
| AP2499_006 | Correcting the base amount in the creditors modal saves the new amount | not selected | FAIL manually (AP-2527) |
| AP2499_007 | Creditors quote result shows below the form in the same modal | not selected | FAIL manually (AP-2528) |
| AP2499_008 | GAP quote result shows below the form in the same modal | not selected | FAIL manually (AP-2528) |
| AP2499_009 | A failed insurance quote shows an error and keeps the values | not selected | BLOCKED manually (Q-007) |
| AP2499_010 | An empty financing form shows field errors and saves nothing | automated — passing | — |
| AP2499_011 | Text base amount and negative rate leave the stored financing unchanged | automated — passing | — |
| AP2499_012 | Empty residual and date of birth do not store invented values | automated — passing | — |
| AP2499_013 | Humania dealer: financing form above the insurance form | not selected | BLOCKED manually (Q-002) |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2499_001 | 1 | DealerFlow.loginToDealerPortal() · GapCreditorsFinancingFlow.createQuote() → QuoteCancelProductFlow.createQuoteFromVehicle('915', …) | reused (new wrapper) |
| AP2499_001 | 2 | GapCreditorsFinancingFlow.openInsuranceModal('gap') → QuoteProductSummaryPage.clickRowAdd('gap') | new flow method, reused POM |
| AP2499_001 | 3 | GapCreditorsFinancingFlow.verifyEmptyFinancingFormFirst('gap') — reuses QuoteProductSummaryPage.txtFinancing* / selFinancing* / btnFinancingSave | new |
| AP2499_002 | 1–2 | createQuote() · openInsuranceModal('creditors') | new |
| AP2499_002 | 3 | GapCreditorsFinancingFlow.verifyInsuranceRouteShowsFinancingForm() | new |
| AP2499_002 | 4 | verifyEmptyFinancingFormFirst('creditors') (read live, instead of from a screenshot) | new |
| AP2499_010 | 1–2 | createQuote() · openInsuranceModal('gap') · verifyTextFieldsEmptyExcept([]) | new |
| AP2499_010 | 3 | submitFinancing({ dateOfBirth }) · verifyFieldErrors(7 fields, "This value should not be blank.") · verifyStillOnFinancingStep() | new |
| AP2499_010 | 4–5 | reloadQuote() → QuoteCancelProductFlow.reloadQuoteDetails() · verifyNothingStored() | reused · new |
| AP2499_011 | 1 | createQuote() · addFinancing() → QuoteCancelProductFlow.addFinancing() (25,000 / 60 / 6.99 %) | reused |
| AP2499_011 | 2–3 | openInsuranceModal('creditors') · submitFinancing({ termMonths 72, baseAmount abc, interestRate -5 }) (expands Edit first) · verifyFieldErrors(['baseAmount'], "This value is not valid.") | new |
| AP2499_011 | 4–5 | reloadQuote() · verifyFinancingUnchanged() | reused · new |
| AP2499_012 | 1–3 | createQuote() · openInsuranceModal('gap') · submitFinancing(F1 without residual and date of birth) · verifyFieldErrors(['residualAmount']) · verifyStillOnFinancingStep() | new |
| AP2499_012 | 4–5 | reloadQuote() · verifyNothingStored() · openInsuranceModal('gap') · verifyResidualAndDateOfBirthEmpty() | new |

Record-only points (Q-004 drop-down opening state, Q-011 no error under date of birth) are recorded as annotations or left unasserted, as in the manual cases.

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| frmFinancing | `#myModal.show form[name="quote_financing"]` | GAP modal, quote 6542 · creditors modal, quote 6543 | 1 |
| lblFinancingHeading | `#myModal.show h4` with text "Financing" | GAP modal, quote 6542 | 1 |
| btnFinancingEdit | `form[name="quote_financing"] button[data-toggle="collapse"]` (in the modal) | creditors modal, quote 6543 | 1 |
| pnlFinancingFields | `form[name="quote_financing"] .collapse` (in the modal; `#gapFinancingForm` / `#creditorFinancingForm`) | GAP 6542 · creditors 6543 | 1 |
| frmGapInsurance | `#myModal.show form[name="quote_financing_insurance_gap"]` | GAP modal, quote 6542 | 0 before a financing (asserted absent) |
| frmCreditorInsurance | `#myModal.show form[name="quote_financing_insurance_chubb"]` | creditors modal, quote 6543 | 1 |
| fieldError(field) | `#myModal.show label[for="quote_financing_<field>"] .form-error-message` | GAP modal, quote 6542, after a refused Save | 1 per field (7 fields checked) |
| cardFinancing | `.card` that has an `h3` with text exactly "Financing" | /quote/6543/details | 1 |
| frmFinancingOnPage / txtBaseAmountOnPage | `form[name="quote_financing"]` · `#quote_financing_baseAmount` | /quote/6534/insurance opened as a page | 1 · 1 |
| field(field) | `#myModal.show #quote_financing_<field>` | GAP modal, quote 6542 | 1 |

Reused unchanged: QuoteProductSummaryPage.txtFinancingDateOfBirth, selFinancingType, txtFinancingBaseAmount, txtFinancingResidual, selFinancingFrequency, selFinancingTerm, txtFinancingInterest, selFinancingCompany, btnFinancingSave (each counted 1 in the GAP modal of quote 6542), rowAmount(), clickRowAdd(), lblErrorText.

## Files changed
| File | Change |
|---|---|
| src/pages/dealerPortal/GapCreditorsFinancingModal.ts | new — modal financing form, Edit toggle, field errors, insurance forms, Financing card, /insurance page form |
| src/flows/GapCreditorsFinancingFlow.ts | new — openInsuranceModal, submitFinancing, reloadQuote, verify* steps |
| src/tests/dealer/gapCreditorsFinancingForm_AP2499.spec.ts | new — 5 tests, `@dealer @AP-2499` |

No existing file was changed. The QA's uncommitted files (AdminFlow.ts, DealerFlow.ts, index.ts, test-fixtures.ts and every other already-changed file) were left untouched; the new page object is not exported from `src/pages/dealerPortal/index.ts` and not registered as a fixture — the spec builds the flow from `page`.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2499`
Lint: pass · Run: 5 passed, 0 fixme, 1.8 min — twice (s8 run and R5 re-run), one worker, on Dev (v2dev)

Test data written to Dev by the two runs: 10 quotes on vehicle 915 (clients `qa.ap2499.<tc>.<stamp>@yopmail.com`, last names `Auto2499-<tc>-<stamp>`; the first run's stamps are 1793579552214 (001), …569544 (002), …588082 (010), …608816 (011), …636155 (012)) and 2 financings (25,000 / 60 months / 6.99 %, on the two AP2499_011 quotes). Every financing Save in the modal was refused; "Get Quote" is never pressed, so no GAP or Chubb request was made. Dealers cannot delete quotes, so each run adds five.

## Pull request
PR skipped: gh CLI not installed (worker instruction; run with --no-pr).

## Not passing
None.

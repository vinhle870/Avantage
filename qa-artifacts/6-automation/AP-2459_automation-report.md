# Automation Report — AP-2459
Date: 2026-11-08 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2459_2026-11-08.md
Spec: playwright-automation/src/tests/dealer/permaplateFinancingCompany_AP2459.spec.ts · Tag: @AP-2459
Result: 2 of 2 PASSED cases automated — 2 passing, 0 fixme

## Summary
Both cases that passed manually on Dev are now automated. AP2459_001 checks the bug itself: on quote 6689, which the manual run left with an Esthetic protection selection and no contract, the spec leaves "Financing company" on "Choose" and clicks Generate Contract. It then checks that the server does not return a 5xx error and that the form comes back with "This value should not be blank." beside that field only. It also checks that no contract row appears. This is read-only, because the server refuses the form. AP2459_002 builds a new quote on vehicle 915, chooses "AutoCapital Canada" and generates the contract. It then checks the success alert, the contract number, the contract list row and the invoice. This case exists to test that a contract is created, so **every run leaves a quote, a contract and an unpaid invoice on Dev that cannot be deleted**. AP2459_003 was SKIPPED manually, so it is not automated. The review is done externally (R5 by the orchestrator's qa-reviewer). No PR was opened.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2459_001 | Generating an Esthetic protection contract with no financing company chosen no longer shows a server error page | automated — passing | Asserts branch (b), the branch the build chose on 2026-11-08; read-only on fixed quote 6689 |
| AP2459_002 | Generating an Esthetic protection contract with a financing company chosen still succeeds and lists the contract | automated — passing | Creates a quote, contract and invoice per run (the case exists to test that) |
| AP2459_003 | The PDF of a contract created with no financing company downloads without a server error | not selected | SKIPPED manually by its own step 2 rule — no confirmed behaviour to assert; the PDF route also hits open bug AP-2512 |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2459_001 | 1 | Admin product-link check ("10 ans" on dealer 1380) — not automated as a step. The guard `PermaplateContractFlow.verifyQuoteHasSelectionWithoutContract()` proves that quote 6689 still carries the selection | reused |
| AP2459_001 | 2–3 | Quote 6689 from the manual run (client, vehicle step, Permaplate selection already saved) + `DealerFlow.loginToDealerPortal()`, `PermaplateContractFlow.openQuoteDetails()` | reused |
| AP2459_001 | 4 | `PermaplateFinancingFlow.openContractFormFromRowMenu()` (uses `PermaplateContractPage.openRowMenu/clickGenerateContractMenuItem`) · `PermaplateFinancingFlow.submitBlankFinancingCompany()` | new flow, reused page members |
| AP2459_001 | 5 | `PermaplateFinancingFlow.verifyBlankFinancingCompanyRefused()` | new |
| AP2459_002 | 1 | Skipped as the case allows (product link already present; the Permaplate step fails if "10 ans" is not offered) | — |
| AP2459_002 | 2 | `QuoteCancelProductFlow.createQuoteFromVehicle('915', client, '2026-11-01', '25000')` — `/quote/new/client?fromVehicleId=915`, client form, vehicle step | reused |
| AP2459_002 | 3 | `PermaplateFinancingFlow.selectPermaplate()` → `PermaplateFinancingPage.selectTermAndOption()`, `savePermaplateQuote()` | new |
| AP2459_002 | 4 | `PermaplateFinancingFlow.openContractFormFromRowMenu()` · `generateContractWithFinancingCompany()` | new |
| AP2459_002 | 5 | `PermaplateFinancingFlow.verifyContractAndInvoiceListed()` | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| frmPermaplateQuote | `#permaplateQuoteForm` | /quote/6689/permaplate | 1 |
| btnPermaplateQuoteSave | `#permaplateQuoteForm button[type="submit"]` | /quote/6689/permaplate | 1 |
| lblTerm('10 ans') | `#permaplateQuoteForm .custom-radio label` filtered by "10 ans" | /quote/6689/permaplate | 1 |
| lblOption('Antirouille – Rust+Sound (combo)') | `#permaplateQuoteForm .custom-checkbox label` filtered by option name | /quote/6689/permaplate | 1 |
| lblFinancingCompany | `xpath=//dt[normalize-space()="Financing company"]` | /quote/6689/permaplate-create-contract | 1 |
| selFinancingCompany | `#permaplate_contract_financingInformation_financingCompany` (hidden by bootstrap-select; set with `selectOption(…, { force: true })`) | /quote/6689/permaplate-create-contract | 1 |
| lblFinancingCompanyError | `dd:has(#permaplate_contract_financingInformation_financingCompany) .form-error-message` | /quote/6689/permaplate-create-contract after the blank submit | 1 |
| lblAllFieldErrors | `form[name="permaplate_contract"] .form-error-message` | same, after the blank submit | 1 |
| lnkContractNumber(id) | `a[href="/quote/{id}/permaplate-contract"]` | /quote/6690/details | 1 |
| contractListRow(id) | `tbody tr:has(a[href="/quote/{id}/permaplate-contract-download"])` | /permaplate-contracts (quote 6690) | 1 |
| invoiceListRow(n) | `tr[data-href="/invoice/{n}"]` | /invoice (invoice 945) | 1 |
| lblAlerts / lblServerErrorPage | `.alert` filtered by text · `body` with text /difficultés techniques\|HTTP 500/ | quote hub / contract form | — (filters, asserted 0 or 1) |

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/PermaplateFinancingPage.ts | new page object: Permaplate Quote step, Financing company field and its error, alerts, contract number link, contract and invoice list rows |
| playwright-automation/src/flows/PermaplateFinancingFlow.ts | new flow: selectPermaplate, openContractFormFromRowMenu, submitBlankFinancingCompany, verifyBlankFinancingCompanyRefused, generateContractWithFinancingCompany, verifyContractAndInvoiceListed |
| playwright-automation/src/tests/dealer/permaplateFinancingCompany_AP2459.spec.ts | new spec, 2 tests, skips itself unless the base URL is v2dev |

No existing file in `playwright-automation/` was changed. The spec reuses these files without editing them: `DealerFlow.loginToDealerPortal()`, `PermaplateContractFlow` and `PermaplateContractPage` (AP-2428), and `QuoteCancelProductFlow.createQuoteFromVehicle()` (AP-2493). `src/pages/dealerPortal/index.ts` was not edited. The other Permaplate page objects are not exported there either.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2459`
Lint: pass (`npm run lint`, tsc --noEmit) · Run: 2 passed, 0 fixme, 38.7 s (run 1) and 36.8 s (run 2), two separate runs, one worker. No flaky test. AP2459_002 also passed once on its own before the two full runs, and AP2459_001 passed once on its own.
The POST of the blank form returned HTTP 200 in both runs.

### Left on Dev by the automation runs (cannot be deleted)
| Run | Quote | Client | Contract | Invoice |
|---|---|---|---|---|
| single AP2459_002 debug run | not captured (created just before 6698) | Perma Finance2459-1794109558566 | PNA-0000000023 | 947 (Payment pending) |
| full run 1 | 6698 | Perma Finance2459-1794109608724 | PNA-0000000024 | 948 (Payment pending) |
| full run 2 | 6699 | Perma Finance2459-1794109649974 | PNA-0000000025 | 949 (Payment pending) |

All three are on vehicle 915 with financing company AutoCapital Canada, Esthetic protection "10 ans" + Antirouille ($80, invoice $91.98). Each later run of AP2459_002 (including the R5 re-run) adds one more quote, contract and unpaid invoice. Its "Left on Dev" annotation names them. AP2459_001 creates nothing (two refused submits per run on quote 6689). Vehicle 915 was never edited.

## Pull request
PR skipped: vcs not available (gh not logged in); run with `--review external --no-pr` — R5 is run by the orchestrator's qa-reviewer.

## Not passing
None.

Points for the reviewer:
- AP2459_001 asserts branch (b), the refusal. The ticket accepted either branch, and the build chose (b) on 2026-11-08. If the product later decides that a blank financing company should be accepted (branch (a)), this test will fail and will create one contract on quote 6689.
- AP2459_001 depends on quote 6689 keeping its Permaplate selection with no contract. The guard fails with a message naming the fix (pick another Dev quote with a selection and no contract).
- The contract PDF link is only counted, never opened (AP-2512 returns HTTP 500).

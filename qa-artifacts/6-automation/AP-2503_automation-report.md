# Automation Report — AP-2503
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/warrantyGenerateContract_AP2503.spec.ts · Tag: @AP-2503
Result: 4 of 7 PASSED cases automated — 3 passing, 1 fixme

## Summary
The new extended-warranty "Generate Contract" page is now checked automatically on Dev: that the menu item opens a full page at the unchanged address (AP2503_001), the two-column layout with the PDF preview (AP2503_002), and the owner/VIN pre-fill on a quote without financing (AP2503_010). Every test is read-only on Dev quote 6557 and creates nothing. AP2503_008 (emptied last name) is written but marked fixme: in the Playwright runner the click posts the form instead of the browser's check refusing it (the request is aborted, so nothing was created) — this contradicts the manual result and needs a look. AP2503_004, _006 and _009 are not automated, because each would need a new contract (which cannot be deleted) or a quote that no longer exists in the right state.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2503_001 | Clicking "Generate Contract" on the extended warranty opens its own page at the unchanged address, not a pop-up | automated — passing | Read-only on quote 6557 (the vehicle/quote precondition is replaced by the fixed quote and a guard) |
| AP2503_002 | Owner and financing details on the left; summary, PDF preview and button on the right | automated — passing | Column checks by left edge (not absolute pixels) |
| AP2503_004 | The page is pre-filled with the quote's client, vehicle and financing values | not selected | Needs a quote with a financing and no contract; quote 6558 now has contract APOP01-845, and making a new one each run writes a vehicle, quote and financing on Dev |
| AP2503_006 | Submitting with the pre-filled values creates the contract | manual-only | Each run would create a warranty contract and an invoice on Dev, which cannot be deleted |
| AP2503_008 | Submitting with the last name emptied does not crash the page or lose values | automated — fixme | The runner posts the invalid form (see Not passing) |
| AP2503_009 | Submitting with a start date before the delivery date does not crash the page | manual-only | Each run would create a warranty contract and an invoice on Dev, which cannot be deleted |
| AP2503_010 | The page opens for a quote with no financing and pre-fills owner and vehicle | automated — passing | Read-only on quote 6557 |
| AP2503_003, _005, _007 | — | not selected | FAILED manually (AP-2530, AP-2531, AP-2532) — no confirmed behaviour to assert |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2503_001 | 1–2 | fixed quote 6557 + WarrantyGenerateContractFlow.verifyQuoteHasWarrantyWithoutContract() | new |
| AP2503_001 | login | DealerFlow.loginToDealerPortal() (fixture `dealerUser`) | reused |
| AP2503_001 | 3 | WarrantyGenerateContractFlow.openGenerateContractFromRowMenu() | new |
| AP2503_001 | 4 | openQuoteDetails() + openGenerateContractPage() (HTTP 200, same address) | new |
| AP2503_001 | 5 | verifyFullPageWithSummaryAndButton() | new |
| AP2503_002 | 1–2 | verifyQuoteHasWarrantyWithoutContract() + openGenerateContractPage() | new |
| AP2503_002 | 3 | verifyLeftColumn() | new |
| AP2503_002 | 4 | verifyRightColumn() | new |
| AP2503_008 | 2–3 | submitWithEmptyLastName() (POSTs aborted) | new |
| AP2503_008 | 4 | verifyEmptyLastNameRefused() (+ quote still without contract) | new |
| AP2503_010 | 1–2 | verifyQuoteHasWarrantyWithoutContract() + openGenerateContractPage() | new |
| AP2503_010 | 3 | verifyPrefillWithoutFinancing() | new |

## New locators
All verified on `https://v2dev.garantieavantageplus.ca/quote/6557/warranty/generate-contract` (or `/quote/6557/details`) on 2026-11-02 with a match count of 1.

| Name | Expression | Page | Count |
|---|---|---|---|
| lblHeading | `h1` ("Extended Warranty Contract") | generate-contract | 1 |
| frmContract | `form[name="warranty_finalize"]` | generate-contract | 1 |
| lblVehicleSection / lblOwnerSection / lblFinancingSection | `//h4[normalize-space()="Vehicle identification" / "Owner information" / "Financing information"]` | generate-contract | 1 each |
| lblProgramSummary | `//h3[normalize-space()="Program Summary"]` | generate-contract | 1 |
| btnGenerateContract | `#warranty_finalize_save` | generate-contract | 1 |
| embedPdfPreview | `embed` (src `/quote/6557/warranty/pdf#pagemode=none&navpanes=0`) | generate-contract | 1 |
| lnkOpenPdf(q) | `a[href="/quote/{q}/warranty/pdf"]` | generate-contract | 1 |
| lnkBack(q) | `a[href="/quote/{q}/details"]` | generate-contract | 1 |
| txtVehicleVin, txtClientFirstName, txtClientLastName, txtClientCity, txtClientPostalCode | `#warranty_finalize_vehicleVIN`, `#warranty_finalize_clientFirstName`, `…_clientLastName`, `…_clientCity`, `…_clientPostalCode` | generate-contract | 1 each |
| ddlFinancingCompany | `#warranty_finalize_financingCompany` (option `39` = AutoCapital Canada) | generate-contract | 1 |
| txtFinancingCompany* (6) | `#warranty_finalize_financingCompanyName/Phone/Address/City/Province/PostalCode` | generate-contract | 1 each |
| txtStartDate, txtSalePrice | `#warranty_finalize_dateStart`, `#warranty_finalize_salePrice` | generate-contract | 1 each |
| lnkGenerateContract(q) | `a[href="/quote/{q}/warranty/generate-contract"]` | quote details | 1 |
| rowExtendedWarranty(q) / btnRowMenu(q) | `tr:has(a[href="/quote/{q}/warranty/generate-contract"])` / `… button[data-toggle="dropdown"]` | quote details | 1 / 1 |

## Files changed
All new files; no existing file in `playwright-automation/` was modified (the QA's uncommitted AdminFlow.ts, DealerFlow.ts, index.ts and test-fixtures.ts are untouched; the page object is imported by path, not through `index.ts`).

| File | Change |
|---|---|
| src/pages/dealerPortal/WarrantyGenerateContractPage.ts | new page object for `/quote/{id}/warranty/generate-contract` and the Extended warranty row menu |
| src/flows/WarrantyGenerateContractFlow.ts | new flow: open page / row menu, layout, pre-fill and empty-last-name checks, with POST abort safety net |
| src/tests/dealer/warrantyGenerateContract_AP2503.spec.ts | new spec, `@dealer @AP-2503`, 4 tests (1 fixme); skips itself off v2dev |

## Run
Command: `npx playwright test --project=chromium --grep @AP-2503`
Lint: pass · Run: 3 passed, 1 fixme, ~25–30 s (twice), and `--repeat-each=2`: 6 passed, 2 skipped (fixme), no flaky tests

Reviewer R5 (inline, round 1): APPROVE — 0 blocker, 0 major, 2 minor: (1) the tests use the fixed quote 6557 instead of unique data per run — by design, so no contract or quote is created; a guard fails clearly if the quote ever gets a contract; (2) AP2503_008 is fixme.

## Pull request
PR skipped: gh CLI not installed (run with --no-pr).

## Not passing
- **AP2503_008 — fixme.** Error: after emptying the last name (and picking AutoCapital Canada, as the manual run did) and clicking "Generate Contract", the expected browser refusal did not happen: the form was posted (`POST /quote/6557/warranty/generate-contract` with `warranty_finalize[clientLastName]=""`), and the test's safety net aborted it, so no contract was created (quote 6557 still offers Generate Contract afterwards). Tried: (1) the manual order — empty the last name first, then pick the company; (2) diagnostics — the form reports `checkValidity() = false`, `noValidate = false`, the button has no `formnovalidate`, and the POST is still sent, headless and headed, even with no company picked (six empty required financing fields). The manual run in the Playwright MCP browser saw the browser refuse the same form (AP2503_007 step 3, AP2503_008 step 3). Check next: whether `page.route` interception or a native (non-jQuery) click listener lets the invalid form through in the runner, by watching the request in a browser where submits are safe (for example on a quote whose contract may be created). Until that is known, the manual results for AP2503_007 step 3 and AP2503_008 step 3 rest on the MCP browser only.

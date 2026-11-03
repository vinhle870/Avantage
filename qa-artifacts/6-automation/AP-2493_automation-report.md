# Automation Report — AP-2493
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/cancelQuoteProduct_AP2493.spec.ts · Tag: @AP-2493
Result: 12 of 12 PASSED cases automated — 12 passing, 0 fixme

## Summary
Every test case that passed manually on Dev (v2dev) is now automated: the Delete action on each of the five products, the absence of Delete on a product with a contract, declining and dismissing the confirmation window, confirming a cancellation (product gone, "+" back, Subtotal lowered), re-adding a warranty after a cancellation, opening an archived quote, and cancelling GAP while the creditor insurance stays. AP2493_011 and AP2493_012 are not automated because they failed manually (bug AP-2516 — the Subtotal never includes the Permaplate cost), so there is no confirmed behaviour to assert. The suite runs on Dev only and skips itself on any other environment.

**What each run leaves on Dev.** Nine tests only read Dev quotes left by the manual run (6461–6466 and archived 6245) and confirm nothing on them; AP2493_007 and _008 only decline or dismiss the confirmation window. Three tests write: each run creates three new quotes for vehicle 915, each with a new client `qa.ap2493.<tc>.<timestamp>@yopmail.com` — AP2493_009 (warranty 1,500 added, then cancelled), AP2493_010 (warranty 1,500 added, cancelled, then a warranty 1,800 added) and AP2493_014 (financing, GAP and a creditor insurance quote, no contract, then the GAP cancelled). No contract is ever generated. Dev quotes cannot be deleted.

The automation runs on 2026-11-02 created **quotes 6470–6478** on Dev (three runs: 6470 = AP2493_009 during development; 6471, 6472 = AP2493_010 and _014 during development; 6473–6478 = the two repetitions of the review run).

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2493_001 | An extended warranty with no contract shows a cancel action on the quote details page | automated — passing | Reads quote 6461 |
| AP2493_002 | A Roadside Protection product with no contract shows a cancel action on the quote details page | automated — passing | Reads quote 6462 |
| AP2493_003 | An Esthetic protection (Permaplate) product with no contract shows a cancel action on the quote details page | automated — passing | Reads quote 6463 |
| AP2493_004 | A creditor insurance product quoted but without a contract shows a cancel action on the quote details page | automated — passing | Reads quote 6464 |
| AP2493_005 | A GAP insurance product quoted but without a contract shows a cancel action on the quote details page | automated — passing | Reads quote 6465 |
| AP2493_006 | A creditor insurance product with a generated contract shows no cancel action and keeps its Download link | automated — passing | Reads quote 6466 (contract AVP000169); generates no contract |
| AP2493_007 | Choosing cancel opens a confirmation modal, and declining it leaves the warranty on the quote unchanged | automated — passing | Quote 6461; only "No" is clicked |
| AP2493_008 | Closing the confirmation modal without answering leaves the warranty on the quote unchanged | automated — passing | Quote 6461; Escape and a click outside |
| AP2493_009 | Confirming the cancellation removes the warranty, brings back the add action and lowers the Subtotal by its amount | automated — passing | Creates its own quote each run |
| AP2493_010 | After a warranty is cancelled, adding a new warranty creates a new row with the new term and amount | automated — passing | Creates its own quote each run (does its own cancel instead of depending on AP2493_009) |
| AP2493_011 | Cancelling the Permaplate product on a quote that also has a warranty leaves the warranty untouched and lowers the Subtotal | not selected | FAILED manually — bug AP-2516 |
| AP2493_012 | After a Permaplate product is cancelled, adding Permaplate again creates a new row with the new option | not selected | FAILED manually — bug AP-2516 |
| AP2493_013 | Opening an archived quote with a product does not show an error, and whether a cancel action is offered is recorded | automated — passing | Reads archived quote 6245; Delete offered is recorded (Q-004), not judged |
| AP2493_014 | Cancelling a GAP product removes it and leaves the creditor insurance product on the same quote in place | automated — passing | Creates its own quote each run; creditor premium change recorded (Q-007), not judged |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() (via the `dealerUser` fixture) | reused |
| AP2493_001–005 | 1–2 | QuoteCancelProductFlow.openQuoteDetails() + verifyProductActive() on the quote the manual run left | new |
| AP2493_001–005 | 3–4 | QuoteCancelProductFlow.verifyDeleteOffered(quoteId, product) | new |
| AP2493_006 | 1–2 | openQuoteDetails('6466') (the case's own contract AVP000169, made in the manual run) | new |
| AP2493_006 | 3–4 | verifyFinalizedHasNoDelete('creditors', 'AVP000169') | new |
| AP2493_007 | 1 | openQuoteDetails('6461') + verifyProductUnchanged() | new |
| AP2493_007 | 2–3 | openCancelModal() + verifyCancelModalShownAndRowUnchanged() | new |
| AP2493_007 | 4–5 | declineCancel() + reloadQuoteDetails() + verifyProductUnchanged() | new |
| AP2493_008 | 1 | openQuoteDetails('6461') + verifyProductUnchanged() | new |
| AP2493_008 | 2–4 | dismissCancelModalWithoutAnswering() (no × icon, Escape, click outside) + reloadQuoteDetails() | new |
| AP2493_008 | 5 | verifyProductUnchanged() | new |
| AP2493_009 | 1 | createQuoteFromVehicle('915', …) — client form via DealerNewQuoteClientPage.fillNewClientForm() — then addWarranty(1500) | new + reused |
| AP2493_009 | 2–3 | confirmCancel() + reloadQuoteDetails() | new |
| AP2493_009 | 4 | verifyProductRemovedAndAddBack() + verifySubtotal(before − warranty) | new |
| AP2493_010 | 1 | createQuoteFromVehicle() + addWarranty(1500) + confirmCancel() + verifyProductRemovedAndAddBack() | new |
| AP2493_010 | 2–3 | addWarranty(1800) (saves and reloads) | new |
| AP2493_010 | 4 | verifySingleRowWithAmount('CA$1,800.00') + verifySubtotal(empty + 1800) | new |
| AP2493_013 | 1 | verifyQuoteIsArchived('6245') (/quotes/archived) | new |
| AP2493_013 | 2–4 | openQuoteDetails('6245') + verifyArchivedQuoteRenders() | new |
| AP2493_014 | 1 | createQuoteFromVehicle() + addFinancing() | new |
| AP2493_014 | 2 | addGap('60') + addCreditorInsurance() + verifySubtotal(vehicle + GAP + creditor) | new |
| AP2493_014 | 3 | confirmCancel('gap') + reloadQuoteDetails() | new |
| AP2493_014 | 4 | verifyProductRemovedAndAddBack('gap') + verifyProductStillThere('creditors') + verifySubtotal(before − GAP − creditor change) | new |

## New locators
All in `QuoteProductSummaryPage`, verified on v2dev 2026-11-02 on quotes 6461, 6462 and 6464 with `browser.evaluate` (count 1 once scoped to the row or the open modal), and each used by a strict-mode action or assertion in the passing run.

| Name | Expression | Page | Count |
|---|---|---|---|
| cardSummary | `.card` filtered by `h3` "Summary of products" | /quote/{id}/details | 1 |
| lblSubtotal | `cardSummary td.h5 strong` | /quote/{id}/details | 1 |
| row(product) | `cardSummary tr` filtered by text starting with the product name | /quote/{id}/details | 1 |
| rowAmount(product) | `row td.text-right` (first) | /quote/{id}/details | 1 |
| btnRowMenu(product) | `row button[data-toggle="dropdown"]` | /quote/{id}/details | 1 |
| lnkRowAdd(product) | `row a.btn:has(.fa-plus-circle)` | /quote/{id}/details | 1 |
| lnkDelete(id, product) | `a[href="/quote/{id}/cancel-product/{product}"]` | /quote/{id}/details | 1 |
| lnkRowPdf(product) | `row a[href*="pdf"]` | /quote/6466/details | 1 |
| lnkCancelProductAny | `a[href*="/cancel-product/"]` | /quote/{id}/details | 0 on 6466 |
| mdlOpen | `#myModal.show` | modal | 1 |
| lblCancelTitle / lblCancelQuestion | `#myModal.show h1` / `#myModal.show label[for="form_text"]` | cancel modal | 1 |
| btnCancelYes / btnCancelNo | `#myModal.show #form_save` / `#myModal.show a[data-dismiss="modal"]` | cancel modal | 1 |
| btnCancelClose | `#myModal.show button.close, [aria-label="Close"]` | cancel modal | 0 (no × icon) |
| txtVehicleDeliveredAt / txtVehiclePrice / btnVehicleSave | `#quote_vehicle_deliveredAt` / `#quote_vehicle_price` / `form[name="quote_vehicle"] button[type="submit"]` | vehicle modal | 1 |
| term radio / txtWarrantySalePrice / btnWarrantySave | `getByRole('radio', { name: '20m/20000km' })` / `#quote_warranty_salePrice` / `form[name="quote_warranty"] button[type="submit"]` | warranty modal | 1 |
| lnkAddFinancing + financing fields | `main a.btn[href$="/financing"]` "Add a financing"; `#quote_financing_*` | financing modal | 1 |
| txtGapTerm / btnGapGetQuote | `#quote_financing_insurance_gap_gapTerm` / `form[name="quote_financing_insurance_gap"] button[type="submit"]` | GAP modal | 1 |
| Chubb fields / btnChubbGetQuote | `#quote_financing_insurance_chubb_*` / `form[name="quote_financing_insurance_chubb"] button[type="submit"]` | /quote/{id}/insurance | 1 |

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/QuoteProductSummaryPage.ts | new page object — Summary of products rows, row menus, cancel modal, and the vehicle, warranty, financing, GAP and creditor forms |
| playwright-automation/src/flows/QuoteCancelProductFlow.ts | new flow — quote building, cancel / decline / dismiss, and every AP-2493 verification |
| playwright-automation/src/tests/dealer/cancelQuoteProduct_AP2493.spec.ts | new spec, 12 tests tagged @AP-2493 |

No existing file was edited: the new page object is imported by path (not added to `src/pages/dealerPortal/index.ts`), the flow is instantiated in the spec (not added to `test-fixtures.ts`), and `DealerFlow.ts` / `DealerNewQuoteClientPage.ts` are only called.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2493`
Lint: pass · Run: 12 passed, 0 fixme, about 3 min per run (review run with `--repeat-each=2`: 24 passed, no flaky tests, 5.7 min)

## Pull request
PR skipped: gh CLI not installed (run with --no-pr).

## Reviewer
R5 round 1 — APPROVE, 0 blocker · 0 major · 2 minor (run inline; see qa-artifacts/7-reviews/AP-2493_review.md).

## Not passing
None.

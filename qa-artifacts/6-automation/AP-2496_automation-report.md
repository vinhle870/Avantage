# Automation Report — AP-2496
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2496_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/downloadAllDocuments_AP2496.spec.ts · Tag: @AP-2496
Result: 2 of 2 PASSED cases automated — 2 passing, 0 fixme

## Summary
The two cases that passed manually on Dev (v2dev) are now automated: a quote whose only product was removed before any contract existed shows no "Download all documents" action (AP2496_002, judged), and a quote that never had a product loads without error while the action's state is recorded for question Q-001 (AP2496_003, record-only). Both tests are read-only: they open the quotes the manual run left on Dev (6485 and 6486), and AP2496_002 first checks on quote 6040, which holds contracts, that the locator does find the action exactly once, so the "hidden" check cannot pass because of a wrong locator. The other seven cases are not automated because they did not pass: AP2496_008 failed (bug AP-2519) and six were blocked by AP-2518.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2496_001 | A quote with one generated roadside contract shows exactly one "Download all documents" action | not selected | BLOCKED manually by AP-2518 — no confirmed behaviour to assert |
| AP2496_002 | A quote whose only optional product was removed before its contract was generated shows no download action | automated — passing | Read-only on quote 6485 (state left by the manual run), with a locator control on quote 6040 |
| AP2496_003 | A new quote with no product at all — the page loads without error and the download action state is recorded | automated — passing | Read-only on quote 6486; action state recorded as a Q-001 annotation |
| AP2496_004 | "Download all documents" on a quote with two contracts returns one PDF named with the quote id | not selected | BLOCKED manually by AP-2518 |
| AP2496_005 | The merged PDF holds every page of each individual contract, and each individual download still works | not selected | BLOCKED manually by AP-2518 |
| AP2496_006 | A product removed before finalization adds no page to the merged PDF, and the roadside contract is still merged | not selected | BLOCKED manually by AP-2518 |
| AP2496_007 | A cancelled warranty contract adds no page to the merged PDF, and the roadside contract is still merged | not selected | BLOCKED manually by AP-2518 |
| AP2496_008 | Opening the download-all address directly for a quote with no contract causes no server error and returns no other quote's documents | not selected | FAILED manually — bug AP-2519 (HTTP 500) |
| AP2496_009 | Requesting the download-all address with another dealership's quote id — the response is recorded and causes no server error | not selected | BLOCKED manually by AP-2518 and no known quote id of another dealership |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2496_002 | 1 | Quote 6485 already created by the manual run → `QuoteDocumentsDownloadFlow.openQuoteDetails('6485', 'Docs Download2496-002')`; sign-in via `DealerFlow.loginToDealerPortal()` | reused (login) · new (open) |
| AP2496_002 | 2 | State check only — the saved product is no longer there after step 3 (manual run recorded branch (a): no contract) | — |
| AP2496_002 | 3 | `QuoteDocumentsDownloadFlow.verifyRemovedProductNoLongerActive('Esthetic protection', 'Rust+Sound')` | new |
| AP2496_002 | 4 | `verifyNoProductAndNoContractDocument()` + `verifyDownloadAllHidden('6485')`, after the control `verifyLocatorControlOnQuoteWithContracts('6040')` | new |
| AP2496_003 | 1 | Quote 6486 already created by the manual run → `openQuoteDetails('6486', 'Docs Download2496-003')`; sign-in via `DealerFlow.loginToDealerPortal()` | reused (login) · new (open) |
| AP2496_003 | 2 | `verifyNoProductAndNoContractDocument()` | new |
| AP2496_003 | 3 | `verifyNoFaultAndRecordAction('6486')` — sends a GET to the action's address only if the action is shown, and fails on an HTTP 5xx | new |
| AP2496_003 | 4 | `verifyNoFaultAndRecordAction('6486')` — no error page; Q-001 annotation | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lnkDownloadAll(quoteId) | `.card:has(h3 "Summary of products") a[href="/quote/{id}/documents/download"]` | /quote/6040/details | 1 (asserted by the control step on every run) |
| lnkDownloadAllAny | `a[href*="/documents/download"]` | /quote/6040/details | 1 (asserted); 0 on 6485 and 6486 |
| ctlDownloadAllByName | `a, button` filtered by text `Download all documents` / `Télécharger tous les documents` | /quote/6040/details | 1 (asserted); 0 on 6485 and 6486 |
| lnkContractDocumentAny | `main a[href*="pdf"], main a[href*="contract-download"]` | /quote/6485/details, /quote/6486/details | 0 (the checks assert absence) |
| cardSummary, productRow(name), lblHeading, lblErrorText | same expressions as the batch-created `QuoteProductSummaryPage` (AP-2493 s8, verified on v2dev) | /quote/{id}/details | 1 per row |

The new locators were confirmed on the live Dev page through the spec's own control step (count exactly 1 on quote 6040), not through a separate browser session, so no credential was read outside the framework's `getCredentials`.

## Files changed
| File | Change |
|---|---|
| src/pages/dealerPortal/QuoteDocumentsDownloadPage.ts | new page object: the download-all link, contract-document links, product rows, error text |
| src/flows/QuoteDocumentsDownloadFlow.ts | new flow: open quote, locator control, product/contract absence, action hidden, record action for Q-001 |
| src/tests/dealer/downloadAllDocuments_AP2496.spec.ts | new spec, `@dealer @AP-2496`, 2 tests, Dev (v2dev) only |

No existing file was changed — the QA's uncommitted `DealerFlow.ts`, `QuoteDetailPage.ts`, `index.ts` and `test-fixtures.ts` were only read, and the new page object is not exported from `index.ts` or registered as a fixture (the spec builds the flow itself, like the AP-2493 spec).

## Run
Command: `npx playwright test --project=chromium --grep @AP-2496`
Lint: pass · Run: 2 passed, 0 fixme, 18.5 s · Repeat (`--repeat-each=2`): 4 passed, 29.5 s · Reviewer R5 (inline): APPROVE, 1 minor finding (AP2496_002 checks the state quote 6485 was left in rather than rebuilding it)

Left on Dev by the spec: nothing. Both tests only read quotes 6040, 6485 and 6486. If either quote is changed or deleted, the open or control step fails with a message saying which Dev quote to pick instead.

## Pull request
PR skipped: gh CLI not installed

## Not passing
None.

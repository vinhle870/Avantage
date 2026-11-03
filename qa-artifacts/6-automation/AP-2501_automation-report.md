# Automation Report — AP-2501
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/permaplateInvoiceTerm_AP2501.spec.ts · Tag: @AP-2501
Result: 1 of 1 PASSED cases automated — 1 passing, 0 fixme

## Summary
AP2501_001 now runs automatically on Dev. The test signs in to the Dealer portal and confirms that quote 6555 has the Permaplate term "10 ans" selected. It then opens invoice 941 and checks four things: the description names "10 ans", it cites the real contract number PNA-0000000020, it contains no price, and the line Total is the $80.00 dealer cost. The test is read-only. Instead of generating a new contract and unpaid invoice on every run, it checks the fixed invoice 941 left by the manual run. That data exists only on Dev, so the test skips itself on any other environment. The other five cases were not automated because none of them passed manually.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | automated — passing | — |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | not selected | BLOCKED manually — dealer 1380 has only one Permaplate term on Dev |
| AP2501_003 | The PDF of a new Permaplate invoice names the term sold in its description | not selected | FAIL manually — the invoice PDF returns HTTP 500 (AP-2529) |
| AP2501_004 | The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row | not selected | BLOCKED manually — no second-term invoice |
| AP2501_005 | The Admin-area invoice list shows the term name in the new Permaplate invoice's row | not selected | BLOCKED manually — no second-term invoice |
| AP2501_006 | On every invoice surface, the term name sits on the line right after the contract number | not selected | BLOCKED manually — Q-001 unanswered |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2501_001 | 1 `[Pre-Condition]` sign in, create client and quote | `DealerFlow.loginToDealerPortal()`; quote creation replaced by the fixed quote 6555 (read-only, by the run's instruction) | reused |
| AP2501_001 | 2 `[Pre-Condition]` term `TERM_A` saved on the quote | `PermaplateInvoiceTermFlow.verifyTermSoldOnQuote()` → `PermaplateQuotePage.radSelectedTerm`, `readSelectedTermName()` | new |
| AP2501_001 | 3 Generate Contract → invoice | Replaced by the fixed contract PNA-0000000020 / invoice 941; the invoice's contract link is checked against quote 6555 in `openDealerInvoice()` (`InvoiceViewPage.lnkPermaplateContract`) | new |
| AP2501_001 | 4 open `/invoice/{id}`, read the Description | `PermaplateInvoiceTermFlow.openDealerInvoice()` → `InvoiceViewPage.lblHeading` (reused), `lblDescriptionCell`, `readDescriptionLines()` | new |
| AP2501_001 | 5 `[Verification]` term, contract number, no retail price | `PermaplateInvoiceTermFlow.verifyDescriptionNamesTerm()` → `InvoiceViewPage.lblLineTotalCell` | new |

How step 5 (`[Verification]`) is checked:
- "Contains `TERM_A`" → `expect(lines).toContain('10 ans')`.
- "The contract number is the one created" → `expect(lines).toContain('PNA-0000000020')`, and exactly one `PNA-…` line, equal to it.
- "No retail price" → no Description line matches a price pattern, and the line Total is `$80.00` (the dealer cost).
- The term's position after the contract number (Q-001, Blocking) is recorded as an annotation, not asserted.

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| `InvoiceViewPage.lblDescriptionCell` | `xpath=//table[thead/tr/th[normalize-space()='Description']]/tbody/tr/td[1]` | `/invoice/941` | 1 |
| `InvoiceViewPage.lblLineTotalCell` | `xpath=//table[thead/tr/th[normalize-space()='Description']]/tbody/tr/td[2]` | `/invoice/941` | 1 |
| `InvoiceViewPage.lnkPermaplateContract` | `a[href*="permaplate-contract-download"]` | `/invoice/941` | 1 |
| `PermaplateQuotePage.radSelectedTerm` | `input[type="radio"][name="permaplate_id"]:checked` | `/quote/6555/permaplate` | 1 |
| `PermaplateQuotePage.radTerms` | `input[type="radio"][name="permaplate_id"]` | `/quote/6555/permaplate` | 1 (dealer 1380 has one term on Dev) |

## Files changed
| File | Change |
|---|---|
| `src/pages/common/InvoiceViewPage.ts` (created in the AP-1381 batch) | added `lblDescriptionCell`, `lblLineTotalCell`, `lnkPermaplateContract`, `readDescriptionLines()`; no existing member changed (AP-1381 spec re-run: 3 passed) |
| `src/pages/dealerPortal/PermaplateQuotePage.ts` | new — Permaplate Quote page: `lblHeading`, `radTerms`, `radSelectedTerm`, `readSelectedTermName()` |
| `src/flows/PermaplateInvoiceTermFlow.ts` | new — `verifyTermSoldOnQuote()`, `openDealerInvoice()`, `verifyDescriptionNamesTerm()` |
| `src/tests/dealer/permaplateInvoiceTerm_AP2501.spec.ts` | new — `AP2501_001_PermaplateInvoiceDetailsNamesTheTermSoldBesideTheContractNumber`, tagged `@dealer @AP-2501` |

Not touched: `AdminFlow.ts`, `DealerFlow.ts`, `index.ts`, `test-fixtures.ts` and every other file the QA has changed. The new page object is imported directly, not through `src/pages/dealerPortal/index.ts`.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2501`
Lint: pass · Run: 1 passed, 0 fixme, 7–11 s over two runs; `--repeat-each=2`: 2 passed, 13.5 s

## Pull request
PR skipped: gh CLI not installed (run with `--no-pr`).

## Not passing
None.

## Review
R5 round 1 (inline, 2026-11-02): APPROVE — 0 blocker · 0 major · 1 minor. The minor finding is that the test uses fixed data by design; see `qa-artifacts/7-reviews/AP-2501_review.md`.

# Automation Report — AP-1381
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/1.25.0/execution-log_AP-1381_2026-11-01.md
Spec: playwright-automation/src/tests/dealer/invoiceToBlock_AP1381.spec.ts · Tag: @AP-1381
Result: 3 of 3 PASSED cases automated — 3 passing, 0 fixme

## Summary
The three cases that passed manually on Dev (v2dev) now run automatically: the newest warranty
invoice of dealer 1380 names the dealer's Name exactly once in its "To:" block, and never the
Company name, in the Dealer portal (AP1381_001) and the Admin portal (AP1381_002), and the oldest
invoice still opens without an error (AP1381_004). AP1381_003 was SKIPPED manually (the dealer
invoice page offers no PDF), so it has no confirmed behaviour to automate. The suite is read-only
and skips itself unless the base URL is v2dev.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP1381_001 | A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section, not twice | automated — passing | — |
| AP1381_002 | An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section | automated — passing | — |
| AP1381_003 | The downloadable PDF of a dealer invoice shows the dealer's name without an error — how often it appears is recorded | not selected | SKIPPED manually — no PDF copy offered on the Dealer portal invoice page |
| AP1381_004 | The oldest dealer invoice still opens without an error — whether it keeps the duplicated name is recorded | automated — passing | The name count is recorded as a test annotation for Q-002, not asserted |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP1381_001 | 1 | AdminFlow.loginToAdminPortal() + InvoiceToBlockFlow.readDealerNames('1380') (AdminNewDealerPage.txtName / txtCompanyName) | reused + new |
| AP1381_001 | 2 | DealerFlow.loginToDealerPortal() + InvoiceToBlockFlow.pickNewestWarrantyInvoice() (InvoiceViewPage.warrantyRows) | reused + new |
| AP1381_001 | 3 | InvoiceToBlockFlow.openDealerInvoice() (InvoiceViewPage.lblHeading, blkTo) | new |
| AP1381_001 | 4–5 | InvoiceToBlockFlow.verifyToBlockNamesDealerOnce() (InvoiceViewPage.blkTo, lblToName) | new |
| AP1381_002 | 1 | AdminFlow.loginToAdminPortal() + InvoiceToBlockFlow.readDealerNames('1380') | reused + new |
| AP1381_002 | 2 | DealerFlow.loginToDealerPortal() + InvoiceToBlockFlow.pickNewestWarrantyInvoice() | reused + new |
| AP1381_002 | 3 | InvoiceToBlockFlow.openAdminInvoiceFromList() (InvoiceViewPage.row(), openRow()) | new |
| AP1381_002 | 4–5 | InvoiceToBlockFlow.verifyToBlockNamesDealerOnce() | new |
| AP1381_004 | 1–2 | DealerFlow.loginToDealerPortal() + InvoiceToBlockFlow.pickOldestInvoice() (InvoiceViewPage.lnkLastPage, rows.last()) | reused + new |
| AP1381_004 | 3 | InvoiceToBlockFlow.openDealerInvoice() | new |
| AP1381_004 | 4 | InvoiceToBlockFlow.verifyToBlockNotEmptyAndRecordName() | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| rows | `page.locator('tr.clickable-row[data-href]')` | /invoice, /admin/invoices | 10 per page (collection) |
| warrantyRows | `rows.filter({ has: page.locator('td:first-child a', { hasText: /^\s*Warranty #/ }) })` | /invoice | collection; `.first()` = /invoice/934 on 2026-11-01 |
| lnkLastPage | `page.locator('a.page-link').filter({ hasText: /^\s*Last\s*$/ })` | /invoice | 1 |
| row(href) | `page.locator('tr.clickable-row[data-href="/admin/invoice/934"]')` | /admin/invoices | 1 |
| lblHeading | `page.locator('h1')` | /invoice/934, /admin/invoice/934, /admin/dealer/1380/edit | 1 |
| blkTo | `xpath=//div[h6[normalize-space()='To:']]` | /invoice/934, /admin/invoice/934 | 1 |
| lblToName | `blkTo.locator('xpath=./div/strong')` | /invoice/934, /admin/invoice/934 | 1 |
| txtName / txtCompanyName (reused) | `#dealer_name` / `#dealer_companyName` | /admin/dealer/1380/edit | 1 / 1 |

## Files changed
| File | Change |
|---|---|
| src/pages/common/InvoiceViewPage.ts | new — invoice list and detail page object shared by both portals (rows, warrantyRows, lnkLastPage, lblHeading, blkTo, lblToName; open, row, openRow, goToLastPage, readRow, readToLines, readToName) |
| src/flows/InvoiceToBlockFlow.ts | new — business steps with assertions; in its own file so the QA's uncommitted AdminFlow.ts / DealerFlow.ts stay untouched |
| src/tests/dealer/invoiceToBlock_AP1381.spec.ts | new spec, tagged `@AP-1381` |

No existing file was changed: not `index.ts`, not `test-fixtures.ts`, not either flow. The new page
object is imported by path instead of through `src/pages/common/index.ts`.

## Run
Command: `npx playwright test --project=chromium --grep @AP-1381`
Lint: pass · Run: 3 passed, 0 fixme, 27.7 s · `--repeat-each=2`: 6 passed, 0 failed, 48.3 s, no flaky tests. Run against Dev (v2dev) through the framework's gitignored `.env`; never against Staging.
Reviewer R5 (inline): APPROVE, 0 blocker · 0 major · 2 minor (the admin list page-1 dependency; Dev-only skip) — qa-artifacts/7-reviews/AP-1381_review.md.

## Pull request
PR skipped: gh CLI not installed.

## Not passing
None.

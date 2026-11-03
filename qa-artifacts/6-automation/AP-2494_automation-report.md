# Automation Report — AP-2494
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md
Spec: playwright-automation/src/tests/dealer/quoteListContractsSearch_AP2494.spec.ts · Tag: @AP-2494
Result: 14 of 14 PASSED cases automated — 14 passing, 0 fixme

## Summary
Every case that passed manually is now automated: the "Contracts" column headers on both tabs and in French, the contract numbers shown for a warranty, a creditor-insurance and a Permaplate contract, the blank cell of a quote without a contract, and all eight search cases (quote name, client details, VIN, no match, archived tab, other dealership). The spec is read-only: instead of repeating the manual run's set-up steps, which create quotes and a Chubb contract, it reads the Dev quotes that run left behind (6454, 6460, 6480–6483, archived 6245) — so it never creates data and never generates a contract. AP2494_010 (FAIL, AP-2517) and the four BLOCKED cases (AP-2518, no GAP data) have no confirmed behaviour and were not automated.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2494_001 | Quote list Active tab shows a "Contracts" column and no "Produits" column | automated — passing | — |
| AP2494_002 | Quote list Archived tab shows a "Contracts" column and no "Produits" column | automated — passing | — |
| AP2494_003 | Quote list in French shows no "Produits" column; the new column's French label is recorded | automated — passing | Switches the shared account to French and always back to English (try/finally) |
| AP2494_004 | A quote with a generated extended-warranty contract lists that contract in its Contracts cell | automated — passing | Reads quote 6454 (`26df1-844`) left on Dev; finds it page by page |
| AP2494_005 | A quote with a newly generated roadside contract lists that contract in its Contracts cell | not selected | BLOCKED manually — AP-2518 (roadside Generate Contract HTTP 500) |
| AP2494_006 | A quote with a creditor-insurance contract lists that contract in its Contracts cell | automated — passing | Read-only on quote 6480 (`AVP000170`); the Chubb contract is not generated again. Asserts "contains", since AP-2517 may add the sale number to the same cell |
| AP2494_007 | A quote with a GAP insurance contract lists that contract in its Contracts cell | not selected | BLOCKED manually — test data not on dev: no GAP contract |
| AP2494_008 | A quote with two generated contracts lists each one as its own entry, with no blank line | not selected | BLOCKED manually — AP-2518 |
| AP2494_009 | A quote with a Permaplate contract shows that contract's number in its Contracts cell | automated — passing | Reads quote 6460 (`PNA-0000000019`); the admin cross-check (manual step 2) is replaced by the number it recorded |
| AP2494_010 | A quote with a sales contract shows the sales contract number in its Contracts cell | not selected | FAILED manually — AP-2517 |
| AP2494_011 | A quote with no generated contract shows a blank Contracts cell | automated — passing | Reads quote 6481 (client only) instead of creating a new quote |
| AP2494_012 | A product saved without a contract adds no entry and no blank line to the Contracts cell | not selected | BLOCKED manually — AP-2518 |
| AP2494_013 | Searching part of a quote name in a different letter case lists that quote | automated — passing | Reads quote 6482 "Zephyrine AP2494 959" instead of creating it |
| AP2494_014 | Searching a client's first name, last name, email or full name lists that client's quote | automated — passing | Reads quote 6483 (Ysolde Brakwater-960) |
| AP2494_015 | Searching part of a client's name or email in lower case — the result is recorded | automated — passing | — |
| AP2494_016 | Searching part of a vehicle's VIN lists the quotes on that vehicle | automated — passing | Pages through all result pages; checks fewer pages than the unfiltered list rather than a fixed 43 rows, since other runs add quotes on vehicle 915 |
| AP2494_017 | Searching a term that matches no quote lists no quote and shows no error | automated — passing | — |
| AP2494_018 | Searching on the Archived tab and clearing the search — tab, paging and results are recorded | automated — passing | Uses archived quote 6245 ("LeAVtage") recorded as the first archived row |
| AP2494_019 | Searching a client who belongs to another dealership lists none of that dealership's quotes | automated — passing | Other dealership's contract PNA-0000000016 (Test Dealer 2, VIN 3KPFL4A76HE021135) as recorded; the admin lookup (step 1) is not repeated |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() (fixture `dealerUser`, in `beforeEach`) | reused |
| AP2494_001 | 1–2 | QuoteListFlow.openQuoteList('active') · verifyTabSelected('Active') | new |
| AP2494_001 | 3 | QuoteListFlow.verifyHeaders(Vehicle, Client, Contracts, Date Created) | new |
| AP2494_002 | 1–2 | QuoteListFlow.openQuoteList · clickTab('Archived', '/quotes/archived') · verifyTabSelected | new |
| AP2494_002 | 3 | QuoteListFlow.verifyHeaders(EN) | new |
| AP2494_003 | 2–3 | QuoteListFlow.switchLanguage('fr') · verifyTabSelected('Créé') · verifyHeaders(FR) · clickTab('Archivée') · verifyHeaders(FR) | new |
| AP2494_003 | 4–5 | QuoteListFlow.switchLanguage('en') (finally) · verifyTabSelected('Active') · verifyHeaders(EN) | new |
| AP2494_004 | 1–3 | QuoteListFlow.findQuoteRow('6454') | new |
| AP2494_004 | 4 | QuoteListFlow.verifyContractsCell('6454', ['26df1-844']) | new |
| AP2494_006 | 4 | QuoteListFlow.findQuoteRow('6480') | new |
| AP2494_006 | 5 | QuoteListFlow.verifyContractsCellContains('6480', 'AVP000170') | new |
| AP2494_009 | 3 | QuoteListFlow.findQuoteRow('6460') | new |
| AP2494_009 | 4 | QuoteListFlow.verifyContractsCell('6460', ['PNA-0000000019']) | new |
| AP2494_011 | 2 | QuoteListFlow.findQuoteRow('6481') | new |
| AP2494_011 | 3 | QuoteListFlow.verifyContractsCellBlank('6481') | new |
| AP2494_013 | 2 | QuoteListFlow.search('PHYRINE') | new |
| AP2494_013 | 3 | QuoteListFlow.verifyQuoteListed('6482') · verifyEveryRowContains('phyrine') | new |
| AP2494_014 | 2–5 | QuoteListFlow.search(term) · verifyQuoteListed('6483') · verifyEveryRowContains | new |
| AP2494_015 | 2–4 | QuoteListFlow.search(term) · verifyQuoteListed('6483') | new |
| AP2494_016 | 2–4 | QuoteListFlow.search(term) · verifyQuoteListed · verifyQuoteFirst · verifyEveryRowOnEveryPageContains('VIN: 1FAHP35NX8W239204') | new |
| AP2494_017 | 2–3 | QuoteListFlow.search · verifyNoEntities · verifyKeywordBoxHolds | new |
| AP2494_017 | 4 | QuoteListFlow.search('') · rows count 10 · readLastPageNumber | new |
| AP2494_018 | 2–3 | QuoteListFlow.search(term, 'archived') · verifyQuoteListed('6245') · verifyTabSelected('Archived') · verifyNoEntities | new |
| AP2494_018 | 4 | QuoteListFlow.search('', 'archived') · clickTab('Active', '/quotes') · readRowQuoteIds (page 1 vs page 2) | new |
| AP2494_019 | 3–5 | QuoteListFlow.search(term) · verifyNoRowMentions('PNA-0000000016') · verifyNoEntities | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lblHeading | `page.locator('h1')` | /quotes | 1 |
| tblQuotes | `page.locator('table').first()` | /quotes | 1 |
| lblHeaders | `page.locator('table thead th')` | /quotes | 4 (one per column, by design) |
| rows | `page.locator('table tbody tr')` | /quotes | 10 per page (list, by design) |
| row(id) | `page.locator('table tbody tr:has(td[data-href="/quote/{id}/details"])')` | /quotes (id 6480) | 1 |
| contractsCell(id) | `row(id).locator('td').nth(2)` → `li` entries | /quotes (id 6480: `<ul><li>AVP000170</li></ul>`) | 1 |
| tab(label) | `page.locator('a.nav-link', { hasText: /^\s*{label}\s*$/ })` | /quotes — "Active", "Archived"; /quotes?_locale=fr — "Créé", "Archivée" | 1 each |
| lblNoEntities | `page.locator('div.alert-warning[role="alert"]')` | /quotes?quote_search[keyword]=qzxwv-AP2494-nomatch | 1 |
| lnkPages | `page.locator('.pagination a')` | /quotes | list (page numbers read from every href) |
| btnOpenSearch | `page.locator('a[data-target="#searchForm"]')` | /quotes | 1 |
| mdlSearch | `page.locator('#searchForm')` | /quotes | 1 |
| lblSearchKeyword | `page.locator('label[for="quote_search_keyword"]')` | /quotes (EN and FR) | 1 |
| txtSearchKeyword | `page.locator('#quote_search_keyword')` | /quotes | 1 |
| btnSearch | `page.locator('#quote_search_save')` | /quotes | 1 |

Verified on v2dev 2026-11-02 in the browser (dealer login typed only into the login form), then the tab was closed. The sidebar also links to `/quotes`, so the tabs are matched by text, not by href (`a.nav-link[href="/quotes"]` counts 2).

## Files changed
| File | Change |
|---|---|
| src/pages/dealerPortal/QuoteListPage.ts | **new** — page object for /quotes and /quotes/archived: headers, rows, Contracts cell, tabs, empty state, pagination, search dialog |
| src/flows/QuoteListFlow.ts | **new** — read-only flow with all assertions (open list, switch language, find a row by paging, Contracts-cell checks, search and result checks, paging and clear checks) |
| src/tests/dealer/quoteListContractsSearch_AP2494.spec.ts | **new** — 14 tests tagged `@dealer @AP-2494`, skipped outside v2dev |

No existing file was changed: the QA's uncommitted `DealerFlow.ts`, `src/pages/dealerPortal/index.ts` and `test-fixtures.ts`, and the committed `DealerQuotesPage.ts`, are untouched (the new page object is not registered in the fixtures; the spec builds `QuoteListFlow` from `page`).

## Run
Command: `npx playwright test --project=chromium --grep @AP-2494`
Lint: pass · Run: 14 passed, 0 fixme, 2.3 min (1 worker). After the R5 clean-up (spec assertions moved into QuoteListFlow), `--repeat-each=2`: 28 passed, 4.4 min, no flaky test.

## Review
R5 (stlc-qa-reviewer, inline, round 1): **APPROVE** — 0 blocker · 0 major · 2 minor (see qa-artifacts/7-reviews/AP-2494_review.md).

## Pull request
PR skipped: gh CLI not installed (run with `--no-pr`). Nothing was committed or pushed.

## Not passing
None.

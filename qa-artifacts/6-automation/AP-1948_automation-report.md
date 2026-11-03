# Automation Report — AP-1948
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md
Spec: playwright-automation/src/tests/client/termPrice_AP1948.spec.ts · Tag: @AP-1948
Result: 3 of 3 PASSED cases automated — 3 passing, 0 fixme

## Summary
The three cases that passed manually on Dev (v2dev) now run automatically: the Summary page's
"Subtotal" equals the program term's admin "Suggested retail price" (AP1948_001), it follows a change
of term (AP1948_002), and a change of that admin price reaches the customer on the next page load
(AP1948_009). AP1948_009 changes only term 16's suggested retail price, records the original first and
always puts it back — in a `finally` block, with an `afterEach` fallback — and asserts the restored value.
The six BLOCKED cases were not automated because nothing confirms their expected behaviour yet
(Q-001, Q-002 and the Stripe payment page). The suite runs against Dev only: it skips itself unless
the configured base URL is v2dev, because its customer, vehicle and term ids are Dev data.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP1948_001 | Customer selects a warranty term → price shown equals that term's suggested retail price in admin | automated — passing | — |
| AP1948_002 | Customer switches to another warranty term → price shown changes to the new term's suggested retail price | automated — passing | — |
| AP1948_009 | Admin changes a term's suggested retail price → customer portal shows the new price for that term | automated — passing | — |
| AP1948_003 | Customer submits the quote request → no error, and any term or price shown back matches the one selected | not selected | BLOCKED manually — "Continue with payment" opens a Stripe checkout; no payment test data |
| AP1948_004 | Tesla vehicle on the customer portal → only program terms of that model's category are offered | not selected | BLOCKED — Q-001 unanswered |
| AP1948_005 | A program term set for a different vehicle category → it is not offered for this vehicle | not selected | BLOCKED — Q-001 unanswered |
| AP1948_006 | Vehicle whose category has no program term → page shows no wrong-category term and no error | not selected | BLOCKED — Q-001 unanswered |
| AP1948_007 | Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ | not selected | BLOCKED — Q-002 unanswered |
| AP1948_008 | Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ | not selected | BLOCKED — Q-002 unanswered |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP1948_001 | 1 | TermPriceFlow.openQuoteRequestUpToTermChoice() — ClientQuoteRequestPage.enterVehicle(), enterOwnership(), btnContinue | new |
| AP1948_001 | 2 | TermPriceFlow.chooseTermAndReachSummary() + readSummarySubtotal() — ClientQuoteRequestPage.termCard(), enterClient(), lblSubtotal, lblWarrantyTerm | new |
| AP1948_001 | 3 | AdminFlow.loginToAdminPortal() | reused |
| AP1948_001 | 3 | TermPriceFlow.readSuggestedRetailPrice() — AdminProgramTermPage.txtSuggestedRetailPrice | new |
| AP1948_001 | 4 | TermPriceFlow.verifyPriceEquals() | new |
| AP1948_002 | 1 | TermPriceFlow.openQuoteRequestUpToTermChoice() (vehicle 81, 2023 TESLA Model Y) | new |
| AP1948_002 | 2 | chooseTermAndReachSummary(16) → readSummarySubtotal() → switchTermAndReachSummary(122) → readSummarySubtotal() — ClientQuoteRequestPage.tickAgreePolicy() | new |
| AP1948_002 | 3 | AdminFlow.loginToAdminPortal() + TermPriceFlow.readSuggestedRetailPrice(16 and 122) | reused + new |
| AP1948_002 | 4 | TermPriceFlow.verifyPriceEquals() ×2, verifyPricesDiffer() | new |
| AP1948_009 | 1 | openQuoteRequestUpToTermChoice() + chooseTermAndReachSummary(16) + readSummarySubtotal() | new |
| AP1948_009 | 2 | AdminFlow.loginToAdminPortal() + readSuggestedRetailPrice(16) (original) + setSuggestedRetailPrice(16, original + 100) — AdminProgramTermPage.btnSave, lblSaved | reused + new |
| AP1948_009 | 3 | openQuoteRequestUpToTermChoice() + chooseTermAndReachSummary(16) + readSummarySubtotal() | new |
| AP1948_009 | 4 | TermPriceFlow.restoreSuggestedRetailPrice(16, original) in `finally` (+ `afterEach` fallback) | new |
| AP1948_009 | 5 | verifyPriceEquals(after, original + 100) + the restore's assertion | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| ddlVehicle | `#customer_quote_vehicle_manufacturerVehicle` (native select under bootstrap-select, opacity 0 — selectOption works) | /customer/1493/quote-request | 1 |
| txtVin | `input[name="customer_quote_vehicle[vin]"]` | /customer/1493/quote-request | 1 |
| txtMileage | `input[name="customer_quote_vehicle[mileage]"]` | /customer/1493/quote-request | 1 |
| txtMarketValue | `input[name="customer_quote_vehicle[marketValue]"]` | /customer/1493/quote-request | 1 |
| btnContinue | `button[type="submit"]` | every quote-request step except Summary (1 per page) | 1 |
| txtDateOwner | `#customer_quote_ownership_dateOwner` | /quote-request/ownership | 1 |
| rdoHowPurchaseFranchised | `#customer_quote_ownership_howPurchase_0` | /quote-request/ownership | 1 |
| rdoInspectedYes | `#customer_quote_ownership_isInspected_0` | /quote-request/ownership | 1 |
| termCard(id) | `label:has(> input.card-input-element[value="{id}"]) .card` (checked for 16 and 122) | /quote-request/program | 1 |
| termRadio(id) | `label > input.card-input-element[value="{id}"]` (the hidden fieldset has a second radio per term, without the class) | /quote-request/program | 1 |
| txtFirstName · txtLastName · txtAddress1 · txtCity · txtPostalCode · txtPhone1 · txtEmail | `#customer_quote_client_{field}` | /quote-request/client | 1 each |
| ddlProvince | `#customer_quote_client_province` (1 = Québec) | /quote-request/client | 1 |
| chkAgreePolicy | `#customer_quote_client_isAgreePolicy` | /quote-request/client | 1 |
| lblModel · lblProgram · lblWarrantyTerm | `//dl[dt[normalize-space()='Model' / 'Program' / 'Warranty term']]/dd` | /quote-request/payment (Summary) | 1 each |
| lblSubtotal | `//tr[td[strong[normalize-space()='Subtotal']]]/td[last()]` | /quote-request/payment (Summary) | 1 |
| txtSuggestedRetailPrice | `#program_term_suggestedRetailPrice` | /admin/program-term/16/edit | 1 |
| btnSave | `getByRole('button', { name: 'Save', exact: true })` | /admin/program-term/16/edit | 1 |
| lblHeading | `h1, h2, h3, h4, h5` (one heading on the page) | /admin/program-term/16/edit | 1 |
| lblSaved | `getByText('Program terms saved')` | /admin/program-terms after Save | confirmed by the passing runs (not counted in the exploration: no save was made while mapping) |

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/common/ClientQuoteRequestPage.ts | new page object — Client portal quote request steps 1–5 (no "Continue with payment" locator on purpose) |
| playwright-automation/src/pages/adminPortal/AdminProgramTermPage.ts | new page object — admin program-term edit form |
| playwright-automation/src/flows/TermPriceFlow.ts | new flow — quote request up to Summary, read / set / restore the suggested retail price, verifications |
| playwright-automation/src/tests/client/termPrice_AP1948.spec.ts | new spec, tag @AP-1948 (and @client) |

No existing file was changed. The QA's uncommitted AdminFlow.ts, DealerFlow.ts, pages/*/index.ts and
test-fixtures.ts are untouched; the new classes are imported by path, and AdminFlow.loginToAdminPortal()
is reused through the existing `adminUser` fixture.

## Run
Command: `npx playwright test --project=chromium --grep @AP-1948`
Lint: pass · Run: 3 passed, 0 fixme, 53.1 s · `--repeat-each=2`: 6 passed, 0 failed, 1.6 min, no flaky tests. Run against Dev (v2dev) through the framework's gitignored `.env`; never against staging.
Reviewer R5 (inline): APPROVE, 0 blocker · 0 major · 2 minor (restore path not exercised on a forced failure; Dev ids are constants in the spec) — qa-artifacts/7-reviews/AP-1948_review.md.

After the three AP1948_009 runs, /admin/program-term/16/edit on v2dev showed Suggested retail price 1025 (checked
in the browser at 16:04Z). Each test run leaves an unsubmitted quote request in the Client portal session for
customer 1493, with a unique `client.stage.<timestamp>@yopmail.com` email; whether that saves anything on the server
is not known (no cleanup source).

## Pull request
PR skipped: gh CLI not installed (--no-pr). No branch, worktree or commit was made.

## Not passing
None.

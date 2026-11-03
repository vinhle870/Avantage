# Automation Report — AP-2225
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/3.0.0/execution-log_AP-2225_2026-11-01.md
Spec: playwright-automation/src/tests/dealer/roadSideProtection_AP2225.spec.ts · Tag: @AP-2225
Result: 1 of 1 PASSED cases automated — 1 passing, 0 fixme

## Summary
The one case that passed manually on Dev (v2dev), AP2225_001, now runs automatically: it signs in to the dealer portal, opens the newest quote that has a vehicle with a VIN, checks that the quote hub links to the Road side protection page, opens that page and checks that every AutoShield product option shows a dollar price. The spec is read-only: it creates no quote and never presses "Save" or any Generate button, because an AutoShield contract cannot be deleted from the portal. The other 14 cases failed or were blocked manually (bug AP-2508), so they have no confirmed behaviour to automate.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2225_001 | The Road side protection page of a new quote lists AutoShield products, each with a price | automated — passing | Read-only variant: uses the newest existing quote with a VIN instead of creating Quote A (step 1), so the run leaves no data behind |
| AP2225_002 | The vehicle fields on the Road side protection page are prefilled with the quote's vehicle, sale and financing data | not selected | FAIL manually — AP-2508 |
| AP2225_003 | The client fields on the Road side protection page show the quote's client details | not selected | FAIL manually — AP-2508 |
| AP2225_004 | On a quote with no delivery date and no financing, dates default to today and Financed Amount to the sale price | not selected | BLOCKED manually — Dev requires a Delivery date |
| AP2225_005 | A prefilled value the dealer overrides is kept after Save and a page reload | not selected | FAIL manually — AP-2508 |
| AP2225_006 | Saving a changed value on the Road side protection page leaves the quote's own vehicle data unchanged | not selected | FAIL manually — AP-2508 |
| AP2225_007 | The contract button reads "Generate Contract" in English and "Générer le contrat" in French | not selected | FAIL manually — AP-2508 |
| AP2225_008 | Saving with Odometer Reading emptied does not crash the page or keep a value nobody entered | not selected | FAIL manually — AP-2508 |
| AP2225_009 | Generate Contract opens the autoShield contract page with an AutoShield contract ID | not selected | BLOCKED manually — AP-2508 |
| AP2225_010 | The autoShield contract page shows all 17 contract fields | not selected | BLOCKED manually — AP-2508 |
| AP2225_011 | The contract page's PDF link delivers the AutoShield contract as a PDF document | not selected | BLOCKED manually — AP-2508 |
| AP2225_012 | Generate Contract on a quote with no financing company ends on a page without a crash | not selected | BLOCKED manually — AP-2508 |
| AP2225_013 | Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it | not selected | BLOCKED manually — AP-2508 |
| AP2225_014 | Values the dealer overrides and saves are the values shown on the generated contract | not selected | FAIL manually — AP-2508 |
| AP2225_015 | Double-clicking "Generate Contract" creates only one AutoShield contract for the quote | not selected | BLOCKED manually — AP-2508 |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2225_001 | 1 (log in) | DealerFlow.loginToDealerPortal() | reused |
| AP2225_001 | 1 (quote) | RoadSideProtectionFlow.openNewestQuoteWithVehicle() — RoadSideProtectionPage.quoteRowsWithVin, lblHeading | new |
| AP2225_001 | 2 | RoadSideProtectionFlow.openRoadSideProtection() — RoadSideProtectionPage.lnkRoadSideProtection(id), lblHeading, alertError, frmAutoShield | new |
| AP2225_001 | 3 | RoadSideProtectionFlow.verifyProductsListedWithPrices() — RoadSideProtectionPage.radTiers, lblTiers | new |

Step 2 checks that the hub links to `/quote/{id}/road-side-protection` and then opens that URL directly: from the hub the link opens the page in a modal, and the manual PASS evidence is the directly opened page.

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| quoteRowsWithVin | `page.locator('tbody tr').filter({ hasText: /VIN:\s*[A-HJ-NPR-Z0-9]{17}/ })` → first row's `td[data-href]` | /quotes | list — first row used (≥ 1; 3 on page 1 on 2026-11-01) |
| lblHeading | `page.locator('h1')` | /quotes, /quote/6451/details, /quote/6451/road-side-protection | 1 |
| lnkRoadSideProtection(id) | `page.locator('a[href="/quote/{id}/road-side-protection"]')` | /quote/6451/details | 1 |
| frmAutoShield | `page.locator('form[name="quote_auto_shield"]')` | /quote/6451/road-side-protection | 1 |
| radTiers | `page.locator('input[type="radio"][name="quote_auto_shield[selectedTier]"]')` | /quote/6451/road-side-protection | list — 5 options |
| lblTiers | `page.locator('label[for^="quote_auto_shield_selectedTier_"]')` | /quote/6451/road-side-protection | list — 5 labels |
| alertError | `page.locator('.alert-danger')` | /quote/6451/road-side-protection | 0 (asserted absent) |

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/RoadSideProtectionPage.ts | new page object: quoteRowsWithVin, lblHeading, alertError, frmAutoShield, radTiers, lblTiers, lnkRoadSideProtection(), readNewestQuoteWithVinHref(), readTierLabels(). Not exported from `pages/dealerPortal/index.ts` (the QA's uncommitted file); imported directly |
| playwright-automation/src/flows/RoadSideProtectionFlow.ts | new flow: openNewestQuoteWithVehicle(), openRoadSideProtection(), verifyProductsListedWithPrices() |
| playwright-automation/src/tests/dealer/roadSideProtection_AP2225.spec.ts | new spec, `@dealer @AP-2225`, skips itself unless the base URL is v2dev |

No existing file was changed: AdminFlow.ts, DealerFlow.ts, index.ts and test-fixtures.ts are untouched.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2225`
Lint: pass (`npm run lint` = `tsc --noEmit`) · Run: 1 passed, 0 fixme, 13.8 s · `--repeat-each=2`: 2 passed, 0 failed, 20.6 s, no flaky tests. Run against Dev (v2dev) through the framework's gitignored `.env`; never against Staging. Reviewer R5 re-ran it: 2 passed.
Reviewer R5: APPROVE — 0 blocker, 0 major, 1 minor (qa-artifacts/7-reviews/AP-2225_review.md).

## Pull request
PR skipped: gh CLI not installed.

## Not passing
None.

# Automation Report — AP-2471
Date: 2026-11-02 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md
Spec: playwright-automation/src/tests/admin/earningCurveManagement_AP2471.spec.ts · Tag: @AP-2471
Result: 16 of 16 PASSED cases automated — 16 passing, 0 fixme

## Summary
Every test case that passed manually on Dev (v2dev) for AP-2471 now runs automatically: the Risk Management menu, the list page, the create form's defaults, all three predefined calculations (checked against the formula for every row at 1, 4, 12, 24, 36 and 60 months), Custom factors, saving, editing and the validation that Dev applies. AP2471_015 (delete) is not automated because it was SKIPPED manually: Dev has no delete control. The spec reuses the earning-curve page object and flow added for AP-2485 and AP-2486, with new members appended only.

**Test data, which cannot be deleted.** Earning curves have no delete in the UI, so creations are kept to the minimum each case needs. AP2471_001–009 save nothing. AP2471_010, _011, _012, _013 (attempt D only — attempts A–C are refused and save nothing), _014, _016 and _017 save exactly one curve each, so **every run of the spec leaves 7 curves on Dev**, named `QA-AP2471-<Custom|ProRata→Edited|Neg-Range|Neg-Custom90|Switch|Shorten>-<epoch ms>` (AP2471_011 leaves a `QA-AP2471-ProRata-…`, AP2471_012 a `QA-AP2471-Edited-…`). The curves from AP2471_013 (inverted odometer range) and AP2471_014 (Custom total 75% with a negative factor) hold invalid values on purpose. The spec edits only curves it created in the same test. The work for this report ran the saving tests twice, so it left **14 curves on Dev**; to avoid 7 more, the flaky check used two separate full runs instead of `--repeat-each=2`.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2471_001 | The admin menu shows "Earning Curves" under the tachometer-icon Risk Management section, and opens the list | automated — passing | — |
| AP2471_002 | The Earning Curves page shows its title, a "Create New" item and a list with the six required columns | automated — passing | — |
| AP2471_003 | A new earning curve form opens with Term month 12, type Pro-Rata and a 12-row earning points table | automated — passing | Asserts that Is Enabled? is a ticked checkbox (the criterion says "Yes/No toggle") |
| AP2471_004 | A 12-month Pro-Rata curve earns 8.3333% every month and the cumulative factor reaches 100% at month 12 | automated — passing | — |
| AP2471_005 | Choosing Rule of 78 on a 12-month curve front-loads earning | automated — passing | — |
| AP2471_006 | Choosing Reverse Rule of 78 on a 12-month curve back-loads earning, with month 8 cumulative at 46.15% | automated — passing | — |
| AP2471_007 | Changing Term month to 24 rebuilds the table with 24 rows and recalculates Rule of 78 over 300 | automated — passing | — |
| AP2471_008 | A 1-month term gives one row of 100% for each predefined type, and a 60-month term gives 60 rows | automated — passing | — |
| AP2471_009 | With the Custom type, the monthly factors become editable and the cumulative factor recalculates on every change | automated — passing | — |
| AP2471_010 | A Custom curve with typed factors saves, and reopening it shows the same factors | automated — passing | Leaves 1 curve per run |
| AP2471_011 | A saved Pro-Rata curve appears in the list with its name, term, odometer range, type and enabled state | automated — passing | Leaves 1 curve per run |
| AP2471_012 | Editing a saved curve's name and type through "Edit" stores the change and updates its list row | automated — passing | Creates its own curve instead of reusing AP2471_011's, so tests stay independent; leaves 1 curve per run |
| AP2471_013 | A blank name, a zero or negative term and an inverted odometer range cause no error page | automated — passing | Leaves 1 curve per run (attempt D) |
| AP2471_014 | Custom factors totalling 90%, a negative factor and an emptied factor box cause no error page | automated — passing | Leaves 1 curve per run |
| AP2471_015 | An admin can delete an earning curve they created | not selected | SKIPPED manually — no delete control on Dev (Q-002) |
| AP2471_016 | Switching typed Custom factors to Pro-Rata and back, then saving, stores exactly what the form showed | automated — passing | Leaves 1 curve per run |
| AP2471_017 | Shortening a saved 4-month Custom curve to 3 months stores exactly 3 factors | automated — passing | Leaves 1 curve per run |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | 1 | AdminFlow.loginToAdminPortal() | reused |
| AP2471_001 | 2 | EarningCurveFlow.verifyRiskManagementMenu() — AdminEarningCurvePage.lblRiskManagementHeading, lnkRiskManagementItems, lnkMenuEarningCurves | new |
| AP2471_001 | 3–4 | EarningCurveFlow.openEarningCurvesFromMenu() — AdminEarningCurvePage.clickMenuEarningCurves() (uses the existing `clickSidebarLink` helper) | new |
| AP2471_002 | 2–4 | EarningCurveFlow.verifyEarningCurvesListPage() — lnkListNavItems, lblColumnHeaders, lnkRowActions, lblRowEditTooltips | new |
| AP2471_003 | 2 | EarningCurveFlow.openCreateEarningCurve() | reused |
| AP2471_003 | 3–4 | EarningCurveFlow.verifyNewFormDefaults() — chkIsEnabled, lstTypeSelectOptions, lblPointsHeaders, lblPointNumbers · verifyMonthlyFactorsReadOnly(true) | new |
| AP2471_004 | 1–4 | openCreateEarningCurve() · verifyEarningCurveTable('Pro-Rata', 12) · selectEarningCurveType('Rule of 78' → 'Pro-Rata') · verifyEarningCurveTable('Pro-Rata', 12) | reused |
| AP2471_005 | 1–4 | openCreateEarningCurve() · selectEarningCurveType('Rule of 78') · verifyMonthlyFactorsReadOnly(true) · verifyEarningCurveTable('Rule of 78', 12) | reused · new |
| AP2471_006 | 1–4 | openCreateEarningCurve() · selectEarningCurveType('Reverse rule of 78') · verifyEarningCurveTable('Reverse rule of 78', 12) | reused |
| AP2471_007 | 1–5 | selectEarningCurveType('Rule of 78') · setTermMonth(24) · verifyEarningCurveTable(…, 24) · selectEarningCurveType('Pro-Rata') | reused |
| AP2471_008 | 1–4 | setTermMonth(1) · verifyEarningCurveTable(type, 1) × 3 · setTermMonth(60) · verifyEarningCurveTable('Rule of 78', 60) | reused |
| AP2471_009 | 1–5 | setTermMonth(4) · selectCustomType() · verifyMonthlyFactorsReadOnly(false) · enterMonthlyFactors() · markPageForReloadCheck() · replaceMonthlyFactors({1: 0.2500}) · verifyMonthlyFactors() · verifyNoPageReload() | reused · new |
| AP2471_010 | 1–5 | setTermMonth(4) · selectCustomType() · enterMonthlyFactors() · saveCustomEarningCurve() · openEarningCurveForEdit() · verifyStoredCurveFields() · verifyMonthlyFactors() | reused · new |
| AP2471_011 | 1–4 | setTermMonth(36) · verifyEarningCurveTable('Pro-Rata', 36) · saveNewEarningCurve(name, '0', '100000') · verifyListRow(name, 36, '0 - 100000', 'Pro-Rata', 'Yes') | reused · new |
| AP2471_012 | 1–4 | saveNewEarningCurve() · countEarningCurves() · reopenEarningCurve() · verifyStoredCurveFields() · selectEarningCurveType('Rule of 78') · renameEarningCurve() · saveEarningCurveChanges() · verifyListRow() · verifyNameNotListed() · verifyEarningCurveCount() | reused · new |
| AP2471_013 | 1–5 | countEarningCurves() · fillCurveDetails('') · verifySaveRefusedWithFieldError('earning_curve[name]', …) · typeInvalidTermMonth('0' / '-1', 12) · verifySaveRefusedWithFieldError('earning_curve[termMonth]', …) · saveNewEarningCurve(range, '50000', '10000') · verifyListRow() · verifyEarningCurveCount(count + 1) | reused · new |
| AP2471_014 | 1–5 | selectCustomType() · enterMonthlyFactors() · saveCustomEarningCurve() · replaceMonthlyFactors({3: −0.0500}) · saveEarningCurveChanges() · typeLettersIntoMonthlyFactor(3, 'abc') · verifySaveRefusedForBlankFactor(3, …) · reopenEarningCurve() · verifyMonthlyFactors() | reused · new |
| AP2471_016 | 1–5 | enterMonthlyFactors() · selectEarningCurveType('Pro-Rata') · verifyEarningCurveTable('Pro-Rata', 4) · selectCustomType() · verifyMonthlyFactors(zeros) · saveCustomEarningCurve() · verifyStoredCurveFields() | reused · new |
| AP2471_017 | 1–5 | saveCustomEarningCurve() · openEarningCurveForEdit() · setTermMonth(3) · verifyStoredCurveFields(3, …) · saveEarningCurveChanges() · verifyListRow(name, 3, …) | reused · new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lblRiskManagementHeading | `page.locator('h6.nav-link:has(i.fa-tachometer-alt-average)')` | /admin | 1 |
| lnkRiskManagementItems | `page.locator('ul.nav-dropdown-items:has(a[href="/admin/earning-curve"]) > li > a.nav-link')` | /admin | 4 items (Earning Curves, Sets, Groups, Assignments) — list locator |
| lnkMenuEarningCurves | `page.locator('a.nav-link[href="/admin/earning-curve"]')` | /admin | 1 |
| lnkListNavItems | `page.locator('main ul.nav a')` | /admin/earning-curve | 1 ("Create New") |
| lblColumnHeaders | `page.locator('main table thead th')` | /admin/earning-curve | 6 — list locator |
| lnkLastPage | `page.locator('.pagination a', { hasText: /^\s*Last\s*$/ })` | /admin/earning-curve | 1 |
| lnkRowActions · lblRowEditTooltips | `tblRows.locator('td:last-child a')` · `tblRows.locator('td:last-child [data-original-title="Edit"]')` | /admin/earning-curve | 1 per row |
| chkIsEnabled | `page.locator('input[name="earning_curve[isEnabled]"]')` | /admin/earning-curve/new/edit | 1 |
| lstTypeSelectOptions | `selType.locator('option')` | /admin/earning-curve/new/edit | 4 — list locator |
| lblPointsHeaders | `page.locator('form table thead th')` | /admin/earning-curve/new/edit | 3 — list locator |
| lblPointNumbers | `page.locator('tr.earning-curve-point-row > td:first-child')` | /admin/earning-curve/new/edit | 1 per row |
| fieldError(fieldName) | `input[name="<field>"]` → `xpath=ancestor::*[.//*[contains(@class,"form-error-message")]][1]` → `.form-error-message` | /admin/earning-curve/new/edit after a refused Save | 1 (Name; Term month) |

Counts were taken on Dev (v2dev) at about 2026-11-01T19:30Z by a temporary probe spec that logged in through the framework's own login flow, so no credential passed through the agent and no browser tab was opened by the agent. The probe clicked Save once with a blank Name (refused, nothing saved) and was deleted afterwards. The first run showed that the "Earning Curves" link is hidden until the collapsed sidebar section is opened, so `clickMenuEarningCurves()` uses the existing `clickSidebarLink()` helper from `src/core/utils/uiActions.ts` (imported, not changed).

## Files changed
| File | Change |
|---|---|
| src/pages/adminPortal/AdminEarningCurvePage.ts | added import of `clickSidebarLink`; added lblRiskManagementHeading, lnkRiskManagementItems, lnkMenuEarningCurves, lnkListNavItems, lblColumnHeaders, lnkLastPage, chkIsEnabled, lstTypeSelectOptions, lblPointsHeaders, lblPointNumbers, fieldError(), lnkRowActions, lblRowEditTooltips, clickMenuEarningCurves(), rowCells(), rowEditHref(), countAllCurves(), typeTermMonthNoRender(), fillName(), markPage(), pageMarkerPresent(), monthlyFactorsReadOnly(); no existing member changed |
| src/flows/EarningCurveFlow.ts | added verifyRiskManagementMenu(), openEarningCurvesFromMenu(), verifyEarningCurvesListPage(), verifyNewFormDefaults(), verifyMonthlyFactorsReadOnly(), markPageForReloadCheck(), verifyNoPageReload(), countEarningCurves(), verifyEarningCurveCount(), saveNewEarningCurve(), verifyListRow(), verifyNameNotListed(), renameEarningCurve(), verifyStoredCurveFields(), typeInvalidTermMonth(), verifySaveRefusedWithFieldError(); no existing method changed |
| src/tests/admin/earningCurveManagement_AP2471.spec.ts | new spec, `@admin @AP-2471`, 16 tests |

Not changed on purpose: `src/flows/AdminFlow.ts`, `src/flows/DealerFlow.ts`, `src/pages/adminPortal/index.ts`, `src/core/fixtures/test-fixtures.ts`, `src/core/utils/uiActions.ts` and every other file the QA had already changed. As for AP-2485 and AP-2486, the spec builds `EarningCurveFlow` from the `page` fixture. A diff against copies taken before editing shows only added lines in the two shared files.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2471`
Lint: pass · Run: 16 passed, 0 fixme, 2.4m. Environment: Dev (v2dev), the base URL the framework's gitignored `.env` sets (confirmed by the probe's host check). Nothing ran against staging.

Development runs: AP2471_001–009 ran 9 tests, 8 passed; AP2471_001 failed because the menu link was hidden in the collapsed sidebar, was fixed in one round and then passed. AP2471_010–017 ran once, 7 of 7 passed. The final full run above is the second pass for every test, so no test is flaky.

Reviewer R5: APPROVE, round 1, 0 blocker · 0 major · 4 minor (qa-artifacts/7-reviews/AP-2471_review.md).

## Pull request
PR skipped: gh CLI not installed

## Not passing
None.

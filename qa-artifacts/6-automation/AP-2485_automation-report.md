# Automation Report — AP-2485
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2485_2026-11-01.md
Spec: playwright-automation/src/tests/admin/earningCurveType_AP2485.spec.ts · Tag: @AP-2485
Result: 3 of 3 PASSED cases automated — 3 passing, 0 fixme

## Summary
All three manually passed re-test cases for AP-2485 now run automatically: the bug's own reproduction on the create page (saved and reopened), the Reverse rule of 78 and 24-month paths, and the existing curve's edit page. Each verification reads every Monthly and Cumulative factor on the form and compares it with values computed from the earning-curve formulas, so a regression of the bug fails the test. The specs ran against Dev (v2dev), the base URL the framework's gitignored `.env` already sets; nothing ran against staging. Earning curves had no page object yet, so one page object and one flow were added; no existing framework file was changed, because they all hold the QA's uncommitted work.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2485_001 | Switching a 12-month curve from Rule of 78 back to Pro-Rata shows and saves 0.0833 on every row | automated — passing | — |
| AP2485_002 | Switching from Reverse rule of 78 back to Pro-Rata regenerates at 12 months, and 24-month switching still works | automated — passing | — |
| AP2485_003 | On an existing 12-month Rule of 78 curve, changing the type to Pro-Rata saves Pro-Rata factors | automated — passing | — |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2485_001 | 1 | AdminFlow.loginToAdminPortal() · EarningCurveFlow.openCreateEarningCurve() · verifyEarningCurveTable('Pro-Rata', 12) | reused · new · new |
| AP2485_001 | 2 | EarningCurveFlow.selectEarningCurveType('Rule of 78') · verifyEarningCurveTable('Rule of 78', 12) | new |
| AP2485_001 | 3 | EarningCurveFlow.selectEarningCurveType('Pro-Rata') · verifyEarningCurveTable('Pro-Rata', 12) | new |
| AP2485_001 | 4 | EarningCurveFlow.saveEarningCurve(name, 12, 'Pro-Rata') · openEarningCurveForEdit(name) | new |
| AP2485_001 | 5 | EarningCurveFlow.verifyEarningCurveTable('Pro-Rata', 12) | new |
| AP2485_002 | 1 | AdminFlow.loginToAdminPortal() · EarningCurveFlow.openCreateEarningCurve() · verifyEarningCurveTable('Pro-Rata', 12) | reused · new · new |
| AP2485_002 | 2 | EarningCurveFlow.selectEarningCurveType('Reverse rule of 78') · verifyEarningCurveTable('Reverse rule of 78', 12) | new |
| AP2485_002 | 3 | EarningCurveFlow.selectEarningCurveType('Pro-Rata') · verifyEarningCurveTable('Pro-Rata', 12) | new |
| AP2485_002 | 4 | EarningCurveFlow.setTermMonth(24) · verifyEarningCurveTable('Pro-Rata', 24) · selectEarningCurveType('Rule of 78') · verifyEarningCurveTable('Rule of 78', 24) · selectEarningCurveType('Pro-Rata') | new |
| AP2485_002 | 5 | EarningCurveFlow.verifyEarningCurveTable('Pro-Rata', 24) — no Save | new |
| AP2485_003 | 1 | AdminFlow.loginToAdminPortal() · EarningCurveFlow.openCreateEarningCurve() | reused · new |
| AP2485_003 | 2 | EarningCurveFlow.selectEarningCurveType('Rule of 78') · saveEarningCurve(name, 12, 'Rule of 78') | new |
| AP2485_003 | 3 | EarningCurveFlow.openEarningCurveForEdit(name) · verifyEarningCurveTable('Rule of 78', 12) · selectEarningCurveType('Pro-Rata') · verifyEarningCurveTable('Pro-Rata', 12) | new |
| AP2485_003 | 4 | EarningCurveFlow.verifyDetailsKept(name) · saveEarningCurve(name, 12, 'Pro-Rata') · openEarningCurveForEdit(name, editUrl) — same id, one row | new |
| AP2485_003 | 5 | EarningCurveFlow.verifyEarningCurveTable('Pro-Rata', 12) | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lnkCreateNew | `page.locator('main a.btn.btn-primary[href="/admin/earning-curve/new/edit"]')` | /admin/earning-curve | 1 |
| tblRows → edit link | `page.locator('main table tbody tr').filter({ hasText: name }).locator('a[href$="/edit"]')` | /admin/earning-curve (checked on curve #14's row) | 1 |
| lblSaved | `page.locator('[role="alert"]', { hasText: 'Earning curve saved' })` | /admin/earning-curve after Save | 1 (asserted visible in every save; toBeVisible is strict) |
| lblHeading | `page.locator('main h1')` | /admin/earning-curve/new/edit | 1 |
| txtName | `page.locator('input[name="earning_curve[name]"]')` | /admin/earning-curve/new/edit | 1 |
| txtTermMonth | `page.locator('input[name="earning_curve[termMonth]"]')` | /admin/earning-curve/new/edit | 1 |
| txtOdometerFrom | `page.locator('input[name="earning_curve[coverageOdometerFrom]"]')` | /admin/earning-curve/new/edit | 1 |
| txtOdometerTo | `page.locator('input[name="earning_curve[coverageOdometerTo]"]')` | /admin/earning-curve/new/edit | 1 |
| selType | `page.locator('select[name="earning_curve[type]"]')` | /admin/earning-curve/new/edit | 1 |
| btnTypeToggle | `page.locator('.bootstrap-select:has(select[name="earning_curve[type]"]) button.dropdown-toggle')` | /admin/earning-curve/new/edit | 1 |
| lstTypeOptions | `page.locator('.dropdown-menu.show a.dropdown-item')` filtered by exact label | /admin/earning-curve/new/edit, menu open | 4 options (Pro-Rata · Rule of 78 · Reverse rule of 78 · Custom); 1 per label |
| txtMonthlyFactors | `page.locator('input[name$="[monthlyFactor]"]')` | /admin/earning-curve/new/edit | 12 (one per row — a list by design) |
| txtCumulativeFactors | `page.locator('input[name$="[cumulativeFactor]"]')` | /admin/earning-curve/new/edit | 12 (one per row — a list by design) |
| btnSave | `page.locator('button[name="earning_curve[save]"]')` | /admin/earning-curve/new/edit | 1 |

Counts were taken on Dev (v2dev) at 2026-11-01T03:42Z by a temporary probe spec that logged in through the framework's own `getCredentials`, so no credential passed through the agent; the probe saved nothing and was deleted afterwards.

## Files changed
| File | Change |
|---|---|
| src/pages/adminPortal/AdminEarningCurvePage.ts | new — list and create/edit form locators; openList(), openCreatePage(), rowByName(), openEditPage(), selectType(), setTermMonth() (both wait for the server re-render), selectedTypeLabel(), monthlyFactors(), cumulativeFactors(), fillDetails(), save() |
| src/flows/EarningCurveFlow.ts | new — expectedFactors() oracle and EarningCurveFlow: openCreateEarningCurve(), selectEarningCurveType(), setTermMonth(), verifyEarningCurveTable(), saveEarningCurve(), openEarningCurveForEdit(), verifyDetailsKept() |
| src/tests/admin/earningCurveType_AP2485.spec.ts | new spec, `@admin @AP-2485`, 3 tests |

Not changed on purpose: `src/flows/AdminFlow.ts`, `src/pages/adminPortal/index.ts` and `src/core/fixtures/test-fixtures.ts` hold the QA's uncommitted work, so the new page object is imported by path and the spec builds `EarningCurveFlow` from the `page` fixture (reviewer R5 F-1).

## Run
Command: `npx playwright test --project=chromium --grep @AP-2485`
Lint: pass · Run: 3 passed, 0 fixme, 27.6s (reviewer re-run with `--repeat-each=2`: 6 passed, 56.9s, no flaky tests). Environment: Dev (v2dev) — the base URL set by the framework's gitignored `.env` (ENV_NAME Dev); nothing ran against staging.

Test data: each run of AP2485_001 and AP2485_003 leaves one curve each (`QA-AP2485-Repro-<epoch ms>`, `QA-AP2485-Edit-<epoch ms>`, 12 months, Pro-Rata, odometer 0 – 10000). The three runs today left 6 such curves on Dev, in addition to the manual run's #14 and #15.

## Pull request
PR skipped: gh CLI not installed (vcs preflight failed); run with --no-pr

## Not passing
None.

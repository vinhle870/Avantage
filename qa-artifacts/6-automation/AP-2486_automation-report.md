# Automation Report — AP-2486
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2486_2026-11-01.md
Spec: playwright-automation/src/tests/admin/earningCurveEmptyFactor_AP2486.spec.ts · Tag: @AP-2486
Result: 3 of 3 PASSED cases automated — 3 passing, 0 fixme

## Summary
All three manually passed cases for AP-2486 now run automatically: the bug's own steps on the edit page (one Monthly Factor box cleared), the original trigger on the create page (letters typed into the number box), and the normal Custom save on edit. The two empty-box tests read the HTTP status of the Save request and fail on HTTP 500 or on the French "technical difficulties" page; they also check that "This value should not be blank." appears under the empty box only, and that the refused save stored nothing. The spec reuses the earning-curve page object and flow added for AP-2485 and ran against Dev (v2dev), the base URL that the framework's gitignored `.env` sets. Nothing ran against staging.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2486_001 | Saving a Custom curve after clearing one Monthly Factor box no longer shows the HTTP 500 error page | automated — passing | — |
| AP2486_002 | Creating a new Custom curve with letters typed into a Monthly Factor box no longer shows the error page | automated — passing | — |
| AP2486_003 | Editing a Custom curve with every Monthly Factor filled still saves and keeps the new values | automated — passing | — |

## Step map
| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| AP2486_001 | 1 | AdminFlow.loginToAdminPortal() · EarningCurveFlow.openCreateEarningCurve() | reused |
| AP2486_001 | 2 | EarningCurveFlow.setTermMonth(4) · selectCustomType() · enterMonthlyFactors([0.4000, 0.3000, 0.2000, 0.1000]) · saveCustomEarningCurve(name, 4) | reused · new · new · new |
| AP2486_001 | 3 | EarningCurveFlow.openEarningCurveForEdit(name) · verifyMonthlyFactors(...) · clearMonthlyFactor(3) | reused · new · new |
| AP2486_001 | 4 | EarningCurveFlow.verifySaveRefusedForBlankFactor(3, "Earning curve #{id}") — HTTP 200, no error page, message under row 4 only | new |
| AP2486_001 | 5 | EarningCurveFlow.reopenEarningCurve(name, editUrl) · verifyMonthlyFactors([0.4000, 0.3000, 0.2000, 0.1000]) | new |
| AP2486_002 | 1 | AdminFlow.loginToAdminPortal() · EarningCurveFlow.openCreateEarningCurve() | reused |
| AP2486_002 | 2 | EarningCurveFlow.setTermMonth(4) · selectCustomType() · enterMonthlyFactors(...) · typeLettersIntoMonthlyFactor(3, 'abc') · fillCurveDetails(name) | reused · new · new · new · new |
| AP2486_002 | 3 | EarningCurveFlow.verifySaveRefusedForBlankFactor(3, "Create earning curve") | new |
| AP2486_002 | 4 | EarningCurveFlow.verifyEarningCurveNotListed(name) | new |
| AP2486_003 | 1 | AdminFlow.loginToAdminPortal() · EarningCurveFlow.openCreateEarningCurve() | reused |
| AP2486_003 | 2 | EarningCurveFlow.setTermMonth(4) · selectCustomType() · enterMonthlyFactors(...) · saveCustomEarningCurve(name, 4) | reused · new · new · new |
| AP2486_003 | 3 | EarningCurveFlow.openEarningCurveForEdit(name) · replaceMonthlyFactors({2: 0.1500, 3: 0.1500}) · verifyMonthlyFactors(monthly, cumulative) · saveEarningCurveChanges(name) | reused · new · new · new |
| AP2486_003 | 4 | EarningCurveFlow.openEarningCurveForEdit(name, editUrl) — same id · verifyMonthlyFactors([0.4000, 0.3000, 0.1500, 0.1500], [0.4000, 0.7000, 0.8500, 1.0000]); one list row checked in saveEarningCurveChanges() | reused · new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lblFieldErrors | `page.locator('.invalid-feedback')` | /admin/earning-curve/new/edit after a refused Save | 1 (one empty box) |
| monthlyFactorError(row) | `page.locator('td:has(> input[name="earning_curve[points][${row}][monthlyFactor]"]) .form-error-message')` | /admin/earning-curve/new/edit after a refused Save, row index 3 | 1 |
| lblServerError | `page.getByText(/éprouve des difficultés techniques/)` | /admin/earning-curve/new/edit after Save | 0 — a negative check: the bug's error page must not appear, so a count of 1 cannot be shown on the fixed build. The text is quoted from the test cases' description of the error page |
| Custom type option | existing `lstTypeOptions` filtered by "Custom" via `selectType('Custom')` | /admin/earning-curve/new/edit, menu open | 1 (recorded for AP-2485) |
| txtMonthlyFactors.nth(row) | existing `txtMonthlyFactors` | /admin/earning-curve/new/edit, Term month 4, Custom | 4 rows, 1 per index; editable (no `readonly`) |

Counts were taken on Dev (v2dev) at 2026-11-01T14:36Z by a temporary probe spec that logged in through the framework's own `getCredentials`, so no credential passed through the agent. The probe was deleted afterwards. Its first two runs typed letters into a box that still held the Custom default `0.0000`, so the box was never empty and the Save went through: they saved curves #24 `QA-AP2486-Probe-1793543729839` and #25 `QA-AP2486-Probe-1793543778305` (term 4, Custom 0.4000 / 0.3000 / 0.2000 / 0.0000). The fix — clear the box before typing — is in `typeIntoMonthlyFactor()`.

## Files changed
| File | Change |
|---|---|
| src/pages/adminPortal/AdminEarningCurvePage.ts | added lblFieldErrors, lblServerError, monthlyFactorError(), fillMonthlyFactor(), clearMonthlyFactor(), typeIntoMonthlyFactor(), saveAndGetStatus(); no existing member changed |
| src/flows/EarningCurveFlow.ts | added selectCustomType(), enterMonthlyFactors(), replaceMonthlyFactors(), clearMonthlyFactor(), typeLettersIntoMonthlyFactor(), fillCurveDetails(), saveCustomEarningCurve(), saveEarningCurveChanges(), verifySaveRefusedForBlankFactor(), verifyMonthlyFactors(), reopenEarningCurve(), verifyEarningCurveNotListed(); no existing method changed |
| src/tests/admin/earningCurveEmptyFactor_AP2486.spec.ts | new spec, `@admin @AP-2486`, 3 tests |

Not changed on purpose: `src/flows/AdminFlow.ts`, `src/pages/adminPortal/index.ts` and `src/core/fixtures/test-fixtures.ts` hold the QA's uncommitted work. As for AP-2485, the spec builds `EarningCurveFlow` from the `page` fixture.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2486`
Lint: pass · Run: 3 passed, 0 fixme, 32.1s. A re-run with `--repeat-each=2` gave 6 passed in 1.0m, with no flaky tests. Environment: Dev (v2dev), the base URL set by the framework's gitignored `.env`. Nothing ran against staging.

Test data: each run of AP2486_001 and AP2486_003 leaves one Custom curve each (`QA-AP2486-Retest-<epoch ms>`, `QA-AP2486-Valid-<epoch ms>`, term 4, odometer 0 – 60000), because earning curves cannot be deleted. AP2486_002 saves nothing. Today's three spec runs left 6 such curves on Dev, as well as the two probe curves (#24, #25) and the manual run's #22 and #23. No curve the spec did not create was opened for editing.

Reviewer R5: APPROVE, round 1, 0 blocker · 0 major · 2 minor (qa-artifacts/7-reviews/AP-2486_review.md).

## Pull request
PR skipped: gh CLI not installed (vcs preflight failed); run with --no-pr

## Not passing
None.

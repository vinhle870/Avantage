# Automation Report — AP-2495
Date: 2026-11-04 (R5 rework round 1, runs ended 2026-11-04T17:35:20Z) · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2495_2026-11-04.md
Spec: playwright-automation/src/tests/dealer/vehicleDetails_AP2495.spec.ts · Tag: @AP-2495
Result: 4 of 4 PASSED cases automated — 4 passing, 0 fixme

## Summary
All four AP-2495 cases run automatically on Dev:
- the vehicle details page opened by URL
- its three tabs (Details, Window sticker, Quotes)
- the page opened from two Inventory rows
- the two header actions (Create quote, Edit vehicle)

The tests fail only on the faults the test cases judge. Everything else is recorded as a Playwright annotation (`test.info().annotations`), visible in the HTML / JSON report. The specs are read-only: they never fill in or save a form, and they create no quote or vehicle. No assertion depends on the UI language (English or French).

**Hard assertions (fail the test):**
- an HTTP 5xx, on each page request and on any response of the test (collector)
- the "Too few arguments to function" text or the French "difficultés techniques" page, on any page
- the details summary not showing V's VIN, or (AP2495_003) the VIN of the Inventory row it was opened from
- no form visible after "Create quote"
- the Edit vehicle modal not visible
- AP2495_004 ending with a summary that differs from the one read at the start

**Recorded, not judged:**
- URLs and HTTP statuses below 500, and the page heading
- each tab's URL, label and content; a missing tab (recorded, and the test continues)
- the Create quote URL compared with the documented `/quote/new/client?fromVehicleId={V}`, the quote_client form, and the sidebar Vehicle card
- the Edit vehicle requests, URL, modal title, form and VIN field value
- whether Escape closed the modal
- which vehicle was used as V, A and B, and the Inventory page each was found on

## R5 rework round 1 — what changed
| Finding | Fix |
|---|---|
| F-1 (Major) | Assertions cut to the hard list above. The Create quote URL and Vehicle card, the edit modal title and VIN field, the details / tab URLs and headings, the tab labels and content, and the "Window sticker" / "Quotes" contents are now annotations. A missing tab is annotated and skipped. HTTP status `toBe(200)` checks became `< 500` checks, and each status is recorded. The VIN check reads `summary contains <VIN>`, without the English "VIN:" label. `VehicleDetailsPage.clickAndWaitForNavigation()` waits for the next main-frame document response (3xx skipped) and `framenavigated`, with no URL filter. Tabs, Create quote and the Inventory row all use it. The Edit vehicle wait no longer filters on `/edit`: it waits for the modal to be visible, records every document / XHR / fetch response seen meanwhile, and checks each is below 500. `openInventory()` no longer asserts the "Vehicle Inventory" heading (the locator was removed). |
| F-2 (Minor) | Changed to locale-free locators. The pagination is now read from every `main .pagination a[href*="page="]` link (the highest `page=N`), not the "Last" link text. The VIN cell is `td` nth(1) in both `vinCell()` and `readInventoryRows()`. Both are in the New locators table below with their counts. |
| F-3 (Minor) | `pickVehicleB()` has no page cap. It pages until the last page, reading the last page number again on every page. `findInventoryRowByVin()` does the same. |

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2495_001 | Opening the vehicle details page by URL shows the vehicle instead of the server error | automated — passing | — |
| AP2495_002 | Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error | automated — passing | — |
| AP2495_003 | Opening a vehicle from the Inventory list shows its details page, for vehicle V and for a second vehicle | automated — passing | — |
| AP2495_004 | The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error | automated — passing | — |

## Step map
Hard = fails the test. Rec = annotation only.

| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | DealerFlow.loginToDealerPortal() | reused |
| all | V resolution (001 step 2 fallback) | VehicleDetailsFlow.resolveVehicleV() — 915 when it answers; on 404 / "not found", Inventory search by VIN, then the Vehicle B rule. Hard: no 5xx, no error text. Rec: V's id, VIN and reason | new |
| AP2495_001 | 2 | openVehicleDetails() — Hard: page request < 500. Rec: URL, HTTP status | new |
| AP2495_001 | 3 | verifyDetailsPage() — Hard: no error text, summary contains V's VIN; verifyNoServerError(). Rec: URL, heading | new |
| AP2495_002 | 1 | openVehicleDetails() | new |
| AP2495_002 | 2 | clickTab(v, 'Window sticker') — Hard: < 500, no error text. Rec: URL, status, label, tab heading, window_sticker form shown/absent; missing tab → recorded, skipped | new |
| AP2495_002 | 3 | clickTab(v, 'Quotes') — Hard: < 500, no error text. Rec: URL, status, label, number of quote rows | new |
| AP2495_002 | 4 | clickTab(v, 'Details') — Hard: < 500, no error text, summary contains V's VIN. Rec: URL, status, label, summary | new |
| AP2495_002 | 5 | verifyNoServerError() (collector) | new |
| AP2495_003 | 1 | openInventory() — Hard: < 500, no error text | new |
| AP2495_003 | 2 | findInventoryRowByVin(vin, true, id), paging to the last page → openFromInventoryRow(v): clicks the row's VIN cell. Hard: < 500, no error text, details summary contains the row's VIN. Rec: page found on, URL, status, heading | new |
| AP2495_003 | 3 | pickVehicleB(excluded), no page cap → openFromInventoryRow(b). None qualifies → annotated, Vehicle A judged alone. Rec: B's id, VIN, page | new |
| AP2495_003 | 4 | verifyDetailsPage() inside openFromInventoryRow() + verifyNoServerError() | new |
| AP2495_004 | 1 | openVehicleDetails() — keeps the summary text | new |
| AP2495_004 | 2 | openCreateQuoteForm() — Hard: < 500, no error text, a visible form in `main`. Rec: URL vs documented `/quote/new/client?fromVehicleId={V}`, status, quote_client form, sidebar Vehicle card with V's VIN | new |
| AP2495_004 | 3 | goBackToDetails() (Hard: Back response < 500, summary contains V's VIN) → openEditVehicleModal(). Hard: modal visible, no error text, every response seen < 500. Rec: requests and statuses, URL, modal title, form, VIN field value | new |
| AP2495_004 | 4 | closeEditVehicleModal() — Escape (the modal has no Cancel / ×; the manual run's "Back" link went to /vehicle/inventory). Rec: closed or not, URL | new |
| AP2495_004 | 5 | verifyVehicleUnchanged() — Hard: reload < 500, no error text, summary identical to step 1; verifyNoServerError() | new |

## New locators
All were verified on Dev (v2dev) on vehicle 915. Each has count 1 unless the Count column says otherwise: tab links are counted inside the tab list, Inventory cells inside one row. None is text-based.

| Name | Expression | Page | Count |
|---|---|---|---|
| lblHeading | `main nav h1` (recorded only) | /vehicle/915/details (also /window-sticker, /quotes) | 1 |
| lblSummary | `main .card-body p` (first) | /vehicle/915/details | 1 |
| lstTabs | `main ul.nav-tabs` | /vehicle/915/details | 1 |
| tab(name) | `main ul.nav-tabs a.nav-link[href$="/details" \| "/window-sticker" \| "/quotes"]` (locates the link; no wait filters on it) | /vehicle/915/* | 1 each |
| lnkActiveTab | `main ul.nav-tabs a.nav-link.active` (recorded only) | /vehicle/915/* | 1 |
| lblTabHeading | `main h3` (recorded only) | /vehicle/915/window-sticker | 1 |
| frmWindowSticker | `main form[name="window_sticker"]` (recorded only) | /vehicle/915/window-sticker | 1 |
| rowsVehicleQuotes | `main table tbody tr` (recorded only) | /vehicle/915/quotes | 10 (2026-11-04) |
| lnkEditVehicle | `main nav a[href$="/edit"]` | /vehicle/915/details | 1 |
| lnkCreateQuote | `main nav a[href^="/quote/new/client?fromVehicleId="]` | /vehicle/915/details | 1 |
| mdlEditVehicle | `#myModal.show` | /vehicle/915/details after "Edit vehicle" | 1 |
| lblEditVehicleTitle | `#myModal.show h1` (recorded only) | same | 1 |
| frmEditVehicle | `#myModal.show form[name="vehicle"]` (recorded only) | same | 1 |
| txtEditVehicleVin | `#myModal.show #vehicle_VIN` (recorded only) | same | 1 |
| frmVisibleInMain | `main form` filtered to visible, first | /quote/new/client?fromVehicleId=915 | 1 (after filter) |
| frmQuoteClient | `main form[name="quote_client"]` (recorded only) | /quote/new/client?fromVehicleId=915 | 1 |
| crdQuoteVehicle | `aside #timeline` (recorded only) | /quote/new/client?fromVehicleId=915 | 1 |
| rowsInventory | `main table tbody tr` | /vehicle/inventory | 10 per page (scoped by id) |
| inventoryRowById(id) | rows filtered by `td[data-href="/vehicle/{id}/details"]` | /vehicle/inventory | 1 |
| vinCell(row) | `td` nth(1) of the row — used to read the VIN (readInventoryRows) and to click | /vehicle/inventory | 1 per row; matched the row's VIN for 915 (page 21) and 1142 (page 1) in both runs |
| lnkInventoryPages | `main .pagination a[href*="page="]` — highest `page=N` is the last page (no "Last" / "Dernière" text) | /vehicle/inventory | 11 links on 2026-11-04, highest page=54 |

Removed: `lblInventoryHeading` (`main h1`, its English heading assertion was dropped) and `tblVehicleQuotes` (replaced by `rowsVehicleQuotes`).

## Files changed
| File | Change |
|---|---|
| playwright-automation/src/pages/dealerPortal/VehicleDetailsPage.ts | new page object (reworked): vehicle details page, tabs, header actions, Edit vehicle modal, quote page form and sidebar card, Inventory rows and pagination. Generic navigation wait. Not exported from `index.ts`, so the QA's files stay untouched |
| playwright-automation/src/flows/VehicleDetailsFlow.ts | new flow (reworked): V resolution with the 404 fallback, tab / inventory / header-action steps, hard assertions limited to the cases' objective faults, annotations for everything recorded, 5xx collector, uncapped Inventory paging |
| playwright-automation/src/tests/dealer/vehicleDetails_AP2495.spec.ts | new spec (unchanged in this round): 4 tests, `@dealer @AP-2495`, skips itself unless BASE_URL is v2dev |

No existing file was modified.

## Run
Command: `npx playwright test --project=chromium --grep @AP-2495`. The suite is read-only, so the two runs were separate.

Lint (`npx tsc --noEmit`): pass.

| Run | Result | Duration | Ended (UTC) |
|---|---|---|---|
| Run 1 | 4 passed | 55.5 s | 2026-11-04T17:34:12Z |
| Run 2 | 4 passed | 55.5 s | 2026-11-04T17:35:20Z |

No flaky test, and no fix round was needed after the rework.

Recorded values (identical in both runs):
- **V:** 915, default, HTTP 200.
- **Tabs:** Window sticker HTTP 200, `/vehicle/915/window-sticker`, form shown. Quotes HTTP 200, `/vehicle/915/quotes`, 10 rows. Details HTTP 200, `/vehicle/915/details`.
- **Inventory:** Vehicle A 915 on page 21 of 54. Vehicle B 1142 (VIN AP2497A3811007474) on page 1. Both details pages HTTP 200.
- **Create quote:** `/quote/new/client?fromVehicleId=915` (as documented), quote_client form shown, Vehicle card shows VIN 1FAHP35NX8W239204.
- **Edit vehicle:** GET /vehicle/915/edit HTTP 200, title "Vehicle #915", VIN field 1FAHP35NX8W239204, closed with Escape.

Earlier round (before R5): one fix round was needed because the Dev Inventory holds two vehicles with VIN `1FAHP35NX8W239204`, 915 and 1081 (page 7). The search therefore matches both VIN and id, and the row is selected by its `data-href` id.

## Pull request
Reviewer R5: APPROVE (round 2) — 0 blocking, 0 major, 1 minor finding open: F-4, the 5xx checks also see third-party requests such as Cloudflare `/cdn-cgi/rum` and the chat widget, so a 5xx from one of them would fail a test although the application is fine. This goes into the PR body under known limitations.

PR skipped: workbench not clean (checked 2026-11-05 with `--pr-only`), and `vcs.preflight` failed.
- **Workbench:** `git diff --quiet origin/dev -- playwright-automation` fails. 208 tracked files under `playwright-automation/` differ between the local `main` commit 22fa313 and `origin/dev` (ddf24d1): 145 added, 34 modified and 29 deleted, among them the framework's `.claude/skills/`, the `allure-results` XML files and `tsc_errors.txt`. The framework this spec runs on is therefore not the one on `dev`, and a PR into `dev` holding only the three AP-2495 files would not reflect what was tested. The untracked files are only the three AP-2495 files.
- **GitHub CLI:** `bash tools/gh-cli/gh.sh auth status` reports "You are not logged into any GitHub hosts". `origin/dev` itself is reachable.

No branch, worktree or commit was created, and nothing in the workbench was changed. The three files stay untracked in `playwright-automation/`. To open the PR: push the framework commit to `dev` (or merge `main` into `dev`) so the workbench equals `origin/dev`, run `bash tools/gh-cli/gh.sh auth login`, then re-run `stlc-test-automator AP-2495 --pr-only`.

## Not passing
None.

## Notes for the reviewer
- **Read-only.** No test clicks a Save button:
  - "Create quote" only opens the client form.
  - The Edit vehicle modal is closed with Escape.
  - The Window sticker form is only counted.

  AP2495_004 reloads the details page at the end and compares its summary (brand, model, year, VIN, mileage, designation) with the one read at the start.
- **Edit vehicle requests.** The recorder captures every document / XHR / fetch response between the click and the modal, so the chat widget's requests (`/widget/config_iframe.html`, `/app/services/app/webchat/…/config`) appear next to `GET /vehicle/915/edit`. A 5xx from any of them would fail the test, as it would through the whole-test collector.
- **Vehicle V.** 915 is a hint, not a hard dependency. When `/vehicle/915/details` answers 404 or shows a "not found" page, `resolveVehicleV()` pages the Inventory for VIN `1FAHP35NX8W239204`, then falls back to the Vehicle B rule. A 5xx or the error text never triggers the fallback; it fails the test as the defect.
- **Vehicle B** is picked each run by the case's rule: the first Inventory row, from page 1 to the last page, whose id is not 915, not V, and not 1067, 1082–1097, 1106–1118 or 1125–1135. If none qualifies, the test annotates it and judges Vehicle A alone.
- **Inventory paging.** The list has no search box, so finding V walks the pages read-only. 915 is on page 21 of 54, and AP2495_003 takes about 33 s.
- **Left on the environment:** nothing.

# Test Cases — AP2495 (File 1 of 1)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2495 — Cannot view vehicle detail's page (bug re-test)
**Source:** requirements/AP-2495-cannot-view-vehicle-detail-page.md
**Date:** 2026-11-01 (revised 2026-11-04)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2495_001 to AP2495_004 (4 test cases)
**Coverage:** Re-test · Regression

> **Bug re-test flow.** AP-2495 is a bug, so the pipeline skipped requirements analysis
> and the test plan. Every case below is derived directly from the raw requirement
> capture — no formal requirements analysis exists for this spec.
>
> **What the ticket states, and nothing more.** The ticket has no steps to reproduce and
> no Expected Result. It states two things: the summary _"Cannot view vehicle detail's
> page"_, and the PHP error _"Too few arguments to function
> App\Controller\BaseController::__construct(), 2 passed in
> /var/www/html/src/Controller/Vehicle/TabsTrait.php on line 24 and exactly 3 expected"_.
> So a step **fails** only on an objective fault: the vehicle page (or a tab of it) does
> not open, the server answers HTTP 5xx, the generic error page or the PHP error text is
> shown, or the page shows a different vehicle from the one opened. Everything else a step
> sees — which tabs and buttons are present, where they lead, what the page lists — is
> **recorded**, not judged, because the ticket says nothing about it.

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Environment** | **Dev** — `https://v2dev.garantieavantageplus.ca` (the `execution_env` of `qa-artifacts/qa-config/tools.md`; URLs and account from the "Dev Environment" section of the `env` source). Every URL below is on Dev. | `tools.md`, `env` |
| **Entry route** | `/vehicle/{V}/details` — Vehicle Details page of the vehicle under test **V** (see *Test data*), opened by URL. The same page is reached from the sidebar **Vehicles → Inventory** (`/vehicle/inventory`) and from a quote's hub (`/quote/{id}/details` → vehicle name link → `/vehicle/{vehicleId}/details`). The sidebar collapses its sub-menus, so navigate by URL when a link is hidden. | `navigation`, `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Login** | Dealer portal at `https://v2dev.garantieavantageplus.ca/login` with the dealer account of the `env` source's "Dev Environment" section — `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`. The dashboard greeting on Dev is not documented: record the dealership name and Dealer ID shown after sign-in. | `env` |
| **Test data** | **Vehicle under test V.** Default: vehicle **915** — VIN `1FAHP35NX8W239204`, Ford Focus 2008, 5000 km, designation COMMERCIAL, documented on staging with three tabs (**Details**, **Window sticker**, **Quotes**) and two header actions (**Edit vehicle**, **Create quote**). Its presence on Dev is not verified. **Fallback** (apply once, in AP2495_001 step 2, and reuse the result in 002–004): if `/vehicle/915/details` answers HTTP 404 or shows a "not found" / "introuvable" page — with no 5xx and no error text, so it is *not* this defect — then (a) search `/vehicle/inventory` read-only for VIN `1FAHP35NX8W239204` and, if found, use that vehicle's id as V; else (b) use the vehicle picked by the **Vehicle B rule** below as V. Record V's id and VIN and the reason the fallback was used. V is read-only in every case — never click "Save" on any form opened from it. | `test-data`, `env` |
| **Vehicle B rule** | The first row of the Dev Inventory list (`/vehicle/inventory`, read-only paging or search, never "newest") whose id is **not** 915, not V, and **not** one of 1067, 1082–1097, 1106–1118, 1125–1135 (ids other tickets reserve). Record its id and VIN. If no such row exists, record why. | `test-data` (reserved ids) |
| **Language** | Dealer UI in English or French depending on the session (`?_locale=en` / `?_locale=fr`); leave it as found. The generic server error page is French: "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." | `navigation`, `domain` |
| **Leaves behind** | Nothing. Every case is read-only: no form is saved and no record is created. | — |
| **Build under test** | Dev (`v2dev`) carries the AP-2495 fix: the ticket's deployment panel records it deployed to the **"develop"** environment on 2026-10-15. The ticket's status is "QA", not "QC"; by the user's decision for this batch the cases run now on Dev regardless. An error on Dev (5xx, the generic error page or the "Too few arguments" text) is a **FAIL against AP-2495** — record the environment, the date and the UTC time of the failing request. | tracker fields (capture), user decision |

**What counts as the defect.** Any of: the server answers the page request with HTTP 500
(or another 5xx); the French "Erreur — Désolé, l'application éprouve des difficultés
techniques" page appears; or the text "Too few arguments to function" appears anywhere on
the page. Record the HTTP status of the page's main document request in every step that
opens a page. An HTTP 404 / "not found" page for vehicle 915 is **not** the defect — it
triggers the fallback above.

**Routes not mapped yet.** The URLs of the "Window sticker" and "Quotes" tabs and the
Inventory row links are not in the `domain` notes. Record each URL as you reach it, and
write the new routes back to `domain` as dated Dev entries per `qa-docs/_mapping-guide.md`
after the run.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2495_001 | Opening the vehicle details page by URL shows the vehicle instead of the server error | Re-test | High | PASS |
| AP2495_002 | Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error | Regression | High | PASS |
| AP2495_003 | Opening a vehicle from the Inventory list shows its details page, for vehicle V and for a second vehicle | Regression | Medium | PASS |
| AP2495_004 | The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2495_001 — Opening the vehicle details page by URL shows the vehicle instead of the server error

| Field | Value |
|---|---|
| **TC ID** | AP2495_001 |
| **Title** | Opening the vehicle details page by URL shows the vehicle instead of the server error |
| **Requirement** | AP2495 — Summary _"Cannot view vehicle detail's page"_ and description _"Too few arguments to function App\Controller\BaseController::__construct(), 2 passed in /var/www/html/src/Controller/Vehicle/TabsTrait.php on line 24 and exactly 3 expected"_ |
| **Route** | `/login` → `/vehicle/915/details` (or `/vehicle/{V}/details` after the fallback) |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (https://v2dev.garantieavantageplus.ca) |
| **Result** | PASS — /vehicle/915/details HTTP 200, VIN 1FAHP35NX8W239204 shown, no error text (16:51:50Z) |

**Why this matters:** This is the defect as reported: a dealer who opens a vehicle's details page gets a crash instead of the vehicle. The details page is also the entry point from which a dealer starts a new quote for a vehicle (`/vehicle/{id}/details` → "Create quote"), so if this page is down, that path is down with it.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle V | 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008; or the fallback vehicle (Execution Context → *Test data*) |
| URL | `https://v2dev.garantieavantageplus.ca/vehicle/915/details` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `https://v2dev.garantieavantageplus.ca/login` and sign in with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]` (env source, "Dev Environment") | The dealer dashboard opens. Record the dealership name and Dealer ID shown. |
| 2 | Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` in the address bar and wait for the page to finish loading. If it answers HTTP 404 or shows a "not found" page (no 5xx, no error text), apply the fallback: search `https://v2dev.garantieavantageplus.ca/vehicle/inventory` read-only for VIN `1FAHP35NX8W239204`; if absent, pick a vehicle by the Vehicle B rule. Record V's id and VIN and the reason, then open `/vehicle/{V}/details` | A details page loads for V. Record the URL and the HTTP status of the page request (and of the 404 request, if the fallback was used). |
| 3 | [Verification] Read the page: its heading or vehicle summary, the VIN shown, any tabs and any header buttons. Search the page text for "Too few arguments" and "difficultés techniques" | The page request did not return HTTP 5xx; neither the French "Erreur — Désolé, l'application éprouve des difficultés techniques" page nor the text "Too few arguments to function" is shown; and the page shows vehicle V's VIN (`1FAHP35NX8W239204` for 915). Record (do not judge) which tabs and header buttons are present. The case **fails** on a 5xx, either error text, or a different vehicle — record environment Dev, the date and UTC time. |

---

### AP2495_002 — Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error

| Field | Value |
|---|---|
| **TC ID** | AP2495_002 |
| **Title** | Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error |
| **Requirement** | AP2495 — description: the error is raised in `src/Controller/Vehicle/TabsTrait.php` on line 24, the code behind the vehicle page's tabs |
| **Route** | `/vehicle/{V}/details` → "Window sticker" tab → "Quotes" tab → "Details" tab |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (https://v2dev.garantieavantageplus.ca) |
| **Result** | PASS — Window sticker, Quotes and Details tabs all HTTP 200, no error text (16:52:22Z) |

**Why this matters:** The ticket's error comes from the shared code that builds the vehicle page's tabs, not from the Details tab alone. A fix applied only to the Details page would leave the Window sticker and Quotes tabs crashing the same way. This case opens every tab the page offers.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle V | As resolved in AP2495_001 step 2 — 915 (VIN `1FAHP35NX8W239204`) or the recorded fallback vehicle |
| Tabs documented in `test-data` (staging) | Details · Window sticker · Quotes |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the dealer portal at `https://v2dev.garantieavantageplus.ca/login` with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`, then open `https://v2dev.garantieavantageplus.ca/vehicle/{V}/details` | The Vehicle Details page of V loads (showing V's VIN) without an error page. |
| 2 | Click the "Window sticker" tab | The tab opens without an error page. Record the URL, the page request's HTTP status, and what the tab shows (for example a sticker preview or a download). If the tab opens a file or a new browser tab, record that. |
| 3 | Click the "Quotes" tab | The tab opens without an error page. Record the URL, the HTTP status, and how many quotes it lists. Do not open or change any quote. |
| 4 | Click the "Details" tab | The page returns to V's details without an error page. Record the URL and HTTP status. |
| 5 | [Verification] Review the three tab openings recorded in steps 2–4 | No tab request returned HTTP 5xx, and no tab showed the French "difficultés techniques" page or the text "Too few arguments to function". If a tab named in `test-data` is not on the page, record that it is missing (do not fail on it — the ticket does not list the tabs). The case **fails** on a 5xx or either error text on any tab — record environment Dev, the date and UTC time. |

---

### AP2495_003 — Opening a vehicle from the Inventory list shows its details page, for vehicle V and for a second vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2495_003 |
| **Title** | Opening a vehicle from the Inventory list shows its details page, for vehicle V and for a second vehicle |
| **Requirement** | AP2495 — Summary _"Cannot view vehicle detail's page"_ (no particular vehicle is named, so the page must open for any vehicle of the dealer) |
| **Route** | Sidebar **Vehicles → Inventory** (`/vehicle/inventory`) → vehicle row → `/vehicle/{id}/details` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (https://v2dev.garantieavantageplus.ca) |
| **Result** | PASS — 915 (Inventory page 21) and Vehicle B 1142 opened by row click, HTTP 200, matching VINs (16:53:24Z) |

**Why this matters:** A dealer reaches a vehicle through the Inventory list, not by typing a URL, and the ticket does not say the crash was limited to one vehicle. Opening the page from the list for two different vehicles shows that the fix holds on the path dealers actually use and is not tied to one record.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle A | Vehicle V as resolved in AP2495_001 step 2 — 915 (VIN `1FAHP35NX8W239204`) or the recorded fallback vehicle |
| Vehicle B | The first Inventory row whose id is not 915, not V, and not one of 1067, 1082–1097, 1106–1118, 1125–1135 — found by read-only paging or search (never by "newest"); record its id and VIN. None → judge Vehicle A alone and record why |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the dealer portal at `https://v2dev.garantieavantageplus.ca/login` with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`. Open **Vehicles → Inventory** in the sidebar; if the sub-menu is collapsed or the link is hidden, open `https://v2dev.garantieavantageplus.ca/vehicle/inventory` directly | The Inventory list loads and shows the dealer's vehicles. Record the URL. |
| 2 | Find Vehicle A (by its VIN) in the list — use the list's search box if it has one — and click its row or its link to open it. If the row is not clickable, record that, and open the `/vehicle/{id}/details` address the row carries (`href` or `data-href`) instead | Vehicle A's details page opens. Record the URL, the HTTP status and how the page was reached (clicked link, or URL from the row). |
| 3 | Go back to the Inventory list and find Vehicle B by the rule in *Test Data*: read row ids from the first page, then the next pages (read-only), skipping 915, V and the reserved ids. Record its id and VIN, and open it the same way as in step 2. If no row qualifies, record why and skip to step 4 | Vehicle B's details page opens. Record the URL and HTTP status. |
| 4 | [Verification] Compare the details pages with the rows they were opened from | No page request returned HTTP 5xx; no page shows the French "difficultés techniques" page or the text "Too few arguments to function"; and each page shows the VIN of the row it was opened from. The case **fails** on a 5xx, either error text, or a page showing a different vehicle — record environment Dev, the date and UTC time. If no Vehicle B qualified, judge Vehicle A alone and record the reason. If no vehicle id can be read from the list, open `/vehicle/{V}/details` by URL, record that the list gave no route, and judge V alone. |

---

### AP2495_004 — The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error

| Field | Value |
|---|---|
| **TC ID** | AP2495_004 |
| **Title** | The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error |
| **Requirement** | AP2495 — Summary _"Cannot view vehicle detail's page"_: once the page is viewable again, the actions it carries are reachable from it |
| **Route** | `/vehicle/{V}/details` → "Create quote" → back → "Edit vehicle" (`/vehicle/{V}/edit`) → back |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (https://v2dev.garantieavantageplus.ca) |
| **Result** | PASS — Create quote form and Edit vehicle modal HTTP 200, nothing saved, 915 unchanged (16:54:08Z) |

**Why this matters:** The fix changes how the vehicle page's controller is built. The page's two header actions lead into other controllers — the quote client form and the vehicle edit form. This case checks that both still open, without saving anything, so vehicle V stays exactly as other tickets expect it.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle V | As resolved in AP2495_001 step 2 — 915 (VIN `1FAHP35NX8W239204`, Ford Focus 2008) or the recorded fallback vehicle |
| "Create quote" route recorded in `domain` (2026-10-03, staging) | `/quote/new/client?fromVehicleId={V}`, with a "Vehicle" card in the right sidebar |
| "Edit vehicle" expected route | `/vehicle/{V}/edit` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the dealer portal at `https://v2dev.garantieavantageplus.ca/login` with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`, then open `https://v2dev.garantieavantageplus.ca/vehicle/{V}/details` | The Vehicle Details page of V loads without an error page. Record V's VIN as shown. |
| 2 | Click "Create quote" in the page header. Do **not** fill in or save the client form | A form opens without an error page. Record the URL, the HTTP status and whether a "Vehicle" card for V's VIN is shown. If the URL differs from `/quote/new/client?fromVehicleId={V}`, record the difference — do not fail on it. |
| 3 | Use the browser's Back button to return to `/vehicle/{V}/details`, then click "Edit vehicle" in the page header. Do **not** change or save any field | The edit form opens at `/vehicle/{V}/edit` without an error page. Record the URL, the HTTP status and the field values shown (record only — not judged). If the URL differs from `/vehicle/{V}/edit`, record the difference — do not fail on it. |
| 4 | Use the browser's Back button (or the form's "Back"/"Cancel" link, never "Save") to return to `/vehicle/{V}/details` | V's details page shows again, without an error page. |
| 5 | [Verification] Review the three page openings recorded in steps 2–4, and compare V's details page with step 1 | No request returned HTTP 5xx, and no page showed the French "difficultés techniques" page or the text "Too few arguments to function". Nothing was saved against V's VIN: the details page still shows the same VIN and vehicle summary recorded in step 1 (`1FAHP35NX8W239204`, Ford Focus 2008 for 915). If either header button is missing, record it and mark only that part not judged. The case **fails** on a 5xx or either error text — record environment Dev, the date and UTC time. |

---

## Coverage Matrix

_Which test cases check which part of the bug report. A part with no test case beside it is
one we currently have no way of proving is fixed._

| Requirement / AC | Re-test | Regression |
|---|:---:|:---:|
| Summary — the vehicle details page can be viewed (opened by URL) | AP2495_001 | — |
| Description — the error in `Vehicle/TabsTrait.php` no longer occurs, on every tab | AP2495_001 | AP2495_002 |
| Summary — the page opens on the dealer's normal path (Inventory) and for more than one vehicle | — | AP2495_003 |
| Fix side effect — the page's header actions still lead to working forms | — | AP2495_004 |
| Content of the details page (fields, tabs, buttons) | — | — (recorded only: the ticket does not state what the page should show) |

---

## Revisions

| Date (UTC) | Case / Section | Change | Reason |
|---|---|---|---|
| 2026-11-04T16:05:19Z | Execution Context | Environment → Dev (`https://v2dev.garantieavantageplus.ca`); "Build under test" rewritten (Dev carries the 2026-10-15 "develop" fix; run now despite status "QA"; an error on Dev is a FAIL against AP-2495 with date/time); vehicle-915 fallback and Vehicle B rule added; Edit vehicle route removed from "Routes not mapped yet"; Dev dashboard greeting recorded rather than assumed | R2 rework round 1: F-1, F-2, F-3, F-4, F-6 |
| 2026-11-04T16:05:19Z | AP2495_001 | Dev URLs; step 2 applies the 404/not-found fallback for 915 and records V's id and VIN; staging-only quote-route crash claim dropped from "Why this matters" | F-1, F-3, F-5 |
| 2026-11-04T16:05:19Z | AP2495_002 | Dev URLs; runs on vehicle V (915 or the fallback) | F-1, F-3 |
| 2026-11-04T16:05:19Z | AP2495_003 | Dev URLs; Vehicle A = V; Vehicle B = first Inventory row not 915/V and not 1067, 1082–1097, 1106–1118, 1125–1135, by read-only paging/search, id and VIN recorded; none → judge Vehicle A alone with reason | F-1, F-3, F-4 |
| 2026-11-04T16:05:19Z | AP2495_004 | Dev URLs; runs on V; step 3 field values record-only, expected route `/vehicle/{V}/edit`; step 5 checks nothing was saved against V's VIN; staging-only quote-route crash claim dropped | F-1, F-3, F-5, F-6 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2495_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_001-step3-Vehicle915DetailsLoaded_pass.png` |
| AP2495_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_002-step5-AllTabsNoError_pass.png` |
| AP2495_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_003-step4-VehicleB1142DetailsFromInventory_pass.png` |
| AP2495_004 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2495/AP2495_004-step5-Vehicle915UnchangedAfterActions_pass.png` |

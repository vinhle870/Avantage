# Test Cases — AP2495 (File 1 of 1)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2495 — Cannot view vehicle detail's page (bug re-test)
**Source:** requirements/AP-2495-cannot-view-vehicle-detail-page.md
**Date:** 2026-11-01
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
| **Entry route** | `/vehicle/915/details` — Vehicle Details page of vehicle 915, opened by URL. The same page is reached from the sidebar **Vehicles → Inventory** (`/vehicle/inventory`) and from a quote's hub (`/quote/{id}/details` → vehicle name link → `/vehicle/{vehicleId}/details`). The sidebar collapses its sub-menus, so navigate by URL when a link is hidden. | `navigation`, `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal at `/login` with the dealer account from the `env` source — `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]` (`playwright-automation/.env`). After sign-in the dashboard greets the dealership "Test QA staging" (Dealer ID 1380). | `env` |
| **Test data** | Vehicle **915** — VIN `1FAHP35NX8W239204`, Ford Focus 2008, 5000 km, designation COMMERCIAL, details URL `/vehicle/915/details`. Documented with three tabs (**Details**, **Window sticker**, **Quotes**) and two header actions (**Edit vehicle**, **Create quote**). Vehicle 915 is shared and reserved for other tickets' setup: these cases **only read it** — never click "Save" on any form opened from it. AP2495_003 also opens one other vehicle of the dealer's inventory, read-only. | `test-data` |
| **Language** | Dealer UI in English or French depending on the session (`?_locale=en` / `?_locale=fr`); leave it as found. The generic server error page is French: "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." | `navigation`, `domain` |
| **Leaves behind** | Nothing. Every case is read-only: no form is saved and no record is created. | — |
| **Build under test** | Not known — the ticket's deployment panel records the fix only on the **"develop"** environment (2026-10-15), and the ticket is in status "QA", not the ready-for-QA status "QC". The executor runs these cases once the ticket reaches QC; if AP2495_001 still shows the error, record which environment and date were used before filing anything. | tracker fields (capture) |

**What counts as the defect.** Any of: the server answers the page request with HTTP 500
(or another 5xx); the French "Erreur — Désolé, l'application éprouve des difficultés
techniques" page appears; or the text "Too few arguments to function" appears anywhere on
the page. Record the HTTP status of the page's main document request in every step that
opens a page.

**Routes not mapped yet.** The URLs of the "Window sticker" and "Quotes" tabs, the
"Edit vehicle" form and the Inventory row links are not in the `domain` notes. Record each
URL as you reach it, and write the new routes back to `domain` per
`qa-docs/_mapping-guide.md` after the run.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2495_001 | Opening vehicle 915's details page by URL shows the vehicle instead of the server error | Re-test | High | Not Run |
| AP2495_002 | Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error | Regression | High | Not Run |
| AP2495_003 | Opening a vehicle from the Inventory list shows its details page, for vehicle 915 and for a second vehicle | Regression | Medium | Not Run |
| AP2495_004 | The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error | Regression | Medium | Not Run |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2495_001 — Opening vehicle 915's details page by URL shows the vehicle instead of the server error

| Field | Value |
|---|---|
| **TC ID** | AP2495_001 |
| **Title** | Opening vehicle 915's details page by URL shows the vehicle instead of the server error |
| **Requirement** | AP2495 — Summary _"Cannot view vehicle detail's page"_ and description _"Too few arguments to function App\Controller\BaseController::__construct(), 2 passed in /var/www/html/src/Controller/Vehicle/TabsTrait.php on line 24 and exactly 3 expected"_ |
| **Route** | `/login` → `/vehicle/915/details` |
| **Type** | Re-test |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** This is the defect as reported: a dealer who opens a vehicle's details page gets a crash instead of the vehicle. The details page is also the entry point every new quote in this project's test suites starts from (`/vehicle/{id}/details` → "Create quote"), because the bare quote route returns HTTP 500 — so if this page is down, quote creation is down with it.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008 |
| URL | `https://v2staging.garantieavantageplus.ca/vehicle/915/details` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `https://v2staging.garantieavantageplus.ca/login` and sign in with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]` | The dealer dashboard opens with the greeting for the "Test QA staging" account. |
| 2 | Open `https://v2staging.garantieavantageplus.ca/vehicle/915/details` in the address bar and wait for the page to finish loading | A page loads at `/vehicle/915/details`. Record the HTTP status of the page request. |
| 3 | [Verification] Read the page: its heading or vehicle summary, the VIN shown, any tabs and any header buttons. Search the page text for "Too few arguments" and "difficultés techniques" | The page request did not return HTTP 5xx; neither the French "Erreur — Désolé, l'application éprouve des difficultés techniques" page nor the text "Too few arguments to function" is shown; and the page shows vehicle 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008. Record (do not judge) which tabs and header buttons are present. The case **fails** on a 5xx, either error text, or a different vehicle. |

---

### AP2495_002 — Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error

| Field | Value |
|---|---|
| **TC ID** | AP2495_002 |
| **Title** | Switching between the Details, Window sticker and Quotes tabs of a vehicle opens each tab without a server error |
| **Requirement** | AP2495 — description: the error is raised in `src/Controller/Vehicle/TabsTrait.php` on line 24, the code behind the vehicle page's tabs |
| **Route** | `/vehicle/915/details` → "Window sticker" tab → "Quotes" tab → "Details" tab |
| **Type** | Regression |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket's error comes from the shared code that builds the vehicle page's tabs, not from the Details tab alone. A fix applied only to the Details page would leave the Window sticker and Quotes tabs crashing the same way. This case opens every tab the page offers.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008 |
| Tabs documented in `test-data` | Details · Window sticker · Quotes |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the dealer portal at `/login` with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`, then open `https://v2staging.garantieavantageplus.ca/vehicle/915/details` | The Vehicle Details page of vehicle 915 loads (VIN `1FAHP35NX8W239204`) without an error page. |
| 2 | Click the "Window sticker" tab | The tab opens without an error page. Record the URL, the page request's HTTP status, and what the tab shows (for example a sticker preview or a download). If the tab opens a file or a new browser tab, record that. |
| 3 | Click the "Quotes" tab | The tab opens without an error page. Record the URL, the HTTP status, and how many quotes it lists. Do not open or change any quote. |
| 4 | Click the "Details" tab | The page returns to vehicle 915's details without an error page. Record the URL and HTTP status. |
| 5 | [Verification] Review the three tab openings recorded in steps 2–4 | No tab request returned HTTP 5xx, and no tab showed the French "difficultés techniques" page or the text "Too few arguments to function". If a tab named in `test-data` is not on the page, record that it is missing (do not fail on it — the ticket does not list the tabs). The case **fails** on a 5xx or either error text on any tab. |

---

### AP2495_003 — Opening a vehicle from the Inventory list shows its details page, for vehicle 915 and for a second vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2495_003 |
| **Title** | Opening a vehicle from the Inventory list shows its details page, for vehicle 915 and for a second vehicle |
| **Requirement** | AP2495 — Summary _"Cannot view vehicle detail's page"_ (no particular vehicle is named, so the page must open for any vehicle of the dealer) |
| **Route** | Sidebar **Vehicles → Inventory** (`/vehicle/inventory`) → vehicle row → `/vehicle/{id}/details` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** A dealer reaches a vehicle through the Inventory list, not by typing a URL, and the ticket does not say the crash was limited to one vehicle. Opening the page from the list for two different vehicles shows that the fix holds on the path dealers actually use and is not tied to one record.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle A | 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008 |
| Vehicle B | The first vehicle on the first Inventory page that is not 915 — record its id and VIN |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the dealer portal at `/login` with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`. Open **Vehicles → Inventory** in the sidebar; if the sub-menu is collapsed or the link is hidden, open `https://v2staging.garantieavantageplus.ca/vehicle/inventory` directly | The Inventory list loads and shows the dealer's vehicles. Record the URL. |
| 2 | Find vehicle 915 (VIN `1FAHP35NX8W239204`) in the list — use the list's search box if it has one — and click its row or its link to open it. If the row is not clickable, record that, and open the `/vehicle/{id}/details` address the row carries (`href` or `data-href`) instead | Vehicle 915's details page opens. Record the URL, the HTTP status and how the page was reached (clicked link, or URL from the row). |
| 3 | Go back to the Inventory list, pick the first vehicle on the first page that is not 915, record its id and VIN, and open it the same way as in step 2 | That vehicle's details page opens. Record the URL and HTTP status. |
| 4 | [Verification] Compare the two details pages with the rows they were opened from | Neither page request returned HTTP 5xx; neither page shows the French "difficultés techniques" page or the text "Too few arguments to function"; and each page shows the VIN of the row it was opened from. The case **fails** on a 5xx, either error text, or a page showing a different vehicle. If no vehicle id can be read from the list, open only 915 by `/vehicle/915/details`, record that the list gave no route, and judge vehicle 915 alone. |

---

### AP2495_004 — The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error

| Field | Value |
|---|---|
| **TC ID** | AP2495_004 |
| **Title** | The "Create quote" and "Edit vehicle" actions on the vehicle details page still open their forms without a server error |
| **Requirement** | AP2495 — Summary _"Cannot view vehicle detail's page"_: once the page is viewable again, the actions it carries are reachable from it |
| **Route** | `/vehicle/915/details` → "Create quote" → back → "Edit vehicle" → back |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The fix changes how the vehicle page's controller is built. The page's two header actions lead into other controllers — the quote client form and the vehicle edit form — and "Create quote" from this page is the only quote entry point that does not crash on staging. This case checks that both still open, without saving anything, so vehicle 915 stays exactly as other tickets expect it.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle | 915 — VIN `1FAHP35NX8W239204`, Ford Focus 2008 |
| "Create quote" route recorded in `domain` (2026-10-03) | `/quote/new/client?fromVehicleId=915`, with a "Vehicle" card in the right sidebar |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the dealer portal at `/login` with `[SET IN .env: DEALER_USERNAME]` / `[SET IN .env: DEALER_PASSWORD]`, then open `https://v2staging.garantieavantageplus.ca/vehicle/915/details` | The Vehicle Details page of vehicle 915 loads without an error page. |
| 2 | Click "Create quote" in the page header. Do **not** fill in or save the client form | A form opens without an error page. Record the URL, the HTTP status and whether a "Vehicle" card for `1FAHP35NX8W239204` is shown. If the URL differs from `/quote/new/client?fromVehicleId=915`, record the difference — do not fail on it. |
| 3 | Use the browser's Back button to return to `/vehicle/915/details`, then click "Edit vehicle" in the page header. Do **not** change or save any field | The edit form opens without an error page and shows vehicle 915's values. Record the URL and HTTP status. |
| 4 | Use the browser's Back button (or the form's "Back"/"Cancel" link, never "Save") to return to `/vehicle/915/details` | Vehicle 915's details page shows again, without an error page. |
| 5 | [Verification] Review the three page openings recorded in steps 2–4 | No request returned HTTP 5xx, and no page showed the French "difficultés techniques" page or the text "Too few arguments to function". Nothing was saved: the details page still shows VIN `1FAHP35NX8W239204`, Ford Focus 2008. If either header button is missing, record it and mark only that part not judged. The case **fails** on a 5xx or either error text. |

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

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2495_001 | _(pending)_ | — |
| AP2495_002 | _(pending)_ | — |
| AP2495_003 | _(pending)_ | — |
| AP2495_004 | _(pending)_ | — |

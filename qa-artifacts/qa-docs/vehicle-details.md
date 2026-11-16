# Vehicle details page and Inventory list (Dealer portal)

What a dealer sees when opening a stored vehicle: the Inventory list, the Vehicle Details
page, its three tabs and its two header actions. Mapped live during the AP-2495 re-test.

---

## Dev (v2dev) — mapped 2026-11-04 (AP-2495 run)

Not verified on Staging. Every fact below was observed on `https://v2dev.garantieavantageplus.ca`
with the Dev dealer account ("Test QA staging").

### Inventory list — `/vehicle/inventory`

- Reached from the sidebar **Vehicles → Inventory**; the Vehicles group is collapsed by
  default, so open the URL directly.
- Columns: **ID · VIN · Brand · Model · Year · Km**. 10 rows per page, sorted by ID
  descending. Paging links `?page=N` (1–4, Next, Last); 54 pages on 2026-11-04.
- **No search box in the list.** The only search is the global header "Search" box. To
  find a vehicle by VIN, page through `?page=N` (ID descending makes this a quick bisection —
  vehicle 915 was on page 21 on 2026-11-04).
- **Rows are not links.** A row has no `<a>`, `href` or `data-href`; every cell is clickable
  (cursor pointer) and a script navigates to `/vehicle/{id}/details`. Automation: click a cell
  (e.g. the VIN cell) of the row.

### Vehicle Details — `/vehicle/{id}/details`

- Heading (h1): `Vehicle VIN:{VIN}`.
- Header links: **Back** → `/vehicle/inventory` · **Edit vehicle** → `/vehicle/{id}/edit`
  (opens as a modal, see below) · **Create quote** → `/quote/new/client?fromVehicleId={id}`.
- Tabs: **Details** `/vehicle/{id}/details` · **Window sticker** `/vehicle/{id}/window-sticker`
  · **Quotes** `/vehicle/{id}/quotes` — each a full page load.
- Details tab body: h3 "Details", a paragraph "{Brand Model Year} — VIN · Mileage ·
  Designation", then a "Manufacturer warranty" heading.
- AP-2495 ("Too few arguments to function BaseController::__construct()" from
  `Vehicle/TabsTrait.php`) is fixed on Dev as of 2026-11-04: all three tabs answer HTTP 200.

### Window sticker tab — `/vehicle/{id}/window-sticker`

An editable form in the page (no download, no new tab): Image filename (Browse), Stock number,
Color, Real kilometers, Odometer mesurement unit (select), Doors, Fuel type (select),
Equipments, Repairs done, Repairs optional, "Previous use" checkbox group (8 options),
Legal warranty (select), Legal warranty details (select), Other Warranty End date,
Other warranty km, Other warranty desc, and a **Save** button. Saving was not exercised.

### Quotes tab — `/vehicle/{id}/quotes`

Table columns **Client · Vehicle · Program · Date Created**, 10 rows per page with paging.
Lists every quote raised on the vehicle, newest first.

### Edit vehicle — `/vehicle/{id}/edit` (modal)

- Clicking **Edit vehicle** does **not** change the browser URL: the form is fetched by
  `GET /vehicle/{id}/edit` and shown in a Bootstrap modal (`role=dialog`, class `modal fade`)
  headed `Vehicle #{id}`. The hidden modal stays in the DOM after closing — check visibility,
  not presence.
- Fields: VIN* (with a VIN search to pre-fill), Brand* (`vehicle[make]`), Model*
  (`vehicle[model]`), Year*, Vehicle Price*, Kilometers*, Condition* (`vehicle[condition]`),
  Fuel type* (`vehicle[fuelType]`), Transmission* (`vehicle[transmission]`), Cylinders*,
  Engine size*, Engine size unit* (`vehicle[engineSizeUnit]`), Designation*
  (`vehicle[designation]`), Turbo engine / 4x4 / All Wheel Drive checkboxes, Manufacturer
  warranty (Full coverage and Powertrain coverage: End date, Max mileage). Buttons: **Back**, **Save**.
- The modal's **Back** link goes to `/vehicle/inventory`, not back to the details page.
- Gotcha: for vehicle 915 the details page shows Designation **COMMERCIAL** but the edit
  modal pre-selects **Particular** (2026-11-04). Saving the modal would likely change the
  stored designation — never save it on a shared vehicle.

### Create quote — `/quote/new/client?fromVehicleId={id}`

Opens the quote Client step (h "Client") with a "Vehicle" card in the right sidebar showing
"{Brand Model Year} VIN: {VIN}". See [quote-creation.md](quote-creation.md) for the rest of
the flow.

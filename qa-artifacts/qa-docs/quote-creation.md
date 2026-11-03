# Knowledge — Quote Creation Flow

**Mapped:** 2026-08-29 (base flow), extended 2026-10-03 (entry-point gotcha), Staging
(v2staging), dealer `vinhle870@gmail.com` ("Test QA staging"). Extended 2026-11-01 (Dev,
v2dev, AP-2477) — see *On Dev (v2dev)* below. Unless a section says otherwise, the facts
here are **staging** facts.

Base URL and credentials: [execute.env.md](../base-test/execute.env.md). Vehicles and
dynamic data: [test-centralized.md](../base-test/test-centralized.md).

---

## Routes

**On staging (as of 2026-10-12).** On dev the "Create a quote" entry goes to the
vehicle-first form instead — see *On Dev (v2dev)* below.

```
/quotes  ──"Create a quote"──▶  /quote/new/client  ──Save──▶  /quote/{id}/details
                                                                     │
                    ┌────────────────────────────────────────────────┤
                    ▼                    ▼                ▼          ▼
          /quote/{id}/vehicle   /quote/{id}/warranty/edit  /quote/{id}/financing  /quote/{id}/sales
```

On staging (as of 2026-10-12), `/quote` redirects to `/quote/new/client` — on dev it
redirects to `/quote/new/edit-vehicle` (see *On Dev (v2dev)* below). Saving the client form creates the quote and
**redirects straight to `/quote/{id}/details`** — you never choose an ID yourself.

This is also the route to the **Quote Details** page, which is where the
compliance-documents send button lives (see [compliance-documents.md](compliance-documents.md))
alongside the Insurance Quick Quote page.

---

## ⚠ Two entry points — one of them crashes the quote it creates (found 2026-10-03)

There are **two ways** to reach `/quote/new/client`, and they are not equivalent:

| Entry point | Vehicle attached? | Result |
|---|---|---|
| `/quote/new/client` (typed directly, or via `/quote`, or via the `/quotes` "Create a quote" header action) | **No** | Client saves fine ("Client saved" flash), but the redirect to `/quote/{id}/details` **returns HTTP 500** — a generic French error page ("l'application éprouve des difficultés techniques"), no stack trace exposed in the browser. Reproduced 2/2 (quotes 6308, 6309, 2026-10-03). |
| `/vehicle/{vehicleId}/details` → **"Create quote"** header action → `/quote/new/client?fromVehicleId={vehicleId}` | **Yes** — confirmed by a "Vehicle" card in the page's right sidebar during client entry | Saves fine and `/quote/{id}/details` loads normally (HTTP 200). Confirmed working (quote 6310, 2026-10-03). |

**Always use the `fromVehicleId` entry point** (via a vehicle's own Details page, as
[test-centralized.md](../base-test/test-centralized.md) already recommends for vehicle 915) —
never `/quote/new/client` bare. This also means **the older claim below that "the send
button appears on a brand-new quote with no vehicle" needs re-verification** — it may have
been tested via a different path (e.g. a quote that later had its vehicle step skipped,
rather than one that never had a vehicle at any point via this crashing entry point).
Flagging rather than silently correcting; not re-tested as part of this pass.

---

## `/quotes` — quote list

Heading "Quotes". Tabs **Active** / **Archived**. Columns: Client, Vehicle, Program,
Date Created. Header action "Create a quote" → `/quote`.

**Rows are not links.** They carry no `href` and a programmatic `row.click()` does nothing,
so a quote cannot be opened from this list under automation. Reach a quote by its
`/quote/{id}/details` URL instead.

**Reading quote ids from the list (verified 2026-10-12):** each row cell is
`<td class="clickable-row" data-action="clickable" data-href="/quote/{id}/details">`, so the
id is in `data-href` even though it is never displayed. The list is newest-first (10 rows per
page, `?page=N`) and shows **no quote name** column — only Client, Vehicle, Program, Date
Created. Newest quote for dealer 1380 on 2026-10-12: **6431** (Oct 6, 2026).

---

### On Dev (v2dev) — `/quotes` after AP-2494: Contracts column and keyword search, mapped 2026-11-02 (AP-2494 s4)

Dev facts only; staging not re-checked (the staging facts above date from 2026-10-12).

- **Columns** (both tabs): Vehicle · Client · Contracts · Date Created — "Contracts" replaced "Program".
  French (`?_locale=fr`): heading "Cotations", tabs **"Créé"** (`/quotes`) and **"Archivée"**
  (`/quotes/archived`), headers Véhicule · Client · **Contrats** · Date de création. The page's
  `html lang` stays "en" in both languages — judge the language by the visible labels.
- **Contracts cell:** a `<ul>` with one `<li>` per contract, plain text, no link: warranty
  contract number (`26df1-844`), Chubb creditor number (`AVP000170`), Permaplate number
  (`PNA-0000000019`), roadside AutoShield id (`2697`, `2698`), and for some quotes the sale
  contract number (archived 6040 "11111", 6041 "ContractNumber_12345"). A quote with no contract
  has an empty cell (whitespace only, no `<ul>`). A product saved without a contract adds nothing.
  **A sale saved on 2026-11-02 (quote 6480, `AP2494-S-957`) did not appear** — AP2494_010 FAIL.
- **Quote name:** a quote named on the vehicle-first form shows its name in capitals above the
  vehicle in the Vehicle cell (e.g. "ZEPHYRINE AP2494 959 Ford Focus 2008 VIN: …"); Client shows "-".
- **Search:** the dark magnifier button `a.btn-dark[data-target="#searchForm"]` beside "Create a
  quote" opens a modal: label "Quote name, client name, client email or VIN", input
  `#quote_search_keyword` (`quote_search[keyword]`), button `#quote_search_save` "Search" (Enter also
  submits). GET to the **current tab's** route: `/quotes?quote_search[keyword]=…` or
  `/quotes/archived?quote_search[keyword]=…` — the search covers only that tab. Matches are partial
  and case-insensitive on quote name, client first/last name, email and VIN; reversed "last first"
  also matches. `%` and `_` are literal. Empty result: "No entities found". No clear control — submit
  an empty box. Page links keep the keyword (`&page=N`); the tab links drop it. The top-bar
  "Search" box (`#global-search-input`) is a separate global search.
- **Roadside contract generation is broken on Dev (2026-11-02):** `/quote/{id}/road-side-protection-create-contract`
  returns HTTP 500 (French technical-error page) for new quotes 6479 and 6480 on vehicle 915; from the
  row's ⋯ menu the modal stays on "Loading...". The Roadside page warns "There's already a contract
  created for the same VIN. Contract #2697, 2698".
- **GAP contracts on Dev:** `/gap-insurance-contracts` (heading "Gap insurance contracts") is empty —
  "No entities found" (2026-11-02).
  - **Dev refresh (2026-11-03, AP-2504):** no longer empty — GAP contract **AVPG000064** (quote 6564, client
    Contract Owner2504-007) is listed, made by AP2504_007. The line above is kept as the 2026-11-02 record.
- **Sales contract on Dev:** "Create sale" is an enabled button once a financing exists; `/quote/{id}/sales`
  (heading "Sales contract") requires contractNumber, salesRepName, deliveredAt, signedAt (typed
  `yyyy-mm-dd` accepted); Save stays on the page with "Contract saved" and an "Open PDF in new tab"
  link `/quote/{id}/sales/pdf`. No separate generate/finalize step **on the sales page, nor on the
  details page of a quote without a warranty** (quote 6480, 2026-11-02). Do not generalise this to
  quotes that carry a warranty: the automation page objects (`QuoteDetailPage.btnFinalizeSale`,
  `WarrantyDetailsPage.lnkFinalizeSale`) show a finalize action there, not re-checked on Dev. Details
  then shows "Sale #{number} · Sales rep: …".
  - Dev, 2026-11-02 (AP-2494): archived quotes 6040 (sale "11111", warranty APOP01-671, Pending
    approval) and 6041 (sale "ContractNumber_12345", warranty APOP01-663, Cancelled) both carry a
    generated warranty contract, and the `/quotes` Contracts cell lists their sale number next to the
    warranty. Active quote 6480 (sale "AP2494-S-957", no warranty) does not list its sale number.
    Whether a sale number needs a warranty or archiving to appear is an open question (AP-2494 Q-003).
- **Financing on Dev** opens in a modal from "Add a financing" on the details page; after save the page
  also shows a "No applicant" notice (co-applicant section) — not an error.
- **Warranty contract list `/warranty` on Dev** ("Warranties"): columns Client · Dealer · Vehicle ·
  Program (contract number + term) · Invoices · Components · Start Date · Created on; each row links
  to `/warranty/{id}`.
- Records made by AP-2494 on Dev: quotes 6479–6483 (clients `client.stage.956`–`958`, `960`), Chubb
  creditor contract **AVP000170** on quote 6480, sale `AP2494-S-957` on 6480, named quote 6482.

---

## Vehicle-first new-quote form (AP-2477) — not on staging as of 2026-10-12

AP-2477 (and the automation page object `playwright-automation/src/pages/dealerPortal/DealerNewQuotePage.ts`)
describe a vehicle-first flow: `/quotes` → "Create a quote" → **`/quote/new/edit-vehicle`**
("Créer une cotation": Quote name, NIV + "Décoder", Marque, Modèle, Année; Sauvegarder →
`/quote/{id}/details`). **On v2staging on 2026-10-12 this does not exist:**

- "Create a quote" (`href="/quote"`) still redirects to the client-first form `/quote/new/client`.
- `/quote/new/edit-vehicle` returns **HTTP 404** ("Désolé, la page recherchée est introuvable"),
  2 of 2 tries.
- The quote vehicle step `/quote/{id}/vehicle` still shows "Véhicule", "Date de livraison",
  "Prix" in the French UI.

Until AP-2477 is deployed, the automation suite's new-quote tests will fail on staging. Once
it lands, re-map this section (form fields, hidden decoded inputs, vehicle type menu, routes
of the quote's vehicle details/edit page) from the live page.

### On Dev (v2dev) — mapped 2026-11-01 (AP-2477 s4)

AP-2477 **is deployed on v2dev**. What the live page does there (English UI):

- `/quotes` → "Create a quote" (`href="/quote"`) → `/quote` **302** → `/quote/new/edit-vehicle`,
  heading "Create a quote", type button "Passenger" at the top right (menu of 23 types, each
  `/quote/new/edit-vehicle/{TYPE}`, e.g. `/quote/new/edit-vehicle/RV_CLASS_A`).
- Fields: Quote name `#quote_vehicle_quote_name`, VIN `#quote_vehicle_VIN` (class `vinlookup`
  and a "Décoder" button only for car types), Brand `#vehicle_make`, Model `#vehicle_model`,
  Year `#vehicle_year`, then "Save". Form prefix `quote_vehicle[...]`; hidden inputs
  `transmission` = automatic and `engineSizeUnit` = l. Brand and Model are Bootstrap-select
  widgets; choosing a Brand re-posts the form by AJAX (`POST /quote/new/edit-vehicle` → 200)
  to load the Model list — wait about a second before choosing a Model.
- Save → `POST /quote/new/edit-vehicle` → 302 → `/quote/{id}/details` with "Vehicle saved". A
  missing Brand, Model or Year comes back 200 with "This value should not be blank." under the
  field (server-side; the browser's `required` check does not stop the post).
- The quote's vehicle: details `/vehicle/{vehicleId}/details`, full edit form
  `/vehicle/{vehicleId}/edit`. Warranty: the "+" next to "Extended warranty" opens
  `/quote/{id}/warranty/edit` in a modal; for a vehicle with no kilometres it first asks for
  Kilometers and Fuel type ("There are no eligible program for the vehicle").
- **"Décoder" saves the quote** on dev (AP2477_007 FAIL, 2026-11-01, filed as AP-2507): it posts
  the whole `quote_vehicle` form plus `quote_vehicle[novalidate]=true` by AJAX, and the server
  redirects to `/quote/{id}/details`. The one click made on 2026-11-01 (AP2477_007) saved quote
  6437; it was not retried. Treat every click as creating a quote, and do not click it outside a
  test that needs it.
- Only `transmission` and `engineSizeUnit` are rendered as hidden inputs; fuel type, cylinders,
  engine size and turbo are not on the page (checked read-only, 2026-11-01).
- **Vehicle inventory on dev:** the list is `/vehicle/inventory` ("Vehicle Inventory");
  `/vehicle` returns **HTTP 404**. Its add menu opens the full add form
  `/vehicle/new/edit/{TYPE}` (e.g. `/vehicle/new/edit/PASSENGER`, heading "Add a vehicle"),
  which still requires Vehicle Price and Kilometers (AP2477_011).
- **A quote vehicle appears in Vehicle Inventory:** vehicle 1067, saved through this form by
  the AP2477_007 decode, shows at the top of the dealer's Vehicle Inventory list.
- The `/vehicle/{id}/details` → "Create quote" action still opens the old client form
  `/quote/new/client?fromVehicleId={id}`. The staging HTTP 500 on the bare `/quote` entry
  (above) was not seen on dev: quotes 6438–6440 saved and opened normally.

- **Warranty → contract on dev (AP-2374 s4, 2026-11-01).** The program list is filled only in
  the **modal** opened by the "+" next to "Extended warranty" on `/quote/{id}/details`; opening
  `/quote/{id}/warranty/edit` as a page shows an empty program list. For vehicle **915** the
  only program offered is "Automation Test Program" (option "default 1", term 20m/20000km);
  Save → `/quote/{id}/details?type=extended`, flash "Warranty saved". The contract is then made
  from the Extended warranty row's ⋯ menu → **Generate Contract** →
  `/quote/{id}/warranty/generate-contract` (`warranty_finalize[...]` form pre-filled from the
  quote; submit `#warranty_finalize_save`) → flash "Invoice #N ($…) is created" and the row
  shows the contract number (e.g. `26df1-844`, dealer `/warranty/844`, status Pending
  approval). The page warned "The delivery date has passed the acceptable timeframe…" with
  today's delivery date but saved anyway. That contract is immediately usable for a claim —
  see [claims.md](claims.md).

**Locale switch:** appending `?_locale=fr` / `?_locale=en` to any dealer URL switches the UI
language for the session (login page shows a "Français" link to `?_locale=fr`). Switch back
after a run so the shared account stays as found.

## `/quote/new/client` — step 1, the client

Heading "Create a quote". Form prefix `quote_client[...]`, one **Save** button.

**Optional query param `fromVehicleId={vehicleId}`** pre-attaches that vehicle to the quote
being created — see the entry-point gotcha above. Reached via a vehicle's Details page
("Create quote" header action), not via `/quotes` or `/quote` directly.

| Field | Type | Required |
|---|---|:---:|
| `email` | email | ✔ |
| `firstName`, `lastName` | text | ✔ |
| `company`, `distributorName` | text | — |
| `address` | text | ✔ |
| `address2` | text | — |
| `city` | text | ✔ |
| `province` | select | ✔ |
| `postalCode` | text | ✔ |
| `telHome` | text | ✔ |
| `telWork` | text | ✔ |
| `indianStatusCertificate`, `driversLicense` | text | — |
| `isAgreePolicy` | checkbox | ✔ |
| `isSendPolicy` | checkbox | — |

**`telWork` is required as well as `telHome`.** This is the one that trips people up — the
label does not read as mandatory, and the save fails with "This value should not be blank."
against `telWork` alone.

**`province` option values** — the client's province, *not* the dealership's:

`1` Québec · `2` Ontario · `3` British Columbia · `4` Alberta · `5` Manitoba ·
`6` Saskatchewan · `7` Nova Scotia · `8` New Brunswick · `9` Newfoundland and Labrador ·
`10` Prince Edward Island · `11` Northwest Territories · `12` Yukon · `13` Nanavut
*(spelled "Nanavut" in the build)*. Empty value = "Choose".

Validation is **server-side**: a bad submit round-trips to the same URL and re-renders the
form with `Error This value should not be blank.` beside each offending field.

---

## `/quote/{id}/details` — the hub

Heading `#{id} - {Client first last}`. Sections in order: **Client · Vehicle · Warranty ·
Financing · Sale · Compliance documents sent**.

| Control | Goes to |
|---|---|
| Back | `/quotes` |
| **Send compliance documents** (`btn btn-dark`) | `/compliance-documents/send?redirectUrl=/quote/{id}/details&clientEmail={client email}` |
| Edit (Client) | `/quote/{id}/client` |
| Edit (Vehicle) / Add a vehicle | `/quote/{id}/vehicle` |
| Vehicle name link | `/vehicle/{vehicleId}/details` |
| "Click here to create a warranty" | `/quote/{id}/warranty/edit` |
| Road Side Protection | `/quote/{id}/road-side-protection` |
| Permaplate | `/quote/{id}/road-side-protection` **on Dev (v2dev), 2026-11-01** | "Road Side protection program" (FR "Programme de protection de la route") | A different build from the staging row above. Two forms: `quote_auto_shield_make_model[...]` (VIN, vehicleMake, vehicleModel, vehicleYear; button **Continue**), hidden behind a Vehicle **Edit** toggle, and `quote_auto_shield[...]` (selectedTier radios — 5 AutoShield options with prices, e.g. "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$*"; `salePrice` labelled "Policy Sale price*", empty; hidden `action`; button **Save** / FR "Sauvegarder"). No stockNumber, vehicleCondition, odometerReading, date, financing or client fields, and no "Generate Contract" or "Save and Generate Contract" button. From the hub the Roadside Protection row's pencil opens this page in a modal instead of navigating. A warning alert lists existing AutoShield contracts for the same VIN. Contract details page: `/quote/{quoteId}/auto-shield-contract/{contractId}` (Contract ID, App Number, Status Code, dates, term, tier, product, client and vehicle sub-fields, en/fr PDF links via `/auto-shield-contract-pdf?pdfLink=…`). Dealer contract list: `/road-side-protection-contracts` (columns Autoshield contract ID, VIN, Client, Phone, Price, Actions). On Dev the quote vehicle step requires a Delivery date ("This value should not be blank.") |
| `/quote/{id}/permaplate` |
| DYR Rates | `/quote/{id}/dyr-rates` |
| Add a financing | `/quote/{id}/financing` — *disabled until prerequisites are met* |
| Create sale | `/quote/{id}/sales` — *disabled until prerequisites are met* |
| Add exchange vehicle | `/quote/{id}/exchange-vehicle?referer=…` |

**The send button appears on a brand-new quote with no vehicle, no warranty and no
financing.** It does not depend on the quote being complete. *(See the entry-point gotcha
above — needs re-verification against the crashing no-vehicle entry point.)*

---

## `/quote/{id}/vehicle` — step 2, the vehicle

Fields `quote_vehicle[vehicle]` (a select of the dealer's inventory, ~331 options, **the
option label is the VIN and the value is the vehicle ID**), `quote_vehicle[deliveredAt]`
(date text), `quote_vehicle[price]` (text). Save returns to `/quote/{id}/details`.

Vehicle `915` = `1FAHP35NX8W239204`, the 2008 Ford Focus recorded in
[test-centralized.md](../base-test/test-centralized.md). It is the first option in the list.

---

## The remaining quote stages

| Route | Heading | Shape |
|---|---|---|
| `/quote/{id}/warranty/edit` | `#{id} - {client}` | `quote_warranty[term]` radios plus many `components[]` checkboxes; Save |
| `/quote/{id}/road-side-protection` | "Road Side protection program" | `quote_auto_shield[selectedTier]` radios (5 tiers), salePrice, VIN, stockNumber, vehicleCondition select, odometerReading; **Save and Generate Contract** |
| `/quote/{id}/permaplate` | "Permaplate Quote" | `permaplate_id` radios (3), `option_ids[]` checkboxes; Save |
| `/quote/{id}/dyr-rates` | "-" | No form and no heading text — likely a rates display that needs prior data |
| `/quote/{id}/financing` | `#{id} - {client}` | applicant date of birth, type select, baseAmount, residualAmount, paymentFrequency, termMonths (80 options), interestRate, financingCompany (34 options); Save |
| `/quote/{id}/sales` | "Sales contract" | contractNumber, salesRepName, deliveredAt, signedAt, signedLocation, discountAmount, vehicleMarketValue, transitAmount, rdprmAmount, warrantyAmount …; Save |

For the Chubb creditor-insurance stage on a quote (`/quote/{id}/insurance`,
`/quote/{id}/insurance/create-contract`), see [chubb-insurance.md](chubb-insurance.md) — it
lives there with the rest of the Chubb feature knowledge rather than here.

---

## Permaplate ("Esthetic protection") contract lists — dealer and admin (mapped 2026-10-04, AP-2463 re-test)

The Permaplate program is now labelled **"Esthetic protection"** in the EN UI (sidebar items
and headings); routes and the admin catalogue still say `permaplate`.

| Portal | Route | Heading | Columns | Paging |
|---|---|---|---|---|
| Dealer | `/permaplate-contracts` (sidebar Contracts → "Esthetic protection") | "Esthetic protection contracts" | VIN · Client name · Client phone · Contract cost price · Actions | None seen (3 rows for dealer 1380) |
| Admin | `/admin/permaplate-contracts` (sidebar "Esthetic protection"; the product catalogue is the separate "Permaplate" item → `/admin/permaplate`) | "Esthetic protection Contracts" | Client · Dealer · Vehicle · Program · Actions | 10 per page, `?page=N` |

- **Neither list shows the contract number.** Find a contract by client name / VIN. On the
  admin list the eye icon links to `/admin/permaplate-contract/{id}`, whose heading carries
  the number ("Esthetic protection Contract PNA-0000000007").
- **Phone rendering (AP-2463 fix):** dealer "Client phone" cell and admin "Client" cell show
  `Cell: {work}` then `Home: {home}` on separate lines (`<br>`); admin numbers are `tel:`
  links under the client e-mail. Digits are shown as stored — no dashing applied
  (`Cell: 5145550101`, but a number entered as `124-123-1234` shows with dashes). A missing
  number drops its whole line (e.g. admin row shows only `Home: 5146906330`); a client with
  neither shows nothing.
- **Dealer Download** → `/quote/{quoteId}/permaplate-contract-download`, `target=_blank`,
  icon `fa-file-pdf`; returns HTTP 200 `application/pdf`,
  `Content-Disposition: inline; filename=permaplate-{contractId}.pdf`.
- The quote page `/quote/{id}/details` Client card shows the **home** number only, unlabelled.

### On Dev (v2dev) — Permaplate quote → contract form → PDF, mapped 2026-11-02 (AP-2428 s4)

Dev facts only; staging not re-checked. Dealer 1380, vehicle 915.

- **Product link on Dev:** dealer 1380 already has product **3 "10 ans"** (120 months) linked at
  `/admin/dealer/1380/permaplate` (tab "Esthetic protection" on the dealer details page). Product 3's
  options on Dev (`/admin/permaplate/3/details`): 17 Peinture – Céramique + Graphene 75.00 ·
  18 Extra care (5 ans couverture ) 70.00 (child of 17) · 19 Leather / Vinyl protection 70.00 (disabled) ·
  20 Antirouille – Rust+Sound (combo) 80.00 · 21 Autosaver 40.00 (max vehicle age 3, not offered for
  vehicle 915) · 22 Paintguard Ceramic, 23 Paintguard Express (disabled). Option edit form
  `/admin/permaplate/3/option/{id}/edit` — field `permaplate_option[dealerCost]`, Save → back to
  the details page with "Option saved successfully".
- **Quote Permaplate page** `/quote/{id}/permaplate` (heading "Permaplate Quote", card "Esthetic
  protection Quote"): the product radio `permaplate_id` is covered by its label — click
  `label[for=permaplate_3]`, not the input. Ticking option 17 enables **and ticks** option 18.
  Running total "Cost: N$" updates live. Save → `/quote/{id}/details`, "Esthetic protection quote
  saved successfully". The page stays editable after a contract exists.
- **Where the contract control is:** quote details → **Esthetic protection** row → ⋯ button →
  menu **Edit** (`/quote/{id}/permaplate`) · **Generate Contract** (`/quote/{id}/permaplate-create-contract`)
  · **Delete** (`/quote/{id}/cancel-product/permaplate`). After generation the menu is replaced by a
  PDF icon link → `/quote/{id}/permaplate-contract-download` (`target=_blank`).
- **Contract form** `/quote/{id}/permaplate-create-contract`, heading "Esthetic protection Contract",
  prefix `permaplate_contract[...]`. Section **"Vehicle identification"**: vehicleVin (text, required),
  vehicleOdometer (number), vehicleYear (number, read-only), vehicleMake / vehicleModel (text,
  read-only), deliveryDate (date, read-only), vehicleCylinders (text), vehicleTransmission (select
  Automatic/Manual), checkboxes vehicleIsDiesel, vehicleIsInjection, vehicleIsTurbo, vehicleIs4x4,
  vehicleIsFwd ("All Wheel Drive"). Section **"Owner information"**: ownerFirstName, ownerLastName,
  ownerOtherName ("Other name on file (Company's name)" — **not** prefilled from the client's
  company), ownerAddress, ownerCity, ownerProvince (**free-text input**, prefilled "Québec"),
  ownerPostalCode, ownerEmail, ownerPhoneRes (= client Tel home), ownerPhoneCell (= client Tel work),
  financingCompany (select, 34 options, default "Choose" — leaving it is accepted on Dev). Column
  **"Program Summary"**: Program Term, Start Date (= delivery date), End date (start + term), the
  selected options as a bullet list, one row "Total N$" — no "Cost Price", retail, subtotal, tax
  or grand-total line. Submit button "Generate Contract".
- **Generate Contract** → `/quote/{id}/details` with "Esthetic protection contract generated
  successfully" and "Invoice #N ($225) is created"; the invoice on `/invoice` is listed at the amount
  plus 14.975 % (225 → $258.69), description "#PNA-00000000NN …". A double click makes one contract.
  Blank VIN or Last name: browser `required` check plus server "This value should not be blank.";
  nothing is created. Opening the form URL on a quote with no Permaplate selection redirects to
  details with "Please create a quote first"; on a quote that already has a contract it redirects
  to details silently.
- **PDF download is broken on Dev (2026-11-02):** `/quote/{id}/permaplate-contract-download` returns
  HTTP 500 (French technical-error page) for every contract tried, including the older quote 6284.
- **Admin contract details** `/admin/permaplate-contract/{id}` on Dev shows only the contract number
  heading and its invoice table — no vehicle or owner fields.
- Contracts made on Dev by AP-2428: PNA-0000000017 (quote 6456, admin id 17), -18 (6457), -19 (6460).
- **Dev, 2026-11-02 (AP-2501 s4):** dealer 1380 still has **only product 3 "10 ans"** linked
  (`/admin/dealer/1380/permaplate`, "Link a product" / "Unlink"), so `/quote/{id}/permaplate` offers one term
  radio. The Dev catalogue `/admin/permaplate` ("Esthetic protection Terms") holds: 6 "2 ans (eligibility)"
  24 m (vehicle age 0–5) · 1 "3 ans" 36 m · 5 "3 Ans (Drive IP)" 36 m · 2 "5 ans" 60 m · 3 "10 ans" 120 m —
  all enabled — and 4 "Voici Vinh Le Corp traduit en français" 120 m (disabled). A test needing two terms
  must link a second one first. Options offered under "10 ans" for vehicle 915 (in page order):
  Antirouille – Rust+Sound (combo) 80$ · Peinture – Céramique + Graphene 75$ · Extra care (5 ans couverture ) 70$
  (disabled until 17 is ticked). Contract **PNA-0000000020** (quote 6555, admin id 20, invoice 941,
  "Invoice #941 ($80) is created"); quote 6556 (client Terme Second1102) has no product.

### On Dev (v2dev) — quote details "Summary of products", product menus, cancel-product and GAP, mapped 2026-11-02 (AP-2493 s4)

Dev facts only; staging not re-checked. Dealer 1380, vehicle 915, quotes 6461–6469.

- **Layout:** `/quote/{id}/details` shows the products in a right-hand card **"Summary of products"**:
  vehicle row (price, delivery date, pencil → `/quote/{id}/vehicle`), then Extended warranty ·
  Roadside Protection · Gap Insurance · Creditors insurance (with the GAP boilerplate under it) ·
  Esthetic protection, then **Subtotal**. An empty product shows "- None Selected -" (Permaplate "-")
  and a red "+" that opens the product form **in a modal**. The heading appends the VIN
  ("#6461 - Annul Produit2493-001 1FAHP35NX8W239204"). Header actions: Back · Send compliance
  documents · **Archive** (`/quote/{id}/cancel`, not shown on an archived quote).
- **Saving the client via `fromVehicleId=915`** already attaches the vehicle at price 10,000 and
  today's delivery date; the vehicle step overwrites them.
- **Product row menu:** a saved product without a contract has a chevron (expands details) and a
  "⋯" dropdown: **Edit · Generate Contract · Delete**. Delete opens a confirmation modal ("Cancel a
  product - {product}" / "Are you sure you want to cancel this product: {product}?" / buttons "Yes,
  cancel the product" and "No"; no × icon; Escape and a backdrop click close it). Confirming → flash
  "The product has been cancelled", the row returns to "- None Selected -" with its "+".
  Routes (rendered in the DOM even while the menu is closed):
  `/quote/{id}/cancel-product/warranty` · `…/roadside` · `…/permaplate` · `…/creditors` · `…/gap`.
  Generate Contract routes: warranty `/quote/{id}/warranty/generate-contract`, roadside
  `/quote/{id}/road-side-protection-create-contract`, Permaplate `/quote/{id}/permaplate-create-contract`,
  creditor `/quote/{id}/insurance/create-contract`, GAP `/quote/{id}/insurance/create-contract/gap`.
  A product with a contract (e.g. creditor AVP000169) has no "⋯" — only the contract number and a PDF link.
  An **archived** quote still offers Delete (quote 6245).
- **Subtotal (Dev):** vehicle price + the row amount of each product: warranty sale price (not its
  Cost), Roadside policy sale price, GAP total premium before tax, creditor monthly premium. The
  **Esthetic protection (Permaplate) cost is not counted** — its amount column is "-" (AP2493_011/012 FAIL).
- **Warranty modal (vehicle 915):** program "Automation Test Program", one term radio "20m/20000km",
  required **Sale price*** text field; row then shows Cost / Commission / amount (1,000 / 500 / 1,500
  for sale price 1500).
- **GAP insurance on a quote:** the Gap Insurance "+" → `/quote/{id}/gap-insurance` (modal "Gap
  Insurance Quote"): Rate table* (only "TGGAP"), Language*, Tax exempt*, **Gap Term*** — no DOB,
  payment or residual fields. "Get Quote" → flash "GAP insurance quote saved successfully"; row shows
  the premium (3,094.00 for 60 months on 25,000 financed) and a Gap coverage table. Needs a saved
  financing first.
- **Creditor insurance on Dev** (`/quote/{id}/insurance`): form prefix `quote_financing_insurance_chubb[...]`
  (`language`, `taxExempt`, `formCompound`, `lifeType`, `lifeTerm`, `lifeFor`, critical illness and
  disability blocks). Premium 18.58$/m without GAP, 20.88$/m with GAP (PM30, Life Decreasing 60,
  Borrower, 25,000 financed). The create-contract page is a long pre-filled form; its submit button is
  **"Generate Contract"** → "Chubb insurance contract created successfully" (~8 s).
- **Financing form** prefix `quote_financing[...]`: `applicant][dateOfBirthText]`, `applicant][province]`,
  `type`, `dueType`, `baseAmount`, `residualAmount`, `paymentFrequency`, `termMonths`, `interestRate`,
  `financingCompany`. 25,000 / 0 / Monthly / 60 / 6.99 → payment 494.91$ Monthly.
- **Roadside on Dev** saves with a plain "Save" and no contract (see the Roadside row above); vehicle
  915 shows a duplicated warning "There's already a contract created for the same VIN. Contract #2697, 2698".
- **Permaplate page** opens empty after a cancel (the cancelled selection is not kept) and accepts a
  save with no option ticked (stores "Cost: CA$0.00$").
- **Archived quotes:** the Archived tab of `/quotes` is the route `/quotes/archived`.
- Records made by AP-2493 on Dev: quotes 6461–6469 (clients `client.stage.947`–`955`), Chubb creditor
  contract **AVP000169** on quote 6466.

### On Dev (v2dev) — "Download all documents" on the quote page (AP-2496), mapped 2026-11-02 (AP-2496 s4)

Dev facts only; staging not checked. Dealer 1380, vehicle 915. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2496_2026-11-02.md`.

- **The action:** one link "Download all documents" (FR `?_locale=fr`: "Télécharger tous les documents"),
  `href="/quote/{id}/documents/download"`, `target="_blank"`, in the last row of the "Summary of products"
  table, directly under Subtotal. Seen on quotes that hold a generated contract (6040 warranty + sale,
  6480 Chubb creditor). **Not shown** on a quote with no product (6486, 6488), with a product saved but no
  contract (roadside 6484/6487/6489, Permaplate before Delete on 6485), or after the only product was
  deleted (6485).
- **The download is broken on Dev (2026-11-02):** `/quote/{id}/documents/download` returns HTTP 500
  (French "Erreur — Désolé, l'application éprouve des difficultés techniques" page, `text/html`) for every
  quote tried — 6040 (2×), 6480, 6486, 6488 (2×). On 6040 both parts download on their own, so the merge
  itself fails (AP2496_008 FAIL).
- **Individual document PDFs on Dev:** warranty `/warranty/{contractId}/pdf` → 200 `application/pdf`,
  `inline; filename=contrat.pdf` (contract 671: 5 pages); sale `/quote/{id}/sales/pdf` → 200, same
  disposition (quote 6040: 6 pages); Chubb creditor `/quote/{id}/chubb/insurance/contract-pdf` → **HTTP 500**
  on quote 6480 (2026-11-02).
- **Saving a Permaplate product makes no contract on Dev:** after Save the Esthetic protection row shows the
  product and cost, amount "-", no `PNA-` number and no `permaplate-contract-download` link; its ⋯ menu offers
  Generate Contract and Delete. Delete → modal "Cancel a product - Esthetic protection" → "Yes, cancel the
  product" leaves the row at "-".
- **Admin Esthetic protection contract pages show no quote id on Dev** (`/admin/permaplate-contract/{id}` for
  10, 11, 14, 15, 16): no `/quote/{id}` link or quote number — so another dealership's quote id cannot be found
  there.
- Records made by AP-2496 on Dev: quotes 6484–6489 (clients `client.stage.961`–`966`); no contract created.

### On Dev (v2dev) — inventory add-vehicle form and the add-extended-warranty modal's vehicle form (AP-2497), mapped 2026-11-02 (AP-2497 s4)

Dev facts only; staging not checked. Dealer 1380. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2497_2026-11-02.md`.

- **Inventory add form** `/vehicle/new/edit/PASSENGER` ("Add a vehicle", form prefix `vehicle[...]`, button **Save**):
  VIN* (text + lookup button — do not use), Brand* `vehicle[make]` (select; choosing one re-renders the form to load
  Model — wait ~1.5 s), Model* `vehicle[model]`, Year* (number), Vehicle Price*, Kilometers* (text), Condition*
  (new/used/reconstructed, default new), Fuel type* (GASOLINE default, BEV, DIESEL, HYBRID), Transmission* (Automatic
  default/Manual), **Cylinders*** and **Engine size*** (text, no default — must be filled), Engine size unit* (Litre
  default/Watts/KW), Designation* (Particular default/Commercial), Turbo / 4x4 / All Wheel Drive checkboxes, then optional
  manufacturer-warranty dates and max mileage. An empty Kilometers is refused server-side ("This value should not be
  blank.") — **a vehicle without mileage cannot be made here**; the vehicle-first quote form `/quote/new/edit-vehicle`
  makes one (no Kilometers field). Save → `/vehicle/{id}/details` ("Vehicle saved"). The details page shows only
  make/model/year, VIN, Mileage and Designation; fuel type is on `/vehicle/{id}/edit`. Quote "Edit" link for the vehicle:
  `/vehicle/{id}/edit/PASSENGER`.
- **Add-extended-warranty modal** (the "+" on the Extended warranty row; body from `GET /quote/{id}/warranty/edit`):
  top section "Vehicle" with a summary line "{Make} {Model} {Year} · {km} km · {FUEL}" and an **Edit** link, then
  "Program — Choose one of the available program." (program headings with term radios), **Sale price***, Save.
  - The vehicle form `quote_warranty_vehicle[...]` (`novalidate`) has **five** fields: Brand `#quote_warranty_vehicle_make`
    (select), Model `#quote_warranty_vehicle_model` (select), Year `#quote_warranty_vehicle_year` (number),
    Kilometers `#quote_warranty_vehicle_kilometers` (text), Fuel type `#quote_warranty_vehicle_fuelType` (select: Choose,
    GASOLINE, BEV, DIESEL, HYBRID); button **Update vehicle**. No Vehicle type field (AP2497 F1).
  - For a vehicle with every value stored, the form is **collapsed** until Edit is clicked; for a vehicle with no
    kilometres it opens expanded (Kilometers empty, Fuel type "Choose") above the notice "There are no eligible program
    for the vehicle. Please contact us for more information."
  - "Update vehicle" → `POST /quote/{id}/warranty/edit` (AJAX, 200 HTML) re-renders the modal in place (URL unchanged):
    saved values in the summary line, program list re-evaluated, form **collapsed again**. Changing Brand posts the same
    form with `refresh=1` to reload Model and also collapses the form. Server errors ("This value should not be blank.",
    "Please enter a valid year.", "Please enter a valid number of kilometers (0 or more).", "This value is too long. It
    should have 15 characters or less.") render under the field **inside the collapsed form**, so they are hidden until
    Edit is clicked (AP2497 F3). Invalid submits save nothing.
  - Saving updates the **inventory vehicle itself** (its details/edit pages show the new values).
  - Boundaries seen: Year 2030 rejected; Kilometers 0 accepted; 16 digits and 1500.5 rejected; Year number input refuses
    letters as typed.
  - For a stock Toyota Corolla 2022 at 15000 km the modal lists 11 programs; at 25000 km, 9 (Test Program and
    Automation Test Program drop out, and AP Option 3 loses 12m/10000km).
- Records made by AP-2497 on Dev: vehicles 1082–1097, quotes 6490–6505 (clients `client.stage.970`–`984`; quote 6505 has
  no client — made by the vehicle-first form); quote 6491 holds an extended warranty (no contract).

### On Dev (v2dev) — the extended-warranty Generate Contract page after AP-2503, mapped 2026-11-02 (AP-2503 s4)

Dev facts only; staging not checked. Dealer 1380. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md`.

- **Where the action is (verified — it came from the automation code):** `/quote/{id}/details` → "Summary of products"
  → **Extended warranty** row → **⋯** dropdown: **Edit** (`/quote/{id}/warranty/edit`) · **Generate Contract**
  (`/quote/{id}/warranty/generate-contract`) · **Delete** (`/quote/{id}/cancel-product/warranty`). The chevron beside
  "Extended warranty" expands "Program AP 100m/20000km Start date: …" and "Cost … Commission …". After a contract exists
  the ⋯ is replaced by the contract number link (`APOP01-845` → `/warranty/{contractId}`) and a PDF icon
  (`/warranty/{contractId}/pdf`, 200 `application/pdf`, `inline; filename=contrat.pdf`), and "Download all documents"
  appears under Subtotal.
- **The page** (a full page, not a modal; HTTP 200 when typed directly): heading **"Extended Warranty Contract"**, "Back"
  → `/quote/{id}/details`. A red alert "The delivery date has passed the acceptable timeframe. Please update the delivery
  data and the warranty start date" shows even for today's delivery date and does not stop a submit.
  - **Left column:** H4 **"Vehicle identification"** — VIN* (`vinlookup`), Mileage*, Year*, Make*, Model*, Delivery date
    (`datepicker`), Cylinders*, Engine size*, Vehicle transmission* (select), Vehicle condition (select), checkboxes Diesel /
    Turbo / 4x4 / FWD — **all editable** (none read-only, AP2503 F2). H4 **"Owner information"** — Client first name*,
    last name*, company, address, address2, city, province* (select), postal code, email*, tel home, tel work, Indian status
    certificate, drivers license — pre-filled from the quote client. H4 **"Financing information"** — a "Financing
    Company" picker (select; each option carries `data-name/address/city/province/postalCode/phone` and fills the fields
    below), then Financing company name*, phone*, address*, city*, province*, postal code* (text, `required`).
  - **Right column:** H3 **"Program Summary"** — Program Term ("Garantie de base AP — option 1"), Start Date (editable
    `datepicker`, defaults to the delivery date; earlier dates accepted), End date (text, not recalculated on screen),
    Sale price (editable text, = the warranty sale price, no tax). **No vehicle delivery date in the summary** (AP2503 F1).
    Then the button **"Generate Contract"** (`#warranty_finalize_save`), a link "Open PDF in new tab" →
    `/quote/{id}/warranty/pdf`, and an embedded PDF preview (`<embed>` of the same URL): the warranty contract draft
    ("# CONTRAT: incomplete", "example" watermark, 3 pages).
  - Form `warranty_finalize[...]`, POST to the same URL. Fields: `vehicleVIN`, `vehicleKilometers`, `vehicleYear`,
    `vehicleMake`, `vehicleModel`, `vehicleDeliveredAt`, `vehicleCylinder`, `vehicleEngineSize`, `vehicleTransmission`,
    `vehicleCondition`, `vehicleIsDiesel/Turbo/4x4/FWD`, `clientFirstName` … `clientDriversLicense`, `financingCompany`,
    `financingCompanyName/Phone/Address/City/Province/PostalCode`, `dateStart`, `salePrice`.
- **Financing section:** with a quote financing the company's name, address, city, province and postal code are
  pre-filled (picker left at "Choose"; AutoCapital Canada has no phone, so phone stays empty and the submit still
  goes through). With **no financing** all six company fields are empty and the browser's `required` check refuses the
  submit with no on-page message (AP2503 F3) — picking a company in the picker lets it through.
- **Submit:** → `/quote/{id}/details` with "Invoice #N ($456.00) is created" (invoice = the warranty **cost**, not the
  sale price). The contract lists at `/warranty` (Start Date = the date entered on the page; status Pending approval).
  An owner field edited on the page (e.g. tel work) goes onto the contract PDF only; the quote client keeps its value.
  An empty Last name is refused by the browser check (no request sent). `/warranty/{id}` shows only Details / Invoices
  tabs, a "Quote" link and "Open PDF in new tab"; the start date is readable on the `/warranty` list and in the PDF
  ("Start Date: …").
- **Inventory add form** needs Cylinders and Engine size (no default) — `4` and `1.8` used. A new Toyota Corolla 2023,
  12000 km is offered 12 extended-warranty programs; the first is "Garantie de base AP" (option 1 → 100m/20000km; AP
  Option 3 → 12m/10000km, 12m/20000km), cost CA$456.00.
- Records made by AP-2503 on Dev: vehicles 1125–1129, quotes 6557–6561 (clients `client.stage.2503001/004/007/008/009`);
  contracts **APOP01-845** (quote 6558, invoice 942), **APOP01-846** (6559, invoice 943), **APOP01-847** (6561, invoice 944).

### On Dev (v2dev) — the add-roadside-protection modal after AP-2498 (VIN + Year form), mapped 2026-11-02 (AP-2498 s4)

Dev facts only; staging not checked. Dealer 1380. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2498_2026-11-02.md`.

- **Entry:** the red **+** on the quote's "Roadside Protection" row (`href=/quote/{id}/road-side-protection`) opens the
  flow **in a modal**; the URL stays `/quote/{id}/details`. After the first **Continue** the row shows "CA$0.00" and a
  "⋯" menu (Edit · Generate Contract · Delete) instead of the +; ⋯ → **Edit** re-opens the same modal.
- **Modal layout:** heading "Vehicle" with an **Edit** link (`button.btn-link`, toggles a `collapse`), then the form
  `quote_auto_shield_make_model[...]`: `VIN` (text, label "VIN"), `vehicleMake` (Bootstrap-select, label "Make", 151
  makes incl. RV brands and "test test"), `vehicleModel` (label "Model", first option "Choice" once a Make is chosen),
  `vehicleYear` (number, label "Year"), button **Continue** (`[continue]`), hidden `[_token]`. No field has the
  `required` attribute, no label has "*", no VIN lookup button and no `vinlookup` class (2026-11-02).
- **Below the form:** either a red `alert alert-danger` "No road side protection products are available for this
  vehicle." (the ticket's "In order to get a quote for road side protection, please specify the make and model of the
  vehicle." never appears), or "Product info" — form `quote_auto_shield[...]`: `selectedTier` radios (5 tiers),
  `salePrice` "Policy Sale price*", hidden `action`, **Save**. No "Save and Generate Contract", VIN, stock number,
  condition or odometer field (AP-2508).
- **Expanded vs collapsed:** with no products the form is open; when products are listed (on open, or after any
  Continue that returns products) the fields are collapsed and only a summary line "{Year} {Make} {Model} · {VIN}"
  shows until Edit is clicked (AP2498_002/003/009/010/011/013).
- **Prefill:** VIN and Year from the RSP program, else from the vehicle; Make/Model from the RSP program only (a new
  quote shows "Choose"). After a submit the RSP values win over the vehicle's; the inventory vehicle is not changed.
- **Continue** → `POST /quote/{id}/road-side-protection` (AJAX, 200) re-renders the modal in place, no reload. Choosing
  a Make → `GET /quote/{id}/road-side-protection/get-models?make={id}%3A{Name}` and clears the chosen Model. An empty
  VIN is accepted (no browser or server error) and still saves Make/Model.
- **AutoShield on Dev:** no products while Make/Model are empty; with any Make/Model (Toyota Corolla, Honda Accord, years
  2003–2022, even an empty VIN) the same 5 tiers: PNEU + ROUE Standard 12 m 200$ · 24 m 300$ · ($4,000 Aggregate) 12 m
  123$ · ($10,000 Aggregate) 12 m 316$ · Routiers ILLIMITE 12 m 445.5$.
- **Inventory add form on Dev refuses an empty VIN** ("Error This value is required." under VIN) — a no-VIN vehicle
  cannot be made at `/vehicle/new/edit/PASSENGER`.
- Records made by AP-2498 on Dev: vehicles 1106–1118, quotes 6514–6526 (clients `client.stage.2498001`–`2498014`,
  no 004); roadside program rows (CA$0.00) on 6516–6518 and 6521–6526; no contract generated, no Save pressed.

### On Dev (v2dev) — the GAP / creditors add modal with the embedded financing form (AP-2499), mapped 2026-11-02 (AP-2499 s4)

Dev facts only; staging not checked. Dealer 1380, vehicle 915, quotes 6533–6544. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md`.

- **How it opens:** the "+" on the Gap Insurance row (`/quote/{id}/gap-insurance`) or the Creditors insurance row
  (`/quote/{id}/insurance`) loads that route by AJAX into a Bootstrap modal on `/quote/{id}/details`; the URL does not
  change. Wait for the text "Interest rate" before typing — pressing Escape while it loads closes the empty modal.
  Opening either route as a page shows the same content without the modal.
- **No "Please add a financing…" alert any more.** On a quote with no financing both modals show only a block
  **"Financing"** (Edit toggle on the right, expanded) and nothing below it.
- **Financing form** (prefix `quote_financing[...]`): Date of birth* `applicant][dateOfBirthText` (text + date picker),
  Province* `applicant][province` (pre-selected Québec), Type* (Choose / Financing / Lease / Finance lease),
  "Net amount financed including RDPRM*" `baseAmount` (text), Residual* `residualAmount` (text, **required** — an empty
  residual is refused with "This value should not be blank."), Payment frequency* (Choose / Monthly / Bi-Weekly /
  Weekly), Term months* (**drop-down**, 3–240 in steps of 3), Interest rate* (text), Financing company* (Choose + 34),
  a hidden checked checkbox `dueType`, button **Save**. Every drop-down has an empty "Choose" option.
  Server validation inside the modal: "This value should not be blank." per empty field (date of birth was not flagged
  when the post failed on Residual); `abc` in the base amount → "This value is not valid."; interest rate `-5` was not
  flagged on its own. A refused post stores nothing.
- **Once a financing exists** the Financing block opens **collapsed** to one line, e.g. "Financing · 60 months ·
  25,000.00$ · AutoCapital Canada"; the fields (holding the stored values) appear only after **Edit**
  (AP2499_004 FAIL, 2026-11-02). Below it: **"Gap Insurance Quote"** (Rate table* TGGAP, Language* English, Tax
  exempt* No, Gap Term* text, **Get Quote**) or **"Creditors Insurance Quote"** (prefix
  `quote_financing_insurance_chubb[...]`: language E/F, taxExempt 1/0, formCompound `GC6201MQ:PM30`/`PM50`,
  lifeType DECREASING / DECREASING_ACC, lifeTerm, lifeFor BORROWER, critical illness and disability blocks,
  **Get Quote**). After a creditor quote, the re-opened modal (row ⋯ → Edit) shows a "Coverage" table between the
  financing block and the form.
- **Save in the GAP modal on a quote with no financing** posts by AJAX and the modal reloads in place (financing
  collapsed, GAP form below). **Save in the creditors modal on a quote that already has a financing** posts to
  `/quote/{id}/insurance` → 302 → `/quote/{id}/details`, and that whole page is drawn **inside** the modal
  (AP2499_006 FAIL). The financing is saved either way.
- **Get Quote** (GAP or creditors) is a normal page post: the quote page reloads with "GAP insurance quote saved
  successfully" / "Chubb insurance quote saved successfully" and the modal closes; the premium shows only on the row
  (AP2499_007/008 FAIL). A creditors Life term of 999 was priced as a 60-month term (the loan term), with no error.
- **The old financing page** `/quote/{id}/financing` still works on Dev (Save → details, "Financing saved") and its
  financing prefills the modal.
- Records made by AP-2499 on Dev: quotes 6533–6544 (clients `client.stage.2499001`–`2499012@yopmail.com`); creditor
  quotes (no contract) on 6539 and 6541, a GAP quote (no contract) on 6540. No Chubb contract created.

### On Dev (v2dev) — the GAP and creditor Generate Contract pages after AP-2504, and the co-applicant modal, mapped 2026-11-03 (AP-2504 s4)

Dev facts only; staging not checked. Dealer 1380, vehicle 915. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md`.

- **Where the action is:** `/quote/{id}/details` → "Summary of products" → **Gap Insurance** (or **Creditors insurance**) row →
  **⋯** dropdown: Edit · **Generate Contract** · Delete. The links are plain `a.dropdown-item` (no `target`, no modal toggle):
  GAP `/quote/{id}/insurance/create-contract/gap`, creditor `/quote/{id}/insurance/create-contract`. Both open as a **full page
  in the same tab** (HTTP 200 also when typed directly).
- **Page layout (both):** H1 "GAP insurance" / "Creditor Insurance", "Back" → `/quote/{id}/details`. One form
  `insurance_chubb_contract[...]` with **`novalidate`** (POST to the same URL). Left column (`col-md-7`): H4 **"Vehicle
  identification"** — `vehicleVIN`, `vehicleKilometers` (Mileage), `vehicleYear`*, `vehicleMake`* (select), `vehicleModel`*
  (select), `vehiclePrice` (Purchase price = quote vehicle price); H4 **"Owner information"** — `ownerFirstName`*,
  `ownerLastName`*, `ownerDateOfBirth`* (date; from the financing applicant's DOB), `ownerAddress`*, `ownerAddress2`,
  `ownerCity`*, `ownerProvince` (select), `ownerPostalCode`*, `ownerEmail`*, `ownerPhone`* (Home), `ownerWorkPhone`* (Work) —
  every vehicle and owner field is pre-filled and **editable**; H4 **"Co-owner information"** — only when the quote has a
  co-applicant (absent, not empty, otherwise): `coOwnerFirstName`*, `coOwnerLastName`*, `coOwnerDateOfBirth`*, `coOwnerPhone`,
  `coOwnerAddress`, `coOwnerAddress2`, `coOwnerCity`, `coOwnerProvince`, `coOwnerPostalCode`, all pre-filled and editable;
  H4 **"Financing information"** — a read-only definition list (no inputs): Financing company, Creditor address, Net amount
  financed including RDPRM, Payment frequency, Due type, Financing type, Loan term, Residual value, Interest rate. **Payment
  frequency and Financing type print raw codes** (`FREQUENCY_MONTHLY`, `TYPE_FINANCING`) in EN and FR, and several labels stay
  English in FR (AP2504_006 FAIL, 2026-11-03). Right column: H3 **"Program Summary"** — Form, Rate table, Language, Tax exempt
  and the Chubb coverage table (GAP: Gap BORROWER 60 3,094.00$ + 463.33$ tax = 3,557.33$; creditor PM30: Life Decreasing
  BORROWER 60 18.58$ + 1.67$ = 20.25$/m, Equivalent Single Premium 891.31$, Commission (30%) 267.39$), then the red
  **"Generate Contract"** button (PDF icon). No PDF preview, no Financing company picker.
- **Submit:** POST → 302 → `/quote/{id}/details` in ~6 s, flash "Chubb insurance contract created successfully" (same text for
  GAP and creditor). No invoice is created. The row then shows the contract number (GAP `AVPG0000NN`, creditor `AVP000NNN`), a
  PDF icon (`target=_blank`) and the chevron; the ⋯ menu is gone. GAP contracts list at `/gap-insurance-contracts` (columns
  Contract ID · Borrower · Loan · Coverage · Download). **Both PDFs answer HTTP 500 on Dev** (2026-11-03): GAP
  `/quote/{id}/gap/insurance/contract-pdf`, creditor `/quote/{id}/chubb/insurance/contract-pdf`.
- **Blank owner last name:** the browser does not stop it (`novalidate`); the server re-renders the page with "This value should
  not be blank." under the field (`is-invalid`); nothing is created.
- **GAP address on a quote whose GAP contract exists:** redirects to `/quote/{id}/details` with a red flash "Creditor insurance
  already created" (names the wrong product).
- **Co-applicant:** the quote page's Financing card has a "Co-applicant" block ("No applicant") with the link **"Add
  co-applicant"** → `/quote/{id}/financing/co-applicant`, which opens a **modal**: First name*, Last name*, Date of birth*
  (text), Address, Address2, City, Province (select), Postal code, Phone, **Save** (no email). Save → flash "Co-applicant
  saved"; the block shows the name, "Date Of Birth : …" and the address, with a pencil to edit. The quote page shows the
  date of birth one day early (1987-03-20 → "Thursday, March 19, 1987"); the contract page pre-fills it correctly.
- Records made by AP-2504 on Dev: quotes 6562–6566 (clients `client.stage.2504001/004/007/008/010@yopmail.com`); co-applicant
  Coowner Coapp2504 on 6563; GAP contract **AVPG000064** (quote 6564 — the first GAP contract on Dev); creditor contract
  **AVP000171** (quote 6566). GAP quotes without contract on 6562, 6563, 6565.

### On Dev (v2dev) — the roadside Generate Contract action and the roadside contract list, mapped 2026-11-03 (AP-2505 s4)

Dev facts only; staging not checked. Dealer 1380. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2505_2026-11-03.md`.

- **The AP-2505 change is not visible on Dev (2026-11-03, 05:20–05:27Z).** The Roadside Protection row's ⋯ → **Generate Contract**
  link is still `a.dropdown-item` with `data-toggle="modal" data-target="#myModal"` (href `/quote/{id}/road-side-protection-create-contract`);
  Edit and Delete in the same menu carry the same attributes. Clicking it keeps the URL on `/quote/{id}/details` and opens a modal that
  stays on "Loading..."; the AJAX `GET /quote/{id}/road-side-protection-create-contract` answers **HTTP 500**. Typing the address
  directly also answers 500 (French "Erreur — Désolé, l'application éprouve des difficultés techniques" page, even with `?_locale=en`).
  Seen on six new quotes 6568–6573 (with and without GAP quote, with and without financing) — same symptom as AP-2518. The GAP and
  creditor Generate Contract links on the same quote are plain links (see the AP-2504 section above).
- **Roadside product without financing:** the roadside modal does not ask for a financing; a product saves on a quote with no
  financing (quote 6570).
- **Roadside product saves on Dev** with Make Toyota / Model Corolla / Year 2022 (VIN pre-filled from the vehicle): Continue lists the
  same 5 tiers as in the AP-2498 section; first tier + Policy Sale price 250 → **Save** → flash "The Roadside protection coverage has
  been saved successfully", row "CA$250.00" with ⋯ (Edit · Generate Contract · Delete), no contract (AP-2508 not hit).
- **Dealer roadside contract list** `/road-side-protection-contracts` (heading "Road side protection contracts"): columns Autoshield
  contract ID · VIN · Client · Phone · Price · Actions ("Details"). On Dev it holds only **2698** and **2697** (VIN 1FAHP35NX8W239204,
  vehicle 915); both show Price "25,000.00 $". No pagination shown.
- **Invoice list** `/invoice`: newest invoice on 2026-11-03 05:25Z = **944** (warranty APOP01-847).
- Records made by AP-2505 on Dev: vehicles 1130–1135 (VINs 2T1BURHE0NC505001/002/006/007/008/009), quotes 6568–6573 (clients
  `client.stage.2505001/002/006/007/008/009@yopmail.com`, Roadside Owner2505-NNN); roadside products (CA$250.00, no contract) on all six;
  financing on all but 6570; GAP quote (no contract) on 6568. No roadside contract, no invoice created.

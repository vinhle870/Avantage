# Knowledge — Admin Portal Routes

**Mapped:** 2026-08-29, Staging (v2staging). Full sidebar enumeration (49 links) is in the
execution log `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2437_2026-09-06.md`.
Below are only the routes exercised so far — 10 of 49.

Base URL and credentials: [execute.env.md](../base-test/execute.env.md).

---

## Routes that matter so far

| Purpose | Route |
|---|---|
| Dealers list | `/admin/dealers` |
| One dealer | `/admin/dealer/{id}/edit` · `/admin/dealer/{id}/rate-client` |
| Add a dealer | `/admin/dealer/new/edit` |
| Dealer users | `/admin/dealer-users` · `/admin/dealer-user/{id}/change-password` |
| Dealer users — search, User Details page (Dev, 2026-11-04, AP-2441 run) | **Dev:** `/admin/dealer-users` columns User ID, Name, Email, Action (change-password key icon), Last Login; 10 per page (9 pages on 2026-11-04). The header magnifier (`href="#"`) opens a "Search" dialog with one field **Keyword*** (`user_search[keyword]` + `user_search[_token]`) — submit it; a URL parameter alone is ignored. A user who has no dealer left is **not listed and not found** by the search. Clicking a row opens the **Dealer User Details page `/admin/dealer-users/{userId}`**: heading "User {first} {last}", header link **"Edit user"** (`/admin/dealer-user/{userId}/edit`), "User details" (Email, First name, Last name) and a **"Dealers"** table — Dealer ID, Name, Email, Phone, Group, Actions. Each dealer row has four icon buttons with tooltips **"Auto Shield"** (`/admin/auto-shield/{linkId}`), **"Dealyourate"** (`/admin/rate-user/{linkId}`), **"Edit permissions"** (`/admin/edit-permission/{linkId}`), **"Unlink"** (`/admin/unlink-permission/{linkId}`), each with `?redirectUrl=` back to the page; no "Edit user" in the rows. `{linkId}` is the user-to-dealer link, not the user or dealer id. Clicking a row cell (not a button) opens `/admin/dealer/{dealerId}` (Details tab). The page still opens by URL when the user has no dealer ("No entities found") |
| Dealer Details tabs · Users tab (Dev, 2026-11-04, AP-2441 run) | **Dev:** `/admin/dealer/{id}` (Details) with tabs Details, Users (`/admin/dealer/{id}/users`), Program eligibility (`/program-eligibility`), Customer portal (`/customer-portal`), Financing Options (`/financing-options`), Esthetic protection (`/permaplate`). Users tab: heading "Dealer {name} > Users", header link **"Link user"** (`/admin/dealer/{id}/link-user`), columns Name, Email, Roles (one badge per granted role, shown in the order the roles were granted), Actions — five tooltips "Auto Shield", "Dealyourate", "Edit permissions", **"Edit user"** (`/admin/dealer-user/{userId}/edit`), "Unlink" |
| Dealer-user action modals (Dev, 2026-11-04, AP-2441 run) | Every action above opens a **modal over the current page** (URL unchanged) with a Save-type button and **no Cancel or ×** — close with Escape. Edit user: Email*, First name*, Last name*, Phone, Language* (Français/English), "Enable two-factor authentication*", Save. Auto Shield: heading "Auto shield integration", Autoshield dealer id*, Username, Password*, Confirm password*, Autoshield user id*, Save. Dealyourate: no heading, "Deal Your Rate User ID*", Save. Edit permissions: heading "Link {dealer name} to a user", group "Roles" with 12 checkboxes (Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management), Save → banner "The permissions are saved for user {name} linked to dealer {dealer}". Unlink: heading "Unlink user {email} to {dealer}", single "Unlink" button → banner "The user {name} is unlinked to dealer {dealer}" (deletes the link). Link user: heading "Link {dealer} to a user", Email*, group "Permissions" (same 12), "Link" → banner "The user {name} is now linked to dealer {dealer}" (new link id). Saves return to the `redirectUrl` page |
| Dealer groups / wholesalers | `/admin/dealer-groups` · `/admin/wholesalers` |
| Insurance | `/admin/insurance` |
| Chubb Insurance Configuration | `/admin/dealer/{id}/chubb-insurance` — see [chubb-insurance.md](chubb-insurance.md) |
| Programs list · one program term | `/admin/programs` (rows link to `/admin/program/{id}/edit`, `/translation/en` · `/translation/fr`, `/assign-coverage-component`) · `/admin/program-term/{id}/edit` — form `program_term[...]`: `programOption` (select), `eligibilityYears`, `eligibilityKm`, `termMonths`, `termKm`, `franchiseAmount`, `repairAmountPerVisit`, `repairAmountTotal`, `repairAmountText`, **`suggestedRetailPrice`** (label "Suggested retail price"), checkboxes `eligibilityCategory[]` (Category A–E), `fuelTypeEligibility[]` (GASOLINE, BEV, DIESEL, HYBRID), `vehicleTypeEligibility[]`. No sidebar link goes straight to a term; the term id is the value of the Client portal's term radio. Mapped 2026-11-01 on Dev (AP-1948 run). "Save" redirects to `/admin/program-terms` with the message "Program terms saved" (used once on term 16 in the AP-1948 re-run and restored the same minute) |
| Vehicle models — category (Dev, 2026-11-15, AP-1948 run) | **Dev:** sidebar **Vehicle Models** `/admin/vehicle-model` — heading "Vehicle Models"; columns Make ID, Make Name, Model ID, Model Name, **Category**, Actions; 10 per page, 225 pages on 2026-11-15, newest id first; filter by **Make** (`vehicle_model_search[make]`, a bootstrap-select with live search — set the hidden select's value, then click the form's submit `vehicle_model_search[save]`; the filtered list is not paginated for TESLA). Edit `/admin/vehicle-model-edit/{id}/edit` (heading "Vehicle model #{id}"): `vehicle_model[name]` (text), `vehicle_model[make]` (select), **`vehicle_model[category]`** (select: `CATEGORY_A`…`CATEGORY_E` = "Category A"…"Category E"), `vehicle_model[type]` (select: e.g. 1 = Passenger, 2 = Motorcycle, 4 = ATV / UTV), button Save → `/admin/vehicle-model` with "Vehicle model saved". Delete: `/admin/vehicle-model/delete-item/{id}` (never used). This is the "category" Q-001 on AP-1948 refers to: the Client portal offers a program term only when the term's `eligibilityCategory[]` ticks the model's category (verified by changing TESLA Model 3 #3124 A → D → A and A → E → A; both restored). TESLA models on Dev: Model 3 #3124 A, Model Y #3126 A, Model S #3127 B, Model X #4725 B, X #4724 B. The Client portal vehicle list entry links to the model through **Manufacturer Vehicles** `/admin/manufacturer-vehicle/{id}/edit` ("Vehicle #{id}": make, model, trim, year, fuelType, …), e.g. entry 80 = TESLA Model 3 Long Range 2022, BEV. Changing a model's category is shared configuration on Dev — record and restore it in the same case |
| Financing companies | `/admin/financing-company` (sidebar "Financing Company"; columns Name, Address, Actions — no lender-ID column) · edit `/admin/financing-company/{id}/edit?redirectUrl=…` · delete `/admin/financing-company/{id}/delete`. Edit form labels: Name, Address, City, Province, Postal code, Phone, **Auto shield lender id** (the AP-2226 field). Mapped 2026-11-01 on Dev (AP-2225 run, read only): AutoCapital Canada is id 39 with an empty Auto shield lender id; first page lists ids 58, 45, 44, 43, 42, 41, 40, 39, 38, 37 |
| Warranty contracts — list, details, notes (Dev, 2026-11-05, AP-2434 run) | **Dev:** sidebar Contracts → Warranties `/admin/warranty` (tab "Pending approval"), tabs Approved `/admin/warranty/approved`, Cancelled `/admin/warranty/cancelled`, All `/admin/warranty/all`; columns Client, Dealer, Vehicle, Program (shows the contract number, e.g. "APOP01-827 100m/20000km"), Invoices, Components, Start Date, Created on; a whole row is clickable. Details `/admin/warranty/{id}` — heading "Warranty #" with **no number**; the contract number appears only in the list and the embedded contract PDF (`/admin/warranty/{id}/pdf`). Tabs Details, Edit `/edit`, Invoices `/invoices`; buttons Create Invoice `/create-invoice`, Create a claim (menu), Cancellation refund `/cancellation-refund`. **Notes** are listed under the PDF, newest first: card = title (h5), "<weekday, date> at <local time> Created by <admin email>", description paragraph, badge Public/Private, Edit `/admin/warranty/note/{noteId}/edit`. "Add note" `/admin/warranty/{id}/create-note`. Note edit form ("Edit Note - Warranty Contract #{id}"): Title\*, Description\*, Upload a file, checkbox Is public — no HTML-body field. An unknown id (`/admin/warranty/999`) returns HTTP 404 |
| Warranty contract edit — vehicle and client fields (Dev, 2026-11-05, AP-2435 run) | `/admin/warranty/{id}/edit` has accordions **Vehicle** (open by default: VIN\*, Make\*, Model\*, Year\*, Vehicle kilometers\*, Is diesel, Delivery date\*, Vehicle price\*, Condition), **Client** (closed by default: Client email\*, last name\*, first name\*, company, address, address2, city, province\*, postal code, tel home, tel work, indian status certificate, drivers license), **Warranty**, **Financing**. Read-only use: open the accordion, do not Save. The list row (Approved tab) shows the client's telephone, the VIN and the contract number together. Record 827 (APOP01-827) holds placeholder client data (VIN `123123123123`, postal `12345`, tel `11111`); record 836 (APOP01-836) holds realistic data (see `admin-api.md` §3.2) |
| Risk Management — Earning Sets / Curves / Groups / Assignments | `/admin/earning-set` · `/admin/earning-curve` · `/admin/earning-group` · `/admin/earning-assignment` — see [risk-management.md](risk-management.md) (mapped 2026-10-03) |

**The Dealers list search only works through its dialog.** The magnifier link in the page
header (`href="#"`, the first `.btn` on the page) reveals a form holding
`dealer_search[name]` and `dealer_search[_token]`. A plain GET with just the name parameter
is ignored — the CSRF token must come from that form. Columns are Dealer ID, Name, Company,
Email, Phone, Group, Actions: **no province and no account-label column.**

**Historical open problem (resolved 2026-09-01):** the dealership behind
`vinhle870@gmail.com` displays as "Test QA staging" in the dealer portal but did not match
any row in Admin → Dealers when searched by that label. Resolution: **search by email, not
by the portal-displayed company label** — the list's search box matches the dealer's
**Name** field ("Offical VinhLe870@gmail.com"), not the **Company** field ("Test QA
staging"). Dealer ID is **1380**. See
[execute.env.md](../base-test/execute.env.md) for the full record.

**Non-Quebec dealerships that do exist** (useful once a dealer-user password is available):
ONTARIO TAX TEST, TESTING Alberta, TESTING for BC, TESTING Nova Scotia, SASKATCHEWAN TEST,
Manitoba TEst, NF Test, PEI TEST, NWT TEST, YUKON TEST, NUNAVUT TEST.

---

## Not yet mapped

38 of 49 sidebar routes remain unexplored (Programs mapped 2026-11-01). See the mapping guide
([_mapping-guide.md](_mapping-guide.md)) before diving into any of them.

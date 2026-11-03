# Navigation Map — Avantage Plus v2 (Staging)

**This file is an index only.** It maps each feature area to the `qa-docs/*.md` file that
holds its actual routes, forms, flows and gotchas — it does not carry that detail itself.
Read this first to find the right document, then read that document.

Base URL and credentials: [execute.env.md](execute.env.md). Vehicles and dynamic data:
[test-centralized.md](test-centralized.md).

---

## 1. The three portals

| Portal | Login route | After login | Viewport |
|---|---|---|---|
| Dealer | `/login` | `/` — "Hi {user} Welcome to {dealership}'s account" | 1280 × 800 |
| Admin | `/admin/login` | `/admin` — "{user} Welcome to the admin" | 1280 × 800 |
| Client | `/customer/{id}/quote-request` | No login — a direct per-customer link | — |
| Client (buy online) — Dev fact, 2026-11-02 | `/customer/avantage-plus/buy` | No login — public purchase flow, no customer id | 1280 × 800 used |

The same credentials serve the Dealer and Admin portals, and **both sessions can be held
at once in one browser** — logging into `/admin/login` does not end the dealer session.
Useful when a case needs an admin setup step in the middle of a dealer flow.

The admin login page renders in French ("Connexion", "Courriel", "Mot de passe",
"Se connecter") regardless of the dealer portal's language setting.

---

## 2. Dealer portal navigation

The left sidebar collapses its sub-menus until the parent is clicked, so a first snapshot
shows only the seven parents. **Do not hunt in the sidebar — navigate by URL.**

| Sidebar parent | Children (route) |
|---|---|
| Dashboard | `/` |
| Vehicles | Inventory `/vehicle/inventory` · Quotes `/quotes` · Insurance Quick Quote `/quick-insurance-quote` · **Insurance compliance log** `/insurance-compliance-log` |
| Contracts | Warranty `/warranty` · Road Side Protection `/road-side-protection-contracts` · Creditors insurance `/creditor-insurance-contracts` · Gap Insurance `/gap-insurance-contracts` · Permaplate `/permaplate-contracts` (sidebar label "Esthetic protection" as of 2026-10-04) |
| Claims | `/claims` |
| Billing | Invoices `/invoice` · Payment history `/invoice/payment-history` |
| System preferences | Language settings `/language?redirectUrl={abs_url}` · Users `/users` |
| Logout | `/logout` |

**The Dashboard also carries two action links the sidebar does not:** "Create quote"
(`/quote`) and "Insurance Quick Quote" (`/quick-insurance-quote`). A previous run lost time
looking for Insurance Quick Quote in the sidebar — it *is* in the sidebar under Vehicles,
but only once that sub-menu is expanded, and the Dashboard link is the faster route.

---

## 3. Feature index

| Feature area | qa-docs file | Scope | Last mapped |
|---|---|---|---|
| Quote creation (client → vehicle → warranty → financing → sales) | [quote-creation.md](../qa-docs/quote-creation.md) | Full flow, entry-point gotcha (HTTP 500 without a vehicle); `/quotes` row ids via `data-href`; AP-2477 vehicle-first form `/quote/new/edit-vehicle` not deployed (HTTP 404) as of 2026-10-12; Road side protection page on Dev differs from staging (AP-2225 run, 2026-11-01); Dev quote details "Summary of products", product ⋯ menus, cancel-product routes, GAP quote route `/quote/{id}/gap-insurance`, Subtotal composition, `/quotes/archived` (AP-2493 run, Dev, 2026-11-02); Dev "Download all documents" action `/quote/{id}/documents/download` (HTTP 500), individual warranty/sale/Chubb PDF routes (AP-2496 run, Dev, 2026-11-02); Dev `/quotes` Contracts column + keyword search, roadside Generate Contract HTTP 500, sales contract page, `/warranty` list columns (AP-2494 run, Dev, 2026-11-02); Dev add-roadside-protection modal (VIN/Make/Model/Year form, collapse behaviour, AJAX Continue, get-models route) and inventory add form refusing an empty VIN (AP-2498 run, Dev, 2026-11-02); Dev GAP / creditors add modal with the embedded financing form — fields, collapse once a financing exists, Save / Get Quote behaviour, validation (AP-2499 run, Dev, 2026-11-02); Dev roadside ⋯ → Generate Contract still a modal link with HTTP 500 for every quote, roadside product without financing, dealer roadside contract list `/road-side-protection-contracts` (AP-2505 run, Dev, 2026-11-03) | 2026-11-03 |
| Chubb insurance (admin config, quoting, contract listing, dealer-side config reading) | [chubb-insurance.md](../qa-docs/chubb-insurance.md) | End-to-end feature + UI/route reference | 2026-10-03 |
| Compliance documents (send flow, registers, email) | [compliance-documents.md](../qa-docs/compliance-documents.md) | Full feature | 2026-08-29 |
| Admin portal | [admin-portal.md](../qa-docs/admin-portal.md) | 12 of 49 sidebar routes (+ program-term edit form, AP-1948 run; financing companies + Auto shield lender id, AP-2225 run on Dev) | 2026-11-01 |
| Admin Risk Management (Earning Sets, Curves, Groups, Assignments) | [risk-management.md](../qa-docs/risk-management.md) | Earning Sets full (create/edit dialog, validation, pagination); siblings list pages + assignment form fields; Earning Assignment details page, Add/Edit Parameter dialog, parameter delete, 11-row HTTP 500; Earning Assignments list + Create/Edit assignment modal, empty Earning Set/Dealer Group HTTP 500 (AP-2474 run); Add/Edit Parameter form after AP-2476 (optional fields, "All", odometer 0/999999, Coverage Code multi-select, Start date fields); AP-2487 additions (Start date range display/validation, multi-code grid, Select All, automation gotchas) | 2026-10-12 |
| Admin Earning Groups (create/edit modal, assign/unassign curves) + Earning Curve create form | [earning-groups.md](../qa-docs/earning-groups.md) | Full: routes, group/assign/unassign/curve forms, validation, the empty-Assign HTTP 500, fixtures | 2026-10-03 |
| Admin Earning Curves (list, create/edit form, curve types, factor table, validation) | [earning-curves.md](../qa-docs/earning-curves.md) | Full: routes, form fields and option values, fraction-scale factors, re-post on type/term change, validation messages, no delete, the empty-factor HTTP 500, fixtures 9–13 | 2026-10-04 |
| Permaplate / "Esthetic protection" contract lists (dealer `/permaplate-contracts`, admin `/admin/permaplate-contracts`, admin details `/admin/permaplate-contract/{id}`) | [quote-creation.md](../qa-docs/quote-creation.md) § Permaplate contract lists | Columns, paging, phone rendering, Download PDF link (AP-2463 run). Dev: quote Permaplate page, the ⋯ → Generate Contract menu, the contract form fields, PDF download HTTP 500 (AP-2428 run, 2026-11-02) | 2026-11-02 |
| Billing — dealer invoices (dealer `/invoice`, `/invoice/{id}`; admin `/admin/invoices`, `/admin/invoice/{id}`, `/admin/invoice/{id}/pdf`) | [billing-invoices.md](../qa-docs/billing-invoices.md) | List columns and paging, clickable rows, invoice detail layout (From / To / Status), To-block content, admin search form, dealer page has Print only (AP-1381 run, Dev). Payment history not mapped | 2026-11-01 |
| Client portal quote request (vehicle list → ownership → coverage → client info → summary) | [client-portal-quote-request.md](../qa-docs/client-portal-quote-request.md) | Five steps, routes, form field names, where the price shows (Summary "Subtotal" only), the fixed vehicle list (AP-1948 run, Dev) | 2026-11-01 |
| Customer portal — buy a warranty online (`/customer/avantage-plus/buy` → `/client` → `/coverage` → `/coverage-2` → `/summary`), no login | [customer-portal-buy-online.md](../qa-docs/customer-portal-buy-online.md) | **Dev facts only** (AP-2377 run, v2dev): four steps and routes, form field names, FORM-L25 consent, surcharge questions page, summary layout, mileage-limit HTTP 500. Payment step and admin warranty details page not mapped | 2026-11-02 |
| Claims — dealer filing (`/claims`, `/warranty/{id}` → File a claim), admin repair claims (`/admin/claims`, `/admin/claim/{id}/details`), Change status form and its notify-by-email fields | [claims.md](../qa-docs/claims.md) | Routes, claim form fields (no notify-email field), Change status fields per target status, email sent, attachment-upload HTTP 500 (AP-2374 run, Dev) | 2026-11-01 |

**How to use this table:** find the feature you need, open its qa-docs file. A feature not
listed here is an undocumented gap — see §4.

---

## 4. Not yet mapped

| Area | Why it matters | Likely entry route |
|---|---|---|
| Warranty contracts | The Warranty section of a quote leads here. Creating one on Dev is now in quote-creation.md (*On Dev*); the contract list/details pages are not mapped | `/warranty`, `/warranty/{id}` |
| Road Side Protection · Gap contracts | Each has a quote stage already mapped but an unmapped contract list (Permaplate lists mapped 2026-10-04 — see §3) | `/road-side-protection-contracts`, `/gap-insurance-contracts` |
| Billing — payment history | Invoices are mapped (see §3); payment history and "Make a payment" are not | `/invoice/payment-history`, `/invoice/select-payment` |
| Admin area beyond dealers, insurance and Risk Management | 49 sidebar routes, of which 10 are mapped | see [admin-portal.md](../qa-docs/admin-portal.md) |
| `/quote/{id}/dyr-rates` | Renders no heading and no form — purpose unknown | `/quote/{id}/dyr-rates` |
| `/quote/{id}/exchange-vehicle` | Reachable from Quote Details, never opened | `/quote/{id}/exchange-vehicle` |

**Mapping a new area, or closing one of these rows?** Follow
[qa-docs/_mapping-guide.md](../qa-docs/_mapping-guide.md) — it is mandatory after any
manual-execution run or live exploration that touches an undocumented flow. Remove the row
from this table in the same edit that adds its qa-docs file and index entry above.

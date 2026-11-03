# Knowledge — Billing: dealer invoices (Dealer and Admin portals)

**Mapped:** 2026-11-01, Dev (v2dev), Dealer portal and Admin portal, the shared QA account
(dealer 1380). Mapped during the AP-1381 run. Not yet re-checked on Staging.

## Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Dealer invoice list | `/invoice` | "Invoices" | Columns: Invoice ID · Description · Amount · Created at · Status. Newest (highest ID) first. 10 rows per page, paged by `?page=N`; "Last" link gives the last page (26 on dev on 2026-11-01). A "Make a payment" link goes to `/invoice/select-payment` |
| Dealer invoice detail | `/invoice/{id}` | "Invoice #{id}" | Rows on `/invoice` are clickable (`tr.clickable-row[data-href="/invoice/{id}"]`); the Invoice ID itself is plain text |
| Dealer payment history | `/invoice/payment-history` | — | Not opened |
| Admin invoice list | `/admin/invoices` (sidebar "Invoices") | "Invoices" | Same five columns; covers every dealer. Rows clickable to `/admin/invoice/{id}` |
| Admin invoice detail | `/admin/invoice/{id}` | "Invoice #{id}" | Buttons: Back · Print · Edit · Credit memo · Add payment · PDF |
| Admin invoice PDF | `/admin/invoice/{id}/pdf` | — | Returned HTTP 500 ("Erreur — Désolé, l'application éprouve des difficultés techniques…") for invoice 934 on dev, 2026-11-01 |
| Admin payment history | `/admin/invoice/payment-history` | — | Not opened |
| Admin invoice report | `/admin/report/invoice` | — | Sidebar "Invoices" under reports. Not opened |

## Entry points

- Dealer: sidebar Billing → Invoices (`/invoice`). Navigate by URL; the sub-menu is collapsed.
- Admin: sidebar "Invoices" (`/admin/invoices`). There are two sidebar links labelled
  "Invoices" — the list is `/admin/invoices`; the other is the report `/admin/report/invoice`.
- In both lists, the link under the Invoice ID points to the **source contract**, not the
  invoice: `Warranty #<prefix>-<n>` → `/warranty/{n}` (admin `/admin/warranty/{n}`), or
  `#PNA-<number>` → `/quote/{quoteId}/permaplate-contract-download` (admin
  `/admin/permaplate-contract/{n}`). Click the row (any other cell) to open the invoice.

## The flow

```
/invoice --(click row)--> /invoice/{id} --(Print)--> browser print dialog (window.print)
/admin/invoices --(click row)--> /admin/invoice/{id} --(PDF)--> /admin/invoice/{id}/pdf
```

## Forms

Admin list search form (prefix `invoice_search`), hidden until the "Search" toggle is
clicked: `invoice_search[invoice_number]` (text), `invoice_search[invoiceType]` (select:
`""` All · `INVOICE` Invoice · `CREDIT_MEMO` Credit Memo), submit `invoice_search[save]`.

## Page or modal

Invoice detail page layout (both portals): **From:** (Produits Avantage Plus address) ·
**To:** (the dealer) · **Status:** badge; then a Description/Total table, "Check payable
to", the tax lines (GST 5 %, PST 9.975 %), Grand Total, Balance, and a footer card
"Invoice created — {date} — {source contract}".

The **To:** block is: dealer name (bold, the `dealer[name]` value — e.g. "Offical
VinhLe870@gmail.com" for dealer 1380) · address · postal code · "city , province, Canada" ·
"Email: …" · "Phone: …". The dealer's Company name ("Test QA staging") is not in the To
block on current invoices; it does appear in the Description cell of Permaplate invoices.

Old invoices keep the name that was stamped when they were created: invoice 65 (2020-11-25)
reads "VinhLeDealer01 / Vancouver / , , Canada".

## Side effects — where the data lands

Read-only pages; nothing is written by opening them.

## Gotchas

- **The dealer detail page offers no PDF or download** — only "Print", which is
  `window.print()`. The PDF link exists only on the admin detail page.
- The Description column of the dealer list shows the full line-item text, so it is long;
  read the Invoice ID cell to find the source type (`Warranty #…` vs `#PNA-…`).
- The oldest invoices on dev share one date (invoices 65 and 66, 2020-11-25).

## On Dev (v2dev) — Permaplate invoice description and invoice PDF, mapped 2026-11-02 (AP-2501 s4)

Dev facts only; staging not checked. Dealer 1380, vehicle 915. Source:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md`.

- **Permaplate invoice Description (AP-2501 is deployed on Dev):** six `<br>`-separated lines —
  client name · vehicle ("Ford Focus 2008") · "VIN : {vin}" · contract number ("PNA-0000000020") ·
  **term name** ("10 ans") · "{dealer company} {dealer email}" ("Test QA staging vinhle870@gmail.com").
  The same text appears on `/invoice/{id}`, `/admin/invoice/{id}`, and in the Description column of both
  lists (`/invoice`, `/admin/invoices`), in full on several lines (not shortened). The Total column is the
  dealer cost of the options (e.g. $80.00), then GST 5 % / PST 9.975 % → Grand Total ($91.98).
- **The invoice PDF is broken on Dev (2026-11-02):** `/admin/invoice/{id}/pdf` returns HTTP 500
  (`text/html`, French "Erreur — Désolé, l'application éprouve des difficultés techniques…") for every
  invoice tried — 941, 940, 937, 936, 935, 934, 930, 900, 800 — Permaplate and warranty alike. The error page
  is rendered inside the dealer layout (dealer sidebar), even when opened from the Admin portal.
- **The Dealer invoice page has no PDF:** only "Print" (`href="#"`, `window.print()`) and the footer
  `#PNA-…` link to `/quote/{quoteId}/permaplate-contract-download` (the contract PDF, HTTP 500 on Dev —
  AP-2512). The Admin detail page's footer link goes to `/admin/permaplate-contract/{n}` instead.
- Records made by AP-2501 on Dev: invoice **941** (quote 6555, contract PNA-0000000020, admin contract id 20).

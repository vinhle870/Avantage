# Knowledge — Claims (dealer filing, admin claim details, Change status)

**Mapped:** 2026-11-01, **Dev (v2dev)**, shared admin/dealer account (`env` → Dev Environment),
during the AP-2374 s4 run. Not yet checked on staging.

## Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Dealer claim list | `/claims` (tabs `/claims/submitted`, `/authorized`, `/paid`, `/refused`, `/cancelled`, `/all`) | "Claims" | Columns ID · Description · Status · Total · Date Created. Rows are `data-href="/claim/{id}/details"`. **No create action** on this page |
| Dealer file a claim | `/claim/new/edit?warranty={warrantyId}` | "File a claim" | Opened as a **modal** from the dealer warranty contract page `/warranty/{id}` → "File a claim" |
| Dealer claim details | `/claim/{id}/details` | — | Edit Info `/claim/{id}/edit`, Print `/claim/{id}/pdf-print`, Upload invoice `/claim/{id}/upload-invoice`, Upload work order `/claim/{id}/upload-work-order` (PDF only), Add item `/claim/{id}/item` |
| Admin repair-claim list | `/admin/claims` (sidebar Claims → "Repair Claims"; tabs `/admin/claims/REPAIR/{created,pending,approved,dealer_accepted,authorized,paid,refused,cancelled,all}`; `/admin/claims` itself is the Submitted tab) | "Repair Claims" | Columns ID · Description · Assignee · Service Center · Dealer · Status · Total · Date Created. Search form `claim_search[client_name|claim_number|warranty_number|date_range_start|date_range_end|assignee][]`. Other sidebar items: Preapproved Repair Claims `/admin/claims/REPAIR/approved`, Maintenance Claims `/admin/claims/MAINTENANCE`, Claim Items `/admin/claim-items`, Reports → Claims `/admin/report/claim` |
| Admin claim details | `/admin/claim/{id}/details` | "Claim details" | Actions: Edit Info `/admin/claim/{id}/edit`, Tax settings, Print `/admin/claim/{id}/pdf-print`, **Change status** (dropdown), flag toggle, Add attachment `/admin/claim/{id}/upload-attachment`, Add item, Bulk edit. Cards: Claim #, Diagnostic, Contract (link `/admin/warranty/{id}`), Related Claims, Client (address, phones, email), Status, Assignee, Attachments, items, history notes |
| Admin create claim | `/admin/claim/new/edit?type=REPAIR&warrantyId={id}` (or `type=MAINTENANCE`) | — | From admin warranty page `/admin/warranty/{id}` → "Create a claim" menu |
| Change status form | `/admin/claim/{id}/change-status?status={status}` | "Change status for claim #{id}" | Opened in a **modal** (`#myModal`) from the Change status dropdown |

## Entry points

- A claim is always filed **from a warranty contract**: dealer `/warranty/{id}` → "File a
  claim", or admin `/admin/warranty/{id}` → "Create a claim" → Repair / Maintenance.
- A warranty contract exists only after the quote's warranty is turned into a contract:
  quote details → Extended warranty ⋯ menu → **Generate Contract** (see
  [quote-creation.md](quote-creation.md) — *On Dev*). No Sales contract stage is needed.
- Admin **Change status** is a `button` that opens a dropdown of nine statuses; each item is
  an `a.dropdown-item[data-toggle=modal]` pointing at `change-status?status=…`. The dropdown
  items are invisible until the button is clicked.

## The flow

```
/warranty/{id} --File a claim (modal)--> Save --> /claim/{id}/details
/admin/claim/{id}/details --Change status--> dropdown --<status>--> modal form --Save--> /admin/claim/{id}/details ("Claim saved")
```

## Forms

**Claim (dealer and admin)** — prefix `claim[...]`: contractNumber*, contractTermMonths,
contractTermKm, contractStartDate*, contractEndDate*, clientFirstName, clientLastName*,
vehicleMake, vehicleModel, vehicleYear, vehicleKmAtSale (all pre-filled from the contract),
**vehicleKmAtClaim***, **diagnostic*** (textarea), garageName, vin, warrantyComponents,
invoiceInformation, invoiceFilename (file), invoiceDate; admin adds serviceCenter (select, 20).
**There is no notify-email field on any claim form** (checked 2026-11-01; AP-2374 Q-010).

**Change status** — prefix `claim_status[...]`; the fields depend on the target status:

| Target status (`?status=`) | Fields |
|---|---|
| created, submitted, approved (Preapproved), dealer_accepted, paid, cancelled | deductibleAmount*, claimStatusNotes[0][description]* (Note) |
| pending | deductibleAmount*, **notifyCustomerByEmail** (label "Notify customer by email", unticked by default), recipientEmails, Note* |
| authorized, refused | deductibleAmount*, **notifyByEmail** (label "Notify by email", **ticked by default**), recipientEmails (label "Recipient email(s) - separate by commas for multiple recipient", placeholder "email1@example.com, email2@example.com"), isGoodWill, Note* |

`recipientEmails` is pre-filled with the contract client's email (a claim with no notify email
gives just that address, no stray comma). Hidden `claim_status[status]` carries the target.

**Upload attachment (admin)** — attachment type select (Work order · Invoice · Signed claim ·
Other) and File*.

## Validation and messages

- Change status Save → flash "Claim saved"; status badge shows "<Status> m/d/yy, h:mm AM/PM"
  (Eastern time). An invalid recipient (`not-an-email`) or an empty recipient list is
  accepted with no message.
- Claim page always shows info alerts "The claim is N days after the delivery date of the
  vehicle" and "Please add some items in the claim" when it has no items.

## Side effects — where the data lands

- Status change with notify ticked → email from "Systeme Avantage Plus
  <no-reply@garantieavantageplus.ca>", subject "Claim updated", attachment
  `claim-{id}.pdf` (wkhtmltopdf). The body text depends on the status (Refused: "…the claim
  has been refused…"; Authorized: "Thank you for your claim request. Please find attached the
  decision…"). Arrives in Yopmail within seconds.
- Each status change adds a history note: "Status change: <Status>" plus the Note text.

## Gotchas

- **Admin Add attachment returns HTTP 500 on dev** (PNG file, 2 of 2 tries, 2026-11-01). The
  dealer "Upload work order" accepts PDF only.
- The dealer `/claims` list has no "new claim" button — go through the warranty contract.
- Claims created via the API show `created by User Machine`; some have the literal value
  `string` as an email.

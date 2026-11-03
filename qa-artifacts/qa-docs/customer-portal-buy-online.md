# Knowledge — Customer portal: buy a warranty online

**Mapped:** 2026-11-02, **Dev (v2dev)**, no login. Mapped during the AP-2377 run
(`qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md`). **Every fact
below is a Dev fact; none has been checked on Staging.** The ticket's screenshots (AP-2377 A1–A3)
come from an older build; where they differ, the Dev fact is written here and the difference noted.

This is a different flow from the per-customer quote request (`/customer/{id}/quote-request`,
see [client-portal-quote-request.md](client-portal-quote-request.md)): it needs no customer id,
has four steps instead of five, and collects email and postal code on the first step.

## Routes

| Purpose | Route | Heading (EN / FR) | Notes |
|---|---|---|---|
| Step 1 — Vehicle | `/customer/avantage-plus/buy` | "Buy a warranty online" — "Enter the vehicle" / "Acheter une garantie en-ligne" — "Info du véhicule" | Form POSTs to the same route |
| Step 2 — Client Info | `/customer/avantage-plus/buy/client` | "Coverage for the {year MAKE Model trim}" / "Couverture pour la …" | Since AP-2377 this comes **before** Coverage |
| Step 3a — Coverage term | `/customer/avantage-plus/buy/coverage` | "Select base coverage for the …" / "Choisissez la durée de couverture pour la …" | One program card, a term drop-down |
| Step 3b — Surcharges | `/customer/avantage-plus/buy/coverage-2` | "Coverage for the …" | Surcharge questions (Yes/No radios). Step bar still shows step 3 |
| Step 4 — Summary | `/customer/avantage-plus/buy/summary` | "Please confirm the details below before proceeding to payment" / "Veuillez confirmer les détails ci-dessous avant de procéder au paiement" | Ends with "Continue with payment" / "Continuer au paiement" |
| FORM-L25 document | `/en/pdf-privacy`, `/fr/pdf-privacy` | — | PDF (application/pdf), opened in a new tab from the Client Info checkbox |
| Terms and conditions | `/customer-portal/avantage-plus/conditions` | — | Linked from the summary checkbox; not opened |

## Entry points

Public link, no login, no menu. A language link at the top right ("Français" / "English") — clicking it
switches the language; opening `?_locale=fr` directly in a fresh session did **not** switch it.

Step bar (since AP-2377): **1 Enter the vehicle · 2 Client Info · 3 Select Coverage · 4 Summary**
(FR: Info du véhicule · Info Client · Choisir la couverture · Sommaire).

## The flow

```
/buy --Continue--> /buy/client --Get rates now--> /buy/coverage --Continue--> /buy/coverage-2 --Continue--> /buy/summary
                                                                                                        |
                                              "I accept the terms and conditions" + "Continue with payment" (payment — not mapped)
```

"Back" on each step is a link to the previous route. The summary has an "Edit" / "Éditer" link per
section: Vehicle → `/buy`, Owner → `/buy/client`, Program → `/buy/coverage`. Values are kept in the
session: going back keeps the vehicle values, and "Éditer" on the program keeps the chosen term and
the surcharge answer.

## Forms

**Step 1 — `customer_buy_vehicle[...]`**

| Label (EN / FR) | Name | Required | Notes |
|---|---|---|---|
| VIN (Vehicle Identification Number)\* / NIV (Numéro d'identification du véhicule)\* | `vin` | yes | VIN is decoded: `5YJ3E1EA0LF734293` → "2020 TESLA Model 3 Standard Range Plus" |
| Current mileage (km)\* / Kilométrage actuel (km)\* | `mileage` | yes | |
| Email\* / Courriel\* | `email` | yes | Not in the ticket's A1 mock-up. Pre-fills the Client Info email |
| Postal code\* / Code postal\* | `postal_code` | yes | Not in A1. Pre-fills the Client Info postal code |
| Market Value / Valeur marchande | `marketValue` | no | No asterisk on Dev (A1 shows "Market Value\*") |
| Warranty Number / Numéro de garantie | `warrantyNumber` | no | Section "Current manufacturer/extended warranty" / "Garantie du manufacturier/prolongée en cours" (AP-2377) |
| Warranty end date / Date de fin de garantie | `manufacturerWarrantyEndDate` | no | gijgo date picker; typing `YYYY-MM-DD` works. Becomes the warranty **Start Date** on the summary |
| Warranty mileage limit / Limite de kilométrage de garantie | `manufacturerWarrantyEndKm` | no | Plain text box — **non-numeric input gives HTTP 500** (see Gotchas) |

Submit button label "Continue" / "Continuer" (rendered in capitals by CSS).

**Step 2 — `customer_quote_client[...]`**: `firstName`\*, `lastName`\*, `address1`\*, `address2`,
`city`\*, `province` (select: New Brunswick, Nova Scotia, Ontario, Québec; default New Brunswick),
`postalCode`\*, `phone1`\*, `phone2`, `email`\*, `isAgreePolicy`\* (FORM-L25 checkbox, unticked by
default, required). Submit "Get rates now" / "Demander un devis"; link "Back" / "Retour".
FR labels: Prénom, Nom, Addresse, # apt, Ville, Province, Code postal, Téléphone 1, Téléphone 2, Courriel.

**Step 3a — `customer_buy_coverage[programTerm]`**: one select. For the Tesla above, one card
"CVE" / "BEV" with terms 123 "24m/Unlimited mileage - 2500.00$", 124 "36m/… - 2700.00$",
125 "48m/… - 2900.00$", 126 "60m/Unlimited mileage - 3200.00$". The term label does **not** name
the program; the summary shows term 126 as program "CVE · CVE 60m/0km · BEV".

**Step 3b — `term_surcharge[{id}]`**: one Yes/No radio pair per surcharge (value 1 / 0, **No
preselected**). For term 126: `term_surcharge[50]` "Is this vehicle equipped with an Air Suspension
system?" / "Ce véhicule est-il équipé d'un système de suspension pneumatique ?", CA$1,500.00.

**Step 4**: `I accept the terms and conditions*` checkbox and "Continue with payment" (not pressed —
the payment page is not mapped; the sibling quote-request flow goes to Stripe Checkout sandbox).

## Page or modal

All full pages; no modals.

## Validation and messages

- FORM-L25 unticked → server re-renders `/buy/client` with "ERROR You must confirm to have read the
  FORM-L25" under the checkbox; every other value kept.
- The three warranty fields may be left empty; a past end date is accepted.

## Side effects — where the data lands

- Summary block "Total Summary" / "Résumé total": Warranty Price (= term price + accepted
  surcharges, e.g. 3200 + 1500 = CA$4,700.00), Subtotal, GST/TPS, PST/TVQ (Québec client), Total.
- Summary "Description of the program" / "Description du programme": Program, **Surcharge**,
  Warranty term, Covered components, Deductible, Program repair maximum, Start Date, End Date.
  A surcharge answered Yes shows as "{question} (MSRP: 1500.00)" — **no "YES"/"OUI"** (AP-2377
  A3 shows "{question} OUI"); answered No, the question is absent but the "Surcharge" label stays
  with nothing under it.
- Whether a client or quote record is saved on the server before payment was not checked
  (`cleanup` is missing).

## Gotchas

- **HTTP 500** on step 1 when "Warranty mileage limit" holds letters (e.g. `abc`) — reproduced
  2/2 on 2026-11-02 (AP2377_004).
- The header logo `/customer/uploads/273?filename=apicon-67f67ef3829ae.png` returns HTTP 500 on
  every page (broken image, one console error per page) — ignore it when reading console errors.
- Summary dates are in English ("December 18, 2027") even on the French page.
- French help text typo "prolongeée".
- Test cases that name "CVE 60m/0km" must pick the term "60m/Unlimited mileage" (id 126) on Dev.

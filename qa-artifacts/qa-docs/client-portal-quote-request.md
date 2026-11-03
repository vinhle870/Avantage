# Knowledge — Client portal quote request

**Mapped:** 2026-11-01, Client portal on Dev (v2dev), customer 1493, no login. Mapped during the
AP-1948 run (`qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md`).
Not yet checked on Staging.

## Routes

| Purpose | Route | Heading | Notes |
|---|---|---|---|
| Step 1 — Enter the vehicle | `/customer/{id}/quote-request` | "Request a quote" / "Enter the vehicle" | Header shows the customer's dealer name ("CBI et Finance Inc" for 1493) and a "Français" link (`?_locale=fr`) |
| Step 2 — Enter the ownership info | `/customer/{id}/quote-request/ownership` | "Enter the ownership info" | Back link to step 1 |
| Step 3 — Select Coverage | `/customer/{id}/quote-request/program` | "Select Coverage" — "Please choose the program" | Term cards |
| Step 4 — Client Info | `/customer/{id}/quote-request/client` | "Please fill out the information of the vehicle's owner" | |
| Step 5 — Summary | `/customer/{id}/quote-request/payment` | "Summary" — "Please confirm the details below before proceeding to payment" | Ends with "Continue with payment" |

## Entry points

A direct per-customer link; there is no login and no menu. A five-step progress bar sits at the top
(Enter the vehicle · Enter the ownership info · Select Coverage · Client Info · Summary). Each step is a
plain form POST to its own route; "Continue" moves to the next route, "Back" is a link to the previous one.

## The flow

```
/quote-request --Continue--> /ownership --Continue--> /program --Continue--> /client --Continue--> /payment
                                                                                        |
                                                                   "I accept the terms and conditions" + "Continue with payment"
```

Values entered are kept in the session: going back to `/program`, picking another term and pressing
Continue returns to `/client` with every field still filled **except** the policy checkbox, which must
be ticked again.

## Forms

**Step 1 — `customer_quote_vehicle[...]`**

| Field | Name | Type | Required | Notes |
|---|---|---|---|---|
| I'd like a warranty for a* | `manufacturerVehicle` | select (bootstrap-select with a search box) | yes | A **fixed list** of vehicles, not make / model / year inputs. Each option's `data-content` shows "{year} {MAKE} {Model}" with the trim below; the option text is only the trim (often blank). Values are vehicle ids, e.g. 81 = 2023 TESLA Model Y (no trim), 105 = 2023 TESLA Model Y Long Range |
| VIN (Vehicle Identification Number)* | `vin` | text | yes | A made-up 17-character VIN was accepted on Dev |
| Current mileage (km)* | `mileage` | text | yes | |
| Market Value* | `marketValue` | text | yes | |
| Warranty Number / Warranty end date / Warranty mileage limit | — | text | no | "Current manufacturer/extended warranty" block |

Tesla entries on Dev (2026-11-01): Model 3 — 2018, 2020 (8 entries), 2022 (2), 2024; Model Y — 2021,
2022, 2023 (2), 2024, 2025; Model S — 2015, 2016 (2), 2020, 2022, 2024; Model X — 2016, 2017, 2019 (3),
2022; "2024 TESLA X". **No 2023 Tesla Model 3.**

**Step 2 — `customer_quote_ownership[...]`**: `isOriginalOwner` radio (1/0, default Yes), `dateOwner`
(gijgo datepicker, value `YYYY-MM-DD`), `howPurchase` radio (`HOW_PURCHASE_FRANCHISED_DEALERSHIP` /
`_INDEPENDENT_DEALERSHIP` / `_PRIVATE_PARTY`), `isInspected` radio (`INSPECTED_YES` / `_NO` /
`_DONT_KNOW`), `isProvideReport` radio (1/0, default Yes).

**Step 3 — `customer_quote_coverage[programTerm]`**: one radio per program term (value = term id). The
visible cards show only the program name and the term ("CVE — 12 months - Unlimited mileage"). The real
radios sit in a hidden fieldset and carry `termmonths`, `termkm`, `termname` and a `price` attribute.

**Step 4 — `customer_quote_client[...]`**: `firstName`*, `lastName`*, `address1`*, `address2`, `city`*,
`province` (select), `postalCode`*, `phone1`*, `phone2`, `email`*, `isAgreePolicy`* (checkbox, FORM-L25
consent).

**Step 5**: `form[terms]` checkbox "I accept the terms and conditions" and the submit button
"Continue with payment".

## Page or modal

All steps are full pages; no modals. The vehicle select opens a dropdown list with its own search box.

## Where the price shows

- **Not on Select Coverage.** The term cards carry no price.
- **On the Summary page**, block "Total Summary": `Subtotal`, `GST`, `PST`, `Total`, formatted `CA$2,700.00`.
- On 2026-11-01 the Subtotal equalled the program term's admin "Suggested retail price"
  (`/admin/program-term/{id}/edit`): term 16 → 1025, term 122 → 2700. A change saved in admin
  (term 16: 1025 → 1125, then restored) shows on the next page load of the Summary.
- The hidden radio `price` attribute is a different number (625.00 for term 16, 2500.00 for term 122) and
  is never shown to the customer.

## Side effects — where the data lands

- **"Continue with payment"** (with "I accept the terms and conditions" ticked) POSTs to
  `/customer/{id}/quote-request/payment`, gets HTTP 302, and redirects to a **Stripe Checkout page in sandbox
  mode** (`checkout.stripe.com`, "Pay Garantie Avantage Plus"). It charges the Summary **Total** (taxes
  included, e.g. CA$1,178.49 for Subtotal CA$1,025.00) and asks for email, card information, cardholder
  name and country; no term name is shown. Mapped 2026-11-01 on Dev (AP-1948 re-run); nothing was entered,
  no payment made. `test-data` has no Stripe test card, so a case that must go past this page is BLOCKED.
- Whether the earlier steps, or the checkout session, save a quote or order against the customer on the
  server was not checked (`cleanup` is missing).

## Gotchas

- A test case that says "enter make, model and year" must instead pick an entry from the vehicle list,
  and the year it needs must exist in that list.
- Selecting a card: clicking the card heading checks the hidden radio (`input[type=radio]:checked`).
- To compare prices, go through Client Info to the Summary page; there is no price earlier in the flow.

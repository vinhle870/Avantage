# Centralized Test Data

> **Tier** column applies to Customer and Authorized roles only. Use `—` for Admin-side roles.
> **Member portal** = consumer-facing app. **Admin portal** = back-office management.
> Portal URLs and login credentials live in [execute.env.md](execute.env.md).

---

## QA Environment — Accounts

| Env | Portal | Role | Email | Password | Tier |
|---|---|---|---|---|---|

_No accounts recorded here. The v2staging Admin, Dealer and Client portal logins are in [execute.env.md](execute.env.md)._

---

## Test Vehicles

| Env | Vehicle ID | VIN | Vehicle | Mileage | Designation | Warranty | Details URL |
|---|---|---|---|---|---|---|---|
| Staging (v2staging) | 915 | `1FAHP35NX8W239204` | Ford Focus 2008 | 5000 km | COMMERCIAL | Manufacturer warranty | https://v2staging.garantieavantageplus.ca/vehicle/915/details |
| Dev (v2dev) | 915 | `1FAHP35NX8W239204` | Ford Focus 2008 | 5000 km | COMMERCIAL | Manufacturer warranty; one eligible program on dev ("Automation Test Program", 20m/20000km) — verified 2026-11-01, AP-2374 | https://v2dev.garantieavantageplus.ca/vehicle/915/details |

**Notes on vehicle 915:**

- Reached in the Dealer Portal as the signed-in user "Test QA staging". The Vehicle Details page carries three tabs — **Details**, **Window sticker** and **Quotes** — and two actions in the header, **Edit vehicle** and **Create quote**.
- **Create quote** on this page is the shortest route to an insurance quote for the AP-2436 test cases, which need a quote open on either the Insurance Quick Quote page or the Quote Details page before the **Send compliance documents** button can be used.
- The **Quotes** tab lists the quotes already raised against this vehicle, so an existing quote can be reused instead of creating a new one each run.
- Designation is COMMERCIAL rather than personal. If any AP-2436 behaviour turns out to depend on the vehicle's designation, note it against the test case — the story says nothing about designation, so it is not currently expected to matter.
- No claim is recorded against the vehicle; the CLAIMS panel shows only the vehicle summary and its manufacturer warranty.

### Customer portal online purchase — Dev (v2dev) facts, 2026-11-02 (AP-2377 run)

Not verified on Staging. The flow takes a VIN, not a stored vehicle record.

| Env | VIN | Decodes to | Program offered | Terms (id: label — price) | Surcharge |
|---|---|---|---|---|---|
| Dev (v2dev) | `5YJ3E1EA0LF734293` | 2020 TESLA Model 3 Standard Range Plus | CVE · BEV (one card); the summary names term 126 "CVE 60m/0km" | 123: 24m/Unlimited — 2500.00$ · 124: 36m — 2700.00$ · 125: 48m — 2900.00$ · 126: 60m/Unlimited — 3200.00$ | `term_surcharge[50]` air suspension, CA$1,500.00 (offered for term 126) |

No payment test card is known for the flow's payment step — a case that must pay stays BLOCKED.
Inboxes `client.stage.932` to `client.stage.940` were used by the AP-2377 run on 2026-11-02.
Inboxes `client.stage.942` to `client.stage.946` were used by the AP-2428 run on Dev on 2026-11-02 (quotes 6456–6460).
Inboxes `client.stage.956`, `957`, `958` and `960` were used by the AP-2494 run on Dev on 2026-11-02 (quotes 6479, 6480, 6481, 6483; 959 was used only in quote name "Zephyrine AP2494 959", quote 6482). Dev fact (AP-2494): `/gap-insurance-contracts` is empty and roadside Generate Contract returns HTTP 500 on vehicle 915, so a case needing a GAP or roadside contract cannot run on Dev. Dev other-dealer Permaplate rows on `/admin/permaplate-contracts` (dealer 1380 is listed there as "Test QA staging"): e.g. PNA-0000000016 — Ken Nguyen, Test Dealer 2, Kia Forte 2017 VIN `3KPFL4A76HE021135`.
Inboxes `client.stage.961` to `client.stage.966` were used by the AP-2496 run on Dev on 2026-11-02 (quotes 6484–6489). Dev fact (AP-2496): admin Esthetic protection contract pages show no quote id, so no other dealership's quote id is known on Dev.
Inboxes `client.stage.970` to `client.stage.984` were used by the AP-2497 run on Dev on 2026-11-02 (quotes 6490–6504, vehicles 1082–1096; plus quote 6505 / vehicle 1097 with no client). Dev fact (AP-2497): the inventory add form refuses an empty Kilometers — a vehicle with no mileage was made through `/quote/new/edit-vehicle` instead (vehicle 1097).
Inboxes `client.stage.947` to `client.stage.955` were used by the AP-2493 run on Dev on 2026-11-02 (quotes 6461–6469). Dev fact: vehicle 915 offers a single warranty term (20m/20000km), so a case needing two different terms cannot run on it. A second warranty can still be added on vehicle 915 via a Sale price: the Dev warranty modal requires a Sale price that sets the row amount, so a different Sale price on the same term distinguishes a re-added warranty row (verified 2026-11-01T20:05Z, AP-2493 re-run: Sale price 1800 → row CA$1,800.00, quote 6467).
Inboxes `client.stage.2502001` to `client.stage.2502005` were reserved by the AP-2502 run on Dev on 2026-11-03; none received mail (every send failed with HTTP 500). Quote 6567 (vehicle 915, client "Rosalie Bouchard AP2502-004", `client.stage.2502004@yopmail.com`) was created by that run and left on Dev. Dev fact (AP-2502, 2026-11-03): dealer 1380's Chubb creditor configuration baseline is account `AP0001` with `GC6201MQ:PM30`, `GC6201MQ:PM50` and `AVPG:TGGAP` selected — the run restored it exactly.
Inboxes `client.stage.2505001`, `2505002`, `2505006`, `2505007`, `2505008`, `2505009` were used by the AP-2505 run on Dev on 2026-11-03 (vehicles 1130–1135, VINs `2T1BURHE0NC505001/002/006/007/008/009`, quotes 6568–6573, each with a roadside product and no contract). Dev fact (AP-2505, 2026-11-03): a new inventory Toyota Corolla 2022 (15000 km, Cylinders 4, Engine size 1.8) gets 5 AutoShield roadside tiers and saves a roadside product even with no financing; the roadside Generate Contract page still returns HTTP 500 for new vehicles too (not only vehicle 915), so a case needing a roadside contract cannot run on Dev yet.

---

## Dynamic Test Data

Values the executing agent generates at run time rather than reading from a fixed list.
Record the value actually used in the execution log, so a result can be traced back to the
mail or record it produced.

| Data | Pattern | Rules |
|---|---|---|
| Client email (compliance-document sends) | `client.stage.NNN@yopmail.com` | `NNN` is the next unused three-digit number. Use a fresh number every run so mail from an earlier run cannot be mistaken for the current one. Read the inbox at `https://yopmail.com/en/?login=client.stage.NNN`. Yopmail needs no sign-up and no API key. The address is public, so send only test data to it. |
| Client name | Any plausible Quebec client name, e.g. `Marie Tremblay` | Accent-carrying names such as `Josée Côté-Bélanger` are used deliberately by `AP2436_008` to check the email greeting survives them. |

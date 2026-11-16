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
- Dev (v2dev), 2026-11-04 (AP-2495 run): vehicle 915 still present, on Inventory page 21 (ID-descending list, no list search box). Its details page and all three tabs answer HTTP 200. Its Edit vehicle modal pre-selects Designation "Particular" although the details page says COMMERCIAL — never save that form on 915. The Quotes tab lists ~4 pages of quotes, many created on 2026-11-04 by the Playwright regression run. Inventory IDs 1137–1142 (VINs `AP2497A…`, `AP2498A…`) were created by that regression run; AP-2495 only read 1142.
- Dev (v2dev), 2026-11-07 (AP-2477 re-test run): VIN `1FAHP35NX8W239204` is shared by several dealer-1380 vehicles on Dev (915, 863, 1067, 1146, 1147). Decoding it on the new-quote form puts hidden `id` = **863** (Ford Focus 2008, price 20000.00, 20000 km) in the form; saving still creates a new vehicle. AP-2477 left quotes **6588–6592** with vehicles **1143–1147** (6588 no name; 6589 "QA-AP2477-004-095118"; 6590 "QA-AP2477-012-095207"; 6591 "QA-AP2477-008-095303", Ford Focus; 6592 "QA-AP2477-009-095457", Ford Focus) — each quote vehicle also lists in Vehicle Inventory. Vehicle 863 was read only.

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
Inboxes `client.stage.1948101` to `client.stage.1948104` were used by the AP-1948 run on Dev on 2026-11-15 (Client portal quote requests for customer 1493, VINs `5YJ3E1EB0NF000001/2/3` and `7SAYGDEE0PF000001`; 1948103 reached an unpaid Stripe sandbox checkout). Dev fact (AP-1948, 2026-11-15): TESLA Model 3 is vehicle model #3124 Category A; term 16 suggested retail price is 1025 — both were changed and restored by that run.

Dev, 2026-11-15 (AP-1948 Run 2, read-only): inboxes `client.stage.1948105` (2022 TESLA Model 3 Long Range, entry 80, VIN `5YJ3E1EB0NF000007`), `1948106` (2023 TESLA Model Y, entry 81, VIN `7SAYGDEE0PF000007`), `1948107` (2022 TESLA Model S LONG RANGE, entry 91, VIN `5YJSA1E20NF000008`) and `1948108` (2022 TESLA Model X Plaid, entry 94, VIN `7SAXCDE50NF000008`) were used for Client portal quote requests of customer 1493, each stopped at the Summary page (no Stripe checkout). Dev fact: entry 91 links to vehicle model #3127 "Model S" and entry 94 to #4725 "Model X" (both Category B); Category B Teslas are offered term 16 and CVE B terms 129–133 (suggested retail prices 3400, 3400, 3500, 3600, 3700).
Inboxes `client.stage.2502001` to `client.stage.2502005` were reserved by the AP-2502 run on Dev on 2026-11-03; none received mail (every send failed with HTTP 500). Quote 6567 (vehicle 915, client "Rosalie Bouchard AP2502-004", `client.stage.2502004@yopmail.com`) was created by that run and left on Dev. Dev fact (AP-2502, 2026-11-03): dealer 1380's Chubb creditor configuration baseline is account `AP0001` with `GC6201MQ:PM30`, `GC6201MQ:PM50` and `AVPG:TGGAP` selected — the run restored it exactly.
Inboxes `client.stage.2505001`, `2505002`, `2505006`, `2505007`, `2505008`, `2505009` were used by the AP-2505 run on Dev on 2026-11-03 (vehicles 1130–1135, VINs `2T1BURHE0NC505001/002/006/007/008/009`, quotes 6568–6573, each with a roadside product and no contract). Dev fact (AP-2505, 2026-11-03): a new inventory Toyota Corolla 2022 (15000 km, Cylinders 4, Engine size 1.8) gets 5 AutoShield roadside tiers and saves a roadside product even with no financing; the roadside Generate Contract page still returns HTTP 500 for new vehicles too (not only vehicle 915), so a case needing a roadside contract cannot run on Dev yet.
Dev, 2026-11-07 (AP-2505 re-test): the same inboxes `client.stage.2505001`, `2505002`, `2505006`, `2505007`, `2505008`, `2505009` were used again (vehicles 1148, 1150–1154, quotes 6593, 6595–6599, each with a roadside product and no contract; GAP quote on 6593), plus a stray build `client.stage.2505undefined@yopmail.com` (vehicle 1149, VIN `2T1BURHE0NC505undefined`, quote 6594) used by no case. Dev fact (AP-2505, 2026-11-07): the inventory add form accepts a VIN already held by another inventory vehicle (no duplicate-VIN refusal), and a roadside contract cannot be made from `/quote/{id}/road-side-protection-create-contract` without typing a Stock number and an In service date — no roadside contract exists on Dev for these quotes. Dev, 2026-11-07 (AP-2505 re-run after review R3 round 2): quote **6597** (vehicle 1152, VIN `2T1BURHE0NC505007`, client `client.stage.2505007@yopmail.com`) now holds AutoShield roadside contract **2782** (RHTWQ-2782, AutoShield client id 2801, vehicle id 2792; no invoice); its client's Home phone is now `514-555-0501`. A dashed Home phone (`###-###-####`) is required on the roadside contract page. Quotes 6593, 6595, 6596, 6598, 6599 still have no contract.

Dev, 2026-11-08 (AP-2459 re-test, Dev): inboxes `client.stage.2459001`, `2459002`, `2459003` were used on vehicle 915 — quote **6689** (Perma Retest2459, Esthetic protection 10 ans + Antirouille, no contract), quote **6690** (Perma Finance2459, Esthetic protection contract **PNA-0000000021** with financing company AutoCapital Canada, invoice **945**), quote **6691** (Perma Pdf2459, no contract). Dev fact: the Permaplate contract form now refuses a blank Financing company ("This value should not be blank."), so a Permaplate contract without a financing company cannot be created on Dev. Dealer 1380 still has only "10 ans" linked (found linked, not changed).

Dev, 2026-11-08 (AP-2506 run, Dev): inboxes `client.stage.2506001`, `2506006`, `2506007`, `2506008` were used on vehicle 915 — quote **6692** ("Esthetic Owner2506-001", Esthetic protection 10 ans + Antirouille, no contract), quote **6693** ("Esthetic Owner2506-006-032125", contract **PNA-0000000022** with financing company AutoCapital Canada, invoice **946** $80), quote **6694** ("Esthetic Owner2506-007-032326", no contract), quote **6695** ("Esthetic Owner2506-008-032444", no contract). No mail was sent to them. Inboxes `2506002` – `2506005` and `2506009` were reserved but not used.

Dev, 2026-11-15 (AP-2374 redesign, Wave 1 — nothing created yet): inboxes `client.stage.2374001` (claim notify email, set through `POST /api/admin/claim` `notifyEmail`) and `client.stage.2374002` (contract client email) are **reserved for AP-2374**; a later AP-2374 re-run takes the next pair (`2374003`/`2374004`, …). Dev fact (`qa-docs/claims.md`, `qa-docs/admin-api.md`): a claim notify email can only be set through the Admin API (AP-2357/AP-2372), never on a claim form.

Dev, 2026-11-15 (AP-2374 s4 — used): inboxes `client.stage.2374001` (2 emails) and `client.stage.2374002` (3 emails) now hold mail for claim 333; the next AP-2374 re-run takes `2374003`/`2374004`. Records created: quote 6708 (Marie Tremblay AP2374, vehicle 915), contract `26df1-851` (warranty 851, invoice #955, financing company "Avantage Plus Testing"), claim **333** (Admin API, notifyEmail `client.stage.2374001@yopmail.com`, final status Authorized, no attachment).

Dev fact (AP-2441 run, 2026-11-04, Dev): dealer user `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2", dealer-user id **110**) **is linked to dealer 1510 "Vinh le 2" on Dev** with all 12 roles (Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management), Group A; it is the only user of dealer 1510 and 1510 is its only dealer. Reserved for AP-2441. The AP-2441 run unlinked and re-linked it, so its link id changed from 211 to **261** (17:09:59Z). Dev multi-dealer users (read only, first 3 pages of `/admin/dealer-users`): 130 Nick Tain `netain@gmail.com` (1363 Test Dealer 2, 1518 Permaplate test 2 — used read-only by AP2441_002/_010/_012), 128 Sébastien Bourget (1363, 1512, 1517, 1518), 126 Marie-Eve TEST PORTAL (1363, 1372, 1512, 1518), 97 Trinh Le Huu (273, 1447), 80 dealer test (1497–1502).


Dev fact (AP-2434 run, 2026-11-05, Dev): admin warranty contract **827** (contract APOP01-827, dealer 1380 "Offical VinhLe870@gmail.com", client "firstName lastName", Approved 2026-06-05) is **used by AP-2434** for admin-API warranty notes; that run left notes **64–69** on it (titles `QA-AP2434-<TC>-<HHMMSS>`; no delete endpoint). Warranty **836** (APOP01-836, dealer 1363 "Test Dealer 2") was read only as the "other warranty"; `999` is not a warranty on Dev (404).

Dev fact (AP-2435 run, 2026-11-05, Dev): warranty **836** (APOP01-836, client Ken Nguyen, Honda CR-V 2024) is the **read-only reference contract for the admin warranty-search API** — VIN `BKVG64C7AKB4145G5`, postal code `H7L 0C4`, tel home `5146906330`, tel work `124-123-1234`; the same VIN is also on APOP01-834. Warranty 827 is unsuitable for search tests: its client data are placeholders (VIN `123123123123`, postal `12345`, tel `11111`/`22222`). Searches change no data.

Dev fact (AP-2533 run, 2026-11-07, Dev): quote **6602** "QA-AP2533-004-111033" with vehicle **1157** (TESLA Model 3 2020, VIN `5YJ3E1EA0LF734293`, no client) was created by AP2533_004 and left on Dev; before it, dealer 1380 had no quote and no inventory vehicle with that VIN. A decode of that VIN now returns hidden `quote_vehicle[id]` = 1157. AP-2533's case quotes are named `QA-AP2533-<NNN>-<HHMMSS>`; only 004 saves.
---

## Dynamic Test Data

Values the executing agent generates at run time rather than reading from a fixed list.
Record the value actually used in the execution log, so a result can be traced back to the
mail or record it produced.

| Data | Pattern | Rules |
|---|---|---|
| Client email (compliance-document sends) | `client.stage.NNN@yopmail.com` | `NNN` is the next unused three-digit number. Use a fresh number every run so mail from an earlier run cannot be mistaken for the current one. Read the inbox at `https://yopmail.com/en/?login=client.stage.NNN`. Yopmail needs no sign-up and no API key. The address is public, so send only test data to it. |
| Client name | Any plausible Quebec client name, e.g. `Marie Tremblay` | Accent-carrying names such as `Josée Côté-Bélanger` are used deliberately by `AP2436_008` to check the email greeting survives them. |

Dev fact (AP-2410 bug re-test, 2026-11-08, Dev): inbox `client.stage.2410001@yopmail.com` was used on vehicle 915 (read-only `fromVehicleId` source) — quote **6696** ("Retest Chubb2410-001", financing 25,000.00$ / Residual 0 / Term 12 / 6.99 % / AutoCapital Canada, date of birth 1985-06-15; co-applicant **Coapp Retest2410**, DOB 1988-04-10, added 2026-11-08 by the AP2410_004 re-run) with a saved Chubb creditor insurance quote (last saved 2026-11-08T03:55Z: PM30, English, Tax exempt Yes, Life Decreasing Borrower, Critical illness Decreasing Co borrower, Disability 30D_RETRO Both, term 12, CA$150.92 /m); no contract. Reserved for AP-2410.

Dev, 2026-11-15 (AP-2499 s4 re-run — used): inboxes `client.stage.2499013` (quote **6710**, "Gap Gap2499-005b") and `client.stage.2499014` (quote **6711**, "Gap Gap2499-009b"), both on vehicle 915 (read only), each with a financing 25,000 / Residual 0 / 60 months / 6.99 % / Monthly / AutoCapital Canada saved with no date of birth (shown afterwards as 2026-11-15). No insurance quote, no contract, no invoice. No mail sent. The next AP-2499 re-run takes `2499015` onward.

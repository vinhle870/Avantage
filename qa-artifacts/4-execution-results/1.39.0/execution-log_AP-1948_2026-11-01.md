# Execution Log — AP-1948: CBI / CVE Tesla Price modification

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (inside `stlc-ticket-pipeline`, `--from s4 --until s4c`)
**Date:** 2026-11-01
**Environment:** Dev (v2dev)
**Base URL:** `https://v2dev.garantieavantageplus.ca/` (Client portal `/customer/1493/quote-request`, Admin portal `/admin/login`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-01T15:28Z → 2026-11-01T15:33Z (first run, all 9 cases) · 2026-11-01T15:39Z → 2026-11-01T15:45Z (re-run of AP1948_001, 003, 009 after review R3 F-1 — see *Re-run after review R3* at the end)
**Test-case files:** `qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md`
**Login:** Admin portal with the Dev Environment admin account from the `env` source (`execute.env.md` → Dev Environment). No credential is copied here.

> **Environment differs from the test-case design.** The test cases name Staging (v2staging) in
> their Execution Context and Test Data. The user decided this batch runs on Dev (v2dev), so every
> route below is the v2dev equivalent. Customer 1493 exists on Dev: its quote-request page loaded
> without an error.

| Metric | Value |
|---|:---:|
| Total test cases | 9 |
| Passed | 3 |
| Failed | 0 |
| Blocked | 6 |
| Skipped | 0 |
| **Pass rate** | **33% (3 of 9)** |

These are the counts after the re-run. The first run had 1 PASS and 8 BLOCKED. Review R3
(finding F-1) found that AP1948_001, 003 and 009 were wrongly blocked for a missing "2023 Tesla
Model 3", because the year is not a test condition, and had them re-run with "2022 TESLA Model 3 /
Long Range". AP1948_001 and AP1948_009 now PASS. AP1948_003 is still BLOCKED, now for a different
reason: pressing "Continue with payment" opens a Stripe payment page, and there is no payment test
data. Of the 6 blocked cases, 5 are designed BLOCKED by the open Blocking questions Q-001 / Q-002
(AP-1948 comment 19432, still unanswered) and 1 (AP1948_003, steps 3–4) is blocked by the payment page.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP1948_001 | Customer selects a warranty term → price shown equals that term's suggested retail price in admin | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Equals1025_pass.png` | Re-run (R3 F-1), 2022 Model 3 Long Range: Subtotal CA$1,025.00 = admin 1025 |
| AP1948_009 | Admin changes a term's suggested retail price → customer portal shows the new price for that term | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step5-AdminTerm16Restored1025_pass.png` | Re-run (R3 F-1): 1025 → 1125 showed CA$1,125.00; restored to 1025 and confirmed |
| AP1948_002 | Customer switches to another warranty term → price shown changes to the new term's suggested retail price | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermPriceEqualsAdmin_pass.png` | Both terms' Summary subtotals equal their admin suggested retail prices (1025, 2700) |
| AP1948_003 | Customer submits the quote request → no error, and any term or price shown back matches the one selected | Medium | 🚫 | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutPaymentPage_blocked.png` | Re-run (R3 F-1): steps 1–2 PASS; "Continue with payment" opens Stripe checkout — steps 3–4 BLOCKED, no payment test data |
| AP1948_004 | Tesla vehicle on the customer portal → only program terms of that model's category are offered | High | 🚫 | 0 | 0 | — | Designed BLOCKED by Q-001 (still unanswered) |
| AP1948_005 | A program term set for a different vehicle category → it is not offered for this vehicle | High | 🚫 | 0 | 0 | — | Designed BLOCKED by Q-001 (still unanswered) |
| AP1948_006 | Vehicle whose category has no program term → page shows no wrong-category term and no error | Low | 🚫 | 0 | 0 | — | Designed BLOCKED by Q-001 (still unanswered) |
| AP1948_007 | Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ | Medium | 🚫 | 0 | 0 | — | Designed BLOCKED by Q-002 (still unanswered) |
| AP1948_008 | Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ | Medium | 🚫 | 0 | 0 | — | Designed BLOCKED by Q-002 (still unanswered) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP1948_001 — Customer selects a warranty term → price shown equals that term's suggested retail price in admin — Step Results

> **First run (15:28Z–15:33Z) — superseded.** Review R3 F-1 withdrew this BLOCKED reason; the case was re-run at 15:39Z–15:45Z. The current result is in *Re-run after review R3* at the end of this log.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal link and enter the vehicle Tesla Model 3, 2023 | The quote-request page loads and a term selector is shown for the Tesla Model 3 | URL = `/customer/1493/quote-request`; heading = "Request a quote"; step 1 "Enter the vehicle". The vehicle is chosen from one list, `I'd like a warranty for a*` (`customer_quote_vehicle[manufacturerVehicle]`), whose entries read "year MAKE Model / trim". The list offers Tesla Model 3 for 2018, 2020 (8 entries), 2022 (2) and 2024 only — there is no 2023 Tesla Model 3 | 🚫 | Blocked: test data not on Dev. The design forbids substituting another vehicle; add a 2023 Tesla Model 3 on Dev or change the case's vehicle |
| 2 | Select the first warranty term and note label and price | One price shown | Not run | 🚫 | Blocked by step 1 |
| 3 `[Pre-Condition]` | Read the term's suggested retail price in admin | Value recorded | Not run | 🚫 | Blocked by step 1 |
| 4 `[Verification]` | Compare the two amounts | Equal | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step1-No2023Model3InVehicleList_blocked.png` — the open vehicle list jumps from "2022 TESLA Model 3" straight to "2022 TESLA Model Y / S / X" and "2023 Toyota Camry"; no 2023 Model 3 exists

### AP1948_009 — Admin changes a term's suggested retail price → customer portal shows the new price for that term — Step Results

> **First run (15:28Z–15:33Z) — superseded.** Review R3 F-1 withdrew this BLOCKED reason; the case was re-run at 15:39Z–15:45Z. The current result is in *Re-run after review R3* at the end of this log.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal, enter Tesla Model 3 2023, select the first term, record label and price | One price shown | Vehicle list has no 2023 Tesla Model 3 (same list as AP1948_001 step 1) | 🚫 | Blocked: test data not on Dev |
| 2 | Record the term's original suggested retail price, change it to original + 100, save | Save confirmed | Not run — no admin price was opened for editing or changed | 🚫 | Blocked by step 1; skipped on purpose so no shared price is changed without the matching portal check |
| 3 | Reload the portal and read the term's price | Price recorded | Not run | 🚫 | Blocked by step 1 |
| 4 | Restore the original suggested retail price | Original shown again | Not needed — nothing was changed | 🚫 | Nothing to restore; terms 16 and 122 were only read (1025 and 2700) |
| 5 `[Verification]` | Compare portal price with original + 100, and admin with original | Equal / restored | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step1-No2023Model3InVehicleList_blocked.png` — shared evidence: no 2023 Tesla Model 3 in the vehicle list

### AP1948_002 — Customer switches to another warranty term → price shown changes to the new term's suggested retail price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal and enter the vehicle Tesla Model Y 2023; continue to the term choice | At least two terms listed | Vehicle list entry "2023 TESLA Model Y" (option value 81, the first of two 2023 Model Y entries; trim blank) selected. Other required fields, chosen by the executor: VIN `7SAYGDEE0PF000001`, Current mileage (km) `20000`, Market Value `45000`. Step 2 "Enter the ownership info": original owner = Yes (default), date became owner = `2026-11-01`, how purchased = Franchised Dealership, inspected = Yes, can provide report = Yes (default). Step 3 "Select Coverage" (`/customer/1493/quote-request/program`) lists 6 terms: "L'Avantageuse AT — 36 months and/or 60000 km" (term id 16), "CVE — 12 / 24 / 36 / 48 / 60 months - Unlimited mileage" (ids 122–126) | ✅ | 6 terms offered, so the "only one term" fallback did not apply |
| 2 | Select the first term, note label and price; then the second term, note label and price | Each selection shows one price; record whether the page reloaded | The Select Coverage cards show **no price** — only program name and term. The price appears on step 5 "Summary" (`/quote-request/payment`) as "Subtotal", after step 4 "Client Info". First term "AT 36m/60000km": Subtotal = `CA$1,025.00` (GST CA$51.25, PST CA$102.24, Total CA$1,178.49). Back on Select Coverage, second term "CVE 12m/0km" chosen: Subtotal = `CA$2,700.00` (GST CA$135.00, PST CA$269.32, Total CA$3,104.33). Each change of term went through full page loads (Continue → Client Info → Continue → Summary) | ✅ | Q-006 observation: no live price update — the price is only shown on the Summary page after a page load. The term radio carries a hidden `price` attribute (625.00 and 2500.00) that is not shown to the customer |
| 3 `[Pre-Condition]` | In admin, open both program terms and read "Suggested retail price" | Both values recorded | Route found: `/admin/program-term/{id}/edit` (admin sidebar has no direct program-term link). Term 16 "L'Avantageuse AT 36m/60000km": Suggested retail price = `1025`; eligibility categories A, B, C ticked. Term 122 "CVE CVE A 12m/0km": Suggested retail price = `2700`; eligibility category A ticked, fuel type BEV, vehicle type Passenger | ✅ | Values only read — nothing saved |
| 4 `[Verification]` | Compare each portal price with the matching term's suggested retail price | After the second selection the price equals the second term's suggested retail price, not the first's | Second term: portal Subtotal `CA$2,700.00` = admin `2700`, and differs from the first term's `1025`. First term: portal Subtotal `CA$1,025.00` = admin `1025` | ✅ | Amounts compared by amount only. Q-005 format: "CA$" prefix, comma thousands separator, 2 decimals, labelled "Subtotal" before GST/PST; admin stores the plain number `2700` |

**Data left behind:** an unsubmitted quote request for customer 1493 (vehicle 2023 Tesla Model Y, VIN `7SAYGDEE0PF000001`, client Marie Tremblay, email `client.stage.916@yopmail.com`) held in the browser session; "Continue with payment" was not pressed. Not known whether the vehicle/ownership steps already saved anything server-side — `cleanup` is `missing`.

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step2-CoverageNoPriceShown_pass.png` — Select Coverage page with six term cards and no price on any card
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step2-SummaryFirstTermSubtotal_pass.png` — Summary for AT 36m/60000km showing Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step2-SummarySecondTermSubtotal_pass.png` — Summary for CVE 12m/0km showing Subtotal CA$2,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step3-AdminTerm122SuggestedRetail2700_pass.png` — admin term 122 edit form, Suggested retail price 2700
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step3-AdminTerm16SuggestedRetail1025_pass.png` — admin term 16 edit form, Suggested retail price 1025
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermPriceEqualsAdmin_pass.png` — final state: Summary after the second term, Subtotal CA$2,700.00

### AP1948_003 — Customer submits the quote request → no error, and any term or price shown back matches the one selected — Step Results

> **First run (15:28Z–15:33Z) — superseded.** Review R3 F-1 withdrew this BLOCKED reason; the case was re-run at 15:39Z–15:45Z. The current result is in *Re-run after review R3* at the end of this log.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal and enter Tesla Model 3 2023 | Term selector lists at least one term | Vehicle list has no 2023 Tesla Model 3 (same list as AP1948_001 step 1) | 🚫 | Blocked: test data not on Dev |
| 2 | Select the first term and fill the required fields | Fields recorded | Not run | 🚫 | Blocked by step 1 |
| 3 | Click the submit button | No error page | Not run — nothing submitted. Observed in AP1948_002: the last page's button is "Continue with payment" with an "I accept the terms and conditions" checkbox | 🚫 | Blocked by step 1; the design should say whether submitting means going on to payment |
| 4 `[Verification]` | Check every place the request is shown back | Fail only on a mismatch | Not run | 🚫 | Blocked by step 1. Q-006 observation from AP1948_002: the Summary page shows the program, term and Subtotal of the selected term before payment |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step1-No2023Model3InVehicleList_blocked.png` — shared evidence: no 2023 Tesla Model 3 in the vehicle list

### AP1948_004 — Tesla vehicle on the customer portal → only program terms of that model's category are offered — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | All steps | Not known — Q-001 | Not run — designed BLOCKED | 🚫 | Blocked by Q-001 (Blocking, AP-1948 comment 19432, unanswered). Observed only as a fact for the answer: a program term's categories are set on `/admin/program-term/{id}/edit` as checkboxes Category A–E |

### AP1948_005 — A program term set for a different vehicle category → it is not offered for this vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | All steps | Not known — Q-001 | Not run — designed BLOCKED | 🚫 | Blocked by Q-001 (still unanswered) |

### AP1948_006 — Vehicle whose category has no program term → page shows no wrong-category term and no error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | All steps | Not known — Q-001 | Not run — designed BLOCKED | 🚫 | Blocked by Q-001 (still unanswered) |

### AP1948_007 — Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | All steps | Not known — Q-002 | Not run — designed BLOCKED | 🚫 | Blocked by Q-002 (Blocking, AP-1948 comment 19432, unanswered) |

### AP1948_008 — Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | All steps | Not known — Q-002 | Not run — designed BLOCKED | 🚫 | Blocked by Q-002 (still unanswered) |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP1948_003 | 🚫 | Re-run: steps 3–4 blocked — "submission requires payment — no payment test data in `test-data`". Pressing "Continue with payment" opens a Stripe sandbox checkout asking for card details; nothing was entered. Fix: add Stripe test-card data to `test-data`, or redefine the case's submit boundary as the Summary page (R3 F-3). (First run: blocked for the missing 2023 Model 3 — withdrawn by R3 F-1) |
| AP1948_004 | 🚫 | Q-001 unanswered (vehicle categories A/B/C) |
| AP1948_005 | 🚫 | Q-001 unanswered |
| AP1948_006 | 🚫 | Q-001 unanswered |
| AP1948_007 | 🚫 | Q-002 unanswered (do the original-ask Tesla prices still apply) |
| AP1948_008 | 🚫 | Q-002 unanswered |

---

## Environment Observations

- **Environment: Dev (v2dev)**, chosen by the user for this batch; the test cases still name Staging. Customer 1493 exists on Dev and its quote-request page loaded without an error.
- **The Client portal does not match the design's vehicle-entry assumption in two ways.** The vehicle is picked from a fixed list of "year MAKE Model / trim" entries (not typed make, model, year), and the same page requires a VIN, current mileage and market value. AP1948_002 ran because its vehicle (2023 Tesla Model Y) is in the list; the executor-chosen VIN, mileage and market value are recorded above.
- **The price is not shown where the cases expect it.** The Select Coverage cards carry no price; the price first appears on the Summary page as "Subtotal" before taxes, after the Client Info step. AP1948_001–003 and 009 should say "read the Subtotal on the Summary page".
- **The term radio's hidden `price` attribute is not the suggested retail price** (625.00 vs 1025 for term 16; 2500.00 vs 2700 for term 122). The customer never sees it; recorded for whoever answers Q-002 (2500 is the first "Original ask" figure).
- Admin program-term route: `/admin/program-term/{id}/edit`, field "Suggested retail price" (`program_term[suggestedRetailPrice]`), eligibility categories A–E as checkboxes. No sidebar link goes straight to it.
- Data created: test inbox `client.stage.916@yopmail.com` used in the Client Info step; quote not submitted (see AP1948_002).
- `env-check` and `cleanup` sources are `missing`; the environment health check was run by the orchestrator before this worker and passed.

---

## Re-run after review R3 — AP1948_001, AP1948_009, AP1948_003

**Why:** review R3 (`qa-artifacts/7-reviews/AP-1948_review.md`, finding F-1, Major) found that these three cases were wrongly BLOCKED. The year 2023 appears nowhere in the ticket or the analysis, test plan §8.1 says only make and model matter, and none of their expected results depends on the vehicle year. Only these three cases were re-run; AP1948_002 and AP1948_004–008 keep their first-run results above.
**Executed by:** QA Agent — Manual Executor Skill (inside `stlc-ticket-pipeline`, `--from s4 --until s4c`)
**When:** 2026-11-01T15:39Z → 2026-11-01T15:45Z (real clock, `date -u`)
**Environment:** Dev (v2dev), by the user's decision — `https://v2dev.garantieavantageplus.ca/`. The environment check passed: customer 1493's quote-request page loaded without an error, and the admin login succeeded. v2staging was not opened.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800. **Login:** Admin portal with the Dev Environment admin account from the `env` source (`execute.env.md` → Dev Environment), typed only into the login form. No credential is copied here.

**Vehicle substitution (all three cases).** The test cases name "Tesla Model 3, 2023". Model 3 2023 is not on Dev's vehicle list — the year is not a test condition (test plan §8.1, review R3 F-1). The re-run used the list entry **"2022 TESLA Model 3 / Long Range"** (option value 80 of `customer_quote_vehicle[manufacturerVehicle]`). It offered six terms, so the 2024 fallback was not needed. For reference, the Model 3 entries on the Dev list are: 2018 Long Range (93); 2020 ×8 (69, 70, 74, 77, 85 Plus, 102 Standard Range Plus, 65 TEST, 66 TEST); 2022 Long Range (80); 2022 Standard Range Plus (87); 2024 TEST (5).

**Executor-chosen values (review R3 F-2), the same in every re-run case:**

| Page | Field label | Value |
|---|---|---|
| Enter the vehicle | I'd like a warranty for a* | 2022 TESLA Model 3 / Long Range (id 80) |
| Enter the vehicle | VIN (Vehicle Identification Number)* | `5YJ3E1EB0NF000001` (made up, 17 characters) |
| Enter the vehicle | Current mileage (km)* | `20000` |
| Enter the vehicle | Market Value* | `45000` |
| Enter the ownership info | Original owner / date became owner / how purchased / inspected / can provide report | Yes / `2026-11-01` / Franchised Dealership / Yes / Yes |
| Client Info | First name / Last name | `Marie` / `Tremblay` |
| Client Info | Address 1 / Address 2 | `123 Rue Test` / (blank) |
| Client Info | City / Province / Postal code | `Montreal` / `Québec` / `H2X 1Y4` |
| Client Info | Phone 1 / Phone 2 | `5145550100` / (blank) |
| Client Info | Email | AP1948_001 and AP1948_009: `client.stage.917@yopmail.com` · AP1948_003: `client.stage.918@yopmail.com` |
| Client Info | Policy consent checkbox (`isAgreePolicy`) | ticked |

**Addendum for AP1948_002 (review R3 F-2).** The first run's Client Info values that were not logged above are visible in that case's step 4 screenshot: Address "123 Rue Test", City "Montreal", Province "Québec", Postal code "H2X 1Y4", Phone 1 "5145550100". Name and email were already logged (Marie Tremblay, `client.stage.916@yopmail.com`). The result does not change.

### AP1948_001 (re-run) — Customer selects a warranty term → price shown equals that term's suggested retail price in admin — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal and pick the vehicle; continue to the term choice | The quote-request page loads without an error and at least one term is listed | Substitution: Model 3 2023 not on Dev — year is not a test condition (test plan §8.1, review R3 F-1); used "2022 TESLA Model 3 / Long Range". `/customer/1493/quote-request` loaded with heading "Request a quote". After the vehicle and ownership steps, `/quote-request/program` "Select Coverage" listed 6 terms: "L'Avantageuse AT — 36 months and/or 60000 km" (term id 16) and "CVE — 12 / 24 / 36 / 48 / 60 months - Unlimited mileage" (ids 122–126) | ✅ | Same six terms that AP1948_002 saw for the 2023 Model Y |
| 2 | Select the first term and record its label and price | One price is shown for the selected term | The first card, "L'Avantageuse AT — 36 months and/or 60000 km", was clicked (radio value 16 checked). The card shows no price. On the Summary page (`/quote-request/payment`), after Client Info, the page showed Program "AT 36m/60000km", Warranty term "36 months and/or 60000 km", **Subtotal `CA$1,025.00`**, GST CA$51.25, PST CA$102.24, Total CA$1,178.49 | ✅ | Price read from the Summary "Subtotal", as R3 F-1 instructs |
| 3 `[Pre-Condition]` | In admin, open the same program term and read "Suggested retail price" | The field has a value | `/admin/program-term/16/edit`, heading "L'Avantageuse AT 36m/60000km": **Suggested retail price = `1025`**. Eligibility categories A, B, C ticked; fuel types GASOLINE and DIESEL; vehicle type PASSENGER | ✅ | Read only, nothing saved in this case |
| 4 `[Verification]` | Compare the Client portal amount with the admin value | The two amounts are equal | Portal Subtotal `CA$1,025.00` equals admin `1025` by amount | ✅ | Q-005 format: "CA$" prefix, comma thousands separator, two decimals, before GST/PST; admin stores the plain number. Recorded, not judged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step2-SummaryModel3Term16Subtotal_pass.png` — Summary page for the 2022 Tesla Model 3 Long Range with the AT 36m/60000km term, Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Equals1025_pass.png` — admin term 16 edit form with Suggested retail price 1025 (the red outline was added by the executor to point at the field)

### AP1948_009 (re-run) — Admin changes a term's suggested retail price → customer portal shows the new price for that term — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal, pick the vehicle, select the first term, record its label and price | One price is shown for the term | Substitution: Model 3 2023 not on Dev — year is not a test condition (test plan §8.1, review R3 F-1); used "2022 TESLA Model 3 / Long Range". First term "L'Avantageuse AT — 36 months and/or 60000 km" (id 16) selected; Summary showed Program "AT 36m/60000km", **Subtotal `CA$1,025.00`** | ✅ | Same session and vehicle as AP1948_001 |
| 2 | In admin, record the term's current "Suggested retail price" as the original, change it to original + 100, save | The save is confirmed and the field shows original + 100 | `/admin/program-term/16/edit`: **original = `1025`** (recorded before any change). The field was set to `1125` and "Save" pressed; the page went to `/admin/program-terms` with the message "Program terms saved". Re-opened, the field showed `1125`. A field-by-field comparison of the form before and after the save showed that only `suggestedRetailPrice` changed | ✅ | Change saved about 15:42Z. No other field or term was touched |
| 3 | Reload the Client portal, pick the same vehicle and term; record the price | One price is shown | The quote request was reloaded from step 1 with the same vehicle (id 80) and the same term (radio 16). Summary showed Program "AT 36m/60000km", **Subtotal `CA$1,125.00`**, GST CA$56.25, PST CA$112.22, Total CA$1,293.47 | ✅ | The new admin price reached the customer on the next page load |
| 4 | Set "Suggested retail price" back to the original value and save | The save is confirmed and the field shows the original | Field changed from `1125` to `1025` and "Save" pressed; "Program terms saved". Re-opened, the field showed **`1025`**, and the whole form was identical to the copy taken before step 2 | ✅ | Restored at about 15:43Z. The price was changed for about one minute |
| 5 `[Verification]` | Compare the step 3 price with original + 100, and the admin field with the original | Portal price = original + 100; admin shows the original again | Step 3 Subtotal `CA$1,125.00` = 1025 + 100, not the original 1025. Admin field shows `1025` again. After the restore, AP1948_003 went through the same vehicle and term and its Summary showed Subtotal `CA$1,025.00` again, so the portal is back to the original price too | ✅ | Nothing is left changed on Dev |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step3-SummarySubtotal1125AfterChange_pass.png` — Summary page after the admin change, Subtotal CA$1,125.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step5-AdminTerm16Restored1025_pass.png` — admin term 16 after the restore, Suggested retail price 1025 (the red outline was added by the executor)

### AP1948_003 (re-run) — Customer submits the quote request → no error, and any term or price shown back matches the one selected — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the Client portal and pick the vehicle; continue to the term choice | At least one term is listed | Substitution: Model 3 2023 not on Dev — year is not a test condition (test plan §8.1, review R3 F-1); used "2022 TESLA Model 3 / Long Range". "Select Coverage" listed 6 terms (ids 16, 122–126) | ✅ | The vehicle was picked again from the list, not reused from AP1948_009 |
| 2 | Select the first term and fill the required fields | The selected term and its price stay shown; every field is recorded | First term "L'Avantageuse AT — 36 months and/or 60000 km" (id 16) selected. Client Info filled with the values in the table above, email `client.stage.918@yopmail.com`. The Summary page shows back: Model "2022 TESLA Model 3 Long Range", Name "Marie Tremblay", Address "123 Rue Test Montreal, Québec H2X 1Y4", Phone 1 "5145550100", Email "client.stage.918@yopmail.com", Program "AT 36m/60000km", Warranty term "36 months and/or 60000 km", Start Date "Tuesday, December 1, 2026", End Date "Saturday, December 1, 2029", Subtotal `CA$1,025.00`, Total `CA$1,178.49` | ✅ | Term and price match the selection (admin term 16 = 1025) |
| 3 | Tick the terms checkbox and press the submit button (record its label) | No error page or HTTP 5xx; record the confirmation | "I accept the terms and conditions" (`form[terms]`) was ticked and **"Continue with payment"** pressed. The POST to `/quote-request/payment` returned HTTP 302 and redirected to a **Stripe Checkout page in sandbox mode** (`checkout.stripe.com`, "Pay Garantie Avantage Plus"). It asks for an email, card information, cardholder name and country. No error page and no HTTP 5xx | 🚫 | Blocked: submission requires payment — no payment test data in `test-data`. Nothing was entered on the payment page |
| 4 `[Verification]` | Check every place the submitted request is shown back | Fail only if a term or price shown back differs from the one selected | Not run past the payment page. Q-006 observation only: the Stripe page shows the amount **CA$1,178.49**, which equals the Summary "Total" (Subtotal CA$1,025.00 + GST + PST) for the selected term; it shows no term name. A currency chooser also offered ₫22,627,955 (VND) | 🚫 | Blocked by step 3. Q-005: Stripe shows "CA$1,178.49" in the same format as the Summary |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step2-SummaryBeforeSubmit_pass.png` — Summary page before submission, with the client info, program, term and Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutPaymentPage_blocked.png` — the Stripe sandbox checkout that "Continue with payment" opens, with empty card fields

### Re-run — data left behind on Dev (v2dev)

- **Program term 16 ("L'Avantageuse AT 36m/60000km") — restored.** Its Suggested retail price was 1025, was set to 1125 at about 15:42Z, and was set back to 1025 at about 15:43Z. After the restore the whole edit form matched the copy taken before the change, and the Client portal showed CA$1,025.00 again. No other price or term was changed.
- **Quote request, customer 1493, `client.stage.917@yopmail.com`** (AP1948_001 and AP1948_009): vehicle 2022 TESLA Model 3 Long Range (id 80), VIN `5YJ3E1EB0NF000001`, client Marie Tremblay, term 16. It reached the Summary page; "Continue with payment" was not pressed for it. Held in the browser session; whether the earlier steps saved anything on the server is not known (`cleanup` is `missing`).
- **Quote request, customer 1493, `client.stage.918@yopmail.com`** (AP1948_003): same vehicle, VIN, client and term. "Continue with payment" **was** pressed, so the server accepted the Summary form (HTTP 302) and created a Stripe sandbox checkout session for CA$1,178.49. No payment was made. Whether this left a pending quote or order on customer 1493 is not known (`cleanup` is `missing`).
- Every browser tab opened for the re-run (Client portal / Stripe and admin) was closed at the end.

### Re-run — environment observations

- The re-run matched the first run's map of the Client portal (`qa-docs/client-portal-quote-request.md`). One new fact: "Continue with payment" leads to a Stripe Checkout page in sandbox mode, for the Summary Total including taxes.
- Saving a program term in admin redirects to `/admin/program-terms` with the message "Program terms saved". The new price reached the Client portal Summary on the next page load, with no delay.
- Observation for whoever answers Q-001 (not judged): term 16 has fuel types GASOLINE and DIESEL only, not BEV, yet it is offered for the 2022 Tesla Model 3 Long Range.

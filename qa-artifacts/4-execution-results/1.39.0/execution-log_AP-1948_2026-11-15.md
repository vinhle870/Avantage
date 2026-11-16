# Execution Log — AP-1948: CBI / CVE Tesla Price modification

---

## Execution Summary

> **Current totals after Run 2 (09:54–09:59Z):** 8 PASS · 0 FAIL · 1 BLOCKED of 9 (89%) — see the section *Run 2 — 2026-11-15 09:54 UTC* at the end. The morning section below is kept as it was run.

**Executed by:** QA Agent — Manual Executor Skill (inside `stlc-ticket-pipeline`, `--from execute --until correct-cases`, qa-agent batch 2026-11-15)
**Date:** 2026-11-15
**Environment:** Dev (v2dev)
**Base URL:** `https://v2dev.garantieavantageplus.ca/` (Client portal `/customer/1493/quote-request`, Admin portal `/admin/login`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-15T08:46Z → 2026-11-15T08:54Z
**Test-case files:** `qa-artifacts/3-test-cases/AP1948_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md`
**Run order:** AP1948_001, 002, 003, 004, then 009, 005, 006 one at a time (Execution Context); 007 and 008 designed BLOCKED.
**Login:** Admin portal with the Dev Environment admin account from the `env` source (Dev Environment section). No credential is copied here.
**Gate B:** rule B3, decided by the reviewer (R2 round 2) — the current cases were executed; nothing promoted.

| Metric | Value |
|---|:---:|
| Total test cases | 9 |
| Passed | 6 |
| Failed | 0 |
| Blocked | 3 |
| Skipped | 0 |
| **Pass rate** | **67% (6 of 9)** |

Six cases passed: the two price cases and the price-change case (001, 002, 009) and all three
category-filter cases (004, 005, 006), which could run for the first time now that Q-001 is
answered and the admin screen holding a vehicle model's category was found
(`/admin/vehicle-model`). Three cases are blocked and none of them points at a product fault:
AP1948_003 stops at the Stripe sandbox payment page because no test card exists in the test data,
and AP1948_007 and AP1948_008 are blocked by the unanswered Blocking question Q-002.

**Shared configuration changed and restored in this run** (each restore confirmed in the same case):
term 16 "Suggested retail price" 1025 → 1125 → 1025 (AP1948_009); TESLA Model 3 (vehicle model
#3124) category A → D → A (AP1948_005) and A → E → A (AP1948_006). At the end of the run term 16
reads 1025 and the Model 3 reads Category A, and the portal offers terms 16 and 122–126 for the
Model 3 again — the same as at the start.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP1948_001 | Selected term → price equals admin suggested retail price | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Srp1025Nov15_pass.png` | Subtotal CA$1,025.00 = term 16 price 1025 |
| AP1948_002 | Switch term → price follows the new term | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermSubtotal2700_pass.png` | Model Y: 1025 then 2700, both equal admin prices |
| AP1948_003 | Submit quote request → no error, values shown back match | Medium | 🚫 | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutNov15_blocked.png` | Stripe sandbox card page; no test card in test data |
| AP1948_004 | Model 3 → every offered term ticks the model's category | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step5-Term16TicksCategoryA_pass.png` | X = Category A; all 6 offered terms tick A |
| AP1948_005 | Term excluding the model's category is not offered | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step5-CategoryDTerm16NotListed_pass.png` | Path B: Model 3 → D hid term 16; restored to A |
| AP1948_006 | Model 3 in a category with no term → no wrong term, no error | Low | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step3-CategoryEEmptyCoverage_pass.png` | Category E: empty list, no 5xx; restored to A |
| AP1948_007 | Model 3 / Model Y → original-ask figure + 200$ | Medium | 🚫 | 0 | 0 | — | Q-002 (Blocking) unanswered |
| AP1948_008 | Model S / Model X → original-ask figure + 800$ | Medium | 🚫 | 0 | 0 | — | Q-002 (Blocking) unanswered |
| AP1948_009 | Admin changes term price → portal shows the new price | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step3-PortalSubtotal1125_pass.png` | 1025 → 1125 shown on portal; restored 1025 |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP1948_001 — Customer selects a warranty term → price shown equals that term's suggested retail price in admin — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the portal link, pick "2022 TESLA Model 3 / Long Range" (id 80), VIN `5YJ3E1EB0NF000001`, 20000 km, 45000 → Continue; ownership → Continue | "Select Coverage" opens and lists ≥ 1 term | Page 1 HTTP 200; vehicle select shows "2022 TESLA Model 3 Long Range"; URL = `/program`, heading "Select Coverage"; 6 cards: 16 "L’Avantageuse AT 36 months and/or 60000 km", 122–126 "CVE 12/24/36/48/60 months - Unlimited mileage" | ✅ | CVE cards are still offered on Dev although comment 19544 says the program was disabled (recorded for fact F-1, not a failure) |
| 2 | Click the first card (record name, term, id) → Continue; Client Info (`client.stage.1948101@yopmail.com`) → Continue; record Subtotal | Summary shows the term and one Subtotal | First card id = 16; Summary URL `/payment` HTTP 200; Program = "AT 36m/60000km"; Subtotal = CA$1,025.00; GST CA$51.25; PST CA$102.24; Total CA$1,178.49 | ✅ | Client Info: Marie / Tremblay, 123 Rue Test, Montreal, Québec, H2X 1Y4, 5145550100, consent ticked |
| 3 `[Pre-Condition]` | New tab: admin login, open `/admin/program-term/16/edit` | "Suggested retail price" has a value | Heading "L’Avantageuse AT 36m/60000km"; field "Suggested retail price*" value = "1025" | ✅ | Admin login page in French as documented |
| 4 `[Verification]` | Compare Subtotal with suggested retail price | Amounts equal; record display format for Q-005 | Subtotal amount 1,025.00 = suggested retail price 1025 | ✅ | Q-005 format: portal shows "CA$1,025.00" (currency prefix, thousands comma, 2 decimals); admin stores "1025" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step2-SummarySubtotal1025_pass.png` — Summary page with program AT 36m/60000km and Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Srp1025Nov15_pass.png` — admin term 16 edit page, heading and Suggested retail price 1025 in view

### AP1948_002 — Customer switches to another warranty term → price shown changes to the new term's suggested retail price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Portal link, pick "2023 TESLA Model Y" (id 81), VIN `7SAYGDEE0PF000001`, 20000, 45000 → Continue; ownership → Continue | ≥ 2 term cards; record ids and CVE state | 6 cards: 16, 122, 123, 124, 125, 126; CVE cards (122–126) listed | ✅ | Second active term present, so the F-1 fallback (BLOCKED "second active term") was not needed |
| 2 | First term → Client Info (`client.stage.1948102@yopmail.com`) → Summary; Back to Select Coverage, pick second term → Continue → re-tick consent → Continue | One Subtotal per pass; record both | Pass 1: term 16, Program "AT 36m/60000km", Subtotal CA$1,025.00. Back on `/program` term 16 still checked; picked 122. Client Info kept every value (email still client.stage.1948102) except consent (unchecked). Pass 2: Program "CVE 12m/0km", Subtotal CA$2,700.00 | ✅ | Q-006: each change is a full page POST and reload — no in-place price refresh |
| 3 `[Pre-Condition]` | Admin: open term 16 and term 122 edit pages | Both values recorded | Term 16 "Suggested retail price" = 1025; term 122 ("CVE CVE A 12m/0km") = 2700 | ✅ | Read at 08:47Z |
| 4 `[Verification]` | Compare each Subtotal with its term's price | Second Subtotal equals term 122's price, not term 16's | Pass 1 1,025.00 = 1025; pass 2 2,700.00 = 2700 (≠ 1025) | ✅ | Price follows the newly selected term |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step2-FirstTermSubtotal1025_pass.png` — Summary for term 16, Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermSubtotal2700_pass.png` — Summary for term 122, Subtotal CA$2,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-AdminTerm122Equals2700_pass.png` — admin term 122 edit page, Suggested retail price 2700

### AP1948_003 — Customer submits the quote request → no error, and any term or price shown back matches the one selected — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Portal link, entry 80, VIN `5YJ3E1EB0NF000001` → Continue; ownership → Continue | ≥ 1 term card | Cards 16, 122, 123, 124, 125, 126 | ✅ | — |
| 2 | Select first term (16) → Continue; Client Info (`client.stage.1948103@yopmail.com`) → Continue | Summary shows the term and Subtotal; fields recorded | Summary: Model "2022 TESLA Model 3 Long Range", Mileage 20000 km, Market Value CA$45,000.00, VIN 5YJ3E1EB0NF000001; Name Marie Tremblay, Address 123 Rue Test Montreal, Québec H2X 1Y4, Phone 1 5145550100, Phone 2 "-", Email client.stage.1948103@yopmail.com; Program AT 36m/60000km; Subtotal CA$1,025.00, GST CA$51.25, PST CA$102.24, Total CA$1,178.49 | ✅ | Start Date Tuesday, December 15, 2026 / End Date Saturday, December 15, 2029 shown |
| 3 | Tick "I accept the terms and conditions", click "Continue with payment" | No error page / 5xx; record page reached | Redirect to `https://checkout.stripe.com/c/pay/cs_test_…` HTTP 200, page "Sandbox — Pay Garantie Avantage Plus", amount CA$1,178.49, line "Marie Tremblay TESLA", card fields empty. No error page | 🚫 | BLOCKED: card details required and `test-data` / `env` hold no Stripe test card (Known blocker 1). Nothing entered |
| 4 `[Verification]` | Check every place the request is shown back | Fail only if a shown term/price differs | Not reached past the card page. Observation for Q-006: the Stripe page shows the amount CA$1,178.49 (= the Summary Total, taxes included) and "TESLA"; the term is not shown | 🚫 | Blocked with step 3. Price shown back = Summary Total, consistent with the selection (amount only) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutNov15_blocked.png` — Stripe sandbox checkout asking for card details, amount CA$1,178.49

### AP1948_004 — Tesla Model 3 on the customer portal → every term offered includes the model's configured category — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin: find the TESLA "Model 3" category field, record route, X and allowed values | One value; X and allowed values recorded | Route: sidebar "Vehicle Models" `/admin/vehicle-model` → filter Make = TESLA → edit `/admin/vehicle-model-edit/3124/edit` ("Vehicle model #3124"). Field "category" (`vehicle_model[category]`) = "Category A" → **X = A**. Allowed: Category A, B, C, D, E. Other TESLA models: Model Y #3126 A, Model S #3127 B, Model X #4725 B, X #4724 B | ✅ | Navigation gap closed; nothing changed. List entry 80 = `/admin/manufacturer-vehicle/80/edit` TESLA / Model 3 / Long Range / 2022, fuel BEV |
| 2 `[Pre-Condition]` | Portal link, entry 80, VIN `5YJ3E1EB0NF000001` → Continue; ownership → Continue | "Select Coverage" opens without error | `/program` HTTP 200, heading "Select Coverage", cards listed | ✅ | — |
| 3 | Record every card and id; note CVE | Every term recorded; CVE state recorded | 16 "L’Avantageuse AT 36 months and/or 60000 km"; 122–126 "CVE 12/24/36/48/60 months - Unlimited mileage". CVE cards listed | ✅ | Fact F-1: CVE terms still offered on Dev on 2026-11-15 |
| 4 | For each id open `/admin/program-term/{id}/edit`, record categories, fuel, vehicle type, years, km | Settings recorded; change nothing | 16: A,B,C · GASOLINE,DIESEL · Passenger · 11 y · 180000 km. 122, 123, 125, 126: A · BEV · Passenger · 10 y · 200000 km. 124: A · GASOLINE,BEV,DIESEL,HYBRID · Passenger · 10 y · 200000 km | ✅ | Values file `AP1948_004-step4-values.txt` |
| 5 `[Verification]` | Check each offered term against X | Every offered term ticks Category A | 6 of 6 offered terms have "Category A" ticked (16: A,B,C; 122–126: A) | ✅ | Q-010 (record only): term 16 does not tick BEV but is offered for this BEV vehicle — fuel type does not filter the list. Not judged. Terms 14, 15, 17, 18 (same AT program, tick A) are not offered — recorded, not judged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step1-Model3CategoryA_pass.png` — Vehicle model #3124 Model 3, category "Category A"
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step3-Model3OfferedTerms_pass.png` — Select Coverage for the Model 3, six cards
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step5-Term16TicksCategoryA_pass.png` — term 16 eligibility: Category A, B, C ticked; fuel GASOLINE, DIESEL
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step5-Term122TicksCategoryA_pass.png` — term 122 eligibility: Category A ticked
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step4-values.txt` — every offered term's settings

### AP1948_009 — Admin changes a term's suggested retail price → customer portal shows the new price for that term — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Portal, entry 80, VIN `5YJ3E1EB0NF000001`, first term, Client Info (`client.stage.1948104@yopmail.com`); record Subtotal | One Subtotal for the term | First card = term 16; Summary Program "AT 36m/60000km", Subtotal CA$1,025.00 | ✅ | — |
| 2 | Admin: open term 16, record original, set original + 100, Save; re-open | "Program terms saved"; field = original + 100 | Original = 1025. Save → `/admin/program-terms` HTTP 200 "Program terms saved". Re-opened field = 1125 | ✅ | Full form recorded before the change (values file) |
| 3 | Reload the portal, same entry and term; record Subtotal | One Subtotal recorded | Program "AT 36m/60000km", Subtotal CA$1,125.00 | ✅ | Client Info kept from the session |
| 4 | Admin: set back to original, Save; re-open | "Program terms saved"; field = original | Save → `/admin/program-terms` HTTP 200 "Program terms saved". Re-opened field = 1025; whole form identical to before the change | ✅ | Restore confirmed at about 08:51Z |
| 5 `[Verification]` | Compare step 3 Subtotal with original + 100; admin field with original | Portal 1125 (not 1025); admin back to 1025 | Step 3 Subtotal 1,125.00 = 1025 + 100; admin field 1025 | ✅ | Price is read from the program term, not fixed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step2-AdminTerm16Changed1125_pass.png` — term 16 edit page after save, heading and 1125 in view
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step3-PortalSubtotal1125_pass.png` — portal Summary, Subtotal CA$1,125.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step4-ProgramTermsSavedRestore_pass.png` — "Program terms saved" after the restore
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step5-AdminTerm16RestoredNov15_pass.png` — term 16 re-opened, heading and 1025 in view
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step5-values.txt` — before / changed / restored values

### AP1948_005 — A term whose categories exclude the Tesla Model 3's category → it is not offered for that vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Portal, entry 80, VIN `5YJ3E1EB0NF000002` → Continue; ownership → Continue; record cards | ≥ 1 non-CVE term | Cards 16, 122, 123, 124, 125, 126; non-CVE term 16 present | ✅ | — |
| 2 `[Pre-Condition]` | Admin: record Model 3 category (original X) and allowed values; each offered term's settings; choose path | X = AP1948_004's X; path and T/S/Y recorded | X = Category A (= AP1948_004). Offered terms as in AP1948_004. `/admin/program-terms` (16 pages) checked: the only offered non-CVE program, L’Avantageuse AT, has terms 14, 15, 16, 17, 18 and all tick A, so no path-A term T exists (AT-Plus terms that exclude A belong to a program not offered; CVE B terms 129–133 are CVE). **Path B**: T = 16 (A,B,C), Y = Category D | ✅ | Term 16's restored price 1025 checked before start (AP1948_009) |
| 3 | Path B: set Model 3 category to D, Save, re-open; repeat the portal walk | Save confirmed, field = D; page opens without error | Save → `/admin/vehicle-model` HTTP 200 "Vehicle model saved"; re-opened category = CATEGORY_D. Portal `/program` HTTP 200: heading "Select Coverage — Please choose the program", **no term card**, no message, Back and Continue shown | ✅ | Empty list recorded for Q-004 |
| 4 | Path B: set back to A, Save, re-open; repeat portal walk | Field = A; term T listed again | Save → "Vehicle model saved"; re-opened category = CATEGORY_A, whole form identical to original. Portal lists 16, 122, 123, 124, 125, 126 again | ✅ | Restore confirmed at about 08:53Z |
| 5 `[Verification]` | Look for T in the step 3 list; each listed term ticks Y | T not listed; every listed term ticks D; restore confirmed | Term 16 not listed under Category D (no term listed at all, so none ticks a wrong category). Admin shows A again and term 16 is offered again | ✅ | Nothing left changed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step3-Model3CategorySetD_pass.png` — Vehicle model #3124 Model 3 with Category D after save
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step5-CategoryDTerm16NotListed_pass.png` — Select Coverage with no term card while the Model 3 is Category D
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step4-Model3CategoryRestoredA_pass.png` — Model 3 re-opened showing Category A
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step4-AfterRestoreTerm16OfferedAgain_pass.png` — Select Coverage after the restore, six cards
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step4-values.txt` — original / changed / restored category

### AP1948_006 — Tesla Model 3 moved to a category no offered term covers → no wrong-category term and no error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Portal, entry 80, VIN `5YJ3E1EB0NF000003` → Continue; ownership → Continue; record cards | Page opens; terms recorded | `/program` HTTP 200; cards 16, 122, 123, 124, 125, 126 | ✅ | — |
| 2 `[Pre-Condition]` | Admin: record X, allowed values, each term's categories; choose Y none ticks | X = AP1948_004's X; Y recorded | X = CATEGORY_A (= AP1948_004). Term categories: 16 A,B,C; 122–126 A. Allowed A–E. **Y = Category E** (D was used by AP1948_005) | ✅ | — |
| 3 | Set Model 3 to E, Save, re-open; portal walk; record display and Continue | Save confirmed, field = E; display recorded | Save → "Vehicle model saved"; re-opened category = CATEGORY_E. Portal `/program` HTTP 200: "Select Coverage — Please choose the program", no term card, no message. Continue is enabled; pressing it returns `/program` with HTTP 422 and "ERROR This value is not valid." shown twice | ✅ | Q-004 (record only): empty list without explanation; Continue gives a generic validation error. 422 is a form validation response, not a 5xx or error page. No new term id appeared |
| 4 | Set back to A, Save, re-open; portal walk | Field = A; same terms as step 1 | Save → "Vehicle model saved"; re-opened category = CATEGORY_A, form identical to original. Portal lists 16, 122, 123, 124, 125, 126 (08:54:39Z) | ✅ | Restore confirmed |
| 5 `[Verification]` | Check step 3 for objective faults and the restore | No 5xx; every listed term ticks E; X restored, step 1 terms offered again | No error page or 5xx; 0 terms listed, so no wrong-category term; empty state reached. Category A restored and step-1 terms offered again | ✅ | Nothing left changed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step3-Model3CategorySetE_pass.png` — Model 3 re-opened showing Category E
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step3-CategoryEEmptyCoverage_pass.png` — Select Coverage with no card (Category E)
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step3-ContinueWithNoTerm_pass.png` — "This value is not valid." after Continue with no term
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step4-Model3CategoryRestoredA_pass.png` — Model 3 re-opened showing Category A
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step5-RestoredStep1TermsOffered_pass.png` — Select Coverage after the restore, six cards
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step4-values.txt` — original / changed / restored category and the 422 line

### AP1948_007 — Tesla Model 3 or Model Y → each term's price is the original-ask figure plus 200$ — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | Not run | Not known — Q-002 | Designed BLOCKED; Q-002 still unanswered (asked in 19432, re-asked 19457, 19524) | 🚫 | Observation for Known blocker 2: CVE terms 122–126 are still offered on Dev for the Model 3 and Model Y today |

### AP1948_008 — Tesla Model S or Model X → each term's price is the original-ask figure plus 800$ — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–4 | Not run | Not known — Q-002 | Designed BLOCKED; Q-002 still unanswered | 🚫 | Model S and Model X are Category B on Dev (models #3127, #4725) — recorded for when Q-002 is answered |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP1948_003 | 🚫 | Steps 3–4: "Continue with payment" opens a Stripe sandbox card page and neither `test-data` nor `env` holds a Stripe test card. Add one to `test-data` to unblock |
| AP1948_007 | 🚫 | Q-002 (Blocking) unanswered: whether the original-ask figures still apply, which term each belongs to, whether +200$ is added on top |
| AP1948_008 | 🚫 | Q-002 (Blocking) unanswered: same question for the +800$ Model S / Model X surcharge |

---

## Environment Observations

- **Environment:** Dev (v2dev), the registry's `execution_env`. Every page used answered without a server error.
- **CVE program (fact F-1):** comment 19544 says the CVE program was disabled, but on 2026-11-15 the Client portal still offers CVE terms 122–126 for the 2022 Model 3 Long Range and the 2023 Model Y. This is not a failure. Nothing re-enabled or changed the program.
- **Vehicle model category (Q-001):** mapped this run — sidebar "Vehicle Models" `/admin/vehicle-model` (list columns Make ID, Make Name, Model ID, Model Name, Category, Actions; 225 pages; filter by Make), edit `/admin/vehicle-model-edit/{id}/edit` with fields Name, Make, Category (Category A–E), Type, Save → `/admin/vehicle-model` "Vehicle model saved". Written back to `qa-docs/admin-portal.md` (Dev, 2026-11-15).
- **Q-010 observation:** term 16 ticks only GASOLINE and DIESEL fuel types, yet it is offered for a BEV Tesla; fuel type is not filtering the list on Dev. Recorded, not judged.
- **Q-004 observation:** when the vehicle's category has no term, "Select Coverage" shows an empty list with no message, and Continue answers "This value is not valid." (HTTP 422).
- **Test data left on Dev:** Client portal quote-request sessions for customer 1493 with `client.stage.1948101`, `1948102`, `1948103`, `1948104@yopmail.com` (VINs `5YJ3E1EB0NF000001/2/3`, `7SAYGDEE0PF000001`). `client.stage.1948103` reached Stripe sandbox checkout session `cs_test_a0BcdhHdakTYfNMGqRIJRtkGiMYIwioQjd3H613XjWJvpEhq…`, unpaid. Whether the portal saves anything server-side before payment is not known (`cleanup` is missing). No configuration left changed: term 16 = 1025, TESLA Model 3 #3124 = Category A.
- **Evidence naming:** three of this run's captures share a step with a 2026-11-01 capture; they carry `Nov15` in the name (`AP1948_001-step4-AdminTerm16Srp1025Nov15_pass.png`, `AP1948_003-step3-StripeCheckoutNov15_blocked.png`, `AP1948_009-step5-AdminTerm16RestoredNov15_pass.png`) so the 2026-11-01 files stay intact.
- **AP-2503:** no dealer-portal quote or contract was touched.

---

# Run 2 — 2026-11-15 09:54 UTC (AP1948_007, AP1948_008)

## Execution Summary — Run 2

**Executed by:** QA Agent — Manual Executor Skill (inside `stlc-ticket-pipeline`, `--from execute --until correct-cases`, qa-agent batch 2026-11-15, stlc-worker)
**Date:** 2026-11-15
**Environment:** Dev (v2dev)
**Base URL:** `https://v2dev.garantieavantageplus.ca/` (Client portal `/customer/1493/quote-request`, Admin portal `/admin/login`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-15T09:54Z → 2026-11-15T09:59Z
**Test-case file:** `qa-artifacts/3-test-cases/AP1948_TestCases_006-009.md` (AP1948_007, AP1948_008 as redesigned 09:22Z)
**Scope:** AP1948_007 and AP1948_008 only, both read-only. The morning results of AP1948_001, 002, 004, 005, 006 and 009 stand; AP1948_003 stays BLOCKED on the Stripe test card.
**Login:** Admin portal with the Dev Environment admin account from the `env` source (Dev Environment section). No credential is copied here.
**Gate B:** rule B3, decided by the reviewer (R2 round 3) — execute the current cases; nothing promoted; unpromoted Pass 2 #1–#10.

**Totals over all nine cases (morning results + Run 2):**

| Metric | Value |
|---|:---:|
| Total test cases | 9 |
| Passed | 8 (001, 002, 004, 005, 006, 007, 008, 009) |
| Failed | 0 |
| Blocked | 1 (003) |
| Skipped | 0 |
| **Pass rate** | **89% (8 of 9)** |

Both Tesla price cases passed. For each of the four Tesla models, every term the Client portal
offered reached the Summary page with a Subtotal exactly equal to that term's admin "Suggested
retail price" — nothing was added (no +200$ for Model 3 / Y, no +800$ for Model S / X). In all, 24
term-and-model Subtotals were compared and none differed. Every offered term ticks its model's
category. One thing differed from the design's expectation and is not a fault: the Model S and
Model X (Category B) are offered six terms, not only term 16 — term 16 plus a separate set of CVE
"Category B" terms, ids 129–133, which tick only Category B. No configuration was changed in this run.

## Result Overview — Run 2

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP1948_007 | Model 3 / Model Y → every offered term's price = its suggested retail price | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step5-Run2AdminTerm125Srp2900CategoryA_pass.png` | 12 of 12 Subtotals = SRP (terms 16, 122–126), all tick A |
| AP1948_008 | Model S / Model X → every offered term's price = its suggested retail price | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step5-Run2AdminTerm129Srp3400CategoryB_pass.png` | 12 of 12 Subtotals = SRP (terms 16, 129–133), all tick B |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

## Step-by-Step Results — Run 2

### AP1948_007 — Tesla Model 3 or Model Y → every offered term's price equals its suggested retail price, nothing added — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin login; read the category of Model 3 (#3124) and Model Y (#3126); read terms 16 and 122–126 (price, categories). Change nothing | Model 3 = AP1948_004's X; everything recorded | `/admin/vehicle-model-edit/3124/edit` category = "Category A" (= AP1948_004's X = A); #3126 Model Y = "Category A". Term 16 "L’Avantageuse AT 36m/60000km" price 1025, ticks Category A, B, C; 122 "CVE A 12m/0km" 2700 · 123 "CVE A 24m/0km" 2500 · 124 "CVE A 36m/0km" 2700 · 125 "CVE A 48m/0km" 2900 · 126 "CVE A 60m/0km" 3200 — each ticks only Category A | ✅ | Read only; every admin page answered HTTP 200. The morning restores still hold: term 16 = 1025, Model 3 = A |
| 2 `[Pre-Condition]` | Portal: entry "2022 TESLA Model 3 / Long Range" (80), VIN `5YJ3E1EB0NF000007`, 20000, 45000 → Continue; ownership → Continue; record cards | "Select Coverage" opens without error; ≥ 1 term | Vehicle page, `/ownership` and `/program` each HTTP 200; heading "Select Coverage"; six cards: 16 "L’Avantageuse AT — 36 months and/or 60000 km", 122–126 "CVE — 12/24/36/48/60 months - Unlimited mileage" | ✅ | Ownership: original owner Yes, date 2026-11-15, Franchised Dealership, inspected Yes, report Yes. CVE cards still offered (fact F-1, not judged) |
| 3 | For each card: select → Continue → Client Info (first pass, `client.stage.1948105@yopmail.com`) → Continue; record Summary Subtotal; back to "Select Coverage" | One Subtotal per term | `/client` and `/payment` answered HTTP 200 on every pass; the checked radio always matched the card picked. Subtotals: 16 CA$1,025.00 · 122 CA$2,700.00 · 123 CA$2,500.00 · 124 CA$2,700.00 · 125 CA$2,900.00 · 126 CA$3,200.00 | ✅ | Client Info: Marie / Tremblay, 123 Rue Test, Montreal, Québec, H2X 1Y4, 5145550100; kept on later passes except consent, which was re-ticked. "Back" was done by re-opening `/program` in the same session, which keeps the entered values |
| 4 | Repeat 2–3 with "2023 TESLA Model Y" (81), VIN `7SAYGDEE0PF000007`, `client.stage.1948106@yopmail.com` | As steps 2–3 | Same six cards (16, 122–126). Summary Model "2023 TESLA Model Y"; Subtotals: 16 CA$1,025.00 · 122 CA$2,700.00 · 123 CA$2,500.00 · 124 CA$2,700.00 · 125 CA$2,900.00 · 126 CA$3,200.00; every page HTTP 200 | ✅ | — |
| 5 `[Verification]` | Compare every Subtotal with its term's suggested retail price; check each listed term ticks the model's category | Every Subtotal = SRP, nothing added; every term ticks A | 12 of 12 Subtotals equal their term's price (1025, 2700, 2500, 2700, 2900, 3200), difference 0 — no +200$ and no original-ask figure. All six offered terms tick Category A, the category of both models | ✅ | Record-and-accept (Q-002 Accepted). No term id appeared that step 1 had not read. The values file lists every pair |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step2-Run2Model3OfferedTerms_pass.png` — Select Coverage for the Model 3, six cards
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step3-Run2Model3Term16Subtotal1025_pass.png` — Model 3 Summary, AT 36m/60000km, Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step3-Run2Model3Term122Subtotal2700_pass.png` — Model 3 Summary, CVE 12m/0km, Subtotal CA$2,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step3-Run2Model3Term123Subtotal2500_pass.png` — Model 3 Summary, CVE 24m/0km, Subtotal CA$2,500.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step3-Run2Model3Term124Subtotal2700_pass.png` — Model 3 Summary, CVE 36m/0km, Subtotal CA$2,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step3-Run2Model3Term125Subtotal2900_pass.png` — Model 3 Summary, CVE 48m/0km, Subtotal CA$2,900.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step3-Run2Model3Term126Subtotal3200_pass.png` — Model 3 Summary, CVE 60m/0km, Subtotal CA$3,200.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYOfferedTerms_pass.png` — Select Coverage for the Model Y, six cards
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYTerm16Subtotal1025_pass.png` — Model Y Summary, Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYTerm122Subtotal2700_pass.png` — Model Y Summary, Subtotal CA$2,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYTerm123Subtotal2500_pass.png` — Model Y Summary, Subtotal CA$2,500.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYTerm124Subtotal2700_pass.png` — Model Y Summary, Subtotal CA$2,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYTerm125Subtotal2900_pass.png` — Model Y Summary, Subtotal CA$2,900.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step4-Run2ModelYTerm126Subtotal3200_pass.png` — Model Y Summary, Subtotal CA$3,200.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step5-Run2AdminTerm125Srp2900CategoryA_pass.png` — admin term 125 "CVE A 48m/0km", Suggested retail price 2900, Category A ticked
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step5-Run2-values.txt` — every admin price and category and every Summary Subtotal compared

### AP1948_008 — Tesla Model S or Model X → every offered term's price equals its suggested retail price, nothing added — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin: read the category of Model S (#3127), Model X (#4725), X (#4724); read term 16. Change nothing | Recorded (B, B, B; term 16 A, B, C) | #3127 Model S = "Category B"; #4725 Model X = "Category B"; #4724 X = "Category B". Term 16 price 1025, ticks Category A, B, C | ✅ | Read only |
| 2 `[Pre-Condition]` | Portal: a "2022 TESLA Model S" entry, VIN `5YJSA1E20NF000008`, 20000, 45000 → Continue; ownership → Continue; record cards | Opens without error; ≥ 1 term | Entry picked: **91** "2022 TESLA Model S LONG RANGE". `/program` HTTP 200; six cards: 16 "L’Avantageuse AT — 36 months and/or 60000 km" and **129–133** "CVE — 12/24/36/48/60 months - Unlimited mileage". CVE cards 122–126 are not listed | ✅ | Terms 122–126 tick only Category A, so their absence follows the category rule. Ids 129–133 are a separate CVE set (step 5) |
| 3 | For each card: select → Continue → Client Info (first pass, `client.stage.1948107@yopmail.com`) → Continue; record Subtotal | One Subtotal per term | `/client` and `/payment` answered HTTP 200 on every pass; Summary Model "2022 TESLA Model S LONG RANGE". Subtotals: 16 CA$1,025.00 · 129 CA$3,400.00 · 130 CA$3,400.00 · 131 CA$3,500.00 · 132 CA$3,600.00 · 133 CA$3,700.00 | ✅ | Program on the Summary: AT 36m/60000km, then CVE 12m/0km … CVE 60m/0km |
| 4 | Repeat 2–3 with a "2022 TESLA Model X" entry, VIN `7SAXCDE50NF000008`, `client.stage.1948108@yopmail.com` | As steps 2–3 | Entry picked: **94** "2022 TESLA Model X Plaid", which links to vehicle model **#4725 "Model X"** (`/admin/manufacturer-vehicle/94/edit`, model = 4725). Same six cards (16, 129–133). Subtotals: 16 CA$1,025.00 · 129 CA$3,400.00 · 130 CA$3,400.00 · 131 CA$3,500.00 · 132 CA$3,600.00 · 133 CA$3,700.00; every page HTTP 200 | ✅ | R2 minor F-5: the picked Model X entry links to #4725, not #4724 ("X") |
| 5 `[Verification]` | Read the terms other than 16; compare every Subtotal with its term's price; check each term ticks the model's category | Every Subtotal = SRP, nothing added; every term ticks B | Admin: 129 "CVE B 12m/0km" 3400 · 130 "CVE B 24m/0km" 3400 · 131 "CVE B 36m/0km" 3500 · 132 "CVE B 48m/0km" 3600 · 133 "CVE B 60m/0km" 3700 — each ticks only Category B. 12 of 12 Subtotals equal their term's price, difference 0 — no +800$ and no original-ask figure. All six offered terms tick Category B (16 ticks A, B, C) | ✅ | Record-and-accept (Q-002 Accepted). The design expected "probably only term 16"; the CVE B terms 129–133 are offered and correctly filtered by category — recorded, not a fault |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step2-Run2ModelSOfferedTerms_pass.png` — Select Coverage for the Model S, six cards (16, 129–133)
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step3-Run2ModelSTerm16Subtotal1025_pass.png` — Model S Summary, Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step3-Run2ModelSTerm129Subtotal3400_pass.png` — Model S Summary, CVE 12m/0km, Subtotal CA$3,400.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step3-Run2ModelSTerm130Subtotal3400_pass.png` — Model S Summary, CVE 24m/0km, Subtotal CA$3,400.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step3-Run2ModelSTerm131Subtotal3500_pass.png` — Model S Summary, CVE 36m/0km, Subtotal CA$3,500.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step3-Run2ModelSTerm132Subtotal3600_pass.png` — Model S Summary, CVE 48m/0km, Subtotal CA$3,600.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step3-Run2ModelSTerm133Subtotal3700_pass.png` — Model S Summary, CVE 60m/0km, Subtotal CA$3,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXOfferedTerms_pass.png` — Select Coverage for the Model X Plaid, six cards
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXTerm16Subtotal1025_pass.png` — Model X Summary, Subtotal CA$1,025.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXTerm129Subtotal3400_pass.png` — Model X Summary, Subtotal CA$3,400.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXTerm130Subtotal3400_pass.png` — Model X Summary, Subtotal CA$3,400.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXTerm131Subtotal3500_pass.png` — Model X Summary, Subtotal CA$3,500.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXTerm132Subtotal3600_pass.png` — Model X Summary, Subtotal CA$3,600.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step4-Run2ModelXTerm133Subtotal3700_pass.png` — Model X Summary, Subtotal CA$3,700.00
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step5-Run2AdminTerm129Srp3400CategoryB_pass.png` — admin term 129 "CVE B 12m/0km", Suggested retail price 3400, Category B ticked
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step5-Run2Entry94LinksModelX4725_pass.png` — admin list entry 94 (2022 TESLA Model X Plaid) linked to vehicle model "Model X" (#4725)
- `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step5-Run2-values.txt` — every admin price and category, the entry links and every Summary Subtotal compared

## Blocked / Skipped Test Cases — after Run 2

| TC ID | Status | Reason |
|---|:---:|---|
| AP1948_003 | 🚫 | Unchanged from the morning (not re-run): "Continue with payment" opens a Stripe sandbox card page and neither `test-data` nor `env` holds a Stripe test card. Add one to `test-data` to unblock |

## Environment Observations — Run 2

- **Environment:** Dev (v2dev). Every page used answered HTTP 200; no error page.
- **CVE Category B terms:** Dev has a second CVE set, terms 129–133 ("CVE B 12/24/36/48/60m/0km", prices 3400, 3400, 3500, 3600, 3700), ticking only Category B. They are offered to the Model S and Model X; terms 122–126 ("CVE A") are offered only to the Category A Model 3 / Model Y. CVE terms are still offered on Dev although comment 19544 says the program is disabled (fact F-1, not judged).
- **Hidden radio `price` attribute (observation, not judged):** on "Select Coverage" each hidden term radio carries a `price` attribute that is not the suggested retail price (term 16 = 625.00, 122 = 2500.00, 125 = 2800.00, 129 = 0.00, 130 = 3400.00). The customer never sees it; the Summary Subtotal is the price shown and it equals the suggested retail price. Recorded in the domain notes only.
- **Vehicle entries (R2 F-5):** Model S entry 91 links to vehicle model #3127 "Model S"; Model X entry 94 "2022 TESLA Model X Plaid" links to #4725 "Model X" (#4724 "X" was not used).
- **Test data left on Dev:** Client portal quote-request sessions for customer 1493 with `client.stage.1948105` (Model 3, VIN `5YJ3E1EB0NF000007`), `1948106` (Model Y, `7SAYGDEE0PF000007`), `1948107` (Model S, `5YJSA1E20NF000008`) and `1948108@yopmail.com` (Model X, `7SAXCDE50NF000008`). None went past the Summary page (no Stripe checkout). Whether the portal saves anything before payment is not known (`cleanup` is missing).
- **Configuration:** nothing changed in Run 2 — every admin page was only read. Term 16 = 1025 and Model 3 #3124 = Category A, as the morning run left them.
- **Evidence naming:** every Run 2 file carries `Run2` in its name, so no morning file was overwritten.
- **AP-2503:** no dealer-portal quote (6703–6707) or contract was touched.

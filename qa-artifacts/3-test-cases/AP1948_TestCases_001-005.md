# Test Cases — AP1948 (File 1 of 2)

**Project:** Avantage Plus v2 — Client portal
**Requirement:** AP1948 — CBI / CVE Tesla Price modification (Jira AP-1948)
**Source:** requirements/AP-1948-cbi-cve-tesla-price-modification.md · qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md (2026-11-15) · qa-artifacts/2-test-plan/AP-1948_test-plan.md (version 2.0, 2026-11-15)
**Date:** 2026-11-01 (redesigned 2026-11-15)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP1948_001 to AP1948_005 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · Regression
**Revision 2026-11-01:** AP1948_003 reworked per review R2 (independent) F-1/F-2. It now fails only on an error page or HTTP 5xx, or on a term or price shown back that differs from the one selected; whether they are shown back at all is record-only for Q-006. Form data uses the `test-data` dynamic patterns. Vehicle-entry fallback added to the Execution Context (F-4).
**Revision 2026-11-15:** Re-design after Q-001 was answered (Ken Nguyen, comment 19545) and the reporter disabled the CVE program (fact F-1, comment 19544). AP1948_004 and AP1948_005 redesigned: the expected term list follows the category configured on the test vehicle's model; neither depends on a CVE term. AP1948_001–003 keep their test logic; only their environment (Dev), vehicle wording (a list entry, not typed make / model / year — review R3 F-3) and price location (Summary "Subtotal") were reworded, and AP1948_002's fallback names F-1. Their Status and Result rows are the 2026-11-01 results; all five cases run again at the next execution on Dev.
**Revision 2026-11-15 (review R2 round 1, F-1/F-2):** AP1948_005 path A accepts only a term whose program already has an offered sibling term with the same fuel type, vehicle type, years and km. Execution Context gains the run order and the restore stop rule; AP1948_005 step 2 checks the Model 3 category against AP1948_004's X.
**Revision 2026-11-15 (review R3 round 1, F-2):** Execution Context — the vehicle model's category screen is now mapped (`/admin/vehicle-model`, edit `/admin/vehicle-model-edit/{id}/edit`); the navigation-gap note is closed. Test logic unchanged.
**Revision 2026-11-15 (Q-002 Accepted; carried-forward R2 minor):** Known blocker 2 closed (Q-002 Accepted — AP1948_007/008 in file 2 redesigned and Not Run); run order adds 007 and 008 to the read-only group; coverage matrix updated. AP1948_005 step 5 now states the path-A sibling check its Revisions row 2 describes. No other case changed; the 2026-11-15 results of 001–006 stand.

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client portal (no login) for the terms and price shown to the customer; Admin portal to read program-term settings and a vehicle model's category, and — in AP1948_005 path B only — to change and restore that category | `navigation` §1 |
| **Entry route** | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` — customer 1493's quote request. Five pages in order: "Enter the vehicle" → `/ownership` "Enter the ownership info" → `/program` "Select Coverage" (term cards, **no price**) → `/client` "Client Info" → `/payment` "Summary" (block "Total Summary": **Subtotal**, GST, PST, Total). Each page moves on with "Continue" | `domain` (`qa-docs/client-portal-quote-request.md`, mapped on Dev 2026-11-01) |
| **Reading the offered terms** | On "Select Coverage" each card shows only the program name and the term. The term id of each card is the value of its hidden radio `customer_quote_coverage[programTerm]`; the admin page for that term is `/admin/program-term/{id}/edit` | `domain` |
| **Reading a term's settings** | `/admin/program-term/{id}/edit`: "Suggested retail price" (`program_term[suggestedRetailPrice]`), eligibility checkboxes "Category A"–"Category E" (`eligibilityCategory[]`), fuel type (GASOLINE, BEV, DIESEL, HYBRID), vehicle type, eligibility years and km. "Save" goes to `/admin/program-terms` with "Program terms saved" | `domain` (`qa-docs/admin-portal.md`, Dev 2026-11-01) |
| **Vehicle model "category"** | Each vehicle model has a field "category" set in the admin (Ken Nguyen, comment 19545). Mapped on Dev 2026-11-15: sidebar "Vehicle Models" `/admin/vehicle-model` (filter Make = TESLA) → edit `/admin/vehicle-model-edit/{id}/edit`, field "category" (`vehicle_model[category]`, values Category A–E); Save returns to `/admin/vehicle-model` with "Vehicle model saved". TESLA Model 3 = vehicle model #3124 | Analysis Q-001; `domain` (`qa-docs/admin-portal.md`, Dev 2026-11-15) |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/` (registry `execution_env: Dev`) | `env` (Dev Environment section) |
| **Login** | Client portal: none. Admin portal: `https://v2dev.garantieavantageplus.ca/admin/login` with the Dev admin account from `env` (Dev Environment section). The admin login page renders in French ("Courriel", "Mot de passe", "Se connecter") | `env`, `navigation` §1 |
| **Test data** | Customer 1493 (exists on Dev). Vehicle list entries used: "2022 TESLA Model 3 / Long Range" (id 80) and "2023 TESLA Model Y" (id 81, blank trim), both offered terms 16 and 122–126 on 2026-11-01. Term 16 "L'Avantageuse AT 36m/60000km" is non-CVE (Suggested retail price 1025, categories A, B, C). Terms 122–126 are the CVE program and may be gone (fact F-1). Client Info values: first name `Marie`, last name `Tremblay`, a fresh `client.stage.NNN@yopmail.com` (next unused `NNN`); Address `123 Rue Test`, City `Montreal`, Province `Québec`, Postal code `H2X 1Y4`, Phone 1 `5145550100` | `env`, `test-data` (`test-centralized.md` → Dynamic Test Data), 2026-11-01 execution log |
| **Language** | EN as the page renders by default. The admin login page is always French | `navigation` |
| **Leaves behind** | Each case that walks the quote request leaves its vehicle and form values in the browser session; AP1948_003 leaves an unpaid Stripe sandbox checkout for its `client.stage.NNN@yopmail.com` address. Whether anything is saved server-side is not known — `cleanup` is `missing`. AP1948_005 path B changes the Tesla Model 3's category and **must restore it** before it ends; no case leaves configuration changed | `cleanup` (missing) |

**Standing facts only.** The vehicle and form values each case enters are dynamic and are written into that case's `[Pre-Condition]` step.

**CVE program (fact F-1).** The reporter disabled the CVE program in early November 2026. Record at the start of execution whether "Select Coverage" still lists CVE cards (term ids 122–126). Missing CVE terms are **not a FAIL**. No case re-enables the CVE program.

**Navigation gap — closed 2026-11-15:** the vehicle model's "category" field was found and mapped during the 2026-11-15 execution (`/admin/vehicle-model`, edit `/admin/vehicle-model-edit/{id}/edit`; see the row above and `qa-docs/admin-portal.md`). If the route no longer opens, every step that needs it is BLOCKED "test data not on Dev: model category field not found", not FAIL.

**Run order and restore stop rule (both files).** Run AP1948_001, 002, 003 and 004, and AP1948_007 and 008 (file 2), first (they change no configuration). Then run AP1948_009 (file 2), AP1948_005 and AP1948_006 (file 2), one at a time, in that order. Before AP1948_005 and AP1948_006 start, the Tesla Model 3's category must equal the **X recorded by AP1948_004**, and term 16's "Suggested retail price" must equal the value AP1948_009 restored. If a restore (009's term price, or 005's or 006's model category) cannot be confirmed, **stop all further cases** and report which value was left changed and its current value.

**Vehicle entry.** The vehicle is picked from the fixed list "I'd like a warranty for a*" (entries read "{year} {MAKE} {Model}" with the trim below). The year is not a test condition: if an entry named in a case is missing, pick another entry of the same make and model and record it. If the page takes the vehicle another way (a VIN look-up, a pre-loaded vehicle), mark that step and the rest of the case BLOCKED "vehicle entry differs from design".

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A Stripe sandbox test card in `test-data`, to pass the payment page | AP1948_003 steps 3–4 | Open — not in `test-data` (BLOCKED at execution on 2026-11-01) |
| — | Closed 2026-11-15: whether the "Original ask" Tesla figures still apply | AP1948_007, AP1948_008 (file 2) | Accepted — Q-002, knowledge lookup 2026-11-15: price = the term's suggested retail price, nothing added |
| — | Closed 2026-11-15: which models are in which category, and where a model's category is set | AP1948_004, AP1948_005 (and AP1948_006 in file 2) | Answered — Q-001, comment 19545 (Ken Nguyen): test per the category configured on the model |

> Every test case blocked at design time ships with **Status: BLOCKED** and a **Blocked by**
> value — not `Not Run`. AP1948_003's block is found at execution (payment page), so its
> earlier steps still run.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP1948_001 | Customer selects a warranty term → price shown equals that term's suggested retail price in admin | Functional | High | PASS |
| AP1948_002 | Customer switches to another warranty term → price shown changes to the new term's suggested retail price | Edge-case | Medium | PASS |
| AP1948_003 | Customer submits the quote request → no error, and any term or price shown back matches the one selected | Regression | Medium | BLOCKED |
| AP1948_004 | Tesla Model 3 on the customer portal → every term offered includes the model's configured category | Functional | High | PASS |
| AP1948_005 | A term whose categories exclude the Tesla Model 3's category → it is not offered for that vehicle | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`. Values are the 2026-11-15 results on Dev (`execution-log_AP-1948_2026-11-15.md`).

---

## Test Cases

---

### AP1948_001 — Customer selects a warranty term → price shown equals that term's suggested retail price in admin

| Field | Value |
|---|---|
| **TC ID** | AP1948_001 |
| **Title** | Customer selects a warranty term → price shown equals that term's suggested retail price in admin |
| **Requirement** | AP1948 — REQ-002: "The price should be the pricing set in the program term > **suggested retail price**" |
| **Route** | `/customer/1493/quote-request` → Summary `/customer/1493/quote-request/payment` — Client portal quote request |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | ✅ PASS — Summary Subtotal CA$1,025.00 equals admin term 16 suggested retail price 1025 |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Environment Staging → Dev; vehicle "Make Tesla, Model Model 3, Year 2023" → list entry "2022 TESLA Model 3 / Long Range"; price read on the Summary "Subtotal". Test logic and expected result unchanged | Review R3 F-3 (2026-11-01); registry `execution_env: Dev` | Reviewer R3 round 1 finding |

**Why this matters:** this is the price the end customer sees. If it does not come from the term's configured suggested retail price, the customer is quoted a figure the business never set. The display format (currency sign, decimals, taxes) is not stated in the ticket (Q-005), so only the amount is compared; the format is recorded. This is a REQ-002 price case; it uses the first term offered (term 16, non-CVE, on 2026-11-01), so the CVE shutdown does not affect it.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2022 TESLA Model 3 / Long Range" (id 80); VIN `5YJ3E1EB0NF000001`, Current mileage (km) `20000`, Market Value `45000` |
| Ownership | Original owner Yes, date became owner = today, how purchased "Franchised Dealership", inspected Yes, can provide report Yes |
| Client Info | `Marie` / `Tremblay`, fresh `client.stage.NNN@yopmail.com`, `123 Rue Test`, `Montreal`, `Québec`, `H2X 1Y4`, `5145550100`, consent ticked |
| Admin login | Dev admin account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link; in "I'd like a warranty for a*" pick "2022 TESLA Model 3 / Long Range", type the VIN, mileage and market value from Test Data → **Continue**; fill the ownership page from Test Data → **Continue** | "Select Coverage" opens without an error page and lists at least one term card |
| 2 | Click the first term card and record its program name, term and term id (hidden radio value); **Continue**, fill Client Info from Test Data → **Continue**; on "Summary" record the "Subtotal" exactly as displayed | The Summary page shows the selected program and term and one Subtotal amount; the term, its id and the Subtotal are recorded |
| 3 | [Pre-Condition] In a new tab, log in at `/admin/login` with the Dev admin account and open `/admin/program-term/{term id from step 2}/edit` | The program-term edit page shows the term's "Suggested retail price" with a value; record that value |
| 4 | [Verification] Compare the Subtotal amount from step 2 with the "Suggested retail price" from step 3 | The two amounts are equal. Record the Client portal's display format for Q-005 without judging it |

---

### AP1948_002 — Customer switches to another warranty term → price shown changes to the new term's suggested retail price

| Field | Value |
|---|---|
| **TC ID** | AP1948_002 |
| **Title** | Customer switches to another warranty term → price shown changes to the new term's suggested retail price |
| **Requirement** | AP1948 — REQ-002: "The price should be the pricing set in the program term > **suggested retail price**" |
| **Route** | `/customer/1493/quote-request` → Summary `/customer/1493/quote-request/payment` — Client portal quote request |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | ✅ PASS — Model Y: Subtotals CA$1,025.00 (term 16) / CA$2,700.00 (term 122) equal admin prices 1025 / 2700 |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Environment → Dev; vehicle → list entry "2023 TESLA Model Y" (id 81); price read on the Summary "Subtotal". Step 1 fallback: only one active term offered → BLOCKED "test data not on Dev: second active term" (the CVE program may be disabled — not a FAIL) | Fact F-1 (comment 19544): the second term used on 2026-11-01 was CVE term 122; review R3 F-3 | Eric Lindquist, comment 19544 |

**Why this matters:** a price that stays on the first term after the customer picks another would quote the wrong amount. Whether the price refreshes without a page reload is not stated (Q-006), so only the final price is judged; how it refreshes is recorded. On 2026-11-01 the second term was CVE term 122; with the CVE program disabled, any second active term serves.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2023 TESLA Model Y" (id 81, blank trim); VIN `7SAYGDEE0PF000001`, Current mileage (km) `20000`, Market Value `45000` |
| Ownership / Client Info | As in AP1948_001 (fresh `client.stage.NNN@yopmail.com`) |
| Admin login | Dev admin account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link, pick "2023 TESLA Model Y", type the VIN, mileage and market value → **Continue**; fill the ownership page → **Continue** | "Select Coverage" lists at least two term cards; record each card and its term id, and whether CVE cards (ids 122–126) are listed. If only one term is listed, record it and mark the case BLOCKED "test data not on Dev: second active term" |
| 2 | Select the first term → **Continue** → fill Client Info → **Continue**; record the Summary "Subtotal". Click **Back** to "Select Coverage", select the second term → **Continue** → tick the consent again → **Continue**; record the Subtotal again | Each pass shows one Subtotal; record both term ids and both Subtotals as displayed, and whether the page reloaded |
| 3 | [Pre-Condition] In the admin area (log in at `/admin/login` with the Dev admin account), open `/admin/program-term/{id}/edit` for both terms and read their "Suggested retail price" values | Both values are recorded |
| 4 | [Verification] Compare each Subtotal with the matching term's "Suggested retail price" | After the second selection the Subtotal equals the second term's suggested retail price, not the first term's. Record how the price refreshed for Q-006 |

---

### AP1948_003 — Customer submits the quote request → no error, and any term or price shown back matches the one selected

| Field | Value |
|---|---|
| **TC ID** | AP1948_003 |
| **Title** | Customer submits the quote request → no error, and any term or price shown back matches the one selected |
| **Requirement** | AP1948 — REQ-002 (price of the selected term); what happens after submission is record-only — Q-006 (Judgement) |
| **Route** | `/customer/1493/quote-request` → Summary → Stripe checkout — Client portal quote request |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Submission requires payment — "Continue with payment" opens a Stripe sandbox checkout and neither `test-data` nor `env` has a Stripe test card (Dev, 2026-11-15) |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | 🚫 BLOCKED — steps 1–2 PASS (Summary AT 36m/60000km, Subtotal CA$1,025.00); steps 3–4 BLOCKED at the Stripe sandbox card page (no test card) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Environment → Dev; vehicle → list entry "2022 TESLA Model 3 / Long Range"; submit = tick "I accept the terms and conditions" and press "Continue with payment"; on a card-details page, enter nothing and BLOCK steps 3–4 unless `test-data` holds a Stripe test card; step 4 compares the amount only | Review R3 F-3 and R3 round 2 F-3 (2026-11-01); review R2 F-1 minor (amount only) | Reviewer findings |

**Why this matters:** the ticket does not say whether the selected term's price must be carried into the submitted request (Q-006, Judgement). This case therefore fails only on objective faults — an error page or HTTP 5xx, or a term or price that *is* shown back but differs from what the customer selected. Whether the term and price are shown back at all is recorded for Q-006, never judged.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2022 TESLA Model 3 / Long Range" (id 80); VIN `5YJ3E1EB0NF000001`, Current mileage (km) `20000`, Market Value `45000` |
| Client Info | `Marie` / `Tremblay`, a fresh `client.stage.NNN@yopmail.com` (next unused `NNN`), other fields as in AP1948_001 |
| Payment | Stripe sandbox test card — **not in `test-data`** (Known blocker 1) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link, pick "2022 TESLA Model 3 / Long Range", type the VIN, mileage and market value → **Continue**; fill the ownership page → **Continue** | "Select Coverage" lists at least one term card |
| 2 | Select the first term (record its term id and card text) → **Continue**; fill Client Info from Test Data → **Continue** | The Summary page shows the selected program and term and its Subtotal; every field filled is recorded with its label and value |
| 3 | Tick "I accept the terms and conditions" and click "Continue with payment". If a page asks for card details and `test-data` has no Stripe test card, enter nothing, record the page and mark steps 3–4 BLOCKED | No error page or HTTP 5xx appears; record the page reached and, if paid with a test card, the confirmation shown |
| 4 | [Verification] Check every place the submitted request is shown back (payment page, confirmation, the customer's quote if visible). For each, record whether the term and the price appear, and their values | **FAIL only if** a term or price that appears differs from the one selected in step 2 — **amount only**; a format difference is recorded for Q-005. A term or price that does not appear is **not** a failure — record "term shown: yes/no, price shown: yes/no" for Q-006 |

---

### AP1948_004 — Tesla Model 3 on the customer portal → every term offered includes the model's configured category

| Field | Value |
|---|---|
| **TC ID** | AP1948_004 |
| **Title** | Tesla Model 3 on the customer portal → every term offered includes the model's configured category |
| **Requirement** | AP1948 — REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)"; Q-001 answer: "each model has a field called ‘category’ … test it based on the cateogry configured for your model" (Ken Nguyen, comment 19545) |
| **Route** | Admin — vehicle model category (route recorded at execution); Client portal `/customer/1493/quote-request/program` "Select Coverage"; Admin `/admin/program-term/{id}/edit` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | ✅ PASS — Model 3 category X = A (`/admin/vehicle-model-edit/3124/edit`); all 6 offered terms (16, 122–126) tick Category A |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Redesigned: the expected term list follows the category configured on the Tesla Model 3's model; Status BLOCKED (Q-001) → Not Run | Q-001 answered | Ken Nguyen, comment 19545 |

**Why this matters:** offering a term from the wrong category quotes the customer coverage that does not apply to their vehicle. This case reads the vehicle model's configured category (no change) and checks each offered term against it. It does not depend on the CVE program: whichever active terms are offered are checked. Whether eligibility settings other than category (fuel type, vehicle type, years, km) should also filter the list is not stated (Q-010), so they are recorded, not judged. Whether every term that ticks the category is offered is also recorded, not judged: a term can be held back by another setting.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2022 TESLA Model 3 / Long Range" (id 80); VIN `5YJ3E1EB0NF000001`, Current mileage (km) `20000`, Market Value `45000`; ownership as in AP1948_001 |
| Model category | Read in step 1 — "Tesla had been categorized into A and B" (Eric Lindquist, 19544); the Model 3's own value is not known until read |
| Admin login | Dev admin account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Dev admin account; find the screen holding the TESLA "Model 3" model's "category" field (record the route) and record its value — call it **X** — and the values the field allows. Change nothing | The field shows one category value; X and the allowed values are recorded. If the field cannot be found, mark the case BLOCKED "test data not on Dev: model category field not found" |
| 2 | [Pre-Condition] Open the Client portal link, pick "2022 TESLA Model 3 / Long Range", type the VIN, mileage and market value → **Continue**; fill the ownership page → **Continue** | "Select Coverage" opens without an error page. If it lists no term, record the page for Q-004 and mark the case BLOCKED "test data not on Dev: active program term for category X" |
| 3 | Record every term card (program name and term) and its term id (hidden radio value); note whether CVE cards (ids 122–126) are listed | Every offered term is recorded with its id; the CVE state is recorded for fact F-1 (absence is not a failure) |
| 4 | For each recorded term id, open `/admin/program-term/{id}/edit` and record which of "Category A"–"Category E" are ticked, plus its fuel types, vehicle type, eligibility years and km | Each offered term's settings are recorded. Change nothing |
| 5 | [Verification] Check every offered term from step 3 against X | Every offered term has "Category X" ticked. **FAIL** if any offered term does not tick X. A fuel type, vehicle type, year or km setting that does not fit the vehicle is recorded for Q-010, not judged |

---

### AP1948_005 — A term whose categories exclude the Tesla Model 3's category → it is not offered for that vehicle

| Field | Value |
|---|---|
| **TC ID** | AP1948_005 |
| **Title** | A term whose categories exclude the Tesla Model 3's category → it is not offered for that vehicle |
| **Requirement** | AP1948 — REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)"; Q-001 answer: "you can change it in the admin and test it based on the cateogry configured for your model" (Ken Nguyen, comment 19545) |
| **Route** | Client portal "Select Coverage"; Admin `/admin/program-term/{id}/edit`, `/admin/programs`, vehicle model category (route recorded at execution) |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | ✅ PASS — path B (no path-A term): Model 3 A → D hid term 16 (no term listed); restored to A and term 16 offered again |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Redesigned: path A uses an active non-CVE term that already excludes the model's category; path B changes the Model 3's category to a value an offered non-CVE term does not tick, and restores it in the same case. Never relies on CVE term 122. Status BLOCKED (Q-001) → Not Run | Q-001 answered; fact F-1 (CVE disabled); reviewer R1 round 2 F-1 | Ken Nguyen, comment 19545; Eric Lindquist, comment 19544 |
| 2026-11-15 | Step 2 path A narrowed: T must belong to a program that already has a term S in step 1's list, and match S on fuel type, vehicle type, years and km; S's id is recorded. Otherwise path B. Step 2 also checks X against AP1948_004's X (differs → BLOCKED "model category left changed"). Step 5 path A also checks the sibling S is listed | Review R2 round 1 F-1 (a term can be missing for dealer program eligibility, not its category); F-2 (restore chain) | Reviewer R2 round 1 findings |
| 2026-11-15 | Step 5 now states the path-A sibling check that the row above describes (it was missing from the step text). Path A only; the 2026-11-15 PASS ran path B and stands | Carried-forward reviewer minor (Revisions row 2 vs step 5) | Reviewer R2 minor, batch hand-off 2026-11-15 |

**Why this matters:** a filter that only adds the right terms but does not hide the wrong ones still lets the customer buy coverage priced for another category. On 2026-11-01 the only active term with a narrower category set was CVE term 122 (category A only), and the CVE program is now disabled, so this case cannot count on it. A term can also be missing because the customer's dealer is not eligible for its program (dealer "Program eligibility" / "Customer portal" tabs), so path A accepts only a term T whose program is already offered (sibling term S in the list) and whose fuel type, vehicle type, years and km equal S's — then only the category separates T from S. Path B changes only the model's category and uses a term the vehicle was just offered, so a term that then disappears can only have been removed by the category rule (other eligibility settings are unchanged — Q-010). The category is shared reference data: path B records the original and restores it before the case ends.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2022 TESLA Model 3 / Long Range" (id 80); VIN `5YJ3E1EB0NF000002`, Current mileage (km) `20000`, Market Value `45000`; ownership as in AP1948_001 |
| Model category | **Original X** recorded in step 2 (Configuration — restored in step 4 on path B) |
| Excluded term T / sibling S / changed category Y | Chosen in step 2 from what is recorded. Path A: T not ticking X, from a program with an offered term S of the same fuel type, vehicle type, years and km. Path B: prefer T = term 16 (categories A, B, C on 2026-11-01) and a value Y the field allows that T does not tick |
| Admin login | Dev admin account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link, pick "2022 TESLA Model 3 / Long Range", type the VIN, mileage and market value → **Continue**; fill the ownership page → **Continue**; record every term card and its term id | "Select Coverage" lists at least one non-CVE term (id outside 122–126). If none, mark the case BLOCKED "test data not on Dev: active non-CVE program term for this vehicle" |
| 2 | [Pre-Condition] In the admin (Dev admin account), record the TESLA "Model 3" model's "category" as the **original X** and the values it allows (record the route); open each offered term's `/admin/program-term/{id}/edit` and record its ticked categories, fuel types, vehicle type, years and km. **Path A** only if, on `/admin/programs`, an active non-CVE term T that does **not** tick X belongs to a program that already has a term S in step 1's list, and T matches S on fuel type, vehicle type, eligibility years and km; record T's and S's ids. **Path B** (no such T): choose T = an offered non-CVE term (prefer 16) and Y = an allowed value T does not tick | X must equal the value AP1948_004 recorded; if it differs, mark the case BLOCKED "model category left changed" and stop. The path, T, S (path A) or Y (path B) are recorded. Field not found → BLOCKED "test data not on Dev: model category field not found". No path possible (no path-A term, and every allowed value is ticked by every offered non-CVE term) → BLOCKED "test data not on Dev: no active term excludes a model category" |
| 3 | **Path B only:** set the Model 3's category to Y and save; re-open the field and record that it shows Y (screenshot with the model's name in view). Then repeat step 1's portal walk with the same entry and record every term card and id. **Path A:** no change — the step 1 list is the list under test | Path B: the save is confirmed and the field shows Y; "Select Coverage" opens without an error page and its terms are recorded (an empty list is recorded for Q-004) |
| 4 | **Path B only:** set the Model 3's category back to the **original X** and save; re-open the field (screenshot with the model's name and value in view); repeat the portal walk and record the terms listed. **Path A:** record "nothing changed" | Path B: the field shows X again, and "Select Coverage" lists term T again |
| 5 | [Verification] Look for term T in the list under test (path A: step 1; path B: step 3), and check each listed term ticks the category in force (X on path A, Y on path B) | Term T is **not** listed, and every listed term ticks the category in force. Path A also: the sibling term S is listed (if S is missing, the program itself is not offered — mark the case BLOCKED "test data not on Dev: sibling term S not offered", not FAIL). **FAIL** if T is listed or any listed term does not tick that category. Path B also: the admin field shows X again and T is offered again after the restore — nothing is left changed; a restore that cannot be confirmed stops all further cases (Execution Context) |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — terms filtered by the model's configured category (filter cases) | AP1948_004 | AP1948_005 | AP1948_006 (file 2) | — |
| REQ-002 — price = term's suggested retail price (price cases) | AP1948_001, AP1948_009 (file 2) | — | AP1948_002 | AP1948_003 |
| REQ-003 AC 1 — Tesla term price = suggested retail price, nothing added (Q-002 Accepted) | AP1948_007, AP1948_008 (file 2) | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP1948_001 | ✅ PASS (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Srp1025Nov15_pass.png` |
| AP1948_002 | ✅ PASS (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermSubtotal2700_pass.png` |
| AP1948_003 | 🚫 BLOCKED (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutNov15_blocked.png` |
| AP1948_004 | ✅ PASS (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_004-step5-Term16TicksCategoryA_pass.png` |
| AP1948_005 | ✅ PASS (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_005-step5-CategoryDTerm16NotListed_pass.png` |

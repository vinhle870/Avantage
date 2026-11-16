# Test Cases — AP1948 (File 2 of 2)

**Project:** Avantage Plus v2 — Client portal
**Requirement:** AP1948 — CBI / CVE Tesla Price modification (Jira AP-1948)
**Source:** requirements/AP-1948-cbi-cve-tesla-price-modification.md · qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md (2026-11-15) · qa-artifacts/2-test-plan/AP-1948_test-plan.md (version 2.0, 2026-11-15)
**Date:** 2026-11-01 (redesigned 2026-11-15)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP1948_006 to AP1948_009 (4 test cases)
**Coverage:** Edge-case · Functional · Regression
**Revision 2026-11-01:** AP1948_009 added — promoted from AP1948_ReviewFindings_2026-11-01.md Pass 2 #1 (High) by Gate B rule B2. File renamed from `AP1948_TestCases_006-008.md`.
**Revision 2026-11-01 (review R2 independent, F-3/F-4):** AP1948_009 step 2 no longer labelled `[Pre-Condition]` — it holds the price change under test. Vehicle-entry fallback added to the Execution Context.
**Revision 2026-11-15:** Re-design after Q-001 was answered (comment 19545) and the CVE program was disabled (fact F-1, comment 19544). AP1948_006 redesigned against the model's configured category (it changes the Tesla Model 3's category and restores it). AP1948_007 and AP1948_008 stay BLOCKED on Q-002 (vehicle wording updated, CVE note added). AP1948_009 keeps its test logic; environment (Dev), vehicle wording and price location reworded (review R3 F-3), restore evidence named (R3 round 2 F-1/F-2). Status and Result of 009 are the 2026-11-01 result; it runs again at the next execution on Dev.
**Revision 2026-11-15 (review R2 round 1, F-2/F-3):** Execution Context gains the run order and the restore stop rule; AP1948_006 step 2 checks the Model 3 category against AP1948_004's X, and step 3 records the categories of any term first seen after the change.
**Revision 2026-11-15 (review R3 round 1, F-2, applied to both files):** Execution Context — the vehicle model's category screen is now mapped (`/admin/vehicle-model`, edit `/admin/vehicle-model-edit/{id}/edit`); the navigation-gap note is closed. Test logic unchanged.
**Revision 2026-11-15 (Q-002 Accepted; reviewer R1 round 3 F-1/F-2):** AP1948_007 and AP1948_008 redesigned against Q-002 Accepted — every offered term's Client portal price must equal its suggested retail price with nothing added (record-and-accept); the "Original ask" figures are background. Both now Not Run. Known blockers 1–2 closed. Run order adds 007 and 008 to the read-only group. AP1948_006 and AP1948_009 unchanged (their 2026-11-15 results stand).

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client portal (no login) for the terms and price shown to the customer; Admin portal to read program-term settings and a vehicle model's category, and to change and restore one term's price (AP1948_009) or the Tesla Model 3's category (AP1948_006) | `navigation` §1 |
| **Entry route** | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` — customer 1493's quote request. Five pages in order: "Enter the vehicle" → `/ownership` "Enter the ownership info" → `/program` "Select Coverage" (term cards, **no price**) → `/client` "Client Info" → `/payment` "Summary" (block "Total Summary": **Subtotal**, GST, PST, Total). Each page moves on with "Continue" | `domain` (`qa-docs/client-portal-quote-request.md`, mapped on Dev 2026-11-01) |
| **Reading the offered terms** | On "Select Coverage" each card shows only the program name and the term. The term id is the value of the card's hidden radio `customer_quote_coverage[programTerm]`; its admin page is `/admin/program-term/{id}/edit` | `domain` |
| **Reading a term's settings** | `/admin/program-term/{id}/edit`: "Suggested retail price", checkboxes "Category A"–"Category E", fuel type, vehicle type, eligibility years and km. "Save" goes to `/admin/program-terms` with "Program terms saved" | `domain` (`qa-docs/admin-portal.md`, Dev 2026-11-01) |
| **Vehicle model "category"** | Each vehicle model has a "category" field set in the admin (comment 19545). Mapped on Dev 2026-11-15: `/admin/vehicle-model` (filter Make = TESLA) → edit `/admin/vehicle-model-edit/{id}/edit`, field "category" (Category A–E); Save → "Vehicle model saved". TESLA Model 3 = #3124 | Analysis Q-001; `domain` (`qa-docs/admin-portal.md`, Dev 2026-11-15) |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca/` (registry `execution_env: Dev`) | `env` (Dev Environment section) |
| **Login** | Client portal: none. Admin portal: `https://v2dev.garantieavantageplus.ca/admin/login` with the Dev admin account from `env` (Dev Environment section); the login page renders in French | `env`, `navigation` §1 |
| **Test data** | Customer 1493 (exists on Dev). Vehicle list entries "2022 TESLA Model 3 / Long Range" (id 80), "2023 TESLA Model Y" (id 81), and the Tesla Model S and Model X entries listed in `qa-docs/client-portal-quote-request.md` (Model S 2015–2024, Model X 2016–2022). Vehicle model categories on Dev (2026-11-15, `qa-docs/admin-portal.md`): Model 3 #3124 A, Model Y #3126 A, Model S #3127 B, Model X #4725 B, X #4724 B. CVE terms 122–126 tick only Category A. Term 16 "L'Avantageuse AT 36m/60000km" is non-CVE (1025, categories A, B, C); terms 122–126 are CVE and may be gone (fact F-1). Client Info values as in file 1 | `env`, `test-data`, `domain` |
| **Language** | EN as the page renders by default | `navigation` |
| **Leaves behind** | Each case leaves its vehicle and form values in the browser session; `cleanup` is `missing`. AP1948_009 changes term 16's suggested retail price and AP1948_006 changes the Tesla Model 3's category — each **must restore** the value inside the same case. No case leaves configuration changed | `cleanup` (missing) |

**Standing facts only.** Vehicles and form values are dynamic and are entered in each case's `[Pre-Condition]` step. Configuration that a case changes (a term's price, a model's category) is recorded before the change and restored inside the same case (Configuration class, test plan §8.1).

**CVE program (fact F-1).** Missing CVE terms (ids 122–126) are not a FAIL, and no case re-enables the CVE program.

**Navigation gap — closed 2026-11-15:** the category field was mapped during the 2026-11-15 execution (see the row above and `qa-docs/admin-portal.md`). If the route no longer opens, the steps needing it are BLOCKED "test data not on Dev: model category field not found", not FAIL.

**Run order and restore stop rule (both files).** Run AP1948_001, 002, 003 and 004 (file 1), 007 and 008 first (they change no configuration). Then run AP1948_009, AP1948_005 (file 1) and AP1948_006, one at a time, in that order. Before AP1948_005 and AP1948_006 start, the Tesla Model 3's category must equal the **X recorded by AP1948_004**, and term 16's "Suggested retail price" must equal the value AP1948_009 restored. If a restore (009's term price, or 005's or 006's model category) cannot be confirmed, **stop all further cases** and report which value was left changed and its current value.

**Vehicle entry.** The vehicle is picked from the fixed list "I'd like a warranty for a*". The year is not a test condition: if an entry named in a case is missing, pick another entry of the same make and model and record it. If the page takes the vehicle another way, mark that step and the rest of the case BLOCKED "vehicle entry differs from design".

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| — | Closed 2026-11-15: whether the "Original ask" Tesla figures (2500$–2900$, +200$ / +800$) still apply | AP1948_007, AP1948_008 | Accepted — Q-002, knowledge lookup 2026-11-15: price = the term's suggested retail price, nothing added (record-and-accept) |
| — | Closed 2026-11-15: whether the CVE Tesla terms are offered on Dev (fact F-1) | AP1948_007, AP1948_008 | No longer a blocker — every offered term is checked; BLOCKED only if no term is offered for a model |
| — | Closed 2026-11-15: which models are in which category, and where a model's category is set | AP1948_006 | Answered — Q-001, comment 19545 |

> Every test case named in an open **Affects** cell ships with **Status: BLOCKED** and a
> **Blocked by** value — not `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP1948_006 | Tesla Model 3 moved to a category no offered term covers → no wrong-category term and no error | Edge-case | Low | PASS |
| AP1948_007 | Tesla Model 3 or Model Y → every offered term's price equals its suggested retail price, nothing added | Functional | Medium | PASS |
| AP1948_008 | Tesla Model S or Model X → every offered term's price equals its suggested retail price, nothing added | Functional | Medium | PASS |
| AP1948_009 | Admin changes a term's suggested retail price → customer portal shows the new price for that term | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`. AP1948_006 and 009 show the 2026-11-15 results on Dev (`execution-log_AP-1948_2026-11-15.md`); AP1948_007 and 008 were redesigned after that run and passed in its Run 2 (09:54–09:59Z).

---

## Test Cases

---

### AP1948_006 — Tesla Model 3 moved to a category no offered term covers → no wrong-category term and no error

| Field | Value |
|---|---|
| **TC ID** | AP1948_006 |
| **Title** | Tesla Model 3 moved to a category no offered term covers → no wrong-category term and no error |
| **Requirement** | AP1948 — REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)"; Q-001 answer: "you can change it in the admin and test it based on the cateogry configured for your model" (comment 19545). The empty-state display is record-only — Q-004 (Judgement) |
| **Route** | Admin — vehicle model category (route recorded at execution), `/admin/program-term/{id}/edit`; Client portal "Select Coverage" |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | ✅ PASS — Model 3 A → E: empty list, no 5xx (Continue → 422 "This value is not valid."); restored to A, step 1 terms offered again |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Redesigned: change the Tesla Model 3's category to an allowed value that none of its offered terms ticks, check the page, restore the original category in the same case. Status BLOCKED (Q-001) → Not Run | Q-001 answered | Ken Nguyen, comment 19545 |
| 2026-11-15 | Step 2 checks X against AP1948_004's X (differs → BLOCKED "model category left changed"). Step 3 records the ticked categories of any term id not seen in step 1, for step 5 | Review R2 round 1 F-2 (restore chain), F-3 | Reviewer R2 round 1 findings |

**Why this matters:** the ticket does not say what a customer sees when their vehicle's category has no term (Q-004). This case judges only objective faults — an error page, or a term offered that does not tick the vehicle's category — and records the empty-state display. It needs a category with no active term; it does not search the whole program list for one, it moves the Model 3 to a value none of its offered terms ticks and observes. If terms still appear (another term covers that value), the empty state was not reached and the case is BLOCKED, not FAIL. The category is shared reference data, so it is restored before the case ends.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2022 TESLA Model 3 / Long Range" (id 80); VIN `5YJ3E1EB0NF000003`, Current mileage (km) `20000`, Market Value `45000`; ownership: original owner Yes, date = today, "Franchised Dealership", inspected Yes, report Yes |
| Model category | **Original X** recorded in step 2 (Configuration — restored in step 4) |
| Empty category Y | Chosen in step 2: an allowed value no offered term ticks — prefer "D" or "E" if the field allows them (term 16 ticks A, B, C) |
| Admin login | Dev admin account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link, pick "2022 TESLA Model 3 / Long Range", type the VIN, mileage and market value → **Continue**; fill the ownership page → **Continue**; record every term card and its term id | "Select Coverage" opens without an error page; every offered term and id is recorded |
| 2 | [Pre-Condition] In the admin (Dev admin account), record the TESLA "Model 3" model's "category" as the **original X** and the values it allows (record the route); open each step 1 term's `/admin/program-term/{id}/edit` and record its ticked categories; choose Y = an allowed value that none of them ticks | X must equal the value AP1948_004 recorded; if it differs, mark the case BLOCKED "model category left changed" and stop. X, the allowed values, each term's categories and Y are recorded. Field not found → BLOCKED "test data not on Dev: model category field not found". Every allowed value ticked by some offered term → BLOCKED "test data not on Dev: no model category without an offered term" |
| 3 | Set the Model 3's category to Y and save; re-open the field (screenshot with the model's name and Y in view). Repeat step 1's portal walk with the same entry and record what "Select Coverage" shows — empty list, a message, or term cards with their ids — and whether "Continue" can be pressed. For any term id not seen in step 1, open `/admin/program-term/{id}/edit` and record its ticked categories | The save is confirmed and the field shows Y; the page's display is recorded as seen, and every term listed has its ticked categories recorded |
| 4 | Set the Model 3's category back to the **original X** and save; re-open the field (screenshot with the model's name and X in view); repeat the portal walk and record the terms listed | The field shows X again, and "Select Coverage" lists the same terms as in step 1 |
| 5 | [Verification] Check the step 3 page for objective faults, and the restore | No error page or HTTP 5xx in step 3; every term card listed in step 3 ticks Y (**FAIL** if one does not); X is restored and the step 1 terms are offered again. Record the empty-state display for Q-004. If step 3 listed terms that all tick Y, the empty state was not reached — mark the case BLOCKED "test data not on Dev: category Y has an active term" |

---

### AP1948_007 — Tesla Model 3 or Model Y → every offered term's price equals its suggested retail price, nothing added

| Field | Value |
|---|---|
| **TC ID** | AP1948_007 |
| **Title** | Tesla Model 3 or Model Y → every offered term's price equals its suggested retail price, nothing added |
| **Requirement** | AP1948 — REQ-003 AC 1 (Q-002 **Accepted**, knowledge lookup 2026-11-15): "the Client portal price for a Tesla term is that term's suggested retail price, with no fixed Tesla figure and no +200$ / +800$ added"; ticket Then item 2: "The price should be the pricing set in the program term > **suggested retail price**". The "Original ask" figures (+200$ for Model 3 / Y) are background, not acceptance criteria |
| **Route** | Admin `/admin/vehicle-model` (filter TESLA), `/admin/program-term/{id}/edit`; Client portal `/customer/1493/quote-request` → "Select Coverage" → Summary |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 (Run 2) — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` (section "Run 2") |
| **Result** | ✅ PASS — 12 of 12 Subtotals = suggested retail price (Model 3 and Model Y; terms 16, 122–126); every term ticks Category A |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Environment → Dev; vehicles → list entries; price read on the Summary "Subtotal"; CVE note added (still BLOCKED on Q-002) | Fact F-1 (comment 19544); review R3 F-3 | Eric Lindquist, comment 19544 |
| 2026-11-15 | Redesigned for Q-002 Accepted: the expected price is each offered term's admin suggested retail price with nothing added (record-and-accept), not the original-ask figure + 200$. Checks every offered term for both models and records which terms appear and both models' categories (Model 3 #3124 and Model Y #3126 = Category A on Dev). BLOCKED only if no term is offered. Status BLOCKED → Not Run | Q-002 Accepted (analysis, 2026-11-15 knowledge lookup); reviewer R1 round 3 F-1, F-2 | Reviewer R1 round 3 findings; analysis Q-002 |

**Why this matters:** a Model 3 or Model Y customer must be quoted the price the business configured on the term. No Story or Task keeps the "Original ask" surcharge (Q-002 Accepted), so a +200$ — or any other amount — added on top would overcharge every such sale. AP1948_002 saw one Model Y term at its suggested retail price (term 122, CA$2,700.00 = 2700); this case covers every term offered to both models. On Dev both models are Category A, which term 16 and the CVE terms 122–126 tick, so up to six terms are expected; a CVE term that is not offered (fact F-1, CVE disabled) is not a FAIL.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicles picked | "2022 TESLA Model 3 / Long Range" (id 80) — VIN `5YJ3E1EB0NF000007`; then "2023 TESLA Model Y" (id 81) — VIN `7SAYGDEE0PF000007`. Both: Current mileage (km) `20000`, Market Value `45000`; ownership as in AP1948_001 |
| Client Info | `Marie` / `Tremblay`, a fresh `client.stage.NNN@yopmail.com` per model (next unused `NNN`, recorded), other fields as in AP1948_001 |
| Admin login | Dev admin account from `env` |
| Expected price per term | The term's own "Suggested retail price" read in step 1 or step 5 (term 16 = 1025, term 122 = 2700 on 2026-11-15) — nothing added |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Dev admin account. On `/admin/vehicle-model` (filter Make = TESLA) record the category of "Model 3" (#3124) and "Model Y" (#3126). Open `/admin/program-term/{id}/edit` for terms 16 and 122–126 and record each "Suggested retail price" and its ticked categories. Change nothing | Model 3 shows the X recorded by AP1948_004 (if it differs, mark the case BLOCKED "model category left changed" and stop); both categories and every term's price and categories are recorded |
| 2 | [Pre-Condition] Open the Client portal link, pick "2022 TESLA Model 3 / Long Range", type its VIN, mileage and market value → **Continue**; fill the ownership page → **Continue**; record every term card, its term id and whether CVE cards (122–126) are listed | "Select Coverage" opens without an error page and lists at least one term; every card and id is recorded. No term listed → mark the case BLOCKED "test data not on Dev: no term offered for Model 3" |
| 3 | For each listed term in turn: select it → **Continue** → Client Info (first pass only) → **Continue**; record the term and the Summary "Subtotal" as displayed; click **Back** to "Select Coverage" for the next term | Each term reaches a Summary page with one Subtotal; every term id and its Subtotal are recorded |
| 4 | Repeat steps 2–3 with "2023 TESLA Model Y" and its VIN | As in steps 2–3, for the Model Y. No term listed → mark the case BLOCKED "test data not on Dev: no term offered for Model Y" |
| 5 | [Verification] For any listed term id not read in step 1, open `/admin/program-term/{id}/edit` and record its price and categories. Compare every recorded Subtotal with its term's "Suggested retail price" | Every Subtotal **equals** its term's suggested retail price — no +200$ and no original-ask figure (record-and-accept, Q-002; display format "CA$1,025.00" accepted, Q-005). Every listed term ticks the model's category. **FAIL** if any Subtotal differs from its term's price, or a listed term does not tick the model's category. Which terms appear for each model is recorded; a CVE term not offered is not a FAIL |

---

### AP1948_008 — Tesla Model S or Model X → every offered term's price equals its suggested retail price, nothing added

| Field | Value |
|---|---|
| **TC ID** | AP1948_008 |
| **Title** | Tesla Model S or Model X → every offered term's price equals its suggested retail price, nothing added |
| **Requirement** | AP1948 — REQ-003 AC 1 (Q-002 **Accepted**, knowledge lookup 2026-11-15): "the Client portal price for a Tesla term is that term's suggested retail price, with no fixed Tesla figure and no +200$ / +800$ added"; ticket Then item 2: "The price should be the pricing set in the program term > **suggested retail price**"; REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)". The "Original ask" figures (+800$ for Model S / X) are background, not acceptance criteria |
| **Route** | Admin `/admin/vehicle-model` (filter TESLA), `/admin/program-term/{id}/edit`; Client portal `/customer/1493/quote-request` → "Select Coverage" → Summary |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 (Run 2) — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` (section "Run 2") |
| **Result** | ✅ PASS — 12 of 12 Subtotals = suggested retail price (Model S entry 91, Model X entry 94 → #4725; terms 16, 129–133); every term ticks Category B |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Environment → Dev; vehicles → list entries; price read on the Summary "Subtotal"; CVE note added (still BLOCKED on Q-002) | Fact F-1 (comment 19544); review R3 F-3 | Eric Lindquist, comment 19544 |
| 2026-11-15 | Redesigned for Q-002 Accepted: the expected price is each offered term's admin suggested retail price with nothing added (record-and-accept), not the original-ask figure + 800$. Model S / X are Category B on Dev and the CVE terms 122–126 tick only Category A, so probably only term 16 is offered: the case checks price = suggested retail price on every offered term and records which terms appear; a missing CVE term follows the category rule and is not a FAIL; BLOCKED only if no term is offered. Status BLOCKED → Not Run | Q-002 Accepted (analysis, 2026-11-15 knowledge lookup); reviewer R1 round 3 F-1, F-2 | Reviewer R1 round 3 findings; analysis Q-002 |

**Why this matters:** a Model S or Model X customer must be quoted the price the business configured on the term. No Story or Task keeps the "Original ask" +800$ surcharge (Q-002 Accepted), so any amount added on top would overcharge every such sale. No Model S / X price has been observed yet. On Dev these models are Category B and the CVE terms tick only Category A, so their absence here is the category filter working (REQ-001), not a fault.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicles picked | A "2022 TESLA Model S" entry (any trim; record the entry id) — VIN `5YJSA1E20NF000008`; then a "2022 TESLA Model X" entry (any trim; record the entry id) — VIN `7SAXCDE50NF000008`. Both: Current mileage (km) `20000`, Market Value `45000`; ownership as in AP1948_001 |
| Client Info | `Marie` / `Tremblay`, a fresh `client.stage.NNN@yopmail.com` per model (next unused `NNN`, recorded), other fields as in AP1948_001 |
| Admin login | Dev admin account from `env` |
| Expected price per term | The term's own "Suggested retail price" read in step 1 or step 5 (term 16 = 1025 on 2026-11-15) — nothing added |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Dev admin account. On `/admin/vehicle-model` (filter Make = TESLA) record the category of "Model S" (#3127), "Model X" (#4725) and "X" (#4724). Open `/admin/program-term/16/edit` and record its "Suggested retail price" and ticked categories. Change nothing | The three categories and term 16's price and categories are recorded (on 2026-11-15: Category B for all three; term 16 ticks A, B, C) |
| 2 | [Pre-Condition] Open the Client portal link, pick the "2022 TESLA Model S" entry, type its VIN, mileage and market value → **Continue**; fill the ownership page → **Continue**; record every term card, its term id and whether CVE cards (122–126) are listed | "Select Coverage" opens without an error page and lists at least one term; every card and id is recorded. No term listed → mark the case BLOCKED "test data not on Dev: no term offered for Model S" |
| 3 | For each listed term in turn: select it → **Continue** → Client Info (first pass only) → **Continue**; record the term and the Summary "Subtotal" as displayed; click **Back** to "Select Coverage" for the next term | Each term reaches a Summary page with one Subtotal; every term id and its Subtotal are recorded |
| 4 | Repeat steps 2–3 with the "2022 TESLA Model X" entry and its VIN | As in steps 2–3, for the Model X. No term listed → mark the case BLOCKED "test data not on Dev: no term offered for Model X" |
| 5 | [Verification] For any listed term id other than 16, open `/admin/program-term/{id}/edit` and record its price and categories. Compare every recorded Subtotal with its term's "Suggested retail price" | Every Subtotal **equals** its term's suggested retail price — no +800$ and no original-ask figure (record-and-accept, Q-002; display format "CA$1,025.00" accepted, Q-005). Every listed term ticks the model's category (B on 2026-11-15). **FAIL** if any Subtotal differs from its term's price, or a listed term does not tick the model's category. Which terms appear for each model is recorded; a CVE term not offered to a Category B model follows the category rule and is not a FAIL |

---

### AP1948_009 — Admin changes a term's suggested retail price → customer portal shows the new price for that term

| Field | Value |
|---|---|
| **TC ID** | AP1948_009 |
| **Title** | Admin changes a term's suggested retail price → customer portal shows the new price for that term |
| **Requirement** | AP1948 — REQ-002: "The price should be the pricing set in the program term > **suggested retail price**" |
| **Route** | `/customer/1493/quote-request` → Summary — Client portal quote request; admin `/admin/program-term/{id}/edit` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-15.md` |
| **Result** | ✅ PASS — term 16 price 1025 → 1125 showed Subtotal CA$1,125.00 on the portal; restored to 1025 and confirmed |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Environment → Dev; vehicle → list entry "2022 TESLA Model 3 / Long Range"; price read on the Summary "Subtotal"; screenshots of the admin field after the change and after the restore, with the term heading or "Program terms saved" in view. Test logic unchanged | Review R3 F-3; R3 round 2 F-1/F-2 | Reviewer findings |

**Why this matters:** AP1948_001 proves the two prices match at one moment. Only a change made in admin and seen on the Client portal proves the price is *read from* the program term, as REQ-002 states, rather than fixed in code — the ticket's "Original ask" listed fixed Tesla prices. This is a REQ-002 price case on the first offered term (term 16, non-CVE, on 2026-11-01); the CVE shutdown does not affect it. The term's price is shared configuration, so this case restores it before it ends.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2dev.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle picked | "2022 TESLA Model 3 / Long Range" (id 80); VIN `5YJ3E1EB0NF000001`, Current mileage (km) `20000`, Market Value `45000`; ownership and Client Info as in AP1948_001 |
| Admin login | Dev admin account from `env` |
| Changed price | The original suggested retail price + 100 (term 16 on 2026-11-01: 1025 → 1125) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link, pick "2022 TESLA Model 3 / Long Range" with its VIN, mileage and market value, fill the ownership page, select the first term card (record its term id) and Client Info, and record the Summary "Subtotal" | One Subtotal is shown for the selected term; term id and Subtotal recorded |
| 2 | Log in at `/admin/login` with the Dev admin account, open `/admin/program-term/{term id}/edit`, record its "Suggested retail price" as the **original**, change it to original + 100 and **Save**; re-open the term and take a screenshot of the field with the term heading in view | "Program terms saved" appears, and the re-opened field shows original + 100 |
| 3 | Reload the Client portal link, pick the same entry and the same term, and record the Summary "Subtotal" | One Subtotal is shown for the term; record it |
| 4 | In the admin program term, set "Suggested retail price" back to the **original** value and **Save**; re-open the term and take a screenshot of the field with the term heading in view | "Program terms saved" appears, and the re-opened field shows the original value |
| 5 | [Verification] Compare the step 3 Subtotal with original + 100, and the admin field with the original | The Client portal Subtotal in step 3 equals original + 100 (not the original), and the admin field shows the original value again — nothing is left changed |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — terms filtered by the model's configured category (filter cases) | AP1948_004 (file 1) | AP1948_005 (file 1) | AP1948_006 | — |
| REQ-002 — price = term's suggested retail price (price cases) | AP1948_001 (file 1), AP1948_009 | — | AP1948_002 (file 1) | AP1948_003 (file 1) |
| REQ-003 AC 1 — Tesla term price = suggested retail price, nothing added — Model 3 / Y (Category A) | AP1948_007 | — | — | — |
| REQ-003 AC 1 — same, Model S / X (Category B) | AP1948_008 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP1948_006 | ✅ PASS (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_006-step3-CategoryEEmptyCoverage_pass.png` |
| AP1948_007 | ✅ PASS (2026-11-15, Run 2) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_007-step5-Run2AdminTerm125Srp2900CategoryA_pass.png` |
| AP1948_008 | ✅ PASS (2026-11-15, Run 2) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_008-step5-Run2AdminTerm129Srp3400CategoryB_pass.png` |
| AP1948_009 | ✅ PASS (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_009-step3-PortalSubtotal1125_pass.png` |

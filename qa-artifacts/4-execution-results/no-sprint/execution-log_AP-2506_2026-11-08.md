# Execution Log — AP-2506

**Ticket:** AP-2506 — Generate contract for a quote's Esthetic protection product
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, `stlc-ticket-pipeline --from execute --until correct-cases`)
**Date:** 2026-11-08
**Environment:** Dev (v2dev) — `execution_env` in `qa-artifacts/qa-config/tools.md`
**Base URL:** `https://v2dev.garantieavantageplus.ca/` — the "Dev Environment" section of the `env` source (`qa-artifacts/base-test/execute.env.md`)
**Account:** the shared dealer account from the `env` source, Dev Environment section, typed into the login form only. It signed in as "Test QA staging" (dealer 1380). No credential is copied into this log.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, `?_locale=en` (English) for every judgement
**Duration:** 2026-11-08T03:16:19Z → 2026-11-08T03:26:23Z
**Test-case files:** `qa-artifacts/3-test-cases/AP2506_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2506_TestCases_006-009.md`
**Run decision:** the QA decided on 2026-11-08 to execute AP-2506 on Dev although its Jira status is QA. Gate B was decided by the orchestrator's qa-reviewer (R2 round 3, rule B3 — execute the current cases). The R2 round 3 executor notes were applied (see Environment Observations).
**Smoke check:** the `env-check` source is missing; the orchestrator's environment health check had already passed before this run, and the Dev login and quote pages answered HTTP 200 throughout.
**RUN_DATE:** 2026-11-08 (UTC, from `date -u`)

| Metric | Value |
|---|:---:|
| Total test cases | 9 |
| Passed | 5 |
| Failed | 3 |
| Blocked | 1 |
| Skipped | 0 |
| Not Run | 0 |
| **Pass rate** | **55.6% (5 of 9; no SKIPPED)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2506_001 | Generate Contract on Esthetic protection opens its own page at the unchanged address, not a pop-up | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_001-step5-ContractPageFromAddress_pass.png` | Row ⋯ → Generate Contract opened `/quote/6692/permaplate-create-contract` as a full page, same tab |
| AP2506_002 | Generate Contract in the Extended Warranty row actions (AC 1 as written) | High | 🚫 | 0 | 0 | — | Ships BLOCKED on Q-001 (Blocking, unanswered) — not run |
| AP2506_003 | Vehicle and owner on the left, Program Summary and button on the right | Medium | ❌ | 2 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step4-RightColumnProductSummary_fail.png` | Headings read "Owner identification" and "Product Summary", not AC 2's "Owner information" / "Program Summary" |
| AP2506_004 | Contract summary shows term, start and end dates, chosen products and a total | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_004-step5-SummaryUnchangedStartNotEditable_pass.png` | 10 ans · 2026-11-08 · 2036-11-08 · Antirouille – Rust+Sound (combo) · CA$80.00; start date not editable |
| AP2506_005 | Contract page pre-filled with the quote's vehicle and client details | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_005-step3-VehiclePrice10000Not25000_fail.png` | "Vehicle Price" shows 10000.00 (inventory price), not the quote's Price 25000; all other values match |
| AP2506_006 | Submitting with valid values creates a contract with a downloadable PDF | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_006-step5-PdfDownloadHttp500_fail.png` | Contract PNA-0000000022 + invoice 946 created on first submit; PDF download HTTP 500 — known defect AP-2512 |
| AP2506_007 | Submitting with the owner's last name emptied does not crash or lose values | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_007-step4-LastNameBlankRefusedValuesKept_pass.png` | Refused (POST 200) with "This value should not be blank." under Last name; other values kept; no contract |
| AP2506_008 | Submitting with Financing company on "Choose" does not return a server error | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_008-step4-FinancingBlankRefusedNo5xx_pass.png` | Refused (POST 200) with "This value should not be blank." at Financing company; no 5xx; no contract |
| AP2506_009 | Opening the contract page for a quote whose contract exists does not crash | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_009-step4-StillOneContractRow_pass.png` | Address redirects (302) silently to the quote page; still one row for quote C |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2506_001 — Clicking "Generate Contract" on Esthetic protection opens its own page at the unchanged address, not a pop-up — Step Results

Quote A = **6692**, client `Esthetic Owner2506-001`, `client.stage.2506001@yopmail.com`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in (`?_locale=en`), `/vehicle/915/details` → Create quote, shared client values (last name `Owner2506-001`), vehicle step Delivered at 2026-11-08, Price 25000 | `/quote/{id}/details` shows `#{id} - Esthetic Owner2506-001`; quote id recorded | URL = `/quote/6692/details`; H1 = "#6692 - Esthetic Owner2506-001 1FAHP35NX8W239204"; vehicle row "Delivery date: Nov 8, 2026", CA$25,000.00; flash "Vehicle saved" | ✅ | The heading appends the VIN, as recorded in `domain` for Dev. The client form's consent checkbox is now the FORM-L25 confirmation (ticked); "Send a copy of the privacy policy" left unticked |
| 2 `[Pre-Condition]` | Add Esthetic protection (first product, first enabled option) → Save; record tab count | Esthetic protection row with the chosen product; product, options ticked and Cost recorded | Product radio "10 ans" (only one offered, clicked via its label). Options in page order: Antirouille – Rust+Sound (combo) 80$ (enabled), Peinture – Céramique + Graphene 75$ (enabled), Extra care 70$ (disabled). Ticked the first enabled = **option 20 Antirouille – Rust+Sound (combo)**; options ticked after the click: 20 only (17 and 18 unticked). "Cost: 80$". Save → `/quote/6692/details`, flash "Esthetic protection quote saved successfully"; row = "Esthetic protection · Antirouille – Rust+Sound (combo) Cost: CA$80.00$ · CA$80.00"; Subtotal CA$25,080.00. Open tabs = 1 | ✅ | The row names the option, not the term "10 ans". Its amount is now CA$80.00 and the subtotal includes it (AP-2516 described "-" here on 2026-11-01) — recorded, not judged here |
| 3 `[Verification]` | Row ⋯ → Generate Contract; inspect the page the action opened | `/quote/6692/permaplate-create-contract`, no error; full page (no modal, quote page not behind it, form and "Generate Contract" submit present); record right-column heading, tab behaviour (Q-001) and control label/place (Q-011) | ⋯ menu items = "Edit" (`/quote/6692/permaplate`) · "Generate Contract" (`/quote/6692/permaplate-create-contract`) · "Delete". After the click: URL = `/quote/6692/permaplate-create-contract`, HTTP 200; H1 "Esthetic protection Contract"; open modals = 0 (the only `.modal` element, `#myModal` "Loading...", has display none); "Summary of products" not on the page; form present with submit button "Generate Contract" (type submit). Right-column heading = "Product Summary". Opened in the same tab; tab count 1 → 1 | ✅ | Q-011: the control is the "Generate Contract" item in the Esthetic protection row's ⋯ menu on the quote page's "Summary of products" card. Q-001 record: same tab, no new tab |
| 4 | Open `/quote/6692/details` again, then type `/quote/6692/permaplate-create-contract` | Page loads from the address without error | GET `/quote/6692/details` → 200, then GET `/quote/6692/permaplate-create-contract` → 200; the contract page rendered | ✅ | — |
| 5 `[Verification]` | Inspect the page loaded from the address | Address exactly `/quote/6692/permaplate-create-contract`; same full page; same right-column heading | URL = `/quote/6692/permaplate-create-contract`; open modals = 0; "Summary of products" absent; H4 headings = "Vehicle identification", "Owner identification", "Product Summary"; submit button "Generate Contract" present. Left without submitting | ✅ | Same full page as step 3; the route is unchanged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_001-step3-ContractFullPageFromAction_pass.png` — the contract page the ⋯ → Generate Contract action opened, a full page with both columns and the red Generate Contract button
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_001-step5-ContractPageFromAddress_pass.png` — the same page loaded by typing the address

### AP2506_002 — "Generate Contract" in the Extended Warranty row actions opens the Esthetic protection contract page (acceptance criterion 1 as written) — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build the quote (last name `Owner2506-002`) | — | Not run | 🚫 | Shipped BLOCKED by Q-001 (Blocking, unanswered — the orchestrator's hand-off confirms it is still open). No quote was built |
| 2 `[Pre-Condition]` | Add extended warranty and Esthetic protection | — | Not run | 🚫 | Blocked by Q-001 |
| 3 | Extended Warranty row actions → Generate Contract | — | Not run | 🚫 | Blocked by Q-001 |
| 4 `[Verification]` | Inspect address, tab count and page | Not known — Q-001 | Not run | 🚫 | Blocked by Q-001: AC 1 names the Extended Warranty row but expects the Esthetic protection address. What must be fixed first: the ticket author answers Q-001 |

**Screenshots:** none — the case was not run.

### AP2506_003 — The Esthetic protection contract page shows vehicle and owner on the left, and Program Summary and the button on the right — Step Results

Quote A (6692) reused — its Esthetic protection row still offered Generate Contract.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A if its row still offers the action | A quote with Esthetic protection and no contract; id recorded | Quote 6692; ⋯ menu still shows Generate Contract; no PNA number on the row | ✅ | Reused, unsubmitted |
| 2 | Open the contract page with the action | Loads without error | ⋯ → Generate Contract → `/quote/6692/permaplate-create-contract`, HTTP 200. Fallback not used | ✅ | — |
| 3 `[Verification]` | Inspect the left column at 1280 × 800 | Sections headed "Vehicle identification" and "Owner information" both in the left column; record other sections and where any financing field sits (Q-003) | Left column (`col-md-7`, x = 65, width 691): H4 "Vehicle identification" (summary line + "Vehicle details" toggle) and H4 **"Owner identification"**. No section headed "Owner information" exists on the page. No other left-column section. The "Financing company" select sits in the **right** column, inside "Product Summary" (Q-003) | ❌ | The owner section is present in the left column but is headed "Owner identification", not AC 2's "Owner information". A dealer comparing the page with the acceptance criterion sees a different heading. Network lines: `AP2506_003-step3-4-network_fail.txt` |
| 4 `[Verification]` | Inspect the right column | Section headed "Program Summary" and submit "Generate Contract" in the right column, side by side with the left; record the rest and all headings in order (Q-002) | Right column (`col-md-5`, x = 756, width 494, top 137 — same top as the left column, so side by side): H4 **"Product Summary"** (Program Term, Start Date, End date, Financing company, Selected protection products, Total), then the red submit button "Generate Contract". No section headed "Program Summary" exists. Headings in order (Q-002): H1 "Esthetic protection Contract"; H4 "Vehicle identification", "Owner identification", "Product Summary"; submit label "Generate Contract". Left without submitting | ❌ | The summary section and the button are in the right column, but the section is headed "Product Summary", not "Program Summary" as AC 2 and the description say. The 2026-11-07 redesign renamed both headings |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step3-LeftColumnOwnerIdentification_fail.png` — the left column, showing "Vehicle identification" and "Owner identification"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step4-RightColumnProductSummary_fail.png` — the full page, right column headed "Product Summary" beside the left column
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_003-step3-4-network_fail.txt` — request lines (method, URL, status) and the headings read

### AP2506_004 — The contract summary (AC 2 "Program Summary") shows the term, start and end dates, the protection products chosen on the quote, and a total — Step Results

Quote A (6692) reused. Options recorded as ticked on the quote: **option 20 Antirouille – Rust+Sound (combo)** only (per R2 round 3 executor note 2, "17 and 18" in the case is an example; judged against the options recorded as ticked). Quote Cost = CA$80.00.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A; record product, option and Cost | Quote with Esthetic protection and no contract | Quote 6692; product "10 ans"; option ticked = Antirouille – Rust+Sound (combo); Cost CA$80.00 | ✅ | — |
| 2 | Open the contract page with the action | Loads without error | ⋯ → Generate Contract → `/quote/6692/permaplate-create-contract`, HTTP 200. Fallback not used | ✅ | — |
| 3 `[Verification]` | Read the right-column summary section; record its heading | Term, start date, end date, non-empty products list naming only chosen items, total; record labels and values (Q-004, Q-005, Q-006) | Heading = "Product Summary". Program Term = "10 ans"; Start Date = "2026-11-08" (= RUN_DATE, Q-004: yes); End date = "2036-11-08" (= start + 120 months, Q-005: yes); Financing company = select "Choose"; Selected protection products = one bullet "Antirouille – Rust+Sound (combo)" (the option; the term "10 ans" is not listed — names shown: option only); Total = "CA$80.00" (= quote Cost 80, without tax, Q-006) | ✅ | Every name in the list was ticked on the quote; nothing unchosen is listed |
| 4 | Try to change the start date to 2026-11-15 | Record whether editable (Q-004) and whether end date follows (Q-005) | Start Date is plain text in a `<dd>` with no input; clicking it focuses nothing (active element = BODY). The form's only inputs are VIN, owner fields, Financing company and hidden fields — no start-date field. Not editable; end date therefore not re-checked | ✅ | Q-004: the start date cannot be changed on this page (Dev 2026-11-08) |
| 5 `[Verification]` | Inspect the summary again | Term, products and total unchanged | Program Term "10 ans", Start "2026-11-08", End "2036-11-08", Financing "Choose", products "Antirouille – Rust+Sound (combo)", Total "CA$80.00" — identical to step 3. Left without submitting | ✅ | No value lost |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_004-step3-SummaryTermDatesProductsTotal_pass.png` — the "Product Summary" column with term, dates, financing select, the one product and the total
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_004-step5-SummaryUnchangedStartNotEditable_pass.png` — the same column after trying to edit the start date

### AP2506_005 — The Esthetic protection contract page is pre-filled with the quote's vehicle and client details — Step Results

Quote A (6692) reused (client last name `Owner2506-001`).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A | Quote with Esthetic protection and no contract | Quote 6692, last name `Owner2506-001` | ✅ | — |
| 2 | Open the contract page with the action | Loads without error | ⋯ → Generate Contract → `/quote/6692/permaplate-create-contract`, HTTP 200. Fallback not used | ✅ | — |
| 3 `[Verification]` | Read the vehicle section (first in the left column); record summary line; expand "Vehicle details" | VIN, Ford, Focus, 2008, 5000 km match; `25000` in a purchase-price field if one is shown; none empty; record other fields and editability (Q-007) | Heading = "Vehicle identification". Summary line (word for word) = "Ford · Focus · 2008 · 1FAHP35NX8W239204 · CA$10,000.00". After expanding "Vehicle details": Odometer at delivery = 5000; Year = 2008; Make = Ford; Model = Focus; Delivery date = 2026-11-08; Cylinders = 4; Engine size = 2; Engine size unit = (empty); Fuel type = GASOLINE; Designation = Commercial; **Vehicle Price = 10000.00**; Transmission = Manual; Condition = new; Turbo engine / 4x4 / All Wheel Drive / Diesel / Injection = No; VIN = textbox "1FAHP35NX8W239204". Editable (Q-007): VIN only; every other vehicle field is read-only text | ❌ | The price field shows the vehicle's inventory price 10,000, not the Price 25000 entered on the quote's vehicle step (the quote page itself shows CA$25,000.00). A contract built from this page would carry a vehicle price different from the quote's. Every other known value matches. Network lines: `AP2506_005-step3-network_fail.txt` |
| 4 `[Verification]` | Read the owner section (second in the left column); record heading, fields, formats, editability | Every owner field carries the client's value; none empty or different | Heading = "Owner identification". First name = "Esthetic"; Last name = "Owner2506-001"; Company = (empty — the client was given none); Address = "200 Rue Test"; City = "Montréal"; Province = select "Québec" (full name); Postal code = "H2X 1Y4" (with the space); Email = "client.stage.2506001@yopmail.com"; Home phone = "5145550301"; Work phone = "5145550302" (undashed digits). No Address 2, other name, driver's licence or tax-exemption field. Editable (Q-007): every owner field (text inputs and the province select). Left without submitting | ✅ | All entered values pre-filled. Required (`*`): First name, Last name, Address, City, Province, Postal code |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_005-step3-VehiclePrice10000Not25000_fail.png` — the full page with "Vehicle details" expanded, "Vehicle Price 10000.00" and the summary line "CA$10,000.00"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_005-step3-network_fail.txt` — request lines (method, URL, status) and the two price values
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_005-step4-OwnerPrefilled_pass.png` — the left column with the owner fields pre-filled

### AP2506_006 — Submitting the Esthetic protection contract page with valid values creates a contract with a downloadable PDF — Step Results

Quote C = **6693**, `NAME_C` = `Owner2506-006-032125` (built 03:21:25Z), `client.stage.2506006@yopmail.com`. Quote built from the "Create quote" target `/quote/new/client?fromVehicleId=915` opened directly.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote C (client, vehicle 2026-11-08 / 25000, Esthetic protection) | Heading `#{id} - Esthetic NAME_C`; Esthetic protection row; id, name, product, options and Cost recorded | URL `/quote/6693/details`; H1 "#6693 - Esthetic Owner2506-006-032125 1FAHP35NX8W239204"; product "10 ans"; options ticked = 20 Antirouille – Rust+Sound (combo) only; Cost CA$80.00; flash "Esthetic protection quote saved successfully" | ✅ | POST `/quote/6693/vehicle` → 302; POST `/quote/6693/permaplate` → 302 |
| 2 | ⋯ → Generate Contract; choose the first financing company; record empty required fields | Loads without error; company shown | `/quote/6693/permaplate-create-contract` → 200 via the action (no fallback). Financing company set to "AutoCapital Canada" (first after "Choose"). Required fields before submit: VIN, First name, Last name, Address, City, Province (Québec), Postal code all filled; Financing company was the only empty required field and was filled. Nothing else changed | ✅ | Financing company is marked `required` in the HTML but its label shows no "*" |
| 3 | Click Generate Contract; repeat for any refused field with a Test Data value | No error page or 5xx on any submit; record address, messages, invoice notice (Q-009) | **Submit 1:** POST `/quote/6693/permaplate-create-contract` → 302 → GET `/quote/6693/details` → 200. Flash 1 = "Esthetic protection contract generated successfully"; flash 2 = link "Invoice #946" + "($80) is created". Row now shows link "PNA-0000000022" (`/quote/6693/permaplate-contract`), the option, CA$80.00, and a PDF icon (`/quote/6693/permaplate-contract-download`, target _blank); the ⋯ menu is gone. No refusal, so no second submit was needed (1 submit in total) | ✅ | Q-009: lands on the quote page with a success flash and an invoice notice (#946, $80). Contract **PNA-0000000022**, invoice **946** |
| 4 | Open `/permaplate-contracts` and find `Esthetic NAME_C` | List loads; record VIN and cost | GET `/permaplate-contracts` → 200; heading "Esthetic protection contracts"; columns VIN · Client name · Client phone · Contract cost price · Actions; 9 rows, no paging. Row: VIN `1FAHP35NX8W239204` · "Esthetic Owner2506-006-032125" · "Cell: 5145550302 / Home: 5145550301" · "80.00$" · Download | ✅ | Dev now matches the staging-mapped columns |
| 5 `[Verification]` | Check the row and its Download | Exactly one row with VIN `1FAHP35NX8W239204`; Download opens `/quote/6693/permaplate-contract-download` and returns a PDF (HTTP 200 `application/pdf`) | Exactly 1 row for "Esthetic Owner2506-006-032125", VIN `1FAHP35NX8W239204` (contract created by submit 1). Download opened a new tab at `/quote/6693/permaplate-contract-download` → **HTTP 500**, French error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." Retried once by typing the address → HTTP 500 again. No PDF, so no client name or contract number could be read from it | ❌ | Known defect **AP-2512** (High, open — PDF download HTTP 500 on Dev); per the case, Gate C links this FAIL to AP-2512 instead of filing a new bug. The dealer cannot print or hand over the contract. Network lines: `AP2506_006-step5-network_fail.txt` |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_006-step5-PdfDownloadHttp500_fail.png` — the Download tab showing the French technical-error page
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_006-step5-ContractRowListed_fail.png` — the Esthetic protection contracts list with the row for Esthetic Owner2506-006-032125 (final state of the case)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_006-step5-network_fail.txt` — request lines: submit 302, list 200, download 500

### AP2506_007 — Submitting with the owner's last name emptied does not crash the page or lose the other values — Step Results

Quote D = **6694**, `NAME_D` = `Owner2506-007-032326` (built 03:23:26Z), `client.stage.2506007@yopmail.com`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote D | Quote with Esthetic protection; id recorded | Quote 6694; product "10 ans"; option ticked = 20 Antirouille – Rust+Sound (combo); Cost 80$ | ✅ | Built from `/vehicle/915/details?_locale=en` → Create quote |
| 2 | Open the page with the action; choose the first company; clear Last name | Loads without error; Last name empty | `/quote/6694/permaplate-create-contract` → 200 (no fallback); Financing company = "AutoCapital Canada"; Last name value = "" | ✅ | — |
| 3 | Click Generate Contract | No error page or 5xx; record refused/accepted (Q-008) | POST `/quote/6694/permaplate-create-contract` → **200** (form shown again, no redirect). **Refused.** Message "ERROR This value should not be blank." (badge "Error") with "This value should not be blank." under the Last name field; a "1" badge on the owner card. The browser's own `required` check did not stop the submit | ✅ | Q-008: refused by the server, message at the Last name field |
| 4 `[Verification]` | Inspect the page and `/permaplate-contracts` | Untouched fields keep their values; record whether a contract was created | First name "Esthetic", VIN "1FAHP35NX8W239204", City "Montréal", Postal code "H2X 1Y4", Address "200 Rue Test", Province "Québec", Email, phones 5145550301 / 5145550302, Financing company "AutoCapital Canada", summary 10 ans · 2026-11-08 · 2036-11-08 · Antirouille – Rust+Sound (combo) · CA$80.00 — all kept; Last name still empty. `/permaplate-contracts`: 9 rows, 0 rows for `Owner2506-007` or `/quote/6694/` — no contract created | ✅ | No value lost; no contract for quote D |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_007-step4-LastNameBlankRefusedValuesKept_pass.png` — the form shown again with the blank-value message under Last name and every other value kept

### AP2506_008 — Submitting with "Financing company" left on "Choose" does not return a server error — Step Results

Quote E = **6695**, `NAME_E` = `Owner2506-008-032444` (built 03:24:44Z), `client.stage.2506008@yopmail.com`.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote E | Quote with Esthetic protection; id recorded | Quote 6695; product "10 ans"; option ticked = 20 Antirouille – Rust+Sound (combo); Cost 80$ | ✅ | — |
| 2 | Open the page with the action; confirm Financing company = "Choose" | Loads without error; "Choose" shown | `/quote/6695/permaplate-create-contract` → 200 (no fallback); Financing company selected = "Choose"; nothing changed | ✅ | — |
| 3 | Click Generate Contract | Record HTTP status, address and messages | POST `/quote/6695/permaplate-create-contract` → **200**; address stays `/quote/6695/permaplate-create-contract`; message "ERROR This value should not be blank." / "This value should not be blank." at the Financing company select | ✅ | Q-003 / Q-008: a blank financing company is refused on Dev |
| 4 `[Verification]` | Inspect the page and `/permaplate-contracts` | No error page or 5xx; other values kept; record contract row, page and message position | No error page, no 5xx. First name "Esthetic", Last name "Owner2506-008-032444", VIN "1FAHP35NX8W239204", summary 10 ans · 2026-11-08 · 2036-11-08 · Antirouille – Rust+Sound (combo) · CA$80.00 — all kept; Financing company still "Choose". Message sits at the Financing company field in the right-column "Product Summary". `/permaplate-contracts`: 0 rows for `Owner2506-008` — no contract | ✅ | Same outcome AP-2459 recorded on Dev today (quotes 6689, 6691); no HTTP 500 as AP-2459 saw on staging |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_008-step4-FinancingBlankRefusedNo5xx_pass.png` — the form shown again with the blank-value message at Financing company

### AP2506_009 — Opening the contract page for a quote whose Esthetic protection contract already exists does not crash — Step Results

Quote C = 6693 (`Owner2506-006-032125`, contract PNA-0000000022 from AP2506_006).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Confirm the row for `Esthetic NAME_C` on `/permaplate-contracts` | Row exists | 1 row "Esthetic Owner2506-006-032125", Download `/quote/6693/permaplate-contract-download`; quote C = 6693 | ✅ | — |
| 2 | Open `/quote/6693/details`; inspect the Esthetic protection entry | Loads without error; record whether create-contract is still offered (Q-010) | GET `/quote/6693/details` → 200. Row = "Esthetic protection · PNA-0000000022 · Antirouille – Rust+Sound (combo) Cost: CA$80.00$ · CA$80.00"; controls = link "PNA-0000000022" → `/quote/6693/permaplate-contract` and a PDF icon → `/quote/6693/permaplate-contract-download` (target _blank). No ⋯ button and no Generate Contract link anywhere on the page | ✅ | Q-010: the create action is withdrawn once a contract exists |
| 3 | Type `/quote/6693/permaplate-create-contract`; do not submit | Record status, address and what the page shows (Q-010) | GET `/quote/6693/permaplate-create-contract` → **302** → GET `/quote/6693/details` → 200. No form, no flash message (only the "No entities found" note of the compliance-documents card) | ✅ | Q-010: silent redirect to the quote page |
| 4 `[Verification]` | Inspect steps 2–3 and `/permaplate-contracts` | No error page or 5xx; still exactly one row for `Esthetic NAME_C` | No error page or 5xx in steps 2 and 3. `/permaplate-contracts`: 9 rows in total, exactly 1 for "Esthetic Owner2506-006-032125" | ✅ | No second contract created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2506/AP2506_009-step4-StillOneContractRow_pass.png` — the Esthetic protection contracts list with still one row for quote C

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2506_002 | 🚫 | Blocked by Q-001 (Blocking, unanswered since 2026-11-01): AC 1 names the Extended Warranty row's actions but expects the Esthetic protection address. The ticket author must say which row is meant before the expected result can be written |

---

## Records left on Dev (Environment: Dev)

| Record | Id / value | Made by | State |
|---|---|---|---|
| Quote A | **6692** — client "Esthetic Owner2506-001", `client.stage.2506001@yopmail.com`, vehicle 915, Price 25000, delivered 2026-11-08, Esthetic protection 10 ans + Antirouille – Rust+Sound (combo) 80$ | AP2506_001 (reused by _003 – _005) | No contract |
| Quote C | **6693** — "Esthetic Owner2506-006-032125", `client.stage.2506006@yopmail.com`, same build, financing company AutoCapital Canada on the contract | AP2506_006 (reused by _009) | Contract **PNA-0000000022**, invoice **946** ($80) |
| Quote D | **6694** — "Esthetic Owner2506-007-032326", `client.stage.2506007@yopmail.com` | AP2506_007 | No contract (submit refused) |
| Quote E | **6695** — "Esthetic Owner2506-008-032444", `client.stage.2506008@yopmail.com` | AP2506_008 | No contract (submit refused) |

No mail was sent (the "Send a copy of the privacy policy" box was left unticked and no compliance documents were sent). Records the hand-off reserved (quotes 6588–6691, contract 2782, PNA-0000000021, invoice 945) were not opened or changed. The `cleanup` source is missing — nothing was removed.

---

## Environment Observations

- **Environment: Dev (v2dev).** Staging was never opened.
- **Gate B** — applied before execution: rule B3, execute the current cases, decided by the orchestrator's qa-reviewer (R2 round 3).
- **R2 round 3 executor notes applied.** (1) AP2506_006 step 3's repeat-submit rule was ready but not needed: the first submit with a financing company was accepted. (2) The first enabled option for vehicle 915 in page order is **20 Antirouille – Rust+Sound (combo) 80$**, then 17 Peinture – Céramique + Graphene 75$, then 18 Extra care 70$ (disabled until 17 is ticked). Every quote ticked option 20 only; AP2506_004 was judged against that. (3) AP-2512 is recorded as a fact only; Gate C re-reads it.
- **Contract page differs from AC 2's wording.** The redesigned page (2026-11-07) heads its sections "Owner identification" and "Product Summary"; AC 2 and the description say "Owner information" and "Program Summary". This is the only heading difference, and it is what fails AP2506_003.
- **Vehicle price on the contract page** is the inventory price (10,000) in both the summary line and the "Vehicle Price" field, while the quote's vehicle step price is 25,000 (AP2506_005 FAIL). `domain` already noted the summary line on 2026-11-08 (AP-2459); the expanded "Vehicle Price" field is new.
- **Quote page now counts Esthetic protection in the subtotal.** On quotes 6692–6695 the Esthetic protection row's amount is CA$80.00 and the subtotal is CA$25,080.00; AP-2516 (filed 2026-11-01) described the amount as "-". Recorded for Gate C / the AP-2516 owner — not judged by any AP-2506 case.
- **Financing company is required** on submit (blank → "This value should not be blank."), matching AP-2459's Dev observation today; the select carries the HTML `required` attribute but the label has no "*".
- **The browser's `required` check does not stop a submit with a blank Last name** — the server answers instead (POST 200 with the message).
- **New control after a contract exists:** the row shows the contract number as a link to `/quote/{id}/permaplate-contract` (not opened in this run) beside the PDF icon.
- **Language:** the run set English with `?_locale=en` on the first URL (the login page), so the language before the run was not observed; the in-memory browser session was closed at the end, which discards the setting.
- The browser tab and the Download tab opened during the run were closed.

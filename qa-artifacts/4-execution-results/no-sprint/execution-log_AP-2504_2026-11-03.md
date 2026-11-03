# Execution Log — AP-2504 Generate contract for a quote's GAP/Creditor Insurance product

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, `AP-2504 --from s4 --until s4c`)
**Environment:** Dev
**Date:** 2026-11-03
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal, from the `env` source's "Dev Environment" section)
**Login:** the shared dealer account of dealer 1380 from that section, typed only into the login form. Signed in as "Test QA staging". Credentials are not reproduced here.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-03T04:24:10Z → 2026-11-03T04:33:04Z
**Test cases:** `qa-artifacts/3-test-cases/AP2504_TestCases_001-005.md`, `AP2504_TestCases_006-010.md`, `AP2504_TestCases_011-011.md`
**env-check source:** missing in the knowledge registry. The orchestrator's environment health check passed before this run (Dev up); the login and every page used here answered normally.

| Metric | Value |
|---|:---:|
| Total test cases | 11 |
| Passed | 9 |
| Failed | 1 |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **81.8% (9 of 11)** |

**Reviewer minors applied (R2 round 1):**
- **F-1** — a Chubb refusal of test data at step 3 of AP2504_007 or AP2504_011 would have been recorded BLOCKED "Chubb refused test data: <message>". It did not happen: Chubb accepted both submissions (GAP contract AVPG000064, creditor contract AVP000171).
- **F-2** — AP2504_009 reused quote C (6564) because AP2504_007 recorded a contract (AVPG000064 on the Gap Insurance row **and** listed on `/gap-insurance-contracts`). No second GAP contract was created for it.

**Test data created on Dev (left behind — the `cleanup` source is missing):**

| Quote | Client (email) | Used by | Products / records |
|---|---|---|---|
| 6562 (quote A) | Contract Owner2504-001 (`client.stage.2504001@yopmail.com`) | 001, 003, 005, 006 | Financing (AutoCapital Canada, 25,000 / 0 / Monthly / 60 / 6.99), GAP quote 3,094.00 — no contract |
| 6563 (quote B) | Contract Owner2504-004 (`client.stage.2504004@yopmail.com`) | 004 | Financing, co-applicant Coowner Coapp2504 (DOB 1987-03-20), GAP quote 3,094.00 — no contract |
| 6564 (quote C) | Contract Owner2504-007 (`client.stage.2504007@yopmail.com`) | 007, 009 | Financing, GAP quote 3,094.00, **GAP contract AVPG000064** (real Chubb contract) |
| 6565 (quote D) | Contract Owner2504-008 (`client.stage.2504008@yopmail.com`) | 008 | Financing, GAP quote 3,094.00 — no contract (the emptied last name was refused) |
| 6566 (quote E) | Contract Owner2504-010 (`client.stage.2504010@yopmail.com`) | 010, 011 | Financing, creditor quote 18.58$/m (PM30, Decreasing 60, Borrower), **creditor contract AVP000171** (real Chubb contract) |

No invoice was created by either contract (the newest invoice on `/invoice` is still 944, made by AP-2503). Vehicle 915 was only used as the source of each quote and never edited. No record of another ticket was touched (AutoShield contracts 2697/2698, AP-2498 / AP-2494 records, quotes 6276, 6533–6544, 6557–6561 untouched).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2504_001 | GAP "Generate Contract" opens the GAP contract page in the same tab, not a pop-up | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_001-step5-GapContractFullPage_pass.png` | Same tab, full page "GAP insurance", HTTP 200 by click and by typed address |
| AP2504_002 | "Generate Contract" from the Extended Warranty row opens the GAP page (AC 1 as written) | High | 🚫 | 0 | 0 | — | Shipped BLOCKED: Q-001 unanswered (comment 19460) |
| AP2504_003 | GAP page layout: vehicle, owner, financing left; Program Summary and button right | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_003-step3-LeftColumnSections_pass.png` | Three sections left, Program Summary + button right, side by side |
| AP2504_004 | Co-applicant on the quote adds a pre-filled "Co-owner information" section | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_004-step5-CoOwnerPrefilled_pass.png` | Co-owner section with all entered values, DOB 03/20/1987 |
| AP2504_005 | GAP page pre-filled with the quote's vehicle and owner values | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_005-step4-OwnerPrefilled_pass.png` | Every vehicle and owner field matches; all are editable (Q-006) |
| AP2504_006 | GAP page shows the financing values and none can be changed | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step3-FinancingRawCodesShown_fail.png` | Read-only holds; frequency shown as raw code "FREQUENCY_MONTHLY", not "Monthly" |
| AP2504_007 | Submitting the GAP page creates the GAP contract | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_007-step4-GapRowContractNumber_pass.png` | Contract AVPG000064 on quote 6564; PDF HTTP 500, no invoice (recorded) |
| AP2504_008 | Submitting with the owner's last name emptied does not end on an error page | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_008-step3-LastNameBlankError_pass.png` | Server message "This value should not be blank." under Last name; nothing created |
| AP2504_009 | Quote with an existing GAP contract: row and address end on no error page | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_009-step3-RedirectFlashCreditorAlreadyCreated_pass.png` | Redirect to details; flash names the wrong product ("Creditor insurance already created") |
| AP2504_010 | Creditors "Generate Contract" opens the creditor contract page in the same tab | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_010-step4-CreditorContractFullPage_pass.png` | Same tab, `/quote/6566/insurance/create-contract`, full page "Creditor Insurance" |
| AP2504_011 | Submitting the creditor page creates the creditor contract | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_011-step4-CreditorRowContractNumber_pass.png` | Contract AVP000171 on quote 6566; PDF HTTP 500 as before the change |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2504_001 — Clicking "Generate Contract" on the GAP insurance row opens the GAP contract page in the same tab, not a pop-up — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in on Dev, build quote A from vehicle 915 (last name `Owner2504-001`) and the shared financing on `/quote/{id}/financing` | Quote page shows heading `#{id} - Contract Owner2504-001 …` and the financing | URL = `/quote/6562/details`; heading = "#6562 - Contract Owner2504-001 1FAHP35NX8W239204"; flash "Financing saved"; financing "Financing 60 months · AutoCapital Canada · Financed amount 25,000.00$ · Residual 0.00$" | ✅ | Quote A = 6562; financing company = first listed, AutoCapital Canada |
| 2 `[Pre-Condition]` | Open `/quote/6562/gap-insurance?_locale=en` as a page, TGGAP / English / No / Gap Term 60 → Get Quote | Flash "GAP insurance quote saved successfully"; Gap Insurance row shows a premium and a "⋯" menu, no contract number | Flash = "GAP insurance quote saved successfully"; Gap Insurance row amount = CA$3,094.00; "⋯" dropdown present; no contract number | ✅ | Page route used, no add modal — AP-2526/2527/2528 not met |
| 3 | Note the tab count; Gap Insurance "⋯" → "Generate Contract" | Same tab (count unchanged) navigates to `/quote/{id}/insurance/create-contract/gap`, no error | Tabs before = 1; link `href=/quote/6562/insurance/create-contract/gap`, `target` none, no modal toggle; after click URL = `/quote/6562/insurance/create-contract/gap`, tabs after = 1, page heading "GAP insurance" | ✅ | Menu items: Edit · Generate Contract · Delete |
| 4 | Open `/quote/6562/details`, then type the GAP address and press Enter | The same GAP page loads directly, no error or HTTP 5xx | Navigation response status = 200; URL = `/quote/6562/insurance/create-contract/gap`; heading = "GAP insurance" | ✅ | Direct address works |
| 5 `[Verification]` | Inspect the page reached in steps 3 and 4 | Address exact; full page, no modal; Summary of products not visible; "Generate Contract" button present; record heading and differences from the Esthetic page (Q-002) | URL = `/quote/6562/insurance/create-contract/gap`; open modals = 0; "Summary of products" visible = false; button "Generate Contract" count = 1 (with a PDF icon); H1 = "GAP insurance"; "Back" link → `/quote/6562/details` | ✅ | Q-002 record: heading is "GAP insurance" (Esthetic page: "Esthetic protection Contract"); no Financing company picker, no embedded PDF preview; Program Summary shows the Chubb quote table |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_001-step5-GapContractFullPage_pass.png` — the GAP contract page as a full page with the two-column card and the Generate Contract button

### AP2504_002 — "Generate Contract" chosen from the Extended Warranty row opens the GAP contract page (criterion 1 as written) — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build a quote with financing | — | Not run | 🚫 | Blocked: Q-001 (Blocking) is unanswered — asked on AP-2504 in comment 19460; no reply as of 2026-11-03T04:24Z |
| 2 `[Pre-Condition]` | Add an extended warranty and a GAP quote | — | Not run | 🚫 | Same reason |
| 3 | Extended warranty "⋯" → Generate Contract | Not known — Q-001 | Not run | 🚫 | Same reason |
| 4 `[Verification]` | Inspect the page reached | Not known — Q-001 | Not run | 🚫 | The case runs once the author says which row criterion 1 means |

**Screenshots:** none — the case was not attempted.

### AP2504_003 — The GAP contract page shows vehicle, owner and financing on the left and Program Summary with the button on the right — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A from AP2504_001 if its Gap row still offers Generate Contract | A quote with financing and GAP quote, no GAP contract, no co-applicant | Quote 6562: Gap row "⋯" still offers Generate Contract (not submitted); Co-applicant section = "No applicant" | ✅ | Reused quote A as the case allows |
| 2 | Open `/quote/6562/insurance/create-contract/gap` | Loads without error | Response status = 200; heading "GAP insurance" | ✅ | — |
| 3 `[Verification]` | Inspect the left part of the card at 1280 × 800 | "Vehicle identification", "Owner information", "Financing information" in the left column; record Co-owner section (Q-004) and other sections | Left column (`col-md-7`, x = 100): H4 "Vehicle identification" (y 173), H4 "Owner information" (y 487), H4 "Financing information" (y 1121). No "Co-owner information" section at all; no other section | ✅ | Q-004 record: without a co-applicant the Co-owner section is absent, not shown empty |
| 4 `[Verification]` | Inspect the right part of the card | "Program Summary" and a "Generate Contract" button in the right column, side by side with the left column; record each Program Summary line (Q-003) and differences (Q-002) | Right column (x = 768): H3 "Program Summary" at y 157 (level with "Vehicle identification" at y 173), button "Generate Contract" at y 404. Lines: Form: AVPG · Rate table: TGGAP · Language: English · Tax exempt: No · table Coverage Type Gap / Coverage BORROWER / Term Months 60 / Total Premium 3,094.00$ / Tax 463.33$ / Total Premium 3,557.33$ | ✅ | Left without submitting. Q-002: no start/end date or total line like the Esthetic page |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_003-step3-LeftColumnSections_pass.png` — full page: three left-hand sections, no co-owner section
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_003-step4-ProgramSummaryRightColumn_pass.png` — Program Summary and the Generate Contract button beside the vehicle section

### AP2504_004 — With a co-applicant on the quote, the GAP contract page adds a pre-filled "Co-owner information" section on the left — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote B (last name `Owner2504-004`) with the shared financing | Financing and a co-applicant section ("No applicant") shown | URL = `/quote/6563/details`; heading "#6563 - Contract Owner2504-004 1FAHP35NX8W239204"; flash "Financing saved"; Financing card shows "Co-applicant" / "No applicant" / link "Add co-applicant" | ✅ | Quote B = 6563 |
| 2 `[Pre-Condition]` | Use the co-applicant add control and enter the co-applicant | Section names `Coowner Coapp2504` | Control = link "Add co-applicant" → `/quote/6563/financing/co-applicant`, opens a **modal** with First name*, Last name*, Date of birth*, Address, Address2, City, Province, Postal code, Phone, Save (no email field). Entered Coowner / Coapp2504 / 1987-03-20 / 200 Rue Test / Montréal / Québec / H2X 1Y4 / 5145550203 → flash "Co-applicant saved"; section = "Coowner Coapp2504 Date Of Birth : Thursday, March 19, 1987 · 200 Rue Test Montréal Québec H2X 1Y4" | ✅ | Q-012 answered by observation. Side note: the quote page shows the co-applicant's date of birth one day early (19 instead of 20) — outside this ticket, recorded under Environment Observations |
| 3 `[Pre-Condition]` | Save the shared GAP quote on `/quote/6563/gap-insurance` | Flash "GAP insurance quote saved successfully"; "⋯" menu | Flash = "GAP insurance quote saved successfully"; Gap row = CA$3,094.00 with "⋯" | ✅ | — |
| 4 | Open `/quote/6563/insurance/create-contract/gap` | Loads without error | Response status = 200 | ✅ | — |
| 5 `[Verification]` | Inspect the left column | "Co-owner information" in the left column, pre-filled with the co-applicant; record fields and editability (Q-006) | Left column headings: Vehicle identification (y 173), Owner information (y 487), **Co-owner information** (y 1121), Financing information (y 1596). Co-owner fields: First name* = "Coowner", Last name* = "Coapp2504", Date of birth* = 1987-03-20 (shown 03/20/1987), Phone = "5145550203", Address = "200 Rue Test", Address 2 = "" (none entered), City = "Montréal", Province = "Québec", Postal code = "H2X 1Y4" | ✅ | Q-006 record: every co-owner field is editable (none read-only or disabled); first name, last name and DOB are required. Left without submitting |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_004-step5-CoOwnerPrefilled_pass.png` — the Co-owner information section filled with the co-applicant's values, above Financing information

### AP2504_005 — The GAP contract page is pre-filled with the quote's vehicle and owner values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A from AP2504_001 if its Gap row still offers Generate Contract | Quote with a GAP quote and no GAP contract | Quote 6562, client last name `Owner2504-001`, Gap row still has "⋯" → Generate Contract | ✅ | Reused quote A |
| 2 | Open `/quote/6562/insurance/create-contract/gap` | Loads without error | Response status = 200 | ✅ | — |
| 3 `[Verification]` | Read "Vehicle identification" | VIN `1FAHP35NX8W239204`; make Ford, model Focus, year 2008, mileage 5000; record fields and editability | VIN = "1FAHP35NX8W239204"; Mileage = "5000"; Year* = "2008"; Make* (select) = "Ford"; Model* (select) = "Focus"; Purchase price = "10000" (value added by the quote) | ✅ | Q-006: all six fields editable; no delivery date field |
| 4 `[Verification]` | Read "Owner information" | Owner fields pre-filled with the client's values | First name* = "Contract"; Last name* = "Owner2504-001"; Date of birth* = 1985-06-15 (from the financing applicant); Address* = "200 Rue Test"; Address 2 = ""; City* = "Montréal"; Province* = "Québec"; Postal code* = "H2X 1Y4"; Email* = "client.stage.2504001@yopmail.com"; Home phone* = "5145550201"; Work phone* = "5145550202" | ✅ | Q-006: every owner field editable, none read-only. Left without submitting |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_005-step3-VehiclePrefilled_pass.png` — Vehicle identification pre-filled from vehicle 915
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_005-step4-OwnerPrefilled_pass.png` — Owner information pre-filled from the client

### AP2504_006 — The GAP contract page shows the quote's financing values and none of them can be changed — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A from AP2504_001 if its Gap row still offers Generate Contract | Quote with financing and GAP quote, no GAP contract | Quote 6562, financing company AutoCapital Canada, Gap row still offers Generate Contract | ✅ | Reused quote A |
| 2 | Open `/quote/6562/insurance/create-contract/gap` | Loads without error | Response status = 200 | ✅ | — |
| 3 `[Verification]` | Read "Financing information" | Every value matches: 25000, residual 0, frequency "Monthly", term 60, rate 6.99, company and its address; none empty or different; record fields (Q-005) | Financing company = "AutoCapital Canada"; Creditor address = "200-11, Church Street / Toronto, Ontario M5E 1W1"; Net amount financed including RDPRM = "25,000.00$"; **Payment frequency = "FREQUENCY_MONTHLY"**; Due type = "No"; **Financing type = "TYPE_FINANCING"**; Loan term = "60 months"; Residual value = "0.00$"; Interest rate = "6.9900%" | ❌ | The frequency (and the financing type) are printed as raw internal codes instead of "Monthly" / "Financing". The quote page shows the same financing as "Type : Financing" and "494.91$ Monthly". Same codes in French and on the creditor page. A dealer reads a code instead of the loan's payment frequency on the page that produces the insurance contract. Q-005 fields recorded |
| 4 | Click into each financing value and type | No field accepts a change; each still shows the value of step 3 | The section is a definition list (`dl`/`dd`) with 0 input, select, textarea, button or contenteditable elements. Clicked "25,000.00$" and "FREQUENCY_MONTHLY" and pressed "9" on each: focus stayed on the page body, texts unchanged | ✅ | Read-only holds: the values are plain text |
| 5 `[Verification]` | Inspect the section without submitting; open `/quote/6562/details` | Values as in step 3; quote financing still 25,000 / 60 months | Section text identical to step 3; quote page: "Financing 60 months · AutoCapital Canada · Type : Financing · Financed amount : 25,000.00$ · Term : 60 · Interest rate : 6.9900% · Payment amount : 494.91$ Monthly" | ✅ | Nothing submitted |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step3-FinancingRawCodesShown_fail.png` — Financing information showing "FREQUENCY_MONTHLY" and "TYPE_FINANCING"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step3-FinancingRawCodes_network_fail.txt` — page addresses and statuses where the raw codes were seen (EN, FR, creditor page)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step5-FinancingUnchangedAfterTyping_pass.png` — the section unchanged after the typing attempts

### AP2504_007 — Clicking "Generate Contract" on the GAP page with the pre-filled values creates the GAP contract for the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote C (last name `Owner2504-007`), shared financing and GAP quote, all today | Gap row with premium and "⋯", no contract number | Quote 6564; flashes "Financing saved", "GAP insurance quote saved successfully"; Gap row = CA$3,094.00 with "⋯" | ✅ | Quote C = 6564, premium 3,094.00 |
| 2 | Gap "⋯" → Generate Contract; fill only required empty fields | Loads without error; filled fields recorded | URL = `/quote/6564/insurance/create-contract/gap`, status 200; required fields left empty = none; fields filled = none | ✅ | Nothing typed |
| 3 | Click "Generate Contract", wait up to 30 s | No error page, no 5xx, no "HTTP" alert; record landing address and flash (Q-008) | POST `/quote/6564/insurance/create-contract/gap` → 302 → `/quote/6564/details` (200) after 6.4 s; flash = "Chubb insurance contract created successfully"; no "HTTP" banner | ✅ | Q-008 record: same landing and flash as the creditor baseline. F-1 not triggered (Chubb accepted the data) |
| 4 `[Verification]` | Read the Gap Insurance row; open `/gap-insurance-contracts` | A GAP contract exists for quote C | Gap row = "Gap Insurance · AVPG000064 · CA$3,094.00", a PDF link (`/quote/6564/gap/insurance/contract-pdf`, new tab) and the expand chevron; no "⋯" and no Generate Contract link. `/gap-insurance-contracts` (200, "Gap insurance contracts"): one row "AVPG000064 · Contract Owner2504-007 · 494.91 $ / 60 months · Form AVPG, TGGAP, English, Tax exempt No · Gap BORROWER 60 3,094.00$ 463.33$ 3,557.33$ · Download" | ✅ | Contract number AVPG000064 — the first GAP contract on Dev |
| 5 `[Verification]` | Record any invoice and open the GAP PDF link | Record-only (Q-008, Q-009): invoice id/amount; PDF address and response | No invoice: no "Invoice #N is created" message, and `/invoice` still starts at 944 (AP-2503). PDF `GET /quote/6564/gap/insurance/contract-pdf` → **HTTP 500**, `text/html`, 13,329 bytes (the technical-error page), 0 PDF pages | ✅ | Record-only. Compare at Gate C with the creditor PDF's HTTP 500 (quote 6480 before this change, quote 6566 in AP2504_011) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_007-step4-GapRowContractNumber_pass.png` — Gap Insurance row with contract AVPG000064 and the PDF icon
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_007-step4-GapContractsList_pass.png` — `/gap-insurance-contracts` listing AVPG000064 for Contract Owner2504-007
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_007-step5-GapPdfHttp500Recorded_pass.png` — the GAP PDF address answering with the error page
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_PdfResponses_network.txt` — method, address and status of the submit and PDF requests

### AP2504_008 — Submitting the GAP page with the owner's last name emptied does not end on an error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote D (last name `Owner2504-008`), shared financing and GAP quote | Gap row shows "⋯" | Quote 6565; flashes "Financing saved", "GAP insurance quote saved successfully"; Gap row CA$3,094.00 with "⋯" | ✅ | Quote D = 6565 |
| 2 | Open the GAP page; clear "Owner information" → Last name | Page loads; Last name empty | Status 200; field "Last name*" (`ownerLastName`) value = "" after clearing | ✅ | The field is editable (Q-006) |
| 3 | Click "Generate Contract", wait | No error page, no 5xx; record the response (Q-007) | The form has `novalidate`, so the browser did not stop it; POST sent to the same address; page re-rendered at `/quote/6565/insurance/create-contract/gap` with the Last name field outlined red (`is-invalid`) and the message "ERROR This value should not be blank." directly under it (y ≈ 570); no banner, no redirect | ✅ | Q-007 record: server-side message under the field |
| 4 `[Verification]` | Open `/quote/6565/details`; read Gap row and client name | Record contract/no contract and client last name; FAIL only on a value nobody entered or an error page | Gap row = "Gap Insurance · CA$3,094.00" with "⋯" → Generate Contract still offered (no contract); heading "#6565 - Contract Owner2504-008 1FAHP35NX8W239204" — client last name unchanged | ✅ | No second GAP contract created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_008-step3-LastNameBlankError_pass.png` — "This value should not be blank." under the emptied Last name
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_008-step4-NoContractClientUnchanged_pass.png` — quote 6565 with no GAP contract and the client name unchanged

### AP2504_009 — On a quote whose GAP contract already exists, the GAP row and the GAP page address do not end on an error page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote C from AP2504_007 if its Gap row shows a contract number | Contract number recorded | Quote 6564, Gap row contract number = AVPG000064 | ✅ | F-2 applied: reused quote C, no new contract |
| 2 `[Verification]` | Inspect the Gap row on `/quote/6564/details` | Record whether "⋯" / Generate Contract is still offered (Q-010) | Row = "Gap Insurance · AVPG000064 · CA$3,094.00", PDF icon link, chevron; "⋯" dropdowns in the row = 0; no Generate Contract link on the page | ✅ | Q-010 record: the action is withdrawn once the contract exists |
| 3 | Type `/quote/6564/insurance/create-contract/gap` and press Enter | No error, no 5xx; record what is shown (Q-010) | Redirect (1 hop) to `/quote/6564/details` (200), no contract form; red flash "**Creditor insurance already created**" | ✅ | Q-010 record: redirect with a message. The message names the wrong product — this is a GAP contract and the quote has no creditor insurance. Not judged by this case (record-only); listed for Gate C |
| 4 `[Verification]` | Open `/quote/6564/details` again | Same contract number, no second number | Gap row = "AVPG000064" — unchanged, single number | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_009-step2-GapRowNoGenerateAction_pass.png` — Gap row with AVPG000064 and no menu
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_009-step3-RedirectFlashCreditorAlreadyCreated_pass.png` — the redirect's flash "Creditor insurance already created" above quote 6564
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_009-step4-SameContractNumber_pass.png` — the same contract number afterwards

### AP2504_010 — Clicking "Generate Contract" on the creditors insurance row opens the creditor contract page in the same tab, not a pop-up — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build quote E (last name `Owner2504-010`) with the shared financing | Financing shown | Quote 6566; flash "Financing saved" | ✅ | Quote E = 6566 |
| 2 `[Pre-Condition]` | Open `/quote/6566/insurance?_locale=en` as a page; English / No / PM30 / Decreasing / 60 / Borrower → Get Quote | Flash "Chubb insurance quote saved successfully"; row shows premium and "⋯" | Flash = "Chubb insurance quote saved successfully"; Creditors row = "CA$18.58 /m" with "⋯" | ✅ | Page route, no add modal |
| 3 | Note tabs; Creditors "⋯" → Generate Contract | Same tab to `/quote/{id}/insurance/create-contract`, no error | Tabs before = 1; link `href=/quote/6566/insurance/create-contract`, no target; after click URL = `/quote/6566/insurance/create-contract`, status 200, tabs = 1 | ✅ | Menu: Edit · Generate Contract · Delete |
| 4 `[Verification]` | Inspect the page | Exact address without `/gap`; full page, no modal, quote page not behind it; "Generate Contract" button; record sections, pre-fill, financing editability vs GAP page (Q-011) | URL = `/quote/6566/insurance/create-contract`; modals = 0; "Summary of products" not on the page; H1 = "Creditor Insurance"; button "Generate Contract" present. Left: Vehicle identification, Owner information, Financing information (same fields and pre-fill as the GAP page, last name `Owner2504-010`). Right: Program Summary — Form GC6201MQ, Rate table PM30, English, Tax exempt No, Life Decreasing BORROWER 60 18.58$ + 1.67$ = 20.25$, Equivalent Single Premium 891.31$, Commission (30%) 267.39$ | ✅ | Q-011 record: same two-column layout as GAP; financing is plain text (read-only) and shows the same raw codes FREQUENCY_MONTHLY / TYPE_FINANCING. Left without submitting |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_010-step4-CreditorContractFullPage_pass.png` — the creditor contract page as a full page

### AP2504_011 — Clicking "Generate Contract" on the creditor contract page creates the creditor insurance contract for the quote — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote E if its Creditors row still offers Generate Contract and the quote was saved today | Creditor quote, no contract; id and premium recorded | Quote 6566, creditor quote saved 2026-11-03, premium 18.58$/m, "⋯" still offers Generate Contract | ✅ | Reused quote E |
| 2 | Creditors "⋯" → Generate Contract; fill only required empty fields | Page loads in the same tab | Reached in AP2504_010 step 3 (same tab, 200); required fields left empty = none; nothing typed | ✅ | — |
| 3 | Click "Generate Contract", wait up to 30 s | No error, no 5xx, no "HTTP" alert; record landing and flash | POST `/quote/6566/insurance/create-contract` → 302 → `/quote/6566/details` after 6.0 s; flash = "Chubb insurance contract created successfully" | ✅ | Matches the baseline. F-1 not triggered |
| 4 `[Verification]` | Read the Creditors row; open `/creditor-insurance-contracts` | Contract number on the row, or listed for the client | Row = "Creditors insurance · AVP000171 · CA$18.58 /m" with PDF link `/quote/6566/chubb/insurance/contract-pdf` (new tab); no Generate Contract link. `/creditor-insurance-contracts` (200) first row "AVP000171 · Contract Owner2504-010 · 494.91 $ / 60 months · GC6201MQ PM30 …" | ✅ | Contract AVP000171 |
| 5 `[Verification]` | Record invoice; open the PDF link | Record-only (Q-008, Q-009) | No invoice ("Invoice #N" message absent; `/invoice` still starts at 944). PDF `GET /quote/6566/chubb/insurance/contract-pdf` → **HTTP 500**, `text/html`, 13,335 bytes | ✅ | Same HTTP 500 as quote 6480 on 2026-11-02, before this change |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_011-step4-CreditorRowContractNumber_pass.png` — Creditors insurance row with contract AVP000171
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_011-step5-CreditorPdfHttp500Recorded_pass.png` — the creditor PDF address answering with the error page
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_PdfResponses_network.txt` — method, address and status of the submit and PDF requests

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2504_002 | 🚫 | Shipped BLOCKED by Q-001 (Blocking, REQ-001): acceptance criterion 1 starts from the Extended Warranty row but expects the GAP page. Asked on AP-2504 (comment 19460); no answer yet. The author must say which row is meant before this case can run |

---

## Environment Observations

- **Raw codes in the financing section (both new pages).** "Payment frequency" shows `FREQUENCY_MONTHLY` and "Financing type" shows `TYPE_FINANCING` on `/quote/{id}/insurance/create-contract/gap` and on `/quote/{id}/insurance/create-contract`, in English and in French. In French the labels "Creditor address", "Due type", "Financing type", "Loan term" and "Residual value" also stay in English. The quote page shows the same financing translated ("Type : Financing", "Monthly"). Failed in AP2504_006 step 3.
- **Wrong product in the "already created" message.** Opening the GAP contract address on a quote whose GAP contract exists redirects to the quote with "Creditor insurance already created" (quote 6564, which has no creditor insurance). Recorded in AP2504_009 (record-only, Q-010).
- **Contract PDFs answer HTTP 500 on Dev.** GAP `/quote/6564/gap/insurance/contract-pdf` and creditor `/quote/6566/chubb/insurance/contract-pdf` both return the technical-error page. The creditor PDF already did this before AP-2504 (quote 6480, 2026-11-02); the GAP PDF has no earlier baseline because no GAP contract existed on Dev.
- **No invoice for either Chubb contract** (record-only, Q-008/Q-009). The Permaplate and warranty contracts on Dev do create one.
- **Co-applicant date of birth shown one day early on the quote page.** Entered 1987-03-20 in the "Add co-applicant" modal; the quote page reads "Thursday, March 19, 1987", while the GAP contract page pre-fills 1987-03-20 correctly. Outside AP-2504's scope; noted for the QA lead.
- Delivery date of quotes made from vehicle 915 reads "Nov 2, 2026" on the quote page (run started 2026-11-03 04:24 UTC, i.e. 2026-11-02 evening in Québec) — not a defect.
- The orchestrator's health check passed; every page used answered within about 6 s, and the two Chubb submissions took 6.4 s and 6.0 s.

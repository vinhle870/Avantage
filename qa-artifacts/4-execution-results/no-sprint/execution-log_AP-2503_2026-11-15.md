# Execution Log — AP-2503: Generate contract for a quote's extended warranty

**Environment: Dev (v2dev)** — `execution_env` = Dev in the registry's QA orchestrator selection; v2staging was not opened.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker for stlc-ticket-pipeline, `AP-2503 --from execute --until correct-cases`, qa-agent batch 2026-11-15, plan rule P4)
**Date:** 2026-11-15 — 2026-11-15T09:09:41Z → 2026-11-15T09:24:43Z
**RUN_STAMP:** `111509` (run start 2026-11-15T09:09Z, UTC `MMDDHH`) · **RUN_DATE:** 2026-11-15 (RUN_DATE + 7 = 2026-11-22; RUN_DATE − 30 = 2026-10-16)
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal, dealer "Test QA staging" = dealer 1380, shared dealer account from the `env` source, Dev Environment section; the password is not written here)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, UI language English (`?_locale=en` on the login page)
**Run folder:** no-sprint
**Test cases:** `AP2503_TestCases_001-005.md`, `AP2503_TestCases_006-010.md` (revised 2026-11-15)
**Gate B:** Execute the current cases — rule B3 — by reviewer (R2 round 1); unpromoted P1–P10 not run.
**Environment check:** the `env-check` source is missing; the caller's environment health check had passed before this run.
**Rework (R3 round 1, applied 2026-11-15T09:36:09Z, no browser re-run):** AP2503_002 step 3 re-judged FAIL → PASS from the recorded actual result and the existing screenshot (superseded by delivered Story AP-2559, batch decision 2); F4 narrowed to the missing contract preview and "Open PDF in new tab" link; minor findings F-2, F-3 recorded under Environment Observations; F-5: the capture times written inside the two network files were corrected (see Environment Observations) — the run end 09:24:43Z stands. Summary counts unchanged.

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 5 |
| Failed | 5 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **50% (5 of 10)** |

### The generate-contract page was redesigned on Dev after 2026-11-02

The page at `/quote/{id}/warranty/generate-contract` is no longer the page the 2026-11-02 run
mapped and the 2026-11-15 cases describe. It is now the standardised "check out" page of later
stories that are in "Deploy to staging" (deployed on Dev):

| What changed | Later story that defines it (quoted from its acceptance criteria) |
|---|---|
| "Vehicle identification" is a collapsed card: a summary line (Make · Model · Year · VIN · price) and, behind a chevron, the vehicle values as **read-only text**; only the **VIN** is an input | **AP-2544** — "All inputs are read-only except for the VIN input"; **AP-2550** (In Progress) — "The VIN is always required and can be updated when changed" |
| "Owner information" is now headed "Owner identification" (same fields as the quote client form) and a successful submit **updates the quote's client** | **AP-2545** — "WHEN a dealer generates a contract and is succesfull. THEN it update the quote's client information" |
| "Financing information" is a **resume line** of the quote financing with the details collapsed; it is **absent** on a quote without financing, and when present it sits in the **right** column above the summary | **AP-2546** — "the “Financing information” show a resume of the financing contract and the detailed content is collapsed"; **AP-2559** — "Given the dealer is checking-out a quote without a GAP/Creditor insurance When the checkout page is shown Then the “Financing information” card is not visible" |
| "Program Summary" is now headed **"Product Summary"**: Program Term, Program, Term, Start Date (input), End date, a required **Financing company** picker, Sale Price (text, not editable), Cost, Commission | **AP-2544** names the "Product Summary"; **AP-2550** — "For each program, all specific field for the contract are shown in the “Product summary”" |
| Validation errors come back from the server and show inside the card with a red count badge | **AP-2559 / AP-2560** — "the error message will be shown in the client card" |
| **No contract preview** and **no "Open PDF in new tab" link** on the page (the draft PDF `/quote/{id}/warranty/pdf` still answers HTTP 200) | none found |

Knowledge lookup (stlc-requirements-analyst Step 3c, Story/Task, any status): `Product Summary` → AP-2544, AP-2550 ·
`Owner identification` → none new · `generate contract page` → AP-2544, AP-2545, AP-2546, AP-2551, AP-2559, AP-2562 ·
`checkout` (created ≥ 2026-11-03) → AP-2550, AP-2551, AP-2559, AP-2560, AP-2561, AP-2562 · `sale price checkout`,
`checkout start date`, `checkout PDF preview`, `checkout financing company` → none.

**How the steps were judged.** An expected result that quotes an AP-2503 acceptance criterion was judged
strictly (AC wins — the batch decision for AP-2530/2531/2532). An expected result that came only from a
2026-11-15 answer to Q-001–Q-011 (which accepted the 2026-11-02 behaviour) and that a later story above now
defines was judged against that story's quoted sentence; where no story defines it, the actual result was
recorded as accepted. Each such step names the story or says "Knowledge lookup … none — accepted".
**Gate C should confirm this reading** — see the Notes for Gate C at the end.

### Faults behind the five failures

| # | What the build does | Requirement it breaks | Case · step | Known bug |
|---|---|---|---|---|
| F1 | The "Product Summary" shows no vehicle delivery date; the delivery date is only a read-only line in the collapsed "Vehicle identification" card | AC 2 "The “Program Summary” shows: Vehicle delivery date · …" | AP2503_003 · 3 | **AP-2530** (same defect) |
| F2 | The VIN is an editable input; typing `AP2503TC099999999` was accepted. The delivery date is now read-only text (that half of AP-2531 no longer occurs) | AC 3 "vehicle identifiers and delivery date are read-only" — note AP-2544 / AP-2550 now say the VIN is editable | AP2503_005 · 2, 5 | **AP-2531** (same defect, VIN only) |
| F3 | On a quote without financing, "Generate Contract" is refused: the server answers "ERROR This value should not be blank." on the required "Financing company" picker of the Product Summary. It went through only after picking AutoCapital Canada | AC 1 / AC 4 — a quote needs only a vehicle and an extended warranty; "contract is created following the current process" | AP2503_007 · 3 | **AP-2532** (same defect; the six company fields are now one picker) |
| F4 | No contract preview and no "Open PDF in new tab" link in the right column (AC 1, AC 2) | AC 1 "the quote PDF preview is shown"; AC 2 "“Program Summary”, a preview of the contract and a submit button are in the right column" — no delivered Story removes the preview (the absent Financing information card on quote 6703 is defined by AP-2559 and is not part of F4) | AP2503_002 · 4 | none — new |
| F5 | Submitting with the warranty start date cleared returns **HTTP 500** ("Erreur — Désolé, l'application éprouve des difficultés techniques"); reproduced twice; no contract is created | Objective fault (error page) | AP2503_008 · 4 | none — new |

What works: the action opens its own page at the unchanged address (HTTP 200 typed directly, no modal);
owner, vehicle and financing values are pre-filled from the quote; the start date is editable and an
earlier date (2026-10-16) or later date (2026-11-22) becomes the contract's start date; submitting a
financed quote creates the contract and an invoice equal to the warranty cost ($456.00); the ⋯ menu is
replaced by the contract link and a PDF icon, and "Download all documents" appears.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2503_001 | "Generate Contract" opens its own page at the unchanged address, not a pop-up | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_001-step5-FullPageProductSummary_pass.png` | Quote A 6703; full page, HTTP 200, no modal; summary now headed "Product Summary" (AP-2544) |
| AP2503_002 | Left: vehicle, owner, financing; right: summary, preview, button | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step4-RightColumnNoPdfPreview_fail.png` | F4: no contract preview or "Open PDF in new tab" link (new); step 3 no Financing card = AP-2559 (PASS) |
| AP2503_003 | Program Summary shows delivery date, editable start date and sale price | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step3-ProductSummaryNoDeliveryDate_fail.png` | F1 = AP-2530: no delivery date in Product Summary |
| AP2503_004 | Page pre-filled with the quote's client, vehicle and financing values | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_004-step5-FinancingResumeAndCreditorAddress_pass.png` | Quote B 6704; every shown value matches the quote |
| AP2503_005 | VIN and delivery date cannot be changed; owner fields and start date can | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step2-VinAcceptsTypingDeliveryDateText_fail.png` | F2 = AP-2531 (VIN only now); delivery date is read-only |
| AP2503_006 | Submitting with pre-filled values creates the contract and invoice | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_006-step5-ContractAPOP01-848Listed_pass.png` | Contract APOP01-848, invoice #952 ($456.00 = cost) |
| AP2503_007 | No-financing quote submits; edited start date and owner reach the contract | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-FinancingCompanyBlankRefused_fail.png` | F3 = AP-2532; after picking a company APOP01-849 starts 2026-11-22 |
| AP2503_008 | Emptied last name refused, values kept, no contract | Medium | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-EmptyStartDateHttp500_fail.png` | F5 (new): empty start date → HTTP 500; last name refusal OK |
| AP2503_009 | Start date 30 days before delivery becomes the contract's start date | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_009-step5-ContractPdfStart20261016_pass.png` | APOP01-850 starts 2026-10-16; sale price not editable (accepted) |
| AP2503_010 | Page opens for a no-financing quote, pre-fills owner and vehicle | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_010-step3-NoFinancingCardPickerInSummary_pass.png` | Quote A 6703; no Financing card (AP-2559), picker at "Choose" |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data created on Dev (left behind)

Every built quote has its own inventory vehicle (`/vehicle/new/edit/PASSENGER`: Toyota Corolla 2023, Vehicle
Price 25000, Kilometers 12000, Condition new, Fuel type GASOLINE, Transmission Automatic, Cylinders `4`, Engine
size `1.8` Litre, Designation Particular), its own client (First name Contract, 200 Rue Test, Montréal, Québec,
H2X 1Y4, phones 5145550201 / 5145550202, "I agree to the policy" ticked) and a vehicle step with Delivered at
2026-11-15 (Dev pre-filled 2026-11-15) and Price 25000. Every extended warranty is the first program and first
term: **"Garantie de base AP" → option 1 → 100m/20000km, Sale price 2500** (row: Cost CA$456.00, Commission
CA$2,044.00, Start date Nov 15, 2026). The direct `/quote/{id}/warranty/edit` page listed 12 programs with
empty names, so the add modal from the "+" on the Extended warranty row was used (it named them). No VIN was
refused as a duplicate. Vehicle 915 and quote 6276 were not used; no record of the 2026-11-02 run or of
AP-1948 was touched. Nothing was deleted (the `cleanup` source is missing). **Contracts cannot be deleted.**

| Built for | Vehicle id (VIN) | Quote | Client email | Contract / invoice left behind |
|---|---|---|---|---|
| AP2503_001 (quote A; reused by 002, 003, 010) | 1231 (AP2503TC001111509) | 6703 | client.stage.2503001.111509@yopmail.com | none — warranty saved, never submitted |
| AP2503_004 (quote B; reused by 005, submitted by 006) | 1232 (AP2503TC004111509) | 6704 | client.stage.2503004.111509@yopmail.com | financing AutoCapital Canada 25,000 / 0 / Monthly / 60 / 6.99 → 494.91$; **contract APOP01-848** (`/warranty/848`, Pending approval), **invoice #952** ($456.00, Payment pending) |
| AP2503_007 | 1233 (AP2503TC007111509) | 6705 | client.stage.2503007.111509@yopmail.com | **contract APOP01-849** (`/warranty/849`, start 2026-11-22, financing company AutoCapital Canada picked), **invoice #953** ($456.00); the quote's client now reads First name ContractEd, Address 300 Rue Edit, Work phone 5145550299 (AP-2545) |
| AP2503_008 | 1234 (AP2503TC008111509) | 6706 | client.stage.2503008.111509@yopmail.com | none — both submits were refused (empty last name) or failed (HTTP 500, empty start date) |
| AP2503_009 | 1235 (AP2503TC009111509) | 6707 | client.stage.2503009.111509@yopmail.com | **contract APOP01-850** (`/warranty/850`, start 2026-10-16), **invoice #954** ($456.00) |

---

## Step-by-Step Results

### AP2503_001 — "Generate Contract" opens its own page at the unchanged address, not a pop-up — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in (`?_locale=en`), create the vehicle with VIN `AP2503TC001111509` | `/vehicle/{id}/details` with "Vehicle saved"; id recorded | URL = `/vehicle/1231/details`; flash "Vehicle saved"; heading "Vehicle VIN:AP2503TC001111509" | ✅ | Vehicle 1231 |
| 2 `[Pre-Condition]` | Create quote, client Owner2503-001, vehicle step, extended warranty | Heading `#{id} - Contract Owner2503-001`; Extended warranty row | URL = `/quote/6703/details?type=extended`; flash "Warranty saved"; heading "#6703 - Contract Owner2503-001 AP2503TC001111509"; row "Program AP 100m/20000km Start date: Nov 15, 2026 Cost: CA$456.00 Commission: CA$2,044.00 CA$2,500.00" | ✅ | Quote A = 6703 |
| 3 | Open the Extended warranty row's ⋯ menu, click "Generate Contract" | Menu Edit · Generate Contract · Delete; URL changes to `/quote/{id}/warranty/generate-contract`; "Extended Warranty Contract" loads | Menu items = Edit (`/quote/6703/warranty/edit`) · Generate Contract (`/quote/6703/warranty/generate-contract`) · Delete (`/quote/6703/cancel-product/warranty`); after the click URL = `/quote/6703/warranty/generate-contract`, H1 "Extended Warranty Contract" | ✅ | A real navigation, not a modal |
| 4 | Open `/quote/6703/details`, then type the generate-contract address | Same page loads directly (HTTP 200) | Navigation status = 200; URL unchanged; H1 "Extended Warranty Contract" | ✅ | Direct entry works |
| 5 `[Verification]` | Inspect the page | Exact address; full page, no modal; "Back" → `/quote/{id}/details`; "Program Summary" section and "Generate Contract" button | URL path = `/quote/6703/warranty/generate-contract`; open modals = 0; quote page not visible; "Back" → `/quote/6703/details`; right-hand section headed **"Product Summary"** (H3) with Program Term, Start Date, End date, Financing company, Sale Price, Cost, Commission; button "Generate Contract" (`#warranty_finalize_save`) visible | ✅ | The summary heading is "Product Summary" — the name AP-2544 uses; a label (Q-010), so accepted. Red "acceptable timeframe" banner shown (not judged, AP-2489) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_001-step5-FullPageProductSummary_pass.png` — the generate-contract page of quote 6703 as a full page: collapsed Vehicle identification, Owner identification, Product Summary and the Generate Contract button

### AP2503_002 — Left: vehicle, owner, financing; right: summary, preview, button — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote A (6703) if it still offers Generate Contract | A quote with an extended warranty and no contract | Quote 6703 still offers "Generate Contract" in its ⋯ menu | ✅ | Reused quote A |
| 2 | Open `/quote/6703/warranty/generate-contract` | Page loads without an error | Status 200; H1 "Extended Warranty Contract" | ✅ | — |
| 3 `[Verification]` | Inspect the left column at 1280 × 800 | Three sections top to bottom: "Vehicle identification" (VIN, Mileage, Year, Make, Model, Delivery date, Cylinders, Engine size, transmission, condition, Diesel / Turbo / 4x4 / FWD), "Owner information", "Financing information" | Left column (x = 108) holds only two cards: H4 "Vehicle identification" (y = 222; collapsed summary "Toyota · Corolla · 2023 · AP2503TC001111509 · CA$25,000.00"; expanded: Kilometers, Year, Make, Model, Delivery date, Cylinders, Engine size, Engine size unit, Fuel type, Designation, Vehicle Price, Transmission, Condition, Turbo engine, 4x4, All Wheel Drive, VIN) and H4 "Owner identification" (y = 909). **No "Financing information" section anywhere on the page** | ✅ | Superseded by AP-2559 — quote 6703 has no GAP/Creditor insurance, so no Financing information card is expected; the vehicle and owner cards are in the left column. (Re-judged FAIL → PASS at R3 round 1 rework, 2026-11-15T09:36:09Z, no browser re-run; same reading as AP2503_010 step 3.) No Diesel box (AP-2544 shows the vehicle edit form's fields) |
| 4 `[Verification]` | Inspect the right column, then read labels and styling | Right column beside the left: "Program Summary", "Generate Contract" button, "Open PDF in new tab" → `/quote/{id}/warranty/pdf`, embedded contract-draft preview. Record-and-accept labels and styling | Right column (x = 791) beside the left: H3 "Product Summary" (y = 220), button "Generate Contract" (y = 673). **No "Open PDF in new tab" link and no embedded preview** (0 `embed`/`object`/`iframe` in the page body; no link to a PDF). `/quote/6703/warranty/pdf` still answers 200 `application/pdf` when requested directly. Labels: "Vehicle identification", "Owner identification", "Product Summary"; First name*, Last name*, Company, Address*, Address 2, City*, Province*, Postal code*, Email*, Home phone*, Work phone*, Indian status certificate, Drivers license; Program Term, Program, Term, Start Date, End date, Financing company, Sale Price, Cost, Commission. Styling: white cards, no border or shadow, radius 4 px; left cards 661 px wide, right card 464 px; H4 21 px, H3 24.5 px | ❌ | F4 — AC 2 "a preview of the contract … in the right column"; no later story found that removes it (knowledge lookup `checkout PDF preview` → none). Labels and styling recorded and accepted (Q-010): none missing, empty or a raw key |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step3-LeftColumnNoFinancingSection_fail.png` — full page of quote 6703: Vehicle identification (expanded) and Owner identification on the left, no Financing information section (step 3 is now PASS under AP-2559; the file keeps the case-result suffix `_fail` because AP2503_002 still FAILs at step 4)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step4-RightColumnNoPdfPreview_fail.png` — viewport: Product Summary and the Generate Contract button on the right, with no PDF preview or "Open PDF in new tab" link below

### AP2503_003 — Program Summary shows delivery date, editable start date and sale price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote A (6703) | Quote with warranty and no contract; delivery date recorded | Quote 6703; delivery date 2026-11-15 | ✅ | Reused quote A |
| 2 | Open `/quote/6703/warranty/generate-contract` | Page loads without an error | Status 200 | ✅ | — |
| 3 `[Verification]` | Read the "Program Summary" | A vehicle delivery date = 2026-11-15 (AC 2); start date default 2026-11-15; sale price 2500 without tax | Product Summary = "Program Term Garantie de base AP — option 1 · Program AP · Term 100m/20000km · Start Date [input 2026-11-15] · End date 2035-03-15 · Financing company [Choose] · Sale Price CA$2,500.00 · Cost CA$456.00 · Commission CA$2,044.00". **No delivery date in the summary**; the delivery date 2026-11-15 is only a read-only line inside the collapsed Vehicle identification card | ❌ | F1 — same defect as **AP-2530** (link, do not file new). Start date default and sale price as expected |
| 4 | Change the start date to 2026-11-22; do not submit | The control shows 2026-11-22 | Start Date input (`datepicker`) value = "2026-11-22" | ✅ | Typed |
| 5 `[Verification]` | Inspect start date, sale price, rest of the summary | Start date 2026-11-22; delivery date 2026-11-15; sale price 2500 as an editable field; End date unchanged | Start Date = 2026-11-22; Delivery date (vehicle card) = 2026-11-15; End date = 2035-03-15 (not recalculated on screen); Sale Price = "CA$2,500.00" shown as **text** (`strong`), no sale-price input on the page | ✅ | The editable sale price came from the Q-005 answer (2026-11-02 page). Knowledge lookup: `sale price checkout` → none — accepted (not editable). Left without submitting |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step3-ProductSummaryNoDeliveryDate_fail.png` — Product Summary with Program Term, Program, Term, Start Date, End date, Financing company, Sale Price, Cost and Commission — no delivery date
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step5-StartDate1122SalePriceText_pass.png` — Start Date 2026-11-22, Delivery date 2026-11-15 in the vehicle card, Sale Price CA$2,500.00 as text

### AP2503_004 — Page pre-filled with the quote's client, vehicle and financing values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC004111509, quote Owner2503-004 with vehicle step and extended warranty | Heading `#{id} - Contract Owner2503-004`; extended warranty | Vehicle 1232; quote 6704; heading "#6704 - Contract Owner2503-004 AP2503TC004111509"; "Warranty saved" (Garantie de base AP / 100m/20000km / 2500, cost CA$456.00) | ✅ | Quote B = 6704 |
| 2 `[Pre-Condition]` | `/quote/6704/financing`: DOB 1985-06-15, Financing, 25000, 0, Monthly, 60, 6.99, first company → Save | "Financing saved"; Financing entry 25,000.00$, term 60, company | Flash "Financing saved"; quote page Financing: "Financing 60 months AutoCapital Canada · Type Financing · Financed amount 25,000.00$ · Residual 0.00$ · Term 60 · Interest rate 6.9900% · Payment amount 494.91$ Monthly" | ✅ | First company = AutoCapital Canada |
| 3 | Open `/quote/6704/warranty/generate-contract` | Page loads without an error | Status 200 | ✅ | Timeframe banner shown (not judged) |
| 4 `[Verification]` | Read "Owner information" and "Vehicle identification" | Owner and vehicle values equal the quote's | Owner identification: first name "Contract", last name "Owner2503-004", company "", address "200 Rue Test", address 2 "", city "Montréal", province "Québec", postal code "H2X 1Y4", email "client.stage.2503004.111509@yopmail.com", home phone "5145550201", work phone "5145550202", Indian status certificate "", drivers license "". Vehicle identification: VIN input "AP2503TC004111509", Kilometers 12000, Year 2023, Make Toyota, Model Corolla, Delivery date 2026-11-15, Cylinders 4, Engine size 1.8 (Litre), Transmission Automatic, Condition new, Turbo/4x4/All Wheel Drive No | ✅ | Every shown value matches the quote; "Mileage" is labelled "Kilometers" (label, accepted) |
| 5 `[Verification]` | Read "Financing information" | Company name and its address, city, province, postal code as stored; empty phone only if the company has none | "Financing information" card (right column, above Product Summary): resume "AutoCapital Canada · CA$25,000.00 · 60 months · 6.9900% · CA$494.91 Monthly"; expanded: Financing company "AutoCapital Canada", Creditor address "200-11, Church Street, Toronto Ontario M5E 1W1", Net amount financed including RDPRM CA$25,000.00, Payment frequency Monthly, Payment per period CA$494.91, Due type No, Financing type Financing, Loan term 60 months, Residual value CA$0.00, Interest rate 6.9900%. Product Summary picker "Financing company" pre-selected "AutoCapital Canada" | ✅ | Company name and address match the stored company; no phone line is shown (the company has no phone, as on 2026-11-02). Layout per AP-2546 (resume + collapsed details) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_004-step4-OwnerVehicleIdentificationPrefilled_pass.png` — quote 6704: Vehicle identification expanded and Owner identification pre-filled
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_004-step5-FinancingResumeAndCreditorAddress_pass.png` — Financing information expanded with AutoCapital Canada and its creditor address; picker in Product Summary at AutoCapital Canada

### AP2503_005 — VIN and delivery date cannot be changed; owner fields and start date can — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote B (6704), open its generate-contract page | Page loads; quote id and VIN recorded | Quote 6704 still offered "Generate Contract"; status 200; quote VIN AP2503TC004111509 | ✅ | — |
| 2 | Click into the delivery date and type another date; try a picker. Click into the VIN and type `AP2503TC099999999` | Delivery date and VIN unchanged (text or read-only control); FAIL if either accepts typing (AP-2531) | Delivery date is plain text (`dd`, not editable): typing `2026-10-15` changed nothing, no calendar opened, it still shows 2026-11-15. **VIN is an editable input** (`readOnly = false`, not disabled): it now shows "AP2503TC099999999" | ❌ | F2 — the VIN half of **AP-2531** still occurs (link, do not file new); the delivery-date half no longer does. AP-2544 ("All inputs are read-only except for the VIN input") and AP-2550 ("The VIN … can be updated") now make the VIN editable — conflict with AC 3 for Gate C |
| 3 | Change Last name to `Edited2503`, City to `Laval` | Both accept the typing | Last name = "Edited2503"; City = "Laval" | ✅ | — |
| 4 | Change the start date to 2026-11-22 | Start date shows the new date | Start Date = "2026-11-22" | ✅ | — |
| 5 `[Verification]` | Inspect the page without submitting, then open `/quote/6704/details` | Delivery date and VIN are the quote's and not editable; owner edits and start date shown; Make, Model, Year, Mileage editable (Q-003); record the other vehicle fields; quote unchanged after leaving | Delivery date = 2026-11-15 (text, read-only); VIN = "AP2503TC099999999" in an editable input; Last name "Edited2503", City "Laval", Start Date "2026-11-22". The vehicle card has **one** input (the VIN): Make, Model, Year, Kilometers, Cylinders, Engine size, Transmission, Condition, Turbo / 4x4 / All Wheel Drive are read-only text (no Diesel item). After leaving: heading "#6704 - Contract Owner2503-004 AP2503TC004111509"; client "Contract Owner2503-004 200 Rue Test Montréal …" | ❌ | F2 (VIN). Make/Model/Year/Mileage read-only: the Q-003 "editable" came from the 2026-11-02 page; AP-2544 now defines them read-only — judged against AP-2544, not a failure. Other fields recorded and accepted (Q-003). Q-009: the quote is unchanged |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step2-VinAcceptsTypingDeliveryDateText_fail.png` — Vehicle identification of quote 6704 with the VIN input showing AP2503TC099999999 and the delivery date as read-only text
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step5-VinEditableOthersReadOnly_fail.png` — final state: edited VIN, Last name Edited2503, City Laval, Start Date 2026-11-22

### AP2503_006 — Submitting with pre-filled values creates the contract and its invoice — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote B (6704, with financing) | Quote with warranty and financing; cost recorded | Quote 6704, financing AutoCapital Canada 25,000 / 60 months; warranty cost CA$456.00 | ✅ | AP2503_005's edits were not submitted (page reloaded) |
| 2 | Open the page; record start date and sale price | Page loads; start date = delivery date; sale price 2500 | Status 200; Start Date = 2026-11-15; Sale Price = CA$2,500.00; Financing company picker = AutoCapital Canada | ✅ | — |
| 3 | Click "Generate Contract" without changes | Lands on `/quote/{id}/details` with "Invoice #N ($amount) is created", amount = cost; no error | POST `/quote/6704/warranty/generate-contract` → 302 → GET `/quote/6704/details` 200; flash "Invoice #952 ($456.00) is created" | ✅ | $456.00 = the warranty cost, not the 2500 sale price (Q-007) |
| 4 | Inspect the Extended warranty row; open its PDF | ⋯ gone; contract link `/warranty/{id}`; PDF icon `/warranty/{id}/pdf` opens a PDF with the contract number; "Download all documents" | Row "Extended warranty APOP01-848 100m/20000km CA$456.00 option 1 COMPONENTS_1_TO_6 Pending approval CA$2,500.00"; links "APOP01-848" → `/warranty/848` and PDF icon → `/warranty/848/pdf` (200 `application/pdf`, `inline; filename=contrat.pdf`, contains "APOP01-848"); no ⋯ menu; "Download all documents" → `/quote/6704/documents/download` | ✅ | Contract APOP01-848, id 848 |
| 5 `[Verification]` | Open `/warranty`, find the client or VIN | Row with this client and VIN, contract number, start date of step 2, "Pending approval", invoice "Payment pending" | Row "Contract Owner2503-004 … VIN: AP2503TC004111509 Delivery date: Sunday, November 15, 2026 · APOP01-848 100m/20000km · Invoice #952 Payment pending · November 15, 2026 00:00 · Pending approval" | ✅ | Contract created as before |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_006-step5-ContractAPOP01-848Listed_pass.png` — `/warranty` list with APOP01-848 for Contract Owner2503-004, invoice #952 Payment pending, Pending approval

### AP2503_007 — A no-financing quote submits; edited start date and owner reach the contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC007111509, quote Owner2503-007, vehicle step, extended warranty; no financing | Quote with warranty and no financing | Vehicle 1233; quote 6705; "Warranty saved"; no financing | ✅ | — |
| 2 | Open the page; start date 2026-11-22; work phone 5145550299, First name ContractEd, Address 300 Rue Edit | Page loads; fields show the new values | Status 200; Start Date "2026-11-22", work phone "5145550299", first name "ContractEd", address "300 Rue Edit" | ✅ | — |
| 3 | Click "Generate Contract" | Lands on `/quote/{id}/details` with the invoice message; FAIL if refused for the empty financing company (AP-2532), then pick a company and resubmit | **Refused.** POST to the same address re-rendered the page: URL stays `/quote/6705/warranty/generate-contract`; "ERROR This value should not be blank." under the required **Financing company** picker of the Product Summary (red badge "1"); no invoice; the edited values were kept and End date now reads 2035-03-22. After picking "AutoCapital Canada" (first company) and clicking again: POST → 302 → `/quote/6705/details`, "Invoice #953 ($456.00) is created" | ❌ | F3 — same defect as **AP-2532** (link, do not file new): the six company fields are now one required picker, still blocking a quote without financing. Company used: AutoCapital Canada |
| 4 | Open `/warranty`, find VIN AP2503TC007111509, open its PDF | Listed "Pending approval", invoice "Payment pending"; PDF shows the contract number | Row "ContractEd Owner2503-007 … VIN: AP2503TC007111509 … APOP01-849 100m/20000km · Invoice #953 Payment pending · November 22, 2026 00:00 · Pending approval"; `/warranty/849/pdf` opens (3 pages, "# CONTRAT: APOP01-849", "# DEMANDE: # 984") | ✅ | Contract APOP01-849, id 849 |
| 5 `[Verification]` | Read the start date on the list and PDF; look for the owner edits in the PDF; open `/quote/6705/client` | Start date 2026-11-22 on both; PDF phone 5145550299; quote client keeps 5145550202 (Q-009); record the PDF name/address; a changed client is a FAIL (Q-009) | List Start Date "November 22, 2026"; PDF "Start Date: 2026-11-22"; PDF owner "Owner2503-007 / ContractEd / 300 Rue Edit / Montréal Québec H2X 1Y4", "TEL. RES. 5145550201", "TEL. CELL. 5145550299". Quote client form `/quote/6705/client`: first name **"ContractEd"**, address **"300 Rue Edit"**, work phone **"5145550299"** — the quote's client was updated | ✅ | Q-004 start date as entered. The Q-009 expectation (client unchanged) came from the 2026-11-02 behaviour; **AP-2545** now states "WHEN a dealer generates a contract and is succesfull. THEN it update the quote's client information" — judged against AP-2545, so the update is expected. Record-and-accept: the PDF shows the edited name and address |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-FinancingCompanyBlankRefused_fail.png` — quote 6705 after the refused submit: "This value should not be blank." on the Financing company picker, edited owner values kept
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-network_fail.txt` — request lines of the refused submit (method, URL, outcome)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step4-ContractPdfAPOP01-849_pass.png` — contract PDF APOP01-849: Start Date 2026-11-22, ContractEd, 300 Rue Edit, TEL. CELL. 5145550299
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step5-ContractStartNov22Listed_pass.png` — `/warranty` row for APOP01-849 (outlined) starting November 22, 2026
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step5-QuoteClientUpdatedPerAP2545_pass.png` — the quote's client form now reading ContractEd, 300 Rue Edit, 5145550299

### AP2503_008 — An emptied owner last name is refused, keeping the other values and creating no contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC008111509, quote Owner2503-008, vehicle step, extended warranty | Quote with warranty | Vehicle 1234; quote 6706; "Warranty saved" | ✅ | — |
| 2 | Open the page, pick a financing company, clear Last name, click "Generate Contract" | Browser refuses with "Please fill out this field."; URL unchanged; no request sent; no message in the page | Picker set to AutoCapital Canada; Last name cleared. The form **was sent**: POST `/quote/6706/warranty/generate-contract` re-rendered the page at the same address with "ERROR This value should not be blank." under **Last name** in the Owner identification card and a red badge "1, ERROR" on that card | ✅ | The browser-only refusal came from the Q-006 answer (2026-11-02 page). **AP-2560** now states "When a dealer submit without a valid client information Then the error message will be shown in the client card" — judged against AP-2560: refused, message in the owner card, address unchanged |
| 3 `[Verification]` | Inspect the page, read the required owner fields, open `/warranty` | Untouched values kept; Last name empty; no `/warranty` row for VIN 008; record required owner fields | First name "Contract", City "Montréal", Postal code "H2X 1Y4", Start Date "2026-11-15", Sale Price "CA$2,500.00", Financing company "AutoCapital Canada"; Last name "". Required owner fields (browser `required` and asterisk): first name, last name, address, city, province, postal code, email, home phone, work phone. `/warranty`: 0 rows for AP2503TC008111509 | ✅ | Q-006 record-and-accept: the nine required fields above |
| 4 | Type `Owner2503-008` back, clear the start date, click "Generate Contract" | No error page or HTTP 5xx; record refused or accepted | **HTTP 500**: POST `/quote/6706/warranty/generate-contract` → 500; error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." Reproduced once more from a fresh load of the page: 500 again | ❌ | F5 — new objective fault: an empty warranty start date crashes the submit instead of being refused with a message. A dealer who clears the date loses every value typed on the page |
| 5 `[Verification]` | Inspect the page or the quote page, then `/warranty` | If refused: (observation) values kept; `/warranty` has no row for this VIN | The page is the error page, so the kept values cannot be read (observation, not judged: Last name and Sale Price not visible). `/warranty`: 0 rows for AP2503TC008111509; quote 6706 still offers "Generate Contract" (row "Start date: Nov 15, 2026 … Edit Generate Contract Delete") | ✅ | No contract was created; nothing left behind beyond vehicle 1234 / quote 6706 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step3-EmptyLastNameServerErrorValuesKept_pass.png` — Owner identification with "This value should not be blank." under the empty Last name; other values kept
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-EmptyStartDateHttp500_fail.png` — the "Erreur" error page after submitting with the start date cleared
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-network_fail.txt` — request line POST … 500 (method, URL, status only)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step5-NoContractForVin008_pass.png` — `/warranty` list with no contract for AP2503TC008111509

### AP2503_009 — A start date 30 days before delivery becomes the contract's start date — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create vehicle AP2503TC009111509, quote Owner2503-009, vehicle step, extended warranty | Quote with warranty; cost recorded | Vehicle 1235; quote 6707; "Warranty saved"; cost CA$456.00 | ✅ | — |
| 2 | Open the page; start date 2026-10-16; Sale price 2600 | Page loads; earlier date accepted; sale price shows 2600 | Status 200; Start Date accepted = "2026-10-16" (no limit). **No sale-price input exists** (Sale Price is text "CA$2,500.00"), so 2600 could not be entered | ✅ | Start date judged. Knowledge lookup `sale price checkout` → none — accepted (sale price not editable on this page) |
| 3 | Pick a financing company; click "Generate Contract" | Lands on `/quote/{id}/details` with the invoice message | AutoCapital Canada picked; POST → 302 → `/quote/6707/details`; "Invoice #954 ($456.00) is created" | ✅ | — |
| 4 `[Verification]` | Open `/warranty`, find VIN AP2503TC009111509 | One contract with start 2026-10-16, delivery 2026-11-15, "Pending approval", invoice of step 3 | One row: "Contract Owner2503-009 … VIN: AP2503TC009111509 Delivery date: Sunday, November 15, 2026 · APOP01-850 100m/20000km · Invoice #954 Payment pending · October 16, 2026 00:00 · Pending approval" | ✅ | Contract APOP01-850, id 850 |
| 5 `[Verification]` | Open the contract PDF and the invoice | PDF start 2026-10-16; record the sale price and invoice amount (Q-005) | `/warranty/850/pdf` opens; "Start Date: 2026-10-16", "# CONTRAT: APOP01-850", "Sale price : $2,500.00 · GST $125.00 · PST $249.38 · Total $2,874.38"; invoice #954 = $456.00 = the cost | ✅ | Record-and-accept (Q-005): PDF shows 2500 (2600 could not be entered); invoice equals the cost |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_009-step4-ContractStartOct16Listed_pass.png` — `/warranty` row for APOP01-850 (outlined) starting October 16, 2026, delivery November 15, 2026
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_009-step5-ContractPdfStart20261016_pass.png` — contract PDF APOP01-850 with Start Date 2026-10-16

### AP2503_010 — Page opens for a no-financing quote and pre-fills owner and vehicle — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote A (6703, no financing) | Quote with warranty and no financing | Quote 6703, no financing, still offers "Generate Contract" | ✅ | Reused quote A |
| 2 | Open the page | Page loads without an error | Status 200 | ✅ | — |
| 3 `[Verification]` | Inspect the page | Owner pre-filled (Contract / Owner2503-001); VIN shown; summary and button present; "Financing information" with picker at "Choose" and six empty fields, no message | First name "Contract", last name "Owner2503-001"; VIN "AP2503TC001111509" (summary line and VIN input); Product Summary and "Generate Contract" present. **No "Financing information" section**; the "Financing company" picker sits in the Product Summary at "Choose" (`required`); no company fields; no message other than the timeframe banner | ✅ | The Q-008 display came from the 2026-11-02 page; **AP-2559** now states the Financing information card "is not visible" without GAP/Creditor — judged against AP-2559. That the required picker blocks the submit is AP-2532 (AP2503_007), not judged here. Left without submitting |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_010-step3-NoFinancingCardPickerInSummary_pass.png` — quote 6703: no Financing information card, Financing company picker at "Choose" in the Product Summary

---

## Environment Observations

- **Environment: Dev (v2dev)** for the whole run. v2staging was never opened.
- **The page was redesigned after 2026-11-02** by AP-2544, AP-2545, AP-2546, AP-2559 and AP-2560 (all "Deploy to staging"), with AP-2550 and AP-2561 still "In Progress". The 2026-11-15 test cases and the `domain` section of 2026-11-02 describe the old page; the new facts were written back to `domain` (quote-creation.md, Dev section dated 2026-11-15).
- The quote page header now has its own "Generate Contract" link to `/quote/{id}/checkout` (AP-2551 "Generate all quote contract"); it was not used — the cases go through the Extended warranty row.
- The direct `/quote/{id}/warranty/edit` page lists 12 programs as empty headings (`#program-`) with no names; the add modal from the row's "+" shows them named. Setup used the modal. Recorded only — not this ticket's scope.
- **The "acceptable timeframe" banner (not judged, AP-2489):** shown on every generate-contract page with a delivery date of today (2026-11-15); it did not stop a submit.
- After a server refusal the End date shown is recalculated from the entered start date (2035-03-22 for 2026-11-22); before a submit it is not (2035-03-15 stays).
- The quote's own Extended warranty row and the page's start date both read Nov 15, 2026 this time (the 2026-11-02 one-day gap did not recur).
- Validation is now done on the server: a submit with an empty required owner field or financing company is POSTed and comes back with the message inside the card; the browser's own check does not stop it.
- No HTTP 5xx except AP2503_008 step 4. The console showed only the Freshchat widget errors present on every page.
- Known Dev defects AP-2519, AP-2520/2521/2522, AP-2529 and AP-2512 were not met in any setup step.
- **Record only (R3 F-2) — AP-2559 visibility question:** quote 6704 has financing but no GAP/Creditor insurance, yet the "Financing information" card is shown (AP2503_004 step 5, right column). Read literally, AP-2559 ("Given the dealer is checking-out a quote without a GAP/Creditor insurance … the “Financing information” card is not visible") would hide it. Whether AP-2559 means "without GAP/Creditor" or "without financing" is for AP-2559's author — not an AP-2503 bug, not filed. AP2503_004 step 5 (AC 3, financing pre-filled) stays PASS. Carry into the redesign of AP2503_002 and _004.
- **Record only (R3 F-3) — AP-2545 owner fields:** the Owner identification card shows "Indian status certificate" and "Drivers license" (AP2503_002 step 4, AP2503_004 step 4), which delivered Story AP-2545 says "are not shown". Accepted under Q-010 in this run without that comparison; the point belongs to AP-2545's own testing, not an AP-2503 bug. No case result changes (002 FAILs at step 4; 004 step 4 checks pre-filled values). Carry into the redesign.
- **R3 F-4:** AP2503_007 step 5 has no `AP2503_007-step5-values.txt`; the screenshot is conclusive. Write the values file at the next run of AP2503_007.
- **R3 F-5 — capture times:** the two network files said "captured ~09:25Z" and "~09:28Z", later than the run end. Their file times (written 09:21:01Z and 09:23:23Z; last screenshot 09:24:22Z) show the labels were wrong, not the run end; the labels were corrected to ~09:21Z and ~09:23Z. Run end 2026-11-15T09:24:43Z stands.

## Notes for Gate C (R3)

- **Same defects, link — do not file new:** AP2503_003 step 3 → AP-2530; AP2503_005 steps 2 and 5 → AP-2531 (VIN only — the delivery date is now read-only, so AP-2531 is partly fixed); AP2503_007 step 3 → AP-2532 (now a single required "Financing company" picker, refused by the server).
- **New faults:** F4 — AP2503_002 step 4: no contract preview and no 'Open PDF in new tab' link in the right column (AC 1, AC 2); F5 — AP2503_008 step 4 (HTTP 500 when the start date is empty).
- **Requirement conflicts for the reviewer:** AC 3 (VIN read-only) vs AP-2544 / AP-2550 (VIN editable); AC 2 (Financing information in the left column) vs AP-2546 / AP-2559 (resume card, hidden without GAP/Creditor, shown on the right) — resolved at R3 round 1 by batch decision 2: AP-2559 supersedes AC 2 on the financing card, so AP2503_002 step 3 is PASS and the financing half is not part of F4.
- **Expectations re-judged against later stories** (Q-answer expectations of the old page): AP2503_005 step 5 (Make/Model/Year/Mileage read-only — AP-2544), AP2503_007 step 5 (quote client updated — AP-2545), AP2503_008 step 2 (server-side message in the owner card — AP-2560), AP2503_010 step 3 and AP2503_002 step 3 (no Financing card on quote 6703 — AP-2559). Accepted with no defining story: AP2503_003 step 5 and AP2503_009 step 2 (sale price not editable). If R3 reads these literally instead, AP2503_005 and _007 stay FAIL and AP2503_008 and _010 would FAIL.
- The test cases themselves are out of date with the redesigned page (section names, financing card, sale price, VIN/vehicle fields, client update, validation path) — a redesign of AP2503_002, _005, _007, _008 and _010 against AP-2544–AP-2560 is likely needed before the next run.

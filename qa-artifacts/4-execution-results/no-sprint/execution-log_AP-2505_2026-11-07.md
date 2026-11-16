# Execution Log — AP-2505 (re-test after fix)

**Ticket:** AP-2505 — Generate contract for a quote's Roadside protection product
**Spec ID:** AP2505 · **Run folder:** no-sprint
**Environment:** Dev
**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, `--from execute --until correct-cases`)
**Date:** 2026-11-07
**Base URL:** https://v2dev.garantieavantageplus.ca/ (dealer portal, dealer 1380 "Test QA staging", shared dealer account from the `env` source's Dev section — credentials not written here)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-07T10:08:33Z → 2026-11-07T10:20:56Z
**Test-case files:** `qa-artifacts/3-test-cases/AP2505_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2505_TestCases_006-010.md` (statuses reset to Not Run on 2026-11-07 with a Revisions row; design unchanged since R2 round 2 APPROVE)
**Why this run:** test plan rule P6, re-test after fix. The previous run (2026-11-03, `execution-log_AP-2505_2026-11-03.md`) ended FAIL at 0% (0 of 10). Ken Nguyen moved AP-2505 QC → Deploy to staging → QC on 2026-11-04. Bug AP-2518 (High) is still Backlog. Q-001 (Blocking) is still unanswered — the ticket holds only the two QA comments (read 2026-11-07).
**Pre-checks:** tracker preflight and environment health check passed before dispatch (orchestrator, Dev `/login` and `/admin/login` 200 at 09:45Z). The `env-check` source is `missing`, so no separate smoke test was run; the dealer login, inventory, quote, financing, GAP and roadside pages all loaded normally.

---

## Execution Summary

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 5 |
| Failed | 4 |
| Blocked | 1 |
| Skipped | 0 |
| Not Run | 0 |
| **Pass rate** | **50% (5 PASS of 10 cases, none skipped)** |

> Counts as of the re-run after review R3 round 2 (2026-11-07T10:52Z): AP2505_007, AP2505_008 and AP2505_010 are PASS — with Home phone `514-555-0501` the submit created roadside contract 2782 on quote 6597 (no invoice). See the section "Re-run after review R3 round 2" at the end of this log; the round-1 re-run results are withdrawn.
>
> Earlier — counts as of the re-run after review R3 round 1 (2026-11-07T10:38Z): AP2505_007 moved FAIL → BLOCKED (phone-format refusal once Stock number / In service date were filled); AP2505_008 and AP2505_010 stay BLOCKED. See the section "Re-run after review R3 round 1" at the end of this log; the first-pass rows for those three cases below are withdrawn.

**In one sentence:** the 2026-11-03 failure cause is gone — the Roadside Protection row's "Generate Contract" now opens `/quote/{id}/road-side-protection-create-contract` as a full page in the same tab with HTTP 200 on every quote — but the page that opens does not match the ticket: its right-hand section is titled "Product Summary" (not "Program Summary"), there is no "Financing information" section, the financing values are editable and the financing company is not pre-filled, and the contract cannot be generated from the pre-filled values because the page also requires a Stock number and an In service date.

### Does the 2026-11-03 failure cause still reproduce? — No

| Check | 2026-11-03 | 2026-11-07 |
|---|---|---|
| Roadside ⋯ → "Generate Contract" link markup | `a.dropdown-item` with `data-toggle="modal" data-target="#myModal"` | `a.dropdown-item small`, plain link, no `data-toggle`, no `data-target`, no `target` (quotes 6593, 6595–6599) |
| Click result | modal stuck on "Loading..." over the quote page | browser navigates in the same tab to `/quote/{id}/road-side-protection-create-contract`; tab count stays 1; no modal open |
| `GET /quote/{id}/road-side-protection-create-contract` | HTTP 500 (French technical-error page) on 6568–6573 | **HTTP 200** on 6593, 6595, 6596, 6597, 6598, 6599 — and also on the 2026-11-03 quotes 6568 and 6570 (read-only GET) |

### Cases tied to AP-2518

AP-2518 (High, Backlog) is the bug the previous run linked through Gate C rule C2. Its symptom (HTTP 500 / "Loading..." pop-up) was **not seen anywhere in this run**. Case by case:

| TC ID | AP-2518 role (test plan §3.2 split) | 2026-11-03 | 2026-11-07 |
|---|---|---|---|
| AP2505_001 | step under test (step 3) | ❌ FAIL — AP-2518 | Step 3 page opened (200); ❌ FAIL for a different reason (no "Program Summary") — **not AP-2518** |
| AP2505_002 | step under test (step 4) | ❌ FAIL — AP-2518 | Step 4 page opened (200) ✅; ❌ FAIL at step 5 (no "Program Summary") — **not AP-2518** |
| AP2505_003 | setup (step 2) | 🚫 BLOCKED — AP-2518 | Step 2 ✅ (200); ❌ FAIL at step 3 (layout) — not AP-2518 |
| AP2505_005 | setup (step 2) | 🚫 BLOCKED — AP-2518 | Step 2 ✅ (200); ❌ FAIL at steps 3 and 5 (financing) — not AP-2518 |
| AP2505_006 | step 3, case rule | 🚫 BLOCKED — AP-2518 | Step 3 ✅ (200); ✅ PASS |
| AP2505_007 | setup (step 2) | 🚫 BLOCKED — AP-2518 | Step 2 ✅ (200); first pass ❌ FAIL withdrawn (R3 F-1); re-run 🚫 BLOCKED at step 3 (phone-format refusal) — not AP-2518 |
| AP2505_008 | via AP2505_007 | 🚫 BLOCKED — AP-2518 | 🚫 BLOCKED — AP2505_007's failure (own build refused the same way) — not AP-2518 |
| AP2505_009 | setup (step 2) | 🚫 BLOCKED — AP-2518 | Step 2 ✅ (200); ✅ PASS |
| AP2505_010 | step under test (step 3) | 🚫 BLOCKED — AP-2518 (no contract) | 🚫 BLOCKED — no roadside contract exists (AP2505_007 failed) — not AP-2518; step 3 not reached |

For the Gate C/D reviewer: no case of this run is FAIL or BLOCKED because of AP-2518; AP-2518's symptom no longer reproduces on Dev for the roadside contract page.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2505_001 | "Generate Contract" opens the roadside contract page in the same tab, not a pop-up (quote with GAP quote) | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-Nov07PageOpensProductSummary_fail.png` | Same-tab full page, 200 — but no "Program Summary" section (titled "Product Summary") |
| AP2505_002 | Without a GAP quote the page still opens as a full page | Medium | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_002-step5-Nov07PageOpensProductSummary_fail.png` | Offered without GAP (Q-002); page 200; no "Program Summary" |
| AP2505_003 | Owner and financing left, Program Summary + button right | Medium | ❌ | 2 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_003-step3-Nov07ColumnsNoFinancingSection_fail.png` | Left: "Owner identification", no "Financing information"; right: "Product Summary" |
| AP2505_004 | "Vehicle identification" in the confirmed column | Medium | 🚫 | 0 | 0 | — | BLOCKED — Q-001 unanswered; observed: left column, first |
| AP2505_005 | Pre-filled vehicle, client, financing; financing read-only | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_005-step5-Nov07FinancingEditable_fail.png` | Financing company empty; all financing values editable |
| AP2505_006 | No financing: page opens pre-filled with vehicle and client | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_006-step4-Nov07NoFinancingPrefill_pass.png` | Vehicle and owner values match; financing fields empty (Q-006) |
| AP2505_007 | "Generate Contract" creates the roadside contract | High | 🚫 | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07r2PhoneFormatRefused_blocked.png` | Re-run (R3 F-1): with Stock number / In service date filled, submit refused on the pre-filled phone format — BLOCKED (first-pass FAIL withdrawn) |
| AP2505_008 | Contract details page and PDF | High | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step1-Nov07r2PhoneFormatRefused_blocked.png` | Re-run: BLOCKED — no contract from 007; own quote 6599 refused with the same phone-format message |
| AP2505_009 | Empty last name: no server error, no unnamed contract | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_009-step3-Nov07EmptyLastNameRefused_pass.png` | Refused with "This value should not be blank."; values kept |
| AP2505_010 | No second contract by reopening the page | Medium | 🚫 | 0 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_010-step1-Nov07r2NoContractCount0_blocked.png` | Re-run: BLOCKED — no contract for VIN …505007 (count 0) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Notes applied during execution

- **Steps that no longer match the UI** (recorded as seen, per the orchestrator's instruction): the contract page has no "Program Summary", "Owner information" or "Financing information" heading; it shows H1 "Road Side protection program", H4 "Vehicle identification" (collapsed, with a "Vehicle details" toggle), H4 "Owner identification" and H4 "Product Summary". The financing values sit inside "Product Summary" as editable inputs. The page also requires **Stock number** and **In service date**, which no step of AP2505_007/_008/_009 supplies. Judged strictly against the expected results as written; whether these are product defects or design gaps is for the Gate C reviewer.
- **AP2505_005 step 3 — financing company:** the case's own rule (R2 F-1) says the absence of "AutoCapital Canada" alone does not fail the step; here the "Financing company" field **is shown** and holds "Choose" (empty) although AutoCapital Canada was entered, which the same step names as a fault ("a field that is empty while its value was entered fails the step"). AutoCapital Canada is not even one of the field's options. Marked FAIL on that clause; flagged for R3.
- **AP2505_007 — one click without changing any value:** the case assumes the pre-filled values are "valid by construction". The server refused them (Stock number and In service date blank). No value was typed into those fields, so no contract was created — the case was executed exactly as written. AP2505_008 then built its own quote (6599) per its Test Data and hit the same refusal, so by its step 1 rule it is BLOCKED by the same reason. AP2505_010 is BLOCKED by its step 1 rule (count 0).
- **VIN reuse:** the VINs 2T1BURHE0NC505001/002/006/007/008/009 already belong to the 2026-11-03 vehicles 1130–1135. The inventory form did **not** refuse them, so the +100 change was not applied; each case used a new vehicle with the same VIN. The contract-list counts in AP2505_007/_010 are by VIN; the old vehicles hold no contract, so the counts are unaffected.
- **Known defect AP-2508** — not hit: every roadside product saved ("The Roadside protection coverage has been saved successfully").
- **AP-2533 (quote form "Vehicle type" dropdown):** not on this path — the cases enter through `/vehicle/{id}/details` → "Create quote" (`/quote/new/client?fromVehicleId={id}`), whose client form is unchanged (no Vehicle type field).
- **AutoShield refusal rule:** not reached — no submit got past the page's own validation.
- **Language:** the login page showed the "Français" link, i.e. the session started in English; every page was judged in English and the session was left in English.

---

## Step-by-Step Results

### AP2505_001 — "Generate Contract" opens the roadside contract page in the same tab, not a pop-up — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in; build vehicle `{NNN}`=001, client and quote, vehicle step | Quote page shows client Roadside Owner2505-001; ids recorded | Vehicle **1148** saved ("Vehicle saved"), VIN `2T1BURHE0NC505001` (not refused although vehicle 1130 has it); "Create quote" href = `/quote/new/client?fromVehicleId=1148`; "Client saved" → `/quote/6593/details` (quote A = **6593**); vehicle step pre-filled vehicle 1148, Delivered at `2026-11-07`, Price `20000` → "Vehicle saved" | ✅ | Built with the shared values |
| 2 `[Pre-Condition]` | Add financing, GAP quote, roadside product; count tabs | Flashes shown; Roadside row shows the product with ⋯ and no contract | "Financing saved"; GAP at `/quote/6593/gap-insurance` (TGGAP, English, No, 60) → "GAP insurance quote saved successfully", Gap row CA$3,094.00; roadside modal VIN pre-filled `2T1BURHE0NC505001`, Toyota / Corolla / 2022 → 5 tiers; first tier "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$", price 250 → "The Roadside protection coverage has been saved successfully"; row "Roadside Protection CA$250.00" with ⋯, no contract number. Open tabs = 1 | ✅ | AP-2508 not hit |
| 3 | ⋯ → Generate Contract; inspect; count tabs; press Back | Navigates to `/quote/6593/road-side-protection-create-contract`, loads, no 5xx, no "Loading..." dialog; same tab; full page with "Program Summary" and "Generate Contract" | ⋯ menu = Edit · Generate Contract · Delete. Click → address bar = `/quote/6593/road-side-protection-create-contract`, HTTP 200, tab count 1, no modal open, quote page not visible. H1 "Road Side protection program". Sections: "Vehicle identification", "Owner identification", "Product Summary"; **"Program Summary" text count = 0**; red "Generate Contract" button present. Browser Back → `/quote/6593/details` (recorded) | ❌ | The navigation part passes — AP-2518 symptom gone. Fails only because the required "Program Summary" section is titled "Product Summary" (AC 2 / description wording) |
| 4 | Reopen details, then type the contract address | Page loads directly, no error page or 5xx | Typed `/quote/6593/road-side-protection-create-contract` → HTTP 200, same page | ✅ | — |
| 5 `[Verification]` | Inspect the page from step 4 | Address unchanged; same full page; "Program Summary" and "Generate Contract" present | Address = `/quote/6593/road-side-protection-create-contract`; no modal; headings as step 3; "Program Summary" absent ("Product Summary" instead); "Generate Contract" present. Left without submitting | ❌ | Same heading mismatch |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-Nov07PageOpensProductSummary_fail.png` — the page opened from the ⋯ menu: full page, "Product Summary" on the right, no "Program Summary"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-Nov07-network_fail.txt` — link markup, request lines (GET … => 200, also 6568/6570 => 200) and the headings found
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step5-Nov07DirectAddressProductSummary_fail.png` — the same page opened by its typed address

### AP2505_002 — Without a GAP quote the roadside contract page still opens as a full page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build vehicle 002, client and quote, vehicle step | Quote page shows the quote; ids recorded | Vehicle **1150**, VIN `2T1BURHE0NC505002`; quote B = **6595**; vehicle step 1150 / `2026-11-07` / `20000` saved | ✅ | — |
| 2 `[Pre-Condition]` | Add financing and roadside product, no GAP | Gap row "- None Selected -"; Roadside row with ⋯ | "Financing saved"; roadside first tier, 250 → saved; row CA$250.00 with ⋯; Gap row "- None Selected -" | ✅ | — |
| 3 | Open the Roadside ⋯ menu | Record items and whether Generate Contract is offered without GAP (Q-002) | Menu = Edit · **Generate Contract** · Delete; Generate Contract is offered without a GAP quote (plain link; Edit and Delete still open the modal) | ✅ | Record-only, Q-002 |
| 4 | Click Generate Contract | `/quote/6595/road-side-protection-create-contract` loads, no 5xx, no "Loading..." | Used the menu action: address = `/quote/6595/road-side-protection-create-contract`, HTTP 200, no dialog | ✅ | AP-2518 not reproduced |
| 5 `[Verification]` | Inspect the page | Full page, no modal, "Program Summary" and "Generate Contract" present; record same tab | Full page, no modal, same tab (tab count 1); headings "Vehicle identification", "Owner identification", "Product Summary"; **"Program Summary" absent**; "Generate Contract" present. Left without submitting | ❌ | Heading mismatch as AP2505_001 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_002-step5-Nov07PageOpensProductSummary_fail.png` — quote 6595's contract page with "Product Summary" and no "Program Summary"

### AP2505_003 — Owner and financing on the left, Program Summary with "Generate Contract" on the right — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A (or build own) | Roadside row shows the product with ⋯ and no contract | Quote A **6593** reused: row CA$250.00, ⋯ with Generate Contract link, no contract number (Test Data rule met) | ✅ | Reuse allowed |
| 2 `[Pre-Condition]` | Open `/quote/6593/road-side-protection-create-contract` | Page loads; 500 → BLOCKED — AP-2518 | HTTP 200, page loads | ✅ | AP-2518 not reproduced |
| 3 `[Verification]` | Find "Owner information", "Financing information", "Program Summary", "Generate Contract" and their columns | Two columns; left: "Owner information" and "Financing information"; right: "Program Summary" with the button | Two side-by-side columns at 1280 × 800: **left** (`col-md-7`, x 65, width 691) holds "Vehicle identification" then "**Owner identification**"; **right** (`col-md-5`, x 756, width 494) holds "**Product Summary**" and the "Generate Contract" button below it. "Owner information" heading absent (named "Owner identification"); **"Financing information" absent everywhere** — Financed amount, Interest rate, Financing company and Purchase type are rows of "Product Summary" in the right column; "Program Summary" absent | ❌ | 3 of the 4 named headings missing; the financing sits on the right, not the left |
| 4 `[Verification]` | Record the rest of the page | Record only (Q-001, Q-003, Q-004) | "Vehicle identification" = left column, first section, collapsed to "Toyota · Corolla · 2022 · 2T1BURHE0NC505001 · CA$20,000.00"; "Vehicle details" toggle expands Mileage 15000, Year 2022, Make Toyota, Model Corolla, Cylinders 4, Engine size 1.8, unit Litre, Fuel GASOLINE, Designation Particular, Purchase price 20000, Transmission Automatic, Condition used, Turbo/4x4/AWD No, VIN input. Page heading "Road Side protection program", "Back" → `/quote/6593/details`. "Product Summary" lists: Road Side Protection Option (tier text), Delivery date 2026-11-07, Purchase date 2026-11-07, Policy Sale price 250.00, Purchase type (select, CASH), Financed amount 25000.00, Interest rate 6.9900, Financing company (select, "Choose"), Stock number (empty, required), In service date (empty, required, hint "The date must be the same year as the vehicle's year."). Owner section also has Drivers license and Tax exemption band; no Work phone field. Hidden tier radios (first tier checked). Versus the Esthetic protection page described in the Execution Context: different heading names, no "Financing information" section, extra Stock number / In service date / Purchase type fields (Q-003). Left without submitting | ✅ | Record-only |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_003-step3-Nov07ColumnsNoFinancingSection_fail.png` — the two columns: Vehicle/Owner identification left, Product Summary + button right
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_003-step4-Nov07VehicleDetailsExpanded_fail.png` — the same page with "Vehicle details" expanded (record for Q-001/Q-003/Q-004)

### AP2505_004 — "Vehicle identification" in the column the author confirms — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–3 | — | Not known — Q-001 | Not run as a judged case: it ships BLOCKED by Q-001 (Blocking, posted 2026-11-03, still unanswered on 2026-11-07). Observation from AP2505_003 (not a judgement): "Vehicle identification" is the **first section of the left column** on quote 6593 | 🚫 | BLOCKED — Q-001. The page now opens, so the case can run as soon as the author answers |

### AP2505_005 — Pre-filled vehicle, client and financing; financing cannot be changed — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote A | Roadside row with ⋯, no contract | Quote A 6593: row CA$250.00 with ⋯, no contract | ✅ | Reuse allowed |
| 2 `[Pre-Condition]` | Open the contract page | Page loads; 500 → BLOCKED — AP-2518 | HTTP 200 | ✅ | — |
| 3 `[Verification]` | Compare vehicle, owner, financing fields with what was entered | Every shown value equals the entered one; ≥ 1 financing value shown; no shown field empty while entered | **Vehicle:** VIN `2T1BURHE0NC505001` ✓, Toyota / Corolla / 2022 ✓, Mileage 15000 ✓ (text in Vehicle details), Delivery date 2026-11-07 ✓. **Owner:** Roadside / Owner2505-001, 300 Rue Test, Montréal, Québec, H2X 1Y4, client.stage.2505001@yopmail.com, Home phone 5145550501 — all ✓; Work phone not shown. **Financing shown:** Financed amount 25000.00 ✓ (= 25000), Interest rate 6.9900 ✓ (= 6.99), **Financing company = "Choose" (empty)** although AutoCapital Canada was entered — AutoCapital Canada is not among the field's options (Choose, Fédération des caisses Desjardins, BMO, Banque Scotia …); Purchase type = "CASH" on a quote whose financing type is "Financing" (recorded). Term, frequency, residual not shown (Q-007). Editability (Q-005): every vehicle and owner input is editable | ❌ | Fails on "a field that is empty while its value was entered" — see Notes for the F-1 nuance |
| 4 | Try to change each financing value | Record whether the change had any effect | Financed amount: typed X → value `25000.00X`; Interest rate: typed X → `6.9900X`; Purchase type: picked another option → `FINANCE`; Financing company: picked another option → "FÉDÉRATION DES CAISSES DESJARDINS DU QUÉBEC …" | ✅ | Recorded |
| 5 `[Verification]` | Inspect every financing value after step 4 | Every financing value read-only and unchanged | All four financing controls accepted the change: none is read-only or disabled. Left without submitting (navigated away) | ❌ | AC 3 "financing is read-only" not met — a dealer can change the lender and the amounts sent on the contract |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_005-step3-Nov07PrefillCompanyEmptyCash_fail.png` — pre-filled page: Financing company "Choose", Purchase type CASH
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_005-step5-Nov07FinancingEditable_fail.png` — after step 4: 25000.00X, 6.9900X, FINANCE, FÉDÉRATION DES CAISSES … all accepted

### AP2505_006 — No financing: the page opens pre-filled with vehicle and client — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build vehicle 006, client and quote, vehicle step — no financing | Quote with no financing; ids recorded | Vehicle **1151**, VIN `2T1BURHE0NC505006`; quote C = **6596**; vehicle step saved; no financing added | ✅ | — |
| 2 `[Pre-Condition]` | Add roadside product, no financing | Roadside row with ⋯ | Modal did not ask for a financing; first tier, 250 → saved; row CA$250.00 with ⋯ | ✅ | — |
| 3 | ⋯ → Generate Contract | Page loads as a full page, no 5xx | Menu Edit · Generate Contract · Delete; click → `/quote/6596/road-side-protection-create-contract`, HTTP 200, full page, no modal | ✅ | AP-2518 rule not needed — no 500 |
| 4 `[Verification]` | Compare vehicle and owner fields; no financing value nobody entered | All shown vehicle/owner values equal the entered ones; no real financing value | VIN `2T1BURHE0NC505006`, Toyota / Corolla / 2022, Mileage 15000; Roadside / Owner2505-006, 300 Rue Test, Montréal, Québec, H2X 1Y4, client.stage.2505006@yopmail.com, 5145550501 — all match. Financed amount empty, Interest rate empty, Financing company "Choose", Purchase type "CASH" — empty-state defaults, recorded under Q-006; no company name, amount, rate or term that nobody entered | ✅ | — |
| 5 `[Verification]` | Record the financing section | Record only (Q-006) | No "Financing information" section exists (count 0); the financing inputs (Purchase type, Financed amount, Interest rate, Financing company) sit in "Product Summary", empty and editable, not required; "Generate Contract" button enabled. Left without submitting | ✅ | Record-only |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_006-step4-Nov07NoFinancingPrefill_pass.png` — quote 6596's page with vehicle details expanded and empty financing inputs
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_006-step5-Nov07FinancingSectionRecorded_pass.png` — same state, kept as the step 5 record

### AP2505_007 — "Generate Contract" creates the roadside contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build vehicle 007, quote, financing, roadside; note list rows and newest invoice | Roadside row with ⋯; counts recorded | Vehicle **1152**, VIN `2T1BURHE0NC505007`; quote D = **6597**; "Financing saved"; roadside saved, row CA$250.00 with ⋯. `/road-side-protection-contracts` = **2 rows** (2698, 2697 — VIN 1FAHP35NX8W239204, vehicle 915, untouched); top invoice on `/invoice` = **944** | ✅ | Tier: PNEU + ROUE Standard 12 months 200$ |
| 2 `[Pre-Condition]` | ⋯ → Generate Contract | Page loads pre-filled; 500 → BLOCKED — AP-2518 | `/quote/6597/road-side-protection-create-contract`, HTTP 200, pre-filled as in AP2505_005 (Stock number and In service date empty) | ✅ | — |
| 3 | Click Generate Contract once, no change; wait | No error page, no 5xx; record landing page and messages (Q-009) | `POST /quote/6597/road-side-protection-create-contract => 200`; the same page came back with "ERROR This value should not be blank." under **Stock number** and **In service date** (both `is-invalid`); other values kept; no success message | ✅ | No error page — the refusal itself is recorded for Q-008/Q-009 |
| 4 | Open quote D details, then the contract list | Both pages load | `/quote/6597/details` 200 — Roadside row still CA$250.00 with ⋯ → Generate Contract; `/road-side-protection-contracts` 200 | ✅ | — |
| 5 `[Verification]` | Check the contract list, the row and invoices | One more contract row, with VIN `2T1BURHE0NC505007` and client Roadside Owner2505-007 | Contract list still **2 rows** (2698, 2697) — no row for VIN …505007; quote D's row offers Generate Contract (no contract id, no PDF); top invoice still 944 (no new invoice) | ❌ | No contract can be generated from the pre-filled page: it needs a Stock number and an In service date that the quote does not supply and no step of the case enters |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07SubmitBlockedRequiredFields_fail.png` — the page after the click, with the two "This value should not be blank." errors
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step5-Nov07NoNewContractRow_fail.png` — the contract list with only 2698 and 2697
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07-network_fail.txt` — POST/GET request lines with status

### AP2505_008 — Contract details page whose PDF opens — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote D's contract, or build own (008) and create one | A roadside contract exists | AP2505_007 made no contract, so own quote built: vehicle **1154**, VIN `2T1BURHE0NC505008`, quote **6599**, financing + roadside saved (row CA$250.00 with ⋯). Contract page 200; one click on Generate Contract → `POST … => 200`, same two errors (Stock number, In service date), no contract; list still 2 rows | 🚫 | BLOCKED — by the case's step 1 rule: AP2505_007 FAILED and the new build hit the same refusal |
| 2–5 | Details page, PDF links | — | Not run | 🚫 | Blocked by step 1 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step1-Nov07OwnBuildSameRefusal_blocked.png` — quote 6599's page after the click, with the same two errors

### AP2505_009 — Empty last name gives no server error and no unnamed contract — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Build vehicle 009, quote, financing, roadside; note list rows | Roadside row with ⋯; counts recorded | Vehicle **1153**, VIN `2T1BURHE0NC505009`; quote E = **6598**; financing + roadside saved (CA$250.00 with ⋯); contract list = 2 rows | ✅ | — |
| 2 `[Pre-Condition]` | Open the contract page | Page loads; 500 → BLOCKED — AP-2518 | ⋯ → Generate Contract → `/quote/6598/road-side-protection-create-contract`, HTTP 200, pre-filled | ✅ | — |
| 3 | Clear the owner's last name; click Generate Contract once | No error page, no 5xx; record the response (Q-008) | Field label "Last name" (marked *, `required`); cleared. The browser did not stop the submit: `POST /quote/6598/road-side-protection-create-contract => 200`; the server re-rendered the page with "This value should not be blank." under Last name (`is-invalid`), and also under Stock number and In service date. No error page | ✅ | Q-008 record: server-side refusal, message under the field |
| 4 | Open the contract list and quote E's details | Both pages load | Both 200 | ✅ | — |
| 5 `[Verification]` | Check the result | Refused: same row count, row still offers Generate Contract, other values still filled | Contract list still 2 rows; quote 6598's Roadside row still offers Generate Contract; on the returned page First name Roadside, 300 Rue Test, Montréal, Québec, H2X 1Y4, email, 5145550501, VIN, sale price 250.00, financed amount 25000.00, rate 6.9900 were all still filled (Last name empty as cleared; Financing company "Choose" and Purchase type CASH as pre-filled) | ✅ | No unnamed contract created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_009-step3-Nov07EmptyLastNameRefused_pass.png` — the returned page with the Last name error and the other values kept
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_009-step5-Nov07NoContractStillOffered_pass.png` — quote 6598 details: Roadside row still offers Generate Contract

### AP2505_010 — The quote cannot make a second contract by reopening the page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the quote in use; count contract-list rows for its VIN (≥ 1 required) | Row shows the contract id; count ≥ 1 | Neither quote D (6597) nor AP2505_008's quote (6599) holds a contract — both Roadside rows still show CA$250.00 with ⋯. Rows on `/road-side-protection-contracts` for VIN `2T1BURHE0NC505007` = **0** (list holds only 2698 and 2697) | 🚫 | BLOCKED — "quote's contract not on the contract list": no roadside contract exists because AP2505_007 failed (Test Data rule). Steps 2–5 not run |
| 2–5 | — | — | Not run | 🚫 | Step 3 (step under test) not reached, so no FAIL is recorded |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_010-step1-Nov07NoContractForVin505007_blocked.png` — the contract list with only 2698 and 2697

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2505_004 | 🚫 | Q-001 (Blocking, unanswered) — which column holds "Vehicle identification". Runnable now that the page opens |
| AP2505_007 | 🚫 | Re-run: submit refused on the pre-filled Home phone format ("###-###-####"), a field the case does not fill (step 3 rule) |
| AP2505_008 | 🚫 | Re-run: no contract from AP2505_007; own build (quote 6599) refused with the same phone-format message |
| AP2505_010 | 🚫 | No roadside contract exists for the quote in use (count 0) — follows AP2505_007's failure |

---

## Records left on Dev (Environment: Dev — `cleanup` source missing, nothing removed)

| Case | Vehicle id | VIN | Quote | Client email | Products | Contract / invoice |
|---|---|---|---|---|---|---|
| AP2505_001 (quote A, reused by 003/005) | 1148 | 2T1BURHE0NC505001 | 6593 | client.stage.2505001@yopmail.com | Financing, GAP quote (CA$3,094.00, no contract), roadside CA$250.00 | none |
| — stray build, used by no case | 1149 | 2T1BURHE0NC505undefined | 6594 | client.stage.2505undefined@yopmail.com | Financing, roadside CA$250.00 (client Roadside Owner2505-undefined) | none |
| AP2505_002 (quote B) | 1150 | 2T1BURHE0NC505002 | 6595 | client.stage.2505002@yopmail.com | Financing, roadside CA$250.00 | none |
| AP2505_006 (quote C) | 1151 | 2T1BURHE0NC505006 | 6596 | client.stage.2505006@yopmail.com | Roadside CA$250.00 only | none |
| AP2505_007 (quote D) | 1152 | 2T1BURHE0NC505007 | 6597 | client.stage.2505007@yopmail.com | Financing, roadside CA$250.00 (one refused contract submit) | none |
| AP2505_009 (quote E) | 1153 | 2T1BURHE0NC505009 | 6598 | client.stage.2505009@yopmail.com | Financing, roadside CA$250.00 (one refused submit) | none |
| AP2505_008 (own quote) | 1154 | 2T1BURHE0NC505008 | 6599 | client.stage.2505008@yopmail.com | Financing, roadside CA$250.00 (one refused submit) | none |

The stray record (vehicle 1149, quote 6594) came from a first build attempt whose case number did not reach the script, so "undefined" replaced `{NNN}`; it was not used by any case and is listed so the next cycle knows it is there. Every roadside product: first tier "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$", Policy Sale price 250. **No contract, no invoice was created.** Not touched: AP-2477's quotes 6588–6592 and vehicles 1143–1147; this ticket's 2026-11-03 records 6568–6573 / 1130–1135 (only a read-only GET of the contract page on 6568 and 6570); contracts 2697/2698 and vehicle 915; AP-2498 / AP-2494 / AP-2504 records. The data-building snippet is kept as `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_build-script_2026-11-07.js.txt` (no credential in it).

---

## Environment Observations

- **Environment: Dev.** All pages answered normally; no HTTP 5xx anywhere in this run.
- **AP-2505 is now visible on Dev.** The Roadside row's Generate Contract is a plain link to `/quote/{id}/road-side-protection-create-contract` (Edit and Delete still open the modal), and the page renders (HTTP 200) for new and old quotes. **AP-2518's symptom no longer reproduces** — for the Gate C/D reviewer: AP-2518 (still Backlog) could be re-tested and closed on this evidence.
- **The page that opens is a contract form of its own** (form `quote_auto_shield_create_contract`, POST to the same address, browser validation not disabled but the button submits without it): left `col-md-7` "Vehicle identification" (collapsed) + "Owner identification" (First name*, Last name*, Address*, Address 2, City*, Province*, Postal code*, Email*, Home phone*, Drivers license, Tax exemption band); right `col-md-5` "Product Summary" (Road Side Protection Option, Delivery date, Purchase date, Policy Sale price*, Purchase type CASH/FINANCE/LEASE/LINE OF CREDIT, Financed amount, Interest rate, Financing company, Stock number*, In service date* "The date must be the same year as the vehicle's year.") + red "Generate Contract" button; hidden tier radios.
- The Financing company list on this page (Fédération des caisses Desjardins, BMO, Banque Scotia …) is a different list from the quote's financing page (AutoCapital Canada id 39, …), so the quote's lender cannot be pre-selected.
- The quote details page shows a blue "No entities found" alert and "No applicant" under the flash messages on every new quote (not an error page).

---

## Re-run after review R3 round 1 — AP2505_007, AP2505_008, AP2505_010 (2026-11-07)

**Environment:** Dev · **Window:** 2026-11-07T10:34:41Z → 10:38:36Z · **Executed by:** stlc-worker (`--from design --until correct-cases`, scoped to AP2505_007/_008/_010) · login through the dealer login form only (credentials from the `env` source's Dev section, not written here) · viewport 1280 × 800 · `?_locale=en`.

**Why:** review R3 round 1, finding F-1 (Blocker): the first-pass AP2505_007 FAIL was recorded although its submit never had "valid form values" — Stock number and In service date were empty and required, and no step entered them. The first-pass results of AP2505_007 (FAIL), AP2505_008 (BLOCKED) and AP2505_010 (BLOCKED) above are **withdrawn**; the results below replace them. design (correction mode) changed AP2505_007 step 3 (fill Stock number `STK2505007`, In service date `2022-06-01`, every other value as pre-filled; a refusal naming another field the case does not fill → BLOCKED for Gate C) and AP2505_008's own-build fallback (`STK2505008`, `2022-06-01`), with Revisions rows in `AP2505_TestCases_006-010.md`. Quotes 6597 and 6599 were reused (no contract on either), as the finding allows.

### Re-run summary

| TC ID | First pass (withdrawn) | Re-run | Reason |
|---|:---:|:---:|---|
| AP2505_007 | ❌ FAIL | 🚫 BLOCKED | Submit refused: "The phone number is invalid. Please ensure it follows the format: ###-###-####." — the pre-filled Home phone, a field the case does not fill (step 3 rule) |
| AP2505_008 | 🚫 BLOCKED | 🚫 BLOCKED | No contract from AP2505_007; own-build fallback (quote 6599) refused with the same phone-format message |
| AP2505_010 | 🚫 BLOCKED | 🚫 BLOCKED | No contract on quote 6597 or 6599; count 0 for VIN `2T1BURHE0NC505007` |

**Whole-ticket counts after this re-run:** 2 PASS (006, 009) · 4 FAIL (001, 002, 003, 005) · 4 BLOCKED (004, 007, 008, 010) · 0 SKIPPED · 0 Not Run — pass rate 20% (2 of 10). **AP2505_007 is no longer a FAIL**, so it does not go to file-bugs.

**For the Gate C reviewer — one point to decide (not judged here).** The case's step 3 rule (added in this correction) makes a refusal that names a field the case does not fill BLOCKED. The Execution Context's AutoShield row says a refusal naming the VIN or AutoShield is BLOCKED and "any other failure at submit (… no contract) is a FAIL". The phone message names neither; the Home phone `5145550501` is pre-filled by the page from the quote's client, whose form accepted that value. Whether the page should pre-fill or accept the phone in `###-###-####` form is not stated by AP-2505 (record-only under Q-008 / Q-009), so this run records BLOCKED, not FAIL. If R3 wants a further correction, the next step 3 would also set Home phone to `514-555-0501`. The two existing contracts on the list carry their phone as `092-921-5333`.

### AP2505_007 — Step Results (re-run)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote D (6597, built in the first pass by this step); note list rows and newest invoice | Roadside row with ⋯; counts recorded | Quote **6597** "#6597 - Roadside Owner2505-007 2T1BURHE0NC505007", vehicle **1152**, financing AutoCapital Canada (25,000.00$, 60 months, 6.99%), Roadside Protection CA$250.00 with ⋯ (Edit · Generate Contract · Delete), no contract number. `/road-side-protection-contracts` = **2 rows** (2698, 2697 — VIN 1FAHP35NX8W239204, vehicle 915, untouched); top invoice on `/invoice` = **944** | ✅ | Reuse allowed by F-1 and the Test Data row |
| 2 `[Pre-Condition]` | ⋯ → Generate Contract | Page loads pre-filled; 500 → BLOCKED — AP-2518 | Clicked the menu item → `/quote/6597/road-side-protection-create-contract`, page loaded (form `quote_auto_shield_create_contract`), pre-filled: VIN 2T1BURHE0NC505007, Roadside / Owner2505-007, 300 Rue Test, Montréal, Québec, H2X 1Y4, client.stage.2505007@yopmail.com, Home phone 5145550501, delivery/purchase date 2026-11-07, sale price 250.00, Purchase type CASH, financed 25000.00, rate 6.9900, Financing company "Choose", first tier checked | ✅ | AP-2518 not reproduced |
| 3 | Record Stock number / In service date; fill `STK2505007` and `2022-06-01`; everything else as pre-filled; click Generate Contract once | No error page, no 5xx; record landing page and messages (Q-009); refusal naming another field the case does not fill → BLOCKED | Recorded (not judged, Q-008 / Q-009): **Stock number** and **In service date** were both shown **empty** and marked **required**; In service date is a datepicker text field (format `yyyy-mm-dd`, like Delivery date) with the hint "The date must be the same year as the vehicle's year." Filled Stock number `STK2505007`, In service date `2022-06-01` (both read back). One click → `POST /quote/6597/road-side-protection-create-contract => 302` → `GET /quote/6597/details => 200` (about 10 s). Red flash on the quote page: **"One or more validation errors occurred.The phone number is invalid. Please ensure it follows the format: ###-###-####."** No success message, no error page, no 5xx | 🚫 | BLOCKED — the refusal names the Home phone, which the page pre-fills and the case does not fill (step 3 rule); see the Gate C point above |
| 4 | Open quote D details, then the contract list | Both load | `/quote/6597/details` 200 — Roadside row still CA$250.00 with ⋯ → Generate Contract; `/road-side-protection-contracts` 200 | ✅ | — |
| 5 `[Verification]` | Contract list, quote D's row, invoices | One more contract row for VIN …505007 | Not judged (case BLOCKED at step 3). Observed: list still **2 rows** (2698, 2697); quote D's row still offers Generate Contract (no contract id, no PDF); top invoice still **944** | 🚫 | Blocked by step 3 |

**Screenshots / evidence:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07r2PhoneFormatRefused_blocked.png` — quote 6597 after the submit, with the phone-format flash
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step5-Nov07r2ContractListUnchanged_blocked.png` — contract list with only 2698 and 2697
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07r2-network_blocked.txt` — request lines (method, URL, status) for 007 and 008

### AP2505_008 — Step Results (re-run)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote D's contract, or build own (008) as AP2505_007 steps 1–3 with `STK2505008` / `2022-06-01` | A roadside contract exists | AP2505_007 made no contract → own-build fallback on reused quote **6599** ("#6599 - Roadside Owner2505-008 2T1BURHE0NC505008", vehicle 1154, financing + roadside CA$250.00, no contract). `GET …/quote/6599/road-side-protection-create-contract => 200`; Stock number and In service date empty and required (recorded); filled `STK2505008` / `2022-06-01` (read back with VIN 2T1BURHE0NC505008, Last name Owner2505-008, Home phone 5145550501, sale price 250.00). One click → `POST … => 302` → `/quote/6599/details` 200 with the same flash "One or more validation errors occurred.The phone number is invalid. Please ensure it follows the format: ###-###-####."; Roadside row still offers Generate Contract | 🚫 | BLOCKED — by the case's step 1 rule: AP2505_007 BLOCKED and the new build hit the same refusal |
| 2–5 | Details page, PDF links | — | Not run | 🚫 | Blocked by step 1 |

**Screenshot:** `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step1-Nov07r2PhoneFormatRefused_blocked.png` — quote 6599 after the submit, same flash

### AP2505_010 — Step Results (re-run)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the quote in use; count rows for its recorded VIN (≥ 1 required) | Row shows the contract id; count ≥ 1 | Neither quote D (6597) nor AP2505_008's quote (6599) holds a contract — both Roadside rows still show CA$250.00 with ⋯ → Generate Contract. Rows on `/road-side-protection-contracts` for VIN `2T1BURHE0NC505007` = **0** (list holds only 2698 and 2697, read 10:38Z) | 🚫 | BLOCKED — "quote's contract not on the contract list" (Test Data rule: blocked by the reason that stopped AP2505_007). Step 3 (step under test) not reached, so no FAIL |
| 2–5 | — | — | Not run | 🚫 | — |

**Screenshot:** `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_010-step1-Nov07r2NoContractCount0_blocked.png` — the contract list with only 2698 and 2697

### Records (re-run)

- **Created:** nothing new — no vehicle, quote, client, **contract or invoice** was created in the re-run. Contract list before and after: 2698, 2697 (2 rows). Top invoice before and after: 944.
- **Changed:** quotes 6597 and 6599 each received one more refused contract submit (Stock number / In service date values were not saved anywhere visible — the quote pages show no contract).
- **Leaves behind (review F-3, note):** the stray first-pass build — vehicle **1149** (VIN `2T1BURHE0NC505undefined`) and quote **6594** (client `Roadside Owner2505-undefined`, `client.stage.2505undefined@yopmail.com`, financing + roadside CA$250.00, no contract) — stays on Dev; it is now also listed under "Leaves behind" in the test-case file's Execution Context. Never reuse it.
- **Duplicate screenshot names (review F-2, note):** the first pass used the same descriptive name `…Nov07PageOpensProductSummary_fail.png` for AP2505_001 step 3 and AP2505_002 step 5 (different case prefixes, different quotes 6593 / 6595), and AP2505_006 step 4 / step 5 hold the same page state under two names. The files are kept as they are; this re-run uses an `r2` marker in every new name (`…Nov07r2…`) so none of them collides with a first-pass file.
- Observation, not judged: the quote page's "Summary of products" shows the vehicle's "Delivery date: Nov 6, 2026" for a vehicle step saved with Delivered at 2026-11-07 (contract page shows 2026-11-07).

---

## Re-run after review R3 round 2 — AP2505_007, AP2505_008, AP2505_010 (2026-11-07)

**Environment:** Dev · **Window:** 2026-11-07T10:48:57Z → 10:52:45Z · **Executed by:** stlc-worker (`--from design --until correct-cases`, scoped to AP2505_007/_008/_010) · login through the dealer login form only (credentials from the `env` source's Dev section, not written here) · viewport 1280 × 800 · `?_locale=en`.

**Why:** review R3 round 2, findings F-13 (Blocker) and F-14 (Major). The round-1 re-run results above (007, 008, 010 all BLOCKED on the phone-format refusal) are **withdrawn**; the results below replace them. design (correction mode) changed `AP2505_TestCases_006-010.md`: AP2505_007 step 3 now also records the pre-filled Home phone and fills Home phone `514-555-0501`; its expected result is the reviewer's outcome rule word for word (a refusal that states a format → correct only that field, at most 3 submits; any other failure → FAIL against AC 4; still refused after the third submit → BLOCKED). The same rule is in AP2505_008's own-build fallback. The round-1 sentence that made an unfilled-field refusal BLOCKED is deleted, and the Execution Context "AutoShield" row is unchanged. Revisions rows cite "Review R3 round 2, F-13" / "F-14". Quote 6597 was reused as F-13 allows. Quote 6599 was not needed, because 007 made a contract that 008 then used.

### Re-run summary

| TC ID | Round-1 re-run (withdrawn) | Re-run R3 round 2 | Reason |
|---|:---:|:---:|---|
| AP2505_007 | 🚫 BLOCKED | ✅ PASS | The first submit with Home phone `514-555-0501` created AutoShield roadside contract **2782**; the list went from 2 to 3 rows, with VIN `2T1BURHE0NC505007` and client "Roadside Owner2505-007" |
| AP2505_008 | 🚫 BLOCKED | ✅ PASS | The details page of contract 2782 loads (contract id, VIN, client, en/fr PDF links); both PDFs open as PDFs and carry RHTWQ-2782, the VIN and the client name |
| AP2505_010 | 🚫 BLOCKED | ✅ PASS | Quote 6597's row shows "Contract #2782" (no ⋯); typing the create-contract address redirects (302) to the contract details page; the count for the VIN stays at 1 |

**Whole-ticket counts after this re-run:** 5 PASS (006, 007, 008, 009, 010) · 4 FAIL (001, 002, 003, 005) · 1 BLOCKED (004) · 0 SKIPPED · 0 Not Run = 10. Pass rate **50 %** (5 of 10). Gate C branch for AP2505_007/_008/_010 (review round 2, item 3): **"The contract is created → no bug for AP2505_007"**. AP2505_008 and AP2505_010 have no FAIL.

### AP2505_007 — Step Results (re-run R3 round 2)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse quote D (6597); note the list rows and the newest invoice | Roadside row with ⋯; counts recorded | Quote **6597** "#6597 - Roadside Owner2505-007 2T1BURHE0NC505007", vehicle **1152**, Roadside Protection CA$250.00 with ⋯ (Edit · Generate Contract · Delete), no contract number. `/road-side-protection-contracts` = **2 rows** (2698, 2697); top invoice on `/invoice` (Pending payment) = **944** (10:49Z) | ✅ | Reuse allowed by F-13 |
| 2 `[Pre-Condition]` | ⋯ → Generate Contract | Page loads pre-filled; 500 → BLOCKED — AP-2518 | Clicked the menu item → `/quote/6597/road-side-protection-create-contract`. The page loaded pre-filled: VIN …505007, Roadside / Owner2505-007, 300 Rue Test, Montréal, Québec, H2X 1Y4, client.stage.2505007@yopmail.com, Home phone `5145550501`, delivery/purchase date 2026-11-07, sale price 250.00, Purchase type CASH, financed 25000.00, rate 6.9900, Financing company "Choose", tier "Protection Hasards PNEU + ROUE \| Standard \| 12 months \| 200$" | ✅ | AP-2518 not reproduced |
| 3 | Record Stock number, In service date and the pre-filled Home phone; fill `STK2505007`, `2022-06-01` and `514-555-0501`; click Generate Contract once and wait up to 30 s | No error page, no 5xx; record the landing page and messages (Q-009); outcome rule of F-14 | Recorded, not judged (Q-008 / Q-009): **Home phone pre-filled as `5145550501`** (no dashes). **Stock number and In service date were not empty this time.** They showed `STK2505007` / `2022-06-01`, the values from the refused round-1 submit, which stayed on the quote (round 1 recorded both fields as empty and required). The accessibility tree shows no "*" on either label. Filled Stock number `STK2505007`, In service date `2022-06-01` and Home phone `514-555-0501`, and read them back. **One** click (1 of the 3 submits allowed). After about 20 s the browser landed on `/quote/6597/details` with the green alert **"The Roadside protection coverage has been saved successfully"**. There was no error page, no 5xx and no other message. The Roadside Protection row now reads "Roadside Protection — Contract #2782" (link to `/quote/6597/auto-shield-contract/2782`), with a download icon (`/quote/6597/road-side-protection-contract-download`) and no ⋯ | ✅ | Contract created on the first submit. There was no refusal, so no correction submit |
| 4 | Open quote D's details, then the contract list | Both load | `/quote/6597/details` 200; `/road-side-protection-contracts` 200 | ✅ | — |
| 5 `[Verification]` | Check the contract list, quote D's row and the invoices | One more row, with an Autoshield id, VIN …505007 and client Roadside Owner2505-007 | The list has **3 rows** (was 2). New top row: **2782 · 2T1BURHE0NC505007 · Roadside Owner2505-007 · 514-555-0501 · 250.00 $ · Details** (`/quote/6597/auto-shield-contract/2782`). Recorded (Q-009 / Q-010): the price is 250.00 $. Quote D's row shows "Contract #2782" and a PDF download, and "⋯ → Generate Contract" is no longer offered. **No new invoice:** the top of `/invoice/all` is still **944** (a warranty invoice of 2026-11-01) | ✅ | The invoice result is only recorded (Q-009: there is no Dev baseline for a roadside invoice) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07r3BeforeSubmitPrefilled_pass.png` — the contract page before the submit (pre-filled phone `5145550501`; Stock number and In service date holding the round-1 values)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step3-Nov07r3ContractCreated2782_pass.png` — the page shown after the submit: quote 6597 with the success alert and "Contract #2782"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_007-step5-Nov07r3ContractList3Rows_pass.png` — the contract list with 2782, 2698 and 2697

### AP2505_008 — Step Results (re-run R3 round 2)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Use quote D's contract, or build one | A roadside contract made through the new page exists | Quote D's contract **2782**, made by AP2505_007 through `/quote/6597/road-side-protection-create-contract`. The own-build fallback was not needed, and quote 6599 was not touched in this re-run | ✅ | — |
| 2 | Open the contract details from quote D's row | The details page loads, no 5xx | Clicked "Contract #2782" on quote 6597's Roadside row → `/quote/6597/auto-shield-contract/2782` in the same tab, GET 200, heading "Roadside protection contract", actions Back · Cancel · en · fr | ✅ | — |
| 3 `[Verification]` | Inspect the details page | Contract id, VIN, client and at least one PDF link | Contract ID **2782**, App Number RHTWQ-2782, Status Code OPEN_SUBMITTED, Effective 2026-11-07T10:50:06.75, Expiry 2027-11-07T10:50:06.75, Term 12, Tier Standard, Product "Protection Hasards PNEU + ROUE", Client id 2801, client.stage.2505007@yopmail.com, Roadside / Owner2505-007, phone 514-555-0501, 300 Rue Test, Montréal, QC, H2X 1Y4, CAN. Vehicle id 2792, VIN **2T1BURHE0NC505007**, 2022 Toyota Corolla, stockNumber STK2505007, inServiceDate 2022-06-01, odometer 15000, purchasePrice 20000, purchaseType CASH, financedAmount 25000, interestRate 6.99. Total Tax CAD 0, Sale Price With Tax CAD 250. PDF links **en** and **fr** (`/auto-shield-contract-pdf?pdfLink=…`), plus an embedded PDF frame | ✅ | Recorded only: vehicleConditionCode is "used" while purchaseState is "New" and isNew is 1; engineSize is 0; the lender is empty; the page shows tax 0 while the PDF shows 29.95 |
| 4 | Click each PDF link (en, then fr) | Each opens in a new tab or downloads | en → a new tab `/auto-shield-contract-pdf?pdfLink=…02c37c30…` showing "autoShield.pdf". fr → a new tab `…9297ec31…` showing "autoShield.pdf". Both tabs closed | ✅ | — |
| 5 `[Verification]` | Inspect each PDF | Served as a PDF; the VIN and client match | **en**: PDF viewer, 7 pages, "Road Hazard Protection UNLIMITED Service Contract", Contract No. RHTWQ-2782, Owner2505-007 / Roadside, 514-555-0501, VIN 2T1BURHE0NC505007, Stock STK2505007, Toyota Corolla 2022, 250.00 + 29.95 = 279.95, 12 months, 2026-11-07 → 2027-11-07. **fr**: PDF viewer, 5 pages (the page footer reads "Page 1 de 8"), "Protection Hasards Routiers ILLIMITÉ Contrat de service", RHTWQ-2782, with the same client, VIN and amounts. The VIN and client name match the quote | ✅ | Recorded only: the en footer reads "Page 1 of 7"; the fr viewer shows 5 pages while its footer reads "de 8"; both PDFs tick "Cash" and "New" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step3-Nov07r3ContractDetails2782_pass.png` — the details page of contract 2782
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step5-Nov07r3PdfEn_pass.png` — the English PDF, page 1
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step5-Nov07r3PdfFr_pass.png` — the French PDF, page 1

### AP2505_010 — Step Results (re-run R3 round 2)

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open quote D (6597); count the rows for the VIN recorded by AP2505_007 (`2T1BURHE0NC505007`) | The row shows the contract id; count ≥ 1 | The Roadside row shows "Contract #2782". Rows for `2T1BURHE0NC505007` on `/road-side-protection-contracts` = **1** (10:50Z) | ✅ | Precondition met |
| 2 `[Verification]` | Inspect the Roadside row | Record whether ⋯ / Generate Contract is still offered (Q-010) | There is no ⋯ menu and no "Generate Contract". They are replaced by the "Contract #2782" link and a PDF download icon | ✅ | Recorded (Q-010) |
| 3 | Type `/quote/6597/road-side-protection-create-contract` and press Enter; click nothing | No error page, no 5xx; record what happens (Q-010) | `GET /quote/6597/road-side-protection-create-contract => 302` → `GET /quote/6597/auto-shield-contract/2782 => 200`. The browser is redirected to the existing contract's details page, and no message is shown | ✅ | Step under test — no 5xx |
| 4 | Open `/road-side-protection-contracts` | The list loads | 200 | ✅ | — |
| 5 `[Verification]` | Count the rows for the same VIN | Equal to step 1 (≥ 1) | **1**. The VIN still has only contract 2782 (list: 2782, 2698, 2697), so no second contract was made | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_010-step3-Nov07r3RedirectToContract2782_pass.png` — the page reached after typing the create-contract address (the details of contract 2782)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_010-step5-Nov07r3CountStill1_pass.png` — the contract list, with one row for the VIN

### Records (re-run R3 round 2)

- **Created (leaves behind):** AutoShield roadside contract **2782** (App Number RHTWQ-2782, status OPEN_SUBMITTED, 2026-11-07 → 2027-11-07) on quote **6597** / vehicle **1152** (VIN `2T1BURHE0NC505007`), dealer 1380. AutoShield's ids for it are client **2801** and vehicle **2792**. It also left two PDFs on the AutoShield test storage (en `…02c37c30…`, fr `…9297ec31…`). **No invoice** was created: the top invoice was 944 before and after. The `cleanup` source is missing, so nothing is removed.
- **Changed:** the client of quote 6597 now shows Home phone **514-555-0501** on the quote page (it was `5145550501`). The contract submit saved the dashed phone back to the client. Quote 6599 was not touched.
- **Observation for Gate C item 4 (not filed, not judged):** the contract page still pre-fills Home phone `5145550501` from the client. With `514-555-0501`, the contract is created on the first submit, so the round-1 refusal depended only on the phone format.
- **Observation (not judged):** when the page was reopened, Stock number and In service date showed the values of the refused round-1 submit. That submit saved them to the quote even though no contract was made.

# Execution Log — AP-2410 (bug re-test)

**Environment:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca` (`tools.md` `execution_env` = Dev; the QA's decision of 2026-11-08 to re-test AP-2410 on Dev while it is in Jira status QA)

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, `--from execute --until correct-cases`)
**Date:** 2026-11-08
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-08T03:30:30Z → 2026-11-08T03:37:35Z; re-run of AP2410_004 after review R3: 2026-11-08T03:53:03Z → 2026-11-08T03:55:47Z (see *Re-run after review R3*)
**Login:** Dealer account from the `env` source, "Dev Environment" section (Dealer ID 1380). The credential is not copied here.
**Test cases:** `qa-artifacts/3-test-cases/AP2410_TestCases_001-004.md` — Gate B rule B3, decided by the orchestrator's qa-reviewer (R2 round 2); run order 001 → 002 → 003 → 004.
**Environment check:** the `env-check` source is `missing`; the orchestrator's environment health check passed before this run.

| Metric | Value |
|---|:---:|
| Total test cases | 4 |
| Passed | 4 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (4 of 4)** |

**Test data created on Dev (left behind):** quote **6696** (`{QID}`), client `Retest Chubb2410-001` / `client.stage.2410001@yopmail.com`, on vehicle 915 (attached by `fromVehicleId`, Edit vehicle never opened); its financing (Financing, 25,000.00$, Residual 0.00$, Term 12, 6.99 %, AutoCapital Canada, Monthly 2,163.05$, date of birth 1985-06-15); the co-applicant **Coapp Retest2410** (date of birth 1988-04-10, added by the AP2410_004 re-run); and a saved Chubb creditor insurance quote — the last one saved is the AP2410_004 re-run's (PM30, English, Tax exempt Yes, Life Decreasing Borrower, Critical illness Decreasing Co borrower, Disability 30D_RETRO Both, term 12, CA$150.92 /m). No Chubb contract was generated. No reserved record (quotes 6588–6695, contract 2782, PNA-0000000021/22, invoices 945/946) was touched.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2410_001 | Chubb insurance quote with every required option filled and PM30 saves without an error | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_001-step5-CreditorsRowCoveragePM30_pass.png` | Saved with "Chubb insurance quote saved successfully"; CA$15.74 /m; Coverage table read on the details row (see step 5) |
| AP2410_002 | Chubb insurance quote in French with PM50 saves without an error | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_002-step5-CreditorsRowCoveragePM50Francais_pass.png` | Saved PM50 / Français, CA$21.78 /m; reopened form shows PM30 (observation O-1) |
| AP2410_003 | Insurance Quick Quote with PM30 shows priced results without an error | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_003-step5-QuickQuotePricedTables_pass.png` | Two priced tables in place, no banner |
| AP2410_004 | Replaying the reported inputs no longer returns "Debtor is -1 years old" | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step5-CreditorsRowCoBorrowerBoth_pass.png` | Result set by the re-run after review R3 (co-applicant added): Critical illness Co borrower and Disability Both saved, CA$150.92 /m, no "years old", no HTTP. The first run (no co-applicant, borrower-only) is kept below as the Q-002 record |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2410_001 — Getting a Chubb insurance quote with every required option filled and rate table PM30 saves without an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in on Dev; `/vehicle/915/details` → Create quote → fill client → Save; Add a financing (modal) with the Test Data values → Save; record Term, DOB, Residual, co-borrower | Details page `#{QID} - Retest Chubb2410-001 1FAHP35NX8W239204`, Ford Focus 2008, then the financing with "Financing saved"; "No applicant" expected | Create quote opened `/quote/new/client?fromVehicleId=915`; Save → URL = `/quote/6696/details`, flash "Client saved", heading = "#6696 - Retest Chubb2410-001 1FAHP35NX8W239204", Vehicle card "Ford Focus 2008 — VIN: 1FAHP35NX8W239204 Mileage: 5000km Designation: COMMERCIAL", Financing card "You have not added financing details yet". "Add a financing" opened a modal with "Interest rate"; values posted: dateOfBirthText = 1985-06-15, province = Québec, type = Financing, baseAmount = 25000, residualAmount = 0, paymentFrequency = Monthly, termMonths = 12, interestRate = 6.99, financingCompany = AutoCapital Canada. Save → flash "Financing saved"; Financing card = "Financing 12 months · AutoCapital Canada · Type: Financing · Financed amount: 25,000.00$ · Residual: 0.00$ · Term: 12 · Interest rate: 6.9900% · Payment amount: 2,163.05$ Monthly"; Co-applicant block = "No applicant" | ✅ | `{QID}` = **6696**. Recorded: Term 12, Residual 0.00$, no co-borrower. The details card does not show the date of birth; the financing form on `/quote/6696/insurance` holds `1985-06-15`. The card updated at once — no reload needed (executor note 2 not triggered). Creditors insurance row showed "- None Selected -" with a "+" link to `/quote/6696/insurance` |
| 2 | Open `/quote/{QID}/insurance`; open the Form dropdown and record every option (label + value) | Page opens, Financing block collapsed to "Financing · 12 months · 25,000.00$ · AutoCapital Canada", Creditors Insurance Quote form below, no `alert` banner | URL = `/quote/6696/insurance`; heading = "Insurance for Retest Chubb2410-001"; Financing block = "Financing · 12 months · 25,000.00$ · AutoCapital Canada · 2,163.05$ Monthly" with Edit; "Creditors Insurance Quote" form with Language, Tax exempt, Form, Life, Critical illness, Disability blocks and Get Quote. `alert` banners = none; text "HTTP" present = false. Form options: `GC6201MQ:PM30` = "Monthly Premium PM30", `GC6201MQ:PM50` = "Monthly Premium PM50" (no RT option) | ✅ | Q-001 record: only PM30 and PM50 are offered — no RT rate table. Life options visible: Decreasing (DECREASING_ACC "Decreasing Acc." is in the list but hidden); every "For" drop-down offers only Borrower |
| 3 | Language English, Tax exempt No, Form = `GC6201MQ:PM30`, Life Decreasing / 12 / Borrower; Critical illness and Disability unset | Each field shows the value; Form holds `GC6201MQ:PM30`; Life Term = 12 | language = E (English); taxExempt = 0 (No); formCompound = GC6201MQ:PM30 ("Monthly Premium PM30"); lifeType = DECREASING; lifeTerm = 12; lifeFor = BORROWER; criticalIllness* and disability* fields empty | ✅ | Form label on Dev = "Monthly Premium PM30" (same as staging). Critical illness and Disability carry a "*" on their labels but were accepted empty |
| 4 | Click Get Quote; wait ≥ 10 s; record any `alert` banner | Redirect to `/quote/{QID}/details` with "Chubb insurance quote saved successfully"; no `alert` banner, no "HTTP" text, no "Debtor is -1 years old" | URL = `/quote/6696/details`; flash = "Chubb insurance quote saved successfully"; other `alert` elements = "No applicant" (Co-applicant block) and "No entities found" (Compliance documents sent) — both standing page notices, not errors; text "HTTP" present = false | ✅ | The reported error does not occur |
| 5 `[Verification]` | Read the Creditors insurance row; open `/quote/{QID}/insurance` and read the Coverage table, Language and Tax exempt | Row shows `CA$… /m`; reopened page Coverage table shows Rate table PM30 and Life (Decreasing, BORROWER, 12) with a premium; Language English; no alert | Row = "Creditors insurance CA$15.74 /m". Row details (chevron) = "Form: GC6201MQ · Rate table: PM30 · Language: English · Tax exempt: No · Coverage: Life Decreasing BORROWER 12 — 15.74$ + tax 1.42$ = 17.16$ · Equivalent Single Premium 151.78$ · Commission (30%) 45.53$". Reopened `/quote/6696/insurance` (page, and also the row ⋯ → Edit modal): **no Coverage table is shown**; the form holds English / No / PM30 / Decreasing / 12 / Borrower; no `alert` banner, no "HTTP" text | ✅ | Every value the step checks was found, but the Coverage table is in the Creditors insurance row's chevron details on `/quote/6696/details`, not on the reopened insurance page or modal as the case says (observation O-3 — flagged for Gate C, R3) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_001-step4-QuoteSavedFlash_pass.png` — quote 6696 details with the flash "Chubb insurance quote saved successfully" and the Creditors insurance row at CA$15.74 /m
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_001-step5-CreditorsRowCoveragePM30_pass.png` — details page with the Creditors insurance chevron open: Rate table PM30, English, Tax exempt No, Life Decreasing BORROWER 12 at 15.74$
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_001-step5-ReopenedInsurancePageNoCoverageTable_pass.png` — reopened insurance page: form holds the saved PM30 values, no Coverage table, no error banner

### AP2410_002 — Getting a Chubb insurance quote in French with rate table PM50 saves without an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/{QID}/details`; record Term, DOB, co-borrower and the Creditors insurance row | Heading `#6696 - Retest Chubb2410-001`, Ford Focus 2008, the financing AP2410_001 added, "No applicant" | Heading = "#6696 - Retest Chubb2410-001 1FAHP35NX8W239204"; Vehicle = Ford Focus 2008 (VIN 1FAHP35NX8W239204); Financing = 12 months, 25,000.00$, Residual 0.00$, AutoCapital Canada; Co-applicant = "No applicant"; Creditors insurance row = CA$15.74 /m (AP2410_001's quote) | ✅ | Reused 6696, no second quote. DOB 1985-06-15 (from the financing form) |
| 2 | Open `/quote/{QID}/insurance` | Page opens with the collapsed Financing block and the form; no `alert` banner; record any Coverage table | Heading = "Insurance for Retest Chubb2410-001"; Financing block = "Financing · 12 months · 25,000.00$ · AutoCapital Canada · 2,163.05$ Monthly"; form present; `alert` banners = none; Coverage table = not shown | ✅ | Restored values: English, No, PM30, Decreasing, 12, Borrower |
| 3 | Set Français, No, Form = `GC6201MQ:PM50`, Life Decreasing / 12 / Borrower | Each field shows this case's value, not the restored ones | Final values: language = F (Français); taxExempt = 0 (No); formCompound = GC6201MQ:PM50 ("Monthly Premium PM50"); lifeType = DECREASING; lifeTerm = 12; lifeFor = BORROWER; Critical illness and Disability empty | ✅ | Changing Form cleared the Life type back to "Select type" (Life Term and For kept); Life "Decreasing" was chosen again before Get Quote (observation O-4). Dev PM50 label = "Monthly Premium PM50" |
| 4 | Click Get Quote; wait ≥ 10 s | Redirect with "Chubb insurance quote saved successfully"; no `alert` banner, no "HTTP" | URL = `/quote/6696/details`; flash = "Chubb insurance quote saved successfully"; other `alert` elements = "No applicant", "No entities found"; "HTTP" present = false | ✅ | No error |
| 5 `[Verification]` | Read the row; open `/quote/{QID}/insurance` and read the Coverage table, Language, Tax exempt | Row `CA$… /m`; Coverage table PM50, Life Decreasing BORROWER 12 with a premium; Language Français; no alert | Row = "Creditors insurance CA$21.78 /m". Row details = "Form: GC6201MQ · Rate table: PM50 · Language: Français · Tax exempt: No · Life Decreasing BORROWER 12 — 21.78$ + 1.96$ = 23.74$ · Equivalent Single Premium 210.02$ · Commission (50%) 105.01$". Reopened `/quote/6696/insurance`: no Coverage table; Language = Français; Tax exempt = No; **Form = "Monthly Premium PM30"** (no option carries `selected`, so the browser shows the first); no `alert`, no "HTTP" | ✅ | Every checked value matches (row details). Two deviations flagged for R3: Coverage table location (O-3), and the reopened form does not restore the saved PM50 (O-1) — the Form field is not one this step checks |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_002-step5-CreditorsRowCoveragePM50Francais_pass.png` — details page, Creditors insurance chevron open: Rate table PM50, Français, Life Decreasing BORROWER 12 at 21.78$
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_002-step5-ReopenedFormShowsPM30NotSavedPM50_pass.png` — reopened insurance page: Language Français kept, but Form shows Monthly Premium PM30 instead of the saved PM50

### AP2410_003 — Insurance Quick Quote with rate table PM30 shows priced results without an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quick-insurance-quote` | "Creditors Insurance Quick Quote" on the Creditors insurance tab; Form lists PM30 and PM50 | URL = `/quick-insurance-quote`; heading = "Creditors Insurance Quick Quote"; tabs "Creditors insurance" / "Gap Insurance"; Form options: value `GC6201MQ:PM30` label "Monthly Premium PM30", value `GC6201MQ:PM50` label "Monthly Premium PM50" | ✅ | Judged on the option values (executor note 1); both labels recorded word for word |
| 2 | Form PM30, DOB 1990-01-01, Monthly payment 500, Term 60, Residual 0 | Each field shows the value | form = GC6201MQ:PM30; borrowerDOB = 1990-01-01; coBorrowerDOB = empty; monthlyPayment = 500; termMonths = 60; residualAmount = 0 | ✅ | Residual was pre-filled 0 |
| 3 | Life Decreasing 60, Critical illness Decreasing 60, Disability 30D_RETRO 60 | Each coverage shows type and term | lifeType = DECREASING, lifeTerm = 60; criticalIllnessType = DECREASING, term = 60; disabilityType = 30D_RETRO ("30 Day Retro"), term = 60 | ✅ | Quick quote Life list also offers Decreasing Residual (unlike the quote page) |
| 4 | Click Get Quote; wait ≥ 10 s | URL stays; no `alert` banner, no "HTTP" | URL = `/quick-insurance-quote`; `alert` banners = none; "HTTP" present = false; field errors = none | ✅ | No error |
| 5 `[Verification]` | Read the area below the form | Priced result tables with premiums; no error | Table 1: Life Decreasing BORROWER 60 — 20.53$ + 1.85$ = 22.38$; Criticalillness Decreasing BORROWER 60 — 20.53$ + 1.85$ = 22.38$; Disability 30 Day Retro BORROWER 60 — 32.03$ + 2.88$ = 34.91$. Table 2: Equivalent Single Premium 3,506.24$, Commission (30%) 1,051.87$. No error anywhere | ✅ | Matches the 2026-10-03 mapping (two tables) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_003-step5-QuickQuotePricedTables_pass.png` — quick quote with the two priced result tables and no banner

### AP2410_004 — Replaying the reported inputs (Tax exempt Yes, co-borrower and Both coverage) no longer returns "Debtor is -1 years old" — Step Results

> First run (2026-11-08, between 03:30:30Z and 03:37:35Z, no co-applicant). Superseded as the case result by *Re-run after review R3* below; kept as the Q-002 record (review R3 round 1, F-1).

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/{QID}/details`; record Term, DOB, Residual, co-borrower and the current creditor quote | Heading `#6696 - Retest Chubb2410-001`; financing from 001; "No applicant"; no co-borrower → Q-002 applies | Heading = "#6696 - Retest Chubb2410-001 1FAHP35NX8W239204"; Financing = Term 12, 25,000.00$, Residual 0.00$, 6.99 %, AutoCapital Canada; Co-applicant = "No applicant". Current creditor quote = Rate table PM50, Français, Tax exempt No, Life Decreasing BORROWER 12, 21.78$ (row CA$21.78 /m) | ✅ | No co-borrower → Q-002 branch: steps 4–5 record-only. DOB 1985-06-15 |
| 2 | Open `/quote/{QID}/insurance` | Page opens; collapsed Financing block; form; no `alert` | Heading = "Insurance for Retest Chubb2410-001"; Financing block "Financing · 12 months · 25,000.00$ · AutoCapital Canada · 2,163.05$ Monthly"; no Coverage table; `alert` = none | ✅ | Restored: Français, No, **PM30** (saved quote is PM50 — O-1), Decreasing, 12, Borrower |
| 3 | English, Tax exempt Yes, Form PM30; Life Residual Value Coverage / 12 / Borrower; Critical illness Decreasing / 12 / Co borrower; Disability 30D_RETRO / 12 / Both | Each field shows the value chosen | Options the Dev form offers: Life = Decreasing only (Decreasing Acc. hidden; **no "Residual Value Coverage"**); Life For, Critical illness For, Disability For = **Borrower only** (no "Co borrower", no "Both"). Final values: language = E; taxExempt = 1 (Yes); formCompound = GC6201MQ:PM30 ("Monthly Premium PM30"); lifeType = DECREASING, lifeTerm = 12, lifeFor = BORROWER; criticalIllnessType = DECREASING, term = 12, For = BORROWER; disabilityType = 30D_RETRO, term = 12, For = BORROWER | ✅ | **Inputs changed from the screenshot** (executor note 3): Life "Residual Value Coverage" → "Decreasing" (closest offered); Critical illness "Co borrower" → "Borrower"; Disability "Both" → "Borrower" — the form offers no co-borrower choice on a financing without a co-applicant (Q-002 observation) |
| 4 | Click Get Quote; wait ≥ 10 s | Q-002 record-only: no error page or 5xx, no banner with an age no recorded DOB produces; record saved or refused | URL = `/quote/6696/details`; flash = "Chubb insurance quote saved successfully"; other `alert` = "No applicant", "No entities found"; "HTTP" present = false; "years old" present = false | ✅ | Q-002 outcome: **saved**. Chubb did not refuse for the residual (Residual 0) |
| 5 `[Verification]` | Read the row; reopen `/quote/{QID}/insurance` | Q-002 record-only: if saved, the reopened page holds the step-3 values, none lost | Row = "Creditors insurance CA$96.54 /m". Row details = "Form: GC6201MQ · Rate table: PM30 · Language: English · Tax exempt: Yes · Life Decreasing BORROWER 12 — 16.25$ + 1.46$ = 17.71$ · Disability 30 Day Retro BORROWER 12 — 64.04$ + 5.76$ = 69.80$ · Criticalillness Decreasing BORROWER 12 — 16.25$ + 1.46$ = 17.71$ · Equivalent Single Premium 930.93$ · Commission (30%) 279.28$". Reopened form = English / Yes / PM30 / Decreasing 12 Borrower / Decreasing 12 Borrower / 30D_RETRO 12 Borrower — every step-3 value kept; no `alert`, no "HTTP" | ✅ | Q-002 recorded. With Tax exempt Yes the coverage rows still show a Tax amount (O-2, flagged for R3) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-step3-FormValuesBeforeGetQuote_pass.png` — the insurance form filled with the replay values actually offered (English, Yes, PM30, three coverages for Borrower, term 12)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-step5-SavedReplayCoverageTaxExemptYes_pass.png` — details page, Creditors insurance chevron open: PM30, English, Tax exempt Yes, Life / Disability / Critical illness rows, CA$96.54 /m

---

## Blocked / Skipped Test Cases

None.

---

## Environment Observations

Observations that are not failures of the checked steps. Each is flagged for the Gate C reviewer (R3); none was filed.

- **O-1 — The reopened insurance form does not restore the saved Form (rate table).** After AP2410_002 saved PM50 (row details "Rate table: PM50"), `/quote/6696/insurance` showed Form "Monthly Premium PM30": the server marks no option `selected`, so the browser falls back to the first. Language, Tax exempt and the coverages were restored. A dealer who reopens a PM50 quote to change something and presses Get Quote would re-price it as PM30 without noticing. No step of these cases checks the Form field on reopen.
- **O-2 — Tax exempt "Yes" still shows tax.** AP2410_004 saved with Tax exempt Yes (row details "Tax exempt: Yes"), yet each coverage row shows a Tax amount (1.46$, 5.76$, 1.46$), the same 9 % as the Tax exempt No quotes. Whether tax-exempt should zero the tax is not stated in the ticket.
- **O-3 — No Coverage table on the reopened insurance page.** The case (from the AP-2499 mapping of 2026-11-02) expects a Coverage table on the reopened insurance page/modal. On this build neither `/quote/6696/insurance` nor the row ⋯ → Edit modal shows one; the same table (Coverage, Term, Monthly Premium, Tax, Monthly Total, Equivalent Single Premium, Commission) is in the Creditors insurance row's chevron details on `/quote/6696/details`. All values the steps check were read there.
- **O-4 — Changing Form clears the Life type.** In AP2410_002 step 3, choosing PM50 reset Life to "Select type" (term and For kept); it had to be chosen again.
- **O-5 — Quote-page coverage choices (Dev).** Life offers Decreasing (Decreasing Acc. is in the list but hidden); Disability shows 30 Day Retro / 30 Day Elim / 30 Day Elim 12M (nine more hidden); every "For" offers only Borrower when the financing has no co-applicant. The quick quote offers more Life types (Decreasing, Decreasing Residual; Acc. variants hidden). "Residual Value Coverage" from the 2026-03-29 screenshot does not exist on Dev.
- **Q-001 record:** the Form drop-down offers only `GC6201MQ:PM30` and `GC6201MQ:PM50` — no RT rate table, on the quote page and on the quick quote.
- **Q-002 record:** on a financing with no co-applicant, the form offers no Co borrower / Both coverage, so the reported co-borrower inputs cannot be entered; the closest borrower-only replay saved without error.
- The dealer Form labels on Dev are "Monthly Premium PM30" and "Monthly Premium PM50" — the same as staging.
- Login page logged 1 console error before sign-in; it did not affect any step.
- **O-6 — The quick-quote result is in French (added after review R3, F-4).** In AP2410_003 step 5 the UI was in English and the quick-quote page has no Language field, yet the priced result is titled "Primes par garantie" and reads "Language: Français" (screenshot `AP2410_003-step5-QuickQuotePricedTables_pass.png`). Recorded as a fact; no source states which language the quick-quote result should use. Also written to the `chubb-insurance.md` Dev note.
- **First-run AP2410_004 step 3 — Disability Term drawn red (added after review R3, F-3).** In the first-run screenshot `AP2410_004-step3-FormValuesBeforeGetQuote_pass.png` the Disability Term field has a red (invalid) border before Get Quote; the save went through regardless. In the re-run no field was invalid before Get Quote (see below).

---

## Re-run after review R3

**Why:** review R3 round 1 (2026-11-08T03:43:39Z), finding F-1 — the first AP2410_004 run sent every coverage for Borrower, so the reported Co borrower / Both inputs were never replayed. The case was revised on 2026-11-08 (s3, add a co-applicant in step 1). Only AP2410_004 was re-run; AP2410_001, 002 and 003 were not.
**Environment:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca`
**When:** 2026-11-08T03:53:03Z → 2026-11-08T03:55:47Z · Chromium (Playwright MCP) · Dealer account from the `env` source, "Dev Environment" section (Dealer 1380; credential not copied)
**Quote:** 6696 (the `{QID}` AP2410_001 created). No other quote, contract or invoice touched; vehicle 915 not edited.

### AP2410_004 (re-run) — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/quote/6696/details`; record financing and current creditor quote; **Add co-applicant** → Coapp / Retest2410 / 1988-04-10 → Save | Heading `#6696 - Retest Chubb2410-001`, Ford Focus 2008, financing from 001, "No applicant" before; after Save flash "Co-applicant saved" and the block shows Coapp Retest2410 with a DOB (may be one day early) | Heading = "#6696 - Retest Chubb2410-001 1FAHP35NX8W239204"; Vehicle = Ford Focus 2008, VIN 1FAHP35NX8W239204; Financing = 12 months, AutoCapital Canada, 25,000.00$, Residual 0.00$, Term 12, 6.9900 %, 2,163.05$ Monthly (DOB 1985-06-15 from the financing form, first run); Co-applicant before = "No applicant"; current creditor quote = CA$96.54 /m (the first run's PM30 / English / Tax exempt Yes, all Borrower). "Add co-applicant" opened a modal (First name*, Last name*, Date of birth* `type=date`, Address, Address2, City, Province, Postal code, Phone). Save → flash "Co-applicant saved"; block = "Coapp Retest2410 · Date Of Birth : Saturday, April 9, 1988" plus `ken@nekken.ca` and `514-690-6330` | ✅ | **Co-borrower present → Q-002 does not apply.** DOB shows one day early (known, not an error). The block also shows an email and phone that were not typed (observation O-7) |
| 2 | Open `/quote/6696/insurance` | Page opens; collapsed Financing block "Financing · 12 months · 25,000.00$ · AutoCapital Canada"; form; no `alert` | Heading = "Insurance for Retest Chubb2410-001"; Financing = "Financing · 12 months · 25,000.00$ · AutoCapital Canada · 2,163.05$ Monthly"; "Creditors Insurance Quote" form present; `alert` banners = none; "HTTP" present = false; Coverage table = not shown (O-3) | ✅ | Restored: English, Yes, PM30, Life Decreasing 12 Borrower, CI Decreasing 12 Borrower, Disability 30D_RETRO 12 Borrower |
| 3 | English, Yes, Form `GC6201MQ:PM30`; Life Decreasing / 12 / Borrower; Critical illness Decreasing / 12 / **Co borrower**; Disability 30D_RETRO / 12 / **Both**; record options and invalid fields | Each field shows the value; Co borrower and Both are offered | "For" options of Life, Critical illness and Disability = **Select coverage, Borrower, Co borrower, Both** (all three). Life types = Decreasing (Decreasing Acc. hidden; no Residual Value Coverage). Final values: language = E (English); taxExempt = 1 (Yes); formCompound = GC6201MQ:PM30 ("Monthly Premium PM30"); lifeType = DECREASING, lifeTerm = 12, lifeFor = BORROWER; criticalIllnessType = DECREASING, term = 12, For = CO_BORROWER; disabilityType = 30D_RETRO ("30 Day Retro"), term = 12, For = BOTH. **Fields shown as invalid before Get Quote: none** (no `is-invalid` class, every field passes validity, no red border) | ✅ | The only input changed from the 2026-03-29 screenshot: Life "Residual Value Coverage" → "Decreasing" (not offered on Dev). Terms 12 = financing term |
| 4 | Click Get Quote; wait ≥ 10 s; record any `alert` banner | Redirect to `/quote/6696/details` with "Chubb insurance quote saved successfully"; no `alert` error banner, no "HTTP", no "years old" | URL = `/quote/6696/details`; flash = "Chubb insurance quote saved successfully"; other `alert` element = "No entities found" (Compliance documents sent — standing page notice); "HTTP" present = false; "years old" present = false | ✅ | **The reported error "Debtor is -1 years old. Age of Debtor is not within the plan limits." does not occur** with Co borrower and Both coverage |
| 5 `[Verification]` | Read the Creditors insurance row and open its chevron; reopen `/quote/6696/insurance` and read the form | Row `CA$… /m`; details PM30, English, Tax exempt Yes, Life / Critical illness / Disability rows each with a premium; reopened form holds the step-3 values; no alert, no HTTP | Row = "Creditors insurance CA$150.92 /m". Details = "Form: GC6201MQ · Rate table: PM30 · Language: English · Tax exempt: Yes · Life Decreasing BORROWER 12 — 16.60$ + 1.49$ = 18.09$ · Disability 30 Day Retro BOTH 12 — 117.72$ + 10.59$ = 128.31$ · Criticalillness Decreasing CO_BORROWER 12 — 16.60$ + 1.49$ = 18.09$ · Equivalent Single Premium 1,455.31$ · Commission (30%) 436.59$". Reopened form = English / Yes / Monthly Premium PM30 / Decreasing 12 Borrower / Decreasing 12 Co borrower / 30 Day Retro 12 Both; no `alert`, no "HTTP", no Coverage table | ✅ | Every step-3 value kept. Form shows PM30 with no option marked `selected` (O-1 — matches here only because PM30 is the first option). Tax exempt Yes still shows tax (O-2). Reopened form re-captured 2026-11-08T04:03:03Z, review R3 round 2 F-1: fresh sign-in, `/quote/6696/insurance` → 200, no Get Quote or Save; English / Yes / PM30 / Decreasing 12 Borrower / Decreasing 12 Co borrower / 30 Day Retro 12 Both, every step-3 value present, no alert, no "HTTP", no invalid field — step 5 stays PASS |

**Result: ✅ PASS (5 of 5 steps).** AP2410_004's result is set from this re-run.

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step3-CoBorrowerBothBeforeGetQuote_pass.png` — the insurance form before Get Quote: English, Yes, PM30, Life Decreasing 12 Borrower, Critical illness Decreasing 12 Co borrower, Disability 30 Day Retro 12 Both; no red field
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step4-QuoteSavedFlashCoBorrower_pass.png` — quote 6696 details with "Chubb insurance quote saved successfully", the co-applicant block and the row at CA$150.92 /m
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step5-CreditorsRowCoBorrowerBoth_pass.png` — Creditors insurance chevron open: PM30, English, Tax exempt Yes, Life BORROWER, Disability BOTH, Critical illness CO_BORROWER with premiums
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step5-ReopenedFormCoBorrowerBoth_pass.png` — reopened insurance form holding the step-3 values (re-captured full page 2026-11-08T04:03:03Z, review R3 round 2 F-1; see the note below on its MD5)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step5-ReopenedFormCoBorrowerBoth_pass.txt` — the re-capture's request line (GET `/quote/6696/insurance` → 200), its time, and every form value read from the page

### Observations from the re-run (not filed — for Gate C)

- **O-7 — Co-applicant block shows contact details not entered.** After saving the co-applicant with only First name, Last name and Date of birth, the block shows email `ken@nekken.ca` and phone `514-690-6330`. These are the email and phone of another client record on Dev (contract APOP01-836; the AP-2377 sample customer), not the dealer's. (Sentence added after review R3 round 2, F-2.)
- **O-8 — Life (Borrower) premium changed with a co-applicant.** With the same Life input (Decreasing, Borrower, 12, PM30, Tax exempt Yes), the premium was 16.25$ without a co-applicant (first run) and 16.60$ with one. No source states the pricing rule; recorded only.
- O-1, O-2, O-3 seen again as described above.

### Step-5 evidence re-capture after review R3 round 2 (F-1)

**When:** 2026-11-08T04:03:03Z · Environment: Dev (v2dev) · fresh sign-in with the dealer account from the `env` source (credential not copied). Read-only: `/quote/6696/insurance` opened by URL (GET → 200, navigation type "navigate"), no Get Quote, no Save, no field touched. Only AP2410_004 step 5 evidence was redone; no other step or case was re-run.

**Observed:** English / Yes / Monthly Premium PM30 (no option `selected`, O-1) / Life Decreasing 12 Borrower / Critical illness Decreasing 12 Co borrower / Disability 30 Day Retro 12 Both; no `alert`, no "HTTP", no "years old", no `is-invalid` field, no Coverage table. Every step-3 value is present, so **step 5 stays PASS**.

**MD5 of the new full-page capture: 2fda7610069c9e08bf8491f0017bd0e9, the same as the step-3 file.** The file was rewritten (its time changed to the re-capture time), yet its bytes match the step-3 file. When it was taken, nothing on the page had focus (`document.activeElement` = BODY), and the Disability select still drew its up caret. That caret is how the page always draws this select, not a sign that the list is open or that step 3 left focus there. The reopened form holds exactly the values set before Get Quote in step 3, on the same layout and viewport, so a full-page PNG of either state comes out pixel for pixel, and therefore byte for byte, the same. The reviewer's check "its MD5 must differ from the step-3 file" cannot be met by an honest capture of an unchanged page. Changing the viewport or the page just to change the hash would prove nothing. The capture is therefore backed by `AP2410_004-rerun-step5-ReopenedFormCoBorrowerBoth_pass.txt`, which holds the capture time, the request line and the field values read from the page at 04:03:03Z.

**How the duplicate happened:** most likely it was not a file copy. At 03:55Z the first re-run took a real full-page capture of the reopened form, and it matched the step-3 capture because the two page states render the same. That cannot be proved from disk, because the old file has been overwritten. Either way, an identical-looking image cannot show on its own that the form was reopened. Evidence for a "reopened page holds the saved values" step needs something that tells the two states apart, such as a request line, a time, or a DOM read like the .txt above.

**Data left behind by the re-run:** co-applicant Coapp Retest2410 (DOB 1988-04-10) on quote 6696's financing; the creditor insurance quote on 6696 now PM30 / English / Tax exempt Yes / Life Borrower, Critical illness Co borrower, Disability Both, CA$150.92 /m. No contract generated.

**Counts after the re-run (whole batch):** 4 PASS / 0 FAIL / 0 BLOCKED / 0 SKIPPED / 0 NOT RUN — pass rate 100% (4 of 4).

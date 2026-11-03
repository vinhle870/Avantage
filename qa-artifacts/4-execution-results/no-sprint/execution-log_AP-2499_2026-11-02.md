# Execution Log — AP-2499

> Written by the **stlc-manual-executor** skill (run by `stlc-ticket-pipeline`, `--from s4 --until s4c`).

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-02 (local, UTC+7) — 2026-11-01T23:54Z to 2026-11-02T00:09Z
**Environment:** Dev (v2dev)
**Base URL:** https://v2dev.garantieavantageplus.ca/ — the "Dev Environment" section of the `env` source (`qa-artifacts/base-test/execute.env.md`). v2staging was never opened, by the user's decision for this run.
**Login:** the shared dealer account from the `env` source, Dev Environment section, typed only into the dealer login form (signed in as "Test QA staging", dealer 1380). For AP2499_013 only, the Dev admin account from the same section was typed into the admin login form to look for a Humania dealer. No credential is reproduced here.
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800, English UI (`?_locale=en`).
**Duration:** 06:54 → 07:09 (local)
**Test cases:** `AP2499_TestCases_001-005.md`, `AP2499_TestCases_006-010.md`, `AP2499_TestCases_011-013.md`

> **Stale fact in the test cases.** Each file's Execution Context says "v2staging". The `env` source wins and this run used Dev (v2dev) by the user's decision. The dealer, vehicle 915 and the routes all exist on Dev, so no step had to change.

| Metric | Value |
|---|:---:|
| Total test cases | 13 |
| Passed | 5 |
| Failed | 5 |
| Blocked | 3 |
| Skipped | 0 |
| **Pass rate** | **38% (5 of 13)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2499_001 | GAP modal on a quote with no financing shows the financing form, not the alert | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_001-step3-GapModalFinancingFormFirst_pass.png` | Quote 6533: empty financing form, no alert, nothing below it |
| AP2499_002 | Creditors modal on a quote with no financing shows the financing form, not the alert | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_002-step2-CreditorsModalFinancingForm_pass.png` | Quote 6534: same empty form; `/insurance` page shows the form alone |
| AP2499_003 | Financing submitted in the GAP modal is saved and the modal moves on | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png` | Saved and GAP step shown, but the financing form collapses to a summary (steps 3, 5) |
| AP2499_004 | Creditors modal on a quote with a financing shows the financing form first with the stored values | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-FinancingCollapsedToSummary_fail.png` | Form collapsed to a one-line summary; fields hidden until Edit |
| AP2499_005 | GAP modal on a financing with no residual does not invent a residual | Medium | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step2-EmptyResidualRefused_blocked.png` | An empty residual cannot be stored ("This value should not be blank.") |
| AP2499_006 | Correcting the base amount in the creditors modal saves the new amount | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step3-ModalRendersQuotePage_fail.png` | 30000 saved, but the modal then shows the whole quote page |
| AP2499_007 | Creditors quote result shows below the form in the same modal | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_007-step3-PageReloadedModalClosed_fail.png` | Get Quote reloads the quote page; modal closes; 18.58$/m on the row |
| AP2499_008 | GAP quote result shows below the form in the same modal | High | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_008-step3-PageReloadedModalClosed_fail.png` | Get Quote reloads the quote page; modal closes; 3,094.00 on the row |
| AP2499_009 | A failed insurance quote shows an error and keeps the entered values | Medium | 🚫 | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_009-step4-LifeTerm999Priced_blocked.png` | Failure not reproduced with Life term 999 — Q-007 (Chubb priced it) |
| AP2499_010 | An empty financing form shows field errors and saves nothing | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_010-step5-NothingStored_pass.png` | Quote 6542: 7 field errors in the modal; nothing stored |
| AP2499_011 | Text base amount and negative rate leave the stored financing unchanged | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_011-step5-FinancingUnchanged_pass.png` | Quote 6543: "This value is not valid." on base amount; nothing changed |
| AP2499_012 | Empty residual and date of birth do not store invented values | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_012-step5-NoFinancingStored_pass.png` | Quote 6544: refused on Residual; no financing stored |
| AP2499_013 | Humania dealer: financing form above the insurance form | High | 🚫 | 0 | 0 | — | Q-002: no Humania dealer setup found on Dev |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## The add modal on Dev — what it looks like (mapped this run)

Opening the **+** on the "Gap Insurance" row (`/quote/{id}/gap-insurance`) or the "Creditors insurance" row (`/quote/{id}/insurance`) loads that route into a Bootstrap modal on `/quote/{id}/details`; the URL does not change.

- **Top block "Financing"** with an **Edit** toggle on the right. Form `quote_financing[...]`: Date of birth* (`applicant][dateOfBirthText`, text with a date picker), Province* (`applicant][province`, pre-selected "Québec"), Type* (Choose / Financing / Lease / Finance lease), Net amount financed including RDPRM* (`baseAmount`, text), Residual* (`residualAmount`, text, required), Payment frequency* (Choose / Monthly / Bi-Weekly / Weekly), Term months* (a drop-down of 3 to 240 in steps of 3, not a text field), Interest rate* (text), Financing company* (Choose + 34 companies), a hidden checkbox `dueType` (checked), and a **Save** button. Every drop-down has an empty "Choose" option, so every one can be emptied.
- **No financing yet:** the Financing block is expanded and empty, and nothing is shown below it (no insurance form).
- **Financing exists:** the Financing block opens **collapsed** to one line — "Financing · 60 months · 25,000.00$ · AutoCapital Canada" — with Edit to expand it. Below it: "Gap Insurance Quote" (Rate table* TGGAP, Language* English, Tax exempt* No, Gap Term* text, **Get Quote**) or "Creditors Insurance Quote" (Language English, Tax exempt No, Form PM30/PM50, Life / Critical illness / Disability type, term and "For", **Get Quote**).
- **Save in the GAP modal on a quote with no financing** (AJAX) → the modal reloads in place: financing collapsed to its summary line, GAP form below.
- **Save in the creditors modal on a quote with a financing** → `POST /quote/{id}/insurance` → 302 → `/quote/{id}/details`, and that whole page is drawn inside the modal (AP2499_006).
- **Get Quote** (GAP or creditors) → a normal page post: the whole quote page reloads with "GAP insurance quote saved successfully" / "Chubb insurance quote saved successfully", the modal is gone and the premium is only on the Summary-of-products row.
- **Server validation** shows "This value should not be blank." / "This value is not valid." under each field inside the modal, and nothing is stored.

---

## Step-by-Step Results

### AP2499_001 — GAP modal on a quote with no financing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in, `/vehicle/915/details` → Create quote, client `Gap2499-001` (`client.stage.2499001@yopmail.com`), vehicle step 2026-11-01 / 20000 | Quote page loads; no financing; Gap Insurance row "- None Selected -" with + | URL = `/quote/6533/details`; heading = "#6533 - Gap Gap2499-001 1FAHP35NX8W239204"; Financing card text = "You have not added financing details yet"; Gap Insurance row = "- None Selected -" with + (`/quote/6533/gap-insurance`) | ✅ | Quote 6533 created |
| 2 | Click + on the Gap Insurance row | Modal opens, URL unchanged, no error | Dialog visible = true; URL = `/quote/6533/details`; no error banner | ✅ | Modal loaded by AJAX |
| 3 `[Verification]` | Inspect the modal top to bottom | No "Please add a financing…" alert; financing form first, all eight fields; no stored values; drop-downs recorded (Q-004); anything below recorded (Q-003) | Text "Please add a financing" found = false; first block = heading "Financing" + Edit; fields: Date of birth = "", Province = "Québec", Type = "Choose", Net amount financed including RDPRM = "", Residual = "", Payment frequency = "Choose", Term months = "Choose", Interest rate = "", Financing company = "Choose"; submit = "Save". Below the form: nothing (no GAP form, no result area) | ✅ | Q-004: every drop-down opens on "Choose" (Province pre-selects Québec). Q-003: nothing below until a financing is saved |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_001-step3-GapModalFinancingFormFirst_pass.png` — the GAP modal on quote 6533 with the empty financing form and nothing below it

### AP2499_002 — Creditors modal on a quote with no financing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-002` (`client.stage.2499002@yopmail.com`), vehicle step | Quote page loads; no financing; Creditors insurance row with + | URL = `/quote/6534/details`; "Vehicle saved"; Financing card = "You have not added financing details yet"; Creditors insurance row = "- None Selected -" with + | ✅ | Quote 6534 |
| 2 | Click + on Creditors insurance, screenshot the modal | Modal opens, URL unchanged; screenshot saved | Dialog visible = true; URL = `/quote/6534/details`; screenshot saved | ✅ | — |
| 3 | Close, open `/quote/6534/insurance` directly | No error page; record what it shows (Q-001) | HTTP 200; the page shows the financing form alone (same eight fields + Province, Save, posting to `/quote/6534/insurance`); no creditors form, no alert | ✅ | Q-001: the direct route renders the financing form, not the alert |
| 4 `[Verification]` | Read the step-2 screenshot | No "Please add a financing…" alert; financing form first; no stored values; drop-downs recorded | Text "Please add a financing" found = false; same empty form as AP2499_001 step 3 (all text fields ""; Type, Payment frequency, Term months, Financing company = "Choose"; Province = "Québec"); nothing below the form | ✅ | Q-003: nothing below the form |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_002-step2-CreditorsModalFinancingForm_pass.png` — the creditors modal on quote 6534 with the empty financing form

### AP2499_003 — Financing submitted in the GAP modal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-003` (`client.stage.2499003@yopmail.com`), vehicle step | Quote page with no financing; id and URL recorded | URL = `/quote/6535/details`; Financing card = "You have not added financing details yet" | ✅ | Quote 6535 |
| 2 | Open the GAP + modal, enter F1 | Modal opens; F1 values show | DOB = 1990-01-01, Type = "Financing", Net amount = 25000, Residual = 0, Payment frequency = "Monthly", Term months = "60", Interest rate = 6.99, Financing company = "AutoCapital Canada 200-11, Church Street Toronto" | ✅ | Type and company = first non-empty options |
| 3 | Click the financing Save (label "Save") | No error; URL unchanged; modal open; GAP step below; financing form above with F1; record Q-005 | URL = `/quote/6535/details`; modal open; top block = "Financing" with summary line "Financing · 60 months · 25,000.00$ · AutoCapital Canada" and Edit; fields hidden in a collapsed block but holding F1 (Edit expands them, all F1); below = "Gap Insurance Quote": Rate table "TGGAP", Language "English", Tax exempt "No", Gap Term "" , Get Quote | ❌ | Saved and moved on to the GAP step without leaving the page, but the financing form is not shown with the F1 values: it is collapsed to a summary line (rate, frequency, residual and date of birth not visible). Same behaviour as AP2499_004. Q-005: no GAP field carries a financing value |
| 4 | Close the modal, reload `/quote/6535/details` | Reloads; Financing card shows a financing | Reload OK; Financing card = "Financing 60 months / AutoCapital Canada" | ✅ | — |
| 5 `[Verification]` | Read the Financing card, re-open the GAP modal | Card matches F1; modal shows the financing form first with F1; no alert | Card: Type = Financing, Financed amount = 25,000.00$, Residual = 0.00$, Term = 60, Interest rate = 6.9900%, Payment amount = 494.91$ Monthly, company = AutoCapital Canada. Re-opened modal: first block = Financing (collapsed summary "Financing · 60 months · 25,000.00$ · AutoCapital Canada"; hidden fields hold all eight F1 values); no "Please add a financing" text; GAP form below | ❌ | Card part passes (all F1 values stored). Modal part fails: the form is not shown filled with F1 — only the summary line until Edit. Same behaviour as AP2499_004 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step3-ModalMovedToGapStep_fail.png` — after Save: financing collapsed to its summary line, GAP form below, still in the modal
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step3-FinancingEditExpanded_pass.png` — Edit expanded: the form holds all F1 values
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png` — re-opened GAP modal: financing shown only as a summary line
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step5-FinancingCardF1_pass.png` — Financing card with the F1 values (final state)

### AP2499_004 — Creditors modal on a quote with a stored financing — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-004` (`client.stage.2499004@yopmail.com`), vehicle step | Quote page loads | URL = `/quote/6536/details` | ✅ | Quote 6536 |
| 2 `[Pre-Condition]` | `/quote/6536/financing`, enter F1 → Save | Financing card shows F1; route recorded | Route used = `/quote/6536/financing` (page works on Dev); flash "Financing saved"; card: Financing, 25,000.00$, 0.00$, 60, 6.9900%, 494.91$ Monthly, AutoCapital Canada | ✅ | The old financing page still feeds the modal (Q-014) |
| 3 | Click + on Creditors insurance | Modal opens, no error | Dialog visible = true; URL unchanged | ✅ | — |
| 4 `[Verification]` | Inspect the modal top to bottom | Financing form first — **not hidden, collapsed or replaced by a summary** — each of the eight fields showing its stored value; creditors form below | First block = "Financing" **collapsed** to the line "Financing · 60 months · 25,000.00$ · AutoCapital Canada" with an Edit link; the eight fields are not visible (collapsed block, `class="collapse"`). After Edit: DOB 1990-01-01, Type Financing, Net amount 25000, Residual 0, Payment frequency Monthly, Term 60, Interest rate 6.99, company AutoCapital Canada… — all correct. Creditors Insurance Quote form below (English / No / PM30, Life etc. empty) | ❌ | The dealer cannot see or check residual, rate, frequency or date of birth without clicking Edit. Number format in the field: `25000`; in the summary: `25,000.00$` |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-FinancingCollapsedToSummary_fail.png` — creditors modal as it opens: financing reduced to a summary line, fields hidden
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-EditExpandsStoredValues_fail.png` — after Edit: the stored values are there (final state)

### AP2499_005 — GAP modal on a financing with no residual — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-005` (`client.stage.2499005@yopmail.com`), vehicle step | Quote page loads | URL = `/quote/6537/details` | ✅ | Quote 6537 |
| 2 `[Pre-Condition]` | `/quote/6537/financing`, F1 with Residual empty → Save. If refused, record the error (Q-011) and stop BLOCKED | Financing stored, or BLOCKED "an empty residual cannot be stored" | Residual field `required` = true (browser message "Please fill out this field."); after the post the page stayed on `/quote/6537/financing` with "ERROR This value should not be blank." under **Residual**; no financing stored | 🚫 | Blocked: an empty residual cannot be stored (Q-011). Steps 3–4 not run |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step2-EmptyResidualRefused_blocked.png` — financing page refusing the empty residual

### AP2499_006 — Correcting the base amount in the creditors modal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-006` (`client.stage.2499006@yopmail.com`), vehicle step, save F1 via `/quote/6538/financing` | Financing with base 25000 | URL = `/quote/6538/details`; "Financing saved"; Financed amount = 25,000.00$ | ✅ | Quote 6538 |
| 2 | Creditors + modal; Edit; Base amount 25000 → 30000 | Modal opens; form shows F1 then 30000 | Modal open; financing collapsed until Edit; after Edit F1 shown; Net amount = 30000 | ✅ | Edit needed to reach the field (see 004) |
| 3 | Click the financing Save | No error; URL unchanged; modal open showing the creditors step below the financing form with 30000 | `POST /quote/6538/insurance` → 302 → `GET /quote/6538/details` 200; URL unchanged, but the modal now contains **the whole quote details page** (heading "#6538 - Gap Gap2499-006…", Back / Send compliance documents / Archive, Vehicle, Financing card with 30,000.00$, Summary of products); no creditors insurance step, no financing form | ❌ | The dealer is left looking at a page-inside-a-page and has to close the modal and click + again to quote |
| 4 | Close the modal, reload `/quote/6538/details` | Reloads | Reload OK | ✅ | — |
| 5 `[Verification]` | Read the Financing card, re-open the creditors modal | Card base 30000, others unchanged; modal shows 30000; record Q-006 | Card: Financed amount = 30,000.00$, Residual 0.00$, Term 60, Interest 6.9900%, Payment 593.89$ Monthly, AutoCapital Canada; one financing on the page. Re-opened modal: Net amount = 30000; summary "Financing · 60 months · 30,000.00$ · AutoCapital Canada" | ✅ | Q-006: the same financing was updated (one only) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step3-ModalRendersQuotePage_fail.png` — the quote details page drawn inside the modal after Save
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step5-CorrectedAmountStored_pass.png` — re-opened modal and card with 30,000.00$ (final state)

### AP2499_007 — Creditors quote result in the same modal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-007` (`client.stage.2499007@yopmail.com`), vehicle step, save F1 | Financing on the quote | URL = `/quote/6539/details`; "Financing saved"; 25,000.00$ / 60 / 6.9900% | ✅ | Quote 6539 |
| 2 | Creditors + modal; enter English / No / PM30 / Decreasing / 60 / Borrower | Modal opens; financing at top with F1; values show | Modal open; financing summary "Financing · 60 months · 25,000.00$ · AutoCapital Canada" at top (collapsed); Language English, Tax exempt No, Form Monthly Premium PM30 (defaults), Life Decreasing, Life Term 60, Life For Borrower | ✅ | Label of submit = "Get Quote" |
| 3 | Click Get Quote, wait, screenshot | No error; URL unchanged; modal still open | The form posted as a full page: the page reloaded at `/quote/6539/details` with flash "Chubb insurance quote saved successfully"; **modal closed** (dialog not shown) | ❌ | The result never appears in the modal |
| 4 | Look at the Creditors row; re-open the modal | Record row and whether the result is kept (Q-008) | Row = "CA$18.58 /m" with a chevron and ⋯ menu (Edit · Generate Contract · Delete), no + any more; Subtotal CA$20,018.58. Re-opened via ⋯ → Edit: financing summary, then a "Coverage" table (Form GC6201MQ, Rate table PM30, Life Decreasing BORROWER 60 — 18.58$ + tax 1.67$ = 20.25$/month; Equivalent Single Premium 891.31$; Commission (30%) 267.39$), then the creditors form still holding Decreasing / 60 / Borrower | ✅ | Q-008: the result is kept and shown on re-open, between the financing block and the insurance form |
| 5 `[Verification]` | Read the step-3 screenshot | In the same modal: financing at top, result block with a premium below the form | The step-3 screenshot shows the quote page with the modal closed; the premium is only on the Summary-of-products row | ❌ | Same cause as step 3. Premium 18.58$/m, tax 1.67$, commission 267.39$ |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_007-step3-PageReloadedModalClosed_fail.png` — after Get Quote: quote page reloaded, modal gone, 18.58$/m on the row
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_007-step4-ReopenedModalShowsResult_pass.png` — re-opened modal showing the stored coverage table (final state)

### AP2499_008 — GAP quote result in the same modal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-008` (`client.stage.2499008@yopmail.com`), vehicle step, save F1 | Financing on the quote | URL = `/quote/6540/details`; "Financing saved"; 25,000.00$ / 60 | ✅ | Quote 6540 |
| 2 | GAP + modal; Gap Term 60 | Modal opens; GAP form offered | Modal open; financing summary at top; GAP form: Rate table TGGAP (only option), Language English, Tax exempt No (defaults recorded), Gap Term = 60 | ✅ | Dealer 1380 is GAP-configured on Dev |
| 3 | Click Get Quote, wait, screenshot | No error; URL unchanged; modal still open | Full page reload at `/quote/6540/details`, flash "GAP insurance quote saved successfully"; **modal closed** | ❌ | Same behaviour as AP2499_007 |
| 4 | Look at the Gap Insurance row | Record it | Row = "CA$3,094.00"; Subtotal CA$23,094.00 | ✅ | — |
| 5 `[Verification]` | Read the step-3 screenshot | In the modal: financing at top, GAP premium below | Modal closed; premium only on the row | ❌ | Premium 3,094.00 for 60 months on 25,000 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_008-step3-PageReloadedModalClosed_fail.png` — after Get Quote: page reloaded, modal gone, CA$3,094.00 on the row (final state)

### AP2499_009 — A failed insurance quote keeps the values — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-009` (`client.stage.2499009@yopmail.com`), vehicle step, save F1 | Financing on the quote | URL = `/quote/6541/details`; "Financing saved" | ✅ | Quote 6541 |
| 2 | Creditors + modal; creditors values with Life term 999 | Life term shows 999 | Life Term = "999", Life Decreasing, Borrower; financing summary at top | ✅ | — |
| 3 | Get Quote, wait, screenshot | No 5xx; record the outcome | No error, no `alert`-role banner, no "HTTP" text; page reloaded at `/quote/6541/details` with "Chubb insurance quote saved successfully"; modal closed. Outcome = **priced result** | 🚫 | The modal closing is the AP2499_007 behaviour, not a separate fault |
| 4 `[Verification]` | Inspect the answer | If priced: BLOCKED "failure not reproduced with Life term 999 — Q-007" | Creditors row = CA$18.58 /m; coverage table "Life Decreasing BORROWER **60** 18.58$ 1.67$ 20.25$", Equivalent Single Premium 891.31$, Commission (30%) 267.39$ — the 999 entered was priced and shown as a 60-month term | 🚫 | Blocked: failure not reproduced with Life term 999 — Q-007. Record for Q-007: a life term above the loan term is silently priced on the loan term |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_009-step4-LifeTerm999Priced_blocked.png` — quote page after Get Quote with Life term 999, priced at 18.58$/m on a 60-month term

### AP2499_010 — Empty financing form — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-010` (`client.stage.2499010@yopmail.com`), vehicle step | Quote with no financing | URL = `/quote/6542/details`; "You have not added financing details yet" | ✅ | Quote 6542 |
| 2 | GAP + modal; only DOB 1990-01-01; drop-downs left at their empty option | Text fields empty; drop-down state recorded (Q-004) | DOB = 1990-01-01; Net amount, Residual, Interest rate = ""; Type, Payment frequency, Term months, Financing company = "Choose" (all could be emptied); Province = "Québec" | ✅ | No drop-down "cannot be emptied" |
| 3 | Click the financing Save | Errors next to each empty listed field; record texts (Q-012) and Residual (Q-011); modal stays on the financing step | Modal still open, URL unchanged; "This value should not be blank." under Type, Net amount financed including RDPRM, Residual, Payment frequency, Term months, Interest rate and Financing company; no GAP step shown | ✅ | Q-012 text = "This value should not be blank."; Q-011: Residual is required |
| 4 | Close, reload `/quote/6542/details` | Reloads | Reload OK | ✅ | — |
| 5 `[Verification]` | Read Financing card and both insurance rows | No financing; both rows "- None Selected -" | Financing card = "You have not added financing details yet"; Gap Insurance = "- None Selected -"; Creditors insurance = "- None Selected -" | ✅ | Nothing stored |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_010-step3-FieldErrorsInModal_pass.png` — field errors inside the modal
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_010-step5-NothingStored_pass.png` — quote page with no financing and both rows empty (final state)

### AP2499_011 — Invalid correction leaves the financing unchanged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-011` (`client.stage.2499011@yopmail.com`), vehicle step, save F1 | Financing 25000 / 60 / 6.99 | URL = `/quote/6543/details`; 25,000.00$ / 60 / 6.9900% | ✅ | Quote 6543 |
| 2 | Creditors + modal; Edit; Term 72, Base amount `abc`, Interest rate `-5` | Record what each field shows | Term months = "72"; Net amount = "abc" (text field accepts letters); Interest rate = "-5" | ✅ | — |
| 3 | Click the financing Save | No error page; record errors (Q-010, Q-012) | Modal still open, URL unchanged; "This value is not valid." under Net amount financed including RDPRM; **no** error under Interest rate | ✅ | Q-010: `-5` is not rejected by itself; `abc` is |
| 4 | Close, reload | Reloads | Reload OK | ✅ | — |
| 5 `[Verification]` | Read the Financing card | Error was shown → card still 25000 / 60 / 6.99 | Financed amount = 25,000.00$, Term = 60, Interest rate = 6.9900%, Payment 494.91$ Monthly | ✅ | The valid term change was not saved on its own |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_011-step3-BaseAmountNotValid_pass.png` — "This value is not valid." under the base amount in the modal
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_011-step5-FinancingUnchanged_pass.png` — financing unchanged (final state)

### AP2499_012 — Empty residual and date of birth — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create quote, client `Gap2499-012` (`client.stage.2499012@yopmail.com`), vehicle step | Quote with no financing | URL = `/quote/6544/details` | ✅ | Quote 6544 |
| 2 | GAP + modal; F1 without Residual and DOB | Six fields show F1, two empty | Type Financing, Net amount 25000, Payment frequency Monthly, Term 60, Interest rate 6.99, company AutoCapital; Residual = "", DOB = "" | ✅ | — |
| 3 | Click the financing Save | No error page; record accepted/refused (Q-011) | Refused: "This value should not be blank." under **Residual**; no error under Date of birth; modal stays on the financing step | ✅ | Q-011: residual required; DOB not flagged (submit refused on residual alone) |
| 4 | Close, reload, re-open the GAP modal | Loads without error | Reload and modal OK | ✅ | — |
| 5 `[Verification]` | Read the Financing card and the re-opened form | Refused → card still shows no financing | Financing card = "You have not added financing details yet"; re-opened form empty (Residual "", DOB "") | ✅ | No invented value stored |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_012-step3-ResidualRequired_pass.png` — Residual error in the modal
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_012-step5-NoFinancingStored_pass.png` — re-opened modal, nothing stored (final state)

### AP2499_013 — Humania dealer — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in as a Humania dealer | A Humania-configured dealer exists | Checked on Dev, not guessed: no Humania account in `env`, `test-data` or `domain`; in the Dev admin portal, dealer 1380's page (`/admin/dealer/1380`) offers only a "Chubb insurance" configuration action, its edit form and Financing Options page mention no Humania, and `/admin/insurance` is a contract list ("No insurance found"). No Humania dealer setup was found | 🚫 | Blocked by Q-002 — test data not on dev: a dealer configured for Humania. Steps 2–5 not run; not run on the Chubb dealer as a substitute |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2499_005 | 🚫 | An empty residual cannot be stored: the financing page refuses it with "This value should not be blank." (Q-011). The residual-prefill check needs a stored financing with no residual, which the build does not allow |
| AP2499_009 | 🚫 | Failure not reproduced with Life term 999 — Q-007. Chubb priced the request (18.58$/m on a 60-month term), so the failure branch of REQ-005 was never exercised. Needs a known way to make the GAP/creditors quote fail |
| AP2499_013 | 🚫 | Q-002 — test data not on dev: no dealer configured for Humania was found on Dev. Runs once an account is named |

---

## Environment Observations

- **Records left on Dev (no cleanup source):** quotes **6533–6544** on dealer 1380 / vehicle 915, clients `client.stage.2499001`–`2499012@yopmail.com` (last names `Gap2499-001`–`012`). Financings on 6535, 6536, 6538 (base 30,000 after the correction), 6539, 6540, 6541, 6543. Chubb **creditor insurance quotes** (no contract) on 6539 and 6541 (18.58$/m), a **GAP insurance quote** (no contract) on 6540 (3,094.00). **No Chubb contract was created** — no contract number. Quotes 6533, 6534, 6537, 6542, 6544 have no financing. The vehicle was only read.
- Chubb calls went to Chubb's development API through Dev; each answered in a few seconds.
- None of the known Dev defects of this batch (AP-2512, AP-2518, AP-2519, AP-2520–2522, AP-2516) was reached by any setup step.
- The vehicle-step Delivery date opens a date picker that covers the Save button; pressing Escape before Save avoids a slow click.
- The admin login page on Dev pre-fills the e-mail field from the earlier dealer session (French UI); the admin session was used only for the AP2499_013 check.
- Browser tab closed at the end of the run.

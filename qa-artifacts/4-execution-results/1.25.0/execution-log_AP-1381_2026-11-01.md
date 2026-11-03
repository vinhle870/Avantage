# Execution Log — AP-1381 (duplicate name visual)

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (inside stlc-ticket-pipeline, `--from s4 --until s4c`)
**Date:** 2026-11-01
**Environment:** Dev (v2dev) — chosen by the user for this run; the Staging environment was not opened
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-01T16:06:44Z → 2026-11-01T16:09:40Z
**Run folder:** 1.25.0 (fix version)
**Test cases:** qa-artifacts/3-test-cases/AP1381_TestCases_001-004.md
**Login:** shared QA account from the `env` source (`execute.env.md` → Dev Environment), typed only into the login forms

| Metric | Value |
|---|:---:|
| Total test cases | 4 |
| Passed | 3 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 1 |
| **Pass rate** | **100% (3 of 3 counted; 1 SKIPPED excluded)** — 75% of all 4 cases |

### Test data used on Dev

The cases were designed against Staging data. Each case's own selection rule was applied on Dev:

| Item | Designed (Staging) | Used on Dev | How chosen |
|---|---|---|---|
| Dealer | 1380 | **1380** — exists on Dev with Name `Offical VinhLe870@gmail.com`, Company name `Test QA staging` (same as Staging) | Read from `/admin/dealer/1380/edit` |
| Warranty invoice | 909 (`Warranty #26df1-829`) | **934** — `Warranty #APOP01-843`, created Tuesday, October 6, 2026 | Highest Invoice ID on `/invoice` whose link reads `Warranty #…` |
| Permaplate invoice (recorded only) | 926 | **927** — `#PNA-0000000013`, created Sunday, September 13, 2026 | Highest Invoice ID on `/invoice` whose link reads `#PNA-…` |
| Oldest invoice | (last page) | **65** — `Warranty #002Opt_001-83`, created Wednesday, November 25, 2020 | Last page `/invoice?page=26`; invoices 65 and 66 share the oldest date, the lower ID (last row) was taken |

Nothing was created, changed or deleted on Dev.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP1381_001 | A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section | High | ✅ PASS | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_001-step5-WarrantyInvoice934ToBlock_pass.png` | Invoice 934 To block names "Offical VinhLe870@gmail.com" once; no company line |
| AP1381_002 | An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section | High | ✅ PASS | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_002-step5-AdminInvoice934ToBlock_pass.png` | Admin view of invoice 934 matches the dealer view: name once |
| AP1381_003 | The downloadable PDF of a dealer invoice shows the dealer's name without an error | Medium | ⏭️ SKIPPED | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_003-step2-DealerInvoiceOnlyPrintNoPdf_skip.png` | No PDF copy offered on the dealer invoice page — Print only (case's own rule) |
| AP1381_004 | The oldest dealer invoice still opens without an error | Low | ✅ PASS | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_004-step4-OldestInvoice65ToBlock_pass.png` | Invoice 65 (2020) opens; To block names "VinhLeDealer01" once — recorded for Q-002 |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP1381_001 — A dealer opening an invoice in the Dealer portal sees the dealer's name once in the TO section — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in to the Admin portal, open `/admin/dealer/1380/edit`, record the name field's label and value and the company value | Dealer Details for 1380 opens; label and both values recorded | Heading = "Dealer #1380". Field `dealer[name]` label = "Name" with class `required`, rendered as "Name *" (the asterisk is added by CSS); value = "Offical VinhLe870@gmail.com". Field `dealer[companyName]` label = "Company name"; value = "Test QA staging" | ✅ | Both values match the designed ones, so the expected values in step 5 stand unchanged |
| 2 `[Pre-Condition]` | Sign in to the Dealer portal, open `/invoice`, pick the newest warranty invoice and the newest Permaplate invoice | One warranty invoice recorded with ID, description and creation date after 2022-09-19 | Warranty: ID = 934, link = "Warranty #APOP01-843" (`/warranty/843`), Created at = "Tuesday, October 6, 2026". Permaplate: ID = 927, link = "#PNA-0000000013", Created at = "Sunday, September 13, 2026" | ✅ | Dev ids differ from the designed Staging ids (909 / 926); the case's selection rule was applied |
| 3 | Open `/invoice/934` | Detail page loads with invoice number, line items and addressee block; record its label | URL = `/invoice/934`; heading = "Invoice #934"; blocks labelled "From:", "To:", "Status:"; one line item ($456.00); Grand Total $524.29 | ✅ | The addressee block's label is "To:" |
| 4 | Copy every line of the To block | Full To block text in the log | To block lines: 1 "Offical VinhLe870@gmail.com" (bold) · 2 "Address" · 3 "22222" · 4 "cccc , QC, Canada" · 5 "Email: vinhle870@gmail.com" · 6 "Phone: 99999" | ✅ | Copied from the page text |
| 5 `[Verification]` | Verify the *Name appears exactly once and no second line repeats the name or shows the company as a name; then record the Permaplate invoice's To block | Warranty invoice To block shows "Offical VinhLe870@gmail.com" once and not "Test QA staging" | Invoice 934 To block: "Offical VinhLe870@gmail.com" occurs 1 time; "Test QA staging" occurs 0 times. Second check (recorded only) — invoice 927 To block: "Offical VinhLe870@gmail.com" / "Address" / "22222" / "cccc , QC, Canada" / "Email: vinhle870@gmail.com" / "Phone: 99999" — name 1 time, company 0 times in the To block | ✅ | Permaplate invoice is evidence for proposal P2-1; its Description cell (not the To block) does contain "Test QA staging" next to the email |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_001-step5-WarrantyInvoice934ToBlock_pass.png` — dealer view of warranty invoice 934; the To block names the dealer once
- `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_001-step5-PermaplateInvoice927ToBlock_pass.png` — dealer view of Permaplate invoice 927 (recorded second check); the To block names the dealer once

### AP1381_002 — An admin opening the same dealer invoice in the Admin portal sees the dealer's name once in the TO section — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in to the Admin portal, open `/admin/dealer/1380/edit`, record the name label and both values | Form opens; label and values recorded | Same session and reading as AP1381_001 step 1: "Name *" = "Offical VinhLe870@gmail.com"; "Company name" = "Test QA staging" | ✅ | Read once and reused, as the two cases ran in the same session |
| 2 `[Pre-Condition]` | Take the warranty invoice used in AP1381_001 | One warranty invoice recorded | Invoice 934 — "Warranty #APOP01-843", created Tuesday, October 6, 2026 | ✅ | Same invoice as AP1381_001 |
| 3 | In the Admin portal open "Invoices", find invoice 934 and open it; record both routes | Admin view of invoice 934 opens | List route = `/admin/invoices` (heading "Invoices"); row 934 shown on page 1 as the third row; clicking the row opened `/admin/invoice/934`, heading = "Invoice #934"; buttons Back, Print, Edit, Credit memo, Add payment, PDF | ✅ | The list's search form is hidden behind a "Search" toggle; not needed, as 934 was on page 1 |
| 4 | Copy every line of the To block | Full To block text in the log | To block lines: "Offical VinhLe870@gmail.com" · "Address" · "22222" · "cccc , QC, Canada" · "Email: vinhle870@gmail.com" · "Phone: 99999" | ✅ | Identical to the dealer view |
| 5 `[Verification]` | Verify the *Name appears exactly once and the company is not a second name line | To block shows "Offical VinhLe870@gmail.com" once, not "Test QA staging" | "Offical VinhLe870@gmail.com" occurs 1 time; "Test QA staging" occurs 0 times in the To block | ✅ | Admin and dealer views agree |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_002-step5-AdminInvoice934ToBlock_pass.png` — admin view of invoice 934; the To block names the dealer once

### AP1381_003 — The downloadable PDF of a dealer invoice shows the dealer's name without an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in to the Dealer portal and open `/invoice/934` | Detail page loads | URL = `/invoice/934`; heading = "Invoice #934" | ✅ | — |
| 2 | Click the invoice's download or PDF link and record it | A PDF opens or downloads; if no download or PDF control exists, the case is SKIPPED "no PDF copy offered" | The page's only document control is "Print" (`href="#"`, `onclick="window.print()"`), which opens the browser's print dialog. No link or button with "PDF" or "Download" exists on the dealer page | ⏭️ | SKIPPED by the case's own rule: "no PDF copy offered". Steps 3–4 not run |
| 3 | Read the PDF's To block | — | Not run | ⏭️ | No PDF on the dealer page |
| 4 `[Verification]` | Check the PDF for objective faults and record the name count | — | Not run | ⏭️ | Q-003 stays open; see the observation below |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_003-step2-DealerInvoiceOnlyPrintNoPdf_skip.png` — dealer invoice 934 with only Back and Print at the top right
- `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_003-obs-AdminInvoice934PdfHttp500.png` — observation outside this case: the admin "PDF" link for invoice 934 shows the error page "Erreur — Désolé, l'application éprouve des difficultés techniques" (HTTP 500)

### AP1381_004 — The oldest dealer invoice still opens without an error — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in to the Dealer portal and open `/invoice` | Invoices page with columns Invoice ID, Description, Amount, Created at, Status | Heading = "Invoices"; columns = Invoice ID · Description · Amount · Created at · Status; pager "Last" → `/invoice?page=26` | ✅ | — |
| 2 | Go to the last page, pick the invoice with the oldest "Created at", record ID and date | One invoice and its date recorded | `/invoice?page=26` lists 2 rows: 66 "Warranty #AP-84" and 65 "Warranty #002Opt_001-83", both created Wednesday, November 25, 2020. Picked 65 (last row, lowest ID). Date is before 2022-09-19 = yes | ✅ | Two invoices share the oldest date; the lower ID was taken |
| 3 | Open `/invoice/65` and copy its To block | Detail page loads; To block text in the log | URL = `/invoice/65`; heading = "Invoice #65". To block lines: "VinhLeDealer01" (bold) · "Vancouver" · (blank line) · ", , Canada" · "Email: vinhle870@gmail.com" · "Phone:" (empty) | ✅ | The old invoice keeps the name stamped at creation, not today's dealer name |
| 4 `[Verification]` | Check for objective faults and record how many times the dealer's name appears | No error page or HTTP 5xx; To block not empty. Record for Q-002 | Page opened with no error; To block not empty. Recorded for Q-002: the dealer's name "VinhLeDealer01" appears 1 time; no second name line; created Wednesday, November 25, 2020 | ✅ | Record-only: this 2020 invoice does **not** show the name twice on Dev |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/1.25.0/AP-1381/AP1381_004-step4-OldestInvoice65ToBlock_pass.png` — oldest invoice 65 (2020); the To block names "VinhLeDealer01" once

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP1381_003 | ⏭️ | No PDF copy offered on the Dealer portal invoice page — it has only a "Print" button that opens the browser's print dialog. The case's step 2 says to record SKIPPED in that case |

---

## Environment Observations

- **Environment.** Dev (v2dev), by the user's decision for this run. The cases were designed
  against Staging; dealer 1380 holds the same Name and Company on Dev, but every invoice id
  differs (see *Test data used on Dev*).
- **Admin "PDF" link returns an error (observation, not a test result of this ticket).** On
  the Admin portal invoice page `/admin/invoice/934`, the "PDF" button leads to
  `/admin/invoice/934/pdf`, which answered HTTP 500 and showed the French error page
  "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer
  une autre fois." No test case covers the admin PDF, so it is not a FAIL here. It means
  Q-003 (does the rule cover the PDF copy?) could not be answered from evidence on Dev:
  staff who try to download an invoice as PDF get an error page instead.
- **Q-002 evidence.** The oldest invoice on Dev (65, 2020-11-25) shows its dealer name once,
  not twice, even though it predates the 2022-09-19 fix.
- **Proposal P2-1 evidence.** The newest Permaplate invoice (927) shows the dealer name once
  in its To block, the same as the warranty invoice.
- `env-check` source is `missing`; the environment health check was run by the caller
  before this stage and passed. One console error appears on every page load (seen on the
  login pages before any action); it did not affect any step.
- **Knowledge write-back.** Billing → Invoices was an unmapped area. Documented in
  `qa-artifacts/qa-docs/billing-invoices.md` and indexed in `navigation-map.md` §3.

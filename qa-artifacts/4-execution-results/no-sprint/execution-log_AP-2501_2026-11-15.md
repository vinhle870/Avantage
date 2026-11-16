# Execution Log — AP-2501: Permaplate invoice — include name of the term in the description

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker for AP-2501, `stlc-ticket-pipeline --from execute --until correct-cases`, batch qa-agent 2026-11-15)
**Date:** 2026-11-15 (UTC)
**Environment:** Dev (v2dev) — the registry's `execution_env`
**Base URL:** https://v2dev.garantieavantageplus.ca/ (Dealer `/login`, Admin `/admin/login`; account from the `env` source, *Dev Environment* section — no credential is written here)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-15T10:43Z → 2026-11-15T10:48Z
**Test cases:** `qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md`
**Run folder:** no-sprint
**Executed this run:** AP2501_002, AP2501_003, AP2501_004, AP2501_005 (in that order — 004 and 005 use the invoice AP2501_002 made). **Carried forward:** AP2501_001 (PASS) and AP2501_006 (BLOCKED on Q-001) from `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md`.

| Metric | Value |
|---|:---:|
| Total test cases | 6 |
| Passed | 4 |
| Failed | 1 |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **66.7% (4 of 6)** |

**Pre-run checks**

- Tracker preflight and environment health check: passed before this worker started (orchestrator).
- Gate B (R2 round 1, independent reviewer): rule B3, execute the current cases — applied and logged `by reviewer` in the run state.
- The `env-check` source is missing (declared gap); the orchestrator's health check stood in for it.
- **Dealer 1380 Permaplate links before the run (`LINKS_BEFORE`):** `/admin/dealer/1380/permaplate` listed one row — ID 3, "10 ans", 120 months, Enabled Yes. This is the record the restore was checked against.
- Q-001 is still Blocking and Open (R1 round 2, 2026-11-15T09:24Z); AP2501_006 ships BLOCKED and only its line-order observations are recorded.
- Execution Context agrees with the sources, with two differences seen today and noted in the cases below: the Admin link modal heading now reads "Link a Esthetic protection product to dealer Test QA staging" and the unlink alert reads "Esthetic protection product unlinked" (the case text says "Permaplate product …"). These are wording changes in setup screens, not faults under test.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_001-step5-InvoiceDescriptionTerm_pass.png` | Carried from 2026-11-02 — invoice 941 shows "PNA-0000000020" then "10 ans" |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_002-step3-Nov15-Invoice956Term5ans_pass.png` | Invoice 956 reads "5 ans", no "10 ans"; "5 ans" link removed, restore confirmed |
| AP2501_003 | The Admin invoice PDF of a new Permaplate invoice names the term sold in its description | High | ❌ | 2 | 2 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step3-Nov15-AdminInvoicePdfHttp500_fail.png` | AP-2529 again: the Admin "PDF" button answers HTTP 500 for invoices 941 and 956 |
| AP2501_004 | The Dealer Portal invoice list shows each Permaplate invoice's own term name in full | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_004-step3-Nov15-DealerListRow956Term5ans_pass.png` | Row 956 shows "5 ans", row 941 "10 ans"; six lines, nothing cut off |
| AP2501_005 | The Admin-area invoice list shows each Permaplate invoice's own term name in full | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_005-step4-Nov15-AdminListRow956Term5ans_pass.png` | Row 956 shows "5 ans", row 941 "10 ans"; six lines, nothing cut off |
| AP2501_006 | On every invoice surface, the term name sits on the line right after the contract number | Medium | 🚫 | 0 | 0 | — | Carried from 2026-11-02 — BLOCKED on Q-001 (still open); order recorded below |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2501_001 — carried forward

Not re-run. Its expected results did not change in the 2026-11-15 revision, so the PASS of
2026-11-02 stands. Full step results: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md`
→ AP2501_001. Invoice 941 (quote 6555, contract PNA-0000000020, `TERM_A` "10 ans", Grand Total $91.98) was
re-read today in AP2501_003 step 1 and still shows the same six Description lines.

### AP2501_002 — A Permaplate contract sold with a different term raises an invoice naming that term, not the first one — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Admin: open `/admin/dealer/1380/permaplate`, record `LINKS_BEFORE`; "5 ans"/"3 ans" not linked, so "Link a product" → "5 ans" → Save | "Permaplate product linked"; table = `LINKS_BEFORE` + `TERM_B` | Signed in at `/admin/login` (French login form). `LINKS_BEFORE` = one row: 3 · "10 ans" · 120 · Yes. "Link a product" opened a modal (heading "Link a Esthetic protection product to dealer Test QA staging") with the select "Permaplate product*" offering "2 ans (eligibility)", "3 ans", "3 Ans (Drive IP)", "5 ans", "Voici Vinh Le Corp traduit en français". Chose "5 ans" → Save at 10:44:24Z → alert "Permaplate product linked"; the table showed 3 "10 ans" 120 Yes and 2 "5 ans" 60 Yes | ✅ | `TERM_B` = **"5 ans"** (product 2, 60 months); `LINKED_BY_CASE = yes` |
| 2 `[Pre-Condition]` | Dealer: create client `Terme Second1115`, quote with vehicle 915, price 20000; on `/quote/{id}/permaplate` record radios, pick `TERM_B` and its first enabled option → Save | Quote created; radios include "10 ans" and `TERM_B`; "Esthetic protection quote saved successfully" | Signed in at `/login`. `/vehicle/915/details` → "Create quote" → client form filled from Test Data → Save → `URL = /quote/6709/details`. `/quote/6709/vehicle`: vehicle select value 915 (VIN 1FAHP35NX8W239204, pre-selected), Delivery date 2026-11-15, Price 10000 → `20000` → Save. `/quote/6709/permaplate`: radios in page order = ["5 ans" (`permaplate_2`), "10 ans" (`permaplate_3`)]. Clicked the "5 ans" label → options under it: Intérieur – Fiberguard 35$ (`option_11`), Intérieur – Leatherguard 40$ (`option_12`), Paintguard premium plus 40$ (`option_10`), Extra care (5 ans couverture ) 75$ (`option_27`, disabled). Clicked the Fiberguard label → `permaplate_2 checked = true`, `option_11 checked = true`, "Cost: 35$". Save → `/quote/6709/details` with "Esthetic protection quote saved successfully"; row "Esthetic protection — Intérieur – Fiberguard Cost: CA$35.00$", amount CA$35.00 | ✅ | Quote **6709** (client `terme.second.1115@yopmail.com`). "5 ans" now sorts before "10 ans" |
| 3 | Esthetic protection row "⋯" → Generate Contract; check Program Term = `TERM_B`; Financing company "AutoCapital Canada" → Generate Contract; open `/invoice/{id}` and read the Description | Contract and invoice created, no error; Program Term = `TERM_B`; Description recorded | The row menu link "Generate Contract" → `/quote/6709/permaplate-create-contract` (heading "Esthetic protection Contract"). Product Summary: Program Term = "5 ans", Start Date 2026-11-15, End date 2031-11-15, Financing company "Choose" → chose "AutoCapital Canada", Selected protection products "Intérieur – Fiberguard", Total CA$35.00. Generate Contract → `/quote/6709/details` with "Esthetic protection contract generated successfully" and "Invoice #956 ($35) is created"; the row now links "PNA-0000000028" → `/quote/6709/permaplate-contract`. `/invoice/956`: heading "Invoice #956", page language en; Description lines: 1 "Terme Second1115" · 2 "Ford Focus 2008" · 3 "VIN : 1FAHP35NX8W239204" · 4 "PNA-0000000028" · 5 "5 ans" · 6 "Test QA staging vinhle870@gmail.com"; Total $35.00, GST $1.75, PST $3.49, Grand Total $40.24, Balance $40.24 | ✅ | Contract **PNA-0000000028**, invoice **956** (`INVOICE_B`) |
| 4 | Restore: Admin `/admin/dealer/1380/permaplate` → "Unlink" on the `TERM_B` row → "Continue" | "Permaplate product unlinked"; table = `LINKS_BEFORE` exactly | "Unlink" on row 2 "5 ans" opened the modal "Unlink a Esthetic protection product" ("Please confirm that you want to unlink dealer Test QA staging to the Esthetic protection 5 ans") → "Continue" at 10:46:20Z → alert "Esthetic protection product unlinked"; table rows = [3 · "10 ans" · 120 · Yes] — equal to `LINKS_BEFORE`. Re-read again at 10:48Z after the last case: still only 3 "10 ans" | ✅ | **Restore confirmed.** The alert says "Esthetic protection product unlinked", not the case's "Permaplate product unlinked" — label wording only |
| 5 `[Verification]` | Compare the Description with `TERM_B` and `TERM_A`, and the step 4 table with `LINKS_BEFORE` | A line reads exactly `TERM_B`; no line reads `TERM_A`; contract line = the contract made in step 3; restore confirmed | `Description line 5 = "5 ans"` (= `TERM_B`, the radio label on the Permaplate Quote page, English UI); no line reads "10 ans"; `Description line 4 = "PNA-0000000028"` (the contract made in step 3); table after unlink = `LINKS_BEFORE` | ✅ | Q-002: exact label, same text form. Q-001/Q-008 record: order = client · vehicle · VIN · contract number · **term** · dealer — the term is on the line right after the contract number |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_002-step3-Nov15-Invoice956Term5ans_pass.png` — full page of Dealer invoice 956 with "PNA-0000000028" followed by "5 ans" in the Description
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_002-step5-Nov15-RestoreConfirmedOnly10ans_pass.png` — dealer 1380's Esthetic protection tab after the unlink: the alert and the single "10 ans" row (final state)

### AP2501_003 — The Admin invoice PDF of a new Permaplate invoice names the term sold in its description — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Dealer: open `/invoice/941`; record `INVOICE_ID`, `GRAND_TOTAL` and the Description | Heading "Invoice #941"; a line reads `TERM_A` | `URL = /invoice/941`, heading "Invoice #941". Description: "Terme Invoice1102" · "Ford Focus 2008" · "VIN : 1FAHP35NX8W239204" · "PNA-0000000020" · "10 ans" · "Test QA staging vinhle870@gmail.com"; Total $80.00; Grand Total $91.98; Balance $91.98 | ✅ | `INVOICE_ID = 941`, `GRAND_TOTAL = $91.98` — invoice 941 still valid, no fallback needed |
| 2 `[Pre-Condition]` | Admin: open `/admin/invoice/941` | Page loads; header shows a "PDF" button | `URL = /admin/invoice/941`, heading "Invoice #941"; header buttons Back · Print · Edit · Credit memo · Add payment · **PDF** (`href = /admin/invoice/941/pdf`, `target = _blank`); same six Description lines as the Dealer page. The page history lists "Invoice PDF exported … Exported on Monday, Nov 2nd 2026 00:45:03" (the 2026-11-02 attempt) | ✅ | — |
| 3 | Click "PDF" and read the PDF's description | HTTP 200 `application/pdf`, showing 941 and $91.98 | Clicking "PDF" opened a new tab at `/admin/invoice/941/pdf`; the response was **HTTP 500**, `content-type = text/html; charset=UTF-8`, and the page showed the French error "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No PDF was served. Control check: `/admin/invoice/956/pdf` (today's "5 ans" invoice) also answered HTTP 500, `text/html` | ❌ | **FAIL — the step under test.** Same fault as AP-2529 (open, High): `/admin/invoice/{id}/pdf` answers HTTP 500. Link it at Gate C; do not file a new bug. Request lines in the `-network.txt` file below |
| 4 `[Verification]` | Compare the PDF with `TERM_A` and the invoice page | The PDF shows 941, $91.98, a line reading `TERM_A`, same contract and term lines as the page | Nothing to compare: no PDF exists — the "PDF" button answered the error page again on a second open | ❌ | Objective fault "the PDF button answers HTTP 5xx" (AP-2529). A dealer or staff member still cannot produce the invoice document, so the paper record of the sale — with or without the term — cannot be issued |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step3-Nov15-AdminInvoicePdfHttp500_fail.png` — the new tab at `/admin/invoice/941/pdf` showing the French technical-error page instead of the invoice PDF
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step3-Nov15-AdminInvoicePdfHttp500_fail-network.txt` — method, URL and status of the two PDF requests (941 and 956, both HTTP 500)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step4-Nov15-NoInvoicePdfToCompare_fail.png` — `/admin/invoice/941/pdf` re-opened for the verification, same error page (final state)

### AP2501_004 — The Dealer Portal invoice list shows each Permaplate invoice's own term name in full — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fallback if needed; open `/invoice` | 941 (`TERM_A`) and `INVOICE_B` (`TERM_B`) known; list loads with five columns | AP2501_002 made `INVOICE_B` = 956 this run, so no fallback ran. `/invoice` loads, columns Invoice ID · Description · Amount · Created at · Status; newest first (956 … 947 on page 1; 28 pages) | ✅ | No new records created by this case |
| 2 | Find rows 941 and 956; read the Description cells in full | Both rows found; text recorded verbatim, including any cut-off | Row 956 (page 1, top): "956 #PNA-0000000028"; Description = "Terme Second1115 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000028 / 5 ans / Test QA staging vinhle870@gmail.com"; $40.24; "Payment pending". Row 941 (`/invoice?page=2`): "941 #PNA-0000000020"; Description = "Terme Invoice1102 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000020 / 10 ans / Test QA staging vinhle870@gmail.com"; $91.98; "Payment pending". Both cells: six `<br>`-separated lines, `white-space = normal`, `text-overflow = clip`, content width ≤ cell width (nothing cut off) | ✅ | Q-005: in full, one item per line |
| 3 `[Verification]` | Compare each row's Description with the term sold | 941 has a line reading `TERM_A`, 956 a line reading `TERM_B`; full text, one item per line | `Row 956 line 5 = "5 ans"` (= `TERM_B`); `Row 941 line 5 = "10 ans"` (= `TERM_A`); neither row shows the other's term; six lines each, not shortened | ✅ | Q-002: each term reads as its Permaplate Quote radio label |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_004-step3-Nov15-DealerListRow956Term5ans_pass.png` — Dealer Invoices page 1 with row 956 showing "PNA-0000000028" then "5 ans"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_004-step3-Nov15-DealerListRow941Term10ans_pass.png` — Dealer Invoices page 2 with row 941 showing "PNA-0000000020" then "10 ans" (final state)

### AP2501_005 — The Admin-area invoice list shows each Permaplate invoice's own term name in full — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fallback if needed; sign in to the Admin Portal | Both invoices known; `/admin` loads | 941 and 956 known (no fallback). Admin session from AP2501_002 still valid → `URL = /admin` | ✅ | — |
| 2 | Open the sidebar "Invoices" | `/admin/invoices`, heading "Invoices", five columns | Sidebar group "Billing" expanded → "Invoices" → `URL = /admin/invoices`, heading "Invoices", columns Invoice ID · Description · Amount · Created at · Status | ✅ | The Billing group starts collapsed; its two items are Invoices and Payment history |
| 3 | Find rows 941 and 956; read the Description cells | Both rows found; text recorded verbatim | Row 956 (page 1, top): Description = "Terme Second1115 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000028 / 5 ans / Test QA staging vinhle870@gmail.com"; $40.24; "Payment pending". Row 941 (`?page=2`): "Terme Invoice1102 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000020 / 10 ans / Test QA staging vinhle870@gmail.com"; $91.98; "Payment pending". Six lines each, not cut off (same CSS as the Dealer list) | ✅ | Q-005: in full, one item per line |
| 4 `[Verification]` | Compare each row's Description with the term sold | 941 → `TERM_A`, 956 → `TERM_B`; full text | `Row 956 line 5 = "5 ans"` (= `TERM_B`); `Row 941 line 5 = "10 ans"` (= `TERM_A`); no cross-over; six lines each | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_005-step4-Nov15-AdminListRow956Term5ans_pass.png` — Admin Invoices page 1 with row 956 showing "PNA-0000000028" then "5 ans"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_005-step4-Nov15-AdminListRow941Term10ans_pass.png` — Admin Invoices page 2 with row 941 showing "PNA-0000000020" then "10 ans" (final state)

### AP2501_006 — carried forward (BLOCKED on Q-001) — line-order observations only

Not executed: Q-001 (Blocking) is still unanswered. Full record of 2026-11-02:
`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` → AP2501_006.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the AP2501_001 invoice | — | Not executed as a case | 🚫 | Q-001 open |
| 2 | Line order on the details page and the invoice PDF | — | Observed today: details pages of 941 and 956 (Dealer and Admin) — contract number on line 4, term on line 5. The invoice PDF could not be read (HTTP 500, AP-2529) | 🚫 | Recorded for Q-001, not judged |
| 3 | Line order on the Dealer and Admin lists | — | Observed today: rows 941 and 956 on both lists — contract number then the term on the next line | 🚫 | Recorded for Q-001, not judged |
| 4 `[Verification]` | Judge the position against Q-001 | — | Not judged | 🚫 | Stays BLOCKED until a non-developer answers Q-001 |

---

## Knowledge lookups

None needed: no step met a field, default or workflow the cases did not cover.

## Environment Observations

- **Leaves behind (Dev, 2026-11-15):** client `terme.second.1115@yopmail.com` (Terme Second1115); quote **6709** (vehicle 915, price 20000); Permaplate contract **PNA-0000000028** (term "5 ans", option Intérieur – Fiberguard, Financing company AutoCapital Canada); unpaid invoice **956** ($35.00, Grand Total $40.24) — invoices are permanent. Dealer 1380's Permaplate link to product 2 "5 ans" was **created at 10:44:24Z and removed at 10:46:20Z**; the list was confirmed equal to `LINKS_BEFORE` (only 3 "10 ans") at 10:46Z and again at 10:48Z. Nothing else was changed. Records of other tickets (AP-2503, AP-2374, AP-1948) were not touched.
- **Generate Contract on the quote page header** now points to the quote-level **checkout** page `/quote/{id}/checkout` ("Checkout quote #N", cards "Vehicle" and "Client", each with Edit); the Esthetic protection row's ⋯ → Generate Contract still opens `/quote/{id}/permaplate-create-contract`, which the cases use. Written back to `quote-creation.md`.
- The Permaplate contract page's vehicle summary line now shows the quote's price (CA$20,000.00), not the inventory price; "Product Summary" is now an H3.
- AP-2529 (Admin invoice PDF HTTP 500) is not fixed on Dev on 2026-11-15: both a 13-day-old invoice (941) and a new one (956) fail.

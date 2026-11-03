# Execution Log — AP-2501: Permaplate invoice — include name of the term in the description

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (worker for AP-2501, `stlc-ticket-pipeline --from s4 --until s4c`)
**Date:** 2026-11-02 (UTC; the application's own clock shows Sunday, November 1, 2026 — Montreal time)
**Environment:** Dev (v2dev) — chosen by the user for this run; staging was not opened
**Base URL:** https://v2dev.garantieavantageplus.ca/ (Dealer `/login`, Admin `/admin/login`; credentials from the `env` source, *Dev Environment* section)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-02T00:39Z → 2026-11-02T00:44Z
**Test cases:** `qa-artifacts/3-test-cases/AP2501_TestCases_001-005.md`, `qa-artifacts/3-test-cases/AP2501_TestCases_006-006.md`
**Run folder:** no-sprint

| Metric | Value |
|---|:---:|
| Total test cases | 6 |
| Passed | 1 |
| Failed | 1 |
| Blocked | 4 |
| Skipped | 0 |
| **Pass rate** | **16.7% (1 of 6)** |

**Pre-run checks**

- Tracker preflight and environment health check: already passed before this worker started (orchestrator).
- Q-001 (Blocking) re-checked on AP-2501 at 00:39Z: the ticket has 2 comments — Ken Nguyen (2026-10-28, "please start on this ticket") and the QA questions comment. No answer, so AP2501_006 stays BLOCKED.
- Dealer 1380's Permaplate product link on Dev: **only one term is offered** — `/admin/dealer/1380/permaplate` lists product 3 "10 ans" (120 months) and nothing else, and `/quote/{id}/permaplate` shows the single radio "10 ans". The Dev catalogue `/admin/permaplate` holds other enabled terms (1 "3 ans", 2 "5 ans", 5 "3 Ans (Drive IP)", 6 "2 ans (eligibility)") that are not linked to the dealer. The test cases do not authorise changing the dealer's product links, so the configuration was left as found and the cases that need a second term follow their own BLOCKED rule.
- The `env-check` source is missing (declared gap); the orchestrator's health check stood in for it.
- Execution Context of the test-case files names v2staging; this run used Dev by the user's decision. Routes and flows were taken from the Dev sections of `quote-creation.md` and `billing-invoices.md`, which are newer than the Execution Context: on Dev the contract is made from the quote's **Esthetic protection** row ⋯ → **Generate Contract** (`/quote/{id}/permaplate-create-contract`), not a "Create Contract" control on the Permaplate page.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_001-step5-InvoiceDescriptionTerm_pass.png` | Invoice 941 description reads "PNA-0000000020" then "10 ans"; no retail price |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | High | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_002-step2-OnlyOneTermOffered_blocked.png` | Environment: dealer 1380 offers only one term ("10 ans") on Dev — no second term to sell |
| AP2501_003 | The PDF of a new Permaplate invoice names the term sold in its description | High | ❌ | 1 | 1 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step2-AdminInvoicePdfHttp500_fail.png` | The invoice PDF control (`/admin/invoice/941/pdf`) returns HTTP 500 — the PDF cannot be read |
| AP2501_004 | The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row | Medium | 🚫 | 2 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_004-step3-DealerListTermARowOnly_blocked.png` | No `TERM_B` invoice could be made (same reason as AP2501_002); the `TERM_A` row does show "10 ans" |
| AP2501_005 | The Admin-area invoice list shows the term name in the new Permaplate invoice's row | Medium | 🚫 | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_005-step4-AdminListTermARowOnly_blocked.png` | No `TERM_B` invoice could be made (same reason as AP2501_002); the `TERM_A` row does show "10 ans" |
| AP2501_006 | On every invoice surface, the term name sits on the line right after the contract number | Medium | 🚫 | 0 | 0 | — | Shipped BLOCKED on Q-001 (Blocking, unanswered on 2026-11-02) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2501_001 — A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Sign in to the Dealer Portal; create the client `Terme Invoice1102`; attach VIN `1FAHP35NX8W239204`, delivery today, price `20000` | Quote created with client and vehicle; quote ID recorded | Signed in at `/login`. Entered through `/vehicle/915/details` → "Create quote" (`/quote/new/client?fromVehicleId=915`); Save → `URL = /quote/6555/details`. `/quote/6555/vehicle`: `Select "vehicle" = 1FAHP35NX8W239204`, `deliveredAt = 2026-11-01` (pre-filled, the server's today), `price` changed 10000 → `20000`; Save → back on `/quote/6555/details`, Summary shows "Ford Focus 2008 · Delivery date: Nov 1, 2026 · CA$20,000.00" | ✅ | Quote **6555** (client `terme.invoice.1102@yopmail.com`, province Québec) |
| 2 `[Pre-Condition]` | Open `/quote/{id}/permaplate`, pick the first term and its first option → Save; record `TERM_A`, option and prices | Selection saves; `TERM_A`, option and prices recorded | `/quote/6555/permaplate` ("Permaplate Quote"): one radio `permaplate_3` label = "10 ans". Options listed: "Antirouille – Rust+Sound (combo)" Cost 80$ · "Peinture – Céramique + Graphene" Cost 75$ · "Extra care (5 ans couverture )" Cost 70$ (disabled). Clicked `label[for=permaplate_3]` and `label[for=option_20]` → `permaplate_3 checked = true`, `option_20 checked = true`, running total "Cost: 80$". Save → `/quote/6555/details`, alert "Esthetic protection quote saved successfully"; row "Esthetic protection — Antirouille – Rust+Sound (combo) Cost: CA$80.00$", amount "-" | ✅ | `TERM_A` = **"10 ans"**; option = Antirouille – Rust+Sound (combo), cost 80$. The page shows only cost prices — no retail price exists on it |
| 3 | Note the highest invoice ID on `/invoice`; click Generate Contract with Financing company "Choose" | "Esthetic protection contract generated successfully" and "Invoice #… ($…) is created", no error; contract number and invoice ID recorded | Highest invoice on `/invoice` before = **940** (#PNA-0000000019). Details → Esthetic protection row ⋯ → "Generate Contract" → `/quote/6555/permaplate-create-contract` ("Esthetic protection Contract"; Program Summary: Program Term "10 ans", 2026-11-01 → 2036-11-01, "Antirouille – Rust+Sound (combo)", Total 80.00$; financingCompany = "Choose"). Submit → `/quote/6555/details` with alerts "Esthetic protection contract generated successfully" and "Invoice #941 ($80) is created"; no error page | ✅ | Contract **PNA-0000000020** (admin id 20), invoice **941**. Dev control is "Generate Contract" in the row menu, not "Create Contract" |
| 4 | Open `/invoice/{invoiceId}` and read the Description cell line by line | Page loads, Description visible, every line recorded | `URL = /invoice/941`, heading "Invoice #941", UI language English. Description cell (lines split by `<br>`): 1 "Terme Invoice1102" · 2 "Ford Focus 2008" · 3 "VIN : 1FAHP35NX8W239204" · 4 "PNA-0000000020" · 5 "10 ans" · 6 "Test QA staging vinhle870@gmail.com"; Total $80.00; GST $4.00; PST $7.98; Grand Total $91.98; Balance $91.98 | ✅ | All six lines recorded verbatim |
| 5 `[Verification]` | Check the Description against `TERM_A`, the contract number and the prices | Contains `TERM_A`; contract number = the one created in step 3; no retail price | `Description line 5 = "10 ans"` (equals `TERM_A`); `Description line 4 = "PNA-0000000020"` (the contract created in step 3, not PNA-0000000000 or another contract's); no price appears inside the Description cell — the only amount is the Total column $80.00, the dealer cost | ✅ | Q-002: term text is exactly "10 ans" (the product's French name, no English part, no accents involved), shown in the English UI. Q-001: order is client · vehicle · VIN · contract number · **term** · dealer — the term is on the line right after the contract number |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_001-step5-InvoiceDescriptionTerm_pass.png` — full page of invoice 941 showing the Description cell with "PNA-0000000020" followed by "10 ans" (final state)

### AP2501_002 — A Permaplate contract sold with a different term raises an invoice naming that term, not the first one — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create client `Terme Second1102` and attach VIN `1FAHP35NX8W239204`, delivery today, price `20000` | A second quote exists; ID recorded | `/quote/new/client?fromVehicleId=915` → Save → `URL = /quote/6556/details`; `/quote/6556/vehicle` price `20000`, delivery 2026-11-01 → Save → `/quote/6556/details` | ✅ | Quote **6556** (client `terme.second.1102@yopmail.com`) |
| 2 `[Pre-Condition]` | Open `/quote/{id}/permaplate`, record every term, pick a term different from `TERM_A` | `TERM_B` differs from `TERM_A`; if only one term is offered, record the list and mark BLOCKED | `/quote/6556/permaplate`: term radios = ["10 ans"] only (one radio, `permaplate_3`). No term other than `TERM_A` exists to select; nothing was saved | 🚫 | **BLOCKED — environment.** Dealer 1380 has only product 3 "10 ans" linked on Dev (`/admin/dealer/1380/permaplate`). To unblock: link a second enabled term (e.g. 2 "5 ans" or 1 "3 ans") to dealer 1380 in the Admin dealer's "Esthetic protection" tab |
| 3 | Generate Contract | — | Not run | 🚫 | Blocked by step 2 |
| 4 | Open the invoice details | — | Not run | 🚫 | Blocked by step 2 |
| 5 `[Verification]` | Compare the term line with `TERM_B` | — | Not run | 🚫 | Blocked by step 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_002-step2-OnlyOneTermOffered_blocked.png` — Permaplate Quote page of quote 6556 offering the single term "10 ans" (final state)

### AP2501_003 — The PDF of a new Permaplate invoice names the term sold in its description — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/invoice/{invoiceId}` for the AP2501_001 invoice; record the invoice number, Grand Total and Balance | Same Description as in AP2501_001; values recorded | `URL = /invoice/941`, heading "Invoice #941", Description identical to AP2501_001 step 4. `INVOICE_ID = 941`, `GRAND_TOTAL = $91.98`, `BALANCE = $91.98` | ✅ | — |
| 2 | List every control that downloads or opens a PDF; open each; keep only the PDF showing `INVOICE_ID` and `GRAND_TOTAL` | The invoice PDF opens (HTTP 200, `application/pdf`), shows 941 and $91.98, and is not the contract download | **Dealer `/invoice/941`** has two candidate controls: "Print" (`href="#"`, `onclick="window.print()"` — the browser print dialog, not a served PDF) and the footer link "#PNA-0000000020" → `/quote/6555/permaplate-contract-download` = the contract PDF, which is excluded (it also answered **HTTP 500**, `text/html`, the known AP-2512). **Admin `/admin/invoice/941`** has the invoice's own PDF control: button "PDF" → `/admin/invoice/941/pdf` (`target=_blank`). Opening it (fetch and real click into a new tab, two attempts) → **HTTP 500**, `content-type = text/html; charset=UTF-8`, page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No PDF was served | ❌ | **FAIL — objective fault "the invoice PDF control returns an error or a non-PDF".** A PDF control exists, so the Q-007 BLOCKED branch does not apply. Not Permaplate-only: `/admin/invoice/{id}/pdf` also returned HTTP 500 for invoices 940, 937 (warranty), 936, 935, 934 (warranty), 930, 900 and 800. A dealer or Avantage Plus staff member cannot produce the invoice document at all, so the paper record of the sale — with or without the term — cannot be issued |
| 3 | Read the invoice PDF's description block | — | Not run — no PDF was served | 🚫 | Blocked by the step 2 failure |
| 4 `[Verification]` | Confirm it is the invoice PDF and compare with `TERM_A` | — | Not run — no PDF was served | 🚫 | Blocked by the step 2 failure. Q-002: not observable on the PDF |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_003-step2-AdminInvoicePdfHttp500_fail.png` — `/admin/invoice/941/pdf` showing the French technical-error page instead of the invoice PDF (final state)

### AP2501_004 — The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Make sure invoices exist for AP2501_001 (`TERM_A`) and AP2501_002 (`TERM_B`); open `/invoice` | Both invoice IDs known; list loads | AP2501_001 invoice = 941 (`TERM_A` "10 ans"). AP2501_002 produced no invoice, and the fallback cannot create one: only one term is offered (see AP2501_002 step 2). `/invoice` loads with columns Invoice ID · Description · Amount · Created at · Status | 🚫 | **BLOCKED — environment** (same reason as AP2501_002: no second term on dealer 1380). Steps 2–3 run for the 941 row only, as an observation |
| 2 | Find the rows and read their description cells in full | Rows found; text recorded verbatim, including whether it is cut off | Row 941: Invoice ID cell "941 / #PNA-0000000020" (link → `/quote/6555/permaplate-contract-download`); Description = "Terme Invoice1102 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000020 / 10 ans / Test QA staging vinhle870@gmail.com" (6 lines, `<br>`-separated, not shortened: `text-overflow = clip`, `white-space = normal`); Amount $91.98; Created Sunday, November 1, 2026; Status "Payment pending". No `TERM_B` row exists | ✅ | Q-005: shown on several lines, in full, not shortened |
| 3 `[Verification]` | Compare each row's description with the term sold | `TERM_A` row contains `TERM_A`; `TERM_B` row contains `TERM_B` | `Row 941 Description line 5 = "10 ans"` (= `TERM_A`). The `TERM_B` comparison could not be made — no such invoice | 🚫 | Case stays BLOCKED: only half of its pass condition can be checked. Q-002: "10 ans", English UI |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_004-step3-DealerListTermARowOnly_blocked.png` — Dealer Invoices list with row 941 showing "PNA-0000000020" then "10 ans" (final state)

### AP2501_005 — The Admin-area invoice list shows the term name in the new Permaplate invoice's row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Make sure both invoices exist; sign in to the Admin Portal at `/admin/login` | Both IDs known; Admin dashboard loads | AP2501_002 has no invoice (see AP2501_004 step 1). Admin login page (French: "Connexion") → signed in → `URL = /admin` | 🚫 | **BLOCKED — environment** (same reason as AP2501_002). Steps 2–4 run for the 941 row only, as an observation |
| 2 | Open the invoice list from the Admin sidebar; record label and route | List loads; route and columns recorded | Sidebar "Invoices" → `URL = /admin/invoices`, heading "Invoices", columns Invoice ID · Description · Amount · Created at · Status (UI English after login) | ✅ | Route already mapped on Dev in `billing-invoices.md` (2026-11-01) — the designer's "not mapped" blocker is closed |
| 3 | Find the rows for both invoices and read their description cells | Rows found; text recorded verbatim | Row 941 (first row): Invoice ID cell "941 / #PNA-0000000020" (link → `/admin/permaplate-contract/20`); Description = "Terme Invoice1102 / Ford Focus 2008 / VIN : 1FAHP35NX8W239204 / PNA-0000000020 / 10 ans / Test QA staging vinhle870@gmail.com"; Amount $91.98; "Payment pending". No `TERM_B` row exists | ✅ | Q-005: several lines, full text |
| 4 `[Verification]` | Compare each row's description with the term sold | `TERM_A` row contains `TERM_A`; `TERM_B` row contains `TERM_B` | `Row 941 Description line 5 = "10 ans"` (= `TERM_A`). The `TERM_B` comparison could not be made | 🚫 | Case stays BLOCKED: only half of its pass condition can be checked |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2501/AP2501_005-step4-AdminListTermARowOnly_blocked.png` — Admin Invoices list with row 941 showing "PNA-0000000020" then "10 ans" (final state)

### AP2501_006 — On every invoice surface, the term name sits on the line right after the contract number — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/invoice/{invoiceId}` for the AP2501_001 invoice | — | Not executed as a case — shipped BLOCKED | 🚫 | Q-001 (Blocking) unanswered on AP-2501 as of 2026-11-02T00:39Z |
| 2 | Record line order on the details page and the invoice PDF | — | Observed in other cases: details page order = contract number (line 4) then "10 ans" (line 5). The invoice PDF surface could not be checked — it returns HTTP 500 (AP2501_003) | 🚫 | Recorded for Q-001, not judged |
| 3 | Record the order on the Dealer and Admin lists | — | Observed in AP2501_004/005: both lists show "PNA-0000000020" then "10 ans" on the next line | 🚫 | Recorded for Q-001, not judged |
| 4 `[Verification]` | Judge the position against the answer to Q-001 | Not known — Q-001 | Not judged | 🚫 | Stays BLOCKED until a non-developer answers Q-001 |

**Screenshots:** none — the case was not executed.

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2501_002 | 🚫 | Environment: dealer 1380 offers only one Permaplate term ("10 ans") on Dev, so no contract with a different term can be sold. Fix: link a second enabled term (e.g. "5 ans") to dealer 1380 in Admin → dealer → Esthetic protection, then re-run |
| AP2501_004 | 🚫 | Needs the AP2501_002 invoice (`TERM_B`), which cannot be created for the same reason. The `TERM_A` row was checked and shows "10 ans" |
| AP2501_005 | 🚫 | Same as AP2501_004, on the Admin list. The `TERM_A` row shows "10 ans" |
| AP2501_006 | 🚫 | Q-001 (Blocking) — "name of the invoice" vs "name of the term" — still unanswered on AP-2501 |

---

## Environment Observations

- **Environment: Dev (v2dev)**, by the user's decision. The application's clock was still on Sunday, November 1, 2026 (delivery date pre-filled 2026-11-01; invoices dated "Sunday, November 1, 2026").
- **Invoice PDF is broken on Dev for every invoice**, not only Permaplate ones: `/admin/invoice/{id}/pdf` → HTTP 500 for 941, 940, 937, 936, 935, 934, 930, 900 and 800 (the AP-1381 run saw the same on 934 on 2026-11-01). Recorded as the AP2501_003 FAIL because it is the step under test.
- **The Dealer invoice page offers no invoice PDF**: only "Print" (`window.print()`) and the contract link. A dealer can only print the HTML page. Recorded as an observation for the test report; the case itself was judged on the Admin PDF control.
- The Permaplate contract download `/quote/6555/permaplate-contract-download` → HTTP 500 (known AP-2512). Not used as evidence.
- The Esthetic protection row on quote 6555 shows amount "-" and the Subtotal stays CA$20,000.00 (known AP-2516).
- The HTTP 500 error page under `/admin/invoice/941/pdf` is rendered inside the **dealer** layout (dealer sidebar "Test QA staging"), even though it was opened from the Admin portal.
- **Test data left on Dev (cannot be deleted):** quote **6555** (client Terme Invoice1102, `terme.invoice.1102@yopmail.com`) with Permaplate contract **PNA-0000000020** (admin id 20) and unpaid invoice **941** ($80.00, Grand Total $91.98); quote **6556** (client Terme Second1102, `terme.second.1102@yopmail.com`) with vehicle 915 and no product. The `cleanup` source is missing, so both stay.
- No configuration was changed: dealer 1380's Permaplate links were read, not edited.

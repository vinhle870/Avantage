# Test Cases — AP2501 (File 1 of 2)

**Project:** Avantage Plus v2 — Permaplate ("Esthetic protection") invoicing
**Requirement:** AP2501 — Permaplate invoice: include the name of the term in the description (REQ-001 to REQ-003)
**Source:** `requirements/AP-2501-permaplate-invoice-include-name-of-the.md`, `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2501_test-plan.md`
**Date:** 2026-11-01
**Revised:** 2026-11-01 — R2 rework (independent reviewer, round 1): AP2501_003 steps 1, 2 and 4 now identify the invoice PDF by invoice number and Grand Total and go BLOCKED (Q-007) when only the contract PDF exists (F-1); Execution Context credits the AP-2446 execution log for the Create Contract flow and `/invoice/{invoiceId}` (F-2); AP2501_004/005 gain a Test Data fallback (F-4)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2501_001 to AP2501_005 (5 test cases)
**Coverage:** Functional · Edge-case · Regression · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer Portal for AP2501_001–004; Admin Portal for AP2501_005 | `navigation` |
| **Entry route** | Dealer: `/quote/new/client` to start a quote, `/quote/{id}/vehicle`, `/quote/{id}/permaplate` (heading "Permaplate Quote": term radios `permaplate_id`, option checkboxes, **Save**); invoices list at `/invoice` (Billing → Invoices). Admin: the invoice list is **not mapped** — see Known blockers #2 | `navigation`, `domain` (`quote-creation.md`) |
| **Contract → invoice flow** | The **Create Contract** control on the quote's Permaplate area; on success the alerts "Esthetic protection contract generated successfully" and "Invoice #… ($…) is created"; one invoice's details at `/invoice/{invoiceId}` (Description cell, itemized table ending in Grand Total and Balance, footer link `#PNA-…`). Not in `navigation` or `domain` — the executor writes this flow and route back to `domain` after s4 | `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md` (AP2446_001–003) |
| **Contract PDF (not the invoice PDF)** | The Permaplate contract download `/quote/{quoteId}/permaplate-contract-download`, served as `permaplate-{contractId}.pdf`. AP2501_003 must not accept this file as the invoice PDF | `domain` (`quote-creation.md`) |
| **Viewport** | 1280 × 800 | `navigation` (registry `browser` settings) |
| **Environment** | v2staging — Dealer and Admin Portal URLs as listed in the `env` source | `env` |
| **Login** | One shared account for both portals: username and password from the `env` source (`qa-artifacts/base-test/execute.env.md`, *Portals* table); Dealer ID `1380` ("Test QA staging") | `env` |
| **Test data** | Vehicle `915`, VIN `1FAHP35NX8W239204`, Ford Focus 2008. The Permaplate product(s) linked to Dealer 1380, offered as term radios on `/quote/{id}/permaplate` (labelled e.g. "10 ans" in earlier runs) | `test-data`, `domain` |
| **Language** | English UI by default. Record the UI language at the time of each check, because the term name may be bilingual (`10 ans/yrs ( suite complète )` in the ticket's screenshot) — Q-002 | `navigation`, capture |
| **Leaves behind** | Two clients, two quotes, two Permaplate contracts and two unpaid invoices on Dealer 1380 (AP2501_001 and AP2501_002). The `cleanup` source is missing, so they stay on staging | `cleanup` (missing) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The control that produces the **invoice** PDF has never been recorded (label and route). AP-2446's run saw only a footer link `#PNA-…` on `/invoice/{id}` carrying the contract number — which may be the contract PDF, not the invoice PDF. | AP2501_003, AP2501_006 step 2 | New — explored in AP2501_003 step 2 and identified by content (invoice number + Grand Total). If only the contract PDF or no PDF is reachable, AP2501_003 is BLOCKED with question Q-007 recorded for s7 (not posted at design time) |
| 2 | The route of the Admin-area invoice list. Neither the `navigation` index nor `admin-portal.md` maps it. | AP2501_005 | New — resolved by exploration from the Admin sidebar in step 2; if no Admin invoice list can be found, the case is recorded BLOCKED, not FAIL |

> Neither blocker is a missing *product* fact, so no case ships BLOCKED for them: each case
> finds the route itself and records it. The positional check (REQ-004), which depends on
> the Blocking question Q-001, is in the next file as AP2501_006 and ships BLOCKED.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | Functional | High | PASS |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | Edge-case | High | BLOCKED |
| AP2501_003 | The PDF of a new Permaplate invoice names the term sold in its description | Functional | High | FAIL |
| AP2501_004 | The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row | Functional | Medium | BLOCKED |
| AP2501_005 | The Admin-area invoice list shows the term name in the new Permaplate invoice's row | Functional | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2501_001 — A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price

| Field | Value |
|---|---|
| **TC ID** | AP2501_001 |
| **Title** | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price |
| **Requirement** | AP2501 — REQ-001 AC 1–2 ("include name of the term in the description of the invoice when it is generated"; "On the invoice details page"); regression of AP-2461 and AP-2456 criterion 4 |
| **Route** | `/quote/{id}/permaplate` → **Create Contract** → `/invoice/{invoiceId}` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — invoice 941 Description names "10 ans" on the line after PNA-0000000020; no retail price — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Why this matters:** This is the whole ticket. A dealer who opens the invoice must be able
to see which coverage length they were billed for; without it, the description lists the
client, the car and a contract number, and the dealer has to open the contract to know what
they bought. The case also creates the contract and invoice that AP2501_003 to AP2501_005
reuse, so the invoice ID, contract number and term label must be written into the execution
log. The exact wording and language of the term are not stated (Q-002), so they are recorded,
not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer Portal account from the `env` source |
| Client, created by this case | First name `Terme`, last name `Invoice{MMDD}` (today's month and day, e.g. `Invoice1102`), email `terme.invoice.{MMDD}@yopmail.com`, address `220 Boulevard Saint-Laurent`, city `Montreal`, province `Québec`, postal code `H2Y 1Z4`, home phone `5145550200`, work phone `5145550201`, policy-agreement checkbox ticked |
| Vehicle | Inventory vehicle with VIN `1FAHP35NX8W239204` (vehicle 915) |
| Term | The **first** term radio offered on `/quote/{id}/permaplate` — its label is recorded as `TERM_A` |
| Option | The first option checkbox offered under `TERM_A` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer Portal at `/login` with the `env` account. Open `/quote/new/client`, enter the client from Test Data → **Save**. Open `/quote/{id}/vehicle`, select the vehicle with VIN `1FAHP35NX8W239204`, set delivery date to today and a sale price of `20000` → **Save** | The quote is created at `/quote/{id}/details` with the client and vehicle attached. The quote ID is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/permaplate`, click the label of the first term radio and the label of its first option checkbox (the native inputs are covered by custom controls) → **Save**. Record the full term label exactly as displayed as `TERM_A`, the option name, and every price the page shows | The selection saves without an error. `TERM_A`, the option and the prices are recorded. If no term radio is offered, the Permaplate product is not linked to Dealer 1380 — record the case BLOCKED (environment) |
| 3 | Note the highest invoice ID on `/invoice`, then return to the quote's Permaplate area and click **Create Contract**, leaving Financing company on "Choose" | The page shows "Esthetic protection contract generated successfully" and an "Invoice #… ($…) is created" alert, with no error page or HTTP 500. The contract number (`PNA-…`) and the new invoice ID are recorded |
| 4 | Open `/invoice/{invoiceId}` for the new invoice and read the **Description** cell line by line | The invoice details page loads and its Description cell is visible. Every line is recorded verbatim, in order |
| 5 | [Verification] Check the Description cell recorded in step 4 against `TERM_A`, the contract number and the prices recorded in step 2 | **Pass when:** the description contains a line naming the term `TERM_A`; the contract number shown equals the one created in step 3 (not `PNA-0000000000` or another contract's); and no retail price appears in the description. **Objective faults (FAIL):** no term text at all; the name of a term other than `TERM_A`; garbled or missing characters in the term (for example `complète` broken). **Record for Q-002:** the exact text, language and any extra words of the term line. **Record for Q-001:** the order of lines (the position is judged in AP2501_006) |

---

### AP2501_002 — A Permaplate contract sold with a different term raises an invoice naming that term, not the first one

| Field | Value |
|---|---|
| **TC ID** | AP2501_002 |
| **Title** | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one |
| **Requirement** | AP2501 — REQ-001 AC 1–2 |
| **Route** | `/quote/{id}/permaplate` → **Create Contract** → `/invoice/{invoiceId}` |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Environment — dealer 1380 has one Permaplate term linked on Dev (2026-11-02) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED — environment: dealer 1380 offers only one term ("10 ans") on Dev — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Why this matters:** A single contract cannot tell the difference between "the invoice
shows the term sold" and "the invoice always shows the same text". This case sells a second,
different term, which catches a hard-coded label, a value cached from the previous contract,
or the term of the wrong product being looked up. A dealer billed for a 10-year term on an
invoice that says 5 years, or the reverse, would dispute the charge.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer Portal account from the `env` source |
| Client, created by this case | First name `Terme`, last name `Second{MMDD}`, email `terme.second.{MMDD}@yopmail.com`, address `330 Rue Sherbrooke`, city `Montreal`, province `Québec`, postal code `H3A 1B9`, home phone `5145550300`, work phone `5145550301`, policy-agreement checkbox ticked |
| Vehicle | Inventory vehicle with VIN `1FAHP35NX8W239204` (vehicle 915) |
| Term | A term radio **different from `TERM_A`** recorded in AP2501_001 — its label is recorded as `TERM_B` |
| Option | The first option checkbox offered under `TERM_B` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer Portal with the `env` account. Open `/quote/new/client`, enter the client from Test Data → **Save**. Open `/quote/{id}/vehicle`, select VIN `1FAHP35NX8W239204`, delivery date today, sale price `20000` → **Save** | A second quote exists with this client and the vehicle. Its ID is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/permaplate`, record every term label offered, click the label of a term different from `TERM_A` and of its first option → **Save**. Record the term label exactly as `TERM_B` | The selection saves. `TERM_B` differs from `TERM_A`. If only one term is offered, record the list and mark the case BLOCKED (environment — no second term to sell) |
| 3 | Click **Create Contract** in the quote's Permaplate area, leaving Financing company on "Choose" | "Esthetic protection contract generated successfully" and an "Invoice #… is created" alert appear, with no error page. The contract number and invoice ID are recorded |
| 4 | Open `/invoice/{invoiceId}` for this new invoice and read the **Description** cell line by line | The Description cell is visible; every line is recorded verbatim |
| 5 | [Verification] Compare the term line with `TERM_B` and `TERM_A` | **Pass when:** the description names `TERM_B`. **Objective faults (FAIL):** it names `TERM_A`, any other term, or no term at all. **Record for Q-002:** the exact text and language of the term line |

---

### AP2501_003 — The PDF of a new Permaplate invoice names the term sold in its description

| Field | Value |
|---|---|
| **TC ID** | AP2501_003 |
| **Title** | The PDF of a new Permaplate invoice names the term sold in its description |
| **Requirement** | AP2501 — REQ-002 AC 1 ("On the invoice generated PDF") |
| **Route** | `/invoice/{invoiceId}` → the invoice's PDF / download control |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — the invoice PDF control /admin/invoice/941/pdf returns HTTP 500; no PDF served — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Why this matters:** The PDF is the document that leaves the system — the one a dealer
files or forwards to accounting. If the screen names the term and the PDF does not, the paper
record of the sale is incomplete. Accented characters in a PDF depend on the PDF's font, so
`complète` is a realistic place for this to break even when the screen is right.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer Portal account from the `env` source |
| Invoice | The invoice created in AP2501_001 (its ID, contract number and `TERM_A` are in the execution log). If AP2501_001 did not run, repeat its steps 1–3 first to create one |
| Not the invoice PDF | The Permaplate contract download `/quote/{quoteId}/permaplate-contract-download` (file `permaplate-{contractId}.pdf`) — it names the term too, so it must never be read as the invoice PDF |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer Portal with the `env` account and open `/invoice/{invoiceId}` for the AP2501_001 invoice. Record the invoice number, the **Grand Total** and the **Balance** shown | The invoice details page loads, showing the same Description as recorded in AP2501_001 step 4. `INVOICE_ID`, `GRAND_TOTAL` and `BALANCE` are recorded |
| 2 | List every control on the page that downloads or opens a PDF (including the footer `#PNA-…` link); for each, record its label, the URL it opens and the file name served. Open each and keep only the PDF that **shows the invoice number `INVOICE_ID` and the Grand Total `GRAND_TOTAL`** as the invoice PDF | The invoice PDF opens (HTTP 200, `application/pdf`), shows `INVOICE_ID` and `GRAND_TOTAL`, and is **not** served from `/quote/{quoteId}/permaplate-contract-download` nor named `permaplate-{contractId}.pdf`. Its control's label and route are recorded for the `navigation` knowledge. **If the only PDF reachable is the contract PDF, or there is no PDF control at all:** record every control found and mark the case **BLOCKED** (question Q-007 for AP-2501, recorded for s7, not posted: "Where does a dealer get the generated invoice PDF for a Permaplate invoice — is there one, or is the contract PDF meant to serve as it?"); do not go on to steps 3–4 |
| 3 | Read the invoice PDF's description block line by line | Every line of the invoice PDF description is recorded verbatim, in order |
| 4 | [Verification] Confirm the PDF read in step 3 is the invoice PDF identified in step 2, then compare its description with `TERM_A` and with the details-page description from AP2501_001 | **Pass when:** the PDF shows `INVOICE_ID` and `GRAND_TOTAL` (same as `/invoice/{invoiceId}`), is not the contract download, **and** its description contains a line naming `TERM_A`. A term found only in the contract PDF is never a PASS. **Objective faults (FAIL):** the invoice PDF has no term text; a term other than `TERM_A`; garbled or missing characters in the term; the invoice PDF control returns an error or a non-PDF. **BLOCKED:** per step 2 (no invoice PDF reachable). **Record for Q-002:** the exact text and language; any difference from the details page |

---

### AP2501_004 — The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row

| Field | Value |
|---|---|
| **TC ID** | AP2501_004 |
| **Title** | The Dealer Portal invoice list shows the term name in the new Permaplate invoice's row |
| **Requirement** | AP2501 — REQ-003 AC 1 ("On the invoice list page (on dealer portal …)") |
| **Route** | `/invoice` — Billing → Invoices |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Environment — dealer 1380 has one Permaplate term linked on Dev (2026-11-02) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED — no TERM_B invoice (same reason as AP2501_002); TERM_A row 941 shows "10 ans" — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Why this matters:** Dealers find invoices from the list, not by ID. If the term shows only
after opening each invoice, a dealer reconciling a month of Permaplate sales has to open them
one by one. How the list lays out a multi-line description is not stated (Q-005), so only
the presence of the term is judged.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer Portal account from the `env` source |
| Invoices | The invoices created in AP2501_001 (`TERM_A`) and AP2501_002 (`TERM_B`), with their IDs from the execution log |
| Fallback | If AP2501_001 or AP2501_002 did not run (or did not produce an invoice), step 1 creates the missing invoice by repeating that case's steps 1–3 with its Test Data. If it still cannot be created (no term offered, or only one term for `TERM_B`), mark this case BLOCKED with the same environment reason that case recorded |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] If the execution log has no invoice ID for AP2501_001 or AP2501_002, create it now by repeating that case's steps 1–3 (Test Data → Fallback). Then sign in to the Dealer Portal with the `env` account and open `/invoice` | Both invoice IDs with their terms (`TERM_A`, `TERM_B`) are known. The Invoices list loads with its rows and a description column. If an invoice cannot be created, the case is BLOCKED with the reason recorded |
| 2 | Find the rows for the AP2501_001 and AP2501_002 invoice IDs and read their description cells in full (expand or hover if the cell is shortened) | Both rows are found; their description text is recorded verbatim, including whether it is cut off |
| 3 | [Verification] Compare each row's description with the term sold on that invoice | **Pass when:** the AP2501_001 row's description contains `TERM_A` and the AP2501_002 row's contains `TERM_B`. **Objective faults (FAIL):** a row shows no term; a row shows the other invoice's term. **Record for Q-005:** the layout — one line or several, shortened or full. **Record for Q-002:** the exact text and language |

---

### AP2501_005 — The Admin-area invoice list shows the term name in the new Permaplate invoice's row

| Field | Value |
|---|---|
| **TC ID** | AP2501_005 |
| **Title** | The Admin-area invoice list shows the term name in the new Permaplate invoice's row |
| **Requirement** | AP2501 — REQ-003 AC 2 ("On the invoice list page (… and admin area)") |
| **Route** | Admin Portal invoice list — route not mapped; found from the Admin sidebar in step 2 |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Environment — dealer 1380 has one Permaplate term linked on Dev (2026-11-02) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED — no TERM_B invoice (same reason as AP2501_002); TERM_A row 941 shows "10 ans" — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Why this matters:** The Admin area is where Avantage Plus staff reconcile dealer billing
across every dealership. The ticket names it explicitly. QA has never mapped the Admin
invoice list, so the case finds it and writes the route back to the `domain` knowledge
(`admin-portal.md`) for the next cycle.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Admin Portal account from the `env` source |
| Invoices | The AP2501_001 (`TERM_A`) and AP2501_002 (`TERM_B`) invoices, dealer "Test QA staging" (Dealer 1380), with their IDs from the execution log |
| Fallback | If AP2501_001 or AP2501_002 did not run (or did not produce an invoice), step 1 creates the missing invoice in the Dealer Portal by repeating that case's steps 1–3 with its Test Data. If it still cannot be created (no term offered, or only one term for `TERM_B`), mark this case BLOCKED with the same environment reason that case recorded |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] If the execution log has no invoice ID for AP2501_001 or AP2501_002, create it first in the Dealer Portal by repeating that case's steps 1–3 (Test Data → Fallback). Then sign in to the Admin Portal at `/admin/login` with the `env` account | Both invoice IDs with their terms are known. The Admin dashboard loads. If an invoice cannot be created, the case is BLOCKED with the reason recorded |
| 2 | Open the invoice list from the Admin sidebar (look under a "Billing", "Invoices" or "Facturation" item); record the item's label and the route | The Admin invoice list loads; its route and columns are recorded. If no invoice list exists in the Admin sidebar, record the case BLOCKED (navigation — Admin invoice list not found), not FAIL |
| 3 | Find the rows for the AP2501_001 and AP2501_002 invoices (filter by dealer 1380 or search by invoice ID if a filter exists) and read their description cells in full | Both rows are found; their description text is recorded verbatim, including whether it is cut off |
| 4 | [Verification] Compare each row's description with the term sold on that invoice | **Pass when:** the AP2501_001 row contains `TERM_A` and the AP2501_002 row contains `TERM_B`. **Objective faults (FAIL):** a row shows no term; a row shows the other invoice's term. **Record for Q-005:** the layout. **Record for Q-002:** the exact text and language |

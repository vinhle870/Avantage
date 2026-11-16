# Test Cases — AP2501 (File 1 of 2)

**Project:** Avantage Plus v2 — Permaplate ("Esthetic protection") invoicing
**Requirement:** AP2501 — Permaplate invoice: include the name of the term in the description (REQ-001 to REQ-003)
**Source:** `requirements/AP-2501-permaplate-invoice-include-name-of-the.md`, `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`, `qa-artifacts/2-test-plan/AP-2501_test-plan.md`
**Date:** 2026-11-01
**Revised:** 2026-11-01 — R2 rework (independent reviewer, round 1): AP2501_003 steps 1, 2 and 4 identify the invoice PDF by invoice number and Grand Total (F-1); Execution Context credits the AP-2446 execution log (F-2); AP2501_004/005 gain a Test Data fallback (F-4)
**Revised:** 2026-11-15 — after the 2026-11-15 analysis (Q-007 Answered by AP-2099; Q-002, Q-003, Q-005, Q-008 Accepted; Q-001 Blocking + Open, REQ-004 only) and the orchestrator's decision that the cases BLOCKED on 2026-11-02 set up their own second term. AP2501_002 links a second term to dealer 1380 and unlinks it in the same case; AP2501_003 tests the Admin invoice PDF button named by AP-2099 (no Q-007 branch); AP2501_004/005 assert the accepted list layout; every contract picks a Financing company (required on Dev since 2026-11-08); environment is Dev. AP2501_002–005 are back to `Not Run`; AP2501_001 keeps its 2026-11-02 PASS. Per-case Revisions tables below
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
| **Portal** | Dealer Portal for AP2501_001–004; Admin Portal for the term link in AP2501_002, the invoice PDF in AP2501_003 and the list in AP2501_005 | `navigation` |
| **Entry route** | Dealer: `/vehicle/915/details` → "Create quote" (`/quote/new/client?fromVehicleId=915` — without `fromVehicleId` the client page answers HTTP 500), `/quote/{id}/vehicle`, `/quote/{id}/permaplate` (heading "Permaplate Quote": term radios `permaplate_id` and option checkboxes, each covered by its label — click the label), quote details `/quote/{id}/details`; invoices list `/invoice` (Billing → Invoices); one invoice `/invoice/{invoiceId}`. Admin: dealer 1380's Permaplate tab `/admin/dealer/1380/permaplate` (dealer details tab "Esthetic protection"; header link "Link a product" → `/admin/dealer/1380/permaplate/link`, heading "Link a permaplate product to dealer Test QA staging", select `dealer_permaplate[permaplate]`, "Save"; each row has "Unlink" → modal "Unlink a permaplate product", buttons "Continue" / "No"); invoice list `/admin/invoices` (sidebar "Invoices"); one invoice `/admin/invoice/{invoiceId}` with a header **"PDF"** button → `/admin/invoice/{invoiceId}/pdf` (new tab) | `navigation`, `domain` (`quote-creation.md`, `billing-invoices.md`, `admin-portal.md`); link/unlink wording from `execution-log_PERMAPLATE_2026-09-06.md` (AP2447_002, AP2455_002) |
| **Contract → invoice flow (Dev, 2026-11-08 build)** | Quote details → **Esthetic protection** row "⋯" → **"Generate Contract"** (`/quote/{id}/permaplate-create-contract`, heading "Esthetic protection Contract"). Its "Product Summary" shows Program Term (the term sold) and a **Financing company** select — required on Dev since 2026-11-08 ("This value should not be blank." when left on "Choose"); pick **"AutoCapital Canada"**. Submit "Generate Contract" → quote details with "Esthetic protection contract generated successfully" and "Invoice #N ($…) is created". There is no "Create Contract" button on Dev | `domain` (`quote-creation.md`, Dev 2026-11-08, AP-2459 and AP-2506 runs) |
| **Invoice PDF** | The invoice PDF is the **Admin** invoice details page's **"PDF"** button (Q-007, Answered by Story AP-2099). The Dealer invoice page has only "Print" (the browser's print of the page) and the footer link `#PNA-…` → `/quote/{quoteId}/permaplate-contract-download`, which is the **contract** PDF (`permaplate-{contractId}.pdf`) and never counts as the invoice PDF | `domain` (`billing-invoices.md`, Dev 2026-11-02), AP-2099 |
| **Known open defects on these screens** | AP-2529 — `/admin/invoice/{id}/pdf` answers HTTP 500 on Dev (AP2501_003's step under test, so it gives a FAIL, not BLOCKED). AP-2512 — the contract PDF download answers HTTP 500 (not used by these cases). AP-2519 — the quote's documents download (not used). None is touched by these cases | `qa-artifacts/5-testing-report/AP-2501_bug-report.md`, run state |
| **Viewport** | 1280 × 800 | `navigation` (registry `browser` settings) |
| **Environment** | **Dev (v2dev)** — the registry's `execution_env`; Dealer and Admin Portal URLs from the *Dev Environment* section of the `env` source | `env`, `qa-artifacts/qa-config/tools.md` |
| **Login** | One shared account for both portals: username and password from the *Dev Environment* section of the `env` source (`qa-artifacts/base-test/execute.env.md`); Dealer ID `1380` ("Test QA staging"). No credential is written in this file | `env` |
| **Test data** | Vehicle `915`, VIN `1FAHP35NX8W239204`, Ford Focus 2008 (on Dev). Dealer 1380's linked Permaplate products on Dev: only product 3 **"10 ans"** (120 months), last seen 2026-11-08. Admin catalogue `/admin/permaplate` on Dev (read only): 1 "3 ans" 36 m · 2 "5 ans" 60 m · 3 "10 ans" 120 m · 5 "3 Ans (Drive IP)" 36 m · 6 "2 ans (eligibility)" 24 m — enabled; 4 disabled. Invoice **941** (contract PNA-0000000020, quote 6555, term "10 ans", Grand Total $91.98), created on Dev by AP2501_001 on 2026-11-02 and reused by AP2501_003–005 | `test-data`, `domain` (`quote-creation.md`), execution log 2026-11-02 |
| **Language** | English UI by default. Record the UI language at each check. Q-002 (Accepted): the term line reads exactly as the term's radio label on the Permaplate Quote page ("10 ans" in the English UI on 2026-11-02) | `navigation`, analysis Q-002 |
| **Leaves behind** | Already on Dev from 2026-11-02: quote 6555 (client Terme Invoice1102) with contract PNA-0000000020 and unpaid invoice 941; quote 6556 (client Terme Second1102, no product). This re-run: AP2501_002 leaves one client, one quote, one Permaplate contract (Financing company AutoCapital Canada) and one unpaid invoice — **invoices are permanent**. AP2501_002 also links a second term to dealer 1380 and **unlinks it again in its step 4** (the link exists only for the length of the case). AP2501_003–005 create nothing unless their fallback runs AP2501_001 or AP2501_002. The `cleanup` source is missing, so these records stay on Dev | `cleanup` (missing) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

None. The two blockers listed on 2026-11-01 are resolved: the invoice PDF control is the
Admin "PDF" button (Q-007, Answered by AP-2099; route mapped in `billing-invoices.md`), and
the Admin invoice list is `/admin/invoices` (mapped 2026-11-02). The one Blocking question,
Q-001, affects only AP2501_006 in the next file.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2501_001 | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price | Functional | High | PASS |
| AP2501_002 | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one | Edge-case | High | PASS |
| AP2501_003 | The Admin invoice PDF of a new Permaplate invoice names the term sold in its description | Functional | High | FAIL |
| AP2501_004 | The Dealer Portal invoice list shows each Permaplate invoice's own term name in full | Functional | Medium | PASS |
| AP2501_005 | The Admin-area invoice list shows each Permaplate invoice's own term name in full | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2501_001 — A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price

| Field | Value |
|---|---|
| **TC ID** | AP2501_001 |
| **Title** | A new Permaplate invoice's details page names the term sold, beside the real contract number and no retail price |
| **Requirement** | AP2501 — REQ-001 AC 1–2 ("include name of the term in the description of the invoice when it is generated"; "On the invoice details page"); Q-002 Accepted (term text = the term's label on the Permaplate Quote page); regression of AP-2461 and AP-2456 criterion 4 |
| **Route** | `/quote/{id}/permaplate` → Esthetic protection "⋯" → **Generate Contract** → `/invoice/{invoiceId}` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — invoice 941 Description names "10 ans" on the line after PNA-0000000020; no retail price — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-02.md` |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 1 entry through `/vehicle/915/details` → "Create quote"; step 3 uses the Esthetic protection row "⋯" → "Generate Contract" with Financing company "AutoCapital Canada"; step 5's Q-002 note changes from "record" to the accepted value. **Expected results unchanged**: step 5 still passes on a line naming `TERM_A`, the real contract number and no retail price, which the 2026-11-02 run observed — so the PASS stands and the case is not re-run | Dev flow per `domain` (`quote-creation.md`: Financing company required since 2026-11-08; no "Create Contract" button); Q-002 Accepted in the 2026-11-15 analysis | Orchestrator re-execution scope, 2026-11-15 |

**Why this matters:** This is the whole ticket. A dealer who opens the invoice must be able
to see which coverage length they were billed for; without it, the description lists the
client, the car and a contract number, and the dealer has to open the contract to know what
they bought. The case also creates the contract and invoice that AP2501_003 to AP2501_005
reuse (invoice 941 on Dev), so the invoice ID, contract number and term label are written
into the execution log.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer Portal account from the *Dev Environment* section of the `env` source |
| Client, created by this case | First name `Terme`, last name `Invoice{MMDD}` (today's month and day, e.g. `Invoice1102`), email `terme.invoice.{MMDD}@yopmail.com`, address `220 Boulevard Saint-Laurent`, city `Montreal`, province `Québec`, postal code `H2Y 1Z4`, home phone `5145550200`, work phone `5145550201`, policy-agreement checkbox ticked |
| Vehicle | Inventory vehicle with VIN `1FAHP35NX8W239204` (vehicle 915) |
| Term | The **first** term radio offered on `/quote/{id}/permaplate` — its label is recorded as `TERM_A` ("10 ans" on Dev) |
| Option | The first enabled option checkbox offered under `TERM_A` |
| Financing company | `AutoCapital Canada` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer Portal at `/login` with the `env` account. Open `/vehicle/915/details` → "Create quote" (`/quote/new/client?fromVehicleId=915`), enter the client from Test Data → **Save**. Open `/quote/{id}/vehicle`, select the vehicle with VIN `1FAHP35NX8W239204`, keep the delivery date at today and set the price to `20000` → **Save** | The quote is created at `/quote/{id}/details` with the client and vehicle attached. The quote ID is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/permaplate`, click the label of the first term radio and the label of its first enabled option checkbox → **Save**. Record the full term label exactly as displayed as `TERM_A`, the option name, and every price the page shows | "Esthetic protection quote saved successfully" appears with no error. `TERM_A`, the option and the prices are recorded. If no term radio is offered, the Permaplate product is not linked to Dealer 1380 — record the case BLOCKED ("test data not on Dev: no Permaplate term linked to dealer 1380") |
| 3 | Note the highest invoice ID on `/invoice`. On the quote details page open the **Esthetic protection** row "⋯" → **"Generate Contract"**, choose Financing company **"AutoCapital Canada"** → **"Generate Contract"** | The page shows "Esthetic protection contract generated successfully" and an "Invoice #… ($…) is created" alert, with no error page or HTTP 500. The contract number (`PNA-…`) and the new invoice ID are recorded |
| 4 | Open `/invoice/{invoiceId}` for the new invoice and read the **Description** cell line by line | The invoice details page loads and its Description cell is visible. Every line is recorded verbatim, in order |
| 5 | [Verification] Check the Description cell recorded in step 4 against `TERM_A`, the contract number and the prices recorded in step 2 | **Pass when:** the description contains a line naming the term `TERM_A`; the contract number shown equals the one created in step 3 (not `PNA-0000000000` or another contract's); and no retail price appears in the description. **Objective faults (FAIL):** no term text at all; the name of a term other than `TERM_A`; garbled or missing characters in the term. **Accepted (Q-002):** the term line reads exactly as `TERM_A` is labelled on the Permaplate Quote page ("10 ans" on Dev, 2026-11-02). **Record for Q-001:** the order of lines (the position is judged in AP2501_006) |

---

### AP2501_002 — A Permaplate contract sold with a different term raises an invoice naming that term, not the first one

| Field | Value |
|---|---|
| **TC ID** | AP2501_002 |
| **Title** | A Permaplate contract sold with a different term raises an invoice naming that term, not the first one |
| **Requirement** | AP2501 — REQ-001 AC 1–2; Q-002 Accepted (term text = the term's label on the Permaplate Quote page) |
| **Route** | `/admin/dealer/1380/permaplate/link` → `/quote/{id}/permaplate` → **Generate Contract** → `/invoice/{invoiceId}` → `/admin/dealer/1380/permaplate` (Unlink) |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) |
| **Result** | PASS — invoice 956 (contract PNA-0000000028) Description line 5 reads "5 ans", no "10 ans"; "5 ans" link to dealer 1380 removed, restore confirmed — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md`. Previous: BLOCKED 2026-11-02 |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Step 1 now links a second term (`TERM_B`) to dealer 1380 itself; step 4 unlinks it and confirms the original link list is back; step 5 also checks the restore. Contract uses Financing company "AutoCapital Canada". Status BLOCKED → Not Run | The 2026-11-02 BLOCKED reason was test data, not a product fact; dealer 1380's Permaplate link is Configuration data the case may change if it restores it (test plan §8.1); Financing company required on Dev since 2026-11-08 | Orchestrator decision, batch qa-agent 2026-11-15 |

**Why this matters:** A single contract cannot tell the difference between "the invoice
shows the term sold" and "the invoice always shows the same text". This case sells a second,
different term, which catches a hard-coded label, a value cached from the previous contract,
or the term of the wrong product being looked up. A dealer billed for a 10-year term on an
invoice that says 5 years, or the reverse, would dispute the charge. Dealer 1380 offers only
"10 ans" on Dev, so the case links a second term for its own use and removes it again:
other tickets use the same dealer, and a term left linked would change what their Permaplate
Quote pages offer. The term line is compared **as a whole line**, because "5 ans" also occurs
inside the option name "Extra care (5 ans couverture )" and "3 ans" inside "3 Ans (Drive IP)".

**Test Data:**

| Variable | Value |
|---|---|
| Logins | Admin Portal and Dealer Portal account from the *Dev Environment* section of the `env` source |
| `LINKS_BEFORE` | The rows on `/admin/dealer/1380/permaplate` before the case changes anything (expected on Dev: one row, 3 "10 ans" 120) — recorded in step 1 |
| `TERM_B` | Term 2 **"5 ans"** (60 months) from the Admin catalogue; if "5 ans" is not offered in the "Link a product" select, term 1 **"3 ans"** (36 months). Never 5 "3 Ans (Drive IP)", 6 "2 ans (eligibility)" or the disabled 4 — they carry their own eligibility rules |
| `TERM_A` | "10 ans" — the term of invoice 941 (AP2501_001) |
| Client, created by this case | First name `Terme`, last name `Second{MMDD}` (today's month and day), email `terme.second.{MMDD}@yopmail.com`, address `330 Rue Sherbrooke`, city `Montreal`, province `Québec`, postal code `H3A 1B9`, home phone `5145550300`, work phone `5145550301`, policy-agreement checkbox ticked |
| Vehicle | Inventory vehicle with VIN `1FAHP35NX8W239204` (vehicle 915) |
| Option | The first enabled option checkbox offered under `TERM_B` for vehicle 915 |
| Financing company | `AutoCapital Canada` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin Portal at `/admin/login` with the `env` account and open `/admin/dealer/1380/permaplate` (dealer details → tab "Esthetic protection"). Record every row as `LINKS_BEFORE`. If "5 ans" or "3 ans" is **already** linked, link nothing: use it as `TERM_B` and record `LINKED_BY_CASE = no`. Otherwise click **"Link a product"** (`/admin/dealer/1380/permaplate/link`), choose "5 ans" in the product select (else "3 ans") → **"Save"**, and record `LINKED_BY_CASE = yes` with the product ID | The alert "Permaplate product linked" appears and the table lists every `LINKS_BEFORE` row plus one row for `TERM_B`. If neither "5 ans" nor "3 ans" can be linked, record the case BLOCKED ("test data not on Dev: no second enabled Permaplate term can be linked to dealer 1380"); nothing was changed, so skip step 4 |
| 2 | [Pre-Condition] Sign in to the Dealer Portal at `/login`. Open `/vehicle/915/details` → "Create quote" (`/quote/new/client?fromVehicleId=915`), enter the client from Test Data → **Save**; at `/quote/{id}/vehicle` select VIN `1FAHP35NX8W239204`, keep the delivery date at today, price `20000` → **Save**. Open `/quote/{id}/permaplate`, record every term radio label, click the label of `TERM_B` and of its first enabled option → **Save** | The quote is created with the client and vehicle; the term radios now include "10 ans" and `TERM_B`; "Esthetic protection quote saved successfully" appears. The quote ID and the radio labels are recorded. If `TERM_B` is not offered as a radio for this quote (for example an age or eligibility rule on the term), or offers no enabled option for vehicle 915, record the case BLOCKED ("test data not on Dev: `TERM_B` not sellable for vehicle 915 — <what the page shows>") and go straight to step 4 |
| 3 | On the quote details page open the **Esthetic protection** row "⋯" → **"Generate Contract"**, check that "Program Term" reads `TERM_B`, choose Financing company **"AutoCapital Canada"** → **"Generate Contract"**. Then open `/invoice/{invoiceId}` for the new invoice and read the **Description** cell line by line | "Esthetic protection contract generated successfully" and "Invoice #… ($…) is created" appear with no error page; the contract form's "Program Term" read `TERM_B` before submitting. The contract number (`PNA-…`), the invoice ID (`INVOICE_B`) and every Description line are recorded verbatim, in order |
| 4 | **Restore — run this step whenever `LINKED_BY_CASE = yes`, even if step 2 or 3 failed or was blocked.** In the Admin Portal open `/admin/dealer/1380/permaplate`, click **"Unlink"** on the `TERM_B` row → in the modal "Unlink a permaplate product" click **"Continue"** | The alert "Permaplate product unlinked" appears and the table lists exactly the `LINKS_BEFORE` rows — no `TERM_B` row. **If the table does not match `LINKS_BEFORE`, the restore is unconfirmed:** record what the table shows, run no further test case, and report it in the execution log and the run summary |
| 5 | [Verification] Compare the Description recorded in step 3 with `TERM_B` and `TERM_A`, and the table recorded in step 4 with `LINKS_BEFORE` | **Pass when:** the Description has a line reading exactly `TERM_B` (Q-002 Accepted: the term's label as shown on the Permaplate Quote page), has no line reading `TERM_A`, and its contract-number line equals the contract created in step 3; and the restore in step 4 is confirmed (or nothing was linked by the case). **Objective faults (FAIL):** the term line reads `TERM_A`, another term, or is missing. **Record for Q-001 / Q-008:** the line order (the position is judged in AP2501_006). An unconfirmed restore is not a product fault: it stops the run (step 4) and is reported, whatever this step's result |

---

### AP2501_003 — The Admin invoice PDF of a new Permaplate invoice names the term sold in its description

| Field | Value |
|---|---|
| **TC ID** | AP2501_003 |
| **Title** | The Admin invoice PDF of a new Permaplate invoice names the term sold in its description |
| **Requirement** | AP2501 — REQ-002 AC 1 ("On the invoice generated PDF"); Q-007 Answered by Story AP-2099: "The the navigation header contains a button to download the invoice PDF … A PDF render is created and opens in a new window. The PDF should contain the same data as the print function on the invoice page" |
| **Route** | `/invoice/{invoiceId}` (Dealer) → `/admin/invoice/{invoiceId}` → **"PDF"** → `/admin/invoice/{invoiceId}/pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) |
| **Result** | FAIL — the Admin "PDF" button (`/admin/invoice/941/pdf`, also 956) answers HTTP 500, same fault as AP-2529 — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md`. Previous: FAIL 2026-11-02 (AP-2529) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | The PDF is named outright as the Admin invoice page's "PDF" button; the exploratory listing of every PDF control and the Q-007 BLOCKED branch are removed; step 4 adds that the PDF's description matches the invoice page (AP-2099). Status FAIL → Not Run | Q-007 Answered by AP-2099 in the 2026-11-15 analysis, so the expected result changed | Analysis 2026-11-15 (Q-007, AP-2099); orchestrator re-execution scope |

**Why this matters:** The PDF is the document that leaves the system — the one a dealer
files or forwards to accounting. If the screen names the term and the PDF does not, the paper
record of the sale is incomplete. AP-2099 places the invoice PDF on the Admin invoice page
and says it must carry the same data as the page's print view, so the term line belongs in
it. AP-2529 (this button answers HTTP 500 on Dev) is still open; the button is the step under
test here, so an error from it is a FAIL linked to AP-2529, never BLOCKED.

**Test Data:**

| Variable | Value |
|---|---|
| Logins | Dealer Portal and Admin Portal account from the *Dev Environment* section of the `env` source |
| Invoice | Invoice **941** (contract PNA-0000000020, `TERM_A` "10 ans", Grand Total $91.98), made on Dev by AP2501_001 on 2026-11-02 — use it if `/invoice/941` still opens with that description; otherwise repeat AP2501_001 steps 1–3 first and use the new invoice |
| Not the invoice PDF | The Permaplate contract download `/quote/{quoteId}/permaplate-contract-download` (file `permaplate-{contractId}.pdf`, footer link `#PNA-…`) — it may name the term too, so it never counts as the invoice PDF |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer Portal at `/login` and open `/invoice/{invoiceId}` for the invoice in Test Data. Record the invoice number as `INVOICE_ID`, the **Grand Total** as `GRAND_TOTAL` and every Description line | Heading "Invoice #`INVOICE_ID`"; the Description has a line reading `TERM_A`. `INVOICE_ID`, `GRAND_TOTAL` and the Description lines are recorded |
| 2 | [Pre-Condition] Sign in to the Admin Portal at `/admin/login`, open `/admin/invoice/{invoiceId}` (or the sidebar **"Invoices"**, `/admin/invoices`, and click the `INVOICE_ID` row) | The Admin invoice details page `/admin/invoice/{invoiceId}` loads and its header shows a **"PDF"** button |
| 3 | Click **"PDF"** (opens `/admin/invoice/{invoiceId}/pdf` in a new tab) and read the PDF's description block line by line | The response is HTTP 200 with `application/pdf`; the PDF shows `INVOICE_ID` and `GRAND_TOTAL`; every description line is recorded verbatim, in order. The method, URL and status of the PDF request are recorded |
| 4 | [Verification] Compare the PDF read in step 3 with `TERM_A` and with the Dealer invoice page Description from step 1 | **Pass when:** the PDF shows `INVOICE_ID` and `GRAND_TOTAL`, is served from `/admin/invoice/{invoiceId}/pdf` (not the contract download), has a line reading exactly `TERM_A`, and its contract-number and term lines match the invoice page (AP-2099: same data as the page). **Objective faults (FAIL):** the "PDF" button answers an error page, HTTP 5xx or a non-PDF (today AP-2529); the PDF has no term line; a term other than `TERM_A`; garbled or missing characters in the term |

---

### AP2501_004 — The Dealer Portal invoice list shows each Permaplate invoice's own term name in full

| Field | Value |
|---|---|
| **TC ID** | AP2501_004 |
| **Title** | The Dealer Portal invoice list shows each Permaplate invoice's own term name in full |
| **Requirement** | AP2501 — REQ-003 AC 1 ("On the invoice list page (on dealer portal …)"); Q-005 Accepted (description shown in full, one item per line) |
| **Route** | `/invoice` — Billing → Invoices |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) |
| **Result** | PASS — Dealer list row 956 reads "5 ans", row 941 "10 ans", six lines in full — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md`. Previous: BLOCKED 2026-11-02 |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | `TERM_B` invoice comes from AP2501_002, whose fallback now sets up and removes its own second term; step 3 asserts the accepted layout (full text, one item per line) instead of recording it. Status BLOCKED → Not Run | Orchestrator decision 2026-11-15 (second term set up by the case); Q-005 Accepted in the 2026-11-15 analysis | Orchestrator decision, batch qa-agent 2026-11-15; analysis 2026-11-15 |

**Why this matters:** Dealers find invoices from the list, not by ID. If the term shows only
after opening each invoice, a dealer reconciling a month of Permaplate sales has to open them
one by one. Two invoices with two different terms prove the list reads each invoice's own
term rather than repeating one.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Dealer Portal account from the *Dev Environment* section of the `env` source |
| Invoices | Invoice **941** (`TERM_A` "10 ans", AP2501_001, 2026-11-02) and `INVOICE_B` (`TERM_B`, created by AP2501_002 in this run — ID in the execution log) |
| Fallback | If AP2501_002 produced no invoice in this run, run AP2501_002 steps 1–4 first with its Test Data (it links `TERM_B`, creates the invoice and unlinks `TERM_B` again; continue only once its restore is confirmed). If AP2501_002 is BLOCKED, this case is BLOCKED with the same reason. If invoice 941 no longer opens, repeat AP2501_001 steps 1–3 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Apply the Fallback if needed. Sign in to the Dealer Portal at `/login` and open `/invoice` | Invoice 941 (`TERM_A`) and `INVOICE_B` (`TERM_B`) are known. The Invoices list loads with the columns Invoice ID · Description · Amount · Created at · Status |
| 2 | Find the rows for invoice 941 and `INVOICE_B` and read their Description cells in full | Both rows are found; each Description is recorded verbatim, line by line, including whether any part is cut off |
| 3 | [Verification] Compare each row's Description with the term sold on that invoice | **Pass when:** the 941 row has a line reading exactly `TERM_A` and the `INVOICE_B` row a line reading exactly `TERM_B`, and each Description is shown in full, one item per line, not shortened (Q-005 Accepted — as on 2026-11-02: six lines). **Objective faults (FAIL):** a row shows no term; a row shows the other invoice's term; the term is cut off or hidden. **Accepted (Q-002):** each term reads as its label on the Permaplate Quote page |

---

### AP2501_005 — The Admin-area invoice list shows each Permaplate invoice's own term name in full

| Field | Value |
|---|---|
| **TC ID** | AP2501_005 |
| **Title** | The Admin-area invoice list shows each Permaplate invoice's own term name in full |
| **Requirement** | AP2501 — REQ-003 AC 2 ("On the invoice list page (… and admin area)"); Q-005 Accepted (description shown in full, one item per line) |
| **Route** | `/admin/invoices` — Admin sidebar "Invoices" |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15 — Dev (v2dev) |
| **Result** | PASS — Admin list row 956 reads "5 ans", row 941 "10 ans", six lines in full — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2501_2026-11-15.md`. Previous: BLOCKED 2026-11-02 |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Route fixed to `/admin/invoices` (no sidebar exploration); `TERM_B` invoice from AP2501_002 with the same fallback as AP2501_004; step 4 asserts the accepted layout. Status BLOCKED → Not Run | Admin invoice list mapped 2026-11-02 (`billing-invoices.md`); orchestrator decision 2026-11-15; Q-005 Accepted | Orchestrator decision, batch qa-agent 2026-11-15; analysis 2026-11-15 |

**Why this matters:** The Admin area is where Avantage Plus staff reconcile dealer billing
across every dealership, and the ticket names it explicitly. Two invoices with two different
terms prove the Admin list reads each invoice's own term.

**Test Data:**

| Variable | Value |
|---|---|
| Login | Admin Portal account from the *Dev Environment* section of the `env` source |
| Invoices | Invoice **941** (`TERM_A` "10 ans") and `INVOICE_B` (`TERM_B`, from AP2501_002 in this run), dealer "Test QA staging" (Dealer 1380) |
| Fallback | Same as AP2501_004: if AP2501_002 produced no invoice in this run, run its steps 1–4 first (link, create, unlink — restore confirmed before going on); if AP2501_002 is BLOCKED, this case is BLOCKED with the same reason |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Apply the Fallback if needed. Sign in to the Admin Portal at `/admin/login` | Invoice 941 and `INVOICE_B` with their terms are known. The Admin dashboard `/admin` loads |
| 2 | Open the sidebar **"Invoices"** | `/admin/invoices` loads with heading "Invoices" and the columns Invoice ID · Description · Amount · Created at · Status |
| 3 | Find the rows for invoice 941 and `INVOICE_B` (newest first; page on if needed) and read their Description cells in full | Both rows are found; each Description is recorded verbatim, line by line, including whether any part is cut off |
| 4 | [Verification] Compare each row's Description with the term sold on that invoice | **Pass when:** the 941 row has a line reading exactly `TERM_A` and the `INVOICE_B` row a line reading exactly `TERM_B`, and each Description is shown in full, one item per line, not shortened (Q-005 Accepted — six lines on 2026-11-02). **Objective faults (FAIL):** a row shows no term; a row shows the other invoice's term; the term is cut off or hidden |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC 1–2 — term on the invoice details page | AP2501_001 | — | AP2501_002 | AP2501_001 (contract number, no retail price) |
| REQ-002 AC 1 — term on the invoice PDF | AP2501_003 | — | — | — |
| REQ-003 AC 1 — term on the Dealer invoice list | AP2501_004 | — | — | — |
| REQ-003 AC 2 — term on the Admin invoice list | AP2501_005 | — | — | — |
| REQ-004 — term follows the contract number | AP2501_006 (next file, BLOCKED on Q-001) | — | — | — |

No negative case: the ticket adds text to a generated description and has no input a user
could get wrong.

# Test Cases — AP2428 (File 2 of 4)

**Project:** Avantage Plus v2 — AP-2428 Dealer Permaplate Contract
**Requirement:** AP2428 — Program summary, pricing, Generate Contract and the PDF (REQ-004 to REQ-007)
**Source:** `requirements/AP-2428-dealer-permaplate-contract.md` · `qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2428_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revisions:** 2026-11-02 — s4 worker: the clear-text login and password in the Execution Context **Login** row were replaced with a reference to the `env` source (credential policy). No step or expected result changed.
**TC Range:** AP2428_006 to AP2428_010 (5 test cases)
**Coverage:** Functional · UI · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quote/{id}/details` of "AP2428 quote A" (created in AP2428_001) → the create-contract control → contract form (seen at `/quote/{id}/permaplate-create-contract` on 2026-09-06). Contract PDF download was seen at `/quote/{quoteId}/permaplate-contract-download`, served `application/pdf` | `navigation` (quote hub); `permaplate-create-contract` and `permaplate-contract-download`: `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` (not in `navigation` / `domain`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal `/login`, the shared QA account from the `env` source (login and password are read from there at run time and never copied into this file) (Dealer ID 1380, province QC) | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km. Dealer 1380 must have a Permaplate product linked (checked in AP2428_001 step 1) | `test-data` |
| **Language** | EN | `domain` |
| **Leaves behind** | AP2428_009 generates one Permaplate contract on "AP2428 quote A"; creating a Permaplate contract also raises an invoice automatically (AP-2446). Both stay on staging | `cleanup` (missing — recorded here) |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Which amount is taxed, the rate per province, and which province drives the taxes | AP2428_008 | Open — Q-002 (Blocking), asked on AP-2428 2026-11-01 (comment 19434) |
| 2 | Whether Retail price, Subtotal, Taxes and Grand Total should still be shown, given AP-2456 removes retail pricing and taxes | AP2428_008 | Open — Q-003 (Blocking), asked on AP-2428 2026-11-01 (comment 19434) |

> AP2428_008 ships **BLOCKED**. The other four are `Not Run`. Run AP2428_006 and
> AP2428_007 **before** AP2428_009, which generates the contract and may close the form.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2428_006 | The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text | Functional | Medium | PASS |
| AP2428_007 | The contract form shows a Cost Price for the selected Permaplate options | Functional | High | FAIL |
| AP2428_008 | The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies | Functional | High | BLOCKED |
| AP2428_009 | Submitting Generate Contract returns the dealer to the quote details page with a PDF download button | Functional | High | PASS |
| AP2428_010 | The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form | Functional | High | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2428_006 — The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text

| Field | Value |
|---|---|
| **TC ID** | AP2428_006 |
| **Title** | The program summary shows term, start date equal to delivery date, end date and every selected option as read-only text |
| **Requirement** | AP2428 — REQ-004, AC 1–4 (End date value record-only for Q-008; table columns record-only for Q-009) |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — read-only term/start/end; options shown as a list, not a table (Q-009) |

**Why this matters:** The summary is what the dealer confirms before signing. The ticket
says the start date is the delivery date, so that is asserted; how the end date is
calculated and which table columns appear are not stated, so they are recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, if it still has no contract; otherwise create one exactly as AP2428_001 steps 2–3 with the same Test Data values |
| Delivery date | `2026-11-01` |
| Selected options | The option names recorded in AP2428_001 step 3 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open "AP2428 quote A" at `/quote/{id}/details` and record the Permaplate option names it shows; click the create-contract control | The contract form opens with its Program Summary section |
| 2 | Read Program Term, Start Date and End date — record each value and whether it is an input or plain text | Values and element types recorded |
| 3 | Read the Selected protection products table — record its column headings and every row | Columns and rows recorded |
| 4 | [Verification] Verify Program Term, Start Date and End date are plain text with no input; Start Date = 2026-11-01; End date is a date; the table lists every option name from step 1 | All three are read-only text, Start Date equals the delivery date, End date holds a date, and no selected option is missing from the table. Record the End date and the column headings for Q-008 / Q-009 |

---

### AP2428_007 — The contract form shows a Cost Price for the selected Permaplate options

| Field | Value |
|---|---|
| **TC ID** | AP2428_007 |
| **Title** | The contract form shows a Cost Price for the selected Permaplate options |
| **Requirement** | AP2428 — REQ-005, AC 1 ("Cost Price") |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | FAIL — no "Cost Price" label; only "Total 225.00$" |

**Why this matters:** The cost price is the dealer's own price and is not touched by the
open tax and retail questions, so it can be checked now. The ticket does not state how the
cost is built, so the case compares it with the quote's Cost and records the result rather
than failing on a guessed formula.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, if it still has no contract; otherwise create one exactly as AP2428_001 steps 2–3 |
| Quote Permaplate Cost | The Cost recorded in AP2428_001 step 3 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open "AP2428 quote A" at `/quote/{id}/details`, record the Cost shown in its Permaplate section and click the create-contract control | The contract form opens; the quote Cost is recorded |
| 2 | Find the "Cost Price" label in the Program Summary and record the amount next to it | The amount is recorded |
| 3 | [Verification] Verify a "Cost Price" label with a money amount is shown, and record whether it equals the quote's Cost from step 1 | A Cost Price with an amount is visible. A missing label, an empty amount, or an error page is a FAIL. The comparison with the quote Cost is recorded, not judged |

---

### AP2428_008 — The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies

| Field | Value |
|---|---|
| **TC ID** | AP2428_008 |
| **Title** | The contract form shows retail price, subtotal, taxes for the client's province and grand total as the ticket specifies |
| **Requirement** | AP2428 — REQ-005, AC 2 ("Retails Price — Subtotal — Taxes (calculated based on the client's province) — Grand Total") |
| **Route** | `/quote/{id}/details` → Create contract |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 (Blocking — unanswered): taxed amount, rate per province and province source not stated · Q-003 (Blocking — unanswered): AP-2456 removes retail pricing and taxes |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | BLOCKED — Q-002/Q-003 unanswered; no retail, subtotal, tax or grand total shown (recorded only) |

**Why this matters:** These are the money figures the client is charged. Without the tax
rule, a correct tax amount cannot be told from a wrong one; and AP-2456 may mean these
lines should not appear at all. The steps are ready to run once both are answered.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, if it still has no contract; otherwise create one exactly as AP2428_001 steps 2–3 |
| Client province | `Québec` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open "AP2428 quote A" and click the create-contract control | The contract form opens |
| 2 | Record every label and amount in the Program Summary pricing area: Retail price, Subtotal, Taxes, Grand Total, and any other | Labels and amounts recorded |
| 3 | Change Province on the form to `Ontario` (do not submit) and record whether the Taxes amount changes; set it back to `Québec` | Behaviour recorded; Province back to Québec |
| 4 | [Verification] Verify Retail price, Subtotal, Taxes and Grand Total are shown (or absent) and computed as Q-002 / Q-003 answers specify | Not known — Q-002, Q-003. Until answered, record the values from steps 2–3 |

---

### AP2428_009 — Submitting Generate Contract returns the dealer to the quote details page with a PDF download button

| Field | Value |
|---|---|
| **TC ID** | AP2428_009 |
| **Title** | Submitting Generate Contract returns the dealer to the quote details page with a PDF download button |
| **Requirement** | AP2428 — REQ-006, AC 1 and AC 2 |
| **Route** | `/quote/{id}/details` → Create contract → Generate Contract |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — contract PNA-0000000017 generated, back on quote details with a PDF link |

**Why this matters:** This is the action that creates the contract. The QA account reported
on 2026-08-18 that submitting Generate Contract showed an error, and nobody replied. A
FAIL here blocks AP2428_010, AP2428_012 to AP2428_014.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" from AP2428_001, after AP2428_003 to AP2428_007 have run; if it already has a contract, create a new quote exactly as AP2428_001 steps 2–3 |
| Form values | Leave every prefilled value as it is; if the form has any other select left at "Choose", leave it and record its label |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open "AP2428 quote A" at `/quote/{id}/details` and click the create-contract control | The contract form opens with every section filled as in AP2428_003 and AP2428_005 |
| 2 | Click **Generate Contract** | The page responds without an error page or HTTP 5xx; any success message is recorded word for word |
| 3 | Record the URL and heading of the page the browser lands on, and the Permaplate section of that page | URL, heading and section contents recorded |
| 4 | [Verification] Verify the browser is on `/quote/{id}/details` for "AP2428 quote A" and a download button for the contract PDF is visible | The quote details page of the same quote is shown, with a PDF download button. An error, a different page, or no download button is a FAIL |

---

### AP2428_010 — The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form

| Field | Value |
|---|---|
| **TC ID** | AP2428_010 |
| **Title** | The downloaded contract PDF opens and never shows a vehicle or owner different from the contract form |
| **Requirement** | AP2428 — REQ-007, AC 1 (fields shown, layout and language record-only for Q-010) |
| **Revisions** | 2026-11-01 — rework for reviewer R2 round 1 F-1 (check 2.5; review findings Pass 1 gap 1), not a Gate B promotion: step 4 no longer requires specific fields on the PDF; it fails only on an objective fault |
| **Route** | `/quote/{id}/details` → download button |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | FAIL — PDF download returns HTTP 500 error page (2/2; older contracts too) |

**Why this matters:** The PDF is what the client signs. The ticket attaches example PDFs
but does not list their fields in text, so the case fails only when the PDF cannot be
opened, is blank, or shows a vehicle or owner different from the form, and records which
fields it carries (Q-010).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2428 quote A" with the contract generated in AP2428_009 |
| VIN | `1FAHP35NX8W239204` |
| Owner | `Perma Contrat2428`, `123 rue Principale`, `Montréal` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open "AP2428 quote A" at `/quote/{id}/details` | The page shows the contract PDF download button from AP2428_009 |
| 2 | Click the download button and record the URL, HTTP status and content type of the response | A PDF is returned (HTTP 200, `application/pdf`) without an error page |
| 3 | Open the PDF and record its page count, its language, the contract number if any, and every vehicle, owner and program value it shows | Contents recorded |
| 4 | [Verification] Verify the PDF opened with content, and that any VIN, owner name or address it shows equals the form's values (VIN `1FAHP35NX8W239204`, owner `Perma Contrat2428`, `123 rue Principale, Montréal`) | No download error, no blank PDF, and no VIN, owner name or address that differs from the form. Which fields appear, the layout and the language are recorded for Q-010, not judged |

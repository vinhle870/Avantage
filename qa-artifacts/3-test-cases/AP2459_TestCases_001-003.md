# Test Cases — AP2459 (File 1 of 1)

**Project:** Avantage Plus v2 — AP-2459 bug re-test
**Requirement:** AP2459 — Permaplate ("Esthetic protection") contract generation returns HTTP 500 when "Financing company" is left on "Choose"
**Source:** `requirements/AP-2459-permaplate-contract-generation-returns-http-500.md` (bug re-test flow — no requirements analysis or test plan; s1 and s2 are skipped for a bug)
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2459_001 to AP2459_003 (3 test cases)
**Coverage:** Re-test (Functional) · Regression · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer for every case; Admin only for the Permaplate product-link check in step 1 of AP2459_001 and AP2459_002 | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** (lands on `/quote/new/client?fromVehicleId=915`; open that URL directly if the button is not visible). **Do not use the bare `/quote/new/client` from the ticket's step 4** — since 2026-10-03 a quote created there returns HTTP 500 on its details page, which would block the case before the step under test. Quote hub `/quote/{id}/details`; vehicle stage `/quote/{id}/vehicle`; Permaplate stage `/quote/{id}/permaplate`; contract form `/quote/{id}/permaplate-create-contract`; dealer contract list `/permaplate-contracts` (sidebar Contracts → "Esthetic protection"); invoices `/invoice`; contract PDF `/quote/{quoteId}/permaplate-contract-download`. Admin product link: `/admin/dealer/1380/permaplate` and `/admin/dealer/1380/permaplate/link` | `navigation` + `domain` (`quote-creation.md`, newest note 2026-10-12); the contract-form route and the `/admin/dealer/1380/permaplate…` routes come from the ticket's own steps to reproduce (not yet in `domain`) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal `/login` and Admin portal `/admin/login`, both with the shared account of dealer 1380 recorded in the `env` source (`execute.env.md` → Accounts). No credential is copied into this file. Both sessions can be open at once in one browser | `env`, `navigation` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204` (static, first option of the vehicle select). Dealer 1380's Permaplate product link — **Configuration**: it had been found unlinked on 2026-09-13, current state not known; AP-2428 uses the same link | `test-data`, `domain`, AP-2446 execution log 2026-09-13 |
| **Language** | EN. The program is labelled "Esthetic protection" in the English UI; routes still say `permaplate`. The success alert read "Permaplate contract generated successfully" on 2026-09-06 and "Esthetic protection contract generated successfully" on 2026-09-13 — record the exact wording seen | `domain` |
| **Leaves behind** | Per run: up to three clients, quotes and Esthetic protection contracts ("Perma Retest2459", "Perma Finance2459", and "Perma Pdf2459" only if AP2459_003 cannot reuse AP2459_001's quote), and one unpaid invoice per contract. The product link "10 ans" on dealer 1380 only if step 1 had to create it — see the note below | `cleanup` (missing — recorded here) |

**Standing facts only.** Every client, quote and contract these cases need is created in a
`[Pre-Condition]` step with its values written in the case.

**Product-link note (Configuration).** Step 1 of AP2459_001 (and of AP2459_002 when run on
its own) records whether "10 ans" is already linked to dealer 1380 and links it only if
it is not. If this run linked it, unlink it at `/admin/dealer/1380/permaplate` after the
last AP-2459 case has run, so the dealer is left as found. **Never unlink a product this
run did not link** — the same link is used by AP-2428's cases. This is the one deliberate
exception to "restore in the same case": all three cases depend on the link.

**Judgement items (record-only).** The ticket accepts two outcomes for a blank financing
company — the contract is created, *or* the form refuses it with a message beside the
field — and does not say which is intended. AP2459_001 passes on either and records which
one the build chose. What the contract PDF shows in its "SOCIÉTÉ DE FINANCEMENT (si
applicable)" block when no company was chosen is not stated anywhere, so AP2459_003 only
records it.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2459_001 | Generating an Esthetic protection contract with no financing company chosen no longer shows a server error page | Functional (re-test) | High | Not Run |
| AP2459_002 | Generating an Esthetic protection contract with a financing company chosen still succeeds and lists the contract | Regression | High | Not Run |
| AP2459_003 | The PDF of a contract created with no financing company downloads without a server error | Edge-case (regression) | Medium | Not Run |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2459_001 — Generating an Esthetic protection contract with no financing company chosen no longer shows a server error page

| Field | Value |
|---|---|
| **TC ID** | AP2459_001 |
| **Title** | Generating an Esthetic protection contract with no financing company chosen no longer shows a server error page |
| **Requirement** | AP2459 — Expected Result: "Either the contract is created … or, if a financing company really is mandatory, the form refuses the submission with a message beside the field saying so." Also the ticket's Requirement row: "REQ-004 — AP-2446, a Permaplate invoice is created when the contract is created" |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → `/quote/{id}/permaplate-create-contract` |
| **Type** | Functional (re-test of the reported steps) |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** This is the exact scenario the bug reports — a dealer selling
Esthetic protection for cash leaves "Financing company" blank and, on 2026-09-06, got a
French "technical difficulties" error page with no contract and no invoice. The case
passes on either outcome the ticket accepts and records which one the build chose; it
fails on the reported crash, or on a refusal that does not say which field is wrong.

**Test Data:**

| Variable | Value |
|---|---|
| Permaplate product to link (only if missing) | `10 ans` |
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN; record it |
| First name / Last name | `Perma` / `Retest2459` |
| Address / City / Province / Postal code | `220 Boulevard Saint-Laurent` / `Montreal` / `Québec` / `H2Y 1Z4` |
| Tel. home / Tel. work | `5145550200` / `5145550201` (both are required) |
| Vehicle / Delivered at / Price | VIN `1FAHP35NX8W239204` / `2026-11-01` / `25000` |
| Permaplate product / option | `10 ans` / `Antirouille – Rust+Sound (combo)` — if that option is not offered, tick the first enabled option and record its name |
| Financing company | Left on its default `Choose` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login` with the dealer 1380 account from the `env` source, open `/admin/dealer/1380/permaplate` and record the linked products. If "10 ans" is not listed (or the page says "No entities found"), open `/admin/dealer/1380/permaplate/link`, choose "10 ans" in the select box and click **Save**; record that this run linked it | The eligible-products table for dealer 1380 lists "10 ans", and whether this step linked it is written in the execution log |
| 2 | [Pre-Condition] Sign in to the Dealer portal at `/login`, open `/vehicle/915/details` and click **Create quote** (or open `/quote/new/client?fromVehicleId=915` directly). Fill Email, First name `Perma`, Last name `Retest2459`, Address, City, Province "Québec", Postal code, Tel. home and Tel. work from the Test Data, tick the policy-agreement checkbox and click **Save** | The browser lands on `/quote/{id}/details` with the heading "#{id} - Perma Retest2459"; the quote id is recorded as "AP-2459 quote A" |
| 3 | [Pre-Condition] At `/quote/{id}/vehicle` select VIN `1FAHP35NX8W239204`, set Delivered at `2026-11-01` and Price `25000`, click **Save**; then at `/quote/{id}/permaplate` select the product radio "10 ans", tick "Antirouille – Rust+Sound (combo)" and click **Save** | Both saves complete without an error page, and `/quote/{id}/details` shows an Esthetic protection (Permaplate) section naming the option and a Cost; the option name and Cost are recorded |
| 4 | On `/quote/{id}/details` click **Create Contract** (if the button is not visible, open `/quote/{id}/permaplate-create-contract` directly and record that the button was missing). Leave "Financing company" on "Choose", change nothing else, and click **Generate Contract** | No HTTP 500 and no error screen reading "Erreur — Désolé, l'application éprouve des difficultés techniques…". The page shows **either** (a) a success alert that the contract was generated, **or** (b) the same form again with a message beside "Financing company". The branch, the exact alert or message text and the resulting URL are recorded — which branch is correct is record-only |
| 5 | [Verification] Branch (a): open `/permaplate-contracts` and find the row with client "Perma Retest2459" and VIN `1FAHP35NX8W239204`; open `/invoice` and find the newest invoice whose description names "Perma Retest2459". Branch (b): confirm the message sits beside the "Financing company" field and that `/permaplate-contracts` has no row for "Perma Retest2459" | (a) The contract row is listed and a new invoice naming "Perma Retest2459" exists (its number and contract number are recorded). (b) The field message is visible next to "Financing company" and no contract was created. **FAIL** on: an HTTP 500 or error screen at step 4; a success alert with no contract row or no invoice; a refusal with no message beside the field |

---

### AP2459_002 — Generating an Esthetic protection contract with a financing company chosen still succeeds and lists the contract

| Field | Value |
|---|---|
| **TC ID** | AP2459_002 |
| **Title** | Generating an Esthetic protection contract with a financing company chosen still succeeds and lists the contract |
| **Requirement** | AP2459 — Actual Result: "Selecting any financing company — 'AutoCapital Canada' was used — and submitting the identical form immediately succeeds with HTTP 200 and the message 'Permaplate contract generated successfully'"; REQ-004 of AP-2446 as cited by the ticket |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → `/quote/{id}/permaplate-create-contract` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The fix touches how the "Financing company" value is read. This case
makes sure the path that always worked — a dealer who does pick a financing company — was
not broken by it. A fresh quote is used so the result cannot be confused with AP2459_001's
contract.

**Test Data:**

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN (not the one used by AP2459_001); record it |
| First name / Last name | `Perma` / `Finance2459` |
| Address / City / Province / Postal code | `220 Boulevard Saint-Laurent` / `Montreal` / `Québec` / `H2Y 1Z4` |
| Tel. home / Tel. work | `5145550200` / `5145550201` |
| Vehicle / Delivered at / Price | VIN `1FAHP35NX8W239204` / `2026-11-01` / `25000` |
| Permaplate product / option | `10 ans` / `Antirouille – Rust+Sound (combo)` (or the first enabled option; record it) |
| Financing company | `AutoCapital Canada` — if it is not in the list, choose the first company after "Choose" and record its name |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] If AP2459_001 step 1 already ran in this session, skip this step. Otherwise sign in to the Admin portal with the dealer 1380 account from the `env` source, open `/admin/dealer/1380/permaplate`, and if "10 ans" is not listed, link it at `/admin/dealer/1380/permaplate/link` (choose "10 ans" → **Save**) and record that this run linked it | Dealer 1380's eligible-products table lists "10 ans"; whether this run linked it is recorded |
| 2 | [Pre-Condition] In the Dealer portal open `/vehicle/915/details` → **Create quote** (or `/quote/new/client?fromVehicleId=915`), fill the client form with First name `Perma`, Last name `Finance2459` and the other Test Data values, tick the policy-agreement checkbox, click **Save** | `/quote/{id}/details` loads with the heading "#{id} - Perma Finance2459"; the quote id is recorded as "AP-2459 quote B" |
| 3 | [Pre-Condition] At `/quote/{id}/vehicle` select VIN `1FAHP35NX8W239204`, Delivered at `2026-11-01`, Price `25000` → **Save**; at `/quote/{id}/permaplate` select "10 ans", tick "Antirouille – Rust+Sound (combo)" → **Save** | Both saves complete without an error page; the quote details page shows the Esthetic protection section with the option and a Cost |
| 4 | On `/quote/{id}/details` click **Create Contract** (or open `/quote/{id}/permaplate-create-contract` if the button is not visible, and record that). Choose "AutoCapital Canada" in "Financing company", change nothing else, click **Generate Contract** | No error page and no HTTP 500; a success alert says the contract was generated (exact wording recorded — "Permaplate contract generated successfully" or "Esthetic protection contract generated successfully") |
| 5 | [Verification] Open `/permaplate-contracts` and find the row with client "Perma Finance2459" and VIN `1FAHP35NX8W239204`; open `/invoice` and find the newest invoice whose description names "Perma Finance2459" | The contract row is listed and a new invoice naming "Perma Finance2459" exists; its invoice number and contract number are recorded |

---

### AP2459_003 — The PDF of a contract created with no financing company downloads without a server error

| Field | Value |
|---|---|
| **TC ID** | AP2459_003 |
| **Title** | The PDF of a contract created with no financing company downloads without a server error |
| **Requirement** | AP2459 — Suggested Root Cause: "The contract PDF renders a 'SOCIÉTÉ DE FINANCEMENT (si applicable)' block containing the company's name and address … so the crash may be in building that block rather than in saving the contract." Content of that block when empty: record-only |
| **Route** | `/permaplate-contracts` → Download → `/quote/{quoteId}/permaplate-contract-download` |
| **Type** | Edge-case (regression) |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The ticket suspects the crash came from the PDF's financing-company
block. If the fix only made saving tolerant of a blank company, the dealer may get the
contract saved but still hit a server error when printing it for the client. Only an
objective fault fails this case; what the empty block shows is recorded for the team.

**Test Data:**

| Variable | Value |
|---|---|
| Contract to use | The contract of "AP-2459 quote A" (client "Perma Retest2459") if AP2459_001 ended in branch (a) |
| Fallback client (only if that contract does not exist) | First name / Last name `Perma` / `Pdf2459`, Email `client.stage.NNN@yopmail.com` (next unused NNN), Address `220 Boulevard Saint-Laurent`, City `Montreal`, Province `Québec`, Postal code `H2Y 1Z4`, Tel. home `5145550200`, Tel. work `5145550201` |
| Fallback quote values | VIN `1FAHP35NX8W239204`, Delivered at `2026-11-01`, Price `25000`, product `10 ans`, option `Antirouille – Rust+Sound (combo)`, Financing company left on `Choose` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Use "AP-2459 quote A" if AP2459_001 created its contract. Otherwise (dealer 1380 must have "10 ans" linked — AP2459_001 step 1): in the Dealer portal open `/vehicle/915/details` → **Create quote**, fill the fallback client values → **Save**; at `/quote/{id}/vehicle` set VIN `1FAHP35NX8W239204`, `2026-11-01`, `25000` → **Save**; at `/quote/{id}/permaplate` select "10 ans" + "Antirouille – Rust+Sound (combo)" → **Save** | A quote with an Esthetic protection selection exists; its id and client name are recorded |
| 2 | [Pre-Condition] Only for the fallback quote: open `/quote/{id}/permaplate-create-contract` (or click **Create Contract** on the quote details), leave "Financing company" on "Choose", click **Generate Contract**. If the build refuses the submission with a field message (branch (b) of AP2459_001), mark this case **SKIPPED** — no contract without a financing company can exist | A contract with no financing company exists for the quote, or the case is SKIPPED with that reason |
| 3 | Open `/permaplate-contracts`, find the row whose client is the one recorded in step 1 and whose VIN is `1FAHP35NX8W239204`, and click its **Download** (PDF) action. If the link is not visible, open `/quote/{quoteId}/permaplate-contract-download` directly | A new tab opens on `/quote/{quoteId}/permaplate-contract-download` |
| 4 | [Verification] Check the response and the document: HTTP status, content type, file name, and the "SOCIÉTÉ DE FINANCEMENT (si applicable)" block | HTTP 200 with a PDF (`application/pdf`, file name `permaplate-{contractId}.pdf`) showing the client "Perma Retest2459" (or "Perma Pdf2459") and VIN `1FAHP35NX8W239204` — not an HTTP 500 or the "Erreur — Désolé…" error page. What the financing-company block shows (empty, omitted, or other text) is recorded only |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / statement in the ticket | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Expected Result — blank "Financing company" either creates the contract or is refused with a message beside the field (no HTTP 500) | AP2459_001 | — | — | — |
| Requirement row — REQ-004 of AP-2446: an invoice is created when the contract is created | AP2459_001 (branch a) | — | — | AP2459_002 |
| Actual Result — choosing a financing company succeeds with a success message | — | — | — | AP2459_002 |
| Suggested Root Cause — the PDF's "SOCIÉTÉ DE FINANCEMENT (si applicable)" block with no company | — | — | AP2459_003 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2459_001 | _(pending)_ | — |
| AP2459_002 | _(pending)_ | — |
| AP2459_003 | _(pending)_ | — |

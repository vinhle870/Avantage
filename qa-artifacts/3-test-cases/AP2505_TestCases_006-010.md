# Test Cases — AP2505 (File 2 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2505 — Generate contract for a quote's Roadside protection product
**Source:** requirements/AP-2505-generate-contract-for-a-quotes-roadside.md · qa-artifacts/1-requirements-analysis/AP-2505_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2505_test-plan.md
**Date:** 2026-11-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2505_006 to AP2505_010 (5 test cases)
**Coverage:** Functional · Regression · Negative · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Environment** | **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, dealer login page `/login` (registry `execution_env: Dev`) | `env` (Dev Environment section) |
| **Login** | The shared dealer account (dealer 1380, "Test QA staging") in the `env` source's Dev section. Read the login and password there at run time; type them only into the login form; never write them into the log | `env` |
| **Entry route** | New inventory vehicle `/vehicle/{vehicleId}/details` → **Create quote** header action (the `fromVehicleId` entry) → client form → `/quote/{id}/details`. Never the bare `/quote` entry (HTTP 500 without a vehicle). The page under test is `/quote/{id}/road-side-protection-create-contract` | `navigation` → `domain` (quote-creation.md) |
| **Where the action is** | `/quote/{id}/details` → "Summary of products" → **Roadside Protection** row → **⋯** dropdown: **Edit** · **Generate Contract** · **Delete**. A product with a contract has no "⋯" — the row shows the contract number instead (as for the other products) | `domain` (quote-creation.md, Dev 2026-11-02) |
| **Roadside contract records** | Contract details page `/quote/{quoteId}/auto-shield-contract/{contractId}` (Contract ID, App Number, Status Code, dates, term, tier, product, client and vehicle sub-fields, en/fr PDF links via `/auto-shield-contract-pdf?pdfLink=…`). Dealer contract list `/road-side-protection-contracts` (columns Autoshield contract ID, VIN, Client, Phone, Price, Actions). Recorded on staging; not yet seen on Dev — record any difference | `domain` (quote-creation.md) |
| **Invoices** | Dealer invoice list `/invoice` (Billing → Invoices) | `navigation` |
| **Viewport** | 1280 × 800 | registry `admin_viewport` |
| **Language** | EN for every judgement (`?_locale=en`); switch back to the starting language when the run ends | `domain` |
| **Known bugs** | **AP-2518** (High, open) — on Dev the page under test returned HTTP 500 and the ⋯ dialog stayed on "Loading...". **AP-2508** (High, open) — roadside product form lacks contract fields/button. AP-2518 split (same in both files and the test plan): opening the page is the **step under test** in AP2505_001 step 3 and AP2505_002 step 4 (file 1) and in **AP2505_010 step 3** here — a 500 there is a **FAIL** (Gate C compares it with AP-2518). In **AP2505_006 step 3** it is a FAIL only when the 500 is specific to the missing financing, otherwise BLOCKED — AP-2518 (rule in that case). In **AP2505_007 – AP2505_009 step 2** (and AP2505_003 – _005 step 2 in file 1) opening the page is **setup**: a 500 makes the case **BLOCKED — AP-2518**. A roadside product that cannot be saved → **BLOCKED — AP-2508** | tracker; `domain` |
| **AutoShield** | Contract creation calls AutoShield, an outside service. A submit refused with a message that names the VIN or AutoShield (e.g. VIN not accepted, duplicate VIN) is an outside-service refusal of test data: record the message and mark the case **BLOCKED — "AutoShield refused test VIN"**. Any other failure at submit (error page, HTTP 5xx, no message, no contract) is a FAIL | analysis Q-010 |
| **Not to be used** | Vehicle 915 (VIN already has AutoShield contracts 2697, 2698); vehicles 1106–1118 and quotes 6514–6526 (AP-2498); quotes 6479–6483 (AP-2494); quotes A and B of AP2505_001/_002; any record of another ticket. Never pick a record by "newest" | `test-data`; `domain` |
| **Leaves behind** | Quote C (AP2505_006, no contract), quote D (AP2505_007 — **one AutoShield roadside contract and possibly an invoice**, reused by _008 and _010), quote E (AP2505_009 — a contract only if the build accepts an empty last name). **Possible second contract:** only if AP2505_007 made none, AP2505_008 builds its own quote (`{NNN}` = `008`, last name `Owner2505-008`) and submits it — **one more AutoShield roadside contract and possibly an invoice**, then reused by AP2505_010. Each quote with its own vehicle, client and roadside product (and a financing, except quote C). Any VIN may carry the +100 change (`…505{NNN+100}`). The `cleanup` source is missing — nothing is removed. Record every vehicle id, VIN, quote id, client email, contract id and invoice number in the execution log | `cleanup` (missing) |

**Shared build values — vehicle (one per quote).** Open `/vehicle/new/edit/PASSENGER?_locale=en`
and enter: VIN `2T1BURHE0NC505{NNN}` (`{NNN}` = the case number given in the case), Brand
`Toyota` (wait for Model to reload), Model `Corolla`, Year `2022`, Vehicle Price `20000`,
Kilometers `15000`, Condition "used", Fuel type "GASOLINE", Transmission "Automatic",
Cylinders `4`, Engine size `1.8`, Engine size unit "Litre", Designation "Particular" →
**Save** → `/vehicle/{vehicleId}/details` with "Vehicle saved"; record the vehicle id. If
the VIN is refused as already used, add 100 to `{NNN}`, record it, and continue.

**Shared build values — client and quote.** On `/vehicle/{vehicleId}/details` click
**Create quote**, then enter: First name `Roadside`, Last name as given in the case, Email
`client.stage.2505{NNN}@yopmail.com`, Address `300 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550501`, Work phone `5145550502`, "I agree
to the policy" ticked → **Save** → `/quote/{id}/details`; record the quote id. Then at
`/quote/{id}/vehicle` keep the attached vehicle, Delivered at = **the run date**
(`RUN_DATE`), Price `20000` → **Save**.

**Shared build values — financing.** `/quote/{id}/financing`: Date of birth `1985-06-15`,
Province "Québec", Type "Financing", Net amount financed `25000`, Residual `0`, Payment
frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company
"AutoCapital Canada" → **Save** → `/quote/{id}/details` with "Financing saved".

**Shared build values — roadside product.** On the quote page click the red "+" on the
**Roadside Protection** row; choose Make `Toyota`, Model `Corolla`, Year `2022` (VIN
pre-filled — leave it) → **Continue**; select the **first** tier radio, Policy Sale price
`250` → **Save**. The Roadside Protection row then shows the product and a "⋯" menu; record
the tier label and amount. No tier offered → record the alert and mark the case BLOCKED
("no AutoShield tier for Toyota Corolla 2022 on Dev"); product cannot be saved → **BLOCKED —
AP-2508**.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| Missing fact | Affects | Question | Status set |
|---|---|---|---|
| None | — | — | — |

> All five cases are `Not Run`. Their results that depend on Judgement questions (Q-006,
> Q-008, Q-009, Q-010) are record-only.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2505_006 | On a quote with no financing, the roadside contract page opens pre-filled with the vehicle and client | Edge-case | Medium | BLOCKED |
| AP2505_007 | Clicking "Generate Contract" with the pre-filled values creates the roadside contract, shown on the quote and the contract list | Functional | High | BLOCKED |
| AP2505_008 | The roadside contract created from the new page has a details page whose PDF opens | Regression | High | BLOCKED |
| AP2505_009 | Submitting the roadside contract page with the owner's last name emptied gives no server error and no unnamed contract | Negative | Medium | BLOCKED |
| AP2505_010 | After its roadside contract exists, the quote cannot make a second contract by reopening the page | Edge-case | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Revisions

| Date | TC ID | Change | Why |
|---|---|---|---|
| — | — | — | First version |
| 2026-11-03 | AP2505_006 | Step 4 and "Why this matters": only a real financing value nobody entered fails; empty-state defaults (0, "- None Selected -", empty) are recorded under Q-006 | Review R2 round 1, F-5 — Q-006 leaves the no-financing display open |
| 2026-11-03 | AP2505_006 | Step 4: the VIN compared is the one recorded in step 1 (including a +100 change), not a hard-coded value | Same issue as review R2 round 1, F-4 |
| 2026-11-03 | AP2505_006 | "Why this matters": AP-2518 rule compares with any financed quote of this run and covers an AP2505_001 that never reached step 3 | Review R2 round 1, F-7 |
| 2026-11-03 | AP2505_007 | Step 5: the VIN checked is the one recorded for quote D in step 1 (including a +100 change), not a hard-coded value | Review R2 round 1, F-4 |
| 2026-11-03 | AP2505_010 | Steps 1 and 5: count rows for the VIN recorded for the quote in use (quote D or AP2505_008's), and step 1 requires at least 1 row (0 → BLOCKED); Route and "Why this matters" aligned | Review R2 round 1, F-4 |
| 2026-11-03 | AP2505_010 | Step 3: opening the page is the step under test — HTTP 500 is a FAIL compared with AP-2518 at Gate C | Review R2 round 1, F-3 — align with the AP-2518 split |
| 2026-11-03 | — (Execution Context) | "Known bugs": AP-2518 split stated per case and step, identical in both files and the test plan | Review R2 round 1, F-3 |
| 2026-11-03 | — (Execution Context) | "Leaves behind": adds AP2505_008's possible second contract (and its quote) and the +100 VIN change | Review R2 round 1, F-6 |

---

## Test Cases

---

### AP2505_006 — On a quote with no financing, the roadside contract page opens pre-filled with the vehicle and client

| Field | Value |
|---|---|
| **TC ID** | AP2505_006 |
| **Title** | On a quote with no financing, the roadside contract page opens pre-filled with the vehicle and client |
| **Requirement** | AP2505 — REQ-003: AC 3 "Given the quote has a vehicle, a client, or a financing, when the page renders, then vehicle client and financing values are pre-filled and financing is read-only". What the financing section shows without a financing is open as Q-006 (Judgement) |
| **Route** | `/quote/{id}/road-side-protection-create-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518 by the case rule: HTTP 500 at step 3 (quote 6570), and the financed quotes 6568/6569 returned the same 500 |

**Why this matters:** AC 3 says "a vehicle, a client, **or** a financing" — a quote may
have no financing, and the page must still render with what the quote does have. What the
financing section shows then is not stated (Q-006), so it is recorded: an empty-state
default (empty field, `0`, `0.00`, "- None Selected -", a placeholder) is not a fault and
is recorded under Q-006; only a real financing value nobody entered (a company name, a
non-zero amount, rate or term) fails step 4. **AP-2518 rule for this case:** compare with
a quote of this run that has a financing (quote A, B, D or a fallback quote). If such a
quote's page also returned HTTP 500, a 500 here is the same known defect → BLOCKED —
AP-2518. If such a quote's page loaded but this quote's page returns HTTP 500, the fault is
specific to the missing financing → FAIL. If no financed quote's page has been opened in
this run yet (e.g. AP2505_001 was BLOCKED before step 3), open the page by its address for
any financed quote this run built, once, and apply the same rule; if this run built no
financed quote with a saved roadside product, the 500 cannot be told apart from AP-2518 →
BLOCKED — AP-2518, noted for Gate C.

**Test Data:**

| Variable | Value |
|---|---|
| `{NNN}` | `006` — VIN `2T1BURHE0NC505006`, email `client.stage.2505006@yopmail.com` |
| Client last name | `Owner2505-006` |
| Quote products | Roadside product only — **no financing, no GAP quote** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Build the vehicle (`{NNN}` = `006`), the client and quote (last name `Owner2505-006`) and the vehicle step with the shared build values | `/quote/{id}/details` shows the quote with no financing; vehicle id, VIN and quote id (quote C) recorded |
| 2 | [Pre-Condition] Add the roadside product with the shared build values — no financing | The Roadside Protection row shows the product with a "⋯" menu. If the roadside modal asks for a financing first, record its text and mark the case BLOCKED ("roadside product needs a financing on Dev") |
| 3 | On the Roadside Protection row open **⋯** → **Generate Contract** (if not offered, record it and type `/quote/{id}/road-side-protection-create-contract` instead) | The page loads as a full page without an error page or HTTP 5xx (see the AP-2518 rule above) |
| 4 | [Verification] Compare the vehicle and owner fields with the values entered: the VIN recorded in step 1 (`2T1BURHE0NC505006`, or `…505106` if the +100 change applied), Toyota, Corolla, 2022, 15000 km; Roadside / `Owner2505-006`, `300 Rue Test`, Montréal, Québec, H2X 1Y4, `client.stage.2505006@yopmail.com`, 5145550501, 5145550502 | Every vehicle and owner field shown holds the entered value (province `Québec`/`QC`, postal code with or without the space, phones in any format, make/model in any case). A field shown empty while its value was entered, or holding a different value, fails the step. No financing value appears that nobody entered: a real financing company name, or a non-zero amount, rate or term, fails the step. Empty-state defaults (empty field, `0`, `0.00`, "- None Selected -", placeholder text) are not faults — record each one under Q-006 |
| 5 | [Verification] Record the financing section | Record, without judging: whether "Financing information" is shown, empty, hidden or replaced by a message; whether its fields are editable or required; whether "Generate Contract" is enabled (Q-006). Leave without submitting |

---

### AP2505_007 — Clicking "Generate Contract" with the pre-filled values creates the roadside contract, shown on the quote and the contract list

| Field | Value |
|---|---|
| **TC ID** | AP2505_007 |
| **Title** | Clicking "Generate Contract" with the pre-filled values creates the roadside contract, shown on the quote and the contract list |
| **Requirement** | AP2505 — REQ-004: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process." Description: "Contract creation, invoice, financing, and PDF behaviour stay unchanged." What the current process shows afterwards is open as Q-009 (Judgement) |
| **Route** | `/quote/{id}/road-side-protection-create-contract` → submit → quote page; `/road-side-protection-contracts`; `/invoice` |
| **Type** | Functional · Regression |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518: contract page HTTP 500 at setup step 2 (quote D 6571); no contract created |

**Why this matters:** Creating the AutoShield contract is what the page is for; a page that
looks right but cannot create the contract fails the story. The values are the ones the
page pre-fills from a quote the case builds itself, so they are valid by construction. The
landing page, message and invoice are recorded, not judged, because "the current process"
has no Dev baseline (Q-009). Only the outcomes `domain` already records for roadside
contracts are judged: a contract id on the quote, a row on the dealer's Road Side
Protection contract list. Opening the page is setup (HTTP 500 → BLOCKED — AP-2518); the
submit is the step under test. This case leaves a real contract — quote D is reused by
AP2505_008 and AP2505_010.

**Test Data:**

| Variable | Value |
|---|---|
| `{NNN}` | `007` — VIN `2T1BURHE0NC505007`, email `client.stage.2505007@yopmail.com` |
| Client last name | `Owner2505-007` |
| Quote products | Financing and roadside product (shared values); no GAP quote |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Build the vehicle (`{NNN}` = `007`), the client and quote (last name `Owner2505-007`), the vehicle step, the financing and the roadside product with the shared build values. Note the number of rows on `/road-side-protection-contracts` and the newest invoice number on `/invoice` | The Roadside Protection row of quote D shows the product with a "⋯" menu; vehicle id, VIN, quote id, tier, contract-list row count and invoice number recorded |
| 2 | [Pre-Condition] Open **⋯** → **Generate Contract** on the Roadside Protection row (or type `/quote/{id}/road-side-protection-create-contract`) | The page loads pre-filled. HTTP 500 or an error page → BLOCKED — AP-2518 |
| 3 | Without changing any value, click **Generate Contract** once and wait for the response (up to 30 s) | No error page and no HTTP 5xx. Record the page the browser lands on and every message shown (Q-009). An AutoShield refusal that names the VIN → BLOCKED as described in the Execution Context |
| 4 | Open `/quote/{id}/details` for quote D, then `/road-side-protection-contracts` | Both pages load |
| 5 | [Verification] Check the contract list, quote D's Roadside Protection row and the invoice list | **`/road-side-protection-contracts`** has one more row than in step 1, with an Autoshield contract id, the VIN recorded for quote D in step 1 (`2T1BURHE0NC505007`, or `…505107` if the +100 change applied) and client `Roadside Owner2505-007` (name order ignored). Record, without judging: the contract id and price shown; what quote D's Roadside Protection row now shows (contract id, PDF link, whether "⋯ → Generate Contract" is still offered — Q-010); and whether a new invoice appeared on `/invoice` with its number, amount and description (Q-009) |

---

### AP2505_008 — The roadside contract created from the new page has a details page whose PDF opens

| Field | Value |
|---|---|
| **TC ID** | AP2505_008 |
| **Title** | The roadside contract created from the new page has a details page whose PDF opens |
| **Requirement** | AP2505 — REQ-004: description "Contract creation, invoice, financing, and PDF behaviour stay unchanged." The existing behaviour recorded in `domain`: contract details page `/quote/{quoteId}/auto-shield-contract/{contractId}` with en/fr PDF links via `/auto-shield-contract-pdf?pdfLink=…` |
| **Route** | `/road-side-protection-contracts` or quote D's Roadside row → `/quote/{quoteId}/auto-shield-contract/{contractId}` → PDF link |
| **Type** | Regression |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518: AP2505_007 made no contract; own quote 6572 hit the same HTTP 500 |

**Why this matters:** The contract PDF is the document the client signs; the story says
its behaviour stays unchanged. The case judges only what `domain` records for roadside
contracts — a details page carrying the contract's data and a PDF link that serves a PDF —
and records the PDF's content. It depends on a contract made through the new page: if
AP2505_007 made none, this case builds its own quote and contract.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The contract created by AP2505_007 on quote D, if it exists. Otherwise build a new quote exactly as AP2505_007 steps 1–3 with `{NNN}` = `008` and last name `Owner2505-008` (one more real contract) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote D's contract, or create one as described in Test Data | A roadside contract made through `/quote/{id}/road-side-protection-create-contract` exists; contract id recorded. If AP2505_007 was BLOCKED or FAILED and the new build hits the same fault, this case is BLOCKED by the same reason |
| 2 | Open the contract's details: from quote D's Roadside Protection row (the contract id link) or from the Actions of its row on `/road-side-protection-contracts` | `/quote/{quoteId}/auto-shield-contract/{contractId}` (or the page the link opens — record it) loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the details page | It shows the contract id from step 1, VIN `2T1BURHE0NC505{NNN}` and the client `Roadside Owner2505-{NNN}` (name order ignored), and at least one PDF link. Record every field shown and the PDF links (en/fr) |
| 4 | Click each PDF link (English first, then French if present) | Each opens in a new tab or downloads |
| 5 | [Verification] Inspect each PDF response | Each link serves a PDF — the browser shows a PDF document (or the response is `application/pdf`), not an error page or HTTP 5xx. Record the page count, the contract id, the VIN and the client name the PDF carries; a VIN or client name in the PDF that differs from the quote's fails the step. Close the PDF tabs |

---

### AP2505_009 — Submitting the roadside contract page with the owner's last name emptied gives no server error and no unnamed contract

| Field | Value |
|---|---|
| **TC ID** | AP2505_009 |
| **Title** | Submitting the roadside contract page with the owner's last name emptied gives no server error and no unnamed contract |
| **Requirement** | AP2505 — REQ-004: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process." What counts as invalid, and how it is shown, is open as Q-008 (Judgement) |
| **Route** | `/quote/{id}/road-side-protection-create-contract` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518: contract page HTTP 500 at setup step 2 (quote E 6573) |

**Why this matters:** AC 4 only covers valid values; the story does not say which fields
are required or how an error is shown (Q-008), so the page's response is recorded. Two
things are objective faults whatever the answer: a server error page, and the other values
the dealer saw being lost when the page comes back. Whether a contract with an empty last
name is created is recorded for Q-008. Opening the page is setup (HTTP 500 → BLOCKED —
AP-2518).

**Test Data:**

| Variable | Value |
|---|---|
| `{NNN}` | `009` — VIN `2T1BURHE0NC505009`, email `client.stage.2505009@yopmail.com` |
| Client last name | `Owner2505-009` (emptied on the contract page only) |
| Quote products | Financing and roadside product (shared values) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Build the vehicle (`{NNN}` = `009`), the client and quote (last name `Owner2505-009`), the vehicle step, the financing and the roadside product with the shared build values. Note the row count on `/road-side-protection-contracts` | Quote E's Roadside Protection row shows the product with a "⋯" menu; ids and row count recorded |
| 2 | [Pre-Condition] Open **⋯** → **Generate Contract** (or type `/quote/{id}/road-side-protection-create-contract`) | The page loads pre-filled. HTTP 500 or an error page → BLOCKED — AP-2518 |
| 3 | Clear the owner's last-name field (record its label), leave every other value as pre-filled, and click **Generate Contract** once | No error page and no HTTP 5xx. Record whether the browser blocked the submit, whether the server answered with a message (its text and position), or whether the page was accepted (Q-008) |
| 4 | Open `/road-side-protection-contracts` and quote E's `/quote/{id}/details` | Both pages load |
| 5 | [Verification] Check the result | If the submit was refused: the contract list has the same row count as step 1, quote E's Roadside row still offers "Generate Contract", and (if the page came back) the other owner, vehicle and financing values are still filled as before. If a contract was created: record its id and the last name it carries (Q-008) — a contract carrying a last name nobody entered fails the step |

---

### AP2505_010 — After its roadside contract exists, the quote cannot make a second contract by reopening the page

| Field | Value |
|---|---|
| **TC ID** | AP2505_010 |
| **Title** | After its roadside contract exists, the quote cannot make a second contract by reopening the page |
| **Requirement** | AP2505 — REQ-001 / REQ-004: AC 1 starts from a quote with "no contract"; what the action and the address do once the contract exists is open as Q-010 (Judgement) |
| **Route** | Quote D (or AP2505_008's quote) `/quote/{id}/details` → `/quote/{id}/road-side-protection-create-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Environment: Dev — execution-log_AP-2505_2026-11-03.md |
| **Result** | BLOCKED — AP-2518 (Test Data rule): no roadside contract on quote D or 008's quote; step 1 count 0 |

**Why this matters:** A dealer may reopen the page from history or a bookmark after the
contract exists. What the page should then show is not stated (Q-010) and is recorded.
Two outcomes are objective faults whatever the answer: a server error page, and merely
opening the page creating a second contract. Opening the page by its address is the step
under test (step 3): an HTTP 500 there is a FAIL, compared with AP-2518 at Gate C. The VIN
counted is the one recorded for the quote in use, and step 1 requires at least one row, so
step 5 cannot pass on an empty count. The case submits nothing.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote D from AP2505_007, holding its roadside contract. If AP2505_007 made no contract, use the quote AP2505_008 built; if neither exists, this case is BLOCKED by the reason that stopped AP2505_007 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Open the quote in use (quote D, or AP2505_008's quote — see Test Data) at `/quote/{id}/details`; take its VIN from the execution log (as recorded by the case that built it, including any +100 change — never a hard-coded value). Count the rows on `/road-side-protection-contracts` for that VIN | The quote's Roadside Protection row shows its contract id; the row count for the recorded VIN is **at least 1** and is recorded. A count of 0 means the quote's own contract is not on the list — the precondition is not met: mark the case BLOCKED ("quote's contract not on the contract list") and do not run steps 2–5 |
| 2 | [Verification] Inspect the quote's Roadside Protection row | Record whether a "⋯" menu or a "Generate Contract" action is still offered, and what replaces it (Q-010) |
| 3 | Type `/quote/{id}/road-side-protection-create-contract` for the quote in use into the address bar and press Enter; do not click anything on the page that loads | No error page and no HTTP 5xx — opening the page is the **step under test** here, so an HTTP 500 is a **FAIL** (Gate C compares it with AP-2518), not BLOCKED. Record whether the page opened, redirected (to where, with which message) or refused (Q-010) |
| 4 | Open `/road-side-protection-contracts` | The list loads |
| 5 | [Verification] Count the rows for the same recorded VIN as step 1 | The count equals step 1's (at least 1) — opening the page did not create a second contract |

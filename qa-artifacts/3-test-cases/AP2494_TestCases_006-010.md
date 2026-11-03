# Test Cases — AP2494 (File 2 of 4)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2494 — Quotes list: replace "Produits" with "Contracts" and add quote search
**Source:** requirements/AP-2494-quotes-list-replace-produits-with-contracts.md · qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2494_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2494_006 to AP2494_010 (5 test cases)
**Coverage:** Functional · Edge-case

**Revisions:**

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2494_006 | Creates its own quote on vehicle 915 and takes it through financing → creditors insurance → Generate Contract; no longer reads quote 6276 / `AVP000160` | Review R2 (independent) F-3 — the `contract-setup` register forbids pointing a test case at 6276, which belongs to AP-2437 cases |
| 2026-11-01 | AP2494_008 | Reuses the AP2494_006 quote (or creates one the same way) and adds the roadside contract to it; never writes to quote 6276 | Review R2 (independent) F-3 — no fallback if 6276 changed, and the case wrote to AP-2437's quote |
| 2026-11-01 | AP2494_010 | Reuses the AP2494_006 quote (or creates one with a financing) and saves the sale on it; never writes to quote 6276 | Review R2 (independent) F-3 — same reason |
| 2026-11-01 | — | Execution Context: Test data, Leaves behind and Known blockers rewritten for the in-run quote; 6276 / `AVP000160` removed as fixed values | Review R2 (independent) F-3 |
| 2026-11-01 | AP2494_006 | Step 2 judges only the "Financing saved" flash and the Financing panel and records whether **Add creditors insurance** is shown. Step 3 opens `/quote/{id}/insurance` and `/quote/{id}/insurance/create-contract` by link if shown, otherwise by URL, and detects a failure by an `alert`-role banner or the text "HTTP" (full banner text recorded) | Review R2 (independent) round 2 F-1 — chubb-insurance.md §5 (mapped 2026-10-03): neither link is shown, both screens are reached by URL; the Create Contract failure banner starts "HTTP/2 400" and contains no "error" |
| 2026-11-01 | AP2494_008, AP2494_010 | Step 1 fallbacks that run AP2494_006 steps point at the reworked steps (links optional, screens by URL; failure by `alert` role or "HTTP"). Known blocker 3 reworded to match | Review R2 (independent) round 2 F-1 |

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer (AP2494_009 also opens the Admin portal for one read) | `navigation` |
| **Entry route** | `/quotes` — Quotes list. Tabs recorded 2026-10-12 as "Active" and "Archived"; 10 rows per page, newest first, `?page=N`. Each row's quote id is in the cells' `data-href="/quote/{id}/details"`; open a quote by its `/quote/{id}/details` URL. Contract lists: `/creditor-insurance-contracts`, `/gap-insurance-contracts`, `/permaplate-contracts` | `navigation`, `domain` (quote-creation.md, chubb-insurance.md) |
| **Viewport** | 1280 x 800 | `navigation` |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login` and Admin portal `/admin/login`, the same shared account of dealer 1380 — username and password from the `env` source (`/.env`), never written here. Both sessions can be held at once | `env`, `navigation` |
| **Test data** | Vehicle 915, VIN `1FAHP35NX8W239204` (Ford Focus 2008). New quotes only through `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`); the bare `/quote/new/client` entry returns HTTP 500. Client emails `client.stage.NNN@yopmail.com`, next unused NNN per run. **The creditor-insurance contract is created in this run by AP2494_006** on its own quote, and AP2494_008 and AP2494_010 reuse that quote — no case reads or writes another ticket's quote or contract. The Chubb configuration of dealer 1380 (creditor account `AP0001`, PM30 and PM50 assigned) is already in place — do not change it. Use Language **Français** with Form **Monthly Premium PM50**, the combination verified end to end on 2026-09-04; Français + PM30 fails silently at Create Contract (BUG-010). Permaplate contracts of dealer 1380 on `/permaplate-contracts` (3 rows on 2026-10-04); each row's Download link is `/quote/{quoteId}/permaplate-contract-download`, which gives the quote id | `test-data`, `domain` (quote-creation.md, chubb-insurance.md), `contract-setup` (designer reference only) |
| **Slow steps** | **Get Quote** and **Create Contract** on the creditors-insurance screens call Chubb's API and take several seconds each. Allow at least 10 s; if a tool times out, re-read `/quote/{id}/details` before calling the step failed | `contract-setup` (designer reference only) |
| **Language** | EN (`?_locale=en`) | `domain` |
| **Leaves behind** | One new quote on vehicle 915 (AP2494_006) carrying a financing record, a Chubb insurance quote and a **durable Chubb creditor contract** (created through Chubb's live development API), plus the roadside contract from AP2494_008 and the sale from AP2494_010. Nothing is cleaned up — record the quote id and every contract number in the execution log | `cleanup` — Not known: the source is `missing` |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | No mapped way to create a GAP insurance contract on a quote; the case depends on an existing row on `/gap-insurance-contracts` | AP2494_007 | Conditional — the list route is mapped; if it is empty at execution, record BLOCKED with this reason |
| 2 | The prerequisites that enable **Create sale** on a quote are not mapped (domain: "disabled until prerequisites are met") | AP2494_010 | Conditional — the AP2494_006 quote carries a financing and a creditor contract; if **Create sale** stays disabled on it, record BLOCKED with this reason |
| 3 | Creating the creditor contract depends on Chubb's development API answering at **Get Quote** and **Create Contract** | AP2494_006, AP2494_008 | Conditional — if either screen shows an `alert`-role banner or any text containing "HTTP" (the Create Contract failure reads *"HTTP/2 400 returned for '.../contract'. - {…}"* and contains neither "error" nor "success", chubb-insurance.md §5), or no contract number appears on `/quote/{id}/details` after re-reading it, record AP2494_006 BLOCKED with the full banner text; AP2494_008 is then BLOCKED for the same reason (it needs two generated contracts). A missing **Add creditors insurance** or **Generate Contract** link is **not** a blocker — both screens are opened by URL. The "Please make sure you create the GAP insurance first…" note on the Creditors insurance row is boilerplate, not an error |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2494_006 | A quote with a creditor-insurance contract lists that contract in its Contracts cell | Functional | High | PASS |
| AP2494_007 | A quote with a GAP insurance contract lists that contract in its Contracts cell | Functional | Medium | BLOCKED |
| AP2494_008 | A quote with two generated contracts lists each one as its own entry, with no blank line | Edge-case | High | BLOCKED |
| AP2494_009 | A quote with a Permaplate contract shows that contract's number in its Contracts cell | Functional | High | PASS |
| AP2494_010 | A quote with a sales contract shows the sales contract number in its Contracts cell | Functional | Medium | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2494_006 — A quote with a creditor-insurance contract lists that contract in its Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_006 |
| **Title** | A quote with a creditor-insurance contract lists that contract in its Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 3 (Q-001 Judgement — how the contract is written) |
| **Route** | `/vehicle/915/details` → `/quote/{id}/financing` → `/quote/{id}/insurance` → `/quote/{id}/insurance/create-contract` → `/quotes` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (Known blocker 3: BLOCKED at execution only if Chubb's API refuses the quote or the contract) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** Creditor insurance is the Chubb product; its contract number
(`AVP…`) comes from Chubb, not from the dealer portal, so it is the most likely to be
missed by a column that reads only local products. The case creates its own quote and
contract, so it reads a known contract and touches no other ticket's data. Its quote is
reused by AP2494_008 and AP2494_010.

**Test Data:**

| Variable | Value |
|---|---|
| Client | First name `Credito`, last name `Chubbline-NNN`, email `client.stage.NNN@yopmail.com` (next unused NNN), address `100 rue Principale`, city `Montréal`, province "Québec", postal code `H2X 1Y4`, home and work phone `5145550101`, "I agree" ticked |
| Financing | Date of birth `1985-06-15`, Type **Financing**, net amount financed `25000`, residual `0`, payment frequency **Monthly**, term months `60`, interest rate `6.99`, financing company: first entry in the list |
| Creditors insurance | Language **Français**, Form **Monthly Premium PM50**, Tax exempt **No**, Life **Decreasing**, Life Term `60`, Life For **Borrower**; Critical illness and Disability left unset |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/vehicle/915/details` → **Create quote**; fill the client from the Test Data → **Save** | Flash "Client saved"; `/quote/{id}/details` loads with no error page. Record the quote id |
| 2 | [Pre-Condition] On `/quote/{id}/details` click **Add a financing**, fill the Financing values from the Test Data → **Save** | Back on `/quote/{id}/details` with the flash "Financing saved" and the Financing panel showing the saved financing. Record whether an **Add creditors insurance** link is shown (it is not required — chubb-insurance.md §5: no link while the Creditors insurance row is empty). If **Add a financing** is disabled, stop and record BLOCKED with the reason shown |
| 3 | [Pre-Condition] Open the insurance screen: click **Add creditors insurance** if step 2 recorded it, otherwise open `/quote/{id}/insurance` by URL (heading "Insurance for {client}"). Fill the Creditors insurance values → **Get Quote** (allow 10 s). Then open the contract screen: click **Generate Contract** if it is shown on `/quote/{id}/details`, otherwise open `/quote/{id}/insurance/create-contract` by URL → **Create Contract** (allow 10 s). Record which screens were reached by link and which by URL | After Get Quote: flash "Chubb insurance quote saved successfully" and `/quote/{id}/details`. After Create Contract: flash "Chubb insurance contract created successfully" on `/quote/{id}/details`, and the Creditors insurance row shows a contract number (`AVP…`). Record it. A failure is detected by an `alert`-role banner or any text containing "HTTP" (e.g. "HTTP/2 400 returned for '.../contract'…") — do not search for the word "error". If such a banner appears, or no number appears after re-reading `/quote/{id}/details`, stop and record BLOCKED (Known blocker 3) with the full banner text |
| 4 | Open `/quotes?_locale=en` on the first tab and find quote {id} (newest first — page 1 unless other quotes were created since) | The row of quote {id} is visible |
| 5 | [Verification] Read the "Contracts" cell of quote {id} | The cell is not blank and contains an entry identifying the creditor-insurance contract recorded in step 3 — by its contract number or product name. No error text such as "null" or "undefined". Record the exact text and whether it is a link, for Q-001 |

---

### AP2494_007 — A quote with a GAP insurance contract lists that contract in its Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_007 |
| **Title** | A quote with a GAP insurance contract lists that contract in its Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 3 (Q-001 Judgement — how the contract is written) |
| **Route** | `/gap-insurance-contracts` → `/quote/{id}/details` → `/quotes` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — (Known blocker 1: BLOCKED at execution only if no GAP contract exists) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED — test data not on dev: no GAP insurance contract |

**Why this matters:** GAP is the third contract type named in AC 3. The domain knowledge
has no mapped way to create one, so the case reuses an existing contract.

**Test Data:**

| Variable | Value |
|---|---|
| Quote id | Reused — recorded in step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/gap-insurance-contracts`, take the first row, note its client name, VIN and contract identifier, and read the quote id from its Download or Details link (or find the quote on `/quotes` by client and vehicle) | A quote id and a GAP contract identifier are recorded. If the list is empty, stop and record BLOCKED (Known blocker 1) |
| 2 | [Pre-Condition] Open `/quote/{id}/details` | The quote shows the GAP product with a generated contract |
| 3 | Open `/quotes?_locale=en` and go to the tab and page that hold quote {id} | The row of quote {id} is visible |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell is not blank and contains an entry identifying the GAP contract recorded in step 1 — by its contract number or product name. No error text such as "null" or "undefined". Record the exact text for Q-001 |

---

### AP2494_008 — A quote with two generated contracts lists each one as its own entry, with no blank line

| Field | Value |
|---|---|
| **TC ID** | AP2494_008 |
| **Title** | A quote with two generated contracts lists each one as its own entry, with no blank line |
| **Requirement** | AP2494 — REQ-002, AC 3 "shows each of those contract", AC 6 (Q-002 Judgement — separator and order) |
| **Route** | `/quote/{id}/details` → `/quote/{id}/road-side-protection` → `/quotes` |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — (Known blocker 3: BLOCKED at execution only if no creditor contract could be created) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED by AP-2518 — second (roadside) contract cannot be generated: HTTP 500 on Dev (quote 6480) |

**Why this matters:** A cell built for one contract often shows only the first, or joins
several into a broken line. AC 3 requires each contract to appear. The separator and order
are not specified (Q-002) and are recorded. The case builds on the quote AP2494_006
created in this run, so both contracts are known.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The quote id AP2494_006 recorded (creditor contract recorded in its step 3) |
| Roadside | First tier, sale price `25000`, VIN `1FAHP35NX8W239204`, stock number `AP2494-RS2-NNN` (NNN = this run's number), vehicle condition: first option, odometer `5000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`) and open `/quote/{id}/details` for the quote AP2494_006 recorded. If AP2494_006 did not create one, first run AP2494_006 steps 1–3 with its Test Data exactly as written there (the **Add creditors insurance** and **Generate Contract** links are optional — open `/quote/{id}/insurance` and `/quote/{id}/insurance/create-contract` by URL when they are not shown) and record the new quote id | The Creditors insurance row shows a generated contract number (`AVP…`); record it. If no creditor contract could be created — an `alert`-role banner or text containing "HTTP" at Get Quote or Create Contract, or no number after re-reading the page — stop and record BLOCKED (Known blocker 3) with the full banner text. A missing link alone is not a reason to block |
| 2 | [Pre-Condition] Open `/quote/{id}/road-side-protection`, fill the roadside fields from the Test Data → **Save and Generate Contract** | The contract is generated with no error; `/quote/{id}/details` shows both the creditor contract and the roadside contract as generated. Record the roadside identifier |
| 3 | Open `/quotes?_locale=en` and go to the tab and page that hold quote {id} | The row of quote {id} is visible |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell holds one entry per contract generated on the quote — at least the creditor contract and the roadside contract — each identifiable. No blank line, empty separator, "null" or "undefined" between or around them. Record the separator and order for Q-002 |

---

### AP2494_009 — A quote with a Permaplate contract shows that contract's number in its Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_009 |
| **Title** | A quote with a Permaplate contract shows that contract's number in its Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 4 "shows those contract numbers" |
| **Route** | `/permaplate-contracts` → `/admin/permaplate-contracts` → `/quotes` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** AC 4 is the only criterion that says the column must show the
contract **number**. The dealer's Permaplate list does not show it, so the number is read
from the admin contract page (heading such as "Esthetic protection Contract
PNA-0000000007").

**Test Data:**

| Variable | Value |
|---|---|
| Quote id | Reused — recorded in step 1 |
| Permaplate contract number | Recorded in step 2 (format `PNA-…`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/permaplate-contracts`, take the first row, note its VIN and client name, and read the quote id from its Download link `/quote/{quoteId}/permaplate-contract-download` | A quote id is recorded |
| 2 | [Pre-Condition] Log in to the Admin portal `/admin/login` (same account); open `/admin/permaplate-contracts`, find the row with the same client and vehicle, open it with the eye icon (`/admin/permaplate-contract/{id}`) | The heading reads "Esthetic protection Contract {number}". Record the number |
| 3 | In the Dealer portal open `/quotes?_locale=en` and go to the tab and page that hold quote {id} | The row of quote {id} is visible |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell shows the Permaplate contract number recorded in step 2, exactly as written on the admin page. No error text such as "null" or "undefined" |

---

### AP2494_010 — A quote with a sales contract shows the sales contract number in its Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_010 |
| **Title** | A quote with a sales contract shows the sales contract number in its Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 4 "shows those contract numbers" (Q-003 Judgement — "generated" vs "finalized") |
| **Route** | `/quote/{id}/details` → `/quote/{id}/sales` → `/quotes` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — (Known blocker 2: BLOCKED at execution only if **Create sale** stays disabled) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — sale AP2494-S-957 saved on quote 6480 but absent from the Contracts cell — bug AP-2517 |

**Why this matters:** The sales contract number is typed by the dealer, so this case sets
a unique number and can check the cell shows exactly that value. It saves the sale on the
quote this run created, never on another ticket's quote.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The quote id AP2494_006 recorded. If none exists, a new quote on vehicle 915 with a financing, made with AP2494_006 steps 1–2 and its Test Data |
| Sales contract | Contract number `AP2494-S-NNN` (NNN = this run's number), sales rep `QA Agent`, delivered on and signed on: today, signed at `Montréal`; other fields left as the form fills them |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`) and open `/quote/{id}/details` for the quote AP2494_006 recorded (if none exists, first create one with AP2494_006 steps 1–2 exactly as written there — step 2 judges only the "Financing saved" flash; whether **Add creditors insurance** is shown is recorded, not required — and record its id) | The Sale section is shown with **Create sale**. If **Create sale** is disabled, stop and record BLOCKED (Known blocker 2) |
| 2 | [Pre-Condition] Click **Create sale** (`/quote/{id}/sales`), fill the Test Data values → **Save**; if the page then offers a separate action to generate or finalize the sales contract, use it | The sale saves with no error; `/quote/{id}/details` shows the sales contract with number `AP2494-S-NNN`. Record whether a separate generate step existed, for Q-003 |
| 3 | Open `/quotes?_locale=en` and go to the tab and page that hold quote {id} | The row of quote {id} is visible |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell shows the sales contract number `AP2494-S-NNN`, exactly as entered, alongside the quote's other contract entries. No blank line, "null" or "undefined" |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-002 — AC 3 (creditor) | AP2494_006 | — | — | — |
| REQ-002 — AC 3 (GAP) | AP2494_007 | — | — | — |
| REQ-002 — AC 3 (each of several contracts), AC 6 (no broken line) | — | — | AP2494_008 | — |
| REQ-002 — AC 4 (Permaplate number) | AP2494_009 | — | — | — |
| REQ-002 — AC 4 (sales contract number) | AP2494_010 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2494_006 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_006-step5-CreditorContractInCell_pass.png` |
| AP2494_007 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_007-step1-GapContractListEmpty_fail.png` |
| AP2494_008 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_008-step2-RoadsideGenerateContractHttp500_fail.png` |
| AP2494_009 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_009-step4-PermaplateNumberInCell_pass.png` |
| AP2494_010 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-SalesContractMissingInCell_fail.png` |

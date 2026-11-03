# Test Cases — AP2448 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2448 — Admin user can see all Permaplate contracts (REQ-006)
**Source:** `requirements/AP-2448-admin-permaplate-contracts.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2448_001 to AP2448_005 (5 test cases)
**Coverage:** Functional · Edge-case · UI · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | CONTRACTS → Permaplate in the admin menu. The route is not yet mapped — the navigation map records 49 admin sidebar links but no Permaplate contracts page. | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin portal, `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` | `env` |
| **Test data** | The Permaplate contracts created in AP2446_001 (client `Perma Invoice`) and AP2446_002 (client `Perma Alert`), both under Dealer 1380, company *Test QA staging*, on vehicle VIN `1FAHP35NX8W239204`, a 2008 Ford Focus. | `test-data` |
| **Language** | English | `navigation` |
| **Leaves behind** | Nothing. Every case in this batch only reads. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | **Whether AP-2448 is deployed to staging at all.** It is the only one of the eight stories with no merged pull request recorded on the ticket. If the page is not there, every case here is Blocked on the deployment, not Failed on the feature. | AP2448_001 – AP2448_005 | Open — Q-009. Settled by AP2448_001 step 2 |
| 2 | How several selected components should be presented inside one *Program* table cell. The criterion asks for "the components selected" and stops there. | AP2448_003 | Open — recorded rather than judged |
| 3 | What the invoices table on the contract details page shows when a contract has no invoice yet. | AP2448_005 | Open — recorded rather than judged |

> No case in this batch ships BLOCKED at design time, because blocker 1 is a yes-or-no fact
> that AP2448_001 settles in its second step. If the answer is no, the executor marks all
> five Blocked at run time with that reason.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2448_001 | The admin Contracts menu offers a "Permaplate" item that opens a page headed "Permaplate Contracts" | Functional | High | PASS |
| AP2448_002 | The admin list shows every Permaplate contract in the system, including contracts from more than one dealer | Functional | High | PASS |
| AP2448_003 | Each row shows the client, dealer, vehicle and program details the acceptance criteria name, filled with that contract's own data | Functional | High | PASS |
| AP2448_004 | The eye-icon view button opens a contract details page showing that contract's PDF in a panel on the page | Functional | High | PASS |
| AP2448_005 | The contract details page lists the invoices raised for that contract | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2448_001 — The admin Contracts menu offers a "Permaplate" item that opens a page headed "Permaplate Contracts"

| Field | Value |
|---|---|
| **TC ID** | AP2448_001 |
| **Title** | The admin Contracts menu offers a "Permaplate" item that opens a page headed "Permaplate Contracts" |
| **Requirement** | AP2448 — criteria 1, 2 and 3 |
| **Route** | The admin CONTRACTS menu |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This case does double duty. It checks the first three criteria, and
its second step settles Q-009 — whether the story is deployed at all. That answer decides
how the other four cases in this file are reported. Marking a feature Failed when it was
simply never deployed sends the developer looking for a fault that does not exist, and
costs the team more time than the test saved.

**Test Data:**

| Variable | Value |
|---|---|
| Admin login | `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login` |
| Expected page title | `Permaplate Contracts` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login` | The admin dashboard loads |
| 2 | Open the admin menu, expand "**CONTRACTS**", and record every item listed underneath it. If no "Permaplate" item is present, record that fact — it is the answer to Q-009 | The CONTRACTS sub-menu is recorded in full. Whether a Permaplate item exists is now known and settles whether AP-2448 is deployed |
| 3 | Click the "**Permaplate**" item and record the route it opens | The Permaplate Contract Index page loads and its route is written into the execution log, since it is not in the navigation map |
| 4 | [Verification] Confirm the page carries a navigation heading reading exactly "**Permaplate Contracts**" and contains a table of contracts | The heading matches the criterion word for word and a contracts table is present. If step 2 found no menu item, this case and the four that follow are recorded as **Blocked** on the deployment, never as Failed |

---

### AP2448_002 — The admin list shows every Permaplate contract in the system, including contracts from more than one dealer

| Field | Value |
|---|---|
| **TC ID** | AP2448_002 |
| **Title** | The admin list shows every Permaplate contract in the system, including contracts from more than one dealer |
| **Requirement** | AP2448 — criterion 4, the "all Permaplate contracts" part |
| **Route** | The admin Permaplate Contract Index page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The word that makes this page worth building is "all". An
administrator handling a complaint needs to find any dealer's contract, not only the ones
belonging to the dealership they happened to open. If the list silently shows one dealer's
contracts, support staff will conclude a contract does not exist when it does.

**Test Data:**

| Variable | Value |
|---|---|
| Known contracts | Those created in AP2446_001 and AP2446_002 under Dealer 1380 |
| Cross-check | The dealer-side list at `/permaplate-contracts`, which shows Dealer 1380's contracts only |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Contract Index page found in AP2448_001 | The contracts list loads |
| 2 | Record the total number of contracts listed, and record how many distinct dealer names appear in the Dealer column | The totals are recorded, giving a factual answer to whether the list spans more than one dealership |
| 3 | Confirm both contracts created in this cycle, for clients `Perma Invoice` and `Perma Alert`, appear in the list | Both known contracts are present |
| 4 | [Verification] Compare the count of Dealer 1380 contracts in this admin list against the count in the dealer portal's own list at `/permaplate-contracts` | The admin list contains at least every contract the dealer list shows. A count lower than the dealer's own list means contracts are missing from the administrator's view, which is reported as a High-severity finding |

---

### AP2448_003 — Each row shows the client, dealer, vehicle and program details the acceptance criteria name, filled with that contract's own data

| Field | Value |
|---|---|
| **TC ID** | AP2448_003 |
| **Title** | Each row shows the client, dealer, vehicle and program details the acceptance criteria name, filled with that contract's own data |
| **Requirement** | AP2448 — criteria 4, 5, 6, 7 and 8 |
| **Route** | The admin Permaplate Contract Index page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** Five separate acceptance criteria describe what belongs in these four
columns, and each one names several fields. A column that is present but half-empty — a
Client column with a name and no phone number, say — meets the criterion at a glance and
fails it in use, because the administrator still has to open the contract to find the detail
the column was supposed to save them opening.

**Test Data:**

| Variable | Value |
|---|---|
| Contract under inspection | The one for client `Perma Invoice`, created in AP2446_001 |
| Client details expected | Name `Perma Invoice`, email `perma.invoice.0906@yopmail.com`, phone `5145550200` |
| Dealer details expected | Company *Test QA staging*, email `vinhle870@gmail.com` |
| Vehicle details expected | A 2008 Ford Focus, VIN `1FAHP35NX8W239204` |
| Program details expected | The Permaplate term and the options selected in AP2446_001 step 2 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Contract Index page | The contracts list loads with the `Perma Invoice` contract visible |
| 2 | Read the *Client* and *Dealer* cells of that row in full and record every value in each | The Client cell holds the client's name, email and phone number. The Dealer cell holds the dealer's company name and email. Any missing field is named individually |
| 3 | Read the *Vehicle* and *Program* cells of the same row and record every value | The Vehicle cell holds the make, model, year and VIN. The Program cell holds the contract term and the components selected. How several components are laid out in one cell is recorded rather than judged, since the criterion does not say |
| 4 | [Verification] Confirm every recorded value matches the contract created in AP2446_001, and that the *Actions* column holds a view button carrying an eye icon | All four columns carry this contract's own data, and the eye-icon view button required by criterion 8 is present |

---

### AP2448_004 — The eye-icon view button opens a contract details page showing that contract's PDF in a panel on the page

| Field | Value |
|---|---|
| **TC ID** | AP2448_004 |
| **Title** | The eye-icon view button opens a contract details page showing that contract's PDF in a panel on the page |
| **Requirement** | AP2448 — criteria 8 and 9 |
| **Route** | The admin Permaplate contract details page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** Being able to read the contract without downloading it is the point of
the details page. An administrator on a support call needs to see what the client is holding
in their hand. An empty panel, or one showing a different contract, makes the page worse than
useless because it looks authoritative while being wrong.

**Test Data:**

| Variable | Value |
|---|---|
| Row A | The contract for client `Perma Invoice` |
| Row B | The contract for client `Perma Alert` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Contract Index page with both cycle contracts listed | Both rows are visible |
| 2 | Click the eye-icon view button on the `Perma Invoice` row and record the route it opens | A contract details page opens for that contract |
| 3 | Confirm the page shows the contract PDF inside a panel embedded in the page rather than as a download, and read enough of it to identify the client | The PDF is displayed on the page and names client `Perma Invoice` |
| 4 | Go back and click the view button on the `Perma Alert` row | A different contract details page opens |
| 5 | [Verification] Confirm this second page shows the `Perma Alert` contract and not the first one | Each view button opens its own contract. A page that always shows the same document regardless of the row clicked is reported as a High-severity finding, because an administrator would give a client the wrong information in good faith |

---

### AP2448_005 — The contract details page lists the invoices raised for that contract

| Field | Value |
|---|---|
| **TC ID** | AP2448_005 |
| **Title** | The contract details page lists the invoices raised for that contract |
| **Requirement** | AP2448 — criterion 10 |
| **Route** | The admin Permaplate contract details page |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This table is where the administrator sees whether a dealer has
actually been billed for a contract. It also cross-checks AP-2446 from the other side: if
the invoice AP2446_001 expected was never created, this table will be empty and the two
findings confirm each other.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The one for client `Perma Invoice` |
| Invoice expected | The one raised automatically in AP2446_001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the contract details page for the `Perma Invoice` contract | The details page loads with the contract PDF panel and, below it, an invoices table |
| 2 | Record every row in the invoices table, with its number, amount and status | The invoice raised in AP2446_001 is listed with its details recorded |
| 3 | Open the details page for a Permaplate contract that has no invoice, if one exists, and record what the invoices table shows | The empty state is recorded. Nothing here is passed or failed, because the ticket never describes an empty state |
| 4 | [Verification] Confirm the invoices table on the `Perma Invoice` contract lists that contract's own invoice, and no invoice belonging to another contract | The table shows exactly the invoices for the contract being viewed. An invoice from another contract appearing here would let an administrator tell a dealer they owe money they do not owe |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — a *Permaplate* item under the admin Contracts menu | AP2448_001 | — | — | — |
| Criterion 2 — it opens the Permaplate Contract Index page | AP2448_001 | — | — | — |
| Criterion 3 — the page is headed *Permaplate Contracts* | AP2448_001 | — | — | — |
| Criterion 4 — a datagrid of all contracts, with the Client column | AP2448_002, AP2448_003 | — | — | — |
| Criterion 5 — the Dealer column | AP2448_003 | — | — | — |
| Criterion 6 — the Vehicle column | AP2448_003 | — | — | — |
| Criterion 7 — the Program column | AP2448_003 | — | — | — |
| Criterion 8 — the eye-icon view button | AP2448_003, AP2448_004 | — | — | — |
| Criterion 9 — the contract PDF in a panel on the details page | AP2448_004 | — | — | — |
| Criterion 10 — the invoices datagrid on the details page | AP2448_005 | — | AP2448_005 | — |

**No negative or regression case appears in this file, and that is a considered choice.**
Every criterion in AP-2448 describes reading a page; there is no input to make invalid and
no existing behaviour this page changes. The regression risk from this work sits in the
shared contract-PDF code, and it is covered by AP2445_005.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2448_001 | PASS | see execution log |
| AP2448_002 | PASS | see execution log |
| AP2448_003 | PASS | see execution log |
| AP2448_004 | PASS | see execution log |
| AP2448_005 | PASS | see execution log |

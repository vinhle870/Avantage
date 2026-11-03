# Test Cases — AP2494 (File 1 of 4)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2494 — Quotes list: replace "Produits" with "Contracts" and add quote search
**Source:** requirements/AP-2494-quotes-list-replace-produits-with-contracts.md · qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2494_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2494_001 to AP2494_005 (5 test cases)
**Coverage:** Functional · Regression · UI

**Revisions:**

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | — | Execution Context "Entry route": dropped the stale note that quote rows are not clickable under automation (corrected 2026-09-03); no result changes | Review R2 (independent) F-5 |

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` — Quotes list (sidebar Vehicles → Quotes). Tabs recorded 2026-10-12 as "Active" and "Archived"; 10 rows per page, newest first, `?page=N`. Each row's quote id is in the cells' `data-href="/quote/{id}/details"`; open a quote by its `/quote/{id}/details` URL | `navigation`, `domain` (quote-creation.md) |
| **Viewport** | 1280 x 800 | `navigation` |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login`, shared dealer account of dealer 1380 ("Test QA staging") — username and password from the `env` source (`/.env`), never written here | `env` |
| **Test data** | Vehicle 915, VIN `1FAHP35NX8W239204` (Ford Focus 2008). New quotes are created only through vehicle 915's Details page → **Create quote** (`/quote/new/client?fromVehicleId=915`) — the bare `/quote/new/client` entry returns HTTP 500 on the details page. Client emails `client.stage.NNN@yopmail.com`, next unused NNN per run | `test-data`, `domain` |
| **Language** | EN for every case except AP2494_003, which switches to FR with `?_locale=fr` and restores the original language | `domain` (quote-creation.md) |
| **Leaves behind** | Every quote created in a `[Pre-Condition]` step stays on dealer 1380, with any roadside contract generated on it. Nothing is cleaned up — record each quote id in the execution log | `cleanup` — Not known: the source is `missing` |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | No mapped way to generate an extended-warranty contract on a quote — the case depends on finding an existing quote of dealer 1380 that already has one | AP2494_004 | Conditional — not a design-time block: the `/warranty` contract list is mapped, so a reusable quote is likely. If none is found at execution, record BLOCKED with this reason |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2494_001 | Quote list Active tab shows a "Contracts" column and no "Produits" column | Functional | High | PASS |
| AP2494_002 | Quote list Archived tab shows a "Contracts" column and no "Produits" column | Functional | Medium | PASS |
| AP2494_003 | Quote list in French shows no "Produits" column; the new column's French label is recorded | Regression | Medium | PASS |
| AP2494_004 | A quote with a generated extended-warranty contract lists that contract in its Contracts cell | Functional | High | PASS |
| AP2494_005 | A quote with a newly generated roadside contract lists that contract in its Contracts cell | Functional | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2494_001 — Quote list Active tab shows a "Contracts" column and no "Produits" column

| Field | Value |
|---|---|
| **TC ID** | AP2494_001 |
| **Title** | Quote list Active tab shows a "Contracts" column and no "Produits" column |
| **Requirement** | AP2494 — REQ-001, AC 1 |
| **Route** | `/quotes` — Quotes list, first tab |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** AC 1 names the tabs `created` and `archived`; the domain knowledge
records the visible labels as "Active" and "Archived". Which label is `created` is open
(Q-004, Judgement), so this case checks the first, non-archived tab and records its label
and URL. The column's position is also open (Q-005) and is recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Header that must be absent | `Produits` |
| Header that must be present | `Contracts` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal with the dealer account from the `env` source and open `/quotes?_locale=en` | The "Quotes" page loads in English with its tabs and a table of quotes; no error page |
| 2 | Click the first tab (recorded 2026-10-12 as "Active"); note the tab label and the page URL | The tab is selected and the table shows at least one quote row. Record the tab label and URL for Q-004 |
| 3 | [Verification] Read every column header of the table, left to right | No header reads "Produits"; exactly one header reads "Contracts". Record the full header order for Q-005 |

---

### AP2494_002 — Quote list Archived tab shows a "Contracts" column and no "Produits" column

| Field | Value |
|---|---|
| **TC ID** | AP2494_002 |
| **Title** | Quote list Archived tab shows a "Contracts" column and no "Produits" column |
| **Requirement** | AP2494 — REQ-001, AC 1 |
| **Route** | `/quotes` — Quotes list, "Archived" tab |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** AC 1 applies to both tabs. A template change made on one tab only
would leave dealers looking at the old "Produits" column on archived quotes.

**Test Data:**

| Variable | Value |
|---|---|
| Header that must be absent | `Produits` |
| Header that must be present | `Contracts` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal with the dealer account from the `env` source and open `/quotes?_locale=en` | The "Quotes" page loads in English; no error page |
| 2 | Click the "Archived" tab; note the page URL | The Archived tab is selected and its table renders (rows, or an empty-table message). Record the URL and the row count |
| 3 | [Verification] Read every column header of the table, left to right | No header reads "Produits"; exactly one header reads "Contracts". Record the header order and compare it with the first tab's order from AP2494_001 |

---

### AP2494_003 — Quote list in French shows no "Produits" column; the new column's French label is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2494_003 |
| **Title** | Quote list in French shows no "Produits" column; the new column's French label is recorded |
| **Requirement** | AP2494 — REQ-001, AC 1 (Q-006 Judgement — French label) |
| **Route** | `/quotes?_locale=fr` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** "Produits" is a French word, so the old column may only ever have
been visible in the French interface. The ticket does not say whether the new header is
"Contracts" or a French label such as "Contrats" (Q-006), so the label is recorded. The
language is shared configuration of the dealer account and must be restored.

**Test Data:**

| Variable | Value |
|---|---|
| Language switch | `?_locale=fr`, restored with the original language |
| Header that must be absent | `Produits` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal with the dealer account from the `env` source; open `/quotes` and record the current interface language (English or French) | The quote list loads; the original language is recorded |
| 2 | Open `/quotes?_locale=fr` | The quote list reloads in French (tab and button labels in French); no error page |
| 3 | Read every column header on the first tab, then on the archived tab | No header on either tab reads "Produits". Record the label in the contracts column's position for Q-006 |
| 4 | Open `/quotes?_locale=en`, or `?_locale=fr` if step 1 recorded French | The quote list reloads in the original language |
| 5 | [Verification] Check the page language and the column headers once more | The interface is back in the language recorded in step 1, and no header reads "Produits" |

---

### AP2494_004 — A quote with a generated extended-warranty contract lists that contract in its Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_004 |
| **Title** | A quote with a generated extended-warranty contract lists that contract in its Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 2 (Q-001 Judgement — how the contract is written) |
| **Route** | `/warranty` (find the contract) → `/quote/{id}/details` → `/quotes` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (Known blocker 1: BLOCKED at execution only if no such quote exists) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** AC 2 says the column "shows that contract" without saying whether
it shows the number, the product name or a link (Q-001). This case judges only that an
entry for the warranty contract appears, and records exactly how it is written.

**Test Data:**

| Variable | Value |
|---|---|
| Quote id | Reused — recorded in step 1 |
| Warranty contract identifier | Recorded in step 2 from the quote's Details page |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/warranty`, pick the newest warranty contract, note its client name and VIN; on `/quotes` find the row with that client and vehicle and read its quote id from the cell's `data-href` | A quote id is recorded whose client and vehicle match a contract on `/warranty`. If no warranty contract or matching quote exists, stop and record BLOCKED (Known blocker 1) |
| 2 | [Pre-Condition] Open `/quote/{id}/details` and read the Warranty section | The warranty shows as finalized (a generated contract, with its download action). Record the contract number or identifier shown |
| 3 | Open `/quotes?_locale=en` and go to the tab and page that hold quote {id} | The row of quote {id} is visible |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell is not blank and contains an entry that identifies the extended-warranty contract recorded in step 2 — by its contract number or its product name. No error text such as "null" or "undefined". Record the exact text, and whether it is a link, for Q-001 |

---

### AP2494_005 — A quote with a newly generated roadside contract lists that contract in its Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_005 |
| **Title** | A quote with a newly generated roadside contract lists that contract in its Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 3 (Q-001 Judgement — how the contract is written) |
| **Route** | `/vehicle/915/details` → `/quote/{id}/road-side-protection` → `/quotes` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED by AP-2518 — roadside Generate Contract returns HTTP 500 on Dev (quote 6479) |

**Why this matters:** The roadside contract is the one contract type this run can create
end to end, so this case proves the column picks up a contract generated today rather than
an old record. Its quote is reused by AP2494_012.

**Test Data:**

| Variable | Value |
|---|---|
| Client | First name `Roadie`, last name `Contrat-NNN`, email `client.stage.NNN@yopmail.com` (next unused NNN), address `100 rue Principale`, city `Montréal`, province "Québec", postal code `H2X 1Y4`, home and work phone `5145550101`, "I agree" ticked |
| Roadside | First tier, sale price `25000`, VIN `1FAHP35NX8W239204`, stock number `AP2494-RS-NNN`, vehicle condition: first option, odometer `5000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/vehicle/915/details` → **Create quote**; fill the client from the Test Data → **Save** | Flash "Client saved"; `/quote/{id}/details` loads with no error page. Record the quote id |
| 2 | [Pre-Condition] Open `/quote/{id}/road-side-protection`, fill the roadside fields from the Test Data → **Save and Generate Contract** | The contract is generated with no error; on `/quote/{id}/details` the roadside product shows as finalized. Record its contract number or identifier |
| 3 | Open `/quotes?_locale=en` on the first tab | Quote {id} is the newest row, on page 1 |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell contains exactly one entry, identifying the roadside contract recorded in step 2 — by its contract number or product name. No error text such as "null" or "undefined". Record the exact text and whether it is a link, for Q-001 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — AC 1 (both tabs, header) | AP2494_001, AP2494_002 | — | — | AP2494_003 |
| REQ-002 — AC 2 (warranty) | AP2494_004 | — | — | — |
| REQ-002 — AC 3 (roadside) | AP2494_005 | — | — | — |

Coverage of AC 3 (creditor, GAP, several contracts) to AC 9 continues in files 2–4.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2494_001 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_001-step3-ActiveTabContractsHeader_pass.png` |
| AP2494_002 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_002-step3-ArchivedTabContractsHeader_pass.png` |
| AP2494_003 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_003-step5-LanguageRestoredEnglish_pass.png` |
| AP2494_004 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_004-step4-WarrantyContractInCell_pass.png` |
| AP2494_005 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_005-step2-RoadsideGenerateContractHttp500_fail.png` |

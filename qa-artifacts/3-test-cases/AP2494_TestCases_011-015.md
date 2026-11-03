# Test Cases — AP2494 (File 3 of 4)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2494 — Quotes list: replace "Produits" with "Contracts" and add quote search
**Source:** requirements/AP-2494-quotes-list-replace-produits-with-contracts.md · qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2494_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2494_011 to AP2494_015 (5 test cases)
**Coverage:** Functional · Edge-case

**Revisions:**

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2494_013 | Step 3 says how to check each other listed row: open `/quote/{id}/details` and record which field holds the term | Review R2 (independent) F-4 — the list has no quote name column |

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` — Quotes list. Tabs recorded 2026-10-12 as "Active" and "Archived"; 10 rows per page, newest first, `?page=N`. Each row's quote id is in the cells' `data-href="/quote/{id}/details"`. The search control is new in AP-2494 and is not mapped yet — its label and how it is submitted are recorded on first use (Q-007) | `navigation`, `domain` (quote-creation.md) |
| **Viewport** | 1280 x 800 | `navigation` |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login`, shared dealer account of dealer 1380 — username and password from the `env` source (`/.env`), never written here | `env` |
| **Test data** | Vehicle 915, VIN `1FAHP35NX8W239204`. New quotes only through `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`); the bare `/quote/new/client` entry returns HTTP 500. Client emails `client.stage.NNN@yopmail.com`, next unused NNN per run | `test-data`, `domain` |
| **Language** | EN (`?_locale=en`) | `domain` |
| **Leaves behind** | New quotes from AP2494_011, AP2494_013 and AP2494_014; a saved (not finalized) warranty on the AP2494_005 quote. Nothing is cleaned up — record each quote id in the execution log | `cleanup` — Not known: the source is `missing` |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Where a dealer sets a quote's name. The list shows no quote name, and the vehicle-first form with a "Quote name" field (AP-2477) returned HTTP 404 on Staging on 2026-10-12 | AP2494_013 | Open — Q-010 (Judgement). Conditional: step 1 checks both forms; if neither offers a quote name field, record BLOCKED with Q-010 |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2494_011 | A quote with no generated contract shows a blank Contracts cell | Edge-case | High | PASS |
| AP2494_012 | A product saved without a contract adds no entry and no blank line to the Contracts cell | Edge-case | High | BLOCKED |
| AP2494_013 | Searching part of a quote name in a different letter case lists that quote | Functional | Medium | PASS |
| AP2494_014 | Searching a client's first name, last name, email or full name lists that client's quote | Functional | High | PASS |
| AP2494_015 | Searching part of a client's name or email in lower case — the result is recorded | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2494_011 — A quote with no generated contract shows a blank Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_011 |
| **Title** | A quote with no generated contract shows a blank Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 5 |
| **Route** | `/vehicle/915/details` → `/quotes` |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** Most quotes on the list have no contract yet. AC 5 says their cell
must be blank — not a placeholder, an error or a leftover product name.

**Test Data:**

| Variable | Value |
|---|---|
| Client | First name `Vide`, last name `Contrat-NNN`, email `client.stage.NNN@yopmail.com` (next unused NNN), address `100 rue Principale`, city `Montréal`, province "Québec", postal code `H2X 1Y4`, home and work phone `5145550101`, "I agree" ticked |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/vehicle/915/details` → **Create quote**; fill the client from the Test Data → **Save** | Flash "Client saved"; `/quote/{id}/details` loads with no error page and no product. Record the quote id |
| 2 | Open `/quotes?_locale=en` on the first tab | Quote {id} is the newest row, on page 1 |
| 3 | [Verification] Read the "Contracts" cell of quote {id} | The cell is blank: no text, no contract number, no product name, no "null", "undefined", "-" or other placeholder. The row's Client cell shows `Vide Contrat-NNN` and its Vehicle cell shows the 2008 Ford Focus of vehicle 915 |

---

### AP2494_012 — A product saved without a contract adds no entry and no blank line to the Contracts cell

| Field | Value |
|---|---|
| **TC ID** | AP2494_012 |
| **Title** | A product saved without a contract adds no entry and no blank line to the Contracts cell |
| **Requirement** | AP2494 — REQ-002, AC 6 |
| **Route** | `/quote/{id}/warranty/edit` → `/quotes` |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED by AP-2518 — needs the AP2494_005 roadside contract (HTTP 500 on Dev) |

**Why this matters:** A list that builds one line per product, then fills it with the
contract, leaves an empty line or a dangling separator for a product without a contract.
AC 6 forbids exactly that.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The quote created by AP2494_005 (one generated roadside contract). If AP2494_005 did not run, create it with that case's steps 1–2 first |
| Warranty | First term radio on `/quote/{id}/warranty/edit`, no component ticked → **Save**; do not generate a contract |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`) and open `/quote/{id}/details` of the AP2494_005 quote | The roadside product shows a generated contract; there is no warranty yet |
| 2 | [Pre-Condition] Open `/quote/{id}/warranty/edit`, choose the first term → **Save** | Back on `/quote/{id}/details` the Warranty section shows the warranty saved but **not** finalized (no generated contract, no download action). If saving generates a warranty contract by itself, record that and stop: record BLOCKED, the precondition cannot be built this way |
| 3 | Open `/quotes?_locale=en` and find the row of quote {id} | The row is visible |
| 4 | [Verification] Read the "Contracts" cell of quote {id} | The cell holds only the roadside contract entry seen in AP2494_005 — nothing for the warranty. No blank line, empty bullet, leading or trailing separator, "null" or "undefined" |

---

### AP2494_013 — Searching part of a quote name in a different letter case lists that quote

| Field | Value |
|---|---|
| **TC ID** | AP2494_013 |
| **Title** | Searching part of a quote name in a different letter case lists that quote |
| **Requirement** | AP2494 — REQ-003, AC 7 (Q-007, Q-010 Judgement) |
| **Route** | `/quotes` → "Create a quote" → `/quotes` search |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (Known blocker 1: BLOCKED at execution if no quote name can be set) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** AC 7 is the only search criterion that states the match is partial
and case-insensitive, so the search term here differs from the stored name in both ways:
it is a fragment, and it is upper case.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `Zephyrine AP2494 NNN` (NNN = this run's number) |
| Search term | `PHYRINE` — a fragment of the name, in upper case |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). On `/quotes` click "Create a quote"; if the form shows a "Quote name" field, create the quote with name `Zephyrine AP2494 NNN` and vehicle VIN `1FAHP35NX8W239204` → **Save**. Otherwise create a quote from `/vehicle/915/details` → **Create quote** and look for a quote name field on its client, vehicle or details pages | A quote named `Zephyrine AP2494 NNN` exists; record its id and where the name was set, for Q-010. If no quote name field exists anywhere, stop and record BLOCKED by Q-010 |
| 2 | Open `/quotes?_locale=en`, open the search and submit `PHYRINE` | The list reloads with no error page. Record the search control's label and how it was submitted, for Q-007 |
| 3 | [Verification] Read the listed rows; for every listed row other than quote {id}, read its quote id from the row's `data-href` and open `/quote/{id}/details` (the list has no quote name column) | Quote {id} is listed. Every other listed quote's details page shows `phyrine` (any case) in its quote name, client name or email, or vehicle VIN; record which field holds it for each row. Record the row count |

---

### AP2494_014 — Searching a client's first name, last name, email or full name lists that client's quote

| Field | Value |
|---|---|
| **TC ID** | AP2494_014 |
| **Title** | Searching a client's first name, last name, email or full name lists that client's quote |
| **Requirement** | AP2494 — REQ-004, AC 8 |
| **Route** | `/vehicle/915/details` → `/quotes` search |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** AC 8 names four ways to find a client's quote. Each search term
here is the exact stored value, so no partial or case rule is assumed; those are recorded
separately in AP2494_015. The quote is reused by AP2494_015 and AP2494_016.

**Test Data:**

| Variable | Value |
|---|---|
| Client | First name `Ysolde`, last name `Brakwater-NNN`, email `client.stage.NNN@yopmail.com` (next unused NNN), address `100 rue Principale`, city `Montréal`, province "Québec", postal code `H2X 1Y4`, home and work phone `5145550101`, "I agree" ticked |
| Searches | `Ysolde` · `Brakwater-NNN` · `client.stage.NNN@yopmail.com` · `Ysolde Brakwater-NNN` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`). Open `/vehicle/915/details` → **Create quote**; fill the client from the Test Data → **Save** | Flash "Client saved"; `/quote/{id}/details` loads. Record the quote id |
| 2 | Open `/quotes?_locale=en`, open the search and submit `Ysolde` | Quote {id} is listed; no error page |
| 3 | Search `Brakwater-NNN` | Quote {id} is listed, and every listed row's client is `Ysolde Brakwater-NNN` |
| 4 | Search `client.stage.NNN@yopmail.com` | Quote {id} is listed |
| 5 | [Verification] Search `Ysolde Brakwater-NNN` | Quote {id} is listed, and every listed row's client is `Ysolde Brakwater-NNN` |

---

### AP2494_015 — Searching part of a client's name or email in lower case — the result is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2494_015 |
| **Title** | Searching part of a client's name or email in lower case — the result is recorded |
| **Requirement** | AP2494 — REQ-004, AC 8 (Q-012 Judgement — partial and case-insensitive for client fields; Q-013 Info — reversed name) |
| **Route** | `/quotes` search |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** The ticket states "partial and case-insensitive" only for the quote
name (AC 7). Whether the client searches behave the same is open (Q-012), so this case
records the result of each search and fails only on an objective fault.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The AP2494_014 quote (client `Ysolde Brakwater-NNN`) |
| Searches | `ysolde` (lower case) · `brakw` (fragment, lower case) · `stage.NNN@yopmail` (email fragment) · `Brakwater-NNN Ysolde` (reversed order) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`); confirm the AP2494_014 quote exists (if not, run AP2494_014 step 1 first) | The quote id is known |
| 2 | On `/quotes?_locale=en`, search `ysolde`, then `brakw` | Each search returns a list with no error page. Record for Q-012 whether quote {id} is listed for each term |
| 3 | Search `stage.NNN@yopmail`, then `Brakwater-NNN Ysolde` | Each search returns a list with no error page. Record whether quote {id} is listed — for Q-012 (email fragment) and Q-013 (reversed name) |
| 4 | [Verification] Review every result of steps 2–3 | No search produced an error page or a row whose client and other searched fields hold none of the search term. Whether quote {id} was listed is record-only for Q-012 and Q-013 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-002 — AC 5 (no contract → blank) | — | — | AP2494_011 | — |
| REQ-002 — AC 6 (product without contract → no entry) | — | — | AP2494_012 | — |
| REQ-003 — AC 7 (partial, case-insensitive quote name) | AP2494_013 | — | — | — |
| REQ-004 — AC 8 (first, last, email, full name) | AP2494_014 | — | AP2494_015 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2494_011 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_011-step3-BlankContractsCell_pass.png` |
| AP2494_012 | BLOCKED | — (see AP2494_005) |
| AP2494_013 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_013-step3-QuoteNameSearchPhyrine_pass.png` |
| AP2494_014 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_014-step5-FullNameSearch_pass.png` |
| AP2494_015 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_015-step4-ReversedNameSearch_pass.png` |

# Test Cases — AP2428 (File 4 of 4)

**Project:** Avantage Plus v2 — AP-2428 Dealer Permaplate Contract
**Requirement:** AP2428 — Generate Contract submit under a double click (REQ-006)
**Source:** `requirements/AP-2428-dealer-permaplate-contract.md` · `qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2428_test-plan.md` · promoted from `qa-artifacts/3-test-cases/AP2428_ReviewFindings_2026-11-01.md` Pass 2 row 1 by Gate B rule B2
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revisions:** 2026-11-02 — s4 worker: the clear-text login and password in the Execution Context **Login** row were replaced with a reference to the `env` source (credential policy). No step or expected result changed.
**TC Range:** AP2428_015 to AP2428_015 (1 test case)
**Coverage:** Negative (error guessing)

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → create-contract control. Dealer contract list `/permaplate-contracts` ("Esthetic protection contracts": VIN · Client name · Client phone · Contract cost price · Actions). Invoices `/invoice` | `navigation`, `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer `/login`, the shared QA account from the `env` source (login and password are read from there at run time and never copied into this file) (Dealer ID 1380) | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`. Dealer 1380 must have a Permaplate product linked (checked in AP2428_001 step 1) | `test-data` |
| **Language** | EN | `domain` |
| **Leaves behind** | One client, one quote, and one Permaplate contract with its invoice — two of each if the defect this case looks for is present | `cleanup` (missing — recorded here) |

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2428_015 | Double-clicking Generate Contract creates exactly one contract for the quote | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2428_015 — Double-clicking Generate Contract creates exactly one contract for the quote

| Field | Value |
|---|---|
| **TC ID** | AP2428_015 |
| **Title** | Double-clicking Generate Contract creates exactly one contract for the quote |
| **Requirement** | AP2428 — REQ-006, AC 1 (one submission of the form creates the contract) |
| **Route** | `/quote/{id}/details` → Create contract → Generate Contract |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), `qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md` |
| **Result** | PASS — one contract row and one invoice after a double click |
| **Revisions** | 2026-11-01 — added by Gate B rule B2 (review findings Pass 2 row 1, error guessing) |

**Why this matters:** A dealer on a slow connection often clicks twice. Each Permaplate
contract raises an invoice automatically, so two contracts for one sale means the dealer
is billed twice. One sale submitted once must produce one contract.

**Test Data:**

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Double` / `Clic2428` |
| Address / City / Province / Postal code | `22 rue Sherbrooke Ouest` / `Montréal` / `Québec` / `H2X 1X3` |
| Tel. home / Tel. work | `5145550500` / `5145550501` |
| Delivery date / Price | `2026-11-01` / `20000` |
| Permaplate selection | The first product and every enabled option |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the Test Data values, tick the policy-agreement box → **Save** | `/quote/{id}/details` loads for `Double Clic2428`; quote id recorded |
| 2 | [Pre-Condition] At `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; at `/quote/{id}/permaplate` select the first product, tick every enabled option → **Save**; on `/permaplate-contracts` count the rows for client `Double Clic2428` (expected 0) and on `/invoice` record the highest invoice ID | Selection saved; row count and highest invoice ID recorded |
| 3 | Open the create-contract control on `/quote/{id}/details` and double-click **Generate Contract** (two clicks in quick succession) | The response is recorded; any message word for word |
| 4 | [Verification] Verify `/permaplate-contracts` lists exactly one row for `Double Clic2428` with VIN `1FAHP35NX8W239204`; record how many new invoices above the ID recorded in step 2 `/invoice` shows for this client | One contract row for this quote. Two contract rows for `Double Clic2428`, or an error page, is a FAIL against AP-2428. The invoice count is recorded only — invoices are out of scope (test plan §2.2, AP-2446); two invoices for one contract row is reported against AP-2446, not this case |

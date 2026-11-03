# Test Cases — AP2494 (File 4 of 4)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2494 — Quotes list: replace "Produits" with "Contracts" and add quote search
**Source:** requirements/AP-2494-quotes-list-replace-produits-with-contracts.md · qa-artifacts/1-requirements-analysis/AP-2494_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2494_test-plan.md · qa-artifacts/3-test-cases/AP2494_ReviewFindings_2026-11-01.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2494_016 to AP2494_019 (4 test cases)
**Coverage:** Functional · Negative · Regression · Security

**Revisions:**

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2494_016 | Step 2 no longer expects the quote on page 1; its page and position are recorded | Gate B rule B1 — review finding Pass 1 #3 / R2 F-3: paging under a search is Q-011 (Judgement) |
| 2026-11-01 | AP2494_017 | Step 4 made record-only | Gate B rule B1 — Pass 1 #1 / R2 F-1: clearing a search is Q-009 (Judgement) |
| 2026-11-01 | AP2494_018 | Step 2 made record-only | Gate B rule B1 — Pass 1 #2 / R2 F-2: search scope across tabs is Q-011 (Judgement) |
| 2026-11-01 | AP2494_019 | New case — promoted from review Pass 2 #1 (High) | Gate B rule B1 — dealer isolation of search results; closes Pass 1 #4. File renamed from `_016-018` to `_016-019` |
| 2026-11-01 | AP2494_018 | Step 4 made record-only: only "no error page" is judged; clearing, tab and page 2 contents are recorded | Review R2 (independent) F-1 — clearing a search (Q-009) and whether it carries across tabs and pages (Q-011) are open Judgement questions, as in AP2494_017 step 4 |
| 2026-11-01 | AP2494_019 | Step 1 picks a row on a VIN other than vehicle 915's that shares no client-and-VIN pair with dealer 1380, and records its Permaplate contract number; step 5 judges a leak on that contract number (Contracts cell or `/quote/{id}/details`), not on client and VIN alone | Review R2 (independent) F-2 — test VINs are shared on staging, so a dealer-1380 quote can carry the same client and VIN |

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer (AP2494_019 also reads one Admin portal list) | `navigation` |
| **Entry route** | `/quotes` — Quotes list. Tabs recorded 2026-10-12 as "Active" and "Archived"; 10 rows per page, newest first, `?page=N`. Each row's quote id is in the cells' `data-href="/quote/{id}/details"`. The search control is new in AP-2494 and not mapped yet (Q-007). Admin list with a Dealer column: `/admin/permaplate-contracts` (Client · Dealer · Vehicle · Program, 10 per page) | `navigation`, `domain` (quote-creation.md) |
| **Viewport** | 1280 x 800 | `navigation` |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login` and Admin portal `/admin/login`, the same shared account of dealer 1380 — username and password from the `env` source (`/.env`), never written here. Dealer 1380's name in admin lists is "Offical VinhLe870@gmail.com" | `env` |
| **Test data** | Vehicle 915, VIN `1FAHP35NX8W239204` (Ford Focus 2008), and the quote created by AP2494_014 on it (client `Ysolde Brakwater-NNN`) | `test-data` |
| **Language** | EN (`?_locale=en`) | `domain` |
| **Leaves behind** | Nothing new — these cases only search and read | `cleanup` — Not known: the source is `missing` |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A contract on `/admin/permaplate-contracts` that belongs to a dealership other than 1380, is not on VIN `1FAHP35NX8W239204`, and shares no client-and-VIN pair with a dealer-1380 row | AP2494_019 | Conditional — the admin list shows every dealership; if no row qualifies, record BLOCKED with this reason |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2494_016 | Searching part of a vehicle's VIN lists the quotes on that vehicle | Functional | High | PASS |
| AP2494_017 | Searching a term that matches no quote lists no quote and shows no error | Negative | Medium | PASS |
| AP2494_018 | Searching on the Archived tab and clearing the search — tab, paging and results are recorded | Regression | Low | PASS |
| AP2494_019 | Searching a client who belongs to another dealership lists none of that dealership's quotes | Security | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2494_016 — Searching part of a vehicle's VIN lists the quotes on that vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2494_016 |
| **Title** | Searching part of a vehicle's VIN lists the quotes on that vehicle |
| **Requirement** | AP2494 — REQ-005, AC 9 (Q-011, Q-012 Judgement — paging and VIN letter case; Q-015 Info — wording of AC 9) |
| **Route** | `/quotes` search |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** Dealers often have only the last digits of a VIN at hand. AC 9
requires a partial VIN to find the quote. Vehicle 915 carries many quotes, so every listed
row should be on that vehicle.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The AP2494_014 quote (vehicle 915). If it does not exist, create one from `/vehicle/915/details` → **Create quote** with that case's client data |
| Partial VIN | `8W239204` (last 8 characters of `1FAHP35NX8W239204`) |
| Full VIN | `1FAHP35NX8W239204` |
| Lower-case VIN | `1fahp35nx8w239204` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`) and confirm the AP2494_014 quote id | The quote id is known |
| 2 | On `/quotes?_locale=en`, open the search and submit `8W239204`; page through the results if quote {id} is not on the first page | The list reloads with no error page; quote {id} is listed in the results. Record the page and position it appears on, and the result count, for Q-011 |
| 3 | Search `1FAHP35NX8W239204` | Quote {id} is listed in the results; every listed row's vehicle is the 2008 Ford Focus of vehicle 915 |
| 4 | [Verification] Search `1fahp35nx8w239204` and review the rows of step 2 | Every row listed in step 2 is on vehicle 915 (the 2008 Ford Focus). The lower-case search returns a list with no error page; whether quote {id} is listed is record-only for Q-012 |

---

### AP2494_017 — Searching a term that matches no quote lists no quote and shows no error

| Field | Value |
|---|---|
| **TC ID** | AP2494_017 |
| **Title** | Searching a term that matches no quote lists no quote and shows no error |
| **Requirement** | AP2494 — REQ-003 / REQ-004 / REQ-005, AC 7–9 "the matching quotes are listed" (Q-009 Judgement — empty-result display and clearing) |
| **Route** | `/quotes` search |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** A search that ignores an unmatched term and shows the whole list
looks like it worked, but it lists quotes that do not match. The empty-result message and
the way to clear the search are not specified (Q-009), so they are recorded.

**Test Data:**

| Variable | Value |
|---|---|
| No-match term | `qzxwv-AP2494-nomatch` |
| Special-character term | `%_'"<b>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`), open `/quotes?_locale=en` and record the number of quotes on the first page | The list shows quote rows |
| 2 | Open the search and submit `qzxwv-AP2494-nomatch` | No quote row is listed; no error page. Record the message or empty state shown, for Q-009 |
| 3 | Search `%_'"<b>` | No error page or HTTP 500; the term is not rendered as HTML (no bold text appears). Record whether any quote is listed |
| 4 | [Verification] Clear the search (empty the box and submit, or use a clear control if one exists) | No error page appears. Record how the search was cleared and what the list then shows (rows and count, compared with step 1), for Q-009 |

---

### AP2494_018 — Searching on the Archived tab and clearing the search — tab, paging and results are recorded

| Field | Value |
|---|---|
| **TC ID** | AP2494_018 |
| **Title** | Searching on the Archived tab and clearing the search — tab, paging and results are recorded |
| **Requirement** | AP2494 — REQ-003 / REQ-004 (Q-011 Judgement — search scope across tabs and paging) |
| **Route** | `/quotes` — "Archived" tab, search |
| **Type** | Regression |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** The ticket does not say whether the search looks only in the tab
being viewed, or keeps paging (Q-011). This case records that, and checks the list's
existing tabs and paging still work after a search.

**Test Data:**

| Variable | Value |
|---|---|
| Archived-tab term | The client last name of the first row on the Archived tab (read in step 1) |
| Active-only term | `Brakwater-NNN` (the AP2494_014 quote, which is not archived) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Dealer portal (account from `env`), open `/quotes?_locale=en`, click "Archived" and read the first row's client last name. If the Archived tab is empty, record that and skip to step 3 | The last name is recorded |
| 2 | On the Archived tab, search that last name | No error page. Record whether the archived quote is listed and which tab is selected after the search, for Q-011 |
| 3 | Still on the Archived tab, search `Brakwater-NNN` | No error page. Record whether the active AP2494_014 quote appears, for Q-011 |
| 4 | [Verification] Clear the search (empty the box and submit, or use a clear control if one exists), click the first tab, then open page 2 (`?page=2`) | No error page appears at any point. Record, for Q-009 and Q-011: how the search was cleared, whether the box still holds a term, which tab is selected, the rows and count the first tab then shows, and whether page 2 lists rows different from page 1. Those are record-only — no expectation is set on them |

---

### AP2494_019 — Searching a client who belongs to another dealership lists none of that dealership's quotes

| Field | Value |
|---|---|
| **TC ID** | AP2494_019 |
| **Title** | Searching a client who belongs to another dealership lists none of that dealership's quotes |
| **Requirement** | AP2494 — REQ-004, AC 8, and the description: "On the dealer quote list (`/quotes`) … add a keyword search" (Q-014 Judgement) |
| **Route** | `/admin/permaplate-contracts` → `/quotes` search |
| **Type** | Security |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (Known blocker 1: BLOCKED at execution only if no other dealership's contract is listed) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md |

**Why this matters:** The ticket adds a search to the **dealer** quote list, which shows
only the dealership's own quotes. A search that reaches past that list would let any dealer
read other dealerships' client names, emails and VINs. The case judges only a row that is
not on dealer 1380's own list — a quote nobody at this dealership entered; everything else
about scoping is recorded for Q-014.

**Test Data:**

| Variable | Value |
|---|---|
| Other dealership's contract | Permaplate contract number, client last name and VIN of a row on `/admin/permaplate-contracts` whose Dealer is not "Offical VinhLe870@gmail.com", whose VIN is not `1FAHP35NX8W239204`, and whose client and VIN appear on no dealer-1380 row — recorded in step 1. The contract number is what identifies it; client and VIN alone can be shared with dealer 1380's own quotes on staging |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal `/admin/login` (account from `env`) and open `/admin/permaplate-contracts`. Page through and pick the first row whose Dealer is not "Offical VinhLe870@gmail.com", whose VIN is not `1FAHP35NX8W239204`, and whose client last name and VIN appear together on no "Offical VinhLe870@gmail.com" row of the same list. Open it with the eye icon (`/admin/permaplate-contract/{id}`) | The heading reads "Esthetic protection Contract {number}". Record the contract number (unique to that contract), the client last name, the VIN, the dealer, and the pages checked for a dealer-1380 row with the same client and VIN. If no row qualifies, stop and record BLOCKED (Known blocker 1) |
| 2 | [Pre-Condition] Log in to the Dealer portal (same account) and open `/quotes?_locale=en` | The dealer quote list loads |
| 3 | Search the recorded client last name | The search returns a list with no error page. Record the rows listed |
| 4 | Search the recorded VIN | The search returns a list with no error page. Record the rows listed |
| 5 | [Verification] Review the rows of steps 3–4. For every listed row whose client last name and VIN both match the recorded values, read its quote id from the row's `data-href` and open `/quote/{id}/details` | No listed row is the other dealership's contract: no row's Contracts cell shows the recorded contract number, and no matching row's `/quote/{id}/details` shows that contract number or is refused to dealer 1380 (403, 404 or error page). A matching row whose details page opens and carries no such contract is dealer 1380's own quote on a shared VIN, not a leak — record its quote id. Whether the search shows a "no result" message is record-only for Q-014 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-005 — AC 9 (partial VIN) | AP2494_016 | — | — | — |
| REQ-003 / 004 / 005 — no match, special characters | — | AP2494_017 | — | — |
| REQ-003 / 004 — search on Archived tab, paging | — | — | — | AP2494_018 |
| REQ-004 — AC 8, dealer isolation (Security) | — | AP2494_019 | — | — |

**Whole-ticket coverage (files 1–4):** AC 1 → 001, 002, 003 · AC 2 → 004 · AC 3 → 005,
006, 007, 008 · AC 4 → 009, 010 · AC 5 → 011 · AC 6 → 012, 008 · AC 7 → 013, 017 · AC 8 →
014, 015, 017, 019 · AC 9 → 016, 017.

**Not promoted (backlog):** review Pass 2 #2–#7 (Medium and Low) — see
`AP2494_ReviewFindings_2026-11-01.md`.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2494_016 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_016-step4-LowercaseVinSearch_pass.png` |
| AP2494_017 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_017-step4-SearchClearedFullList_pass.png` |
| AP2494_018 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_018-step4-ActiveTabPage2AfterClear_pass.png` |
| AP2494_019 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_019-step5-OtherDealerVinNoResult_pass.png` |

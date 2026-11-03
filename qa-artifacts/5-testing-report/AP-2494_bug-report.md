# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2494: Quotes list — replace "Produits" with "Contracts" and add quote search
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2494 single-ticket STLC run, run folder no-sprint. 19 test cases executed on **Dev (v2dev)** on 2026-11-02, by the user's decision: 14 PASS, 1 FAIL, 4 BLOCKED, 0 SKIPPED (74 %).
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2494_2026-11-02.md · qa-artifacts/3-test-cases/AP2494_TestCases_*.md · Gate C decision in qa-artifacts/7-reviews/AP-2494_review.md (R3 round 1, confirmed by R3 round 2 APPROVE)

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca`. Staging was not opened in this run.

| Metric | Value |
|---|:---:|
| Total defects | 2 |
| Critical | 0 |
| High | 1 |
| Medium | 1 |
| Low | 0 |
| Tracker tickets created | 2 (AP-2517, AP-2518 on 2026-11-02) |

**Decisions (Gate C, by the reviewer — R3 round 2 APPROVE):**
- **AP2494_010 → file new (rule C4).** Rule C1 does not hold: the requirement capture has no sentence saying a saved sale stays off the list, and AP-2494 has 0 comments. AC 4 says the opposite: "Given a quote with generated Permaplate or sale contracts, when its row renders, then the "Contracts" column shows those contract numbers." Open AP bugs were searched for "Contracts column", "sale contract number", "sales contract" and "AP2494" (R3, and again before filing on 2026-11-01T21:13Z UTC); the nearest candidates (AP-2508, AP-2461, AP-2515, AP-2459, AP-2488, AP-2512) are about the roadside page, Permaplate contracts, PDFs and invoices — none names the `/quotes` Contracts cell or sales contracts.
- **Roadside create-contract HTTP 500 → file new, linked *relates to* AP-2508 (rule C3 → reviewer rule E2).** AP-2508 is about the same page family but a different behaviour: it says the roadside page has **no** "Generate Contract" button and that no error and no HTTP 500 appear. This run reached the create-contract route by URL and from the row's ⋯ menu and got HTTP 500. No comment is posted on AP-2508.
- AP2494_005, AP2494_008 and AP2494_012 are BLOCKED by BUG-002, not failed: the HTTP 500 occurs at a precondition step, before the step under test. AP2494_007 is BLOCKED for missing test data (no GAP insurance contract on Dev) and has no bug.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2494_010 (step 4) | A saved sale contract number does not appear in the Contracts column of the quote list | Medium | P2 | [AP-2517](https://garantieavantageplus.atlassian.net/browse/AP-2517) | Open |
| BUG-002 | AP2494_005 (step 2), AP2494_008 (step 2); blocks AP2494_012 | Opening the roadside "Generate Contract" page of a quote returns an HTTP 500 error page | High | P2 | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) | Open |

---

## Bug Details

---

### BUG-001 — A saved sale contract number does not appear in the Contracts column of the quote list

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2494_010 (FAIL at step 4) |
| **Requirement** | AP-2494 REQ-002 — AC 4: "Given a quote with generated Permaplate or sale contracts, when its row renders, then the "Contracts" column shows those contract numbers." |
| **Severity** | Medium — a dealer scanning the quote list cannot see that a quote already has a signed sale contract; the sale itself is saved and visible on the quote's details page, so nothing is lost |
| **Priority** | P2 — fix in the current release; it keeps AC 4 of AP-2494 from holding for sale contracts |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · app version not exposed |
| **Tracker Ticket** | [AP-2517](https://garantieavantageplus.atlassian.net/browse/AP-2517) — Bug, priority Medium, labels qa-agent / stlc-automated, status Backlog, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2494; 3 screenshots embedded in the description (verified: 3 media nodes with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — quote 6480, list reloaded once with the same result |

**Summary:**
On Dev (v2dev), after a sale contract is saved on a quote (quote 6480, sale number `AP2494-S-957`), the **Contracts** column of that quote's row on the dealer quote list `/quotes` (Active tab) lists only the creditor-insurance contract `AVP000170` and not the sale number, although AP-2494 AC 4 says the column shows sale contract numbers.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in to the Dealer portal with the QA dealer account (Dealer ID 1380).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and click **Create quote**. Fill the client form: Email `client.stage.957@yopmail.com` (any unused address), First name `Credito`, Last name `Chubbline-957`, Address `100 rue Principale`, City `Montréal`, Province "Québec", Postal code `H2X 1Y4`, Tel. home and Tel. work `5145550101`, tick the "I agree" box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved". (Skip steps 2–4 and use quote 6480, which was created exactly this way, if it still exists.)
3. On `/quote/{id}/details` click **Add a financing**. In the modal enter date of birth `1985-06-15`, type **Financing**, financed amount `25000`, residual `0`, frequency **Monthly**, term `60` months, interest rate `6.99`, financing company **AutoCapital Canada**, and click **Save**. The alert "Financing saved" appears.
4. Open `/quote/{id}/insurance` (by URL, or the "+" on the Creditors insurance row). Choose Language **Français**, Form **Monthly Premium PM50**, Tax exempt **No**, coverage **Life Decreasing**, term `60`, **Borrower**, and click **Get Quote** — the alert "Chubb insurance quote saved successfully" appears. Then open `/quote/{id}/insurance/create-contract` and click **Generate Contract**. After about 10 seconds `/quote/{id}/details` shows "Chubb insurance contract created successfully" and a contract number starting `AVP` (on quote 6480: `AVP000170`).
5. On `/quote/{id}/details` click **Create sale** (opens `/quote/{id}/sales`, heading "Sales contract"). Enter contract number `AP2494-S-957`, sales rep `QA Agent`, delivered on `2026-11-01`, signed on `2026-11-01`, signed at `Montréal`, and click **Save**. The alert "Contract saved" and an "Open PDF in new tab" link appear. There is no other generate or finalize action on this page or on the details page. Back on `/quote/{id}/details`, the Sale section reads "#AP2494-S-957 · Sales rep: QA Agent · Edit sale".
6. Open `https://v2dev.garantieavantageplus.ca/quotes?_locale=en` (Active tab) and find the quote's row (on 2026-11-02, quote 6480 was row 1 of page 1).
7. Read the **Contracts** cell of that row. **← wrong result:** it lists only `AVP000170`; `AP2494-S-957` is not shown. Reload the page — same result.

**Expected Result:**
The Contracts cell lists the sale contract number `AP2494-S-957` as its own entry next to `AVP000170`, with no blank line, as AP-2494 AC 4 states: "Given a quote with generated Permaplate or sale contracts, when its row renders, then the "Contracts" column shows those contract numbers." Saving is the only step the sales page offers, so a saved sale is as "generated" as a sale contract can be.

**Actual Result:**
The Contracts cell holds one entry, `AVP000170` (the creditor-insurance contract). The sale number `AP2494-S-957` does not appear, although the quote's details page shows the sale "#AP2494-S-957".

For comparison, two older quotes **do** show a sale number in the column. On the **Archived** tab (`/quotes/archived`, searched by the client email `ap_automation_test@yopmail.com`), quote 6041 lists "APOP01-663" and "ContractNumber_12345", and quote 6040 lists "APOP01-671" and "11111" — in each case a warranty contract number followed by the sale number. Both of those quotes are archived and carry a generated extended-warranty contract; quote 6480 is on the Active tab and has no warranty. The warranty statuses, as recorded in the execution log (the cropped screenshots do not show them), are APOP01-671 "Pending approval" and APOP01-663 "Cancelled" ("Warranty created in error"). So the list may show a sale number only when the quote has a warranty contract, or only once the quote is archived — this run cannot tell which.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-SalesContractMissingInCell_fail.png` — quote 6480's row on `/quotes`: Contracts cell shows only "AVP000170" |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step2-Quote6480SaleSectionAP2494-S-957_fail.png` — `/quote/6480/details`: Sale "#AP2494-S-957 · Sales rep: QA Agent · Edit sale"; Extended warranty "- None Selected -"; Creditors insurance AVP000170 |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_010-step4-Archived6040And6041ContractsCells_fail.png` — Archived tab: quote 6041 "APOP01-663 / ContractNumber_12345", quote 6040 "APOP01-671 / 11111" |
| Console log | None captured. No error page at any step |

**Suggested Root Cause:**
Unknown — for dev investigation. The cell may take the sale number only from a quote that has a warranty contract (or only on archived quotes), rather than from the saved sale itself.

**Notes:**
- **Tested on: Dev (v2dev).**
- **Question for the product owner (Q-003): should a sale contract number appear in the Contracts column as soon as the sale is saved, or only once the quote has a warranty contract / is archived (as on quotes 6040 and 6041)?** The ticket description says the column lists the quote's "finalized" contract, while the acceptance criteria say "generated". If a sale is meant to show only with a warranty or after archiving, please say so in a comment and the QA test case will be corrected.
- Relates to AP-2494 (Quotes list: replace "Produits" with "Contracts" and add quote search), where the failing test case ran.
- Test data left on Dev: quote 6480 (`client.stage.957@yopmail.com`) with financing, Chubb creditor contract AVP000170 (created through Chubb's development API), a roadside product saved without a contract, and sale `AP2494-S-957`.

---

### BUG-002 — Opening the roadside "Generate Contract" page of a quote returns an HTTP 500 error page

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2494_005 (step 2) and AP2494_008 (step 2) — both BLOCKED at a precondition; also blocks AP2494_012, which needs the AP2494_005 roadside contract |
| **Requirement** | Not an AP-2494 requirement — AP-2494 AC 3 ("Given a quote with generated roadside, GAP or creditor-insurance contracts … the "Contracts" column shows each of those contract") cannot be checked for roadside because no roadside contract can be generated |
| **Severity** | High — the dealer cannot create a roadside protection contract on the affected quotes at all: the page fails with a technical-error page, and from the quote's ⋯ menu the dialog never loads |
| **Priority** | P2 — fix in the current release; it blocks three AP-2494 test cases and any roadside contract on the affected quotes |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · app version not exposed |
| **Tracker Ticket** | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) — Bug, priority High, labels qa-agent / stlc-automated, status Backlog, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2494 and Relates → AP-2508 (no comment posted on AP-2508); 3 screenshots embedded in the description (verified: 3 media nodes with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — 4 of 4 tries on two quotes: 3 on quote 6479 (by URL, by the ⋯ menu, and by URL again after changing the Policy Sale price to 200) and 1 on quote 6480 (by URL) |

**Summary:**
On Dev (v2dev), after a roadside protection product is saved on a quote, opening its contract page `/quote/{id}/road-side-protection-create-contract` returns HTTP 500 and the French technical-error page "Erreur — Désolé, l'application éprouve des difficultés techniques"; from the roadside row's ⋯ menu → **Generate Contract** the dialog stays on "Loading..." and the browser console logs a 500 from the same URL.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in to the Dealer portal with the QA dealer account (Dealer ID 1380).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and click **Create quote**. Fill the client form: Email `client.stage.956@yopmail.com` (any unused address), First name `Roadie`, Last name `Contrat-956`, Address `100 rue Principale`, City `Montréal`, Province "Québec", Postal code `H2X 1Y4`, Tel. home and Tel. work `5145550101`, tick the "I agree" box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved". (Skip this step and use quote 6479 or 6480, which already carry a saved roadside product, if they still exist.)
3. Open `/quote/{id}/road-side-protection`. Note the warning on the page: "There's already a contract created for the same VIN. Contract #2697, 2698". Choose the tier **Protection Hasards PNEU + ROUE | Standard | 12 months | 200$**, type **Policy Sale price** `25000`, and click **Save**. The alert "The Roadside protection coverage has been saved successfully" appears.
4. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/road-side-protection-create-contract` (on quote 6479: `/quote/6479/road-side-protection-create-contract`). **← wrong result:** HTTP 500 and the page "Erreur — Désolé, l'application éprouve des difficultés techniques".
5. Go back to `/quote/{id}/details`, open the **⋯** menu of the Roadside Protection row and click **Generate Contract**. **← wrong result:** the dialog stays on "Loading..." and the browser console logs a 500 response from `/quote/{id}/road-side-protection-create-contract`.
6. Optional: open `/quote/{id}/road-side-protection` again, change **Policy Sale price** to `200`, click **Save**, and repeat step 4 — HTTP 500 again.

**Expected Result:**
The roadside contract page opens and lets the dealer generate the roadside protection contract for the saved product; after generation the quote shows a roadside contract number. If a roadside contract cannot be created for this VIN (for example because contracts #2697 and #2698 already exist for it), the page should say so in a message, not fail with a technical-error page.

**Actual Result:**
Every attempt fails: HTTP 500 with the French technical-error page when the URL is opened, and a dialog stuck on "Loading..." (with a 500 in the console) when the ⋯ menu is used. The roadside product stays saved on the quote without a contract. Seen on quotes 6479 and 6480, whatever the Policy Sale price (25000 or 200).

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_005-step2-RoadsideGenerateContractHttp500_fail.png` — quote 6479: technical-error page at `/quote/6479/road-side-protection-create-contract` |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_005-step2-RoadsideModalStuckLoading_fail.png` — quote 6479: the ⋯ → Generate Contract dialog stuck on "Loading..." |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2494/AP2494_008-step2-RoadsideGenerateContractHttp500_fail.png` — quote 6480: the same technical-error page at `/quote/6480/road-side-protection-create-contract` |
| Console log | 500 response from `/quote/{id}/road-side-protection-create-contract` when the ⋯ dialog loads (text of the server error not shown to the user) |

**Suggested Root Cause:**
Unknown — for dev investigation. Both quotes were on vehicle 915, whose roadside page warns "There's already a contract created for the same VIN. Contract #2697, 2698". The existing roadside contracts on the same VIN are a possible cause, not confirmed — a quote on a VIN with no roadside contract was not tried.

**Notes:**
- **Tested on: Dev (v2dev).**
- **Relates to AP-2508**, which covers the same roadside page family but a different behaviour: AP-2508 reports that the roadside page shows **no** "Generate Contract" button and that no error and no HTTP 500 appear. Here the contract route is reached (by URL and from the row's ⋯ menu) and fails with HTTP 500.
- Relates to AP-2494 (Quotes list: replace "Produits" with "Contracts" and add quote search): this error blocks its test cases AP2494_005, AP2494_008 and AP2494_012, which need a generated roadside contract.
- Test data left on Dev: quote 6479 (`client.stage.956@yopmail.com`, roadside product saved, Policy Sale price 200, no contract) and quote 6480 (`client.stage.957@yopmail.com`, roadside product saved, Policy Sale price 25000, no contract).

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2494_005, AP2494_008, AP2494_012 (BLOCKED) |
| Medium | 1 | AP2494_010 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — "Produits" replaced by "Contracts" on both tabs | 0 | — |
| REQ-002 — Contracts column lists each generated contract | 2 | BUG-001 (AC 4, sale); BUG-002 (blocks the AC 3 roadside, AC 3/6 multi-contract and AC 6 checks) |
| REQ-003 — Search by quote name | 0 | — |
| REQ-004 — Search by client details | 0 | — |
| REQ-005 — Search by VIN | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-02 (2026-11-01T21:16Z UTC)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2517 | Filed by stlc-bug-reporter (s5); linked Relates → AP-2494; assigned to Ken Nguyen | Backlog | 2026-11-02 |
| BUG-002 | AP-2518 | Filed by stlc-bug-reporter (s5); linked Relates → AP-2494 and Relates → AP-2508; assigned to Ken Nguyen | Backlog | 2026-11-02 |
| — | AP-2494 | s7 Gate D: story result comment posted (id 19450, read back: 1 table of 19 cases); not moved — pass rate 74% (needs 90%) and AP-2518 (High) blocks AP2494_005, _008, _012; assignee unchanged. No action on AP-2517 / AP-2518 (Backlog, not in the QA status) | QC (unchanged) | 2026-11-02 |

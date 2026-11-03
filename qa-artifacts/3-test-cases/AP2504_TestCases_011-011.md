# Test Cases — AP2504 (File 3 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2504 — Generate contract for a quote's GAP/Creditor Insurance product
**Source:** requirements/AP-2504-generate-contract-for-a-quotes-gap.md · qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2504_test-plan.md
**Date:** 2026-11-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2504_011 to AP2504_011 (1 test case)
**Coverage:** Functional · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`. Page under test: `/quote/{id}/insurance/create-contract` (creditor) | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | On `/quote/{id}/details`, "Summary of products" → **Creditors insurance** row → **"⋯"** dropdown: **Edit · Generate Contract · Delete**; creditor route `/quote/{id}/insurance/create-contract`. A product with a contract has no "⋯" — only the contract number and a PDF link | `domain` (quote-creation.md, Dev AP-2493 section) |
| **Contract list** | Dealer sidebar → Contracts → Creditors insurance `/creditor-insurance-contracts` | `navigation` |
| **Creditor baseline (before AP-2504)** | Submit **"Generate Contract"** → flash "Chubb insurance contract created successfully" (~8 s); a contract number such as `AVP000169` replaces the row's "⋯". The Chubb creditor PDF `/quote/{id}/chubb/insurance/contract-pdf` returned **HTTP 500** on Dev for quote 6480 (2026-11-02). A stale Chubb quote is refused with a banner "HTTP/2 400 returned for '…/contract' … Contract date entered was at least 10 days older than the original quote date" — search by role `alert` or the text "HTTP" | `domain` (quote-creation.md, chubb-insurance.md §5) |
| **Viewport** | 1280 × 800 | `navigation` / registry `admin_viewport` |
| **Environment** | **Dev** (v2dev) — dealer portal URL from the `env` source's "Dev Environment" section. Write "Environment: Dev" in the execution log header | `env`, registry `execution_env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source's Dev section; the password is read there at run time and never written into the log | `env` |
| **Test data** | Vehicle **915** on Dev — Ford Focus 2008, VIN `1FAHP35NX8W239204` — only as the source of the new quote (never edited). Quotes and contracts of other tickets are never used | `test-data` |
| **Language** | EN for every judgement (`?_locale=en`) | `domain` (quote-creation.md) |
| **Leaves behind** | **One real Chubb creditor contract** (quote E), its client and quote; contract number and any invoice id written into the execution log. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — client and quote.** Open `/vehicle/915/details?_locale=en`, click
**Create quote**, then: First name `Contract`, Last name as given in the case, Email
`client.stage.2504NNN@yopmail.com` (`NNN` = the case number), Address `200 Rue Test`, City
`Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone
`5145550202`, "I agree to the policy" ticked → **Save**. Record the quote id.

**Shared build values — financing.** Open `/quote/{id}/financing`: Date of birth
`1985-06-15`, Province `Québec`, Type "Financing", Net amount financed `25000`, Residual
`0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company
the **first company listed** (record its name) → **Save**. Expected: flash "Financing
saved".

**Shared build values — creditor quote.** Open `/quote/{id}/insurance?_locale=en` as a
page: leave any "Financing" block as it is; in "Creditors Insurance Quote" set Language
"English", Tax exempt "No", Form "Monthly Premium PM30", Life type "Decreasing", Life term
`60`, Life for "Borrower", leave Critical illness and Disability unset → **Get Quote**.
Expected: flash "Chubb insurance quote saved successfully"; the "Creditors insurance" row
shows a monthly premium and a "⋯" menu.

**Known defects on the setup path** (filed for AP-2499, all open): **AP-2526**, **AP-2527**,
**AP-2528** — defects of the GAP / creditors **add modal**. The setup opens the routes as
pages to stay clear of them; a setup still stopped by one of them is **BLOCKED** naming the
bug, never FAIL. A login failure, timeout or HTTP 5xx before the step under test is BLOCKED
(environment), after one retry.

**Known blockers** — None at design time.

> AP2504_011 ships as `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2504_011 | Clicking "Generate Contract" on the creditor contract page creates the creditor insurance contract for the quote | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2504_011 — Clicking "Generate Contract" on the creditor contract page creates the creditor insurance contract for the quote

| Field | Value |
|---|---|
| **TC ID** | AP2504_011 |
| **Title** | Clicking "Generate Contract" on the creditor contract page creates the creditor insurance contract for the quote |
| **Requirement** | AP2504 — REQ-005: Note "For Creditor Insurance, the process is similar to GAP …"; with REQ-004 AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process" and description "Contract creation, invoice, financing, and PDF behaviour stay unchanged" |
| **Route** | `/quote/{id}/insurance/create-contract` → submit |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** Creditor contracts already worked on Dev before this change (contracts
AVP000169 and AVP000170 were created on 2026-11-02). Moving the action to a dedicated page
must not break that. The case judges that a contract is created and records the message,
invoice and PDF against the recorded baseline; the creditor PDF already returned HTTP 500 on
Dev before this change, so a PDF failure is recorded for Gate C, not judged here.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote E from AP2504_010, if its Creditors insurance row still offers "Generate Contract"; otherwise build one (last name `Owner2504-011`, email `client.stage.2504011@yopmail.com`, shared financing and creditor quote, all today) |
| Value for any required field the page leaves empty | Text `Test2504`, phone `5145550211`, postal code `H2X 1Y4`, the first option of a drop-down (each recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote E from AP2504_010 if its Creditors insurance row still shows a "⋯" menu with "Generate Contract" and its creditor quote was saved today; otherwise build a quote from vehicle 915 with the shared client values (last name `Owner2504-011`), the shared financing and the shared creditor quote | A quote with a creditor quote and no creditor contract exists; its id and premium are recorded |
| 2 | Open the Creditors insurance row's "⋯" menu → **"Generate Contract"**; on `/quote/{id}/insurance/create-contract` fill only a field the page marks required and leaves empty (test values above, recorded) | The page loads in the same tab without an error page or HTTP 5xx |
| 3 | Click **"Generate Contract"** and wait up to 30 seconds | No error page, no HTTP 5xx and no `alert` banner containing "HTTP" or an error from the contract service. Record the address landed on and the flash message (baseline: "Chubb insurance contract created successfully") |
| 4 | [Verification] Open `/quote/{id}/details` and read the "Creditors insurance" row; then open `/creditor-insurance-contracts` | A creditor contract exists for the quote: the Creditors insurance row shows a contract number (e.g. `AVP000…`) instead of the "⋯" menu, or `/creditor-insurance-contracts` lists a contract for client `Contract` + the recorded last name. Record the contract number |
| 5 | [Verification] Record any invoice line or link for the creditor contract and open its PDF link if one is shown | Record-only (Q-008, Q-009): invoice id and amount if any; the PDF address and response (status, content type, page count). A PDF returning HTTP 500 is recorded with its address for comparison with the 2026-11-02 observation on quote 6480 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — description: GAP action opens a dedicated page; route unchanged | AP2504_001 | — | AP2504_009 | AP2504_001 |
| REQ-001 — AC 1 as written (Extended Warranty row) | AP2504_002 (BLOCKED, Q-001) | — | — | — |
| REQ-002 — AC 2 layout | AP2504_003 | — | AP2504_004 | — |
| REQ-003 — AC 3 pre-fill (vehicle, owner, co-owner) | AP2504_005 | — | AP2504_004 | — |
| REQ-003 — AC 3 financing pre-filled and read-only | AP2504_006 | AP2504_006 | — | — |
| REQ-004 — AC 4 submit creates the contract | AP2504_007 | AP2504_008 | — | AP2504_007 |
| REQ-005 — Note: creditor page and contract | AP2504_010 | — | — | AP2504_011 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2504_011 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_011-step4-CreditorRowContractNumber_pass.png` |

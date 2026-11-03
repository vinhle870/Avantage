# Test Cases — AP2504 (File 2 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2504 — Generate contract for a quote's GAP/Creditor Insurance product
**Source:** requirements/AP-2504-generate-contract-for-a-quotes-gap.md · qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2504_test-plan.md
**Date:** 2026-11-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2504_006 to AP2504_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`, the quote page. Pages under test: `/quote/{id}/insurance/create-contract/gap` (GAP) and `/quote/{id}/insurance/create-contract` (creditor) | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | On `/quote/{id}/details` the right-hand card "Summary of products" lists Extended warranty · Roadside Protection · **Gap Insurance** · **Creditors insurance** · Esthetic protection. A saved product without a contract has a chevron and a **"⋯"** dropdown: **Edit · Generate Contract · Delete**. Generate Contract routes on Dev (2026-11-02): GAP `/quote/{id}/insurance/create-contract/gap`, creditor `/quote/{id}/insurance/create-contract`. A product with a contract has no "⋯" — only the contract number and a PDF link | `domain` (quote-creation.md, Dev AP-2493 section) |
| **Contract lists** | Dealer sidebar → Contracts: Gap Insurance `/gap-insurance-contracts` (empty on Dev, 2026-11-02), Creditors insurance `/creditor-insurance-contracts` | `navigation`, `domain` |
| **Creditor baseline (before AP-2504)** | The creditor create-contract page was a long pre-filled form with a **"Generate Contract"** submit → flash "Chubb insurance contract created successfully" (~8 s), contract number (e.g. `AVP000169`) on the Creditors insurance row. The Chubb creditor PDF `/quote/{id}/chubb/insurance/contract-pdf` returned **HTTP 500** on Dev for quote 6480 (2026-11-02). A stale Chubb quote is refused with a banner "HTTP/2 400 returned for '…/contract' … Contract date entered was at least 10 days older than the original quote date" — search by role `alert` or the text "HTTP" | `domain` (quote-creation.md, chubb-insurance.md §5) |
| **Viewport** | 1280 × 800 | `navigation` / registry `admin_viewport` |
| **Environment** | **Dev** (v2dev) — dealer portal URL from the `env` source's "Dev Environment" section. Write "Environment: Dev" in the execution log header | `env`, registry `execution_env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source's Dev section; the password is read there at run time and never written into the log | `env` |
| **Test data** | Vehicle **915** on Dev — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km — only as the source of each new quote (never edited). Every client, quote, financing, GAP / creditor quote and contract is created by the case itself. Quotes and contracts of other tickets are never used | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | AP2504_007 and AP2504_009 create **one real Chubb GAP contract** (quote C); AP2504_008 may create a second one (quote D) if the page accepts the emptied field. Each case's client and quote. Every contract number, quote id and invoice id is written into the execution log. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

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

**Shared build values — GAP quote.** Open `/quote/{id}/gap-insurance?_locale=en` as a page:
leave any "Financing" block as it is; in "Gap Insurance Quote" set Rate table "TGGAP",
Language "English", Tax exempt "No", Gap Term `60` → **Get Quote**. Expected: flash "GAP
insurance quote saved successfully"; the "Gap Insurance" row shows a premium and a "⋯"
menu.

**Shared build values — creditor quote.** Open `/quote/{id}/insurance?_locale=en` as a
page: leave any "Financing" block as it is; in "Creditors Insurance Quote" set Language
"English", Tax exempt "No", Form "Monthly Premium PM30", Life type "Decreasing", Life term
`60`, Life for "Borrower", leave Critical illness and Disability unset → **Get Quote**.
Expected: flash "Chubb insurance quote saved successfully"; the "Creditors insurance" row
shows a monthly premium and a "⋯" menu.

**Known defects on the setup path** (filed for AP-2499, all open): **AP-2526**, **AP-2527**,
**AP-2528** — the GAP / creditors **add modal** folds the financing behind "Edit", draws the
quote page inside the modal on Save, and closes on "Get Quote". The setup above opens the
routes as pages to stay clear of them. If a setup step is still stopped by one of these
defects, mark the case **BLOCKED** naming the bug — never FAIL. A login failure, timeout,
or HTTP 5xx before the step under test is BLOCKED (environment), after one retry.

**Known blockers** — None at design time for this file.

> No case in this file ships BLOCKED. All five are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2504_006 | The GAP contract page shows the quote's financing values and none of them can be changed | Functional | High | FAIL |
| AP2504_007 | Clicking "Generate Contract" on the GAP page with the pre-filled values creates the GAP contract for the quote | Functional | High | PASS |
| AP2504_008 | Submitting the GAP page with the owner's last name emptied does not end on an error page | Negative | Medium | PASS |
| AP2504_009 | On a quote whose GAP contract already exists, the GAP row and the GAP page address do not end on an error page | Edge-case | Medium | PASS |
| AP2504_010 | Clicking "Generate Contract" on the creditors insurance row opens the creditor contract page in the same tab, not a pop-up | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2504_006 — The GAP contract page shows the quote's financing values and none of them can be changed

| Field | Value |
|---|---|
| **TC ID** | AP2504_006 |
| **Title** | The GAP contract page shows the quote's financing values and none of them can be changed |
| **Requirement** | AP2504 — REQ-003: AC 3 "Given the quote has … a financing, when the page renders, then … financing values are pre-filled and financing is read-only" |
| **Route** | `/quote/{id}/insurance/create-contract/gap` |
| **Type** | Functional · Negative |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** GAP insurance is priced on the loan, so a financing value changed on
the contract page would put a different loan on the contract than the one quoted. The
criterion says the financing is pre-filled and read-only, but not which fields the
"Financing information" section holds — the loan terms, the financing company, or both
(Q-005). The case therefore judges **every** field the section shows: each must carry the
stored value and refuse a change. The list of fields is recorded. Nothing is submitted.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2504_001 (financing 25000 / 0 / Monthly / 60 / 6.99 / recorded company), if its Gap Insurance row still offers "Generate Contract"; otherwise build one (last name `Owner2504-006`, email `client.stage.2504006@yopmail.com`, shared financing and GAP quote) |
| Value typed into each field | `99999` for amounts, terms and rates; `Edited2504` for text fields; any other option for a drop-down |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote A from AP2504_001 if its Gap Insurance row still shows "Generate Contract"; otherwise build a quote from vehicle 915 with the shared client values (last name `Owner2504-006`), the shared financing and the shared GAP quote | A quote with a financing and a GAP quote, no GAP contract; its id and the financing company are recorded |
| 2 | Open `/quote/{id}/insurance/create-contract/gap` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Read the "Financing information" section | Every financing value shown matches the stored financing: amount financed `25000` (in any number format), residual `0`, frequency "Monthly", term `60`, rate `6.99`, the recorded financing company and, where shown, that company's own name, address, city, province and postal code. None is empty where the financing holds a value, none is different. Record the list of fields shown (Q-005) |
| 4 | For each field of the "Financing information" section in turn: click into it and type the test value (or pick another option, or open its date picker / company picker) | No field accepts a change: each is shown as plain text, or as a disabled / read-only control, and still shows the value read in step 3. A field whose value changes FAILs this step — record which field and the value it shows |
| 5 | [Verification] Inspect the "Financing information" section without clicking "Generate Contract" | Every financing field still shows the value read in step 3. Leave the page without submitting, open `/quote/{id}/details` and record that the quote's financing still reads 25,000 / 60 months |

---

### AP2504_007 — Clicking "Generate Contract" on the GAP page with the pre-filled values creates the GAP contract for the quote

| Field | Value |
|---|---|
| **TC ID** | AP2504_007 |
| **Title** | Clicking "Generate Contract" on the GAP page with the pre-filled values creates the GAP contract for the quote |
| **Requirement** | AP2504 — REQ-004: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process"; description "Contract creation, invoice, financing, and PDF behaviour stay unchanged" |
| **Route** | `/quote/{id}/insurance/create-contract/gap` → submit |
| **Type** | Functional · Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** Creating the contract is what the dealer comes to the page for, and it
produces the insurance document the client signs. No GAP contract has ever been created on
Dev, so "the current process" has no observed baseline (Q-008): the case judges only that a
contract exists afterwards and records the landing page, message, invoice and PDF. The
pre-filled values are the "valid form values" — this case built the quote with complete
client, vehicle and financing data, so nothing needs typing; if the page still marks a field
required and empty, the value used is recorded. This creates a real Chubb GAP contract
(quote C), which AP2504_009 reuses.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2504-007` |
| Client email | `client.stage.2504007@yopmail.com` |
| Financing / GAP quote | Shared values, saved the same day as the submit |
| Value for any required field the page leaves empty | Text `Test2504`, phone `5145550207`, postal code `H2X 1Y4`, the first option of a drop-down (each recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`), build quote C from vehicle 915 with the shared client values (last name `Owner2504-007`), the shared financing and the shared GAP quote (all today) | The quote page shows the financing and a Gap Insurance row with a premium and a "⋯" menu, no contract number; the quote id (quote C) and the premium are recorded |
| 2 | Open the Gap Insurance row's "⋯" menu → **"Generate Contract"**; on `/quote/{id}/insurance/create-contract/gap` fill only a field the page marks required and leaves empty (test values above, recorded) | The page loads without an error page or HTTP 5xx; the fields filled, if any, are recorded |
| 3 | Click **"Generate Contract"** and wait up to 30 seconds for the response | No error page, no HTTP 5xx, and no `alert` banner containing "HTTP" or an error from the contract service. Record the address landed on and the flash message shown (Q-008) |
| 4 | [Verification] Open `/quote/{id}/details` and read the "Gap Insurance" row; then open `/gap-insurance-contracts` | A GAP contract exists for quote C: the Gap Insurance row shows a contract number (instead of the "⋯" menu with "Generate Contract"), or `/gap-insurance-contracts` lists a contract for client `Contract Owner2504-007`. Record the contract number and the list row |
| 5 | [Verification] On the quote page, record any invoice line or link for the GAP contract and open the GAP contract's PDF link if one is shown | Record whether an invoice was created (id, amount) and the PDF address and response (status, content type, page count) — record-only (Q-008, Q-009); a PDF returning HTTP 500 is recorded with its address for comparison with the creditor PDF's HTTP 500 at Gate C |

---

### AP2504_008 — Submitting the GAP page with the owner's last name emptied does not end on an error page

| Field | Value |
|---|---|
| **TC ID** | AP2504_008 |
| **Title** | Submitting the GAP page with the owner's last name emptied does not end on an error page |
| **Requirement** | AP2504 — REQ-004: AC 4 "Given valid form values, when the dealer submits, then contract is created" (its negative side: the response to a value that may not be valid) |
| **Route** | `/quote/{id}/insurance/create-contract/gap` → submit |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** The ticket defines only "valid form values"; which fields are required
and what the page shows for a missing one are not stated (Q-007). The case therefore
records the response to an emptied last name and fails only on an objective fault — an
error page, an HTTP 5xx, or a contract or quote client whose values differ from what was
on the page. If the page accepts the submit, a second real GAP contract (quote D) is left
on Dev and recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2504-008` |
| Client email | `client.stage.2504008@yopmail.com` |
| Field emptied | "Owner information" → Last name (the owner's last-name field; record its label) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`), build quote D from vehicle 915 with the shared client values (last name `Owner2504-008`), the shared financing and the shared GAP quote (all today) | The Gap Insurance row shows a "⋯" menu; the quote id (quote D) is recorded |
| 2 | Open `/quote/{id}/insurance/create-contract/gap`; in "Owner information" clear the Last name field | The page loads without an error page or HTTP 5xx; the Last name field is empty. If Last name cannot be edited, record that (Q-006) and clear instead the first owner field that can be edited and is marked with "*" (record its label); if no owner field can be edited, record it and go to step 4 without submitting |
| 3 | Click **"Generate Contract"** and wait up to 30 seconds | No error page and no HTTP 5xx. Record exactly what happens: a browser "required" tooltip, a message on the page (text and position), a banner, or a redirect with a flash (Q-007) |
| 4 | [Verification] Open `/quote/{id}/details` and read the "Gap Insurance" row and the client name | Record whether a GAP contract now exists (contract number, or "⋯" still offering "Generate Contract") and the client's last name. Whether an emptied value reaches the quote's client is open (Q-006) and is only recorded. FAIL only if the client's last name is now a value that is neither `Owner2504-008` nor empty — a value nobody entered — or an error page appeared |

---

### AP2504_009 — On a quote whose GAP contract already exists, the GAP row and the GAP page address do not end on an error page

| Field | Value |
|---|---|
| **TC ID** | AP2504_009 |
| **Title** | On a quote whose GAP contract already exists, the GAP row and the GAP page address do not end on an error page |
| **Requirement** | AP2504 — REQ-001: AC 1 "Given a quote with a GAP insurance quote and no contract" (the opposite case — a contract exists — is not stated: Q-010) |
| **Route** | `/quote/{id}/details` → `/quote/{id}/insurance/create-contract/gap` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** A dealer who reaches the GAP page again after the contract was made
could create a second contract for the same loan, or hit an error. What should happen is
not stated (Q-010), so the case records what the row and the address show, and fails only
on an error page or HTTP 5xx. It does not submit again.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote C from AP2504_007, if its GAP contract was created; otherwise build one (last name `Owner2504-009`, email `client.stage.2504009@yopmail.com`, shared financing and GAP quote) and generate its GAP contract with the pre-filled values |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote C from AP2504_007 if its Gap Insurance row shows a contract number; otherwise build a quote from vehicle 915 with the shared client values (last name `Owner2504-009`), the shared financing and GAP quote, open its GAP "Generate Contract" page and click **"Generate Contract"** | The quote's Gap Insurance row shows a contract number; the quote id and contract number are recorded. If no contract can be created, the case is BLOCKED naming AP2504_007's result |
| 2 | [Verification] On `/quote/{id}/details` inspect the Gap Insurance row | Record whether a "⋯" menu or a "Generate Contract" action is still offered, and what the row shows (contract number, PDF link) (Q-010) |
| 3 | Type `/quote/{id}/insurance/create-contract/gap` into the address bar and press Enter | No error page and no HTTP 5xx. Record what is shown: the form again, a message that the contract exists, or a redirect (address and flash) (Q-010). Do not click "Generate Contract" |
| 4 | [Verification] Open `/quote/{id}/details` again | The Gap Insurance row still shows the same contract number as in step 2 — no second contract number and no change to the first |

---

### AP2504_010 — Clicking "Generate Contract" on the creditors insurance row opens the creditor contract page in the same tab, not a pop-up

| Field | Value |
|---|---|
| **TC ID** | AP2504_010 |
| **Title** | Clicking "Generate Contract" on the creditors insurance row opens the creditor contract page in the same tab, not a pop-up |
| **Requirement** | AP2504 — REQ-005: Note "For Creditor Insurance, the process is similar to GAP except the dealer will be redirected to `/quote/{quoteId}/insurance/create-contract` when clicking on “Generate contract”" |
| **Route** | `/quote/{id}/details` → Creditors insurance "⋯" → "Generate Contract" → `/quote/{id}/insurance/create-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** The note extends the change to creditor insurance and names its own
address. "Similar to GAP" is judged on the points the GAP criterion 1 states — a dedicated
page in the same tab, no modal — plus the named address. Whether the creditor page shows
the same sections, pre-fill and read-only financing as the GAP page is not stated (Q-011),
so it is recorded. The quote built here (quote E) is submitted by AP2504_011.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2504-010` |
| Client email | `client.stage.2504010@yopmail.com` |
| Financing / creditor quote | Shared financing; shared creditor quote (English, No, PM30, Decreasing / `60` / Borrower) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`), build quote E from vehicle 915 with the shared client values (last name `Owner2504-010`) and the shared financing on `/quote/{id}/financing` | The quote page shows the financing; the quote id (quote E) is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/insurance?_locale=en` as a page and save the shared creditor quote (English, No, PM30, Decreasing / `60` / Borrower) → **Get Quote** | Flash "Chubb insurance quote saved successfully"; the "Creditors insurance" row shows a premium and a "⋯" menu, no contract number. If it cannot be saved because of AP-2526/AP-2527/AP-2528, the case is BLOCKED naming that bug |
| 3 | Note the number of open tabs. Open the **Creditors insurance** row's "⋯" menu and click **"Generate Contract"** | The browser navigates in the **same tab** (tab count unchanged) to `/quote/{id}/insurance/create-contract`; the page loads without an error page or HTTP 5xx |
| 4 | [Verification] Inspect the page | The address is exactly `/quote/{id}/insurance/create-contract` with quote E's id (no `/gap` suffix); the page is a full page — no modal dialog is open and the quote page is not visible behind it; a "Generate Contract" button is on the page. Record the sections in each column, which values are pre-filled and whether the financing fields accept typing, compared with the GAP page (Q-011). Leave the page without submitting |

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
| AP2504_006 | ❌ FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step3-FinancingRawCodesShown_fail.png` |
| AP2504_007 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_007-step4-GapRowContractNumber_pass.png` |
| AP2504_008 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_008-step3-LastNameBlankError_pass.png` |
| AP2504_009 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_009-step3-RedirectFlashCreditorAlreadyCreated_pass.png` |
| AP2504_010 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_010-step4-CreditorContractFullPage_pass.png` |

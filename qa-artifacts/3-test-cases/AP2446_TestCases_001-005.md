# Test Cases — AP2446 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2446 — A Permaplate invoice is created when the contract is created (REQ-004)
**Source:** `requirements/AP-2446-permaplate-invoice.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2446_001 to AP2446_005 (5 test cases)
**Coverage:** Functional · Negative · Regression · UI

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quote/{id}/permaplate` to create the contract, `/invoice` for the invoices index | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal, `vinhle870@gmail.com` / `<password from the env source>` at `/login` | `env` |
| **Test data** | Dealer ID `1380`. Vehicle `915`, VIN `1FAHP35NX8W239204`, a 2008 Ford Focus. Billing routes: Invoices `/invoice`, Payment history `/invoice/payment-history`. | `test-data`, `navigation` |
| **Language** | English | `navigation` |
| **Leaves behind** | A Permaplate contract and its invoice on Dealer 1380, plus the client and quote that carry them. The project has no cleanup procedure, so all of it stays on staging. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | What amount the Permaplate invoice should carry — cost price, retail price, with or without taxes. Nothing in AP-2446 or AP-2456 says. | AP2446_003 | Open — Q-005 |
| 2 | What the warranty contract-to-invoice flow actually does. Three of the four criteria define correctness by pointing at it rather than describing it. | AP2446_002, AP2446_005 | Open — Q-004, partly answered by AP2446_005 itself |
| 3 | The control that turns a Permaplate quote into a Permaplate contract has never been mapped. The navigation map records the "Permaplate Quote" page with a **Save** button but no contract-generation control, unlike the Road Side Protection page which has "Save and Generate Contract". | AP2446_001 | Open — new, resolved by exploration in AP2446_001 |

> AP2446_003 ships **BLOCKED**: without Q-005 nobody has said what number should appear, so
> the amount can be recorded but not judged. The other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2446_001 | Creating a Permaplate contract from a saved quote raises a Permaplate invoice automatically | Functional | High | PASS |
| AP2446_002 | An alert telling the dealer an invoice has been created appears when the Permaplate contract is made | Functional | High | PASS |
| AP2446_003 | The Permaplate invoice carries the correct amount for the options that were sold | Functional | High | PASS |
| AP2446_004 | The Permaplate invoice appears in the dealer's Invoices page and can be taken to the payment screen | Functional | High | PASS |
| AP2446_005 | Creating a warranty contract still raises its invoice exactly as it did before Permaplate was added | Regression | High | SKIPPED |

> **Re-tested 2026-09-13** following Ken Nguyen's fix confirmation on the ticket (AP-2459, AP-2460, AP-2461). See
> `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`. AP2446_003 moved from FAIL to PASS:
> the wrong-contract-number defect (AP-2461) is fixed, and the amount-messaging concern (AP-2460) is confirmed
> intended behaviour, not a defect. AP2446_005 stays SKIPPED for a new reason — see that log.

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2446_001 — Creating a Permaplate contract from a saved quote raises a Permaplate invoice automatically

| Field | Value |
|---|---|
| **TC ID** | AP2446_001 |
| **Title** | Creating a Permaplate contract from a saved quote raises a Permaplate invoice automatically |
| **Requirement** | AP2446 — criterion 1 |
| **Route** | `/quote/{id}/permaplate`, then `/invoice` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-13 (originally 2026-09-06) |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`. Re-run with Financing company left blank confirms **AP-2459 (HTTP 500) is fixed** |

**Why this matters:** This is the requirement that moves money. If the contract is created
without an invoice, the dealer receives the product and is never billed for it, and nothing
on any screen tells anyone that the charge is missing. The business simply loses the revenue.
This case also creates the contract that AP2443, AP2448, AP2445 and AP2456 all reuse, so the
contract number it produces must be written into the execution log.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | `vinhle870@gmail.com` / `<password from the env source>` at `/login` |
| Client, created by this case | First name `Perma`, last name `Invoice`, email `perma.invoice.0906@yopmail.com`, address `220 Boulevard Saint-Laurent`, city `Montreal`, province `Québec`, postal code `H2Y 1Z4`, home phone `5145550200`, work phone `5145550201`, policy-agreement checkbox ticked |
| Vehicle | The inventory option whose VIN is `1FAHP35NX8W239204` |
| Permaplate product | The product linked to Dealer 1380 in AP2447_002 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login`, open `/quote/new/client`, and create a client with first name `Perma`, last name `Invoice`, email `perma.invoice.0906@yopmail.com`, address `220 Boulevard Saint-Laurent`, city `Montreal`, province `Québec`, postal code `H2Y 1Z4`, home phone `5145550200`, work phone `5145550201`, policy-agreement checkbox ticked → **Save** | The quote is created and the browser lands on `/quote/{id}/details`. The quote ID is recorded in the execution log |
| 2 | [Pre-Condition] Open `/quote/{id}/vehicle`, select the vehicle with VIN `1FAHP35NX8W239204`, set a delivery date and price → **Save**. Then open `/quote/{id}/permaplate`, select the Permaplate product linked in AP2447_002 and tick at least one option → **Save** | The vehicle is attached and the Permaplate selection is saved. The exact product and options chosen are recorded, because the invoice amount depends on them |
| 3 | Note the current number of rows on `/invoice`, then return to the Permaplate area of the quote and use the control that generates the Permaplate contract. Record the control's exact label and the route it posts to | The contract is created. Record the contract number shown and write it into the execution log for reuse by AP2443, AP2448, AP2445 and AP2456 |
| 4 | [Verification] Open `/invoice` and confirm a new invoice row has appeared that relates to this Permaplate contract, naming the client `Perma Invoice` | The Invoices page has one more row than at step 3, and the new row is for the Permaplate contract just created. If no new invoice exists, this is a failure of criterion 1 and the highest-severity finding available in this cycle |

---

### AP2446_002 — An alert telling the dealer an invoice has been created appears when the Permaplate contract is made

| Field | Value |
|---|---|
| **TC ID** | AP2446_002 |
| **Title** | An alert telling the dealer an invoice has been created appears when the Permaplate contract is made |
| **Requirement** | AP2446 — criterion 2 |
| **Route** | `/quote/{id}/permaplate` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-13 (originally 2026-09-06) |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`. Alert still reads "Invoice #___ ($145) is created" — confirmed intended per Ken Nguyen's 2026-09-08 comment |

**Why this matters:** The alert is the only moment the dealer is told that a charge has been
raised against them. Without it a dealer can create several contracts believing nothing has
been billed, and discover the invoices only when payment is chased. The criterion says the
alert must work "the same way as a warranty contract invoice", so this case records the
Permaplate message and AP2446_005 records the warranty one for comparison.

**Test Data:**

| Variable | Value |
|---|---|
| Client, created by this case | First name `Perma`, last name `Alert`, email `perma.alert.0906@yopmail.com`, address `330 Rue Sherbrooke`, city `Montreal`, province `Québec`, postal code `H3A 1B9`, home phone `5145550300`, work phone `5145550301`, policy-agreement checkbox ticked |
| Vehicle | The inventory option whose VIN is `1FAHP35NX8W239204` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, create a quote at `/quote/new/client` for client `Perma Alert`, email `perma.alert.0906@yopmail.com`, address `330 Rue Sherbrooke`, city `Montreal`, province `Québec`, postal code `H3A 1B9`, home phone `5145550300`, work phone `5145550301`, policy checkbox ticked → **Save**, then attach the vehicle with VIN `1FAHP35NX8W239204` at `/quote/{id}/vehicle` → **Save** | A second quote exists with a client and a vehicle. Its ID is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/permaplate`, select the linked Permaplate product and tick at least one option → **Save** | The Permaplate selection saves |
| 3 | Use the contract-generation control identified in AP2446_001, and watch the page immediately after it responds | A message appears. Capture a screenshot of it before it fades, since alert banners on this product disappear on the next page load |
| 4 | [Verification] Confirm the message tells the user an invoice has been created, and record its exact wording | A visible alert names the invoice. Its exact text is written into the execution log so it can be compared with the warranty equivalent recorded in AP2446_005 |

---

### AP2446_003 — The Permaplate invoice carries the correct amount for the options that were sold

| Field | Value |
|---|---|
| **TC ID** | AP2446_003 |
| **Title** | The Permaplate invoice carries the correct amount for the options that were sold |
| **Requirement** | AP2446 — criterion 1, read together with AP2456 criterion 4 |
| **Route** | `/invoice` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (Q-005 answered: the invoice carries dealer cost plus Quebec taxes, itemized on the invoice's own detail page) |
| **Executed on** | 2026-09-13 (originally 2026-09-06) |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`. Contract-number defect (AP-2461) fixed; amount-messaging (AP-2460) confirmed intended, not a defect |

**Why this matters:** An invoice for the wrong amount is worse than no invoice at all,
because it looks correct and gets paid. If the dealer is billed the retail price rather than
their cost price, they are overcharged on every Permaplate sale, and the error is only found
when someone reconciles the accounts.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The Permaplate contract created in AP2446_001 |
| Prices to compare | The cost price and, if still shown anywhere, the retail price of the product and options selected in AP2446_001 step 2 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/{id}/details` for the quote from AP2446_001, reading the Permaplate section | The Permaplate section shows the product and options that were sold, with whatever prices the page still displays. Record every figure |
| 2 | Open `/invoice` and open the invoice raised for that contract | The invoice detail is shown with its amount and description |
| 3 | [Verification] Record the invoice total, the amounts of each line, and the full text of the description, then compare them against the figures recorded in step 1 | Every figure is recorded and compared. The case is reported **Blocked** rather than Pass or Fail, because no expected amount has been stated. If the invoice total matches neither the cost price nor the retail price of what was sold, that discrepancy is reported as a finding on its own, since it cannot be right under any reading of the ticket |

---

### AP2446_004 — The Permaplate invoice appears in the dealer's Invoices page and can be taken to the payment screen

| Field | Value |
|---|---|
| **TC ID** | AP2446_004 |
| **Title** | The Permaplate invoice appears in the dealer's Invoices page and can be taken to the payment screen |
| **Requirement** | AP2446 — criteria 3 and 4 |
| **Route** | `/invoice` — Billing → Invoices |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-13 (originally 2026-09-06) |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`. Payment route re-confirmed unchanged |

**Why this matters:** An invoice that exists in the database but cannot be found or paid on
screen is, to the dealer, an invoice that does not exist. The test stops at the payment
screen rather than completing a payment, because taking a real payment on staging would
leave a financial record behind — that limit is recorded in the test plan and repeated in
the report.

**Test Data:**

| Variable | Value |
|---|---|
| Invoice | The one raised in AP2446_001 for client `Perma Invoice` |
| Comparison | A warranty invoice already present on `/invoice`, used to compare the payment route |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/invoice` | The Invoices page loads and lists the dealer's invoices |
| 2 | Find the invoice raised for the Permaplate contract from AP2446_001 and record how it is labelled and what its status column says | The Permaplate invoice is present in the list and can be told apart from the warranty invoices |
| 3 | Open the invoice and use whatever control the page offers to pay it, stopping at the point where real payment details would be entered | The payment route opens for the Permaplate invoice. Record every step it goes through |
| 4 | [Verification] Confirm the payment route reached is the same one a warranty invoice uses, by opening a warranty invoice in the same list and comparing the controls and the screens they lead to | The Permaplate invoice reaches the same payment screen as a warranty invoice, satisfying criterion 4 as far as it can be checked without completing a payment. Any difference between the two routes is recorded |

---

### AP2446_005 — Creating a warranty contract still raises its invoice exactly as it did before Permaplate was added

| Field | Value |
|---|---|
| **TC ID** | AP2446_005 |
| **Title** | Creating a warranty contract still raises its invoice exactly as it did before Permaplate was added |
| **Requirement** | AP2446 — criteria 2 and 4, which define correctness by pointing at the warranty flow |
| **Route** | `/quote/{id}/warranty/edit`, then `/invoice` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | SKIPPED |
| **Blocked by** | — |
| **Executed on** | 2026-09-13 (originally 2026-09-06) |
| **Result** | SKIPPED — see `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`. Got past the original date-validation blocker but the warranty contract stayed "Incomplete" with no invoice-raising control found this session |

**Why this matters:** Two things at once. Regression testing means re-running checks on
something that already worked, to prove a change did not break it — and the Permaplate
invoice work touched the shared invoicing code, so the warranty path needs re-proving.
It also answers Q-004: three of AP-2446's four criteria say Permaplate must behave "the same
way" as warranty, and nobody has written down what that way is. This case writes it down.

**Test Data:**

| Variable | Value |
|---|---|
| Client, created by this case | First name `Warranty`, last name `Regression`, email `warranty.reg.0906@yopmail.com`, address `440 Avenue du Parc`, city `Montreal`, province `Québec`, postal code `H2W 1S5`, home phone `5145550400`, work phone `5145550401`, policy-agreement checkbox ticked |
| Vehicle | The inventory option whose VIN is `1FAHP35NX8W239204` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, create a quote at `/quote/new/client` for client `Warranty Regression`, email `warranty.reg.0906@yopmail.com`, address `440 Avenue du Parc`, city `Montreal`, province `Québec`, postal code `H2W 1S5`, home phone `5145550400`, work phone `5145550401`, policy checkbox ticked → **Save**, then attach the vehicle with VIN `1FAHP35NX8W239204` → **Save** | A quote exists with a client and a vehicle, ready for a warranty |
| 2 | Open `/quote/{id}/warranty/edit`, choose a term and at least one component → **Save**, then create the warranty contract using the control the page offers | The warranty contract is created. Record the exact label of the alert message that appears |
| 3 | [Verification] Confirm an invoice for the warranty contract appears on `/invoice`, and record its label, its status and its payment route | The warranty invoice is raised and payable exactly as before. This recorded behaviour becomes the written answer to Q-004 and the comparison baseline for AP2446_002 and AP2446_004 |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — an invoice is created with the contract | AP2446_001, AP2446_003 | — | — | — |
| Criterion 2 — an alert says the invoice was created | AP2446_002 | — | — | AP2446_005 |
| Criterion 3 — the invoice appears on the invoices index page | AP2446_004 | — | — | — |
| Criterion 4 — the invoice is payable like a warranty invoice | AP2446_004 | — | — | AP2446_005 |

**One risk from the analysis has no case here, and that is deliberate.** The requirements
analysis flagged that nothing describes what happens if invoice creation fails after the
contract already exists. There is no way to make invoice creation fail from the screen, so a
test cannot provoke it. It stays an open question for the developer rather than a case that
would sit permanently Blocked.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2446_001 | PASS | see `execution-log_AP-2446_2026-09-13.md` |
| AP2446_002 | PASS | see `execution-log_AP-2446_2026-09-13.md` |
| AP2446_003 | PASS | see `execution-log_AP-2446_2026-09-13.md` |
| AP2446_004 | PASS | see `execution-log_AP-2446_2026-09-13.md` |
| AP2446_005 | SKIPPED | see `execution-log_AP-2446_2026-09-13.md` |

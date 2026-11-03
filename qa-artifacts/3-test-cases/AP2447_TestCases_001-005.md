# Test Cases — AP2447 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2447 — Admin can assign Permaplate products to a dealer (REQ-001)
**Source:** `requirements/AP-2447-admin-assign-permaplate-products.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2447_001 to AP2447_005 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · UI · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin, with one cross-check in the Dealer portal | `navigation` |
| **Entry route** | `/admin/dealer/1380/edit` — Dealer Details for the dealership under test | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin portal, `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The same account signs in to the Dealer portal at `/login`. | `env` |
| **Test data** | Dealer ID `1380`, name *Offical VinhLe870@gmail.com*, company *Test QA staging*, province QC. Search the Dealers list by **email**, not by the company label. | `test-data` |
| **Language** | English. No language-specific behaviour is stated for this story. | `navigation` |
| **Leaves behind** | A Permaplate product linked to Dealer 1380. AP2455_001 removes it at the end of the cycle; until then it stays. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The route of the *Permaplate Products* tab on the Dealer Details page has never been mapped. The navigation map covers `/admin/dealer/{id}/edit` and `/admin/dealer/{id}/chubb-insurance` but no Permaplate tab. The tab is expected to be discoverable from the Dealer Details page itself, so this is a slow start rather than a hard stop. | AP2447_001 | Open — new, resolved by exploration in AP2447_001 step 2 |
| 2 | Whether linking the same product twice to the same dealer should be refused, and with what message, is not stated anywhere in the ticket. | AP2447_004 | Open — Q-011, new |
| 3 | Whether the admin Permaplate product catalogue contains at least one product on staging is unconfirmed. If it is empty, no product can be linked and every case in this file stops. | AP2447_001 – AP2447_005 | Open — confirmed or refuted by AP2447_001 step 3 |

> AP2447_004 ships **BLOCKED** because its expected result is genuinely unknown: the ticket
> never says whether a duplicate link is allowed. The other four cases are `Not Run` — their
> expected results are all written in the acceptance criteria.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2447_001 | The Dealer Details page shows a "Permaplate Products" tab with an "Eligible Permaplate products" heading and a "Link a product" button | Functional | High | PASS |
| AP2447_002 | Linking a Permaplate product to a dealer adds it to the dealer's eligible-products table | Functional | High | PASS |
| AP2447_003 | A product linked by the administrator becomes selectable on that dealer's Permaplate quote page | Functional | High | PASS |
| AP2447_004 | Linking the same Permaplate product to the same dealer twice is handled without creating a confusing duplicate row | Negative | Medium | PASS |
| AP2447_005 | Saving the link modal with no product chosen is refused instead of creating an empty link | Negative | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2447_001 — The Dealer Details page shows a "Permaplate Products" tab with an "Eligible Permaplate products" heading and a "Link a product" button

| Field | Value |
|---|---|
| **TC ID** | AP2447_001 |
| **Title** | The Dealer Details page shows a "Permaplate Products" tab with an "Eligible Permaplate products" heading and a "Link a product" button |
| **Requirement** | AP2447 — criteria 1, 2 and 3 |
| **Route** | `/admin/dealer/1380/edit` — Dealer Details |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the first case in the whole Permaplate cycle. If the tab is
not there, an administrator has no way to give a dealer permission to sell the product, and
every other story in the set becomes unreachable. The test plan makes a failure here a
reason to suspend the cycle rather than carry on collecting Blocked results.

**Test Data:**

| Variable | Value |
|---|---|
| Admin login | `vinhle870@gmail.com` / `<password from the env source>` |
| Dealer under test | ID `1380`, company *Test QA staging* |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login` with `vinhle870@gmail.com` / `<password from the env source>`, then open `/admin/dealer/1380/edit` directly by URL | The Dealer Details page for Dealer 1380 loads and shows the dealership's own fields |
| 2 | Find and click the tab labelled "**Permaplate Products**" on the Dealer Details page. Record the URL it opens, because this route is not yet in the navigation map | The Permaplate Products tab opens and its URL is recorded for the rest of the cycle |
| 3 | [Verification] Confirm the page shows a navigation heading reading exactly "**Eligible Permaplate products**", a button labelled "**Link a product**", and a table of linked Permaplate products. Record whether that table is empty and, if it is, what it says in place of rows | The heading reads "Eligible Permaplate products", the "Link a product" button is visible and clickable, and a products table is present. Its empty state is recorded, since the ticket never describes one |

---

### AP2447_002 — Linking a Permaplate product to a dealer adds it to the dealer's eligible-products table

| Field | Value |
|---|---|
| **TC ID** | AP2447_002 |
| **Title** | Linking a Permaplate product to a dealer adds it to the dealer's eligible-products table |
| **Requirement** | AP2447 — criterion 4 |
| **Route** | The Permaplate Products tab of `/admin/dealer/1380/edit`, route recorded in AP2447_001 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the action that grants a dealer the right to sell a product.
It is also the change that every later case in the cycle depends on, so the product name
chosen here must be written into the execution log.

**Test Data:**

| Variable | Value |
|---|---|
| Product to link | The first product offered in the modal's select box. Its exact name is recorded during the run, because the staging catalogue's contents are not documented anywhere |
| Expected modal title | `Link a permaplate product to dealer Test QA staging` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Products tab for Dealer 1380. Record the list of products already linked, so the tab can be returned to this state later | The tab loads and the starting set of linked products is written into the execution log |
| 2 | Click "**Link a product**" | A modal window opens titled "Link a permaplate product to dealer Test QA staging", containing a select box of Permaplate products and a "Save" button |
| 3 | Choose the first product in the select box, note its exact name, and click "**Save**" | The modal closes and the page returns to the Permaplate Products tab |
| 4 | [Verification] Confirm the chosen product now appears as a row in the "Eligible Permaplate products" table, and record any success message that appeared | The product is listed in the table under its exact name, and the table has one more row than it did at step 1 |

---

### AP2447_003 — A product linked by the administrator becomes selectable on that dealer's Permaplate quote page

| Field | Value |
|---|---|
| **TC ID** | AP2447_003 |
| **Title** | A product linked by the administrator becomes selectable on that dealer's Permaplate quote page |
| **Requirement** | AP2447 — criterion 5 |
| **Route** | `/quote/{id}/permaplate` — the Permaplate Quote page in the Dealer portal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The administrative link is only worth anything if it reaches the
dealer's screen. This case is the join between the admin side and the dealer side, and it
also creates the quote that four later stories reuse. If the link does not surface here,
the dealer cannot sell a product the business has already authorised.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | `vinhle870@gmail.com` / `<password from the env source>` at `/login` |
| Client (created by this case) | First name `Perma`, last name `Testclient`, email `perma.test.0906@yopmail.com`, address `100 Rue Principale`, city `Montreal`, province `Québec`, postal code `H2X 1Y4`, home phone `5145550100`, work phone `5145550101`, "I agree" policy checkbox ticked |
| Vehicle | Vehicle `915`, VIN `1FAHP35NX8W239204`, a 2008 Ford Focus — the first option in the dealer's inventory select |
| Product expected | The product linked in AP2447_002 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login`, open `/quote/new/client`, and create a client with first name `Perma`, last name `Testclient`, email `perma.test.0906@yopmail.com`, address `100 Rue Principale`, city `Montreal`, province `Québec`, postal code `H2X 1Y4`, home phone `5145550100`, work phone `5145550101`, policy-agreement checkbox ticked → **Save** | The quote is created and the browser lands on `/quote/{id}/details`. The new quote ID is recorded in the execution log for reuse by later cases |
| 2 | [Pre-Condition] Open `/quote/{id}/vehicle`, select the vehicle whose VIN is `1FAHP35NX8W239204`, set a delivery date and a price → **Save** | The page returns to `/quote/{id}/details` and the Vehicle section now names the 2008 Ford Focus |
| 3 | Click "**Permaplate**" in the quote's section list, opening `/quote/{id}/permaplate` | The "Permaplate Quote" page loads showing a set of product radio buttons and a set of option checkboxes |
| 4 | [Verification] Confirm the product linked in AP2447_002 is offered as a selectable radio button on this page, and record every product name the page offers | The linked product appears and can be selected. Any product offered here that is *not* linked to Dealer 1380 is recorded, because criterion 5 implies only linked products should be selectable |

---

### AP2447_004 — Linking the same Permaplate product to the same dealer twice is handled without creating a confusing duplicate row

| Field | Value |
|---|---|
| **TC ID** | AP2447_004 |
| **Title** | Linking the same Permaplate product to the same dealer twice is handled without creating a confusing duplicate row |
| **Requirement** | AP2447 — criterion 4, and the gap beside it |
| **Route** | The Permaplate Products tab of `/admin/dealer/1380/edit` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | Q-011 — the ticket never says whether a duplicate link should be refused, silently ignored, or allowed. Without that, the case can observe what happens but cannot honestly pass or fail it. |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** An administrator who links a product twice by accident should not end
up with a dealer record that lists the same product twice, because the next person to read
that table cannot tell whether it is a display fault or two different agreements. The
behaviour is worth recording even while the correct answer is unknown, so that the answer
can be written down once and for all.

**Test Data:**

| Variable | Value |
|---|---|
| Product | The same product linked in AP2447_002 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Products tab for Dealer 1380, with the product from AP2447_002 already linked | The tab loads and the product from AP2447_002 is listed exactly once |
| 2 | Click "**Link a product**" and inspect the select box without saving | Record whether the already-linked product still appears in the select box, or has been removed from it |
| 3 | If it is still offered, choose that same product again and click "**Save**" | Record exactly what happens: an error message, a success message, or a silent return |
| 4 | [Verification] Count the rows for that product in the "Eligible Permaplate products" table and record the result together with any message shown | The observed behaviour is recorded in full. This case is reported as Blocked rather than Pass or Fail until Q-011 is answered, because no expected result exists to compare against |

---

### AP2447_005 — Saving the link modal with no product chosen is refused instead of creating an empty link

| Field | Value |
|---|---|
| **TC ID** | AP2447_005 |
| **Title** | Saving the link modal with no product chosen is refused instead of creating an empty link |
| **Requirement** | AP2447 — criterion 4 |
| **Route** | The Permaplate Products tab of `/admin/dealer/1380/edit` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** If the form saves with nothing selected, the dealer's eligible-product
list gains a row that points at no product. An administrator reading that list later cannot
tell what the dealer is actually allowed to sell, and the dealer's quote page may offer a
blank option.

**Test Data:**

| Variable | Value |
|---|---|
| Product selection | None — the select box is left at its default, empty choice |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal and open the Permaplate Products tab for Dealer 1380. Record how many rows the eligible-products table holds | The tab loads and the current row count is recorded |
| 2 | Click "**Link a product**" and leave the product select box at its default, unselected value | The modal is open with no product chosen |
| 3 | Click "**Save**" | The form does not create a link. Either an error message appears beside the select box, or the browser's own required-field prompt blocks the submit. Record which |
| 4 | [Verification] Close the modal, reload the Permaplate Products tab and count the rows again | The row count is unchanged from step 1, and no blank or nameless row has appeared in the table |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — the *Permaplate Products* tab exists | AP2447_001 | — | — | — |
| Criterion 2 — heading and *Link a product* button | AP2447_001 | — | — | — |
| Criterion 3 — the linked-products datagrid | AP2447_001, AP2447_002 | — | AP2447_001 (its empty state) | — |
| Criterion 4 — the link modal and its title, select and Save | AP2447_002 | AP2447_004, AP2447_005 | — | — |
| Criterion 5 — the product becomes selectable on the dealer's quote page | AP2447_003 | — | — | — |
| Criterion 6 — no linked product means no Permaplate button on the dealer quote page | — | — | — | — |

**Criterion 6 has no test case in this file, and that is deliberate.** Proving it requires
the dealer to have *no* Permaplate product linked at all, which is the state AP-2455 creates
by unlinking. It is covered by AP2455_004 at the end of the cycle, when removing the product
no longer blocks anything.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2447_001 | PASS | see execution log |
| AP2447_002 | PASS | see execution log |
| AP2447_003 | PASS | see execution log |
| AP2447_004 | PASS | see execution log |
| AP2447_005 | PASS | see execution log |

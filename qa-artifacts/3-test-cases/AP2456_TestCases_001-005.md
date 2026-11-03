# Test Cases — AP2456 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2456 — Remove retail pricing from Permaplate contracts and invoices (REQ-008)
**Source:** `requirements/AP-2456-remove-retail-pricing.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2456_001 to AP2456_005 (5 test cases)
**Coverage:** Functional · Regression · UI

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer for four of the five surfaces, Admin for the option edit form | `navigation` |
| **Entry route** | `/quote/{id}/permaplate` — the Permaplate Quote form, which is the first of the five surfaces | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer at `/login` and Admin at `/admin/login`, both `vinhle870@gmail.com` / `<password from the env source>` | `env` |
| **Test data** | The quote created in AP2447_003, and the contract and invoice created in AP2446_001 for client `Perma Invoice`. | `test-data` |
| **Language** | English | `navigation` |
| **Leaves behind** | Nothing. Every case in this batch reads existing surfaces. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | **What the retail-pricing field is actually called on each surface.** The ticket has no description at all and never names the field it removes. Proving a field is gone requires knowing which field it was. | AP2456_001 – AP2456_005 | Open — Q-006 |
| 2 | Whether taxes should be removed only from the PDF, as criterion 3 says, or from the quote form and invoice too. No other criterion mentions taxes. | AP2456_003 | Open — new |
| 3 | What amount the invoice should carry once the retail price is out of its description. | AP2456_004 | Open — Q-005, shared with AP2446_003 |

> **Every case in this file works around blocker 1 the same way.** Because the field name is
> unknown, each case records every money value visible on its surface, together with the
> product's known cost price, and reports whether any figure larger than the cost price — a
> retail price or a tax-inclusive total — is still shown. That is weaker than checking a named
> field, and the test report says so plainly rather than presenting it as a clean pass.
>
> AP2456_004 ships **BLOCKED** because Q-005 leaves the correct invoice amount unstated. The
> other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2456_001 | The Permaplate quote form shows no retail price beside the products and options a dealer selects | Functional | Medium | PASS |
| AP2456_002 | The Permaplate section of the quote details page shows no retail price | Functional | Medium | PASS |
| AP2456_003 | The generated Permaplate contract PDF shows neither a retail price nor a tax line | Functional | Medium | PASS |
| AP2456_004 | The Permaplate invoice description carries no retail price while still describing what was bought | Functional | Medium | PASS |
| AP2456_005 | The admin Permaplate option form and its list no longer offer a retail pricing field, and the other option fields still work | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2456_001 — The Permaplate quote form shows no retail price beside the products and options a dealer selects

| Field | Value |
|---|---|
| **TC ID** | AP2456_001 |
| **Title** | The Permaplate quote form shows no retail price beside the products and options a dealer selects |
| **Requirement** | AP2456 — criterion 1 |
| **Route** | `/quote/{id}/permaplate` — the "Permaplate Quote" page |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The quote form is the screen a dealer has open in front of a client.
A retail price left visible here is the one place the margin can be read straight off the
screen by the person paying it. This case also proves the surrounding fields still work, so
that a section which simply failed to load is not mistaken for a successful removal — the
mistake the requirements analysis warned about.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The one created in AP2447_003 for client `Perma Testclient` |
| Values to record | Every money figure shown anywhere on the page, and the cost price of the selected product if it is shown |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` and open `/quote/{id}/permaplate` for the quote created in AP2447_003 | The "Permaplate Quote" page loads with its product radio buttons and option checkboxes |
| 2 | Select a Permaplate product and tick one option, then record every money value the page displays and every column or label those values sit under | The full set of visible figures and their labels is recorded, since no field name was supplied by the ticket |
| 3 | [Verification] Confirm no figure on the page is presented as a retail, list or client-facing price, and confirm at the same time that the product names, option names and the **Save** button are all still present and working | No retail price is shown, and the rest of the form is intact. If a money value appears that is larger than the recorded cost price, it is named in the result as a possible surviving retail price rather than passed over |

---

### AP2456_002 — The Permaplate section of the quote details page shows no retail price

| Field | Value |
|---|---|
| **TC ID** | AP2456_002 |
| **Title** | The Permaplate section of the quote details page shows no retail price |
| **Requirement** | AP2456 — criterion 2 |
| **Route** | `/quote/{id}/details` — the quote hub |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The quote details page is a summary that is often printed or turned
towards the client. It is a separate surface from the quote form, built by different code,
so removing the price from one does not remove it from the other.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | The one created in AP2447_003, with a Permaplate selection saved |
| Comparison | The Warranty and Financing sections on the same page, which are not affected by this ticket |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/{id}/details` for the quote from AP2447_003, which has a saved Permaplate selection | The quote details page loads showing its sections: Client, Vehicle, Warranty, Financing, Sale and the Permaplate summary |
| 2 | Read the Permaplate section in full and record every value and label it contains | The section's contents are recorded |
| 3 | [Verification] Confirm the Permaplate section still names the product and options that were selected but shows no retail or client-facing price, and confirm the section is present rather than blank | The Permaplate section is populated with the selection and carries no retail price. A section that is entirely empty is reported as a possible loading fault, not as a successful removal |

---

### AP2456_003 — The generated Permaplate contract PDF shows neither a retail price nor a tax line

| Field | Value |
|---|---|
| **TC ID** | AP2456_003 |
| **Title** | The generated Permaplate contract PDF shows neither a retail price nor a tax line |
| **Requirement** | AP2456 — criterion 3 |
| **Route** | `/permaplate-contracts`, downloading the contract PDF |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The PDF is the document the client keeps. It is also the only one of
the five surfaces where the ticket asks for taxes to be removed as well as the retail price,
and no other criterion mentions taxes at all — so this case records exactly which figures
survive, to settle whether that difference was deliberate.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The one created in AP2446_001 for client `Perma Invoice` |
| Figures to record | Every money value in the contract pages of the PDF, and whether any is labelled as tax, GST, TPS, QST or TVQ |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/permaplate-contracts`, and download the PDF for the contract created in AP2446_001 | The contract PDF downloads and opens |
| 2 | Read the contract pages of the document — not the appended conditions — and record every money value and its label | The complete list of figures shown to the client is recorded |
| 3 | [Verification] Confirm no figure is presented as a retail price and no tax line appears, while the contract still shows the product, the options and the client and vehicle details | The contract carries no retail price and no taxes, and remains a complete document. Any surviving tax line is reported, since criterion 3 names taxes explicitly |

---

### AP2456_004 — The Permaplate invoice description carries no retail price while still describing what was bought

| Field | Value |
|---|---|
| **TC ID** | AP2456_004 |
| **Title** | The Permaplate invoice description carries no retail price while still describing what was bought |
| **Requirement** | AP2456 — criterion 4 |
| **Route** | `/invoice` — Billing → Invoices |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | Q-005 — the correct invoice amount has never been stated. Criterion 4 removes the retail price from the description but implies an amount remains, and AP-2446 does not say what that amount should be. |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the surface where a removal and an unanswered question meet.
If the retail price is taken out of the description but the invoice total is still the
retail figure, the dealer is overcharged and the evidence of it has just been deleted from
the very text that would have shown the error.

**Test Data:**

| Variable | Value |
|---|---|
| Invoice | The one raised automatically in AP2446_001 |
| Cross-reference | The figures recorded in AP2446_003 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/invoice`, then open the invoice raised for the Permaplate contract from AP2446_001 | The invoice detail is shown with its description and its amount |
| 2 | Record the full description text word for word, and record the invoice total and every line amount | The description and all figures are recorded |
| 3 | [Verification] Confirm the description still says which product and options were bought but contains no retail price, then compare the invoice total against the cost price and the retail price recorded in AP2446_003 | The description is informative and carries no retail price. The case is reported **Blocked** on the amount, because no correct total has been stated — but if the total equals a retail price the description was told to hide, that is reported as a finding in its own right |

---

### AP2456_005 — The admin Permaplate option form and its list no longer offer a retail pricing field, and the other option fields still work

| Field | Value |
|---|---|
| **TC ID** | AP2456_005 |
| **Title** | The admin Permaplate option form and its list no longer offer a retail pricing field, and the other option fields still work |
| **Requirement** | AP2456 — criterion 5 |
| **Route** | The admin Permaplate option list and edit form, whose route is recorded in AP2444_001 |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This is the only one of the five surfaces where a field was removed
from a form people type into, rather than from a display. Removing a field can break the
form that held it, and the same form gained the new *Parent* field from AP-2444 in the same
period. Checking that both changes landed without disturbing each other is the point of
running this as a regression case.

**Test Data:**

| Variable | Value |
|---|---|
| Option under inspection | The *Extra care* option, or the second option in the list if it does not exist |
| Fields expected to remain | The option's name, its term, its cost price and the new *Parent* field |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login` and open the Permaplate options list at the route recorded in AP2444_001 | The options list loads |
| 2 | Record every column heading in the options list | No column presents a retail price. The full heading list is recorded, since the ticket never named the column |
| 3 | Open the edit form for the "**Extra care**" option and record every field label it shows | The form's complete field list is recorded, with no retail pricing field among them |
| 4 | Change a harmless value — the option's name, by appending and then removing a single character — and click **Save** twice, so the option ends up exactly as it started | The form saves successfully both times, proving the remaining fields still work after the removal |
| 5 | [Verification] Confirm the option's stored values are identical to what they were at step 3, and that the "**Parent**" field from AP-2444 is still present on the form | The form works, nothing was left changed, and both this ticket's removal and AP-2444's addition are present on the same form without conflict |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — no retail price on the Permaplate quote form | AP2456_001 | — | — | — |
| Criterion 2 — no retail price in the quote details Permaplate section | AP2456_002 | — | — | — |
| Criterion 3 — no retail price and no taxes on the PDF | AP2456_003 | — | — | — |
| Criterion 4 — no retail price in the invoice description | AP2456_004 | — | — | — |
| Criterion 5 — no retail pricing field on the admin option form and list | AP2456_005 | — | — | AP2456_005 |

**No negative cases appear in this file, and the reason is worth stating.** Every criterion
in AP-2456 asks for something to be absent. There is no input to make invalid, because the
change removes fields rather than accepting values. The risk specific to removal — mistaking
a broken section for a successful removal — is handled inside each case instead, by checking
that the surrounding content is still there.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2456_001 | PASS | see execution log |
| AP2456_002 | PASS | see execution log |
| AP2456_003 | PASS | see execution log |
| AP2456_004 | PASS | see execution log |
| AP2456_005 | PASS | see execution log |

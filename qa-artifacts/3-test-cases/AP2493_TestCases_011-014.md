# Test Cases — AP2493 (File 3 of 3)

**Project:** Avantage Plus v2 — AP-2493 Cancelling a product from a quote
**Requirement:** AP2493 — REQ-003 on a quote with several products, REQ-001 archived-quote edge, REQ-003 GAP/creditor interaction
**Source:** `requirements/AP-2493-cancelling-a-product-from-a-quote.md` · `qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2493_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2493_011 to AP2493_014 (4 test cases)
**Coverage:** Functional · Regression · Edge-case · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer, for every case | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** (`fromVehicleId` entry point). Quote hub `/quote/{id}/details`; warranty `/quote/{id}/warranty/edit`; Permaplate `/quote/{id}/permaplate`; financing `/quote/{id}/financing`; creditor insurance `/quote/{id}/insurance`; GAP: the GAP control on `/quote/{id}/details` (route not mapped — record it). Quote list `/quotes`, tabs **Active** / **Archived**; a quote's id is in the row cell's `data-href` (rows are not clickable under automation) | `navigation` → `domain` (quote-creation.md, chubb-insurance.md) |
| **Viewport** | 1280 × 800 | `navigation` (registry `admin_viewport`) |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login` with the shared dealer account (Dealer ID 1380, province QC). Username and password: the Dealer Portal row of the `env` source — never copied here | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`. Dealer 1380's Chubb configuration is not changed | `test-data`, `env` |
| **Language** | EN. Append `?_locale=en` if the UI shows French | `domain` |
| **Leaves behind** | Quote "AP2493 quote M" (last name `Produit2493-011`) with a warranty, financing and the Permaplate re-added by AP2493_012; quote `Produit2493-014` with a saved creditor insurance quote (no contract). AP2493_013 changes nothing | `cleanup` (missing — recorded here) |

**Shared quote-creation values** (as File 1):

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Annul` / `Produit2493-` + the case number |
| Address / City / Province / Postal code | `123 rue Principale` / `Montréal` / `Québec` / `H2X 1Y4` |
| Tel. home / Tel. work | `5145550100` / `5145550101` |
| Policy agreement | ticked |
| Vehicle step | Delivered at `2026-11-01`, Price `20000` |
| Financing | Date of birth `1985-06-15`, Type "Financing", Net amount `25000`, Residual `0`, Monthly, Term `60`, Interest `6.99`, first financing company |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | An archived quote that carries a non-finalized product. None is recorded in `test-data`, and how a quote is archived is not mapped | AP2493_013 | Not blocking — the case reads the Archived tab at run time; if no archived quote has a product without a contract, record BLOCKED with that reason |
| 2 | The GAP control and form on a quote are not mapped | AP2493_014 | Not blocking — read from the Details page at run time, as AP2493_005 |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2493_011 | Cancelling the Permaplate product on a quote that also has a warranty leaves the warranty untouched and lowers the Subtotal | Functional · Regression | High | FAIL |
| AP2493_012 | After a Permaplate product is cancelled, adding Permaplate again creates a new row with the new option | Functional · Edge-case | Medium | FAIL |
| AP2493_013 | Opening an archived quote with a product does not show an error, and whether a cancel action is offered is recorded | Edge-case | Low | PASS |
| AP2493_014 | Cancelling a GAP product removes it and leaves the creditor insurance product on the same quote in place | Functional · Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2493_011 — Cancelling the Permaplate product on a quote that also has a warranty leaves the warranty untouched and lowers the Subtotal

| Field | Value |
|---|---|
| **TC ID** | AP2493_011 |
| **Title** | Cancelling the Permaplate product on a quote that also has a warranty leaves the warranty untouched and lowers the Subtotal |
| **Requirement** | AP2493 — REQ-003 (description: "removes its amount from the quote Subtotal, so the Subtotal reflects only active products"); financing record-only for Q-006, Subtotal source amount record-only for Q-003 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` |
| **Type** | Functional · Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — step 4(c): Subtotal stayed CA$21,500.00; the 80$ Permaplate cost is never counted in the Subtotal — see execution-log_AP-2493_2026-11-02.md |

**Why this matters:** A real quote carries several products. Deleting one row must not
touch another, and the Subtotal must drop by exactly the cancelled product's amount. The
financing panel is recorded before and after because the ticket does not say whether the
monthly payment follows (Q-006).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2493 quote M": fresh quote with the shared values, last name `Produit2493-011` |
| Warranty | First `term` radio — record term and amount |
| Permaplate | First `permaplate_id` radio and the first enabled `option_ids[]` checkbox — record names and Cost |
| Financing | Shared financing values |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form (last name `Produit2493-011`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; click "Click here to create a warranty", first term → **Save**; open the Permaplate / Esthetic protection control, first product and first enabled option → **Save**; click **Add a financing**, shared financing values → **Save** | `/quote/{id}/details` shows a warranty row, an Esthetic protection row and a Financing panel. Record: quote id ("AP2493 quote M"), warranty term and amount, Permaplate product, option and amount, the Subtotal, and every Financing panel value (payment, amounts) |
| 2 | Choose the cancel/delete action on the Esthetic protection row and click the modal's confirm button | The modal closes without an error page or HTTP 5xx |
| 3 | Reload `/quote/{id}/details` and record the Financing panel values again (Q-006) | The page loads without an error; Financing values recorded — any change or no change is recorded, not judged. An error in the Financing panel is a FAIL |
| 4 | [Verification] Verify (a) no Esthetic protection row is shown and its add action is back, (b) the warranty row shows the same term and amount as in step 1, and (c) the Subtotal after = Subtotal before − the Permaplate amount recorded in step 1 | All three hold. A Permaplate row still listed, a changed or missing warranty, or a Subtotal that did not drop by the Permaplate amount is a FAIL. If the Permaplate row showed more than one amount, record which one the drop equals (Q-003) |

---

### AP2493_012 — After a Permaplate product is cancelled, adding Permaplate again creates a new row with the new option

| Field | Value |
|---|---|
| **TC ID** | AP2493_012 |
| **Title** | After a Permaplate product is cancelled, adding Permaplate again creates a new row with the new option |
| **Requirement** | AP2493 — REQ-003, AC 3 ("the add (+) action is available again, and adding a product creates a new row") |
| **Route** | `/quote/{id}/details` → `/quote/{id}/permaplate` of "AP2493 quote M" |
| **Type** | Functional · Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — step 4: new row created, but Subtotal stayed CA$21,500.00 (did not rise by 145$) — see execution-log_AP-2493_2026-11-02.md |

**Why this matters:** Before this ticket, Permaplate allowed only one row per quote. A
second Permaplate after a cancel is exactly the case that the old one-row limit would
refuse.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2493 quote M" after AP2493_011 (no active Permaplate). If missing, rebuild it as AP2493_011 steps 1–2 |
| New Permaplate | The first product radio and a **different** option from the one cancelled in AP2493_011 (the second enabled option; if only one option exists, the same option — record that) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/{id}/details` of "AP2493 quote M" | No Esthetic protection row; its add action is shown; the Subtotal is recorded |
| 2 | Click the Permaplate / Esthetic protection add action, select the first product and the New Permaplate option, and click **Save** | The page returns to `/quote/{id}/details` without an error. A database or "already exists" error is a FAIL |
| 3 | Reload `/quote/{id}/details` | The page loads without an error |
| 4 | [Verification] Verify exactly one Esthetic protection row is shown, with the new option and its amount, the warranty row is unchanged, and the Subtotal rose by the new Permaplate amount | One Permaplate row with the new option and amount. No row, two rows, the cancelled option shown, or a Subtotal that did not include the new amount is a FAIL |

---

### AP2493_013 — Opening an archived quote with a product does not show an error, and whether a cancel action is offered is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2493_013 |
| **Title** | Opening an archived quote with a product does not show an error, and whether a cancel action is offered is recorded |
| **Requirement** | AP2493 — REQ-001, AC 1 condition "non-archived quote" — record-only for Q-004 |
| **Route** | `/quotes` → **Archived** tab → `/quote/{id}/details` |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** AC 1 promises the action only on non-archived quotes and says
nothing about archived ones (Q-004). This case records what the build does, so the author
can confirm it, and fails only on an objective fault.

**Test Data:**

| Variable | Value |
|---|---|
| Archived quote | The first quote in the `/quotes` **Archived** tab (id from the row's `data-href`) whose details page shows a product with no contract; check up to 10 rows, record each id checked |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/quotes`, click the **Archived** tab and read the first 10 row ids from `data-href` | Up to 10 archived quote ids are recorded. If the tab is empty, mark BLOCKED "no archived quote on dealer 1380" |
| 2 | Open each id's `/quote/{id}/details` until one shows a product row without a contract number | One archived quote with a non-finalized product is found and its id recorded; if none of the 10 has one, mark BLOCKED "no archived quote with a non-finalized product" |
| 3 | Open every control of that product row without choosing any destructive item; record each control and whether a cancel/delete action is offered, hidden or disabled | Controls recorded for Q-004 — not judged. **Do not confirm a cancellation on an archived quote** |
| 4 | [Verification] Verify the archived quote's details page and its product row render without an error page or HTTP 5xx | The page renders without an error. An error page is a FAIL. Whether a cancel action is offered is recorded for Q-004, not judged |

---

### AP2493_014 — Cancelling a GAP product removes it and leaves the creditor insurance product on the same quote in place

| Field | Value |
|---|---|
| **TC ID** | AP2493_014 |
| **Title** | Cancelling a GAP product removes it and leaves the creditor insurance product on the same quote in place |
| **Requirement** | AP2493 — REQ-002 (confirm), REQ-003 (product removed, Subtotal); creditor premium record-only for Q-007 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/financing` → GAP control → `/quote/{id}/insurance` → `/quote/{id}/details` |
| **Type** | Functional · Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** The creditor insurance row tells the dealer to create GAP first "to
include the GAP premium amount", so the two products are linked. Deleting GAP must not
delete or break the creditor product; whether its premium changes is not stated (Q-007)
and is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Fresh quote with the shared values, last name `Produit2493-014` |
| GAP insurance | Borrower date of birth `1985-06-15`, Monthly payment: the Financing panel payment (record it), Term months `60`, Residual `0`, GAP term `60`; other required fields: first option, recorded |
| Creditor insurance | Language "English", Form "Monthly Premium PM30", Life "Decreasing" / `60` / "Borrower" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form (last name `Produit2493-014`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; click **Add a financing**, shared financing values → **Save** | `/quote/{id}/details` shows the Financing panel; quote id and monthly payment recorded. If **Add a financing** is disabled, record the prerequisite it names and mark the case BLOCKED "Add a financing disabled — <prerequisite>" |
| 2 | [Pre-Condition] Click the GAP insurance control (record its URL), fill the GAP values and submit; then open `/quote/{id}/insurance`, fill the Creditor insurance values and click **Get Quote**. Create no contract | `/quote/{id}/details` shows a GAP row and a Creditors insurance row, neither with a contract number. Record the GAP premium, the creditor premium ("creditor premium before"), every other product amount and the Subtotal, and whether the Subtotal equals the sum of the product amounts with the creditor premium counted or without it. If there is no GAP control, mark BLOCKED "no GAP insurance control on the quote details page" |
| 3 | Choose the cancel/delete action on the GAP row and click the modal's confirm button; then reload `/quote/{id}/details` | The page reloads without an error page or HTTP 5xx. Record any message (Q-008) |
| 4 | [Verification] Record the creditor premium now ("creditor premium after", Q-007). Verify (a) no GAP row is shown and its add control is back, (b) the Creditors insurance row is still shown, and (c) Subtotal after = Subtotal before − GAP amount − (creditor premium before − creditor premium after), i.e. the Subtotal equals the sum of the products still active. If step 2 showed the creditor premium is not counted in the Subtotal, the bracket is 0 | All three hold. A GAP row still listed, a missing Creditors insurance row, or a Subtotal that differs from the value in (c) is a FAIL. Whether the creditor premium changed, and by how much, is recorded for Q-007, not judged |

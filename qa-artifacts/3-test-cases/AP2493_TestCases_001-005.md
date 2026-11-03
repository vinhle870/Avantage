# Test Cases — AP2493 (File 1 of 3)

**Project:** Avantage Plus v2 — AP-2493 Cancelling a product from a quote
**Requirement:** AP2493 — REQ-001 Cancel action offered only for a non-finalized product (one case per product type)
**Source:** `requirements/AP-2493-cancelling-a-product-from-a-quote.md` · `qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2493_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2493_001 to AP2493_005 (5 test cases)
**Coverage:** Functional · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer, for every case | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** (the `fromVehicleId` entry point — the bare `/quote/new/client` route returns HTTP 500 after save). The quote hub is `/quote/{id}/details`. Product stages: warranty `/quote/{id}/warranty/edit` ("Click here to create a warranty"), Roadside `/quote/{id}/road-side-protection`, Permaplate `/quote/{id}/permaplate`, financing `/quote/{id}/financing` ("Add a financing"), creditor insurance `/quote/{id}/insurance`. **GAP insurance on a quote is not mapped** — reach it from the GAP control on `/quote/{id}/details` and record its URL | `navigation` → `domain` (quote-creation.md, chubb-insurance.md); GAP: not known |
| **Viewport** | 1280 × 800 | `navigation` (registry `admin_viewport`) |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login` with the shared dealer account (Dealer ID 1380, province QC). Username and password: the Dealer Portal row of the `env` source — never copied here | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km. Dealer 1380's Chubb configuration (Creditor Monthly PM30, Creditor Monthly PM50 and GAP assigned) is **not changed** by any case | `test-data`, `env` |
| **Language** | EN. "Esthetic protection" is the EN label of Permaplate; routes still say `permaplate`. Append `?_locale=en` if the UI shows French | `domain` |
| **Build check** | Before the first case: if no product row on any quote offers a cancel/delete action, the build does not contain AP-2493 — mark every case BLOCKED "build does not contain AP-2493", not FAIL | test plan §4 |
| **Leaves behind** | One client and one quote per case that creates one (quotes cannot be deleted). AP2493_004 and AP2493_005 also leave a saved Chubb insurance quote (no contract) on their quote. Products added are cancelled by the File 2 cases or left on the quote — record which | `cleanup` (missing — recorded here) |

**Standing facts only.** Every quote and product these cases need is created in their
`[Pre-Condition]` steps, with the values written in the case.

**Shared quote-creation values** (used by every case's step 1; one fresh client and quote
per case, so cases do not depend on each other):

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Annul` / `Produit2493` + the case number (e.g. `Produit2493-001`) |
| Address / City / Province / Postal code | `123 rue Principale` / `Montréal` / `Québec` / `H2X 1Y4` |
| Tel. home / Tel. work | `5145550100` / `5145550101` (both required) |
| Policy agreement | ticked |
| Vehicle step (`/quote/{id}/vehicle`) | Vehicle `1FAHP35NX8W239204` (preselected), Delivered at `2026-11-01`, Price `20000` |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The route and form of a GAP insurance product on a quote are not in `navigation` / `domain`. The case gives the quick-quote GAP field set (borrower DOB, monthly payment, term, residual, GAP term) as the values to use | AP2493_005 | Not blocking — the control is read from the Details page at run time; if no GAP control exists on the quote, record BLOCKED with that reason |
| 2 | Whether saving a Roadside product without generating its contract is possible ("Save and Generate Contract" is the stage's only button) | AP2493_002 | Not blocking — if the save generates a contract, record BLOCKED "Roadside product is finalized on save" |

> No case shipped BLOCKED. Executed 2026-11-02 on Dev (v2dev) — see `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2493_001 | An extended warranty with no contract shows a cancel action on the quote details page | Functional | High | PASS |
| AP2493_002 | A Roadside Protection product with no contract shows a cancel action on the quote details page | Functional | High | PASS |
| AP2493_003 | An Esthetic protection (Permaplate) product with no contract shows a cancel action on the quote details page | Functional | High | PASS |
| AP2493_004 | A creditor insurance product quoted but without a contract shows a cancel action on the quote details page | Functional | High | PASS |
| AP2493_005 | A GAP insurance product quoted but without a contract shows a cancel action on the quote details page | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2493_001 — An extended warranty with no contract shows a cancel action on the quote details page

| Field | Value |
|---|---|
| **TC ID** | AP2493_001 |
| **Title** | An extended warranty with no contract shows a cancel action on the quote details page |
| **Requirement** | AP2493 — REQ-001, AC 1 (product type: extended warranty); label record-only for Q-002 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → `/quote/{id}/warranty/edit` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** The extended warranty is the most common product on a quote. If its
row has no cancel action, a dealer who added the wrong warranty cannot remove it.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Fresh quote with the shared quote-creation values, last name `Produit2493-001` |
| Warranty | The first `term` radio offered, and no component checkbox ticked beyond those pre-ticked — record the term label and the amount shown |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared values (last name `Produit2493-001`) and click **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Annul Produit2493-001`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` click "Click here to create a warranty", select the first term radio and click **Save** | The page returns to `/quote/{id}/details` without an error and the Warranty section shows a warranty row with its term and amount (recorded). No contract number or contract download link is shown for it |
| 3 | In the warranty row, open every row control (buttons, icons, a dropdown or "⋮" menu) without choosing any destructive item, and record each control and item label | Every control of the row is recorded, including where the cancel action sits (direct button or menu item) and its label (Q-002) |
| 4 | [Verification] Verify the warranty row offers an action that cancels/deletes the product (for example "Delete" or "Cancel") | A cancel/delete action is visible and enabled for the warranty. No such action on the row is a FAIL. Record its exact label for Q-002 — the label itself is not judged |

---

### AP2493_002 — A Roadside Protection product with no contract shows a cancel action on the quote details page

| Field | Value |
|---|---|
| **TC ID** | AP2493_002 |
| **Title** | A Roadside Protection product with no contract shows a cancel action on the quote details page |
| **Requirement** | AP2493 — REQ-001, AC 1 (product type: roadside); label record-only for Q-002 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → `/quote/{id}/road-side-protection` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** The Roadside stage's only button was "Save and Generate Contract"
when it was last mapped. This case shows whether a Roadside product can exist without a
contract at all — and, if it can, that it is cancellable.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Fresh quote with the shared quote-creation values, last name `Produit2493-002` |
| Roadside | First tier radio (`quote_auto_shield[selectedTier]`), Sale price `20000`, VIN `1FAHP35NX8W239204` (if not prefilled), Stock number `QA2493-002`, Vehicle condition: first option, Odometer `5000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared values (last name `Produit2493-002`) and click **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Annul Produit2493-002`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` click the Road Side Protection control, fill the form with the Test Data values and record every submit button offered. Click the button that saves **without** generating a contract if one exists; otherwise record "only Save and Generate Contract" and click it | The page returns to `/quote/{id}/details` without an error and the Roadside row shows the tier and amount (recorded). Record whether a roadside contract ID is shown. If a contract ID is shown, stop and mark the case BLOCKED "Roadside product is finalized on save — no non-finalized Roadside product can be created" |
| 3 | In the Roadside row, open every row control without choosing any destructive item, and record each control and item label | Every control of the row is recorded, with the cancel action's place and label (Q-002) |
| 4 | [Verification] Verify the Roadside row (no contract ID) offers an action that cancels/deletes the product | A cancel/delete action is visible and enabled. No such action on a Roadside row without a contract is a FAIL. Label recorded for Q-002 |

---

### AP2493_003 — An Esthetic protection (Permaplate) product with no contract shows a cancel action on the quote details page

| Field | Value |
|---|---|
| **TC ID** | AP2493_003 |
| **Title** | An Esthetic protection (Permaplate) product with no contract shows a cancel action on the quote details page |
| **Requirement** | AP2493 — REQ-001, AC 1 (product type: Permaplate); label record-only for Q-002 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` → `/quote/{id}/permaplate` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** Permaplate is the product most often re-quoted with different
options, so freeing its slot is where dealers will use cancel most.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Fresh quote with the shared quote-creation values, last name `Produit2493-003` |
| Permaplate | The first `permaplate_id` radio and the first `option_ids[]` checkbox that becomes enabled — record names and the Cost shown |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared values (last name `Produit2493-003`) and click **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Annul Produit2493-003`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` click the Permaplate / Esthetic protection control, select the first product radio and the first enabled option, and click **Save** | The page returns to `/quote/{id}/details` without an error and an Esthetic protection row shows the product and its amount (recorded), with no contract download link. If the Permaplate page offers no product, mark BLOCKED "dealer 1380 has no Permaplate product linked" |
| 3 | In the Esthetic protection row, open every row control without choosing any destructive item, and record each control and item label | Every control of the row is recorded, with the cancel action's place and label (Q-002) |
| 4 | [Verification] Verify the Esthetic protection row offers an action that cancels/deletes the product | A cancel/delete action is visible and enabled. No such action is a FAIL. Label recorded for Q-002 |

---

### AP2493_004 — A creditor insurance product quoted but without a contract shows a cancel action on the quote details page

| Field | Value |
|---|---|
| **TC ID** | AP2493_004 |
| **Title** | A creditor insurance product quoted but without a contract shows a cancel action on the quote details page |
| **Requirement** | AP2493 — REQ-001, AC 1 (product type: creditor); label record-only for Q-002 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/financing` → `/quote/{id}/insurance` → `/quote/{id}/details` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** A creditor insurance product is "not finalized" between the saved
Chubb quote and the generated contract. That window is exactly where the ticket allows
cancelling. The Chubb quote call goes to a third-party test API (a few seconds).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Fresh quote with the shared quote-creation values, last name `Produit2493-004` |
| Financing | Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company: first option |
| Creditor insurance | Language "English", Tax exempt: default, Form "Monthly Premium PM30", Life type "Decreasing", term `60`, covered person "Borrower"; Critical illness and Disability left empty |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared values (last name `Produit2493-004`) and click **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Annul Produit2493-004`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` click **Add a financing**, fill the Financing values and click **Save**; then open `/quote/{id}/insurance`, fill the Creditor insurance values and click **Get Quote**. Do **not** create a contract | Flash "Financing saved", then flash "Chubb insurance quote saved successfully" and a return to `/quote/{id}/details`, where the Creditors insurance row shows the coverage table and a premium (recorded) and no contract number or Download link. If **Add a financing** is disabled, record the prerequisite it names and mark the case BLOCKED "Add a financing disabled — <prerequisite>" |
| 3 | In the Creditors insurance row, open every row control without choosing any destructive item, and record each control and item label | Every control of the row is recorded, with the cancel action's place and label (Q-002) |
| 4 | [Verification] Verify the Creditors insurance row (no contract number) offers an action that cancels/deletes the product | A cancel/delete action is visible and enabled. No such action is a FAIL. Label recorded for Q-002 |

---

### AP2493_005 — A GAP insurance product quoted but without a contract shows a cancel action on the quote details page

| Field | Value |
|---|---|
| **TC ID** | AP2493_005 |
| **Title** | A GAP insurance product quoted but without a contract shows a cancel action on the quote details page |
| **Requirement** | AP2493 — REQ-001, AC 1 (product type: GAP); label record-only for Q-002 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/financing` → GAP control on `/quote/{id}/details` (route recorded) |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** GAP is the one product type whose quote stage has never been
mapped. Priority is Medium only because the route must be discovered at run time; the
behaviour under test is the same as AP2493_004.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Fresh quote with the shared quote-creation values, last name `Produit2493-005` |
| Financing | As AP2493_004: Date of birth `1985-06-15`, Type "Financing", Net amount `25000`, Residual `0`, Monthly, Term `60`, Interest `6.99`, first financing company |
| GAP insurance | Borrower date of birth `1985-06-15`, Co-borrower date of birth empty, Monthly payment: the payment shown in the Financing panel (record it), Term months `60`, Residual `0`, GAP term `60` (the quick-quote GAP field set; if the quote's GAP form asks for other required fields, record them and use the first option / the financing values) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared values (last name `Produit2493-005`) and click **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Annul Produit2493-005`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` click **Add a financing**, fill the Financing values and click **Save**; then click the GAP insurance control on the details page (record its label and URL), fill the GAP values and submit the quote. Do **not** create a contract | Flash "Financing saved"; the GAP quote saves without an error and `/quote/{id}/details` shows a GAP insurance row with a premium (recorded) and no contract number or Download link. If the details page has no GAP control, mark BLOCKED "no GAP insurance control on the quote details page". If **Add a financing** is disabled, record the prerequisite it names and mark the case BLOCKED "Add a financing disabled — <prerequisite>" |
| 3 | In the GAP insurance row, open every row control without choosing any destructive item, and record each control and item label | Every control of the row is recorded, with the cancel action's place and label (Q-002) |
| 4 | [Verification] Verify the GAP insurance row (no contract number) offers an action that cancels/deletes the product | A cancel/delete action is visible and enabled. No such action is a FAIL. Label recorded for Q-002 |

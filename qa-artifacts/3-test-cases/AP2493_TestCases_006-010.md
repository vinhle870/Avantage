# Test Cases — AP2493 (File 2 of 3)

**Project:** Avantage Plus v2 — AP-2493 Cancelling a product from a quote
**Requirement:** AP2493 — REQ-001 (finalized product), REQ-002 Confirmation modal, REQ-003 Delete, freed slot and Subtotal
**Source:** `requirements/AP-2493-cancelling-a-product-from-a-quote.md` · `qa-artifacts/1-requirements-analysis/AP-2493_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2493_test-plan.md`
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2493_006 to AP2493_010 (5 test cases)
**Coverage:** Functional · Negative · Regression · Edge-case · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer, for every case | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** (the `fromVehicleId` entry point — the bare `/quote/new/client` route returns HTTP 500 after save). Quote hub `/quote/{id}/details`; warranty stage `/quote/{id}/warranty/edit` ("Click here to create a warranty"); financing `/quote/{id}/financing`; creditor insurance `/quote/{id}/insurance` and `/quote/{id}/insurance/create-contract` (reached by URL) | `navigation` → `domain` (quote-creation.md, chubb-insurance.md), `contract-setup` |
| **Viewport** | 1280 × 800 | `navigation` (registry `admin_viewport`) |
| **Environment** | Staging (v2staging) — base URL from the `env` source | `env` |
| **Login** | Dealer portal `/login` with the shared dealer account (Dealer ID 1380, province QC). Username and password: the Dealer Portal row of the `env` source — never copied here | `env` |
| **Test data** | Vehicle 915 — Ford Focus 2008, VIN `1FAHP35NX8W239204`. Quote **6276** (Marie Tremblay, vehicle 915) carried Chubb creditor contract **AVP000160** on 2026-09-04 — reused read-only by AP2493_006 if it still shows that contract | `test-data`, `contract-setup` |
| **Language** | EN. Append `?_locale=en` if the UI shows French | `domain` |
| **Leaves behind** | Quote "AP2493 quote W" (last name `Produit2493-007`) with the warranty added by AP2493_010. If AP2493_006 had to create a contract: one more quote and one permanent Chubb contract on staging | `cleanup` (missing — recorded here) |

**Standing facts only.** Every quote and product these cases need is created in their
`[Pre-Condition]` steps, with the values written in the case.

**Shared quote-creation values** (as File 1):

| Variable | Value |
|---|---|
| Client email | `client.stage.NNN@yopmail.com` — next unused NNN, record it |
| First name / Last name | `Annul` / `Produit2493-` + the case number |
| Address / City / Province / Postal code | `123 rue Principale` / `Montréal` / `Québec` / `H2X 1Y4` |
| Tel. home / Tel. work | `5145550100` / `5145550101` |
| Policy agreement | ticked |
| Vehicle step | Delivered at `2026-11-01`, Price `20000` |

**Case chain.** AP2493_007 creates "AP2493 quote W" with a warranty. AP2493_008 and
AP2493_009 reuse it while its warranty is still active; AP2493_010 reuses it after
AP2493_009 cancelled the warranty. Each case says how to rebuild that state if it is
missing.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| — | None | — | — |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2493_006 | A creditor insurance product with a generated contract shows no cancel action and keeps its Download link | Negative · Regression | High | PASS |
| AP2493_007 | Choosing cancel opens a confirmation modal, and declining it leaves the warranty on the quote unchanged | Functional · Negative | High | PASS |
| AP2493_008 | Closing the confirmation modal without answering leaves the warranty on the quote unchanged | Negative | Medium | PASS |
| AP2493_009 | Confirming the cancellation removes the warranty, brings back the add action and lowers the Subtotal by its amount | Functional | High | PASS |
| AP2493_010 | After a warranty is cancelled, adding a new warranty creates a new row with the new term and amount | Functional · Edge-case | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2493_006 — A creditor insurance product with a generated contract shows no cancel action and keeps its Download link

| Field | Value |
|---|---|
| **TC ID** | AP2493_006 |
| **Title** | A creditor insurance product with a generated contract shows no cancel action and keeps its Download link |
| **Requirement** | AP2493 — REQ-001, description: "A product can only be cancelled while it is not finalized … Finalized products keep their existing download action" |
| **Route** | `/quote/6276/details` (or a quote created in step 2) |
| **Type** | Negative · Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** Deleting a product that already has a contract would leave a signed
contract with no product behind it. This is the guard the ticket puts on the feature.

**Test Data:**

| Variable | Value |
|---|---|
| Finalized product | Step 2 (create a quote and a Chubb contract) is the primary path: the `contract-setup` source is a designer reference only. Quote 6276 / contract AVP000160 is a read-only shortcut, used only if step 1 finds it in the `/quotes` **Active** tab with its contract number and Download link (record that); otherwise run step 2 |
| Financing (step 2 only) | Date of birth `1985-06-15`, Type "Financing", Net amount `25000`, Residual `0`, Monthly, Term `60`, Interest `6.99`, first financing company |
| Creditor insurance (step 2 only) | Language "English", Form "Monthly Premium PM30", Life "Decreasing" / `60` / "Borrower" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/6276/details`; expand the Creditors insurance row | The page loads; record whether the row shows contract number AVP000160 and a Download link. If yes, skip step 2 |
| 2 | [Pre-Condition] Only if step 1 found no contract: create a quote with the shared values (last name `Produit2493-006`) via `/vehicle/915/details` → **Create quote**, save the Financing values (**Add a financing** → **Save**), save the Creditor insurance values at `/quote/{id}/insurance` (**Get Quote**), then open `/quote/{id}/insurance/create-contract` and click **Create Contract** | Flash "Chubb insurance contract created successfully"; the Creditors insurance row shows a contract number (recorded) and a Download link. A Chubb "HTTP/2 400" banner is an environment failure → BLOCKED |
| 3 | In the finalized Creditors insurance row, open every row control (buttons, icons, dropdown or "⋮" menu) and record each control and item label | Every control of the row is recorded |
| 4 | [Verification] Verify the finalized Creditors insurance row offers no cancel/delete action, and its Download link is still present | No cancel/delete action exists for the finalized product, and the Download link is visible. A cancel/delete action on a product with a contract number is a FAIL; a missing Download link is a FAIL |

---

### AP2493_007 — Choosing cancel opens a confirmation modal, and declining it leaves the warranty on the quote unchanged

| Field | Value |
|---|---|
| **TC ID** | AP2493_007 |
| **Title** | Choosing cancel opens a confirmation modal, and declining it leaves the warranty on the quote unchanged |
| **Requirement** | AP2493 — REQ-002, AC 2 (modal shown, nothing cancelled yet; decline → still active and unchanged); modal wording record-only for Q-005 |
| **Route** | `/vehicle/915/details` → Create quote → `/quote/{id}/details` |
| **Type** | Functional · Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** The deletion is permanent, so the modal is the dealer's only
protection against a mis-click. This case creates "AP2493 quote W", which the next three
cases reuse.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2493 quote W": fresh quote with the shared values, last name `Produit2493-007` |
| Warranty | First `term` radio offered — record the term label and amount |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form (last name `Produit2493-007`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; on `/quote/{id}/details` click "Click here to create a warranty", select the first term → **Save** | `/quote/{id}/details` shows a warranty row; the quote id ("AP2493 quote W"), the warranty term, the warranty amount and the Subtotal (if shown) are recorded |
| 2 | Choose the cancel/delete action on the warranty row | A modal dialog opens |
| 3 | [Verification] With the modal open, verify the warranty row is still listed behind it with the same term and amount, and record the modal's title, text and every button label (Q-005) | The modal is visible and the warranty row is unchanged — no cancellation has happened yet. Modal wording recorded, not judged |
| 4 | Click the modal's decline button (the one that does not confirm — e.g. "Cancel" / "No"); then reload `/quote/{id}/details` | The modal closes without an error |
| 5 | [Verification] Verify the warranty row is still present with the same term and amount as recorded in step 1, and the Subtotal (if shown) is unchanged | The warranty is still active and unchanged after the reload. A missing warranty row, a changed term or amount, or a changed Subtotal is a FAIL |

---

### AP2493_008 — Closing the confirmation modal without answering leaves the warranty on the quote unchanged

| Field | Value |
|---|---|
| **TC ID** | AP2493_008 |
| **Title** | Closing the confirmation modal without answering leaves the warranty on the quote unchanged |
| **Requirement** | AP2493 — REQ-002, AC 2 ("dismisses … the confirmation → the modal closes and the product is still active and unchanged") |
| **Route** | `/quote/{id}/details` of "AP2493 quote W" |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** "Dismiss" is a different path from "decline": a close icon, the
Escape key or a click outside the modal. Any of them confirming the deletion by mistake
would lose the product.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2493 quote W" from AP2493_007 with its warranty still active; if missing, rebuild it exactly as AP2493_007 step 1 |
| Dismiss methods | (a) the modal's close icon "×" if present, (b) the Escape key, (c) a click on the page outside the modal |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/{id}/details` of "AP2493 quote W" | A warranty row is shown; its term, amount and the Subtotal (if shown) are recorded |
| 2 | Choose the cancel/delete action on the warranty row, then close the modal with its close icon "×" (record "no close icon" if there is none) | The modal closes, or the absence of a close icon is recorded |
| 3 | Choose the cancel/delete action again and press **Escape**; then choose it again and click on the page outside the modal | For each method, record whether the modal closes. A method that does not close the modal is recorded, not failed |
| 4 | Close any modal still open with its decline button, then reload `/quote/{id}/details` | The page reloads without an error |
| 5 | [Verification] Verify the warranty row is still present with the same term and amount as in step 1, and the Subtotal is unchanged | The warranty is still active and unchanged. A missing warranty row or changed values after any dismiss method is a FAIL |

---

### AP2493_009 — Confirming the cancellation removes the warranty, brings back the add action and lowers the Subtotal by its amount

| Field | Value |
|---|---|
| **TC ID** | AP2493_009 |
| **Title** | Confirming the cancellation removes the warranty, brings back the add action and lowers the Subtotal by its amount |
| **Requirement** | AP2493 — REQ-002 (cancelled only after confirming), REQ-003 (hard delete per Q-001 answer; slot freed; Subtotal); success message record-only for Q-008, Subtotal source amount record-only for Q-003 |
| **Route** | `/quote/{id}/details` of "AP2493 quote W" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** This is the feature's main path. If the product stays, or the
Subtotal still counts it, the dealer quotes the client a price for something they removed.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2493 quote W" with its warranty still active; if missing, rebuild it exactly as AP2493_007 step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/{id}/details` of "AP2493 quote W" | The warranty row is shown. Record the warranty term, **every** amount shown on the warranty row, the Subtotal and where on the page it is shown |
| 2 | Choose the cancel/delete action on the warranty row and click the modal's confirm button | The modal closes and the page shows `/quote/{id}/details` without an error page or HTTP 5xx. Record any message shown (Q-008) |
| 3 | Reload `/quote/{id}/details` | The page loads without an error |
| 4 | [Verification] Verify (a) no warranty row is shown, (b) the warranty add action ("Click here to create a warranty" or a "+") is shown again, and (c) the Subtotal after = Subtotal before − the warranty amount recorded in step 1 | All three hold. A warranty still listed, no add action, or a Subtotal that did not drop is a FAIL. If the row showed more than one amount, record which one the drop equals (Q-003) — a drop equal to none of them is a FAIL |

---

### AP2493_010 — After a warranty is cancelled, adding a new warranty creates a new row with the new term and amount

| Field | Value |
|---|---|
| **TC ID** | AP2493_010 |
| **Title** | After a warranty is cancelled, adding a new warranty creates a new row with the new term and amount |
| **Requirement** | AP2493 — REQ-003, AC 3 ("the add (+) action is available again, and adding a product creates a new row") |
| **Route** | `/quote/{id}/details` → `/quote/{id}/warranty/edit` of "AP2493 quote W" |
| **Type** | Functional · Edge-case |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), re-run on quote 6467 (first run BLOCKED: one warranty term; redesigned per R3 F-1) |
| **Result** | PASS — one warranty row CA$1,800.00, Subtotal CA$21,800.00 — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2493_2026-11-02.md |

**Why this matters:** Freeing the slot is the reason the feature exists. Giving the new
warranty a **different amount** from the cancelled one (CA$1,800.00 instead of
CA$1,500.00) makes it visible whether the page shows a new product or the old one coming
back.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | "AP2493 quote W" after AP2493_009 (no active warranty, Subtotal CA$20,000.00 = vehicle 20,000). On Dev this is quote 6467. If AP2493_009 did not leave it in that state, rebuild it as AP2493_007 step 1 and cancel the warranty as AP2493_009 step 2 |
| New warranty | The same term as the cancelled one — **20m/20000km** ("Automation Test Program", the only term vehicle 915 offers on Dev) — with **Sale price `1800`**. The Dev warranty form requires a Sale price, and it sets the row amount; 1800 differs from the cancelled warranty's 1500 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/quote/{id}/details` of "AP2493 quote W" | No warranty row is shown and the warranty add action is shown; Subtotal CA$20,000.00. The cancelled warranty's term and amount from AP2493_009 (20m/20000km, CA$1,500.00) are at hand |
| 2 | Click the warranty add action, select the 20m/20000km term radio, enter Sale price `1800` and click **Save** | The page returns to `/quote/{id}/details` without an error. Record any message |
| 3 | Reload `/quote/{id}/details` | The page loads without an error |
| 4 | [Verification] Verify exactly one warranty row is shown, with amount CA$1,800.00 (not the cancelled CA$1,500.00), and the Subtotal is CA$21,800.00 (vehicle 20,000.00 + warranty 1,800.00) | Exactly one warranty row of CA$1,800.00 and a Subtotal of CA$21,800.00, with no error page. No row, two rows, a row of CA$1,500.00 (the cancelled warranty's values), a Subtotal other than CA$21,800.00, or an error page / HTTP 5xx is a FAIL |

---

## Revisions

| Date | Case | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2493_010 | Test Data "New warranty" changed from "the second term radio" to the same 20m/20000km term with Sale price `1800`; steps 1–2 follow it; step 4 now expects exactly one warranty row of CA$1,800.00 and a Subtotal of CA$21,800.00 (vehicle 20,000 + warranty 1,800), no error page. Status reset to Not Run for the re-run, then set to PASS by the re-run on Dev quote 6467 (2026-11-01T20:05:11Z) | R3 round 1 F-1 (qa-artifacts/7-reviews/AP-2493_review.md): vehicle 915 offers one warranty term on Dev, and the Dev warranty form's required Sale price sets the row amount, so a different Sale price distinguishes the new row from the cancelled one |

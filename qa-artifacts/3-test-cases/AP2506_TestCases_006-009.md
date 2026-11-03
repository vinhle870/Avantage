# Test Cases — AP2506 (File 2 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2506 — Generate contract for a quote's Esthetic protection product
**Source:** requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md · qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2506_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2506_006 to AP2506_009 (4 test cases)
**Coverage:** Functional · Regression · Negative · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** header action → `/quote/new/client?fromVehicleId=915` → `/quote/{id}/details`, the quote page. Never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500. The page under test is `/quote/{id}/permaplate-create-contract` | `navigation` → `domain` (quote-creation.md) |
| **Esthetic protection on a quote** | The quote page links "Permaplate" to `/quote/{id}/permaplate` ("Permaplate Quote": product radios `permaplate_id`, option checkboxes `option_ids[]`, **Save**). In the EN UI the product is labelled "Esthetic protection"; addresses still say `permaplate` | `domain` (quote-creation.md) |
| **Generate Contract action** | Not mapped in `domain`. Look on the quote page for the Esthetic protection row (or Permaplate section) and its actions menu; AP-2459 (2026-09) recorded a "Create Contract" control on `/quote/{id}/details`. Record where it sits and its label (Q-011). If it is not shown, type `/quote/{id}/permaplate-create-contract` and record that the fallback was used (some quote links are not shown — `domain`, chubb-insurance.md §5) | `domain` (gap); AP-2459 capture |
| **Esthetic protection contract list** | Dealer sidebar Contracts → "Esthetic protection" → `/permaplate-contracts`, heading "Esthetic protection contracts", columns VIN · Client name · Client phone · Contract cost price · Actions. No contract number is shown — find a row by client name. **Download** → `/quote/{quoteId}/permaplate-contract-download`, opens in a new tab, served as HTTP 200 `application/pdf` | `domain` (quote-creation.md § Permaplate contract lists) |
| **Viewport** | 1280 × 800 | registry `admin_viewport` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380) in the `env` source, Dealer Portal row. Read the login and password there (or from `/.env`) at run time; never write them into the log | `env` |
| **Test data** | Vehicle **915** — Ford Focus 2008, VIN `1FAHP35NX8W239204`. It is only the starting point of **Create quote**; the cases never edit the vehicle record. Vehicle 915 already has contracts from other tickets on `/permaplate-contracts`, so **always find a row by this case's client last name**, never by VIN alone. **Quote 6276 and every quote of another ticket must not be used or changed** | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` switches the session to English; switch back to the language found at the start when the run ends | `domain` (quote-creation.md) |
| **Known defect on this page** | Leaving "Financing company" on "Choose" and clicking "Generate Contract" returned HTTP 500 on 2026-09-06 (AP-2459, status QA). AP2506_006 and _007 choose a company so that a failure cannot be that defect; AP2506_008 leaves it on "Choose" on purpose | AP-2459 capture |
| **Leaves behind** | Quote C (AP2506_006) with one Esthetic protection contract and any invoice it raises — reused by AP2506_009, which submits nothing; quote D (AP2506_007) and quote E (AP2506_008), each with a contract if the submit is accepted. Every quote id and contract row is listed in the execution log. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — client and quote.** Open `/vehicle/915/details?_locale=en` and
click **Create quote**, then enter: First name `Esthetic`, Last name as given in the case,
Email `client.stage.NNN@yopmail.com` (next unused number, recorded), Address
`200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone
`5145550301`, Work phone `5145550302`, "I agree to the policy" ticked → **Save**. The
browser lands on `/quote/{id}/details`; record the quote id. Then at `/quote/{id}/vehicle`
keep the pre-attached vehicle (VIN `1FAHP35NX8W239204`), Delivered at = **the run date**
(recorded as `RUN_DATE`), Price `25000` → **Save**.

**Shared build values — Esthetic protection.** At `/quote/{id}/permaplate` select the
**first product radio** and tick the **first option that becomes enabled** → **Save**.
Record the product name, the option name and the Cost the quote page then shows. If no
product is offered, record the page text and mark the case **BLOCKED** ("no Esthetic
protection product linked to dealer 1380") — dealer configuration, not a fault of AP-2506.

**Known blockers** — None at design time. If no Esthetic protection product is offered
(see above), every case is BLOCKED during execution.

> No case in this file ships BLOCKED. All four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2506_006 | Submitting the Esthetic protection contract page with its pre-filled values creates a contract with a downloadable PDF | Functional | High | Not Run |
| AP2506_007 | Submitting with the owner's last name emptied does not crash the page or lose the other values | Negative | Medium | Not Run |
| AP2506_008 | Submitting with "Financing company" left on "Choose" does not return a server error | Negative | Medium | Not Run |
| AP2506_009 | Opening the contract page for a quote whose Esthetic protection contract already exists does not crash | Edge-case | Medium | Not Run |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Revisions

| Date | TC ID | Change | Why |
|---|---|---|---|
| 2026-11-01 | AP2506_008 | Step 4 no longer requires the refusal message to sit beside "Financing company", nor one of two named outcomes; it fails only on an error page, HTTP 5xx or a lost value, and records the outcome, message text and position | R2 round 1 finding F-1 — the message position is open (Q-003, Q-008) |
| 2026-11-01 | AP2506_006 | Step 5 no longer judges the client name on the PDF; it records the client name and contract number. The download's HTTP 200 `application/pdf` (recorded in `domain`) is still judged | Independent R2 round 1 (01:58) finding F-5 — test plan §2.2 records PDF content, does not judge it |
| 2026-11-01 | AP2506_007 | Step 4 accepts postal code `H2X 1Y4` with or without the space | Same formatting tolerance as AP2506_005 (independent R2 finding F-4) |

---

## Test Cases

---

### AP2506_006 — Submitting the Esthetic protection contract page with its pre-filled values creates a contract with a downloadable PDF

| Field | Value |
|---|---|
| **TC ID** | AP2506_006 |
| **Title** | Submitting the Esthetic protection contract page with its pre-filled values creates a contract with a downloadable PDF |
| **Requirement** | AP2506 — REQ-005: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process."; description "Contract creation, invoice, financing, and PDF behaviour stay unchanged." |
| **Route** | `/quote/{id}/permaplate-create-contract` → **Generate Contract** → `/permaplate-contracts` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** Creating the contract is the business outcome of the page. The case
judges what `domain` records about an Esthetic protection contract — it is listed on the
dealer's "Esthetic protection contracts" and its PDF downloads. What the dealer sees right
after submit, and whether an invoice is raised, have no recorded baseline (Q-009), so they
are recorded. A financing company is chosen so that the known AP-2459 defect cannot cause
the result. The quote built here (quote C) is reused by AP2506_009.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-006` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option |
| Financing company | The first company listed after "Choose" (recorded) — only if the page has the field |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `Owner2506-006`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | The quote page shows heading `#{id} - Esthetic Owner2506-006` and the Esthetic protection entry; the quote id (quote C), product, option and Cost are recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action (fallback: type `/quote/{id}/permaplate-create-contract`, recorded). If a "Financing company" field is on the page, choose the first company after "Choose" and record it (Q-003); change nothing else | The contract page loads without an error page or HTTP 5xx; the company chosen is shown in the field |
| 3 | Click **"Generate Contract"** | The page submits and the browser shows a page without an error page or HTTP 5xx. Record the address, any message word for word, and any invoice link or notice (Q-009) |
| 4 | Open `/permaplate-contracts` and find the row whose client name is `Esthetic Owner2506-006` | The list loads without an error page or HTTP 5xx; record the row's VIN and Contract cost price |
| 5 | [Verification] Check the row and its **Download** action | Exactly one row for `Esthetic Owner2506-006` is listed, with VIN `1FAHP35NX8W239204` — the contract was created. Its Download opens `/quote/{quote C id}/permaplate-contract-download` and returns a PDF (HTTP 200, `application/pdf`). The PDF's content is recorded, not judged (test plan §2.2): record the client name it shows and its contract number |

---

### AP2506_007 — Submitting with the owner's last name emptied does not crash the page or lose the other values

| Field | Value |
|---|---|
| **TC ID** | AP2506_007 |
| **Title** | Submitting with the owner's last name emptied does not crash the page or lose the other values |
| **Requirement** | AP2506 — REQ-005: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process." — the case covers values that may not be valid |
| **Route** | `/quote/{id}/permaplate-create-contract` → **Generate Contract** |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The story only speaks of "valid form values"; which fields are
required and how the page answers an invalid one are not stated (Q-008). The case records
whether the submit is refused or accepted, and fails only on an objective fault: an error
page or HTTP 5xx, or values the dealer did not touch being lost when the page is shown
again. If the owner fields cannot be edited at all (Q-007), the case is recorded as
SKIPPED with that reason.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-007` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option |
| Financing company | The first company listed after "Choose" (recorded) — only if the page has the field |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `Owner2506-007`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | A quote with Esthetic protection exists; its id (quote D) is recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action (fallback: type the address, recorded). If a "Financing company" field is present, choose the first company after "Choose". Clear the owner's Last name field completely | The page loads without an error page or HTTP 5xx; the Last name field is empty |
| 3 | Click **"Generate Contract"** | No error page or HTTP 5xx appears. Record whether the submit is refused (message text and where it shows) or accepted (Q-008) |
| 4 | [Verification] Inspect the page and, if the submit was accepted, `/permaplate-contracts` | If the page is shown again, every field the dealer did not touch keeps its value (first name `Esthetic`, VIN `1FAHP35NX8W239204`, city `Montréal`, postal code `H2X 1Y4` with or without the space, the chosen financing company, and the Program Summary values shown before step 3). Record whether a contract was created for quote D and with which client name (Q-008); list any contract row in the log |

---

### AP2506_008 — Submitting with "Financing company" left on "Choose" does not return a server error

| Field | Value |
|---|---|
| **TC ID** | AP2506_008 |
| **Title** | Submitting with "Financing company" left on "Choose" does not return a server error |
| **Requirement** | AP2506 — REQ-005: description "Contract creation, invoice, financing, and PDF behaviour stay unchanged."; AC 4 "contract is created following the current process" |
| **Route** | `/quote/{id}/permaplate-create-contract` → **Generate Contract** |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** A dealer selling Esthetic protection for cash has no financing
company to pick. On the old form this returned HTTP 500 (AP-2459, still in status QA). The
story does not say whether the field is required (Q-003, Q-008), so the case does not
assert "created" or "refused"; it fails only on an error page or HTTP 5xx. A FAIL here
goes to Gate C as a likely match for AP-2459 rather than a new bug. If the page has no
"Financing company" field at all, the case is recorded as SKIPPED with that reason (Q-003).

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-008` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option |
| Financing company | Left on "Choose" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `Owner2506-008`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | A quote with Esthetic protection exists; its id (quote E) is recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action (fallback: type the address, recorded). Confirm "Financing company" shows "Choose" and change nothing | The page loads without an error page or HTTP 5xx; "Financing company" shows "Choose" |
| 3 | Click **"Generate Contract"** | Record the HTTP status of the response, the address and any message word for word |
| 4 | [Verification] Inspect the page and `/permaplate-contracts` | No error page and no HTTP 5xx in step 3. If the contract page is shown again, every other value is kept (first name `Esthetic`, last name `Owner2506-008`, VIN `1FAHP35NX8W239204`, the Program Summary values). Record whether a contract row for `Esthetic Owner2506-008` is listed on `/permaplate-contracts`, the page landed on, and any message text and where it shows (Q-003, Q-008); list any contract row in the log |

---

### AP2506_009 — Opening the contract page for a quote whose Esthetic protection contract already exists does not crash

| Field | Value |
|---|---|
| **TC ID** | AP2506_009 |
| **Title** | Opening the contract page for a quote whose Esthetic protection contract already exists does not crash |
| **Requirement** | AP2506 — REQ-001: AC 1 "Given a quote with … no contract" — the case covers the opposite state; description "The route `/quote/{quoteId}/permaplate-create-contract` … stays the same" |
| **Route** | `/quote/{id}/details` → `/quote/{id}/permaplate-create-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** AC 1 starts from a quote with "no contract", which implies the
action may behave differently once a contract exists — but the story does not say how
(Q-010). The case records whether the action is still offered and what the address shows,
and fails only on an error page or HTTP 5xx. It never clicks "Generate Contract", so no
second contract is created.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote C from AP2506_006, after its contract was generated. If AP2506_006 did not create a contract, this case is BLOCKED ("no quote with an Esthetic protection contract from this run") |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`) and confirm on `/permaplate-contracts` that a row for `Esthetic Owner2506-006` exists; record quote C's id | The row exists; otherwise the case is BLOCKED as stated in Test Data |
| 2 | Open quote C at `/quote/{id}/details` and inspect its Esthetic protection entry and actions menu | The quote page loads without an error page or HTTP 5xx. Record whether a create-contract action is still offered, and any other control the entry now shows (download, view) (Q-010) |
| 3 | Type `/quote/{id}/permaplate-create-contract` into the address bar and press Enter. Do **not** click "Generate Contract" | Record the HTTP status, the address landed on and what the page shows (form, message, redirect) (Q-010) |
| 4 | [Verification] Inspect the outcome of steps 2 and 3 and `/permaplate-contracts` | No error page and no HTTP 5xx in steps 2 or 3; `/permaplate-contracts` still lists exactly one row for `Esthetic Owner2506-006` — opening the page created no second contract |

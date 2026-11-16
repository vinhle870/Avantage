# Test Cases — AP2503 (File 2 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2503 — Generate contract for a quote's extended warranty
**Source:** requirements/AP-2503-generate-contract-for-a-quotes-extended.md · qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md (updated 2026-11-15) · qa-artifacts/2-test-plan/AP-2503_test-plan.md (version 2.0)
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revised:** 2026-11-15 — re-designed with the QA's answer to Q-001 – Q-011 (record-only steps now judged; record-and-accept steps added); bug AP-2532 kept open, so AP2503_007 keeps its failing expected result. Earlier: 2026-11-01 — s3 rework for review R2 round 1
**TC Range:** AP2503_006 to AP2503_010 (5 test cases)
**Coverage:** Functional · Regression · Negative · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory `/vehicle/inventory` → add a passenger vehicle at `/vehicle/new/edit/PASSENGER` → `/vehicle/{vehicleId}/details` → **Create quote** → `/quote/new/client?fromVehicleId={vehicleId}` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`. The page under test is `/quote/{id}/warranty/generate-contract`. The dealer's warranty contract list is Contracts → Warranty, `/warranty` | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | Quote page → "Summary of products" → **Extended warranty** row → **⋯** dropdown: **Edit** · **Generate Contract** · **Delete**. The submit button on the page is **"Generate Contract"** (`#warranty_finalize_save`) | `domain` (quote-creation.md, Dev section mapped 2026-11-02) |
| **Post-submit baseline (Q-007, Answered)** | The dealer lands on `/quote/{id}/details` with the message "Invoice #N ($amount) is created" and no separate contract message; the invoice amount is the warranty **cost** shown on the Extended warranty row (CA$456.00 for the first program on 2026-11-02), not the sale price; the row's ⋯ menu is replaced by the contract number link (`/warranty/{contractId}`) and a PDF icon (`/warranty/{contractId}/pdf`, opens a PDF inline); a "Download all documents" link appears; `/warranty` lists the contract "Pending approval" with its invoice "Payment pending" and the start date | requirements analysis Q-007 (execution log 2026-11-02) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | **Dev (v2dev)** — `DEALER_PORTAL_URL` of the `env` source, Dev Environment section (`execution_env` = Dev) | `env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | No standing record is used. **Vehicle 915 and quote 6276 must not be used** — they are reserved for other tickets. The records of the 2026-11-02 run (vehicles 1125–1129, quotes 6557–6561, contracts APOP01-845/846/847) are not reused. Every vehicle, client and quote is created by the case itself, with the shared build values below | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | **Permanent warranty contracts with their invoices — a contract cannot be deleted:** AP2503_006, AP2503_007 and AP2503_009 each create one contract and one invoice; AP2503_008 creates one more only if Dev accepts an empty start date (step 4). So three or four contracts per run. AP2503_007, _008 and _009 also leave one vehicle, one client and one quote each; AP2503_006 submits quote B from AP2503_004 (or leaves its own vehicle, client and quote if it must build one); AP2503_010 reuses quote A (or leaves its own). Every contract, invoice, quote and vehicle id is listed in the execution log. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — vehicle.** At `/vehicle/inventory` add a passenger vehicle
(`/vehicle/new/edit/PASSENGER`): VIN `AP2503TC0NN{RUN_STAMP}`, where `NN` is the case
number and `RUN_STAMP` is the six-digit UTC date and hour the execution run started,
`MMDDHH`, recorded once at the top of the execution log (17 characters; do **not** press
"Décoder"/"Decode"). If the inventory refuses the VIN as a duplicate, raise its last digit
by one until it is accepted (wrap 9 → 0) and record the VIN used. Make `Toyota`, Model
`Corolla`, Year `2023`, Kilometers `12000`, Vehicle Price `25000`, Condition new, Fuel type
"Gasoline", Transmission "Automatic", Cylinders `4`, Engine size `1.8` (both required on
Dev, no default), and for any other field the form marks required, its first option
(record each) → **Save**. Record the vehicle id.

**Shared build values — client and quote.** On that vehicle's page click **Create quote**,
then: First name `Contract`, Last name as given in the case, Email
`client.stage.2503NNN.{RUN_STAMP}@yopmail.com` (`NNN` = the case number, recorded), Address
`200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone
`5145550201`, Work phone `5145550202`, "I agree to the policy" ticked → **Save**. On the
quote page, edit the Vehicle (`/quote/{id}/vehicle`): keep the pre-attached vehicle,
Delivered at = **the run date** (recorded as `RUN_DATE`; type it — Dev may pre-fill the day
before), Price `25000` → **Save**. The red alert "The delivery date has passed the
acceptable timeframe…" on the generate-contract page is recorded, not judged (AP-2489).

**Shared build values — extended warranty.** On the quote page add an extended warranty
with the **+** on the "Extended warranty" row of "Summary of products" (or "Click here to
create a warranty", `/quote/{id}/warranty/edit`): choose the **first program** and its
**first term** listed, Sale price `2500` → **Save**. Record the program, option, term, sale
price and the **Cost** the expanded row shows. If no program is offered for the vehicle,
record the notice text and mark the case **BLOCKED** ("no extended-warranty program for a
fresh vehicle").

**Picking a financing company (setup around AP-2532).** On a quote **without** financing,
the "Financing information" section has six required, empty company fields, and the
browser refuses the submit until they are filled (AP-2532, open). Where a step says
*"pick a financing company"*, choose the **first company** in the "Financing Company"
picker (AutoCapital Canada on 2026-11-02) — it fills the six fields — and record its name.

**Known blockers** — None at design time.

**Open bug this file still expects to fail on** — kept open and valid by the QA
(2026-11-15); the acceptance criterion wins over the current behaviour:

| Bug | Case · step | What the step expects (AC text) |
|---|---|---|
| AP-2532 | AP2503_007 step 3 | A quote with "a vehicle and an extended warranty" (AC 1) and no financing is submitted and the "contract is created following the current process" (AC 4) |

> No case ships BLOCKED. Executed 2026-11-15 on Dev (v2dev) — results in each header and in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-15.md`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2503_006 | Submitting the generate-contract page with its pre-filled values creates the contract and its invoice as before | Regression | High | PASS |
| AP2503_007 | A no-financing quote submits, and the start date and owner details edited on the page reach the contract only | Functional | High | FAIL |
| AP2503_008 | An emptied owner last name is refused by the browser before submit, keeping the other values and creating no contract | Negative | Medium | FAIL |
| AP2503_009 | A warranty start date 30 days before delivery is accepted and becomes the start date of the created contract | Edge-case | Medium | PASS |
| AP2503_010 | The generate-contract page opens for a quote with no financing, pre-fills owner and vehicle, and shows empty company fields | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2503_006 — Submitting the generate-contract page with its pre-filled values creates the contract and its invoice as before

| Field | Value |
|---|---|
| **TC ID** | AP2503_006 |
| **Title** | Submitting the generate-contract page with its pre-filled values creates the contract and its invoice as before |
| **Requirement** | AP2503 — REQ-005: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process"; description "Contract creation, invoice, financing, and PDF behaviour stay unchanged". Q-007 Answered 2026-11-15 ("all current behavior actual result is correct as expected"): the post-submit baseline in the Execution Context; Q-011 Answered: the ⋯ menu is replaced by the contract link and PDF icon once a contract exists |
| **Route** | `/quote/{id}/warranty/generate-contract` → submit → `/quote/{id}/details` → `/warranty` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | PASS — contract APOP01-848, invoice #952 ($456.00) (previous run 2026-11-02, Dev: PASS — contract APOP01-845, invoice #942) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Title; steps 3–5 judge the landing page and invoice message, the invoice amount = the warranty cost, the contract link, PDF icon and "Download all documents", and the `/warranty` row "Pending approval" / "Payment pending" | Q-007, Q-011 Answered | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** The new page must still produce the contract — the legal document
— and its invoice. Q-007 makes what Dev did on 2026-11-02 the agreed "current process",
so each post-submit screen is now judged. The case uses the quote with financing from
AP2503_004 (quote B), so the financing company is already filled and the submit is not
stopped by AP-2532. **Leaves a permanent contract and invoice.**

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote B from AP2503_004, if it exists and has no contract; otherwise build one (VIN `AP2503TC006{RUN_STAMP}`, last name `Owner2503-006`) with the financing values of AP2503_004 step 2 |
| Warranty cost | The Cost recorded on the quote's Extended warranty row when the warranty was added |
| Form values | Leave every pre-filled value as it is |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote B from AP2503_004 if its Extended warranty row still has the ⋯ menu with "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC006{RUN_STAMP}`), build a quote with the shared client values (last name `Owner2503-006`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`), then at `/quote/{id}/financing` enter Date of birth `1985-06-15`, Type "Financing", Base amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, the first Financing company → **Save** | A quote with an extended warranty and a financing exists; its id and the warranty cost are recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` and record the start date and sale price the Program Summary shows | The page loads without an error page or HTTP 5xx; the start date is the delivery date and the sale price `2500` |
| 3 | Without changing anything, click **"Generate Contract"** | The browser lands on `/quote/{id}/details` with the message "Invoice #N ($amount) is created", where the amount equals the warranty cost recorded in step 1 (not the `2500` sale price); no error page or HTTP 5xx. The invoice number is recorded |
| 4 | On the quote page, inspect the Extended warranty row and open its PDF icon | The ⋯ menu is gone; the row shows the contract number as a link to `/warranty/{contractId}` and a PDF icon that opens `/warranty/{contractId}/pdf` as a PDF (the contract document with its contract number); a "Download all documents" link is shown. The contract number and id are recorded |
| 5 | [Verification] Open `/warranty` and find the row for the case's client (`Contract Owner2503-…`) or VIN | A warranty contract row is listed with this client and VIN, the contract number from step 4, the start date read in step 2, status "Pending approval" and the invoice from step 3 marked "Payment pending" |

---

### AP2503_007 — A no-financing quote submits, and the start date and owner details edited on the page reach the contract only

| Field | Value |
|---|---|
| **TC ID** | AP2503_007 |
| **Title** | A no-financing quote submits, and the start date and owner details edited on the page reach the contract only |
| **Requirement** | AP2503 — REQ-003 "Warranty start date (editable)"; REQ-005 AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process"; AC 1 "Given a quote with a vehicle and an extended warranty from a program". **AC 1 / AC 4 win for the submit of a quote without financing — bug AP-2532 is open.** Answered 2026-11-15 ("all current behavior actual result is correct as expected"): Q-004 — a later start date becomes the contract's start date; Q-007 — the post-submit baseline; Q-009 — owner edits reach the contract only, the quote's client is unchanged (judged for the work phone; an edited name and address are record-and-accept) |
| **Route** | `/quote/{id}/warranty/generate-contract` → submit → `/warranty` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | FAIL at step 3 — no-financing quote refused on the required Financing company (AP-2532); then APOP01-849, invoice #953 (previous run 2026-11-02, Dev: FAIL at step 3 → AP-2532; contract APOP01-846 created after picking a company) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Title; step 2 also edits First name and Address; step 3 says how to continue after the AP-2532 refusal; step 5 judges the phone on the contract only and records and accepts the edited name and address on the contract (record-and-accept). **Step 3's expected result is unchanged** | Q-004, Q-007, Q-009 Answered; AP-2532 kept open — AC 1 / AC 4 win | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** A quote needs only a vehicle and an extended warranty (AC 1), so a
dealer without financing must be able to generate the contract. On Dev the empty
financing-company fields stop the submit (AP-2532, open): until that bug is fixed this
case FAILs at step 3, and the FAIL is linked to AP-2532. Step 3 then picks a company so
the start date and the owner edits — the values the dealer signs — are still judged.
**Leaves a permanent contract and invoice.**

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC007{RUN_STAMP}` |
| Client last name | `Owner2503-007` |
| Start date entered | `RUN_DATE` + 7 days |
| Owner edits | Work phone → `5145550299`, First name → `ContractEd`, Address → `300 Rue Edit` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create a vehicle with the shared vehicle values (VIN `AP2503TC007{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-007`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`). Add **no** financing | A quote with an extended warranty and no financing exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract`; set the warranty start date to `RUN_DATE` + 7 days, and in "Owner information" change the work phone to `5145550299`, First name to `ContractEd` and Address to `300 Rue Edit` | The page loads without an error page or HTTP 5xx; the fields show the new start date, `5145550299`, `ContractEd` and `300 Rue Edit` |
| 3 | Click **"Generate Contract"** | The page submits: the browser lands on `/quote/{id}/details` with "Invoice #N ($amount) is created" (Q-007). If instead the page stays and the browser refuses the empty financing-company fields ("Please fill out this field."), the step **FAILs** (AP-2532) — screenshot the empty fields, then pick a financing company (Execution Context) and click "Generate Contract" again so steps 4–5 can run; record the company used |
| 4 | Open `/warranty`, find the row for VIN `AP2503TC007{RUN_STAMP}`, and open its contract PDF (`/warranty/{contractId}/pdf`) | The contract is listed with status "Pending approval" and its invoice "Payment pending"; the PDF opens and shows the contract number; the contract number and id are recorded |
| 5 | [Verification] Read the start date on the `/warranty` row and in the PDF, look for the edited owner values in the PDF, then open the quote's client form `/quote/{id}/client` | The contract's start date is `RUN_DATE` + 7 days on both the list and the PDF (Q-004). The PDF shows the phone number `5145550299`; the quote's client still has work phone `5145550202` (Q-009). **Record-and-accept (Q-009):** record whether the PDF shows `ContractEd` and `300 Rue Edit` or the original `Contract` and `200 Rue Test` — accepted either way; the quote's client must still read First name `Contract` and Address `200 Rue Test` (a changed client is a FAIL — Q-009) |

---

### AP2503_008 — An emptied owner last name is refused by the browser before submit, keeping the other values and creating no contract

| Field | Value |
|---|---|
| **TC ID** | AP2503_008 |
| **Title** | An emptied owner last name is refused by the browser before submit, keeping the other values and creating no contract |
| **Requirement** | AP2503 — REQ-005 AC 4 "Given valid form values …"; REQ-004 AC 3 "owner fields are editable". Answered 2026-11-15 ("all current behavior actual result is correct as expected"): Q-006 — an emptied required owner field is refused by the browser's own check ("Please fill out this field."), with no message in the page, no request sent, the other values kept and no contract; which **other** owner fields are required is record-and-accept. Q-004 — an **empty** start date is record-and-accept |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | FAIL at step 4 — empty start date returns HTTP 500 (new, F5); no contract (previous run 2026-11-02, Dev: PASS — no contract) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Title; step 2 picks a financing company first; step 3 judges the browser's refusal; step 3 records and accepts the other required owner fields; steps 4–5 added — an empty start date on submit (record-and-accept) | Q-006, Q-004 Answered; AP-2532 open (setup only) | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** The browser's own check is the only guard against an incomplete
contract; if it is lost, a contract without the client's name is created. A company is
picked first so that only the owner field is under test (the empty company fields are
AP-2532's defect). Steps 4–5 record what an empty start date does — never tried on
2026-11-02. **May leave one permanent contract** (only if step 4's submit is accepted).

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC008{RUN_STAMP}` |
| Client last name | `Owner2503-008` (emptied in step 2, typed back in step 4) |
| Financing company | The first company in the picker (recorded) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create a vehicle with the shared vehicle values (VIN `AP2503TC008{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-008`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract`, pick a financing company (Execution Context), clear the owner's Last name completely, and click **"Generate Contract"** | The page loads without an error page or HTTP 5xx. After the click the browser refuses the form with its own tooltip "Please fill out this field." on Last name; the address stays `/quote/{id}/warranty/generate-contract`; no request is sent and no message appears in the page |
| 3 | [Verification] Inspect the page, read which owner fields are marked required, then open `/warranty` | Every untouched value is kept: First name `Contract`, City `Montréal`, Postal code `H2X 1Y4`, the start date `RUN_DATE`, Sale price `2500`; Last name is empty. `/warranty` has no row for `Owner2503-008` or VIN `AP2503TC008{RUN_STAMP}`. **Record-and-accept (Q-006):** record every owner field marked required (asterisk or browser `required`) — accepted as shown |
| 4 | Return to the page, type `Owner2503-008` back into Last name, clear the warranty start date completely, and click **"Generate Contract"** | No error page or HTTP 5xx appears. **Record-and-accept (Q-004):** record whether the submit is refused (by the browser or by a message — record its text) or accepted (landing page and invoice message) — accepted either way |
| 5 | [Verification] Inspect the page or the quote page, then `/warranty` | If refused: the page keeps every other value (Last name `Owner2503-008`, Sale price `2500`) and `/warranty` has no row for this VIN. If accepted: `/warranty` lists one contract for VIN `AP2503TC008{RUN_STAMP}` — record its contract number, invoice and the start date it was given (accepted); list the ids in the log as left behind |

---

### AP2503_009 — A warranty start date 30 days before delivery is accepted and becomes the start date of the created contract

| Field | Value |
|---|---|
| **TC ID** | AP2503_009 |
| **Title** | A warranty start date 30 days before delivery is accepted and becomes the start date of the created contract |
| **Requirement** | AP2503 — REQ-003 "Warranty start date (editable)", "Warranty sale price"; REQ-005 AC 4. Answered 2026-11-15 ("all current behavior actual result is correct as expected"): Q-004 — a date 30 days before delivery is accepted and becomes the contract's start date; Q-005 — an **edited** sale price reaching the contract or invoice is record-and-accept |
| **Route** | `/quote/{id}/warranty/generate-contract` → submit → `/warranty` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | PASS — contract APOP01-850 starts 2026-10-16, invoice #954 (previous run 2026-11-02, Dev: PASS — contract APOP01-847) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Title; steps 2–4 judge that the earlier date is accepted and becomes the contract's start date; step 2 also edits the sale price to `2600` and step 5 records and accepts where it appears (record-and-accept); a financing company is picked before submit | Q-004, Q-005 Answered; AP-2532 open (setup only) | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** Making the start date editable opens the door to a warranty that
starts before the vehicle was delivered; the answer accepts that, so the case checks the
contract carries exactly the date entered. The sale price is editable too, and nobody
recorded where an edited price ends up — the contract PDF, the invoice or nowhere. A
company is picked first so that only the date and the price are under test (AP-2532).
**Leaves a permanent contract and invoice.**

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC009{RUN_STAMP}` |
| Client last name | `Owner2503-009` |
| Start date entered | `RUN_DATE` − 30 days |
| Sale price entered | `2600` (was `2500`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create a vehicle with the shared vehicle values (VIN `AP2503TC009{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-009`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id and the warranty cost are recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract`, set the warranty start date to `RUN_DATE` − 30 days and the Sale price to `2600` | The page loads without an error page or HTTP 5xx; the start date control accepts the earlier date and shows `RUN_DATE` − 30 days (no limit stops it); the sale price shows `2600` |
| 3 | Pick a financing company (Execution Context) and click **"Generate Contract"** | The submit is accepted: the browser lands on `/quote/{id}/details` with "Invoice #N ($amount) is created"; no error page or HTTP 5xx. Record the invoice number and amount |
| 4 | [Verification] Open `/warranty` and find the row for VIN `AP2503TC009{RUN_STAMP}` | One contract is listed for this VIN with the start date `RUN_DATE` − 30 days (not the delivery date or any other date), the delivery date `RUN_DATE`, status "Pending approval" and the invoice from step 3; the contract number is recorded |
| 5 | [Verification] Open the contract PDF (`/warranty/{contractId}/pdf`) and the invoice from step 3 | The PDF opens and shows the start date `RUN_DATE` − 30 days. **Record-and-accept (Q-005):** record which sale price the PDF shows (`2600`, `2500` or none) and whether the invoice amount differs from the warranty cost recorded in step 1 — accepted either way |

---

### AP2503_010 — The generate-contract page opens for a quote with no financing, pre-fills owner and vehicle, and shows empty company fields

| Field | Value |
|---|---|
| **TC ID** | AP2503_010 |
| **Title** | The generate-contract page opens for a quote with no financing, pre-fills owner and vehicle, and shows empty company fields |
| **Requirement** | AP2503 — REQ-004 AC 3 "Given the quote has a vehicle, a client or a financing, when the page renders, then vehicle, owner and financing values are pre-filled"; AC 1 "a quote with a vehicle and an extended warranty from a program". Q-008 Answered 2026-11-15 ("all current behavior actual result is correct as expected"): the "Financing Company" picker at "Choose" and six empty company fields, with no message. That those fields stop the submit is AP-2532 (judged in AP2503_007, not here) |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) — execution-log_AP-2503_2026-11-15.md |
| **Result** | PASS — no Financing card (AP-2559), picker at "Choose" in the Product Summary (previous run 2026-11-02, Dev: PASS) |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-15 | Title; step 3 judges the financing section's display (picker at "Choose", six empty company fields, no message) | Q-008 Answered (display only; AP-2532 open) | The QA, in chat, 2026-11-15 (capture § Ticket changes since capture — 2026-11-15) |

**Why this matters:** AC 1 needs only a vehicle and an extended warranty — a financing is
optional. The page must still open for a quote without one and show what Q-008 accepts.
The case does not submit, so it neither passes nor fails on AP-2532.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2503_001 (no financing), if it exists and has no contract; otherwise build one (VIN `AP2503TC010{RUN_STAMP}`, last name `Owner2503-010`) and add **no** financing |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2503_001 if its Extended warranty row still has the ⋯ menu with "Generate Contract" and it shows no financing; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC010{RUN_STAMP}`) and build a quote with the shared client values (last name `Owner2503-010`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`), adding no financing | A quote with an extended warranty and no financing exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the page | Owner information is pre-filled with first name `Contract` and the case's last name; Vehicle identification shows the case's VIN; the "Program Summary" and the "Generate Contract" button are present. "Financing information" shows the "Financing Company" picker at "Choose" and six empty fields — company name, phone, address, city, province, postal code — with no message. Leave the page without submitting |

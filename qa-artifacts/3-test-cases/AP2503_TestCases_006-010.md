# Test Cases — AP2503 (File 2 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2503 — Generate contract for a quote's extended warranty
**Source:** requirements/AP-2503-generate-contract-for-a-quotes-extended.md · qa-artifacts/1-requirements-analysis/AP-2503_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2503_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**Revised:** 2026-11-01 — s3 rework for review R2 round 1 (F-2: AP2503_009 step 4 BLOCKED rule; F-3: write-back note; F-4: per-run VINs, banner source)
**TC Range:** AP2503_006 to AP2503_010 (5 test cases)
**Coverage:** Functional · Regression · Negative · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | Inventory `/vehicle/inventory` (to create the case's vehicle) → `/vehicle/{vehicleId}/details` → **Create quote** → `/quote/new/client?fromVehicleId={vehicleId}` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`. The page under test is `/quote/{id}/warranty/generate-contract`. The dealer's warranty contract list is Contracts → Warranty, `/warranty` (route known, page not mapped) | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | On the quote page, the **Extended warranty** row carries an actions menu; its **"Generate Contract"** item links to `/quote/{id}/warranty/generate-contract`. Before AP-2503 the modal's submit (`#warranty_finalize_save`) created the contract and its invoice, after which the quote page showed a link to `/invoice/{invoiceId}`. Not in the knowledge sources — taken from the automation suite (`playwright-automation/src/pages/dealerPortal/QuoteDetailPage.ts`, `WarrantyDetailsPage.ts`, `src/flows/DealerFlow.ts`). **Write-back owed:** after execution (s4), write the action's real location, the generate-contract page and the post-submit screens back to the `domain` source (`quote-creation.md`) | automation suite (unverified — write back to `domain` after s4) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | No standing record is used. **Vehicle 915 and quote 6276 must not be used** — they are reserved for other tickets. Every vehicle, client and quote is created by the case itself, with the shared build values below | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English; switch back to the language found at the start when the run ends | `domain` (quote-creation.md) |
| **Leaves behind** | AP2503_006 and AP2503_007 each create one extended-warranty contract and, if the current process does, one invoice; AP2503_008 and AP2503_009 may create one each if the page accepts the submit. Each built quote also leaves one vehicle and one client. Every contract, invoice, quote and vehicle id is listed in the execution log. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — vehicle.** At `/vehicle/inventory` use the add-vehicle control
(label not mapped yet; record it): VIN `AP2503TC0NN{RUN_STAMP}`, where `NN` is the case number
and `RUN_STAMP` is the six-digit UTC date and hour the execution run started, `MMDDHH`
(e.g. `110114` for 1 Nov, 14:00 UTC), recorded once at the top of the execution log — so
every run uses VINs no earlier run used (17 characters; do **not** press "Décoder"/"Decode").
If the inventory still refuses the VIN as a duplicate, raise its last digit by one until it
is accepted (wrap 9 → 0) and record the VIN actually used; every later reference to "the
case's VIN" means the recorded one. Make `Toyota`, Model `Corolla`, Year
`2023`, Kilometers `12000`, Fuel type "Gasoline" (French "Essence"), Vehicle type the first
passenger-car option (record its label), Price `25000`, and for any other field the form
marks required, its first option (record each) → **Save**. If `Toyota` / `Corolla` are not
offered, take the first Make and Model and record them. Record the vehicle id from
`/vehicle/{vehicleId}/details`.

**Shared build values — client and quote.** On that vehicle's page click **Create quote**,
then: First name `Contract`, Last name as given in the case, Email
`client.stage.NNN@yopmail.com` (next unused number, recorded), Address `200 Rue Test`, City
`Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone
`5145550202`, "I agree to the policy" ticked → **Save**. On the quote page, edit the
Vehicle (`/quote/{id}/vehicle`): keep the pre-attached vehicle, Delivered at = **the run
date** (recorded as `RUN_DATE`), Price `25000` → **Save**. If a "The delivery date has
passed the acceptable timeframe" banner appears anywhere in the flow, record its text and
page and continue; it is not judged. _Source: not a knowledge source — seen on the old
warranty form / Generate Contract dialog in
`qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md` (shown even
for today's date) and reported as AP-2489, closed as not a bug. **Unverified** on the new
page._

**Shared build values — extended warranty.** On the quote page add an extended warranty
with whichever control the page offers — the **+** on the "Extended warranty" row of
"Summary of products", or "Click here to create a warranty" (`/quote/{id}/warranty/edit`):
choose the **first program** and its **first term** listed, Sale price `2500` if the form
asks for one → **Save**. Record the program, option, term and sale price used. If no
program is offered for the vehicle, record the notice text and mark the case **BLOCKED**
("no extended-warranty program for a fresh vehicle").

**Contract check (used by AP2503_006, _007).** After a submit, open `/warranty` and look
for a row with the case's client name or VIN. Then open the quote page again and record
what the Extended warranty row now offers (invoice link, contract PDF, a "Generate
Contract" item). The landing page, invoice and PDF behaviour are **record-only** (Q-007):
the story says they "stay unchanged" but no baseline is recorded in the knowledge sources.

**Known blockers** — None at design time. The `/warranty` contract list and the post-submit
screens are not mapped; the executor maps them on first use and writes them back to
`domain`.

> No case ships BLOCKED. All five are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2503_006 | Submitting the generate-contract page with its pre-filled values creates the extended-warranty contract | Functional | High | PASS |
| AP2503_007 | A warranty start date changed on the page before submitting is the start date of the created contract | Functional | High | FAIL |
| AP2503_008 | Submitting with the owner's last name emptied does not crash the page or lose the other values | Negative | Medium | PASS |
| AP2503_009 | Submitting with a warranty start date before the delivery date does not crash the page | Edge-case | Medium | PASS |
| AP2503_010 | The generate-contract page opens for a quote with no financing and still pre-fills owner and vehicle details | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2503_006 — Submitting the generate-contract page with its pre-filled values creates the extended-warranty contract

| Field | Value |
|---|---|
| **TC ID** | AP2503_006 |
| **Title** | Submitting the generate-contract page with its pre-filled values creates the extended-warranty contract |
| **Requirement** | AP2503 — REQ-005: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process"; description "Contract creation, invoice, financing, and PDF behaviour stay unchanged" |
| **Route** | `/quote/{id}/warranty/generate-contract` → submit → `/warranty` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — contract APOP01-845, invoice #942 — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** The new page must still produce the contract — the legal document
and, in the old flow, the invoice. The case uses the quote with financing from AP2503_004
(quote B), so a financing-related failure on submit (as the Permaplate contract had in
AP-2459) would show here. The post-submit landing page, invoice and PDF are recorded, not
judged (Q-007).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote B from AP2503_004, if it exists and has no contract; otherwise build one (VIN `AP2503TC006{RUN_STAMP}`, last name `Owner2503-006`) with the financing values of AP2503_004 step 2 |
| Form values | Leave every pre-filled value as it is |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote B from AP2503_004 if its quote page still offers "Generate Contract"; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC006{RUN_STAMP}`), build a quote with the shared client values (last name `Owner2503-006`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`), then at `/quote/{id}/financing` enter Date of birth `1985-06-15`, Type "Financing", Base amount `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, the first Financing company → **Save** | A quote with an extended warranty and a financing exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` and record the start date and sale price the Program Summary shows | The page loads without an error page or HTTP 5xx |
| 3 | Without changing anything, click **"Generate Contract"** | The page submits and the browser shows a page without an error page or HTTP 5xx. Record the address and any message shown (Q-007) |
| 4 | Open the quote page `/quote/{id}/details` and inspect the Extended warranty entry | The quote page loads without an error page or HTTP 5xx. Record each control the entry now offers, the invoice id and amount if an invoice link is present, and whether the contract PDF opens (Q-007) |
| 5 | [Verification] Open `/warranty` and look for the case's client name (`Contract Owner2503-…`) or VIN | A warranty contract row for this client or VIN is listed — the contract was created; its contract number is recorded in the log |

---

### AP2503_007 — A warranty start date changed on the page before submitting is the start date of the created contract

| Field | Value |
|---|---|
| **TC ID** | AP2503_007 |
| **Title** | A warranty start date changed on the page before submitting is the start date of the created contract |
| **Requirement** | AP2503 — REQ-003 "Warranty start date (editable)"; REQ-005 AC 4 "Given valid form values, when the dealer submits, then contract is created" |
| **Route** | `/quote/{id}/warranty/generate-contract` → submit → `/warranty` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | FAIL — step 3: no-financing quote cannot submit, 6 required financing fields (F3); start date carried to APOP01-846 — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** The start date is the one contract value the story makes editable.
If the edit is accepted on screen but the contract keeps another date, the dealer signs a
contract with a period nobody chose — a lost value, which is an objective fault. Whether
an owner field edited on the page also changes the quote's client is not stated (Q-009),
so that is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC007{RUN_STAMP}` |
| Client last name | `Owner2503-007` |
| Start date entered | `RUN_DATE` + 7 days |
| Owner edit | Work phone → `5145550299` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create a vehicle with the shared vehicle values (VIN `AP2503TC007{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-007`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract`, set the warranty start date to `RUN_DATE` + 7 days, and change the owner's work / cell phone to `5145550299` | The page loads without an error page or HTTP 5xx; the start date shows `RUN_DATE` + 7 days and the phone shows `5145550299` |
| 3 | Click **"Generate Contract"** | The page submits without an error page or HTTP 5xx. Record the address and any message shown (Q-007) |
| 4 | Open `/warranty`, find the contract for `Contract Owner2503-007` or VIN `AP2503TC007{RUN_STAMP}`, and open its details or its contract PDF | The contract is listed; its details or PDF are readable; the contract number is recorded |
| 5 | [Verification] Read the warranty start date on the contract details or PDF, and the client's phone on the quote page `/quote/{id}/details` | The contract's warranty start date is `RUN_DATE` + 7 days, the date entered in step 2. If no contract screen or PDF shows a start date, record that and mark this step BLOCKED (not FAIL). Record whether the contract and the quote's client show the phone `5145550299` or the original `5145550202` (Q-009) |

---

### AP2503_008 — Submitting with the owner's last name emptied does not crash the page or lose the other values

| Field | Value |
|---|---|
| **TC ID** | AP2503_008 |
| **Title** | Submitting with the owner's last name emptied does not crash the page or lose the other values |
| **Requirement** | AP2503 — REQ-005 AC 4 "Given valid form values …" (the invalid side is not described — Q-006); REQ-004 AC 3 "owner fields are editable" |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — refused by browser check, values kept, no contract — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** The story only describes a submit with "valid form values". What
counts as invalid, and what the page should say, is open (Q-006), so the response is
recorded. The case fails only on objective faults: an error page or HTTP 5xx, or values
the dealer did not touch being lost or changed.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC008{RUN_STAMP}` |
| Client last name | `Owner2503-008` (emptied on the page) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create a vehicle with the shared vehicle values (VIN `AP2503TC008{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-008`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` and clear the owner's Last name field completely | The page loads without an error page or HTTP 5xx; the Last name field is empty |
| 3 | Click **"Generate Contract"** | No error page or HTTP 5xx appears. Record whether the submit is refused (and the message text and where it shows) or accepted (Q-006) |
| 4 | [Verification] Inspect the page and, if the submit was accepted, `/warranty` | If the page is shown again, every field the dealer did not touch keeps its value (first name `Contract`, city `Montréal`, postal code `H2X 1Y4`, the start date and sale price shown before step 3). Record whether a contract was created for this quote, and with which last name (Q-006); list any contract id in the log |

---

### AP2503_009 — Submitting with a warranty start date before the delivery date does not crash the page

| Field | Value |
|---|---|
| **TC ID** | AP2503_009 |
| **Title** | Submitting with a warranty start date before the delivery date does not crash the page |
| **Requirement** | AP2503 — REQ-003 "Warranty start date (editable)" (its allowed range is not stated — Q-004); REQ-005 AC 4 |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — start 2026-10-03 accepted, contract APOP01-847 — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** Making the start date editable opens the door to a warranty that
starts before the vehicle was delivered. Whether that is allowed is not stated (Q-004), so
the page's answer is recorded; the case fails only on an error page, HTTP 5xx, or a
contract created with a start date other than the one entered.

**Test Data:**

| Variable | Value |
|---|---|
| Vehicle VIN | `AP2503TC009{RUN_STAMP}` |
| Client last name | `Owner2503-009` |
| Start date entered | `RUN_DATE` − 30 days |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), create a vehicle with the shared vehicle values (VIN `AP2503TC009{RUN_STAMP}`), click **Create quote** and build the quote with the shared client values (last name `Owner2503-009`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`) | A quote with an extended warranty exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` and set the warranty start date to `RUN_DATE` − 30 days | The page loads without an error page or HTTP 5xx; record whether the control accepts the earlier date or limits it (Q-004) |
| 3 | Click **"Generate Contract"** | No error page or HTTP 5xx appears. Record whether the submit is refused (message text) or accepted (Q-004) |
| 4 | [Verification] Inspect the page and, if the submit was accepted, the contract in `/warranty` | If refused: the page is shown again with the other values unchanged (delivery date `RUN_DATE`, owner last name `Owner2503-009`). If accepted: the created contract's start date is the date entered (`RUN_DATE` − 30 days), not another date; the contract id is listed in the log. If no contract screen or PDF shows a start date, record that and mark this step BLOCKED (not FAIL). Record which of the two happened (Q-004) |

---

### AP2503_010 — The generate-contract page opens for a quote with no financing and still pre-fills owner and vehicle details

| Field | Value |
|---|---|
| **TC ID** | AP2503_010 |
| **Title** | The generate-contract page opens for a quote with no financing and still pre-fills owner and vehicle details |
| **Requirement** | AP2503 — REQ-004 AC 3 "Given the quote has a vehicle, a client or a financing, when the page renders, then vehicle, owner and financing values are pre-filled"; AC 1 "a quote with a vehicle and an extended warranty from a program" |
| **Route** | `/quote/{id}/warranty/generate-contract` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run AP-2503 s4 (RUN_STAMP 110201) |
| **Result** | PASS — opens without financing; owner/VIN pre-filled — see qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md |

**Why this matters:** AC 1 needs only a vehicle and an extended warranty — a financing is
optional ("a vehicle, a client or a financing"). The page must still open for a quote
without one. What the "Financing information" section shows then is not stated (Q-008)
and is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2503_001 (no financing), if it exists and has no contract; otherwise build one (VIN `AP2503TC010{RUN_STAMP}`, last name `Owner2503-010`) and add **no** financing |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2503_001 if its quote page still offers "Generate Contract" and shows no financing; otherwise create a vehicle with the shared vehicle values (VIN `AP2503TC010{RUN_STAMP}`) and build a quote with the shared client values (last name `Owner2503-010`), vehicle step (Delivered at `RUN_DATE`, Price `25000`) and extended warranty (first program, first term, Sale price `2500`), adding no financing | A quote with an extended warranty and no financing exists; its id is recorded |
| 2 | Open `/quote/{id}/warranty/generate-contract` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the page | Owner information is pre-filled with the client's first name `Contract` and the case's last name; the vehicle details show the case's VIN; the "Program Summary" and the "Generate Contract" button are present. Record what the "Financing information" section shows — absent, empty fields, or a message (Q-008). Leave the page without submitting |

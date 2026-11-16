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
| **Entry route** | `/vehicle/915/details` → **Create quote** header action → `/quote/new/client?fromVehicleId=915` → `/quote/{id}/details`, the quote page (confirmed on Dev 2026-11-04). Never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500. On Dev the quote vehicle step requires Delivered at. The page under test is `/quote/{id}/permaplate-create-contract` | `navigation` → `domain` (quote-creation.md; vehicle-details.md, Dev 2026-11-04) |
| **Esthetic protection on a quote** | Quote page → Esthetic protection row → `/quote/{id}/permaplate` (heading "Permaplate Quote", card "Esthetic protection Quote": product radios `permaplate_id`, option checkboxes `option_ids[]`, running "Cost: N$", **Save** → `/quote/{id}/details`, "Esthetic protection quote saved successfully"). On Dev dealer 1380 has one product, **3 "10 ans"**; its radio is covered by its label — click the label (`label[for=permaplate_3]`). On Dev the first enabled option is **17 "Peinture – Céramique + Graphene"**, and ticking it also ticks its child **18 "Extra care"**: every option ticked after the click counts as chosen | `domain` (quote-creation.md, Dev 2026-11-02) |
| **Generate Contract action** | On Dev: quote page → **Esthetic protection** row → **⋯** button → menu **Edit** · **Generate Contract** (`/quote/{id}/permaplate-create-contract`) · **Delete**. After a contract is generated the ⋯ menu is replaced by a PDF icon link to `/quote/{id}/permaplate-contract-download` (old form, 2026-11-02; the 2026-11-07 regression saw a second contract control — record what is shown). Record the control's label and place (Q-011). If it is not shown, type `/quote/{id}/permaplate-create-contract` and record that the fallback was used | `domain` (quote-creation.md, Dev 2026-11-02, AP-2428 s4); AP-2491 regression 2026-11-07 |
| **Contract page on Dev** | Redesigned 2026-11-07 to the roadside-style layout: left column H4 "Vehicle identification" (a one-line summary with a collapsed **"Vehicle details"** toggle that holds the vehicle fields) and H4 "Owner identification"; right column H4 "Product Summary" with an editable Start Date and Financing company, then the **"Generate Contract"** button. The older headings "Owner information" and "Program Summary" are gone. **Only AP2506_003 judges heading wording** (AC 2); every other case finds a section by its position and records its actual heading | AP-2491 regression report group C (Dev 2026-11-07); `domain` (quote-creation.md, roadside page, Dev 2026-11-07) |
| **Submitting on Dev** | Old form (2026-11-02): **Generate Contract** → `/quote/{id}/details` with "Esthetic protection contract generated successfully" and "Invoice #N ($…) is created"; a blank VIN or Last name gave "This value should not be blank." and created nothing. The redesigned roadside-style pages (2026-11-07) refuse their pre-filled values: the roadside page needs Stock number, In service date (`yyyy-mm-dd`, same year as the vehicle) and a dashed Home phone `###-###-####` (the refusal can come back as a red flash on `/quote/{id}/details`); the redesigned warranty page needs Financing company. Whether the Esthetic protection page does the same is not known — AP2506_006 records it and submits once more with the stated values | `domain` (quote-creation.md, Dev 2026-11-02 and 2026-11-07); AP-2491 regression row 20 |
| **Esthetic protection contract list** | Dealer sidebar Contracts → "Esthetic protection" → `/permaplate-contracts`, heading "Esthetic protection contracts", columns VIN · Client name · Client phone · Contract cost price · Actions (mapped on staging 2026-10-04; not yet confirmed on Dev — record any difference). No contract number is shown — find a row by this run's unique client last name. **Download** → `/quote/{quoteId}/permaplate-contract-download` (the same address as the quote page's PDF icon), opens in a new tab; the current-process baseline is HTTP 200 `application/pdf` (staging), but on Dev it returns HTTP 500 under **AP-2512** | `domain` (quote-creation.md § Permaplate contract lists; Dev 2026-11-02) |
| **Viewport** | 1280 × 800 | registry `admin_viewport` |
| **Environment** | **Dev (v2dev)** — `execution_env` in `tools.md`; dealer portal URL from the `env` source's "Dev Environment" section. Every fact in this context is a Dev fact unless dated otherwise | `tools.md`; `env` |
| **Login** | The shared dealer account (dealer 1380) in the `env` source's "Dev Environment" section. Read the login and password there at run time; never write them into the log | `env` |
| **Test data** | Vehicle **915** on Dev — Ford Focus 2008, VIN `1FAHP35NX8W239204` (present on Dev 2026-11-04). It is only the starting point of **Create quote**; the cases never edit the vehicle record. Several Dev vehicles share this VIN (915, 863, 1067, 1146, 1147), and vehicle 915 already has Esthetic protection contracts from other tickets (AP-2428 PNA-0000000017 – 19, AP-2501 PNA-0000000020), so **always find a row by this run's unique client last name** (`Owner2506-0NN-<HHMMSS>`, the time the case's quote was built), never by VIN alone. **Quote 6276 and every quote of another ticket must not be used or changed** | `test-data`; `domain` (quote-creation.md, billing-invoices.md) |
| **Language** | EN for every judgement. `?_locale=en` switches the session to English; switch back to the language found at the start when the run ends | `domain` (quote-creation.md) |
| **Known defects on Dev** | **AP-2512** (High, open): the contract PDF download `/quote/{id}/permaplate-contract-download` returns HTTP 500 on Dev (2026-11-02). A 5xx at AP2506_006 step 5 stays a **FAIL** that Gate C links to AP-2512 instead of filing a new bug. Related, filed on Dev before the redesign: AP-2513 (other name on file not pre-filled), AP-2514 (Province free text), AP-2516 (Esthetic protection cost not in the quote subtotal). **AP-2459** (HTTP 500 with Financing company on "Choose") was seen on **staging only** — on Dev "Choose" was accepted on the old form (2026-11-02); AP2506_006 and _007 still choose a company because the redesigned warranty page requires one (regression row 20), and AP2506_008 leaves it on "Choose" on purpose | `domain` (quote-creation.md); AP-2428 run state; AP-2491 regression report |
| **Leaves behind** | Quote C (AP2506_006) with one Esthetic protection contract and the invoice it raises (on Dev the old form raised one) — reused by AP2506_009, which submits nothing; quote D (AP2506_007) and quote E (AP2506_008), each with a contract if the submit is accepted. A refused submit may still save values typed on the page to the quote (seen on the roadside page). Every quote id, client last name, contract row and invoice number is listed in the execution log. The `cleanup` source is missing — nothing is removed | `cleanup` (missing); `domain` (quote-creation.md) |

**Shared build values — client and quote.** Open `/vehicle/915/details?_locale=en` and
click **Create quote**, then enter: First name `Esthetic`, Last name as given in the case,
Email `client.stage.2506NNN@yopmail.com` (NNN = the case number, e.g. `2506006`; reserved for AP-2506, recorded), Address
`200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone
`5145550301`, Work phone `5145550302`, "I agree to the policy" ticked → **Save**. The
browser lands on `/quote/{id}/details`; record the quote id. Then at `/quote/{id}/vehicle`
keep the pre-attached vehicle (VIN `1FAHP35NX8W239204`), Delivered at = **the run date**
(recorded as `RUN_DATE`), Price `25000` → **Save**.

**Shared build values — Esthetic protection.** At `/quote/{id}/permaplate` select the
**first product radio** (click its label) and tick the **first option that becomes enabled**
→ **Save**. Record the product name, **every option ticked** (on Dev, option 17 also ticks
18) and the Cost the quote page then shows. If no
product is offered, record the page text and mark the case **BLOCKED** ("no Esthetic
protection product linked to dealer 1380") — dealer configuration, not a fault of AP-2506.

**Known blockers** — None at design time. If no Esthetic protection product is offered
(see above), every case is BLOCKED during execution.

> No case in this file ships BLOCKED. All four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2506_006 | Submitting the Esthetic protection contract page with valid values creates a contract with a downloadable PDF | Functional | High | FAIL |
| AP2506_007 | Submitting with the owner's last name emptied does not crash the page or lose the other values | Negative | Medium | PASS |
| AP2506_008 | Submitting with "Financing company" left on "Choose" does not return a server error | Negative | Medium | PASS |
| AP2506_009 | Opening the contract page for a quote whose Esthetic protection contract already exists does not crash | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Revisions

| Date | TC ID | Change | Why |
|---|---|---|---|
| 2026-11-01 | AP2506_008 | Step 4 no longer requires the refusal message to sit beside "Financing company", nor one of two named outcomes; it fails only on an error page, HTTP 5xx or a lost value, and records the outcome, message text and position | R2 round 1 finding F-1 — the message position is open (Q-003, Q-008) |
| 2026-11-01 | AP2506_006 | Step 5 no longer judges the client name on the PDF; it records the client name and contract number. The download's HTTP 200 `application/pdf` (recorded in `domain`) is still judged | Independent R2 round 1 (01:58) finding F-5 — test plan §2.2 records PDF content, does not judge it |
| 2026-11-01 | AP2506_007 | Step 4 accepts postal code `H2X 1Y4` with or without the space | Same formatting tolerance as AP2506_005 (independent R2 finding F-4) |
| 2026-11-08 | Execution Context | Environment set to Dev (v2dev, `execution_env`); Dev route of the action cited (Esthetic protection row ⋯ → Generate Contract, quote-creation.md 2026-11-02); rows added for the redesigned Dev contract page and for Dev submit behaviour; contract list marked staging-mapped with the AP-2512 note; known-defect row rewritten (AP-2512 known defect on Dev, AP-2513/2514/2516 related, AP-2459 staging only); Dev product/option facts; client inbox `client.stage.2506NNN`; unique client last names | R2 2026-11-08 finding F-1 |
| 2026-11-08 | AP2506_006 | Title says "valid values"; step 3 records a first refusal's field messages, fills only the named fields with the values in Test Data (Stock number `STK2506006`, In service date `2008-06-01`, dashed phones, financing company, …) and submits once more; contract creation judged on that submit; a field with no stated value → BLOCKED | R2 2026-11-08 finding F-4 |
| 2026-11-08 | AP2506_006 | Step 5 keeps HTTP 200 `application/pdf` as the baseline and states that an HTTP 500 on Dev is a FAIL linked to known defect AP-2512, not a new bug | R2 2026-11-08 finding F-1 |
| 2026-11-08 | AP2506_006 – _009 | Client last names made unique per run (`Owner2506-0NN-<HHMMSS>`, recorded as `NAME_C/D/E`); AP2506_009 finds quote C's row by `NAME_C` | R2 2026-11-08 finding F-6 |
| 2026-11-08 | AP2506_007, AP2506_008 | Step 4 says "the summary values shown before step 3" instead of "the Program Summary values"; AP2506_008 rationale states AP-2459 was staging only | R2 2026-11-08 finding F-5; F-1 |

---

## Test Cases

---

### AP2506_006 — Submitting the Esthetic protection contract page with valid values creates a contract with a downloadable PDF

| Field | Value |
|---|---|
| **TC ID** | AP2506_006 |
| **Title** | Submitting the Esthetic protection contract page with valid values creates a contract with a downloadable PDF |
| **Requirement** | AP2506 — REQ-005: AC 4 "Given valid form values, when the dealer submits, then contract is created following the current process."; description "Contract creation, invoice, financing, and PDF behaviour stay unchanged." |
| **Route** | `/quote/{id}/permaplate-create-contract` → **Generate Contract** → `/permaplate-contracts` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | Dev (v2dev), 2026-11-08 03:21–03:23Z, quote 6693 |
| **Result** | FAIL — step 5: PDF download HTTP 500 (known defect AP-2512); contract PNA-0000000022 and invoice 946 created on the first submit |

**Why this matters:** Creating the contract is the business outcome of the page. The case
judges what `domain` records about an Esthetic protection contract — it is listed on the
dealer's "Esthetic protection contracts" and its PDF downloads. What the dealer sees right
after submit, and whether an invoice is raised, have no recorded baseline (Q-009), so they
are recorded. AC 4 promises a contract only for "valid form values", and the redesigned
Dev pages refuse some pre-filled values (empty Stock number or In service date, an undashed
phone, no financing company). So a first refusal is recorded, the fields it names are filled
with the valid values below, and the contract is judged on the last submit. On Dev the PDF
download fails under AP-2512; that stays a FAIL linked to AP-2512. The client last name
carries the build time so a re-run never finds an older row. The quote built here (quote C)
is reused by AP2506_009.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-006-<HHMMSS>` — `<HHMMSS>` is the UTC time the quote is built (`date -u`), recorded as `NAME_C` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option (every option ticked recorded) |
| Financing company | The first company listed after "Choose" (recorded) — only if the page has the field |
| Values for fields a refusal names (second submit only) | Stock number `STK2506006` · In service date `2008-06-01` (`yyyy-mm-dd`, the vehicle's year 2008) · Home phone `514-555-0301` · Work or cell phone `514-555-0302` · Financing company: the first company after "Choose" · VIN `1FAHP35NX8W239204` · Last name `NAME_C` · Start date `RUN_DATE` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `NAME_C`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | The quote page shows heading `#{id} - Esthetic NAME_C` and the Esthetic protection row; the quote id (quote C), `NAME_C`, product, every option ticked and Cost are recorded |
| 2 | Open the contract page with the Esthetic protection row's **⋯** → **Generate Contract** (fallback: type `/quote/{id}/permaplate-create-contract`, recorded). If a "Financing company" field is on the page, choose the first company after "Choose" and record it (Q-003). Record every field marked required (`*`) that is empty; change nothing else before the first submit | The contract page loads without an error page or HTTP 5xx; the company chosen is shown in the field |
| 3 | Click **"Generate Contract"**. If the submit is refused with field messages (on the page, or as a flash on `/quote/{id}/details`) and no error page: record each message word for word with the field it names (Q-008), reopen the contract page if needed, fill **only** each named field with its value from Test Data, and click **"Generate Contract"** once more; record that a second submit was needed | No error page or HTTP 5xx on either submit. Record the address landed on, any message word for word, and any invoice link or notice (Q-009). If a refusal names a field with no value in Test Data, the case is BLOCKED "required field with no stated valid value: <field>" — not FAIL. If the second submit is refused again for a field filled from Test Data, the case continues to step 4 and FAILS at step 5 |
| 4 | Open `/permaplate-contracts` and find the row whose client name is `Esthetic NAME_C` | The list loads without an error page or HTTP 5xx; record the row's VIN and Contract cost price |
| 5 | [Verification] Check the row and its **Download** action | Exactly one row for `Esthetic NAME_C` is listed, with VIN `1FAHP35NX8W239204` — the contract was created by the last submit of step 3. Its Download opens `/quote/{quote C id}/permaplate-contract-download` and returns a PDF (HTTP 200, `application/pdf`) — the current-process baseline. On Dev an HTTP 500 here is known defect **AP-2512**: the step is a FAIL, and Gate C links it to AP-2512 instead of filing a new bug (save the method, URL and status lines). If a PDF opens, its content is recorded, not judged (test plan §2.2): record the client name it shows and its contract number |

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
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | Dev (v2dev), 2026-11-08 03:23–03:24Z, quote 6694 |
| **Result** | PASS — refused with "This value should not be blank." under Last name; other values kept; no contract |

**Why this matters:** The story only speaks of "valid form values"; which fields are
required and how the page answers an invalid one are not stated (Q-008). The case records
whether the submit is refused or accepted, and fails only on an objective fault: an error
page or HTTP 5xx, or values the dealer did not touch being lost when the page is shown
again. If the owner fields cannot be edited at all (Q-007), the case is recorded as
SKIPPED with that reason.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-007-<HHMMSS>` — UTC build time (`date -u`), recorded as `NAME_D` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option |
| Financing company | The first company listed after "Choose" (recorded) — only if the page has the field |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `NAME_D`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | A quote with Esthetic protection exists; its id (quote D) is recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action (fallback: type the address, recorded). If a "Financing company" field is present, choose the first company after "Choose". Clear the owner's Last name field completely | The page loads without an error page or HTTP 5xx; the Last name field is empty |
| 3 | Click **"Generate Contract"** | No error page or HTTP 5xx appears. Record whether the submit is refused (message text and where it shows) or accepted (Q-008) |
| 4 | [Verification] Inspect the page and, if the submit was accepted, `/permaplate-contracts` | If the page is shown again, every field the dealer did not touch keeps its value (first name `Esthetic`, VIN `1FAHP35NX8W239204`, city `Montréal`, postal code `H2X 1Y4` with or without the space, the chosen financing company, and the summary values shown before step 3). Record whether a contract was created for quote D (a row on `/permaplate-contracts` whose Download address carries quote D's id, or a PDF icon on quote D's Esthetic protection row) and with which client name (Q-008); list any contract row in the log |

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
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | Dev (v2dev), 2026-11-08 03:24–03:25Z, quote 6695 |
| **Result** | PASS — refused (POST 200) with "This value should not be blank." at Financing company; no 5xx; no contract |

**Why this matters:** A dealer selling Esthetic protection for cash has no financing
company to pick. On the old form on staging this returned HTTP 500 (AP-2459, staging only; on Dev the old form accepted "Choose"). The
story does not say whether the field is required (Q-003, Q-008), so the case does not
assert "created" or "refused"; it fails only on an error page or HTTP 5xx. A FAIL here
goes to Gate C, which compares it with AP-2459 (seen on staging only) before filing. If the page has no
"Financing company" field at all, the case is recorded as SKIPPED with that reason (Q-003).

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-008-<HHMMSS>` — UTC build time (`date -u`), recorded as `NAME_E` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option |
| Financing company | Left on "Choose" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `NAME_E`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | A quote with Esthetic protection exists; its id (quote E) is recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action (fallback: type the address, recorded). Confirm "Financing company" shows "Choose" and change nothing | The page loads without an error page or HTTP 5xx; "Financing company" shows "Choose" |
| 3 | Click **"Generate Contract"** | Record the HTTP status of the response, the address and any message word for word |
| 4 | [Verification] Inspect the page and `/permaplate-contracts` | No error page and no HTTP 5xx in step 3. If the contract page is shown again, every other value is kept (first name `Esthetic`, last name `NAME_E`, VIN `1FAHP35NX8W239204`, the summary values shown before step 3). Record whether a contract row for `Esthetic NAME_E` is listed on `/permaplate-contracts`, the page landed on, and any message text and where it shows (Q-003, Q-008); list any contract row in the log |

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
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | Dev (v2dev), 2026-11-08 03:25–03:26Z, quote 6693 |
| **Result** | PASS — no create action once the contract exists; the address redirects silently (302); still one contract row |

**Why this matters:** AC 1 starts from a quote with "no contract", which implies the
action may behave differently once a contract exists — but the story does not say how
(Q-010). The case records whether the action is still offered and what the address shows,
and fails only on an error page or HTTP 5xx. It never clicks "Generate Contract", so no
second contract is created.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote C from AP2506_006 (client last name `NAME_C` = `Owner2506-006-<HHMMSS>` as recorded there), after its contract was generated. If AP2506_006 did not create a contract, this case is BLOCKED ("no quote with an Esthetic protection contract from this run") |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`) and confirm on `/permaplate-contracts` that a row for `Esthetic NAME_C` exists; record quote C's id | The row exists; otherwise the case is BLOCKED as stated in Test Data |
| 2 | Open quote C at `/quote/{id}/details` and inspect its Esthetic protection entry and actions menu | The quote page loads without an error page or HTTP 5xx. Record whether a create-contract action is still offered, and any other control the entry now shows (download, view) (Q-010) |
| 3 | Type `/quote/{id}/permaplate-create-contract` into the address bar and press Enter. Do **not** click "Generate Contract" | Record the HTTP status, the address landed on and what the page shows (form, message, redirect) (Q-010) |
| 4 | [Verification] Inspect the outcome of steps 2 and 3 and `/permaplate-contracts` | No error page and no HTTP 5xx in steps 2 or 3; `/permaplate-contracts` still lists exactly one row for `Esthetic NAME_C` — opening the page created no second contract |

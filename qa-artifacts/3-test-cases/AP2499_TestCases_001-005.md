# Test Cases — AP2499 (File 1 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2499 — Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Source:** requirements/AP-2499-add-gap-creditors-insurance-financing-form.md · qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2499_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2499_001 to AP2499_005 (5 test cases)
**Coverage:** Functional · Regression · UI · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` (never a bare `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500) → `/quote/{id}/details`, the quote page. On the quote page, the card **"Summary of products"** has the rows **"Gap Insurance"** and **"Creditors insurance"** ("- None Selected -"), each with a **+** button on the right; that button opens the add modal (ticket screenshots image-20261016-161139.png and image-20261016-161228.png). The stand-alone financing page is `/quote/{id}/financing` | `navigation` → `domain` (quote-creation.md); the Summary-of-products card and its GAP / creditors modal are not yet mapped — taken from the ticket screenshots |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Dev (v2dev) — the registry's `execution_env`; dealer portal URL from the "Dev Environment" section of the `env` source | `env`, `qa-config/tools.md` |
| **Login** | The shared dealer account (dealer 1380, "Test QA staging"), Chubb-configured with creditor forms PM30 and PM50, named in the `env` source; the password is read from there at run time and never written into the log | `env`, `domain` (chubb-insurance.md §6) |
| **Test data** | Vehicle **915** (Ford Focus 2008, VIN `1FAHP35NX8W239204`) — used only as the vehicle each new quote is created from; these cases change a quote's financing, never the vehicle | `test-data` |
| **Language** | EN for every judgement. The dealer UI may show French labels; `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One client and one quote per case, plus a financing on the quotes of 003–005 (005: a financing with no date of birth, if the build stores it); no insurance quote is priced in this file. The 2026-11-02 run left quotes 6533–6537. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared client values** — used in every case's client form, changing only the last name:
First name `Gap`, Last name as given in the case, Email `client.stage.NNN@yopmail.com`
(next unused number, recorded), Address `100 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`,
"I agree to the policy" ticked → **Save**. Then on the vehicle step `/quote/{id}/vehicle`
keep vehicle 915, Delivered at `2026-11-01`, Price `20000` → **Save**.

**Shared financing values (F1)** — the valid set typed into a financing form, whether on
`/quote/{id}/financing` or inside the modal: Applicant date of birth `1990-01-01`, Type =
the first non-empty option (record its label), Base amount `25000`, Residual amount `0`,
Payment frequency "Monthly" (if absent, the first non-empty option, recorded), Term
months `60`, Interest rate `6.99`, Financing company = the first non-empty option (record
its label).

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The GAP / creditors add modal (its field labels, submit controls, and how the financing and insurance parts are laid out) is not mapped in `domain` | AP2499_001–005 | Not blocking at design — reached through the **+** buttons shown in the ticket screenshots; the executor maps the modal on first use and writes it back to `domain` |
| 2 | Whether "Add a financing" / `/quote/{id}/financing` can be used on a brand-new quote (quote-creation.md says the button is "disabled until prerequisites are met") | AP2499_004, AP2499_005 | Not blocking — the step falls back to saving the financing once through the modal and re-opening it |
| 3 | Whether a financing (and its quote client) without a date of birth can be stored on Dev — an empty date of birth has only been seen on a submit already refused for the residual (R1 F-2) | AP2499_005 | Not blocking at design — step 2 records it; a refusal makes the case BLOCKED with that reason |

> Designed with no case BLOCKED; executed 2026-11-02 on Dev (v2dev); AP2499_005 re-designed 2026-11-15 and set to Not Run — see the Execution Log below and `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2499_001 | Adding GAP insurance to a quote with no financing shows the financing form instead of the "Please add a financing" alert | Functional | High | PASS |
| AP2499_002 | Adding creditors insurance to a quote with no financing shows the financing form instead of the "Please add a financing" alert | Functional | High | PASS |
| AP2499_003 | Submitting the financing inside the GAP modal saves it on the quote and moves to the insurance step without leaving the page | Functional | High | FAIL |
| AP2499_004 | Creditors modal on a quote that has a financing still shows the financing form first, with all eight stored values | Regression | High | FAIL |
| AP2499_005 | GAP modal on a quote whose stored financing has no date of birth shows the form first with Date of birth blank | Edge-case | Medium | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2499_001 — Adding GAP insurance to a quote with no financing shows the financing form instead of the "Please add a financing" alert

| Field | Value |
|---|---|
| **TC ID** | AP2499_001 |
| **Title** | Adding GAP insurance to a quote with no financing shows the financing form instead of the "Please add a financing" alert |
| **Requirement** | AP2499 — REQ-001, AC "Financing form replaces the alert"; REQ-002, AC "Financing form is always present above the insurance form" (GAP, financing absent, Chubb dealer) |
| **Route** | `/quote/{id}/details` — Summary of products → Gap Insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Financing form first, no alert, no stored values (quote 6533) |

**Why this matters:** This is the exact situation in the ticket's first screenshot: a quote
with no financing, where the GAP modal used to show only *"Please add a financing in order
to get a GAP quote."* and the dealer had to close it, add the financing and come back. What
sits below the financing form before any insurance quote is submitted is not stated (Q-003),
so it is recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-001` |
| Alert text that must not appear | "Please add a financing in order to get a GAP quote." |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-001`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Gap Gap2499-001`; the quote id is recorded; the Financing card shows no financing ("You have not added financing details yet" or similar, recorded); "Summary of products" shows a "Gap Insurance" row with "- None Selected -" and a **+** button |
| 2 | In "Summary of products", click the **+** button on the "Gap Insurance" row | A modal opens on the same page (the URL is unchanged) without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the modal from top to bottom | The modal does **not** contain the text "Please add a financing in order to get a GAP quote." The first block of the modal is a financing form with fields for type, base amount, residual, payment frequency, term months, interest rate, financing company and applicant date of birth (labels recorded), and a submit control. No field shows a stored financing value: every text, number and date field (base amount, residual, term months, interest rate, date of birth) is empty or shows only placeholder text. Each drop-down (type, payment frequency, financing company) is recorded as it opens — empty, a placeholder such as "Select…", or a pre-selected default option such as "Monthly" — for Q-004; a drop-down showing a placeholder or a default option is not a failure. Anything shown below the financing form (a GAP insurance form, a result area, or nothing yet) is recorded for Q-003 |

---

### AP2499_002 — Adding creditors insurance to a quote with no financing shows the financing form instead of the "Please add a financing" alert

| Field | Value |
|---|---|
| **TC ID** | AP2499_002 |
| **Title** | Adding creditors insurance to a quote with no financing shows the financing form instead of the "Please add a financing" alert |
| **Requirement** | AP2499 — REQ-001, AC "Financing form replaces the alert"; REQ-002 (creditors, financing absent, Chubb dealer) |
| **Route** | `/quote/{id}/details` — Summary of products → Creditors insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Financing form first, no alert (quote 6534); /insurance shows the form alone |

**Why this matters:** The ticket names two alerts, one per product. The creditors modal is
a separate entry, so it is checked separately. The notice "Please make sure you create the
GAP insurance first…" under the Creditors insurance row is boilerplate on every quote
(`chubb-insurance.md` §5) and is not part of this check (Q-013, Info). Whether other
creditor entry points such as `/quote/{id}/insurance` also show the financing form is
recorded for Q-001.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-002` |
| Alert text that must not appear | "Please add a financing in order to get a creditors quote." |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-002`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded; the Financing card shows no financing; "Summary of products" shows a "Creditors insurance" row with "- None Selected -" and a **+** button |
| 2 | In "Summary of products", click the **+** button on the "Creditors insurance" row, then take a screenshot of the whole modal (scroll inside it if needed so every part is captured) | A modal opens on the same page (the URL is unchanged) without an error page or HTTP 5xx; the screenshot of the modal is saved |
| 3 | Close the modal, then open `/quote/{id}/insurance` directly in the same tab | No objective fault: no error page or HTTP 5xx. Record what the page shows — the financing form, the "Please add a financing…" alert, or the creditor form alone (record-only, Q-001) — then return to `/quote/{id}/details` |
| 4 | [Verification] Look at the screenshot of the modal taken at step 2, from top to bottom | The modal does **not** contain the text "Please add a financing in order to get a creditors quote." The first block of the modal is a financing form with fields for type, base amount, residual, payment frequency, term months, interest rate, financing company and applicant date of birth (labels recorded), and a submit control. No field shows a stored financing value: every text, number and date field (base amount, residual, term months, interest rate, date of birth) is empty or shows only placeholder text. Each drop-down (type, payment frequency, financing company) is recorded as it opens — empty, a placeholder such as "Select…", or a pre-selected default option such as "Monthly" — for Q-004; a drop-down showing a placeholder or a default option is not a failure. Anything shown below it is recorded for Q-003 |

---

### AP2499_003 — Submitting the financing inside the GAP modal saves it on the quote and moves to the insurance step without leaving the page

| Field | Value |
|---|---|
| **TC ID** | AP2499_003 |
| **Title** | Submitting the financing inside the GAP modal saves it on the quote and moves to the insurance step without leaving the page |
| **Requirement** | AP2499 — REQ-004, AC "Submit persists and continues in the modal" (the "fills" branch); REQ-002 (financing form stays after it exists) |
| **Route** | `/quote/{id}/details` — Summary of products → Gap Insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Steps 3, 5: financing saved and GAP step shown in the modal, but the financing form collapses to a summary line instead of showing the F1 values (quote 6535) |

**Why this matters:** This is the single-flow promise of the ticket: enter the financing,
submit, and carry on to the GAP quote without the close → add financing → reopen detour.
The financing must really be stored — a value shown in the modal but not saved would price
the insurance on nothing. What "the insurance step backed by the saved financing" shows is
not defined (Q-005), so the insurance fields are recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-003` |
| Financing | Shared financing values F1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-003`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with no financing; the quote id and the page URL are recorded |
| 2 | Click the **+** button on the "Gap Insurance" row; in the modal's financing form enter the shared financing values F1 | The modal opens without an error page or HTTP 5xx; every F1 value shows in its field after it is typed or selected |
| 3 | Click the financing form's submit control (label recorded) | No error page or HTTP 5xx; the browser URL is still the URL recorded at step 1 and the modal is still open. The modal shows the GAP insurance step below the financing form, and the financing form is still present above it showing the F1 values. Record which GAP insurance fields, if any, carry financing values (Q-005) |
| 4 | Close the modal and reload `/quote/{id}/details` | The page reloads without an error; the Financing card now shows a financing |
| 5 | [Verification] Read the Financing card, then open the Gap Insurance **+** modal again | The Financing card shows base amount 25000, term 60 months, interest rate 6.99, payment frequency Monthly and the recorded type and financing company (each value the card displays matches F1). The re-opened modal shows the financing form first, filled with the F1 values, and no "Please add a financing…" alert |

---

### AP2499_004 — Creditors modal on a quote that has a financing still shows the financing form first, with all eight stored values

| Field | Value |
|---|---|
| **TC ID** | AP2499_004 |
| **Title** | Creditors modal on a quote that has a financing still shows the financing form first, with all eight stored values |
| **Requirement** | AP2499 — REQ-003, AC "Prefill from the existing financing"; REQ-002, AC "…the financing form does not disappear when a financing already exists" (creditors, financing present, Chubb dealer) |
| **Route** | `/quote/{id}/financing`, then `/quote/{id}/details` — Summary of products → Creditors insurance **+** |
| **Type** | Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Step 4: financing form opens collapsed to a summary line; fields hidden until Edit (quote 6536) |

**Why this matters:** Most dealers enter the financing first, the old way. For them the
modal must still show the financing form — prefilled, so they can check it — and not hide
it or replace it with an empty one. The financing here is created through the old
financing page on purpose, so the case also proves that page still feeds the modal
(Q-014, Info).

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-004` |
| Stored financing | Shared financing values F1, all eight fields filled |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-004`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads; the quote id is recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/financing`, enter the shared financing values F1 → **Save**. If the page cannot be used (button disabled, redirect or error — record which), open the Creditors insurance **+** modal instead, enter F1 in its financing form, submit it, and close the modal | `/quote/{id}/details` shows a financing on the Financing card with the F1 values; the route used is recorded |
| 3 | Click the **+** button on the "Creditors insurance" row | A modal opens on the same page without an error page or HTTP 5xx |
| 4 | [Verification] Inspect the modal from top to bottom | The first block of the modal is the financing form — not hidden, collapsed or replaced by a summary — and the creditors insurance form or results are below it. Each of the eight fields shows its stored value: type = the recorded type, base amount 25000, residual 0, payment frequency Monthly, term months 60, interest rate 6.99, financing company = the recorded company, applicant date of birth 1990-01-01. No field is empty and no field shows a value other than the stored one. Record the number format shown (for example `25000` or `25 000,00`) |

---

### AP2499_005 — GAP modal on a quote whose stored financing has no date of birth shows the form first with Date of birth blank

| Field | Value |
|---|---|
| **TC ID** | AP2499_005 |
| **Title** | GAP modal on a quote whose stored financing has no date of birth shows the form first with Date of birth blank |
| **Requirement** | AP2499 — REQ-003, AC "Prefill from the existing financing": "each field shows the stored value — type, base amount, residual, payment frequency, term months, interest rate, financing company, applicant date of birth — and any field with no stored value falls back to its normal empty/placeholder state"; REQ-002 (GAP, financing present, Chubb dealer). Q-004 Accepted (a field with no value opens blank); Q-011 Accepted (residual required, so it is stored as `0`) |
| **Route** | `/quote/{id}/financing`, then `/quote/{id}/details` — Summary of products → Gap Insurance **+** |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev), quote 6710 |
| **Result** | FAIL — step 4: Date of birth, saved empty, shows today's date 2026-11-15 in the modal — AP-2566 |

**Why this matters:** A prefill that invents a value the dealer never typed — a date of
birth copied from another quote, today's date, or `1990-01-01` from an earlier financing —
would send a wrong age to the insurer and silently change the GAP premium. The residual
can no longer be the empty field (it is required, Q-011), so the "no stored value" half of
the criterion is checked on **Date of birth**, which the criterion names and which is not
in the required list. On Dev a field with no value opens blank (Q-004, Accepted), so blank
is asserted. Whether the build stores a financing without a date of birth is not yet shown
(R1 F-2): step 2 records it, and a refusal makes the case BLOCKED, not FAIL. Once a
financing exists the modal folds the financing form into one summary line behind
**Edit** — known bug AP-2526, already failed by AP2499_004 — so this case opens it with
**Edit** and judges only the field values.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-005b` (a new client; quote 6537 of the 2026-11-02 run is not reused) |
| Stored financing | Shared financing values F1 with Residual amount `0` and **Date of birth left empty** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-005b`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with no financing; the quote id and the client e-mail are recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/financing`, enter F1 but leave **Date of birth** empty (Residual `0`) → **Save**, then read the Financing card and the client block on `/quote/{id}/details`. If the page cannot be used (disabled, redirect or error — record which), enter the same values in the GAP **+** modal's financing form → **Save** and close the modal. **If the save is refused because Date of birth is empty, record the error text and stop: BLOCKED — "a financing without a date of birth cannot be stored on Dev"** | Flash "Financing saved"; the Financing card shows the financing (25,000, 60 months, 6.99, Monthly, the recorded type and company); the route used is recorded, and whether the card or the client block shows any date of birth is recorded |
| 3 | Click the **+** button on the "Gap Insurance" row and wait for the text "Interest rate". If the "Financing" block is folded into one summary line (AP-2526), record that and click its **Edit** link to show the fields | The modal opens on the same page (URL unchanged) without an error page or HTTP 5xx; the financing fields are visible |
| 4 | [Verification] Inspect the modal from top to bottom and take a screenshot of it | The "Financing" block is first and the "Gap Insurance Quote" form is below it. The seven stored fields show their values: Type = the recorded type, Net amount 25000, Residual 0, Payment frequency Monthly, Term months 60, Interest rate 6.99, Financing company = the recorded company (number format recorded). **Date of birth is blank** — no date and no other value (Q-004, Accepted). The case fails if Date of birth shows any date, or if any other field is empty or shows a value other than the stored one |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Financing form replaces the alert | AP2499_001, AP2499_002 | — | — | — |
| REQ-002 — Financing form always first (GAP/creditors × absent/present, Chubb) | AP2499_001, AP2499_002, AP2499_003 | — | AP2499_005 | AP2499_004 |
| REQ-003 — Prefill from the stored financing (005: Date of birth with no stored value) | — | — | AP2499_005 | AP2499_004 |
| REQ-004 — Submit saves and continues in the modal | AP2499_003 | — | — | — |

REQ-002 (Humania dealer), REQ-004 (correction), REQ-005 and REQ-006 are covered in
`AP2499_TestCases_006-010.md` and `AP2499_TestCases_011-013.md`.

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2499_005 | Title, "Why this matters" and step 4: an empty residual, a placeholder text or `0` is record-only for Q-004; the case fails on the residual only if it shows a non-zero number ("a residual of 0 the dealer never typed" removed) | Reviewer R2 REWORK F-2 — Q-004 (Judgement, Open) leaves the "normal empty/placeholder state" undefined |
| 2026-11-01 | AP2499_001, AP2499_002 | Verification step: judged only that no field shows a stored financing value (text, number and date fields empty or placeholder); each drop-down's opening state (empty, placeholder or pre-selected default) is recorded for Q-004, not judged | Reviewer R2 REWORK F-3 — whether a drop-down opens empty or on a default is Q-004 (Open) |
| 2026-11-01 | AP2499_002 | Step 2 now says to take the screenshot of the modal that step 4 reads | Reviewer R2 REWORK F-5 |
| 2026-11-02 | AP2499_005 | **Blocked by** set to "Q-011 — an empty residual cannot be stored" (was "—"); no step or expected result changed | Independent R3 F-3 — the blocker was named only in the Result field |
| 2026-11-15 | AP2499_005 | Re-designed: the no-stored-value check moves from Residual to **Date of birth** (title, requirement, why, test data, all steps); Residual is stored as `0`; the Q-004 record-only check becomes record-and-accept — Date of birth must be blank; step 2 records whether a financing without a date of birth can be stored (refused → BLOCKED); step 3 opens the folded financing block with **Edit** (known bug AP-2526); new client `Gap2499-005b`. Status back to Not Run; **Blocked by**, **Executed on** and **Result** cleared — the Execution Log row below is the 2026-11-02 run of the old design | 2026-11-15 re-analysis — Q-011 Accepted (residual required); REQ-003 AC 1 names applicant date of birth; reviewer R1 F-2; designer Step 1c (Accepted → record-and-accept) |
| 2026-11-15 | File | Execution Context: Environment row now Dev (v2dev) (was v2staging); Leaves behind adds the 005 financing without a date of birth; Known blockers row 3 added. AP2499_001–004 unchanged and keep their 2026-11-02 results | Registry `execution_env: Dev`; reviewer R1 F-2 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2499_001 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_001-step3-GapModalFinancingFormFirst_pass.png` |
| AP2499_002 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_002-step2-CreditorsModalFinancingForm_pass.png` |
| AP2499_003 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png` |
| AP2499_004 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-FinancingCollapsedToSummary_fail.png` |
| AP2499_005 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_005-step4-Nov15-DOBShowsTodayDate_fail.png` (2026-11-15, re-designed case; the 2026-11-02 run of the old design was BLOCKED) |

# Test Cases — AP2499 (File 3 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2499 — Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Source:** requirements/AP-2499-add-gap-creditors-insurance-financing-form.md · qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2499_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2499_011 to AP2499_013 (3 test cases)
**Coverage:** Negative · Edge-case · Functional

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` (never a bare `/quote/new/client`, which returns HTTP 500 on the quote page) → `/quote/{id}/details`. On the quote page, the card **"Summary of products"** has the rows **"Gap Insurance"** and **"Creditors insurance"**, each with a **+** button that opens the add modal (ticket screenshots). The stand-alone financing page is `/quote/{id}/financing` | `navigation` → `domain` (quote-creation.md); the modal is not yet mapped — taken from the ticket screenshots |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | 011–012: the shared dealer account (dealer 1380, "Test QA staging", Chubb-configured), named in the `env` source; the password is read from there at run time and never written into the log. 013: **a dealer account configured for Humania — Not known**, no such account is in `env`, `test-data` or `domain` | `env` |
| **Test data** | Vehicle **915** (Ford Focus 2008, VIN `1FAHP35NX8W239204`) for the dealer 1380 cases — used only as the vehicle each new quote is created from. 013 needs an inventory vehicle of the Humania dealer — Not known | `test-data` |
| **Language** | EN for every judgement; `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One client and one quote per case; a financing on the quote of 011 (and of 012 if the empty residual / date of birth are accepted). The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared client values** — First name `Gap`, Last name as given in the case, Email
`client.stage.NNN@yopmail.com` (next unused number, recorded), Address `100 Rue Test`, City
`Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone
`5145550102`, "I agree to the policy" ticked → **Save**. Then on `/quote/{id}/vehicle` keep
the pre-attached vehicle, Delivered at `2026-11-01`, Price `20000` → **Save**.

**Shared financing values (F1)** — Applicant date of birth `1990-01-01`, Type = the first
non-empty option (record its label), Base amount `25000`, Residual amount `0`, Payment
frequency "Monthly" (if absent, the first non-empty option, recorded), Term months `60`,
Interest rate `6.99`, Financing company = the first non-empty option (record its label).

**Saving F1 on a new quote** — open `/quote/{id}/financing`, enter F1 → **Save**. If that
page cannot be used (button disabled, redirect or error — record which), open the Gap
Insurance **+** modal, enter F1 in its financing form, submit it, and close the modal.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A dealer account on staging configured for Humania, with a vehicle in its inventory | AP2499_013 | Open — Q-002 (Judgement), raised 2026-11-01. **AP2499_013 ships BLOCKED** |
| 2 | What counts as "invalid" for base amount and interest rate | AP2499_011 | Open — Q-010 (Judgement). Not blocking: the case judges only the "no partial save" rule, which the criterion states, and records whether the values are rejected |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2499_011 | Correcting a financing with a text base amount and a negative interest rate leaves the stored financing unchanged | Negative | High | PASS |
| AP2499_012 | Submitting a financing with residual and date of birth left empty does not store invented values | Edge-case | Medium | PASS |
| AP2499_013 | For a Humania dealer, the GAP and creditors modals show the financing form above the insurance form | Functional | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2499_011 — Correcting a financing with a text base amount and a negative interest rate leaves the stored financing unchanged

| Field | Value |
|---|---|
| **TC ID** | AP2499_011 |
| **Title** | Correcting a financing with a text base amount and a negative interest rate leaves the stored financing unchanged |
| **Requirement** | AP2499 — REQ-006, AC "Validation" ("…no partial financing or insurance row is persisted"), on a quote that already has a financing |
| **Route** | `/quote/{id}/details` — Summary of products → Creditors insurance **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Base amount refused, financing unchanged (quote 6543) |

**Why this matters:** The empty-form case (AP2499_010) shows nothing is created. This case
covers the other half: a dealer correcting a good financing with bad values must not end up
with a half-changed one — for example the new term saved while the bad amount is refused.
Which values count as "invalid" is not stated (Q-010), so whether `abc` and `-5` are
rejected is recorded. The case fails only on an objective fault: a value stored that the
dealer did not enter (such as a base amount of 0), or a partial save of the valid change
when an error was shown.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-011` |
| Stored financing | F1 (base amount 25000, term 60, interest rate 6.99) |
| Correction | Term months `72` (valid), Base amount `abc`, Interest rate `-5` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-011`) → **Save**, set the vehicle step → **Save**, then save F1 on the quote as described under "Saving F1 on a new quote" | `/quote/{id}/details` shows a financing with base amount 25000, term 60 and interest rate 6.99; the quote id and page URL are recorded |
| 2 | Click the **+** button on the "Creditors insurance" row; in the financing form set Term months `72`, Base amount `abc`, Interest rate `-5` | The modal opens without an error page or HTTP 5xx. Record what each field shows after typing (a numeric field may refuse the letters `abc` — record it) |
| 3 | Click the financing form's submit control | No error page or HTTP 5xx; the browser URL is unchanged. Record whether an error is shown next to Base amount and next to Interest rate, and its text (Q-010, Q-012) |
| 4 | Close the modal and reload `/quote/{id}/details` | The page reloads without an error |
| 5 | [Verification] Read the Financing card | **If an error was shown at step 3:** the Financing card still shows base amount 25000, term 60 and interest rate 6.99 — the valid term change to 72 was not saved on its own. **If no error was shown:** record the stored values for Q-010; the case fails only if a stored value is one the dealer did not enter (for example a base amount of 0 or an interest rate other than −5 or 6.99) |

---

### AP2499_012 — Submitting a financing with residual and date of birth left empty does not store invented values

| Field | Value |
|---|---|
| **TC ID** | AP2499_012 |
| **Title** | Submitting a financing with residual and date of birth left empty does not store invented values |
| **Requirement** | AP2499 — REQ-006, AC "Validation" (residual and date of birth are not in its list); REQ-003, AC "…any field with no stored value falls back to its normal empty/placeholder state" |
| **Route** | `/quote/{id}/details` — Summary of products → Gap Insurance **+** |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Refused on Residual, nothing stored (quote 6544) |

**Why this matters:** The Validation criterion lists six fields and leaves out residual and
applicant date of birth. Whether these two may be left empty is not stated (Q-011), so the
case does not judge whether the submit is accepted. It judges only objective faults: an
error page, a non-zero residual that nobody entered, or any date of birth appearing. What
an empty field shows is not described (Q-004), so an empty residual, a placeholder text or
`0` is recorded, never judged. A date of birth matters because creditor premiums depend on
the borrower's age.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-012` |
| Financing | F1, but **Residual amount empty** and **Applicant date of birth empty** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-012`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with no financing; the quote id and page URL are recorded |
| 2 | Click the **+** button on the "Gap Insurance" row; in the financing form enter F1 but leave Residual amount and Applicant date of birth empty | The modal opens without an error page or HTTP 5xx; the six other fields show their F1 values and the two fields are empty |
| 3 | Click the financing form's submit control | No error page or HTTP 5xx; the browser URL is unchanged. Record the outcome for Q-011: accepted (the modal moves on to the GAP insurance step) or refused (record the error text and which field it is next to) |
| 4 | Close the modal, reload `/quote/{id}/details`, and re-open the Gap Insurance **+** modal | The page and the modal load without an error |
| 5 | [Verification] Read the Financing card and the re-opened modal's financing form | **If the submit was accepted:** the six entered values are stored as typed (base amount 25000, term 60, interest rate 6.99, Monthly, the recorded type and company), Record exactly what the residual and the date of birth each show. Residual: empty, a placeholder text or `0` is record-only for Q-004 — the case fails only if it shows a non-zero number. Date of birth: empty or a placeholder text is record-only — the case fails if it shows any date. **If the submit was refused:** the Financing card still shows no financing |

---

### AP2499_013 — For a Humania dealer, the GAP and creditors modals show the financing form above the insurance form

| Field | Value |
|---|---|
| **TC ID** | AP2499_013 |
| **Title** | For a Humania dealer, the GAP and creditors modals show the financing form above the insurance form |
| **Requirement** | AP2499 — REQ-002, AC "Financing form is always present above the insurance form" ("…Chubb or Humania dealer"); REQ-001 for that dealer |
| **Route** | `/quote/{id}/details` of a Humania dealer's quote — Summary of products → Gap Insurance **+** and Creditors insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 (Judgement — unanswered): no dealer account configured for Humania is known on staging. Not in `env`, `test-data` or `domain`. Runs as soon as an account is named |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | BLOCKED — Q-002 — test data not on dev: no Humania dealer setup found |

**Why this matters:** The criterion names two kinds of dealer, Chubb and Humania. Every
other case runs on the Chubb dealer 1380. A Humania dealer may get a different insurance
form under the financing form, and the story promises the same layout for both. The
case must not be run on the Chubb dealer as a substitute, because that would prove nothing
about Humania.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer | A dealer configured for Humania — Not known (Q-002) |
| Vehicle | Any vehicle in that dealer's inventory — Not known; record the id used |
| Client last name | `Gap2499-013` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal as the Humania dealer, open `/vehicle/{vehicleId}/details` of one of its vehicles, click **Create quote**, fill the shared client values (last name `Gap2499-013`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with no financing; the quote id is recorded; "Summary of products" shows "Gap Insurance" and "Creditors insurance" rows with **+** buttons |
| 2 | Click the **+** button on the "Gap Insurance" row, then take a screenshot of the whole modal (scroll inside it if needed) | A modal opens on the same page without an error page or HTTP 5xx; the screenshot is saved |
| 3 | Close it, then click the **+** button on the "Creditors insurance" row, then take a screenshot of the whole modal | A modal opens on the same page without an error page or HTTP 5xx; the screenshot is saved |
| 4 | In the creditors modal, enter F1 in the financing form and submit it, then take a screenshot of the whole modal | No error page or HTTP 5xx; the URL is unchanged; the modal stays open with the insurance step below the financing form; the screenshot is saved |
| 5 | [Verification] Compare the screenshots of steps 2, 3 and 4 | In each modal the first block is the financing form (empty at steps 2–3, showing F1 at step 4) and the insurance form or results sit below it. Neither modal shows "Please add a financing in order to get a GAP quote." or "…a creditors quote." Record the provider name and fields of each insurance form |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Financing form replaces the alert (Humania) | AP2499_013 | — | — | — |
| REQ-002 — Financing form always first (Humania dealer) | AP2499_013 | — | — | — |
| REQ-003 — Empty stored value falls back to empty/placeholder | — | — | AP2499_012 | — |
| REQ-006 — Validation, nothing partly saved | — | AP2499_011 | AP2499_012 | — |

### Whole-ticket coverage (all three files)

| Requirement | Test cases |
|---|---|
| REQ-001 — Financing form replaces the alert | AP2499_001, AP2499_002, AP2499_013 |
| REQ-002 — Financing form always first, insurance below | AP2499_001, 002, 003, 004, 005, 013 |
| REQ-003 — Prefill from the stored financing | AP2499_003, 004, 005, 012 |
| REQ-004 — Submit saves and continues in the modal | AP2499_003, 006 |
| REQ-005 — Insurance result below; failure keeps values | AP2499_007, 008, 009 |
| REQ-006 — Validation, nothing saved | AP2499_010, 011, 012 |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2499_012 | "Why this matters" and step 5: an empty residual, a placeholder text or `0` is record-only for Q-004; the case fails only on a non-zero residual or on any date of birth appearing | Reviewer R2 REWORK F-2 — Q-004 (Judgement, Open) |
| 2026-11-01 | AP2499_013 | Steps 2, 3 and 4 now say to take the screenshots that step 5 compares (case stays BLOCKED on Q-002) | Reviewer R2 REWORK F-5 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2499_011 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_011-step5-FinancingUnchanged_pass.png` |
| AP2499_012 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_012-step5-NoFinancingStored_pass.png` |
| AP2499_013 | BLOCKED | — |

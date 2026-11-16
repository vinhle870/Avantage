# Test Cases — AP2499 (File 2 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2499 — Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Source:** requirements/AP-2499-add-gap-creditors-insurance-financing-form.md · qa-artifacts/1-requirements-analysis/AP-2499_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2499_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2499_006 to AP2499_010 (5 test cases)
**Coverage:** Functional · Negative · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` (never a bare `/quote/new/client`, which returns HTTP 500 on the quote page) → `/quote/{id}/details`. On the quote page, the card **"Summary of products"** has the rows **"Gap Insurance"** and **"Creditors insurance"**, each with a **+** button that opens the add modal (ticket screenshots). The stand-alone financing page is `/quote/{id}/financing` | `navigation` → `domain` (quote-creation.md); the modal is not yet mapped — taken from the ticket screenshots |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Dev (v2dev) — the registry's `execution_env`; dealer portal URL from the "Dev Environment" section of the `env` source | `env`, `qa-config/tools.md` |
| **Login** | The shared dealer account (dealer 1380, "Test QA staging"), Chubb-configured with creditor forms PM30 and PM50, named in the `env` source; the password is read from there at run time and never written into the log | `env`, `domain` (chubb-insurance.md §6) |
| **Test data** | Vehicle **915** (Ford Focus 2008, VIN `1FAHP35NX8W239204`) — used only as the vehicle each new quote is created from | `test-data` |
| **Language** | EN for every judgement; `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One client and one quote per case; a financing on the quotes of 006–009; a priced Chubb creditors quote (007), a priced GAP quote (008); for 009 (re-designed 2026-11-15) a financing with no date of birth, if the build stores it, and a refused — or, if Chubb prices it, a saved — creditors quote request. The 2026-11-02 run left quotes 6538–6542. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared client values** — First name `Gap`, Last name as given in the case, Email
`client.stage.NNN@yopmail.com` (next unused number, recorded), Address `100 Rue Test`, City
`Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone
`5145550102`, "I agree to the policy" ticked → **Save**. Then on `/quote/{id}/vehicle` keep
vehicle 915, Delivered at `2026-11-01`, Price `20000` → **Save**.

**Shared financing values (F1)** — Applicant date of birth `1990-01-01`, Type = the first
non-empty option (record its label), Base amount `25000`, Residual amount `0`, Payment
frequency "Monthly" (if absent, the first non-empty option, recorded), Term months `60`,
Interest rate `6.99`, Financing company = the first non-empty option (record its label).

**Saving F1 on a new quote** (used by 006–009) — open `/quote/{id}/financing`, enter F1 →
**Save**. If that page cannot be used (button disabled, redirect or error — record which),
open the Gap Insurance **+** modal, enter F1 in its financing form, submit it, and close
the modal.

**Shared insurance values** — Creditors (fields as on the Chubb creditor form, `domain`
chubb-insurance.md §5–§6): Language "English", Tax exempt "No", Form "Monthly Premium
PM30", Life type "DECREASING" (label may read "Decreasing"), Life term `60`, Life covered
person "BORROWER", Critical illness and Disability left empty. GAP: GAP term `60`; any
other GAP field the modal requires gets its first non-empty option, recorded.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | The GAP / creditors add modal is not mapped in `domain` | AP2499_006–010 | Not blocking at design — reached through the **+** buttons; mapped at run time |
| 2 | How to make the GAP / creditors quote fail on purpose | AP2499_009 | **Answered** — Q-007 (AP-2405 developer comment, 2026-01-22): a creditors quote whose borrower has no date of birth is refused. Not known whether Dev stores a financing without a date of birth (R1 F-2): step 2 records a refusal and step 3 reads the stored Date of birth in the modal's financing form after **Edit** (the Financing card never shows it); a refusal, or a date shown at step 3, makes the case BLOCKED with that reason; a priced result at step 5 is BLOCKED too, never PASS. No GAP trigger is defined, so the case is creditors only |
| 3 | Whether dealer 1380 is configured for GAP (only creditor forms PM30 / PM50 have been seen) | AP2499_008 | Not blocking at design — if the modal offers no GAP quote for this dealer, the case is recorded BLOCKED at run time with that reason |

> Designed with no case BLOCKED; executed 2026-11-02 on Dev (v2dev); AP2499_009 re-designed 2026-11-15 and set to Not Run — see the Execution Log below and `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2499_006 | Correcting the base amount of an existing financing in the creditors modal saves the new amount on the quote | Functional | High | FAIL |
| AP2499_007 | A creditors insurance quote on a saved financing shows its result below the form in the same modal | Functional | High | FAIL |
| AP2499_008 | A GAP insurance quote on a saved financing shows its result below the form in the same modal | Functional | High | FAIL |
| AP2499_009 | A creditors quote for a borrower with no date of birth shows an error in the modal and keeps the entered values | Negative | Medium | BLOCKED |
| AP2499_010 | Submitting an empty financing form shows an error on each required field left empty and saves nothing on the quote | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2499_006 — Correcting the base amount of an existing financing in the creditors modal saves the new amount on the quote

| Field | Value |
|---|---|
| **TC ID** | AP2499_006 |
| **Title** | Correcting the base amount of an existing financing in the creditors modal saves the new amount on the quote |
| **Requirement** | AP2499 — REQ-004, AC "Submit persists and continues in the modal" (the "corrects" branch) |
| **Route** | `/quote/{id}/details` — Summary of products → Creditors insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Step 3: after Save the modal renders the whole quote page, no creditors step; 30000 stored (quote 6538) |

**Why this matters:** The criterion covers a dealer who "fills **or corrects**" the
financing. A correction that is shown but not stored, or that is stored next to the old
financing instead of replacing it, would price the insurance on the wrong loan. Whether
the same financing is updated or a new one is created is not stated (Q-006), so the case
judges only that the quote now shows the corrected amount, and records anything else.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-006` |
| Stored financing | F1 (base amount 25000) |
| Correction | Base amount `30000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-006`) → **Save**, set the vehicle step (Delivered at `2026-11-01`, Price `20000`) → **Save**, then save F1 on the quote as described under "Saving F1 on a new quote" | `/quote/{id}/details` shows a financing with base amount 25000; the quote id and page URL are recorded |
| 2 | Click the **+** button on the "Creditors insurance" row; in the modal's financing form change Base amount from `25000` to `30000`, leave every other field as prefilled | The modal opens without an error page or HTTP 5xx; the financing form shows F1 and then `30000` in Base amount |
| 3 | Click the financing form's submit control | No error page or HTTP 5xx; the browser URL is unchanged and the modal is still open, now showing the creditors insurance step below the financing form, which still shows `30000` |
| 4 | Close the modal and reload `/quote/{id}/details` | The page reloads without an error |
| 5 | [Verification] Read the Financing card, then re-open the Creditors insurance **+** modal | The Financing card shows base amount 30000 and the other F1 values unchanged (term 60, interest rate 6.99, Monthly, the recorded type and company); no value 25000 remains as the quote's base amount. The re-opened modal's financing form shows `30000`. Record whether the page shows one financing or more than one anywhere (Q-006) |

---

### AP2499_007 — A creditors insurance quote on a saved financing shows its result below the form in the same modal

| Field | Value |
|---|---|
| **TC ID** | AP2499_007 |
| **Title** | A creditors insurance quote on a saved financing shows its result below the form in the same modal |
| **Requirement** | AP2499 — REQ-005, AC "Insurance results render below the form" (success branch, creditors); regression of the creditors quote on "Summary of products" |
| **Route** | `/quote/{id}/details` — Summary of products → Creditors insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Steps 3, 5: Get Quote reloads the quote page and closes the modal; result only on the row (quote 6539) |

**Why this matters:** The priced result is what the dealer sells. Before this story a
submitted creditor quote redirected back to the quote page (`chubb-insurance.md` §5); now
it must render inside the modal. The premium figures are computed by Chubb and are not
described, so they are recorded, not judged. Whether the result is still shown when the
modal is re-opened is recorded for Q-008 (Info). Bug AP-2410 records errors on valid
creditor submissions; an error here goes to Gate C, where AP-2410 is checked.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-007` |
| Stored financing | F1 |
| Creditors insurance | Shared creditors values (PM30, Life DECREASING / 60 / BORROWER) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-007`) → **Save**, set the vehicle step → **Save**, then save F1 on the quote as described under "Saving F1 on a new quote" | `/quote/{id}/details` shows a financing; the quote id and page URL are recorded |
| 2 | Click the **+** button on the "Creditors insurance" row; in the creditors insurance form below the financing form, enter the shared creditors values | The modal opens without an error page or HTTP 5xx; the financing form is at the top showing F1; each creditors value shows in its field |
| 3 | Click the insurance form's submit control (label recorded, e.g. "Get Quote"), wait up to 30 seconds for the answer, then take a screenshot of the whole modal (scroll inside it if needed) | No error page or HTTP 5xx; the browser URL is unchanged and the modal is still open; the screenshot is saved |
| 4 | Close the modal and look at the "Creditors insurance" row of "Summary of products"; then re-open the modal | No error. Record what the row shows now (a premium, "- None Selected -", or other) and whether the re-opened modal still shows the result (record-only, Q-008) |
| 5 | [Verification] Look at the screenshot taken after step 3, from top to bottom | Inside the same modal, the financing form (F1 values) is at the top and a result block with at least one premium figure (a currency amount) for the Life coverage is rendered below the form. No "Please add a financing…" alert is shown. Record the premium, tax and commission figures shown, and whether the creditors insurance form is still shown with the step-2 values, cleared, or collapsed (record-only — the ticket states kept values only for the failure path) |

---

### AP2499_008 — A GAP insurance quote on a saved financing shows its result below the form in the same modal

| Field | Value |
|---|---|
| **TC ID** | AP2499_008 |
| **Title** | A GAP insurance quote on a saved financing shows its result below the form in the same modal |
| **Requirement** | AP2499 — REQ-005, AC "Insurance results render below the form" (success branch, GAP) |
| **Route** | `/quote/{id}/details` — Summary of products → Gap Insurance **+** |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | FAIL — Steps 3, 5: Get Quote reloads the quote page and closes the modal; result only on the row (quote 6540) |

**Why this matters:** GAP is the other product the ticket names, and the one the dealer
must price first: the creditors row reminds the dealer to create GAP first so its premium is
included in creditors insurance. Dealer 1380 has only been seen with creditor forms PM30
and PM50; if the modal offers no GAP quote for this dealer, the case is BLOCKED with that
reason rather than failed.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-008` |
| Stored financing | F1 |
| GAP insurance | GAP term `60`; any other required GAP field its first non-empty option, recorded |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-008`) → **Save**, set the vehicle step → **Save**, then save F1 on the quote as described under "Saving F1 on a new quote" | `/quote/{id}/details` shows a financing; the quote id and page URL are recorded |
| 2 | Click the **+** button on the "Gap Insurance" row; in the GAP insurance form below the financing form, enter the GAP values | The modal opens without an error page or HTTP 5xx; the financing form is at the top showing F1; the GAP fields accept the values. If no GAP insurance form is offered (for example a "not configured" message), record its text and stop the case as BLOCKED with reason "dealer 1380 has no GAP configuration" |
| 3 | Click the insurance form's submit control (label recorded), wait up to 30 seconds for the answer, then take a screenshot of the whole modal (scroll inside it if needed) | No error page or HTTP 5xx; the browser URL is unchanged and the modal is still open; the screenshot is saved |
| 4 | Close the modal and look at the "Gap Insurance" row of "Summary of products" | No error. Record what the row shows now (a premium, "- None Selected -", or other) |
| 5 | [Verification] Look at the screenshot taken after step 3, from top to bottom | Inside the same modal, the financing form (F1 values) is at the top and a result block with at least one GAP premium figure (a currency amount) is rendered below the form. No "Please add a financing in order to get a GAP quote." alert is shown. Record the figures shown, and whether the GAP insurance form is still shown with the step-2 values, cleared, or collapsed (record-only — the ticket states kept values only for the failure path) |

---

### AP2499_009 — A creditors quote for a borrower with no date of birth shows an error in the modal and keeps the entered values

| Field | Value |
|---|---|
| **TC ID** | AP2499_009 |
| **Title** | A creditors quote for a borrower with no date of birth shows an error in the modal and keeps the entered values |
| **Requirement** | AP2499 — REQ-005, AC "Insurance results render below the form": "on failure an error is shown without discarding the entered values". Failure trigger from Q-007 (Answered): AP-2405 developer comment, Minh Lưu, 2026-01-22 — a creditors quote fails when the borrower has no date of birth ("DOB of Debtor is required for insurance coverage") or the co-applicant has none ("DOB of Co-Debtor is required for insurance coverage."). Creditors only — no GAP failure trigger is defined |
| **Route** | `/quote/{id}/financing`, then `/quote/{id}/details` — Summary of products → Creditors insurance **+** |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | AP-2566 — a financing saved with Date of birth empty comes back with today's date, so the AP-2405 trigger (Q-007, no borrower date of birth) cannot be set up |
| **Executed on** | 2026-11-15, Dev (v2dev), quote 6711 |
| **Result** | BLOCKED at step 3 — Date of birth shows 2026-11-15 after Edit; Get Quote not clicked |

**Why this matters:** A provider error that wipes the form makes the dealer re-type
everything — the detour this ticket removes, by another route. The developer of the Chubb
integration (AP-2405) names the trigger: no borrower date of birth on the quote. So the
financing is saved here **without a date of birth**. Two things can stop the trigger from
being set up, and neither is a product failure: the build may refuse a financing with no
date of birth, or Chubb may still price the request. Either one makes the case **BLOCKED**
with its reason, never PASS (R1 F-2). The co-applicant trigger is not used: the
co-applicant form requires a date of birth (`domain`, quote-creation.md), so a co-applicant
without one cannot be made. "Get Quote" in this modal reloads the quote page and closes the
modal on a successful quote (known bug AP-2528). The AC does not say where the error must
appear, so if the modal closes, the case re-opens it and judges what the AC does say: an
error is shown and the entered values are still there. The closed modal is recorded and
linked to AP-2528, not failed again here. The error wording is the AC's; AP-2405's message
text is recorded, not required. A re-opened creditors form shows its opening values anyway
(Form PM30, For Borrower only, Language English, Tax exempt No), so "kept" can only be judged
on fields entered with a value different from the one the form opens with: step 3 records
the opening values first, and the creditors values are chosen to differ from them (R2 F-1).

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-009b` (a new client; quote 6541 of the 2026-11-02 run is not reused — it has a date of birth and a priced creditors quote) |
| Stored financing | Shared financing values F1 with Residual amount `0` and **Date of birth left empty** |
| Creditors insurance | Chosen to differ from the form's opening values (recorded at step 3): Language "Français", Tax exempt "Yes", Life type "Decreasing", Life term `48` (not the loan term 60), Life for "Borrower"; Critical illness and Disability left empty. Form stays on "Monthly Premium PM30" — a re-opened form never restores the saved Form on this build (AP-2410 map, quote-creation.md), so PM50 would fail for a known reason. If Language or Tax exempt already opens on the value above, enter its other option and record it |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-009b`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with no financing; the quote id, the page URL and the client e-mail are recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/financing`, enter F1 but leave **Date of birth** empty (Residual `0`) → **Save**, then read the Financing card on `/quote/{id}/details`. If the page cannot be used (disabled, redirect or error — record which), enter the same values in the Creditors insurance **+** modal's financing form → **Save** and close the modal. **If the save is refused because Date of birth is empty, record the message and stop: BLOCKED — "a financing without a date of birth cannot be stored on Dev — the AP-2405 trigger (Q-007) cannot be set up"** | Flash "Financing saved"; the Financing card shows Type (recorded), Financed amount 25,000, Residual 0, Term 60, Interest rate 6.99 and a Payment amount (the card never shows the date of birth — quote-creation.md, AP-2410 map; it is read at step 3); the route used is recorded |
| 3 | Click the **+** button on the "Creditors insurance" row and wait for the heading "Creditors Insurance Quote". If the "Financing" block is folded into one summary line, record that (AP-2526) and click its **Edit** link; read Date of birth and the F1 values. **If Date of birth shows a date, record it and stop: BLOCKED — "a date of birth is stored on the financing — the AP-2405 trigger (Q-007) cannot be set up"**. Before typing, take screenshot `AP2499_009-step3-OpeningValues` of the creditors form and record the value each field opens with (Form, Language, Tax exempt, Life type, Life term, Life for). Then enter the creditors test data (Form left as it is) and take a second screenshot | The modal opens on the same page (URL unchanged) without an error page or HTTP 5xx; the "Financing" block is first (folded or open — recorded, AP-2526); after **Edit** Date of birth is blank and the F1 values are recorded; each entered creditors value shows in its field. Record the **judged fields**: those whose entered value differs from its opening value (expected: at least Language, Tax exempt and Life term). If no field can be given a value different from its opening value, record that and stop: BLOCKED — "kept values cannot be told from the form's opening values", never PASS |
| 4 | Click the creditors form's **Get Quote** (not a financing submit), wait up to 30 seconds for the answer, record the browser URL, then take a screenshot of the modal — or of the page shown if the modal has closed — and save the network request lines of the submit (method, URL, status only) to a `.txt` next to the screenshot. If the modal has closed and the browser is on `/quote/{id}/details`, re-open the Creditors insurance **+** modal, wait for the heading "Creditors Insurance Quote", click **Edit** on a folded "Financing" block (AP-2526) and take a second screenshot | No HTTP 5xx error page; the screenshots and the request lines are saved. Record which outcome occurred: (a) an error inside the open modal; (b) the quote page reloaded with the modal closed (with or without a message); (c) the browser left `/quote/{id}/details` (URL recorded, e.g. `/quote/{id}/insurance` drawn as a full page) — nothing is re-opened and step 5 judges the page shown; (d) a priced result. Record the full text of any message (search by `alert` role and by the words "DOB", "required" and "error") |
| 5 | [Verification] Look at the step-4 screenshots (the open modal, the page shown at outcome (c), or the re-opened modal) from top to bottom and compare them with the step-3 opening-values screenshot | An error is shown (where — inside the open modal, on the reloaded quote page, or on the page shown at outcome (c) — is recorded), and no entered value was discarded: every **judged field** from step 3 still shows its entered value (e.g. Français, Yes, `48`), not its opening value or empty. Recorded, not judged: Form (a re-opened form shows PM30 whatever was saved — AP-2410 map), Life for (Borrower is the only option without a co-applicant), any field whose entered value equals its opening value, and the "Financing" block's F1 values and Date of birth, read after **Edit** — a folded block is recorded against AP-2526, not failed. The message text is recorded; AP-2405 names "DOB of Debtor is required for insurance coverage", and different wording is not a failure. A closed modal or a page change on **Get Quote** is reported to Gate C as an observation related to AP-2528, not judged here. **If a priced result was returned instead:** record the figures and stop BLOCKED — "failure not reproduced: Chubb priced a creditors quote with no borrower date of birth — Q-007 (AP-2405 trigger)", never PASS. The case **fails** if no error is shown, if any judged field shows its opening value or is empty, or on an error page or HTTP 5xx |

---

### AP2499_010 — Submitting an empty financing form shows an error on each required field left empty and saves nothing on the quote

| Field | Value |
|---|---|
| **TC ID** | AP2499_010 |
| **Title** | Submitting an empty financing form shows an error on each required field left empty and saves nothing on the quote |
| **Requirement** | AP2499 — REQ-006, AC "Validation" (missing fields; no partial financing or insurance row persisted) |
| **Route** | `/quote/{id}/details` — Summary of products → Gap Insurance **+** |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | PASS — Field errors in the modal, nothing stored (quote 6542) |

**Why this matters:** The criterion names six fields that must be validated: type, base
amount, payment frequency, term, interest rate and financing company. A submit with them
missing must not leave a half-made financing behind, because the insurance premium and the
sale are calculated from it. Residual and date of birth are not in the list; what they do
is recorded for Q-011, and the exact error wording is recorded for Q-012. Whether each
drop-down (type, payment frequency, financing company) has an empty option or opens on a
default is not stated (Q-004), so an error is expected only next to the fields actually
left empty; the main check is that nothing is stored.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Gap2499-010` |
| Financing form | Every field left empty / at its placeholder, except Applicant date of birth `1990-01-01`. A drop-down that cannot be emptied keeps the value it opens on, and that value is recorded |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the shared client values (last name `Gap2499-010`) → **Save**, then on `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with no financing; the quote id and page URL are recorded |
| 2 | Click the **+** button on the "Gap Insurance" row; in the financing form type only Applicant date of birth `1990-01-01` and leave every other field empty. For each drop-down (Type, Payment frequency, Financing company), choose its empty / placeholder option if it has one; if it cannot be emptied (it opens pre-selected and offers no empty option), leave it as it is | The modal opens without an error page or HTTP 5xx; every text and number field except the date of birth is empty. Record, for each drop-down, whether it was left empty or "cannot be emptied" with the value it holds (Q-004) — a drop-down that cannot be emptied is not a failure |
| 3 | Click the financing form's submit control | No error page or HTTP 5xx; the browser URL is unchanged and the modal is still open. An error message is shown next to each of the six listed fields that was actually left empty at step 2 — always Base amount, Term months and Interest rate, plus Type, Payment frequency and Financing company only if they were left empty (record each text, Q-012). No error is expected on a drop-down recorded as "cannot be emptied". Record whether Residual shows an error (Q-011). The modal does not move on to the insurance step |
| 4 | Close the modal and reload `/quote/{id}/details` | The page reloads without an error |
| 5 | [Verification] Read the Financing card and the "Gap Insurance" and "Creditors insurance" rows of "Summary of products" | The Financing card still shows no financing (the same empty state as at step 1), and both insurance rows still read "- None Selected -": no partial financing and no insurance row was stored |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 — Submit saves and continues (correction) | AP2499_006 | — | — | — |
| REQ-005 — Insurance result below the form; failure keeps the values (009: creditors, AP-2405 trigger) | AP2499_007, AP2499_008 | AP2499_009 | — | AP2499_007 (Summary of products row) |
| REQ-006 — Financing validation, nothing saved | — | AP2499_010 | — | — |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2499_007, AP2499_008 | Step 5: the check that the insurance form "still holds the values entered at step 2" after a successful quote is now record-only; the result-below-the-form check is unchanged | Reviewer check 2.5 fix (guessed assertion) — ReviewFindings_2026-11-01 Pass 1 #1 (REQ-005 AC 1 states kept values only "on failure"). Originally logged as Gate B rule B1; corrected to rule B3 by reviewer R2 REWORK F-4, since REQ-005 already has cases 007–009 |
| 2026-11-01 | AP2499_009 | "Why this matters", step 3 (screenshot) and step 4: a priced result for Life term 999 now records the case **BLOCKED** — "failure not reproduced with Life term 999 — Q-007" — instead of passing on the absence of objective faults; Known blockers row 2 reworded to match | Reviewer R2 REWORK F-1 (Blocker) — analysis REQ-005 risk: "never claim it passed" |
| 2026-11-01 | AP2499_010 | Title, test data, "Why this matters", steps 2–3: a drop-down that cannot be emptied is recorded, and an error is expected only next to each field actually left empty; step 5 "nothing stored" stays the main check | Reviewer R2 REWORK F-3 — drop-down opening state is Q-004 (Open) |
| 2026-11-01 | AP2499_007, AP2499_008 | Step 3 now says to take the screenshot of the modal that step 5 reads | Reviewer R2 REWORK F-5 |
| 2026-11-02 | AP2499_009 | **Blocked by** set to "Q-007 — failure not reproduced with Life term 999" (was "—"); no step or expected result changed | Independent R3 F-3 — the blocker was named only in the Result field |
| 2026-11-15 | AP2499_009 | Re-designed on the AP-2405 trigger: the financing is saved with **no date of birth** (Life term back to `60`, the 999 trigger dropped); step 2 records whether a financing and quote client without a date of birth can be stored (refused or a date of birth shown → BLOCKED); a priced result stays BLOCKED, never PASS; the expected result is REQ-005 AC 1's own wording — an error is shown and every entered value is kept, checked in the open or re-opened modal (where the error appears is recorded, since the AC does not say; a closed modal is recorded against AP-2528); the record-only outcome list became an assertion; network request lines saved at step 4; new client `Gap2499-009b`. Status back to Not Run; **Blocked by**, **Executed on** and **Result** cleared — the Execution Log row below is the 2026-11-02 run of the old design | 2026-11-15 re-analysis — Q-007 Answered (AP-2405, Minh Lưu, 2026-01-22); reviewer R1 F-2 |
| 2026-11-15 | File | Execution Context: Environment row now Dev (v2dev) (was v2staging); Leaves behind updated for 009; Known blockers row 2 updated to the Q-007 answer. AP2499_006–008 and 010 unchanged and keep their 2026-11-02 results | Registry `execution_env: Dev`; Q-007 Answered |
| 2026-11-15 | AP2499_009 | Test data and steps 2–5 reworked: creditors values now chosen to differ from the form's opening values (Language Français, Tax exempt Yes, Life term `48`; Form kept on PM30); step 3 records the opening values (screenshot) before typing and lists the judged fields — none → BLOCKED "kept values cannot be told from the form's opening values"; step 5 judges "not discarded" only on the judged fields and records Form, For and the stored financing values. Steps 3–4 wait for the "Creditors Insurance Quote" heading and click **Edit** on a folded Financing block (AP-2526, recorded not failed). Step 2 expects only the card fields the domain lists; the stored Date of birth is read in the modal after **Edit** at step 3 (a date shown → BLOCKED). Step 4 adds outcome (c) "the browser left `/quote/{id}/details`" (URL recorded, step 5 judged on the page shown); a closed modal or page change goes to Gate C as an observation related to AP-2528. Why this matters and Known blockers row 2 updated. Still Not Run | Reviewer R2 round 1 REWORK F-1, F-2 (Major), F-3, F-4 (Minor) — qa-artifacts/7-reviews/AP-2499_review.md |
| 2026-11-15 | AP2499_009 | **Blocked by** set to AP-2566 (the bug filed for AP2499_005's failure); no step or expected result changed | Independent R3 round 1 minor F-3 — the blocker named only the behaviour, not the bug |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2499_006 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step3-ModalRendersQuotePage_fail.png` |
| AP2499_007 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_007-step3-PageReloadedModalClosed_fail.png` |
| AP2499_008 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_008-step3-PageReloadedModalClosed_fail.png` |
| AP2499_009 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_009-step3-Nov15-DOBShowsTodayDate_blocked.png` (2026-11-15, re-designed case) |
| AP2499_010 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_010-step5-NothingStored_pass.png` |

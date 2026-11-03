# Test Cases — AP2225 (File 4 of 4)

**Project:** Avantage Plus v2 — Dealer portal (and Admin portal for AP2225_013)
**Requirement:** AP2225 — Dealer Area: AutoShield create contract
**Source:** requirements/AP-2225-dealer-area-autoshield-create-contract.md · qa-artifacts/1-requirements-analysis/AP-2225_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2225_test-plan.md · qa-artifacts/3-test-cases/AP2225_ReviewFindings_2026-11-01.md (promoted at Gate B, rule B1)
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2225_013 to AP2225_015 (3 test cases)
**Coverage:** Functional · Negative

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer; Admin for the lender-ID reads in AP2225_013. Both sessions can be open at once in one browser — logging in to `/admin/login` does not end the dealer session. | `navigation` |
| **Entry route** | Dealer: `/vehicle/915/details` → header action **Create quote** → `/quote/new/client?fromVehicleId=915` → **Save** → `/quote/{id}/details`; **Road Side Protection** → `/quote/{id}/road-side-protection`; Road Side Protection contract list `/road-side-protection-contracts` (sidebar Contracts → Road Side Protection; columns include VIN, client name/phone, sale price, Autoshield contract ID). Admin: the financing-company list and edit page — **Not known**: no `navigation` row maps it; AP-2226 (Done) places an "AutoShield Lender ID" field on the admin's financing-company edit page. Find it from the Admin sidebar and write the route in the log. | `navigation` → `domain` (quote-creation.md, chubb-insurance.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer — `vinhle870@gmail.com` at `/login`; Admin — the same account at `/admin/login` (French page: "Courriel", "Mot de passe", "Se connecter"). Passwords as recorded in the `env` source. | `env`, `navigation` |
| **Test data** | Vehicle **915**, VIN `1FAHP35NX8W239204`, Ford Focus 2008, mileage **5000 km**. | `test-data` |
| **Language** | EN. | `navigation` |
| **Leaves behind** | Quotes C and D, and one AutoShield contract each in AutoShield's test system (two if AP2225_015 finds a duplicate). AP2225_013 may leave a newly stored AutoShield Lender ID on one financing company — that is the feature's own intended effect, not a test change, and is not reverted. The execution log lists every quote ID, contract ID and financing company touched. | `cleanup` (missing) |

**Quote recipe** (dynamic, one fresh quote per case — each case generates a contract, so
no quote is shared): client form (`/vehicle/915/details` → **Create quote**) with First
name `QA`, Last name `AP2225-<letter>-<HHMMSS>` (letter given in the case, 24-hour time
now), Email `client.stage.NNN@yopmail.com` (next unused number), Address `100 rue Test`,
City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550101`, Tel. work
`5145550102`, policy agreement ticked → **Save**; vehicle step `/quote/{id}/vehicle` with
Delivery date `2026-10-15`, Price `18500` → **Save**; financing `/quote/{id}/financing` with
date of birth `1985-06-15`, Type "Financing", base amount `15000`, residual `0`, "Monthly",
term `60`, interest rate `6.99`, and the financing company named in the case → **Save**.

**Save button rule (REQ-004).** The `domain` page map (quote-creation.md) records only one
button on `/quote/{id}/road-side-protection`: **Save and Generate Contract**. A step that
says "click Save" means a button labelled exactly "Save"; the combined button is never
pressed for a Save step. In place of Save, only **AP2225_014** may use the combined button,
and only as its step 2 describes (each case in this file generates its own contract on its
own quote, so the combined button creates no unplanned contract there). The missing
standalone Save is judged by AP2225_005, not here.

**Generate Contract rule (same in files 2, 3 and 4).** A step that says "click Generate
Contract" means a button labelled exactly "Generate Contract". If no such button exists,
press **"Save and Generate Contract"** instead (twice within half a second in AP2225_015),
write the label pressed in the log, and judge the step on the page that follows. The missing
"Generate Contract" label is judged by AP2225_007, not by the Generate step. This applies to
AP2225_013 step 3 and AP2225_015 step 3.

**Known blockers:** None that make a case BLOCKED. Declared knowledge gap: the Admin
financing-company route is not mapped (no `navigation` row). Per the knowledge rules the
case proceeds and the executor writes the route back; if the page cannot be found from the
Admin sidebar, AP2225_013 is recorded BLOCKED with that reason.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2225_013 | Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it | Functional | Medium | BLOCKED |
| AP2225_014 | Values the dealer overrides and saves are the values shown on the generated contract, not the quote defaults | Functional | High | FAIL |
| AP2225_015 | Double-clicking "Generate Contract" creates only one AutoShield contract for the quote | Negative | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2225_013 — Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it

| Field | Value |
|---|---|
| **TC ID** | AP2225_013 |
| **Title** | Generating a contract with a financing company that has no AutoShield Lender ID stores a new lender ID on it |
| **Requirement** | AP2225 — REQ-005 AC 2 ("check for the financing company's autoshieldLenderID field … If it's empty, call create lender API, then store the returned lender ID") |
| **Route** | Admin financing-company edit page (route not mapped — see Execution Context); dealer `/quote/{id}/road-side-protection` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | BLOCKED — no contract-generating button on Dev (step 1 passed) |

**Why this matters:** If the lender ID is not stored, the system creates a new AutoShield lender on every contract for that company, filling AutoShield with duplicates. Medium because the dealer still gets a contract either way.

**Test Data:**

| Variable | Value |
|---|---|
| Financing company | One whose "AutoShield Lender ID" is **empty** in the Admin portal, chosen in step 1; write its name in the log |
| Quote | Quote C — Last name `AP2225-C-<HHMMSS>`, financing company = the one chosen in step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal. From the sidebar, open the financing-company list (write its route in the log) and open companies' edit pages until one shows an empty "AutoShield Lender ID"; write its name in the log. Do not edit any company | A financing company with an empty AutoShield Lender ID is found and recorded. If every company already has one, record the case **BLOCKED — no financing company without a lender ID** (the empty path cannot be exercised without changing shared configuration) |
| 2 | [Pre-Condition] Log in to the dealer portal and create Quote C with the quote recipe, choosing the financing company from step 1 on the financing page | Quote C's hub shows the vehicle, client and that financing company |
| 3 | Open `/quote/{id}/road-side-protection` for Quote C, check Financing Company shows the step 1 company, select the first tier / product option, and click the button labelled exactly "Generate Contract". If there is none, press "Save and Generate Contract" instead (the missing label is judged by AP2225_007, not here). Write the label pressed in the log | The autoShield contract page opens with an AutoShield contract ID; write it in the log. If it does not, record the page shown — this case then FAILs on the same fault as AP2225_009 |
| 4 | [Verification] In the Admin portal, reload the edit page of the step 1 financing company and read "AutoShield Lender ID" | The field now holds a non-empty value; write it in the log. Still empty is a FAIL |

---

### AP2225_014 — Values the dealer overrides and saves are the values shown on the generated contract, not the quote defaults

| Field | Value |
|---|---|
| **TC ID** | AP2225_014 |
| **Title** | Values the dealer overrides and saves are the values shown on the generated contract, not the quote defaults |
| **Requirement** | AP2225 — REQ-002 AC 3 ("These are the default values that can be overridden by the user when filling out the form"); REQ-006 AC 4 (contract fields from the API) |
| **Route** | `/quote/{id}/road-side-protection` → autoShield contract page → PDF |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | FAIL — step 2: no Odometer / Stock Number / Sale Price fields to override |

**Why this matters:** Overriding a default is only useful if the corrected value is what AutoShield registers. If the contract still carries the quote's mileage, stock number or sale price, the client is covered on wrong data even though the dealer fixed it on screen.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote D — Last name `AP2225-D-<HHMMSS>`, financing company = the first in the list |
| Odometer Reading override | `7777` (default `5000`) |
| Stock Number override | `QA14-<HHMMSS>` |
| Sale Price (CAD) override | `19999` (default `18500`, the quote price) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and create Quote D with the quote recipe | Quote D's hub shows the vehicle, client and financing |
| 2 | Open `/quote/{id}/road-side-protection` for Quote D, select the first tier / product option, set Odometer Reading to `7777`, Stock Number to `QA14-<HHMMSS>` and Sale Price (CAD) to `19999`. **If a button labelled exactly "Save" exists:** click it, then reload the page. **If not:** the combined "Save and Generate Contract" button may be used for this case — take a screenshot showing the three overridden values in the form, write "combined button used" in the log, click "Save and Generate Contract" once, and go to step 3's expected result (no reload is possible before generating) | Save path: after the reload, Odometer Reading shows `7777`, Stock Number `QA14-<HHMMSS>` and Sale Price (CAD) `19999`. Combined path: the screenshot shows the three values in the form immediately before the click |
| 3 | Click "Generate Contract" (skip the click if step 2 used the combined button) | The autoShield contract page opens with an AutoShield contract ID; write it in the log |
| 4 | [Verification] On the contract page, read the vehicle item and every place that shows an odometer / kilometre reading, a stock number or the vehicle's sale / purchase price (record salePriceWithTaxCAD and totalTaxCAD with their labels); then open the PDF link and read the same values in the PDF where its text can be read | Wherever the contract page or the PDF shows the vehicle's odometer reading, stock number or vehicle sale price, it shows `7777` / `QA14-<HHMMSS>` / `19999`. Showing `5000`, the vehicle's original stock number, or `18500` as the vehicle sale price is a FAIL. salePriceWithTaxCAD is judged only if the page or PDF labels it as the vehicle's sale price; otherwise record it for Q-008. If **none** of the three overridden values is displayed on the page or in the PDF, record the case **BLOCKED — overrides not displayed (Q-008)**, not PASS |

---

### AP2225_015 — Double-clicking "Generate Contract" creates only one AutoShield contract for the quote

| Field | Value |
|---|---|
| **TC ID** | AP2225_015 |
| **Title** | Double-clicking "Generate Contract" creates only one AutoShield contract for the quote |
| **Requirement** | AP2225 — REQ-005 AC 3 ("creates the contract VIA autoshield API") — one click is one contract; error guessing promoted at Gate B |
| **Route** | `/quote/{id}/road-side-protection`; `/road-side-protection-contracts` |
| **Type** | Negative |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) |
| **Result** | BLOCKED — no contract-generating button on Dev |

**Why this matters:** Every contract is a real record at AutoShield that the portal cannot delete. A double click on a slow page that registers two contracts for one sale has to be cancelled by hand and may be billed twice. The ticket describes one click creating one contract; a second contract
that the dealer never asked for is treated as an objective fault (a record nobody requested),
not as a guessed rule.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote E — Last name `AP2225-E-<HHMMSS>`, financing company = the first in the list |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and create Quote E with the quote recipe | Quote E's hub shows the vehicle, client and financing |
| 2 | [Pre-Condition] Open `/road-side-protection-contracts` and count the rows whose client name contains `AP2225-E-<HHMMSS>` | Zero rows for this client |
| 3 | Open `/quote/{id}/road-side-protection` for Quote E, select the first tier / product option, and double-click the button labelled exactly "Generate Contract" (two clicks within half a second). If there is none, double-click "Save and Generate Contract" instead, two clicks within half a second (the missing label is judged by AP2225_007, not here). Write the label pressed in the log | The browser shows one page after loading; no error page. Write the contract ID shown, if any |
| 4 | [Verification] Open `/road-side-protection-contracts` and count the rows whose client name contains `AP2225-E-<HHMMSS>`; write each contract ID in the log | Exactly one row is listed for this client. Two or more rows (two AutoShield contract IDs) is a FAIL. If the contract list shows no row for this client, the count cannot be proven from the portal: record the case **BLOCKED — contract list does not show generated AutoShield contracts (Q-012)**, with the contract ID seen in step 3 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-005 AC 2 — lender ID stored when empty | AP2225_013 | — | — | — |
| REQ-002 AC 3 → REQ-006 AC 4 — overrides reach the contract | AP2225_014 | — | — | — |
| REQ-005 AC 3 — one click, one contract | — | AP2225_015 | — | — |

**Revisions**

| Date | TC | Change | Why |
|---|---|---|---|
| 2026-11-01 | AP2225_013 | New | Gate B rule B1 — review Pass 1 gap 1 (REQ-005 AC 2 had no case) |
| 2026-11-01 | AP2225_014 | New | Gate B rule B1 — review Pass 2 item 1 (High) |
| 2026-11-01 | AP2225_015 | New | Gate B rule B1 — review Pass 2 item 2 (High) |
| 2026-11-01 | AP2225_014 | Sale Price (CAD) override `19999` added; step 2 states the combined button may be used (screenshot of overrides before the click); step 4 records BLOCKED (Q-008) when no override is displayed instead of judging "other values" | Independent R2 review F-2, F-4 |
| 2026-11-01 | AP2225_015 | Step 4: an empty contract list now records BLOCKED (Q-012) instead of PASS on a single contract-page ID | Independent R2 review F-3 |
| 2026-11-01 | Execution Context | Save button rule; only AP2225_014 may use "Save and Generate Contract" in place of Save | Independent R2 review F-2 |
| 2026-11-01 | AP2225_013 step 3, AP2225_015 step 3, Execution Context | One Generate Contract rule shared with files 2 and 3: no standalone "Generate Contract" → press "Save and Generate Contract" (twice in AP2225_015), log the label pressed; missing label judged by AP2225_007. Save rule reworded to "in place of Save, only AP2225_014 may use the combined button" | Independent R2 review round 2 F-1 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2225_013 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_013-step1-AutoCapitalLenderIdEmpty_pass.png` |
| AP2225_014 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.0.0/AP-2225/AP2225_014-step2-NoOverrideFields_fail.png` |
| AP2225_015 | BLOCKED | — |

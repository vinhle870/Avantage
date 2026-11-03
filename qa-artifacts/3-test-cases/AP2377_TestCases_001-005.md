# Test Cases — AP2377 (File 1 of 3)

**Project:** Avantage Plus v2 — Customer portal, online warranty purchase
**Requirement:** AP2377 — Customer portal changes (new current-warranty fields, Client Info before Coverage, FORM L25 consent, surcharges on the summary and in the admin)
**Source:** requirements/AP-2377-customer-portal-changes.md · qa-artifacts/1-requirements-analysis/AP-2377_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2377_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2377_001 to AP2377_005 (5 test cases)
**Coverage:** Functional · UI · Negative (record-only) · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client (customer) portal — the public "buy a warranty online" flow. No login. | `navigation` (lists only the old per-customer link), ticket capture |
| **Entry route** | `/customer/avantage-plus/buy` — the route the ticket's Given names. This flow is **not mapped** in the knowledge base; record each step's URL and labels as found. | capture AC 1; `navigation` gap |
| **Viewport** | 1280 × 800 (desktop). `navigation` gives no Client viewport; desktop matches the ticket's screenshots. No expected result depends on it. | `navigation` (gap), tools.md browser settings |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | None for the customer flow. | `env` |
| **Test data** | Vehicle from the ticket's summary screenshot (A3): 2020 TESLA Model 3 Plus, VIN `5YJ3E1EA0LF734293`. Current-warranty values from A1: Warranty Number `2131331`, Warranty mileage limit `100000`; end date `2027-12-18` (A1's `2025-12-18` is now in the past). Client: a fresh `client.stage.NNN@yopmail.com` per run (next unused three-digit number; write the one used in the log). | capture A1/A3, `env` (Yopmail pattern) |
| **Language** | English unless the case says French. The page has an `English` / `Français` language link at the top right (A3 shows `English` while in French). | capture A3 |
| **Leaves behind** | One unfinished online purchase per case that passes the Vehicle step, and a client record if the portal saves one at the Client Info step. Nothing is paid. | `cleanup` (missing — no teardown defined) |
| **Write-back after execution** | The entry route, the purchase-flow steps and labels (including the vehicle-entry fields above "Market Value*") and the test data (VIN `5YJ3E1EA0LF734293`, current-warranty values) come from the ticket capture, not from the `navigation` or `test-data` sources. After s4, write what was found back to `qa-docs` and the `navigation` / `test-data` sources (knowledge-sources.md §4). | capture; knowledge gap |

**Known blockers** — a fact these test cases need that nobody has supplied yet:

None for this file. The purchase flow's exact field labels below `Market Value*` are known
only from attachment A1; the vehicle-entry fields above it (VIN or Year / Make / Model) are
not mapped, so step 1 of each case says to fill whichever of them the form asks for and to
record their labels. That decides no expected result.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2377_001 | The vehicle form ends with a "Current manufacturer/extended warranty" section of three fields and a "Continue" button | Functional | High | PASS |
| AP2377_002 | In French, the vehicle step's button reads "Continuer" and the Client Info button reads "Demander un devis" | UI | Medium | PASS |
| AP2377_003 | Submitting the vehicle form opens the Client Info step, now placed before Coverage in the step bar | Functional | High | PASS |
| AP2377_004 | Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data | Negative | Medium | FAIL |
| AP2377_005 | The Client Info step shows the FORM L25 consent checkbox, unticked, and a "Get rates now" button | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2377_001 — The vehicle form ends with a "Current manufacturer/extended warranty" section of three fields and a "Continue" button

| Field | Value |
|---|---|
| **TC ID** | AP2377_001 |
| **Title** | The vehicle form ends with a "Current manufacturer/extended warranty" section of three fields and a "Continue" button |
| **Requirement** | AP2377 — REQ-001, AC 1 ("The following fields are added at the end of the form" + attachment A1; "The ‘continue’ button label is ‘Continue’") |
| **Route** | `/customer/avantage-plus/buy` — Vehicle step |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — all 4 steps passed on Dev (v2dev) |

**Why this matters:** These fields tell the company that the vehicle is still under another
warranty, which the help text says decides when the new warranty begins. If they are
missing, a customer whose vehicle is still covered may buy a warranty that overlaps the
cover they already have.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `5YJ3E1EA0LF734293` (2020 TESLA Model 3 Plus) |
| Mileage | `10000` |
| Market Value | `45000.00` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `https://v2staging.garantieavantageplus.ca/customer/avantage-plus/buy`; if the page is in French, click "English" at the top right | The purchase page loads in English on its first (vehicle) step, with no error page. Record the URL and the page title. |
| 2 | Fill the vehicle fields: VIN `5YJ3E1EA0LF734293` (or Year `2020`, Make `TESLA`, Model `Model 3 Plus` where the form asks for those instead), Mileage `10000`, "Market Value" `45000.00`. Record the label of every field above "Market Value*" | Each field shows the value typed. |
| 3 | Scroll to the bottom of the form | Below "Market Value*" the form shows, in this order: the heading "Current manufacturer/extended warranty", the help text "If your vehicle is still under manufacturer, or extended warranty coverage please include the contract number." and "This warranty will begin after the current warranty has expired, or if the current warranty has already expired, this warranty will begin thirty (30) days from the date of purchase.", then the fields "Warranty Number", "Warranty end date", "Warranty mileage limit". |
| 4 | [Verification] Verify the three fields are the last inputs on the form, and read the label of the button that submits the form | No input follows "Warranty mileage limit"; the submit button reads exactly "Continue". |

---

### AP2377_002 — In French, the vehicle step's button reads "Continuer" and the Client Info button reads "Demander un devis"

| Field | Value |
|---|---|
| **TC ID** | AP2377_002 |
| **Title** | In French, the vehicle step's button reads "Continuer" and the Client Info button reads "Demander un devis" |
| **Requirement** | AP2377 — REQ-001 AC 1 ("french: ‘Continuer’"), REQ-003 AC 3 ("French: ‘Demander un devis’"); French labels of the new fields and checkbox are record-only (Q-002, Q-005 — Judgement, Open) |
| **Route** | `/customer/avantage-plus/buy` — Vehicle step, then Client Info step, in French |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — "Continuer" and "Demander un devis" exact; Q-002 / Q-005 wording recorded |

**Why this matters:** Many of the portal's customers buy in French. The ticket gives the two
French button labels, so they are checked exactly; it does not give the French wording of
the new fields or of the consent checkbox, so those are only recorded for the author to
confirm.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `5YJ3E1EA0LF734293` |
| Mileage | `10000` |
| Market Value | `45000.00` |
| Client | Prénom `Client`, Nom `Stage NNN`, Adresse `2280 de la Rousserolle`, Ville `Laval`, Province `Québec`, Code postal `H7L0C4`, Téléphone 1 `5146906330`, Courriel `client.stage.NNN@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy`; if the page is in English, click "Français" (or the language link at the top right) | The page shows French text, e.g. the title "Acheter une garantie en-ligne". |
| 2 | Fill the vehicle fields with the Test Data, scroll to the end of the form, and read the labels of the current-warranty section and the submit button | The submit button reads exactly "Continuer". Record the French heading, help text and three field labels for Q-002; it fails only if a label is missing (an empty label beside an input) or the page errors. |
| 3 | Click "Continuer" | The Client Info step opens in French, with no error page or HTTP 5xx. |
| 4 | Fill the client fields with the Test Data and read the consent checkbox text and the submit button | Record the French checkbox text for Q-005. |
| 5 | [Verification] Verify the submit button label on the Client Info step | The button reads exactly "Demander un devis". |

---

### AP2377_003 — Submitting the vehicle form opens the Client Info step, now placed before Coverage in the step bar

| Field | Value |
|---|---|
| **TC ID** | AP2377_003 |
| **Title** | Submitting the vehicle form opens the Client Info step, now placed before Coverage in the step bar |
| **Requirement** | AP2377 — REQ-002, AC 2 ("The user is redirected to the ‘Client Info' step (switch order with 'coverage’ step)"); old order from attachment A3 |
| **Route** | `/customer/avantage-plus/buy` — Vehicle step → Client Info step (French, to compare the step bar with A3's labels) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — Client Info opens after the vehicle step; step bar Info du véhicule · Info Client · Choisir la couverture · Sommaire |

**Why this matters:** This is the main change of the ticket. If the vehicle form still leads
to Coverage, customers see prices before giving the details the new order was introduced to
collect first.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `5YJ3E1EA0LF734293` |
| Mileage | `10000` |
| Market Value | `45000.00` |
| Warranty Number | `2131331` |
| Warranty end date | `2027-12-18` |
| Warranty mileage limit | `100000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in French (click "Français" if needed) and read the step bar | The step bar is visible. Record its labels left to right. |
| 2 | Fill the vehicle fields with the Test Data, including "Warranty Number" `2131331`, "Warranty end date" `2027-12-18` and "Warranty mileage limit" `100000` | Each field shows the value typed. |
| 3 | Click "Continuer" | A new step loads with no error page or HTTP 5xx. Record its URL. |
| 4 | [Verification] Verify which step is now shown and the order of the step bar | The page is the client information form (fields for city, province, postal code, phones and email, as in A2), not the coverage choice; the step bar shows the client step immediately after the vehicle step and before the coverage step — the swap of the old order "Info du véhicule · Choisir la couverture · Info Client · Sommaire" (A3). Only the order of the steps is judged: a step-bar label that differs from A3's wording is recorded, not failed. |

---

### AP2377_004 — Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data

| Field | Value |
|---|---|
| **TC ID** | AP2377_004 |
| **Title** | Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data |
| **Requirement** | AP2377 — REQ-001 AC 1; validation is record-only (Q-001 — Judgement, Open) |
| **Route** | `/customer/avantage-plus/buy` — Vehicle step |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | FAIL — step 4: text "abc" in Warranty mileage limit gives an HTTP 500 error page (reproduced 2/2) |

**Why this matters:** Most customers have no current warranty number at hand. If the form
crashes or wipes what they typed when these fields are empty or odd, they abandon the
purchase. Whether the fields are required is not stated, so the case records what happens
and fails only on a fault nobody could want.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| VIN | `5YJ3E1EA0LF734293` | |
| Mileage | `10000` | |
| Market Value | `45000.00` | |
| Warranty end date (past) | `2020-01-01` | A date already over |
| Warranty mileage limit (text) | `abc` | Not a number |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in English and fill VIN `5YJ3E1EA0LF734293` (or Year / Make / Model), Mileage `10000`, "Market Value" `45000.00`; leave "Warranty Number", "Warranty end date" and "Warranty mileage limit" empty | The three new fields are empty; the other fields show the values typed. |
| 2 | Click "Continue" | No error page or HTTP 5xx; the values already typed are still shown if the page stays. Record the outcome for Q-001: whether the form moves on, or which message appears under which field. |
| 3 | If the form moved on, click "Back" to the vehicle step. Type "Warranty end date" `2020-01-01` and "Warranty mileage limit" `abc` | Record what each field shows after typing (for example, whether `abc` can be typed at all). |
| 4 | Click "Continue" | No error page or HTTP 5xx. Record the outcome for Q-001: accepted, or the message shown. |
| 5 | [Verification] Verify no value the customer typed was lost or changed | VIN (or Year / Make / Model), Mileage `10000` and "Market Value" `45000.00` still hold what was typed on the vehicle step (open it with "Back" if the form moved on). |

---

### AP2377_005 — The Client Info step shows the FORM L25 consent checkbox, unticked, and a "Get rates now" button

| Field | Value |
|---|---|
| **TC ID** | AP2377_005 |
| **Title** | The Client Info step shows the FORM L25 consent checkbox, unticked, and a "Get rates now" button |
| **Requirement** | AP2377 — REQ-003, AC 3 ("The client info page contains the checkbox to opt for FORM L25" + attachment A2; "The continue button label is ‘Get rates now’") |
| **Route** | `/customer/avantage-plus/buy` — Client Info step |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) — see `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md` |
| **Result** | PASS — one unticked FORM-L25 checkbox with the A2 text; button "Get rates now" |

**Why this matters:** The checkbox records the customer's confirmation that they read FORM
L25 under the private-sector personal-information Act. Without it, the company collects the
customer's personal details without the confirmation the business asked for.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `5YJ3E1EA0LF734293` |
| Mileage | `10000` |
| Market Value | `45000.00` |
| Expected checkbox text (A2) | `I confirm that I have read FORM-L25, at the request of Les Produits Avantage Plus Inc., all in accordance with the requirements of the Act respecting the protection of personal information in the private sector.*` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/customer/avantage-plus/buy` in English, fill VIN `5YJ3E1EA0LF734293` (or Year / Make / Model), Mileage `10000`, "Market Value" `45000.00`, leave the three warranty fields empty, and click "Continue" | The Client Info step opens. (If the empty warranty fields stop the form, fill Warranty Number `2131331`, end date `2027-12-18`, mileage limit `100000` and click "Continue" again.) |
| 2 | Scroll to the bottom of the Client Info form | Below the "Email*" field there is one checkbox, unticked by default. (The default state is taken only from mock-up A2, which shows the box unticked; no sentence in the ticket states it — the words "opt for" support it.) |
| 3 | Read the checkbox text, then click the word "FORM-L25" if it is a link | The checkbox text reads exactly as in the Test Data. Record the outcome for Q-005: whether "FORM-L25" is a link and what it opens; an error page or HTTP 5xx from the link is an objective fault. Return to the Client Info step afterwards. |
| 4 | [Verification] Verify the label of the button that submits the Client Info form | The button reads exactly "Get rates now" (not "Continue"). |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC 1 — new fields, "Continue" / "Continuer" | AP2377_001 · AP2377_002 (UI, FR) | AP2377_004 | AP2377_004 | AP2377_004 (values kept) |
| REQ-002 AC 2 — Client Info after Vehicle | AP2377_003 | — | — | AP2377_003 (step bar) |
| REQ-003 AC 3 — FORM L25 checkbox, "Get rates now" / "Demander un devis" | AP2377_005 · AP2377_002 (UI, FR) | AP2377_007 (file 2) | — | — |
| REQ-004 AC 4 — "Get rates now" opens Coverage | AP2377_006 (file 2) | — | — | — |
| REQ-005 AC 5 — summary lists YES surcharges | AP2377_008 (file 2) | — | AP2377_009 (file 2) | — |
| REQ-006 AC 6 — admin warranty page shows surcharges | AP2377_010 (file 2, BLOCKED) | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2377_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_001-step4-WarrantyFieldsContinueButton_pass.png` |
| AP2377_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_002-step5-DemanderUnDevisButton_pass.png` |
| AP2377_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_003-step4-ClientInfoBeforeCoverage_pass.png` |
| AP2377_004 | ❌ FAIL | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step4-Http500PastDateTextMileage_fail.png` |
| AP2377_005 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_005-step4-FormL25CheckboxGetRatesNow_pass.png` |

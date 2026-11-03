# Test Cases — AP1948 (File 1 of 2)

**Project:** Avantage Plus v2 — Client portal
**Requirement:** AP1948 — CBI / CVE Tesla Price modification (Jira AP-1948)
**Source:** requirements/AP-1948-cbi-cve-tesla-price-modification.md · qa-artifacts/1-requirements-analysis/AP-1948_requirements-analysis.md · qa-artifacts/2-test-plan/AP-1948_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP1948_001 to AP1948_005 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · Regression
**Revision 2026-11-01:** AP1948_003 reworked per review R2 (independent) F-1/F-2. It now fails only on an error page or HTTP 5xx, or on a term or price shown back that differs from the one selected; whether they are shown back at all is record-only for Q-006. Form data uses the `test-data` dynamic patterns. Vehicle-entry fallback added to the Execution Context (F-4).

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Client portal (no login) for the price shown to the customer; Admin portal only to read a program term's configured price | `navigation` §1 |
| **Entry route** | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` — customer 1493's quote-request page. The page's fields and the warranty-term selector are **not mapped** in any knowledge source (`navigation-map.md` §4 "Client portal — no flow mapped at all"); the executor records the real labels and writes them back per `qa-docs/_mapping-guide.md` | `env`, `navigation` |
| **Viewport** | 1280 × 800 | `navigation` §1 (admin/dealer value; the Client portal row gives none) |
| **Environment** | Staging (v2staging) — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Client portal: none. Admin portal: `/admin/login` with the shared admin account from `env` (`execute.env.md` → Portals → Admin Portal). The admin login page renders in French ("Courriel", "Mot de passe", "Se connecter") | `env`, `navigation` §1 |
| **Test data** | Customer 1493 (the only known Client portal link). No vehicle, program or program term is recorded in `test-data`; the vehicle is entered by each case in a `[Pre-Condition]` step. Any form field a case fills: email → a fresh `client.stage.NNN@yopmail.com` (next unused `NNN`); client name → `Marie Tremblay`; any other required field → a value the executor records in the log | `env`, `test-data` (`test-centralized.md` → Dynamic Test Data) |
| **Language** | EN as the page renders by default; not stated otherwise. The admin login page is always French | `navigation` |
| **Leaves behind** | Each case that enters a vehicle on customer 1493's quote-request page may leave that vehicle / an unsubmitted request on the customer record; AP1948_003 leaves one submitted quote request carrying a `client.stage.NNN@yopmail.com` address. Not known whether either can be deleted — `cleanup` is `missing` | `cleanup` (missing) |

**Standing facts only.** The vehicle each case enters is dynamic and is created in that case's `[Pre-Condition]` step. Program-term prices are **read** in the admin area, never changed by this batch.

**Navigation gap (not a blocker):** the admin screen that holds a program term's
*suggested retail price* is not mapped (`admin-portal.md`: 39 of 49 sidebar routes
unexplored). Ken Nguyen's comment of 2024-04-03 says only "You can add program terms in
the admin area". The executor finds it from the admin sidebar and records the route in
the execution log. If it cannot be found, the affected step is BLOCKED, not FAIL.

**Vehicle entry gap (not a blocker):** every Client portal step assumes the unmapped
quote-request page lets the customer enter make, model and year. If the page takes the
vehicle another way (for example a VIN, or a vehicle already loaded), the executor records
how, marks that step and the rest of the case BLOCKED ("vehicle entry differs from design"),
not FAIL, and maps the page per `qa-docs/_mapping-guide.md`.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Which vehicle models belong to Category A, B and C, and where a model's and a term's category are set | AP1948_004, AP1948_005 (and AP1948_006 in file 2) | Open — Q-001 (Blocking), asked on AP-1948 comment 19432, 2026-11-01 |
| 2 | Whether the "Original ask" Tesla figures still apply, and which term each figure belongs to | AP1948_007, AP1948_008 (file 2) | Open — Q-002 (Blocking), asked on AP-1948 comment 19432, 2026-11-01 |

> Every test case named in **Affects** ships with **Status: BLOCKED** and a **Blocked by**
> value — not `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP1948_001 | Customer selects a warranty term → price shown equals that term's suggested retail price in admin | Functional | High | PASS |
| AP1948_002 | Customer switches to another warranty term → price shown changes to the new term's suggested retail price | Edge-case | Medium | PASS |
| AP1948_003 | Customer submits the quote request → no error, and any term or price shown back matches the one selected | Regression | Medium | BLOCKED |
| AP1948_004 | Tesla vehicle on the customer portal → only program terms of that model's category are offered | Functional | High | BLOCKED |
| AP1948_005 | A program term set for a different vehicle category → it is not offered for this vehicle | Negative | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP1948_001 — Customer selects a warranty term → price shown equals that term's suggested retail price in admin

| Field | Value |
|---|---|
| **TC ID** | AP1948_001 |
| **Title** | Customer selects a warranty term → price shown equals that term's suggested retail price in admin |
| **Requirement** | AP1948 — REQ-002: "The price should be the pricing set in the program term > **suggested retail price**" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` (re-run 15:39Z–15:45Z after review R3 F-1, vehicle 2022 TESLA Model 3 / Long Range) |
| **Result** | ✅ PASS — Summary Subtotal CA$1,025.00 equals admin term 16 suggested retail price 1025 |

**Why this matters:** this is the price the end customer sees. If it does not come from the term's configured suggested retail price, the customer is quoted a figure the business never set. The display format (currency sign, decimals, taxes) is not stated in the ticket (Q-005), so only the amount is compared; the format is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle entered | Make "Tesla", Model "Model 3", Year 2023 |
| Admin login | Admin Portal account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model 3", Year 2023, in the vehicle fields as labelled on the page (record the labels); continue until the warranty term choice is shown | The quote-request page loads without an error page, and a warranty term selector listing at least one term is shown for the Tesla Model 3 |
| 2 | Select the first warranty term listed and note its program name, term label and the price shown | The page shows one price for the selected term; record the term label and the price exactly as displayed |
| 3 | [Pre-Condition] In a new tab, log in at `/admin/login` with the admin account and open the program term with the same program name and term label (record the admin route used) | The admin program-term screen shows the term's "suggested retail price" field with a value; record that value |
| 4 | [Verification] Compare the amount shown on the Client portal in step 2 with the "suggested retail price" read in step 3 | The two amounts are equal. Record the Client portal's display format for Q-005 without judging it |

---

### AP1948_002 — Customer switches to another warranty term → price shown changes to the new term's suggested retail price

| Field | Value |
|---|---|
| **TC ID** | AP1948_002 |
| **Title** | Customer switches to another warranty term → price shown changes to the new term's suggested retail price |
| **Requirement** | AP1948 — REQ-002: "The price should be the pricing set in the program term > **suggested retail price**" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` |
| **Result** | ✅ PASS — Summary subtotals CA$1,025.00 / CA$2,700.00 equal admin suggested retail prices 1025 / 2700 |

**Why this matters:** a price that stays on the first term after the customer picks another would quote the wrong amount. Whether the price refreshes without a page reload is not stated (Q-006), so only the final price is judged; how it refreshes is recorded.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle entered | Make "Tesla", Model "Model Y", Year 2023 |
| Admin login | Admin Portal account from `env` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model Y", Year 2023; continue until the warranty term choice is shown | The warranty term selector lists at least two terms. If only one term is listed, record it and mark the case BLOCKED ("only one term offered") |
| 2 | Select the first term listed, note its label and price; then select the second term listed and note its label and price | Each selection shows one price; record both labels and both prices as displayed, and whether the page reloaded |
| 3 | [Pre-Condition] In the admin area (log in at `/admin/login` with the admin account), open both program terms and read their "suggested retail price" values | Both values are recorded |
| 4 | [Verification] Compare each price shown on the Client portal with the matching term's "suggested retail price" | After the second selection the price shown equals the second term's suggested retail price, not the first term's. Record how the price refreshed for Q-006 |

---

### AP1948_003 — Customer submits the quote request → no error, and any term or price shown back matches the one selected

| Field | Value |
|---|---|
| **TC ID** | AP1948_003 |
| **Title** | Customer submits the quote request → no error, and any term or price shown back matches the one selected |
| **Requirement** | AP1948 — REQ-002 (price of the selected term); what happens after submission is record-only — Q-006 (Judgement) |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Submission requires payment — "Continue with payment" opens a Stripe sandbox checkout and `test-data` has no payment data (Dev, 2026-11-01 re-run) |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` (re-run 15:39Z–15:45Z after review R3 F-1, vehicle 2022 TESLA Model 3 / Long Range) |
| **Result** | 🚫 BLOCKED — steps 1–2 PASS (Summary shows term AT 36m/60000km and Subtotal CA$1,025.00 as selected); steps 3–4 BLOCKED at the Stripe payment page |

**Why this matters:** the ticket does not say whether the selected term's price must be carried into the submitted request (Q-006, Judgement). This case therefore fails only on objective faults — an error page or HTTP 5xx, or a term or price that *is* shown back but differs from what the customer selected. Whether the term and price are shown back at all is recorded for Q-006, never judged: a request that does not show them back is not a FAIL.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle entered | Make "Tesla", Model "Model 3", Year 2023 |
| Email field (if shown) | A fresh `client.stage.NNN@yopmail.com` — `NNN` is the next unused three-digit number (`test-centralized.md` → Dynamic Test Data) |
| Client name field(s) (if shown) | `Marie Tremblay` (first name "Marie", last name "Tremblay" if split) |
| Any other required field | A value the executor chooses and records in the execution log, field label and value |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model 3", Year 2023; continue until the warranty term choice is shown | The warranty term selector lists at least one term |
| 2 | Select the first term listed and note its label and price. Fill the page's required fields from Test Data: email → the fresh `client.stage.NNN@yopmail.com`, name → `Marie Tremblay`, any other required field → a value recorded in the log with its label | The selected term and its price stay shown on the page; every field filled is recorded with its label and value |
| 3 | Click the page's submit button (record its exact label) | No error page or HTTP 5xx appears; record the confirmation the page shows |
| 4 | [Verification] Check every place the submitted request is shown back (confirmation page, and the customer's quote if one is visible). For each, record whether the term and the price appear, and if they do, their values | **FAIL only if** a term or price that appears differs from the one selected in step 2. A term or price that does not appear is **not** a failure — record "term shown: yes/no, price shown: yes/no" for Q-006 without judging it |

---

### AP1948_004 — Tesla vehicle on the customer portal → only program terms of that model's category are offered

| Field | Value |
|---|---|
| **TC ID** | AP1948_004 |
| **Title** | Tesla vehicle on the customer portal → only program terms of that model's category are offered |
| **Requirement** | AP1948 — REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): which models are in Category A, B, C and where a term's category is set |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` |
| **Result** | 🚫 BLOCKED — Q-001 still unanswered (AP-1948 comment 19432) |

**Why this matters:** offering a term from the wrong category quotes the customer coverage that does not apply to their vehicle. The steps are written so the case runs as soon as Q-001 is answered.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle entered | Make "Tesla", Model "Model 3", Year 2023 |
| Category of Tesla Model 3 | Not known — Q-001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, list every program term with its category (screen: Not known — Q-001) and record which terms belong to the Tesla Model 3's category | Not known — Q-001 |
| 2 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model 3", Year 2023; continue until the warranty term choice is shown | The warranty term selector is shown |
| 3 | Open the warranty term selector and record every term listed | Every listed term is recorded with its program name and label |
| 4 | [Verification] Compare the listed terms with the terms recorded in step 1 | Not known — Q-001. Once answered: the list holds exactly the terms of the Tesla Model 3's category |

---

### AP1948_005 — A program term set for a different vehicle category → it is not offered for this vehicle

| Field | Value |
|---|---|
| **TC ID** | AP1948_005 |
| **Title** | A program term set for a different vehicle category → it is not offered for this vehicle |
| **Requirement** | AP1948 — REQ-001: "The program terms are filtered by vehicle model Category (Category A,B or C)" |
| **Route** | `/customer/1493/quote-request` — Client portal quote request |
| **Type** | Negative |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): which models are in Category A, B, C and where a term's category is set |
| **Executed on** | 2026-11-01 — Dev (v2dev) — `qa-artifacts/4-execution-results/1.39.0/execution-log_AP-1948_2026-11-01.md` |
| **Result** | 🚫 BLOCKED — Q-001 still unanswered (AP-1948 comment 19432) |

**Why this matters:** a filter that only adds the right terms but does not hide the wrong ones still lets the customer pick a term priced for another category.

**Test Data:**

| Variable | Value |
|---|---|
| Client portal link | `https://v2staging.garantieavantageplus.ca/customer/1493/quote-request` |
| Vehicle entered | Make "Tesla", Model "Model S", Year 2023 |
| A category different from the Model S's | Not known — Q-001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, find one program term whose category differs from the Tesla Model S's category and record its program name and label (screen: Not known — Q-001) | Not known — Q-001 |
| 2 | [Pre-Condition] Open the Client portal link and enter the vehicle: Make "Tesla", Model "Model S", Year 2023; continue until the warranty term choice is shown | The warranty term selector is shown |
| 3 | Open the warranty term selector and record every term listed | Every listed term is recorded |
| 4 | [Verification] Look for the term recorded in step 1 in the list from step 3 | Not known — Q-001. Once answered: that term is absent from the list |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — terms filtered by vehicle model Category | AP1948_004 (BLOCKED) | AP1948_005 (BLOCKED) | AP1948_006 (file 2, BLOCKED) | — |
| REQ-002 — price = term's suggested retail price | AP1948_001, AP1948_009 (file 2) | — | AP1948_002 | AP1948_003 |
| REQ-003 — Tesla figures of the Original ask | AP1948_007, AP1948_008 (file 2, BLOCKED) | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP1948_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_001-step4-AdminTerm16Equals1025_pass.png` |
| AP1948_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_002-step4-SecondTermPriceEqualsAdmin_pass.png` |
| AP1948_003 | 🚫 BLOCKED | `qa-artifacts/4-execution-results/screenshots/1.39.0/AP-1948/AP1948_003-step3-StripeCheckoutPaymentPage_blocked.png` |
| AP1948_004 | 🚫 BLOCKED | — |
| AP1948_005 | 🚫 BLOCKED | — |

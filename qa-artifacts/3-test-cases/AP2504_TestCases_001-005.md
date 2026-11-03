# Test Cases — AP2504 (File 1 of 3)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2504 — Generate contract for a quote's GAP/Creditor Insurance product
**Source:** requirements/AP-2504-generate-contract-for-a-quotes-gap.md · qa-artifacts/1-requirements-analysis/AP-2504_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2504_test-plan.md
**Date:** 2026-11-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2504_001 to AP2504_005 (5 test cases)
**Coverage:** Functional · UI · Regression · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` — never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500 → `/quote/{id}/details`, the quote page. Pages under test: `/quote/{id}/insurance/create-contract/gap` (GAP) and `/quote/{id}/insurance/create-contract` (creditor) | `navigation` → `domain` (quote-creation.md) |
| **Generate Contract action** | On `/quote/{id}/details` the right-hand card "Summary of products" lists Extended warranty · Roadside Protection · **Gap Insurance** · **Creditors insurance** · Esthetic protection. A saved product without a contract has a chevron and a **"⋯"** dropdown: **Edit · Generate Contract · Delete**. Generate Contract routes on Dev (2026-11-02): GAP `/quote/{id}/insurance/create-contract/gap`, creditor `/quote/{id}/insurance/create-contract`. A product with a contract has no "⋯" — only the contract number and a PDF link | `domain` (quote-creation.md, Dev AP-2493 section) |
| **Viewport** | 1280 × 800 | `navigation` / registry `admin_viewport` |
| **Environment** | **Dev** (v2dev) — dealer portal URL from the `env` source's "Dev Environment" section. Write "Environment: Dev" in the execution log header | `env`, registry `execution_env` |
| **Login** | The shared dealer account (dealer 1380) named in the `env` source's Dev section; the password is read there at run time and never written into the log | `env` |
| **Test data** | Vehicle **915** on Dev — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km — only as the source of each new quote (never edited). Every client, quote, financing, GAP / creditor quote and contract is created by the case itself. Quotes and contracts of other tickets (6276, 6533–6544, 6557–6561 and any not created in this run) are never used | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English | `domain` (quote-creation.md) |
| **Leaves behind** | One client and one quote per built quote, each with a financing and a GAP quote (Chubb quote service call). No case in this file submits the page, so no contract is created here. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — client and quote.** Open `/vehicle/915/details?_locale=en`, click
**Create quote**, then: First name `Contract`, Last name as given in the case, Email
`client.stage.2504NNN@yopmail.com` (`NNN` = the case number, e.g. `2504001`), Address
`200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone
`5145550201`, Work phone `5145550202`, "I agree to the policy" ticked → **Save**. The quote
page `/quote/{id}/details` opens with vehicle 915 already attached (price 10,000 and today's
delivery date on Dev — `domain`); record the quote id.

**Shared build values — financing.** Open `/quote/{id}/financing` (the old financing page,
still working on Dev — it avoids the GAP / creditors add modal and its open bugs): Date of
birth `1985-06-15`, Province `Québec`, Type "Financing", Net amount financed `25000`,
Residual `0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`,
Financing company the **first company listed** (record its name) → **Save**. Expected:
flash "Financing saved" and the quote page shows the financing (e.g. "Financing 60 months
… · 25,000.00").

**Shared build values — GAP quote.** Open `/quote/{id}/gap-insurance?_locale=en` **as a
page** (not through the "+" modal): if a "Financing" block is shown first, leave it as it
is; in "Gap Insurance Quote" set Rate table "TGGAP", Language "English", Tax exempt "No",
Gap Term `60` → **Get Quote**. Expected: flash "GAP insurance quote saved successfully" and
the quote page's "Gap Insurance" row shows a premium and a "⋯" menu. Record the premium.

**Known defects on the setup path** (filed for AP-2499, all open): **AP-2526** — once a
financing exists, the GAP / creditors add modal folds the financing form behind "Edit";
**AP-2527** — Save in the creditors modal draws the quote page inside the modal;
**AP-2528** — "Get Quote" in the add modal reloads the quote page and closes the modal. The
setup above opens the routes as pages to stay clear of them. If a setup step is still
stopped by one of these defects (the GAP quote cannot be saved), mark the case
**BLOCKED** naming the bug — never FAIL. A login failure, timeout or HTTP 5xx before the
step under test is also BLOCKED (environment), after one retry.

**Known blockers**

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Which row's "Generate Contract" acceptance criterion 1 means — it names "the Extended Warranty row actions" for the GAP page | AP2504_002 | Open — Q-001 (Blocking), asked on AP-2504 2026-11-03 (comment 19460) |

> AP2504_002 ships with **Status: BLOCKED**. The other four are `Not Run`. The way to add
> a co-applicant (AP2504_004) is not mapped (Q-012, Info); the executor looks for it and
> records BLOCKED "test data not on Dev: no co-applicant control" if none exists.
> **Write-back owed after s4:** the GAP generate-contract page (sections, fields, post-submit
> screens) and the co-applicant control go to the `domain` source (`quote-creation.md`) as a
> dated Dev entry.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2504_001 | Clicking "Generate Contract" on the GAP insurance row opens the GAP contract page in the same tab, not a pop-up | Functional | High | PASS |
| AP2504_002 | "Generate Contract" chosen from the Extended Warranty row opens the GAP contract page (criterion 1 as written) | Functional | High | BLOCKED |
| AP2504_003 | The GAP contract page shows vehicle, owner and financing on the left and Program Summary with the button on the right | UI | Medium | PASS |
| AP2504_004 | With a co-applicant on the quote, the GAP contract page adds a pre-filled "Co-owner information" section on the left | Edge-case | High | PASS |
| AP2504_005 | The GAP contract page is pre-filled with the quote's vehicle and owner values | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2504_001 — Clicking "Generate Contract" on the GAP insurance row opens the GAP contract page in the same tab, not a pop-up

| Field | Value |
|---|---|
| **TC ID** | AP2504_001 |
| **Title** | Clicking "Generate Contract" on the GAP insurance row opens the GAP contract page in the same tab, not a pop-up |
| **Requirement** | AP2504 — REQ-001: description "The “Generate Contract” action for GAP product on the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" and "The route `/quote/{quoteId}/insurance/create-contract/{type}` … stays the same"; AC 1 *then* clause "`/quote/{quoteId}/insurance/create-contract/gap` opens in the same tab with no modal" |
| **Route** | `/quote/{id}/details` → Gap Insurance "⋯" → "Generate Contract" → `/quote/{id}/insurance/create-contract/gap` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** This is the whole point of the story: the action must leave the quote
page for a full page of its own. The case starts from the GAP insurance row, which the
description names; acceptance criterion 1's "Extended Warranty row" wording is tested
separately in AP2504_002 once Q-001 is answered. The quote built here (quote A) is reused,
unsubmitted, by AP2504_003, _005 and _006.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2504-001` |
| Client email | `client.stage.2504001@yopmail.com` |
| Financing | Shared financing values (25000 / 0 / Monthly / 60 / 6.99 / first company) |
| GAP quote | TGGAP, English, Tax exempt No, Gap Term `60` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`) and build quote A from vehicle 915 with the shared client values (last name `Owner2504-001`), then the shared financing on `/quote/{id}/financing` | `/quote/{id}/details` shows heading `#{id} - Contract Owner2504-001 …` and the financing; the quote id (quote A) and the financing company are recorded |
| 2 | [Pre-Condition] Open `/quote/{id}/gap-insurance?_locale=en` as a page and save the shared GAP quote (TGGAP, English, No, Gap Term `60`) → **Get Quote** | Flash "GAP insurance quote saved successfully"; the "Gap Insurance" row on the quote page shows a premium and a "⋯" menu, and no contract number. If the GAP quote cannot be saved because of AP-2526/AP-2527/AP-2528, the case is BLOCKED naming that bug |
| 3 | Note the number of open browser tabs. On the quote page open the **Gap Insurance** row's "⋯" menu and click **"Generate Contract"** | The browser navigates in the **same tab** (the tab count is unchanged) to `/quote/{id}/insurance/create-contract/gap`; the page loads without an error page or HTTP 5xx |
| 4 | Open the quote page `/quote/{id}/details` again, then type `/quote/{id}/insurance/create-contract/gap` (quote A's id) into the address bar and press Enter | The same GAP contract page loads directly from the address, without an error page or HTTP 5xx |
| 5 | [Verification] Inspect the page reached in step 3 and step 4 | The address is exactly `/quote/{id}/insurance/create-contract/gap` with quote A's id; the page is a full page — no modal dialog is open and the "Summary of products" card of the quote page is not visible behind it; a "Generate Contract" button is on the page. Record the page heading and any visible difference from the Esthetic protection contract page (Q-002) |

---

### AP2504_002 — "Generate Contract" chosen from the Extended Warranty row opens the GAP contract page (criterion 1 as written)

| Field | Value |
|---|---|
| **TC ID** | AP2504_002 |
| **Title** | "Generate Contract" chosen from the Extended Warranty row opens the GAP contract page (criterion 1 as written) |
| **Requirement** | AP2504 — REQ-001: AC 1 "Given a quote with a GAP insurance quote and no contract, when the dealer chooses “Generate Contract” from the Extended Warranty row actions, then `/quote/{quoteId}/insurance/create-contract/gap` opens in the same tab with no modal." |
| **Route** | `/quote/{id}/details` → Extended warranty "⋯" → "Generate Contract" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): acceptance criterion 1 names the Extended Warranty row for the GAP page, while the description names the GAP action; on Dev the Extended warranty row's "Generate Contract" leads to `/quote/{id}/warranty/generate-contract` (`domain`, AP-2503 section) |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** The criterion as written cannot be judged: it starts from the Extended
Warranty row but expects the GAP page. The steps are written so the case runs as soon as
the author answers Q-001; until then it stays BLOCKED and the story cannot move to Ready
for release.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2504-002` |
| Client email | `client.stage.2504002@yopmail.com` |
| Extended warranty | Vehicle 915's only Dev program "Automation Test Program", term 20m/20000km, Sale price `1500` |
| Financing / GAP quote | Shared values |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`), build a quote from vehicle 915 with the shared client values (last name `Owner2504-002`) and the shared financing on `/quote/{id}/financing` | The quote page shows the financing; the quote id is recorded |
| 2 | [Pre-Condition] Add an extended warranty with the "+" on the "Extended warranty" row: program "Automation Test Program", term 20m/20000km, Sale price `1500` → **Save**; then save the shared GAP quote on `/quote/{id}/gap-insurance` (TGGAP, English, No, Gap Term `60`) → **Get Quote** | The "Extended warranty" and "Gap Insurance" rows each show an amount and a "⋯" menu; no contract number on either |
| 3 | Note the number of open tabs. Open the **Extended warranty** row's "⋯" menu and click **"Generate Contract"** | Not known — Q-001. Record the address reached, whether it opened in the same tab and whether a modal appeared |
| 4 | [Verification] Inspect the page reached | Not known — Q-001. Record whether the address is `/quote/{id}/insurance/create-contract/gap` or `/quote/{id}/warranty/generate-contract`; an error page or HTTP 5xx is a FAIL under any answer |

---

### AP2504_003 — The GAP contract page shows vehicle, owner and financing on the left and Program Summary with the button on the right

| Field | Value |
|---|---|
| **TC ID** | AP2504_003 |
| **Title** | The GAP contract page shows vehicle, owner and financing on the left and Program Summary with the button on the right |
| **Requirement** | AP2504 — REQ-002: AC 2 "it shows the “Vehicle identification”, “Owner information”, “Co-owner information” (if has co-applicant), “Financing information” in a left column, and “Program Summary” with a “Generate Contract” button in a right column"; description "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right" |
| **Route** | `/quote/{id}/insurance/create-contract/gap` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** The layout is what the dealer sees. This quote has no co-applicant, so
the case judges the three left-hand sections and the two right-hand elements the criterion
names. Three points are open and only recorded: whether "Co-owner information" is absent or
shown empty without a co-applicant (Q-004), which lines the Program Summary shows (Q-003),
and anything else that should "match Esthetic Protection" (Q-002).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2504_001, if its Gap Insurance row still offers "Generate Contract"; otherwise build one (last name `Owner2504-003`, email `client.stage.2504003@yopmail.com`, shared financing and GAP quote) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote A from AP2504_001 if its Gap Insurance row still shows a "⋯" menu with "Generate Contract"; otherwise build a quote from vehicle 915 with the shared client values (last name `Owner2504-003`), the shared financing and the shared GAP quote | A quote with a financing and a GAP quote, no GAP contract and no co-applicant exists; its id is recorded |
| 2 | Open `/quote/{id}/insurance/create-contract/gap` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the left-hand part of the card at 1280 × 800 | Sections headed "Vehicle identification", "Owner information" and "Financing information" are all in the left column. Record whether a "Co-owner information" section appears and, if so, what it holds (Q-004), and every other section in the left column |
| 4 | [Verification] Inspect the right-hand part of the card | A section headed "Program Summary" and a button labelled "Generate Contract" are in the right column, side by side with the left column rather than below it. Record every line of the Program Summary with its value (Q-003) and any visible difference from the Esthetic protection contract page (Q-002). Leave the page without submitting |

---

### AP2504_004 — With a co-applicant on the quote, the GAP contract page adds a pre-filled "Co-owner information" section on the left

| Field | Value |
|---|---|
| **TC ID** | AP2504_004 |
| **Title** | With a co-applicant on the quote, the GAP contract page adds a pre-filled "Co-owner information" section on the left |
| **Requirement** | AP2504 — REQ-002: AC 2 "“Co-owner information” (if has co-applicant) … in a left column"; REQ-003: AC 3 "Given the quote has … a co-applicant … then … co-owner … values are pre-filled" |
| **Route** | `/quote/{id}/details` (co-applicant section) → `/quote/{id}/insurance/create-contract/gap` |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** The co-owner section is the one part of the page that depends on the
quote's data, and a co-owner's name and date of birth go onto an insurance contract. How a
co-applicant is added is not mapped (Q-012): on Dev the quote page shows a "No applicant"
notice in a co-applicant section once a financing is saved. If no control to add one can be
found, the case is BLOCKED "test data not on Dev: no co-applicant control", not FAIL.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2504-004` |
| Client email | `client.stage.2504004@yopmail.com` |
| Co-applicant | First name `Coowner`, Last name `Coapp2504`, Date of birth `1987-03-20`; every further field the form marks required: Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, phone `5145550203`, email `client.stage.2504104@yopmail.com`, any other its first option (each recorded) |
| Financing / GAP quote | Shared values |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`), build quote B from vehicle 915 with the shared client values (last name `Owner2504-004`) and the shared financing on `/quote/{id}/financing` | The quote page shows the financing and a co-applicant section ("No applicant"); the quote id (quote B) is recorded |
| 2 | [Pre-Condition] In the quote's co-applicant section use its add control (label not mapped — record the label and the address it opens; if the co-applicant is entered on `/quote/{id}/financing` instead, use that) and enter the co-applicant values above → save | The co-applicant section names `Coowner Coapp2504` instead of "No applicant". No add control anywhere → stop: BLOCKED "test data not on Dev: no co-applicant control" (Q-012) |
| 3 | [Pre-Condition] Save the shared GAP quote on `/quote/{id}/gap-insurance` (TGGAP, English, No, Gap Term `60`) → **Get Quote** | Flash "GAP insurance quote saved successfully"; the Gap Insurance row shows a "⋯" menu |
| 4 | Open `/quote/{id}/insurance/create-contract/gap` | The page loads without an error page or HTTP 5xx |
| 5 | [Verification] Inspect the left column | A section headed "Co-owner information" is in the left column, and its fields are pre-filled with the co-applicant entered in step 2 — first name `Coowner`, last name `Coapp2504`, and every other co-owner field shown carries the value entered (date of birth `1987-03-20` in any date format); none is empty or different where a value was entered. Record the list of co-owner fields and whether each is editable (Q-006). Leave the page without submitting |

---

### AP2504_005 — The GAP contract page is pre-filled with the quote's vehicle and owner values

| Field | Value |
|---|---|
| **TC ID** | AP2504_005 |
| **Title** | The GAP contract page is pre-filled with the quote's vehicle and owner values |
| **Requirement** | AP2504 — REQ-003: AC 3 "Given the quote has a vehicle, a client … when the page renders, then vehicle and owner … values are pre-filled" |
| **Route** | `/quote/{id}/insurance/create-contract/gap` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-03 — Dev — execution-log_AP-2504_2026-11-03.md |

**Why this matters:** A wrong VIN or client name would put the insurance contract on the
wrong vehicle or person. The ticket does not list the fields of each section, so the case
judges every field the page shows against vehicle 915's recorded values and the client
values this case entered, and records which fields exist and which can be edited (Q-006).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2504_001 (client `Owner2504-001`, email `client.stage.2504001@yopmail.com`), if its Gap Insurance row still offers "Generate Contract"; otherwise build one (last name `Owner2504-005`, email `client.stage.2504005@yopmail.com`, shared financing and GAP quote) |
| Vehicle 915 | VIN `1FAHP35NX8W239204`, Ford Focus, 2008, 5000 km |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal on Dev (`?_locale=en`). Use quote A from AP2504_001 if its Gap Insurance row still shows "Generate Contract"; otherwise build a quote from vehicle 915 with the shared client values (last name `Owner2504-005`), the shared financing and the shared GAP quote | A quote with a GAP quote and no GAP contract exists; its id and client last name are recorded |
| 2 | Open `/quote/{id}/insurance/create-contract/gap` | The page loads without an error page or HTTP 5xx |
| 3 | [Verification] Read the "Vehicle identification" section | It shows VIN `1FAHP35NX8W239204`, and every other vehicle value shown matches vehicle 915: make Ford, model Focus, year `2008`, mileage `5000` (in any number format). No shown field is empty or different where vehicle 915 holds a value. Record the list of vehicle fields, any value the quote added (delivery date, price) and whether each field is editable (Q-006) |
| 4 | [Verification] Read the "Owner information" section | Owner fields are pre-filled: first name `Contract`, the recorded last name, and every other owner field shown carries the value entered for the client (the recorded email, address `200 Rue Test`, city `Montréal`, province Québec / `QC`, postal code `H2X 1Y4` with or without the space, phones `5145550201` / `5145550202` in any phone format). No shown field is empty or different where the client holds a value. Record the list of owner fields and whether each is editable (Q-006). Leave the page without submitting |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — description: GAP action opens a dedicated page; route unchanged | AP2504_001 | — | AP2504_009 | AP2504_001 |
| REQ-001 — AC 1 as written (Extended Warranty row) | AP2504_002 (BLOCKED, Q-001) | — | — | — |
| REQ-002 — AC 2 layout | AP2504_003 | — | AP2504_004 | — |
| REQ-003 — AC 3 pre-fill (vehicle, owner, co-owner) | AP2504_005 | — | AP2504_004 | — |
| REQ-003 — AC 3 financing pre-filled and read-only | AP2504_006 | AP2504_006 | — | — |
| REQ-004 — AC 4 submit creates the contract | AP2504_007 | AP2504_008 | — | AP2504_007 |
| REQ-005 — Note: creditor page and contract | AP2504_010 | — | — | AP2504_011 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2504_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_001-step5-GapContractFullPage_pass.png` |
| AP2504_002 | 🚫 BLOCKED | — |
| AP2504_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_003-step3-LeftColumnSections_pass.png` |
| AP2504_004 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_004-step5-CoOwnerPrefilled_pass.png` |
| AP2504_005 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_005-step4-OwnerPrefilled_pass.png` |

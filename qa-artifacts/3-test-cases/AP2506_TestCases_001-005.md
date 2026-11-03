# Test Cases — AP2506 (File 1 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2506 — Generate contract for a quote's Esthetic protection product
**Source:** requirements/AP-2506-generate-contract-for-a-quotes-esthetic.md · qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2506_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2506_001 to AP2506_005 (5 test cases)
**Coverage:** Functional · Regression · UI

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** header action → `/quote/new/client?fromVehicleId=915` → `/quote/{id}/details`, the quote page. Never the bare `/quote` or `/quote/new/client`, which leaves a quote with no vehicle that returns HTTP 500. The page under test is `/quote/{id}/permaplate-create-contract` | `navigation` → `domain` (quote-creation.md) |
| **Esthetic protection on a quote** | The quote page links "Permaplate" to `/quote/{id}/permaplate` ("Permaplate Quote": product radios `permaplate_id`, option checkboxes `option_ids[]`, **Save**). In the EN UI the product is labelled "Esthetic protection"; addresses still say `permaplate` | `domain` (quote-creation.md) |
| **Generate Contract action** | Not mapped in `domain`. The description places it "for Esthetic protection on the dealer quote"; AC 1 speaks of a row's actions menu. AP-2459 (2026-09) recorded a "Create Contract" control on `/quote/{id}/details` for the same page. Look on the quote page for the Esthetic protection row (or Permaplate section) and its actions menu; record where the control sits and its label (Q-011). Some quote links are not shown on the quote page (`domain`, chubb-insurance.md §5 records this for the insurance contract link): **where a case says so, fall back to typing `/quote/{id}/permaplate-create-contract`** and record that the fallback was used | `domain` (gap); AP-2459 capture |
| **Viewport** | 1280 × 800 | registry `admin_viewport` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380) in the `env` source, Dealer Portal row. Read the login and password there (or from `/.env`) at run time; never write them into the log | `env` |
| **Test data** | Vehicle **915** — Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km. It is only the starting point of **Create quote**; the cases never edit the vehicle record. **Quote 6276 and every quote of another ticket must not be used or changed** | `test-data` |
| **Language** | EN for every judgement. `?_locale=en` on any dealer URL switches the session to English; switch back to the language found at the start when the run ends | `domain` (quote-creation.md) |
| **Leaves behind** | One client and one quote per built quote: quote A (AP2506_001, reused unsubmitted by _003 – _005). AP2506_002 is BLOCKED and builds nothing until Q-001 is answered. No case in this file submits the page, so no contract or invoice is created here. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared build values — client and quote.** Open `/vehicle/915/details?_locale=en` and
click **Create quote**, then enter: First name `Esthetic`, Last name as given in the case,
Email `client.stage.NNN@yopmail.com` (next unused number, recorded), Address
`200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone
`5145550301`, Work phone `5145550302`, "I agree to the policy" ticked → **Save**. The
browser lands on `/quote/{id}/details`; record the quote id. Then at `/quote/{id}/vehicle`
keep the pre-attached vehicle (VIN `1FAHP35NX8W239204`), Delivered at = **the run date**
(recorded as `RUN_DATE`), Price `25000` → **Save**.

**Shared build values — Esthetic protection.** At `/quote/{id}/permaplate` (the
"Permaplate" / "Esthetic protection" control on the quote page) select the **first product
radio** and tick the **first option that becomes enabled** → **Save**. Record the product
name, the option name and the Cost the quote page then shows. If no product is offered,
record the page text and mark the case **BLOCKED** ("no Esthetic protection product linked
to dealer 1380") — this is dealer configuration, not a fault of AP-2506, and the cases do
not change it.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| Missing fact | Affects | Question | Status set |
|---|---|---|---|
| Which row's "Generate Contract" action AC 1 means — Extended Warranty or Esthetic protection — and whether the quote must carry an extended warranty | AP2506_002 | Q-001 (Blocking — unanswered; posted on AP-2506 on 2026-11-01) | BLOCKED |

> One case ships BLOCKED (AP2506_002). The other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2506_001 | Clicking "Generate Contract" on Esthetic protection opens its own page at the unchanged address, not a pop-up | Functional | High | Not Run |
| AP2506_002 | "Generate Contract" in the Extended Warranty row actions opens the Esthetic protection contract page (acceptance criterion 1 as written) | Functional | High | BLOCKED |
| AP2506_003 | The Esthetic protection contract page shows vehicle and owner on the left, and Program Summary and the button on the right | UI | Medium | Not Run |
| AP2506_004 | The Program Summary shows the term, start and end dates, the protection products chosen on the quote, and a total | Functional | High | Not Run |
| AP2506_005 | The Esthetic protection contract page is pre-filled with the quote's vehicle and client details | Functional | High | Not Run |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Revisions

| Date | TC ID | Change | Why |
|---|---|---|---|
| 2026-11-01 | AP2506_001 | Step 5's comparison with the extended-warranty contract page removed | R2 round 1 (01:56) finding F-2 — no defined comparison |
| 2026-11-01 | AP2506_001 | The full-page check (no modal, quote page not visible behind, "Program Summary" and "Generate Contract" present) moved into step 3, on the page the action opened; step 5 now verifies the page loaded from the typed address is the same full page | Independent R2 round 1 (01:58) finding F-1 — the action's own result was not judged |
| 2026-11-01 | AP2506_004 | Step 3 accepts a products list naming the chosen product and/or option, records which appear, and fails only if the list is missing, empty or names something not chosen; "Why this matters" aligned | Independent R2 finding F-2 — AC 2 does not say whether product or option is listed |
| 2026-11-01 | AP2506_003 | Step 4's "any visible difference from the extended-warranty contract page" replaced by recording the section headings in order and the button label (Q-002), not judged | Independent R2 finding F-3 |
| 2026-11-01 | AP2506_005 | Province accepts `Québec` or `QC`; postal code with or without the space, phones as the same digits in any format, make/model letter case and km separator ignored; the form shown is recorded | Independent R2 finding F-4, extended to the other formatted values |

---

## Test Cases

---

### AP2506_001 — Clicking "Generate Contract" on Esthetic protection opens its own page at the unchanged address, not a pop-up

| Field | Value |
|---|---|
| **TC ID** | AP2506_001 |
| **Title** | Clicking "Generate Contract" on Esthetic protection opens its own page at the unchanged address, not a pop-up |
| **Requirement** | AP2506 — REQ-001: description "The “Generate Contract” action for Esthetic protection on the dealer quote should … open a dedicated page (no modal)" and "The route `/quote/{quoteId}/permaplate-create-contract` … stays the same". AC 1's "in the same tab" is not asserted here: AC 1 ties it to the Extended Warranty row, which is open as Q-001 |
| **Route** | `/quote/{id}/details` → Esthetic protection → "Generate Contract" → `/quote/{id}/permaplate-create-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** This is the whole point of the story: the action must open a full
page, not a pop-up. The case starts from the Esthetic protection action, which the
description names; it does not rely on AC 1's mention of the Extended Warranty row, which
is open as Q-001 (see AP2506_002). For the same reason, whether the page opens in the same tab is recorded, not judged — only AC 1 mentions the tab. The address fallback is **not** allowed in step 3 — the
case exists to prove the action itself. The quote built here (quote A) is reused,
unsubmitted, by AP2506_003 – _005.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-001` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Esthetic protection | First product, first enabled option |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote** and build the quote with the shared client values (last name `Owner2506-001`) and the vehicle step (Delivered at `RUN_DATE`, Price `25000`) | `/quote/{id}/details` shows heading `#{id} - Esthetic Owner2506-001`; the quote id (quote A) is recorded |
| 2 | [Pre-Condition] Add Esthetic protection with the shared values (first product, first enabled option) → **Save**, and return to `/quote/{id}/details`. Record the number of open browser tabs | The quote page shows an Esthetic protection (Permaplate) entry naming the chosen product and option; names and Cost are recorded. If no product is offered, the case is BLOCKED as described in the Execution Context |
| 3 | [Verification] On the quote page, find the Esthetic protection create-contract action (open the row's actions menu if it has one) and click it. Before doing anything else, inspect the page the action opened | The browser navigates to `/quote/{id}/permaplate-create-contract` with quote A's id (the address bar changes) and the page loads without an error page or HTTP 5xx. The page the **action** opened is a full page: no modal dialog is open, the quote page is not visible behind or around it, and a "Program Summary" section and a "Generate Contract" button are on it. Record whether it opened in the same tab or a new tab or window, and the tab count against step 2 (Q-001). If no create-contract action exists anywhere on the quote page for Esthetic protection, this step FAILS — the description states the action exists. Record where it sat and its label (Q-011) |
| 4 | Open `/quote/{id}/details` again, then type `/quote/{id}/permaplate-create-contract` into the address bar and press Enter | The contract page loads directly from the address, without an error page or HTTP 5xx |
| 5 | [Verification] Inspect the page loaded from the address in step 4 | The address is exactly `/quote/{id}/permaplate-create-contract` with quote A's id — the route is unchanged; the page is the same full page seen in step 3 — no modal dialog, the quote page not visible behind it, "Program Summary" and "Generate Contract" present. Leave without submitting |

---

### AP2506_002 — "Generate Contract" in the Extended Warranty row actions opens the Esthetic protection contract page (acceptance criterion 1 as written)

| Field | Value |
|---|---|
| **TC ID** | AP2506_002 |
| **Title** | "Generate Contract" in the Extended Warranty row actions opens the Esthetic protection contract page (acceptance criterion 1 as written) |
| **Requirement** | AP2506 — REQ-001: AC 1 "Given a quote with an extended warranty quote and no contract, when the dealer chooses “Generate Contract” from the Extended Warranty row actions, then `/quote/{quoteId}/permaplate-create-contract` opens in the same tab with no modal." |
| **Route** | `/quote/{id}/details` → Extended Warranty row actions → "Generate Contract" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered) |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** AC 1 as written starts from the extended warranty, yet expects the
Esthetic protection address, while the description is about the Esthetic protection
action. Until the author says which row is meant (Q-001, asked on AP-2506 on 2026-11-01),
the expected result of step 4 cannot be written. The steps are ready so the case can run
as soon as the answer arrives; the designer then rewrites step 4's expected result to the
quoted answer.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Owner2506-002` |
| Quote vehicle | Vehicle 915 (pre-attached), Delivered at `RUN_DATE`, Price `25000` |
| Extended warranty | First program, first term, Sale price `2500` if the form asks for one |
| Esthetic protection | First product, first enabled option |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`), open `/vehicle/915/details`, click **Create quote** and build the quote with the shared client values (last name `Owner2506-002`) and the vehicle step (Delivered at `RUN_DATE`, Price `25000`) | `/quote/{id}/details` shows heading `#{id} - Esthetic Owner2506-002`; the quote id is recorded |
| 2 | [Pre-Condition] Add an extended warranty ("Click here to create a warranty" → `/quote/{id}/warranty/edit`): the first program and its first term, Sale price `2500` if asked → **Save**; then add Esthetic protection with the shared values → **Save** | The quote page shows an extended warranty entry and an Esthetic protection entry; program, term, product and option are recorded. If no warranty program is offered, the case stays BLOCKED with that reason |
| 3 | Record the open tab count, then on the quote page open the **Extended Warranty** row's actions menu and click **"Generate Contract"** | A page opens without an error page or HTTP 5xx; its address and tab are recorded |
| 4 | [Verification] Inspect the address, the tab count and the page | Not known — Q-001. Record the address, whether a modal is open, and whether the tab count changed |

---

### AP2506_003 — The Esthetic protection contract page shows vehicle and owner on the left, and Program Summary and the button on the right

| Field | Value |
|---|---|
| **TC ID** | AP2506_003 |
| **Title** | The Esthetic protection contract page shows vehicle and owner on the left, and Program Summary and the button on the right |
| **Requirement** | AP2506 — REQ-002: AC 2 "it shows the “Vehicle identification” and “Owner information” in a left column, and “Program Summary” and a submit button in a right column"; description "a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right" |
| **Route** | `/quote/{id}/permaplate-create-contract` |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The layout is what the dealer sees. The case judges only the four
elements the criterion places. Two points are open and only recorded: where any financing
field sits (Q-003), and what else should "match Esthetic Protection" (Q-002).

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2506_001 if it exists and has no contract; otherwise build one (last name `Owner2506-003`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2506_001 if its Esthetic protection entry still offers the create-contract action; otherwise open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `Owner2506-003`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection (first product, first enabled option) → **Save** | A quote with Esthetic protection and no contract exists; its id is recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action on the quote page; if the action is not shown, type `/quote/{id}/permaplate-create-contract` and record that the fallback was used | The contract page loads without an error page or HTTP 5xx |
| 3 | [Verification] Inspect the left-hand column of the card at 1280 × 800 | A section headed "Vehicle identification" and a section headed "Owner information" are both in the left column. Record every other section in the left column, and where any financing field (for example "Financing company") appears on the page (Q-003) |
| 4 | [Verification] Inspect the right-hand column of the card | A section headed "Program Summary" and a submit button labelled "Generate Contract" are both in the right column, side by side with the left column rather than below it. Record anything else in the right column, and the full list of section headings on the page, in order, with the submit button's label, for the author to compare with the extended-warranty contract page (Q-002) — not judged. Leave without submitting |

---

### AP2506_004 — The Program Summary shows the term, start and end dates, the protection products chosen on the quote, and a total

| Field | Value |
|---|---|
| **TC ID** | AP2506_004 |
| **Title** | The Program Summary shows the term, start and end dates, the protection products chosen on the quote, and a total |
| **Requirement** | AP2506 — REQ-003: AC 2 "The “Program Summary” shows: Program Term · Start Date · End date · Selected protection products · Total" |
| **Route** | `/quote/{id}/permaplate-create-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** These values go onto the contract the client signs. The product and
option were chosen by this case, so "Selected protection products" can be checked against
them. Esthetic protection has a product (radio) and options (checkboxes), and AC 2 does not
say which of them the list names, so the list may name the chosen product, the chosen
option or both; which names appear is recorded. The start date's default and editability
(Q-004), how the end date is worked out (Q-005) and which amount the total is (Q-006) are
not stated, so they are recorded; the case fails only if an item is missing, the products
list is empty or names a product or option that was not chosen, or a value is lost.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2506_001 if it exists and has no contract; otherwise build one (last name `Owner2506-004`) |
| Product and option chosen on the quote | Recorded when the quote was built |
| New start date typed (only if the field is editable) | `RUN_DATE` + 7 days |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2506_001 if its Esthetic protection entry still offers the create-contract action; otherwise open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `Owner2506-004`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save**. Record the product, option and Cost the quote page shows | A quote with Esthetic protection and no contract exists; its id, product, option and Cost are recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action; if the action is not shown, type `/quote/{id}/permaplate-create-contract` and record that the fallback was used | The contract page loads without an error page or HTTP 5xx |
| 3 | [Verification] Read the "Program Summary" section | It shows a program term, a start date, an end date, a "Selected protection products" list and a total (an amount). The products list is present and not empty, and every name in it is the product or an option chosen on the quote — it names nothing that was not chosen. Record which names appear (product, option, or both). Record the term, the start date and whether it equals `RUN_DATE` (Q-004), the end date and whether it equals start date plus term (Q-005), and the total and whether it equals the quote's Cost, with or without tax (Q-006) |
| 4 | Try to change the start date to `RUN_DATE` + 7 days. Do not click "Generate Contract" | Record whether the start date can be changed (Q-004) and, if it can, whether the end date changes with it (Q-005) |
| 5 | [Verification] Inspect the Program Summary again | The term, the products list and the total still show the values read in step 3 (no value lost or changed by step 4); if the start date was editable it shows `RUN_DATE` + 7 days. Leave without submitting |

---

### AP2506_005 — The Esthetic protection contract page is pre-filled with the quote's vehicle and client details

| Field | Value |
|---|---|
| **TC ID** | AP2506_005 |
| **Title** | The Esthetic protection contract page is pre-filled with the quote's vehicle and client details |
| **Requirement** | AP2506 — REQ-004: AC 3 "Given the quote has a vehicle and a client, when the page renders, then vehicle and owner values are pre-filled." |
| **Route** | `/quote/{id}/permaplate-create-contract` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The pre-fill keeps the contract consistent with the quote and saves
the dealer from retyping. The ticket does not list each section's fields, so every field
shown is compared with the value this case entered or with vehicle 915's recorded values,
and the list of fields is recorded. Which fields may be edited is not stated (Q-007), so
editability is recorded, not judged. Nothing is submitted.

**Test Data:**

| Variable | Value |
|---|---|
| Quote | Quote A from AP2506_001 if it exists and has no contract; otherwise build one (last name `Owner2506-005`) |
| Vehicle values | VIN `1FAHP35NX8W239204`, Ford, Focus, 2008, 5000 km (vehicle 915) |
| Client values | First `Esthetic`, Last `Owner2506-001` (or the case's own last name), address `200 Rue Test`, city `Montréal`, province `Québec` (or its code `QC`), postal code `H2X 1Y4` (with or without the space), phones `5145550301` / `5145550302` (the same digits in any display format), the recorded Yopmail email |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal (`?_locale=en`). Use quote A from AP2506_001 if its Esthetic protection entry still offers the create-contract action; otherwise open `/vehicle/915/details`, click **Create quote**, build the quote with the shared client values (last name `Owner2506-005`), the vehicle step (Delivered at `RUN_DATE`, Price `25000`) and the shared Esthetic protection → **Save** | A quote with Esthetic protection and no contract exists; its id and client last name are recorded |
| 2 | Open the contract page with the Esthetic protection create-contract action; if the action is not shown, type `/quote/{id}/permaplate-create-contract` and record that the fallback was used | The contract page loads without an error page or HTTP 5xx |
| 3 | [Verification] Read the "Vehicle identification" section | The VIN shows `1FAHP35NX8W239204`; every other vehicle value shown matches vehicle 915 (make Ford, model Focus, year 2008 — letter case aside — and 5000 km if a kilometres field is shown, with or without a thousands separator). No shown field is empty where the vehicle holds a value. Record the list of fields and which are editable (Q-007) |
| 4 | [Verification] Read the "Owner information" section | First name `Esthetic`, the recorded last name, and every other owner field shown carries the value entered for the client (email, address `200 Rue Test`, city `Montréal`, province `Québec` or its code `QC`, postal code `H2X 1Y4` with or without the space, phones `5145550301` / `5145550302` as the same digits in any display format). No shown field is empty or carries a different value. Record the list of fields, the exact form each value is shown in (province name or code, phone and postal-code format), and which are editable (Q-007). Leave without submitting |

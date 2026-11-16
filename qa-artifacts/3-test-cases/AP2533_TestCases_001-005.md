# Test Cases — AP2533 (File 1 of 3)

**Project:** Avantage Plus v2 — Dealer portal, "Create a quote" form `/quote/new/edit-vehicle`
**Requirement:** AP2533 — Update quote form UI: "Décoder" fills the form and does not create the quote; "Vehicle type" drop-down before the Quote name
**Source:** requirements/AP-2533-update-quote-form-ui.md · qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2533_test-plan.md
**Date:** 2026-11-07
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2533_001 to AP2533_005 (5 test cases) · **Set total:** 11 test cases, AP2533_001–AP2533_011, in 3 files
**Coverage:** Functional · Negative · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` → **"Create a quote"** (`href="/quote"`) → `/quote` 302 → `/quote/new/edit-vehicle`, heading "Create a quote". Save → `POST /quote/new/edit-vehicle` → 302 → `/quote/{id}/details` with the banner "Vehicle saved". Quote search: `/quotes?quote_search[keyword]=<text>` (partial, case-insensitive on quote name, client name/email and VIN; empty result "No entities found"; 10 rows per page, `&page=N`). | `navigation` → `domain` (quote-creation.md, "On Dev (v2dev) — mapped 2026-11-01" and "`/quotes` after AP-2494, mapped 2026-11-02") |
| **Viewport** | 1280 × 800 | `navigation` (tool registry `admin_viewport`) |
| **Environment** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca` (`execution_env: Dev` in the tool registry) | `env` |
| **Login** | Dealer — `DEALER_USERNAME` / `DEALER_PASSWORD` from the "Dev Environment" section of the `env` source, at `/login` (Dealer ID 1380, "Test QA staging"). Never copy them into this file. | `env` |
| **Form fields (Dev, mapped 2026-11-01 — before AP-2533)** | Quote name `#quote_vehicle_quote_name`, VIN `#quote_vehicle_VIN` (class `vinlookup`) with the **"Décoder"** button (car types only), Brand `#vehicle_make`, Model `#vehicle_model`, Year `#vehicle_year`, button **"Save"**. Form prefix `quote_vehicle[...]`. Brand and Model are Bootstrap-select widgets (choosing a Brand reloads the Model list by AJAX — wait about a second). Hidden inputs then: `quote_vehicle[transmission]` = automatic, `quote_vehicle[engineSizeUnit]` = l. Before AP-2533 the type menu was a button at the top right ("Passenger" / "Auto Passenger"), 23 types, each `/quote/new/edit-vehicle/{TYPE}`. AP-2533 may have changed ids and labels (Q-008) — locate fields by their visible label when an id is missing, and record the difference. | `domain` (quote-creation.md) |
| **Form fields (Dev, 2026-11-07 — context, from quote-creation.md)** | Mapped during the AP-2477 re-test on 2026-11-07 (AP-2533 in QC); for the current Dev build it supersedes the type-button and "Décoder saves the quote" parts of the 2026-11-01 row. The vehicle type is a labelled select **"Vehicle type"** `#vehicle_type_switch` (no `name`, not submitted) at the top of the form card, **above Quote name**; choosing a type navigates to `/quote/new/edit-vehicle/{TYPE}` (same 23 types). "Décoder" posts by AJAX (`POST /quote/new/edit-vehicle` → **200**, body = quote name, VIN, token, `quote_vehicle[novalidate]=true`) and re-renders the form in place, pre-filled, keeping a typed Quote name. After a decode the form carries hidden `transmission`, `cylinders`, `engineSize`, `engineSizeUnit`, `fuelType` and `id` (prefix `quote_vehicle[...]`); `id` held the id of an existing inventory vehicle with the decoded VIN (863 for `1FAHP35NX8W239204`), and Save still created a new vehicle. **Context only** — no expected result is taken from this row; AP2533_001 (build check) and AP2533_010 (field map) re-check the live form. | `domain` (quote-creation.md, "Dev, 2026-11-07" bullet) |
| **Test data** | VIN **`5YJ3E1EA0LF734293`** — 2020 TESLA Model 3 Standard Range Plus on Dev (`test-data`, AP-2377 run 2026-11-02); the VIN of the acceptance-criterion screenshot, whose expected decode is Brand **TESLA**, Model **Model 3**, Year **2020**. Each case types its own quote name `QA-AP2533-<NNN>-<HHMMSS>` (UTC time of the step) and finds any quote by that name — **never by "newest row"**. **Never open, edit or reuse quote 6437, vehicle 1067 or vehicle 915**, and do not decode AP-2507's Ford VIN `1FAHP35NX8W239204` (AP2507_001–003 own it). | `test-data`, `domain` |
| **Language** | English dealer UI on Dev; the "Décoder" button label stays French | `domain` |
| **Leaves behind** | On a fixed build: only AP2533_004 saves anything — one quote and one vehicle named `QA-AP2533-004-<HHMMSS>`. Dealers cannot delete quotes. If any decode saves a quote (a FAIL), record that quote's id and vehicle id in the execution log and run summary. | `cleanup` (missing — no teardown is known) |

### Build check — run before any "Décoder" click

The ticket's pull request was deployed to an environment named "develop" on 2026-11-04
03:28 UTC; that "develop" is Dev (v2dev) is **unverified**. Developer Minh Lưu's comment on
AP-2507 (2026-11-03) says the fix makes `vinlookup.js` send `formName + "[novalidate]"`
instead of the hard-coded `vehicle[novalidate]`. On an unfixed build every "Décoder" click
saves a quote the dealer cannot delete, so the check is read-only: open
`/quote/new/edit-vehicle`, open the page source, then open every script it loads (the
`vinlookup` one first if it exists, then the bundles) and search each for `novalidate`.
**No click on "Décoder".** Record the file name and the matching line word for word.

| # | What the check finds | Action |
|---|---|---|
| 1 | A script builds the key from the form's name (for example `formName + "[novalidate]"`, or the literal `quote_vehicle[novalidate]`) | **Fix present.** Run the decode cases |
| 2 | A script contains a hard-coded `vehicle[novalidate]` and nothing built from the form name | **Fix absent.** Do not click "Décoder". Mark every case that clicks it **BLOCKED — "fixed build not deployed on Dev"**, naming the line found |
| 3 | No script contains `novalidate`, or the key matches neither row 1 nor row 2, or no script can be read | Open today's AP-2507 execution log (`qa-artifacts/4-execution-results/*/execution-log_AP-2507_2026-11-07.md`) if it exists and read AP2507_001: if its decode saved no quote → apply row 1, citing that log; if it saved a quote → apply row 2, citing that log. Else read today's AP-2477 log (`qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-07.md`), AP2477_007: decode → 200, no quote saved → apply row 1, citing it. If neither log gives such a result → apply row 2 with the reason "fixed build not deployed on Dev — build check inconclusive" |

The check is done once per execution day. AP2533_001 step 1 runs it; every later decode case
cites AP2533_001's recorded result in its first step instead of repeating it, unless the page
was redeployed in between (a changed script file name).

**Stop rule:** if any decode click saves a quote (the browser lands on `/quote/{id}/details`
or "Vehicle saved" appears), record the quote id, do not click "Décoder" in any later case,
and mark the remaining decode cases **BLOCKED — "decode saves a quote (see AP2533_00N)"**.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Which hidden inputs the decode must fill, and with which values — the first criterion names "(visible and hidden input)" but no input or value | AP2533_002 | Open — Q-002 (Blocking), posted on AP-2533 as comment 19510, 2026-11-07 |

> AP2533_002 ships with **Status: BLOCKED**. AP2533_001 records the hidden inputs as
> observations only, so the evidence is ready when Q-002 is answered. Whether the fixed
> build is on Dev is not a design-time blocker: it is checked by the build check above.

**Run order:** AP2533_001 → 005 (this file) → AP2533_006 → AP2533_011 (`AP2533_TestCases_011-011.md`) → AP2533_007–010.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | Execution Context: added the "Form fields (Dev, 2026-11-07 — context)" row from quote-creation.md; build-check row 3 now also accepts AP2477_007 of `execution-log_AP-2477_2026-11-07.md` (decode → 200, no quote saved) as evidence for row 1; run order and set total (11 cases, 3 files) added | R2 round 1 F-5; Gate B rule B2 promoted AP2533_011 | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |
| 2026-11-07 | Before Wave 2 execution (11:06Z): every case's status reset to Not Run (AP2533_002 stays BLOCKED by Q-002, design time); no step or expected result changed | Orchestrator hand-off for execute --until correct-cases, Gate B approved by R2 round 2 | qa-reviewer (R2 round 2), qa-artifacts/7-reviews/AP-2533_review.md |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2533_001 | Clicking "Décoder" with the Tesla VIN keeps the form on screen with TESLA, Model 3 and 2020 filled in | Functional | High | PASS |
| AP2533_002 | Clicking "Décoder" with the Tesla VIN fills the form's hidden vehicle inputs with the decoded values | Functional | High | BLOCKED |
| AP2533_003 | Clicking "Décoder" without pressing Save creates no quote and keeps the dealer on the "Create a quote" form | Functional | High | PASS |
| AP2533_004 | Saving the form after a decode creates exactly one quote carrying the decoded TESLA Model 3 2020 | Regression | High | PASS |
| AP2533_005 | Clicking "Décoder" with a malformed or empty VIN shows no error page, keeps the form and creates no quote | Negative | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2533_001 — Clicking "Décoder" with the Tesla VIN keeps the form on screen with TESLA, Model 3 and 2020 filled in

| Field | Value |
|---|---|
| **TC ID** | AP2533_001 |
| **Title** | Clicking "Décoder" with the Tesla VIN keeps the form on screen with TESLA, Model 3 and 2020 filled in |
| **Requirement** | AP2533 — REQ-001 AC 1 (visible part): "Given the dealer enter the NIV, When the dealer clicks on “Decoder”, Then the form with the vehicle information (visible and hidden input) …"; REQ-001 AC 2 (screenshot image-20261102-142427.png: Brand TESLA, Model "Model 3", Year 2020); REQ-001 AC 3 (the empty card of image-20261102-193230.png no longer appears). Q-001 (Judgement) — the verbless "Then" is read through the screenshot |
| **Route** | `/quote/new/edit-vehicle` — Create a quote (default car type) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (the build check in step 1 can turn it BLOCKED — "fixed build not deployed on Dev") |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — build check row 1; TESLA / Model 3 / 2020 filled, form kept — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** This is the defect the ticket fixes. Today one click replaces the
whole form with an empty white card, so a dealer cannot use the decoder at all. The hidden
inputs are read here only as observations — whether they are right is AP2533_002's question,
blocked by Q-002 — so this case passes or fails on the visible fields alone.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `5YJ3E1EA0LF734293` |
| Quote name | left empty (as in the acceptance-criterion screenshot) |
| Expected decode | Brand TESLA · Model Model 3 · Year 2020 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer, open `/quotes` and click **"Create a quote"**. Hard-reload `/quote/new/edit-vehicle` and run the **build check** of the Execution Context (page source, every script, search for `novalidate`). **Do not click "Décoder" in this step.** | The "Create a quote" form shows Quote name, VIN with a **"Décoder"** button, Brand, Model and Year, and **"Save"**. The script file name and its `novalidate` line are recorded word for word (or "no script contains novalidate"). By table row 1 the case continues; by row 2 (or row 3 falling to row 2) this case and every decode case are BLOCKED — stop here. |
| 2 | [Pre-Condition] Without clicking anything, read every hidden input inside the form and record its name and value (for a CSRF token, record only its name, never its value). | The hidden inputs are listed in the execution log as **observations** (expected on 2026-11-01: `quote_vehicle[transmission]` = automatic, `quote_vehicle[engineSizeUnit]` = l). Record-only — no PASS/FAIL on this list. |
| 3 | Leave **Quote name** empty and Brand on its placeholder, type `5YJ3E1EA0LF734293` in **VIN**, click **"Décoder"** once and wait for the form to re-render. Save the decoder request line (method, URL, status only) to a `.txt` next to the screenshots. | The browser stays on `/quote/new/edit-vehicle`; no error page and no HTTP 5xx appear. The decoder request answers without a redirect to `/quote/{id}/details`. |
| 4 | Read every hidden input inside the form again, as in step 2, and record names and values. | The after-decode list is recorded next to the step-2 list as **observations** for Q-002 — record-only, no PASS/FAIL. |
| 5 | [Verification] Read VIN, Brand, Model and Year, and check what the form card shows. | VIN still holds `5YJ3E1EA0LF734293`; **Brand shows TESLA, Model shows Model 3, Year shows 2020**. The form card is not empty: Quote name, VIN, Brand, Model, Year and **"Save"** are all shown, and no "Vehicle saved" banner appears. Any other layout difference is recorded for Q-001 / Q-008, with no verdict. |

---

### AP2533_002 — Clicking "Décoder" with the Tesla VIN fills the form's hidden vehicle inputs with the decoded values

| Field | Value |
|---|---|
| **TC ID** | AP2533_002 |
| **Title** | Clicking "Décoder" with the Tesla VIN fills the form's hidden vehicle inputs with the decoded values |
| **Requirement** | AP2533 — REQ-001 AC 1 (hidden part): "Then the form with the vehicle information (visible and hidden input) …" |
| **Route** | `/quote/new/edit-vehicle` — Create a quote (default car type) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-002 (Blocking, Open) — the ticket names no hidden input and no value; posted on AP-2533 as comment 19510 on 2026-11-07 |
| **Executed on** | Not executed (2026-11-07) |
| **Result** | BLOCKED — Q-002 (Blocking, Open), comment 19510; not executed — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** The hidden inputs carry the decoded technical details (for example
transmission or engine size) that a warranty program may later price on. If the decode fills
only the visible fields, a dealer could save a quote whose vehicle lacks those details without
noticing. Until the author says which inputs and which values are expected, no result can be
judged, so this case stays BLOCKED; its steps are written so it runs as soon as Q-002 is
answered. Do not execute it while Q-002 is Open — AP2533_001 already records the hidden
inputs before and after the decode as evidence.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `5YJ3E1EA0LF734293` |
| Quote name | left empty |
| Expected hidden inputs | Not known — Q-002 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quote/new/edit-vehicle` from `/quotes` → **"Create a quote"**. Cite AP2533_001's build-check result of the same day (or run the build check of the Execution Context if AP2533_001 has not run). | The "Create a quote" form is shown with **"Décoder"**. The build check is at table row 1 (fix present); otherwise this case stays BLOCKED with "fixed build not deployed on Dev". |
| 2 | Type `5YJ3E1EA0LF734293` in **VIN**, click **"Décoder"** once and wait for the form to re-render. | The browser stays on `/quote/new/edit-vehicle` with the form shown; no error page appears. |
| 3 | [Verification] Read every hidden input inside the form (name and value; for a CSRF token, the name only) and compare them with the inputs and values named in the answer to Q-002. | Not known — Q-002. Once answered: every hidden input the answer names is present and holds the value it names for the 2020 TESLA Model 3. |

---

### AP2533_003 — Clicking "Décoder" without pressing Save creates no quote and keeps the dealer on the "Create a quote" form

| Field | Value |
|---|---|
| **TC ID** | AP2533_003 |
| **Title** | Clicking "Décoder" without pressing Save creates no quote and keeps the dealer on the "Create a quote" form |
| **Requirement** | AP2533 — REQ-002 AC 1: "Then … and does not create the quote."; REQ-002 AC 2 (after the decode the dealer is still on the form with "Save" available). Related: AP-2507 (open, High) — this case judges AP-2533 only; AP2507_001–003 own AP-2507's verdict. Q-005 (Judgement) recorded |
| **Route** | `/quote/new/edit-vehicle` — Create a quote (default car type); `/quotes` keyword search |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (BLOCKED — "fixed build not deployed on Dev" if the build check fails) |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — no quote created by the decode — execution-log_AP-2533_2026-11-07.md |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | Steps 1 and 4: the Vehicle Inventory first row's vehicle id is recorded as well as its VIN (still record-only for Q-005) | R2 round 1 F-3 — an unchanged VIN alone cannot show whether the decode added a vehicle if a vehicle with this VIN already exists | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |

**Why this matters:** On Dev on 2026-11-01 one decode click saved quote 6437 and vehicle 1067
(bug AP-2507). Every decode that saves leaves the dealer with an unwanted quote they cannot
delete. This case types its own quote name so a quote created by the decode can be found by
name, rather than by guessing which row is newest on a shared account. A FAIL here is linked
to AP-2507 at Gate C — no new bug is filed — and AP-2533's ticket update never changes
AP-2507.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2533-003-<HHMMSS>` (UTC time when typed) |
| VIN | `5YJ3E1EA0LF734293` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer. Open `/quotes?quote_search[keyword]=5YJ3E1EA0LF734293` and count the rows over all pages (record the count, the ids from `data-href`, and "No entities found" if empty). Open the **Vehicle Inventory** `/vehicle/inventory` and record the vehicle id and the VIN of its first row (the list is ID-descending, `test-data`; observation for Q-005). Cite AP2533_001's build-check result of the same day. | The baseline VIN-search count and the inventory first-row vehicle id and VIN are recorded. The build check is at table row 1; otherwise this case is BLOCKED — "fixed build not deployed on Dev". |
| 2 | Open `/quotes` → **"Create a quote"**. Type `QA-AP2533-003-<HHMMSS>` in **Quote name** and `5YJ3E1EA0LF734293` in **VIN**, click **"Décoder"** once and wait for the form to re-render. Save the decoder request line (method, URL, status only) to a `.txt`. | The browser stays on `/quote/new/edit-vehicle`; no error page appears and no redirect to `/quote/{id}/details` happens. |
| 3 | [Verification] Read the address bar, the page heading, the Quote name field and the buttons; look for a "Vehicle saved" banner. | The URL is still `/quote/new/edit-vehicle`, the heading is "Create a quote", **"Save"** is shown, and no "Vehicle saved" banner appears. Quote name still reads `QA-AP2533-003-<HHMMSS>` (a lost typed value is a fault). |
| 4 | Without clicking **"Save"**, open `/quotes?quote_search[keyword]=QA-AP2533-003` and then `/quotes?quote_search[keyword]=5YJ3E1EA0LF734293`; open `/vehicle/inventory` and read the first row's vehicle id and VIN. | The searches load. The inventory first-row vehicle id and VIN are recorded next to the step-1 values for Q-005 — record-only, no verdict on the vehicle. |
| 5 | [Verification] Compare the two searches with the baseline. | The name search shows **"No entities found"**, and the VIN search shows the same count and ids as in step 1: the decode created no quote. A quote named `QA-AP2533-003-…`, or a new id in the VIN search, is a FAIL — record its id and its vehicle id under Leaves behind and apply the stop rule. |

---

### AP2533_004 — Saving the form after a decode creates exactly one quote carrying the decoded TESLA Model 3 2020

| Field | Value |
|---|---|
| **TC ID** | AP2533_004 |
| **Title** | Saving the form after a decode creates exactly one quote carrying the decoded TESLA Model 3 2020 |
| **Requirement** | AP2533 — REQ-002 regression (analysis, REQ-002 risk "A following Save must still create exactly one quote with the decoded vehicle" — regression, not a stated criterion); REQ-001 AC 2 values carried to the saved vehicle |
| **Route** | `/quote/new/edit-vehicle` → `/quote/{id}/details` → `/vehicle/{vehicleId}/details` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (BLOCKED — "fixed build not deployed on Dev" if the build check fails, or "decode saves a quote (see AP2533_00N)" under the stop rule) |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — one quote 6602, vehicle 1157 — execution-log_AP-2533_2026-11-07.md |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | Steps 2–4: record the hidden `quote_vehicle[id]` after the decode; if non-empty, read that vehicle's details page read-only before and after the Save and record whether it changed and whether the saved vehicle id equals it; never save its edit form. Step 3: Save only on the form tab | R2 round 1 F-4 — on the 2026-11-07 Dev build the decode puts an existing inventory vehicle's id in hidden `quote_vehicle[id]` (AP2477_007; quote-creation.md). Record-only, no verdict changes | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |

**Why this matters:** Stopping the decode from saving must not break the dealer's real
Save. If the fixed decode leaves the form in a state the server refuses, or the Save creates
two quotes (one from the decode, one from Save), the dealer either cannot quote the car or
ends up with duplicates. Hidden technical details on the saved vehicle are recorded only
(Q-002).

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2533-004-<HHMMSS>` (UTC time when typed) |
| VIN | `5YJ3E1EA0LF734293` |
| Expected vehicle | TESLA · Model 3 · 2020 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer. Open `/quotes?quote_search[keyword]=QA-AP2533-004` and record the result. Cite AP2533_001's build-check result and AP2533_003's result of the same day. | The search shows "No entities found" (no earlier quote with this prefix). The build check is at row 1 and AP2533_003 did not hit the stop rule; otherwise this case is BLOCKED naming the reason. |
| 2 | Open `/quotes` → **"Create a quote"**. Type `QA-AP2533-004-<HHMMSS>` in **Quote name** and `5YJ3E1EA0LF734293` in **VIN**, click **"Décoder"** once and wait for the form to re-render with TESLA, Model 3 and 2020. Read the hidden `quote_vehicle[id]` and record its value (or "empty"). If it holds an id, open `/vehicle/{that id}/details` in a new tab, read-only, record its Brand, Model, Year, VIN and mileage, then close the tab and return to the form without reloading it — never open that vehicle's edit form. | The form stays on `/quote/new/edit-vehicle` with Brand TESLA, Model Model 3 and Year 2020 (as AP2533_001). The hidden `quote_vehicle[id]` value and, if non-empty, that vehicle's details are recorded — record-only. |
| 3 | Click **"Save"** once (on the form tab — never on any other vehicle's page). | The browser lands on `/quote/{id}/details` with the banner "Vehicle saved"; no error page. Record the quote id from the URL. |
| 4 | On the quote details page, open the quote's vehicle (`/vehicle/{vehicleId}/details`) and read Brand/Make, Model, Year and VIN; record any technical details shown (transmission, engine, fuel). Record the vehicle id and whether it equals the hidden `quote_vehicle[id]` from step 2. If that hidden id was non-empty, open `/vehicle/{that id}/details` read-only and compare its Brand, Model, Year, VIN and mileage with step 2. | The vehicle page loads. Technical details are recorded for Q-002; whether the Save created a new vehicle or reused the decoded id, and whether vehicle `{hidden id}` changed, are recorded — record-only, no verdict. That vehicle is never edited or saved and is never used as test data. |
| 5 | [Verification] Check the vehicle values from step 4, then open `/quotes?quote_search[keyword]=QA-AP2533-004` and count the rows. | The vehicle shows **TESLA, Model 3, 2020** and VIN `5YJ3E1EA0LF734293`. The name search lists **exactly one** quote, the id recorded in step 3, with the name `QA-AP2533-004-<HHMMSS>` in its Vehicle cell (named quotes show the name in capitals above the vehicle). Two rows (decode plus Save) is a FAIL. |

---

### AP2533_005 — Clicking "Décoder" with a malformed or empty VIN shows no error page, keeps the form and creates no quote

| Field | Value |
|---|---|
| **TC ID** | AP2533_005 |
| **Title** | Clicking "Décoder" with a malformed or empty VIN shows no error page, keeps the form and creates no quote |
| **Requirement** | AP2533 — REQ-001 (negative; Q-003 Judgement — what the dealer should see is not stated, so the message is record-only); REQ-002 AC 1 ("does not create the quote") |
| **Route** | `/quote/new/edit-vehicle` — Create a quote (default car type); `/quotes` keyword search |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (BLOCKED — "fixed build not deployed on Dev" if the build check fails, or under the stop rule) |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — form kept, no quote — execution-log_AP-2533_2026-11-07.md |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | Steps 2 and 3: the Quote name check moved from the objective checks to record-only for Q-003; the only checks that can fail these steps are no error page / no HTTP 5xx, staying on `/quote/new/edit-vehicle` and a non-empty form card. "A typed Quote name lost" removed from the objective faults in "Why this matters". Step 5 unchanged | R2 round 1 F-1 (Blocker) — Q-003 (Judgement, Open) asks whether fields already filled are kept after an undecodable VIN; no PASS/FAIL may rest on a guessed answer | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |

**Why this matters:** Dealers mistype VINs. The ticket does not say what message they should
see (Q-003), so this case does not assert one. It fails only on objective faults: an error page
or HTTP 5xx, leaving `/quote/new/edit-vehicle`, the empty card from the ticket's screenshot, or a
quote created by a decode that could not even read the VIN. Whether the fields already filled
(the typed Quote name included) are kept is what Q-003 asks, so they are recorded only.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Quote name | `QA-AP2533-005-<HHMMSS>` | UTC time when typed |
| VIN (malformed) | `ABC123` | 6 characters, far short of a 17-character VIN |
| VIN (empty) | _(empty)_ | Field cleared |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"**. Cite AP2533_001's build-check result and AP2533_003's result of the same day. Type `QA-AP2533-005-<HHMMSS>` in **Quote name**. | The form is shown with **"Décoder"**. The build check is at row 1 and the stop rule has not fired; otherwise this case is BLOCKED naming the reason. |
| 2 | Type `ABC123` in **VIN**, click **"Décoder"** once and wait 5 seconds. Record any message shown and the decoder request line (method, URL, status only) in a `.txt`. | No error page and no HTTP 5xx; the browser stays on `/quote/new/edit-vehicle`; the form card is not empty. The Quote name value after the decode is recorded for Q-003 — record-only. The message (or "no message") and the Brand/Model/Year values are recorded for Q-003 — record-only. |
| 3 | Clear **VIN**, click **"Décoder"** once and wait 5 seconds. Record any message and the request line, as in step 2. | Same objective checks as step 2: no error page and no HTTP 5xx, still on `/quote/new/edit-vehicle`, the form card is not empty. The Quote name value after the decode is recorded for Q-003 — record-only. The message (or whether any request was sent) is recorded for Q-003 — record-only. |
| 4 | Without clicking **"Save"**, open `/quotes?quote_search[keyword]=QA-AP2533-005`. | The search page loads. |
| 5 | [Verification] Read the search result. | **"No entities found"**: neither decode created a quote. A quote named `QA-AP2533-005-…` is a FAIL — record its id under Leaves behind. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC 1 (visible) / AC 2 / AC 3 | AP2533_001, AP2533_011 | AP2533_005 | AP2533_006 | AP2533_004 |
| REQ-001 AC 1 (hidden input — Q-002) | AP2533_002 (BLOCKED) | — | — | — |
| REQ-002 AC 1 / AC 2 | AP2533_003, AP2533_011 | AP2533_005 | AP2533_006 | AP2533_004 |
| REQ-003 AC 1 / AC 2 | AP2533_007, AP2533_008 | — | AP2533_009 | AP2533_010 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2533_001 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_001-step5-TeslaDecodedFormKept_pass.png` |
| AP2533_002 | BLOCKED (Q-002) | — |
| AP2533_003 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_003-step5-VinSearchUnchanged_pass.png` |
| AP2533_004 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_004-step5-NameSearchOneQuote6602_pass.png` |
| AP2533_005 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_005-step5-NameSearchNoEntities_pass.png` |

# Test Cases — AP2507 (File 1 of 1)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2507 — Bug re-test: clicking "Décoder" on the new-quote vehicle form saves a quote and empties the form instead of re-rendering it pre-filled
**Source:** requirements/AP-2507-decoder-saves-quote-and-empties-form.md (bug re-test flow — no requirements analysis or test plan; the bug's steps to reproduce and expected result are the requirement) · original failing case AP2477_007 and its blocked neighbours AP2477_008 / AP2477_009 in qa-artifacts/3-test-cases/AP2477_TestCases_006-010.md
**Date:** 2026-11-07
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2507_001 to AP2507_003 (3 test cases)
**Coverage:** Functional (re-test) · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` → **"Create a quote"** (`href="/quote"`) → `/quote` 302 → `/quote/new/edit-vehicle`, heading "Create a quote", vehicle type button **"Passenger"** at the top right. Save → `POST /quote/new/edit-vehicle` → 302 → `/quote/{id}/details` with the banner "Vehicle saved". The quote's vehicle: `/vehicle/{vehicleId}/details`, full edit form `/vehicle/{vehicleId}/edit`. | `navigation` → `domain` (quote-creation.md, "On Dev (v2dev) — mapped 2026-11-01") |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca` (`execution_env: Dev` in the tool registry) | `env` |
| **Login** | Dealer — `DEALER_USERNAME` / `DEALER_PASSWORD` from the "Dev Environment" section of the `env` source, at `/login` (Dealer ID 1380, "Test QA staging"). Never copy them into this file. | `env` |
| **Form fields (Dev)** | Quote name `#quote_vehicle_quote_name`, VIN `#quote_vehicle_VIN` (class `vinlookup`) with the **"Décoder"** button, Brand `#vehicle_make`, Model `#vehicle_model`, Year `#vehicle_year`, button **"Save"**. Form prefix `quote_vehicle[...]`. Brand and Model are Bootstrap-select widgets. The decoder posts by AJAX (`POST /quote/new/edit-vehicle`) and replaces the whole form with the response — wait for the re-render before reading it. Hidden inputs seen on 2026-11-01: `quote_vehicle[transmission]` and `quote_vehicle[engineSizeUnit]` only. | `domain` (quote-creation.md) |
| **Test data** | Known VIN **`1FAHP35NX8W239204`** (2008 Ford Focus); expected decode **Ford / Focus / 2008** (the decoder returned exactly this on Dev on 2026-11-01). The VIN is typed, not chosen from inventory. **Never open, edit or reuse quote 6437 or vehicle 1067** (AP-2477's left-behind decode records) **nor inventory vehicle 915.** Quotes this batch creates are found by their own `QA-AP2507-…` name, never by "newest row". | `test-data`, `domain` |
| **Language** | English dealer UI on Dev (the "Décoder" button label stays French) | `domain` |
| **Leaves behind** | On a fixed build: AP2507_001 saves nothing; AP2507_002 and AP2507_003 each save one quote and one vehicle (named `QA-AP2507-002-<HHMMSS>` / `QA-AP2507-003-<HHMMSS>`). On a still-broken build that passes the step-1 build check: at most one unwanted quote and vehicle from the single "Décoder" click in AP2507_001. Dealers cannot delete quotes. Record every id in the execution log. | `cleanup` (missing) |

**Build check first (AP2507_001 step 1) — the fix is not on this ticket.** The developer
(Minh Lưu, comment of 2026-11-03) says the fix is delivered by **AP-2533** ("Update quote form
UI", Story, status QC on 2026-11-07): `vinlookup.js` used to send a hardcoded
`vehicle[novalidate]` while the form is named `quote_vehicle`; AP-2533 makes it send
`formName + "[novalidate]"` (plus the quote name and the token). Nothing on AP-2507 itself
says AP-2533 is deployed to Dev. **Context:** AP-2533's requirements analysis
(`qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md`, lines 38-39) records
a merged pull request deployed to the "develop" environment on 2026-11-04; that "develop" maps
to Dev (v2dev) is not verified, so this fact does not replace the build check. Step 1 of
AP2507_001 therefore reads the page's scripts **without clicking "Décoder"**, because on a
broken build every click saves a quote that cannot be deleted. Step 1 searches every script the
page loads (the `vinlookup` one first if it exists, then the bundles) for `novalidate`, because
`assets/js/vinlookup.js` is likely bundled into another file. Decide by this table (first match
wins):

| # | What step 1 finds | Action |
|---|---|---|
| 1 | A script builds the key from the form's name (for example `formName + "[novalidate]"`, or the literal `quote_vehicle[novalidate]`) | **Fix present.** Continue AP2507_001 and run AP2507_002–003 |
| 2 | A script contains a hardcoded `vehicle[novalidate]` and nothing built from the form name | **Fix not on Dev.** Do not click "Décoder". Mark AP2507_001–003 **BLOCKED — "fixed build (AP-2533) not deployed on Dev: vinlookup.js still sends vehicle[novalidate]"** |
| 3 | A script is readable but its novalidate key matches neither row 1 nor row 2, or no script contains `novalidate` | Apply row 4 |
| 4 | The script cannot be found or read (bundled, minified beyond reading) | Open today's AP-2477 execution log (`qa-artifacts/4-execution-results/*/execution-log_AP-2477_2026-11-07.md`, if it exists) and read the AP2477_007 result. If it records that "Décoder" still saved a quote → apply row 2, citing that log. Otherwise continue with step 2 and accept the risk of one quote, recorded under Leaves behind |

**Discrepancy to note, not to resolve:** the AP-2477 execution log of 2026-11-01 (line 261)
records the decoder post as carrying `vehicle[novalidate]=true` — which matches the
developer's diagnosis — while the bug description says `quote_vehicle[novalidate]=true`. The
step-2 network check below records which key the build on Dev sends today (record-only, no
verdict).

**Known blockers:** None at design time. Whether AP-2533 is on Dev is checked by AP2507_001
step 1, not assumed.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2507_001 | Clicking "Décoder" with a valid VIN re-renders the form with Ford, Focus and 2008 and saves no quote | Functional | High | PASS |
| AP2507_002 | A quote saved by the dealer after decoding keeps the decoded vehicle details on its vehicle | Regression | High | PASS |
| AP2507_003 | A quote name typed before clicking "Décoder" survives the decode and is saved with the quote | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2507_001 — Clicking "Décoder" with a valid VIN re-renders the form with Ford, Focus and 2008 and saves no quote

| Field | Value |
|---|---|
| **TC ID** | AP2507_001 |
| **Title** | Clicking "Décoder" with a valid VIN re-renders the form with Ford, Focus and 2008 and saves no quote |
| **Requirement** | AP2507 — Expected result (quoting AP-2477's acceptance criterion: "The VIN lookup runs, the form is re-rendered pre-filled with the decoded vehicle values"); re-test of AP2477_007 |
| **Route** | `/quote/new/edit-vehicle` — Create a quote (Passenger) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-07, Dev (v2dev) |
| **Result** | PASS — build check row 1 (fix present); decode 200, form re-rendered Ford/Focus/2008, no quote saved (top still 6599) |

**Why this matters:** This is the exact failing scenario of AP-2507. On the broken build one
click saved quote #6437 without a name and left the form card empty, so the dealer never saw
the decoded values and never pressed Save. The pass condition is twofold: the form comes back
filled, **and** no quote exists that the dealer did not save.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `1FAHP35NX8W239204` |
| Quote name | left empty (as in the bug's steps to reproduce) |
| Expected decode | Brand Ford · Model Focus · Year 2008 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes`; write down the id of the top row as the **baseline** (an id only — do not open it). Click **"Create a quote"**. Hard-reload `/quote/new/edit-vehicle` (type "Passenger"), open the page source, then open every script listed in it (the `vinlookup` one first if it exists, then the bundles) and search each for `novalidate`. Record the file name and the line found. Apply the **build-check table** in the Execution Context. **Do not click "Décoder" in this step.** | The quotes list loads and the baseline id is recorded. The "Create a quote" form shows Quote name, VIN with a **"Décoder"** button, Brand and Model on "Choose", and Year. The file name and the novalidate line are recorded word for word (or "no script contains novalidate"); by table row 1 the run continues (row 2 → this case and AP2507_002–003 are BLOCKED, stop here; rows 3–4 → the fallback in row 4). |
| 2 | Reload `/quote/new/edit-vehicle` (type "Passenger"). Leave **Quote name** empty and **Brand** on "Choose", type `1FAHP35NX8W239204` in **VIN**, click **"Décoder"** once, and wait for the form to re-render. Save the request line of the decoder post (method, URL, status, and the name of the novalidate field in its body — no cookies or tokens) to a `.txt` next to the screenshots. | The browser stays on `/quote/new/edit-vehicle`; no error page appears. The decoder post `POST /quote/new/edit-vehicle` answers **200**, not a 302 redirect. Record the novalidate field name in its body; it settles the discrepancy note — record-only, no verdict. |
| 3 | [Verification] Read VIN, Brand, Model and Year, and list every visible field of the form. | VIN still holds `1FAHP35NX8W239204`; Brand shows **Ford**, Model **Focus**, Year **2008**. The form card still shows only Quote name, VIN, Brand, Model and Year, with the **"Save"** button — it is not empty, and no "Vehicle saved" banner appears. |
| 4 | [Verification] Without clicking "Save", open `/quotes` and read the top row. | The top row is still the **baseline** id from step 1: the decode saved no quote. (If rows above the baseline exist, read each: only a quote with an id above the baseline, VIN `1FAHP35NX8W239204` and no quote name counts against this case; a creation time, if shown, is record-only.) Such a quote is a FAIL (record its id and its vehicle id under Leaves behind). |

---

### AP2507_002 — A quote saved by the dealer after decoding keeps the decoded vehicle details on its vehicle

| Field | Value |
|---|---|
| **TC ID** | AP2507_002 |
| **Title** | A quote saved by the dealer after decoding keeps the decoded vehicle details on its vehicle |
| **Requirement** | AP2507 — Expected result ("A quote is created only when the dealer clicks **Save**"); AP-2477 REQ-003 (decode "keeps the hidden details for saving") — **record-only here**; regression neighbour of AP2477_008, which AP-2507 blocked |
| **Route** | `/quote/new/edit-vehicle` → `/quote/{id}/details` → `/vehicle/{vehicleId}/edit` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (run only after AP2507_001 step 1 found the fix present, or took the row-4 fallback; if AP2507_001 is BLOCKED by the build check, this case is BLOCKED with the same reason). If AP2507_001 FAILs because the decode saved a quote, mark AP2507_002 and AP2507_003 BLOCKED — "decode still saves the quote (AP2507_001 FAIL)"; do not click Décoder again. |
| **Pass condition** | The decode saves nothing (form re-rendered, no "Vehicle saved"); the dealer's Save creates exactly one quote named `QA-AP2507-002-<HHMMSS>`; its vehicle is a new Ford Focus 2008 with VIN `1FAHP35NX8W239204` (not 915, not 1067). Step 4 is record-only and does not decide the result. |
| **Executed on** | 2026-11-07, Dev (v2dev) |
| **Result** | PASS — one new quote 6600 "QA-AP2507-002-105955", new vehicle 1155 Ford Focus 2008; step 4 record-only |

**Why this matters:** The fix changes what the decoder posts. The save path that follows —
the dealer's own **Save** after a re-render — never ran on 2026-11-01, because the decode
saved the quote itself. Fuel type, transmission and engine feed warranty eligibility and
pricing; if the re-rendered form drops them, quotes silently lose them. The 2026-11-01
observation (only `transmission` and `engineSizeUnit` rendered as hidden inputs) means a
blank fuel type here is a real risk — but AP-2507 files that observation with "no verdict",
and judging it belongs to AP2477_008 and AP-2533. Step 4 therefore only records the values
for those tickets; it never decides this case.

**Test Data:**

| Variable | Value |
|---|---|
| VIN | `1FAHP35NX8W239204` |
| Quote name | `QA-AP2507-002-<HHMMSS>` (typed **after** decoding) |
| Reference decode (same VIN, Dev, 2026-11-01, vehicle 1067 — read from the log, never re-opened) | Fuel GASOLINE · Transmission Automatic · Cylinders 4 · Engine size 2 L · Turbo off |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer, open `/quotes` → **"Create a quote"** (type "Passenger"). Type `1FAHP35NX8W239204` in **VIN**, leave Brand on "Choose", click **"Décoder"** and wait for the re-render. Read the page source and note every hidden `quote_vehicle[...]` input with its value. | Brand Ford, Model Focus, Year 2008 are filled and no quote is saved. The hidden inputs and their values are recorded (record-only — the list may be short). |
| 2 | Type `QA-AP2507-002-<HHMMSS>` in **Quote name** and click **"Save"**. Then open `/quotes` and find the rows above the baseline (the top-row id read before this case, an id only). | `/quote/{id}/details` opens with the banner "Vehicle saved" and no error page. Record the quote id. Exactly one new quote named `QA-AP2507-002-<HHMMSS>` exists, and no unnamed quote for VIN `1FAHP35NX8W239204` was added by the decode. |
| 3 | From the quote details page open the quote's vehicle and then its edit form `/vehicle/{vehicleId}/edit`; record the vehicle id. Open it read-only — do not save. | The vehicle edit form opens for a Ford Focus 2008 with VIN `1FAHP35NX8W239204`; the vehicle id is new (not 915, not 1067). |
| 4 | [Record-only] Read Fuel type, Transmission, Engine size and its unit, Cylinders and Turbo on that form. | Each value is recorded beside the hidden value from step 1 and the reference decode (GASOLINE, Automatic, 2 L, 4, turbo off). Any blank or differing value is noted as "for AP-2477 (AP2477_008) / AP-2533, not judged here". No verdict — this step never makes the case FAIL. |

---

### AP2507_003 — A quote name typed before clicking "Décoder" survives the decode and is saved with the quote

| Field | Value |
|---|---|
| **TC ID** | AP2507_003 |
| **Title** | A quote name typed before clicking "Décoder" survives the decode and is saved with the quote |
| **Requirement** | AP2507 — Expected result (the dealer can add a quote name and press Save after the decode) and the developer's fix note (Minh Lưu, 2026-11-03: AP-2533 posts `formName + "[novalidate]"` "plus quote_name and the token"); regression neighbour of AP2477_009, which AP-2507 blocked |
| **Route** | `/quote/new/edit-vehicle` → `/quote/{id}/details` |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (run only after AP2507_001 step 1 found the fix present, or took the row-4 fallback; if AP2507_001 is BLOCKED by the build check, this case is BLOCKED with the same reason). If AP2507_001 FAILs because the decode saved a quote, mark AP2507_002 and AP2507_003 BLOCKED — "decode still saves the quote (AP2507_001 FAIL)"; do not click Décoder again. |
| **Executed on** | 2026-11-07, Dev (v2dev) |
| **Result** | PASS — name kept across the decode; quote 6601 / vehicle 1156 saved with it |

**Why this matters:** Quote name now sits at the top of the form, so dealers type it first.
The decoder replaces the whole form, and the fix explicitly adds the quote name to the
decoder post so it is not lost. On the broken build the decode saved a quote with no name.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2507-003-<HHMMSS>` (typed **before** decoding) |
| VIN | `1FAHP35NX8W239204` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"** (type "Passenger"). | The "Create a quote" form shows Quote name, VIN with **"Décoder"**, Brand, Model and Year. |
| 2 | Type `QA-AP2507-003-<HHMMSS>` in **Quote name**, then `1FAHP35NX8W239204` in **VIN**, leave Brand on "Choose", click **"Décoder"** and wait for the re-render. | The browser stays on `/quote/new/edit-vehicle`; Brand Ford, Model Focus, Year 2008 are filled; no "Vehicle saved" banner. |
| 3 | Read the **Quote name** field, then click **"Save"**. | Quote name still holds `QA-AP2507-003-<HHMMSS>`. `/quote/{id}/details` opens with "Vehicle saved"; record the quote id and its vehicle id. |
| 4 | [Verification] Read the quote name on the quote details page, then open `/quotes` and find the row with the id recorded in step 3. | Both show `QA-AP2507-003-<HHMMSS>`. An empty Quote name after decoding, or the quote saved without that name, is a FAIL. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| AP-2507 Expected result — "Décoder" re-renders the form pre-filled (Ford / Focus / 2008), only five fields | AP2507_001 | — | — | — |
| AP-2507 Expected result — nothing is saved until the dealer clicks Save | AP2507_001 (step 4) | — | — | AP2507_002, AP2507_003 |
| AP-2477 REQ-003 — decoded hidden details kept after the dealer's Save (**record-only** — judged by AP2477_008 / AP-2533, not here) | — | — | — | AP2507_002 (step 4, record-only) |
| AP-2477 REQ-007 — Quote name kept across a decode | — | — | — | AP2507_003 |
| Build check — the AP-2533 fix is on Dev before any decode click | AP2507_001 (step 1) | — | — | — |

---

## Revisions

| Date | Change | By |
|---|---|---|
| 2026-11-07T09:53:34Z | R2 round 1 rework (qa-artifacts/7-reviews/AP-2507_review.md). F-1: AP2507_002 step 4 record-only, new pass condition (decode saves nothing; Save creates exactly one `QA-AP2507-002-<HHMMSS>` quote; new Ford Focus 2008 vehicle, VIN `1FAHP35NX8W239204`, not 915 / 1067), step 2 checks exactly one new quote; Coverage Matrix row "AP-2477 REQ-003" record-only. F-2: step 1 searches every page script for `novalidate` and records file and line; new table row 3 (readable but unrecognised key, or no `novalidate`) → fallback row 4. F-3: step 2 pass condition is 200 not 302; novalidate field name record-only. F-4: AP-2533 "develop" deployment of 2026-11-04 added as context (mapping to v2dev unverified). F-5: offending quote identified by id above baseline, VIN, no name; time record-only. F-6: AP2507_002 / 003 BLOCKED if AP2507_001 FAILs on a saved quote. | QA Agent — Test Case Designer Skill (rework of qa-reviewer R2 round 1 findings) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2507_001 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_001-step4-QuotesTopStill6599NoDecodeQuote_pass.png` |
| AP2507_002 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_002-step4-Vehicle1155EditFordFocus2008_pass.png` |
| AP2507_003 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2507/AP2507_003-step4-QuotesList6601Named_pass.png` |

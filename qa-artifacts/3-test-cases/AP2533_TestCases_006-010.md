# Test Cases — AP2533 (File 2 of 3)

**Project:** Avantage Plus v2 — Dealer portal, "Create a quote" form `/quote/new/edit-vehicle`
**Requirement:** AP2533 — Update quote form UI: "Décoder" fills the form and does not create the quote; "Vehicle type" drop-down before the Quote name
**Source:** requirements/AP-2533-update-quote-form-ui.md · qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2533_test-plan.md
**Date:** 2026-11-07
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2533_006 to AP2533_010 (5 test cases) · **Set total:** 11 test cases, AP2533_001–AP2533_011, in 3 files
**Coverage:** Edge-case · Functional · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` → **"Create a quote"** (`href="/quote"`) → `/quote` 302 → `/quote/new/edit-vehicle`, heading "Create a quote". Before AP-2533 each vehicle type had its own URL `/quote/new/edit-vehicle/{TYPE}` (23 types, e.g. `/quote/new/edit-vehicle/RV_CLASS_A`). Quote search: `/quotes?quote_search[keyword]=<text>` (partial, case-insensitive; empty result "No entities found"). | `navigation` → `domain` (quote-creation.md, "On Dev (v2dev) — mapped 2026-11-01" and "`/quotes` after AP-2494, mapped 2026-11-02") |
| **Viewport** | 1280 × 800 | `navigation` (tool registry `admin_viewport`) |
| **Environment** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca` (`execution_env: Dev` in the tool registry) | `env` |
| **Login** | Dealer — `DEALER_USERNAME` / `DEALER_PASSWORD` from the "Dev Environment" section of the `env` source, at `/login` (Dealer ID 1380, "Test QA staging"). Never copy them into this file. | `env` |
| **Form fields (Dev, mapped 2026-11-01 — before AP-2533)** | Quote name `#quote_vehicle_quote_name`, VIN `#quote_vehicle_VIN` (class `vinlookup`) with **"Décoder"** (car types only), Brand `#vehicle_make`, Model `#vehicle_model`, Year `#vehicle_year`, **"Save"**. Hidden: `quote_vehicle[transmission]` = automatic, `quote_vehicle[engineSizeUnit]` = l. Brand and Model are Bootstrap-select widgets (choosing a Brand reloads the Model list by AJAX — wait about a second). Type menu: a button at the top right of the page ("Passenger" / "Auto Passenger"). A Save with Brand, Model or Year empty came back 200 with "This value should not be blank." under the field. AP-2533 may have changed ids and labels (Q-008) — locate fields by their visible label when an id is missing, and record the difference. | `domain` (quote-creation.md) |
| **Form fields (Dev, 2026-11-07 — context, from quote-creation.md)** | Mapped during the AP-2477 re-test on 2026-11-07 (AP-2533 in QC); for the current Dev build it supersedes the type-button and "Décoder saves the quote" parts of the 2026-11-01 row. The vehicle type is a labelled select **"Vehicle type"** `#vehicle_type_switch` (no `name`, not submitted) at the top of the form card, **above Quote name**; choosing a type navigates to `/quote/new/edit-vehicle/{TYPE}` (same 23 types). "Décoder" posts by AJAX (`POST /quote/new/edit-vehicle` → **200**, body = quote name, VIN, token, `quote_vehicle[novalidate]=true`) and re-renders the form in place, pre-filled, keeping a typed Quote name. After a decode the form carries hidden `transmission`, `cylinders`, `engineSize`, `engineSizeUnit`, `fuelType` and `id` (prefix `quote_vehicle[...]`); `id` held the id of an existing inventory vehicle with the decoded VIN (863 for `1FAHP35NX8W239204`), and Save still created a new vehicle. **Context only** — no expected result is taken from this row; AP2533_001 (build check) and AP2533_010 (field map) re-check the live form. | `domain` (quote-creation.md, "Dev, 2026-11-07" bullet) |
| **Test data** | VIN **`5YJ3E1EA0LF734293`** (2020 TESLA Model 3, `test-data`) — used only by AP2533_006. Hand-chosen values for AP2533_006: Brand **Ford**, Model **Focus**, Year **2008**. Each case types its own quote name `QA-AP2533-<NNN>-<HHMMSS>` and finds any quote by that name — **never by "newest row"**. **Never open, edit or reuse quote 6437, vehicle 1067 or vehicle 915**, and do not decode AP-2507's VIN `1FAHP35NX8W239204`. | `test-data`, `domain` |
| **Language** | English dealer UI on Dev ("Décoder" stays French). AP2533_009 switches the session to French with `?_locale=fr` and back with `?_locale=en` inside the same case. | `domain` |
| **Leaves behind** | Nothing on a fixed build: no case in this file clicks **"Save"** on a valid form. AP2533_010 clicks "Save" on a form missing Brand/Model/Year, which must be refused; if it saves, record the quote id. | `cleanup` (missing) |

**Build check.** In this file only AP2533_006 clicks "Décoder" (AP2533_011, in
`AP2533_TestCases_011-011.md`, does too). It cites the build-check result recorded
in AP2533_001 step 1 (file `AP2533_TestCases_001-005.md`, table rows 1–3 — row 3 also accepts
AP2477_007 of `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-07.md`,
decode → 200 and no quote saved, as evidence for row 1) and the stop rule
from that file: if the fix is absent, or an earlier decode saved a quote, AP2533_006 is
**BLOCKED** ("fixed build not deployed on Dev" or "decode saves a quote (see AP2533_00N)") and
"Décoder" is not clicked. AP2533_007–010 never click "Décoder" and run whatever the build
check found.

**Run order:** AP2533_006 → AP2533_011 (`AP2533_TestCases_011-011.md`) → AP2533_007 → 008 → 009 → 010.

**Known blockers:** None in this file. Q-004, Q-006, Q-007, Q-008 and Q-009 are Judgement
questions: the parts of these cases that depend on them are record-only.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | Execution Context: added the "Form fields (Dev, 2026-11-07 — context)" row from quote-creation.md; the build-check note now names row 3's AP-2477 fallback (AP2477_007, 2026-11-07); run order (AP2533_011 between 006 and 007) and set total (11 cases, 3 files) added | R2 round 1 F-5; Gate B rule B2 promoted AP2533_011 | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |
| 2026-11-07 | Before Wave 2 execution (11:06Z): every case's status reset to Not Run (AP2533_002 stays BLOCKED by Q-002, design time); no step or expected result changed | Orchestrator hand-off for execute --until correct-cases, Gate B approved by R2 round 2 | qa-reviewer (R2 round 2), qa-artifacts/7-reviews/AP-2533_review.md |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2533_006 | Decoding the Tesla VIN after choosing Ford, Focus and 2008 by hand keeps the form and creates no quote | Edge-case | Medium | PASS |
| AP2533_007 | The "Create a quote" form shows a drop-down labelled "Vehicle type" placed before the Quote name | Functional | High | PASS |
| AP2533_008 | Changing the vehicle type in the drop-down reloads the form without error and keeps "Vehicle type" before Quote name | Functional | Medium | PASS |
| AP2533_009 | In the French interface the vehicle-type drop-down still sits before the quote name field | UI | Medium | PASS |
| AP2533_010 | Saving the updated form with Brand, Model and Year empty is refused and creates no quote | Regression | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2533_006 — Decoding the Tesla VIN after choosing Ford, Focus and 2008 by hand keeps the form and creates no quote

| Field | Value |
|---|---|
| **TC ID** | AP2533_006 |
| **Title** | Decoding the Tesla VIN after choosing Ford, Focus and 2008 by hand keeps the form and creates no quote |
| **Requirement** | AP2533 — REQ-001 AC 1 (edge case; Q-004 Judgement — which values the form should show when the dealer already chose some is not stated, so they are record-only); REQ-002 AC 1 ("does not create the quote") |
| **Route** | `/quote/new/edit-vehicle` — Create a quote (default car type); `/quotes` keyword search |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (BLOCKED — "fixed build not deployed on Dev" if AP2533_001's build check failed, or under the stop rule) |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — form kept, decoded values won (Q-004), no quote — execution-log_AP-2533_2026-11-07.md |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | Step 4 expected result: cites REQ-001 AC 1 ("the form with the vehicle information") as the source that makes an empty or placeholder Brand, Model or Year a fault; which value wins stays record-only for Q-004 | R2 round 1 F-2 — the fault had no cited source | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |

**Why this matters:** A dealer often starts choosing the vehicle by hand, then remembers the
VIN and clicks "Décoder". The ticket does not say which values should win (Q-004), so this case
records them. It fails only on objective faults: an error page, the empty card, the typed Quote
name lost, a Brand/Model/Year value that neither the dealer chose nor the decoder could have
produced, or a quote created.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2533-006-<HHMMSS>` (UTC time when typed) |
| Hand-chosen vehicle | Brand Ford · Model Focus · Year 2008 |
| VIN | `5YJ3E1EA0LF734293` (decodes to TESLA · Model 3 · 2020) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"**. Cite AP2533_001's build-check result and the stop rule of the same day. | The form is shown with **"Décoder"**. The build check is at row 1 and the stop rule has not fired; otherwise this case is BLOCKED naming the reason. |
| 2 | Type `QA-AP2533-006-<HHMMSS>` in **Quote name**. Choose **Ford** in **Brand**, wait about a second, choose **Focus** in **Model**, and type or choose **2008** in **Year**. | The form shows Brand Ford, Model Focus, Year 2008. (If Ford or Focus is not in the list, record it and choose the first Brand and Model offered; note the values used.) |
| 3 | Type `5YJ3E1EA0LF734293` in **VIN**, click **"Décoder"** once and wait for the form to re-render. | No error page; the browser stays on `/quote/new/edit-vehicle`; the form card is not empty; Quote name still reads `QA-AP2533-006-<HHMMSS>`. |
| 4 | Read Brand, Model and Year; then, without clicking **"Save"**, open `/quotes?quote_search[keyword]=QA-AP2533-006`. | Each of Brand, Model and Year is either the hand-chosen value (Ford / Focus / 2008) or the decoded value (TESLA / Model 3 / 2020) — which one is recorded for Q-004, record-only. Any other value is a fault. A Brand, Model or Year left empty or on its placeholder after the decode is a fault against REQ-001 AC 1 ("the form with the vehicle information"); which of the two values wins stays record-only for Q-004. |
| 5 | [Verification] Read the search result. | **"No entities found"**: the decode created no quote. A quote named `QA-AP2533-006-…` is a FAIL — record its id under Leaves behind and apply the stop rule. |

---

### AP2533_007 — The "Create a quote" form shows a drop-down labelled "Vehicle type" placed before the Quote name

| Field | Value |
|---|---|
| **TC ID** | AP2533_007 |
| **Title** | The "Create a quote" form shows a drop-down labelled "Vehicle type" placed before the Quote name |
| **Requirement** | AP2533 — REQ-003 AC 1: "Given the dealer is create a new quote, When the form is rendering, Then the type drop-down is positioned before the quote name with the label “Vehicle type”."; REQ-003 AC 2 (screenshot image-20261102-192534.png — arrow from the top-right type menu to the "Quote name" label). Q-007 (default type) recorded |
| **Route** | `/quote/new/edit-vehicle` — Create a quote |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** The vehicle type decides which programs a quote can carry. Tucked away
at the top right, it is easy to miss, and a dealer can quote a motorhome as a passenger car.
The ticket moves it into the form, before the Quote name, so the dealer sets it first. "Before"
is judged two ways — the control comes earlier in the page's structure, and it is shown above
the Quote name (or to its left on the same row) — because either reading alone could pass a
layout that the screenshot does not show.

**Test Data:**

| Variable | Value |
|---|---|
| Expected label | `Vehicle type` (English, exact) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer, open `/quotes` and click **"Create a quote"**. | The "Create a quote" form loads at `/quote/new/edit-vehicle` (or a type-specific variant of it — record the URL). |
| 2 | Find the vehicle-type control: read its label text, the kind of control (a `<select>`, a button menu, or links), the value it shows by default, and the number of types it offers. Record whether the old type button at the top right of the page is still present. | Label, control kind, default value and type count are recorded (default and kind for Q-007; the old top-right button, if still there, for Q-008) — record-only. |
| 3 | Read the position of the vehicle-type control and of the Quote name field: their order in the page structure (which comes first) and their on-screen boxes (top and left in pixels). | Positions are recorded in the execution log. |
| 4 | [Verification] Compare label and position with the criterion and take a screenshot of the form card. | The control's label reads exactly **"Vehicle type"**. The control comes **before** the Quote name field in the page structure **and** is shown above the Quote name field (or on the same row, to its left). A different label, or the control after or below the Quote name, is a FAIL. |

---

### AP2533_008 — Changing the vehicle type in the drop-down reloads the form without error and keeps "Vehicle type" before Quote name

| Field | Value |
|---|---|
| **TC ID** | AP2533_008 |
| **Title** | Changing the vehicle type in the drop-down reloads the form without error and keeps "Vehicle type" before Quote name |
| **Requirement** | AP2533 — REQ-003 AC 1 (the position and label hold on every type's form); Q-007 (Judgement — whether typed values survive a type change and how the change works) and Q-006 (Judgement — "Décoder" per type) recorded |
| **Route** | `/quote/new/edit-vehicle` and the form of a non-car type |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** Moving the type into the form could break the switch between types —
before AP-2533 each type loaded its own URL. A dealer who changes the type and lands on an error
page or a form without the type control cannot quote that vehicle. Whether a typed Quote name
survives the change is not stated (Q-007), so it is recorded, not judged. Nothing is saved.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2533-008-<HHMMSS>` (typed, never saved) |
| Second type | **RV Class A** (`RV_CLASS_A`, a non-car type on Dev on 2026-11-01); if absent, the first non-car type offered — record which |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer, open `/quotes` → **"Create a quote"**, and record the default type shown in **"Vehicle type"** and whether **"Décoder"** is shown. | The form loads; the default type and the "Décoder" presence are recorded. |
| 2 | Type `QA-AP2533-008-<HHMMSS>` in **Quote name**. In **"Vehicle type"** choose **RV Class A**. | No error page and no HTTP 5xx. Record the URL after the change, whether the page reloaded, and whether Quote name still holds the typed value (Q-007, record-only). |
| 3 | On the RV Class A form, read the "Vehicle type" control (label, shown value, position relative to the Quote name field as in AP2533_007 step 3) and record whether **"Décoder"** is shown (Q-006, record-only). | The values are recorded. |
| 4 | In **"Vehicle type"** choose the default type recorded in step 1. | No error page; the form for that type is shown. |
| 5 | [Verification] Check the forms seen in steps 3 and 4. | On both forms the form card is shown (not empty), the control reads **"Vehicle type"**, shows the type just chosen, and sits before the Quote name field as in AP2533_007. An error page, an empty form, or a missing or misplaced "Vehicle type" control on either type is a FAIL. |

---

### AP2533_009 — In the French interface the vehicle-type drop-down still sits before the quote name field

| Field | Value |
|---|---|
| **TC ID** | AP2533_009 |
| **Title** | In the French interface the vehicle-type drop-down still sits before the quote name field |
| **Requirement** | AP2533 — REQ-003 AC 1 (position, both languages); Q-009 (Judgement — the French label is not given, so it is record-only) |
| **Route** | `/quote/new/edit-vehicle?_locale=fr` — Créer une cotation |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** Many dealers work in French. A layout that places the control correctly
in English but not in French (separate templates or translation keys) would leave half the
dealers with the old layout. The French label itself is not stated by the ticket and is only
recorded. The case switches the shared account's language and must switch it back.

**Test Data:**

| Variable | Value |
|---|---|
| Language switch | `?_locale=fr`, then back `?_locale=en` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quote/new/edit-vehicle`. Record the interface language shown (English expected) — this is the value to restore. | The form loads; the original language is recorded. |
| 2 | Open `/quote/new/edit-vehicle?_locale=fr`. Read the vehicle-type control's label, the quote-name field's label, and the position of both (order in the page structure and on-screen boxes, as in AP2533_007 step 3). | The French form loads with no error page. The French label of the type control and of the quote-name field are recorded word for word for Q-009 — record-only. |
| 3 | Open `/quote/new/edit-vehicle?_locale=en` to restore the English interface. | The form shows English labels again ("Create a quote", "Quote name"). |
| 4 | [Verification] Compare the French positions from step 2 and check the restored language. | In French the vehicle-type control comes before the quote-name field in the page structure and is shown above it (or on the same row, to its left). The interface is back in the language recorded in step 1. A misplaced control in French is a FAIL; a language not restored is fixed at once and noted in the log. |

---

### AP2533_010 — Saving the updated form with Brand, Model and Year empty is refused and creates no quote

| Field | Value |
|---|---|
| **TC ID** | AP2533_010 |
| **Title** | Saving the updated form with Brand, Model and Year empty is refused and creates no quote |
| **Requirement** | AP2533 — description "Update the create quote form UI" (regression of the form's required-field check, AP-2477 behaviour mapped on Dev 2026-11-01); Q-008 (Judgement — other element changes) recorded |
| **Route** | `/quote/new/edit-vehicle` — Create a quote; `/quotes` keyword search |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** A UI rework can quietly drop a field's name or its validation. If the
updated form saves with no Brand, Model or Year, dealers get quotes with no vehicle that no
warranty can price. The step-2 field map also answers, with evidence, whether anything beyond
the drop-down changed (Q-008) — for example the 17 dealer automation specs reported failing on
2026-11-05 (not verified). Differences are recorded, not failed, unless the form stops working.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2533-010-<HHMMSS>` (UTC time when typed) |
| VIN, Brand, Model, Year | left empty |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"**. | The "Create a quote" form loads. |
| 2 | Without clicking anything, list every visible field and button of the form with its label and id, and every hidden input's name (a CSRF token by name only). Compare the list with the 2026-11-01 map in the Execution Context. | The map is recorded; each difference (renamed, moved, added or removed element) is listed for Q-008 — record-only. |
| 3 | Type `QA-AP2533-010-<HHMMSS>` in **Quote name**, leave VIN, Brand, Model and Year empty, and click **"Save"** once. | The browser stays on the "Create a quote" form (no redirect to `/quote/{id}/details`, no "Vehicle saved" banner, no error page). A message appears under each of Brand, Model and Year; its wording is recorded and compared with "This value should not be blank." (2026-11-01). |
| 4 | Open `/quotes?quote_search[keyword]=QA-AP2533-010`. | The search page loads. |
| 5 | [Verification] Read the search result and the step-3 outcome. | **"No entities found"** and the form refused the Save with a message on each empty required field. A saved quote (a row named `QA-AP2533-010-…`) or a Save accepted without a message is a FAIL — record the quote id under Leaves behind. |

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
| AP2533_006 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_006-step5-NameSearchNoEntities_pass.png` |
| AP2533_007 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_007-step4-VehicleTypeBeforeQuoteName_pass.png` |
| AP2533_008 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_008-step5-BackToPassengerForm_pass.png` |
| AP2533_009 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_009-step4-EnglishRestored_pass.png` |
| AP2533_010 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_010-step5-NameSearchNoEntities_pass.png` |

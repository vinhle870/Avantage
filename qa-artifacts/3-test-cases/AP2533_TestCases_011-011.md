# Test Cases — AP2533 (File 3 of 3)

**Project:** Avantage Plus v2 — Dealer portal, "Create a quote" form `/quote/new/edit-vehicle`
**Requirement:** AP2533 — Update quote form UI: "Décoder" fills the form and does not create the quote; "Vehicle type" drop-down before the Quote name
**Source:** requirements/AP-2533-update-quote-form-ui.md · qa-artifacts/1-requirements-analysis/AP-2533_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2533_test-plan.md · qa-artifacts/3-test-cases/AP2533_ReviewFindings_2026-11-07.md (Pass 2 proposal 1) · qa-artifacts/7-reviews/AP-2533_review.md (R2 round 1, Gate B rule B2)
**Date:** 2026-11-07
**Designed by:** QA Agent — Test Case Designer Skill (case wording from the R2 round 1 review record)
**TC Range:** AP2533_011 to AP2533_011 (1 test case) · **Set total:** 11 test cases, AP2533_001–AP2533_011, in 3 files
**Coverage:** Functional

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/quotes` → **"Create a quote"** (`href="/quote"`) → `/quote` 302 → `/quote/new/edit-vehicle`, heading "Create a quote". Each vehicle type has its own URL `/quote/new/edit-vehicle/{TYPE}` (23 types, e.g. `/quote/new/edit-vehicle/RV_CLASS_A`). Quote search: `/quotes?quote_search[keyword]=<text>` (partial, case-insensitive; empty result "No entities found"). | `navigation` → `domain` (quote-creation.md, "On Dev (v2dev) — mapped 2026-11-01" and "`/quotes` after AP-2494, mapped 2026-11-02") |
| **Viewport** | 1280 × 800 | `navigation` (tool registry `admin_viewport`) |
| **Environment** | Dev (v2dev) — `https://v2dev.garantieavantageplus.ca` (`execution_env: Dev` in the tool registry) | `env` |
| **Login** | Dealer — `DEALER_USERNAME` / `DEALER_PASSWORD` from the "Dev Environment" section of the `env` source, at `/login` (Dealer ID 1380, "Test QA staging"). Never copy them into this file. | `env` |
| **Form fields (Dev, mapped 2026-11-01 — before AP-2533)** | Quote name `#quote_vehicle_quote_name`, VIN `#quote_vehicle_VIN` (class `vinlookup`) with **"Décoder"** (car types only), Brand `#vehicle_make`, Model `#vehicle_model`, Year `#vehicle_year`, **"Save"**. Hidden: `quote_vehicle[transmission]` = automatic, `quote_vehicle[engineSizeUnit]` = l. Brand and Model are Bootstrap-select widgets (choosing a Brand reloads the Model list by AJAX — wait about a second). Type menu: a button at the top right of the page ("Passenger" / "Auto Passenger"). AP-2533 may have changed ids and labels (Q-008) — locate fields by their visible label when an id is missing, and record the difference. | `domain` (quote-creation.md) |
| **Form fields (Dev, 2026-11-07 — context, from quote-creation.md)** | Mapped during the AP-2477 re-test on 2026-11-07 (AP-2533 in QC); for the current Dev build it supersedes the type-button and "Décoder saves the quote" parts of the 2026-11-01 row. The vehicle type is a labelled select **"Vehicle type"** `#vehicle_type_switch` (no `name`, not submitted) at the top of the form card, **above Quote name**; choosing a type navigates to `/quote/new/edit-vehicle/{TYPE}` (same 23 types). "Décoder" posts by AJAX (`POST /quote/new/edit-vehicle` → **200**, body = quote name, VIN, token, `quote_vehicle[novalidate]=true`) and re-renders the form in place, pre-filled, keeping a typed Quote name. After a decode the form carries hidden `transmission`, `cylinders`, `engineSize`, `engineSizeUnit`, `fuelType` and `id` (prefix `quote_vehicle[...]`); `id` held the id of an existing inventory vehicle with the decoded VIN (863 for `1FAHP35NX8W239204`), and Save still created a new vehicle. **Context only** — no expected result is taken from this row; AP2533_001 (build check) and AP2533_010 (field map) re-check the live form. | `domain` (quote-creation.md, "Dev, 2026-11-07" bullet) |
| **Test data** | VIN **`5YJ3E1EA0LF734293`** (2020 TESLA Model 3, `test-data`). The case types its own quote name `QA-AP2533-011-<HHMMSS>` and finds any quote by that name — **never by "newest row"**. **Never open, edit or reuse quote 6437, vehicle 1067 or vehicle 915**, and do not decode AP-2507's VIN `1FAHP35NX8W239204`. | `test-data`, `domain` |
| **Language** | English dealer UI on Dev ("Décoder" stays French). | `domain` |
| **Leaves behind** | Nothing on a fixed build: the case never clicks **"Save"**. If the decode saves a quote (a FAIL), record that quote's id and vehicle id in the execution log and run summary. | `cleanup` (missing — no teardown is known) |

**Build check.** AP2533_011 clicks "Décoder". It cites the build-check result recorded in
AP2533_001 step 1 (file `AP2533_TestCases_001-005.md`, table rows 1–3 — row 3 also accepts
AP2477_007 of `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2477_2026-11-07.md`,
decode → 200 and no quote saved, as evidence for row 1) and the stop rule from that file: if
the fix is absent, or an earlier decode saved a quote, AP2533_011 is **BLOCKED** ("fixed build
not deployed on Dev" or "decode saves a quote (see AP2533_00N)") and "Décoder" is not clicked.

**Run order:** AP2533_006 → **AP2533_011** → AP2533_007 (run after AP2533_006 and before AP2533_007).

**Known blockers:** None in this file. Q-004 and Q-006 are Judgement questions: the parts of
this case that depend on them are record-only.

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-07 | File created with AP2533_011 (decode on a second car type), wording as in the review record | Gate B rule B2 — Pass 2 proposal 1 (High) promoted; the fix builds the novalidate key from the form's name and each type loads its own form, so the default type passing does not prove another car type's form | qa-reviewer (R2 round 1), qa-artifacts/7-reviews/AP-2533_review.md |
| 2026-11-07 | Before Wave 2 execution (11:06Z): every case's status reset to Not Run (AP2533_002 stays BLOCKED by Q-002, design time); no step or expected result changed | Orchestrator hand-off for execute --until correct-cases, Gate B approved by R2 round 2 | qa-reviewer (R2 round 2), qa-artifacts/7-reviews/AP-2533_review.md |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2533_011 | Decoding the Tesla VIN on a second car type's form keeps the form on screen and creates no quote | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2533_011 — Decoding the Tesla VIN on a second car type's form keeps the form on screen and creates no quote

| Field | Value |
|---|---|
| **TC ID** | AP2533_011 |
| **Title** | Decoding the Tesla VIN on a second car type's form keeps the form on screen and creates no quote |
| **Requirement** | AP2533 — REQ-001 AC 1 / AC 3 (after "Décoder" the form is shown, not the empty card); REQ-002 AC 1 ("does not create the quote"). Q-004 and Q-006 (Judgement) recorded. Related: AP-2507 — this case judges AP-2533 only |
| **Route** | `/quote/new/edit-vehicle/{TYPE}` — a car type other than the default, chosen in "Vehicle type"; `/quotes` keyword search |
| **Type** | Functional (equivalence partitioning — Pass 2 proposal 1, promoted at Gate B rule B2) |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (BLOCKED — "fixed build not deployed on Dev" if AP2533_001's build check failed, or "decode saves a quote (see AP2533_00N)" under the stop rule) |
| **Executed on** | 2026-11-07 (Dev) |
| **Result** | PASS — ATV / UTV form kept, no quote — execution-log_AP-2533_2026-11-07.md |

**Why this matters:** The fix builds the novalidate key from the form's name, and each of the
23 vehicle types loads its own form (`/quote/new/edit-vehicle/{TYPE}`). A pass on the default
type does not prove that another car type's form decodes without saving: if it still saves, a
dealer quoting that type gets an undeletable quote from one "Décoder" click. A FAIL here is
linked to AP-2507 at Gate C — no new bug is filed.

**Test Data:**

| Variable | Value |
|---|---|
| Quote name | `QA-AP2533-011-<HHMMSS>` (UTC time when typed) |
| VIN | `5YJ3E1EA0LF734293` |
| Type | The first type in the "Vehicle type" list order, other than the default type, whose form shows "Décoder" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the dealer and open `/quotes` → **"Create a quote"**. Record the default value of **"Vehicle type"**. Cite AP2533_001's build-check result and the stop rule of the same day. | The form is shown; the default type is recorded. The build check is at row 1 and the stop rule has not fired; otherwise this case is BLOCKED naming the reason. |
| 2 | Without clicking **"Décoder"**, choose each type in **"Vehicle type"** in list order, skipping the default, and on each form read only whether a **"Décoder"** button is shown next to VIN. Stop at the first type that shows it. Record every type checked, the chosen type and its URL. | The types checked and whether each shows "Décoder" are recorded for Q-006 — record-only. If no type other than the default shows "Décoder", the case is **SKIPPED** with the reason "no second car type offers Décoder on Dev" and stops here. |
| 3 | On the chosen type's form, type `QA-AP2533-011-<HHMMSS>` in **Quote name** and `5YJ3E1EA0LF734293` in **VIN**, click **"Décoder"** once and wait for the form to re-render. Save the decoder request line (method, URL, status only) to a `.txt`. | No error page and no HTTP 5xx; the browser stays on the URL recorded in step 2; no redirect to `/quote/{id}/details`. |
| 4 | [Verification] Read the form card: Vehicle type, Quote name, VIN, Brand, Model, Year and the buttons; look for a "Vehicle saved" banner. | The form card is not empty: Vehicle type (still the chosen type), Quote name, VIN, Brand, Model, Year and **"Save"** are shown; VIN still holds `5YJ3E1EA0LF734293`; Quote name still reads `QA-AP2533-011-<HHMMSS>`; no "Vehicle saved" banner. The Brand, Model and Year values are recorded for Q-004 — record-only (TESLA may not be in this type's lists). An empty card or an error page is a FAIL. |
| 5 | [Verification] Without clicking **"Save"**, open `/quotes?quote_search[keyword]=QA-AP2533-011` and read the result. | **"No entities found"**: the decode created no quote. A quote named `QA-AP2533-011-…` is a FAIL — record its id and vehicle id under Leaves behind and apply the stop rule; at Gate C it is linked to AP-2507, no new bug. |

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
| AP2533_011 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2533/AP2533_011-step5-NameSearchNoEntities_pass.png` |

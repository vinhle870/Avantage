# Test Cases — AP2476 (File 2 of 2)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2476 — Make Earning Assignment Parameter fields optional
**Source:** requirements/AP-2476-make-earning-assignment-parameter-fields-optional.md · qa-artifacts/1-requirements-analysis/AP-2476_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2476_test-plan.md
**Date:** 2026-10-11
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2476_006 to AP2476_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` — Earning Assignments list (newest first, 10 per page). Create form `/admin/earning-assignment/new/edit` (modal); details page `/admin/earning-assignment/{id}/details` with nav items **Edit** and **Add Parameter**. Add Parameter opens a modal (`#myModal`, loaded by AJAX — wait for the label "Coverage odometer from"). The pencil icon opens `/admin/earning-assignment/{id}/parameter/{paramId}/edit` in the same modal. A refused submit lands on the **standalone** `/parameter/add` (or `/edit`) page with the other values kept. Navigate by URL. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Read-only reference data: earning set **Profit**, dealer group **Group A**, Coverage Code **AP-CADV - Advanced**, Make **Acura**, Earning Group **AV+**. **Never edit the seeded "AV+" assignment (#1) or its parameter.** | `test-data`, `domain` |
| **Form widgets** | Bootstrap-select widgets over real `<select>` elements (`#earning_assignment_parameter_{field}`); Sale Date from/to are text boxes with a date picker — type `yyyy-mm-dd`. Number fields refuse letters. Submit button **Submit**; no Cancel — Escape closes the modal. | `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | Shared assignment `QA-AP2476-<HHMMSS>` (see file 1) and up to 5 more parameter rows from this file. | `cleanup` (missing) |

**Shared assignment, row identification and value sets F / E** are exactly as in file 1 (`AP2476_TestCases_001-005.md`, Execution Context), repeated here so this file runs on its own:

- *Assignment:* use the `QA-AP2476-…` assignment from this run if it holds fewer than 9 parameters; otherwise create one at `/admin/earning-assignment/new/edit` — Description `QA-AP2476-<HHMMSS>`, Earning Set **Profit**, Dealer Group **Group A**, **Is Enabled?** ticked → **Save**. Keep it at 10 parameters or fewer (AP-2484).
- *Row identification:* Coverage odometer to `1000NN` (NN = case number); AP2476_008 uses Model Year Age to `58`.
- *F values:* Condition **Used** · Coverage Code **AP-CADV - Advanced** · Sale Date **2026-01-01** to **2026-12-31** · odometer **0** to **1000NN** · Model Year Age **0** to **5** · Make **Acura** · Lag Interval **0** · Earning Group **AV+**.
- *E values:* the six optional fields on **All**; odometer **0** to **1000NN**; Model Year Age **0** to **5**; Lag Interval **0**.

**Known blockers:** None at design time.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2476_006 | A parameter with every field filled still saves and lists all eleven values as before | Regression | Medium | PASS |
| AP2476_007 | Leaving Model Year Age from blank is still refused, because only the six listed fields became optional | Negative | Medium | PASS |
| AP2476_008 | Clearing both odometer boxes is either refused cleanly or saved as 0 to 999999, never an error page | Negative | Medium | PASS |
| AP2476_009 | A parameter with only "Sale Date from" filled saves and keeps that date | Edge-case | Low | PASS |
| AP2476_010 | Editing a parameter saved on "All" and choosing real values saves those values | Edge-case | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2476_006 — A parameter with every field filled still saves and lists all eleven values as before

| Field | Value |
|---|---|
| **TC ID** | AP2476_006 |
| **Title** | A parameter with every field filled still saves and lists all eleven values as before |
| **Requirement** | AP2476 — REQ-001 (regression) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Fully filled parameter 25 saved; after reload the row lists Used / AP-CADV - Advanced / 2026-01-01 - 2026-12-31 / 0 - 100006 / 0 - 5 / Acura / 0 / AV+ with pencil and trash icons. |

**Why this matters:** Making fields optional changes how the form handles empty values. A mistake there can drop or blank a value the admin did fill in, which would silently narrow or widen a rule that used to save correctly.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | F values, Coverage odometer to `100006` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | Click **Add Parameter** and fill: Condition "Used", Coverage Code "AP-CADV - Advanced", Sale Date from `2026-01-01`, Sale Date to `2026-12-31`, Coverage odometer from `0`, Coverage odometer to `100006`, Model Year Age from `0`, Model Year Age to `5`, Make "Acura", Lag Interval `0`, Earning Group "AV+" → **Submit**. | The dialog closes; the alert "Parameter added" is shown. |
| 3 | [Verification] Reload the page and read the `0 - 100006` row. | The row lists Condition "Used" · Coverage Code "AP-CADV - Advanced" (or its code) · Sale Date `2026-01-01 - 2026-12-31` · Coverage odometer `0 - 100006` · Model Year Age `0 - 5` · Make "Acura" · Lag Interval `0` · Earning Group "AV+", with the pencil and trash icons in Actions. |

---

### AP2476_007 — Leaving Model Year Age from blank is still refused, because only the six listed fields became optional

| Field | Value |
|---|---|
| **TC ID** | AP2476_007 |
| **Title** | Leaving Model Year Age from blank is still refused, because only the six listed fields became optional |
| **Requirement** | AP2476 — REQ-001 (scope boundary: fields not in the list) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Blank Model Year Age From refused with "This value should not be blank." on the standalone add page; no row added (count stayed 4). |

**Why this matters:** The ticket lists exactly six optional fields. If the change loosened validation on every field, a rule could be saved with no model-year range, and the earning engine would receive a value it was never designed for. Before the change, a blank number was refused with "This value should not be blank."

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | E values, Coverage odometer to `100007`, **Model Year Age from blank** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). Note the number of parameter rows. | The details page is shown. |
| 2 | Click **Add Parameter**, leave the six optional fields on "All", set Coverage odometer from `0`, Coverage odometer to `100007`, **clear Model Year Age from**, set Model Year Age to `5`, Lag Interval `0` → **Submit**. | The save is refused: the message "This value should not be blank." (or similar) appears at Model Year Age from, on the dialog or on the standalone add page. No HTTP 500 / "Erreur" page appears. |
| 3 | [Verification] Open the details page `/admin/earning-assignment/{id}/details` and look for a row with odometer `0 - 100007`. | No `0 - 100007` row exists, and the row count is the same as in step 1. |

---

### AP2476_008 — Clearing both odometer boxes is either refused cleanly or saved as 0 to 999999, never an error page

| Field | Value |
|---|---|
| **TC ID** | AP2476_008 |
| **Title** | Clearing both odometer boxes is either refused cleanly or saved as 0 to 999999, never an error page |
| **Requirement** | AP2476 — REQ-003 (AC 2), REQ-004 (AC 3); Q-007 |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Both odometer boxes blank: refused with "This value should not be blank." under each (Q-007); no error page, no row added. |

**Why this matters:** The ticket gives the odometer fields defaults but does not say whether they may be left blank (Q-007). Either answer is acceptable — a clear refusal, or saving the defaults — but saving a blank odometer or showing an error page would break the rule or the admin's work.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | E values with **Coverage odometer from and to cleared**, Model Year Age to **`58`** (row marker) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). Note the number of parameter rows. | The details page is shown. |
| 2 | Click **Add Parameter**, leave the six optional fields on "All", **clear Coverage odometer from and Coverage odometer to**, set Model Year Age from `0`, Model Year Age to `58`, Lag Interval `0` → **Submit**. | Either the save is refused with a message at the odometer fields such as "This value should not be blank.", or the dialog closes with the alert "Parameter added". No HTTP 500 / "Erreur" page appears. Record which. |
| 3 | [Verification] Open the details page and look for the row with Model Year Age `0 - 58`. | If refused: no `0 - 58` row exists and the row count is unchanged. If saved: the `0 - 58` row shows Coverage odometer `0 - 999999`. A saved row with a blank odometer, or `0 - 9999999`, is a FAIL (the latter goes to Gate C with Q-002). |

---

### AP2476_009 — A parameter with only "Sale Date from" filled saves and keeps that date

| Field | Value |
|---|---|
| **TC ID** | AP2476_009 |
| **Title** | A parameter with only "Sale Date from" filled saves and keeps that date |
| **Requirement** | AP2476 — REQ-001 (AC 1, each field optional on its own); Q-005 |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Sale Date from alone saved (parameter 26); grid shows "2026-01-01 - All"; Edit shows from 2026-01-01 and empty to with hint "All". |

**Why this matters:** The ticket makes Sale Date from and Sale Date to optional one by one, so "from 2026-01-01 with no end" should be a valid open-ended rule. If the form demands both dates together, or drops the one given, admins cannot express "every sale from this date on". The ticket does not say this directly (Q-005), so a clean refusal is recorded for the product owner rather than failed outright.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | E values, Coverage odometer to `100009`, **Sale Date from `2026-01-01`**, Sale Date to empty |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | Click **Add Parameter**, leave Condition, Coverage Code, Make, Earning Group on "All" and Sale Date to empty; type `2026-01-01` in **Sale Date from**; set odometer `0` / `100009`, Model Year Age `0` / `5`, Lag Interval `0` → **Submit**. | The dialog closes with the alert "Parameter added" and no error page. |
| 3 | [Verification] Read the `0 - 100009` row's Sale Date cell, then open its pencil and read Sale Date from and Sale Date to. | The row's Sale Date cell shows `2026-01-01` as the start (for example `2026-01-01 -`). In the Edit dialog, Sale Date from holds `2026-01-01` and Sale Date to is empty with the hint "All". A clean refusal asking for both dates is recorded as an observation for Q-005, not a FAIL; an error page or a lost date is a FAIL. |

---

### AP2476_010 — Editing a parameter saved on "All" and choosing real values saves those values

| Field | Value |
|---|---|
| **TC ID** | AP2476_010 |
| **Title** | Editing a parameter saved on "All" and choosing real values saves those values |
| **Requirement** | AP2476 — REQ-001 (AC 2, editing) |
| **Route** | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` — Edit Parameter modal |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Parameter 27 saved on "All" then edited to real values; "Parameter saved", after reload the row lists every chosen value, row count stayed 6. |

**Why this matters:** Admins will narrow broad rules as well as widen narrow ones. If an empty field cannot be filled in later on Edit (for example the stored empty value overrides the new choice), the rule can only be fixed by deleting and re-creating it.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | E values, Coverage odometer to `100010` |
| Parameter after | Condition "Used", Coverage Code "AP-CADV - Advanced", Sale Date `2026-01-01` to `2026-12-31`, Make "Acura", Earning Group "AV+"; other fields unchanged |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, leave the six optional fields on "All", set odometer `0` / `100010`, Model Year Age `0` / `5`, Lag Interval `0` → **Submit**. | Alert "Parameter added"; a row `0 - 100010` is listed. |
| 3 | Click the pencil on the `0 - 100010` row. Set Condition "Used", Coverage Code "AP-CADV - Advanced", Sale Date from `2026-01-01`, Sale Date to `2026-12-31`, Make "Acura", Earning Group "AV+" → **Submit**. | The dialog closes with the alert "Parameter saved" and no error page. |
| 4 | [Verification] Reload the page and read the `0 - 100010` row. | The row lists Used · AP-CADV - Advanced · `2026-01-01 - 2026-12-31` · `0 - 100010` · `0 - 5` · Acura · `0` · AV+, and the row count is unchanged by the edit. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Six fields optional on Add and Edit | AP2476_003, AP2476_004 (file 1) | AP2476_007 | AP2476_009, AP2476_010 | AP2476_006 |
| REQ-002 — "All" replaces "Choose" | AP2476_001, AP2476_005 (file 1) | — | AP2476_009 (hint on Edit) | — |
| REQ-003 — Odometer from defaults to 0 | AP2476_002 (file 1) | AP2476_008 | — | AP2476_005 (file 1) |
| REQ-004 — Odometer to defaults to 999999 | AP2476_002 (file 1) | AP2476_008 | — | AP2476_005 (file 1) |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2476_006 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_006-step3-FullParamListed_pass.png` |
| AP2476_007 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_007-step3-NoRowAdded_pass.png` |
| AP2476_008 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_008-step3-NoRowAdded_pass.png` |
| AP2476_009 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_009-step3-EditSaleDateFromKept_pass.png` |
| AP2476_010 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_010-step4-EditFilledValuesSaved_pass.png` |

# Test Cases — AP2476 (File 1 of 2)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2476 — Make Earning Assignment Parameter fields optional
**Source:** requirements/AP-2476-make-earning-assignment-parameter-fields-optional.md · qa-artifacts/1-requirements-analysis/AP-2476_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2476_test-plan.md
**Date:** 2026-10-11
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2476_001 to AP2476_005 (5 test cases)
**Coverage:** Functional · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` — Earning Assignments list (newest first, 10 per page). Create form `/admin/earning-assignment/new/edit` (modal); details page `/admin/earning-assignment/{id}/details` with nav items **Edit** and **Add Parameter**. Add Parameter opens a modal (`#myModal`, loaded by AJAX — wait for the label "Coverage odometer from"). The pencil icon in a row's Actions opens `/admin/earning-assignment/{id}/parameter/{paramId}/edit` in the same modal. Navigate by URL — the Risk Management fly-out closes on every page load. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Read-only reference data: earning set **Profit**, dealer group **Group A**, Coverage Code **AP-CADV - Advanced** (first program in the list), Make **Acura** (first make), Earning Group **AV+**. **Never edit the seeded "AV+" assignment (#1) or its parameter.** | `test-data`, `domain` |
| **Form widgets** | Condition, Coverage Code, Make, Lag Interval and Earning Group are Bootstrap-select widgets over real `<select>` elements (`#earning_assignment_parameter_{field}`); read the empty option's text from the real `<select>` and from the visible button. Sale Date from/to are text boxes with a date picker — type `yyyy-mm-dd`; their "placeholder" is the grey hint text shown while the box is empty (HTML `placeholder`). Submit button **Submit**; there is no Cancel — Escape closes the modal. | `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | One earning assignment `QA-AP2476-<HHMMSS>` shared by every case in this run (assignments cannot be deleted). Up to 9 parameter rows on it. They stay on staging as evidence unless unassigned after the run. | `cleanup` (missing) |

**Shared assignment.** Step 1 of each case says: *use the `QA-AP2476-…` assignment created earlier in this run if it exists and holds fewer than 9 parameters; otherwise create one.* Creating it: open `/admin/earning-assignment/new/edit`, enter Description `QA-AP2476-<HHMMSS>` (24-hour time at creation), Earning Set **Profit**, Dealer Group **Group A**, leave **Is Enabled?** ticked → **Save**. The details page "Earning Assignment QA-AP2476-…" opens with the alert "Earning assignment saved". **Keep it at 10 parameters or fewer** — past 10 the details page returns HTTP 500 (known bug AP-2484).

**Telling rows apart.** Every parameter a case saves has its own **Coverage odometer to** value `1000NN`, where `NN` is the case number (AP2476_003 uses `100003`). The one exception is AP2476_008, which tests the odometer defaults and is found by **Model Year Age to** `58` instead.

**Full parameter values (F)**, used wherever a step says "with the F values": Condition **Used** · Coverage Code **AP-CADV - Advanced** · Sale Date from **2026-01-01** · Sale Date to **2026-12-31** · Coverage odometer from **0** · Coverage odometer to **1000NN** · Model Year Age from **0** · Model Year Age to **5** · Make **Acura** · Lag Interval **0** · Earning Group **AV+**.

**Empty parameter values (E)**, used wherever a step says "with the E values": leave Condition, Coverage Code, Sale Date from, Sale Date to, Make and Earning Group on **All** (empty); Coverage odometer from **0** · Coverage odometer to **1000NN** · Model Year Age from **0** · Model Year Age to **5** · Lag Interval **0**.

**Build check.** Before AP2476_001, open Add Parameter once. If Coverage Code still shows **"Choose"** the AP-2476 build is not on staging (Jira shows it deployed to *preprod* on 2026-10-09). Stop the run and record every case **BLOCKED — build not deployed** rather than FAIL.

**Known blockers:** None at design time. Open questions Q-002 (999999 vs 9999999), Q-003 (Condition default) and Q-004 (grid display of an empty field) change only how a result is judged; each affected case says how.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2476_001 | The Add Parameter form shows "All", not "Choose", as the empty choice for all six optional fields | UI | High | PASS |
| AP2476_002 | A new parameter starts with Coverage odometer from 0 and Coverage odometer to 999999 | Functional | High | PASS |
| AP2476_003 | A parameter saves with all six optional fields left on "All" and appears in the parameter list | Functional | High | PASS |
| AP2476_004 | Editing a fully filled parameter and setting the six fields back to "All" saves them as empty | Functional | High | PASS |
| AP2476_005 | Editing a parameter saved with empty fields shows "All" in those fields and keeps its stored odometer | UI | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2476_001 — The Add Parameter form shows "All", not "Choose", as the empty choice for all six optional fields

| Field | Value |
|---|---|
| **TC ID** | AP2476_001 |
| **Title** | The Add Parameter form shows "All", not "Choose", as the empty choice for all six optional fields |
| **Requirement** | AP2476 — REQ-002 (AC 1) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | UI |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | All six optional fields show "All" (Condition now defaults to "All"); no "Choose" anywhere. Coverage Code is now a multi-select whose empty button reads "All"; dialog has 13 fields (new Start date from/To). |

**Why this matters:** "All" is what tells an admin that leaving a field empty is allowed and means "every value". If "Choose" remains, admins will keep filling every field and never create the broad rules this ticket exists for. Condition has no empty choice at all today (it starts on "New"), so it is the field most likely to be missed (Q-003).

**Test Data:**

| Variable | Value |
|---|---|
| None | The form is only opened, not submitted |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to `/admin/login` as the admin. Open the `QA-AP2476-…` assignment from `/admin/earning-assignment` → **View** if it exists in this run; otherwise create it as described in the Execution Context (Description `QA-AP2476-<HHMMSS>`, Earning Set "Profit", Dealer Group "Group A", "Is Enabled?" ticked → **Save**). | The details page opens with the title "Earning Assignment QA-AP2476-…" and the nav items "Edit" and "Add Parameter". |
| 2 | Click **Add Parameter** and wait for the label "Coverage odometer from". | The "Add Parameter" dialog opens with its 11 fields and a **Submit** button. |
| 3 | Open the Condition, Coverage Code, Make and Earning Group drop-down lists one at a time and read their first option, then close each with a click on the dialog title. | Each list has an option labelled "All" as its first, empty choice, and none of them offers "Choose". |
| 4 | [Verification] Read the visible text of the Condition, Coverage Code, Make and Earning Group buttons, and the grey hint text of the empty Sale Date from and Sale Date to boxes. Also note which Condition option is selected and whether the six labels still carry a red `*`. | Coverage Code, Make and Earning Group buttons read "All"; Sale Date from and Sale Date to show the hint "All". Condition shows "All" or, if "New" is still pre-selected, "All" is available in its list (step 3) — record which, for Q-003. The `*` markers are recorded as an observation (Q-006), not judged. |

---

### AP2476_002 — A new parameter starts with Coverage odometer from 0 and Coverage odometer to 999999

| Field | Value |
|---|---|
| **TC ID** | AP2476_002 |
| **Title** | A new parameter starts with Coverage odometer from 0 and Coverage odometer to 999999 |
| **Requirement** | AP2476 — REQ-003 (AC 2), REQ-004 (AC 3) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Fresh Add Parameter dialog: Coverage odometer from = 0, Coverage odometer to = 999999 (six digits), as the ticket asks. |

**Why this matters:** The odometer defaults decide which vehicles a new rule covers when the admin does not change them. Before this ticket the "to" default was 9999999 (seven nines); the ticket asks for 999999 (six nines). If the build differs from the ticket, the user rules at Gate C whether that is a bug or a typo in the ticket (Q-002).

**Test Data:**

| Variable | Value |
|---|---|
| Expected Coverage odometer from | `0` |
| Expected Coverage odometer to | `999999` (six digits) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). | The details page with nav items "Edit" and "Add Parameter" is shown. |
| 2 | Click **Add Parameter** and wait for the label "Coverage odometer from". Do not type in any field. | The "Add Parameter" dialog opens. |
| 3 | [Verification] Read the values of **Coverage odometer from** and **Coverage odometer to** (the `value` of `#earning_assignment_parameter_coverageOdometerFrom` / `…To`), and count the digits of the "to" value. | Coverage odometer from holds `0`. Coverage odometer to holds `999999` — six digits. A value of `9999999` (seven digits) is a FAIL against the ticket as written and is taken to Gate C with Q-002. |

---

### AP2476_003 — A parameter saves with all six optional fields left on "All" and appears in the parameter list

| Field | Value |
|---|---|
| **TC ID** | AP2476_003 |
| **Title** | A parameter saves with all six optional fields left on "All" and appears in the parameter list |
| **Requirement** | AP2476 — REQ-001 (AC 1, adding) |
| **Route** | `/admin/earning-assignment/{id}/details` → Add Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Saved with the six fields on "All" (parameter 22) with no validation error; grid row shows "All" in each empty optional cell and 0 - 100003 / 0 - 5 / 0. |

**Why this matters:** This is the core of the ticket. Before it, a blank Coverage Code or sale date was refused with "This value should not be blank." If the server still refuses, the "All" wording is cosmetic and admins still cannot create a rule that covers every program, make or earning group.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | E values, Coverage odometer to `100003` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). Note the number of parameter rows. | The details page is shown with the parameter list (or "No entities found" if empty). |
| 2 | Click **Add Parameter**. Leave Condition, Coverage Code, Sale Date from, Sale Date to, Make and Earning Group on "All" (if Condition is pre-set to "New", choose "All"). Set Coverage odometer from `0`, Coverage odometer to `100003`, Model Year Age from `0`, Model Year Age to `5`, Lag Interval `0` → **Submit**. | The dialog closes without any "This value should not be blank." message and without an error page. |
| 3 | [Verification] Read the alert and the parameter list. Find the row with Coverage odometer `0 - 100003` and read its Condition, Coverage Code, Sale Date, Make and Earning Group cells. | The green alert "Parameter added" is shown, the row count has grown by one, and the `0 - 100003` row is listed with Model Year Age `0 - 5` and Lag Interval `0`. Its six optional cells show no stale or made-up value (for example no "New", no program name, no `1970-01-01`) — record exactly what they show (blank, "All", or other) for Q-004. |

---

### AP2476_004 — Editing a fully filled parameter and setting the six fields back to "All" saves them as empty

| Field | Value |
|---|---|
| **TC ID** | AP2476_004 |
| **Title** | Editing a fully filled parameter and setting the six fields back to "All" saves them as empty |
| **Requirement** | AP2476 — REQ-001 (AC 2, editing) |
| **Route** | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` — Edit Parameter modal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Parameter 23 edited from full values to "All"/empty; "Parameter saved", row count unchanged, after reload the row shows "All" in all six cells with 0 - 5 and Lag 0 kept. |

**Why this matters:** Most existing rules were saved before this change, with every field filled. Widening one of them means clearing fields on Edit. If the Edit form refuses the blanks, or saves but silently keeps the old values, admins have to delete and re-create the rule to widen it.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | F values, Coverage odometer to `100004` |
| Parameter after | The six optional fields set to "All"; every other field unchanged |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, fill the F values (Condition "Used", Coverage Code "AP-CADV - Advanced", Sale Date from `2026-01-01`, Sale Date to `2026-12-31`, odometer `0` / `100004`, Model Year Age `0` / `5`, Make "Acura", Lag Interval `0`, Earning Group "AV+") → **Submit**. | Alert "Parameter added"; a row `0 - 100004` lists Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · Acura · AV+. |
| 3 | Click the pencil icon on the `0 - 100004` row. In the "Edit Parameter" dialog set Condition, Coverage Code, Make and Earning Group to "All", clear the Sale Date from and Sale Date to boxes → **Submit**. | The dialog closes without a "This value should not be blank." message and without an error page. |
| 4 | [Verification] Read the alert and the `0 - 100004` row, then reload the page and read the row again. | The alert "Parameter saved" is shown; the parameter list still has the same number of rows (no new row added). After the reload, the `0 - 100004` row no longer shows Used, AP-CADV - Advanced, 2026-01-01 - 2026-12-31, Acura or AV+; its Model Year Age `0 - 5` and Lag Interval `0` are unchanged. |

---

### AP2476_005 — Editing a parameter saved with empty fields shows "All" in those fields and keeps its stored odometer

| Field | Value |
|---|---|
| **TC ID** | AP2476_005 |
| **Title** | Editing a parameter saved with empty fields shows "All" in those fields and keeps its stored odometer |
| **Requirement** | AP2476 — REQ-002 (AC 1, editing), REQ-003 / REQ-004 (defaults apply to new rows only) |
| **Route** | `/admin/earning-assignment/{id}/parameter/{paramId}/edit` — Edit Parameter modal |
| **Type** | UI |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-11 — Staging (v2staging), Chromium 1280×800, admin account; fixture assignment #15 "QA-AP2476-233044" |
| **Result** | Edit dialog for parameter 24 shows "All" in the four lists, empty Sale Dates with hint "All", and keeps odometer 500 / 100005. |

**Why this matters:** If the Edit form shows a real value (for example the first program in the list, or "New") for a field that is actually empty, an admin who opens and saves the rule without noticing will narrow it by accident. Likewise, the odometer defaults must not overwrite a stored odometer when an existing rule is opened.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | E values, Coverage odometer from `500`, Coverage odometer to `100005` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2476-…` assignment details page (create it if absent, as in the Execution Context). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter**, leave the six optional fields on "All", set Coverage odometer from `500`, Coverage odometer to `100005`, Model Year Age `0` / `5`, Lag Interval `0` → **Submit**. | Alert "Parameter added"; a row `500 - 100005` is listed. |
| 3 | Click the pencil icon on the `500 - 100005` row and wait for the label "Coverage odometer from". | The "Edit Parameter" dialog opens. |
| 4 | [Verification] Read the six optional fields and the two odometer fields in the dialog. | Condition, Coverage Code, Make and Earning Group show "All"; Sale Date from and Sale Date to are empty with the hint "All". Coverage odometer from shows `500` and Coverage odometer to shows `100005` — not the defaults `0` / `999999`. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Six fields optional on Add and Edit | AP2476_003, AP2476_004 | AP2476_007 (file 2) | AP2476_009, AP2476_010 (file 2) | AP2476_006 (file 2) |
| REQ-002 — "All" replaces "Choose" | AP2476_001, AP2476_005 | — | — | — |
| REQ-003 — Odometer from defaults to 0 | AP2476_002 | AP2476_008 (file 2) | — | AP2476_005 |
| REQ-004 — Odometer to defaults to 999999 | AP2476_002 | AP2476_008 (file 2) | — | AP2476_005 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2476_001 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_001-step4-AllPlaceholders_pass.png` |
| AP2476_002 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_002-step3-OdometerDefaults_pass.png` |
| AP2476_003 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_003-step3-EmptyParamSaved_pass.png` |
| AP2476_004 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_004-step4-EditClearedToAll_pass.png` |
| AP2476_005 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2476/AP2476_005-step4-EditShowsAllKeepsOdometer_pass.png` |

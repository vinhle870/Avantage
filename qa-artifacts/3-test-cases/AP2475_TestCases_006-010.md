# Test Cases — AP2475 (File 2 of 2)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2475 — Edit earning assignment parameter
**Source:** requirements/AP-2475-edit-earning-assignment-parameter.md · qa-artifacts/1-requirements-analysis/AP-2475_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2475_test-plan.md
**Date:** 2026-10-04
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2475_006 to AP2475_010 (5 test cases)
**Coverage:** Negative · Edge-case · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-assignment` — Earning Assignments list. Create form `/admin/earning-assignment/new/edit`; details page `/admin/earning-assignment/{id}/details`. Navigate by URL; the Risk Management fly-out closes on every page load. The Add Parameter and edit parameter form routes are not known yet: record them the first time they open. | `navigation` → `domain` (risk-management.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Admin — `vinhle870@gmail.com` / `<password from the env source>` at `/admin/login`. The login page is in French: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | Read-only reference data: earning set **Profit**, dealer group **Group A**, earning group **AV+**. Coverage codes and makes are picked by position. **Never edit the seeded "AV+ / Profit / Group A" assignment or its parameters.** | `test-data`, `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | Parameter rows on the shared `QA-AP2475-<HHMMSS>` assignment (one per case, two for AP2475_010). AP2475_009 deletes its own row. The assignment itself stays on staging. | `cleanup` (missing) |

**Shared assignment, row numbering, P1 and P2 values:** exactly as defined in [AP2475_TestCases_001-005.md](AP2475_TestCases_001-005.md) → Execution Context, repeated here so this file stands alone:

- **Assignment:** use the `QA-AP2475-…` assignment created earlier in this run if it exists; otherwise open `/admin/earning-assignment/new/edit`, enter Description `QA-AP2475-<HHMMSS>`, Earning Set **Profit**, Dealer Group **Group A**, tick **Is Enabled?** → **Save**.
- **Row numbering:** each parameter's **Coverage odometer to** is `1000NN` (case number NN); two-row cases use `1000N1` / `1000N2`.
- **P1 values:** Condition **New** · Coverage Code **first option** · Sale Date from **2026-01-01** · to **2026-12-31** · Coverage odometer from **0** · to **1000NN** · Model Year Age from **0** · to **5** · Make **first option** · Lag Interval **0** · Earning Group **AV+**.

**Judging negative cases.** The ticket defines no validation rules (Q-006). AP2475_006 and AP2475_010 therefore **PASS** when the application either refuses the input with a visible message or saves it cleanly. They **FAIL** only on an HTTP 5xx page, a lost or corrupted row, or a save that reports success but stores something other than what was entered. Which of the two outcomes happened is recorded as an observation for Q-006. AP2475_007 is stricter, because AP-2474 defines Coverage odometer as a *numeric* field.

**Known blockers:** None. If the AP-2474 Add Parameter flow fails during a `[Pre-Condition]`, record that case **BLOCKED**, not FAIL.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2475_006 | Saving an odometer range entered backwards (from 50000, to 1000) does not crash or corrupt the row | Negative | Medium | PASS |
| AP2475_007 | Typing letters into the numeric "Coverage odometer from" field is refused and the row keeps its value | Negative | Medium | PASS |
| AP2475_008 | Leaving the edit dialog without saving keeps the parameter exactly as it was | Edge-case | Medium | PASS |
| AP2475_009 | The trash-can icon still asks for confirmation and deletes the parameter now that the pencil sits beside it | Regression | Medium | PASS |
| AP2475_010 | Editing a parameter so it matches another row exactly does not crash and is recorded for review | Edge-case | Low | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2475_006 — Saving an odometer range entered backwards (from 50000, to 1000) does not crash or corrupt the row

| Field | Value |
|---|---|
| **TC ID** | AP2475_006 |
| **Title** | Saving an odometer range entered backwards (from 50000, to 1000) does not crash or corrupt the row |
| **Requirement** | AP2475 — REQ-003; validation undefined (Q-006) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Backwards range accepted cleanly: row now shows 50000 - 1000, no 100006 row, count unchanged (Q-006: no range check). |

**Why this matters:** A range whose "from" is above its "to" can never match a vehicle, so the parameter silently stops working. The ticket does not say the form must refuse it, so a clean save is recorded for the product owner rather than failed. A crash or a garbled row is a defect either way.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | P1 values, Coverage odometer to `100006` |
| Coverage odometer from (edit) | `50000` |
| Coverage odometer to (edit) | `1000` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin, open the `QA-AP2475-…` assignment details page (create it if absent), click **Add Parameter**, fill the P1 values with Coverage odometer to `100006` → **Submit**. | A row with odometer `0 - 100006` is listed. |
| 2 | Click the pencil icon on the `100006` row, set **Coverage odometer from** to `50000` and **Coverage odometer to** to `1000`, and save. | Either the dialog (or a standalone form page) shows a validation message naming the odometer range, or the dialog closes as a normal save. No HTTP 500 page appears. Record which happened. |
| 3 | [Verification] Return to the details page if needed and read the datagrid. | If the save was refused: the row still shows `0 - 100006`. If it was accepted: one row shows `50000 - 1000` and no `100006` row remains. In both cases the row count is unchanged and every other field keeps its P1 value. |

---

### AP2475_007 — Typing letters into the numeric "Coverage odometer from" field is refused and the row keeps its value

| Field | Value |
|---|---|
| **TC ID** | AP2475_007 |
| **Title** | Typing letters into the numeric "Coverage odometer from" field is refused and the row keeps its value |
| **Requirement** | AP2475 — REQ-003; AP-2474 defines Coverage odometer as a "numeric text field" |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Number field ignored the letters; server refused the blank value with "This value should not be blank." on a standalone page; row kept 0 - 100007. |

**Why this matters:** If text reaches the database as an odometer value, the row may be saved as 0 or fail later when contracts are matched against it. AP-2474 states the field is numeric, so letters must not be stored.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | P1 values, Coverage odometer to `100007` |
| Coverage odometer from (edit) | `abc` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin, open the `QA-AP2475-…` assignment details page (create it if absent), click **Add Parameter**, fill the P1 values with Coverage odometer to `100007` → **Submit**. | A row with odometer `0 - 100007` is listed. |
| 2 | Click the pencil icon on the `100007` row, clear **Coverage odometer from** and type `abc`. | Either the field does not accept the letters (it stays empty or keeps digits only), or it shows `abc`. Record which. |
| 3 | Click the dialog's save/submit button. | The save is refused: the browser's number check or a server message names the field. No HTTP 500 page appears. |
| 4 | [Verification] Close or leave the dialog without saving further, reload the details page and read the `100007` row. | The row still shows Coverage odometer `0 - 100007`. No row shows `abc` or a blank odometer from. |

---

### AP2475_008 — Leaving the edit dialog without saving keeps the parameter exactly as it was

| Field | Value |
|---|---|
| **TC ID** | AP2475_008 |
| **Title** | Leaving the edit dialog without saving keeps the parameter exactly as it was |
| **Requirement** | AP2475 — REQ-002; close-without-saving not described (Q-004) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Dialog has no Cancel or close button; Esc closed it without saving; Lag Interval stayed 0 after reload. |

**Why this matters:** An admin who opens the edit dialog only to look must be able to leave without changing anything. The sibling Earning Set dialog has no Cancel or close button, so the way out may be the browser's Back button. Whatever it is, nothing should be saved.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter before | P1 values, Coverage odometer to `100008` |
| Unsaved change | Lag Interval `0` → `12` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin, open the `QA-AP2475-…` assignment details page (create it if absent), click **Add Parameter**, fill the P1 values with Coverage odometer to `100008` → **Submit**. | A row with odometer `0 - 100008` and Lag Interval 0 is listed. |
| 2 | Click the pencil icon on the `100008` row and change **Lag Interval** to `12`. Do **not** save. | The dialog shows Lag Interval 12. Record which close controls exist: Cancel, ×, or none. |
| 3 | Leave the dialog without saving: use Cancel or × if present; otherwise press **Esc**; if the dialog is still open, use the browser's **Back** button. | The dialog closes and the details page is shown. Record which method worked. |
| 4 | [Verification] Reload the details page and read the `100008` row. | The row still shows Lag Interval **0** and all its other P1 values. |

---

### AP2475_009 — The trash-can icon still asks for confirmation and deletes the parameter now that the pencil sits beside it

| Field | Value |
|---|---|
| **TC ID** | AP2475_009 |
| **Title** | The trash-can icon still asks for confirmation and deletes the parameter now that the pencil sits beside it |
| **Requirement** | AP2475 — REQ-001 (regression of the AP-2474 Unassign action) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Trash can opened "Unassign parameter" confirmation ("Are you sure you want to delete this record?"); Continue deleted the 100009 row, 9 rows left with both icons. |

**Why this matters:** Adding a second icon to the Actions column can shift click targets or break the delete link. Clicking the wrong icon must never delete a parameter without confirmation.

**Test Data:**

| Variable | Value |
|---|---|
| Parameter | P1 values, Coverage odometer to `100009` |
| Confirmation text (AP-2474) | "Are you sure to delete this record?" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin, open the `QA-AP2475-…` assignment details page (create it if absent), click **Add Parameter**, fill the P1 values with Coverage odometer to `100009` → **Submit**. Count the rows (N). | A row with odometer `0 - 100009` is listed; N rows in total. |
| 2 | Click the **trash-can** icon on the `100009` row. | A confirmation dialog opens with the text "Are you sure to delete this record?". The edit dialog does **not** open. |
| 3 | Confirm the deletion. | The dialog closes without an error. |
| 4 | [Verification] Read the datagrid. | The `100009` row is gone, N−1 rows remain, and every other row still shows its own pencil and trash-can icons. |

---

### AP2475_010 — Editing a parameter so it matches another row exactly does not crash and is recorded for review

| Field | Value |
|---|---|
| **TC ID** | AP2475_010 |
| **Title** | Editing a parameter so it matches another row exactly does not crash and is recorded for review |
| **Requirement** | AP2475 — REQ-003; duplicates undefined (Q-006) |
| **Route** | `/admin/earning-assignment/{id}/details` — Earning Assignment details |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | BLOCKED |
| **Blocked by** | AP-2474 Add Parameter / details page: HTTP 500 on `/admin/earning-assignment/4/details` once the assignment has 11 parameters |
| **Executed on** | 2026-10-04 — Staging (v2staging), Chromium, admin account |
| **Result** | Blocked by AP-2474: after adding row B (the assignment's 11th parameter) the details page returns HTTP 500 on every load, so the edit could not be performed. |

**Why this matters:** Two identical parameter rows on one assignment make it unclear which earning group wins for a matching contract. The ticket does not say whether this must be blocked, so the outcome is recorded for the product owner. A crash would still be a defect.

**Test Data:**

| Variable | Value |
|---|---|
| Row A | P1 values, Coverage odometer to `100101` |
| Row B | P1 values, Coverage odometer to `100102` |
| Row B change | Coverage odometer to `100102` → `100101` (now identical to row A) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the admin and open the `QA-AP2475-…` assignment details page (create it if absent). | The details page is shown. |
| 2 | [Pre-Condition] Click **Add Parameter** and submit the P1 values with Coverage odometer to `100101` (row A), then again with `100102` (row B). | Rows `0 - 100101` and `0 - 100102` are listed. |
| 3 | Click the pencil icon on row B (`100102`), change **Coverage odometer to** to `100101`, and save. | Either a message refuses the duplicate, or the dialog closes as a normal save. No HTTP 500 page appears. Record which happened. |
| 4 | [Verification] Read the datagrid. | If refused: row B still shows `0 - 100102`. If accepted: two identical `0 - 100101` rows are listed and no `100102` row remains. The row count is unchanged in both cases. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Pencil icon in the Actions column | AP2475_001 | — | — | AP2475_009 |
| REQ-002 — Pencil opens the edit modal, pre-filled | AP2475_002, AP2475_004 | — | AP2475_005, AP2475_008 | — |
| REQ-003 — Changes saved to the same row and kept | AP2475_003, AP2475_004 | AP2475_006, AP2475_007 | AP2475_005, AP2475_010 | AP2475_009 |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2475_006 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_006-step3-BackwardsRangeSaved_pass.png` |
| AP2475_007 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_007-step4-RowKeptOdometerAfterReload_pass.png` |
| AP2475_008 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_008-step4-UnsavedLagNotStored_pass.png` |
| AP2475_009 | PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_009-step4-RowDeletedIconsIntact_pass.png` |
| AP2475_010 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2475/AP2475_010-step2-Http500AfterAddRowB_fail.png` |

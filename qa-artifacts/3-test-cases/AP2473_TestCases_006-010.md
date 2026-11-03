# Test Cases — AP2473 (File 2 of 2)

**Project:** Avantage Plus v2 — Admin portal, Risk Management
**Requirement:** AP2473 — Earning Sets
**Source:** requirements/AP-2473-earning-sets.md · qa-artifacts/1-requirements-analysis/AP-2473_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2473_test-plan.md
**Date:** 2026-10-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2473_006 to AP2473_010 (5 test cases)
**Coverage:** Edge-case · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/login`, then `/admin`. Feature route `/admin/earning-set` (admin sidebar "Earning Sets", page snapshot 2026-10-02). Sibling routes in the same section: `/admin/earning-curve`, `/admin/earning-group`, `/admin/earning-assignment`. | `navigation`, page snapshot |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Shared admin account from `execute.env.md` (Admin Portal row). Login page labels: "Courriel", "Mot de passe", "Se connecter". | `env` |
| **Test data** | No seeded records. Every earning set is created by the case with a `QA-AP2473-` description. | `test-data` (none needed) |
| **Language** | The admin portal after login, as shown. | `navigation` |
| **Leaves behind** | Up to 5 earning sets named `QA-AP2473-…` per run (AP2473_006 one or two, AP2473_007 two, AP2473_008 one). AP2473_009 should leave nothing. No delete action exists and `cleanup` is `missing`. | `cleanup` (missing) |

**Known blockers** — None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2473_006 | Creating a second earning set with the same description as an existing one is allowed, and both are listed | Edge-case | Medium | PASS |
| AP2473_007 | A 1-character and a 255-character description both save and display in full in the list | Edge-case | Medium | PASS |
| AP2473_008 | A description with French accents and HTML characters is saved and shown exactly as typed, not run as code | Edge-case | Medium | PASS |
| AP2473_009 | Leaving the Create New form without saving adds no earning set to the list | Edge-case | Low | PASS |
| AP2473_010 | The other Risk Management pages still open after the Earning Sets change | Regression | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2473_006 — Creating a second earning set with the same description as an existing one is allowed, and both are listed

| Field | Value |
|---|---|
| **TC ID** | AP2473_006 |
| **Title** | Creating a second earning set with the same description as an existing one is allowed, and both are listed |
| **Requirement** | AP2473 — REQ-003 (Description rules — duplicates allowed, QA decision 2026-10-03), REQ-004 |
| **Route** | `/admin/earning-set` → "Create New" |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS (re-judged 2026-10-04 against the revised expected result) — The duplicate `QA-AP2473-D-190013` saved with "Earning set saved"; two rows (IDs 6, 7) listed after a reload. Originally recorded FAIL on 2026-10-03 against the old expectation that duplicates are refused. |

**Why this matters:** Duplicate descriptions are allowed. The ticket sets no uniqueness rule, and the QA (Vinh Le) confirmed on 2026-10-03, at Gate C, that accepting a duplicate is not a bug. This case guards against the opposite failure: a duplicate save that errors, or that silently overwrites or merges with the existing set instead of creating a second one. Because the two rows look identical, the case checks them by ID.

**Revision history:** 2026-10-03 — designed as a Negative case expecting the duplicate to be refused (pending Q-004); executed, FAIL. 2026-10-04 — expected result revised to "duplicates allowed" per the QA's Gate C decision; result re-judged PASS from the 2026-10-03 evidence, with no re-execution.

**Test Data:**

| Variable | Value |
|---|---|
| Description | `QA-AP2473-D-<HHMMSS>` — used twice |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account), open `/admin/earning-set`, click "Create New", type `QA-AP2473-D-<HHMMSS>` in "Description" and click the save button | The set `QA-AP2473-D-<HHMMSS>` is saved and listed once. |
| 2 | Click "Create New" again, type exactly `QA-AP2473-D-<HHMMSS>` in "Description" and click the save button | The save succeeds with the usual "Earning set saved" message and no error. |
| 3 | [Verification] Reload `/admin/earning-set`, count the rows with Description `QA-AP2473-D-<HHMMSS>`, and read each row's ID from its "Edit" link (`/admin/earning-set/{id}/edit`) | Exactly two rows have that description, each with a different ID, so the first set was not overwritten. |

---

### AP2473_007 — A 1-character and a 255-character description both save and display in full in the list

| Field | Value |
|---|---|
| **TC ID** | AP2473_007 |
| **Title** | A 1-character and a 255-character description both save and display in full in the list |
| **Requirement** | AP2473 — REQ-003 (boundary values, Q-004), REQ-004 |
| **Route** | `/admin/earning-set` → "Create New" |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — "Q" (ID 8) and a 255-char value (ID 9) saved and shown in full in the grid and Edit form; no maxlength. The long row pushes the Actions column off-screen. |

**Why this matters:** No length limit is stated. 255 is the usual database text limit, so a longer value could fail silently or be cut off. If the field stops typing earlier (a `maxlength`), record the limit it enforces; a limit below 255 with a clear message is an observation, not a FAIL. A server error or silent truncation without a message is a FAIL.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Short description | `Q` | Minimum non-blank — 1 character. If a set named `Q` already exists, use `Z` |
| Long description | `QA-AP2473-L-<HHMMSS>-` followed by `X` repeated until the total length is 255 | Build it with the browser (`'QA-AP2473-L-143015-'.padEnd(255,'X')`) and record the exact length |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account) and open `/admin/earning-set` | The Earning Sets list loads. |
| 2 | Click "Create New", type `Q` in "Description" and click the save button | The set saves without an error. |
| 3 | Click "Create New", enter the 255-character long description in "Description", record the length the field actually holds, and click the save button | The field holds all 255 characters and the set saves without an error. |
| 4 | [Verification] Reload `/admin/earning-set`, find both new rows, and read the long row's full description (open "Edit" if the grid truncates the text for display) | Both sets are listed. The stored long description is the full 255 characters, identical to what was typed. |

---

### AP2473_008 — A description with French accents and HTML characters is saved and shown exactly as typed, not run as code

| Field | Value |
|---|---|
| **TC ID** | AP2473_008 |
| **Title** | A description with French accents and HTML characters is saved and shown exactly as typed, not run as code |
| **Requirement** | AP2473 — REQ-003, REQ-004 |
| **Route** | `/admin/earning-set` → "Create New" |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Accents intact and `<b>bold</b>` shown as literal text in the grid and Edit form (ID 11); no bold, no garbling, no double escaping. |

**Why this matters:** The product is used in Quebec, so French accents must survive saving. HTML characters must be shown as text, not interpreted by the browser; otherwise a description could break the page or run script (cross-site scripting). The `<b>` tag is harmless if it does render, so this case does not inject live script.

**Test Data:**

| Variable | Value |
|---|---|
| Description | `QA-AP2473-S-<HHMMSS> Échéance à 100% "test" & <b>bold</b>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account) and open `/admin/earning-set` | The Earning Sets list loads. |
| 2 | Click "Create New", type the Test Data description in "Description" and click the save button | The set saves without an error. |
| 3 | Reload `/admin/earning-set` and find the new row | The new row is listed. |
| 4 | [Verification] Verify the row shows `Échéance à 100% "test" & <b>bold</b>` character for character — accents intact, and `<b>bold</b>` shown as literal text, not as bold "bold"; then click "Edit" and verify the form's Description holds the same string | The grid and the edit form both show the exact string typed. No text is bold, garbled (for example `Ã‰`) or escaped twice (for example `&amp;`). |

---

### AP2473_009 — Leaving the Create New form without saving adds no earning set to the list

| Field | Value |
|---|---|
| **TC ID** | AP2473_009 |
| **Title** | Leaving the Create New form without saving adds no earning set to the list |
| **Requirement** | AP2473 — REQ-003, REQ-004 |
| **Route** | `/admin/earning-set` → "Create New" |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Dialog has no Cancel/close button; browser Back closed it with no warning; QA-AP2473-C-190216 not on either list page. |

**Why this matters:** The ticket says nothing about Cancel. An admin who abandons the form must not leave a half-made record behind. If the form has a "Cancel" or "Back" button, use it; otherwise use the browser's Back button. Record which one was used and whether any warning appeared.

**Test Data:**

| Variable | Value |
|---|---|
| Description typed but not saved | `QA-AP2473-C-<HHMMSS>` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account) and open `/admin/earning-set` | The Earning Sets list loads. |
| 2 | Click "Create New" and type `QA-AP2473-C-<HHMMSS>` in "Description" without saving | The form shows the typed description. |
| 3 | Click the form's "Cancel" or "Back" button if it has one; otherwise press the browser's Back button | The admin leaves the form and returns to the Earning Sets list. Any "unsaved changes" warning is recorded. |
| 4 | [Verification] Reload `/admin/earning-set` and search the grid for `QA-AP2473-C-<HHMMSS>` | No row with that description exists. |

---

### AP2473_010 — The other Risk Management pages still open after the Earning Sets change

| Field | Value |
|---|---|
| **TC ID** | AP2473_010 |
| **Title** | The other Risk Management pages still open after the Earning Sets change |
| **Requirement** | AP2473 — REQ-001 (regression) |
| **Route** | `/admin/earning-curve`, `/admin/earning-group`, `/admin/earning-assignment` |
| **Type** | Regression |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-10-03 — v2staging, admin portal, Chromium 1280 × 800 |
| **Result** | PASS — Earning Curves, Earning Groups and Earning Assignments each load with their own heading; Earning Sets stays in the menu. |

**Why this matters:** The Earning Sets item was added to a menu section shared with three other screens. This check only confirms those screens still load; it does not test their features.

**Test Data:**

| Variable | Value |
|---|---|
| Sibling items | Earning Curves, Earning Groups, Earning Assignments |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal (`/admin/login`, admin account) and expand "Risk Management" in the sidebar | The section lists Earning Curves, Earning Sets, Earning Groups and Earning Assignments (record the exact list and order). |
| 2 | Click "Earning Curves", then "Earning Groups", then "Earning Assignments" in turn | Each page loads with its own heading and no error page or HTTP 500. |
| 3 | [Verification] Verify each of the three pages showed its own title and no error, and that the sidebar still lists "Earning Sets" on every page | All three sibling pages load, and the Earning Sets item stays in the menu throughout. |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | AP2473_001 | — | — | AP2473_010 |
| REQ-003 — Description field rules | — | — | AP2473_006, AP2473_007, AP2473_008 | — |
| REQ-004 — Save / not save | — | — | AP2473_006, AP2473_009 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_
>
> Run 2026-10-03, run folder 5.2.0. Full log: `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2473_2026-10-03.md`

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2473_006 | ✅ PASS (re-judged 2026-10-04; was ❌ FAIL on 2026-10-03) | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_006-step3-TwoDuplicateRowsAfterReload_fail.png` |
| AP2473_007 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_007-step4-ShortAndLongSetsListed_pass.png` |
| AP2473_008 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_008-step4-EditFormSameString_pass.png` |
| AP2473_009 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_009-step4-NoUnsavedRowListed_pass.png` |
| AP2473_010 | ✅ PASS | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2473/AP2473_010-step3-EarningAssignmentsLoads_pass.png` |

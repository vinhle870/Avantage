# Execution Log — AP-2474 Earning Assignment

> Written by the **stlc-manual-executor** skill (pipeline stage s4). Source test cases:
> `qa-artifacts/3-test-cases/AP2474_TestCases_001-005.md`, `_006-010.md`, `_011-015.md`, `_016-018.md`.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-10-04
**Environment:** Staging (v2staging)
**Base URL:** https://v2staging.garantieavantageplus.ca
**Portal / account:** Admin portal, `vinhle870@gmail.com` (shared admin account from the `env` source)
**Browser:** Chromium (Playwright MCP, isolated profile), viewport 1280 × 800
**Duration:** 01:08 → 01:23 local time (UTC+7) on 2026-10-04
**Environment health check:** passed before the run (`00-env-health-login-pass.png`). The `env-check` source is `missing` in the knowledge registry, so no formal smoke script was run beyond the login.

| Metric | Value |
|---|:---:|
| Total test cases | 18 |
| Passed | 17 |
| Failed | 1 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **94.4% (17 of 18)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2474_001 | Menu shows "Earning Assignments" under Risk Management | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_001-step5-pass.png` | Menu order Earning Curves · Earning Sets · Earning Groups · Earning Assignments |
| AP2474_002 | List page title, Create New, five columns, View opens details | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_002-step5-pass.png` | AV+ row intact; grid header reads "Model Year Age" (allowed variant) |
| AP2474_003 | Create New modal: fields and options | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_003-step5-pass.png` | Label is "Dealer Group" (ticket: "Dealer Groups"); single select; Is Enabled? checkbox ticked by default |
| AP2474_004 | Save opens "Earning Assignment {description}" with Edit, Add Parameter | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_004-step3-pass.png` | Empty grid shows "No entities found" and no column headers (observation) |
| AP2474_005 | Blank description refused | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_005-step5-pass.png` | "This value should not be blank." for empty and for 3 spaces |
| AP2474_006 | No earning set / dealer group chosen | Medium | ❌ | 3 | 2 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step2-fail.png` | Save with "Choose" in Earning Set or Dealer Group returns HTTP 500 "Erreur" page (3 of 3 tries). Filed as AP-2482 |
| AP2474_007 | Duplicate earning set + dealer group pair | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_007-step4-pass.png` | Duplicate Profit / Group A pair saved silently (Q-002 observation); AV+ unchanged |
| AP2474_008 | Edit opens pre-filled; edited description updates title | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_008-step5-pass.png` | Edit is a modal "Earning assignment #5"; returns to details with "Earning assignment saved" |
| AP2474_009 | Add Parameter modal: ten fields, options, defaults | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_009-step3-pass.png` | Defaults 0 / 9999999 / -1 / 99 exact; 52 coverage codes, 200 makes, 16 earning groups |
| AP2474_010 | Fully filled parameter shows every value in the grid | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_010-step4-pass.png` | Row matches every value entered; ranges shown "from - to" |
| AP2474_011 | Default ranges and one-day sale period | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_011-step4-pass.png` | "0 - 9999999", "-1 - 99", "2026-10-04 - 2026-10-04" |
| AP2474_012 | Inverted from/to ranges | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_012-step4-pass.png` | Inverted ranges saved silently, shown exactly as entered (Q-006 observation) |
| AP2474_013 | Letters / blanks in numeric fields | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_013-step5-pass.png` | Letters not accepted by the field; blanks refused with "This value should not be blank." |
| AP2474_014 | Trash-can asks for confirmation; No keeps the parameter | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_014-step3-pass.png` | Text "Are you sure you want to delete this record?" (ticket wording differs slightly) |
| AP2474_015 | Continue removes only that parameter | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_015-step4-pass.png` | "Parameter unassigned"; only the Used / Lag 12 row remains |
| AP2474_016 | Identical parameter added twice | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_016-step4-pass.png` | Second identical row saved silently (Q-011 observation); first row unchanged |
| AP2474_017 | Sale Date to left blank | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_017-step4-pass.png` | Refused cleanly: "This value should not be blank." at Sale Date to |
| AP2474_018 | Parameter belongs only to its own assignment | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_018-step4-pass.png` | Assignment B empty; AV+ still has only its seeded row |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Records created on staging

There is no delete action for earning assignments and the `cleanup` source is missing, so
everything below stays on v2staging. Every description starts `QA-AP2474-`.

| Assignment id | Description (final) | Earning Set | Dealer Group | Is Enabled? | Parameters left (id: values) | Created by |
|:---:|---|---|---|:---:|---|---|
| 2 | QA-AP2474-004-0110 | Statutory | Group B | Yes | none | AP2474_004 (also used by AP2474_009, nothing submitted) |
| 3 | QA-AP2474-007-0114 | Profit | Group A | Yes | none | AP2474_007 (duplicate of the AV+ pair) |
| 5 | QA-AP2474-008-0115-EDITED (created as QA-AP2474-008-0115) | Reinsurance | Group D | **No** | none | AP2474_008 |
| 6 | QA-AP2474-010-0116 | Profit | Group D | Yes | 9: Used · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · 1000 - 150000 · 0 - 10 · Acura · Lag 6 · AV+ | AP2474_010 |
| 7 | QA-AP2474-011-0117 | Profit | Group A | Yes | 11: New · 00010730 - VL0730_Program_0001 · 2026-10-04 - 2026-10-04 · 0 - 9999999 · -1 - 99 · Zodiac · Lag 0 · AV+ | AP2474_011 |
| 8 | QA-AP2474-012-0118 | Profit | Group B | Yes | 13: New · AP-CADV - Advanced · **2026-12-31 - 2026-01-01** · **200000 - 1000** · **10 - 2** · Acura · Lag 12 · AV+ (inverted ranges) | AP2474_012 |
| 9 | QA-AP2474-013-0119 | Statutory | Group A | Yes | none (both invalid submits refused) | AP2474_013 |
| 10 | QA-AP2474-014-0119 | Reinsurance | group c | Yes | 18: Used · AP-CADV - Advanced · 2026-07-01 - 2026-12-31 · 0 - 9999999 · -1 - 99 · Acura · Lag 12 · AV+. (Parameter 17, the "New" / Lag 0 row, was removed by AP2474_015) | AP2474_014 / 015 |
| 11 | QA-AP2474-016-0120 | Profit | group c | Yes | 19 and 20: two identical rows New · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · 0 - 9999999 · -1 - 99 · Acura · Lag 0 · AV+ | AP2474_016 |
| 12 | QA-AP2474-017-0121 | Statutory | Group D | Yes | none (blank Sale Date to and blank Coverage Code both refused) | AP2474_017 + exploratory check |
| 13 | QA-AP2474-018A-0122 | Profit | Group B | Yes | 21: Used · AP-CADV - Advanced · 2026-03-01 - 2026-03-31 · 500 - 5000 · 1 - 3 · Acura · Lag 12 · AV+ | AP2474_018 |
| 14 | QA-AP2474-018B-0122 | Reinsurance | Group A | Yes | none | AP2474_018 |

**Not created:** AP2474_005 (blank / spaces description) and AP2474_006 (`QA-AP2474-006-0112`, three
attempts that all ended in HTTP 500) left no assignment behind — confirmed on the list after each.

**Not ours:** assignment id 4 **`QA-AP2475-011346`** (Profit / Group A / Yes)
and parameter ids 2–8, 10, 12, 14–16 were created by a parallel AP-2475 run during this session. They
were not touched.

**Seeded data untouched:** assignment 1 "AV+" (Profit / Group A / Yes) with its single parameter 1
(New · AX - Motopropulseur - AX · 1990-09-28 - 2099-09-28 · 0 - 9999999 · -1 - 99 · Acura · 0 · AV+)
was only viewed, never edited. Earning sets 1–3 and earning group 1 "AV+" were only read as options.

---

## Step-by-Step Results

### AP2474_001 — The admin menu shows "Earning Assignments" under Risk Management — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in at `/admin/login` | `/admin` opens with "Welcome to the admin" | URL = `/admin`; text "Vinh Le 1 Welcome to the admin" visible | ✅ | French login page (Courriel / Mot de passe / Se connecter) as documented |
| 2 | Click "Risk Management" in the sidebar | Section opens and lists its items | Sidebar heading "Risk Management" expanded; list of 4 links visible | ✅ | The heading is an `h6` with an icon; clicking the text works |
| 3 `[Verification]` | Verify "Earning Assignments" is listed | Item present | Links in order: "Earning Curves" (/admin/earning-curve), "Earning Sets", "Earning Groups", "Earning Assignments" (/admin/earning-assignment) | ✅ | Same order the AP-2473 run saw |
| 4 | Click "Earning Assignments" | Navigates to the page | Browser navigated to `/admin/earning-assignment` | ✅ | — |
| 5 `[Verification]` | Verify URL and heading | URL ends `/admin/earning-assignment`; heading "Earning Assignments" | URL = `/admin/earning-assignment`; h1 = "Earning Assignments" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_001-step3-pass.png` — Risk Management section open, "Earning Assignments" last in the list
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_001-step5-pass.png` — the Earning Assignments page after clicking the menu item

### AP2474_002 — List page title, Create New, five columns, View opens details — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/earning-assignment` | Page loads | Page loaded, HTTP 200 | ✅ | — |
| 2 `[Verification]` | Verify title, nav items, column headers | "Earning Assignments"; only nav item "Create New"; columns Description, Earning Set, Dealer Group, Is Enabled?, Actions | h1 = "Earning Assignments"; nav list = ["Create New"] (red button, opens `#myModal`); columns = "Description", "Earning Set", "Dealer Group", "Is Enabled?", "Actions" | ✅ | Exactly as the ticket states |
| 3 `[Verification]` | Find the "AV+" row | AV+ / Profit / Group A / Yes / View | Row = "AV+ \| Profit \| Group A \| Yes \| View" (View → `/admin/earning-assignment/1/details`). Row count = 1; no pagination shown | ✅ | Only the seeded row existed at the start of the run |
| 4 | Click "View" on AV+ | Details page opens | Navigated to `/admin/earning-assignment/1/details` | ✅ | — |
| 5 `[Verification]` | Verify URL and heading (do not click Edit) | `/admin/earning-assignment/{id}/details`; "Earning Assignment AV+" | URL = `/admin/earning-assignment/1/details`; h1 = "Earning Assignment AV+"; nav items "Edit" (`/1/edit`) and "Add Parameter" (`/1/parameter/add`); grid columns Condition · Coverage Code · Sale Date · Coverage odometer · **Model Year Age** · Make · Lag Interval · Earning Group · Actions; 1 row: New · AX - Motopropulseur - AX · 1990-09-28 - 2099-09-28 · 0 - 9999999 · -1 - 99 · Acura · 0 · AV+, Actions = pencil (`/1/parameter/1/edit`) + trash (`/1/parameter/1/unassign`) | ✅ | Header "Model Year Age" accepted as a wording variant of "Model Year Age From". Actions has an extra pencil (edit) icon the ticket does not mention |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_002-step2-pass.png` — list title, Create New and the five column headers
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_002-step3-pass.png` — the AV+ row with Profit / Group A / Yes / View
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_002-step5-pass.png` — "Earning Assignment AV+" details with Edit, Add Parameter and its one parameter row

### AP2474_003 — Create New modal: fields and options — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Note every earning set (all pages), open the assignments list | Sets noted, list loads | 12 earning sets: Profit, Statutory, Reinsurance, Q, QA-AP2473-185830, QA-AP2473-D-190013 (×2), QA-AP2473-DBL-190252, QA-AP2473-E-185855-edited, QA-AP2473-L-190043-X…, QA-AP2473-L256-190043-X…, QA-AP2473-S-190147 Échéance… | ✅ | Read from `/admin/earning-set?page=1..2` |
| 2 | Click "Create New" | Modal opens, URL unchanged | Modal "Create earning assignment" (`.modal.show`) opened; URL stayed `/admin/earning-assignment` | ✅ | Form POSTs to `/admin/earning-assignment/new/edit` |
| 3 `[Verification]` | Verify fields and controls | Description text; Earning Set select; Dealer Group(s) select; Is Enabled? Yes/No; Save | Label "Description" → text input `earning_assignment[description]` (HTML required); "Earning Set" → single select, placeholder "Choose"; "**Dealer Group**" → single select (not multiple), placeholder "Choose"; "Is Enabled?" → checkbox, **checked by default**; button "Save" | ✅ | Q-003: one dealer group per assignment. Q-005: Is Enabled? defaults to Yes. Label is "Dealer Group", ticket says "Dealer Groups" — recorded |
| 4 | Open Earning Set, then Dealer Group dropdowns | Each opens | Both bootstrap-select dropdowns opened and listed their items | ✅ | Escape on an open dropdown closes the whole modal |
| 5 `[Verification]` | Compare options; close with Escape | Every set from step 1; Group A, Group B, group c, Group D | Earning Set: "Choose" + exactly the 12 sets from step 1, alphabetical; Dealer Group: "Choose", "Group A", "Group B", "group c", "Group D". Escape closed the modal; list still showed only AV+ | ✅ | No assignment created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_003-step3-pass.png` — the Create earning assignment modal with its four fields and Save
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_003-step5-earningset-pass.png` — Earning Set dropdown open, all 12 sets listed
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_003-step5-pass.png` — Dealer Group dropdown open with Choose, Group A, Group B, group c, Group D

### AP2474_004 — Save opens the details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Click "Create New" | Modal opens | Modal opened | ✅ | — |
| 2 | Enter `QA-AP2474-004-0110`, Statutory, Group B, Yes → Save | Modal closes, redirect away from list | POST → 302; browser landed on `/admin/earning-assignment/2/details` | ✅ | — |
| 3 `[Verification]` | Verify URL, title, nav items, grid headers | `/{id}/details`; "Earning Assignment QA-AP2474-004-0110"; Edit + Add Parameter; 9 grid columns | URL = `/admin/earning-assignment/2/details`; h1 = "Earning Assignment QA-AP2474-004-0110"; nav = "Edit", "Add Parameter"; green alert "Earning assignment saved"; grid area shows the alert "**No entities found**" and **no column headers** | ✅ | New id = 2. Observation: an empty parameter grid renders no headers at all; the nine headers appear once a parameter exists (seen on AV+ in AP2474_002 and in AP2474_010) |
| 4 | Open `/admin/earning-assignment` | List loads | List loaded | ✅ | — |
| 5 `[Verification]` | Find the new row | QA-AP2474-004-0110 / Statutory / Group B / Yes / View | Row 1 = "QA-AP2474-004-0110 \| Statutory \| Group B \| Yes \| View" (→ `/2/details`); AV+ row below it | ✅ | List is newest first |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_004-step3-pass.png` — new details page with "Earning assignment saved" and "No entities found"
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_004-step5-pass.png` — the list with the new row on top

### AP2474_005 — Blank description refused — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Note row count, click Create New | Modal opens | Row count = 2 (004 row + AV+); modal opened | ✅ | — |
| 2 | Description empty, Profit, group c, Yes → Save | Refused with a message at Description; no 500 | Modal closed and the browser landed on the standalone page `/admin/earning-assignment/new/edit` (h1 "Create earning assignment", HTTP 200) with "ERROR This value should not be blank." under Description; Profit / group c / Yes kept | ✅ | The input's HTML `required` does not stop the submit from the modal; the server refuses |
| 3 | Enter three spaces → Save | Refused again | Same page, HTTP 200, Description emptied, "This value should not be blank." again | ✅ | Spaces are trimmed server-side |
| 4 | Open the list | Loads | Loaded | ✅ | — |
| 5 `[Verification]` | Count rows; look for blank description | Count unchanged, no blank row | 2 rows: "QA-AP2474-004-0110", "AV+"; no blank description | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_005-step2-pass.png` — standalone form with "This value should not be blank." under Description
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_005-step3-pass.png` — same message after the three-spaces attempt
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_005-step5-pass.png` — list still holding only the two rows

### AP2474_006 — No earning set / dealer group chosen — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Click Create New | Modal opens | Modal opened | ✅ | — |
| 2 | `QA-AP2474-006-0112`, Earning Set = "Choose" (empty), Dealer Group "Group A" → Save | Refused with a message at Earning Set, or no empty option. **No HTTP 500 page** | The select **does** offer an empty option ("Choose", value ""). After Save the browser showed the French error page "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." at `/admin/earning-assignment/new/edit`, **HTTP 500**. Repeated a second time: HTTP 500 again | ❌ | Same defect class as AP-2478 (empty select on Earning Groups → 500). An admin who forgets to pick a set gets a crash page and loses the description typed |
| 3 | Same description, Earning Set "Profit", Dealer Group = "Choose" → Save | Refused with a message at Dealer Group, or no empty option. **No HTTP 500 page** | The select offers "Choose" (value ""). POST returned **HTTP 500**, same "Erreur" page | ❌ | Dealer Group empty crashes the same way |
| 4 | Open the list | Loads | Loaded | ✅ | — |
| 5 `[Verification]` | Look for `QA-AP2474-006-0112` | No row, no row with an empty cell | No `QA-AP2474-006-0112` row; rows = QA-AP2474-004-0110, AV+; no empty Earning Set / Dealer Group cell | ✅ | Nothing was written by the failed saves |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step2-fail.png` — HTTP 500 "Erreur" page after saving with no earning set
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step3-fail.png` — HTTP 500 "Erreur" page after saving with no dealer group
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_006-step5-pass.png` — list with no QA-AP2474-006 row

### AP2474_007 — Duplicate earning set + dealer group pair — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Confirm AV+ = Profit / Group A / Yes; Create New | Modal opens | AV+ row = Profit / Group A / Yes; modal opened | ✅ | — |
| 2 | `QA-AP2474-007-0114`, Profit, Group A, Yes → Save | Refused, or details page opens. No 500 | POST → 302; details page `/admin/earning-assignment/3/details`, h1 "Earning Assignment QA-AP2474-007-0114", alert "Earning assignment saved" | ✅ | Q-002: a second assignment for the same set + dealer group is **allowed, with no warning** |
| 3 | Open the list | Loads | Loaded | ✅ | — |
| 4 `[Verification]` | Check AV+ and the new row | AV+ unchanged; new row present (saved) | "QA-AP2474-007-0114 \| Profit \| Group A \| Yes \| View" and "AV+ \| Profit \| Group A \| Yes \| View" both present | ✅ | Two assignments now map Profit to Group A |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_007-step4-pass.png` — list showing the duplicate pair beside the untouched AV+ row

### AP2474_008 — Edit opens pre-filled; edit updates title — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-008-0115`, Reinsurance, Group D, Yes | Details page opens | `/admin/earning-assignment/5/details`, h1 "Earning Assignment QA-AP2474-008-0115" | ✅ | Id 4 was taken by a parallel AP-2475 run |
| 2 | Click "Edit" | Form opens (record modal/page and heading) | A **modal** opened over the details page; heading "Earning assignment #5"; URL unchanged; form POSTs to `/admin/earning-assignment/5/edit` | ✅ | Same four fields as Create, single "Save" button, no Cancel |
| 3 `[Verification]` | Verify pre-fill | 008-0115 / Reinsurance / Group D / Yes | Description = "QA-AP2474-008-0115"; Earning Set = "Reinsurance"; Dealer Group = "Group D"; Is Enabled? checked = true | ✅ | — |
| 4 | Description → `…-EDITED`, untick Is Enabled? → Save | Form closes; no 500 | Checkbox checked = false before save; POST → 302; landed on `/admin/earning-assignment/5/details` with alert "Earning assignment saved" | ✅ | — |
| 5 `[Verification]` | Check title and list row | Title "…-EDITED"; row edited, Reinsurance, Group D, No; no old row | h1 = "Earning Assignment QA-AP2474-008-0115-EDITED"; list row "QA-AP2474-008-0115-EDITED \| Reinsurance \| Group D \| No \| View" (→ `/5/details`); no row "QA-AP2474-008-0115" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_008-step3-pass.png` — Edit modal "Earning assignment #5" pre-filled
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_008-step5-details-pass.png` — details title after the edit
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_008-step5-pass.png` — list row showing the edited description and "No"

### AP2474_009 — Add Parameter modal — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Note earning groups; open the 004 assignment | Details page with Add Parameter | 16 earning groups noted (AV+ + 15 QA-AP2472 groups); `/admin/earning-assignment/2/details` open | ✅ | Reused the AP2474_004 assignment as the case allows |
| 2 | Click "Add Parameter" | Modal opens; record heading | Modal heading "Add Parameter"; form POSTs to `/admin/earning-assignment/2/parameter/add` | ✅ | — |
| 3 `[Verification]` | Verify each control and default | Condition select; Coverage Code select; two date pickers; numeric 0, 9999999, -1, 99; Make, Lag Interval, Earning Group selects; Submit | Condition = select (default "New", no placeholder); Coverage Code = select ("Choose"); "Sale Date from" / "Sale Date to" = text inputs with a gijgo date picker (calendar opens on click, fills `yyyy-mm-dd`); "Coverage odometer from" = number **0**; "Coverage odometer to" = number **9999999**; "Model Year Age From" = number **-1**; "Model Year Age to" = number **99**; Make = select ("Choose"); Lag Interval = select (default "0"); Earning Group = select ("Choose"); button "Submit" | ✅ | All four defaults exact |
| 4 | Open each select | Each opens | All five dropdowns opened | ✅ | — |
| 5 `[Verification]` | Verify options; Escape | New/Used; 0/6/12; every earning group; coverage codes and makes listed | Condition: "New", "Used". Lag Interval: "0", "6", "12". Earning Group: "Choose" + the 16 groups noted in step 1 (exact match). Coverage Code: 52 programs + "Choose"; first five "AP-CADV - Advanced", "AFPP - AFPP", "AFPPAVN - AFPPAVN", "AMC - AMC", "ATCAU - ATCAU"; last "00010730 - VL0730_Program_0001". Make: 200 brands + "Choose"; first five "Acura", "Adventurer", "Airstream", "Aliner", "Allen Camper"; last "Zodiac". Grid still "No entities found" after closing | ✅ | Escape did not close the modal after the date picker had been used; it did close a freshly opened one. Page reload used to discard |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_009-step3-pass.png` — Add Parameter modal with defaults 0 / 9999999 / -1 / 99
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_009-step4-earninggroup-pass.png` — Earning Group dropdown open
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_009-step5-datepicker-pass.png` — Sale Date from calendar (October 2026) open
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_009-step5-pass.png` — details page afterwards, no parameter created

### AP2474_010 — Fully filled parameter — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-010-0116`, Profit, Group D, Yes | Details page, empty grid | `/admin/earning-assignment/6/details`; "No entities found" | ✅ | — |
| 2 | Fill every field (Used, first code, 2026-01-01/2026-12-31, 1000/150000, 0/10, first make, 6, AV+) | Every field shows the value | Condition=Used, Coverage Code="AP-CADV - Advanced", 2026-01-01 / 2026-12-31, 1000 / 150000, 0 / 10, Make="Acura", Lag=6, Earning Group=AV+ | ✅ | — |
| 3 | Submit | Modal closes, page reloads; no 500 | POST → 302 back to `/6/details`; alert "Parameter added" | ✅ | — |
| 4 `[Verification]` | Read the grid | One row with every value, ranges "from - to", trash icon | One row: "Used \| AP-CADV - Advanced \| 2026-01-01 - 2026-12-31 \| 1000 - 150000 \| 0 - 10 \| Acura \| 6 \| AV+"; Actions = pencil (`/6/parameter/9/edit`) + trash (`/6/parameter/9/unassign`). Headers now shown: Condition · Coverage Code · Sale Date · Coverage odometer · Model Year Age · Make · Lag Interval · Earning Group · Actions | ✅ | Parameter id 9 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_010-step4-pass.png` — the single parameter row with all values

### AP2474_011 — Default ranges, one-day sale period — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-011-0117`, Profit, Group A, Yes | Details page | `/admin/earning-assignment/7/details` | ✅ | — |
| 2 | New, last code, 2026-10-04/2026-10-04, last make, Lag 0, AV+; numeric left at defaults | Numeric fields still 0, 9999999, -1, 99 | Coverage Code="00010730 - VL0730_Program_0001", Make="Zodiac"; numeric = 0 / 9999999 / -1 / 99 | ✅ | — |
| 3 | Submit | Reloads; no 500 | 302 → `/7/details`, "Parameter added" | ✅ | — |
| 4 `[Verification]` | Read the row | New; 2026-10-04 both sides; 0 - 9999999; -1 - 99; Lag 0; AV+; chosen code and make | "New \| 00010730 - VL0730_Program_0001 \| 2026-10-04 - 2026-10-04 \| 0 - 9999999 \| -1 - 99 \| Zodiac \| 0 \| AV+" | ✅ | Parameter id 11; no truncation of 9999999 or the negative value |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_011-step4-pass.png` — row with the default ranges and the one-day period

### AP2474_012 — Inverted ranges — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-012-0118`, Profit, Group B, Yes | Details page, empty grid | `/admin/earning-assignment/8/details`, "No entities found" | ✅ | — |
| 2 | Enter inverted ranges + other values | Fields show the values | Sale Date 2026-12-31 / 2026-01-01; odometer 200000 / 1000; model year age 10 / 2; New, AP-CADV - Advanced, Acura, 12, AV+ | ✅ | Dates were typed into the inputs; the picker does not block an earlier "to" date typed by hand |
| 3 | Submit | Refused, or saved; no 500 | POST → 302, alert "Parameter added" — **saved without any warning** | ✅ | Q-006: no range validation |
| 4 `[Verification]` | Read the grid | If saved: exactly "2026-12-31 - 2026-01-01", "200000 - 1000", "10 - 2" | One row: "New \| AP-CADV - Advanced \| 2026-12-31 - 2026-01-01 \| 200000 - 1000 \| 10 - 2 \| Acura \| 12 \| AV+" | ✅ | Values match what was entered; recorded as an observation (rule can never match a contract) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_012-step4-pass.png` — row with all three ranges inverted

### AP2474_013 — Letters / blanks in numeric fields — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-013-0119` (Statutory / Group A / Yes); Add Parameter with the other fields | Modal filled | `/admin/earning-assignment/9/details`; modal holds Used, AP-CADV - Advanced, 2026-01-01 / 2026-12-31, Acura, 0, AV+ | ✅ | — |
| 2 | Type `abc` into "Coverage odometer from" → Submit | Field refuses letters, or save refused; no 500 | The number field did not accept the letters: value = "" after typing. Submit → HTTP 200, standalone page `/admin/earning-assignment/9/parameter/add` (h1 "Add Parameter") with "This value should not be blank." under "Coverage odometer from" | ✅ | Every other field kept its value on the standalone page |
| 3 | odometer from = 0; clear "Coverage odometer to" and "Model Year Age to" → Submit | Refused with messages at the blanks; no 500 | Re-opened the modal from the details page and submitted with those two blank → HTTP 200, standalone page with "This value should not be blank." under "Coverage odometer to" and under "Model Year Age to" | ✅ | Used the modal so the server (not the browser's own required check) was exercised |
| 4 | Reload the details page | Title shown | h1 = "Earning Assignment QA-AP2474-013-0119" | ✅ | — |
| 5 `[Verification]` | Read the grid | No row, or numbers only | "No entities found" — no parameter saved | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_013-step2-pass.png` — standalone Add Parameter page with the blank-odometer message
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_013-step3-pass.png` — messages under Coverage odometer to and Model Year Age to
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_013-step5-pass.png` — details page, no parameter rows

### AP2474_014 — Trash-can confirmation, No keeps the parameter — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-014-0119` (Reinsurance / group c / Yes) | Details page | `/admin/earning-assignment/10/details` | ✅ | — |
| 2 `[Pre-Condition]` | Add Parameter A, then B | Two rows | Rows (newest first): "Used … 2026-07-01 - 2026-12-31 … Lag 12 … AV+" (id 18), "New … 2026-01-01 - 2026-06-30 … Lag 0 … AV+" (id 17) | ✅ | Both "Parameter added" |
| 3 | Click trash on the "New" row | Confirmation modal; record text and buttons | Modal title "Unassign parameter"; text "**Are you sure you want to delete this record?**"; buttons "Continue" (`#form_save`, submit) and "No" (link, `data-dismiss=modal`); form POST to `/admin/earning-assignment/10/parameter/17/unassign` | ✅ | Ticket wording "Are you sure to delete this record?" — variant accepted by the case |
| 4 | Click "No" | Modal closes, stays on details | Modal closed; URL = `/admin/earning-assignment/10/details` | ✅ | — |
| 5 `[Verification]` | Reload and read the grid | Both rows unchanged | After reload: both rows (ids 18 and 17) present with identical values | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_014-step3-pass.png` — "Unassign parameter" confirmation with Continue / No
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_014-step5-pass.png` — both parameter rows still present after No

### AP2474_015 — Continue removes only that parameter — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `QA-AP2474-014-0119` details | Two rows | Rows 18 (Used / 12) and 17 (New / 0) present | ✅ | Reused AP2474_014's record as the case says |
| 2 | Click trash on the "New" row | Confirmation opens | Modal "Unassign parameter" with the same text | ✅ | — |
| 3 | Click "Continue" | Modal closes, reload; no 500 | POST → 302 back to `/10/details`; green alert "Parameter unassigned" | ✅ | — |
| 4 `[Verification]` | Read grid and list | Only Used / Lag 12 row; title unchanged; assignment still listed | Grid = one row "Used \| AP-CADV - Advanced \| 2026-07-01 - 2026-12-31 \| 0 - 9999999 \| -1 - 99 \| Acura \| 12 \| AV+"; h1 = "Earning Assignment QA-AP2474-014-0119"; list row "QA-AP2474-014-0119 \| Reinsurance \| group c \| Yes \| View" present | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_015-step4-pass.png` — "Parameter unassigned" and the one remaining row
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_015-step4-list-pass.png` — the assignment still on the list

### AP2474_016 — Identical parameter twice — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-016-0120` (Profit / group c / Yes) | Details page | `/admin/earning-assignment/11/details` | ✅ | — |
| 2 `[Pre-Condition]` | Add the parameter | One row | Row id 19: New · AP-CADV - Advanced · 2026-01-01 - 2026-12-31 · 0 - 9999999 · -1 - 99 · Acura · 0 · AV+ | ✅ | — |
| 3 | Add exactly the same values → Submit | Refused, or saved; no 500 | POST → 302, alert "Parameter added" — **saved without warning** | ✅ | Q-011: duplicates allowed |
| 4 `[Verification]` | Read the grid | One row or two identical rows; first unchanged | Two identical rows (ids 20 and 19); row 19 values unchanged | ✅ | Recorded as observation |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_016-step4-pass.png` — two identical parameter rows

### AP2474_017 — Sale Date to blank — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create `QA-AP2474-017-0121` (Statutory / Group D / Yes) | Details page, empty grid | `/admin/earning-assignment/12/details`, "No entities found" | ✅ | — |
| 2 | Fill values, leave Sale Date to empty | Other fields filled; to empty | Used, AP-CADV - Advanced, from 2026-01-01, **to ""**, 0 / 9999999, -1 / 99, Acura, 6, AV+ | ✅ | — |
| 3 | Submit | Refused (record wording) or saved; no 500 | HTTP 200, standalone page `/12/parameter/add` with "This value should not be blank." under "Sale Date to" | ✅ | Clean refusal; dates are required server-side |
| 4 `[Verification]` | Reload and read grid | Refused: no row | "No entities found" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_017-step3-pass.png` — message under Sale Date to
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_017-step4-pass.png` — details page with no parameters

### AP2474_018 — Parameter belongs only to its assignment — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create A `QA-AP2474-018A-0122` (Profit / Group B) and B `QA-AP2474-018B-0122` (Reinsurance / Group A) | Two details pages, empty grids | A = id 13, B = id 14; both "No entities found" | ✅ | — |
| 2 | Add the parameter on A | One row Used / 2026-03-01 - 2026-03-31 / 500 - 5000 / 1 - 3 / 12 / AV+ | A grid: "Used \| AP-CADV - Advanced \| 2026-03-01 - 2026-03-31 \| 500 - 5000 \| 1 - 3 \| Acura \| 12 \| AV+" (id 21) | ✅ | — |
| 3 | Open B | Title "Earning Assignment QA-AP2474-018B-0122" | h1 = "Earning Assignment QA-AP2474-018B-0122" | ✅ | — |
| 4 `[Verification]` | Read B's grid, then AV+'s grid | B empty; AV+ as in AP2474_002, no 500 - 5000 row | B: "No entities found". AV+ (`/1/details`): one row "New \| AX - Motopropulseur - AX \| 1990-09-28 - 2099-09-28 \| 0 - 9999999 \| -1 - 99 \| Acura \| 0 \| AV+" — identical to AP2474_002 | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_018-step2-pass.png` — assignment A with its one parameter
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_018-step4-pass.png` — assignment B with an empty grid
- `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/AP2474_018-step4-avplus-pass.png` — AV+ unchanged

---

## Blocked / Skipped Test Cases

None.

---

## Additional exploratory check (not a test case)

- On assignment 12, an Add Parameter submit with **Coverage Code left on "Choose"** was refused cleanly
  (HTTP 200, "This value should not be blank." under Coverage Code) — unlike the assignment form's
  selects, the parameter form's empty select does **not** crash. Evidence:
  `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2474/EXPL-param-empty-coveragecode-pass.png`.
- A read-only GET of `/admin/earning-assignment/1/parameter/1/edit` returned HTTP 200 with heading
  "Edit Parameter" and the same eleven `earning_assignment_parameter[...]` fields. The pencil icon
  in the grid's Actions column therefore opens an Edit Parameter form the ticket does not describe.
  It was not submitted.

---

## Environment Observations

- **A parallel AP-2475 run wrote to the same tables during this session.** Assignment id 4
  `QA-AP2475-011346` (Profit / Group A) and parameter ids 2–8, 10, 12, 14–16 are not from this run.
  Row counts in AP2474_005 and AP2474_006 were taken before that record appeared and were unaffected.
- **Cross-reference from the AP-2475 run:** that run reports the assignment details page returns HTTP 500
  once an assignment holds 11 parameters (its assignment #4). No AP-2474 case adds more than two
  parameters, so this run neither confirms nor contradicts it; it belongs in the AP-2474 bug review.
- **The list now pages.** With 14 assignments the list shows 10 on page 1 and 4 on page 2
  (`?page=2`); the seeded "AV+" row is on page 2.
- Pages responded in under two seconds throughout; the only error pages were the HTTP 500s in AP2474_006.
- Bootstrap-select note: every select on both forms is wrapped by bootstrap-select. The menus stay in
  the DOM after closing, so a selector for "the open menu" can match the wrong dropdown — scope each
  pick to its own `.bootstrap-select` container.
- `Execution Context` in the test-case files matched the live environment, except that the
  "Leaves behind" notes assumed one record per case; actual ids are in *Records created on staging* above.

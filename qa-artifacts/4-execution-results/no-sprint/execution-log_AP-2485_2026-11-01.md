# Execution Log — AP-2485

> Written by the **stlc-manual-executor** skill (stage s4 of `stlc-ticket-pipeline`, bug re-test flow).

---

## Execution Summary

**Ticket:** AP-2485 — Switching a 12-month earning curve back to Pro-Rata keeps the previous type's factors (bug re-test)
**Environment:** Dev (v2dev)
**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-11-01
**Base URL:** https://v2dev.garantieavantageplus.ca/ (admin portal, logged in at `/admin/login` with the Dev admin account from the `env` source)
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-01T03:31:27Z → 2026-11-01T03:34:29Z
**Test cases:** qa-artifacts/3-test-cases/AP2485_TestCases_001-003.md

This run supersedes the two earlier s4 attempts (staging at 02:00Z and Dev at 03:17Z), which both stopped at the admin login (stop point E4) without executing any case.

| Metric | Value |
|---|:---:|
| Total test cases | 3 |
| Passed | 3 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (3 of 3)** |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2485_001 | Switching a 12-month curve from Rule of 78 back to Pro-Rata shows and saves 0.0833 on every row | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_001-step5-ReopenedProRataFactors_pass.png` | The fix holds: Pro-Rata factors on screen and in the saved curve #14 |
| AP2485_002 | Switching from Reverse rule of 78 back to Pro-Rata regenerates at 12 months, and 24-month switching still works | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_002-step5-ProRata24MonthFactors_pass.png` | Reverse rule of 78 path fixed; 24-month path still correct; nothing saved |
| AP2485_003 | On an existing 12-month Rule of 78 curve, changing the type to Pro-Rata saves Pro-Rata factors | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_003-step5-EditedCurveProRataFactors_pass.png` | Edit page of curve #15 saves Pro-Rata factors, same id, no duplicate |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Test data check on Dev

The cases were designed against staging. Before executing, the Earning Curves list on Dev was read: it holds the same records the design names (curve #13 `QA-AP2471-Del-0043`, the AP-2471 and AP-2472 curves, the seeded "N years" curves). None of the three cases needs a pre-existing curve — each creates its own — so no case was blocked for missing data. No curve that this run did not create was opened for editing or changed; curve #13 was only seen in the list.

---

## Step-by-Step Results

Factor values were read from the read-only Monthly Factor and Cumulative Factor inputs with `input[name$="[monthlyFactor]"]` / `input[name$="[cumulativeFactor]"]`, as the Execution Context describes.

### AP2485_001 — Switching a 12-month curve from Rule of 78 back to Pro-Rata shows and saves 0.0833 on every row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in to the Admin portal, open `/admin/earning-curve` and open "Create New" | "Create earning curve" opens with Term month 12, type "Pro-Rata", 12 rows of Monthly Factor 0.0833 | URL = /admin/earning-curve/new/edit; heading = "Create earning curve"; Term month = "12"; type box = "Pro-Rata"; 12 rows, every Monthly Factor = "0.0833"; Cumulative row 12 = "1.0000" | ✅ | Login on Dev succeeded and landed on /admin |
| 2 | Leave Term month 12, select "Rule of 78", wait for the re-render | Type "Rule of 78"; row 1 Monthly 0.1538, row 12 Monthly 0.0128 | Type box = "Rule of 78"; Monthly = 0.1538 0.1410 0.1282 0.1154 0.1026 0.0897 0.0769 0.0641 0.0513 0.0385 0.0256 0.0128; Cumulative row 6 = "0.7308", row 12 = "1.0000" | ✅ | Matches the Rule of 78 oracle |
| 3 | Select "Pro-Rata" again, wait for the re-render, read all 24 values | Type "Pro-Rata"; all 12 Monthly 0.0833; Cumulative row 6 0.5000, row 12 1.0000 | Type box = "Pro-Rata"; Monthly = 0.0833 on all 12 rows; Cumulative = 0.0833 0.1667 0.2500 0.3333 0.4167 0.5000 0.5833 0.6667 0.7500 0.8333 0.9167 1.0000 | ✅ | This is the step the bug broke — the table now regenerates |
| 4 | Enter Name `QA-AP2485-Repro-033220`, odometer 0 / 10000, Save, then click the pencil on the new row | Alert "Earning curve saved"; first row reads 12 / "Pro-Rata"; "Earning curve #{id}" opens; id recorded | Alert visible = true; text = "Earning curve saved"; first row = "QA-AP2485-Repro-033220 · 12 · 0 - 10000 · Pro-Rata · Yes"; pencil href = /admin/earning-curve/14/edit; heading = "Earning curve #14" | ✅ | Curve id 14 created on Dev by this run |
| 5 `[Verification]` | On the reopened edit page, check the type and read all 24 stored values | Type "Pro-Rata"; every Monthly 0.0833; Cumulative 0.0833 … 0.5000 (row 6) … 1.0000; no Rule of 78 value | Name = "QA-AP2485-Repro-033220"; type box = "Pro-Rata"; 12 rows; Monthly = 0.0833 on every row; Cumulative = 0.0833 0.1667 0.2500 0.3333 0.4167 0.5000 0.5833 0.6667 0.7500 0.8333 0.9167 1.0000; no row shows 0.1538 … 0.0128 | ✅ | The stored curve carries Pro-Rata factors |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_001-step5-ReopenedProRataFactors_pass.png` — reopened curve #14 showing type Pro-Rata and 0.0833 on every row (final state)

### AP2485_002 — Switching from Reverse rule of 78 back to Pro-Rata regenerates at 12 months, and 24-month switching still works — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/earning-curve` and click "Create New" | "Create earning curve" with Term month 12, "Pro-Rata", 12 rows of 0.0833 | Heading = "Create earning curve"; Term month = "12"; type box = "Pro-Rata"; 12 rows, every Monthly Factor = "0.0833" | ✅ | Same admin session |
| 2 | Leave Term month 12, select "Reverse rule of 78", wait for the re-render | Row 1 Monthly 0.0128 rising to 0.1538 on row 12 | Type box = "Reverse rule of 78"; Monthly = 0.0128 0.0256 0.0385 0.0513 0.0641 0.0769 0.0897 0.1026 0.1154 0.1282 0.1410 0.1538; Cumulative row 8 = "0.4615" | ✅ | Matches the Reverse rule of 78 oracle |
| 3 | Select "Pro-Rata" again, wait, read all 24 values | All 12 Monthly 0.0833; Cumulative row 6 0.5000, row 12 1.0000 | Type box = "Pro-Rata"; Monthly = 0.0833 on all 12 rows; Cumulative = 0.0833 0.1667 0.2500 0.3333 0.4167 0.5000 0.5833 0.6667 0.7500 0.8333 0.9167 1.0000 | ✅ | The Reverse rule of 78 path of the bug is fixed |
| 4 | Set Term month 24 + Tab; select "Rule of 78"; then "Pro-Rata" again | After Tab 24 rows; Rule of 78 row 1 = 0.0800; type returns to "Pro-Rata" | After Tab: Term month = "24", 24 rows, all Monthly = "0.0417". With "Rule of 78": row 1 Monthly = "0.0800" falling to "0.0033" on row 24. After switching back: type box = "Pro-Rata" | ✅ | 24-month regeneration still works |
| 5 `[Verification]` | Check 24 rows and read all 48 values | 24 rows; every Monthly 0.0417; Cumulative row 12 0.5000, row 24 1.0000; nothing saved | 24 rows; Monthly = 0.0417 on every row; Cumulative row 12 = "0.5000", row 24 = "1.0000" (full run 0.0417 → 1.0000 in steps of about 0.0417); no Rule of 78 value left; Save not clicked | ✅ | Page left without saving — nothing created |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_002-step5-ProRata24MonthFactors_pass.png` — unsaved create form at Term month 24, type Pro-Rata, 0.0417 on every row (final state)

### AP2485_003 — On an existing 12-month Rule of 78 curve, changing the type to Pro-Rata saves Pro-Rata factors — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/admin/earning-curve` and click "Create New" | "Create earning curve" with Term month 12 and "Pro-Rata" | Heading = "Create earning curve"; Term month = "12"; type box = "Pro-Rata" | ✅ | — |
| 2 `[Pre-Condition]` | Select "Rule of 78", enter Name `QA-AP2485-Edit-033346`, odometer 0 / 10000, Save | Alert "Earning curve saved"; first row 12 / "Rule of 78" | Before save: Monthly = 0.1538 … 0.0128. After save: alert = "Earning curve saved"; first row = "QA-AP2485-Edit-033346 · 12 · 0 - 10000 · Rule of 78 · Yes"; pencil href = /admin/earning-curve/15/edit | ✅ | Curve id 15 created on Dev by this run |
| 3 | Click the pencil on that row, select "Pro-Rata", wait | Page "Earning curve #15" opens with "Rule of 78", row 1 = 0.1538; after the switch "Pro-Rata" and every Monthly 0.0833 | Heading = "Earning curve #15"; type box = "Rule of 78"; Monthly = 0.1538 … 0.0128. After the switch: URL still /admin/earning-curve/15/edit; type box = "Pro-Rata"; Monthly = 0.0833 on all 12 rows; Cumulative row 6 = "0.5000", row 12 = "1.0000" | ✅ | The edit page regenerates correctly too |
| 4 | Check Name and odometer still hold their values, Save, reopen the same row | Alert "Earning curve saved"; row reads 12 / "Pro-Rata" under the same id; no duplicate | Name = "QA-AP2485-Edit-033346", from = "0", to = "10000" kept after the re-render (no re-entry needed). After save: alert = "Earning curve saved"; first row = "QA-AP2485-Edit-033346 · 12 · 0 - 10000 · Pro-Rata · Yes" with href /admin/earning-curve/15/edit; rows with that name = 1 | ✅ | Same id 15, no duplicate row |
| 5 `[Verification]` | On the reopened edit page, check the type and read all 24 stored values | Type "Pro-Rata"; every Monthly 0.0833; Cumulative row 6 0.5000, row 12 1.0000; no Rule of 78 value | Heading = "Earning curve #15"; type box = "Pro-Rata"; 12 rows; Monthly = 0.0833 on every row; Cumulative = 0.0833 0.1667 0.2500 0.3333 0.4167 0.5000 0.5833 0.6667 0.7500 0.8333 0.9167 1.0000 | ✅ | The stored curve carries Pro-Rata factors |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2485/AP2485_003-step5-EditedCurveProRataFactors_pass.png` — reopened curve #15 showing type Pro-Rata and 0.0833 on every row (final state)

---

## Environment Observations

- **Environment: Dev (v2dev)**, by the user's decision for this batch. The test-case file's Execution Context still names v2staging as the environment; Dev was used instead, as instructed. The login, routes, form behaviour and the bootstrap-select type control matched the Execution Context exactly.
- The `env-check` source is `missing`, so its smoke test could not be run; the environment health check had already passed upstream (orchestrator), and the admin login and Earning Curves list loaded normally.
- The admin login page logs a JavaScript error on load (`ReferenceError: $ is not defined` at /admin/login line 230). It did not stop the login and is unrelated to this ticket.
- **Left behind on Dev** (earning curves have no delete control): curve **#14** `QA-AP2485-Repro-033220` (12 months, Pro-Rata, odometer 0 – 10000) and curve **#15** `QA-AP2485-Edit-033346` (12 months, created as Rule of 78 and saved as Pro-Rata, odometer 0 – 10000). AP2485_002 saved nothing.
- No earning curve this run did not create was modified.

# Test Cases — AP2471 (File 2 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2471 — Admin: Earning Curve management
**Source:** requirements/AP-2471-admin-earning-curve-management.md · qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2471_test-plan.md
**Date:** 2026-11-01 (revised for the 2026-11-01 cycle; first designed 2026-10-03)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2471_006 to AP2471_010 (5 test cases)
**Coverage:** Functional · Edge-case · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-curve` — Earning Curves list (admin sidebar → Risk Management rail button → Earning Curves). **Create New** opens `/admin/earning-curve/new/edit`; a row's pencil (Edit) button opens `/admin/earning-curve/{id}/edit`. Changing Earning curve type, or changing Term month and leaving the field (Tab), re-posts the form and redraws the table. | `navigation` → `domain` (`qa-docs/earning-curves.md`, mapped 2026-10-04) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Designed against v2staging. The 2026-11-02 s4 run is on **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/` (user decision for this run) | `env` → "Dev Environment" |
| **Login** | Admin — the admin login and password held in the `env` source (`execute.env.md`; for Dev, `ADMIN_USERNAME` / `ADMIN_PASSWORD` in its "Dev Environment" section) at `/admin/login`. Never copy them into this file. The login page is in French: "Courriel", "Mot de passe", "Se connecter" (fields `_username` / `_password`). | `env` |
| **Test data** | None static beyond the login. Every earning curve is created by the case that needs it. **Never edit or delete a curve this run did not create** — that includes seeded curves 1–6, the AP-2472 curves 7–8 and the previous AP-2471 cycle's curves 9–13 (curve 13 holds AP-2485's evidence). | `test-data`, `domain` |
| **Language** | EN admin UI | `navigation` |
| **Leaves behind** | AP2471_010 saves one curve named `QA-AP2471-Custom-<HHMM>`. AP2471_006–009 save nothing. | `cleanup` (missing) |

**Reading factor values.** Monthly Factor and Cumulative Factor cells are input boxes, so their numbers are not in the page text. Read them with `browser.evaluate`, for example `[...document.querySelectorAll('input[name$="[monthlyFactor]"]')].map(i => i.value)` and the same with `[cumulativeFactor]`. Compare against the oracle in the test plan §8.1, which is repeated in each case's Test Data, at the precision the page displays. **The scale is Judgement question Q-004** — a percentage (8.3333) or a fraction (0.0833) is recorded, never failed, as long as one scale is used throughout. Only a value that differs from the oracle on the page's own scale is a failure.

**Saving.** The ticket does not describe the save button (Q-001, Blocking, still open). The `domain` source names it **Save**. Click it, and **record** its label, the message shown and the landing URL. These are never judged until Q-001 is answered; a case judges only what the user story promises — that the curve is stored and shown again.

**Known blockers:** None.

**Revisions — 2026-11-01.** All five cases were reset to Not Run for the new cycle; previous results are kept in each case's Result row. AP2471_006 cites Q-007 (Answered) for the formula oracle. AP2471_008–010 show both factor scales, and AP2471_009–010 type their Custom factors in the scale the page uses (Q-004 is record-only). AP2471_010 records the save message for Q-001 instead of judging it.


**Revisions — 2026-11-02.** Clear-text login and password removed from the Execution Context (and from AP2471_001 step 1 where present); the login now points to the `env` source. Environment row notes the s4 run on Dev (v2dev). Statuses and Result rows updated from the 2026-11-02 Dev run. By the user's decision of 2026-11-02 ("explore in the dev env and accept the actual result"), every open question these cases record against is answered by what Dev did (see the requirements analysis), so record-only steps were judged PASS where Dev behaved consistently with no objective fault. Confirmed by: stlc-ticket-pipeline s4, 2026-11-02, on the user's instruction.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2471_006 | Choosing Reverse Rule of 78 on a 12-month curve back-loads earning, with month 8 cumulative at 46.15% | Functional | High | PASS |
| AP2471_007 | Changing Term month to 24 rebuilds the table with 24 rows and recalculates Rule of 78 over 300 | Edge-case | High | PASS |
| AP2471_008 | A 1-month term gives one row of 100% for each predefined type, and a 60-month term gives 60 rows | Edge-case | Medium | PASS |
| AP2471_009 | With the Custom type, the monthly factors become editable and the cumulative factor recalculates on every change | Regression | High | PASS |
| AP2471_010 | A Custom curve with typed factors saves, and reopening it shows the same factors | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2471_006 — Choosing Reverse Rule of 78 on a 12-month curve back-loads earning, with month 8 cumulative at 46.15%

| Field | Value |
|---|---|
| **TC ID** | AP2471_006 |
| **Title** | Choosing Reverse Rule of 78 on a 12-month curve back-loads earning, with month 8 cumulative at 46.15% |
| **Requirement** | AP2471 — REQ-005 (AC 1, AC 4 — the formula is the expected value per Q-007, Answered: "the table is generated based the earning type calculations mentioned in the ticket's description") |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Reverse rule of 78: 0.0128 → 0.1538; row 8 cumulative 0.4615 (formula). All 24 values match. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Reverse rule of 78: 0.0128 to 0.1538; row 8 cumulative 0.4615 (formula value). All 24 values match. |

**Why this matters:** The ticket's own example table is wrong at row 8: it shows 53.85%, but the formula gives 36/78 = 46.15%. If the app shows 53.85, the developer copied the table instead of implementing the formula. The cumulative column would then not be monotonic with its monthly factors, and the error would carry into every Reverse curve. **Use the values below, not the ticket's table.**

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month | 12 | Default |
| Earning curve type | Reverse rule of 78 | |
| Expected Monthly Factor, rows 1–12 | 1.2821 · 2.5641 · 3.8462 · 5.1282 · 6.4103 · 7.6923 · 8.9744 · 10.2564 · 11.5385 · 12.8205 · 14.1026 · 15.3846 | m / 78 |
| Expected Cumulative Factor, rows 1–12 | 1.28 · 3.85 · 7.69 · 12.82 · 19.23 · 26.92 · 35.90 · **46.15** · 57.69 · 70.51 · 84.62 · 100.00 | m(m+1)/2 / 78 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens with Term month 12. |
| 2 | Select "Reverse rule of 78" in "Earning curve type" | The table regenerates with 12 rows. |
| 3 | Read every Monthly Factor and Cumulative Factor value in rows 1–12 | All 24 values are captured in the log. |
| 4 | [Verification] Verify each value equals the Test Data row by row, paying particular attention to row 8's cumulative | Monthly factors rise from 1.2821 to 15.3846. Cumulative factors run 1.28 → 100.00, and row 8 reads 46.15, not 53.85. |

---

### AP2471_007 — Changing Term month to 24 rebuilds the table with 24 rows and recalculates Rule of 78 over 300

| Field | Value |
|---|---|
| **TC ID** | AP2471_007 |
| **Title** | Changing Term month to 24 rebuilds the table with 24 rows and recalculates Rule of 78 over 300 |
| **Requirement** | AP2471 — REQ-004 (AC 5), REQ-005 (AC 2, AC 3) |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Term 24 regenerates on Tab (form re-post) to 24 rows; Rule of 78 spot rows 0.0800/0.0800 … 0.0033/1.0000; Pro-Rata 0.0417 each, 0.5000 at row 12, 1.0000 at row 24. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Term 24 regenerates on blur to 24 rows; Rule of 78 spot rows match (0.0800 ... 0.0033 / 1.0000); Pro-Rata 0.0417 each, 0.5000 at row 12, 1.0000 at row 24. |

**Why this matters:** The ticket's examples are all 12 months. A hard-coded 78 denominator, or a table that does not regrow, would look correct at the default and break for every other term. The ticket itself cites 24 months (denominator 300).

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Earning curve type | Rule of 78 | Selected first, at 12 months |
| Term month | 24 | Typed over the default 12 |
| Expected Rule of 78 spot rows (monthly / cumulative) | row 1: 8.0000 / 8.00 · row 2: 7.6667 / 15.67 · row 12: 4.3333 / 74.00 · row 23: 0.6667 / 99.67 · row 24: 0.3333 / 100.00 | Denominator 300 |
| Expected Pro-Rata at 24 (row 1 / row 12 / row 24) | 4.1667 / 4.17 · 4.1667 / 50.00 · 4.1667 / 100.00 (± 0.01) | 24 × 4.1667 = 100.0008 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve`, click "Create New" and select "Rule of 78" | The form shows a 12-row Rule of 78 table. |
| 2 | Clear "Term month", type `24` and move focus out of the field (press Tab) | The table regenerates. Record whether it happens on typing, on blur or only after another action. |
| 3 | [Verification] Verify the table has exactly 24 rows numbered 1–24, and that rows 1, 2, 12, 23 and 24 match the Rule of 78 spot values | There are 24 rows. Row 1 is 8.0000 / 8.00 and row 24 is 0.3333 / 100.00, with the other spot rows matching too. |
| 4 | Select "Pro-Rata" in "Earning curve type" | The table regenerates with 24 rows. |
| 5 | [Verification] Verify rows 1, 12 and 24 match the Pro-Rata values at 24 months | Every monthly factor is 4.1667, and the cumulative reads 4.17, 50.00 and 100.00 (± 0.01) at rows 1, 12 and 24. |

---

### AP2471_008 — A 1-month term gives one row of 100% for each predefined type, and a 60-month term gives 60 rows

| Field | Value |
|---|---|
| **TC ID** | AP2471_008 |
| **Title** | A 1-month term gives one row of 100% for each predefined type, and a 60-month term gives 60 rows |
| **Requirement** | AP2471 — REQ-004 (AC 5), REQ-005 |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Term 1: one row 1.0000/1.0000 for all three types. Term 60 Rule of 78: 60 rows, row 1 = 0.0328, row 60 = 0.0005 / 1.0000. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Term 1: one row 1.0000 / 1.0000 for all three types. Term 60 Rule of 78: 60 rows, row 1 = 0.0328, row 60 = 0.0005 / 1.0000 (not zero). |

**Why this matters:** Boundary value analysis (testing the exact edges of an allowed range, where off-by-one mistakes hide) puts the smallest legal term at 1 month. That is the case where the formulas' denominators collapse to 1. A long term like 60 months checks that small factors are not rounded to 0.0000 at 4 decimals.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month (low) | 1 | Expected: 1 row, monthly 100.0000, cumulative 100.00, for Pro-Rata, Rule of 78 and Reverse |
| Term month (high) | 60 | Expected: 60 rows |
| Expected at 60, Rule of 78 | row 1 monthly 3.2787 (0.0328) · row 60 monthly 0.0546 (0.0005) · row 60 cumulative 100.00 (1.0000) | Denominator 1830. Values in brackets are the 4-decimal fraction scale |
| Expected at 60, Pro-Rata | 1.6667 every row | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens. |
| 2 | Set "Term month" to `1` and press Tab, then switch "Earning curve type" through "Pro-Rata", "Rule of 78" and "Reverse rule of 78", reading the table each time | Each type shows a single row: Earning point 1, Monthly 100.0000, Cumulative 100.00. Record any error or blank. |
| 3 | Set "Term month" to `60`, press Tab, and select "Rule of 78" | The table regenerates. |
| 4 | [Verification] Verify the table has 60 rows, row 1 monthly is 3.2787 (0.0328), row 60 monthly is 0.0546 (0.0005) and not zero, and row 60 cumulative is 100.00 (1.0000) ± 0.01 percentage points | There are 60 rows. The smallest factor is 0.0546% (0.0005) and is not rounded away to zero, and the curve ends at 100.00%. |

---

### AP2471_009 — With the Custom type, the monthly factors become editable and the cumulative factor recalculates on every change

| Field | Value |
|---|---|
| **TC ID** | AP2471_009 |
| **Title** | With the Custom type, the monthly factors become editable and the cumulative factor recalculates on every change |
| **Requirement** | AP2471 — REQ-006 (AC 1, AC 2) |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Custom boxes editable, start 0.0000; cumulative recalculates in the browser: 0.4/0.7/0.9/1.0, then 0.4/0.65/0.85/0.95. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Custom makes monthly boxes editable (start 0.0000); cumulative recalculates live: 0.40/0.70/0.90/1.00, then 0.40/0.65/0.85/0.95. |

**Why this matters:** Ken Nguyen reported on 2026-09-24 that "cumulative factor is not recalculated" for Custom. This case re-tests exactly that half of the reported defect. AP2471_010 re-tests the save half.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month | 4 | Small, so every row can be checked |
| Earning curve type | Custom | |
| Scale to type in | The scale the predefined types show on this page: fractions if Pro-Rata at 12 months shows 0.0833, percentages if it shows 8.3333 | Q-004 is Judgement — record which scale was used |
| Monthly factors typed | fraction: `0.4000` · `0.3000` · `0.2000` · `0.1000` — or percentage: `40.0000` · `30.0000` · `20.0000` · `10.0000` | Total 100% |
| Expected cumulative after typing | 0.4000 · 0.7000 · 0.9000 · 1.0000 (or 40.00 · 70.00 · 90.00 · 100.00) | Running total (Q-003, Answered) |
| Change | row 2 → `0.2500` (or `25.0000`) | |
| Expected cumulative after change | 0.4000 · 0.6500 · 0.8500 · 0.9500 (or 40.00 · 65.00 · 85.00 · 95.00) | Rows 2–4 must all move |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve`, click "Create New", set "Term month" to `4` and press Tab | The form shows a 4-row table. |
| 2 | Select "Custom" in "Earning curve type" | The Monthly Factor cells become editable text boxes. Record what values they start with (blank, zero, or the previous type's values) for Q-010. |
| 3 | Type the four monthly factors from the Test Data (`0.4000`, `0.3000`, `0.2000`, `0.1000` on a fraction page) into the Monthly Factor boxes of rows 1–4, pressing Tab after each | The Cumulative Factor column reads 0.4000, 0.7000, 0.9000 and 1.0000 (40.00 … 100.00 on a percentage page). |
| 4 | Change the row 2 Monthly Factor to `0.2500` (`25.0000` on a percentage page) and press Tab | The cumulative column updates. Record whether the page reloads. |
| 5 | [Verification] Verify the Cumulative Factor column now reads 0.4000, 0.6500, 0.8500 and 0.9500 (40.00, 65.00, 85.00, 95.00) | All three rows from row 2 down have recalculated to the new running total. |

---

### AP2471_010 — A Custom curve with typed factors saves, and reopening it shows the same factors

| Field | Value |
|---|---|
| **TC ID** | AP2471_010 |
| **Title** | A Custom curve with typed factors saves, and reopening it shows the same factors |
| **Requirement** | AP2471 — REQ-006 (AC 1, AC 3 — from the reporter's comment of 2026-09-24), REQ-007 (user-story minimum only: "I can create, edit and delete earning curves". The save message and landing page are recorded for Q-001, never judged) |
| **Route** | `/admin/earning-curve` → "Create New" → save → "Edit" |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** QA-AP2471-Custom-190721 saved (curve #32, "Earning curve saved"); reopened with 0.4/0.3/0.2/0.1 and every field intact. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. QA-AP2471-Custom-0043 (id 9) saved with "Save" and "Earning curve saved"; reopened with factors 0.4/0.3/0.2/0.1 intact. Reported defect fixed. |

**Why this matters:** This is the exact defect the reporter raised: "The manual input does not save". If it still fails, an admin cannot create a Custom curve at all, and one of the four promised curve types does not exist in practice.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2471-Custom-<HHMM>` (current time, e.g. `QA-AP2471-Custom-1432`) |
| Term month | 4 |
| Coverage odometer from / to | `0` / `60000` |
| Earning curve type | Custom |
| Is Enabled? | Yes |
| Monthly factors | `0.4000` · `0.3000` · `0.2000` · `0.1000` on a fraction page, or `40.0000` · `30.0000` · `20.0000` · `10.0000` on a percentage page (Q-004, record which) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens. |
| 2 | Enter "Name" `QA-AP2471-Custom-<HHMM>`, "Term month" `4` (Tab), select "Custom", set "Is Enabled?" to Yes, type the four monthly factors from the Test Data, and **last** "Coverage odometer from" `0` and "Coverage odometer to" `60000` (a type or term change re-posts the form) | The form shows the values, and the cumulative column reads 0.4000 / 0.7000 / 0.9000 / 1.0000 (or 40.00 … 100.00). |
| 3 | Click **Save** | No error page appears. Record the message and the landing URL for Q-001. |
| 4 | Open `/admin/earning-curve`, find the row named `QA-AP2471-Custom-<HHMM>` and click its "Edit" (pencil) action | The edit form opens for that curve. |
| 5 | [Verification] Verify the form shows Name `QA-AP2471-Custom-<HHMM>`, Term month 4, odometer 0 and 60000, type Custom, Is Enabled? ticked, and the four typed Monthly Factors with cumulative 0.4000 / 0.7000 / 0.9000 / 1.0000 (or 40.00 … 100.00) | Every value typed in step 2 has been stored and is shown again. In particular, the four custom factors are not reset to blank, zero or Pro-Rata values. |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 — Table regenerates on Term month change | — | — | AP2471_007, AP2471_008 | — |
| REQ-005 — Reverse Rule of 78 | AP2471_006 | — | — | — |
| REQ-005 — Calculations at terms other than 12 | — | — | AP2471_007, AP2471_008 | — |
| REQ-006 — Custom: editable factors, cumulative recalculation | — | — | — | AP2471_009 |
| REQ-006 / REQ-007 — Custom factors persist after save | — | — | — | AP2471_010 |

---

## Execution Log

> Executed 2026-11-02 on Dev (v2dev), run folder `no-sprint`: AP2471_006 PASS, AP2471_007 PASS, AP2471_008 PASS, AP2471_009 PASS, AP2471_010 PASS. Full step results, screenshots and the answers to the open questions are in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. The previous cycle (2026-10-04, staging) stays in `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2471_2026-10-04.md`.

# Test Cases — AP2471 (File 1 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2471 — Admin: Earning Curve management
**Source:** requirements/AP-2471-admin-earning-curve-management.md · qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2471_test-plan.md
**Date:** 2026-11-01 (revised for the 2026-11-01 cycle; first designed 2026-10-03)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2471_001 to AP2471_005 (5 test cases)
**Coverage:** Functional · UI · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin | `navigation` |
| **Entry route** | `/admin/earning-curve` — Earning Curves list (admin sidebar → Risk Management rail button → Earning Curves). **Create New** opens `/admin/earning-curve/new/edit`; a row's pencil (Edit) button opens `/admin/earning-curve/{id}/edit`. Changing Earning curve type, or changing Term month and leaving the field (Tab), re-posts the form and redraws the table. | `navigation` → `domain` (`qa-docs/earning-curves.md`, mapped 2026-10-04) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Designed against v2staging. The 2026-11-02 s4 run is on **Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/` (user decision for this run) | `env` → "Dev Environment" |
| **Login** | Admin — the admin login and password held in the `env` source (`execute.env.md`; for Dev, `ADMIN_USERNAME` / `ADMIN_PASSWORD` in its "Dev Environment" section) at `/admin/login`. Never copy them into this file. The login page is in French: "Courriel", "Mot de passe", "Se connecter" (fields `_username` / `_password`). | `env` |
| **Test data** | None static beyond the login. Every earning curve is created by the case that needs it. **Never edit or delete a curve this run did not create** — that includes seeded curves 1–6, the AP-2472 curves 7–8 and the previous AP-2471 cycle's curves 9–13 (curve 13 holds AP-2485's evidence). | `test-data`, `domain` |
| **Language** | EN admin UI. The login page is always French. | `navigation` |
| **Leaves behind** | AP2471_001–005 save nothing. They open the form without saving it. | `cleanup` (missing) |

**Reading factor values.** Monthly Factor and Cumulative Factor cells are input boxes, so their numbers are not in the page text. Read them with `browser.evaluate`, for example `[...document.querySelectorAll('input[name$="[monthlyFactor]"]')].map(i => i.value)` and the same with `[cumulativeFactor]`. Compare against the oracle in the test plan §8.1, which is repeated in each case's Test Data, at the precision the page displays. **The scale is Judgement question Q-004** — a percentage (8.3333) or a fraction (0.0833) is recorded, never failed, as long as one scale is used throughout. Only a value that differs from the oracle on the page's own scale is a failure.

**Known blockers:** None.

**Revisions — 2026-11-01.** All five cases were reset to Not Run for the new cycle; previous results are kept in each case's Result row. AP2471_001 cites Q-013 (Answered) for the icon placement. AP2471_004 and AP2471_005 accept either factor scale (Q-004 is record-only) and AP2471_004 ties its row-12 check to the ticket's 100.00% example (Q-008 is record-only).


**Revisions — 2026-11-02.** Clear-text login and password removed from the Execution Context (and from AP2471_001 step 1 where present); the login now points to the `env` source. Environment row notes the s4 run on Dev (v2dev). Statuses and Result rows updated from the 2026-11-02 Dev run. By the user's decision of 2026-11-02 ("explore in the dev env and accept the actual result"), every open question these cases record against is answered by what Dev did (see the requirements analysis), so record-only steps were judged PASS where Dev behaved consistently with no objective fault. Confirmed by: stlc-ticket-pipeline s4, 2026-11-02, on the user's instruction.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2471_001 | The admin menu shows "Earning Curves" under the tachometer-icon Risk Management section, and opens the list | Functional | Medium | PASS |
| AP2471_002 | The Earning Curves page shows its title, a "Create New" item and a list with the six required columns | Functional | Medium | PASS |
| AP2471_003 | A new earning curve form opens with Term month 12, type Pro-Rata and a 12-row earning points table | Functional | High | PASS |
| AP2471_004 | A 12-month Pro-Rata curve earns 8.3333% every month and the cumulative factor reaches 100% at month 12 | Functional | High | PASS |
| AP2471_005 | Choosing Rule of 78 on a 12-month curve front-loads earning: 15.3846% in month 1 down to 1.2821% in month 12 | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2471_001 — The admin menu shows "Earning Curves" under the tachometer-icon Risk Management section, and opens the list

| Field | Value |
|---|---|
| **TC ID** | AP2471_001 |
| **Title** | The admin menu shows "Earning Curves" under the tachometer-icon Risk Management section, and opens the list |
| **Requirement** | AP2471 — REQ-001 (AC 1, AC 2 — icon placement per Q-013, Answered: "the icon `fa-tachometer-alt-average` belongs to the **Risk Management** section … 'Earning Curves' is a plain-text item in that section's flyout"), REQ-002 (AC 1) |
| **Route** | `/admin` — Admin home, sidebar |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** "Risk Management" heading icon = `nav-icon fad fa-tachometer-alt-average`; flyout lists Earning Curves, Earning Sets, Earning Groups, Earning Assignments with no item icons; click opens `/admin/earning-curve` headed "Earning Curves". Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. The "RISK MANAGEMENT" heading carries `fa-tachometer-alt-average`. Its flyout lists Earning Curves, Earning Sets, Earning Groups and Earning Assignments, and "Earning Curves" has no icon of its own, as in the reporter's mock-up. Clicking it opens `/admin/earning-curve`, headed "Earning Curves". |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-10-04 | Step 2 expected result: the `fa-tachometer-alt-average` icon belongs to the **Risk Management section** (its sidebar rail button), not to the "Earning Curves" link. "Earning Curves" is a plain-text item in that section's flyout. Title updated to match. | The 2026-10-04 FAIL was not a bug. The reporter's mock-up on AP-2471 (`Screenshot 2026-09-18 at 4.47.19 PM.png`) shows the tachometer on the Risk Management rail button and "Earning Curves" as plain text under "RISK MANAGEMENT", so the build matches it. | Vinh Le (QA), Gate C, 2026-10-04 |
| 2026-11-02 | Step 1: the clear-text login and password replaced by a reference to the `env` source. | Credentials must not be copied into test-case files. | stlc-ticket-pipeline s4, 2026-11-02 |

**Why this matters:** The menu item is the only way an admin finds the feature. If it is missing or placed under the wrong section, the screen exists but nobody can use it.

**Test Data:**

| Variable | Value |
|---|---|
| Section heading | Risk Management |
| Menu item | Earning Curves |
| Icon class (on the Risk Management section, not the item) | `fa-tachometer-alt-average` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open `/admin/login`, enter "Courriel" and "Mot de passe" with the admin login and password from the `env` source, click **"Se connecter"** | The admin home page `/admin` loads and shows "Welcome to the admin". |
| 2 | [Verification] Click the tachometer button in the left sidebar rail to open its flyout. Verify the flyout is headed "Risk Management" and lists an "Earning Curves" link, and that the section heading's icon element has the class `fa-tachometer-alt-average` (check with `browser.evaluate` on the "Risk Management" heading's `<i>` element) | The tachometer button opens a flyout headed "RISK MANAGEMENT" with "Earning Curves" as its first item, matching the reporter's mock-up. The Risk Management heading's icon carries the class `fa-tachometer-alt-average`. The "Earning Curves" item itself is plain text with no icon of its own. |
| 3 | Click "Earning Curves" in the sidebar | The browser goes to `/admin/earning-curve`. |
| 4 | [Verification] Verify the page that opened is the Earning Curves page | The URL is `/admin/earning-curve` and the page heading reads "Earning Curves". |

---

### AP2471_002 — The Earning Curves page shows its title, a "Create New" item and a list with the six required columns

| Field | Value |
|---|---|
| **TC ID** | AP2471_002 |
| **Title** | The Earning Curves page shows its title, a "Create New" item and a list with the six required columns |
| **Requirement** | AP2471 — REQ-002 (AC 1–5) |
| **Route** | `/admin/earning-curve` — Earning Curves list |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Title "Earning Curves", one "Create New" item, six headers in order, odometer "0 - 60000", pencil Edit with tooltip "Edit" and no other row action. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Title "Earning Curves", one "Create New" item, six columns in order, odometer "0 - 50000", pencil Edit action with "Edit" tooltip. |

**Why this matters:** The list is how an admin tells which curve covers which term and mileage. A missing or wrongly built "Coverage odometer" column would let two curves look the same.

**Test Data:**

| Variable | Value |
|---|---|
| Page title | Earning Curves |
| Nav item | Create New |
| Columns, in order | Name · Term month · Coverage odometer · Earning curve type · Is Enabled? · Actions |
| Row action | Edit |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open `/admin/earning-curve` | The Earning Curves page loads. |
| 2 | [Verification] Verify the page title is "Earning Curves" and the navigation area offers exactly one item, "Create New" | The title reads "Earning Curves", and "Create New" is shown as a navigation item or button. |
| 3 | [Verification] Verify the datagrid's column headers are, in order, "Name", "Term month", "Coverage odometer", "Earning curve type", "Is Enabled?" and "Actions" | All six headers are present in that order. Any extra column is recorded in the log. |
| 4 | [Verification] If at least one row exists, verify the "Coverage odometer" cell shows two numbers joined as "from - to", and the "Actions" cell offers "Edit". If the list is empty, record the empty-state message instead. | Each row's odometer cell reads like "0 - 100000", and each row has an "Edit" action. Or the empty-state text is recorded. |

---

### AP2471_003 — A new earning curve form opens with Term month 12, type Pro-Rata and a 12-row earning points table

| Field | Value |
|---|---|
| **TC ID** | AP2471_003 |
| **Title** | A new earning curve form opens with Term month 12, type Pro-Rata and a 12-row earning points table |
| **Requirement** | AP2471 — REQ-003 (AC 1–7), REQ-004 (AC 1–3) |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** `/admin/earning-curve/new/edit` "Create earning curve": Name text, Term month 12 (min 1, max 999), odometer numeric, Pro-Rata selected of 4 options, Is Enabled? checkbox ticked; 12 rows 1–12 of 0.0833, read-only under Pro-Rata. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Form at /admin/earning-curve/new/edit: Term 12, Pro-Rata, 4 type options, Is Enabled? checkbox ticked, 12 read-only rows of 0.0833 (fraction scale). |

**Why this matters:** The defaults decide what an admin gets if they change nothing. A wrong default type or term would quietly produce the wrong curve.

**Test Data:**

| Variable | Value |
|---|---|
| Expected fields | Name (text) · Term month (numeric, default 12) · Coverage odometer from (numeric) · Coverage odometer to (numeric) · Earning curve type (select) · Is Enabled? (Yes/No toggle) · Earning points table |
| Expected type options | Pro-Rata (default) · Rule of 78 · Reverse rule of 78 · Custom |
| Expected table columns | Earning point · Monthly Factor · Cumulative Factor |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open `/admin/earning-curve` | The Earning Curves page loads. |
| 2 | Click "Create New" | A new page opens with an empty earning curve form. Record its URL in the log. |
| 3 | [Verification] Verify the form has the fields "Name" (text input), "Term month" (numeric input showing **12**), "Coverage odometer from" and "Coverage odometer to" (numeric inputs), "Earning curve type" (a select showing **Pro-Rata**, with options Pro-Rata, Rule of 78, Reverse rule of 78 and Custom), and "Is Enabled?" (a Yes/No toggle — record its default) | Every field is present with the input type stated. Term month shows 12, the type shows Pro-Rata, and all four type options are listed. |
| 4 | [Verification] Verify the earning points table has the columns "Earning point", "Monthly Factor" and "Cumulative Factor", has exactly **12** rows numbered 1 to 12, and that Monthly Factor values show 4 decimals. Record whether the Monthly Factor boxes are editable while the type is Pro-Rata (observation for Q-010). | The table has 3 columns and 12 rows numbered 1–12, and Monthly Factor values carry 4 decimals. Editability is recorded. |

---

### AP2471_004 — A 12-month Pro-Rata curve earns 8.3333% every month and the cumulative factor reaches 100% at month 12

| Field | Value |
|---|---|
| **TC ID** | AP2471_004 |
| **Title** | A 12-month Pro-Rata curve earns 8.3333% every month and the cumulative factor reaches 100% at month 12 |
| **Requirement** | AP2471 — REQ-005 (AC 1, AC 2), REQ-004 (AC 4 — cumulative is the running total per Q-003, Answered: "recalculate the cumulative sum") |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Rule of 78 → Pro-Rata regenerates to 0.0833 × 12, cumulative 0.0833 → 1.0000 (fraction scale; last factor not adjusted). AP-2485 fix holds. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): FAIL. At 12 months, switching Rule of 78 (or Reverse) back to Pro-Rata keeps the previous type's factors (row 1 = 0.1538) under the Pro-Rata label. Reproduced 4/4; 24 and 60 months are fine. |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Test Data: the fraction equivalents are added, the scale is made record-only (Q-004), and the row-12 tolerance is tied to the ticket's own 100.00% example while *how* it reaches 100% is record-only (Q-008). Status reset to Not Run for the new cycle. | Open-question Impact rules applied in the 2026-11-01 re-run: no PASS/FAIL may hang on a Judgement question. | stlc-ticket-pipeline s3, 2026-11-01 |

**Why this matters:** Pro-Rata is the default type, so most curves will use it. The description gives its formula as `monthly factor = 1 / {totalMonths}`, constant on every row. A build still using the old formula (1/N × month) would show a monthly factor that grows each month. In the previous cycle this case failed: switching a 12-month curve to Rule of 78 and back to Pro-Rata kept the Rule of 78 factors. That defect is **AP-2485** (High, in QC on 2026-11-01). If it recurs, Gate C links this failure to AP-2485 instead of filing a new bug.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month | 12 | Default |
| Earning curve type | Pro-Rata | Default |
| Expected Monthly Factor, every row | 8.3333 (percentage) or 0.0833 (fraction) | 1/12. Which scale the page uses is recorded for Q-004 |
| Expected Cumulative Factor | 8.33 · 16.67 · 25.00 · 33.33 · 41.67 · 50.00 · 58.33 · 66.67 · 75.00 · 83.33 · 91.67 · 100.00 (percentage), or the same ÷ 100 as a fraction | Running total (Q-003, Answered) |
| Row 12 cumulative | Reads 100.00 at 2 decimals (1.0000 as a fraction); ± 0.01 percentage points | The ticket's example shows 100.00%. 12 × 8.3333 = 99.9996, so record the exact value and whether the last factor was adjusted (Q-008, record-only) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens with Term month 12 and type Pro-Rata. |
| 2 | Select "Rule of 78" in "Earning curve type", then select "Pro-Rata" again | The table regenerates each time. This proves the Pro-Rata values come from the type calculation and are not just static placeholders. |
| 3 | Read every Monthly Factor and Cumulative Factor value in rows 1–12 (`browser.evaluate` if they are inputs) | All 24 values are captured in the log. |
| 4 | [Verification] Verify every Monthly Factor equals 1/12 on the page's scale (8.3333 or 0.0833), the Cumulative Factor in each row equals the running total in the Test Data table, and row 12's cumulative reads 100.00 (1.0000) within ±0.01 percentage points | All 12 monthly factors are 1/12, none of them a Rule of 78 value such as 15.3846 / 0.1538. The cumulative factors match 8.33 → 100.00 row by row. The scale and the exact row-12 value are recorded for Q-004 and Q-008. |

---

### AP2471_005 — Choosing Rule of 78 on a 12-month curve front-loads earning: 15.3846% in month 1 down to 1.2821% in month 12

| Field | Value |
|---|---|
| **TC ID** | AP2471_005 |
| **Title** | Choosing Rule of 78 on a 12-month curve front-loads earning: 15.3846% in month 1 down to 1.2821% in month 12 |
| **Requirement** | AP2471 — REQ-005 (AC 1, AC 3) |
| **Route** | `/admin/earning-curve` → "Create New" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Rule of 78: 0.1538 → 0.0128; cumulative 0.7308 at row 6, 1.0000 at row 12. All 24 values match. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Rule of 78 at 12 months: 0.1538 to 0.0128, cumulative 0.7308 at row 6, 1.0000 at row 12. All 24 values match. |

**Why this matters:** Under the Rule of 78, about 73% of the premium is earned by the halfway point. A reversed or mis-indexed formula would book revenue far too early or far too late.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Term month | 12 | Default |
| Earning curve type | Rule of 78 | |
| Expected Monthly Factor, rows 1–12 | 15.3846 · 14.1026 · 12.8205 · 11.5385 · 10.2564 · 8.9744 · 7.6923 · 6.4103 · 5.1282 · 3.8462 · 2.5641 · 1.2821 | (12 − m + 1) / 78 |
| Expected Cumulative Factor, rows 1–12 | 15.38 · 29.49 · 42.31 · 53.85 · 64.10 · 73.08 · 80.77 · 87.18 · 92.31 · 96.15 · 98.72 · 100.00 | Matches the ticket's example table |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens with Term month 12. |
| 2 | Select "Rule of 78" in "Earning curve type" | The earning points table regenerates and still has 12 rows. |
| 3 | Read every Monthly Factor and Cumulative Factor value in rows 1–12 | All 24 values are captured in the log. |
| 4 | [Verification] Verify each Monthly Factor and Cumulative Factor equals the Test Data values row by row, on the page's scale (divide by 100 if the page shows fractions) | Monthly factors fall from 15.3846 to 1.2821 (0.1538 to 0.0128). Cumulative factors run 15.38 → 100.00 and read 73.08 (0.7308) at row 6. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item and icon | AP2471_001 | — | — | — |
| REQ-002 — List page title, nav, columns, Edit action | AP2471_001, AP2471_002 | — | — | — |
| REQ-003 — Form fields and defaults | AP2471_003 | see file 3 (AP2471_013) | — | — |
| REQ-004 — Table columns, numbering, 4 decimals | AP2471_003, AP2471_004 | — | see file 2 | — |
| REQ-005 — Pro-Rata | AP2471_004 | — | — | — |
| REQ-005 — Rule of 78 | AP2471_005 | — | — | — |

---

## Execution Log

> Executed 2026-11-02 on Dev (v2dev), run folder `no-sprint`: AP2471_001 PASS, AP2471_002 PASS, AP2471_003 PASS, AP2471_004 PASS, AP2471_005 PASS. Full step results, screenshots and the answers to the open questions are in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. The previous cycle (2026-10-04, staging) stays in `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2471_2026-10-04.md`.

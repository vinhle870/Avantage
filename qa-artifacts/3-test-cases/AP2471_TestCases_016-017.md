# Test Cases — AP2471 (File 4 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2471 — Admin: Earning Curve management
**Source:** requirements/AP-2471-admin-earning-curve-management.md · qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2471_test-plan.md · qa-artifacts/3-test-cases/AP2471_ReviewFindings_2026-11-01.md (Pass 2 #1 and #2, promoted at Gate B by rule B2)
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2471_016 to AP2471_017 (2 test cases)
**Coverage:** State transition · Regression

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
| **Test data** | None static beyond the login. Each case creates its own curve. **Never edit or delete a curve this run did not create** — that includes seeded curves 1–6, the AP-2472 curves 7–8 and the previous AP-2471 cycle's curves 9–13 (curve 13 holds AP-2485's evidence). | `test-data`, `domain` |
| **Language** | EN admin UI | `navigation` |
| **Leaves behind** | AP2471_016 saves `QA-AP2471-Switch-<HHMM>`; AP2471_017 saves `QA-AP2471-Shorten-<HHMM>`. Neither can be deleted from the UI. | `cleanup` (missing) |

**Reading factor values.** Monthly Factor and Cumulative Factor cells are input boxes, so their numbers are not in the page text. Read them with `browser.evaluate`, for example `[...document.querySelectorAll('input[name$="[monthlyFactor]"]')].map(i => i.value)` and the same with `[cumulativeFactor]`. **The scale is Judgement question Q-004** — type the Custom factors in the scale the predefined types show on this page (fractions if Pro-Rata at 12 months shows 0.0833; percentages if it shows 8.3333), and record which.

**Saving.** The ticket does not describe the save button (Q-001, Blocking, still open). The `domain` source names it **Save**. Click it, and **record** the message and landing URL. They are never judged; these cases judge only that what is stored equals what the form showed.

**What is record-only here.** Both cases exist because of **Q-010** (Judgement, open): what happens to typed Custom factors when the type or the Term month changes. The cases never assert which behaviour is right. They fail only on an objective fault — an error page, a stored curve that differs from what the form showed when Save was clicked, or a row count that differs from Term month — and record the rest for Q-010.

**Known blockers:** None.


**Revisions — 2026-11-02.** Clear-text login and password removed from the Execution Context (and from AP2471_001 step 1 where present); the login now points to the `env` source. Environment row notes the s4 run on Dev (v2dev). Statuses and Result rows updated from the 2026-11-02 Dev run. By the user's decision of 2026-11-02 ("explore in the dev env and accept the actual result"), every open question these cases record against is answered by what Dev did (see the requirements analysis), so record-only steps were judged PASS where Dev behaved consistently with no objective fault. Confirmed by: stlc-ticket-pipeline s4, 2026-11-02, on the user's instruction.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2471_016 | Switching typed Custom factors to Pro-Rata and back, then saving, stores exactly what the form showed | Regression | High | PASS |
| AP2471_017 | Shortening a saved 4-month Custom curve to 3 months stores exactly 3 factors, matching what the form showed | Regression | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2471_016 — Switching typed Custom factors to Pro-Rata and back, then saving, stores exactly what the form showed

| Field | Value |
|---|---|
| **TC ID** | AP2471_016 |
| **Title** | Switching typed Custom factors to Pro-Rata and back, then saving, stores exactly what the form showed |
| **Requirement** | AP2471 — REQ-005 (AC 1: "When the earning type is changed, the table is generated based the earning type calculations"), REQ-006 (AC 1, AC 2), REQ-007 (user-story minimum); Q-010 (Judgement — record-only) |
| **Route** | `/admin/earning-curve/new/edit` (via "Create New") → Save → Edit |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Custom → Pro-Rata shows 0.2500 × 4 read-only; back to Custom resets to 0.0000 × 4; #36 saved and reopened with exactly 0.0000 × 4 (Q-010). Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — |

**Why this matters:** An admin who types Custom factors and briefly looks at another type could lose their work without warning, or — worse — save a curve labelled "Custom" that holds Pro-Rata values. Either way the income schedule of every contract on that curve would differ from what the admin believes. Promoted at Gate B from review proposal #1 (state transition: checking the system ends in the right state after each change).

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Name | `QA-AP2471-Switch-<HHMM>` | Current time, e.g. `QA-AP2471-Switch-0215` |
| Term month | 4 | |
| Custom factors typed | `0.4000` · `0.3000` · `0.2000` · `0.1000` (or `40` · `30` · `20` · `10` on a percentage page) | Cumulative 0.4000 · 0.7000 · 0.9000 · 1.0000 |
| Expected Pro-Rata at 4 months | monthly 0.2500 (25.0000) every row; cumulative 0.2500 · 0.5000 · 0.7500 · 1.0000 (25.00 · 50.00 · 75.00 · 100.00) | 1/4, from the description's `monthly factor = 1 / {totalMonths}` |
| Coverage odometer from / to | `0` / `60000` | Typed last, just before Save |
| Is Enabled? | Ticked (Yes) | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve`, click "Create New", enter "Name" `QA-AP2471-Switch-<HHMM>`, "Term month" `4` (Tab), select "Custom" and type the four Custom factors | The form shows 4 editable rows, and the cumulative column reads 0.4000 / 0.7000 / 0.9000 / 1.0000 (or 40.00 … 100.00). |
| 2 | Select "Pro-Rata" in "Earning curve type" | The table regenerates with 4 rows of the Pro-Rata factor 0.2500 (25.0000) and cumulative 0.25 / 0.50 / 0.75 / 1.00, and none of the typed Custom values remains. Record whether the boxes are now read-only (Q-010). |
| 3 | Select "Custom" in "Earning curve type" again | No error page appears. Record exactly what the four Monthly Factor boxes hold now — the typed values, the Pro-Rata values, zeros or blanks — for Q-010, and note the four values for step 5. |
| 4 | Type "Coverage odometer from" `0` and "to" `60000`, check "Is Enabled?" is ticked, and click **Save** | No error page appears. Record the message and the landing URL. |
| 5 | [Verification] On `/admin/earning-curve`, open the Edit form of `QA-AP2471-Switch-<HHMM>` and read its factors | The curve is stored as type Custom with Term month 4 and 4 rows, its monthly factors equal exactly the four values noted in step 3, and its cumulative column is their running total. No factor shows a value that was not on the form when Save was clicked. |

---

### AP2471_017 — Shortening a saved 4-month Custom curve to 3 months stores exactly 3 factors, matching what the form showed

| Field | Value |
|---|---|
| **TC ID** | AP2471_017 |
| **Title** | Shortening a saved 4-month Custom curve to 3 months stores exactly 3 factors, matching what the form showed |
| **Requirement** | AP2471 — REQ-004 (AC 5: "When the term month field is changed, the table is generated containing the same amount of rows than the months value"), REQ-007 (user-story minimum: edit); Q-010 and Q-009 (Judgement — record-only) |
| **Route** | `/admin/earning-curve/new/edit` → Save → `/admin/earning-curve/{id}/edit` → Save |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Editing #37 from Term 4 to 3 rebuilds 3 rows of 0.0000; saved and reopened with exactly 3 rows of 0.0000; list shows Term 3 (Q-010). Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — |

**Why this matters:** Admins will shorten or lengthen curves after saving them. If the stored curve keeps the old fourth factor, or stores something other than what the form showed, it earns income over a schedule nobody sees on screen. Whether the remaining factors should be kept or recalculated, and whether they must still total 100%, are open (Q-010, Q-009), so those outcomes are recorded. Promoted at Gate B from review proposal #2 (state transition).

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Name | `QA-AP2471-Shorten-<HHMM>` | Current time |
| Term month | 4, then edited to `3` | |
| Custom factors typed at creation | `0.4000` · `0.3000` · `0.2000` · `0.1000` (or `40` · `30` · `20` · `10` on a percentage page) | Total 100% |
| Coverage odometer from / to | `0` / `60000` | Typed last before each Save |
| Is Enabled? | Ticked (Yes) | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve`, click "Create New", enter "Name" `QA-AP2471-Shorten-<HHMM>`, "Term month" `4` (Tab), select "Custom", type the four factors, then odometer `0` / `60000` → **Save** | No error page appears. The list shows `QA-AP2471-Shorten-<HHMM>` with Term month 4 and type Custom. |
| 2 | Click the row's "Edit" (pencil) action | The edit form shows Term month 4, type Custom and the factors 0.4000 / 0.3000 / 0.2000 / 0.1000 (or 40 … 10). |
| 3 | Change "Term month" to `3` and press Tab | The table regenerates with exactly 3 rows numbered 1–3, with no error page. Record the three monthly factors and the row-3 cumulative now shown — kept, recalculated or reset — for Q-010 and Q-009, and note them for step 5. |
| 4 | Check the odometer still reads `0` / `60000` (type it again if the re-post cleared it) and click **Save** | No error page appears. Record the message. |
| 5 | [Verification] On `/admin/earning-curve`, check the row, then open its Edit form and read the factors | The list row shows Term month 3. The Edit form has exactly 3 rows, their monthly factors equal the three values noted in step 3, and the cumulative column is their running total. No fourth factor is shown. |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 AC 5 — row count follows a Term month change on a saved curve | — | — | — | AP2471_017 |
| REQ-005 AC 1 — type change regenerates from Custom to Pro-Rata | — | — | — | AP2471_016 |
| REQ-006 AC 1–2 — Custom factors after a type change (Q-010 record-only) | — | — | — | AP2471_016 |
| REQ-007 — stored curve equals what the form showed (create and edit) | — | — | — | AP2471_016, AP2471_017 |

---

## Execution Log

> Executed 2026-11-02 on Dev (v2dev), run folder `no-sprint`: AP2471_016 PASS, AP2471_017 PASS. Full step results, screenshots and the answers to the open questions are in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. The previous cycle (2026-10-04, staging) stays in `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2471_2026-10-04.md`.

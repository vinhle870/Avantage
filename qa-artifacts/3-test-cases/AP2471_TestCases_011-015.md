# Test Cases — AP2471 (File 3 of 4)

**Project:** Avantage Plus v2 — Admin portal
**Requirement:** AP2471 — Admin: Earning Curve management
**Source:** requirements/AP-2471-admin-earning-curve-management.md · qa-artifacts/1-requirements-analysis/AP-2471_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2471_test-plan.md
**Date:** 2026-11-01 (revised for the 2026-11-01 cycle; first designed 2026-10-03)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2471_011 to AP2471_015 (5 test cases)
**Coverage:** Functional · Negative

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
| **Leaves behind** | AP2471_011 and AP2471_012 save one curve (`QA-AP2471-ProRata-<HHMM>`, renamed to `QA-AP2471-Edited-<HHMM>`). AP2471_013 and AP2471_014 may save curves holding invalid values; any such curve is named `QA-AP2471-Neg-…-<HHMM>`. AP2471_015 is BLOCKED; once unblocked it creates `QA-AP2471-Del-<HHMM>` and deletes only that curve, if delete exists. | `cleanup` (missing) |

**Saving.** The ticket does not describe the save button (Q-001, Blocking, still open). The `domain` source names it **Save**. Click it, and **record** its label, the message shown and the landing URL. These are never judged until Q-001 is answered; a case judges only what the user story promises — that the curve is stored and shown again.

**Negative cases have no written rule — they are record-only.** The ticket defines no validation. Q-005 (Term month limits), Q-006 (odometer range, required fields) and Q-009 (Custom total, negative factors) are **Judgement** questions, still open. AP2471_013 and AP2471_014 therefore never assert that a value must be refused. They fail only on an **objective fault**: an error page or HTTP 5xx, a typed value lost, or a value stored or shown differently from what was typed. Whether each bad value was refused, warned about or saved is **recorded** for its question.

**Known blockers:**

| Missing fact | Affects | Question | Status set |
|---|---|---|---|
| Whether delete is in scope, and what it should do (confirmation, effect on a curve in use) | AP2471_015 | Q-002 (Blocking — unanswered; asked on AP-2471 on 2026-10-03 and again in comment 19435 on 2026-11-01) | BLOCKED at design |

**Revisions — 2026-11-01.** All five cases were reset to Not Run for the new cycle. AP2471_013 and AP2471_014 were rewritten as record-only cases, because their 2026-10-03 expected results asserted answers to open Judgement questions (that bad input must be refused). AP2471_015 is BLOCKED by Q-002 instead of being skipped at run time. AP2471_011 and AP2471_012 show both factor scales. Previous results are kept in each case's Result row.


**Revisions — 2026-11-02.** Clear-text login and password removed from the Execution Context (and from AP2471_001 step 1 where present); the login now points to the `env` source. Environment row notes the s4 run on Dev (v2dev). Statuses and Result rows updated from the 2026-11-02 Dev run. By the user's decision of 2026-11-02 ("explore in the dev env and accept the actual result"), every open question these cases record against is answered by what Dev did (see the requirements analysis), so record-only steps were judged PASS where Dev behaved consistently with no objective fault, and AP2471_015 (blocked at design by Q-002) was run and SKIPPED because Dev has no delete control. Confirmed by: stlc-ticket-pipeline s4, 2026-11-02, on the user's instruction.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2471_011 | A saved Pro-Rata curve appears in the list with its name, term, odometer range, type and enabled state | Functional | High | PASS |
| AP2471_012 | Editing a saved curve's name and type through "Edit" stores the change and updates its list row | Functional | High | PASS |
| AP2471_013 | A blank name, a zero or negative term and an inverted odometer range cause no error page, and each outcome is recorded | Negative | High | PASS |
| AP2471_014 | Custom factors totalling 90%, a negative factor and an emptied factor box cause no error page, and are recorded | Negative | High | PASS |
| AP2471_015 | An admin can delete an earning curve they created, and it disappears from the list | Functional | Medium | SKIPPED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2471_011 — A saved Pro-Rata curve appears in the list with its name, term, odometer range, type and enabled state

| Field | Value |
|---|---|
| **TC ID** | AP2471_011 |
| **Title** | A saved Pro-Rata curve appears in the list with its name, term, odometer range, type and enabled state |
| **Requirement** | AP2471 — REQ-007 (user-story minimum only: "I can create, edit and delete earning curves"; save message recorded for Q-001), REQ-002 (AC 3, AC 4) |
| **Route** | `/admin/earning-curve` → "Create New" → save |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** QA-AP2471-ProRata-190759 saved as #33 and listed as 36 · 0 - 100000 · Pro-Rata · Yes with Edit. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. QA-AP2471-ProRata-0043 (id 10) listed as 36 · 0 - 100000 · Pro-Rata · Yes with Edit. |

**Why this matters:** Saving a predefined curve is the main path through the feature. Its result is also the only place the list's columns can be checked against values we chose ourselves.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2471-ProRata-<HHMM>` |
| Term month | 36 |
| Coverage odometer from / to | `0` / `100000` |
| Earning curve type | Pro-Rata |
| Is Enabled? | Yes |
| Expected Monthly Factor (each of 36 rows) | 2.7778 (0.0278 as a fraction) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens. |
| 2 | Enter "Name" `QA-AP2471-ProRata-<HHMM>`, "Term month" `36` (Tab), "Coverage odometer from" `0`, "Coverage odometer to" `100000`, keep type "Pro-Rata", and set "Is Enabled?" to Yes | The table shows 36 rows of 2.7778 each. |
| 3 | Click **Save** | No error page appears. Record the message and the landing URL for Q-001. |
| 4 | [Verification] Open `/admin/earning-curve` and verify a row exists with Name `QA-AP2471-ProRata-<HHMM>`, Term month 36, Coverage odometer "0 - 100000" (any thousands formatting), Earning curve type Pro-Rata, Is Enabled? Yes, and an "Edit" action | The row is present with exactly these values. |

---

### AP2471_012 — Editing a saved curve's name and type through "Edit" stores the change and updates its list row

| Field | Value |
|---|---|
| **TC ID** | AP2471_012 |
| **Title** | Editing a saved curve's name and type through "Edit" stores the change and updates its list row |
| **Requirement** | AP2471 — REQ-007 (user-story minimum: edit), REQ-002 (AC 5) |
| **Route** | `/admin/earning-curve` → "Edit" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** #33 renamed QA-AP2471-Edited-190835 and switched to Rule of 78 (row 1 = 0.0541); same row, curve count stayed 33. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): PASS. Id 10 renamed to QA-AP2471-Edited-0043 and switched to Rule of 78 (row 1 = 0.0541); same row updated, no duplicate. |

**Why this matters:** The user story promises edit. An edit that creates a duplicate row, or saves the name but not the type, would leave the admin with a curve that says one thing and calculates another.

**Test Data:**

| Variable | Value |
|---|---|
| Curve to edit | `QA-AP2471-ProRata-<HHMM>` from AP2471_011. If it is absent, create it first with Term month 36, odometer 0 / 100000, type Pro-Rata, Is Enabled? Yes. |
| New name | `QA-AP2471-Edited-<HHMM>` |
| New type | Rule of 78 |
| Expected row 1 monthly at 36 months, Rule of 78 | 5.4054 (36/666), or 0.0541 as a fraction |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context and open `/admin/earning-curve`. Find `QA-AP2471-ProRata-<HHMM>`, or create it with Term month `36`, odometer `0` / `100000`, type Pro-Rata, Is Enabled? Yes → save. Note the number of rows in the list. | The curve is listed, and the row count is recorded. |
| 2 | Click "Edit" on that row | The edit form opens, showing the saved values and a 36-row Pro-Rata table. |
| 3 | Change "Name" to `QA-AP2471-Edited-<HHMM>`, select "Rule of 78", check that row 1 Monthly Factor reads 5.4054 (0.0541), then click **Save** | No error page appears. Record the message for Q-001. |
| 4 | [Verification] On `/admin/earning-curve`, verify the row now reads `QA-AP2471-Edited-<HHMM>` / 36 / Rule of 78, the old name is gone, the row count has not changed, and reopening "Edit" shows a Rule of 78 table with row 1 = 5.4054 (0.0541) | The same record has been updated: no duplicate row, and the new type and its factors are stored. |

---

### AP2471_013 — A blank name, a zero or negative term and an inverted odometer range cause no error page, and each outcome is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2471_013 |
| **Title** | A blank name, a zero or negative term and an inverted odometer range cause no error page, and each outcome is recorded |
| **Requirement** | AP2471 — REQ-003 (AC 2–4; no validation stated), Judgement questions Q-005 and Q-006 (record-only) |
| **Route** | `/admin/earning-curve/new/edit` (via "Create New") |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** Blank name, term 0 and term −1 refused with field errors; odometer 50000 / 10000 saves as #34 exactly as typed. Accepted as Dev behaviour (Q-005, Q-006). Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): FAIL. Blank name, term 0 and term -1 are refused. Odometer from 50000 / to 10000 saves (QA-AP2471-Neg-Range, id 11): no rule in ticket — confirm against Q-006. |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Rewritten as a record-only case. The old title and expected results said each bad input must be refused; they now record what happens and fail only on an objective fault. | Q-005 and Q-006 are Judgement questions with no answer. Asserting "refused" was a guessed answer, which the open-question rules forbid. | stlc-ticket-pipeline s3, 2026-11-01 |

**Why this matters:** The ticket defines no validation. A curve with no name cannot be told apart in the list, a curve with zero months has no factors, and an inverted odometer range can never match a vehicle. Nobody has said yet whether the form should stop these (Q-005, Q-006, asked on 2026-10-03). This case gathers the evidence for those answers, and fails only if the form breaks: an error page, or a saved curve whose values differ from what was typed.

**Test Data:**

| Attempt | Name | Term month | Odometer from / to | Record for |
|---|---|---|---|---|
| A | *(blank)* | 12 | 0 / 50000 | Q-006 (required fields) |
| B | `QA-AP2471-Neg-Zero-<HHMM>` | `0` | 0 / 50000 | Q-005 |
| C | `QA-AP2471-Neg-Minus-<HHMM>` | `-1` | 0 / 50000 | Q-005 |
| D | `QA-AP2471-Neg-Range-<HHMM>` | 12 | `50000` / `10000` | Q-006 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve` and click "Create New" | The new earning curve form opens. |
| 2 | Fill attempt A (blank name, Term month 12, odometer 0 / 50000) and click **Save** | No error page or HTTP 5xx appears. Record whether the form saved or refused, and the exact message text, for Q-006. |
| 3 | Fill attempt B (Term month `0`), press Tab, record the table's row count, then click **Save**. Repeat with attempt C (`-1`). | No error page or HTTP 5xx appears for either. Record each message, the row count shown, and whether a curve was saved, for Q-005. |
| 4 | Fill attempt D (odometer from `50000`, to `10000`) with Term month 12, set the odometer fields last, and click **Save** | No error page or HTTP 5xx appears. Record whether the form saved or refused, and any message, for Q-006. |
| 5 | [Verification] Open `/admin/earning-curve` and look for rows from attempts A–D | Every row that exists shows exactly the values its attempt typed (for D: "50000 - 10000"), and no row shows a value nobody typed. Which attempts saved is recorded by letter for Q-005 / Q-006. |

---

### AP2471_014 — Custom factors totalling 90%, a negative factor and an emptied factor box cause no error page, and are recorded

| Field | Value |
|---|---|
| **TC ID** | AP2471_014 |
| **Title** | Custom factors totalling 90%, a negative factor and an emptied factor box cause no error page, and are recorded |
| **Requirement** | AP2471 — REQ-006 (AC 1, AC 2; no total or validation rule stated), Judgement question Q-009 (record-only) |
| **Route** | `/admin/earning-curve/new/edit` (via "Create New") |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): PASS.** 0.90 total and a −0.05 factor save without warning (#35); an emptied box gives "This value should not be blank." under the box, no HTTP 500 (AP-2486 fix holds). #35 holds the last saved attempt. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): FAIL. Factors totalling 0.90 and a -0.05 factor save silently (id 12): no rule in ticket — confirm against Q-009. An empty factor box gives HTTP 500. |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Rewritten as a record-only case. The old title and expected results said a 90% total and a negative factor must be refused; they now record what happens and fail only on an objective fault. The emptied factor box (what typing letters into a number box leaves) is a separate attempt, because an error page there is an objective fault. | Q-009 is a Judgement question with no answer. Asserting "refused" was a guessed answer. | stlc-ticket-pipeline s3, 2026-11-01 |

**Why this matters:** A curve that earns only 90% of the premium would leave 10% of every contract's premium never recognised as income, and a negative factor un-earns income. Nothing in the ticket says whether the form should stop either (Q-009, asked on 2026-10-03), so the outcome is recorded. An error page on an empty factor box is a fault whatever the rule: in the previous cycle it gave HTTP 500, filed as **AP-2486** (Medium, in QC on 2026-11-01). If it recurs, Gate C links it to AP-2486.

**Test Data:**

| Variable | Value |
|---|---|
| Name | `QA-AP2471-Neg-Custom90-<HHMM>` |
| Term month | 4 |
| Coverage odometer from / to | `0` / `60000` (typed last) |
| Earning curve type | Custom |
| Attempt 1 — total 90% | `0.4000` · `0.3000` · `0.1000` · `0.1000` (or `40` · `30` · `10` · `10` on a percentage page) |
| Attempt 2 — negative factor | row 4 = `-0.0500` (or `-5.0000`) |
| Attempt 3 — emptied box | clear row 4 so it is empty (typing `abc` into the number box leaves it empty) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve`, click "Create New", and enter Name `QA-AP2471-Neg-Custom90-<HHMM>`, Term month `4` (Tab), type "Custom", then odometer `0` / `60000` | A 4-row table with editable Monthly Factor boxes is shown. |
| 2 | Type attempt 1's factors and click **Save** | The cumulative column ends at 0.9000 (90.00) on row 4 before saving. No error page or HTTP 5xx appears. Record whether it saved, warned or refused, with the exact text, for Q-009. |
| 3 | Open the curve again if it saved (or stay on the form), set row 4 to attempt 2's negative value and click **Save** | No error page or HTTP 5xx appears. Record whether it saved or refused, and the cumulative shown on row 4, for Q-009. |
| 4 | Set row 4 to attempt 3 (empty box) and click **Save** | No error page or HTTP 5xx appears. Either a message names the empty box, or the form is redisplayed. Record what happened. |
| 5 | [Verification] Open `/admin/earning-curve` and, if `QA-AP2471-Neg-Custom90-<HHMM>` exists, open its Edit form | Any saved version holds exactly the factors typed in the last attempt that saved, with the cumulative as their running total. No factor shows a value nobody typed. The outcome of each attempt is recorded. |

---

### AP2471_015 — An admin can delete an earning curve they created, and it disappears from the list

| Field | Value |
|---|---|
| **TC ID** | AP2471_015 |
| **Title** | An admin can delete an earning curve they created, and it disappears from the list |
| **Requirement** | AP2471 — REQ-008 (user story only; no acceptance criteria) |
| **Route** | `/admin/earning-curve` → "Edit" |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | SKIPPED |
| **Blocked by** | — (Q-002 answered by observation on Dev (v2dev), 2026-11-02: no delete control exists — not in scope on Dev) |
| **Executed on** | 2026-11-02 — Dev (v2dev), run folder no-sprint |
| **Result** | **2026-11-02, Dev (v2dev): SKIPPED.** Not in scope on Dev: no delete control in the list Actions column or in the Edit form (Q-002 answered by observation). No curve created for this case. Log: `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. — — Previous cycle (2026-10-04, run folder 5.2.0): SKIPPED. Delete not offered; Q-002 open. No delete control in the list row or the Edit form. QA-AP2471-Del-0043 (id 13) left on staging. |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-01 | Status set to BLOCKED at design time by Q-002. The expected results that depend on the answer now read "Not known — Q-002". | REQ-008 has no acceptance criterion and Q-002 is a Blocking question, still unanswered. A case that depends on it is BLOCKED at design, not skipped at run time. | stlc-ticket-pipeline s3, 2026-11-01 |
| 2026-11-02 | Run instead of staying BLOCKED; result SKIPPED — not in scope on Dev. | User decision of 2026-11-02: Q-002 is answered by what Dev does. Dev has no delete control in the list or the Edit form, so there is nothing to delete; no curve was created for this case. | User instruction, applied by stlc-ticket-pipeline s4, 2026-11-02 |

**Why this matters:** The user story says "create, edit and delete", but the acceptance criteria list only "Edit" as an action, and the previous cycle found no delete control anywhere. Nobody can tell whether that is a bug or a deliberate scope cut until Ken Nguyen answers Q-002. The steps stay written so the case runs as soon as the answer arrives.

**Test Data:**

| Variable | Value |
|---|---|
| Curve to delete | `QA-AP2471-Del-<HHMM>` — created in step 1 for this case only |
| Its values | Term month `12`, odometer `0` / `10000`, type Pro-Rata, Is Enabled? unticked (No) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal as in the Execution Context, open `/admin/earning-curve`, click "Create New" and save a curve with Name `QA-AP2471-Del-<HHMM>`, Term month `12`, type Pro-Rata, Is Enabled? unticked, then odometer `0` / `10000` → **Save** | The curve is listed with Is Enabled? "No". |
| 2 | Look for a delete control on its list row (Actions column), and then inside its "Edit" form | Not known — Q-002. Record where a delete control is, or that none exists. |
| 3 | Click the delete control | Not known — Q-002 (whether a confirmation is shown). Record its text. |
| 4 | Confirm the deletion | Not known — Q-002. Record the message and landing page. |
| 5 | [Verification] Verify `QA-AP2471-Del-<HHMM>` no longer appears on `/admin/earning-curve`, and that every other curve is still listed | Not known — Q-002. Once delete is confirmed in scope: only the curve created in step 1 has gone. |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-002 — List row values and Edit action | AP2471_011, AP2471_012 | — | — | — |
| REQ-003 — Field validation (no rule — Q-005, Q-006, record-only) | — | AP2471_013 | — | — |
| REQ-006 — Custom total and factor validation (no rule — Q-009, record-only) | — | AP2471_014 | — | — |
| REQ-007 — Save (create) — user-story minimum; Q-001 open | AP2471_011 | AP2471_013 | — | AP2471_010 (file 2) |
| REQ-007 — Save (edit) — user-story minimum; Q-001 open | AP2471_012 | — | — | — |
| REQ-008 — Delete — BLOCKED by Q-002 | AP2471_015 (BLOCKED) | — | — | — |

---

## Execution Log

> Executed 2026-11-02 on Dev (v2dev), run folder `no-sprint`: AP2471_011 PASS, AP2471_012 PASS, AP2471_013 PASS, AP2471_014 PASS, AP2471_015 SKIPPED. Full step results, screenshots and the answers to the open questions are in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`. The previous cycle (2026-10-04, staging) stays in `qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2471_2026-10-04.md`.

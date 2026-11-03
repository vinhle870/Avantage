# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2471: Admin: Earning Curve management)
**Date:** 2026-11-01 (re-run; first written 2026-10-03)
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2471-admin-earning-curve-management.md (transcribed from Jira AP-2471, description + acceptance criteria field `customfield_10150` + 6 comments, including the section "Ticket changes since capture — 2026-11-01")
**Total requirements found:** 8

related_docs: `qa-artifacts/qa-docs/earning-curves.md` (the `domain` source, mapped on 2026-10-04 from the previous run). It records how the current build behaves: routes, the Save button, validation messages and the fraction scale. **It is used here only to describe the screens. It never answers an open question**, because it records what the build does, not what the ticket author intended.

> **Re-run note — 2026-11-01.** The ticket's description and acceptance criteria have not
> changed since the 2026-10-03 analysis, so the eight requirements below stand as written.
> What changed in this re-run: every open question now carries an **Impact** and a
> **Status** (the pipeline's gates read them), Q-003 and Q-007 are marked Answered with
> the capture sentences that settle them, and Q-013 records the icon placement the QA
> settled at Gate C on 2026-10-04. No one outside the QA account has commented since
> 2026-09-24, so the questions the QA posted on 2026-10-03 are all still unanswered.

---

## Executive Summary

AP-2471 adds an admin screen for managing **earning curves**. An earning curve is the table of monthly percentages that says how much of a contract's premium counts as earned income in each month of the contract. An admin chooses one of four curve types: Pro-Rata, Rule of 78, Reverse Rule of 78 or Custom. The three predefined types work out the factors themselves. The Custom type lets the admin type in every monthly factor by hand.

This analysis splits the ticket into eight requirements:
1. The menu entry.
2. The list page.
3. The create/edit form.
4. Generating the table from Term month.
5. The maths for the three predefined types.
6. Custom factor entry.
7. Saving.
8. Deleting.

The first five are well specified. The ticket gives formulas and 12-month worked examples, so we can check results to the decimal. The last three are weak.
- **REQ-007 (Save) has no acceptance criteria.** The criteria list ends on an empty "Save button" heading.
- **REQ-008 (Delete) has no acceptance criteria.** The user story promises it, but the list page's only action is "Edit".
- **REQ-006 (Custom) has a known defect.** The ticket's reporter commented on 2026-09-24 that Custom factors do not save and the cumulative column does not recalculate.

**12 testability risks** are flagged, 4 of them High, and there are **13 open questions**. Two are **Blocking** and still open: Q-001 (what Save should do) and Q-002 (whether delete is in scope). Until they are answered, REQ-007 and REQ-008 cannot be judged and the story cannot be released, whatever the pass rate. Six are **Judgement** questions: the main result is testable, and the test records what the build does on that point instead of guessing. Two are **Info** only. Three are **Answered** by sentences already in the ticket.

> **Update 2026-11-02:** by the user's decision, every open question — including Blocking Q-001 and Q-002 — is answered by observation on Dev (v2dev), 2026-11-02. See Open Questions.

We also found a mistake in the ticket's own Reverse Rule of 78 example. Row 8 shows a cumulative factor of 53.85%, but the ticket's formula gives 36/78 = 46.15%. Rows 7 and 9 (35.90% and 57.69%) confirm 46.15% is right. The acceptance criteria say the table is generated from the description's *calculations*, so the formula is the expected value (Q-007, Answered).

Overall testability is **Medium**. The calculations can be proven precisely, but save and delete cannot be signed off as written. Saving is the step that makes any of this matter to the business.

---

## Requirements Detail

### REQ-001 — "Earning Curves" menu item under Risk Management

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want an "Earning Curves" item in the admin menu so that I can reach the earning-curve screen. |
| **Priority** | Medium. This is the only entry point to the feature, but it is a low-complexity change that is easy to confirm. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. When the admin opens the menu in the admin area, a "Risk Management" section is shown that contains an "Earning Curves" menu item.
2. The icon `fa-tachometer-alt-average` is shown with the menu entry. The criterion does not say whether the icon sits on the "Risk Management" section or on the "Earning Curves" item. The capture's scope clarification of 2026-10-04 settles it: the icon belongs to the Risk Management section, and "Earning Curves" is a plain-text item in its flyout (Q-013, Answered).

**Out of Scope:**

- The other Risk Management items seen in the sidebar (Earning Sets, Earning Groups, Earning Assignments). They are not mentioned in this ticket.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say which admin roles may see the menu item, so we cannot tell whether a lower-privilege admin should be refused. | Low | Test with the shared admin account. Raise Q-011 about role restrictions. |

---

### REQ-002 — Earning Curves list page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a page listing every earning curve so that I can see what exists and open one to change it. |
| **Priority** | Medium. It is the hub of the feature. A wrong column misleads the admin about which curve covers which contracts. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. Clicking "Earning Curves" opens a page titled "Earning Curves".
2. The page has a navigation component with one item, "Create New".
3. The page has a datagrid (a sortable/filterable table of records) listing the earning curves, with the columns Name, Term month, Coverage odometer, Earning curve type, Is Enabled? and Actions.
4. The Coverage odometer column shows the range as "Coverage odometer from - Coverage odometer to".
5. The Actions column offers "Edit".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Nothing describes the empty state, sorting, filtering or paging of the datagrid, so we have no expected behaviour for them. | Low | Record what the page does as an observation. Do not fail it. |
| The number format for the odometer range (thousands separator, units) is not stated. | Low | Accept any readable format that shows both values in the "from - to" order. |

---

### REQ-003 — Create / Edit form fields and defaults

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a form to define an earning curve's name, term, odometer coverage, type and enabled state so that I can set up a curve for a class of contracts. |
| **Priority** | High. Every curve is defined through this form. A wrong default (for example, the wrong type pre-selected) silently produces wrong curves. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. Clicking "Create New" opens a new page with the edit form.
2. **Name** is a text field.
3. **Term month** is a numeric field with a default value of 12.
4. **Coverage odometer from** and **Coverage odometer to** are numeric fields.
5. **Earning curve type** is a select box with the options Pro-Rata (the default), Rule of 78, Reverse rule of 78 and Custom.
6. **Is Enabled?** is a Yes/No toggle.
7. The form shows an **Earning points table**. Its row count equals the Term month value.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No field is marked required, and no limits are given. The ticket says nothing about minimum or maximum Term month, negative or decimal odometer values, or "from" greater than "to". With no error path described, we cannot say whether accepting bad input is a bug. | High | Raise Q-005 and Q-006. Run the negative tests anyway and report what happens as observations. An invalid curve could be saved and later used to recognise income. |
| The default for "Is Enabled?" is not stated. | Low | Record the observed default. |

---

### REQ-004 — Earning points table follows the Term month

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want the earning points table to have one row per contract month so that every month of the contract has a factor. |
| **Priority** | High. A missing or extra row means a month with no earned income, or a curve that never reaches 100%. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · Edge-case · UI |

**Acceptance Criteria:**

1. The table has the columns Earning point, Monthly Factor and Cumulative Factor.
2. Earning point starts at 1 and goes up by 1 on each row.
3. Monthly Factor is a numeric input of float type with 4 decimals.
4. Cumulative Factor is described as "the sum of Monthly Factor previous row and current row".
5. When the Term month field is changed, the table is regenerated with the same number of rows as the month value. For example, entering 24 produces 24 rows.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Read literally, "the sum of Monthly Factor previous row and current row" means only two rows are added together. Every worked example in the description instead shows a running total of all rows so far. The two readings give different numbers from row 3 onwards. | Medium | Q-003 is Answered by two other sentences in the capture: the Custom criterion says the cumulative factor should "recalculate the cumulative sum", and the description's code says "Cumulative sum from Month 1 to current month". Test against the running total. |
| "Float type with 4 decimals" does not say whether the value is a percentage (8.3333) or a fraction (0.0833). The description's examples mix 4-decimal percentages with 2-decimal percentages. | Medium | Accept either scale as long as the 4-decimal precision holds. Raise Q-004. |

---

### REQ-005 — Factor calculation for the three predefined types

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want the system to work out the factors for Pro-Rata, Rule of 78 and Reverse Rule of 78 so that I do not have to calculate actuarial factors by hand. |
| **Priority** | High. These factors decide how much premium is booked as earned income each month. A wrong factor misstates revenue and the unearned-premium reserve. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · Edge-case · Regression |

**Acceptance Criteria:**

1. When the earning curve type is changed, the table is regenerated from that type's calculation in the ticket description.
2. **Pro-Rata.** The monthly factor is 1 / Term month and is the same on every row. Ken Nguyen confirmed this on 2026-09-22, correcting an earlier formula that grew each month. For 12 months that is 8.3333% per month, with cumulative 8.33%, 16.67% … 100.00%.
3. **Rule of 78.** The monthly factor for month m of an N-month term is (N − m + 1) / (N(N+1)/2). For 12 months that is 15.38%, 14.10% … 1.28%. The cumulative factor reaches about 73% at month 6 and 100% at month 12.
4. **Reverse Rule of 78.** The monthly factor for month m is m / (N(N+1)/2), giving 1.28%, 2.56% … 15.38% for 12 months. The cumulative factor is m(m+1)/2 divided by the same denominator.

**Out of Scope:**

- The "unearned factor" (1 − cumulative) that the description's code returns. No acceptance criterion asks the screen to show it.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket's Reverse Rule of 78 example has a wrong value. Row 8's cumulative factor reads 53.85%, but the formula gives 36/78 = 46.15%, and rows 7 and 9 agree with the formula. A tester using the table as the oracle (the source of expected results) would raise a false bug or miss a real one. | Medium | Treat the formula as the oracle, not the table. The criterion "the table is generated based the earning type calculations mentioned in the ticket's description" makes the formula the expected value (Q-007, Answered). Still ask the author to correct the example, so no one else is misled. |
| No rounding rule is given for the last row. Twelve Pro-Rata factors of 8.3333% add up to 99.9996%, not 100%. The ticket's example shows 100.00% but does not say whether the last factor is adjusted or the display is rounded. | Medium | Accept a final cumulative within ±0.01% of 100% and record the exact value. Raise Q-008. |
| Behaviour for long terms is not stated. For example, at 120 months each Rule-of-78 factor is very small and may show as 0.0000 at 4 decimals. | Low | Include one long-term check (such as 60 months) and record what happens. |

---

### REQ-006 — Custom type: editable monthly factors

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to type each monthly factor myself when no predefined curve fits so that I can model a contract's real earning pattern. |
| **Priority** | High. The ticket's reporter says this is broken on the current build (comment of 2026-09-24), so it is the most likely place for a defect to ship. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression |

**Acceptance Criteria:**

1. When "Custom" is selected as the earning curve type, the Monthly Factor column shows editable text boxes, one per earning point.
2. Every time a monthly factor changes, the Cumulative Factor column recalculates the running sum.
3. *(From the 2026-09-24 comment, not a written criterion.)* Manually entered factors must be saved. The reporter states they currently are not.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Nothing says whether Custom factors must add up to 100%, or what happens when they do not: block the save, warn, or allow it. A curve that earns 90% or 110% of the premium would misstate income for every contract that uses it. | High | Raise Q-009. Test totals under, at and over 100% and report the outcome. |
| Nothing says whether the monthly factor boxes are read-only for the predefined types. | Medium | Check for it and report it. Raise Q-010. |
| Nothing says what happens to typed factors when the admin switches from Custom to another type and back, or changes Term month. They could be kept, regenerated or discarded. | Medium | Record the behaviour. Raise Q-010. |
| Validation for a factor box is not described: negative numbers, more than 4 decimals, letters, blank. | Medium | Run negative inputs and report what happens. |

---

### REQ-007 — Saving a curve (create and edit)

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to save a new or changed earning curve so that it is stored and appears in the list. *(Inferred from the user story "create, edit"; the criteria do not state it.)* |
| **Priority** | High. Without a working save, no other requirement delivers anything. The reporter already says Custom saves are failing. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. *None in the ticket.* The criteria end at a heading, "Save button", with no text under it. The only fair minimum we can test is the user story's promise: a saved curve appears in the list with the values entered, and reopening it with "Edit" shows the same values and factors.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Save has no acceptance criteria at all. Nothing states the button label, required fields, the success message, where the user lands afterwards, or how errors are shown. We cannot sign off save as written, and save is the step that makes the feature useful. | High | Recommend "Ask the ticket author" at Gate A (Q-001). If testing goes ahead, test only the minimum that follows from the user story and say so in the report. |
| Edit is listed as an action but has no behaviour described. For example, we do not know whether editing Term month on a saved curve discards its saved factors. | Medium | Raise Q-010. |

---

### REQ-008 — Deleting a curve

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to delete an earning curve so that obsolete curves are removed. *(Stated in the ticket's user story.)* |
| **Priority** | Medium. It is promised in the story, but a curve already used by Earning Sets or contracts could break income reporting if it is deleted, so it needs a rule before it can be tested safely. |
| **Source File** | AP-2471-admin-earning-curve-management.md |
| **Recommended Test Types** | Functional · Negative |

**Acceptance Criteria:**

1. *None in the ticket.* The user story says "delete", but the datagrid's Actions column lists only "Edit", and no criterion describes a delete control, a confirmation or the result.

**Out of Scope:**

- None stated. It is unclear whether delete was dropped from scope on purpose.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Delete is promised but not specified. We cannot tell whether a missing Delete button is a bug or an intended scope cut, and we cannot test what should happen to a curve that is in use. | High | Raise Q-002. Look for a delete control. If one exists, test it only on a curve this run created. If none exists, record it as an open question, not a bug. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — List page | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Form fields & defaults | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Table follows Term month | ✓ | | ✓ | | ✓ | | | |
| REQ-005 — Predefined calculations | ✓ | | ✓ | ✓ | | | | |
| REQ-006 — Custom factors | ✓ | ✓ | ✓ | ✓ | | | | |
| REQ-007 — Save | ✓ | ✓ | | ✓ | | | | |
| REQ-008 — Delete | ✓ | ✓ | | | | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** earning curve records (created, edited and possibly deleted by this run, so dynamic test data), the admin user account (static), and the admin sidebar menu configuration. The sibling Earning Sets, Groups and Assignments may *reference* earning curves. That matters for delete, but they are not touched directly.

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

Re-checked on 2026-11-01 against the capture's newer section: nobody outside the QA account
has commented since 2026-09-24, so no question became Answered through a comment. Q-003,
Q-007 and Q-013 are Answered by sentences already in the capture, quoted below. The
current build's behaviour (recorded in `qa-docs/earning-curves.md`) answers nothing here.

Re-checked on 2026-11-02 — **user decision**: *"For the questions, just explore in the dev env
and accept the actual result."* Every question that was Open (Q-001, Q-002, Q-004–Q-006,
Q-008–Q-012) is now **Answered by observation on Dev (v2dev), 2026-11-02**, from the s4 run
logged in `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md`.
No `Blocking` question is Open any more. The observed behaviour is the accepted behaviour; only
an explicit acceptance criterion or an objective fault (HTTP 5xx, error page, saved data that
differs from what was entered) can still fail a test. The ticket author has not answered in a
comment; the Q-007 request to correct the example's row 8 stays open as a courtesy.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | What should the Save button do? What is its label, which fields are required, what message shows on success, where does the user land, and how are errors shown? The criteria end at an empty "Save button" heading. | REQ-007 | Blocking — REQ-007 has no acceptance criterion | Answered | answered by observation on Dev (v2dev), 2026-11-02: the button is labelled **Save**; a valid save redirects to `/admin/earning-curve` with the alert "Earning curve saved" and the curve as the first row; saving an edit updates the same id with no duplicate; invalid input re-shows the form with an English error under the field ("This value should not be blank.", "This value should be between 1 and 999.") and saves nothing; Name, Term month, both odometer fields and every factor box are marked required — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen (reporter) |
| Q-002 | Is delete in scope? The user story says "create, edit and delete", but the Actions column lists only Edit. If it is in scope, is there a confirmation, and can a curve already used by an Earning Set be deleted? | REQ-008 | Blocking — REQ-008 has no acceptance criterion | Answered | answered by observation on Dev (v2dev), 2026-11-02: no delete control exists — the list's Actions column has only Edit and the Edit form has only Save. Delete is not in scope on Dev (AP2471_015 SKIPPED) — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-003 | Should Cumulative Factor be the running total of all rows so far, as the examples show, or the sum of only the previous and current rows, as the criterion literally says? | REQ-004 (AC 4) | Blocking — two statements in the capture contradict | Answered | "Cumulative factor should recalculate the cumulative sum every time there are changes in the monthly factor" — acceptance criteria, Earning points table item 4; and "Cumulative sum from Month 1 to current month: (m * (m + 1)) / 2" — description, Reverse rule of 78 code. Cumulative = running total from month 1 | Ken Nguyen |
| Q-004 | Is the 4-decimal monthly factor a percentage (8.3333) or a fraction (0.0833)? | REQ-004 (AC 3) | Judgement — display format | Answered | answered by observation on Dev (v2dev), 2026-11-02: a fraction with 4 decimals (12-month Pro-Rata = 0.0833; cumulative ends at 1.0000), not a percentage — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Minh Lưu (developer) |
| Q-005 | What are the allowed Term month values (minimum, maximum, whole numbers only)? | REQ-003 (AC 3) | Judgement — limits and validation not stated | Answered | answered by observation on Dev (v2dev), 2026-11-02: Term month must be 1–999 (`min=1 max=999`); 0 and −1 are refused on Save with "This value should be between 1 and 999." and the table is not regenerated for them; 1 and 60 work. Decimal terms were not tried — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-006 | Must "Coverage odometer from" be less than "to"? Are negative or overlapping ranges allowed? Are any fields required? | REQ-003 (AC 2, AC 4) | Judgement — validation not stated | Answered | answered by observation on Dev (v2dev), 2026-11-02: no from ≤ to rule — 50000 / 10000 saves and lists as "50000 - 10000"; Name is required ("This value should not be blank."); both odometer fields are marked required with `min=0` — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-007 | Please correct row 8 of the Reverse Rule of 78 example: the cumulative should be 46.15%, not 53.85%. Is the formula the source of truth? | REQ-005 (AC 4) | Blocking — the example table contradicts the formula at one cell | Answered | "When the earning type is changed, the table is generated based the earning type calculations mentioned in the ticket's description" — acceptance criteria, Earning points table item 3; the calculation is "$cumulativeNumerator = ($currentMonth * ($currentMonth + 1)) / 2;" — description, Reverse rule of 78 code. Row 8 = 36/78 = 46.15%. The request to fix the example stays open as a courtesy | Ken Nguyen |
| Q-008 | When the rounded monthly factors do not add up to exactly 100% (for example, 12 × 8.3333% = 99.9996%), is the last row adjusted, or is the display rounded? | REQ-005 (AC 2) | Judgement — precision and display; the ticket's example already shows the last row at 100.00% | Answered | answered by observation on Dev (v2dev), 2026-11-02: the last factor is not adjusted (12 × 0.0833); the cumulative column uses the unrounded factor and is shown rounded, so row 12 reads 1.0000 (24, 36 and 60 months also end at 1.0000) — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Minh Lưu |
| Q-009 | Must Custom factors add up to 100%? If they don't, is the save blocked, warned about, or allowed? Should a negative factor be refused? | REQ-006 | Judgement — validation not stated | Answered | answered by observation on Dev (v2dev), 2026-11-02: totals need not be 100% — 0.90, 0.75 and 0.00 save with no warning; a negative factor (−0.05) saves; an empty factor box is refused with "This value should not be blank." under that box (no HTTP 500) — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-010 | Are Monthly Factor boxes read-only for the predefined types? What happens to typed Custom factors, or to a saved curve's factors, when the type or Term month changes? | REQ-006, REQ-007 | Judgement — edge behaviour not stated | Answered | answered by observation on Dev (v2dev), 2026-11-02: Monthly Factor boxes are read-only for Pro-Rata, Rule of 78 and Reverse rule of 78 and editable for Custom; Cumulative is always read-only. Selecting Custom starts every box at 0.0000; switching away from Custom and back discards typed factors (all 0.0000); changing Term month on a Custom curve, new or saved, rebuilds that many rows, all 0.0000 — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-011 | Which admin roles may see and use Earning Curves? | REQ-001 | Info — only one admin account exists; no test result in this ticket depends on it | Answered | answered by observation on Dev (v2dev), 2026-11-02: the shared admin account sees the menu item and can create and edit curves; no other admin role exists to test — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-012 | What does "Is Enabled? = No" change downstream? Is a disabled curve hidden from Earning Sets? (Recorded here only. The downstream effect is outside this ticket.) | REQ-003 | Info — effect is outside the admin screens of this ticket | Answered | answered by observation on Dev (v2dev), 2026-11-02: a disabled curve is not hidden downstream — curve #13 (Is Enabled? No) is still offered in the Earning Group assign-curve dropdown (`/admin/earning-group/16/details`) — execution log `qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2471_2026-11-02.md` | Ken Nguyen |
| Q-013 | Does the `fa-tachometer-alt-average` icon belong to the "Risk Management" section or to the "Earning Curves" item? | REQ-001 (AC 2) | Blocking — the criterion places the icon ambiguously | Answered | "the icon `fa-tachometer-alt-average` belongs to the **Risk Management** section (its button in the left sidebar rail). 'Earning Curves' is a plain-text item in that section's flyout, with no icon of its own." — capture scope clarification of 2026-10-04 (Vinh Le, QA, at Gate C, from the reporter's mock-up `Screenshot 2026-09-18 at 4.47.19 PM.png`) | — |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-007 | Save has no acceptance criteria. The list ends on an empty "Save button" heading. | High | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-001) |
| REQ-008 | Delete is promised in the user story but has no criteria, and no delete action is listed. | High | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-002) |
| REQ-003 | No required fields, limits or error behaviour are given for any form field. | High | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-005, Q-006) |
| REQ-006 | Nothing says whether Custom factors must total 100% or what happens when they don't. | High | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-009) |
| REQ-004 | Cumulative factor wording ("previous row and current row") contradicts the running-total examples. | Medium | Closed — Q-003 Answered from the capture |
| REQ-004 | Factor scale (percent or fraction) is not stated. | Medium | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-004) |
| REQ-005 | The ticket's Reverse Rule of 78 example is wrong at row 8 (53.85% should be 46.15%). | Medium | Mitigated — Q-007 Answered (the formula is the oracle); example still uncorrected |
| REQ-005 | No rounding rule for the final cumulative reaching 100%. | Medium | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-008) |
| REQ-006 | Read-only or editable state of factors for predefined types, and persistence across type/term changes, are unstated. | Medium | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-010) |
| REQ-006 | Factor input validation is not described. | Medium | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-009) |
| REQ-007 | Edit behaviour of saved curves is not described. | Medium | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-001, Q-010) |
| REQ-001 | Role restriction for the menu item is not stated. | Low | Closed — answered by observation on Dev (v2dev), 2026-11-02 (Q-011) |

---

## Sign-off Checklist

- [ ] All requirements have at least one acceptance criterion. **Not met:** REQ-007 (Save) and REQ-008 (Delete) have none.
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders. Q-001, Q-002, Q-006 and Q-009 were posted on AP-2471 on 2026-10-03; the Blocking ones are posted again at Gate A of this run.
- [x] Every open question carries an Impact and a Status (2026-11-01).
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design. This waits on the Gate A decision.

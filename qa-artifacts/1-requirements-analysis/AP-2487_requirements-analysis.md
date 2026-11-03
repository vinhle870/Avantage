# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management › Earning Assignments (Jira AP-2487)
**Date:** 2026-10-12
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2487-earning-assignments-parameter-warranty-start-date.md`
**Total requirements found:** 3

---

## Executive Summary

AP-2487 changes the **Add Parameter** and **Edit Parameter** form on an earning assignment's
details page in the Admin portal. An *earning assignment parameter* is one row of matching
rules (vehicle condition, coverage code, sale-date range, odometer range, make, earning group
and so on) that decides which earning curve applies to a contract. This ticket adds two new
optional date fields — **Start date from** and **Start date To**, a warranty start date range —
placed after "Sale Date to", shows them in the parameter list (the *datagrid*, the table of
parameters on the details page) as a column named "Start date", and lets the admin pick
**several Coverage Codes** in one parameter instead of one.

Three requirements were extracted from the ticket's acceptance criteria. Nine testability
risks were flagged, two of them High. The most important are: (1) the ticket does not say
what a warranty start date range — or several coverage codes — *does* to the earning
calculation, and the admin screens cannot show it, so only storage and display can be
proven; and (2) the ticket does not say whether a "from" date later than the "to" date must
be refused, so a range that can never match any contract may be saved silently.

Overall testability is rated **MEDIUM-HIGH**. Every stated criterion can be checked on
screen. The AP-2476 run on 2026-10-11 already saw both new date fields and the multi-select
Coverage Code on staging, so the build is very likely deployed. The expected results for
reversed ranges, for the datagrid format and for editing older single-code rows rest on
assumptions until the open questions below are answered.

---

## Requirements Detail

### REQ-001 — Warranty start date range on the Add and Edit Parameter form

| Field | Value |
|---|---|
| **User Story** | As an admin, I want to add a warranty start date range to an earning assignment parameter so that the parameter can apply only to warranties that start within that range. (The first half is the ticket's user story; the purpose is inferred.) |
| **Priority** | High — this is the main purpose of the ticket. If the dates are not saved or are saved to the wrong field, parameters match the wrong contracts and earnings are misallocated. |
| **Source File** | AP-2487-earning-assignments-parameter-warranty-start-date.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression · UI |

**Acceptance Criteria:**

1. Given the admin user is in the admin area, when they fill out the earning assignment parameter **add** or **edit** form, then they can enter a warranty start date "from" and "to".
2. The two fields appear **after the "Sale date To" field**.
3. "Start date from" is optional and is a date field.
4. "Start date To" is optional and is a date field.

**Out of Scope:**

- None stated.
- How the start date range is used when earnings are calculated for contracts is not described and cannot be observed from the parameter screens.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say what the range does to the earning calculation — for example, whether a contract whose warranty starts on the "to" date is included. If the calculation reads it differently from what admins expect, contracts get the wrong earning curve. | High | Ask the ticket author. Test what the form stores and displays; record the calculation effect as not verified. |
| No validation is stated for a "from" date **later** than the "to" date. A reversed range can never match any contract, so saving it silently creates a dead parameter. | High | Test it as a negative case and record the result. Treat a clean refusal or a saved-as-entered value as acceptable until the author answers; flag an error page (HTTP 500). |
| Only one of the two dates may be filled (an open-ended range). The ticket marks each field optional on its own, which implies this is allowed, but does not say so. | Medium | Test "from only" and "to only" and confirm each is saved and displayed. |
| The labels differ in case — "Start date from" and "Start date To" — and the ticket calls the feature "warranty start date" while the label says only "Start date". Admins may confuse it with Sale Date. | Low | Check the labels match the ticket exactly; record the wording as an observation, not a failure. |
| "Date field" does not say which input the field uses — a date picker or free text — nor the accepted format. Free text that is not a date could be refused with an error page. | Medium | Check the field opens the same date picker as Sale Date; try typing an invalid value as a negative case. |

---

### REQ-002 — "Start date" column in the parameter datagrid

| Field | Value |
|---|---|
| **User Story** | As an admin, I want to see each parameter's warranty start date range in the parameter list so that I can check it without opening the Edit form. (Inferred.) |
| **Priority** | Medium — display only, but it is the only way an admin can review the setting for many rows at once. |
| **Source File** | AP-2487-earning-assignments-parameter-warranty-start-date.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. The start date fields are also available in the datagrid as a column named "Start date".

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say how the column shows the range or an empty field. The Sale Date column shows `from - to`, `2026-01-01 - All` for a half-filled range and "All" when empty; the AP-2476 run saw the Start date column **blank** when empty. The two columns may be meant to match. | Medium | Expect the Sale Date format (`from - to`) as the closest stated pattern. Record what is shown for empty and half-filled ranges and raise the blank-versus-"All" difference as an open question, not a failure. |

---

### REQ-003 — Coverage Code accepts several choices

| Field | Value |
|---|---|
| **User Story** | As an admin, I want to select several Coverage Codes in one parameter so that I do not have to create one parameter row per coverage code. (Inferred — the ticket states only "The user can select multiple Coverage Codes".) |
| **Priority** | High — it changes how an existing field is stored. If only the first code is kept, or older single-code rows lose their code, contracts on those codes get no earning curve or the wrong one. |
| **Source File** | AP-2487-earning-assignments-parameter-warranty-start-date.md |
| **Recommended Test Types** | Functional · Edge-case · Regression · UI |

**Acceptance Criteria:**

1. On the earning assignment parameter add/edit form, the user can select multiple Coverage Codes.

**Out of Scope:**

- None stated. Making Coverage Code optional (empty = "All") was AP-2476 and is covered there; it is regression here only.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Parameters saved **before** this change hold one coverage code. The ticket does not say they must still open and show that code in the multi-select on Edit. If they lose it, saving them again silently widens them to "All". | Medium | Open an older single-code parameter (seeded #1 or an AP-2476 fixture with a code) in Edit and confirm the code is ticked. |
| The ticket does not say how several codes are shown in the datagrid — comma-separated, one per line, or a count. | Low | Record what is shown; accept any rendering that lists every selected code. |
| No upper limit is stated. Selecting every code with "Select All" is a different state from selecting none ("All"); the ticket does not say whether they mean the same thing. | Low | Test Select All as an edge case and record how it is saved and shown. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Warranty start date range on the form | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| REQ-002 — "Start date" datagrid column | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Multiple Coverage Codes | ✓ | | ✓ | ✓ | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

Regression to include: a parameter saved with no start dates and no coverage code still
saves and displays "All" as in AP-2476; Sale Date from/to still behave as before; the
required fields (Coverage odometer, Model Year Age, Lag Interval) still refuse a blank value
without an error page.

**Data entities touched:** Earning assignment (the parent — the AP-2476 fixture #15
"QA-AP2476-233044" has room for 4 more parameters, or a new `QA-AP2487-…` assignment);
earning assignment parameter rows (created and edited, including their new warranty start
date from/to values and their list of coverage codes); seeded parameter #1 (read only, as a
pre-change single-code row); reference lists read by the form — coverage codes, makes,
earning groups. Keep each fixture assignment at 10 parameters or fewer (the details page
fails with HTTP 500 past 10 — bug AP-2484).

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | How does the earning calculation use the warranty start date range — are both ends included, and does an empty end mean "no limit"? | REQ-001 | Ken Nguyen (reporter) | Before sign-off of AP-2487 |
| Q-002 | Should a "Start date from" later than "Start date To" be refused with a message? | REQ-001 | Ken Nguyen | Before s4 execution |
| Q-003 | What should the Start date column show when both dates are empty — blank, or "All" as the Sale Date column does? | REQ-002 | Ken Nguyen | Before sign-off |
| Q-004 | How should several coverage codes appear in the datagrid? | REQ-003 | Ken Nguyen | Before sign-off |
| Q-005 | Is selecting every coverage code meant to be the same as selecting none ("All")? | REQ-003 | Ken Nguyen | Before sign-off |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | Effect of the start date range on the earning calculation is not stated and not observable in admin | High | Open |
| REQ-001 | No validation stated for "from" later than "to" | High | Open |
| REQ-001 | Only one date filled — implied but not stated | Medium | Open |
| REQ-001 | Date input type and accepted format not stated | Medium | Open |
| REQ-002 | Datagrid format and empty display not defined; differs from the Sale Date column | Medium | Open |
| REQ-003 | Older single-code parameters must keep their code on Edit — not stated | Medium | Open |
| REQ-001 | Label wording ("Start date" vs "warranty start date", "from"/"To" case) | Low | Open |
| REQ-003 | Datagrid display of several codes not defined | Low | Open |
| REQ-003 | "Select All" versus none — meaning not stated | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

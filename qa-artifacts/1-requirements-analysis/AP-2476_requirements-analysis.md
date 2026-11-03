# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management › Earning Assignments (Jira AP-2476)
**Date:** 2026-10-11
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2476-make-earning-assignment-parameter-fields-optional.md`
**Total requirements found:** 4

---

## Executive Summary

AP-2476 changes the **Add Parameter** and **Edit Parameter** form on an earning assignment's
details page in the Admin portal. An *earning assignment parameter* is one row of matching
rules (vehicle condition, coverage program, sale-date range, odometer range, make, earning
group and so on) that decides which earning curve applies to a contract. Today every field on
that form is mandatory; this ticket makes six of them optional, shows "All" instead of "Choose"
as their empty choice, and sets default values for the two odometer fields.

Four requirements were extracted from the ticket's acceptance criteria. Ten testability risks
were flagged, three of them High. The most important are: (1) the ticket does not say what an
empty field *means* to the business — the "All" wording suggests "matches every value", but the
admin screens cannot show whether the earning calculation treats it that way; (2) the
"Coverage odometer to" default in the ticket is **999999** (six digits), while the form today
defaults to **9999999** (seven digits) — either the default is meant to shrink by a factor of
ten or the ticket has a typo; and (3) "Condition" currently has no empty choice at all (it
defaults to "New"), so it is not clear whether adding "All" there also changes the default for
new parameters.

Overall testability is rated **MEDIUM**. Everything the ticket states can be checked on screen,
but the expected results for an empty field in the parameter list, for clearing a field during
Edit, and for the odometer default rest on assumptions until the questions below are answered.
The change was deployed to the *preprod* environment on 2026-10-09; on 2026-10-04 it was not
yet on staging.

---

## Requirements Detail

### REQ-001 — Six parameter fields become optional on Add and Edit

| Field | Value |
|---|---|
| **User Story** | As an admin, I want to leave Condition, Coverage Code, Sale Date from, Sale Date to, Make and Earning Group empty when adding or editing an earning assignment parameter so that one parameter row can cover every value of those fields. (Inferred — the ticket has no user story; the purpose is taken from the "All" wording.) |
| **Priority** | High — today the server refuses a blank Coverage Code or Sale Date with "This value should not be blank."; if the fields are not truly optional, admins still cannot create the broad parameter rows this ticket exists to allow. |
| **Source File** | AP-2476-make-earning-assignment-parameter-fields-optional.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression · UI |

**Acceptance Criteria:**

1. Given the admin user is logged in to the admin area, when they are adding an earning assignment parameter, then Condition, Coverage Code, Sale Date from, Sale Date to, Make and Earning Group are optional (AC 1).
2. The same six fields are optional when the admin user is editing an existing earning assignment parameter (AC 1, "adding or editing").

**Out of Scope:**

- None stated. Fields not in the list — Coverage odometer from/to, Model Year Age From/to and Lag Interval — are not mentioned and are taken to stay as they are (Coverage odometer gets new defaults under REQ-003 and REQ-004 but is not declared optional).
- The effect of an empty field on how earnings are calculated for contracts is not described and cannot be observed from the parameter screens.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say what an empty field means. "All" implies "applies to every value", but nothing on the admin screens proves the earning calculation reads it that way. If it does not, contracts could get no earning curve or the wrong one. | High | Ask the ticket author to confirm the intended meaning. Test what the admin form stores and displays; record the calculation effect as not verified. |
| The ticket does not say what the parameter list (datagrid) shows for an empty field — blank, "All", or a dash. Without it, a display result cannot be marked pass or fail. | Medium | Ask the author. Until answered, accept any clear rendering that is not an error or a misleading value, and record what is shown. |
| Clearing a field that already has a value during **Edit** (set it back to "All") is implied but not stated. If clearing silently keeps the old value, admins cannot widen an existing row. | Medium | Test it as part of AC 2: edit a filled parameter, choose "All", save, and confirm the value is removed. |
| Fields keep a `*` "required" marker and the HTML `required` attribute today. The ticket does not say whether the asterisk should go. A field marked required but accepted empty confuses admins. | Low | Record the label state as an observation; raise it as an open question rather than a failure. |
| Only one of the two sale dates may be filled (for example "from" without "to"). The ticket is silent on whether an open-ended range is allowed. | Medium | Test "from only" and "to only" as edge cases and record the result; ask the author. |

---

### REQ-002 — "All" replaces "Choose" as the empty choice for the six optional fields

| Field | Value |
|---|---|
| **User Story** | As an admin, I want the empty choice of each optional field to read "All" so that I understand leaving it empty means the parameter applies to every value. (Inferred.) |
| **Priority** | Medium — wording only, but it is what tells admins the field is optional and what an empty value means. |
| **Source File** | AP-2476-make-earning-assignment-parameter-fields-optional.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. On the Add and Edit Parameter forms, the default placeholder of Condition, Coverage Code, Sale Date from, Sale Date to, Make and Earning Group is "All" instead of "Choose" (AC 1).

**Out of Scope:**

- The "Choose" placeholder on the **assignment** form (Earning Set, Dealer Group) — that form is not part of this ticket, and leaving those on "Choose" still causes an HTTP 500 per the domain notes (separate behaviour, not tested here).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| **Condition has no placeholder today** — it is a two-option list (New, Used) that defaults to New. The ticket does not say whether "All" becomes the new default for new parameters or is only added as an option. A changed default would silently change what admins save. | High | Ask the author. Test: open Add Parameter and record which Condition option is pre-selected; confirm "All" is available and can be saved. |
| **Sale Date from/to are text boxes with a date picker, not drop-down lists.** "Placeholder 'All'" for a text box most likely means the grey hint text shown while the box is empty, but this is not stated. | Medium | Treat the hint text (HTML `placeholder`) as the expected result and record what is actually shown. |
| On **Edit** of a parameter that already has a value, the placeholder is not visible until the field is cleared. The ticket's "default placeholder" wording only fully applies to a new or empty field. | Low | Check "All" on Add for all six fields and on Edit for a parameter saved with empty fields. |

---

### REQ-003 — "Coverage odometer from" defaults to 0

| Field | Value |
|---|---|
| **User Story** | As an admin, I want Coverage odometer from to start at 0 so that a new parameter covers vehicles from zero kilometres unless I narrow it. (Inferred.) |
| **Priority** | Low — the form already defaults this field to 0 (observed 2026-10-04); the requirement is to keep that behaviour. |
| **Source File** | AP-2476-make-earning-assignment-parameter-fields-optional.md |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. When adding or editing an earning assignment parameter, Coverage odometer from has a default value of 0 (AC 2).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say whether the field may be left blank. Today a blank number is refused with "This value should not be blank." Whether a blank now saves (and saves as 0) is unknown. | Medium | Test blank as a negative case and record the result; accept either a clean refusal or saving as 0 — flag anything else (error page, saving blank). |
| "Default value" on **Edit** is ambiguous: an existing parameter should show its stored value, not reset to 0. | Low | Check that Edit pre-fills the stored value; check the default on Add only. |

---

### REQ-004 — "Coverage odometer to" defaults to 999999

| Field | Value |
|---|---|
| **User Story** | As an admin, I want Coverage odometer to start at the maximum value so that a new parameter covers every odometer reading unless I narrow it. (Inferred.) |
| **Priority** | Medium — the stated value (999999) differs from today's default (9999999). If it is applied as written, vehicles between 999,999 and 9,999,999 km fall outside newly created parameters. |
| **Source File** | AP-2476-make-earning-assignment-parameter-fields-optional.md |
| **Recommended Test Types** | Functional · Regression · Edge-case |

**Acceptance Criteria:**

1. When adding or editing an earning assignment parameter, Coverage odometer to has a default value of 999999 (AC 3).

**Out of Scope:**

- Existing parameters saved with 9999999 (for example the seeded "AV+" row) — the ticket does not ask for them to be changed.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| **999999 versus 9999999.** The form today defaults to 9999999 (seven nines). The ticket says 999999 (six nines). Either is plausible: a deliberate cap at just under a million km, or a typo for the existing value. | High | Test against the ticket as written (999999). If the build shows 9999999, report it at Gate C with this question so the user decides "bug" or "not a bug". |
| Same blank-field question as REQ-003. | Medium | Same as REQ-003. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Six fields optional on Add and Edit | ✓ | ✓ | ✓ | ✓ | ✓ | | | |
| REQ-002 — "All" placeholder | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Odometer from defaults to 0 | ✓ | ✓ | | ✓ | | | | |
| REQ-004 — Odometer to defaults to 999999 | ✓ | ✓ | ✓ | ✓ | | | | |

**Legend:** ✓ = recommended based on requirement content

Regression to include: a parameter with **every** field filled still saves and displays as
before; the fields not in the list (Model Year Age, Lag Interval) still behave as before;
the Edit form still pre-fills stored values.

**Data entities touched:** Earning assignment (an existing or newly created `QA-AP2476-…`
assignment as the parent); earning assignment parameter rows (created, edited, unassigned);
reference lists read by the form — coverage programs, makes, earning groups. Keep each
fixture assignment at 10 parameters or fewer (the details page fails with HTTP 500 past 10 —
bug AP-2484).

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | What does an empty ("All") field mean to the earning calculation — does the parameter then match every condition / program / date / make / earning group? | REQ-001 | Ken Nguyen (reporter) | Before sign-off of AP-2476 |
| Q-002 | Should "Coverage odometer to" default to 999999 (as written) or stay at today's 9999999? | REQ-004 | Ken Nguyen | Before s4 execution |
| Q-003 | For Condition, should "All" become the pre-selected value on Add, or stay an extra option with "New" pre-selected? | REQ-002 | Ken Nguyen | Before s4 execution |
| Q-004 | What should the parameter list show for an empty field — blank, "All", or something else? | REQ-001 | Ken Nguyen | Before sign-off |
| Q-005 | May only one sale date be filled (an open-ended range)? | REQ-001 | Ken Nguyen | Before sign-off |
| Q-006 | Should the red `*` required marker be removed from the six optional fields? | REQ-001 | Ken Nguyen | Before sign-off |
| Q-007 | May Coverage odometer from/to be left blank now, and if so, does blank save as the default? | REQ-003, REQ-004 | Ken Nguyen | Before sign-off |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | Meaning of an empty field for the earning calculation is not stated and not observable in admin | High | Open |
| REQ-002 | Condition has no placeholder today; whether "All" becomes its default is not stated | High | Open |
| REQ-004 | Ticket says 999999; current default is 9999999 | High | Open |
| REQ-001 | Datagrid display of an empty field not defined | Medium | Open |
| REQ-001 | Clearing a stored value on Edit not stated | Medium | Open |
| REQ-001 | Only one sale date filled — not stated | Medium | Open |
| REQ-002 | "Placeholder" for date text boxes not defined | Medium | Open |
| REQ-003 / REQ-004 | Blank odometer behaviour not stated | Medium | Open |
| REQ-001 | `*` required marker on optional fields | Low | Open |
| REQ-002 / REQ-003 | "Default" on Edit of an existing row is ambiguous | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

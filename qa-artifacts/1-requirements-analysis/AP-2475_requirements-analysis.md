# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2475: Edit earning assignment parameter)
**Date:** 2026-10-04
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2475-edit-earning-assignment-parameter.md (transcribed from Jira AP-2475: the description, the acceptance-criteria field `customfield_10150`, and 1 comment. The ticket has no attachments). Context only, not tested here: the sibling stories AP-2474 *Earning Assignment* (QC) and AP-2476 *Make Earning Assignment Parameter fields optional* (PR opened), both read from Jira on 2026-10-04.
**Total requirements found:** 3

related_docs: [qa-artifacts/qa-docs/risk-management.md](../qa-docs/risk-management.md) — gives the Earning Assignments list route `/admin/earning-assignment`, the create form `/admin/earning-assignment/new/edit` and the details route `/admin/earning-assignment/{id}/details` (mapped 2026-10-03). It does **not** cover the details page itself, the parameter datagrid or the parameter form. Those are not known from standing knowledge. The field list below comes from the AP-2474 acceptance criteria, not from the running application.

---

## Executive Summary

AP-2475 adds an **edit** action for earning assignment parameters. An *earning assignment* links an earning set to a dealer group. Each assignment has a details page with a table of *parameters*. A parameter is a row of matching rules: vehicle condition, coverage code, sale-date range, odometer range, model-year-age range, make and lag interval. Each row points at one earning group. The sibling ticket AP-2474 already lets an admin **add** and **delete** parameters. This ticket covers **changing** one that already exists. The ticket's reporter, Ken Nguyen, notes in a comment that editing was "missing from original ACs".

The ticket is short: one user story and two Given/When/Then blocks. We split it into three requirements:
1. A pencil (edit) icon in the Actions column of the parameter datagrid.
2. Clicking the pencil opens an edit form in a modal dialog.
3. The admin can change the parameter and the change is kept. This requirement is only *implied* by "allows the user to make changes". The ticket does not describe saving at all.

Overall testability is **MEDIUM**. REQ-001 and REQ-002 can be checked directly. REQ-003 is the reason the feature exists, but the ticket does not say what Save does, what a successful save looks like, or which values are rejected. Three facts add risk:
- The form's fields are defined only in AP-2474.
- AP-2476, which is still in pull request, will change which fields are required.
- AP-2474 and AP-2476 give different default values for "Coverage odometer to" (9999999 and 999999).

We recommend testing the happy path firmly, against the AP-2474 field list. Validation should be tested only where the expected result does not depend on AP-2476. The open questions should go to the ticket author.

---

## Requirements Detail

### REQ-001 — Edit (pencil) icon in the parameter datagrid

| Field | Value |
|---|---|
| **User Story** | As an admin, I want an edit icon on each parameter row so that I can start changing that parameter without deleting and re-adding it |
| **Priority** | Medium — the ticket is Medium priority. The icon is the only way into the feature, so if it is missing, the feature is missing. But it does not move money or contract data |
| **Source File** | AP-2475-edit-earning-assignment-parameter.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. Given the admin is logged in to the admin area and is on an earning assignment details page where at least one parameter has been created, the Actions column of the parameter datagrid contains a "pencil" icon to "edit". (Verbatim intent: *"The actions column contains an 'pencil' icon to 'edit'"*.)

**Out of Scope:**

- Creating the earning assignment and adding the parameter. AP-2474 owns these. Here they are only used as test setup.
- The existing trash-can (Unassign) action from AP-2474. Here we only check that it still works next to the new icon (regression).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say whether every row gets a pencil, or only some rows (for example, enabled assignments only). | Low | Check that every row on the page shows the icon. Raise Q-005 if any row lacks one. |
| The precondition "a parameter is created" depends on AP-2474's Add Parameter flow, which is still in QC. If Add Parameter is broken, nothing in this ticket can be tested. | Medium | Create the parameter fresh in each test case's precondition. Record a failure there as BLOCKED, not FAIL, for AP-2475. |

---

### REQ-002 — Clicking the pencil opens the edit modal

| Field | Value |
|---|---|
| **User Story** | As an admin, I want the edit form to open in a modal dialog showing the parameter's fields so that I can change it without leaving the assignment details page |
| **Priority** | Medium — same reasoning as REQ-001. It is the entry point to the change, not the change itself |
| **Source File** | AP-2475-edit-earning-assignment-parameter.md |
| **Recommended Test Types** | Functional · UI · Edge-case |

**Acceptance Criteria:**

1. When the user clicks on the pencil icon, the edit modal form opens. (Verbatim: *"Then the edit modal form is open and allows the user to make changes to the assignment parameter"*.)

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say the form is **pre-filled** with the parameter's current values. A form that opens blank or with defaults would make editing unsafe: an admin who changes one field would silently reset the other ten. | High | Expect pre-filling as the only sensible reading of "edit", and check every field against the values the parameter was created with. Confirm it with the author (Q-001). |
| The ticket does not list the form's fields. The only definition is the AP-2474 *Add Parameter* form: Condition, Coverage Code, Sale Date from/to, Coverage odometer from/to, Model Year Age from/to, Make, Lag Interval, Earning Group. | Medium | Use the AP-2474 field list as the expected field set and say so in the test plan. Raise Q-002. |
| No way to close the dialog without saving is described (Cancel, ×, Esc). The sibling Earning Set dialog has no Cancel or close button at all ([risk-management.md](../qa-docs/risk-management.md)). | Low | Record what exists as an observation. Do not fail a case on it. Raise Q-004. |

---

### REQ-003 — Changes to the parameter are saved and shown in the datagrid

| Field | Value |
|---|---|
| **User Story** | As an admin, I want my changes to a parameter to be saved so that the earning rules for that dealer group reflect the correction |
| **Priority** | High — this is what the feature is for. A parameter decides which earning group, and therefore which earning curve, applies to a contract. Editing it wrongly or partly would mis-recognise earned revenue for every matching contract. That reasoning is ours: the ticket does not state the business impact. |
| **Source File** | AP-2475-edit-earning-assignment-parameter.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression |

**Acceptance Criteria:**

1. The edit modal "allows the user to make changes to the assignment parameter". This is the only statement. No acceptance criterion describes saving, the confirmation shown, where the user lands, or how the datagrid changes.

**Out of Scope:**

- Making fields optional and showing the "All" placeholder. AP-2476 owns this, and it is not yet deployed (status *PR opened* on 2026-10-04).
- Whether an edited parameter changes the earning result on existing or new contracts. No ticket describes that link, and it cannot be observed from the admin UI.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No acceptance criterion for saving. The ticket does not name the button, the success message, the landing page, or whether the datagrid row updates in place. | High | Test the minimum the user story implies: after Save, the same row (not a new one) shows the new values and the old values are gone. Record the actual message and landing page as observations. Raise Q-003. |
| Validation is undefined. The ticket does not say which fields are required, whether "from" must be ≤ "to" for the date, odometer and model-year ranges, or whether non-numeric or negative values are rejected. AP-2476 will change which fields are required. | High | Test only validation whose expected result does not depend on AP-2476: a range entered backwards and non-numeric text in a numeric field. Record what the system does. If it accepts a backwards range, raise it as an open question, not a bug, unless the author confirms a rule (Q-006). |
| AP-2474 gives "Coverage odometer to" a default of **9999999**. AP-2476 gives **999999**. The edit form shows the stored value, not a default, so this affects REQ-003 only indirectly. | Low | Note it. Do not test defaults in this ticket. Raise Q-007 so the two stories are reconciled. |
| Editing could create a parameter identical to another row on the same assignment. Nothing says whether that is allowed. | Low | Include one edge case that makes two rows identical and record the result as an observation (Q-006). |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Pencil icon in the parameter datagrid | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — Pencil opens the edit modal | ✓ | | ✓ | | ✓ | | | |
| REQ-003 — Changes are saved and shown | ✓ | ✓ | ✓ | ✓ | | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched** (classified later by the test plan, §6.1):
- **Earning assignment.** Read; created as test setup through the AP-2474 create form.
- **Earning assignment parameter.** Created as setup, then changed. This is the record under test.
- **Earning sets, dealer groups, warranty programs (coverage codes), vehicle makes, earning groups.** Read only, as the options of the select boxes. Seeded values: earning sets 1 Profit, 2 Statutory, 3 Reinsurance; dealer groups 1 Group A – 4 Group D; earning group 1 "AV+" plus the QA groups from AP-2472.
- **Admin login.** The shared admin account from the `env` source.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | Should the edit form open pre-filled with the parameter's current values? We assume yes. | REQ-002 | Ken Nguyen (reporter) | Before execution (s4) |
| Q-002 | Does the edit form have exactly the same fields as the AP-2474 Add Parameter form, or can some fields not be changed after creation? | REQ-002 | Ken Nguyen | Before execution (s4) |
| Q-003 | What should happen on Save: which message appears, does the user stay on the assignment details page, and does the row update in place? | REQ-003 | Ken Nguyen | Before execution (s4) |
| Q-004 | Should the edit dialog offer a way to close without saving (Cancel, ×, Esc)? | REQ-002 | Ken Nguyen | Before release |
| Q-005 | Should every parameter row have the pencil icon, regardless of the assignment's "Is Enabled?" value? | REQ-001 | Ken Nguyen | Before release |
| Q-006 | Which values must be rejected on edit: a "from" greater than its "to" (sale date, odometer, model-year age), negative or non-numeric odometer values, or a parameter identical to another row? | REQ-003 | Ken Nguyen | Before execution (s4) |
| Q-007 | Is the "Coverage odometer to" default 9999999 (AP-2474) or 999999 (AP-2476)? | REQ-003 (context) | Ken Nguyen / Minh Lưu | Before AP-2476 is tested |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | No acceptance criterion describes saving: no message, landing page or datagrid behaviour is defined. | High | Open |
| REQ-003 | No validation rules are given, and AP-2476 (not deployed) will change which fields are required. | High | Open |
| REQ-002 | Pre-filling the form with current values is not stated. A blank form would make edits overwrite other fields. | High | Open |
| REQ-002 | The form's fields are defined only in the sibling ticket AP-2474. | Medium | Open |
| REQ-001 | Setup depends on AP-2474's Add Parameter flow, which is still in QC. | Medium | Open |
| REQ-001 | It is not stated whether every row must show the pencil icon. | Low | Open |
| REQ-002 | No close-without-saving action is described. | Low | Open |
| REQ-003 | The "Coverage odometer to" default differs between AP-2474 and AP-2476. | Low | Open |
| REQ-003 | It is not stated whether an edit may make two parameter rows identical. | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion. REQ-003's only criterion is the implied "allows the user to make changes", so it is flagged High.
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

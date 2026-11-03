# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2472: Earning Groups Management)
**Date:** 2026-10-03
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2472-earning-groups-management.md (transcribed from Jira AP-2472, description + acceptance criteria field `customfield_10150` + 3 comments)
**Total requirements found:** 8

related_docs: none. `qa-artifacts/qa-docs/` has no earning-group page yet. The only standing knowledge is that the admin sidebar already shows **Risk Management → Earning Groups**, next to Earning Curves, Earning Sets and Earning Assignments. This comes from page snapshots captured on 2026-10-02 during AP-2471 work. The sibling ticket **AP-2471 (Earning Curve management)** defines the earning curves that a group contains.

---

## Executive Summary

AP-2472 adds an admin screen for **earning groups**. An earning group is a named collection of earning curves. An earning curve (defined in AP-2471) is the table of monthly percentages that says how much of a contract's premium counts as earned income in each month. A group also carries a **default earning method**: Pro-Rata, Rule of 78 or Reverse Rule of 78. The ticket does not say what that default is used for later.

This analysis splits the ticket into eight requirements:
1. The menu entry.
2. The list page.
3. The "Create New" modal form.
4. Creating a group and landing on its details page.
5. Assigning an earning curve to the group.
6. The datagrid of assigned curves.
7. Unassigning a curve, with a confirmation.
8. Editing a group.

Requirements 1 to 6 are specified well enough to test directly. The weak points are:
- **REQ-008 (Edit) has only one criterion:** an "Edit" item exists. Nothing says what it opens, which fields it changes, or what happens on save.
- **The "Is Enabled?" column has no source.** It appears in both datagrids, but the create form has no Is Enabled field. We cannot tell how a group gets enabled or disabled.
- **REQ-007 (Unassign) has a data-loss risk.** The confirmation text says "delete this record". Ken Nguyen confirmed on 2026-09-23 that one earning curve can belong to several groups. If unassigning deletes the curve itself rather than the link, it would silently remove the curve from every other group too.
- **No validation is described anywhere.** The ticket gives no required fields, no duplicate-name rule and no rule against assigning the same curve to the same group twice.

**11 testability risks** are flagged, 3 of them High, and there are **10 open questions**.

Overall testability is **Medium**. The create-and-assign path can be proven end to end. Edit, the enabled state and the exact effect of unassigning cannot be signed off as written.

---

## Requirements Detail

### REQ-001 — "Earning Groups" menu item under Risk Management

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want an "Earning Groups" item in the admin menu so that I can reach the earning-group screen. |
| **Priority** | Medium. It is the only way into the feature, but it is a simple change that is easy to confirm. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. When the admin opens the menu in the admin area, a "Risk Management" section is shown that contains an "Earning Groups" menu item.
2. Clicking "Earning Groups" opens the earning groups page.

**Out of Scope:**

- The other Risk Management items (Earning Curves, Earning Sets, Earning Assignments). Earning Curves belongs to AP-2471; the others are not mentioned in this ticket.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say which admin roles may see the menu item, so we cannot tell whether a lower-privilege admin should be refused. | Low | Test with the shared admin account. Raise Q-009 about role restrictions. |

---

### REQ-002 — Earning Groups list page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a page listing every earning group so that I can see what exists and open one. |
| **Priority** | Medium. It is the hub of the feature. A wrong "Earning curves" column misleads the admin about which curves a group covers. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. The page has a navigation component titled "Earning Groups" with one nav item, "Create New".
2. The page has a datagrid (a sortable/filterable table of records) listing the earning groups created, with the columns Name, Earning curves, Default Earning curve type, Is Enabled? and Actions.
3. The Earning curves column lists the curves assigned to the group, each with its odometer range.
4. The Actions column offers "View", which redirects the user to the group details page.

**Out of Scope:**

- Deleting a group from the list. No delete action is listed, and the user story only promises "create".

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The "Is Enabled?" column has no source. The create form has no Is Enabled field and nothing says what the default is or how it changes. We cannot say what value a new group should show. | High | Record the observed value for a new group. Raise Q-002. A disabled group might be dropped from earnings calculations without anyone noticing. |
| The display format of the "Earning curves" column is not given: separator, curve name versus id, how the odometer range is written, and what shows when no curve is assigned. | Low | Accept any readable format that shows each assigned curve and its range. Record the empty-group display. |
| The column is headed "Default Earning curve type", but the form field is "Default Earning Method". The ticket does not confirm they are the same value. | Low | Check that the column shows the method chosen on the form. Raise Q-008 only if they differ. |
| Empty state, sorting, filtering and paging of the datagrid are not described. | Low | Record what the page does as an observation. Do not fail it. |

---

### REQ-003 — "Create New" modal form

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a form to name a new earning group and pick its default earning method so that I can set up a group. |
| **Priority** | High. Every group is created through this form. A wrong default method silently gives a group the wrong earning pattern. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. Clicking "Create New" opens a modal window (a dialog over the current page) with the edit form.
2. **Name** is a text field.
3. **Default Earning Method** is a select box with the options Pro-Rata, Rule of 78 and Reverse rule of 78.
4. Pro-Rata is selected by default.

**Out of Scope:**

- The Custom earning curve type from AP-2471. It is deliberately not offered as a default method here.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No field is marked required and no limits are given. The ticket does not say whether Name may be blank, whether two groups may share a name, or what the maximum length is. With no error path described, we cannot say whether accepting bad input is a bug. | High | Raise Q-001. Run blank-name, duplicate-name and long-name tests anyway and report the outcome as observations. Two groups with the same name could be assigned the wrong way round in Earning Assignments. |
| The modal's other controls are not described: submit button label, cancel or close, and whether closing discards the input. | Low | Record what the modal offers. Check that cancelling does not create a group. |

---

### REQ-004 — Creating a group and opening its details page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want submitting the form to create the group and take me to its details page so that I can start adding curves to it straight away. |
| **Priority** | High. Without a working create, nothing else in the ticket can happen. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. When the form is submitted, the group is created.
2. The user is redirected to the Earning group details page.
3. The details page has a navigation component titled "Earning Group {name}", where {name} is the name entered.
4. The navigation component has one nav item, "Edit".
5. *(Follows from REQ-002, not a separate written criterion.)* The new group appears in the list page datagrid with its name and default method.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No success message is described, and no behaviour is given for a failed create (for example, a validation error). | Medium | Accept the redirect as the success signal. Record any message shown. |

---

### REQ-005 — Assigning an earning curve to a group

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to pick an earning curve and add it to the group so that the group contains the curves it should. |
| **Priority** | High. Assigning curves is the purpose of a group. A curve that silently fails to attach leaves contracts with no earning pattern. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression |

**Acceptance Criteria:**

1. The details page has a form to assign an earning curve, with an **Earning Curve** select box listing the earning curves and a **Submit** button.
2. When the form is submitted, the earning curve is added to the group and shown in the datagrid below.
3. *(From Ken Nguyen's comment of 2026-09-23, not a written criterion.)* One earning curve can belong to several earning groups at once.

**Out of Scope:**

- Creating or editing the earning curves themselves. That is AP-2471.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Nothing says whether the same curve can be assigned to the same group twice, or whether curves already in the group are removed from the select box. A duplicate row could double-count a curve. | Medium | Try assigning the same curve twice and report the result. Raise Q-004. |
| Nothing says which curves the select box lists: all curves, only enabled ones, or only those whose type matches the group's default method. | Medium | Compare the select box with the Earning Curves list. Raise Q-005. |
| Submitting with no curve selected is not described. | Low | Test it and record what happens. |
| This depends on AP-2471. Earning curves must already exist, and AP-2471 has an open report that Custom curves do not save. | Medium | Use existing Pro-Rata or Rule of 78 curves as test data. If none exist, create them first through AP-2471's screen and note this in the log. |

---

### REQ-006 — Datagrid of assigned earning curves

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to see every curve in the group with its key details so that I can check the group is set up correctly. |
| **Priority** | Medium. It is read-only, but it is the only place the admin can confirm what the group contains. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. The details page has a datagrid of assigned earning curves with the columns Name, Term month, Coverage odometer, Earning curve type, Is Enabled? and Actions.
2. The Coverage odometer column shows the range as "{Coverage odometer from} - {Coverage odometer to}".
3. The Actions column has a trash can icon that unassigns the curve.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The number format for the odometer range is not given (thousands separator, units). | Low | Accept any readable format that shows both values in "from - to" order, matching the curve's own record. |

---

### REQ-007 — Unassigning a curve, with confirmation

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to remove a curve from a group after confirming so that I can correct a group without removing curves by accident. |
| **Priority** | High. Curves are shared across groups, so if unassign deletes more than the link it destroys data in other groups. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. Clicking the trash can icon opens a modal asking "Are you sure to delete this record?".
2. The curve is removed only after the user confirms.
3. *(Implied by the label "Unassign" and by the 2026-09-23 comment, not stated outright.)* Unassigning removes only the curve's link to this group. The curve itself still exists, and stays in any other group it belongs to.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The confirmation says "delete this record", which could mean the earning curve itself rather than its membership of this group. The ticket does not say which. If the curve is deleted, it also disappears from every other group and from the Earning Curves list. That would quietly change the earning pattern of every contract that relied on it. | High | Assign one test curve to two groups, unassign it from one, and check that it is still in the other group and in the Earning Curves list. Raise Q-003. |
| Cancelling the modal is not described. | Low | Check that cancelling leaves the curve in the group. |

---

### REQ-008 — Editing a group

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want to change a group's details after creating it so that I can correct mistakes. *(Inferred from the "Edit" nav item. The user story only says "create".)* |
| **Priority** | Medium. It is visible on every details page, but its behaviour is not specified, so we can only prove a minimum. |
| **Source File** | AP-2472-earning-groups-management.md |
| **Recommended Test Types** | Functional · Negative |

**Acceptance Criteria:**

1. The details page navigation has an "Edit" item.
2. *Nothing else in the ticket.* The criteria do not say what Edit opens or which fields can change. The fair minimum we can test is that Edit opens the same form as "Create New", pre-filled, and that a changed name or default method is saved and shown on the details title and in the list.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Edit has no described behaviour: form, editable fields, success message, or where the user lands afterwards. We cannot tell whether "Is Enabled?" is meant to be set here. | Medium | Test only the minimum above and say so in the report. Raise Q-006 and Q-002. |
| Nothing says whether changing the default method affects curves already assigned to the group. | Low | Change the method on a group with curves and check that the assigned curves are unchanged. Raise Q-007. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — List page | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Create modal form | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Create & redirect | ✓ | ✓ | | ✓ | | | | |
| REQ-005 — Assign curve | ✓ | ✓ | ✓ | ✓ | | | | |
| REQ-006 — Assigned-curves datagrid | ✓ | | | | ✓ | | | |
| REQ-007 — Unassign with confirmation | ✓ | ✓ | | ✓ | | | | |
| REQ-008 — Edit group | ✓ | ✓ | | | | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** earning group records (created and edited by this run, so dynamic test data); group-to-curve assignment links (created and removed by this run); earning curve records from AP-2471 (read and assigned, never edited; at least two must exist); the admin user account; and the admin sidebar menu configuration. Earning Assignments may *reference* earning groups, but it is not touched directly.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | Is Name required? Must group names be unique? Is there a maximum length? What error is shown when a rule is broken? | REQ-003 | Ken Nguyen (reporter) | Before s4 |
| Q-002 | Where is "Is Enabled?" set for a group? The create form has no such field. What is the default for a new group, and what does a disabled group change downstream? | REQ-002, REQ-008 | Ken Nguyen | Before s4 |
| Q-003 | Does the trash can icon only remove the curve from this group, or delete the earning curve record itself? The confirmation says "delete this record". | REQ-007 | Ken Nguyen | Before s4 |
| Q-004 | Can the same curve be assigned to the same group twice? If not, is it hidden from the select box or rejected with a message? | REQ-005 | Minh Lưu (developer) | Before s4 |
| Q-005 | Which curves does the Earning Curve select list: all curves, only enabled ones, or only curves matching the group's default method? | REQ-005 | Ken Nguyen | Before s4 |
| Q-006 | What does "Edit" open, and which fields can be changed? | REQ-008 | Ken Nguyen | Before s4 |
| Q-007 | What is the default earning method used for? Does changing it affect curves already in the group? | REQ-003, REQ-008 | Ken Nguyen | Before s6 |
| Q-008 | Is the list column "Default Earning curve type" the same value as the form field "Default Earning Method"? | REQ-002 | Minh Lưu | Before s6 |
| Q-009 | Which admin roles may see and use Earning Groups? | REQ-001 | Ken Nguyen | Before s6 |
| Q-010 | Can an earning group be deleted? The user story says only "create", and no delete action is listed. | REQ-002 | Ken Nguyen | Before s6 |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-007 | "Delete this record" may delete the shared earning curve itself, not just its link to this group. | High | Open |
| REQ-003 | No required fields, uniqueness or length rules, and no error behaviour, for the group name. | High | Open |
| REQ-002 | "Is Enabled?" is shown, but nothing sets it and no default is given. | High | Open |
| REQ-005 | Duplicate assignment of the same curve to one group is not addressed. | Medium | Open |
| REQ-005 | The contents of the Earning Curve select box are not defined. | Medium | Open |
| REQ-005 | Depends on AP-2471 curves existing; AP-2471 has an open Custom-save defect. | Medium | Open |
| REQ-004 | No success message or failure behaviour is described for create. | Medium | Open |
| REQ-008 | Edit has no described behaviour beyond the nav item. | Medium | Open |
| REQ-002 | Format of the Earning curves column and the column/field naming mismatch. | Low | Open |
| REQ-008 | Effect of changing the default method on assigned curves is not stated. | Low | Open |
| REQ-001 | Role restriction for the menu item is not stated. | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion. REQ-008 (Edit) has only one: the nav item exists.
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [ ] Open questions have been assigned to stakeholders. They are proposed here; nothing has been posted yet.
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design. This waits on the Gate A decision.

# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin portal, Risk Management (AP-2473: Earning Sets)
**Date:** 2026-10-03
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2473-earning-sets.md (transcribed from Jira AP-2473: description and the acceptance-criteria field `customfield_10150`. The ticket has no comments and no attachments)
**Total requirements found:** 4

related_docs: none. `qa-artifacts/qa-docs/` has no page about earning sets or earning curves yet. The only standing knowledge comes from the sibling analysis for AP-2471, which recorded on 2026-10-02 that the admin sidebar shows **Risk Management → Earning Curves, Earning Sets, Earning Groups, Earning Assignments**. The Earning Sets route is **not known** and will be learned during execution.

---

## Executive Summary

AP-2473 adds an admin screen for **earning sets**. The ticket does not define what an earning set is. Its name and its place in the Risk Management menu suggest it groups earning curves (the monthly income-recognition tables from AP-2471), but that is our inference, not the ticket's statement. As written, the ticket only promises a menu entry, a list page with a "Create New" action and an "Edit" action, and a form where the admin "enters a description".

The analysis splits the ticket into four requirements:
1. The "Earning Sets" menu item under Risk Management.
2. The Earning Sets list page (title, "Create New", datagrid).
3. The create/edit form with a Description field.
4. Saving a new or edited earning set. The user story ("I can create earning sets") requires this, but no acceptance criterion describes it.

REQ-001 to REQ-003 can be checked as written. **REQ-004 has no acceptance criteria at all.** The criteria stop once the form opens, so nothing states the button, the required fields, the success message or the error handling.

Two wording problems in the ticket could mislead a tester:
- The datagrid is described as listing **"Earning Assignments"**, which is the name of a different menu item. It is almost certainly a copy-paste slip for "Earning Sets", but it needs confirming (Q-001).
- The menu item is written **"Earning sets"** (lower-case s) in one sentence and **"Earning Sets"** in the next. We will accept either casing and record what is shown (Q-006).

**7 testability risks** are flagged, 2 of them High, and there are **8 open questions**.

Overall testability is **Low-to-Medium**. Navigation and the page layout can be proven. Creating an earning set, the one outcome the user story promises, cannot be signed off against written criteria. We can only test the minimum the story implies: a set saved with a description appears in the list and can be edited.

---

## Requirements Detail

### REQ-001 — "Earning Sets" menu item under Risk Management

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want an "Earning Sets" item in the admin menu so that I can reach the earning-set screen. |
| **Priority** | Medium. It is the only way into the feature, but it is a simple change that is easy to confirm. |
| **Source File** | AP-2473-earning-sets.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. Given the admin user is in the admin area, when the user opens the menu, a "Risk Management" section is available that contains an "Earning sets" menu item.
2. When the user clicks Earning Sets, the earning set page opens.

**Out of Scope:**

- The other Risk Management items (Earning Curves, Earning Groups, Earning Assignments). Earning Curves is covered by AP-2471; the others are not mentioned in this ticket.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket does not say which admin roles may see the menu item, so we cannot tell whether a lower-privilege admin should be refused. | Low | Test with the shared admin account. Raise Q-007. |
| The label is written "Earning sets" and "Earning Sets" in consecutive sentences. A tester could fail a correct build over capital letters. | Low | Accept either casing and record the exact label shown. Raise Q-006. |

---

### REQ-002 — Earning Sets list page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a page listing every earning set so that I can see what exists and open one to change it. |
| **Priority** | Medium. It is the hub of the feature. If the grid shows the wrong records, the admin cannot find or fix a set. |
| **Source File** | AP-2473-earning-sets.md |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. The page has a navigation component titled "Earning Sets".
2. The navigation component has one nav item, "Create New".
3. The page has a datagrid (a table of records, usually sortable and filterable) "containing the list of Earning Assignments created" with the columns **Description** and **Actions**.
4. The Actions column offers **Edit**.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The datagrid is said to list "Earning Assignments", which is a different feature in the same menu. Read literally, a grid of earning sets would fail this criterion. | Medium | Treat the grid as listing earning sets, which matches the page title and the user story. Raise Q-001. If the grid really shows earning assignments, report it as a defect against the title and story. |
| Nothing describes the empty state, sorting, filtering or paging of the datagrid. | Low | Record what the page does as an observation. Do not fail it. |

---

### REQ-003 — Create / Edit form with a Description field

| Field | Value |
|---|---|
| **User Story** | As an admin user, I want a form to enter an earning set's description so that I can create a new set or rename an existing one. |
| **Priority** | High. It is the only way to create or change a set. If Edit opens an empty form instead of the selected set, the admin could overwrite the wrong record. |
| **Source File** | AP-2473-earning-sets.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI |

**Acceptance Criteria:**

1. When the user clicks **Create New**, the earning set edit form opens to enter a description.
2. When the user clicks **Edit** on a row, the earning set edit form opens to enter a description.

**Out of Scope:**

- Any field other than Description. The ticket names no other field. Linking earning curves to a set is not mentioned and must not be assumed.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket names only one field, Description. An "earning set" presumably groups earning curves, but nothing says whether the form should also let the admin choose curves. If the form shows more fields, we cannot tell whether they are in scope. | Medium | Record every field the form shows. Test Description only. Raise Q-002. |
| No validation is described for Description: whether it is required, its maximum length, whether duplicates are allowed, or how special characters are handled. With no error path, we cannot say whether accepting an empty description is a bug. | High | Run the negative tests (empty, very long, duplicate, special characters) and report results as observations, not failures. Raise Q-004. An earning set without a description would be impossible to tell apart in the grid. |
| Nothing says that the Edit form is pre-filled with the selected set's current description, although that is the normal meaning of "Edit". | Low | Expect it to be pre-filled. Fail it only if the form opens empty or shows another set's data. |

---

### REQ-004 — Saving an earning set (create and edit)

| Field | Value |
|---|---|
| **User Story** | As an admin user, I can create earning sets. |
| **Priority** | High. Creating an earning set is the whole point of the story. Without a working save, the feature delivers nothing. |
| **Source File** | AP-2473-earning-sets.md |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. None in the ticket. The criteria end once the form opens. The only basis for testing is the user story: an admin "can create earning sets".

**Out of Scope:**

- Deleting an earning set. The user story says only "create", and the Actions column lists only Edit.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| Save has no acceptance criteria. Nothing states the button label, the success message, where the user lands afterwards, or how errors are shown. We cannot sign off save as written, and save is the step that delivers the story. | High | Gate A would normally recommend "Ask the ticket author" (Q-003). In this --auto run, test only the minimum the story implies: a saved set appears in the grid with its description, and an edit changes that description. Say so in the report. |
| Nothing says whether Cancel or leaving the form discards changes, or whether a warning appears. | Low | Record the behaviour as an observation. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Menu item | ✓ | | | ✓ | ✓ | | | |
| REQ-002 — List page | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Create/Edit form | ✓ | ✓ | ✓ | | ✓ | | | |
| REQ-004 — Save | ✓ | ✓ | | ✓ | | | | |

**Legend:** ✓ = recommended based on requirement content

**Data entities touched:** earning set records (created and edited by this run, so dynamic test data; each test should create its own set with a unique description such as `QA-AP2473-<timestamp>`), the admin user account (static), and the admin sidebar menu configuration. Earning curves (AP-2471) may later be linked to earning sets, but this ticket does not touch them.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | The datagrid is described as "the list of Earning Assignments created". Should it say "Earning Sets"? | REQ-002 | Ken Nguyen (reporter) | Before s4 |
| Q-002 | Is Description the only field on the form? Should an earning set also let the admin choose which earning curves it contains? | REQ-003 | Ken Nguyen | Before s4 |
| Q-003 | What should saving do? What is the button label, what message appears on success, where does the user land, and how are errors shown? | REQ-004 | Ken Nguyen | Before s4 |
| Q-004 | Is Description required? What is its maximum length? Are duplicate descriptions allowed? | REQ-003 | Ken Nguyen | Before s4 |
| Q-005 | Is deleting an earning set intentionally out of scope? | REQ-004 | Ken Nguyen | Before s6 |
| Q-006 | Should the menu label read "Earning Sets" or "Earning sets"? | REQ-001 | Ken Nguyen | Before s6 |
| Q-007 | Which admin roles may see and use Earning Sets? | REQ-001 | Ken Nguyen | Before s6 |
| Q-008 | Does the edit form open as a new page or as a dialog over the list? | REQ-003 | Ken Nguyen | Before s6 |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-004 | Save has no acceptance criteria. The criteria end once the form opens. | High | Open |
| REQ-003 | No validation rules are given for Description (required, length, duplicates). | High | Open |
| REQ-002 | The datagrid is described as listing "Earning Assignments", not earning sets. | Medium | Open |
| REQ-003 | Only Description is named. It is unclear whether the set should also hold earning curves. | Medium | Open |
| REQ-003 | The Edit form is not stated to be pre-filled. | Low | Open |
| REQ-001 | Menu label casing differs between two sentences; roles are not stated. | Low | Open |
| REQ-002 | Empty state, sorting, filtering and paging are not described. | Low | Open |

---

## Sign-off Checklist

- [ ] All requirements have at least one acceptance criterion — **No: REQ-004 (Save) has none**
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [ ] Open questions have been assigned to stakeholders — assigned in this file, not yet sent to the reporter
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design — proceeding under --auto with the REQ-004 warning recorded

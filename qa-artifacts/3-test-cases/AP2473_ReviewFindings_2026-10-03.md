# Test Case Review — AP-2473

**Date:** 2026-10-03
**Reviewed by:** QA Agent — Test Case Reviewer Skill
**Sources:** qa-artifacts/1-requirements-analysis/AP-2473_requirements-analysis.md, qa-artifacts/2-test-plan/AP-2473_test-plan.md, qa-artifacts/3-test-cases/AP2473_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2473_TestCases_006-010.md

**Standing caveat:** The ticket's acceptance criteria stop once the form opens. Save (REQ-004) has no criteria, and no validation rule exists for the Description field. AP2473_003 and AP2473_004 test only what the user story promises. AP2473_005 to AP2473_008 check behaviour a senior tester expects, but they are **risk-based, not AC-confirmed**. A FAIL in those cases is a question for the product owner before it is a defect.

---

## Pass 1 — Things the Documents Say We Should Test, But Don't

_Every requirement and acceptance criterion in the analysis and test plan should have
at least one test checking it. This section lists the ones that have none, plus any
test that points at a requirement number which does not exist._

| # | Gap | Cites | Priority | What ships undetected |
|---|---|---|:---:|---|
| 1 | Validation is tested only on **Create New**. No case clears the description of an existing set through **Edit** and saves. | REQ-003 AC2, test-plan §3.2 Negative | Medium | An admin could blank out an existing set's description through Edit. The set would then be impossible to identify in a one-column grid, even though Create refuses the same input. |
| 2 | The test plan notes that the grid's empty state, sorting, filtering and paging are not described. No case records them, not even as an observation. | REQ-002 risk 2 | Low | Once staging holds many `QA-AP2473-` sets, an admin may be unable to find a set if the grid neither pages nor searches. This is a usability gap, not a defect against the ticket. |

**Orphan references** (TC cites an AC/requirement that doesn't exist upstream):
- None. Every TC cites REQ-001 to REQ-004, and each of those exists in the analysis.

**Unresolved Open Questions affecting coverage:**
- **Q-001** (grid lists "Earning Assignments") — still open. AP2473_002 expects earning sets and will record what the grid actually lists.
- **Q-002** (fields beyond Description) — still open. AP2473_003 records every field. If the form requires a field the ticket does not name, the create and edit cases depend on a guess (first available option).
- **Q-003** (Save behaviour) — still open. The success message, landing page and button label cannot be judged, only recorded.
- **Q-004** (required, length, duplicates) — still open. It decides whether a FAIL in AP2473_005, AP2473_006 or AP2473_007 is a bug or a question.
- **Q-005** (delete out of scope) — still open. No case looks for a delete control; AP2473_002 records any extra action it sees.
- **Q-006, Q-007, Q-008** — open, low impact. AP2473_001 and AP2473_003 record the label casing and whether the form is a page or a dialog. Roles are out of scope.

**Coverage, stated plainly:** REQ-001 and REQ-002 are fully covered against their criteria. REQ-003 and REQ-004 are covered for the user-story minimum: create, edit and reload. Whether the form validates its input correctly cannot be proven, only observed, until Q-004 is answered.

---

## Pass 2 — Tests a Senior Tester Would Add

_Gaps found by working through the feature with standard test-design techniques rather
than by reading the documents. Each row names the technique used and explains it, so the
reasoning is checkable by someone who does not know the terms._

| # | Case title | Technique | Defect it would catch | Priority |
|---|---|---|---|:---:|
| 1 | Clearing an existing set's description in Edit and saving is refused, and the old description is kept | State transition | Edit may skip the validation Create applies, letting an admin turn a named set into a blank one that nobody can identify. Medium because Create already covers the same rule and the fix would be shared. | Medium |
| 2 | Double-clicking the save button on Create New creates only one earning set | Error guessing | A slow server plus a double-click is a common way to get duplicate records, and the grid gives no way to tell the copies apart. Medium because it pollutes data but is easy to see and fix. | Medium |
| 3 | Opening `/admin/earning-set` after logging out redirects to the admin login | Security | If the page does not check the session, anyone with the URL could read or create earning sets, which drive how premium income is recognised. Medium because the admin area as a whole is likely protected by the same check. | Medium |
| 4 | A 256-character description is refused with a message, not a server error | Boundary value analysis | AP2473_007 tests exactly 255 characters. One character over is where a database column limit fails, often as an HTTP 500 instead of a friendly message. Medium because the admin loses their typing either way. | Medium |
| 5 | Opening the edit form for an ID that does not exist shows a "not found" page, not a server error | Error guessing | A bookmarked or mistyped edit URL could produce an HTTP 500 that leaks a stack trace. Low because only admins reach it. | Low |
| 6 | Leading and trailing spaces around a description are trimmed on save | Equivalence partitioning | `QA-1` and ` QA-1 ` would look identical in the grid but count as different sets, defeating any duplicate check. Low because it needs an unusual typing slip. | Low |
| 7 | Editing a set so its description matches another set's is handled the same way as creating a duplicate | Decision table | AP2473_006 checks duplicates on Create only. If the uniqueness rule is checked only on insert, Edit can still produce two identical sets. Low because Q-004 has not said duplicates are forbidden. | Low |
| 8 | With more than one page of sets, the grid pages or searches so a given set can be found | Equivalence partitioning | As sets pile up, an admin may be unable to reach a set to edit it. Low because it is a usability gap, not a defect against this ticket. | Low |

**What the techniques mean** — include only the rows you actually used above:

| Technique | In plain terms |
|---|---|
| Equivalence partitioning | Group inputs that should behave the same way and test one from each group, instead of testing every possible value. |
| Boundary value analysis | Test the exact edges of an allowed range, where off-by-one mistakes hide. |
| Decision table | Work through every combination of two or more settings that interact, so no combination is left untried. |
| State transition | Check that the system ends up in the right state after an action, and that counters and flags update with it. |
| Error guessing | Deliberately try the things that commonly break software, such as double-clicking, going back, or two people editing at once. |
| Security | Try to get at data or actions the current user should not be allowed to reach. |

Every Pass 2 case is **risk-based and pending AC confirmation**, because the ticket defines no validation and no Save behaviour. No candidates were dropped.

---

## Recommendation

The 10 designed cases are ready to execute as they are. They cover every acceptance criterion in the ticket and the user-story minimum for Save, and none has a design-time blocker. No Pass 2 candidate is High priority, so none needs to be promoted before this run. The two most worth adding in a later cycle are Pass 2 #1 (blank description through Edit), which also closes Pass 1 gap #1, and #3 (logged-out access). The executor can record cheap observations for #2 (double-click) and #4 (256 characters) while running AP2473_003 and AP2473_007 if time allows, without changing the case files.

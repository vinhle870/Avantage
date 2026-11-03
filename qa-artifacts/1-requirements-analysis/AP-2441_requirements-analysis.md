# Requirements Analysis Report

**Project:** Avantage Plus v2 — Admin Portal, dealer-user management
**Date:** 2026-11-01
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2441-admin-manage-user-permissions-from-a.md`
**Total requirements found:** 4

---

## Executive Summary

AP-2441 changes the Admin Portal's **Dealer User Details page** — the page an administrator
opens for one dealer user (a person who logs into the Dealer Portal on behalf of one or more
dealerships). Before the change, that page only lists the user's name and email and a
read-only "Dealers:" table of the dealerships the user is linked to. After the change, each
dealer row in that table should carry the same actions the administrator already has on the
opposite page, **Dealer Details > Users** (one dealership, listing its users): *Autoshield*,
*Deal your rate*, *Edit Permissions* and *Unlink* — but **not** the *Edit user* button,
because the administrator is already on that user's page. Clicking a dealer row should open
that dealer's details page.

Four requirements were extracted: the four actions appear on each dealer row (REQ-001), the
Edit user button does not (REQ-002), each action does the same thing it does from the Dealer
Details > Users page (REQ-003), and a row click opens the dealer's details page (REQ-004).
All four can be tested now. The acceptance criteria give a usable test oracle (the
reference against which a result is judged): **the Dealer Details > Users page for the same
user and dealer**, which already exists and works. So the tester can compare the two pages
side by side instead of guessing what each action should do.

No question blocks testing. Six points are left open for the record (Q-001 to Q-006): whether
the page-header "Edit user" button stays, whether a different "edit" control belongs in the
rows, where the administrator lands after an action, what the page shows once the user has no
dealer left, and whether the Dealer Details > Users page keeps its own Edit user button (the
reporter says it does, but by this project's rule a comment from someone in the
`not_developers` list cannot close a question). Two information-only points (Q-007, Q-008)
change no result.

Overall testability is **Medium**. The main results are visible on screen and have a working
reference page, but the ticket never says what *Autoshield* and *Deal your rate* do, the
action buttons are unlabelled icons, the User Details page has never been mapped by QA, and
two of the four actions change live data (permissions and the user-dealer link) and must be
restored after each test. If the change is wrong, an administrator either cannot manage a
user's dealerships from the user's own page — the purpose of the story — or does so with a
button that silently acts on the wrong dealer.

---

## Requirements Detail

### REQ-001 — Each dealer row on the Dealer User Details page offers Autoshield, Deal your rate, Edit Permissions and Unlink

| Field | Value |
|---|---|
| **User Story** | As an admin user, I can perform dealer/user modifications from a User Details Page (the ticket's description, verbatim). |
| **Priority** | High — this is the core of the story. Without the actions on the rows, the administrator still has to leave the user's page and open each dealership separately, which is exactly what the story removes. |
| **Source File** | `AP-2441-admin-manage-user-permissions-from-a.md` (AC: "When the admin user is on the Dealer User Details Page" / "Then the user can perform the same actions as the Dealer Details > Users management page" and the action list) |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. When the admin user is on the Dealer User Details page, then the user can perform the same actions as on the Dealer Details > Users management page ("Then the user can perform the same actions as the Dealer Details > Users management page").
2. The actions available for each dealer on the user details page are: Autoshield, Deal your rate, Edit Permissions, Unlink ("On the user details page, the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint" followed by the list).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The actions are icon buttons with no visible text (attachment `image-20260817-141357.png`); only the pencil's tooltip, "Edit user", has been seen. The ticket names the actions but not their icons or tooltips, so a tester cannot tell which icon is "Autoshield" from the ticket alone. | Medium | Identify each control by comparing it with the Dealer Details > Users row for the same user and dealer (same icon, same tooltip, same target), which the acceptance criterion makes the reference. Record each tooltip text in the execution log. |
| The Dealer User Details page is not in the `navigation` or `domain` knowledge sources; only the users list `/admin/dealer-users` is mapped. | Medium | Reach the page from `/admin/dealer-users` by searching the user and opening the row; record the URL and write it back to `domain` after execution. |

---

### REQ-002 — The dealer rows on the Dealer User Details page have no Edit user button

| Field | Value |
|---|---|
| **User Story** | As an admin user already on a user's own page, I do not get an "Edit user" button in each dealer row, because it would only edit the user I am already looking at. |
| **Priority** | High — it is the one explicit difference from the Dealer Details > Users page, written in capitals in the ticket, and the QA comment of 2026-08-23 shows it was already misunderstood once. |
| **Source File** | `AP-2441-admin-manage-user-permissions-from-a.md` (AC list item "REMOVE EDIT USER BUTTON"; "Please note that the edit action is not to edit the user (Because we are already on the user page)."; comment by Ken Nguyen, 2026-08-24) |
| **Recommended Test Types** | Functional · UI · Regression |

**Acceptance Criteria:**

1. On the user details page, the Edit user button is removed from the set of actions copied from the Dealer Details > Users page ("REMOVE EDIT USER BUTTON").
2. "Please note that the edit action is not to edit the user (Because we are already on the user page)."

**Out of Scope:**

- The Dealer Details > Users page itself. The reporter's comment says its Edit user button stays ("The button is only removed on the User > Dealers page, not the Dealer > Users page. this is working as expected" — Ken Nguyen, 2026-08-24); see Q-006 for why this is recorded rather than asserted.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The before-change page already has an **"Edit user" button in the page header** (attachment `image-20260817-141147.png`). The ticket does not say whether that header button stays or goes; a tester could mistake it for the row button and report a false failure — as happened with the Dealer > Users page on 2026-08-23. | Medium | Assert only on the dealer rows. Record the header button's presence for Q-001. |
| "The edit action is not to edit the user" can be read two ways: no edit action in the rows at all, or an edit action that edits something else (for example the dealer). | Medium | Assert that no row control opens the user's edit form; record any other edit-like control for Q-002. |

---

### REQ-003 — Each row action does the same thing from the User Details page as from the Dealer Details > Users page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I can change a user's Autoshield, Deal your rate, permissions and dealer link for one dealership from the user's page, with the same result as doing it from that dealership's Users tab. |
| **Priority** | High — two of the four actions change live data (permissions and the user-dealer link). An action wired to the wrong dealer or the wrong user on this page would change another dealership's access without the administrator noticing. |
| **Source File** | `AP-2441-admin-manage-user-permissions-from-a.md` (AC: "the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint") |
| **Recommended Test Types** | Functional · Negative · Regression |

**Acceptance Criteria:**

1. **Autoshield** from a dealer row on the User Details page does what Autoshield does from the Dealer Details > Users row for the same user and dealer.
2. **Deal your rate** from a dealer row does what it does from the Dealer Details > Users row for the same user and dealer.
3. **Edit Permissions** from a dealer row changes that user's permissions for that dealer, and the change is the one seen from the Dealer Details > Users page (its Roles column) for the same pair.
4. **Unlink** from a dealer row removes the link between that user and that dealer, as Unlink does from the Dealer Details > Users page.

**Out of Scope:**

- What Autoshield and Deal your rate mean as business features — the ticket does not describe them and only requires parity with the existing page (Q-007).

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The ticket never says what Autoshield and Deal your rate do. If either changes a setting immediately on click, a test could alter live data without knowing how to undo it. | Medium | Open each one from the Dealer Details > Users page first and record what it does; perform it on the User Details page only on this ticket's own test user, and undo any change from the same place. |
| Edit Permissions and Unlink change live data. Unlinking the test user from its only dealer may leave a user with no dealer, and the ticket does not say what happens then (Q-005). | High | Use only a user and dealer that no other ticket relies on, record the original permissions before any change, and restore them (re-link with the same roles) inside the same test case. |
| The ticket does not say where the administrator lands after completing an action from the User Details page (Q-003). | Low | Record the landing page; judge only that the action took effect. |

---

### REQ-004 — Clicking a dealer row opens that dealer's details page

| Field | Value |
|---|---|
| **User Story** | As an admin user, I can open a dealership from the user's page by clicking its row. |
| **Priority** | Medium — a navigation convenience. If it breaks the administrator can still reach the dealer from the Dealers list, but a row that opens the wrong dealer would mislead them. |
| **Source File** | `AP-2441-admin-manage-user-permissions-from-a.md` (AC: "When the user clicks on the table row, the user is redirected to the dealer details page") |
| **Recommended Test Types** | Functional · Edge-case |

**Acceptance Criteria:**

1. When the user clicks on a dealer row of the table, they are redirected to the dealer details page of that row's dealer.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The row is clickable and also holds the action buttons. If a click on a button also bubbles up to the row, the administrator would be taken away to the dealer page instead of (or as well as) performing the action. | Medium | In every REQ-003 test, check that clicking an action does not also navigate to the dealer details page. |
| "Dealer details page" is not tied to an exact route in the ticket; the admin dealer page has several tabs (Details, Users, Program eligibility, Customer portal, Financing Options). | Low | Judge that the opened page belongs to the clicked dealer (its heading names that dealer); record the URL and the active tab. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Four actions on each dealer row | ✓ | | ✓ | ✓ | ✓ | | | |
| REQ-002 — No Edit user button in the rows | ✓ | | | ✓ | ✓ | | | |
| REQ-003 — Actions behave as on Dealer Details > Users | ✓ | ✓ | ✓ | ✓ | | | | |
| REQ-004 — Row click opens the dealer details page | ✓ | | ✓ | | | | | |

**Legend:** ✓ = recommended based on requirement content

---

## Data Entities Touched

| Entity | Requirements | How |
|---|---|---|
| Dealer user (a Dealer Portal login, listed under `/admin/dealer-users`) | REQ-001–REQ-004 | Read on the User Details page |
| User–dealer link (which dealerships a user belongs to) | REQ-001, REQ-003, REQ-004 | Read; removed by Unlink and re-created by Link user |
| User permissions (roles) for one dealer — the green Roles badges on Dealer Details > Users | REQ-003 | Read and changed by Edit Permissions |
| Autoshield setting for a user and dealer | REQ-003 | Unknown — read or changed by the Autoshield action (Q-007) |
| Deal your rate setting for a user and dealer | REQ-003 | Unknown — read or changed by the Deal your rate action (Q-007) |
| Dealer (dealership) | REQ-004 | Read — its details page is opened |

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | The User Details page had an "Edit user" button in its page header before the change (attachment `image-20260817-141147.png`). Should that header button stay, or does "REMOVE EDIT USER BUTTON" also remove it? | REQ-002 | Judgement | Open | — | Ken Nguyen (reporter) |
| Q-002 | "Please note that the edit action is not to edit the user" — should the dealer rows carry **no** edit control at all, or an edit control that edits something other than the user (for example the dealer)? | REQ-001, REQ-002 | Judgement | Open | — | Ken Nguyen |
| Q-003 | After Edit Permissions is saved, Unlink is confirmed, or Autoshield / Deal your rate is completed from the User Details page, where should the administrator land — back on the User Details page, or on the Dealer Details > Users page as when the action starts there? | REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-004 | Must Unlink on the Dealer User Details page ask for a confirmation, and with the same wording as on the Dealer Details > Users page (which would now name a dealer rather than a user)? The ticket says "the same actions" but nothing about the confirmation step, so the tests record the confirmation and judge only that the link is removed when confirmed and kept when cancelled. | REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-005 | What should the User Details page show once the user is no longer linked to any dealer (for example after unlinking their last one) — an empty table, a message, or should the user disappear from `/admin/dealer-users`? | REQ-003 | Judgement | Open | — | Ken Nguyen |
| Q-006 | Should the Dealer Details > Users page keep its own "Edit user" button? Ken Nguyen's comment of 2026-08-24 says "The button is only removed on the User > Dealers page, not the Dealer > Users page. this is working as expected", but Ken Nguyen is in the registry's `not_developers` list, so by this project's rule the comment cannot mark the question Answered. The regression check records it. | REQ-002 | Judgement | Open | — (comment quoted in the question; author in `not_developers`) | Ken Nguyen |
| Q-007 | What do the Autoshield and Deal your rate actions do (open a page, open a form, or toggle a setting immediately)? The tests judge parity with the Dealer Details > Users page, so no result depends on the answer. | REQ-003 | Info | Open | — | Ken Nguyen |
| Q-008 | Is the User Details page available to every admin role, or only some? Only one admin account exists on Staging, so no test result in this ticket depends on it. | REQ-001 | Info | Open | — | Ken Nguyen |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-003 | Edit Permissions and Unlink change live data; a test that does not restore the original permissions and link would change a real user's access. | High | Open |
| REQ-001 | The actions are unlabelled icons and the User Details page is not mapped; each control must be identified by comparison with the Dealer Details > Users row. | Medium | Open |
| REQ-002 | The page-header "Edit user" button (Q-001) and a possible non-user edit control (Q-002) are not settled; only the row Edit user button can be judged. | Medium | Open |
| REQ-003 | Autoshield and Deal your rate are never described (Q-007); if either acts immediately, its effect must be undone. | Medium | Open |
| REQ-004 | A click on an action button may also trigger the row's redirect. | Medium | Open |
| REQ-004 | "Dealer details page" names no exact route or tab. | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design

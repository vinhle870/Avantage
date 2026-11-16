# Automation Report — AP-2441
Date: 2026-11-04 (runs ended 2026-11-04T17:57:21Z) · Source log: qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2441_2026-11-04.md
Spec: playwright-automation/src/tests/admin/dealerUserPermissions_AP2441.spec.ts · Tag: @AP-2441
Result: 12 of 12 PASSED cases automated — 12 passing, 0 fixme

## Summary
All twelve AP-2441 cases now run automatically on Dev (v2dev). They cover:
- the four actions on the Dealer User Details page (Auto Shield, Deal your rate, Edit Permissions, Unlink) and the missing "Edit user" button, for the test user and for a user with several dealers
- that Auto Shield and Deal your rate open the same form from both pages
- that Edit Permissions saves the role at the right dealer, and that closing it unsaved changes nothing
- Unlink, and cancelling Unlink
- that a dealer row click opens that dealer's page
- that the Dealer Details > Users tab keeps its four actions

The suite skips itself on any other environment. No assertion depends on the UI language. Actions are found by the route their button opens (`/admin/auto-shield/{link}` …). Roles are found by checkbox value (`ROLE_WINDOW_STICKER`) or by the badge text read earlier in the same run. Tooltips are only compared with each other.

**Data the runs change and put back:**
- AP2441_005 switches "Window Sticker" for user 110 at dealer 1510 and saves. In `finally` it restores exactly the step-1 role set, with a second attempt if the first does not take.
- AP2441_006 switches the role without saving. Its `finally` restores the roles only if they changed anyway.
- AP2441_007 unlinks user 110 from dealer 1510. In `finally` it re-links the user with the step-1 roles. **Each run leaves a new link id** (see Left on the environment).
- AP2441_008 dismisses the Unlink confirmation with Escape. Its `finally` re-links the user if the link was lost.
- Every other case is read-only. It fails if any Auto Shield, Deal your rate, permissions, unlink, edit-user or link-user form is submitted.
- AP2441_007 runs last in the file, so no later case depends on the link it re-creates.
- Dealer 1380 is never opened.

**Hard assertions (fail the test)** — only what the cases judge:
- the test user listed on `/admin/dealer/1510/users`. Missing data fails with "BLOCKED — test data missing on Dev"; the spec never creates the link.
- the User Details dealer row has the four action routes, no "Edit user" button and no pencil icon (001, 002)
- each action's tooltip and icon equal the Dealer > Users row's, and both rows use the same link id (001)
- no row button opens the user's own edit form, `/admin/dealer-user/{id}/edit` or a reference form's route (001, 002)
- every dealer row has the four actions, and the first and last rows match (002)
- the same form opens from both pages: name, route, heading, visible fields and their values (003, 004)
- the permissions form is for link `/admin/edit-permission/{link}` of the 1510 row, and its granted roles equal the step-1 badges (005)
- after the save, the badges differ from step 1 only by Window Sticker. After the restore, they equal step 1 (005).
- the badges are unchanged after an unsaved close (006) and after a cancelled Unlink (008)
- Unlink removes dealer 1510 from the user and the user from dealer 1510, and every other user or dealer stays. After the restore, the row has the step-1 roles and the User Details page lists 1510 again (007).
- a dealer row click opens `/admin/dealer/{id}` whose heading names that dealer (009), and the last row's dealer, not the first (010)
- the Dealer > Users tab heading names the dealer, it has the Link user button, every row button has a tooltip or icon, and the four actions are present (011)
- the last-row permissions form names the last dealer, not the first. When it names neither, its roles equal the last dealer's (012).
- the dealer users search lists the test user once
- no modal navigates to a dealer details page, and each modal closes on Escape
- no HTTP 5xx from the application's own requests

**Recorded, not judged** (`test.info().annotations`):
- headings, URLs and landing pages after a save or close (Q-003)
- tooltips and button order
- whether the User Details header still has "Edit user" (Q-001), and that form's fields
- whether the Dealer > Users row still has "Edit user" (Q-006)
- the Unlink confirmation heading and buttons (Q-004)
- the search result after an unlink (Q-005)
- flash messages
- which multi-dealer user was used, and how it was found
- the link id before and after the re-link
- any 5xx from the chat widget or the Cloudflare beacon

The 001 and 002 "edit-like button" step is generic. Any row button whose route is not one of the four actions, or that carries the pencil icon, is opened, checked and closed. Today no such button exists, so this is recorded as "none".

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2441_001 | Test user's User Details page shows Autoshield, Deal your rate, Edit Permissions and Unlink on its dealer row, with no Edit user | automated — passing | — |
| AP2441_002 | A user linked to several dealers sees the same four actions on every dealer row | automated — passing | — |
| AP2441_003 | Autoshield from the User Details page opens the same thing as from the dealer's Users tab | automated — passing | — |
| AP2441_004 | Deal your rate from the User Details page opens the same thing as from the dealer's Users tab | automated — passing | — |
| AP2441_005 | Edit Permissions from the User Details page changes the role for that dealer, seen on the dealer's Users tab | automated — passing | — |
| AP2441_006 | Closing Edit Permissions on the User Details page without saving leaves the user's roles unchanged | automated — passing | — |
| AP2441_007 | Unlink from the User Details page removes the user from that dealer on both pages (then re-linked) | automated — passing | Leaves a new link id per run (restore re-links) |
| AP2441_008 | Cancelling Unlink on the User Details page keeps the user linked to the dealer | automated — passing | — |
| AP2441_009 | Clicking a dealer row on the User Details page opens that dealer's details page | automated — passing | — |
| AP2441_010 | For a user with several dealers, clicking the last dealer row opens that dealer, not the first | automated — passing | — |
| AP2441_011 | The dealer's Users tab still offers Autoshield, Deal your rate, Edit Permissions and Unlink after the change | automated — passing | — |
| AP2441_012 | For a user with several dealers, Edit Permissions on the last row opens that dealer's permissions, not the first's | automated — passing | — |

## Step map
Every test starts with `AdminFlow.loginToAdminPortal()` (reused) and ends with `verifyNoServerError()`. The read-only ones also call `verifyNothingSubmitted()`. All other methods below are new, in `DealerUserPermissionsFlow`.

| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | AdminFlow.loginToAdminPortal() | reused |
| AP2441_001 | 1 | readUserRowOnDealerTab(1510) — Hard: user listed. Rec: badges, buttons · recordRowEditUserForm() — Rec: reference edit form | new |
| AP2441_001 | 2 | openUserDetailsBySearch() — Hard: one search row · recordHeaderEditUserForm() — Rec: Q-001 | new |
| AP2441_001 | 3 | readDealerRowOnDetails(1510) · openEditLikeRowButtons() — Hard: none opens the user's edit form | new |
| AP2441_001 | 4 | verifyDetailsRowActions(1510), verifySameActions(row, reference, sameLink) | new |
| AP2441_002 | 1 | findMultiDealerUser(130, [110], 1380) — read-only; user 130 when it qualifies, else every list page to the last (no cap) | new |
| AP2441_002 | 2 | readUserRowOnDealerTab(first) · recordRowEditUserForm(first) · verifyRoles(first, unchanged) | new |
| AP2441_002 | 3 | openUserDetails() · readDealerRowOnDetails(first / last) | new |
| AP2441_002 | 4 | openEditLikeRowButtons(first), (last) · openUserDetails() · verifyDealerRowsUnchanged() | new |
| AP2441_002 | 5 | verifyDetailsRowActions(each dealer) · verifySameActions(last, first) | new |
| AP2441_003 / _004 | 1 | readUserRowOnDealerTab · openRowActionOnDealerTab(autoShield / dealYourRate) · closeModal · verifyRoles(unchanged) | new |
| AP2441_003 / _004 | 2 | openUserDetailsBySearch · readDealerRowOnDetails(1510) | new |
| AP2441_003 / _004 | 3 | openRowActionOnDetails(1510, action) — Hard: no dealer-page navigation, form loads | new |
| AP2441_003 / _004 | 4 | closeModal — Hard: modal closes. Rec: landing (Q-003) | new |
| AP2441_003 / _004 | 5 | verifySameForm(form, reference) · verifyNothingSubmitted | new |
| AP2441_005 | 1 | readUserRowOnDealerTab — step-1 badges kept for the restore | new |
| AP2441_005 | 2 | openUserDetailsBySearch · openRowActionOnDetails(editPermissions) · verifyFormLink · verifyFormRoles | new |
| AP2441_005 | 3 | toggleRole(ROLE_WINDOW_STICKER) · submitModal — Hard: < 500. Rec: landing, message | new |
| AP2441_005 | 4 | verifyRoles(withRoleSwitched(step 1, Window Sticker)) · attachScreenshot · `finally` ensureLinkedWithRoles(step 1) | new |
| AP2441_005 | 5 | restoreRoles (2 attempts) · verifyRoles(step 1) | new |
| AP2441_006 | 1–2 | readUserRowOnDealerTab · openUserDetailsBySearch · openRowActionOnDetails(editPermissions) · verifyFormLink | new |
| AP2441_006 | 3 | toggleRole · closeModal (Escape) | new |
| AP2441_006 | 4 | verifyRoles(step 1) · verifyNothingSubmitted · `finally` ensureLinkedWithRoles (no-op when unchanged) | new |
| AP2441_007 | 1 | readUserRowOnDealerTab · readDealerUserEmails · openUserDetailsBySearch · readDealerRows | new |
| AP2441_007 | 2 | openRowActionOnDetails(unlink) · submitModal — Rec: Q-004 wording, landing, message | new |
| AP2441_007 | 3 | searchUsers (Rec: Q-005) · openUserDetails · verifyUserDealers(1510 gone, others kept) · verifyDealerUsers(user gone, others kept) · 2 screenshots | new |
| AP2441_007 | 4 | `finally` ensureLinkedWithRoles → relinkUser (Link user modal, email, step-1 permissions) + restoreRoles. Rec: new link id | new |
| AP2441_007 | 5 | verifyRoles(step 1) · openUserDetails · verifyUserDealers(1510 back) | new |
| AP2441_008 | 1 | readUserRowOnDealerTab · openUserDetailsBySearch · verifyUserDealers(1510 listed) | new |
| AP2441_008 | 2 | openUnlinkConfirmation — Rec: Q-004. No confirmation → skipped "Unlink has no confirmation to cancel", link restored in `finally` | new |
| AP2441_008 | 3 | closeModal (Escape) | new |
| AP2441_008 | 4 | openUserDetails · verifyUserDealers(1510 listed) · verifyRoles(step 1) · verifyNothingSubmitted | new |
| AP2441_009 | 1 | readUserRowOnDealerTab · openUserDetailsBySearch · readDealerRowOnDetails(1510) | new |
| AP2441_009 | 2 | clickDealerName(1510) — Hard: < 500 | new |
| AP2441_009 | 3 | verifyOnDealerPage(1510, "Vinh le 2") — Rec: URL, active tab | new |
| AP2441_010 | 1 | findMultiDealerUser · openUserDetails · readDealerRows (first, last) | new |
| AP2441_010 | 2–3 | clickDealerName(last) · verifyOnDealerPage(last, name, not first) | new |
| AP2441_011 | 1 | readUserRowOnDealerTab · verifyDealerTabPage("Vinh le 2") | new |
| AP2441_011 | 2–3 | verifyDealerTabRowActions — Rec: Q-006 Edit user, order | new |
| AP2441_012 | 1 | findMultiDealerUser | new |
| AP2441_012 | 2 | readUserRowOnDealerTab(last), (first) | new |
| AP2441_012 | 3 | openUserDetails · readDealerRowOnDetails(last) · openRowActionOnDetails(last, editPermissions) · attachScreenshot · readFormRoles | new |
| AP2441_012 | 4 | closeModal · verifyRoles(last, step 2) | new |
| AP2441_012 | 5 | verifyFormForDealer(heading names last not first; else roles). Indistinguishable → skipped as BLOCKED | new |

## New locators
All were confirmed on Dev on 2026-11-04 (around 17:42–17:47Z), on the pages named below. The counts are the matches on that page (dealer 1510 has one user row; user 110 has one dealer row; user 130 has two).

| Name | Expression | Page | Count |
|---|---|---|---|
| UserLinkActions.buttons(row) | `.table-column-group-action a[data-href]` within the row | /admin/dealer/1510/users · /admin/dealer-users/110 | 5 · 4 |
| UserLinkActions.action(row, a) | `.table-column-group-action a[data-href^="/admin/auto-shield/"]` (also `/admin/rate-user/`, `/admin/edit-permission/`, `/admin/unlink-permission/`) | both | 1 each |
| UserLinkActions.editUser(row) | `.table-column-group-action a[data-href^="/admin/dealer-user/"][data-href*="/edit"]` | /admin/dealer/1510/users · /admin/dealer-users/110 | 1 · 0 |
| UserLinkActions.pencilIcon(row) | `.table-column-group-action .fa-pen` | /admin/dealer/1510/users · /admin/dealer-users/110 | 1 · 0 |
| UserLinkActions.badges(row) | `.badge` within the row | /admin/dealer/1510/users | 12 |
| tooltip (read) | parent `span[data-original-title]` (or `title`) of each button | both | 1 per button |
| AdminUserLinkModal.root | `#myModal` | all action modals | 1 |
| AdminUserLinkModal.formFor(route) | `#myModal.show form[action*="{route}"]` | auto-shield, rate-user, edit-permission, unlink-permission, dealer-user edit, link-user | 1 |
| AdminUserLinkModal.lblHeading | `#myModal.show h1` | all action modals | 1 |
| AdminUserLinkModal.btnSubmit | `#myModal.show form button[type="submit"]` (`#form_save`) | edit-permission, unlink-permission, link-user | 1 |
| AdminUserLinkModal.chkRoles | `#myModal.show input[type="checkbox"][name="form[roles][]"]`, Window Sticker by `[value="ROLE_WINDOW_STICKER"]` | /admin/edit-permission/261 | 12 (1) |
| AdminUserLinkModal.txtLinkEmail | `#myModal.show #form_email` | /admin/dealer/1510/link-user | 1 |
| AdminUserLinkModal.chkPermissions | `#myModal.show input[type="checkbox"][name="form[permissions][]"]` | /admin/dealer/1510/link-user | 12 |
| AdminUserLinkModal.lblFlash | `.alert` | page after a submit | 1 |
| AdminDealerUsersListPage.btnOpenSearch | `#ui-view a[data-target="#searchForm"]` | /admin/dealer-users | 1 |
| AdminDealerUsersListPage.txtKeyword | `#user_search_keyword` | /admin/dealer-users | 1 |
| AdminDealerUsersListPage.btnSearch | `#user_search_save` | /admin/dealer-users | 1 |
| AdminDealerUsersListPage.rows | `#ui-view table tbody tr` having `td[data-href^="/admin/dealer-users/"]` | /admin/dealer-users | 10 per page |
| AdminDealerUsersListPage.rowByEmail(e) | rows filtered by `getByRole('cell', { name: e, exact: true })` | search result | 1 |
| AdminDealerUsersListPage.lnkPages | `#ui-view .pagination a[href*="page="]` (highest `page=N` = last page) | /admin/dealer-users | 6 (last = 9) |
| AdminDealerUserDetailsPage.lblHeading | `#ui-view h1` | /admin/dealer-users/110, /130 | 1 |
| AdminDealerUserDetailsPage.btnHeaderEditUser | `#ui-view nav a[data-href^="/admin/dealer-user/"][data-href*="/edit"]` | /admin/dealer-users/110, /130 | 1 |
| AdminDealerUserDetailsPage.lblEmail | `#ui-view .card-body .row .col > div` (first; `<strong>` label dropped) | /admin/dealer-users/130 | 1 |
| AdminDealerUserDetailsPage.dealerRows | `#ui-view table tbody tr` having `td[data-href^="/admin/dealer/"]` | /admin/dealer-users/110 · /130 | 1 · 2 |
| AdminDealerUserDetailsPage.dealerRow(id) | dealerRows having `td[data-href="/admin/dealer/{id}"]` | /admin/dealer-users/130 (1363) | 1 |
| AdminDealerUserDetailsPage.nameCell(row) | `td[data-href]` nth(1) | /admin/dealer-users/110 | 1 |
| AdminDealerUsersTabPage.lblHeading | `#ui-view h1` | /admin/dealer/1510/users, /admin/dealer/1518 | 1 |
| AdminDealerUsersTabPage.lblActiveTab | `#ui-view .card-header .nav-link.active` | /admin/dealer/1510/users, /admin/dealer/1518 | 1 |
| AdminDealerUsersTabPage.btnLinkUser | `#ui-view nav a[data-href$="/link-user"]` | /admin/dealer/1510/users | 1 |
| AdminDealerUsersTabPage.userRows / userRow(e) | `#ui-view table tbody tr` having `.table-column-group-action`, filtered by `getByRole('cell', { name: e, exact: true })` | /admin/dealer/1510/users | 1 |

## Files changed
None of the QA's files was changed. `src/pages/adminPortal/index.ts` and `src/core/fixtures/test-fixtures.ts` were not edited either, so the new page objects are imported by path. The AP-2495 files in the workbench were not touched.

| File | Change |
|---|---|
| playwright-automation/src/pages/adminPortal/UserLinkActions.ts | new — row action buttons (route-based), badges, button reader |
| playwright-automation/src/pages/adminPortal/AdminUserLinkModal.ts | new — the shared `#myModal`: form by route, signature, role / permission checkboxes, Escape close, flash |
| playwright-automation/src/pages/adminPortal/AdminDealerUsersListPage.ts | new — /admin/dealer-users list, search dialog, rows, last page |
| playwright-automation/src/pages/adminPortal/AdminDealerUserDetailsPage.ts | new — /admin/dealer-users/{id}: heading, header Edit user, e-mail, Dealers rows, Name cell |
| playwright-automation/src/pages/adminPortal/AdminDealerUsersTabPage.ts | new — /admin/dealer/{id}/users: heading, active tab, Link user, user rows |
| playwright-automation/src/flows/DealerUserPermissionsFlow.ts | new — AP-2441 business steps, app-only 5xx collector, submission guard, restore / re-link helpers |
| playwright-automation/src/tests/admin/dealerUserPermissions_AP2441.spec.ts | new — 12 tests, `@admin @AP-2441`, Dev-only skip |

## Run
Command: `npx playwright test --project=chromium --grep @AP-2441`
Lint: pass (`npm run lint`, tsc --noEmit, no errors).
Run: 12 passed, 0 fixme, about 1.9 min per run. It ran green in two separate full runs (run 1 ended about 17:55:09Z, run 2 at 17:57:21Z). It also ran green in an earlier run of the 11 cases other than AP2441_007. `--repeat-each` was not used, because AP2441_007 creates a link id that cannot be deleted. No test was flaky. There was no third-party 5xx in either run.

## Left on the environment
- **AP2441_007:** each run deletes the user 110 → dealer 1510 link and creates a new one with the same 12 roles. Run 1 deleted link 261 and created **262**. Run 2 deleted 262 and created **263**. User 110 is now linked to dealer 1510 as link **263**, with the same 12 roles (Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management). The `test-data` source still says 261.
- **AP2441_005:** Window Sticker was removed and re-granted in each run. Its badge now shows in a different position because badges follow grant order; the set of roles is unchanged.
- No other record was created or changed. User 130 and its dealers 1363 and 1518 were only read, and dealer 1380 was not opened.

## Pull request
PR skipped: `--review external` — the orchestrator's qa-reviewer runs R5 first. The PR is also blocked for now: origin/dev differs from the local framework, and `gh` is not signed in.

## Not passing
None.

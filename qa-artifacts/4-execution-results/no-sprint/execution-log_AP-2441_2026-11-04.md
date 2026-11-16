# Execution Log — AP-2441 (Admin: Manage user permissions from a User Details Page)

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker, QA batch Wave 2)
**Environment:** Dev
**Date:** 2026-11-04
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 2026-11-04T17:01:13Z → 2026-11-04T17:10:17Z
**Ticket status at execution:** "QA" (not QC) — executed by the user's decision for this batch, relayed by the orchestrator
**Test-case files:** qa-artifacts/3-test-cases/AP2441_TestCases_001-005.md, AP2441_TestCases_006-010.md, AP2441_TestCases_011-012.md
**Gate B:** Execute the current 12 cases on Dev; rule B2 already applied (High proposal P1 promoted as AP2441_012), not re-run — decided by qa-reviewer (R2 round 3)

**Environment health check (before execution):** PASS — `GET https://v2dev.garantieavantageplus.ca/admin/login` loaded the login page at 17:01:13Z with the heading "Connexion" and the "Courriel", "Mot de passe" and "Se connecter" controls visible. Screenshot: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/envcheck-DevAdminLoginPage_pass.png`. The `env-check` knowledge source is declared `missing`, so this login-page check is the whole smoke test.

**Account:** the Admin Portal login from the "Dev Environment" section of the `env` source (credentials not reproduced here). Sign-in at 17:01:28Z landed on `/admin`.

**Test data found on Dev (step-1 check):** `/admin/dealer/1510/users` opened with the heading "Dealer Vinh le 2 > Users" and listed exactly one user, "Vinh le2 Vinh Le2" (`vinhle8702@gmail.com`). The pair seen on Staging **does exist on Dev**, so no case was BLOCKED for test data. Dev ids: dealer-user **110**; user-to-dealer link (the id in the row's action URLs) **211** before AP2441_007, **261** after AP2441_007 re-linked the user. The user's 12 roles at dealer 1510 on Dev: Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management. The user is linked to no other dealer, and dealer 1510 has no other user.

**Multi-dealer user (AP2441_002, _010, _012):** found by a read-only scan of the first 3 pages of `/admin/dealer-users` (30 users, each User Details page read with a GET). Users with two or more dealers: 130 Nick Tain (1363, 1518), 128 Sébastien Bourget (1363, 1512, 1517, 1518), 126 Marie-Eve TEST PORTAL (1363, 1372, 1512, 1518), 97 Trinh Le Huu (273, 1447), 80 dealer test (1497–1502). None is linked to dealer 1380 and none is named for another ticket in `test-data`. The first in list order was used: **Nick Tain, `netain@gmail.com`, dealer-user 130** — first row dealer **1363 "Test Dealer 2"** (link 259), last row dealer **1518 "Permaplate test 2"** (link 260). Nothing was changed on this user.

**Records left behind:** none created. AP2441_005 switched Window Sticker off and back on for user 110 at dealer 1510 (restored at 17:05:09Z). AP2441_007 unlinked user 110 from dealer 1510 (link 211 deleted at 17:09:07Z) and re-linked it with the same 12 roles (new link **261**, 17:09:59Z). Final state matches step 1 of every case. Vehicles 915 and 1142 (AP-2495) and dealer 1380 were not touched.

| Metric | Value |
|---|:---:|
| Total test cases | 12 |
| Passed | 12 |
| Failed | 0 |
| Blocked | 0 |
| Skipped | 0 |
| **Pass rate** | **100% (12 of 12)** |

Execution order (High first, with the data-changing order from the test cases): AP2441_011 → 001 → 003 → 004 → 005 → 006 → 002 → 012 (after 006 PASSED) → 010 → 009 → 008 → 007 (last).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2441_001 | Test user's User Details page shows Autoshield, Deal your rate, Edit Permissions and Unlink on its dealer row, with no Edit user | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_001-step4-UserDetailsFourActionsNoEditUser_pass.png` | Row has Auto Shield, Dealyourate, Edit permissions, Unlink; no Edit user |
| AP2441_002 | A user linked to several dealers sees the same four actions on every dealer row | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_002-step5-TwoDealerRowsSameFourActions_pass.png` | Nick Tain, rows 1363 and 1518 both show the same four actions |
| AP2441_003 | Autoshield from the User Details page opens the same thing as from the dealer's Users tab | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_003-step5-AutoShieldSameFormFromUserDetails_pass.png` | Same "Auto shield integration" modal, same link 211, HTTP 200 |
| AP2441_004 | Deal your rate from the User Details page opens the same thing as from the dealer's Users tab | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_004-step5-DealYourRateSameFormFromUserDetails_pass.png` | Same "Deal Your Rate User ID" modal, same link 211, HTTP 200 |
| AP2441_005 | Edit Permissions from the User Details page changes the role for that dealer, seen on the dealer's Users tab | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_005-step5-RolesRestoredTwelve_pass.png` | Window Sticker removal reached dealer 1510 row; restored to 12 roles |
| AP2441_006 | Closing Edit Permissions on the User Details page without saving leaves the user's roles unchanged | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_006-step4-RolesUnchangedAfterClose_pass.png` | Closed with Escape after unticking; 12 roles unchanged |
| AP2441_007 | Unlink from the User Details page removes the user from that dealer on both pages (then re-linked) | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_007-step5-RelinkedTwelveRoles_pass.png` | Unlinked from both pages; re-linked with 12 roles (new link 261) |
| AP2441_008 | Cancelling Unlink on the User Details page keeps the user linked to the dealer | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_008-step4-StillLinkedAfterCancel_pass.png` | Confirmation shown; dismissed with Escape; link and 12 roles kept |
| AP2441_009 | Clicking a dealer row on the User Details page opens that dealer's details page | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_009-step3-RowOpensDealer1510Details_pass.png` | Opens `/admin/dealer/1510`, heading "Dealer Vinh le 2" |
| AP2441_010 | For a user with several dealers, clicking the last dealer row opens that dealer, not the first | Low | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_010-step3-LastRowOpensDealer1518_pass.png` | Last row opens `/admin/dealer/1518`, not 1363 |
| AP2441_011 | The dealer's Users tab still offers Autoshield, Deal your rate, Edit Permissions and Unlink after the change | Medium | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_011-step3-DealerUsersTabFourActions_pass.png` | Four actions present; Edit user also still present (Q-006) |
| AP2441_012 | For a user with several dealers, Edit Permissions on the last row opens that dealer's permissions, not the first's | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_012-step3-EditPermissionsLastRowForm_pass.png` | Form heading names "Permaplate test 2" (last dealer); closed unsaved |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2441_001 — Test user's User Details page shows Autoshield, Deal your rate, Edit Permissions and Unlink on its dealer row, with no Edit user — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in, open `/admin/dealer/1510/users`, hover each row button, open the row's "Edit user" and leave unsaved | The page lists "Vinh le2 Vinh Le2"; tooltips and the reference edit form recorded; nothing saved | Heading = "Dealer Vinh le 2 > Users"; one row "Vinh le2 Vinh Le2" / `vinhle8702@gmail.com`. Tooltips left to right = "Auto Shield" (`/admin/auto-shield/211`), "Dealyourate" (`/admin/rate-user/211`), "Edit permissions" (`/admin/edit-permission/211`), "Edit user" (`/admin/dealer-user/110/edit`), "Unlink" (`/admin/unlink-permission/211`). "Edit user" opened a modal dialog (the page URL stayed `/admin/dealer/1510/users`) headed "Edit user" with fields Email* = `vinhle8702@gmail.com`, First name* = "Vinh le2", Last name* = "Vinh Le2", Phone (empty), Language* = English, checkbox "Enable two-factor authentication*" and a Save button | ✅ | Reference edit form = modal "Edit user" loaded from `/admin/dealer-user/110/edit`. It has no Cancel or × control; it was closed with the Escape key and nothing was saved |
| 2 `[Pre-Condition]` | Open `/admin/dealer-users`, search `vinhle8702@gmail.com`, open the row; use the header "Edit user" if present and leave unsaved | User Details page opens with a "Dealers" row for 1510; URL and header Edit user recorded | The search icon opened a "Search" dialog with one field "Keyword*"; submitting it listed one row (User ID 110, "Vinh le2 Vinh Le2", last login October 6, 2024). Clicking the row opened `/admin/dealer-users/110`, heading "User Vinh le2 Vinh Le2", "User details" (Email, First name, Last name) and a "Dealers" table (Dealer ID, Name, Email, Phone, Group, Actions) with one row: 1510, "Vinh le 2", `vinhle8702@gmail.com`, Group A. The header has an "Edit user" link (`/admin/dealer-user/110/edit`); it opened the same "Edit user" modal with the same six fields | ✅ | Q-001 record: the page header still carries "Edit user". Modal closed with Escape, nothing saved |
| 3 | Hover each button in the dealer 1510 row; open every edit-like button except Edit Permissions and leave unsaved | Tooltips recorded; edit-like buttons' results recorded; no error | Row buttons left to right: "Auto Shield" (`/admin/auto-shield/211?redirectUrl=…/admin/dealer-users/110`), "Dealyourate" (`/admin/rate-user/211…`), "Edit permissions" (`/admin/edit-permission/211…`), "Unlink" (`/admin/unlink-permission/211…`). No pencil icon and no tooltip starting "Edit" other than "Edit permissions" | ✅ | Edit-like buttons other than Edit Permissions: none. Nothing opened, nothing saved |
| 4 `[Verification]` | Compare with steps 1 and 2; look for "Edit user" in every dealer row | Autoshield, Deal your rate, Edit Permissions, Unlink present with the step-1 tooltips; no "Edit user"; no row button opens the user's edit form | The dealer 1510 row shows exactly four buttons with tooltips "Auto Shield", "Dealyourate", "Edit permissions", "Unlink" — the step-1 buttons minus "Edit user", pointing at the same link 211. No row button targets `/admin/dealer-user/110/edit` | ✅ | Q-002 record: no other edit-like button exists, so nothing to record. Order matches the Dealer > Users page |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_001-step4-UserDetailsFourActionsNoEditUser_pass.png` — the User Details page of Vinh le2 Vinh Le2 with the dealer 1510 row and its four action buttons, no Edit user button in the row

### AP2441_002 — A user linked to several dealers sees the same four actions on every dealer row — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Find a user with ≥ 2 dealers in the first 3 pages, skipping dealer 1380 and users reserved by other tickets | A User Details page with ≥ 2 dealer rows; name, email, row count and URL recorded | User = Nick Tain, `netain@gmail.com`; URL = `/admin/dealer-users/130`; heading "User Nick Tain"; 2 dealer rows: 1363 "Test Dealer 2" (`ken+dealer@garantieavantageplus.ca`), 1518 "Permaplate test 2" (`ken+permaplate2@garantieavantageplus.ca`) | ✅ | First qualifying user in list order (page 1). No dealer 1380; not named in `test-data` |
| 2 `[Pre-Condition]` | On `/admin/dealer/1363/users` open "Edit user" on Nick Tain's row, record, leave unsaved, reload and re-read the row | Reference form recorded; after reload the row is unchanged | Heading "Dealer Test Dealer 2 > Users". "Edit user" (`/admin/dealer-user/130/edit`) opened the modal "Edit user": Email* = `netain@gmail.com`, First name* = "Nick", Last name* = "Tain", Phone empty, Language* = English, 2FA checkbox, Save. After reload (17:06:51Z) the row's roles = Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, User management — same as before | ✅ | The modal has no Cancel or ×; closed with Escape (Back not needed — the modal adds no history entry). Nothing changed |
| 3 | Hover each button in the first and last dealer rows | Tooltips recorded for both rows; no error | Row 1363: "Auto Shield" (link 259), "Dealyourate", "Edit permissions", "Unlink". Row 1518: "Auto Shield" (link 260), "Dealyourate", "Edit permissions", "Unlink" | ✅ | Each row's buttons point at its own link id (259 vs 260) |
| 4 | Open each edit-like button except Edit Permissions in both rows; leave unsaved; reload | Results recorded, nothing saved; Dealers table unchanged | No edit-like button other than "Edit permissions" in either row. After reload the Dealers table still shows 1363 and 1518 | ✅ | Recorded "none" for both rows |
| 5 `[Verification]` | Check every dealer row against steps 2–4 | Every row has the four actions and no Edit user; first and last rows match; no row button opens the user's edit form | Both rows show exactly "Auto Shield", "Dealyourate", "Edit permissions", "Unlink"; no "Edit user"; no row link targets `/admin/dealer-user/130/edit` | ✅ | Q-002 record: no other edit-like button. Row count = 2 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_002-step5-TwoDealerRowsSameFourActions_pass.png` — Nick Tain's User Details page with both dealer rows showing the same four action buttons

### AP2441_003 — Autoshield from the User Details page opens the same thing as from the dealer's Users tab — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | On `/admin/dealer/1510/users` click "Autoshield" on the test user's row; record and leave unsaved | Reference behaviour recorded; row unchanged | A modal opened over `/admin/dealer/1510/users` (URL unchanged) headed "Auto shield integration" with empty fields "Autoshield dealer id*", "Username", "Password*", "Confirm password*", "Autoshield user id*" and a Save button. It names neither the user nor the dealer; it is loaded from `/admin/auto-shield/211` (the user's link to dealer 1510) | ✅ | Closed with Escape; no setting changed, so nothing to put back |
| 2 `[Pre-Condition]` | Open the test user's User Details page | Page opens with a dealer 1510 row | `/admin/dealer-users/110` opened with the dealer 1510 "Vinh le 2" row | ✅ | Opened at the URL recorded through the search in AP2441_001 step 2 |
| 3 | Click "Autoshield" in the dealer 1510 row | Does not go to the dealer details page; what opens recorded | `GET /admin/auto-shield/211?redirectUrl=https://v2dev.garantieavantageplus.ca/admin/dealer-users/110` = HTTP 200; the same "Auto shield integration" modal opened over the User Details page with the same five empty fields; URL stayed `/admin/dealer-users/110` | ✅ | Did not navigate to the dealer details page |
| 4 | Leave without saving | Returns without an error; landing recorded | Closed with Escape; browser stays on `/admin/dealer-users/110` with no message | ✅ | Q-003 record: closing the modal leaves the admin on the User Details page |
| 5 `[Verification]` | Compare step 3 with step 1 | Same form, for the same user and dealer, same values; no error; Autoshield state as in step 1 | Same modal title, same five fields, all empty in both cases, and both requests use link 211 (user 110 at dealer 1510). No error page, no HTTP 5xx; nothing saved | ✅ | Q-003 landing: User Details page |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_003-step1-ReferenceAutoShieldFromDealerUsers_pass.png` — the reference "Auto shield integration" modal opened from Dealer Vinh le 2 > Users
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_003-step5-AutoShieldSameFormFromUserDetails_pass.png` — the same modal opened from the User Details page

### AP2441_004 — Deal your rate from the User Details page opens the same thing as from the dealer's Users tab — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | On `/admin/dealer/1510/users` click "Deal your rate"; record and leave unsaved | Reference behaviour recorded; row unchanged | A modal opened over `/admin/dealer/1510/users` with an empty heading, one empty field "Deal Your Rate User ID*" and a Save button; loaded from `/admin/rate-user/211` | ✅ | Closed with Escape; nothing changed |
| 2 `[Pre-Condition]` | Open the test user's User Details page | Page opens with a dealer 1510 row | `/admin/dealer-users/110` with the dealer 1510 row | ✅ | — |
| 3 | Click "Deal your rate" in the dealer 1510 row | Does not go to the dealer details page; what opens recorded | `GET /admin/rate-user/211?redirectUrl=…/admin/dealer-users/110` = HTTP 200; the same modal with the empty "Deal Your Rate User ID*" field and Save; URL stayed `/admin/dealer-users/110` | ✅ | — |
| 4 | Leave without saving | Returns without an error; landing recorded | Closed with Escape; browser stays on `/admin/dealer-users/110` | ✅ | Q-003 record: User Details page |
| 5 `[Verification]` | Compare step 3 with step 1 | Same form for the same user and dealer, same values; no error; nothing changed | Same modal, same single empty field, both from link 211; no error page, no HTTP 5xx; nothing saved | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_004-step1-ReferenceDealYourRateFromDealerUsers_pass.png` — the reference Deal Your Rate modal from Dealer Vinh le 2 > Users
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_004-step5-DealYourRateSameFormFromUserDetails_pass.png` — the same modal opened from the User Details page

### AP2441_005 — Edit Permissions from the User Details page changes the role for that dealer, seen on the dealer's Users tab — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record every role badge on the test user's row at dealer 1510 | Original roles recorded | 12 badges, in order: Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management. Window Sticker = on | ✅ | Recorded 17:01:32Z |
| 2 | From the User Details page click "Edit Permissions" in the dealer 1510 row | Does not go to the dealer details page; the form is for this user at dealer 1510 and shows exactly the step-1 roles as granted | `GET /admin/edit-permission/211…` = HTTP 200; modal headed "Link Vinh le 2 to a user" with a "Roles" group of 12 checkboxes, all 12 checked (the step-1 list); URL stayed `/admin/dealer-users/110` | ✅ | The heading names the dealer; the user is identified by link 211. The heading wording "Link … to a user" is odd for an edit form — record only |
| 3 | Switch "Window Sticker" off, change nothing else, Save | Saves without an error; message and landing recorded | Window Sticker unticked, Save clicked; success banner "The permissions are saved for user Vinh le2 Vinh Le2 linked to dealer Vinh le 2"; landed on `/admin/dealer-users/110` | ✅ | Q-003 record: the save returns to the User Details page |
| 4 | Open `/admin/dealer/1510/users`, screenshot the row; then restore exactly the step-1 list via the row's Edit Permissions | Before restore the row differs only by Window Sticker; restore saves without an error | Before restore (17:04:53Z) the row had 11 badges — the step-1 list minus Window Sticker, no other difference. Restore: the row's Edit permissions modal showed 11 ticked and Window Sticker unticked; Window Sticker ticked, Save → banner "The permissions are saved for user Vinh le2 Vinh Le2 linked to dealer Vinh le 2"; page `/admin/dealer/1510/users` | ✅ | The change made from the User Details page reached this user at this dealer |
| 5 `[Verification]` | Read the row again; second restore only if needed | Badges are exactly the step-1 list | After reload (17:05:17Z) the row has 12 badges: Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management, Window Sticker — the same 12 roles as step 1 | ✅ | Restored. Only the display order differs: Window Sticker now shows last (it was 7th); the badges appear in the order the roles were granted. No second attempt needed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_005-step4-WindowStickerRemovedOnDealerUsers_pass.png` — Dealer Vinh le 2 > Users row with 11 badges, Window Sticker gone after the save from the User Details page
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_005-step5-RolesRestoredTwelve_pass.png` — the same row after the restore, 12 badges

### AP2441_006 — Closing Edit Permissions on the User Details page without saving leaves the user's roles unchanged — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the test user's role badges at dealer 1510 | Original roles recorded | 12 badges (after AP2441_005's restore): Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management, Window Sticker | ✅ | Read 17:05:17Z |
| 2 | From the User Details page click "Edit Permissions" in the dealer 1510 row | Form opens for this user at dealer 1510 | Modal "Link Vinh le 2 to a user", 12 role checkboxes all ticked | ✅ | — |
| 3 | Switch Window Sticker, then leave without saving | Closes without saving and without an error; control and landing recorded | Window Sticker unticked; the modal has no Cancel and no × control, so it was closed with the Escape key; browser stayed on `/admin/dealer-users/110`, no banner | ✅ | Q-003 record: User Details page. Back was not used — the modal is not a page in the history |
| 4 `[Verification]` | Open `/admin/dealer/1510/users` and read the row | Badges exactly the step-1 list | 17:05:43Z: the row has the same 12 badges as step 1, Window Sticker included | ✅ | No restore needed. Row re-read after the close recorded here (R2 round 3 minor) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_006-step4-RolesUnchangedAfterClose_pass.png` — Dealer Vinh le 2 > Users row still showing all 12 badges after the unsaved close

### AP2441_007 — Unlink from the User Details page removes the user from that dealer on both pages (then re-linked) — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the row's roles and every user of dealer 1510; then record every dealer of the test user | Roles, the dealer's user list and the user's dealer list recorded | Roles = 12 (Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management, Window Sticker — order as shown at 17:08:35Z, Window Sticker last since AP2441_005's restore). Dealer 1510 users = only "Vinh le2 Vinh Le2". User's dealers = only 1510 "Vinh le 2" | ✅ | R2 round 3 minor: there is no other user on dealer 1510 and no other dealer on this user, so there are no other links whose roles could be affected. Before unlinking, the "Link user" form was opened and closed to confirm the restore was possible (Email* plus 12 permission checkboxes and a Link button) |
| 2 | Click "Unlink" in the dealer 1510 row; record and confirm the confirmation | Not sent to the dealer details page; no error; message and landing recorded | A modal opened headed "Unlink user vinhle8702@gmail.com to Vinh le 2" with a single "Unlink" button (no Cancel, no ×). Clicking "Unlink" at 17:09:07Z showed the banner "The user Vinh le2 Vinh Le2 is unlinked to dealer Vinh le 2" and stayed on `/admin/dealer-users/110` | ✅ | Q-004 record: confirmation wording above. Q-003: lands on the User Details page |
| 3 | Open the User Details page again by search and the dealer 1510 Users tab; screenshot each | User's Dealers table no longer lists 1510; dealer's Users tab no longer lists the user | Searching `vinhle8702@gmail.com` on `/admin/dealer-users` returned "No entities found". `/admin/dealer-users/110` (opened by URL) shows the user's details and "Dealers: No entities found". `/admin/dealer/1510/users` shows "No entities found" | ✅ | Q-005 record: a user with no dealer drops out of the Dealer users list and search, but the User Details page still opens by its URL and shows an empty Dealers table. No other dealers/users existed to check |
| 4 | Restore: "Link user" on dealer 1510, enter the email, grant the step-1 roles, save | User listed again on dealer 1510 | Link user modal "Link Vinh le 2 to a user": Email* = `vinhle8702@gmail.com`, all 12 permissions ticked, "Link" clicked at 17:09:59Z → banner "The user Vinh le2 Vinh Le2 is now linked to dealer Vinh le 2"; the row is back with action links using the new link id 261 | ✅ | Restore succeeded on the first attempt. Record left behind: link 261 replaces link 211 |
| 5 `[Verification]` | Read the dealer 1510 row and then the User Details page | Badges exactly the step-1 list; User Details lists dealer 1510 again | 17:10:08Z: row = Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, Receive invoice notifications, Receive claims notifications, Block warranty retail price, User management (12, same set). `/admin/dealer-users/110` lists 1510 "Vinh le 2", `vinhle8702@gmail.com`, Group A | ✅ | Test data restored. The group "Group A" also came back |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_007-step3-UserNotFoundInSearchAfterUnlink_pass.png` — Dealer users search for the test email returns "No entities found" after the unlink (Q-005 observation)
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_007-step3-UserDetailsNoDealersAfterUnlink_pass.png` — the User Details page with an empty Dealers table
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_007-step3-Dealer1510UsersEmptyAfterUnlink_pass.png` — Dealer Vinh le 2 > Users with no users listed
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_007-step5-RelinkedTwelveRoles_pass.png` — the re-linked row with all 12 badges
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_007-step5-UserDetailsDealer1510Back_pass.png` — the User Details page listing dealer 1510 again

### AP2441_008 — Cancelling Unlink on the User Details page keeps the user linked to the dealer — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record the row's roles; open the User Details page | Roles recorded; User Details lists dealer 1510 | 12 badges as in AP2441_006 step 4; `/admin/dealer-users/110` lists 1510 "Vinh le 2" | ✅ | — |
| 2 | Click "Unlink" in the dealer 1510 row | Record whether a confirmation appears, its title, wording and buttons | A confirmation modal appeared: heading "Unlink user vinhle8702@gmail.com to Vinh le 2", one button "Unlink", no Cancel / No / × control. The row did not disappear | ✅ | Q-004 record. No re-link needed |
| 3 | Cancel the confirmation | Closes without an error; location recorded | With no Cancel, No or × control on the modal, it was dismissed with the Escape key; the modal closed and the browser stayed on `/admin/dealer-users/110` | ✅ | Observation for Q-004: cancelling is only possible by Escape or clicking outside — there is no visible cancel button |
| 4 `[Verification]` | Reload the User Details page, then open `/admin/dealer/1510/users` | User Details still lists 1510; dealer's tab still lists the user with the step-1 badges | 17:08:34Z: User Details lists "1510 Vinh le 2". 17:08:35Z: dealer 1510 row "Vinh le2 Vinh Le2" with the same 12 badges | ✅ | Nothing was unlinked, so the re-link in step 2 was not needed. Row re-read recorded (R2 round 3 minor) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_008-step2-UnlinkConfirmationShown_pass.png` — the Unlink confirmation modal with only an "Unlink" button
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_008-step4-StillLinkedAfterCancel_pass.png` — Dealer Vinh le 2 > Users still listing the user with 12 badges after the cancel

### AP2441_009 — Clicking a dealer row on the User Details page opens that dealer's details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Confirm dealer 1510 lists the user; open the User Details page | User Details lists dealer 1510 | `/admin/dealer-users/110` lists 1510 "Vinh le 2" | ✅ | — |
| 2 | Click the dealer name cell "Vinh le 2" | Leaves the User Details page for a dealer page, no error | Browser navigated to `/admin/dealer/1510` | ✅ | — |
| 3 `[Verification]` | Read heading and URL | Heading names "Vinh le 2"; URL contains `/admin/dealer/1510` | URL = `https://v2dev.garantieavantageplus.ca/admin/dealer/1510`; heading = "Dealer Vinh le 2"; active tab = "Details"; no error text | ✅ | Record-only: exact route `/admin/dealer/1510`, Details tab |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_009-step3-RowOpensDealer1510Details_pass.png` — Dealer Vinh le 2 details page opened from the row click

### AP2441_010 — For a user with several dealers, clicking the last dealer row opens that dealer, not the first — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Find a user with ≥ 2 dealers; record first and last rows | First and last dealers recorded | Nick Tain (`/admin/dealer-users/130`): first = 1363 "Test Dealer 2", last = 1518 "Permaplate test 2" | ✅ | Same user as AP2441_002 |
| 2 | Click the Name cell of the last row | Opens a dealer page, no error | Clicking "Permaplate test 2" navigated to `/admin/dealer/1518` | ✅ | — |
| 3 `[Verification]` | Read heading and URL | Heading names the last dealer; URL contains `/admin/dealer/1518` | URL = `https://v2dev.garantieavantageplus.ca/admin/dealer/1518`; heading = "Dealer Permaplate test 2"; Details tab active | ✅ | Not the first row's dealer 1363 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_010-step3-LastRowOpensDealer1518_pass.png` — Dealer Permaplate test 2 details page opened from the last row

### AP2441_011 — The dealer's Users tab still offers Autoshield, Deal your rate, Edit Permissions and Unlink after the change — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open `/admin/dealer/1510/users` | "Dealer Vinh le 2 > Users" with "Link user" and the test user listed | Heading = "Dealer Vinh le 2 > Users"; "Link user" link (`/admin/dealer/1510/link-user`); tabs Details, Users, Program eligibility, Customer portal, Financing Options, Esthetic protection; table lists "Vinh le2 Vinh Le2" | ✅ | Step-1 test-data check passed for the whole run here |
| 2 | Hover each action button on the row | Every button shows a tooltip; no error | Tooltips: "Auto Shield", "Dealyourate", "Edit permissions", "Edit user", "Unlink" | ✅ | All five have tooltips |
| 3 `[Verification]` | Check the recorded buttons | Row offers Autoshield, Deal your rate, Edit Permissions, Unlink | All four present. Record-only (Q-006): "Edit user" is still on this row, 4th of 5; order = Auto Shield, Dealyourate, Edit permissions, Edit user, Unlink | ✅ | Matches the reporter's 2026-08-24 comment that Edit user stays on Dealer > Users |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_011-step3-DealerUsersTabFourActions_pass.png` — Dealer Vinh le 2 > Users row with its five action buttons

### AP2441_012 — For a user with several dealers, Edit Permissions on the last row opens that dealer's permissions, not the first's — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Find a user with ≥ 2 dealers; record user and first/last dealers | Recorded | Nick Tain, `netain@gmail.com`; first 1363 "Test Dealer 2", last 1518 "Permaplate test 2" | ✅ | Run after AP2441_006 PASSED |
| 2 `[Pre-Condition]` | Record the user's badges at the last and first dealers | Both recorded; whether they differ | 1518 (17:06:44Z) and 1363 (17:06:51Z): both = Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, User management (9). Identical | ✅ | Roles identical, so the dealer named on the form decides step 5 |
| 3 | Click "Edit Permissions" in the last row; screenshot the form | Not sent to dealer details; form opens without error | `/admin/edit-permission/260` opened a modal headed "Link Permaplate test 2 to a user"; ticked = the 9 roles above; unticked = Receive invoice notifications, Receive claims notifications, Block warranty retail price; URL stayed `/admin/dealer-users/130` | ✅ | — |
| 4 | Leave without changing anything; reopen `/admin/dealer/1518/users` | Closes without error; badges at 1518 = step 2 | Closed with Escape (no Cancel or ×); 17:07:30Z the 1518 row still shows the same 9 badges | ✅ | Row re-read after the close recorded (R2 round 3 minor) |
| 5 `[Verification]` | Compare the step-3 form with steps 1–2 | Form belongs to the user at the last row's dealer | The form heading names "Permaplate test 2" — the last row's dealer (1518), not "Test Dealer 2" (1363); the request used link 260, which belongs to the 1518 row; the ticked roles equal the 1518 badges | ✅ | Distinguishable by dealer name, so a PASS can be given |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_012-step3-EditPermissionsLastRowForm_pass.png` — the Edit permissions modal opened from the last row, headed "Link Permaplate test 2 to a user"
- `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_012-step5-LastDealerRolesUnchanged_pass.png` — Dealer Permaplate test 2 > Users, Nick Tain's 9 badges unchanged after the unsaved close

---

## Blocked / Skipped Test Cases

None. Every case ran to its last step.

---

## Environment Observations

- Dev answered every page with HTTP 200; no error page and no HTTP 5xx was seen. Each page load logged one console error from the chat widget iframe, which is unrelated to the feature.
- Every action on these pages (Edit user, Auto Shield, Dealyourate, Edit permissions, Unlink, Link user) opens a **modal dialog** over the current page — the URL does not change. None of these modals has a Cancel or × control; Escape (or clicking outside) is the only way to leave without saving. This is recorded against Q-003/Q-004, not as a defect.
- The Edit permissions modal is headed "Link {dealer name} to a user" — it names the dealer but not the user, and reads like a link form rather than an edit form. Recorded for the s7 comment (no requirement covers the title).
- After a role is removed and re-granted, its badge moves to the end of the row: badges show in the order the roles were granted, not a fixed order.
- A dealer user with no dealer left disappears from `/admin/dealer-users` and its search, but `/admin/dealer-users/{id}` still opens (Q-005 observation).
- The Playwright regression run earlier today (16:02–16:50Z) used the shared dealer account; nothing it left was touched by this run.

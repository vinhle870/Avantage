# Test Cases — AP2441 (File 1 of 3)

**Project:** Avantage Plus v2 — Admin Portal, dealer-user management
**Requirement:** AP2441 — Admin: Manage user permissions from a User Details Page
**Source:** `requirements/AP-2441-admin-manage-user-permissions-from-a.md`; `qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md`; `qa-artifacts/2-test-plan/AP-2441_test-plan.md`
**Date:** 2026-11-01 (reworked the same day for the orchestrator R2 round 1 findings F-1 to F-4); reworked 2026-11-04 for the R2 round 2 findings F-1 to F-5 — execution on Dev
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2441_001 to AP2441_005 (5 test cases)
**Coverage:** Functional · Edge-case · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin Portal | `navigation` §1 |
| **Entry route** | `/admin/login`, then `/admin/dealer-users` — the dealer users list. **Its search box only works when the form is submitted**: type the email and press Enter or the search button; a `?…_search[...]=` parameter in the URL is silently ignored. The **Dealer User Details page** is opened by clicking the user's row in that list; its own route is **not known** (not yet mapped — record it in the execution log and write it back to `domain`). The **Dealer Details > Users** page is `/admin/dealer/1510/users` (URL seen in the ticket's own screenshot of 2026-08-23); if the Users tab link is not visible, open `/admin/dealer/1510/edit` (Dealer Details, `domain` admin-portal.md 2026-10-03) and click the **"Users"** tab, or type `/admin/dealer/1510/users` directly | `navigation`, `domain` (admin-portal.md), `env`, ticket attachment `image-20260823-162728.png` |
| **Viewport** | 1280 × 800 | `navigation` §1, registry `admin_viewport` |
| **Environment** | Dev (v2dev) — the `execution_env` in tools.md; base URL in the `env` source, Dev Environment section | `qa-config/tools.md` (`execution_env`), `env` |
| **Login** | The Admin Portal login in the `env` source (Portals table, "Admin Portal" row). Never copy it into the log | `env` |
| **Test data** | **Test user:** `vinhle8702@gmail.com`, displayed "Vinh le2 Vinh Le2". **Test dealer:** **1510**, "Vinh le 2". Both come from this ticket's own QA screenshot and were seen **only on Staging** (dealer-user row 110 in `/admin/dealer-users`, 2026-08-29); **they are unverified on Dev**, and no other ticket uses them. **Do not use dealer 1380** — it is the shared dealership other tickets test on. Neither the user nor its link to dealer 1510 is in the `test-data`, `navigation` or `domain` source for any environment, so on Dev step 1 of AP2441_001 and AP2441_003–005 is expected to decide it. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing on Dev: vinhle8702@gmail.com not linked to dealer 1510". Never link the user to the dealer to create missing data — linking is allowed only to restore a link the case removed itself (AP2441_007 step 4, AP2441_008 step 2); never create dealer 1510 data; never switch to dealer 1380.** After execution, s4 records what it found on Dev in the `test-data` source as a dated `Dev` entry | ticket capture (Staging), test plan §8, `qa-config/tools.md` |
| **Language** | The admin login page is in French ("Courriel", "Mot de passe", "Se connecter") whatever the setting; the admin pages in the ticket's screenshots are in English. Run in English | `navigation` §1, ticket attachments |
| **Leaves behind** | Nothing when every restore step succeeds. AP2441_001 and AP2441_002 open the user's edit form and any edit-like row control and close them without saving; AP2441_003/004 undo any Autoshield or Deal your rate change they cause; **AP2441_005 switches the "Window Sticker" role of the test user on dealer 1510 and in step 4 restores the row's roles to exactly the step-1 list** (step 5 checks the restore and makes one more attempt if needed). `cleanup` is `missing` on this project, so each case restores its own changes | test plan §8.1, `cleanup` (missing) |

**How to identify the row action buttons.** They are icon buttons without visible text
(ticket attachment `image-20260817-141357.png`): on the Dealer Details > Users page each row
shows, left to right, a plug icon, a dollar-in-a-box icon, a red person-with-lock icon, a
pencil icon (tooltip **"Edit user"**) and a crossed-link icon. The ticket names the actions
"Autoshield", "Deal your rate", "Edit Permissions", "Edit user" and "Unlink" but does not map
them to icons. **Hover each button and use its tooltip text.** If a button has no tooltip,
match it to the Dealer Details > Users button with the same icon and position, and record
that the match was made by icon.

**Known blockers:** None filed. **Test data unverified on Dev:** the dealer 1510 /
`vinhle8702@gmail.com` pair was seen only on Staging; on Dev the step-1 check of AP2441_001 and AP2441_003–005
decides it, and if the pair is missing those cases are BLOCKED "test data missing on Dev:
vinhle8702@gmail.com not linked to dealer 1510" — never FAIL, never a re-link, never dealer 1380.
AP2441_002 needs a dealer user linked to two or more dealers, which no knowledge source
names; its first step finds one on Dev by a read-only search, and the case is BLOCKED at run
time only if none exists.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2441_001 | Test user's User Details page shows Autoshield, Deal your rate, Edit Permissions and Unlink on its dealer row, with no Edit user | Functional | High | PASS |
| AP2441_002 | A user linked to several dealers sees the same four actions on every dealer row | Edge-case | Medium | PASS |
| AP2441_003 | Autoshield from the User Details page opens the same thing as from the dealer's Users tab | Functional | High | PASS |
| AP2441_004 | Deal your rate from the User Details page opens the same thing as from the dealer's Users tab | Functional | High | PASS |
| AP2441_005 | Edit Permissions from the User Details page changes the role for that dealer, seen on the dealer's Users tab | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2441_001 — Test user's User Details page shows Autoshield, Deal your rate, Edit Permissions and Unlink on its dealer row, with no Edit user

| Field | Value |
|---|---|
| **TC ID** | AP2441_001 |
| **Title** | Test user's User Details page shows Autoshield, Deal your rate, Edit Permissions and Unlink on its dealer row, with no Edit user |
| **Requirement** | AP2441 — REQ-001 AC 1–2 ("the same actions as the Dealer Details > Users management page": Autoshield, Deal your rate, Edit Permissions, Unlink); REQ-002 AC 1 ("REMOVE EDIT USER BUTTON") and AC 2 ("the edit action is not to edit the user" — no row button opens the user's edit form) |
| **Route** | Dealer User Details page of `vinhle8702@gmail.com` (opened from `/admin/dealer-users`); reference `/admin/dealer/1510/users` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (v2dev) — execution-log_AP-2441_2026-11-04.md |
| **Result** | PASS |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-04 | Step 1: BLOCKED reason now "test data missing on Dev: ..."; no-link rule reworded to "never link the user to the dealer to create missing data, never create dealer 1510 data, never switch to dealer 1380" | R2 round 2 F-1 (execution moved to Dev; the test-data pair is unverified there) and F-4 (wording) | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |

**Why this matters:** This is the core of the story. Without these four buttons the
administrator still has to leave the user's page and open each dealership. The Edit user
button is the one deliberate difference from the Dealer Details > Users page; the QA comment
of 2026-08-23 shows it was already confused with the button on the other page once, so this
case judges only the dealer rows of the **User Details** page.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing on Dev: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer to create missing data, never create dealer 1510 data and never switch to dealer 1380.** Hover each action button on the "Vinh le2 Vinh Le2" row and write down every tooltip, left to right. Then click the row's **"Edit user"** (pencil) button, record the URL, heading and fields of the form that opens — the **reference edit form of the user** — and leave **without saving** ("Cancel", close (×) or Back) | The page "Dealer Vinh le 2 > Users" lists "Vinh le2 Vinh Le2"; the row's action tooltips are recorded (the ticket's screenshot shows five buttons, the fourth with tooltip "Edit user"); the user's edit form URL, heading and fields are recorded and nothing is saved. If the row has no "Edit user" button (Q-006), record that and take the reference from step 2 |
| 2 | [Pre-Condition] Open `/admin/dealer-users`, type `vinhle8702@gmail.com` in the search box and submit it, then click the "Vinh le2 Vinh Le2" row. If the page header has an **"Edit user"** button, click it, record the URL, heading and fields of the form, and leave without saving | The Dealer User Details page for Vinh le2 Vinh Le2 opens, showing the user's email and a "Dealers" table that includes a row for dealer 1510 "Vinh le 2"; record the page URL and whether the header "Edit user" button exists (Q-001). A header form recorded here is a second reference edit form of the user |
| 3 | Return to the User Details page. Hover each button in the dealer 1510 row of the "Dealers" table and write down every tooltip, left to right. Then click **each row button whose tooltip or icon suggests editing** (a pencil icon, or a tooltip starting "Edit"), **except "Edit Permissions"** — never Autoshield, Deal your rate or Unlink here — record the URL, heading and fields of what opens, and leave it **without saving** ("Cancel", close (×) or Back) | Each button shows a tooltip (or, if not, is matched by icon to a step-1 button); every edit-like button's result is recorded and nothing is saved; no error page appears. If the row has no edit-like button other than Edit Permissions, record "none" |
| 4 | [Verification] Compare the step-3 buttons and results with the step-1 and step-2 records, and look for an "Edit user" button in every dealer row | The dealer 1510 row carries the **Autoshield**, **Deal your rate**, **Edit Permissions** and **Unlink** buttons — the step-1 buttons with the same tooltips and icons — and **no button with the tooltip "Edit user" (pencil icon)**, and **no row button opens the edit form of the user Vinh le2 Vinh Le2** (a form with the URL, or the heading and fields, of a reference edit form from step 1 or step 2; if no reference could be recorded, a form headed with this user's name that edits the user's own details). The case FAILS if any row button opens that form. Record-only, not judged: the order of the buttons; whether the page header still has an "Edit user" button (Q-001); and what any other edit-like row button edits instead (Q-002) |

---

### AP2441_002 — A user linked to several dealers sees the same four actions on every dealer row

| Field | Value |
|---|---|
| **TC ID** | AP2441_002 |
| **Title** | A user linked to several dealers sees the same four actions on every dealer row |
| **Requirement** | AP2441 — REQ-001 AC 2 ("the same actions can be done for a User > Dealer standpoint" — for each dealer of the user); REQ-002 AC 1–2 (no Edit user button, and no row button opens the user's edit form) |
| **Route** | Dealer User Details page of a user with ≥ 2 dealers (opened from `/admin/dealer-users`) |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (v2dev) — execution-log_AP-2441_2026-11-04.md |
| **Result** | PASS |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-04 | Step 1 and Test Data: skip any user linked to dealer 1380 or named for another ticket in `test-data`; the user is searched on Dev | R2 round 2 F-3 | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |
| 2026-11-04 | Steps 2 and 4: leave forms by Cancel or close (×), Back only as a fallback; then reload and record that nothing changed | R2 round 2 F-5 | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |

**Why this matters:** A page built and checked against a one-dealer user can still draw the
buttons only on the first row, or wire every row's buttons to the first dealer. This case
uses equivalence partitioning (testing one representative of each group that should behave
the same way) — users with one dealer versus users with several — and changes nothing: only
edit-like buttons are opened, and every form is closed without saving, so no other user's
access can change. Autoshield, Deal your rate, Edit Permissions and Unlink are never clicked.

**Test Data:**

| Variable | Value |
|---|---|
| Multi-dealer user | Any existing dealer user on Dev whose Dealers table has two or more rows — not one linked to dealer 1380 and not one named for another ticket in `test-data`; found in step 1, recorded in the log (name and email) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source, open `/admin/dealer-users` and open users from the list one by one (at most the first 3 pages) until one's User Details page shows **two or more** rows in its "Dealers" table. **Skip any user whose Dealers table includes dealer 1380 or who is named for another ticket in the `test-data` source.** Do not click any row button. If none is found, stop and record the case as BLOCKED — "no dealer user with two or more dealers found"; never link a user to another dealer to create one | A User Details page with at least two dealer rows is open; record the user's name, email, the number of dealer rows and the page URL |
| 2 | [Pre-Condition] Open `/admin/dealer/{first Dealer ID}/users`, click the **"Edit user"** (pencil) button on the step-1 user's row, record the URL, heading and fields of the form — the **reference edit form of the user** — and leave **without saving**: click "Cancel" or the close (×) control, and use Back only if the form has neither. If that row has no "Edit user" button (Q-006), use the User Details page-header "Edit user" button instead, if it exists. Then reload `/admin/dealer/{first Dealer ID}/users` and read the user's row again | A reference edit form of the step-1 user is recorded and nothing is saved — after the reload the user's row (name and role badges) is as before the form was opened; record that nothing changed. If neither button exists, record "no reference" |
| 3 | Return to the user's User Details page. Hover each button in the **first** and in the **last** dealer row and write down every tooltip | Tooltips recorded for both rows; no error page |
| 4 | In the first and the last dealer rows, click **each button whose tooltip or icon suggests editing** (a pencil icon, or a tooltip starting "Edit"), **except "Edit Permissions"**, record the URL, heading and fields of what opens, and leave it **without saving** — click "Cancel" or the close (×) control, and use Back only if there is neither. Then reload the User Details page | Every edit-like button's result is recorded and nothing is saved — after the reload the user's "Dealers" table shows the same rows as in step 1; record that nothing changed. No error page. If a row has no edit-like button other than Edit Permissions, record "none" |
| 5 | [Verification] Check every dealer row of the table, comparing with the step-3 tooltips and the step-2 and step-4 records | Every dealer row carries the **Autoshield**, **Deal your rate**, **Edit Permissions** and **Unlink** buttons and **no "Edit user" button**; the first and last rows show the same set; and **no row button opens the edit form of the step-1 user** (the step-2 reference form by URL, or by heading and fields; with "no reference", a form headed with this user's name that edits the user's own details). The case FAILS if any row button opens that form. Record-only: the row count and what any other edit-like button edits instead (Q-002) |

---

### AP2441_003 — Autoshield from the User Details page opens the same thing as from the dealer's Users tab

| Field | Value |
|---|---|
| **TC ID** | AP2441_003 |
| **Title** | Autoshield from the User Details page opens the same thing as from the dealer's Users tab |
| **Requirement** | AP2441 — REQ-003 AC 1 ("the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint" — Autoshield) |
| **Route** | Reference `/admin/dealer/1510/users`; then the Dealer User Details page of `vinhle8702@gmail.com` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (v2dev) — execution-log_AP-2441_2026-11-04.md |
| **Result** | PASS |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-04 | Step 1: BLOCKED reason now "test data missing on Dev: ..."; no-link rule reworded to "never link the user to the dealer to create missing data, never create dealer 1510 data, never switch to dealer 1380" | R2 round 2 F-1 (execution moved to Dev; the test-data pair is unverified there) and F-4 (wording) | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |

**Why this matters:** The ticket never says what Autoshield does (Q-007, Info); it only
requires the same result from both pages. If the User Details button opened Autoshield for
the wrong dealer or the wrong user, an administrator would change another dealership's
Autoshield setting without noticing.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing on Dev: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer to create missing data, never create dealer 1510 data and never switch to dealer 1380.** Then click the **"Autoshield"** button on the "Vinh le2 Vinh Le2" row. Record what happens — the URL, the page or dialog title, which user and dealer it names, and the values it shows. Then leave **without saving** (close the dialog, click "Cancel" or "Back"); if the click itself changed a setting (a toggle or a flash message), click the same button again to put it back and record that | The reference behaviour of Autoshield for this user and dealer is recorded; the user's row is as it was before |
| 2 | [Pre-Condition] Open `/admin/dealer-users`, type `vinhle8702@gmail.com` in the search box and submit it, then click the "Vinh le2 Vinh Le2" row | The Dealer User Details page opens with a "Dealers" row for dealer 1510 "Vinh le 2" |
| 3 | Click the **"Autoshield"** button in the dealer 1510 row | The browser does **not** go to the dealer details page instead; what opens is recorded the same way as in step 1 |
| 4 | Leave without saving as in step 1; if the click changed a setting, click the same button again to put it back | The page returns without an error; record where the browser lands (Q-003) |
| 5 | [Verification] Compare the step-3 result with the step-1 result | Autoshield opened the **same** page, dialog or setting as from Dealer Details > Users — for user **Vinh le2 Vinh Le2** and dealer **1510 "Vinh le 2"**, showing the same values — with no error page or HTTP 5xx, and the test user's Autoshield state is back to what step 1 recorded. Record-only: the landing page after leaving (Q-003) |

---

### AP2441_004 — Deal your rate from the User Details page opens the same thing as from the dealer's Users tab

| Field | Value |
|---|---|
| **TC ID** | AP2441_004 |
| **Title** | Deal your rate from the User Details page opens the same thing as from the dealer's Users tab |
| **Requirement** | AP2441 — REQ-003 AC 2 ("the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint" — Deal your rate) |
| **Route** | Reference `/admin/dealer/1510/users`; then the Dealer User Details page of `vinhle8702@gmail.com` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (v2dev) — execution-log_AP-2441_2026-11-04.md |
| **Result** | PASS |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-04 | Step 1: BLOCKED reason now "test data missing on Dev: ..."; no-link rule reworded to "never link the user to the dealer to create missing data, never create dealer 1510 data, never switch to dealer 1380" | R2 round 2 F-1 (execution moved to Dev; the test-data pair is unverified there) and F-4 (wording) | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |

**Why this matters:** As with Autoshield, the ticket does not describe Deal your rate
(Q-007, Info) — the admin area has a dealer page `/admin/dealer/{id}/rate-client`, but
nothing ties it to this button, so the case judges only parity with the Dealer Details >
Users page for the same user and dealer.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing on Dev: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer to create missing data, never create dealer 1510 data and never switch to dealer 1380.** Then click the **"Deal your rate"** button on the "Vinh le2 Vinh Le2" row. Record the URL, the page or dialog title, which user and dealer it names, and the values it shows. Then leave **without saving** (close, "Cancel" or "Back"); if the click itself changed a setting, click the same button again to put it back and record that | The reference behaviour of Deal your rate for this user and dealer is recorded; the user's row is as it was before |
| 2 | [Pre-Condition] Open `/admin/dealer-users`, type `vinhle8702@gmail.com` in the search box and submit it, then click the "Vinh le2 Vinh Le2" row | The Dealer User Details page opens with a "Dealers" row for dealer 1510 "Vinh le 2" |
| 3 | Click the **"Deal your rate"** button in the dealer 1510 row | The browser does **not** go to the dealer details page instead; what opens is recorded the same way as in step 1 |
| 4 | Leave without saving as in step 1; if the click changed a setting, click the same button again to put it back | The page returns without an error; record where the browser lands (Q-003) |
| 5 | [Verification] Compare the step-3 result with the step-1 result | Deal your rate opened the **same** page, dialog or setting as from Dealer Details > Users — for user **Vinh le2 Vinh Le2** and dealer **1510 "Vinh le 2"**, showing the same values — with no error page or HTTP 5xx, and nothing is left changed. Record-only: the landing page after leaving (Q-003) |

---

### AP2441_005 — Edit Permissions from the User Details page changes the role for that dealer, seen on the dealer's Users tab

| Field | Value |
|---|---|
| **TC ID** | AP2441_005 |
| **Title** | Edit Permissions from the User Details page changes the role for that dealer, seen on the dealer's Users tab |
| **Requirement** | AP2441 — REQ-003 AC 3 ("the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint" — Edit Permissions) |
| **Route** | Dealer User Details page of `vinhle8702@gmail.com`; reference `/admin/dealer/1510/users` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-04, Dev (v2dev) — execution-log_AP-2441_2026-11-04.md |
| **Result** | PASS |

**Revisions:**

| Date | Change | Reason | Confirmed by |
|---|---|---|---|
| 2026-11-04 | Step 1: BLOCKED reason now "test data missing on Dev: ..."; no-link rule reworded to "never link the user to the dealer to create missing data, never create dealer 1510 data, never switch to dealer 1380" | R2 round 2 F-1 (execution moved to Dev; the test-data pair is unverified there) and F-4 (wording) | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |
| 2026-11-04 | Step 4: restore sets the row's roles to exactly the step-1 list with "Edit Permissions" (not only Window Sticker). Step 5: one more restore attempt before recording the difference and suspending the run | R2 round 2 F-2 — a save that changed another role must still be fully restored in-case | Orchestrator qa-reviewer, R2 round 2 (2026-11-04T16:04:26Z) |

**Why this matters:** Edit Permissions changes what a dealer user may do in the Dealer
Portal. If the button on the user's page saved the change against the wrong dealer, or
against another user, someone would silently gain or lose access to quotes, payments or
claims. This case changes one low-risk role, **"Window Sticker"**, and puts it back before
it ends — the test user's roles are shared Configuration data (test plan §8.1).

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |
| Role toggled | "Window Sticker" — switched off if it is on in step 1, switched on if it is off |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing on Dev: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer to create missing data, never create dealer 1510 data and never switch to dealer 1380.** Then write down, in order, every green role badge on the "Vinh le2 Vinh Le2" row (the original roles), and whether "Window Sticker" is among them | The original roles are recorded (the ticket's 2026-08-23 screenshot showed 12, including "Window Sticker") |
| 2 | Open `/admin/dealer-users`, type `vinhle8702@gmail.com` in the search box and submit it, click the "Vinh le2 Vinh Le2" row, then click the **"Edit Permissions"** button in the dealer 1510 row | The browser does not go to the dealer details page instead. The permissions form opens for **Vinh le2 Vinh Le2** at dealer **1510 "Vinh le 2"**, and the roles it shows as granted are exactly the step-1 badges |
| 3 | Switch **"Window Sticker"** to the opposite of its step-1 state, change nothing else, and click the form's save button ("Save" or its equivalent) | The form saves without an error page or HTTP 5xx; record any message and where the browser lands (Q-003) |
| 4 | Open `/admin/dealer/1510/users` and **take a screenshot of the "Vinh le2 Vinh Le2" row**. Then restore: click the row's **"Edit Permissions"** button, set the roles to **exactly the step-1 list** — every step-1 role on and every other role off, not only "Window Sticker" — and save | Before the restore, the row's badges differ from step 1 **only** in "Window Sticker" — the change made from the User Details page reached this user at this dealer (record any other difference). The restore saves without an error page or HTTP 5xx |
| 5 | [Verification] Read the "Vinh le2 Vinh Le2" row on `/admin/dealer/1510/users` again. If the badges are not exactly the step-1 list, make **one more restore attempt** — the row's "Edit Permissions" button, roles set to exactly the step-1 list, save — and read the row again | The role badges are exactly the step-1 list — the test user's roles are restored. Only if they still differ after the second restore attempt: take a screenshot, record the difference and suspend the run (test plan §6) |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC 1–2 — four actions on each dealer row | AP2441_001 | — | AP2441_002 | AP2441_011 |
| REQ-002 AC 1 — no Edit user button in the rows | AP2441_001 | — | AP2441_002 | — |
| REQ-002 AC 2 — no row button opens the user's edit form | AP2441_001 | — | AP2441_002 | — |
| REQ-003 AC 1 — Autoshield parity | AP2441_003 | — | — | — |
| REQ-003 AC 2 — Deal your rate parity | AP2441_004 | — | — | — |
| REQ-003 AC 3 — Edit Permissions parity | AP2441_005 | AP2441_006 | AP2441_012 | — |
| REQ-003 AC 4 — Unlink parity | AP2441_007 | AP2441_008 | — | — |
| REQ-004 AC 1 — row click opens the dealer details page | AP2441_009 | — | AP2441_010 | — |

_AP2441_011 is not counted as REQ-002 coverage: its only REQ-002 point — the "Edit user" button on the Dealer Details > Users row — is record-only (Q-006) and outside REQ-002's scope per the analysis. It counts as REQ-001 regression coverage only._

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2441_001 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_001-step4-UserDetailsFourActionsNoEditUser_pass.png` |
| AP2441_002 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_002-step5-TwoDealerRowsSameFourActions_pass.png` |
| AP2441_003 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_003-step5-AutoShieldSameFormFromUserDetails_pass.png` |
| AP2441_004 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_004-step5-DealYourRateSameFormFromUserDetails_pass.png` |
| AP2441_005 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2441/AP2441_005-step5-RolesRestoredTwelve_pass.png` |

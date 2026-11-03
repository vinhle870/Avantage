# Test Cases — AP2441 (File 2 of 3)

**Project:** Avantage Plus v2 — Admin Portal, dealer-user management
**Requirement:** AP2441 — Admin: Manage user permissions from a User Details Page
**Source:** `requirements/AP-2441-admin-manage-user-permissions-from-a.md`; `qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md`; `qa-artifacts/2-test-plan/AP-2441_test-plan.md`
**Date:** 2026-11-01 (reworked the same day for the orchestrator R2 review findings F-2 and F-4)
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2441_006 to AP2441_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin Portal | `navigation` §1 |
| **Entry route** | `/admin/login`, then `/admin/dealer-users` — the dealer users list. **Its search box only works when the form is submitted**: type the email and press Enter or the search button; a `?…_search[...]=` parameter in the URL is silently ignored. The **Dealer User Details page** is opened by clicking the user's row in that list; its own route is **not known** (not yet mapped — record it and write it back to `domain`). The **Dealer Details > Users** page is `/admin/dealer/1510/users` (URL in the ticket's screenshot of 2026-08-23); if the Users tab link is not visible, open `/admin/dealer/1510/edit` (Dealer Details, `domain` admin-portal.md 2026-10-03) and click the **"Users"** tab, or type `/admin/dealer/1510/users` directly. The **"Link user"** button is at the top right of the Dealer Details > Users page (ticket attachment `image-20260817-141357.png`); its form has not been mapped | `navigation`, `domain` (admin-portal.md), `env`, ticket attachments |
| **Viewport** | 1280 × 800 | `navigation` §1, registry `admin_viewport` |
| **Environment** | Staging (v2staging) — base URL in the `env` source | `env` |
| **Login** | The Admin Portal login in the `env` source (Portals table, "Admin Portal" row). Never copy it into the log | `env` |
| **Test data** | **Test user:** `vinhle8702@gmail.com`, displayed "Vinh le2 Vinh Le2" (dealer-user row 110 in `/admin/dealer-users`, seen 2026-08-29). **Test dealer:** **1510**, "Vinh le 2". Both come from this ticket's own QA screenshot; no other ticket uses them. **Do not use dealer 1380** — it is the shared dealership other tickets test on. Neither the user nor its link to dealer 1510 is in the `test-data`, `navigation` or `domain` source, so step 1 of AP2441_006–009 checks them first. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** After execution, s4 records the pair in the `test-data` source | ticket capture, test plan §8 |
| **Language** | The admin login page is in French ("Courriel", "Mot de passe", "Se connecter"); the admin pages in the ticket's screenshots are in English. Run in English | `navigation` §1, ticket attachments |
| **Leaves behind** | Nothing when every restore step succeeds. AP2441_006 changes nothing; AP2441_007 removes and re-creates the test user's link to dealer 1510 with the same roles; AP2441_008 re-links only if Unlink acts without a confirmation. AP2441_009/010 are read-only. `cleanup` is `missing` on this project, so each case restores its own changes | test plan §8.1, `cleanup` (missing) |

**Execution order for the data-changing cases.** Run every read-only case and AP2441_005/006
first, then **AP2441_008**, and **AP2441_007 last** of the whole set — if its restore fails,
nothing else depends on the test user afterwards. If any restore fails, suspend the run
(test plan §6).

**How to identify the row action buttons.** They are icon buttons without visible text: on
the Dealer Details > Users page each row shows, left to right, a plug icon, a dollar-in-a-box
icon, a red person-with-lock icon, a pencil icon (tooltip **"Edit user"**) and a
crossed-link icon. Hover each button and use its tooltip; if a button has no tooltip, match it
to the Dealer Details > Users button with the same icon, and record that the match was made by
icon.

**Known blockers:** None at design time. AP2441_010 needs a dealer user linked to two or
more dealers; its first step finds one by a read-only search, and the case is BLOCKED at run
time only if none exists.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2441_006 | Closing Edit Permissions on the User Details page without saving leaves the user's roles unchanged | Negative | Medium | Not Run |
| AP2441_007 | Unlink from the User Details page removes the user from that dealer on both pages (then re-linked) | Functional | High | Not Run |
| AP2441_008 | Cancelling Unlink on the User Details page keeps the user linked to the dealer | Negative | Medium | Not Run |
| AP2441_009 | Clicking a dealer row on the User Details page opens that dealer's details page | Functional | Medium | Not Run |
| AP2441_010 | For a user with several dealers, clicking the last dealer row opens that dealer, not the first | Edge-case | Low | Not Run |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2441_006 — Closing Edit Permissions on the User Details page without saving leaves the user's roles unchanged

| Field | Value |
|---|---|
| **TC ID** | AP2441_006 |
| **Title** | Closing Edit Permissions on the User Details page without saving leaves the user's roles unchanged |
| **Requirement** | AP2441 — REQ-003 AC 3 (Edit Permissions — negative path: no save, no change) |
| **Route** | Dealer User Details page of `vinhle8702@gmail.com`; reference `/admin/dealer/1510/users` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** An administrator who opens the permissions form by mistake and backs
out must not change the user's access. A form that saves on close, or a half-applied change,
would grant or remove access nobody chose.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |
| Role toggled (not saved) | "Window Sticker" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** Then write down, in order, every role badge on the "Vinh le2 Vinh Le2" row | The original roles are recorded |
| 2 | Open `/admin/dealer-users`, type `vinhle8702@gmail.com` in the search box and submit it, click the "Vinh le2 Vinh Le2" row, then click the **"Edit Permissions"** button in the dealer 1510 row | The permissions form opens for Vinh le2 Vinh Le2 at dealer 1510 "Vinh le 2" |
| 3 | Switch **"Window Sticker"** to the opposite state, then leave **without saving**: click "Cancel" or the close (×) control if the form has one, otherwise the browser's Back button | The form closes without saving and without an error page; record which control was used and where the browser lands (Q-003) |
| 4 | [Verification] Open `/admin/dealer/1510/users` and read the "Vinh le2 Vinh Le2" row | The role badges are exactly the step-1 list — "Window Sticker" is unchanged. If they differ, record the difference and restore the step-1 roles with the row's "Edit Permissions" button before continuing |

---

### AP2441_007 — Unlink from the User Details page removes the user from that dealer on both pages (then re-linked)

| Field | Value |
|---|---|
| **TC ID** | AP2441_007 |
| **Title** | Unlink from the User Details page removes the user from that dealer on both pages (then re-linked) |
| **Requirement** | AP2441 — REQ-003 AC 4 ("the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint" — Unlink) |
| **Route** | Dealer User Details page of `vinhle8702@gmail.com`; reference and restore `/admin/dealer/1510/users` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** Unlink takes a user's access to a dealership away. If the button on
the user's page removed the user from a different dealer — or removed a different user from
this dealer — someone would lose access to their dealership's quotes and contracts without
warning. **Run this case last** (see Execution order above): it removes and re-creates the
test user's only known link, the link the other cases rely on.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |
| Roles to restore | The badges recorded in step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** On that page write down the "Vinh le2 Vinh Le2" row's role badges and the names of all users listed. Then open `/admin/dealer-users`, search `vinhle8702@gmail.com` (submit the form), open the "Vinh le2 Vinh Le2" row and write down every dealer in its "Dealers" table | The original roles, the dealer's user list and the user's dealer list are recorded |
| 2 | Click the **"Unlink"** button in the dealer 1510 row. If a confirmation appears, record its title and full wording (Q-004), then confirm it | The browser does not go to the dealer details page instead; no error page or HTTP 5xx; record any message and where the browser lands (Q-003) |
| 3 | Open the test user's User Details page again (search `vinhle8702@gmail.com` on `/admin/dealer-users`) and then `/admin/dealer/1510/users`; **take a screenshot of each** | The user's "Dealers" table no longer lists dealer 1510, and every other dealer from step 1 is still listed. The dealer 1510 Users tab no longer lists "Vinh le2 Vinh Le2", and every other user from step 1 is still listed. Record-only: what the User Details page shows if no dealer is left, or whether the user is still found in `/admin/dealer-users` (Q-005) |
| 4 | Restore: on `/admin/dealer/1510/users` click **"Link user"**, choose or enter `vinhle8702@gmail.com`, grant the step-1 roles (in the Link user form if it offers roles; otherwise afterwards with the row's "Edit Permissions" button), and save | "Vinh le2 Vinh Le2" is listed again on the dealer 1510 Users tab. If the user cannot be found or linked, stop, record why, and suspend the run (test plan §6) |
| 5 | [Verification] Read the "Vinh le2 Vinh Le2" row on `/admin/dealer/1510/users`, then the user's User Details page | The row's role badges are exactly the step-1 list, and the User Details page lists dealer 1510 "Vinh le 2" again — the test data is restored |

---

### AP2441_008 — Cancelling Unlink on the User Details page keeps the user linked to the dealer

| Field | Value |
|---|---|
| **TC ID** | AP2441_008 |
| **Title** | Cancelling Unlink on the User Details page keeps the user linked to the dealer |
| **Requirement** | AP2441 — REQ-003 AC 4 (Unlink — negative path: cancelled, no change) |
| **Route** | Dealer User Details page of `vinhle8702@gmail.com`; reference `/admin/dealer/1510/users` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The Unlink button sits in a row of small, unlabelled icons next to
Edit Permissions. If a mis-click cannot be backed out of, an administrator will remove a
user's access by accident. Whether a confirmation must exist is not stated (Q-004), so its
existence and wording are recorded, and only the outcome of cancelling it is judged.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |
| Roles to restore (only if no confirmation appears) | The badges recorded in step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** Then write down the "Vinh le2 Vinh Le2" row's role badges; then open `/admin/dealer-users`, search `vinhle8702@gmail.com` (submit the form) and open the "Vinh le2 Vinh Le2" row | The original roles are recorded; the User Details page lists dealer 1510 "Vinh le 2" |
| 2 | Click the **"Unlink"** button in the dealer 1510 row | Record whether a confirmation appears, with its title, wording and buttons (Q-004). **If no confirmation appears and the row disappears at once**, record it, restore the link — on `/admin/dealer/1510/users` click "Link user", link `vinhle8702@gmail.com` and grant the step-1 roles — and end the case as SKIPPED, reason "Unlink has no confirmation to cancel" |
| 3 | Cancel the confirmation — click "No", "Cancel" or the close (×) control | The confirmation closes without an error page; record where the browser is |
| 4 | [Verification] Reload the User Details page, then open `/admin/dealer/1510/users` | The User Details page still lists dealer 1510 "Vinh le 2", and the dealer 1510 Users tab still lists "Vinh le2 Vinh Le2" with exactly the step-1 role badges |

---

### AP2441_009 — Clicking a dealer row on the User Details page opens that dealer's details page

| Field | Value |
|---|---|
| **TC ID** | AP2441_009 |
| **Title** | Clicking a dealer row on the User Details page opens that dealer's details page |
| **Requirement** | AP2441 — REQ-004 AC 1 ("When the user clicks on the table row, the user is redirected to the dealer details page") |
| **Route** | Dealer User Details page of `vinhle8702@gmail.com` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The row click is the administrator's shortcut from a user to one of
their dealerships. A row that opens nothing, or the wrong dealer, sends them to change the
wrong dealership's settings. The ticket does not name the exact route or tab of "the dealer
details page", so the case judges that the page belongs to the clicked dealer and records
the rest.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Dealer row clicked | 1510 — "Vinh le 2" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** Then open `/admin/dealer-users`, search `vinhle8702@gmail.com` (submit the form) and open the "Vinh le2 Vinh Le2" row | The User Details page lists dealer 1510 "Vinh le 2" in its "Dealers" table |
| 2 | Click the **dealer name cell "Vinh le 2"** of the dealer 1510 row — not one of the action buttons | The browser leaves the User Details page and opens a dealer page, without an error page or HTTP 5xx |
| 3 | [Verification] Read the page heading and URL | The page belongs to dealer 1510: its heading names the dealer "Vinh le 2" and the URL contains `/admin/dealer/1510`. Record-only: the exact URL and which tab is active (Details, Users or another), since the ticket does not name the route |

---

### AP2441_010 — For a user with several dealers, clicking the last dealer row opens that dealer, not the first

| Field | Value |
|---|---|
| **TC ID** | AP2441_010 |
| **Title** | For a user with several dealers, clicking the last dealer row opens that dealer, not the first |
| **Requirement** | AP2441 — REQ-004 AC 1 ("When the user clicks on the table row, the user is redirected to the dealer details page" — of that row's dealer) |
| **Route** | Dealer User Details page of a user with ≥ 2 dealers (opened from `/admin/dealer-users`) |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** With only one dealer row, a link hard-wired to the first dealer would
still look correct. Clicking the last of several rows catches that. The case is
**read-only** — nothing is changed on the user or the dealer.

**Test Data:**

| Variable | Value |
|---|---|
| Multi-dealer user | Any existing dealer user whose Dealers table has two or more rows — found in step 1 (the one used for AP2441_002 may be reused), recorded in the log |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source, open `/admin/dealer-users` and open users one by one (at most the first 3 pages) until one's User Details page shows **two or more** dealer rows; write down the Dealer ID and Name of the first and the last row. If none is found, record the case as BLOCKED — "no dealer user with two or more dealers found" | A User Details page with at least two dealer rows is open; the first and last dealers are recorded |
| 2 | Click the **Name cell** of the **last** dealer row — not one of the action buttons | The browser opens a dealer page without an error page or HTTP 5xx |
| 3 | [Verification] Read the page heading and URL | The heading names the **last** row's dealer and the URL contains `/admin/dealer/{its Dealer ID}` — not the first row's dealer. Record the URL |

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
| AP2441_006 | _(pending)_ | — |
| AP2441_007 | _(pending)_ | — |
| AP2441_008 | _(pending)_ | — |
| AP2441_009 | _(pending)_ | — |
| AP2441_010 | _(pending)_ | — |

# Test Cases — AP2441 (File 3 of 3)

**Project:** Avantage Plus v2 — Admin Portal, dealer-user management
**Requirement:** AP2441 — Admin: Manage user permissions from a User Details Page
**Source:** `requirements/AP-2441-admin-manage-user-permissions-from-a.md`; `qa-artifacts/1-requirements-analysis/AP-2441_requirements-analysis.md`; `qa-artifacts/2-test-plan/AP-2441_test-plan.md`
**Date:** 2026-11-01 (AP2441_012 added the same day — promoted from review proposal P1 by Gate B rule B2); reworked the same day for the orchestrator R2 review findings F-2 and F-4
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2441_011 to AP2441_012 (2 test cases)
**Coverage:** Regression · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin Portal | `navigation` §1 |
| **Entry route** | `/admin/login`, then `/admin/dealer-users` (dealer users list — **its search box only works when the form is submitted**; a `?…_search[...]=` URL parameter is ignored; the Dealer User Details page opens by clicking a user's row, its own route is not known) and the **Dealer Details > Users** page `/admin/dealer/{id}/users` — for dealer 1510, `/admin/dealer/1510/users` (URL in the ticket's screenshot of 2026-08-23). If the Users tab link is not visible, open `/admin/dealer/1510/edit` (Dealer Details, `domain` admin-portal.md 2026-10-03) and click the **"Users"** tab, or type `/admin/dealer/1510/users` directly | `navigation`, `domain` (admin-portal.md), ticket attachment `image-20260823-162728.png` |
| **Viewport** | 1280 × 800 | `navigation` §1, registry `admin_viewport` |
| **Environment** | Staging (v2staging) — base URL in the `env` source | `env` |
| **Login** | The Admin Portal login in the `env` source (Portals table, "Admin Portal" row). Never copy it into the log | `env` |
| **Test data** | **Test user:** `vinhle8702@gmail.com`, displayed "Vinh le2 Vinh Le2". **Test dealer:** **1510**, "Vinh le 2". Both from this ticket's own QA screenshot; no other ticket uses them, and neither the user nor its link to dealer 1510 is in the `test-data`, `navigation` or `domain` source, so step 1 of AP2441_011 checks them first. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** After execution, s4 records the pair in the `test-data` source. **Do not use dealer 1380.** AP2441_012 also needs **a dealer user linked to two or more dealers**, found by a read-only search of `/admin/dealer-users` (the one used for AP2441_002 / _010 may be reused) and never changed | ticket capture, test plan §8 |
| **Language** | The admin login page is in French ("Courriel", "Mot de passe", "Se connecter"); the admin pages are in English in the ticket's screenshots. Run in English | `navigation` §1 |
| **Leaves behind** | Nothing — AP2441_011 is read-only, and AP2441_012 closes the permissions form without saving | — |

**How to identify the row action buttons.** Icon buttons without visible text: a plug icon,
a dollar-in-a-box icon, a red person-with-lock icon, a pencil icon (tooltip **"Edit user"**)
and a crossed-link icon (ticket attachments). Hover each button and use its tooltip.

**Execution order.** Run AP2441_012 only after AP2441_006 has PASSED — AP2441_006 proves that closing the permissions form without saving changes nothing, which is what makes AP2441_012 safe on another person's user. If AP2441_006 failed, record AP2441_012 as BLOCKED by that failure.

**Known blockers:** None at design time. AP2441_012 needs a dealer user linked to two or more dealers, which no knowledge source names; its first step finds one by a read-only search, and the case is BLOCKED at run time only if none exists.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2441_011 | The dealer's Users tab still offers Autoshield, Deal your rate, Edit Permissions and Unlink after the change | Regression | Medium | Not Run |
| AP2441_012 | For a user with several dealers, Edit Permissions on the last row opens that dealer's permissions, not the first's | Edge-case | High | Not Run |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2441_011 — The dealer's Users tab still offers Autoshield, Deal your rate, Edit Permissions and Unlink after the change

| Field | Value |
|---|---|
| **TC ID** | AP2441_011 |
| **Title** | The dealer's Users tab still offers Autoshield, Deal your rate, Edit Permissions and Unlink after the change |
| **Requirement** | AP2441 — REQ-001 AC 1 (the Dealer Details > Users management page is the reference whose actions the User Details page copies); REQ-002 — none: its only REQ-002 point, the "Edit user" button on this page, is record-only (Q-006) and not counted as REQ-002 coverage |
| **Route** | `/admin/dealer/1510/users` — Dealer Details > Users |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** The change copies actions from this page; a shared component edited to
drop the Edit user button on the User Details page could also drop buttons here, where
administrators have always managed a dealership's users. Whether this page keeps its own
"Edit user" button is Q-006: the reporter's comment of 2026-08-24 says it does ("The button
is only removed on the User > Dealers page, not the Dealer > Users page. this is working as
expected"), but by this project's rule a comment from someone in `not_developers` cannot
close the question, so the button is recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Test user | `vinhle8702@gmail.com` ("Vinh le2 Vinh Le2") |
| Test dealer | 1510 — "Vinh le 2" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source and open `/admin/dealer/1510/users`. **If `/admin/dealer/1510/users` does not open or does not list "Vinh le2 Vinh Le2", stop and record the case BLOCKED — "test data missing: vinhle8702@gmail.com not linked to dealer 1510"; never link the user to the dealer and never switch to dealer 1380 to make the data.** | The page "Dealer Vinh le 2 > Users" opens with a "Link user" button and a users table that lists "Vinh le2 Vinh Le2" |
| 2 | Hover each action button on the "Vinh le2 Vinh Le2" row and write down every tooltip, left to right | Every button shows a tooltip (or is identified by icon); no error page |
| 3 | [Verification] Check the recorded buttons | The row offers **Autoshield**, **Deal your rate**, **Edit Permissions** and **Unlink**. Record-only: whether an **"Edit user"** button is still on this row (Q-006), and the order of the buttons |

---

### AP2441_012 — For a user with several dealers, Edit Permissions on the last row opens that dealer's permissions, not the first's

| Field | Value |
|---|---|
| **TC ID** | AP2441_012 |
| **Title** | For a user with several dealers, Edit Permissions on the last row opens that dealer's permissions, not the first's |
| **Requirement** | AP2441 — REQ-003 AC 3 ("the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint" — Edit Permissions for **that row's** dealer). Promoted from review proposal P1 (`AP2441_ReviewFindings_2026-11-01.md`) by Gate B rule B2 |
| **Route** | Dealer User Details page of a user with ≥ 2 dealers (opened from `/admin/dealer-users`); reference `/admin/dealer/{Dealer ID}/users` for the first and last dealers |
| **Type** | Edge-case |
| **Priority** | High |
| **Status** | Not Run |
| **Blocked by** | — |
| **Executed on** | _(filled by executor)_ |
| **Result** | _(filled by executor)_ |

**Why this matters:** AP2441_005 changes permissions on a user with a single dealer, where a
button wired to "the user's first dealer" instead of "this row's dealer" still looks right.
On a user with several dealers, that wiring would make an administrator change the wrong
dealership's access. This case uses equivalence partitioning (one-dealer users versus
several-dealer users) and is **read-only**: the form is opened and closed without saving,
which AP2441_006 has already shown changes nothing.

**Test Data:**

| Variable | Value |
|---|---|
| Multi-dealer user | Any existing dealer user whose Dealers table has two or more rows — found in step 1 (the one used for AP2441_002 / _010 may be reused), recorded in the log |
| First and last dealer | The Dealer ID and Name of the first and last rows of that user's Dealers table, recorded in step 1 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/admin/login` with the Admin Portal login from the `env` source, open `/admin/dealer-users` and open users one by one (at most the first 3 pages) until one's User Details page shows **two or more** dealer rows; write down the user's name and email, and the Dealer ID and Name of the first and last rows. Do not click any row button. If none is found, record the case as BLOCKED — "no dealer user with two or more dealers found" | A User Details page with at least two dealer rows is open; the user and the first and last dealers are recorded |
| 2 | [Pre-Condition] Open `/admin/dealer/{last Dealer ID}/users` and `/admin/dealer/{first Dealer ID}/users` and, on each, write down the role badges of the user found in step 1. Change nothing | The user's roles at the last dealer and at the first dealer are recorded, and whether they differ |
| 3 | Return to the user's User Details page and click the **"Edit Permissions"** button in the **last** dealer row; **take a screenshot of the form** | The browser does not go to the dealer details page instead; a permissions form opens without an error page or HTTP 5xx |
| 4 | Leave **without changing or saving anything** — click "Cancel" or the close (×) control if the form has one, otherwise the browser's Back button; then reopen `/admin/dealer/{last Dealer ID}/users` | The form closes without an error; the user's badges at the last dealer are exactly the step-2 list |
| 5 | [Verification] Compare the step-3 screenshot with the step-1 and step-2 records | The form belongs to the step-1 user at the **last** row's dealer, not the first: it names that dealer (by name or ID) or, if it names no dealer, the roles it shows as granted equal the last dealer's step-2 badges where those differ from the first dealer's. If the form names no dealer and the two dealers' roles are identical, record "not distinguishable" and mark the case BLOCKED — no PASS or FAIL can be given |

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
| AP2441_011 | _(pending)_ | — |
| AP2441_012 | _(pending)_ | — |

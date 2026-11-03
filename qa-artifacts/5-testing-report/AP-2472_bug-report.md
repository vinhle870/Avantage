# Bug Report

**Project:** Avantage Plus v2 — Admin portal, AP-2472: Earning Groups Management
**Report ID:** BR-20261004-001
**Test Cycle:** AP-2472 single-ticket STLC run, run folder 5.2.0 — 16 test cases executed on v2staging on 2026-10-03, with a Gate C re-check on 2026-10-04
**Date:** 2026-10-04
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.2.0/execution-log_AP-2472_2026-10-03.md · qa-artifacts/3-test-cases/AP2472_TestCases_*.md

| Metric | Value |
|---|:---:|
| Total defects | 4 |
| Critical | 0 |
| High | 0 |
| Medium | 1 |
| Low | 3 |
| Tracker tickets created | 4 |

**Gate C decisions (by the QA, 2026-10-04):**
- **AP2472_013**, the only FAIL, is filed as a new bug (BUG-001). The QA asked for a re-check of whether a required value was simply missing. The re-check found the curve is the form's only required value, and leaving it empty is exactly the condition that crashes. See BUG-001 Notes.
- **BUG-002 to BUG-004 come from test cases that passed.** Each is a usability finding the QA chose to file. **None of them breaks a written acceptance criterion**, because the ticket does not specify cancel controls, where validation errors appear, or list layout. Each ticket says this.
- **"A disabled earning curve can be assigned to a group" is not filed.** The acceptance criteria only say "Select box containing the list earning curves", so whether disabled curves belong in it is undefined. It stays open as Q-005 for the product owner.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2472_013 | Clicking "Assign" on an earning group with no curve selected shows an HTTP 500 error page | Medium | P2 | [AP-2478](https://garantieavantageplus.atlassian.net/browse/AP-2478) | Open |
| BUG-002 | AP2472_005 | Saving a new earning group with a blank name closes the modal and shows the error on a separate page | Low | P4 | [AP-2479](https://garantieavantageplus.atlassian.net/browse/AP-2479) | Open |
| BUG-003 | AP2472_003, AP2472_008, AP2472_016 | The Create and Edit earning group modals have no Cancel or close (×) button | Low | P4 | [AP-2480](https://garantieavantageplus.atlassian.net/browse/AP-2480) | Open |
| BUG-004 | AP2472_007 | A long earning group name pushes the "View" button off-screen in the Earning Groups list | Low | P4 | [AP-2481](https://garantieavantageplus.atlassian.net/browse/AP-2481) | Open |

---

## Bug Details

---

### BUG-001 — Clicking "Assign" on an earning group with no curve selected shows an HTTP 500 error page

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2472_013 |
| **Requirement** | REQ-005 — Assigning an earning curve to a group |
| **Severity** | Medium — the admin hits a crash page with no explanation, but no data is damaged and the action can simply be retried with a curve chosen |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging (`https://v2staging.garantieavantageplus.ca`) · build not exposed |
| **Tracker Ticket** | [AP-2478](https://garantieavantageplus.atlassian.net/browse/AP-2478) — Relates to AP-2472; screenshots embedded in the description |
| **Status** | Open |
| **First found** | 2026-10-03 |
| **Reproducibility** | Always (4/4 attempts: 2 in the UI, 2 by replaying the form post) |

**Summary:**
On an earning group's details page, clicking "Assign" when the "Earning Curve" select has no curve chosen returns an HTTP 500 server error page instead of a validation message.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter "Courriel" `vinhle870@gmail.com` and "Mot de passe" (the QA admin account), and click "Se connecter".
2. Open `/admin/earning-group` (sidebar: Risk Management → Earning Groups) and click "Create New". Enter Name `Bug500-repro`, leave "Default Earning Method" on "Pro-Rata", and click "Save". The group's details page `/admin/earning-group/{id}/details` opens.
3. In the "Earning Curve" select, choose the first curve and click "Assign". Repeat this for every curve the select offers until the select shows "Nothing selected" and has no options left. There were 8 curves on staging on 2026-10-03.
4. With the select showing "Nothing selected", click "Assign".

_Shorter alternative for a developer:_ on any group's details page, send the assign form (`POST /admin/earning-group/{id}/details`) with a valid `earning_group_curve[_token]` and either an empty `earning_group_curve[earningCurve]` or no such field at all.

**Expected Result:**
The form is refused with a validation message next to "Earning Curve", for example "This value should not be blank.". The admin stays on the details page and nothing is assigned. The group Name field on the Create form already behaves this way. The ticket does not define this case, so this is the reasonable expectation rather than a written criterion.

**Actual Result:**
The browser shows an HTTP 500 page that reads "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." Nothing is written to the group, and its curves are unchanged after a reload.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-AllCurvesAssignedNothingSelected.png` — a group holding every curve; the select shows "Nothing selected" |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_013-step2-AssignNothingSelectedHttp500_fail.png` — the HTTP 500 error page after clicking "Assign" |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/OBS-EmptyCurveAssignHttp500_fail.png` — the same 500 on a second group with the curve value emptied |
| Console log | None captured |

**Suggested Root Cause:**
The `earningCurve` field of the assign form has no server-side "not blank" constraint. An empty value reaches code that expects a curve entity, for example when building the group–curve link, and throws instead of returning a form error.

**Notes:**
- **Re-check made at the QA's request on 2026-10-04:** is this just a missing required value? The assign form has exactly one user field, "Earning Curve" (`earning_group_curve[earningCurve]`, not marked `required` in the HTML), plus a hidden CSRF token that the page fills in. With a valid token, an empty curve gave HTTP 500, and so did omitting the field. As a control, the same token with a valid curve (id 7) redirected normally and assigned the curve, which was then unassigned. So leaving the only required value empty is the exact trigger, and the server handles it with a crash rather than a message.
- **Related behaviour, not filed:** on a group that does not yet hold every curve, the select has no empty option and pre-selects the first curve ("1 year"). Clicking "Assign" without choosing therefore silently assigns "1 year".

---

### BUG-002 — Saving a new earning group with a blank name closes the modal and shows the error on a separate page

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2472_005 (the test passed; this is a usability finding) |
| **Requirement** | REQ-003 — "Create New" modal form |
| **Severity** | Low — the blank name is correctly refused, but the admin is taken out of the list to an unfamiliar standalone page |
| **Priority** | P4 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging (`https://v2staging.garantieavantageplus.ca`) · build not exposed |
| **Tracker Ticket** | [AP-2479](https://garantieavantageplus.atlassian.net/browse/AP-2479) — Relates to AP-2472; screenshots embedded in the description |
| **Status** | Open |
| **First found** | 2026-10-03 |
| **Reproducibility** | Always |

> **Usability finding, not an acceptance-criteria failure.** The ticket's criteria say "Create New" opens a modal, but they do not say how validation errors are shown. The QA chose to file this for the team to decide.

**Summary:**
When an admin clicks "Save" in the "Create earning group" modal with the Name empty, the modal closes and the browser goes to a standalone page `/admin/earning-group/new/edit` that shows "This value should not be blank.", instead of showing the error inside the modal.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter "Courriel" `vinhle870@gmail.com` and "Mot de passe" (the QA admin account), and click "Se connecter".
2. Open `/admin/earning-group` (sidebar: Risk Management → Earning Groups) and click "Create New". The "Create earning group" modal opens over the list.
3. Leave "Name" empty, leave "Default Earning Method" on "Pro-Rata", and click "Save".

**Expected Result:**
The modal stays open over the Earning Groups list and shows "This value should not be blank." under "Name", so the admin can type a name and save again in place.

**Actual Result:**
The modal closes and the browser navigates to `/admin/earning-group/new/edit`, a standalone page headed "Create earning group" with "This value should not be blank." under Name. The browser's own required-field check does not stop the submit, even though the Name input is marked required. No group is created.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_005-step2-BlankNameError_pass.png` — the standalone "Create earning group" page with "This value should not be blank." |

**Suggested Root Cause:**
The modal form posts as a normal full-page submit, and the server re-renders the form as a page on a validation error. The modal does not submit by AJAX or re-open with the errors.

**Notes:**
The executor noted that Earning Sets behaves the same way, so this may be a shared admin modal pattern rather than specific to Earning Groups.

---

### BUG-003 — The Create and Edit earning group modals have no Cancel or close (×) button

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2472_003, AP2472_008, AP2472_016 (all passed; this is a usability finding) |
| **Requirement** | REQ-003 — "Create New" modal form; REQ-008 — Editing a group |
| **Severity** | Low — an admin who opens the modal by mistake has no visible way out except pressing Escape or using the browser's Back button |
| **Priority** | P4 |
| **Environment** | Chromium (Playwright) · Windows 11 · v2staging (`https://v2staging.garantieavantageplus.ca`) · build not exposed |
| **Tracker Ticket** | [AP-2480](https://garantieavantageplus.atlassian.net/browse/AP-2480) — Relates to AP-2472; screenshots embedded in the description |
| **Status** | Open |
| **First found** | 2026-10-03 |
| **Reproducibility** | Always |

> **Usability finding, not an acceptance-criteria failure.** The ticket's criteria do not list a Cancel or close control for these modals. The QA chose to file this for the team to decide.

**Summary:**
The "Create earning group" modal (from "Create New") and the "Earning group #{id}" edit modal (from "Edit") show only a "Save" button, with no "Cancel" button and no close (×) icon.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter "Courriel" `vinhle870@gmail.com` and "Mot de passe" (the QA admin account), and click "Se connecter".
2. Open `/admin/earning-group` (sidebar: Risk Management → Earning Groups) and click "Create New". Look at the "Create earning group" modal's header and footer.
3. Press Escape to close it. Click "View" on any group, then click "Edit" in the details page navigation. Look at the "Earning group #{id}" modal's header and footer.

**Expected Result:**
Each modal offers a visible way to close it without saving, such as a "Cancel" button and/or a close (×) icon, as most modals in web applications do.

**Actual Result:**
Both modals contain only the form fields and a "Save" button. Pressing Escape closes them, and nothing is created or changed when they are closed this way, but there is no on-screen control to do so.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_003-step3-CreateModalFieldsDefaultProRata_pass.png` — the "Create earning group" modal with only a "Save" button |

**Suggested Root Cause:**
Unknown — for dev investigation. The modal template likely omits the standard header close button and footer cancel button.

**Notes:**
Closing with Escape was confirmed safe: no group is created (AP2472_008) and no change is saved.

---

### BUG-004 — A long earning group name pushes the "View" button off-screen in the Earning Groups list

| Field | Value |
|---|---|
| **Bug ID** | BUG-004 |
| **Test Case** | AP2472_007 (the test passed; this is a usability finding) |
| **Requirement** | REQ-002 — Earning Groups list page |
| **Severity** | Low — the group can still be opened by scrolling the table sideways, but the action button is hidden at a normal screen width |
| **Priority** | P4 |
| **Environment** | Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · v2staging (`https://v2staging.garantieavantageplus.ca`) · build not exposed |
| **Tracker Ticket** | [AP-2481](https://garantieavantageplus.atlassian.net/browse/AP-2481) — Relates to AP-2472; screenshots embedded in the description |
| **Status** | Open |
| **First found** | 2026-10-03 |
| **Reproducibility** | Always |

> **Usability finding, not an acceptance-criteria failure.** The ticket does not limit the name length or describe the list layout. The QA chose to file this for the team to decide.

**Summary:**
When an earning group has a 255-character name, the Name cell in the Earning Groups list does not wrap or truncate, so the table widens to about 1877 px and the row's "View" button moves off-screen behind a horizontal scroll bar.

**Steps to Reproduce:**

1. Open `https://v2staging.garantieavantageplus.ca/admin/login`, enter "Courriel" `vinhle870@gmail.com` and "Mot de passe" (the QA admin account), and click "Se connecter". Use a 1280 × 800 browser window.
2. Open `/admin/earning-group` (sidebar: Risk Management → Earning Groups) and click "Create New".
3. Enter a Name of 255 characters with no spaces, for example `QA-AP2472-Long-` followed by 240 letters `x`, leave "Pro-Rata", and click "Save".
4. Open `/admin/earning-group` again and look at the new row.

**Expected Result:**
The long name wraps or is truncated (for example with "…"), and every column, including "Actions" → "View", stays visible within the page width.

**Actual Result:**
The name is shown on one line at full length. The table becomes about 1877 px wide inside a 1115 px container, and the row's "View" button sits at about x = 1977 px, off-screen until the table is scrolled sideways. The name itself is saved and shown in full; no data is lost.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.2.0/AP-2472/AP2472_007-step4-ListLongAndSpecialNames_pass.png` — the list with the 255-character name stretching the table |

**Suggested Root Cause:**
The Name column has no `word-break` / `overflow-wrap` or `text-overflow: ellipsis` style, and the server sets no maximum name length. A 255-character name with no spaces cannot wrap.

**Notes:**
The ticket gives no length limit for Name (open question Q-001), and the server accepted 255 characters. Adding a sensible limit would also reduce this problem.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 1 | AP2472_013 |
| Low | 3 | AP2472_003, AP2472_005, AP2472_007, AP2472_008, AP2472_016 |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-002 — Earning Groups list page | 1 | BUG-004 |
| REQ-003 — "Create New" modal form | 2 | BUG-002, BUG-003 |
| REQ-005 — Assigning an earning curve to a group | 1 | BUG-001 |
| REQ-008 — Editing a group | 1 | BUG-003 |

**Open question, not a defect:** Q-005. A disabled earning curve (`QA-AP2472-Curve-B-Disabled`) is offered in the group's "Earning Curve" select with no marker and can be assigned. The acceptance criteria do not say whether disabled curves should be listed, so the product owner needs to decide. Evidence: `OBS-DisabledCurveOfferedInSelect.png`.

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2478 | Created (stlc-bug-reporter), linked Relates → AP-2472, evidence embedded and verified | To Do (new) | 2026-10-04 |
| BUG-002 | AP-2479 | Created (stlc-bug-reporter), linked Relates → AP-2472, evidence embedded and verified | To Do (new) | 2026-10-04 |
| BUG-003 | AP-2480 | Created (stlc-bug-reporter), linked Relates → AP-2472, evidence embedded and verified | To Do (new) | 2026-10-04 |
| BUG-004 | AP-2481 | Created (stlc-bug-reporter), linked Relates → AP-2472, evidence embedded and verified | To Do (new) | 2026-10-04 |

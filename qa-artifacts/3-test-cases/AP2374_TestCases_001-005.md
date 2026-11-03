# Test Cases — AP2374 (File 1 of 2)

**Project:** Avantage Plus v2 — Admin portal, Claims
**Requirement:** AP2374 — Status Change email notification: Add notify email and client email (Jira AP-2374)
**Source:** requirements/AP-2374-status-change-email-notification-notify-email.md · qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2374_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2374_001 to AP2374_005 (5 test cases)
**Coverage:** Functional · UI · Regression

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin portal for the claim and its Change status form; Dealer portal only to create the warranty contract and claim used as test data; Yopmail web inboxes to read the emails | `navigation` §1 |
| **Entry route** | Admin: `/admin/login`, then the admin sidebar's Claims section. **The admin Claims routes, the claim details page and the "Change status" control are not mapped** in any knowledge source (`navigation-map.md` §4 "Claims — the largest unmapped area"); the executor records the real routes and labels in the execution log and writes them back per `qa-docs/_mapping-guide.md`. Dealer: `/claims` (Claims list); the quote and warranty contract are created only from a vehicle's Details page — `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`) → **Save** → `/quote/{id}/details` → "Click here to create a warranty" → `/quote/{id}/warranty/edit` → **Save**. **Never enter at `/quote` or `/quote/new/client` without a vehicle** — the redirect after saving the client returns HTTP 500 | `navigation`, `domain` (`qa-docs/quote-creation.md` — Entry points), `test-data` |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | Staging (v2staging) — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | One shared account for Admin and Dealer portals — `execute.env.md` → Portals. The admin login page renders in French ("Courriel", "Mot de passe", "Se connecter"). Both sessions can be held at once in one browser | `env`, `navigation` §1 |
| **Test data** | Recipient inboxes `client.stage.{N}@yopmail.com` (the claim's notify email) and `client.stage.{N+1}@yopmail.com` (the contract client's email), where `{N}` is the next unused three-digit number; read at `https://yopmail.com/en/?login=client.stage.{N}`. Client name `Marie Tremblay`. Quote vehicle: **915** — VIN `1FAHP35NX8W239204`, Ford Focus 2008, `/vehicle/915/details` (standing data). The quote, contract, claims and inboxes are created per run in each case's `[Pre-Condition]` step, never taken from an earlier run | `test-data` |
| **Language** | EN as the admin pages render by default; the admin login page is always French. Email language not stated in the ticket — recorded | `navigation` |
| **Leaves behind** | One quote, one warranty contract and one claim per run, all for `Marie Tremblay`; the claim's status changed two or more times; emails in public Yopmail inboxes. Not known whether any can be deleted — `cleanup` is `missing` | `cleanup` (missing) |

**Standing facts only.** The warranty contract, the claim and the two inboxes are dynamic
and are created in each case's `[Pre-Condition]` step. All cases of one run reuse the
same claim once it exists.

**Safety rule for every case.** Never tick *Notify by email* and submit on a claim whose
recipient field holds any address other than this run's `client.stage.{N}` /
`client.stage.{N+1}` Yopmail addresses — that would email a real person.

**Navigation gap (not a blocker):** the admin Claims screens and where a claim's notify
email is set (Q-010, Info) are unmapped. The executor finds them from the admin sidebar
and the claim forms and records them. If the notify email cannot be set on any claim
form, the affected step is BLOCKED by Q-010, not FAIL.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether the email must show the claim's own ID and the new status name in place of "48618" and "{{STATUS}}" | AP2374_005 | Open — Q-001 (Blocking), asked on AP-2374 comment 19433, 2026-11-01 |

> Every test case named in **Affects** ships with **Status: BLOCKED** and a **Blocked by**
> value — not `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2374_001 | Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field | Functional | High | FAIL |
| AP2374_002 | The recipient field is pre-filled with the claim's notify email and the client's email, separated by a comma | Functional | High | BLOCKED |
| AP2374_003 | Changing a claim's status with "Notify by email" ticked delivers an email to both pre-filled recipients | Functional | High | BLOCKED |
| AP2374_004 | A second status change to a different status also emails both recipients — the email is not tied to one status | Regression | High | BLOCKED |
| AP2374_005 | The notification email states the claim's ID and its new status in the ticket's message wording | Functional | Medium | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2374_001 — Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field

| Field | Value |
|---|---|
| **TC ID** | AP2374_001 |
| **Title** | Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field |
| **Requirement** | AP2374 — REQ-001 / AC 1 ("A checkbox ‘Notify by email’ is available in the form"); REQ-002 / AC 2 (field label) |
| **Route** | Admin Claims → claim details → "Change status" (routes recorded at execution) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | FAIL — checkbox and recipient field exist only on the Authorized and Refused forms ("Notify customer by email" on Pending); absent on Created, Submitted, Preapproved, Accepted by Dealer, Paid, Cancelled |

**Why this matters:** this is the build check for the whole ticket. If the checkbox is
missing, the change is not deployed and every other case is BLOCKED, not FAIL.

**Test Data:**

| Variable | Value |
|---|---|
| Client | `Marie Tremblay`, email `client.stage.{N+1}@yopmail.com` |
| Claim notify email | `client.stage.{N}@yopmail.com` |
| Claim attachment | One image file — this run's first screenshot, copied as `AP2374-attachment.png` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID, the contract number and the claim's current status | The contract and the claim are saved without an error page; the claim has an ID and lists `AP2374-attachment.png` among its attachments |
| 2 | [Pre-Condition] Log in to the Admin portal at `/admin/login`, open the admin Claims section from the sidebar and open the claim recorded in step 1 | The admin claim details page for that claim ID opens |
| 3 | Click the change-status control on the claim details page (labelled "Change status" or similar — record the exact label) | A status-change form opens on the claim, without an error page |
| 4 | [Verification] Verify the form shows a checkbox labelled "Notify by email" and a field labelled "Recipient email(s) - separate by commas for multiple recipient". Record whether the checkbox is ticked or unticked when the form opens (Q-002 — record only). Close the form without submitting | A checkbox labelled "Notify by email" and a field labelled "Recipient email(s) - separate by commas for multiple recipient" are both present (AC 1, AC 2). A label differing only in letter case or punctuation is recorded, not judged; any other wording difference, or a missing control, is a FAIL. The default state of the checkbox is recorded, not judged |

---

### AP2374_002 — The recipient field is pre-filled with the claim's notify email and the client's email, separated by a comma

| Field | Value |
|---|---|
| **TC ID** | AP2374_002 |
| **Title** | The recipient field is pre-filled with the claim's notify email and the client's email, separated by a comma |
| **Requirement** | AP2374 — REQ-002 / AC 2 ("The field is populated with the claim’s notify_email field and the warranty contract’s client email field separated by comma") |
| **Route** | Admin Claims → claim details → "Change status" |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-010 (found at execution, 2026-11-01, Dev): no dealer or admin claim form has a notify-email field, so the claim's notify email cannot be set |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | BLOCKED — Q-010: no claim form on dev sets the notify email; field pre-filled with the client email only |

**Why this matters:** the two addresses decide who is told about the claim. A wrong or
missing address means the client or the claim contact never hears about the change.

**Test Data:**

| Variable | Value |
|---|---|
| Expected address 1 (claim notify email) | `client.stage.{N}@yopmail.com` |
| Expected address 2 (contract client email) | `client.stage.{N+1}@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID | The claim is saved without an error page and has an ID |
| 2 | [Pre-Condition] In the Admin portal open the admin Claims section and open the claim from step 1. Record where the claim's notify email is shown, if anywhere (Q-010) | The admin claim details page for that claim ID opens |
| 3 | Click the change-status control | The status-change form opens with the "Recipient email(s) - separate by commas for multiple recipient" field |
| 4 | [Verification] Read the full value of the "Recipient email(s)" field without editing it. Record the value exactly, including the order of the two addresses and any spaces. Close the form without submitting | The field contains exactly two addresses, `client.stage.{N}@yopmail.com` and `client.stage.{N+1}@yopmail.com`, separated by a comma, and no other address. The order is recorded (the ticket names the notify email first but does not say the order is required) |

---

### AP2374_003 — Changing a claim's status with "Notify by email" ticked delivers an email to both pre-filled recipients

| Field | Value |
|---|---|
| **TC ID** | AP2374_003 |
| **Title** | Changing a claim's status with "Notify by email" ticked delivers an email to both pre-filled recipients |
| **Requirement** | AP2374 — REQ-003 / AC 3 ("A notification email is sent to the list of ‘Recipient email(s) - separate by commas for multiple recipient’"); regression of AP-2382 |
| **Route** | Admin Claims → claim details → "Change status"; Yopmail inboxes |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-010 (found at execution, 2026-11-01, Dev): no dealer or admin claim form has a notify-email field, so the claim's notify email cannot be set |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | BLOCKED — Q-010: only the client email can be on the list; that recipient received the email |

**Why this matters:** sending the email is the purpose of the ticket, and bug AP-2382 —
"Can't receive the email after submit change status form with email checkbox as checked" —
was raised against exactly this step.

**Test Data:**

| Variable | Value |
|---|---|
| Recipients (pre-filled, not edited) | `client.stage.{N}@yopmail.com`, `client.stage.{N+1}@yopmail.com` |
| Target status | Any status in the form's status list other than the claim's current one — record its label (first change of the run) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID and its current status | The claim is saved without an error page and has an ID |
| 2 | [Pre-Condition] In the Admin portal open the claim from step 1 and click the change-status control. Confirm the recipient field holds only this run's two Yopmail addresses (safety rule) | The status-change form opens; the recipient field holds only the two `client.stage` addresses |
| 3 | Select a status different from the current one (record its label), tick "Notify by email", leave the recipient field unchanged, and submit the form (record the submit button's label and the time) | The form closes without an error page; the claim details page shows the selected status |
| 4 | Open `https://yopmail.com/en/?login=client.stage.{N}`, then `https://yopmail.com/en/?login=client.stage.{N+1}`; refresh for up to 2 minutes | Each inbox shows a new email received after the submit time in step 3 |
| 5 | [Verification] Verify both inboxes hold a new email received after the time in step 3 (the inboxes are fresh for this run, so any new email is this run's), and record for each: sender, subject (Q-006 — record only), received time and how many new emails arrived | Both `client.stage.{N}` and `client.stage.{N+1}` received the notification email. Sender, subject and the number of emails are recorded, not judged |

---

### AP2374_004 — A second status change to a different status also emails both recipients — the email is not tied to one status

| Field | Value |
|---|---|
| **TC ID** | AP2374_004 |
| **Title** | A second status change to a different status also emails both recipients — the email is not tied to one status |
| **Requirement** | AP2374 — REQ-003 / AC 3 (the description limits no status); the reporter asked on 2025-12-18 to "test with that status and with multiple emails" |
| **Route** | Admin Claims → claim details → "Change status"; Yopmail inboxes |
| **Type** | Regression |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-010 (found at execution, 2026-11-01, Dev): no dealer or admin claim form has a notify-email field, so the claim's notify email cannot be set |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | BLOCKED — Q-010: as AP2374_003; second change (Authorized) also emailed the client |

**Why this matters:** the reporter's comment says an earlier version worked for the
"Authorized" status only. A second, different target status shows the email is sent for
any status change, as the description states without restriction.

**Test Data:**

| Variable | Value |
|---|---|
| Recipients (pre-filled, not edited) | `client.stage.{N}@yopmail.com`, `client.stage.{N+1}@yopmail.com` |
| Target status | A status different from both the claim's current status and the one used in AP2374_003. If "Authorized" is in the list and was not used in AP2374_003, use it here; record the label |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID and its current status | The claim is saved without an error page and has an ID |
| 2 | [Pre-Condition] In the Admin portal open the claim from step 1 and click the change-status control. Confirm the recipient field holds only this run's two Yopmail addresses (safety rule) | The status-change form opens with the two `client.stage` addresses |
| 3 | Select the target status from Test Data, tick "Notify by email", leave the recipients unchanged and submit. Record the time | The form closes without an error page; the claim details page shows the new status |
| 4 | Open both Yopmail inboxes and refresh for up to 2 minutes | Each inbox shows a new email received after the time recorded in step 3 |
| 5 | [Verification] Verify both inboxes hold a new email received after the time in step 3 (the inboxes are fresh for this run, so any new email is this run's), separate from the AP2374_003 email (if that case ran), and record the status wording each email shows | Both recipients received a second email for the second status change. The status wording is recorded (judged in AP2374_005) |

---

### AP2374_005 — The notification email states the claim's ID and its new status in the ticket's message wording

| Field | Value |
|---|---|
| **TC ID** | AP2374_005 |
| **Title** | The notification email states the claim's ID and its new status in the ticket's message wording |
| **Requirement** | AP2374 — REQ-004 / AC 4 ("Message: The claim ID 48618 has been updated to status {{STATUS}}"); regression of AP-2392 |
| **Route** | Yopmail inbox `client.stage.{N}` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | BLOCKED |
| **Blocked by** | Q-001 (Blocking — unanswered): whether "48618" and "{{STATUS}}" stand for the claim's own ID and the new status name. Asked on AP-2374, comment 19433, 2026-11-01 |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | BLOCKED — Q-001 unanswered; email body recorded in the execution log (no "claim ID … updated to status" sentence) |

**Why this matters:** bug AP-2392 reported this message missing from the email, and the
QA's 2026-01-07 comment says it was still missing on staging. Run the steps anyway to
record what the email says; the PASS/FAIL verdict waits for the author's answer.

**Test Data:**

| Variable | Value |
|---|---|
| Email under test | The newest email in `client.stage.{N}@yopmail.com` from AP2374_003 or AP2374_004 |
| Claim ID and status to compare | The claim ID recorded in step 1 and the status selected in the change that sent the email |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID | The claim is saved without an error page and has an ID |
| 2 | [Pre-Condition] If no notification email for this claim exists in `client.stage.{N}` yet, change the claim's status in the Admin portal with "Notify by email" ticked and the two Yopmail recipients (as AP2374_003 steps 2–3). Record the status selected | An email for this claim is in the `client.stage.{N}` inbox |
| 3 | Open the newest notification email in `https://yopmail.com/en/?login=client.stage.{N}` | The email body is displayed |
| 4 | [Verification] Copy the full email body text into the execution log word for word. Record whether a sentence of the form "The claim ID … has been updated to status …" is present, and what ID and status it shows. Record whether the body contains anything besides that sentence (Q-005 — record only) | Not known — Q-001. The verdict is given once the author says what the message must contain. Objective faults recorded now: a body with no status message at all (the AP-2392 symptom) or an error page |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 / AC 1 — "Notify by email" checkbox | AP2374_001 | — | — | — |
| REQ-002 / AC 2 — recipient field pre-filled | AP2374_001 (label), AP2374_002 | AP2374_009 (file 2) | AP2374_008 (file 2) | — |
| REQ-003 / AC 3 — email sent to recipients | AP2374_003 | AP2374_007, AP2374_009 (file 2) | AP2374_010 (file 2) | AP2374_004 |
| REQ-004 / AC 4 — message text | AP2374_005 (BLOCKED — Q-001) | — | — | AP2374_005 (AP-2392) |
| REQ-005 / AC 5 — attachments | AP2374_006 (file 2) | — | AP2374_010 (file 2) | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2374_001 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-SubmittedFormNoNotifyCheckbox_fail.png` |
| AP2374_002 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step4-RecipientFieldOnlyClientEmail_blocked.png` |
| AP2374_003 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Inbox931RefusedEmail_blocked.png` |
| AP2374_004 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Inbox931SecondEmailAuthorized_blocked.png` |
| AP2374_005 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-EmailBodyNoClaimIdSentence_blocked.png` |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2374_003 | Step 5: "one new email from Avantage Plus" → "a new email for this claim"; sender and number of emails now recorded, not judged | Gate B rule B1 — review findings Pass 1 gap 1 / R2 F-1: sender and count are not stated in the ticket |
| 2026-11-01 | Execution Context, AP2374_001–005 step 1 | Entry route and contract setup now start from vehicle 915: `/vehicle/915/details` → Create quote → client → `/quote/{id}/warranty/edit` → Save; bare `/quote` forbidden; vehicle 915 added to Test data | R2 independent re-review F-1 (Major): `/quote` without a vehicle returns HTTP 500 per `qa-docs/quote-creation.md` |
| 2026-11-01 | AP2374_001 | Step 4 expected result states the verdict: case/punctuation-only label differences recorded, any other wording difference is a FAIL | R2 re-review F-3 |
| 2026-11-01 | AP2374_003, AP2374_004 | Step 5: "a new email received after the time in step 3 (the inboxes are fresh for this run, so any new email is this run's)" | R2 re-review F-6 |
| 2026-11-01 | Coverage Matrix | AP2374_010 (file 2) added to REQ-003 Edge-case | R2 re-review F-5 |

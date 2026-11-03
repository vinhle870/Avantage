# Test Cases — AP2374 (File 2 of 2)

**Project:** Avantage Plus v2 — Admin portal, Claims
**Requirement:** AP2374 — Status Change email notification: Add notify email and client email (Jira AP-2374)
**Source:** requirements/AP-2374-status-change-email-notification-notify-email.md · qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2374_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2374_006 to AP2374_010 (5 test cases)
**Coverage:** Functional · Negative · Edge-case

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin portal for the claim and its Change status form; Dealer portal only to create the warranty contract and claims used as test data; Yopmail web inboxes to read the emails | `navigation` §1 |
| **Entry route** | Admin: `/admin/login`, then the admin sidebar's Claims section. **The admin Claims routes, the claim details page and the "Change status" control are not mapped** in any knowledge source (`navigation-map.md` §4); the executor records the real routes and labels and writes them back per `qa-docs/_mapping-guide.md`. Dealer: `/claims`; the quote and warranty contract are created only from a vehicle's Details page — `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`) → **Save** → `/quote/{id}/details` → "Click here to create a warranty" → `/quote/{id}/warranty/edit` → **Save**. **Never enter at `/quote` or `/quote/new/client` without a vehicle** — the redirect after saving the client returns HTTP 500 | `navigation`, `domain` (`qa-docs/quote-creation.md` — Entry points), `test-data` |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | Staging (v2staging) — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | One shared account for Admin and Dealer portals — `execute.env.md` → Portals. The admin login page renders in French. Both sessions can be held at once in one browser | `env`, `navigation` §1 |
| **Test data** | Recipient inboxes `client.stage.{N}@yopmail.com` (claim notify email) and `client.stage.{N+1}@yopmail.com` (contract client email), `{N}` = the next unused three-digit number, the same pair as file 1 in the same run; read at `https://yopmail.com/en/?login=client.stage.{N}`. Client name `Marie Tremblay`. Quote vehicle: **915** — VIN `1FAHP35NX8W239204`, Ford Focus 2008, `/vehicle/915/details` (standing data) | `test-data` |
| **Language** | EN as the admin pages render by default; email language recorded | `navigation` |
| **Leaves behind** | The run's contract and claim from file 1, plus one claim without a notify email (AP2374_008) and one claim without attachments (AP2374_010) on the same contract; several status changes; emails in public Yopmail inboxes. Not known whether any can be deleted — `cleanup` is `missing` | `cleanup` (missing) |

**Standing facts only.** Contracts, claims and inboxes are dynamic and are created in each
case's `[Pre-Condition]` step.

**Safety rule for every case.** Never tick *Notify by email* and submit on a claim whose
recipient field holds any address other than this run's `client.stage.{N}` /
`client.stage.{N+1}` Yopmail addresses. The one exception is AP2374_009, which may submit
the field holding the non-address value `not-an-email` or left empty — neither can be
delivered to anyone.

**Navigation gap (not a blocker):** as in file 1 — the admin Claims screens and where the
notify email is set (Q-010) are recorded at execution.

**Known blockers:** None.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2374_006 | The notification email carries the claim's attached file and a PDF of this claim's details page | Functional | High | BLOCKED |
| AP2374_007 | Changing a claim's status with "Notify by email" left unticked saves the status — whether an email is sent is recorded | Negative | Medium | PASS |
| AP2374_008 | A claim with no notify email opens Change status without an error and still lists the client's email | Edge-case | Medium | PASS |
| AP2374_009 | An invalid or emptied recipient list with "Notify by email" ticked causes no error page and emails no one outside the list | Negative | Medium | PASS |
| AP2374_010 | A claim with no attached files still sends the notification email — what it attaches is recorded | Edge-case | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2374_006 — The notification email carries the claim's attached file and a PDF of this claim's details page

| Field | Value |
|---|---|
| **TC ID** | AP2374_006 |
| **Title** | The notification email carries the claim's attached file and a PDF of this claim's details page |
| **Requirement** | AP2374 — REQ-005 / AC 5 ("The attachment files from the claim’s attachments"; "A PDF of the claim details page") |
| **Route** | Yopmail inbox `client.stage.{N}`; admin claim details page for comparison |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Environment: admin claim Add attachment returns HTTP 500 on Dev (2 of 2, 2026-11-01), so AP2374-attachment.png cannot be put on the claim; also Q-010 for the {N} inbox |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | BLOCKED — claim attachment upload returns HTTP 500 on dev (2/2); email carries only the claim PDF |

**Why this matters:** the attachments let the recipient see the claim's documents without
logging in. A missing or wrong file sends the client incomplete — or someone else's —
information.

**Test Data:**

| Variable | Value |
|---|---|
| Claim attachment | `AP2374-attachment.png` (attached when the claim was created) |
| Email under test | The newest notification email for this claim in `client.stage.{N}@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID | The claim is saved without an error page; `AP2374-attachment.png` is listed among its attachments |
| 2 | [Pre-Condition] If no notification email for this claim is in `client.stage.{N}` yet, change the claim's status in the Admin portal with "Notify by email" ticked and the two Yopmail recipients unchanged; record the status selected | A notification email for this claim is in the `client.stage.{N}` inbox |
| 3 | Open the newest notification email in `https://yopmail.com/en/?login=client.stage.{N}` and list every attachment it carries (file name and type) | The email's attachment list is visible |
| 4 | Open the PDF attachment, and in another tab open the admin claim details page of the same claim | The PDF opens and its content can be read |
| 5 | [Verification] Verify the email carries `AP2374-attachment.png` (same file name as on the claim) and one PDF file, and that the PDF shows this claim's ID. Record which other fields of the admin claim details page the PDF shows and any whose values differ, plus the PDF's file name, language and layout (Q-009 — record only) | `AP2374-attachment.png` and a PDF are both attached; the PDF shows the details of this claim (its ID matches the claim recorded in step 1). Other fields, value differences, file name and layout are recorded, not judged |

---

### AP2374_007 — Changing a claim's status with "Notify by email" left unticked saves the status — whether an email is sent is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2374_007 |
| **Title** | Changing a claim's status with "Notify by email" left unticked saves the status — whether an email is sent is recorded |
| **Requirement** | AP2374 — REQ-003 / AC 3 (the email is tied to "the ‘notify by email’ checkbox is selected"); Q-007 (Judgement) |
| **Route** | Admin Claims → claim details → "Change status"; Yopmail inboxes |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | PASS — status saved; no email sent with the box unticked (Q-007 recorded) |

**Why this matters:** an admin who does not tick the box expects no email to leave. The
ticket does not say so outright (Q-007), so the outcome is recorded for the author.

**Test Data:**

| Variable | Value |
|---|---|
| Target status | A status different from the claim's current one — record its label |
| Checkbox | "Notify by email" left **unticked** (untick it if it opens ticked) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID | The claim is saved without an error page and has an ID |
| 2 | [Pre-Condition] In the Admin portal open the claim and click the change-status control. Record the number of emails currently in each of the two Yopmail inboxes | The status-change form opens; the inbox counts are recorded |
| 3 | Select the target status, make sure "Notify by email" is unticked, and submit. Record the time | The form closes without an error page; the claim details page shows the new status |
| 4 | Wait 2 minutes, then refresh both Yopmail inboxes | Both inboxes are displayed |
| 5 | [Verification] Verify the claim shows the new status, and record whether either inbox received a new email after the time in step 3 (Q-007 — record only) | The status change is saved and no error page appeared. Whether an email arrived is recorded, not judged |

---

### AP2374_008 — A claim with no notify email opens Change status without an error and still lists the client's email

| Field | Value |
|---|---|
| **TC ID** | AP2374_008 |
| **Title** | A claim with no notify email opens Change status without an error and still lists the client's email |
| **Requirement** | AP2374 — REQ-002 / AC 2; Q-003 (Judgement) |
| **Route** | Admin Claims → claim details → "Change status" |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | PASS — field = client email only, no stray comma (Q-003 recorded) |

**Why this matters:** not every claim will have a notify email. The form must still open
and still offer the client's address; how the empty value is shown (a stray comma, for
example) is recorded for the author.

**Test Data:**

| Variable | Value |
|---|---|
| Second claim | On this run's contract (client email `client.stage.{N+1}@yopmail.com`), **notify email left empty**, no attachment |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure this run's contract exists (client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`** — if not, create it in the Dealer portal: `/vehicle/915/details` → **Create quote** (never `/quote` bare — HTTP 500) → client → **Save** → `/quote/{id}/warranty/edit` → select a term → **Save**). At `/claims` create a **second** claim on that contract with the **notify email left empty** and no attachment → **Save**. Record its claim ID | The second claim is saved without an error page and has its own ID |
| 2 | [Pre-Condition] In the Admin portal open the admin Claims section and open the second claim | Its admin claim details page opens |
| 3 | Click the change-status control | The status-change form opens without an error page |
| 4 | [Verification] Record the exact value of the "Recipient email(s)" field, including any leading or trailing comma or space (Q-003 — record only). Close the form without submitting | The field contains `client.stage.{N+1}@yopmail.com` and no address that is on neither the claim nor the contract. The exact formatting is recorded, not judged |

---

### AP2374_009 — An invalid or emptied recipient list with "Notify by email" ticked causes no error page and emails no one outside the list

| Field | Value |
|---|---|
| **TC ID** | AP2374_009 |
| **Title** | An invalid or emptied recipient list with "Notify by email" ticked causes no error page and emails no one outside the list |
| **Requirement** | AP2374 — REQ-002 / AC 2 and REQ-003 / AC 3 (the email goes to "the list of ‘Recipient email(s)’"); Q-004 (Judgement) |
| **Route** | Admin Claims → claim details → "Change status"; Yopmail inboxes |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | PASS — invalid and empty lists saved without validation, no error page, no email (Q-004 recorded) |

**Why this matters:** the ticket does not say whether the field can be edited or how bad
input is handled (Q-004). What must never happen is a server error, or an email reaching
an address the admin removed from the list.

**Test Data:**

| Variable | Value |
|---|---|
| Invalid recipient value | `not-an-email` |
| Empty recipient value | (field cleared) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Prepare this run's claim (reuse it if an earlier case of this run already did): in the Dealer portal open vehicle **915** (`1FAHP35NX8W239204`) at `/vehicle/915/details` and click **Create quote** (→ `/quote/new/client?fromVehicleId=915`; never `/quote` bare — HTTP 500); enter client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`**, every required field incl. `telWork` → **Save** (→ `/quote/{id}/details`); click "Click here to create a warranty" → `/quote/{id}/warranty/edit`, select a term → **Save** to create the warranty contract (record the quote ID); then at `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and attach **`AP2374-attachment.png`** → **Save**. Record the claim ID, its status and the number of emails in both Yopmail inboxes | The claim is saved without an error page and has an ID |
| 2 | [Pre-Condition] In the Admin portal open the admin Claims section and open the claim from step 1 | The admin claim details page for that claim ID opens |
| 3 | Click the change-status control, select a status different from the current one, tick "Notify by email", replace the recipient field with `not-an-email` and submit. Record what the form does (message text, or saved) and the time. If the field cannot be edited, record that and skip to step 5 | No error page or HTTP 5xx. Whether the form refuses the value or saves is recorded |
| 4 | Open the change-status form again, select a status different from the current one, tick "Notify by email", clear the recipient field completely and submit. Record what the form does and the time | No error page or HTTP 5xx. Whether the form refuses the empty list or saves is recorded |
| 5 | [Verification] Wait 2 minutes, refresh both Yopmail inboxes, and verify neither `client.stage.{N}` nor `client.stage.{N+1}` received a new email after the times in steps 3 and 4, since neither address was in the submitted list. Record the claim's final status and every message shown (Q-004 — record only) | No new email in either inbox from these two submits, and no error page in steps 3–4. Validation messages and the saved status are recorded, not judged |

---

### AP2374_010 — A claim with no attached files still sends the notification email — what it attaches is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2374_010 |
| **Title** | A claim with no attached files still sends the notification email — what it attaches is recorded |
| **Requirement** | AP2374 — REQ-003 / AC 3 and REQ-005 / AC 5; Q-008 (Judgement) |
| **Route** | Admin Claims → claim details → "Change status"; Yopmail inbox `client.stage.{N}` |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) |
| **Result** | PASS — email sent with claim-332.pdf only (read in the client inbox; Q-008 recorded) |

**Why this matters:** many claims have no documents yet. The email must still go out, and
it must not pick up files that belong to another claim.

**Test Data:**

| Variable | Value |
|---|---|
| Third claim | On this run's contract, **notify email `client.stage.{N}@yopmail.com`**, **no attachment** |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure this run's contract exists (client **Marie Tremblay**, email **`client.stage.{N+1}@yopmail.com`** — if not, create it in the Dealer portal: `/vehicle/915/details` → **Create quote** (never `/quote` bare — HTTP 500) → client → **Save** → `/quote/{id}/warranty/edit` → select a term → **Save**). At `/claims` create a claim on that contract with **notify email `client.stage.{N}@yopmail.com`** and **no attachment** → **Save**. Record its claim ID | The claim is saved without an error page, with no attachments listed |
| 2 | [Pre-Condition] In the Admin portal open that claim and click the change-status control. Confirm the recipient field holds only this run's Yopmail addresses (safety rule) | The status-change form opens |
| 3 | Select a status different from the current one, tick "Notify by email", leave the recipients unchanged and submit. Record the time | The form closes without an error page; the claim shows the new status |
| 4 | Open `https://yopmail.com/en/?login=client.stage.{N}` and refresh for up to 2 minutes; open the new email for this claim | A new email received after step 3 is displayed |
| 5 | [Verification] Verify the email arrived and list its attachments (Q-008 — record only) | The email was received. Its attachments are recorded; `AP2374-attachment.png` (which belongs to a different claim) must not be among them |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-002 / AC 2 — recipient field pre-filled | — | AP2374_009 | AP2374_008 | — |
| REQ-003 / AC 3 — email sent to recipients | — | AP2374_007, AP2374_009 | AP2374_010 | — |
| REQ-005 / AC 5 — attachments | AP2374_006 | — | AP2374_010 | — |

Full matrix across both files: see file 1 (`AP2374_TestCases_001-005.md`).

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2374_006 | BLOCKED | — |
| AP2374_007 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_007-step5-Inbox931NoEmailAfterUntickedSubmit_pass.png` |
| AP2374_008 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_008-step4-NoNotifyEmailClaimRecipientClientOnly_pass.png` |
| AP2374_009 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_009-step5-Inbox931NoEmailFromInvalidOrEmptyList_pass.png` |
| AP2374_010 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_010-step5-Claim332EmailOnlyClaimPdf_pass.png` |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | Execution Context, AP2374_006–010 step 1 | Entry route and contract setup now start from vehicle 915: `/vehicle/915/details` → Create quote → client → `/quote/{id}/warranty/edit` → Save; bare `/quote` forbidden; vehicle 915 added to Test data | R2 independent re-review F-1 (Major): `/quote` without a vehicle returns HTTP 500 per `qa-docs/quote-creation.md` |
| 2026-11-01 | AP2374_006 | Step 5 judges only the claim ID in the PDF; other fields and value differences recorded (Q-009) | R2 re-review F-2 |
| 2026-11-01 | AP2374_009, safety rule | Safety rule allows `not-an-email`/empty in AP2374_009; opening the claim split into its own [Pre-Condition] step 2; old steps 4 and 5 merged | R2 re-review F-4 |

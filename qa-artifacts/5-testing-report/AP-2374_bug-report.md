# Bug Report

**Project:** Avantage Plus (AP) — AP-2374 *Status Change email notification: Add notify email and client email*
**Report ID:** BR-20261115-001
**Test Cycle:** Run folder 3.6.0 (fix version) — AP-2374 execution of 2026-11-15 (AP2374_002–006 and AP2374_011 run; AP2374_001 and AP2374_007–010 carried from 2026-11-01)
**Date:** 2026-11-15
**Reported by:** QA Agent — Bug Reporter Skill (inside stlc-ticket-pipeline, `AP-2374 --from file-bugs --until report`, batch qa-agent 2026-11-15)
**Source:** `qa-artifacts/3-test-cases/AP2374_TestCases_001-005.md`, `AP2374_TestCases_006-010.md`, `AP2374_TestCases_011-011.md` — execution log `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-15.md`
**Tested on:** Environment: Dev (v2dev) — https://v2dev.garantieavantageplus.ca (`execution_env: Dev`)
**Supersedes:** BR-20261101-001 (the 2026-11-01 report). BUG-001 is carried from it unchanged.

| Metric | Value |
|---|:---:|
| Total defects | 2 |
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 0 |
| Tracker tickets created | 1 (this run) · 1 carried (AP-2509) |

The run has 2 FAILs and 1 BLOCKED case. Gate C (review R3, round 1) decided:
AP2374_005 → **file new** (rule C4 — the only bug naming the same symptom, AP-2392, is Done,
so it is not an open duplicate; it is linked, not reopened); AP2374_001 → already filed as
AP-2509, no action; AP2374_006 BLOCKED by a Dev environment fault → no bug filed.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2374_001 | "Notify by email" checkbox and recipient field appear only on the Authorized and Refused Change status forms | Medium | P2 | AP-2509 | Open (carried) |
| BUG-002 | AP2374_005 | Claim status-change emails do not contain "The claim ID … has been updated to status …" | Medium | P2 | AP-2565 | Open |

---

## Bug Details

---

### BUG-001 — "Notify by email" is missing from 7 of the 9 claim Change status forms

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2374_001 — Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field |
| **Requirement** | REQ-001 — "Notify by email" checkbox on the Change status form (AC 1); REQ-002 — recipient field (AC 2) |
| **Severity** | Medium — the notification works when a claim is moved to Authorized or Refused, but an admin moving a claim to any of six other statuses cannot notify anyone, and the Pending form uses a different label that starts unticked |
| **Priority** | P2 |
| **Environment** | Tested on: Dev (v2dev) — https://v2dev.garantieavantageplus.ca · Chromium (Playwright) · Windows 11 · fix version 3.6.0 |
| **Tracker Ticket** | [AP-2509](https://garantieavantageplus.atlassian.net/browse/AP-2509) |
| **Status** | Open — carried from 2026-11-01 (Backlog). Not re-run on 2026-11-15; the same absence was seen again on claim 333's Preapproved form (AP2374_002 step 4) |
| **First found** | 2026-11-01 |
| **Reproducibility** | Always (every status form opened on claims 331 and 332, re-checked for Pending and Paid at 17:25Z) |

**Summary:**
In the admin claim details page, the "Change status" form shows the "Notify by email" checkbox and the "Recipient email(s) - separate by commas for multiple recipient" field only when the new status is Authorized or Refused; the Pending form shows a different checkbox, "Notify customer by email", and the Created, Submitted, Preapproved, Accepted by Dealer, Paid and Cancelled forms show neither control.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/admin/login and sign in with the shared admin account.
2. Open any existing claim's admin details page, for example https://v2dev.garantieavantageplus.ca/admin/claim/331/details (admin sidebar → Claims → "Repair Claims" → open a claim).
3. Click the red **"Change status"** button at the top right. A dropdown lists 9 statuses: Created, Submitted, Pending, Preapproved, Accepted by Dealer, Authorized, Paid, Refused, Cancelled.
4. Click **"Authorized"**. The modal "Change status for claim #331" opens. Note its fields, then press Escape to close it without saving.
5. Repeat steps 3–4 for each of the other eight statuses — **"Refused"**, **"Pending"**, **"Created"**, **"Submitted"**, **"Preapproved"**, **"Accepted by Dealer"**, **"Paid"** and **"Cancelled"** — and note the fields of each form. Do not click Save.

**Expected Result:**
Every Change status form offers a "Notify by email" checkbox and the "Recipient email(s) - separate by commas for multiple recipient" field, whatever status is chosen. AC 1 of AP-2374 reads: "When the user clicks on change status … A checkbox ‘Notify by email’ is available in the form", and names no status.

**Actual Result:**
The forms fall into three groups:

| Status forms | "Notify by email" checkbox | Recipient email(s) field |
|---|---|---|
| **Authorized, Refused** | Present, label "Notify by email", ticked by default | Present, exact label, pre-filled with the contract client's email |
| **Pending** | A different checkbox, labelled **"Notify customer by email"**, unticked by default | Present, same label, pre-filled with the contract client's email |
| **Created, Submitted, Preapproved, Accepted by Dealer, Paid, Cancelled** | Absent | Absent — the form has only "Deductible amount*" and "Note*" |

So 7 of the 9 status forms do not offer the "Notify by email" checkbox the ticket describes, and 6 of them give the admin no way to notify the client of the status change at all.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-SubmittedFormNoNotifyCheckbox_fail.png` — Submitted form: Deductible amount and Note only |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-PaidFormNoNotifyCheckbox_fail.png` — Paid form: Deductible amount and Note only |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-PendingFormNotifyCustomerLabel_fail.png` — Pending form: "Notify customer by email", unticked |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-AuthorizedFormNotifyCheckboxAndRecipients_pass.png` — Authorized form: "Notify by email" ticked and the recipient field, as the ticket describes |
| Screenshot (2026-11-15) | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step5-Nov15-PreapprovedNoRecipientField_pass.png` — claim 333 Preapproved form: Deductible amount and Note only (not uploaded; same symptom) |
| Console log | None captured |

All four 2026-11-01 screenshots were uploaded to AP-2509 (attachments 14122–14125) and embedded in its description. AP-2509 was created 2026-11-01T17:27Z in status Backlog, priority Medium, labels `qa-agent` and `stlc-automated`, assigned to Ken Nguyen (the `bug_new_assign` value at that time), and linked to AP-2374 as *Relates*. No action on it in this run (Gate C, R3).

**Suggested Root Cause:**
Unknown — for dev investigation. The controls look tied to the Authorized and Refused statuses only (and a separate, older control to Pending), rather than added to the shared Change status form.

**Notes:**
- Context, not used as the deciding evidence: on 2025-12-18 Ken Nguyen commented on AP-2374 "I’ve fixed the issue now,it should work for all statuses", after striking through an earlier line that limited the feature to the Authorized status.
- Found while testing AP-2374 (test case AP2374_001).

---

### BUG-002 — Claim status-change emails do not contain "The claim ID … has been updated to status …"

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2374_005 — Each notification email contains the sentence "The claim ID … has been updated to status …" |
| **Requirement** | REQ-004 — message text (AC 4: Message: "The claim ID 48618 has been updated to status {{STATUS}}") |
| **Severity** | Medium — the email still reaches every listed recipient with the decision letter and the claim PDF, but a recipient (especially the notify contact, who may follow many claims) cannot tell from the email which claim changed or to what status without opening the attachment |
| **Priority** | P2 |
| **Environment** | Tested on: Dev (v2dev) — https://v2dev.garantieavantageplus.ca · Chromium (Playwright) · Windows 11 · fix version 3.6.0 · emails read in Yopmail |
| **Tracker Ticket** | [AP-2565](https://garantieavantageplus.atlassian.net/browse/AP-2565) — attachments 14503, 14504 embedded in the description |
| **Status** | Open |
| **First found** | 2026-11-15 (the same symptom was reported earlier as AP-2392, now Done) |
| **Reproducibility** | Always (2 of 2 emails — the Authorized and the Refused email for claim 333, in both inboxes) |

**Summary:**
When an admin changes a claim's status to Authorized or Refused with "Notify by email" ticked, the "Claim updated" email each recipient receives does not contain the sentence "The claim ID <number> has been updated to status <status>"; the claim number appears only in the attachment name `claim-333.pdf`.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/admin/login and sign in with the shared admin account.
2. Open the claim https://v2dev.garantieavantageplus.ca/admin/claim/333/details (claim 333 on contract 26df1-851; client email `client.stage.2374002@yopmail.com`, notify email `client.stage.2374001@yopmail.com`). Any claim whose recipient list holds only a test inbox works the same way.
3. Click the red **"Change status"** button and choose **"Refused"**. In the modal "Change status for claim #333" keep **"Notify by email"** ticked, check that "Recipient email(s) - separate by commas for multiple recipient" holds only `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com`, type `0` in "Deductible amount" and `QA AP2374 Refused` in "Note", and click **"Save"**. The flash "Claim saved" appears.
4. Click **"Change status"** again and choose **"Authorized"**. Keep "Notify by email" ticked, type `0` in "Deductible amount" and `QA AP2374 Authorized` in "Note", and click **"Save"**.
5. Open https://yopmail.com/en/?login=client.stage.2374001 and open each new "Claim updated" email from "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>".
6. Read each email body and look for "The claim ID 333 has been updated to status …".

**Expected Result:**
Each notification email contains the sentence "The claim ID <claim number> has been updated to status <new status>". AC 4 of AP-2374 reads: Message: "The claim ID 48618 has been updated to status {{STATUS}}".

**Actual Result:**
Neither email contains the sentence. On 2026-11-15 the Authorized email (received 10:19:16Z) begins "Hello, Thank you for your claim request. Please find attached the decision and details related to your file. To proceed with the reimbursement …" and the Refused email (received 10:20:08Z) begins "Hello, Following the review of your claim under your Produits Avantage Plus Inc. extended warranty contract, we inform you that the claim has been refused …". The number 333 appears in neither body, only in the attachment name `claim-333.pdf`. The same bodies arrived in both inboxes (2374001 and 2374002).

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-Nov15-AuthorizedBodyNoClaimIdSentence_fail.png` — Authorized email body in inbox 2374001: no claim ID / status sentence |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-Nov15-RefusedBodyNoClaimIdSentence_fail.png` — Refused email body in inbox 2374001: no claim ID / status sentence |
| Full email bodies | Execution log 2026-11-15 → AP2374_005 steps 2 and 3 (copied word for word) |
| Console log | None captured (email content, no page error) |

**Suggested Root Cause:**
Unknown — for dev investigation. The Authorized and Refused emails use the full decision-letter templates; the status-change sentence from AC 4 is not added to either.

**Notes:**
- Same symptom as AP-2392 (Done), reproduced on Dev 2026-11-15 on claim 333: neither the Authorized (10:19:16Z) nor the Refused (10:20:08Z) email body contains 'The claim ID … has been updated to status …'; the claim number appears only in the attachment name claim-333.pdf.
- AP-2392 is not reopened or moved (Gate C, R3); the new ticket is linked to it and to AP-2374 as *Relates*.
- Q-001 (Accepted): no Story defines which number and status label fill the sentence, so any claim number and status label would be accepted — but the sentence itself is required by AC 4 and is absent.
- Found while testing AP-2374 (test case AP2374_005).

---

## Blocked cases and environment observations (not filed)

| TC ID | Why BLOCKED | Filed? |
|---|---|---|
| AP2374_006 | **Environment fault on Dev:** Dev cannot create `…/uploads/claim_attachments/` — claim attachment upload returns HTTP 500 on the admin form (`POST /admin/claim/333/upload-attachment`) and the Admin API (`POST /api/admin/claim-attachment`: "Unable to create the \"/var/www/dev/releases/79/src/app/uploads/claim_attachments/\" directory."), so the claim's own file could not be put on the email. Setup step, not the step under test. AP2374_006 re-runs once the folder is writable | **No — environment fault, not a FAIL** (Gate C, R3). Named in the s7 comment |

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | AP2374_001, AP2374_005 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — "Notify by email" checkbox on the Change status form | 1 | BUG-001 |
| REQ-002 — Recipient field pre-filled | 1 (same bug — the field is missing on the same 6 forms) | BUG-001 |
| REQ-003 — Email sent to the recipient list | 0 | — |
| REQ-004 — Message text | 1 | BUG-002 |
| REQ-005 — Attachments | 0 (AP2374_006 BLOCKED by the Dev environment) | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Bug Reporter Skill (s5); s7 rows appended by the Ticket Updater after Gate D (R4 round 1)
**Date:** 2026-11-15

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2509 | 2026-11-01: filed. 2026-11-15: no action (Gate C, R3 — already filed) | Backlog (unchanged) | 2026-11-15 |
| BUG-002 | AP-2565 | Filed at s5 (Gate C rule C4, by reviewer): created 2026-11-15T10:34:56Z, type Bug, priority Medium, labels `qa-agent` and `stlc-automated`, assigned to Minh Lưu (`bug_new_assign`), linked *Relates* to AP-2374 and *Relates* to AP-2392 (AP-2392 left Done, not reopened or moved). Description written in the bug description shape via REST v2; 2 screenshots attached (14503, 14504) and embedded — v3 read-back shows 2 resolved `media` nodes and an `orderedList` | Backlog | 2026-11-15T10:35Z |
| BUG-001 | AP-2509 | s7 (Gate D rule §3.1, by reviewer — R4 round 1): no tracker action. Jira read-back 2026-11-15T10:41Z: Backlog, Medium, now assigned to **Minh Lưu** (re-assigned outside this run; this report earlier named Ken Nguyen) | Backlog (unchanged) | 2026-11-15T10:41Z |
| BUG-002 | AP-2565 | s7 (Gate D rule §3.1, by reviewer — R4 round 1): no tracker action. Read back: Backlog, Medium, Minh Lưu | Backlog (unchanged) | 2026-11-15T10:41Z |
| — | AP-2374 | s7: story result comment 19586 posted via REST v2 (wiki markup, R4-approved text) and read back (v2 body identical, 16 lines; v3 heading + bullet lists). No status move (pass rate 73% < 90%); assignee unchanged | QC (unchanged), Ken Nguyen | 2026-11-15T10:41Z |

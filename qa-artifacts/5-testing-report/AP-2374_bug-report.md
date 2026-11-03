# Bug Report

**Project:** Avantage Plus (AP) — AP-2374 *Status Change email notification: Add notify email and client email*
**Report ID:** BR-20261101-001
**Test Cycle:** Run folder 3.6.0 (fix version) — AP-2374 execution of 2026-11-01
**Date:** 2026-11-01
**Reported by:** QA Agent — Bug Reporter Skill (inside stlc-ticket-pipeline, `AP-2374 --from s5`)
**Source:** `qa-artifacts/3-test-cases/AP2374_TestCases_001-005.md`, `AP2374_TestCases_006-010.md` — execution log `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-01.md`
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca, chosen by the user for this run

| Metric | Value |
|---|:---:|
| Total defects | 1 |
| Critical | 0 |
| High | 0 |
| Medium | 1 |
| Low | 0 |
| Tracker tickets created | 1 |

The run had 1 FAIL (AP2374_001) and 5 BLOCKED cases. Gate C (review R3) sent the FAIL to
rule C4, **file new**: the open-bug search found no ticket naming the Change status form.
None of the BLOCKED cases is a product defect on its own — see *Blocked cases and
environment observations* below.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2374_001 | "Notify by email" checkbox and recipient field appear only on the Authorized and Refused Change status forms | Medium | P2 | AP-2509 | Open |

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
| **Status** | Open |
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
| Console log | None captured |

All four screenshots were uploaded to AP-2509 (attachments 14122–14125) and embedded in its description; the v3 read-back shows 4 resolved `media` nodes. AP-2509 was created 2026-11-01T17:27Z in status Backlog, priority Medium, labels `qa-agent` and `stlc-automated`, assigned to Ken Nguyen (`bug_new_assign`), and linked to AP-2374 as *Relates*.

**Suggested Root Cause:**
Unknown — for dev investigation. The controls look tied to the Authorized and Refused statuses only (and a separate, older control to Pending), rather than added to the shared Change status form.

**Notes:**
- Context, not used as the deciding evidence: on 2025-12-18 Ken Nguyen commented on AP-2374 "I’ve fixed the issue now,it should work for all statuses", after striking through an earlier line that limited the feature to the Authorized status.
- Found while testing AP-2374 (test case AP2374_001). Full record: `qa-artifacts/5-testing-report/AP-2374_bug-report.md`.

---

## Blocked cases and environment observations (not filed)

| TC ID | Why BLOCKED | Filed? |
|---|---|---|
| AP2374_002, 003, 004 | **Q-010** — no claim form on Dev (dealer "File a claim" or admin claim form) has a notify-email input, so the recipient list only ever holds the contract client's email. The client-email half works (inbox `client.stage.931` received the Refused and Authorized emails). Parked by review R3 until the author says where notify_email is set | No — an open question, not a defect |
| AP2374_005 | **Q-001** (Blocking, posted in comment 19433, unanswered) — the expected message text is not settled | No |
| AP2374_006 | **Environment observation:** admin claim → **Add attachment** (`/admin/claim/331/upload-attachment`, PNG file, type "Other" then "Work order") returned **HTTP 500** on 2 of 2 tries, so the claim's own file could not be put on the email. Out of AP-2374's scope (it is claim attachment upload, a setup step) | **No — out of scope, recorded only** |

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 1 | AP2374_001 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — "Notify by email" checkbox on the Change status form | 1 | BUG-001 |
| REQ-002 — Recipient field pre-filled | 1 (same bug — the field is missing on the same 6 forms) | BUG-001 |
| REQ-003 — Email sent to the recipient list | 0 | — |
| REQ-004 — Message text | 0 | — |
| REQ-005 — Attachments | 0 | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2509 | No action at s7 — new bug in Backlog, not in the QA status (Gate D §3.2). Listed in the AP-2374 result comment 19445 | Backlog (unchanged) | 2026-11-01T17:32Z |
| — | AP-2374 | Story result comment 19445 posted and read back (11 table rows, mention of Ken Nguyen for Q-010). Status not moved: pass rate 40% (needs 90%); Q-001 and Q-010 Blocking + Open | QC (unchanged), assignee Ken Nguyen (unchanged) | 2026-11-01T17:32Z |

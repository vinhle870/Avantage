# Execution Log — AP-2374 (Status Change email notification: Add notify email and client email)

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (inside stlc-ticket-pipeline, `--from s4 --until s4c`)
**Date:** 2026-11-01
**Environment:** Dev (v2dev) — chosen by the user for this run. The test-case files' Execution Context still names Staging (v2staging); the user's decision overrides it, and v2staging was never opened.
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-01T16:58:14Z → 2026-11-01T17:13:30Z
**Login:** the shared Admin/Dealer account from the `env` source (`execute.env.md` → Dev Environment). No credential is copied into this log.
**Run folder:** 3.6.0 · **Test-case files:** `AP2374_TestCases_001-005.md`, `AP2374_TestCases_006-010.md`
**env-check source:** `missing` in the knowledge registry; the orchestrator's environment health check had already passed before this run, so it was not repeated.

| Metric | Value |
|---|:---:|
| Total test cases | 10 |
| Passed | 4 |
| Failed | 1 |
| Blocked | 5 |
| Skipped | 0 |
| **Pass rate** | **40% (4 of 10)** |

### Test data used (all created in this run)

| Item | Value | How it was made |
|---|---|---|
| Vehicle | **915** on dev — VIN `1FAHP35NX8W239204`, Ford Focus 2008, 5000 km, COMMERCIAL. The dev vehicle with the test-data VIN exists and has the same id as on staging | Standing data, found at `/vehicle/915/details` |
| Recipient inbox {N} (claim notify email) | `client.stage.930@yopmail.com` — empty before the run, still empty after it | Never reachable: no claim form on dev has a notify-email field (see Q-010 below) |
| Recipient inbox {N+1} (contract client email) | `client.stage.931@yopmail.com` — empty before the run | Client email of quote 6454 |
| Quote | **6454** — Marie Tremblay, vehicle 915 | `/vehicle/915/details` → Create quote → `/quote/new/client?fromVehicleId=915` → Save |
| Warranty | Program "Automation Test Program" (program 26), option "default 1", term 20m/20000km, sale price 500 | Quote details → "+" next to Extended warranty → modal → Save (the only program offered for vehicle 915 on dev) |
| Warranty contract | **26df1-844** (dealer `/warranty/844`, admin `/admin/warranty/844`), status Pending approval, invoice **#937** ($1000.00) | Extended warranty row ⋯ → **Generate Contract** → `/quote/6454/warranty/generate-contract` → Save. **This is the step that makes the contract selectable for a claim** — no separate Sales contract stage was needed |
| Claim A | **331** — on contract 26df1-844, no notify email, no attachment (upload failed) | Dealer `/warranty/844` → **File a claim** (modal `/claim/new/edit?warranty=844`) → Save |
| Claim B | **332** — on contract 26df1-844, no notify email, no attachment | Same route |
| Unused quote | **6455** — Marie Tremblay on vehicle 1061 (Fiat 500 2015). Created while the standalone `/quote/{id}/warranty/edit` page showed no programs; abandoned once the quote-details modal showed a program for vehicle 915. No warranty or contract on it | `/quote/new/client?fromVehicleId=1061` |

### Two setup facts that shaped every result

1. **The claim's notify email cannot be set anywhere in the UI on dev (Q-010).** Neither the dealer "File a claim" form nor the admin claim form (`/admin/claim/new/edit`, `/admin/claim/{id}/edit`) has a notify-email field; no claim page mentions "notify". Every Change status form therefore pre-fills **only the contract client's email**. A scan of the Change status form (Authorized) of 29 existing dev claims found a single address in every one. Every step that needs the claim's notify email in the recipient list is BLOCKED by Q-010, as the test-case files direct ("If the notify email cannot be set on any claim form, the affected step is BLOCKED by Q-010, not FAIL").
2. **A claim attachment cannot be uploaded on dev.** Admin claim → **Add attachment** (`/admin/claim/331/upload-attachment`, type "Other", then "Work order", file `AP2374-attachment.png`) returned **HTTP 500** twice — once from the modal, once from the stand-alone page. The dealer-side "Upload work order" accepts PDF files only. So `AP2374-attachment.png` is on no claim, and the attachment check of AP2374_006 is BLOCKED.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2374_001 | Change status shows "Notify by email" and "Recipient email(s)" | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-SubmittedFormNoNotifyCheckbox_fail.png` | Checkbox only on Authorized and Refused; absent on 6 of 9 status forms |
| AP2374_002 | Recipient field pre-filled with notify email + client email | High | 🚫 | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step4-RecipientFieldOnlyClientEmail_blocked.png` | Q-010: notify email cannot be set; field shows client email only |
| AP2374_003 | Status change with notify ticked emails both recipients | High | 🚫 | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Inbox931RefusedEmail_blocked.png` | Q-010; the one pre-filled recipient (931) did receive the email |
| AP2374_004 | Second status change also emails both recipients | High | 🚫 | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Inbox931SecondEmailAuthorized_blocked.png` | Q-010; second email (Authorized) reached 931 |
| AP2374_005 | Email states claim ID and new status in the ticket's wording | Medium | 🚫 | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-EmailBodyNoClaimIdSentence_blocked.png` | Q-001 unanswered; body recorded — no "claim ID … updated to status" sentence |
| AP2374_006 | Email carries the claim's file and a PDF of the claim | High | 🚫 | 2 | 0 | — | Attachment upload HTTP 500 (2/2); email carries only claim-331.pdf |
| AP2374_007 | Unticked "Notify by email" — status saved, email recorded | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_007-step5-Inbox931NoEmailAfterUntickedSubmit_pass.png` | Refused saved; no email arrived (Q-007 recorded) |
| AP2374_008 | Claim with no notify email still lists the client email | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_008-step4-NoNotifyEmailClaimRecipientClientOnly_pass.png` | Field = client email only, no stray comma (Q-003 recorded) |
| AP2374_009 | Invalid / emptied recipient list — no error, no email | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_009-step5-Inbox931NoEmailFromInvalidOrEmptyList_pass.png` | Both submits saved without validation; no email (Q-004 recorded) |
| AP2374_010 | Claim with no attachments still sends the email | Low | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_010-step5-Claim332EmailOnlyClaimPdf_pass.png` | Email arrived with claim-332.pdf only (read in 931 — see caveat) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

Times are UTC. The application shows Eastern time (12:08 PM = 17:08Z); Yopmail shows the browser's local time (UTC+7, so "0:08" on 2 Nov = 17:08Z on 1 Nov).

### AP2374_001 — Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Prepare the run's quote, contract and claim from vehicle 915 with notify email 930, client email 931 and `AP2374-attachment.png` | Contract and claim saved without an error page; claim lists the attachment | Quote 6454 saved (URL `/quote/6454/details`); flash "Warranty saved"; Generate Contract → flash "Invoice #937 ($1000.00) is created", contract `26df1-844`; claim saved, URL = `/claim/331/details`. Notify-email field present = false on every claim form. Add attachment → page HTTP 500 "Erreur Désolé…", 2 of 2 tries; Attachments panel = "No entities found" | ✅ | Claim and contract exist. The notify email (Q-010) and the attachment (HTTP 500) could not be added; neither is needed by this case's check in step 4 |
| 2 `[Pre-Condition]` | Log in at `/admin/login`, open the admin Claims section and the claim | Admin claim details page for claim 331 opens | URL = `/admin/claim/331/details`; heading "Claim details"; "Claim # 331"; status "Created" | ✅ | Admin sidebar Claims → "Repair Claims" `/admin/claims` lists claims; the claim is reached at `/admin/claim/{id}/details` |
| 3 | Click the change-status control (record label) | A status-change form opens without an error page | Control = button **"Change status"**; it opens a dropdown of 9 statuses (Created, Submitted, Pending, Preapproved, Accepted by Dealer, Authorized, Paid, Refused, Cancelled); choosing one opens modal "Change status for claim #331" with no error | ✅ | The form depends on the status picked first |
| 4 `[Verification]` | Verify "Notify by email" checkbox and "Recipient email(s) - separate by commas for multiple recipient" field; record default state; close without submitting | Both controls present (AC 1, AC 2); a missing control is a FAIL | **Authorized** and **Refused** forms: checkbox "Notify by email" visible = true, checked = true by default; field label = "Recipient email(s) - separate by commas for multiple recipient" (exact). **Pending** form: checkbox labelled "Notify customer by email", checked = false; same recipient field. **Created, Submitted, Preapproved, Accepted by Dealer, Paid, Cancelled** forms: fields = "Deductible amount*", "Note*" only — checkbox present = false, recipient field present = false (Submitted form shown in the fail screenshot) | ❌ | AC 1 says the checkbox is available when "the user clicks on change status", with no status limit; Ken Nguyen's comment of 2025-12-18 says "it should work for all statuses". 6 of 9 status forms have neither control. Consequence: an admin moving a claim to Submitted, Paid, Cancelled etc. cannot notify the client at all |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step1-AttachmentUploadHttp500_fail.png` — Add attachment on claim 331 returned the HTTP 500 error page (first try, from the modal)
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step1-AttachmentUploadRetryHttp500_fail.png` — the retry from the stand-alone upload page, same HTTP 500
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-SubmittedFormNoNotifyCheckbox_fail.png` — "Change status for claim #331" with status Submitted: only Deductible amount and Note
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-AuthorizedFormNotifyCheckboxAndRecipients_pass.png` — the Authorized form with "Notify by email" ticked and the recipient field holding `client.stage.931@yopmail.com`
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-PendingFormNotifyCustomerLabel_fail.png` — added at s5 (2026-11-01T17:25Z, review R3 F-4): Pending form with the different label "Notify customer by email", unticked; opened and closed without saving
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-PaidFormNoNotifyCheckbox_fail.png` — added at s5 (2026-11-01T17:25Z, review R3 F-4): Paid form with Deductible amount and Note only; closed without saving

### AP2374_002 — The recipient field is pre-filled with the claim's notify email and the client's email, separated by a comma — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Prepare the run's claim (reused claim 331) with notify email 930 | Claim saved with an ID | Claim 331 exists; notify-email input present = false on dealer and admin claim forms | 🚫 | Q-010: there is no place to set the claim's notify email on dev |
| 2 `[Pre-Condition]` | Open the claim in the admin; record where the notify email is shown | Admin claim details page opens | URL = `/admin/claim/331/details`; the page shows the Client card with `client.stage.931@yopmail.com`; text "notify" present anywhere on the page = false | ✅ | Q-010 recorded: the notify email is shown nowhere |
| 3 | Click the change-status control | The form opens with the recipient field | "Change status" → Authorized → modal with field "Recipient email(s) - separate by commas for multiple recipient" | ✅ | — |
| 4 `[Verification]` | Read the full field value; close without submitting | Exactly two addresses, 930 and 931, comma-separated | Field value = `"client.stage.931@yopmail.com"` — one address, no comma, no leading or trailing space | ✅ | The client-email half of AC 2 is pre-filled correctly; the notify-email half cannot be tested |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step4-RecipientFieldOnlyClientEmail_blocked.png` — recipient field holding only the contract client's address

### AP2374_003 — Changing a claim's status with "Notify by email" ticked delivers an email to both pre-filled recipients — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Prepare the run's claim (reused claim 331); record status | Claim saved with an ID | Claim 331, status "Created" | 🚫 | Notify email not settable (Q-010) |
| 2 `[Pre-Condition]` | Open Change status; confirm the field holds only this run's addresses | Form opens; only `client.stage` addresses | Change status → **Refused**; field = `client.stage.931@yopmail.com` only | ✅ | Safety rule met |
| 3 | Select a different status, tick "Notify by email", leave recipients, submit; record button and time | Form closes without an error; claim shows the new status | Status = Refused; checkbox checked = true (default); Deductible amount = 0; Note filled; button "Save" pressed at 17:08:33Z; flash "Claim saved"; status badge "Refused 11/1/26, 12:08 PM" | ✅ | — |
| 4 | Open both inboxes, refresh up to 2 minutes | Each inbox shows a new email after 17:08:33Z | `client.stage.931`: 1 email at 17:08:37Z. `client.stage.930`: 0 emails | ✅ | 930 was never in the list, so no email was expected there |
| 5 `[Verification]` | Verify both inboxes got a new email; record sender, subject, time, count | Both 930 and 931 received the email | 931: count = 1; sender = "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>"; subject = "Claim updated"; received 17:08:37Z; attachment = `claim-331.pdf`. 930: count = 0 | ✅ | Sending to the pre-filled list works for the client address. "Both recipients" cannot be judged — Q-010 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Inbox931RefusedEmail_blocked.png` — inbox 931 with the "Claim updated" email for the Refused change, attachment claim-331.pdf

### AP2374_004 — A second status change to a different status also emails both recipients — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse the run's claim; record status | Claim exists | Claim 331, status "Refused" | 🚫 | Notify email not settable (Q-010) |
| 2 `[Pre-Condition]` | Open Change status; confirm only this run's addresses | Form opens with the run's addresses | Change status → **Authorized**; field = `client.stage.931@yopmail.com` only | ✅ | Authorized chosen per Test Data (not used in AP2374_003) |
| 3 | Select Authorized, tick, submit; record time | Form closes; claim shows the new status | Checkbox checked = true; Save at 17:09:24Z; flash "Claim saved"; badge "Authorized 11/1/26, 12:09 PM Authorized by: Le 1 Vinh" | ✅ | — |
| 4 | Open both inboxes, refresh up to 2 minutes | New email in each inbox | 931: second email at 17:09:25Z (count 2). 930: 0 | ✅ | — |
| 5 `[Verification]` | Verify both inboxes hold a second, separate email; record status wording | Both recipients got a second email | 931: new email "Claim updated" 17:09:25Z, attachment `claim-331.pdf`, separate from the 17:08:37Z one. Status wording: the body does not name a status; it reads "Thank you for your claim request. Please find attached the decision and details related to your file. To proceed with the reimbursement – Once the repair has been authorized and completed, …". 930: none | ✅ | A different status (Authorized) also sent an email. "Both recipients" cannot be judged — Q-010 |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Inbox931SecondEmailAuthorized_blocked.png` — inbox 931 with two "Claim updated" emails, the Authorized one open

### AP2374_005 — The notification email states the claim's ID and its new status in the ticket's message wording — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse the run's claim | Claim exists | Claim 331 | ✅ | — |
| 2 `[Pre-Condition]` | An email for this claim must exist | Email in the notify-email inbox | Emails exist only in 931 (client email); 930 cannot be reached (Q-010) | ✅ | The 931 emails were read instead |
| 3 | Open the newest notification email | Body displayed | Both 931 emails opened (Refused 17:08:37Z, Authorized 17:09:25Z) | ✅ | — |
| 4 `[Verification]` | Copy the body; record whether "The claim ID … has been updated to status …" is present, and what else is in the body | Not known — Q-001; objective faults only | Sentence "The claim ID … has been updated to status …" present = false in both. Claim ID "331" in body = false (only in the attachment name). **Refused body:** "Hello, Following the review of your claim under your Produits Avantage Plus Inc. extended warranty contract, we inform you that the claim has been refused in accordance with the terms and conditions of the contract. For further clarification regarding this decision, please contact our Claims Department at 1- 866-666-0181 or by email at info@garantieavantageplus.ca Sincerely, Claims Department Produits Avantage Plus inc." + address footer. **Authorized body:** "Hello, Thank you for your claim request. Please find attached the decision and details related to your file. To proceed with the reimbursement – Once the repair has been authorized and completed, please send all the following documents to: payables@garantieavantageplus.ca …" (reimbursement document lists), "Kind regards, Claims Department". No error page | 🚫 | Stays BLOCKED by Q-001 (comment 19433, no answer as of 16:58Z). Observation for the author: the AP-2392 symptom (no "claim ID … updated to status" message) is present on dev |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-EmailBodyNoClaimIdSentence_blocked.png` — full page of the Authorized email body

### AP2374_006 — The notification email carries the claim's attached file and a PDF of this claim's details page — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse the run's claim with `AP2374-attachment.png` attached | Claim lists the attachment | Claim 331 Attachments = "No entities found"; Add attachment → HTTP 500 twice | 🚫 | The file the case checks for cannot be put on the claim |
| 2 `[Pre-Condition]` | An email for the claim must exist | Email present | Two emails in 931 (17:08:37Z, 17:09:25Z) | ✅ | Read in 931; 930 unreachable (Q-010) |
| 3 | List every attachment | Attachment list visible | Each email: one attachment, `claim-331.pdf` | ✅ | — |
| 4 | Open the PDF | PDF opens and is readable | `claim-331.pdf` downloaded: HTTP 200, `Content-Disposition: attachment; filename="claim-331.pdf"`, 39,299 bytes, valid PDF 1.4 made by wkhtmltopdf, created 2026-11-01T17:09:22Z | — | Not judged: the case is BLOCKED at step 1 |
| 5 `[Verification]` | Verify `AP2374-attachment.png` and a PDF are attached; PDF shows claim 331 | Both attached | Not run as a verdict: the PNG could not be attached to the claim. Recorded: a PDF of the claim is attached and named after claim 331 | — | BLOCKED by the HTTP 500 on claim attachment upload; Q-009 layout not recorded |

**Screenshots:** none (the BLOCKED cause is shown in the two AP2374_001 step 1 screenshots).

### AP2374_007 — Changing a claim's status with "Notify by email" left unticked saves the status — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse the run's claim | Claim exists | Claim 331, status "Authorized" | ✅ | Notify email not settable, not needed here |
| 2 `[Pre-Condition]` | Open Change status; record inbox counts | Form opens; counts recorded | Change status → **Refused**; inbox counts before: 931 = 2, 930 = 0 | ✅ | — |
| 3 | Select Refused, untick "Notify by email", submit; record time | Form closes; claim shows the new status | Checkbox checked = false (verified before Save); Save at 17:10:19Z; flash "Claim saved"; badge "Refused 11/1/26, 12:10 PM" | ✅ | — |
| 4 | Wait 2 minutes, refresh both inboxes | Inboxes displayed | Checked 17:12:31Z and 17:13:29Z | ✅ | — |
| 5 `[Verification]` | Verify the new status; record whether an email arrived (Q-007) | Status saved, no error | Status = Refused; no error page. New email for claim 331 after 17:10:19Z = none in 931 (emails at 0:08, 0:09 for 331 and 0:11 for claim 332 only); 930 = 0 | ✅ | Q-007 recorded: an unticked box sends no email |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_007-step5-ClaimRefusedSavedNoNotify_pass.png` — claim 331 after the unticked submit: "Claim saved", status Refused
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_007-step5-Inbox931NoEmailAfterUntickedSubmit_pass.png` — inbox 931 at 17:12Z: three emails (0:08, 0:09, 0:11), none for the 17:10Z submit

### AP2374_008 — A claim with no notify email opens Change status without an error and still lists the client's email — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create a second claim on the contract with no notify email, no attachment | Saved with its own ID | Claim **332** saved, URL `/claim/332/details` | ✅ | Every claim on dev has no notify email (Q-010) |
| 2 `[Pre-Condition]` | Open it in the admin | Details page opens | `/admin/claim/332/details`, status Created | ✅ | — |
| 3 | Click the change-status control | Form opens without error | Change status → Authorized → modal "Change status for claim #332" | ✅ | — |
| 4 `[Verification]` | Record the exact field value (Q-003); close | Field contains 931 and no foreign address | Field value = `"client.stage.931@yopmail.com"`; leading/trailing comma = none; spaces = none; "Notify by email" checked = true | ✅ | Q-003 recorded: an empty notify email adds no stray comma |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_008-step4-NoNotifyEmailClaimRecipientClientOnly_pass.png` — claim 332 Authorized form with only the client's address

### AP2374_009 — An invalid or emptied recipient list with "Notify by email" ticked causes no error page and emails no one outside the list — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Reuse the run's claim; record status and inbox counts | Claim exists | Claim 331, status Refused; 931 = 2, 930 = 0 | ✅ | — |
| 2 `[Pre-Condition]` | Open the claim in the admin | Details page opens | `/admin/claim/331/details` | ✅ | — |
| 3 | Authorized, tick, recipient = `not-an-email`, submit | No error page / 5xx; record behaviour | Field editable = true; Save at 17:11:05Z; modal closed; flash "Claim saved"; badge "Authorized 11/1/26, 12:11 PM"; validation message = none | ✅ | Q-004 recorded: an invalid address is accepted silently |
| 4 | Refused, tick, clear the field, submit | No error page / 5xx; record behaviour | Save at 17:11:24Z; flash "Claim saved"; badge "Refused 11/1/26, 12:11 PM"; validation message = none | ✅ | Q-004 recorded: an empty list is accepted silently |
| 5 `[Verification]` | After 2 minutes verify neither inbox got an email from these submits | No new email in either inbox; no error page | Checked 17:13:29Z: 931 count = 3 — 0:08 and 0:09 (claim 331, earlier cases) and 0:11 at 17:11:45Z carrying `claim-332.pdf` (AP2374_010). No email for claim 331 after 17:11:05Z. 930 = 0. Final status of claim 331 = Refused | ✅ | Nobody outside the submitted list was emailed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_009-step5-Inbox931NoEmailFromInvalidOrEmptyList_pass.png` — inbox 931 after the two submits: no claim-331 email after 0:09

### AP2374_010 — A claim with no attached files still sends the notification email — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Claim on the contract with notify email 930 and no attachment | Saved with no attachments | Claim 332 (from AP2374_008): Attachments = "No entities found"; notify email not settable (Q-010) | ✅ | Deviation: the pre-filled list holds 931, not 930 |
| 2 `[Pre-Condition]` | Open Change status; confirm only this run's addresses | Form opens | Authorized form; field = `client.stage.931@yopmail.com` | ✅ | Safety rule met |
| 3 | Different status, tick, leave recipients, submit; record time | Form closes; new status shown | Save at 17:11:44Z; flash "Claim saved"; badge "Authorized 11/1/26, 12:11 PM" | ✅ | — |
| 4 | Open the inbox and the new email | New email displayed | Read in **931** (the address the form actually held): new "Claim updated" email at 17:11:45Z | ✅ | 930 cannot be on the list (Q-010) |
| 5 `[Verification]` | Verify the email arrived; list attachments (Q-008) | Email received; `AP2374-attachment.png` not among attachments | Received = true; attachments = `claim-332.pdf` only; `AP2374-attachment.png` present = false | ✅ | Q-008 recorded: a claim with no files sends only the claim PDF. Caveat: the PNG was never on any claim (upload HTTP 500), so the "no foreign file" check is weak |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_010-step5-Claim332EmailOnlyClaimPdf_pass.png` — inbox 931 with the claim-332 email open, attachment claim-332.pdf

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2374_002 | 🚫 | Q-010: no claim form on dev has a notify-email field, so the claim's notify email can never be pre-filled. The field shows the client's email only. Needs the author to say where notify_email is set (or a build that exposes it) |
| AP2374_003 | 🚫 | Q-010: only one of the two recipients can be on the list. The email did reach that one (931) |
| AP2374_004 | 🚫 | Q-010: as AP2374_003; the second change (Authorized) also reached 931 |
| AP2374_005 | 🚫 | Q-001 (Blocking) unanswered on AP-2374 (comment 19433 has no reply). Body recorded above |
| AP2374_006 | 🚫 | Claim attachment upload returns HTTP 500 on dev (admin Add attachment, 2 of 2 tries), so the claim's own file cannot be on the email. Must be fixed or the attachment seeded before this case can run |

---

## Environment Observations

- **Environment was Dev (v2dev) by the user's decision.** The test-case files' Execution Context names Staging; the run did not open v2staging.
- **Admin claim attachment upload returns HTTP 500 on dev** (`POST /admin/claim/331/upload-attachment`, PNG file, types "Other" and "Work order", 2 of 2). This is outside the steps under test (it is setup), so no test case is FAILED for it, but it blocks AC 5 testing and is worth a look at s5.
- **The warranty program list only appears in the modal.** Opening `/quote/{id}/warranty/edit` as a page shows "Choose one of the available program." with an empty list; the same form opened from the quote-details "+" button (modal) lists the eligible programs. For vehicle 915 that is one program, "Automation Test Program" (20m/20000km).
- **Generate Contract** showed the warning "The delivery date has passed the acceptable timeframe. Please update the delivery data and the warranty start date" with delivery date 2026-11-01, yet saved and created the contract.
- The dealer Claims list (`/claims`) has no create action; claims are filed from a warranty contract's page ("File a claim").
- Language: admin and dealer pages rendered in English; the emails are in English.
- Locale and account settings were not changed.

---

## Re-run after correction

Not applicable — Gate C has made no "Not a bug" (C1) decision in this run, so `s4c` was skipped.

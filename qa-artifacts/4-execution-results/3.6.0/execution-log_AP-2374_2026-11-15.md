# Execution Log — AP-2374 (Status Change email notification: Add notify email and client email)

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stlc-worker inside stlc-ticket-pipeline, `--from execute --until correct-cases`, batch qa-agent 2026-11-15)
**Date:** 2026-11-15
**Environment:** Dev (v2dev) — `execution_env: Dev` in `qa-config/tools.md`
**Base URL:** https://v2dev.garantieavantageplus.ca
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800
**Duration:** 2026-11-15T10:15:08Z → 2026-11-15T10:24:22Z
**Login:** the shared Admin/Dealer account from the `env` source (`execute.env.md` → Dev Environment), typed only into the login forms. No credential is copied into this log.
**Admin API key:** `AVP_ADMIN_API_KEY` from `/.env`, read by name inside a helper script; its value was never printed or saved.
**Run folder:** 3.6.0 · **Test-case files:** `AP2374_TestCases_001-005.md`, `AP2374_TestCases_006-010.md`, `AP2374_TestCases_011-011.md`
**Scope of this run (Gate B, rule B2, by reviewer — R2 round 2):** execute AP2374_002–006 and AP2374_011. AP2374_001 (FAIL, AP-2509) and AP2374_007–010 (PASS) keep their results from [execution-log_AP-2374_2026-11-01.md](execution-log_AP-2374_2026-11-01.md); they were not re-run.
**env-check source:** `missing` in the knowledge registry; the orchestrator's environment health check passed before this run.

| Metric | Value |
|---|:---:|
| Total test cases | 11 |
| Executed this run | 6 (AP2374_002–006, AP2374_011) |
| Carried forward from 2026-11-01 | 5 (AP2374_001, AP2374_007–010) |
| Passed | 8 |
| Failed | 2 |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **73% (8 of 11)** |

### Test data used

| Item | Value | How it was made |
|---|---|---|
| Vehicle | **915** — VIN `1FAHP35NX8W239204`, Ford Focus 2008 (standing data) | Found at `/vehicle/915/details` |
| Notify inbox | `client.stage.2374001@yopmail.com` — empty before the run (0 mail at 10:15Z) | Reserved for AP-2374 |
| Client inbox | `client.stage.2374002@yopmail.com` — empty before the run (0 mail at 10:15Z) | Reserved for AP-2374 |
| Quote | **6708** — Marie Tremblay AP2374, client email `client.stage.2374002@yopmail.com`, vehicle 915 | `/quote/new/client?fromVehicleId=915` → Save (10:15:55Z) |
| Warranty | "Automation Test Program" (program 26), option "default 1", 20m/20000km, sale price 500 | Quote details "+" → modal → Save, flash "Warranty saved" |
| Warranty contract | **26df1-851** (dealer `/warranty/851`), invoice **#955** ($1000.00), financing company "Avantage Plus Testing" | Extended warranty row ⋯ → Generate Contract → `/quote/6708/warranty/generate-contract` → Generate Contract (10:16:48Z). The first submit was refused with "Financing company: This value should not be blank."; the field was filled and the second submit succeeded |
| Claim | **333** on contract 26df1-851 — notify email `client.stage.2374001@yopmail.com`, created by the Admin API, status **Submitted** on creation, "created by User Machine" | `POST /api/admin/claim` (see AP2374_002 step 2) |
| Attachment | `AP2374-attachment.png` (PNG, 53,853 bytes) — **not** attached: both routes returned HTTP 500 | AP2374_006 step 2 |

Final state of claim 333: **Authorized** (5 status changes: Submitted on create, Authorized 10:19Z, Refused 10:20Z, Authorized 10:22Z — plus no attachment).

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2374_001 | Change status shows "Notify by email" and "Recipient email(s)" | High | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-SubmittedFormNoNotifyCheckbox_fail.png` | Carried from 2026-11-01 (not re-run): controls only on Authorized/Refused — AP-2509 |
| AP2374_002 | Notify email + client email pre-filled, comma-separated, on more than one status | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step5-Nov15-AuthorizedRecipientsBothAddresses_pass.png` | Authorized and Refused hold both addresses; Preapproved has no field (AP-2509) |
| AP2374_003 | Authorizing with "Notify by email" ticked emails both addresses | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Nov15-Inbox2374001AuthorizedEmail_pass.png` | Both inboxes got "Claim updated" with claim-333.pdf at 10:19:16Z |
| AP2374_004 | Refusing with "Notify by email" ticked also emails both addresses | High | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Nov15-Inbox2374001RefusedEmail_pass.png` | Both inboxes got a second, separate email at 10:20:08Z |
| AP2374_005 | Each email contains "The claim ID … has been updated to status …" | Medium | ❌ | 3 | 1 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-Nov15-AuthorizedBodyNoClaimIdSentence_fail.png` | Sentence absent from both the Authorized and the Refused body |
| AP2374_006 | Email carries the claim's file and the claim PDF (AP-2387) | High | 🚫 | 1 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_006-step2-Nov15-AdminAddAttachmentHttp500_blocked.png` | Attachment upload HTTP 500 on admin form and Admin API |
| AP2374_007 | Unticked "Notify by email" saves and sends no email | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_007-step5-Inbox931NoEmailAfterUntickedSubmit_pass.png` | Carried from 2026-11-01 (not re-run) |
| AP2374_008 | No notify email → client email alone, no stray comma | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_008-step4-NoNotifyEmailClaimRecipientClientOnly_pass.png` | Carried from 2026-11-01 (not re-run) |
| AP2374_009 | Invalid or emptied list saves and emails no one | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_009-step5-Inbox931NoEmailFromInvalidOrEmptyList_pass.png` | Carried from 2026-11-01 (not re-run) |
| AP2374_010 | Claim with no files sends the email with only the claim PDF | Low | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_010-step5-Claim332EmailOnlyClaimPdf_pass.png` | Carried from 2026-11-01 (not re-run) |
| AP2374_011 | Notify address removed from the list before Authorizing → only the client is emailed | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_011-step5-Nov15-Inbox2374001NoEmailAfterRemoval_pass.png` | 2374002 emailed at 10:22:25Z; 2374001 nothing after 10:22:12Z (checked 10:24:22Z) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

Times are UTC. The admin pages show Eastern time (5:19 AM = 10:19Z); Yopmail shows the browser's local time (UTC+7, so 17:19 = 10:19Z).

### AP2374_001 — Carried forward

Not re-run on 2026-11-15. Result **FAIL** from 2026-11-01, step 4: the "Notify by email" checkbox and the recipient field exist only on the Authorized and Refused forms; the Pending form says "Notify customer by email"; Created, Submitted, Preapproved, Accepted by Dealer, Paid and Cancelled have neither. Filed as **AP-2509**. Full step table and screenshots: [execution-log_AP-2374_2026-11-01.md](execution-log_AP-2374_2026-11-01.md) → AP2374_001. This run saw the same thing again on claim 333: the Preapproved form had only Deductible amount and Note (AP2374_002 step 4).

### AP2374_002 — A claim with a notify email pre-fills Change status with both addresses, separated by a comma, on more than one status — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Create the run's quote and contract from vehicle 915 with client email `client.stage.2374002@yopmail.com` | Flash "Invoice #… is created"; contract number shown; no error page | Quote 6708 saved (`/quote/6708/details`); flash "Warranty saved"; Generate Contract → flash "Invoice #955 ($1000.00) is created"; Extended warranty row shows contract link `26df1-851` (`/warranty/851`) | ✅ | The Generate Contract page also required "Financing company" (first submit refused with "This value should not be blank."); "Avantage Plus Testing" was chosen. The page showed the known warning "The delivery date has passed the acceptable timeframe" and still saved |
| 2 `[Pre-Condition]` | `POST /api/admin/claim` with notifyEmail 2374001; `GET /api/admin/claim/{id}`; open the admin claim page | HTTP 201 with a claimId; GET shows notify email 2374001; admin page shows the contract | First POST (10:16:57Z) without an `items` field → **HTTP 400** `{"success":false,"error":"Invalid items format. Expected JSON array."}`. Second POST (10:17:03Z) with `"items":[]` → **HTTP 201** `{"success":true,"claimId":333,"assignedTo":null,"message":"Claim created successfully"}`. GET `/api/admin/claim/333` (10:17:34Z) → HTTP 200, `notifyEmail` = `client.stage.2374001@yopmail.com`, `contractNumber` = `26df1-851`, `statusCode` = `submitted`. Admin `/admin/claim/333/details`: "Claim # 333", Contract card "Contract #26df1-851", Client card `client.stage.2374002@yopmail.com`, status "Submitted 11/15/26, 5:17 AM" | ✅ | Setup only. The API needs an `items` array even when empty; the case's body omits it. The notify email is stored but not shown anywhere on the admin claim page |
| 3 | Change status → Authorized; read the recipient field; close without saving | Form opens without an error page; value recorded | Modal "Change status for claim #333" opened; "Notify by email" checked = true; "Recipient email(s) - separate by commas for multiple recipient" = `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com` | ✅ | Closed with Escape, nothing saved |
| 4 | Repeat for Refused and Preapproved | Each form opens; value or absence recorded | **Refused:** "Notify by email" checked = true; field = `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com`. **Preapproved** (`status=approved`): fields = "Deductible amount", "Note" only; recipient field present = false | ✅ | No error page on any form |
| 5 `[Verification]` | Compare the values with the Test Data | Authorized and Refused hold exactly 2374001 and 2374002, comma-separated, no other address; Preapproved: same two if present, else "absent — AP-2509" | Authorized and Refused: both addresses, notify email first, then client email, separated by ", " (comma and one space); no other address. Preapproved: absent — AP-2509, judged in AP2374_001 | ✅ | AC 2 met on both forms that have the field. Order and spacing accepted as built (Q-003) |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step5-Nov15-AuthorizedRecipientsBothAddresses_pass.png` — Authorized form for claim 333, recipient field (red outline) holding both addresses
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step5-Nov15-RefusedRecipientsBothAddresses_pass.png` — Refused form, same two addresses
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step5-Nov15-PreapprovedNoRecipientField_pass.png` — Preapproved form with only Deductible amount and Note

### AP2374_003 — Authorizing a claim with "Notify by email" ticked delivers the email to the notify address and the client — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Contract and API claim exist; record status and inbox counts | Status not Authorized; counts recorded | Claim 333, status Submitted; 2374001 = 0 mail, 2374002 = 0 mail | ✅ | — |
| 2 `[Pre-Condition]` | Change status → Authorized; record the recipient value; safety check | "Notify by email" ticked; only the run's two inboxes | Checked = true; value = `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com` | ✅ | Safety rule met |
| 3 | Deductible `0`, Note `QA AP2374_003 Authorized`, Save; record time | Flash "Claim saved"; badge Authorized | Save at ≈10:19:03Z; flash "Claim saved"; status "Authorized 11/15/26, 5:19 AM" | ✅ | — |
| 4 | Open both inboxes, refresh up to 2 minutes | New email in each | 2374001: 1 mail (17:19 local); 2374002: 1 mail (17:19 local) | ✅ | — |
| 5 `[Verification]` | For each listed address, a new email for claim 333 after step 3 | Every listed address received it; sender and subject as accepted (Q-006) | Both inboxes: sender "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>", subject "Claim updated", received 10:19:16Z, attachment `claim-333.pdf`, 1 new email each. Body starts "Hello, Thank you for your claim request. Please find attached the decision and details related to your file." | ✅ | AC 3 met: the notify address and the client both received it |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Nov15-Inbox2374001AuthorizedEmail_pass.png` — notify inbox 2374001 with the Authorized email for claim 333 open
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Nov15-Inbox2374002AuthorizedEmail_pass.png` — client inbox 2374002 with the same email

### AP2374_004 — Refusing the same claim with "Notify by email" ticked also emails both addresses — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Record status and inbox counts | Status not Refused | Claim 333, status Authorized; 2374001 = 1, 2374002 = 1 | ✅ | — |
| 2 `[Pre-Condition]` | Change status → Refused; record value; safety check | Ticked; only the run's inboxes | Checked = true; value = `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com` | ✅ | Safety rule met |
| 3 | Deductible `0`, Note `QA AP2374_004 Refused`, Save; record time | Flash "Claim saved"; badge Refused | Save at ≈10:19:55Z; flash "Claim saved"; status "Refused 11/15/26, 5:20 AM" | ✅ | — |
| 4 | Open both inboxes, refresh up to 2 minutes | New email in each | 2374001: 2 mails; 2374002: 2 mails (newest 17:20 local) | ✅ | — |
| 5 `[Verification]` | Each listed address got a separate email for claim 333 after step 3 | Both received a separate Refused email | Both inboxes: new "Claim updated" from the same sender at 10:20:08Z, attachment `claim-333.pdf`, separate from the 10:19:16Z one. Body: "Hello, Following the review of your claim … we inform you that the claim has been refused in accordance with the terms and conditions of the contract." | ✅ | AC 3 holds for a status other than approval: the notify address hears about a refusal too |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Nov15-Inbox2374001RefusedEmail_pass.png` — notify inbox with two emails, the Refused one open
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Nov15-Inbox2374002RefusedEmail_pass.png` — client inbox with two emails, the Refused one open

### AP2374_005 — Each notification email contains the sentence "The claim ID … has been updated to status …" — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | AP2374_003 and 004 ran; choose the inbox | Inbox holds an Authorized and a Refused email for this claim | Inbox **2374001** chosen (it received both: 10:19:16Z Authorized, 10:20:08Z Refused) | ✅ | — |
| 2 | Open the Authorized email and copy its body | Body displayed and copied | "Hello, Thank you for your claim request. Please find attached the decision and details related to your file. To proceed with the reimbursement – Once the repair has been authorized and completed, please send all the following documents to: payables@garantieavantageplus.ca Merchant Reimbursement - Authorized Repair Facility (Payment issued directly to the repair facility) Authorization form signed by the vehicle's owner Signed final invoice, including the authorization number and the owner's name « Note: If the final invoice is not signed, a work order signed by the vehicle owner will be accepted » A void cheque for direct deposit payment (if not already provided) or The full mailing address for cheque delivery; Individual Reimbursement - Private Individual (The vehicle owner has already paid for the repairs in full) Current proof of ownership (registration certificate) The final invoice with the name of the vehicle's owner Proof of payment (credit card receipt, Interac, etc.) The authorization form signed by the vehicle's owner A void cheque for direct deposit (if not already provided) or The full mailing address for cheque delivery Feel free to contact the claims agent who processed your request, as indicated on the form, with any questions regarding your request at 1-866-666-0181 Kind regards, Claims Department Produits Avantage Plus inc. Produits Avantage Plus, 2700 des Entreprises # 102, Terrebonne QC J6X 4J8, Canada" | ✅ | — |
| 3 | Open the Refused email and copy its body | Body displayed and copied | "Hello, Following the review of your claim under your Produits Avantage Plus Inc. extended warranty contract, we inform you that the claim has been refused in accordance with the terms and conditions of the contract. For further clarification regarding this decision, please contact our Claims Department at 1- 866-666-0181 or by email at info@garantieavantageplus.ca Sincerely, Claims Department Produits Avantage Plus inc. Produits Avantage Plus, 2700 des Entreprises # 102, Terrebonne QC J6X 4J8, Canada" | ✅ | — |
| 4 `[Verification]` | Look for "The claim ID <number> has been updated to status <status>" in each body | Present in both = PASS; missing from either = FAIL | Sentence present in the Authorized body = **false**; in the Refused body = **false**. The claim number 333 appears in neither body (only in the attachment name `claim-333.pdf`). The bodies above are the only text | ❌ | AC (REQ-004) not met — the AP-2392 symptom is still present on Dev. Consequence: a recipient (especially the notify contact, who may handle many claims) cannot tell from the email which claim changed or what its new status is without opening the PDF |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-Nov15-AuthorizedBodyNoClaimIdSentence_fail.png` — Authorized email body in 2374001: no claim ID / status sentence
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-Nov15-RefusedBodyNoClaimIdSentence_fail.png` — Refused email body in 2374001: no claim ID / status sentence

### AP2374_006 — The notification email carries the claim's attached file and a PDF of the claim that follows AP-2387 — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Contract and API claim exist; open the claim; record status | Admin claim page opens | `/admin/claim/333/details`, status Refused; Attachments = "No entities found" | ✅ | — |
| 2 `[Pre-Condition]` | Attach `AP2374-attachment.png`: (a) admin Add attachment, type Other — one try; (b) `POST /api/admin/claim-attachment` — one try | Attachments card lists the PNG; neither → BLOCKED | (a) 10:21:17Z — `POST /admin/claim/333/upload-attachment` → **HTTP 500**, page "Erreur — Désolé, l'application éprouve des difficultés techniques." (b) 10:21:28Z — `POST /api/admin/claim-attachment` (claimId 333, type other) → **HTTP 500** `{"success":false,"error":"Failed to upload attachment: Unable to create the \"/var/www/dev/releases/79/src/app/uploads/claim_attachments/\" directory."}`. Claim reloaded at 10:21:41Z: Attachments = "No entities found" | 🚫 | BLOCKED "claim attachment: admin Add attachment HTTP 500, Admin API claim-attachment HTTP 500". The API's message points at the Dev server's upload folder (it cannot be created), i.e. an environment fault, not the feature under test. Fix needed first: make the claim_attachments upload folder writable on Dev |
| 3 | Change status with Notify ticked | — | Not run | 🚫 | Blocked at step 2. Not run to keep claim 333 free of an extra status change before AP2374_011 |
| 4 | Open the email and the PDF | — | Not run | 🚫 | Blocked at step 2 |
| 5 `[Verification]` | Attachments and PDF content | — | Not run | 🚫 | Blocked at step 2. Observation only: the Authorized and Refused emails of this run each carry exactly one attachment, `claim-333.pdf` |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_006-step2-Nov15-AdminAddAttachmentHttp500_blocked.png` — the HTTP 500 error page after Save on Add attachment
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_006-step2-Nov15-AttachmentRequests_blocked.txt` — method, URL and status of both upload requests, and the API's error message

### AP2374_007 – AP2374_010 — Carried forward

Not re-run on 2026-11-15. Results **PASS** from 2026-11-01 on claims 331 and 332 (contract 26df1-844, inbox `client.stage.931`): 007 unticked box saves and sends no email; 008 a claim with no notify email lists the client email alone with no stray comma; 009 an invalid or emptied list saves and emails no one; 010 a claim with no files sends the email with only the claim PDF. Full step tables and screenshots: [execution-log_AP-2374_2026-11-01.md](execution-log_AP-2374_2026-11-01.md).

### AP2374_011 — Removing the notify address from the recipient list before Authorizing means only the client is emailed — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | API claim exists; record ID and status | Admin claim page opens; status recorded | Claim 333, status "Refused 11/15/26, 5:20 AM" | ✅ | Run after AP2374_002–006, on the same claim |
| 2 `[Pre-Condition]` | Only if Authorized: reset to Refused unticked. Then wait 2 min and record the latest email time for this claim in each inbox | Status not Authorized; latest times recorded | Status already Refused, so the reset was **not** needed and not done. Checked 10:21:49Z (2374001) and 10:21:58Z (2374002), ≥ 2 min after the last change at 10:19:55Z: latest email for claim 333 in each = 10:20:08Z (2 mails each) | ✅ | Ordering kept the claim off Authorized, so Authorized in step 3 is a real change |
| 3 | Change status → Authorized; record the pre-filled value; replace with 2374002 only; keep the box ticked; Deductible `0`, Note `QA AP2374_011 notify removed`; Save | Flash "Claim saved"; badge Authorized | Pre-filled value = `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com`; submitted value = `client.stage.2374002@yopmail.com`; "Notify by email" checked = true; Save at ≈10:22:12Z; flash "Claim saved"; status "Authorized 11/15/26, 5:22 AM" | ✅ | — |
| 4 | Open 2374002, then 2374001; refresh up to 2 minutes | Both inboxes displayed | 2374002 at 10:22:23Z: 3 mails (newest 17:22 local). 2374001 at 10:23:09Z and again at 10:24:22Z: 2 mails (17:20, 17:19) | ✅ | 2374001 was checked 2 min 10 s after the save |
| 5 `[Verification]` | New email for claim 333 after step 3 in each inbox | 2374002 got it; 2374001 got nothing | 2374002: "Claim updated" from "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>", received 10:22:25Z, attachment `claim-333.pdf`, Authorized body. 2374001: no email after 10:22:12Z (latest still 10:20:08Z) | ✅ | AC 3 / Q-004: the email follows the submitted list. The stored notify email is not added back on approval |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_011-step3-Nov15-AuthorizedListCutTo2374002_pass.png` — Authorized form before Save: box ticked, recipient field (red outline) holding 2374002 only
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_011-step5-Nov15-Inbox2374002GotAuthorizedEmail_pass.png` — client inbox with the new 17:22 email open
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_011-step5-Nov15-Inbox2374001NoEmailAfterRemoval_pass.png` — notify inbox at 10:24Z: still only the 17:19 and 17:20 emails

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2374_006 | 🚫 | A file cannot be attached to a claim on Dev: admin Add attachment → HTTP 500, and `POST /api/admin/claim-attachment` → HTTP 500 "Unable to create the …/uploads/claim_attachments/ directory". The case checks that the claim's own file is in the email, so it cannot run until the Dev upload folder is fixed (or a file is seeded on the claim) |

---

## Knowledge lookups and record-and-accept

- Knowledge lookup: Admin API `POST /api/admin/claim` rejects a body without `items` → `qa-docs/admin-api.md` and the raw spec list `items` as an array (not marked required) — none in a Story — accepted: sent `"items":[]` as setup.
- Knowledge lookup: Generate Contract "Financing company" required → none — accepted: chose "Avantage Plus Testing" (setup only).
- Q-003 (Accepted): pre-fill order and spacing recorded as `notify, client` with ", " — accepted as built.
- Q-006 (Accepted): sender "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>", subject "Claim updated" — matched.

---

## Environment Observations

- **Environment: Dev (v2dev)** per `execution_env` in `tools.md`.
- **Claim attachment upload is broken on Dev on both routes.** The Admin API message names the cause: the server cannot create `/var/www/dev/releases/79/src/app/uploads/claim_attachments/`. This is an environment/deployment fault, outside the steps under test (setup of AP2374_006), and is recorded here rather than as a FAIL.
- **`POST /api/admin/claim` requires an `items` array.** Without it the API returns HTTP 400 "Invalid items format. Expected JSON array."; with `"items":[]` it returns 201. A claim created this way starts in status Submitted and its first history note reads "Error processing ticket: No work order items found in ticket 333 for categorization." (private note by machine-user).
- **Generate Contract now requires a Financing company on Dev** (first submit refused). The delivery-date warning seen on 2026-11-01 still shows and does not block.
- **The claim's notify email is not displayed on the admin claim page**; it is visible only through `GET /api/admin/claim/{id}` and in the Change status pre-fill.
- Language: admin and dealer pages in English; emails in English.
- Records left on Dev by other tickets today (AP-2503 vehicles 1231–1235, quotes 6703–6707, contracts APOP01-848/849/850; AP-1948 sessions for customer 1493) were not touched.

### Leaves behind (this run)

| Record | Id | State |
|---|---|---|
| Quote | 6708 (Marie Tremblay AP2374, vehicle 915) | Contract generated |
| Warranty contract | 26df1-851 (warranty 851), invoice #955 | Pending approval / Not Paid |
| Claim | **333** (Admin API, notify email `client.stage.2374001@yopmail.com`) | Authorized; status changes Authorized 10:19Z, Refused 10:20Z, Authorized 10:22Z; no attachment |
| Emails | `client.stage.2374001` (2: 10:19:16Z, 10:20:08Z), `client.stage.2374002` (3: 10:19:16Z, 10:20:08Z, 10:22:25Z) | Public Yopmail inboxes, kept 8 days |

`cleanup` source is `missing` — nothing was deleted.

---

## Re-run after correction

Not applicable on this date — Gate C has not run yet for this execution (R3 by the orchestrator), so there is no "Not a bug" (C1) decision and `s4c` has nothing to correct.

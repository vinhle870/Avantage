# Automation Report — AP-2374
Date: 2026-11-01 · Source log: qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2374_2026-11-01.md
Spec: playwright-automation/src/tests/admin/claimStatusNotify_AP2374.spec.ts · Tag: @AP-2374
Result: 4 of 4 PASSED cases automated — 4 passing, 0 fixme

## Summary
The four cases that passed manually on Dev (v2dev) now run automatically: an unticked "Notify by email" saves the status and sends nothing (007), a claim with no notify email still lists the client's email (008), an invalid or emptied recipient list saves without an error and emails nobody (009), and a claim with no files still sends the "Claim updated" email with only its own PDF (010). The emails are read in the Yopmail test inbox `client.stage.931`; "no email" is proven by a control email from claim 332 that must arrive alone. The FAIL (001) and BLOCKED cases (002–006) are not automated, because they have no confirmed expected behaviour. The spec runs only on Dev: it skips itself when the framework's base URL is not v2dev, because it reuses Dev claims 331 and 332.

## Cases
| TC ID | Title | Status | Reason |
|---|---|---|---|
| AP2374_001 | Change status shows "Notify by email" and "Recipient email(s)" | not selected | FAIL manually — AP-2509 |
| AP2374_002 | Recipient field pre-filled with notify email + client email | not selected | BLOCKED — Q-010 |
| AP2374_003 | Status change with notify ticked emails both recipients | not selected | BLOCKED — Q-010 |
| AP2374_004 | Second status change also emails both recipients | not selected | BLOCKED — Q-010 |
| AP2374_005 | Email states claim ID and new status | not selected | BLOCKED — Q-001 |
| AP2374_006 | Email carries the claim's file and a PDF of the claim | not selected | BLOCKED — attachment upload HTTP 500 on Dev |
| AP2374_007 | Unticked "Notify by email" — status saved, no email | automated — passing | — |
| AP2374_008 | Claim with no notify email still lists the client email | automated — passing | — |
| AP2374_009 | Invalid / emptied recipient list — no error, no email | automated — passing | — |
| AP2374_010 | Claim with no attachments still sends the email | automated — passing | — |

## Step map
The `[Pre-Condition]` steps that create the quote, contract and claim are replaced by the standing Dev claims the manual run created: 331 (status changes without an email) and 332 (read-only in 008; emailed in 010 and as the control email). Both are on contract 26df1-844 with client email `client.stage.931@yopmail.com` and no notify email (Q-010).

| TC ID | Step | Mapped to | Kind |
|---|---|---|---|
| all | login | AdminFlow.loginToAdminPortal() | reused |
| 007 | 1–2 | ClaimStatusNotifyFlow.snapshotInbox(), openClaim(331), otherNotifyStatus(), openChangeStatusForm() | new |
| 007 | 3 | ClaimStatusNotifyFlow.submitStatusChange(331, status, { notify: false }) | new |
| 007 | 4–5 | sendControlEmail() (claim 332, ticked) + ClaimStatusNotifyFlow.verifyNoEmailForClaim() | new |
| 008 | 2–3 | ClaimStatusNotifyFlow.openClaim(332), openChangeStatusForm() | new |
| 008 | 4 | ClaimStatusNotifyFlow.verifyRecipientFieldHoldsClientEmail(), closeChangeStatusForm() | new |
| 009 | 1–2 | snapshotInbox(), openClaim(331) | new |
| 009 | 3 | submitStatusChange(331, …, { notify: true, recipients: 'not-an-email' }) | new |
| 009 | 4 | submitStatusChange(331, …, { notify: true, recipients: '' }) | new |
| 009 | 5 | sendControlEmail() + verifyNoEmailForClaim() | new |
| 010 | 1–3 | snapshotInbox(), openClaim(332), openChangeStatusForm(), submitStatusChange(332, …, { notify: true }) | new |
| 010 | 4–5 | ClaimStatusNotifyFlow.verifyClaimEmailReceived() | new |

## New locators
| Name | Expression | Page | Count |
|---|---|---|---|
| lblStatusBadge | `//h5[normalize-space()='Status']/following-sibling::span[contains(@class,'badge')]` | /admin/claim/332/details | 1 |
| btnChangeStatus | `a.dropdown-toggle[href$="/change-status"]` | /admin/claim/332/details | 1 |
| lnkStatus(id, status) | `a.dropdown-item[href="/admin/claim/{id}/change-status?status={status}"]` | /admin/claim/332/details | 1 per status |
| dlgChangeStatus | `#myModal` | Change status modal | 1 |
| lblModalHeading | `#myModal h1` | Change status modal | 1 |
| chkNotifyByEmail | `#claim_status_notifyByEmail` | Change status modal (Refused) | 1 |
| lblNotifyByEmail | `label[for="claim_status_notifyByEmail"]` | Change status modal (Refused) | 1 |
| txtRecipientEmails | `#claim_status_recipientEmails` | Change status modal (Refused) | 1 |
| txtDeductibleAmount | `#claim_status_deductibleAmount` | Change status modal | 1 |
| txtNote | `#claim_status_claimStatusNotes_0_description` | Change status modal | 1 |
| btnSave | `#myModal button[type="submit"]` | Change status modal | 1 |
| lblClaimSaved | `.alert` with text "Claim saved" | details page after Save | 1 (strict mode during the runs) |
| frmInbox / frmMail | `#ifinbox` / `#ifmail` iframes | yopmail.com/en/?login=client.stage.931 | 1 / 1 |
| btnRefresh | `#refresh` | Yopmail inbox | 1 |
| lstMails | `#ifinbox` → `div.m` (id `e_<token>`) | Yopmail inbox | 1 per email |
| lnkAttachments | `#ifmail` → `a.pj` (title = file name) | Yopmail open email | 1 per attachment |

## Files changed
All four are new files. No existing file in playwright-automation/ was modified (AdminFlow.ts, DealerFlow.ts, index.ts and test-fixtures.ts untouched; the page objects are imported directly, not through `index.ts`).

| File | Change |
|---|---|
| src/pages/adminPortal/AdminClaimDetailsPage.ts | new — claim details page + Change status modal |
| src/pages/common/YopmailInboxPage.ts | new — Yopmail inbox / email reader |
| src/flows/ClaimStatusNotifyFlow.ts | new — status-change and email business steps with assertions |
| src/tests/admin/claimStatusNotify_AP2374.spec.ts | new spec, tag @AP-2374, serial, Dev only |

## Run
Command: `npx playwright test --project=chromium --grep @AP-2374`
Lint: pass · Run: 4 passed, 0 fixme, 1.3 min. `--repeat-each=2`: 8 passed, 0 failed, 2.7 min, no flaky tests. Run against Dev (v2dev) through the framework's gitignored `.env`; never against staging. Reviewer R5 (inline): APPROVE, 3 minor findings.

Test data each full run leaves on Dev: claim 331 gets 3 status changes (Authorized ↔ Refused, no email), claim 332 gets 3 status changes with "Notify by email" ticked, and 3 "Claim updated" emails with `claim-332.pdf` reach `client.stage.931@yopmail.com`. Every change adds a status note `QA-AP2374-<case>-<epoch ms> …`. Today's 3 full runs left 9 changes on each claim and 9 emails in that inbox. No email was sent to any address other than that Yopmail test inbox.

## Pull request
PR skipped: gh CLI not installed

## Not passing
None.

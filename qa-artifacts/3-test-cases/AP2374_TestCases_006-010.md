# Test Cases — AP2374 (File 2 of 3)

**Project:** Avantage Plus v2 — Admin portal, Claims
**Requirement:** AP2374 — Status Change email notification: Add notify email and client email (Jira AP-2374)
**Source:** requirements/AP-2374-status-change-email-notification-notify-email.md · qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md (re-run 2026-11-15) · qa-artifacts/2-test-plan/AP-2374_test-plan.md (v2.0)
**Date:** 2026-11-01 · redesigned 2026-11-15
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
| **Portal** | Admin portal (claim details, Change status, Add attachment); Dealer portal only to create the quote, contract and dealer-filed claims; the Admin API (shell, `curl`) to create the notify-email claim and, as a fallback, to attach a file; Yopmail web inboxes | `navigation` §1, `domain` (`qa-docs/claims.md`, `qa-docs/admin-api.md`) |
| **Entry route** | Admin claim details `/admin/claim/{id}/details` → **Change status** (dropdown of nine statuses) → modal "Change status for claim #{id}" → **Save** → flash "Claim saved". Admin **Add attachment** → `/admin/claim/{id}/upload-attachment` (type select Work order · Invoice · Signed claim · Other, File). Dealer contract: `/vehicle/915/details` → **Create quote** → **Save** → "+" next to Extended warranty → **Save** → ⋯ → **Generate Contract** → **Save**. Dealer claim: `/warranty/{contractId}` → **File a claim**. **Never enter at bare `/quote`** | `domain` (`qa-docs/claims.md`, `qa-docs/quote-creation.md`) |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | **Dev** — `BASE_URL` `https://v2dev.garantieavantageplus.ca/` (`execution_env: Dev`) | `env` → Dev Environment |
| **Login** | One shared account for Admin (`/admin/login`, French labels) and Dealer (`/login`) — `execute.env.md` → **Dev Environment**. Never copy the values into this file or the log | `env` |
| **Admin API key** | `AVP_ADMIN_API_KEY` in the repo-root `/.env` — header `X-API-KEY`. Load it in Git Bash without printing it: `KEY=$(sed -n 's/^AVP_ADMIN_API_KEY=//p' .env \| tr -d '\r' \| sed 's/^"//;s/"$//')`; stop if empty. Expires **2026-12-05**. Remove the key from any response saved as evidence | `domain` (`qa-docs/admin-api.md` §2, §4) |
| **Test data** | Vehicle **915** — VIN `1FAHP35NX8W239204` (standing). **Re-run (AP2374_006):** the same contract and API claim as file 1 — notify email `client.stage.2374001@yopmail.com`, client email `client.stage.2374002@yopmail.com`; attachment file `AP2374-attachment.png` (any small PNG, e.g. a copy of a run screenshot, renamed). **Kept 2026-11-01 results (AP2374_007–010):** contract `26df1-844` (client email `client.stage.931@yopmail.com`), claims 331 and 332, inboxes `client.stage.930` / `931` | `test-data` |
| **Language** | EN admin pages; email and PDF language recorded and accepted | `navigation` |
| **Leaves behind** | Re-run: the file 1 contract and API claim, plus one attachment on that claim (if the upload works) and one more status change with its email; from AP2374_011 (file 3) one or two more status changes on the same API claim (a Refused change with "Notify by email" unticked when the claim is Authorized, then Authorized) and one email in `client.stage.2374002`. 2026-11-01: claims 331 and 332 with their status changes, emails in `client.stage.931`. `cleanup` is `missing` — nothing is deleted | `cleanup` (missing) |

**Standing facts only.** Contracts, claims and inboxes are dynamic and are created in each
case's `[Pre-Condition]` steps.

**The Admin API calls are setup, not the test.** A non-201 answer to the create-claim call
makes the case BLOCKED "Admin API setup: HTTP <status>" — never FAIL.

**Safety rule for every case.** Never submit with *Notify by email* ticked on a claim whose
recipient field holds any address other than this run's QA Yopmail inboxes. The one exception
is AP2374_009, which submits the non-address `not-an-email` or an empty field — neither can be
delivered.

**Known blockers:**

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether a file can be attached to a claim on Dev — admin Add attachment returned HTTP 500 (2 of 2, 2026-11-01) | AP2374_006 | Re-checked at execution: one try of the admin form, then one try of `POST /api/admin/claim-attachment` (listed in `qa-docs/admin-api.md` §5 and its raw spec). Both failing → BLOCKED. Not a design-time BLOCKED, because a documented second route exists |

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2374_006 | The notification email carries the claim's attached file and a PDF of the claim that follows AP-2387 | Functional | High | BLOCKED |
| AP2374_007 | Changing a claim's status with "Notify by email" left unticked saves the status and sends no email | Negative | Medium | PASS |
| AP2374_008 | A claim with no notify email pre-fills Change status with the client's email alone, with no stray comma | Edge-case | Medium | PASS |
| AP2374_009 | An invalid or emptied recipient list with "Notify by email" ticked saves the claim and emails no one | Negative | Medium | PASS |
| AP2374_010 | A claim with no attached files still sends the notification email with only the claim PDF attached | Edge-case | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`
>
> AP2374_007–010 keep their 2026-11-01 results: their expected results changed from
> record-only to record-and-accept, and the accepted value is exactly what each case observed.
> AP2374_006 was BLOCKED and runs again.

---

## Test Cases

---

### AP2374_006 — The notification email carries the claim's attached file and a PDF of the claim that follows AP-2387

| Field | Value |
|---|---|
| **TC ID** | AP2374_006 |
| **Title** | The notification email carries the claim's attached file and a PDF of the claim that follows AP-2387 |
| **Requirement** | AP2374 — REQ-005 / AC 1 ("The attachment files from the claim’s attachments") and AC 2 ("A PDF of the claim details page"); Q-009 Answered — AP-2387: "The claim status is displayed before “contract information” • The claim status value is displayed one size bigger and contains the same color code as on the claim details page • The Avantage Plus logo is displayed on the top of the page"; file name accepted as `claim-{id}.pdf` |
| **Route** | `/admin/claim/{id}/details` → Add attachment; Change status; Yopmail inbox `client.stage.2374001` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — (re-check at execution; see Known blockers #1) |
| **Executed on** | 2026-11-15, Dev (v2dev) |
| **Result** | BLOCKED — claim attachment: admin Add attachment HTTP 500, Admin API claim-attachment HTTP 500 ("Unable to create the …/uploads/claim_attachments/ directory") |

**Why this matters:** the attachments let the recipient see the claim's documents without
logging in. A missing or wrong file sends incomplete — or someone else's — information.

**Test Data:**

| Variable | Value |
|---|---|
| Claim | This run's API claim (file 1, AP2374_002 steps 1–2) |
| Attachment | `AP2374-attachment.png`, type "Other" |
| Deductible amount / Note | `0` / `QA AP2374_006` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure this run's contract and API claim exist — if not, create them as AP2374_002 steps 1–2 (dealer quote on vehicle 915 with client email `client.stage.2374002@yopmail.com` → warranty → Generate Contract; `POST /api/admin/claim` with `notifyEmail` `client.stage.2374001@yopmail.com`). Open `/admin/claim/{id}/details` and record its status | The admin "Claim details" page opens for the API claim |
| 2 | [Pre-Condition] Attach the file — **one try each**: (a) **Add attachment** → type "Other", File `AP2374-attachment.png` → Save; (b) only if (a) shows HTTP 500 or an error page: in Git Bash `curl -sS -i -H "X-API-KEY: $KEY" --form-string "claimId=<id>" --form-string "type=other" -F "file=@AP2374-attachment.png" https://v2dev.garantieavantageplus.ca/api/admin/claim-attachment`. Record each HTTP status (method, URL, status only) and reload the claim | The Attachments card lists `AP2374-attachment.png`. If neither try lists it → BLOCKED "claim attachment: admin Add attachment HTTP <status>, Admin API claim-attachment HTTP <status>" |
| 3 | Click **Change status** → **Authorized** or **Refused** (whichever is not the current status); confirm only the two run addresses are in the recipient field; enter Deductible amount `0`, Note `QA AP2374_006`, leave "Notify by email" ticked → **Save**. Record the time | Flash "Claim saved"; the new status shows; no error page |
| 4 | Open `https://yopmail.com/en/?login=client.stage.2374001` and open the email for this claim received after the step 3 time — if 2374001 received none, open `…client.stage.2374002` instead and record "notify address not in list — judged in AP2374_002". List its attachments, then open the PDF beside the admin claim details page | The email and its attachment list are displayed; the PDF opens and can be read |
| 5 | [Verification] Verify the attachments and the PDF content | The email carries `AP2374-attachment.png` (same name as on the claim) and one PDF, `claim-{id}.pdf` for this claim ID (Q-009 file name accepted). The PDF shows this claim's ID; the claim status appears before "Contract information", one size bigger and in the same colour as on the claim details page; the Avantage Plus logo is at the top (AP-2387). Any of these missing is a FAIL. PDF language is recorded and accepted |

---

### AP2374_007 — Changing a claim's status with "Notify by email" left unticked saves the status and sends no email

| Field | Value |
|---|---|
| **TC ID** | AP2374_007 |
| **Title** | Changing a claim's status with "Notify by email" left unticked saves the status and sends no email |
| **Requirement** | AP2374 — REQ-003 / AC 1 (the email is tied to "the ‘notify by email’ checkbox is selected"); Q-007 Accepted |
| **Route** | `/admin/claim/{id}/details` → Change status; Yopmail inboxes |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) — result kept on 2026-11-15 |
| **Result** | PASS — claim 331 saved as Refused at 17:10:19Z with the box unticked; no email in `client.stage.931` |

**Why this matters:** an admin who leaves the box unticked expects no email to leave. No Story
defines it (Q-007), so the observed behaviour — no email — is the expected result.

**Test Data:**

| Variable | Value |
|---|---|
| Claim | A claim of this run (2026-11-01: claim 331) |
| Checkbox | "Notify by email" **unticked** (untick it — it opens ticked) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Use a claim of this run (or file one: dealer `/warranty/{contractId}` → **File a claim** → "Vehicle km at claim" `6000`, "Diagnostic" `QA AP2374 claim` → **Save**). Record the claim ID | The claim exists and has an ID |
| 2 | [Pre-Condition] Open `/admin/claim/{id}/details`, click **Change status**, and record the number of emails in the recipient inbox(es) shown in the form | The form opens; inbox counts recorded |
| 3 | Choose **Authorized** or **Refused** (not the current status), untick "Notify by email", enter Deductible amount `0` and a Note → **Save**. Record the time | Flash "Claim saved"; the claim shows the new status; no error page |
| 4 | Wait 2 minutes, then refresh the recipient inbox(es) | The inboxes are displayed |
| 5 | [Verification] Verify the claim shows the new status and no inbox received a new email **for this claim** (attachment `claim-{id}.pdf` of this claim ID) after the step 3 time | Status saved, no error page, and no new email for this claim (Q-007 Accepted: an unticked submit sends nothing). Emails for other claims are ignored. An email for this claim arriving is a FAIL |

---

### AP2374_008 — A claim with no notify email pre-fills Change status with the client's email alone, with no stray comma

| Field | Value |
|---|---|
| **TC ID** | AP2374_008 |
| **Title** | A claim with no notify email pre-fills Change status with the client's email alone, with no stray comma |
| **Requirement** | AP2374 — REQ-002 / AC 2; Q-003 Accepted |
| **Route** | `/admin/claim/{id}/details` → Change status |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) — result kept on 2026-11-15 |
| **Result** | PASS — claim 332: field = `client.stage.931@yopmail.com` only, no stray comma |

**Why this matters:** claims filed from the dealer portal have no notify email. The form must
still open and offer the client's address; the observed formatting — the address alone,
without a leading or trailing comma — is the accepted result (Q-003).

**Test Data:**

| Variable | Value |
|---|---|
| Claim | A dealer-filed claim on this run's contract, no notify email (2026-11-01: claim 332, contract client email `client.stage.931@yopmail.com`) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] On this run's contract, file a claim from the dealer portal (`/warranty/{contractId}` → **File a claim** → "Vehicle km at claim" `6000`, "Diagnostic" `QA AP2374 no notify` → **Save**) — the dealer form has no notify-email field, so the claim has none. Record its claim ID | The claim is saved with its own ID |
| 2 | [Pre-Condition] Open `/admin/claim/{id}/details` for that claim | The "Claim details" page opens |
| 3 | Click **Change status** → **Authorized** | The form opens without an error page |
| 4 | [Verification] Read the exact value of "Recipient email(s)", including any comma or space, then close the form without saving | The field holds the contract's client email alone, with no leading or trailing comma and no other address (Q-003 Accepted) |

---

### AP2374_009 — An invalid or emptied recipient list with "Notify by email" ticked saves the claim and emails no one

| Field | Value |
|---|---|
| **TC ID** | AP2374_009 |
| **Title** | An invalid or emptied recipient list with "Notify by email" ticked saves the claim and emails no one |
| **Requirement** | AP2374 — REQ-002 / AC 2 and REQ-003 / AC 1 (the email goes to "the list of ‘Recipient email(s)’"); Q-004 Accepted |
| **Route** | `/admin/claim/{id}/details` → Change status; Yopmail inboxes |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) — result kept on 2026-11-15 |
| **Result** | PASS — `not-an-email` and an empty list both saved with "Claim saved", no validation message, no error page, no email |

**Why this matters:** no Story says how bad input is handled (Q-004); the observed behaviour —
the field is editable and the status saves without a message — is accepted. What must never
happen is a server error, or an email reaching an address removed from the list.

**Test Data:**

| Variable | Value |
|---|---|
| Invalid recipient value | `not-an-email` |
| Empty recipient value | (field cleared) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Use a claim of this run (or file one as AP2374_007 step 1). Record its status and the number of emails in the inbox(es) its recipient field shows | The claim exists; counts recorded |
| 2 | [Pre-Condition] Open `/admin/claim/{id}/details` | The "Claim details" page opens |
| 3 | **Change status** → a status other than the current one with "Notify by email" (Authorized or Refused), keep the box ticked, replace the recipient field with `not-an-email`, Deductible amount `0`, a Note → **Save**. Record the message and time | Flash "Claim saved", no validation message, no error page (Q-004 Accepted) |
| 4 | Repeat step 3 with the other status and the recipient field **cleared** completely | Flash "Claim saved", no validation message, no error page (Q-004 Accepted) |
| 5 | [Verification] Wait 2 minutes, refresh the inbox(es) recorded in step 1, and check the claim's final status | No new email **for this claim** (attachment `claim-{id}.pdf` of this claim ID) after the step 3 and 4 times — neither address was in the submitted list; emails for other claims are ignored; the claim shows the step 4 status. An email for this claim arriving, or an error page in steps 3–4, is a FAIL |

---

### AP2374_010 — A claim with no attached files still sends the notification email with only the claim PDF attached

| Field | Value |
|---|---|
| **TC ID** | AP2374_010 |
| **Title** | A claim with no attached files still sends the notification email with only the claim PDF attached |
| **Requirement** | AP2374 — REQ-003 / AC 1 and REQ-005 / AC 1–2; Q-008 Accepted |
| **Route** | `/admin/claim/{id}/details` → Change status; Yopmail inbox |
| **Type** | Edge-case |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) — result kept on 2026-11-15 |
| **Result** | PASS — claim 332 email received with `claim-332.pdf` only (read in `client.stage.931`) |

**Why this matters:** many claims have no documents yet. The email must still go out, carrying
only this claim's PDF (Q-008 Accepted) and no file belonging to another claim.

**Test Data:**

| Variable | Value |
|---|---|
| Claim | A claim of this run with **no attachment** (2026-11-01: claim 332) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Use (or file, as AP2374_008 step 1) a claim of this run with no attachment. Record its claim ID | The claim's Attachments card shows "No entities found" |
| 2 | [Pre-Condition] Open `/admin/claim/{id}/details`, click **Change status** → Authorized or Refused (not the current status); confirm the recipient field holds only this run's Yopmail address(es) (safety rule) | The form opens |
| 3 | Leave "Notify by email" ticked and the recipients unchanged, enter Deductible amount `0` and a Note → **Save**. Record the time | Flash "Claim saved"; the new status shows |
| 4 | Open the recipient inbox, refresh for up to 2 minutes, and open the new email | A new email received after step 3 is displayed |
| 5 | [Verification] Verify the email arrived and list its attachments | The email was received with exactly one attachment, `claim-{id}.pdf` for this claim (Q-008 Accepted); no file from another claim |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-002 / AC 2 — recipient field pre-filled | — | AP2374_009 | AP2374_008 | — |
| REQ-003 / AC 1 — email sent to recipients | — | AP2374_007, AP2374_009, AP2374_011 (file 3) | AP2374_010 | — |
| REQ-005 / AC 1–2 — attachments | AP2374_006 | — | AP2374_010 | — |

Full matrix across both files: see file 1 (`AP2374_TestCases_001-005.md`).

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2374_006 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_006-step2-Nov15-AdminAddAttachmentHttp500_blocked.png` |
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
| 2026-11-15 | Execution Context | Environment Staging → **Dev** (`env` → Dev Environment); admin routes from `qa-docs/claims.md`; `AVP_ADMIN_API_KEY` named (name only); re-run and kept test data listed separately; Known blockers row for the attachment upload | Analysis re-run 2026-11-15; review R1 minor F-3 |
| 2026-11-15 | AP2374_006 | Redesigned on the file 1 API claim: attachment added in the case's own step 2 — admin Add attachment once, then `POST /api/admin/claim-attachment` once (documented in `qa-docs/admin-api.md` §5); PDF judged against AP-2387 (Q-009 Answered); file name `claim-{id}.pdf` accepted. BLOCKED → **Not Run** | Batch decision 2026-11-15: re-check at execution (one attempt); Q-009 Answered |
| 2026-11-15 | AP2374_007 | Step 5 record-only → asserts no email (Q-007 Accepted); step 1 setup corrected to the dealer File a claim route actually used. **2026-11-01 PASS kept** — the accepted value is what this case observed | Designer Step 1c (Accepted → record-and-accept) |
| 2026-11-15 | AP2374_008 | Step 4 record-only → asserts the client email alone with no stray comma (Q-003 Accepted); setup names the dealer File a claim route. **2026-11-01 PASS kept** | Designer Step 1c |
| 2026-11-15 | AP2374_009 | Steps 3–5 record-only → assert "Claim saved", no validation, no email (Q-004 Accepted). **2026-11-01 PASS kept** | Designer Step 1c |
| 2026-11-15 | AP2374_010 | Step 5 record-only → asserts exactly one attachment `claim-{id}.pdf` (Q-008 Accepted). **2026-11-01 PASS kept** | Designer Step 1c |
| 2026-11-15 | AP2374_007 | Step 5 expected result qualified "for this claim" (attachment `claim-{id}.pdf` of this claim ID); emails for other claims ignored. **2026-11-01 PASS kept** — this matches what the log judged ("New email for claim 331 after … = none"); the 17:11:45Z email in `client.stage.931` was for claim 332 (AP2374_010) | Gate B (R2 round 1) F-1 — by reviewer |
| 2026-11-15 | AP2374_009 | Step 5 expected result qualified "for this claim" in the same way. **2026-11-01 PASS kept** — the 17:11:45Z email was for claim 332 | Gate B (R2 round 1) F-1 — by reviewer |
| 2026-11-15 | AP2374_006 | Step 4 reads `client.stage.2374002` when 2374001 received no email for this claim | Gate B (R2 round 1) F-3 — by reviewer |
| 2026-11-15 | Coverage Matrix, Leaves behind, header | AP2374_011 (file 3) added to REQ-003 Negative; Leaves behind lists its status changes and email; header "File 2 of 3" | Gate B rule B2 — Pass 2 proposal 2 promoted (R2 round 1 F-2) — by reviewer |
| 2026-11-15 | AP2374_006 | Status and Result filled from the 2026-11-15 execution: BLOCKED at step 2 (both upload routes HTTP 500). No step changed | s4 execution on Dev (v2dev) |

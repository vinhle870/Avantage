# Test Cases — AP2374 (File 1 of 3)

**Project:** Avantage Plus v2 — Admin portal, Claims
**Requirement:** AP2374 — Status Change email notification: Add notify email and client email (Jira AP-2374)
**Source:** requirements/AP-2374-status-change-email-notification-notify-email.md · qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md (re-run 2026-11-15) · qa-artifacts/2-test-plan/AP-2374_test-plan.md (v2.0)
**Date:** 2026-11-01 · redesigned 2026-11-15
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
| **Portal** | Admin portal (claim details and its Change status form); Dealer portal only to create the quote and warranty contract; the Admin API (shell, `curl`) only to create the claim with a notify email; Yopmail web inboxes to read the emails | `navigation` §1, `domain` (`qa-docs/claims.md`, `qa-docs/admin-api.md`) |
| **Entry route** | Admin claim details `/admin/claim/{id}/details` → **Change status** button (opens a dropdown of nine statuses) → status item → modal "Change status for claim #{id}" (`/admin/claim/{id}/change-status?status={status}`) → **Save** → flash "Claim saved". Dealer contract: `/vehicle/915/details` → **Create quote** (`/quote/new/client?fromVehicleId=915`) → **Save** → `/quote/{id}/details` → "+" next to Extended warranty → **Save** → Extended warranty row ⋯ → **Generate Contract** → **Save**. **Never enter at bare `/quote`** — on Dev it redirects elsewhere and the client-first flow returns HTTP 500 | `domain` (`qa-docs/claims.md`, `qa-docs/quote-creation.md`) |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | **Dev** — `BASE_URL` `https://v2dev.garantieavantageplus.ca/` (`execution_env: Dev` in `tools.md`) | `env` → Dev Environment |
| **Login** | One shared account for Admin (`/admin/login`, French labels "Courriel", "Mot de passe", "Se connecter") and Dealer (`/login`) — `execute.env.md` → **Dev Environment** (`ADMIN_USERNAME` / `ADMIN_PASSWORD`). Never copy the values into this file or the log | `env` |
| **Admin API key** | `AVP_ADMIN_API_KEY` in the repo-root `/.env` — header `X-API-KEY`. Load it in Git Bash without printing it: `KEY=$(sed -n 's/^AVP_ADMIN_API_KEY=//p' .env \| tr -d '\r' \| sed 's/^"//;s/"$//')`; stop if empty. Dev key app "QA-automation", expires **2026-12-05**. Remove the key from any response before saving it as evidence | `domain` (`qa-docs/admin-api.md` §2, §4) |
| **Test data** | Vehicle **915** — VIN `1FAHP35NX8W239204`, Ford Focus 2008 (standing data; warranty program "Automation Test Program", term 20m/20000km). **Re-run inboxes (2026-11-15):** notify email `client.stage.2374001@yopmail.com`, client email `client.stage.2374002@yopmail.com` — read at `https://yopmail.com/en/?login=client.stage.2374001` / `…2374002`. If this pair already holds mail from an earlier run, take the next unused pair (`2374003`/`2374004`, …) and record it. Kept 2026-11-01 results used inboxes `client.stage.930` / `931`, contract `26df1-844`, claim 331 | `test-data` |
| **Language** | Admin pages render in EN by default; the admin login is French. Email language is recorded and accepted | `navigation` |
| **Leaves behind** | Re-run: one quote and one warranty contract (with its invoice) for `Marie Tremblay AP2374` on vehicle 915; one claim created through the Admin API ("created by User Machine") with notify email `client.stage.2374001`, its status changed at least twice; emails in the two public inboxes. 2026-11-01: quote 6454 (6455 abandoned), contract 26df1-844 / invoice #937, claims 331 and 332. `cleanup` is `missing` — nothing is deleted | `cleanup` (missing) |

**Standing facts only.** The contract, the API claim and the inboxes are dynamic and are
created in each case's `[Pre-Condition]` steps. Every case of one run reuses the same
contract and claim once they exist.

**The Admin API call is setup, not the test.** It is the only way to put a notify email on a
claim (Q-010, AP-2357 / AP-2372). A non-201 answer makes the case BLOCKED "Admin API setup:
HTTP <status>" — never FAIL. The test is what the Change status form and the inboxes show.

**Safety rule for every case.** Never submit with *Notify by email* ticked on a claim whose
recipient field holds any address other than this run's two `client.stage.2374…` inboxes —
that would email a real person.

**Known blockers:** None at design time. Q-001 and Q-010 no longer block (analysis re-run
2026-11-15: Q-010 Answered, Q-001 Accepted with the AC sentence still required).

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2374_001 | Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field | Functional | High | FAIL |
| AP2374_002 | A claim with a notify email pre-fills Change status with both addresses, separated by a comma, on more than one status | Functional | High | PASS |
| AP2374_003 | Authorizing a claim with "Notify by email" ticked delivers the email to the notify address and the client | Functional | High | PASS |
| AP2374_004 | Refusing the same claim with "Notify by email" ticked also emails both addresses — the email is not tied to approval | Regression | High | PASS |
| AP2374_005 | Each notification email contains the sentence "The claim ID … has been updated to status …" | Functional | Medium | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`
>
> AP2374_001 keeps its 2026-11-01 result (its expected result did not change). AP2374_002–005
> were BLOCKED on 2026-11-01 and are redesigned to run again.

---

## Test Cases

---

### AP2374_001 — Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field

| Field | Value |
|---|---|
| **TC ID** | AP2374_001 |
| **Title** | Opening Change status on a claim shows a "Notify by email" checkbox and a "Recipient email(s)" field |
| **Requirement** | AP2374 — REQ-001 / AC 1 ("A checkbox ‘Notify by email’ is available in the form"); REQ-002 / AC 1 (field label); Q-002 Accepted (default state) |
| **Route** | `/admin/claim/{id}/details` → Change status → each status |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-01, Dev (v2dev) — result kept on 2026-11-15 |
| **Result** | FAIL — checkbox and recipient field exist only on the Authorized and Refused forms ("Notify customer by email" on Pending); absent on Created, Submitted, Preapproved, Accepted by Dealer, Paid, Cancelled. Filed as AP-2509 |

**Why this matters:** the checkbox is the entry point of the whole feature. The description
names no status, so every status the form offers must show it.

**Test Data:**

| Variable | Value |
|---|---|
| Claim | Any claim of this run (2026-11-01: claim 331 on contract 26df1-844) |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Use a claim of this run, or file one: Dealer portal `/warranty/{contractId}` → **File a claim** → enter "Vehicle km at claim" `6000` and "Diagnostic" `QA AP2374 claim` → **Save**. Record the claim ID | The claim is saved and its details page `/claim/{id}/details` opens without an error page |
| 2 | [Pre-Condition] Log in to the Admin portal at `/admin/login` and open `/admin/claim/{id}/details` for that claim | The "Claim details" page opens for that claim ID |
| 3 | Click **Change status** and choose each of the nine statuses in turn, opening its form and closing it without saving | Each "Change status for claim #{id}" form opens without an error page |
| 4 | [Verification] For every status form, verify a checkbox labelled "Notify by email" and a field labelled "Recipient email(s) - separate by commas for multiple recipient" are present. Note the checkbox's state when the form opens | Every status form shows both controls with these labels (AC 1). A difference only in letter case or punctuation is recorded, not judged; any other wording (e.g. "Notify customer by email") or a missing control is a FAIL. Default state (Q-002, Accepted): ticked on open on the Authorized and Refused forms — accepted as expected |

---

### AP2374_002 — A claim with a notify email pre-fills Change status with both addresses, separated by a comma, on more than one status

| Field | Value |
|---|---|
| **TC ID** | AP2374_002 |
| **Title** | A claim with a notify email pre-fills Change status with both addresses, separated by a comma, on more than one status |
| **Requirement** | AP2374 — REQ-002 / AC 2 ("The field is populated with the claim’s notify_email field and the warranty contract’s client email field separated by comma"); Q-010 Answered — AP-2357: `POST /api/admin/claim` "notifyEmail · string · Additional email to send notifications when clain is approved", Then 6 "a new field called notify_email is saved" |
| **Route** | Admin API (setup) → `/admin/claim/{id}/details` → Change status → Authorized, Refused, Preapproved |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) |
| **Result** | PASS — claim 333 (Admin API, notifyEmail stored): Authorized and Refused pre-fill `client.stage.2374001@yopmail.com, client.stage.2374002@yopmail.com`; Preapproved has no field (AP-2509) |

**Why this matters:** the two addresses decide who hears about the claim. AP-2357 links the
notify email to approval, but AC 2 sets no status limit, so the list is checked on the
approval decision (Authorized), on Refused, and on the Preapproved form (status code
`approved`). Order and spacing are accepted as built (Q-003).

**Test Data:**

| Variable | Value |
|---|---|
| Client email (on the contract) | `client.stage.2374002@yopmail.com` |
| Notify email (on the API claim) | `client.stage.2374001@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Create this run's contract (reuse it if an earlier case of this run did): Dealer portal `/vehicle/915/details` → **Create quote** (→ `/quote/new/client?fromVehicleId=915`) → first name `Marie`, last name `Tremblay AP2374`, email **`client.stage.2374002@yopmail.com`**, every other required field incl. `telWork` `514-555-2374` → **Save**; on `/quote/{id}/details` click "+" next to Extended warranty → program "Automation Test Program", term 20m/20000km, Sale price `500` → **Save**; Extended warranty row ⋯ → **Generate Contract** → **Save**. Record the quote ID and the contract number | Flash "Invoice #… is created"; the contract number (format `26df1-NNN`) is shown on the quote, with no error page |
| 2 | [Pre-Condition] Create the claim through the Admin API (setup; reuse it if an earlier case of this run did). In Git Bash load `AVP_ADMIN_API_KEY` (Execution Context) and send `POST https://v2dev.garantieavantageplus.ca/api/admin/claim` with headers `X-API-KEY: $KEY`, `Content-Type: application/json` and body `{"contractNumber":"<step 1 contract>","diagnostic":"QA AP2374 notify email","vehicleKmAtClaim":6000,"notifyEmail":"client.stage.2374001@yopmail.com"}`. Record the HTTP status and `claimId`. Then send `GET https://v2dev.garantieavantageplus.ca/api/admin/claim/{claimId}` with the same `X-API-KEY` header and record the stored notify email value (remove the key before saving any response). Open `/admin/claim/{claimId}/details` | HTTP 201 with `"success":true` and a `claimId`; the GET returns the claim with notify email `client.stage.2374001@yopmail.com` stored; the admin "Claim details" page opens and its Contract card shows the step 1 contract. A non-201 POST → BLOCKED "Admin API setup: HTTP <status>"; notify email missing or different in the GET → BLOCKED "Admin API setup: notifyEmail not stored" (an AP-2357 fault, not judged here) |
| 3 | Click **Change status** → **Authorized**. Read the full value of "Recipient email(s) - separate by commas for multiple recipient" without editing it, then close the form without saving | The "Change status for claim #{id}" form opens without an error page; the field value is recorded exactly, with order and spaces |
| 4 | Repeat step 3 for **Refused** and for **Preapproved**, recording each field value — or, on a form with no such field, that it is absent | Each form opens without an error page; each value (or its absence) is recorded |
| 5 | [Verification] Compare the recorded values with the Test Data | On **Authorized** and **Refused** the field holds exactly `client.stage.2374001@yopmail.com` and `client.stage.2374002@yopmail.com`, separated by a comma, and no other address; order and spacing are accepted as built (Q-003). A missing notify address is a FAIL (AC 2). **Preapproved:** if the field is present it must hold the same two addresses (FAIL otherwise); if the form has no field, record "absent — AP-2509, judged in AP2374_001" (not a new failure) |

---

### AP2374_003 — Authorizing a claim with "Notify by email" ticked delivers the email to the notify address and the client

| Field | Value |
|---|---|
| **TC ID** | AP2374_003 |
| **Title** | Authorizing a claim with "Notify by email" ticked delivers the email to the notify address and the client |
| **Requirement** | AP2374 — REQ-003 / AC 3 ("A notification email is sent to the list of ‘Recipient email(s) - separate by commas for multiple recipient’"); Q-010 Answered (AP-2357 — notify email for when the claim is approved); Q-006 Accepted (sender, subject); regression of AP-2382 |
| **Route** | `/admin/claim/{id}/details` → Change status → Authorized; Yopmail inboxes |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) |
| **Result** | PASS — both inboxes received "Claim updated" with claim-333.pdf at 10:19:16Z |

**Why this matters:** sending to every listed recipient is the purpose of the ticket, and bug
AP-2382 ("Can't receive the email after submit change status form with email checkbox as
checked") was raised against exactly this step. On 2026-11-01 only the client could be on the
list; this run proves the notify address receives it too.

**Test Data:**

| Variable | Value |
|---|---|
| Recipients (pre-filled, not edited) | `client.stage.2374001@yopmail.com`, `client.stage.2374002@yopmail.com` |
| Target status | **Authorized** (the approval decision AP-2357 names) |
| Deductible amount / Note | `0` / `QA AP2374_003 Authorized` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure this run's contract and API claim exist — if not, create them exactly as AP2374_002 steps 1–2 (dealer quote on vehicle 915 with client email `client.stage.2374002@yopmail.com` → warranty → Generate Contract; then `POST /api/admin/claim` with `notifyEmail` `client.stage.2374001@yopmail.com`). Record the claim ID and its current status, and the number of emails in both inboxes | The claim's admin details page opens; its status is not Authorized; inbox counts recorded |
| 2 | [Pre-Condition] Click **Change status** → **Authorized**. Record the exact value of the recipient field (every address, in order) and confirm it holds no address other than this run's two `client.stage.2374…` inboxes (safety rule) | The form opens with "Notify by email" ticked; the field value is recorded exactly and holds no address outside the run's two inboxes |
| 3 | Enter Deductible amount `0` and Note `QA AP2374_003 Authorized`, leave "Notify by email" ticked and the recipients unchanged, click **Save**. Record the time | Flash "Claim saved"; the status badge shows "Authorized" with the date and time; no error page |
| 4 | Open `https://yopmail.com/en/?login=client.stage.2374001`, then `…client.stage.2374002`; refresh for up to 2 minutes | Each inbox shows a new email received after the step 3 time |
| 5 | [Verification] For each address in the step 2 value, verify its inbox holds a new email for this claim (attachment `claim-{id}.pdf` of this claim ID) received after the step 3 time; record sender, subject, time and the number of new emails | Every address in the submitted list (step 2 value) received the email (AC 3: sent to the list). Sender "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>" and subject "Claim updated" are accepted as expected (Q-006). A listed address with no email is a FAIL. When `client.stage.2374001` was **not** in the step 2 value, record "notify address not in list — judged in AP2374_002" for it, not a FAIL here |

---

### AP2374_004 — Refusing the same claim with "Notify by email" ticked also emails both addresses — the email is not tied to approval

| Field | Value |
|---|---|
| **TC ID** | AP2374_004 |
| **Title** | Refusing the same claim with "Notify by email" ticked also emails both addresses — the email is not tied to approval |
| **Requirement** | AP2374 — REQ-003 / AC 3 (the description limits no status); reporter 2025-12-18: test "with that status and with multiple emails"; Q-010 Answered (AP-2357 says "when clain is approved" — the AC wins for other statuses) |
| **Route** | `/admin/claim/{id}/details` → Change status → Refused; Yopmail inboxes |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) |
| **Result** | PASS — both inboxes received a separate Refused email at 10:20:08Z |

**Why this matters:** AP-2357 describes the notify email as being for approvals only, while
AP-2374's acceptance criterion sends to the whole list on any status change. A refusal is
the status a claim contact most needs to hear about; if only approvals reach the notify
address, that contact is never told the claim was refused.

**Test Data:**

| Variable | Value |
|---|---|
| Recipients (pre-filled, not edited) | `client.stage.2374001@yopmail.com`, `client.stage.2374002@yopmail.com` |
| Target status | **Refused** |
| Deductible amount / Note | `0` / `QA AP2374_004 Refused` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure this run's contract and API claim exist — if not, create them exactly as AP2374_002 steps 1–2. Record the claim's current status and the number of emails in both inboxes | The claim's admin details page opens; its status is not Refused; inbox counts recorded |
| 2 | [Pre-Condition] Click **Change status** → **Refused**. Record the exact value of the recipient field (every address, in order) and confirm it holds no address other than this run's two `client.stage.2374…` inboxes (safety rule) | The form opens with "Notify by email" ticked; the field value is recorded exactly and holds no address outside the run's two inboxes |
| 3 | Enter Deductible amount `0` and Note `QA AP2374_004 Refused`, leave "Notify by email" ticked and the recipients unchanged, click **Save**. Record the time | Flash "Claim saved"; the status badge shows "Refused"; no error page |
| 4 | Open both Yopmail inboxes and refresh for up to 2 minutes | Each inbox shows a new email received after the step 3 time |
| 5 | [Verification] For each address in the step 2 value, verify its inbox holds a new email for this claim (attachment `claim-{id}.pdf`) received after the step 3 time, separate from the AP2374_003 email if that case ran; record sender, subject and time | Every address in the submitted list (step 2 value) received a separate email for the Refused change (AC 3: sent to the list). Sender and subject as accepted in AP2374_003 (Q-006). A listed address with no email is a FAIL. When `client.stage.2374001` was **not** in the step 2 value, record "notify address not in list — judged in AP2374_002" for it, not a FAIL here |

---

### AP2374_005 — Each notification email contains the sentence "The claim ID … has been updated to status …"

| Field | Value |
|---|---|
| **TC ID** | AP2374_005 |
| **Title** | Each notification email contains the sentence "The claim ID … has been updated to status …" |
| **Requirement** | AP2374 — REQ-004 / AC 1 ("Message: The claim ID 48618 has been updated to status {{STATUS}}"); Q-001 Accepted (the two values), Q-005 Accepted (extra text allowed); regression of AP-2392 |
| **Route** | Yopmail inbox `client.stage.2374001` (or `client.stage.2374002` when 2374001 received none) |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) |
| **Result** | FAIL — "The claim ID … has been updated to status …" absent from both the Authorized and the Refused body (AP-2392 symptom) |

**Why this matters:** bug AP-2392 reported this message missing, the QA's 2026-01-07 comment
said it was still missing, and the 2026-11-01 run found it absent from both emails. No Story
defines which number and label fill the sentence, so those are accepted as built — but the
sentence itself is the acceptance criterion and must be there.

**Test Data:**

| Variable | Value |
|---|---|
| Emails under test | The Authorized email (AP2374_003) and the Refused email (AP2374_004) for this claim in `client.stage.2374001@yopmail.com`; when 2374001 received none (notify address not in the list, AP2374_003/004 step 5), the same emails in `client.stage.2374002@yopmail.com` |
| Claim ID to compare | The API claim ID recorded in AP2374_002 / 003 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure AP2374_003 and AP2374_004 have run on this run's API claim. If not, run AP2374_003 steps 1–3 (Authorized) and AP2374_004 steps 2–3 (Refused) first. Choose the inbox: `client.stage.2374001`, or `client.stage.2374002` when 2374001 received no email for this claim; record which | The chosen inbox holds an Authorized and a Refused email for this claim |
| 2 | Open the inbox chosen in step 1 (`https://yopmail.com/en/?login=client.stage.2374001` or `…2374002`) and open the Authorized email. Copy its full body text into the execution log word for word | The email body is displayed and copied |
| 3 | Open the Refused email and copy its full body text into the execution log word for word | The email body is displayed and copied |
| 4 | [Verification] In each body, look for a sentence of the form "The claim ID <number> has been updated to status <status>". Record the number and status label it shows, and any other text | Both bodies contain the sentence (AC 1) — present in each = PASS; missing from either = FAIL (the AP-2392 symptom). The number and status label it shows are accepted as built and recorded (Q-001). Other text in the body is allowed and recorded (Q-005) |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 / AC 1 — "Notify by email" checkbox | AP2374_001 | — | — | — |
| REQ-002 / AC 1–2 — recipient field label and pre-fill | AP2374_001 (label), AP2374_002 | AP2374_009 (file 2) | AP2374_008 (file 2) | — |
| REQ-003 / AC 1 — email sent to recipients | AP2374_003 | AP2374_007, AP2374_009 (file 2), AP2374_011 (file 3) | AP2374_010 (file 2) | AP2374_004 |
| REQ-004 / AC 1 — message text | AP2374_005 | — | — | AP2374_005 (AP-2392) |
| REQ-005 / AC 1–2 — attachments | AP2374_006 (file 2) | — | AP2374_010 (file 2) | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2374_001 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_001-step4-SubmittedFormNoNotifyCheckbox_fail.png` |
| AP2374_002 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_002-step5-Nov15-AuthorizedRecipientsBothAddresses_pass.png` |
| AP2374_003 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_003-step5-Nov15-Inbox2374001AuthorizedEmail_pass.png` |
| AP2374_004 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_004-step5-Nov15-Inbox2374001RefusedEmail_pass.png` |
| AP2374_005 | FAIL | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_005-step4-Nov15-AuthorizedBodyNoClaimIdSentence_fail.png` |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-01 | AP2374_003 | Step 5: "one new email from Avantage Plus" → "a new email for this claim"; sender and number of emails now recorded, not judged | Gate B rule B1 — review findings Pass 1 gap 1 / R2 F-1: sender and count are not stated in the ticket |
| 2026-11-01 | Execution Context, AP2374_001–005 step 1 | Entry route and contract setup now start from vehicle 915: `/vehicle/915/details` → Create quote → client → `/quote/{id}/warranty/edit` → Save; bare `/quote` forbidden; vehicle 915 added to Test data | R2 independent re-review F-1 (Major): `/quote` without a vehicle returns HTTP 500 per `qa-docs/quote-creation.md` |
| 2026-11-01 | AP2374_001 | Step 4 expected result states the verdict: case/punctuation-only label differences recorded, any other wording difference is a FAIL | R2 re-review F-3 |
| 2026-11-01 | AP2374_003, AP2374_004 | Step 5: "a new email received after the time in step 3 (the inboxes are fresh for this run, so any new email is this run's)" | R2 re-review F-6 |
| 2026-11-01 | Coverage Matrix | AP2374_010 (file 2) added to REQ-003 Edge-case | R2 re-review F-5 |
| 2026-11-15 | Execution Context | Environment Staging → **Dev** (`env` → Dev Environment, `BASE_URL` `https://v2dev.garantieavantageplus.ca/`); admin Claims routes from `qa-docs/claims.md`; contract via Generate Contract; `AVP_ADMIN_API_KEY` named (name only); re-run inboxes `client.stage.2374001/2374002`; Leaves behind lists the API claim; Known blockers emptied | Analysis re-run 2026-11-15 (Q-010 Answered, Q-001 Accepted); review R1 minor F-3; the 2026-11-01 run executed on Dev |
| 2026-11-15 | AP2374_001 | Step 1 corrected to the route actually executed (dealer `/warranty/{id}` → File a claim — no claim form has a notify email); step 3 opens every status form, as executed; step 4 default state record-only → record-and-accept (ticked on Authorized/Refused). Expected result for the labels unchanged → **2026-11-01 FAIL kept** | Batch decision 2026-11-15 (designer Step 1c: Accepted questions record-and-accept); the accepted value is the value this case observed |
| 2026-11-15 | AP2374_002 | Redesigned: claim created through `POST /api/admin/claim` with `notifyEmail` (setup); field checked on Authorized, Refused and Preapproved forms; order/spacing accepted (Q-003). BLOCKED → **Not Run** | Q-010 Answered (AP-2357/AP-2372); review R1 minors F-2 (more than one status, incl. approved) and F-3 |
| 2026-11-15 | AP2374_003 | Redesigned on the API claim; target status fixed to Authorized; sender/subject record-only → accepted values asserted (Q-006). BLOCKED → **Not Run** | Q-010 Answered; Q-006 Accepted; R1 F-2 |
| 2026-11-15 | AP2374_004 | Redesigned on the API claim; target status fixed to Refused (a status other than approval). BLOCKED → **Not Run** | Q-010 Answered; R1 F-2 |
| 2026-11-15 | AP2374_005 | Expected result `Not known — Q-001` → verdict on the AC sentence (present = PASS, absent = FAIL); claim number and status label record-and-accept; both Authorized and Refused emails checked. BLOCKED → **Not Run** | Q-001 Accepted with the AC sentence still required; Q-005 Accepted |
| 2026-11-15 | AP2374_002 | Step 2: after the 201, `GET /api/admin/claim/{claimId}` reads the stored notify email; not stored → BLOCKED "Admin API setup: notifyEmail not stored" | Gate B (R2 round 1) minor F-4 — by reviewer: a 201 does not prove notifyEmail was saved |
| 2026-11-15 | AP2374_003, AP2374_004 | Step 2 records the exact recipient field value; step 5 judges delivery against the addresses actually in the submitted list (AC 3) and records "notify address not in list — judged in AP2374_002" when 2374001 was not listed, instead of failing | Gate B (R2 round 1) F-3 — by reviewer: avoid failing twice for the AC 2 defect |
| 2026-11-15 | AP2374_005 | Route, Test Data and steps 1–2: read the emails in 2374001, or in 2374002 when 2374001 received none | Gate B (R2 round 1) F-3 — by reviewer |
| 2026-11-15 | Coverage Matrix, header | AP2374_011 (file 3, `AP2374_TestCases_011-011.md`) added to REQ-003 Negative; header "File 1 of 3" | Gate B rule B2 — Pass 2 proposal 2 promoted (R2 round 1 F-2) — by reviewer |
| 2026-11-15 | AP2374_002–005 | Status and Result filled from the 2026-11-15 execution (log `execution-log_AP-2374_2026-11-15.md`): 002–004 PASS, 005 FAIL. No step changed | s4 execution on Dev (v2dev) |

# Test Cases — AP2374 (File 3 of 3)

**Project:** Avantage Plus v2 — Admin portal, Claims
**Requirement:** AP2374 — Status Change email notification: Add notify email and client email (Jira AP-2374)
**Source:** requirements/AP-2374-status-change-email-notification-notify-email.md · qa-artifacts/1-requirements-analysis/AP-2374_requirements-analysis.md (re-run 2026-11-15) · qa-artifacts/2-test-plan/AP-2374_test-plan.md (v2.0) · qa-artifacts/3-test-cases/AP2374_ReviewFindings_2026-11-15.md (Pass 2 proposal 2)
**Date:** 2026-11-15
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2374_011 to AP2374_011 (1 test case)
**Coverage:** Negative

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. It repeats the facts
of file 1 (`AP2374_TestCases_001-005.md`) that this case uses, so no second file is needed._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin portal (claim details and its Change status form); Dealer portal and the Admin API (shell, `curl`) only when this run's contract and API claim do not exist yet; Yopmail web inboxes | `navigation` §1, `domain` (`qa-docs/claims.md`, `qa-docs/admin-api.md`) |
| **Entry route** | Admin claim details `/admin/claim/{id}/details` → **Change status** (dropdown of nine statuses) → status item → modal "Change status for claim #{id}" (`/admin/claim/{id}/change-status?status={status}`) → **Save** → flash "Claim saved". Contract and API claim setup: exactly as file 1, AP2374_002 steps 1–2. **Never enter at bare `/quote`** | `domain` (`qa-docs/claims.md`, `qa-docs/quote-creation.md`) |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | **Dev** — `BASE_URL` `https://v2dev.garantieavantageplus.ca/` (`execution_env: Dev` in `tools.md`) | `env` → Dev Environment |
| **Login** | One shared account for Admin (`/admin/login`, French labels "Courriel", "Mot de passe", "Se connecter") and Dealer (`/login`) — `execute.env.md` → **Dev Environment**. Never copy the values into this file or the log | `env` |
| **Admin API key** | Only needed if the API claim must be created: `AVP_ADMIN_API_KEY` in the repo-root `/.env`, header `X-API-KEY`, loaded without printing it (file 1, Execution Context). Expires **2026-12-05** | `domain` (`qa-docs/admin-api.md` §2, §4) |
| **Test data** | This run's API claim (file 1, AP2374_002): notify email `client.stage.2374001@yopmail.com`, contract client email `client.stage.2374002@yopmail.com`. Inboxes read at `https://yopmail.com/en/?login=client.stage.2374001` / `…2374002`. If file 1 moved to the next unused pair (`2374003`/`2374004`, …), use that pair and record it | `test-data` |
| **Language** | Admin pages EN; email language recorded and accepted | `navigation` |
| **Leaves behind** | On this run's API claim: one or two status changes (a Refused change with "Notify by email" unticked, only when the claim is Authorized at the start; then Authorized), and one email in `client.stage.2374002`. `cleanup` is `missing` — nothing is deleted | `cleanup` (missing) |

**Run order.** Run this case after AP2374_002–006 of the same run, on the same API claim.
Step 2 makes sure the claim is not already Authorized when step 3 chooses Authorized.

**Safety rule.** Never submit with *Notify by email* ticked on a claim whose recipient field
holds any address other than this run's `client.stage.2374…` inboxes.

**Known blockers:** None at design time.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2374_011 | Removing the notify address from the recipient list before Authorizing means only the client is emailed | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`
>
> Promoted at Gate B (rule B2) from Pass 2 proposal 2 of `AP2374_ReviewFindings_2026-11-15.md`,
> re-rated High by the reviewer (R2 round 1, F-2).

---

## Test Cases

---

### AP2374_011 — Removing the notify address from the recipient list before Authorizing means only the client is emailed

| Field | Value |
|---|---|
| **TC ID** | AP2374_011 |
| **Title** | Removing the notify address from the recipient list before Authorizing means only the client is emailed |
| **Requirement** | AP2374 — REQ-003 / AC 1 (ticket AC 3: "A notification email is sent to the list of ‘Recipient email(s) - separate by commas for multiple recipient’"); Q-004 Accepted (the submitted list is used as edited); Q-010 Answered — AP-2357: `notifyEmail` "Additional email to send notifications when clain is approved" |
| **Route** | `/admin/claim/{id}/details` → Change status → (Refused, unticked, if needed) → Authorized; Yopmail inboxes |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-15, Dev (v2dev) |
| **Result** | PASS — list cut to 2374002 on Authorized: 2374002 emailed at 10:22:25Z; 2374001 received nothing after 10:22:12Z |

**Why this matters:** the claim's notify email is stored on the claim and AP-2357 describes it
as an address "to send notifications when claim is approved". If approval sends to that stored
address on its own path, an admin who removes the contact from the list is ignored and the
email still reaches them. AC 3 says the email goes to the list the admin submits. No other
case checks this for the notify address: AP2374_009 ran on a claim with no notify email.

**Test Data:**

| Variable | Value |
|---|---|
| Claim | This run's API claim (notify email `client.stage.2374001@yopmail.com`) |
| Submitted recipient list | `client.stage.2374002@yopmail.com` only (`client.stage.2374001@yopmail.com` removed) |
| Target status | **Authorized** |
| Deductible amount / Note | `0` / `QA AP2374_011 notify removed` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Make sure this run's contract and API claim exist — if not, create them exactly as file 1, AP2374_002 steps 1–2 (dealer quote on vehicle 915 with client email `client.stage.2374002@yopmail.com` → warranty → Generate Contract; `POST /api/admin/claim` with `notifyEmail` `client.stage.2374001@yopmail.com`). Open `/admin/claim/{id}/details` and record the claim ID and its current status | The admin "Claim details" page opens for the API claim; status recorded |
| 2 | [Pre-Condition] Only if the status is **Authorized**: **Change status** → **Refused**, **untick** "Notify by email", Deductible amount `0`, Note `QA AP2374_011 reset` → **Save**. Then (in every case) wait 2 minutes, open both inboxes and record the time of the latest email for this claim in each | The claim's status is not Authorized (flash "Claim saved" if the reset ran); latest email times recorded for both inboxes |
| 3 | **Change status** → **Authorized**. Record the pre-filled recipient value exactly, then replace the field with `client.stage.2374002@yopmail.com` only, keep "Notify by email" ticked, enter Deductible amount `0` and Note `QA AP2374_011 notify removed` → **Save**. Record the time | Flash "Claim saved"; the status badge shows "Authorized"; no error page |
| 4 | Open `https://yopmail.com/en/?login=client.stage.2374002`, then `…client.stage.2374001`; refresh for up to 2 minutes | Both inboxes are displayed |
| 5 | [Verification] In each inbox, look for a new email for this claim (attachment `claim-{id}.pdf` of this claim ID) received after the step 3 time; record sender, subject and time | `client.stage.2374002` received the email (AC 3). `client.stage.2374001` received **no** email for this claim after the step 3 time — an address removed from the submitted list gets nothing (AC 3; Q-004 Accepted). An email for this claim in 2374001 after the step 3 time, or none in 2374002, is a FAIL. Emails for other claims are ignored |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-003 / AC 1 — email sent to recipients (notify address removed from the list) | — | AP2374_011 | — | — |

Full matrix across all files: see file 1 (`AP2374_TestCases_001-005.md`).

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2374_011 | PASS | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2374/AP2374_011-step5-Nov15-Inbox2374001NoEmailAfterRemoval_pass.png` |

---

## Revisions

| Date | TC ID | Change | Reason |
|---|---|---|---|
| 2026-11-15 | AP2374_011 | New case: on the API claim, Authorized with `client.stage.2374001` removed from the recipient list; 2374002 must get the email, 2374001 nothing for this claim. Step 2 moves an Authorized claim to Refused with the box unticked first, so Authorized is a real change | Gate B rule B2 — Pass 2 proposal 2 promoted, re-rated High (R2 round 1 F-2) — by reviewer. Proposal 1 not promoted (stays Medium) |
| 2026-11-15 | AP2374_011 | Status and Result filled from the 2026-11-15 execution: PASS. Step 2 reset not needed (claim was Refused). No step changed | s4 execution on Dev (v2dev) |

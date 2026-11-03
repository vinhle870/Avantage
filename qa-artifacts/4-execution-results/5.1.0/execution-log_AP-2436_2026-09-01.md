# Execution Log — AP-2436, unblocked Chubb configuration branch

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor
**Date:** 2026-09-01
**Base URL:** https://v2staging.garantieavantageplus.ca
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Scope:** the four cases that were BLOCKED on 2026-08-29 — AP2436_012, AP2436_013, AP2436_014, AP2436_016 — plus the re-verification of the six filed defects recorded in the bug report.
**Why they are runnable now:** the blocker was a QA error, withdrawn as BUG-003 / AP-2451. The dealership is Dealer ID **1380**, found by searching the admin Dealers list **by email**; its Chubb Insurance Configuration lives at `/admin/dealer/1380/chubb-insurance`.
**Dealer account:** `vinhle870@gmail.com` — dealership "Test QA staging" (admin Name "Offical VinhLe870@gmail.com"), province **QC**
**Client inboxes used:** `client.stage.913`, `914`, `915`, `916` at yopmail.com (`901` was used for the BUG-001 re-check)

| Metric | Value |
|---|:---:|
| Test cases run | 4 |
| Passed | 3 |
| Failed | 0 |
| Recorded as observation (not scored) | 1 |
| Blocked | 0 |

**Data restored.** The dealer's configuration was returned to its pre-run state at the end of the session and verified by reload: creditor account `AP0001`, creditor forms `GC6201MQ:PM30`, `GC6201MQ:PM50`, `AVPG:TGGAP`.

---

## Result Overview

| TC ID | Title | Priority | Result | Screenshot |
|---|---|:---:|:---:|---|
| AP2436_012 | An admin can open Dealer Details and change a dealer's Chubb Insurance Configuration | High | ✅ PASS | `AP2436_012-step5-ChubbConfigPM50OnlyPersisted_pass.png` |
| AP2436_013 | PM50 only sends the 50 % waiver form and nothing else | High | ✅ PASS | `AP2436_013-step5-PM50OnlySends50WaiverOnly_pass.png` |
| AP2436_014 | A 30 % code only sends the 30 % waiver form and nothing else | High | ✅ PASS | `AP2436_014-step5-PM30OnlySends30WaiverOnly_pass.png`, `AP2436_014-step5-S30OnlySends30WaiverOnly_pass.png` |
| AP2436_016 | Empty Chubb configuration — record behaviour | High | 📋 Observation | `AP2436_016-step4-EmptyConfigNoWaiverForms_observed.png` |

**The rule the product owner asked about on 2026-08-26 is correct.** "If the user is assigned to only one type (50 or 30, not both) then only the assigned waiver form will be sent" — verified in both directions, and verified to be driven by the 30 % *group* rather than by a hard-coded PM30.

---

## AP2436_012 — Admin can read and change the Chubb Insurance Configuration

| Step | Action | Expected Result | Actual Result | Status |
|:---:|---|---|---|:---:|
| 1 `[Pre-Condition]` | Log in to the admin area | Admin area loads, dealer list reachable | Logged in at `/admin`; `/admin/dealers` reachable | ✅ |
| 2 | Open Dealer Details for the Quebec dealership | Page loads fully, no error, no blank screen | Searching the Dealers list **by email** returns `1380 | Offical VinhLe870@gmail.com | Test QA staging | vinhle870@gmail.com | 99999 | Group D`. `/admin/dealer/1380/edit` loads fully, heading "Dealer #1380", `dealer[province]` = **QC** | ✅ |
| 3 | Record the currently assigned creditor form codes | Current codes visible and recorded | Configuration is its own page at `/admin/dealer/1380/chubb-insurance`, heading "Chubb insurance". Recorded: creditor account `AP0001`; creditor forms **Creditor Monthly PM30** (`GC6201MQ:PM30`), **Creditor Monthly PM50** (`GC6201MQ:PM50`), **GAP** (`AVPG:TGGAP`) | ✅ |
| 4 | Change the codes to a different valid combination and save | Save accepted, page shows the new codes | Set to `GC6201MQ:PM50` only. Save accepted | ✅ |
| 5 `[Verification]` | Reload and verify the codes persisted | Reloaded page shows the step-4 codes | Reload shows exactly `GC6201MQ:PM50 (Creditor Monthly PM50)`, account unchanged at `AP0001`. Configuration is both readable and writable | ✅ |

**Note on the 2026-08-23 blocker this case retests.** The Dealer Details page is not broken and was not broken during the 2026-08-29 run either — it simply could not be found, because the search was run against the wrong column. The configuration page is a **separate route**, not a section of Dealer Details as the environment notes had recorded; `execute.env.md` has been corrected.

**All nine selectable creditor forms** (recorded for future runs): Creditor PM30 `GC6201:PM30` · Creditor PM50 `GC6201:PM50` · Creditor Monthly PM30 `GC6201MQ:PM30` · Creditor Monthly PM50 `GC6201MQ:PM50` · Creditor (Commercial) S30 `GC960S:S30` · Creditor (Commercial) S45 `GC960S:S45` · Creditor Monthly (Commercial) M25 `GC960M:M25` · Creditor Monthly (Commercial) M30 `GC960M:M30` · GAP `AVPG:TGGAP`.

**This closes the note carried on 2026-08-29** that "S30 and M30 have not been seen anywhere in the build". They exist; they were simply never assigned to this dealer, which is why the dealer-portal Form dropdown only ever offered PM30 and PM50.

---

## AP2436_013 — PM50 only sends the 50 % waiver form only

| Step | Action | Expected Result | Actual Result | Status |
|:---:|---|---|---|:---:|
| 1 `[Pre-Condition]` | Set the configuration to PM50 only and save | PM50 assigned, no 30 % code | `GC6201MQ:PM50` only, verified by reload (carried over from AP2436_012 step 4) | ✅ |
| 2 `[Pre-Condition]` | Log in as the dealer, empty the inbox, open Insurance Quick Quote | Inbox empty, send control visible | `client.stage.913@yopmail.com` empty; control visible | ✅ |
| 3 | Send with "Marie Tremblay" and the test address | Send accepted | Redirect to `/quick-insurance-quote` with the banner "Compliance documents have been sent." | ✅ |
| 4 | Open the email and every attachment | One email, all attachments open | One email at 17:39, "Compliance documents" from Systeme Avantage Plus. **Four attachments:** `parlons-assurance-fr.pdf`, `parlons-assurance-en.pdf`, `waiver-form-50-fr.pdf`, `waiver-form-50-en.pdf` | ✅ |
| 5 `[Verification]` | Verify a 50 % waiver is attached and no 30 % waiver is present | 50 % form present, 30 % form absent | **Exactly as required.** Both language variants of the 50 % waiver are present; no 30 % waiver of any kind. The attachment count drops from six to four, which is the 30 % pair being correctly withheld | ✅ |

---

## AP2436_014 — A 30 % code only sends the 30 % waiver form only

Run twice, with a different 30 % code each time, to prove the rule is driven by the 30 % **group** and not by one hard-coded code.

### Run 1 — PM30 only (`GC6201MQ:PM30`)

| Step | Action | Expected Result | Actual Result | Status |
|:---:|---|---|---|:---:|
| 1 `[Pre-Condition]` | Set the configuration to PM30 only | PM30 assigned, no PM50 | `GC6201MQ:PM30` only | ✅ |
| 2–3 | Send to a fresh inbox | Send accepted | Sent to `client.stage.914@yopmail.com`; accepted, email at 17:40 | ✅ |
| 4–5 `[Verification]` | Verify only the 30 % waiver is attached | 30 % form present, 50 % form absent | **Four attachments:** `parlons-assurance-fr.pdf`, `parlons-assurance-en.pdf`, `waiver-form-30-fr.pdf`, `waiver-form-30-en.pdf`. No 50 % waiver | ✅ |

### Run 2 — S30 only (`GC960S:S30`)

| Step | Action | Expected Result | Actual Result | Status |
|:---:|---|---|---|:---:|
| 1 `[Pre-Condition]` | Set the configuration to S30 only | S30 assigned, nothing else | `GC960S:S30` only | ✅ |
| 2–3 | Send to a fresh inbox | Send accepted | Sent to `client.stage.915@yopmail.com`; accepted, email at 17:41 | ✅ |
| 4–5 `[Verification]` | Verify only the 30 % waiver is attached | 30 % form present, 50 % form absent | **Identical to run 1:** `parlons-assurance-fr/en.pdf` plus `waiver-form-30-fr/en.pdf`. No 50 % waiver | ✅ |

**Conclusion.** A commercial code (`S30`) selects the same 30 % waiver form as the retail monthly code (`PM30`), so the attachment rule reads the group, not the individual code. M30 was not run — the two codes tested cover both the retail and the commercial side of the group, and the behaviour was identical.

---

## AP2436_016 — Empty Chubb configuration (observation, not scored)

The story defines no behaviour for a dealer with no creditor form assigned (open question Q-004), so this is recorded rather than passed or failed.

| Step | Action | Expected Result | Actual Result | Status |
|:---:|---|---|---|:---:|
| 1 `[Pre-Condition]` | Remove every creditor form code and save | No code assigned | All nine deselected; reload confirms `selected: []`. Account number left at `AP0001` | ✅ |
| 2 `[Pre-Condition]` | Open Insurance Quick Quote as the dealer | Send control visible | Control visible and enabled. **The quoting feature itself is gated** — the page shows "Your account is not configured with creditors insurance. Please contact support." | ✅ |
| 3 | Send and record the outcome | Outcome recorded | **The send is accepted.** Same banner as always: "Compliance documents have been sent." No warning, no difference from a fully configured send | 📋 |
| 4 `[Verification]` | Record what arrived | Behaviour recorded | Email arrived at 17:43 carrying **only two attachments** — `parlons-assurance-fr.pdf` and `parlons-assurance-en.pdf`. **No waiver form of either percentage** | 📋 |

**What this means.** The behaviour is self-consistent: no creditor form assigned, so no waiver form attached. Two things are worth a product decision:

1. **The dealer is not told.** The quote page correctly refuses to quote ("not configured with creditors insurance"), but the compliance send goes through with the usual success banner and gives no hint that the client received an incomplete set. A dealer in this state believes they have discharged a disclosure obligation they have not.
2. **The client receives a partial pack silently.** Whether that is acceptable, or whether the send should be blocked with the same "not configured" message the quote page uses, is Q-004 — still unanswered by the story.

Recorded as a candidate defect for triage rather than filed, since the required behaviour is undefined. Suggested severity if the product owner wants it filed: **Medium** — the send is not wrong, but the silence is.

---

## Defect re-verification, same session

All six filed defects were re-checked. **All six still reproduce; one was withdrawn as invalid on separate evidence.** Full detail in [bug-report.md](../../5-testing-report/bug-report.md) → *Re-verification — 2026-09-01*.

| Bug | Ticket | Outcome |
|---|---|---|
| BUG-001 | AP-2449 | Still fails — six attachments, no commission-percentage disclosure |
| BUG-002 | AP-2450 | Still fails — no admin-side register; 56 admin links enumerated, direct route 404 |
| ~~BUG-003~~ | AP-2451 | **Withdrawn — invalid, QA error.** Closed |
| BUG-004 | AP-2452 | Still fails — 256-character name returns HTTP 500 |
| BUG-005 | AP-2453 | Still fails — no download control |
| BUG-006 | AP-2454 | Still fails — Ontario client still offered the send |

---

## Cumulative AP-2436 position after this run

| Metric | 2026-08-29 | After 2026-09-01 |
|---|:---:|:---:|
| Total test cases | 20 | 20 |
| Passed | 9 | **12** |
| Failed | 7 | 7 |
| Blocked | 4 | **0** |
| Observation (not scored) | 0 | **1** |
| Pass rate | 45 % | **60 %** |

Every test case now has a result. The remaining 7 failures are the ones filed as AP-2449, AP-2450, AP-2452, AP-2453, AP-2454 plus the two unfiled Low defects (BUG-007 email copy, BUG-008 French label).

---

## Open items after this run

| # | Item | Owner |
|:---:|---|---|
| 1 | Q-004 — required behaviour when a dealer has no creditor form assigned. See AP2436_016 above | Ken Nguyen |
| 2 | A dealer-user login for a non-Quebec dealership, to close the dealer-province half of AP2436_004 / BUG-006 | Ken Nguyen |
| 3 | A person to open `parlons-assurance-fr.pdf` and confirm the product list matches the dealer's configuration — the only part of AP2436_017 not machine-verifiable | QA |
| 4 | Decisions still pending on AP-2453 and AP-2450 (both raised as possibly invalid) | Ken Nguyen / QA |

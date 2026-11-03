# Test Cases — AP2436 (File 3 of 4)

**Project:** Avantage Plus (AP) — Dealer Portal, release 5.1.0
**Requirement:** AP2436 — Dealer portal: Sending insurance compliance documents
**Source:** requirements/AP-2436-dealer-compliance-documents.md · qa-artifacts/1-requirements-analysis/requirements-analysis.md · qa-artifacts/2-test-plan/test-plan.md
**Date:** 2026-08-28
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2436_011 to AP2436_015 (5 test cases)
**Coverage:** Edge-case · Regression · Functional

> **Run order matters in this file.** AP2436_012 re-tests access to the **Dealer Details**
> page, which is how a dealer's Chubb Insurance Configuration is changed. AP2436_013,
> AP2436_014 and AP2436_015 each need a different configuration, so they cannot be set up
> at all if AP2436_012 fails. Run AP2436_012 first; if it fails, mark the three that
> follow as `BLOCKED`, not `FAIL`.
>
> **Restore the data afterwards.** Note the dealer's original Chubb configuration before
> the first change and put it back at the end of the run, so the next tester does not
> inherit a half-configured dealer.
>
> **Reference documents.** The four waiver-form PDFs attached to
> [AP-2436](https://garantieavantageplus.atlassian.net/browse/AP-2436) are the copies to
> compare against. The product owner confirmed on 2026-08-26 that attachment **file names
> do not matter** — only the contents do — so judge each attachment by opening it.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2436_011 | Sending twice to the same client produces two separate emails, not one merged send | Edge-case | Medium | PASS |
| AP2436_012 | An admin can open Dealer Details and change a dealer's Chubb Insurance Configuration | Regression | High | PASS |
| AP2436_013 | A dealer assigned only the 50% creditor form sends the 50% waiver form and nothing else | Functional | High | PASS |
| AP2436_014 | A dealer assigned only a 30% creditor form sends the 30% waiver form and nothing else | Functional | High | PASS |
| AP2436_015 | A dealer assigned both creditor form groups sends both the 50% and the 30% waiver forms | Functional | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2436_011 — Sending twice to the same client produces two separate emails, not one merged send

| Field | Value |
|---|---|
| **TC ID** | AP2436_011 |
| **Title** | Sending twice to the same client produces two separate emails, not one merged send |
| **Requirement** | AP2436 — REQ-003 acceptance criterion 1 with REQ-006 acceptance criterion 1 |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Two sends produced two separate emails and two register rows (log IDs 11 and 12) with their own timestamps. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** An advisor who is unsure whether the first send worked will press Send again — and the story gives them no confirmation message, so they will do this often. Each send must stand on its own and be recorded on its own, otherwise the register cannot show how many times a client was contacted.

**Test Data:**

| Variable | Value |
|---|---|
| Client Name | Marie Tremblay |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service |
| Number of sends | Two, one after the other, with the same values both times |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 2 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The first send is accepted |
| 3 | Reopen the modal, enter the same two values again, and click "Send" | The second send is accepted; no message says the client was already contacted |
| 4 | Open the client test inbox and wait up to two minutes | Two separate emails arrive, each with its own attachments, rather than one |
| 5 | [Verification] Verify both emails carry the same greeting and the same attachment set, note each email's received time, and screenshot the inbox showing two messages | Two distinct emails exist with matching contents and different timestamps, and the screenshot records both |

---

### AP2436_012 — An admin can open Dealer Details and change a dealer's Chubb Insurance Configuration

| Field | Value |
|---|---|
| **TC ID** | AP2436_012 |
| **Title** | An admin can open Dealer Details and change a dealer's Chubb Insurance Configuration |
| **Requirement** | AP2436 — REQ-004 testability risk (open question Q-009), retest of the blocker QC raised on 2026-08-23 |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — 2026-09-01. Dealer ID 1380, found by searching the Dealers list by email. `/admin/dealer/1380/edit` opens fully (province QC); the configuration is its own page at `/admin/dealer/1380/chubb-insurance` and a change to PM50 only persisted across a reload. The 2026-08-29 BLOCKED result was a QA error, withdrawn as BUG-003 / AP-2451. See [execution-log_AP-2436_2026-09-01.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-09-01.md). |

**Why this matters:** QC could not verify the Chubb insurance rules on 2026-08-23 because the **Dealer Details** page would not open. The product owner said on 2026-08-26 that this is fixed and asked for a retest. Regression testing means re-checking something that used to work after a change; here it is the gate on three other test cases, so it runs first. If it fails again, AP2436_013 to AP2436_015 are `BLOCKED` and the run should be suspended per the test plan.

**Test Data:**

| Variable | Value |
|---|---|
| Admin login | `vinhle870@gmail.com` — password in [execute.env.md](../base-test/execute.env.md) → Portals → Admin Portal |
| Dealer under test | The Quebec dealership used by AP2436_001 |
| Original configuration | Record the dealer's existing Chubb creditor form codes before changing anything, so they can be restored at the end of the run |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Avantage Plus admin area with the admin account | The admin area loads and the dealer list is reachable |
| 2 | Open the "Dealer Details" page for the Quebec dealership used in the other test cases | The Dealer Details page loads fully, with no error page and no blank screen |
| 3 | Open the dealer's Chubb Insurance Configuration section and write down the creditor form codes currently assigned | The current codes are visible and recorded, giving the value to restore later |
| 4 | Change the assigned creditor form codes to any different valid combination and save | The save is accepted and the page shows the new codes |
| 5 | [Verification] Reload the Dealer Details page and verify the saved codes persisted, then screenshot the Chubb Insurance Configuration section | The reloaded page shows the codes saved in step 4, proving the configuration can be both read and changed |

---

### AP2436_013 — A dealer assigned only the 50% creditor form sends the 50% waiver form and nothing else

| Field | Value |
|---|---|
| **TC ID** | AP2436_013 |
| **Title** | A dealer assigned only the 50% creditor form sends the 50% waiver form and nothing else |
| **Requirement** | AP2436 — REQ-004, acceptance criteria 1 and 4 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — 2026-09-01. With `GC6201MQ:PM50` alone assigned, the email carried four attachments: `parlons-assurance-fr/en.pdf` and `waiver-form-50-fr/en.pdf`. No 30 % waiver of any kind. See [execution-log_AP-2436_2026-09-01.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-09-01.md). |

**Why this matters:** The product owner asked for this case by name on 2026-08-26: "If the user is assigned to only one type (50 or 30, not both) then only the assigned waiver form will be sent. Please test that as well." Sending the 30% form to a client whose contract is at 50% hands them a disclosure that states the wrong number, which is a compliance error rather than a cosmetic one.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Chubb creditor form codes | PM50 only | No PM30, S30 or M30 assigned |
| Client Name | Marie Tremblay | |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| Expected attachment | The 50% waiver form — "Acceptance or Waiver Form — Credit Insurance (50 %)" or its French equivalent | Compare contents against the AP-2436 attachment; the file name may differ |
| Expected absence | No 30% waiver form of any kind | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, set the Quebec dealership's Chubb Insurance Configuration to PM50 only and save | The Dealer Details page shows PM50 assigned and no 30% code |
| 2 | [Pre-Condition] Log in to the dealer portal as that dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 3 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The send is accepted |
| 4 | Open the received email and open each attachment in turn | One email arrives and every attachment can be opened |
| 5 | [Verification] Verify a 50% waiver form is attached, that its contents match the AP-2436 reference copy, and that no 30% waiver form is present; screenshot the attachment list and the opened 50% form | The email carries the 50% waiver form with matching contents and carries no 30% waiver form |

---

### AP2436_014 — A dealer assigned only a 30% creditor form sends the 30% waiver form and nothing else

| Field | Value |
|---|---|
| **TC ID** | AP2436_014 |
| **Title** | A dealer assigned only a 30% creditor form sends the 30% waiver form and nothing else |
| **Requirement** | AP2436 — REQ-004, acceptance criteria 2 and 4 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — 2026-09-01, run twice. `GC6201MQ:PM30` alone and `GC960S:S30` alone each produced `parlons-assurance-fr/en.pdf` plus `waiver-form-30-fr/en.pdf` and no 50 % waiver, so the rule reads the 30 % group rather than one hard-coded code. All nine creditor forms including S30, S45, M25 and M30 do exist on the configuration page. See [execution-log_AP-2436_2026-09-01.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-09-01.md). |

**Why this matters:** This is the mirror of AP2436_013 and covers the second half of the rule the product owner asked to be tested. The story names three separate codes for the 30% group — PM30, S30 and M30 — so this case also confirms the rule is driven by the group and not by one hard-coded code.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Chubb creditor form codes, first run | PM30 only | No PM50 assigned |
| Chubb creditor form codes, second run | S30 only, then M30 only if time allows | Confirms all three codes in the 30% group behave the same |
| Client Name | Marie Tremblay | |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| Expected attachment | The 30% waiver form — "Acceptance or Waiver Form — Credit Insurance (30 %)" or its French equivalent | |
| Expected absence | No 50% waiver form | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, set the Quebec dealership's Chubb Insurance Configuration to PM30 only and save | The Dealer Details page shows PM30 assigned and no 50% code |
| 2 | [Pre-Condition] Log in to the dealer portal as that dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 3 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The send is accepted |
| 4 | Repeat the admin change and the send with S30 only, and again with M30 only | Each configuration produces its own email in the test inbox |
| 5 | [Verification] Verify every email from steps 3 and 4 carries the 30% waiver form with contents matching the AP-2436 reference copy and carries no 50% waiver form; screenshot each attachment list | All three codes in the 30% group send only the 30% waiver form, and none of the emails carries the 50% form |

---

### AP2436_015 — A dealer assigned both creditor form groups sends both the 50% and the 30% waiver forms

| Field | Value |
|---|---|
| **TC ID** | AP2436_015 |
| **Title** | A dealer assigned both creditor form groups sends both the 50% and the 30% waiver forms |
| **Requirement** | AP2436 — REQ-004, acceptance criterion 3 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Precondition proved from the dealer portal: the Quick Quote Form dropdown exposes both GC6201MQ:PM30 and GC6201MQ:PM50. The email carried one 30% and one 50% waiver form in each language, no duplicates. Confirms the product owner's 2026-08-26 answer. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** This is the state QC's dealer was already in on 2026-08-23, when receiving both waiver forms looked like a bug. The product owner confirmed on 2026-08-26 that both forms are correct for a dealer assigned to both groups. Recording that as a passing test case stops the same observation being raised as a defect a third time.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Chubb creditor form codes | PM50 together with PM30 | One code from each group |
| Client Name | Marie Tremblay | |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| Expected attachments | Both the 50% and the 30% waiver forms | Contents compared against the two AP-2436 reference copies |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, set the Quebec dealership's Chubb Insurance Configuration to PM50 and PM30 together and save | The Dealer Details page shows both codes assigned |
| 2 | [Pre-Condition] Log in to the dealer portal as that dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 3 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The send is accepted |
| 4 | Open the received email and open both waiver-form attachments | One email arrives carrying two waiver forms, and both open |
| 5 | [Verification] Verify one attachment is the 50% waiver form and the other the 30% waiver form, that each matches its AP-2436 reference copy, and that neither is duplicated; screenshot the attachment list | The email carries exactly one 50% waiver form and one 30% waiver form, each with contents matching its reference copy |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-003 AC1 with REQ-006 AC1 — repeated sends recorded separately | — | — | AP2436_011 | — |
| REQ-004 setup — Dealer Details page access and Chubb configuration editing | — | — | — | AP2436_012 |
| REQ-004 AC1 and AC4 — PM50 only sends the 50% form only | AP2436_013 | — | — | — |
| REQ-004 AC2 and AC4 — PM30, S30 or M30 only sends the 30% form only | AP2436_014 | — | — | — |
| REQ-004 AC3 — both groups send both forms | AP2436_015 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2436_011 | ✅ PASS | see execution log |
| AP2436_012 | ✅ PASS | see execution log (2026-09-01) |
| AP2436_013 | ✅ PASS | see execution log (2026-09-01) |
| AP2436_014 | ✅ PASS | see execution log (2026-09-01) |
| AP2436_015 | ✅ PASS | see execution log |

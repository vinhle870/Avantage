# Test Cases — AP2436 (File 2 of 4)

**Project:** Avantage Plus (AP) — Dealer Portal, release 5.1.0
**Requirement:** AP2436 — Dealer portal: Sending insurance compliance documents
**Source:** requirements/AP-2436-dealer-compliance-documents.md · qa-artifacts/1-requirements-analysis/requirements-analysis.md · qa-artifacts/2-test-plan/test-plan.md
**Date:** 2026-08-28
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2436_006 to AP2436_010 (5 test cases)
**Coverage:** Negative · Edge-case · Functional · API

> **Test data source note.** Accounts and portal URLs come from
> [execute.env.md](../base-test/execute.env.md); vehicles and other shared data come from
> [test-centralized.md](../base-test/test-centralized.md). The dealer login is
> `vinhle870@gmail.com` on Staging (v2staging). Client email addresses are **generated per
> run** as `client.stage.NNN@yopmail.com` and read at
> `https://yopmail.com/en/?login=client.stage.NNN` — the convention is in execute.env.md
> → Email Service and in test-centralized.md → Dynamic Test Data. Use a fresh `NNN` every
> run and write the address used into the execution log.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2436_006 | Pressing Send with both client fields empty blocks the send and shows an error | Negative | High | PASS |
| AP2436_007 | Pressing Send with a malformed client email blocks the send and shows an error | Negative | High | PASS |
| AP2436_008 | A very long client name with accented characters is accepted or clearly limited | Edge-case | Medium | FAIL |
| AP2436_009 | Submitting the form delivers one email to the client address, greeting them by name | Functional | High | FAIL |
| AP2436_010 | The Send request returns a success response, so a server-side failure cannot pass unnoticed | API | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2436_006 — Pressing Send with both client fields empty blocks the send and shows an error

| Field | Value |
|---|---|
| **TC ID** | AP2436_006 |
| **Title** | Pressing Send with both client fields empty blocks the send and shows an error |
| **Requirement** | AP2436 — REQ-002, testability risk on missing validation rules (open question Q-002) |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Both fields rejected as empty with "This value should not be blank."; nothing sent and no register row created. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The story never states that the two fields are required, so this case tests the reasonable expectation rather than a written rule — see open question Q-002. If an empty form sends anyway, compliance documents go nowhere with no warning and the advisor believes the client received them. Any visible, blocking error message counts as a pass; report the exact wording so the product owner can approve or replace it.

**Test Data:**

| Variable | Value |
|---|---|
| Client Name | _(left empty)_ |
| Client Email | _(left empty)_ |
| Expected error text | Not known — the story defines no message. Record the exact text shown. |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal with the Quebec dealer account and open the "Insurance Quick Quote" page | The Insurance Quick Quote page loads with the send button visible |
| 2 | Click "Send compliance documents" | The modal opens with "Client Name" and "Client Email" both empty |
| 3 | Click "Send" without typing anything | The send is blocked and the modal stays open |
| 4 | [Verification] Verify a visible error or required-field message is shown against the empty fields, no success message appears, and record the exact message text with a screenshot | The modal remains open, at least one visible error message names the missing fields, and no email is sent |

---

### AP2436_007 — Pressing Send with a malformed client email blocks the send and shows an error

| Field | Value |
|---|---|
| **TC ID** | AP2436_007 |
| **Title** | Pressing Send with a malformed client email blocks the send and shows an error |
| **Requirement** | AP2436 — REQ-002, testability risk on missing validation rules (open question Q-002) |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Both "client-at-example" and "client@" rejected with "This value is not a valid email address." See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** A typed address is the only route the documents take. An address the system accepts but cannot deliver to means the client never receives a legally required disclosure and nobody finds out, because the story defines no delivery-failure feedback.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Client Name | Marie Tremblay | A valid name, so only the email address is under test |
| Client Email | `client-at-example` | No "@" sign — clearly malformed |
| Client Email, second value | `client@` | Has "@" but no domain — a second shape of the same mistake |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer, open "Insurance Quick Quote" and click "Send compliance documents" | The modal opens with both fields empty |
| 2 | Enter "Marie Tremblay" in "Client Name" and `client-at-example` in "Client Email", then click "Send" | The send is blocked, the modal stays open, and a message about the email address appears |
| 3 | Replace the address with `client@` and click "Send" again | The send is blocked again and a message about the email address appears |
| 4 | [Verification] Verify that neither attempt produced a success message and that no email arrives in the test inbox within two minutes, and record both error messages with screenshots | Both malformed addresses are rejected, the modal stays open, and the test inbox receives nothing |

---

### AP2436_008 — A very long client name with accented characters is accepted or clearly limited

| Field | Value |
|---|---|
| **TC ID** | AP2436_008 |
| **Title** | A very long client name with accented characters is accepted or clearly limited |
| **Requirement** | AP2436 — REQ-002 and REQ-003 acceptance criterion 2 (the name is substituted into the email greeting) |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL — BUG: a client name of 256 characters or more returns HTTP 500 (255 → 200 OK, 256 → 500). Accented names render perfectly in the email greeting. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** This case uses boundary value analysis — testing the exact edges of an allowed range, where off-by-one mistakes hide. The story sets no maximum length, so the point is to find out what the field actually does and whether the value survives into the email greeting. Quebec client names routinely carry accents, so a name such as "Josée Côté" arriving as "Jos?e C?te" in a compliance email would look careless to the client.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Client Name, accented | Josée Côté-Bélanger | Ordinary Quebec name with accents, an apostrophe-free hyphen |
| Client Name, long | The letter "A" repeated 300 times | Well past any sensible limit; the field either caps the input or accepts it |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | Must be an inbox the tester can open |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer, open "Insurance Quick Quote" and click "Send compliance documents" | The modal opens with both fields empty |
| 2 | Enter "Josée Côté-Bélanger" in "Client Name", the test inbox address in "Client Email", and click "Send" | The send is accepted and the modal closes or reports success |
| 3 | Reopen the modal, paste the 300-character name into "Client Name", note whether the field truncates it, enter the test inbox address and click "Send" | The field either caps the input at a visible limit or accepts all 300 characters; the recorded behaviour is noted either way |
| 4 | [Verification] Open both received emails and verify the greeting shows the name exactly as typed, with accents intact and no replacement characters, and screenshot both greetings | Both emails arrive; the first greeting reads "Dear Josée Côté-Bélanger," with correct accents, and the second shows whatever the field accepted, without corrupted characters |

---

### AP2436_009 — Submitting the form delivers one email to the client address, greeting them by name

| Field | Value |
|---|---|
| **TC ID** | AP2436_009 |
| **Title** | Submitting the form delivers one email to the client address, greeting them by name |
| **Requirement** | AP2436 — REQ-003, acceptance criteria 1 and 2 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL — Email delivered and greets by name, but the body text bears no resemblance to the story copy — it is a longer bilingual message citing the AMF and the Office de la protection du consommateur. Likely the story is out of date. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** This is the happy path the whole story exists to produce, and it is the case QC already confirmed once on 2026-08-23. It is repeated here as the baseline that every attachment test in files 3 and 4 builds on: if this fails, nothing downstream can be judged.

**Test Data:**

| Variable | Value |
|---|---|
| Client Name | Marie Tremblay |
| Client Email | **Dynamic — the executor generates it.** Pattern `client.stage.NNN@yopmail.com`, where `NNN` is the next unused three-digit number for this run, e.g. `client.stage.001@yopmail.com`. Use a fresh number every run so an email from an earlier run can never be mistaken for this one. |
| Inbox to read | `https://yopmail.com/en/?login=client.stage.NNN` — the same local part, without `@yopmail.com`. Yopmail needs no sign-up and no mailbox setup: an address exists the moment something is sent to it. |
| Expected greeting | Dear Marie Tremblay, |
| Expected body line | Please find attached our updated insurance conformity documents. |
| Expected arrival window | Two minutes — a test assumption, not a stated requirement, because the story quantifies no delivery time |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Generate an unused Yopmail address for this run (`client.stage.NNN@yopmail.com`), open `https://yopmail.com/en/?login=client.stage.NNN`, and confirm the inbox is empty | The generated address is written into the execution log, and the Yopmail inbox shows no messages |
| 2 | [Pre-Condition] Log in as the Quebec dealer and open the "Insurance Quick Quote" link on the Dashboard | The page loads with heading "Creditors Insurance Quick Quote" and the send control visible |
| 3 | Click "Send compliance documents", enter "Marie Tremblay" in "Client Name" and the generated Yopmail address in "Client Email", then click "Send" and record whatever the portal shows afterwards, including the absence of any message | Both fields show the values typed; the modal closes or reports an outcome, and the observed behaviour is recorded because the story defines no success message |
| 4 | Reload the Yopmail inbox and wait up to two minutes for the email | Exactly one new email arrives, addressed to the generated Yopmail address |
| 5 | [Verification] Verify the body reads "Dear Marie Tremblay," followed by "Please find attached our updated insurance conformity documents.", that at least one file is attached, and screenshot the open email | The greeting carries the name typed in "Client Name", the body line matches the story, and the email carries attachments |

---

### AP2436_010 — The Send request returns a success response, so a server-side failure cannot pass unnoticed

| Field | Value |
|---|---|
| **TC ID** | AP2436_010 |
| **Title** | The Send request returns a success response, so a server-side failure cannot pass unnoticed |
| **Requirement** | AP2436 — REQ-003, testability risk on missing on-screen feedback (open question Q-003) |
| **Type** | API |
| **Priority** | Medium |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Send returns 302 then the banner "Compliance documents have been sent."; four direct POSTs returned HTTP 200 with the success text. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The story defines no confirmation message, so on screen a failed send looks exactly like a successful one. Watching the network request the modal issues gives the run one honest signal about whether the server accepted the send. Without it, a report saying "sent" would rest on nothing.

**Test Data:**

| Variable | Value |
|---|---|
| Client Name | Marie Tremblay |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service |
| Expected HTTP status | Any 2xx response. Record the actual status code and the request path, because neither is specified in the story. |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer, open "Insurance Quick Quote", and start capturing network requests in the browser | Network capture is active before the modal is opened |
| 2 | Click "Send compliance documents", fill "Client Name" and "Client Email" with the test values, and click "Send" | The request is issued and appears in the captured network traffic |
| 3 | [Verification] Verify the captured request for the send returned a 2xx status, record its path and status code, and confirm no 4xx or 5xx response was returned for that action | The send request returns a 2xx status; its path and code are recorded in the execution log so a later failure can be compared against this baseline |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-002 — required-field validation (Q-002) | — | AP2436_006 | — | — |
| REQ-002 — email format validation (Q-002) | — | AP2436_007 | — | — |
| REQ-002 — client name length and accented characters | — | — | AP2436_008 | — |
| REQ-003 AC1 — email delivered to the typed address | AP2436_009 | — | — | — |
| REQ-003 AC2 — greeting uses the typed client name | AP2436_009 | — | AP2436_008 | — |
| REQ-003 — send outcome is observable (Q-003) | AP2436_010 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2436_006 | ✅ PASS | see execution log |
| AP2436_007 | ✅ PASS | see execution log |
| AP2436_008 | ❌ FAIL | see execution log |
| AP2436_009 | ❌ FAIL | see execution log |
| AP2436_010 | ✅ PASS | see execution log |

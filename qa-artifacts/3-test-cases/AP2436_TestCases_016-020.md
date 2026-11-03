# Test Cases — AP2436 (File 4 of 4)

**Project:** Avantage Plus (AP) — Dealer Portal, release 5.1.0
**Requirement:** AP2436 — Dealer portal: Sending insurance compliance documents
**Source:** requirements/AP-2436-dealer-compliance-documents.md · qa-artifacts/1-requirements-analysis/requirements-analysis.md · qa-artifacts/2-test-plan/test-plan.md
**Date:** 2026-08-28
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2436_016 to AP2436_020 (5 test cases)
**Coverage:** Negative · Functional · UI

> **Three cases in this file wait on an answer from the product owner.** AP2436_016 covers
> a state the story never defines (open question Q-004), and AP2436_019 and AP2436_020
> describe features the story states in one sentence each without naming a screen (open
> questions Q-006 and Q-007). Execute them anyway and record what is found, but mark them
> `BLOCKED` rather than `FAIL` if there is no agreed expected result to judge against. A
> blocked case must never be reported as a pass.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2436_016 | A dealer with no Chubb configuration sends documents — record which waiver forms arrive | Negative | High | OBSERVED |
| AP2436_017 | The Talk Insurance PDF arrives pre-filled with the dealership name and its assigned products | Functional | High | PASS |
| AP2436_018 | The protection summary and the commission disclosure arrive with contents matching the reference copies | Functional | High | FAIL |
| AP2436_019 | Each send appears in the register with its date and time, for both the dealer and Avantage Plus | Functional | High | FAIL |
| AP2436_020 | The dealer can download the pre-filled disclosure PDFs without sending an email | Functional | Medium | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2436_016 — A dealer with no Chubb configuration sends documents — record which waiver forms arrive

| Field | Value |
|---|---|
| **TC ID** | AP2436_016 |
| **Title** | A dealer with no Chubb configuration sends documents — record which waiver forms arrive |
| **Requirement** | AP2436 — REQ-004 testability risk (open question Q-004) |
| **Type** | Negative |
| **Priority** | High |
| **Status** | BLOCKED |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | BLOCKED — Blocked by AP2436_012 — the configuration cannot be emptied, so Q-004 stays unanswered by testing as well as by the story. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** This is error guessing — deliberately trying the state a developer is least likely to have thought about. The story only says which form to send when a code is present, and never says what happens when no code is assigned at all. QC ran into something close to this on 2026-08-23. If a dealer with no Chubb configuration still emails a client both waiver forms, that client is handed disclosures for insurance products their dealer does not even sell. Record the behaviour precisely; the product owner needs it to answer Q-004.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Chubb creditor form codes | None assigned | Every creditor form code removed from the dealership |
| Client Name | Marie Tremblay | |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| Expected result | Not known — the story defines no behaviour for an empty configuration. Record whether no waiver form, one, or both arrive, and whether the send is blocked. | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, remove every Chubb creditor form code from the Quebec dealership and save | The Dealer Details page shows no creditor form code assigned |
| 2 | [Pre-Condition] Log in to the dealer portal as that dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 3 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The observed outcome is recorded, whether the send is accepted, blocked, or reports an error |
| 4 | [Verification] Verify what arrived in the test inbox — no email, an email with no waiver form, or an email carrying one or both waiver forms — and screenshot the attachment list or the empty inbox | The behaviour is recorded and screenshotted as an observation against open question Q-004, not scored as a pass or a fail |

---

### AP2436_017 — The Talk Insurance PDF arrives pre-filled with the dealership name and its assigned products

| Field | Value |
|---|---|
| **TC ID** | AP2436_017 |
| **Title** | The Talk Insurance PDF arrives pre-filled with the dealership name and its assigned products |
| **Requirement** | AP2436 — REQ-005, acceptance criteria 1 to 3 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | PASS — Generated per send by pypdf with filled AcroForm fields: AccountName "Test QA staging", AccountAddress "Address cccc QC 22222", InsurerName localised per language. Both language variants always sent, which answers Q-005. The product list sits in compressed page content — a person must still open the PDF to check it. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** A pre-filled document is a document that makes a factual claim about a specific dealership. If the wrong company name appears under "Nom du distributeur", or the product list shows insurance the dealer does not sell, the client has been handed a paper that says something untrue about the business they are buying from. The story does not say what form the product list should take — open question Q-005 covers the related language rule — so compare against the *Parlons assurances + Sommaire* PDFs attached to AP-2436 and record any difference in layout rather than guessing.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Chubb creditor form codes | PM50 and PM30 together | A configuration with a known product list, so the list in the PDF can be checked against it |
| Dealership name | The Quebec dealership's registered company name, as shown on the Dealer Details page | Copy it exactly, including punctuation |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| Reference copies | "ParlonAssurance + Sommaire Francais.pdf" and "Parlon Assurance + sommaire Anglais.pdf", attached to AP-2436 | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the admin area, note the Quebec dealership's exact company name and the full list of products assigned through its Chubb Insurance Configuration | Both the company name and the assigned product list are written down before the send |
| 2 | [Pre-Condition] Log in to the dealer portal as that dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 3 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, click "Send", then open the received Talk Insurance attachment | The email arrives and the Talk Insurance PDF opens |
| 4 | [Verification] Verify the "Nom du distributeur" section shows the dealership name recorded in step 1, and that the products listed match the assigned list with no extra and no missing product; screenshot both pages of the PDF | The company name matches exactly and the product list matches the Chubb configuration recorded in step 1 |
| 5 | [Verification] Verify which language variant arrived and compare its layout against the matching reference copy attached to AP-2436, recording any difference | The language received is recorded against open question Q-005, and any layout difference from the reference copy is noted with a screenshot |

---

### AP2436_018 — The protection summary and the commission disclosure arrive with contents matching the reference copies

| Field | Value |
|---|---|
| **TC ID** | AP2436_018 |
| **Title** | The protection summary and the commission disclosure arrive with contents matching the reference copies |
| **Requirement** | AP2436 — REQ-005, acceptance criteria 1, 4 and 5 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL — All six attachments open and are correct, but the commission-percentage disclosure ("Divulgation du pourcentage de rémunération") is not attached in either language, though the body promises a disclosure notice "when applicable". See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The story's French description asks for three documents, and one of them — the commission-percentage disclosure, "Divulgation du pourcentage de rémunération" — is never mentioned again in the acceptance criteria. That makes it the easiest of the three to be missed in the build and in testing alike. The product owner confirmed on 2026-08-26 that file names do not matter, so each attachment has to be opened and read rather than judged from its name in the attachment list.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Expected documents | The protection summary ("Sommaire des protections"), the Talk Insurance document ("Parlons assurances") and the commission disclosure ("Divulgation du pourcentage de rémunération") | The waiver forms are covered separately by AP2436_013 to AP2436_015 |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| File name rule | File names are not checked. Only the contents are judged, per the product owner's answer of 2026-08-26. | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer, empty the client test inbox, and open "Insurance Quick Quote" | The inbox is empty and the send button is visible |
| 2 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The send is accepted |
| 3 | Open the received email and open every attachment in turn, listing what each one actually contains | Every attachment opens and its contents are identified by reading it, not by its file name |
| 4 | [Verification] Verify the protection summary, the Talk Insurance document and the commission-percentage disclosure are all present among the attachments; screenshot the attachment list and the first page of each | All three documents are present in the email, identified by their contents |
| 5 | [Verification] Verify no attachment is corrupted, blank, or a duplicate of another, and note any document from the story that is missing entirely | Every attachment opens and renders, none is a duplicate, and any missing document is named explicitly in the execution log |

---

### AP2436_019 — Each send appears in the register with its date and time, for both the dealer and Avantage Plus

| Field | Value |
|---|---|
| **TC ID** | AP2436_019 |
| **Title** | Each send appears in the register with its date and time, for both the dealer and Avantage Plus |
| **Requirement** | AP2436 — REQ-006, acceptance criteria 1 to 3 |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL — Dealer side exists and is correct — "Insurance compliance log" at /insurance-compliance-log, one timestamped row per successful send. There is NO Avantage Plus view: /admin/insurance-compliance-log returns 404 and no such route appears among the 49 admin navigation links. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** The register is the evidence half of a legal obligation. Sending the documents without recording the send leaves Avantage Plus with nothing to point at if a client later says they never received their disclosures. The story asks for the register in one sentence and names no screen on either side, which is open question Q-006 — so this case may have to search for the feature. If no register can be found anywhere, that is a finding worth a ticket, not a silent pass. Mark the case `BLOCKED` if the screen cannot be located and the answer to Q-006 has not arrived.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Client Name | Marie Tremblay | |
| Client Email | A fresh Yopmail address generated for this run, pattern `client.stage.NNN@yopmail.com` — see [execute.env.md](../base-test/execute.env.md) → Email Service | |
| Send time | The wall-clock time of the send, noted to the minute | Compared against the timestamp shown in the register |
| Register location | Not known — the story names no page. Search the dealer area and the admin area, and record where it was found or that it was not found. | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer, open "Insurance Quick Quote", and note the current wall-clock time | The send button is visible and the time is recorded |
| 2 | Click "Send compliance documents", enter "Marie Tremblay" and the test inbox address, and click "Send" | The send is accepted |
| 3 | Search the dealer area for a list of compliance-document sends — a history, log or register screen — and open it | Either a register screen is found and opened, or the search is recorded as having found nothing |
| 4 | [Verification] Verify the register shows a row for this send with the client name, the client email and a date and time matching the time noted in step 1; screenshot the row | A row for this send exists with a timestamp matching the send, or the absence of any register is recorded with the pages searched |
| 5 | [Verification] Log in to the Avantage Plus admin area and verify the same send is visible there too, with the same date and time; screenshot it | Avantage Plus staff can see the same send with the same timestamp, or the absence is recorded and the case is marked BLOCKED against open question Q-006 |

---

### AP2436_020 — The dealer can download the pre-filled disclosure PDFs without sending an email

| Field | Value |
|---|---|
| **TC ID** | AP2436_020 |
| **Title** | The dealer can download the pre-filled disclosure PDFs without sending an email |
| **Requirement** | AP2436 — REQ-007, acceptance criterion 1 |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | FAIL |
| **Executed on** | 2026-08-29, Staging (v2staging), Chromium 1280 × 800 |
| **Result** | FAIL — No download control on any of the five pages searched (/quick-insurance-quote, /quick-insurance-quote/gap, /compliance-documents/send, /insurance-compliance-log, /). Compliance-log rows carry no link, so a past send cannot be re-downloaded either. See [execution-log_AP-2436_2026-08-29.md](../4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md). |

**Why this matters:** This requirement appears only in the French description and never in the acceptance-criteria field, which is exactly how a small requirement gets dropped from a build without anyone noticing. It matters to the advisor with a client sitting in front of them who needs paper now, not an email. Because no control and no page are named — open question Q-007 — search for it and record the result. If the download does not exist, the honest outcome is either a ticket or confirmation that it was deferred out of Phase 1; it is not a pass.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Download location | Not known — the story says only "un accès rapide" (a quick access). Search the Insurance Quick Quote page, the Quote Details page and the send modal. | |
| Expected documents | The pre-filled PDF versions of the disclosure documents | Compared against what the email delivers in AP2436_017 and AP2436_018 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as the Quebec dealer and open the "Insurance Quick Quote" page | The Insurance Quick Quote page loads |
| 2 | Search the page, the "Quote Details" page and the "Send compliance documents" modal for a download link or button offering the disclosure documents | Either a download control is found, or every page searched is recorded as not offering one |
| 3 | If a download control exists, use it and open each downloaded file | Each downloaded file opens and its contents can be read |
| 4 | [Verification] Verify the downloaded documents are pre-filled with the dealership's name and product list in the same way as the emailed copies, and screenshot the download control and one opened file | The downloaded PDFs are pre-filled and match the emailed versions, or the absence of any download control is recorded with the pages searched and the case is marked BLOCKED against open question Q-007 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 — empty Chubb configuration (Q-004) | — | AP2436_016 | — | — |
| REQ-005 AC1–AC3 — Talk Insurance PDF pre-filled with dealer name and products | AP2436_017 | — | — | — |
| REQ-005 AC1, AC4, AC5 — protection summary and commission disclosure contents | AP2436_018 | — | — | — |
| REQ-006 AC1–AC3 — timestamped register on both sides (Q-006) | AP2436_019 | — | — | — |
| REQ-007 AC1 — quick download of pre-filled PDFs (Q-007) | AP2436_020 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2436_016 | 📋 OBSERVED | see execution log (2026-09-01) |
| AP2436_017 | ✅ PASS | see execution log |
| AP2436_018 | ❌ FAIL | see execution log |
| AP2436_019 | ❌ FAIL | see execution log |
| AP2436_020 | ❌ FAIL | see execution log |

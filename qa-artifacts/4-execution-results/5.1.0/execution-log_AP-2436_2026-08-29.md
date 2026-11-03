# Execution Log

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill
**Date:** 2026-08-29
**Base URL:** https://v2staging.garantieavantageplus.ca
**Browser:** Chromium (Playwright), viewport 1280 × 800
**Duration:** 14:45 → 15:15 (UTC), plus a re-run of AP2436_002 and AP2436_004 at 15:22 after the QA supplied the Quote Details route. Portal timestamps are Eastern time (UTC−4), so a send made at 15:03 UTC is logged by the application as 11:03 AM.
**Dealer account:** `vinhle870@gmail.com`, dealership label "Test QA staging"
**Client inboxes used:** `client.stage.001` … `client.stage.005` at yopmail.com

| Metric | Value |
|---|:---:|
| Total test cases | 20 |
| Passed | 9 |
| Failed | 7 |
| Blocked | 4 |
| Skipped | 0 |
| **Pass rate** | **45 % (9 of 20)** — 56 % (9 of 16) counting only cases that could be run |

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2436_001 | Quebec dealer on Insurance Quick Quote sees the send button | High | ✅ | 3 | 0 | `.../AP2436_001-step4-SendComplianceDocsButtonVisible_pass.png` | Button present and enabled; province now evidenced by the PDF address field |
| AP2436_002 | Same button on the Quote Details page | High | ✅ | 4 | 0 | `.../AP2436_002-step4-QuoteDetailsSendButton_pass.png` | Re-run 15:22 on the route the QA supplied; button present, and it pre-fills the client email |
| AP2436_003 | French label in dark button style | Medium | ✅ | 3 | 0 | `.../AP2436_003-step3-FrenchLabelDarkButton_pass.png` | Label matches the story exactly, "comformité" typo included |
| AP2436_004 | Non-Quebec dealer — record what appears | Medium | ❌ | 2 | 1 | `.../AP2436_004-step4-OntarioClientButtonStillShown_fail.png` | Partly answered: an **Ontario client** still gets the button. Dealer-province gate still untested |
| AP2436_005 | Modal asks only client name, email, Send | High | ❌ | 4 | 1 | `.../AP2436_005-step5-FrenchModalLabels_fail.png` | French email label reads "Courriel du client", story says "Adresse courriel" |
| AP2436_006 | Empty fields block the send | High | ✅ | 4 | 0 | `.../AP2436_006-step4-EmptyFieldsBlankErrors_pass.png` | "This value should not be blank." on both fields |
| AP2436_007 | Malformed email blocks the send | High | ✅ | 4 | 0 | `.../AP2436_007-step4-InvalidEmailRejected_pass.png` | Both malformed shapes rejected with a clear message |
| AP2436_008 | Long and accented client name handled | Medium | ❌ | 3 | 1 | `.../AP2436_008-step3-LongName500Error_fail.png` | BUG: 256-character name returns HTTP 500. Accents are fine |
| AP2436_009 | One email delivered, greeting by name | High | ❌ | 4 | 1 | `.../AP2436_009-step5-EmailSixAttachments_fail.png` | Email arrives and greets by name, but the body text is nothing like the story's |
| AP2436_010 | Send request returns a success response | Medium | ✅ | 3 | 0 | `.../AP2436_009-step3-SendSuccessBanner_pass.png` | 302 then banner "Compliance documents have been sent." |
| AP2436_011 | Two sends produce two separate emails | Medium | ✅ | 5 | 0 | `.../AP2436_011-step5-TwoSeparateEmails_pass.png` | Two emails, two register rows (log IDs 11 and 12) |
| AP2436_012 | Admin can change a dealer's Chubb configuration | High | 🚫 | 1 | 0 | — | The dealership behind the test login is not findable in Admin → Dealers |
| AP2436_013 | PM50 only sends the 50 % waiver form only | High | 🚫 | 0 | 0 | — | Blocked by AP2436_012 — configuration cannot be changed |
| AP2436_014 | 30 % code only sends the 30 % waiver form only | High | 🚫 | 0 | 0 | — | Blocked by AP2436_012 |
| AP2436_015 | Both groups send both waiver forms | High | ✅ | 5 | 0 | `.../AP2436_015-step1-FormDropdownBothPM30PM50_pass.png` | Precondition proved from the dealer portal instead of the admin page |
| AP2436_016 | Empty Chubb configuration — record behaviour | High | 🚫 | 0 | 0 | — | Blocked by AP2436_012 |
| AP2436_017 | Talk Insurance PDF pre-filled with dealer details | High | ✅ | 4 | 0 | `.../AP2436_009-step5-EmailSixAttachments_fail.png` | Dealer name, address and insurer pre-filled; product list not verified |
| AP2436_018 | Protection summary and commission disclosure present | High | ❌ | 3 | 1 | `.../AP2436_009-step5-EmailSixAttachments_fail.png` | No commission-percentage disclosure is attached |
| AP2436_019 | Register readable by dealer and by Avantage Plus | High | ❌ | 4 | 1 | `.../AP2436_019-step4-DealerComplianceLogRow_pass.png` | Dealer side exists and is correct; there is no Avantage Plus side |
| AP2436_020 | Dealer can download the pre-filled PDFs | Medium | ❌ | 2 | 1 | — | No download control on any of the five pages searched |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED
> Screenshot paths are relative to `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2436/`.

---

## Step-by-Step Results

### AP2436_001 — Quebec dealer on Insurance Quick Quote sees the send button — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in to the dealer portal | Dealer dashboard with the dealership name | URL = `/`; heading = "Hi Vinh Le 1 Welcome to Test QA staging's account"; header label = "Test QA staging" | ✅ | Login worked first attempt |
| 2 `[Pre-Condition]` | Confirm the dealership's province is Quebec | Province shows Quebec | No province field is visible anywhere in the dealer portal, and Admin → Dealers has no province column. **Indirect evidence found later:** the generated Talk Insurance PDF carries `AccountAddress` = "Address cccc QC 22222", so the dealership's address is in QC | ⚠ indirect | Not a first-class province field, but strong enough to treat the Quebec precondition as satisfied |
| 3 | Open "Insurance Quick Quote" | Page loads with the quote form | URL = `/quick-insurance-quote`; heading = "Creditors Insurance Quick Quote"; the Creditors Insurance Quote form is visible | ✅ | The link is on the Dashboard, not the left nav — test case corrected |
| 4 `[Verification]` | Verify the send control is visible and enabled | Control visible and clickable | Control "Send compliance documents" visible = true, enabled = true, `class="btn btn-dark"`, href = `/compliance-documents/send?redirectUrl=/quick-insurance-quote` | ✅ | Rendered as a styled link, not an HTML `button` — cosmetic, not raised |

**Screenshots:**
- `AP2436_001-step4-SendComplianceDocsButtonVisible_pass.png` — Quick Quote page with the send control in the page navigation

---

### AP2436_002 — Same button on the Quote Details page — Step Results

> **Re-run at 15:22** after the QA supplied the route: Quotes → **Create a quote** → enter the client (and vehicle) → the Quote Details page opens. The first attempt at 15:07 was marked Blocked because it looked in the wrong place — the warranty `/quotes` list rows and the in-place insurance quote result. That earlier reading was wrong; the page does exist.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in as the Quebec dealer | Dealer area loads | Logged in as "Test QA staging" | ✅ | — |
| 2 `[Pre-Condition]` | Quotes → "Create a quote" → fill the client form and save | A quote exists and its details page opens | `/quotes` → "Create a quote" → `/quote/new/client` (heading "Create a quote"). Saved a client with `province` = "1: Québec"; the server redirected to **`/quote/6276/details`**, heading `#6276 - Marie Tremblay` | ✅ | Both `telWork` and `telHome` are required on the client form — the first save failed with "This value should not be blank." on `telWork` |
| 3 | Open the Quote Details page for that quote | Quote Details page loads | URL = `/quote/6276/details`; the page offers Back, Edit, "Add a vehicle", Road Side Protection, Permaplate, DYR Rates, "Add a financing", "Create sale", "Add exchange vehicle" | ✅ | The send button is present with no vehicle attached yet, so it does not depend on the vehicle |
| 4 `[Verification]` | Verify the send control is present and enabled | Control visible and enabled | Control "Send compliance documents" visible = true, enabled = true, `class="btn btn-dark"`, href = `/compliance-documents/send?redirectUrl=/quote/6276/details&clientEmail=client.stage.010@yopmail.com` | ✅ | **AC2 met.** Same dark-button styling as on Quick Quote |

**Screenshots:**
- `AP2436_002-step4-QuoteDetailsSendButton_pass.png` — Quote Details `#6276` with the send control in the header
- `AP2436_002-step4-QuoteResultWithSendButton_fail.png` — kept from the first attempt: the in-place insurance quote result, which also carries the control

**Bonus finding — the pre-fill is only half done.** Opened from Quote Details, the form arrives with `clientEmail` = "client.stage.010@yopmail.com" already filled from the quote, but `clientName` is **empty**, even though the quote knows the name and the page heading reads "#6276 - Marie Tremblay". The advisor has to retype a name the system already holds, and a typo there lands in the client's email greeting. Small usability defect, worth a low-priority ticket.

---

### AP2436_003 — French label in dark button style — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in and open Insurance Quick Quote | Page loads with the send control | Loaded in English | ✅ | — |
| 2 | Switch the portal language to French | Page reloads in French | Heading became "Cotation rapide d'assurance crédit"; navigation switched to French | ✅ | Switched through System preferences → Language settings |
| 3 `[Verification]` | Verify the label text and the dark button style | Reads "Envoyer les documents de comformité", dark button | Control text = "Envoyer les documents de comformité"; `class="btn btn-dark"` | ✅ | Matches the story **character for character, including the "comformité" misspelling**. Reported as a Low finding against Q-008 — correct French is "conformité" |

**Screenshots:**
- `AP2436_003-step3-FrenchLabelDarkButton_pass.png` — the French Quick Quote page with the dark send button

---

### AP2436_004 — Non-Quebec dealer — record what appears — Step Results

> **Partly run at 15:22.** Creating a quote exposed a second province concept: the client form carries its own `province` dropdown (1 Québec, 2 Ontario, 3 British Columbia, 4 Alberta, 5 Manitoba …). That made it possible to test whether the *client's* province gates the feature, without a second dealer login.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in with a dealer whose province is not Quebec | Non-Quebec dealership loads | Still not possible — only one dealer login exists. Non-Quebec test **dealerships** do exist in Admin → Dealers ("ONTARIO TAX TEST", "TESTING Alberta", "TESTING for BC", "TESTING Nova Scotia", "SASKATCHEWAN TEST", "Manitoba TEst", "NF Test", "PEI TEST", "NWT TEST", "YUKON TEST", "NUNAVUT TEST"), so only a dealer-user password is missing | 🚫 | The dealer-province half of this case is still blocked |
| 2 | Create a quote for a client whose province is **not** Quebec | Quote saved | Saved a client with `province` = "2: Ontario" — John Smith, 200 Bay Street, Toronto, M5J 2J2. Server redirected to `/quote/6277/details`, heading `#6277 - John Smith` | ✅ | — |
| 3 `[Verification]` | Verify whether the send control appears for that quote | Behaviour recorded | Control "Send compliance documents" visible = true, enabled = true, href = `/compliance-documents/send?redirectUrl=/quote/6277/details&clientEmail=client.stage.011@yopmail.com`. Identical to the Québec client's quote | ❌ | **The client's province does not gate the feature.** An Ontario client's quote offers the same compliance-document send as a Québec one |

**Screenshots:**
- `AP2436_004-step4-OntarioClientButtonStillShown_fail.png` — Quote Details `#6277` for an Ontario client, send control present

**What this means for Q-001.** The story restricts the feature to Quebec. "Quebec" could mean the dealership's province or the client's province on the quote. The client one is now tested and **not** enforced. If the product owner meant the client, this is a defect: an Ontario client can be sent Quebec-specific disclosures citing the Autorité des marchés financiers and the Office de la protection du consommateur, neither of which governs Ontario. If they meant the dealership, that half is still open and needs a non-Quebec dealer login. Marked Failed rather than Blocked because a real, unwanted behaviour was observed.

---

### AP2436_005 — Modal asks only client name, email, Send — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Insurance Quick Quote in English | Page loads with the send control | Loaded | ✅ | — |
| 2 | Click "Send compliance documents" | A modal opens and blocks the page behind it | A `dialog` element opened with heading "Send compliance documents"; the page behind it was inert | ✅ | — |
| 3 `[Verification]` | Verify exactly three controls and no others | Client Name, Client Email, Send — nothing else | Textbox "Client name*", textbox "Client email*", button "Send". No other input present | ✅ | Story writes "Client Name"/"Client Email"; the build uses lower-case "name"/"email" plus a required asterisk. Not raised — same words, different casing |
| 4 | Switch to French and reopen the modal | Modal reopens in French | Reopened; heading = "Envoyer les documents de comformité" | ✅ | — |
| 5 `[Verification]` | Verify the three French labels | "Nom du client", "Adresse courriel", "Envoyer" | Labels = "Nom du client" ✓ and **"Courriel du client"** ✗; button = "Envoyer" ✓ | ❌ | The story specifies "Adresse courriel". The build says "Courriel du client". A wording difference only — nothing is broken, but the two must be reconciled before sign-off |

**Screenshots:**
- `AP2436_005-step3-ModalThreeControlsEnglish_pass.png` — the English modal with exactly three controls
- `AP2436_005-step5-FrenchModalLabels_fail.png` — the French form showing "Courriel du client"

**Additional observation.** Submitting the modal navigates to a full page at `/compliance-documents/send`, and validation errors are then shown on that full page rather than inside the modal. The story describes only a modal. Worth confirming this is intended, because the dealer loses the quote page context on every failed attempt.

---

### AP2436_006 — Empty fields block the send — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Insurance Quick Quote | Page loads | Loaded | ✅ | — |
| 2 | Click "Send compliance documents" | Modal opens with both fields empty | Both fields empty | ✅ | — |
| 3 | Click "Send" with nothing typed | Send blocked | Page went to `/compliance-documents/send` and re-rendered the form with errors | ✅ | Validation is server-side, so the form round-trips |
| 4 `[Verification]` | Verify a visible error, no success, no email | Error naming the missing fields; nothing sent | Both fields show `Error This value should not be blank.`; no success banner; nothing arrived in any test inbox | ✅ | Answers half of Q-002 — both fields are indeed required |

**Screenshots:**
- `AP2436_006-step4-EmptyFieldsBlankErrors_pass.png` — both fields flagged "This value should not be blank."

---

### AP2436_007 — Malformed email blocks the send — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the send form | Form open with empty fields | Open | ✅ | — |
| 2 | Enter "Marie Tremblay" and `client-at-example`, click "Send" | Send blocked with a message about the address | Client email field shows `Error This value is not a valid email address.`; the name field kept "Marie Tremblay" and showed no error | ✅ | — |
| 3 | Replace with `client@` and click "Send" | Blocked again | Same message: `This value is not a valid email address.` | ✅ | Both malformed shapes are caught |
| 4 `[Verification]` | Verify no success and no email delivered | No success banner; nothing in the inbox | No success banner on either attempt; the compliance register gained no row for either attempt | ✅ | Register rows jump from ID 10 to ID 11, confirming neither rejected attempt was recorded or sent |

**Screenshots:**
- `AP2436_007-step4-InvalidEmailRejected_pass.png` — the "not a valid email address" error

---

### AP2436_008 — Long and accented client name handled — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the send form | Form open | Open | ✅ | — |
| 2 | Send with "Josée Côté-Bélanger" to `client.stage.003@yopmail.com` | Send accepted | Accepted, HTTP 200, success banner shown | ✅ | — |
| 3 | Send with a 300-character name to `client.stage.004@yopmail.com` | The field caps the input or accepts it | **HTTP 500 Internal Server Error.** The dealer is dropped on an error page with no message about what went wrong. Reproduced through the form and again through a direct request. Boundary probed: 100 → 200 OK, 200 → 200 OK, 255 → 200 OK, **256 → 500**, 260 → 500 | ❌ | **BUG.** A client name of 256 characters or more crashes the send. The exact 255/256 boundary points at an unvalidated 255-character database column. A real advisor pasting a long company name as the client name loses the page and is told nothing; worse, they cannot tell whether the client received the documents |
| 4 `[Verification]` | Verify both greetings render with accents intact | Greeting shows the name exactly, accents correct | `client.stage.003` received the email with `Bonjour Josée Côté-Bélanger,` and `Hello Josée Côté-Bélanger,` — every accent correct, no replacement characters. `client.stage.004` received nothing, matching the 500 | ⚠ mixed | Accent handling is correct. The long-name case has no email to check because the request failed |

**Screenshots:**
- `AP2436_008-step3-LongName500Error_fail.png` — the HTTP 500 page after submitting a 300-character client name
- `AP2436_008-step4-AccentedGreetingIntact_pass.png` — the received email greeting with accents intact

---

### AP2436_009 — One email delivered, greeting by name — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Generate a Yopmail address and confirm the inbox is empty | Address recorded; inbox empty | Generated `client.stage.001@yopmail.com`; inbox empty at start | ✅ | — |
| 2 `[Pre-Condition]` | Open Insurance Quick Quote as the dealer | Page loads with the send control | Loaded | ✅ | — |
| 3 | Enter "Marie Tremblay" and the address, click "Send", record what the portal shows | Modal closes or reports an outcome | Redirected to `/quick-insurance-quote` with an `alert` reading **"Compliance documents have been sent."** and a Close button | ✅ | **Answers Q-003 — a success confirmation does exist.** The story never mentioned one |
| 4 | Reload the inbox and wait up to two minutes | Exactly one new email | Exactly one email arrived within seconds. Subject "Compliance documents", from "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>", received 10:03:14 PM local browser time | ✅ | Sender and subject are now known, closing part of a Medium risk on REQ-003 |
| 5 `[Verification]` | Verify the body reads "Dear Marie Tremblay," then "Please find attached our updated insurance conformity documents.", with at least one attachment | Body matches the story; attachments present | Six attachments present. The body does **not** match. It is bilingual and much longer: `Bonjour Marie Tremblay,` / `Hello Marie Tremblay,` followed by "Vous trouverez en pièces jointes les documents suivants…" / "Please find attached the following documents…" and a four-item list — credit-insurance product summary, an Autorité des marchés financiers information sheet, a legal-warranty notice required by the Office de la protection du consommateur, and a disclosure notice "when applicable" | ❌ | The name substitution works, which was the point of the criterion. But the specified copy is absent. The build's text is bilingual and names Quebec regulators, so it looks like deliberate newer copy and the story's example line looks stale. Needs the product owner to confirm which is correct — do not "fix" the build to match the story without asking |

**Screenshots:**
- `AP2436_009-step3-SendSuccessBanner_pass.png` — the "Compliance documents have been sent." banner
- `AP2436_009-step5-EmailSixAttachments_fail.png` — the received email, its bilingual body and all six attachments

---

### AP2436_010 — Send request returns a success response — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Start capturing network traffic before opening the modal | Capture active | Active | ✅ | — |
| 2 | Fill the form and click "Send" | Request issued | The form POSTs to `/compliance-documents/send?redirectUrl=/quick-insurance-quote` and the server answers with a redirect to `/quick-insurance-quote` | ✅ | — |
| 3 `[Verification]` | Verify a 2xx response and no 4xx or 5xx | Send request returns 2xx | Confirmed two ways. The browser flow ended on a 302 redirect followed by the success banner. Four further sends issued directly against the same endpoint returned **HTTP 200** with the success text present. No 4xx or 5xx for any valid input | ✅ | The page-scoped network log does not retain the POST itself because the page navigates; the redirect plus banner plus the direct 200s are the evidence |

**Screenshots:**
- `AP2436_009-step3-SendSuccessBanner_pass.png` — shared with AP2436_009; the post-send state

---

### AP2436_011 — Two sends produce two separate emails — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Empty the inbox and open the send form | Inbox empty, control visible | `client.stage.002@yopmail.com` inbox empty | ✅ | — |
| 2 | Send once with "Marie Tremblay" | First send accepted | HTTP 200, success text present | ✅ | — |
| 3 | Send again with identical values | Second send accepted, no duplicate warning | HTTP 200, success text present, no message about the client already being contacted | ✅ | — |
| 4 | Open the inbox and wait up to two minutes | Two separate emails | Two separate messages in `client.stage.002`, both "Compliance documents" from Systeme Avantage Plus, both timestamped 22:10 local | ✅ | Not merged, not de-duplicated |
| 5 `[Verification]` | Verify matching greeting and attachments, different timestamps, and screenshot | Two distinct emails; register shows both | Both carry the same greeting and the same six attachments. The register shows them as **two rows, log IDs 11 and 12**, each with its own "29 août 2026, 11:10" timestamp | ✅ | Each send stands on its own in the register, which is what makes the register usable as evidence |

**Screenshots:**
- `AP2436_011-step5-TwoSeparateEmails_pass.png` — the inbox holding two separate compliance emails

---

### AP2436_012 — Admin can change a dealer's Chubb configuration — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in to the admin area | Admin area loads, dealer list reachable | Logged in at `/admin`; Admin → Users → Dealers reachable at `/admin/dealers` | ✅ | The **Dealer Details** page itself is not broken — the dealer list, its search and the per-dealer action links all render. That is a partial answer to Q-009 |
| 2 | Open Dealer Details for the dealership used in the other cases | Page loads fully | **Could not identify which dealer row is ours.** Searches run: exact "Test QA staging" → 0 rows; "QA" → 0 rows; "Test" → 41 rows across 5 pages, none named "Test QA staging". The Dealers list columns are Dealer ID, Name, Company, Email, Phone, Group, Actions — no account-label and no province column. `/admin/dealer-users` does not list `vinhle870@gmail.com` in pages 1–15. Dealer groups (Group A–D) and wholesalers do not contain it either | 🚫 | **Blocked: we need the dealer ID.** The dealership label shown in the dealer portal, "Test QA staging", matches no dealer name in the admin list, so there is no way from the UI to reach the right Dealer Details page |
| 3 | Record the current creditor form codes | Codes visible and noted | Not reached. **However the codes are readable from the dealer portal instead:** the Quick Quote "Form" dropdown exposes the dealer's assigned creditor forms as option values `GC6201MQ:PM30` and `GC6201MQ:PM50` | ⚠ workaround | Enough to *read* the configuration, not to change it |
| 4 | Change the codes and save | Save accepted | Not reached | 🚫 | — |
| 5 `[Verification]` | Reload and verify the codes persisted | New codes shown | Not reached | 🚫 | — |

**What must happen next.** Ask Ken Nguyen or Minh Lưu for the Dealer ID behind `vinhle870@gmail.com`, or for admin rights that show the dealership account label. With that ID, `/admin/dealer/{id}/edit` should open Dealer Details directly and AP2436_012 through AP2436_016 all become runnable in a single short session.

---

### AP2436_013 — PM50 only sends the 50 % waiver form only — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Set the dealership's Chubb configuration to PM50 only | Only PM50 assigned | Not possible — see AP2436_012 step 2 | 🚫 | Blocked, not failed. The rule itself is untested, and it is the case the product owner asked for by name on 2026-08-26 |

---

### AP2436_014 — 30 % code only sends the 30 % waiver form only — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Set the configuration to PM30 only, then S30, then M30 | One 30 % code assigned at a time | Not possible — see AP2436_012 step 2 | 🚫 | Blocked. Note the Quick Quote dropdown only ever offered PM30 and PM50 for this dealer, so S30 and M30 have not been seen anywhere in the build yet |

---

### AP2436_015 — Both groups send both waiver forms — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Confirm the dealership is assigned both a 50 % and a 30 % creditor form | Both codes assigned | Read from the dealer portal instead of the admin page: the Quick Quote "Form" dropdown offers exactly two options, `GC6201MQ:PM30` ("Monthly Premium PM30", selected by default) and `GC6201MQ:PM50` ("Monthly Premium PM50") | ✅ | The dropdown is driven by the dealer's own Chubb configuration, so its contents prove both groups are assigned |
| 2 `[Pre-Condition]` | Empty the inbox and open Insurance Quick Quote | Inbox empty, control visible | `client.stage.001` empty; control visible | ✅ | — |
| 3 | Send to the test address | Send accepted | HTTP 200 and the success banner | ✅ | — |
| 4 | Open the email and both waiver attachments | One email with two waiver forms, both open | Six attachments, all of which downloaded and parsed: `waiver-form-30-fr.pdf` (68 KB), `waiver-form-30-en.pdf` (67 KB), `waiver-form-50-fr.pdf` (70 KB), `waiver-form-50-en.pdf` (69 KB), `parlons-assurance-fr.pdf` (584 KB), `parlons-assurance-en.pdf` (1105 KB) | ✅ | Both waiver forms present, in both languages |
| 5 `[Verification]` | Verify one 50 % form and one 30 % form, neither duplicated | Exactly one of each, contents matching the references | Exactly one 30 % waiver and one 50 % waiver per language, no duplicates. The four waiver PDFs contain no filled form values, so they are the blank templates a client signs — consistent with the reference copies attached to AP-2436 | ✅ | Confirms the product owner's 2026-08-26 answer to QC's Issue #2: a dealer in both groups correctly receives both forms. This should stop that observation being re-raised as a bug |

**Screenshots:**
- `AP2436_015-step1-FormDropdownBothPM30PM50_pass.png` — the Quick Quote form whose Form dropdown carries both PM30 and PM50
- `AP2436_009-step5-EmailSixAttachments_fail.png` — shared; the full attachment list

---

### AP2436_016 — Empty Chubb configuration — record behaviour — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Remove every creditor form code from the dealership | No code assigned | Not possible — see AP2436_012 step 2 | 🚫 | Blocked. Q-004 therefore remains unanswered by testing as well as by the story |

---

### AP2436_017 — Talk Insurance PDF pre-filled with dealer details — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Note the dealership's company name and assigned products | Both recorded before the send | Company name taken from the portal: "Test QA staging". Assigned creditor forms read from the Quick Quote dropdown: PM30 and PM50. The full product list could not be read, because that lives on the Dealer Details page we cannot reach | ⚠ partial | — |
| 2 `[Pre-Condition]` | Empty the inbox and open Insurance Quick Quote | Inbox empty, control visible | Done | ✅ | — |
| 3 | Send, then open the received Talk Insurance attachment | Email arrives, PDF opens | Both `parlons-assurance-fr.pdf` and `parlons-assurance-en.pdf` arrived and were downloaded and parsed | ✅ | Both language variants are sent, not one |
| 4 `[Verification]` | Verify the dealership name in "Nom du distributeur" and the product list | Name matches; products match the configuration | The PDFs are generated per send (producer `pypdf`) and carry filled AcroForm fields. Field names: `AccountName`, `AccountAddress`, `InsurerName`, `Guest`. Values in the French copy: `AccountName` = "Test QA staging", `AccountAddress` = "Address cccc QC 22222", `InsurerName` = "Chubb du Canada compagnie d'assurance vie". The English copy carries the same name and address with `InsurerName` = "Chubb Life Insurance Company of Canada" | ✅ | Pre-fill works, and the insurer name is correctly localised per language variant |
| 5 `[Verification]` | Verify the language variant against the AP-2436 reference copy | Language recorded; layout differences noted | Both variants arrive on every send, so **there is no language choice to get wrong**. That answers Q-005 in the simplest possible way. The product list itself sits in the compressed page content, not in a form field, so it could not be read by automation | ⚠ not proven | **What remains:** a person needs to open `parlons-assurance-fr.pdf` and confirm the listed products match the dealer's Chubb configuration. Everything else in this case is verified |

**Screenshots:**
- `AP2436_009-step5-EmailSixAttachments_fail.png` — shared; the attachment list showing both Talk Insurance variants

---

### AP2436_018 — Protection summary and commission disclosure present — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Empty the inbox and open Insurance Quick Quote | Inbox empty, control visible | Done | ✅ | — |
| 2 | Send to the test address | Send accepted | HTTP 200 and the success banner | ✅ | — |
| 3 | Open every attachment and identify it by contents, not by name | Every attachment opens and is identified | All six downloaded and parsed successfully. None was blank, corrupted or a duplicate | ✅ | Sizes 67–1105 KB; the two Talk Insurance files are generated per send, the four waiver forms are static templates |
| 4 `[Verification]` | Verify the protection summary, the Talk Insurance document and the commission-percentage disclosure are all present | All three present | Talk Insurance is present. The protection summary travels inside the same file — the reference copies on AP-2436 are named "ParlonAssurance + Sommaire", so the two are one document. **The commission-percentage disclosure ("Divulgation du pourcentage de rémunération") is not attached at all**, in either language | ❌ | **Finding.** The email body promises "Avis de divulgation, lorsque applicable" / "Disclosure notice, when applicable", but no such file arrives. The French description of AP-2436 lists this document as one of three the system must transmit. Either it is genuinely missing, or "when applicable" means it did not apply to this dealer — and nothing on screen tells the dealer which. A client who should have received a commission disclosure and did not is a compliance gap, so this needs an answer rather than a guess |
| 5 `[Verification]` | Verify nothing is corrupted, blank or duplicated, and name anything missing | All open; missing items named | All six render. Missing: the commission-percentage disclosure, named above | ⚠ mixed | — |

---

### AP2436_019 — Register readable by dealer and by Avantage Plus — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open Insurance Quick Quote and note the wall-clock time | Control visible, time recorded | Send made at 15:03 UTC | ✅ | — |
| 2 | Send to the test address | Send accepted | HTTP 200, success banner | ✅ | — |
| 3 | Find the register in the dealer area | A register screen is found | **Found.** Dealer navigation → Vehicles → "Insurance compliance log", route `/insurance-compliance-log`. In French: "Journal d'envoi de documents de conformité". This answers the dealer half of Q-006 | ✅ | The register was never named in the story; it does exist |
| 4 `[Verification]` | Verify a row for this send with client name, email and a matching timestamp | Row present and correct | Columns: Log ID, Client Name, Client Email, Sent At. Row: `10 | Marie Tremblay | client.stage.001@yopmail.com | Aug 29, 2026, 11:03 AM`. 11:03 AM Eastern equals the 15:03 UTC send, so the timestamp is right. By the end of the run the register held IDs 10–16, one row per successful send and none for any rejected attempt | ✅ | Timestamped, complete, and correctly excludes the sends that failed validation |
| 5 `[Verification]` | Verify Avantage Plus staff can see the same send | Same row visible in the admin area | **No compliance register exists on the Avantage Plus side.** `/admin/insurance-compliance-log` returns HTTP 404, and an enumeration of all 49 links in the admin navigation contains no compliance-log route — the closest sections are Warranties, Insurance, Sales, Claims, Invoices, Reports (Components, Invoices, Payments, Cancellations, Products, Claims), Users, Apps, Warranty Configuration and Parameters | ❌ | **Finding.** REQ-006 acceptance criterion 3 requires the register to be readable by Avantage Plus **and** the dealer. Only the dealer half is built. Avantage Plus therefore cannot answer a client who says the documents never arrived, which is the whole reason the register was asked for |

**Screenshots:**
- `AP2436_019-step4-DealerComplianceLogRow_pass.png` — the dealer-side Insurance compliance log with the row for this send

---

### AP2436_020 — Dealer can download the pre-filled PDFs — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Log in as the dealer and open Insurance Quick Quote | Page loads | Loaded | ✅ | — |
| 2 | Search for a download control across the plausible pages | A download control is found, or its absence recorded | Five pages searched for any link or button matching download, télécharger, `.pdf`, disclosure or "documents de divulgation": `/quick-insurance-quote`, `/quick-insurance-quote/gap`, `/compliance-documents/send`, `/insurance-compliance-log` and the dashboard `/`. **No match on any of them.** The compliance-log rows carry no link and no click handler, so a past send cannot be re-downloaded either | ✅ | The search itself completed; the finding is that nothing was found |
| 3 | Use the control and open each file | Files download and open | Not applicable — no control exists | ❌ | — |
| 4 `[Verification]` | Verify the downloaded PDFs are pre-filled like the emailed ones | Downloads match the emailed copies | Cannot be verified: the feature is absent | ❌ | **Finding.** REQ-007 asks for quick access to download the pre-filled disclosure PDFs. Nothing in the insurance area offers it. Marked Failed rather than Blocked because the expected outcome is clear — a download must exist — and only its location was unspecified. If it was deferred out of Phase 1, say so on the ticket so it stops being re-tested |

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2436_012 | 🚫 | The dealership behind `vinhle870@gmail.com` cannot be located in Admin → Dealers. Its portal label "Test QA staging" matches no dealer name across all 41 dealers returned for "Test", and the list has no account-label or province column. |
| AP2436_013 | 🚫 | Blocked by AP2436_012 — the Chubb configuration cannot be changed to PM50 only. |
| AP2436_014 | 🚫 | Blocked by AP2436_012 — cannot be set to PM30, S30 or M30 alone. |
| AP2436_016 | 🚫 | Blocked by AP2436_012 — the configuration cannot be emptied. |

---

## Environment Observations

**Three of the story's open questions were answered by the build itself.** Q-003: a success confirmation does exist — the banner "Compliance documents have been sent." Q-005: there is no document-language rule to get wrong, because every send attaches both the French and the English variant. Q-006 (dealer half): the register exists at `/insurance-compliance-log`, called "Insurance compliance log". Update the requirements analysis so these stop being carried as risks.

**Two of the story's own texts are out of date relative to the build**, and both need a product-owner decision rather than a code change. The email body specified in AP-2436 ("Dear …, Please find attached our updated insurance conformity documents.") bears no resemblance to what is actually sent, which is a longer bilingual message naming the Autorité des marchés financiers and the Office de la protection du consommateur. And the French field label is "Courriel du client" where the story says "Adresse courriel".

**The Quebec province question has a workable answer.** The generated Talk Insurance PDF carries `AccountAddress` = "Address cccc QC 22222" for this dealership, so its address is in QC. That is indirect — an address is not the registered province field — but it is enough to stop treating AP2436_001 as half proven. A real province field would still be worth exposing somewhere a tester can see it.

**A useful discovery for future runs.** The Quick Quote "Form" dropdown is driven by the dealer's own Chubb configuration and exposes the assigned creditor form codes as its option values (`GC6201MQ:PM30`, `GC6201MQ:PM50`). That makes the configuration **readable** from the dealer portal without admin access, which is how AP2436_015 was verified. It does not make it **writable**, which is why AP2436_013, AP2436_014 and AP2436_016 are still blocked.

**The generated PDFs are pre-filled through PDF form fields, which makes them checkable.** `parlons-assurance-*.pdf` is produced per send by `pypdf` and carries an AcroForm with `AccountName`, `AccountAddress` and `InsurerName` filled in. Any future automation can read those values directly instead of asking a person to open the file. The product list is in the page content rather than a form field, so that one still needs a human.

**S30 and M30 have not been seen anywhere.** The story names three codes in the 30 % group. Only PM30 and PM50 appear in the build for this dealer. Whether S30 and M30 exist at all in staging is unknown.

**The Playwright MCP server is still writing its logs into the evidence folder.** `page-*.yml` and `console-*.log` are landing in `qa-artifacts/4-execution-results/screenshots/`. Point `--output-dir` in `.mcp.json` at `playwright-log`. Screenshots themselves saved correctly to the `5.1.0/AP-2436` subfolder throughout.

**Test data left behind.** Register rows 10–16 and seven compliance emails were created against `client.stage.001` … `client.stage.005@yopmail.com`, including three rows whose client name is a long run of the letter A from the boundary probing. The portal language was switched to French mid-run and switched back to English at the end. No dealer configuration was changed, so nothing needs restoring on that side.

---

## Open Items Raised By This Run

| # | Item | Who can answer | Blocks |
|---|---|---|---|
| 1 | What is the Dealer ID behind `vinhle870@gmail.com`? Its portal label "Test QA staging" matches no dealer name in Admin → Dealers. | Ken Nguyen or Minh Lưu | AP2436_012, AP2436_013, AP2436_014, AP2436_016 — four High-priority cases, including the one the product owner asked for by name |
| 2 | Is the email body in AP-2436 out of date? The build sends a longer bilingual message citing the AMF and the Office de la protection du consommateur. | Ken Nguyen | Sign-off on REQ-003 AC2 |
| 3 | Should the commission-percentage disclosure be attached? The body promises a disclosure notice "when applicable" but no such file arrives. | Ken Nguyen | Sign-off on REQ-005 AC4 |
| 4 | Is an Avantage Plus view of the compliance register in Phase 1? Only the dealer side exists. | Ken Nguyen | Sign-off on REQ-006 AC3 |
| 5 | Was the quick-download of pre-filled PDFs deferred out of Phase 1? Nothing in the insurance area offers it. | Ken Nguyen | Sign-off on REQ-007 |
| 6 | **Answered by the QA on 2026-08-29** — Quote Details is reached via Quotes → Create a quote. AP2436_002 re-run and passed. | — | Closed |
| 7 | Can we have a dealer-user login for one of the existing non-Quebec test dealerships, e.g. "ONTARIO TAX TEST"? | Ken Nguyen | The dealer-province half of AP2436_004 |
| 10 | Does "Quebec only" mean the dealership's province or the client's province on the quote? The **client** province is demonstrably not enforced — an Ontario client is offered the same send. | Ken Nguyen | Severity of the AP2436_004 finding |
| 11 | Should the send form pre-fill the client **name** as well as the email when opened from Quote Details? Today only the email carries over. | Ken Nguyen | Low-priority usability ticket |
| 8 | Do S30 and M30 creditor form codes exist in staging? Only PM30 and PM50 were seen. | Minh Lưu | AP2436_014 |
| 9 | Is the French label meant to read "conformité" rather than "comformité"? The build matches the story's misspelling exactly. | Ken Nguyen | Low-severity copy fix |

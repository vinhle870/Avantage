# Bug Report

**Project:** Avantage Plus (AP) — Dealer portal
**Report ID:** BR-20260901-001
**Test Cycle:** AP-2436 — Dealer portal: Sending insurance compliance documents · release 5.1.0 · Staging
**Date:** 2026-09-01
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/3-test-cases/AP2436_TestCases_001-005.md … _016-020.md — execution logs qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2436_2026-08-29.md and execution-log_AP-2436_2026-09-01.md

| Metric | Value |
|---|:---:|
| Total defects | 7 (BUG-003 withdrawn — was 8) |
| Critical | 0 |
| High | 4 |
| Medium | 1 |
| Low | 2 |
| Tracker tickets created | 6 (AP-2451 closed as invalid) |

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2436_018 | The commission-percentage disclosure is never attached to the compliance email | High | P1 | [AP-2449](https://garantieavantageplus.atlassian.net/browse/AP-2449) | Open |
| BUG-002 | AP2436_019 | Avantage Plus staff have no compliance send register — only the dealer does | High | P1 | [AP-2450](https://garantieavantageplus.atlassian.net/browse/AP-2450) | Open |
| ~~BUG-003~~ | AP2436_012 | ~~An admin cannot reach Dealer Details for the "Test QA staging" dealership~~ — **WITHDRAWN 2026-09-01, QA error** | — | — | [AP-2451](https://garantieavantageplus.atlassian.net/browse/AP-2451) | **Closed — Invalid** |
| BUG-004 | AP2436_008 | A client name of 256 characters or more makes the send return HTTP 500 | High | P2 | [AP-2452](https://garantieavantageplus.atlassian.net/browse/AP-2452) | Open |
| BUG-005 | AP2436_020 | There is no control anywhere for a dealer to download the pre-filled disclosure PDFs | High | P2 | [AP-2453](https://garantieavantageplus.atlassian.net/browse/AP-2453) | Open |
| BUG-006 | AP2436_004 | The client's province does not gate the feature — an Ontario client is offered Quebec disclosures | Medium | P2 | [AP-2454](https://garantieavantageplus.atlassian.net/browse/AP-2454) | Open |
| BUG-007 | AP2436_009 | The compliance email body does not match the copy specified in the story | Low | P3 | Not filed — Low | Open |
| BUG-008 | AP2436_005 | The French modal labels the email field "Courriel du client" instead of "Adresse courriel" | Low | P4 | Not filed — Low | Open |

> **Screenshots were not uploaded to Jira.** The tracker adapter exposes no attachment capability on either route (`tracker.attach_file` is Unsupported for Jira via MCP, and `tools/jira-cli` has no attach command), so each ticket cites its screenshot by repo path only. Someone with browser access needs to attach the files listed in each Evidence table to the matching ticket.

> **Tracker route used:** `tools/jira-cli` against `garantieavantageplus.atlassian.net`, project `AP`. The MCP route is authorised only for `oneplanet-solutions.atlassian.net` and is refused for this tenant.

**Environment shared by every bug below:** Chromium (Playwright) 1280 × 800 · Windows 11 · `https://v2staging.garantieavantageplus.ca` · app version 5.1.0 · dealer login `vinhle870@gmail.com`, dealership label "Test QA staging" · client inboxes `client.stage.NNN@yopmail.com`.

---

## Re-verification — 2026-09-01

Every High and Medium defect was re-checked live on Staging on **2026-09-01** (build v2.0.0, same environment). **Five of the six filed defects still reproduce. BUG-003 was withdrawn as invalid** — a QA error, and its ticket AP-2451 is closed.

| Bug | Ticket | Re-checked | Result |
|---|---|---|---|
| BUG-001 | AP-2449 | Fresh send to `client.stage.901@yopmail.com` at 17:15 | **Still fails.** Six attachments — `parlons-assurance-fr/en.pdf`, `waiver-form-30-fr/en.pdf`, `waiver-form-50-fr/en.pdf`. No commission-percentage disclosure |
| BUG-002 | AP-2450 | Admin nav enumerated (56 links), `/admin/insurance` tabs, `/admin/insurance-compliance-log` | **Still fails.** No compliance-log route anywhere in admin; the direct URL returns HTTP 404. The dealer-side register is present and now holds log IDs 10–17 |
| ~~BUG-003~~ | AP-2451 | `/admin/dealers` searched **by email** | **WITHDRAWN — invalid.** The dealership was always reachable: `1380 | Offical VinhLe870@gmail.com | Test QA staging | vinhle870@gmail.com | Group D`. The first run searched the company label "Test QA staging" against the Name column. `/admin/dealer/1380/edit` and `/admin/dealer/1380/chubb-insurance` both open and are editable. See the withdrawal note below |
| BUG-004 | AP-2452 | 256-character client name posted to `/compliance-documents/send` | **Still fails.** HTTP 500 and the generic "difficultes techniques" page. Screenshot: `AP2436_008-reverify-2026-09-01-Name256Http500_fail.png` |
| BUG-005 | AP-2453 | `/insurance-compliance-log` re-scanned for any download control | **Still fails.** No link or button matching download / telecharger / `.pdf` / disclosure; the rows carry no link |
| BUG-006 | AP-2454 | Quote `#6277` (Ontario client John Smith) re-opened | **Still fails.** "Send compliance documents" is present and enabled, `href = /compliance-documents/send?redirectUrl=/quote/6277/details&clientEmail=client.stage.011@yopmail.com` |

**On the `/admin/insurance-compliance-log` URL specifically:** that route not existing *is* BUG-002, not a mistake in the report. The URL appears in the reproduction steps as the check that demonstrates the absence — AP-2436 REQ-006 requires the register to be consultable by Avantage Plus as well as the dealer, and today only the dealer route `/insurance-compliance-log` is built. The 404 is the evidence, not an assumption that the admin route should already be there under that exact name.

---

## Bug Details

---

### BUG-001 — The commission-percentage disclosure is never attached to the compliance email

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2436_018 |
| **Requirement** | REQ-005 — Pre-filled Talk Insurance, protection summary and remuneration disclosure documents |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | [AP-2449](https://garantieavantageplus.atlassian.net/browse/AP-2449) |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always (every one of the 7 successful sends made during the run) |

**Summary:**
The compliance email sent from the dealer portal never carries the "Divulgation du pourcentage de rémunération" (commission-percentage disclosure), even though the email body itself promises "Avis de divulgation, lorsque applicable" / "Disclosure notice, when applicable" and the AP-2436 description lists that document as one of three the system must transmit.

**Steps to Reproduce:**

1. Log in to `https://v2staging.garantieavantageplus.ca` as the dealer `vinhle870@gmail.com` and open **Insurance Quick Quote** (`/quick-insurance-quote`).
2. Click **Send compliance documents**.
3. Type `Marie Tremblay` into **Client name*** and `client.stage.001@yopmail.com` into **Client email***, then click **Send**.
4. Open `https://yopmail.com/?client.stage.001` and open the email "Compliance documents" from `no-reply@garantieavantageplus.ca`.
5. List every attachment and identify each one by its contents.

**Expected Result:**
Per the AP-2436 description, the send transmits three documents — the protection summary (Sommaire des protections), Parlons assurances, and the commission-percentage disclosure (Divulgation du pourcentage de rémunération). A commission-disclosure PDF must be among the attachments, or the dealer must be told on screen why it does not apply to this send.

**Actual Result:**
Six attachments arrive and all six open cleanly: `waiver-form-30-fr.pdf` (68 KB), `waiver-form-30-en.pdf` (67 KB), `waiver-form-50-fr.pdf` (70 KB), `waiver-form-50-en.pdf` (69 KB), `parlons-assurance-fr.pdf` (584 KB), `parlons-assurance-en.pdf` (1105 KB). No commission-percentage disclosure is present, in either language. The protection summary is not missing — it travels inside the Parlons assurances file, whose reference copy on AP-2436 is named "ParlonAssurance + Sommaire". Nothing on screen tells the dealer that a disclosure was withheld.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_009-step5-EmailSixAttachments_fail.png` |
| Console log | None captured — the send returned HTTP 200 with no client-side error |

**Suggested Root Cause:**
Unknown — for dev investigation. Either the disclosure is not implemented, or a "when applicable" condition excluded it for this dealer and that condition is invisible to the user.

**Notes:**
A client who was entitled to a commission disclosure and did not receive one is a regulatory exposure, not a cosmetic gap. If "when applicable" is deliberate, the rule needs to be stated on the ticket and surfaced to the dealer.

---

### BUG-002 — Avantage Plus staff have no compliance send register — only the dealer does

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2436_019 |
| **Requirement** | REQ-006 — Timestamped send register, readable by Avantage+ and by the dealer |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | [AP-2450](https://garantieavantageplus.atlassian.net/browse/AP-2450) |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always |

**Summary:**
The compliance send register exists only in the dealer portal at `/insurance-compliance-log`; the Avantage Plus admin area has no equivalent screen, so head-office staff cannot see that any compliance documents were sent.

**Steps to Reproduce:**

1. As the dealer `vinhle870@gmail.com`, send compliance documents to `client.stage.001@yopmail.com` for client `Marie Tremblay` from `/quick-insurance-quote`.
2. In the dealer portal, open **Vehicles → Insurance compliance log** (`/insurance-compliance-log`) and confirm the row is there.
3. Log in to the Admin Portal at `https://v2staging.garantieavantageplus.ca/admin/login` as `vinhle870@gmail.com` (the same account as the dealer steps above — on Staging one account serves both portals; the password is in the project `env` source, qa-artifacts/base-test/execute.env.md).
4. Open `https://v2staging.garantieavantageplus.ca/admin/insurance-compliance-log` directly.
5. Walk the whole admin navigation looking for any compliance-log or send-register screen.

**Expected Result:**
REQ-006 acceptance criterion 3 requires the register to be consultable by Avantage Plus **and** by the dealer. The same send that appears in the dealer's log must be visible to Avantage Plus staff, with client name, client email and timestamp.

**Actual Result:**
The dealer half works correctly — columns Log ID, Client Name, Client Email, Sent At, with the row `10 | Marie Tremblay | client.stage.001@yopmail.com | Aug 29, 2026, 11:03 AM` (11:03 Eastern = the 15:03 UTC send), and by the end of the run IDs 10–16, one row per successful send and none for a rejected one. The Avantage Plus half does not exist: `/admin/insurance-compliance-log` returns **HTTP 404**, and enumerating all 49 links in the admin navigation finds no compliance-log route — the nearest sections are Warranties, Insurance, Sales, Claims, Invoices, Reports, Users, Apps, Warranty Configuration and Parameters.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_019-step4-DealerComplianceLogRow_pass.png` — the dealer-side register with the row |
| Console log | None captured — the admin route returns a server 404 page |

**Suggested Root Cause:**
Unknown — for dev investigation. Likely the admin-side route and screen were not built.

**Notes:**
Half the point of the register is that Avantage Plus can answer a client who says the documents never arrived. That is exactly what cannot be done today.

---

### BUG-003 — An admin cannot reach Dealer Details for the "Test QA staging" dealership

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2436_012 (blocks AP2436_013, AP2436_014, AP2436_016) |
| **Requirement** | REQ-004 — Conditional waiver-form attachment based on the Chubb creditor form codes |
| **Severity** | High |
| **Priority** | P1 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging admin area |
| **Tracker Ticket** | [AP-2451](https://garantieavantageplus.atlassian.net/browse/AP-2451) |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always |

**Summary:**
The dealership behind the dealer login `vinhle870@gmail.com` — shown in the dealer portal as "Test QA staging" — cannot be located anywhere in Admin → Users → Dealers, so its **Dealer Details** page and its Chubb creditor-form configuration cannot be opened or changed at all.

**Steps to Reproduce:**

1. Log in to `https://v2staging.garantieavantageplus.ca/admin` and open **Users → Dealers** (`/admin/dealers`).
2. Search the dealer list for the exact string `Test QA staging` → 0 rows.
3. Search for `QA` → 0 rows.
4. Search for `Test` → 41 rows across 5 pages; none is named "Test QA staging".
5. Open `/admin/dealer-users`, type `vinhle870` into the search box and submit it — the only row returned is `110 | Vinh le2 Vinh Le2 | vinhle8702@gmail.com`, a prefix match, not the account under test. Also check dealer Groups A–D, the wholesaler lists, and `/admin/admin-users`.

**Expected Result:**
An administrator must be able to find any dealership from the admin dealer list and open its Dealer Details page, in order to read and change the assigned Chubb creditor form codes (PM30 / PM50 / S30 / M30) that decide which waiver forms a compliance send attaches.

**Actual Result:**
The dealership is unreachable. The portal label "Test QA staging" matches no dealer **Name** in the admin list, `vinhle870@gmail.com` does not appear in `/admin/dealer-users` pages 1–15, and it is in no dealer group or wholesaler list. The Dealers list columns are Dealer ID, Name, Company, Email, Phone, Group, Actions — there is **no account-label column and no province column**, so nothing in the UI links the portal label back to a dealer row. The Dealer Details page itself is not broken; the list, its search and the per-dealer action links all render.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | None captured — the defect is the absence of a matching row across 5 pages of results |
| Workaround evidence | The configuration can be *read* from the dealer portal instead: the Quick Quote **Form** dropdown exposes the assigned codes as option values `GC6201MQ:PM30` and `GC6201MQ:PM50`. Reading is possible; changing is not |

**Suggested Root Cause:**
Unknown — for dev investigation. Either the dealership's admin-side name differs from the label the portal renders, or the account is not joined to a dealer row that the list query returns.

**Notes:**
This one blocker stops four test cases dead: AP2436_012 (change the configuration), AP2436_013 (PM50 only), AP2436_014 (a 30 % code only) and AP2436_016 (empty configuration). AP2436_013 is the case the product owner asked for by name in the AP-2436 comment of 2026-08-26. Also note that the Quick Quote dropdown has only ever offered PM30 and PM50 for this dealer — S30 and M30 have not been seen anywhere in the build. **Unblocking step:** supply the Dealer ID behind `vinhle870@gmail.com`, or admin rights that show the dealership account label; `/admin/dealer/{id}/edit` should then open Dealer Details directly and all four cases become runnable in one short session.

---

> ## ⚠ WITHDRAWN — 2026-09-01, QA error
>
> **This defect is invalid and its ticket AP-2451 is closed.** The dealership was always reachable from Admin → Users → Dealers; searching the list **by email** returns it immediately:
>
> `1380 | Offical VinhLe870@gmail.com | Test QA staging | vinhle870@gmail.com | 99999 | Group D`
>
> **Why the original run missed it:** it searched the string "Test QA staging" against the **Name** column, but that string is the **Company**; the Name is "Offical VinhLe870@gmail.com". The account is also not a dealer-user record, which is why `/admin/dealer-users` never listed it.
>
> **What is actually there:**
>
> - `/admin/dealer/1380/edit` — Dealer Details, heading "Dealer #1380", `dealer[province]` = **QC** (the dealership is confirmed Quebec).
> - `/admin/dealer/1380/chubb-insurance` — heading "Chubb insurance", editable. Creditor account `AP0001`; `creditorForm[]` holds **Creditor Monthly PM30, Creditor Monthly PM50, GAP** out of nine options (Creditor PM30, PM50, Monthly PM30, Monthly PM50, (Commercial) S30, S45, Monthly (Commercial) M25, M30, GAP). **S30 and M30 exist in the build** — they were simply never assigned to this dealer, which is why the dealer-portal dropdown never offered them.
>
> **Consequence:** AP2436_012, AP2436_013, AP2436_014 and AP2436_016 are no longer blocked.

---

### BUG-004 — A client name of 256 characters or more makes the send return HTTP 500

| Field | Value |
|---|---|
| **Bug ID** | BUG-004 |
| **Test Case** | AP2436_008 |
| **Requirement** | REQ-002 — The "Send compliance documents" modal form |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | [AP-2452](https://garantieavantageplus.atlassian.net/browse/AP-2452) |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always (reproduced through the form and again through a direct request; boundary probed 5 times) |

**Summary:**
Submitting the **Send compliance documents** form with a **Client name** of 256 characters or more returns an HTTP 500 Internal Server Error and drops the dealer on an error page that says nothing about what went wrong.

**Steps to Reproduce:**

1. As the dealer `vinhle870@gmail.com`, open `/quick-insurance-quote` and click **Send compliance documents**.
2. Paste a 300-character string into **Client name*** (any 300 characters reproduce it).
3. Type `client.stage.004@yopmail.com` into **Client email***.
4. Click **Send**.
5. To locate the boundary, repeat with names of exactly 255 and exactly 256 characters.

**Expected Result:**
The field either caps the input at its maximum length or the server rejects it with the same kind of visible field error already used elsewhere on this form — "This value should not be blank." / "This value is not a valid email address." No request should end in a 500.

**Actual Result:**
**HTTP 500 Internal Server Error.** The dealer lands on a generic error page — "Erreur — Desole, l'application eprouve des difficultes techniques. Veuillez recommencer une autre fois." — which says nothing about the client name or the length limit. The boundary is sharp: 100 characters → 200 OK, 200 → 200 OK, 255 → 200 OK, **256 → 500**, 260 → 500. No email arrives at `client.stage.004@yopmail.com`, and no register row is written, but the dealer has no way to know that. Accent handling in the same field is correct — `Josée Côté-Bélanger` sends fine and the email greets `Bonjour Josée Côté-Bélanger,` / `Hello Josée Côté-Bélanger,` with every accent intact.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_008-step3-LongName500Error_fail.png` — the HTTP 500 page |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_008-step4-AccentedGreetingIntact_pass.png` — accents render correctly |
| Console log | Server-side 500; no client-side console error captured |

**Suggested Root Cause:**
The 255/256 boundary points at an unvalidated 255-character database column — the insert fails and the exception is not caught.

**Notes:**
Not exotic: an advisor pasting a long company name as the client name hits it. The real harm is the silence — they cannot tell whether the client received the documents.

---

### BUG-005 — There is no control anywhere for a dealer to download the pre-filled disclosure PDFs

| Field | Value |
|---|---|
| **Bug ID** | BUG-005 |
| **Test Case** | AP2436_020 |
| **Requirement** | REQ-007 — Quick access to download the pre-filled disclosure PDFs |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | [AP-2453](https://garantieavantageplus.atlassian.net/browse/AP-2453) |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always |

**Summary:**
Nothing in the dealer portal lets a dealer download the pre-filled PDF versions of the disclosure documents — the AP-2436 requirement for "un accès rapide permettant au concessionnaire de télécharger les versions PDF préremplies" is not present on any insurance page.

**Steps to Reproduce:**

1. Log in as the dealer `vinhle870@gmail.com`.
2. Open each of these pages in turn: `/quick-insurance-quote`, `/quick-insurance-quote/gap`, `/compliance-documents/send`, `/insurance-compliance-log`, and the dashboard `/`.
3. On each page, search for any link or button matching *download*, *télécharger*, `.pdf`, *disclosure* or *documents de divulgation*.
4. On `/insurance-compliance-log`, click a register row and its cells to check for a hidden download link.

**Expected Result:**
A quick-access control exists somewhere in the insurance area that downloads the pre-filled disclosure PDFs, and the downloaded files are pre-filled the same way the emailed copies are.

**Actual Result:**
No match on any of the five pages. The compliance-log rows carry no link and no click handler, so a past send cannot be re-downloaded either. The feature appears absent, so the pre-fill of a downloaded copy cannot be verified at all.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | None captured — the finding is the absence of any matching control on five pages |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. Most likely not yet implemented, or deferred out of Phase 1.

**Notes:**
Reported as a defect rather than a blocker because the expected outcome is unambiguous — a download must exist — and only its location was left unspecified. If it was deliberately deferred out of Phase 1, please say so on the ticket so it stops being re-tested each cycle.

---

### BUG-006 — The client's province does not gate the feature — an Ontario client is offered Quebec disclosures

| Field | Value |
|---|---|
| **Bug ID** | BUG-006 |
| **Test Case** | AP2436_004 |
| **Requirement** | REQ-001 — Entry point: "Send compliance documents" button for Quebec dealers |
| **Severity** | Medium |
| **Priority** | P2 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | [AP-2454](https://garantieavantageplus.atlassian.net/browse/AP-2454) |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always |

**Summary:**
A quote whose client province is Ontario shows the same enabled "Send compliance documents" control as a Québec client's quote, so an Ontario client can be sent Quebec-specific disclosures citing the Autorité des marchés financiers and the Office de la protection du consommateur.

**Steps to Reproduce:**

1. Log in as the dealer `vinhle870@gmail.com` and create a quote for a client whose **province** dropdown is set to `2: Ontario` — the run used John Smith, 200 Bay Street, Toronto, M5J 2J2.
2. Save the quote; the server redirects to `/quote/6277/details` with the heading `#6277 - John Smith`.
3. On that Quote Details page, look for the "Send compliance documents" control and check whether it is visible and enabled.
4. Compare it against the same control on a Québec client's quote.

**Expected Result:**
AP-2436 restricts the feature to Quebec. If "Quebec" means the client on the quote, an Ontario client's quote must not offer the compliance-document send.

**Actual Result:**
The control is visible and enabled, with `href = /compliance-documents/send?redirectUrl=/quote/6277/details&clientEmail=client.stage.011@yopmail.com` — identical to the Québec client's quote. The client's province does not gate the feature in any way.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_004-step4-OntarioClientButtonStillShown_fail.png` — Quote Details `#6277` for an Ontario client with the send control present |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. There may be no province condition on the control at all.

**Notes:**
This needs a product decision, not just a fix: "Quebec" in the story could mean the **dealership's** province or the **client's** province on the quote (open question Q-001). The client reading is now tested and is not enforced. The dealership reading is still **untested** — only one dealer login exists on Staging. Non-Quebec test dealerships do exist in Admin → Dealers ("ONTARIO TAX TEST", "TESTING Alberta", "TESTING for BC", "TESTING Nova Scotia", "SASKATCHEWAN TEST", "Manitoba TEst", "NF Test", "PEI TEST", "NWT TEST", "YUKON TEST", "NUNAVUT TEST"), so only a dealer-user password is missing to close the other half.

---

### BUG-007 — The compliance email body does not match the copy specified in the story

| Field | Value |
|---|---|
| **Bug ID** | BUG-007 |
| **Test Case** | AP2436_009 |
| **Requirement** | REQ-003 — Email delivery and email body |
| **Severity** | Low |
| **Priority** | P3 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | Not filed — Low severity, needs a product decision first |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always |

**Summary:**
The compliance email body is bilingual and much longer than the text AP-2436 specifies — it does not contain the specified line "Please find attached our updated insurance conformity documents."

**Steps to Reproduce:**

1. As the dealer `vinhle870@gmail.com`, send compliance documents to `client.stage.001@yopmail.com` for client `Marie Tremblay`.
2. Open the inbox at `https://yopmail.com/?client.stage.001`.
3. Open the email "Compliance documents" from "Systeme Avantage Plus <no-reply@garantieavantageplus.ca>" and read the body.

**Expected Result:**
Per the story, the body reads "Dear Marie Tremblay," followed by "Please find attached our updated insurance conformity documents.", with at least one attachment.

**Actual Result:**
The name substitution works, but the copy is different. The body is bilingual — `Bonjour Marie Tremblay,` / `Hello Marie Tremblay,` — followed by "Vous trouverez en pièces jointes les documents suivants…" / "Please find attached the following documents…" and a four-item list: the credit-insurance product summary, an Autorité des marchés financiers information sheet, a legal-warranty notice required by the Office de la protection du consommateur, and a disclosure notice "when applicable". Six attachments are present.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_009-step5-EmailSixAttachments_fail.png` — the bilingual body and all six attachments |
| Console log | None captured |

**Suggested Root Cause:**
The build's text is bilingual and names Quebec regulators, so it looks like deliberate newer copy and the story's example line looks stale.

**Notes:**
**Do not change the build to match the story without asking.** This is very likely a stale acceptance criterion, and the correct outcome is probably to update AP-2436. Raised so it is decided rather than assumed.

---

### BUG-008 — The French modal labels the email field "Courriel du client" instead of "Adresse courriel"

| Field | Value |
|---|---|
| **Bug ID** | BUG-008 |
| **Test Case** | AP2436_005 |
| **Requirement** | REQ-002 — The "Send compliance documents" modal form |
| **Severity** | Low |
| **Priority** | P4 |
| **Environment** | Chromium (Playwright) · Windows 11 · app version 5.1.0 · Staging |
| **Tracker Ticket** | Not filed — Low severity, wording only |
| **Status** | Open |
| **First found** | 2026-08-29 |
| **Reproducibility** | Always |

**Summary:**
In the French "Envoyer les documents de comformité" modal, the email field is labelled "Courriel du client", but AP-2436 specifies "Adresse courriel".

**Steps to Reproduce:**

1. As the dealer `vinhle870@gmail.com`, open `/quick-insurance-quote`.
2. Click **Send compliance documents** and confirm the modal opens with exactly three controls.
3. Switch the portal language to French and reopen the modal.
4. Read the two field labels and the button label.

**Expected Result:**
The three French labels are "Nom du client", "Adresse courriel" and "Envoyer", as written in AP-2436.

**Actual Result:**
Heading "Envoyer les documents de comformité"; labels "Nom du client" ✓ and **"Courriel du client"** ✗; button "Envoyer" ✓. Nothing is broken — the field works — but the story and the build disagree and must be reconciled before sign-off.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_005-step5-FrenchModalLabels_fail.png` — the French form showing "Courriel du client" |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP2436_005-step3-ModalThreeControlsEnglish_pass.png` — the English modal with exactly three controls |
| Console log | None captured |

**Suggested Root Cause:**
A translation string that was written independently of the story wording.

**Notes:**
Two related wording items were observed and deliberately **not** raised as defects: the English labels use lower-case "name"/"email" plus a required asterisk (same words, different casing), and the modal heading carries the "comformité" typo that is in AP-2436 itself. One behavioural observation is worth a product answer, though: submitting the modal navigates to a full page at `/compliance-documents/send` and shows validation errors there rather than inside the modal, so the dealer loses the quote-page context on every failed attempt. The story describes only a modal.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 4 | AP2436_008, AP2436_012, AP2436_018, AP2436_019, AP2436_020 |
| Medium | 1 | AP2436_004 |
| Low | 2 | AP2436_005, AP2436_009 |

Three of the five High defects — BUG-001, BUG-002 and BUG-005 — are **requirements that were not built**, not code that misbehaves. That is the headline of this cycle: the send path itself works well, and the surrounding obligations (the third document, the head-office register, the download) do not exist yet.

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Entry-point button | 1 | BUG-006 |
| REQ-002 — Modal form | 2 | BUG-004, BUG-008 |
| REQ-003 — Email delivery and body | 1 | BUG-007 |
| REQ-004 — Conditional waiver forms | 0 | — (BUG-003 withdrawn) |
| REQ-005 — Pre-filled PDF contents | 1 | BUG-001 |
| REQ-006 — Send register | 1 | BUG-002 |
| REQ-007 — Quick download | 1 | BUG-005 |

Six of the seven requirements carry at least one open defect. REQ-004 has none — its only entry, BUG-003, was withdrawn on 2026-09-01.

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Bug Reporter Skill
**Date:** 2026-09-01

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | [AP-2449](https://garantieavantageplus.atlassian.net/browse/AP-2449) | _(pending)_ | _(pending)_ | — |
| BUG-002 | [AP-2450](https://garantieavantageplus.atlassian.net/browse/AP-2450) | _(pending)_ | _(pending)_ | — |
| ~~BUG-003~~ | [AP-2451](https://garantieavantageplus.atlassian.net/browse/AP-2451) | Withdrawn — closed as Invalid | Done | 2026-09-01 |
| BUG-004 | [AP-2452](https://garantieavantageplus.atlassian.net/browse/AP-2452) | _(pending)_ | _(pending)_ | — |
| BUG-005 | [AP-2453](https://garantieavantageplus.atlassian.net/browse/AP-2453) | _(pending)_ | _(pending)_ | — |
| BUG-006 | [AP-2454](https://garantieavantageplus.atlassian.net/browse/AP-2454) | _(pending)_ | _(pending)_ | — |
| BUG-007 | Not filed — Low | — | — | — |
| BUG-008 | Not filed — Low | — | — | — |

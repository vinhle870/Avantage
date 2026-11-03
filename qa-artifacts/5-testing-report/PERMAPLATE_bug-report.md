# Bug Report

**Project:** Avantage Plus v2 — Permaplate feature set
**Report ID:** BR-20260906-001
**Test Cycle:** Permaplate — AP-2443 · AP-2444 · AP-2445 · AP-2446 · AP-2447 · AP-2448 · AP-2455 · AP-2456
**Date:** 2026-09-06, updated 2026-09-13 after re-test
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md`, `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`

| Metric | Value |
|---|:---:|
| Total defects | 5 |
| Critical | 0 |
| High | 3 (0 open, 2 resolved, 1 reclassified not-a-bug as of 2026-09-13) |
| Medium | 0 |
| Low | 2 (open) |
| Tracker tickets created | 5 |

**Read this first (updated 2026-09-13).** All three High defects are closed: AP-2459 and
AP-2461 are fixed and re-verified against their original repro steps; AP-2460 was
re-examined and is not a defect — the invoice's own detail page itemizes the $145 pre-tax
line plus GST and PST, so nothing is actually hidden from the dealer, and Ken Nguyen
confirmed this is intended on the ticket. The two Low defects (BUG-004, BUG-005) were not
in scope for the re-test and remain open — note BUG-004 may already be incidentally fixed
(see its entry below).

---

## Defect Summary (updated 2026-09-13)

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2446_001 | Generating a Permaplate contract fails with a server error when the optional "Financing company" is left unselected | High | P1 | [AP-2459](https://garantieavantageplus.atlassian.net/browse/AP-2459) | **Resolved** (re-verified 2026-09-13) |
| BUG-002 | AP2446_003 | The dealer is told the invoice is $145 but is billed $166.71 | High | P1 | [AP-2460](https://garantieavantageplus.atlassian.net/browse/AP-2460) | **Not a defect** (confirmed by Ken Nguyen 2026-09-08) |
| BUG-003 | AP2446_003 | The Permaplate invoice cites contract number PNA-0000000000, which does not exist | High | P1 | [AP-2461](https://garantieavantageplus.atlassian.net/browse/AP-2461) | **Resolved** (re-verified 2026-09-13 for new invoices) |
| BUG-004 | AP2447_002 | "Link a product" opens as a full page instead of the modal window the story specifies | Low | P4 | Linked to AP-2447 | Open — **possibly already fixed**, see note below |
| BUG-005 | AP2443_003 | The dealer's Permaplate list shows the client's work phone while the quote page shows their home phone | Low | P4 | Linked to AP-2443 | Open |

**BUG-004 note (added 2026-09-13):** during the AP-2446 re-test, the "Link a product"
admin control opened as a modal dialog rather than the full page this bug describes. Not
confirmed whether this was an intentional fix or a side effect of other work — worth a
one-line check with the dev before closing.

---

## Bug Details

---

### BUG-001 — Generating a Permaplate contract fails with a server error when "Financing company" is left unselected

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2446_001 |
| **Requirement** | REQ-004 — AP-2446, a Permaplate invoice is created when the contract is created |
| **Severity** | High — a dealer who does not happen to pick a financing company cannot create a Permaplate contract at all, and the screen tells them nothing about why. Not Critical only because a workaround exists once someone knows it. |
| **Priority** | P1 |
| **Environment** | Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2459](https://garantieavantageplus.atlassian.net/browse/AP-2459) |
| **Status** | **Resolved** — re-verified 2026-09-13 |
| **First found** | 2026-09-06 |
| **Reproducibility** | Always — 2 of 2 attempts, on two different quotes with different option selections (as of 2026-09-06; no longer reproduces as of 2026-09-13) |

**Summary:**
Clicking "Generate Contract" on the Permaplate Contract form returns an HTTP 500 server
error and a generic error page whenever the "Financing company" dropdown is left on its
default "Choose" value, even though that field is not marked as required and every other
field on the form is pre-filled correctly.

**Steps to Reproduce:**

1. Sign in to the Admin portal at `/admin/login` as `vinhle870@gmail.com` / `<password from the env source>`.
2. Open `/admin/dealer/1380/permaplate/link`, choose the product "**10 ans**" in the select box, and click "**Save**". The dealer's eligible-products table now lists "10 ans". *(Skip if it is already linked.)*
3. Sign in to the Dealer portal at `/login` with the same account.
4. Open `/quote/new/client` and create a client — First name `Perma`, Last name `Repro`, Email `perma.repro.0906@yopmail.com`, Address `220 Boulevard Saint-Laurent`, City `Montreal`, Province `Québec`, Postal code `H2Y 1Z4`, Phone (home) `5145550200`, Phone (work) `5145550201`, tick the policy-agreement checkbox — then click "**Save**". The browser lands on `/quote/{id}/details`. *(Both phone fields are required.)*
5. Open `/quote/{id}/vehicle`, select the vehicle whose VIN is `1FAHP35NX8W239204` (a 2008 Ford Focus), set Delivery date `2026-09-06` and Price `25000`, then click "**Save**".
6. Open `/quote/{id}/permaplate`, select the product radio "**10 ans**", tick the option "**Antirouille – Rust+Sound (combo)**", and click "**Save**".
7. Return to `/quote/{id}/details` and click "**Create Contract**", which opens `/quote/{id}/permaplate-create-contract`. Every field on this form is pre-filled from the quote.
8. Leave the "**Financing company**" dropdown on its default value "**Choose**" and change nothing else.
9. Click "**Generate Contract**".

Steps 1 and 2 are a **prerequisite owned by AP-2447**, not part of AP-2446: without a Permaplate product linked to the dealer, the Permaplate button does not appear on the quote page at all. Everything from step 3 onward — the quote, the contract, the alert and the invoice — is **Dealer Portal only**, which is the whole of AP-2446's scope.

**Expected Result:**
Either the contract is created — because the field is optional, and the form's own markup
says so (`required = false`) — or, if a financing company really is mandatory, the form
refuses the submission with a message beside the field saying so. This is how the
equivalent warranty form on the same product behaves: it rejects a bad submission with
"This value should not be blank." next to the offending field.

**Actual Result:**
The request returns HTTP status 500. The page is replaced by a generic error screen
reading *"Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez
recommencer une autre fois."* No contract is created, no invoice is raised, and nothing
on the screen indicates which field caused the problem. Selecting any financing company —
"AutoCapital Canada" was used — and submitting the identical form immediately succeeds
with HTTP 200 and the message "Permaplate contract generated successfully", which isolates
the cause to this one field.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot — first occurrence, quote 6284 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_001-step3-GenerateContractHttp500_fail.png` |
| Screenshot — reproduction, quote 6285 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/BUG-001-repro-Quote6285-Http500NoFinancingCompany_fail.png` |
| Screenshot — the warranty form validating cleanly, for contrast | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_005-step2-WarrantyFormValidatesCleanly_skipped.png` |
| Console log | One console error recorded at submit; the server returned a rendered error page rather than a stack trace, so no application detail was visible to the browser |

**Suggested Root Cause:**
Unknown — for developer investigation. The evidence points at the handler for
`permaplate_contract[financingCompany]` reading a property of the selected financing
company without first checking that one was chosen. The contract PDF renders a
"SOCIÉTÉ DE FINANCEMENT (si applicable)" block containing the company's name and address,
and the words *si applicable* suggest the block is meant to be optional in the document —
so the crash may be in building that block rather than in saving the contract.

**Notes:**
The field is genuinely optional in the markup, so a dealer has no way to know they must
set it. A dealer selling Permaplate for cash, with no financing involved, is exactly the
person who would leave it blank — and they are the one who cannot complete the sale.

**Re-verification (2026-09-13):** re-ran this exact repro on a fresh quote (6291), leaving
Financing company on "Choose". The contract generated successfully — alert "Esthetic
protection contract generated successfully" — with no HTTP 500. Screenshot:
`qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_001-step3-ContractGeneratedNoHttp500_pass.png`.
Full detail: `qa-artifacts/4-execution-results/5.1.0/execution-log_AP-2446_2026-09-13.md`.

---

### BUG-002 — The dealer is told the invoice is $145 but is billed $166.71

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2446_003 |
| **Requirement** | REQ-004 — AP-2446 criterion 2, the alert telling the user an invoice has been created |
| **Severity** | High — the dealer is quoted one figure on screen and charged a different, larger one, with no indication anywhere that tax will be added. |
| **Priority** | P1 |
| **Environment** | Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2460](https://garantieavantageplus.atlassian.net/browse/AP-2460) |
| **Status** | **Not a defect** — confirmed by Ken Nguyen (product owner) on the ticket 2026-09-08 |
| **First found** | 2026-09-06 |
| **Reproducibility** | Always — observed on the one contract created, and the arithmetic is deterministic |

**Summary:**
The success message shown after a Permaplate contract is created reads "Invoice #921
($145) is created", but the invoice that is actually raised bills $166.71 — the dealer
cost plus 14.975% Quebec sales tax. Every price the dealer sees before this point is also
the pre-tax figure, so nothing on any screen warns them the bill will be higher.

**Steps to Reproduce:**

1. Sign in to the Admin portal at `/admin/login` as `vinhle870@gmail.com` / `<password from the env source>`, open `/admin/dealer/1380/permaplate/link`, choose "**10 ans**" and click "**Save**". *(Skip if it is already linked.)*
2. Sign in to the Dealer portal at `/login` with the same account.
3. Open `/quote/new/client` and create a client — First name `Perma`, Last name `Testclient`, Email `perma.test.0906@yopmail.com`, Address `100 Rue Principale`, City `Montreal`, Province `Québec`, Postal code `H2X 1Y4`, Phone (home) `5145550100`, Phone (work) `5145550101`, tick the policy-agreement checkbox — then click "**Save**".
4. Open `/quote/{id}/vehicle`, select the vehicle whose VIN is `1FAHP35NX8W239204`, set Delivery date `2026-09-06` and Price `25000`, then click "**Save**".
5. Open `/quote/{id}/permaplate`, select the product radio "**10 ans**", then tick **two options whose costs are known**: "**Peinture – Céramique + Graphene**" at 75$ and "**Extra care (5 ans couverture )**" at 70$ — a total of **145$**. Click "**Save**". *(Extra care is a child of Peinture: it is disabled until Peinture is ticked, then ticks itself automatically.)*
6. Open `/quote/{id}/details` and confirm the Permaplate section shows "**Cost: 145$**".
7. Click "**Create Contract**", select any "**Financing company**" — "AutoCapital Canada" was used — and click "**Generate Contract**".
8. Read the green alert that appears on the quote details page. **Record the figure it quotes.**
9. Open **Billing → Invoices** at `/invoice` and read the Amount column for the invoice just created. **Compare it with the figure from step 8.**

Steps 1 and 2 are a **prerequisite owned by AP-2447**, not part of AP-2446: without a Permaplate product linked to the dealer, the Permaplate button does not appear on the quote page at all. Everything from step 3 onward — the quote, the contract, the alert and the invoice — is **Dealer Portal only**, which is the whole of AP-2446's scope.

**Expected Result:**
The figure quoted in the alert matches the amount the dealer will actually be billed, or
the alert makes clear that the figure is before tax — for example "Invoice #921 ($166.71
including taxes) is created". A dealer should not have to open a second screen to learn
what they have just been charged.

**Actual Result:**
The alert reads "**Invoice #921 ($145) is created**". The invoices page shows invoice 921
with Amount **$166.71**, status "Payment pending". The difference of $21.71 is exactly
14.975% of $145, which is Quebec's combined GST at 5% and QST at 9.975%. The alert quotes
the pre-tax dealer cost while the invoice bills the tax-inclusive total.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot — the alert quoting $145 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_002-step4-InvoiceCreatedAlert921_pass.png` |
| Screenshot — the invoice billing $166.71 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_003-step3-InvoiceAmount166vsAlert145AndWrongContractNo_fail.png` |
| Screenshot — the quote details showing "Cost: 145$" | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2456/AP2456_002-step3-QuoteDetailsCostOnlyNoRetail_pass.png` |
| Console log | None captured — this is a content problem, not a script error |

**Suggested Root Cause:**
Unknown — for developer investigation. The alert appears to be built from the quote's
pre-tax option total while the invoice is built from the same total with tax applied. The
likely fix is to quote the invoice's own amount in the message rather than recomputing it
from the quote.

**Notes:**
This is worth deciding deliberately rather than patching quickly, because it touches an
open question nobody has answered: AP-2446 never states what amount the Permaplate invoice
should carry, and AP-2456 removes retail pricing from the invoice description without
saying what replaces it. **The invoice amount itself looks correct** — dealer cost plus
Quebec tax is a reasonable bill. The defect is that the dealer is told a different number.

**Re-verification / reclassification (2026-09-13):** re-examined a new invoice (#926) on
its own detail page at `/invoice/926`, which the 2026-09-06 run did not check (that run
read only the `/invoice` list row's single "Amount" column). The detail page itemizes the
$145 pre-tax line, then "GST (5%) $7.25", "PST (9.975%) $14.46", "Grand Total $166.71" —
the same $145 the alert quotes, broken out in full. Ken Nguyen's ticket comment on
2026-09-08 confirmed this is intended: *"we are mentioning the amount before tax and it
should be accepted, no need to create a bug for it."* **Reclassified from Open to Not a
defect.** Screenshot:
`qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_003-step3-Invoice926CorrectContractNumberAndTaxBreakdown_pass.png`.

---

### BUG-003 — The Permaplate invoice cites contract number PNA-0000000000, which does not exist

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2446_003, seen most clearly in AP2448_005 |
| **Requirement** | REQ-004 — AP-2446 criterion 1, and REQ-006 — AP-2448 criterion 10 |
| **Severity** | High — no one can match a Permaplate invoice to the contract it pays for, which breaks reconciliation between the money and the record it belongs to. |
| **Priority** | P1 |
| **Environment** | Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2461](https://garantieavantageplus.atlassian.net/browse/AP-2461) |
| **Status** | **Resolved** — re-verified 2026-09-13 for new invoices |
| **First found** | 2026-09-06 |
| **Reproducibility** | Always — the same wrong value appears on both the dealer's invoices page and the admin contract details page (as of 2026-09-06; new invoices raised on 2026-09-13 carry the correct number) |

**Summary:**
The description of a Permaplate invoice contains the contract number `PNA-0000000000` — a
number with nothing but zeros — instead of the real contract number, which for the contract
tested is `PNA-0000000007`.

**Steps to Reproduce:**

1. Sign in to the Admin portal at `/admin/login` as `vinhle870@gmail.com` / `<password from the env source>`, open `/admin/dealer/1380/permaplate/link`, choose "**10 ans**" and click "**Save**". *(Skip if it is already linked.)*
2. Sign in to the Dealer portal at `/login` with the same account.
3. Open `/quote/new/client` and create a client — First name `Perma`, Last name `Testclient`, Email `perma.test.0906@yopmail.com`, Address `100 Rue Principale`, City `Montreal`, Province `Québec`, Postal code `H2X 1Y4`, Phone (home) `5145550100`, Phone (work) `5145550101`, tick the policy-agreement checkbox — then click "**Save**".
4. Open `/quote/{id}/vehicle`, select the vehicle whose VIN is `1FAHP35NX8W239204`, set Delivery date `2026-09-06` and Price `25000`, then click "**Save**".
5. Open `/quote/{id}/permaplate`, select the product radio "**10 ans**", tick "**Peinture – Céramique + Graphene**", and click "**Save**".
6. Open `/quote/{id}/details`, click "**Create Contract**", select any "**Financing company**", and click "**Generate Contract**". A contract is created and an invoice is raised.
7. Open **Contracts → Permaplate** at `/permaplate-contracts`, click "**Download**" on the new contract's row, and read the "**# CONTRACT:**" field at the top of page 1 of the PDF. **Record that number** — it read `PNA-0000000007` on the contract tested.
8. Open **Billing → Invoices** at `/invoice` and find the invoice raised in step 6 for client `Perma Testclient`.
9. Read the contract number inside that invoice's **Description** column, and **compare it with the number recorded in step 7**. The two do not match.

Every step above is in the **Dealer Portal**, which is the whole of AP-2446's scope. Steps 1 and 2 are the one exception and are a prerequisite owned by AP-2447 — without a linked product the dealer has no Permaplate button to start from.

*Also visible, but not required to reproduce:* the same wrong value appears on the Admin Portal's contract details page at `/admin/permaplate-contracts` → eye icon, where the page heading reads `PNA-0000000007` while the invoice row beneath it reads `PNA-0000000000`. That page belongs to **AP-2448**; it is the clearest single screenshot of the defect, which is why the evidence below was captured there, but the defect itself is in the invoice description and reproduces entirely in the Dealer Portal.

**Expected Result:**
The invoice description cites the contract number of the contract it was raised for, so
that an administrator or an accounts clerk can match the two. Here that is `PNA-0000000007`.

**Actual Result:**
The invoice description reads "Permaplate contract #7 / Perma Testclient / Ford Focus 2008
/ VIN : 1FAHP35NX8W239204 / **PNA-0000000000** / Test QA staging vinhle870@gmail.com". The
zeros appear in both places the description is shown. The admin contract details page is
the clearest illustration: its heading reads PNA-0000000007 while the invoice row directly
beneath it reads PNA-0000000000, on the same screen.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot — both numbers on one screen | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2448/AP2448_005-step4-DetailsPdfIframeAndInvoiceWrongPNA_fail.png` |
| Screenshot — the invoices page | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_003-step3-InvoiceAmount166vsAlert145AndWrongContractNo_fail.png` |
| Screenshot — the contract PDF showing PNA-0000000007 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2445/AP2445_001-step4-ContractPdfWithConditions6Pages_pass.png` |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. The pattern suggests the invoice description is
built before the contract number is assigned, so it formats an identifier that is still
zero or null. The contracts themselves are numbered correctly and sequentially:
`PNA-0000000001` through `PNA-0000000007` were all confirmed on their own detail pages, so
the numbering itself works — only the copy written into the invoice is wrong.

**Notes:**
The invoice description is otherwise complete and correct, carrying the client, the
vehicle, the VIN and the dealer. Only the contract number is wrong. Note that the
description also contains the internal identifier "#7", which happens to be the right
contract, so recovery is possible — but nobody reading the customer-facing number would
know that.

**Re-verification (2026-09-13):** created a new Permaplate contract (`PNA-0000000012`) and
invoice (`#926`) on a fresh quote. The invoice description, its footer "Invoice created"
link and its download link all cite `PNA-0000000012` consistently — no more zeros. The
historical invoice `#921` from 2026-09-06 still reads `PNA-0000000000`, which is expected:
a code fix corrects new records, not ones already written. Screenshot:
`qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2446/AP2446_003-step3-Invoice926CorrectContractNumberAndTaxBreakdown_pass.png`.

---

### BUG-004 — "Link a product" opens as a full page instead of the modal window the story specifies

| Field | Value |
|---|---|
| **Bug ID** | BUG-004 |
| **Test Case** | AP2447_002 |
| **Requirement** | REQ-001 — AP-2447 criterion 4, "A modal window opens to select a permaplate product" |
| **Severity** | Low — the function works correctly and the administrator can complete the task; only the presentation differs from what the story asked for. |
| **Priority** | P4 |
| **Environment** | Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | Linked to AP-2447 |
| **Status** | Open |
| **First found** | 2026-09-06 |
| **Reproducibility** | Always |

**Summary:**
Clicking "Link a product" on a dealer's Permaplate Products tab navigates to a separate
full page at `/admin/dealer/{id}/permaplate/link` rather than opening a modal window over
the current page, which is what AP-2447 criterion 4 describes.

**Steps to Reproduce:**

1. Sign in to the Admin portal at `/admin/login` as `vinhle870@gmail.com` / `<password from the env source>`.
2. Open `/admin/dealer/1380` — the Dealer details page for *Test QA staging*. Note the tab strip is on this page, **not** on `/admin/dealer/1380/edit`.
3. Select the "**Permaplate Products**" tab. The page shows the heading "Eligible Permaplate products" and a "Link a product" button.
4. Click "**Link a product**".
5. Observe whether the browser navigates away to a new page, or a dialog opens on top of the products tab with the list still visible behind it.
6. For contrast, go back to the Permaplate Products tab with at least one product linked and click the "**Unlink**" button on that row — this one opens a genuine modal over the page.

**Expected Result:**
A modal window opens over the Permaplate Products tab, titled "Link a permaplate product
to dealer Test QA staging", holding the product select box and a Save button — leaving the
list of already-linked products visible behind it.

**Actual Result:**
The browser navigates to `/admin/dealer/1380/permaplate/link`, a full page. The title, the
select box and the Save button are all exactly as specified, and saving works correctly —
only the presentation differs. The list of currently linked products is no longer visible
while choosing, so an administrator cannot see what the dealer already has without going
back.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot — the link form as a full page | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2447/AP2447_002-step2-LinkProductFormIsPageNotModal_fail.png` |
| Screenshot — the unlink flow, which does use a real modal | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2455/AP2455_002-step3-UnlinkConfirmModalExactText_pass.png` |
| Console log | None captured |

**Suggested Root Cause:**
Not a fault so much as an inconsistency. The unlink control on the very same page is built
as a proper modal — its markup carries `data-toggle="modal" data-target="#myModal"` — while
the link control is a plain link. The pattern to copy already exists a few lines away in
the same table.

**Notes:**
Worth confirming with the product owner whether the modal was a real requirement or just
how the story happened to be written. If a full page is acceptable, the acceptance
criterion should be corrected so the next tester does not raise this again.

**Observation (2026-09-13):** during the AP-2446 re-test, this same "Link a product"
control on Dealer 1380 opened as a modal dialog over the products tab, not a full page.
Not confirmed whether this was an intentional fix or a side effect of unrelated work — if
confirmed, this bug can close alongside the AP-2446 defects.

---

### BUG-005 — The dealer's Permaplate list shows the client's work phone while the quote page shows their home phone

| Field | Value |
|---|---|
| **Bug ID** | BUG-005 |
| **Test Case** | AP2443_003 |
| **Requirement** | REQ-005 — AP-2443 criterion 6, the "Client phone" column |
| **Severity** | Low — a phone number is shown and it does belong to the right client; it is simply a different one from the number every other screen shows for them. |
| **Priority** | P4 |
| **Environment** | Chromium via Playwright · Windows 11 · v2staging, Avantage Plus System v2.0.0 |
| **Tracker Ticket** | Linked to AP-2443 |
| **Status** | Open |
| **First found** | 2026-09-06 |
| **Reproducibility** | Always — the same choice is made on the dealer list and the admin list |

**Summary:**
The "Client phone" column on the dealer's Permaplate contracts list shows the client's
**work** number, while the quote details page and the contract PDF's "Phone (res.)" field
show their **home** number. A dealer comparing the two screens sees two different numbers
for the same client with nothing saying which is which.

**Steps to Reproduce:**

1. Sign in to the Admin portal at `/admin/login` as `vinhle870@gmail.com` / `<password from the env source>`, open `/admin/dealer/1380/permaplate/link`, choose "**10 ans**" and click "**Save**". *(Skip if it is already linked.)*
2. Sign in to the Dealer portal at `/login` with the same account.
3. Open `/quote/new/client` and create a client **whose two phone numbers differ, so they can be told apart** — First name `Perma`, Last name `Testclient`, Email `perma.test.0906@yopmail.com`, Address `100 Rue Principale`, City `Montreal`, Province `Québec`, Postal code `H2X 1Y4`, **Phone (home) `5145550100`**, **Phone (work) `5145550101`**, tick the policy-agreement checkbox — then click "**Save**".
4. Open `/quote/{id}/vehicle`, select the vehicle whose VIN is `1FAHP35NX8W239204`, set Delivery date `2026-09-06` and Price `25000`, then click "**Save**".
5. Open `/quote/{id}/permaplate`, select the product radio "**10 ans**", tick "**Peinture – Céramique + Graphene**", and click "**Save**".
6. Open `/quote/{id}/details`, click "**Create Contract**", select any "**Financing company**", and click "**Generate Contract**".
7. Open **Contracts → Permaplate** at `/permaplate-contracts` and read the "**Client phone**" column on that contract's row. **Record the number.**
8. Return to `/quote/{id}/details` and read the phone number shown in the **Client** section. **Compare it with the number from step 7.**
9. For a third view, open the admin list at `/admin/permaplate-contracts` and read the phone in the **Client** column, and download the contract PDF to read its "Phone (res.)" and "Phone (cell.)" fields.

**Expected Result:**
The number shown is the same one the rest of the product treats as the client's main
contact number, or the column heading says which number it is — for example "Client phone
(work)". Criterion 6 asks only for "Client phone" and does not say which, so either
behaviour could be defended; what should not happen is two screens disagreeing silently.

**Actual Result:**
The Permaplate list shows `5145550101`, the work number. The quote details page shows
`5145550100`, the home number. The admin Permaplate contract list also shows `5145550101`.
The contract PDF shows both, correctly labelled "Phone (res.)" and "Phone (cell.)".

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot — the dealer list showing 5145550101 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2443/AP2443_002-step3-DealerListAllFiveColumns_pass.png` |
| Screenshot — the quote details showing 5145550100 | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2456/AP2456_002-step3-QuoteDetailsCostOnlyNoRetail_pass.png` |
| Screenshot — the admin list, also showing the work number | `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2448/AP2448_003-step4-AdminContractListAllColumns_pass.png` |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. Most likely the list reads `telWork` where the
quote page reads `telHome`.

**Notes:**
Raised as a question as much as a defect. If showing the work number is deliberate — a
dealer calling a client during business hours would want it — then the answer is to label
the column, not to change the data. Either way it should be decided once and applied to
both the dealer and admin lists together, since they currently agree with each other and
disagree with everything else.

---

## What was tested and found working

Recorded here because a bug report that lists only failures gives a false impression of a
feature set that largely works, and because two of these were open risks the team was
carrying.

- **The conditions PDF now merges correctly.** The failure the author of AP-2445 reported on his own ticket on 2026-09-01 is fixed. The merged conditions are character-for-character identical to the approved English document attached to that ticket.
- **Unlinking a product destroys nothing.** A signed contract stays listed, stays downloadable and keeps its data after the product it was sold under is withdrawn. This was the single highest-risk unknown going into the cycle.
- **One dealership cannot reach another's contracts.** Requesting another dealer's contract download by changing the number in the address was refused in all three attempts.
- **A dealer with no linked product cannot start a Permaplate quote**, and the rule is enforced on the server rather than by hiding a button.
- **Retail pricing is genuinely gone** from all five surfaces AP-2456 names, and the contract PDF carries no price or tax line at all.

---

## Defects not raised, and why

- **AP-2443 criterion 5, the "account owner" visibility split, was never tested.** Every one of the five dealer-portal users on Dealer 1380 holds the "Account Owner" role, so there was no way to see what a non-owner sees. This is not a defect — it is an untested requirement, and it is the most important gap in the cycle because it is the feature set's only privacy rule.
- **The conditions language was only ever seen in English.** Nothing states which setting chooses the language, so producing a French contract would not have proved anything either way.
- **The warranty contract PDF was not re-tested** for damage from the shared document-merging code, because the warranty contract list offers no download control to test through. The risk is real but uncovered.
- **A two-level option chain is configurable** — a child option can be named as another option's parent — and nothing says what should then happen. No chain was built, so this is recorded as an unanswered question rather than a defect.

# Test Cases — AP2445 (File 1 of 1)

**Project:** Avantage Plus v2 — Permaplate feature set
**Requirement:** AP2445 — Permaplate conditions appended to the contract PDF (REQ-007)
**Source:** `requirements/AP-2445-permaplate-conditions-pdf.md`
**Date:** 2026-09-06
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2445_001 to AP2445_005 (5 test cases)
**Coverage:** Functional · Edge-case · Regression

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer, with the admin contract viewer as a second surface | `navigation` |
| **Entry route** | `/permaplate-contracts` — the dealer's Permaplate contract list, which carries the download control | `navigation` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal, `vinhle870@gmail.com` / `<password from the env source>` at `/login`. Admin at `/admin/login` for AP2445_004. | `env` |
| **Test data** | The Permaplate contract created in AP2446_001 for client `Perma Invoice`. The two condition documents attached to AP-2445 are the reference copies: `PP-OneB-Av_5-2026_EN_FINALE_1 - logo AV+.pdf` (English) and `PP-OneB-Av_5-2026_FR_FINALE_2 - Logo AV+.pdf` (French). | `test-data` |
| **Language** | Both English and French. The dealer's language is changed at `/language?redirectUrl={abs_url}`. Which setting decides the conditions language is not known — see blocker 2. | `navigation` |
| **Leaves behind** | A second Permaplate contract created in French by AP2445_003, plus its client, quote and invoice. | `cleanup` |

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Where in the merged document the conditions belong — before the contract, after it, or as a separate file. The ticket says only that the contract "contains" them. | AP2445_002 | Open — Q-008 |
| 2 | Which setting decides whether the English or the French conditions are used: the client's language, the dealer's, or a field on the contract. | AP2445_003 | Open — Q-008 |
| 3 | Whether the failure the ticket's own author reported on 2026-09-01 — "the PDF condition is not loading" — is fixed in the build now on staging. | AP2445_001 | Open — Q-007, answered by AP2445_001 itself |

> AP2445_003 ships **BLOCKED** because nobody has said what drives the language, so a French
> contract cannot be produced deliberately or judged. The other four are `Not Run`.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2445_001 | Downloading a Permaplate contract produces a PDF that contains the product conditions, not just the contract page | Functional | High | PASS |
| AP2445_002 | The conditions inside the contract PDF match the English conditions document attached to the ticket, page for page | Functional | High | PASS |
| AP2445_003 | A Permaplate contract for a French-language client carries the French conditions rather than the English ones | Functional | High | BLOCKED |
| AP2445_004 | The same conditions are present when the contract PDF is viewed through the admin contract details page | Edge-case | Medium | PASS |
| AP2445_005 | The warranty contract PDF still downloads correctly and has not gained the Permaplate conditions | Regression | Medium | SKIPPED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2445_001 — Downloading a Permaplate contract produces a PDF that contains the product conditions, not just the contract page

| Field | Value |
|---|---|
| **TC ID** | AP2445_001 |
| **Title** | Downloading a Permaplate contract produces a PDF that contains the product conditions, not just the contract page |
| **Requirement** | AP2445 — criterion 1 |
| **Route** | `/permaplate-contracts` — Contracts → Permaplate in the Dealer portal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** This case answers the open question the ticket raises against itself.
Its author reported on 2026-09-01 that the conditions PDF was not loading, with a screen
recording attached, and nobody has confirmed a fix since. Running this first tells the team
whether they are looking at a known defect or a fixed one. The conditions are the legal
terms of the product, so a contract that reaches a client without them is a document the
business may not be able to rely on.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The Permaplate contract created in AP2446_001 for client `Perma Invoice` |
| Expected minimum | More than one page: at least the contract itself plus the conditions |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal at `/login` and open `/permaplate-contracts` | The Permaplate contracts list loads and includes the contract created in AP2446_001 for client `Perma Invoice` |
| 2 | Click the download control on that contract's row and save the file | A PDF file downloads without an error page. If the download fails or returns an error, record the exact message and the HTTP status — that is the known defect from the ticket's own comment |
| 3 | Open the downloaded PDF and count its pages, recording the heading of each one | The page count and the headings are recorded |
| 4 | [Verification] Confirm the PDF holds both the Permaplate contract itself and the product conditions, and is not a single contract page alone | The document contains the conditions in addition to the contract. A one-page document holding only the contract is a clear failure of criterion 1 and confirms the defect the author already reported |

---

### AP2445_002 — The conditions inside the contract PDF match the English conditions document attached to the ticket, page for page

| Field | Value |
|---|---|
| **TC ID** | AP2445_002 |
| **Title** | The conditions inside the contract PDF match the English conditions document attached to the ticket, page for page |
| **Requirement** | AP2445 — criterion 1 |
| **Route** | `/permaplate-contracts` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** It is not enough that some conditions are attached. If the document
merged into the contract is an older revision, or a different product's terms, the client
signs terms the business did not intend to offer. The attachment on the ticket is the
authoritative copy, so this case compares the two directly.

**Test Data:**

| Variable | Value |
|---|---|
| Reference document | `PP-OneB-Av_5-2026_EN_FINALE_1 - logo AV+.pdf`, attached to Jira issue AP-2445 |
| Contract PDF | The file downloaded in AP2445_001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Download the English conditions document `PP-OneB-Av_5-2026_EN_FINALE_1 - logo AV+.pdf` from the attachments of Jira issue AP-2445, and have the contract PDF from AP2445_001 open beside it | Both documents are available locally |
| 2 | Count the pages of the reference conditions document and read its first heading and its last line | The reference document's page count and boundary text are recorded |
| 3 | Find where the conditions begin inside the contract PDF and record which page number that is | The starting page of the conditions inside the merged document is recorded. This also gives Q-008 its answer about page order |
| 4 | [Verification] Compare the conditions pages inside the contract PDF against the reference document — same page count, same first heading, same closing text, and the Avantage Plus logo present | The conditions inside the contract are the same document as the one attached to the ticket. Any difference in page count or wording is reported, because it means clients are being given terms other than the approved ones |

---

### AP2445_003 — A Permaplate contract for a French-language client carries the French conditions rather than the English ones

| Field | Value |
|---|---|
| **TC ID** | AP2445_003 |
| **Title** | A Permaplate contract for a French-language client carries the French conditions rather than the English ones |
| **Requirement** | AP2445 — criterion 2 |
| **Route** | `/language?redirectUrl={abs_url}`, then the Permaplate quote and contract flow |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | Q-008 — nobody has said which setting decides the conditions language. Without that, a French contract cannot be produced on purpose, and if an English document appears there is no way to tell whether the feature is broken or the wrong setting was used. |
| **Executed on** | 2026-09-06 |
| **Result** | BLOCKED — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** Quebec is this dealership's province and French is the working
language of most of its clients. A client who receives terms in a language they do not read
has not meaningfully agreed to them, which is exactly the risk the ticket was written to
close.

**Test Data:**

| Variable | Value |
|---|---|
| Client, created by this case | First name `Perma`, last name `Francais`, email `perma.fr.0906@yopmail.com`, address `550 Rue Notre-Dame`, city `Quebec`, province `Québec`, postal code `G1R 4S9`, home phone `4185550500`, work phone `4185550501`, policy-agreement checkbox ticked |
| Vehicle | The inventory option whose VIN is `1FAHP35NX8W239204` |
| Reference document | `PP-OneB-Av_5-2026_FR_FINALE_2 - Logo AV+.pdf`, attached to Jira issue AP-2445 |
| Original dealer language | Recorded before it is changed, and restored at the end |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/language`, record the current language setting, then set it to **Français** | The portal switches to French and the original setting is recorded so it can be restored |
| 2 | [Pre-Condition] Create a quote at `/quote/new/client` for client `Perma Francais`, email `perma.fr.0906@yopmail.com`, address `550 Rue Notre-Dame`, city `Quebec`, province `Québec`, postal code `G1R 4S9`, home phone `4185550500`, work phone `4185550501`, policy checkbox ticked → **Save**; attach the vehicle with VIN `1FAHP35NX8W239204` → **Save**; then at `/quote/{id}/permaplate` select the linked product and one option → **Save** and generate the contract | A French-context Permaplate contract exists. Its number is recorded |
| 3 | Download that contract's PDF from `/permaplate-contracts` and open it | The PDF downloads and its conditions pages can be read |
| 4 | [Verification] Confirm the conditions inside the PDF are the French document, matching `PP-OneB-Av_5-2026_FR_FINALE_2 - Logo AV+.pdf`, and record which setting was in French at the time — the portal language, the client's province, or anything else visible on the contract | The French conditions are present. The case is reported **Blocked** rather than Pass until Q-008 confirms which setting is supposed to drive the choice, because an English document here could mean either a broken feature or the wrong lever pulled |
| 5 | Restore the dealer portal language to the value recorded in step 1 | The shared language setting is back as it was, so later cases are not run in an unexpected language |

---

### AP2445_004 — The same conditions are present when the contract PDF is viewed through the admin contract details page

| Field | Value |
|---|---|
| **TC ID** | AP2445_004 |
| **Title** | The same conditions are present when the contract PDF is viewed through the admin contract details page |
| **Requirement** | AP2445 — criterion 1, on the admin surface described by AP2448 criterion 9 |
| **Route** | The admin Permaplate contract details page reached from CONTRACTS → Permaplate |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** The contract reaches the screen through two different routes — the
dealer downloads a file, and the administrator views it inside a panel on the page. If the
conditions are merged in one route but not the other, an administrator checking a client
complaint would see a different document from the one the client actually received.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The one created in AP2446_001 for client `Perma Invoice` |
| Comparison | The PDF downloaded in AP2445_001 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Admin portal at `/admin/login` and open the Permaplate Contracts page from the CONTRACTS menu | The admin Permaplate contract list loads and includes the contract for client `Perma Invoice` |
| 2 | Click the view button on that contract's row | The contract details page opens with the contract PDF displayed inside a panel on the page |
| 3 | [Verification] Scroll through the PDF in that panel and confirm the product conditions are present, with the same page count as the file downloaded in AP2445_001 | The conditions appear in the admin view exactly as they do in the downloaded file. If AP-2448 turns out not to be deployed, this case is recorded as Blocked on that fact rather than Failed |

---

### AP2445_005 — The warranty contract PDF still downloads correctly and has not gained the Permaplate conditions

| Field | Value |
|---|---|
| **TC ID** | AP2445_005 |
| **Title** | The warranty contract PDF still downloads correctly and has not gained the Permaplate conditions |
| **Requirement** | AP2445 — criterion 1, checked for side effects |
| **Route** | `/warranty` — Contracts → Warranty in the Dealer portal |
| **Type** | Regression |
| **Priority** | Medium |
| **Status** | SKIPPED |
| **Blocked by** | — |
| **Executed on** | 2026-09-06 |
| **Result** | SKIPPED — see `qa-artifacts/4-execution-results/5.1.0/execution-log_PERMAPLATE_2026-09-06.md` |

**Why this matters:** Merging one document into another is done by shared code. The
comparable AP-2437 work merged a form into the Chubb insurance contract using the same
mechanism, so a change here can reach documents nobody was thinking about. A warranty
contract that suddenly carries Permaplate paint-protection terms would be sent to clients
who never bought the product.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The warranty contract created in AP2446_005 for client `Warranty Regression` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal and open `/warranty` | The warranty contracts list loads and includes the contract created in AP2446_005 |
| 2 | Download the warranty contract PDF for client `Warranty Regression` and open it | The PDF downloads without an error and opens normally |
| 3 | [Verification] Confirm the document is the warranty contract, that it opens without a damaged-file warning, and that it does **not** contain the Permaplate conditions | The warranty PDF is intact and carries no Permaplate content. Any Permaplate conditions found inside it are reported as a High-severity finding, because clients would be sent terms for a product they did not buy |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| Criterion 1 — the contract contains the conditions PDF | AP2445_001, AP2445_002 | — | AP2445_004 | AP2445_005 |
| Criterion 2 — the conditions are in the respective language | AP2445_003 | — | — | — |

**One risk from the analysis has no case here.** The analysis noted that nothing says what
happens if the conditions document for the required language is missing. Only two documents
exist and both are attached to the ticket, so there is no third language to test with and no
way to remove one from the screen. It stays an open question rather than a permanently
Blocked case.

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2445_001 | PASS | see execution log |
| AP2445_002 | PASS | see execution log |
| AP2445_003 | BLOCKED | see execution log |
| AP2445_004 | PASS | see execution log |
| AP2445_005 | SKIPPED | see execution log |

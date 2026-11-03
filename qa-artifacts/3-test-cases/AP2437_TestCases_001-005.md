# Test Cases — AP2437 (File 1 of 5)

**Project:** Avantage Plus (AP) — Dealer Portal, Chubb creditor-insurance contract printing
**Requirement:** AP-2437 — Attach the acceptance/waiver form to the Chubb insurance contract PDF
**Source:** `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2437_test-plan.md` · Jira [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437)
**Date:** 2026-09-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2437_001 to AP2437_005 (5 test cases)
**Coverage:** Functional · Regression · UI — REQ-001, REQ-002, REQ-005

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/creditor-insurance-contracts` — **Contracts → Creditors insurance**. Each row carries a single **Download** action pointing at `/quote/{quoteId}/chubb/insurance/contract-pdf` (keyed on the quote id, not the contract number). Mapped and verified 2026-09-04 — **Q-013 closed**. | `navigation`, `contract-setup` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | Dealer portal `/login` — `vinhle870@gmail.com` / `<password from the env source>` · Dealer ID `1380`, company label "Test QA staging", province QC | `env` |
| **Admin login (setup only)** | `/admin/login` — same credentials. Chubb Insurance Configuration at `/admin/dealer/1380/chubb-insurance`. Both sessions can be held at once in one browser. | `env` |
| **Test data** | Contract **`AVP000160`** on quote **6276** (Marie Tremblay) — Français / rate table PM50, created 2026-09-04; download at `/quote/6276/chubb/insurance/contract-pdf`. Dealer `1380`, creditor account `AP0001`. The four acceptance-form PDFs attached to AP-2437, downloaded locally for comparison | `test-data`, `contract-setup`, ticket attachments |
| **Language** | Contract AVP000160 is **Français**. `quote_financing_insurance_chubb.language` is set by the **Language** dropdown on `/quote/{id}/insurance` (values `E` / `F`) — **Q-003 closed**. The admin login page always renders in French regardless of the portal language setting. | `navigation`, `contract-setup` |
| **Contract setup** | Contracts are **dynamic test data** — each case that needs one creates it in its own `[Pre-Condition]` step, with the field values written there. Background, rationale and the full register live in `base-test/06-chubb-contract-setup.md`; that file is reference material for the designer, not a step the executor follows | `contract-setup` |
| **Contracts already created** | `AVP000160` — quote 6276, Marie Tremblay, **Français / PM50** (branch 1). Reuse it rather than creating another; every stage A–C run leaves a permanent contract that nothing removes. Branches 2–4 have none yet | `contract-setup` |
| **Leaves behind** | Nothing new if AVP000160 is reused — these five cases only read it. Creating a further contract leaves a permanent record: see `contract-setup` §4. The `cleanup` source is **missing**, so nothing is torn down automatically. Dealer 1380's Chubb assignment (Creditor Monthly PM30, Creditor Monthly PM50, GAP) must be restored by any case that changes it. | `cleanup` (missing), `contract-setup` |

**How to inspect the produced PDF.** The deliverable of every case in this batch is a
downloaded file, not a page. Before step 1 of the first case, establish which of these
two applies on this host and use it consistently: **(a)** Chromium opens the contract in
a browser tab, in which case the agent reads it from the page snapshot; or **(b)** the
file downloads to disk, in which case the agent opens it outside the browser. Record
which route was used in the execution log. **Do not pass a case on the evidence that "a
file downloaded" — every assertion here is about what is inside the file.**

**Known blockers** — facts these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether "attach on the first page" means the form becomes page 1 with the contract shifted down, or is stamped as an overlay onto the existing first page | AP2437_002 | Open — **Q-006**, asked 2026-09-03. Observation of 2026-09-04 favours insertion: the merged PDF is 12 pages with a standalone form as page 1, but the developer should still confirm the intent |

> **These five cases are no longer blocked.** The contract that did not exist on
> 2026-09-03 now does: **AVP000160** on quote 6276, created 2026-09-04 through the flow
> recorded in the `contract-setup` baseline. Q-013 (the download route), Q-002 (the rate
> field), Q-003 (the language field) and Q-005 (`qpdf` on staging) are all closed by that
> run. Step 1 of every case below now *creates or reuses* the contract rather than
> assuming one exists.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2437_001 | Downloading a Chubb insurance contract produces a PDF that already contains the acceptance/waiver form, with no extra step by the advisor | Functional | High | PASS |
| AP2437_002 | The acceptance/waiver form is the first page of the contract PDF and the Chubb pages follow it in their original order | Functional | High | PASS |
| AP2437_003 | Contract generation completes without the Zend_Pdf syntax error that AP-2437 exists to fix | Regression | High | PASS |
| AP2437_004 | The client's data on the Chubb-supplied pages is unchanged after the form is merged in | Functional | High | SKIPPED |
| AP2437_005 | The merged contract opens, prints and stays searchable in Chrome, Edge and Acrobat | Functional | Medium | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2437_001 — Downloading a Chubb insurance contract produces a PDF that already contains the acceptance/waiver form, with no extra step by the advisor

| Field | Value |
|---|---|
| **TC ID** | AP2437_001 |
| **Title** | Downloading a Chubb insurance contract produces a PDF that already contains the acceptance/waiver form, with no extra step by the advisor |
| **Requirement** | REQ-001 — the form is inserted automatically when the contract is printed; the advisor performs no additional action |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (unblocked 2026-09-04: contract AVP000160 exists, download route mapped, `qpdf` confirmed on staging) |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — AVP000160 downloaded (HTTP 200, application/pdf, 2,868,256 bytes, 1.7 s). Page 1 is the acceptance form; no extra advisor step |

**Why this matters:** This is the whole story in one case. If the form is not in the
downloaded file, a Quebec dealership hands the client a contract with no record that the
dealership's commission was disclosed before the sale — the exact legal exposure AP-2437
was raised to close. It also matters that the insertion is *automatic*: a feature that
works only when the advisor remembers an extra click is a feature that will be missed
under counter pressure.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | `vinhle870@gmail.com` / `<password from the env source>` |
| Dealer ID | `1380` — "Test QA staging", province QC |
| Creditor account number | `AP0001` |
| Contract | An existing Chubb creditor-insurance contract for Dealer 1380 — **identify it during the run and record its ID in the execution log** |
| Reference forms | The four PDFs attached to AP-2437, downloaded locally before the run |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/login` as `vinhle870@gmail.com` / `<password from the env source>`. Open `/creditor-insurance-contracts` — **if contract AVP000160 (quote 6276) is listed, reuse it and skip step 2** | Dashboard shows "Test QA staging". The contract list either shows AVP000160 with a **Download** action, or is empty |
| 2 | [Pre-Condition] Only if no contract exists — open a quote with a client and vehicle from `/quotes` (rows carry `data-href="/quote/{id}/details"`), then at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | Flash "Chubb insurance contract created successfully"; the contract is listed on `/creditor-insurance-contracts` with a **Download** action. Stages take ~5-10 s each — re-read the page rather than retrying, or a blind retry creates a second contract |
| 3 | Click **"Download"** on the contract row (`/quote/{quoteId}/chubb/insurance/contract-pdf`) | The PDF opens in a browser tab — served `application/pdf`, `inline; filename=contrat.pdf`. No error page, no server error, and no `Zend_Pdf` message |
| 4 | Open the produced PDF and read its first page | The first page is the acceptance-or-waiver form for credit insurance, matching one of the four PDFs attached to AP-2437 |
| 5 | [Verification] Verify the acceptance/waiver form is present in the downloaded PDF and that no additional button, upload or file-selection step was required at any point between opening the contract and receiving the file | The form is present in the produced PDF, and the only action taken was the single download click in step 3. Capture a screenshot of the form page as evidence |

---

### AP2437_002 — The acceptance/waiver form is the first page of the contract PDF and the Chubb pages follow it in their original order

| Field | Value |
|---|---|
| **TC ID** | AP2437_002 |
| **Title** | The acceptance/waiver form is the first page of the contract PDF and the Chubb pages follow it in their original order |
| **Requirement** | REQ-002 — the form is placed on the first page; all Chubb pages survive in order; total page count equals the original plus the form |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — for execution. Q-006 still governs *scoring* step 5: "attach on the first page" is ambiguous between inserting a page and stamping an overlay |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — 12-page PDF: page 1 the form, pages 2-12 the Chubb contract in order. Form is an inserted page, not an overlay (resolves Q-006 in practice) |

**Why this matters:** Placement is a stated acceptance criterion, not a preference. The
client is meant to read the disclosure before the contract terms rather than find it
buried behind them. Page order is also the most common way a PDF merge goes subtly
wrong: the file opens, nothing errors, and the pages are simply in the wrong sequence —
which no download-succeeded check would catch.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Original Chubb page count | To be recorded before the fix is exercised | Needed to compute the expected total. If a pre-fix contract is unavailable, take the count from the Chubb pages visible in the merged file |
| Acceptance form page count | To be read from the relevant attached PDF | Open the four AP-2437 attachments locally and record each one's page count before the run |
| Expected merged page count | Chubb pages + form pages | The arithmetic assertion for step 5 |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in at `/login` and open `/creditor-insurance-contracts`, reusing the contract from AP2437_001 (AVP000160, quote 6276). If absent, create one: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | A contract row is present with a **Download** action, and its number is recorded |
| 2 | [Pre-Condition] Open the four AP-2437 attachment PDFs locally and record the page count of each | Four page counts recorded, one per form variant |
| 3 | Download the contract PDF and open it | A PDF is produced and opens without error |
| 4 | Read page 1, then page 2 and the pages following it | Page 1 is the acceptance/waiver form. Page 2 onward are the Chubb-supplied contract pages, in the order they appear in the Chubb original — no page reordered, none missing, none duplicated |
| 5 | [Verification] Verify the total page count of the merged PDF equals the Chubb page count plus the acceptance-form page count, and that the form is a separate inserted page rather than an overlay printed on top of the Chubb first page | The arithmetic holds, and no Chubb contract text shows through behind the form. If the form is instead overlaid on the Chubb first page, record the observation, mark FAIL against this reading, and reference Q-006 — the requirement is ambiguous and the developer's answer decides which reading is correct |

---

### AP2437_003 — Contract generation completes without the Zend_Pdf syntax error that AP-2437 exists to fix

| Field | Value |
|---|---|
| **TC ID** | AP2437_003 |
| **Title** | Contract generation completes without the Zend_Pdf syntax error that AP-2437 exists to fix |
| **Requirement** | REQ-005 — no `Zend_Pdf_Exception` and no other server error during contract generation |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (unblocked 2026-09-04) |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — HTTP 200, %PDF-1.7, valid EOF, no Zend_Pdf or "Wrong W dictionary" text anywhere. The historical defect is fixed |

**Why this matters:** This is the defect the story spent thirteen comments diagnosing.
Chubb returns a PDF 1.7 file using a compressed cross-reference stream — a modern index
format — and encrypted with an empty password, and the portal's old library `Zend_Pdf`
supported neither, so generation threw a hard exception at a fixed byte offset. If that
exception is still raised, nothing else in this batch can be true. A visible reproduction
of the original error is the single fastest signal that the fix did not deploy.

**Test Data:**

| Variable | Value |
|---|---|
| Historical error text | `Zend_Pdf_Exception: PDF file syntax error. Offset - 0x2F862C. Wrong W dictionary entry. Only type field of stream entries has default value and could be zero length.` |
| Creditor account number | `AP0001` — the value the ticket comments name as the one that produces a working Chubb call |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in as admin at `/admin/login` and open `/admin/dealer/1380/chubb-insurance`; confirm `chubb_insurance[creditorAccountNumber]` is `AP0001` | The Chubb Insurance Configuration page shows creditor account number `AP0001`. If it differs, set it to `AP0001` and note the original value for restoration |
| 2 | [Pre-Condition] In the dealer portal open `/creditor-insurance-contracts` and select AVP000160. If absent, create one: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | The contract row is listed with its **Download** action |
| 3 | Download the contract PDF and watch the response | The download completes. No 500 error page, no PHP exception trace, and no message containing "Zend_Pdf" or "Wrong W dictionary entry" appears anywhere on screen |
| 4 | Open the browser console and the network panel and review the download request | The download request returns HTTP 200 with a PDF content type. No console error is logged for the request |
| 5 | [Verification] Verify a valid PDF was produced and that the exact historical error text does not appear on the page, in the console, or in the response body | A readable PDF exists; the historical error text appears nowhere. Capture a screenshot of the successful download and of the network response status |

---

### AP2437_004 — The client's data on the Chubb-supplied pages is unchanged after the form is merged in

| Field | Value |
|---|---|
| **TC ID** | AP2437_004 |
| **Title** | The client's data on the Chubb-supplied pages is unchanged after the form is merged in |
| **Requirement** | REQ-005 — every piece of client-specific data on the Chubb pages survives the merge unchanged |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | SKIPPED |
| **Blocked by** | — (unblocked 2026-09-04) |
| **Executed on** | 2026-09-06 |
| **Result** | SKIPPED — premise does not hold: the Chubb pages carry no client identity. "Tremblay" and "494.91" appear nowhere in the file (raw bytes, 295 decompressed streams, UTF-16). Only AVP000160 and the dealership are present |

**Why this matters:** The merge now runs every Chubb PDF through an external `qpdf`
process and a rewrite before the dealer sees it. A PDF pipeline that damages content
usually does so quietly — a dropped form field, an accented character replaced, a
number re-rendered — and the file still opens perfectly. On a legally binding contract,
a silently altered client name or premium amount is far more dangerous than a file that
refuses to open, because nothing prompts anyone to look.

**Test Data:**

| Variable | Value |
|---|---|
| Fields to compare | Client name, contract or policy number, premium amount, coverage dates, dealership name — whichever of these the Chubb contract displays |
| Reference source | The same values as shown in the portal's contract record, read before the download |
| Accent check | If the client name carries accented characters (for example `Josée Côté-Bélanger`), they must render identically in the PDF |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in, open `/creditor-insurance-contracts` and select AVP000160 — if absent create one (at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page) — then record the client name, contract number, premium and coverage shown in the row | Field values recorded. For AVP000160: Marie Tremblay, 494.91 $ / 60 months, rate table PM50, Français |
| 2 | Download the contract PDF and open it | A PDF is produced and opens without error |
| 3 | Read the Chubb-supplied pages (page 2 onward) and locate each field recorded in step 1 | Every recorded field is found on the Chubb pages |
| 4 | Select and copy a paragraph of text from a Chubb page | Text selection works — the pages are real text, not flattened images |
| 5 | [Verification] Verify every field value in the PDF matches the value recorded from the portal in step 1 character for character, accented characters included | All values match exactly. Any difference — a changed digit, a dropped accent, a truncated name — is a FAIL and is reported as High severity, since it corrupts a legally binding document. Capture a screenshot of the Chubb page showing the client data |

---

### AP2437_005 — The merged contract opens, prints and stays searchable in Chrome, Edge and Acrobat

| Field | Value |
|---|---|
| **TC ID** | AP2437_005 |
| **Title** | The merged contract opens, prints and stays searchable in Chrome, Edge and Acrobat |
| **Requirement** | REQ-005 — the merged PDF opens in the three viewers, text remains selectable and searchable, and printing is not restricted |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — (unblocked 2026-09-04) |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — opens in Chromium, /Encrypt absent so printing is unrestricted, and all fonts on both page types are Type0/Identity-H with /ToUnicode, so text is searchable. Edge and Acrobat were unavailable and were not claimed |

**Why this matters:** The original Chubb file was encrypted with print and edit
permissions restricted, and the fix strips that encryption with `qpdf --decrypt`
specifically so the contract can be printed at the counter. If the restriction survives,
the dealer can see the contract and cannot print it — which for a document the client
must sign on paper is the same as not having it. Different viewers also enforce PDF
permissions differently, so one viewer proving nothing is the reason this case names
three.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Viewers | Chrome built-in PDF viewer · Edge built-in PDF viewer · Adobe Acrobat Reader | Acrobat is the one that most strictly enforces permission flags |
| Search term | A word known to appear on a Chubb page, taken from AP2437_004's recorded fields | Proves the text layer survived |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Save the merged contract PDF from AP2437_001 to disk. The response is served `inline; filename=contrat.pdf`, so the browser renders it rather than downloading — save it from the viewer, or fetch `/quote/{quoteId}/chubb/insurance/contract-pdf` directly | A `contrat.pdf` of roughly 2.8 MB is available locally |
| 2 | Open the file in Chrome's PDF viewer, then in Edge's PDF viewer | The document opens in both, all pages render, no "damaged file" or "cannot open" message appears in either |
| 3 | Open the file in Adobe Acrobat Reader and check **File → Properties → Security** | Acrobat opens the file without prompting for a password. The Document Restrictions summary shows **Printing: Allowed** |
| 4 | In Acrobat, search for the term recorded in the test data and then use **File → Print** to print to PDF | The search finds the term on the expected page, and the print dialog completes without a permissions error |
| 5 | [Verification] Verify the document opened correctly in all three viewers, printing is allowed, and text search returns a hit on both the acceptance form page and a Chubb page | All three viewers render the document, printing is permitted, and search succeeds on both page types — confirming neither the inserted form nor the Chubb pages were flattened to images. Capture the Acrobat Security properties screen as evidence |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — form inserted automatically, no extra advisor step | AP2437_001 | *(file 4 — AP2437_016)* | — | — |
| REQ-002 — form on the first page, Chubb pages in order, page count correct | AP2437_002 | — | *(file 3 — AP2437_015)* | — |
| REQ-005 — no Zend_Pdf exception | — | — | — | AP2437_003 |
| REQ-005 — client data survives the merge | AP2437_004 | — | — | — |
| REQ-005 — PDF opens, prints, stays searchable | AP2437_005 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2437_001 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_002 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_003 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_004 | SKIPPED | see execution-log_AP-2437_2026-09-06.md |
| AP2437_005 | PASS | see execution-log_AP-2437_2026-09-06.md |

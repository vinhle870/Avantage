# Test Cases — AP2502 (File 1 of 1)

**Project:** Avantage Plus v2
**Requirement:** AP2502 — separate compliance document PDF for GC960 and 6201
**Source:** requirements/AP-2502-separate-compliance-document-pdf-for-gc960.md · qa-artifacts/1-requirements-analysis/AP-2502_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2502_test-plan.md
**Date:** 2026-11-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2502_001 to AP2502_005 (5 test cases)
**Coverage:** Functional · Regression · Edge-case (decision table) · Negative

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Filled in by the
designer from the sources the knowledge registry binds. Once this section is complete the
executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Admin (to change dealer 1380's Chubb creditor forms) and Dealer (to send). Both sessions can be held at once in one browser — logging into `/admin/login` does not end the dealer session | `navigation` §1 |
| **Entry route** | Admin: `/admin/dealer/1380/chubb-insurance` — Chubb Insurance Configuration (creditor account number text field + creditor form multi-select `creditorForm[]`). Dealer: `/quick-insurance-quote` — Insurance Quick Quote, whose **Form** drop-down lists the dealer's assigned creditor forms as values such as `GC6201MQ:PM30`, and whose header carries the **"Send compliance documents"** link (`/compliance-documents/send?redirectUrl=/quick-insurance-quote`) | `navigation`, `domain` (admin-portal.md, chubb-insurance.md §6, compliance-documents.md) |
| **Viewport** | 1280 × 800 | `navigation` §1 |
| **Environment** | **Dev** — `https://v2dev.garantieavantageplus.ca` (registry `execution_env: Dev`) | `env` (Dev Environment section) |
| **Login** | Dealer: dealer 1380 account ("Test QA staging") — `[SET IN .env: env source, Dev Environment section — dealer login]`. Admin: the same credentials at `/admin/login` (the page renders in French: "Courriel", "Mot de passe", "Se connecter") | `env`, `navigation` §1 |
| **Test data** | Dealer 1380 ("Test QA staging"). Its creditor forms on Dev as of 2026-11-02: the dealer-side Form drop-down offered `GC6201MQ:PM30` and `GC6201MQ:PM50` (AP-2499 run). Vehicle 915 (Ford Focus 2008, VIN `1FAHP35NX8W239204`, `/vehicle/915/details`) for AP2502_004 only. Inbox reader: `https://yopmail.com/en/?login=<name>` | `test-data`, `domain` (quote-creation.md *On Dev*) |
| **Language** | Dealer UI in English. The email body is bilingual and, on Staging (2026-08-29), carried both language variants of every document every time | `domain` (compliance-documents.md) |
| **Leaves behind** | One "Compliance documents" email in each inbox `client.stage.2502001@yopmail.com` … `client.stage.2502005@yopmail.com`; one row per send in the dealer's `/insurance-compliance-log`; one quote on vehicle 915 (AP2502_004, id recorded in the log) with one row in its "Compliance documents sent" section. Dealer 1380's creditor forms are restored by each case | `cleanup` — missing; listed here instead |

**How each document is identified — by its content, never by its file name** (Q-004).
Extract the text of every page of every PDF attachment (download it, then read its text)
to identify each document. The product line is read separately, from page 1 only — see
the product-line rule below the table:

| Document | Page 1 heading | Summary title (page 2) | Summary page footer |
|---|---|---|---|
| GC960 — French (`GC960S_AMFFS_F_DC2020.pdf` in the ticket) | "PARLONS ASSURANCE !" | "Plan de protection de paiement pour propriétaire d'équipement" | `PSF_GC960S(201907)` |
| GC960 — English (`Let's Talk Insurance and Summary Plan GC960, Anglais.pdf` in the ticket) | "LET'S TALK INSURANCE!" | "Equipment Owner Payment Protection Plan" | `PSE_GC960M(202601)` |
| GC6201 — French / English (existing `parlons-assurance-(EN/FR).pdf`) | "PARLONS ASSURANCE" (French) / "LET'S TALK INSURANCE" (English) — the **same headings as the GC960 files**, so the heading alone never identifies a GC6201 document | not recorded yet — record it | **Neither** `PSF_GC960S(201907)` **nor** `PSE_GC960M(202601)` on any page — record the footer it does carry |

**GC6201 document — the exclusion rule (F-2).** An attachment is a GC6201 document only
when its page 1 carries one of the two headings above **and** no page of it carries the
footer `PSF_GC960S(201907)` or `PSE_GC960M(202601)`. An attachment that carries either
footer is a GC960 document, whatever its file name. Attachments without either heading
(the 30 % / 50 % waiver forms and any other form) are neither — record them, never judge
them against a family check. In AP2502_002 a GC960 document, if one arrives, is recorded
for Q-009 and is **never** judged against the GC6201 check.

**The product line — where it is, and only there (F-1).** The product line is the value
printed on **page 1** after the label **"Nom du produit d'assurance :"** (French document)
or **"Name of insurance product:"** (English document) — and nothing else. Every family
check reads that value only; never search the whole document. `GC960` is also printed on
page 2 ("Police collective n° GC960" / "Group Policy GC960 (Monthly Premium Option)") and in
every summary footer, so a whole-document search would PASS a build that left the product
line empty or still naming `GC6201`.

- **How to read it.** Read page 1 as it is **rendered** (open the PDF in a viewer, or
  extract page 1 with layout text that includes annotations and form-field appearances,
  e.g. `pdftotext -layout -f 1 -l 1`). Plain content-stream extraction is not enough: in the
  supplied French file the value is not page content — it is an overlay annotation, and the
  content-stream text after the label is empty. The value is filled in at send time, so in
  a sent document it may be page text, a form field or an overlay.
- **What it is.** The value to the right of the label, including its continuation if it
  wraps onto the next printed line, up to the next label ("Espace réservé à l'assureur :" /
  "Reserved for use by the insurer:"). The insurer's name on the line above ("Chubb du
  Canada compagnie d'assurance vie" / "Chubb Life Insurance Company of Canada", after
  "Nom de l'assureur :" / "Name of insurer:") is **not** the product line — in the English
  file's layout it can print beside the product label; leave it out.
- **Reference values** (supplied ticket files, read 2026-11-03): French — "Police collective
  n° GC960 Plan de protection de paiement pour propriétaire d'équipement"; English —
  "Group Policy Number GC960 Equipment Owner Payment Protection Plan". The exact wording is
  recorded, not asserted (Q-002); only the family it names is checked.
- **Record** the full product line text of every fact-sheet document verbatim in the
  execution log, and take a screenshot of page 1 showing it.
- **Empty or missing.** A GC960 or GC6201 document whose product line is empty does not
  "mention" its family — that is a FAIL. If a GC6201 document has no such label on page 1
  at all, record its page-1 text in full and mark that check BLOCKED "product line label
  not found — Q-002" (the existing file's layout was never recorded).

**The "960 form" rule (Q-001, Judgement).** A creditor form counts as a 960 form **only**
when its visible label or its option value in the admin multi-select contains the
characters `960`. Never treat `S30`, `S45`, `M25`, `M30` or any other code as a 960 form
by inference. When no option contains `960`, change nothing and record the case
**BLOCKED — "test data not on Dev: no 960 creditor form in /admin/dealer/1380/chubb-insurance"**.

**Configuration restore.** Every case that changes the creditor forms writes the original
selection (label and value of each selected option, and the creditor account number) into
the execution log at step 1, and restores it in its own step before the final
verification. If a case stops early, restore the recorded selection by hand before the
next case runs.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether the Dev admin creditor-form list holds a form whose label or value contains "960" — nobody has seen one on any environment | AP2502_001, AP2502_003, AP2502_004 | Unverified — Q-001 (Judgement), checked read-only at step 1 of each case; the case is BLOCKED for missing test data when absent |
| 2 | Whether dealer 1380 on Dev is still assigned GC6201 forms (only GC6201 for 002; at least one GC6201 for 003) — true on 2026-11-02 | AP2502_002, AP2502_003 | Unverified — checked read-only from the dealer-side Form drop-down at step 1 of each case; BLOCKED when not |

> No case is BLOCKED at design time: no open question is Blocking, and both facts above
> are checked read-only at the first step of the affected case before anything is changed.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2502_001 | A dealer assigned only a 960 form sends the GC960 French and English documents, naming only GC960 | Functional | High | FAIL |
| AP2502_002 | A dealer assigned only GC6201 forms still sends the existing parlons-assurance document, naming only GC6201 | Regression | High | FAIL |
| AP2502_003 | A dealer assigned both families receives one separate document per family, each naming only its own | Edge-case | High | FAIL |
| AP2502_004 | Sending from a quote's details page also attaches the GC960 document for a 960-form dealer | Functional | Medium | FAIL |
| AP2502_005 | Sending with no creditor form assigned records what is sent and does not crash | Negative | Low | FAIL |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2502_001 — A dealer assigned only a 960 form sends the GC960 French and English documents, naming only GC960

| Field | Value |
|---|---|
| **TC ID** | AP2502_001 |
| **Title** | A dealer assigned only a 960 form sends the GC960 French and English documents, naming only GC960 |
| **Requirement** | REQ-001 AC 1–3 ("For `GC960`, only mention `GC960` in the product line text" + the two embedded files) · REQ-004 AC 1 ("EDIT: English version provided in the ticket.") |
| **Route** | `/admin/dealer/1380/chubb-insurance` → `/quick-insurance-quote` → Yopmail |
| **Type** | Functional |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — (BLOCKED at step 1 if Dev has no 960 creditor form) |
| **Executed on** | 2026-11-03, Dev (stlc-worker) |
| **Result** | FAIL — step 2 — send form HTTP 500 |

**Why this matters:** this is the change the ticket exists for. A Quebec client who buys GC960 creditor insurance must receive the GC960 fact sheet and summary; receiving the GC6201 one is a disclosure failure for the dealer.

**Test Data:**

| Variable | Value |
|---|---|
| Creditor form to select | The first option, in the multi-select's own order, whose label or value contains `960` — and nothing else |
| Client name | `Gisèle Tremblay AP2502-001` |
| Client email | `client.stage.2502001@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the Admin portal (`/admin/login`) and open `/admin/dealer/1380/chubb-insurance`. Write into the execution log the creditor account number and the label and value of every selected creditor form. If no option's label or value contains `960`, change nothing and stop: BLOCKED (Execution Context rule). Otherwise deselect every option, select only the first option whose label or value contains `960`, and click **Save** | The page saves without an error; reopening `/admin/dealer/1380/chubb-insurance` shows only the chosen 960 form selected and the creditor account number unchanged |
| 2 | [Pre-Condition] Log in to the Dealer portal and open `/quick-insurance-quote`. Write the **Form** drop-down's option values into the log (record-only, Q-001). Click **"Send compliance documents"**, type Client name `Gisèle Tremblay AP2502-001` and Client email `client.stage.2502001@yopmail.com`, click **"Send"** | The browser returns to `/quick-insurance-quote` with the alert "Compliance documents have been sent."; no error page and no HTTP 5xx |
| 3 | Open `https://yopmail.com/en/?login=client.stage.2502001`, open the "Compliance documents" email (allow up to 2 minutes, refreshing), and download every PDF attachment. Write each file name and the count into the log (record-only, Q-004), and which waiver forms (30 % / 50 %) arrived (record-only, Q-007) | One "Compliance documents" email from Systeme Avantage Plus is in the inbox, and every attachment downloads as a PDF |
| 4 | In the Admin portal open `/admin/dealer/1380/chubb-insurance`, select exactly the creditor forms written in the log at step 1 (and no others), click **Save** | Reopening the page shows exactly the step-1 selection and the same creditor account number |
| 5 | [Verification] Read the text of every downloaded attachment and compare it with the identification table in the Execution Context | (a) One attachment is the French GC960 document: page 1 "PARLONS ASSURANCE !", title "Plan de protection de paiement pour propriétaire d'équipement", footer `PSF_GC960S(201907)`. (b) One attachment is the English GC960 document: page 1 "LET'S TALK INSURANCE!", title "Equipment Owner Payment Protection Plan", footer `PSE_GC960M(202601)` — English text, not a copy of the French file. (c) In each of these two documents the product line — the page-1 value after "Nom du produit d'assurance :" / "Name of insurance product:", read as the Execution Context's product-line rule says, never a whole-document search — contains `GC960` and does not contain `GC6201`; an empty product line is a FAIL. Record each full product line verbatim with a page-1 screenshot (Q-002). Record every pre-filled value in each GC960 document (Q-003); the only fault judged here is an `AccountName` or `AccountAddress` value that names a dealer other than dealer 1380 ("Test QA staging"). Record whether a GC6201 document (Execution Context exclusion rule) also arrived (Q-009). Step 4's restore held |

---

### AP2502_002 — A dealer assigned only GC6201 forms still sends the existing parlons-assurance document, naming only GC6201

| Field | Value |
|---|---|
| **TC ID** | AP2502_002 |
| **Title** | A dealer assigned only GC6201 forms still sends the existing parlons-assurance document, naming only GC6201 |
| **Requirement** | REQ-002 AC 1–2 ("For `GC6201`, only mention `GC6201` the product line text, use existing parlons-assurance-(EN/FR).pdf") |
| **Route** | `/admin/dealer/1380/chubb-insurance` (read only) → `/quick-insurance-quote` → Yopmail |
| **Type** | Regression |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — (BLOCKED at step 1 if dealer 1380 is not GC6201-only on Dev) |
| **Executed on** | 2026-11-03, Dev (stlc-worker) |
| **Result** | FAIL — step 2 — send form HTTP 500 |

**Why this matters:** dealer 1380 and every existing GC6201 dealer send this document today. If the GC960 change leaks into their send, every GC6201 client receives the wrong product summary.

**Test Data:**

| Variable | Value |
|---|---|
| Creditor forms | Unchanged — dealer 1380's current assignment, which must be GC6201 only |
| Client name | `Gaston Pelletier AP2502-002` |
| Client email | `client.stage.2502002@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the Admin portal open `/admin/dealer/1380/chubb-insurance` and write the selected creditor forms (label and value) into the log — change nothing. In the Dealer portal open `/quick-insurance-quote` and write the **Form** drop-down's option values into the log. If any admin option selected contains `960`, or any Form value does not begin with `GC6201`, stop: BLOCKED "test data not on Dev: dealer 1380 is not GC6201-only" | Every Form value begins with `GC6201` (for example `GC6201MQ:PM30`, `GC6201MQ:PM50`) and no selected admin option contains `960` |
| 2 | On `/quick-insurance-quote` click **"Send compliance documents"**, type Client name `Gaston Pelletier AP2502-002` and Client email `client.stage.2502002@yopmail.com`, click **"Send"** | The browser returns to `/quick-insurance-quote` with the alert "Compliance documents have been sent."; no error page and no HTTP 5xx |
| 3 | Open `https://yopmail.com/en/?login=client.stage.2502002`, open the "Compliance documents" email (allow up to 2 minutes), download every PDF attachment, and write each file name and the count into the log (record-only, Q-004) | One "Compliance documents" email is in the inbox, and every attachment downloads as a PDF |
| 4 | Read the text of every page of every downloaded attachment and sort each one by the Execution Context exclusion rule: **GC960 document** (any page carries footer `PSF_GC960S(201907)` or `PSE_GC960M(202601)`) · **GC6201 document** (page 1 heading "PARLONS ASSURANCE" / "LET'S TALK INSURANCE" **and** neither GC960 footer on any page) · **other** (no such heading, e.g. a waiver form). Write the class of each attachment into the log | A French and an English GC6201 document are found and their text can be read. Any GC960 document is set aside for Q-009 and takes no part in step 5 |
| 5 | [Verification] Check only the French and English GC6201 documents found at step 4 | In both GC6201 documents the product line — the page-1 value after "Nom du produit d'assurance :" / "Name of insurance product:", read as the Execution Context's product-line rule says, never a whole-document search — contains `GC6201` and does not contain `GC960`; an empty product line is a FAIL. Record each full product line verbatim with a page-1 screenshot, the summary title and footer (Q-002), and the file name — the AC names the existing `parlons-assurance-(EN/FR).pdf` (Q-004). Record whether a GC960 document also arrived, with its file name and footer (Q-009 — record-only, never judged here) |

---

### AP2502_003 — A dealer assigned both families receives one separate document per family, each naming only its own

| Field | Value |
|---|---|
| **TC ID** | AP2502_003 |
| **Title** | A dealer assigned both families receives one separate document per family, each naming only its own |
| **Requirement** | REQ-003 AC 1–2 ("a separate document is filled for each product families"; AC lines 5 and 7) |
| **Route** | `/quick-insurance-quote` (read only) → `/admin/dealer/1380/chubb-insurance` → `/quick-insurance-quote` → Yopmail |
| **Type** | Edge-case (decision table — both settings on at once) |
| **Priority** | High |
| **Status** | FAIL |
| **Blocked by** | — (BLOCKED at step 1 if dealer 1380 has no GC6201 form on Dev, or Dev has no 960 creditor form) |
| **Executed on** | 2026-11-03, Dev (stlc-worker) |
| **Result** | FAIL — step 2 — send form HTTP 500 |

**Why this matters:** a dealer that sells both families must hand the client both summaries, and neither may name the other family's product. A merged document, or one family missing, misinforms the client.

**Test Data:**

| Variable | Value |
|---|---|
| Creditor forms to select | The forms already selected at step 1 (dealer 1380's GC6201 forms) **plus** the first option whose label or value contains `960` |
| Client name | `Hélène Gagnon AP2502-003` |
| Client email | `client.stage.2502003@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] First, in the Dealer portal open `/quick-insurance-quote` and write the **Form** drop-down's option values into the log. If no value begins with `GC6201`, change nothing and stop: BLOCKED "test data not on Dev: dealer 1380 has no GC6201 creditor form". Then in the Admin portal open `/admin/dealer/1380/chubb-insurance` and write the creditor account number and every selected creditor form (label and value) into the log. If no option contains `960`, change nothing and stop: BLOCKED. Otherwise keep every currently selected form, also select the first option whose label or value contains `960`, click **Save** | At least one Form value begins with `GC6201`; reopening the admin page shows the step-1 forms plus the chosen 960 form selected; no error |
| 2 | [Pre-Condition] In the Dealer portal open `/quick-insurance-quote` and write the **Form** option values into the log (record-only, Q-001). Click **"Send compliance documents"**, type Client name `Hélène Gagnon AP2502-003` and Client email `client.stage.2502003@yopmail.com`, click **"Send"** | The browser returns to `/quick-insurance-quote` with the alert "Compliance documents have been sent."; no error page and no HTTP 5xx |
| 3 | Open `https://yopmail.com/en/?login=client.stage.2502003`, open the "Compliance documents" email (allow up to 2 minutes), download every PDF attachment, and write each file name and the count into the log (record-only, Q-004) | One "Compliance documents" email is in the inbox, and every attachment downloads as a PDF |
| 4 | In the Admin portal open `/admin/dealer/1380/chubb-insurance`, select exactly the creditor forms written at step 1 (and no others), click **Save** | Reopening the page shows exactly the step-1 selection and the same creditor account number |
| 5 | [Verification] Read the text of every page of every downloaded attachment and sort each one by the identification table and the exclusion rule (GC960 document = carries footer `PSF_GC960S(201907)` or `PSE_GC960M(202601)`; GC6201 document = "PARLONS ASSURANCE" / "LET'S TALK INSURANCE" page 1 **and** neither GC960 footer) | The GC960 French document (`PSF_GC960S(201907)`) and the GC960 English document (`PSE_GC960M(202601)`) are present, **and** separate French and English GC6201 documents (by the exclusion rule) are present — no single PDF holds both families. Reading only the page-1 product line (the value after "Nom du produit d'assurance :" / "Name of insurance product:", per the Execution Context rule — never a whole-document search): in each GC960 document it contains `GC960` and not `GC6201`; in each GC6201 document it contains `GC6201` and not `GC960`; an empty product line is a FAIL. Record each product line verbatim with a page-1 screenshot (Q-002). Step 4's restore held |

---

### AP2502_004 — Sending from a quote's details page also attaches the GC960 document for a 960-form dealer

| Field | Value |
|---|---|
| **TC ID** | AP2502_004 |
| **Title** | Sending from a quote's details page also attaches the GC960 document for a 960-form dealer |
| **Requirement** | REQ-001 AC 1–2 (second send entry point, Quote Details) |
| **Route** | `/admin/dealer/1380/chubb-insurance` → `/vehicle/915/details` → `/quote/{id}/details` → Yopmail |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — (BLOCKED at step 1 if Dev has no 960 creditor form) |
| **Executed on** | 2026-11-03, Dev (stlc-worker) |
| **Result** | FAIL — step 3 — send form HTTP 500 (quote 6567) |

**Why this matters:** most sends happen from a quote, where the client e-mail is pre-filled. The family document must not depend on which page the dealer sends from.

**Test Data:**

| Variable | Value |
|---|---|
| Creditor form to select | The first option whose label or value contains `960` — and nothing else |
| Client (quote) | First name `Rosalie`, Last name `Bouchard AP2502-004`, Email `client.stage.2502004@yopmail.com`, Address `100 rue Principale`, City `Québec`, Province `Québec`, Postal code `G1R 2B5`, Home phone `418-555-0104`, Work phone `418-555-0204` |
| Client name for the send | `Rosalie Bouchard AP2502-004` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the Admin portal open `/admin/dealer/1380/chubb-insurance`, write the creditor account number and every selected creditor form (label and value) into the log. If no option contains `960`, change nothing and stop: BLOCKED. Otherwise deselect every option, select only the first option whose label or value contains `960`, click **Save** | Reopening the page shows only the chosen 960 form selected; no error |
| 2 | [Pre-Condition] In the Dealer portal open `/vehicle/915/details` and click **"Create quote"** (opens `/quote/new/client?fromVehicleId=915`). Enter the client from Test Data, tick the policy-agreement checkbox (`isAgreePolicy`), click **"Save"**. Write the quote id into the log | The browser lands on `/quote/{id}/details`, whose heading starts with "#{id}", and the page shows a **"Send compliance documents"** link |
| 3 | Click **"Send compliance documents"**; check Client email is pre-filled `client.stage.2502004@yopmail.com`, type Client name `Rosalie Bouchard AP2502-004`, click **"Send"** | The browser returns to `/quote/{id}/details` with the alert "Compliance documents have been sent." and the "Compliance documents sent" section lists `Rosalie Bouchard AP2502-004` / `client.stage.2502004@yopmail.com` |
| 4 | In the Admin portal open `/admin/dealer/1380/chubb-insurance`, select exactly the creditor forms written at step 1 (and no others), click **Save** | Reopening the page shows exactly the step-1 selection and the same creditor account number |
| 5 | [Verification] Open `https://yopmail.com/en/?login=client.stage.2502004`, open the "Compliance documents" email (allow up to 2 minutes), download every PDF attachment and read its text | The GC960 French document (`PSF_GC960S(201907)`, "Plan de protection de paiement pour propriétaire d'équipement") and the GC960 English document (`PSE_GC960M(202601)`, "Equipment Owner Payment Protection Plan") are attached, and in each the product line — the page-1 value after "Nom du produit d'assurance :" / "Name of insurance product:", read as the Execution Context's product-line rule says, never a whole-document search — contains `GC960` and not `GC6201`; an empty product line is a FAIL. Record each product line verbatim with a page-1 screenshot (Q-002), file names and count (Q-004), and whether a GC6201 document (Execution Context exclusion rule) also arrived (Q-009). Step 4's restore held |

---

### AP2502_005 — Sending with no creditor form assigned records what is sent and does not crash

| Field | Value |
|---|---|
| **TC ID** | AP2502_005 |
| **Title** | Sending with no creditor form assigned records what is sent and does not crash |
| **Requirement** | REQ-001 / REQ-002 — negative path; Q-008 (Judgement — record-only) |
| **Route** | `/admin/dealer/1380/chubb-insurance` → `/quick-insurance-quote` → Yopmail |
| **Type** | Negative |
| **Priority** | Low |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-03, Dev (stlc-worker) |
| **Result** | FAIL — step 2 — send form HTTP 500 |

**Why this matters:** the family document is now chosen from the dealer's forms. A dealer with none must not hit an error page or lose the send silently; what it should receive is not stated (Q-008), so this case records it.

**Test Data:**

| Variable | Value |
|---|---|
| Creditor forms | None selected |
| Client name | `Benoît Lavoie AP2502-005` |
| Client email | `client.stage.2502005@yopmail.com` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] In the Admin portal open `/admin/dealer/1380/chubb-insurance`, write the creditor account number and every selected creditor form (label and value) into the log, deselect every creditor form (keep the account number), click **Save** | Record-only: either the page saves with no form selected, or it refuses with a message — write which, and the message. If it refuses, skip to step 4 (nothing was changed) |
| 2 | In the Dealer portal open `/quick-insurance-quote`. Record whether the **"Send compliance documents"** link is shown. If it is, click it, type Client name `Benoît Lavoie AP2502-005` and Client email `client.stage.2502005@yopmail.com`, click **"Send"** | No error page and no HTTP 5xx. Record the alert text shown after Send, or that the link is absent (Q-008) |
| 3 | Open `https://yopmail.com/en/?login=client.stage.2502005` and wait up to 2 minutes, refreshing | Record whether a "Compliance documents" email arrived, its attachment names and count, and what each fact-sheet document's product line says (Q-008) |
| 4 | In the Admin portal open `/admin/dealer/1380/chubb-insurance`, select exactly the creditor forms written at step 1 (and no others), click **Save** | Reopening the page shows exactly the step-1 selection and the same creditor account number |
| 5 | [Verification] Review the records from steps 1–4 for objective faults | No error page or HTTP 5xx occurred at steps 1–4; if step 2 showed "Compliance documents have been sent.", an email arrived at step 3; the dealer's creditor forms equal the step-1 selection. Record the outcome for Q-008 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 AC 1–3 — 960-form dealer gets the GC960 document, naming only GC960 | AP2502_001, AP2502_004 | AP2502_005 | AP2502_003 | — |
| REQ-002 AC 1–2 — GC6201-form dealer keeps the existing document, naming only GC6201 | — | AP2502_005 | AP2502_003 | AP2502_002 |
| REQ-003 AC 1–2 — both families give one document each | — | — | AP2502_003 | — |
| REQ-004 AC 1 — English GC960 document is the supplied English file | AP2502_001, AP2502_004 | — | AP2502_003 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2502_001 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_001-step2-SendModalStuckLoading_fail.png` |
| AP2502_002 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_002-step2-SendFormHttp500_fail.png` |
| AP2502_003 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_003-step2-SendModalStuckLoading_fail.png` |
| AP2502_004 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_004-step3-QuoteSendModalStuckLoading_fail.png` |
| AP2502_005 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2502/AP2502_005-step2-SendModalStuckLoading_fail.png` |

---

## Revisions

| Date | Change | By |
|---|---|---|
| 2026-11-03 | Created (5 cases) | stlc-worker (Wave 1) |
| 2026-11-03T04:23Z | Execution Context: product line defined as the page-1 value after "Nom du produit d'assurance :" / "Name of insurance product:" only — read as rendered (in the supplied French file the value is an overlay annotation; the content-stream text is empty), never a whole-document search (GC960 is also on page 2 and in every footer); empty product line = FAIL; reference values from both ticket files recorded (R2 round 1, F-1) | stlc-worker (R2 rework) |
| 2026-11-03T04:23Z | Execution Context: GC6201 row of the identification table and new exclusion rule — a GC6201 document has the fact-sheet heading **and** neither `PSF_GC960S(201907)` nor `PSE_GC960M(202601)` footer; a GC960 document in AP2502_002 is recorded for Q-009, never judged (R2 round 1, F-2) | stlc-worker (R2 rework) |
| 2026-11-03T04:23Z | Execution Context: Known blocker #2 extended to AP2502_003 (R2 round 1, F-3) | stlc-worker (R2 rework) |
| 2026-11-03T04:23Z | AP2502_001 step 5: product line pinned to the page-1 label (F-1); pre-filled-value fault narrowed to `AccountName` / `AccountAddress` naming a dealer other than 1380 (F-4); GC6201 document per the exclusion rule (F-2) | stlc-worker (R2 rework) |
| 2026-11-03T04:23Z | AP2502_002 step 4: attachments sorted by the exclusion rule, GC960 documents set aside (F-2). Step 5: only GC6201 documents judged, product line pinned to the page-1 label (F-1), GC960 document record-only for Q-009 (F-2) | stlc-worker (R2 rework) |
| 2026-11-03T04:23Z | AP2502_003 step 1: dealer-side Form drop-down read first; BLOCKED unless a value begins with `GC6201`; Route and Blocked-by updated (F-3). Step 5: documents sorted by the exclusion rule (F-2), product line pinned to the page-1 label (F-1) | stlc-worker (R2 rework) |
| 2026-11-03T04:23Z | AP2502_004 step 5: product line pinned to the page-1 label, empty = FAIL (F-1); GC6201 document per the exclusion rule (F-2) | stlc-worker (R2 rework) |
| 2026-11-03T05:00Z | Executed on Dev: all 5 FAIL — `GET /compliance-documents/send` returns HTTP 500 at the send step; Status, Result and Execution Log updated (no case wording changed) | stlc-worker (s4) |

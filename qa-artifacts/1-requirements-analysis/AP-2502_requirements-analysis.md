# Requirements Analysis Report

**Project:** Avantage Plus v2 — AP-2502 "separate compliance document PDF for GC960 and 6201"
**Date:** 2026-11-03
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** requirements/AP-2502-separate-compliance-document-pdf-for-gc960.md (Jira description, Given/When/Then acceptance criteria, 1 comment, 2 attachments read); domain knowledge: qa-artifacts/qa-docs/compliance-documents.md, qa-artifacts/qa-docs/chubb-insurance.md
**Total requirements found:** 4

related_docs: qa-artifacts/qa-docs/compliance-documents.md, qa-artifacts/qa-docs/chubb-insurance.md

---

## Executive Summary

AP-2502 changes what the dealer's client receives when the dealer clicks **Send
compliance documents** (the AP-2436 email that carries the Quebec insurance disclosure
documents). Chubb sells creditor insurance under two product families, GC960 and GC6201,
and each family has its own version of the "Parlons assurance! / Let's Talk Insurance!"
fact sheet and product summary. The story asks for a separate, filled document per product
family: a dealer assigned to a "960 form" gets the new GC960 document (the French and
English PDFs attached to the ticket), a dealer assigned to a GC6201 form keeps the existing
`parlons-assurance-(EN/FR).pdf`, and each document's product line may mention only its own
family.

Four requirements were extracted. The main outcomes are stated in the ticket, so none of
the nine open questions blocks testing: seven are **Judgement** questions (the tests record
what the build does on that point instead of guessing) and two are **Info**. The largest
practical risk is test data, not wording: the test cases must change dealer 1380's Chubb
creditor-form assignment on Dev and restore it, and nobody has yet seen a "960 form" in
the Dev admin list. If none exists there, the GC960 cases will be BLOCKED for missing test
data. Overall testability is rated **Medium** — clear outcomes, but the PDF content must be
read from email attachments, and the trigger (which forms count as "960 forms") is named
only loosely.

**Terms used below.** *Compliance documents* — the email the dealer sends to the client
from the **Send compliance documents** button (AP-2436). *Creditor form* — a Chubb
creditor-insurance form code assigned to the dealer in the Admin portal's Chubb Insurance
Configuration (`/admin/dealer/{id}/chubb-insurance`); on the dealer side the codes appear
as values such as `GC6201MQ:PM30`. *Product line text* — the line of the fact sheet that
names the insurance product offered.

---

## Requirements Detail

### REQ-001 — A dealer assigned to a 960 form sends a separately filled GC960 document

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor whose dealership is assigned a GC960 creditor form, I want the compliance documents I send to carry the GC960 version of the disclosure document so that my client receives the fact sheet and summary that match the product actually sold. *(Inferred — the ticket has no user story.)* |
| **Priority** | High — this is the change the ticket exists for; a client receiving the wrong product summary is a regulatory disclosure failure for the dealer. |
| **Source File** | AP-2502-separate-compliance-document-pdf-for-gc960.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression |

**Acceptance Criteria:**

1. Given the dealer user is sending compliance documents and the dealer is assigned to one of the 960 forms, when the compliance documents are sent, then a separate document is filled for the GC960 product family (AC lines 1–4).
2. "For `GC960`, only mention `GC960` in the product line text" — the GC960 document's product line names GC960 and no other family (AC line 5).
3. The GC960 document is built from the two files embedded in the acceptance criteria: `GC960S_AMFFS_F_DC2020.pdf` (French; summary footer `PSF_GC960S(201907)`) and `Let's Talk Insurance and Summary Plan GC960, Anglais.pdf` (English; summary footer `PSE_GC960M(202601)`).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "One of the 960 forms" is not tied to a form code. The admin list seen on Staging (2026-10-02) held `PM30`, `PM50`, `S30`, `S45`, `M25`, `M30`, `GAP`, and only `GC6201MQ:…` values have been seen on the dealer side. Nobody has seen a code containing "960" yet (Q-001). | High | The test cases select only a form whose label or value contains "960" and go BLOCKED for missing test data when none exists — never guess that `S30` or `M30` is a 960 form. |
| The document's content can only be checked by opening the PDF attachments of the email; the product line is page text, not a form field. | Medium | Download each attachment from the Yopmail inbox and read its text; compare the summary footer and title with the attached source files. |
| No error or empty-state path is described (a dealer with no creditor form). | Low | Q-008 — a record-only negative case. |

---

### REQ-002 — A dealer assigned to a GC6201 form keeps the existing parlons-assurance document

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor whose dealership is assigned a GC6201 creditor form, I want my client to keep receiving the existing GC6201 document, mentioning only GC6201, so that the new GC960 version does not leak into GC6201 sales. *(Inferred.)* |
| **Priority** | High — this is today's behaviour for dealer 1380, and breaking it would send every existing GC6201 client a wrong or missing disclosure. |
| **Source File** | AP-2502-separate-compliance-document-pdf-for-gc960.md |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. Given the dealer is assigned to one of the GC6201 forms, when the compliance documents are sent, then a separate document is filled for the GC6201 product family (AC lines 1–4).
2. "For `GC6201`, only mention `GC6201` the product line text, use existing parlons-assurance-(EN/FR).pdf" — the GC6201 document is the existing French and English `parlons-assurance` file, and its product line names GC6201 and no other family (AC line 7).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The existing GC6201 document's product line text was never recorded (on Staging, 2026-08-29, it was noted as "in the compressed page content … still needs a person"). | Medium | Read the text of both language variants and record the product line in full (Q-002). |

---

### REQ-003 — A dealer assigned to both families receives one document per family

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor whose dealership is assigned both a GC960 form and a GC6201 form, I want a separate document for each product family so that each summary names only its own product. *(Inferred.)* |
| **Priority** | Medium — the AC wording "a separate document is filled for each product families" covers this, but a dealer assigned both families is a less common configuration than one family. |
| **Source File** | AP-2502-separate-compliance-document-pdf-for-gc960.md |
| **Recommended Test Types** | Functional · Edge-case (decision table) |

**Acceptance Criteria:**

1. "a separate document is filled for each product families" — with forms of both families assigned, the send carries a GC960 document and a GC6201 document, not one merged document (AC line 4).
2. Each of the two documents mentions only its own family in the product line (AC lines 5 and 7).

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The file names, the number of attachments and their order when both families apply are not stated (Q-004). | Low | Record them; identify each document by its content (summary footer and title), not by its file name. |

---

### REQ-004 — The English GC960 document is the English file supplied in the ticket

| Field | Value |
|---|---|
| **User Story** | As an English-speaking client of a GC960 dealer, I want to receive the English GC960 fact sheet and summary, not a copy of the French one. *(Inferred.)* |
| **Priority** | Medium — the comment replaced a temporary "duplicate the French version" instruction; a build that still ships the French file under the English name would mislead English clients. |
| **Source File** | AP-2502-separate-compliance-document-pdf-for-gc960.md (comment by Ken Nguyen, 2026-10-28) |
| **Recommended Test Types** | Functional · Regression |

**Acceptance Criteria:**

1. Ken Nguyen's comment strikes through "please duplicate the french version for english, and we will replace it when we get the english version" and adds "EDIT: English version provided in the ticket." — the English GC960 document is `Let's Talk Insurance and Summary Plan GC960, Anglais.pdf` ("LET'S TALK INSURANCE!", "Equipment Owner Payment Protection Plan", footer `PSE_GC960M(202601)`), and it is not a duplicate of the French file.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The English source file has no fillable form fields while the French one has `CertificateNo` and `AccountName`, so the two languages may be "filled" differently (Q-003). | Medium | Record which values appear in each language; do not assert pre-filled values. |

---

## Data entities touched

| Entity | How the feature uses it |
|---|---|
| Dealer Chubb Insurance Configuration — the creditor forms assigned to the dealer (`/admin/dealer/{id}/chubb-insurance`, `creditorForm[]`; table `dealer_chubb_insurance`) | Read by the send to decide which family document(s) to attach; the tests change it and restore it |
| Compliance-documents send form (`compliance_document_send[clientName]`, `[clientEmail]`) on `/quick-insurance-quote` and `/quote/{id}/details` | Starts the send |
| The compliance email and its PDF attachments (GC960 FR/EN, `parlons-assurance-fr/en.pdf`, waiver forms) | The output under test |
| PDF templates — the two GC960 files attached to the ticket and the existing `parlons-assurance` files | Source of each document's content |
| Insurance compliance log (`/insurance-compliance-log`) and the quote's "Compliance documents sent" section | Gain one row per send |
| Client inbox (`client.stage.NNN@yopmail.com`) | Receives the email |
| A quote with a client e-mail (only for a send from Quote Details) | Context of the send |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — GC960 dealer gets the GC960 document | ✓ | ✓ | ✓ | | | | | |
| REQ-002 — GC6201 dealer keeps the existing document | ✓ | | | ✓ | | | | |
| REQ-003 — both families give one document each | ✓ | | ✓ | | | | | |
| REQ-004 — English GC960 document is the supplied English file | ✓ | | | ✓ | | | | |

**Legend:** ✓ = recommended based on requirement content

---

## Open Questions

Points the requirement leaves unsettled. **Impact** says what each one does to testing:
*Blocking* — an acceptance criterion cannot be judged until it is answered, so its test
cases stay BLOCKED and the story cannot be released; *Judgement* — the main result is
testable, and the test records what the build does on this point instead of guessing;
*Info* — no test result depends on it. Classification test: SKILL.md Step 3b.

| # | Question | Raised against | Impact | Status | Answer (quoted, with source) | Assigned to |
|---|---|---|---|---|---|---|
| Q-001 | Which Chubb creditor forms are "the 960 forms"? The admin list seen on Staging held `PM30`, `PM50`, `S30`, `S45`, `M25`, `M30` and `GAP`, and the dealer side shows only `GC6201MQ:PM30` / `GC6201MQ:PM50`. Is there a form whose code or label names GC960, or do some of the existing codes (for example `S…` or `M…`) belong to GC960? | REQ-001, REQ-003, REQ-004 | Judgement — the expected result ("a GC960 document is sent") is written in the ticket; only the setup is unclear. The tests use a form only when its label or value contains "960" and go BLOCKED for missing test data otherwise, so no result rests on a guess. | Open | — | Ken Nguyen |
| Q-002 | What exactly is "the product line text", and what should it read — "GC960", "GC960S"/"GC960M", or the product name ("Equipment Owner Payment Protection Plan")? | REQ-001, REQ-002, REQ-003 | Judgement — the ticket says which family may be mentioned; the full wording is recorded, not asserted. | Open | — | Ken Nguyen |
| Q-003 | What does "filled" mean for each document — which fields are pre-filled, with which values? The French GC960 file has the fields `CertificateNo` and `AccountName`; the English GC960 file has no form fields; the existing GC6201 file was filled with `AccountName`, `AccountAddress` and `InsurerName` on Staging. | REQ-001, REQ-004 | Judgement — record which values appear in each language. | Open | — | Ken Nguyen |
| Q-004 | What are the attachment file names for the GC960 document, and how many attachments should a send carry when the dealer has both families? | REQ-001, REQ-003 | Judgement — record names and count; identify documents by content. | Open | — | Ken Nguyen |
| Q-005 | The French GC960 summary is version `PSF_GC960S(201907)` (distributor Unité Assureurs-Gestionnaires Limitée) and the English one is `PSE_GC960M(202601)` (claims agent Pitcher & Doyle Inc.). Are these two different products ("S" and "M") on purpose, or is a newer French file to come? | REQ-001, REQ-004 | Info — the tests check that the build sends exactly the files supplied in the ticket; this question does not change that result. | Open | — | Ken Nguyen |
| Q-006 | Does the change also apply elsewhere compliance documents appear, such as the Chubb contract PDF packet that merges the "Let's Talk Insurance!" sheet (AP-2437)? | REQ-001 | Info — the acceptance criteria cover only "when the compliance documents are sent". | Open | — | Ken Nguyen |
| Q-007 | For a dealer assigned only a 960 form, which waiver forms (30 % / 50 %) should the email carry? The AP-2436 rule names PM50 → 50 % form and PM30, S30, M30 → 30 % form. | REQ-001 | Judgement — record which waiver forms arrive. | Open | — | Ken Nguyen |
| Q-008 | What should be sent when the dealer is assigned no Chubb creditor form at all? | REQ-001, REQ-002 | Judgement — a record-only negative case; only an error page or a lost send is a fault. | Open | — | Ken Nguyen |
| Q-009 | "a separate document is filled for each product families" — when the dealer is assigned forms of only one family, does the send carry only that family's document, or a document for both families every time? | REQ-001, REQ-002 | Judgement — the document of the assigned family is required under either reading and is asserted; whether the other family's document also arrives is recorded, not judged. | Open | — | Ken Nguyen |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-001 | "960 forms" is not tied to a form code, and no 960 form has been seen on any environment yet (Q-001) — if Dev has none, the GC960 cases cannot run | High | Open |
| REQ-001, REQ-002, REQ-003 | The product line text is checked by reading PDF attachments from an email; its exact wording is unstated (Q-002) | Medium | Open |
| REQ-004 | The two GC960 source files differ in form fields and product version (Q-003, Q-005) | Medium | Open |
| REQ-003 | Attachment naming and count with both families unstated (Q-004) | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [ ] Ready to proceed to Test Plan Design

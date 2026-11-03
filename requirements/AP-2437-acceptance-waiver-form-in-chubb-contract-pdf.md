# AP-2437 — Attach the acceptance/waiver form to the Chubb insurance contract PDF

**Spec ID:** AP-2437
**Source:** Jira story [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Author:** Ken Nguyen · **Assignee (QC):** Vinh Le - QC
**Created:** 2026-08-10 · **Last updated:** 2026-08-26
**Captured on:** 2026-09-03 from the Jira description, the Given/When/Then acceptance-criteria field, the 5 attachments and all 13 ticket comments.
**Delivery state at capture:** 3 pull requests **MERGED**; deployment environment **Staging — DEPLOYED** on 2026-08-26.

> This file is a faithful transcription of AP-2437 for the STLC pipeline. The Jira
> description is written in French; the acceptance criteria are an English decision
> table whose four branches each point at one attached PDF. Both are reproduced, and the
> technical decisions taken in the ticket comments are folded in as numbered acceptance
> criteria so nothing is lost.

---

## Feature 1 — Automatic insertion of the acceptance/waiver form (Phase 2)

### User story

As a **dealer F&I advisor**, I want the acceptance-or-waiver form for credit insurance to
be inserted automatically into the Chubb insurance contract PDF I print, so that the
client signs the legally required remuneration-disclosure page as part of the same
document set, without me having to find, choose and attach the right version by hand.

### Original requirement text (Jira description, French)

**Phase 2 – Finalisation du contrat**

Lorsqu'une prime d'assurance est vendue et que le contrat est imprimé, le système doit
automatiquement inclure le document de divulgation de rémunération dans les documents à
faire signer par le client.

Ce document devra confirmer que le client :

- a reçu le **Sommaire des protections** ;
- a reçu le document **Parlons assurances** ;
- a été informé du **pourcentage de rémunération** applicable au concessionnaire ;
- reconnaît avoir reçu ces informations avant la conclusion de la vente.

**Conservation des documents**

- Le document signé devra être numérisé et transmis à Avantage+ avec le reste du dossier.
- Une copie devra également demeurer accessible au concessionnaire pour fins de
  conformité et d'audit.
- Il reste à confirmer avec **@lindquist1305** la méthode de conservation, d'archivage et
  de consultation de ces documents du côté d'Avantage+.

### Acceptance criteria (Jira Given/When/Then field, verbatim structure)

**Given** the dealer user is logged in the dealer area

**When** a Chubb insurance contract is created —
*attach on the **first page** of the insurance contract PDF the acceptance form*

| Branch | Condition | Form to attach |
|---|---|---|
| 1 | insurance table rate contains **“50”** AND `quote_financing_insurance_chubb.language = "F"` | *(the branch body is empty in Jira — inferred from the attachments as* `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %).pdf` *)* |
| 2 | Else IF rate contains **“50”** AND `quote_financing_insurance_chubb.language = "E"` | *(inferred:* `Acceptance or Waiver Form — Credit Insurance (50 %).pdf` *)* |
| 3 | Else IF `quote_financing_insurance_chubb.language = "F"` | *(inferred:* `Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf` — the 30 % French form *)* |
| 4 | Else | *(inferred:* `Acceptance or Waiver Form — Credit Insurance (30 %).pdf` *)* |

> ⚠️ **The four branch bodies are empty in the Jira field.** Only the conditions were
> written; the form each branch selects is *not stated in words anywhere in the ticket*.
> The mapping above is inferred from the four attached PDFs, whose names align one-to-one
> with the four branches. **This inference must be confirmed by the developer or the
> product owner before any test result derived from it is treated as authoritative.**

### Attachments on the ticket

| # | Filename | Presumed branch |
|---|---|---|
| 1 | `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %).pdf` | 1 — FR, 50 % |
| 2 | `Acceptance or Waiver Form — Credit Insurance (50 %).pdf` | 2 — EN, 50 % |
| 3 | `Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf` | 3 — FR, 30 % |
| 4 | `Acceptance or Waiver Form — Credit Insurance (30 %).pdf` | 4 — EN, 30 % |
| 5 | `image-20260820-135433.png` | Screenshot of the Zend_Pdf exception, posted by Minh Lưu |

### Numbered acceptance criteria

| # | Criterion | Source |
|---|---|---|
| AC-1 | When a Chubb insurance contract is created and printed/downloaded, the acceptance-or-waiver form is included automatically in the contract PDF — the advisor performs no extra action. | Description + AC field |
| AC-2 | The acceptance form is placed on the **first page** of the insurance contract PDF. | AC field |
| AC-3 | The form variant is selected by a two-factor decision: the **insurance table rate containing “50”** and `quote_financing_insurance_chubb.language` (`F` / `E`). Four combinations, four forms. | AC field |
| AC-4 | The rate rule is a *contains “50”* test, not an equality test — any rate whose text carries “50” takes the 50 % form; every other rate falls through to the 30 % form. | AC field, branch 3 and 4 wording |
| AC-5 | The form confirms the client received the **Sommaire des protections**. | Description |
| AC-6 | The form confirms the client received **Parlons assurances**. | Description |
| AC-7 | The form states the **remuneration percentage** applicable to the dealership. | Description |
| AC-8 | The form carries the client's acknowledgement that this information was received **before the sale concluded**. | Description |
| AC-9 | The merged contract PDF must open correctly and remain a valid, readable, printable PDF — no corruption of the Chubb-supplied pages or the client data on them. | Comments, Minh Lưu 2026-08-20 / 2026-08-26 |
| AC-10 | The merge must happen **in code, at download time, per contract** — the Chubb PDF is fetched live from Chubb's API for every contract and carries unique client data. No manual, pre-saved or cached file. | Comment, Minh Lưu 2026-08-26 |
| AC-11 | *(Deferred)* The signed document is scanned and transmitted to Avantage+ with the rest of the file. | Description — retention |
| AC-12 | *(Deferred)* A copy remains accessible to the dealership for compliance and audit. | Description — retention |

### Technical decisions taken in the comments

| Date | Decision |
|---|---|
| 2026-08-19 | Ken reports `PDF file syntax error. Offset - 0x2F862C. Wrong W dictionary entry.` on contract generation. |
| 2026-08-20 | Test configuration supplied: `INSURANCE_API_URL='https://creditor-insurance-dev.ken-d1b.workers.dev'`, `INSURANCE_API_TOKEN='JDpLcMDNtfyz'`, and creditor account number **`AP0001`** in the dealer Chubb configuration. |
| 2026-08-20 | Root cause (Minh Lưu): the PDF returned by Chubb's live `/contract` endpoint is **PDF 1.7** using (a) a **compressed cross-reference stream** — unsupported by `Zend_Pdf` (abandoned Zend Framework 1), which throws a hard exception; and (b) **encryption with an empty user password** (viewable freely, print/edit permissions restricted) — a second, separate problem. |
| 2026-08-20 | Proposed fix: add **`setasign/fpdi`** as the merge engine for this operation, replacing `Zend_Pdf`; pre-process each Chubb PDF with **`qpdf --decrypt`**, which strips the encryption and self-repairs the malformed xref stream in one pass. Introduces one **system-level dependency: the `qpdf` binary** must be installed on every server that runs this code. |
| 2026-08-24 | Alternative "write our own PDF decryption" rejected as too risky — hand-rolled crypto on legally binding contracts could silently produce a corrupted contract with no error shown. |
| 2026-08-26 | Alternative "re-save in Acrobat as an older version" rejected — the PDF is fetched live per contract with unique client data; there is no static file to re-save. |
| 2026-08-26 | **Ken approves the FPDI + qpdf approach.** |
| 2026-08-26 | Open question left unanswered in the thread: *"if qpdf handles the malformed xref stream, can we keep Zend_Pdf and avoid the `setasign/fpdi` dependency?"* — Ken asked this **after** approving; no reply is recorded. The delivered implementation therefore may use either engine. |

### Open questions carried into the pipeline

| # | Question | Blocks |
|---|---|---|
| Q-1 | Which of the four attached PDFs does each decision branch actually select? The Jira branch bodies are empty. | AC-3, every branch-mapping test |
| Q-2 | Where does the "insurance table rate" come from and what are its possible values? "Contains 50" implies a text field, not a number. | AC-3, AC-4 |
| Q-3 | What sets `quote_financing_insurance_chubb.language`, and is it reachable from the dealer UI (portal language setting? client language? Chubb form language?) | AC-3 |
| Q-4 | What is the **dealer remuneration percentage** on the form — a fixed value baked into the PDF, or a value merged in per dealership? If merged, where is it configured? | AC-7 |
| Q-5 | Is `qpdf` installed on **v2staging**, and is it in the production provisioning? A missing binary is invisible until a contract is downloaded. | AC-9, AC-10 |
| Q-6 | Which merge engine shipped — `setasign/fpdi`, or `Zend_Pdf` with a qpdf pre-pass (Ken's unanswered 2026-08-26 question)? | AC-9 |
| Q-7 | Retention/archival/consultation method on the Avantage+ side — explicitly *"reste à confirmer"* with @lindquist1305. | AC-11, AC-12 — **not testable** |
| Q-8 | Is the form appended once per contract, or once per insurance product when a contract carries several? | AC-1, AC-2 |

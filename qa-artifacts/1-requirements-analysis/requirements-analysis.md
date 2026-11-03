# Requirements Analysis Report

**Project:** Avantage Plus (AP) — Dealer Portal, release 5.1.0
**Date:** 2026-08-28
**Analyst:** QA Agent — Requirements Analyst Skill
**Source files:** `requirements/AP-2436-dealer-compliance-documents.md` (transcribed from Jira story [AP-2436](https://garantieavantageplus.atlassian.net/browse/AP-2436), including its Given/When/Then acceptance-criteria field and all five ticket comments)
**Total requirements found:** 7

---

## Executive Summary

One feature area was analysed from one requirement file: the new **Send compliance
documents** flow in the dealer portal, which lets a Quebec F&I advisor email the legally
required insurance disclosure documents to a client straight from the Insurance Quick
Quote or Quote Details page. Seven requirements were extracted from the story's fourteen
acceptance criteria. Fourteen testability risks were flagged, eight of them High.

Overall testability is rated **Medium** — the visible part of the feature (the button, the
modal form, the email and its attachments) is described precisely enough to test today,
and QC has already confirmed on 2026-08-23 that an email with attachments does arrive.
What is not testable as written is everything around the edges: the story never says what
the dealer sees after pressing **Send**, never says what happens when the dealer has no
Chubb insurance configuration at all, and describes the send register and the
quick-download access in a single sentence each without naming a screen, so we cannot
prove those two acceptance criteria true or false until the product team says where they
live. The business exposure is that AP-2436 covers documents Quebec law requires a dealer
to give a client, so an unverified register or a silently failed send means the dealer
believes a legal obligation was met when there is no evidence it was.

Two clarifications the product owner already gave in the ticket comments are folded into
the criteria and must be treated as requirements, not commentary: attachment **file names
do not matter as long as the contents are correct**, and a dealer assigned to only one
creditor-form group (50 % or 30 %, not both) must receive **only that one** waiver form.
The product owner asked for that second case to be tested explicitly.

---

## Requirements Detail

### REQ-001 — Entry point: "Send compliance documents" button for Quebec dealers

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor in Quebec, I want a **Send compliance documents** button on the quote pages so that I can start the send without leaving the quote I am working on. |
| **Priority** | High — nothing else in the story can be reached without this button, so it blocks every other requirement. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · Negative · UI · Regression |

**Acceptance Criteria:**

1. When a logged-in dealer user from the Quebec province opens the **Insurance Quick Quote** page, the navigation component shows a button labelled **Send compliance documents**.
2. The same button appears on the **Quote Details** page under the same conditions.
3. The French label is **Envoyer les documents de comformité**, and the button uses the *Dark button* style.

**Out of Scope:**

- Dealers outside the Quebec province. The story's Given clause limits the feature to Quebec, and says nothing about what other provinces should see.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story says the button appears for a Quebec dealer but never says what a non-Quebec dealer sees, so we cannot tell a correct build from a broken one when the province is anything else. | High | Ask the product owner to state whether the button is hidden, disabled, or shown for non-Quebec dealers, then test that stated behaviour. Until then the negative case can only be recorded as observed behaviour, not as a pass or a fail. |
| The French label in the story reads "comformité", which is a spelling mistake for "conformité". Testing the label exactly as written would lock the typo into the product. | Low | Confirm with the product owner which spelling is intended before the label is checked character by character. |

---

### REQ-002 — The "Send compliance documents" modal form

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor, I want a short form asking only for my client's name and email address so that sending the documents takes one step and no file handling. |
| **Priority** | High — this form is the only way to supply the recipient, so the feature cannot be used if it is wrong. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · UI · API |

**Acceptance Criteria:**

1. Clicking **Send compliance documents** opens a modal form — a small window layered over the page that blocks the page behind it until it is closed.
2. The form contains exactly three controls: a **Client Name** text field, a **Client Email** text field, and a **Send** button.
3. In French the three controls read **Nom du client**, **Adresse courriel** and **Envoyer**.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No validation rules are given for either field. The story does not say whether **Client Name** and **Client Email** are required, what a valid email address looks like to this form, or how long a name may be, so we cannot prove the form rejects bad input correctly. | High | Ask the product owner to confirm that both fields are required and that **Client Email** must be a well-formed address, and to state the maximum length of **Client Name**. Test cases for empty and malformed input will be written against the answer. |
| No error path is described. The story never says what message the dealer sees when a field is empty or an address is malformed. | High | Ask for the exact error text in English and French, or agree that any visible, blocking error message counts as a pass for this release. |

---

### REQ-003 — Email delivery and email body

| Field | Value |
|---|---|
| **User Story** | As a client of the dealer, I want to receive one email containing my insurance conformity documents so that I have the disclosures the dealer is required to give me. |
| **Priority** | High — this is the outcome the whole story exists to produce. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · API |

**Acceptance Criteria:**

1. Submitting the form sends an email to the address typed in **Client Email**.
2. The email body reads `Dear {Client name},` followed by `Please find attached our updated insurance conformity documents.`, with the value typed in **Client Name** substituted into the greeting.
3. The documents attached are the conformity documents selected from the dealer's Chubb Insurance Configuration, held in the `dealer_chubb_insurance` database table.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story never says what the dealer sees on screen after pressing **Send**. Without a stated success or failure message, a send that silently fails looks exactly like a send that worked, and the dealer would tell the client the documents are on their way when they are not. | High | Ask the product owner for the confirmation and failure messages. Until then, treat the arrival of the email in the test inbox as the only proof of success and say so in the test report. |
| The sender address, the subject line and the email language are not specified, so we cannot check them. The body text is given in English only, with no French version, even though the rest of the feature is bilingual. | Medium | Ask whether the subject and body are translated for a French client, and what the from-address should be. If they are not translated in 5.1.0, record that as accepted behaviour so a later French complaint is not treated as a new bug. |
| No delivery-time expectation is given. "An email is sent" is not something a test can time out against. | Low | Agree a practical limit for test purposes — for example the email must arrive within two minutes — and record it as a test assumption rather than a requirement. |

---

### REQ-004 — Conditional waiver-form attachment based on the Chubb creditor form codes

| Field | Value |
|---|---|
| **User Story** | As Avantage Plus, I want each client to receive only the waiver form that matches the dealer's Chubb creditor configuration so that the client is not given a disclosure that does not apply to their contract. |
| **Priority** | High — this is the only conditional logic in the story, it is where the product owner asked for extra testing, and it is the part QC already raised a question about. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · Negative · Edge-case · Regression |

**Acceptance Criteria:**

1. If the dealer's Chubb creditor form configuration contains **PM50**, the email includes the **50 % waiver form** (*Acceptance or Waiver Form — Credit Insurance (50 %)*).
2. If the configuration contains **PM30**, **S30** or **M30**, the email includes the **30 % waiver form** (*Acceptance or Waiver Form — Credit Insurance (30 %)*).
3. If the dealer is assigned to both groups, the email includes **both** waiver forms. The product owner confirmed this on 2026-08-26 in answer to QC's Issue #2.
4. If the dealer is assigned to only one type — 50 % or 30 %, not both — the email includes **only** that one waiver form. The product owner called this out on 2026-08-26 as a case that must be tested.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story gives no rule for a dealer with no Chubb insurance configuration at all. QC hit exactly this case on 2026-08-23 and received both waiver forms; the product owner's reply explained that particular dealer was assigned to both groups, which leaves the truly empty configuration still undefined. If the answer is meant to be "send nothing", the current build may be emailing clients disclosures for products the dealer does not sell. | High | Ask the product owner what a dealer with an empty Chubb configuration should receive — no waiver form, an error, or a blocked button — and add the answer as an acceptance criterion before this case is signed off. |
| Testing all four combinations needs a dealer's Chubb configuration to be changed between runs, which is done on the **Dealer Details** page in the admin area. That page could not be opened on 2026-08-23; the product owner says it is now fixed but it has not been retested. | High | Retest access to the **Dealer Details** page first. Every waiver-form case depends on it, so if it is still broken these four criteria are Blocked, not Failed. |

---

### REQ-005 — Pre-filled Talk Insurance, protection summary and remuneration disclosure documents

| Field | Value |
|---|---|
| **User Story** | As a client, I want the documents I receive to already show my dealer's name and the products that dealer actually offers so that the paperwork matches the dealership I am buying from. |
| **Priority** | High — a document pre-filled with the wrong dealer or the wrong product list is a compliance document that says something untrue. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · Edge-case |

**Acceptance Criteria:**

1. The email attaches the *Parlons assurances / Talk Insurance* PDF together with the protection summary (*Sommaire des protections*).
2. The dealer's company name is filled into the `Nom du distributeur` section of that PDF.
3. That PDF lists the products available to the dealer according to the Chubb configuration in the `dealer_chubb_insurance` table.
4. The email also includes the commission-percentage disclosure (*Divulgation du pourcentage de rémunération*).
5. Attachment file names do not have to match the wording used in the requirement; only the contents must be correct. The product owner confirmed this on 2026-08-26 in answer to QC's Issue #1.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| The story does not say which language variant is sent. The ticket carries both an English and a French *Parlons assurances + Sommaire* PDF, but no rule connects the choice to the dealer's language, the portal language, or the client. We cannot judge whether the language we receive is correct. | High | Ask the product owner what decides the document language. Because the whole feature is limited to Quebec, the answer may simply be "always French", and that would make the criterion testable in one sentence. |
| "Lists the available products" does not say in what form — a bulleted list, a table, a set of ticked checkboxes — nor whether an unassigned product must be visibly absent or simply left unticked. Two builds could both satisfy the sentence and look completely different. | Medium | Ask for one filled example PDF to compare against. The four waiver forms and two Talk Insurance PDFs already attached to AP-2436 are the reference set for contents; a filled example would extend that to the product list. |
| The story mentions the remuneration disclosure only in the French description and never again in the acceptance criteria, so it is easy for it to be missed in the build and in testing alike. | Medium | Confirm the remuneration disclosure is in scope for Phase 1 and, if so, which of the ticket's attachments is the reference copy. |

---

### REQ-006 — Timestamped send register, readable by Avantage+ and by the dealer

| Field | Value |
|---|---|
| **User Story** | As Avantage Plus, I want a dated record of every compliance-document send so that we can show a client was given their disclosures if it is ever questioned. |
| **Priority** | High — this is the evidence half of a legal obligation. Sending the documents without recording the send leaves nothing to point at later. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · Regression · UI |

**Acceptance Criteria:**

1. Every send is recorded with its date and time.
2. The system keeps a register of all sends.
3. The register can be read both by Avantage Plus staff and by the dealer.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| No screen is named for the register on either side, and no columns are listed. We do not know where to look, so we cannot confirm the register exists, let alone that the dealer and Avantage Plus both see the right rows. As written this requirement cannot be tested at all. | High | Ask the product owner to name the page on the dealer side and on the Avantage Plus side and to list the columns the register must show. Until that answer arrives, this requirement is Blocked rather than Failed. |
| Nothing says whether a send that failed is recorded, or only a send that succeeded. A register that lists only successes cannot be used to investigate a client who says nothing arrived. | Medium | Ask whether failed sends appear in the register and how they are marked. |

---

### REQ-007 — Quick access to download the pre-filled disclosure PDFs

| Field | Value |
|---|---|
| **User Story** | As a dealer F&I advisor, I want to download the pre-filled disclosure PDFs directly so that I can hand or print them for a client who is sitting in front of me. |
| **Priority** | Medium — it is a convenience alongside the email, and the story states it in a single line with no detail, which suggests it is the smallest part of Phase 1. |
| **Source File** | AP-2436-dealer-compliance-documents.md |
| **Recommended Test Types** | Functional · UI |

**Acceptance Criteria:**

1. The dealer has a quick-access way to download the pre-filled PDF versions of the disclosure documents, without sending an email.

**Out of Scope:**

- None stated.

**⚠ Testability Risks:**

| Risk | Severity | Recommendation |
|---|:---:|---|
| "Quick access" names no control and no page, and the acceptance-criteria field does not mention this requirement at all — it appears only in the French description. We cannot test a control we cannot find, and there is a real chance it was never built. | High | Ask the product owner where this download lives and which documents it covers. If it was deferred out of Phase 1, say so on the ticket so it is not reported as a missing feature. |

---

## Test Coverage Recommendations

_The kinds of testing each requirement needs. Functional checks the feature does its
job; negative checks it handles bad input safely; edge-case checks the extremes;
regression checks we did not break something that used to work._

| Requirement | Functional | Negative | Edge-case | Regression | UI | API | Accessibility | Performance |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| REQ-001 — Entry-point button | ✓ | ✓ | | ✓ | ✓ | | | |
| REQ-002 — Modal form | ✓ | ✓ | ✓ | | ✓ | ✓ | | |
| REQ-003 — Email delivery and body | ✓ | ✓ | ✓ | | | ✓ | | |
| REQ-004 — Conditional waiver forms | ✓ | ✓ | ✓ | ✓ | | | | |
| REQ-005 — Pre-filled PDF contents | ✓ | | ✓ | | | | | |
| REQ-006 — Send register | ✓ | | | ✓ | ✓ | | | |
| REQ-007 — Quick download | ✓ | | | | ✓ | | | |

**Legend:** ✓ = recommended based on requirement content

Accessibility and performance are not recommended for any requirement in this story. The
requirement file sets no keyboard, screen-reader or timing expectation, so a test in
either column would be measuring a standard nobody has agreed to.

---

## Open Questions

Questions that must be answered by the product team before test case design begins:

| # | Question | Raised against | Assigned to | Due |
|---|---|---|---|---|
| Q-001 | What does a dealer who is **not** from Quebec see on the Insurance Quick Quote and Quote Details pages — is the **Send compliance documents** button hidden, disabled, or shown? | REQ-001 | Ken Nguyen | 2026-09-02 |
| Q-002 | Are **Client Name** and **Client Email** both required, what counts as a valid email address, and what error message should the dealer see for empty or malformed input? | REQ-002 | Ken Nguyen | 2026-09-02 |
| Q-003 | What does the dealer see on screen after pressing **Send** — a success confirmation, and a distinct failure message if the email cannot be sent? | REQ-003 | Ken Nguyen | 2026-09-02 |
| Q-004 | What should a dealer with **no Chubb insurance configuration at all** receive: no waiver form, an error, or a blocked button? | REQ-004 | Ken Nguyen | 2026-09-02 |
| Q-005 | What decides the language of the attached documents — the dealer's language, the portal language, or is it always French because the feature is Quebec-only? | REQ-005 | Ken Nguyen | 2026-09-02 |
| Q-006 | Which page shows the send register on the dealer side, which page shows it on the Avantage Plus side, and which columns must it show? Are failed sends recorded too? | REQ-006 | Ken Nguyen | 2026-09-02 |
| Q-007 | Where is the quick-access download for the pre-filled disclosure PDFs, and which documents does it cover — or was it deferred out of Phase 1? | REQ-007 | Ken Nguyen | 2026-09-02 |
| Q-008 | Is the French button label meant to read "conformité" rather than the "comformité" spelling used in the ticket? | REQ-001 | Ken Nguyen | 2026-09-02 |
| Q-009 | Is the **Dealer Details** page in the admin area now open, so a dealer's Chubb configuration can be changed between test runs? The fix was reported on 2026-08-26 and has not been retested. | REQ-004 | Ken Nguyen | 2026-09-01 |

---

## Testability Risk Summary

_Places where a requirement is written in a way we cannot prove true or false as it
stands. Each one is a requirement we cannot honestly sign off until it is clarified._

| Requirement | Risk | Severity | Status |
|---|---|:---:|:---:|
| REQ-006 | No screen or column list is given for the send register, so the requirement cannot be tested at all as written. | High | Open |
| REQ-007 | The quick-access download names no control and no page, and may not have been built. | High | Open |
| REQ-004 | No rule exists for a dealer with an empty Chubb configuration — the exact case QC already hit. | High | Open |
| REQ-004 | Changing a dealer's Chubb configuration depends on the **Dealer Details** page, which was blocked on 2026-08-23 and is not yet retested. | High | Open |
| REQ-003 | No on-screen success or failure feedback is defined, so a silent failure is indistinguishable from a successful send. | High | Open |
| REQ-002 | No field validation rules and no error messages are defined for **Client Name** and **Client Email**. | High | Open |
| REQ-001 | Behaviour for a non-Quebec dealer is undefined. | High | Open |
| REQ-005 | The document language rule is not stated, although both English and French versions exist. | High | Open |
| REQ-005 | The format of the product list inside the Talk Insurance PDF is not specified. | Medium | Open |
| REQ-005 | The remuneration disclosure appears only in the French description and not in the acceptance criteria. | Medium | Open |
| REQ-006 | It is not stated whether failed sends are recorded in the register. | Medium | Open |
| REQ-003 | The sender address, subject line and French body text are not specified. | Medium | Open |
| REQ-003 | No delivery-time expectation is quantified. | Low | Open |
| REQ-001 | The French label in the ticket contains the spelling "comformité". | Low | Open |

---

## Sign-off Checklist

- [x] All requirements have at least one acceptance criterion
- [x] All requirements have a priority assigned
- [x] Testability risks have been logged
- [x] Open questions have been assigned to stakeholders
- [ ] Recommended test types reviewed by QA Lead
- [x] Ready to proceed to Test Plan Design

Test plan design can begin now. The eight High-severity risks do not block writing the
plan, but REQ-006 and REQ-007 cannot be executed until Q-006 and Q-007 are answered, so
the plan must list them as dependent on a product-team reply rather than schedule them as
ordinary test runs.

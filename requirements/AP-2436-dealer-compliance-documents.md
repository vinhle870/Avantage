# AP-2436 — Dealer portal: Sending insurance compliance documents

**Spec ID:** AP-2436
**Source:** Jira story [AP-2436](https://garantieavantageplus.atlassian.net/browse/AP-2436) — Project *Avantage Plus (AP)*, type Story, priority Medium, fix version 5.1.0
**Author:** Ken Nguyen · **Assignee (QC):** Vinh Le - QC
**Captured on:** 2026-08-28 from the Jira description, the Given/When/Then acceptance-criteria field, and all 5 ticket comments.

> This file is a faithful transcription of AP-2436 for the STLC pipeline. The Jira
> description is written in French; the acceptance criteria are in English. Both are
> reproduced, and the clarifications the product owner gave in the ticket comments are
> folded in as numbered acceptance criteria so nothing is lost.

---

## Feature 1 — Assisted sending of insurance compliance documents (Phase 1)

### User story

As a **dealer F&I advisor in the Quebec province**, I want to send the insurance
compliance documents to my client by email directly from the dealer portal, so that the
client receives the legally required disclosure documents without me assembling and
attaching the PDFs by hand.

### Original requirement text (Jira description, French)

**Phase 1 – Interface de soumission des assurances**

**A. Envoi assisté des documents de conformité**

Ajouter, au haut de l'interface, une section permettant au conseiller F&I de saisir :

- Nom du client
- Adresse courriel
- Bouton **« Envoyer »**

Lors de l'envoi, le système transmet automatiquement les documents suivants :

- Sommaire des protections
- Parlons assurances
- Divulgation du pourcentage de rémunération

Exigences

- Chaque envoi doit être horodaté (date et heure).
- Le système doit conserver un registre de tous les envois.
- Ce registre doit être consultable autant par Avantage+ que par le concessionnaire.
- Ajouter un accès rapide permettant au concessionnaire de télécharger les versions PDF
  préremplies des documents de divulgation.

### Acceptance criteria

**Given** the dealer user is logged in to the dealer area, **and** the dealer belongs to
the Quebec province.

1. **Entry point.** When the dealer is on the **Insurance Quick Quote** page or the
   **Quote Details** page and the dealer is from Quebec, the navigation component shows a
   button labelled **Send compliance documents** (English) / **Envoyer les documents de
   comformité** (French). The button uses the *Dark button* style.
2. **Modal form.** When the dealer clicks that button, a modal form opens containing
   exactly three controls: a **Client Name** text field, a **Client Email** text field,
   and a **Send** button. In French these read **Nom du client**, **Adresse courriel** and
   **Envoyer**.
3. **Email is sent.** When the dealer submits the form, an email is sent to the address
   typed in **Client Email**. The email contains the conformity documents selected from
   the dealer's Chubb Insurance Configuration (the `dealer_chubb_insurance` table).
4. **Email body.** The email body reads: `Dear {{Client name}},` followed by
   `Please find attached our updated insurance conformity documents.` — with the value
   typed in **Client Name** substituted into the greeting.
5. **Waiver form selection — 50 %.** If the dealer's Chubb creditor form configuration
   contains **PM50**, the email includes the **50 % waiver form**
   (*Acceptance or Waiver Form — Credit Insurance (50 %)*).
6. **Waiver form selection — 30 %.** If the dealer's Chubb creditor form configuration
   contains **PM30**, **S30** or **M30**, the email includes the **30 % waiver form**
   (*Acceptance or Waiver Form — Credit Insurance (30 %)*).
7. **Both codes assigned.** If the dealer is assigned to both the 50 % and the 30 %
   creditor form groups, the email includes **both** waiver forms. *(Confirmed by Ken
   Nguyen in the ticket comment of 2026-08-26 in answer to QC Issue #2.)*
8. **Only one code assigned.** If the dealer is assigned to only one type — 50 % or 30 %,
   not both — then **only that one** waiver form is sent. *(Explicitly called out by Ken
   Nguyen on 2026-08-26 as a case that must be tested.)*
9. **Talk Insurance document.** The email attaches the *Parlons assurances / Talk
   Insurance* PDF together with the protection summary (*Sommaire des protections*), in
   the language variant that applies. The dealer's company name is filled into the
   `Nom du distributeur` section of that PDF, and the PDF lists the products available to
   that dealer according to the Chubb configuration (`dealer_chubb_insurance` table).
10. **Remuneration disclosure.** The email includes the *Divulgation du pourcentage de
    rémunération* (commission-percentage disclosure) document.
11. **Timestamped log.** Every send is recorded with its date and time.
12. **Send register.** The system keeps a register of all sends, and that register can be
    read both by Avantage+ staff and by the dealer.
13. **Quick download.** The dealer has a quick-access way to download the pre-filled PDF
    versions of the disclosure documents without sending an email.
14. **Attachment file names.** The names of the attached files do not need to match the
    requirement wording; only the file **contents** must be correct. *(Ken Nguyen,
    2026-08-26, answering QC Issue #1.)*

### Out of scope

- Anything beyond **Phase 1 – Interface de soumission des assurances**. The ticket titles
  this work "Phase 1", so later phases of the insurance submission interface are not part
  of AP-2436.
- Dealers outside the Quebec province. The Given clause restricts the whole feature to
  Quebec dealers, so no behaviour is specified for other provinces.

### Notes from the ticket history that affect testing

- **Previously blocked, now unblocked.** QC reported on 2026-08-23 that verifying the
  Chubb insurance configuration was blocked because the **Dealer Details** page could not
  be opened to set up the dealer's Chubb Insurance. Ken Nguyen replied on 2026-08-26 that
  this is now fixed and asked for a retest. Setting up a dealer's Chubb configuration is
  therefore a precondition that must be re-verified before the waiver-form rules can be
  tested.
- **Already partially verified.** QC confirmed on 2026-08-23 that the files can be sent
  successfully. The open work is the conditional waiver-form logic, the PDF contents, the
  register, and the quick-download access.
- The ticket carries 15 attachments, including the four waiver-form PDFs (30 % and 50 %,
  English and French) and the *Parlons assurances + Sommaire* PDFs in both languages.
  These are the reference documents to compare received attachments against.

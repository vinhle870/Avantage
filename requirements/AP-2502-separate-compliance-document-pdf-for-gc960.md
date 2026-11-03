# AP-2502 — separate compliance document PDF for GC960 and 6201

**Spec ID:** AP-2502
**Source:** Jira [AP-2502](https://garantieavantageplus.atlassian.net/browse/AP-2502) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Ken Nguyen
**Created:** 2026-10-28 · **Last updated:** 2026-11-02 (21:33 −05:00)
**Captured on:** 2026-11-03 by stlc-ticket-pipeline from the description, the acceptance criteria field (Given/When/Then), 1 comment and 2 attachments.
**Parent:** None
**Delivery state at capture:** 1 pull request **MERGED** (Jira development panel, Bitbucket, last updated 2026-11-02). Status QC was set by Ken Nguyen on 2026-11-02, from Deploy to staging.
**Sprint / fix version:** none — run folder `no-sprint`.
**Links:** none. **Labels / components:** none.

> Faithful transcription of AP-2502 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> attach separate PDF for GC960 and GC6201 product families in the compliance documents because they have a different version PDF

## Acceptance criteria (verbatim)

From the Jira acceptance-criteria field. Inline code marks (`…`) are as written in the ticket.
The two images in the field are the ticket's two attachments (listed below); they sit
between the GC960 line and the GC6201 line.

> **Given** the dealer user is sending compliance documents
> The dealer is assigned to one of the 960 forms or one of the GC6201 forms
> **When** the compliance documents are sent
> **Then** a separate document is filled for each product families
> For `GC960` , only mention `GC960` in the product line text
> *[two embedded files]*
> For `GC6201`, only mention `GC6201` the product line text, use existing parlons-assurance-(EN/FR).pdf

## Attachments

| File | Read? |
|---|---|
| `GC960S_AMFFS_F_DC2020.pdf` (1,030,019 bytes, added 2026-10-28 15:41 −04:00) | Yes — text extracted. 6 pages, **French**. Page 1 "PARLONS ASSURANCE !" fact sheet; pages 2–6 the product summary "Plan de protection de paiement pour propriétaire d'équipement", page footer **`PSF_GC960S(201907)`**, insurer Chubb du Canada compagnie d'assurance vie, distributor Unité Assureurs-Gestionnaires Limitée. Fillable PDF form fields: `CertificateNo`, `AccountName` (both empty in the file) |
| `Let's Talk Insurance and Summary Plan GC960, Anglais.pdf` (329,297 bytes, added 2026-10-28 16:46 −04:00) | Yes — text extracted. 6 pages, **English**. Page 1 "LET'S TALK INSURANCE!" fact sheet; pages 2–6 the summary "Equipment Owner Payment Protection Plan", page footer **`PSE_GC960M(202601)`**, insurer Chubb Life Insurance Company of Canada, claims agent Pitcher & Doyle Inc. No fillable PDF form fields |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-28 (edited the same day) | Ken Nguyen | Addressed to the developer (Minh Lưu): start the ticket; the earlier instruction to duplicate the French version for English is struck through, replaced by "EDIT: English version provided in the ticket." and "ready for dev!" |

Verbatim body of that comment (the struck-through part is between `-` marks in Jira wiki
markup):

> [~Minh Lưu] please start on this ticket, for now, -please duplicate the french version for english, and we will replace it when we get the english version-
>
> EDIT: English version provided in the ticket.
>
> ready for dev!

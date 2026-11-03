# AP-2501 — Permaplate invoice - include name of the term in the description

**Spec ID:** AP-2501
**Source:** Jira [AP-2501](https://garantieavantageplus.atlassian.net/browse/AP-2501) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-10-27 · **Last updated:** 2026-10-30
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 1 comment and 1 attachment.
**Parent:** None
**Delivery state at capture:** 1 pull request **MERGED** (Jira development panel, last updated 2026-10-30).
**Sprint / fix version:** none — run folder `no-sprint`.

> Faithful transcription of AP-2501 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> include name of the term in the description of the invoice when it is generated

## Acceptance criteria (verbatim)

From the Jira acceptance-criteria field (Given/When/Then), line breaks kept:

> Given the permaplate quote is created
> When the permaplate contract is created and the invoice is generated
> Then the name of the invoice should follow the contract number in the description
> On the invoice details page
>
> On the invoice generated PDF
>
> On the invoice list page (on dealer portal and admin area)

## Attachments

| File | Read? |
|---|---|
| image-20261027-184124.png (Ken Nguyen, 2026-10-27, attached at ticket creation, not referenced from the description) | Yes — viewed. It is a screenshot of a Dealer Portal invoice details page (French UI) for dealer "Subaru Repentigny", status "En attente de paiement", total $80.00. The Description cell reads, line by line: `MICHEL DUPUIS` / `Subaru Outback 2024` / `VIN : 4S4BTDEC8R3199624` / a contract-number line beginning `PNA` (its digits partly hidden by the highlight box) / `10 ans/yrs ( suite complète )` / `Subaru Repentigny mdesautels@newavantage.com`. The line `10 ans/yrs ( suite complète )` is outlined in a magenta box. The ticket does not say whether the screenshot shows the wanted result or an edited mock-up |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-28 | Ken Nguyen | Asks Minh Lưu to start on the ticket. No requirement content |

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

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08T04:50:47-05:00 · **Previous capture:** 2026-11-01

No Jira change to the description, the acceptance criteria, the attachments or the status
(QC). The two comments added since capture are the QA's own (they hold no answer), and no
one outside QA has commented:

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-01 | Vinh Le - QC | QA result comment 19455: FAIL, 1 of 6 passed on Dev; AP-2529 filed; Q-001 reminded, Q-007 raised |
| 2026-11-08 | Vinh Le - QC | QA questions comment with screenshots for Q-001, Q-002, Q-005 and Q-007; asks the reporter to answer. No answer has been posted |

> **2026-11-15 — knowledge lookup (no Jira change, nothing posted).** The open questions
> were re-checked by the analyst's Step 3c knowledge lookup: Jira Story/Task tickets were
> searched for a sentence that defines each answer. **Q-007** is answered by AP-2099
> ("Generate invoice PDF"): the invoice PDF is the download button on the **Admin** invoice
> details page. **Q-001** to **Q-006** found no defining Story/Task and are now `Accepted`,
> meaning the build's current actual result is the expected result. For Q-001 the ticket
> contradicts itself ("the name of the invoice" in the criterion, "the name of the term"
> in the title and description); because the lookup found nothing, the current actual
> result decides the reading under test: on invoice 941 the term "10 ans" is on the line
> right after the contract number "PNA-0000000020". The criterion's own words still set
> the result: the term must **follow the contract number** on every surface it names.
> Details and the queries tried: `qa-artifacts/1-requirements-analysis/AP-2501_requirements-analysis.md`
> → *Knowledge lookup — 2026-11-15*.

> **Correction 2026-11-15T09:19Z (R1 round 1 REWORK, F-1).** The note above is wrong about
> **Q-001**. Q-001 is not a gap in product knowledge: the ticket's own text contradicts
> itself ("the name of the **invoice**" in the criterion, "the name of the **term**" in the
> title and description), and the current actual result may never choose between two
> readings of the ticket's text. Q-001 is again **Blocking + Open**, so REQ-004 (the
> position check, AP2501_006) stays BLOCKED until the reporter answers. It was already asked
> on 2026-11-01 (comment 19437) and on 2026-11-08, so it is not posted again. The other half
> of the old Q-001 — whether "follow the contract number" means the very next line — is a
> format question, now **Q-008** (Judgement, `Accepted`: the very next line, as observed on
> invoice 941). Q-002 to Q-007 are unchanged.

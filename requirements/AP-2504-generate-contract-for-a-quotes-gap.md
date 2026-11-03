# AP-2504 — Generate contract for a quote's GAP/Creditor Insurance product

**Spec ID:** AP-2504
**Source:** Jira [AP-2504](https://garantieavantageplus.atlassian.net/browse/AP-2504) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Ken Nguyen
**Created:** 2026-10-29 · **Last updated:** 2026-11-02 (moved to QC by Ken Nguyen, from Deploy to staging)
**Captured on:** 2026-11-03 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2504 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them. Related tickets in
> the same batch: AP-2503 (Generate contract for a quote's extended warranty — same layout
> change for the warranty product), AP-2506 (same change for Esthetic protection), AP-2499
> (GAP/creditors add modal with the embedded financing form; its open bugs AP-2526,
> AP-2527 and AP-2528 sit on the setup path of this ticket).

---

## User story

Not stated in the ticket.

## Original requirement text

> The “Generate Contract” action for GAP product on the dealer quote should match Esthetic Protection: open a dedicated page (no modal) with a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right. Contract creation, invoice, financing, and PDF behaviour stay unchanged. The route `/quote/{quoteId}/insurance/create-contract/{type}` (`quote-insurance-create-contract`) stays the same.

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150), as it reads
on 2026-11-03 (edited by Nicolas-Eric Tain on 2026-10-29 and 2026-10-30, per the
orchestrator's plan note — this capture uses the current text).

> **Given** a quote with a GAP insurance quote and no contract,
> **when** the dealer chooses “Generate Contract” from the Extended Warranty row actions,
> **then** `/quote/{quoteId}/insurance/create-contract/gap` opens in the same tab with no modal.
>
> **Given** the page has loaded,
> **when** the dealer inspects it,
> **then** it shows the “Vehicle identification”, “Owner information”, “Co-owner information” (if has co-applicant), “Financing information” in a left column, and “Program Summary” with a “Generate Contract” button in a right column.
>
> **Given** the quote has a vehicle, a client, a co-applicant or a financing,
> **when** the page renders,
> **then** vehicle and owner, co-owner and financing values are pre-filled and financing is read-only
>
> **Given** valid form values,
> **when** the dealer submits,
> **then** contract is created following the current process.
>
> **Note**
>
> For Creditor Insurance, the process is similar to GAP except the dealer will be redirected to `/quote/{quoteId}/insurance/create-contract` when clicking on “Generate contract”.

## Attachments

| File | Read? |
|---|---|
| — | No attachments on the ticket |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket |

## Development links

The development panel (customfield_10000) shows one **merged** pull request and a
successful deployment to the `develop` environment on 2026-10-30. No branch name or PR
link is given in the field.

> **Note from capture (2026-11-03):** recorded as written; no reading is chosen here.
> (1) The first acceptance criterion names "the Extended Warranty row actions" as the
> place of the GAP "Generate Contract" action, while the route it expects is the GAP one,
> `/quote/{quoteId}/insurance/create-contract/gap`. (2) The description says the action
> "should match Esthetic Protection" and that the route `/quote/{quoteId}/insurance/create-contract/{type}`
> "stays the same"; the Note extends the change to Creditor Insurance with the route
> `/quote/{quoteId}/insurance/create-contract` (no `{type}`). (3) The ticket gives no list
> of Program Summary lines for GAP or creditor insurance (AP-2506 lists five for Esthetic
> protection; this ticket lists none). (4) "financing is read-only" is stated in AC 3 only.

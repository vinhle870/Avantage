# AP-2506 — Generate contract for a quote's Esthetic protection product

**Spec ID:** AP-2506
**Source:** Jira [AP-2506](https://garantieavantageplus.atlassian.net/browse/AP-2506) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QA**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-29 · **Last updated:** 2026-10-30
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2506 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them. Related tickets:
> AP-2503 (Generate contract for a quote's extended warranty — same layout change for the
> warranty product), AP-2428 (Dealer Permaplate / Esthetic protection contract form).

---

## User story

Not stated in the ticket.

## Original requirement text

> The “Generate Contract” action for Esthetic protection on the dealer quote should match Esthetic Protection: open a dedicated page (no modal) with a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right. Contract creation, invoice, financing, and PDF behaviour stay unchanged. The route `/quote/{quoteId}/permaplate-create-contract` (`quote-permaplate-create-contract`) stays the same.

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

> **Given** a quote with an extended warranty quote and no contract,
> **when** the dealer chooses “Generate Contract” from the Extended Warranty row actions,
> **then** `/quote/{quoteId}/permaplate-create-contract` opens in the same tab with no modal.
>
> **Given** the page has loaded,
> **when** the dealer inspects it,
> **then** it shows the “Vehicle identification” and “Owner information” in a left column, and “Program Summary” and a submit button in a right column.
>
> The “Program Summary” shows:
>
> - Program Term
> - Start Date
> - End date
> - Selected protection products
> - Total
>
> **Given** the quote has a vehicle and a client,
> **when** the page renders,
> **then** vehicle and owner values are pre-filled.
>
> **Given** valid form values,
> **when** the dealer submits,
> **then** contract is created following the current process.

## Attachments

| File | Read? |
|---|---|
| — | No attachments on the ticket |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket |

## Development links

The ticket's development panel field is empty (`{}`) — no pull request or branch is
linked to AP-2506.

> **Note from capture (2026-11-01):** recorded as written; no reading is chosen here.
> (1) The description says the Esthetic protection action "should match Esthetic
> Protection" — it names the same product on both sides. (2) The first acceptance
> criterion speaks of "a quote with an extended warranty quote" and "the Extended
> Warranty row actions", while the route it names, `/quote/{quoteId}/permaplate-create-contract`,
> is the Esthetic protection (Permaplate) route named in the description. (3) The ticket
> status is **QA**, which this project's adapter does not map to canonical `ready_for_qa`
> (that is **QC**); the run is design-only.

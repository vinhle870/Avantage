# AP-2505 — Generate contract for a quote's Roadside protection product

**Spec ID:** AP-2505
**Source:** Jira [AP-2505](https://garantieavantageplus.atlassian.net/browse/AP-2505) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-29 · **Last updated:** 2026-11-02
**Captured on:** 2026-11-03 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`
**Development:** 1 Bitbucket branch (last updated 2026-10-30), no pull request or issue link shown on the ticket.

> Faithful transcription of AP-2505 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them. Related tickets:
> AP-2506 (Generate contract for a quote's Esthetic protection product — the page this one
> must match), AP-2503 (the same layout change for the extended warranty), AP-2225 (dealer
> AutoShield contract), AP-2498 (roadside protection add modal). Open bugs on the roadside
> pages: AP-2508 (High, roadside product page has no contract fields and no Generate
> Contract button) and AP-2518 (High, opening `/quote/{id}/road-side-protection-create-contract`
> returns HTTP 500 on Dev).

---

## User story

Not stated in the ticket.

## Original requirement text

> The “Generate Contract” action for Roadside Protection product on the dealer quote should match Esthetic Protection: open a dedicated page (no modal) with a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right. Contract creation, invoice, financing, and PDF behaviour stay unchanged. The route /quote/{quoteId}/road-side-protection-create-contract ( quote-insurance-create-contract ) stays the same.

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150). Spelling kept as in the ticket.

> **Given** a quote with a GAP insurance quote and no contract,
> **when** the dealer chooses “Generate Contract” from the Roadside protectection row actions,
> **then** /quote/{quoteId}/road-side-protection-create-contract opens in the same tab with no modal.
>
> **Given** the page has loaded,
> **when** the dealer inspects it,
> **then** it shows the “Owner information”, “Financing information” in the left column, and “Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column.
>
> **Given** the quote has a vehicle, a client, or a financing,
> **when** the page renders,
> **then** vehicle client and financing values are pre-filled and financing is read-only
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
| — | — | No comments on the ticket (2026-11-03) |

## Status history (from the orchestrator plan, rule P13)

| Date | By | Change |
|---|---|---|
| 2026-11-02 | Ken Nguyen | QA → QC the same day; assigned to Vinh Le - QC |

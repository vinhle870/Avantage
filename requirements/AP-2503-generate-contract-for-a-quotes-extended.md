# AP-2503 — Generate contract for a quote's extended warranty

**Spec ID:** AP-2503
**Source:** Jira [AP-2503](https://garantieavantageplus.atlassian.net/browse/AP-2503) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-29 · **Last updated:** 2026-10-30
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2503 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them. Related tickets in
> the same batch: AP-2428 (Dealer Permaplate / Esthetic protection contract form),
> AP-2506 (Contract for Esthetic protection), AP-2497 (extended warranty vehicle form).

---

## User story

Not stated in the ticket.

## Original requirement text

> The “Generate Contract” action for Extended Warranty on the dealer quote should match Esthetic Protection: open a dedicated page (no modal) with a two-column card — vehicle and owner information on the left, Program Summary and the “Generate Contract” button on the right. Contract creation, invoice, financing, and PDF behaviour stay unchanged. The route `/quote/{quoteId}/warranty/generate-contract` (`quote-warranty-generate-contract`) stays the same.

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

> **Given** a quote with a vehicle and an extended warranty from a program,
> **when** the dealer opens `/quote/{quoteId}/warranty/generate-contract`,
> **then** the form is pre-filled with the quote’s client and vehicle data, the quote PDF preview is shown.
>
> **Given** the page has loaded,
> **when** the dealer inspects it,
> **then** it shows the “Owner information”, “Financing information” in a left column. “Program Summary”,  a preview of the contract and a submit button are in the right column.
>
> The “Program Summary” shows:
>
> - Vehicle delivery date
> - Warranty start date (editable)
> - Warranty sale price
>
> **Given** the quote has a vehicle, a client or a financing,
> **when** the page renders,
> **then** vehicle, owner and financing values are pre-filled, vehicle identifiers and delivery date are read-only, and the warranty start date, and owner fields are editable.
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

The ticket's development panel shows 1 pull request, state MERGED (last updated
2026-10-30). Its content is not readable through the CLI.

> **Note from capture (2026-11-01):** the description places "vehicle and owner
> information on the left" and the "Generate Contract" button on the right; the second
> acceptance criterion places "Owner information" and "Financing information" on the left
> and "Program Summary", "a preview of the contract and a submit button" on the right. The
> two statements do not name the same sections. The first criterion also speaks of "the
> quote PDF preview" and the second of "a preview of the contract". Recorded as written;
> no reading is chosen here.

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** not re-read by this run — the qa-agent batch plan check of 2026-11-15 found the ticket unchanged (status QC, no description or acceptance-criteria change, no comment since QA comment 19456 of 2026-11-02) · **Previous capture:** 2026-11-01

No Jira change. The description and the acceptance criteria above stand as transcribed.

New comments since capture:

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-02 | Vinh Le - QC (QA account) | QA result comment 19456: FAIL 7/10 on Dev (v2dev); bugs AP-2530, AP-2531, AP-2532 linked; the 11 open questions listed |

**Answer from the QA to the open questions Q-001 – Q-011** (given in chat to the qa-agent
orchestrator on 2026-11-15, not posted on the ticket), word for word:

> "AP-2503: according to the question: all current behavior actual result is correct as expected."
> — the QA, in chat, 2026-11-15

> **Scope of this answer (the QA's decision for the 2026-11-15 batch):** the answer covers
> the open questions only. For each question, the behaviour Dev (v2dev) showed in the
> execution log of 2026-11-02 (`qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md`)
> is the expected behaviour; where that log does not record the behaviour, the next
> execution records it and accepts it as the expected value. The answer does **not** reject
> the filed bugs: AP-2530 (Program Summary lacks the vehicle delivery date — AC 2), AP-2531
> (VIN and delivery date editable — AC 3) and AP-2532 (a quote without financing cannot be
> submitted — required financing-company fields) stay open and valid. **Where the
> acceptance criteria text itself states the expected result, the acceptance criterion wins
> over the current behaviour.** No bug status is changed. This replaces no earlier
> statement in this file; it settles the questions the 2026-11-01 analysis left open.

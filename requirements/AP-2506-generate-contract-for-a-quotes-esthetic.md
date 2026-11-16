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

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08T04:50:50-05:00 · **Previous capture:** 2026-11-01 · **Re-read:** 2026-11-15T09:34Z

No Jira change to the description, the acceptance criteria (customfield_10150, re-read
word for word), the status (QA) or the assignee (Vinh Le - QC). Everything added since
capture is the QA's own work and holds no answer; no one outside QA has commented:

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-01 (Jira 2026-10-31 21:51 −04:00) | Vinh Le - QC (QA account) | "QA questions before testing — 2026-11-01": asks Q-001 of the reporter. No answer |
| 2026-11-08 (Jira 2026-11-07 22:45 −05:00) | Vinh Le - QC (QA account) | QA result comment 19521: FAIL 5/9 on Dev; bugs AP-2556, AP-2512, AP-2555; Q-001 repeated |
| 2026-11-08 (Jira 04:50 −05:00) | Vinh Le - QC (QA account) | "QA questions — screenshots · 2026-11-08": Q-001 again, with the attachment `AP-2506_Q-001_highlighted.png`. No answer has been posted |

Links added since capture (all "relates to"): AP-2555 (Medium, Backlog), AP-2556 (High,
Backlog), AP-2512 (High, Backlog). No development link.

> **2026-11-15 — knowledge lookup (no Jira change, nothing posted).** On the QA's instruction
> of 2026-11-15 ("double check all tickets' question and continue testing for the
> blocked/untest test cases"), every open question was re-checked with the analyst's
> Step 3c knowledge lookup: Jira Story and Task tickets were searched for a sentence that
> defines each answer. **Q-003, Q-004, Q-007 and Q-009** are now `Answered` by quoted
> sentences from AP-2546 and AP-2559 (the "Financing information" card), AP-2428 (start
> date, submit result), AP-2544 and AP-2545 (editable fields) and AP-2446 (the invoice).
> **Q-005, Q-006, Q-008, Q-010 and Q-011** found no defining Story/Task and are
> `Accepted`: the build's current actual result, recorded in the execution log of
> 2026-11-08, is the expected result. **Q-001 stays `Blocking` + `Open`:** it is a
> contradiction in this ticket's own text — AC 1 names "the Extended Warranty row actions"
> and "a quote with an extended warranty quote" but expects the Esthetic protection
> address, while the description names "the “Generate Contract” action for Esthetic
> protection" — and no delivered Story explicitly redesigns that entry point. **Q-002**
> (the description's "should match Esthetic Protection" names the product it describes)
> and **Q-012** (whether the change is deployed) are not product knowledge and stay `Open`.
> Full record: `qa-artifacts/1-requirements-analysis/AP-2506_requirements-analysis.md`,
> section *Knowledge lookup — 2026-11-15*.

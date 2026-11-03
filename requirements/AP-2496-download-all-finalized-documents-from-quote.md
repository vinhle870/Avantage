# AP-2496 — Download all finalized documents from a quote in one click

**Spec ID:** AP-2496
**Source:** Jira [AP-2496](https://garantieavantageplus.atlassian.net/browse/AP-2496) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-15 · **Last updated:** 2026-10-28
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 1 comment and 1 attachment.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2496 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> A dealer must be able to download every finalized contract/document that belongs to a quote with a single action, instead of opening each product's individual download link. The action lives on the quote page and returns the documents that already exist for that quote as one download.

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

**Action shown for a quote with documents to download**

- Given a finalized quote that has at least one generated contract that still exists,
- When the dealer opens the quote page,
- Then a single "Download all documents" action is shown.

**Action hidden when there is nothing to download**

- Given a finalized quote with no generated contract (for example a quote whose products were removed before finalization),
- When the dealer opens the quote page,
- Then the download action is not shown.

**One concatenated PDF is returned**

- Given a finalized quote with several contracts,
- When the dealer triggers "Download all documents",
- Then a single PDF file named with the quote id is returned (content type `application/pdf`).

**Removed or cancelled items are never rendered**

- Given a quote where an optional product was removed before finalization, or a warranty contract is marked cancelled (`WarrantyContract::isCancelled()` true),
- When the dealer downloads all documents,
- Then no page from that product or contract is included, and the remaining documents are still merged.

## Attachments

| File | Read? |
|---|---|
| image-20261016-132851.png (Nicolas-Eric Tain, 2026-10-16) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-22 | Ken Nguyen | Tells Minh Lưu that review comments were added on the PR. No requirement content |

## Development links

The ticket's development panel lists 6 Bitbucket Cloud repository links (last updated 2026-10-26). Their PR state is not readable through the CLI.

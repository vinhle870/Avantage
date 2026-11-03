# AP-2494 — Quotes list: replace "Produits" with "Contracts" and add quote search

**Spec ID:** AP-2494
**Source:** Jira [AP-2494](https://garantieavantageplus.atlassian.net/browse/AP-2494) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-15 · **Last updated:** 2026-10-28
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2494 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> On the dealer quote list (`/quotes`), replace the "Produits" column with a "Contracts" column that lists the quote's finalized contract and add a keyword search over quote name, client first name, client last name, client email and VIN.

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

**Contracts column**

- Given a dealer on `/quotes`, on either the `created` or `archived` tab, when the list renders, then no column is headed "Produits" and a column headed "Contracts" occupies its position.
- Given a quote with a generated extended-warranty contract, when its row renders, then the "Contracts" column shows that contract.
- Given a quote with generated roadside, GAP or creditor-insurance contracts, when its row renders, then the "Contracts" column shows each of those contract.
- Given a quote with generated Permaplate or sale contracts, when its row renders, then the "Contracts" column shows those contract numbers.
- Given a quote with no generated contract, when its row renders, then the column shows a blank space.
- Given a quote where one product has no contract generated yet, when its row renders, then that product contributes no entry — no blank or broken line.

**Search**

- Given a dealer on `/quotes`, when they open the search and submit part of a quote name, then the matching quotes are listed, and the match is partial and case-insensitive.
- Given a quote with client first name, last name and email, when the dealer searches any one of them, or the full `first last`, then the matching quotes are listed.
- Given a quote with a partial VIN, when the dealer searches, then the matching quotes are listed.

## Attachments

| File | Read? |
|---|---|
| None | — |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket. |

## Other ticket data

- Development panel: 1 Bitbucket Cloud pull request, state **MERGED**, last updated 2026-10-22.
- No linked issues, no sub-tasks, no labels, no components.

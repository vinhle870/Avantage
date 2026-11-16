# AP-2493 — Cancelling a product from a quote

**Spec ID:** AP-2493
**Source:** Jira [AP-2493](https://garantieavantageplus.atlassian.net/browse/AP-2493) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-15 · **Last updated:** 2026-10-28
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 5 comments and 1 attachment.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2493 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> On the quote details page, a dealer must be able to cancel an optional product by deleting its database row. Cancelling asks the dealer to confirm in a modal first. The cancelled product frees the slot so the dealer can add a new product of the same type. Cancelling a product also removes its amount from the quote Subtotal, so the Subtotal reflects only active products.
>
> Products in scope: extended warranty, Roadside Protection (AutoShield), GAP insurance, creditor insurance, Esthetic protection (Permaplate).
>
> A product can only be cancelled while it is **not finalized** — that is, while it has no generated contract. Finalized products keep their existing download action and are out of scope for cancellation here.
>
> [attachment: image-20261015-153953.png — embedded mockup]

## Acceptance criteria (verbatim)

Taken from the ticket's Acceptance Criteria field (customfield_10150).

**AC 1 — Cancel action is offered only for a non-finalized product**
- Given a dealer on the details page of a non-archived quote with an active extended warranty, roadside, GAP, creditor, or Permaplate product that has no generated contract
- When the product row is rendered
- Then a cancel action is available for that product.

**AC 2 — Cancellation is confirmed before it is applied**
- Given an active, non-finalized product on the details page
- When the dealer chooses the cancel action
- Then a confirmation modal is displayed and no cancellation has occurred yet, and the product is only cancelled after the dealer confirms in that modal.
- And given the dealer dismisses or declines the confirmation
- Then the modal closes and the product is still active and unchanged.

**AC 3 — A new product can be added after cancellation**
- Given a product that was cancelled and no active product of that type
- When the details page is rendered
- Then the add (+) action is available again, and adding a product creates a new row.

(The AC headings are bold paragraphs in the ticket; the numbers AC 1–3 are added here for reference only.)

## Attachments

| File | Read? |
|---|---|
| image-20261015-153953.png (embedded in the description; a mockup per the 2026-10-17 comment) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-15 | Ken Nguyen | Asks Nicolas-Eric Tain to modify the ACs to remove the need to persist cancelled contracts. |
| 2026-10-17 | Minh Lưu | Points out the description ("deletes its database row") conflicts with AC3 ("the cancelled row remains in the database"); offers soft-cancel vs hard delete, and states assumptions unless told otherwise: dropdown label stays "Delete" as in the mockup, only the Subtotal changes (financing monthly payment not recalculated), and a product with a contract (warranty/permaplate contract, roadside contract ID, GAP/creditor contract number) cannot be cancelled. |
| 2026-10-17 | Nicolas-Eric Tain | "I've modified the AC3 and we're going to **hard delete** the row." |
| 2026-10-22 | Ken Nguyen | Changes requested on the PR; cc Nicolas-Eric Tain. |
| 2026-10-23 | Minh Lưu | Says he updated the PR. |

Ticket metadata: one Bitbucket pull request linked, state MERGED (last updated 2026-10-26).

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08T04:50:42-05:00 (2026-11-08T09:50:42Z) · **Previous capture:** 2026-11-01 · **Re-read:** 2026-11-15T09:45Z by stlc-ticket-pipeline (stlc-worker, `--from analyze --until analyze`)

The description and the three acceptance criteria (customfield_10150) are unchanged —
re-read word for word against the transcription above. The status is still **QC** and the
assignee is still Vinh Le - QC. Nothing in the ticket's own text replaces an earlier
statement. What changed:

**New comments** (rows to add to the Comments table above):

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-01 (15:12 -05:00) | Vinh Le - QC | QA result — FAIL (2026-11-02) on Dev (v2dev): 12 PASS · 2 FAIL · 0 BLOCKED of 14 (86 %); bug AP-2516; Q-002–Q-008 listed with the recorded behaviour; not moved to Ready for release |
| 2026-11-08 (04:50 -05:00) | Vinh Le - QC | "QA questions — screenshots · 2026-11-08": the open questions Q-002 to Q-008 re-posted to Nicolas-Eric Tain, each with a highlighted screenshot |

Both comments are by the QA account (`not_developers`), so neither answers a question.
No comment by the reporter or a developer has been added since 2026-10-23.

**New attachments:** 7 QA screenshots `AP-2493_Q-002_highlighted.png` … `AP-2493_Q-008_highlighted.png`
(2026-11-08), one per question in the 2026-11-08 comment — QA evidence, not requirement text.

**New links:** relates to AP-2516 (the bug filed by the 2026-11-02 run, Backlog).

> Knowledge lookup (2026-11-15): the open questions were searched for in Jira Stories and
> Tasks; none is defined there, so Q-002–Q-010 are Accepted in the requirements analysis
> (Q-003 except the Permaplate Subtotal gap, which the description's Subtotal sentence
> keeps as a failure). Related later Stories found — AP-2535, AP-2536, AP-2543, AP-2537 —
> cancel a *generated contract*, which this ticket puts out of scope; they change nothing
> here.

# AP-1381 — duplicate name visual

**Spec ID:** AP-1381
**Source:** Jira [AP-1381](https://garantieavantageplus.atlassian.net/browse/AP-1381) — Project *AP*, type Task, priority Medium, status **QC**
**Reporter:** Eric Lindquist · **Assignee:** Eric Lindquist
**Created:** 2022-03-24 · **Last updated:** 2022-10-13
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 11 comments and 4 attachments.
**Parent:** None
**Component:** Billing & Payments · **Fix version:** 1.25.0 (released 2022-09-19)
**Linked issues:** is tested by AP-1551 "[AP-1381] Dealer portal - Verify only Dealer name is displayed on invoic…" (Xray Test, Backlog) · AP-1552 "[AP-1381] Admin portal - Verify only Dealer name is displayed on invoice…" (Xray Test, Backlog)

> Faithful transcription of AP-1381 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> [attachment] [attachment] on the invoice - the name of the dealer is duplicated - only company name is needed to show

## Acceptance criteria (verbatim)

None in the ticket — flagged for Gate A.

## Attachments

| File | Read? |
|---|---|
| image-20220324-144126.png (2022-03-24, in the description) | No — listed only |
| image-20220816-010715.png (2022-08-15) | No — listed only |
| Screen Shot 2022-08-15 at 9.01.57 PM.png (2022-08-15) | No — listed only |
| Screen Shot 2022-08-15 at 9.03.26 PM.png (2022-08-15) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2022-03-26 | Trinh Le | Section "TO" shows the dealer name + the dealer company; thinks they are the same value — "Please check again." |
| 2022-03-30 | Ken Nguyen | Confirms the invoice shows dealer name + dealer company; asks Eric whether to keep both or remove one, and which. |
| 2022-04-01 | Ken Nguyen | "@Trinh Le please remove dealer company from the rendering of the invoices" |
| 2022-04-05 | Ken Nguyen | Asks Trinh Le for news on the task. |
| 2022-08-03 | Eric Lindquist | "This looks fine. the *Name is what will appear in the invoice" |
| 2022-08-08 | Vinh Le - QC | "this U.S is passed" |
| 2022-08-11 | Eric Lindquist | "This still seems to be the same ?" |
| 2022-08-15 | Ken Nguyen | Says it appears fixed on production (attaches screenshots) and asks Eric for a screenshot. |
| 2022-08-15 | Eric Lindquist | Posts screenshot(s): "oto cremazie - just now". |
| 2022-09-15 | Ken Nguyen | "this issue will be fixed on invoices created after the date it was released. invoices created before already has that info stamped on them so we cannot modify those." Asks to report if it still happens on new invoices. |
| 2022-09-15 | Eric Lindquist | "ok good to go" |

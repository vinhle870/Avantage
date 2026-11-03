# AP-2374 — Status Change email notification: Add notify email and client email

**Spec ID:** AP-2374
**Source:** Jira [AP-2374](https://garantieavantageplus.atlassian.net/browse/AP-2374) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Ken Nguyen
**Created:** 2025-11-19 · **Last updated:** 2026-01-07
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description (Given/When/Then — no separate acceptance-criteria field), 4 comments and 3 attachments.
**Parent:** None
**Fix version:** 3.6.0 — used as the run folder. **Sprint:** None.
**Linked issues:** Relates to AP-2382 *"[AP-2374] - Can't receive the email after submit change status form with email checkbox as checked"* (Bug, Done) · Relates to AP-2392 *"[AP-2374] - Missing message text in the received email "The claim ID 48618 has been updated to status {{STATUS}}""* (Bug, Done).

> Faithful transcription of AP-2374 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> ## Given
>
> The admin user is logged in the admin area
>
> A claim is created
>
> ### When
>
> The user clicks on change status
>
> *[image: image-20251120-024123.png]*
>
> ### Then
>
> 1. A checkbox ‘Notify by email’ is available in the form
> 2. ‘Recipient email(s) - separate by commas for multiple recipient’
>    1. The field is populated with the claim’s **notify_email** field and the warranty contract’s client email field separated by comma
>
> *[image: image-20251120-024433.png]*
>
> ### When
>
> The form is submitted
>
> And the ‘notify by email’ checkbox is selected
>
> ### Then
>
> A notification email is sent to the list of *‘Recipient email(s) - separate by commas for multiple recipient’*
>
> Message:
>
> | The claim ID 48618 has been updated to status {{STATUS}} |
> |---|
>
> Attachments:
>
> - The attachment files from the claim’s attachments
> - A PDF of the claim details page

## Acceptance criteria (verbatim)

The ticket has no separate acceptance-criteria field (`customfield_10150` is empty). The
Given/When/Then text in the description above is the acceptance criteria:

- **AC 1** — When the user clicks on change status, a checkbox ‘Notify by email’ is available in the form.
- **AC 2** — ‘Recipient email(s) - separate by commas for multiple recipient’: the field is populated with the claim’s **notify_email** field and the warranty contract’s client email field separated by comma.
- **AC 3** — When the form is submitted and the ‘notify by email’ checkbox is selected, a notification email is sent to the list of ‘Recipient email(s) - separate by commas for multiple recipient’.
- **AC 4** — Message: "The claim ID 48618 has been updated to status {{STATUS}}".
- **AC 5** — Attachments: the attachment files from the claim’s attachments; a PDF of the claim details page.

(The AC numbering is added by the pipeline for reference; the wording is the ticket’s.)

## Attachments

| File | Added | Read? |
|---|---|---|
| image-20251120-024123.png | 2025-11-19, Ken Nguyen — embedded under "When the user clicks on change status" | No — listed only |
| image-20251120-024433.png | 2025-11-19, Ken Nguyen — embedded under the recipient-field "Then" | No — listed only |
| image-20260107-175918.png | 2026-01-07, Vinh Le - QC — attached to the latest comment (screenshot of the received email) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2025-11-19 | Ken Nguyen | Asks Minh Lưu to work on this ticket next. |
| 2025-12-17 | Vinh Le - QC | Points Ken Nguyen to bug AP-2382 for review. |
| 2025-12-18 | Ken Nguyen | Struck-through text: ~~"actually I updated the ACs to work with “Authorized” status only"~~; then: "I’ve fixed the issue now,it should work for all statuses" — "can you test with that status and with multiple emails see if it works?" |
| 2026-01-07 | Vinh Le - QC | Says the missing message text "The claim ID 48618 has been updated to status {{STATUS}}" is still happening on STAGE, and that the email content is incorrect — it "should only be “The claim ID 48618 has been updated to status {{STATUS}}” instead of the content as screenshot"; asks Ken to confirm (screenshot image-20260107-175918.png). No reply in the ticket. |

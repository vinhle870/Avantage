# AP-2434 — Admin API: create warranty notes

**Spec ID:** AP-2434
**Source:** Jira [AP-2434](https://garantieavantageplus.atlassian.net/browse/AP-2434) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-07-27 · **Last updated:** 2026-08-10
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description (Given/When/Then), 2 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** No sprint. Fix version `5.0.0` (released 2026-08-12) — used as the run folder.
**Linked issues:** Clones AP-2371 — Admin API: upload claim attachment (Story, Done).

> Faithful transcription of AP-2434 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> ### Given
>
> The admin API user has an API key created
>
> ### When
>
> The user calls a POST request to **/api/admin/warranty/-notes with the api key** in the Authorization Bearer header
>
> with the following payload as a form multipart data
>
> | **key** | **type** | **description** |
> |---|---|---|
> | warranty_id | string | the ID of the warranty |
> | title | string | Title of the note |
> | description | string | Description of the note |
> | is_public | bool | true or false |
> | file_content | string | Text field containing description of the note. Need to allow HTML with more than 255 characters |
>
> ### Then
>
> The note is created and displayed in the admin area

## Acceptance criteria (verbatim)

The Given / When / Then block above is the only acceptance criterion in the ticket. No separate acceptance-criteria field is filled.

> Then: "The note is created and displayed in the admin area"

## Attachments

| File | Read? |
|---|---|
| None | — |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-07-27 | Ken Nguyen | Asks Minh Lưu to work on this ticket next. |
| 2026-08-08 | Vinh Le - QC | Says the QA is working on it today, mentioning Ken Nguyen. |

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08 · **Previous capture:** 2026-11-01

The description and the Given/When/Then are unchanged, word for word. Status is still **QC**, assignee still Vinh Le - QC. Two comments were added, both by the QA account, so neither answers a question (the QA account is in `not_developers`):

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-05 | Vinh Le - QC | QA result FAIL on Dev, 3/8 passed; lists bugs AP-2547, AP-2548, AP-2549 and asks Ken Nguyen Q-007 and Q-001 (comment 19473). |
| 2026-11-08 | Vinh Le - QC | "QA questions — screenshots": repeats Q-007 with a marked screenshot of the note card and says Q-001's screenshot comes at the next test run. |

Three links were added: AP-2434 *relates to* AP-2547, AP-2548 and AP-2549 (all Bug, Backlog). No earlier statement is replaced.

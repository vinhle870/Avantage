# AP-2487 — Earning assignments parameter: Add warranty start date range and Make Coverage Code multiple choices

**Spec ID:** AP-2487
**Source:** Jira [AP-2487](https://garantieavantageplus.atlassian.net/browse/AP-2487) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Ken Nguyen
**Created:** 2026-10-05 · **Last updated:** 2026-10-08
**Captured on:** 2026-10-12 by stlc-ticket-pipeline from the description, acceptance criteria (`customfield_10150`), 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None in the ticket — run folder `5.2.0` used by the pipeline (same release folder as the sibling earning-assignment tickets AP-2474, AP-2475 and AP-2476).
**Linked issues:** None.

> Faithful transcription of AP-2487 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

As an admin, I can add warranty start date range in the earning assignment parameters

## Original requirement text

> As an admin, I can add warranty start date range in the earning assignment parameters

## Acceptance criteria (verbatim)

> ## Given
>
> The admin user is on the admin area
>
> ### When
>
> The user fills out the  earning assignment parameter add/edit form
>
> ### Then
>
> The user can enter a warranty start date from and to after the “Sale date To” field
>
> - Start date from (optional)
>   - Date field
> - Start date To (optional)
>   - Date field
>
> The fields are also available in the datagrid as “Start date”
>
> The user can select multiple Coverage Codes

## Attachments

None.

## Comments

None.

> **Pipeline note (2026-10-12):** The AP-2476 run on 2026-10-11 observed on staging that the
> parameter dialog already shows "Start date from/To" fields and a multi-select Coverage Code
> (element id `coverageCodes`). Those were recorded there as outside AP-2476 and untested — they
> are the scope of this ticket.

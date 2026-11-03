# AP-2474 — Earning Assignment

**Spec ID:** AP-2474
**Source:** Jira [AP-2474](https://garantieavantageplus.atlassian.net/browse/AP-2474) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-09-22 · **Last updated:** 2026-09-30
**Captured on:** 2026-10-04 by stlc-ticket-pipeline from the description, acceptance criteria (`customfield_10150`), 0 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None in the ticket — run folder `5.2.0` chosen by the pipeline (same release folder as the sibling tickets AP-2471 Earning Curves and AP-2473 Earning Sets).
**Development:** 3 repositories linked (Bitbucket Cloud); deployed to **Staging** on 2026-10-01.

> Faithful transcription of AP-2474 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

As an admin user, I can create an earning assignment

## Original requirement text

> As an admin user, I can create an earning assignment

## Acceptance criteria (verbatim)

> ### Given
>
> The admin user is in the admin area
>
> #### When
>
> The user opens the menu
>
> #### Then
>
> The “Risk Management” section is available containing “Earning Assignments” menu item
>
> #### When
>
> The user clicks on Earning Assignments
>
> #### Then
>
> The earning assignments page opens containing the following components
>
> ##### Navigation component
>
> Title: Earning Assignments
>
> Nav Items:
>
> - Create New
>
> ##### Datagrid
>
> A datagrid containing the list of Earning Assignments created with the following columns
>
> - Description
> - Earning Set
> - Dealer Group
> - Is Enabled?
> - Actions
>   - View → Redirects user to the assignment details page
>
> #### When
>
> The user clicks on “Create New”
>
> #### Then
>
> A new modal window opens with the Edit Form containing the following field
>
> - Description
>   - Text
> - Earning Set
>   - Select box
>   - Options: List of Earning Sets
> - Dealer Groups
>   - Select box
>   - Options: List of Dealer Groups
> - Is Enabled?
>   - Yes/No
> - Save
>
> #### When
>
> The form is submitted
>
> #### Then
>
> The user is redirected to the Earning Assignment details page containing the following components
>
> - Navigation component
>   - Title: “Earning Assignment {{description}}”
>   - Nav items:
>     - Edit
>     - Add Parameter
> - Datagrid Component of parameters
>   - Condition
>   - Coverage Code
>   - Sale Date / {{Sale date from}} - {{Sale date to}}
>   - Coverage odometer / {{Coverage odometer from}} - {{Coverage odometer to}}
>   - Model Year Age From
>     {{Model Year Age from}} - {{Model Year Age to}}
>   - Make
>   - Lag Interval
>   - Earning Group
>   - Actions
>     - trash can icon (Unnassign) / When clicked, a modal opens to confirm “Are you sure to delete this record?” before deletion
>
> #### When
>
> The user clicks on “Add Parameter“
>
> #### Then
>
> The Parameter form opens in a modal containing the following fields
>
> - Condition
>   - Select box
>   - Options
>     - New
>     - Used
> - Coverage Code
>   - Select box
>   - List of warranty programs in the system
> - Sale Date from
>   - date picker
> - Sale Date to
>   - date picker
> - Coverage odometer from
>   - numeric text field
>   - default: 0
> - Coverage odometer to
>   - numeric text field
>   - default: 9999999
> - Model Year Age From
>   - numeric text field
>   - default: -1
> - Model Year Age to
>   - numeric text field
>   - default: 99
> - Make
>   - Select box
>   - List of vehicle brands in the system
> - Lag Interval
>   - Select box
>   - Options
>     - 0
>     - 6
>     - 12
> - Earning Group
>   - Select box
>   - List of earning groups in the system
> - Submit
>
> #### When
>
> The form is submitted, then the parameter is created and available in the Earning Assignment parameter datagrid
>

## Attachments

| File | Read? |
|---|---|
| None | — |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket. |

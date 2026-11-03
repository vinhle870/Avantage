# AP-2472 — Earning Groups Management

**Spec ID:** AP-2472
**Source:** Jira [AP-2472](https://garantieavantageplus.atlassian.net/browse/AP-2472) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-09-22 · **Last updated:** 2026-09-25
**Captured on:** 2026-10-03 by stlc-ticket-pipeline from the description, acceptance criteria (`customfield_10150`), 3 comments and 0 attachments.
**Parent:** None
**Sprint / fix version:** None in the ticket — run folder `5.2.0` chosen by the QA.
**Related:** AP-2471 — Admin: Earning Curve management (earning curves are what a group contains).

> Faithful transcription of AP-2472 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

As an admin user, I can create earning groups so I can group the earnings together

## Original requirement text

> As an admin user, I can create earning groups so I can group the earnings together

## Acceptance criteria (verbatim)

Transcribed from Jira wiki markup; heading levels and list nesting are kept.

**Given**

The admin user is in the admin area

**When**

The user opens the menu

**Then**

The “Risk Management” section is available containing “Earning Groups” menu item

**When**

The user clicks on Earning Groups

**Then**

The earning groups page opens containing the following components

*Navigation component*

Title: Earning Groups

Nav Items:

1. Create New

*Datagrid*

A datagrid containing the list of Earning Groups created with the following columns

1. Name
2. Earning curves
   List of assigned earning curves with odometer range
3. Default Earning curve type
4. Is Enabled?
5. Actions
   1. View → Redirects user to the group details page

**When**

The user clicks on “Create New”

**Then**

A new modal window opens with the Edit Form containing the following field

1. Name
   1. Text
2. Default Earning Method
   1. Select box
   2. Options:
      1. Pro-Rata (Default)
      2. Rule of 78
      3. Reverse rule of 78

**When**

The form is submitted

**Then**

The group is created and the user is redirected to the Earning group details page containing the following components

1. Navigation component
   1. Title: “Earning Group {name}”
   2. Nav items:
      1. Edit
2. Form to assign earning curve containing the following fields
   1. Earning Curve
      1. Select box containing the list earning curves
   2. Submit button
   When form is submitted, the earning curve is added to the group and is displayed in datagrid below
3. Datagrid Component of assigned earning curve
   1. Name
   2. Term month
   3. Coverage odometer
      {Coverage odometer from} - {Coverage odometer to}
   4. Earning curve type
   5. Is Enabled?
   6. Actions
      1. trash can icon (Unnassign)
      When clicked, a modal opens to confirm “Are you sure to delete this record?” before deletion

## Attachments

| File | Read? |
|---|---|
| None | — |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-09-22 | Ken Nguyen | Tells Minh Lưu the ticket is ready for development. |
| 2026-09-23 | Minh Lưu | Asks whether one earning curve can belong to several earning groups at once, or only one at a time. |
| 2026-09-23 | Ken Nguyen | Answers yes: one earning curve can belong to multiple groups. |

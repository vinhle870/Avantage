# AP-2441 — Admin: Manage user permissions from a User Details Page

**Spec ID:** AP-2441
**Source:** Jira [AP-2441](https://garantieavantageplus.atlassian.net/browse/AP-2441) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QA**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-08-17 · **Last updated:** 2026-08-24
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 2 comments and 3 attachments.
**Parent:** None
**Delivery state at capture:** 2 pull requests **MERGED** (Bitbucket Cloud, Jira development panel, last updated 2026-08-27); 1 deployment to **Staging**, status DEPLOYED, 2026-08-20.
**Sprint / fix version:** none — run folder `no-sprint`.
**Status note:** the AP status "QA" has no canonical equivalent in the tracker adapter's vocabulary map (only "QC" maps to `ready_for_qa`), so this run is design-only (stops after s3b).

> Faithful transcription of AP-2441 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

> As an admin user, I can perform dealer/user modifications from a User Details Page

(This is the whole of the ticket's Description field. It is written as a user story without a "so that" clause.)

## Original requirement text

> As an admin user, I can perform dealer/user modifications from a User Details Page

## Acceptance criteria (verbatim)

From the Jira acceptance-criteria field. Headings, list items, line breaks and the
bold/upper-case item kept as written; the two embedded images are named in brackets.

> ### When the admin user is on the Dealer User Details Page
> [image: image-20260817-141147.png]
>
> ### Then the user can perform the same actions as the Dealer Details > Users management page
> [image: image-20260817-141357.png]
>
> On the user details page, the same actions can be done for a User > Dealer standpoint, than for a Dealer>User standpoint
>
> - Autoshield
> - Deal your rate
> - Edit Permissions
> - **REMOVE EDIT USER BUTTON**
> - Unlink
>
> Please note that the edit action is not to edit the user (Because we are already on the user page).
>
> When the user clicks on the table row, the user is redirected to the dealer details page

## Attachments

| File | Read? |
|---|---|
| image-20260817-141147.png (Ken Nguyen, 2026-08-17, embedded under the "When" heading of the acceptance criteria) | Yes — viewed. Admin Portal page titled **"User Melissa Bety"** with an **"Edit user"** button at the top right of the page header. A "User details:" panel shows Email `mbety@autoquebec.com`, First name `Melissa`, Last name `Bety`. A "Dealers:" table has columns **Dealer ID · Name · Email · Phone · Group** and one row (`2533` · AutoQuebec Occasion Levis · dzizka@autoquebec.com · 418-838-9257 · Groupe Auto Quebec). The table has **no Actions column** — this is the page before the change |
| image-20260817-141357.png (Ken Nguyen, 2026-08-17, embedded under the "Then" heading) | Yes — viewed. Admin Portal page **"Dealer AutoQuebec Occasion Levis > Users"**, tabs Details · **Users** · Program eligibility · Customer portal · Financing Options, a **"Link user"** button at the top right. The users table has columns **Name · Email · Roles · Actions**; Roles are green badges (e.g. Quotes, Payments, Claims, Insurance, Account Owner, View pricing, Window Sticker, Sales Contract, User management, Receive invoice notifications, Receive claims notifications). The **Actions** column (outlined in magenta) holds five icon buttons per row, left to right: a plug icon (dark), a dollar-in-a-box icon (dark), a person-with-lock icon (**red**), a pencil icon (dark), and a crossed-link icon (dark). The icons carry no visible text label |
| image-20260823-162728.png (Vinh Le - QC, 2026-08-23, embedded in the QA comment) | Yes — viewed. Browser at `v2staging.garantieavantageplus.ca/admin/dealer/1510/users`: page **"Dealer Vinh le 2 > Users"**, one user row "Vinh le2 Vinh Le2" (`vinhle8702@gmail.com`) with the same five action icons; hovering the pencil icon shows the tooltip **"Edit user"**, and a red box and arrow point at it |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-08-23 | Vinh Le - QC | Tells Ken Nguyen and Minh Lưu that "The Edit User button is not removed yet. Please help double check", with the screenshot of the Dealer > Users page above. |
| 2026-08-24 | Ken Nguyen | Replies: "The button is only removed on the User > Dealers page, not the Dealer > Users page. this is working as expected". |

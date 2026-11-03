# AP-2448 — Admin user can see all Permaplate contracts

**Spec ID:** AP-2448
**Source:** Jira story [AP-2448](https://garantieavantageplus.atlassian.net/browse/AP-2448) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Vinh Le - QC
**Created:** 2026-08-31 · **Last updated:** 2026-09-01
**Captured on:** 2026-09-06 from the Jira description, the Given/When/Then acceptance-criteria field, 1 attachment and 1 comment.
**Attachments:** `Screenshot 2026-08-31 at 9.57.18 PM.png`
**Delivery state at capture:** 2 repositories touched; no merged pull request recorded at capture time.

> Faithful transcription of AP-2448 for the STLC pipeline. Part of the **Permaplate** feature set.
> This is the admin-side counterpart of AP-2443 (the dealer-side list).

---

## User story

As an **admin user**, I want to see every Permaplate contract created anywhere in the
system, so that I can look up any dealer's contract and inspect both the signed document
and the money billed against it.

## Original requirement text (Jira description)

> As an admin user, I can see all permaplate contracts created in the system

## Acceptance criteria (verbatim, Given/When/Then field)

### The menu and the index page

**Given** the admin user is logged in to the admin area
**When** the user opens the menu
**Then** there is a menu item *Permaplate* under Contracts.

**When** the user clicks on CONTRACTS > *Permaplate*
**Then** the user lands on the Permaplate Contract Index page, containing:

- Navigation component — Title: *"Permaplate Contracts"*
- Datagrid of all Permaplate contracts, with columns:

| Column | Contains |
|---|---|
| Client | client name, email and phone number |
| Dealer | dealer company name and email |
| Vehicle | vehicle make, model and year, and the VIN |
| Program | the Permaplate contract term and the components selected |
| Actions | a button to view the contract details page, with an eye icon |

### The contract details page

**When** the user clicks on the view button
**Then** a contract details page is shown containing:
- the contract PDF in an iframe
- a datagrid of all the invoices created for the contract

## Comments

Ken Nguyen (2026-08-31): assignment note to the developer. No requirement content.

## Out of scope

None stated.

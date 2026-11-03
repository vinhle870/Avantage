# AP-2443 — Permaplate contract list on the dealer page

**Spec ID:** AP-2443
**Source:** Jira story [AP-2443](https://garantieavantageplus.atlassian.net/browse/AP-2443) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Vinh Le - QC
**Created:** 2026-08-19 · **Last updated:** 2026-09-01
**Captured on:** 2026-09-06 from the Jira description and the Given/When/Then acceptance-criteria field. No attachments, no comments.
**Delivery state at capture:** 1 pull request **MERGED**.

> Faithful transcription of AP-2443 for the STLC pipeline. Part of the **Permaplate**
> feature set (AP-2443 · AP-2444 · AP-2445 · AP-2446 · AP-2447 · AP-2448 · AP-2455 · AP-2456).

---

## User story

As a **dealer user**, I want to see the Permaplate contracts that were created under my
dealer, so that I can find a client's contract and print it without asking the
administrator for a copy.

## Original requirement text (Jira description)

> As a dealer user, I can see the permaplate contract that was created under my dealer

## Acceptance criteria (verbatim, Given/When/Then field)

**Given** the dealer user is logged in to the dealer area
**When** the dealer opens the menu under "Contracts"
**Then** the user can see the following menu items:
- Permaplate

**When** the user clicks on Permaplate
**Then** the user lands on the Permaplate index page.

The page contains a navigation component with the following items:
- Title: *Permaplate contracts*

The page contains a datagrid component with all the dealer's Permaplate contracts.

- **IF** the user permission is *account owner*, then allow all contracts of the current
  dealer to be listed. **Else**, only display the contracts that belong to the user who
  created the quote.

The datagrid has the following columns:
- VIN
- Client name
- Client phone
- Contract cost price
- Actions → Download: a "Download contract PDF" button with the PDF icon

## Out of scope

None stated.

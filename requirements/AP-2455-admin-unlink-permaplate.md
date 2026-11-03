# AP-2455 — Admin user can unlink a Permaplate product from a dealer

**Spec ID:** AP-2455
**Source:** Jira story [AP-2455](https://garantieavantageplus.atlassian.net/browse/AP-2455) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Ken Nguyen
**Created:** 2026-09-01 · **Last updated:** 2026-09-02
**Captured on:** 2026-09-06 from the Jira description and the Given/When/Then acceptance-criteria field. No attachments, no comments.
**Delivery state at capture:** 1 pull request **MERGED**.

> Faithful transcription of AP-2455 for the STLC pipeline. Part of the **Permaplate** feature set.
> This is the mirror of AP-2447, which creates the link this story removes.

---

## User story

As an **admin user**, I want to unlink a Permaplate product from a dealer, so that the
product stops appearing when that dealer creates a quote.

## Original requirement text (Jira description)

> As an admin user, I can unlink a permaplate product to a dealer so it doesn't show when
> the dealer creates a quote

## Acceptance criteria (verbatim, Given/When/Then field)

**Given** the admin user is logged in to the admin area
**When** the user is on the Dealer > Permaplate products page and the linked Permaplate
product datagrid is not empty
**Then** the user sees an *unlink* button.

**When** the user clicks on the button
**Then** a modal window opens to confirm:
- Title: *"Unlink a permaplate product"*
- Content: *"Please confirm that you want to unlink dealer {{company name}} to the
  permaplate {{permaplate product title}}"*
- *"Continue"* button

**When** the form is submitted
**Then**:
- A success message appears on the page and the product is removed from the datagrid.
- When the dealer creates a Permaplate quote, the product will not show in the form.

## Out of scope

None stated.

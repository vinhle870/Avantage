# AP-2447 — Admin can assign Permaplate products to a dealer

**Spec ID:** AP-2447
**Source:** Jira story [AP-2447](https://garantieavantageplus.atlassian.net/browse/AP-2447) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Vinh Le - QC
**Created:** 2026-08-28 · **Last updated:** 2026-09-01
**Captured on:** 2026-09-06 from the Jira description, the Given/When/Then acceptance-criteria field and 1 comment. No attachments.
**Delivery state at capture:** 1 pull request **MERGED**; deployment environment **Staging — DEPLOYED** on 2026-09-01.

> Faithful transcription of AP-2447 for the STLC pipeline. Part of the **Permaplate** feature set.
> AP-2455 is the mirror story that removes a link created here.

---

## User story

As an **admin user**, I want to decide which Permaplate products a given dealer is allowed
to sell, so that a dealer only ever quotes products their agreement actually covers.

## Original requirement text (Jira description)

> As an admin user, I can decide which contract is allowed to a dealer

## Acceptance criteria (verbatim, Given/When/Then field)

### The new tab

**Given** an admin user is in the admin area
**When** the user is on the Dealer details page
**Then** a new tab is available on the page: **Permaplate Products**, containing:
- Navigation component
  - Title: *Eligible Permaplate products*
  - Nav buttons: *Link a product*
- A datagrid of all linked Permaplate products (same datagrid as the Permaplate index page)

### Linking a product

**When** the user clicks on *Link a product*
**Then** a modal window opens to select a Permaplate product:
- Title: *Link a permaplate product to dealer {{Dealer company name}}*
- Fields: a select box of all the Permaplate products
- Save button

### The downstream effect

**When** the product is added to the dealer
**Then** it is available on the dealer portal Permaplate quote page to be selected.

**If** the dealer does not have any Permaplate product linked
**Then** the Permaplate button is not available on the dealer portal quote page.

## Comments

Ken Nguyen (2026-08-28): assignment note to the developer. No requirement content.

## Out of scope

None stated.

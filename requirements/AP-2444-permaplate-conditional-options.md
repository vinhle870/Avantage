# AP-2444 — Permaplate: dealer can select conditional options

**Spec ID:** AP-2444
**Source:** Jira story [AP-2444](https://garantieavantageplus.atlassian.net/browse/AP-2444) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Vinh Le - QC
**Created:** 2026-08-26 · **Last updated:** 2026-09-01
**Captured on:** 2026-09-06 from the Jira description, the Given/When/Then acceptance-criteria field, 1 attachment and 1 comment.
**Attachments:** `image-20260826-173530.png`
**Delivery state at capture:** 1 pull request **MERGED**; deployment environment **Staging — DEPLOYED** on 2026-08-28.

> Faithful transcription of AP-2444 for the STLC pipeline. Part of the **Permaplate** feature set.

---

## User story

As a **dealer**, I want the *Extra care* option to become available when the *Paint*
option is selected, and to be able to opt out of it if I decide not to take it, so that
the quote only offers add-ons that are actually valid for what the client is buying.

## Original requirement text (Jira description)

> As a dealer, I can get 'Extra care' option if the Paint option is selected and also
> opt=out of that option if I decide to not take it

## Acceptance criteria (verbatim, Given/When/Then field)

### Admin side — declaring the parent relationship

**Given** the admin user has access to the admin area
**When** the user is editing a Permaplate option
**Then** the user can select another option from the same term as its parent.

A new field *Parent* is available:
- label: Parent
- type: a select field with all the options where the term matches the current option

### Dealer side — the conditional behaviour

**Given** the dealer user has access to the dealer area
**When** the user is editing a Permaplate quote
**Then**:
- If a field has a parent, it will be shown as a child of its parent.
- The field is disabled by default and only enabled if the parent is selected.
- **When** the parent field is selected → all the child fields are enabled, selected by
  default, and can be individually de-selected.
- **When** the parent field is de-selected → all the child fields are deselected and disabled.

## Comments

Ken Nguyen (2026-08-26): assignment note to the developer. No requirement content.

## Out of scope

None stated.

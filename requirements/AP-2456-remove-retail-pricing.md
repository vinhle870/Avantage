# AP-2456 — Remove retail pricing from Permaplate contracts and invoices

**Spec ID:** AP-2456
**Source:** Jira story [AP-2456](https://garantieavantageplus.atlassian.net/browse/AP-2456) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Ken Nguyen
**Created:** 2026-09-02 · **Last updated:** 2026-09-04
**Captured on:** 2026-09-06 from the Given/When/Then acceptance-criteria field and 1 comment.
**Delivery state at capture:** 1 pull request **MERGED**.

> Faithful transcription of AP-2456 for the STLC pipeline. Part of the **Permaplate** feature set.
> **The Jira description field is empty.** Everything below comes from the acceptance-criteria
> field; nothing has been added to fill the gap.

---

## User story

Not stated on the ticket. Inferred from the acceptance criteria for traceability only:
as **Avantage Plus**, we want the retail (consumer-facing) price removed from every
Permaplate surface a dealer sees, so that only the dealer's own cost price is shown and the
retail margin is not disclosed.

**This inference is not a requirement.** It is flagged as a testability risk in the
requirements analysis.

## Original requirement text (Jira description)

*(empty — the ticket has no description)*

## Acceptance criteria (verbatim, Given/When/Then field)

**When a quote is created:**
- remove the retail pricing on the Permaplate quote form
- remove the retail pricing on the quote details Permaplate section

**When the Permaplate PDF is generated**, remove the retail pricing and taxes displayed on the PDF.

**When the invoice is created**, remove the retail pricing in the invoice description.

**When an admin edits a Permaplate option**, remove the retail pricing field in the form and datagrid.

## Comments

Ken Nguyen (2026-09-02): assignment note to the developer. No requirement content.

## Out of scope

None stated.

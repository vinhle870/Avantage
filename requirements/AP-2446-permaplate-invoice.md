# AP-2446 — Permaplate invoice

**Spec ID:** AP-2446
**Source:** Jira story [AP-2446](https://garantieavantageplus.atlassian.net/browse/AP-2446) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee (QC):** Ken Nguyen
**Created:** 2026-08-26 · **Last updated:** 2026-09-02
**Captured on:** 2026-09-06 from the Jira description and the Given/When/Then acceptance-criteria field. No attachments, no comments.
**Delivery state at capture:** 1 pull request **MERGED**.

> Faithful transcription of AP-2446 for the STLC pipeline. Part of the **Permaplate** feature set.

---

## User story

As a **dealer**, I want an invoice to be raised automatically when I create a Permaplate
contract, so that I can pay for the product through the same billing screen I already use
for warranty contracts.

## Original requirement text (Jira description)

> Create a permaplate invoice so that the dealers can pay

## Acceptance criteria (verbatim, Given/When/Then field)

**Given** a dealer is in the admin and has a Permaplate quote created
**When** the dealer creates the Permaplate contract
**Then**:
- A Permaplate invoice is created.
- An alert message is displayed to notify the user an invoice is created (same way as a
  warranty contract invoice).
- The user can see the invoice in the invoices index page and can pay it the same way
  they can pay with a warranty.

> **Scope clarification — 2026-09-07, from the QA.** The phrase *"a dealer is in the
> admin"* in the Given above is the ticket's own wording and is misleading. **This story
> is Dealer Portal only.** The quote, the contract, the invoice and the payment are all
> created and viewed by the dealer in the Dealer Portal:
>
> | Surface | Route | Portal |
> |---|---|---|
> | The Permaplate quote | `/quote/{id}/permaplate` | Dealer |
> | Creating the contract | `/quote/{id}/permaplate-create-contract` | Dealer |
> | The invoices index | `/invoice` | Dealer |
> | Paying the invoice | `/invoice/select-payment` | Dealer |
>
> "In the admin" here means *inside the dealer's own signed-in area*, not the Admin
> Portal. Nothing in this story is performed in the Admin Portal.
>
> The Admin Portal appears in this feature set only for a **prerequisite owned by
> AP-2447** — an administrator must link a Permaplate product to the dealer at
> `/admin/dealer/{id}/permaplate/link` before the dealer's Permaplate button exists at
> all. That is AP-2447's requirement, not this one, and it is not part of AP-2446's
> acceptance criteria.
>
> The admin-side view of a Permaplate contract and its invoices belongs to **AP-2448**.
> Any observation made there is evidence about AP-2448's page, not about this story.

## Out of scope

- **The Admin Portal.** Every criterion above is satisfied and verified in the Dealer
  Portal. See the scope clarification above.

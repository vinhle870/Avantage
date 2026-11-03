# AP-2499 — Add GAP/creditors insurance to a quote: embed the financing form in the add modal

**Spec ID:** AP-2499
**Source:** Jira [AP-2499](https://garantieavantageplus.atlassian.net/browse/AP-2499) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-16 · **Last updated:** 2026-10-28
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 2 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2499 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> When a dealer adds **GAP insurance** or **creditors insurance** to a quote that has no financing, the add modal can only render a dead-end alert today:
>
> - *"Please add a financing in order to get a GAP quote."*
> - *"Please add a financing in order to get a creditors quote."*
>
> Instead, the modal should render the **financing form** at the top, followed by the GAP/creditors insurance quote form and its results. The financing form is prefilled from the quote's existing `QuoteFinancing` when one is present, and submitting it saves the financing and continues to the insurance quote in the same modal. This removes the current close-modal → add financing → reopen-product detour and keeps the dealer in a single flow.
>
> [image: image-20261016-161139.png]

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

**Financing form replaces the alert**

- **Given** a quote with no financing,
- **When** the dealer opens add-GAP or add-creditors insurance,
- **Then** the modal shows the financing form and not the "Please add a financing…" alert.

[image: image-20261016-161228.png]

**Financing form is always present above the insurance form**

- **Given** the add-GAP/creditors modal is open (financing present or absent, Chubb or Humania dealer),
- **Then** the financing form renders first and the insurance form/results render below it, and the financing form does not disappear when a financing already exists.

**Prefill from the existing financing**

- **Given** the quote already has a `QuoteFinancing`,
- **When** the modal opens,
- **Then** each field shows the stored value — type, base amount, residual, payment frequency, term months, interest rate, financing company, applicant date of birth — and any field with no stored value falls back to its normal empty/placeholder state.

**Submit persists and continues in the modal**

- **Given** the dealer fills or corrects the financing form,
- **When** it is submitted,
- **Then** the financing is persisted on the quote, the modal refreshes to the insurance step backed by the saved financing, and the page does not navigate away.

**Insurance results render below the form**

- **Given** a saved financing,
- **When** the dealer submits the GAP/creditors insurance form and the quote is returned,
- **Then** the result renders below the form in the same modal; on failure an error is shown without discarding the entered values.

**Validation**

- **Given** missing or invalid financing fields (type, base amount, payment frequency, term, interest rate, financing company),
- **When** submitted,
- **Then** field-level errors are shown and no partial financing or insurance row is persisted.

## Attachments

| File | Read? |
|---|---|
| image-20261016-161139.png (Nicolas-Eric Tain, 2026-10-16) | Yes — viewed. Quote #6432… on the dealer portal (Test Dealer 2) for a Cadillac ATS 2022. A modal shows only the red alert "Please add a financing in order to get a GAP quote." Behind it, the Financing card shows the piggy-bank empty state "You have not added financing details yet" with a *DYR Rates* button; the Summary of products card lists Extended warranty, Roadside Protection, Gap Insurance and Creditors insurance, all "- None Selected -" — the current dead end the story removes |
| image-20261016-161228.png (Nicolas-Eric Tain, 2026-10-16) | Yes — viewed. The "Summary of products" card (Cadillac ATS 2022, delivery date Oct 16, 2026, CA$0.00). Arrows point to the **+** buttons on the *Gap Insurance* and *Creditors insurance* rows. Under Creditors insurance the notice reads "Please make sure you create the GAP insurance first to include the GAP premium amount in the creditors insurance." Esthetic protection (Antirouille – Rust, Antirouille – Sound, cost CA$80.00$) and Subtotal CA$0.00 are also shown |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket |

## Development links

The ticket's development panel shows 1 Bitbucket Cloud pull request in state MERGED (last updated 2026-10-26).

> **Note from capture (2026-11-01):** the description says the financing form is shown
> "when a dealer adds GAP insurance or creditors insurance to a quote that has no
> financing", while the second acceptance criterion requires the financing form to render
> "financing present or absent". Both are transcribed as written; the analysis decides
> how they combine. The second criterion names "Chubb or Humania dealer" — the dealer
> accounts available for each provider are a test-data question for the analysis.

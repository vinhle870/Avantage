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

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08T04:48:48-05:00 (2026-11-08T09:48:48Z) · **Previous capture:** 2026-11-01 · **Re-read:** 2026-11-15T09:35Z by stlc-ticket-pipeline (stlc-worker, `--from analyze --until analyze`)

The description and the six acceptance criteria (customfield_10150) are unchanged — re-read
word for word against the transcription above. The status is still **QC** and the
assignee is still Vinh Le - QC. Nothing in the ticket's own text replaces an earlier
statement. What changed:

**New comments** (rows to add to the Comments table above):

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-01 (19:27 -05:00) | Vinh Le - QC | QA result — FAIL (2026-11-02) on Dev (v2dev): 5 PASS · 5 FAIL · 3 BLOCKED of 13; bugs AP-2526, AP-2527, AP-2528; Q-011 and Q-007 raised |
| 2026-11-08 | Vinh Le - QC | "QA questions — screenshots · 2026-11-08": the open questions Q-003 to Q-014 re-posted to Nicolas-Eric Tain, each with a highlighted screenshot; Q-001, Q-002, Q-009 and Q-015 without a screenshot |

Both comments are by the QA account (`not_developers`), so neither answers a question.
No comment by the reporter or a developer has been added.

**New attachments:** 11 QA screenshots `AP-2499_Q-0NN_highlighted.png` (2026-11-08), one per
question in the 2026-11-08 comment — QA evidence, not requirement text.

**New links:** relates to AP-2526, AP-2527 and AP-2528 (the bugs filed by the 2026-11-02 run,
all Backlog).

# AP-2497 — Add extended warranty to a quote: capture missing vehicle fields instead of a dead end

**Spec ID:** AP-2497
**Source:** Jira [AP-2497](https://garantieavantageplus.atlassian.net/browse/AP-2497) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-15 · **Last updated:** 2026-10-28
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 0 comments and 2 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2497 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> When a dealer adds an extended warranty to a quote, show a short form for the vehicle fields the eligibility engine consume. The form is **prefilled with the values stored on the quote's vehicle**, so the dealer only corrects what is missing or wrong. The eligible-program results render below the form. Submitting updates the vehicle and re-runs eligibility on the same screen — the fields are always in reach and the dealer never hits the dead-end
> *"There are no eligible program for the vehicle. Please contact us for more information."* or has to go back to inventory to adjust the vehicle.
>
> [image: image-20261016-131331.png]

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

**The form is visible in the extended-warranty flow**

- **Given** a quote with a vehicle,
- **When** the dealer opens the add-extended-warranty flow,
- **Then** the required-field form is shown, and the eligible-program results or the "no program" notice render below it.

[image: image-20261016-131221.png]

**Form exposes only the required fields**

- **Given** the form is displayed,
- **Then** it contains only these required fields, each editable: **Year**, **Kilometers**, **Make**, **Model**, **Fuel type**, and **Vehicle type** (the properties in "Required fields" above), and it does not expose the full vehicle editor.

**Form is prefilled from the existing vehicle**

- **Given** the quote's vehicle already has stored values,
- **When** the dealer opens the form,
- **Then** each of the six required fields shows the vehicle's existing value — Year from `Vehicle::$year`, Kilometers from `Vehicle::$kilometers`, Make from `Vehicle::$make`, Model from `Vehicle::$model`, Fuel type from `Vehicle::$fuelType`, Vehicle type from `Vehicle::$type`.

**Submit persists and re-evaluates in place**

- **Given** the dealer corrects or confirms the prefilled values,
- **When** the form is submitted,
- **Then** the values persist on the quote's `Vehicle` (a reload shows them), eligibility is re-evaluated, and the results below the form refresh in the same view/modal without a full page navigation; the form remains visible with the saved values.

**Validation**

- **Given** empty, non-numeric, or negative year/kilometers,
- **When** the form is submitted,
- **Then** a field-level error is shown and no partial update is persisted.

## Attachments

| File | Read? |
|---|---|
| image-20261016-131221.png (Nicolas-Eric Tain, 2026-10-16) | Yes — viewed. The quote's "Summary of products" card for a Cadillac ATS 2022 (delivery date Oct 16, 2026). A red arrow points to the **+** button on the *Extended warranty* row ("- None Selected -"). Other rows: Roadside Protection, Gap Insurance, Creditors insurance (with the notice "Please make sure you create the GAP insurance first to include the GAP premium amount in the creditors insurance."), Esthetic protection; Subtotal CA$0.00 |
| image-20261016-131331.png (Nicolas-Eric Tain, 2026-10-16) | Yes — viewed. Quote #6432… on the dealer portal (Test Dealer 2) after clicking that **+** button: a modal shows only the yellow notice "There are no eligible program for the vehicle. Please contact us for more information." The Vehicle card behind it shows *Cadillac ATS 2022* with empty VIN, "Mileage: km" (no value) and empty Designation — the current dead end the story removes |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| — | — | No comments on the ticket |

## Development links

The ticket's development panel lists 4 Bitbucket Cloud repository links (last updated 2026-10-22). Their PR state is not readable through the CLI.

> **Note from capture (2026-11-01):** the second acceptance criterion refers to "the
> properties in "Required fields" above", but neither the description nor the acceptance
> criteria contain a section named "Required fields". The six fields are listed by name in
> the criterion itself.

# AP-2533 — Update quote form UI

**Spec ID:** AP-2533
**Source:** Jira [AP-2533](https://garantieavantageplus.atlassian.net/browse/AP-2533) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-11-02 · **Last updated:** 2026-11-03 (22:30 UTC-5, i.e. 2026-11-04 03:30 UTC)
**Captured on:** 2026-11-07 by stlc-ticket-pipeline from the description, acceptance criteria, 1 comment and 4 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2533 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> Update the create quote form UI and fix the decode action when providing a vin number.
>
> Current behavior when decoding a vin number:
>
> When clicking on “Decoder”
>
> [image: image-20261102-192940.png]
>
> The output return an empty card
>
> [image: image-20261102-193230.png]

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150). The field holds
two Given/When/Then blocks, each followed by an image.

- **Given** the dealer enter the NIV
- **When** the dealer clicks on “Decoder”
- **Then** the form with the vehicle information (visible and hidden input) and does not create the quote.

[image: image-20261102-142427.png]

- **Given** the dealer is create a new quote
- **When** the form is rendering
- **Then** the type drop-down is positioned before the quote name with the label “Vehicle type”.

[image: image-20261102-192534.png]

## Attachments

All four were downloaded read-only through the tracker REST API on 2026-11-07 and viewed.

| File | Read? |
|---|---|
| image-20261102-192940.png (description, "When clicking on “Decoder”") | Yes — viewed. The current "Create a quote" form: Quote name (empty); VIN with helper text "Enter the VIN and click search to pre-fill the vehicle info", value `5YJ3E1EA0LF734293`; the red **Décoder** button is outlined; Brand* "Choose", Model* "Choose", Year* empty; **Save** |
| image-20261102-193230.png (description, "The output return an empty card") | Yes — viewed. After the click: page heading "Create a quote" with the "Auto Passenger" type menu at the top right (dealer "Test Dealer 2"), and an empty white card where the form was — no fields, no buttons |
| image-20261102-142427.png (first acceptance criterion) | Yes — viewed. The expected result: the same form with Quote name empty, VIN `5YJ3E1EA0LF734293`, and an outlined box around **Brand* = TESLA**, **Model* = Model 3**, **Year* = 2020**; Save below. "Auto Passenger" type menu still at the top right |
| image-20261102-192534.png (second acceptance criterion) | Yes — viewed. The empty form (dealer "Test Dealer 2") with an arrow drawn from the "Auto Passenger" type menu at the top right to the "Quote name" label — the menu moves to sit before the Quote name field |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-02 | Ken Nguyen | Hands the story to Minh Lưu ("here's a story for you, thanks!") — no requirement content |

## Development links

The ticket's development panel shows 1 Bitbucket Cloud pull request, state **MERGED**
(last updated 2026-11-03 22:25 UTC-5), and 1 successful deployment to the environment
**"develop"** on 2026-11-04 03:28 UTC.

> **Note from capture (2026-11-07):** the third line of the first acceptance criterion has
> no verb ("Then the form with the vehicle information (visible and hidden input) and does
> not create the quote"). The only statement of what the form should hold is the attached
> image image-20261102-142427.png, described above. The ticket says "Decoder" and "NIV";
> the screenshots show the button labelled "Décoder" and the field labelled "VIN" in the
> English interface. Nothing is added or interpreted here — the analysis raises these as
> open questions.

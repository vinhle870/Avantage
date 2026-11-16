# AP-2428 — Dealer Permaplate Contract

**Spec ID:** AP-2428
**Source:** Jira story [AP-2428](https://garantieavantageplus.atlassian.net/browse/AP-2428) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Vinh Le - QC
**Created:** 2026-07-10 · **Last updated:** 2026-08-18
**Fix version:** 5.0.0 (released 2026-08-12) · **Sprint:** none
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 6 comments and 7 attachments.
**Parent:** None

> Faithful transcription of AP-2428 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them. Part of the
> **Permaplate** feature set (see also AP-2443 · AP-2444 · AP-2445 · AP-2446 · AP-2447 ·
> AP-2448 · AP-2455 · AP-2456).

---

## User story

Not stated in the ticket.

## Original requirement text

The description is written as Given/When/Then and is transcribed in full below as the
acceptance criteria. `[attachment]` marks where an inline image sits in the description.

## Acceptance criteria (verbatim)

> ## Given
>
> The dealer user is logged in the dealer area
>
> ### When
>
> The dealer is on the quote page
>
> And a permaplate quote exists
>
> ### Then
>
> There is a button to create the contract
>
> [attachment]
>
> ### When the user clicks on "create contract"
>
> ### Then
>
> A form is available to confirm the selection and other details
>
> ### Vehicle information
>
> #### Make
> - Text field with the vehicle's make prefilled
>
> #### Model
> - Text field with the vehicle's model prefilled
>
> #### Year
> - Text field with the vehicle's model prefilled
>
> **VIN**
> - Text field with the vehicle's VIN prefilled
>
> **Odometer at delivery**
> - Text field with the vehicle's km prefilled
>
> **Delivery date**
> - Text field with the vehicle's delivery date prefilled
>
> ### Owner information
>
> Information about the client pre-filled
>
> #### Last name
> - Text field
>
> #### First name
> - Text field
>
> #### Other name on file
> - Text field with client's company prefilled
>
> #### Address
> - Text field
>
> #### City
> - Text field
>
> #### Province
> - Dropdown of provinces
>
> #### Postal code
> - Text field
>
> #### Phone (res)
> - Text field with client's phone1
>
> #### Phone (cell)
> - Text field with client's phone2
>
> #### Email
> - Text field
>
> ### Program Summary
>
> - Program Term
>   - text display (no input)
> - Start Date (Same as delivery date)
>   - text display (no input)
> - End date
>   - text display (no input)
> - Selected protection products
>   - Table with all the selected options
> - Cost Price
> - Retails Price
>   - Subtotal
>   - Taxes (calculated based on the client's province)
>   - Grand Total
>
> ## [Generate Contract] submit button
>
> ### When the user submits the form
>
> ### Then
>
> The user is redirected to the quote details page
>
> A download button is available to download the PDF
>
> [attachment]
>
> Example of PDF:
>
> [attachment] [attachment] @Minh Lưu Please generate the PDF using HTMLtoPDF library instead of Zend_PDF

## Attachments

| File | Read? |
|---|---|
| image-20260710-175925.png (2026-07-10, inline in description) | No — listed only |
| image-20260710-181328.png (2026-07-10, inline in description) | No — listed only |
| NewAvantage_Front_Page_French - 0526 - French.pdf (2026-07-10, example PDF) | No — listed only |
| NewAvantage_Front_Page 0526 - english.pdf (2026-07-10, example PDF) | No — listed only |
| image-20260806-125944.png (2026-08-06, Ken Nguyen comment) | No — listed only |
| image-20260814-153936.png (2026-08-14, Vinh Le - QC comment) | No — listed only |
| image-20260818-165628.png (2026-08-18, Vinh Le - QC comment) | No — listed only |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-07-16 | Ken Nguyen | Asks Minh Lưu to work on this ticket next. |
| 2026-08-06 | Ken Nguyen | Asks for contract options to be stored in a dedicated `permaplate_contract_option` table with all values, and cost, retail and taxes stored on the contract, so later admin changes do not cascade into existing contracts. |
| 2026-08-10 | Ken Nguyen | Has sent PR corrections to Minh Lưu; asks whether they can be completed today or tomorrow for the next release. |
| 2026-08-11 | Minh Lưu | Has updated the PR. |
| 2026-08-14 | Vinh Le - QC | Reports that no Permaplate contract is shown and asks whether a configuration is needed (screenshot attached). |
| 2026-08-18 | Vinh Le - QC | Reports that submitting Generate Contract shows an error (screenshot attached). No reply from the developer or reporter is recorded. |

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08T04:50 (UTC-05:00) · **Previous capture:** 2026-11-01

The description and acceptance criteria are unchanged. No new comment comes from the
reporter or the developer. The three comments added since the capture were all posted by
the QA account, and none of them answers a question:

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-01 | Vinh Le - QC | Comment 19434: posts Blocking questions Q-001 to Q-003 (Year prefill, tax rules, AP-2456 retail conflict). |
| 2026-11-01 | Vinh Le - QC | Comment 19447: QA result FAIL on Dev (9 of 15 passed). Lists AP-2512 to AP-2515 and repeats Q-001 to Q-003. |
| 2026-11-08 | Vinh Le - QC | Comment 19538: re-posts Q-001 to Q-010 with a screenshot for each. Says the questions are "unchanged". |

**Knowledge lookup — 2026-11-15 (no Jira change).** The open questions were checked
against Jira Story and Task tickets (stlc-requirements-analyst Step 3c). Nothing was
posted to AP-2428. The results are recorded in
`qa-artifacts/1-requirements-analysis/AP-2428_requirements-analysis.md`, under *Open
Questions* and *Knowledge lookup — 2026-11-15*. Two later stories bear on this ticket's
acceptance criteria. They are quoted here without changing the transcription above:

- **AP-2456** (Story, Done, reporter Ken Nguyen, created 2026-09-02). Summary: "Remove
  retail pricing on permaplate contracts and invoices". Acceptance criterion: "When
  Permaplate PDF is generated, remove the retail pricing and taxes displayed on the PDF".
  It names the PDF, not the contract form. This conflicts with the "Retails Price /
  Subtotal / Taxes / Grand Total" lines of the Program Summary above; the AC above still
  stands until the author answers (Q-003, Blocking + Open).
- **AP-2506** (Story, status QA, created 2026-10-29, with its own open question).
  Acceptance criterion: "The “Program Summary” shows: Program Term / Start Date / End
  date / Selected protection products / Total". This also conflicts with the lines above
  (Q-003). The description says "The “Generate Contract” action for Esthetic protection on
  the dealer quote should match Esthetic Protection: open a dedicated page (no modal)" and
  "Contract creation, invoice, financing, and PDF behaviour stay unchanged" (Q-004).

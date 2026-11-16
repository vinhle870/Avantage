# AP-2498 — Roadside protection: keep the existing vehicle form visible and add VIN + Year

**Spec ID:** AP-2498
**Source:** Jira [AP-2498](https://garantieavantageplus.atlassian.net/browse/AP-2498) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Vinh Le - QC
**Created:** 2026-10-16 · **Last updated:** 2026-10-28
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 1 comment and 2 attachments.
**Parent:** None
**Sprint / fix version:** None / None — run folder `no-sprint`

> Faithful transcription of AP-2498 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> When a dealer adds Road Side Protection (RSP) to a quote and the AutoShield pricing call returns no products, the screen shows the blocking alert *"In order to get a quote for road side protection, please specify the make and model of the vehicle." *plus a Make/Model form. When products **are** returned, that form is not rendered at all, so the dealer cannot correct the vehicle from the RSP screen.
>
> Keep the **existing** `QuoteAutoShieldMakeModelType` form (today Make + Model + Continue) and add the missing inputs — a required **VIN** and an optional **Year** — so the form collects VIN, Year, Make and Model in one place. Render that form above the product results in both states, prefill it from the quote, and on submit persist the values on the RSP program and re-run the AutoShield quote in place. The dealer should never have to go back and forth.
>
> A submit that carries only the VIN still attempts the quote. When no products are returned, the screen shows the existing message *"In order to get a quote for road side protection, please specify the make and model of the vehicle."* below the form rather than a bare error.
>
> [image: image-20261016-160938.png]

## Acceptance criteria (verbatim)

Transcribed from the ticket's Acceptance Criteria field (customfield_10150).

**The existing form is always visible in the RSP flow**

- **Given** a quote with a vehicle, programs eligible or not, make/model known or empty,
- **When** the dealer opens the add-roadside-protection flow,
- **Then** the `QuoteAutoShieldMakeModelType` form is rendered, and the eligible-product results or
the "no products" notice render below it.

[image: image-20261016-161021.png]



**Form stays visible when make/model are already set**

- **Given** the quote's RSP program already has make/model stored and products are returned,
- **When** the dealer opens the flow,
- **Then** the form is still rendered with the stored values and the product list appears below it — the form does not disappear because make/model are complete.

**The form is the existing form plus VIN and Year; VIN is the only required field**

- **Given** the form is displayed,
- **Then** it contains exactly the existing fields — `vehicleMake`, `vehicleModel`, `continue` — plus a plain VIN text input and an editable Year input; it does not expose the full vehicle editor, client info or contract fields, and no new form type has been introduced.
- **Given** the rendered form,
- **Then** the VIN input is required and Year/Make/Model carry no `required` constraint, and there is no VIN lookup/decode button and no `vinlookup` behaviour attached to the VIN field.

**Make and Model options come from the AutoShield catalogue**

- **Given** the RSP form is rendered,
- **When** the Make and Model dropdowns are populated,
- **Then** the Make options are the makes returned by `VehicleMakeModelService::getMakes($quote)`, and the Model options are the models returned by `VehicleMakeModelService::getModelsForMake($make, $quote)` for the selected make.

**Prefill from existing data**

- **Given** the quote's vehicle/program already has stored values,
- **When** the dealer opens the form,
- **Then** VIN/Year show the stored RSP values (or the vehicle's VIN/year), and Make/Model show the stored RSP values; any field without a resolvable value falls back to its normal empty/placeholder state.

**Submit persists on the RSP program and re-evaluates in place**

- **Given** the dealer corrects or confirms the values,
- **When** the form is submitted,
- **Then** VIN/Year/Make/Model persist on the `RoadSideProtectionProgram`.

**A VIN-only submit is accepted and saved**

- **Given** the dealer submits the form with a VIN and no Year, Make or Model,
- **When** the form is submitted,
- **Then** the submit is accepted, the VIN is saved on the `RoadSideProtectionProgram`, and the form is shown again with the VIN filled in.
- **And** the quote runs with the VIN alone; if no products come back, the notice *"In order to get a quote for road side protection, please specify the make and model of the*
*vehicle."* appears below the form, and the missing Year/Make/Model must not produce an error screen.

**Results update without hiding the form**

- **Given** the submitted values newly qualify (or no longer qualify) for products,
- **When** the form is submitted,
- **Then** the product list below the form updates accordingly and the form is still shown.

## Attachments

| File | Read? |
|---|---|
| image-20261016-160938.png (Nicolas-Eric Tain, 2026-10-16) | Yes — viewed. Dealer portal, quote #6432 (Test Dealer 2), Vehicle card *Cadillac ATS 2022* with empty VIN, "Mileage: km" and empty Designation. A modal shows the red alert "In order to get a quote for road side protection, please specify the make and model of the vehicle." above a form with **Make\*** (Choose), **Model\*** (Choose) and a red **Continue** button — no VIN or Year field, and Make/Model are both marked required (\*). This is today's no-products state |
| image-20261016-161021.png (Nicolas-Eric Tain, 2026-10-16) | Yes — viewed. The quote's "Summary of products" card for a Cadillac ATS 2022 (delivery date Oct 16, 2026, CA$0.00). A black arrow points to the highlighted **+** button on the *Roadside Protection* row ("- None Selected -"), the entry point of the add-roadside-protection flow. Other rows: Extended warranty, Gap Insurance, Creditors insurance (with the GAP notice), Esthetic protection; Subtotal CA$0.00 |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-23 | Nicolas-Eric Tain | Tells Minh Lưu he is taking over the ticket. No requirement content |

## Development links

The ticket's development panel shows 1 Bitbucket Cloud pull request in state MERGED (last updated 2026-10-26). Its content is not readable through the CLI.

> **Note from capture (2026-11-01):** the screenshot of today's no-products state shows
> Make and Model marked required (\*). The acceptance criteria require that Year/Make/Model
> carry no `required` constraint in the new form, and that only VIN is required.

---

## Ticket changes since capture — 2026-11-15

**Ticket last updated:** 2026-11-08T04:48:35-05:00 · **Previous capture:** 2026-11-01 by stlc-ticket-pipeline

Re-read on 2026-11-15 with `--raw` (description and the Acceptance Criteria field
`customfield_10150`). **The summary, the description and the acceptance criteria are
unchanged** — every sentence transcribed above still stands; nothing is replaced. Status
is still QC, assignee Vinh Le - QC. The changes are QA's own activity only; no developer
or product comment has been added, so no open question is answered on the ticket itself.

New comments:

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-11-01 | Vinh Le - QC | QA result comment 19453 (FAIL, 2 of 14, Dev) posted by the s7 stage of the 2026-11-01 run. No requirement content |
| 2026-11-08 | Vinh Le - QC | Comment 19534 "QA questions — screenshots · 2026-11-08": the open questions Q-001–Q-013, each with a highlighted screenshot of what Dev shows today (Q-010 without one). Asks for answers; no requirement content |

New attachments (2026-11-08, Vinh Le - QC): `AP-2498_Q-001_highlighted.png` … `AP-2498_Q-013_highlighted.png`
(12 files, no Q-010) — QA's question screenshots, not requirement material. New links:
*Relates* → AP-2523, AP-2524, AP-2525 (the bugs filed by the 2026-11-01 run).

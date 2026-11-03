# AP-2377 — Customer portal changes

**Spec ID:** AP-2377
**Source:** Jira [AP-2377](https://garantieavantageplus.atlassian.net/browse/AP-2377) — Project *AP*, type Story, priority Medium, status **QC**
**Reporter:** Ken Nguyen · **Assignee:** Ken Nguyen
**Created:** 2025-12-04 · **Last updated:** 2026-01-07
**Captured on:** 2026-11-01 by stlc-ticket-pipeline from the description, acceptance criteria, 2 comments and 3 attachments.
**Parent:** None
**Fix version:** 3.6.0 · **Sprint:** None · **Labels:** None · **Components:** None
**Linked issues:** is blocked by AP-2394 "[AP-2311]Customer Claim is getting error" (Bug, Highest, Done — last updated 2026-02-11)

> Faithful transcription of AP-2377 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them.

---

## User story

Not stated in the ticket.

## Original requirement text

> See the old customer portal for reference
> https://v2staging.garantieavantageplus.ca/customer/273/quote-request
> (link text: https://v2staging.garantieavantageplus.ca/customer/273/quote-request/client)
>
> **Given**
>
> The customer is on the customer portal https://v2staging.garantieavantageplus.ca/customer/avantage-plus/buy
>
> **When**
>
> The customer enters the vehicle information
>
> **Then**
>
> The following fields are added at the end of the form:
>
> [embedded image: Screenshot 2025-12-04 at 3.28.22 PM.png — see Attachments, A1]
>
> The ‘continue’ button label is ‘Continue’ (french: ‘Continuer’)
>
> **When the vehicle form is submitted**
>
> **Then**
>
> The user is redirected to the ‘Client Info' step (switch order with 'coverage’ step)
>
> The client info page contains the checkbox to opt for FORM L25
>
> [embedded image: image-20251204-203131.png — see Attachments, A2]
>
> The continue button label is  ‘Get rates now’ (French: ‘Demander un devis’)
>
> **When**
>
> The customer clicks ‘Get rates now’
>
> **Then**
>
> The user is redirected to the coverage step
>
> **When**
>
> The user is at the summary page
>
> **Then**
>
> The page lists info about the surcharges selected as YES
>
> [embedded image: image-20251204-205908.png — see Attachments, A3]
>
> **When**
>
> the warranty is paid and contract is created
>
> **Then**
>
> The surcharges that were selected is displayed in the admin panel warranty details page

## Acceptance criteria (verbatim)

The ticket has no separate acceptance-criteria field. The Given / When / Then blocks in the
description above are its acceptance criteria. Listed in order, word for word:

1. **Given** the customer is on the customer portal `/customer/avantage-plus/buy`, **When** the customer enters the vehicle information, **Then** "The following fields are added at the end of the form:" [image A1] — "The ‘continue’ button label is ‘Continue’ (french: ‘Continuer’)".
2. **When** the vehicle form is submitted, **Then** "The user is redirected to the ‘Client Info' step (switch order with 'coverage’ step)".
3. (same Then) "The client info page contains the checkbox to opt for FORM L25" [image A2] — "The continue button label is  ‘Get rates now’ (French: ‘Demander un devis’)".
4. **When** the customer clicks ‘Get rates now’, **Then** "The user is redirected to the coverage step".
5. **When** the user is at the summary page, **Then** "The page lists info about the surcharges selected as YES" [image A3].
6. **When** the warranty is paid and contract is created, **Then** "The surcharges that were selected is displayed in the admin panel warranty details page".

## Attachments

All three are images embedded in the description by Ken Nguyen on 2025-12-04. Each was
downloaded and looked at on 2026-11-01, because acceptance criteria 1, 3 and 5 point at
them instead of stating their content in words. Below is **only the text visible in each
image**, transcribed word for word; nothing is inferred from layout or styling except
where a line says so.

| # | File | Placed under | Read? |
|---|---|---|---|
| A1 | Screenshot 2025-12-04 at 3.28.22 PM.png | AC 1 — "The following fields are added at the end of the form:" | Yes — visible text transcribed below |
| A2 | image-20251204-203131.png | AC 3 — "The client info page contains the checkbox to opt for FORM L25" | Yes — visible text transcribed below |
| A3 | image-20251204-205908.png | AC 5 — "The page lists info about the surcharges selected as YES" | Yes — visible text transcribed below |

**A1 — visible text, top to bottom** (English form, sample values shown in the inputs):

- Field label `Market Value*` — input value `1000000.00`
- Section heading `Current manufacturer/extended warranty`
- Help text: `If your vehicle is still under manufacturer, or extended warranty coverage please include the contract number.` / `This warranty will begin after the current warranty has expired, or if the current warranty has already expired, this warranty will begin thirty (30) days from the date of purchase.`
- Field label `Warranty Number` — input value `2131331`
- Field label `Warranty end date` — input value `2025-12-18`
- Field label `Warranty mileage limit` — input value `100000`

No label below `Market Value*` carries an asterisk in the image. No French version of these
labels is shown.

**A2 — visible text, top to bottom** (English form, sample values shown in the inputs):

- `City*` — `Laval` · `Province*` (drop-down) — `Ontario` · `Postal code*` — `H7L0C4` · `Phone1*` — `5146906330` · `Phone2` — empty · `Email*` — `ken@nekken.ca`
- An unticked checkbox, outlined by a magenta highlight box, with the text: `I confirm that I have read FORM-L25, at the request of Les Produits Avantage Plus Inc., all in accordance with the requirements of the Act respecting the protection of personal information in the private sector.*` — the word `FORM-L25` is shown in green, in the same colour as the portal's links.
- Below the highlight: a `Back` link and a green `Continue` button.

The button in the image reads `Continue`; the description's sentence directly under the
image says the label is ‘Get rates now’. No French version of the checkbox text is shown.

**A3 — visible text** (French interface, the summary step):

- Page title `Acheter une garantie en-ligne`; an `English` language link top right.
- Step bar, left to right: `Info du véhicule` · `Choisir la couverture` · `Info Client` · `Sommaire` (step 4, current).
- `Couverture pour la` / `Veuillez confirmer les détails ci-dessous avant de procéder au paiement`
- `Identification du véhicule` (`Éditer`): `Modèle` 2020 TESLA Model 3 Plus · `Kilométrage` 10000 km · `Valeur marchande` 0,00 $CA · `NIV` 5YJ3E1EA0LF734293
- `Information du propriétaire` (`Éditer`): `Nom` Trung hau Nguyen · `Addresse` 2280 de la Rousserolle Laval, Ontario H7L0C4 · `Téléphone 1` 5146906330 · `Téléphone 2` - · `Courriel` ken@nekken.ca
- `Description du programme` (`Éditer`): `Programme` CVE / CVE 60m/0km / BEV
- Outlined by a magenta highlight box: `Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI`
- `Terme de la garantie` 60 mois - Kilométrage illimité · `Composantes couvertes` BEV · `Déductible (par visite)` 100,00 $CA · `Couverture maximum (par visite/cummulative)` 10 000,00 $CA/0,00 $CA · `Date de début` mercredi 17 décembre 2025 · `Date de fin` mardi 17 décembre 2030
- `Résumé total`: `Prix de la couverture` 4 400,00 $CA · `Sous-total` 4 400,00 $CA · `TVH` 572,00 $CA · `Total` 4 972,00 $CA
- Unticked checkbox `J'accepte les termes et conditions*` and a button `Continuer au paiement`.

The step bar in A3 still shows the order Vehicle → Coverage → Client → Summary, which is the
order AC 2 asks to change.

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2025-12-05 | Ken Nguyen | Tells Minh Lưu he added comments to the PR and asks for a review. |
| 2026-01-07 | Vinh Le - QC | Tells Ken Nguyen that bug AP-2394 is still happening and asks him to check. |

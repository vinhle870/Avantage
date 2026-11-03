# AP-2477 — Simplify /quote/new/edit-vehicle to minimal fields with VIN decoder pre-fill

**Spec ID:** AP-2477
**Source:** Jira [AP-2477](https://garantieavantageplus.atlassian.net/browse/AP-2477) — Project *Avantage Plus (AP)*, type Story, priority Medium, status **QC**
**Reporter:** Nicolas-Eric Tain · **Assignee:** Ken Nguyen
**Created:** 2026-10-02 · **Last updated:** 2026-10-06
**Captured on:** 2026-10-11 by stlc-ticket-pipeline from the description, acceptance criteria (`customfield_10150`, including its Tech approach and Assumptions sections), 4 comments and 1 attachment.
**Parent:** None
**Sprint / fix version:** None in the ticket — run folder `5.2.0` proposed by the pipeline (same release folder as the other October 2026 tickets AP-2471 to AP-2476).
**Linked issues:** None.

> Faithful transcription of AP-2477 for the STLC pipeline. Do not edit the transcribed
> sections; add scope clarifications as dated blockquotes below them. Jira wiki markup
> (`{{code}}`, `h3.`, `#` lists) is kept as written.

---

## User story

As a dealer user, I want the new-quote vehicle form at `/quote/new/edit-vehicle` to show only Quote name, VIN, Brand, Model and Year, with Brand, Model and Year as the only required fields, so that I can create a quote without friction.

## Original requirement text

> As a dealer user, I want the new-quote vehicle form at {{/quote/new/edit-vehicle}} to show only Quote name, VIN, Brand, Model and Year, with Brand, Model and Year as the only required fields, so that I can create a quote without friction.

## Acceptance criteria (verbatim)

> h3. Given
>
> The dealer opens the new-quote vehicle form ({{/quote/new/edit-vehicle}}, route {{quote-edit-vehicle}})
>
> h3. When
>
> The form is rendered
>
> h3. Then
>
> Only these five fields are shown, in this order:
>
> # Quote name — at the top of the form, above the VIN field
> # VIN ({{NIV}})
> # Brand ({{make}})
> # Model ({{model}})
> # Year
>
> Price, Kilometers, Condition, Designation, transmission, engine size and engine size unit, cylinders, fuel type, turbo, 4x4/AWD and the manufacturer-warranty block are no longer shown on this screen. VIN keeps its "Décoder" button for decoder-enabled types ({{TYPE_GROUP_VEHICLE}}; the VIN child carries the {{vinlookup}} class) and stays a plain input for the other type groups (RV, boat, construction).
>
> !image-20261002-213217.png|width=682,alt="image-20261002-213217.png"!
>
> h3. Given
>
> The dealer is on the simplified form for a decoder-enabled type ({{TYPE_GROUP_VEHICLE}}; the VIN child carries the {{vinlookup}} class) and the "Décoder" button is available
>
> h3. When
>
> The dealer enters a VIN and clicks "Décoder"
>
> h3. Then
>
> The VIN lookup runs, the form is re-rendered pre-filled with the decoded vehicle values, and those values are kept and assigned to the {{App\Entity\Vehicle}} attributes — Brand, Model and Year, plus the decoded transmission, engine size, engine size unit, cylinders, fuel type and turbo — so they are stored on the {{vehicle}} row when the quote is saved, even though those extra fields are no longer displayed.
>
> h3. Given
>
> The dealer saves with only Brand, Model and Year filled and leaves Quote name and VIN empty
>
> h3. When
>
> The form is submitted
>
> h3. Then
>
> Only Brand, Model and Year are required; Quote name and VIN are optional. The quote is saved and {{kilometers}}, {{designation}}, {{vehicle_condition}} and {{price}} are stored as {{NULL}} on the {{vehicle}} row (the four columns are nullable).
>
> h3. Given
>
> The dealer submits the form without Brand, Model or Year
>
> h3. When
>
> The form is validated
>
> h3. Then
>
> The form is re-rendered with a validation error and no quote is saved.
>
> h2. Tech approach
>
> # *Active code path.* {{src/app/src/Controller/Quote/EditVehicle.php}} ({{__invoke}}, route {{quote-edit-vehicle}}) builds {{App\Form\VehicleType}} ({{src/app/src/Form/VehicleType.php}}) on an {{App\Entity\Vehicle}}. Rendering runs through {{templates/quote/edit-vehicle.html.twig}} → {{templates/quote/edit-vehicle.ajax.html.twig}} → {{templates/quote/form/edit-vehicle-v2.html.twig}}. Only the last template belongs to this screen; the inventory form ({{src/app/src/Controller/Vehicle/Edit.php}} → {{templates/vehicle/form.html.twig}}) and the piece-protection forms are untouched.
> # *Minimal field set.* Reduce {{edit-vehicle-v2.html.twig}} to the five fields: move {{form_row(form.quote_name, {'required': false})}} to the top ({{EditVehicle::__invoke}} already adds {{quote_name}} as an unmapped {{TextType}} and persists it as {{App\Entity\QuoteName}}, guarding the save with {{if ($name)}}), keep the existing VIN guard and "Décoder" button, then Brand / Model / Year. No other field is rendered.
> # *Keep the hidden children working.* The {{PRE_SUBMIT}} {{updateVIN()}} listener in {{VehicleType}} writes VIN-decoded values through the remaining child names, and {{EditVehicle}} persists them, so the decoder criterion requires rendering those children as hidden inputs with the HTML5 {{required}} attribute removed (a browser refuses to submit an empty {{required}} control). An emptied field submits {{null}}/empty, so {{Vehicle::setKilometers}}, {{Vehicle::setDesignation}} and {{Vehicle::setCondition}} (currently typed {{string}}, and throwing on an unknown value) must accept {{null}}.
> # *Decoder pre-fill and persistence.* {{assets/js/vinlookup.js}} serializes only the VIN input, re-posts it to the form action with {{vehicle[novalidate] = true}}, and replaces the form with the HTML response. {{VehicleType}}'s {{PRE_SUBMIT}} {{updateVIN()}} listener resolves the VIN through {{App\Service\VinDecoder\Decoder::mapToManufacturerVehicle()}} and merges the decoded values into the form data; {{EditVehicle}} then persists the same {{App\Entity\Vehicle}}. Two existing guards shape the behaviour: {{updateVIN()}} runs only when {{make}} is empty (a VIN decoded after Brand was chosen is ignored), and it returns without changes when the decoded result has no make or no fuel type. Keep the decoded values on the displayed Brand/Model/Year fields and on the hidden children so the save assigns them to the vehicle attributes; dropping the hidden children would lose the decoded transmission, engine size and unit, cylinders, fuel type and turbo.
> # *Validation group.* Do not change {{VehicleType}}'s default validation. {{configureOptions}} currently resolves {{validation_groups}} to {{['Default']}} and returns {{false}} when the {{novalidate}} extra data is posted; that short-circuit is required by {{assets/js/vinlookup.js}} so the AJAX returns the re-rendered form instead of redirecting. Add an option to {{VehicleType}} and have the closure return {{false}} for {{novalidate}}, the new minimal group when {{EditVehicle}} sets the option, and {{['Default']}} otherwise. The minimal group carries only {{NotBlank}} on {{year}}, {{make}} and {{model}} plus year's {{@Assert\Expression("this.checkYear()")}}. Keep {{App\Validator\RequireIfIsRv}} (registered in {{Vehicle::loadValidatorMetadata}}) and the manufacturer-warranty {{@Assert\Expression}} constraints out of it, so VIN is optional on this screen. Every other flow keeps {{['Default']}} and its current required fields, so the inventory and piece-protection forms are unchanged.
> # *Nullable columns.* Add a migration in {{src/app/src/Migrations}} making {{vehicle.kilometers}}, {{vehicle.designation}}, {{vehicle.vehicle_condition}} and {{vehicle.price}} {{DEFAULT NULL}}, keeping each column's current type and length ({{kilometers}} {{VARCHAR(15)}}, {{designation}} and {{vehicle_condition}} {{VARCHAR(20)}}, {{price}} {{NUMERIC(10,2)}}), and add {{nullable=true}} to the matching mappings in {{src/app/src/Entity/Vehicle.php}}. The minimal validation group skips the existing {{@Assert\NotBlank}} on {{kilometers}} and {{price}}, so those constraints can stay in {{Default}} for the other forms.
> # *QuoteVehicle price.* {{EditVehicle::__invoke}} copies the vehicle price to {{QuoteVehicle::$price}} ({{$vehicle->setPrice($vehicleVehicle->getPrice())}}), and {{quote_vehicle.price}} is {{NOT NULL}} in {{src/app/src/Entity/QuoteVehicle.php}}. With Price no longer on the form the copy is {{null}} and the flush fails, so make {{quote_vehicle.price}} nullable in the same migration or default the copy to {{0}}. The same copy exists in the {{fromVehicleId}} path of {{src/app/src/Controller/Quote/Client.php}} and needs the same treatment.
> # *Downstream nulls.* Consumers of {{Vehicle::getKilometers()}}, {{getCondition()}}, {{getDesignation()}} and {{getPrice()}} must tolerate {{null}} now, for example {{src/app/src/Entity/ProgramTerm.php}}, {{src/app/src/Entity/QuoteWarranty.php}}, {{src/app/src/Service/Warranty/FieldMapper.php}} and {{src/app/src/Service/WindowStickerPdf.php}} ({{number_format(getPrice())}}). Audit these before release.
> # *Quote name vs decoder.* {{assets/js/vinlookup.js}} serializes only the VIN input and replaces the whole form, so a Quote name typed before clicking "Décoder" is lost. Keep that input outside the replaced fragment, include it in the AJAX payload, or repopulate it from the response.
> # *Save and redirect.* {{EditVehicle::__invoke}} already redirects to {{quote-details}} after the flush. No API change beyond the migration.
>
> h3. Assumptions
>
> * Only Brand, Model and Year are required on this screen; Quote name and VIN are optional. The screenshot's asterisks on Quote name and NIV are the current template's markers, not the required set — only Brand, Model and Year should render as required.
> * The simplification stays scoped to the {{quote-edit-vehicle}} screen: editing a vehicle from the quote details page keeps the current full form ({{vehicles-edit}} → {{templates/vehicle/form.html.twig}}), and the inventory and piece-protection vehicle forms are unchanged.
> * "Decoder available" remains type-based through the {{vinlookup}} class set by {{buildVehicle()}}; the button stays visible with an empty VIN, as today.
> * Making the four {{vehicle}} columns nullable is a schema change that affects every flow reading them; the minimal validation group keeps the other forms' required fields as they are today.
> * {{quote_vehicle.price}} is not in the requested column list but is required for the save to succeed (tech item 7).
> * The decoder criterion fixes the previously open decision: the non-displayed {{VehicleType}} children stay as hidden inputs so VIN-decoded extras are assigned to the vehicle attributes and persisted. Dropping them would contradict the decoder acceptance criterion.

## Attachments

| File | Read? |
|---|---|
| image-20261002-213217.png | Yes — mockup of the target "Créer une cotation" form (dealer portal, type "Auto Passenger"): Quote name*, NIV* with help text "Entrez le VIN et cliquez sur rechercher pour pré-remplir les infos du véhicule" and a red **Décoder** button, then Marque* / Modèle* (selects showing "Choisir") / Année* on one row, and a **Sauvegarder** button. The Assumptions section says the asterisks on Quote name and NIV are not the required set. |

## Comments

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-02 | Ken Nguyen | Asks the reporter to remove Kilometers, Condition, Price and Designation from the form. |
| 2026-10-02 | Nicolas-Eric Tain | Introduces themself to the developer (Minh Lưu) and offers to answer questions. |
| 2026-10-03 | Minh Lưu | Asks for the `VINAUDIT_DECODER_API_BASE_URL` environment variable for testing. |
| 2026-10-05 | Nicolas-Eric Tain | Shares the value through a one-time secret link (link and passphrase deliberately not transcribed). |

---

## Ticket changes since capture — 2026-11-01

**Ticket last updated:** 2026-10-28T15:47:53-04:00 · **Previous capture:** 2026-10-11

The description and acceptance criteria are unchanged. Two comments were added after the capture. Neither one replaces an earlier statement. The second one explains why this ticket is tested on Dev (v2dev) and not on staging.

| Date | Author | Summary (one line) |
|---|---|---|
| 2026-10-11 | Vinh Le - QC | QA comment 19385: the build is not on staging, asking for a redeploy (already in the run state) |
| 2026-10-28 | Ken Nguyen | Comment 19430, to the QA: "this is now on v2dev.garantieavantageplus.ca . you can use the same credentials to log in and test" — "the feature is not ready for staging yet." |

# Execution Log — AP-2377: Customer portal changes

**Environment: Dev (v2dev)** — by the user's decision for this run. Staging (v2staging) was not opened.

---

## Execution Summary

**Executed by:** QA Agent — Manual Executor Skill (stage s4 of stlc-ticket-pipeline, worker run)
**Date:** 2026-11-02
**Base URL:** `https://v2dev.garantieavantageplus.ca/` — the "Dev Environment" section of the `env` source (`qa-artifacts/base-test/execute.env.md`)
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800 (one context, AP2377_007, opened narrower — no result depends on it)
**Duration:** 2026-11-02T00:43:42+07:00 → 2026-11-02T00:52:51+07:00
**Run folder:** 3.6.0 (the ticket's fix version)
**Test-case files:** `AP2377_TestCases_001-005.md`, `AP2377_TestCases_006-010.md`, `AP2377_TestCases_011-011.md`
**Entry route used:** `https://v2dev.garantieavantageplus.ca/customer/avantage-plus/buy` — the route the test cases name, with the Dev host in place of the staging host written in their steps.
**Isolation:** every test case except AP2377_004 ran in its own fresh browser context, so no session data from one case could carry into another. AP2377_004 ran in the same context as AP2377_001, straight after it, because AP2377_001 ends in exactly AP2377_004's starting state (vehicle filled, warranty fields empty).

| Metric | Value |
|---|:---:|
| Total test cases | 11 |
| Passed | 7 |
| Failed | 3 |
| Blocked | 1 |
| Skipped | 0 |
| **Pass rate** | **63.6% (7 of 11; no case skipped)** |

**Environment check:** the `env-check` source is `missing` in the knowledge registry, so no smoke test file exists. The caller confirmed that the environment health check had already passed for this run; the first page load of the purchase flow returned the vehicle form with no error.

**Execution Context versus the sources:** the test cases name v2staging; this run used Dev by the user's decision. The vehicle step on Dev also asks for **Email\*** and **Postal code\*** (both required), which the test cases do not mention, and **Market Value** has no asterisk on Dev. Each case filled Email with its own `client.stage.NNN@yopmail.com` and Postal code `H7L0C4` (the client test data's postal code). This decides no expected result.

---

## Result Overview

| TC ID | Title | Priority | Result | Steps Passed | Steps Failed | Screenshot | Comment |
|---|---|:---:|:---:|:---:|:---:|---|---|
| AP2377_001 | The vehicle form ends with a "Current manufacturer/extended warranty" section of three fields and a "Continue" button | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_001-step4-WarrantyFieldsContinueButton_pass.png` | Heading, both help sentences and the three fields sit at the end of the form; the button label is "Continue" |
| AP2377_002 | In French, the vehicle step's button reads "Continuer" and the Client Info button reads "Demander un devis" | Medium | ✅ | 5 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_002-step5-DemanderUnDevisButton_pass.png` | Both French button labels exact; French field and checkbox wording recorded for Q-002 / Q-005 |
| AP2377_003 | Submitting the vehicle form opens the Client Info step, now placed before Coverage in the step bar | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_003-step4-ClientInfoBeforeCoverage_pass.png` | "Continuer" opens /buy/client; step bar is Info du véhicule · Info Client · Choisir la couverture · Sommaire |
| AP2377_004 | Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data | Medium | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step4-Http500PastDateTextMileage_fail.png` | Text "abc" in Warranty mileage limit gives an HTTP 500 error page (reproduced 2 of 2) |
| AP2377_005 | The Client Info step shows the FORM L25 consent checkbox, unticked, and a "Get rates now" button | High | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_005-step4-FormL25CheckboxGetRatesNow_pass.png` | One unticked checkbox under Email with the exact A2 text; button "Get rates now" |
| AP2377_006 | Clicking "Get rates now" with the FORM L25 box ticked opens the Coverage step | High | ✅ | 3 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_006-step3-CoverageStepOpens_pass.png` | Opens /buy/coverage, step 3 "Select Coverage" current, terms listed with prices |
| AP2377_007 | Clicking "Get rates now" with the FORM L25 box unticked causes no error page and loses no client details | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_007-step4-L25RequiredFieldsKept_pass.png` | Box is required: message under it, every client field kept (Q-004 recorded) |
| AP2377_008 | A surcharge answered YES at Coverage is listed on the summary page | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_008-step5-SurchargeLineNoOui_fail.png` | Summary lists the question with "(MSRP: 1500.00)" but not the answer "OUI" shown in A3 |
| AP2377_009 | A surcharge answered NO causes no error on the summary page — whether it is listed is recorded | Medium | ✅ | 4 | 0 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_009-step4-NonQuestionAbsent_pass.png` | No OUI line; question absent, empty "Surcharge" heading remains (Q-007 recorded) |
| AP2377_010 | After a paid purchase, the admin warranty details page shows the surcharge answered YES | High | 🚫 | 0 | 0 | — | Blocked by design: no test payment method; card details never entered |
| AP2377_011 | Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary | High | ❌ | 4 | 1 | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_011-step2-SurchargeOuiLineNoOui_fail.png` | Step 2 fails like AP2377_008 (no "OUI"); after Non the question is gone (step 5 passes) |

> Result icons: ✅ PASS · ❌ FAIL · 🚫 BLOCKED · ⏭️ SKIPPED

---

## Step-by-Step Results

### AP2377_001 — The vehicle form ends with a "Current manufacturer/extended warranty" section of three fields and a "Continue" button — Step Results

Client email used: `client.stage.932@yopmail.com` (the Dev form requires it). Language: English.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/customer/avantage-plus/buy` on Dev; switch to English if needed | The purchase page loads in English on its vehicle step, with no error page; record the URL and title | URL = `https://v2dev.garantieavantageplus.ca/customer/avantage-plus/buy`; page title = "Garantie Avantage Plus"; heading = "Buy a warranty online"; step heading = "Enter the vehicle"; language link shows "Français", so the page was already English | ✅ | The only console error is the header logo image (`/customer/uploads/273?filename=apicon-…png`) returning HTTP 500 — not part of the flow |
| 2 | Fill VIN `5YJ3E1EA0LF734293`, Mileage `10000`, Market Value `45000.00`; record every label above "Market Value" | Each field shows the value typed | Field "VIN (Vehicle Identification Number)\*" value = "5YJ3E1EA0LF734293"; "Current mileage (km)\*" = "10000"; "Email\*" = "client.stage.932@yopmail.com"; "Postal code\*" = "H7L0C4"; "Market Value" = "45000.00" | ✅ | Labels above Market Value: VIN\*, Current mileage (km)\*, Email\*, Postal code\*. Dev asks for a VIN, not Year/Make/Model. "Market Value" has no asterisk and is not required on Dev |
| 3 | Scroll to the bottom of the form | Below Market Value: the heading, both help sentences, then "Warranty Number", "Warranty end date", "Warranty mileage limit" | Heading (h4) = "Current manufacturer/extended warranty"; help text = "If your vehicle is still under manufacturer, or extended warranty coverage please include the contract number." then, on a new line, "This warranty will begin after the current warranty has expired, or if the current warranty has already expired, this warranty will begin thirty (30) days from the date of purchase."; then fields "Warranty Number", "Warranty end date", "Warranty mileage limit", in that order | ✅ | Wording matches attachment A1 word for word. The three fields are optional (no asterisk, not required). "Warranty end date" opens a date picker |
| 4 `[Verification]` | Verify the three fields are the last inputs and read the submit button label | No input follows "Warranty mileage limit"; the button reads exactly "Continue" | Last input before the button = `customer_buy_vehicle[manufacturerWarrantyEndKm]` ("Warranty mileage limit"); button text in the page = "Continue" (displayed in capitals, "CONTINUE", by the page's styling) | ✅ | The label is "Continue"; the capitals come from CSS `text-transform: uppercase`, not from the label |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_001-step4-WarrantyFieldsContinueButton_pass.png` — the whole vehicle form, with the new warranty section at the bottom and the Continue button

### AP2377_002 — In French, the vehicle step's button reads "Continuer" and the Client Info button reads "Demander un devis" — Step Results

Client email used: `client.stage.940@yopmail.com`. Client name: Client Stage 940.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/customer/avantage-plus/buy`; click "Français" | The page shows French text, e.g. "Acheter une garantie en-ligne" | Clicked link "Français" → URL = `/customer/avantage-plus/buy?_locale=fr`; heading = "Acheter une garantie en-ligne"; the language link now reads "English" | ✅ | Opening `?_locale=fr` directly in a new session did not switch the language (seen in AP2377_008); clicking the link does |
| 2 | Fill the vehicle fields and read the warranty section and the button | The button reads exactly "Continuer"; record the French heading, help text and labels for Q-002 | Button = "Continuer". Q-002 recorded: heading = "Garantie du manufacturier/prolongée en cours"; help = "Si vous avez une garantie du manufacturier ou une garantie prolongeée en cours, veuillez indiquer le numéro de contrat." / "Cette garantie prolongée commencera après l'expiration de la garantie en cours. Si la garantie en cours est déjà expirée, la garantie prolongée commencera 30 jours après son achat."; labels = "Numéro de garantie", "Date de fin de garantie", "Limite de kilométrage de garantie". Every input has a label | ✅ | Recorded for the author: the help text spells "prolongeée" (double e). Other French labels: "NIV (Numéro d'identification du véhicule)\*", "Kilométrage actuel (km)\*", "Courriel\*", "Code postal\*", "Valeur marchande" |
| 3 | Click "Continuer" | The Client Info step opens in French, no error page | URL = `/customer/avantage-plus/buy/client`; heading = "Couverture pour la 2020 TESLA Model 3 Standard Range Plus"; text in French | ✅ | The VIN decodes on Dev to "2020 TESLA Model 3 Standard Range Plus" |
| 4 | Fill the client fields and read the checkbox text | Record the French checkbox text for Q-005 | Fields: Prénom = "Client", Nom = "Stage 940", Addresse = "2280 de la Rousserolle", Ville = "Laval", Province = "Québec", Code postal = "H7L0C4" (carried over), Téléphone 1 = "5146906330", Courriel = "client.stage.940@yopmail.com" (carried over). Q-005 recorded: checkbox text = "Je confirme avoir lu FORM-L25, à la demande de Les produits avantage plus inc., le tout conformément aux exigences de la Loi sur la protection des renseignements personnels dans le secteur privé."; "FORM-L25" links to `/fr/pdf-privacy` | ✅ | French labels on this step: Prénom, Nom, Addresse, # apt, Ville, Province, Code postal, Téléphone 1, Téléphone 2, Courriel |
| 5 `[Verification]` | Verify the Client Info submit button label | The button reads exactly "Demander un devis" | Submit button text = "Demander un devis" (no text transform); the other control is the link "Retour" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_002-step5-DemanderUnDevisButton_pass.png` — French Client Info step with the "Demander un devis" button

### AP2377_003 — Submitting the vehicle form opens the Client Info step, now placed before Coverage in the step bar — Step Results

Client email used: `client.stage.939@yopmail.com`. Language: French.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open `/customer/avantage-plus/buy` in French and read the step bar | The step bar is visible; record its labels | Step bar, left to right: "1 Info du véhicule" · "2 Info Client" · "3 Choisir la couverture" · "4 Sommaire" | ✅ | The labels are A3's own words, in the new order |
| 2 | Fill the vehicle fields including Warranty Number `2131331`, end date `2027-12-18`, mileage limit `100000` | Each field shows the value typed | NIV = "5YJ3E1EA0LF734293"; Kilométrage = "10000"; Courriel = "client.stage.939@yopmail.com"; Code postal = "H7L0C4"; Valeur marchande = "45000.00"; Numéro de garantie = "2131331"; Date de fin de garantie = "2027-12-18"; Limite de kilométrage de garantie = "100000" | ✅ | — |
| 3 | Click "Continuer" | A new step loads with no error page; record its URL | URL = `/customer/avantage-plus/buy/client`; HTTP 200 | ✅ | — |
| 4 `[Verification]` | Verify which step is shown and the step-bar order | The client information form, not the coverage choice; the client step comes right after the vehicle step and before coverage | Page shows Prénom\*, Nom\*, Addresse\*, # apt, Ville\*, Province\*, Code postal\*, Téléphone 1\*, Téléphone 2, Courriel\*; step bar = "Info du véhicule" (done, tick) · "Info Client" (current, step 2) · "Choisir la couverture" (3) · "Sommaire" (4) | ✅ | Order swapped exactly as AC 2 asks; no label renamed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_003-step4-ClientInfoBeforeCoverage_pass.png` — French Client Info form with step 2 "Info Client" current, before "Choisir la couverture"

### AP2377_004 — Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data — Step Results

Client email used: `client.stage.932@yopmail.com` (same browser context as AP2377_001, run straight after it). Language: English.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Vehicle step in English with VIN, Mileage, Market Value filled and the three warranty fields empty | The three new fields are empty; the others show the values typed | VIN = "5YJ3E1EA0LF734293"; mileage = "10000"; email = "client.stage.932@yopmail.com"; postal code = "H7L0C4"; Market Value = "45000.00"; Warranty Number = ""; Warranty end date = ""; Warranty mileage limit = "" | ✅ | State left by AP2377_001 step 4 |
| 2 | Click "Continue" | No error page; record the outcome for Q-001 | URL = `/customer/avantage-plus/buy/client` (Client Info step, HTTP 200). Q-001 recorded: with the three warranty fields empty the form moves on with no message | ✅ | The empty warranty fields are accepted |
| 3 | Click "Back"; type "Warranty end date" `2020-01-01` and "Warranty mileage limit" `abc` | Record what each field shows after typing | Back link → `/customer/avantage-plus/buy` with VIN, mileage, email, postal code and Market Value still filled. After typing: "Warranty end date" value = "2020-01-01"; "Warranty mileage limit" value = "abc" (the field is a plain text box and accepts letters) | ✅ | Recorded for Q-001: nothing stops letters being typed in the mileage limit |
| 4 | Click "Continue" | No error page or HTTP 5xx; record the outcome for Q-001 | HTTP status = 500; page = generic error screen, heading "Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." with a link "Aller à l'accueil"; URL stays `/customer/avantage-plus/buy` | ❌ | Isolated in the same session: end date `2020-01-01` alone (mileage limit empty) → accepted, Client Info opens (HTTP 200). Mileage limit `abc` alone (end date `2027-12-18`) → HTTP 500 again. So the non-numeric "Warranty mileage limit" causes it — reproduced 2 of 2. A customer who types anything other than digits there gets an error page instead of a message and cannot continue |
| 5 `[Verification]` | Open the vehicle step again and verify no typed value was lost | VIN, Mileage `10000` and Market Value `45000.00` still hold what was typed | After reopening `/customer/avantage-plus/buy`: VIN = "5YJ3E1EA0LF734293"; mileage = "10000"; email = "client.stage.932@yopmail.com"; postal code = "H7L0C4"; Market Value = "45000.00"; Warranty end date = "" and Warranty mileage limit = "" (the two values from step 3 were not kept) | ✅ | The values from the last successful submit are kept; the two values submitted with the failing request were dropped, which is the effect of the error in step 4, not a separate loss |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step4-Http500PastDateTextMileage_fail.png` — HTTP 500 error page after submitting end date 2020-01-01 and mileage limit "abc"
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step4-Http500TextMileageOnly_fail.png` — the same error page with only the mileage limit "abc" (end date 2027-12-18), the reproduction
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step5-VehicleValuesKept_pass.png` — vehicle step reopened, VIN, mileage and Market Value still filled (final state)

### AP2377_005 — The Client Info step shows the FORM L25 consent checkbox, unticked, and a "Get rates now" button — Step Results

Client email used: `client.stage.933@yopmail.com`. Language: English.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fill the vehicle step (warranty fields empty) and click "Continue" | The Client Info step opens | URL = `/customer/avantage-plus/buy/client`; heading = "Coverage for the 2020 TESLA Model 3 Standard Range Plus"; step bar current = "Client Info" | ✅ | The empty warranty fields did not stop the form, so the fallback values were not needed |
| 2 | Scroll to the bottom of the Client Info form | Below "Email\*" there is one checkbox, unticked | Exactly 1 checkbox on the form, `customer_quote_client[isAgreePolicy]`, placed after the Email field; checked = false | ✅ | The box carries the HTML `required` attribute |
| 3 | Read the checkbox text; click "FORM-L25" | Text reads exactly as A2; record whether FORM-L25 is a link and what it opens | Checkbox text = "I confirm that I have read FORM-L25, at the request of Les Produits Avantage Plus Inc., all in accordance with the requirements of the Act respecting the protection of personal information in the private sector.\*". Q-005 recorded: "FORM-L25" is a link to `/en/pdf-privacy`, opens in a new tab, returns HTTP 200 with a PDF document (content type application/pdf) | ✅ | The PDF tab was closed and the Client Info tab used again |
| 4 `[Verification]` | Verify the label of the Client Info submit button | Reads exactly "Get rates now" | Submit button text = "Get rates now" (no text transform); other control = link "Back" | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_005-step4-FormL25CheckboxGetRatesNow_pass.png` — whole Client Info form: unticked FORM-L25 checkbox under Email, "Get rates now" button

### AP2377_006 — Clicking "Get rates now" with the FORM L25 box ticked opens the Coverage step — Step Results

Client email used: `client.stage.935@yopmail.com`. Client name: Client Stage 935. Language: English.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fill the vehicle step with the full test data (warranty 2131331 / 2027-12-18 / 100000) and click "Continue" | The Client Info step opens | URL = `/customer/avantage-plus/buy/client` | ✅ | — |
| 2 | Fill the client fields and tick the FORM L25 checkbox | Every field shows the value typed; the checkbox is ticked | First name = "Client"; Last name = "Stage 935"; Address1 = "2280 de la Rousserolle"; City = "Laval"; Province = "Québec"; Postal code = "H7L0C4"; Phone1 = "5146906330"; Email = "client.stage.935@yopmail.com"; checkbox checked = true | ✅ | Province list on Dev offers only New Brunswick, Nova Scotia, Ontario, Québec (default New Brunswick) |
| 3 `[Verification]` | Click "Get rates now" and verify the step that opens | No error page; the coverage choice with prices; step bar marks coverage current, third after Vehicle and Client Info; record the URL | URL = `/customer/avantage-plus/buy/coverage`, HTTP 200; heading = "Select base coverage for the 2020 TESLA Model 3 Standard Range Plus"; program card "CVE" / "BEV" with the drop-down "Choose program coverage term\*" listing "24m/Unlimited mileage - 2500.00$", "36m/Unlimited mileage - 2700.00$", "48m/Unlimited mileage - 2900.00$", "60m/Unlimited mileage - 3200.00$"; step bar = Enter the vehicle (done) · Client Info (done) · **3 Select Coverage (current)** · 4 Summary | ✅ | AC 4 proven |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_006-step3-CoverageStepOpens_pass.png` — the coverage step with step 3 current and the CVE / BEV program card

**Exploratory continuation (not part of the result):** in the same context the 60-month term was chosen and "Continue" pressed. A second coverage page `/customer/avantage-plus/buy/coverage-2` asked "Is this vehicle equipped with an Air Suspension system?" (CA$1,500.00, radios Yes / No, No preselected); with Yes the summary `/customer/avantage-plus/buy/summary` named the program "CVE · CVE 60m/0km · BEV". This is how the run found that the test cases' program "CVE 60m/0km" is the 60-month term on Dev (see AP2377_008). Nothing past the summary was touched.

### AP2377_007 — Clicking "Get rates now" with the FORM L25 box unticked causes no error page and loses no client details — Step Results

Client email used: `client.stage.934@yopmail.com`. Client name: Client Stage 934. Language: English.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Fill the vehicle step with the full test data and click "Continue" | The Client Info step opens | URL = `/customer/avantage-plus/buy/client` | ✅ | — |
| 2 | Fill the client fields; leave the FORM L25 checkbox unticked | Every field shows the value typed; the checkbox is unticked | First name = "Client"; Last name = "Stage 934"; Address1 = "2280 de la Rousserolle"; City = "Laval"; Province = "Québec"; Postal code = "H7L0C4"; Phone1 = "5146906330"; Email = "client.stage.934@yopmail.com"; checkbox checked = false | ✅ | — |
| 3 | Click "Get rates now" | No error page; record the outcome for Q-004 | Page reloaded on `/customer/avantage-plus/buy/client` with HTTP 200 (the server answered the submit). Q-004 recorded: the page does not move on; the checkbox text turns red and the message "ERROR You must confirm to have read the FORM-L25" appears directly under it. The box is therefore required on Dev | ✅ | The checkbox also carries the browser's `required` attribute ("Please check this box if you want to proceed.") |
| 4 `[Verification]` | The page did not move on, so no "Back"; verify the client fields | Every client field still holds the value typed in step 2 | All eight filled fields hold exactly the step 2 values; Address2 and Phone2 empty as left; checkbox still unticked | ✅ | Nothing was emptied or changed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_007-step4-L25RequiredFieldsKept_pass.png` — Client Info form with every value kept and the red FORM-L25 message under the checkbox

### AP2377_008 — A surcharge answered YES at Coverage is listed on the summary page — Step Results

Client email used: `client.stage.936@yopmail.com`. Client name: Client Stage 936. Language: French.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open the flow in French, fill the vehicle step with the test data, click "Continuer" | The Client Info step ("Info Client") opens | URL = `/customer/avantage-plus/buy/client`; step bar current = "Info Client" | ✅ | — |
| 2 `[Pre-Condition]` | Fill the client fields, tick FORM L25, click "Demander un devis" | The coverage step ("Choisir la couverture") opens | URL = `/customer/avantage-plus/buy/coverage`; heading = "Choisissez la durée de couverture pour la 2020 TESLA Model 3 Standard Range Plus"; one program card CVE / BEV | ✅ | — |
| 3 | Choose CVE / CVE 60m/0km / BEV; answer the air-suspension question Oui; move on; record the step after Coverage | No error page. Record the outcome for Q-003 | The term list on Dev names terms, not programs: "24m/…", "36m/…", "48m/…", "60m/Unlimited mileage - 3200.00$". Chose "60m/Unlimited mileage" (term id 126); "Continuer" → `/customer/avantage-plus/buy/coverage-2`, still marked "Choisir la couverture" in the step bar, showing "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" 1 500,00 $CA with radios Oui / Non (Non preselected). Chose Oui; "Continuer" → `/customer/avantage-plus/buy/summary`, step bar current = "Sommaire". Q-003 recorded: after the term choice a second coverage page asks the surcharge question, then the summary opens | ✅ | The program offered is the one the case names: the summary lists "Programme CVE / CVE 60m/0km / BEV" for term 126 (step 4). Labels of the moving-on buttons: "Continuer" on both coverage pages |
| 4 | Scroll to "Description du programme" | The section shows Programme CVE / CVE 60m/0km / BEV | Section "Description du programme" (link "Éditer"): Programme = "CVE" / "CVE 60m/0km" / "BEV" | ✅ | Matches A3 |
| 5 `[Verification]` | Verify the surcharge line | The line "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI" is shown | Under the label "Surcharge" the page shows "Ce véhicule est-il équipé d'un système de suspension pneumatique ? (MSRP: 1500.00)". The word "OUI" does not appear anywhere in the section. Totals: Prix de la couverture 4 700,00 $CA (3 200 + 1 500), TPS 235,00 $CA, TVQ 468,82 $CA, Total 5 403,82 $CA | ❌ | The surcharge the customer accepted is listed and charged, but the answer itself is not shown, and the line differs from A3 (the ticket's image for AC 5), which highlights "… pneumatique ? OUI". The customer sees a question and a price but not the answer they gave. Same in English: "Is this vehicle equipped with an Air Suspension system? (MSRP: 1500.00)" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_008-step5-SurchargeLineNoOui_fail.png` — French summary: "Surcharge — Ce véhicule est-il équipé d'un système de suspension pneumatique ? (MSRP: 1500.00)" with no "OUI"; step bar Info du véhicule · Info Client · Choisir la couverture · Sommaire

### AP2377_009 — A surcharge answered NO causes no error on the summary page — whether it is listed is recorded — Step Results

Client email used: `client.stage.938@yopmail.com`. Client name: Client Stage 938. Language: French.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open in French, fill the vehicle step, click "Continuer" | The Client Info step opens | URL = `/customer/avantage-plus/buy/client` | ✅ | — |
| 2 `[Pre-Condition]` | Fill the client fields, tick FORM L25, click "Demander un devis" | The coverage step opens | URL = `/customer/avantage-plus/buy/coverage` | ✅ | — |
| 3 | Choose CVE / CVE 60m/0km / BEV (term "60m/Unlimited mileage"); answer the air-suspension question Non; move on | The summary opens with no error page | On `/coverage-2` the radio "Non" was already selected by default; clicked "Non" and "Continuer" → `/customer/avantage-plus/buy/summary`, HTTP 200 | ✅ | Programme on the summary = CVE / CVE 60m/0km / BEV |
| 4 `[Verification]` | Verify "Description du programme" | The "… pneumatique ? OUI" line is not shown; record for Q-007 whether the question is absent or shown "NON" | No surcharge question in the section; the label "Surcharge" is still shown with nothing under it, followed by "Terme de la garantie 60 mois - Kilométrage illimité" and "Composantes couvertes BEV". Total = 3 679,20 $CA (no surcharge charged). Q-007 recorded: the question is absent, but an empty "Surcharge" heading remains | ✅ | The empty heading is recorded for the author, not failed |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_009-step4-NonQuestionAbsent_pass.png` — French summary with an empty "Surcharge" heading and no OUI line

### AP2377_010 — After a paid purchase, the admin warranty details page shows the surcharge answered YES — Step Results

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1–5 | Walk to the summary with Oui, pay, then open the admin warranty details page | The admin page shows the surcharge answered YES | Not executed. Designed BLOCKED (known blocker 1): no test payment method for the customer portal is known, and this run must never enter card details on a payment page | 🚫 | Still blocked: the `test-data` source holds no payment test card. The summary's "Continuer au paiement" button was never pressed, so no admin warranty exists to check |

### AP2377_011 — Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary — Step Results

Client email used: `client.stage.937@yopmail.com`. Client name: Client Stage 937. Language: French.

| Step | Action | Expected Result | Actual Result | Status | Comment |
|:---:|---|---|---|:---:|---|
| 1 `[Pre-Condition]` | Open in French; fill the vehicle step, "Continuer"; fill the client fields, tick FORM L25, "Demander un devis" | The coverage step opens | URL = `/customer/avantage-plus/buy/coverage` | ✅ | — |
| 2 | Choose CVE / CVE 60m/0km / BEV (term "60m/Unlimited mileage"), answer Oui, move on to the summary | The summary shows "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI"; record the Total | Summary: "Surcharge — Ce véhicule est-il équipé d'un système de suspension pneumatique ? (MSRP: 1500.00)", no "OUI"; Total = 5 403,82 $CA | ❌ | Same as AP2377_008 step 5. The remaining steps were still run so the change of answer could be recorded |
| 3 | Click "Éditer" beside "Description du programme" | The coverage step opens with no error page; record whether the program and Oui are still selected | "Éditer" (link to `/customer/avantage-plus/buy/coverage`) opened the term page with "60m/Unlimited mileage - 3200.00$" still selected; after "Continuer", `/coverage-2` showed "Oui" still selected | ✅ | "Éditer" was used, not "Back" |
| 4 | Change the answer to Non, keep the program, move on to the summary | The summary opens with no error page; record the Total | `/customer/avantage-plus/buy/summary`, HTTP 200; Total = 3 679,20 $CA (Prix de la couverture 3 200,00 $CA) | ✅ | The surcharge price was removed with the answer |
| 5 `[Verification]` | Verify "Description du programme" | The "… OUI" line is not shown; record for Q-007 | No surcharge question shown; the "Surcharge" label remains with nothing under it. Q-007 recorded: question absent after the change to Non, empty heading remains | ✅ | — |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_011-step2-SurchargeOuiLineNoOui_fail.png` — summary after Oui: the question with "(MSRP: 1500.00)", no "OUI"
- `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_011-step5-AfterNonQuestionAbsent_pass.png` — summary after changing to Non: question gone, empty "Surcharge" heading, lower Total (final state)

---

## Blocked / Skipped Test Cases

| TC ID | Status | Reason |
|---|:---:|---|
| AP2377_010 | 🚫 | Blocked at design and still blocked: no test payment method for the customer portal is known (no Stripe test card in the `test-data` source). Paying is the only way to create the warranty contract the admin page would show, and this run was instructed never to enter card details. Supply a payment test card (or a paid warranty on Dev that has the air-suspension surcharge) to unblock it |

---

## Judgement questions — what the build did (record-only)

| Question | Recorded in | What Dev did |
|---|---|---|
| Q-001 — validation of the new warranty fields | AP2377_004 | All three fields are optional; empty is accepted; a past end date is accepted; letters in "Warranty mileage limit" are accepted by the text box but the submit fails with HTTP 500 (the FAIL above) |
| Q-002 — French labels of the new fields | AP2377_002 | "Garantie du manufacturier/prolongée en cours"; "Numéro de garantie", "Date de fin de garantie", "Limite de kilométrage de garantie"; help text contains the typo "prolongeée" |
| Q-003 — the step after Coverage | AP2377_008 | A second coverage page `/buy/coverage-2` (surcharge questions, still labelled "Choisir la couverture"), then the summary "Sommaire" |
| Q-004 — is the FORM L25 box required | AP2377_007 | Yes: the server refuses the form with "You must confirm to have read the FORM-L25" |
| Q-005 — FORM-L25 link and French checkbox text | AP2377_005, AP2377_002 | Link to `/en/pdf-privacy` (French `/fr/pdf-privacy`), opens a PDF in a new tab; French text quoted in AP2377_002 step 4 |
| Q-007 — how a NO answer appears | AP2377_009, AP2377_011 | The question is absent; an empty "Surcharge" heading stays. A YES answer shows the question with "(MSRP: 1500.00)" but no "OUI" |

---

## Records left on Dev

Nothing was paid; "Continuer au paiement" / "Continue with payment" was never pressed. Whether the portal saves a client or quote record at the Client Info or summary step was not checked (`cleanup` source is missing). Each of these purchase sessions passed the Client Info step and may have left a client or unfinished purchase on Dev:

| Client email | Name | Reached | Case |
|---|---|---|---|
| `client.stage.932@yopmail.com` | — (vehicle step only, then Client Info page opened, no client submitted) | Client Info (not submitted) | AP2377_001, AP2377_004 |
| `client.stage.933@yopmail.com` | — | Client Info (not submitted) | AP2377_005 |
| `client.stage.934@yopmail.com` | Client Stage 934 | Client Info submitted, refused (box unticked) | AP2377_007 |
| `client.stage.935@yopmail.com` | Client Stage 935 | Summary (60m term, air suspension Yes) | AP2377_006 + exploratory continuation |
| `client.stage.936@yopmail.com` | Client Stage 936 | Summary (Oui) | AP2377_008 |
| `client.stage.937@yopmail.com` | Client Stage 937 | Summary (Oui, then Non) | AP2377_011 |
| `client.stage.938@yopmail.com` | Client Stage 938 | Summary (Non) | AP2377_009 |
| `client.stage.939@yopmail.com` | — | Client Info (not submitted) | AP2377_003 |
| `client.stage.940@yopmail.com` | Client Stage 940 (typed, not submitted) | Client Info (not submitted) | AP2377_002 |

---

## Environment Observations

- **Environment: Dev (v2dev)**, by the user's decision. The test cases were written against staging; every route they name exists on Dev under the same path.
- The header logo image (`/customer/uploads/273?filename=apicon-67f67ef3829ae.png`) returns HTTP 500 on every page of the flow, so the logo shows as a broken image. It is outside the ticket's scope and does not affect any step.
- Opening `/customer/avantage-plus/buy?_locale=fr` directly in a fresh session left the page in English; clicking the "Français" link switched it. Recorded only.
- On the French summary the dates read "December 18, 2027" / "December 18, 2032" in English while the rest of the page is French. The start date equals the current-warranty end date typed on the vehicle step, which matches the help text ("this warranty will begin after the current warranty has expired"). Recorded only — no criterion covers it.
- The vehicle step on Dev asks for Email and Postal code, which the ticket's A1 mock-up and the test cases do not show. The Client Info step then pre-fills them.
- s4c (correction of test cases for a bug confirmed not valid) has nothing to act on: no sentence in the requirement capture or in the ticket's two comments says that any actual result above is intended (Gate C rule C1 needs such a quote).

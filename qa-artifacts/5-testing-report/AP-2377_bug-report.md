# Bug Report

**Project:** Avantage Plus (AP) — AP-2377 *Customer portal changes*
**Report ID:** BR-20261102-001
**Test Cycle:** Run folder 3.6.0 (fix version) — AP-2377 execution of 2026-11-02
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill (inside stlc-ticket-pipeline, `AP-2377 --from s5`)
**Source:** `qa-artifacts/3-test-cases/AP2377_TestCases_001-005.md`, `AP2377_TestCases_006-010.md`, `AP2377_TestCases_011-011.md` — execution log `qa-artifacts/4-execution-results/3.6.0/execution-log_AP-2377_2026-11-02.md`
**Tested on:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca, chosen by the user for this run

| Metric | Value |
|---|:---:|
| Total defects | 2 |
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 0 |
| Tracker tickets created | 2 |

The run had 3 FAIL (AP2377_004, AP2377_008, AP2377_011) and 1 BLOCKED case (AP2377_010).
Gate C (review R3, APPROVE) sent every FAIL to rule C4, **file new**: 17 open-bug searches
found no ticket naming the customer purchase flow, its "Warranty mileage limit" field or the
summary's surcharge line. AP2377_008 and AP2377_011 fail on the same observation, so they
share one bug. The BLOCKED case is not a product defect — see *Blocked cases* below.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2377_004 | Letters in the optional "Warranty mileage limit" field give an HTTP 500 error page on Continue | Medium | P2 | AP-2510 | Open |
| BUG-002 | AP2377_008, AP2377_011 | The summary shows the air-suspension surcharge question without the answer "OUI" | Medium | P3 | AP-2511 | Open |

---

## Bug Details

---

### BUG-001 — Letters in "Warranty mileage limit" give an HTTP 500 error page instead of a validation message

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2377_004 — Leaving the new warranty fields empty or typing unusual values causes no error page and loses no data |
| **Requirement** | REQ-001 — Vehicle step: current-warranty fields at the end of the form, and the "Continue" button (AC 1) |
| **Severity** | Medium — a customer who types anything other than digits in this optional field gets the generic error page and cannot continue the purchase, but the purchase goes through when the field is left empty or holds digits |
| **Priority** | P2 |
| **Environment** | Tested on: Dev (v2dev) — https://v2dev.garantieavantageplus.ca · Chromium (Playwright) · Windows 11 · fix version 3.6.0 |
| **Tracker Ticket** | [AP-2510](https://garantieavantageplus.atlassian.net/browse/AP-2510) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always (2 of 2 in the QA run; reproduced a third time by the independent review) |

**Summary:**
On the customer purchase page `/customer/avantage-plus/buy`, typing letters such as "abc" into the optional "Warranty mileage limit" field and clicking "Continue" returns HTTP 500 and the generic error page "Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." instead of a message under the field.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/customer/avantage-plus/buy in a new browser session. No sign-in is needed. The page "Buy a warranty online" opens on the step "Enter the vehicle" (click "English" at the top if it opens in French).
2. Fill "VIN (Vehicle Identification Number)\*" = `5YJ3E1EA0LF734293`, "Current mileage (km)\*" = `10000`, "Email\*" = `client.stage.932@yopmail.com`, "Postal code\*" = `H7L0C4`, "Market Value" = `45000.00`.
3. Scroll to the section "Current manufacturer/extended warranty" at the bottom of the form. Leave "Warranty Number" empty, type `2027-12-18` in "Warranty end date", and type `abc` in "Warranty mileage limit". The field accepts the letters.
4. Click "Continue".

**Expected Result:**
The form does not crash. Either the field refuses the letters, or the page stays on the vehicle step and shows a validation message under "Warranty mileage limit" (for example, that it must be a number), keeping every value typed. AP2377_004 step 4 expects "No error page or HTTP 5xx". The ticket (AC 1 and its mock-up A1, which shows the sample value `100000`) does not state the field's validation rule — see the question in Notes.

**Actual Result:**
The server answers HTTP 500 and the page shows the generic error screen "Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." with a link "Aller à l'accueil"; the URL stays `/customer/avantage-plus/buy`. The customer cannot move on to Client Info. When the vehicle step is opened again, VIN, mileage, email, postal code and Market Value are still filled, but the "Warranty end date" and "Warranty mileage limit" values sent with the failing request are gone. The same input with a numeric mileage limit (`100000`) is accepted, and a past end date (`2020-01-01`) with the mileage limit empty is accepted — so the non-numeric "Warranty mileage limit" alone causes the error.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step4-Http500TextMileageOnly_fail.png` — the error page after Continue with only "abc" in "Warranty mileage limit" (end date 2027-12-18) |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_004-step4-Http500PastDateTextMileage_fail.png` — the same error page after Continue with end date 2020-01-01 and "abc" in "Warranty mileage limit" (first occurrence) |
| Form before submit | Not captured — no screenshot of the vehicle form with "abc" typed in the field was taken before Continue (review R3 finding F-2). Steps 2–3 above give the exact values |
| Network | POST `/customer/avantage-plus/buy` → HTTP 500 (observed in the run and in the independent review; no HAR saved) |
| Console log | None captured beyond the unrelated header-logo image error (HTTP 500 on `/customer/uploads/273?filename=apicon-…png`, on every page of the flow) |

Both screenshots were uploaded to AP-2510 (attachments 14126–14127) and embedded in its description; the v3 read-back shows 2 resolved `media` nodes. AP-2510 was created 2026-11-02 in status Backlog, priority Medium, labels `qa-agent` and `stlc-automated`, assigned to Ken Nguyen (`bug_new_assign`), and linked to AP-2377 as *Relates*. The description says the form-before-submit capture was not taken.

**Suggested Root Cause:**
Unknown — for dev investigation. The field is a plain text box and the value appears to reach a numeric conversion or a numeric database column without form validation, so the exception surfaces as a 500 instead of a form error.

**Notes:**
- Question for the author (open question Q-001 on AP-2377): what may "Warranty mileage limit" contain — whole numbers only? Whatever the rule, the page should answer with a message, not an error page.
- The loss of the two warranty values in the Actual Result is a consequence of the error, not a separate defect.
- Found while testing AP-2377 (test case AP2377_004). Tested on: Dev (v2dev). Full record: `qa-artifacts/5-testing-report/AP-2377_bug-report.md`.

---

### BUG-002 — The summary shows the air-suspension surcharge question without the answer "OUI"

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2377_008 — A surcharge answered YES at Coverage is listed on the summary page (step 5); AP2377_011 — Changing the air-suspension answer from Oui to Non removes the OUI surcharge line from the summary (step 2) |
| **Requirement** | REQ-005 — The summary page lists the surcharges answered YES (AC 5, image A3) |
| **Severity** | Medium — the surcharge the customer accepted is listed and charged correctly, but the line does not show the answer the ticket's image A3 shows, so the summary differs from the agreed design; it is a display difference, not a wrong price |
| **Priority** | P3 |
| **Environment** | Tested on: Dev (v2dev) — https://v2dev.garantieavantageplus.ca · Chromium (Playwright) · Windows 11 · fix version 3.6.0 |
| **Tracker Ticket** | [AP-2511](https://garantieavantageplus.atlassian.net/browse/AP-2511) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always (2 of 2 — two separate purchase sessions, clients 936 and 937; the same line also shows in English) |

**Summary:**
On the summary step of the customer purchase flow (`/customer/avantage-plus/buy/summary`), after answering "Oui" to the air-suspension question, the "Surcharge" line reads "Ce véhicule est-il équipé d'un système de suspension pneumatique ? (MSRP: 1500.00)" and never shows the answer "OUI" that the ticket's image A3 shows ("… pneumatique ? OUI").

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/customer/avantage-plus/buy in a new browser session (no sign-in needed) and click the "Français" link at the top. The heading reads "Acheter une garantie en-ligne".
2. On the step "Info du véhicule", fill "NIV (Numéro d'identification du véhicule)\*" = `5YJ3E1EA0LF734293`, "Kilométrage actuel (km)\*" = `10000`, "Courriel\*" = `client.stage.936@yopmail.com`, "Code postal\*" = `H7L0C4`, "Valeur marchande" = `45000.00`, "Numéro de garantie" = `2131331`, "Date de fin de garantie" = `2027-12-18`, "Limite de kilométrage de garantie" = `100000`. Click "Continuer".
3. On the step "Info Client", fill "Prénom" = `Client`, "Nom" = `Stage 936`, "Addresse" = `2280 de la Rousserolle`, "Ville" = `Laval`, "Province" = `Québec`, "Code postal" = `H7L0C4` (already filled), "Téléphone 1" = `5146906330`, "Courriel" = `client.stage.936@yopmail.com` (already filled). Tick the box "Je confirme avoir lu FORM-L25 …". Click "Demander un devis".
4. On the step "Choisir la couverture", in the CVE / BEV program card, choose the term "60m/Unlimited mileage - 3200.00$" in the term drop-down and click "Continuer".
5. On the next page (`/customer/avantage-plus/buy/coverage-2`), for "Ce véhicule est-il équipé d'un système de suspension pneumatique ?" (1 500,00 $CA) select "Oui" ("Non" is preselected) and click "Continuer". The summary step "Sommaire" opens.
6. Scroll to "Description du programme" and read the line under "Surcharge". Do not tick the terms box and do not click "Continuer au paiement".

**Expected Result:**
The summary lists the surcharge answered YES with its answer, as in the ticket's image A3 for AC 5 ("The page lists info about the surcharges selected as YES"): "Ce véhicule est-il équipé d'un système de suspension pneumatique ? OUI".

**Actual Result:**
Under "Surcharge" the page shows "Ce véhicule est-il équipé d'un système de suspension pneumatique ? (MSRP: 1500.00)". The word "OUI" appears nowhere in the section; the price "(MSRP: 1500.00)" is shown instead. "Programme" reads CVE / CVE 60m/0km / BEV, as in A3. The surcharge is charged correctly: "Prix de la couverture" 4 700,00 $CA (3 200 + 1 500), TPS 235,00 $CA, TVQ 468,82 $CA, Total 5 403,82 $CA. In English the line reads "Is this vehicle equipped with an Air Suspension system? (MSRP: 1500.00)", also without "Yes". When the answer is changed to "Non" (click "Éditer" beside "Description du programme", keep the term, choose "Non", "Continuer"), the question disappears from the summary and the total drops to 3 679,20 $CA — that part works.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_008-step5-SurchargeLineNoOui_fail.png` — French summary for client 936: "Surcharge — Ce véhicule est-il équipé d'un système de suspension pneumatique ? (MSRP: 1500.00)", no "OUI"; total 5 403,82 $CA |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/3.6.0/AP-2377/AP2377_011-step2-SurchargeOuiLineNoOui_fail.png` — the same summary line for client 937, the second occurrence |
| Console log | None captured beyond the unrelated header-logo image error |

Both screenshots were uploaded to AP-2511 (attachments 14128–14129) and embedded in its description; the v3 read-back shows 2 resolved `media` nodes. AP-2511 was created 2026-11-02 in status Backlog, priority Medium, labels `qa-agent` and `stlc-automated`, assigned to Ken Nguyen (`bug_new_assign`), and linked to AP-2377 as *Relates*. One ticket covers both test cases AP2377_008 and AP2377_011.

**Suggested Root Cause:**
Unknown — for dev investigation. The summary template appears to print each selected surcharge's question followed by its MSRP rather than the customer's answer.

**Notes:**
- Question for the author: is the answer word ("OUI" / "YES") required on the summary line, as image A3 shows, or is the question with its price "(MSRP: 1500.00)" acceptable? If the price form is intended, please say so in a comment and the QA test cases will be corrected to it.
- Related record-only observation (not part of this bug): after answering "Non" the "Surcharge" label stays on the summary with nothing under it (open question Q-007 on AP-2377).
- Found while testing AP-2377 (test cases AP2377_008 and AP2377_011). Tested on: Dev (v2dev). Full record: `qa-artifacts/5-testing-report/AP-2377_bug-report.md`.

---

## Blocked cases (not filed)

| TC ID | Why BLOCKED | Filed? |
|---|---|---|
| AP2377_010 | Blocked at design and still blocked: no test payment method for the customer portal is known, and card details are never entered by the QA agent. Paying is the only way to create the contract whose admin warranty details page AC 6 checks | No — missing test data, not a defect |

**Environment observations (recorded, not filed):** the header logo image returns HTTP 500 on every page of the flow; on the French summary the start and end dates are written in English; opening `?_locale=fr` directly did not switch the language (the "Français" link does). None is covered by an AP-2377 criterion.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | AP2377_004 · AP2377_008, AP2377_011 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Current-warranty fields and "Continue" button | 1 | BUG-001 |
| REQ-002 — Client Info before Coverage | 0 | — |
| REQ-003 — FORM L25 checkbox and "Get rates now" | 0 | — |
| REQ-004 — "Get rates now" opens Coverage | 0 | — |
| REQ-005 — Summary lists YES surcharges | 1 | BUG-002 |
| REQ-006 — Admin warranty page shows surcharges | 0 (AP2377_010 BLOCKED) | — |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-02

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2510 | No action at s7 — new bug in Backlog, not in the QA status (Gate D §3.2). Listed in the AP-2377 result comment 19446 | Backlog (unchanged) | 2026-11-02T01:08+07:00 |
| BUG-002 | AP-2511 | No action at s7 — new bug in Backlog, not in the QA status (Gate D §3.2). Listed in the AP-2377 result comment 19446 | Backlog (unchanged) | 2026-11-02T01:08+07:00 |
| — | AP-2377 | Story result comment 19446 posted and read back (11 test-case rows plus header, author Vinh Le - QC). Status not moved: pass rate 63.6% (needs 90%) | QC (unchanged), assignee Ken Nguyen (unchanged) | 2026-11-02T01:08+07:00 |

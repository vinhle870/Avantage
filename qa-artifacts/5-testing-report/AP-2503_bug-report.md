# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2503: Generate contract for a quote's extended warranty
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2503 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-02 (UTC), by the user's decision: 7 PASS, 3 FAIL, 0 BLOCKED.
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-02.md · qa-artifacts/3-test-cases/AP2503_TestCases_001-005.md, AP2503_TestCases_006-010.md

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"). Staging was not checked in this run; the test-case files still name v2staging as their environment.

| Metric | Value |
|---|:---:|
| Total defects | 3 |
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 0 |
| Tracker tickets created | 3 (AP-2530, AP-2531, AP-2532 — status Backlog) |

**Decisions:**
- Gate C (by the independent reviewer — R3 round 1 APPROVE, the R3 section of `qa-artifacts/7-reviews/AP-2503_review.md`): all three FAILs are filed as **new** bugs — rule C4. Rule C1 (not a bug) does not hold for any of them: AP-2503 has no comments and the requirement capture has no sentence saying that the observed behaviour is intended. The duplicate search (open bugs, ten text searches) found no bug naming the same screen and the same wrong behaviour: AP-2515 is the Permaplate contract form's Program Summary (a different screen, a different missing item); AP-2520/2521/2522 are the add-extended-warranty **modal**'s vehicle form; AP-2459 is an HTTP 500 on the Permaplate contract form when the financing company is left unselected (a different screen and a server error, not a browser refusal). A second check at s5 (2026-11-02T01:28Z, open bugs created in the last two hours) found no new candidate.
- BUG-003 is linked "relates to" AP-2459 as well as AP-2503, because both concern a contract form and an unselected financing company.
- BUG-003 is written as an open question for the product owner with an either/or expected result, because the ticket does not say whether a financing company is mandatory (Q-006 "valid form values" is undefined) and the old pop-up's behaviour is not recorded (Q-007).
- None of the three bugs blocked another test case. BUG-003 failed step 3 of AP2503_007, which is not its last step; the remaining steps were run by picking a financing company (see BUG-003 Notes).

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2503_003 | The "Program Summary" on the extended-warranty Generate Contract page does not show the vehicle delivery date | Medium | P2 | [AP-2530](https://garantieavantageplus.atlassian.net/browse/AP-2530) | Open |
| BUG-002 | AP2503_005 | The VIN and the delivery date can be edited on the extended-warranty Generate Contract page although they should be read-only | Medium | P2 | [AP-2531](https://garantieavantageplus.atlassian.net/browse/AP-2531) | Open |
| BUG-003 | AP2503_007 | A quote without financing cannot become an extended-warranty contract unless the dealer enters a financing company | High | P2 | [AP-2532](https://garantieavantageplus.atlassian.net/browse/AP-2532) | Open |

---

## Bug Details

---

### BUG-001 — The "Program Summary" on the extended-warranty Generate Contract page does not show the vehicle delivery date

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2503_003 (step 3) |
| **Requirement** | AP-2503 REQ-003 — acceptance criterion 2: "The “Program Summary” shows: - Vehicle delivery date - Warranty start date (editable) - Warranty sale price" |
| **Severity** | Medium — the dealer does not see the delivery date next to the warranty start date it governs, as the story requires; the date can still be read in the left-hand "Vehicle identification" section, so the contract can be made |
| **Priority** | P2 — it fails an acceptance criterion of AP-2503 |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Staging was not checked |
| **Tracker Ticket** | [AP-2530](https://garantieavantageplus.atlassian.net/browse/AP-2530) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2503; 1 screenshot embedded in the description (verified: 1 media node with id); filed 2026-11-02T01:31Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — seen on quotes 6557 and 6558 |

**Summary:**
On the dealer page "Extended Warranty Contract" (`/quote/{id}/warranty/generate-contract`), the right-hand "Program Summary" box lists Program Term, Start Date, End date and Sale price, but not the vehicle delivery date that AP-2503 lists as the first item of the Program Summary; the delivery date appears only as a field of the left-hand "Vehicle identification" section.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells extended warranties (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Fill VIN `AP2503TC001110201` (any unused 17-character VIN works), Brand `Toyota` (wait for the Model list to reload), Model `Corolla`, Year `2023`, Vehicle Price `25000`, Kilometers `12000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` (unit Litre), Designation `Particular`, and click **Save**. The page `/vehicle/{vehicleId}/details` opens with "Vehicle saved".
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={vehicleId}`). Fill First name `Contract`, Last name `Owner2503-001`, Email an unused address such as `client.stage.2503901@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle, set Delivered at `2026-11-02` and Price `25000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. On `/quote/{id}/details`, in "Summary of products", click the **+** button on the "Extended warranty" row. In the modal choose the first program, "Garantie de base AP", its first term (option 1 → 100m/20000km), type Sale price `2500` and click **Save**. "Warranty saved" appears and the Extended warranty row shows CA$2,500.00.
5. On the Extended warranty row click the **⋯** menu and then **Generate Contract**. The page "Extended Warranty Contract" opens at `https://v2dev.garantieavantageplus.ca/quote/{id}/warranty/generate-contract`.
6. Read the "Program Summary" box at the top of the right-hand column, then the "Vehicle identification" section at the top of the left-hand column.

(A ready example on Dev: quote 6557 has an extended warranty and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6557/warranty/generate-contract` after step 1.)

**Expected Result:**
The "Program Summary" box shows the vehicle delivery date (2026-11-02, the date entered on the quote), the warranty start date as an editable field, and the warranty sale price, as AP-2503 acceptance criterion 2 says: "The “Program Summary” shows: - Vehicle delivery date - Warranty start date (editable) - Warranty sale price".

**Actual Result:**
The "Program Summary" box shows only "Program Term: Garantie de base AP — option 1", "Start Date" (editable, 2026-11-02), "End date: 2035-03-02" and "Sale price" (editable, 2500). There is no delivery date in it. The delivery date 2026-11-02 is shown only as the "Delivery date" field of the left-hand "Vehicle identification" section.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step3-ProgramSummaryNoDeliveryDate_fail.png` — the Program Summary of quote 6557 with Program Term, Start Date, End date and Sale price only; the delivery date sits in the left column |
| Console log | None captured (only the Freshchat widget errors present on every page) |

**Suggested Root Cause:**
Unknown — for dev investigation. The delivery-date field may have been placed in the vehicle section of the new two-column layout instead of (or as well as) the Program Summary.

**Notes:**
- The rest of the Program Summary works: the start date defaults to the delivery date and can be changed, and the sale price equals the price entered with the warranty.
- Related: AP-2503 (the story whose acceptance criterion this fails).

---

### BUG-002 — The VIN and the delivery date can be edited on the extended-warranty Generate Contract page although they should be read-only

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2503_005 (steps 2 and 5) |
| **Requirement** | AP-2503 REQ-004 — acceptance criterion 3: "vehicle identifiers and delivery date are read-only, and the warranty start date, and owner fields are editable" |
| **Severity** | Medium — the dealer can type a different VIN or delivery date on the page that creates the contract, although the story says they are fixed by the quote; whether such an edit would reach the contract was not tested, because submitting would create a permanent contract with a made-up VIN |
| **Priority** | P2 — it fails an acceptance criterion of AP-2503 and risks a contract whose vehicle or dates differ from the quote |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Staging was not checked |
| **Tracker Ticket** | [AP-2531](https://garantieavantageplus.atlassian.net/browse/AP-2531) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2503; 2 screenshots embedded in the description (verified: 2 media nodes with ids); filed 2026-11-02T01:31Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — quote 6558 |

**Summary:**
On the dealer page "Extended Warranty Contract" (`/quote/{id}/warranty/generate-contract`), the "VIN" and "Delivery date" fields of the "Vehicle identification" section are ordinary editable inputs: typing `AP2503TC099999999` over the VIN and `2026-10-15` over the delivery date is accepted, although AP-2503 says vehicle identifiers and the delivery date are read-only.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells extended warranties (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Fill VIN `AP2503TC004110201` (any unused 17-character VIN works), Brand `Toyota` (wait for the Model list to reload), Model `Corolla`, Year `2023`, Vehicle Price `25000`, Kilometers `12000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` (unit Litre), Designation `Particular`, and click **Save**. The page `/vehicle/{vehicleId}/details` opens with "Vehicle saved".
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={vehicleId}`). Fill First name `Contract`, Last name `Owner2503-004`, Email an unused address such as `client.stage.2503904@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle, set Delivered at `2026-11-02` and Price `25000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. On `/quote/{id}/details`, in "Summary of products", click the **+** button on the "Extended warranty" row. In the modal choose the first program, "Garantie de base AP", its first term (option 1 → 100m/20000km), type Sale price `2500` and click **Save**. "Warranty saved" appears.
5. On the Extended warranty row click the **⋯** menu and then **Generate Contract**. The page "Extended Warranty Contract" opens at `https://v2dev.garantieavantageplus.ca/quote/{id}/warranty/generate-contract`.
6. In the left-hand "Vehicle identification" section, click into **Delivery date**, select its text and type `2026-10-15`. Then click into **VIN**, select its text and type `AP2503TC099999999`.
7. Look at both fields. Do **not** click "Generate Contract" (it would create a real contract with the typed VIN).

(A ready example on Dev: quote 6557 has an extended warranty and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6557/warranty/generate-contract` after step 1.)

**Expected Result:**
The VIN and the delivery date cannot be changed on this page: they are shown as text or as disabled / read-only fields, and keep the quote's values (`AP2503TC004110201` and `2026-11-02`), as AP-2503 acceptance criterion 3 says: "vehicle identifiers and delivery date are read-only, and the warranty start date, and owner fields are editable".

**Actual Result:**
Both fields accept the typing. The Delivery date field is a date-picker text input that is neither read-only nor disabled (its calendar opens on click) and now shows `2026-10-15`. The VIN field (a VIN-lookup text input) is neither read-only nor disabled and now shows `AP2503TC099999999`. They are shaded grey but behave as normal inputs. Nothing was saved to the quote: after leaving the page without submitting, the quote still reads VIN `AP2503TC004110201` and delivery date Nov 2, 2026.

Also observed (not the fault reported here): Year, Make, Model and Mileage in the same section are editable text inputs too. Whether those count as "vehicle identifiers" is not stated in AP-2503 (QA question Q-003), so they are only recorded.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step2-VinAndDeliveryDateAcceptTyping_fail.png` — the VIN field showing AP2503TC099999999 and the Delivery date field showing 2026-10-15 after typing |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step5-VinEditedOwnerStartDateEdited_fail.png` — the page before any submit: edited VIN and delivery date, with the owner edits and Start Date 2026-11-09 |
| Console log | None captured (only the Freshchat widget errors present on every page) |

**Suggested Root Cause:**
Unknown — for dev investigation. The vehicle fields are rendered as normal inputs of the `warranty_finalize` form (`vehicleVIN`, `vehicleDeliveredAt`, …), without `readonly` or `disabled`.

**Notes:**
- Owner fields and the warranty start date are editable, as the story asks.
- Not tested: what the created contract holds if a changed VIN or delivery date is submitted.
- Related: AP-2503 (the story whose acceptance criterion this fails).

---

### BUG-003 — A quote without financing cannot become an extended-warranty contract unless the dealer enters a financing company

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2503_007 (step 3); the same empty fields are recorded in AP2503_010 |
| **Requirement** | AP-2503 REQ-005 — acceptance criterion 4: "Given valid form values, when the dealer submits, then contract is created following the current process"; acceptance criterion 1: "Given a quote with a vehicle and an extended warranty from a program"; description: "Contract creation, invoice, financing, and PDF behaviour stay unchanged" |
| **Severity** | High — for a sale without financing the dealer cannot get the warranty contract at all unless they put a financing company on it that the customer does not have, and that company is then printed on a permanent contract |
| **Priority** | P2 — the product owner must first say whether a financing company is meant to be mandatory |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Staging was not checked |
| **Tracker Ticket** | [AP-2532](https://garantieavantageplus.atlassian.net/browse/AP-2532) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2503 and Relates → AP-2459; 2 screenshots embedded in the description (verified: 2 media nodes with ids); filed 2026-11-02T01:31Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — quotes 6559 (submit tried) and 6557 (same empty required fields) |

**Summary:**
On the dealer page "Extended Warranty Contract" (`/quote/{id}/warranty/generate-contract`) for a quote that has no financing, the "Financing information" section has six required financing-company fields (name, phone, address, city, province, postal code) that are empty, so clicking **Generate Contract** is refused by the browser with "Please fill out this field." and no contract can be created unless the dealer enters a financing company.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells extended warranties (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Fill VIN `AP2503TC007110201` (any unused 17-character VIN works), Brand `Toyota` (wait for the Model list to reload), Model `Corolla`, Year `2023`, Vehicle Price `25000`, Kilometers `12000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` (unit Litre), Designation `Particular`, and click **Save**. The page `/vehicle/{vehicleId}/details` opens with "Vehicle saved".
3. On that vehicle page click **Create quote** (it opens `/quote/new/client?fromVehicleId={vehicleId}`). Fill First name `Contract`, Last name `Owner2503-007`, Email an unused address such as `client.stage.2503907@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle, set Delivered at `2026-11-02` and Price `25000`, and click **Save**. The quote page `/quote/{id}/details` opens. Do **not** add a financing.
4. On `/quote/{id}/details`, in "Summary of products", click the **+** button on the "Extended warranty" row. In the modal choose the first program, "Garantie de base AP", its first term (option 1 → 100m/20000km), type Sale price `2500` and click **Save**. "Warranty saved" appears.
5. On the Extended warranty row click the **⋯** menu and then **Generate Contract**. The page "Extended Warranty Contract" opens at `https://v2dev.garantieavantageplus.ca/quote/{id}/warranty/generate-contract`.
6. Scroll to "Financing information" at the bottom of the left-hand column: the "Financing Company" picker reads "Choose", and Financing company name\*, phone\*, address\*, city\*, province\* and postal code\* are empty. Leave them as they are.
7. Optionally set Start Date to `2026-11-09` and Client tel work to `5145550299` (the QA did; it does not change the result). Click **Generate Contract**.

(A ready example on Dev: quote 6557 has an extended warranty, no financing and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6557/warranty/generate-contract` after step 1, then do steps 6–7. Clicking Generate Contract there with a company picked would create a real contract.)

**Expected Result:**
The ticket does not say which of these is intended, so one of the two must hold — please confirm which:
- **either** the contract is created with the financing fields left empty, because the quote has no financing (AP-2503 acceptance criterion 1 needs only "a quote with a vehicle and an extended warranty from a program", and acceptance criterion 4 says "Given valid form values, when the dealer submits, then contract is created following the current process");
- **or** a financing company is mandatory for every extended-warranty contract, AP-2503 is updated to say so, and the page tells the dealer so beside the financing fields.

What "valid form values" means is not defined in AP-2503 (QA question Q-006), and whether the old Generate Contract pop-up also required a financing company is not known (QA question Q-007), so neither reading can be confirmed from the ticket.

**Actual Result:**
Nothing is submitted. The address stays `/quote/{id}/warranty/generate-contract` and no request is sent: the browser's built-in form check refuses the form, and each of the six financing-company fields (name, phone, address, city, province, postal code) reports "Please fill out this field." The six fields are marked with "\*" on their labels. The only way to get a contract is to pick a company in the "Financing Company" picker (for example AutoCapital Canada, the first one), which fills the name, address, city, province and postal code; Generate Contract then goes through — on quote 6559 it created contract APOP01-846 and invoice #943 ($456.00).

Recorded fact: once a company is picked, the submit goes through even though the financing company phone stays empty (AutoCapital Canada has no phone in its record). This happened on quotes 6558, 6559 and 6561 (contracts APOP01-845, APOP01-846, APOP01-847), so the "required" state of these fields is not fixed — it changes once a company is chosen.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-RequiredFinancingFieldsEmpty_fail.png` — "Financing information" of quote 6559: the picker at "Choose" and the six financing-company fields, marked "\*", all empty, which stopped the submit |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-SubmitStoppedEmptyFinancingFields_fail.png` — the top of the page after clicking Generate Contract: still the same page, no contract created |
| Console log | None captured (only the Freshchat widget errors present on every page) |

**Suggested Root Cause:**
Unknown — for dev investigation. The six financing-company inputs of the `warranty_finalize` form carry the HTML `required` attribute whatever the quote's financing. After a company is picked, the phone input still carries `required` and stays empty (re-checked on quote 6557 on 2026-11-02, without submitting), yet the submits on quotes 6558, 6559 and 6561 went through — so something in the Generate Contract submit lets the empty phone pass; the submit handler is the place to look.

**Notes:**
- Background only, not evidence of what is intended: on Dev the Esthetic protection (Permaplate) contract form, which AP-2503 says this page should match, created contracts with Financing company left at "Choose" (AP-2428 test cases AP2428_009, AP2428_012, AP2428_015). The older automation's extended-warranty `generateContract()` also clicks submit without picking a financing company.
- Side effect of the workaround: to finish the other checks, the QA picked AutoCapital Canada on quotes 6559 and 6561, which have no financing. Contracts **APOP01-846** (quote 6559) and **APOP01-847** (quote 6561) on Dev therefore carry a financing company their quotes do not have. These contracts cannot be deleted.
- Related: AP-2503 (the story), AP-2459 (Permaplate contract generation returns HTTP 500 when Financing company is left unselected — a different form and a server error, linked as related).

---

## Defect Distribution

_Three separate problems on the new Generate Contract page: one blocks contracts for sales without financing, two are differences from the acceptance criteria on the page layout._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2503_007 |
| Medium | 2 | AP2503_003, AP2503_005 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Dedicated page at the unchanged route | 0 | — |
| REQ-002 — Two-column layout with PDF preview | 0 | — |
| REQ-003 — Program Summary content | 1 | BUG-001 |
| REQ-004 — Pre-fill and read-only / editable fields | 1 | BUG-002 |
| REQ-005 — Submit creates the contract | 1 | BUG-003 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-02T01:35Z (UTC)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2530 | Filed in s5 (new, rule C4), assigned to Ken Nguyen, linked to AP-2503; no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog | 2026-11-02T01:31Z |
| BUG-002 | AP-2531 | Filed in s5 (new, rule C4), assigned to Ken Nguyen, linked to AP-2503; no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog | 2026-11-02T01:31Z |
| BUG-003 | AP-2532 | Filed in s5 (new, rule C4), assigned to Ken Nguyen, linked to AP-2503 and AP-2459; no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog | 2026-11-02T01:31Z |
| — (story) | AP-2503 | Story result comment 19456 posted (FAIL, 7/10, Tested on: Dev (v2dev), Staging not checked; all 11 open questions; APOP01-846/847 financing-company note) and read back; status not changed — pass rate 70% (needs 90%), AP-2532 (High) stopping | QC (unchanged) | 2026-11-02T01:35Z |

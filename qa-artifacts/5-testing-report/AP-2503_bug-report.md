# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2503: Generate contract for a quote's extended warranty
**Report ID:** BR-20261115-001 (replaces BR-20261102-001; the three bugs of 2026-11-02 are kept below with a 2026-11-15 re-test block)
**Test Cycle:** AP-2503 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-15 (UTC), qa-agent batch 2026-11-15: 5 PASS, 5 FAIL, 0 BLOCKED (50%).
**Date:** 2026-11-15
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2503_2026-11-15.md · qa-artifacts/3-test-cases/AP2503_TestCases_001-005.md, AP2503_TestCases_006-010.md · Gate C record: qa-artifacts/7-reviews/AP-2503_review.md (R3 rounds 1 and 2, 2026-11-15)

**Environment: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"). Staging was not checked.

| Metric | Value |
|---|:---:|
| Total defects | 5 (3 seen again, 2 new) |
| Critical | 0 |
| High | 1 |
| Medium | 4 |
| Low | 0 |
| Tracker tickets created | 2 new (AP-2563, AP-2564) · 3 existing commented (AP-2530, AP-2531, AP-2532) |

**Decisions:**
- Gate C was decided by the independent reviewer (R3 round 2, APPROVE, 2026-11-15T09:39Z; R3 section of `qa-artifacts/7-reviews/AP-2503_review.md`). Rule C1 (not a bug) does not hold for any FAIL: no AP-2503 comment and no capture sentence says that the observed behaviour is intended.
- **Rule C2 — comment on the existing bug, do not file new:** AP2503_003 step 3 → AP-2530; AP2503_005 steps 2 and 5 → AP-2531 (the VIN half only — the delivery date is now read-only text); AP2503_007 step 3 → AP-2532 (now one required "Financing company" picker refused by the server). All three were open (Backlog) when re-read at 2026-11-15T09:40Z.
- **Rule C4 — file new:** F4, AP2503_002 step 4 (no contract preview and no "Open PDF in new tab" link) → BUG-004; F5, AP2503_008 step 4 (HTTP 500 when the start date is empty) → BUG-005. The reviewer's 17 open-bug text searches found no bug naming the same screen and behaviour; a re-check at s5 (2026-11-15T09:41Z: bugs created in the last day, "preview", "start date") found no new candidate.
- **Not a bug:** AP2503_002 step 3 (no "Financing information" card on quote 6703) — superseded by delivered Story AP-2559: "Given the dealer is checking-out a quote without a GAP/Creditor insurance When the checkout page is shown Then the “Financing information” card is not visible." The step is PASS; nothing is filed for it.
- The generate-contract page was redesigned on Dev after 2026-11-02 by Stories AP-2544, AP-2545, AP-2546, AP-2559 and AP-2560 (Deploy to staging). By the batch decision, those delivered Stories supersede AP-2503 on the points they define; AP-2550 and AP-2561 are In Progress and do not. No delivered Story removes the contract preview, so AP-2503 acceptance criteria 1 and 2 still apply to it.
- New bugs are assigned to Minh Lưu (`bug_new_assign`), linked Relates → AP-2503, labels qa-agent and stlc-automated.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2503_003 | The "Program Summary" (now "Product Summary") on the extended-warranty Generate Contract page does not show the vehicle delivery date | Medium | P2 | [AP-2530](https://garantieavantageplus.atlassian.net/browse/AP-2530) — seen again 2026-11-15, commented | Open |
| BUG-002 | AP2503_005 | The VIN can be edited on the extended-warranty Generate Contract page although it should be read-only (the delivery date is now read-only) | Medium | P2 | [AP-2531](https://garantieavantageplus.atlassian.net/browse/AP-2531) — seen again 2026-11-15 (VIN only), commented | Open |
| BUG-003 | AP2503_007 | A quote without financing cannot become an extended-warranty contract unless the dealer picks a financing company | High | P2 | [AP-2532](https://garantieavantageplus.atlassian.net/browse/AP-2532) — seen again 2026-11-15, commented | Open |
| BUG-004 | AP2503_002 | The extended-warranty Generate Contract page no longer shows the contract preview or the "Open PDF in new tab" link | Medium | P2 | [AP-2563](https://garantieavantageplus.atlassian.net/browse/AP-2563) — new 2026-11-15 | Open |
| BUG-005 | AP2503_008 | Submitting the extended-warranty Generate Contract page with the warranty start date cleared returns HTTP 500 | Medium | P2 | [AP-2564](https://garantieavantageplus.atlassian.net/browse/AP-2564) — new 2026-11-15 | Open |

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
| **Tracker Ticket** | [AP-2530](https://garantieavantageplus.atlassian.net/browse/AP-2530) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2503; 1 screenshot embedded in the description (verified: 1 media node with id); filed 2026-11-02T01:31Z UTC; assignee now Minh Lưu in Jira (read back 2026-11-15T09:52Z, see Ticket Update Log) |
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

**Re-test 2026-11-15 — seen again (Gate C rule C2, comment on AP-2530):**
- Environment: Dev (v2dev), quote 6703 (vehicle 1231, VIN `AP2503TC001111509`, delivery date 2026-11-15). AP-2530 is still open (Backlog, assigned to Minh Lưu).
- The page has been redesigned (Story AP-2544): the right-hand box is now headed **"Product Summary"** and lists Program Term, Program, Term, Start Date (input, 2026-11-15), End date 2035-03-15, Financing company (picker), Sale Price CA$2,500.00, Cost CA$456.00 and Commission CA$2,044.00. **There is still no vehicle delivery date in it.** The delivery date 2026-11-15 appears only as a read-only line in the collapsed "Vehicle identification" card on the left. No delivered Story moves the delivery date out of the summary for an extended warranty (AP-2544 adds it to the Product Summary for Roadside protection only), so AP-2503 acceptance criterion 2 still applies.
- Evidence: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_003-step3-ProductSummaryNoDeliveryDate_fail.png` — the Product Summary of quote 6703 with no delivery date.
- Tracker: comment 19581 (2026-11-15T09:44Z, read back: 1 media node) on AP-2530 (screenshot embedded).

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
| **Tracker Ticket** | [AP-2531](https://garantieavantageplus.atlassian.net/browse/AP-2531) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2503; 2 screenshots embedded in the description (verified: 2 media nodes with ids); filed 2026-11-02T01:31Z UTC; assignee now Minh Lưu in Jira (read back 2026-11-15T09:52Z, see Ticket Update Log) |
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

**Re-test 2026-11-15 — seen again, VIN half only (Gate C rule C2, comment on AP-2531):**
- Environment: Dev (v2dev), quote 6704 (vehicle 1232, VIN `AP2503TC004111509`). AP-2531 is still open (Backlog, assigned to Minh Lưu).
- **The VIN is still an editable input** (not read-only, not disabled): typing `AP2503TC099999999` over it was accepted (AP2503_005 steps 2 and 5).
- **The delivery-date half no longer occurs:** the delivery date is now read-only text (typing `2026-10-15` changed nothing and no calendar opened). Every other vehicle value (Make, Model, Year, Kilometers, Cylinders, Engine size, Transmission, Condition, Turbo / 4x4 / All Wheel Drive) is read-only text too.
- Delivered Story **AP-2544** (Deploy to staging) states: "All inputs are read-only except for the VIN input." That makes the VIN editable on purpose on the redesigned page. **The developer decides whether AP-2544 supersedes AP-2531's VIN half;** the QA keeps AP-2531 open until then, because AP-2503 acceptance criterion 3 says "vehicle identifiers and delivery date are read-only".
- Evidence: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_005-step2-VinAcceptsTypingDeliveryDateText_fail.png` — the VIN input showing AP2503TC099999999, the delivery date 2026-11-15 as read-only text.
- Tracker: comment 19582 (2026-11-15T09:44Z, read back: 1 media node; quotes AP-2544 and leaves the VIN decision to the developer) on AP-2531 (screenshot embedded).

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
| **Tracker Ticket** | [AP-2532](https://garantieavantageplus.atlassian.net/browse/AP-2532) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2503 and Relates → AP-2459; 2 screenshots embedded in the description (verified: 2 media nodes with ids); filed 2026-11-02T01:31Z UTC; assignee now Minh Lưu in Jira (read back 2026-11-15T09:52Z, see Ticket Update Log) |
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

**Re-test 2026-11-15 — seen again (Gate C rule C2, comment on AP-2532):**
- Environment: Dev (v2dev), quote 6705 (vehicle 1233, VIN `AP2503TC007111509`, no financing). AP-2532 is still open (Backlog, assigned to Minh Lưu).
- The six financing-company fields are gone; the redesigned page has **one required "Financing company" picker** in the Product Summary, at "Choose". Clicking **Generate Contract** now posts the form, and the server refuses it: the page comes back at the same address with "ERROR This value should not be blank." under the Financing company picker (red badge "1"); no invoice, no contract. After picking "AutoCapital Canada" (the first company) and clicking again, contract **APOP01-849** and invoice #953 ($456.00) were created — so a contract for a sale without financing still carries a financing company the customer does not have.
- No delivered Story makes the picker required for a quote without financing (AP-2546's required fields are a Roadside exception; AP-2550 is In Progress), so AP-2503 acceptance criteria 1 and 4 still apply.
- Evidence: `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_007-step3-FinancingCompanyBlankRefused_fail.png` — quote 6705 after the refused submit, "This value should not be blank." on the Financing company picker; request lines in `AP2503_007-step3-network_fail.txt`.
- Tracker: comment 19583 (2026-11-15T09:44Z, read back: 1 media node) on AP-2532 (screenshot embedded).

---

### BUG-004 — The extended-warranty Generate Contract page no longer shows the contract preview or the "Open PDF in new tab" link

| Field | Value |
|---|---|
| **Bug ID** | BUG-004 |
| **Test Case** | AP2503_002 (step 4) |
| **Requirement** | AP-2503 REQ-002 — acceptance criterion 1: "… then the form is pre-filled with the quote’s client and vehicle data, the quote PDF preview is shown."; acceptance criterion 2: "“Program Summary”,  a preview of the contract and a submit button are in the right column." |
| **Severity** | Medium — the dealer can no longer read the contract before generating it, so a wrong value is only seen after a permanent contract exists; the contract PDF can still be opened from the quote once the contract is created |
| **Priority** | P2 — it fails two acceptance criteria of AP-2503 and is a regression: the 2026-11-02 run saw both the preview and the link on this page |
| **Environment** | **Environment: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Staging was not checked |
| **Tracker Ticket** | [AP-2563](https://garantieavantageplus.atlassian.net/browse/AP-2563) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Minh Lưu (`bug_new_assign`), linked Relates → AP-2503; 1 screenshot embedded in the description (verified: 1 media node with id); filed 2026-11-15T09:45Z UTC |
| **Status** | Open |
| **First found** | 2026-11-15 |
| **Reproducibility** | Always — quote 6703 (seen on the page of every quote opened in the run: 6703–6707) |

**Summary:**
On the dealer page "Extended Warranty Contract" (`/quote/{id}/warranty/generate-contract`), the right-hand column shows only the "Product Summary" box and the "Generate Contract" button: there is no embedded preview of the contract and no "Open PDF in new tab" link, although AP-2503 asks for a contract preview in the right column.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells extended warranties (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Fill VIN `AP2503TC001111509` (any unused 17-character VIN works), Brand `Toyota` (wait for the Model list to reload), Model `Corolla`, Year `2023`, Vehicle Price `25000`, Kilometers `12000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` (unit Litre), Designation `Particular`, and click **Save**. The page `/vehicle/{vehicleId}/details` opens with "Vehicle saved".
3. On that vehicle page click **Create quote**. Fill First name `Contract`, Last name `Owner2503-001`, Email an unused address such as `client.stage.2503001.111509@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. On the vehicle step keep the vehicle, set Delivered at `2026-11-15` and Price `25000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In "Summary of products", click the **+** button on the "Extended warranty" row. In the modal choose the first program, "Garantie de base AP", its first term (option 1 → 100m/20000km), type Sale price `2500` and click **Save**. "Warranty saved" appears.
5. On the Extended warranty row click the **⋯** menu and then **Generate Contract**. The page "Extended Warranty Contract" opens at `https://v2dev.garantieavantageplus.ca/quote/{id}/warranty/generate-contract`.
6. Look at the right-hand column, below the "Product Summary" box and the "Generate Contract" button.

(A ready example on Dev: quote 6703 has an extended warranty and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6703/warranty/generate-contract` after step 1.)

**Expected Result:**
The right-hand column shows the summary, a preview of the contract and the submit button, as AP-2503 acceptance criteria 1 and 2 say: "the quote PDF preview is shown" and "“Program Summary”, a preview of the contract and a submit button are in the right column". On 2026-11-02 this page showed an "Open PDF in new tab" link and an embedded preview of the draft contract (`/quote/{id}/warranty/pdf`) below the button.

**Actual Result:**
The right-hand column holds only the "Product Summary" box (Program Term, Program, Term, Start Date, End date, Financing company, Sale Price, Cost, Commission) and the "Generate Contract" button. There is no "Open PDF in new tab" link and no embedded preview: the page body contains no `embed`, `object` or `iframe` element and no link to a PDF. The draft PDF itself still exists: `https://v2dev.garantieavantageplus.ca/quote/6703/warranty/pdf` answers HTTP 200 `application/pdf` when typed directly.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step4-RightColumnNoPdfPreview_fail.png` — quote 6703: Product Summary and the Generate Contract button on the right, with no preview and no "Open PDF in new tab" link below |
| Screenshot (previous run, context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_002-step4-RightColumnSummaryPdfButton_pass.png` — the same page on 2026-11-02 (quote 6557), with "Open PDF in new tab" and the embedded draft contract |
| Console log | None captured (only the Freshchat widget errors present on every page) |

**Suggested Root Cause:**
Unknown — for dev investigation. The page was rebuilt as the shared "check out" page by later Stories (AP-2544, AP-2545, AP-2546, AP-2559, AP-2560); none of them mentions the contract preview, so it may have been dropped in that rebuild.

**Notes:**
- No delivered Story removes the preview (Jira search "checkout PDF preview" found none), so AP-2503 acceptance criteria 1 and 2 still apply. If the preview was removed on purpose, AP-2503 should say so.
- Not part of this bug: the left column has no "Financing information" card on a quote without GAP/Creditor insurance, which delivered Story AP-2559 defines.
- Related: AP-2503 (the story whose acceptance criteria this fails).

---

### BUG-005 — Submitting the extended-warranty Generate Contract page with the warranty start date cleared returns HTTP 500

| Field | Value |
|---|---|
| **Bug ID** | BUG-005 |
| **Test Case** | AP2503_008 (step 4) |
| **Requirement** | AP-2503 REQ-005 — acceptance criterion 4: "Given valid form values, when the dealer submits, then contract is created following the current process" (an invalid value must be refused with a message, not crash the page); objective fault — an application error page |
| **Severity** | Medium — a dealer who clears the start date gets the application's error page and loses every value typed on the page; no contract is created and nothing stored is damaged, and leaving a date in the field avoids it |
| **Priority** | P2 — a server error on the main form of AP-2503 that any dealer can reach by emptying one field |
| **Environment** | **Environment: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Staging was not checked |
| **Tracker Ticket** | [AP-2564](https://garantieavantageplus.atlassian.net/browse/AP-2564) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Minh Lưu (`bug_new_assign`), linked Relates → AP-2503; 1 screenshot embedded in the description (verified: 1 media node with id); filed 2026-11-15T09:45Z UTC |
| **Status** | Open |
| **First found** | 2026-11-15 |
| **Reproducibility** | Always — 2 of 2 tries on quote 6706 (the second from a fresh load of the page) |

**Summary:**
On the dealer page "Extended Warranty Contract" (`/quote/{id}/warranty/generate-contract`), clicking **Generate Contract** with the "Start Date" field of the "Product Summary" cleared returns HTTP 500 and the application error page "Erreur — Désolé, l'application éprouve des difficultés techniques" instead of refusing the empty date with a message.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells extended warranties (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/new/edit/PASSENGER` ("Add a vehicle"). Fill VIN `AP2503TC008111509` (any unused 17-character VIN works), Brand `Toyota` (wait for the Model list to reload), Model `Corolla`, Year `2023`, Vehicle Price `25000`, Kilometers `12000`, Condition `new`, Fuel type `GASOLINE`, Transmission `Automatic`, Cylinders `4`, Engine size `1.8` (unit Litre), Designation `Particular`, and click **Save**. The page `/vehicle/{vehicleId}/details` opens with "Vehicle saved".
3. On that vehicle page click **Create quote**. Fill First name `Contract`, Last name `Owner2503-008`, Email an unused address such as `client.stage.2503008.111509@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. On the vehicle step keep the vehicle, set Delivered at `2026-11-15` and Price `25000`, and click **Save**. The quote page `/quote/{id}/details` opens.
4. In "Summary of products", click the **+** button on the "Extended warranty" row. In the modal choose the first program, "Garantie de base AP", its first term (option 1 → 100m/20000km), type Sale price `2500` and click **Save**. "Warranty saved" appears.
5. On the Extended warranty row click the **⋯** menu and then **Generate Contract**. On the page `/quote/{id}/warranty/generate-contract`, in the "Product Summary" box, choose "AutoCapital Canada" in **Financing company** (the page requires one), then select all the text of **Start Date** and delete it so the field is empty.
6. Click **Generate Contract**.

(A ready example on Dev: quote 6706 has an extended warranty and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6706/warranty/generate-contract` after step 1, then do steps 5–6.)

**Expected Result:**
The empty start date is refused with a message beside the Start Date field, the page stays at `/quote/{id}/warranty/generate-contract` with the other values kept, and no contract is created — the way the same page already refuses an empty Last name ("This value should not be blank." inside the owner card). AP-2503 acceptance criterion 4 creates a contract only "Given valid form values".

**Actual Result:**
`POST https://v2dev.garantieavantageplus.ca/quote/6706/warranty/generate-contract` answers **500**. The page shows "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." with "Aller à l'accueil", and every value typed on the page is lost. The same happened again after reloading the page and repeating steps 5–6. No contract was created: `/warranty` has no row for VIN `AP2503TC008111509`, and quote 6706 still offers "Generate Contract".

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-EmptyStartDateHttp500_fail.png` — the "Erreur" error page after clicking Generate Contract with the Start Date cleared |
| Network | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2503/AP2503_008-step4-network_fail.txt` — `POST /quote/6706/warranty/generate-contract 500` (method, URL, status only) |
| Console log | None captured (only the Freshchat widget errors present on every page) |

**Suggested Root Cause:**
Unknown — for dev investigation. The server checks other required fields (an empty Last name or Financing company comes back with a message), so the start date is probably used before it is checked.

**Notes:**
- Related: AP-2503 (the story whose form this is).

---

## Defect Distribution

_Five problems on the redesigned Generate Contract page: one blocks contracts for sales without financing, three are differences from the acceptance criteria (missing delivery date, editable VIN, missing contract preview), and one crashes the submit when the start date is empty._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2503_007 |
| Medium | 4 | AP2503_002, AP2503_003, AP2503_005, AP2503_008 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Dedicated page at the unchanged route | 0 | — |
| REQ-002 — Two-column layout with PDF preview | 1 | BUG-004 |
| REQ-003 — Program Summary content | 1 | BUG-001 |
| REQ-004 — Pre-fill and read-only / editable fields | 1 | BUG-002 |
| REQ-005 — Submit creates the contract | 2 | BUG-003, BUG-005 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-02T01:35Z (UTC) — 2026-11-02 run; 2026-11-15 run: s5 rows at 09:44–09:45Z, s7 rows at 09:52Z

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2530 | Filed in s5 (new, rule C4), assigned to Ken Nguyen, linked to AP-2503; no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog | 2026-11-02T01:31Z |
| BUG-002 | AP-2531 | Filed in s5 (new, rule C4), assigned to Ken Nguyen, linked to AP-2503; no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog | 2026-11-02T01:31Z |
| BUG-003 | AP-2532 | Filed in s5 (new, rule C4), assigned to Ken Nguyen, linked to AP-2503 and AP-2459; no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog | 2026-11-02T01:31Z |
| — (story) | AP-2503 | Story result comment 19456 posted (FAIL, 7/10, Tested on: Dev (v2dev), Staging not checked; all 11 open questions; APOP01-846/847 financing-company note) and read back; status not changed — pass rate 70% (needs 90%), AP-2532 (High) stopping | QC (unchanged) | 2026-11-02T01:35Z |
| BUG-001 | AP-2530 | s5 2026-11-15: seen again (rule C2) — comment 19581 posted with the AP2503_003 step 3 screenshot, read back | Backlog (unchanged) | 2026-11-15T09:44Z |
| BUG-002 | AP-2531 | s5 2026-11-15: seen again, VIN only (rule C2) — comment 19582 posted with the AP2503_005 step 2 screenshot, quoting AP-2544 "All inputs are read-only except for the VIN input." and leaving to the developer whether AP-2544 supersedes the VIN half; read back | Backlog (unchanged) | 2026-11-15T09:44Z |
| BUG-003 | AP-2532 | s5 2026-11-15: seen again (rule C2) — comment 19583 posted with the AP2503_007 step 3 screenshot, read back | Backlog (unchanged) | 2026-11-15T09:44Z |
| BUG-004 | AP-2563 | s5 2026-11-15: filed new (rule C4), priority Medium, assigned to Minh Lưu, Relates → AP-2503, 1 screenshot embedded and verified | Backlog | 2026-11-15T09:45Z |
| BUG-005 | AP-2564 | s5 2026-11-15: filed new (rule C4), priority Medium, assigned to Minh Lưu, Relates → AP-2503, 1 screenshot embedded and verified | Backlog | 2026-11-15T09:45Z |
| BUG-001 | AP-2530 | s7 2026-11-15: assignee read back as Minh Lưu in Jira (the rows above and the Tracker Ticket row say Ken Nguyen, the 2026-11-02 assignee) — file record corrected only, no tracker change (R4 round 1 minor F-2); no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog (unchanged) | 2026-11-15T09:52Z |
| BUG-002 | AP-2531 | s7 2026-11-15: assignee read back as Minh Lưu in Jira (the rows above and the Tracker Ticket row say Ken Nguyen, the 2026-11-02 assignee) — file record corrected only, no tracker change (R4 round 1 minor F-2); no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog (unchanged) | 2026-11-15T09:52Z |
| BUG-003 | AP-2532 | s7 2026-11-15: assignee read back as Minh Lưu in Jira (the rows above and the Tracker Ticket row say Ken Nguyen, the 2026-11-02 assignee) — file record corrected only, no tracker change (R4 round 1 minor F-2); no Gate D action — in Backlog, not the QA status (routing §3.2) | Backlog (unchanged) | 2026-11-15T09:52Z |
| BUG-004 | AP-2563 | s7 2026-11-15: no Gate D action — in Backlog, not the QA status (routing §3.2); assignee Minh Lưu read back | Backlog (unchanged) | 2026-11-15T09:52Z |
| BUG-005 | AP-2564 | s7 2026-11-15: no Gate D action — in Backlog, not the QA status (routing §3.2); assignee Minh Lưu read back | Backlog (unchanged) | 2026-11-15T09:52Z |
| — (story) | AP-2503 | s7 2026-11-15: story result comment 19584 posted (FAIL, 5/10 = 50%, Dev (v2dev); text approved at R4 round 1, 21 lines, wiki markup via REST v2) and read back — body identical to qa-artifacts/4-execution-results/comment_AP-2503_2026-11-15.md, author Vinh Le - QC; status not changed — pass rate 50% (needs 90%), AP-2532 (High) open; assignee Vinh Le - QC unchanged | QC (unchanged) | 2026-11-15T09:51Z |

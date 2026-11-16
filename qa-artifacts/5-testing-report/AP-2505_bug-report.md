# Bug Report — AP-2505

**Project:** Avantage Plus v2 — Dealer portal (Jira project AP)
**Report ID:** BR-20261107-001 (replaces BR-20261103-001; the 2026-11-03 filing is kept in the Ticket Update Log)
**Test Cycle:** AP-2505 — Generate contract for a quote's Roadside protection product — re-test after fix (test plan rule P6), run folder `no-sprint`
**Date:** 2026-11-07
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2505_2026-11-07.md (including the sections "Re-run after review R3 round 1" and "Re-run after review R3 round 2"), qa-artifacts/3-test-cases/AP2505_TestCases_001-005.md, qa-artifacts/3-test-cases/AP2505_TestCases_006-010.md
**Environment:** Dev (v2dev) — https://v2dev.garantieavantageplus.ca/ · Dealer portal, dealer 1380 "Test QA staging" · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · footer "Avantage Plus System v2.0.0"
**Gate C decision:** independent reviewer, R3 round 3, APPROVE (2026-11-07T10:59:09Z, qa-artifacts/7-reviews/AP-2505_review.md) — rule C4 (file new) for AP2505_001/_002/_003 (one bug, AC 2) and AP2505_005 (one bug, AC 3); AP2505_007/_008/_010 no bug (the contract is created); AP-2518 not reproduced — comment only

| Metric | Value |
|---|:---:|
| Total defects | 3 (2 new this run, 1 earlier bug not reproduced) |
| Critical | 0 |
| High | 2 (BUG-001 AP-2518 — not reproduced; BUG-003 new) |
| Medium | 1 (BUG-002 new) |
| Low | 0 |
| Tracker tickets created | 2 this run — AP-2553 (BUG-002), AP-2554 (BUG-003) |

On 2026-11-07, Dev's roadside contract page opened correctly, so AP-2518 (the HTTP 500 / "Loading..."
fault filed on 2026-11-03) did not reproduce. The page does not match the story, though. Its section
headings and columns differ from acceptance criterion 2 (BUG-002). Its financing values are neither
pre-filled from the quote nor read-only, which criterion 3 requires, and a contract generated from it is
saved with the wrong financing (BUG-003). Four test cases failed: AP2505_001, _002 and _003 on BUG-002,
and AP2505_005 on BUG-003.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2505_001 (step 3), AP2505_002 (step 4) on 2026-11-03 | Opening the roadside contract page of a quote returns HTTP 500, and its "Generate Contract" pop-up stays on "Loading..." — **not reproduced on Dev 2026-11-07** | High | P1 | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) — existing; commented 2026-11-03 and 2026-11-07 | Open (Backlog) — candidate for closure |
| BUG-002 | AP2505_001 (steps 3, 5), AP2505_002 (step 5), AP2505_003 (step 3) | The roadside contract page shows "Product Summary" and "Owner identification" and has no "Financing information" section in the left column | Medium | P2 | [AP-2553](https://garantieavantageplus.atlassian.net/browse/AP-2553) | Open (Backlog) |
| BUG-003 | AP2505_005 (steps 3, 5); evidence from AP2505_008 | The roadside contract page does not pre-fill the quote's financing, lets the dealer change every financing value, and saves the contract as "Cash" with no lender | High | P1 | [AP-2554](https://garantieavantageplus.atlassian.net/browse/AP-2554) | Open (Backlog) |

---

## Bug Details

---

### BUG-001 — The roadside contract page returns HTTP 500 and the "Generate Contract" pop-up stays on "Loading..." (not reproduced on Dev 2026-11-07)

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2505_001 (step 3) and AP2505_002 (step 4) on 2026-11-03. On 2026-11-07 both reached and passed that step (the page opened, HTTP 200) |
| **Requirement** | REQ-001 — AC 1: "… then /quote/{quoteId}/road-side-protection-create-contract opens in the same tab with no modal." |
| **Severity** | High — on 2026-11-03 a dealer could not open the roadside contract page from any quote |
| **Priority** | P1 |
| **Environment** | Dev (v2dev), dealer 1380, Chromium |
| **Tracker Ticket** | [AP-2518](https://garantieavantageplus.atlassian.net/browse/AP-2518) (existing, High, Backlog) — 2026-11-07 not-reproduced comment 19512 |
| **Status** | Open — **not reproduced on Dev 2026-11-07**; candidate for closure by the triager. QA makes no status change |
| **First found** | 2026-11-02 (AP-2494 run); in this ticket's run on 2026-11-03 |
| **Reproducibility** | 2026-11-03: always (6 of 6 quotes). 2026-11-07: 0 of 8 quotes |

**Summary:**
On 2026-11-03, choosing "Generate Contract" in the ⋯ menu of a quote's Roadside Protection row opened a pop-up that stayed on "Loading...", and `/quote/{quote id}/road-side-protection-create-contract` returned HTTP 500. On 2026-11-07 neither happens.

**Steps to Reproduce (2026-11-03):**

1. Open https://v2dev.garantieavantageplus.ca/login and sign in to the Dealer portal with the QA dealer account (dealer 1380).
2. Open `/vehicle/new/edit/PASSENGER` and add a vehicle: VIN `2T1BURHE0NC505001`, Make "Toyota", Model "Corolla", Year 2022, then click "Save".
3. On the vehicle's details page click "Create quote", fill the client form (First name "Roadside", Last name "Owner2505-001", Email `client.stage.2505001@yopmail.com`, Address "300 Rue Test", City "Montréal", Province "Québec", Postal code "H2X 1Y4", Home phone `5145550501`, tick "I agree to the policy") and click "Save".
4. Add a financing to the quote, then on the Roadside Protection row choose "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$", type Policy Sale price 250 and click "Save".
5. Open the Roadside Protection row's ⋯ menu and click "Generate Contract".

**Expected Result:**
Per AC 1, `/quote/{quoteId}/road-side-protection-create-contract` opens in the same tab with no pop-up.

**Actual Result:**
2026-11-03: a pop-up stayed on "Loading..." and the page answered HTTP 500 (quotes 6568–6573). 2026-11-07: the menu item is a plain link (`a.dropdown-item small`, no `data-toggle="modal"`, no `data-target`), opens the page in the same tab, and `GET /quote/{id}/road-side-protection-create-contract` returns HTTP 200 on quotes 6593, 6595, 6596, 6597, 6598, 6599, 6568 and 6570. A contract was generated from the page (quote 6597, contract 2782).

**Evidence:**

| Type | Path / Link |
|---|---|
| Network lines (2026-11-07) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-Nov07-network_fail.txt` — link markup and `GET … => 200` on the quotes above |
| Screenshot (2026-11-03) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-ModalStuckLoading_fail.png` |
| Network lines (2026-11-03) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-network_fail.txt` |

**Notes:**
- Gate C round 3 item 5: one comment on AP-2518 (text set by the reviewer), no status move and no assignee change.

---

### BUG-002 — The roadside contract page shows "Product Summary" and "Owner identification" and has no "Financing information" section in the left column

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2505_001 (steps 3 and 5), AP2505_002 (step 5), AP2505_003 (step 3) |
| **Requirement** | REQ-002 — AC 2: "Given the page has loaded, when the dealer inspects it, then it shows the “Owner information”, “Financing information” in the left column, and “Vehicle identification”, “Program Summary” with a “Generate Contract” button in a right column." |
| **Severity** | Medium — the page works and the contract can be generated, but its layout and section names are not the ones the story specifies, and the financing values are not where the dealer is told to find them |
| **Priority** | P2 |
| **Environment** | Dev (v2dev) · Dealer portal, dealer 1380 · Chromium · viewport 1280 × 800 · Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2553](https://garantieavantageplus.atlassian.net/browse/AP-2553) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2505; description in wiki markup through REST v2; 2 screenshots embedded and the network .txt attached (read back: 3 media nodes with ids, 1 ordered list, 1 h3 heading) |
| **Status** | Open |
| **First found** | 2026-11-07 |
| **Reproducibility** | Always — 3 of 3 quotes (6593, 6595, 6596), by the ⋯ menu and by typing the address |

**Summary:**
On the roadside contract page `/quote/{quote id}/road-side-protection-create-contract`, the right section is titled "Product Summary" instead of "Program Summary", the left section is titled "Owner identification" instead of "Owner information", and there is no "Financing information" section in the left column — the financing values are rows of "Product Summary" on the right.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/login and sign in to the Dealer portal with the QA dealer account (dealer 1380).
2. Open `/vehicle/new/edit/PASSENGER?_locale=en` and add a vehicle: VIN `2T1BURHE0NC505001` (any unused 17-character VIN), Brand "Toyota", Model "Corolla", Year 2022, Vehicle Price 20000, Kilometers 15000, Condition "used", Fuel type "GASOLINE", Transmission "Automatic", Cylinders 4, Engine size 1.8, unit "Litre", Designation "Particular", then click "Save" ("Vehicle saved").
3. On `/vehicle/{vehicle id}/details` click "Create quote" and fill the client form: First name "Roadside", Last name "Owner2505-001", Email `client.stage.2505001@yopmail.com`, Address "300 Rue Test", City "Montréal", Province "Québec", Postal code "H2X 1Y4", Home phone `5145550501`, Work phone `5145550502`, tick "I agree to the policy", click "Save". On `/quote/{quote id}/vehicle` set Delivered at to today's date and Price 20000, click "Save".
4. Open `/quote/{quote id}/financing` and enter Date of birth 1985-06-15, Province "Québec", Type "Financing", Net amount financed 25000, Residual 0, Payment frequency "Monthly", Term months 60, Interest rate 6.99, Financing company "AutoCapital Canada", click "Save" ("Financing saved").
5. On the quote page, on the Roadside Protection row choose "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$", type Policy Sale price 250 and click "Save" ("The Roadside protection coverage has been saved successfully").
6. Open the Roadside Protection row's ⋯ menu, click "Generate Contract", and look at the section headings and which column each is in.

**Expected Result:**
Per AC 2, the left column shows "Owner information" and "Financing information", and the right column shows "Vehicle identification" and "Program Summary" with the "Generate Contract" button.

**Actual Result:**
The page (HTTP 200, same tab) has a left column (`col-md-7`) with "Vehicle identification" and "Owner identification", and a right column (`col-md-5`) with "Product Summary" and the "Generate Contract" button. The text "Program Summary" appears nowhere on the page, and neither do "Owner information" or "Financing information". The financing values (Purchase type, Financed amount, Interest rate, Financing company) are rows of "Product Summary" in the right column. Seen on quotes 6593 (with a GAP quote), 6595 (no GAP quote) and 6596 (no financing).

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_003-step3-Nov07ColumnsNoFinancingSection_fail.png` — quote 6593: left "Vehicle identification" + "Owner identification", right "Product Summary" with the financing rows and the button |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-Nov07PageOpensProductSummary_fail.png` — the same page opened from the ⋯ menu |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_002-step5-Nov07PageOpensProductSummary_fail.png` — quote 6595 (no GAP quote), same headings |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step5-Nov07DirectAddressProductSummary_fail.png` — the page opened by typing its address |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_001-step3-Nov07-network_fail.txt` — request lines and the headings found |

**Suggested Root Cause:**
Unknown — for dev investigation. The page may reuse the AutoShield contract form's own headings rather than the Esthetic protection layout the description asks to match.

**Notes:**
- AC 1's navigation is met: same tab, no pop-up, address unchanged (round-1 F-4). AP2505_001 fails only on the AC 2 heading.
- Where "Vehicle identification" belongs is the open Blocking question Q-001 on AP-2505 (the description and AC 2 disagree). This bug does not judge that column; it is about the missing and renamed sections.
- Gate C (R3 round 3, rule C4): duplicate searches found no open bug naming the roadside create-contract page with this behaviour.

---

### BUG-003 — The roadside contract page does not pre-fill the quote's financing, lets the dealer change it, and saves the contract as "Cash" with no lender

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2505_005 (steps 3 and 5). Evidence, not a failing case: AP2505_008 (contract 2782) |
| **Requirement** | REQ-003 — AC 3: "Given the quote has a vehicle, a client, or a financing, when the page renders, then vehicle client and financing values are pre-filled and financing is read-only" |
| **Severity** | High — a dealer who keeps the pre-filled values generates a contract that records a financed sale as a cash sale with no lienholder, and the lender the quote names cannot even be chosen |
| **Priority** | P1 |
| **Environment** | Dev (v2dev) · Dealer portal, dealer 1380 · Chromium · viewport 1280 × 800 · Avantage Plus System v2.0.0 |
| **Tracker Ticket** | [AP-2554](https://garantieavantageplus.atlassian.net/browse/AP-2554) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2505; description in wiki markup through REST v2; 4 screenshots embedded (read back: 4 media nodes with ids, 1 ordered list, 1 h3 heading) |
| **Status** | Open |
| **First found** | 2026-11-07 |
| **Reproducibility** | Always — quotes 6593, 6597, 6598, 6599 all show Purchase type CASH and Financing company "Choose"; contract saved wrong once of once (2782) |

**Summary:**
On the roadside contract page `/quote/{quote id}/road-side-protection-create-contract` of a financed quote, the financing is not pre-filled (Purchase type shows "CASH" and Financing company shows "Choose"), every financing value can be changed, and a contract generated with the pre-filled values is saved with purchase type CASH and no lender.

**Steps to Reproduce:**

1. Open https://v2dev.garantieavantageplus.ca/login and sign in to the Dealer portal with the QA dealer account (dealer 1380).
2. Open `/vehicle/new/edit/PASSENGER?_locale=en` and add a vehicle: VIN `2T1BURHE0NC505007` (any unused 17-character VIN), Brand "Toyota", Model "Corolla", Year 2022, Vehicle Price 20000, Kilometers 15000, Condition "used", Fuel type "GASOLINE", Transmission "Automatic", Cylinders 4, Engine size 1.8, unit "Litre", Designation "Particular", then click "Save" ("Vehicle saved").
3. On `/vehicle/{vehicle id}/details` click "Create quote" and fill the client form: First name "Roadside", Last name "Owner2505-007", Email `client.stage.2505007@yopmail.com`, Address "300 Rue Test", City "Montréal", Province "Québec", Postal code "H2X 1Y4", Home phone `5145550501`, Work phone `5145550502`, tick "I agree to the policy", click "Save". On `/quote/{quote id}/vehicle` set Delivered at to today's date and Price 20000, click "Save".
4. Open `/quote/{quote id}/financing` and enter Date of birth 1985-06-15, Province "Québec", Type "Financing", Net amount financed 25000, Residual 0, Payment frequency "Monthly", Term months 60, Interest rate 6.99, Financing company "AutoCapital Canada", click "Save" ("Financing saved"). On the quote page, on the Roadside Protection row choose "Protection Hasards PNEU + ROUE | Standard | 12 months | 200$", type Policy Sale price 250 and click "Save".
5. Open the Roadside Protection row's ⋯ menu and click "Generate Contract". Look at Purchase type and Financing company, open the Financing company list, then type a character into Financed amount and Interest rate and pick another Purchase type and Financing company. **Wrong result:** Purchase type is "CASH", Financing company is "Choose" and its list has no "AutoCapital Canada"; every change is accepted.
6. Reload the page, keep every pre-filled value, fill Stock number `STK2505007`, In service date `2022-06-01` and Home phone `514-555-0501`, and click "Generate Contract" once. On the quote page click "Contract #<id>" on the Roadside Protection row and open the "en" PDF. **Wrong result:** the contract shows purchaseType CASH and an empty lender, and the PDF ticks "Cash" with an empty lienholder.

**Expected Result:**
Per AC 3, the financing values are pre-filled from the quote — Financing company "AutoCapital Canada", a financed purchase type, 25000, 6.99 — and are read-only. A contract generated from the page carries the quote's financing.

**Actual Result:**
(a) Not read-only: Financed amount (typed "X" → `25000.00X`), Interest rate (→ `6.9900X`), Purchase type (→ FINANCE) and Financing company (→ "FÉDÉRATION DES CAISSES DESJARDINS DU QUÉBEC …") all accept a change. (b) Not pre-filled: Financing company shows "Choose" and its list does not contain AutoCapital Canada; Purchase type shows CASH on a quote whose financing type is Financing (Financed amount 25000.00 and Interest rate 6.9900 are pre-filled). (c) Consequence: contract 2782, generated on quote 6597 (financing "Financing, 60 months, AutoCapital Canada") with the pre-filled values, was saved with purchaseType CASH, financedAmount 25000, interestRate 6.99 and an empty lender, and both its English and French PDFs tick "Cash" / "Comptant" with an empty lienholder.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_005-step3-Nov07PrefillCompanyEmptyCash_fail.png` — quote 6593's page as opened: Purchase type CASH, Financing company "Choose" (byte-identical to AP2505_003-step3-Nov07ColumnsNoFinancingSection_fail.png, md5 6ca30ea8…: the same unsubmitted page state of quote 6593 serves both steps) |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_005-step5-Nov07FinancingEditable_fail.png` — after the changes: 25000.00X, 6.9900X, FINANCE, FÉDÉRATION DES CAISSES … all accepted |
| Screenshot (AP2505_008, evidence) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step3-Nov07r3ContractDetails2782_pass.png` — contract 2782 details: purchaseType CASH, lender empty |
| Screenshot (AP2505_008, evidence) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step5-Nov07r3PdfEn_pass.png` — contract 2782 English PDF: "Cash" ticked, lienholder empty |
| Screenshot (AP2505_008, evidence, not uploaded) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2505/AP2505_008-step5-Nov07r3PdfFr_pass.png` — French PDF: "Comptant" ticked |

**Suggested Root Cause:**
Unknown — for dev investigation. The Financing company list on this page (Fédération des caisses Desjardins, BMO, Banque Scotia …) is a different list from the quote financing page's lender list (AutoCapital Canada …), so the quote's lender cannot be pre-selected.

**Notes:**
- Gate C (R3 round 3, rule C4): no open bug names a contract saved as Cash on a financed quote, or this page's financing fields. AP-2512 (another ticket) concerns a different contract page.
- Data left on Dev: contract 2782 (RHTWQ-2782, OPEN_SUBMITTED) on quote 6597 / vehicle 1152.

---

## Observations — not filed

Recorded by the reviewer's Gate C (R3 round 3, item 4): no FAIL, no stated wording and no objective fault, so none of these is filed. The s7 story comment asks the developer about them.

- The page pre-fills Home phone `5145550501`, which the contract submit refuses; with `514-555-0501` the contract was created.
- A submit refused by validation still saved Stock number and In service date to the quote (seen when the page was reopened for quote 6597).
- Contract 2782's details page shows Total Tax CAD 0, while both PDFs show Taxes 29.95.
- Contract 2782 carries vehicleConditionCode "used" together with purchaseState "New" and isNew 1.
- The French PDF viewer shows 5 pages while its footer reads "Page 1 de 8".

**s7 developer question (word for word, for the AP-2505 story comment):** "The roadside contract page pre-fills Home phone `5145550501` from the client record (the client form accepted it), and Generate Contract is then refused with 'One or more validation errors occurred.The phone number is invalid. Please ensure it follows the format: ###-###-####.' (quotes 6597, 6599, Dev 2026-11-07). With the phone typed as `514-555-0501` the same submit created contract 2782 on quote 6597 and saved the dashed phone back to the client. Should the page format the pre-filled phone, or should the client form require the ###-###-#### format? A dealer who keeps the pre-filled values cannot generate the contract." Followed by the other four observations in one sentence as "recorded, not judged — please confirm whether any is unintended".

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 2 | BUG-003: AP2505_005 (FAIL), evidence AP2505_008. BUG-001 (AP-2518): no case on 2026-11-07 — not reproduced |
| Medium | 1 | BUG-002: AP2505_001, AP2505_002, AP2505_003 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — Dedicated page at the unchanged address | 1 | BUG-001 (AP-2518, not reproduced 2026-11-07) |
| REQ-002 — Two-column layout | 1 | BUG-002 (AP2505_004 BLOCKED by Q-001) |
| REQ-003 — Pre-fill and read-only financing | 1 | BUG-003 |
| REQ-004 — Submit creates the contract | 0 | — (AP2505_007, _008, _009, _010 PASS) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-03, 2026-11-07

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2518 | Gate C rule C2: comment 19464 posted (Environment: Dev) with 4 screenshots embedded and the network .txt attached (attachments 14222–14226; read back: 5 media nodes resolved); link AP-2518 relates to AP-2505 added and read back on both tickets. No new bug filed | Backlog (unchanged — not in a QA status, so no Gate D action) | 2026-11-03T05:37:56Z |
| — | AP-2505 | Gate D: story result comment 19465 posted (Environment: Dev; FAIL, 10 TC rows, deployment question to the developer, Q-001–Q-012) and read back. Not moved: pass rate 0% (needs 90%), AP-2518 open, Q-001 unanswered | QC (unchanged) | 2026-11-03T05:39:19Z |
| BUG-001 | AP-2518 | Gate C round 3 item 5 (by reviewer): not-reproduced comment **19512** posted once through REST v2 (Environment: Dev; reviewer's text word for word, code in monospace, the network .txt attached as 14292 and linked); checked beforehand that no 2026-11-07 comment existed; read back via v3 (2 comments, 1 media node). No status move, no assignee change | Backlog (unchanged), assignee Ken Nguyen (unchanged), High | 2026-11-07T11:05:48Z |
| BUG-002 | AP-2553 | Created (Gate C round 3 item 1, rule C4, by reviewer): CLI placeholder, then wiki-markup description via REST v2 (204); attachments 14285–14287 (2 screenshots embedded, network .txt linked); assigned Ken Nguyen; linked Relates → AP-2505. Read back via v3 | Backlog (new), Medium | 2026-11-07T11:04:30Z |
| BUG-003 | AP-2554 | Created (Gate C round 3 item 2, rule C4, by reviewer): CLI placeholder, then wiki-markup description via REST v2 (204) with parts (a)–(c); attachments 14288–14291 (4 screenshots embedded, incl. AP2505_008's contract 2782 details and English PDF); assigned Ken Nguyen; linked Relates → AP-2505. Read back via v3 | Backlog (new), High | 2026-11-07T11:04:30Z |
| — | AP-2505 | No change in this dispatch (orchestrator: no status/assignee change, no s7 comment) | QC (unchanged) | 2026-11-07T11:06:00Z |
| — | AP-2505 | Gate D — by reviewer (R4 round 1, APPROVE), rules §3.1: story result comment **19513** posted once through REST v2 wiki markup (Environment: Dev; the R4 text word for word, author Nicolas-Eric Tain mentioned as [~accountid:557058:fd7f3bd0-545e-44ce-835d-ab014a39ed06] at the start of the Questions line; the two `###-###-####` strings escaped as `###\-###\-####` after the first read-back showed Jira rendering the middle `-###-` as strikethrough, comment edited, HTTP 200); checked beforehand that no 2026-11-07 QA comment existed (2 comments: 19461, 19465). Read back via v3: 1 h3, 1 mention, 2 code spans, 0 strike marks, `###-###-####` shown twice; ticket shows 3 comments. Not moved: pass rate 50% (needs 90%), AP-2554 and AP-2518 (High) open, Q-001 unanswered. No §3.2 action on AP-2553 / AP-2554 / AP-2518 (none in a QA status); no further comment on AP-2518 | QC (unchanged, read back), assignee Vinh Le - QC (unchanged, read back) | 2026-11-07T11:13:09Z |

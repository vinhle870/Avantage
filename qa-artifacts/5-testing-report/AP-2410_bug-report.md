# Bug Report

**Project:** Avantage Plus (AP) — Dealer portal
**Report ID:** BR-20261108-001
**Test Cycle:** AP-2410 bug re-test (Chubb Insurance Quote "Get Quote" error) — run folder `no-sprint`
**Date:** 2026-11-08
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2410_2026-11-08.md and qa-artifacts/3-test-cases/AP2410_TestCases_001-004.md
**Environment:** Dev (v2dev) — `https://v2dev.garantieavantageplus.ca`

The re-test itself passed (4 of 4 test cases). Neither bug below is a failed step: both are
faults seen while running passing cases, which the independent reviewer decided at Gate C
(review R3 round 3, 2026-11-08) to file as new bugs. Neither changes AP-2410's result.

| Metric | Value |
|---|:---:|
| Total defects | 2 |
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 0 |
| Tracker tickets created | 2 |

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2410_002 | Reopening the creditors insurance form of a PM50 quote shows Form "Monthly Premium PM30" | Medium | P2 | [AP-2557](https://garantieavantageplus.atlassian.net/browse/AP-2557) | Open |
| BUG-002 | AP2410_004 | A co-applicant saved with only name and date of birth shows another client's email and phone | Medium | P2 | [AP-2558](https://garantieavantageplus.atlassian.net/browse/AP-2558) | Open |

**Filing record (2026-11-08T04:11Z, Gate C by reviewer — R3 round 3, rule C4 File new for both):**
both created in Jira as Bug, priority Medium (canonical `normal`, from severity Medium), labels
`qa-agent` and `stlc-automated`, status Backlog, assigned to Minh Lưu (`bug_new_assign`; account
id read back matches the registry). AP-2557 relates to AP-2410 and AP-2528; AP-2558 relates to
AP-2410 and AP-2541. Each description is condensed to the bug description shape (13 and 12
text lines) and its screenshots are embedded in the description, not in a comment: AP-2557 2 of
2 and AP-2558 1 of 1, verified through the v3 read-back (each image is a `media` node with a
resolved id). The AP-2558 summary carries no contact values (orchestrator instruction); its
description states them once, with their source.

---

## Bug Details

---

### BUG-001 — Reopening the creditors insurance form of a quote saved with rate table PM50 shows Form "Monthly Premium PM30"

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2410_002 (seen again in AP2410_004, both runs) |
| **Requirement** | AP-2410 — "Submit successfully" (bug re-test); the fault is on the same Chubb creditors insurance form |
| **Severity** | Medium — the quote is saved correctly, but a dealer who reopens a PM50 quote to change anything and presses Get Quote re-prices it as PM30 without noticing; the workaround is to choose the Form again every time |
| **Priority** | P2 |
| **Environment** | Dev (v2dev) · Chromium (Playwright) 1280 × 800 · Dealer portal, Dealer 1380 |
| **Tracker Ticket** | [AP-2557](https://garantieavantageplus.atlassian.net/browse/AP-2557) |
| **Status** | Open |
| **First found** | 2026-11-08 |
| **Reproducibility** | Always (3 of 3 reopenings: AP2410_002 step 5, AP2410_004 first run step 2, AP2410_004 re-run step 5 — no Form option is ever marked selected) |
| **Links** | relates to AP-2410; relates to AP-2528 (same form, different behaviour: Get Quote closes the modal) |

**Summary:**
When the dealer reopens the Creditors Insurance Quote form (`/quote/{id}/insurance`) of a quote whose Chubb quote was saved with rate table PM50, the Form field shows "Monthly Premium PM30" instead of the saved "Monthly Premium PM50", so pressing Get Quote again would re-price the quote as PM30.

**Steps to Reproduce:**

1. Sign in to the Dealer portal on Dev (`https://v2dev.garantieavantageplus.ca/login`) with the Dealer 1380 account.
2. Open `/quote/6696/insurance` (quote 6696, client Retest Chubb2410-001, financing 25,000.00$, 12 months, AutoCapital Canada) — or any quote with a client and a financing.
3. Set Language "Français", Tax exempt "No", Form "Monthly Premium PM50" (value `GC6201MQ:PM50`); then (choosing the Form clears the Life type) Life type "Decreasing", Term `12`, For "Borrower"; leave Critical illness and Disability empty.
4. Click **Get Quote** — the page returns to `/quote/6696/details` with "Chubb insurance quote saved successfully"; open the chevron of the Creditors insurance row: "Rate table: PM50 · Language: Français", premium CA$21.78 /m.
5. Open `/quote/6696/insurance` again and read the Form field.

**Expected Result:**
The reopened form shows every saved value, including Form "Monthly Premium PM50", so that pressing Get Quote again keeps the saved rate table.

**Actual Result:**
The reopened form shows Language "Français", Tax exempt "No" and the saved Life coverage, but Form shows "Monthly Premium PM30": the page marks no Form option as selected, so the browser shows the first option. Pressing Get Quote now would save the quote as PM30.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot (failing state) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_002-step5-ReopenedFormShowsPM30NotSavedPM50_pass.png` — reopened form: Language Français kept, Form "Monthly Premium PM30" |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_002-step5-CreditorsRowCoveragePM50Francais_pass.png` — the saved quote: Rate table PM50, Français, CA$21.78 /m |
| Console log | None captured |

The screenshot names end in `_pass` because the step under test (the save) passed; the fault is an observation on the same page.

**Suggested Root Cause:**
Unknown — for dev investigation. The Form `<select>` (`formCompound`) is rendered with no `selected` option, while Language, Tax exempt and the coverages are restored.

**Notes:**
In AP2410_004 the reopened form showed PM30 too; it matched there only because PM30 is the first option. Related: on the same form, changing the Form clears the Life type (observation O-4, not filed).

---

### BUG-002 — Saving a co-applicant with only name and date of birth shows another client's email and phone in the quote's Co-applicant block

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2410_004 (re-run after review R3, step 1) |
| **Requirement** | AP-2410 — re-test pre-condition (a co-applicant is needed to replay the reported Co borrower / Both coverage) |
| **Severity** | Medium — the quote shows contact details that belong to another client record, which a dealer may take as the co-applicant's and use; on Dev the values are test data of an existing client record, not proven real customer data |
| **Priority** | P2 |
| **Environment** | Dev (v2dev) · Chromium (Playwright) 1280 × 800 · Dealer portal, Dealer 1380 |
| **Tracker Ticket** | [AP-2558](https://garantieavantageplus.atlassian.net/browse/AP-2558) |
| **Status** | Open |
| **First found** | 2026-11-08 |
| **Reproducibility** | Always (1 of 1 attempts) |
| **Links** | relates to AP-2410; relates to AP-2541 (same Co-applicant block, different behaviour: date of birth shown one day early) |

**Summary:**
After a co-applicant is saved from the "Add co-applicant" modal on the quote details page with only First name, Last name and Date of birth filled, the quote's Co-applicant block shows an email and a phone number that were never typed.

**Steps to Reproduce:**

1. Sign in to the Dealer portal on Dev (`https://v2dev.garantieavantageplus.ca/login`) with the Dealer 1380 account.
2. Open `/vehicle/915/details` and click **Create quote**; on `/quote/new/client?fromVehicleId=915` fill Email `client.stage.2410001@yopmail.com` (or any new address), First name `Retest`, Last name `Chubb2410-001`, Address `100 rue Test`, City `Montréal`, Province "Québec", Postal code `H2X 1Y4`, Home phone `514-555-0410`, Work phone `514-555-0411`, tick the policy agreement box → **Save** (lands on `/quote/{id}/details`; skip this step by opening any quote whose Co-applicant block reads "No applicant").
3. Click **Add a financing** and save Date of birth `1985-06-15`, Province "Québec", Type "Financing", Financed amount `25000`, Residual `0`, Payment frequency "Monthly", Term `12`, Interest rate `6.99`, Financing company "AutoCapital Canada" (skip if the quote already has a financing).
4. In the Co-applicant block ("No applicant"), click **Add co-applicant**; in the modal fill only First name `Coapp`, Last name `Retest2410`, Date of birth `1988-04-10`; leave Address, Address2, City, Province, Postal code and Phone empty → **Save**.
5. Read the Co-applicant block.

**Expected Result:**
The flash "Co-applicant saved" appears and the block shows only what was entered: Coapp Retest2410 and the date of birth, with no email or phone.

**Actual Result:**
The flash "Co-applicant saved" appears and the block shows "Coapp Retest2410 · Date Of Birth : Saturday, April 9, 1988" plus the email `ken@nekken.ca` and the phone `514-690-6330`, none of which was typed. These are the email and phone of another client record on Dev (contract APOP01-836), not the dealer's.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot (failing state) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2410/AP2410_004-rerun-step4-QuoteSavedFlashCoBorrower_pass.png` — quote 6696 details: Co-applicant block with Coapp Retest2410, ken@nekken.ca and 514-690-6330 |
| Console log | None captured |

The screenshot name ends in `_pass` because the step under test passed; the fault is an observation on the same page.

**Suggested Root Cause:**
Unknown — for dev investigation. The values match the sample customer of the AP-2377 requirement and the client of Dev contract APOP01-836, so empty co-applicant contact fields may fall back to a fixed or another record's contact data.

**Notes:**
If the same happens with production client records, the developer should raise the priority: the quote would then show one real customer's contact details on another customer's quote. The date of birth shown one day early is AP-2541, not this bug.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 2 | AP2410_002 (BUG-001), AP2410_004 (BUG-002) |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| AP-2410 — Chubb Insurance Quote: Get Quote submits successfully | 2 | BUG-001, BUG-002 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** _(filled by updater)_

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | [AP-2557](https://garantieavantageplus.atlassian.net/browse/AP-2557) | _(pending)_ | _(pending)_ | — |
| BUG-002 | [AP-2558](https://garantieavantageplus.atlassian.net/browse/AP-2558) | _(pending)_ | _(pending)_ | — |

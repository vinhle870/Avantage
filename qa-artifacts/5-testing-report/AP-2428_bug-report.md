# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2428: Dealer Permaplate Contract
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2428 single-ticket STLC run, run folder 5.0.0. 15 test cases executed on **Dev (v2dev)** on 2026-11-02, by the user's decision: 9 PASS, 4 FAIL, 2 BLOCKED.
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/5.0.0/execution-log_AP-2428_2026-11-02.md · qa-artifacts/3-test-cases/AP2428_TestCases_*.md · Gate C decisions in qa-artifacts/7-reviews/AP-2428_review.md (R3)

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca`. Staging was not opened in this run.

| Metric | Value |
|---|:---:|
| Total defects | 4 |
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 1 |
| Tracker tickets created | 4 (AP-2512, AP-2513, AP-2514, AP-2515 on 2026-11-02) |

**Decisions (Gate C, by the reviewer — R3 round 1 APPROVE, rule C4 for every FAIL):**
- No FAIL meets rule C1 (not a bug): the requirement capture states the opposite of each actual result, and AP-2428 has no comment after the QA questions comment of 2026-11-01.
- Open AP bugs were searched for 17 phrases (permaplate contract, permaplate PDF, contract download, permaplate 500, download 500, contract PDF, esthetic protection, Erreur difficultés, other name on file, Other name, company name contract, permaplate company, province dropdown, province text, cost price, Total cost, permaplate). No open bug names the same screen and the same wrong behaviour, so every FAIL is filed new.
- AP2428_010 and AP2428_012 fail on the same download link with the same HTTP 500, so they share **one** bug (BUG-001). It relates to AP-2459, which is a different action (Generate Contract with Financing company left on "Choose", on staging) and not a duplicate.
- AP2428_005 step 4 has two faults on two different fields that need two different fixes, so it is filed as **two** bugs (BUG-002 and BUG-003). AP2428_005 passes on re-test only when both are closed.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2428_010 (steps 2, 4), AP2428_012 (steps 4, 5) | Downloading a Permaplate contract PDF from the quote details page returns an HTTP 500 error page on Dev | High | P1 | [AP-2512](https://garantieavantageplus.atlassian.net/browse/AP-2512) | Open |
| BUG-002 | AP2428_005 (step 4) | "Other name on file (Company's name)" on the Permaplate contract form is empty although the client has a company | Medium | P2 | [AP-2513](https://garantieavantageplus.atlassian.net/browse/AP-2513) | Open |
| BUG-003 | AP2428_005 (step 4) | Province on the Permaplate contract form is a free-text box instead of a dropdown of provinces | Medium | P2 | [AP-2514](https://garantieavantageplus.atlassian.net/browse/AP-2514) | Open |
| BUG-004 | AP2428_007 (step 3) | The Program Summary on the Permaplate contract form has no "Cost Price" label; the cost is shown as "Total" | Low | P3 | [AP-2515](https://garantieavantageplus.atlassian.net/browse/AP-2515) | Open |

---

## Bug Details

---

### BUG-001 — Downloading a Permaplate contract PDF from the quote details page returns an HTTP 500 error page on Dev

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2428_010 (FAIL at steps 2 and 4; step 3 blocked) and AP2428_012 (FAIL at steps 4 and 5) |
| **Requirement** | AP-2428 REQ-007 — after Generate Contract, "A download button is available to download the PDF" |
| **Severity** | High — the dealer cannot get the contract PDF at all, so the client has nothing to sign, and no Permaplate contract on Dev can be printed, old or new |
| **Priority** | P1 — blocks the AP-2428 release; the PDF content checks (Q-010) cannot be tested until it works |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal, dealer ID 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · app version not exposed |
| **Tracker Ticket** | [AP-2512](https://garantieavantageplus.atlassian.net/browse/AP-2512) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2428 and Relates → AP-2459; 2 screenshots embedded in the description (verified: 2 media nodes with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — 2 of 2 on quote 6456, and every other contract tried: quotes 6457, 6460 and the older quote 6284 |

**Summary:**
On Dev (v2dev), clicking the PDF icon on the "Esthetic protection" row of a quote that has a Permaplate contract opens `/quote/{id}/permaplate-contract-download`, which returns HTTP 500 and the French technical-error page instead of the contract PDF.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account. The QA used dealer ID 1380 ("Test QA staging"). The dealer must have a Permaplate product linked in the Admin portal at `/admin/dealer/1380/permaplate` (skip if it is already linked; on Dev, product 3 "10 ans" is already linked to dealer 1380).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km) and click **Create quote**.
3. Fill the client form: Email `client.stage.942@yopmail.com` (any unused address), First name `Perma`, Last name `Contrat2428`, Secondary owner or company `Garage Test 2428 Inc`, Address `123 rue Principale`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550100`, Tel. work `5145550101`. Tick the policy-agreement box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved".
4. Open `/quote/{id}/vehicle`, set **Delivered at** to `2026-11-01` and **Price** to `20000`, and click **Save**.
5. Open `/quote/{id}/permaplate`. Click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** and **Peinture – Céramique + Graphene** (this also ticks **Extra care (5 ans couverture )**), and click **Save**. The page shows "Cost: 225$" before saving, and after saving the details page shows "Esthetic protection quote saved successfully".
6. On `/quote/{id}/details`, on the **Esthetic protection** row, click the **⋯** button and choose **Generate Contract**. The form "Esthetic protection Contract" opens at `/quote/{id}/permaplate-create-contract`.
7. Leave every prefilled value as it is, leave **Financing company** on "Choose", and click **Generate Contract**. The page returns to `/quote/{id}/details` with "Esthetic protection contract generated successfully" and "Invoice #N ($225) is created".
8. On the **Esthetic protection** row, click the PDF icon. It opens `/quote/{id}/permaplate-contract-download` in a new tab.

**Expected Result:**
Step 8 downloads or opens the contract PDF: HTTP 200 with content type `application/pdf`. The ticket says: "The user is redirected to the quote details page. A download button is available to download the PDF". On staging, the same link returned HTTP 200 `application/pdf` (`Content-Disposition: inline; filename=permaplate-{contractId}.pdf`) on 2026-10-04.

**Actual Result:**
Step 8 returns **HTTP 500**, content type `text/html`, 13,335 bytes. The page reads "Erreur — Désolé, l'application éprouve des difficultés techniques. Veuillez recommencer une autre fois." No PDF is returned. The same HTTP 500 is returned for every Permaplate contract tried on Dev:

| Quote | Contract | Made |
|---|---|---|
| 6456 | PNA-0000000017 | 2026-11-02, this run (tried 2 of 2) |
| 6457 | PNA-0000000018 | 2026-11-02, this run (checked by the reviewer) |
| 6460 | PNA-0000000019 | 2026-11-02, this run; the Address was changed to `99 avenue du Parc` on the contract form before Generate Contract |
| 6284 | older Dev contract | before this run |

Contract creation itself works: the contract, its invoice and its row in `/permaplate-contracts` are all created. Only the download fails.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_010-step2-PdfDownloadHttp500_fail.png` — the French technical-error page returned by the PDF link of quote 6456 (main evidence) |
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_009-step4-QuoteDetailsWithPdfDownload_pass.png` — quote 6456 details right after Generate Contract, with the two success banners and the PDF icon on the Esthetic protection row |
| Console log | None captured. The failing request is `GET /quote/6456/permaplate-contract-download` → 500 `text/html` |

**Suggested Root Cause:**
Unknown — for dev investigation. Because the same link worked on staging on 2026-10-04 and fails on Dev for old and new contracts alike, the fault is likely in Dev's PDF set-up or in the change the ticket asks for ("Please generate the PDF using HTMLtoPDF library instead of Zend_PDF"). The server log for the request above should name the exception.

**Notes:**
- **Tested on: Dev (v2dev).** The staging HTTP 200 result is recorded in the QA knowledge file `qa-docs/quote-creation.md` ("Permaplate contract lists", mapped 2026-10-04 during the AP-2463 re-test). Staging was not re-checked in this run.
- Relates to AP-2459, which is a different defect: on staging, clicking **Generate Contract** with Financing company left on "Choose" returned HTTP 500. On Dev, Generate Contract with "Choose" works three times out of three; only the PDF download fails.
- Test case AP2428_012 reaches the same fault: its contract (quote 6460) was created after editing the Address, but the PDF that would show which address was used cannot be downloaded.
- The screenshot of the AP2428_012 error page was taken while the page was still fading in, so it is not attached; the AP2428_010 image shows the same page.

---

### BUG-002 — "Other name on file (Company's name)" on the Permaplate contract form is empty although the client has a company

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2428_005 (FAIL at step 4) |
| **Requirement** | AP-2428 REQ-003 — Owner information is prefilled from the client: "Other name on file — Text field with client's company prefilled" |
| **Severity** | Medium — the contract is created without the client's company unless the dealer notices and retypes it by hand; the workaround is to type it |
| **Priority** | P2 — fix in the current release of the Permaplate contract |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal, dealer ID 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · app version not exposed |
| **Tracker Ticket** | [AP-2513](https://garantieavantageplus.atlassian.net/browse/AP-2513) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2428; 1 screenshot embedded in the description (verified: 1 media node with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — seen on quote 6456 (1 of 1 form opened for this check) |

**Summary:**
On Dev (v2dev), the "Esthetic protection Contract" form opened from a quote leaves the field "Other name on file (Company's name)" empty, although the quote's client has "Garage Test 2428 Inc" in the client field "Secondary owner or company".

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account. The QA used dealer ID 1380 ("Test QA staging"). The dealer must have a Permaplate product linked in the Admin portal at `/admin/dealer/1380/permaplate` (skip if it is already linked; on Dev, product 3 "10 ans" is already linked to dealer 1380).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km) and click **Create quote**.
3. Fill the client form: Email `client.stage.942@yopmail.com` (any unused address), First name `Perma`, Last name `Contrat2428`, **Secondary owner or company** `Garage Test 2428 Inc`, Address `123 rue Principale`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550100`, Tel. work `5145550101`. Tick the policy-agreement box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved".
4. Open `/quote/{id}/client` and confirm that **Secondary owner or company** holds `Garage Test 2428 Inc`.
5. Open `/quote/{id}/vehicle`, set **Delivered at** to `2026-11-01` and **Price** to `20000`, and click **Save**.
6. Open `/quote/{id}/permaplate`. Click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** and **Peinture – Céramique + Graphene** (this also ticks **Extra care (5 ans couverture )**), and click **Save**.
7. On `/quote/{id}/details`, on the **Esthetic protection** row, click the **⋯** button and choose **Generate Contract**. The form "Esthetic protection Contract" opens at `/quote/{id}/permaplate-create-contract`.
8. In the **Owner information** section, read the field **Other name on file (Company's name)**.

**Expected Result:**
In step 8, **Other name on file (Company's name)** holds `Garage Test 2428 Inc`, the client's company. The ticket says: "Other name on file — Text field with client's company prefilled".

**Actual Result:**
In step 8, **Other name on file (Company's name)** (`permaplate_contract[ownerOtherName]`) is an empty text box. The client record of the same quote, `/quote/6456/client`, holds "Secondary owner or company" = `Garage Test 2428 Inc` (confirmed again by the QA reviewer on Dev on 2026-11-02). Every other owner field is prefilled correctly: Last name `Contrat2428`, First name `Perma`, Address `123 rue Principale`, City `Montréal`, Postal code `H2X 1Y4`, Email, Phone (res) `5145550100`, Phone (cell) `5145550101`.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_005-step4-OwnerCompanyEmptyProvinceText_fail.png` — Owner information on the contract form of quote 6456, with "Other name on file (Company's name)" empty |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The form prefills every other owner field from the client, so the mapping from the client's "Secondary owner or company" field to `ownerOtherName` is likely missing.

**Notes:**
- **Tested on: Dev (v2dev).** Quote 6456, client inbox `client.stage.942@yopmail.com`.
- The same test case also found that Province is a free-text box (filed separately, because it is a different field with a different fix). AP2428_005 passes on re-test only when both are fixed.

---

### BUG-003 — Province on the Permaplate contract form is a free-text box instead of a dropdown of provinces

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2428_005 (FAIL at step 4) |
| **Requirement** | AP-2428 REQ-003 — Owner information: "Province — Dropdown of provinces" |
| **Severity** | Medium — the dealer can type a misspelled or invalid province on the contract, and the ticket says taxes are calculated from the client's province; the workaround is to type it carefully |
| **Priority** | P2 — fix in the current release of the Permaplate contract |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal, dealer ID 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · app version not exposed |
| **Tracker Ticket** | [AP-2514](https://garantieavantageplus.atlassian.net/browse/AP-2514) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2428; 1 screenshot embedded in the description (verified: 1 media node with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — seen on quote 6456 and on every contract form opened in this run (quotes 6457, 6459, 6460) |

**Summary:**
On Dev (v2dev), the **Province** field in the Owner information section of the "Esthetic protection Contract" form is a plain text box prefilled with "Québec", not a dropdown listing the provinces as the ticket asks, while the client form of the same quote does use a province dropdown.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account. The QA used dealer ID 1380 ("Test QA staging"). The dealer must have a Permaplate product linked in the Admin portal at `/admin/dealer/1380/permaplate` (skip if it is already linked; on Dev, product 3 "10 ans" is already linked to dealer 1380).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km) and click **Create quote**.
3. Fill the client form: Email `client.stage.942@yopmail.com` (any unused address), First name `Perma`, Last name `Contrat2428`, Secondary owner or company `Garage Test 2428 Inc`, Address `123 rue Principale`, City `Montréal`, **Province** — choose `Québec` from the dropdown, Postal code `H2X 1Y4`, Tel. home `5145550100`, Tel. work `5145550101`. Tick the policy-agreement box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved".
4. Open `/quote/{id}/vehicle`, set **Delivered at** to `2026-11-01` and **Price** to `20000`, and click **Save**.
5. Open `/quote/{id}/permaplate`. Click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** and **Peinture – Céramique + Graphene** (this also ticks **Extra care (5 ans couverture )**), and click **Save**.
6. On `/quote/{id}/details`, on the **Esthetic protection** row, click the **⋯** button and choose **Generate Contract**. The form "Esthetic protection Contract" opens at `/quote/{id}/permaplate-create-contract`.
7. In the **Owner information** section, click the **Province** field.

**Expected Result:**
In step 7, **Province** is a dropdown that lists the Canadian provinces and territories, with `Québec` selected. The ticket says: "Province — Dropdown of provinces".

**Actual Result:**
In step 7, **Province** (`permaplate_contract[ownerProvince]`) is an `<input type="text">` holding the text `Québec`. There is no dropdown arrow and no list of provinces; any text can be typed. The client form of the same quote (`/quote/6456/client`) shows Province as a dropdown (Choose / Québec selected / Ontario …), so the contract form uses a different field type for the same value.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_005-step4-OwnerCompanyEmptyProvinceText_fail.png` — Owner information on the contract form of quote 6456, with Province as a plain text box holding "Québec" |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The contract form type appears to declare `ownerProvince` as a text field instead of the province choice field the client form uses.

**Notes:**
- **Tested on: Dev (v2dev).** Quote 6456, client inbox `client.stage.942@yopmail.com`.
- Because Province is free text, test case AP2428_008 (taxes by province) could not switch the province to Ontario. That case is blocked for another reason too: the QA questions Q-002 and Q-003 on AP-2428 (how taxes are calculated, and whether retail and taxes are still shown after AP-2456) are not yet answered.
- The same test case also found that "Other name on file" is not prefilled (filed separately, because it is a different field with a different fix). AP2428_005 passes on re-test only when both are fixed.

---

### BUG-004 — The Program Summary on the Permaplate contract form has no "Cost Price" label; the cost is shown as "Total"

| Field | Value |
|---|---|
| **Bug ID** | BUG-004 |
| **Test Case** | AP2428_007 (FAIL at step 3) |
| **Requirement** | AP-2428 REQ-005 — Program Summary lists "Cost Price" |
| **Severity** | Low — the amount is correct, but its label "Total" does not tell the dealer that it is their own cost price and not the client's price |
| **Priority** | P3 — fix in the next release |
| **Environment** | **Tested on: Dev (v2dev)** `https://v2dev.garantieavantageplus.ca` · Dealer portal, dealer ID 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · app version not exposed |
| **Tracker Ticket** | [AP-2515](https://garantieavantageplus.atlassian.net/browse/AP-2515) — Bug, priority Low, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2428; 1 screenshot embedded in the description (verified: 1 media node with ids) |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — seen on quote 6456 and on every contract form opened in this run |

**Summary:**
On Dev (v2dev), the **Program Summary** column of the "Esthetic protection Contract" form shows the dealer's cost as a single row "Total 225.00$" with no "Cost Price" label, although the ticket lists "Cost Price" in the Program Summary.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login` and sign in with a dealer account. The QA used dealer ID 1380 ("Test QA staging"). The dealer must have a Permaplate product linked in the Admin portal at `/admin/dealer/1380/permaplate` (skip if it is already linked; on Dev, product 3 "10 ans" is already linked to dealer 1380).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km) and click **Create quote**.
3. Fill the client form: Email `client.stage.942@yopmail.com` (any unused address), First name `Perma`, Last name `Contrat2428`, Secondary owner or company `Garage Test 2428 Inc`, Address `123 rue Principale`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Tel. home `5145550100`, Tel. work `5145550101`. Tick the policy-agreement box and click **Save**. The page `/quote/{id}/details` opens with the alert "Client saved".
4. Open `/quote/{id}/vehicle`, set **Delivered at** to `2026-11-01` and **Price** to `20000`, and click **Save**.
5. Open `/quote/{id}/permaplate`. Click the product **10 ans**, tick **Antirouille – Rust+Sound (combo)** (80$) and **Peinture – Céramique + Graphene** (75$; this also ticks **Extra care (5 ans couverture )**, 70$), and click **Save**. The quote details page shows the Esthetic protection row with "Cost: CA$225.00$".
6. On `/quote/{id}/details`, on the **Esthetic protection** row, click the **⋯** button and choose **Generate Contract**. The form "Esthetic protection Contract" opens at `/quote/{id}/permaplate-create-contract`.
7. Read the **Program Summary** column, below the list of selected options.

**Expected Result:**
In step 7, the Program Summary shows a line labelled **Cost Price** with the dealer's cost for the selected options, 225.00$. The ticket lists "Cost Price" under Program Summary. AP-2456, from the same Permaplate feature set, confirms that the cost line stays: "only the dealer's own cost price is shown".

**Actual Result:**
In step 7, the page has no element with the text "Cost Price". The only money line in the Program Summary is a table row **"Total 225.00$"**. The amount is right — it equals the quote's Cost (80$ + 75$ + 70$ = 225$) — so only the label is wrong.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/5.0.0/AP-2428/AP2428_007-step3-NoCostPriceLabelOnlyTotal_fail.png` — Program Summary of quote 6456's contract form, showing only "Total 225.00$" |
| Console log | None captured |

**Suggested Root Cause:**
Label only: rename the row "Total" to "Cost Price" (or the label the product owner prefers) in the Program Summary of the contract form template.

**Notes:**
- **Tested on: Dev (v2dev).** Quote 6456.
- The Program Summary also shows no Retail price, Subtotal, Taxes or Grand Total line. That is **not** part of this bug: whether those lines are still wanted after AP-2456 is an open question on AP-2428 (Q-002, Q-003), not yet answered.

---

## Defect Distribution

_How the bugs break down by how serious they are, so the team can see at a glance
whether this is a few big problems or many small ones._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2428_010, AP2428_012 |
| Medium | 2 | AP2428_005 |
| Low | 1 | AP2428_007 |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-003 — Owner information prefilled from the client | 2 | BUG-002, BUG-003 |
| REQ-005 — Program Summary prices | 1 | BUG-004 |
| REQ-007 — Contract PDF download | 1 | BUG-001 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill
**Date:** 2026-11-02 (s7, Gate D)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2512 | Created by stlc-bug-reporter (s5) | Backlog | 2026-11-02 |
| BUG-002 | AP-2513 | Created by stlc-bug-reporter (s5) | Backlog | 2026-11-02 |
| BUG-003 | AP-2514 | Created by stlc-bug-reporter (s5) | Backlog | 2026-11-02 |
| BUG-004 | AP-2515 | Created by stlc-bug-reporter (s5) | Backlog | 2026-11-02 |

s7 (2026-11-02): no action on AP-2512 to AP-2515 — they are in Backlog, not the QA status, so Gate D §3.2 does not apply. Story result comment 19447 posted on AP-2428 and read back; AP-2428 stays in QC (pass rate 60% < 90%, AP-2512 stopping, Q-001–Q-003 open).

# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2504: Generate contract for a quote's GAP/Creditor Insurance product
**Report ID:** BR-20261103-001
**Test Cycle:** AP-2504 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-03 (UTC): 11 test cases — 9 PASS, 1 FAIL, 1 BLOCKED (pass rate 81.8%).
**Date:** 2026-11-03
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2504_2026-11-03.md · qa-artifacts/3-test-cases/AP2504_TestCases_001-005.md, AP2504_TestCases_006-010.md, AP2504_TestCases_011-011.md · Gate C decisions in qa-artifacts/7-reviews/AP-2504_review.md (R3 round 1)

**Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal (dealer 1380, "Test QA staging"). Staging was not checked in this run.

| Metric | Value |
|---|:---:|
| Total defects | 4 |
| Critical | 0 |
| High | 1 |
| Medium | 1 |
| Low | 2 |
| Tracker tickets created | 4 (AP-2538, AP-2539, AP-2540, AP-2541 — status Backlog) |

**Decisions:**
- Gate C was decided by the independent reviewer (R3 round 1, APPROVE). The one FAIL, AP2504_006 step 3, is filed as a **new** bug (rule C4): no sentence in the requirement capture or a ticket comment says the raw codes are intended (C1 does not hold), and 23 duplicate searches of open AP bugs found no bug on the financing section of these pages (AP-2526/2527/2528 concern the add modal; AP-2530/2531/2532 the warranty page). A second check at s5 (2026-11-03T04:45Z, bugs created in the last day) found no new candidate.
- Three record-only observations are also filed, by the reviewer's Gate C plan. **BUG-002** (contract PDFs answer HTTP 500) is **not an AP-2504 regression**: the creditor PDF already failed on quote 6480 before this change, and the GAP PDF had no earlier baseline. It is linked "relates to" AP-2519 and AP-2512 and does not count against AP-2504; steps 5 of AP2504_007 and AP2504_011 stay PASS. **BUG-003** (wrong product named in the "already created" message) is linked to AP-2504. **BUG-004** (co-applicant date of birth shown one day early) is a standalone defect outside AP-2504's acceptance criteria, linked "relates to" only and not counted against AP-2504.
- The bug-reporter rule "create a ticket for Severity ≥ Medium" was overridden for BUG-003 and BUG-004 by the reviewer's Gate C decision to file them as Low.
- No invoice for either Chubb contract (observation b) is **not** filed: questions Q-008 and Q-009 already ask the author whether Chubb contracts make an invoice.
- None of these bugs blocked another test case. AP2504_002 is BLOCKED by the open question Q-001 (comment 19460), not by a bug.

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2504_006 | The "Financing information" section of the GAP and creditor contract pages shows internal codes FREQUENCY_MONTHLY / TYPE_FINANCING, and five labels stay in English on the French page | Medium | P2 | [AP-2538](https://garantieavantageplus.atlassian.net/browse/AP-2538) | Open |
| BUG-002 | AP2504_007, AP2504_011 (record-only) | The GAP and creditor (Chubb) contract PDF links answer HTTP 500 instead of the contract PDF | High | P2 | [AP-2539](https://garantieavantageplus.atlassian.net/browse/AP-2539) | Open |
| BUG-003 | AP2504_009 (record-only) | Opening the GAP contract page of a quote whose GAP contract exists redirects with "Creditor insurance already created" — the wrong product | Low | P4 | [AP-2540](https://garantieavantageplus.atlassian.net/browse/AP-2540) | Open |
| BUG-004 | AP2504_004 (side observation) | The quote page shows the co-applicant's date of birth one day early | Low | P4 | [AP-2541](https://garantieavantageplus.atlassian.net/browse/AP-2541) | Open |

---

## Bug Details

---

### BUG-001 — The "Financing information" section of the GAP and creditor contract pages shows internal codes FREQUENCY_MONTHLY / TYPE_FINANCING, and five labels stay in English on the French page

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2504_006 (step 3); also seen in AP2504_010 step 4 (creditor page) |
| **Requirement** | AP-2504 REQ-003 — acceptance criterion 3: "Given the quote has a vehicle, a client, a co-applicant or a financing, when the page renders, then vehicle and owner, co-owner and financing values are pre-filled and financing is read-only" |
| **Severity** | Medium — on the page that produces the insurance contract the dealer reads a program code instead of the loan's payment frequency and financing type, and French-speaking dealers get English labels; the values underneath are right and the contract can still be made |
| **Priority** | P2 — it fails an acceptance criterion of AP-2504 |
| **Environment** | **Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English and French. Staging was not checked |
| **Tracker Ticket** | [AP-2538](https://garantieavantageplus.atlassian.net/browse/AP-2538) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2504; 1 screenshot embedded in the description (verified: media node with id) and the network .txt attached; filed 2026-11-03T04:49Z UTC |
| **Status** | Open |
| **First found** | 2026-11-03 |
| **Reproducibility** | Always — GAP page of quote 6562 (English and French), creditor page of quote 6566 (before its contract) and of quote 6539 (re-checked by the reviewer) |

**Summary:**
On the dealer pages "GAP insurance" (`/quote/{id}/insurance/create-contract/gap`) and "Creditor Insurance" (`/quote/{id}/insurance/create-contract`), the read-only "Financing information" section shows "Payment frequency: FREQUENCY_MONTHLY" and "Financing type: TYPE_FINANCING" instead of "Monthly" and "Financing", in English and in French; on the French page the labels "Creditor address", "Due type", "Financing type", "Loan term" and "Residual value" are also not translated.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells Chubb GAP and creditor insurance (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details?_locale=en` (Ford Focus 2008, VIN `1FAHP35NX8W239204`, 5000 km — any vehicle works) and click **Create quote**. Fill First name `Contract`, Last name `Owner2504-001`, Email an unused address such as `client.stage.2504901@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. The quote page `/quote/{id}/details` opens; note the quote id.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing`. Fill Date of birth `1985-06-15`, Province `Québec`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada` (the first in the list) and click **Save**. "Financing saved" appears and the quote page reads "Type : Financing … Payment amount : 494.91$ Monthly".
4. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/gap-insurance?_locale=en`. In "Gap Insurance Quote" set Rate table `TGGAP`, Language `English`, Tax exempt `No`, Gap Term `60` and click **Get Quote**. "GAP insurance quote saved successfully" appears and the "Gap Insurance" row of "Summary of products" shows CA$3,094.00 and a **⋯** menu.
5. On the "Gap Insurance" row click **⋯** and then **Generate Contract**. The page "GAP insurance" opens at `/quote/{id}/insurance/create-contract/gap`. Do not click the Generate Contract button on it.
6. Read the "Financing information" section at the bottom of the left-hand column.
7. Add `?_locale=fr` to the address and press Enter. Read the same section in French.
8. For the creditor page: on the same quote open `https://v2dev.garantieavantageplus.ca/quote/{id}/insurance?_locale=en`; in "Creditors Insurance Quote" set Language "English", Tax exempt "No", Form "Monthly Premium PM30", Life type "Decreasing", Life term `60`, Life for "Borrower", leave Critical illness and Disability unset, and click **Get Quote** ("Chubb insurance quote saved successfully"). On the "Creditors insurance" row click **⋯** → **Generate Contract**; the page "Creditor Insurance" opens at `/quote/{id}/insurance/create-contract`. Read its "Financing information" section without submitting.

(Ready examples on Dev, after step 1: quote 6562 has a GAP quote and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6562/insurance/create-contract/gap`; quote 6539 has a creditor quote and no contract — open `https://v2dev.garantieavantageplus.ca/quote/6539/insurance/create-contract`.)

**Expected Result:**
The financing values are pre-filled with what the dealer entered, as acceptance criterion 3 says ("financing values are pre-filled and financing is read-only"): Payment frequency reads "Monthly" and Financing type reads "Financing" — the same words the quote page uses ("Type : Financing", "494.91$ Monthly"). On the French page every label of the section is in French, like the rest of the page.

**Actual Result:**
The section is read-only, as required, but it shows: Financing company "AutoCapital Canada"; Creditor address "200-11, Church Street / Toronto, Ontario M5E 1W1"; Net amount financed including RDPRM "25,000.00$"; **Payment frequency "FREQUENCY_MONTHLY"**; Due type "No"; **Financing type "TYPE_FINANCING"**; Loan term "60 months"; Residual value "0.00$"; Interest rate "6.9900%".
- The same two codes are shown on the French page (`?_locale=fr`) and on the creditor page "Creditor Insurance".
- Second point, same section: on the French GAP page the labels **Creditor address, Due type, Financing type, Loan term and Residual value** stay in English, while the other labels of the page are French.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step3-FinancingRawCodesShown_fail.png` — "Financing information" of quote 6562 (English) showing Payment frequency FREQUENCY_MONTHLY and Financing type TYPE_FINANCING |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_006-step3-FinancingRawCodes_network_fail.txt` — GET of the GAP page in English and French and of the creditor page of quote 6566, each HTTP 200, with the codes they showed |
| Not captured as an image | The French page and the creditor page: no screenshot was taken. Both were confirmed again on Dev by the QA reviewer on 2026-11-03 (GAP page of quote 6562 in English and French, creditor page of quote 6539) |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. The template appears to print the stored enum values of the financing (`FREQUENCY_*`, `TYPE_*`) instead of passing them through the translation used by the quote page, and the five labels appear to have no French translation key.

**Notes:**
- The quote page itself shows the same financing correctly translated, so only the two new contract pages are affected.
- Related: AP-2504 (the story whose acceptance criterion this fails).

---

### BUG-002 — The GAP and creditor (Chubb) contract PDF links answer HTTP 500 instead of the contract PDF

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2504_007 step 5 and AP2504_011 step 5 — record-only steps, both PASS. Not an AP-2504 failure |
| **Requirement** | Outside AP-2504's acceptance criteria. AP-2504 says "Contract creation, invoice, financing, and PDF behaviour stay unchanged"; the creditor PDF already failed before this change, so that sentence holds |
| **Severity** | High — after a GAP or creditor insurance contract is created, the dealer cannot open or print the contract document for the customer to sign; the contract exists but its PDF cannot be obtained |
| **Priority** | P2 — not caused by AP-2504, but every new Chubb contract on Dev is affected |
| **Environment** | **Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800. Staging was not checked |
| **Tracker Ticket** | [AP-2539](https://garantieavantageplus.atlassian.net/browse/AP-2539) — Bug, priority High, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2519, AP-2512 and AP-2504; 2 screenshots embedded in the description (verified: media nodes with ids) and the network .txt attached; filed 2026-11-03T04:49Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 for the creditor PDF (quote 6480); 2026-11-03 for the GAP PDF (quote 6564) |
| **Reproducibility** | Always — GAP contract AVPG000064 (quote 6564), creditor contracts AVP000171 (quote 6566) and AVP000170 (quote 6480); re-checked by the QA reviewer on 2026-11-03 |

**Summary:**
On the dealer quote page, the PDF link of a Chubb insurance contract — `/quote/{id}/gap/insurance/contract-pdf` for GAP and `/quote/{id}/chubb/insurance/contract-pdf` for creditor insurance — answers HTTP 500 with the technical-error page instead of the contract PDF.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells Chubb GAP and creditor insurance (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details?_locale=en` (Ford Focus 2008, VIN `1FAHP35NX8W239204` — any vehicle works) and click **Create quote**. Fill First name `Contract`, Last name `Owner2504-007`, Email an unused address such as `client.stage.2504907@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. The quote page `/quote/{id}/details` opens; note the quote id.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing`. Fill Date of birth `1985-06-15`, Province `Québec`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada` and click **Save** ("Financing saved").
4. GAP: open `https://v2dev.garantieavantageplus.ca/quote/{id}/gap-insurance?_locale=en`, set Rate table `TGGAP`, Language `English`, Tax exempt `No`, Gap Term `60`, click **Get Quote** ("GAP insurance quote saved successfully"). On the "Gap Insurance" row click **⋯** → **Generate Contract**, then click the **Generate Contract** button on the "GAP insurance" page without changing anything. After about 6 seconds the quote page shows "Chubb insurance contract created successfully" and the row shows a contract number (for example AVPG000064) and a PDF icon. This creates a real Chubb contract.
5. Click the PDF icon on the "Gap Insurance" row (it opens `/quote/{id}/gap/insurance/contract-pdf` in a new tab).
6. Creditor: on a second new quote made with steps 2–3 (Last name `Owner2504-010`), open `https://v2dev.garantieavantageplus.ca/quote/{id}/insurance?_locale=en`; in "Creditors Insurance Quote" set Language "English", Tax exempt "No", Form "Monthly Premium PM30", Life type "Decreasing", Life term `60`, Life for "Borrower", and click **Get Quote**. On the "Creditors insurance" row click **⋯** → **Generate Contract**, then click the **Generate Contract** button on the "Creditor Insurance" page. The quote page shows "Chubb insurance contract created successfully" and the row shows a contract number (for example AVP000171).
7. Click the PDF icon on the "Creditors insurance" row (it opens `/quote/{id}/chubb/insurance/contract-pdf` in a new tab).

(Ready examples on Dev, after step 1, without creating a contract: `https://v2dev.garantieavantageplus.ca/quote/6564/gap/insurance/contract-pdf` (GAP AVPG000064), `https://v2dev.garantieavantageplus.ca/quote/6566/chubb/insurance/contract-pdf` (creditor AVP000171) and `https://v2dev.garantieavantageplus.ca/quote/6480/chubb/insurance/contract-pdf` (creditor AVP000170).)

**Expected Result:**
Each link opens the contract PDF of the GAP or creditor insurance contract, so the dealer can print it for the customer, as for the other products' contracts.

**Actual Result:**
Both links answer **HTTP 500** with the technical-error page (in French), `text/html`, about 13 KB, and no PDF. Measured: GAP `GET /quote/6564/gap/insurance/contract-pdf` → 500 (13,329 bytes); creditor `GET /quote/6566/chubb/insurance/contract-pdf` → 500 (13,335 bytes); creditor `GET /quote/6480/chubb/insurance/contract-pdf` → 500 (already on 2026-11-02, before AP-2504 was tested).

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_007-step5-GapPdfHttp500Recorded_pass.png` — the GAP contract PDF address of quote 6564 answering with the technical-error page |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_011-step5-CreditorPdfHttp500Recorded_pass.png` — the creditor contract PDF address of quote 6566 answering with the technical-error page |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_PdfResponses_network.txt` — method, address and status of both contract submits and both PDF requests |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. Both Chubb products fail the same way, so the shared Chubb contract-PDF generation (or the call that fetches the document from Chubb) is the likely place; the Permaplate PDF (AP-2512) and "Download all documents" (AP-2519) also answer HTTP 500 on Dev and may share the cause.

**Notes:**
- Not an AP-2504 regression: the creditor PDF already failed on quote 6480 on 2026-11-02, and no GAP contract existed on Dev before 2026-11-03, so the GAP PDF has no earlier baseline.
- Related (relates to): AP-2519 — "Download all documents" returns HTTP 500 on Dev; its notes mention `/quote/6480/chubb/insurance/contract-pdf` returning 500 as secondary evidence only. AP-2512 — Permaplate contract PDF returns HTTP 500 on Dev.

---

### BUG-003 — Opening the GAP contract page of a quote whose GAP contract exists redirects with "Creditor insurance already created" — the wrong product

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2504_009 (step 3) — record-only step, PASS (the redirect itself is acceptable) |
| **Requirement** | AP-2504 REQ-001 / REQ-005 area — the GAP contract page `/quote/{quoteId}/insurance/create-contract/gap`. The ticket does not say what happens when a contract already exists (QA question Q-010); only the message text is wrong |
| **Severity** | Low — the message is misleading text only: it tells the dealer a creditor insurance exists on a quote that has none; the redirect and the contract are correct |
| **Priority** | P4 — cosmetic message fix |
| **Environment** | **Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English. Staging was not checked |
| **Tracker Ticket** | [AP-2540](https://garantieavantageplus.atlassian.net/browse/AP-2540) — Bug, priority Low, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2504; 1 screenshot embedded in the description (verified: media node with id) and the network .txt attached; filed 2026-11-03T04:49Z UTC |
| **Status** | Open |
| **First found** | 2026-11-03 |
| **Reproducibility** | Always — quote 6564 |

**Summary:**
Typing the GAP contract address `/quote/{id}/insurance/create-contract/gap` for a quote whose GAP contract already exists redirects to the quote page with the red message "Creditor insurance already created", although the existing contract is a GAP contract and the quote has no creditor insurance.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that sells Chubb GAP insurance (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details?_locale=en` (any vehicle works) and click **Create quote**. Fill First name `Contract`, Last name `Owner2504-007`, Email an unused address such as `client.stage.2504907@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. Note the quote id.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing`. Fill Date of birth `1985-06-15`, Province `Québec`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada` and click **Save** ("Financing saved"). Do not add creditor insurance.
4. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/gap-insurance?_locale=en`, set Rate table `TGGAP`, Language `English`, Tax exempt `No`, Gap Term `60`, click **Get Quote** ("GAP insurance quote saved successfully").
5. On the "Gap Insurance" row click **⋯** → **Generate Contract**, then click the **Generate Contract** button on the "GAP insurance" page. The quote page shows "Chubb insurance contract created successfully" and the Gap Insurance row shows a contract number. This creates a real Chubb contract.
6. In the address bar type `https://v2dev.garantieavantageplus.ca/quote/{id}/insurance/create-contract/gap` and press Enter.

(Ready example on Dev, after step 1: quote 6564 has GAP contract AVPG000064 and no creditor insurance — do step 6 with `{id}` = 6564.)

**Expected Result:**
The redirect to `/quote/{id}/details` is fine, but its message names the product that already has a contract — for example "GAP insurance already created" — or a neutral "A contract already exists for this product".

**Actual Result:**
The browser is redirected (one hop) to `/quote/6564/details` (HTTP 200) with the red flash "**Creditor insurance already created**". The "Creditors insurance" row of the same page reads "– None Selected –": the quote has no creditor insurance at all.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_009-step3-RedirectFlashCreditorAlreadyCreated_pass.png` — quote 6564 after the redirect: the flash "Creditor insurance already created" above a Summary of products whose Creditors insurance row is "– None Selected –" |
| Network lines | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_PdfResponses_network.txt` — last line: GET of the GAP address → 302 → `/quote/6564/details` 200 with the flash |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. The GAP route (`{type}` = `gap`) probably reuses the creditor route's "contract already exists" check and its message key without switching the text by type.

**Notes:**
- The "⋯" / Generate Contract action is correctly withdrawn from the Gap row once the contract exists; the message is reached only by typing or reopening the address.
- Related: AP-2504 (the story that introduced the GAP contract page).

---

### BUG-004 — The quote page shows the co-applicant's date of birth one day early

| Field | Value |
|---|---|
| **Bug ID** | BUG-004 |
| **Test Case** | AP2504_004 (step 2) — side observation; the case PASSED. Not an AP-2504 failure |
| **Requirement** | Outside AP-2504's acceptance criteria (quote page, Financing card, Co-applicant block) |
| **Severity** | Low — a display error: the stored date and the contract page are right, but a dealer checking the quote page reads the wrong date of birth and may "correct" it |
| **Priority** | P4 — display only |
| **Environment** | **Environment: Dev** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI language English; browser and test run in UTC, dealer in Québec (UTC−5). Staging was not checked |
| **Tracker Ticket** | [AP-2541](https://garantieavantageplus.atlassian.net/browse/AP-2541) — Bug, priority Low, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2504 only (standalone, not counted against AP-2504); 1 context screenshot embedded in the description (verified: media node with id); filed 2026-11-03T04:49Z UTC |
| **Status** | Open |
| **First found** | 2026-11-03 |
| **Reproducibility** | Seen once — quote 6563 (the only co-applicant entered in this run) |

**Summary:**
After a co-applicant is added with Date of birth `1987-03-20`, the quote page's "Co-applicant" block reads "Date Of Birth : Thursday, March 19, 1987" — one day early — while the GAP contract page of the same quote pre-fills 1987-03-20 correctly.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details?_locale=en` (any vehicle works) and click **Create quote**. Fill First name `Contract`, Last name `Owner2504-004`, Email an unused address such as `client.stage.2504904@yopmail.com`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550201`, Work phone `5145550202`, tick "I agree to the policy" and click **Save**. Note the quote id.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing`. Fill Date of birth `1985-06-15`, Province `Québec`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada` and click **Save** ("Financing saved"). The quote page's Financing card shows "Co-applicant" / "No applicant" and a link **Add co-applicant**.
4. Click **Add co-applicant** (it opens `/quote/{id}/financing/co-applicant` as a modal). Fill First name `Coowner`, Last name `Coapp2504`, Date of birth `1987-03-20`, Address `200 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Phone `5145550203` and click **Save**. "Co-applicant saved" appears.
5. Read the Co-applicant block on `/quote/{id}/details`.
6. For comparison, open `https://v2dev.garantieavantageplus.ca/quote/{id}/gap-insurance?_locale=en`, set Rate table `TGGAP`, Language `English`, Tax exempt `No`, Gap Term `60`, click **Get Quote**, then open `https://v2dev.garantieavantageplus.ca/quote/{id}/insurance/create-contract/gap` and read "Co-owner information" → Date of birth (do not click Generate Contract).

(Ready example on Dev, after step 1: quote 6563 — open `https://v2dev.garantieavantageplus.ca/quote/6563/details` and `https://v2dev.garantieavantageplus.ca/quote/6563/insurance/create-contract/gap`.)

**Expected Result:**
The Co-applicant block shows the date that was entered: "Friday, March 20, 1987".

**Actual Result:**
The Co-applicant block reads "Coowner Coapp2504 Date Of Birth : **Thursday, March 19, 1987**". The GAP contract page of the same quote pre-fills Date of birth `1987-03-20` (shown 03/20/1987), so the stored value is right and only the quote page's display is off by one day.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot (context) | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2504/AP2504_004-step5-CoOwnerPrefilled_pass.png` — the GAP contract page of quote 6563 with Co-owner Date of birth 03/20/1987 (the correct value) |
| Not captured as an image | The quote page reading "Thursday, March 19, 1987" — recorded as text in the execution log (AP2504_004 step 2); no screenshot was taken |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for developer investigation. A date stored without a time is probably converted to a date-time at midnight UTC and then formatted in the Québec time zone (UTC−5), which moves it to the previous evening; the contract page shows the raw date and is not affected.

**Notes:**
- Standalone defect found while testing AP-2504; it is outside AP-2504's acceptance criteria and does not count against it. Linked "relates to" AP-2504 only.

---

## Defect Distribution

_One defect fails an AP-2504 acceptance criterion (BUG-001); the other three are side findings — one serious but older than this change (BUG-002), two small text and display faults._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 1 | AP2504_007, AP2504_011 (record-only steps; not an AP-2504 failure) |
| Medium | 1 | AP2504_006 |
| Low | 2 | AP2504_009 (record-only), AP2504_004 (side observation) |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-001 — GAP Generate Contract opens a dedicated page | 1 | BUG-003 (message on reopening the page) |
| REQ-002 — Two-column layout | 0 | — |
| REQ-003 — Pre-filled values, read-only financing | 1 | BUG-001 |
| REQ-004 — Submit creates the contract | 0 | — |
| REQ-005 — Creditor insurance page | 1 | BUG-001 (same section on the creditor page) |
| Outside AP-2504 | 2 | BUG-002 (Chubb contract PDFs), BUG-004 (co-applicant date of birth) |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-03T04:51Z (UTC)

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2538 | Filed in s5 (new, Gate C by reviewer R3), assigned to Ken Nguyen, linked Relates → AP-2504 | Backlog | 2026-11-03T04:49Z |
| BUG-002 | AP-2539 | Filed in s5 (new, Gate C by reviewer R3), assigned to Ken Nguyen, linked Relates → AP-2519, AP-2512 and AP-2504 | Backlog | 2026-11-03T04:49Z |
| BUG-003 | AP-2540 | Filed in s5 (new, Gate C by reviewer R3), assigned to Ken Nguyen, linked Relates → AP-2504 | Backlog | 2026-11-03T04:49Z |
| BUG-004 | AP-2541 | Filed in s5 (new, Gate C by reviewer R3), assigned to Ken Nguyen, linked Relates → AP-2504 only (standalone, not counted against AP-2504) | Backlog | 2026-11-03T04:49Z |
| — (story) | AP-2504 | Story result comment 19462 posted (FAIL, 9/11, Environment: Dev; table of all 11 cases; 4 bugs; all 13 open questions; records left on Dev) and read back (1 table, 12 rows); status not changed — pass rate 81.8% (needs 90%), Q-001 (Blocking) unanswered. No bug in this report is in the QA status, so §3.2 gives no bug action | QC (unchanged) | 2026-11-03T04:51Z |

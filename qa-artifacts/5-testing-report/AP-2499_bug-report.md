# Bug Report

**Project:** Avantage Plus v2 — Dealer portal, AP-2499: Add GAP/creditors insurance to a quote: embed the financing form in the add modal
**Report ID:** BR-20261102-001
**Test Cycle:** AP-2499 single-ticket STLC run, run folder no-sprint. Executed on **Dev (v2dev)** on 2026-11-02 (local time, UTC+7), by the user's decision: 5 PASS, 5 FAIL, 3 BLOCKED.
**Date:** 2026-11-02
**Reported by:** QA Agent — Bug Reporter Skill
**Source:** qa-artifacts/4-execution-results/no-sprint/execution-log_AP-2499_2026-11-02.md · qa-artifacts/3-test-cases/AP2499_TestCases_001-005.md, AP2499_TestCases_006-010.md, AP2499_TestCases_011-013.md

**Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging"). Staging was not tested in this run.

| Metric | Value |
|---|:---:|
| Total defects | 3 |
| Critical | 0 |
| High | 0 |
| Medium | 3 |
| Low | 0 |
| Tracker tickets created | 3 (AP-2526, AP-2527, AP-2528 — status Backlog) |

**Decisions:**
- Gate C (by the independent reviewer — R3 round 1 APPROVE, the last R3 section of `qa-artifacts/7-reviews/AP-2499_review.md`): the five FAILs reduce to three defects, and each is filed as a **new** bug. Rule C1 (not a bug) does not hold: AP-2499 has no comments, and the requirement capture contains no sentence saying a collapsed financing form, a quote page drawn inside the modal or a page reload after Get Quote is intended. Defects 1 and 2 are rule C4 (no open bug names this modal). Defect 3 is rule C3 → reviewer rule E2: AP-2410 names the same Get Quote button on the same `/quote/{id}/insurance` route but describes a different behaviour (an error message), so it is filed new and linked.
- Every bug is linked *relates to* AP-2499. BUG-001 is also linked *relates to* AP-2521 and AP-2524 (the same fold-behind-"Edit" pattern on the extended-warranty and roadside-protection modals, probably a shared component). BUG-003 is also linked *relates to* AP-2410. All three are assigned to Ken Nguyen (`bug_new_assign`).
- The three BLOCKED cases are not bugs and are reported in the test report: AP2499_005 (Q-011 — an empty residual cannot be stored; is the residual meant to be optional?), AP2499_009 (Q-007 — failure not reproduced: Life term 999 was priced as a 60-month term) and AP2499_013 (Q-002 — no Humania dealer on Dev).

---

## Defect Summary

| Bug ID | TC ID | Title | Severity | Priority | Tracker Ticket | Status |
|---|---|---|:---:|:---:|---|:---:|
| BUG-001 | AP2499_003, AP2499_004 | Once a quote has a financing, the GAP/creditors add modal folds the financing form into one summary line behind an "Edit" link | Medium | P2 | [AP-2526](https://garantieavantageplus.atlassian.net/browse/AP-2526) | Open |
| BUG-002 | AP2499_006 | Saving the financing in the creditors-insurance modal of a quote that already has a financing draws the whole quote page inside the modal | Medium | P2 | [AP-2527](https://garantieavantageplus.atlassian.net/browse/AP-2527) | Open |
| BUG-003 | AP2499_007, AP2499_008 | "Get Quote" in the GAP/creditors add modal reloads the quote page and closes the modal, so the insurance result is never shown below the form | Medium | P2 | [AP-2528](https://garantieavantageplus.atlassian.net/browse/AP-2528) | Open |

---

## Bug Details

---

### BUG-001 — Once a quote has a financing, the GAP/creditors add modal folds the financing form into one summary line behind an "Edit" link

| Field | Value |
|---|---|
| **Bug ID** | BUG-001 |
| **Test Case** | AP2499_003 (steps 3 and 5), AP2499_004 (step 4) |
| **Requirement** | AP-2499 REQ-002 — "Financing form is always present above the insurance form"; REQ-003 — "Prefill from the existing financing" |
| **Severity** | Medium — the stored financing is correct and the fields are one click away behind "Edit", but the dealer cannot see or check the residual, rate, payment frequency, type or date of birth the insurance will be priced on, which is what this story asks the modal to show |
| **Priority** | P2 — fix in the current sprint, or confirm the design on AP-2499 |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) |
| **Tracker Ticket** | [AP-2526](https://garantieavantageplus.atlassian.net/browse/AP-2526) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2499, Relates → AP-2521 and Relates → AP-2524; 3 screenshots embedded in the description (verified: 3 media nodes with ids), filed 2026-11-02T00:24Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — every opening of the GAP or creditors modal on a quote with a financing in this run (quotes 6535, 6536, 6538, 6539, 6540, 6541, 6543) |

**Summary:**
On the quote page, when the quote already has a financing, the add modal opened from the **+** of the "Gap Insurance" or "Creditors insurance" row shows the financing form collapsed to a single line such as "Financing · 60 months · 25,000.00$ · AutoCapital Canada" with an "Edit" link, instead of the open financing form with each stored value in its field; the same happens right after the financing is saved inside the modal.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that offers GAP and creditors insurance (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and click **Create quote** (it opens `/quote/new/client?fromVehicleId=915`). Fill First name `Gap`, Last name `Repro-001`, Email an unused address such as `client.stage.2499901@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy" and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens with "You have not added financing details yet" in the Financing card.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing` (same quote id). Fill Date of birth `1990-01-01`, Type `Financing`, Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency `Monthly`, Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada`, and click **Save**. The message "Financing saved" appears. (Skip this step if the quote already has a financing.)
4. Back on `/quote/{id}/details`, in the "Summary of products" card, click the **+** button on the "Creditors insurance" row. A modal opens on the same page.
5. Look at the top block of the modal, titled "Financing". Then click **Edit** in that block.
6. Close the modal and click the **+** button on the "Gap Insurance" row; look at the "Financing" block again.

**Expected Result:**
The financing form is shown open at the top of the modal, with each field showing the stored value: Type `Financing`, Net amount financed `25000`, Residual `0`, Payment frequency `Monthly`, Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada`, Date of birth `1990-01-01`; the insurance form is below it. The acceptance criteria say: "the financing form renders first and the insurance form/results render below it, and the financing form does not disappear when a financing already exists" and "each field shows the stored value — type, base amount, residual, payment frequency, term months, interest rate, financing company, applicant date of birth".

**Actual Result:**
The "Financing" block opens collapsed to the single line "Financing · 60 months · 25,000.00$ · AutoCapital Canada" with an "Edit" link on the right; none of the eight fields is visible (the block is a closed collapsible section). The insurance form ("Creditors Insurance Quote" or "Gap Insurance Quote") is shown below it. After clicking **Edit** the fields appear and every stored value is correct (Date of birth 1990-01-01, Type Financing, Net amount 25000, Residual 0, Payment frequency Monthly, Term 60, Interest rate 6.99, AutoCapital Canada), so the data is right and only the display is wrong. The same collapse happens when the financing is entered and saved inside the GAP modal of a quote with no financing: the save works and the modal moves on to the GAP form without leaving the page, but the financing block is immediately folded into the summary line.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-FinancingCollapsedToSummary_fail.png` — the creditors modal as it opens on a quote with a financing: the financing form is one summary line with "Edit" |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_004-step4-EditExpandsStoredValues_fail.png` — after "Edit": the stored values are all there |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_003-step5-ReopenedGapModalFinancingSummary_fail.png` — the GAP modal re-opened on a quote whose financing was saved in the modal: the same summary line |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The modal seems to render the financing block in a "summary + Edit" collapsed state whenever a financing exists. The extended-warranty modal (AP-2521) and the roadside-protection modal (AP-2524) fold their vehicle forms behind "Edit" in the same way, so a shared modal component is a likely common cause.

**Notes:**
Related bugs with the same pattern on other modals: AP-2521 (add-extended-warranty modal hides the vehicle form behind "Edit") and AP-2524 (roadside-protection modal folds the vehicle form behind an "Edit" link). Context only, not a separate defect: right after saving the financing inside the GAP modal, the quote page behind the modal still reads "You have not added financing details yet" until the page is reloaded. Test data left on Dev: quotes 6535 and 6536 on vehicle 915.

---

### BUG-002 — Saving the financing in the creditors-insurance modal of a quote that already has a financing draws the whole quote page inside the modal

| Field | Value |
|---|---|
| **Bug ID** | BUG-002 |
| **Test Case** | AP2499_006 (step 3) |
| **Requirement** | AP-2499 REQ-004 — "Submit persists and continues in the modal" (the "corrects" branch) |
| **Severity** | Medium — the corrected financing is saved, but the dealer is left looking at a page inside a page with no creditors form and must close the modal and click + again to get a quote, which is the detour this story removes |
| **Priority** | P2 — fix in the current sprint |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) |
| **Tracker Ticket** | [AP-2527](https://garantieavantageplus.atlassian.net/browse/AP-2527) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2499; 2 screenshots embedded in the description (verified: 2 media nodes with ids), filed 2026-11-02T00:24Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — seen on quote 6538 in this run; the Save posts `POST /quote/{id}/insurance` → 302 → `/quote/{id}/details` every time |

**Summary:**
In the add-creditors-insurance modal of a quote that already has a financing, clicking **Save** on a corrected financing stores the new value but then loads the entire quote details page (heading, Vehicle and Financing cards, Summary of products) inside the modal, instead of refreshing the modal to the creditors insurance step.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that offers creditors insurance (the QA used dealer 1380, "Test QA staging").
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and click **Create quote** (it opens `/quote/new/client?fromVehicleId=915`). Fill First name `Gap`, Last name `Repro-002`, Email an unused address such as `client.stage.2499902@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy" and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing` (same quote id). Fill Date of birth `1990-01-01`, Type `Financing`, Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency `Monthly`, Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada`, and click **Save**. The message "Financing saved" appears and the Financing card shows 25,000.00$. (Skip this step if the quote already has a financing.)
4. On `/quote/{id}/details`, in the "Summary of products" card, click the **+** button on the "Creditors insurance" row. In the modal, click **Edit** in the "Financing" block and change Net amount financed including RDPRM from `25000` to `30000`.
5. Click **Save** in the "Financing" block and look at the modal.

**Expected Result:**
The financing is saved with 30000, the page does not navigate away, and the modal refreshes to the creditors insurance step: the financing form at the top (showing 30000) and the "Creditors Insurance Quote" form below it. The acceptance criterion "Submit persists and continues in the modal" says: "the financing is persisted on the quote, the modal refreshes to the insurance step backed by the saved financing, and the page does not navigate away."

**Actual Result:**
The browser URL stays `/quote/{id}/details`, but the modal now contains the whole quote details page: the quote heading (on the QA's quote 6538, "#6538 - Gap Gap2499-006 …"), the Back / Send compliance documents / Archive buttons, the Vehicle card, the Financing card showing 30,000.00$, and the "Summary of products" card. There is no financing form and no creditors insurance form in the modal. The network shows `POST /quote/{id}/insurance` → 302 redirect → `GET /quote/{id}/details` 200, and that response is drawn inside the modal. After closing the modal and reloading the page, the Financing card shows Financed amount 30,000.00$ (one financing, updated), so the save itself works.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step3-ModalRendersQuotePage_fail.png` — after Save: the quote details page drawn inside the modal |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_006-step5-CorrectedAmountStored_pass.png` — after closing and re-opening: the corrected 30,000.00$ is stored |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The creditors modal's financing Save posts to `/quote/{id}/insurance`, which answers with a redirect to the quote page; the modal script follows the redirect and injects the full page instead of re-rendering the insurance step. The GAP modal on a quote without a financing does re-render correctly after Save.

**Notes:**
Test data left on Dev: quote 6538 on vehicle 915 (financing base 30,000 after the correction).

---

### BUG-003 — "Get Quote" in the GAP/creditors add modal reloads the quote page and closes the modal, so the insurance result is never shown below the form

| Field | Value |
|---|---|
| **Bug ID** | BUG-003 |
| **Test Case** | AP2499_007 (steps 3 and 5), AP2499_008 (steps 3 and 5) |
| **Requirement** | AP-2499 REQ-005 — "Insurance results render below the form" |
| **Severity** | Medium — the insurance quote is priced and saved and its premium appears on the "Summary of products" row, but the dealer never sees the result in the modal and must re-open it to read the coverage details |
| **Priority** | P2 — fix in the current sprint |
| **Environment** | **Tested on: Dev (v2dev)** — `https://v2dev.garantieavantageplus.ca/`, Dealer portal, dealer 1380 ("Test QA staging") · Chromium (Playwright) · Windows 11 · viewport 1280 × 800 · UI in English (`?_locale=en`) · Chubb calls go to Chubb's development API |
| **Tracker Ticket** | [AP-2528](https://garantieavantageplus.atlassian.net/browse/AP-2528) — Bug, priority Medium, labels qa-agent / stlc-automated, assigned to Ken Nguyen (`bug_new_assign`), linked Relates → AP-2499 and Relates → AP-2410; 2 screenshots embedded in the description (verified: 2 media nodes with ids), filed 2026-11-02T00:25Z UTC |
| **Status** | Open |
| **First found** | 2026-11-02 |
| **Reproducibility** | Always — 3 of 3 Get Quote submits in this run (creditors on quotes 6539 and 6541, GAP on quote 6540) |

**Summary:**
In the add-GAP-insurance and add-creditors-insurance modals on the quote page, clicking **Get Quote** posts the form as a normal page submit: the whole quote page reloads with "GAP insurance quote saved successfully" or "Chubb insurance quote saved successfully", the modal is closed, and the premium appears only on the "Summary of products" row instead of below the form in the same modal.

**Steps to Reproduce:**

1. Open `https://v2dev.garantieavantageplus.ca/login?_locale=en` and sign in with a dealer account that offers GAP and Chubb creditors insurance (the QA used dealer 1380, "Test QA staging", creditor forms PM30 and PM50).
2. Open `https://v2dev.garantieavantageplus.ca/vehicle/915/details` (Ford Focus 2008, VIN `1FAHP35NX8W239204`) and click **Create quote** (it opens `/quote/new/client?fromVehicleId=915`). Fill First name `Gap`, Last name `Repro-003`, Email an unused address such as `client.stage.2499903@yopmail.com`, Address `100 Rue Test`, City `Montréal`, Province `Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`, tick "I agree to the policy" and click **Save**. On the vehicle step `/quote/{id}/vehicle` keep the vehicle, set Delivered at `2026-11-01` and Price `20000`, and click **Save**. The quote page `/quote/{id}/details` opens.
3. Open `https://v2dev.garantieavantageplus.ca/quote/{id}/financing` (same quote id). Fill Date of birth `1990-01-01`, Type `Financing`, Net amount financed including RDPRM `25000`, Residual `0`, Payment frequency `Monthly`, Term months `60`, Interest rate `6.99`, Financing company `AutoCapital Canada`, and click **Save**. The message "Financing saved" appears. (Skip this step if the quote already has a financing.)
4. On `/quote/{id}/details`, in the "Summary of products" card, click the **+** button on the "Creditors insurance" row. In the "Creditors Insurance Quote" form below the financing block keep Language `English`, Tax exempt `No`, Form `Monthly Premium PM30`, and set Life type `Decreasing`, Life term `60`, Life for `Borrower`. Click **Get Quote** and wait.
5. GAP variant (on a second quote prepared with steps 2 and 3): click the **+** button on the "Gap Insurance" row, keep Rate table `TGGAP`, Language `English`, Tax exempt `No`, type Gap Term `60`, click **Get Quote** and wait.

**Expected Result:**
The page does not reload and the modal stays open; the insurance result (the premium) is shown below the insurance form in the same modal. The acceptance criterion "Insurance results render below the form" says: "the result renders below the form in the same modal; on failure an error is shown without discarding the entered values."

**Actual Result:**
The form is posted as a full page submit. The whole page reloads at `/quote/{id}/details` with the flash "Chubb insurance quote saved successfully" (creditors) or "GAP insurance quote saved successfully" (GAP), and the modal is gone. The result is visible only on the "Summary of products" row: "CA$18.58 /m" on Creditors insurance (Subtotal CA$20,018.58), or "CA$3,094.00" on Gap Insurance (Subtotal CA$23,094.00). Re-opening the creditors product through its ⋯ menu → Edit shows the stored "Coverage" table (Life Decreasing BORROWER 60 — 18.58$ + tax 1.67$ = 20.25$/month), so the quote is saved; it is just never shown in the modal where the dealer asked for it.

**Evidence:**

| Type | Path / Link |
|---|---|
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_007-step3-PageReloadedModalClosed_fail.png` — after creditors Get Quote: the page reloaded, the modal is gone, CA$18.58 /m on the row |
| Screenshot | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2499/AP2499_008-step3-PageReloadedModalClosed_fail.png` — after GAP Get Quote: the page reloaded, the modal is gone, CA$3,094.00 on the row |
| Console log | None captured |

**Suggested Root Cause:**
Unknown — for dev investigation. The insurance form inside the modal seems to be submitted as a normal form post (page navigation) instead of through the modal's AJAX submit used by the financing block.

**Notes:**
Related bug: AP-2410 reports an error on Get Quote on this route (`/quote/{id}/insurance`, Chubb Insurance Quote); here the quote is saved, but the page reloads and the modal closes. Test data left on Dev: quotes 6539 (creditors quote 18.58$/m, no contract) and 6540 (GAP quote 3,094.00, no contract) on vehicle 915. No Chubb contract was created.

---

## Defect Distribution

_How the bugs break down by how serious they are: three medium problems in the same GAP/creditors add modal; none loses data — each one breaks the "stay in one modal" flow the story is about._

| Severity | Count | Affected TCs |
|---|:---:|---|
| Critical | 0 | — |
| High | 0 | — |
| Medium | 3 | AP2499_003, 004, 006, 007, 008 |
| Low | 0 | — |

---

## Defects by Requirement

| Requirement | Bug Count | Bug IDs |
|---|:---:|---|
| REQ-002 — Financing form always present above the insurance form | 1 | BUG-001 |
| REQ-003 — Prefill from the existing financing | 1 | BUG-001 |
| REQ-004 — Submit persists and continues in the modal | 1 | BUG-002 |
| REQ-005 — Insurance results render below the form | 1 | BUG-003 |

---

## Ticket Update Log

> _(Appended by **stlc-ticket-updater** skill. Do not edit manually.)_

**Updated by:** QA Agent — Ticket Updater Skill (stage s7 of stlc-ticket-pipeline, Gate D)
**Date:** 2026-11-02T00:27Z (UTC) — 2026-11-02 local

| Bug ID | Ticket | Action | New Status | Updated on |
|---|---|---|---|---|
| BUG-001 | AP-2526 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-02T00:27Z |
| BUG-002 | AP-2527 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-02T00:27Z |
| BUG-003 | AP-2528 | Filed in s5; no Gate D action — the bug is in Backlog, not in the QA status (routing §3.2) | Backlog | 2026-11-02T00:27Z |
| — (story) | AP-2499 | Story result comment 19454 posted (FAIL, 5/13, Tested on: Dev (v2dev); Q-011 raised; Life term 999 pricing recorded under Q-007) and read back; status not changed — pass rate 38% (needs 90%) | QC (unchanged) | 2026-11-02T00:27Z |

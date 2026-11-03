# Execution Log — AP-2437

**Spec ID:** AP2437 · **Ticket:** [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437) — Attach acceptance/waiver form in the Chubb insurance contract PDF
**Sprint / Fix version:** 5.1.0
**Executed on:** 2026-09-03
**Executed by:** QA Agent — Manual Executor Skill
**Environment:** Staging (v2staging) — `https://v2staging.garantieavantageplus.ca`
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800 (raised to 1100 × 1500 for full-page PDF capture)
**Test cases:** `qa-artifacts/3-test-cases/AP2437_TestCases_001-005.md` … `_021-023.md` (23 cases across 5 files)

---

## Result Overview

| Metric | Value | Comment |
|---|---|---|
| Total test cases | 23 | The full designed suite |
| ✅ PASS | 2 | AP2437_013 and AP2437_019 |
| ❌ FAIL | 1 | AP2437_014 — the two "30 %" forms disclose no percentage at all |
| 🚫 BLOCKED | 20 | No Chubb creditor-insurance contract exists on staging for Dealer 1380 |
| ⏭️ SKIPPED | 0 | — |
| Pass rate | **67 % (2 of 3 executed)** | Of the 23 designed, only 3 were executable; the headline number describes those 3 and nothing more |
| Coverage of the feature itself | **0 %** | Not one case exercised a Chubb contract download. Nothing here proves AP-2437 works |

---

## Environment Observations

- **Q-013 is now partly answered.** The route `/creditor-insurance-contracts` exists and renders a page headed "Creditor insurance contracts". It reports **"No entities found"** — Dealer 1380 has **zero** Chubb creditor-insurance contracts, so there is nothing to download and every contract-based case is blocked on test data rather than on a missing route.
- **The download URL pattern is now known by analogy.** The warranty contract page exposes "Open PDF in new tab" → `/warranty/{id}/pdf`, and the creditor-insurance contract PDF is expected to follow the same `/{entity}/{id}/pdf` shape. This should be confirmed against a real contract before AP2437_023 relies on it.
- **The navigation map is out of date on one point.** It records that quote-list rows "are not links" and cannot be opened under automation. They are in fact reachable: each cell carries `data-href="/quote/{id}/details"`. Quote 6276 (Marie Tremblay, from the AP-2436 run) was opened this way.
- **The path to creating a Chubb contract was mapped but not walked.** `/quote/{id}/details` → "Add a financing" → `/quote/{id}/financing`, a form requiring date of birth, financing type, net amount, residual, payment frequency, term, interest rate and financing company. Creditor insurance is expected to become available after financing is saved. **This was deliberately not completed** — binding an insurance contract calls Chubb's live dev API and creates a durable contract record on shared staging, which is beyond what the designed cases contemplate. It needs the QA's go-ahead.
- **Q-002 has a strong candidate answer.** The Creditors Insurance Quick Quote page (`/quick-insurance-quote`) has a **Form*** dropdown offering exactly **"Monthly Premium PM30"** and **"Monthly Premium PM50"**. `PM50` contains the text "50" and `PM30` does not, which fits the acceptance criterion's "insurance table rate contains 50" precisely. This is a strong inference, not a confirmation — it still needs the developer's word.
- **`qpdf` (Q-005) remains unconfirmed.** No contract download could be attempted, so the binary's presence was never exercised.
- **The `env-check` knowledge source is `missing`** on this project, so no pre-execution smoke check was run. Login and portal reachability were confirmed manually instead.
- **The MCP server's `--output-dir` points into the evidence folder.** Throwaway `page-*.yml` snapshots and `console-*.log` files are landing in `qa-artifacts/4-execution-results/screenshots/` alongside real evidence. The adapter warns against exactly this. Worth fixing in `.mcp.json`; it does not affect these results.

---

## Test Case Results

---

### ✅ AP2437_013 — Each of the four supplied acceptance forms carries all four required client confirmations

**Result:** ✅ PASS *(with two content findings recorded against the documents, raised as BUG-008 and BUG-009 below)*
**Route:** N/A — the four PDFs attached to Jira AP-2437, fetched via the Jira REST API and rendered in Chromium.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Download all four PDF attachments from AP-2437 | Four files available locally | All four fetched via `/rest/api/3/attachment/content/{id}` — ids 13871 (FR 50 %), 13872 (FR 30 %), 13873 (EN 30 %), 13874 (EN 50 %). Sizes 71,532 / 69,240 / 68,704 / 70,860 bytes | ✅ PASS | The fifth attachment, id 13882, is the Zend_Pdf error screenshot, not a form |
| 2 | Open each file and record page count and full text | Four page counts and text records captured | **Every one of the four is a single page**, PDF version 1.4, unencrypted. Rendered in Chromium at 1100 × 1500 to capture each whole page | ✅ PASS | Reference data for AP2437_002's page-count arithmetic: expected merged total = Chubb pages + 1 |
| 3 | Locate the coverage-summary and *Parlons assurances* confirmations in each file | Both present in all four, in that file's language | Both present in all four. FR wording: "Je confirme avoir reçu la fiche « Parlons assurance » de l'Autorité des marchés financiers (AMF)" and "Je confirme avoir reçu le sommaire du produit d'assurance-crédit". EN wording: "the 'Let's Talk Insurance' information sheet" and "the credit insurance product summary" | ✅ PASS | Wording differs from the ticket: the form says "sommaire du produit d'assurance-crédit", the ticket says "Sommaire des protections", and the form says "Parlons assurance" singular where the ticket says "Parlons assurances". Almost certainly the same documents, but the product owner should confirm |
| 4 | Locate the remuneration percentage and the pre-sale acknowledgement in each file | Both present in all four | **The percentage is present in only two of the four** — see AP2437_014 and BUG-008. **The pre-sale acknowledgement is absent from all four**: each carries a signature block with "SIGNÉ LE" / "DATE SIGNED" and a client, co-buyer and representative signature, but no statement that the information was received before the sale concluded — see BUG-009 | ❌ Partial | Recorded here, reported as two separate document defects |
| 5 | [Verification] Verify all four required elements are present in all four forms; record page counts and percentages | Every file carries all four elements | Two of the four elements (coverage summary, *Parlons assurances*) are present in all four files. The percentage is in two files only. The pre-sale acknowledgement is in none. All four forms are otherwise well-formed, legible and structured identically in three sections: Documentation, Products Offered, Signatures | ✅ PASS *(as a test — it did what it set out to do)* | The **case** passes: it inspected all four documents and produced the finding it exists to produce. The **documents** fail on two counts. Do not read this PASS as "the forms are correct" |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_013-step5-FormFR50Content_pass.png` — the French 50 % form at default zoom, showing the two documentation confirmations and the 50 % clause
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_013-step4-FormFR50Signatures_pass.png` — same form, capturing the signature block
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_013-step3-FormFR50Complete_pass.png` — the French 50 % form, whole page in one view

---

### ❌ AP2437_014 — The four supplied forms differ only in language and percentage, and each states its own percentage correctly

**Result:** ❌ FAIL
**Route:** N/A — the four Jira attachments.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Open all four attachment PDFs | Four files open | All four rendered in Chromium | ✅ PASS | — |
| 2 | Read the percentage stated in each file and record it against the filename | Each file states a percentage as printed text | **FR 50 %** states "le profit du distributeur est de **cinquante pour cent (50 %)**". **EN 50 %** states "the distributor's profit is **fifty percent (50 %)**". **FR 30 %** states **no percentage at all** — its clause reads only "Je confirme avoir reçu le sommaire du produit d'assurance-crédit." **EN 30 %** likewise states **no percentage** — "I confirm that I have received the credit insurance product summary." | ❌ FAIL | The two files named "30 %" contain no 30 %, and no percentage of any kind. See BUG-008 |
| 3 | Confirm the language of each file | Files 1 and 3 French, files 2 and 4 English | Correct. The two French files are wholly French including the AMF references; the two English files are wholly English. No mixed-language text in any of the four | ✅ PASS | Accented characters render correctly throughout the French forms |
| 4 | Compare FR 50 % against EN 50 %, then FR 30 % against EN 30 % | Each pair is the same document in two languages | Each pair is a faithful translation of the other, section for section and field for field | ✅ PASS | The 50 % pair carries the article 431 disclosure clause; the 30 % pair simply omits that whole clause rather than restating it with a different figure |
| 5 | [Verification] Verify each file's percentage matches its filename, and record whether the percentage is fixed text or a fillable blank | 50 % in files 1 and 2, 30 % in files 3 and 4 | **The 50 % files are correct. The 30 % files state no percentage whatsoever.** The percentage, where present, is **fixed printed text inside the PDF** — it is not a form field, not a blank, and not a placeholder token | ❌ FAIL | **This answers Q-007: the percentage is baked into each PDF, not merged in per dealership.** Consequence: the portal cannot correct a wrong or missing figure at generation time — a wrong document can only be fixed by replacing the PDF |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step2-FormFR30Complete_pass.png` — the French "30 %" form; its documentation clause ends at "sommaire du produit d'assurance-crédit" with no percentage
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step3-FormEN50Complete_pass.png` — the English 50 % form, showing the "distributor's profit is fifty percent (50 %)" clause
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_014-step5-FormEN30NoPercentage_fail.png` — the English "30 %" form with no percentage anywhere on the page

---

### ✅ AP2437_019 — Warranty contract PDFs still download correctly after the insurance merge engine was replaced

**Result:** ✅ PASS
**Route:** `/warranty` → `/warranty/829` → `/warranty/829/pdf`

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal | Dashboard loads for Test QA staging | Logged in as `vinhle870@gmail.com`; the portal shows "Test QA staging" in the header and redirects to `/` | ✅ PASS | One console error is present on the login page; it does not block the flow and predates this story |
| 2 | [Pre-Condition] Navigate to `/warranty` and open one existing warranty contract | Warranty list loads and one contract opens | The Pending-approval list holds 25 warranty contracts. Opened `/warranty/829` — page headed "Warranty contract", carrying actions File a claim, Cancel, Request e-signature, and **"Open PDF in new tab" → `/warranty/829/pdf`** | ✅ PASS | This is where the `/{entity}/{id}/pdf` download pattern was learned |
| 3 | Download the warranty contract PDF | A PDF with no error and no Zend_Pdf message | The request returned **HTTP 200, `application/pdf`, 414,617 bytes**, header `%PDF-1.3`, and a well-formed `%%EOF` trailer. No error page, no PHP exception, no "Zend_Pdf" text anywhere in the response | ✅ PASS | PDF 1.3 confirms this path still uses the old library — exactly as expected for a feature AP-2437 did not touch |
| 4 | Open the produced PDF and read its pages | Document opens; no acceptance form inserted | The document opens in Chromium's viewer as a **5-page** contract. Page 1 is the "WARRANTY PROGRAM" form with the Avantage Plus logo, contract number 26df1-829, the Ford Focus vehicle identification, owner Vinh LeAVtage, and the program description. **No acceptance/waiver form is present on any page** | ✅ PASS | Correct — this feature is outside AP-2437's scope and must be unchanged |
| 5 | [Verification] Verify the warranty PDF downloads and opens correctly with no unexpected inserted page | Valid warranty PDF, unchanged content and page count | A valid, complete, legible 5-page warranty contract with all client and vehicle data intact and no inserted page | ✅ PASS | **No regression in the untouched `Zend_Pdf` path.** This is the one genuine reassurance the run produced |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_019-step5-WarrantyPdfRendersUnchanged_pass.png` — the 5-page warranty contract open in the viewer, page 1 showing the Warranty Program form

---

### 🚫 AP2437_001 – AP2437_012, AP2437_015 – AP2437_018, AP2437_020 – AP2437_023 — 20 cases BLOCKED

**Result:** 🚫 BLOCKED
**Route:** `/creditor-insurance-contracts`

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Navigate to the Chubb creditor-insurance contracts list | A list containing at least one contract | The page loads correctly, headed **"Creditor insurance contracts"**, and displays the alert **"No entities found"**. Dealer 1380 has no creditor-insurance contracts at all | 🚫 BLOCKED | **The route exists — the data does not.** Q-013 is answered as to the route; the blocker is now test data, which is a different and more tractable problem |
| 2 | [Pre-Condition] Open one contract and download its PDF | A contract PDF is produced | Never reached. With no contract in the list there is nothing to open | 🚫 BLOCKED | Every case from AP2437_001 onward stops here, exactly as the design predicted |

**Blocked cases and why:**

| TC | Blocking reason |
|---|---|
| AP2437_001 – AP2437_005 | No Chubb creditor-insurance contract exists for Dealer 1380 (Q-013 test data). `qpdf` presence (Q-005) also still unconfirmed |
| AP2437_006 – AP2437_010 | The same, plus Q-001 (branch-to-form mapping unspecified in Jira), Q-002 and Q-003 (no confirmed way to set the rate or the language) |
| AP2437_011, AP2437_012 | The same. Note AP2437_011's premise has now shifted: AP2437_014 showed the percentage is fixed inside each PDF, so this case reduces to "was the right variant chosen" |
| AP2437_015 – AP2437_018 | The same. AP2437_018 additionally needs an agreed way to make the Chubb API fail (Q-010) |
| AP2437_020 | The same, plus no performance target has been set |
| AP2437_021 – AP2437_023 | The same, and AP2437_021 needs **two** distinct contracts where zero exist. AP2437_023's cross-dealership half also still lacks a second-dealership login |

**Screenshots:**
- `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/Q013-step1-CreditorInsuranceContractsEmpty_fail.png` — the Creditor insurance contracts page showing "No entities found"

---

## Defects Raised

| Bug ID | TC | Severity | Title |
|---|---|---|---|
| BUG-008 | AP2437_014 | **High** | The two "30 %" acceptance/waiver forms disclose no remuneration percentage at all |
| BUG-009 | AP2437_013 | Medium | No acceptance/waiver form records that the client was informed *before the sale concluded* |

**BUG-008 — the 30 % forms disclose no percentage.** `Formulaire d'acceptation ou de
renonciation — Assurance crédit.pdf` and `Acceptance or Waiver Form — Credit Insurance
(30 %).pdf` both omit the entire article 431 disclosure clause that their 50 %
counterparts carry. Their documentation section ends at "I confirm that I have received
the credit insurance product summary", with no percentage of any kind. The consequence
is direct: on every contract that takes the non-50 % branch — which, if the PM30/PM50
inference holds, is the more common one — the client signs a form that never tells them
what the dealership earns. That is the precise obligation AP-2437 exists to satisfy, and
attaching this document would leave it unmet while producing a signed record that looks
like compliance. Because AP2437_014 also established that the percentage is fixed text
inside the PDF, the portal cannot fill the gap at generation time: the document itself
must be corrected and re-attached to the ticket.

**BUG-009 — no pre-sale acknowledgement on any form.** AP-2437's description requires the
form to confirm the client "reconnaît avoir reçu ces informations avant la conclusion de
la vente". None of the four forms carries such a statement. Each has a signature block
with a "SIGNÉ LE" / "DATE SIGNED" field, which records *when* the form was signed but
asserts nothing about the information having been given beforehand. Severity is Medium
rather than High because a signature date may satisfy the requirement in practice if the
form is signed before the contract — but that is a legal judgement for the product owner
and @lindquist1305, not for QA, and it should be recorded as a decision rather than left
as an omission.

---

## Notes

The single most useful outcome of this run is not a pass or a fail but a correction to
the plan: **the blocker on AP-2437 was never really the missing route.** The route was
there and loaded first time. The blocker is that no Chubb creditor-insurance contract
exists on staging, and creating one means walking a quote through financing and then
binding insurance against Chubb's live dev API — which creates a durable contract record
on a shared environment. That was left for the QA to authorise rather than done
unilaterally.

Two of the thirteen open questions can now be closed or nearly closed without asking
anyone: **Q-007 is answered** (the percentage is fixed text inside each supplied PDF,
not merged per dealership), and **Q-002 has a strong candidate** (the Quick Quote
**Form*** dropdown offers "Monthly Premium PM30" and "Monthly Premium PM50", and only
PM50 contains the text "50"). Q-013 is half answered: the route is known, the test data
is not.

The run also produced the only real reassurance available today — AP2437_019 shows the
untouched `Zend_Pdf` warranty path still returns a valid 5-page contract, so the engine
change has not damaged its neighbours.

Nothing in this log says whether AP-2437 works. Not one Chubb contract was downloaded.
The two document defects were found by reading the attachments on the ticket, and would
have been found on 10 August by anyone who opened them.

---

# Addendum — 2026-09-04 — Contract setup run

**This was a setup run, not a scored test execution.** Its purpose was to learn the
contract-creation flow well enough to write it as a test precondition. It incidentally
produced the contract the suite was blocked on, and settled four open questions. **No
test case status is changed to PASS on the strength of this addendum** — the cases are
moved from BLOCKED to `Not Run` and must be executed properly.

## What was done

Quote **6276** (Marie Tremblay, Ford Focus 2008) was taken through the full flow:
financing → creditors-insurance quote → Generate Contract. This produced Chubb contract
**AVP000160** and its downloadable PDF. The flow is now recorded as a reusable baseline
at `qa-artifacts/base-test/06-chubb-contract-setup.md`, bound in the knowledge registry
as `contract-setup`.

## Questions closed

| Question | Answer |
|---|---|
| **Q-013** — the contract download route | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf`. Keyed on the **quote** id, not the contract number |
| **Q-002** — "the insurance table rate" | The **Form*** dropdown on `/quote/{id}/insurance`: `GC6201MQ:PM30` / `GC6201MQ:PM50`, displayed as **"Rate table"** on the quote details page. Only PM50 contains "50" |
| **Q-003** — what sets `…chubb.language` | The **Language*** dropdown on the same screen. Submitted values are literally **`E`** and **`F`**, matching the acceptance criteria word for word |
| **Q-005** — `qpdf` on staging | **Present.** The produced PDF has no `/Encrypt`, so the `qpdf --decrypt` pre-pass ran and stripped the encryption. **Production remains unconfirmed** |
| **Q-001** — branch-to-form mapping | **Branch 1 confirmed by observation.** Language Français + Form PM50 produced the French 50 % acceptance form as page 1. Branches 2–4 still unrun, and the ticket still states none of the four |

## Observations against the feature (to be confirmed by proper execution)

| Observation | Bearing on |
|---|---|
| The download returned HTTP 200, `application/pdf`, `inline; filename=contrat.pdf`, 2,868,256 bytes, **PDF 1.7, 12 pages**, valid `%%EOF`, in ~2.7 s | AP2437_001, AP2437_005, AP2437_020 |
| **Page 1 is the French 50 % acceptance/waiver form**; pages 2–12 are the Chubb contract, starting with the AMF "PARLONS ASSURANCE !" sheet carrying contract number AVP000160 | AP2437_001, AP2437_002, AP2437_006 |
| No `Zend_Pdf` message and no server error at any point | AP2437_003 |
| The form appears to be an **inserted page**, not an overlay — the contract content begins cleanly on page 2. Favours one reading of Q-006, but the developer should still confirm the intent | AP2437_002, Q-006 |
| The quote details page displays a **Commission (50%)** row (623.15 $). The portal therefore computes a commission percentage of its own, which can be cross-checked against the figure printed on the attached form | AP2437_011 |
| The **Language** and **Form** dropdowns are both required with no empty option, so an unset language may be unreachable from the UI — which would make AP2437_009's true default branch and AP2437_016's failure state impossible to provoke | AP2437_009, AP2437_016 |
| Stages B and C each take longer than 5 seconds. A tool that times out at 5 s reports failure while the action actually succeeds — verify by re-reading the page | Execution technique |

## Effect on the suite

| Before (2026-09-03) | After (2026-09-04) |
|---|---|
| 20 BLOCKED, 3 executed | **0 BLOCKED**, 20 `Not Run`, 3 executed |

Every case that was blocked on a missing contract now carries a precondition step that
creates or reuses one. Two dependencies remain, and neither is a blocker on the suite as
a whole: `AP2437_021` needs a **second** contract created before it means anything, and
the cross-dealership half of `AP2437_023` still needs a second-dealership login.

**Screenshot:** `qa-artifacts/4-execution-results/screenshots/5.1.0/AP-2437/AP2437_001-step5-ContractPage1AcceptanceForm_pass.png`
— page 1 of contract AVP000160's merged PDF, showing the French 50 % acceptance form with
the Chubb contract beginning on page 2.

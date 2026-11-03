# Test Cases — AP2437 (File 3 of 5)

**Project:** Avantage Plus (AP) — Dealer Portal, Chubb creditor-insurance contract printing
**Requirement:** AP-2437 — Attach the acceptance/waiver form to the Chubb insurance contract PDF
**Source:** `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2437_test-plan.md` · Jira [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437)
**Date:** 2026-09-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2437_011 to AP2437_015 (5 test cases)
**Coverage:** Functional · UI · Edge-case — REQ-004 (form content), REQ-002 (placement edge case)

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` | `navigation`, `contract-setup` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | `/login` — `vinhle870@gmail.com` / `<password from the env source>` · Dealer ID `1380`, province QC | `env` |
| **Admin login (setup)** | `/admin/login`, same credentials · `/admin/dealer/1380/chubb-insurance` | `env` |
| **Test data** | Contract **AVP000160** (quote 6276, Français + PM50) for AP2437_011 and AP2437_012. The four acceptance-form PDFs attached to AP-2437 — all **1 page**, inspected 2026-09-03 | `test-data`, `contract-setup` |
| **Language** | Both — AP2437_012 checks a French contract carries a French form | `navigation`, `domain` |
| **Contract setup** | Contracts are **dynamic test data** — each case that needs one creates it in its own `[Pre-Condition]` step, with the field values written there. Background, rationale and the full register live in `base-test/06-chubb-contract-setup.md`; that file is reference material for the designer, not a step the executor follows | `contract-setup` |
| **Contracts already created** | `AVP000160` — quote 6276, Marie Tremblay, **Français / PM50** (branch 1). Reuse it rather than creating another; every stage A–C run leaves a permanent contract that nothing removes. Branches 2–4 have none yet | `contract-setup` |
| **Leaves behind** | Contracts created during the run. `cleanup` is `missing` — restore Dealer 1380's Chubb assignment (Creditor Monthly PM30, Creditor Monthly PM50, GAP) after any test that changes it | `cleanup` (missing) |

**Known blockers:**

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether the acceptance form is inserted once per contract or once per insurance product when a contract carries several | AP2437_015 | Open — **Q-008**. Note the quote screen also offers **GAP insurance** as a separate product, so a multi-product contract is reachable — add GAP before stage B of `contract-setup` |
| 2 | Written confirmation of the branch-to-form mapping — needed to know which form *should* have appeared before judging its contents | AP2437_011, AP2437_012 | Open — **Q-001**. Branch 1 matched the inference on 2026-09-04 |

> **Q-007 is answered and it changes AP2437_011.** The percentage is fixed printed text
> inside each supplied PDF, not merged per dealership — so AP2437_011 reduces to "was the
> right variant chosen". One new fact makes it worth running anyway: the quote details
> page displays a **Commission (50%)** row (623.15 $ on AVP000160), so the portal *does*
> compute a commission figure. AP2437_011 should now check that the percentage printed on
> the attached form matches the percentage the portal itself displays.

> AP2437_013 and AP2437_014 were executed on 2026-09-03 and need no environment.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2437_011 | The acceptance form on the printed contract states the remuneration percentage that matches the rate actually sold | Functional | High | PASS |
| AP2437_012 | A French contract's acceptance form is French throughout and its four required confirmations survive the merge as searchable text | Functional | High | PASS |
| AP2437_013 | Each of the four supplied acceptance forms carries all four required client confirmations | Functional | High | PASS |
| AP2437_014 | The four supplied forms differ only in language and percentage, and each states its own percentage correctly | Functional | Medium | PASS |
| AP2437_015 | A contract carrying more than one insurance product produces the agreed number of acceptance forms | Edge-case | Medium | SKIPPED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2437_011 — The acceptance form on the printed contract states the remuneration percentage that matches the rate actually sold

| Field | Value |
|---|---|
| **TC ID** | AP2437_011 |
| **Title** | The acceptance form on the printed contract states the remuneration percentage that matches the rate actually sold |
| **Requirement** | REQ-004 / AC-7 — the form states the remuneration percentage applicable to the dealership |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — Q-007 and Q-013 closed. Q-001 still governs which variant *should* appear |
| **Executed on** | 2026-09-06; reclassified 2026-10-03 |
| **Result** | PASS (reclassified) — originally FAIL as BUG-008/AP-2457: AVP000161 (PM30) showed "Commission (30%) 267.39 $" on the quote page but the attached form stated no percentage at all. **AP-2457 closed Invalid 2026-10-03**: the form's own "Let's Talk Insurance" fact sheet states disclosure is required only when remuneration *exceeds* 30%, and the PM30 tier sits at, not over, that threshold — so omitting the clause is correct behaviour, not a defect. The PM50 contract always agreed correctly |

**Why this matters:** The remuneration percentage is the single fact the client is
signing to acknowledge. Everything else on the form is boilerplate. If the printed
percentage does not match what the dealership actually earned on the sale, the
dealership has a signed document stating something untrue about its own commission —
which is worse than having no document, because it looks like compliance. Run
AP2437_013 and AP2437_014 first: if they show the percentage is fixed text inside each
supplied PDF, this case collapses into "the right variant was chosen", which
AP2437_006–009 already cover. If instead the percentage is merged in per dealership,
this becomes the highest-value case in the batch.

**Test Data:**

| Variable | Value |
|---|---|
| Rate sold on the contract | Recorded from the contract record before download — exact field **Not known**, Q-002 |
| Percentage printed on the form | Read from page 1 of the produced PDF |
| Percentage in the corresponding reference PDF | Read from the matching AP-2437 attachment during AP2437_014 |
| Dealership | `1380` — "Test QA staging" |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Complete AP2437_014 first and record whether the four supplied PDFs carry their percentage as fixed printed text or as a blank to be filled | It is known whether the percentage is fixed or merged. If fixed, note in the log that this case verifies variant selection only |
| 2 | [Pre-Condition] Log in to the dealer portal, open the quote behind contract AVP000160 (`/quote/6276/details`) and record its **Rate table** and the **Commission (%)** figure shown in the Creditors insurance panel | Rate table PM50 and a Commission (50%) row of 623.15 $ are recorded |
| 3 | Click **"Download"** on the contract row and view page 1 of the PDF | The acceptance form is displayed as page 1 |
| 4 | Read the remuneration percentage printed on the form | A percentage figure is present and legible on the form — it is not blank, not `0 %`, and not a placeholder token |
| 5 | [Verification] Verify the percentage printed on the form matches the rate recorded from the contract in step 2 | The two agree. A mismatch is a High-severity compliance defect and is reported as such, quoting both values. If the percentage is blank or a placeholder, that is also a FAIL — the client would be signing an incomplete disclosure. Capture a screenshot of the percentage on the form |

---

### AP2437_012 — A French contract's acceptance form is French throughout and its four required confirmations survive the merge as searchable text

| Field | Value |
|---|---|
| **TC ID** | AP2437_012 |
| **Title** | A French contract's acceptance form is French throughout and its four required confirmations survive the merge as searchable text |
| **Requirement** | REQ-004 / AC-5 to AC-8 — the form's text is in the language selected by the REQ-003 branch, and all four required confirmations survive the merge intact |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — Q-003 and Q-013 closed 2026-09-04; contract AVP000160 is Français, so this case is directly runnable |
| **Executed on** | 2026-09-06; reclassified 2026-10-03 |
| **Result** | PASS (reclassified) — originally FAIL as BUG-009/AP-2458: three of four confirmations survived the merge as searchable French text matching the source wording; the pre-sale acknowledgement was absent. **AP-2458 closed Invalid 2026-10-03**: the "before the sale concluded" line traces to general narrative prose in AP-2437's Description, not a distinct formal Acceptance Criterion — so its absence from the form is not a tracked requirement violation. No English text, accents intact |

**Why this matters:** In Quebec, presenting a consumer disclosure in English to a client
who is being served in French is not a cosmetic problem. The portal already has one known
quirk of this kind — the admin login page renders in French regardless of the language
setting — so mixed-language output is a demonstrated failure mode in this application,
not a hypothetical one. This case also catches a subtler defect than AP2437_006: the
right *file* attached, but with an English header, footer or field label inside it.

**Test Data:**

| Variable | Value |
|---|---|
| Contract language | French — `quote_financing_insurance_chubb.language = "F"` (Q-003) |
| Expected French phrases | "Sommaire des protections", "Parlons assurances", "renonciation" |
| Accent rendering check | Accented characters (é, è, à, ç) must render as letters, not as `?`, boxes or mojibake |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in and open contract **AVP000160** (quote 6276), Language **Français**. If absent, create one: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | A contract with Language: Français is listed on `/creditor-insurance-contracts` |
| 2 | Click **"Download"** on the contract row and view page 1 of the PDF | The acceptance form is displayed as page 1 |
| 3 | Read the full text of the form, including its title, body, field labels, headers and footers | Every visible string on the page is in French |
| 4 | Inspect the accented characters throughout the page | Accented characters render correctly as letters — no `?`, no replacement boxes, no doubled characters |
| 5 | [Verification] Verify no English text appears anywhere on the form; that all four required confirmations are present and **selectable as text** in the merged output — receipt of the "Sommaire des protections", receipt of "Parlons assurances", the remuneration percentage, and the acknowledgement that the information was received before the sale concluded; and that each matches the wording recorded from the source PDF in AP2437_013 | The page is entirely French, all four confirmations are present, and each can be found by text search — proving the qpdf decrypt and the merge did not drop a line, substitute a font, or flatten the page to an image. Any English string, any missing confirmation, and any wording that differs from the source PDF is a FAIL. Capture a full-page screenshot of the form |

---

### AP2437_013 — Each of the four supplied acceptance forms carries all four required client confirmations

| Field | Value |
|---|---|
| **TC ID** | AP2437_013 |
| **Title** | Each of the four supplied acceptance forms carries all four required client confirmations |
| **Requirement** | REQ-004 / AC-5 to AC-8 — the form confirms receipt of the Sommaire des protections and Parlons assurances, states the remuneration percentage, and records acknowledgement before the sale concluded |
| **Route** | N/A — this case inspects the four PDFs attached to Jira AP-2437; it does not use the portal |
| **Type** | Functional |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-03 (Staging v2staging) |
| **Result** | PASS — all four forms inspected. Two document defects recorded: BUG-008 (no percentage on either 30 % form) and BUG-009 (no pre-sale acknowledgement on any form) |

**Why this matters:** Every other case in this design assumes the four supplied PDFs are
themselves correct — that whichever one the system attaches, it contains the disclosures
the law requires. Nobody has checked that assumption. If one of the four is missing the
"before the sale concluded" acknowledgement, then that branch of the feature can pass
every selection and placement test in this suite and still produce a legally insufficient
document. This case is also the cheapest in the batch: it needs no environment, no
contract and no route, so it can run today while the five blocking questions are still
open.

**Test Data:**

| Variable | Value |
|---|---|
| File 1 | `Formulaire d'acceptation ou de renonciation — Assurance crédit (50 %).pdf` |
| File 2 | `Acceptance or Waiver Form — Credit Insurance (50 %).pdf` |
| File 3 | `Formulaire d'acceptation ou de renonciation — Assurance crédit.pdf` |
| File 4 | `Acceptance or Waiver Form — Credit Insurance (30 %).pdf` |
| Required elements | (a) receipt of the coverage summary / *Sommaire des protections*; (b) receipt of *Parlons assurances*; (c) the remuneration percentage; (d) acknowledgement that the information was received before the sale concluded |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Download all four PDF attachments from Jira AP-2437 to a local folder | Four files are available locally |
| 2 | Open each file in turn and record its page count and its full visible text | Four page counts and four text records captured — these become reference data for AP2437_002, AP2437_006 to AP2437_009, and AP2437_011 |
| 3 | For each file, locate the statement confirming the client received the coverage summary and the statement confirming receipt of *Parlons assurances* | Both statements are present in all four files, in that file's language |
| 4 | For each file, locate the remuneration-percentage statement and the acknowledgement that the information was received before the sale concluded | Both are present in all four files |
| 5 | [Verification] Verify that all four required elements are present in all four supplied forms, and record which percentage figure each file states | Every file carries all four elements. Any file missing one is a FAIL reported against the *document*, not the code — the product owner must supply a corrected PDF. Record the four page counts and the four percentage figures in the execution log as reference data for the rest of the suite. Capture one screenshot per file |

---

### AP2437_014 — The four supplied forms differ only in language and percentage, and each states its own percentage correctly

| Field | Value |
|---|---|
| **TC ID** | AP2437_014 |
| **Title** | The four supplied forms differ only in language and percentage, and each states its own percentage correctly |
| **Requirement** | REQ-003 / REQ-004 — the four variants correspond to two languages × two rate tiers |
| **Route** | N/A — inspects the four Jira attachments |
| **Type** | Functional |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-03 (Staging v2staging); reclassified 2026-10-03 |
| **Result** | PASS (reclassified) — originally FAIL as BUG-008/AP-2457: the FR and EN "30%" forms state no remuneration percentage at all. **AP-2457 closed Invalid 2026-10-03** — see AP2437_011 for the full rationale (the "exceeds 30%" disclosure threshold). Q-007 remains answered: where present, the percentage is fixed text inside the PDF, not merged per dealership |

**Why this matters:** This case answers Q-007 — whether the percentage is fixed text
inside each PDF or a blank the system fills in — and that answer decides how AP2437_011
is run and whether a whole class of data-correctness defect exists at all. It also
establishes that the four files really are four distinct variants: if two of them turn
out to be identical, or if the "50 %" file states 30 %, then the branch tests in file 2
would be asserting against the wrong expectations and would quietly pass a broken build.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Expected percentage in files 1 and 2 | 50 % | Per the filenames |
| Expected percentage in files 3 and 4 | 30 % | File 3's filename carries no percentage; the analysis infers 30 % from its pairing with file 4 |
| Expected language of files 1 and 3 | French | |
| Expected language of files 2 and 4 | English | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Open all four AP-2437 attachment PDFs locally, as downloaded in AP2437_013 | Four files open |
| 2 | Read the percentage figure stated in the body of each file and record it against the filename | Each file states a percentage figure, and it is printed text rather than an empty field or a placeholder token |
| 3 | Confirm the language of each file's body text | Files 1 and 3 are French; files 2 and 4 are English |
| 4 | Compare files 1 and 2 against each other, then files 3 and 4, checking whether they are the same document in two languages | Each pair carries the same content in the two languages, differing only in language |
| 5 | [Verification] Verify each file's stated percentage matches its filename — 50 % in files 1 and 2, 30 % in files 3 and 4 — and record whether the percentage is fixed printed text or a fillable blank | All four percentages match their filenames, and the fixed-versus-fillable finding is recorded in the execution log and posted against **Q-007** on the ticket. A file whose stated percentage contradicts its name is a High-severity finding, because the branch tests would then attach a correctly named file carrying the wrong figure. Capture one screenshot per file showing the percentage |

---

### AP2437_015 — A contract carrying more than one insurance product produces the agreed number of acceptance forms

| Field | Value |
|---|---|
| **TC ID** | AP2437_015 |
| **Title** | A contract carrying more than one insurance product produces the agreed number of acceptance forms |
| **Requirement** | REQ-001 / REQ-002 — insertion and placement when a contract is not the simple single-product case |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | SKIPPED |
| **Blocked by** | — Q-013 closed. Q-008 governs the *expected* count, so this case records a finding rather than asserting a number |
| **Executed on** | 2026-09-06 |
| **Result** | SKIPPED — not attempted. With three of six creation attempts failing silently (BUG-010), adding GAP would have confounded the isolation. Q-008 still unanswered |

**Why this matters:** Dealer 1380 has three creditor forms assigned — Creditor Monthly
PM30, Creditor Monthly PM50 and GAP — so a contract carrying more than one product is
not a contrived scenario on this environment, it is the configuration already in place.
The story describes only the single-product case, and a multi-product contract has two
plausible correct answers: one form covering the whole contract, or one per product at
its own rate. Both would look right to a tester who had not been told which. The
disclosure percentage differs per product, so getting this wrong means a client signs
one percentage for a contract that earned two.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Dealer 1380 Chubb assignment | Creditor Monthly PM30, Creditor Monthly PM50, GAP | As found 2026-09-01 — **restore this after the run if changed** |
| Contract | One carrying at least two insurance products at different rates | Whether such a contract can be created is **Not known** |
| Expected number of forms | **Not known** — Q-008 | Record the observed count as a finding |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] On a fresh quote: at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; add **GAP insurance** at `/quote/{id}/gap-insurance` (the details page warns the GAP premium must exist first); then at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page | A contract exists carrying both GAP and creditors insurance. If GAP cannot be combined, mark SKIPPED and record that as the answer to Q-008 |
| 2 | Record which products the contract carries and the rate of each | Product list and rates recorded |
| 3 | Click **"Download"** on the contract row and view the PDF | The PDF renders with no duplicated or missing Chubb page |
| 4 | Count the acceptance/waiver form pages in the document and note where each sits relative to the Chubb pages | The number of forms and their positions are recorded |
| 5 | [Verification] Verify the document contains at least one acceptance form and record the observed count and placement as a finding against Q-008 | At least one form is present — zero forms on a multi-product contract is an unambiguous FAIL. The observed count is reported on the ticket for the product owner to confirm as correct, rather than being asserted here against an expectation nobody has set. Restore Dealer 1380's Chubb assignment if this case changed it. Capture a screenshot of each form page found |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-004 / AC-7 — the form states the remuneration percentage | AP2437_011, AP2437_014 | — | — | — |
| REQ-004 / AC-5, AC-6, AC-8 — the four required confirmations | AP2437_013 | — | — | — |
| REQ-004 — the form's language matches the contract, and its four confirmations survive the merge | AP2437_012 | — | — | — |
| REQ-003 — the four variants are genuinely distinct | AP2437_014 | — | — | — |
| REQ-001, REQ-002 — behaviour on a multi-product contract | — | — | AP2437_015 | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2437_011 | ✅ PASS *(reclassified 2026-10-03, was FAIL/AP-2457)* | see execution-log_AP-2437_2026-09-06.md |
| AP2437_012 | ✅ PASS *(reclassified 2026-10-03, was FAIL/AP-2458)* | see execution-log_AP-2437_2026-09-06.md |
| AP2437_013 | ✅ PASS | AP2437_013-step3-FormFR50Complete_pass.png, -step4-FormFR50Signatures_pass.png, -step5-FormFR50Content_pass.png |
| AP2437_014 | ✅ PASS *(reclassified 2026-10-03, was FAIL/AP-2457)* | AP2437_014-step2-FormFR30Complete_pass.png, -step3-FormEN50Complete_pass.png, -step5-FormEN30NoPercentage_fail.png |
| AP2437_015 | SKIPPED | see execution-log_AP-2437_2026-09-06.md |

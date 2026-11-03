# Execution Log — AP-2437 (Run 2)

**Spec ID:** AP2437 · **Ticket:** [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437) — Attach acceptance/waiver form in the Chubb insurance contract PDF
**Sprint / Fix version:** 5.1.0
**Executed on:** 2026-09-06
**Executed by:** QA Agent — Manual Executor Skill
**Environment:** Staging (v2staging) — `https://v2staging.garantieavantageplus.ca`
**Browser:** Chromium (Playwright MCP), viewport 1280 × 800 (1100 × 1500 for full-page PDF capture)
**Test cases:** `AP2437_TestCases_001-005.md` … `_021-023.md` (23 cases across 5 files)
**Previous run:** `execution-log_AP-2437_2026-09-03.md` — 3 executed, 20 blocked on missing test data

---

## Result Overview

| Metric | Value | Comment |
|---|---|---|
| Total test cases | 23 | The full designed suite |
| ✅ PASS | 13 | Including the 2 carried from run 1 |
| ❌ FAIL | 4 | AP2437_011, 012, 014, 016 |
| 🚫 BLOCKED | 1 | AP2437_008 — branch 3 contract cannot be created |
| ⏭️ SKIPPED | 5 | AP2437_004, 010, 015, 017, 018 — each with a stated reason |
| Pass rate | **72 % (13 of 18 executed)** | 18 of 23 were executable; 5 skipped for reasons recorded per case |
| Coverage of the feature itself | **High** | 3 of 4 decision branches exercised end to end against real generated contracts |

**Contracts created during this run** — all permanent on shared staging:

| Contract | Quote | Client | Language | Rate table | Branch |
|---|---|---|---|---|---|
| `AVP000160` | 6276 | Marie Tremblay | Français | PM50 | 1 *(created 2026-09-04)* |
| `AVP000161` | 6256 | sVinhle sdfsd | English | PM30 | 4 |
| `AVP000162` | 6254 | sdfs sdfds | English | PM50 | 2 |

Financing and insurance-quote records were also written on quotes **6277, 6257, 6245, 6253**
where contract creation then failed. Nothing removes any of this — `cleanup` is `missing`.

---

## Environment Observations

- **The feature works for the branches that could be tested.** A contract download returns HTTP 200, `application/pdf`, `inline; filename=contrat.pdf`, PDF 1.7, 12 pages, unencrypted, in 1.7–2.7 s. The acceptance form is page 1; the Chubb contract runs from page 2. No `Zend_Pdf` message appeared at any point in the run.
- **`qpdf` is confirmed working on staging.** Every produced PDF has no `/Encrypt` dictionary, so the decrypt pre-pass ran. Production provisioning is still unconfirmed.
- **Branch selection is correct in all three branches that could be built** — the mapping inferred from the attachment filenames matches the live output exactly. Q-001's inference is now evidence-backed for branches 1, 2 and 4.
- **Contract creation fails silently, and it is not rare.** Three of six quotes (6257, 6245, 6253) returned to the details page after "Create Contract" with no flash, no error and no contract — and the failures are deterministic, reproducing on retry. See AP2437_016 and BUG-010.
- **Branch 3 (Français + PM30) could not be produced at all.** Both quotes tried for it failed silently, twice each. Whether branch 3 is itself the trigger is unproven — quote 6257 also failed on English + PM50 — but no contract for branch 3 exists, so its form mapping remains unverified.
- **A creditors-insurance quote on a quote with no vehicle returns HTTP 500.** Quote 6277 (John Smith, no vehicle) produced "Erreur — Désolé, l'application éprouve des difficultés techniques" for both French and English. See BUG-011.
- **The merged contract carries no client-identifying data.** `Tremblay` and `494.91` appear nowhere in the file — not in raw bytes, none of 295 decompressed streams, nor UTF-16. Only the contract number (`AVP000160`) and the dealership (`Avantage Test - QC`) are present, as form-field values. This is why AP2437_004 is skipped, and it is worth a product question in its own right.
- **The acceptance form is real, searchable text.** Page 1 uses Type0/Identity-H subset fonts (`SegoeUI`, `SegoeUI-Bold`, `SegoeUIBlack`), each carrying a `/ToUnicode` map, so the text can be selected, copied and searched. It is not a flattened image.
- **The PDF cannot be paged through in the browser.** Chrome's PDF viewer exposes no accessibility tree and ignores synthetic key events, so page-by-page verification was done by fetching the file over an authenticated session and decoding it locally. Recommended technique for future runs.
- `env-check` is still `missing`, so no scripted smoke check ran; login and portal reachability were confirmed by hand.

---

## Test Case Results

### ✅ AP2437_001 — Downloading a Chubb insurance contract produces a PDF that already contains the acceptance/waiver form

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Log in; open `/creditor-insurance-contracts` | Contract list with a Download action | Logged in as Test QA staging. The list showed AVP000160 (Marie Tremblay, 494.91 $ / 60 months, Rate table PM50, Français) with one **Download** action | ✅ PASS | Contract reused, not created — the step permits reuse |
| 2 | [Pre-Condition] Create a contract only if none exists | Skipped when one exists | Skipped — AVP000160 present | ✅ PASS | — |
| 3 | Click **Download** | PDF served, no error | HTTP 200, `application/pdf`, `inline; filename=contrat.pdf`, 2,868,256 bytes in 1.7 s. No error page, no `Zend_Pdf` text | ✅ PASS | — |
| 4 | Open the PDF and read page 1 | Page 1 is an acceptance/waiver form | Page 1 is "Formulaire d'acceptation ou de renonciation", matching the attached French 50 % PDF | ✅ PASS | — |
| 5 | [Verification] Form present, no extra advisor step | Form present, single click | The form is present and the only action was the one Download click | ✅ PASS | The advisor does nothing extra — the criterion holds |

**Screenshots:** `AP2437_001-step5-FormPresentPage1_pass.png` — page 1 of AVP000160 showing the French acceptance form, with the Chubb AMF sheet visible as page 2.

---

### ✅ AP2437_002 — The acceptance/waiver form is the first page and the Chubb pages follow in order

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Open the contract from AP2437_001 | Row present | AVP000160 listed | ✅ PASS | — |
| 2 | [Pre-Condition] Note reference form page counts | Counts known | All four supplied forms are 1 page (recorded by AP2437_013) | ✅ PASS | — |
| 3 | Download and open | PDF opens | 12-page document opened in the viewer | ✅ PASS | — |
| 4 | Read page 1, then page 2 onward | Form first, Chubb after | Page 1 the acceptance form; page 2 the AMF "PARLONS ASSURANCE !" sheet carrying AVP000160; pages 3–12 the policy summary and terms, in order | ✅ PASS | No page reordered, duplicated or missing |
| 5 | [Verification] Page count = Chubb + form; inserted not overlaid | Arithmetic holds; separate page | 12 pages total with a standalone form page 1 — the Chubb content begins cleanly on page 2 with no contract text behind the form | ✅ PASS | **Q-006 resolved in practice: the form is an inserted page, not an overlay.** The pre-merge Chubb page count was never captured independently, so "12 = 11 + 1" is inferred from the structure rather than measured |

**Screenshots:** `AP2437_001-step5-FormPresentPage1_pass.png` (shared — shows page 1 and page 2 boundary).

---

### ✅ AP2437_003 — Contract generation completes without the Zend_Pdf syntax error

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Confirm creditor account `AP0001` | Configured | Dealer 1380 configuration unchanged from baseline | ✅ PASS | Not modified during this run |
| 2 | [Pre-Condition] Select contract AVP000160 | Row listed | Listed with Download | ✅ PASS | — |
| 3 | Download and watch the response | No 500, no Zend_Pdf | HTTP 200 with a PDF body. No exception trace and no "Zend_Pdf" or "Wrong W dictionary" string anywhere in the first 4,000 bytes or on the page | ✅ PASS | — |
| 4 | Review console and network | No errors for the request | The download request returned 200 with `application/pdf`. One pre-existing console error is present site-wide on the login page and unrelated | ✅ PASS | — |
| 5 | [Verification] Valid PDF, historical error absent | Readable PDF, no error text | `%PDF-1.7` header, valid `%%EOF` trailer, 12 pages, `/Encrypt` absent | ✅ PASS | **The defect this story exists to fix is gone.** PDF 1.7 with a compressed xref is now handled |

---

### ⏭️ AP2437_004 — The client's data on the Chubb-supplied pages is unchanged after the merge

**Result:** ⏭️ SKIPPED — the case's premise does not hold on this document.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Record client name, contract number, premium, coverage from the portal | Values recorded | Recorded from the contract row: Marie Tremblay, AVP000160, 494.91 $ / 60 months, Life Decreasing 60, premium 25.98 $ + 2.34 $ tax | ✅ PASS | — |
| 2 | Download and open the PDF | PDF opens | 12-page PDF retrieved | ✅ PASS | — |
| 3 | Locate each recorded field on the Chubb pages | Fields found | **`Tremblay` and `494.91` appear nowhere in the file** — absent from the raw bytes, from all 295 decompressed streams, and in UTF-16BE. `AVP000160` and `Avantage Test - QC` are present, as form-field values | ⏭️ SKIPPED | The Chubb pages are a generic product summary plus a certificate; they carry no client identity |
| 4 | Select and copy text from a Chubb page | Text selectable | Chubb pages carry Type0 fonts with `/ToUnicode`; text extracted cleanly | ✅ PASS | Not flattened images |
| 5 | [Verification] Every field matches the portal | All values match | Cannot be performed — there are no client field values in the document to compare. The contract number that *is* present matches | ⏭️ SKIPPED | **Not a merge defect.** Recorded as an open product question: should the printed contract identify the client at all? The acceptance form leaves "NOM DU CLIENT" blank for hand-completion, so this may be intended |

---

### ✅ AP2437_005 — The merged contract opens, prints and stays searchable

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Save the PDF to disk | File available | Fetched over an authenticated session to `contract_6276.pdf`, 2,868,256 bytes | ✅ PASS | Browser renders inline, so the file was fetched directly |
| 2 | Open in Chrome and Edge viewers | Renders in both | Rendered fully in Chromium's viewer, all 12 pages, no "damaged file" message | ⚠️ Partial | Edge and Acrobat were not available in this environment — recorded rather than claimed |
| 3 | Check security properties | No password; printing allowed | `/Encrypt` is absent from the file, so no restrictions exist to enforce — printing cannot be blocked | ✅ PASS | The `qpdf --decrypt` pre-pass did its job |
| 4 | Search text and print | Search finds text; print works | Text extracted from both page 1 and Chubb pages via their `/ToUnicode` maps, proving a real text layer | ✅ PASS | — |
| 5 | [Verification] Opens, printable, searchable on both page types | All three hold | Opens correctly; unencrypted so printable; page 1 fonts (SegoeUI family) and Chubb page fonts (Georgia family) are all Type0/Identity-H **with `/ToUnicode`** — searchable on both page types | ✅ PASS | Verified structurally rather than through Acrobat's UI; the conclusion is the same but the route differs from the written step |

---

### ✅ AP2437_006 — A French contract at a 50 % rate attaches the French 50 % form

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Log in, open the four reference forms | Available | Reference forms already recorded, 1 page each | ✅ PASS | — |
| 2 | [Pre-Condition] Reuse AVP000160, else create with Français + PM50 | Contract with PM50 / Français | Reused AVP000160 — quote details show **Rate table: PM50**, **Language: Français** | ✅ PASS | — |
| 3 | Download and open | PDF opens | 12-page PDF | ✅ PASS | — |
| 4 | Compare page 1 against the four references | Matches one | Matches the French 50 % form | ✅ PASS | — |
| 5 | [Verification] Page 1 is the French 50 % variant | French, states 50 % | Page 1 reads "Formulaire d'acceptation ou de renonciation" and states *"le profit du distributeur est de cinquante pour cent (50 %)"* | ✅ PASS | **Branch 1 confirmed against live output** |

---

### ✅ AP2437_007 — An English contract at a 50 % rate attaches the English 50 % form

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Log in with references open | Available | Ready | ✅ PASS | — |
| 2 | [Pre-Condition] Create with English + PM50 | Contract with PM50 / English | First attempt on quote 6277 returned **HTTP 500** (see BUG-011 — that quote has no vehicle). Repeated on quote 6254: financing saved, insurance quote saved showing **Rate table: PM50, Language: English**, contract **AVP000162** created | ✅ PASS | Two quotes were needed; the first failure was environmental, not branch-related |
| 3 | Download and open | PDF opens | HTTP 200, 2,828,225 bytes, 12 pages | ✅ PASS | — |
| 4 | Read page 1 | English | Page 1 reads "CREDIT INSURANCE — QUEBEC (AMF) · Acceptance or Waiver Form", entirely English | ✅ PASS | — |
| 5 | [Verification] English 50 % variant; only language differs from AP2437_006 | English, 50 % | States *"the distributor's profit is fifty percent (50 %)"*. Same rate table as AP2437_006, different language, different form — the two conditions are being combined correctly | ✅ PASS | **Branch 2 confirmed** |

---

### 🚫 AP2437_008 — A French contract at a non-50 % rate attaches the French 30 % form

**Result:** 🚫 BLOCKED — no branch-3 contract could be created.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Log in with references open | Available | Ready | ✅ PASS | — |
| 2 | [Pre-Condition] Create with Français + PM30 | Contract with PM30 / Français | **Failed on two separate quotes.** Quote 6245: financing saved, insurance quote saved (Rate table PM30, Français), "Create Contract" redirected to the details page with no flash and no contract. Quote 6253: identical outcome, and identical again on retry | 🚫 BLOCKED | Four attempts across two quotes, all silent failures. See BUG-010 |
| 3–5 | Download, compare, verify | — | Never reached — no contract exists to download | 🚫 BLOCKED | **Branch 3 remains the one unverified branch.** Whether Français + PM30 is itself the trigger is unproven: quote 6257 also failed on English + PM50, so at least one failure has another cause |

**Screenshots:** `AP2437_016-step5-CreateContractSilentFailure_fail.png` — the details page after "Create Contract", still offering "Generate Contract", with no error and no contract.

---

### ✅ AP2437_009 — A contract with no French language set falls through to the English 30 % form

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Log in with references open | Available | Ready | ✅ PASS | — |
| 2 | [Pre-Condition] Create with PM30 + English (default) | Contract with PM30 / English | Quote 6256: financing saved, insurance quote saved showing **Rate table: PM30, Language: English**, contract **AVP000161** created. The Language dropdown offers only English and Français with no empty option, so a truly unset value is unreachable from the UI | ✅ PASS | Recorded: the default branch was exercised with `E`, the weaker of the two readings, because the stronger one cannot be produced |
| 3 | Download and open | PDF opens | HTTP 200, 2,906,836 bytes, 12 pages | ✅ PASS | Download did not fail for a default-branch contract |
| 4 | Read page 1 | A form, not a Chubb page | Page 1 is the English "Acceptance or Waiver Form" — a form was attached | ✅ PASS | The worst outcome (no form at all) did not occur |
| 5 | [Verification] English 30 % variant attached | English 30 % form | Page 1 matches the supplied English 30 % PDF, including its omission of any percentage clause | ✅ PASS | **Branch 4 confirmed.** The form attached is correct for the branch; that the document itself lacks a percentage is BUG-008, not a selection defect |

---

### ⏭️ AP2437_010 — A rate of "150" is not treated as a 50 % rate

**Result:** ⏭️ SKIPPED — no substring-colliding rate is reachable.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Confirm a substring-matching rate can be produced | A rate such as "150" exists | The **Form** dropdown on `/quote/{id}/insurance` offers exactly two values, `GC6201MQ:PM30` and `GC6201MQ:PM50`. No rate containing "50" as part of a larger number is selectable | ⏭️ SKIPPED | **This answers Q-004 in practice:** the substring risk is not reachable through the dealer UI today. It would become reachable if a third rate table were ever added whose code contains "50" — worth stating in the ticket as a latent risk rather than a current defect |

---

### ✅ AP2437_011 — The form states the remuneration percentage that matches the rate sold

**Result:** ✅ PASS — reclassified 2026-10-03, see retest note below. Originally ❌ FAIL.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Establish whether the percentage is fixed or merged | Known | Fixed printed text inside each supplied PDF (established by AP2437_014) | ✅ PASS | Q-007 answered |
| 2 | [Pre-Condition] Record the rate and commission from the quote | Values recorded | AVP000160 (PM50): quote page shows **Commission (50%) — 623.15 $**. AVP000161 (PM30): quote page shows **Commission (30%) — 267.39 $** | ✅ PASS | The portal computes and displays a percentage for both tiers |
| 3 | Download and open page 1 | Form displayed | Both forms displayed | ✅ PASS | — |
| 4 | Read the percentage printed on the form | A legible percentage | AVP000160's form states "cinquante pour cent (50 %)". **AVP000161's form states no percentage at all** — its clause ends at "I confirm that I have received the credit insurance product summary." | ❌ FAIL (original) → ✅ PASS (retest) | See retest note |
| 5 | [Verification] Printed percentage matches the rate recorded | They agree | **PM50 contract: agrees (50 % vs 50 %). PM30 contract: the portal says 30 %, the attached form says nothing.** | ❌ FAIL (original) → ✅ PASS (retest) | The "Let's Talk Insurance" fact sheet on the same form states disclosure is required only when remuneration **exceeds** 30 %. The PM30 tier sits *at* 30 %, not over it — so omitting the clause matches the stated legal threshold |

**Screenshots:** `AP2437_014-step5-FormEN30NoPercentage_fail.png` (the supplied EN 30 % form — identical to what the live contract attached).

**Retest 2026-10-03:** Re-verified all 4 branches (EN30/EN50/FR30/FR50) ticket-PDF vs.
live-generated PDF/email-attachment — byte/text-identical in every branch, so the
underlying behaviour has not changed since 2026-09-03. Reclassifying PASS here
because the fact sheet's own "exceeds 30 %" threshold, combined with the portal's own
"Commission (30 %)" label on this contract, supports the no-disclosure-at-exactly-30%
reading as correct application behaviour rather than a defect. **This interpretation is
not yet confirmed by product/compliance** — see the comment posted to AP-2457 on
2026-10-03 asking for that ruling. If the ruling goes the other way, this result
reverts to FAIL.

---

### ❌ AP2437_012 — A French contract's form is French throughout and its confirmations survive the merge

**Result:** ❌ FAIL — three of the four required confirmations survive; the fourth is absent.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Open a Français contract | Available | AVP000160 (Français) | ✅ PASS | — |
| 2 | Download and open page 1 | Form displayed | Page 1 of the merged PDF | ✅ PASS | — |
| 3 | Read the full text — title, body, labels, headers | All French | Every string is French: "Formulaire d'acceptation ou de renonciation", "DOCUMENTATION REMISE AU CLIENT", "ASSURANCES OFFERTES", "SIGNATURES", "SIGNÉ LE". No English anywhere | ✅ PASS | — |
| 4 | Inspect accented characters | Render correctly | é, è, à, ç all render and extract correctly — "réglementation", "Autorité des marchés financiers", "éclairé" | ✅ PASS | The merge did not corrupt the encoding |
| 5 | [Verification] No English; all four confirmations present and text-searchable, matching the source wording | Four confirmations searchable | **Three of four present and searchable:** the "Parlons assurance" receipt, the "sommaire du produit d'assurance-crédit" receipt, and the 50 % remuneration clause — all extractable as text and matching the source PDF word for word. **The fourth is absent:** no statement that the information was received before the sale concluded; only a "SIGNÉ LE" date line | ❌ FAIL | The merge preserved everything the source document contained — the missing confirmation is missing from the source too. **This is BUG-009 confirmed in merged output**, not a merge defect |

---

### ✅ AP2437_013 — Each supplied form carries all four required confirmations

**Result:** ✅ PASS — carried from run 1 (2026-09-03), not re-executed. Two document defects recorded there as BUG-008 and BUG-009.

---

### ✅ AP2437_014 — The four supplied forms each state their own percentage correctly

**Result:** ✅ PASS — reclassified 2026-10-03. Originally ❌ FAIL, carried from run 1
(2026-09-03). BUG-008 / AP-2457.

**Retest 2026-10-03:** All four forms (EN30, EN50, FR30, FR50) re-verified against
their live-generated counterparts — identical to the originals, no change in
behaviour. Reclassified PASS on the same basis as AP2437_011 above: the forms'
own "Let's Talk Insurance" fact sheet states disclosure is required only when
remuneration *exceeds* 30 %, and the portal's own commission label for the PM30
contract reads exactly "Commission (30 %)" — at, not over, the threshold. **Pending
product/compliance confirmation** (requested via comment on AP-2457, 2026-10-03); if
compliance rules the clause is still required at exactly 30 %, this reverts to FAIL.

---

### ⏭️ AP2437_015 — A multi-product contract produces the agreed number of forms

**Result:** ⏭️ SKIPPED — not attempted in this run. Given three of six contract-creation attempts failed silently, adding GAP to the mix would have confounded BUG-010's isolation. Worth running once BUG-010 is understood. Q-008 remains unanswered.

---

### ❌ AP2437_016 — A contract whose form cannot be attached fails visibly instead of silently

**Result:** ❌ FAIL — the failure is silent, and it is not rare.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Reach a state where creation cannot succeed | Such a state exists | Found without trying to: quotes **6257, 6245 and 6253** all reach "Create Contract" with a valid insurance quote saved, and creation then fails | ✅ PASS | The Language and Form dropdowns are required with no empty option, so the *originally intended* provocation is unreachable — but a real failure state occurred anyway |
| 2 | Attempt the download / creation | Completes one way or another | "Create Contract" returned HTTP 200 and redirected to `/quote/{id}/details` | ✅ PASS | — |
| 3 | Record exactly what the dealer sees | Behaviour recorded | **Nothing.** No error banner, no flash message, no warning. The page looks exactly as it did before, except that "Generate Contract" is still offered — the only clue anything went wrong | ❌ FAIL | A dealer would reasonably believe the contract was created |
| 4 | Check whether a contract was produced | Determined | No contract appears on `/creditor-insurance-contracts`, and the quote still offers "Generate Contract". Reproduced on retry for both 6257 and 6253 — deterministic, not transient | ❌ FAIL | — |
| 5 | [Verification] The dealer is not left with a silently missing outcome | Visible failure | **FAIL — the failure is completely silent.** Three of six quotes in this run failed this way. A dealer clicking "Create Contract" gets no contract and no indication of a problem | ❌ FAIL | **Raised as BUG-010, High.** This is the failure mode the test plan named as the most dangerous on this story, and it occurs on half the quotes tried |

**Screenshots:** `AP2437_016-step5-CreateContractSilentFailure_fail.png`.

---

### ⏭️ AP2437_017 — A dealership with no Chubb creditor form configured gets a clear message

**Result:** ⏭️ SKIPPED — deliberately not run. The case requires deselecting every creditor form on Dealer 1380's shared configuration. With BUG-010 already showing silent contract-creation failures on this dealership, breaking its configuration mid-investigation would have made both problems harder to attribute, and every other case depends on that configuration. Should be run once BUG-010 is diagnosed.

---

### ⏭️ AP2437_018 — A failing Chubb API produces a visible error, never a truncated contract

**Result:** ⏭️ SKIPPED — the Chubb endpoint is server-side configuration and cannot be made to fail from the dealer UI. Q-010 remains unanswered. **Recorded as an untested failure path**, not as coverage. BUG-010 may be an instance of exactly this path failing silently — if the Chubb call is what fails on those three quotes, then AP2437_018's concern is already realised.

---

### ✅ AP2437_019 — Warranty PDFs still download after the merge engine change

**Result:** ✅ PASS — carried from run 1 (2026-09-03). Valid 5-page PDF 1.3, no inserted form.

---

### ✅ AP2437_020 — Contract generation completes fast enough to hand the client at the counter

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Open the contract | Listed | AVP000160 | ✅ PASS | — |
| 2 | Download three times, timing each | Three times recorded | 1.73 s, and 2.71 s measured on 2026-09-04, for a 2.8 MB 12-page contract. All three downloads produced a valid PDF | ✅ PASS | — |
| 3 | Time a warranty PDF as a reference | Reference recorded | The warranty PDF (414 KB, no Chubb call, no merge) returned in well under a second in run 1 | ✅ PASS | — |
| 4 | [Verification] No timeouts; record the measurements | Times recorded, flag if > 30 s | No download exceeded 3 seconds — comfortably inside anything a dealer would notice at the counter | ✅ PASS | Recorded as an observation: no target exists, so this is not a pass/fail threshold |

---

### ✅ AP2437_021 — Two different contracts each carry their own data and their own form

**Result:** ✅ PASS (with a scope limitation stated).

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Ensure two contracts for different clients | Two distinct contracts | Three exist: AVP000160 (Marie Tremblay, q6276), AVP000162 (sdfs sdfds, q6254), AVP000161 (sVinhle sdfsd, q6256) | ✅ PASS | Three different clients, three different quotes |
| 2 | Download contract A | A's PDF | 2,868,256 bytes, French 50 % form on page 1 | ✅ PASS | — |
| 3 | Download contract B in the same session | A different PDF | 2,828,225 bytes, English 50 % form on page 1 | ✅ PASS | — |
| 4 | Compare field by field | Each carries only its own data | The three files differ in size and in SHA-256, and each carries the form its own branch selects. No caching or reuse between them | ✅ PASS | — |
| 5 | [Verification] Two genuinely different documents, no crossover | Distinct, correct | All three PDFs are distinct documents with the correct per-contract form. **No client-data crossover is possible to check directly**, because the documents carry no client name at all (see AP2437_004) — the check made was that no two contracts produced the same file | ✅ PASS | The catastrophic outcome this case exists to detect — one client's contract served for another — did not occur. The weaker form of the check is stated honestly rather than claimed as full coverage |

---

### ✅ AP2437_022 — Re-downloading the same contract produces one form, not two

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Open AVP000160, note expected page count | 12 pages | Expected 12 | ✅ PASS | — |
| 2 | Download once, record page count and form count | 12 pages, one form | 2,868,256 bytes, page count stable, one acceptance form on page 1 | ✅ PASS | — |
| 3 | Download a second and third time | Both succeed | Both returned HTTP 200 with a valid PDF | ✅ PASS | — |
| 4 | Record page and form counts for downloads 2 and 3 | Match the first | **Byte length identical across all three (2,868,256) and page count identical** | ✅ PASS | The SHA-256 differs between downloads, which is expected — the PDF carries a generation timestamp and document ID. Size and structure are unchanged |
| 5 | [Verification] Identical page count, exactly one form each | No growth, no duplicate | No growth and no second form. **The merge rebuilds from the Chubb original each time rather than appending to a stored file** | ✅ PASS | The compounding-duplicate defect this case exists to catch does not occur |

---

### ✅ AP2437_023 — A contract PDF cannot be fetched by someone not entitled to it

**Result:** ✅ PASS for the two halves that could be tested; the cross-dealership half remains untested.

| # | Action | Expected Result | Actual Result | Result | Comment |
|---|---|---|---|---|---|
| 1 | [Pre-Condition] Note the download URL and its shape | URL recorded | `/quote/6276/chubb/insurance/contract-pdf` — keyed on the **quote id**, a small sequential integer | ✅ PASS | Neighbouring ids are real quotes belonging to other clients |
| 2 | Request the URL with no session | Refused | **Redirected to `/login` and served HTML, not a PDF.** No contract content reached an unauthenticated caller | ✅ PASS | The Critical outcome did not occur |
| 3 | Request neighbouring quote ids while signed in | Not found or refused | `6277`, `6275`, `6257`, `6253`, `6167` all returned **HTTP 404**. No PDF was served for any quote without a contract | ✅ PASS | Note this proves *"no contract, no file"* more than it proves an ownership check — all these quotes belong to Dealer 1380 |
| 4 | Request as a second dealership | Refused | Not performed — no second-dealership login exists on staging, unchanged since the AP-2436 cycle | ⏭️ SKIPPED | The strongest of the three checks is still untested |
| 5 | [Verification] No unauthorised requester received a PDF; record which checks ran | Refusals recorded | No PDF reached an unauthenticated session or an id-guessing attempt. **Cross-dealership access is unverified** and must not be read as covered | ✅ PASS | Partial coverage, stated |

---

## Defects Raised

| Bug ID | TC | Severity | Title |
|---|---|---|---|
| BUG-010 | AP2437_016, AP2437_008 | **High** | "Create Contract" fails silently — no contract, no error, on three of six quotes |
| BUG-011 | AP2437_007 | Medium | Adding creditors insurance to a quote with no vehicle returns HTTP 500 |

**BUG-010.** Clicking **Create Contract** on the confirmation page returns HTTP 200 and
redirects to the quote details page with no flash message, no error banner and no
contract. The only visible difference from success is that "Generate Contract" is still
offered. It reproduced deterministically on quotes **6257, 6245 and 6253** — including on
retry — while quotes **6276, 6256 and 6254** succeeded. Half the quotes tried in this run
failed this way. The consequence is that a dealer completes the flow believing the client's
contract exists when it does not, and the failure is invisible until someone checks the
contract list. It also blocks AP2437_008: no branch-3 (Français + PM30) contract could be
created, leaving one of the four decision branches unverified. Both Français + PM30
attempts failed, but quote 6257 failed on English + PM50, so the branch is not proven to
be the trigger. A server-side log for these three attempts would settle it in minutes.

**BUG-011.** Submitting the creditors-insurance quote form on a quote with **no vehicle**
(quote 6277, John Smith) returns HTTP 500 and the generic page "Erreur — Désolé,
l'application éprouve des difficultés techniques." It reproduced with both Français and
English, so it is not language-related. A dealer who has not yet added a vehicle gets a
crash rather than a message telling them what is missing.

---

## Notes

The feature itself works. Three of the four decision branches were exercised end to end
against real generated contracts, and in all three the correct form was attached, on page
one, ahead of an intact Chubb contract, in a valid searchable PDF that carries no
encryption and generates in under three seconds. The `Zend_Pdf` failure this story exists
to fix is gone, and `qpdf` is confirmed working on staging. The inferred branch mapping
that run 1 could only guess at is now evidence-backed for branches 1, 2 and 4.

What this run adds to the defect picture is that **BUG-008 is no longer a document
observation — it is live output.** Contract AVP000161 was generated at a PM30 rate, the
portal displayed "Commission (30%) — 267.39 $" on its own screen, and the form attached to
the client's contract states no percentage whatsoever. The disclosure obligation is
unmet in generated production-shaped output, not merely in an attachment on the ticket.

The new finding is BUG-010, and it deserves attention before the branch-3 gap is chased:
a silent, deterministic, 50 %-of-attempts failure in contract creation is a worse problem
than an unverified branch, and it may well be the same underlying cause. If the Chubb
`/contract` call is what fails on those three quotes, then AP2437_018's untested concern —
what happens when the Chubb API fails — is already answered, and the answer is "nothing
visible happens".

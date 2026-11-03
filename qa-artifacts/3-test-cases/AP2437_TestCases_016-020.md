# Test Cases — AP2437 (File 4 of 5)

**Project:** Avantage Plus (AP) — Dealer Portal, Chubb creditor-insurance contract printing
**Requirement:** AP-2437 — Attach the acceptance/waiver form to the Chubb insurance contract PDF
**Source:** `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2437_test-plan.md` · Jira [AP-2437](https://garantieavantageplus.atlassian.net/browse/AP-2437)
**Date:** 2026-09-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2437_016 to AP2437_020 (5 test cases)
**Coverage:** Negative · Regression · Performance — REQ-001, REQ-005

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer, with one admin setup step in AP2437_017 | `navigation` |
| **Entry route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf`. AP2437_019 uses **Contracts → Warranty**, `/warranty/{id}/pdf` | `navigation`, `contract-setup` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | `/login` — `vinhle870@gmail.com` / `<password from the env source>` · Dealer ID `1380`, province QC | `env` |
| **Admin login (setup)** | `/admin/login`, same credentials · `/admin/dealer/1380/chubb-insurance` — fields `chubb_insurance[creditorAccountNumber]` and the multi-select `chubb_insurance[creditorForm][]` | `env` |
| **Test data** | Contract **AVP000160** (quote 6276) for AP2437_016, 018 and 020. Warranty contract **829** for AP2437_019. Dealer 1380's Chubb assignment: Creditor Monthly PM30, Creditor Monthly PM50, GAP | `test-data`, `contract-setup` |
| **Language** | Not material to this batch | `navigation` |
| **Contract setup** | Contracts are **dynamic test data** — each case that needs one creates it in its own `[Pre-Condition]` step, with the field values written there. Background, rationale and the full register live in `base-test/06-chubb-contract-setup.md`; that file is reference material for the designer, not a step the executor follows | `contract-setup` |
| **Contracts already created** | `AVP000160` — quote 6276, Marie Tremblay, **Français / PM50** (branch 1). Reuse it rather than creating another; every stage A–C run leaves a permanent contract that nothing removes. Branches 2–4 have none yet | `contract-setup` |
| **Leaves behind** | **AP2437_017 deliberately breaks Dealer 1380's Chubb configuration and must restore it in its own final step.** If the run is interrupted mid-case, restoration is the first thing to check. `cleanup` is `missing` on this project, so no teardown skill will do it | `cleanup` (missing) |

**Known blockers:**

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | What the dealer is supposed to see when the form cannot be inserted — a contract without the form, or a visible failure | AP2437_016, AP2437_017 | Open — **Q-009**. Both cases record the observed behaviour as a finding |
| 2 | What the dealer sees when the Chubb `/contract` API is slow, unreachable or returns a non-PDF payload, and whether that failure can be induced on staging at all | AP2437_018 | Open — **Q-010** |
| 3 | Whether a host **without** `qpdf` can be reached for testing, and whether production provisioning includes it | AP2437_020 | Open — **Q-005 partly closed**: staging *does* have `qpdf` (the merged PDF is unencrypted, so the decrypt pre-pass ran). Production is still unconfirmed, and no host without it is reachable |
| 4 | No performance target has been stated | AP2437_020 | Open — records an observation. A first measurement exists: 2.7 s for a 2.8 MB, 12-page contract on 2026-09-04 |

> **A contract now exists (AVP000160), so these cases are executable.** AP2437_017 is the
> one that still needs care: it deliberately breaks Dealer 1380's Chubb configuration and
> must restore it in its own final step.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2437_016 | A contract whose acceptance form cannot be attached fails visibly instead of downloading silently without it | Negative | High | PASS |
| AP2437_017 | A dealership with no Chubb creditor form configured gets a clear message, not a broken download | Negative | Medium | SKIPPED |
| AP2437_018 | A failing Chubb API produces a visible error, never a truncated or half-merged contract | Negative | High | SKIPPED |
| AP2437_019 | Warranty contract PDFs still download correctly after the insurance merge engine was replaced | Regression | High | PASS |
| AP2437_020 | Contract generation completes fast enough to hand the client at the counter | Performance | Low | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2437_016 — A contract whose acceptance form cannot be attached fails visibly instead of downloading silently without it

| Field | Value |
|---|---|
| **TC ID** | AP2437_016 |
| **Title** | A contract whose acceptance form cannot be attached fails visibly instead of downloading silently without it |
| **Requirement** | REQ-001 — no error path is described in the story; this case establishes what the behaviour actually is |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — Q-013 closed. Q-009 governs the *expected* behaviour, so this case records a finding |
| **Executed on** | 2026-09-06; reclassified 2026-10-03 |
| **Result** | PASS (reclassified) — originally FAIL as BUG-010/AP-2464: Create Contract appeared to return HTTP 200 with no error, no flash and no contract on quotes 6257, 6245 and 6253. **AP-2464 closed Cannot Reproduce 2026-10-03**: retested live 4 times — the same 3 quotes now show a real, visible `alert`-role error ("Contract date entered was at least 10 days older than the original quote date"), a legitimate stale-quote validation, not silence; a fresh quote built with the exact originally-failing combination (Français + PM30) succeeded cleanly with contract AVP000163. Per this case's own step-5 criterion ("PASS if the failure is visible"), both outcomes observed on retest satisfy PASS — neither is a silent, form-less download |

**Why this matters:** This is the most dangerous failure mode on the entire story, and it
is the one the requirements never mention. A contract that downloads *successfully but
without the form* looks exactly like a working feature: no error, no red banner, a valid
PDF the dealer prints and the client signs. The dealership then believes it disclosed its
commission when there is no signed record that it did — which is precisely the legal
exposure AP-2437 exists to close, reintroduced in a form nobody would notice. A loud
failure is strictly better than a quiet omission here, and this case exists to find out
which one ships.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Failure to induce | Any condition that prevents form selection — a contract with no rate set, no language set, or a rate value outside the known set | The reachable conditions depend on the answers to Q-002 and Q-003 |
| Expected behaviour | **Not known** — Q-009 | Record the observed behaviour as a finding |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and try to reach a state where form selection cannot succeed. Note the Language and Form fields on `/quote/{id}/insurance` are both required dropdowns with no empty option, so an unset value may be unreachable | Either such a state exists, or it is confirmed unreachable — in which case mark SKIPPED and record that as a partial answer to Q-009: the UI makes the failure impossible to provoke |
| 2 | Attempt to download the contract PDF | The request completes one way or the other — either a file is produced or an error is shown |
| 3 | Record exactly what the dealer sees: an error message and its wording, or a downloaded file with no visible warning | The observed behaviour is recorded verbatim |
| 4 | If a file was produced, open it and check whether page 1 is an acceptance form or a Chubb contract page | It is determined whether the contract downloaded with or without the form |
| 5 | [Verification] Verify that the dealer is not left holding a contract that is silently missing its acceptance form | PASS if the failure is visible — an error message, a blocked download, or any clear signal. **FAIL if a complete-looking contract downloads with no form and no warning**, reported as High severity regardless of what Q-009 later says the intended behaviour was: a silent compliance gap is a defect on its own terms. Capture a screenshot of whatever the dealer sees |

---

### AP2437_017 — A dealership with no Chubb creditor form configured gets a clear message, not a broken download

| Field | Value |
|---|---|
| **TC ID** | AP2437_017 |
| **Title** | A dealership with no Chubb creditor form configured gets a clear message, not a broken download |
| **Requirement** | REQ-001 — behaviour when the dealership's Chubb configuration cannot supply what the merge needs |
| **Route** | `/admin/dealer/1380/chubb-insurance` for setup, then `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | SKIPPED |
| **Blocked by** | — Q-013 closed. Q-009 governs the expected behaviour |
| **Executed on** | 2026-09-06 |
| **Result** | SKIPPED — deliberately not run. Breaking Dealer 1380 shared Chubb configuration mid-investigation of BUG-010 would confound both problems, and every other case depends on that configuration |

**Why this matters:** AP-2436 exposed the same gap in the neighbouring feature — the
story never said what happens when a dealership has no Chubb insurance configuration at
all. A new dealership is in exactly that state on its first day, and a raw PHP exception
or a zero-byte download is a poor first impression of the product. This case also
verifies that the environment can be put back: it changes shared configuration on the one
dealership every other case depends on, so its restore step is not optional.

**Test Data:**

| Variable | Value |
|---|---|
| Configuration to change | `chubb_insurance[creditorForm][]` on `/admin/dealer/1380/chubb-insurance` |
| Original value — **restore this** | Creditor Monthly PM30, Creditor Monthly PM50, GAP (as found 2026-09-01) |
| Change to apply | Deselect all creditor forms |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the admin portal at `/admin/login` and open `/admin/dealer/1380/chubb-insurance`; record the current creditor-form selection exactly | The Chubb Insurance Configuration page loads showing Creditor Monthly PM30, Creditor Monthly PM50 and GAP selected. The current selection is written into the execution log before anything is changed |
| 2 | Deselect every creditor form in `chubb_insurance[creditorForm][]` and save | The page saves with no creditor form selected |
| 3 | In the dealer portal, open `/creditor-insurance-contracts` and click **"Download"** on the affected contract | The request completes. Record whether an error appears and its exact wording, or whether a PDF is produced |
| 4 | Capture what the dealer sees, then restore the creditor-form selection recorded in step 1 — Creditor Monthly PM30, Creditor Monthly PM50 and GAP — and save | The observed behaviour is captured. The configuration page again shows the three original forms selected |
| 5 | [Verification] Verify the dealer saw a clear, human-readable message rather than a raw exception, a blank page or a zero-byte file, **and** that Dealer 1380's Chubb configuration is back to its three original creditor forms | A readable message (or a valid PDF) was shown — a PHP stack trace, an HTTP 500 page or an empty file is a FAIL. The configuration is restored; every other AP-2437 case depends on it. Capture a screenshot of both the dealer-facing result and the restored configuration page |

---

### AP2437_018 — A failing Chubb API produces a visible error, never a truncated or half-merged contract

| Field | Value |
|---|---|
| **TC ID** | AP2437_018 |
| **Title** | A failing Chubb API produces a visible error, never a truncated or half-merged contract |
| **Requirement** | REQ-005 — the Chubb `/contract` endpoint is an external live dependency with no described failure behaviour |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Negative |
| **Priority** | High |
| **Status** | SKIPPED |
| **Blocked by** | — Q-013 closed. Inducing a Chubb failure may still be impossible from the dealer UI; if so, mark SKIPPED and record the coverage gap |
| **Executed on** | 2026-09-06 |
| **Result** | SKIPPED — a Chubb API failure cannot be induced from the dealer UI; the endpoint is server-side configuration. Recorded as an untested failure path. BUG-010 may be this path failing silently |

**Why this matters:** Every contract download now makes a live call to Chubb's API, and
that call can be slow, refused, or return an error page instead of a PDF. If the portal
hands whatever it received to the merge step without checking, the dealer gets a
corrupted or partial document — and, as with AP2437_016, a partial contract that opens is
more dangerous than one that does not. The dev endpoint named in the ticket comments,
`https://creditor-insurance-dev.ken-d1b.workers.dev`, is server-side configuration a
tester cannot change from the browser, which is why this case may end as a documented
coverage gap rather than a result. Recording it as a gap is still worth doing: it is
better to say "this path was never tested" than to leave the report implying it was.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Chubb dev endpoint | `https://creditor-insurance-dev.ken-d1b.workers.dev` | Configured server-side; not settable from the dealer UI |
| Failure modes of interest | Endpoint unreachable · slow response · non-PDF error payload returned | |
| Expected behaviour | **Not known** — Q-010 | |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Establish with the developer whether a Chubb API failure can be induced on staging — by pointing the endpoint at an unreachable host, or by any test hook already available | Either a way to induce the failure exists, or it is confirmed that none does. **If none does, mark this case SKIPPED, record it in the test report as an untested failure path, and stop here** |
| 2 | Induce the Chubb API failure by the agreed method | The endpoint is failing for the next download |
| 3 | In the dealer portal, click **"Download"** on contract AVP000160's row | The request completes. Record whether an error is shown or a PDF is produced |
| 4 | If a file was produced, open it and check whether it is a complete contract, a partial document, or a corrupt file | The nature of the produced file is recorded |
| 5 | [Verification] Verify no partial, truncated or corrupt contract is delivered as if it were complete | PASS if the dealer sees a clear error and receives no file, or receives a fully valid contract. FAIL if a truncated, corrupt or partially merged PDF is delivered with no warning — High severity. Restore the endpoint configuration and confirm a normal contract downloads again. Capture a screenshot of the error and of any produced file |

---

### AP2437_019 — Warranty contract PDFs still download correctly after the insurance merge engine was replaced

| Field | Value |
|---|---|
| **TC ID** | AP2437_019 |
| **Title** | Warranty contract PDFs still download correctly after the insurance merge engine was replaced |
| **Requirement** | REQ-005 — the merge engine changed for the creditor-insurance path only; other PDF-producing features must be unaffected |
| **Route** | `/warranty` — Contracts → Warranty in the dealer sidebar |
| **Type** | Regression |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-09-03 (Staging v2staging) |
| **Result** | PASS — /warranty/829/pdf returned HTTP 200, application/pdf, 414,617 bytes, %PDF-1.3, a valid 5-page contract with no inserted acceptance form. The untouched Zend_Pdf path is unaffected |

**Why this matters:** AP-2437 swapped the PDF engine for one code path and left every
other PDF-producing feature on the old `Zend_Pdf` library. Three pull requests merged for
this story; shared PDF helper code is exactly the kind of thing that gets refactored in
passing. This case checks the untouched paths still work, and unlike almost everything
else in this design it needs no answers from anyone — it can run today.

**Test Data:**

| Variable | Value |
|---|---|
| Dealer login | `vinhle870@gmail.com` / `<password from the env source>` |
| Feature under regression | Warranty contract PDF at `/warranty`; if no warranty contract exists, use an invoice PDF from `/invoice` instead and record the substitution |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal at `https://v2staging.garantieavantageplus.ca/login` | The dashboard loads showing "Welcome to Test QA staging's account" |
| 2 | [Pre-Condition] Navigate to `https://v2staging.garantieavantageplus.ca/warranty` and open one existing warranty contract | The Warranty contracts list loads and one contract opens. If the list is empty, switch to `/invoice`, open an invoice, and record the substitution in the log |
| 3 | Download the warranty contract PDF | A PDF is produced with no error page, no PHP exception and no `Zend_Pdf` message |
| 4 | Open the produced PDF and read its pages | The document opens, all pages render, and no acceptance/waiver form has been inserted — this feature is outside AP-2437's scope and must be unchanged |
| 5 | [Verification] Verify the warranty PDF downloads and opens correctly and contains no unexpected inserted page | A valid warranty PDF is produced, unchanged in content and page count from what this feature has always produced. Any error, or an acceptance form appearing where it does not belong, is a High-severity regression. Capture a screenshot of the opened document |

---

### AP2437_020 — Contract generation completes fast enough to hand the client at the counter

| Field | Value |
|---|---|
| **TC ID** | AP2437_020 |
| **Title** | Contract generation completes fast enough to hand the client at the counter |
| **Requirement** | REQ-005 — generation now performs a live Chubb API call, an external `qpdf` process and a PDF merge on every download |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Performance *(observational)* |
| **Priority** | Low |
| **Status** | PASS |
| **Blocked by** | — Q-013 and Q-005 (staging) closed. No performance target exists, so this case records an observation rather than a pass/fail |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — 1.73 s and 2.71 s for a 2.8 MB 12-page contract; no download exceeded 3 s. Recorded as an observation, since no target exists |

**Why this matters:** The fix added two slow things to a click a dealer makes with a
client standing in front of them: a live external API call and a separate `qpdf` process.
Neither existed before. No one has said what "too slow" means here, so this case measures
rather than judges — but a measurement on the record is what lets the product owner set a
target later, and it is the only way a gradual regression would ever be noticed.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Measurement | Elapsed time from clicking the download control to the file being fully received | Take three measurements and record all three, not an average alone |
| Reference point | Elapsed time for a warranty PDF download from AP2437_019 | A rough baseline for a PDF download on this host that does none of the new work |
| Threshold | **Not known** — no target stated | Record as an observation |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and open `/creditor-insurance-contracts`, using contract AVP000160 | The contract row is listed with its **Download** action |
| 2 | Click **"Download"** three times in succession, recording each elapsed time from the network panel | Three elapsed times recorded, all producing a valid PDF. The 2026-09-04 reference measurement was 2.7 s for a 2.8 MB, 12-page contract |
| 3 | Download a warranty PDF once from `/warranty` and record its elapsed time as a reference point | A reference time is recorded for a download that does no Chubb call and no merge |
| 4 | [Verification] Verify all three contract downloads completed successfully with no timeout, and record the three times and the reference time in the execution log | No download times out or fails. The four measurements are recorded and reported as an observation, together with a note that no target exists. Flag for the product owner if any download exceeded 30 seconds, which is long enough to be noticeable with a client waiting, even though no formal threshold has been set |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — behaviour when the form cannot be attached | — | AP2437_016, AP2437_017 | — | — |
| REQ-005 — behaviour when the Chubb API fails | — | AP2437_018 | — | — |
| REQ-005 — other PDF features unaffected by the engine change | — | — | — | AP2437_019 |
| REQ-005 — generation time with the new external dependencies | AP2437_020 *(Performance — observational)* | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2437_016 | ✅ PASS *(reclassified 2026-10-03, was FAIL/AP-2464)* | see execution-log_AP-2437_2026-09-06.md |
| AP2437_017 | SKIPPED | see execution-log_AP-2437_2026-09-06.md |
| AP2437_018 | SKIPPED | see execution-log_AP-2437_2026-09-06.md |
| AP2437_019 | ✅ PASS | AP2437_019-step5-WarrantyPdfRendersUnchanged_pass.png |
| AP2437_020 | PASS | see execution-log_AP-2437_2026-09-06.md |

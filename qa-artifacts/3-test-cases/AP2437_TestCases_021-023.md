# Test Cases — AP2437 (File 5 of 5)

**Project:** Avantage Plus (AP) — Dealer Portal, Chubb creditor-insurance contract printing
**Requirement:** AP-2437 — Attach the acceptance/waiver form to the Chubb insurance contract PDF
**Source:** `qa-artifacts/3-test-cases/AP2437_ReviewFindings_2026-09-03.md` — Pass 2 cases 1, 2 and 3, promoted 2026-09-03 · `qa-artifacts/1-requirements-analysis/AP-2437_requirements-analysis.md` · `qa-artifacts/2-test-plan/AP-2437_test-plan.md`
**Date:** 2026-09-03
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2437_021 to AP2437_023 (3 test cases)
**Coverage:** Cross-entity · State transition · Security — REQ-001 (AC-10), REQ-002, and an authorisation gap the original design had no coverage for

> **Why this file exists.** The peer review found that every one of the first twenty cases looks at **one contract,
> once, as one user**. Three defects hide in exactly that blind spot, and none of them
> would be caught by any existing case:
>
> - the same generated PDF being served for more than one contract, so a client signs a
>   document carrying someone else's data;
> - the merge appending to a stored file rather than rebuilding, so the second download of
>   a contract carries the acceptance form twice;
> - the download endpoint authorising by contract ID alone, so one dealership can fetch
>   another dealership's contracts — a PDF now full of client names, premiums and coverage.
>
> These three cases close those gaps. AP2437_021 also supplies the only coverage anywhere
> in the suite for **AC-10**, the criterion that the contract is fetched live from Chubb
> per contract — which the review found had no test at all.

---

## Execution Context

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer. AP2437_023 additionally uses a private/incognito window and, if available, a second dealership's login | `navigation` |
| **Entry route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf`. **Note the route is keyed on the quote id**, which is what AP2437_023 probes | `navigation`, `contract-setup` |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | Staging — `https://v2staging.garantieavantageplus.ca` | `env` |
| **Login** | `/login` — `vinhle870@gmail.com` / `<password from the env source>` · Dealer ID `1380`, province QC | `env` |
| **Second dealership login** | **Not known.** `env` records that no usable password exists for any second dealership — the same gap that blocked `AP2436_004`. AP2437_023 works around it with an unauthenticated check, which is weaker; see the case | `env` |
| **Test data** | **Two distinct contracts on different quotes, for different clients** — required by AP2437_021. One exists: **AVP000160** (quote 6276, Marie Tremblay). A second must be created via `contract-setup` on another quote with a different client | `test-data`, `contract-setup` |
| **Language** | Not material to this batch | `navigation` |
| **Contract setup** | Contracts are **dynamic test data** — each case that needs one creates it in its own `[Pre-Condition]` step, with the field values written there. Background, rationale and the full register live in `base-test/06-chubb-contract-setup.md`; that file is reference material for the designer, not a step the executor follows | `contract-setup` |
| **Contracts already created** | `AVP000160` — quote 6276, Marie Tremblay, **Français / PM50** (branch 1). Reuse it rather than creating another; every stage A–C run leaves a permanent contract that nothing removes. Branches 2–4 have none yet | `contract-setup` |
| **Leaves behind** | AP2437_021 requires creating a **second contract**, which is permanent — record it in `contract-setup` §4. AP2437_022 and AP2437_023 only read | `cleanup` (missing), `contract-setup` |

**Known blockers:**

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | A **second** contract, on a different quote for a different client. Only AVP000160 (quote 6276) exists; a second must be created through `contract-setup` before this case can mean anything | AP2437_021 | Open — creatable by QA, no external answer needed |
| 2 | A working login for a second dealership. Recorded as an outstanding environment gap since the AP-2436 cycle. Without it AP2437_023 can test the unauthenticated and id-guessing cases but not the cross-dealership case, which is the strongest of the three | AP2437_023 | Open — carried over from `env` |

> **The download route is now known, which sharpens AP2437_023 considerably.** It is
> `/quote/{quoteId}/chubb/insurance/contract-pdf` — keyed on the **quote id**, a small
> sequential integer (6276, 6277, ...) that is trivially guessable. Neighbouring quote ids
> are known to exist and to belong to other clients, so the id-guessing half of that case
> is directly runnable today and no longer hypothetical.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2437_021 | Two different contracts downloaded in the same session each carry their own client's data and their own acceptance form | Functional | High | PASS |
| AP2437_022 | Downloading the same contract a second time produces one acceptance form, not two | Functional | High | PASS |
| AP2437_023 | A contract PDF cannot be fetched by someone who is not entitled to that dealership's contracts | Negative | High | PASS |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2437_021 — Two different contracts downloaded in the same session each carry their own client's data and their own acceptance form

| Field | Value |
|---|---|
| **TC ID** | AP2437_021 |
| **Title** | Two different contracts downloaded in the same session each carry their own client's data and their own acceptance form |
| **Requirement** | REQ-001 / AC-10 — the merge happens in code at download time, per contract, against the PDF fetched live from Chubb for that contract, each carrying unique client data |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional (Cross-entity) |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — Q-013 and Q-005 (staging) closed. A **second contract must be created first** via `contract-setup`; only AVP000160 exists |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — three contracts for three different clients produced three distinct PDFs, each with its own branch form. No caching or crossover. Client-data comparison was impossible because the documents carry no client name |

**Why this matters:** AC-10 says every contract is fetched live from Chubb with its own
client's data, and until now nothing tested it — every case in the suite opens one
contract and stops. If the portal caches the generated file, keys it wrongly, or reuses a
temporary path, the second dealer to click download receives the first dealer's contract:
the wrong client's name, premium and coverage on a document a real person then signs.
That is simultaneously an invalid contract and a disclosure of one client's personal and
financial data to another, and a single-contract test could never see it. Promoted from
the peer review as its highest-priority finding.

**Test Data:**

| Variable | Value |
|---|---|
| Contract A | An existing Chubb creditor-insurance contract for Dealer 1380 — record its ID, client name, premium and coverage dates |
| Contract B | A **different** contract for a **different client** — record the same four values |
| Distinguishing field | The client name is the clearest, but record all four so a partial crossover is also visible |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Ensure two contracts exist for **different clients**: AVP000160 (quote 6276, Marie Tremblay), plus a second on another quote with a different client — at `/quote/{id}/financing` set Date of birth `1985-06-15`, Type "Financing", Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term `60`, Interest rate `6.99`, Financing company "AutoCapital Canada" → **Save**; at `/quote/{id}/insurance` set **Language "Français"**, Tax exempt "No", **Form "Monthly Premium PM50"**, Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**; then **Generate Contract** → **Create Contract** on the confirmation page. Record each contract number, quote id, client name and premium | Two distinct contracts on two quotes for two clients. **Never substitute the same contract twice — that would test nothing** |
| 2 | Click **"Download"** on contract A's row and view the PDF | A PDF showing contract A's client name and premium on the Chubb pages, with an acceptance form on page 1 |
| 3 | Without logging out, click **"Download"** on contract B's row and view the PDF | A second, different PDF is produced |
| 4 | Compare the two documents field by field against the values recorded in step 1 | Contract A's PDF carries only client A's data; contract B's PDF carries only client B's data. Neither file contains any value belonging to the other client |
| 5 | [Verification] Verify the two PDFs are genuinely different documents — different client data, and each with its own acceptance form on page 1 | Two distinct correct contracts. **Any crossover of client data between them is a Critical finding: stop testing, escalate immediately, and treat it as a data-disclosure incident rather than a routine defect** (test plan §6 suspension criteria). Identical files for two different contracts is a High-severity caching defect. Capture a screenshot of the client-data area of each PDF |

---

### AP2437_022 — Downloading the same contract a second time produces one acceptance form, not two

| Field | Value |
|---|---|
| **TC ID** | AP2437_022 |
| **Title** | Downloading the same contract a second time produces one acceptance form, not two |
| **Requirement** | REQ-002 — the form is placed on the first page and the page count equals the Chubb original plus the form; REQ-001 / AC-10 — the merge rebuilds from the Chubb original each time |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Functional (State transition) |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — (unblocked 2026-09-04; runnable against AVP000160 as-is) |
| **Executed on** | 2026-09-06 |
| **Result** | PASS — three downloads, identical byte length and page count, exactly one form each. The merge rebuilds from the Chubb original rather than appending. SHA differs only by generation timestamp |

**Why this matters:** If the merge appends the form to a *stored* contract rather than
rebuilding from the Chubb original, the first download looks perfect and every one after
it adds another copy of the disclosure page. AP2437_002's page-count assertion would pass
cleanly on the first download and never be run again. Dealers re-download contracts
routinely — a reprint after a correction, a second copy for the file — so this is a
normal action, not an exotic one, and the visible result is a client presented with a
contract carrying two or three identical disclosure pages. The case costs one extra click
during a run that is already happening.

**Test Data:**

| Variable | Value |
|---|---|
| Contract | The same contract used in AP2437_001 — record its ID |
| Expected page count | The count recorded in AP2437_002: Chubb pages + acceptance-form pages |
| Downloads to perform | Three, in the same session |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal, open `/creditor-insurance-contracts` and use contract AVP000160; note the expected page count from AP2437_002 (the 2026-09-04 baseline download was **12 pages**) | The contract row is listed and the expected page count is known |
| 2 | Click **"Download"**, view the PDF, and record its page count and how many acceptance-form pages it contains | 12 pages, with exactly one acceptance form, on page 1 |
| 3 | Click **"Download"** on the same contract a second and a third time, viewing each | Both downloads succeed and produce a PDF |
| 4 | Record the page count and the number of acceptance-form pages in the second and third downloads | Both match the first exactly |
| 5 | [Verification] Verify all three downloads have the identical page count and contain exactly one acceptance form each, with page 1 the form and the Chubb pages following in order | All three are identical in structure. **A growing page count, or a second acceptance form appearing on the second or third download, is a High-severity FAIL** — it means the merge appends to a stored file rather than rebuilding from the Chubb original, and the defect compounds with every reprint. Capture a screenshot of the page count of each of the three downloads |

---

### AP2437_023 — A contract PDF cannot be fetched by someone who is not entitled to that dealership's contracts

| Field | Value |
|---|---|
| **TC ID** | AP2437_023 |
| **Title** | A contract PDF cannot be fetched by someone who is not entitled to that dealership's contracts |
| **Requirement** | Not stated in AP-2437. Raised by the peer review as the suite's only authorisation coverage over a document containing client personal and financial data |
| **Route** | `/creditor-insurance-contracts` → **Download** → `/quote/{quoteId}/chubb/insurance/contract-pdf` |
| **Type** | Negative (Security) |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — the URL is now known and the id-guessing half is directly runnable. The cross-dealership half stays SKIPPED until a second-dealership login exists |
| **Executed on** | 2026-09-06 |
| **Result** | PASS in part — an unauthenticated request was redirected to /login with no PDF, and five neighbouring quote ids returned HTTP 404. The cross-dealership check is still SKIPPED: no second-dealership login exists |

**Why this matters:** The contract PDF now carries a client's full name, premium, coverage
and the dealership's commission. Nothing in AP-2437's requirements says who is allowed to
fetch it, and nothing in the twenty original test cases checks. If the download endpoint
authorises by contract ID alone — a very common shortcut on a download route that "only
the dealer would ever call" — then anyone who guesses or increments an ID reads other
dealerships' clients. That is a personal-data breach with regulatory consequences of its
own, entirely separate from the disclosure obligation this story exists to satisfy. Being
unspecified is precisely why it is worth testing: nobody decided it should be safe.

**Test Data:**

| Variable | Value | Notes |
|---|---|---|
| Own contract URL | The download URL for a Dealer 1380 contract, captured from the browser network panel during AP2437_001 | The exact shape is **Not known** until Q-013 is resolved |
| Neighbouring IDs | The same URL with the contract ID incremented and decremented | Tests whether IDs can be enumerated |
| Second dealership login | **Not available** — no usable password exists for any second dealership on staging | The cross-dealership half of this case is therefore SKIPPED unless one is supplied |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Log in to the dealer portal and note the download URL: `/quote/6276/chubb/insurance/contract-pdf`. It is keyed on the **quote id**, a small sequential integer — neighbouring ids such as 6277 and 6275 are known to exist and belong to other clients | The URL and its shape are recorded |
| 2 | Open a private/incognito window with no session and paste the captured URL | The request is refused — a redirect to the login page, or an HTTP 401 or 403. **A PDF returned to an unauthenticated request is a Critical finding: stop, escalate, and do not continue testing** |
| 3 | Still signed in, request `/quote/6277/chubb/insurance/contract-pdf` and `/quote/6275/chubb/insurance/contract-pdf` — real quotes belonging to other clients | Either not-found or access refused. **A PDF containing another client's data must not be returned**, whether or not that client belongs to this dealership |
| 4 | If a second dealership login has since been supplied, sign in as it in a separate browser profile and request `/quote/6276/chubb/insurance/contract-pdf` | Access is refused. If no second login is available, record this step SKIPPED — do not mark the case PASS on the unauthenticated and id-guessing checks alone |
| 5 | [Verification] Verify no route tested returned a contract PDF to a requester not entitled to it, and record which of the three checks were actually performed | Every unauthorised request was refused. Any PDF returned to an unauthenticated session or to another dealership is a **Critical** security finding, reported immediately rather than batched into the normal bug report. Record explicitly in the log which checks ran and which were skipped, so the report does not overstate the coverage. Capture a screenshot of each refusal |

---

## Coverage Matrix

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 / AC-10 — fetched live from Chubb per contract, unique client data | AP2437_021 | — | — | — |
| REQ-002 / REQ-001 — the merge rebuilds rather than appends, so re-downloads stay correct | AP2437_022 | — | — | — |
| *(Unstated in AP-2437)* — authorisation on the contract download endpoint | — | AP2437_023 | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2437_021 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_022 | PASS | see execution-log_AP-2437_2026-09-06.md |
| AP2437_023 | PASS | see execution-log_AP-2437_2026-09-06.md |

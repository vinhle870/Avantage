# Test Cases — AP2496 (File 1 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2496 — Download all finalized documents from a quote in one click
**Source:** requirements/AP-2496-download-all-finalized-documents-from-quote.md · qa-artifacts/1-requirements-analysis/AP-2496_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2496_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2496_001 to AP2496_005 (5 test cases)
**Coverage:** Functional · Negative · Edge-case · Regression
**Revisions:** 2026-11-01 — Rework after R2 (independent review, REWORK): AP2496_002 step 2 now states the outcome for both branches (contract created or not) and step 4 records the quote state for Q-001 (F-2, F-5); AP2496_003 explains why it records rather than judges (F-5); AP2496_004 step 3 now measures the individual contracts' page counts (F-3). 2026-11-02 — Executed on Dev (v2dev) by stlc-manual-executor (s4); Status and Result filled in. Steps unchanged. No clear-text credential found in this file, so nothing was scrubbed.

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` (never a bare `/quote/new/client`, which returns HTTP 500 on the quote it creates); then `/quote/{id}/details` — the quote page | `navigation` → `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer portal URL from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380, "Test QA staging") named in the `env` source; the password is read from there at run time and never written into the log | `env` |
| **Test data** | Vehicle 915 (`1FAHP35NX8W239204`, Ford Focus 2008). Every quote and contract is created by the case itself | `test-data` |
| **Language** | EN for every judgement. `?_locale=fr` on any dealer URL switches the session to French; switch back with `?_locale=en` before the case ends | `domain` (quote-creation.md) |
| **Leaves behind** | One new quote per case (AP2496_001–005). Roadside contracts on the quotes of 001, 004 and 005; Chubb creditor-insurance contracts (a live call to the insurer) on 004 and 005; a removed Esthetic protection product (and, if Save generates one, its Esthetic protection contract) on 002; nothing on 003. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared client values** — used in every case's client form, changing only the last name:
First name `Docs`, Last name as given in the case, Email `client.stage.NNN@yopmail.com`
(next unused number, recorded), Address `100 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`,
"I agree to the policy" ticked. Vehicle step: Delivered at `2026-11-01`, Price `20000`.

**Shared roadside values** — Road Side Protection form on `/quote/{id}/road-side-protection`:
first tier radio, Sale price `20000`, VIN `1FAHP35NX8W239204`, Stock number = the case's
last name, Vehicle condition = first option, Odometer reading `5000`, then
**Save and Generate Contract**.

**Shared Chubb values** — Add a financing: Date of birth `1985-06-15`, Type "Financing",
Net amount financed `25000`, Residual `0`, Payment frequency "Monthly", Term months `60`,
Interest rate `6.99`, Financing company "AutoCapital Canada 200-11, Church Street Toronto"
→ **Save**. Add creditors insurance: Language "English", Form "Monthly Premium PM50",
Tax exempt "No", Life "Decreasing", Life Term `60`, Life For "Borrower" → **Get Quote**
(allow 10 s). Then **Generate Contract** → **Create Contract** (allow 10 s).

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | Whether the quote page offers an action that removes an optional product before a contract is generated (AP-2493's cancel action, if deployed) | AP2496_002 | Not blocking at design — Q-010 (Info). Read at run time; if no remove action exists, record BLOCKED "no remove action on the quote page" |
| 2 | The URL of the "Download all documents" action and whether the PDF is served inline or as an attachment | AP2496_004, AP2496_005 | Not blocking — read from the action's `href` and the response headers at run time; recorded for Q-003 |
| 3 | Whether saving a Permaplate product on `/quote/{id}/permaplate` generates an Esthetic protection contract — no bound source says either way (`domain` only maps the form's Save button and the per-quote `permaplate-contract-download` link) | AP2496_002 | Not blocking — step 2 records which branch occurs and steps 3–4 state the outcome for both (see the case) |

> No case shipped BLOCKED. Executed 2026-11-02 on Dev — see the Summary Table.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2496_001 | A quote with one generated roadside contract shows exactly one "Download all documents" action | Functional | High | BLOCKED |
| AP2496_002 | A quote whose only optional product was removed before its contract was generated shows no download action | Negative | High | PASS |
| AP2496_003 | A new quote with no product at all — the page loads without error and the download action state is recorded | Edge-case | Medium | PASS |
| AP2496_004 | "Download all documents" on a quote with two contracts returns one PDF named with the quote id | Functional | High | BLOCKED |
| AP2496_005 | The merged PDF holds every page of each individual contract, and each individual download still works | Regression | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2496_001 — A quote with one generated roadside contract shows exactly one "Download all documents" action

| Field | Value |
|---|---|
| **TC ID** | AP2496_001 |
| **Title** | A quote with one generated roadside contract shows exactly one "Download all documents" action |
| **Requirement** | AP2496 — REQ-001, AC "Action shown for a quote with documents to download" |
| **Route** | `/quote/{id}/details` — quote page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | 🚫 BLOCKED — AP-2518: roadside Generate Contract HTTP 500 on quote 6484 (2/2) |

**Why this matters:** This is the entry point of the feature. One generated contract is the
smallest case the criterion covers ("at least one generated contract"). The case also
records the action's position and its French label (Q-005) and any "finalized" state the
quote shows (Q-001), without judging them.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-001` |
| Roadside stock number | `Download2496-001` |
| Action label | `Download all documents` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-001`) → **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Docs Download2496-001`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` open the Road Side Protection control, fill the shared roadside values (stock number `Download2496-001`) and click **Save and Generate Contract** | The page returns to `/quote/{id}/details` without an error, and the Road Side Protection row shows a contract number and its own download link (both recorded) |
| 3 | Reload `/quote/{id}/details`. Record where the action sits (section or header). Open `/quote/{id}/details?_locale=fr`, record the action's French label, then open `/quote/{id}/details?_locale=en` | Each load returns the quote page without an error page or HTTP 5xx. Record the position and the French label for Q-005, and any quote status shown (for example "finalized") for Q-001 |
| 4 | [Verification] On the English quote page, count the controls whose visible text is "Download all documents" | Exactly one control labelled "Download all documents" is shown on the quote page — not one per product |

---

### AP2496_002 — A quote whose only optional product was removed before its contract was generated shows no download action

| Field | Value |
|---|---|
| **TC ID** | AP2496_002 |
| **Title** | A quote whose only optional product was removed before its contract was generated shows no download action |
| **Requirement** | AP2496 — REQ-002, AC "Action hidden when there is nothing to download" (the AC's own example: "a quote whose products were removed before finalization") |
| **Route** | `/quote/{id}/details` — quote page |
| **Type** | Negative |
| **Priority** | High |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | ✅ PASS — quote 6485: branch (a), no contract after Save; after Delete no "Download all documents" action |

**Why this matters:** An action that returns an empty file is worse than no action. This
case uses the exact example the criterion gives. The remove action used is recorded for
Q-010.

**Why this case judges while AP2496_003 only records:** the criterion names this quote
shape word for word as one that must not show the action ("a quote whose products were
removed before finalization"), so hiding the action here is a stated requirement, not a
guess about Q-001. A quote that never had a product (AP2496_003) is not named by any
criterion, so its outcome depends on Q-001 and is only recorded.

**Whether Save creates a contract is not known** (Known blocker 3). The case does not
depend on it: step 2 records which branch happens, and step 4 judges "action hidden"
against the state the quote is actually in after step 3 — a quote that shows no active
contract and no contract download link has nothing to download, whichever branch led
there.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-002` |
| Optional product | Esthetic protection (Permaplate) — first product radio, first enabled option |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-002`) → **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Docs Download2496-002`; the quote id is recorded |
| 2 | [Pre-Condition] On `/quote/{id}/details` open the Permaplate / Esthetic protection control, select the first product radio and the first enabled option → **Save** | The page returns to `/quote/{id}/details` and an Esthetic protection row shows the product. Record which branch occurred — **(a)** no contract number and no contract download link on the row, or **(b)** a contract number and/or a `permaplate-contract-download` link (record both). Either branch continues to step 3. If the page offers no product, record BLOCKED "dealer 1380 has no Permaplate product linked" |
| 3 | On the Esthetic protection row, click its cancel / remove action and confirm in the confirmation dialog if one appears | The Esthetic protection row no longer shows an active product. Record the action's label for Q-010. If the row offers no remove action, record BLOCKED "no remove action on the quote page" |
| 4 | [Verification] Reload `/quote/{id}/details`. First note whether any row still shows an active contract number or a contract download link; then look for any control labelled "Download all documents". Record any quote state the page shows (for example a status badge or "finalized"), for Q-001 | The page loads without an error. **If no row shows an active contract or contract download link** (expected after branch (a), and after branch (b) when the removal also removed the contract): no "Download all documents" action is shown — judged PASS / FAIL. **If a contract or its download link is still shown** (branch (b) only): the quote still has a document to download, so the criterion cannot be judged here — record BLOCKED "saving a Permaplate product generated a contract that removing the product did not clear" with the contract number, and record whether the action is shown |

---

### AP2496_003 — A new quote with no product at all — the page loads without error and the download action state is recorded

| Field | Value |
|---|---|
| **TC ID** | AP2496_003 |
| **Title** | A new quote with no product at all — the page loads without error and the download action state is recorded |
| **Requirement** | AP2496 — REQ-002 (edge); record-only for Q-001 |
| **Route** | `/quote/{id}/details` — quote page |
| **Type** | Edge-case |
| **Priority** | Medium |
| **Status** | PASS |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | ✅ PASS — quote 6486: no fault; Q-001 outcome: action hidden on a product-less quote |

**Why this matters:** The criteria speak of a "finalized quote". Whether a quote with no
product at all counts as finalized is open (Q-001), so this case does not judge whether
the action should be shown. It fails only on an objective fault. AP2496_002 differs because
the criterion names its quote shape word for word ("a quote whose products were removed
before finalization"); a quote that never had a product is not named by any criterion, so
here the outcome is recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-003` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-003`) → **Save**; then at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save** | `/quote/{id}/details` loads with heading `#{id} - Docs Download2496-003`; the quote id is recorded |
| 2 | Look at every section of the quote page (Client, Vehicle, Warranty, Financing, Sale and the product rows) and note whether a "Download all documents" control is present | The page shows no product contract number |
| 3 | If a "Download all documents" control is present, click it and record the HTTP status, the content type and the file's page count | No error page and no HTTP 5xx. Record the outcome for Q-001 |
| 4 | [Verification] Check the page and any download for objective faults | No error page or HTTP 5xx, and no file that contains another quote's documents (a page naming a client other than `Docs Download2496-003`). Record the outcome for Q-001: action shown or hidden on a quote with no product |

---

### AP2496_004 — "Download all documents" on a quote with two contracts returns one PDF named with the quote id

| Field | Value |
|---|---|
| **TC ID** | AP2496_004 |
| **Title** | "Download all documents" on a quote with two contracts returns one PDF named with the quote id |
| **Requirement** | AP2496 — REQ-003, AC "One concatenated PDF is returned" |
| **Route** | `/quote/{id}/details` — quote page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | 🚫 BLOCKED — AP-2518: roadside contract cannot be generated on Dev |

**Why this matters:** This is the purpose of the ticket. "Several contracts" is met with a
roadside contract and a Chubb creditor-insurance contract, the two contract types whose
creation is mapped. The full file name and whether the PDF opens in the browser (inline)
or is saved (attachment) are recorded for Q-003.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-004` |
| Roadside stock number | `Download2496-004` |
| Expected content type | `application/pdf` |
| Page count method | The PDF viewer's page count, or the count of `/Type /Page` objects in the fetched bytes — use the same method for every file |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-004`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then open Road Side Protection, fill the shared roadside values (stock number `Download2496-004`) → **Save and Generate Contract** | `/quote/{id}/details` shows heading `#{id} - Docs Download2496-004` and a roadside contract number (quote id and contract number recorded) |
| 2 | [Pre-Condition] On `/quote/{id}/details` click **Add a financing** and save the shared financing values; click **Add creditors insurance**, set the shared Chubb values → **Get Quote**; click **Generate Contract** → **Create Contract** | Flashes "Financing saved", "Chubb insurance quote saved successfully" and "Chubb insurance contract created successfully" appear in turn; the Creditors insurance row shows a contract number (recorded). If Chubb returns an error banner, record it and mark BLOCKED (environment) |
| 3 | Open the roadside contract's own download link, then the creditor-insurance contract's own download link (`/quote/{id}/chubb/insurance/contract-pdf`), and record each file's page count (method in Test Data). Then click "Download all documents" and capture the response in the browser's network log | Each individual link returns a PDF; both page counts are recorded. For the action, record the URL, HTTP status, `Content-Type` and `Content-Disposition` of the request whose response is the PDF or an error (a redirect or preflight is not counted) |
| 4 | [Verification] Check the response and the file, and count its pages with the same method | HTTP 200; `Content-Type` is `application/pdf`; the file name (from `Content-Disposition`, or the saved file's name) contains the quote id; the body is a single PDF that opens (starts with `%PDF`) and its page count is greater than each of the two page counts recorded in step 3. Record the full file name and inline / attachment for Q-003 |

---

### AP2496_005 — The merged PDF holds every page of each individual contract, and each individual download still works

| Field | Value |
|---|---|
| **TC ID** | AP2496_005 |
| **Title** | The merged PDF holds every page of each individual contract, and each individual download still works |
| **Requirement** | AP2496 — REQ-003, description "download every finalized contract/document that belongs to a quote with a single action, instead of opening each product's individual download link" |
| **Route** | `/quote/{id}/details` — quote page |
| **Type** | Regression |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | 🚫 BLOCKED — AP-2518: roadside contract cannot be generated on Dev |

**Why this matters:** The description makes each product's own download link the
reference: the single action replaces opening those links one by one. So the merged file
must contain every page those links return, and the links themselves must keep working.
Which other documents are added (Q-002) and the order (Q-004) are recorded, not judged.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-005` |
| Roadside stock number | `Download2496-005` |
| Page count method | The PDF viewer's page count, or the count of `/Type /Page` objects in the fetched bytes — use the same method for every file |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-005`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then open Road Side Protection, fill the shared roadside values (stock number `Download2496-005`) → **Save and Generate Contract** | `/quote/{id}/details` shows heading `#{id} - Docs Download2496-005` and a roadside contract number (recorded) |
| 2 | [Pre-Condition] On `/quote/{id}/details` click **Add a financing** and save the shared financing values; click **Add creditors insurance**, set the shared Chubb values → **Get Quote**; click **Generate Contract** → **Create Contract** | The Creditors insurance row shows a contract number (recorded). If Chubb returns an error banner, record it and mark BLOCKED (environment) |
| 3 | Open the roadside contract's own download link, then the creditor-insurance contract's own download link (`/quote/{id}/chubb/insurance/contract-pdf`). For each, record HTTP status, `Content-Type`, page count and the title text of page 1 | Each link returns HTTP 200 with `Content-Type` `application/pdf` and a PDF of at least one page |
| 4 | Click "Download all documents"; record the page count and the title text of the first page of each document in the merged file, in order | The merged file is returned as one PDF |
| 5 | [Verification] Compare the merged file with the two individual files | The merged file contains the roadside contract's pages and the creditor-insurance contract's pages (each first-page title found, and the merged page count is at least the sum of the two). Record any extra pages and what they are for Q-002, and the document order for Q-004 |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Action shown with a generated contract | AP2496_001 | — | — | — |
| REQ-002 — Action hidden with nothing to download | — | AP2496_002 | AP2496_003 | — |
| REQ-003 — One PDF named with the quote id | AP2496_004 | — | — | AP2496_005 |
| REQ-004 — Removed / cancelled items excluded | see AP2496_TestCases_006-009.md | | | |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2496_001 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_001-step2-RoadsideCreateContract500_fail.png` |
| AP2496_002 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_002-step4-NoDownloadAllAfterRemoval_pass.png` |
| AP2496_003 | PASS | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_003-step4-NoProductActionHidden_pass.png` |
| AP2496_004 | BLOCKED | — |
| AP2496_005 | BLOCKED | — |

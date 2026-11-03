# Test Cases — AP2496 (File 2 of 2)

**Project:** Avantage Plus v2 — Dealer portal
**Requirement:** AP2496 — Download all finalized documents from a quote in one click
**Source:** requirements/AP-2496-download-all-finalized-documents-from-quote.md · qa-artifacts/1-requirements-analysis/AP-2496_requirements-analysis.md · qa-artifacts/2-test-plan/AP-2496_test-plan.md
**Date:** 2026-11-01
**Designed by:** QA Agent — Test Case Designer Skill
**TC Range:** AP2496_006 to AP2496_009 (4 test cases)
**Coverage:** Functional · Negative · Security
**Revisions:** 2026-11-01 — AP2496_009 added by the Gate B promotion (rule B2: review finding Pass 2 #1, High). File renamed from `AP2496_TestCases_006-008.md`. 2026-11-01 — Rework after R2 (independent review, REWORK): AP2496_008 and AP2496_009 step 4 now judge only an HTTP 5xx (and, for 008, a file carrying quote A's documents); any 4xx, error page, redirect or empty response is recorded, not failed (F-1). AP2496_006 now checks the excluded-product words only outside the roadside contract's pages (F-4). 2026-11-01 — Rework after R2 round 2 (F-1): AP2496_006 step 2 records whether saving the Permaplate product created an Esthetic protection contract (branches (a)/(b), as AP2496_002) and whether any contract number or download link remains after the removal; step 4 judges the excluded-product words only when none remains, otherwise records a named BLOCKED. Known blocker 5 added. 2026-11-02 — Executed on Dev (v2dev) by stlc-manual-executor (s4); Status and Result filled in. Steps unchanged. No clear-text credential found in this file, so nothing was scrubbed.

---

## Execution Context

_Everything the executor needs that the steps themselves do not carry. Once this section is
complete the executor should not need a second file open to run this batch._

| Fact | Value | Source |
|---|---|---|
| **Portal** | Dealer (AP2496_007 may also need the Admin portal to cancel a warranty contract; AP2496_009 reads another dealership's quote id in the Admin portal) | `navigation` |
| **Entry route** | `/vehicle/915/details` → **Create quote** → `/quote/new/client?fromVehicleId=915` (never a bare `/quote/new/client`, which returns HTTP 500 on the quote it creates); then `/quote/{id}/details` — the quote page | `navigation` → `domain` (quote-creation.md) |
| **Viewport** | 1280 × 800 | `navigation` |
| **Environment** | v2staging — dealer and admin portal URLs from the `env` source | `env` |
| **Login** | The shared dealer account (dealer 1380, "Test QA staging") named in the `env` source; the same account signs in to the Admin portal. The password is read from the `env` source at run time and never written into the log | `env` |
| **Test data** | Vehicle 915 (`1FAHP35NX8W239204`, Ford Focus 2008). Every quote and contract is created by the case itself | `test-data` |
| **Language** | EN | `navigation` |
| **Leaves behind** | One new quote per case, each with a roadside contract; a removed Esthetic protection product (006); a warranty contract, possibly cancelled (007); a second quote with no product (008). AP2496_009 only reads another dealership's quote and changes nothing there. The `cleanup` source is missing — nothing is removed | `cleanup` (missing) |

**Shared client values** — used in every case's client form, changing only the last name:
First name `Docs`, Last name as given in the case, Email `client.stage.NNN@yopmail.com`
(next unused number, recorded), Address `100 Rue Test`, City `Montréal`, Province
`Québec`, Postal code `H2X 1Y4`, Home phone `5145550101`, Work phone `5145550102`,
"I agree to the policy" ticked. Vehicle step: Delivered at `2026-11-01`, Price `20000`.

**Shared roadside values** — Road Side Protection form on `/quote/{id}/road-side-protection`:
first tier radio, Sale price `20000`, VIN `1FAHP35NX8W239204`, Stock number = the case's
last name, Vehicle condition = first option, Odometer reading `5000`, then
**Save and Generate Contract**.

**Known blockers** — a fact these test cases need that nobody has supplied yet:

| # | Missing fact | Affects | Status |
|---|---|---|---|
| 1 | How a warranty contract is generated from the quote page — the warranty contract flow is not mapped in `domain` | AP2496_007 | Not blocking at design — read at run time from the Warranty section; if no contract can be generated, record BLOCKED "no warranty contract generation on the quote page" |
| 2 | How a warranty contract is marked cancelled (`WarrantyContract::isCancelled()` true) — no dealer or admin screen for it is mapped | AP2496_007 | Open — Q-006 (Judgement). Searched at run time on the dealer `/warranty` list and the warranty contract in the Admin portal; if no cancel action exists, record BLOCKED "Q-006 — no screen marks a warranty contract cancelled" |
| 3 | Whether the quote page offers an action that removes an optional product before a contract is generated | AP2496_006 | Not blocking at design — Q-010 (Info). If no remove action exists, record BLOCKED "no remove action on the quote page" |
| 4 | How to find the id of a quote that belongs to another dealership — no admin quote list is mapped | AP2496_009 | Not blocking at design — read at run time from the Admin portal's Esthetic protection contract list and contract page; if no quote id of another dealership can be found, record BLOCKED "no known quote id of another dealership" |
| 5 | Whether saving a Permaplate product on `/quote/{id}/permaplate` generates an Esthetic protection contract, and whether removing the product clears it — no bound source says either way (`domain` only maps the form's Save button and the per-quote `permaplate-contract-download` link); same unknown as Known blocker 3 of `AP2496_TestCases_001-005.md`; touches Q-001 / Q-010 | AP2496_006 | Not blocking at design — step 2 records which branch occurs and what remains after the removal; step 4 judges only when no Esthetic protection contract or download link remains, otherwise records BLOCKED "saving a Permaplate product generated a contract that removing the product did not clear" |

> No case shipped BLOCKED. Executed 2026-11-02 on Dev — see the Summary Table. Known blocker 5 is the same unknown that AP2496_002 handles in file 1; both cases record the branch and judge only the state that does not depend on Q-001 / Q-010.

---

## Summary Table

| TC ID | Title | Type | Priority | Status |
|---|---|---|:---:|:---:|
| AP2496_006 | A product removed before finalization adds no page to the merged PDF, and the roadside contract is still merged | Functional | High | BLOCKED |
| AP2496_007 | A cancelled warranty contract adds no page to the merged PDF, and the roadside contract is still merged | Functional | High | BLOCKED |
| AP2496_008 | Opening the download-all address directly for a quote with no contract causes no server error and returns no other quote's documents | Negative | Medium | FAIL |
| AP2496_009 | Requesting the download-all address with another dealership's quote id — the response is recorded and causes no server error | Security | High | BLOCKED |

> Status values: `Not Run` · `PASS` · `FAIL` · `BLOCKED` · `SKIPPED`

---

## Test Cases

---

### AP2496_006 — A product removed before finalization adds no page to the merged PDF, and the roadside contract is still merged

| Field | Value |
|---|---|
| **TC ID** | AP2496_006 |
| **Title** | A product removed before finalization adds no page to the merged PDF, and the roadside contract is still merged |
| **Requirement** | AP2496 — REQ-004, AC "Removed or cancelled items are never rendered" (removed optional product) |
| **Route** | `/quote/{id}/details` — quote page |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — (see Known blockers 3 and 5 — checked at run time) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | 🚫 BLOCKED — AP-2518: roadside contract cannot be generated on Dev |

**Why this matters:** A client must never receive a contract page for a product that was
taken off the quote. The roadside contract shows that the remaining documents are still
merged.

**Whether Save creates a contract is not known** (Known blocker 5). The analysis defines the
removed product as "a product that has no contract", and whether a product removed after its
contract was generated counts as "removed before finalization" is open (Q-001 / Q-010). So
step 2 records which branch happens and what the quote page still shows after the removal,
and step 4 judges the excluded-product words only when no Esthetic protection contract or
contract download link remains — the same rule as AP2496_002.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-006` |
| Roadside stock number | `Download2496-006` |
| Removed product | Esthetic protection (Permaplate) — first product radio, first enabled option |
| Words that must not appear in the merged file | `Permaplate`, `Esthetic protection`, `Protection esthétique` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-006`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then open Road Side Protection, fill the shared roadside values (stock number `Download2496-006`) → **Save and Generate Contract** | `/quote/{id}/details` shows heading `#{id} - Docs Download2496-006` and a roadside contract number (recorded) |
| 2 | [Pre-Condition] Open the Permaplate / Esthetic protection control, select the first product radio and the first enabled option → **Save**; on `/quote/{id}/details` record the Esthetic protection row, then click that row's cancel / remove action, confirm in the dialog if one appears, and reload `/quote/{id}/details` | After Save, record which branch occurred — **(a)** no contract number and no contract download link on the row, or **(b)** a contract number and/or a `permaplate-contract-download` link (record both). After the removal, the Esthetic protection row no longer shows an active product; record the action's label, and record whether any Esthetic protection contract number or `permaplate-contract-download` link is still shown on the page (with the contract number). Either outcome continues to step 3. If there is no product, record BLOCKED "dealer 1380 has no Permaplate product linked"; if there is no remove action, record BLOCKED "no remove action on the quote page" |
| 3 | Open the roadside contract's own download link; record its page count, its page-1 title, and whether any of the words in Test Data appear in it (which word, which page). Then click "Download all documents" and record the merged file's page count and per-page text | Both requests return HTTP 200 with `Content-Type` `application/pdf` |
| 4 | [Verification] In the merged file, locate the roadside pages (the run of pages starting at the roadside page-1 title, as many as the roadside page count from step 3). Search the remaining (non-roadside) pages for the words in Test Data and for any Esthetic protection contract number recorded in step 2 | The merged file contains every page of the roadside contract (page-1 title found; merged page count at least the roadside contract's). **If step 2 recorded no Esthetic protection contract number or download link remaining after the removal:** no non-roadside page contains `Permaplate`, `Esthetic protection` or `Protection esthétique` — judged PASS / FAIL. **If one remained:** record BLOCKED "saving a Permaplate product generated a contract that removing the product did not clear" with the contract number, and record (not judge) whether that contract's pages or number appear in the merged file. A word that appears only on roadside pages, and also appeared in the individual roadside PDF in step 3, is recorded, not failed |

---

### AP2496_007 — A cancelled warranty contract adds no page to the merged PDF, and the roadside contract is still merged

| Field | Value |
|---|---|
| **TC ID** | AP2496_007 |
| **Title** | A cancelled warranty contract adds no page to the merged PDF, and the roadside contract is still merged |
| **Requirement** | AP2496 — REQ-004, AC "Removed or cancelled items are never rendered" (warranty contract marked cancelled) |
| **Route** | `/quote/{id}/details` — quote page; the warranty contract's cancel screen (found at run time) |
| **Type** | Functional |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — (see Known blockers 1 and 2 — checked at run time) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | 🚫 BLOCKED — AP-2518: roadside contract cannot be generated on Dev; Q-006 still open |

**Why this matters:** A cancelled warranty handed to a client as if it were valid is a
compliance error. Whether the dealer or admin portal can cancel a warranty contract is not
known (Q-006); if neither can, this case is BLOCKED and the question goes to the developer.

**Test Data:**

| Variable | Value |
|---|---|
| Client last name | `Download2496-007` |
| Roadside stock number | `Download2496-007` |
| Warranty | First term radio on `/quote/{id}/warranty/edit` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal, open `/vehicle/915/details`, click **Create quote**, fill the client form with the shared client values (last name `Download2496-007`) → **Save**; at `/quote/{id}/vehicle` set Delivered at `2026-11-01`, Price `20000` → **Save**; then open Road Side Protection, fill the shared roadside values (stock number `Download2496-007`) → **Save and Generate Contract** | `/quote/{id}/details` shows heading `#{id} - Docs Download2496-007` and a roadside contract number (recorded) |
| 2 | [Pre-Condition] Click "Click here to create a warranty", select the first term radio → **Save**; then use the Warranty section's contract-generation control | The Warranty row shows a warranty contract number and its own download link (recorded). If no contract can be generated, record BLOCKED "no warranty contract generation on the quote page" |
| 3 | [Pre-Condition] Find the warranty contract on the dealer `/warranty` list, then in the Admin portal, and use its cancel action, confirming if asked | The warranty contract is shown as cancelled (status text recorded). If neither portal offers a cancel action, record BLOCKED "Q-006 — no screen marks a warranty contract cancelled" |
| 4 | Return to `/quote/{id}/details`, click "Download all documents", and record the merged file's page count and text | HTTP 200 with `Content-Type` `application/pdf`. Record whether the action is still shown and whether the quote page still lists the warranty contract |
| 5 | [Verification] Search the merged file for the warranty contract number and compare its pages with the roadside contract | The warranty contract number appears on no page of the merged file, and the roadside contract's page 1 title is found in it |

---

### AP2496_008 — Opening the download-all address directly for a quote with no contract causes no server error and returns no other quote's documents

| Field | Value |
|---|---|
| **TC ID** | AP2496_008 |
| **Title** | Opening the download-all address directly for a quote with no contract causes no server error and returns no other quote's documents |
| **Requirement** | AP2496 — REQ-002 / REQ-003 (negative, error guessing); record-only — no criterion states the response for a quote with nothing to download |
| **Route** | The "Download all documents" address read from a quote that shows the action, with another quote's id |
| **Type** | Negative |
| **Priority** | Medium |
| **Status** | FAIL |
| **Blocked by** | — |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | ❌ FAIL — /quote/6488/documents/download returned HTTP 500 (2/2); step 1 set-up blocked by AP-2518 |

**Why this matters:** Hiding the button does not stop a bookmarked or typed address. The
case fails only on an objective fault: an HTTP 5xx response, or a file carrying
documents of a quote other than the one in the address. An HTTP 4xx, a not-found or
access-denied page, a redirect or an empty response is a plausible correct answer for a
quote with nothing to download — it is recorded, never failed.

**Test Data:**

| Variable | Value |
|---|---|
| Quote with a contract — client last name | `Download2496-008A` |
| Quote with no contract — client last name | `Download2496-008B` |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal. Create quote A via `/vehicle/915/details` → **Create quote** with the shared client values (last name `Download2496-008A`), vehicle Delivered at `2026-11-01`, Price `20000`, and a roadside contract with the shared roadside values (stock number `Download2496-008A`) → **Save and Generate Contract** | Quote A's page shows a roadside contract number and a "Download all documents" action; quote A's id is recorded |
| 2 | [Pre-Condition] Create quote B the same way (last name `Download2496-008B`, vehicle saved) but add no product | Quote B's page `#{id} - Docs Download2496-008B` loads; quote B's id is recorded |
| 3 | Read the `href` of quote A's "Download all documents" action, replace quote A's id with quote B's id, and open that address | Record the HTTP status, the page or file returned, and its `Content-Type` |
| 4 | [Verification] Check the response for objective faults | Judged (FAIL only on these): the response is not an HTTP 5xx; and if a file is returned, no page in it names client `Docs Download2496-008A` or carries quote A's roadside contract number. Not judged: an HTTP 4xx, a not-found / access-denied / error page, a redirect or an empty response is recorded (status, page heading or redirect target) as the response for a quote with nothing to download — it is not a FAIL |

### AP2496_009 — Requesting the download-all address with another dealership's quote id — the response is recorded and causes no server error

| Field | Value |
|---|---|
| **TC ID** | AP2496_009 |
| **Title** | Requesting the download-all address with another dealership's quote id — the response is recorded and causes no server error |
| **Requirement** | AP2496 — REQ-003 (security, promoted at Gate B from review finding Pass 2 #1); record-only for Q-008 |
| **Route** | The "Download all documents" address read from a quote of dealer 1380, with another dealership's quote id |
| **Type** | Security |
| **Priority** | High |
| **Status** | BLOCKED |
| **Blocked by** | — (see Known blocker 4 — checked at run time) |
| **Executed on** | 2026-11-02 — Dev (v2dev) |
| **Result** | 🚫 BLOCKED — AP-2518 (step 1) and "no known quote id of another dealership" (step 2) |

**Why this matters:** If changing the number in the address returns another dealership's
documents, any dealer can read other dealerships' client contracts — names, addresses,
financing and insurance. The capture does not say what a dealer may access (Q-008), so the
case does not judge the response; it fails only on an HTTP 5xx, and a returned file that
holds another dealership's documents is recorded as a **security observation** for the
story comment.

**Test Data:**

| Variable | Value |
|---|---|
| Own quote — client last name | `Download2496-009` |
| Own quote — roadside stock number | `Download2496-009` |
| Other dealership | Any dealer on the Admin Esthetic protection contract list other than dealer 1380 ("Test QA staging") |

**Steps:**

| # | Action | Expected Result |
|---|---|---|
| 1 | [Pre-Condition] Sign in to the Dealer portal. Create a quote via `/vehicle/915/details` → **Create quote** with the shared client values (last name `Download2496-009`), vehicle Delivered at `2026-11-01`, Price `20000`, and a roadside contract with the shared roadside values (stock number `Download2496-009`) → **Save and Generate Contract** | The quote page shows a roadside contract number and a "Download all documents" action; record the action's `href` |
| 2 | [Pre-Condition] In the same browser, sign in to the Admin portal, open `/admin/permaplate-contracts`, pick a row whose Dealer is not dealer 1380, open its eye-icon details page `/admin/permaplate-contract/{id}` and record the quote id it shows, the dealer name and the client name | Another dealership's quote id, dealer and client are recorded. If no page shows a quote id, record BLOCKED "no known quote id of another dealership" |
| 3 | Back in the Dealer portal, open the `href` from step 1 with its quote id replaced by the other dealership's quote id | Record the HTTP status, the page or file returned, its `Content-Type`, and whether any page names the other dealership's client recorded in step 2 |
| 4 | [Verification] Check the response for objective faults | Judged (FAIL only on this): the response is not an HTTP 5xx. Not judged: an HTTP 4xx, an access-denied / not-found / error page, a redirect or an empty response is recorded (status, page heading or redirect target) for Q-008 — it is not a FAIL. If a PDF holding the other dealership's client documents is returned, record it as a security observation (with the quote id and client name) for Q-008 and the story comment |

---

## Coverage Matrix

_Which test cases check which requirement. A requirement with no test case beside it is
one we currently have no way of proving works._

| Requirement / AC | Functional | Negative | Edge-case | Regression |
|---|:---:|:---:|:---:|:---:|
| REQ-001 — Action shown with a generated contract | see AP2496_TestCases_001-005.md | | | |
| REQ-002 — Action hidden with nothing to download | — | AP2496_008 | — | — |
| REQ-003 — One PDF named with the quote id | — | AP2496_008, AP2496_009 | — | — |
| REQ-004 — Removed product excluded | AP2496_006 | — | — | — |
| REQ-004 — Cancelled warranty contract excluded | AP2496_007 | — | — | — |

---

## Execution Log

> _(Filled in by **stlc-manual-executor** after execution — do not edit manually)_

| TC ID | Result | Screenshot |
|---|:---:|---|
| AP2496_006 | BLOCKED | — |
| AP2496_007 | BLOCKED | — |
| AP2496_008 | FAIL | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_008-step4-DownloadAllQuoteB500_fail.png` |
| AP2496_009 | BLOCKED | `qa-artifacts/4-execution-results/screenshots/no-sprint/AP-2496/AP2496_009-step2-AdminContractNoQuoteId_blocked.png` |
